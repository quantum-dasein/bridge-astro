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


def front(path):
    c = new_canvas(path)
    c.setFillColor(DARK)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)

    cx = TRIM_W / 2
    usable = TRIM_W - 2 * SAFE

    logo_h = draw_logo(c, cx, 8.6 * mm, 40 * mm, WHITE)
    rule_y = 8.6 * mm + logo_h + 4.2 * mm
    c.setStrokeColor(TAUPE)
    c.setLineWidth(0.6)
    c.line(BLEED + cx - 5 * mm, BLEED + TRIM_H - rule_y, BLEED + cx + 5 * mm, BLEED + TRIM_H - rule_y)

    draw_text(c, cx, rule_y + 5.2 * mm, 'CONSULTING FOR CONSTRUCTION PROJECTS',
              'Inter-SemiBold', 6.4, WHITE, tracking=1.05, align='center', max_w=usable)
    draw_text(c, cx, rule_y + 9.4 * mm, 'FIDIC  ·  EPC / EPC+F  ·  Procurement  ·  Claims',
              'Inter-Regular', 5.6, CHAMPAGNE, tracking=0.2, align='center', max_w=usable)
    draw_text(c, cx, rule_y + 12.4 * mm, 'Dispute Avoidance  ·  International Arbitration',
              'Inter-Regular', 5.6, CHAMPAGNE, tracking=0.2, align='center', max_w=usable)
    draw_text(c, cx, TRIM_H - 5.6 * mm, WEB.upper(),
              'Inter-Medium', 5.2, TAUPE, tracking=1.3, align='center', max_w=usable)
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
