/**
 * Проверка: нет ли на нерусских страницах русского текста.
 *
 * Дважды подряд на /academy/en/ и /contract-support/uz/ вылезали русские
 * подписи — не из файлов данных, а из значений по умолчанию внутри самих
 * компонентов: «Листайте вбок», «Показать все», «Читать дальше», «Модели
 * оплаты», «открыть сертификат». Глазами это ловится плохо: подсказку про
 * свайп видно только на узком экране, подписи знаков — только при
 * наведении, а кнопки «показать всё» — только когда блок свёрнут.
 *
 * Скрипт читает собранные страницы EN и UZ и ищет кириллицу в видимом
 * тексте и в любых атрибутах. Комментарии, script и style не в счёт: их
 * на странице не видно.
 *
 * Запуск: npm run check:i18n (после npm run build).
 */

import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const PAGES = [
	'dist/academy/en/index.html',
	'dist/academy/uz/index.html',
	'dist/contract-support/en/index.html',
	'dist/contract-support/uz/index.html',
	'dist/news/en/index.html',
	'dist/news/uz/index.html',
];

const CYRILLIC = /[Ѐ-ӿ]/;

/** Разметка без того, чего на странице не видно. */
const visible = (html) =>
	html
		.replace(/<!--[\s\S]*?-->/g, ' ')
		.replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
		.replace(/<style\b[\s\S]*?<\/style>/gi, ' ');

const leaks = new Set();
let checked = 0;

for (const page of PAGES) {
	if (!existsSync(page)) continue;
	checked += 1;
	const html = visible(await readFile(page, 'utf8'));

	// Подписи. Смотрим любые атрибуты, а не известный список: русский текст
	// в атрибуте — ошибка, как бы этот атрибут ни назывался.
	for (const [, attr, value] of html.matchAll(/([a-zA-Z-]+)\s*=\s*"([^"]*)"/g)) {
		if (CYRILLIC.test(value)) leaks.add(`${page}  ${attr}="${value.trim()}"`);
	}

	// Видимый текст. Режем разметку по тегам — остаются текстовые узлы,
	// то есть подпись целиком, а не отдельные слова из неё.
	for (const node of html.split(/<[^>]+>/)) {
		const text = node.replace(/\s+/g, ' ').trim();
		if (text && CYRILLIC.test(text)) leaks.add(`${page}  ${text}`);
	}
}

if (!checked) {
	console.error('Нечего проверять: соберите сайт (npm run build).');
	process.exit(1);
}

if (leaks.size) {
	console.error('Русский текст на нерусских страницах:\n');
	for (const leak of leaks) console.error('  ' + leak);
	console.error(`\nВсего: ${leaks.size}`);
	process.exit(1);
}

console.log(`Языковых утечек нет: проверено страниц — ${checked}.`);
