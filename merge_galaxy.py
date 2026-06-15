#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Put the PDF CTA + connector + reference list BACK INSIDE .uni-scene so they
share the planet's single 3D galaxy background (canvas + .uni-bg) — like the
live site, one continuous background, not a separate 2D section. Removes the
.uni-galaxy wrapper introduced earlier. Idempotent."""
import sys
sys.stdout.reconfigure(encoding='utf-8')

FILES = ['public/projects.html', 'public/EN/projects.html', 'public/UZ/projects.html']

OPEN = '</div><!-- /uni-scene -->\n\n<div class="uni-galaxy">\n'
CLOSE = '</div><!-- /uni-galaxy -->'
SCENE_END = '</div><!-- /uni-scene -->'

for path in FILES:
    print('=== %s ===' % path)
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()
    if 'class="uni-galaxy"' not in c:
        print('  no wrapper — skip'); continue
    assert OPEN in c and CLOSE in c, 'wrapper anchors not found in ' + path
    # remove the scene-close-then-galaxy-open (so cta stays inside the scene)
    c = c.replace(OPEN, '', 1)
    # the galaxy-close now becomes the scene-close
    c = c.replace(CLOSE, SCENE_END, 1)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(c)
    print('  document + list moved back inside .uni-scene')

print('\nDone.')
