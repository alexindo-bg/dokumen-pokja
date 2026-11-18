import crypto from 'node:crypto';
import { db, init, sign, me, hashPw, send, cookie } from '../lib/s.js';

export default async function handler(req, res) {
  try {
    await init();
    const a = req.query.a;
    if (a === 'me') { const u = me(req); return send(res, 200, { user: u && { id: u.id, name: u.name, email: u.email, admin: u.admin } }); }
    if (a === 'logout') { res.setHeader('Set-Cookie', cookie('', 0)); return send(res, 200, { ok: 1 }); }
    if (req.method !== 'POST') return send(res, 405, { error: 'Metode tidak didukung' });
    const b = req.body || {};
    const email = String(b.email || '').trim().toLowerCase();
    const pw = String(b.password || '');

    if (a === 'register') {
      const code = String(b.ref || '').trim().toUpperCase();
      const name = String(b.name || '').trim();
      if (!name || !/^\S+@\S+\.\S+$/.test(email) || pw.length < 8) return send(res, 400, { error: 'Isi nama, email valid, dan sandi minimal 8 karakter.' });
      // Verifikasi kode referral: atomik, kuota tidak bisa terlampaui
      const r = await db.execute({ sql: 'UPDATE refs SET used=used+1 WHERE code=? AND used<max', args: [code] });
      if (!r.rowsAffected) return send(res, 403, { error: 'Kode referral tidak valid atau kuotanya sudah habis.' });
      const salt = crypto.randomBytes(16).toString('hex');
      const first = Number((await db.execute('SELECT COUNT(*) c FROM users')).rows[0].c) === 0;
      try {
        const ins = await db.execute({ sql: 'INSERT INTO users(email,name,salt,hash,ref,admin) VALUES(?,?,?,?,?,?)', args: [email, name, salt, hashPw(pw, salt), code, first ? 1 : 0] });
        const u = { id: Number(ins.lastInsertRowid), name, email, admin: first ? 1 : 0, exp: Date.now() + 30 * 864e5 };
        res.setHeader('Set-Cookie', cookie(sign(u), 2592000));
        return send(res, 200, { user: { id: u.id, name, email, admin: u.admin } });
      } catch {
        await db.execute({ sql: 'UPDATE refs SET used=used-1 WHERE code=?', args: [code] });
        return send(res, 409, { error: 'Email sudah terdaftar.' });
      }
    }
    if (a === 'login') {
      const row = (await db.execute({ sql: 'SELECT * FROM users WHERE email=?', args: [email] })).rows[0];
      const ok = row && crypto.timingSafeEqual(Buffer.from(hashPw(pw, row.salt)), Buffer.from(row.hash));
      if (!ok) return send(res, 401, { error: 'Email atau sandi salah.' });
      const u = { id: Number(row.id), name: row.name, email, admin: Number(row.admin), exp: Date.now() + 30 * 864e5 };
      res.setHeader('Set-Cookie', cookie(sign(u), 2592000));
      return send(res, 200, { user: { id: u.id, name: u.name, email, admin: u.admin } });
    }
    return send(res, 404, { error: 'Tidak ditemukan' });
  } catch (e) { return send(res, 500, { error: 'Kesalahan server: ' + e.message }); }
}
