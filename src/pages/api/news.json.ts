import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
	const posts = (await getCollection('news')).sort(
		(a, b) => {
			const byDate = b.data.date.valueOf() - a.data.date.valueOf();
			if (byDate !== 0) return byDate;
			return (b.data.priority ?? 0) - (a.data.priority ?? 0);
		}
	);

	const data = posts.map((post) => {
		const slug = post.id.replace(/\.(md|mdx)$/i, '');
		const baseSlug = slug.replace(/^(ru|en|uz)-/, '');
		const lang = post.data.lang ?? 'ru';
		const url =
			lang === 'en'
				? `/news/en/${baseSlug}/`
				: lang === 'uz'
					? `/news/uz/${baseSlug}/`
					: `/news/${slug}/`;
		return {
			slug,
			title: post.data.title,
			excerpt: post.data.excerpt,
			coverImage: post.data.coverImage,
			tags: post.data.tags,
			date: post.data.date.toISOString(),
			url,
		};
	});

	return new Response(JSON.stringify(data), {
		headers: { 'Content-Type': 'application/json' },
	});
};
