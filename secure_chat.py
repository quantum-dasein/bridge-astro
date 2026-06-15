#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Remove the hardcoded Anthropic key from the chat widget and route the
front-end through the same-origin /api/chat proxy. Idempotent."""
import re, sys
sys.stdout.reconfigure(encoding='utf-8')

FILES = ['public/index.html', 'public/EN/index.html', 'public/UZ/index.html']

NEW_FETCH = """fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ system: BC_SYSTEM, messages: msgs.slice(-10) })
        })"""

for path in FILES:
    print('=== %s ===' % path)
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()

    if 'api.anthropic.com' not in c and 'BC_API_KEY' not in c:
        print('  already secured — skip')
        continue

    # 1. drop the hardcoded key declaration
    c, n1 = re.subn(r'[ \t]*var BC_API_KEY = .*?;\n', '', c)
    # 2. drop the !BC_API_KEY guard line (message text is localized)
    c, n2 = re.subn(r'[ \t]*if \(!BC_API_KEY\) \{[^\n]*\}\n', '', c)
    # 3. repoint the fetch from Anthropic direct -> our proxy
    c, n3 = re.subn(
        r"fetch\('https://api\.anthropic\.com/v1/messages', \{.*?\n        \}\)",
        NEW_FETCH, c, flags=re.DOTALL)

    print('  key removed: %d | guard removed: %d | fetch repointed: %d' % (n1, n2, n3))
    assert n3 == 1, 'fetch block not replaced in ' + path

    with open(path, 'w', encoding='utf-8') as f:
        f.write(c)
    print('  saved')

print('\nDone.')
