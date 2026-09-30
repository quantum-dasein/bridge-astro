# BRIDGE Consult — презентация и журнал (2026)

- `BRIDGE-Consult-presentation.pptx` — 10 слайдов 16:9, анимации появления всех элементов и плавные переходы
  (анимации стартуют сами при показе слайда). Фирменные шрифты **вшиты в файл** под именами
  «Bridge Playfair» и «Bridge Manrope…», поэтому установленный на компьютере другой Manrope их не перебивает.
- `BRIDGE-Consult-presentation.pdf` — те же слайды в PDF.
- `BRIDGE-Consult-magazine.pdf` — журнальная версия, 16 полос A4.
- `fonts-Bridge.zip` — те же шрифты для установки (нужно только для редактирования на машине без PowerPoint-встраивания).

Сборка слайдов: `node prep.cjs && node build.cjs BRIDGE-Consult-presentation.pptx`
(нужны `pptxgenjs`, `jszip`, `sharp`, `qrcode`; шрифты — `fonts/`, переименование — `fonts/rename_fonts.py`).

Сборка журнала: `CHROMIUM=/path/to/chrome node magazine/build-magazine.cjs`
(нужны `sharp`, `hyphen`, `playwright-core`, `qrcode`).
