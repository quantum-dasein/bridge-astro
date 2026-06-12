#!/usr/bin/env python3
"""Replace the hero + project-list sections of projects.html (RU/EN/UZ)
with the interactive 3D 'Project Universe', reusing existing translated
content verbatim inside the detail overlay."""
import re, sys
sys.stdout.reconfigure(encoding='utf-8')

HERO_MARK = '<section class="pt-40 pb-32 md:pt-48 md:pb-40 bg-bridge-dark relative overflow-hidden font-sans">'
PROJ_MARK = '<section class="py-16 md:py-24 overflow-hidden relative font-sans">'
CTA_MARK  = '<section class="py-20 bg-white border-t border-bridge-taupe/20 font-sans">'
AOS_MARK  = '<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>'

MOUSE_SVG = ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">'
             '<rect x="7" y="3" width="10" height="18" rx="5"/><line x1="12" y1="7" x2="12" y2="10"/></svg>')

LANGS = {
    'public/projects.html': {
        'prefix': '',
        'eyebrow': 'ПРОЕКТЫ', 'hint': 'Вращайте сферу · нажмите на проект',
        'auto': 'Автовращение', 'loading': 'Загрузка сцены', 'close': 'Закрыть',
        'labels': [
            ('01', 'Спортивная инфраструктура', 'Олимпийский городок', 'poster-olympic.jpg'),
            ('02', 'Институциональное развитие', 'Tashkent Invest Company', 'tashkent-invest-company.png'),
            ('03', 'Дорожное строительство', 'Реконструкция дорог', 'poster-drone.jpg'),
            ('04', 'Транспортный коридор', 'Автодорога А-373 (Камчик)', 'kamchik.avif'),
        ],
    },
    'public/EN/projects.html': {
        'prefix': '../',
        'eyebrow': 'PROJECTS', 'hint': 'Drag to rotate · click a project',
        'auto': 'Auto-rotate', 'loading': 'Loading scene', 'close': 'Close',
        'labels': [
            ('01', 'Sports Infrastructure', 'Olympic City', 'poster-olympic.jpg'),
            ('02', 'Institutional Development', 'Tashkent Invest Company', 'tashkent-invest-company.png'),
            ('03', 'Road Construction', 'Highway Reconstruction', 'poster-drone.jpg'),
            ('04', 'Transport Corridor', 'A-373 Highway (Kamchik)', 'kamchik.avif'),
        ],
    },
    'public/UZ/projects.html': {
        'prefix': '../',
        'eyebrow': 'LOYIHALAR', 'hint': 'Sferani aylantiring · loyihani bosing',
        'auto': 'Avto-aylanish', 'loading': 'Sahna yuklanmoqda', 'close': 'Yopish',
        'labels': [
            ('01', 'Sport infratuzilmasi', 'Olimpiya shaharchasi', 'poster-olympic.jpg'),
            ('02', 'Institutsional rivojlantirish', 'Tashkent Invest Company', 'tashkent-invest-company.png'),
            ('03', "Yo'l qurilishi", "Yo'llar rekonstruksiyasi", 'poster-drone.jpg'),
            ('04', "Transport yo'lagi", "A-373 yo'li (Qamchiq)", 'kamchik.avif'),
        ],
    },
}


def build_region(cfg, h1, sub, articles):
    p = cfg['prefix']
    # node labels
    label_html = ''
    for i, (num, cat, name, thumb) in enumerate(cfg['labels']):
        label_html += (
            '\n        <button class="uni-label" type="button" data-idx="%d">'
            '<img class="uni-thumb" src="%s%s" alt="" loading="lazy">'
            '<span class="uni-label-txt"><span class="uni-num">%s</span>'
            '<span class="uni-cat">%s</span><span class="uni-name">%s</span></span></button>'
            % (i, p, thumb, num, cat, name)
        )
    # detail cards
    cards_html = ''
    for i, art in enumerate(articles):
        cards_html += '\n            <div class="uni-detail-card" data-idx="%d"%s>%s</div>' % (
            i, '' if i == 0 else ' hidden', art)

    return (
        '<!-- ============ 3D PROJECT UNIVERSE ============ -->\n'
        '<section id="universe">\n'
        '    <div class="uni-bg"></div>\n'
        '    <div id="uni-canvas-wrap"></div>\n'
        '    <div id="uni-labels">%s\n    </div>\n\n'
        '    <div class="uni-head"><div class="uni-head-inner">\n'
        '        <div class="uni-eyebrow"><span></span>%s<em>// PROJECTS UNIVERSE</em></div>\n'
        '        <h1 class="uni-h1">%s</h1>\n'
        '        <p class="uni-sub">%s</p>\n'
        '    </div></div>\n\n'
        '    <div class="uni-hint">%s %s</div>\n'
        '    <button id="uni-autorotate" class="uni-auto is-on" type="button"><span class="uni-auto-dot"></span>%s</button>\n'
        '    <div id="uni-loading" class="uni-loading"><span class="uni-spinner"></span>%s</div>\n'
        '</section>\n\n'
        '<!-- Project detail overlay -->\n'
        '<div id="uni-detail" class="uni-detail" aria-hidden="true">\n'
        '    <div class="uni-detail-backdrop" data-uni-close></div>\n'
        '    <div class="uni-detail-panel" role="dialog" aria-modal="true">\n'
        '        <button class="uni-detail-close" type="button" data-uni-close aria-label="%s">&times;</button>\n'
        '        <div class="uni-detail-body">%s\n        </div>\n'
        '    </div>\n'
        '</div>\n\n'
        % (label_html, cfg['eyebrow'], h1, sub, MOUSE_SVG, cfg['hint'],
           cfg['auto'], cfg['loading'], cfg['close'], cards_html)
    )


for path, cfg in LANGS.items():
    print('\n=== %s ===' % path)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'id="universe"' in content:
        print('  SKIP: already converted')
        continue

    a = content.find(HERO_MARK)
    b = content.find(PROJ_MARK)
    c = content.find(CTA_MARK)
    if a < 0 or b < 0 or c < 0 or not (a < b < c):
        print('  ERROR: markers not found/ordered  a=%d b=%d c=%d' % (a, b, c))
        continue

    hero_slice = content[a:b]
    proj_slice = content[b:c]

    m = re.search(r'<h1[^>]*>(.*?)</h1>', hero_slice, re.S)
    h1 = m.group(1).strip() if m else 'Projects'
    m = re.search(r'<p[^>]*>(.*?)</p>', hero_slice, re.S)
    sub = (m.group(1).strip() if m else '')

    articles = re.findall(r'<article\b.*?</article>', proj_slice, re.S)
    if len(articles) != 4:
        print('  WARN: expected 4 articles, found %d' % len(articles))
    # strip AOS attrs so cards are visible inside the overlay
    articles = [re.sub(r'\s+data-aos(?:-delay)?="[^"]*"', '', art) for art in articles]

    region = build_region(cfg, h1, sub, articles)
    content = content[:a] + region + content[c:]

    # inject CSS link
    css_link = '    <link rel="stylesheet" href="%sprojects-universe.css">\n' % cfg['prefix']
    if 'projects-universe.css' not in content:
        content = content.replace('</head>', css_link + '</head>', 1)

    # inject scripts before AOS
    scripts = (
        '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>\n'
        '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>\n'
        '<script src="%sprojects-universe.js"></script>\n' % cfg['prefix']
    )
    if 'projects-universe.js' not in content:
        content = content.replace(AOS_MARK, scripts + AOS_MARK, 1)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print('  OK: h1=%r  articles=%d  saved' % (h1[:40], len(articles)))

print('\nDone.')
