// Данные для умного поиска на странице новостей: все статьи и термины словаря с кратким текстом.
// Их забирает редакционный бот и строит по ним смысловой индекс.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const plain = (md: string) =>
	md
		.replace(/^---[\s\S]*?---/, '')
		.replace(/<[^>]+>/g, ' ')
		.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
		.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
		.replace(/[#>*_`|]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();

export const GET: APIRoute = async () => {
	const docs: Record<string, unknown>[] = [];
	for (const p of await getCollection('news')) {
		const slug = p.id.replace(/\.(md|mdx)$/i, '');
		const base = slug.replace(/^(ru|en|uz)-/, '');
		const lang = p.data.lang ?? 'ru';
		docs.push({
			url: lang === 'en' ? `/news/en/${base}/` : lang === 'uz' ? `/news/uz/${base}/` : `/news/${slug}/`,
			lang,
			kind: 'news',
			title: p.data.title,
			excerpt: p.data.excerpt,
			tags: p.data.tags,
			date: p.data.date.toISOString().slice(0, 10),
			text: plain(p.body ?? '').slice(0, 2400),
		});
	}
	for (const g of await getCollection('glossary')) {
		const base = g.id.replace(/\.(md|mdx)$/i, '').replace(/^(ru|en|uz)-/, '');
		const lang = g.data.lang ?? 'ru';
		docs.push({
			url: lang === 'ru' ? `/glossary/${base}/` : `/glossary/${lang}/${base}/`,
			lang,
			kind: 'term',
			title: g.data.title,
			excerpt: g.data.excerpt,
			tags: [g.data.term, ...g.data.aliases],
			date: (g.data.updated ?? g.data.date).toISOString().slice(0, 10),
			text: plain(g.body ?? '').slice(0, 1600),
		});
	}
	return new Response(JSON.stringify(docs), { headers: { 'Content-Type': 'application/json' } });
};
