// Живой переводчик RU → UZ, продовая часть: приём фразы от преподавателя.
//
// Локальная версия (tools/translator/server.mjs) раздаёт субтитры через SSE и
// держит слушателей в памяти процесса. На Vercel так нельзя: функции живут
// секунды, а каждый запрос попадает в свой экземпляр — зритель, подключённый
// к одному, не увидит фразу, ушедшую в другой. Поэтому здесь фразы кладутся
// в общее хранилище (Upstash Redis через REST), а зрители забирают их опросом
// из api/tarjima/feed.js.
//
// Три действия:
//   перевод (по умолчанию) — фраза → модель → лента;
//   action: 'zoom'         — готовая строка → субтитры в сам звонок Zoom.
//                            Отдельно от перевода: куски переводятся
//                            параллельно, а в Zoom должны уйти по порядку, и
//                            порядок знает только страница преподавателя;
//   reset: true            — «Новое занятие», очистить ленту.
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
//   TARJIMA_MODEL        — необязательно, один из ключей VARIANTS ниже;
//                          по умолчанию claude-sonnet-5
//   TARJIMA_DAILY_LIMIT  — необязательно, фраз в сутки, по умолчанию 5000

// Функция работает в Вашингтоне, рядом с хранилищем Upstash (iad1) и с API
// Anthropic. Без этого она запускалась бы рядом со слушателем и каждый
// внутренний шаг — счётчик, модель, запись в ленту — ходил бы через океан:
// лишние полсекунды на каждой фразе. Дальний путь остаётся один — от
// браузера до функции.
export const config = { runtime: 'edge', regions: ['iad1'] };

import Anthropic from '@anthropic-ai/sdk';
import { TERMS, findTerms } from '../../src/data/fidicGlossary.mjs';

// Варианты модели. price — $ за миллион токенов, вход и выход; только для
// оценки стоимости на странице преподавателя, счёт выставляет Anthropic.
const VARIANTS = {
  'claude-opus-5': { model: 'claude-opus-5', effort: 'low', fallbacks: true, price: [5, 25] },
  // Тот же Opus, но генерирует до 2.5 раза быстрее — за двойную цену.
  'claude-opus-5-fast': { model: 'claude-opus-5', effort: 'low', fast: true, price: [10, 50] },
  'claude-sonnet-5': { model: 'claude-sonnet-5', effort: 'low', price: [2, 10] },
  // У Haiku нет параметра effort; кэш у неё начинается с 4096 токенов, наша
  // постоянная часть короче — поэтому она читает её всякий раз целиком.
  'claude-haiku-4-5': { model: 'claude-haiku-4-5', price: [1, 5] },
};
// По умолчанию Sonnet 5. Замер 22.09.2026 (tools/translator/eval.mjs, 10 фраз
// лекции): модель отвечает за 1.9 с против 3.1 с у Opus 5, стоит в 2.5 раза
// дешевле, переводы на этой выборке сопоставимы. Быстрый режим Opus почти не
// ускорил (3.1 с); Haiku быстрее всех (1.0 с), но делает грамматические
// ошибки. Вернуть Opus — TARJIMA_MODEL=claude-opus-5 в Vercel.
const DEFAULT_VARIANT = VARIANTS[process.env.TARJIMA_MODEL] ? process.env.TARJIMA_MODEL : 'claude-sonnet-5';

const DAILY_LIMIT = Number(process.env.TARJIMA_DAILY_LIMIT) || 5000;
const TTL = 21600; // 6 часов: занятие кончилось — след сам убрался
const CONTEXT_MAX = 4;
const PENDING_MAX = 2;

// Инструкция и весь словарь одинаковы для каждой фразы, поэтому идут одним
// кэшируемым блоком: на занятии фразы следуют каждые пару секунд, кэш не
// остывает, и каждая следующая читает этот блок за десятую часть цены и
// быстрее. Всё, что меняется от фразы к фразе, — только в сообщениях: если
// сюда попадёт что-то переменное, кэш молча перестанет срабатывать.
const SYSTEM = `Ты переводишь в реальном времени лекцию по контрактам FIDIC. Слушатели — инженеры, контракт-менеджеры и юристы из Узбекистана; они читают перевод субтитрами.

Речь переводится кусками по мере того, как лектор говорит, поэтому кусок часто — начало или середина предложения. Текст распознан автоматически: без пунктуации, иногда с ошибками распознавания. Предыдущие куски и твои переводы идут выше ради связности; переводить их заново не нужно.

Переведи последний кусок на узбекский язык латиницей (o‘, g‘) так, чтобы он продолжал уже переведённое. Расставь пунктуацию. Слово, явно искажённое распознаванием, переводи по смыслу контекста. Незаконченную мысль не достраивай: переведи ровно то, что сказано. Номера пунктов и числа (20.1, 3.7, 28 дней) сохраняй цифрами.

Термин, сказанный по-русски, переводи узбекским термином из словаря и не заменяй английским: «уведомление о претензии» — da’vo to‘g‘risidagi xabarnoma, а не Notice of Claim. Английское название можно добавить в скобках: qaror (Determination).

Термин, который лектор произнёс по-английски, оставляй по-английски: Variation, Claim, EOT, IPC, DAAB, Taking-Over, Programme, FIDIC. Распознавание часто записывает такие слова русскими буквами — «вариэйшн», «клейм», «дааб», «иписи», «и о ти», «фидик», «тейкинг овер», — восстанавливай их и пиши по-английски. Книги FIDIC называй по-английски: Red Book, Yellow Book, Silver Book, Pink Book, Green Book, Emerald Book.

Служебные блоки в сообщении не переводи и не упоминай:
<начало> — слова лектора прямо перед этим куском, перевод которых ещё не готов; они только для понимания, с чего началось предложение;
<термины> — какие термины словаря прозвучали в куске.

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

/** Последние куски с их переводами — от страницы преподавателя, в порядке речи. */
function cleanContext(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((c) => c && typeof c.ru === 'string' && typeof c.uz === 'string' && c.ru.trim() && c.uz.trim())
    .slice(-CONTEXT_MAX)
    .map((c) => ({ ru: c.ru.trim().slice(0, 400), uz: c.uz.trim().slice(0, 600) }));
}

/** Куски, отправленные раньше этого и ещё не переведённые. */
function cleanPending(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((s) => typeof s === 'string' && s.trim())
    .slice(-PENDING_MAX)
    .map((s) => s.trim().slice(0, 400));
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

async function zoomAction(body) {
  const target = zoomTarget(body.zoom);
  if (!target) return json({ zoom: null });
  if (target.error) return json({ zoom: 'error', zoomError: target.error });
  const text = String(body.text ?? '').trim().slice(0, 2000);
  if (!text) return new Response('empty', { status: 400 });

  let seq;
  try {
    [seq] = await pipeline([
      ['INCR', target.seqKey],
      ['EXPIRE', target.seqKey, 86400],
    ]);
  } catch {
    seq = Date.now(); // без хранилища — хотя бы растущее число
  }
  try {
    await sendToZoom(target, seq, text);
    return json({ zoom: 'ok' });
  } catch (e) {
    return json({ zoom: 'error', zoomError: String(e.message ?? e) });
  }
}

// ——— Перевод ———

let client;

async function translate(text, context, pending, variantName) {
  if (!process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY не задан на сервере');
  const v = VARIANTS[variantName];
  // Субтитр, пришедший через 15 секунд, уже никому не нужен: короткий
  // таймаут и одна повторная попытка.
  client ??= new Anthropic({ timeout: 12_000, maxRetries: 1 });

  const messages = [];
  for (const c of context) messages.push({ role: 'user', content: c.ru }, { role: 'assistant', content: c.uz });

  // Какие термины словаря прозвучали — рядом с куском: словарь длинный, и
  // прямая подсказка надёжнее, чем надежда, что модель сама сопоставит падеж.
  const terms = findTerms([...pending, text].join(' '));
  let content = text;
  if (pending.length) content = `<начало>\n${pending.join(' ')}\n</начало>\n\n${content}`;
  if (terms.length)
    content += `\n\n<термины>\n${terms.map((t) => `${t.ru} — ${t.uz}${t.en ? ` (${t.en})` : ''}`).join('\n')}\n</термины>`;
  messages.push({ role: 'user', content });

  const request = (fast) => {
    const betas = [];
    if (v.fallbacks) betas.push('server-side-fallback-2026-07-01');
    if (fast) betas.push('fast-mode-2026-02-01');
    const params = {
      model: v.model,
      max_tokens: 4000,
      system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
      messages,
      // Перевод короткого куска не требует долгих размышлений, а каждая
      // лишняя секунда — это субтитр, отстающий от лектора.
      ...(v.effort && { output_config: { effort: v.effort } }),
      ...(v.fallbacks && { fallbacks: 'default' }),
      ...(fast && { speed: 'fast' }),
    };
    return betas.length ? client.beta.messages.create({ ...params, betas }) : client.messages.create(params);
  };

  let res;
  let fastUsed = !!v.fast;
  try {
    res = await request(fastUsed);
  } catch (e) {
    // У быстрого режима свой лимит запросов: упёрлись — переводим обычным.
    if (!(fastUsed && e instanceof Anthropic.RateLimitError)) throw e;
    fastUsed = false;
    res = await request(false);
  }

  if (res.stop_reason === 'refusal') throw new Error('модель отказалась переводить этот кусок');
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
  const [pin, pout] = fastUsed ? v.price : VARIANTS[v.fast ? 'claude-opus-5' : variantName].price;
  const cost = ((tokens.in + tokens.cacheWrite * 1.25 + tokens.cacheRead * 0.1) * pin + tokens.out * pout) / 1e6;
  return { uz, cost, tokens, fast: fastUsed };
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

  if (body.action === 'zoom') return zoomAction(body);

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

  // Модель можно переопределить на запрос — только из списка VARIANTS: так
  // eval.mjs сравнивает модели на одном и том же проде.
  const variant = VARIANTS[body.model] ? body.model : DEFAULT_VARIANT;

  // Порядок кусков: страница преподавателя шлёт их параллельно, ответы
  // могут прийти не по порядку. Номер и сессия едут в ленту, и страница
  // слушателя расставляет куски сама. start — первый кусок нового
  // высказывания: там слушатель начинает новый абзац.
  const seq = Number.isInteger(body.seq) && body.seq >= 0 ? body.seq : undefined;
  const sid = typeof body.sid === 'string' ? body.sid.replace(/[^a-z0-9]/gi, '').slice(0, 16) || undefined : undefined;

  const started = Date.now();

  // Счётчик — до вызова модели: лимит, проверяемый после, денег не бережёт.
  // Функция стоит рядом с хранилищем, так что это миллисекунды. Если
  // хранилище недоступно, занятие важнее счётчика.
  const dayKey = `tarjima:count:${new Date().toISOString().slice(0, 10)}`;
  const count = await pipeline([
    ['INCR', dayKey],
    ['EXPIRE', dayKey, 172800],
  ])
    .then((r) => r[0])
    .catch(() => null);

  let uz = text;
  let cost = 0;
  let tokens = null;
  let fast = false;
  let error = null;
  const modelStarted = Date.now();
  if (count !== null && count > DAILY_LIMIT) {
    error = `дневной лимит ${DAILY_LIMIT} фраз исчерпан`;
  } else {
    try {
      ({ uz, cost, tokens, fast } = await translate(text, cleanContext(body.context), cleanPending(body.pending), variant));
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
  if (seq !== undefined) line.seq = seq;
  if (sid) line.sid = sid;
  if (body.start === true) line.start = true;

  let total = null;
  let storeError = null;
  try {
    const key = `tarjima:${room}`;
    [total] = await pipeline([
      ['RPUSH', key, JSON.stringify(line)],
      ['EXPIRE', key, TTL],
    ]);
  } catch (e) {
    storeError = String(e.message ?? e);
  }

  // Преподавателю — подробности: ему чинить и считать. modelMs отделяет
  // время модели от остального; region показывает, где отработала функция.
  return json({
    ...line,
    ms: Date.now() - started,
    modelMs,
    error,
    storeError,
    total,
    cost,
    tokens,
    model: variant,
    fast,
    region: process.env.VERCEL_REGION ?? null,
    count,
    limit: DAILY_LIMIT,
  });
}
