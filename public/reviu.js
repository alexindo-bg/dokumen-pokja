/* ===== Pemindai koreksi kesesuaian 5 dokumen persiapan + BA Reviu =====
   Dokumen: Permintaan Pemilihan Penyedia (ppp), KAK, HPS, SSUK, SSKK.
   Pembacaan berkas dilakukan di browser (DOCX/XLSX tanpa pustaka luar; PDF memakai pdf.js dari cdnjs).
   Teks dokumen TIDAK disimpan ke server — hanya temuan & koreksi yang tersimpan di surat. */
const RV = [['ppp', 'Permintaan Pemilihan Penyedia', 'PPP'], ['kak', 'Kerangka Acuan Kerja (KAK)', 'KAK'], ['hps', 'Harga Perkiraan Sendiri (HPS)', 'HPS'], ['ssuk', 'Syarat-Syarat Umum Kontrak (SSUK)', 'SSUK'], ['sskk', 'Syarat-Syarat Khusus Kontrak (SSKK)', 'SSKK']];
const RVN = Object.fromEntries(RV.map((x) => [x[0], x[1]])), RVS = Object.fromEntries(RV.map((x) => [x[0], x[2]]));
const RVT = {}; // teks hasil baca per surat: RVT[idSurat][kodeDokumen] = {text, rows, nama}

/* ---------- pembaca berkas ---------- */
async function unzip(buf) {
  const u8 = new Uint8Array(buf), dv = new DataView(buf);
  let e = u8.length - 22; while (e >= 0 && dv.getUint32(e, true) !== 0x06054b50) e--;
  if (e < 0) throw new Error('Bukan berkas Office (.docx/.xlsx) yang valid');
  const n = dv.getUint16(e + 10, true); let p = dv.getUint32(e + 16, true); const files = {};
  for (let i = 0; i < n; i++) {
    if (dv.getUint32(p, true) !== 0x02014b50) break;
    const meth = dv.getUint16(p + 10, true), csz = dv.getUint32(p + 20, true), nlen = dv.getUint16(p + 28, true), elen = dv.getUint16(p + 30, true), clen = dv.getUint16(p + 32, true), off = dv.getUint32(p + 42, true);
    files[new TextDecoder().decode(u8.subarray(p + 46, p + 46 + nlen))] = { meth, csz, off }; p += 46 + nlen + elen + clen;
  }
  const read = async (name) => {
    const f = files[name]; if (!f) return null;
    const s = f.off + 30 + dv.getUint16(f.off + 26, true) + dv.getUint16(f.off + 28, true), data = u8.subarray(s, s + f.csz);
    if (f.meth === 0) return new TextDecoder().decode(data);
    return new Response(new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).text();
  };
  return { names: Object.keys(files), read };
}
const xmlDec = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#(\d+);/g, (m, c) => String.fromCharCode(+c)).replace(/&#x([0-9a-f]+);/gi, (m, c) => String.fromCharCode(parseInt(c, 16))).replace(/&amp;/g, '&');
function docxText(xml) {
  let out = ''; const re = /<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>|<\/w:p>|<w:tab\/>|<w:br\/>|<\/w:tc>|<\/w:tr>/g; let m;
  while ((m = re.exec(xml))) { if (m[1] !== undefined) out += m[1]; else if (m[0] === '</w:p>' || m[0] === '<w:br/>' || m[0] === '</w:tr>') out += '\n'; else if (m[0] === '<w:tab/>') out += '\t'; else out += ' | '; }
  return xmlDec(out).replace(/[ \t]*\|[ \t]*\n/g, '\n').replace(/\n{3,}/g, '\n\n');
}
const colIdx = (r) => { let n = 0; for (const c of r.replace(/\d+/g, '')) n = n * 26 + c.charCodeAt(0) - 64; return n - 1; };
async function xlsxRead(z) {
  const ss = []; const sx = await z.read('xl/sharedStrings.xml');
  if (sx) for (const m of sx.matchAll(/<si>([\s\S]*?)<\/si>/g)) ss.push(xmlDec([...m[1].matchAll(/<t(?:\s[^>]*)?>([^<]*)<\/t>/g)].map((x) => x[1]).join('')));
  const rows = [];
  for (const name of z.names.filter((n) => /^xl\/worksheets\/sheet\d+\.xml$/.test(n)).sort()) {
    const x = await z.read(name), base = rows.length;
    for (const rm of x.matchAll(/<row\b[^>]*?\br="(\d+)"[^>]*>([\s\S]*?)<\/row>/g)) {
      const row = rows[base + +rm[1] - 1] ||= [];
      for (const cm of rm[2].matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
        const a = cm[1], ref = /\br="([A-Z]+\d+)"/.exec(a); if (!ref || cm[2] == null) continue;
        const t = (/\bt="(\w+)"/.exec(a) || [])[1], v = (/<v>([\s\S]*?)<\/v>/.exec(cm[2]) || [])[1];
        let val; if (t === 's') val = ss[+v]; else if (t === 'inlineStr') val = xmlDec([...cm[2].matchAll(/<t(?:\s[^>]*)?>([^<]*)<\/t>/g)].map((q) => q[1]).join('')); else if (v == null) continue; else if (t === 'str') val = xmlDec(v); else val = isNaN(+v) ? v : +v;
        row[colIdx(ref[1])] = val;
      }
    }
  }
  for (let i = 0; i < rows.length; i++) rows[i] ||= [];
  return rows;
}
function loadScript(src) { return new Promise((ok, no) => { if (document.querySelector(`script[src="${src}"]`)) return ok(); const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = () => no(new Error('Gagal memuat pustaka PDF (perlu internet). Tempel teks dokumen sebagai gantinya.')); document.head.append(s); }); }
async function pdfRead(buf) {
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buf) }).promise; let out = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const items = (await (await pdf.getPage(i)).getTextContent()).items, ln = new Map();
    for (const it of items) { const y = Math.round(it.transform[5] / 3); (ln.get(y) || ln.set(y, []).get(y)).push(it); }
    for (const y of [...ln.keys()].sort((a, b) => b - a)) out += ln.get(y).sort((a, b) => a.transform[4] - b.transform[4]).map((t) => t.str).join(' ') + '\n';
    out += '\n';
  }
  return out;
}
async function readDoc(file) {
  const ext = (file.name.split('.').pop() || '').toLowerCase(), nama = file.name;
  if (ext === 'docx') { const z = await unzip(await file.arrayBuffer()), x = await z.read('word/document.xml'); if (!x) throw new Error('word/document.xml tidak ditemukan'); return { text: docxText(x), rows: null, nama }; }
  if (ext === 'xlsx') { const rows = await xlsxRead(await unzip(await file.arrayBuffer())); return { text: rows.map((r) => r.map((c) => c ?? '').join('\t')).join('\n'), rows, nama }; }
  if (ext === 'pdf') { const t = await pdfRead(await file.arrayBuffer()); if (t.replace(/\s/g, '').length < 80) throw new Error('PDF tampaknya hasil scan (tanpa teks). Unggah versi Word/Excel atau tempel teks.'); return { text: t, rows: null, nama }; }
  if (['txt', 'csv', 'md'].includes(ext)) return { text: await file.text(), rows: null, nama };
  if (ext === 'doc' || ext === 'xls') throw new Error('Format .doc/.xls lama belum didukung — simpan sebagai .docx/.xlsx, atau tempel teksnya.');
  throw new Error('Format tidak didukung (gunakan .docx, .xlsx, .pdf, atau .txt).');
}

/* ---------- mesin pemindai ---------- */
const nrm = (s) => String(s).toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim().replace(/\bsatu (ratus|ribu)\b/g, 'se$1');
const rpf = (n) => 'Rp' + Math.round(n).toLocaleString('id-ID') + ',00';
const kata = (n) => cap(tb(Math.round(n))) + ' Rupiah';
const exc = (t, i, a = 60, b = 90) => t.slice(Math.max(0, i - a), i + b).replace(/\s+/g, ' ').trim();
const STOP = new Set(['pengadaan', 'pekerjaan', 'kegiatan', 'paket', 'tahun', 'untuk', 'dengan', 'pada', 'yang', 'anggaran', 'dari']);
const toks = (s) => [...new Set(nrm(s).split(' ').filter((w) => w.length > 3 && !STOP.has(w)))];
const ovl = (a, b) => { const A = toks(a), B = new Set(toks(b)); return A.length ? A.filter((w) => B.has(w)).length / A.length : 1; };
const EJA = [['silahkan', 'silakan'], ['analisa', 'analisis'], ['resiko', 'risiko'], ['ijin', 'izin'], ['kwalitas', 'kualitas'], ['kwantitas', 'kuantitas'], ['merubah', 'mengubah'], ['diantara', 'di antara'], ['sistim', 'sistem'], ['aktifitas', 'aktivitas'], ['obyek', 'objek'], ['subyek', 'subjek'], ['prosentase', 'persentase'], ['standart', 'standar'], ['propinsi', 'provinsi'], ['nopember', 'November'], ['sekedar', 'sekadar'], ['hakekat', 'hakikat'], ['jadual', 'jadwal'], ['praktek', 'praktik'], ['kementrian', 'Kementerian'], ['dipergunakan', null], ['apotik', 'apotek'], ['mengenyampingkan', null]];
const KELENGKAPAN = {
  ppp: [['nama paket', 'nama pekerjaan'], ['hps', 'harga perkiraan sendiri'], ['jadwal', 'batas akhir', 'masa tayang', 'penayangan'], ['kualifikasi', 'persyaratan'], ['evaluasi', 'kriteria'], ['spesifikasi', 'rincian', 'lingkup']],
  kak: [['latar belakang'], ['maksud', 'tujuan'], ['ruang lingkup', 'lingkup pekerjaan'], ['lokasi'], ['jangka waktu', 'waktu pelaksanaan', 'waktu penyelesaian'], ['spesifikasi'], ['sumber dana', 'pendanaan'], ['keluaran', 'output', 'hasil pekerjaan', 'laporan']],
  hps: [['volume', 'vol'], ['satuan'], ['harga satuan'], ['jumlah'], ['ppn'], ['total']],
  ssuk: [['ketentuan umum'], ['hak dan kewajiban', 'hak dan tanggung jawab'], ['jaminan'], ['pembayaran'], ['denda'], ['pemutusan'], ['keadaan kahar', 'force majeure'], ['perselisihan', 'sengketa']],
  sskk: [['nilai kontrak', 'harga kontrak'], ['jangka waktu', 'waktu pelaksanaan'], ['alamat'], ['jaminan'], ['pembayaran'], ['denda'], ['serah terima', 'pho', 'fho'], ['pemeliharaan']],
};
const RVJENIS = { ppp: ['permintaan', 'penyedia'], kak: ['kerangka acuan', 'ruang lingkup', 'kak'], hps: ['harga perkiraan', 'hps', 'harga satuan'], ssuk: ['syarat-syarat umum', 'syarat syarat umum', 'syarat umum', 'ssuk'], sskk: ['syarat-syarat khusus', 'syarat syarat khusus', 'syarat khusus', 'sskk'] };

function rvScan(T, p) {
  const out = [], keys = RV.map((x) => x[0]).filter((k) => T[k] && T[k].text && T[k].text.trim());
  const F = (doc, kat, sev, uraian, koreksi, lok) => out.push({ id: uid(), doc, kat, sev, uraian, koreksi, lok: lok || '', on: true });
  const rupNum = (x) => { const d = String(x).replace(/\D/g, ''); return d ? +d : 0; };
  const hpsRef = rupNum(p.hps), paguRef = rupNum(p.pagu), rupRef = String(p.rup || '').replace(/\D/g, '');
  const A = {}; // fitur per dokumen
  for (const k of keys) {
    const t = T[k].text, tl = t.toLowerCase(), amts = [];
    for (const m of t.matchAll(/Rp\.?\s*([0-9][0-9.,]*)/gi)) {
      let raw = m[1].replace(/[.,]+$/, ''); if (/,\d{1,2}$/.test(raw)) raw = raw.replace(/,\d{1,2}$/, '');
      const val = +raw.replace(/[.,]/g, ''); if (!val || val > 1e15) continue;
      const end = m.index + m[0].length, tm = /^\s*(?:,-)?\s*\(\s*(?:terbilang\s*:?\s*)?([^)]{3,200}?)\s*\)/i.exec(t.slice(end, end + 260));
      amts.push({ val, idx: m.index, ctx: tl.slice(Math.max(0, m.index - 90), m.index), spoken: tm ? tm[1] : null });
    }
    const nums = new Set(amts.map((a) => a.val)); if (T[k].rows) T[k].rows.forEach((r) => (r || []).forEach((c) => typeof c === 'number' && c >= 1000 && nums.add(Math.round(c))));
    A[k] = { t, tl, amts, nums };
  }
  /* 0. jenis berkas */
  for (const k of keys) if (!RVJENIS[k].some((w) => A[k].tl.includes(w))) F(k, 'Kelengkapan', 'tinggi', `Berkas yang dipindai sebagai ${RVS[k]} tidak memuat kata kunci khas dokumen tersebut — kemungkinan berkas salah.`, `Pastikan berkas ${RVN[k]} yang benar yang diunggah.`);
  /* 1. terbilang rupiah */
  for (const k of keys) { const seen = new Set(); for (const a of A[k].amts) { if (!a.spoken || a.val < 1000 || seen.has(a.val)) continue; seen.add(a.val); const sp = nrm(a.spoken).replace(/\brupiah\b/g, '').trim(); if (sp && sp !== nrm(tb(a.val))) F(k, 'Konsistensi angka', 'tinggi', `Nilai ${rpf(a.val)} tidak sama dengan terbilangnya “${a.spoken}”.`, `Ubah terbilang menjadi “${kata(a.val)}” atau perbaiki angkanya.`, exc(A[k].t, a.idx)); } }
  /* 2. HPS / pagu antar dokumen */
  const hpsM = {}; for (const k of keys) hpsM[k] = [...new Set(A[k].amts.filter((a) => /hps|harga perkiraan sendiri/.test(a.ctx)).map((a) => a.val))];
  const allH = keys.flatMap((k) => hpsM[k].map((v) => [k, v]));
  if (hpsRef) { for (const [k, v] of allH) if (v !== hpsRef) F(k, 'Konsistensi angka', 'tinggi', `Nilai HPS pada ${RVS[k]} (${rpf(v)}) berbeda dengan HPS paket (${rpf(hpsRef)}).`, `Ubah menjadi ${rpf(hpsRef)} (${kata(hpsRef)}).`); }
  else { const cnt = {}; allH.forEach(([, v]) => (cnt[v] = (cnt[v] || 0) + 1)); const vs = Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a]); if (vs.length > 1) for (const [k, v] of allH) if (String(v) !== vs[0]) F(k, 'Konsistensi angka', 'tinggi', `Nilai HPS pada ${RVS[k]} (${rpf(v)}) berbeda dengan dokumen lain (${rpf(+vs[0])}).`, `Samakan dengan nilai HPS pada dokumen HPS/yang berlaku.`); }
  if (paguRef) for (const k of keys) for (const a of A[k].amts) if (/pagu/.test(a.ctx) && a.val !== paguRef) { F(k, 'Konsistensi angka', 'sedang', `Nilai pagu pada ${RVS[k]} (${rpf(a.val)}) berbeda dengan pagu paket (${rpf(paguRef)}).`, `Ubah menjadi ${rpf(paguRef)}.`, exc(A[k].t, a.idx)); break; }
  if (A.hps) {
    const mx = Math.max(0, ...[...A.hps.nums].filter((v) => !paguRef || v <= paguRef * 1.2));
    if (hpsRef && !A.hps.nums.has(hpsRef)) F('hps', 'Konsistensi angka', 'tinggi', `Nilai HPS paket (${rpf(hpsRef)}) tidak ditemukan pada dokumen HPS${mx ? `; nilai terbesar yang terbaca ${rpf(mx)}` : ''}.`, `Samakan total HPS dengan ${rpf(hpsRef)} atau perbaiki data paket.`);
  }
  /* 3. HPS (Excel): hitung ulang volume × harga satuan */
  if (T.hps && T.hps.rows) {
    const rows = T.hps.rows, low = (c) => String(c ?? '').toLowerCase(); let hr = -1, iv, ih, ij;
    for (let r = 0; r < Math.min(rows.length, 60) && hr < 0; r++) { const c = (rows[r] || []).map(low); const v = c.findIndex((x) => /^vol(ume)?\b|kuantitas/.test(x)), h = c.findIndex((x) => /harga satuan|^harga\b/.test(x)), j = c.findIndex((x, i) => i !== v && i !== h && /^jumlah|^total/.test(x)); if (v >= 0 && h >= 0 && j >= 0) { hr = r; iv = v; ih = h; ij = j; } }
    if (hr >= 0) {
      let sum = 0, last = 0, sub = 0;
      for (let r = hr + 1; r < rows.length; r++) {
        const row = rows[r] || [], lab = row.map(low).join(' '), v = row[iv], h = row[ih], j = row[ij], nm = row.find((x) => typeof x === 'string' && x.trim()) || '';
        if (typeof v === 'number' && typeof h === 'number' && typeof j === 'number') { const e = v * h; if (Math.abs(e - j) > 1) F('hps', 'Perhitungan', 'tinggi', `Baris ${r + 1} (${String(nm).slice(0, 50)}): volume ${v} × harga ${rpf(h)} = ${rpf(e)}, tertulis ${rpf(j)}.`, `Ubah jumlah menjadi ${rpf(e)}.`); sum += e; last = r; }
        else if (typeof j === 'number' && /^\s*(sub ?total|jumlah|total)/.test(lab.trim()) && !/ppn/.test(lab)) { if (Math.abs(sum - j) > 1 && sum) F('hps', 'Perhitungan', 'tinggi', `Baris ${r + 1} (${String(nm).slice(0, 40)}): jumlah tertulis ${rpf(j)}, hasil penjumlahan baris di atasnya ${rpf(sum)}.`, `Ubah menjadi ${rpf(sum)}.`); sub = j; }
        else if (typeof j === 'number' && /ppn/.test(lab)) { const rm = /(\d{1,2}(?:[.,]\d+)?)\s*%/.exec(lab); const base = sub || sum; if (rm && base) { const rt = +rm[1].replace(',', '.'), e = Math.round((base * rt) / 100); if (Math.abs(e - j) > 1) F('hps', 'Perhitungan', 'sedang', `Baris ${r + 1}: PPN ${rt}% dari ${rpf(base)} seharusnya ${rpf(e)}, tertulis ${rpf(j)}.`, `Ubah PPN menjadi ${rpf(e)}.`); } }
      }
    }
  }
  /* 4. kode RUP, tahun anggaran, sumber dana, PPN, jangka waktu, nama paket */
  const grp = (re, fn) => { const o = {}; for (const k of keys) o[k] = [...new Set([...A[k].t.matchAll(re)].map((m) => fn(m, k)).filter((x) => x != null))]; return o; };
  const cmp = (o, ref, kat, sev, nm, fmt, fixTxt) => {
    const all = keys.flatMap((k) => o[k].map((v) => [k, v]));
    if (ref) { for (const [k, v] of all) if (String(v) !== String(ref)) F(k, kat, sev, `${nm} pada ${RVS[k]} (${fmt(v)}) berbeda dengan data paket (${fmt(ref)}).`, fixTxt(ref)); }
    else { const c = {}; all.forEach(([, v]) => (c[v] = (c[v] || 0) + 1)); const vs = Object.keys(c).sort((a, b) => c[b] - c[a]); if (vs.length > 1) for (const [k, v] of all) if (String(v) !== vs[0]) F(k, kat, sev, `${nm} pada ${RVS[k]} (${fmt(v)}) berbeda dengan dokumen lain (${fmt(vs[0])}).`, fixTxt(vs[0])); }
  };
  cmp(grp(/rup[^0-9\n]{0,30}(\d{5,12})/gi, (m) => m[1]), rupRef, 'Konsistensi data', 'tinggi', 'Kode RUP', (x) => x, (x) => `Samakan dengan Kode RUP ${x}.`);
  cmp(grp(/(?:tahun anggaran|\bt\.?a\.?)\s*\(?(?:ta)?\)?\s*:?\s*(20\d\d)/gi, (m) => m[1]), String(p.tahun || '').trim(), 'Konsistensi data', 'sedang', 'Tahun anggaran', (x) => x, (x) => `Samakan dengan Tahun Anggaran ${x}.`);
  cmp(grp(/(APBN|APBD|PNBP|BLU)/g, (m, k) => (/(dana|anggaran|dibebankan|sumber)/i.test(A[k].t.slice(Math.max(0, m.index - 70), m.index)) ? m[1] : null)), String(p.sumber || '').toUpperCase().match(/APBN|APBD|PNBP|BLU/)?.[0] || '', 'Konsistensi data', 'sedang', 'Sumber dana', (x) => x, (x) => `Samakan sumber dana menjadi ${x}.`);
  cmp(grp(/ppn[^0-9\n]{0,20}(\d{1,2}(?:[.,]\d+)?)\s*%/gi, (m) => m[1].replace(',', '.')), '', 'Konsistensi data', 'sedang', 'Tarif PPN', (x) => x + '%', (x) => `Samakan tarif PPN (${x}%) di seluruh dokumen.`);
  const jw = {}; for (const k of keys) { jw[k] = []; for (const m of A[k].t.matchAll(/(\d{1,3})\s*(?:\(\s*([a-zA-Z ]{2,40}?)\s*\)\s*)?(hari kalender|hari kerja|hari|bulan|minggu)/gi)) { if (!/(waktu|jangka waktu|masa)\s+(pelaksanaan|penyelesaian|kontrak)/i.test(A[k].t.slice(Math.max(0, m.index - 90), m.index))) continue; const n = +m[1], u = m[3].toLowerCase() === 'hari' ? 'hari kalender' : m[3].toLowerCase(); if (m[2] && nrm(m[2]) !== nrm(tb(n))) F(k, 'Konsistensi angka', 'tinggi', `Jangka waktu “${m[0].trim()}”: angka ${n} tidak sama dengan huruf “${m[2]}”.`, `Tulis “${n} (${tb(n)}) ${m[3]}”.`, exc(A[k].t, m.index)); jw[k].push(`${n} ${u}`); } jw[k] = [...new Set(jw[k])]; }
  cmp(jw, '', 'Konsistensi data', 'tinggi', 'Jangka waktu pelaksanaan', (x) => x, (x) => `Samakan jangka waktu pelaksanaan (${x}) di seluruh dokumen.`);
  const labelNm = {};
  for (const k of keys) { labelNm[k] = null; for (const m of A[k].t.matchAll(/nama\s+(?:paket|pekerjaan|kegiatan)\s*[:\-–]\s*([^\n|]{5,220})/gi)) { const v = m[1].trim(); if (p.nama && ovl(p.nama, v) < 0.75) { F(k, 'Konsistensi data', 'tinggi', `Nama paket pada ${RVS[k]} berbeda dengan data paket: “${v.slice(0, 140)}”.`, `Gunakan nama paket: “${p.nama}”.`, exc(A[k].t, m.index, 0, 160)); labelNm[k] = 1; break; } } }
  if (p.nama && toks(p.nama).length >= 2) for (const k of keys) if (k !== 'ssuk' && !labelNm[k] && ovl(p.nama, A[k].tl) < 0.75) F(k, 'Konsistensi data', 'tinggi', `Nama paket tidak ditemukan/berbeda pada ${RVS[k]}.`, `Cantumkan nama paket: “${p.nama}”.`);
  if (p.lokasi && toks(p.lokasi).length) for (const k of keys) if (/lokasi/.test(A[k].tl) && ovl(p.lokasi, A[k].tl) < 0.5) F(k, 'Konsistensi data', 'rendah', `Lokasi pekerjaan “${p.lokasi}” tidak ditemukan pada ${RVS[k]}.`, `Periksa/cantumkan lokasi: ${p.lokasi}.`);
  /* 5. SSUK/SSKK: pasal, rujukan silang, denda */
  const pas = {};
  for (const k of ['ssuk', 'sskk']) {
    if (!A[k]) continue; const nums = [...A[k].t.matchAll(/^[ \t|]*pasal\s+(\d{1,3})\b/gim)].map((m) => +m[1]); pas[k] = nums;
    if (nums.length >= 3) { const u = [...new Set(nums)].sort((a, b) => a - b), miss = []; for (let i = u[0]; i < u[u.length - 1]; i++) if (!u.includes(i)) miss.push(i); if (miss.length) F(k, 'Kelengkapan', 'sedang', `Penomoran Pasal pada ${RVS[k]} tidak berurutan: Pasal ${miss.slice(0, 6).join(', ')} tidak ada.`, 'Periksa penomoran pasal atau lengkapi pasal yang hilang.'); const dup = u.filter((n) => nums.filter((x) => x === n).length > 1); if (dup.length) F(k, 'Kelengkapan', 'sedang', `Judul Pasal ${dup.slice(0, 6).join(', ')} muncul lebih dari sekali pada ${RVS[k]}.`, 'Hapus duplikasi atau perbaiki nomor pasal.'); }
  }
  if (A.sskk && pas.ssuk && pas.ssuk.length >= 3) { const mx = Math.max(...pas.ssuk); for (const m of A.sskk.t.matchAll(/(?:pasal|angka|butir)\s+(\d{1,3})[^.\n]{0,60}ssuk|ssuk[^.\n]{0,40}?(?:pasal|angka|butir)\s+(\d{1,3})/gi)) { const n = +(m[1] || m[2]); if (n > mx) F('sskk', 'Konsistensi data', 'tinggi', `SSKK merujuk Pasal ${n} SSUK, padahal SSUK hanya sampai Pasal ${mx}.`, `Perbaiki rujukan pasal SSUK pada SSKK.`, exc(A.sskk.t, m.index)); } }
  const den = {}; for (const k of ['ssuk', 'sskk']) { if (!A[k]) continue; const i = A[k].tl.indexOf('denda'); if (i < 0) continue; const seg = A[k].t.slice(i, i + 400); let v = null; if (/1\s*‰|satu per seribu/i.test(seg)) v = '1/1000'; else { const m = /(\d+)\s*\/\s*(\d[\d.]*)/.exec(seg); if (m) v = m[1] + '/' + m[2].replace(/\./g, ''); } den[k] = v; if (v && v !== '1/1000') F(k, 'Isi ketentuan', 'rendah', `Denda keterlambatan pada ${RVS[k]} tertulis ${v} (umumnya 1/1000 per hari dari nilai kontrak).`, 'Periksa kesesuaian besaran denda dengan ketentuan/SSUK yang berlaku.', exc(A[k].t, i, 0, 160)); if (!v) F(k, 'Isi ketentuan', 'rendah', `Besaran denda keterlambatan tidak terbaca pada ${RVS[k]}.`, 'Cantumkan besaran denda keterlambatan.'); }
  if (den.ssuk && den.sskk && den.ssuk !== den.sskk) F('sskk', 'Konsistensi data', 'tinggi', `Denda pada SSKK (${den.sskk}) berbeda dengan SSUK (${den.ssuk}).`, 'Samakan besaran denda pada SSUK dan SSKK.');
  /* 6. kelengkapan bagian, isian kosong, ejaan, kata ganda */
  for (const k of keys) {
    for (const g of KELENGKAPAN[k]) if (!g.some((w) => A[k].tl.includes(w))) F(k, 'Kelengkapan', 'sedang', `Bagian “${g[0]}” tidak ditemukan pada ${RVS[k]}.`, `Lengkapi bagian “${g[0]}” pada ${RVN[k]}.`);
    const ph = []; for (const m of A[k].t.matchAll(/\[\s*(?:isi|nama|xx+|\.{2,}|…+)[^\]]{0,40}\]|<\s*(?:nama|isi|tanggal)[^>]{0,40}>|\(\s*isi[^)]{0,40}\)|\bxxx+\b|\bTBD\b|lorem ipsum|_{4,}|\.{5,}|…{2,}/gi)) { const line = A[k].t.slice(A[k].t.lastIndexOf('\n', m.index) + 1, A[k].t.indexOf('\n', m.index) < 0 ? undefined : A[k].t.indexOf('\n', m.index)); if (/\.{5,}\s*\d+\s*$/.test(line.trim())) continue; ph.push(exc(A[k].t, m.index, 40, 50)); }
    if (ph.length) F(k, 'Isian', 'sedang', `Masih ada ${ph.length} isian kosong/placeholder pada ${RVS[k]}.`, 'Isi seluruh bagian yang masih kosong (…..., [isi], xxx).', ph.slice(0, 2).join(' || '));
    const ej = EJA.filter(([w, r]) => r && new RegExp('\\b' + w + '\\b', 'i').test(A[k].t)); if (ej.length) F(k, 'Ejaan', 'rendah', `Ejaan tidak baku pada ${RVS[k]}: ${ej.map(([w]) => w).join(', ')}.`, ej.map(([w, r]) => `${w} → ${r}`).join('; '));
    const dw = [...new Set([...A[k].t.matchAll(/\b(yang|dan|di|untuk|dengan|pada|atau|dari|dalam|oleh|akan)\s+\1\b/gi)].map((m) => m[0].toLowerCase()))]; if (dw.length) F(k, 'Ejaan', 'rendah', `Kata ganda pada ${RVS[k]}: “${dw.slice(0, 4).join('”, “')}”.`, 'Hapus kata yang terulang.');
  }
  const order = Object.fromEntries(RV.map((x, i) => [x[0], i])), sv = { tinggi: 0, sedang: 1, rendah: 2 };
  return out.sort((a, b) => order[a.doc] - order[b.doc] || sv[a.sev] - sv[b.sev]);
}

/* ---------- BA Reviu Dokumen Persiapan ---------- */
TPL.bareviu = { n: 'BA reviu dokumen persiapan (pemindai)', d: 'Pindai kesesuaian Permintaan Pemilihan Penyedia, KAK, HPS, SSUK, SSKK; hasilnya menjadi BA Reviu berisi temuan dan koreksi.', i: '🔎' };
{ const old = { ...TPL }, ord = ['reviu', 'bareviu', 'dmk', 'ubah', 'eval', 'batal', 'nego', 'bukti', 'lap', 'kk'].filter((k) => old[k]); Object.keys(TPL).forEach((k) => delete TPL[k]); ord.forEach((k) => (TPL[k] = old[k])); KEYS.length = 0; KEYS.push(...ord); }
const rvOn = (l) => (l.rvTemuan || []).filter((x) => x.on !== false && (x.uraian || '').trim());
const SEVL = { tinggi: 'Tinggi', sedang: 'Sedang', rendah: 'Rendah' };
R.bareviu = function (l, p) {
  const t = rvOn(l), c = (s) => t.filter((x) => x.sev === s).length, nm = l.kegiatan || p.nama;
  const rows = t.map((x, i) => `<tr><td style="text-align:center">${i + 1}</td><td>${esc(RVS[x.doc] || x.doc)}</td><td>${nl(x.uraian)}${x.lok ? `<br><i style="font-size:9.5pt">“${esc(x.lok.slice(0, 140))}”</i>` : ''}</td><td>${nl(x.koreksi || '')}</td><td style="text-align:center">${SEVL[x.sev] || ''}</td></tr>`).join('');
  const hasT = c('tinggi'), kes = !t.length ? 'dokumen persiapan telah sesuai dan dapat dilanjutkan ke tahap pemilihan penyedia.' : hasT ? `dokumen persiapan <b>belum dapat dilanjutkan</b> ke tahap pemilihan penyedia sebelum PPK memperbaiki temuan, terutama temuan berkategori tinggi, dan menyampaikan kembali dokumen hasil perbaikan kepada Pokja Pemilihan.` : 'dokumen persiapan <b>dapat dilanjutkan</b> dengan ketentuan PPK menindaklanjuti perbaikan sebagaimana tabel di atas.';
  return `<p class=tc style="margin:0">BERITA ACARA REVIU DOKUMEN PERSIAPAN PENGADAAN</p><p class=tc style="font-weight:400;margin-top:4px">Nomor: ${nomor(l)}</p>
  <p>Pada hari ini ${tglKata(l.tgl)}, kami selaku Kelompok Kerja (Pokja) Pemilihan berdasarkan Surat Tugas ${esc(p.pejabatST || S().pejabat)} Nomor: ${esc(p.stNo)} tanggal ${tgl(p.stTgl)}, telah melakukan reviu${(l.rvRonde || 1) > 1 ? ` (reviu ke-${l.rvRonde})` : ''} terhadap dokumen persiapan pengadaan pada:</p>
  ${kv([['Nama Paket', esc(nm)], ['Satuan Kerja', esc([p.satker, p.eselon1].filter(Boolean).join(', '))], ['Nilai Pagu Anggaran', rn(num(p.pagu))], ['Nilai HPS', rn(num(p.hps))], ['Sumber Anggaran', esc(p.sumber)], ['Kode RUP', esc(p.rup)]], 170)}
  <p>Dokumen persiapan yang direviu:</p>${ol(RV.map(([k, n]) => esc(n) + (l.rvDocs && l.rvDocs[k] ? ` <i>(berkas: ${esc(l.rvDocs[k].nama)})</i>` : '')))}
  <p>${t.length ? `Hasil reviu menemukan <b>${t.length}</b> hal yang perlu diperbaiki (${c('tinggi')} tinggi, ${c('sedang')} sedang, ${c('rendah')} rendah), dengan rincian sebagai berikut:` : 'Hasil reviu tidak menemukan ketidaksesuaian pada dokumen persiapan.'}</p>
  ${t.length ? `<table class=b style="margin:6px 0;font-size:10.5pt"><tr><th style="width:30px">No</th><th style="width:15%">Dokumen</th><th>Temuan</th><th style="width:30%">Koreksi / Saran</th><th style="width:9%">Tingkat</th></tr>${rows}</table>` : ''}
  ${l.rvTeratasi && l.rvTeratasi.length ? `<p>Dari hasil reviu sebelumnya, <b>${l.rvTeratasi.length}</b> temuan telah ditindaklanjuti dan dinyatakan sesuai.</p>` : ''}<p>Berdasarkan hasil reviu tersebut, ${kes}</p>
  <p>Demikian Berita Acara Reviu Dokumen Persiapan ini dibuat untuk dipergunakan sebagaimana mestinya.</p>${angTable(l, { num: false })}
  <div style="break-inside:avoid;margin-top:14px"><p style="margin:0">Menerima hasil reviu,</p><p style="margin:0">${esc(p.ppk || 'Pejabat Pembuat Komitmen')}</p><div style="height:54px"></div><p style="margin:0">( ........................................ )</p></div>`;
};
const rvStat = (k) => { const d = L.rvDocs && L.rvDocs[k]; return d ? `✓ ${esc(d.nama)} · ${d.n.toLocaleString('id-ID')} karakter${RVT[L.id] && RVT[L.id][k] ? '' : ' <span class=muted>(unggah ulang untuk memindai lagi)</span>'}` : '<span class=muted>belum ada berkas</span>'; };
FB.bareviu = function () {
  const ts = (L.rvTemuan ||= []), n = rvOn(L);
  const docs = RV.map(([k, nm]) => `<div class=card2><div class=r1><b style="flex:1">${esc(nm)}</b><a data-rv="drive:${k}">dari Drive</a> · <a data-rv="paste:${k}">tempel teks</a></div><input type=file accept=".docx,.xlsx,.pdf,.txt" data-rvf=${k}><div class=muted id="rvs-${k}" style="margin-top:4px">${rvStat(k)}</div><textarea id="rvta-${k}" data-rvt=${k} style="display:none;margin-top:6px" placeholder="Tempel isi ${esc(RVS[k])} di sini…"></textarea></div>`).join('');
  const sel = (i, k, opts) => `<select data-p="rvTemuan.${i}.${k}">${opts.map(([v, t]) => `<option value="${v}" ${ts[i][k] === v ? 'selected' : ''}>${t}</option>`).join('')}</select>`;
  const list = ts.map((x, i) => `<div class=card2 style="${x.on === false ? 'opacity:.55' : ''}"><div class=r1><label class=cbx style="margin:0;flex:1"><input type=checkbox data-rvon=${i} ${x.on === false ? '' : 'checked'}> <b>${i + 1}.</b> <span class=muted>${esc(x.kat || 'Manual')}</span></label><button class=ib data-rv="del:${i}">×</button></div><div class=g2><div><label>Dokumen</label>${sel(i, 'doc', RV.map(([k, nm, s]) => [k, s]))}</div><div><label>Tingkat</label>${sel(i, 'sev', [['tinggi', 'Tinggi'], ['sedang', 'Sedang'], ['rendah', 'Rendah']])}</div></div><label>Temuan</label><textarea data-p="rvTemuan.${i}.uraian">${esc(x.uraian || '')}</textarea><label>Koreksi / saran</label><textarea data-p="rvTemuan.${i}.koreksi">${esc(x.koreksi || '')}</textarea>${x.lok ? `<small class=muted>Kutipan: ${esc(x.lok.slice(0, 160))}</small>` : ''}</div>`).join('');
  return sec(2, 'Dokumen persiapan yang dipindai', `<div class=nfo>Unggah berkas <b>.docx / .xlsx / .pdf / .txt</b> (atau tempel teks). Dibaca di browser Anda; isi dokumen tidak disimpan ke server — hanya temuan dan koreksi yang tersimpan.</div>${docs}<p><button class="btn p" data-rv="scan:0">Pindai kesesuaian</button> <button class=btn data-rv="auto:0" title="Cari 5 dokumen di folder Drive paket ini lalu langsung dipindai">☁ Ambil dari Drive & pindai</button> <span class=muted id=rvmsg>${L.rvScanAt ? `Terakhir dipindai ${new Date(L.rvScanAt).toLocaleString('id-ID')} · ${n.length} temuan aktif` : ''}</span></p>`)
    + rvExtCard()
    + sec(3, `Temuan & koreksi (${n.length} aktif dari ${ts.length})`, (L.rvTeratasi && L.rvTeratasi.length ? `<div class=nfo style="background:#e3f6ea">✓ ${L.rvTeratasi.length} temuan dari pemindaian sebelumnya sudah teratasi (reviu ke-${L.rvRonde || 1}).</div>` : '') + (list || '<p class=muted>Belum ada temuan. Pindai dokumen, atau tambahkan temuan manual.</p>') + '<p><a data-rv="add:0">+ Tambah temuan manual</a>' + (ts.length ? ' · <a data-rv="copy:0">Salin ringkasan (WhatsApp)</a> · <a data-rv="csv:0">Unduh .csv</a>' : '') + '</p>')
    + sec(4, 'Nomor & tanggal', numBox('Tanggal BA'))
    + more('Lainnya — anggota Pokja, teks tambahan, kertas', `${angPanel()}${fx('tambah', 'Paragraf tambahan sebelum kalimat penutup (opsional)', { area: 1 })}${fx('kegiatan', 'Nama Pokja / kegiatan (kosong = nama paket)', { area: 1, ph: (paketOf(L) || {}).nama })}${kertasBln()}`);
};
const _rl4 = renderLetter;
renderLetter = function (l) { let h = _rl4(l); if (l.tpl === 'bareviu' && l.tambah) h = h.replace('<p>Demikian', `<p>${nl(l.tambah)}</p><p>Demikian`); return h; };
const _nl4 = newLetter;
newLetter = function (tpl, from) { const l = _nl4(tpl, from); if (tpl === 'bareviu' && !(from && from.tpl === 'bareviu')) { l.rvTemuan = []; l.rvDocs = {}; } return l; };
const _ms4 = missing;
missing = function () { const m = _ms4(); if (L.tpl === 'bareviu' && !angOf(L).length) m.push(['Anggota Pokja', '#angq']); return m; };
const rvSet = (k, h) => { const e = $('#rvs-' + k); if (e) e.innerHTML = h; };
const _wire4 = wire;
wire = function () {
  _wire4();
  const f = $('#fm'); if (!f || f._rv) return; f._rv = 1;
  f.addEventListener('change', async (e) => {
    const x = e.target;
    if (x.dataset.rvon !== undefined) { L.rvTemuan[+x.dataset.rvon].on = x.checked; rerender(); return; }
    if (!x.dataset.rvf) return; const k = x.dataset.rvf, file = x.files && x.files[0]; if (!file) return;
    rvSet(k, 'Membaca…');
    try { const d = await readDoc(file); (RVT[L.id] ||= {})[k] = d; (L.rvDocs ||= {})[k] = { nama: file.name, n: d.text.length }; rvSet(k, rvStat(k)); }
    catch (err) { rvSet(k, `<span style="color:#b3261e">Gagal: ${esc(err.message)}</span>`); }
  });
  f.addEventListener('input', (e) => { const x = e.target; if (!x.dataset.rvt) return; const k = x.dataset.rvt; (RVT[L.id] ||= {})[k] = { text: x.value, rows: null, nama: '(teks ditempel)' }; (L.rvDocs ||= {})[k] = { nama: '(teks ditempel)', n: x.value.length }; rvSet(k, rvStat(k)); });
  f.addEventListener('click', (e) => {
    const b = e.target.closest('[data-rv]'); if (!b) return; const [c, i] = b.dataset.rv.split(':');
    if (c === 'paste') { const t = $('#rvta-' + i); if (t) t.style.display = t.style.display === 'none' ? '' : 'none'; }
    else if (c === 'add') { (L.rvTemuan ||= []).push({ id: uid(), doc: 'ppp', kat: 'Manual', sev: 'sedang', uraian: '', koreksi: '', on: true }); rerender(); }
    else if (c === 'del') { L.rvTemuan.splice(+i, 1); rerender(); }
    else if (c === 'scan') rvRun();
    else if (c === 'drive') { if (typeof rvFromDrive === 'function') rvFromDrive(i); }
    else if (c === 'auto') { if (typeof rvAuto === 'function') rvAuto(); }
    else if (c === 'use') { const x = ((RVT[L.id] || {})._ext || []).find((y) => y.f === i), p = paketOf(L); if (x && p) { p[x.f] = x.v; dirty(); rerender(); } }
    else if (c === 'useall') { const p = paketOf(L); ((RVT[L.id] || {})._ext || []).filter((y) => !y.cur).forEach((y) => (p[y.f] = y.v)); dirty(); rerender(); }
    else if (c === 'copy') { const t = rvPlain(); (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => setSt('Ringkasan temuan disalin'), () => prompt('Salin teks ini:', t)); }
    else if (c === 'csv') { const q = (v) => '"' + String(v ?? '').replace(/"/g, '""') + '"', csv = ['No,Dokumen,Tingkat,Kategori,Temuan,Koreksi,Aktif', ...(L.rvTemuan || []).map((x, n) => [n + 1, RVS[x.doc] || x.doc, SEVL[x.sev] || '', x.kat || '', x.uraian, x.koreksi, x.on === false ? 'tidak' : 'ya'].map(q).join(','))].join('\r\n'); const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['\ufeff', csv], { type: 'text/csv' })); a.download = 'temuan-reviu-' + today() + '.csv'; a.click(); }
  });
};

/* ---------- menjalankan pemindaian + pembacaan data paket + pelacakan temuan teratasi ---------- */
const rvKey = (x) => x.doc + '|' + x.kat + '|' + nrm(x.uraian).slice(0, 70);
function rvExtract(T, p) {
  const out = [], txt = (k) => (T[k] && T[k].text) || '', all = RV.map((x) => x[0]).filter((k) => txt(k));
  const mode = (arr) => { const c = {}; arr.forEach((v) => (c[v] = (c[v] || 0) + 1)); return Object.keys(c).sort((a, b) => c[b] - c[a])[0]; };
  const add = (f, lb, v, cur, show) => { if (v == null || v === '') return; out.push({ f, lb, v: String(v), show: show || String(v), cur: String(cur || '') === String(v) }); };
  const grab = (re, g = 1) => all.flatMap((k) => [...txt(k).matchAll(re)].map((m) => m[g].trim()));
  add('nama', 'Nama paket', mode(grab(/nama\s+(?:paket|pekerjaan)\s*[:\-–]\s*([^\n|]{5,220})/gi)), p.nama);
  add('rup', 'Kode RUP', mode(grab(/rup[^0-9\n]{0,30}(\d{5,12})/gi)), p.rup);
  add('tahun', 'Tahun anggaran', mode(grab(/(?:tahun anggaran|\bt\.?a\.?)\s*\(?(?:ta)?\)?\s*:?\s*(20\d\d)/gi)), p.tahun);
  const sd2 = mode(all.flatMap((k) => [...txt(k).matchAll(/(APBN|APBD|PNBP|BLU)/g)].filter((m) => /(dana|anggaran|dibebankan|sumber)/i.test(txt(k).slice(Math.max(0, m.index - 70), m.index))).map((m) => m[1]))); add('sumber', 'Sumber dana', sd2, p.sumber);
  add('lokasi', 'Lokasi pekerjaan', mode(grab(/lokasi\s*(?:pekerjaan|pengiriman|kegiatan)?\s*[:\-–]\s*([^\n|]{4,120})/gi)), p.lokasi);
  const amt = (re) => mode(all.flatMap((k) => [...txt(k).matchAll(/Rp\.?\s*([0-9][0-9.,]*)/gi)].filter((m) => re.test(txt(k).slice(Math.max(0, m.index - 90), m.index).toLowerCase())).map((m) => { let r = m[1].replace(/[.,]+$/, ''); if (/,\d{1,2}$/.test(r)) r = r.replace(/,\d{1,2}$/, ''); return r.replace(/[.,]/g, ''); })));
  const h = amt(/hps|harga perkiraan sendiri/), g = amt(/pagu/);
  add('hps', 'Nilai HPS', h, String(p.hps || '').replace(/\D/g, ''), h && rpf(+h)); add('pagu', 'Nilai pagu', g, String(p.pagu || '').replace(/\D/g, ''), g && rpf(+g));
  return out;
}
function rvRun() {
  const T = RVT[L.id] || {}, p = paketOf(L), msg = $('#rvmsg');
  if (!p) { if (msg) msg.textContent = 'Pilih paket dulu.'; return; }
  if (!RV.some(([k]) => T[k] && T[k].text.trim())) { if (msg) msg.textContent = 'Unggah atau tempel minimal satu dokumen dulu.'; return; }
  const prev = (L.rvTemuan || []).filter((x) => x.kat !== 'Manual'), manual = (L.rvTemuan || []).filter((x) => x.kat === 'Manual'), nw = rvScan(T, p), nk = new Map(nw.map((x) => [rvKey(x), x]));
  const off = new Set(prev.filter((x) => x.on === false).map(rvKey)); nw.forEach((x) => { if (off.has(rvKey(x))) x.on = false; });
  L.rvTeratasi = prev.filter((x) => !nk.has(rvKey(x))).map((x) => x.uraian.slice(0, 140));
  L.rvRonde = prev.length || L.rvScanAt ? (L.rvRonde || 1) + 1 : 1; L.rvTemuan = [...nw, ...manual]; L.rvScanAt = Date.now(); T._ext = rvExtract(T, p);
  rerender(); const m2 = $('#rvmsg'); if (m2) m2.textContent = `Selesai dipindai: ${rvOn(L).length} temuan${L.rvTeratasi.length ? `, ${L.rvTeratasi.length} teratasi` : ''}.`;
}
const rvExtCard = () => { const e = (RVT[L.id] || {})._ext; if (!e || !e.length) return ''; const p = paketOf(L) || {}; return sec('2b', 'Data paket yang terbaca dari dokumen', `<table class=ft><tr><th>DATA</th><th>DI PAKET</th><th>DI DOKUMEN</th><th></th></tr>${e.map((x) => `<tr><td>${esc(x.lb)}</td><td class=m>${esc(x.f === 'hps' || x.f === 'pagu' ? (p[x.f] ? rpf(+String(p[x.f]).replace(/\D/g, '')) : '—') : p[x.f] || '—')}</td><td>${esc(x.show)}</td><td>${x.cur ? '✓' : `<a data-rv="use:${x.f}">pakai</a>`}</td></tr>`).join('')}</table><p><a data-rv="useall:0">Pakai semua yang berbeda</a> <span class=muted>— mengubah data paket (berlaku untuk semua surat di paket ini).</span></p>`); };
const rvPlain = () => { const p = paketOf(L) || {}; return `Hasil reviu dokumen persiapan\n${p.nama || ''}\n\n` + rvOn(L).map((x, i) => `${i + 1}. [${RVS[x.doc]} · ${SEVL[x.sev]}] ${x.uraian}\n   → ${x.koreksi || '-'}`).join('\n') + `\n\nTotal ${rvOn(L).length} temuan.`; };
