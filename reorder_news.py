#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Mobile news order: old news card before the Telegram promo (TG last).
Uses flex `order` utilities so it applies on every breakpoint. Idempotent."""
import sys
sys.stdout.reconfigure(encoding='utf-8')

FILES = ['public/index.html', 'public/EN/index.html', 'public/UZ/index.html']

TG_OLD = 'transition-all duration-500 p-7 flex flex-col justify-between hover:shadow-[0_0_40px_-10px_rgba(138,123,102,0.5)]"'
TG_NEW = 'transition-all duration-500 p-7 flex flex-col justify-between hover:shadow-[0_0_40px_-10px_rgba(138,123,102,0.5)] order-2"'

FIDIC_OLD = 'transition-all duration-500 flex flex-col" data-aos="fade-up" data-aos-delay="300"'
FIDIC_NEW = 'transition-all duration-500 flex flex-col order-1" data-aos="fade-up" data-aos-delay="300"'

for path in FILES:
    print('=== %s ===' % path)
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()
    if ' order-2"' in c and 'flex flex-col order-1"' in c:
        print('  already reordered — skip'); continue
    n1 = c.count(TG_OLD); n2 = c.count(FIDIC_OLD)
    c = c.replace(TG_OLD, TG_NEW, 1)
    c = c.replace(FIDIC_OLD, FIDIC_NEW, 1)
    print('  TG->order-2: %d | old-news->order-1: %d' % (n1, n2))
    assert n1 == 1 and n2 == 1, 'anchor mismatch in ' + path
    with open(path, 'w', encoding='utf-8') as f:
        f.write(c)
    print('  saved')
print('\nDone.')
