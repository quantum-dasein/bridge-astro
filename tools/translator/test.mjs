#!/usr/bin/env node
// Проверка api/tarjima/say.js без денег и без сети:
//
//   node tools/translator/test.mjs
//
// Поднимает поддельные Anthropic и Upstash на localhost и перехватывает
// запросы к *.zoom.us, затем гоняет через функцию все ветки: перевод,
// варианты моделей, куски с <начало>, порядок, лимит, нулевой баланс, отказ,
// Zoom, сброс. Проверяет, ЧТО функция отправляет модели и что кладёт в ленту.
import http from 'node:http';

const seen = [];
let mode = 'ok';
const anthropic = http.createServer(async (req, res) => {
  let body = '';
  for await (const c of req) body += c;
  const parsed = JSON.parse(body);
  seen.push({ url: req.url, headers: req.headers, body: parsed });
  res.setHeader('content-type', 'application/json');
  if (mode === 'fastLimited' && parsed.speed === 'fast') {
    res.writeHead(429, { 'retry-after': '1' });
    return res.end(JSON.stringify({ type: 'error', error: { type: 'rate_limit_error', message: 'fast mode limit' } }));
  }
  if (mode === 'credit') {
    res.writeHead(400);
    return res.end(JSON.stringify({ type: 'error', error: { type: 'invalid_request_error', message: 'Your credit balance is too low.' } }));
  }
  res.end(JSON.stringify({
    id: 'm', type: 'message', role: 'assistant', model: parsed.model,
    content: [{ type: 'text', text: mode === 'refusal' ? '' : 'Tarjima.' }],
    stop_reason: mode === 'refusal' ? 'refusal' : 'end_turn',
    usage: { input_tokens: 100, output_tokens: 10, cache_read_input_tokens: 1800 },
  }));
});

const kv = new Map();
const redis = http.createServer(async (req, res) => {
  let body = '';
  for await (const c of req) body += c;
  const out = JSON.parse(body).map(([cmd, key, ...args]) => {
    if (cmd === 'INCR') { kv.set(key, (kv.get(key) ?? 0) + 1); return { result: kv.get(key) }; }
    if (cmd === 'RPUSH') { const l = kv.get(key) ?? []; l.push(...args); kv.set(key, l); return { result: l.length }; }
    if (cmd === 'DEL') { kv.delete(key); return { result: 1 }; }
    return { result: 1 };
  });
  res.setHeader('content-type', 'application/json');
  res.end(JSON.stringify(out));
});

await new Promise((r) => anthropic.listen(0, r));
await new Promise((r) => redis.listen(0, r));

const zoomCalls = [];
let zoomMode = 'ok';
const realFetch = globalThis.fetch;
globalThis.fetch = async (input, init = {}) => {
  const url = String(input instanceof Request ? input.url : input);
  if (!url.includes('zoom.us')) return realFetch(input, init);
  const u = new URL(url);
  zoomCalls.push({ url: u, body: init.body });
  if (zoomMode === 'rejectLang' && u.searchParams.has('lang')) return new Response('invalid lang', { status: 400 });
  if (zoomMode === 'notStarted') return new Response('The meeting has not started', { status: 400 });
  return new Response('ok', { status: 200 });
};

process.env.ANTHROPIC_BASE_URL = `http://127.0.0.1:${anthropic.address().port}`;
process.env.ANTHROPIC_API_KEY = 'test';
process.env.KV_REST_API_URL = `http://127.0.0.1:${redis.address().port}`;
process.env.KV_REST_API_TOKEN = 'test';
process.env.TARJIMA_KEY = 'secret';
process.env.TARJIMA_DAILY_LIMIT = '1000';

const mod = await import(new URL('../../api/tarjima/say.js', import.meta.url));
const handler = mod.default;
const call = async (body) => {
  const r = await handler(new Request('http://x/api/tarjima/say', { method: 'POST', body: JSON.stringify(body) }));
  return { status: r.status, data: await r.json().catch(() => null) };
};
const lastLine = () => JSON.parse(kv.get('tarjima:main').at(-1));

let ok = 0, total = 0;
const check = (name, cond, extra = '') => { total++; ok += !!cond; console.log(cond ? 'OK  ' : 'FAIL', name, cond ? '' : extra); };

check('функция закреплена в iad1', JSON.stringify(mod.config?.regions) === '["iad1"]', JSON.stringify(mod.config));
check('неверный ключ → 401', (await call({ key: 'nope', text: 'x' })).status === 401);

// ——— подсказка и кэш ———
{
  const context = [
    { ru: 'сегодня разбираем претензии', uz: 'Bugun da’volarni ko‘rib chiqamiz.' },
    { ru: 'начнём с пункта 20.1', uz: '20.1-banddan boshlaymiz.' },
  ];
  const r = await call({ key: 'secret', text: 'подрядчик направил уведомление инженеру', context });
  const q = seen.at(-1);
  const sys = q.body.system;
  check('перевод вернулся и лёг в ленту без raw', r.data.uz === 'Tarjima.' && !lastLine().raw && !('error' in lastLine()), JSON.stringify(r.data));
  check('весь словарь в system, одним кэшируемым блоком', Array.isArray(sys) && sys.length === 1 && sys[0].cache_control?.type === 'ephemeral' && sys[0].text.includes('уведомление — xabarnoma') && sys[0].text.includes('штраф — jarima'));
  check('контекст — диалогом (5 сообщений)', q.body.messages.length === 5 && q.body.messages[1].role === 'assistant');
  check('термины куска — подсказкой после него', q.body.messages[4].content.startsWith('подрядчик направил уведомление инженеру\n\n<термины>'), q.body.messages[4].content);
  await call({ key: 'secret', text: 'совсем другая фраза про банковскую гарантию' });
  check('system одинаков для разных фраз (иначе кэш не сработает)', JSON.stringify(seen.at(-1).body.system) === JSON.stringify(sys));
  check('время модели и токены в ответе', typeof r.data.modelMs === 'number' && r.data.tokens?.cacheRead === 1800);
  await call({ key: 'secret', text: 'фраза', context: [null, { ru: 1 }, { ru: 'a', uz: '' }, 'x'] });
  check('мусорный контекст отброшен', seen.at(-1).body.messages.length === 1);
}

// ——— сбои ———
mode = 'credit';
{
  const r = await call({ key: 'secret', text: 'проверка баланса' });
  const l = lastLine();
  check('нет денег: понятная ошибка', /credit balance/.test(r.data.error ?? ''), r.data.error);
  check('нет денег: в ленте русский с raw, без текста ошибки', l.raw === true && l.uz === 'проверка баланса' && !('error' in l), JSON.stringify(l));
}
mode = 'refusal';
check('отказ модели → raw', /отказалась/.test((await call({ key: 'secret', text: 'x' })).data.error ?? ''));
mode = 'ok';

// ——— варианты моделей ———
let r = await call({ key: 'secret', text: 'фраза' });
let q = seen.at(-1);
check('по умолчанию opus-5, effort low, fallbacks', q.body.model === 'claude-opus-5' && q.body.output_config?.effort === 'low' && q.body.fallbacks === 'default' && r.data.model === 'claude-opus-5', JSON.stringify(q.body).slice(0, 200));

r = await call({ key: 'secret', text: 'фраза', model: 'claude-sonnet-5' });
q = seen.at(-1);
check('sonnet: без отката и без беты', q.body.model === 'claude-sonnet-5' && !q.body.fallbacks && !q.headers['anthropic-beta'] && q.body.output_config?.effort === 'low', JSON.stringify({ b: q.body.fallbacks, h: q.headers['anthropic-beta'] }));

r = await call({ key: 'secret', text: 'фраза', model: 'claude-haiku-4-5' });
q = seen.at(-1);
check('haiku: без effort (у неё его нет)', q.body.model === 'claude-haiku-4-5' && !q.body.output_config, JSON.stringify(q.body.output_config));

r = await call({ key: 'secret', text: 'фраза', model: 'claude-opus-5-fast' });
q = seen.at(-1);
check('fast: speed fast + бета, без отката', q.body.speed === 'fast' && String(q.headers['anthropic-beta']).includes('fast-mode-2026-02-01') && !q.body.fallbacks && r.data.fast === true, JSON.stringify({ s: q.body.speed, h: q.headers['anthropic-beta'] }));
check('fast: цена двойная', Math.abs(r.data.cost - (100 * 10 + 1800 * 0.1 * 10 + 10 * 50) / 1e6) < 1e-9, r.data.cost);

mode = 'fastLimited';
const n = seen.length;
r = await call({ key: 'secret', text: 'фраза', model: 'claude-opus-5-fast' });
check('fast упёрся в лимит → обычный режим', !r.data.raw && r.data.fast === false && seen.at(-1).body.speed === undefined && seen.length > n, JSON.stringify(r.data));
mode = 'ok';

r = await call({ key: 'secret', text: 'фраза', model: 'claude-fable-5-1' });
check('чужая модель не принимается → по умолчанию', seen.at(-1).body.model === 'claude-opus-5' && r.data.model === 'claude-opus-5');

// ——— куски ———
r = await call({ key: 'secret', text: 'в течение 28 дней', pending: ['подрядчик обязан направить уведомление'], context: [{ ru: 'начнём', uz: 'Boshlaymiz.' }] });
const content = seen.at(-1).body.messages.at(-1).content;
check('<начало> перед куском', content.startsWith('<начало>\nподрядчик обязан направить уведомление\n</начало>\n\nв течение 28 дней'), content);
check('термины ищутся и в <начало>', content.includes('уведомление — xabarnoma') && content.includes('Подрядчик — Pudratchi'), content);
check('system описывает <начало>', seen.at(-1).body.system[0].text.includes('<начало>'));
r = await call({ key: 'secret', text: 'x', pending: [1, null, 'a', 'b', 'c'] });
check('pending: мусор отброшен, не больше двух', seen.at(-1).body.messages.at(-1).content.startsWith('<начало>\nb c\n</начало>'), seen.at(-1).body.messages.at(-1).content);

// ——— порядок ———
await call({ key: 'secret', text: 'кусок', seq: 7, sid: 'ab12cd34', start: true });
let l = lastLine();
check('seq, sid, start в ленте', l.seq === 7 && l.sid === 'ab12cd34' && l.start === true, JSON.stringify(l));
await call({ key: 'secret', text: 'кусок', seq: -1, sid: '<script>', start: 'yes' });
l = lastLine();
check('мусорные seq/sid/start не попадают в ленту', !('seq' in l) && l.sid === 'script' && !('start' in l), JSON.stringify(l));

// ——— Zoom отдельным действием ———
const TOKEN = 'https://wmcc.zoom.us/closedcaption?id=200610693&signature=nYtX';
const before = seen.length;
r = await call({ key: 'secret', action: 'zoom', zoom: TOKEN, text: 'Pudratchi xabarnoma yubordi.' });
let z = zoomCalls.at(-1);
check('zoom: строка ушла, модель не вызывалась', r.data.zoom === 'ok' && z?.body === 'Pudratchi xabarnoma yubordi.' && seen.length === before, JSON.stringify(r.data));
check('zoom: seq=1, lang=uz-UZ, подпись цела', z.url.searchParams.get('seq') === '1' && z.url.searchParams.get('lang') === 'uz-UZ' && z.url.searchParams.get('signature') === 'nYtX', z.url.search);
await call({ key: 'secret', action: 'zoom', zoom: TOKEN, text: 'ikkinchi' });
check('zoom: seq растёт', zoomCalls.at(-1).url.searchParams.get('seq') === '2');
await call({ key: 'secret', action: 'zoom', zoom: TOKEN + '&subconfid=x', text: 'zal' });
check('zoom: у зала свой seq', zoomCalls.at(-1).url.searchParams.get('seq') === '1');
zoomMode = 'rejectLang';
r = await call({ key: 'secret', action: 'zoom', zoom: TOKEN, text: 'til' });
check('zoom: отверг lang → повтор без кода', r.data.zoom === 'ok' && !zoomCalls.at(-1).url.searchParams.has('lang'), JSON.stringify(r.data));
zoomMode = 'notStarted';
r = await call({ key: 'secret', action: 'zoom', zoom: TOKEN, text: 'erta' });
check('zoom: встреча не начата', r.data.zoom === 'error' && /не начат/.test(r.data.zoomError), JSON.stringify(r.data));
zoomMode = 'ok';
const zc = zoomCalls.length;
r = await call({ key: 'secret', action: 'zoom', zoom: 'https://zoom.us.evil.example/closedcaption?id=1', text: 'x' });
check('zoom: чужой адрес отвергнут', r.data.zoom === 'error' && zoomCalls.length === zc);
r = await call({ key: 'nope', action: 'zoom', zoom: TOKEN, text: 'x' });
check('zoom: без ключа — 401', r.status === 401);
r = await call({ key: 'secret', text: 'перевод', zoom: TOKEN });
check('перевод больше не шлёт в Zoom сам', zoomCalls.length === zc);

// ——— суточный лимит: счётчик до вызова модели ———
for (const k of kv.keys()) if (k.startsWith('tarjima:count:')) kv.set(k, 1000);
{
  const n = seen.length;
  const r = await call({ key: 'secret', text: 'сверх лимита' });
  check('лимит: ошибка и модель не вызывалась', /лимит 1000/.test(r.data.error ?? '') && seen.length === n, JSON.stringify(r.data));
}

// ——— «Новое занятие» ———
r = await call({ key: 'secret', reset: true });
check('сброс ленты', r.data.reset === true && !kv.has('tarjima:main'));

console.log(`\n${ok}/${total}`);
anthropic.close();
redis.close();
process.exitCode = ok === total ? 0 : 1;
