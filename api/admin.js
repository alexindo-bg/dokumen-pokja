import crypto from 'node:crypto';
import { db, init, me, send } from '../lib/s.js';

// Kelola kode referral (hanya admin = pengguna pertama yang mendaftar).
export default async function handler(req, res) {
  try {
    await init();
    const u = me(req);
    if (!u || !u.admin) return send(res, 403, { error: 'Khusus admin' });
    if (req.method === 'POST') {
      const b = req.body || {};
      const code = String(b.code || '').trim().toUpperCase() || crypto.randomBytes(4).toString('hex').toUpperCase();
      await db.execute({ sql: 'INSERT OR REPLACE INTO refs(code,max,used) VALUES(?,?,COALESCE((SELECT used FROM refs WHERE code=?),0))', args: [code, Math.max(1, +b.max || 1), code] });
    }
    if (req.method === 'DELETE') await db.execute({ sql: 'DELETE FROM refs WHERE code=?', args: [String(req.query.code || '')] });
    const rows = (await db.execute('SELECT code,max,used FROM refs ORDER BY rowid DESC')).rows;
    return send(res, 200, { refs: rows.map((r) => ({ code: r.code, max: Number(r.max), used: Number(r.used) })) });
  } catch (e) { return send(res, 500, { error: 'Kesalahan server: ' + e.message }); }
}
