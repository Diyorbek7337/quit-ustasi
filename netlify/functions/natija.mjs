// Quti Ustasi: o'quvchi natijasini ustozning Telegram'iga yuboradi.
// Netlify'dagi maxfiy o'zgaruvchilar: TG_TOKEN (bot tokeni), TG_CHAT_ID (ustozning chat raqami).
const MAX = 3800;
const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });
const text = (s, status = 200) => new Response(s, { status, headers: { 'content-type': 'text/plain; charset=utf-8' } });
const tg = (token, method, body) => fetch('https://api.telegram.org/bot' + token + '/' + method, body
  ? { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }
  : undefined).then(r => r.json()).catch(() => ({ ok: false }));

export default async (req) => {
  const token = process.env.TG_TOKEN, chat = process.env.TG_CHAT_ID, url = new URL(req.url);

  if (req.method === 'GET') {
    if (!url.searchParams.has('sozlash')) return json({ ok: true, tayyor: !!(token && chat) });
    if (!token) return text("TG_TOKEN hali qo'yilmagan. Netlify: Project configuration -> Environment variables.", 500);
    if (chat) return text("Hammasi sozlangan: TG_CHAT_ID bor. Bu sahifa endi hech narsa ko'rsatmaydi.");
    const d = await tg(token, 'getUpdates');
    const chats = new Map();
    (d.result || []).forEach(u => {
      const c = ((u.message || u.edited_message || u.my_chat_member || u.channel_post || {}).chat);
      if (c) chats.set(c.id, c.title || [c.first_name, c.last_name].filter(Boolean).join(' ') || c.username || '');
    });
    if (!chats.size) return text("Botga hali hech kim yozmagan. Telegram'da botingni ochib /start yoz, keyin shu sahifani yangila.");
    return text("Shu raqamni Netlify'da TG_CHAT_ID qilib yoz:\n\n" + [...chats].map(([id, n]) => id + '   ' + n).join('\n'));
  }

  if (req.method !== 'POST') return json({ ok: false, error: 'method' }, 405);
  const origin = req.headers.get('origin');
  if (origin && new URL(origin).host !== url.host) return json({ ok: false, error: 'origin' }, 403);
  if (!token || !chat) return json({ ok: false, error: 'sozlanmagan' }, 503);

  let b;
  try { b = await req.json(); } catch { return json({ ok: false, error: 'json' }, 400); }
  const msg = String((b && b.text) || '').trim(), name = String((b && b.name) || '').trim();
  if (!msg || !name || msg.length > MAX) return json({ ok: false, error: 'matn' }, 400);

  const d = await tg(token, 'sendMessage', { chat_id: chat, text: msg, disable_web_page_preview: true });
  return json({ ok: !!d.ok }, d.ok ? 200 : 502);
};

export const config = { path: '/api/natija' };
