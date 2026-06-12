#!/usr/bin/env python3
"""SEO pass for projects.html (RU/EN/UZ):
1. descriptive alt texts on the 4 project node thumbnails
2. JSON-LD ItemList of the projects
3. preconnect to cdnjs (three.js / gsap)"""
import json, re, sys
sys.stdout.reconfigure(encoding='utf-8')

LANGS = {
    'public/projects.html': {
        'list_name': 'Проекты Bridge Consult — FIDIC и EPC контракты',
        'projects': [
            ('Олимпийский городок (Olympic City)', 'Строительство современных спортивных объектов для IV Летних Азиатских юношеских игр в Ташкенте. Контракт EPC+F, 2022-2025.', 'Олимпийский городок (Olympic City) — спортивная инфраструктура, Ташкент'),
            ('АО «Tashkent Invest Company»', 'Разработка и внедрение системы закупок и управления контрактами для инфраструктурных проектов по модели EPC+F.', 'АО Tashkent Invest Company — институциональное развитие'),
            ('Реконструкция дорог (SRRP)', 'Реконструкция 107 км автомобильных дорог 4R105 и 4R100 по FIDIC Red Book при финансировании АБР.', 'Реконструкция дорог SRRP — дорожное строительство, FIDIC Red Book'),
            ('Автодорога А-373 (Перевал Камчик)', 'Транспортный коридор ЦАРЭС 2: реконструкция автодороги А-373 Ташкент-Ош, FIDIC MDB Harmonised.', 'Автодорога А-373 Ташкент-Ош, перевал Камчик'),
        ],
    },
    'public/EN/projects.html': {
        'list_name': 'Bridge Consult Projects — FIDIC and EPC Contracts',
        'projects': [
            ('Olympic City', 'Construction of modern sports facilities for the IV Asian Youth Games in Tashkent. EPC+F contract, 2022-2025.', 'Olympic City — sports infrastructure, Tashkent'),
            ('Tashkent Invest Company JSC', 'Development and implementation of a procurement and contract management system for EPC+F infrastructure projects.', 'Tashkent Invest Company JSC — institutional development'),
            ('Highway Reconstruction (SRRP)', 'Reconstruction of 107 km of the 4R105 and 4R100 roads under FIDIC Red Book, financed by ADB.', 'SRRP highway reconstruction — road construction, FIDIC Red Book'),
            ('A-373 Highway (Kamchik Pass)', 'CAREC Corridor 2: reconstruction of the A-373 Tashkent-Osh highway, FIDIC MDB Harmonised.', 'A-373 Tashkent-Osh highway, Kamchik Pass'),
        ],
    },
    'public/UZ/projects.html': {
        'list_name': 'Bridge Consult loyihalari — FIDIC va EPC shartnomalari',
        'projects': [
            ('Olimpiya shaharchasi (Olympic City)', "Toshkentda IV yozgi Osiyo o'smirlar o'yinlari uchun zamonaviy sport inshootlarini qurish. EPC+F, 2022-2025.", 'Olimpiya shaharchasi — sport infratuzilmasi, Toshkent'),
            ('"Tashkent Invest Company" AJ', "EPC+F modeli bo'yicha infratuzilma loyihalari uchun xaridlar va shartnomalarni boshqarish tizimini joriy etish.", 'Tashkent Invest Company AJ — institutsional rivojlantirish'),
            ("Yo'llar rekonstruksiyasi (SRRP)", "4R105 va 4R100 avtomobil yo'llarining 107 km qismini FIDIC Red Book bo'yicha rekonstruksiya qilish (OTB).", "SRRP yo'llar rekonstruksiyasi — FIDIC Red Book"),
            ("A-373 yo'li (Qamchiq dovoni)", "CAREC 2 yo'lagi: A-373 Toshkent-O'sh avtomobil yo'lini rekonstruksiya qilish, FIDIC MDB Harmonised.", "A-373 Toshkent-O'sh yo'li, Qamchiq dovoni"),
        ],
    },
}

PRECONNECT = '    <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>\n'

for path, cfg in LANGS.items():
    print('=== %s ===' % path)
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()

    # 1. alt texts on node thumbnails (4 occurrences, in DOM order)
    alts = [p[2] for p in cfg['projects']]
    n = [0]
    def repl(m):
        alt = alts[n[0]] if n[0] < len(alts) else ''
        n[0] += 1
        return '<img class="uni-thumb" src="%s" alt="%s" loading="lazy">' % (m.group(1), alt.replace('"', '&quot;'))
    c, cnt = re.subn(r'<img class="uni-thumb" src="([^"]+)" alt="" loading="lazy">', repl, c)
    print('  alt texts: %d updated' % cnt)

    # 2. JSON-LD ItemList
    if '"@type": "ItemList"' not in c:
        items = [{
            '@type': 'ListItem', 'position': i + 1,
            'item': {'@type': 'CreativeWork', 'name': p[0], 'description': p[1]}
        } for i, p in enumerate(cfg['projects'])]
        ld = {'@context': 'https://schema.org', '@type': 'ItemList',
              'name': cfg['list_name'], 'numberOfItems': len(items), 'itemListElement': items}
        block = '    <script type="application/ld+json">\n    %s\n    </script>\n' % json.dumps(ld, ensure_ascii=False, indent=2).replace('\n', '\n    ')
        c = c.replace('</head>', block + '</head>', 1)
        print('  JSON-LD ItemList: added')
    else:
        print('  JSON-LD ItemList: already present')

    # 3. preconnect for three.js / gsap CDN
    if 'preconnect" href="https://cdnjs.cloudflare.com' not in c:
        c = c.replace('<script src="https://cdn.tailwindcss.com"></script>',
                      PRECONNECT.strip() + '\n        <script src="https://cdn.tailwindcss.com"></script>', 1)
        print('  preconnect: added')
    else:
        print('  preconnect: already present')

    with open(path, 'w', encoding='utf-8') as f:
        f.write(c)
    print('  saved')

print('Done.')
