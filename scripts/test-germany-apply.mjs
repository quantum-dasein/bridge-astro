import { test } from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/germany-apply.js';
import webhook from '../api/germany-telegram.js';

const valid = { name: 'Test <name>', company: 'Test company', email: 'test@example.com', message: 'Programme enquiry', language: 'en' };
const request = (body = valid, origin = 'https://www.bridgeconsult.uz') => new Request('https://www.bridgeconsult.uz/api/germany-apply', {
  method: 'POST', headers: { origin, 'Content-Type': 'application/json' }, body: JSON.stringify(body),
});

test('persists blocked deliveries and drains only the approved recipient after Start', async () => {
  const previousFetch = globalThis.fetch;
  const names = ['GERMANY_TELEGRAM_BOT_TOKEN', 'GERMANY_TELEGRAM_CHAT_IDS', 'GERMANY_TELEGRAM_WEBHOOK_SECRET', 'KV_REST_API_URL', 'KV_REST_API_TOKEN'];
  const previousEnv = Object.fromEntries(names.map(n => [n, process.env[n]]));
  const queues = new Map();
  const locks = new Map();
  let available = false;
  let storageAvailable = true;
  const deliveries = [];
  try {
    Object.assign(process.env, {
      GERMANY_TELEGRAM_BOT_TOKEN: 'test-token', GERMANY_TELEGRAM_CHAT_IDS: '123,456',
      GERMANY_TELEGRAM_WEBHOOK_SECRET: 'test-secret', KV_REST_API_URL: 'https://storage.example', KV_REST_API_TOKEN: 'test',
    });
    globalThis.fetch = async (url, options) => {
      if (url === 'https://storage.example') {
        if (!storageAvailable) throw new Error('offline');
        const [command, key, a, b] = JSON.parse(options.body);
        let result;
        if (command === 'HSET') { if (!queues.has(key)) queues.set(key, new Map()); queues.get(key).set(a, b); result = 1; }
        else if (command === 'HGETALL') result = [...(queues.get(key) || [])].flat();
        else if (command === 'HDEL') result = queues.get(key)?.delete(a) ? 1 : 0;
        else if (command === 'HLEN') result = queues.get(key)?.size || 0;
        else if (command === 'SET') { result = locks.has(key) ? null : 'OK'; locks.set(key, a); }
        else if (command === 'EVAL') { locks.delete(b); result = 1; }
        else if (command === 'EXPIRE') result = 1;
        else throw new Error('Unexpected Redis command');
        return Response.json({ result });
      }
      assert.equal(url, 'https://api.telegram.org/bottest-token/sendMessage');
      if (available) deliveries.push(JSON.parse(options.body));
      return Response.json({ ok: available }, { status: available ? 200 : 400 });
    };
    const response = await handler(request(valid));
    assert.equal(response.status, 200);
    const accepted = await response.json();
    assert.equal(accepted.ok, true);
    assert.equal(queues.get('germany2027:pending:123').size, 1);
    assert.equal(queues.get('germany2027:pending:456').size, 1);
    assert.equal(deliveries.length, 0);
    const start = (id, secret = 'test-secret') => new Request('https://www.bridgeconsult.uz/api/germany-telegram', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-telegram-bot-api-secret-token': secret },
      body: JSON.stringify({ message: { chat: { id, type: 'private' }, text: '/start' } }),
    });
    const replay = (from, to, secret = 'test-secret') => new Request('https://www.bridgeconsult.uz/api/germany-telegram', {
      method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-telegram-bot-api-secret-token': secret },
      body: JSON.stringify({ from, to }),
    });
    assert.equal((await webhook(replay('123', '456', 'wrong'))).status, 403);
    assert.equal((await webhook(replay('123', '999'))).status, 400);
    assert.equal((await webhook(replay('123', '456'))).status, 200);
    assert.equal(queues.get('germany2027:pending:456').size, 1);
    available = true;
    assert.equal((await webhook(start(123, 'wrong'))).status, 403);
    assert.equal((await webhook(start(999))).status, 200);
    assert.equal(deliveries.length, 1);
    assert.ok(deliveries[0].text.includes('Ваш Telegram ID: 999'));
    assert.ok(!deliveries[0].text.includes('test@example.com'));
    deliveries.length = 0;
    assert.equal((await webhook(start(123))).status, 200);
    assert.equal(deliveries.length, 2);
    assert.equal(deliveries[1].chat_id, '123');
    assert.ok(deliveries[1].text.includes('test@example.com'));
    assert.equal(queues.get('germany2027:pending:123').size, 0);
    assert.equal(queues.get('germany2027:pending:456').size, 1);
    assert.equal((await webhook(start(123))).status, 200);
    assert.equal(deliveries.length, 3);
    assert.equal((await webhook(start(456))).status, 200);
    assert.equal(deliveries.length, 5);
    storageAvailable = false;
    assert.equal((await handler(request(valid))).status, 503);
  } finally {
    globalThis.fetch = previousFetch;
    for (const n of names) { if (previousEnv[n] === undefined) delete process.env[n]; else process.env[n] = previousEnv[n]; }
  }
});

test('rejects invalid requests before contacting Telegram', async () => {
  assert.equal((await handler(new Request('https://www.bridgeconsult.uz/api/germany-apply'))).status, 405);
  assert.equal((await handler(request(valid, 'https://untrusted.example'))).status, 403);
  for (const body of [null, [], {}, { ...valid, email: 'invalid' }, { ...valid, name: 123 }, { ...valid, message: 'a'.repeat(1801) }]) {
    assert.equal((await handler(request(body))).status, 400);
  }
  assert.equal((await handler(request({ ...valid, message: 'a'.repeat(11000) }))).status, 413);
});

