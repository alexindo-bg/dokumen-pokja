import { db, init, me, send, sign, unsign } from '../lib/s.js';

// Koneksi Google Drive (OAuth milik admin). File tersimpan atas nama akun Google yang dihubungkan.
const FOLDER = () => process.env.DRIVE_FOLDER_ID || '1gH1W8_4h1zM6RxoqkIxsSHFhkK_TSWyg';
const origin = (req) => `https://${req.headers['x-forwarded-host'] || req.headers.host}`;
const form = (o) => new URLSearchParams(o).toString();
const post = (b) => fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: form(b) }).then((r) => r.json());

const G = 'https://www.googleapis.com/drive/v3', FLAGS = { supportsAllDrives: 'true', includeItemsFromAllDrives: 'true' }, MFOLDER = 'application/vnd.google-apps.folder';
const q1 = (s) => String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
async function gj(url, H) { const r = await fetch(url, { headers: H }); const j = await r.json().catch(() => ({})); if (!r.ok) throw new Error(j.error?.message || 'Drive error ' + r.status); return j; }
// subfolder di dalam folder utama (dibuat bila belum ada); tanpa nama = folder utama
async function subfolder(name, H) {
  name = String(name || '').replace(/[\\/:*?"<>|]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80);
  if (!name) return { id: FOLDER(), name: '' };
  const j = await gj(G + '/files?' + form({ q: `name='${q1(name)}' and '${FOLDER()}' in parents and mimeType='${MFOLDER}' and trashed=false`, fields: 'files(id,name)', ...FLAGS }), H);
  if (j.files[0]) return { id: j.files[0].id, name };
  const r = await fetch(G + '/files?supportsAllDrives=true', { method: 'POST', headers: { ...H, 'Content-Type': 'application/json' }, body: JSON.stringify({ name, mimeType: MFOLDER, parents: [FOLDER()] }) });
  const c = await r.json().catch(() => ({})); if (!r.ok) throw new Error(c.error?.message || 'Gagal membuat folder'); return { id: c.id, name };
}
// berkas hanya boleh diakses bila berada di folder utama atau satu tingkat di bawahnya
async function inTree(id, H) {
  const m = await gj(`${G}/files/${id}?` + form({ fields: 'id,name,mimeType,size,parents', supportsAllDrives: 'true' }), H), par = m.parents || [];
  if (par.includes(FOLDER())) return m;
  for (const pid of par.slice(0, 2)) { const pm = await gj(`${G}/files/${pid}?` + form({ fields: 'parents', supportsAllDrives: 'true' }), H); if ((pm.parents || []).includes(FOLDER())) return m; }
  const e = new Error('Berkas di luar folder dokumen Pokja'); e.code = 403; throw e;
}
const MIME = { doc: 'application/vnd.google-apps.document', sheet: 'application/vnd.google-apps.spreadsheet', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' };

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
      const b = req.body || {}, f = await subfolder(b.sub, H), meta = { name: String(b.name || 'dokumen').slice(0, 200), parents: [f.id] };
      if (b.gdoc) meta.mimeType = MIME.doc; // HTML diunggah lalu dikonversi menjadi Google Docs
      const r = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&supportsAllDrives=true&fields=id,name,mimeType,webViewLink', { method: 'POST', headers: { ...H, 'Content-Type': 'application/json; charset=UTF-8', 'X-Upload-Content-Type': b.type || 'application/octet-stream', Origin: origin(req) }, body: JSON.stringify(meta) });
      const loc = r.headers.get('location');
      return loc ? send(res, 200, { url: loc, folder: f }) : send(res, 502, { error: 'Google menolak: ' + (await r.text()).slice(0, 200) });
    }
    if (a === 'tree') {
      const fo = (await gj(G + '/files?' + form({ q: `'${FOLDER()}' in parents and mimeType='${MFOLDER}' and trashed=false`, fields: 'files(id,name)', orderBy: 'name', pageSize: '60', ...FLAGS }), H)).files || [];
      const ids = [FOLDER(), ...fo.map((x) => x.id)];
      const fl = (await gj(G + '/files?' + form({ q: `(${ids.map((i) => `'${i}' in parents`).join(' or ')}) and mimeType!='${MFOLDER}' and trashed=false`, fields: 'files(id,name,mimeType,size,modifiedTime,webViewLink,parents)', orderBy: 'modifiedTime desc', pageSize: '300', ...FLAGS }), H)).files || [];
      return send(res, 200, { root: FOLDER(), folders: fo, files: fl });
    }
    if (a === 'get') {
      const id = String(req.query.id || ''); if (!/^[\w-]{10,}$/.test(id)) return send(res, 400, { error: 'ID berkas tidak valid' });
      const m = await inTree(id, H); let url, name = m.name;
      if (m.mimeType === MIME.doc) { url = `${G}/files/${id}/export?` + form({ mimeType: MIME.docx }); name += '.docx'; }
      else if (m.mimeType === MIME.sheet) { url = `${G}/files/${id}/export?` + form({ mimeType: MIME.xlsx }); name += '.xlsx'; }
      else if (m.mimeType.startsWith('application/vnd.google-apps')) return send(res, 415, { error: 'Jenis berkas Google ini belum bisa dibaca (gunakan Docs/Sheets/PDF/Word/Excel).' });
      else { if (+m.size > 4.2e6) return send(res, 413, { error: 'Berkas lebih dari 4 MB — unduh lalu unggah manual.' }); url = `${G}/files/${id}?alt=media&supportsAllDrives=true`; }
      const r = await fetch(url, { headers: H }); if (!r.ok) return send(res, 502, { error: 'Gagal mengunduh dari Drive (' + r.status + ')' });
      const buf = Buffer.from(await r.arrayBuffer()); if (buf.length > 4.3e6) return send(res, 413, { error: 'Berkas lebih dari 4 MB — unduh lalu unggah manual.' });
      res.statusCode = 200; res.setHeader('Content-Type', 'application/octet-stream'); res.setHeader('X-File-Name', encodeURIComponent(name)); res.setHeader('Cache-Control', 'no-store'); return res.end(buf);
    }
    if (a === 'del' && req.method === 'POST') {
      if (!u.admin) return send(res, 403, { error: 'Khusus admin' });
      const r = await fetch(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(String((req.body || {}).id))}?supportsAllDrives=true`, { method: 'PATCH', headers: { ...H, 'Content-Type': 'application/json' }, body: JSON.stringify({ trashed: true }) });
      return r.ok ? send(res, 200, { ok: 1 }) : send(res, 502, { error: 'Gagal menghapus' });
    }
    return send(res, 404, { error: 'Tidak ditemukan' });
  } catch (e) { return send(res, e.code === 403 ? 403 : 500, { error: e.message }); }
}
