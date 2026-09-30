// BRIDGE Consult — company presentation (RU). pptxgenjs + native PowerPoint animations.
const pptxgen = require('pptxgenjs');
const JSZip = require('jszip');
const sharp = require('sharp');
const fs = require('fs');
const A = __dirname + '/assets/';  // produced by prep.js
const OUT = process.argv[2] || __dirname + '/out/BRIDGE-Consult-presentation.pptx';

const C = {
  carbon: '0D0C0B', soft: '151311', paper: 'F4EFE6', card: 'FBF8F2', champ: 'D8BD96', champB: 'F0DCBA',
  bronze: '9B7C56', taupe: '8A7B66', ink: '1A1816', inkSoft: '3A342D', mutedD: 'A39C91', mutedL: '6E655A',
  lineD: '4A4034', lineL: 'D6CCBC'
};
// Brand fonts (Playfair Display, Manrope) renamed with a "Bridge" prefix and embedded in the .pptx,
// so a differently built "Manrope" installed on the presenting machine can't shadow them.
const F = { serif: 'Bridge Playfair', sans: 'Bridge Manrope', sb: 'Bridge Manrope SemiBold', xb: 'Bridge Manrope ExtraBold' };
const EMBED = [
  ['Bridge Manrope', { regular: 'BridgeManrope-Regular.ttf' }],
  ['Bridge Manrope SemiBold', { regular: 'BridgeManropeSemiBold-Regular.ttf' }],
  ['Bridge Manrope ExtraBold', { regular: 'BridgeManropeExtraBold-Regular.ttf' }],
  ['Bridge Playfair', { regular: 'BridgePlayfair-Regular.ttf', italic: 'BridgePlayfair-Italic.ttf' }]
];
const TOTAL = 10;

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE'; // 13.333 x 7.5
pres.title = 'BRIDGE Consult — презентация компании';
pres.author = 'BRIDGE Consult LLC';
pres.company = 'BRIDGE Consult LLC';
pres.subject = 'Контрактный инжиниринг, FIDIC, разрешение споров';

// ── slide / animation bookkeeping ───────────────────────────────
const SL = [];
let cur;
function newSlide(bg) {
  const s = pres.addSlide();
  s.background = { color: bg };
  cur = { s, anims: [], n: 0, idx: SL.length + 1, dark: bg === C.carbon };
  SL.push(cur);
  return s;
}
function nm(anim) {
  const name = `bc${cur.idx}_${++cur.n}`;
  if (anim) cur.anims.push({ name, ...anim });
  return name;
}
function text(t, o, anim) {
  cur.s.addText(t, { isTextBox: true, margin: 0, valign: 'top', fontFace: F.sans, ...o, objectName: nm(anim) });
}
function img(path, o, anim) { cur.s.addImage({ path: A + path, ...o, objectName: nm(anim) }); }
function rect(o, anim) { cur.s.addShape(pres.shapes.RECTANGLE, { line: { type: 'none' }, ...o, objectName: nm(anim) }); }
function hline(x, y, w, color, anim, width = 0.75) {
  cur.s.addShape(pres.shapes.LINE, { x, y, w, h: 0, line: { color, width }, objectName: nm(anim) });
}
// animation presets: d = delay ms, t = duration ms
const fx = {
  fade: (d, t = 700) => ({ e: 'fade', d, t }),
  rise: (d, t = 1000) => ({ e: 'rise', d, t }),
  words: (d, t = 800) => ({ e: 'words', d, t }),
  wipe: (d, t = 800) => ({ e: 'wipe', d, t }),
  wipeUp: (d, t = 900) => ({ e: 'wipeUp', d, t }),
  zoom: (d, t = 900) => ({ e: 'zoom', d, t }),
  kb: (d, t = 2600) => ({ e: 'kb', d, t })
};

// ── shared chrome ───────────────────────────────────────────────
function chrome(label) {
  const dk = cur.dark;
  const muted = dk ? C.mutedD : C.mutedL;
  text([{ text: String(cur.idx).padStart(2, '0'), options: { color: dk ? C.paper : C.ink } }, { text: ` / ${TOTAL}`, options: { color: muted } }],
    { x: 10.6, y: 0.48, w: 2.0, h: 0.25, fontSize: 9, fontFace: F.sb, charSpacing: 2, align: 'right' }, fx.fade(0, 600));
  text('bridgeconsult.uz', { x: 0.75, y: 6.98, w: 3, h: 0.22, fontSize: 8, fontFace: F.sb, charSpacing: 2, color: muted }, fx.fade(100, 600));
  text('41.2995° N  ·  69.2401° E', { x: 9.6, y: 6.98, w: 3.0, h: 0.22, fontSize: 8, fontFace: F.sb, charSpacing: 2, color: muted, align: 'right' }, fx.fade(100, 600));
  if (label) eyebrow(label, 0.75, 0.9, 150);
}
function eyebrow(label, x, y, d, color) {
  const col = color || (cur.dark ? C.champ : C.bronze);
  hline(x, y + 0.11, 0.42, col, fx.wipe(d, 600), 1);
  text(label.toUpperCase(), { x: x + 0.58, y, w: 5, h: 0.24, fontSize: 9, fontFace: F.sb, charSpacing: 3, color: col }, fx.fade(d + 150, 700));
}
// two-line serif title, second line italic accent
function title(l1, l2, { x = 0.75, y = 1.3, w = 7.5, size = 40, d = 300, accent } = {}) {
  const lh = size / 72 * 1.28;
  const main = cur.dark ? C.paper : C.ink;
  const acc = accent || (cur.dark ? C.champ : C.bronze);
  text(l1, { x: x - 0.02, y, w, h: lh, fontSize: size, fontFace: F.serif, color: main }, fx.rise(d));
  text(l2, { x: x - 0.02, y: y + lh * 0.92, w, h: lh, fontSize: size, fontFace: F.serif, italic: true, color: acc }, fx.rise(d + 160));
  return y + lh * 1.92;
}

// ═══ 1 · COVER ═════════════════════════════════════════════════
newSlide(C.carbon);
img('cover.jpg', { x: 0, y: 0, w: 13.333, h: 7.5 }, fx.kb(0, 3200));
img('logo-paper.png', { x: 0.75, y: 0.55, w: 2.0, h: 2.0 * 641 / 1705 }, fx.fade(300, 900));
eyebrow('Контрактный инжиниринг · FIDIC / EPC', 0.75, 2.45, 650);
text('Контракты,', { x: 0.72, y: 2.85, w: 8, h: 0.98, fontSize: 56, fontFace: F.serif, color: C.paper }, fx.rise(850, 1100));
text('которые работают', { x: 0.72, y: 3.73, w: 8, h: 0.98, fontSize: 56, fontFace: F.serif, color: C.paper }, fx.rise(1000, 1100));
text('на проект.', { x: 0.72, y: 4.61, w: 8, h: 0.98, fontSize: 56, fontFace: F.serif, italic: true, color: C.champ }, fx.rise(1150, 1100));
text('Независимый консалтинг по инфраструктурным контрактам, претензиям и разрешению споров в проектах, финансируемых международными финансовыми институтами.',
  { x: 0.75, y: 5.8, w: 5.7, h: 0.8, fontSize: 12.5, color: C.mutedD, lineSpacingMultiple: 1.3 }, fx.fade(1600, 900));
text('Презентация компании  ·  Ташкент  ·  2026', { x: 0.75, y: 6.98, w: 5, h: 0.22, fontSize: 8, fontFace: F.sb, charSpacing: 2, color: C.mutedD }, fx.fade(1900, 700));
text('41.2995° N  ·  69.2401° E', { x: 9.6, y: 6.98, w: 3.0, h: 0.22, fontSize: 8, fontFace: F.sb, charSpacing: 2, color: C.mutedD, align: 'right' }, fx.fade(1900, 700));
cur.s.addNotes('BRIDGE Consult — независимая консалтинговая компания из Ташкента: контрактный инжиниринг, FIDIC/EPC, претензии и разрешение споров.');

// ═══ 2 · ABOUT ═════════════════════════════════════════════════
newSlide(C.paper);
img('about.jpg', { x: 0, y: 0, w: 5.2, h: 7.5 }, fx.kb(0, 2600));
text('С 2016 ГОДА', { x: 0.6, y: 4.78, w: 3, h: 0.24, fontSize: 9, fontFace: F.sb, charSpacing: 3, color: C.champ }, fx.fade(700, 700));
text('2016', { x: 0.52, y: 4.98, w: 4.3, h: 1.35, fontSize: 96, fontFace: F.serif, italic: true, color: C.paper }, fx.rise(800, 1200));
text('Зарегистрирована в Республике Узбекистан', { x: 0.6, y: 6.45, w: 4.3, h: 0.3, fontSize: 10.5, color: C.paper }, fx.fade(1100, 700));
chrome(null);
eyebrow('О компании', 5.95, 0.9, 150);
title('Независимая экспертиза', 'для инфраструктуры', { x: 5.95, y: 1.3, w: 6.8, size: 36, d: 300 });
text('BRIDGE Consult — независимая консалтинговая компания, специализирующаяся на контрактном инжиниринге, администрировании строительных контрактов и разрешении споров в международных инфраструктурных проектах.',
  { x: 5.95, y: 2.85, w: 6.4, h: 1.2, fontSize: 13.5, color: C.inkSoft, lineSpacingMultiple: 1.35 }, fx.fade(700, 900));
text('Мы поддерживаем государственный сектор, международные финансовые институты, инвесторов и подрядчиков — включая проекты, финансируемые международными банками развития.',
  { x: 5.95, y: 4.3, w: 6.4, h: 0.9, fontSize: 12, color: C.mutedL, lineSpacingMultiple: 1.35 }, fx.fade(850, 900));
hline(5.95, 5.4, 6.65, C.lineL, fx.wipe(1000, 900));
[['Клиенты', 'Госсектор, МФИ, инвесторы, подрядчики'], ['Стандарты', 'FIDIC · EPC / EPC+F · MDB Harmonised'], ['География', 'Узбекистан и Центральная Азия']]
  .forEach(([k, v], i) => {
    const x = 5.95 + i * 2.25;
    text(k.toUpperCase(), { x, y: 5.6, w: 2.05, h: 0.22, fontSize: 8.5, fontFace: F.sb, charSpacing: 2.5, color: C.bronze }, fx.fade(1150 + i * 140, 600));
    text(v, { x, y: 5.9, w: 2.05, h: 0.75, fontSize: 12, fontFace: F.sb, color: C.ink, lineSpacingMultiple: 1.2 }, fx.rise(1200 + i * 140, 900));
  });
cur.s.addNotes('Компания основана в 2016 году. Фокус — контрактный инжиниринг, администрирование контрактов и разрешение споров в проектах МФИ.');

// ═══ 3 · NUMBERS ═══════════════════════════════════════════════
newSlide(C.carbon);
img('stats.jpg', { x: 0, y: 0, w: 13.333, h: 7.5 }, fx.kb(0, 3000));
chrome('Масштаб');
title('Опыт, подтверждённый', 'проектами', { y: 1.3, w: 7.5, size: 40, d: 300 });
text('За каждой цифрой — реальные контракты, претензии и решения на объектах национального масштаба.',
  { x: 8.55, y: 1.42, w: 4.05, h: 0.9, fontSize: 12.5, color: C.mutedD, lineSpacingMultiple: 1.35 }, fx.fade(700, 900));
[['10', '+', 'лет на рынке', 'Компания основана в 2016 году в Ташкенте'],
 ['20', '+', 'крупных проектов', 'Дороги, водоснабжение, энергетика, городская среда'],
 ['27', '', 'лет опыта основателя', 'Из них более 15 лет — контракты FIDIC и проекты МФИ'],
 ['100', '%', 'на стороне клиента', 'От сметного аудита до арбитража']
].forEach(([n, suf, k, v], i) => {
  const x = 0.75 + i * 3.0, d = 900 + i * 170;
  hline(x, 3.75, 2.7, C.champ, fx.wipe(d, 800), 0.75);
  text([{ text: n, options: { color: C.paper } }, { text: suf, options: { color: C.champ, italic: true } }],
    { x: x - 0.03, y: 3.95, w: 2.8, h: 1.3, fontSize: 76, fontFace: F.serif }, fx.rise(d + 100, 1100));
  text(k, { x, y: 5.35, w: 2.7, h: 0.35, fontSize: 13, fontFace: F.sb, color: C.paper }, fx.fade(d + 300, 700));
  text(v, { x, y: 5.72, w: 2.6, h: 0.7, fontSize: 10.5, color: C.mutedD, lineSpacingMultiple: 1.3 }, fx.fade(d + 400, 700));
});
cur.s.addNotes('10+ лет на рынке, 20+ крупных проектов, 27 лет опыта основателя, 100% фокус на интересах клиента.');

// ═══ 4 · SERVICES ══════════════════════════════════════════════
newSlide(C.paper);
chrome('Услуги');
title('Четыре', 'направления', { y: 1.3, w: 4.4, size: 34, d: 300 });
text('Полный цикл сопровождения инфраструктурного контракта — от тендерной стратегии до защиты позиции в арбитраже.',
  { x: 0.75, y: 2.75, w: 3.7, h: 1.05, fontSize: 12, color: C.mutedL, lineSpacingMultiple: 1.35 }, fx.fade(650, 900));
img('svc.jpg', { x: 0.75, y: 4.2, w: 3.7, h: 3.7 * 600 / 900 }, fx.zoom(700, 1200));
const services = [
  ['01', 'Контрактный инжиниринг', 'FIDIC / EPC', ['Тендерная документация и тендерный инжиниринг', 'Разработка и адаптация контрактов FIDIC и EPC', 'Аудит контрактной стратегии']],
  ['02', 'Управление контрактами', 'Claims · Risks', ['Управление претензиями (claims)', 'Управление рисками и изменениями', 'Контроль бюджета, закупок и качества']],
  ['03', 'Споры и арбитраж', 'DAAB · ADR', ['Советы по урегулированию споров DAAB / DAB', 'Медиация и внесудебное урегулирование', 'Экспертная поддержка в арбитраже']],
  ['04', 'Аналитика и обучение', 'FDA · Quantum', ['Forensic Delay Analysis и расчёт Quantum', 'Адаптация к законодательству РУз', 'Семинары и корпоративное обучение']]
];
services.forEach(([n, t, tag, items], i) => {
  const x = 4.95 + (i % 2) * 3.95, y = 0.9 + Math.floor(i / 2) * 3.0, w = 3.7, h = 2.75, d = 800 + i * 160;
  rect({ x, y, w, h, fill: { color: C.card }, shadow: { type: 'outer', color: '3A2E20', blur: 18, offset: 4, angle: 90, opacity: 0.10 } }, fx.rise(d, 1000));
  text(n, { x: x + 0.35, y: y + 0.3, w: 1, h: 0.45, fontSize: 22, fontFace: F.serif, italic: true, color: C.bronze }, fx.fade(d + 200, 700));
  text(tag.toUpperCase(), { x: x + 1.6, y: y + 0.4, w: w - 1.95, h: 0.22, fontSize: 7.5, fontFace: F.sb, charSpacing: 2, color: C.taupe, align: 'right' }, fx.fade(d + 250, 700));
  text(t, { x: x + 0.35, y: y + 0.88, w: w - 0.6, h: 0.4, fontSize: 14.5, fontFace: F.xb, color: C.ink }, fx.fade(d + 250, 700));
  text(items.map((s, j) => ({ text: s, options: { bullet: { code: '2014', indent: 14 }, breakLine: j < items.length - 1 } })),
    { x: x + 0.35, y: y + 1.42, w: w - 0.6, h: 1.15, fontSize: 10.5, color: C.inkSoft, paraSpaceAfter: 5, lineSpacingMultiple: 1.1 }, fx.fade(d + 350, 800));
});
cur.s.addNotes('Четыре направления: контрактный инжиниринг, администрирование контрактов, споры и арбитраж, аналитика и обучение.');

// ═══ 5 · FIDIC ═════════════════════════════════════════════════
newSlide(C.carbon);
img('fidic.jpg', { x: 0, y: 0, w: 13.333, h: 7.5 }, fx.fade(0, 1200));
chrome('Экспертиза FIDIC');
title('Вся линейка', 'проформ FIDIC', { y: 1.3, w: 5.2, size: 40, d: 300 });
text('Золотой стандарт типовых контрактов Международной федерации инженеров-консультантов — в ежедневной практике команды.',
  { x: 0.75, y: 2.95, w: 4.6, h: 0.9, fontSize: 12.5, color: C.mutedD, lineSpacingMultiple: 1.35 }, fx.fade(650, 900));
[['Forensic Delay Analysis', 'SCL Protocol: Time Impact и Time Slice Analysis — обоснование права на продление сроков (EOT) и компенсацию.'],
 ['DAAB / DAB', 'Структурирование советов по спорам, Position Papers и представительство клиента на слушаниях.']]
  .forEach(([h, p], i) => {
    const y = 4.3 + i * 1.2, d = 850 + i * 180;
    hline(0.75, y, 4.6, C.lineD, fx.wipe(d, 800));
    text(h, { x: 0.75, y: y + 0.17, w: 4.6, h: 0.32, fontSize: 13.5, fontFace: F.sb, color: C.paper }, fx.fade(d + 100, 700));
    text(p, { x: 0.75, y: y + 0.52, w: 4.6, h: 0.6, fontSize: 10.5, color: C.mutedD, lineSpacingMultiple: 1.3 }, fx.fade(d + 200, 700));
  });
const books = [
  ['Red Book', 'Строительство по проекту Заказчика', '8E2F25', C.paper, 4.55],
  ['Yellow Book', 'Проектирование и строительство', 'C9A13B', C.ink, 4.15],
  ['Silver Book', 'EPC / объекты под ключ', 'B3B4B0', C.ink, 4.8],
  ['Pink Book', 'MDB: издание для банков развития', 'C98E93', C.ink, 3.95],
  ['White Book', 'Договор с консультантом', 'E9E4DA', C.ink, 4.35]
];
const shelfY = 6.45, bw = 1.12, bg = 0.2, bx0 = 12.6 - (5 * bw + 4 * bg);
books.forEach(([name, cap, col, tc, h], i) => {
  const x = bx0 + i * (bw + bg), y = shelfY - h, d = 700 + i * 150;
  rect({ x, y, w: bw, h, fill: { color: col } }, fx.wipeUp(d, 1000));
  text('FIDIC', { x, y: y + 0.22, w: bw, h: 0.2, fontSize: 7.5, fontFace: F.sb, charSpacing: 3, color: tc, align: 'center' }, fx.fade(d + 500, 600));
  const tw = h - 1.9, th = 0.5, cx = x + bw / 2, cy = y + 0.55 + tw / 2 + 0.05;
  text(name, { x: cx - tw / 2, y: cy - th / 2, w: tw, h: th, rotate: 270, fontSize: 21, fontFace: F.serif, italic: true, color: tc, align: 'center', valign: 'middle' }, fx.fade(d + 550, 700));
  text(cap, { x: x + 0.05, y: shelfY - 1.02, w: bw - 0.1, h: 0.85, fontSize: 7.5, fontFace: F.sb, color: tc, align: 'center', valign: 'bottom', lineSpacingMultiple: 1.15 }, fx.fade(d + 650, 600));
});
hline(bx0 - 0.3, shelfY, 12.6 - bx0 + 0.3, C.champ, fx.wipe(600, 1000), 1);
cur.s.addNotes('Практика по всей линейке FIDIC: Red, Yellow, Silver, Pink (MDB Harmonised), White Book; методики FDA и работа с DAAB.');

// ═══ 6 · PROJECTS ══════════════════════════════════════════════
newSlide(C.paper);
chrome('Портфолио');
title('Избранные', 'проекты', { y: 1.15, w: 5, size: 36, d: 300 });
text('Контрактное сопровождение объектов национального масштаба — от спортивной инфраструктуры до транспортных коридоров ЦАРЭС.',
  { x: 7.65, y: 1.3, w: 4.95, h: 0.9, fontSize: 12, color: C.mutedL, lineSpacingMultiple: 1.35 }, fx.fade(650, 900));
[['p-olympic.jpg', 'EPC+F', '2022 — 2025', 'Олимпийский городок, Ташкент', 'Спортивные объекты IV Летних Азиатских юношеских игр.'],
 ['p-tic.jpg', 'FIDIC White Book', '2025 — н.в.', 'АО «Tashkent Invest Company»', 'Система закупок и управления контрактами для проектов EPC+F.'],
 ['p-kamchik.jpg', 'MDB Harmonised', '2016 — 2022', 'Автодорога А-373, перевал Камчик', 'Транспортный коридор ЦАРЭС 2. Заказчик — АО EVRASCON.']
].forEach(([im, tag, yr, t, p], i) => {
  const x = 0.75 + i * 4.05, w = 3.75, d = 800 + i * 180;
  img(im, { x, y: 2.5, w, h: w * 675 / 1100 }, fx.zoom(d, 1100));
  const tw = tag.length * 0.075 + 0.35;
  rect({ x: x + 0.18, y: 2.68, w: tw, h: 0.3, fill: { color: C.carbon, transparency: 15 } }, fx.fade(d + 400, 600));
  text(tag.toUpperCase(), { x: x + 0.18, y: 2.68, w: tw, h: 0.3, fontSize: 7.5, fontFace: F.sb, charSpacing: 1.5, color: C.champB, align: 'center', valign: 'middle' }, fx.fade(d + 400, 600));
  text(yr, { x, y: 4.95, w, h: 0.22, fontSize: 8.5, fontFace: F.sb, charSpacing: 2, color: C.bronze }, fx.fade(d + 450, 600));
  text(t, { x, y: 5.22, w, h: 0.36, fontSize: 14, fontFace: F.xb, color: C.ink }, fx.rise(d + 500, 900));
  text(p, { x, y: 5.62, w: w - 0.2, h: 0.55, fontSize: 10.5, color: C.mutedL, lineSpacingMultiple: 1.3 }, fx.fade(d + 600, 700));
});
hline(0.75, 6.42, 11.85, C.lineL, fx.wipe(1500, 900));
text([
  { text: 'ВОДОСНАБЖЕНИЕ   ', options: { fontFace: F.sb, color: C.bronze, charSpacing: 2 } },
  { text: 'Янгиюль и Жийдакапа — World Bank, EBRD   ·   Наманган, 60 км трубопровода — OPEC Fund   ·   Самаркандская область — АБР', options: { color: C.inkSoft } }
], { x: 0.75, y: 6.55, w: 11.85, h: 0.25, fontSize: 9.5 }, fx.fade(1650, 800));
cur.s.addNotes('Ключевые проекты: Олимпийский городок (EPC+F), Tashkent Invest Company (White Book), А-373 Камчик (MDB Harmonised), проекты водоснабжения WB/EBRD/OPEC/АБР.');

// ═══ 7 · TEAM ══════════════════════════════════════════════════
newSlide(C.carbon);
chrome('Команда');
title('Лица', 'компании', { y: 1.15, w: 5, size: 36, d: 300 });
text('Десятилетия практики в инженерном деле, юриспруденции и международном арбитраже.',
  { x: 7.65, y: 1.3, w: 4.95, h: 0.7, fontSize: 12, color: C.mutedD, lineSpacingMultiple: 1.35 }, fx.fade(650, 900));
[['t-larisa.jpg', 'Лариса Белоусова', 'Основатель и директор · FCCE, FCCP, ADB Accredited'],
 ['t-anna.jpg', 'Анна Убайдуллаева', 'Партнёр, юридический консультант · арбитр TIAC и VIAC'],
 ['t-ernest.jpg', 'Эрнест Белоусов', 'Ведущий специалист по контрактам FIDIC'],
 ['t-lucia.jpg', 'Люция Ахмедиева', 'Руководитель сметного отдела · 40+ лет опыта'],
 ['t-olga.jpg', 'Ольга Митрофанова', 'Руководитель отдела качества · аудитор ISO 9001']
].forEach(([im, n, r], i) => {
  const w = 2.2, x = 0.75 + i * (w + 0.2125), d = 750 + i * 140;
  img(im, { x, y: 2.45, w, h: w * 4 / 3 }, fx.zoom(d, 1100));
  text(n, { x, y: 5.48, w: w + 0.1, h: 0.36, fontSize: 14, fontFace: F.serif, color: C.paper }, fx.rise(d + 300, 900));
  text(r, { x, y: 5.88, w, h: 0.62, fontSize: 9, color: C.mutedD, lineSpacingMultiple: 1.3 }, fx.fade(d + 420, 700));
});
cur.s.addNotes('Команда: основатель Лариса Белоусова, партнёр д-р Анна Убайдуллаева, Эрнест Белоусов, Люция Ахмедиева, Ольга Митрофанова.');

// ═══ 8 · TRUST ═════════════════════════════════════════════════
newSlide(C.paper);
chrome('Доверие');
title('Международное', 'признание', { y: 1.3, w: 5.2, size: 36, d: 300 });
text('Руководитель компании — аккредитованный АБР специалист по управлению контрактами и предотвращению споров.',
  { x: 0.75, y: 2.8, w: 4.9, h: 0.75, fontSize: 12, color: C.mutedL, lineSpacingMultiple: 1.35 }, fx.fade(650, 900));
[['FCCE · FCCP', 'Сертифицированный консультант FIDIC'],
 ['ADB', 'Аккредитация АБР: контракты и споры'],
 ['MCIArb', 'Член Королевского института арбитров'],
 ['DRBF', 'Практик Совета по разрешению споров'],
 ['ICAC', 'Арбитр МКАС при ТПП Республики Узбекистан']
].forEach(([k, v], i) => {
  const y = 3.8 + i * 0.52, d = 800 + i * 110;
  hline(0.75, y, 5.0, C.lineL, fx.wipe(d, 700));
  text(k, { x: 0.75, y: y + 0.1, w: 1.45, h: 0.34, fontSize: 13, fontFace: F.serif, italic: true, color: C.bronze }, fx.fade(d + 100, 600));
  text(v, { x: 2.2, y: y + 0.14, w: 3.55, h: 0.3, fontSize: 10.5, color: C.ink }, fx.fade(d + 150, 600));
});
text('МФИ, АРБИТРАЖНЫЕ И ПРОФЕССИОНАЛЬНЫЕ СООБЩЕСТВА', { x: 6.45, y: 0.9, w: 6.2, h: 0.24, fontSize: 8.5, fontFace: F.sb, charSpacing: 2.5, color: C.bronze }, fx.fade(400, 700));
const logoDims = [[543, 360], [1805, 360], [1921, 360], [1062, 360], [336, 360], [862, 360], [1274, 360], [427, 360]];
logoDims.forEach(([lw, lh], i) => {
  const tw = 1.4, th = 1.2, gx = 0.2, gy = 0.2;
  const x = 6.45 + (i % 4) * (tw + gx), y = 1.3 + Math.floor(i / 4) * (th + gy), d = 700 + i * 90;
  rect({ x, y, w: tw, h: th, fill: { color: C.card }, line: { color: C.lineL, width: 0.5 } }, fx.fade(d, 700));
  const maxW = tw - 0.36, maxH = th - 0.5;
  let w = maxW, h = w * lh / lw;
  if (h > maxH) { h = maxH; w = h * lw / lh; }
  img(`logo-${i}.png`, { x: x + (tw - w) / 2, y: y + (th - h) / 2, w, h, transparency: 10 }, fx.fade(d + 150, 700));
});
text('“', { x: 6.4, y: 4.2, w: 0.6, h: 0.8, fontSize: 60, fontFace: F.serif, color: C.champ }, fx.fade(1500, 700));
text('Сильный контракт создаёт не барьеры, а ясность, доверие и общий путь к результату.',
  { x: 6.95, y: 4.35, w: 5.6, h: 1.3, fontSize: 21, fontFace: F.serif, italic: true, color: C.ink, lineSpacingMultiple: 1.2 }, fx.words(1600, 700));
text('ЛАРИСА БЕЛОУСОВА, ОСНОВАТЕЛЬ', { x: 6.95, y: 5.85, w: 5, h: 0.24, fontSize: 8.5, fontFace: F.sb, charSpacing: 2.5, color: C.mutedL }, fx.fade(2300, 700));
cur.s.addNotes('Квалификации FIDIC FCCE/FCCP, аккредитация АБР, MCIArb, DRBF, арбитр МКАС. Работа с проектами ADB, World Bank, EBRD.');

// ═══ 9 · WHY US ════════════════════════════════════════════════
newSlide(C.carbon);
img('why.jpg', { x: 0, y: 0, w: 13.333, h: 7.5 }, fx.kb(0, 3000));
chrome('Подход');
title('Почему выбирают', 'Bridge Consult', { y: 1.3, w: 8, size: 44, d: 300 });
[['01', 'Международный стандарт', 'Глубокое понимание проформ FIDIC, EPC-контрактов и требований международных финансовых институтов.'],
 ['02', 'Локальная адаптация', 'Интеграция международных контрактов в правовое поле Республики Узбекистан без потери их юридической силы.'],
 ['03', 'Комплексная защита', 'Интересы клиента на всех уровнях: от сметного аудита и претензий до представительства в арбитраже.']
].forEach(([n, h, p], i) => {
  const x = 0.75 + i * 4.05, w = 3.6, d = 900 + i * 200;
  hline(x, 3.95, w, C.champ, fx.wipe(d, 900));
  text(n, { x, y: 4.15, w: 1, h: 0.55, fontSize: 28, fontFace: F.serif, italic: true, color: C.champ }, fx.rise(d + 100, 900));
  text(h, { x, y: 4.85, w, h: 0.4, fontSize: 17, fontFace: F.sb, color: C.paper }, fx.rise(d + 200, 900));
  text(p, { x, y: 5.35, w: w - 0.15, h: 1.1, fontSize: 11.5, color: C.mutedD, lineSpacingMultiple: 1.35 }, fx.fade(d + 350, 800));
});
cur.s.addNotes('Три причины: международный стандарт, локальная адаптация, комплексная защита интересов клиента.');

// ═══ 10 · CONTACT ══════════════════════════════════════════════
newSlide(C.carbon);
img('contact.jpg', { x: 0, y: 0, w: 13.333, h: 7.5 }, fx.kb(0, 3000));
img('logo-paper.png', { x: 0.75, y: 0.55, w: 2.0, h: 2.0 * 641 / 1705 }, fx.fade(200, 900));
text([{ text: '10', options: { color: C.paper } }, { text: ` / ${TOTAL}`, options: { color: C.mutedD } }],
  { x: 10.6, y: 0.48, w: 2.0, h: 0.25, fontSize: 9, fontFace: F.sb, charSpacing: 2, align: 'right' }, fx.fade(0, 600));
eyebrow('Контакты', 0.75, 1.95, 400);
text('Начнём', { x: 0.72, y: 2.3, w: 8, h: 1.0, fontSize: 58, fontFace: F.serif, color: C.paper }, fx.rise(550, 1100));
text('с разговора.', { x: 0.72, y: 3.2, w: 8, h: 1.0, fontSize: 58, fontFace: F.serif, italic: true, color: C.champ }, fx.rise(700, 1100));
const contacts = [
  ['Телефон', '+998 33 000 15 30', 'tel:+998330001530'],
  ['Email', 'info@bridgeconsult.uz', 'mailto:info@bridgeconsult.uz'],
  ['Сайт', 'bridgeconsult.uz', 'https://www.bridgeconsult.uz'],
  ['Telegram', 't.me/fidicuzb', 'https://t.me/fidicuzb']
];
contacts.forEach(([k, v, url], i) => {
  const x = 0.75 + (i % 2) * 3.6, y = 4.6 + Math.floor(i / 2) * 0.75, d = 1000 + i * 120;
  text(k.toUpperCase(), { x, y, w: 3.2, h: 0.22, fontSize: 8, fontFace: F.sb, charSpacing: 2.5, color: C.champ }, fx.fade(d, 600));
  text([{ text: v, options: { hyperlink: { url }, color: C.paper } }], { x, y: y + 0.26, w: 3.4, h: 0.34, fontSize: 14, fontFace: F.sb, color: C.paper }, fx.rise(d + 60, 800));
});
text('АДРЕС', { x: 0.75, y: 6.1, w: 3, h: 0.22, fontSize: 8, fontFace: F.sb, charSpacing: 2.5, color: C.champ }, fx.fade(1500, 600));
text('100180, Ташкент, Юнусабадский район, ул. Ахмада Дониша, 12 квартал, 20А', { x: 0.75, y: 6.36, w: 7, h: 0.3, fontSize: 11, color: C.paper }, fx.fade(1550, 700));
rect({ x: 10.35, y: 4.35, w: 2.25, h: 2.25, fill: { color: C.carbon }, line: { color: C.lineD, width: 0.75 } }, fx.fade(1300, 800));
img('qr.png', { x: 10.55, y: 4.55, w: 1.85, h: 1.85 }, fx.zoom(1450, 900));
text('СКАНИРУЙТЕ — САЙТ КОМПАНИИ', { x: 9.6, y: 6.75, w: 3.0, h: 0.22, fontSize: 7.5, fontFace: F.sb, charSpacing: 2, color: C.mutedD, align: 'right' }, fx.fade(1700, 700));
text('Строим связи — достигаем результата', { x: 0.75, y: 6.98, w: 5, h: 0.22, fontSize: 8, fontFace: F.sb, charSpacing: 2, color: C.mutedD }, fx.fade(1800, 700));
cur.s.addNotes('Контакты: +998 33 000 15 30, info@bridgeconsult.uz, bridgeconsult.uz, Telegram t.me/fidicuzb.');

// ── animation XML ───────────────────────────────────────────────
function timingXml(anims, map, spids) {
  let id = 4;
  const nid = () => ++id;
  const tgt = s => `<p:tgtEl><p:spTgt spid="${s}"/></p:tgtEl>`;
  const set = s => `<p:set><p:cBhvr><p:cTn id="${nid()}" dur="1" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst></p:cTn>${tgt(s)}<p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst></p:cBhvr><p:to><p:strVal val="visible"/></p:to></p:set>`;
  const fade = (s, t, filter = 'fade') => `<p:animEffect transition="in" filter="${filter}"><p:cBhvr><p:cTn id="${nid()}" dur="${t}"/>${tgt(s)}</p:cBhvr></p:animEffect>`;
  const anim = (s, attr, from, to, t, decel = true) => `<p:anim calcmode="lin" valueType="num"><p:cBhvr><p:cTn id="${nid()}" dur="${t}" fill="hold"${decel ? ' decel="100000"' : ''}/>${tgt(s)}<p:attrNameLst><p:attrName>${attr}</p:attrName></p:attrNameLst></p:cBhvr><p:tavLst><p:tav tm="0"><p:val><p:strVal val="${from}"/></p:val></p:tav><p:tav tm="100000"><p:val><p:strVal val="${to}"/></p:val></p:tav></p:tavLst></p:anim>`;
  const pars = anims.map((a, i) => {
    const s = map[a.name];
    if (!s) throw new Error('no shape for ' + a.name);
    const node = i === 0 ? 'afterEffect' : 'withEffect';
    let preset, sub = 0, iterate = '', kids;
    switch (a.e) {
      case 'fade': preset = 10; kids = set(s) + fade(s, a.t); break;
      case 'rise': preset = 42; kids = set(s) + fade(s, a.t) + anim(s, 'ppt_x', '#ppt_x', '#ppt_x', a.t, false) + anim(s, 'ppt_y', '#ppt_y+0.06', '#ppt_y', a.t); break;
      case 'words': preset = 42; iterate = '<p:iterate type="wd"><p:tmPct val="8000"/></p:iterate>';
        kids = set(s) + fade(s, a.t) + anim(s, 'ppt_x', '#ppt_x', '#ppt_x', a.t, false) + anim(s, 'ppt_y', '#ppt_y+0.03', '#ppt_y', a.t); break;
      case 'wipe': preset = 22; sub = 8; kids = set(s) + fade(s, a.t, 'wipe(left)'); break;
      case 'wipeUp': preset = 22; sub = 4; kids = set(s) + fade(s, a.t, 'wipe(down)'); break;
      case 'zoom': preset = 53; sub = 16; kids = set(s) + anim(s, 'ppt_w', '#ppt_w*0.92', '#ppt_w', a.t) + anim(s, 'ppt_h', '#ppt_h*0.92', '#ppt_h', a.t) + fade(s, a.t); break;
      case 'kb': preset = 53; sub = 16; kids = set(s) + anim(s, 'ppt_w', '#ppt_w*1.12', '#ppt_w', a.t) + anim(s, 'ppt_h', '#ppt_h*1.12', '#ppt_h', a.t) + fade(s, Math.round(a.t * 0.45)); break;
      default: throw new Error(a.e);
    }
    const effId = nid();
    return `<p:par><p:cTn id="${effId}" presetID="${preset}" presetClass="entr" presetSubtype="${sub}" fill="hold"${spids.sp.has(s) ? ' grpId="0"' : ''} nodeType="${node}"><p:stCondLst><p:cond delay="${a.d}"/></p:stCondLst>${iterate}<p:childTnLst>${kids}</p:childTnLst></p:cTn></p:par>`;
  });
  // effect ids were assigned after children; renumber sequentially in document order for tidiness
  let xml = `<p:timing><p:tnLst><p:par><p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst><p:seq concurrent="1" nextAc="seek"><p:cTn id="2" dur="indefinite" nodeType="mainSeq"><p:childTnLst><p:par><p:cTn id="3" fill="hold"><p:stCondLst><p:cond delay="indefinite"/><p:cond evt="onBegin" delay="0"><p:tn val="2"/></p:cond></p:stCondLst><p:childTnLst><p:par><p:cTn id="4" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>${pars.join('')}</p:childTnLst></p:cTn></p:par></p:childTnLst></p:cTn></p:par></p:childTnLst></p:cTn><p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst><p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst></p:seq></p:childTnLst></p:cTn></p:par></p:tnLst>`;
  let n = 0;
  xml = xml.replace(/<p:cTn id="\d+"/g, () => `<p:cTn id="${++n}"`);
  const bld = [...new Set(anims.map(a => map[a.name]))].filter(s => spids.sp.has(s))
    .map(s => `<p:bldP spid="${s}" grpId="0"${spids.txt.has(s) ? '' : ' animBg="1"'}/>`).join('');
  return xml + (bld ? `<p:bldLst>${bld}</p:bldLst>` : '') + '</p:timing>';
}

(async () => {
  const buf = await pres.write({ outputType: 'nodebuffer' });
  const zip = await JSZip.loadAsync(buf);
  for (const sl of SL) {
    const path = `ppt/slides/slide${sl.idx}.xml`;
    let xml = await zip.file(path).async('string');
    const map = {}, sp = new Set(), txt = new Set();
    // map names -> ids, and note which are <p:sp> (vs pics) and which carry text
    const re = /<(p:sp|p:pic|p:cxnSp)>([\s\S]*?)<\/\1>/g;
    let m;
    while ((m = re.exec(xml))) {
      const c = m[2].match(/<p:cNvPr id="(\d+)" name="([^"]+)"/);
      if (!c) continue;
      map[c[2]] = c[1];
      if (m[1] === 'p:sp') { sp.add(c[1]); if (/<a:t>[^<]/.test(m[2])) txt.add(c[1]); }
    }
    const trans = '<p:transition spd="slow"><p:fade/></p:transition>';
    const timing = timingXml(sl.anims, map, { sp, txt });
    xml = xml.replace(/<\/p:clrMapOvr>/, `</p:clrMapOvr>${trans}${timing}`);
    if (!xml.includes('<p:timing>')) throw new Error('timing not inserted in ' + path);
    zip.file(path, xml);
  }
  // embed fonts: raw TrueType in ppt/fonts/*.fntdata
  let rels = await zip.file('ppt/_rels/presentation.xml.rels').async('string');
  let n = 0, list = '';
  for (const [face, styles] of EMBED) {
    list += `<p:embeddedFont><p:font typeface="${face}" pitchFamily="2" charset="0"/>`;
    for (const st of ['regular', 'bold', 'italic', 'boldItalic']) {
      if (!styles[st]) continue;
      const rid = `rIdFont${++n}`;
      zip.file(`ppt/fonts/font${n}.fntdata`, fs.readFileSync(__dirname + '/fonts/' + styles[st]));
      rels = rels.replace('</Relationships>', `<Relationship Id="${rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/font" Target="fonts/font${n}.fntdata"/></Relationships>`);
      list += `<p:${st} r:id="${rid}"/>`;
    }
    list += '</p:embeddedFont>';
  }
  zip.file('ppt/_rels/presentation.xml.rels', rels);
  let ct = await zip.file('[Content_Types].xml').async('string');
  ct = ct.replace('<Default ', '<Default Extension="fntdata" ContentType="application/x-fontdata"/><Default ');
  zip.file('[Content_Types].xml', ct);
  let px = await zip.file('ppt/presentation.xml').async('string');
  px = px.replace(' saveSubsetFonts="1"', ' embedTrueTypeFonts="1"').replace(/(<p:notesSz [^>]*\/>)/, `$1<p:embeddedFontLst>${list}</p:embeddedFontLst>`);
  if (!px.includes('embeddedFontLst')) throw new Error('fonts not embedded');
  zip.file('ppt/presentation.xml', px);

  fs.mkdirSync(require('path').dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }));
  console.log('wrote', OUT, SL.map(s => s.anims.length).join(','));
})();
