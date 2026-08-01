// Обработка присланных клиентом изображений для Summer School Georgia 2026.
// Ждёт файлы в ../incoming (относительно корня репозитория):
//   share-card.png  -> og:image, кроп строго 1200x630
//   news-cover.png  -> обложка новости, 16:9
//   poti-port.png   -> иллюстрация технического визита, 16:9
// Для каждого генерирует avif/webp сиблинги рядом с целевым файлом.
import sharp from 'sharp';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const ROOT = process.cwd();

// Репозиторий может быть открыт как git worktree (.claude/worktrees/<name>),
// поэтому ../incoming указывает не туда. Проверяем несколько кандидатов.
const CANDIDATES = [
	process.env.INCOMING_DIR,
	resolve(ROOT, '..', 'incoming'),
	resolve(ROOT, '..', '..', '..', 'incoming'),
	resolve(ROOT, 'incoming'),
].filter(Boolean);

const INCOMING = CANDIDATES.find((dir) => existsSync(dir)) ?? CANDIDATES[1];
console.log(`Источник: ${INCOMING}\n`);

const JOBS = [
	{
		src: 'share-card.png',
		out: 'public/summer-school-georgia-2026/assets/share-card.png',
		width: 1200,
		height: 630,
		fit: 'cover',
	},
	{
		src: 'news-cover.png',
		out: 'public/images/news/summer-school-georgia-cover.png',
		width: 1600,
		height: 900,
		fit: 'cover',
	},
	{
		src: 'poti-port.png',
		out: 'public/summer-school-georgia-2026/assets/poti-port.png',
		width: 1600,
		height: 900,
		fit: 'cover',
	},
];

let missing = 0;

for (const job of JOBS) {
	const source = join(INCOMING, job.src);
	if (!existsSync(source)) {
		console.warn(`ПРОПУЩЕН (нет файла): ${source}`);
		missing += 1;
		continue;
	}

	const target = join(ROOT, job.out);
	mkdirSync(dirname(target), { recursive: true });

	const meta = await sharp(source).metadata();
	const base = sharp(source)
		.rotate()
		.resize({ width: job.width, height: job.height, fit: job.fit, position: 'attention' });

	// PNG-фолбэк: палитра, чтобы вес не улетал.
	await base.clone().png({ palette: true, quality: 85 }).toFile(`${target}.tmp`);
	await base.clone().webp({ quality: 82, effort: 5 }).toFile(target.replace(/\.png$/, '.webp'));
	await base.clone().avif({ quality: 55, effort: 4 }).toFile(target.replace(/\.png$/, '.avif'));

	const { renameSync } = await import('node:fs');
	renameSync(`${target}.tmp`, target);

	console.log(`OK ${job.src}: ${meta.width}x${meta.height} -> ${job.width}x${job.height}  (${job.out})`);
}

if (missing) {
	console.log(`\nНе хватает файлов: ${missing}. Положи их в ${INCOMING} и запусти скрипт снова.`);
	process.exitCode = 1;
}
