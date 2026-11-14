// Забирает готовые материалы у редакционного бота (Bridge Consult · SMM Studio) и кладёт их в сайт:
// три Markdown-файла (ru/en/uz) в src/content/news или src/content/glossary и картинки в public/media/<раздел>/<slug>/.
// Запускается из .github/workflows/autopilot-news.yml. Идемпотентен: уже добавленное пропускает,
// а обновляет только то, у чего бот поднял номер редакции (rev).
//
//   node scripts/pull-articles.mjs --check   — только проверить, есть ли что добавить (без зависимостей)
//   node scripts/pull-articles.mjs           — скачать, оптимизировать картинки и записать файлы
import { appendFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const FEED = process.env.FEED_URL || 'https://bridgeconsult-studio.rodionbelousov.workers.dev/site/feed.json';
const ORIGIN = new URL(FEED).origin;
const root = process.cwd();
const checkOnly = process.argv.includes('--check');
const LANGS = ['ru', 'en', 'uz'];
const COLLECTIONS = { news: { needsCover: true }, glossary: { needsCover: false } };
const contentDir = (c) => join(root, 'src', 'content', c);
const mediaDir = (c) => join(root, 'public', 'media', c);

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
const okSlug = (s) => typeof s === 'string' && /^[a-z0-9][a-z0-9-]{1,70}$/.test(s);
// Материалы приходят извне, поэтому не пускаем в сайт ничего исполняемого.
const unsafe = (text) => /<\s*(script|iframe|object|embed|link|meta|style|form)\b|\son\w+\s*=|javascript:/i.test(text);
const revOf = (file) => (existsSync(file) ? Number(readFileSync(file, 'utf8').match(/^rev:\s*(\d+)/m)?.[1] ?? 1) : 0);

const feed = await get(FEED);
const todo = [];
for (const a of feed.articles ?? []) {
	const collection = a.collection ?? 'news';
	const rules = COLLECTIONS[collection];
	if (!rules || !okSlug(a.slug)) { console.warn(`skip: bad entry ${collection}/${a.slug}`); continue; }
	const names = LANGS.map((l) => `${l}-${a.slug}.md`);
	if (names.some((n) => typeof a.files?.[n] !== 'string' || !a.files[n].startsWith('---\n') || unsafe(a.files[n]))) { console.warn(`skip: ${a.slug} failed validation`); continue; }
	if (!(a.images ?? []).every((i) => /^[a-z]+(-(ru|en|uz))?$/.test(i.name) && String(i.url).startsWith(`${ORIGIN}/site/img/`))) { console.warn(`skip: ${a.slug} bad images`); continue; }
	if (rules.needsCover && !a.images.some((i) => i.name === 'cover')) { console.warn(`skip: ${a.slug} has no cover`); continue; }
	const dir = contentDir(collection);
	// Написанное руками (.mdx) не трогаем никогда.
	if (LANGS.some((l) => existsSync(join(dir, `${l}-${a.slug}.mdx`)))) continue;
	const have = revOf(join(dir, `ru-${a.slug}.md`));
	const rev = Number(a.rev ?? 1);
	if (have >= rev) continue;
	todo.push({ ...a, collection, update: have > 0 });
}
// Снятое с публикации: удаляем только то, что добавил автопилот (.md, а не .mdx).
const drop = (feed.remove ?? [])
	.map((r) => (typeof r === 'string' ? { collection: 'news', slug: r } : r))
	.filter((r) => COLLECTIONS[r.collection] && okSlug(r.slug) && existsSync(join(contentDir(r.collection), `ru-${r.slug}.md`)));

console.log(`feed: ${feed.articles?.length ?? 0} ready, ${todo.length} to write, ${drop.length} to remove`);
setOutput('changed', todo.length || drop.length ? 'true' : 'false');
if (checkOnly || (!todo.length && !drop.length)) process.exit(0);

const { default: sharp } = await import('sharp');
const titles = [];
for (const a of todo) {
	const media = join(mediaDir(a.collection), a.slug);
	if (a.images.length) mkdirSync(media, { recursive: true });
	for (const img of a.images) {
		const src = await get(img.url, 'buffer');
		const base = sharp(src).rotate().resize({ width: 1600, withoutEnlargement: true });
		await base.clone().jpeg({ quality: 84, mozjpeg: true }).toFile(join(media, `${img.name}.jpg`));
		await base.clone().webp({ quality: 80, effort: 5 }).toFile(join(media, `${img.name}.webp`));
		await base.clone().avif({ quality: 55, effort: 4 }).toFile(join(media, `${img.name}.avif`));
	}
	mkdirSync(contentDir(a.collection), { recursive: true });
	for (const l of LANGS) writeFileSync(join(contentDir(a.collection), `${l}-${a.slug}.md`), a.files[`${l}-${a.slug}.md`]);
	titles.push(`${a.update ? 'update: ' : ''}${a.title || a.slug}`);
	console.log(`${a.update ? 'updated' : 'added'}: ${a.collection}/${a.slug}`);
}
for (const r of drop) {
	for (const l of LANGS) rmSync(join(contentDir(r.collection), `${l}-${r.slug}.md`), { force: true });
	rmSync(join(mediaDir(r.collection), r.slug), { recursive: true, force: true });
	titles.push(`removed ${r.slug}`);
	console.log(`removed: ${r.collection}/${r.slug}`);
}
writeFileSync(join(root, '.autopilot-message'), titles.length === 1 ? `Autopilot: ${titles[0]}` : `Autopilot: ${titles.length} items\n\n${titles.map((t) => `- ${t}`).join('\n')}`);
