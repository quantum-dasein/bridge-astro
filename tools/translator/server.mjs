/**
 * Живой переводчик речи RU → UZ для онлайн-занятий BRIDGE Consult Academy.
 *
 * Зачем свой, а не Wordly: Wordly стоит ~$75 за час каждого потока и не знает
 * терминологии FIDIC — в узбекском для половины понятий нет устоявшегося
 * юридического словаря. Здесь перевод идёт с глоссарием Ларисы, собранным из
 * её же пособия и узбекских версий сайта (tools/translator/glossary.json).
 *
 * Как устроено:
 *   1. speaker.html — страница преподавателя. Распознавание речи делает сам
 *      браузер (Chrome, Web Speech API, русский, бесплатно). Готовые фразы
 *      уходят сюда через POST /say.
 *   2. Сервер переводит фразу на узбекский, подставляя в подсказку только те
 *      термины глоссария, что реально встретились — это держит задержку и
 *      цену внизу.
 *   3. viewer.html — страница слушателя. Держит открытым SSE и показывает
 *      субтитры. Участник просто открывает ссылку на телефоне рядом с Zoom.
 *
 * Интеграция с Zoom не нужна: конференция может быть любой.
 *
 * Запуск:
 *   node tools/translator/server.mjs
 *   MOCK=1 node tools/translator/server.mjs      — без ключа, только глоссарий
 *
 * Переменные окружения:
 *   ANTHROPIC_API_KEY — ключ для перевода
 *   TRANSLATOR_MODEL  — модель (по умолчанию claude-sonnet-5)
 *   PORT              — порт (по умолчанию 8787)
 *   MOCK=1            — не звать модель, подставить только термины глоссария.
 *                       Нужен, чтобы проверить весь тракт без ключа и денег.
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT ?? 8787);
const MOCK = process.env.MOCK === '1';
const MODEL = process.env.TRANSLATOR_MODEL ?? 'claude-sonnet-5';
const KEY = process.env.ANTHROPIC_API_KEY;

const glossary = JSON.parse(fs.readFileSync(path.join(DIR, 'glossary.json'), 'utf8'));
// Длинные термины идут первыми: «Продление срока завершения» должно
// сработать раньше, чем «Продление срока».
glossary.sort((a, b) => b.ru.length - a.ru.length);

/** Слушатели субтитров. Каждый — открытый SSE-ответ. */
const viewers = new Set();
/** Последние строки: новый зритель сразу видит контекст, а не пустой экран. */
const history = [];
const HISTORY_MAX = 40;

function broadcast(event) {
	const line = `data: ${JSON.stringify(event)}\n\n`;
	for (const res of viewers) {
		try {
			res.write(line);
		} catch {
			viewers.delete(res);
		}
	}
}

/** Термины глоссария, реально встретившиеся во фразе. */
function relevantTerms(text) {
	const low = text.toLowerCase();
	const hits = [];
	for (const t of glossary) {
		if (t.ru.length < 4) continue;
		if (low.includes(t.ru.toLowerCase())) hits.push(t);
		if (hits.length >= 25) break;
	}
	return hits;
}

/** Запасной режим: подставляем термины, остальное оставляем как есть. */
function mockTranslate(text) {
	let out = text;
	for (const t of glossary) {
		if (t.ru.length < 4) continue;
		out = out.replaceAll(t.ru, t.uz);
		const cap = t.ru.charAt(0).toUpperCase() + t.ru.slice(1);
		out = out.replaceAll(cap, t.uz);
	}
	return out;
}

async function translate(text) {
	if (MOCK || !KEY) return mockTranslate(text);

	const terms = relevantTerms(text);
	const glossaryBlock = terms.length
		? `\n\nОбязательный глоссарий (термины BRIDGE Consult, отклоняться нельзя):\n` +
			terms.map((t) => `${t.ru} = ${t.uz}`).join('\n')
		: '';

	const system =
		'Ты синхронный переводчик на лекции по контрактам FIDIC для строителей и юристов Узбекистана. ' +
		'Переводишь с русского на узбекский (латиница). ' +
		'Правила: переводи только присланную реплику, ничего не добавляй и не комментируй; ' +
		'сохраняй номера пунктов и англоязычные термины контракта (Variation, EOT, Claim, IPC, DAAB, Taking-Over) как есть; ' +
		'если фраза оборвана на полуслове — переводи как есть, не додумывай окончание; ' +
		'в ответе только перевод, без кавычек и пояснений.' +
		glossaryBlock;

	const res = await fetch('https://api.anthropic.com/v1/messages', {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			'x-api-key': KEY,
			'anthropic-version': '2023-06-01',
		},
		body: JSON.stringify({
			model: MODEL,
			max_tokens: 1000,
			system,
			messages: [{ role: 'user', content: text }],
		}),
	});

	if (!res.ok) throw new Error(`API ${res.status}: ${(await res.text()).slice(0, 200)}`);
	const data = await res.json();
	return (data.content?.[0]?.text ?? '').trim();
}

function serveFile(res, name, type) {
	try {
		res.writeHead(200, { 'content-type': type, 'cache-control': 'no-store' });
		res.end(fs.readFileSync(path.join(DIR, 'public', name)));
	} catch {
		res.writeHead(404).end('not found');
	}
}

const server = http.createServer(async (req, res) => {
	const url = new URL(req.url, `http://${req.headers.host}`);

	if (url.pathname === '/' || url.pathname === '/speaker') {
		return serveFile(res, 'speaker.html', 'text/html; charset=utf-8');
	}
	if (url.pathname === '/view') {
		return serveFile(res, 'viewer.html', 'text/html; charset=utf-8');
	}

	// Поток субтитров для слушателей.
	if (url.pathname === '/stream') {
		res.writeHead(200, {
			'content-type': 'text/event-stream; charset=utf-8',
			'cache-control': 'no-cache',
			connection: 'keep-alive',
			'x-accel-buffering': 'no',
		});
		res.write('retry: 2000\n\n');
		for (const h of history) res.write(`data: ${JSON.stringify(h)}\n\n`);
		viewers.add(res);
		// Пульс: без него прокси рвут «молчащее» соединение на паузах лекции.
		const beat = setInterval(() => res.write(': ping\n\n'), 15000);
		req.on('close', () => {
			clearInterval(beat);
			viewers.delete(res);
		});
		return;
	}

	// Фраза от преподавателя.
	if (url.pathname === '/say' && req.method === 'POST') {
		let body = '';
		for await (const chunk of req) body += chunk;
		let text = '';
		try {
			text = (JSON.parse(body).text ?? '').trim();
		} catch {
			/* мусор — просто игнорируем */
		}
		if (!text) return res.writeHead(400).end('empty');

		const started = Date.now();
		let uz = '';
		let error = null;
		try {
			uz = await translate(text);
		} catch (e) {
			error = String(e.message ?? e);
			uz = mockTranslate(text); // перевод не должен исчезать из-за сбоя API
		}

		const event = { ru: text, uz, ms: Date.now() - started, at: Date.now(), error };
		history.push(event);
		if (history.length > HISTORY_MAX) history.shift();
		broadcast(event);

		res.writeHead(200, { 'content-type': 'application/json' });
		return res.end(JSON.stringify(event));
	}

	res.writeHead(404).end('not found');
});

server.listen(PORT, () => {
	console.log(`\n  Переводчик RU → UZ запущен`);
	console.log(`  Режим:      ${MOCK || !KEY ? 'MOCK (только глоссарий, без модели)' : MODEL}`);
	console.log(`  Глоссарий:  ${glossary.length} терминов`);
	console.log(`\n  Преподаватель:  http://localhost:${PORT}/`);
	console.log(`  Слушатели:      http://localhost:${PORT}/view\n`);
});
