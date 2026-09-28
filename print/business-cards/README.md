# Визитка — Larisa K. Belousova (BRIDGE Consult)

**Для типографии:** формат 85 × 55 мм, вылеты 2 мм с каждой стороны (файл 89 × 59 мм), цвет CMYK, 4+4.

| Файл | Что это |
|---|---|
| `larisa-belousova-card-2-sided.pdf` | обе стороны в одном PDF (стр. 1 — лицо, стр. 2 — оборот), вектор, TrimBox задан |
| `*-front.*` / `*-back.*` | лицо / оборот по отдельности |
| `.ai` | вектор, открывается в Illustrator (PDF-совместимый) |
| `.tif` | CMYK, 600 dpi, LZW |
| `.psd` | CMYK, 600 dpi |
| `preview.png` | превью в обрез, только для просмотра (RGB) |

- Фон лица: C40 M45 Y55 K80. Мост (векторные линии 0,3–0,8 pt): C12 M20 Y36 K0 и C28 M34 Y50 K25. Фирменный тауп: C30 M35 Y50 K20. QR-коды: только K100.
- QR «PROFILE · CV» → https://www.bridgeconsult.uz/larisa/ (профиль, CV, контакты)
- QR «TELEGRAM» → https://t.me/fidicuzb
- Бумага: матовая 300–350 г/м²; для тёмного лица лучше матовая ламинация (иначе видны царапины).

Пересборка: `python3 scripts/business-card/make_cards.py` (см. заголовок скрипта).
Другая почта на обороте: `CARD_EMAIL=mail@lkbelousova.ru python3 scripts/business-card/make_cards.py`.
