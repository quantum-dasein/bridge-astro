#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Fix detail-card nesting: expand_projects.py inserted cards idx 4-7 INSIDE
card idx 3's <article> (before its close), so clicking 4-7 showed an empty panel
(parent card 3 is hidden -> children collapse to 0). Close card 3 before card 4,
and drop the now-duplicate </article></div> after card 7. Idempotent."""
import sys
sys.stdout.reconfigure(encoding='utf-8')

FILES = ['public/projects.html', 'public/EN/projects.html', 'public/UZ/projects.html']

CARD4_OPEN = '            <div class="uni-detail-card" data-idx="4" hidden>'
CLOSE_CARD3_BEFORE_4 = '        </article></div>\n            <div class="uni-detail-card" data-idx="4" hidden>'

DOUBLE_CLOSE = '        </article></div>\n        </article></div>\n        </div>\n    </div>\n</div>'
SINGLE_CLOSE = '        </article></div>\n        </div>\n    </div>\n</div>'

for path in FILES:
    print('=== %s ===' % path)
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()

    if CLOSE_CARD3_BEFORE_4 in c:
        print('  already fixed — skip'); continue

    assert CARD4_OPEN in c, 'card4 open not found in ' + path
    assert DOUBLE_CLOSE in c, 'double-close not found in ' + path

    # A: close card 3 right before card 4
    c = c.replace(CARD4_OPEN, CLOSE_CARD3_BEFORE_4, 1)
    # B: remove the leftover (spurious) card-3 close that now sits after card 7
    c = c.replace(DOUBLE_CLOSE, SINGLE_CLOSE, 1)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(c)
    print('  card 3 closed before card 4; duplicate close removed')

print('\nDone.')
