// Адреса и подписи словаря FIDIC.
export type Lang = 'ru' | 'en' | 'uz';
export const glossaryIndexUrl = (lang: Lang) => (lang === 'ru' ? '/glossary/' : `/glossary/${lang}/`);
export const glossaryUrl = (lang: Lang, slug: string) => `${glossaryIndexUrl(lang)}${slug}/`;

export const GLOSSARY_T = {
	ru: {
		title: 'Словарь FIDIC',
		pageTitle: 'Словарь FIDIC: термины контрактов простыми словами | Bridge Consult',
		description: 'Словарь терминов FIDIC: DAAB, EOT, Notice of Claim, Variation и другие — что означает каждый термин, где он в контракте и как работает на практике.',
		heroA: 'Словарь',
		heroB: 'FIDIC',
		sub: 'Термины контрактов FIDIC простыми словами: что означает, где в контракте и как работает на практике.',
		search: 'Найти термин',
		empty: 'Термины скоро появятся.',
		nothing: 'Такого термина пока нет.',
		inArticles: 'Этот термин в наших статьях',
		other: 'Другие термины',
		toNews: 'Статьи и аналитика',
	},
	en: {
		title: 'FIDIC Glossary',
		pageTitle: 'FIDIC Glossary: Contract Terms in Plain English | Bridge Consult',
		description: 'FIDIC glossary: DAAB, EOT, Notice of Claim, Variation and more — what each term means, where it sits in the contract and how it works in practice.',
		heroA: 'FIDIC',
		heroB: 'Glossary',
		sub: 'FIDIC contract terms in plain English: what each one means, where it sits in the contract and how it works in practice.',
		search: 'Find a term',
		empty: 'Terms are coming soon.',
		nothing: 'No such term yet.',
		inArticles: 'This term in our articles',
		other: 'Other terms',
		toNews: 'Articles and analysis',
	},
	uz: {
		title: 'FIDIC lugʻati',
		pageTitle: 'FIDIC lugʻati: shartnoma atamalari sodda tilda | Bridge Consult',
		description: 'FIDIC atamalari lugʻati: DAAB, EOT, Notice of Claim, Variation va boshqalar — har bir atama nimani anglatadi, shartnomaning qayerida va amalda qanday ishlaydi.',
		heroA: 'FIDIC',
		heroB: 'lugʻati',
		sub: 'FIDIC shartnomalari atamalari sodda tilda: nimani anglatadi, shartnomaning qayerida va amalda qanday ishlaydi.',
		search: 'Atamani topish',
		empty: 'Atamalar tez orada paydo boʻladi.',
		nothing: 'Bunday atama hozircha yoʻq.',
		inArticles: 'Bu atama maqolalarimizda',
		other: 'Boshqa atamalar',
		toNews: 'Maqolalar va tahlil',
	},
} as const;
