/**
 * Структурированные данные (JSON-LD) для лендингов.
 *
 * Отдельным модулем, а не в разметке: три языка × две страницы — шесть
 * объектов, которые обязаны быть согласованы между собой. Расходящиеся
 * @id ломают связывание сущностей: Google перестаёт понимать, что автор
 * курса и директор компании — один человек.
 *
 * ВАЖНО: сюда нельзя писать ничего, чего нет на странице. Разметка,
 * описывающая то, чего в видимом тексте нет, — нарушение правил Google
 * по структурированным данным, и за него снимают расширенные сниппеты.
 * Поэтому: ни цен (их нет в предложении), ни рейтингов, ни отзывов,
 * ни количества выпускников.
 */

const SITE = 'https://www.bridgeconsult.uz';

/** Один и тот же идентификатор организации во всех схемах сайта. */
export const ORG_ID = `${SITE}/#organization`;
/** Один и тот же идентификатор Ларисы: она и founder, и автор программы. */
export const PERSON_ID = `${SITE}/#larisa-belousova`;

const organization = {
	'@type': 'Organization',
	'@id': ORG_ID,
	name: 'BRIDGE Consult',
	legalName: 'BRIDGE Consult LLC',
	url: SITE,
	logo: `${SITE}/bridge%202.svg`,
	email: 'info@bridgeconsult.uz',
	telephone: '+998330001530',
	address: {
		'@type': 'PostalAddress',
		streetAddress: 'Ahmad Donish street, 12th quarter, 20A',
		addressLocality: 'Tashkent',
		postalCode: '100180',
		addressCountry: 'UZ',
	},
	founder: { '@id': PERSON_ID },
};

/**
 * Аккредитации Ларисы. Только те, у которых есть проверяемый адрес:
 * два сертификата FIDIC лежат в реестре credentials.fidic.org и
 * открываются по клику со страницы.
 */
const person = {
	'@type': 'Person',
	'@id': PERSON_ID,
	name: 'Larisa Belousova',
	alternateName: 'Лариса Константиновна Белоусова',
	jobTitle: 'Founder and Director',
	worksFor: { '@id': ORG_ID },
	url: `${SITE}/academy/`,
	image: `${SITE}/larisa-belousova.jpg`,
	hasCredential: [
		{
			'@type': 'EducationalOccupationalCredential',
			name: 'FIDIC Certified Consulting Engineer (FCCE)',
			credentialCategory: 'certification',
			url: 'https://credentials.fidic.org/credential/69f72bbf-bc1f-4f5e-b480-90590afd6440',
			identifier: '69f72bbf-bc1f-4f5e-b480-90590afd6440',
			recognizedBy: {
				'@type': 'Organization',
				name: 'FIDIC Credentialing',
				url: 'https://credentials.fidic.org/',
			},
		},
		{
			'@type': 'EducationalOccupationalCredential',
			name: 'FIDIC Certified Consulting Professional (FCCP)',
			credentialCategory: 'certification',
			url: 'https://credentials.fidic.org/credential/d97d9db8-ab47-4971-81aa-495bfcf78b9e',
			identifier: 'd97d9db8-ab47-4971-81aa-495bfcf78b9e',
			recognizedBy: {
				'@type': 'Organization',
				name: 'FIDIC Credentialing',
				url: 'https://credentials.fidic.org/',
			},
		},
	],
};

type Lang = 'ru' | 'en' | 'uz';

const academyPath: Record<Lang, string> = {
	ru: '/academy/',
	en: '/academy/en/',
	uz: '/academy/uz/',
};
const offerPath: Record<Lang, string> = {
	ru: '/contract-support/',
	en: '/contract-support/en/',
	uz: '/contract-support/uz/',
};

const langTag: Record<Lang, string> = { ru: 'ru', en: 'en', uz: 'uz' };

/**
 * Схема страницы Академии.
 *
 * Course без offers: цену программа не публикует, а придумывать её в
 * разметке нельзя. hasCourseInstance описывает форму проведения — она
 * на странице заявлена прямо: живые занятия онлайн на русском.
 */
export function academySchema(lang: Lang, name: string, description: string) {
	const url = SITE + academyPath[lang];
	return {
		'@context': 'https://schema.org',
		'@graph': [
			organization,
			person,
			{
				'@type': 'Course',
				'@id': `${url}#course`,
				name,
				description,
				url,
				inLanguage: langTag[lang],
				provider: { '@id': ORG_ID },
				author: { '@id': PERSON_ID },
				teaches: [
					'FIDIC contract administration',
					'Claims and Extension of Time',
					'Delay analysis',
					'Dispute avoidance, DAAB and arbitration',
				],
				hasCourseInstance: {
					'@type': 'CourseInstance',
					courseMode: 'online',
					courseWorkload: 'P18D',
					inLanguage: 'ru',
				},
			},
			{
				'@type': 'WebPage',
				'@id': url,
				url,
				name,
				description,
				inLanguage: langTag[lang],
				isPartOf: { '@id': `${SITE}/#website` },
				about: { '@id': `${url}#course` },
			},
		],
	};
}

/**
 * Схема лендинга договорного сопровождения.
 *
 * Service, а не Product: это услуга без фиксированной цены. Три направления
 * из предложения вынесены в hasOfferCatalog — ровно те, что есть на странице.
 */
export function offerSchema(lang: Lang, name: string, description: string, directions: readonly string[]) {
	const url = SITE + offerPath[lang];
	return {
		'@context': 'https://schema.org',
		'@graph': [
			organization,
			person,
			{
				'@type': 'Service',
				'@id': `${url}#service`,
				name,
				description,
				url,
				serviceType: 'Contract administration and claims management',
				provider: { '@id': ORG_ID },
				areaServed: [
					{ '@type': 'Country', name: 'Uzbekistan' },
					{ '@type': 'Country', name: 'Kazakhstan' },
					{ '@type': 'Country', name: 'Kyrgyzstan' },
					{ '@type': 'Country', name: 'Tajikistan' },
				],
				audience: { '@type': 'BusinessAudience', name: 'Construction contractors' },
				hasOfferCatalog: {
					'@type': 'OfferCatalog',
					name,
					itemListElement: directions.map((d) => ({
						'@type': 'OfferCatalog',
						name: d,
					})),
				},
			},
			{
				'@type': 'WebPage',
				'@id': url,
				url,
				name,
				description,
				inLanguage: langTag[lang],
				isPartOf: { '@id': `${SITE}/#website` },
				about: { '@id': `${url}#service` },
			},
		],
	};
}
