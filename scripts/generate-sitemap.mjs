import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SITE = 'https://www.bridgeconsult.uz';
const NEWS_DIR = path.join(ROOT, 'src', 'content', 'news');
const PROJECTS_FILE = path.join(ROOT, 'src', 'data', 'projectCases.ts');
const OUT_FILE = path.join(ROOT, 'public', 'sitemap.xml');

const langs = ['ru', 'en', 'uz'];

function abs(urlPath) {
	return `${SITE}${urlPath}`;
}

function escapeXml(value) {
	return String(value)
		.replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}

function urlEntry({ loc, alternates = null, changefreq = 'monthly', priority = '0.7', lastmod = null }) {
	const lines = ['  <url>', `    <loc>${escapeXml(abs(loc))}</loc>`];
	if (lastmod) lines.push(`    <lastmod>${escapeXml(lastmod)}</lastmod>`);
	if (alternates) {
		for (const [lang, href] of Object.entries(alternates)) {
			lines.push(`    <xhtml:link rel="alternate" hreflang="${lang}" href="${escapeXml(abs(href))}"/>`);
		}
	}
	lines.push(`    <changefreq>${changefreq}</changefreq>`);
	lines.push(`    <priority>${priority}</priority>`);
	lines.push('  </url>');
	return lines.join('\n');
}

function readNews() {
	const files = fs.readdirSync(NEWS_DIR).filter((file) => file.endsWith('.mdx'));
	const groups = new Map();

	for (const file of files) {
		const slug = file.replace(/\.mdx$/, '');
		const match = slug.match(/^(ru|en|uz)-(.+)$/);
		if (!match) continue;

		const [, lang, baseSlug] = match;
		const text = fs.readFileSync(path.join(NEWS_DIR, file), 'utf8');
		const date = text.match(/^date:\s*([0-9-]+)/m)?.[1] ?? null;

		if (!groups.has(baseSlug)) groups.set(baseSlug, {});
		groups.get(baseSlug)[lang] = { slug, date };
	}

	return [...groups.entries()]
		.filter(([, translations]) => langs.every((lang) => translations[lang]))
		.sort(([a], [b]) => a.localeCompare(b));
}

function readProjectSlugs() {
	const text = fs.readFileSync(PROJECTS_FILE, 'utf8');
	return [...text.matchAll(/slug:\s*'([^']+)'/g)].map((match) => match[1]);
}

const homeAlternates = {
	ru: '/',
	en: '/EN/',
	uz: '/UZ/',
	'x-default': '/',
};

const projectIndexAlternates = {
	ru: '/projects.html',
	en: '/EN/projects.html',
	uz: '/UZ/projects.html',
	'x-default': '/projects.html',
};

const newsIndexAlternates = {
	ru: '/news/',
	en: '/news/en/',
	uz: '/news/uz/',
	'x-default': '/news/',
};

const entries = [];

entries.push(urlEntry({ loc: '/', alternates: homeAlternates, priority: '1.0' }));
entries.push(urlEntry({ loc: '/EN/', alternates: homeAlternates, priority: '0.9' }));
entries.push(urlEntry({ loc: '/UZ/', alternates: homeAlternates, priority: '0.9' }));

entries.push(urlEntry({ loc: '/projects.html', alternates: projectIndexAlternates, priority: '0.8' }));
entries.push(urlEntry({ loc: '/EN/projects.html', alternates: projectIndexAlternates, priority: '0.7' }));
entries.push(urlEntry({ loc: '/UZ/projects.html', alternates: projectIndexAlternates, priority: '0.7' }));

entries.push(urlEntry({ loc: '/news/', alternates: newsIndexAlternates, changefreq: 'weekly', priority: '0.8' }));
entries.push(urlEntry({ loc: '/news/en/', alternates: newsIndexAlternates, changefreq: 'weekly', priority: '0.7' }));
entries.push(urlEntry({ loc: '/news/uz/', alternates: newsIndexAlternates, changefreq: 'weekly', priority: '0.7' }));

entries.push(urlEntry({
	loc: '/adjudication-survey/',
	changefreq: 'monthly',
	priority: '0.8',
	lastmod: '2026-07-06',
}));

// Лендинг Summer School Georgia 2026 (программа 12-20 августа 2026).
// Страница живёт в public/ отдельно от Astro, поэтому её нужно перечислить руками.
entries.push(urlEntry({
	loc: '/summer-school-georgia-2026/',
	changefreq: 'daily',
	priority: '0.9',
	lastmod: '2026-08-01',
}));

for (const [baseSlug, translations] of readNews()) {
	const alternates = {
		ru: `/news/ru-${baseSlug}/`,
		en: `/news/en/${baseSlug}/`,
		uz: `/news/uz/${baseSlug}/`,
		'x-default': `/news/ru-${baseSlug}/`,
	};
	const lastmod = translations.ru.date ?? translations.en.date ?? translations.uz.date;
	const priority = baseSlug.includes('eot') || baseSlug.includes('daab') ? '0.8' : '0.7';

	entries.push(urlEntry({ loc: alternates.ru, alternates, changefreq: 'weekly', priority, lastmod }));
	entries.push(urlEntry({ loc: alternates.en, alternates, changefreq: 'weekly', priority: '0.7', lastmod }));
	entries.push(urlEntry({ loc: alternates.uz, alternates, changefreq: 'weekly', priority: '0.7', lastmod }));
}

for (const slug of readProjectSlugs()) {
	const alternates = {
		ru: `/projects/${slug}/`,
		en: `/EN/projects/${slug}/`,
		uz: `/UZ/projects/${slug}/`,
		'x-default': `/projects/${slug}/`,
	};

	entries.push(urlEntry({ loc: alternates.ru, alternates, priority: '0.7' }));
	entries.push(urlEntry({ loc: alternates.en, alternates, priority: '0.7' }));
	entries.push(urlEntry({ loc: alternates.uz, alternates, priority: '0.7' }));
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n\n')}
</urlset>
`;

fs.writeFileSync(OUT_FILE, xml, 'utf8');
console.log(`Generated ${path.relative(ROOT, OUT_FILE)} with ${entries.length} URLs`);
