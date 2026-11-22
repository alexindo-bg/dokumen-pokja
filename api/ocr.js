import { init, me, send } from '../lib/s.js';

// Pembacaan screenshot papan peringkat dengan model visi (opsional).
// Aktif hanya bila env ANTHROPIC_API_KEY terisi di Vercel. Env opsional: ANTHROPIC_MODEL.
const PROMPT = `Ini screenshot daftar "Peringkat Evaluasi" dari Katalog Elektronik (INAPROC). Ekstrak setiap kartu peringkat menjadi JSON array. Field tiap elemen:
- rank: angka peringkat (integer)
- produk: nama "Produk Tayang" persis seperti tertulis
- tkdn: angka persen TKDN (number) atau null
- hea: Total HEA dalam rupiah (integer tanpa titik/koma desimal)
- nilai: Total Penawaran dalam rupiah (integer)
- status: teks status (mis. "Penawaran Kalah") atau ""
- alasan: alasan penolakan; bila ada kategori dan keterangan tulis "Kategori: keterangan"; bila tidak ada tulis ""
Salin angka dengan teliti. Balas HANYA dengan JSON array, tanpa teks lain.`;

export default async function handler(req, res) {
  try {
    await init();
    if (!me(req)) return send(res, 401, { error: 'Belum masuk' });
    const key = process.env.ANTHROPIC_API_KEY;
    if (req.query.a === 'status') return send(res, 200, { enabled: !!key });
    if (!key) return send(res, 400, { error: 'ANTHROPIC_API_KEY belum diisi di Vercel' });
    if (req.method !== 'POST') return send(res, 405, { error: 'Metode tidak didukung' });
    const { image, media } = req.body || {};
    if (!image || typeof image !== 'string' || image.length > 6e6) return send(res, 400, { error: 'Gambar tidak valid atau terlalu besar' });
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-5-5', max_tokens: 3000, messages: [{ role: 'user', content: [{ type: 'image', source: { type: 'base64', media_type: media || 'image/jpeg', data: image } }, { type: 'text', text: PROMPT }] }] }),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) return send(res, 502, { error: 'Layanan AI menolak: ' + (j.error?.message || r.status) });
    const txt = (j.content || []).map((c) => c.text || '').join('').replace(/```json|```/g, '').trim();
    let rows; try { rows = JSON.parse(txt.slice(txt.indexOf('['), txt.lastIndexOf(']') + 1)); } catch { return send(res, 502, { error: 'Jawaban AI tidak dapat dibaca sebagai tabel' }); }
    rows = (Array.isArray(rows) ? rows : []).slice(0, 60).map((x) => ({ rank: String(x.rank ?? ''), produk: String(x.produk || ''), tkdn: x.tkdn == null ? '' : String(x.tkdn), hea: Math.round(+x.hea || 0), nilai: Math.round(+x.nilai || 0), status: String(x.status || ''), alasan: String(x.alasan || '') }));
    return send(res, 200, { rows });
  } catch (e) { return send(res, 500, { error: 'Kesalahan server: ' + e.message }); }
}
