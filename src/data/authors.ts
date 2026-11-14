// Кто отвечает за материал: редакция Bridge Consult и, если указан, эксперт, под чьей редакцией он вышел.
// @id эксперта тот же, что на главной и на /larisa/, чтобы поисковик видел одного человека.
const ORIGIN = 'https://www.bridgeconsult.uz';

export const EXPERTS = {
	larisa: {
		id: `${ORIGIN}/#larisa-belousova`,
		url: `${ORIGIN}/larisa/`,
		photo: '/larisa-belousova.jpg',
		name: { ru: 'Лариса Белоусова', en: 'Larissa Belousova', uz: 'Larisa Belousova' },
		role: {
			ru: 'FIDIC Certified Consulting Engineer (FCCE), основатель Bridge Consult',
			en: 'FIDIC Certified Consulting Engineer (FCCE), founder of Bridge Consult',
			uz: 'FIDIC Certified Consulting Engineer (FCCE), Bridge Consult asoschisi',
		},
	},
} as const;

export type ExpertKey = keyof typeof EXPERTS;

export function articleAuthor(expert: string | undefined, pageUrl: string) {
	const org = { '@type': 'Organization', name: 'Bridge Consult', url: new URL('/', pageUrl).toString() };
	const e = expert ? EXPERTS[expert as ExpertKey] : undefined;
	if (!e) return org;
	return [
		{ '@type': 'Person', '@id': e.id, name: e.name.en, url: e.url, jobTitle: 'Founder & Director, FIDIC Certified Consulting Engineer', worksFor: { '@type': 'Organization', name: 'Bridge Consult' } },
		org,
	];
}

export function faqJsonLd(faq: { q: string; a: string }[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
	};
}
