# BRIDGE Consult — презентация компании (2026)

- `BRIDGE-Consult-presentation.pptx` — 10 слайдов, 16:9, анимации появления всех элементов и плавные переходы
  (анимации запускаются автоматически при показе слайда — достаточно листать слайды).
- `BRIDGE-Consult-presentation.pdf` — та же презентация в PDF, шрифты встроены.
- `fonts-Playfair-Manrope-Inter.zip` — фирменные шрифты (Playfair Display, Manrope, Inter; лицензия SIL OFL).
  Установите их перед показом PPTX на другом компьютере, иначе PowerPoint подставит системные шрифты.

Сборка: `node prep.cjs && node build.cjs out.pptx` (нужны `pptxgenjs`, `jszip`, `sharp`, `qrcode`).
