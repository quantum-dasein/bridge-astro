import { deliverPending, pendingCount, recipients, redis } from '../lib/germany-leads.js';
export const config = { runtime: 'edge' };
const json = (status, body) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

export default async function handler(req) {
  const secret = process.env.GERMANY_TELEGRAM_WEBHOOK_SECRET;
  if (!secret || req.headers.get('x-telegram-bot-api-secret-token') !== secret) return json(403, { ok: false });
  if (req.method === 'GET') {
    try {
      const pending = await Promise.all(recipients().map(async chat => ({ chat, count: await pendingCount(chat) })));
      const started = await redis(['HGETALL', 'germany2027:started']);
      return json(200, { ok: true, pending, started });
    } catch { return json(503, { ok: false }); }
  }
  // Authenticated repair operation: replay pending records only between approved recipients.
  if (req.method === 'PUT') {
    let body;
    try { body = await req.json(); } catch { return json(400, { ok: false }); }
    if (!recipients().includes(body?.from) || !recipients().includes(body?.to) || body.from === body.to) {
      return json(400, { ok: false });
    }
    try {
      const entries = await redis(['HGETALL', `germany2027:pending:${body.from}`]);
      for (let i = 0; i < entries.length; i += 2) {
        const value = typeof entries[i + 1] === 'string' ? entries[i + 1] : JSON.stringify(entries[i + 1]);
        await redis(['HSET', `germany2027:pending:${body.to}`, entries[i], value]);
      }
      const delivered = await deliverPending(body.to);
      return json(200, { ok: true, copied: entries.length / 2, delivered });
    } catch { return json(503, { ok: false }); }
  }
  if (req.method !== 'POST') return json(405, { ok: false });
  let update;
  try { update = await req.json(); } catch { return json(400, { ok: false }); }
  const chat = String(update?.message?.chat?.id || '');
  if (update?.message?.chat?.type !== 'private') return json(200, { ok: true });
  const approved = recipients().includes(chat);
  const start = /^\/start(?:\s|$)/.test(update.message.text || '');
  try {
    if (start) {
      await redis(['HSET', 'germany2027:started', chat, JSON.stringify({
        username: update.message.chat.username || null,
        approved,
        time: new Date().toISOString(),
      })]);
      await redis(['EXPIRE', 'germany2027:started', 86400]);
      const text = approved
        ? 'Получение заявок «Германия 2027» подключено. Сейчас проверю накопленные заявки.'
        : `Этот аккаунт пока не подключён к получению заявок.\n\nВаш Telegram ID: ${chat}\n\nПередайте этот ID тому, кто настраивает сайт. Заявки сохраняются на сервере.`;
      const response = await fetch(`https://api.telegram.org/bot${process.env.GERMANY_TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chat, text }), signal: AbortSignal.timeout(5000),
      });
      if (!response.ok || !(await response.json()).ok) return json(503, { ok: false });
    }
    if (!approved) return json(200, { ok: true });
    await deliverPending(chat);
    // Telegram retries this update until all queued messages have been delivered.
    if (await pendingCount(chat)) return json(503, { ok: false });
    return json(200, { ok: true });
  } catch { return json(503, { ok: false }); }
}
