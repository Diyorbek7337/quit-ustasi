import pathlib
r = pathlib.Path(__file__).parent
shell = (r/'src/shell.html').read_text(encoding='utf-8')
lv = (r/'src/levels.js').read_text(encoding='utf-8')
en = (r/'src/engine.js').read_text(encoding='utf-8')
assert '</script' not in lv.lower() and '</script' not in en.lower()
out = shell.replace('/*__LEVELS__*/', lv).replace('/*__ENGINE__*/', en)
for d in ('dist', 'public'):
    (r/d).mkdir(exist_ok=True)
(r/'dist/quti-ustasi.html').write_text(out, encoding='utf-8')
(r/'public/index.html').write_text(out, encoding='utf-8')
print('built', len(out), 'bytes')
