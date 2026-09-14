// Словарь терминов FIDIC RU → UZ для живого переводчика (api/tarjima/say.js,
// tools/translator/server.mjs, tools/translator/eval.mjs).
//
// Откуда взят — только из уже опубликованного, ни одного придуманного:
//   • bridgeconsult.uz — русская и узбекская версии /academy/ и
//     /contract-support/ (src/data/academy.*.ts, offer.*.ts), пройденные
//     параллельно по одинаковым ключам;
//   • fidic.uz — глоссарий (src/data/glossary.ts) и названия пунктов в
//     справочнике (src/data/clauseReference.ts).
//
// Где сайты расходятся, взят один вариант: сначала bridgeconsult.uz (сайт
// компании, чьи это лекции), затем глоссарий fidic.uz. Модели нужен один
// термин на одно понятие, иначе она будет называть одно и то же по-разному.
// Все расхождения — в tools/translator/TERMS-TO-CONFIRM.md.
//
// Чего здесь нет. Узбекские тексты обоих сайтов не вычитаны носителем-юристом
// (справочник fidic.uz сам помечен «should be reviewed by a FIDIC specialist»),
// значит и словарь не вычитан. Его должна пройти глазами Лариса Константиновна.
//
// Лежит вне api/: Vercel считает функцией каждый .js внутри api/.
//
// Поля:
//   en  — как термин звучит по-английски; модель оставляет его как есть;
//   asr — как распознавание Chrome записывает английский термин русскими
//         буквами. Совпадает только целым словом с коротким окончанием,
//         чтобы «клей» не стал «клеймом».

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
  { ru: 'ведомость объёмов', uz: 'hajmlar qaydnomasi', en: 'BoQ', asr: ['боку', 'би о кью'] },
  { ru: 'проектирование', uz: 'loyihalash', en: 'Design' },
  { ru: 'гармонизированная форма МФО', uz: 'XTB uyg‘unlashtirilgan shakli', en: 'Pink Book' },

  // Уведомления, претензии, споры
  { ru: 'уведомление о несогласии', uz: 'rozilik bildirmaslik xabari', en: 'Notice of Dissatisfaction' },
  { ru: 'уведомление', uz: 'xabarnoma', en: 'notice' },
  { ru: 'заблаговременное предупреждение', uz: 'oldindan ogohlantirish', en: 'Advance Warning' },
  { ru: 'пресекательный срок', uz: 'qat’iy muddat', en: 'time-bar' },
  { ru: 'претензионная работа', uz: 'da’vo ishi' },
  { ru: 'претензионная процедура', uz: 'da’vo tartibi' },
  { ru: 'претензия', uz: 'da’vo', en: 'Claim', asr: ['клейм', 'клэйм'] },
  { ru: 'право требования', uz: 'talab huquqi', en: 'entitlement' },
  { ru: 'встречные требования', uz: 'qarshi talablar' },
  { ru: 'требование', uz: 'talab' },
  { ru: 'причинно-следственная связь', uz: 'sabab-oqibat bog‘lanishi' },
  { ru: 'доказательная база', uz: 'dalillar bazasi' },
  { ru: 'доказательства', uz: 'dalillar' },
  { ru: 'определение Инженера', uz: 'Muhandis qarori', en: 'Determination' },
  { ru: 'совет по спорам', uz: 'nizolar kengashi', en: 'DAAB', asr: ['дааб', 'даб'] },
  { ru: 'предотвращение споров', uz: 'nizolarning oldini olish' },
  { ru: 'спор', uz: 'nizo' },
  { ru: 'арбитраж', uz: 'arbitraj' },

  // Сроки
  { ru: 'продление срока завершения', uz: 'tugatish muddatini uzaytirish' },
  { ru: 'продление срока', uz: 'muddatni uzaytirish', en: 'EOT', asr: ['иоти', 'и о ти', 'еот'] },
  { ru: 'задержка', uz: 'kechikish' },
  { ru: 'мобилизация', uz: 'mobilizatsiya' },
  { ru: 'приостановление работ', uz: 'ishlarni to‘xtatib turish', en: 'Suspension' },
  { ru: 'приостановка работ', uz: 'ishlarni to‘xtatib turish' },
  { ru: 'приостановление', uz: 'to‘xtatib turish' },
  { ru: 'расторжение', uz: 'bekor qilish' },

  // Изменения и затраты
  { ru: 'изменение', uz: 'o‘zgartirish', en: 'Variation', asr: ['вариэйшн', 'вариейшн', 'вэриэйшн'] },
  { ru: 'оптимизация стоимости', uz: 'qiymatni optimallashtirish', en: 'Value Engineering' },
  { ru: 'дополнительные работы', uz: 'qo‘shimcha ishlar' },
  { ru: 'дополнительные затраты', uz: 'qo‘shimcha xarajatlar' },
  { ru: 'затраты', uz: 'xarajatlar', en: 'Cost' },
  { ru: 'распределение рисков', uz: 'risklarni taqsimlash' },
  { ru: 'непредвиденные условия', uz: 'oldindan ko‘rib bo‘lmaydigan sharoitlar', en: 'Unforeseeable Conditions' },
  { ru: 'исключительное событие', uz: 'istisno hodisa', en: 'Exceptional Event' },
  { ru: 'условная сумма', uz: 'shartli summa', en: 'Provisional Sum' },
  { ru: 'обмер', uz: 'o‘lchash', en: 'Measurement' },
  { ru: 'объёмы', uz: 'hajmlar' },

  // Платежи и обеспечения
  { ru: 'промежуточный платёжный сертификат', uz: 'oraliq to‘lov sertifikati', en: 'IPC', asr: ['иписи', 'ай пи си', 'айписи'] },
  { ru: 'промежуточный платёж', uz: 'oraliq to‘lov' },
  { ru: 'сертификация', uz: 'sertifikatlash' },
  { ru: 'авансовый платёж', uz: 'avans to‘lovi', en: 'Advance Payment' },
  { ru: 'аванс', uz: 'avans' },
  { ru: 'банковская гарантия', uz: 'bank kafolati' },
  { ru: 'обеспечение исполнения', uz: 'bajarilish ta’minoti', en: 'Performance Security' },
  { ru: 'гарантия', uz: 'kafolat' },
  { ru: 'обеспечение', uz: 'ta’minot' },
  { ru: 'гарантийные удержания', uz: 'kafolat ushlab qolishlari', en: 'Retention Money' },
  { ru: 'удержание', uz: 'ushlab qolish', en: 'Retention' },
  { ru: 'корректировка цены', uz: 'narx korreksiyasi' },
  { ru: 'денежный поток', uz: 'pul oqimi' },
  { ru: 'неоплата', uz: 'to‘lanmaganlik' },
  { ru: 'проценты за несвоевременный платёж', uz: 'o‘z vaqtida to‘lanmagan to‘lov uchun foizlar' },
  { ru: 'неустойка за просрочку', uz: 'kechikish uchun jarima', en: 'Delay Damages' },
  { ru: 'штрафные санкции', uz: 'jarima sanksiyalari' },
  { ru: 'штраф', uz: 'jarima' },
  { ru: 'ликвидные убытки', uz: 'likvid zararlar' },
  { ru: 'ограничение ответственности', uz: 'javobgarlikni cheklash', en: 'Limitation of Liability' },
  { ru: 'страхование', uz: 'sug‘urta', en: 'Insurance' },

  // Завершение
  { ru: 'акт приёмки', uz: 'qabul qilish dalolatnomasi', en: 'Taking-Over Certificate', asr: ['тейкинг овер', 'тэйкинг овер'] },
  { ru: 'приёмка', uz: 'qabul qilish', en: 'Taking-Over' },
  { ru: 'испытания при завершении', uz: 'yakunlashda sinovlar', en: 'Tests on Completion' },
  { ru: 'испытания после завершения', uz: 'yakunlashdan keyingi sinovlar', en: 'Tests after Completion' },
  { ru: 'испытания', uz: 'sinovlar' },
  { ru: 'перечень недоделок', uz: 'kamchiliklar ro‘yxati', en: 'punch list' },
  { ru: 'период уведомления о дефектах', uz: 'nuqsonlar xabar berish davri', en: 'DNP', asr: ['ди эн пи'] },
  { ru: 'период гарантийных обязательств', uz: 'kafolat majburiyatlari davri' },
  { ru: 'сертификат исполнения', uz: 'bajarilish sertifikati', en: 'Performance Certificate' },
  { ru: 'итоговый расчёт', uz: 'yakuniy hisob-kitob', en: 'Final Statement' },

  // Площадка
  { ru: 'строительная площадка', uz: 'qurilish maydoni' },
];

const norm = (s) => s.toLowerCase().replace(/ё/g, 'е');
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Русское слово меняет окончание, основа остаётся. Отрезаем от словарной
 * формы столько, сколько обычно занимает окончание, и разрешаем любое своё,
 * но ограниченной длины — иначе «спор» совпал бы со «спортивным». Короткое
 * слово на гласную теряет её («база» → «базы»), на согласную — остаётся
 * целым («спор» не должен стать «способом»).
 */
function wordPattern(word) {
  const w = norm(word);
  if (!/[а-я]/.test(w)) return escape(w);
  const cut = w.length >= 7 ? 2 : w.length >= 5 || /[аяоеиыуюь]$/.test(w) ? 1 : 0;
  return escape(w.slice(0, w.length - cut)) + `[а-я]{0,${cut + 3}}`;
}

const CYR = (body) => new RegExp('(?<![а-я])' + body + '(?![а-я])', 'gu');

// Длинные первыми: «продление срока завершения» забирает фразу раньше, чем
// «продление срока».
const COMPILED = [...TERMS]
  .sort((a, b) => b.ru.length - a.ru.length)
  .map((term) => ({
    term,
    patterns: [
      CYR(term.ru.split(/\s+/).map(wordPattern).join('\\s+')),
      term.en && new RegExp('(?<![a-z])' + escape(term.en.toLowerCase()) + '(?![a-z])', 'gu'),
      // Искажённый английский: слово как есть и максимум два буквы окончания.
      ...(term.asr ?? []).map((a) =>
        CYR(norm(a).split(/\s+/).map(escape).join('\\s+') + '[а-я]{0,2}'),
      ),
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
