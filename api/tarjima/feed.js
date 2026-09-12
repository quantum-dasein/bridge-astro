// Лента субтитров для слушателей.
//
// Опрос, а не SSE: на Vercel долгоживущее соединение не держится, а фраза,
// пришедшая в один экземпляр функции, не дойдёт до зрителя, подключённого к
// другому. Зритель помнит, сколько строк уже показал, и отбрасывает лишнее.
//
// Ответ намеренно одинаков для всех: никаких параметров вроде ?after=,
// всегда последние TAIL строк и общее число. Одинаковый ответ — один ключ
// кэша, поэтому CDN отдаёт его всем слушателям сам, а до Redis доходит
// примерно один запрос в две секунды независимо от того, десять человек на
// занятии или триста. На бесплатном тарифе Upstash (10 тысяч команд в
// сутки) поштучный опрос кончился бы посреди лекции.
//
// Если кэш почему-то не сработает, всё продолжит работать — просто команд
// уйдёт больше.

export const config = { runtime: 'edge' };

const TAIL = 20; // при опросе раз в 2 с столько фраз наговорить невозможно

/** Обе команды одним HTTP-запросом: меньше задержка. */
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

async function pipeline(commands) {
  const { url, token } = store();
  if (!url || !token) throw new Error('KV не подключён');
  const res = await fetch(`${url}/pipeline`, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: JSON.stringify(commands),
  });
  if (!res.ok) throw new Error(`KV ${res.status}`);
  return (await res.json()).map((r) => r.result);
}

function answer(body, cache) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      // max-age=0 — браузер каждый раз спрашивает заново;
      // s-maxage=2 — CDN отвечает ему из своей копии, не трогая Redis.
      'cache-control': cache ? 'public, max-age=0, s-maxage=2, stale-while-revalidate=4' : 'no-store',
      'cdn-cache-control': cache ? 'max-age=2' : 'no-store',
    },
  });
}

export default async function handler(req) {
  const url = new URL(req.url);
  const room = (url.searchParams.get('room') || 'main').replace(/[^a-z0-9_-]/gi, '').slice(0, 40) || 'main';

  try {
    const key = `tarjima:${room}`;
    const [raw, total] = await pipeline([
      ['LRANGE', key, -TAIL, -1],
      ['LLEN', key],
    ]);

    const lines = (raw ?? [])
      .map((s) => {
        try {
          return JSON.parse(s);
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    return answer({ lines, total: total ?? 0 }, true);
  } catch (e) {
    // Ошибку не кэшируем: подключат хранилище — лента оживёт сразу.
    return answer({ lines: [], total: 0, error: String(e.message ?? e) }, false);
  }
}
