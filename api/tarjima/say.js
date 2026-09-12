// Живой переводчик RU → UZ, продовая часть: приём фразы от преподавателя.
//
// Локальная версия (tools/translator/server.mjs) раздаёт субтитры через SSE и
// держит слушателей в памяти процесса. На Vercel так нельзя: функции живут
// секунды, а каждый запрос попадает в свой экземпляр — зритель, подключённый
// к одному, не увидит фразу, ушедшую в другой. Поэтому здесь фразы кладутся
// в общее хранилище (Upstash Redis через REST, без зависимостей), а зрители
// забирают их опросом из api/tarjima/feed.js.
//
// Доступ закрыт ключом: каждый вызов стоит денег, открытую ручку зальют
// мусором за час.
//
// Переменные окружения Vercel:
//   TARJIMA_KEY        — пароль преподавателя
//   ANTHROPIC_API_KEY  — ключ перевода
//   KV_REST_API_URL    — ставит интеграция Upstash
//   KV_REST_API_TOKEN  — ставит интеграция Upstash
//   TARJIMA_MODEL      — необязательно, по умолчанию claude-sonnet-5

export const config = { runtime: 'edge' };

import glossary from '../../src/data/fidicGlossary.mjs';

const MODEL = process.env.TARJIMA_MODEL || 'claude-sonnet-5';
const TTL = 21600; // 6 часов: занятие кончилось — след сам убрался

// Длинные термины первыми: «Продление срока завершения» должно сработать
// раньше, чем «Продление срока».
const TERMS = [...glossary].sort((a, b) => b.ru.length - a.ru.length);

async function redis(command) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) throw new Error('KV не подключён: нет KV_REST_API_URL / KV_REST_API_TOKEN');
  const res = await fetch(url, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: JSON.stringify(command),
  });
  if (!res.ok) throw new Error(`KV ${res.status}: ${(await res.text()).slice(0, 160)}`);
  return (await res.json()).result;
}

/** Только те термины, что реально встретились: иначе подсказка раздувается. */
function relevant(text) {
  const low = text.toLowerCase();
  const hits = [];
  for (const t of TERMS) {
    if (t.ru.length < 4) continue;
    if (low.includes(t.ru.toLowerCase())) hits.push(t);
    if (hits.length >= 25) break;
  }
  return hits;
}

/** Запасной перевод: подстановка терминов. Субтитры не должны гаснуть. */
function byGlossary(text) {
  let out = text;
  for (const t of TERMS) {
    if (t.ru.length < 4) continue;
    out = out.replaceAll(t.ru, t.uz);
    out = out.replaceAll(t.ru.charAt(0).toUpperCase() + t.ru.slice(1), t.uz);
  }
  return out;
}

async function translate(text) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return byGlossary(text);

  const terms = relevant(text);
  const block = terms.length
    ? '\n\nОбязательный глоссарий (термины BRIDGE Consult, отклоняться нельзя):\n' +
      terms.map((t) => `${t.ru} = ${t.uz}`).join('\n')
    : '';

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1000,
      system:
        'Ты синхронный переводчик на лекции по контрактам FIDIC для строителей и юристов Узбекистана. ' +
        'Переводишь с русского на узбекский (латиница). ' +
        'Правила: переводи только присланную реплику, ничего не добавляй и не комментируй; ' +
        'сохраняй номера пунктов и англоязычные термины контракта (Variation, EOT, Claim, IPC, DAAB, Taking-Over) как есть; ' +
        'если фраза оборвана на полуслове — переводи как есть, не додумывай окончание; ' +
        'в ответе только перевод, без кавычек и пояснений.' +
        block,
      messages: [{ role: 'user', content: text }],
    }),
  });

  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${(await res.text()).slice(0, 160)}`);
  const data = await res.json();
  return (data.content?.[0]?.text ?? '').trim();
}

export default async function handler(req) {
  if (req.method !== 'POST') return new Response('method not allowed', { status: 405 });

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response('bad json', { status: 400 });
  }

  const expected = process.env.TARJIMA_KEY;
  if (!expected) return new Response('TARJIMA_KEY не задан на сервере', { status: 500 });
  if (body.key !== expected) return new Response('неверный ключ', { status: 401 });

  const text = String(body.text ?? '').trim().slice(0, 2000);
  if (!text) return new Response('empty', { status: 400 });
  const room = String(body.room ?? 'main').replace(/[^a-z0-9_-]/gi, '').slice(0, 40) || 'main';

  const started = Date.now();
  let uz;
  let error = null;
  try {
    uz = await translate(text);
  } catch (e) {
    error = String(e.message ?? e);
    uz = byGlossary(text); // сбой модели не должен гасить субтитры
  }

  const line = { ru: text, uz, ms: Date.now() - started, at: Date.now(), error };

  let total = null;
  try {
    const key = `tarjima:${room}`;
    total = await redis(['RPUSH', key, JSON.stringify(line)]);
    await redis(['EXPIRE', key, TTL]);
  } catch (e) {
    // Перевод показываем преподавателю даже если хранилище отвалилось —
    // он хотя бы увидит, что распознавание живо.
    line.storeError = String(e.message ?? e);
  }

  return new Response(JSON.stringify({ ...line, total }), {
    status: 200,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}
