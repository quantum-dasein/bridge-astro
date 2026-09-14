/**
 * Живой переводчик речи RU → UZ — локальная версия для отладки.
 *
 * На занятиях работает не она, а продовая: api/tarjima/say.js и
 * public/tarjima/. Эта раздаёт субтитры через SSE из памяти процесса и
 * нужна, чтобы погонять распознавание и страницы на своей машине.
 *
 * Словарь терминов общий с продом — src/data/fidicGlossary.mjs.
 *
 * Запуск:
 *   node tools/translator/server.mjs
 *   MOCK=1 node tools/translator/server.mjs   — без модели и без денег
 *
 * Переменные окружения:
 *   ANTHROPIC_API_KEY — ключ для перевода
 *   TRANSLATOR_MODEL  — модель (по умолчанию claude-opus-5)
 *   PORT              — порт (по умолчанию 8787)
 *   MOCK=1            — модель не вызывается; фраза уходит слушателям как
 *                       есть, с пометкой, что это не перевод. Проверяет весь
 *                       тракт «речь → сервер → субтитры».
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Anthropic from '@anthropic-ai/sdk';
import { TERMS, findTerms } from '../../src/data/fidicGlossary.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT ?? 8787);
const MOCK = process.env.MOCK === '1' || !process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.TRANSLATOR_MODEL ?? 'claude-opus-5';

const client = MOCK ? null : new Anthropic({ timeout: 15_000, maxRetries: 1 });

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

async function translate(text) {
	const terms = findTerms(text);
	const system =
		'Ты переводишь в реальном времени лекцию по контрактам FIDIC для инженеров и юристов из Узбекистана. ' +
		'Переведи присланную фразу лектора на узбекский (латиница). В ответе только перевод.' +
		(terms.length ? '\n\nТермины BRIDGE Consult:\n' + terms.map((t) => `${t.ru} — ${t.uz}`).join('\n') : '');

	const res = await client.messages.create({
		model: MODEL,
		max_tokens: 4000,
		output_config: { effort: 'low' },
		system,
		messages: [{ role: 'user', content: text }],
	});
	if (res.stop_reason === 'refusal') throw new Error('модель отказалась переводить фразу');
	const out = res.content.filter((b) => b.type === 'text').map((b) => b.text).join('').trim();
	if (!out) throw new Error('пустой перевод');
	return out;
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
		let uz = text;
		let error = MOCK ? 'MOCK: модель не вызывалась' : null;
		if (!MOCK) {
			try {
				uz = await translate(text);
			} catch (e) {
				error = String(e.message ?? e);
			}
		}

		const event = { ru: text, uz, ms: Date.now() - started, at: Date.now(), error };
		if (error) event.raw = true;
		history.push(event);
		if (history.length > HISTORY_MAX) history.shift();
		broadcast(event);

		res.writeHead(200, { 'content-type': 'application/json' });
		return res.end(JSON.stringify(event));
	}

	res.writeHead(404).end('not found');
});

server.listen(PORT, () => {
	console.log(`\n  Переводчик RU → UZ (локально)`);
	console.log(`  Режим:      ${MOCK ? 'MOCK — без модели' : MODEL}`);
	console.log(`  Словарь:    ${TERMS.length} терминов`);
	console.log(`\n  Преподаватель:  http://localhost:${PORT}/`);
	console.log(`  Слушатели:      http://localhost:${PORT}/view\n`);
});
