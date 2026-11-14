// Ставит в статьях ссылки на словарь FIDIC: первое упоминание каждого термина в тексте
// превращается в ссылку на его страницу. Работает при сборке, для новостей и самих страниц словаря,
// поэтому старые статьи получают ссылки на новые термины без правки руками.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';

const DIR = join(process.cwd(), 'src', 'content', 'glossary');
const MAX_LINKS = 8;
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function unq(v) {
	const t = v.trim();
	if (t.startsWith('"')) {
		try { return JSON.parse(t); } catch { return t.slice(1, -1); }
	}
	return t.replace(/^'|'$/g, '');
}

function loadTerms() {
	const out = { ru: [], en: [], uz: [] };
	if (!existsSync(DIR)) return out;
	for (const file of readdirSync(DIR)) {
		const m = file.match(/^(ru|en|uz)-(.+)\.mdx?$/);
		if (!m) continue;
		const fm = readFileSync(join(DIR, file), 'utf8').split(/^---\s*$/m)[1] ?? '';
		const term = fm.match(/^term:\s*(.+)$/m)?.[1];
		if (!term) continue;
		const aliasBlock = fm.match(/^aliases:\s*\n((?:\s+-\s+.+\n?)*)/m)?.[1] ?? '';
		const aliases = [...aliasBlock.matchAll(/^\s+-\s+(.+)$/gm)].map((x) => unq(x[1]));
		const phrases = [unq(term), ...aliases].filter((p) => p && p.length >= 3).sort((a, b) => b.length - a.length);
		if (!phrases.length) continue;
		// Не внутри слова: слева и справа не буква и не цифра. Короткие аббревиатуры (EOT, NOD) — с учётом регистра.
		const body = phrases.map(esc).join('|');
		const flags = phrases.every((p) => p.length <= 4 && p === p.toUpperCase()) ? 'u' : 'iu';
		out[m[1]].push({
			slug: m[2],
			re: new RegExp(`(?<![\\p{L}\\p{N}])(?:${body})(?![\\p{L}\\p{N}])`, flags),
			url: m[1] === 'ru' ? `/glossary/${m[2]}/` : `/glossary/${m[1]}/${m[2]}/`,
		});
	}
	return out;
}

const SKIP = new Set(['link', 'linkReference', 'heading', 'code', 'inlineCode', 'html', 'yaml', 'definition', 'mdxjsEsm', 'mdxJsxFlowElement', 'mdxJsxTextElement', 'mdxFlowExpression', 'mdxTextExpression']);

export default function remarkGlossaryLinks() {
	const terms = loadTerms();
	return (tree, file) => {
		const path = String(file?.path ?? file?.history?.[0] ?? '');
		const m = basename(path).match(/^(ru|en|uz)-(.+)\.mdx?$/);
		if (!m) return;
		const self = /[\\/]glossary[\\/]/.test(path) ? m[2] : null;
		const pending = terms[m[1]].filter((t) => t.slug !== self);
		if (!pending.length) return;
		let left = MAX_LINKS;

		const walk = (node) => {
			if (!node.children || SKIP.has(node.type) || left <= 0) return;
			for (let i = 0; i < node.children.length && left > 0; i++) {
				const child = node.children[i];
				if (child.type !== 'text') { walk(child); continue; }
				// Самое раннее совпадение среди ещё не использованных терминов.
				let best = null;
				for (const t of pending) {
					const hit = t.re.exec(child.value);
					if (hit && (!best || hit.index < best.hit.index)) best = { t, hit };
				}
				if (!best) continue;
				const { t, hit } = best;
				const before = child.value.slice(0, hit.index);
				const after = child.value.slice(hit.index + hit[0].length);
				const parts = [];
				if (before) parts.push({ type: 'text', value: before });
				parts.push({ type: 'link', url: t.url, title: null, data: { hProperties: { class: 'bc-term-link' } }, children: [{ type: 'text', value: hit[0] }] });
				if (after) parts.push({ type: 'text', value: after });
				node.children.splice(i, 1, ...parts);
				pending.splice(pending.indexOf(t), 1);
				left--;
				// Остаток текста после ссылки проверим на следующем шаге цикла.
				i += before ? 1 : 0;
			}
		};
		walk(tree);
	};
}
