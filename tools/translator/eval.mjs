#!/usr/bin/env node
/**
 * Замер точности и скорости переводчика — на настоящем проде, настоящими
 * вызовами модели. Поэтому стоит денег. Без --yes только печатает план и
 * ничего не отправляет.
 *
 *   TARJIMA_KEY=… node tools/translator/eval.mjs --yes
 *   TARJIMA_KEY=… node tools/translator/eval.mjs --yes --models claude-opus-5,claude-sonnet-5
 *   TARJIMA_KEY=… node tools/translator/eval.mjs --yes --limit 10
 *
 *   --models  через запятую, из VARIANTS в api/tarjima/say.js; по умолчанию —
 *             та модель, что стоит на сервере
 *   --limit   сколько фраз взять (по умолчанию все 30)
 *   --url     по умолчанию https://www.bridgeconsult.uz
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
 * прочитать человек, знающий узбекский. При сравнении нескольких моделей
 * колонки подписаны буквами, а какая буква какая модель — в самом конце:
 * чтобы проверяющий не знал заранее, где дорогая.
 */

import fs from 'node:fs';
import { findTerms } from '../../src/data/fidicGlossary.mjs';

const args = process.argv.slice(2);
const opt = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
const YES = args.includes('--yes');
const URL_BASE = (opt('--url') ?? 'https://www.bridgeconsult.uz').replace(/\/$/, '');
const MODELS = (opt('--models') ?? '').split(',').map((s) => s.trim()).filter(Boolean);
const KEY = process.env.TARJIMA_KEY;
const ROOM = 'eval';

/** [фраза как из распознавания, английские термины, которые должны стоять в переводе] */
const ALL_PHRASES = [
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
const PHRASES = ALL_PHRASES.slice(0, Number(opt('--limit')) || ALL_PHRASES.length);

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
const sec = (ms) => `${(ms / 1000).toFixed(1)} с`;

async function post(body) {
  const r = await fetch(`${URL_BASE}/api/tarjima/say`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ key: KEY, room: ROOM, ...body }),
  });
  if (!r.ok) throw new Error(`${r.status} ${(await r.text()).slice(0, 200)}`);
  return r.json();
}

/** Все фразы через одну модель, по порядку и с контекстом, как на лекции. */
async function runModel(model) {
  const rows = [];
  const context = [];
  for (const [ru, english] of PHRASES) {
    const t0 = Date.now();
    let ev;
    try {
      ev = await post({ text: ru, context: context.slice(-4), ...(model && { model }) });
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
      model: ev.model,
      region: ev.region,
      roundTrip,
      modelMs: ev.modelMs,
      cost: ev.cost ?? 0,
      out: ev.tokens?.out ?? 0,
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
      if (context.length > 4) context.shift();
    }
    const mark = Object.values(row.checks).every(Boolean) ? 'OK  ' : 'FAIL';
    console.log(`${mark} ${sec(roundTrip).padStart(6)}  ${ru}\n              ${ev.raw ? '[не переведено] ' + (ev.error ?? '') : ev.uz}`);
  }
  return rows;
}

function summarize(rows) {
  const done = rows.filter((r) => r.checks.translated);
  const share = (key, want) => {
    const pool = done.filter((r) => (want ? r[want] : true));
    const good = pool.filter((r) => r.checks[key]).length;
    return `${pct(good, pool.length)} (${good}/${pool.length})`;
  };
  const totalCost = rows.reduce((s, r) => s + r.cost, 0);
  return {
    model: rows.find((r) => r.model)?.model ?? '?',
    region: rows.find((r) => r.region)?.region ?? '?',
    translated: `${pct(done.length, rows.length)} (${done.length}/${rows.length})`,
    numbers: share('numbers', 'wantNumbers'),
    english: share('english', 'wantEnglish'),
    glossary: share('glossary', 'wantTerms'),
    latin: share('latin'),
    roundTrip50: quantile(done.map((r) => r.roundTrip), 0.5),
    roundTrip95: quantile(done.map((r) => r.roundTrip), 0.95),
    model50: quantile(done.map((r) => r.modelMs).filter(Boolean), 0.5),
    model95: quantile(done.map((r) => r.modelMs).filter(Boolean), 0.95),
    out50: quantile(done.map((r) => r.out), 0.5),
    cache: pct(done.filter((r) => r.cacheRead > 0).length, done.length),
    cost: totalCost,
    perPhrase: totalCost / Math.max(done.length, 1),
  };
}

// ——— запуск ———

const variants = MODELS.length ? MODELS : [null];
console.log(`Замер переводчика: ${PHRASES.length} фраз × ${variants.length} модел${variants.length > 1 ? 'и' : 'ь'} → ${URL_BASE}, комната «${ROOM}».`);
if (!KEY) {
  console.log('Нужен ключ преподавателя: TARJIMA_KEY=… node tools/translator/eval.mjs --yes');
  process.exit(1);
}
if (!YES) {
  console.log('Каждая фраза — платный вызов модели. Запустить: добавьте --yes.');
  process.exit(0);
}

const results = [];
for (const model of variants) {
  console.log(`\n——— ${model ?? 'модель сервера'} ———`);
  await post({ reset: true });
  const rows = await runModel(model);
  results.push({ rows, sum: summarize(rows) });
}
await post({ reset: true });

// ——— итог ———
const table = [
  ['', ...results.map((r) => r.sum.model)],
  ['регион функции', ...results.map((r) => r.sum.region)],
  ['переведено', ...results.map((r) => r.sum.translated)],
  ['числа сохранены', ...results.map((r) => r.sum.numbers)],
  ['англ. термины', ...results.map((r) => r.sum.english)],
  ['термины словаря', ...results.map((r) => r.sum.glossary)],
  ['без кириллицы', ...results.map((r) => r.sum.latin)],
  ['до перевода, медиана', ...results.map((r) => sec(r.sum.roundTrip50))],
  ['до перевода, 95%', ...results.map((r) => sec(r.sum.roundTrip95))],
  ['из них модель, медиана', ...results.map((r) => sec(r.sum.model50))],
  ['из них модель, 95%', ...results.map((r) => sec(r.sum.model95))],
  ['токенов ответа, медиана', ...results.map((r) => String(r.sum.out50))],
  ['кэш словаря сработал', ...results.map((r) => r.sum.cache)],
  ['за фразу', ...results.map((r) => `$${r.sum.perPhrase.toFixed(4)}`)],
  ['за замер', ...results.map((r) => `$${r.sum.cost.toFixed(3)}`)],
];
const width = table[0].map((_, c) => Math.max(...table.map((row) => String(row[c]).length)));
const lines = table.map((row) => row.map((cell, c) => String(cell).padEnd(width[c])).join('   '));
console.log('\n' + lines.join('\n'));
const grand = results.reduce((s, r) => s + r.sum.cost, 0);
console.log(`\nвсего потрачено: ≈ $${grand.toFixed(3)}`);

// ——— таблица для человека ———
const date = new Date().toISOString().slice(0, 10);
const file = `tarjima-eval-${date}.md`;
const letters = results.map((_, i) => String.fromCharCode(65 + i));
const cell = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
const notes = (r) =>
  [
    !r.checks.translated && `не переведено: ${r.error ?? ''}`,
    r.checks.translated && !r.checks.numbers && 'потеряно число',
    r.checks.translated && !r.checks.english && 'не восстановлен английский термин',
    r.checks.translated && r.missedTerms.length && `не по словарю: ${r.missedTerms.join('; ')}`,
    r.checks.translated && !r.checks.latin && 'есть кириллица',
  ]
    .filter(Boolean)
    .join('. ');

const md = [
  `# Замер переводчика — ${date}`,
  '',
  '```',
  ...lines,
  '```',
  '',
  results.length > 1
    ? 'Прочитайте переводы и отметьте в каждой строке, какой вариант лучше или где перевод неверен. Какая буква — какая модель, написано в самом конце: не заглядывайте туда, пока не оцените.'
    : 'Смысл перевода автоматически не проверялся. Прочитайте таблицу и отметьте фразы, где перевод неверен или термин передан не так.',
  '',
  `| # | Русский (как распознано) | ${letters.map((l) => `${l}`).join(' | ')} | Замечания проверки |`,
  `|---|---|${letters.map(() => '---|').join('')}---|`,
  ...PHRASES.map(([ru], i) => {
    const per = results.map((res) => res.rows[i]);
    const remarks = per
      .map((r, k) => (notes(r) ? `${letters[k]}: ${notes(r)}` : ''))
      .filter(Boolean)
      .join(' · ');
    return `| ${i + 1} | ${cell(ru)} | ${per.map((r) => cell(r.checks.translated ? r.uz : '—')).join(' | ')} | ${cell(remarks)} |`;
  }),
  '',
  ...(results.length > 1
    ? ['<details><summary>Какая буква — какая модель</summary>', '', ...results.map((r, i) => `- ${letters[i]} — ${r.sum.model}`), '', '</details>', '']
    : []),
].join('\n');
fs.writeFileSync(file, md);
console.log(`Таблица для проверки человеком: ${file}`);
