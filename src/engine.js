/* Quti Ustasi — dvigatel. Bolalar faqat HTML/CSS yozadi; bu fayl tekshiruv, podskazka va progressni boshqaradi. */
(function () {
'use strict';
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const W = 640, TOL = 1.6, KEY = 'quti-ustasi-v1';
const LV = window.QU.levels, BOBS = window.QU.bobs, ATOMS = window.QU.atoms, IMGS = window.QU.imgs || {};
const CFG = Object.assign({ markaz: '', sayt: '' }, window.QU.config || {});
const realImg = s => String(s).replace(/img\/([\w-]+\.(?:jpg|png|webp))/g, (m, n) => IMGS[n] || m);
const OPEN = /[?&#]ochiq\b/.test(location.search + location.hash);
const COLORS = ['#ff3d6e', '#2f7dff', '#12a877', '#b25cff', '#ff8a1f', '#0aa5c2'];
const OUTLINE = 'body *{outline:1.5px dashed rgba(255,45,110,.9)!important;outline-offset:-1px}';

/* ---------- progress ---------- */
let S = { done: {}, code: {}, pass: {}, kor: {}, stats: {}, name: '', guruh: '', uid: '', sent: {}, outbox: [] };
try { const r = localStorage.getItem(KEY); if (r) { const o = JSON.parse(r); for (const k in S) if (o[k]) S[k] = o[k]; } } catch (e) { /* saqlash yo'q muhit */ }
if (!S.uid) S.uid = Math.random().toString(36).slice(2, 10);
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* xotirada qoladi */ } }
const unlocked = i => OPEN || i === 0 || !!S.done[LV[i - 1].id];
const totalStars = () => LV.reduce((a, l) => a + ((S.done[l.id] || {}).stars || 0), 0);
const ST = id => S.stats[id] || (S.stats[id] = { h: 0, k: 0, c: 0, e: {}, t: 0 });
const examLv = () => LV.filter(l => l.imtihon);
const examDone = () => examLv().length > 0 && examLv().every(l => S.done[l.id]);
const fmtDate = d => [d.getDate(), d.getMonth() + 1].map(x => String(x).padStart(2, '0')).join('.') + '.' + d.getFullYear();
const dur = s => { const m = Math.max(1, Math.round(s / 60)); return m < 60 ? m + ' daqiqa' : Math.floor(m / 60) + ' soat ' + (m % 60) + ' daqiqa'; };
const starStr = n => '★'.repeat(n) + '<s>' + '★'.repeat(3 - n) + '</s>';

function startCode(l) {
  if (l.from && S.pass[l.from]) {
    const p = S.pass[l.from];
    return { html: p.html.replace(/\s+$/, '') + '\n\n' + l.addHtml, css: p.css.replace(/\s+$/, '') + '\n\n' + l.addCss };
  }
  return { html: l.startHtml != null ? l.startHtml : l.html, css: l.startCss != null ? l.startCss : (l.css || '') };
}

/* ---------- preview ---------- */
function Pv(root) {
  const wrap = $('.pv-wrap', root), sizer = $('.pv-sizer', root), stage = $('.pv-stage', root), ifr = $('iframe', root), ov = $('.pv-ov', root);
  let doc = null, h = 120;
  const o = {
    ov,
    get doc() { return doc; },
    get h() { return h; },
    init(l) {
      doc = ifr.contentDocument; doc.open();
      doc.write('<!DOCTYPE html><html><head><meta charset="utf-8"><style>' + ATOMS + '\n' + realImg(l.base || '') + '</style><style id="u"></style><style id="x"></style></head><body></body></html>');
      doc.close();
    },
    set(html, css, minH) { doc.getElementById('u').textContent = css; doc.body.innerHTML = realImg(html); o.size(minH); },
    size(minH) {
      ifr.style.height = '20px';
      h = Math.max(doc.documentElement.scrollHeight, minH || 0, 60);
      ifr.style.height = h + 'px'; stage.style.height = h + 'px'; o.fit();
    },
    fit() {
      const s = Math.min(1.25, wrap.clientWidth / W) || 1;
      stage.style.transform = 'scale(' + s + ')'; sizer.style.width = W * s + 'px'; sizer.style.height = h * s + 'px';
    },
    outline(on) { doc.getElementById('x').textContent = on ? OUTLINE : ''; }
  };
  return o;
}
function rbox(r, cls) {
  const d = el('div', cls);
  d.style.left = r.left + 'px'; d.style.top = r.top + 'px'; d.style.width = r.width + 'px'; d.style.height = r.height + 'px';
  return d;
}
const ebox = (e, cls) => rbox(e.getBoundingClientRect(), cls);

function zoneRects(z, doc) {
  const k = Object.keys(z)[0], e = $(z[k], doc); if (!e) return [];
  const r = e.getBoundingClientRect(), c = doc.defaultView.getComputedStyle(e), p = s => parseFloat(c[s]) || 0, out = [];
  if (k === 'pad') {
    const t = p('paddingTop'), ri = p('paddingRight'), b = p('paddingBottom'), l = p('paddingLeft');
    out.push([r.left, r.top, r.width, t], [r.left, r.bottom - b, r.width, b], [r.left, r.top + t, l, r.height - t - b], [r.right - ri, r.top + t, ri, r.height - t - b]);
  } else if (k === 'gap') {
    const ch = [...e.children], col = c.flexDirection.indexOf('column') === 0;
    for (let i = 0; i < ch.length - 1; i++) {
      const a = ch[i].getBoundingClientRect(), b = ch[i + 1].getBoundingClientRect();
      out.push(col ? [r.left + p('paddingLeft'), a.bottom, r.width - p('paddingLeft') - p('paddingRight'), b.top - a.bottom]
        : [a.right, r.top + p('paddingTop'), b.left - a.right, r.height - p('paddingTop') - p('paddingBottom')]);
    }
  } else if (k === 'mt') { const m = p('marginTop'); out.push([r.left, r.top - m, r.width, m]); }
  else if (k === 'ml') { const m = p('marginLeft'); out.push([r.left - m, r.top, m, r.height]); }
  else if (k === 'mb') { const m = p('marginBottom'); out.push([r.left, r.bottom, r.width, m]); }
  else if (k === 'sides') {
    const pr = e.parentElement.getBoundingClientRect();
    out.push([pr.left, r.top, r.left - pr.left, r.height], [r.right, r.top, pr.right - r.right, r.height]);
  }
  return out.filter(x => x[2] > 0.5 && x[3] > 0.5).map(x => ({ left: x[0], top: x[1], width: x[2], height: x[3] }));
}

/* ---------- muharrir ---------- */
const sp = (c, s) => s ? '<span class="h' + c + '">' + esc(s) + '</span>' : '';
function hlCss(src) {
  let out = '', i = 0, inB = false;
  while (i < src.length) {
    if (src.startsWith('/*', i)) { let j = src.indexOf('*/', i + 2); j = j < 0 ? src.length : j + 2; out += sp('c', src.slice(i, j)); i = j; continue; }
    const ch = src[i];
    if (ch === '{') { inB = true; out += sp('b', ch); i++; continue; }
    if (ch === '}') { inB = false; out += sp('b', ch); i++; continue; }
    let j = i;
    if (!inB) { while (j < src.length && src[j] !== '{' && src[j] !== '}' && !src.startsWith('/*', j)) j++; out += sp('s', src.slice(i, j)); i = j; continue; }
    while (j < src.length && src[j] !== ';' && src[j] !== '}' && src[j] !== '{' && !src.startsWith('/*', j)) j++;
    const d = src.slice(i, j), k = d.indexOf(':');
    out += k < 0 ? sp('p', d) : sp('p', d.slice(0, k)) + ':' + sp('v', d.slice(k + 1));
    if (src[j] === ';') { out += ';'; j++; }
    i = j;
  }
  return out;
}
function hlHtml(src) {
  return src.replace(/(<!--[\s\S]*?-->)|(<\/?)([\w-]+)([^<>]*)(>?)|([^<]+)|(<)/g, (m, c, lt, tag, attrs, gt, text, lone) => {
    if (c) return sp('c', c);
    if (tag) return sp('b', lt) + sp('t', tag) + attrs.replace(/([\w-]+)(?:(=)("[^"]*"?|'[^']*'?|[^\s"'>]*))?|([\s\S])/g,
      (m2, a, eq, val, other) => a ? sp('a', a) + (eq ? '=' + sp('v', val) : '') : esc(other)) + sp('b', gt);
    if (lone) return '&lt;';
    return esc(text);
  });
}
function Editor(root, onChange) {
  root.innerHTML = '<pre aria-hidden="true"></pre><textarea spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" aria-label="Kod"></textarea>';
  const pre = $('pre', root), ta = $('textarea', root);
  let lang = 'css';
  const paint = () => { pre.innerHTML = (lang === 'css' ? hlCss(ta.value) : hlHtml(ta.value)) + '\n'; pre.scrollTop = ta.scrollTop; pre.scrollLeft = ta.scrollLeft; };
  const ins = t => {
    let ok = false; try { ok = document.execCommand('insertText', false, t); } catch (e) { ok = false; }
    if (!ok) { ta.setRangeText(t, ta.selectionStart, ta.selectionEnd, 'end'); ta.dispatchEvent(new Event('input')); }
  };
  ta.addEventListener('input', () => { paint(); if (!ta.readOnly && onChange) onChange(); });
  ta.addEventListener('scroll', () => { pre.scrollTop = ta.scrollTop; pre.scrollLeft = ta.scrollLeft; });
  ta.addEventListener('keydown', e => {
    if (ta.readOnly) return;
    const v = ta.value, s = ta.selectionStart, ls = v.lastIndexOf('\n', s - 1) + 1, line = v.slice(ls, s);
    if (e.key === 'Tab') { e.preventDefault(); ins('  '); }
    else if (e.key === 'Enter' && !e.ctrlKey && !e.metaKey) {
      let ind = (line.match(/^\s*/) || [''])[0];
      if (/\{\s*$/.test(line) || (lang === 'html' && /<(div|section|header|footer|nav|main|ul)\b[^>]*>\s*$/i.test(line))) ind += '  ';
      e.preventDefault(); ins('\n' + ind);
    } else if (e.key === '}' && /^\s{2,}$/.test(line) && s === ta.selectionEnd) { ta.setSelectionRange(s - 2, s); }
  });
  return {
    ta,
    get value() { return ta.value; },
    set(v, l, ro) { lang = l; ta.value = v; ta.readOnly = !!ro; root.classList.toggle('ro', !!ro); ta.scrollTop = 0; ta.scrollLeft = 0; paint(); }
  };
}
const pretty = s => (s || '').trim().split('\n').map(r => {
  const m = r.match(/^(.*?)\{(.*)\}\s*$/); if (!m) return r;
  return m[1].trim().replace(/\s*,\s*/g, ', ') + ' {\n' + m[2].split(';').filter(x => x.trim()).map(x => { const i = x.indexOf(':'); return '  ' + x.slice(0, i).trim() + ': ' + x.slice(i + 1).trim() + ';'; }).join('\n') + '\n}';
}).join('\n\n');

/* ---------- tekshiruv ---------- */
const CS = e => e.ownerDocument.defaultView.getComputedStyle(e);
const px = v => parseFloat(v) || 0;
const isFlex = c => c.display === 'flex' || c.display === 'inline-flex';
const SIDES = ['Top', 'Right', 'Bottom', 'Left'], SIDE_UZ = ['tepadan', "o'ngdan", 'pastdan', 'chapdan'];
const box4 = (c, p) => SIDES.map(s => Math.round(px(c[p + s])));
const fmt4 = a => (a[0] === a[1] && a[1] === a[2] && a[2] === a[3]) ? a[0] + 'px' : (a[0] === a[2] && a[1] === a[3]) ? a[0] + 'px ' + a[1] + 'px' : a.map(x => x + 'px').join(' ');
const normText = e => e.textContent.trim().replace(/\s+/g, ' ');

function nm(t) {
  const c = t.classList[0];
  if (c) { const all = $$('.' + c, t.ownerDocument), n = all.indexOf(t); return (all.length > 1 ? (n + 1) + '-' : '') + '<code>.' + esc(c) + '</code>'; }
  const x = normText(t);
  return '<code>&lt;' + t.tagName.toLowerCase() + '&gt;</code>' + (x && !t.children.length ? ' («' + esc(x.slice(0, 24)) + (x.length > 24 ? '…' : '') + '»)' : '');
}
function lintHtml(text) {
  const t = text.replace(/<!--[\s\S]*?-->/g, '');
  if ((t.match(/"/g) || []).length % 2) return "Qo'shtirnoq (<code>\"</code>) ochilgan, lekin yopilmagan. <code>class=\"...\"</code> yozuvlarini tekshir.";
  for (const tag of ['div', 'section', 'header', 'footer', 'nav', 'main', 'a', 'p', 'h1', 'h2', 'h3', 'span', 'ul', 'li', 'button']) {
    const o = (t.match(new RegExp('<' + tag + '(\\s|>)', 'gi')) || []).length;
    const c = (t.match(new RegExp('</' + tag + '\\s*>', 'gi')) || []).length;
    if (o > c) return '<code>&lt;' + tag + '&gt;</code> ' + o + ' marta ochilgan, lekin ' + c + ' marta yopilgan. Har bir ochilgan tegning o\'z <code>&lt;/' + tag + '&gt;</code> yopuvchisi bo\'lsin.';
    if (c > o) return 'Ortiqcha <code>&lt;/' + tag + '&gt;</code> bor: ' + o + ' marta ochilgan, ' + c + ' marta yopilgan.';
  }
  return '';
}
function lintCss(text, doc) {
  const t = text.replace(/\/\*[\s\S]*?\*\//g, '');
  const o = (t.match(/\{/g) || []).length, c = (t.match(/\}/g) || []).length;
  if (o !== c) return 'Jingalak qavslar soni teng emas: <code>{</code> ' + o + ' ta, <code>}</code> ' + c + ' ta. Har bir blok yopilganini tekshir.';
  const re = /([^{}]+)\{([^{}]*)\}/g; let m;
  while ((m = re.exec(t))) {
    const sel = m[1].trim(), body = m[2];
    if (!body.trim()) continue;
    try { if (sel && !doc.querySelector(sel)) return '<code>' + esc(sel) + '</code> — sahifada bunday element yo\'q. Klass nomi HTML\'dagi bilan bir xilmi?'; }
    catch (e) { return '<code>' + esc(sel) + '</code> — selektor noto\'g\'ri yozilgan.'; }
    for (const d of body.split(';')) {
      const s = d.trim(); if (!s) continue;
      const i = s.indexOf(':');
      if (i < 0) return '<code>' + esc(sel) + '</code> ichida <code>' + esc(s) + '</code> — ikki nuqta (<code>:</code>) qolib ketgan.';
      const p = s.slice(0, i).trim(), v = s.slice(i + 1).trim();
      if (!v) return '<code>' + esc(p) + '</code> — qiymati yozilmagan.';
      if (/:/.test(v) && !/\(/.test(v)) return '<code>' + esc(sel) + '</code> ichida <code>' + esc(p) + '</code>dan keyin nuqtali vergul (<code>;</code>) qolib ketgan. Har bir xususiyat <code>;</code> bilan tugaydi.';
      if (window.CSS && CSS.supports && !CSS.supports(p, v)) {
        if (!CSS.supports(p, 'initial')) return '<code>' + esc(p) + '</code> — bunday xususiyat yo\'q. Imlosini tekshir.';
        return '<code>' + esc(p) + ': ' + esc(v) + '</code> — bu qiymat noto\'g\'ri.' + (/^\d+(\s+\d+)*$/.test(v) && v !== '0' ? ' O\'lcham birligini (<code>px</code>) yozdingmi?' : '');
      }
    }
  }
  return '';
}
function counterpart(t, tDoc, uDoc) {
  const c = t.classList[0];
  if (c) {
    const ts = $$('.' + c, tDoc), us = $$('.' + c, uDoc), n = ts.indexOf(t), C = '<code>.' + esc(c) + '</code>';
    if (us.length < ts.length) {
      if (t.children.length) return { err: us.length ? C + ' qutisi ' + ts.length + ' ta bo\'lishi kerak, hozir ' + us.length + ' ta.' : C + ' qutisi hali yo\'q. HTML\'da <code>&lt;div class="' + esc(c) + '"&gt;</code> ochib, kerakli elementlarni ichiga ol.' };
      return { err: C + ' elementi yo\'qolib qolibdi. Uni qaytar yoki «Boshidan» tugmasini bos.' };
    }
    if (us.length > ts.length) return { err: C + ' ' + us.length + ' ta bo\'lib qolgan — ' + ts.length + ' ta bo\'lishi kerak.' };
    return { el: us[n] };
  }
  const tag = t.tagName, txt = normText(t), f = d => $$(tag, d).filter(e => !e.classList.length && normText(e) === txt);
  const u = f(uDoc)[f(tDoc).indexOf(t)];
  return u ? { el: u } : { err: nm(t) + ' yo\'qolib qolibdi yoki matni o\'zgargan. Uni qaytar yoki «Boshidan» tugmasini bos.' };
}
function sameRect(t, u) {
  const a = t.getBoundingClientRect(), b = u.getBoundingClientRect();
  return Math.abs(a.left - b.left) <= TOL && Math.abs(a.top - b.top) <= TOL && Math.abs(a.width - b.width) <= TOL && Math.abs(a.height - b.height) <= TOL;
}
let KIND = '';
const K = (k, m) => { KIND = k; return m; };
function diagnose(t, u, pairs) {
  const U = x => { const p = pairs.find(q => q[0] === x); return p && p[1]; };
  const T = x => { const p = pairs.find(q => q[1] === x); return p && p[0]; };
  const kidMargin = (tp, up, sides) => [...up.children].some(c => { const tc = T(c), a = box4(CS(c), 'margin'), b = tc ? box4(CS(tc), 'margin') : [0, 0, 0, 0]; return sides.some(i => a[i] > b[i] + 1); });
  const isCol = c => c.flexDirection.indexOf('column') === 0;

  function contDiff(t, u) {                         // quti o'z bolalarini qanday joylashtirayotgani
    const ct = CS(t), cu = CS(u), N = nm(t);
    if (t.children.length) {
      const tf = isFlex(ct), uf = isFlex(cu), tcol = isCol(ct);
      if (tf && !uf) {
        const kid = [...u.children].find(c => isFlex(CS(c)) && !(T(c) && isFlex(CS(T(c)))));
        if (kid) return K('flex-bola', 'Flex\'ni ' + nm(kid) + 'ga yozding, lekin u — bola. Bolalarni tizadigan <b>ota</b> — ' + N + '. <code>display: flex</code>ni o\'shanga yoz.');
        const g = u.parentElement, gt = t.parentElement;
        if (g && g.tagName !== 'BODY' && isFlex(CS(g)) && !isFlex(CS(gt))) return K('flex-bola', 'Flex ' + nm(g) + 'ga yozilgan, lekin u faqat o\'zining bevosita bolalariga ta\'sir qiladi. Bu elementlarning otasi — ' + N + '.');
        const set = c => (c.justifyContent !== 'normal' ? ['justify-content'] : []).concat(c.alignItems !== 'normal' ? ['align-items'] : []).concat(px(c.columnGap) ? ['gap'] : []);
        const k2 = [...u.children].find(c => set(CS(c)).length && !(T(c) && set(CS(T(c))).length));
        if (k2) return K('flex-bola', '<code>' + set(CS(k2)).join('</code>, <code>') + '</code>ni ' + nm(k2) + 'ga yozding, lekin u — bola. Bu xususiyatlar bolalarni joylashtiradi, shuning uchun <b>otaga</b> — ' + N + 'ga, <code>display: flex</code> bilan birga yoziladi.');
        if (set(cu).length) return K('flex-yoq', N + 'da <code>' + set(cu).join('</code>, <code>') + '</code> bor, lekin <code>display: flex</code> yo\'q. Usiz bu xususiyatlar ishlamaydi.');
        if (tcol) return K('flex-yoq', N + ' ichidagilar ustun bo\'lib turibdi, lekin oralig\'i va tekislanishi flex bilan boshqariladi. ' + N + 'ga <code>display: flex</code> va <code>flex-direction: column</code> yoz.');
        if (t.children.length === 1) return K('flex-yoq', N + ' ichidagi quti hali joyiga qo\'yilmagan. Bolani otasi joylashtiradi: ' + N + ' buning uchun flex bo\'lishi kerak.');
        return K('flex-yoq', N + ' ichidagilar yonma-yon turishi kerak, lekin hozir ustma-ust turibdi. ' + N + ' hali flex emas.');
      }
      if (!tf && uf) return K('flex-ortiqcha', N + 'ga flex kerak emas — uni olib tashla. Flex faqat bolalarini tizish yoki tekislash kerak bo\'lgan qutiga yoziladi.');
      if (tf && uf) {
        if (ct.flexDirection !== cu.flexDirection) return K('flex-xususiyat', tcol
          ? N + ': bolalar yonma-yon emas, <b>ustun</b> bo\'lib turishi kerak. <code>flex-direction: column</code> yoz.'
          : N + ': bolalar ustun emas, <b>yonma-yon</b> turishi kerak. <code>flex-direction</code>ni olib tashla.');
        if (ct.flexWrap !== cu.flexWrap) return K('wrap', ct.flexWrap === 'wrap'
          ? N + ': bolalar bitta qatorga sig\'may, siqilib qolgan. Sig\'maganlari keyingi qatorga o\'tishi uchun <code>flex-wrap: wrap</code> yoz.'
          : N + 'ga <code>flex-wrap</code> kerak emas — bolalar bitta qatorda turishi kerak.');
        const col = tcol;
        const nj = v => (v === 'normal' || v === 'start' || v === 'left') ? 'flex-start' : v, na = v => v === 'normal' ? 'stretch' : v === 'start' ? 'flex-start' : v;
        if (nj(ct.justifyContent) !== nj(cu.justifyContent)) return K('flex-xususiyat', N + ': bolalar ' + (col ? 'vertikal' : 'gorizontal') + ' bo\'yicha boshqacha taqsimlanishi kerak. <code>justify-content</code>ni tekshir.');
        if (na(ct.alignItems) !== na(cu.alignItems)) return K('flex-xususiyat', N + ': bolalar ' + (col ? 'gorizontal' : 'vertikal') + ' bo\'yicha tekislanmagan. <code>align-items</code>ni tekshir.');
        const tg = px(col ? ct.rowGap : ct.columnGap), ug = px(col ? cu.rowGap : cu.columnGap);
        if (Math.abs(tg - ug) > 0.5) {
          if (ug === 0 && kidMargin(t, u, col ? [0, 2] : [1, 3])) return K('margin-gap', 'Bolalar orasidagi bo\'shliqni har biriga margin bilan emas, otasiga — ' + N + 'ga <code>gap</code> bilan ber.');
          return K('gap', N + ': bolalar orasi (<code>gap</code>) <b>' + tg + 'px</b> bo\'lishi kerak, hozir <b>' + ug + 'px</b>.');
        }
        if (ct.flexWrap === 'wrap') {
          const tr = px(col ? ct.columnGap : ct.rowGap), ur = px(col ? cu.columnGap : cu.rowGap);
          if (Math.abs(tr - ur) > 0.5) return K('gap', N + ': qatorlar orasi ham <b>' + tr + 'px</b> bo\'lishi kerak, hozir <b>' + ur + 'px</b>. <code>gap</code>ga bitta qiymat yozsang, ikkala yo\'nalishga ham ishlaydi.');
        }
      }
    }
    const pt = box4(ct, 'padding'), pu = box4(cu, 'padding');
    if (pt.some((v, i) => v !== pu[i])) {
      if (t.children.length && pu.every((v, i) => v <= pt[i]) && kidMargin(t, u, [0, 1, 2, 3])) return K('margin-padding', 'Ichidagilarni chetdan uzoqlashtirish uchun bolalarga margin emas, qutining o\'ziga — ' + N + 'ga <code>padding</code> ber.');
      return K('padding', N + 'ning ichki bo\'shlig\'i (<code>padding</code>) <b>' + fmt4(pt) + '</b> bo\'lishi kerak, hozir <b>' + fmt4(pu) + '</b>.');
    }
    return '';
  }
  function ownDiff(t, u) {                          // qutining o'z o'lchami va tashqi bo'shlig'i
    const ct = CS(t), cu = CS(u), N = nm(t), rt = t.getBoundingClientRect(), ru = u.getBoundingClientRect();
    const par = t.parentElement, pc = CS(par), inFlex = par.tagName !== 'BODY' && isFlex(pc), pcol = inFlex && isCol(pc);
    if (ct.maxWidth !== 'none' && cu.maxWidth === 'none' && ru.width > rt.width + TOL) return K('container', N + ' kengligi cheklanmagan — u butun kenglikni egallab olgan. Unga <code>max-width</code> ber.');
    if (Math.abs(ru.width - rt.width) <= TOL && px(ct.marginLeft) > TOL && px(cu.marginLeft) <= TOL && Math.abs(px(ct.marginLeft) - px(ct.marginRight)) <= TOL)
      return K('container', N + 'da kenglik to\'g\'ri, lekin u chapga yopishib qolgan. O\'rtaga qo\'yish uchun <code>margin: 0 auto</code> yoz.');
    if (inFlex) {
      const tg = parseFloat(ct.flexGrow) || 0, ug = parseFloat(cu.flexGrow) || 0;
      if (tg > 0 && ug === 0) return K('flex1', N + ' otadagi qolgan hamma bo\'sh joyni egallashi kerak. Unga <code>flex: 1</code> yoz.');
      if (tg === 0 && ug > 0) return K('flex1', N + 'ga <code>flex: 1</code> kerak emas — u faqat o\'z o\'lchamida turadi.');
    }
    const mt = box4(ct, 'margin'), mu = box4(cu, 'margin'), i = mt.findIndex((v, k) => v !== mu[k]);
    if (i >= 0 && !sameRect(t, u)) {
      if (inFlex && t === par.lastElementChild) {
        if (pcol && i === 0 && mt[0] > mu[0]) return K('auto', N + 'ni ustunning eng pastiga itarish kerak. Bo\'sh joyning hammasini uning tepasiga qo\'yish uchun <code>margin-top: auto</code> yoz.');
        if (!pcol && i === 3 && mt[3] > mu[3]) return K('auto', N + 'ni o\'ng chetga itarish kerak. Bo\'sh joyning hammasini uning chap tomoniga qo\'yish uchun <code>margin-left: auto</code> yoz.');
      }
      return K('margin', N + ': ' + SIDE_UZ[i] + ' tashqi bo\'shliq (<code>margin</code>) <b>' + mt[i] + 'px</b> bo\'lishi kerak, hozir <b>' + mu[i] + 'px</b>.');
    }
    if (inFlex && !pcol && Math.abs(rt.width - ru.width) > TOL) return K('olcham', N + ' kengligi <b>' + Math.round(rt.width) + 'px</b> bo\'lishi kerak, hozir <b>' + Math.round(ru.width) + 'px</b>. Unga <code>width</code> ber.');
    return '';
  }
  function geo(t, u) {
    const a = t.getBoundingClientRect(), b = u.getBoundingClientRect(), out = [], r = Math.round;
    if (Math.abs(b.width - a.width) > TOL) out.push(r(Math.abs(b.width - a.width)) + 'px ' + (b.width > a.width ? 'kengroq' : 'torroq'));
    if (Math.abs(b.height - a.height) > TOL) out.push(r(Math.abs(b.height - a.height)) + 'px ' + (b.height > a.height ? 'balandroq' : 'pastroq'));
    if (!out.length) {
      if (Math.abs(b.left - a.left) > TOL) out.push(r(Math.abs(b.left - a.left)) + 'px ' + (b.left > a.left ? 'o\'ngroqda' : 'chaproqda'));
      if (Math.abs(b.top - a.top) > TOL) out.push(r(Math.abs(b.top - a.top)) + 'px ' + (b.top > a.top ? 'pastroqda' : 'yuqoriroqda'));
    }
    return K('olcham', nm(t) + ' maqsaddagidan ' + out.join(' va ') + '. «Qutilarni ko\'rsat»ni yoqib, ikkala rasmni solishtir.');
  }
  const pt = t.parentElement;
  let m = contDiff(t, u);
  if (!m && pt.tagName !== 'BODY') m = contDiff(pt, U(pt));
  if (!m) m = ownDiff(t, u);
  if (!m) for (const d of $$('*', t)) { const du = U(d); if (!du) continue; m = contDiff(d, du) || ownDiff(d, du); if (m) break; }
  return m || geo(t, u);
}
function check(l, uDoc, tDoc, code) {
  const F = (kind, msg) => ({ ok: false, msg, kind });
  if (l.editHtml) { const m = lintHtml(code.html); if (m) return F('html', m); }
  const pairs = [];
  for (const t of $$('body *', tDoc)) {
    const u = counterpart(t, tDoc, uDoc);
    if (u.err) return F('quti', u.err);
    pairs.push([t, u.el]);
  }
  for (const [t, u] of pairs) {
    const pt = t.parentElement, pu = u.parentElement;
    if (pt.tagName === 'BODY') { if (pu.tagName !== 'BODY') return F('joy', nm(t) + ' eng tashqarida turishi kerak — hozir u ' + nm(pu) + ' ichiga kirib qolgan.'); }
    else if (pu !== pairs.find(p => p[0] === pt)[1]) return F('joy', nm(t) + ' bevosita ' + nm(pt) + ' ichida bo\'lishi kerak — hozir u ' + (pu.tagName === 'BODY' ? 'hech qaysi qutida emas' : nm(pu) + ' ichida') + '.');
  }
  for (const [t, u] of pairs) if (!sameRect(t, u)) {
    const lc = l.editCss && lintCss(code.css, uDoc);
    if (lc) return F('css', lc);
    KIND = ''; const m = diagnose(t, u, pairs);
    return F(KIND || 'olcham', m);
  }
  for (const s of (l.styles || [])) { const a = $(s[0], tDoc), b = $(s[0], uDoc); if (a && b && CS(a)[s[1]] !== CS(b)[s[1]]) return F('fon', s[2]); }
  return { ok: true, pairs };
}
function advise(pairs) {
  for (const [t, u] of pairs) {
    const ct = CS(t), cu = CS(u);
    if (isFlex(ct) && isFlex(cu) && px(ct.columnGap) + px(ct.rowGap) > 0 && px(cu.columnGap) + px(cu.rowGap) === 0)
      return 'Maslahat: ' + nm(t) + ' bolalari orasini margin bilan qilding — ishladi. Lekin otasiga <code>gap</code> yozsang, kod qisqaroq va toza bo\'ladi.';
  }
  return '';
}

/* ---------- ekranlar ---------- */
let cur = null, pvT, pvU, ed, liveT = 0, resetT = 0;
function fbSet(node, kind, html) { if (!kind) { node.hidden = true; return; } node.hidden = false; node.className = 'fb ' + kind; node.innerHTML = html; }
function show(which) {
  $('#map').hidden = which !== 'map'; $('#play').hidden = which !== 'play';
  $('#btnMap').hidden = which === 'map'; $('#stepper').hidden = which === 'map';
  if (which === 'map') $('#topTitle').textContent = '';
  $('#topStars').textContent = '★ ' + totalStars();
}
const WIRE = '<div class="wire" aria-hidden="true"><div data-n=".header"><div data-n=".container"><div class="w3" data-n=".navbar"><span style="width:44px"></span><span style="width:110px"></span><span style="width:54px"></span></div></div></div></div>';
function renderMap() {
  clearTimeout(liveT); cur = null; show('map');
  const done = LV.filter(l => S.done[l.id]).length;
  let h = '<section class="intro"><div class="intro-t"><h1>Quti Ustasi</h1><p>Har qanday sayt — qutilar ichidagi qutilar. Har darajada avval dizayndan qutilarni topasan, keyin ularni kodda yozasan.</p>'
    + '<div class="prog"><div class="prog-bar"><i style="width:' + (done / LV.length * 100) + '%"></i></div><span>' + done + ' / ' + LV.length + ' daraja</span><span class="st">★ ' + totalStars() + '</span><button class="btn-2" id="btnRep">Natijam</button></div><p class="note">Natijalaring shu brauzerda saqlanadi.</p></div>' + WIRE + '</section>';
  BOBS.forEach(b => {
    h += '<section class="bob"><div class="bob-h"><span class="bob-n">' + b.n + '</span><div><h2>' + b.nom + '</h2><p>' + b.izoh + '</p></div></div><div class="tiles">';
    LV.forEach((l, i) => {
      if (l.bob !== b.n) return;
      const dn = S.done[l.id], un = unlocked(i);
      h += '<button class="tile ' + (dn ? 'done' : un ? 'now' : 'lock') + '" data-i="' + i + '"' + (un ? '' : ' disabled') + '><span class="t-id">' + l.id.replace('-', '.') + '</span><span class="t-nom">' + l.nom + '</span><span class="t-st">' + (dn ? starStr(dn.stars) : un ? 'Boshlash' : 'Yopiq') + '</span></button>';
    });
    h += '</div></section>';
  });
  const ex = examDone();
  h += '<section class="bob cert-row"><div class="bob-h"><span class="bob-n">★</span><div><h2>Sertifikat</h2><p>' + (ex ? 'Imtihon topshirildi. Sertifikatingni ochib, chop et.' : 'Imtihonning ' + examLv().length + ' ta topshirig\'ini o\'tsang, ochiladi.') + '</p></div>' + (ex ? '<button class="btn-main" id="btnCert">Sertifikatni ochish</button>' : '') + '</div></section>';
  $('#map').innerHTML = h;
  $('#btnRep').onclick = openReport;
  if (ex) $('#btnCert').onclick = openCert;
  $$('.tile:not(.lock)', $('#map')).forEach(b => { b.onclick = () => needName(() => openLevel(+b.dataset.i)); });
}
function openLevel(i) {
  const l = LV[i]; clearTimeout(liveT);
  const saved = S.code[l.id];
  cur = { l, i, stage: '', step: 0, mist: 0, fails: 0, hint: 0, tab: '', outline: false, won: false, lock: false, code: saved ? { html: saved.html, css: saved.css } : startCode(l) };
  show('play');
  $('#topTitle').innerHTML = '<b>' + l.id.replace('-', '.') + '</b>' + l.nom;
  $('#btnOut').classList.remove('on');
  pvT.init(l); pvU.init(l);
  if (l.kor && l.kor.length && !S.kor[l.id]) startKor(); else startYoz();
}
function setStage(s) {
  cur.stage = s; $('#play').dataset.stage = s;
  $('#korPane').hidden = s !== 'kor'; $('#yozPane').hidden = s !== 'yoz'; $('#pvU').hidden = s !== 'yoz';
  $$('#stepper button').forEach(b => {
    b.classList.toggle('on', b.dataset.s === s);
    b.disabled = b.dataset.s === 'kor' ? !(cur.l.kor && cur.l.kor.length) : !(S.kor[cur.l.id] || OPEN || !(cur.l.kor && cur.l.kor.length));
  });
  pvT.set(cur.l.html, cur.l.css || '');
  pvT.outline(s === 'yoz' && cur.outline);
  pvT.ov.innerHTML = '';
  $('.left').scrollTop = 0;
}

/* ---------- 1-bosqich: Ko'r ---------- */
function startKor() { setStage('kor'); cur.step = 0; korStep(); }
function korDone(st) {
  cur.lock = true;
  const last = cur.step === cur.l.kor.length - 1;
  fbSet($('#korFb'), 'ok', '<b>To\'g\'ri.</b> ' + (st.nega || ''));
  const b = $('#korNext'); b.hidden = false; b.textContent = last ? 'Endi kodini yozamiz' : 'Davom etish';
  b.onclick = () => { if (last) { S.kor[cur.l.id] = true; save(); startYoz(); } else { cur.step++; korStep(); } };
  b.focus();
}
function korStep() {
  const l = cur.l, st = l.kor[cur.step], tDoc = pvT.doc, ov = pvT.ov, opts = $('#korOpts');
  cur.lock = false; ov.innerHTML = ''; opts.innerHTML = ''; opts.className = 'opts';
  $('#korCount').textContent = 'Savol ' + (cur.step + 1) + ' / ' + l.kor.length;
  $('#korQ').innerHTML = st.q; fbSet($('#korFb')); $('#korNext').hidden = true;
  (st.mark || []).forEach(s => $$(s, tDoc).forEach(e => ov.appendChild(ebox(e, 'ov-mark'))));
  if (st.zone) zoneRects(st.zone, tDoc).forEach(r => ov.appendChild(rbox(r, 'ov-zone')));
  const wrong = msg => { cur.mist++; ST(l.id).k++; save(); fbSet($('#korFb'), 'no', msg); };

  if (st.t === 'choice') {
    st.opts.forEach((o, k) => {
      const b = el('button', 'opt', o);
      b.onclick = () => {
        if (cur.lock) return;
        if (k === st.a) { b.classList.add('ok'); korDone(st); }
        else { b.classList.add('no'); b.disabled = true; wrong((st.xato && st.xato[k]) || 'Bu emas. Rasmga yana bir qara.'); }
      };
      opts.appendChild(b);
    });
  } else if (st.t === 'pick') {
    const cands = st.cands || l.boxes, list = [];
    opts.classList.add('row');
    const hl = (k, on) => $$('.ov-cand', ov).forEach(d => { if (+d.dataset.k === k) d.classList.toggle('hl', on); });
    const choose = k => {
      if (cur.lock) return;
      const s = cands[k], chip = opts.children[k];
      if (s === st.a) { chip.classList.add('ok'); hl(k, true); korDone(st); return; }
      chip.classList.add('no'); chip.disabled = true;
      const A = $(st.a, tDoc), X = $(s, tDoc);
      wrong((st.xato && st.xato[s]) || (A.contains(X) ? 'Bu — bolalardan biri. Bolalarni kim tizadi? Ularning <b>otasi</b>.' : X.contains(A) ? 'Bu quti juda yuqorida. Xususiyat faqat <b>bevosita</b> bolalarga ta\'sir qiladi — yaqinroq otani top.' : 'Bu emas. Belgilangan elementlarni ichiga olgan eng yaqin qutini top.'));
    };
    cands.forEach((s, k) => {
      $$(s, tDoc).forEach(e => { const d = ebox(e, 'ov-cand'); d.dataset.k = k; d.style.setProperty('--c', COLORS[k % COLORS.length]); d.onclick = () => choose(k); d.onmouseenter = () => hl(k, true); d.onmouseleave = () => { if (!cur.lock) hl(k, false); }; list.push(d); });
      const b = el('button', 'chip', '<i></i>' + esc(/^[a-z]/.test(s) ? '<' + s + '>' : s));
      b.style.setProperty('--c', COLORS[k % COLORS.length]);
      b.onmouseenter = () => hl(k, true); b.onmouseleave = () => { if (!cur.lock) hl(k, false); }; b.onclick = () => choose(k);
      opts.appendChild(b);
    });
    list.sort((a, b) => parseFloat(b.style.width) * parseFloat(b.style.height) - parseFloat(a.style.width) * parseFloat(a.style.height)).forEach(d => ov.appendChild(d));
  } else if (st.t === 'group') {
    const leaves = $$('body *', tDoc).filter(e => !e.children.length), want = [], sel = new Set(), divs = [];
    st.boxes.forEach(s => $$(s, tDoc).forEach(e => want.push({ s, e, set: leaves.map((x, j) => e.contains(x) ? j : -1).filter(j => j >= 0), done: false })));
    const info = el('div', 'grp-info');
    const wrapB = el('button', 'btn-main', 'Qutiga o\'ra'), clearB = el('button', 'btn-2', 'Tozalash');
    const upd = () => { divs.forEach((d, j) => d.classList.toggle('on', sel.has(j))); info.innerHTML = 'Tanlangan: <b>' + sel.size + '</b> ta element. Tayyor qutilar: <b>' + want.filter(w => w.done).length + ' / ' + want.length + '</b>.' + (want.some(w => w.done) && want.some(w => !w.done) ? ' Tayyor qutini butunlay tanlash uchun uning yorlig\'ini bos.' : ''); };
    leaves.forEach((e, j) => { const d = ebox(e, 'ov-leaf'); d.onclick = () => { if (cur.lock) return; sel.has(j) ? sel.delete(j) : sel.add(j); upd(); }; divs.push(d); ov.appendChild(d); });
    clearB.onclick = () => { if (cur.lock) return; sel.clear(); upd(); };
    wrapB.onclick = () => {
      if (cur.lock) return;
      const a = [...sel].sort((x, y) => x - y), key = a.join(','), g = want.find(w => !w.done && w.set.join(',') === key);
      if (g) {
        g.done = true;
        const d = ebox(g.e, 'ov-box'), tag = el('b', '', esc(g.s));
        tag.onclick = () => { if (cur.lock) return; const all = g.set.every(j => sel.has(j)); g.set.forEach(j => all ? sel.delete(j) : sel.add(j)); upd(); };
        d.appendChild(tag); ov.appendChild(d); sel.clear(); upd();
        if (want.every(w => w.done)) korDone(st); else fbSet($('#korFb'), 'ok', 'To\'g\'ri — bu <code>' + esc(g.s) + '</code> qutisi. Endi keyingisini tanla.');
        return;
      }
      wrong(a.length < 2 ? 'Avval kamida ikkita elementni bosib tanla.'
        : want.some(w => w.done && w.set.join(',') === key) ? 'Bu quti allaqachon tayyor. Boshqasini tanla.'
          : want.some(w => !w.done && a.every(j => w.set.includes(j))) ? 'Yaqin! Lekin bu qutiga yana element kiradi.'
            : want.some(w => !w.done && w.set.every(j => a.includes(j))) ? 'Ko\'p tanlading. Hammasi bitta qutiga kirmaydi — qaysilari birga turibdi?'
              : 'Bu elementlar bitta qutida emas. Bir-biriga yaqin, birga turganlarini tanla.');
    };
    opts.classList.add('row'); opts.appendChild(wrapB); opts.appendChild(clearB); opts.appendChild(info); info.style.width = '100%'; upd();
  }
}

/* ---------- 2-bosqich: Yoz ---------- */
function renderTabs() {
  const l = cur.l, box = $('#tabs'); box.innerHTML = '';
  [['html', 'HTML', !l.editHtml, false], ['css', 'CSS', false, !l.editCss], ['base', 'Tayyor stil', true, !(l.base || '').trim()]].forEach(([k, lab, ro, hide]) => {
    if (hide) return;
    const b = el('button', 'tab' + (cur.tab === k ? ' on' : ''), lab + (ro ? '<small>faqat o\'qish</small>' : ''));
    b.onclick = () => { cur.tab = k; renderTabs(); loadTab(); };
    box.appendChild(b);
  });
}
function loadTab() {
  const l = cur.l, k = cur.tab;
  if (k === 'html') ed.set(cur.code.html, 'html', !l.editHtml); else if (k === 'css') ed.set(cur.code.css, 'css', false); else ed.set(pretty(l.base), 'css', true);
}
function refresh() { pvU.set(cur.code.html, cur.code.css, pvT.h); pvU.outline(cur.outline); }
function startYoz() {
  const l = cur.l; setStage('yoz');
  $('#task').innerHTML = (l.imtihon ? '<span class="badge">Imtihon</span>' : '') + l.vazifa;
  $('#btnHint').hidden = !!l.imtihon;
  cur.tab = l.editHtml ? 'html' : 'css'; renderTabs(); loadTab();
  $('#btnHint').textContent = 'Podskazka' + (cur.hint ? ' ' + cur.hint + '/3' : ''); fbSet($('#fb'));
  pvU.fit(); refresh();
}
function onEdit() {
  if (!cur || cur.stage !== 'yoz') return;
  if (cur.tab === 'html') cur.code.html = ed.value; else if (cur.tab === 'css') cur.code.css = ed.value; else return;
  S.code[cur.l.id] = { html: cur.code.html, css: cur.code.css };
  clearTimeout(liveT); liveT = setTimeout(live, 150);
}
function live() {
  save(); refresh();
  if (cur.won) return;
  const r = check(cur.l, pvU.doc, pvT.doc, cur.code);
  if (r.ok) { cur.won = true; liveT = setTimeout(() => win(r), 450); }
}
function doCheck() {
  if (!cur || cur.stage !== 'yoz') return;
  clearTimeout(liveT); save(); refresh();
  const r = check(cur.l, pvU.doc, pvT.doc, cur.code);
  if (r.ok) { cur.won = true; win(r); } else {
    cur.won = false; cur.fails++;
    const st = ST(cur.l.id); st.c++; st.e[r.kind] = (st.e[r.kind] || 0) + 1; save();
    fbSet($('#fb'), 'no', r.msg); $('#fb').scrollIntoView({ block: 'nearest' }); }
}
function doHint() {
  const l = cur.l; if (l.imtihon) return; if (cur.hint < 3) cur.hint++;
  const sh = ST(l.id); sh.h = Math.max(sh.h, cur.hint); save();
  pvT.ov.innerHTML = '';
  (l.hintBox || []).forEach(s => $$(s, pvT.doc).forEach(e => { const d = ebox(e, 'ov-hint'); d.appendChild(el('b', '', esc(s))); pvT.ov.appendChild(d); }));
  let h = '<p><b>1.</b> ' + l.hints[0] + '</p>';
  if (cur.hint >= 2) h += '<p><b>2.</b> ' + l.hints[1] + '</p>';
  if (cur.hint >= 3) h += '<p><b>3.</b> Tayyor kod. Shunchaki ko\'chirib qo\'yma — har qator nima qilishini tushunib, o\'zing yoz:</p>'
    + (l.editHtml ? '<pre class="sol">' + hlHtml((l.solHtml || l.html).trim()) + '</pre>' : '') + (l.editCss ? '<pre class="sol">' + hlCss((l.solCss || l.css).trim()) + '</pre>' : '');
  fbSet($('#fb'), 'hint', h);
  $('#btnHint').textContent = 'Podskazka ' + cur.hint + '/3';
  $('#fb').scrollIntoView({ block: 'nearest' });
}
function win(r) {
  const l = cur.l, last = cur.i === LV.length - 1;
  let st = 3; if (cur.hint >= 1) st = 2; if (cur.hint >= 3) st = 1; if (cur.mist >= 3) st = Math.min(st, 2);
  if (l.imtihon) st = cur.fails <= 1 ? 3 : cur.fails <= 4 ? 2 : 1;
  const bobAll = () => LV.filter(x => x.bob === l.bob).every(x => S.done[x.id]), wasAll = bobAll();
  S.done[l.id] = { stars: Math.max((S.done[l.id] || {}).stars || 0, st), d: Date.now() };
  S.pass[l.id] = { html: cur.code.html, css: cur.code.css }; save();
  if (!wasAll && bobAll()) queue('bob' + l.bob, { bob: l.bob });
  $('#topStars').textContent = '★ ' + totalStars();
  const tip = advise(r.pairs || []) || (st < 3 ? (l.imtihon ? 'Imtihonda yulduz «Tekshir» bosganda chiqqan xatolar soniga qarab beriladi: 0–1 xato — 3 yulduz.' : 'Podskazkasiz va Ko\'r bosqichida kam xato bilan o\'tsang, 3 ta yulduz olasan.') : '');
  const cert = l.imtihon && examDone();
  const w = $('#win');
  w.innerHTML = '<div class="win-card" role="dialog" aria-label="Daraja tugadi"><div class="win-stars">' + [1, 2, 3].map(k => '<span class="' + (k <= st ? 'on' : '') + '" style="--d:' + (k * 0.13) + 's">★</span>').join('') + '</div>'
    + '<h2>' + (cert ? 'Sen endi quti ustasisan' : 'To\'g\'ri yig\'ding') + '</h2><p class="win-why">' + l.nega + '</p>' + (tip ? '<p class="win-tip">' + tip + '</p>' : '')
    + '<div class="win-acts"><button class="btn-2" id="wMap">Xaritaga</button>' + (cert ? '<button class="btn-main" id="wCert">Sertifikatni ochish</button>' : '') + (last ? '' : '<button class="btn-main" id="wNext">Keyingi daraja</button>') + '</div></div>';
  for (let k = 0; k < 34; k++) { const c = el('i'); c.style.left = Math.random() * 100 + '%'; c.style.background = COLORS[k % COLORS.length]; c.style.animationDuration = (1.6 + Math.random() * 1.6) + 's'; c.style.animationDelay = Math.random() * 0.5 + 's'; w.appendChild(c); }
  w.hidden = false;
  $('#wMap').onclick = () => { w.hidden = true; renderMap(); };
  if (cert) { $('#wCert').onclick = () => { w.hidden = true; renderMap(); openCert(); }; $('#wCert').focus(); }
  if (!last) { $('#wNext').onclick = () => { w.hidden = true; openLevel(cur.i + 1); }; $('#wNext').focus(); }
}

/* ---------- natija hisoboti ---------- */
const KINDS = {
  'flex-bola': "Flex'ni otaga emas, bolaga yozadi", 'flex-yoq': 'Flex yozishni unutadi', 'flex-ortiqcha': 'Keraksiz qutiga flex yozadi',
  'flex-xususiyat': "justify-content / align-items / flex-direction'ni adashtiradi", wrap: "flex-wrap'ni unutadi", gap: "gap qiymatida xato qiladi",
  'margin-gap': "gap o'rniga har bir bolaga margin yozadi", padding: "padding qiymatida xato qiladi", 'margin-padding': "padding o'rniga bolalarga margin yozadi",
  margin: "margin'da xato qiladi", container: "Container'ni (max-width, margin: 0 auto) to'g'ri yozmaydi", flex1: "flex: 1 ni qo'llay olmaydi",
  auto: "margin: auto bilan itarishni bilmaydi", html: "Teglarni yopmaydi yoki qo'shtirnoqni unutadi", quti: "Kerakli div'ni ochmaydi",
  joy: "Elementni noto'g'ri qutiga joylaydi", css: "CSS'da imlo xatolari (; : { } px)", fon: "Xususiyatni noto'g'ri qutiga yozadi", olcham: "O'lchamda xato qiladi"
};
function reportText() {
  const st = id => S.stats[id] || { h: 0, k: 0, c: 0, e: {}, t: 0 }, id2 = l => l.id.replace('-', '.');
  const done = LV.filter(l => S.done[l.id]), L = [];
  L.push('Quti Ustasi — natija');
  L.push("O'quvchi: " + (S.name.trim() || '(ism yozilmagan)') + (S.guruh.trim() ? ', ' + S.guruh.trim() : ''));
  L.push('Sana: ' + fmtDate(new Date()));
  L.push("O'tildi: " + done.length + ' / ' + LV.length + ' daraja, ★ ' + totalStars() + ' / ' + LV.length * 3);
  const t = LV.reduce((a, l) => a + st(l.id).t, 0); if (t >= 60) L.push('Mashq vaqti: ' + dur(t));
  const nxt = LV.find(l => !S.done[l.id]); L.push(nxt ? 'Hozir: ' + id2(nxt) + ' ' + nxt.nom : "Hamma darajalar o'tilgan");
  L.push('', 'Boblar:');
  BOBS.forEach(b => {
    const ls = LV.filter(l => l.bob === b.n), d = ls.filter(l => S.done[l.id]);
    L.push(b.n + '. ' + b.nom + ': ' + d.length + '/' + ls.length + (d.length ? ', ★ ' + d.reduce((a, l) => a + S.done[l.id].stars, 0) : ''));
  });
  const hard = LV.map(l => { const s = st(l.id); return { l, s, sc: s.h * 3 + s.c + s.k }; }).filter(x => x.sc >= 3).sort((a, b) => b.sc - a.sc).slice(0, 5);
  if (hard.length) {
    L.push('', "Qiyin bo'lgan darajalar:");
    hard.forEach(({ l, s }) => L.push('- ' + id2(l) + ' ' + l.nom + ': ' + [s.h ? s.h + ' podskazka' : '', s.c ? s.c + ' ta xato tekshiruv' : '', s.k ? s.k + " ta xato javob (Ko'r)" : ''].filter(Boolean).join(', ') + (S.done[l.id] ? '' : " — hali o'tilmagan")));
  }
  const errs = {}; LV.forEach(l => { const e = st(l.id).e; for (const k in e) errs[k] = (errs[k] || 0) + e[k]; });
  const top = Object.keys(errs).sort((a, b) => errs[b] - errs[a]).slice(0, 4);
  if (top.length) { L.push('', "Ko'p uchragan xatolar:"); top.forEach(k => L.push('- ' + (KINDS[k] || k) + ': ' + errs[k] + ' marta')); }
  const ex = examLv();
  if (ex.length) { const d = ex.filter(l => S.done[l.id]); L.push('', 'Imtihon: ' + (d.length === ex.length ? 'topshirildi, ★ ' + d.reduce((a, l) => a + S.done[l.id].stars, 0) + ' / ' + ex.length * 3 : d.length + ' / ' + ex.length + ' topshiriq')); }
  return L.join('\n');
}
const siteUrl = () => /^https?:$/.test(location.protocol) ? location.origin + location.pathname : CFG.sayt;
const shareUrl = t => 'https://t.me/share/url?url=' + encodeURIComponent(siteUrl() || ' ') + '&text=' + encodeURIComponent('\n' + t);
const canSend = () => /^https?:$/.test(location.protocol) && !!CFG.natijaUrl;
async function post(textMsg) {
  if (!canSend()) return false;
  try {
    const r = await fetch(CFG.natijaUrl, { method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: S.name.trim(), guruh: S.guruh.trim(), uid: S.uid, text: textMsg }) });
    return r.ok;
  } catch (e) { return false; }
}
function bobText(n) {
  const b = BOBS.find(x => x.n === n), ls = LV.filter(l => l.bob === n), st = id => S.stats[id] || { h: 0, k: 0, c: 0, e: {}, t: 0 };
  const exam = ls.some(l => l.imtihon), stars = ls.reduce((a, l) => a + ((S.done[l.id] || {}).stars || 0), 0), t = ls.reduce((a, l) => a + st(l.id).t, 0);
  const L = ['Quti Ustasi', (S.name.trim() || '(ism yo\'q)') + (S.guruh.trim() ? ' — ' + S.guruh.trim() : ''),
    exam ? '🎓 Imtihon topshirildi, sertifikat ochildi' : '✅ ' + n + '-bob tugadi: ' + b.nom,
    '★ ' + stars + ' / ' + ls.length * 3 + (t >= 60 ? ', vaqt: ' + dur(t) : '')];
  const hard = ls.map(l => { const s = st(l.id); return { l, s, sc: s.h * 3 + s.c + s.k }; }).filter(x => x.sc >= 3).sort((a, c) => c.sc - a.sc).slice(0, 3);
  if (hard.length) { L.push('', 'Qiynalgan:'); hard.forEach(({ l, s }) => L.push('- ' + l.id.replace('-', '.') + ' ' + l.nom + ': ' + [s.h ? s.h + ' podskazka' : '', s.c ? s.c + ' xato' : '', s.k ? s.k + " xato javob (Ko'r)" : ''].filter(Boolean).join(', '))); }
  const errs = {}; ls.forEach(l => { const e = st(l.id).e; for (const k in e) errs[k] = (errs[k] || 0) + e[k]; });
  const top = Object.keys(errs).sort((a, c) => errs[c] - errs[a]).slice(0, 3);
  if (top.length) { L.push('', 'Ko\'p xatolar:'); top.forEach(k => L.push('- ' + (KINDS[k] || k) + ' (' + errs[k] + ')')); }
  L.push('', 'Umumiy: ' + LV.filter(l => S.done[l.id]).length + ' / ' + LV.length + ' daraja, ★ ' + totalStars());
  return L.join('\n');
}
function queue(key, ev) { if (S.sent[key]) return; S.sent[key] = 1; S.outbox.push(Object.assign({ key }, ev)); save(); flush(); }
let flushing = false;
async function flush() {
  if (flushing || !canSend() || !S.outbox.length || !S.name.trim()) return;
  flushing = true;
  try {
    while (S.outbox.length) {
      const ev = S.outbox[0];
      if (!(await post(bobText(ev.bob)))) break;
      S.outbox.shift(); save();
    }
  } finally { flushing = false; }
}
function groupField(id) { return '<label class="fld">Guruh<input id="' + id + '" autocomplete="off" maxlength="30" placeholder="Masalan: Frontend 3"></label>'; }
function needName(next) {
  if (S.name.trim().length >= 2) { next(); return; }
  const m = $('#modal');
  m.innerHTML = '<div class="win-card rep" role="dialog" aria-label="Tanishaylik"><h2>Tanishib olaylik</h2><p class="win-tip" style="margin:-6px 0 16px">Natijalaring shu nom bilan ustozingga boradi.</p><div class="fld-row">' + nameField('nmName') + groupField('nmGr') + '</div>'
    + '<div class="win-acts"><button class="btn-main" id="nmGo">Boshlash</button></div></div>';
  const a = $('#nmName'), g = $('#nmGr'); a.value = S.name; g.value = S.guruh;
  const go = () => { if (a.value.trim().length < 2) { a.classList.add('need'); a.focus(); return; } S.name = a.value.trim(); S.guruh = g.value.trim(); save(); m.hidden = true; flush(); next(); };
  $('#nmGo').onclick = go; [a, g].forEach(x => x.addEventListener('keydown', e => { if (e.key === 'Enter') go(); }));
  m.hidden = false; a.focus();
}
function nameField(id) { return '<label class="fld">Ism va familiyang<input id="' + id + '" autocomplete="off" maxlength="40" placeholder="Masalan: Ali Valiyev"></label>'; }
function openReport() {
  const m = $('#modal');
  m.innerHTML = '<div class="win-card rep" role="dialog" aria-label="Natijam"><h2>Natijam</h2><div class="fld-row">' + nameField('repName') + groupField('repGr') + '</div>'
    + '<textarea id="repText" readonly aria-label="Natija matni"></textarea><p class="win-tip">Natijani ustozingga yubor: u qaysi joyda qiynalayotganingni ko\'radi.</p>'
    + '<div class="win-acts"><button class="btn-2" id="repClose">Yopish</button><button class="btn-2" id="repCopy">Nusxalash</button>' + (canSend() ? '<button class="btn-main" id="repSend">Ustozga yuborish</button>' : '<a class="btn-main" id="repTg" target="_blank" rel="noopener">Telegram\'da yuborish</a>') + '</div></div>';
  const inp = $('#repName'), gr = $('#repGr'), ta = $('#repText'), tg = $('#repTg'), sb = $('#repSend');
  const upd = () => { const t = reportText(); ta.value = t; if (tg) tg.href = shareUrl(t); };
  inp.value = S.name; gr.value = S.guruh;
  inp.oninput = () => { S.name = inp.value; save(); upd(); }; gr.oninput = () => { S.guruh = gr.value; save(); upd(); }; upd();
  if (sb) sb.onclick = async () => {
    if (!S.name.trim()) { inp.classList.add('need'); inp.focus(); return; }
    sb.disabled = true; sb.textContent = 'Yuborilyapti…';
    const ok = await post(ta.value);
    sb.textContent = ok ? 'Yuborildi' : 'Yuborilmadi'; sb.disabled = ok;
    if (!ok) { sb.title = 'Internetni tekshirib, yana bos'; setTimeout(() => { sb.textContent = 'Ustozga yuborish'; }, 2500); }
  };
  $('#repClose').onclick = () => { m.hidden = true; };
  $('#repCopy').onclick = () => {
    const b = $('#repCopy'), ok = () => { b.textContent = 'Nusxalandi'; setTimeout(() => { b.textContent = 'Nusxalash'; }, 1600); };
    const fb = () => { ta.select(); try { document.execCommand('copy'); } catch (e) { /* qo'lda nusxalaydi */ } ok(); };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(ta.value).then(ok, fb); else fb();
  };
  m.hidden = false; inp.focus();
}
function openCert() {
  const c = $('#cert'), ex = examLv(), exS = ex.reduce((a, l) => a + ((S.done[l.id] || {}).stars || 0), 0), dn = LV.filter(l => S.done[l.id]).length;
  const d = new Date(Math.max(...ex.map(l => (S.done[l.id] || {}).d || 0)) || Date.now());
  c.innerHTML = '<div class="cert-paper"><div class="cert-in"><div class="cb1"><div class="cb2"><div class="cb3">'
    + '<div class="c-top"><span class="mark"><i></i></span>Quti Ustasi</div><h1>Sertifikat</h1><p class="c-lead">Ushbu sertifikat egasi</p><div class="c-name" id="certName"></div>'
    + '<p class="c-text">HTML va CSS yordamida sahifani qutilarga bo\'lish, padding, margin, gap, container va Flexbox bilan sayt bo\'limlarini yig\'ish bo\'yicha ' + dn + ' ta darajani va yakuniy imtihonni muvaffaqiyatli topshirdi.</p>'
    + '<div class="c-stats"><div><b>' + dn + ' / ' + LV.length + '</b><span>daraja</span></div><div><b>★ ' + totalStars() + ' / ' + LV.length * 3 + '</b><span>yulduz</span></div><div><b>★ ' + exS + ' / ' + ex.length * 3 + '</b><span>imtihon</span></div></div>'
    + '<div class="c-foot"><div><b>' + fmtDate(d) + '</b><span>Sana</span></div>' + (CFG.markaz ? '<div><b>' + esc(CFG.markaz) + '</b><span>O\'quv markazi</span></div>' : '') + '<div><b></b><span>Ustoz imzosi</span></div></div>'
    + '</div></div></div></div></div>'
    + '<div class="cert-acts">' + nameField('certInp') + '<button class="btn-main" id="certPrint">Chop etish</button><button class="btn-2" id="certClose">Yopish</button></div>';
  const inp = $('#certInp'), nmEl = $('#certName');
  const upd = () => { const v = S.name.trim(); nmEl.textContent = v || 'Ism Familiya'; nmEl.classList.toggle('empty', !v); inp.classList.remove('need'); };
  inp.value = S.name; inp.oninput = () => { S.name = inp.value; save(); upd(); }; upd();
  $('#certPrint').onclick = () => { if (!S.name.trim()) { inp.classList.add('need'); inp.focus(); return; } window.print(); };
  $('#certClose').onclick = () => { c.hidden = true; };
  c.hidden = false; c.scrollTop = 0;
}

/* ---------- ishga tushirish ---------- */
let lastAct = Date.now();
['keydown', 'pointerdown', 'input'].forEach(ev => document.addEventListener(ev, () => { lastAct = Date.now(); }, true));
setInterval(() => { if (!cur || document.hidden || Date.now() - lastAct > 120000) return; ST(cur.l.id).t += 5; save(); }, 5000);
document.addEventListener('keydown', e => { if (e.key !== 'Escape') return; if (!$('#modal').hidden) $('#modal').hidden = true; else if (!$('#cert').hidden) $('#cert').hidden = true; });
pvT = Pv($('#pvT')); pvU = Pv($('#pvU')); ed = Editor($('#ed'), onEdit);
$('#btnMap').onclick = renderMap;
$('#btnCheck').onclick = doCheck;
$('#btnHint').onclick = doHint;
$('#btnOut').onclick = () => { cur.outline = !cur.outline; $('#btnOut').classList.toggle('on', cur.outline); pvT.outline(cur.outline); pvU.outline(cur.outline); };
$('#btnReset').onclick = () => {
  const b = $('#btnReset');
  if (b.dataset.arm) { clearTimeout(resetT); delete b.dataset.arm; b.textContent = 'Boshidan'; cur.code = startCode(cur.l); delete S.code[cur.l.id]; save(); cur.won = false; loadTab(); refresh(); fbSet($('#fb')); }
  else { b.dataset.arm = '1'; b.textContent = 'Kod o\'chadi. Yana bos'; resetT = setTimeout(() => { delete b.dataset.arm; b.textContent = 'Boshidan'; }, 3000); }
};
$$('#stepper button').forEach(b => { b.onclick = () => { if (b.dataset.s === cur.stage) return; b.dataset.s === 'kor' ? startKor() : startYoz(); }; });
document.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); doCheck(); } });
window.addEventListener('resize', () => { if (cur) { pvT.fit(); pvU.fit(); } });
const wT = $('#pvT .pv-wrap'), wU = $('#pvU .pv-wrap'); let syncing = false;
[[wT, wU], [wU, wT]].forEach(([a, b]) => a.addEventListener('scroll', () => { if (syncing) return; syncing = true; b.scrollTop = a.scrollTop; requestAnimationFrame(() => { syncing = false; }); }));
renderMap();
flush();
window.addEventListener('online', flush);

/* ---------- ishlab chiquvchi uchun o'z-o'zini tekshirish ---------- */
window.QU_DEV = {
  report: reportText, bobText, flush, state: () => S, cert: openCert, openReport, open: openLevel, check: (html, css) => { const c = { html, css }; if (cur.stage !== 'yoz') startYoz(); pvU.set(html, css, pvT.h); return check(cur.l, pvU.doc, pvT.doc, c); },
  test() {
    const out = { problems: [], starts: {} }, P = s => out.problems.push(s);
    LV.forEach((l, i) => {
      S.kor[l.id] = true; delete S.code[l.id]; delete S.pass[l.id];
      openLevel(i);
      const a = check(l, pvU.doc, pvT.doc, cur.code);
      if (a.ok) P(l.id + ': boshlang\'ich kod o\'tib ketyapti'); else out.starts[l.id] = a.msg;
      const sol = { html: l.html, css: l.css || '' };
      pvU.set(sol.html, sol.css, pvT.h);
      const b = check(l, pvU.doc, pvT.doc, sol);
      if (!b.ok) P(l.id + ': yechim o\'tmayapti: ' + b.msg);
      const d = pvT.doc;
      (l.kor || []).forEach((st, k) => {
        const tag = l.id + ' kor#' + (k + 1) + ': ';
        if (st.t === 'choice' && !(st.a >= 0 && st.a < st.opts.length)) P(tag + 'javob indeksi');
        if (st.t === 'pick') { const c = st.cands || l.boxes; if (!c.includes(st.a)) P(tag + 'javob nomzodlar ichida yo\'q'); c.forEach(s => { if (!$(s, d)) P(tag + 'topilmadi ' + s); }); }
        if (st.t === 'group') {
          const lv = $$('body *', d).filter(e => !e.children.length), sets = [];
          st.boxes.forEach(s => { const es = $$(s, d); if (!es.length) P(tag + 'topilmadi ' + s); es.forEach(e => { const set = lv.map((x, j) => e.contains(x) ? j : -1).filter(j => j >= 0); if (set.length < 2) P(tag + s + ' ichida 2 tadan kam element'); sets.push(set.join(',')); }); });
          if (new Set(sets).size !== sets.length) P(tag + 'bir xil to\'plamlar');
        }
        (st.mark || []).forEach(s => { if (!$(s, d)) P(tag + 'mark topilmadi ' + s); });
        if (st.zone && !zoneRects(st.zone, d).length) P(tag + 'bo\'sh zona');
        if (!st.q) P(tag + 'savol yo\'q');
      });
      (l.hintBox || []).forEach(s => { if (!$(s, d)) P(l.id + ': hintBox topilmadi ' + s); });
      if (!l.imtihon && (l.kor || []).length === 0 && !l.from && l.bob < 7) P(l.id + ': Ko\'r bosqichi yo\'q');
      if (!l.hints || l.hints.length < 2 || !l.nega || !l.vazifa) P(l.id + ': matn yetishmaydi');
      if (!l.editHtml && !l.editCss) P(l.id + ': tahrirlanadigan narsa yo\'q');
      $$('body *', d).forEach(e => { if (e.children.length && !e.classList.length) P(l.id + ': klasssiz quti <' + e.tagName + '>'); });
    });
    S = { done: {}, code: {}, pass: {}, kor: {}, stats: {}, name: '', guruh: '', uid: S.uid, sent: {}, outbox: [] }; save(); renderMap();
    return out;
  }
};
})();
