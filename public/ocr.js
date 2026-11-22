/* ===== Unggah screenshot "Peringkat Evaluasi" Katalog Elektronik → data peserta otomatis =====
   Jalur 1 (default, gratis): OCR di browser dengan Tesseract.js (dimuat dari CDN, gambar tidak dikirim ke server).
   Jalur 2 (opsional): bila admin mengisi ANTHROPIC_API_KEY di Vercel, gambar dibaca model visi (lebih akurat) lewat /api/ocr.
   Apa pun jalurnya, hasil SELALU ditampilkan dulu untuk dicek sebelum dipakai. */
const OCRQ = {}; // OCRQ[idSurat] = {rows:[...], msg}
const ocrNum = (t) => { const m = /R[pP]?\.?\s*([\d.,]+)/.exec(String(t).replace(/[£©|]/g, '')); if (!m) return 0; let r = m[1].replace(/[.,]+$/, ''); if (/,\d{1,2}$/.test(r)) r = r.replace(/,\d{1,2}$/, ''); return +r.replace(/[.,]/g, '') || 0; };
/* words: [{t,x0,y0,x1,y1}] dalam koordinat gambar asli; W,H ukuran gambar asli */
function ocrBoard(words, W, H) {
  let ws = words.map((w) => ({ ...w, yc: (w.y0 + w.y1) / 2, h: w.y1 - w.y0 })).sort((a, b) => a.yc - b.yc || a.x0 - b.x0), merged = [];
  for (let i = 0; i < ws.length; i++) { const w = ws[i]; if (/^[£©|]?R[pP]\.?$/.test(w.t)) { const n = ws.find((q, j) => j !== i && Math.abs(q.yc - w.yc) < 8 && q.x0 >= w.x1 - 2 && q.x0 - w.x1 < 14 && /^[\d.,]{6,}$/.test(q.t)); if (n) { merged.push({ ...w, t: 'Rp' + n.t, x1: n.x1 }); n.used = 1; continue; } } if (!w.used) merged.push(w); }
  ws = merged.filter((w) => !w.used);
  const amt = ws.filter((w) => /^[^A-Za-z0-9]{0,2}R[pP]?\.?[\d.,]{6,}$/.test(w.t) && ocrNum(w.t) >= 1000);
  const rowsA = []; for (const a of amt) { const r = rowsA.find((x) => Math.abs(x.yc - a.yc) < 14); if (r) r.items.push(a); else rowsA.push({ yc: a.yc, items: [a] }); }
  rowsA.sort((a, b) => a.yc - b.yc); rowsA.forEach((r) => r.items.sort((a, b) => a.x0 - b.x0));
  if (!rowsA.length) return [];
  const labels = ws.filter((w) => /^Produk$/i.test(w.t)), cards = rowsA.map((r) => { const lb = labels.filter((l) => l.yc < r.yc - 4 && l.yc > r.yc - 90).sort((a, b) => b.yc - a.yc)[0]; return { r, top: lb ? lb.y0 - 4 : r.yc - 50, label: lb }; });
  cards.forEach((c, i) => { c.bot = i + 1 < cards.length ? cards[i + 1].top - 1 : H; });
  const out = [], goodRank = [];
  cards.forEach((c, i) => {
    const inR = ws.filter((w) => w.yc >= c.top && w.yc <= c.bot), a = c.r.items, hea = a[0], pen = a[1] || a[0], px = c.label ? c.label.x0 : W * 0.1;
    const tk = inR.filter((w) => w.x0 >= px - 8 && w.x0 < px + 40 && /^T[A-Z]{2,3}N?:?$/i.test(w.t) && w.yc > c.r.yc - 8).sort((x, y) => x.yc - y.yc)[0] || inR.filter((w) => /^Jenis$/i.test(w.t)).sort((x, y) => x.yc - y.yc)[0];
    const tkTop = tk ? tk.y0 - 2 : c.r.yc + 10, nameTop = c.label ? c.label.y1 - 1 : c.top + 14;
    const nameW = inR.filter((w) => w.y0 >= nameTop - 3 && w.y1 <= tkTop + 2 && w.x0 >= px - 8 && w.x1 <= hea.x0 - 10 && !(a.includes(w)));
    const nm = []; nameW.sort((x, y) => x.yc - y.yc || x.x0 - y.x0).forEach((w) => { const L = nm[nm.length - 1]; if (L && Math.abs(L.yc - w.yc) < 8) L.ws.push(w); else nm.push({ yc: w.yc, ws: [w] }); });
    const produk = nm.map((l) => l.ws.sort((x, y) => x.x0 - y.x0).map((w) => w.t).join(' ')).join(' ').replace(/\s+/g, ' ').trim();
    const tkLine = tk ? inR.filter((w) => Math.abs(w.yc - tk.yc) < 8).sort((x, y) => x.x0 - y.x0).map((w) => w.t).join(' ') : '', tm = /(\d{1,3}(?:[.,]\d+)?)\s*%/.exec(tkLine);
    const sx = pen.x1 + 30, st = inR.filter((w) => w.x0 > sx && Math.abs(w.yc - c.r.yc) < 22 && !/^[©£|]+$/.test(w.t)).sort((x, y) => x.x0 - y.x0).map((w) => w.t).join(' ').replace(/^[\s\-–—]+$/, '');
    const al = inR.find((w) => /^Alasan$/i.test(w.t)); let alasan = '';
    if (al) { const lw = inR.filter((w) => w.y0 > al.y1 - 1 && w.x0 < W * 0.8 && !(Math.abs(w.yc - al.yc) < 8)).sort((x, y) => x.yc - y.yc || x.x0 - y.x0), ls = []; lw.forEach((w) => { const L = ls[ls.length - 1]; if (L && Math.abs(L.yc - w.yc) < 8) L.ws.push(w); else ls.push({ yc: w.yc, ws: [w] }); }); const tx = ls.map((l) => l.ws.sort((x, y) => x.x0 - y.x0).map((w) => w.t).join(' ')); alasan = tx.length > 1 ? `${tx[0]}: ${tx.slice(1).join(' ')}` : tx[0] || ''; }
    const rk = inR.filter((w) => w.x1 < px - 4 && /^\d{1,3}$/.test(w.t) && Math.abs(w.yc - c.r.yc) < 30).sort((x, y) => Math.abs(x.yc - c.r.yc) - Math.abs(y.yc - c.r.yc))[0];
    if (rk) goodRank.push(+rk.t - i);
    const stN = /kalah/i.test(st) ? 'Penawaran Kalah' : /menang|lolos/i.test(st) ? 'Pemenang' : '';
    out.push({ rank: '', produk, tkdn: tm ? tm[1].replace(',', '.') : '', hea: ocrNum(hea.t), nilai: ocrNum(pen.t), status: stN, alasan: alasan.replace(/\s+/g, ' ').trim() });
  });
  const cnt = {}; goodRank.forEach((g) => (cnt[g] = (cnt[g] || 0) + 1)); const best = Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a])[0];
  if (best !== undefined && +best + 1 > 0) out.forEach((o, i) => (o.rank = String(+best + i)));
  const mag = out.map((o) => String(o.nilai).length), mm = mag.sort((a, b) => mag.filter((v) => v === b).length - mag.filter((v) => v === a).length)[0];
  out.forEach((o) => { if (String(o.nilai).length !== mm || !o.produk || (o.hea && (o.nilai / o.hea > 2 || o.nilai / o.hea < 0.5))) o.warn = 1; });
  return out;
}

/* ---------- OCR di browser (Tesseract.js) & jalur server ---------- */
async function ocrPrep(file, scale, maxW) {
  const bmp = await createImageBitmap(file), sc = scale || 3, w = Math.round(bmp.width * sc), h = Math.round(bmp.height * sc), c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d'); g.imageSmoothingQuality = 'high'; g.drawImage(bmp, 0, 0, w, h); const im = g.getImageData(0, 0, w, h), d = im.data; let lo = 255, hi = 0;
  for (let i = 0; i < d.length; i += 4) { const y = (d[i] * 299 + d[i + 1] * 587 + d[i + 2] * 114) / 1000; d[i] = d[i + 1] = d[i + 2] = y; if (y < lo) lo = y; if (y > hi) hi = y; }
  const k = hi > lo ? 255 / (hi - lo) : 1; for (let i = 0; i < d.length; i += 4) { const v = Math.max(0, Math.min(255, (d[i] - lo) * k)); d[i] = d[i + 1] = d[i + 2] = v; } g.putImageData(im, 0, 0);
  return { canvas: c, W: bmp.width, H: bmp.height, sc };
}
const ocrFlat = (data) => { let ws = data.words; if (!ws || !ws.length) { ws = []; (data.blocks || []).forEach((b) => (b.paragraphs || []).forEach((p) => (p.lines || []).forEach((l) => (l.words || []).forEach((w) => ws.push(w))))); } return ws.map((w) => ({ t: w.text, x0: w.bbox.x0, y0: w.bbox.y0, x1: w.bbox.x1, y1: w.bbox.y1 })).filter((w) => String(w.t).trim()); };
async function ocrTess(file, onp) {
  await loadScript('https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js');
  const p = await ocrPrep(file, 3), wk = await Tesseract.createWorker('eng', 1, { logger: (m) => onp && m.progress != null && onp(m.progress) });
  try { const { data } = await wk.recognize(p.canvas); return ocrBoard(ocrFlat(data).map((w) => ({ ...w, x0: w.x0 / p.sc, x1: w.x1 / p.sc, y0: w.y0 / p.sc, y1: w.y1 / p.sc })), p.W, p.H); } finally { await wk.terminate(); }
}
async function ocrServer(file) {
  const bmp = await createImageBitmap(file), sc = Math.min(1, 1600 / bmp.width), c = document.createElement('canvas'); c.width = Math.round(bmp.width * sc); c.height = Math.round(bmp.height * sc); c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
  const b64 = c.toDataURL('image/jpeg', 0.88).split(',')[1]; return (await api('ocr?a=board', 'POST', { image: b64, media: 'image/jpeg' })).rows;
}
let OCRS = null;
async function ocrFiles(files) {
  const q = (OCRQ[L.id] ||= { rows: [] }), set = (m) => { q.msg = m; const e = $('#ocrmsg'); if (e) e.textContent = m; };
  OCRS ??= await api('ocr?a=status').catch(() => ({ enabled: false }));
  for (let i = 0; i < files.length; i++) {
    set(`Membaca gambar ${i + 1}/${files.length}${OCRS.enabled ? ' (AI)' : ' (OCR di browser, tunggu ±10–30 detik)'}…`);
    try { const rows = OCRS.enabled ? await ocrServer(files[i]) : await ocrTess(files[i], (v) => set(`Gambar ${i + 1}/${files.length}: ${Math.round(v * 100)}%`)); q.rows.push(...rows.map((r) => ({ ...r, rank: String(r.rank ?? ''), nilai: num(r.nilai), hea: num(r.hea) }))); }
    catch (e) { set('Gagal membaca gambar: ' + e.message); return; }
  }
  q.rows.sort((a, b) => (+a.rank || 999) - (+b.rank || 999)); const seen = new Set(); q.rows = q.rows.filter((r) => { const k = r.rank + '|' + r.nilai; if (r.rank && seen.has(k)) return false; seen.add(k); return true; });
  set(q.rows.length ? `${q.rows.length} peserta terbaca — periksa tabel di bawah, perbaiki bila perlu, lalu klik “Pakai”.` : 'Tidak ada baris peringkat yang terbaca. Pastikan screenshot memuat kartu Peringkat dengan Total Penawaran.'); rerender();
}
const ocrToPes = (r) => ({ nama: r.produk || r.nama || '', nilai: num(r.nilai), rank: String(r.rank || ''), hea: num(r.hea), st: r.status && /kalah/i.test(r.status) ? 'Tidak Memenuhi' : 'Memenuhi', ket: r.alasan ? r.alasan : r.status && /kalah/i.test(r.status) ? 'Penawaran Kalah' : 'Memenuhi Syarat' });
function ocrBox() {
  const q = OCRQ[L.id] || { rows: [] }, its = L.items || [], rows = q.rows || [];
  return `<div class=nfo><b>Unggah screenshot papan peringkat</b> (Peringkat Evaluasi di Katalog Elektronik; boleh beberapa gambar).<br><input type=file accept="image/*" multiple data-ocrf><span class=muted id=ocrmsg>${esc(q.msg || '')}</span>${its.length > 1 ? `<br><label style="display:inline">Untuk item:</label> <select data-ocri>${its.map((it, i) => `<option value=${i}>Item ${i + 1}${it.nama ? ' · ' + esc(it.nama) : ''}</option>`).join('')}</select>` : ''}
  ${rows.length ? `<table class=ft style="margin-top:8px"><tr><th>PERINGKAT</th><th>NAMA (produk tayang)</th><th>TOTAL PENAWARAN</th><th>STATUS / ALASAN</th><th></th></tr>${rows.map((r, i) => `<tr style="${r.warn ? 'background:#fff3cf' : ''}"><td><input data-ocrc="${i}.rank" value="${esc(r.rank)}" style="width:54px"></td><td><input data-ocrc="${i}.produk" value="${esc(r.produk)}"></td><td><input data-ocrc="${i}.nilai" value="${esc(r.nilai || '')}"></td><td><input data-ocrc="${i}.status" value="${esc(r.status)}" placeholder="status"><input data-ocrc="${i}.alasan" value="${esc(r.alasan)}" placeholder="alasan penolakan"></td><td><button class=ib data-ocra="del:${i}">×</button></td></tr>`).join('')}</table><p class=muted>Baris kuning = angka/nama tampak janggal, periksa. Nama yang terbaca adalah <i>produk tayang</i>; ganti dengan nama penyedia bila perlu.</p><p><button class="btn p" data-ocra="use:replace">Pakai (ganti daftar peserta)</button> <button class=btn data-ocra="use:add">Tambahkan ke daftar</button> <a data-ocra="clear:0">Kosongkan</a></p>` : ''}</div>`;
}
{ const o = FB.eval; FB.eval = () => o().replace('<h5>2 · Peserta & hasil evaluasi</h5>', '<h5>2 · Peserta & hasil evaluasi</h5>' + ocrBox() + `<div class=fld>${chk('papan', 'Tampilkan tabel “Papan Peringkat Kompetisi” di BA', true)}</div>`); }
const _wire8 = wire;
wire = function () {
  _wire8(); const f = $('#fm'); if (!f || f._ocr) return; f._ocr = 1;
  f.addEventListener('change', (e) => { const x = e.target; if (x.dataset.ocrf !== undefined && x.files && x.files.length) { ocrFiles([...x.files]); x.value = ''; } });
  f.addEventListener('input', (e) => { const d = e.target.dataset.ocrc; if (!d) return; const [i, k] = d.split('.'); OCRQ[L.id].rows[+i][k] = k === 'nilai' ? num(e.target.value) : e.target.value; });
  f.addEventListener('click', (e) => { const b = e.target.closest('[data-ocra]'); if (!b) return; const [c, v] = b.dataset.ocra.split(':'), q = OCRQ[L.id];
    if (c === 'del') { q.rows.splice(+v, 1); rerender(); } else if (c === 'clear') { q.rows = []; q.msg = ''; rerender(); }
    else if (c === 'use') { const sel = f.querySelector('[data-ocri]'), k = sel ? +sel.value : 0, it = L.items[k]; const rows = q.rows.map(ocrToPes); it.pes = v === 'add' ? [...(it.pes || []), ...rows] : rows; it.pes.sort((a, b) => (+a.rank || 999) - (+b.rank || 999)); it.win = ''; q.rows = []; q.msg = `${rows.length} peserta dimasukkan.`; dirty(); rerender(); } });
};
