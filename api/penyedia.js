import { init, me, send } from '../lib/s.js';

// Penarik daftar penyedia dari https://penyedia.ukpbj.com/ (dijalankan di server agar tidak terhalang CORS).
//   ?a=index           -> daftar halaman kabupaten/kota ({slugs:[...]})
//   ?a=wil&slug=xxx    -> penyedia pada satu halaman kabupaten/kota ({rows:[{n,l}]})
const BASE = 'https://penyedia.ukpbj.com';
const txt = (h) => h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/\s+/g, ' ').trim();
const get = async (u) => { const r = await fetch(u, { headers: { 'user-agent': 'Mozilla/5.0 DokumenPokja', accept: 'text/html' } }); if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); };
function parseRows(html, lokDefault) {
  const out = [];
  for (const tr of html.match(/<tr[\s\S]*?<\/tr>/gi) || []) {
    const cells = (tr.match(/<td[\s\S]*?<\/td>/gi) || []).map(txt).filter((c) => c !== '');
    if (!cells.length) continue;
    const c = cells[0] && /^\d+\.?$/.test(cells[0]) ? cells.slice(1) : cells;
    if (c[0] && c[0].length > 2) out.push({ n: c[0], l: c[1] && c[1].length < 60 ? c[1] : lokDefault });
  }
  return out;
}
export default async function handler(req, res) {
  try {
    await init();
    if (!me(req)) return send(res, 401, { error: 'Belum masuk' });
    if (req.query.a === 'index') {
      const h = await get(BASE + '/');
      const slugs = [...new Set([...h.matchAll(/href=["'](?:https?:\/\/penyedia\.ukpbj\.com)?\/kabupaten\/([^"'#?\s]+)["']/gi)].map((m) => m[1]))];
      return send(res, 200, { slugs });
    }
    if (req.query.a === 'wil') {
      const slug = String(req.query.slug || '').replace(/[^a-z0-9\-]/gi, ''); if (!slug) return send(res, 400, { error: 'slug kosong' });
      const lok = slug.replace(/^kota-kota-/, 'Kota ').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      let rows = parseRows(await get(`${BASE}/kabupaten/${slug}`), lok);
      for (let pg = 2; pg <= 40; pg++) { // halaman berikutnya, bila ada
        let more; try { more = parseRows(await get(`${BASE}/kabupaten/${slug}?page=${pg}`), lok); } catch { break; }
        const have = new Set(rows.map((x) => x.n)); const nw = more.filter((x) => !have.has(x.n)); if (!nw.length) break; rows = rows.concat(nw);
      }
      return send(res, 200, { rows, lok });
    }
    return send(res, 400, { error: 'Aksi tidak dikenal' });
  } catch (e) { return send(res, 502, { error: 'Gagal mengambil dari penyedia.ukpbj.com: ' + e.message }); }
}
