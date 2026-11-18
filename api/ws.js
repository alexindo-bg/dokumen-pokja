import { db, init, me, send } from '../lib/s.js';

// Satu ruang kerja bersama untuk semua anggota Pokja (nomor surat & pengaturan berlaku untuk semua).
export default async function handler(req, res) {
  try {
    await init();
    if (!me(req)) return send(res, 401, { error: 'Belum masuk' });
    if (req.method === 'GET') {
      const r = (await db.execute('SELECT v,json FROM ws WHERE id=1')).rows[0];
      return send(res, 200, r ? { v: Number(r.v), data: JSON.parse(r.json) } : { v: 0, data: null });
    }
    if (req.method === 'PUT') {
      const { v, data } = req.body || {};
      if (!data) return send(res, 400, { error: 'Data kosong' });
      const json = JSON.stringify(data);
      if (v === 0) {
        const r = await db.execute({ sql: 'INSERT OR IGNORE INTO ws(id,v,json) VALUES(1,1,?)', args: [json] });
        return r.rowsAffected ? send(res, 200, { v: 1 }) : send(res, 409, { error: 'Data sudah diubah anggota lain. Muat ulang.' });
      }
      const r = await db.execute({ sql: 'UPDATE ws SET v=v+1,json=? WHERE id=1 AND v=?', args: [json, v] });
      return r.rowsAffected ? send(res, 200, { v: v + 1 }) : send(res, 409, { error: 'Data sudah diubah anggota lain. Muat ulang.' });
    }
    return send(res, 405, { error: 'Metode tidak didukung' });
  } catch (e) { return send(res, 500, { error: 'Kesalahan server: ' + e.message }); }
}
