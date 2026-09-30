// BRIDGE — company magazine (A4, RU). HTML/CSS → PDF via headless Chromium.
// Usage: node build-magazine.cjs [out.pdf]   (needs sharp, hyphen, playwright-core)
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { hyphenateSync } = require('hyphen/ru');
const { chromium } = require('playwright-core');

const ROOT = path.join(__dirname, '../../..');
const PUB = path.join(ROOT, 'public') + '/';
const DECK = path.join(__dirname, '..');
const WORK = path.join(__dirname, '.build');
const IMG = path.join(WORK, 'img') + '/';
const FONTS = path.join(__dirname, 'fonts') + '/';
const OUT = process.argv[2] || path.join(DECK, 'BRIDGE-Consult-magazine.pdf');
fs.mkdirSync(IMG, { recursive: true });

// ── typography helpers ──────────────────────────────────────────
const SHORT = /(^|[\s(«>])((?:[аавиксоуяАВИКСОУЯ]|во|до|за|из|ко|на|не|ни|но|об|от|по|со|то|же|ли|бы|для|без|при|про|под|над|его|их|Во|До|За|Из|На|Не|Но|Об|От|По|Со|Для|Без|При|Про|Под))\s+/g;
function typo(s) {
  return s
    .replace(/ — /g, ' — ')
    .replace(SHORT, (m, a, w) => `${a}${w} `)
    .replace(SHORT, (m, a, w) => `${a}${w} `)
    .replace(/(\d)\s(км|лет|года|год|%|м)(?=[\s,.;:)]|$)/g, '$1 $2')
    .replace(/\b(IV|ЦАРЭС|А-\d+|ст\.|стр\.)\s/g, '$1 ');
}
// body copy: typography + soft hyphens (words ≥ 7 letters, never in latin acronyms)
function body(s) {
  return typo(s).split(/(\s+)/).map(w => (/^[А-Яа-яЁё-]{7,}[.,;:!?»)]*$/.test(w) ? hyphenateSync(w, { minWordLength: 7 }) : w)).join('');
}
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const P = (s, cls = '') => `<p${cls ? ` class="${cls}"` : ''}>${esc(body(s))}</p>`;
const H = s => esc(typo(s));

// ── images ──────────────────────────────────────────────────────
async function im(src, out, w, h, { pos = 'centre', grade = 'warm', extract } = {}) {
  const dst = IMG + out;
  if (!fs.existsSync(dst)) {
    let s = sharp(PUB + src);
    if (extract) s = s.extract(extract);
    s = s.resize(w, h, { fit: 'cover', position: pos, kernel: 'lanczos3' });
    if (grade === 'warm') s = s.modulate({ saturation: 0.72 }).tint({ r: 255, g: 238, b: 214 });
    if (grade === 'duo') s = s.grayscale().linear(1.06, -5).tint({ r: 214, g: 192, b: 162 });
    await s.jpeg({ quality: 84, mozjpeg: true }).toFile(dst);
  }
  return 'img/' + out;
}
async function mono(src, out) { // brand-ink logo with alpha from darkness
  const dst = IMG + out;
  if (!fs.existsSync(dst)) {
    const { data, info } = await sharp(PUB + src).flatten({ background: '#ffffff' }).trim({ threshold: 12 }).resize({ height: 300 }).raw().toBuffer({ resolveWithObject: true });
    const o = Buffer.alloc(info.width * info.height * 4);
    for (let p = 0; p < info.width * info.height; p++) {
      const c = info.channels, lum = (0.299 * data[p * c] + 0.587 * data[p * c + 1] + 0.114 * data[p * c + 2]) / 255;
      o.set([26, 24, 22, Math.round(Math.min(1, Math.max(0, (1 - lum) * 1.35)) * 255)], p * 4);
    }
    await sharp(o, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toFile(dst);
  }
  return 'img/' + out;
}

(async () => {
  const I = {
    cover: await im('poster-elegant.jpg', 'cover.jpg', 1480, 2094, { extract: { left: 690, top: 0, width: 724, height: 1024 }, grade: 'none' }),
    founder: await im('larisa-belousova.jpg', 'founder.jpg', 1100, 1556, { grade: 'duo', pos: 'north' }),
    about: await im('hero-bg2.png', 'about.jpg', 1600, 1100, {}),
    numbers: await im('academy-hero.png', 'numbers.jpg', 1600, 1000, { grade: 'none' }),
    services: await im('academy-mod-2.png', 'services.jpg', 900, 1100, { grade: 'none' }),
    fidic: await im('academy-atmosphere.png', 'fidic.jpg', 1480, 2094, { grade: 'none', pos: 'right' }),
    olympic: await im('olympic city.jpg', 'olympic.jpg', 1480, 2094, { pos: 'centre' }),
    tic: await im('tashkent-invest-company.png', 'tic.jpg', 1400, 800, {}),
    srrp: await im('highway-reconstruction.png', 'srrp.jpg', 1400, 800, {}),
    kamchik: await im('kamchik.avif', 'kamchik.jpg', 900, 600, {}),
    a380: await im('project-a380-carec.jpg', 'a380.jpg', 900, 600, {}),
    water: await im('project-water-samarkand.jpg', 'water.jpg', 900, 600, {}),
    nurafshon: await im('project-smart-nurafshon.jpg', 'nurafshon.jpg', 900, 600, {}),
    energy: await im('project-energy-metering.jpg', 'energy.jpg', 900, 600, {}),
    anna: await im('anna.png', 'anna.jpg', 600, 780, { grade: 'duo', extract: { left: 330, top: 140, width: 330, height: 429 } }),
    ernest: await im('ernest.jpg', 'ernest.jpg', 600, 780, { grade: 'duo', pos: 'left' }),
    lucia: await im('lucia.jpg', 'lucia.jpg', 600, 780, { grade: 'duo', pos: 'north' }),
    olga: await im('olga.jpg', 'olga.jpg', 600, 780, { grade: 'duo', pos: 'centre' }),
    academy: await im('academy-mod-3.png', 'academy.jpg', 1480, 1000, { grade: 'none' }),
    back: await im('poster-ultra.jpg', 'back.jpg', 1480, 2094, { grade: 'none', pos: 'right' }),
    logo: 'img/logo-paper.png',
    qr: 'img/qr.png'
  };
  if (!fs.existsSync(IMG + 'logo-paper.png')) {
    const svg = fs.readFileSync(PUB + 'bridge 2.svg', 'utf8');
    await sharp(Buffer.from(svg.replace(/#5E5E5E/gi, '#F4EFE6'))).resize(1400).png().toFile(IMG + 'logo-paper.png');
    await sharp(Buffer.from(svg.replace(/#5E5E5E/gi, '#1A1816'))).resize(1400).png().toFile(IMG + 'logo-ink.png');
    await require('qrcode').toFile(IMG + 'qr.png', 'https://www.bridgeconsult.uz', { margin: 0, width: 800, color: { dark: '#F4EFE6', light: '#0D0C0B' } });
  }
  const logos = [];
  for (const [i, l] of ['ADB logo stacked.png', 'wb.webp', 'EBRD-Logo-1991.webp', 'lcia-logo.png', 'ciarb-logo.png', 'drbf-logo.png', 'icaa-logo.png', 'bureau-veritas.png'].entries())
    logos.push(await mono(l, `logo-${i}.png`));

  let pageNo = 0;
  const folio = (dark, label) => {
    const n = String(pageNo).padStart(2, '0');
    const even = pageNo % 2 === 0;
    return `<footer class="folio ${even ? 'even' : 'odd'}"><span class="fn">${n}</span><span class="fl">${label}</span><span class="fm">BRIDGE · Выпуск 01 · Осень 2026</span></footer>`;
  };
  const page = (cls, html, label) => { pageNo++; return `<section class="page ${cls}">${html}${label === false ? '' : folio(/dark/.test(cls), label)}</section>`; };
  const kicker = (t, n) => `<div class="kicker">${n ? `<b>${n}</b>` : ''}<i></i>${H(t)}</div>`;

  const pages = [];

  // 01 · COVER ─────────────────────────────────────────────────
  pages.push(page('dark cover', `
    <img class="bleed" src="${I.cover}" alt="">
    <div class="cover-shade"></div>
    <div class="mast-row"><span>Выпуск 01</span><span>Осень 2026</span><span>Ташкент · Worldwide</span></div>
    <h1 class="masthead">Bridge</h1>
    <div class="mast-sub">${H('Журнал о контрактах, которые строят инфраструктуру')}</div>
    <div class="cover-story">
      <div class="kicker light"><i></i>Главная тема</div>
      <h2>${H('Контракты,')}<br>${H('которые работают')}<br><em>${H('на проект.')}</em></h2>
    </div>
    <ol class="cover-lines">
      <li><b>04</b><span>${H('Независимая экспертиза для инфраструктуры Узбекистана и Центральной Азии')}</span></li>
      <li><b>08</b><span>${H('FIDIC: вся линейка проформ — от Red до White Book')}</span></li>
      <li><b>10</b><span>${H('Восемь проектов: от Олимпийского городка до перевала Камчик')}</span></li>
      <li><b>13</b><span>${H('Лица компании')}</span></li>
    </ol>
    <div class="cover-foot"><span>BRIDGE Consult LLC</span><span>41.2995° N · 69.2401° E</span><span>bridgeconsult.uz</span></div>
  `, false));

  // 02 · CONTENTS ──────────────────────────────────────────────
  const toc = [
    ['03', 'Портрет', 'Лариса Белоусова: 27 лет в инфраструктурных контрактах'],
    ['04', 'О компании', 'Мост между международным стандартом и местной практикой'],
    ['05', 'В цифрах', 'Масштаб и три причины выбрать Bridge Consult'],
    ['06', 'Практика', 'Четыре направления — полный цикл контракта'],
    ['08', 'Экспертиза', 'Линейка FIDIC, анализ задержек и советы по спорам'],
    ['10', 'Портфолио', 'Избранные проекты 2010–2026'],
    ['13', 'Команда', 'Инженеры, юристы, сметчики и эксперты по качеству'],
    ['14', 'Признание', 'Аккредитации, членства и публикации'],
    ['15', 'Академия', 'Продвинутый контракт-менеджмент'],
    ['16', 'Контакты', 'Начнём с разговора']
  ];
  pages.push(page('paper contents', `
    <div class="inner">
      ${kicker('Выпуск 01 · Осень 2026')}
      <h2 class="toc-title">Содержание</h2>
      <ol class="toc">${toc.map(([n, s, t]) => `<li><span class="tn">${n}</span><span class="ts">${s}</span><span class="tt">${H(t)}</span></li>`).join('')}</ol>
      <div class="imprint">
        <div><b>Издатель</b>BRIDGE Consult LLC</div>
        <div><b>Адрес</b>${H('100180, Ташкент, Юнусабадский район, ул. Ахмада Дониша, 12 квартал, 20А')}</div>
        <div><b>Связь</b>+998 33 000 15 30<br>info@bridgeconsult.uz</div>
        <div><b>Сайт</b>bridgeconsult.uz<br>t.me/fidicuzb</div>
      </div>
    </div>
  `, 'Содержание'));

  // 03 · FOUNDER ───────────────────────────────────────────────
  pages.push(page('paper founder', `
    <figure class="founder-img"><img src="${I.founder}" alt=""><figcaption>Лариса Константиновна Белоусова,<br>основатель и директор BRIDGE Consult</figcaption></figure>
    <div class="founder-text">
      ${kicker('Портрет', '03')}
      <blockquote class="big-quote"><span class="hang">«</span>${H('Сильный контракт создаёт не барьеры, а ясность, доверие и общий путь к результату.')}»</blockquote>
      <div class="cols-1 dropcap">
        ${P('Лариса Белоусова — эксперт по инфраструктурным контрактам, закупкам, строительным требованиям и разрешению споров. За плечами — 27 лет управленческого опыта в производстве и строительстве, логистике и закупках, из них более 15 лет специализированной работы с контрактами FIDIC и проектами, финансируемыми международными финансовыми институтами.')}
        ${P('Её опыт охватывает автомобильные дороги, транспортную и аэропортовую инфраструктуру, городскую среду, водоснабжение и канализацию, энергетику и крупные общественные объекты. Специализация — администрирование контрактов FIDIC, структурирование моделей EPC и EPC+F, подготовка закупочной документации, управление изменениями, сроками, стоимостью и договорными рисками.')}
        ${P('Обладает квалификациями FCCE и FCCP — сертифицированный инженер-консультант и профессиональный консультант FIDIC, аккредитована Азиатским банком развития как специалист по управлению контрактами и предотвращению споров.')}
      </div>
      <dl class="facts">
        <div><dt>27</dt><dd>${H('лет управленческого опыта в строительстве, логистике и закупках')}</dd></div>
        <div><dt>15+</dt><dd>${H('лет работы с контрактами FIDIC и проектами МФИ')}</dd></div>
        <div><dt>6</dt><dd>${H('книг FIDIC в практике: Red, Yellow, Silver, MDB Harmonised, Subcontract, White')}</dd></div>
      </dl>
      <div class="creds-row"><span>FCCE</span><span>FCCP</span><span>ADB Accredited</span><span>MCIArb</span><span>DRBF</span></div>
    </div>
  `, 'Портрет'));

  // 04 · ABOUT ─────────────────────────────────────────────────
  pages.push(page('paper about', `
    <div class="inner">
      ${kicker('О компании', '04')}
      <h2 class="feature-title">${H('Мост между')} <em>${H('международным стандартом')}</em> ${H('и местной практикой')}</h2>
      <p class="standfirst">${esc(body('BRIDGE Consult — независимая консалтинговая компания из Ташкента. С 2016 года мы помогаем государственному сектору, международным финансовым институтам, инвесторам и подрядчикам доводить до результата масштабные инфраструктурные проекты.'))}</p>
      <figure class="about-img"><img src="${I.about}" alt=""><figcaption>${H('Контракт — это система управления результатом: людьми, сроками, рисками и доверием.')}</figcaption></figure>
      <div class="cols-2 dropcap">
        ${P('BRIDGE Consult специализируется на контрактном инжиниринге, администрировании строительных контрактов и разрешении споров в международных инфраструктурных проектах. Компания предоставляет экспертную поддержку клиентам из государственного сектора, международным финансовым институтам, инвесторам и подрядчикам, включая проекты, финансируемые международными банками развития.')}
        ${P('Компания основана в 2016 году и зарегистрирована в Республике Узбекистан. Её миссия — поддержка успешной реализации международных инфраструктурных проектов посредством профессионального контрактного инжиниринга, эффективного управления строительными контрактами и применения современных механизмов разрешения споров.')}
        <blockquote class="pull">${H('Надёжная правовая и управленческая основа для сотрудничества государства, МФИ, инвесторов и подрядчиков.')}</blockquote>
        ${P('Мы стремимся обеспечить прозрачность, правовую надёжность и эффективное управление рисками на всех этапах жизненного цикла проекта — интегрируя передовой международный опыт, стандарты FIDIC и глубокую экспертизу в управлении контрактами и проектами.')}
        ${P('Наша цель — создание надёжной правовой и управленческой основы для сотрудничества между государственным сектором, международными финансовыми институтами, инвесторами и подрядчиками.')}
      </div>
    </div>
  `, 'О компании'));

  // 05 · NUMBERS + WHY ─────────────────────────────────────────
  pages.push(page('dark numbers', `
    <img class="bleed top" src="${I.numbers}" alt="">
    <div class="numbers-shade"></div>
    <div class="inner">
      ${kicker('В цифрах', '05')}
      <h2 class="section-title light">${H('Опыт,')} <em>${H('подтверждённый проектами')}</em></h2>
      <div class="stats">
        ${[['10', '+', 'лет на рынке', 'Компания основана в 2016 году в Ташкенте'],
           ['20', '+', 'крупных проектов', 'Дороги, водоснабжение, энергетика, городская среда'],
           ['27', '', 'лет опыта основателя', 'Из них более 15 лет — контракты FIDIC и проекты МФИ'],
           ['5', '', 'проформ FIDIC в практике', 'Red, Yellow, Silver, MDB Harmonised и White Book']]
          .map(([n, s, k, v]) => `<div class="stat"><div class="sn">${n}<em>${s}</em></div><div class="sk">${H(k)}</div><div class="sv">${H(v)}</div></div>`).join('')}
      </div>
      <div class="why">
        <h3 class="why-title">${H('Почему выбирают')} <em>Bridge Consult</em></h3>
        ${[['01', 'Международный стандарт', 'Глубокое понимание проформ FIDIC, EPC-контрактов и жёстких требований международных финансовых институтов.'],
           ['02', 'Локальная адаптация', 'Интеграция международных контрактов в правовое поле Республики Узбекистан без потери их юридической силы.'],
           ['03', 'Комплексная защита', 'Защита интересов клиента на всех уровнях: от сметного аудита до представительства в арбитраже.']]
          .map(([n, h, t]) => `<div class="why-item"><span class="wn">${n}</span><h4>${H(h)}</h4>${P(t)}</div>`).join('')}
      </div>
    </div>
  `, 'В цифрах'));

  // 06–07 · SERVICES ───────────────────────────────────────────
  const services = [
    ['01', 'Контрактный инжиниринг', 'FIDIC / EPC', [
      ['Структурирование и тендеры', 'Подготовка полного пакета документации для закупочных процедур, включая технические спецификации и критерии оценки.'],
      ['Тендерный инжиниринг', 'Анализ заявок, выявление скрытых рисков в тендерной документации.'],
      ['Разработка контрактов', 'Разработка и адаптация международных строительных контрактов FIDIC и EPC.'],
      ['Аудит контрактной стратегии', 'Оценка и выбор оптимальной модели контракта.']]],
    ['02', 'Администрирование контрактов', 'Claims · Risks', [
      ['Управление претензиями', 'Профессиональный анализ, подготовка и защита позиции клиента, превентивные меры по недопущению споров.'],
      ['Риски и изменения', 'Идентификация рисков, регламентация всех изменений по объёму, срокам и стоимости.'],
      ['Бюджет и качество', 'Контроль бюджета, закупок и качества согласно техническим и нормативным требованиям.']]],
    ['03', 'Споры и арбитраж', 'DAAB · ADR', [
      ['Советы по спорам DAAB / DAB', 'Представительство сторон, консультационная поддержка и предоставление экспертов.'],
      ['Медиация', 'Применение процедур медиации для внесудебного урегулирования.'],
      ['Поддержка в арбитраже', 'Экспертная поддержка и подготовка доказательной базы в процедурах Claims & Arbitration.']]],
    ['04', 'Аналитика и обучение', 'FDA · Quantum', [
      ['Оценка финансовых рисков', 'Forensic Delay Analysis — анализ задержек и Quantum Calculation — расчёт вариаций и убытков.'],
      ['Локальная адаптация', 'Приведение условий международных контрактов в соответствие с законодательством Республики Узбекистан.'],
      ['Институциональное развитие', 'Семинары и тренинги по администрированию контрактов и управлению претензиями.']]]
  ];
  pages.push(page('paper services-open', `
    <figure class="svc-img"><img src="${I.services}" alt=""></figure>
    <div class="svc-open">
      ${kicker('Практика', '06')}
      <h2 class="feature-title">${H('Четыре')}<br><em>${H('направления')}</em></h2>
      <p class="standfirst">${esc(body('Полный цикл сопровождения инфраструктурного контракта — от тендерной стратегии до защиты позиции в арбитраже.'))}</p>
      <ol class="svc-index">${services.map(([n, t, tag]) => `<li><span class="si-n">${n}</span><span class="si-t">${H(t)}</span><span class="si-tag">${tag}</span></li>`).join('')}</ol>
    </div>
  `, 'Практика'));
  pages.push(page('paper services', `
    <div class="inner">
      <div class="svc-grid">
        ${services.map(([n, t, tag, items]) => `<article class="svc">
          <header><span class="svc-n">${n}</span><span class="svc-tag">${tag}</span></header>
          <h3>${H(t)}</h3>
          <dl>${items.map(([k, v]) => `<dt>${H(k)}</dt><dd>${esc(body(v))}</dd>`).join('')}</dl>
        </article>`).join('')}
      </div>
    </div>
  `, 'Практика'));

  // 08–09 · FIDIC ──────────────────────────────────────────────
  const books = [['Red', 'Строительство по проекту Заказчика', '#8E2F25', 1, 214],
                 ['Yellow', 'Проектирование и строительство', '#C9A13B', 0, 196],
                 ['Silver', 'EPC / объекты под ключ', '#B3B4B0', 0, 226],
                 ['Pink', 'Гармонизированное издание для МБР', '#C98E93', 0, 186],
                 ['White', 'Договор с консультантом', '#E9E4DA', 0, 206]];
  pages.push(page('dark fidic', `
    <img class="bleed" src="${I.fidic}" alt="">
    <div class="fidic-shade"></div>
    <div class="inner">
      ${kicker('Экспертиза', '08')}
      <h2 class="section-title light big">${H('Вся линейка')}<br><em>${H('проформ FIDIC')}</em></h2>
      <p class="standfirst light">${esc(body('Международная федерация инженеров-консультантов (FIDIC) предоставляет золотой стандарт типовых контрактов. Команда применяет всю линейку проформ.'))}</p>
      <div class="shelf">${books.map(([n, cap, col, light, h]) => `<div class="book${light ? ' light' : ''}" style="--c:${col};--h:${h}px"><span class="bk-top">FIDIC</span><span class="bk-name">${n} Book</span><span class="bk-cap">${H(cap)}</span></div>`).join('')}</div>
    </div>
  `, 'Экспертиза'));
  pages.push(page('paper methods', `
    <div class="inner">
      ${kicker('Методы', '09')}
      <h2 class="feature-title">${H('Инструменты,')} <em>${H('которые решают споры до арбитража')}</em></h2>
      <div class="method">
        <div class="m-label"><span>FDA</span></div>
        <div class="m-body"><h3>Forensic Delay Analysis</h3>
          ${P('Применяется для ретроспективного анализа задержек в строительстве. Мы используем методы Society of Construction Law (SCL) Protocol, включая Time Impact Analysis и Time Slice Analysis, чтобы доказать или опровергнуть право подрядчика на продление сроков (EOT) и компенсацию затрат.')}</div>
      </div>
      <div class="method">
        <div class="m-label"><span>DAAB</span></div>
        <div class="m-body"><h3>Dispute Avoidance and Adjudication Board</h3>
          ${P('Инструмент досудебного урегулирования споров. Мы помогаем структурировать работу советов DAAB, подготавливаем позиционные документы (Position Papers) и представляем интересы клиентов на слушаниях, минимизируя риск передачи дела в дорогостоящий международный арбитраж.')}</div>
      </div>
      <div class="method">
        <div class="m-label"><span>RU·UZ</span></div>
        <div class="m-body"><h3>Локальная адаптация</h3>
          ${P('Интеграция лучших мировых практик в реальные условия проектов: приведение международных контрактов в соответствие с законодательством Республики Узбекистан без потери их юридической силы.')}</div>
      </div>
      <blockquote class="pull wide">${H('Интеграция лучших мировых практик урегулирования споров в реальные условия проектов.')}</blockquote>
    </div>
  `, 'Экспертиза'));

  // 10–12 · PROJECTS ───────────────────────────────────────────
  pages.push(page('dark project-open', `
    <img class="bleed" src="${I.olympic}" alt="">
    <div class="po-shade"></div>
    <div class="inner">
      ${kicker('Портфолио', '10')}
      <h2 class="po-title">${H('Избранные')}<br><em>${H('проекты')}</em></h2>
      <div class="case-hero">
        <div class="case-meta"><span>01</span><span>EPC+F</span><span>2022 — 2025</span></div>
        <h3>${H('Олимпийский городок, Ташкент')}</h3>
        ${P('Строительство современных спортивных объектов для проведения IV Летних Азиатских юношеских игр. Проект объединяет спортивную, инженерную и энергетическую инфраструктуру в формате EPC+F: фотоэлектрические панели BIPV и VAPV, 50-метровый бассейн по стандарту FINA, велотрек стандарта UCI, система сбора дождевой воды.')}
        <div class="case-client">${H('Заказчик — Министерство строительства и ЖКХ Республики Узбекистан')}</div>
      </div>
    </div>
  `, 'Портфолио'));
  const caseBig = (img, n, contract, period, title, text, client) => `
    <article class="case-big"><figure><img src="${img}" alt=""></figure>
      <div class="case-meta onpaper"><span>${n}</span><span>${contract}</span><span>${period}</span></div>
      <h3>${H(title)}</h3>${P(text)}<div class="case-client">${H(client)}</div></article>`;
  pages.push(page('paper cases', `
    <div class="inner">
      ${caseBig(I.tic, '02', 'FIDIC White Book · EPC+F', '2025 — н. в.', 'АО «Tashkent Invest Company»',
        'Разработка и внедрение системы закупок и управления контрактами для инфраструктурных проектов по модели EPC+F, включая EPC-контракты и контракты на инженерно-консультационные услуги. Системное управление контрактами вместо разрозненных процедур — с решениями, которые выдерживают аудит.',
        'Городская инфраструктура Ташкента')}
      ${caseBig(I.srrp, '03', 'FIDIC Red Book · АБР', '2024 — 2025', 'Реконструкция дорог SRRP',
        'Три лота SRRP: реконструкция 107 км автомобильных дорог 4R105 (км 5–70) и 4R100 (км 128–174). Контроль договорных сроков и уведомлений, работа с объёмами и изменениями, подготовка позиции подрядчика в формате, который ожидает инженер по FIDIC.',
        'Финансирование — Азиатский банк развития')}
    </div>
  `, 'Портфолио'));
  const small = [[I.kamchik, '04', 'MDB Harmonised', '2016 — 2022', 'Автодорога А-373, перевал Камчик', 'Транспортный коридор ЦАРЭС 2: реконструкция автодороги Ташкент — Ош на участке перевала. Заказчик — АО EVRASCON.'],
                 [I.water, '05', 'FIDIC / ICB · АБР', '2016 — 2024', 'Водоснабжение Самаркандской области', 'Системы водоснабжения и водозаборные сооружения по ICB-контрактам стандарта АБР. Заказчик — Suv-Taraqqiyot.'],
                 [I.a380, '06', 'MDB Harmonised · АБР', '2010 — 2013', 'Автодорога А-380, ЦАРЭС 2', 'Реконструкция коридора Ташкент — Бухара — Нукус — Бейнеу. POSCO Engineering, GP Papenburg.'],
                 [I.nurafshon, '07', 'EPC', '2017', 'Smart City Нурафшон', 'Инфраструктура «умного города»: интеграция городской инженерии и цифровых систем.'],
                 [I.energy, '08', 'ADB', '2017', 'Учёт электроэнергии', 'Автоматизированный мониторинг и учёт электроэнергии в Бухарской, Джизакской и Самаркандской областях.']];
  pages.push(page('paper cases-index', `
    <div class="inner">
      ${kicker('Также в портфолио', '12')}
      <div class="index-grid">
        ${small.map(([img, n, c, p, t, d]) => `<article class="case-sm"><figure><img src="${img}" alt=""></figure>
          <div class="case-meta onpaper"><span>${n}</span><span>${c}</span><span>${p}</span></div><h4>${H(t)}</h4>${P(d)}</article>`).join('')}
        <aside class="water-note">
          <div class="kicker"><i></i>Водоснабжение</div>
          <ul>
            <li><b>${H('Янгиюль и Жийдакапа')}</b>${H('Реконструкция систем водоснабжения. World Bank, EBRD. FIDIC Yellow Book.')}</li>
            <li><b>Наманган</b>${H('Водоснабжение северной части города, трубопровод 60,07 км. OPEC Fund.')}</li>
          </ul>
        </aside>
      </div>
    </div>
  `, 'Портфолио'));

  // 13 · TEAM ──────────────────────────────────────────────────
  const team = [
    [I.anna, 'Анна Убайдуллаева', 'Партнёр и юридический консультант, д-р', 'Международный арбитр Ташкентского (TIAC) и Венского (VIAC) международных арбитражных центров, резидент AIAC. Консультант проектов Всемирного банка по правовым и институциональным реформам.'],
    [I.ernest, 'Эрнест Белоусов', 'Ведущий специалист по контрактам FIDIC', 'Управление международными строительными контрактами и сопровождение сложных инфраструктурных проектов; Red, Yellow и Silver Books.'],
    [I.lucia, 'Люция Ахмедиева', 'Руководитель сметного отдела', 'Более 40 лет в контроле объёмов и техническом управлении: тендерная и сметная документация, BoQ, оценка стоимости и контроль бюджета.'],
    [I.olga, 'Ольга Митрофанова', 'Руководитель отдела контроля качества', 'Более 50 лет в строительном инжиниринге и управлении качеством. Аудитор систем менеджмента качества ISO 9001:2015.']
  ];
  pages.push(page('dark team', `
    <div class="inner">
      ${kicker('Команда', '13')}
      <h2 class="section-title light">${H('Лица')} <em>${H('компании')}</em></h2>
      <p class="team-lead">${H('Фундамент BRIDGE Consult — опыт специалистов с десятилетиями практики в инженерном деле, юриспруденции и международном арбитраже.')}</p>
      <div class="team-grid">
        ${team.map(([img, n, r, t]) => `<article class="person"><figure><img src="${img}" alt=""></figure><h3>${H(n)}</h3><div class="role">${H(r)}</div><p class="ragged">${esc(body(t))}</p></article>`).join('')}
      </div>
    </div>
  `, 'Команда'));

  // 14 · RECOGNITION ───────────────────────────────────────────
  const creds = ['Член Сертификационного комитета FCCE, FIDIC Credentialing', 'Член Комитета FIDIC по управлению добросовестностью (FIDIC IMC)',
    'FCCE — сертифицированный инженер-консультант FIDIC', 'FCCP — сертифицированный профессиональный консультант FIDIC',
    'Аккредитованный АБР специалист по управлению контрактами и предотвращению споров', 'MCIArb — член Королевского института арбитров',
    'Член Европейского совета пользователей LCIA', 'Член программы ICAA Next Generation',
    'Арбитр МКАС при Торгово-промышленной палате Республики Узбекистан', 'Член Австрийской арбитражной ассоциации',
    'DRBF — практик Совета по разрешению споров', 'Независимый медиатор, зарегистрированный в Минюсте Республики Узбекистан',
    'Действительный член KNAPEK', 'Член Правления Ассоциации дорожников Узбекистана',
    'Член Института управления проектами (PMI)', 'PCQI — практик Королевского института качества (CQI)'];
  pages.push(page('paper recognition', `
    <div class="inner">
      ${kicker('Признание', '14')}
      <h2 class="feature-title">${H('Международное')} <em>${H('признание')}</em></h2>
      <div class="rec-grid">
        <ol class="creds">${creds.map(c => `<li>${esc(body(c))}</li>`).join('')}</ol>
        <div class="rec-side">
          <div class="logo-wall">${logos.map(l => `<div><img src="${l}" alt=""></div>`).join('')}</div>
          <div class="media">
            <div class="kicker"><i></i>О компании в СМИ</div>
            <article><span>UzReport.news</span><h4>${H('Что такое FIDIC и нужен ли он Узбекистану?')}</h4>${P('Интервью с директором BRIDGE Consult о значении международных стандартов для инфраструктурных проектов и строительной отрасли Узбекистана.')}</article>
            <article><span>CareerCentre.uz</span><h4>${H('Профиль BRIDGE Consult')}</h4>${P('Независимый обзор компетенций компании: контрактный менеджмент, Forensic Delay Analysis, урегулирование споров и медиация.')}</article>
          </div>
          <blockquote class="pull trust">${H('Мы гордимся опытом сотрудничества с международными финансовыми институтами, глобальными инжиниринговыми партнёрами и ключевыми заказчиками.')}</blockquote>
          <div>
          </div>
        </div>
      </div>
    </div>
  `, 'Признание'));

  // 15 · ACADEMY ───────────────────────────────────────────────
  pages.push(page('dark academy', `
    <img class="bleed top-half" src="${I.academy}" alt="">
    <div class="ac-shade"></div>
    <div class="inner">
      ${kicker('Академия', '15')}
      <h2 class="section-title light big">${H('Продвинутый')}<br><em>${H('контракт-менеджмент')}</em></h2>
      <div class="ac-cols">
        <div class="cols-1 dropcap light">
          ${P('Программа построена в формате «от практики к теории»: положения контракта разбираются на сквозном кейсе инфраструктурного проекта с позиций Заказчика, Инженера, Подрядчика, планировщика и специалиста по претензиям. Традиционные лекции не проводятся.')}
        </div>
        <dl class="ac-facts">
          <dt>Корпоративное обучение</dt><dd>${esc(body('Индивидуальные программы адаптации проектной команды под международные стандарты и требования МФИ.'))}</dd>
          <dt>Аккредитованные эксперты</dt><dd>${esc(body('Семинары ведут сертифицированные инженеры-консультанты FIDIC с реальным опытом разрешения строительных споров.'))}</dd>
          <dt>Формат</dt><dd>Live · Онлайн · Офлайн · Разбор кейсов</dd>
        </dl>
      </div>
      <div class="ac-tags"><span>Red Book</span><span>Yellow Book</span><span>EPC / Silver</span><span>DAAB</span><span>Contract Management</span></div>
    </div>
  `, 'Академия'));

  // 16 · BACK COVER ────────────────────────────────────────────
  pages.push(page('dark back', `
    <img class="bleed" src="${I.back}" alt="">
    <div class="back-shade"></div>
    <div class="inner">
      <img class="back-logo" src="${I.logo}" alt="BRIDGE Consult">
      ${kicker('Контакты', '16')}
      <h2 class="back-title">${H('Начнём')}<br><em>${H('с разговора.')}</em></h2>
      <dl class="contacts">
        <div><dt>Телефон</dt><dd>+998 33 000 15 30</dd></div>
        <div><dt>Email</dt><dd>info@bridgeconsult.uz</dd></div>
        <div><dt>Сайт</dt><dd>bridgeconsult.uz</dd></div>
        <div><dt>Telegram</dt><dd>t.me/fidicuzb</dd></div>
        <div class="wide"><dt>Адрес</dt><dd>${H('100180, Ташкент, Юнусабадский район, ул. Ахмада Дониша, 12 квартал, 20А')}</dd></div>
      </dl>
      <div class="qr"><img src="${I.qr}" alt=""><span>Сканируйте —<br>сайт компании</span></div>
      <div class="motto">${H('Строим связи — достигаем результата')}</div>
    </div>
  `, false));

  const css = fs.readFileSync(path.join(__dirname, 'magazine.css'), 'utf8').replace(/url\(fonts\//g, `url(${FONTS.replace(/ /g, '%20')}`);
  const html = `<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>BRIDGE — Выпуск 01</title><style>${css}</style></head><body>${pages.join('\n')}</body></html>`;
  fs.writeFileSync(path.join(WORK, 'magazine.html'), html);

  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
  const pg = await browser.newPage();
  await pg.goto('file://' + path.join(WORK, 'magazine.html'), { waitUntil: 'networkidle' });
  await pg.evaluate(() => document.fonts.ready);
  await pg.pdf({ path: OUT, width: '210mm', height: '297mm', printBackground: true, preferCSSPageSize: true, tagged: true });
  if (process.env.SHOTS) {
    await pg.setViewportSize({ width: 794, height: 1123 });
    const n = await pg.$$eval('.page', p => p.length);
    const els = await pg.$$('.page');
    for (let i = 0; i < n; i++) await els[i].screenshot({ path: path.join(process.env.SHOTS, `p${String(i + 1).padStart(2, '0')}.png`) });
  }
  await browser.close();
  console.log('wrote', OUT, pageNo, 'pages');
})();
