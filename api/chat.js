// Vercel Edge Function — secure proxy to the Anthropic API.
// The API key lives ONLY in the ANTHROPIC_API_KEY environment variable
// (set it in Vercel → Project → Settings → Environment Variables), never in the
// client. The browser calls /api/chat (same origin); this streams Claude's
// SSE response straight back, so the front-end keeps its streaming UI.
export const config = { runtime: 'edge' };

const ALLOWED_ORIGINS = [
  'https://www.bridgeconsult.uz',
  'https://bridgeconsult.uz',
];
const MODEL = 'claude-haiku-4-5';   // site assistant — kept on Haiku for cost
const MAX_TOKENS = 800;

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }
  // Light abuse guard: only allow our own pages (same-origin POSTs send Origin).
  const origin = req.headers.get('origin');
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return new Response('Forbidden', { status: 403 });
  }

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return new Response('Server not configured', { status: 500 });

  let body;
  try { body = await req.json(); } catch { return new Response('Bad Request', { status: 400 }); }

  const messages = Array.isArray(body.messages) ? body.messages.slice(-10) : [];
  if (!messages.length) return new Response('Bad Request', { status: 400 });

  const upstream = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: typeof body.system === 'string' ? body.system : undefined,
      messages,
      stream: true,
    }),
  });

  if (!upstream.ok || !upstream.body) {
    return new Response('Upstream error', { status: 502 });
  }

  // Pass the SSE stream straight through to the browser.
  return new Response(upstream.body, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
