#!/usr/bin/env python3
"""Wrap the universe section + PDF CTA into one shared .uni-scene container
(single galaxy background) and add the light-beam element. RU/EN/UZ."""
import sys
sys.stdout.reconfigure(encoding='utf-8')

FILES = ['public/projects.html', 'public/EN/projects.html', 'public/UZ/projects.html']

UNI_OPEN  = '<section id="universe">'
BG_DIV    = '    <div class="uni-bg"></div>\n'
CTA_OPEN  = '<section class="uni-cta font-sans">'

for path in FILES:
    print('=== %s ===' % path)
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()

    if 'uni-scene' in c:
        print('  SKIP: already merged')
        continue

    # 1. open the wrapper (with shared bg) before the universe section,
    #    and drop the bg div that lived inside #universe
    assert UNI_OPEN in c and BG_DIV in c and CTA_OPEN in c, 'markers missing'
    c = c.replace(UNI_OPEN + '\n' + BG_DIV,
                  '<div class="uni-scene">\n    <div class="uni-bg"></div>\n\n' + UNI_OPEN + '\n', 1)

    # 2. light beam at the top of the CTA
    c = c.replace(CTA_OPEN, CTA_OPEN + '\n    <div class="uni-beam"></div>', 1)

    # 3. close the wrapper right after the CTA section
    i = c.find(CTA_OPEN)
    j = c.find('</section>', i)
    assert j > 0, 'cta close missing'
    j += len('</section>')
    c = c[:j] + '\n</div><!-- /uni-scene -->' + c[j:]

    with open(path, 'w', encoding='utf-8') as f:
        f.write(c)
    print('  OK: wrapped + beam added')

print('Done.')
