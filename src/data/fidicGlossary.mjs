// Словарь терминов FIDIC RU → UZ для живого переводчика (api/tarjima/say.js,
// tools/translator/server.mjs).
//
// Откуда взят. Русская и узбекская версии страниц /academy/ и
// /contract-support/ (src/data/academy.*.ts, offer.*.ts), пройденные
// параллельно по одинаковым ключам. Сюда попал только термин, чьё узбекское
// соответствие стоит в узбекском тексте сайта на месте русского, — ни одного
// придуманного. Смысл в согласованности: субтитры называют вещи так же, как
// сайт.
//
// Чего здесь нет. Узбекские тексты сайта не вычитаны носителем-юристом,
// значит и словарь не вычитан — его должна пройти глазами Лариса
// Константиновна. Терминов, у которых на сайте нет узбекской пары
// (форс-мажор, дефекты), здесь тоже нет: их модель переводит сама.
//
// Прежняя версия файла была не словарём, а подписями интерфейса сайта
// («Отправить заявку», «Листайте вниз»): в речи они не звучат, а вырванные
// из контекста пары вроде «проектов = loyihalar uchun» портили перевод.
//
// Лежит вне api/: Vercel считает функцией каждый .js внутри api/.
//
// en — как термин звучит в лекции по-английски; его оставляют как есть.

export const TERMS = [
  // Стороны и участники
  { ru: 'Инженер', uz: 'Muhandis' },
  { ru: 'Заказчик', uz: 'Buyurtmachi' },
  { ru: 'Подрядчик', uz: 'Pudratchi' },
  { ru: 'субподрядчик', uz: 'subpudratchi' },
  { ru: 'поставщик', uz: 'yetkazib beruvchi' },
  { ru: 'сметчик', uz: 'smetachi', en: 'QS' },
  { ru: 'планировщик', uz: 'rejalashtiruvchi', en: 'planner' },

  // Контракт и документы
  { ru: 'контракт', uz: 'shartnoma' },
  { ru: 'договор субподряда', uz: 'subpudrat shartnomasi' },
  { ru: 'пункт', uz: 'band' },
  { ru: 'раздел', uz: 'bo‘lim' },
  { ru: 'договорная переписка', uz: 'shartnomaviy yozishmalar' },
  { ru: 'переписка', uz: 'yozishmalar' },
  { ru: 'протокол', uz: 'bayonnoma' },
  { ru: 'исполнительная документация', uz: 'ijro hujjatlari' },
  { ru: 'исполнительные схемы', uz: 'ijro chizmalari' },
  { ru: 'текущие записи', uz: 'joriy yozuvlar', en: 'contemporary records' },
  { ru: 'представления на согласование', uz: 'kelishuvga taqdim etishlar', en: 'Submittals' },
  { ru: 'согласование', uz: 'kelishuv' },
  { ru: 'программа работ', uz: 'ishlar dasturi', en: 'Programme' },

  // Уведомления, претензии, споры
  { ru: 'уведомление', uz: 'xabarnoma', en: 'notice' },
  { ru: 'пресекательный срок', uz: 'qat’iy muddat' },
  { ru: 'претензионная работа', uz: 'da’vo ishi' },
  { ru: 'претензионная процедура', uz: 'da’vo tartibi' },
  { ru: 'претензия', uz: 'da’vo', en: 'Claim' },
  { ru: 'право требования', uz: 'talab huquqi', en: 'entitlement' },
  { ru: 'встречные требования', uz: 'qarshi talablar' },
  { ru: 'требование', uz: 'talab' },
  { ru: 'причинно-следственная связь', uz: 'sabab-oqibat bog‘lanishi' },
  { ru: 'доказательная база', uz: 'dalillar bazasi' },
  { ru: 'доказательства', uz: 'dalillar' },
  { ru: 'определение Инженера', uz: 'Muhandis qarori', en: 'Determination' },
  { ru: 'совет по спорам', uz: 'nizolar kengashi', en: 'DAAB' },
  { ru: 'предотвращение споров', uz: 'nizolarning oldini olish' },
  { ru: 'спор', uz: 'nizo' },
  { ru: 'арбитраж', uz: 'arbitraj' },

  // Сроки
  { ru: 'продление срока завершения', uz: 'tugatish muddatini uzaytirish' },
  { ru: 'продление срока', uz: 'muddatni uzaytirish', en: 'EOT' },
  { ru: 'задержка', uz: 'kechikish' },
  { ru: 'мобилизация', uz: 'mobilizatsiya' },
  { ru: 'приостановление работ', uz: 'ishlarni to‘xtatib turish' },
  { ru: 'приостановление', uz: 'to‘xtatib turish' },
  { ru: 'расторжение', uz: 'bekor qilish' },

  // Изменения и затраты
  { ru: 'изменение', uz: 'o‘zgartirish', en: 'Variation' },
  { ru: 'дополнительные работы', uz: 'qo‘shimcha ishlar' },
  { ru: 'дополнительные затраты', uz: 'qo‘shimcha xarajatlar' },
  { ru: 'затраты', uz: 'xarajatlar', en: 'Cost' },
  { ru: 'распределение рисков', uz: 'risklarni taqsimlash' },
  { ru: 'объёмы', uz: 'hajmlar' },

  // Платежи и обеспечения
  { ru: 'промежуточный платёжный сертификат', uz: 'oraliq to‘lov sertifikati', en: 'IPC' },
  { ru: 'промежуточный платёж', uz: 'oraliq to‘lov' },
  { ru: 'сертификация', uz: 'sertifikatlash' },
  { ru: 'авансовый платёж', uz: 'avans to‘lovi', en: 'Advance Payment' },
  { ru: 'аванс', uz: 'avans' },
  { ru: 'банковская гарантия', uz: 'bank kafolati' },
  { ru: 'гарантия', uz: 'kafolat' },
  { ru: 'обеспечение', uz: 'ta’minot' },
  { ru: 'удержание', uz: 'ushlab qolish', en: 'Retention' },
  { ru: 'корректировка цены', uz: 'narx korreksiyasi' },
  { ru: 'денежный поток', uz: 'pul oqimi' },
  { ru: 'неоплата', uz: 'to‘lanmaganlik' },
  { ru: 'проценты за несвоевременный платёж', uz: 'o‘z vaqtida to‘lanmagan to‘lov uchun foizlar' },
  { ru: 'штрафные санкции', uz: 'jarima sanksiyalari' },
  { ru: 'штраф', uz: 'jarima' },
  { ru: 'ликвидные убытки', uz: 'likvid zararlar' },

  // Завершение
  { ru: 'приёмка', uz: 'qabul qilish', en: 'Taking-Over' },
  { ru: 'испытания', uz: 'sinovlar' },
  { ru: 'перечень недоделок', uz: 'kamchiliklar ro‘yxati', en: 'punch list' },
  { ru: 'период гарантийных обязательств', uz: 'kafolat majburiyatlari davri', en: 'DNP' },
  { ru: 'итоговый расчёт', uz: 'yakuniy hisob-kitob', en: 'Final Statement' },

  // Площадка
  { ru: 'строительная площадка', uz: 'qurilish maydoni' },
];

const norm = (s) => s.toLowerCase().replace(/ё/g, 'е');
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Русское слово меняет окончание, основа остаётся. Отрезаем от словарной
 * формы столько, сколько обычно занимает окончание, и разрешаем любое своё,
 * но ограниченной длины — иначе «спор» совпал бы со «спортивным».
 */
function wordPattern(word) {
  const w = norm(word);
  if (!/[а-я]/.test(w)) return escape(w);
  const cut = w.length >= 7 ? 2 : w.length >= 5 ? 1 : 0;
  return escape(w.slice(0, w.length - cut)) + `[а-я]{0,${cut + 3}}`;
}

// Длинные первыми: «продление срока завершения» забирает фразу раньше, чем
// «продление срока».
const COMPILED = [...TERMS]
  .sort((a, b) => b.ru.length - a.ru.length)
  .map((term) => ({
    term,
    patterns: [
      new RegExp(
        '(?<![а-я])' + term.ru.split(/\s+/).map(wordPattern).join('\\s+') + '(?![а-я])',
        'gu',
      ),
      term.en && new RegExp('(?<![a-z])' + escape(term.en.toLowerCase()) + '(?![a-z])', 'gu'),
    ].filter(Boolean),
  }));

/**
 * Термины, которые реально прозвучали во фразе, в любом падеже. Термин,
 * целиком лежащий внутри уже найденного более длинного, не повторяется.
 */
export function findTerms(text, limit = 20) {
  const s = norm(text);
  const taken = [];
  const hits = [];
  const overlaps = (a, b) => taken.some(([x, y]) => a < y && b > x);

  for (const { term, patterns } of COMPILED) {
    let found = false;
    for (const re of patterns) {
      re.lastIndex = 0;
      for (let m = re.exec(s); m; m = re.exec(s)) {
        const end = m.index + m[0].length;
        if (overlaps(m.index, end)) continue;
        taken.push([m.index, end]);
        found = true;
      }
    }
    if (found) hits.push(term);
    if (hits.length >= limit) break;
  }
  return hits;
}

export default TERMS;
