// Живой переводчик RU → UZ, продовая часть: приём фразы от преподавателя.
//
// Локальная версия (tools/translator/server.mjs) раздаёт субтитры через SSE и
// держит слушателей в памяти процесса. На Vercel так нельзя: функции живут
// секунды, а каждый запрос попадает в свой экземпляр — зритель, подключённый
// к одному, не увидит фразу, ушедшую в другой. Поэтому здесь фразы кладутся
// в общее хранилище (Upstash Redis через REST), а зрители забирают их опросом
// из api/tarjima/feed.js.
//
// Если преподаватель вставил API token Zoom, та же строка уходит и в сам
// звонок — субтитрами Zoom, без второго экрана у слушателей.
//
// Доступ закрыт ключом, а сверху ещё суточный лимит фраз: каждый вызов
// модели стоит денег, и утёкший ключ не должен превращаться в открытый счёт.
//
// Переменные окружения Vercel:
//   TARJIMA_KEY          — пароль преподавателя
//   ANTHROPIC_API_KEY    — ключ перевода
//   KV_REST_API_URL      — ставит интеграция Upstash
//   KV_REST_API_TOKEN    — ставит интеграция Upstash
//   TARJIMA_MODEL        — необязательно, по умолчанию claude-opus-5;
//                          claude-sonnet-5 примерно вдвое дешевле
//   TARJIMA_DAILY_LIMIT  — необязательно, фраз в сутки, по умолчанию 3000

export const config = { runtime: 'edge' };

import Anthropic from '@anthropic-ai/sdk';
import { findTerms } from '../../src/data/fidicGlossary.mjs';

const MODEL = process.env.TARJIMA_MODEL || 'claude-opus-5';
const DAILY_LIMIT = Number(process.env.TARJIMA_DAILY_LIMIT) || 3000;
const TTL = 21600; // 6 часов: занятие кончилось — след сам убрался
const CONTEXT_MAX = 3;

// $ за миллион токенов, вход и выход. Только для оценки стоимости занятия на
// странице преподавателя — счёт выставляет Anthropic, а не эта таблица.
const PRICES = {
  'claude-opus-5': [5, 25],
  'claude-sonnet-5': [2, 10],
  'claude-haiku-4-5': [1, 5],
  'claude-opus-4-8': [5, 25],
};

// Серверный откат на другую модель, если основная откажется переводить
// фразу. Включается только там, где он поддерживается.
const WITH_FALLBACKS = new Set(['claude-opus-5', 'claude-fable-5-1']);

const SYSTEM = `Ты переводишь в реальном времени лекцию по контрактам FIDIC. Слушатели — инженеры, контракт-менеджеры и юристы из Узбекистана; они читают перевод субтитрами.

Каждое сообщение — очередная фраза лектора на русском, распознанная автоматически: без пунктуации, иногда с ошибками распознавания, иногда оборванная на полуслове. Предыдущие фразы и твои переводы идут выше ради связности; переводить их заново не нужно.

Переведи последнюю фразу на узбекский язык латиницей (o‘, g‘). Расставь пунктуацию. Слово, явно искажённое распознаванием, переводи по смыслу контекста; оборванную фразу не достраивай. Номера пунктов (20.1, 3.7) и английские термины FIDIC, если лектор произносит их по-английски (Variation, Claim, EOT, IPC, DAAB, Taking-Over, Programme), оставляй как есть.

Ответ — только узбекский текст перевода.`;

const GLOSSARY_INTRO =
  '\n\nТермины из этой фразы. Используй эти узбекские соответствия, изменяя их по правилам узбекской грамматики:\n';

/**
 * Адрес и токен хранилища. Мастер подключения Upstash даёт переменным имена
 * в зависимости от выбранного префикса, поэтому одно жёстко заданное имя —
 * это лишняя буква в мастере и молча погасшие субтитры. Сначала стандартные
 * имена, потом поиск по виду значения: адрес REST у Upstash всегда
 * *.upstash.io, а токен лежит рядом под тем же префиксом.
 */
function store() {
  const env = process.env;

  let url = env.KV_REST_API_URL || env.UPSTASH_REDIS_REST_URL;
  let token = env.KV_REST_API_TOKEN || env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) return { url, token };

  const isRest = (v) => typeof v === 'string' && /^https:\/\/[\w.-]+\.upstash\.io\/?$/.test(v.trim());
  const found = Object.entries(env).find(([n, v]) => isRest(v) && !n.includes('READ_ONLY'));
  if (!found) return { url: null, token: null };

  // «FOO_URL» → «FOO_», дальше ищем токен под тем же префиксом.
  const prefix = found[0].replace(/URL$/, '');
  token =
    token ||
    Object.entries(env).find(
      ([n, v]) => v && n.startsWith(prefix) && n.endsWith('TOKEN') && !n.includes('READ_ONLY'),
    )?.[1] ||
    null;

  return { url: found[1].trim().replace(/\/$/, ''), token };
}

/** Несколько команд одним HTTP-запросом: меньше задержка до субтитра. */
async function pipeline(commands) {
  const { url, token } = store();
  if (!url || !token) throw new Error('KV не подключён: нет KV_REST_API_URL / KV_REST_API_TOKEN');
  const res = await fetch(`${url}/pipeline`, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: JSON.stringify(commands),
  });
  if (!res.ok) throw new Error(`KV ${res.status}: ${(await res.text()).slice(0, 160)}`);
  return (await res.json()).map((r) => r.result);
}

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

/** Последние фразы с их переводами — от страницы преподавателя, в порядке речи. */
function cleanContext(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((c) => c && typeof c.ru === 'string' && typeof c.uz === 'string' && c.ru.trim() && c.uz.trim())
    .slice(-CONTEXT_MAX)
    .map((c) => ({ ru: c.ru.trim().slice(0, 400), uz: c.uz.trim().slice(0, 600) }));
}

// ——— Zoom ———
//
// Организатор в звонке: «Показать субтитры» → «Настроить ручного
// титровальщика» → «Копировать API token». Это адрес вида
// https://wmcc.zoom.us/closedcaption?id=…&signature=…; строки субтитров
// отправляются на него POST-запросами text/plain с растущим seq.
//
// Шлём с сервера, а не из браузера: так адрес проверяется, и функцию нельзя
// заставить отправлять запросы куда попало.

/** Разбирает вставленный токен. null — поле пустое; { error } — вставлено не то. */
function zoomTarget(raw) {
  if (typeof raw !== 'string' || !raw.trim()) return null;
  let u;
  try {
    u = new URL(raw.trim());
  } catch {
    return { error: 'это не ссылка — скопируйте API token в Zoom ещё раз' };
  }
  const id = u.searchParams.get('id');
  if (u.protocol !== 'https:' || !/(^|\.)zoom\.us$/.test(u.hostname) || u.pathname !== '/closedcaption' || !id)
    return { error: 'это не API token субтитров Zoom' };
  u.searchParams.delete('seq');
  u.searchParams.delete('lang');
  // У каждого сессионного зала свой адрес (subconfid) — и свой счёт seq.
  return { url: u.toString(), seqKey: `tarjima:zoomseq:${id}:${u.searchParams.get('subconfid') ?? ''}` };
}

async function sendToZoom(target, seq, text) {
  const post = (lang) => {
    const u = new URL(target.url);
    u.searchParams.set('seq', String(seq));
    if (lang) u.searchParams.set('lang', lang);
    return fetch(u, {
      method: 'POST',
      headers: { 'content-type': 'text/plain; charset=utf-8' },
      body: text,
    });
  };

  let res = await post('uz-UZ');
  // Принимает ли Zoom код узбекского, в его документации не сказано. Если
  // запрос отвергнут не из-за того, что звонок не начат, — повторяем без кода.
  if (res.status === 400) {
    const reason = await res.text();
    if (!/not started/i.test(reason)) res = await post(null);
    else throw new Error('Zoom: звонок ещё не начат');
  }
  if (!res.ok) throw new Error(`Zoom ${res.status}: ${(await res.text()).slice(0, 120)}`);
}

let client;

async function translate(text, context) {
  if (!process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY не задан на сервере');
  // Субтитр, пришедший через 20 секунд, уже никому не нужен: короткий
  // таймаут и одна повторная попытка.
  client ??= new Anthropic({ timeout: 15_000, maxRetries: 1 });

  const terms = findTerms(text);
  const system = terms.length ? SYSTEM + GLOSSARY_INTRO + terms.map((t) => `${t.ru} — ${t.uz}`).join('\n') : SYSTEM;

  const messages = [];
  for (const c of context) messages.push({ role: 'user', content: c.ru }, { role: 'assistant', content: c.uz });
  messages.push({ role: 'user', content: text });

  const res = await client.beta.messages.create({
    model: MODEL,
    max_tokens: 4000,
    // Перевод короткой фразы не требует долгих размышлений, а каждая лишняя
    // секунда — это субтитр, отстающий от лектора.
    output_config: { effort: 'low' },
    ...(WITH_FALLBACKS.has(MODEL) && { betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' }),
    system,
    messages,
  });

  if (res.stop_reason === 'refusal') throw new Error('модель отказалась переводить эту фразу');
  const uz = res.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim();
  if (!uz) throw new Error('модель вернула пустой перевод');

  const [pin, pout] = PRICES[res.model] ?? PRICES[MODEL] ?? [0, 0];
  const cost = ((res.usage?.input_tokens ?? 0) * pin + (res.usage?.output_tokens ?? 0) * pout) / 1e6;
  return { uz, cost };
}

function describe(e) {
  if (e instanceof Anthropic.APIError) {
    const msg = e.error?.error?.message || e.message;
    return `Anthropic ${e.status ?? ''}: ${msg}`.slice(0, 300);
  }
  return String(e?.message ?? e).slice(0, 300);
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

  const room = String(body.room ?? 'main').replace(/[^a-z0-9_-]/gi, '').slice(0, 40) || 'main';

  // «Новое занятие»: убрать прежние фразы, чтобы пробы перед эфиром не
  // висели у слушателей в хвосте ленты.
  if (body.reset) {
    try {
      await pipeline([['DEL', `tarjima:${room}`]]);
    } catch (e) {
      return new Response('хранилище: ' + String(e.message ?? e), { status: 500 });
    }
    return json({ reset: true });
  }

  const text = String(body.text ?? '').trim().slice(0, 2000);
  if (!text) return new Response('empty', { status: 400 });

  const started = Date.now();
  const zoom = zoomTarget(body.zoom);
  const toZoom = zoom && !zoom.error ? zoom : null;

  // Счётчик — до вызова модели: лимит, проверяемый после, денег не бережёт.
  // Тем же запросом — номер строки для Zoom. Если хранилище недоступно,
  // занятие важнее счётчика.
  const dayKey = `tarjima:count:${new Date().toISOString().slice(0, 10)}`;
  const [count, zoomSeq] = await pipeline([
    ['INCR', dayKey],
    ['EXPIRE', dayKey, 172800],
    ...(toZoom ? [['INCR', toZoom.seqKey], ['EXPIRE', toZoom.seqKey, 86400]] : []),
  ])
    .then((r) => [r[0], toZoom ? r[2] : null])
    .catch(() => [null, null]);

  let uz = text;
  let cost = 0;
  let error = null;
  if (count !== null && count > DAILY_LIMIT) {
    error = `дневной лимит ${DAILY_LIMIT} фраз исчерпан`;
  } else {
    try {
      ({ uz, cost } = await translate(text, cleanContext(body.context)));
    } catch (e) {
      error = describe(e);
    }
  }

  // В ленту уходит признак «это не перевод», а не текст ошибки: слушателям
  // внутренности сервера ни к чему, а вот знать, что перед ними русский
  // оригинал, а не узбекский перевод, — обязательно.
  const line = { ru: text, uz: error ? text : uz, at: Date.now() };
  if (error) line.raw = true;

  // В Zoom пометки цветом нет — только текст, поэтому она словами.
  const zoomText = error ? `[rus tilida] ${text}` : uz;

  const key = `tarjima:${room}`;
  const [stored, zoomSent] = await Promise.allSettled([
    pipeline([
      ['RPUSH', key, JSON.stringify(line)],
      ['EXPIRE', key, TTL],
    ]),
    toZoom ? sendToZoom(toZoom, zoomSeq ?? Date.now(), zoomText) : Promise.resolve(),
  ]);

  const total = stored.status === 'fulfilled' ? stored.value[0] : null;
  const storeError = stored.status === 'rejected' ? String(stored.reason?.message ?? stored.reason) : null;
  const zoomError = zoom?.error ?? (zoomSent.status === 'rejected' ? String(zoomSent.reason?.message ?? zoomSent.reason) : null);

  // Преподавателю — подробности: ему чинить и считать.
  return json({
    ...line,
    ms: Date.now() - started,
    error,
    storeError,
    total,
    cost,
    count,
    limit: DAILY_LIMIT,
    zoom: toZoom ? (zoomError ? 'error' : 'ok') : zoom?.error ? 'error' : null,
    zoomError,
  });
}
