// Забирает готовые статьи у редакционного бота (Bridge Consult · SMM Studio) и кладёт их в сайт:
// три Markdown-файла (ru/en/uz) в src/content/news и картинки в public/media/news/<slug>/.
// Запускается из .github/workflows/autopilot-news.yml. Идемпотентен: уже добавленные статьи пропускает.
//
//   node scripts/pull-articles.mjs --check   — только проверить, есть ли что добавить (без зависимостей)
//   node scripts/pull-articles.mjs           — скачать, оптимизировать картинки и записать файлы
import { appendFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const FEED = process.env.FEED_URL || 'https://bridgeconsult-studio.rodionbelousov.workers.dev/site/feed.json';
const ORIGIN = new URL(FEED).origin;
const root = process.cwd();
const newsDir = join(root, 'src', 'content', 'news');
const mediaDir = join(root, 'public', 'media', 'news');
const checkOnly = process.argv.includes('--check');
const LANGS = ['ru', 'en', 'uz'];

async function get(url, as = 'json') {
	let last;
	for (let i = 0; i < 4; i++) {
		try {
			const r = await fetch(url, { signal: AbortSignal.timeout(60_000) });
			if (!r.ok) throw new Error(`HTTP ${r.status}`);
			return as === 'json' ? await r.json() : Buffer.from(await r.arrayBuffer());
		} catch (e) {
			last = e;
			await new Promise((res) => setTimeout(res, 3000 * (i + 1)));
		}
	}
	throw new Error(`${url}: ${last?.message}`);
}

const setOutput = (k, v) => process.env.GITHUB_OUTPUT && appendFileSync(process.env.GITHUB_OUTPUT, `${k}=${v}\n`);
const okSlug = (s) => typeof s === 'string' && /^[a-z0-9][a-z0-9-]{2,70}$/.test(s);
// Статьи приходят извне, поэтому не пускаем в сайт ничего исполняемого.
const unsafe = (text) => /<\s*(script|iframe|object|embed|link|meta|style|form)\b|\son\w+\s*=|javascript:/i.test(text);

const feed = await get(FEED);
const todo = [];
for (const a of feed.articles ?? []) {
	if (!okSlug(a.slug)) { console.warn(`skip: bad slug ${a.slug}`); continue; }
	const names = LANGS.map((l) => `${l}-${a.slug}.md`);
	if (names.some((n) => typeof a.files?.[n] !== 'string' || !a.files[n].startsWith('---\n') || unsafe(a.files[n]))) { console.warn(`skip: ${a.slug} failed validation`); continue; }
	if (!(a.images ?? []).every((i) => /^[a-z]+(-(ru|en|uz))?$/.test(i.name) && String(i.url).startsWith(`${ORIGIN}/site/img/`))) { console.warn(`skip: ${a.slug} bad images`); continue; }
	if (!a.images.some((i) => i.name === 'cover')) { console.warn(`skip: ${a.slug} has no cover`); continue; }
	// Статья уже на сайте (в любом формате) — не трогаем.
	if (LANGS.some((l) => existsSync(join(newsDir, `${l}-${a.slug}.md`)) || existsSync(join(newsDir, `${l}-${a.slug}.mdx`)))) continue;
	todo.push(a);
}
// Снятые с публикации: удаляем только то, что добавил автопилот (у таких статей есть папка с картинками).
const drop = (feed.remove ?? []).filter((s) => okSlug(s) && existsSync(join(mediaDir, s)) && existsSync(join(newsDir, `ru-${s}.md`)));

console.log(`feed: ${feed.articles?.length ?? 0} ready, ${todo.length} new, ${drop.length} to remove`);
setOutput('changed', todo.length || drop.length ? 'true' : 'false');
if (checkOnly || (!todo.length && !drop.length)) process.exit(0);

const { default: sharp } = await import('sharp');
const titles = [];
for (const a of todo) {
	const dir = join(mediaDir, a.slug);
	mkdirSync(dir, { recursive: true });
	for (const img of a.images) {
		const src = await get(img.url, 'buffer');
		const base = sharp(src).rotate().resize({ width: 1600, withoutEnlargement: true });
		await base.clone().jpeg({ quality: 84, mozjpeg: true }).toFile(join(dir, `${img.name}.jpg`));
		await base.clone().webp({ quality: 80, effort: 5 }).toFile(join(dir, `${img.name}.webp`));
		await base.clone().avif({ quality: 55, effort: 4 }).toFile(join(dir, `${img.name}.avif`));
	}
	for (const l of LANGS) writeFileSync(join(newsDir, `${l}-${a.slug}.md`), a.files[`${l}-${a.slug}.md`]);
	titles.push(a.title || a.slug);
	console.log(`added: ${a.slug}`);
}
for (const s of drop) {
	for (const l of LANGS) rmSync(join(newsDir, `${l}-${s}.md`), { force: true });
	rmSync(join(mediaDir, s), { recursive: true, force: true });
	titles.push(`removed ${s}`);
	console.log(`removed: ${s}`);
}
writeFileSync(join(root, '.autopilot-message'), titles.length === 1 ? `Autopilot: ${titles[0]}` : `Autopilot: ${titles.length} articles\n\n${titles.map((t) => `- ${t}`).join('\n')}`);
