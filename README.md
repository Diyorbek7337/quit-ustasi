# Quti Ustasi

Bolalarga sahifani qutilarga bo'lishni (div, padding, margin, gap, container, Flexbox) o'rgatadigan o'yin. 41 daraja, 8 bob, imtihon va sertifikat.

- `src/` — o'yin manbasi: `shell.html` (ko'rinish), `engine.js` (tekshiruv, podskazka, hisobot), `levels.js` (darajalar va `config`).
- `public/index.html` — tayyor o'yin. `python3 build.py` bilan yig'iladi va commit qilinadi.
- `netlify/functions/natija.mjs` — natijani ustozning Telegram'iga yuboradi.
- `test/` — avtotestlar.

## Natijalar Telegram'ga kelishi uchun

1. @BotFather'da bot och, tokenni ol. Botga o'zing /start yoz.
2. Netlify: **Project configuration → Environment variables** ga `TG_TOKEN` = bot tokeni qo'sh, keyin saytni qayta deploy qil.
3. Brauzerda `https://quti-ustasi.netlify.app/api/natija?sozlash` ni och: chat raqaming chiqadi.
4. Uni `TG_CHAT_ID` qilib qo'sh va yana deploy qil. Shundan keyin `?sozlash` sahifasi hech narsa ko'rsatmaydi.

O'quvchi har bob tugatganda va imtihonni topshirganda xabar avtomatik keladi. Internet bo'lmasa, xabar navbatda turadi va keyingi safar yuboriladi. "Natijam" oynasidagi "Ustozga yuborish" to'liq hisobotni qo'lda yuboradi.

## O'zgartirish

1. `src/` ichida o'zgartir.
2. `python3 build.py`
3. `python3 test/test.py && python3 test/send_test.py && node test/natija.test.mjs`
4. Commit va push — Netlify o'zi yangilaydi.

Markaz nomi va boshqa sozlamalar: `src/levels.js` oxiridagi `config`.
