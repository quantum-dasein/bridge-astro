#!/usr/bin/env python3
"""
Fix issues across all 3 pages:
1. RU body bg-bridge-light → bg-white (stats gray stripe)
2. Portfolio: revert to original white-card design (all 3)
3. EN/UZ FIDIC video poster path (add ../)
4. FAQ background: match news section (#1a1816)
"""
import subprocess, re, sys
sys.stdout.reconfigure(encoding='utf-8')

def git_get_section(commit, filepath, start_id, end_id):
    content = subprocess.check_output(
        ['git', 'show', f'{commit}:{filepath}'],
        encoding='utf-8'
    )
    start = content.index(f'<section id="{start_id}"')
    end = content.index(f'<section id="{end_id}"', start)
    return content[start:end]

FILES = {
    'ru': 'public/index.html',
    'en': 'public/EN/index.html',
    'uz': 'public/UZ/index.html',
}

ORIG_COMMIT = '4a47c38'

for lang, path in FILES.items():
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    original_len = len(content)

    # 1. Fix RU body background (bg-bridge-light → bg-white)
    if lang == 'ru':
        old = '<body class="font-sans text-bridge-dark antialiased bg-bridge-light relative selection:bg-bridge-taupe/20 overflow-x-hidden">'
        new = '<body class="font-sans text-bridge-dark antialiased bg-white relative selection:bg-bridge-taupe/20 overflow-x-hidden">'
        if old in content:
            content = content.replace(old, new, 1)
            print(f'[{lang}] Fixed body bg-bridge-light -> bg-white')
        else:
            print(f'[{lang}] WARN: body bg-bridge-light not found')

    # 2. Replace portfolio section with original
    orig_portfolio = git_get_section(ORIG_COMMIT, path, 'portfolio', 'team')
    start_marker = '<section id="portfolio"'
    end_marker = '<section id="team"'
    s = content.index(start_marker)
    e = content.index(end_marker, s)
    content = content[:s] + orig_portfolio + content[e:]
    print(f'[{lang}] Replaced portfolio section ({e-s} chars old → {len(orig_portfolio)} chars new)')

    # 3. Fix FIDIC video poster path for EN/UZ
    if lang in ('en', 'uz'):
        old_poster = 'poster="poster-training.jpg"'
        new_poster = 'poster="../poster-training.jpg"'
        if old_poster in content:
            content = content.replace(old_poster, new_poster, 1)
            print(f'[{lang}] Fixed FIDIC video poster path')
        else:
            print(f'[{lang}] WARN: poster-training.jpg not found (may already be fixed)')

    # 4. Fix FAQ background: bg-bridge-dark → #1a1816, update gradient overlay
    old_faq = '<section id="faq" class="py-32 bg-bridge-dark relative overflow-hidden font-sans border-t border-white/10">'
    new_faq = '<section id="faq" class="py-32 relative overflow-hidden font-sans border-t border-white/10" style="background:#1a1816;">'
    if old_faq in content:
        content = content.replace(old_faq, new_faq, 1)
        print(f'[{lang}] Fixed FAQ background to #1a1816')
    else:
        print(f'[{lang}] WARN: FAQ section marker not found')

    # Also update the inner gradient overlay from bridge-dark to #1a1816
    old_overlay = 'class="absolute inset-0 bg-gradient-to-b from-bridge-dark via-bridge-dark/70 to-bridge-dark z-[1] pointer-events-none"'
    new_overlay = 'class="absolute inset-0 z-[1] pointer-events-none" style="background:linear-gradient(to bottom,#1a1816,rgba(26,24,22,0.7),#1a1816);"'
    if old_overlay in content:
        content = content.replace(old_overlay, new_overlay, 1)
        print(f'[{lang}] Fixed FAQ gradient overlay')

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'[{lang}] Saved {path} ({original_len} → {len(content)} chars)\n')

print('All done.')
