# Natijani Telegram'ga avtomatik yuborish — qisqa dizayn

**Maqsad:** ustoz har bir bolaning qayerda qiynalayotganini bola o'zi yubormasa ham ko'rsin.

## Yondashuvlar
1. **Netlify funksiyasi orqali (tanlangan).** O'yin `/api/natija` ga yuboradi, funksiya bot tokeni bilan Telegram'ga jo'natadi. Token maxfiy qoladi.
2. Token HTML ichida — sahifani ochgan har kim tokenni ko'radi va botdan foydalana oladi. Rad etildi.
3. Google Apps Script — yana bir tizim qo'shiladi, Netlify allaqachon bor. Rad etildi.

## Qarorlar
- Ustoz tanlagan: har bob tugaganda va imtihon topshirilganda xabar; GitHub orqali deploy.
- Mening qarorlarim: o'yinni birinchi ochishda ism (majburiy) va guruh (ixtiyoriy) so'raladi; har bob uchun xabar faqat bir marta; yuborilmagan xabar navbatda saqlanib, keyingi ochilishda yuboriladi; "Natijam" oynasida qo'lda "Ustozga yuborish"; begona saytdan kelgan so'rov rad etiladi; chat raqami `?sozlash` sahifasi orqali topiladi va sozlangach u sahifa yopiladi.
- Yo'q: server tomonda saqlash, o'qituvchi paneli, kunlik umumiy hisobot.
