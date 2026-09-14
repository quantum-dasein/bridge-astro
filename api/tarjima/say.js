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
// Точность и скорость меряет tools/translator/eval.mjs.
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
import { TERMS, findTerms } from '../../src/data/fidicGlossary.mjs';

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

// Инструкция и весь словарь одинаковы для каждой фразы, поэтому идут одним
// кэшируемым блоком: на занятии фразы следуют каждые несколько секунд, кэш
// не остывает, и каждая следующая фраза читает этот блок за десятую часть
// цены и быстрее. Всё, что меняется от фразы к фразе, — только в сообщениях.
const SYSTEM = `Ты переводишь в реальном времени лекцию по контрактам FIDIC. Слушатели — инженеры, контракт-менеджеры и юристы из Узбекистана; они читают перевод субтитрами.

Каждое сообщение — очередная фраза лектора на русском, распознанная автоматически: без пунктуации, иногда с ошибками распознавания, иногда оборванная на полуслове. Предыдущие фразы и твои переводы идут выше ради связности; переводить их заново не нужно.

Переведи последнюю фразу на узбекский язык латиницей (o‘, g‘). Расставь пунктуацию. Слово, явно искажённое распознаванием, переводи по смыслу контекста; оборванную фразу не достраивай. Номера пунктов и числа (20.1, 3.7, 28 дней) сохраняй цифрами.

Английские термины FIDIC оставляй по-английски: Variation, Claim, EOT, IPC, DAAB, Taking-Over, Programme, Notice of Claim, FIDIC. Распознавание часто записывает их русскими буквами — «вариэйшн», «клейм», «дааб», «иписи», «и о ти», «фидик», «тейкинг овер», — восстанавливай такой термин и пиши по-английски. Книги FIDIC тоже называй по-английски: Red Book, Yellow Book, Silver Book, Pink Book, Green Book, Emerald Book.

После фразы может идти блок <термины> — это подсказка, какие термины словаря в ней прозвучали. Саму подсказку не переводи и не упоминай.

Ответ — только узбекский текст перевода.

Словарь BRIDGE Consult. Если термин прозвучал, используй это узбекское соответствие, изменяя его по правилам узбекской грамматики:
${TERMS.map((t) => `${t.ru} — ${t.uz}${t.en ? ` (${t.en})` : ''}`).join('\n')}`;

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

  const messages = [];
  for (const c of context) messages.push({ role: 'user', content: c.ru }, { role: 'assistant', content: c.uz });

  // Какие термины словаря прозвучали — рядом с фразой: словарь длинный, и
  // прямая подсказка надёжнее, чем надежда, что модель сама сопоставит падеж.
  const terms = findTerms(text);
  messages.push({
    role: 'user',
    content: terms.length
      ? `${text}\n\n<термины>\n${terms.map((t) => `${t.ru} — ${t.uz}${t.en ? ` (${t.en})` : ''}`).join('\n')}\n</термины>`
      : text,
  });

  const res = await client.beta.messages.create({
    model: MODEL,
    max_tokens: 4000,
    // Перевод короткой фразы не требует долгих размышлений, а каждая лишняя
    // секунда — это субтитр, отстающий от лектора.
    output_config: { effort: 'low' },
    ...(WITH_FALLBACKS.has(MODEL) && { betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' }),
    system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
    messages,
  });

  if (res.stop_reason === 'refusal') throw new Error('модель отказалась переводить эту фразу');
  const uz = res.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim();
  if (!uz) throw new Error('модель вернула пустой перевод');

  // Кэш: запись дороже обычного входа в 1.25 раза, чтение — в 10 раз дешевле.
  const u = res.usage ?? {};
  const tokens = {
    in: u.input_tokens ?? 0,
    out: u.output_tokens ?? 0,
    cacheWrite: u.cache_creation_input_tokens ?? 0,
    cacheRead: u.cache_read_input_tokens ?? 0,
  };
  const [pin, pout] = PRICES[res.model] ?? PRICES[MODEL] ?? [0, 0];
  const cost = ((tokens.in + tokens.cacheWrite * 1.25 + tokens.cacheRead * 0.1) * pin + tokens.out * pout) / 1e6;
  return { uz, cost, tokens };
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
  let tokens = null;
  let error = null;
  const modelStarted = Date.now();
  if (count !== null && count > DAILY_LIMIT) {
    error = `дневной лимит ${DAILY_LIMIT} фраз исчерпан`;
  } else {
    try {
      ({ uz, cost, tokens } = await translate(text, cleanContext(body.context)));
    } catch (e) {
      error = describe(e);
    }
  }
  const modelMs = Date.now() - modelStarted;

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

  // Преподавателю — подробности: ему чинить и считать. modelMs отделяет
  // время модели от времени хранилища и Zoom — это нужно замеру скорости.
  return json({
    ...line,
    ms: Date.now() - started,
    modelMs,
    error,
    storeError,
    total,
    cost,
    tokens,
    model: MODEL,
    count,
    limit: DAILY_LIMIT,
    zoom: toZoom ? (zoomError ? 'error' : 'ok') : zoom?.error ? 'error' : null,
    zoomError,
  });
}
