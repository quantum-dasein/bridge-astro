// Dedicated Germany 2027 bot; credentials never enter the static build.
import { enqueue, deliverPending, recipients } from '../lib/germany-leads.js';
export const config = { runtime: 'edge' };
const origins = new Set(['https://www.bridgeconsult.uz', 'https://bridgeconsult.uz']);
const json = (status, body) => new Response(JSON.stringify(body), {
  status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
});

export default async function handler(req) {
  if (req.method !== 'POST') return json(405, { ok: false, error: 'method_not_allowed' });
  if (req.headers.get('origin') && !origins.has(req.headers.get('origin'))) {
    return json(403, { ok: false, error: 'forbidden' });
  }
  let body;
  try {
    const raw = await req.text();
    if (raw.length > 10000) return json(413, { ok: false, error: 'too_large' });
    body = JSON.parse(raw);
    if (!body || Array.isArray(body) || typeof body !== 'object') throw new Error();
  } catch {
    return json(400, { ok: false, error: 'bad_request' });
  }
  const limits = { name: 160, company: 300, email: 254, message: 1800 };
  const values = {};
  for (const [key, limit] of Object.entries(limits)) {
    if (body[key] !== undefined && typeof body[key] !== 'string') return json(400, { ok: false, error: 'invalid_fields' });
    values[key] = (body[key] || '').trim();
    if (values[key].length > limit) return json(400, { ok: false, error: 'invalid_fields' });
  }
  if (!values.name || !values.company || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    return json(400, { ok: false, error: 'missing_fields' });
  }
  const id = typeof body.submission_id === 'string' && /^[0-9a-f-]{36}$/i.test(body.submission_id)
    ? body.submission_id : crypto.randomUUID();
  const text = [
    '🔔 Новая заявка — Германия 2027',
    `Имя: ${values.name}`, `Организация / должность: ${values.company}`,
    `Email: ${values.email}`, `Интересующие темы: ${values.message || 'Не указаны'}`,
    `Язык страницы: ${({ en: 'EN', de: 'DE', uz: 'UZ' })[body.language] || 'RU'}`,
    'Программа: 19–26 апреля 2027, Галле / Лейпциг',
  ].join('\n\n');
  try {
    await enqueue(id, text);
  } catch {
    return json(503, { ok: false, error: 'storage_unavailable' });
  }
  // Durable acceptance does not depend on whether the recipients have started the bot.
  await Promise.allSettled(recipients().map(chat => deliverPending(chat, 1)));
  return json(200, { ok: true, id });
}
