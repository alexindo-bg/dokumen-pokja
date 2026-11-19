import { db, init, me, send, sign, unsign } from '../lib/s.js';

// Koneksi Google Drive (OAuth milik admin). File tersimpan atas nama akun Google yang dihubungkan.
const FOLDER = () => process.env.DRIVE_FOLDER_ID || '1gH1W8_4h1zM6RxoqkIxsSHFhkK_TSWyg';
const origin = (req) => `https://${req.headers['x-forwarded-host'] || req.headers.host}`;
const form = (o) => new URLSearchParams(o).toString();
const post = (b) => fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: form(b) }).then((r) => r.json());

async function access() {
  const r = (await db.execute("SELECT v FROM kv WHERE k='gd_refresh'")).rows[0];
  if (!r) throw new Error('Google Drive belum terhubung. Admin: klik "Hubungkan Google Drive".');
  const j = await post({ client_id: process.env.GOOGLE_CLIENT_ID, client_secret: process.env.GOOGLE_CLIENT_SECRET, refresh_token: r.v, grant_type: 'refresh_token' });
  if (!j.access_token) throw new Error('Akses Google ditolak (' + (j.error_description || j.error) + '). Hubungkan ulang.');
  return j.access_token;
}

export default async function handler(req, res) {
  try {
    await init();
    const u = me(req), a = req.query.a;
    if (!u) return a === 'cb' || a === 'auth' ? res.redirect(302, '/') : send(res, 401, { error: 'Belum masuk' });

    if (a === 'status') {
      const r = (await db.execute("SELECT 1 FROM kv WHERE k='gd_refresh'")).rows[0];
      return send(res, 200, { configured: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET), connected: !!r, admin: !!u.admin, folder: FOLDER() });
    }
    if (a === 'auth') {
      if (!u.admin) return send(res, 403, { error: 'Khusus admin' });
      const q = form({ client_id: process.env.GOOGLE_CLIENT_ID, redirect_uri: origin(req) + '/api/drive?a=cb', response_type: 'code', scope: 'https://www.googleapis.com/auth/drive', access_type: 'offline', prompt: 'consent', state: sign({ k: 'gd', exp: Date.now() + 6e5 }) });
      return res.redirect(302, 'https://accounts.google.com/o/oauth2/v2/auth?' + q);
    }
    if (a === 'cb') {
      const st = unsign(String(req.query.state || ''));
      if (!u.admin || !st || st.k !== 'gd') return send(res, 400, { error: 'Permintaan tidak valid' });
      const j = await post({ code: String(req.query.code || ''), client_id: process.env.GOOGLE_CLIENT_ID, client_secret: process.env.GOOGLE_CLIENT_SECRET, redirect_uri: origin(req) + '/api/drive?a=cb', grant_type: 'authorization_code' });
      if (!j.refresh_token) return send(res, 400, { error: 'Google tidak memberi refresh token: ' + (j.error_description || 'cabut akses aplikasi di myaccount.google.com/permissions lalu coba lagi.') });
      await db.execute({ sql: "INSERT OR REPLACE INTO kv(k,v) VALUES('gd_refresh',?)", args: [j.refresh_token] });
      return res.redirect(302, '/');
    }

    const tok = await access(), H = { Authorization: 'Bearer ' + tok };
    if (a === 'list') {
      const q = form({ q: `'${FOLDER()}' in parents and trashed=false`, fields: 'files(id,name,mimeType,size,modifiedTime,webViewLink)', orderBy: 'modifiedTime desc', pageSize: '100', supportsAllDrives: 'true', includeItemsFromAllDrives: 'true' });
      const r = await fetch('https://www.googleapis.com/drive/v3/files?' + q, { headers: H });
      const j = await r.json();
      return r.ok ? send(res, 200, { files: j.files }) : send(res, 502, { error: j.error?.message || 'Gagal membaca Drive' });
    }
    if (a === 'init' && req.method === 'POST') {
      const b = req.body || {};
      const r = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&supportsAllDrives=true', { method: 'POST', headers: { ...H, 'Content-Type': 'application/json; charset=UTF-8', 'X-Upload-Content-Type': b.type || 'application/octet-stream', Origin: origin(req) }, body: JSON.stringify({ name: String(b.name || 'dokumen').slice(0, 200), parents: [FOLDER()] }) });
      const loc = r.headers.get('location');
      return loc ? send(res, 200, { url: loc }) : send(res, 502, { error: 'Google menolak: ' + (await r.text()).slice(0, 200) });
    }
    if (a === 'del' && req.method === 'POST') {
      if (!u.admin) return send(res, 403, { error: 'Khusus admin' });
      const r = await fetch(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(String((req.body || {}).id))}?supportsAllDrives=true`, { method: 'PATCH', headers: { ...H, 'Content-Type': 'application/json' }, body: JSON.stringify({ trashed: true }) });
      return r.ok ? send(res, 200, { ok: 1 }) : send(res, 502, { error: 'Gagal menghapus' });
    }
    return send(res, 404, { error: 'Tidak ditemukan' });
  } catch (e) { return send(res, 500, { error: e.message }); }
}
