/**
 * Подписи самого интерфейса — те, что живут не в тексте страницы, а в её
 * механике: подсказка про свайп, кнопки «показать всё», заголовок колонки
 * с моделями оплаты, aria-подписи.
 *
 * Почему отдельным файлом, а не в offer.*.ts / academy.*.ts. Компоненты
 * презентационные и весь контент получают пропсами, но у некоторых есть
 * собственная обвязка, которую ни один вызов не передаёт. Её подписи жили
 * значениями по умолчанию прямо в компонентах — и все были русскими. На
 * /academy/en/ и /contract-support/uz/ это вылезало русским текстом посреди
 * перевода: «Листайте вбок», «Показать все», «Читать дальше», «Модели
 * оплаты», «открыть сертификат». Передавать их пропсами через каждый вызов
 * бессмысленно: ровно так их и забыли передать. Здесь они лежат сразу на
 * трёх языках, а компонент берёт нужный по адресу страницы.
 */

export type UiLang = 'ru' | 'en' | 'uz';

/**
 * Язык страницы по её адресу: /academy/en/ → en, /contract-support/uz/ → uz,
 * всё остальное — русская версия. Сегмент ищем в любом месте пути, чтобы
 * вложенные страницы языковой версии тоже определялись верно.
 */
export function pageLang(pathname: string): UiLang {
	const segments = pathname.split('/').filter(Boolean);
	if (segments.includes('en')) return 'en';
	if (segments.includes('uz')) return 'uz';
	return 'ru';
}

interface Chrome {
	/** Подсказка над горизонтальной лентой карточек на телефоне. */
	swipe: string;
	/** aria-подпись полосы разделов в мобильной шапке. */
	sections: string;
	/** Хвост подписи к знакам FIDIC: «… — открыть сертификат». */
	openCert: string;
	/** Раскрыть свёрнутый список целиком. */
	showAll: string;
	/** Раскрыть свёрнутый текст (биография, оговорки). */
	readMore: string;
	/** Свернуть обратно — общая для обоих случаев. */
	showLess: string;
	/** Заголовок колонки с моделями оплаты в блоке стоимости. */
	paymentModels: string;
}

export const chrome: Record<UiLang, Chrome> = {
	ru: {
		swipe: 'Листайте вбок',
		sections: 'Разделы страницы',
		openCert: 'открыть сертификат',
		showAll: 'Показать все',
		readMore: 'Читать дальше',
		showLess: 'Свернуть',
		paymentModels: 'Модели оплаты',
	},
	en: {
		swipe: 'Swipe sideways',
		sections: 'Page sections',
		openCert: 'open the certificate',
		showAll: 'Show all',
		readMore: 'Read more',
		showLess: 'Show less',
		paymentModels: 'Payment models',
	},
	uz: {
		swipe: 'Yonga suring',
		sections: "Sahifa bo'limlari",
		openCert: 'sertifikatni ochish',
		showAll: "Barchasini ko'rsatish",
		readMore: "Davomini o'qish",
		showLess: 'Yopish',
		paymentModels: "To'lov modellari",
	},
};

/** Подписи интерфейса для страницы по её адресу. */
export const uiFor = (pathname: string): Chrome => chrome[pageLang(pathname)];
