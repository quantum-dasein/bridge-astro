#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Make the document block + reference list read as ONE section:
  1. de-duplicate copy (document = downloadable profile, points to list below)
  2. insert a luminous connecting line (.uni-link) between them
Idempotent."""
import sys
sys.stdout.reconfigure(encoding='utf-8')

# per file: (old_h2, new_h2, old_p, new_p)
COPY = {
    'public/projects.html': (
        'Полный референс-лист и профиль компании', 'Профиль компании и презентация',
        'Скачайте подробную презентацию с описанием нашей методологии, полного списка реализованных проектов и юридических кейсов.',
        'Скачайте PDF с нашей методологией, юридическими кейсами и профилем компании. Полный список реализованных проектов — ниже.'),
    'public/EN/projects.html': (
        'Complete Reference List &amp; Company Profile', 'Company Profile &amp; Presentation',
        'Download our detailed presentation describing our methodology, a comprehensive list of completed projects, and legal case studies.',
        'Download the PDF with our methodology, legal case studies and company profile. The full list of delivered projects is below.'),
    'public/UZ/projects.html': (
        "To'liq referens-varaq va kompaniya profili", 'Kompaniya profili va taqdimot',
        "Bizning metodologiyamiz, amalga oshirilgan loyihalarning to'liq ro'yxati va yuridik keyslar tavsiflangan batafsil taqdimotni yuklab oling.",
        "Metodologiyamiz, yuridik keyslar va kompaniya profili bilan PDF-ni yuklab oling. Amalga oshirilgan loyihalarning to'liq ro'yxati — quyida."),
}

LINK_HTML = '<div class="uni-link" aria-hidden="true"></div>\n'
REF_ANCHOR = '<section id="reference-list"'

for path, (oh, nh, op, np) in COPY.items():
    print('=== %s ===' % path)
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()

    c = c.replace('uni-cta-h2">' + oh, 'uni-cta-h2">' + nh, 1)
    c = c.replace('uni-cta-p">' + op, 'uni-cta-p">' + np, 1)

    if 'class="uni-link"' not in c:
        c = c.replace(REF_ANCHOR, LINK_HTML + REF_ANCHOR, 1)
        print('  copy updated + connector inserted')
    else:
        print('  copy updated (connector already present)')

    with open(path, 'w', encoding='utf-8') as f:
        f.write(c)

print('\nDone.')
