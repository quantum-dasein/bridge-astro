import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
	const posts = (await getCollection('news')).sort(
		(a, b) => b.data.date.valueOf() - a.data.date.valueOf()
	);

	const data = posts.map((post) => {
		const slug = post.id.replace(/\.(md|mdx)$/i, '');
		return {
			slug,
			title: post.data.title,
			excerpt: post.data.excerpt,
			coverImage: post.data.coverImage,
			tags: post.data.tags,
			date: post.data.date.toISOString(),
			url: `/news/${slug}/`,
		};
	});

	return new Response(JSON.stringify(data), {
		headers: { 'Content-Type': 'application/json' },
	});
};
