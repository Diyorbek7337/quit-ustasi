# Quti Ustasi — reja
**Spec:** docs/design.md · **Bajarish:** shu sessiyada, ketma-ket.

Fayllar: `src/shell.html` (HTML+CSS), `src/engine.js` (dvigatel), `src/levels.js` (kontent), `build.py` → `dist/quti-ustasi.html`, `test/test.py` (Chrome headless).

1. Dvigatel: preview (640px iframe, masshtab), Ko'r bosqichi (group / pick / choice + zona), Yoz bosqichi (muharrir, jonli preview), `check()` = HTML lint → tuzilma → rect solishtiruv → CSS lint/diagnoz → stil tekshiruvi; podskazka; yulduz; progress.
2. Kontent: 31 daraja, 6 bob.
3. Test: har daraja uchun boshlang'ich kod o'tmasligi, yechim o'tishi, Ko'r ma'lumotlari to'g'riligi; tipik xatolar uchun diagnoz matni; skrinshotlar.

## Review focus
- Bola `display:flex`ni bolaga yozadi → "ota" haqida xabar.
- Bola margin bilan to'g'ri natija oladi → o'tadi (+maslahat).
- `</div>` unutilgan → teg balansi xabari.
- Imlo xatosi (`dispaly`) → lint xabari.
- localStorage yo'q muhit → xatosiz ishlaydi.
