import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const publicDir = join(root, 'public');
const newsDir = join(root, 'src', 'content', 'news');

const files = (await readdir(newsDir)).filter((file) => /\.mdx?$/i.test(file));
const coverImages = new Set();

for (const file of files) {
	const text = await readFile(join(newsDir, file), 'utf8');
	const match = text.match(/^coverImage:\s*["']([^"']+)["']/m);
	if (match?.[1]?.startsWith('/')) {
		coverImages.add(match[1]);
	}
}

for (const imageUrl of coverImages) {
	const source = join(publicDir, imageUrl.slice(1));
	if (!existsSync(source)) {
		console.warn(`Skipped missing cover: ${imageUrl}`);
		continue;
	}

	const extension = extname(source);
	const base = source.slice(0, -extension.length);
	const outputDir = dirname(source);
	const pipeline = sharp(source)
		.rotate()
		.resize({ width: 1600, withoutEnlargement: true });

	await pipeline
		.clone()
		.webp({ quality: 78, effort: 5 })
		.toFile(join(outputDir, `${base.split(/[\\/]/).pop()}.webp`));

	await pipeline
		.clone()
		.avif({ quality: 52, effort: 4 })
		.toFile(join(outputDir, `${base.split(/[\\/]/).pop()}.avif`));

	console.log(`Optimized ${imageUrl}`);
}
