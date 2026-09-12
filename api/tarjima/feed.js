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
async function pipeline(commands) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
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
