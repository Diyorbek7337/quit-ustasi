/* Quti Ustasi — darajalar. Matnlarda [[kod]] va **qalin** belgilari ishlatiladi. */
(function () {
'use strict';
const tx = s => s == null ? s : String(s)
  .replace(/\[\[([\s\S]*?)\]\]/g, (m, a) => '<code>' + a.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</code>')
  .replace(/\*\*([\s\S]*?)\*\*/g, '<b>$1</b>');
const d = s => s == null ? s : s.replace(/^\n+/, '').replace(/\s+$/, '') + '\n';
const levels = [];
function L(o) {
  ['html', 'css', 'startHtml', 'startCss', 'base', 'addHtml', 'addCss', 'solHtml', 'solCss'].forEach(k => { if (o[k] != null) o[k] = d(o[k]); });
  o.vazifa = tx(o.vazifa); o.nega = tx(o.nega); o.hints = (o.hints || []).map(tx);
  (o.kor || []).forEach(s => {
    s.q = tx(s.q); s.nega = tx(s.nega);
    if (s.opts) s.opts = s.opts.map(tx);
    if (Array.isArray(s.xato)) s.xato = s.xato.map(tx); else if (s.xato) for (const k in s.xato) s.xato[k] = tx(s.xato[k]);
  });
  (o.styles || []).forEach(s => { s[2] = tx(s[2]); });
  o.editHtml = o.startHtml != null; o.editCss = o.startCss != null;
  levels.push(o);
}

const atoms = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"Segoe UI",system-ui,-apple-system,Roboto,Arial,sans-serif;font-size:14px;line-height:1.4;color:#111827;background:#f3f4f6}
a{color:inherit;text-decoration:none;cursor:default}
img{display:block}
h1{font-size:26px;line-height:1.15}
h2{font-size:20px;line-height:1.2}
h3{font-size:15px;line-height:1.25}
p{font-size:13px;color:#6b7280}
.logo{display:block;font-weight:800;font-size:17px;color:var(--brand,#ea580c)}
.link{display:block;font-weight:600;font-size:13px;color:#374151}
.btn{display:inline-block;background:var(--brand,#ea580c);color:#fff;font-weight:700;font-size:13px;padding:8px 16px;border-radius:8px}
.rasm{width:100%;height:96px;object-fit:cover;border-radius:8px;background:#d1d5db;color:#6b7280;font-size:11px}
.narx{font-weight:800;font-size:15px}`;

/* Rasmlar: kodda qisqa "img/nom.jpg" yoziladi, dvigatel uni shu manzilga almashtiradi (Unsplash, bepul litsenziya).
   O'z rasmlaringni ishlatmoqchi bo'lsang: fayl yoniga img/ papka qo'yib, shu ro'yxatni bo'sh qoldir. */
const U = id => 'https://images.unsplash.com/photo-' + id + '?auto=format&fit=crop&w=640&q=70';
const imgs = {
  'tog.jpg': U('1551632811-561732d1e306'),
  'kol.jpg': U('1568454537842-d933259bb258'),
  'qoya.jpg': U('1534067783941-51c9c23ecefd'),
  'soqmoq.jpg': U('1501555088652-021faa106b9b'),
  'krossovka.jpg': U('1542291026-7eec264c27ff'),
  'dilnoza.jpg': U('1494790108377-be9c29b29330'),
  'somsa.jpg': U('1601050690597-df0568f70950'),
  'goshtli.jpg': U('1601050690117-94f5f6fa8bd7'),
  'qovoqli.jpg': U('1589301773859-bb024d3ad558'),
  'kartoshkali.jpg': U('1767469576715-a4eb8bcfa204')
};

const PMG = ['[[padding]]', '[[margin]]', '[[gap]]'];

/* ================= 1-BOB: Quti ichida quti ================= */
L({ id: '1-1', bob: 1, nom: `Birinchi quti`,
base: `
body{padding:24px}
.card{width:220px;padding:16px;background:#fff;border-radius:14px;border:1px solid #e5e7eb}
.card h3{margin:12px 0 4px}`,
html: `
<div class="card">
  <img class="rasm" src="img/tog.jpg" alt="Tog'">
  <h3>Tog' sayohati</h3>
  <p>Ikki kunlik sayohat</p>
</div>`,
startHtml: `
<img class="rasm" src="img/tog.jpg" alt="Tog'">
<h3>Tog' sayohati</h3>
<p>Ikki kunlik sayohat</p>`,
boxes: ['.card'],
kor: [
  { t: 'group', boxes: ['.card'], q: `Rasm, sarlavha va matn bitta oq kartochkaning ichida turibdi. Shu kartochkaga kiradigan hamma elementni bosib tanla, so'ng «Qutiga o'ra»ni bos.`, nega: `Birga turgan elementlar — bitta quti. Kodda bu quti [[<div>]] bo'ladi.` }
],
vazifa: `Uchta element alohida turibdi. Ularni bitta [[<div class="card">]] qutisiga o'ra: rasmdan oldin och, matndan keyin [[</div>]] bilan yop.`,
hints: [`Uchala element ham bitta oq qutining ichida. Quti rasmdan oldin ochiladi, matndan keyin yopiladi.`, `Birinchi qatorga [[<div class="card">]], oxirgi qatorga [[</div>]] yoz.`],
hintBox: ['.card'],
nega: `Birga turadigan elementlar bitta qutiga solinadi. Quti — bu [[div]]: ochiladi, ichiga narsa qo'yiladi, yopiladi.` });

L({ id: '1-2', bob: 1, nom: `Ikki kartochka`,
base: `
body{padding:24px}
.cards{display:flex;gap:16px}
.card{width:200px;padding:16px;background:#fff;border-radius:14px;border:1px solid #e5e7eb}
.card h3{margin:12px 0 4px}`,
html: `
<div class="cards">
  <div class="card">
    <img class="rasm" src="img/tog.jpg" alt="Tog'">
    <h3>Tog' sayohati</h3>
    <p>Ikki kunlik sayohat</p>
  </div>
  <div class="card">
    <img class="rasm" src="img/kol.jpg" alt="Ko'l">
    <h3>Ko'l bo'yi</h3>
    <p>Bir kunlik dam olish</p>
  </div>
</div>`,
startHtml: `
<div class="cards">
  <img class="rasm" src="img/tog.jpg" alt="Tog'">
  <h3>Tog' sayohati</h3>
  <p>Ikki kunlik sayohat</p>
  <img class="rasm" src="img/kol.jpg" alt="Ko'l">
  <h3>Ko'l bo'yi</h3>
  <p>Bir kunlik dam olish</p>
</div>`,
boxes: ['.cards', '.card'],
kor: [
  { t: 'group', boxes: ['.card'], q: `Bu yerda ikkita kartochka bor. Avval birinchisining elementlarini tanlab qutiga o'ra, keyin ikkinchisini.`, nega: `Ikki kartochka — ikkita alohida quti. Ikkalasining klassi bir xil: [[.card]].` },
  { t: 'choice', q: `Ikkala kartochkani yonma-yon ushlab turgan tashqi quti ([[.cards]]) ularga kim bo'ladi?`, opts: [`Otasi`, `Bolasi`, `Qo'shnisi`], a: 0, xato: [null, `Aksincha: kartochkalar [[.cards]]ning **ichida** turibdi.`, `Qo'shnilar bir xil darajada yonma-yon turadi. [[.cards]] esa kartochkalarni o'z ichiga olgan.`], nega: `Ichiga olgan quti — ota, ichidagilar — bolalar. Bu ikki so'z butun o'yin davomida kerak bo'ladi.` }
],
vazifa: `Tashqi quti [[.cards]] tayyor. Ichidagi 6 ta elementni ikkita [[<div class="card">]] qutisiga bo'l: har birida rasm, sarlavha va matn.`,
hints: [`Har bir kartochka — alohida quti. Birinchi [[.card]] uchinchi elementdan keyin yopiladi, shundan so'ng ikkinchisi ochiladi.`, `Tuzilishi: [[<div class="card">]], 3 ta element, [[</div>]]. Keyin yana xuddi shunday.`],
hintBox: ['.card'],
nega: `Takrorlanadigan bo'lakni ko'rsang — har biri alohida, bir xil klassli quti. Ularni yonma-yon tizadigan [[.cards]] esa ularning otasi.` });

L({ id: '1-3', bob: 1, nom: `Quti ichida quti`,
base: `
body{padding:24px;--brand:#111827}
.card .rasm{height:130px}
.card{width:240px;padding:16px;background:#fff;border-radius:14px;border:1px solid #e5e7eb}
.card h3{margin:12px 0}
.card-footer{display:flex;justify-content:space-between;align-items:center}`,
html: `
<div class="card">
  <img class="rasm" src="img/krossovka.jpg" alt="Krossovka">
  <h3>Sport krossovka</h3>
  <div class="card-footer">
    <span class="narx">320 000 so'm</span>
    <a class="btn">Olish</a>
  </div>
</div>`,
startHtml: `
<div class="card">
  <img class="rasm" src="img/krossovka.jpg" alt="Krossovka">
  <h3>Sport krossovka</h3>
  <span class="narx">320 000 so'm</span>
  <a class="btn">Olish</a>
</div>`,
boxes: ['.card', '.card-footer'],
kor: [
  { t: 'group', boxes: ['.card-footer'], q: `Kartochka ichida rasm va sarlavha ustma-ust, eng pastda esa ikki element bir qatorda, ikki chetda turibdi. Bir qatorda turganlarni tanla.`, nega: `Narx va tugma — kartochka ichidagi kichik quti: [[.card-footer]].` },
  { t: 'choice', q: `Narx va tugmaga alohida quti nega kerak?`, opts: [`Ularni bir qatorga tizadigan ota kerak`, `Rangini o'zgartirish uchun`, `Kerak emas, shunchaki chiroyli`], a: 0, xato: [null, `Rangni elementning o'ziga ham bersa bo'ladi. Gap ularning joylashuvida.`, `Qutisiz ularni ikki chetga yoyib bo'lmaydi — yoyadigan ota yo'q.`], nega: `Yonma-yon turadigan elementlarga umumiy ota kerak — keyin flex o'shanga yoziladi.` }
],
vazifa: `[[.card]] qutisi tayyor. Narx va tugmani uning ichida yana bitta qutiga — [[<div class="card-footer">]] ga o'ra. Shunda ular ikki chetga yoyiladi.`,
hints: [`Narx va tugma bir qatorda turishi uchun ikkalasiga umumiy ota quti kerak. U [[.card]]ning ichida bo'ladi.`, `[[<span class="narx">]]dan oldin [[<div class="card-footer">]] och, tugmadan keyin [[</div>]] bilan yop.`],
hintBox: ['.card-footer'],
nega: `Quti ichida quti bo'lishi oddiy holat. Rasm va sarlavha ustma-ust, narx bilan tugma esa yonma-yon — shuning uchun ularga o'z qutisi kerak.` });

L({ id: '1-4', bob: 1, nom: `Navbar qutilari`,
base: `
body{padding:24px 0;--brand:#4338ca}
.navbar{display:flex;justify-content:space-between;align-items:center;background:#fff;padding:14px 24px;border-bottom:1px solid #e5e7eb}
.menu{display:flex;gap:22px}`,
html: `
<nav class="navbar">
  <a class="logo">Kitobxon</a>
  <div class="menu">
    <a class="link">Bosh sahifa</a>
    <a class="link">Katalog</a>
    <a class="link">Aloqa</a>
  </div>
  <a class="btn">Kirish</a>
</nav>`,
startHtml: `
<nav class="navbar">
  <a class="logo">Kitobxon</a>
  <a class="link">Bosh sahifa</a>
  <a class="link">Katalog</a>
  <a class="link">Aloqa</a>
  <a class="btn">Kirish</a>
</nav>`,
boxes: ['.navbar', '.menu'],
kor: [
  { t: 'group', boxes: ['.menu'], q: `Navbarda uch qism bor: chapda logo, o'rtada menyu, o'ngda tugma. O'rtadagi menyuga kiradigan elementlarni tanla.`, nega: `Uchta link — bitta guruh. Unga [[.menu]] qutisi kerak.` },
  { t: 'choice', q: `Linklar [[.menu]]ga kirgandan keyin [[.navbar]]ning nechta bevosita bolasi qoladi?`, opts: [`5 ta`, `3 ta`, `1 ta`], a: 1, xato: [`Linklar endi [[.menu]] ichida — ular [[.navbar]]ning nabiralari. Faqat bevosita bolalarni sana.`, null, `[[.navbar]] ichida logo ham, tugma ham bor.`], nega: `Logo, menyu, tugma — 3 ta bola. [[space-between]] aynan shu uchtasini chapga, o'rtaga va o'ngga qo'yadi.` }
],
vazifa: `Hozir 5 ta element butun navbar bo'ylab sochilib ketgan. Uchta linkni [[<div class="menu">]] qutisiga o'ra — shunda ular bir guruh bo'lib o'rtada turadi.`,
hints: [`Logo va tugma joyida qoladi. Faqat uchta link bitta qutiga kirishi kerak.`, `Birinchi linkdan oldin [[<div class="menu">]] och, uchinchi linkdan keyin [[</div>]] bilan yop.`],
hintBox: ['.menu'],
nega: `Flex faqat **bevosita bolalarni** tartiblaydi. Linklarni bitta qutiga solganingda navbar ularni bitta bola deb ko'radi.` });

L({ id: '1-5', bob: 1, nom: `Yopishni unutma`,
base: `
body{padding:24px}
.cards{display:flex;gap:16px}
.card{width:200px;padding:16px;background:#fff;border-radius:14px;border:1px solid #e5e7eb}
.card h3{margin:12px 0 4px}`,
html: `
<div class="cards">
  <div class="card">
    <img class="rasm" src="img/qoya.jpg" alt="Qoya">
    <h3>Qoyali cho'qqi</h3>
    <p>Uch kunlik yurish</p>
  </div>
  <div class="card">
    <img class="rasm" src="img/soqmoq.jpg" alt="So'qmoq">
    <h3>Yashil so'qmoq</h3>
    <p>Bir kunlik sayr</p>
  </div>
</div>`,
startHtml: `
<div class="cards">
  <div class="card">
    <img class="rasm" src="img/qoya.jpg" alt="Qoya">
    <h3>Qoyali cho'qqi</h3>
    <p>Uch kunlik yurish</p>
  <div class="card">
    <img class="rasm" src="img/soqmoq.jpg" alt="So'qmoq">
    <h3>Yashil so'qmoq</h3>
    <p>Bir kunlik sayr</p>
  </div>
  </div>
</div>`,
boxes: ['.cards', '.card'],
kor: [
  { t: 'choice', q: `Maqsadga qara. Ikkinchi kartochka qayerda turibdi?`, opts: [`Birinchi kartochkaning ichida`, `Birinchisining yonida, alohida`, `Sahifadan tashqarida`], a: 1, nega: `Ikki kartochka — qo'shnilar. Hech biri ikkinchisining ichida emas.` },
  { t: 'choice', q: `Demak, birinchi [[.card]] qachon yopilishi kerak?`, opts: [`Ikkinchi [[.card]] ochilishidan oldin`, `Eng oxirida`, `Yopilmasa ham bo'ladi`], a: 0, xato: [null, `Oxirida yopilsa, ikkinchi kartochka birinchisining ichiga tushib qoladi.`, `Yopilmagan quti o'zidan keyingi hamma narsani ichiga olib ketadi.`], nega: `Quti qayerda yopilsa, o'sha yerda tugaydi. Qo'shni quti shundan keyin ochiladi.` }
],
vazifa: `Bu kodda xato bor: ikkinchi kartochka birinchisining ichiga kirib qolgan. [[</div>]] ning joyini to'g'rila.`,
hints: [`Har bir [[.card]] o'z matnidan ([[<p>]]) keyin darhol yopilishi kerak.`, `Birinchi kartochkaning [[<p>]]sidan keyin [[</div>]] qo'sh, oxiridagi ortiqcha [[</div>]]ni olib tashla.`],
nega: `Qutini yopishni unutsang, keyingi hamma narsa uning ichiga tushib qoladi. Ochgan har bir [[div]]ni darhol yopishni odat qil.` });

/* ================= 2-BOB: Flex kimga yoziladi ================= */
L({ id: '2-1', bob: 2, nom: `Ota va bolalar`,
base: `
body{padding:24px}
.row{background:#fff;padding:16px;border-radius:14px;border:1px solid #e5e7eb}
.box{width:90px;height:64px;border-radius:10px;background:#4338ca;color:#fff;font-weight:800;font-size:18px;text-align:center;line-height:64px}`,
html: `
<div class="row">
  <div class="box">1</div>
  <div class="box">2</div>
  <div class="box">3</div>
</div>`,
css: `
.row {
  display: flex;
  gap: 12px;
}`,
startCss: `
.row {

}

.box {

}`,
boxes: ['.row', '.box'],
kor: [
  { t: 'pick', q: `Uchta binafsha quti yonma-yon turishi kerak. [[display: flex]] qaysi qutiga yoziladi?`, a: '.row', mark: ['.box'], xato: { '.box': `Bu — bolalardan biri. Flex yozilgan quti **o'z ichidagilarni** tizadi, shuning uchun u bolalarga emas, otasiga yoziladi.` }, nega: `Flex otaga yoziladi — u bolalarini yonma-yon tizadi.` }
],
vazifa: `Uchta [[.box]] yonma-yon tursin, oralari **12px**. Kodni to'g'ri qutining ichiga yoz.`,
hints: [`Flex yozilgan quti o'z bolalarini tizadi. Bu yerda bolalar — uchta [[.box]]. Ularning otasi qaysi?`, `[[.row]] ichiga [[display: flex]] va [[gap: 12px]] yoz. [[.box]]ga hech narsa kerak emas.`],
hintBox: ['.row'],
nega: `[[display: flex]] hech qachon yonma-yon turishi kerak bo'lgan elementlarning o'ziga yozilmaydi. U doim **otasiga** yoziladi.` });

L({ id: '2-2', bob: 2, nom: `Navbar`,
base: `
body{padding:24px 0;--brand:#4338ca}
.navbar{background:#fff;padding:14px 24px;border-bottom:1px solid #e5e7eb}`,
html: `
<nav class="navbar">
  <a class="logo">Kitobxon</a>
  <div class="menu">
    <a class="link">Bosh sahifa</a>
    <a class="link">Katalog</a>
    <a class="link">Aloqa</a>
  </div>
  <a class="btn">Kirish</a>
</nav>`,
css: `
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.menu {
  display: flex;
  gap: 22px;
}`,
startCss: `
.navbar {

}

.menu {

}

.link {

}`,
boxes: ['.navbar', '.menu'],
kor: [
  { t: 'pick', q: `Logo, menyu va tugma bir qatorda, ikki chetga yoyilgan. Bu flex qaysi qutiga yoziladi?`, a: '.navbar', mark: ['.logo', '.menu', '.btn'], cands: ['.navbar', '.menu', '.logo'], nega: `Logo, menyu va tugmaning otasi — [[.navbar]].` },
  { t: 'pick', q: `Endi uchta link yonma-yon turishi kerak. Ularning flex'i qaysi qutiga yoziladi?`, a: '.menu', mark: ['.link'], cands: ['.navbar', '.menu', '.link'], xato: { '.navbar': `[[.navbar]] linklarning bobosi. Flex faqat **bevosita** bolalarga ta'sir qiladi — linklarning otasi kim?` }, nega: `Linklarning bevosita otasi — [[.menu]]. Demak bu sahifada flex ikki joyga yoziladi.` }
],
vazifa: `Navbarni yig': logo, menyu va tugma ikki chetga yoyilsin va vertikal o'rtada tursin. Linklar yonma-yon, oralari **22px**.`,
hints: [`Bu yerda **ikkita** ota bor: [[.navbar]] (bolalari: logo, menyu, tugma) va [[.menu]] (bolalari: linklar). Ikkalasiga ham flex kerak.`, `[[.navbar]]: [[display: flex]], [[justify-content: space-between]], [[align-items: center]]. [[.menu]]: [[display: flex]], [[gap: 22px]].`],
hintBox: ['.navbar', '.menu'],
nega: `Bitta sahifada flex bir necha marta ishlatiladi. Har safar o'zingdan so'ra: «Kimlar yonma-yon turishi kerak? Ularning otasi kim?»` });

L({ id: '2-3', bob: 2, nom: `Hammaga flex kerak emas`,
base: `
body{padding:24px;--brand:#111827}
.card .rasm{height:130px}
.card{width:240px;padding:16px;background:#fff;border-radius:14px;border:1px solid #e5e7eb}
.card h3{margin:12px 0}`,
html: `
<div class="card">
  <img class="rasm" src="img/krossovka.jpg" alt="Krossovka">
  <h3>Sport krossovka</h3>
  <div class="card-footer">
    <span class="narx">320 000 so'm</span>
    <a class="btn">Olish</a>
  </div>
</div>`,
css: `
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}`,
startCss: `
.card {

}

.card-footer {

}`,
boxes: ['.card', '.card-footer'],
kor: [
  { t: 'choice', q: `Kartochkada rasm, sarlavha va pastki qism **ustma-ust** turibdi. [[.card]]ga flex kerakmi?`, opts: [`Ha, har bir qutiga flex yoziladi`, `Yo'q — bloklar o'zi ustma-ust turadi`], a: 1, xato: [`Flex bolalarni **yonma-yon** qo'yish yoki tekislash uchun kerak. Ustma-ust turish — bloklarning odatiy holati.`], nega: `[[div]], [[h3]], [[p]] — blok elementlar, ular hech narsa yozmasang ham ustma-ust turadi.` },
  { t: 'pick', q: `Narx va tugma bir qatorda, ikki chetda. Flex qaysi qutiga yoziladi?`, a: '.card-footer', mark: ['.narx', '.btn'], xato: { '.card': `[[.card]]ga yozsang, rasm va sarlavha ham yonma-yon bo'lib ketadi. Narx va tugmaning bevosita otasi kim?` }, nega: `Narx va tugmaning otasi — [[.card-footer]].` }
],
vazifa: `Narx chapda, tugma o'ngda tursin, vertikal o'rtada. Ortiqcha flex yozma — faqat kerakli qutiga.`,
hints: [`Yonma-yon turishi kerak bo'lganlar faqat narx va tugma. Ularning otasi — [[.card-footer]].`, `[[.card-footer]]: [[display: flex]], [[justify-content: space-between]], [[align-items: center]].`],
hintBox: ['.card-footer'],
nega: `Flex faqat yonma-yon tizish yoki tekislash kerak bo'lgandagina yoziladi. Ustma-ust turgan bloklarga hech narsa shart emas.` });

L({ id: '2-4', bob: 2, nom: `Markazga`,
base: `
.hero{height:200px;background:linear-gradient(rgba(17,24,39,.5),rgba(17,24,39,.5)),url(img/tog.jpg) center/cover #374151}
.hero-box{background:#fff;padding:18px 28px;border-radius:14px;text-align:center}`,
html: `
<div class="hero">
  <div class="hero-box">
    <h2>Yozgi chegirma</h2>
    <p>Hamma narsaga 30% arzon</p>
  </div>
</div>`,
css: `
.hero {
  display: flex;
  justify-content: center;
  align-items: center;
}`,
startCss: `
.hero {

}

.hero-box {

}`,
boxes: ['.hero', '.hero-box'],
kor: [
  { t: 'pick', q: `Oq quti rasmli maydonning qoq o'rtasida turibdi. Uni markazga qo'yadigan kod qaysi qutiga yoziladi?`, a: '.hero', mark: ['.hero-box'], xato: { '.hero-box': `Quti o'zini o'zi markazga qo'ya olmaydi. [[justify-content]] va [[align-items]] bolalarni joylashtiradi — demak ular otaga yoziladi.` }, nega: `Bolani markazga otasi qo'yadi.` }
],
vazifa: `Oq qutini rasmli maydonning o'rtasiga qo'y — gorizontal ham, vertikal ham.`,
hints: [`Qutini uning otasi joylashtiradi. Otasi — [[.hero]].`, `[[.hero]]: [[display: flex]], [[justify-content: center]], [[align-items: center]].`],
hintBox: ['.hero'],
nega: `Biror narsani markazga qo'ymoqchi bo'lsang, kodni o'sha narsaga emas, uning **otasiga** yozasan.` });

L({ id: '2-5', bob: 2, nom: `Profil`,
base: `
body{padding:24px}
.profile{width:300px;background:#fff;padding:16px;border-radius:14px;border:1px solid #e5e7eb}
.avatar{width:56px;height:56px;flex-shrink:0;border-radius:50%;object-fit:cover;object-position:50% 15%;background:#d1d5db}`,
html: `
<div class="profile">
  <img class="avatar" src="img/dilnoza.jpg" alt="Dilnoza">
  <div class="info">
    <h3>Dilnoza Karimova</h3>
    <p>Dizayner</p>
  </div>
</div>`,
css: `
.profile {
  display: flex;
  align-items: center;
  gap: 14px;
}`,
startCss: `
.profile {

}

.info {

}`,
boxes: ['.profile', '.info'],
kor: [
  { t: 'group', boxes: ['.info'], q: `Avatar chapda, ism va kasb esa o'ngda ustma-ust turibdi. O'ng tomondagi matnlarni bitta qutiga yig'.`, nega: `Ism va kasb — bitta ustun: [[.info]].` },
  { t: 'pick', q: `Avatar va matnlar qutisi yonma-yon. Flex qaysi qutiga yoziladi?`, a: '.profile', mark: ['.avatar', '.info'], cands: ['.profile', '.info', '.avatar'], nega: `Avatar va [[.info]]ning otasi — [[.profile]].` },
  { t: 'choice', q: `[[.info]] ichida ism va kasb ustma-ust turibdi. [[.info]]ga ham flex yozamizmi?`, opts: [`Ha`, `Yo'q`], a: 1, xato: [`Ular ustma-ust turishi kerak — bloklar o'zi shunday turadi.`], nega: `Ustma-ust turganlarga flex shart emas.` }
],
vazifa: `Avatar va matnlar yonma-yon, vertikal o'rtada tursin. Oralari **14px**.`,
hints: [`Yonma-yon turadiganlar: avatar va [[.info]]. Ularning otasi — [[.profile]].`, `[[.profile]]: [[display: flex]], [[align-items: center]], [[gap: 14px]].`],
hintBox: ['.profile'],
nega: `Ism va kasb alohida qutida ([[.info]]) bo'lgani uchun flex ularni bitta bola deb ko'radi va avatar yoniga qo'yadi.` });

L({ id: '2-6', bob: 2, nom: `Uch joyda flex`,
base: `
body{padding:24px 0;--brand:#4338ca}
.topbar{background:#fff;padding:14px 24px;border-bottom:1px solid #e5e7eb}`,
html: `
<header class="topbar">
  <div class="left">
    <a class="logo">Kitobxon</a>
    <a class="link">Kitoblar</a>
    <a class="link">Mualliflar</a>
  </div>
  <div class="right">
    <a class="link">Kirish</a>
    <a class="btn">Ro'yxatdan o'tish</a>
  </div>
</header>`,
css: `
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.right {
  display: flex;
  align-items: center;
  gap: 14px;
}`,
startCss: `
.topbar {

}

.left {

}

.right {

}`,
boxes: ['.topbar', '.left', '.right'],
kor: [
  { t: 'group', boxes: ['.left', '.right'], q: `Bu yerda ikkita guruh bor: chapda va o'ngda. Har birini alohida qutiga yig'.`, nega: `Chap guruh — [[.left]], o'ng guruh — [[.right]].` },
  { t: 'pick', q: `Chap va o'ng guruh ikki chetga yoyilgan. Bu qaysi qutining ishi?`, a: '.topbar', mark: ['.left', '.right'], nega: `Ikki guruhning otasi — [[.topbar]].` },
  { t: 'choice', q: `Jami nechta qutiga [[display: flex]] yoziladi?`, opts: [`1 ta`, `2 ta`, `3 ta`], a: 2, xato: [`[[.topbar]] faqat ikki guruhni yoyadi. Guruh ichidagilarni kim tizadi?`, `Chap guruh ichidagilar ham, o'ng guruh ichidagilar ham yonma-yon turibdi.`], nega: `[[.topbar]] guruhlarni yoyadi, [[.left]] va [[.right]] esa o'z ichidagilarni tizadi.` }
],
vazifa: `Ikki guruh ikki chetga yoyilsin. Har guruh ichidagilar yonma-yon va vertikal o'rtada: chapda oralari **20px**, o'ngda **14px**.`,
hints: [`Uchta ota bor: [[.topbar]] (bolalari: ikki guruh), [[.left]] va [[.right]] (bolalari: logo, linklar, tugma).`, `[[.topbar]]: [[display: flex]], [[justify-content: space-between]], [[align-items: center]]. [[.left]]: [[display: flex]], [[align-items: center]], [[gap: 20px]]. [[.right]] ham shunday, [[gap: 14px]] bilan.`],
hintBox: ['.topbar', '.left', '.right'],
nega: `Murakkab ko'ringan qator ham bir xil savol bilan yechiladi: «Kimlar yonma-yon? Otasi kim?» — va bu savol har bir qavatda qayta beriladi.` });

/* ================= 3-BOB: Padding, margin, gap ================= */
L({ id: '3-1', bob: 3, nom: `Ichki bo'shliq`,
base: `
body{padding:24px}
.card{width:260px;background:#fff;border-radius:14px;border:1px solid #e5e7eb}`,
html: `
<div class="card">
  <h3>Bugungi ob-havo</h3>
  <p>Quyoshli, +24°</p>
</div>`,
css: `
.card {
  padding: 20px;
}`,
startCss: `
.card {

}

.card h3 {

}`,
boxes: ['.card'],
kor: [
  { t: 'choice', zone: { pad: '.card' }, q: `Qizil chiziqli joy — matn bilan quti cheti orasidagi bo'shliq. Bu nima?`, opts: PMG, a: 0, xato: [null, `Margin — qutining **tashqarisidagi** bo'shliq. Bu yerda bo'shliq qutining ichida.`, `Gap — flex bolalari **orasidagi** bo'shliq. Bu yerda esa quti cheti bilan ichidagisi orasi.`], nega: `Qutining ichidagi, cheti bilan kontent orasidagi bo'shliq — padding.` },
  { t: 'pick', zone: { pad: '.card' }, q: `Bu padding qaysi elementga yoziladi?`, a: '.card', cands: ['.card', 'h3', 'p'], xato: { h3: `Sarlavhaga yozsang, faqat sarlavha siljiydi. Ichidagi hamma narsani chetdan uzoqlashtirish — qutining ishi.`, p: `Matnga yozsang, faqat matn siljiydi. Ichidagi hamma narsani chetdan uzoqlashtirish — qutining ishi.` }, nega: `Padding qutining o'ziga yoziladi.` }
],
vazifa: `Matn qutining chetiga yopishib qolgan. Qutining ichidan har tomonga **20px** bo'shliq ber.`,
hints: [`Bo'shliq qutining **ichida**, chetlari bilan matn orasida. Ichki bo'shliq qanday ataladi?`, `[[.card]] ichiga [[padding: 20px]] yoz.`],
hintBox: ['.card'],
nega: `**Padding** — quti cheti bilan ichidagi narsalar orasidagi bo'shliq. U qutining o'ziga yoziladi, fon rangi padding ostida ham ko'rinadi.` });

L({ id: '3-2', bob: 3, nom: `Oradagi bo'shliq`,
base: `
body{padding:24px}
.card{width:150px;padding:16px;background:#fff;border-radius:12px;border:1px solid #e5e7eb}`,
html: `
<div class="cards">
  <div class="card">
    <h3>Non</h3>
    <p>4 000 so'm</p>
  </div>
  <div class="card">
    <h3>Sut</h3>
    <p>12 000 so'm</p>
  </div>
  <div class="card">
    <h3>Asal</h3>
    <p>60 000 so'm</p>
  </div>
</div>`,
css: `
.cards {
  display: flex;
  gap: 16px;
}`,
startCss: `
.cards {
  display: flex;

}

.card {

}`,
boxes: ['.cards', '.card'],
kor: [
  { t: 'choice', zone: { gap: '.cards' }, q: `Qizil chiziqli joylar — kartochkalar orasidagi bo'shliq. Buni nima beradi?`, opts: PMG, a: 2, xato: [`Padding — qutining **ichidagi** bo'shliq. Bu yerda bo'shliq qutilar orasida.`, `Margin bilan ham qilsa bo'ladi, lekin har bir kartochkaga alohida yozish kerak va chetda ortiqcha bo'shliq qoladi. Flex bolalari orasiga eng to'g'risi boshqa.`, null], nega: `Flex bolalari orasidagi bo'shliq — gap.` },
  { t: 'pick', zone: { gap: '.cards' }, q: `[[gap]] qaysi qutiga yoziladi?`, a: '.cards', xato: { '.card': `Gap bolalar **orasidagi** bo'shliq, lekin u bolalarga emas, ularning otasiga yoziladi.` }, nega: `Gap bir marta otaga yoziladi va hamma oraliqqa bir xil ta'sir qiladi.` }
],
vazifa: `Kartochkalar bir-biriga yopishib turibdi. Oralarini **16px** qil.`,
hints: [`Bo'shliq flex bolalari orasida. U bolalarga emas, otasiga yoziladi.`, `[[.cards]] ichiga [[gap: 16px]] yoz.`],
hintBox: ['.cards'],
nega: `**Gap** — flex bolalari orasidagi bo'shliq. Bir marta otaga yozasan — hamma oraliq bir xil bo'ladi, chetlarda ortiqcha joy qolmaydi.` });

L({ id: '3-3', bob: 3, nom: `Tashqi bo'shliq`,
base: `
body{padding:24px}
.banner{background:#1c1917;color:#fff;font-weight:700;padding:14px 18px;border-radius:12px}
.card{background:#fff;padding:18px;border-radius:12px;border:1px solid #e5e7eb}`,
html: `
<div class="banner">Yangi mavsum boshlandi</div>
<div class="card">
  <h3>Kuzgi kolleksiya</h3>
  <p>40 dan ortiq yangi model</p>
</div>`,
css: `
.card {
  margin-top: 20px;
}`,
startCss: `
.banner {

}

.card {

}`,
boxes: ['.card'],
kor: [
  { t: 'choice', zone: { mt: '.card' }, q: `Ikki quti orasida bo'shliq bor. Ular flex ichida emas — shunchaki ustma-ust turgan ikki blok. Bu bo'shliq nima?`, opts: PMG, a: 1, xato: [`Padding qutining ichida bo'ladi va fon bilan bo'yaladi. Bu bo'shliq esa ikkala qutining ham tashqarisida.`, null, `Gap faqat flex otaning ichida ishlaydi. Bu ikki blokning flex otasi yo'q.`], nega: `Qutining tashqarisidagi, qo'shnisini itaradigan bo'shliq — margin.` }
],
vazifa: `Oq quti qora bannerga yopishib qolgan. Ular orasini **20px** qil.`,
hints: [`Bo'shliq qutilarning **tashqarisida**. Tashqi bo'shliq — margin.`, `[[.card]]ga [[margin-top: 20px]] yoz (yoki [[.banner]]ga [[margin-bottom: 20px]] — natija bir xil).`],
nega: `**Margin** — qutining tashqarisidagi bo'shliq, u qo'shnilarni itaradi. Fon rangi margin ostida ko'rinmaydi.` });

L({ id: '3-4', bob: 3, nom: `Uchalasi birga`,
base: `
body{padding:24px}
.card{width:150px;background:#fff;border-radius:12px;border:1px solid #e5e7eb}`,
html: `
<h2 class="title">Mashhur taomlar</h2>
<div class="cards">
  <div class="card">
    <h3>Osh</h3>
    <p>35 000 so'm</p>
  </div>
  <div class="card">
    <h3>Lag'mon</h3>
    <p>28 000 so'm</p>
  </div>
  <div class="card">
    <h3>Manti</h3>
    <p>30 000 so'm</p>
  </div>
</div>`,
css: `
.title {
  margin-bottom: 16px;
}

.cards {
  display: flex;
  gap: 12px;
}

.card {
  padding: 16px;
}`,
startCss: `
.title {

}

.cards {
  display: flex;

}

.card {

}`,
boxes: ['.cards', '.card'],
kor: [
  { t: 'choice', zone: { mb: '.title' }, q: `Birinchi bo'shliq: sarlavha bilan kartochkalar orasida. Bu nima?`, opts: PMG, a: 1, xato: [`Sarlavhaning foni yo'q, lekin bu bo'shliq uning tashqarisida — pastdagi qo'shnisini itaryapti.`, null, `Sarlavha va [[.cards]] flex ichida emas.`], nega: `Ikki blok orasi — margin.` },
  { t: 'choice', zone: { gap: '.cards' }, q: `Ikkinchi bo'shliq: kartochkalar orasida. Bu nima?`, opts: PMG, a: 2, nega: `Flex bolalari orasi — gap.` },
  { t: 'choice', zone: { pad: '.card' }, q: `Uchinchi bo'shliq: kartochka cheti bilan matn orasida. Bu nima?`, opts: PMG, a: 0, nega: `Qutining ichi — padding.` }
],
vazifa: `Uch xil bo'shliq ber: sarlavha ostida **16px**, kartochkalar orasida **12px**, har kartochkaning ichida **16px**.`,
hints: [`Uchta savol: bo'shliq qutining ichidami (padding), flex bolalari orasidami (gap) yoki qutining tashqarisidami (margin)?`, `[[.title]]: [[margin-bottom: 16px]]. [[.cards]]: [[gap: 12px]]. [[.card]]: [[padding: 16px]].`],
nega: `Qoida: **ichida — padding**, **flex bolalari orasida — gap**, **tashqarida — margin**.` });

L({ id: '3-5', bob: 3, nom: `Tugma`,
base: `
body{padding:24px}
.card{width:300px;background:#fff;padding:20px;border-radius:14px;border:1px solid #e5e7eb}
.card h3{margin-bottom:14px}
.button{display:inline-block;background:#ea580c;color:#fff;font-weight:700;border-radius:10px}`,
html: `
<div class="card">
  <h3>Issiq somsa — 20 daqiqada</h3>
  <a class="button">Buyurtma berish</a>
</div>`,
css: `
.button {
  padding: 12px 28px;
}`,
startCss: `
.button {

}`,
boxes: ['.card'],
kor: [
  { t: 'choice', zone: { pad: '.button' }, q: `Tugma matni atrofida bo'shliq bor: tepada va pastda kamroq, chap va o'ngda ko'proq. Bu nima?`, opts: PMG, a: 0, xato: [null, `Margin tugmaning tashqarisida bo'lardi va to'q sariq rangga bo'yalmasdi.`, `Tugmaning ichida bitta matn bor — orasiga gap qo'yadigan bolalar yo'q.`], nega: `Tugmaning rangli maydoni — bu matn atrofidagi padding.` },
  { t: 'choice', q: `[[padding: 12px 28px]] nimani bildiradi?`, opts: [`Tepa va past 12px, chap va o'ng 28px`, `Chap va o'ng 12px, tepa va past 28px`, `Tepa 12px, past 28px`], a: 0, nega: `Ikki qiymat yozilsa: birinchisi tepa-past, ikkinchisi chap-o'ng.` }
],
vazifa: `Tugma matnga yopishib, siqilib qolgan. Unga ichki bo'shliq ber: tepa va pastdan **12px**, chap va o'ngdan **28px**.`,
hints: [`Tugmaning kattaligini uning ichki bo'shlig'i belgilaydi. Ikki qiymatli padding kerak.`, `[[.button]] ichiga [[padding: 12px 28px]] yoz.`],
nega: `Tugmaning kattaligi [[width]] va [[height]] bilan emas, **padding** bilan beriladi — shunda matn uzaysa, tugma o'zi kengayadi.` });

L({ id: '3-6', bob: 3, nom: `Xatoni tuzat`,
base: `
body{padding:24px}
.card{width:160px;background:#fff;border-radius:12px;border:1px solid #e5e7eb}`,
html: `
<div class="cards">
  <div class="card">
    <h3>Start</h3>
    <p>Oyiga 99 000</p>
  </div>
  <div class="card">
    <h3>Pro</h3>
    <p>Oyiga 199 000</p>
  </div>
  <div class="card">
    <h3>Max</h3>
    <p>Oyiga 299 000</p>
  </div>
</div>`,
css: `
.cards {
  display: flex;
  gap: 16px;
}

.card {
  padding: 18px;
}`,
startCss: `
.cards {
  display: flex;
}

.card {
  margin: 16px;
}

.card h3 {
  margin: 18px;
}`,
boxes: ['.cards', '.card'],
kor: [
  { t: 'choice', q: `Maqsadda birinchi kartochka chap chetga tegib turibdi, kartochkalar orasi esa 16px. Har bir kartochkaga [[margin: 16px]] yozilsa nima bo'ladi?`, opts: [`Xuddi maqsaddagidek chiqadi`, `Chetlarda ham bo'shliq paydo bo'ladi, oraliq esa 32px bo'lib ketadi`, `Hech narsa o'zgarmaydi`], a: 1, xato: [`Margin har tomonga qo'shiladi: chapga ham, o'ngga ham. Ikki qo'shnining margini qo'shilib ketadi.`, null, `Margin qutilarni itaradi — o'zgarish bo'ladi.`], nega: `Margin har bir qutining to'rt tomoniga qo'shiladi. Gap esa faqat oralarga.` },
  { t: 'choice', zone: { pad: '.card' }, q: `Matnni kartochka chetidan uzoqlashtirish uchun nima kerak?`, opts: [`Sarlavhaga margin`, `Kartochkaga padding`, `Otaga gap`], a: 1, xato: [`Unda faqat sarlavha siljiydi, pastdagi matn chetda qoladi.`, null, `Gap kartochkalar orasiga ta'sir qiladi, ichiga emas.`], nega: `Ichidagi hamma narsani birdan siljitadigan — qutining paddingi.` }
],
vazifa: `Bu kodni kimdir faqat margin bilan yozgan — hammasi siljib ketgan. Tuzat: kartochkalar orasi **16px** (gap), har birining ichida **18px** (padding). Ortiqcha marginlarni o'chir.`,
hints: [`Ikkita margin ham noto'g'ri joyda. Oraliq — otaning ishi, ichki bo'shliq — kartochkaning ishi.`, `[[.cards]]ga [[gap: 16px]] qo'sh. [[.card]]da [[margin]] o'rniga [[padding: 18px]] yoz. [[.card h3]] blokini o'chir.`],
nega: `Hamma bo'shliqni margin bilan qilish mumkin, lekin kod chalkashadi. Har bo'shliqni o'z xususiyati bilan bersang, kod qisqa va tushunarli bo'ladi.` });

/* ================= 4-BOB: Container ================= */
L({ id: '4-1', bob: 4, nom: `Markazdagi quti`,
base: `
body{padding:24px 0}
.container{background:#fff;padding:20px;border-radius:12px;border:1px solid #e5e7eb}
.container p{margin-top:6px}`,
html: `
<div class="container">
  <h2>Biz haqimizda</h2>
  <p>2020-yildan beri har kuni mazali somsa pishiramiz.</p>
</div>`,
css: `
.container {
  max-width: 440px;
  margin: 0 auto;
}`,
startCss: `
.container {

}`,
boxes: ['.container'],
kor: [
  { t: 'choice', zone: { sides: '.container' }, q: `Oq quti sahifaning o'rtasida, ikki chetda bir xil bo'sh joy bor. Buni nima qiladi?`, opts: [`[[padding]]`, `[[max-width]] va [[margin: 0 auto]]`, `[[text-align: center]]`], a: 1, xato: [`Padding ichki bo'shliq beradi, lekin qutining kengligini cheklamaydi.`, null, `U matnni markazlaydi, qutining o'zini emas.`], nega: `[[max-width]] kenglikni cheklaydi, [[margin: 0 auto]] esa ikki chetdagi bo'sh joyni teng bo'ladi.` }
],
vazifa: `Oq quti butun kenglikni egallab olgan. Uning kengligini **440px** bilan chekla va sahifa o'rtasiga qo'y.`,
hints: [`Ikki ish kerak: kenglikni cheklash va ikki chetdagi bo'sh joyni teng bo'lish.`, `[[.container]] ichiga [[max-width: 440px]] va [[margin: 0 auto]] yoz.`],
nega: `**Container** — kontent kengligini cheklab, o'rtaga qo'yadigan quti. Katta ekranda matn chetdan chetgacha cho'zilib ketmasligi uchun kerak.` });

L({ id: '4-2', bob: 4, nom: `Fon to'liq, kontent o'rtada`,
base: `
.header{background:#1c1917;padding:16px 0}
.header .logo{color:#fb923c}
.header .link{color:#d6d3d1}`,
html: `
<header class="header">
  <div class="container">
    <nav class="navbar">
      <a class="logo">Somsa.uz</a>
      <div class="menu">
        <a class="link">Menyu</a>
        <a class="link">Yetkazish</a>
        <a class="link">Aloqa</a>
      </div>
    </nav>
  </div>
</header>`,
css: `
.container {
  max-width: 480px;
  margin: 0 auto;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.menu {
  display: flex;
  gap: 20px;
}`,
startCss: `
.header {

}

.container {

}

.navbar {

}

.menu {

}`,
boxes: ['.header', '.container', '.navbar', '.menu'],
kor: [
  { t: 'pick', q: `To'q fon sahifaning chetidan chetigacha yetgan. Fon rangi qaysi qutida?`, a: '.header', xato: { '.container': `Container tor. Unga fon bersang, to'q rang faqat o'rtada bo'ladi.`, '.navbar': `[[.navbar]] containerning ichida — u ham tor.`, '.menu': `[[.menu]] faqat uchta linkni o'raydi.` }, nega: `Fon — eng tashqi, to'liq kenglikdagi qutining ishi.` },
  { t: 'pick', q: `Kontent kengligini cheklab, o'rtaga qo'yadigan quti qaysi?`, a: '.container', xato: { '.header': `[[.header]] to'liq kenglikda qolishi kerak — aks holda fon ham torayadi.` }, nega: `Kenglik — containerning ishi.` },
  { t: 'pick', q: `Logo va menyu ikki chetga yoyilgan. Bu flex qaysi qutiga yoziladi?`, a: '.navbar', mark: ['.logo', '.menu'], xato: { '.header': `[[.header]]ning bitta bolasi bor — [[.container]]. Flex yozsang, faqat o'sha bitta bolaga ta'sir qiladi.`, '.container': `[[.container]]ning ham bitta bolasi bor — [[.navbar]]. Logo va menyuning bevosita otasi kim?` }, nega: `Logo va menyuning bevosita otasi — [[.navbar]].` }
],
vazifa: `Uch quti — uch vazifa. [[.container]] kontentni **480px** bilan cheklab, o'rtaga qo'ysin. [[.navbar]] logo va menyuni ikki chetga yoysin, vertikal o'rtada. [[.menu]] linklarni yonma-yon tizsin, oralari **20px**.`,
hints: [`[[.header]] — fon (tayyor). [[.container]] — kenglik. [[.navbar]] — logo bilan menyuni tizish. [[.menu]] — linklarni tizish.`, `[[.container]]: [[max-width: 480px]], [[margin: 0 auto]]. [[.navbar]]: [[display: flex]], [[justify-content: space-between]], [[align-items: center]]. [[.menu]]: [[display: flex]], [[gap: 20px]].`],
hintBox: ['.container', '.navbar'],
nega: `Har bir qutining bitta vazifasi bor: **header — fon**, **container — kenglik**, **navbar — tartib**. Hammasini bitta qutiga yozishga urinma.` });

L({ id: '4-3', bob: 4, nom: `Bitta container, ikki seksiya`,
base: `
.container{max-width:480px;margin:0 auto}
.header{background:#1c1917;padding:16px 0}
.header .logo{color:#fb923c}
.hero{background:#fff7ed;padding:36px 0}
.hero p{margin-top:8px}`,
html: `
<header class="header">
  <div class="container">
    <a class="logo">Somsa.uz</a>
  </div>
</header>
<section class="hero">
  <div class="container">
    <h1>Issiq somsa</h1>
    <p>Tandirdan to'g'ri eshigingizgacha</p>
  </div>
</section>`,
startHtml: `
<header class="header">
  <div class="container">
    <a class="logo">Somsa.uz</a>
  </div>
</header>
<section class="hero">
  <h1>Issiq somsa</h1>
  <p>Tandirdan to'g'ri eshigingizgacha</p>
</section>`,
boxes: ['.header', '.hero', '.container'],
kor: [
  { t: 'choice', q: `Logo va katta sarlavhaning chap cheti bitta chiziqda turibdi. Nega?`, opts: [`Ikkalasiga bir xil margin yozilgan`, `Ikkalasi ham bir xil [[.container]] ichida`, `Tasodif`], a: 1, xato: [`Har elementga alohida margin yozish shart emas — buni bitta quti hal qiladi.`, null, `Dizaynda tasodif bo'lmaydi.`], nega: `Bir xil container — bir xil kenglik, bir xil chet.` },
  { t: 'choice', q: `Sahifada 5 ta seksiya bo'lsa, nechta [[.container]] kerak?`, opts: [`1 ta — hammasini o'raydi`, `5 ta — har seksiya ichida bittadan`, `Kerak emas`], a: 1, xato: [`Bitta umumiy container bo'lsa, seksiyalarning foni to'liq kenglikka chiqa olmaydi.`, null, `Containersiz kontent ekran chetiga yopishib qoladi.`], nega: `Har seksiya: tashqarida fonli quti, ichida container.` }
],
vazifa: `Headerdagi logo o'rtaga tekislangan, hero matni esa chap chetga yopishib qolgan. Hero ichidagi sarlavha va matnni ham [[<div class="container">]] ga o'ra.`,
hints: [`[[.hero]] seksiyasi joyida qoladi — fon uniki. Uning ichida, matnlar atrofida yana bitta quti kerak.`, `[[<h1>]]dan oldin [[<div class="container">]] och, [[<p>]]dan keyin [[</div>]] bilan yop.`],
nega: `Har bir seksiya ikki qavatli: tashqarida — fonli quti (to'liq kenglik), ichida — [[.container]]. Shunda hamma seksiyaning kontenti bir chiziqda turadi.` });

L({ id: '4-4', bob: 4, nom: `Chetga yopishmasin`,
base: `
.hero{background:#fff7ed;padding:32px 0}
.hero p{margin-top:8px}`,
html: `
<section class="hero">
  <div class="container">
    <h1>Somsa — har kuni yangi</h1>
    <p>Ertalab soat 7 dan pishiramiz</p>
  </div>
</section>`,
css: `
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 24px;
}`,
startCss: `
.container {
  max-width: 900px;
  margin: 0 auto;

}`,
boxes: ['.hero', '.container'],
kor: [
  { t: 'choice', q: `Containerning [[max-width]]i 900px, ekran esa 640px — torroq. Bunda container qanday bo'ladi?`, opts: [`900px bo'lib, ekrandan chiqib ketadi`, `Ekran kengligicha bo'ladi va matn chetga yopishadi`, `Yo'qolib qoladi`], a: 1, xato: [`[[max-width]] — eng ko'pi shuncha, degani. Joy kam bo'lsa, quti torayadi.`, null, `Quti joyida, faqat torayadi.`], nega: `Tor ekranda container ekran bilan bir xil kenglikda bo'ladi — ikki chetda bo'sh joy qolmaydi.` },
  { t: 'choice', zone: { pad: '.container' }, q: `Matn ekran chetiga yopishmasligi uchun qizil chiziqli joy kerak. U nima?`, opts: [`Containerga padding`, `Matnga margin`, `Hero'ga gap`], a: 0, xato: [null, `Har bir matnga alohida margin yozish kerak bo'lardi. Bitta quti hammasini hal qiladi.`, `Gap bolalar orasiga ta'sir qiladi, chetlarga emas.`], nega: `Containerning yon paddingi matnni chetdan saqlaydi.` }
],
vazifa: `Ekran tor bo'lganda matn chetga yopishib qolyapti. Containerga chap va o'ngdan **24px** ichki bo'shliq ber, tepa va pastdan **0**.`,
hints: [`Tepa-past 0, chap-o'ng 24px. Ikki qiymatli padding yoziladi.`, `[[.container]]ga [[padding: 0 24px]] qo'sh.`],
hintBox: ['.container'],
nega: `Yaxshi container uch narsadan iborat: [[max-width]], [[margin: 0 auto]] va yon tomonlarga [[padding]]. Telefonda aynan shu padding matnni chetdan saqlaydi.` });

L({ id: '4-5', bob: 4, nom: `Har xususiyat o'z qutisiga`,
base: `
body{padding-top:40px}
.footer .logo{color:#fb923c}
.footer p{color:#d6d3d1}`,
html: `
<footer class="footer">
  <div class="container">
    <div class="footer-row">
      <a class="logo">Somsa.uz</a>
      <p>Har kuni 7:00 dan 22:00 gacha</p>
    </div>
  </div>
</footer>`,
css: `
.footer {
  background: #1c1917;
  padding: 24px 0;
}

.container {
  max-width: 460px;
  margin: 0 auto;
}

.footer-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}`,
startCss: `
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.container {
  max-width: 460px;
  margin: 0 auto;
  background: #1c1917;
  padding: 24px 0;
}

.footer-row {

}`,
styles: [
  ['.container', 'backgroundColor', `Fon rangi hali <code>.container</code>da turibdi. U tor, shuning uchun to'q rang chetgacha yetmaydi. [[background]]ni <code>.footer</code>ga ko'chir.`],
  ['.footer', 'backgroundColor', `<code>.footer</code>ning foni yo'q. To'q fon ([[background: #1c1917]]) to'liq kenglikdagi qutiga yoziladi.`]
],
boxes: ['.footer', '.container', '.footer-row'],
kor: [
  { t: 'pick', q: `To'q fon chetdan chetgacha yetgan. U qaysi qutiga yoziladi?`, a: '.footer', xato: { '.container': `Container tor — fon ham tor chiqadi.`, '.footer-row': `U containerning ichida — yanada tor.` }, nega: `Fon va tepa-past padding — tashqi qutining ishi.` },
  { t: 'pick', q: `Logo va matn ikki chetda turibdi. Ularning bevosita otasi qaysi?`, a: '.footer-row', mark: ['.logo', 'p'], xato: { '.footer': `[[.footer]]ning bitta bolasi bor — [[.container]].`, '.container': `[[.container]]ning bitta bolasi bor — [[.footer-row]].` }, nega: `Flex bevosita otaga — [[.footer-row]]ga yoziladi.` }
],
vazifa: `Bu kodda xususiyatlar noto'g'ri qutilarga yozilgan: fon tor chiqyapti, logo bilan matn yoyilmayapti. Har birini o'z qutisiga ko'chir: fon va tepa-past padding — [[.footer]]ga, flex — [[.footer-row]]ga. [[.container]]da faqat kenglik qolsin.`,
hints: [`Uchta quti, uchta vazifa: [[.footer]] — fon va padding, [[.container]] — kenglik, [[.footer-row]] — tartib.`, `[[.footer]]dagi uchta flex qatorini [[.footer-row]]ga, [[.container]]dagi [[background]] va [[padding]]ni [[.footer]]ga ko'chir.`],
nega: `Sayt buzilganda ko'pincha kod to'g'ri, faqat **noto'g'ri qutiga** yozilgan bo'ladi. Avval so'ra: bu ish qaysi qutiniki?` });

/* ================= 5-BOB: To'liq seksiyalar ================= */
const CONT = `.container{max-width:560px;margin:0 auto}`;
const KIT = {
  header: `.header{background:#1c1917;padding:14px 0}
.header .logo{color:#fb923c}
.header .link{color:#d6d3d1}`,
  hero: `.hero{background:#fff7ed}
.hero p{margin:10px 0 18px}
.hero-img{width:200px;height:160px;flex-shrink:0;border-radius:16px;object-fit:cover;background:#fed7aa}`,
  products: `.products{background:#fafaf9}
.title{text-align:center}
.card{width:176px;background:#fff;border-radius:14px;border:1px solid #e7e5e4}
.card h3{margin:10px 0 2px}
.card .rasm{height:92px}`,
  footer: `.footer{background:#1c1917}
.footer .logo{color:#fb923c;margin-bottom:8px}
.footer h3{color:#fff;margin-bottom:8px}
.footer p{color:#d6d3d1}
.footer .link{color:#d6d3d1;margin-bottom:4px}
.copy{border-top:1px solid #44403c;padding-top:14px}`
};
const P = {
  header: {
    html: `<header class="header">
  <div class="container">
    <nav class="navbar">
      <a class="logo">Somsa.uz</a>
      <div class="menu">
        <a class="link">Menyu</a>
        <a class="link">Yetkazish</a>
        <a class="link">Aloqa</a>
      </div>
      <a class="btn">Buyurtma</a>
    </nav>
  </div>
</header>`,
    flat: `<header class="header">
  <a class="logo">Somsa.uz</a>
  <a class="link">Menyu</a>
  <a class="link">Yetkazish</a>
  <a class="link">Aloqa</a>
  <a class="btn">Buyurtma</a>
</header>`,
    css: `.container {
  max-width: 560px;
  margin: 0 auto;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.menu {
  display: flex;
  gap: 20px;
}`
  },
  hero: {
    html: `<section class="hero">
  <div class="container">
    <div class="hero-row">
      <div class="hero-text">
        <h1>Issiq somsa — 20 daqiqada</h1>
        <p>Tandirdan uzilgan zahoti yo'lga chiqadi.</p>
        <a class="btn">Buyurtma berish</a>
      </div>
      <img class="hero-img" src="img/somsa.jpg" alt="Somsa">
    </div>
  </div>
</section>`,
    flat: `<section class="hero">
  <h1>Issiq somsa — 20 daqiqada</h1>
  <p>Tandirdan uzilgan zahoti yo'lga chiqadi.</p>
  <a class="btn">Buyurtma berish</a>
  <img class="hero-img" src="img/somsa.jpg" alt="Somsa">
</section>`,
    css: `.hero {
  padding: 40px 0;
}

.hero-row {
  display: flex;
  align-items: center;
  gap: 32px;
}`
  },
  products: {
    html: `<section class="products">
  <div class="container">
    <h2 class="title">Menyu</h2>
    <div class="cards">
      <div class="card">
        <img class="rasm" src="img/goshtli.jpg" alt="Go'shtli somsa">
        <h3>Go'shtli</h3>
        <p>12 000 so'm</p>
      </div>
      <div class="card">
        <img class="rasm" src="img/qovoqli.jpg" alt="Qovoqli somsa">
        <h3>Qovoqli</h3>
        <p>8 000 so'm</p>
      </div>
      <div class="card">
        <img class="rasm" src="img/kartoshkali.jpg" alt="Kartoshkali somsa">
        <h3>Kartoshkali</h3>
        <p>7 000 so'm</p>
      </div>
    </div>
  </div>
</section>`,
    flat: `<section class="products">
  <h2 class="title">Menyu</h2>
  <img class="rasm" src="img/goshtli.jpg" alt="Go'shtli somsa">
  <h3>Go'shtli</h3>
  <p>12 000 so'm</p>
  <img class="rasm" src="img/qovoqli.jpg" alt="Qovoqli somsa">
  <h3>Qovoqli</h3>
  <p>8 000 so'm</p>
  <img class="rasm" src="img/kartoshkali.jpg" alt="Kartoshkali somsa">
  <h3>Kartoshkali</h3>
  <p>7 000 so'm</p>
</section>`,
    css: `.products {
  padding: 36px 0;
}

.title {
  margin-bottom: 20px;
}

.cards {
  display: flex;
  gap: 16px;
}

.card {
  padding: 14px;
}`
  },
  footer: {
    html: `<footer class="footer">
  <div class="container">
    <div class="footer-cols">
      <div class="col">
        <a class="logo">Somsa.uz</a>
        <p>Har kuni 7:00 dan 22:00 gacha</p>
      </div>
      <div class="col">
        <h3>Bo'limlar</h3>
        <a class="link">Taomlar</a>
        <a class="link">Narxlar</a>
      </div>
      <div class="col">
        <h3>Aloqa</h3>
        <a class="link">Telegram</a>
        <a class="link">Instagram</a>
      </div>
    </div>
    <p class="copy">© 2026 Somsa.uz</p>
  </div>
</footer>`,
    flat: `<footer class="footer">
  <a class="logo">Somsa.uz</a>
  <p>Har kuni 7:00 dan 22:00 gacha</p>
  <h3>Bo'limlar</h3>
  <a class="link">Taomlar</a>
  <a class="link">Narxlar</a>
  <h3>Aloqa</h3>
  <a class="link">Telegram</a>
  <a class="link">Instagram</a>
  <p class="copy">© 2026 Somsa.uz</p>
</footer>`,
    css: `.footer {
  padding: 32px 0 20px;
}

.footer-cols {
  display: flex;
  justify-content: space-between;
}

.copy {
  margin-top: 24px;
}`
  }
};

L({ id: '5-1', bob: 5, nom: `Header`,
base: KIT.header,
html: P.header.html, css: P.header.css,
startHtml: `
<header class="header">
  <div class="container">
    <a class="logo">Somsa.uz</a>
    <a class="link">Menyu</a>
    <a class="link">Yetkazish</a>
    <a class="link">Aloqa</a>
    <a class="btn">Buyurtma</a>
  </div>
</header>`,
startCss: `
.container {

}

/* qolgan qutilarni o'zing yoz */`,
boxes: ['.header', '.container', '.navbar', '.menu'],
kor: [
  { t: 'group', boxes: ['.menu'], q: `Headerda chapda logo, o'rtada menyu, o'ngda tugma bor. Avval menyuga kiradigan elementlarni qutiga yig'.`, nega: `Uchta link — [[.menu]].` },
  { t: 'group', boxes: ['.navbar'], q: `Endi logo, menyu va tugmani bir qatorga tizadigan ota quti kerak. Unga kiradigan **hamma** elementni tanla.`, nega: `Logo, menyu va tugmaning otasi — [[.navbar]]. U [[.container]]ning ichida turadi.` },
  { t: 'pick', q: `Logo, menyu va tugmani ikki chetga yoyadigan flex qaysi qutiga yoziladi?`, a: '.navbar', mark: ['.logo', '.menu', '.btn'], nega: `Bevosita ota — [[.navbar]].` }
],
vazifa: `Headerni boshidan yig'. **HTML:** uchta linkni [[.menu]] qutisiga, so'ng logo, menyu va tugmani [[.navbar]] qutisiga o'ra. **CSS:** container **560px**, o'rtada; navbar ikki chetga yoyilgan, vertikal o'rtada; linklar orasi **20px**.`,
hints: [`Avval HTML: [[.container]] ichida bitta [[.navbar]], uning ichida logo, [[.menu]] (3 ta link) va tugma. Keyin CSS'da uchta quti: container, navbar, menu.`, `[[.container]]: [[max-width: 560px]], [[margin: 0 auto]]. [[.navbar]]: [[display: flex]], [[justify-content: space-between]], [[align-items: center]]. [[.menu]]: [[display: flex]], [[gap: 20px]].`],
hintBox: ['.navbar', '.menu'],
nega: `Header to'rt qavatdan iborat: [[.header]] (fon), [[.container]] (kenglik), [[.navbar]] (tartib), [[.menu]] (linklar). Deyarli har bir saytda shu tuzilishni ko'rasan.` });

L({ id: '5-2', bob: 5, nom: `Hero`,
base: CONT + '\n' + KIT.hero,
html: P.hero.html, css: P.hero.css,
startHtml: `
<section class="hero">
  <div class="container">
    <div class="hero-row">
      <h1>Issiq somsa — 20 daqiqada</h1>
      <p>Tandirdan uzilgan zahoti yo'lga chiqadi.</p>
      <a class="btn">Buyurtma berish</a>
      <img class="hero-img" src="img/somsa.jpg" alt="Somsa">
    </div>
  </div>
</section>`,
startCss: `
.hero {

}

.hero-row {

}`,
boxes: ['.hero', '.container', '.hero-row', '.hero-text'],
kor: [
  { t: 'group', boxes: ['.hero-text'], q: `Chapda matnlar ustuni, o'ngda rasm. Chap ustunga kiradigan elementlarni tanla.`, nega: `Sarlavha, matn va tugma — bitta ustun: [[.hero-text]].` },
  { t: 'choice', q: `Shundan keyin [[.hero-row]]ning nechta bevosita bolasi bo'ladi?`, opts: [`4 ta`, `2 ta`, `1 ta`], a: 1, xato: [`Uchta element endi [[.hero-text]] ichida — ular bitta bola bo'lib sanaladi.`, null, `Rasm ham bor.`], nega: `Ikki bola: matn ustuni va rasm. Flex ularni yonma-yon qo'yadi.` },
  { t: 'choice', zone: { pad: '.hero' }, q: `Seksiyaning tepasi va pastidagi qizil chiziqli bo'sh joy nima?`, opts: PMG, a: 0, xato: [null, `Margin bo'lsa, bu joy seksiya foniga bo'yalmasdi.`, `Bu bolalar orasi emas, seksiya cheti bilan kontent orasi.`], nega: `Fon rangi bo'yalgan ichki bo'shliq — seksiyaning paddingi.` }
],
vazifa: `**HTML:** sarlavha, matn va tugmani [[.hero-text]] qutisiga o'ra. **CSS:** seksiyaga tepa va pastdan **40px** padding; matn ustuni va rasm yonma-yon, vertikal o'rtada, oralari **32px**.`,
hints: [`HTML'da [[.hero-row]]ning ikki bolasi bo'lishi kerak: [[.hero-text]] va [[.hero-img]]. CSS'da padding seksiyaga, flex esa [[.hero-row]]ga yoziladi.`, `[[.hero]]: [[padding: 40px 0]]. [[.hero-row]]: [[display: flex]], [[align-items: center]], [[gap: 32px]].`],
hintBox: ['.hero-text'],
nega: `Ikki ustunli har qanday bo'lak shunday quriladi: flex ota, ichida ikkita bola quti. Har ustundagi narsalar o'z qutisida turadi.` });

L({ id: '5-3', bob: 5, nom: `Kartochkalar`,
base: CONT + '\n' + KIT.products,
html: P.products.html, css: P.products.css,
startHtml: `
<section class="products">
  <div class="container">
    <h2 class="title">Menyu</h2>
    <img class="rasm" src="img/goshtli.jpg" alt="Go'shtli somsa">
    <h3>Go'shtli</h3>
    <p>12 000 so'm</p>
    <img class="rasm" src="img/qovoqli.jpg" alt="Qovoqli somsa">
    <h3>Qovoqli</h3>
    <p>8 000 so'm</p>
    <img class="rasm" src="img/kartoshkali.jpg" alt="Kartoshkali somsa">
    <h3>Kartoshkali</h3>
    <p>7 000 so'm</p>
  </div>
</section>`,
startCss: `
.products {

}

.title {

}

/* .cards va .card ni o'zing yoz */`,
boxes: ['.products', '.container', '.cards', '.card'],
kor: [
  { t: 'group', boxes: ['.card'], q: `Uchta kartochka bor. Har birining elementlarini alohida qutiga yig'.`, nega: `Uchta bir xil quti — uchta [[.card]].` },
  { t: 'group', boxes: ['.cards'], q: `Endi uchala kartochkani yonma-yon tizadigan ota quti kerak. Uchala kartochkani tanla (yorliqlarini bossang, butun quti tanlanadi). Sarlavha bu qutiga kirmaydi.`, nega: `Kartochkalarning otasi — [[.cards]]. «Menyu» sarlavhasi uning tashqarisida, tepasida turadi.` },
  { t: 'pick', q: `Kartochkalar orasidagi bo'shliq ([[gap]]) qaysi qutiga yoziladi?`, a: '.cards', cands: ['.container', '.cards', '.card'], xato: { '.container': `[[.container]]ning bolalari — sarlavha va [[.cards]]. Kartochkalarning bevosita otasi kim?` }, nega: `Gap ham, flex ham kartochkalarning otasiga — [[.cards]]ga yoziladi.` }
],
vazifa: `**HTML:** har 3 ta elementni [[.card]] qutisiga, so'ng uchala kartochkani [[.cards]] qutisiga o'ra. **CSS:** seksiyaga tepa va pastdan **36px** padding; sarlavha ostida **20px**; kartochkalar yonma-yon, oralari **16px**; har kartochkaning ichida **14px**.`,
hints: [`HTML: [[.cards]] ichida uchta [[.card]], har birida rasm, sarlavha, narx. CSS'da to'rtta bo'shliq: seksiya paddingi, sarlavha margini, kartochkalar gapi, kartochka paddingi.`, `[[.products]]: [[padding: 36px 0]]. [[.title]]: [[margin-bottom: 20px]]. [[.cards]]: [[display: flex]], [[gap: 16px]]. [[.card]]: [[padding: 14px]].`],
hintBox: ['.cards'],
nega: `Kartochkalar bo'limi doim ikki qavat quti: har element guruhi — [[.card]], ularning otasi — [[.cards]]. Sarlavha otaning tashqarisida qoladi.` });

L({ id: '5-4', bob: 5, nom: `Afzalliklar`,
base: CONT + `
.features{background:#fff7ed}
.icon{width:44px;height:44px;flex-shrink:0;border-radius:12px;background:#ea580c}`,
html: `
<section class="features">
  <div class="container">
    <div class="features-row">
      <div class="feature">
        <div class="icon"></div>
        <div class="feature-text">
          <h3>Tez yetkazish</h3>
          <p>20 daqiqada eshigingizda</p>
        </div>
      </div>
      <div class="feature">
        <div class="icon"></div>
        <div class="feature-text">
          <h3>Har kuni yangi</h3>
          <p>Ertalabki xamirdan</p>
        </div>
      </div>
    </div>
  </div>
</section>`,
css: `
.features {
  padding: 32px 0;
}

.features-row {
  display: flex;
  gap: 40px;
}

.feature {
  display: flex;
  align-items: center;
  gap: 12px;
}`,
startHtml: `
<section class="features">
  <div class="container">
    <div class="features-row">
      <div class="feature">
        <div class="icon"></div>
        <h3>Tez yetkazish</h3>
        <p>20 daqiqada eshigingizda</p>
      </div>
      <div class="feature">
        <div class="icon"></div>
        <h3>Har kuni yangi</h3>
        <p>Ertalabki xamirdan</p>
      </div>
    </div>
  </div>
</section>`,
startCss: `
.features {

}

.features-row {

}

.feature {

}`,
boxes: ['.features', '.container', '.features-row', '.feature', '.feature-text'],
kor: [
  { t: 'group', boxes: ['.feature-text'], q: `Har afzallikda chapda ikon, o'ngda sarlavha va matn ustma-ust turibdi. Ikkala afzallikda ham o'ngdagi matnlarni alohida qutiga yig'.`, nega: `Sarlavha va matn — [[.feature-text]]. Shunda ikon yonida ular bitta ustun bo'lib turadi.` },
  { t: 'pick', q: `Ikki afzallik yonma-yon turibdi. Bu flex qaysi qutiga yoziladi?`, a: '.features-row', mark: ['.feature'], cands: ['.container', '.features-row', '.feature'], nega: `Ikki [[.feature]]ning otasi — [[.features-row]].` },
  { t: 'pick', q: `Bitta afzallik ichida ikon va matn yonma-yon. Bu flex qaysi qutiga yoziladi?`, a: '.feature', mark: ['.feature:first-child .icon', '.feature:first-child .feature-text'], cands: ['.features-row', '.feature', '.feature-text'], nega: `Ikon va [[.feature-text]]ning otasi — [[.feature]]. Demak [[.feature]] bir vaqtda ham bola, ham ota.` }
],
vazifa: `**HTML:** har afzallikdagi sarlavha va matnni [[.feature-text]] qutisiga o'ra. **CSS:** seksiyaga tepa va pastdan **32px** padding; ikki afzallik yonma-yon, oralari **40px**; har birida ikon va matn yonma-yon, vertikal o'rtada, oralari **12px**.`,
hints: [`Flex ikki qavatda: [[.features-row]] ikki afzallikni tizadi, [[.feature]] esa o'z ichidagi ikon va matnni.`, `[[.features]]: [[padding: 32px 0]]. [[.features-row]]: [[display: flex]], [[gap: 40px]]. [[.feature]]: [[display: flex]], [[align-items: center]], [[gap: 12px]].`],
hintBox: ['.feature-text'],
nega: `Bitta quti bir vaqtda otasining bolasi va o'z bolalarining otasi bo'la oladi. [[.feature]] — [[.features-row]]ning flex bolasi, o'zi esa ikon va matn uchun flex ota.` });

L({ id: '5-5', bob: 5, nom: `Footer`,
base: CONT + '\n' + KIT.footer,
html: P.footer.html, css: P.footer.css,
startHtml: `
<footer class="footer">
  <div class="container">
    <a class="logo">Somsa.uz</a>
    <p>Har kuni 7:00 dan 22:00 gacha</p>
    <h3>Bo'limlar</h3>
    <a class="link">Taomlar</a>
    <a class="link">Narxlar</a>
    <h3>Aloqa</h3>
    <a class="link">Telegram</a>
    <a class="link">Instagram</a>
    <p class="copy">© 2026 Somsa.uz</p>
  </div>
</footer>`,
startCss: `
.footer {

}

.footer-cols {

}

.copy {

}`,
boxes: ['.footer', '.container', '.footer-cols', '.col'],
kor: [
  { t: 'group', boxes: ['.col'], q: `Footerda uchta ustun bor. Har ustunning elementlarini alohida qutiga yig'.`, nega: `Uchta ustun — uchta [[.col]].` },
  { t: 'group', boxes: ['.footer-cols'], q: `Endi uchala ustunni yonma-yon tizadigan ota kerak. Uchala ustunni tanla. Eng pastdagi yozuv bu qutiga kirmaydi.`, nega: `Ustunlarning otasi — [[.footer-cols]]. Pastki yozuv undan tashqarida, alohida turadi.` },
  { t: 'choice', zone: { mt: '.copy' }, q: `Ustunlar bilan pastki yozuv orasidagi qizil chiziqli bo'shliq nima?`, opts: PMG, a: 1, xato: [`Padding chiziqdan pastda, yozuvning ichida. Bu bo'shliq esa chiziqdan tepada — yozuvning tashqarisida.`, null, `[[.footer-cols]] va yozuv flex ichida emas.`], nega: `Ikki blok orasi — margin.` }
],
vazifa: `**HTML:** uchta ustunni [[.col]] qutilariga, so'ng uchalasini [[.footer-cols]] qutisiga o'ra. **CSS:** footer paddingi tepadan **32px**, pastdan **20px**; ustunlar ikki chetga yoyilgan; pastki yozuvning tepasida **24px** bo'shliq.`,
hints: [`HTML: [[.footer-cols]] ichida uchta [[.col]] (2 ta, 3 ta va 3 ta element). [[.copy]] [[.footer-cols]]dan tashqarida qoladi.`, `[[.footer]]: [[padding: 32px 0 20px]]. [[.footer-cols]]: [[display: flex]], [[justify-content: space-between]]. [[.copy]]: [[margin-top: 24px]].`],
hintBox: ['.footer-cols'],
nega: `Ustunlar ko'p bo'lsa ham qoida o'sha: har ustun — quti, ustunlarning otasi — flex quti. Unga kirmaydigan narsa tashqarida qoladi.` });

/* ================= 6-BOB: Ustun, o'rash, cho'zilish ================= */
L({ id: '6-1', bob: 6, nom: `Ustun`,
base: `
body{padding:24px;--brand:#4338ca}
.login{width:260px;padding:24px;background:#fff;border-radius:14px;border:1px solid #e5e7eb}
.avatar{width:72px;height:72px;border-radius:50%;object-fit:cover;object-position:50% 15%}`,
html: `
<div class="login">
  <img class="avatar" src="img/dilnoza.jpg" alt="Dilnoza">
  <h3>Dilnoza Karimova</h3>
  <p>Dizayner, Toshkent</p>
  <a class="btn">Profilni ko'rish</a>
</div>`,
css: `
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}`,
startCss: `
.login {
  
}`,
boxes: ['.login'],
kor: [
  { t: 'choice', zone: { gap: '.login' }, q: `Elementlar ustma-ust, oralari bir xil va hammasi o'rtada. Bloklar flex'siz ham ustma-ust turadi — unda bu yerda flex nega kerak?`, opts: [`Ustunda [[gap]] va [[align-items]] ishlashi uchun`, `Flex'siz bloklar yonma-yon turadi`, `Kerak emas`], a: 0, xato: [null, `Aksincha — bloklar flex'siz ham ustma-ust turadi.`, `Flex'siz [[gap]] ishlamaydi, elementlarni o'rtaga qo'yish ham qiyinlashadi.`], nega: `Flex ustun ham bo'la oladi: [[flex-direction: column]]. Shunda [[gap]] qatorlar orasiga ishlaydi.` },
  { t: 'choice', q: `[[flex-direction: column]] bo'lganda [[align-items: center]] elementlarni qaysi yo'nalishda o'rtaga qo'yadi?`, opts: [`Gorizontal — chap va o'ng chetdan teng`, `Vertikal — tepa va pastdan teng`], a: 0, xato: [null, `Ustunda o'qlar almashadi: vertikal yo'nalish endi [[justify-content]]ning ishi.`], nega: `Ustunda o'qlar almashadi: [[justify-content]] — vertikal, [[align-items]] — gorizontal.` }
],
vazifa: `Kartochka ichidagilar ustun bo'lib, gorizontal o'rtada tursin, oralari **10px**.`,
hints: [`Flex yana otaga — [[.login]]ga yoziladi. Faqat yo'nalishi ustun: [[flex-direction: column]].`, `[[.login]]: [[display: flex]], [[flex-direction: column]], [[align-items: center]], [[gap: 10px]].`],
hintBox: ['.login'],
nega: `[[flex-direction: column]] — flex'ning ustun rejimi. [[gap]] ustma-ust elementlar orasini beradi, [[align-items]] esa ularni gorizontal tekislaydi.` });

L({ id: '6-2', bob: 6, nom: `Sidebar va kontent`,
base: `
body{padding:24px}
.layout{min-height:180px}
.sidebar{display:flex;flex-direction:column;gap:12px;padding:18px;background:#1c1917;border-radius:12px}
.sidebar .link{color:#e7e5e4}
.content{padding:20px;background:#fff;border-radius:12px;border:1px solid #e7e5e4}
.content p{margin-top:6px}`,
html: `
<div class="layout">
  <nav class="sidebar">
    <a class="link">Bosh sahifa</a>
    <a class="link">Buyurtmalar</a>
    <a class="link">Sozlamalar</a>
  </nav>
  <main class="content">
    <h2>Buyurtmalar</h2>
    <p>Bugun 12 ta yangi buyurtma keldi.</p>
  </main>
</div>`,
css: `
.layout {
  display: flex;
  gap: 16px;
}

.sidebar {
  width: 160px;
}

.content {
  flex: 1;
}`,
startCss: `
.layout {
  
}

.sidebar {
  
}

.content {
  
}`,
boxes: ['.layout', '.sidebar', '.content'],
kor: [
  { t: 'pick', q: `Chap ustun tor va kengligi o'zgarmaydi, o'ngdagi esa qolgan hamma joyni egallagan. Qaysi quti cho'zilgan?`, a: '.content', xato: { '.sidebar': `Sidebar kengligi o'zgarmas — 160px. Qolgan joyni boshqa quti egallaydi.`, '.layout': `[[.layout]] — ota. Bo'sh joyni uning bolalaridan biri egallaydi.` }, nega: `Qolgan joyni [[.content]] egallaydi.` },
  { t: 'choice', q: `Buning uchun [[.content]]ga nima yoziladi?`, opts: [`[[width: 100%]]`, `[[flex: 1]]`, `[[margin: auto]]`], a: 1, xato: [`100% otaning butun kengligini oladi — sidebar bilan birga sig'maydi.`, null, `[[margin: auto]] qutini itaradi, lekin kengaytirmaydi.`], nega: `[[flex: 1]] — «qolgan bo'sh joyni ol» degani.` }
],
vazifa: `Sidebar va kontent yonma-yon, oralari **16px**. Sidebar kengligi **160px**, kontent qolgan hamma joyni egallasin.`,
hints: [`Uch quti, uch ish: [[.layout]] — yonma-yon tizish, [[.sidebar]] — o'zgarmas kenglik, [[.content]] — qolgan joy.`, `[[.layout]]: [[display: flex]], [[gap: 16px]]. [[.sidebar]]: [[width: 160px]]. [[.content]]: [[flex: 1]].`],
hintBox: ['.sidebar', '.content'],
nega: `[[flex: 1]] — flex bolasi otadagi bo'sh joyni egallaydi. Admin panel, pochta, chat — hammasida shu «sidebar va kontent» tuzilishi bor.` });

L({ id: '6-3', bob: 6, nom: `Keyingi qatorga`,
base: `
body{padding:24px}
.tour{width:180px;padding:12px;background:#fff;border-radius:12px;border:1px solid #e5e7eb}
.tour h3{margin:10px 0 2px}`,
html: `
<div class="tours">
  <div class="tour">
    <img class="rasm" src="img/tog.jpg" alt="Tog'">
    <h3>Chimyon</h3>
    <p>2 kunlik sayohat</p>
  </div>
  <div class="tour">
    <img class="rasm" src="img/kol.jpg" alt="Ko'l">
    <h3>Chorvoq</h3>
    <p>1 kunlik sayohat</p>
  </div>
  <div class="tour">
    <img class="rasm" src="img/qoya.jpg" alt="Qoya">
    <h3>Beldersoy</h3>
    <p>3 kunlik sayohat</p>
  </div>
  <div class="tour">
    <img class="rasm" src="img/soqmoq.jpg" alt="So'qmoq">
    <h3>Zomin</h3>
    <p>2 kunlik sayohat</p>
  </div>
</div>`,
css: `
.tours {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}`,
startCss: `
.tours {
  display: flex;
  gap: 16px;
}`,
boxes: ['.tours', '.tour'],
kor: [
  { t: 'choice', q: `Maqsadda to'rtinchi kartochka ikkinchi qatorga tushgan. [[flex-wrap]]siz nima bo'lardi?`, opts: [`Hammasi bitta qatorda siqilib qoladi`, `To'rtinchisi o'zi pastga tushadi`, `Kartochkalar yo'qolib qoladi`], a: 0, xato: [null, `Flex hammani bitta qatorga sig'dirishga urinadi — kartochkalarni siqib bo'lsa ham.`, `Ular joyida qoladi, faqat torayib ketadi.`], nega: `Flex bolalarni bitta qatorga siqadi. Sig'maganini keyingi qatorga o'tkazish uchun [[flex-wrap: wrap]] kerak.` },
  { t: 'choice', q: `Qatorlar orasidagi bo'shliq ham 16px. Uni nima beradi?`, opts: [`O'sha [[gap: 16px]] — u qatorlar orasiga ham ishlaydi`, `Har bir kartochkaga [[margin-bottom]]`, `[[padding]]`], a: 0, xato: [null, `Unda oxirgi qator tagida ham ortiqcha bo'shliq qoladi. Osonroq yo'l bor.`, `Padding qutining ichida bo'ladi, qutilar orasida emas.`], nega: `[[gap]]ga bitta qiymat yozilsa, ustunlar orasiga ham, qatorlar orasiga ham ishlaydi.` }
],
vazifa: `Kartochkalar siqilib qolmasin: sig'maganlari keyingi qatorga o'tsin. Qatorlar orasi ham **16px**.`,
hints: [`Flex tayyor. Yetishmayotgani — sig'magan bolalarni keyingi qatorga o'tkazish.`, `[[.tours]]ga [[flex-wrap: wrap]] qo'sh.`],
hintBox: ['.tours'],
nega: `[[flex-wrap: wrap]] — kartochkalar, galereya va teglar ro'yxati uchun. Ekran torayganda elementlar siqilmaydi, pastga tushadi.` });

L({ id: '6-4', bob: 6, nom: `Tugmani pastga`,
base: `
body{padding:24px;--brand:#ea580c}
.cards{display:flex;gap:16px}
.card{flex:1;padding:14px;background:#fff;border-radius:14px;border:1px solid #e7e5e4}
.card h3{margin:10px 0 2px}
.card p{margin-bottom:14px}
.card .btn{text-align:center}`,
html: `
<div class="cards">
  <div class="card">
    <img class="rasm" src="img/goshtli.jpg" alt="Go'shtli somsa">
    <h3>Go'shtli</h3>
    <p>Mol go'shti va piyoz</p>
    <a class="btn">Savatga</a>
  </div>
  <div class="card">
    <img class="rasm" src="img/qovoqli.jpg" alt="Qovoqli somsa">
    <h3>Qovoqli</h3>
    <p>Qovoq, piyoz va ozgina qalampir — kuz faslining eng sevimli somsasi</p>
    <a class="btn">Savatga</a>
  </div>
  <div class="card">
    <img class="rasm" src="img/kartoshkali.jpg" alt="Kartoshkali somsa">
    <h3>Kartoshkali</h3>
    <p>Kartoshka va ko'kat</p>
    <a class="btn">Savatga</a>
  </div>
</div>`,
css: `
.card {
  display: flex;
  flex-direction: column;
}

.btn {
  margin-top: auto;
}`,
startCss: `
.card {
  
}

.btn {
  
}`,
boxes: ['.cards', '.card'],
kor: [
  { t: 'choice', q: `Kartochkalardagi matn har xil uzunlikda, lekin tugmalar bir chiziqda, eng pastda. Bunga qanday erishiladi?`, opts: [`Har bir tugmaga alohida [[margin-top]], px bilan`, `Kartochkani ustun-flex qilib, tugmaga [[margin-top: auto]]`, `Matnlarni bir xil uzunlikda yozib`], a: 1, xato: [`Matn o'zgarsa, px bilan yozilgan margin buziladi. Bo'sh joyni o'zi o'lchaydigan usul kerak.`, null, `Real saytda matnni dizayn uchun qisqartirib bo'lmaydi.`], nega: `[[margin-top: auto]] flex ichidagi bo'sh joyning hammasini tugmaning tepasiga qo'yadi — tugma pastga itariladi.` },
  { t: 'pick', q: `[[flex-direction: column]] qaysi qutiga yoziladi?`, a: '.card', cands: ['.cards', '.card', '.btn'], mark: ['.card:first-child h3', '.card:first-child .btn'], xato: { '.cards': `[[.cards]] kartochkalarni yonma-yon tizadi — u qator bo'lib qoladi. Tugmaning otasi kim?`, '.btn': `Tugma — bola. Uni otasi joylashtiradi.` }, nega: `Tugmaning otasi — [[.card]]. Ustun-flex unga yoziladi.` }
],
vazifa: `Har bir kartochka ichi ustun-flex bo'lsin, tugma esa eng pastga itarilsin — matn uzunligidan qat'i nazar.`,
hints: [`Ikki qadam: [[.card]] ustun-flex bo'ladi, keyin tugma [[margin-top: auto]] bilan pastga itariladi.`, `[[.card]]: [[display: flex]], [[flex-direction: column]]. [[.btn]]: [[margin-top: auto]].`],
hintBox: ['.card'],
nega: `[[margin-top: auto]] — bo'sh joyni yutib yuboradigan margin. Tariflar, mahsulot kartochkalari va blog postlarida tugmalar shu usul bilan bir chiziqqa keltiriladi.` });

L({ id: '6-5', bob: 6, nom: `O'ng chetga itar`,
base: `
body{padding:24px 0;--brand:#4338ca}
.navbar{background:#fff;padding:14px 24px;border-bottom:1px solid #e5e7eb}`,
html: `
<nav class="navbar">
  <a class="logo">Kitobxon</a>
  <a class="link">Katalog</a>
  <a class="link">Yangi</a>
  <a class="link">Chegirmalar</a>
  <a class="btn">Kirish</a>
</nav>`,
css: `
.navbar {
  display: flex;
  align-items: center;
  gap: 24px;
}

.btn {
  margin-left: auto;
}`,
startCss: `
.navbar {
  display: flex;
  align-items: center;
  gap: 24px;
}

.btn {
  
}`,
boxes: ['.navbar'],
kor: [
  { t: 'choice', q: `Logo va linklar chapda, faqat tugma o'ng chetda. [[.navbar]]ga [[justify-content: space-between]] yozilsa shunday chiqadimi?`, opts: [`Yo'q — u beshala bolani butun kenglik bo'ylab teng yoyib yuboradi`, `Ha, xuddi shunday chiqadi`], a: 0, xato: [null, `[[space-between]] hamma bolalar orasini teng qiladi — linklar ham chapdan uzoqlashib ketadi.`], nega: `[[space-between]] hammani yoyadi. Faqat bittasini chetga itarish uchun boshqa usul kerak.` },
  { t: 'choice', zone: { ml: '.btn' }, q: `Qizil chiziqli joy — tugmaning chap tomonidagi bo'shliq. U nima?`, opts: [`[[padding]]`, `[[margin-left: auto]]`, `[[gap]]`], a: 1, xato: [`Padding tugmaning ichida bo'lardi va rangga bo'yalardi.`, null, `Gap hamma bolalar orasida bir xil — 24px. Bu esa ancha katta.`], nega: `[[margin-left: auto]] chap tomondagi hamma bo'sh joyni egallab, tugmani o'ngga itaradi.` }
],
vazifa: `Tugmani navbarning o'ng chetiga itar. Qolgan elementlar joyida qolsin.`,
hints: [`Butun navbarni emas, faqat bitta elementni itarish kerak. Bo'sh joyni tugmaning chap tomoniga qo'y.`, `[[.btn]]ga [[margin-left: auto]] yoz.`],
hintBox: ['.btn'],
nega: `[[margin-left: auto]] — flex'dagi eng foydali usullardan biri: bitta elementni o'ng chetga itaradi, qolganlari joyida qoladi.` });

/* ================= 7-BOB: Final — Somsa.uz sahifasi ================= */
const ORDER = ['header', 'hero', 'products', 'footer'];
const ALLBASE = 'body{background:#fff}\n' + ORDER.map(k => KIT[k]).join('\n');
const FIN = {
  header: {
    nom: `Sahifa: header`,
    boxes: ['.header', '.container', '.navbar', '.menu'],
    kor: [
      { t: 'group', boxes: ['.menu'], q: `Oxirgi bob: butun sahifani o'zing yig'asan. Headerdan boshlaymiz. Menyuga kiradigan elementlarni qutiga yig'.`, nega: `[[.menu]] tayyor.` },
      { t: 'group', boxes: ['.navbar'], q: `Endi logo, menyu va tugmaning otasini belgila.`, nega: `[[.navbar]] tayyor.` },
      { t: 'choice', q: `Bu safar [[.container]] ham yo'q — uni ham o'zing ochasan. U qayerda turadi?`, opts: [`[[.header]]ning ichida, [[.navbar]]ning tashqarisida`, `[[.navbar]]ning ichida`, `[[.header]]ning tashqarisida`], a: 0, xato: [null, `Unda navbar to'liq kenglikda qolib, logo va tugma ekran chetiga yopishadi.`, `Unda headerning foni ham torayib qoladi.`], nega: `Tartib: fon, uning ichida container, uning ichida navbar.` }
    ],
    vazifa: `Faqat [[<header class="header">]] va besh element berilgan. **HTML:** [[.container]], uning ichida [[.navbar]], linklar uchun [[.menu]] och. **CSS:** container **560px**, o'rtada; navbar ikki chetga yoyilgan, vertikal o'rtada; linklar orasi **20px**.`,
    hints: [`To'rt qavat: [[.header]], ichida [[.container]], ichida [[.navbar]], ichida logo, [[.menu]] va tugma.`, `CSS'da uchta blok: [[.container]] (max-width, margin), [[.navbar]] (flex, space-between, center), [[.menu]] (flex, gap).`],
    hintBox: ['.container', '.navbar', '.menu'],
    nega: `Header tayyor. Bu yerda yozgan [[.container]] klassing keyingi hamma seksiyada qayta ishlatiladi — uni boshqa yozmaysan.`,
    cmt: `/* 1-qism: header. .container, .navbar, .menu */`
  },
  hero: {
    nom: `Sahifa: hero`,
    boxes: ['.hero', '.hero-row', '.hero-text'],
    kor: [
      { t: 'group', boxes: ['.hero-text'], q: `Header tayyor. Endi hero: chapda matnlar ustuni, o'ngda rasm. Matnlar ustunini qutiga yig'.`, nega: `[[.hero-text]] tayyor.` },
      { t: 'choice', q: `Hero'ga container kerakmi? Uning CSS'ini qayta yozasanmi?`, opts: [`Kerak, lekin CSS'ini qayta yozmayman — klass tayyor`, `Kerak va CSS'ini qaytadan yozaman`, `Kerak emas`], a: 0, xato: [null, `Klass bir marta yoziladi. HTML'da [[class="container"]] deb yozsang, o'sha stil ishlayveradi.`, `Containersiz hero matni header bilan bir chiziqda turmaydi.`], nega: `Klassning foydasi shu: bir marta yoz, hamma joyda ishlat.` }
    ],
    vazifa: `Pastga hero seksiyasi qo'shildi. **HTML:** uning ichida [[.container]], keyin [[.hero-row]] och; matnlarni [[.hero-text]]ga o'ra, rasm [[.hero-row]]ning ikkinchi bolasi bo'lsin. **CSS:** seksiyaga tepa va pastdan **40px** padding; ustun va rasm yonma-yon, vertikal o'rtada, oralari **32px**.`,
    hints: [`Tuzilish: [[.hero]], ichida [[.container]], ichida [[.hero-row]], uning ikki bolasi — [[.hero-text]] (3 ta element) va [[.hero-img]].`, `[[.hero]]: [[padding: 40px 0]]. [[.hero-row]]: [[display: flex]], [[align-items: center]], [[gap: 32px]].`],
    hintBox: ['.hero-row', '.hero-text'],
    nega: `Ikkinchi seksiya ham o'sha qolipda: fonli quti, container, tartib beruvchi flex ota.`,
    cmt: `/* 2-qism: hero. .hero, .hero-row */`
  },
  products: {
    nom: `Sahifa: menyu`,
    boxes: ['.products', '.cards', '.card'],
    kor: [
      { t: 'group', boxes: ['.card'], q: `Uchinchi seksiya — kartochkalar. Har kartochkaning elementlarini alohida qutiga yig'.`, nega: `Uchta [[.card]] tayyor.` },
      { t: 'group', boxes: ['.cards'], q: `Endi kartochkalarning otasini belgila. «Menyu» sarlavhasi unga kirmaydi.`, nega: `[[.cards]] tayyor.` }
    ],
    vazifa: `Pastga kartochkalar seksiyasi qo'shildi. **HTML:** [[.container]] och; har 3 ta elementni [[.card]]ga, uchala kartochkani [[.cards]]ga o'ra. **CSS:** seksiyaga tepa va pastdan **36px** padding; sarlavha ostida **20px**; kartochkalar yonma-yon, oralari **16px**; har birining ichida **14px**.`,
    hints: [`Tuzilish: [[.products]], ichida [[.container]], ichida sarlavha va [[.cards]]; [[.cards]] ichida uchta [[.card]].`, `[[.products]]: [[padding: 36px 0]]. [[.title]]: [[margin-bottom: 20px]]. [[.cards]]: [[display: flex]], [[gap: 16px]]. [[.card]]: [[padding: 14px]].`],
    hintBox: ['.cards'],
    nega: `Uch seksiya, uchalasida ham bir xil container — shuning uchun logo, sarlavha va birinchi kartochka bir chiziqda turibdi.`,
    cmt: `/* 3-qism: menyu. .products, .title, .cards, .card */`
  },
  footer: {
    nom: `Sahifa: footer`,
    boxes: ['.footer', '.footer-cols', '.col'],
    kor: [
      { t: 'group', boxes: ['.col'], q: `Oxirgi seksiya — footer. Uchta ustunni alohida qutilarga yig'.`, nega: `Uchta [[.col]] tayyor.` },
      { t: 'group', boxes: ['.footer-cols'], q: `Ustunlarning otasini belgila. Eng pastdagi yozuv unga kirmaydi.`, nega: `[[.footer-cols]] tayyor. Kodini yozsang, sahifa bitadi.` }
    ],
    vazifa: `Oxirgi qism — footer. **HTML:** [[.container]] och; ustunlarni [[.col]] qutilariga, uchalasini [[.footer-cols]]ga o'ra; [[.copy]] tashqarida qolsin. **CSS:** footer paddingi tepadan **32px**, pastdan **20px**; ustunlar ikki chetga yoyilgan; [[.copy]] tepasida **24px** bo'shliq.`,
    hints: [`Tuzilish: [[.footer]], ichida [[.container]], ichida [[.footer-cols]] (uchta [[.col]]) va undan keyin [[.copy]].`, `[[.footer]]: [[padding: 32px 0 20px]]. [[.footer-cols]]: [[display: flex]], [[justify-content: space-between]]. [[.copy]]: [[margin-top: 24px]].`],
    hintBox: ['.footer-cols'],
    nega: `Butun sahifani bo'sh joydan o'zing yig'ding: to'rt seksiya, har birida fon qutisi, container va flex ota. Endi istalgan saytga qarab, uni qutilarga bo'la olasan.`,
    cmt: `/* 4-qism: footer. .footer, .footer-cols, .copy */`
  }
};
ORDER.forEach((k, n) => {
  const prev = ORDER.slice(0, n), f = FIN[k];
  const prevHtml = prev.map(p => P[p].html).join('\n'), prevCss = prev.map(p => P[p].css).join('\n\n');
  L(Object.assign({}, f, {
    id: '7-' + (n + 1), bob: 7, base: ALLBASE,
    html: (prevHtml ? prevHtml + '\n' : '') + P[k].html,
    css: (prevCss ? prevCss + '\n\n' : '') + P[k].css,
    startHtml: (prevHtml ? prevHtml + '\n\n' : '') + P[k].flat,
    startCss: (prevCss ? prevCss + '\n\n' : '') + f.cmt + '\n',
    from: n ? '7-' + n : null, addHtml: P[k].flat + '\n', addCss: f.cmt + '\n',
    solHtml: P[k].html, solCss: P[k].css
  }));
});

/* ================= 8-BOB: Imtihon ================= */
const EX = `/* CSS'ni o'zing yoz */\n`;
L({ id: '8-1', bob: 8, imtihon: true, nom: `Profil qatori`,
base: `
body{padding:24px;--brand:#4338ca}
.user{background:#fff;border:1px solid #e5e7eb;border-radius:14px}
.avatar{width:52px;height:52px;border-radius:50%;object-fit:cover;object-position:50% 15%}`,
html: `
<div class="user">
  <img class="avatar" src="img/dilnoza.jpg" alt="Dilnoza">
  <div class="user-info">
    <h3>Dilnoza Karimova</h3>
    <p>@dilnoza.design</p>
  </div>
  <a class="btn">Kuzatish</a>
</div>`,
css: `
.user {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
}

.btn {
  margin-left: auto;
}`,
startHtml: `
<img class="avatar" src="img/dilnoza.jpg" alt="Dilnoza">
<h3>Dilnoza Karimova</h3>
<p>@dilnoza.design</p>
<a class="btn">Kuzatish</a>`,
startCss: EX, kor: [],
vazifa: `Profil qatorini noldan yig'. **Klasslar:** [[.user]], [[.user-info]]. Qutining ichida **16px**, elementlar orasi **14px**, hammasi vertikal o'rtada, tugma o'ng chetda.`,
hints: [`.user ichida avatar, .user-info va tugma.`, `.user: flex, align-items center, gap 14px, padding 16px; .btn: margin-left auto.`],
nega: `Birinchi topshiriq tayyor: quti, flex, gap, padding va [[margin-left: auto]] — hammasi bitta qatorda.` });

L({ id: '8-2', bob: 8, imtihon: true, nom: `Tariflar`,
base: `
body{padding:24px;--brand:#ea580c}
.plan{background:#fff;border:1px solid #e7e5e4;border-radius:14px}
.plan h3{font-size:17px}
.price{font-size:20px;font-weight:800;color:#111827;margin:6px 0 10px}
.plan p:not(.price){margin-bottom:16px}
.plan .btn{text-align:center}`,
html: `
<div class="plans">
  <div class="plan">
    <h3>Start</h3>
    <p class="price">99 000 so'm</p>
    <p>Haftasiga 2 ta dars</p>
    <a class="btn">Tanlash</a>
  </div>
  <div class="plan">
    <h3>Pro</h3>
    <p class="price">199 000 so'm</p>
    <p>Haftasiga 3 ta dars, uy vazifasini tekshirish va har oy kichik loyiha</p>
    <a class="btn">Tanlash</a>
  </div>
  <div class="plan">
    <h3>Max</h3>
    <p class="price">299 000 so'm</p>
    <p>Har kuni dars va shaxsiy ustoz</p>
    <a class="btn">Tanlash</a>
  </div>
</div>`,
css: `
.plans {
  display: flex;
  gap: 16px;
}

.plan {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 18px;
}

.btn {
  margin-top: auto;
}`,
startHtml: `
<h3>Start</h3>
<p class="price">99 000 so'm</p>
<p>Haftasiga 2 ta dars</p>
<a class="btn">Tanlash</a>
<h3>Pro</h3>
<p class="price">199 000 so'm</p>
<p>Haftasiga 3 ta dars, uy vazifasini tekshirish va har oy kichik loyiha</p>
<a class="btn">Tanlash</a>
<h3>Max</h3>
<p class="price">299 000 so'm</p>
<p>Har kuni dars va shaxsiy ustoz</p>
<a class="btn">Tanlash</a>`,
startCss: EX, kor: [],
vazifa: `Uchta tarif kartochkasini yig'. **Klasslar:** [[.plans]], [[.plan]]. Kartochkalar yonma-yon, teng kenglikda, oralari **16px**; har birining ichida **18px**; tugmalar eng pastda, bir chiziqda.`,
hints: [`.plans ichida uchta .plan.`, `.plans: flex, gap 16px; .plan: flex 1, flex column, padding 18px; .btn: margin-top auto.`],
nega: `Teng kenglik ([[flex: 1]]), ustun-flex va [[margin-top: auto]] birga ishladi.` });

L({ id: '8-3', bob: 8, imtihon: true, nom: `Banner`,
base: `
.banner{background:#ecfdf5;--brand:#047857}
.banner p{margin:8px 0 16px}
.banner-img{width:200px;height:150px;flex-shrink:0;object-fit:cover;border-radius:14px}`,
html: `
<section class="banner">
  <div class="container">
    <div class="banner-row">
      <div class="banner-text">
        <h2>Tog'larga sayohat</h2>
        <p>Har shanba Chimyonga guruh bo'lib chiqamiz.</p>
        <a class="btn">Joy band qilish</a>
      </div>
      <img class="banner-img" src="img/kol.jpg" alt="Ko'l">
    </div>
  </div>
</section>`,
css: `
.banner {
  padding: 40px 0;
}

.container {
  max-width: 560px;
  margin: 0 auto;
  padding: 0 20px;
}

.banner-row {
  display: flex;
  align-items: center;
  gap: 28px;
}`,
startHtml: `
<section class="banner">
  <h2>Tog'larga sayohat</h2>
  <p>Har shanba Chimyonga guruh bo'lib chiqamiz.</p>
  <a class="btn">Joy band qilish</a>
  <img class="banner-img" src="img/kol.jpg" alt="Ko'l">
</section>`,
startCss: EX, kor: [],
vazifa: `Bannerni yig'. **Klasslar:** [[.container]], [[.banner-row]], [[.banner-text]] ([[.banner]] tayyor). Banner tepa va pastdan **40px**; container **560px**, o'rtada, yonlardan **20px**; matn va rasm yonma-yon, vertikal o'rtada, oralari **28px**.`,
hints: [`.banner > .container > .banner-row > (.banner-text, rasm).`, `.banner: padding 40px 0; .container: max-width 560px, margin 0 auto, padding 0 20px; .banner-row: flex, center, gap 28px.`],
nega: `Fon qutisi, container va ikki ustunli qator — saytning eng ko'p uchraydigan bo'lagi.` });

L({ id: '8-4', bob: 8, imtihon: true, nom: `Galereya`,
base: `
.gallery{background:#fff}
.photo{width:176px;height:120px;object-fit:cover;border-radius:10px}`,
html: `
<section class="gallery">
  <h2 class="title">Sayohat kundaligi</h2>
  <div class="photos">
    <img class="photo" src="img/tog.jpg" alt="Tog' yo'li">
    <img class="photo" src="img/kol.jpg" alt="Ko'l">
    <img class="photo" src="img/qoya.jpg" alt="Qoyalar">
    <img class="photo" src="img/soqmoq.jpg" alt="So'qmoq">
    <img class="photo" src="img/somsa.jpg" alt="Somsa">
    <img class="photo" src="img/kartoshkali.jpg" alt="Tushlik">
  </div>
</section>`,
css: `
.gallery {
  padding: 28px;
}

.title {
  margin-bottom: 16px;
}

.photos {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}`,
startHtml: `
<section class="gallery">
  <h2 class="title">Sayohat kundaligi</h2>
  <img class="photo" src="img/tog.jpg" alt="Tog' yo'li">
  <img class="photo" src="img/kol.jpg" alt="Ko'l">
  <img class="photo" src="img/qoya.jpg" alt="Qoyalar">
  <img class="photo" src="img/soqmoq.jpg" alt="So'qmoq">
  <img class="photo" src="img/somsa.jpg" alt="Somsa">
  <img class="photo" src="img/kartoshkali.jpg" alt="Tushlik">
</section>`,
startCss: EX, kor: [],
vazifa: `Galereyani yig'. **Klass:** [[.photos]] ([[.gallery]] va [[.title]] tayyor). Seksiya ichida **28px**, sarlavha ostida **16px**, rasmlar oralari **12px**, sig'maganlari keyingi qatorga o'tsin.`,
hints: [`Rasmlarni .photos qutisiga o'ra.`, `.gallery: padding 28px; .title: margin-bottom 16px; .photos: flex, wrap, gap 12px.`],
nega: `[[flex-wrap]] bilan galereya istalgan ekranga moslashadi.` });

L({ id: '8-5', bob: 8, imtihon: true, nom: `Kabinet`,
base: `
body{--brand:#4338ca}
.layout{min-height:220px}
.sidebar{background:#1e1b4b}
.sidebar .logo{color:#c7d2fe}
.sidebar .link{color:#e0e7ff}
.content{background:#fff}
.content p{margin-top:6px}`,
html: `
<div class="layout">
  <nav class="sidebar">
    <a class="logo">Kitobxon</a>
    <a class="link">Kitoblarim</a>
    <a class="link">Sevimlilar</a>
    <a class="link">Sozlamalar</a>
  </nav>
  <main class="content">
    <h2>Xush kelibsiz, Dilnoza!</h2>
    <p>Bu hafta 2 ta kitob o'qidingiz.</p>
  </main>
</div>`,
css: `
.layout {
  display: flex;
}

.sidebar {
  width: 170px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
}

.content {
  flex: 1;
  padding: 24px;
}`,
startHtml: `
<a class="logo">Kitobxon</a>
<a class="link">Kitoblarim</a>
<a class="link">Sevimlilar</a>
<a class="link">Sozlamalar</a>
<h2>Xush kelibsiz, Dilnoza!</h2>
<p>Bu hafta 2 ta kitob o'qidingiz.</p>`,
startCss: EX, kor: [],
vazifa: `Kabinet sahifasini yig'. **Klasslar:** [[.layout]], [[.sidebar]], [[.content]]. Sidebar **170px**, ichida **20px**, elementlari ustun bo'lib oralari **12px**; kontent qolgan joyni egallasin, ichida **24px**.`,
hints: [`.layout ichida .sidebar (logo, 3 link) va .content (h2, p).`, `.layout: flex; .sidebar: width 170px, flex column, gap 12px, padding 20px; .content: flex 1, padding 24px.`],
nega: `Imtihon tugadi. Bo'sh sahifadan to'liq tuzilishni o'zing qurding — endi istalgan dizaynni qutilarga bo'lib, kodga o'gira olasan.` });


/* Sertifikat va hisobot sozlamalari: markaz nomini shu yerda o'zgartir. */
const config = { markaz: 'ProTeach Academy', sayt: 'https://quti-ustasi.netlify.app', natijaUrl: '/api/natija' };

window.QU = {
  atoms, levels, imgs, config,
  bobs: [
    { n: 1, nom: `Quti ichida quti`, izoh: `Birga turgan elementlarni topib, bitta div'ga solish.` },
    { n: 2, nom: `Flex kimga yoziladi`, izoh: `Yonma-yon turganlarning otasini topish.` },
    { n: 3, nom: `Padding, margin, gap`, izoh: `Bo'shliq ichidami, orasidami yoki tashqarisidami.` },
    { n: 4, nom: `Container`, izoh: `Fon to'liq kenglikda, kontent o'rtada.` },
    { n: 5, nom: `To'liq seksiyalar`, izoh: `Header, hero, kartochkalar va footerni HTML va CSS bilan yig'ish.` },
    { n: 6, nom: `Ustun, o'rash, cho'zilish`, izoh: `flex-direction: column, flex: 1, flex-wrap va margin: auto.` },
    { n: 7, nom: `Final: butun sahifa`, izoh: `Somsa.uz sahifasini bo'sh joydan, to'rt qadamda qurish.` },
    { n: 8, nom: `Imtihon`, izoh: `Ko'r bosqichi va podskazkasiz 5 ta topshiriq. O'tsang, sertifikat olasan.` }
  ]
};
})();
