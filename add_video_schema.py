#!/usr/bin/env python3
"""Add VideoObject JSON-LD to all pages with <video> elements."""
import json, sys
sys.stdout.reconfigure(encoding='utf-8')

BASE = 'https://www.bridgeconsult.uz'

PAGES = {
    'public/index.html': [
        {
            'name': 'Bridge Consult — Профиль компании',
            'description': 'Видеопрезентация компании Bridge Consult: консалтинг по FIDIC и EPC контрактам, управление строительными проектами в Узбекистане.',
            'thumbnailUrl': BASE + '/poster-ultra.jpg',
            'uploadDate': '2024-09-01',
            'contentUrl': BASE + '/ultra-bridge.mp4',
        }
    ],
    'public/EN/index.html': [
        {
            'name': 'Bridge Consult — Company Profile',
            'description': 'Video presentation of Bridge Consult: FIDIC and EPC contract consulting, construction project management in Uzbekistan.',
            'thumbnailUrl': BASE + '/poster-ultra.jpg',
            'uploadDate': '2024-09-01',
            'contentUrl': BASE + '/ultra-bridge.mp4',
        }
    ],
    'public/UZ/index.html': [
        {
            'name': "Bridge Consult — Kompaniya profili",
            'description': "Bridge Consult kompaniyasi taqdimoti: O'zbekistonda FIDIC va EPC shartnomalar bo'yicha konsalting, qurilish loyihalarini boshqarish.",
            'thumbnailUrl': BASE + '/poster-ultra.jpg',
            'uploadDate': '2024-09-01',
            'contentUrl': BASE + '/ultra-bridge.mp4',
        }
    ],
    'public/projects.html': [
        {
            'name': 'Олимпийский городок — строительство спортивных объектов',
            'description': 'Строительство современных спортивных объектов для IV Летних Азиатских юношеских игр в Ташкенте. EPC+F контракт, 2022–2025.',
            'thumbnailUrl': BASE + '/poster-olympic.jpg',
            'uploadDate': '2024-09-01',
            'contentUrl': BASE + '/olympic-city.mp4',
        },
        {
            'name': 'Реконструкция дорог SRRP — аэросъёмка',
            'description': 'Аэросъёмка реконструкции 107 км автодорог 4R105 и 4R100 по стандарту FIDIC Red Book при финансировании АБР.',
            'thumbnailUrl': BASE + '/poster-drone.jpg',
            'uploadDate': '2024-09-01',
            'contentUrl': BASE + '/drone-highway.mp4',
        },
    ],
    'public/EN/projects.html': [
        {
            'name': 'Olympic City — Sports Facilities Construction',
            'description': 'Construction of modern sports facilities for the IV Asian Youth Games in Tashkent. EPC+F contract, 2022–2025.',
            'thumbnailUrl': BASE + '/poster-olympic.jpg',
            'uploadDate': '2024-09-01',
            'contentUrl': BASE + '/olympic-city.mp4',
        },
        {
            'name': 'SRRP Highway Reconstruction — Aerial footage',
            'description': 'Aerial footage of the 107 km reconstruction of highways 4R105 and 4R100 under FIDIC Red Book, financed by ADB.',
            'thumbnailUrl': BASE + '/poster-drone.jpg',
            'uploadDate': '2024-09-01',
            'contentUrl': BASE + '/drone-highway.mp4',
        },
    ],
    'public/UZ/projects.html': [
        {
            'name': "Olimpiya shaharchasi — Sport inshootlarini qurish",
            'description': "Toshkentda IV yozgi Osiyo o'smirlar o'yinlari uchun zamonaviy sport inshootlarini qurish. EPC+F, 2022–2025.",
            'thumbnailUrl': BASE + '/poster-olympic.jpg',
            'uploadDate': '2024-09-01',
            'contentUrl': BASE + '/olympic-city.mp4',
        },
        {
            'name': "SRRP yo'llar rekonstruksiyasi — Aerosuratga olish",
            'description': "4R105 va 4R100 avtomobil yo'llarining 107 km qismini FIDIC Red Book bo'yicha rekonstruksiya qilish aerosurati.",
            'thumbnailUrl': BASE + '/poster-drone.jpg',
            'uploadDate': '2024-09-01',
            'contentUrl': BASE + '/drone-highway.mp4',
        },
    ],
}

for path, videos in PAGES.items():
    print('=== %s ===' % path)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    added = 0
    for v in videos:
        # skip if this exact video's structured data is already present
        if ('"@type": "VideoObject"' in content and v['name'] in content):
            print('  already has VideoObject for: %s' % v['name'])
            continue
        ld = {
            '@context': 'https://schema.org',
            '@type': 'VideoObject',
            'name': v['name'],
            'description': v['description'],
            'thumbnailUrl': v['thumbnailUrl'],
            'uploadDate': v['uploadDate'],
            'contentUrl': v['contentUrl'],
        }
        block = ('    <script type="application/ld+json">\n    '
                 + json.dumps(ld, ensure_ascii=False, indent=2).replace('\n', '\n    ')
                 + '\n    </script>\n')
        content = content.replace('</head>', block + '</head>', 1)
        added += 1
        print('  + VideoObject: %s' % v['name'])

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print('  saved (%d added)' % added)

print('\nDone.')
