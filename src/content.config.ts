import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const news = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/news' }),
	schema: z.object({
		title: z.string(),
		// Короткий заголовок для выдачи, если основной длиннее ~60 символов и обрезается.
		seoTitle: z.string().optional(),
		date: z.date(),
		// Дата существенного обновления текста — попадает в dateModified.
		updated: z.date().optional(),
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
		// Длительность видео в формате ISO 8601 (PT32S) для схемы VideoObject.
		videoDuration: z.string().optional(),
		// Подпись под видео и вертикальный постер плеера; без них — подпись FIDIC OSH и coverImage.
		videoCaption: z.string().optional(),
		videoPoster: z.string().optional(),
		// Горизонтальная версия ролика для экранов от md и её постер.
		videoUrlWide: z.string().optional(),
		videoPosterWide: z.string().optional(),
		priority: z.number().optional(),
		tags: z.array(z.string()),
		lang: z.string().default('ru'),
		// Эксперт, под чьей редакцией вышел материал ('larisa'): подпись под заголовком и автор в разметке.
		expert: z.string().optional(),
		// Вопросы и ответы статьи — уходят в разметку FAQPage.
		faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
		// Номер редакции статьи автопилота: по нему обновляется уже опубликованный текст.
		rev: z.number().optional(),
	}),
});

// Словарь FIDIC: одна страница на термин, на трёх языках (ru-/en-/uz- в имени файла).
const glossary = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/glossary' }),
	schema: z.object({
		title: z.string(),
		// Сам термин, как его пишут и ищут: «DAAB», «Notice of Claim».
		term: z.string(),
		// Варианты написания: по ним термин находят в статьях и ставят ссылку на эту страницу.
		aliases: z.array(z.string()).default([]),
		seoTitle: z.string().optional(),
		excerpt: z.string(),
		metaDescription: z.string().optional(),
		date: z.date(),
		updated: z.date().optional(),
		socialImage: z.string().optional(),
		faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
		lang: z.string().default('ru'),
		rev: z.number().optional(),
	}),
});

export const collections = { news, glossary };
