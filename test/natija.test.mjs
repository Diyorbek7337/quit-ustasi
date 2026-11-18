// Netlify funksiyasini Telegram'siz sinash: fetch soxta qilinadi.
import assert from 'node:assert/strict';
const mod = await import(new URL('../netlify/functions/natija.mjs', import.meta.url));
const fn = mod.default;
let calls = [];
globalThis.fetch = async (u, o) => { calls.push({ u, o }); const m = String(u).split('/').pop();
  if (m === 'getUpdates') return { json: async () => ({ ok: true, result: [{ message: { chat: { id: 123456, first_name: 'Diyorbek' } } }] }) };
  return { json: async () => ({ ok: true }) }; };
const R = (method, body, headers = {}) => new Request('https://quti-ustasi.netlify.app/api/natija' + (method === 'SETUP' ? '?sozlash' : ''),
  { method: method === 'SETUP' ? 'GET' : method, headers: { 'content-type': 'application/json', ...headers }, body: body ? JSON.stringify(body) : undefined });

delete process.env.TG_TOKEN; delete process.env.TG_CHAT_ID;
let r = await fn(R('POST', { name: 'Ali', text: 'salom' })); assert.equal(r.status, 503, 'sozlanmagan -> 503');
process.env.TG_TOKEN = 'T:abc';
r = await fn(R('SETUP')); let t = await r.text(); assert.match(t, /123456/, 'sozlash chat id ko\'rsatadi');
process.env.TG_CHAT_ID = '123456';
r = await fn(R('SETUP')); t = await r.text(); assert.doesNotMatch(t, /123456/, 'sozlangach chat id ko\'rinmaydi');
calls = [];
r = await fn(R('POST', { name: 'Ali', text: 'salom' })); assert.equal(r.status, 200);
assert.equal(calls.length, 1); const sent = JSON.parse(calls[0].o.body);
assert.equal(sent.chat_id, '123456'); assert.equal(sent.text, 'salom'); assert.match(calls[0].u, /botT:abc\/sendMessage$/);
r = await fn(R('POST', { name: '', text: 'salom' })); assert.equal(r.status, 400, 'ismsiz -> 400');
r = await fn(R('POST', { name: 'Ali', text: 'x'.repeat(5000) })); assert.equal(r.status, 400, 'uzun -> 400');
r = await fn(R('POST', { name: 'Ali', text: 'salom' }, { origin: 'https://boshqa-sayt.uz' })); assert.equal(r.status, 403, 'begona sayt -> 403');
r = await fn(new Request('https://quti-ustasi.netlify.app/api/natija', { method: 'POST', body: '{buzuq' })); assert.equal(r.status, 400, 'buzuq json');
r = await fn(R('PUT', { a: 1 })); assert.equal(r.status, 405);
r = await fn(R('GET')); assert.deepEqual(await r.json(), { ok: true, tayyor: true });
console.log('natija funksiyasi: hammasi OK');
