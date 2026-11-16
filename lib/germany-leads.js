export const recipients = () => [...new Set((process.env.GERMANY_TELEGRAM_CHAT_IDS || '').split(',').map(s => s.trim()).filter(Boolean))];
const key = id => `germany2027:pending:${id}`;

export async function redis(command) {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error('storage_not_configured');
  const response = await fetch(url, {
    method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command), signal: AbortSignal.timeout(5000),
  });
  const data = await response.json();
  if (!response.ok || data.error) throw new Error('storage_failed');
  return data.result;
}

export async function enqueue(id, text) {
  // HSET makes retries with the same submission ID safe before delivery.
  const chats = recipients();
  if (!chats.length) throw new Error('recipients_not_configured');
  const record = JSON.stringify({ id, text, createdAt: new Date().toISOString() });
  await Promise.all(chats.map(chat => redis(['HSET', key(chat), id, record])));
}

export async function pendingCount(chat) {
  return redis(['HLEN', key(chat)]);
}

export async function deliverPending(chat, limit = 5) {
  if (!recipients().includes(String(chat))) throw new Error('recipient_not_allowed');
  const lock = `germany2027:lock:${chat}`;
  const owner = crypto.randomUUID();
  if (await redis(['SET', lock, owner, 'NX', 'EX', 60]) !== 'OK') return 0;
  let delivered = 0;
  try {
    const entries = await redis(['HGETALL', key(chat)]);
    for (let i = 0; i < Math.min(entries.length, limit * 2); i += 2) {
      const record = typeof entries[i + 1] === 'string' ? JSON.parse(entries[i + 1]) : entries[i + 1];
      const token = process.env.GERMANY_TELEGRAM_BOT_TOKEN;
      if (!token) break;
      const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: String(chat), text: record.text }), signal: AbortSignal.timeout(5000),
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) break;
      // Delete only after Telegram acknowledges receipt. Failed messages stay queued.
      await redis(['HDEL', key(chat), entries[i]]);
      delivered++;
    }
  } finally {
    await redis(['EVAL', "if redis.call('get',KEYS[1]) == ARGV[1] then return redis.call('del',KEYS[1]) else return 0 end", 1, lock, owner]);
  }
  return delivered;
}
