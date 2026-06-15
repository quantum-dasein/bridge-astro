#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Replace the existing 4-item JSON-LD ItemList in projects.html (RU/EN/UZ)
with the full 8-project planet list. Targets only the ItemList <script> block,
leaving the VideoObject blocks intact."""
import json, re, sys
sys.stdout.reconfigure(encoding='utf-8')

DATA = {
    'public/projects.html': {
        'name': 'Проекты Bridge Consult — FIDIC и EPC контракты',
        'items': [
            ('Олимпийский городок (Olympic City)', 'Строительство спортивных объектов для IV Летних Азиатских юношеских игр в Ташкенте. EPC+F, 2022–2025.'),
            ('АО «Tashkent Invest Company»', 'Система закупок и управления контрактами для инфраструктурных проектов по модели EPC+F.'),
            ('Реконструкция дорог (SRRP)', 'Реконструкция 107 км дорог 4R105 и 4R100 по FIDIC Red Book при финансировании АБР.'),
            ('Автодорога А-373 (перевал Камчик)', 'Транспортный коридор ЦАРЭС 2: реконструкция А-373 Ташкент–Ош, FIDIC MDB Harmonised.'),
            ('Водоснабжение Самаркандской области', 'Системы водоснабжения и водозаборные сооружения по ICB-контрактам АБР, 2016–2024.'),
            ('Автодорога А-380 (ЦАРЭС 2)', 'Реконструкция А-380 Ташкент–Бухара–Нукус–Бейнеу при финансировании АБР, с 2010 года.'),
            ('Smart City Нурафшон', 'Инфраструктура «умного города» Нурафшон по модели EPC, 2017.'),
            ('Автоматизированный учёт электроэнергии', 'Система мониторинга электроэнергии для Бухарской, Джизакской и Самаркандской областей (АБР), 2017.'),
        ],
    },
    'public/EN/projects.html': {
        'name': 'Bridge Consult Projects — FIDIC and EPC Contracts',
        'items': [
            ('Olympic City', 'Construction of sports facilities for the IV Asian Youth Games in Tashkent. EPC+F, 2022–2025.'),
            ('Tashkent Invest Company JSC', 'Procurement and contract management system for EPC+F infrastructure projects.'),
            ('Highway Reconstruction (SRRP)', 'Reconstruction of 107 km of the 4R105 and 4R100 roads under FIDIC Red Book, financed by ADB.'),
            ('A-373 Highway (Kamchik Pass)', 'CAREC Corridor 2: reconstruction of the A-373 Tashkent–Osh highway, FIDIC MDB Harmonised.'),
            ('Water Supply, Samarkand Region', 'Water supply systems and intake facilities under ADB ICB contracts, 2016–2024.'),
            ('A-380 Highway (CAREC 2)', 'Reconstruction of the A-380 Tashkent–Bukhara–Nukus–Beyneu highway, financed by ADB, since 2010.'),
            ('Smart City Nurafshon', 'Smart-city infrastructure in Nurafshon under an EPC model, 2017.'),
            ('Automated Electricity Metering', 'Electricity monitoring system for the Bukhara, Jizzakh and Samarkand regions (ADB), 2017.'),
        ],
    },
    'public/UZ/projects.html': {
        'name': 'Bridge Consult loyihalari — FIDIC va EPC shartnomalari',
        'items': [
            ('Olimpiya shaharchasi (Olympic City)', "Toshkentda IV yozgi Osiyo o'smirlar o'yinlari uchun sport inshootlarini qurish. EPC+F, 2022–2025."),
            ('"Tashkent Invest Company" AJ', "EPC+F modeli bo'yicha xaridlar va shartnomalarni boshqarish tizimi."),
            ("Yo'llar rekonstruksiyasi (SRRP)", "4R105 va 4R100 yo'llarining 107 km qismini FIDIC Red Book bo'yicha rekonstruksiya qilish (ADB)."),
            ("A-373 yo'li (Qamchiq dovoni)", "CAREC 2 yo'lagi: A-373 Toshkent–O'sh yo'lini rekonstruksiya qilish, FIDIC MDB Harmonised."),
            ('Samarqand viloyati suv ta\'minoti', "ADB ICB shartnomalari bo'yicha suv ta'minoti tizimlari va suv olish inshootlari, 2016–2024."),
            ("A-380 avtoyo'li (CAREC 2)", "A-380 Toshkent–Buxoro–Nukus–Beyneu yo'lini ADB ishtirokida rekonstruksiya qilish, 2010 yildan."),
            ('Smart City Nurafshon', "Nurafshon «aqlli shahar» infratuzilmasi EPC modeli bo'yicha, 2017."),
            ('Avtomatlashtirilgan elektr hisobi', "Buxoro, Jizzax va Samarqand viloyatlari uchun elektr energiyasi monitoringi tizimi (ADB), 2017."),
        ],
    },
}

# match a <script type="application/ld+json"> ... </script> block that contains "ItemList"
PAT = re.compile(r'    <script type="application/ld\+json">\s*\{[^<]*?"@type": "ItemList".*?</script>\n', re.DOTALL)

for path, cfg in DATA.items():
    print('=== %s ===' % path)
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()

    items = [{
        '@type': 'ListItem', 'position': i + 1,
        'item': {'@type': 'CreativeWork', 'name': n, 'description': d}
    } for i, (n, d) in enumerate(cfg['items'])]
    ld = {'@context': 'https://schema.org', '@type': 'ItemList',
          'name': cfg['name'], 'numberOfItems': len(items), 'itemListElement': items}
    block = '    <script type="application/ld+json">\n    %s\n    </script>\n' % json.dumps(ld, ensure_ascii=False, indent=2).replace('\n', '\n    ')

    new, n = PAT.subn(block, c, count=1)
    if n == 0:
        print('  WARNING: ItemList block not found — nothing replaced')
    else:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new)
        print('  ItemList updated to %d items' % len(items))

print('\nDone.')
