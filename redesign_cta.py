#!/usr/bin/env python3
"""Replace the standalone white PDF-download section on projects.html
(RU/EN/UZ) with a cosmic dark CTA that flows from the 3D universe."""
import sys
sys.stdout.reconfigure(encoding='utf-8')

CTA_MARK = '<section class="py-20 bg-white border-t border-bridge-taupe/20 font-sans">'

DOC_ICON = ('<svg class="uni-cta-doc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">'
            '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>'
            '<line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/></svg>')
DL_ICON  = ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
            '<path d="M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>')
PDF_ICON = ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>')
BOLT_ICON= ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M13 2L3 14h7l-1 8 10-12h-7z"/></svg>')
GIFT_ICON= ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M20 12v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8"/><path d="M2 7h20v5H2z"/><path d="M12 22V7"/><path d="M12 7S9 2 6.5 4 8 7 12 7zm0 0s3-5 5.5-3S16 7 12 7z"/></svg>')

LANGS = {
    'public/projects.html': dict(
        prefix='', eyebrow='ДОКУМЕНТ',
        h2='Полный референс-лист и профиль компании',
        p='Скачайте подробную презентацию с описанием нашей методологии, полного списка реализованных проектов и юридических кейсов.',
        btn='Скачать PDF презентацию (12 MB)', free='Бесплатно',
    ),
    'public/EN/projects.html': dict(
        prefix='../', eyebrow='DOCUMENT',
        h2='Complete Reference List &amp; Company Profile',
        p='Download our detailed presentation describing our methodology, a comprehensive list of completed projects, and legal case studies.',
        btn='Download PDF Presentation (12 MB)', free='Free',
    ),
    'public/UZ/projects.html': dict(
        prefix='../', eyebrow='HUJJAT',
        h2="To'liq referens-varaq va kompaniya profili",
        p="Bizning metodologiyamiz, amalga oshirilgan loyihalarning to'liq ro'yxati va yuridik keyslar tavsiflangan batafsil taqdimotni yuklab oling.",
        btn='PDF taqdimotni yuklab olish (12 MB)', free='Bepul',
    ),
}

PDF_FILE = 'Bridge_Consult_–_Infrastructure_Contracts_&_Dispute_Resolution_Advisory.pdf'


def build(cfg):
    href = cfg['prefix'] + PDF_FILE
    sparks = ''.join('<span class="uni-cta-spark"></span>' for _ in range(5))
    return (
        '<!-- ============ PDF / COMPANY PROFILE CTA ============ -->\n'
        '<section class="uni-cta font-sans">\n'
        '    <div class="uni-cta-glow"></div>\n'
        '    <div class="uni-cta-grid"></div>\n'
        '    ' + sparks + '\n'
        '    <div class="uni-cta-inner" data-aos="fade-up">\n'
        '        <div class="uni-cta-doc">\n'
        '            <div class="uni-cta-doc-ring"></div>\n'
        '            <div class="uni-cta-doc-core">' + DOC_ICON + '</div>\n'
        '            <span class="uni-cta-ext">PDF</span>\n'
        '        </div>\n'
        '        <div class="uni-cta-eyebrow"><span></span>' + cfg['eyebrow'] + '</div>\n'
        '        <h2 class="uni-cta-h2">' + cfg['h2'] + '</h2>\n'
        '        <p class="uni-cta-p">' + cfg['p'] + '</p>\n'
        '        <a href="' + href + '" target="_blank" rel="noopener noreferrer" class="uni-cta-btn">'
        + DL_ICON + '<span>' + cfg['btn'] + '</span></a>\n'
        '        <div class="uni-cta-meta">\n'
        '            <span class="uni-cta-chip">' + PDF_ICON + 'PDF</span>\n'
        '            <span class="uni-cta-chip">' + BOLT_ICON + '12 MB</span>\n'
        '            <span class="uni-cta-chip">' + GIFT_ICON + cfg['free'] + '</span>\n'
        '        </div>\n'
        '    </div>\n'
        '</section>'
    )


for path, cfg in LANGS.items():
    print('\n=== %s ===' % path)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'uni-cta-inner' in content:
        print('  SKIP: already converted')
        continue

    s = content.find(CTA_MARK)
    if s < 0:
        print('  ERROR: CTA marker not found')
        continue
    e = content.find('</section>', s)
    if e < 0:
        print('  ERROR: closing </section> not found')
        continue
    e += len('</section>')

    content = content[:s] + build(cfg) + content[e:]
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print('  OK: CTA replaced')

print('\nDone.')
