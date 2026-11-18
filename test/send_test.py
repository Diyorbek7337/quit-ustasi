# O'yindan natija yuborilishini tekshirish: sahifa http orqali ochiladi, /api/natija soxta qilinadi.
import json, pathlib, threading, http.server, functools, sys
from playwright.sync_api import sync_playwright
root = pathlib.Path(__file__).resolve().parent.parent
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 8765), functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(root/'public')))
threading.Thread(target=srv.serve_forever, daemon=True).start()
fails, posts, mode = [], [], {'status': 503}
def handle(route):
    posts.append(json.loads(route.request.post_data)); route.fulfill(status=mode['status'], body='{}', content_type='application/json')
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
    pg = b.new_page(viewport={'width': 1366, 'height': 768}); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.route('**/api/natija', handle)
    pg.goto('http://127.0.0.1:8765/'); pg.evaluate('localStorage.clear()'); pg.reload()
    # ism so'rash
    pg.click('.tile.now'); pg.wait_for_selector('#nmName')
    pg.click('#nmGo')
    if 'need' not in (pg.get_attribute('#nmName', 'class') or ''): fails.append('empty name accepted')
    pg.fill('#nmName', 'Ali Valiyev'); pg.fill('#nmGr', 'Frontend 3'); pg.click('#nmGo'); pg.wait_for_selector('.ov-leaf')
    # 1-bobning 4 darajasi tayyor, 1-5 ni yechamiz
    pg.evaluate('''()=>{const S=QU_DEV.state(); ['1-1','1-2','1-3','1-4'].forEach(id=>S.done[id]={stars:3,d:Date.now()}); S.stats['1-3']={h:2,k:1,c:3,e:{joy:3},t:400};}''')
    ids = pg.evaluate('QU.levels.map(l=>l.id)')
    pg.evaluate('i=>QU_DEV.open(i)', ids.index('1-5')); pg.click('#stepper [data-s=yoz]') if pg.is_enabled('#stepper [data-s=yoz]') else None
    pg.evaluate('''()=>{const S=QU_DEV.state(); S.kor['1-5']=true;}''')
    pg.evaluate('i=>QU_DEV.open(i)', ids.index('1-5'))
    sol = pg.evaluate("QU.levels.find(l=>l.id==='1-5').html")
    ta = pg.locator('#ed textarea'); ta.fill(sol); pg.wait_for_selector('#win:not([hidden])', timeout=4000); pg.wait_for_timeout(400)
    if len(posts) != 1: fails.append('expected 1 post on chapter end, got %d' % len(posts))
    else:
        t = posts[0]['text']; print('--- 1-bob xabari ---\n' + t + '\n---')
        for need in ['Ali Valiyev — Frontend 3', '1-bob tugadi: Quti ichida quti', '1.3 Quti ichida quti: 2 podskazka', "Elementni noto'g'ri qutiga joylaydi (3)"]:
            if need not in t: fails.append('message missing: ' + need)
    q = pg.evaluate('QU_DEV.state().outbox.length')
    if q != 1: fails.append('503 should keep message in outbox, got %d' % q)
    # server sozlangach qayta ochilganda yuboriladi va qaytarilmaydi
    mode['status'] = 200; posts.clear(); pg.reload(); pg.wait_for_timeout(600)
    if len(posts) != 1 or pg.evaluate('QU_DEV.state().outbox.length') != 0: fails.append('outbox not flushed on reload: %d posts' % len(posts))
    posts.clear(); pg.reload(); pg.wait_for_timeout(500)
    if posts: fails.append('message sent twice')
    # qo'lda yuborish
    pg.click('#btnRep'); pg.wait_for_selector('#repSend'); pg.click('#repSend'); pg.wait_for_timeout(400)
    if not posts or "O'quvchi: Ali Valiyev, Frontend 3" not in posts[-1]['text']: fails.append('manual send failed')
    if pg.inner_text('#repSend') != 'Yuborildi': fails.append('button state: ' + pg.inner_text('#repSend'))
    pg.screenshot(path=str(root/'test/shots/20-report-send.png'))
    if errs: fails.append('errors: ' + ' | '.join(errs))
    b.close()
srv.shutdown()
print('FAILS:' if fails else 'ALL OK'); [print('  -', f) for f in fails]; sys.exit(1 if fails else 0)
