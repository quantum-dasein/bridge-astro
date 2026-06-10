import { defineCollection, z } from 'astro:content';

const news = defineCollection({
	schema: z.object({
		title: z.string(),
		date: z.date(),
		excerpt: z.string(),
		coverImage: z.string(),
		videoUrl: z.string().optional(),
		tags: z.array(z.string()),
		lang: z.string().default('ru'),
	}),
});

export const collections = { news };
