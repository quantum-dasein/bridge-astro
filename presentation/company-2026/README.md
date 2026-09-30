# BRIDGE Consult — презентация и журнал (2026)

- `BRIDGE-Consult-presentation.pptx` — 10 слайдов 16:9, анимации появления всех элементов и плавные переходы
  (анимации стартуют сами при показе слайда). Шрифты только системные — Georgia и Arial —
  они есть в любой Windows, macOS и Office, поэтому слайды везде выглядят одинаково.
- `BRIDGE-Consult-presentation.pdf` — те же слайды в PDF.
- `BRIDGE-Consult-magazine.pdf` — журнальная версия, 16 полос A4.

Сборка слайдов: `node prep.cjs && node build.cjs BRIDGE-Consult-presentation.pptx`
(нужны `pptxgenjs`, `jszip`, `sharp`, `qrcode`).

Сборка журнала: `CHROMIUM=/path/to/chrome node magazine/build-magazine.cjs`
(нужны `sharp`, `hyphen`, `playwright-core`, `qrcode`).
