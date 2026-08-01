import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const news = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/news' }),
	schema: z.object({
		title: z.string(),
		date: z.date(),
		excerpt: z.string(),
		// excerpt служит текстом карточки в листингах и может быть длинным.
		// metaDescription — короткий вариант (~155 симв.) специально для <meta name="description">,
		// чтобы сниппет в выдаче не обрезался. Если не задан, используется excerpt.
		metaDescription: z.string().optional(),
		coverImage: z.string(),
		// Отдельная картинка для превью в соцсетях (og:image), когда обложка
		// статьи под них не годится: у них формат 1200x630, у обложки 16:9.
		socialImage: z.string().optional(),
		videoUrl: z.string().optional(),
		priority: z.number().optional(),
		tags: z.array(z.string()),
		lang: z.string().default('ru'),
	}),
});

export const collections = { news };
