// Лента субтитров для слушателей.
//
// Опрос, а не SSE: на Vercel долгоживущее соединение не держится, а фраза,
// пришедшая в один экземпляр функции, не дойдёт до зрителя, подключённого к
// другому. Клиент помнит, сколько строк уже получил, и просит остаток.
//
// Одна команда Redis на опрос. При 1.5 секундах и десятке слушателей это
// ~24 тысячи чтений за двухчасовое занятие — бесплатного тарифа Upstash
// хватает с запасом.

export const config = { runtime: 'edge' };

async function redis(command) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) throw new Error('KV не подключён');
  const res = await fetch(url, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: JSON.stringify(command),
  });
  if (!res.ok) throw new Error(`KV ${res.status}`);
  return (await res.json()).result;
}

export default async function handler(req) {
  const url = new URL(req.url);
  const room = (url.searchParams.get('room') || 'main').replace(/[^a-z0-9_-]/gi, '').slice(0, 40) || 'main';
  const after = Math.max(0, Number(url.searchParams.get('after') ?? 0) || 0);

  try {
    // Новый зритель (after=0) получает только хвост: полная стенограмма с
    // начала занятия ему не нужна и на телефоне только мешает.
    const from = after === 0 ? -12 : after;
    const raw = (await redis(['LRANGE', `tarjima:${room}`, from, -1])) ?? [];
    const total = (await redis(['LLEN', `tarjima:${room}`])) ?? 0;

    const lines = raw
      .map((s) => {
        try {
          return JSON.parse(s);
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    return new Response(JSON.stringify({ lines, total }), {
      status: 200,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-store',
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ lines: [], total: after, error: String(e.message ?? e) }), {
      status: 200,
      headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
    });
  }
}
