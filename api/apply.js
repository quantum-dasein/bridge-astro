// Vercel Edge Function — приём заявок с лендингов: /summer-school-georgia-2026/,
// /academy/ и /contract-support/ (RU/EN/UZ).
//
// Заявка уходит в Telegram (по одному сообщению каждому получателю) и, если
// задан FORMSPREE_ID, дублируется на почту через Formspree. Токен бота живёт
// ТОЛЬКО в переменных окружения Vercel и никогда не попадает в браузер —
// на этом сайте уже был случай с ключом Anthropic в клиентском JS.
//
// Переменные окружения (Vercel → Settings → Environment Variables):
//   TELEGRAM_BOT_TOKEN — токен от @BotFather
//   TELEGRAM_CHAT_IDS  — id получателей через запятую
//   FORMSPREE_ID       — необязательно; пока не задан, дублирования на почту нет
//
// ВАЖНО: Telegram не даёт боту написать первым. Получатель, который не нажал
// Start у бота, даёт "chat not found" — это не баг функции.
export const config = { runtime: 'edge' };

const ALLOWED_ORIGINS = [
  'https://www.bridgeconsult.uz',
  'https://bridgeconsult.uz',
];

// Порядок = порядок строк в сообщении.
const FIELDS = [
  ['name', 'Имя'],
  ['role', 'Должность / организация'],
  ['contact', 'Контакт'],
  // Поля Академии
  ['programme', 'Программа'],
  ['participants', 'Участников'],
  ['language', 'Язык обучения'],
  ['cases_to_discuss', 'Кейсы'],
  // Поля лендинга договорного сопровождения. Пустые значения в сообщение не
  // попадают, поэтому один список обслуживает обе формы.
  ['format', 'Формат сотрудничества'],
  ['projects', 'Проектов в работе'],
  ['stage', 'Стадия'],
  ['message', 'Комментарий'],
];

const MAX_FIELD = 1500;

// Заголовок сообщения: страница передаёт своё название в скрытом поле source.
// Лендинг Summer School его не шлёт и не должен — для него остаётся прежний
// заголовок, иначе старые заявки стали бы приходить без опознавательных знаков.
const DEFAULT_SOURCE = 'Summer School Georgia 2026';

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildMessage(get, trapped, source) {
  const lines = trapped
    ? ['<b>⚠️ Заявка, помеченная как возможный спам</b>',
       `<i>Ловушка заполнена: ${esc(trapped.slice(0, 120))} — если это живой человек, виновато автозаполнение браузера.</i>`,
       `<i>Источник: ${esc(source)}</i>`, '']
    : [`<b>🔔 Новая заявка — ${esc(source)}</b>`, ''];
  for (const [field, label] of FIELDS) {
    const value = (get(field) || '').trim().slice(0, MAX_FIELD);
    if (value) lines.push(`<b>${label}:</b> ${esc(value)}`);
  }
  lines.push('', `<i>${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Tashkent' })} (Ташкент)</i>`);
  return lines.join('\n');
}

async function sendTelegram(token, chatId, text) {
  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
    });
    const data = await r.json().catch(() => ({}));
    if (!data.ok) console.error(`telegram ${chatId}: ${data.description || r.status}`);
    return !!data.ok;
  } catch (e) {
    console.error(`telegram ${chatId}: ${e.message}`);
    return false;
  }
}

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }
  const origin = req.headers.get('origin');
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return new Response('Forbidden', { status: 403 });
  }

  let get;
  try {
    const ct = req.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      const body = await req.json();
      get = (k) => (typeof body[k] === 'string' ? body[k] : '');
    } else {
      const form = await req.formData();
      get = (k) => (form.get(k) || '').toString();
    }
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'bad_request' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }

  // Ловушка для ботов. НЕ выбрасываем заявку молча: 16.07.2026 так и терялись
  // заявки живых людей — менеджеры паролей и автозаполнение заполняют скрытое
  // поле не хуже бота, а человек видел "Заявка отправлена" и уходил. Поэтому
  // помечаем и доставляем: разобрать спам глазами дешевле, чем потерять клиента.
  const trapped = (get('hp_ref') || get('company_website') || '').trim();

  if (!(get('name') || '').trim() || !(get('contact') || '').trim()) {
    return new Response(JSON.stringify({ ok: false, error: 'missing_fields' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatIds = (process.env.TELEGRAM_CHAT_IDS || '').split(',').map((s) => s.trim()).filter(Boolean);
  const formspreeId = process.env.FORMSPREE_ID;

  if (!token || !chatIds.length) {
    console.error('apply: TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_IDS не заданы');
    return new Response(JSON.stringify({ ok: false, error: 'not_configured' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }

  const source = (get('source') || '').trim().slice(0, 120) || DEFAULT_SOURCE;
  const text = buildMessage(get, trapped, source);

  // Заявка в логах Vercel — последний рубеж: даже если и Telegram, и Formspree
  // лягут, контакт можно достать оттуда.
  console.log('apply:', JSON.stringify({ source, ...Object.fromEntries(FIELDS.map(([f]) => [f, get(f)])) }));

  const results = await Promise.all(chatIds.map((id) => sendTelegram(token, id, text)));
  const delivered = results.filter(Boolean).length;

  // Дубль на почту — только если ID формы задан явно.
  if (formspreeId) {
    try {
      const payload = { _subject: `Заявка — ${source}` };
      for (const [field, label] of FIELDS) {
        const v = (get(field) || '').trim();
        if (v) payload[label] = v.slice(0, MAX_FIELD);
      }
      const r = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!r.ok) console.error(`formspree ${formspreeId}: ${r.status}`);
    } catch (e) {
      console.error(`formspree ${formspreeId}: ${e.message}`);
    }
  }

  // Хотя бы один получатель — успех: заявка не должна теряться из-за того, что
  // кто-то один не нажал Start.
  if (!delivered) {
    return new Response(JSON.stringify({ ok: false, error: 'delivery_failed' }), {
      status: 502, headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true, delivered }), {
    status: 200, headers: { 'Content-Type': 'application/json' },
  });
}
