import crypto from 'node:crypto';
import { db, init, sign, me, hashPw, send, cookie } from '../lib/s.js';

const AVATARS = 24, THEMES = ['biru', 'hitam', 'pink', 'hijau', 'ungu', 'oranye', 'merah', 'teal', 'emas', 'abu'];
const PERAN = ['pokja', 'ppk'];
const pub = (r) => ({ id: Number(r.id), name: r.name, email: r.email, admin: Number(r.admin), nip: r.nip || '', avatar: Number(r.avatar) || 0, theme: THEMES.includes(r.theme) ? r.theme : 'biru', peran: PERAN.includes(r.peran) ? r.peran : 'pokja' });
const session = (res, r) => { const u = pub(r); res.setHeader('Set-Cookie', cookie(sign({ id: u.id, name: u.name, email: u.email, admin: u.admin, exp: Date.now() + 30 * 864e5 }), 2592000)); return u; };
const cleanNip = (s) => String(s || '').replace(/[^\d]/g, '');
const avatarOf = (v) => { const n = Math.floor(Number(v)); return n >= 0 && n < AVATARS ? n : 0; };

export default async function handler(req, res) {
  try {
    await init();
    const a = req.query.a;
    if (a === 'me') {
      const u = me(req);
      if (!u) return send(res, 200, { user: null });
      const row = (await db.execute({ sql: 'SELECT * FROM users WHERE id=?', args: [u.id] })).rows[0];
      return send(res, 200, { user: row ? pub(row) : null });
    }
    if (a === 'logout') { res.setHeader('Set-Cookie', cookie('', 0)); return send(res, 200, { ok: 1 }); }
    if (req.method !== 'POST') return send(res, 405, { error: 'Metode tidak didukung' });
    const b = req.body || {};
    const email = String(b.email || '').trim().toLowerCase();
    const pw = String(b.password || '');

    if (a === 'register') {
      const code = String(b.ref || '').trim().toUpperCase();
      const name = String(b.name || '').trim();
      const nip = cleanNip(b.nip);
      if (!name || !/^\S+@\S+\.\S+$/.test(email) || pw.length < 8) return send(res, 400, { error: 'Isi nama lengkap, email valid, dan sandi minimal 8 karakter.' });
      if (nip.length < 8) return send(res, 400, { error: 'Isi NIP (hanya angka, biasanya 18 digit).' });
      const r = await db.execute({ sql: 'UPDATE refs SET used=used+1 WHERE code=? AND used<max', args: [code] });
      if (!r.rowsAffected) return send(res, 403, { error: 'Kode referral tidak valid atau kuotanya sudah habis.' });
      const salt = crypto.randomBytes(16).toString('hex');
      const first = Number((await db.execute('SELECT COUNT(*) c FROM users')).rows[0].c) === 0;
      const theme = THEMES.includes(b.theme) ? b.theme : 'biru', peran = PERAN.includes(b.peran) ? b.peran : 'pokja';
      try {
        const ins = await db.execute({ sql: 'INSERT INTO users(email,name,salt,hash,ref,admin,nip,avatar,theme,peran) VALUES(?,?,?,?,?,?,?,?,?,?)', args: [email, name, salt, hashPw(pw, salt), code, first ? 1 : 0, nip, avatarOf(b.avatar), theme, peran] });
        const row = (await db.execute({ sql: 'SELECT * FROM users WHERE id=?', args: [Number(ins.lastInsertRowid)] })).rows[0];
        return send(res, 200, { user: session(res, row) });
      } catch {
        await db.execute({ sql: 'UPDATE refs SET used=used-1 WHERE code=?', args: [code] });
        return send(res, 409, { error: 'Email sudah terdaftar.' });
      }
    }
    if (a === 'login') {
      const row = (await db.execute({ sql: 'SELECT * FROM users WHERE email=?', args: [email] })).rows[0];
      const ok = row && crypto.timingSafeEqual(Buffer.from(hashPw(pw, row.salt)), Buffer.from(row.hash));
      if (!ok) return send(res, 401, { error: 'Email atau sandi salah.' });
      return send(res, 200, { user: session(res, row) });
    }
    if (a === 'profile') {
      const u = me(req);
      if (!u) return send(res, 401, { error: 'Belum masuk' });
      const name = String(b.name || '').trim(), nip = cleanNip(b.nip);
      if (!name) return send(res, 400, { error: 'Nama lengkap wajib diisi.' });
      await db.execute({ sql: 'UPDATE users SET name=?,nip=?,avatar=?,theme=?,peran=? WHERE id=?', args: [name, nip, avatarOf(b.avatar), THEMES.includes(b.theme) ? b.theme : 'biru', PERAN.includes(b.peran) ? b.peran : 'pokja', u.id] });
      const row = (await db.execute({ sql: 'SELECT * FROM users WHERE id=?', args: [u.id] })).rows[0];
      return send(res, 200, { user: session(res, row) });
    }
    return send(res, 404, { error: 'Tidak ditemukan' });
  } catch (e) { return send(res, 500, { error: 'Kesalahan server: ' + e.message }); }
}
