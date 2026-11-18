import json, sys, pathlib
from playwright.sync_api import sync_playwright
root = pathlib.Path(__file__).resolve().parent.parent
url = (root/'dist/quti-ustasi.html').as_uri()
shots = root/'test/shots'; shots.mkdir(exist_ok=True)
fails = []
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
    pg = b.new_page(viewport={'width': 1366, 'height': 768})
    errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'Failed to load resource' not in m.text else None)
    pg.goto(url)
    res = pg.evaluate('QU_DEV.test()')
    print('LEVELS', len(res['starts']))
    for k, v in res['starts'].items(): print('  start', k, '->', v)
    for x in res['problems']: fails.append(x)

    # tipik xatolar uchun diagnoz
    def diag(i, html, css):
        return pg.evaluate('([i,h,c])=>{QU_DEV.open(i); const L=QU.levels[i]; const r=QU_DEV.check(h==null?L.html:h, c==null?(L.css||""):c); return r.ok?"OK":r.msg}', [i, html, css])
    ids = pg.evaluate('QU.levels.map(l=>l.id)')
    ix = lambda s: ids.index(s)
    pg.evaluate('()=>{QU.levels.forEach(l=>{})}')
    cases = [
      ('2-1', None, '.box{display:flex}', 'bola'),
      ('2-1', None, '.row{dispaly:flex}', 'bunday xususiyat'),
      ('2-1', None, '.row{display:flex;gap:12}', 'px'),
      ('2-1', None, '.row{display:flex gap:12px}', 'nuqtali vergul'),
      ('2-1', None, '.row{display:flex;gap:8px}', 'gap'),
      ('2-2', None, '.navbar{display:flex;justify-content:space-between;align-items:center}.link{display:flex}', 'bola'),
      ('2-2', None, '.navbar{display:flex;align-items:center}.menu{display:flex;gap:22px}', 'justify-content'),
      ('2-3', None, '.card{display:flex}.card-footer{display:flex;justify-content:space-between;align-items:center}', 'flex kerak emas'),
      ('2-4', None, '.hero-box{justify-content:center;align-items:center}', 'otaga'),
      ('2-4', None, '.hero{justify-content:center;align-items:center}', 'ishlamaydi'),
      ('2-4', None, '', 'joyiga'),
      ('3-1', None, '.card h3{margin:20px}', 'padding'),
      ('3-2', None, '.cards{display:flex}.card{margin-right:16px}', 'OK'),
      ('3-3', None, '.banner{margin-bottom:20px}', 'OK'),
      ('3-6', None, '.cards{display:flex}.card{margin:16px}', 'gap'),
      ('4-1', None, '.container{margin:0 auto}', 'max-width'),
      ('4-1', None, '.container{max-width:440px}', 'margin: 0 auto'),
      ('4-2', None, '.header{display:flex;justify-content:space-between}.container{max-width:480px;margin:0 auto}.menu{display:flex;gap:20px}', 'flex'),
      ('4-5', None, '.footer{padding:24px 0}.container{max-width:460px;margin:0 auto;background:#1e2a4a}.footer-row{display:flex;justify-content:space-between;align-items:center}', 'Fon rangi'),
      ('1-1', '<div class="card">\n<div class="rasm"></div>\n<h3>Tog\' sayohati</h3>\n<p>Ikki kunlik sayohat</p>', None, 'yopilgan'),
      ('1-4', '<nav class="navbar"><a class="logo">Kitobxon</a><div class="menu"><a class="link">Bosh sahifa</a><a class="link">Katalog</a></div><a class="link">Aloqa</a><a class="btn">Kirish</a></nav>', None, 'ichida'),
      ('6-1', None, '', 'column'),
      ('6-1', None, '.login{display:flex}', 'column'),
      ('6-1', None, '.login{display:flex;flex-direction:column;gap:10px}', 'align-items'),
      ('6-2', None, '.layout{display:flex;gap:16px}', '160px'),
      ('6-2', None, '.layout{display:flex;gap:16px}.sidebar{width:160px}', 'flex: 1'),
      ('6-2', None, '.layout{display:flex;gap:16px}.sidebar{width:160px}.content{width:100%}', None),
      ('6-3', None, '.tours{display:flex;gap:16px}', 'flex-wrap'),
      ('6-3', None, '.tours{display:flex;flex-wrap:wrap;column-gap:16px}', 'qatorlar'),
      ('6-4', None, '', 'column'),
      ('6-4', None, '.card{display:flex;flex-direction:column}', 'margin-top: auto'),
      ('6-4', None, '.cards{flex-direction:column}', 'yonma-yon'),
      ('6-5', None, '.navbar{display:flex;align-items:center;gap:24px}', 'margin-left: auto'),
      ('6-5', None, '.navbar{display:flex;align-items:center;gap:24px;justify-content:space-between}', 'justify-content'),
      ('8-1', None, '', 'user'),
      ('1-1', '<div class="kard"><div class="rasm"></div><h3>Tog\' sayohati</h3><p>Ikki kunlik sayohat</p></div>', None, 'hali yo'),
    ]
    for lid, h, c, want in cases:
        m = diag(ix(lid), h, c)
        ok = (m != 'OK') if want is None else (m == 'OK') if want == 'OK' else (want in m)
        print(('  ok  ' if ok else '  BAD ') + lid, '|', str(c if c is not None else h)[:50].replace('\n', ' '), '->', m)
        if not ok: fails.append(f'diag {lid}: wanted "{want}" got "{m}"')

    # UI oqimi: 1-1 ni sichqoncha bilan o'tish
    pg.evaluate('localStorage.clear()'); pg.reload()
    pg.screenshot(path=str(shots/'1-map.png'))
    pg.click('.tile.now')
    pg.fill('#nmName', 'Test Bola'); pg.click('#nmGo')
    pg.wait_for_selector('.ov-leaf')
    for el in pg.query_selector_all('.ov-leaf'): el.click()
    pg.screenshot(path=str(shots/'2-kor-group.png'))
    pg.click('#korOpts .btn-main'); pg.click('#korNext')
    pg.wait_for_selector('#yozPane:not([hidden])')
    pg.click('#btnCheck'); pg.screenshot(path=str(shots/'3-yoz-error.png'))
    pg.click('#btnHint'); pg.click('#btnHint'); pg.click('#btnHint')
    pg.screenshot(path=str(shots/'4-yoz-hint.png'))
    ta = pg.locator('#ed textarea'); ta.click(); pg.keyboard.press('Control+Home')
    pg.keyboard.type('<div class="card">'); pg.keyboard.press('Enter'); pg.keyboard.press('Control+End')
    pg.keyboard.press('Enter'); pg.keyboard.type('</div>')
    pg.wait_for_selector('#win:not([hidden])', timeout=4000)
    pg.wait_for_timeout(900); pg.screenshot(path=str(shots/'5-win.png'))
    st = pg.evaluate('JSON.parse(localStorage.getItem("quti-ustasi-v1")).done["1-1"].stars')
    if st != 1: fails.append('stars after 3 hints should be 1, got %s' % st)
    pg.click('#wNext'); pg.wait_for_selector('.ov-leaf')

    # boshqa ekranlar
    pg.goto(url + '?ochiq'); pg.evaluate('localStorage.clear()'); pg.reload()
    def openl(lid): pg.evaluate('i=>QU_DEV.open(i)', ix(lid)); pg.wait_for_timeout(150)
    openl('2-2'); pg.screenshot(path=str(shots/'6-kor-pick.png'))
    openl('3-4'); pg.screenshot(path=str(shots/'7-kor-zone.png'))
    openl('4-2'); pg.click('#stepper [data-s=yoz]'); pg.click('#btnOut'); pg.wait_for_timeout(150); pg.screenshot(path=str(shots/'8-yoz-css-outline.png'))
    openl('7-4'); pg.click('#stepper [data-s=yoz]'); pg.wait_for_timeout(150); pg.screenshot(path=str(shots/'9-final.png'))
    openl('5-3'); pg.screenshot(path=str(shots/'10-kor-5-3.png'))
    # final bob: oldingi darajadagi O'Z kodi keyingisiga o'tishi
    r = pg.evaluate('''()=>{const L=QU.levels, i=L.findIndex(l=>l.id==="7-1"); QU_DEV.open(i);
      const mine=L[i].html.replace('<nav class="navbar">','<div class="navbar">').replace('</nav>','</div>');
      const ok=QU_DEV.check(mine, L[i].css).ok; document.querySelector('#ed textarea').value=mine;
      return ok}''')
    if not r: fails.append('7-1 div-navbar variant should pass')
    # muharrir: Tab va Enter
    openl('2-1'); pg.click('#stepper [data-s=yoz]')
    ta = pg.locator('#ed textarea'); ta.click(); pg.keyboard.press('Control+A'); pg.keyboard.type('.row {'); pg.keyboard.press('Enter'); pg.keyboard.type('display: flex;'); pg.keyboard.press('Enter'); pg.keyboard.type('gap: 12px;'); pg.keyboard.press('Enter'); pg.keyboard.type('}')
    v = ta.input_value()
    if v != '.row {\n  display: flex;\n  gap: 12px;\n}': fails.append('editor indent: ' + repr(v))
    pg.wait_for_selector('#win:not([hidden])', timeout=4000)
    st = pg.evaluate('JSON.parse(localStorage.getItem("quti-ustasi-v1")).done["2-1"].stars')
    if st != 3: fails.append('2-1 clean solve should be 3 stars, got %s' % st)
    pg.click('#wMap'); pg.wait_for_selector('.tile.done')
    # hisobot: xato, podskazka, Ko'r xatosi yozilishi
    pg.evaluate('localStorage.clear()'); pg.goto(url + '?ochiq'); pg.wait_for_timeout(200)
    openl('2-1')
    pg.evaluate('''()=>{const b=[...document.querySelectorAll('#korOpts .chip')].find(c=>c.textContent.includes('.box')); b.click();}''')
    pg.click('#stepper [data-s=yoz]')
    ta = pg.locator('#ed textarea'); ta.click(); pg.keyboard.press('Control+A'); pg.keyboard.type('.box { display: flex; }')
    pg.click('#btnCheck'); pg.click('#btnHint')
    openl('3-1'); pg.click('#stepper [data-s=yoz]'); ta.click(); pg.keyboard.press('Control+A'); pg.keyboard.type('.card h3 { margin: 20px; }'); pg.click('#btnCheck')
    pg.click('#btnMap'); pg.click('#btnRep'); pg.fill('#repName', 'Ali Valiyev'); pg.wait_for_timeout(150)
    rep = pg.input_value('#repText'); print('\n--- REPORT ---\n' + rep + '\n---')
    for need in ['Ali Valiyev', "Flex'ni otaga emas, bolaga yozadi: 1 marta", "padding o'rniga bolalarga margin yozadi", '2.1 Ota va bolalar', '1 podskazka', "1 ta xato javob"]:
        if need not in rep: fails.append('report missing: ' + need)
    if 'Ali' not in pg.get_attribute('#repTg', 'href') and 'Ali%20Valiyev' not in pg.get_attribute('#repTg', 'href'): fails.append('telegram link without report')
    pg.screenshot(path=str(shots/'12-report.png'))
    pg.keyboard.press('Escape')
    # imtihon: podskazka yo'q, yulduz xatolar bo'yicha
    openl('8-5')
    if pg.is_visible('#btnHint'): fails.append('hint visible in exam')
    if pg.is_enabled('#stepper [data-s=kor]'): fails.append('kor enabled in exam')
    pg.screenshot(path=str(shots/'13-exam.png'))
    # sertifikat
    pg.evaluate('''()=>{const S=JSON.parse(localStorage.getItem('quti-ustasi-v1')); QU.levels.forEach(l=>{S.done[l.id]={stars:l.imtihon&&l.id!=='8-2'?3:(l.id==='8-2'?2:3),d:Date.now()}}); localStorage.setItem('quti-ustasi-v1',JSON.stringify(S));}''')
    pg.goto(url); pg.wait_for_timeout(200)
    pg.locator('.cert-row').scroll_into_view_if_needed(); pg.screenshot(path=str(shots/'14-map-cert.png'))
    pg.click('#btnCert'); pg.wait_for_timeout(200); pg.screenshot(path=str(shots/'15-cert.png'))
    pg.emulate_media(media='print'); pg.wait_for_timeout(150)
    pg.pdf(path=str(shots/'cert.pdf'), landscape=True, print_background=True, prefer_css_page_size=True)
    pg.emulate_media(media='screen')
    import subprocess
    pages = subprocess.run(['python3', '-c', "import pypdf,sys;print(len(pypdf.PdfReader(sys.argv[1]).pages))", str(shots/'cert.pdf')], capture_output=True, text=True).stdout.strip()
    print('cert pdf pages:', pages or '(pypdf yo\'q)')
    if pages and pages != '1': fails.append('certificate prints on %s pages' % pages)
    if errs: fails.append('console errors: ' + ' | '.join(errs[:5]))
    # localStorage yo'q muhit
    ctx = b.new_context(viewport={'width': 1280, 'height': 720})
    ctx.add_init_script("Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked')}})")
    p2 = ctx.new_page(); e2 = []; p2.on('pageerror', lambda e: e2.append(str(e)))
    p2.goto(url); p2.click('.tile.now'); p2.fill('#nmName', 'Test Bola'); p2.click('#nmGo'); p2.wait_for_selector('.ov-leaf')
    if e2: fails.append('no-localStorage errors: ' + ' | '.join(e2[:3]))
    p2.set_viewport_size({'width': 1024, 'height': 640}); p2.wait_for_timeout(200); p2.screenshot(path=str(shots/'11-small.png'))
    b.close()
print('\nFAILS:' if fails else '\nALL OK')
for f in fails: print('  -', f)
sys.exit(1 if fails else 0)
