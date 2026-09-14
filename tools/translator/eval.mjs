#!/usr/bin/env node
/**
 * Замер точности и скорости переводчика — на настоящем проде, настоящими
 * вызовами модели. Поэтому стоит денег: 30 фраз, по оценке около $0.15–0.25.
 * Без --yes только печатает план и ничего не отправляет.
 *
 *   TARJIMA_KEY=… node tools/translator/eval.mjs --yes
 *   TARJIMA_KEY=… node tools/translator/eval.mjs --yes --url https://www.bridgeconsult.uz
 *
 * Фразы уходят в /api/tarjima/say по одной и с контекстом — ровно как со
 * страницы преподавателя, — но в отдельную комнату «eval», которую слушатели
 * основной ленты не видят. До и после комната очищается.
 *
 * Фразы написаны так, как их отдаёт распознавание Chrome: строчными, без
 * пунктуации, с английскими терминами русскими буквами, с оборванной фразой
 * и с междометием.
 *
 * Автоматически проверяется то, что проверяется без знания узбекского:
 * числа сохранены, английские термины восстановлены, термины словаря
 * использованы, в переводе нет кириллицы, задержка. СМЫСЛ перевода скрипт не
 * оценивает — для этого пишется таблица tarjima-eval-<дата>.md, которую должен
 * прочитать человек, знающий узбекский.
 */

import fs from 'node:fs';
import { findTerms } from '../../src/data/fidicGlossary.mjs';

const args = process.argv.slice(2);
const YES = args.includes('--yes');
const URL_BASE = (args[args.indexOf('--url') + 1] && args.includes('--url') ? args[args.indexOf('--url') + 1] : 'https://www.bridgeconsult.uz').replace(/\/$/, '');
const KEY = process.env.TARJIMA_KEY;
const ROOM = 'eval';

/** [фраза как из распознавания, английские термины, которые должны стоять в переводе] */
const PHRASES = [
  ['сегодня мы разбираем порядок претензий подрядчика по контракту фидик', ['FIDIC']],
  ['по пункту 20.1 уведомление о претензии подаётся в течение 28 дней', []],
  ['если подрядчик пропустил этот срок он теряет право на продление срока и дополнительные затраты', []],
  ['инженер обязан рассмотреть претензию и принять определение по пункту 3.7', []],
  ['определение инженера должно быть нейтральным даже если его назначил заказчик', []],
  ['теперь поговорим о вариэйшн то есть об изменениях', ['Variation']],
  ['изменение может инициировать только инженер своим указанием', []],
  ['подрядчик вправе запросить продление срока завершения если задержка произошла по вине заказчика', []],
  ['очень важно вести текущие записи на площадке каждый день', []],
  ['без доказательной базы ни один клейм не выдержит проверки в дааб', ['Claim', 'DAAB']],
  ['промежуточный платёжный сертификат инженер выдаёт в течение 28 дней после получения заявления', []],
  ['за несвоевременный платёж подрядчик получает проценты по пункту 14.8', []],
  ['удержания возвращаются двумя половинами первая после приёмки вторая после периода гарантийных обязательств', []],
  ['банковская гарантия должна действовать до выдачи сертификата исполнения', []],
  ['авансовый платёж погашается из промежуточных платежей', []],
  ['если заказчик не платит подрядчик может приостановить работы но только после уведомления', []],
  ['расторжение контракта это крайняя мера', []],
  ['споры сначала идут в совет по спорам и только потом в арбитраж', []],
  ['уведомление о несогласии нужно подать в течение 28 дней', []],
  ['исключительное событие это то что раньше называлось форс мажор', []],
  ['непредвиденные условия на площадке дают право и на время и на деньги', []],
  ['в ведомости объёмов стоимость определяется по фактически выполненным объёмам', []],
  ['условная сумма расходуется только по указанию инженера', []],
  ['неустойка за просрочку ограничена максимальной суммой', []],
  ['в итоговом расчёте подрядчик должен заявить все свои требования', []],
  ['программа работ это не просто график это договорной документ', []],
  ['так ну вот', []],
  ['подрядчик направил уведомление но инженер', []],
  ['иписи за март до сих пор не подписан', ['IPC']],
  ['в красной книге проектирует заказчик а в жёлтой подрядчик', ['Red Book', 'Yellow Book']],
];

const APOS = /[ʻ‘’'`ʼ]/g;
const normUz = (s) => s.toLowerCase().replace(APOS, "'");

/** Узбекское соответствие термина есть в переводе — по основам слов, суффиксы не мешают. */
function usesTerm(uz, term) {
  const hay = normUz(uz);
  return normUz(term.uz)
    .split(/\s+/)
    .every((w) => hay.includes(w.length > 5 ? w.slice(0, w.length - 2) : w));
}

const pct = (n, d) => (d ? `${Math.round((100 * n) / d)}%` : '—');
const quantile = (xs, q) => {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.floor(q * s.length))];
};

async function post(body) {
  const r = await fetch(`${URL_BASE}/api/tarjima/say`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ key: KEY, room: ROOM, ...body }),
  });
  if (!r.ok) throw new Error(`${r.status} ${(await r.text()).slice(0, 200)}`);
  return r.json();
}

console.log(`Замер переводчика: ${PHRASES.length} фраз → ${URL_BASE}, комната «${ROOM}».`);
if (!KEY) {
  console.log('Нужен ключ преподавателя: TARJIMA_KEY=… node tools/translator/eval.mjs --yes');
  process.exit(1);
}
if (!YES) {
  console.log('Каждая фраза — платный вызов модели, всего около $0.15–0.25. Запустить: добавьте --yes.');
  process.exit(0);
}

await post({ reset: true });

const rows = [];
const context = [];
for (const [ru, english] of PHRASES) {
  const t0 = Date.now();
  let ev;
  try {
    ev = await post({ text: ru, context: context.slice(-3) });
  } catch (e) {
    ev = { ru, uz: '', raw: true, error: String(e.message) };
  }
  const roundTrip = Date.now() - t0;

  const uz = ev.raw ? '' : ev.uz;
  const numbers = ru.match(/\d+(?:\.\d+)?/g) ?? [];
  const terms = findTerms(ru);
  const row = {
    ru,
    uz: ev.uz,
    error: ev.error,
    roundTrip,
    modelMs: ev.modelMs,
    cost: ev.cost ?? 0,
    cacheRead: ev.tokens?.cacheRead ?? 0,
    checks: {
      translated: !ev.raw,
      numbers: numbers.every((n) => uz.includes(n)),
      english: english.every((w) => uz.toLowerCase().includes(w.toLowerCase())),
      glossary: terms.every((t) => usesTerm(uz, t)),
      latin: !/[а-яё]/i.test(uz),
    },
    missedTerms: terms.filter((t) => !usesTerm(uz, t)).map((t) => `${t.ru} → ${t.uz}`),
    wantNumbers: numbers.length > 0,
    wantEnglish: english.length > 0,
    wantTerms: terms.length > 0,
  };
  rows.push(row);
  if (!ev.raw) {
    context.push({ ru, uz: ev.uz });
    if (context.length > 3) context.shift();
  }
  const mark = Object.values(row.checks).every(Boolean) ? 'OK  ' : 'FAIL';
  console.log(`${mark} ${(roundTrip / 1000).toFixed(1)}s  ${ru}\n       ${ev.raw ? '[не переведено] ' + (ev.error ?? '') : ev.uz}`);
}

await post({ reset: true });

// ——— итог ———
const done = rows.filter((r) => r.checks.translated);
const lat = done.map((r) => r.roundTrip);
const model = done.map((r) => r.modelMs).filter(Boolean);
const count = (key, want) => {
  const pool = rows.filter((r) => r.checks.translated && (want ? r[want] : true));
  return `${pct(pool.filter((r) => r.checks[key]).length, pool.length)} (${pool.filter((r) => r.checks[key]).length}/${pool.length})`;
};
const totalCost = rows.reduce((s, r) => s + r.cost, 0);

const summary = [
  `переведено:              ${pct(done.length, rows.length)} (${done.length}/${rows.length})`,
  `числа сохранены:         ${count('numbers', 'wantNumbers')}`,
  `английские термины:      ${count('english', 'wantEnglish')}`,
  `термины словаря:         ${count('glossary', 'wantTerms')}`,
  `без кириллицы:           ${count('latin')}`,
  `до субтитра, медиана:    ${(quantile(lat, 0.5) / 1000).toFixed(1)} с  (95% фраз быстрее ${(quantile(lat, 0.95) / 1000).toFixed(1)} с)`,
  `из них модель, медиана:  ${(quantile(model, 0.5) / 1000).toFixed(1)} с`,
  `кэш словаря сработал:    ${pct(done.filter((r) => r.cacheRead > 0).length, done.length)} фраз`,
  `стоимость замера:        ≈ $${totalCost.toFixed(3)}  (≈ $${(totalCost / Math.max(done.length, 1)).toFixed(4)} за фразу)`,
];
console.log('\n' + summary.join('\n'));

const date = new Date().toISOString().slice(0, 10);
const file = `tarjima-eval-${date}.md`;
const md = [
  `# Замер переводчика — ${date}`,
  '',
  '```',
  ...summary,
  '```',
  '',
  'Смысл перевода автоматически не проверялся. Прочитайте таблицу и отметьте фразы, где перевод неверен или термин передан не так.',
  '',
  '| # | Русский (как распознано) | Узбекский | с | Замечания проверки |',
  '|---|---|---|---|---|',
  ...rows.map((r, i) => {
    const notes = [
      !r.checks.translated && `не переведено: ${r.error ?? ''}`,
      r.checks.translated && !r.checks.numbers && 'потеряно число',
      r.checks.translated && !r.checks.english && 'не восстановлен английский термин',
      r.missedTerms.length && r.checks.translated && `не по словарю: ${r.missedTerms.join('; ')}`,
      r.checks.translated && !r.checks.latin && 'есть кириллица',
    ].filter(Boolean);
    const cell = (s) => String(s ?? '').replace(/\|/g, '\\|');
    return `| ${i + 1} | ${cell(r.ru)} | ${cell(r.checks.translated ? r.uz : '—')} | ${(r.roundTrip / 1000).toFixed(1)} | ${cell(notes.join('. '))} |`;
  }),
  '',
].join('\n');
fs.writeFileSync(file, md);
console.log(`\nТаблица для проверки человеком: ${file}`);
