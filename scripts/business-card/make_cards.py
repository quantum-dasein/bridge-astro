"""Print-ready business cards for Larisa K. Belousova (BRIDGE Consult).

Trim 85 x 55 mm, 2 mm bleed on every side (page 89 x 59 mm), all colours in
DeviceCMYK. Builds a vector PDF per side, then rasterises it with Ghostscript
to CMYK TIFF / CMYK PSD at 600 dpi and copies the PDF as a PDF-compatible .ai.

    pip install reportlab svglib segno zxing-cpp pillow
    apt-get install ghostscript
    python3 scripts/business-card/make_cards.py

Fonts: Inter (https://github.com/rsms/inter, OFL) — point INTER_DIR at the
folder with Inter-*.ttf.
"""

import os
import shutil
import subprocess
from pathlib import Path

import segno
from reportlab.graphics import renderPDF
from reportlab.lib.colors import CMYKColor
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from svglib.svglib import svg2rlg

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'print' / 'business-cards'
LOGO = ROOT / 'public' / 'bridge 2.svg'
INTER_DIR = Path(os.environ.get('INTER_DIR', ROOT / 'scripts' / 'business-card' / 'fonts'))

TRIM_W, TRIM_H = 85 * mm, 55 * mm
BLEED = 2 * mm
PAGE_W, PAGE_H = TRIM_W + 2 * BLEED, TRIM_H + 2 * BLEED
SAFE = 4.5 * mm  # keep text this far inside the trim line

# --- content -----------------------------------------------------------------
EMAIL = os.environ.get('CARD_EMAIL', 'info@bridgeconsult.uz')
PHONE = '+998 33 000 15 30'
WEB = 'www.bridgeconsult.uz'
QR_PROFILE = 'https://www.bridgeconsult.uz/larisa/'  # profile page: CV, contacts, LinkedIn
QR_TELEGRAM = 'https://t.me/fidicuzb'

# --- brand colours in CMYK (site: #292724 dark, #8A7B66 taupe, #E4D6BE champagne)
def cmyk(c, m, y, k):
    return CMYKColor(c / 100, m / 100, y / 100, k / 100)

DARK = cmyk(40, 45, 55, 80)        # warm rich black, #292724 — TAC 220 %
TAUPE = cmyk(30, 35, 50, 20)       # #8A7B66
CHAMPAGNE = cmyk(8, 12, 25, 0)     # #E4D6BE
INK = cmyk(0, 10, 20, 90)          # body text on the white side, mostly K
MUTED = cmyk(0, 8, 15, 65)         # secondary text on the white side
QR_INK = cmyk(0, 0, 0, 100)        # single plate — crisp modules, no misregistration
WHITE = cmyk(0, 0, 0, 0)
# bridge line drawing on the front: light brown, fading into the dark ground
BRIDGE_ARCH = cmyk(12, 20, 36, 0)  # #DCC8A8 — arch rib and deck
BRIDGE_LINE = cmyk(28, 34, 50, 25) # #9C8B71 — hangers, piers
BRIDGE_FAINT = cmyk(35, 40, 52, 55)  # water ripples, construction lines


def register_fonts():
    for name in ('Regular', 'Medium', 'SemiBold', 'Bold', 'Light'):
        pdfmetrics.registerFont(TTFont(f'Inter-{name}', str(INTER_DIR / f'Inter-{name}.ttf')))


def text_width(text, font, size, tracking=0.0):
    return pdfmetrics.stringWidth(text, font, size) + tracking * (len(text) - 1)


def draw_text(c, x, y, text, font, size, color, tracking=0.0, align='left', max_w=None):
    """y is the baseline, measured in mm from the top of the trim."""
    w = text_width(text, font, size, tracking)
    if max_w is not None:
        assert w <= max_w, f'{text!r} is {w / mm:.1f} mm wide, only {max_w / mm:.1f} mm fit'
    if align == 'center':
        x -= w / 2
    elif align == 'right':
        x -= w
    c.setFillColor(color)
    c.setFont(font, size)
    c.drawString(BLEED + x, BLEED + TRIM_H - y, text, charSpace=tracking)
    return w


def new_canvas(path):
    c = canvas.Canvas(str(path), pagesize=(PAGE_W, PAGE_H))
    c.setTitle('BRIDGE Consult — Larisa K. Belousova — business card')
    c.setAuthor('BRIDGE Consult LLC')
    c.setTrimBox((BLEED, BLEED, BLEED + TRIM_W, BLEED + TRIM_H))
    c.setBleedBox((0, 0, PAGE_W, PAGE_H))
    return c


def draw_logo(c, cx, top, width, color):
    drawing = svg2rlg(str(LOGO))
    scale = width / drawing.width

    def recolor(node):
        if hasattr(node, 'fillColor') and node.fillColor is not None:
            node.fillColor = color
        if hasattr(node, 'strokeColor'):
            node.strokeColor = None
        for child in getattr(node, 'contents', []):
            recolor(child)

    recolor(drawing)
    height = drawing.height * scale
    drawing.scale(scale, scale)
    drawing.width, drawing.height = width, height
    renderPDF.draw(drawing, c, BLEED + cx - width / 2, BLEED + TRIM_H - top - height)
    return height


def draw_qr(c, x, top, size, data):
    """Draws the QR (without its quiet zone) as one K-only path; returns module size."""
    qr = segno.make(data, error='m', micro=False)
    matrix = [row for row in qr.matrix]
    n = len(matrix)
    unit = size / n
    p = c.beginPath()
    for r, row in enumerate(matrix):
        col = 0
        while col < n:
            if row[col]:
                start = col
                while col < n and row[col]:
                    col += 1
                x0 = BLEED + x + start * unit
                y0 = BLEED + TRIM_H - top - (r + 1) * unit
                p.rect(x0, y0, (col - start) * unit, unit)
            else:
                col += 1
    c.setFillColor(QR_INK)
    c.drawPath(p, stroke=0, fill=1)
    return unit, qr.version


def P(x, y):
    """mm from the top-left corner of the trim -> PDF points."""
    return BLEED + x * mm, BLEED + TRIM_H - y * mm


def polyline(c, pts, color, width, dash=None):
    c.setStrokeColor(color)
    c.setLineWidth(width)
    c.setLineCap(1)
    c.setLineJoin(1)
    c.setDash(*dash) if dash else c.setDash()
    path = c.beginPath()
    path.moveTo(*P(*pts[0]))
    for pt in pts[1:]:
        path.lineTo(*P(*pt))
    c.drawPath(path, stroke=1, fill=0)
    c.setDash()


def draw_bridge(c, deck=46.0, rise=10.0, xa=6.0, xb=79.0, water=52.2, gap_text=None):
    """Tied network-arch bridge as an architectural line drawing (all in mm)."""
    xc, half = (xa + xb) / 2, (xb - xa) / 2
    depth = 1.15  # arch rib depth at the crown

    def upper(x):
        return deck - rise * (1 - ((x - xc) / half) ** 2)

    def lower(x):
        return min(upper(x) + depth, deck)

    samples = [xa + (xb - xa) * i / 240 for i in range(241)]

    # network hangers: every node sends two inclined hangers to the deck
    nodes = 18
    reach = (xb - xa) * 0.11
    for i in range(1, nodes):
        x = xa + (xb - xa) * i / nodes
        for dx in (-reach, reach):
            xd = x + dx
            if xa + 1.5 < xd < xb - 1.5 and lower(x) < deck - 0.3:
                polyline(c, [(x, lower(x)), (xd, deck)], BRIDGE_LINE, 0.32)

    # arch rib: two chords with a Warren lattice between them
    polyline(c, [(x, upper(x)) for x in samples], BRIDGE_ARCH, 0.75)
    polyline(c, [(x, lower(x)) for x in samples], BRIDGE_ARCH, 0.45)
    panels = 44
    zig = []
    for i in range(panels + 1):
        x = xa + (xb - xa) * i / panels
        if lower(x) - upper(x) > 0.5:
            zig.append((x, upper(x) if i % 2 else lower(x)))
    polyline(c, zig, BRIDGE_ARCH, 0.3)

    # deck girder bleeding off both edges, stiffeners at the hanger nodes
    polyline(c, [(-BLEED / mm, deck), (TRIM_W / mm + BLEED / mm, deck)], BRIDGE_ARCH, 0.8)
    polyline(c, [(-BLEED / mm, deck + 1.0), (TRIM_W / mm + BLEED / mm, deck + 1.0)], BRIDGE_ARCH, 0.4)
    for i in range(-3, 2 * nodes + 4):
        x = xa + (xb - xa) * i / (2 * nodes)
        if -2 < x < TRIM_W / mm + 2:
            polyline(c, [(x, deck), (x, deck + 1.0)], BRIDGE_LINE, 0.3)

    # tapered piers under the springings
    for x in (xa, xb):
        polyline(c, [(x - 0.9, deck + 1.0), (x - 1.3, water), (x + 1.3, water), (x + 0.9, deck + 1.0)],
                 BRIDGE_LINE, 0.45)

    # dash-dot centre line, as on a general-arrangement drawing
    polyline(c, [(xc, upper(xc) - 1.3), (xc, deck + 3.4)], BRIDGE_FAINT, 0.35, dash=([3, 1.2, 0.5, 1.2], 0))

    # water line, broken where the web address sits
    left_end, right_end = -BLEED / mm, TRIM_W / mm + BLEED / mm
    if gap_text:
        polyline(c, [(left_end, water), (xc - gap_text / 2, water)], BRIDGE_LINE, 0.45)
        polyline(c, [(xc + gap_text / 2, water), (right_end, water)], BRIDGE_LINE, 0.45)
    else:
        polyline(c, [(left_end, water), (right_end, water)], BRIDGE_LINE, 0.45)

    # ripples: short dashes getting sparser away from the bridge
    ripples = ((53.4, [(4, 14), (22, 30), (55, 63), (71, 81)]),
               (54.5, [(9, 15), (26, 31), (54, 59), (70, 76)]),
               (55.6, [(13, 16), (68, 72)]))
    for y, spans in ripples:
        for x0, x1 in spans:
            polyline(c, [(x0, y), (x1, y)], BRIDGE_FAINT, 0.35)


def front(path):
    c = new_canvas(path)
    c.setFillColor(DARK)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)

    cx = TRIM_W / 2
    usable = TRIM_W - 2 * SAFE

    logo_top = 5.6 * mm
    logo_h = draw_logo(c, cx, logo_top, 34 * mm, WHITE)
    rule_y = logo_top + logo_h + 3.4 * mm
    c.setStrokeColor(TAUPE)
    c.setLineWidth(0.6)
    c.line(BLEED + cx - 5 * mm, BLEED + TRIM_H - rule_y, BLEED + cx + 5 * mm, BLEED + TRIM_H - rule_y)

    draw_text(c, cx, rule_y + 4.4 * mm, 'CONSULTING FOR CONSTRUCTION PROJECTS',
              'Inter-SemiBold', 6.2, WHITE, tracking=1.05, align='center', max_w=usable)
    draw_text(c, cx, rule_y + 8.0 * mm, 'FIDIC  ·  EPC / EPC+F  ·  Procurement  ·  Claims',
              'Inter-Regular', 5.4, CHAMPAGNE, tracking=0.2, align='center', max_w=usable)
    last = rule_y + 10.8 * mm
    draw_text(c, cx, last, 'Dispute Avoidance  ·  International Arbitration',
              'Inter-Regular', 5.4, CHAMPAGNE, tracking=0.2, align='center', max_w=usable)

    web_size, web_track = 4.8, 1.3
    web_w = text_width(WEB.upper(), 'Inter-Medium', web_size, web_track)
    water = 52.0
    crown = last / mm + 3.4
    draw_bridge(c, deck=46.0, rise=46.0 - crown, water=water, gap_text=web_w / mm + 4)
    draw_text(c, cx, water * mm + 0.62 * mm, WEB.upper(),
              'Inter-Medium', web_size, BRIDGE_ARCH, tracking=web_track, align='center', max_w=usable)
    c.showPage()
    c.save()


def back(path):
    c = new_canvas(path)
    c.setFillColor(WHITE)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)

    # thin brand band on the left edge, bleeding off the card
    c.setFillColor(DARK)
    c.rect(0, 0, BLEED + 3 * mm, PAGE_H, stroke=0, fill=1)

    # QR column on the right
    qr_size = 15 * mm
    qr_x = TRIM_W - SAFE - qr_size
    label_gap = 3.0 * mm
    block = 2 * qr_size + 2 * label_gap + 4.2 * mm
    top1 = (TRIM_H - block) / 2 + 0.4 * mm
    top2 = top1 + qr_size + label_gap + 4.2 * mm
    for top, data, label in ((top1, QR_PROFILE, 'PROFILE  ·  CV'), (top2, QR_TELEGRAM, 'TELEGRAM')):
        unit, version = draw_qr(c, qr_x, top, qr_size, data)
        assert unit >= 0.4 * mm, f'QR module {unit / mm:.2f} mm is too small to print'
        print(f'  QR {data}: version {version}, module {unit / mm:.2f} mm')
        draw_text(c, qr_x + qr_size / 2, top + qr_size + label_gap - 0.6 * mm, label,
                  'Inter-SemiBold', 4.6, MUTED, tracking=0.9, align='center')

    x = 8 * mm
    col_w = qr_x - 3.5 * mm - x

    c.setStrokeColor(TAUPE)
    c.setLineWidth(0.6)
    c.line(BLEED + x, BLEED + TRIM_H - 8.3 * mm, BLEED + x + 5 * mm, BLEED + TRIM_H - 8.3 * mm)
    draw_text(c, x + 6.8 * mm, 9.0 * mm, 'FOUNDER & DIRECTOR', 'Inter-SemiBold', 5.2, TAUPE,
              tracking=1.3, max_w=col_w - 6.8 * mm)
    draw_text(c, x, 16.4 * mm, 'Larisa K. Belousova', 'Inter-Bold', 12.5, INK, tracking=-0.1, max_w=col_w)
    draw_text(c, x, 21.0 * mm, 'BRIDGE Consult LLC', 'Inter-SemiBold', 6.8, TAUPE, tracking=0.3, max_w=col_w)

    draw_text(c, x, 27.2 * mm, 'FCCE  ·  FCCP  ·  MCIArb', 'Inter-SemiBold', 5.6, INK, tracking=0.2, max_w=col_w)
    draw_text(c, x, 30.3 * mm, 'ADB Accredited Specialist', 'Inter-Regular', 5.6, MUTED, max_w=col_w)
    draw_text(c, x, 33.4 * mm, 'Member, FIDIC Credentialing & Integrity Committees',
              'Inter-Regular', 5.2, MUTED, max_w=col_w)

    rows = (('T', PHONE), ('E', EMAIL), ('W', WEB))
    for i, (key, value) in enumerate(rows):
        y = 41.0 * mm + i * 3.7 * mm
        draw_text(c, x, y, key, 'Inter-SemiBold', 5.6, TAUPE)
        draw_text(c, x + 3.4 * mm, y, value, 'Inter-Medium', 6.6, INK, max_w=col_w - 3.4 * mm)

    c.showPage()
    c.save()


def rasterize(pdf, stem):
    common = ['gs', '-q', '-dBATCH', '-dNOPAUSE', '-dSAFER', '-r600',
              '-dTextAlphaBits=4', '-dGraphicsAlphaBits=4']
    subprocess.run(common + ['-sDEVICE=tiff32nc', '-sCompression=lzw',
                             f'-sOutputFile={stem}.tif', str(pdf)], check=True)
    subprocess.run(common + ['-sDEVICE=psdcmyk', f'-sOutputFile={stem}.psd', str(pdf)], check=True)
    shutil.copyfile(pdf, f'{stem}.ai')  # Illustrator opens PDF-compatible .ai as editable vectors


def main():
    register_fonts()
    OUT.mkdir(parents=True, exist_ok=True)
    for name, build in (('front', front), ('back', back)):
        stem = OUT / f'larisa-belousova-card-{name}'
        pdf = stem.with_suffix('.pdf')
        print(name)
        build(pdf)
        rasterize(pdf, stem)
    # both sides in one PDF (page 1 = front, page 2 = back) for the print shop
    subprocess.run(['gs', '-q', '-dBATCH', '-dNOPAUSE', '-dSAFER', '-sDEVICE=pdfwrite',
                    '-dColorConversionStrategy=/LeaveColorUnchanged', '-dPreserveTrimBox=true',
                    f'-sOutputFile={OUT / "larisa-belousova-card-2-sided.pdf"}',
                    str(OUT / 'larisa-belousova-card-front.pdf'),
                    str(OUT / 'larisa-belousova-card-back.pdf')], check=True)


if __name__ == '__main__':
    main()
