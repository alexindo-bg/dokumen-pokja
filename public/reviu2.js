/* ===== Reviu v2: cakupan mengikuti format "Draft BA Reviu" =====
   8 kelompok reviu → tabel No | Uraian | Catatan/Pembahasan + "Rekomendasi/hasil catatan reviu".
   9 slot dokumen: PPP, KAK/Spesifikasi, HPS, Rancangan Kontrak, SSUK, SSKK, Dokumen Anggaran, RUP, Analisis Pasar. */
{
  const add = [['kontrak', 'Rancangan Kontrak / Surat Pesanan', 'Rancangan Kontrak'], ['anggaran', 'Dokumen Anggaran Belanja (DIPA/POK)', 'Dokumen Anggaran'], ['rup', 'ID Paket RUP (SiRUP)', 'RUP'], ['pasar', 'Analisis Pasar', 'Analisis Pasar']];
  const all = Object.fromEntries([...RV, ...add].map((x) => [x[0], x])); all.kak[1] = 'Spesifikasi Teknis / Kerangka Acuan Kerja (KAK)'; all.ppp[1] = 'Permintaan Pemilihan Penyedia / Undangan Mini Kompetisi';
  RV.length = 0; ['ppp', 'kak', 'hps', 'kontrak', 'ssuk', 'sskk', 'anggaran', 'rup', 'pasar'].forEach((k) => RV.push(all[k])); RV.forEach(([k, n, s]) => { RVN[k] = n; RVS[k] = s; });
  Object.assign(RVJENIS, { kontrak: ['kontrak', 'surat pesanan', 'perjanjian'], anggaran: ['dipa', 'dpa', 'rka', 'anggaran', 'pok'], rup: ['rup', 'sirup', 'paket'], pasar: ['pasar', 'penyedia', 'survei', 'analisis'] });
  Object.assign(KELENGKAPAN, { kak: [], kontrak: [['para pihak', 'pihak'], ['nilai', 'harga'], ['pembayaran'], ['denda', 'sanksi']], anggaran: [['dipa', 'dpa', 'rka']], rup: [['rup'], ['pagu']], pasar: [['penyedia']] });
}
const RVG = [
  { id: 'kak', judul: 'Reviu terhadap Spesifikasi Teknis/Kerangka Acuan Kerja (KAK) untuk Pengadaan Barang', items: [
    { no: 1, docs: ['kak'], uraian: 'Memeriksa apakah:\n- Spesifikasi teknis;\n- gambaran umum;\n- Kerangka Acuan Kerja (KAK)\nsudah dituangkan secara lengkap dan jelas sehingga memungkinkan bagi peserta untuk memahami dan mampu menyusun penawaran dengan baik.' },
    { no: 2, docs: ['kak'], uraian: 'Memeriksa ruang lingkup pekerjaan sudah dituangkan dengan jelas dan rinci.' },
    { no: 3, docs: ['kak', 'ppp'], uraian: 'Memeriksa apakah Spesifikasi Teknis/ Gambar/KAK/DED telah menguraikan hal-hal sebagai berikut, antara lain:\n- Kesesuaian spesifikasi teknis dan/atau gambar dengan kebutuhan;\n- Karakteristik: ukuran, dimensi, bentuk, bahan, warna, komposisi, dan lain lain;\n- Kinerja: ketahanan, efisiensi, batas pemakaian, dan lain lain;\n- Barang/jasa merupakan barang produksi dalam negeri yang dibuktikan dengan adanya kandungan Tingkat Komponen Dalam Negeri (TKDN) sesuai dengan ketentuan yang berlaku;\n- Barang/jasa merupakan produk yang diproduksi oleh usaha mikro dan kecil serta koperasi;\n- Standar atas barang/jasa yang digunakan seperti SNI, JIS, ASTM, ISO, produk ramah lingkungan dan lain lain;\n- Validitas: standar yang digunakan sudah tepat dan sesuai;\n- Pengepakan dan cara pengiriman disesuaikan dengan sifat dan/atau jenis barang;\n- Jangka waktu pelaksanaan harus sesuai dengan metode pelaksanaan;\n- Mencantumkan syarat-syarat bahan yang dipergunakan dalam pelaksanaan pekerjaan;\n- Mencantumkan syarat-syarat pengujian bahan dan hasil produk;\n- Mencantumkan kriteria kinerja produk (output performance) yang diinginkan; atau\n- Mencantumkan tata cara pengukuran dan tata cara pembayaran.' },
    { no: 4, docs: ['kak', 'ppp'], uraian: 'Memeriksa kesesuaian Spesifikasi Teknis/KAK dengan struktur kategori produk pada Katalog Elektronik (kategori Level I s.d. Level III) beserta atribut produk yang wajib diisi, sehingga seluruh persyaratan teknis dapat ditayangkan secara utuh pada sistem dan tidak ada persyaratan yang hilang saat diinput.' },
    { no: 5, docs: ['kak'], uraian: 'Memeriksa kesesuaian data calon penerima bantuan (CPCL), lokasi titik bagi, dan status verifikasinya.' }] },
  { id: 'hps', judul: 'Reviu terhadap Harga Perkiraan Sendiri (HPS)', items: [
    { no: 1, docs: ['hps'], uraian: 'Memeriksa apakah nilai total HPS tidak melebihi nilai pagu anggaran.' },
    { no: 2, docs: ['hps'], uraian: 'Memeriksa apakah unsur pembayaran sudah sesuai dengan Spesifikasi Teknis/KAK dan lingkup pekerjaan.' },
    { no: 3, docs: ['hps'], uraian: 'Memeriksa apakah nilai total HPS telah memperhitungkan kewajiban pajak sesuai ketentuan perpajakan yang berlaku.' },
    { no: 4, docs: ['hps'], uraian: 'Memeriksa dasar penyusunan HPS dan kewajaran harga.' }] },
  { id: 'kon', judul: 'Reviu terhadap Rancangan Kontrak', items: [
    { no: 1, docs: ['kontrak', 'ssuk', 'sskk'], uraian: 'Memeriksa apakah Rancangan Surat Pesanan/Rancangan Kontrak sudah dituangkan secara lengkap dan benar terkait paket pengadaan, sumber dana, nilai kontrak termasuk pajak (PPN), jenis kontrak, waktu pelaksanaan, dan lain-lain.' },
    { no: 2, docs: ['ssuk'], uraian: 'Memeriksa Syarat-Syarat Umum Kontrak (SSUK).' },
    { no: 3, docs: ['sskk'], uraian: 'Memeriksa Syarat-Syarat Khusus Kontrak (SSKK).' },
    { no: 4, docs: ['ssuk', 'sskk', 'kontrak'], uraian: 'Memeriksa bahwa pengadaan ini memerlukan Uang Muka, Jaminan Pengadaan, Sertifikat Garansi, Sertifikat/Dokumen lain, Ketentuan Penyesuaian Harga dan Dokumen Pendukung Pengadaan Lain yang mengacu pada ketentuan yang berlaku.' }] },
  { id: 'ang', judul: 'Reviu terhadap Dokumen Anggaran Belanja', items: [
    { no: 1, docs: ['anggaran'], uraian: 'DIPA/DPA atau RKA-KL/RKA-PD sudah ditetapkan.' },
    { no: 2, docs: ['anggaran'], uraian: 'Anggaran untuk pekerjaan sudah tersedia dan memadai.' },
    { no: 3, docs: ['anggaran', 'rup'], uraian: 'Mata Anggaran Keluaran (MAK) telah sesuai dan dapat direalisasikan.' }] },
  { id: 'rup', judul: 'Reviu terhadap ID Paket RUP (Rencana Umum Pengadaan)', items: [
    { no: 1, docs: ['rup'], uraian: 'Memeriksa Kode Paket RUP apakah sudah tersedia dan telah diumumkan dalam SiRUP.' },
    { no: 2, docs: ['rup'], uraian: 'Memeriksa kesesuaian dengan metode pemilihan di RUP.' }] },
  { id: 'wkt', judul: 'Reviu terhadap Waktu Pengadaan Barang/Jasa', items: [
    { no: 1, docs: ['kak', 'rup', 'kontrak', 'sskk'], uraian: 'Memastikan pelaksanaan waktu pengadaan barang/jasa telah sesuai dengan waktu rencana penggunaan/pemanfaatan barang/jasa.' }] },
  { id: 'pas', judul: 'Reviu terhadap Analisis Pasar', items: [
    { no: 1, docs: ['pasar'], uraian: 'Memastikan ketersediaan barang/jasa dan pelaku usaha dalam negeri yang mampu dan memenuhi persyaratan.' }] },
  { id: 'kual', judul: 'Reviu terhadap Kualifikasi Penyedia, Uraian Pekerjaan, dan Identifikasi Risiko', items: [
    { no: 1, docs: ['kak', 'ppp'], uraian: 'Memeriksa persyaratan kualifikasi penyedia.' },
    { no: 2, docs: ['kak', 'ppp'], uraian: 'Memeriksa persyaratan teknis penyedia.' },
    { no: 3, docs: ['ppp', 'kak'], uraian: 'Memeriksa kesiapan dokumen untuk pelaksanaan Mini Kompetisi pada Katalog Elektronik.' },
    { no: 4, docs: ['kak', 'hps', 'kontrak', 'ssuk', 'sskk', 'ppp', 'anggaran', 'rup', 'pasar'], uraian: 'Mengidentifikasi risiko pelaksanaan pekerjaan.' }] },
];
const RVITEMS = RVG.flatMap((g) => g.items.map((i) => ({ id: g.id + '.' + i.no, g: g.id, ...i })));
const RVITEM = Object.fromEntries(RVITEMS.map((i) => [i.id, i]));
const RVDEF = { ppp: 'kual.3', kak: 'kak.1', hps: 'hps.1', kontrak: 'kon.1', ssuk: 'kon.2', sskk: 'kon.3', anggaran: 'ang.1', rup: 'rup.1', pasar: 'pas.1' };
function rvMap(f) {
  if (f.item && RVITEM[f.item]) return f.item; const u = f.uraian || '', d = f.doc;
  if (/Kode RUP/.test(u)) return 'rup.1'; if (/Tahun anggaran/i.test(u)) return 'ang.1'; if (/Sumber dana/i.test(u)) return 'kon.1';
  if (/PPN|pajak/i.test(u)) return 'hps.3'; if (/jangka waktu|waktu pelaksanaan/i.test(u)) return 'wkt.1';
  if (/HPS|pagu/i.test(u) && d !== 'hps') return 'hps.1'; if (/Perhitungan|^Baris \d/.test(u) || f.kat === 'Perhitungan') return 'hps.1';
  if (/denda/i.test(u)) return d === 'ssuk' ? 'kon.2' : d === 'sskk' ? 'kon.3' : 'kon.1';
  if (/Pasal/.test(u)) return d === 'sskk' ? 'kon.3' : 'kon.2';
  return RVDEF[d] || 'kak.1';
}

/* ---------- pemeriksaan tambahan sesuai format ---------- */
const _scan0 = rvScan;
rvScan = function (T, p, o = {}) {
  const out = _scan0(T, p), NTS = {}, keys = RV.map((x) => x[0]).filter((k) => T[k] && T[k].text && T[k].text.trim());
  for (let i = out.length - 1; i >= 0; i--) if (['anggaran', 'pasar'].includes(out[i].doc) && /^(Nama paket|Lokasi pekerjaan)/.test(out[i].uraian)) out.splice(i, 1);
  const F = (doc, kat, sev, uraian, koreksi, item, lok) => out.push({ id: uid(), doc, kat, sev, uraian, koreksi, lok: lok || '', on: true, item });
  const N = (item, t) => { (NTS[item] ||= []).push(t); };
  const X = (k) => (T[k] && T[k].text) || '', I = (k) => keys.includes(k), W = (...a) => a.filter(I);
  const hpsRef = +String(p.hps || '').replace(/\D/g, '') || 0, paguRef = +String(p.pagu || '').replace(/\D/g, '') || 0;
  const pn = (s) => { s = String(s).trim(); if (!/^-?\d[\d.]*(,\d+)?$/.test(s)) return null; return +s.replace(/\./g, '').replace(',', '.'); };
  const lst = (a) => a.length > 1 ? a.slice(0, -1).join(', ') + ' dan ' + a[a.length - 1] : a[0] || '';
  const ex = (k, re, a = 30, b = 130) => { const m = re.exec(X(k)); return m ? exc(X(k), m.index, a, b) : ''; };
  const parseDate = (d, mo, y) => { const mi = BL.findIndex((b) => b.toLowerCase() === String(mo).toLowerCase()); return mi < 0 ? null : new Date(+y, mi, +d); };
  const tblRows = (k) => (T[k].rows ? T[k].rows.map((r) => (r || []).map((c) => (c == null ? '' : String(c)))) : X(k).split('\n').filter((l) => l.includes(' | ')).map((l) => l.split(' | ').map((s) => s.trim())));
  const numGaps = (k, item) => { let prev = null, rep = 0; for (const r of tblRows(k)) { const c = (r[0] || '').replace(/\.$/, ''); if (!/^\d{1,3}$/.test(c)) continue; const n = +c; if (prev != null && n > prev + 1 && n - prev <= 3 && rep < 3) { rep++; F(k, 'Kelengkapan', 'sedang', `Penomoran tabel pada ${RVS[k]} melompat dari ${prev} ke ${n}; periksa apakah ada baris/penerima yang terlewat.`, 'Periksa baris yang terlewat atau perbaiki penomoran.', item, r.join(' | ').slice(0, 100)); } prev = n; } };
  const subtot = (k, item) => { let acc = 0, cnt = 0, rep = 0; for (const r of tblRows(k)) { const lab = (r.find((c) => c && pn(c) == null) || '').toLowerCase(), ns = r.map(pn).filter((v) => v != null), val = ns.length ? ns[ns.length - 1] : null, tot = /^(sub ?total|jumlah|total)\b/.test(lab); if (tot && val != null) { if (cnt >= 2 && acc > 0 && Math.abs(acc - val) > 0.5 && rep < 3) { rep++; F(k, 'Perhitungan', 'sedang', `Subtotal pada tabel ${RVS[k]} tertulis ${val.toLocaleString('id-ID')}, sedangkan penjumlahan baris di atasnya ${acc.toLocaleString('id-ID')}.`, `Periksa angka baris atau ubah subtotal menjadi ${acc.toLocaleString('id-ID')}.`, item, r.join(' | ').slice(0, 120)); } acc = 0; cnt = 0; } else if (val != null && /^\d{1,3}\.?$/.test(r[0] || '')) { acc += val; cnt++; } } };

  /* ---- KAK / Spesifikasi ---- */
  if (I('kak')) {
    const t = X('kak'), tl = t.toLowerCase(), SECT = [['latar belakang'], ['maksud', 'tujuan'], ['sasaran'], ['organisasi pengadaan', 'organisasi'], ['sumber dana', 'perkiraan biaya'], ['jangka waktu', 'waktu pelaksanaan'], ['spesifikasi'], ['pelaksanaan']];
    const ada = SECT.filter((g) => g.some((w) => tl.includes(w))).map((g) => g[0]), tak = SECT.filter((g) => !g.some((w) => tl.includes(w))).map((g) => g[0]), lamp = [...new Set([...t.matchAll(/lampiran\s*(\d+)/gi)].map((m) => m[1]))];
    if (ada.length) N('kak.1', `KAK sudah memuat ${lst(ada)}${lamp.length ? `, serta ${lamp.length} lampiran (Lampiran ${lamp.join(', ')})` : ''}.`);
    if (tak.length) F('kak', 'Kelengkapan', 'sedang', `KAK belum memuat bagian: ${lst(tak)}.`, `Lengkapi bagian ${lst(tak)} pada KAK.`, 'kak.1');
    if (/e-?purchasing/i.test(t) && !/mini[ -]?kompetisi/i.test(t)) F('kak', 'Konsistensi data', 'sedang', 'KAK menyebut pemilihan penyedia melalui e-purchasing, tetapi belum menyebut metode mini kompetisi oleh Pokja Pemilihan.', 'Sesuaikan: “Pemilihan penyedia dilaksanakan oleh Pokja Pemilihan melalui E-Purchasing Katalog Elektronik dengan metode Mini Kompetisi”.', 'kak.1', ex('kak', /e-?purchasing/i));
    const pc = [...new Set([...t.matchAll(/[a-z]\.,|,,|[a-z]\s+,/g)].map((m) => exc(t, m.index, 18, 14)))]; if (pc.length) F('kak', 'Ejaan', 'rendah', `Tanda baca yang tidak lazim pada KAK (mis. “.,” atau “,,”): ${pc.length} tempat.`, 'Perbaiki tanda baca/pemisah daftar.', 'kak.1', pc.slice(0, 2).join(' || '));
    numGaps('kak', 'kak.2'); subtot('kak', 'kak.2');
    if (/ruang lingkup/.test(tl)) N('kak.2', 'Bagian ruang lingkup pekerjaan tersedia pada KAK.');
    const SP = [['kesesuaian dengan kebutuhan', /kebutuhan|sasaran|tujuan/i], ['karakteristik (ukuran, bentuk, bahan, komposisi)', /ukuran|dimensi|bentuk|bahan|warna|komposisi|karakteristik/i], ['kinerja', /kinerja|ketahanan|efisiensi|batas pemakaian/i], ['produksi dalam negeri/TKDN', /tkdn|dalam negeri|pdn/i], ['usaha mikro/kecil/koperasi', /usaha kecil|usaha mikro|koperasi|\bumk\b/i], ['standar mutu (SNI/ISO/JIS/ASTM)', /\bsni\b|\biso\b|\bjis\b|astm|standar mutu|bersertifikat|sertifikat/i], ['pengepakan dan pengiriman', /pengepakan|kemasan|pengiriman|penyerahan/i], ['jangka waktu pelaksanaan', /jangka waktu|waktu pelaksanaan|sampai dengan tanggal/i], ['syarat bahan', /syarat.{0,15}bahan|bahan yang|varietas|spesifikasi benih/i], ['pengujian bahan/hasil produk', /pengujian|uji mutu|pemeriksaan mutu|uji laboratorium/i], ['kriteria kinerja produk (output performance)', /output performance|kriteria kinerja|kinerja produk/i], ['tata cara pengukuran dan pembayaran', /pengukuran|tata cara pembayaran|pembayaran/i]];
    const ok = SP.filter(([, re]) => re.test(t)).map((x) => x[0]), no = SP.filter(([, re]) => !re.test(t)).map((x) => x[0]);
    if (ok.length) N('kak.3', `Hal yang sudah diuraikan pada KAK/spesifikasi: ${lst(ok)}.`); if (no.length) N('kak.3', `Belum ditemukan uraian: ${lst(no)}.`);
    const kr = no.filter((x) => /standar|pengujian|kriteria kinerja|pengepakan|jangka waktu/.test(x)); if (kr.length >= 2) F('kak', 'Kelengkapan', 'sedang', `Spesifikasi/KAK belum menguraikan: ${lst(kr)}.`, `Lengkapi uraian ${lst(kr)} pada spesifikasi teknis/KAK.`, 'kak.3');
    if (I('rup') && /usaha kecil|koperasi/i.test(X('rup')) && !/usaha kecil|usaha mikro|koperasi|\bumk\b/i.test(t)) F('kak', 'Konsistensi data', 'rendah', 'RUP menandai Usaha Kecil/Koperasi, tetapi KAK tidak menyebut kategori usaha penyedia.', 'Cantumkan kategori usaha penyedia (usaha kecil/koperasi) pada KAK/undangan mini kompetisi.', 'kak.3');
    const at = [...t.matchAll(/(tipe kategori|kelompok tanaman|nama komoditas|varietas|bentuk benih|kelas benih|satuan|struktur harga)\s*[:\-–]\s*([^\n|.]{1,70})/gi)].map((m) => `${m[1].trim()}: ${m[2].trim()}`);
    if (at.length) N('kak.4', `Atribut produk yang terbaca: ${[...new Set(at)].slice(0, 8).join('; ')}.`);
    if (!/kategori|katalog elektronik|level\s*[i1]/i.test(t) && !(I('ppp') && /kategori/i.test(X('ppp')))) F('kak', 'Kelengkapan', 'sedang', 'Struktur kategori produk Katalog Elektronik (Level I s.d. III) dan atribut wajib belum ditemukan pada KAK/spesifikasi.', 'Cantumkan kategori Level I–III dan atribut produk yang wajib diisi sesuai Katalog Elektronik.', 'kak.4');
    if (/cpcl|calon penerima|kelompok tani|penerima bantuan|titik bagi/i.test(t)) {
      N('kak.5', 'KAK memuat data penerima/titik bagi (CPCL/kelompok tani).');
      if (/(ditetapkan|berdasarkan)[^.\n]{0,60}\bsk\b/i.test(t) && !/(lampir|terlampir)[^.\n]{0,80}\bsk\b|\bsk\b[^.\n]{0,60}(lampir|terlampir)/i.test(t)) F('kak', 'Kelengkapan', 'sedang', 'KAK menyatakan penerima ditetapkan dalam SK, tetapi SK penetapan penerima tidak terlihat dilampirkan sehingga kesesuaian CPCL dan status verifikasi belum dapat diperiksa.', 'Lampirkan SK Penetapan Penerima dan pastikan daftar penerima, luas, dan volume sama dengan SK tersebut.', 'kak.5', ex('kak', /\bsk\b/i));
    }
  }
  /* ---- varietas / nama komoditas antar dokumen ---- */
  { const men = []; for (const k of keys) for (const m of X(k).matchAll(/[Vv]arietas\s*(?:benih\s*)?[:\-–]?\s*((?:[A-Z][\w’']+)(?:\s+[A-Z][\w’']+){0,3}(?:\s*(?:\/|dan)\s*(?:[A-Z][\w’']+)(?:\s+[A-Z][\w’']+){0,3})*)/g)) men.push({ k, names: m[1].split(/\s*(?:\/|\bdan\b)\s*/).map((s) => s.trim().toLowerCase()).filter(Boolean), raw: m[1].trim() });
    if (men.length >= 2) { const comp = []; for (const m of men) { const hit = comp.filter((c) => m.names.some((n) => c.names.has(n))); const c = hit[0] || (comp.push({ names: new Set(), docs: new Set(), raw: m.raw, n: 0 }), comp[comp.length - 1]); hit.slice(1).forEach((h) => { h.names.forEach((n) => c.names.add(n)); h.docs.forEach((d) => c.docs.add(d)); c.n += h.n; comp.splice(comp.indexOf(h), 1); }); m.names.forEach((n) => c.names.add(n)); c.docs.add(m.k); c.n++; }
      if (comp.length > 1) { comp.sort((a, b) => b.n - a.n); const maj = comp[0]; for (const c of comp.slice(1)) F([...c.docs][0], 'Konsistensi data', 'sedang', `Varietas “${c.raw}” (${[...c.docs].map((d) => RVS[d]).join(', ')}) berbeda dengan varietas “${maj.raw}” pada ${[...maj.docs].map((d) => RVS[d]).join(', ')}.`, `Samakan penyebutan varietas di seluruh dokumen (KAK, spesifikasi, HPS, kontrak) — periksa mana yang benar.`, 'kak.1'); } } }
  /* ---- satuan kerja ---- */
  if (p.satker) for (const k of W('kak', 'ppp', 'hps', 'kontrak', 'sskk', 'rup')) { const m = /satuan kerja\s*[:\-–]?\s*([^\n|;]{5,90})|\bsatker\s*[:\-–]\s*([^\n|;]{5,90})/i.exec(X(k)); const v = m && (m[1] || m[2]); if (v && ovl(p.satker, v) < 0.6 && ovl(v, p.satker) < 0.6) F(k, 'Konsistensi data', 'sedang', `Nama satuan kerja pada ${RVS[k]} (“${v.trim()}”) berbeda dengan data paket (“${p.satker}”).`, `Samakan nama satuan kerja menjadi “${p.satker}” (periksa dasar yang benar).`, RVDEF[k]); }
  /* ---- HPS ---- */
  if (I('hps') || hpsRef) {
    if (hpsRef && paguRef) { if (hpsRef > paguRef) F('hps', 'Konsistensi angka', 'tinggi', `Nilai HPS (${rpf(hpsRef)}) melebihi pagu paket (${rpf(paguRef)}).`, 'Sesuaikan HPS agar tidak melebihi pagu, atau ubah pagu/RUP terlebih dahulu.', 'hps.1'); else N('hps.1', `Nilai total HPS ${rpf(hpsRef)} ${hpsRef === paguRef ? 'sama dengan' : 'tidak melebihi'} pagu paket ${rpf(paguRef)} (${pctS(hpsRef, paguRef)} dari pagu).`); }
    if (I('hps')) {
      const t = X('hps'), tl = t.toLowerCase();
      if (T.hps.rows && !out.some((f) => f.doc === 'hps' && f.kat === 'Perhitungan') && /volume|vol\b/i.test(t) && /harga satuan/i.test(t)) N('hps.1', 'Perhitungan aritmatik baris, subtotal, dan total HPS sudah diperiksa dan tidak ditemukan selisih.');
      numGaps('hps', 'hps.1'); if (!T.hps.rows) subtot('hps', 'hps.1');
      const dt = /(?:ditetapkan|disusun|ditandatangani)[^.\n]{0,60}?(\d{1,2})\s+([A-Za-z]+)\s+(20\d\d)/i.exec(t); if (dt) N('hps.1', `HPS ditetapkan/ditandatangani pada ${dt[1]} ${dt[2]} ${dt[3]}.`);
      const ong = /ongkos kirim|biaya pengiriman|ongkir|transport/i.test(t), hs = /harga satuan/i.test(t);
      if (ong) N('hps.2', 'HPS memuat komponen ongkos kirim/pengiriman.'); if (hs) N('hps.2', 'HPS memuat harga satuan per unit.');
      if (I('kak') && /sampai (di )?titik bagi|pengiriman|penyerahan/i.test(X('kak')) && !ong) F('hps', 'Kelengkapan', 'sedang', 'KAK mengatur pengiriman/penyerahan, tetapi HPS tidak memuat komponen ongkos kirim.', 'Cantumkan komponen ongkos kirim pada HPS atau jelaskan bahwa sudah termasuk dalam harga satuan.', 'hps.2');
      if (/ppn|pajak/.test(tl)) N('hps.3', `HPS menyebut pajak/PPN: “${ex('hps', /ppn|pajak/i, 0, 80)}”.`); else F('hps', 'Konsistensi data', 'sedang', 'HPS belum menyatakan apakah harga sudah termasuk pajak/PPN.', 'Cantumkan pernyataan perlakuan pajak (PPN) dalam HPS, termasuk untuk komponen ongkos kirim.', 'hps.3');
      const dsr = [...new Set([...t.matchAll(/sumber data|survei|referensi harga|e-?katalog|katalog elektronik|surat penawaran|harga kontrak|harga pasar|brosur|referensi penyedia/gi)].map((m) => m[0].toLowerCase()))];
      if (dsr.length) N('hps.4', `Dasar penyusunan HPS yang disebut: ${lst(dsr)}.`); else F('hps', 'Kelengkapan', 'sedang', 'Dokumen HPS tidak mencantumkan dasar penyusunan harga (sumber referensi) sehingga kewajaran harga belum dapat diuji.', 'Lampirkan data pendukung HPS: sumber referensi harga (katalog elektronik, penawaran penyedia, harga kontrak sebelumnya, atau survei) dan dasar perhitungan ongkos kirim.', 'hps.4');
    }
    const ppnS = W('hps', 'kontrak', 'ssuk', 'sskk').map((k) => [k, /(belum|tidak)\s+termasuk\s+(pajak|ppn)/i.test(X(k)) ? 'tidak' : /termasuk\s+(pajak|ppn)/i.test(X(k)) ? 'ya' : null]).filter((x) => x[1]);
    if (new Set(ppnS.map((x) => x[1])).size > 1) F(ppnS[0][0], 'Konsistensi data', 'sedang', `Perlakuan pajak tidak konsisten antar dokumen: ${ppnS.map(([k, v]) => `${RVS[k]} (${v === 'ya' ? 'termasuk' : 'belum termasuk'} pajak)`).join('; ')}.`, 'Samakan pernyataan perlakuan pajak pada HPS dan rancangan kontrak.', 'hps.3');
  }
  /* ---- Rancangan kontrak / SSUK / SSKK ---- */
  const KD = W('kontrak', 'ssuk', 'sskk');
  if (KD.length) {
    for (const k of KD) if (/sppbj/i.test(X(k))) F(k, 'Isi ketentuan', 'sedang', `${RVS[k]} masih merujuk SPPBJ, yang umumnya tidak digunakan pada e-purchasing/mini kompetisi (bukti perjanjian berupa Surat Pesanan).`, 'Hapus rujukan SPPBJ dan sesuaikan dengan Surat Pesanan melalui Aplikasi Katalog Elektronik; sebutkan mini kompetisi pada bagian “Mengingat”.', RVDEF[k], ex(k, /sppbj/i));
    if (I('kontrak') && /surat perjanjian/i.test(X('kontrak')) && !/surat pesanan/i.test(X('kontrak'))) F('kontrak', 'Isi ketentuan', 'sedang', 'Rancangan memakai bentuk Surat Perjanjian, sedangkan untuk E-Purchasing bukti perjanjian umumnya berupa Surat Pesanan melalui Katalog Elektronik.', 'Sesuaikan bentuk rancangan dengan Surat Pesanan (SSUK dan SSKK sebagai lampiran).', 'kon.1');
    for (const k of W('kontrak', 'sskk')) if (/mini[ -]?kompetisi/i.test(X('kak') + X('ppp')) && !/mini[ -]?kompetisi/i.test(X(k)) && /e-?purchasing|mengingat/i.test(X(k))) { F(k, 'Isi ketentuan', 'rendah', `${RVS[k]} belum menyebut mini kompetisi melalui Katalog Elektronik.`, 'Sebutkan mini kompetisi melalui Katalog Elektronik pada dasar/“Mengingat”.', RVDEF[k]); break; }
    const jk = [...new Set(KD.flatMap((k) => [...X(k).matchAll(/lump ?sum|lumsum|harga satuan|gabungan lumsum|terima jadi|kontrak payung|waktu penugasan/gi)].map((m) => m[0].toLowerCase())))];
    if (jk.length) N('kon.1', `Jenis kontrak yang tercantum: ${lst(jk)}.`); else F(KD[0], 'Isi ketentuan', 'sedang', 'Jenis kontrak (mis. harga satuan/lumsum) tidak ditemukan pada rancangan kontrak.', 'Cantumkan jenis kontrak yang dipakai.', 'kon.1');
    if (/pre-?order|jenis pekerjaan\s*[:\-–]|berdasarkan sumber pendanaan/i.test(KD.map(X).join(' '))) F(W('sskk', 'kontrak', 'ssuk')[0], 'Isi ketentuan', 'sedang', 'Terdapat penggolongan “Pre-Order”, “jenis pekerjaan”, atau “berdasarkan sumber pendanaan” yang bukan penggolongan jenis kontrak menurut ketentuan pengadaan.', 'Periksa dan hapus penggolongan tersebut dari bagian jenis kontrak.', 'kon.3');
    const dd = {}; for (const k of keys) for (const m of X(k).matchAll(/(?:DIPA|DPA)[^.\n]{0,110}?tanggal\s+(\d{1,2})\s+([A-Za-z]+)\s+(20\d\d)/gi)) (dd[k] ||= new Set()).add(`${+m[1]} ${m[2].toLowerCase()} ${m[3]}`);
    const ddAll = new Set(Object.values(dd).flatMap((s) => [...s])); if (ddAll.size > 1) F(Object.keys(dd)[0], 'Konsistensi data', 'sedang', `Tanggal DIPA berbeda antar dokumen: ${Object.entries(dd).map(([k, s]) => `${RVS[k]} (${[...s].join(', ')})`).join('; ')}.`, 'Samakan tanggal DIPA dengan DIPA yang berlaku.', 'kon.1'); else if (ddAll.size === 1) N('kon.1', `Dasar DIPA: tanggal ${[...ddAll][0]}.`);
    for (const k of W('kontrak', 'sskk')) { const m = /(?:jangka waktu|waktu)\s+pelaksanaan[^\n]{0,80}/i.exec(X(k)); if (m && !/\d|tanggal|hari|bulan/i.test(m[0].replace(/jangka waktu|waktu|pelaksanaan/gi, ''))) F(k, 'Isian', 'sedang', `Jangka waktu pelaksanaan pada ${RVS[k]} belum diisi.`, 'Lengkapi jangka waktu pelaksanaan (hari kalender sejak Surat Pesanan) dan batas akhirnya.', k === 'sskk' ? 'kon.3' : 'kon.1', m[0].slice(0, 100)); }
    const full = KD.map(X).join('\n'), pays = /(pembayaran|dibayar)[^.\n]{0,100}(sekaligus|100\s*%|prestasi\s*100)/i.test(full), payt = /(angsuran|termin|bertahap)/i.test(full) && /pembayaran/i.test(full);
    if (pays && payt) F(KD[0], 'Konsistensi data', 'sedang', 'Bentuk pembayaran tidak konsisten: ada rumusan pembayaran sekaligus/prestasi 100% dan ada rumusan angsuran/termin/bertahap.', 'Tetapkan bentuk pembayaran (sekaligus atau termin) secara konsisten pada Surat Pesanan/Perjanjian, SSUK, dan SSKK.', 'kon.1');
    if (/sisa nilai/i.test(full)) F(W('kontrak', 'ssuk', 'sskk').find((k) => /sisa nilai/i.test(X(k))), 'Isi ketentuan', 'sedang', 'Denda dihitung dari “sisa nilai bagian kontrak yang belum dikerjakan”.', 'Sesuaikan rumusan denda dengan ketentuan yang berlaku (umumnya 1‰ dari nilai kontrak/bagian kontrak sebelum PPN untuk setiap hari keterlambatan).', 'kon.1', ex(W('kontrak', 'ssuk', 'sskk').find((k) => /sisa nilai/i.test(X(k))), /sisa nilai/i));
    if (/1\s*%\s*0/.test(full)) F(KD.find((k) => /1\s*%\s*0/.test(X(k))), 'Ejaan', 'rendah', 'Salah ketik “1%0” pada rumusan denda.', 'Ganti menjadi “1‰” (satu per seribu).', 'kon.1');
    if (I('ssuk')) {
      const t = X('ssuk'), ist = ['spmk', 'pelelangan', 'tender', 'masa pemeliharaan', 'berita acara penyerahan awal', 'pekerjaan konstruksi'].filter((w) => new RegExp('\\b' + w + '\\b', 'i').test(t));
      if (ist.length && !/konstruksi/i.test(p.jenis || '')) F('ssuk', 'Isi ketentuan', 'sedang', `SSUK memuat istilah yang umumnya tidak relevan untuk pengadaan barang/e-purchasing: ${ist.map((s) => s.toUpperCase() === s ? s : s).join(', ')}.`, `Periksa dan sesuaikan/hapus istilah ${lst(ist)} pada SSUK.`, 'kon.2');
      if (/bank umum pemerintah/i.test(t)) F('ssuk', 'Isi ketentuan', 'rendah', 'Penerbit jaminan dibatasi pada “Bank Umum Pemerintah”; periksa kesesuaian dengan ketentuan jaminan yang berlaku.', 'Periksa pembatasan penerbit jaminan (bank umum, perusahaan penjaminan, atau asuransi).', 'kon.2', ex('ssuk', /bank umum pemerintah/i));
      const hs = [...t.matchAll(/^[ \t|]*pasal\s+(\d{1,3})\b[^\n]*\n([\s\S]{0,1600})/gim)]; const bad = []; for (const m of hs) { const s = /^[ \t|]*(\d{1,2})\.(\d{1,2})\b/m.exec(m[2]); if (s && +s[1] !== +m[1]) bad.push(`Pasal ${m[1]} berisi butir ${s[1]}.${s[2]}`); } if (bad.length) F('ssuk', 'Kelengkapan', 'sedang', `Nomor pasal tidak sama dengan penomoran butir: ${bad.slice(0, 4).join('; ')}.`, 'Rapikan penomoran pasal dan butir pada SSUK.', 'kon.2');
    }
    const sgn = {}; for (const k of W('ssuk', 'sskk', 'kontrak')) { const set = new Set(); for (const m of X(k).matchAll(/(?:BAST|berita acara serah terima)[^.\n]{0,160}/gi)) { if (/\bPPK\b/.test(m[0])) set.add('PPK'); if (/PjPHP|PPHP|Pejabat Penerima/i.test(m[0])) set.add('PjPHP/PPHP'); if (/tim (pendukung|teknis|penerima)/i.test(m[0])) set.add('Tim'); if (/kelompok tani/i.test(m[0])) set.add('Kelompok tani'); } if (set.size) sgn[k] = [...set]; }
    if (Object.keys(sgn).length > 1 && new Set(Object.values(sgn).map((a) => a.sort().join('+'))).size > 1) F(Object.keys(sgn)[0], 'Konsistensi data', 'sedang', `Penandatangan/pihak BAST tidak seragam: ${Object.entries(sgn).map(([k, a]) => `${RVS[k]} (${a.join(', ')})`).join('; ')}.`, 'Seragamkan ketentuan BAST (pihak penandatangan dan jenis BAST: titik bagi vs pekerjaan) pada SSUK, SSKK, dan kontrak.', 'kon.3');
    if (I('sskk') && I('ssuk')) for (const [tp, it, lbl] of [['asuransi', 'kon.4', 'Asuransi'], ['uang muka', 'kon.4', 'Uang Muka'], ['jaminan pelaksanaan', 'kon.4', 'Jaminan Pelaksanaan'], ['penyesuaian harga', 'kon.4', 'Penyesuaian Harga'], ['waktu penyelesaian', 'kon.3', 'Waktu Penyelesaian Pekerjaan']]) { const m = new RegExp(tp + '[^.\\n]{0,150}sskk|sskk[^.\\n]{0,150}' + tp, 'i').exec(X('ssuk')); if (m && !new RegExp(tp, 'i').test(X('sskk'))) F('sskk', 'Isi ketentuan', 'sedang', `SSUK menyerahkan ketentuan ${lbl} kepada SSKK, tetapi SSKK belum mengaturnya.`, `Atur ${lbl} pada SSKK (nyatakan ada/tidak ada dan besarannya).`, it, m[0].slice(0, 110)); }
    if (/\bBANI\b/.test(X('sskk'))) N('kon.3', 'Penyelesaian perselisihan melalui BANI berbiaya relatif besar; PPK dapat mempertimbangkan pengadilan negeri sebagai alternatif.');
    const TP = [['uang muka', /uang muka/i, /tidak (ada|diberikan)[^.\n]{0,20}uang muka|uang muka[^.\n]{0,40}(tidak|\d+\s*%)/i], ['jaminan pelaksanaan', /jaminan pelaksanaan/i, /jaminan pelaksanaan[^.\n]{0,80}(tidak|diminta|sebesar|\d+\s*%)|(tidak|diminta)[^.\n]{0,30}jaminan pelaksanaan/i], ['asuransi', /asuransi/i, /asuransi[^.\n]{0,60}(tidak|diwajibkan|ditanggung)|(tidak|diwajibkan)[^.\n]{0,30}asuransi/i], ['penyesuaian harga', /penyesuaian harga/i, /penyesuaian harga[^.\n]{0,60}(tidak berlaku|tidak ada|berlaku)|(tidak berlaku|tidak ada)[^.\n]{0,30}penyesuaian harga/i], ['sertifikat garansi/dokumen lain', /garansi|sertifikat/i, /garansi|sertifikat/i]];
    const pool = W('sskk', 'kontrak', 'ssuk', 'kak', 'ppp'), miss = []; for (const [nm, any, st] of TP) { const st2 = pool.find((k) => st.test(X(k))); if (st2) N('kon.4', `${nm[0].toUpperCase() + nm.slice(1)}: tercantum pada ${RVS[st2]}.`); else if (pool.some((k) => any.test(X(k)))) miss.push(nm + ' (disebut tetapi belum dinyatakan tegas)'); else miss.push(nm); }
    if (miss.length) F(KD.includes('sskk') ? 'sskk' : KD[0], 'Isi ketentuan', 'sedang', `Belum dinyatakan secara tegas: ${lst(miss)}.`, `Nyatakan ketentuan ${lst(miss.map((s) => s.replace(/ \(.*/, '')))} (ada/tidak ada dan besarannya) pada SSKK/kontrak.`, 'kon.4');
  }
  /* ---- Dokumen anggaran ---- */
  if (I('anggaran')) {
    const t = X('anggaran'), nd = /DIPA[- ]?\s*([0-9.]+\/\d{4})/i.exec(t), nums = [...t.matchAll(/(?:Rp\.?\s*)?(\d{1,3}(?:\.\d{3}){2,})/g)].map((m) => +m[1].replace(/\./g, '')), mx = Math.max(0, ...nums);
    if (/dipa|dpa|rka/i.test(t)) N('ang.1', `Dokumen memuat DIPA/DPA/RKA${nd ? ` (nomor ${nd[1]})` : ''}.`); else F('anggaran', 'Kelengkapan', 'sedang', 'Berkas tidak memuat DIPA/DPA/RKA-KL.', 'Lampirkan DIPA/DPA/RKA-KL yang telah ditetapkan.', 'ang.1');
    if (hpsRef && nums.length) { if (mx >= hpsRef) N('ang.2', `Nilai terbesar pada dokumen anggaran ${rpf(mx)} mencukupi untuk HPS ${rpf(hpsRef)} (${pctS(hpsRef, mx)}).`); else F('anggaran', 'Konsistensi angka', 'tinggi', `Tidak ditemukan nilai anggaran yang mencukupi HPS ${rpf(hpsRef)} (nilai terbesar ${rpf(mx)}).`, 'Pastikan pagu/sub komponen pada POK mencukupi, atau sesuaikan HPS.', 'ang.2'); }
    if (!/sisa|realisasi|komitmen/i.test(t)) N('ang.2', 'Realisasi/komitmen paket lain dan sisa pagu tidak tercantum; PPK perlu mengonfirmasi ketersediaan sisa pagu.');
  }
  { const MK = /([A-Z]{3}\.\d{3}\.\d{3}\.[A-Z0-9]{2}\.\d{6})/g, mk = {}; for (const k of keys) { const s = new Set([...X(k).matchAll(MK)].map((m) => m[1])); if (s.size) mk[k] = [...s]; }
    const all = new Set(Object.values(mk).flat()); if (all.size > 1) F(Object.keys(mk)[0], 'Konsistensi data', 'sedang', `Kode MAK berbeda antar dokumen: ${Object.entries(mk).map(([k, a]) => `${RVS[k]} (${a.join(', ')})`).join('; ')}.`, 'Samakan kode MAK pada RUP, KAK, kontrak, dan POK.', 'ang.3'); else if (all.size === 1) N('ang.3', `Kode MAK konsisten pada ${Object.keys(mk).map((k) => RVS[k]).join(', ')}: ${[...all][0]}.`); }
  /* ---- RUP ---- */
  if (I('rup')) {
    const t = X('rup');
    if (/diumumkan|pengumuman|diumumkan di sirup/i.test(t)) N('rup.1', `Paket tercatat sudah diumumkan di SiRUP: “${((/[^.\n]*(diumumkan|pengumuman)[^.\n]*/i.exec(t) || [''])[0]).trim().slice(0, 130)}”.`); else F('rup', 'Kelengkapan', 'sedang', 'Status pengumuman paket di SiRUP tidak terlihat pada berkas RUP.', 'Lampirkan tampilan SiRUP yang menunjukkan paket telah diumumkan.', 'rup.1');
    if (/e-?purchasing/i.test(t)) N('rup.2', 'Metode pemilihan pada RUP: E-Purchasing.'); else F('rup', 'Isi ketentuan', 'sedang', 'Metode pemilihan E-Purchasing tidak ditemukan pada RUP.', 'Sesuaikan metode pemilihan pada RUP dengan rencana mini kompetisi melalui Katalog Elektronik.', 'rup.2');
    const fl = [/produk dalam negeri|\bpdn\b/i.test(t) && 'Produk Dalam Negeri', /usaha kecil|koperasi|\bumk\b/i.test(t) && 'Usaha Kecil/Koperasi'].filter(Boolean); if (fl.length) N('rup.2', `RUP menandai ${fl.join(' dan ')}.`);
  }
  /* ---- Waktu ---- */
  { const ds = []; for (const k of W('kak', 'kontrak', 'sskk', 'ppp')) for (const m of X(k).matchAll(/(?:sampai dengan|paling lambat|selambat-lambatnya|berakhir(?: pada)?)\s*(?:tanggal\s*)?(\d{1,2})\s+([A-Za-z]+)\s+(20\d\d)/gi)) { const d = parseDate(m[1], m[2], m[3]); if (d) ds.push([k, d, m[0]]); }
    if (ds.length) { const [k0, end] = ds[0], ba = pd(o.tgl || today()), days = Math.round((end - ba) / 864e5), wk = Math.round(days / 7); N('wkt.1', `${RVS[k0]} menetapkan penyelesaian sampai ${tgl(end.toISOString().slice(0, 10))}.`);
      if (days > 0) N('wkt.1', `Dari tanggal reviu (${tgl(o.tgl || today())}) sampai batas akhir tersedia sekitar ${wk} minggu (${days} hari) untuk proses pemilihan dan pelaksanaan.`);
      if (days > 0 && wk <= 8) F(k0, 'Konsistensi data', 'sedang', `Waktu yang tersedia sampai batas akhir pelaksanaan hanya sekitar ${wk} minggu.`, 'PPK menetapkan jangka waktu pelaksanaan dalam hari kalender sejak Surat Pesanan, dengan batas akhir serah terima yang memperhitungkan batas pengajuan tagihan akhir tahun anggaran, serta jadwal penyerahan per wilayah.', 'wkt.1');
      if (end.getMonth() === 11 && end.getDate() >= 15) N('wkt.1', 'Batas akhir mendekati akhir tahun anggaran; batas waktu pengajuan tagihan akhir tahun perlu diperhitungkan.');
      if (p.waktu && Math.abs(end - pd(p.waktu)) > 864e5) F(k0, 'Konsistensi data', 'sedang', `Batas akhir pada ${RVS[k0]} (${tgl(end.toISOString().slice(0, 10))}) berbeda dengan data paket (${tgl(p.waktu)}).`, 'Samakan batas akhir pelaksanaan dengan data paket/RUP.', 'wkt.1'); }
    for (const k of W('kak', 'sskk')) if (/jangka waktu/i.test(X(k)) && !/\d+\s*(\([^)]*\)\s*)?hari/i.test(X(k))) F(k, 'Isian', 'sedang', `Jangka waktu pada ${RVS[k]} belum dinyatakan dalam durasi hari kalender (hanya tanggal/kosong).`, 'Lengkapi jangka waktu dengan durasi hari kalender sejak Surat Pesanan.', 'wkt.1');
    if (W('kak', 'sskk').length && !W('kak', 'sskk', 'kontrak').some((k) => /jadwal\s+(pengiriman|penyerahan)/i.test(X(k)))) F(W('kak', 'sskk')[0], 'Kelengkapan', 'rendah', 'Jadwal pengiriman/penyerahan per wilayah belum ditemukan.', 'Tetapkan batas akhir penyerahan per wilayah/titik bagi.', 'wkt.1'); }
  /* ---- Analisis pasar ---- */
  if (I('pasar')) { const t = X('pasar'), c = [/penyedia/i.test(t) && 'daftar penyedia', /katalog/i.test(t) && 'Katalog Elektronik', /stok|ketersediaan/i.test(t) && 'ketersediaan/stok', /harga/i.test(t) && 'harga', /wilayah|pengiriman/i.test(t) && 'wilayah pengiriman'].filter(Boolean); if (c.length) N('pas.1', `Analisis pasar memuat: ${lst(c)}.`); if (!/penyedia/i.test(t)) F('pasar', 'Kelengkapan', 'sedang', 'Analisis pasar tidak memuat daftar penyedia.', 'Lengkapi analisis pasar dengan daftar penyedia yang tayang di Katalog Elektronik beserta varietas/spesifikasi, wilayah pengiriman, kategori usaha, dan perkiraan stok.', 'pas.1'); }
  /* ---- Kualifikasi & kesiapan mini kompetisi ---- */
  { const QD = W('kak', 'ppp'); if (QD.length) {
      const q = QD.map(X).join('\n'), qs = [...new Set([...q.matchAll(/sertifikat kompetensi|izin usaha|\bnib\b|\bsiup\b|kualifikasi|usaha kecil|koperasi|mou|nota kerja ?sama|surat pernyataan/gi)].map((m) => m[0].toLowerCase()))];
      if (qs.length) N('kual.1', `Persyaratan penyedia yang tercantum: ${lst(qs)}.`);
      if (I('kak') && !/kualifikasi/i.test(X('kak'))) F('kak', 'Kelengkapan', 'sedang', 'KAK tidak memuat bagian persyaratan kualifikasi penyedia.', 'Tetapkan persyaratan penyedia yang dinilai pada mini kompetisi (mis. sertifikat kompetensi, MoU, bukti stok, kategori usaha) beserta dokumen pembuktiannya, dan pisahkan dari spesifikasi barang.', 'kual.1');
      const TK = [['sertifikat/label mutu', /sertifikat|label/i], ['bukti ketersediaan stok', /stok/i], ['pengalaman', /pengalaman/i], ['personel/tenaga ahli', /tenaga ahli|personel/i], ['peralatan', /peralatan/i], ['garansi', /garansi/i], ['batas umur simpan/tanggal panen', /umur simpan|tanggal panen|kedaluwarsa|kadaluarsa/i]];
      const a1 = TK.filter(([, re]) => re.test(q)).map((x) => x[0]), a0 = TK.filter(([, re]) => !re.test(q)).map((x) => x[0]); if (a1.length) N('kual.2', `Persyaratan teknis yang sudah tercantum: ${lst(a1)}.`); if (a0.length) N('kual.2', `Belum ditetapkan: ${lst(a0)}.`);
      const MK2 = [['dasar evaluasi (total harga)', /evaluasi|total harga/i], ['harga satuan tidak melebihi HPS', /tidak (boleh )?melebihi\s+(hps|harga perkiraan)|harga satuan/i], ['dokumen yang diunggah peserta', /unggah|upload|dokumen yang/i], ['jangka waktu', /jangka waktu|waktu pelaksanaan/i], ['bentuk pembayaran', /pembayaran/i]];
      const m1 = MK2.filter(([, re]) => re.test(q)).map((x) => x[0]), m0 = MK2.filter(([, re]) => !re.test(q)).map((x) => x[0]); if (m1.length) N('kual.3', `Informasi yang sudah ada untuk mini kompetisi: ${lst(m1)}.`);
      if (I('ppp') && m0.length) F('ppp', 'Kelengkapan', 'sedang', `Dokumen permintaan/undangan belum memuat: ${lst(m0)}.`, `Cantumkan ${lst(m0)} dalam undangan mini kompetisi.`, 'kual.3'); else if (m0.length) N('kual.3', `Belum ditemukan pada KAK (perlu dimuat dalam undangan): ${lst(m0)}.`); } }
  /* ---- dokumen yang dicatat tidak dilampirkan ---- */
  const TD = { kontrak: ['Rancangan kontrak/Surat Pesanan tidak dilampirkan.', 'PPK melampirkan rancangan Surat Pesanan/kontrak beserta SSUK dan SSKK.', 'kon.1'], anggaran: ['Dokumen anggaran (DIPA/POK) tidak dilampirkan sehingga ketersediaan anggaran dan MAK belum dapat diperiksa.', 'PPK melampirkan salinan DIPA/POK yang memuat komponen/akun paket beserta sisa pagu.', 'ang.2'], rup: ['Bukti pengumuman paket RUP (SiRUP) tidak dilampirkan.', 'PPK melampirkan tampilan SiRUP paket yang telah diumumkan.', 'rup.1'], pasar: ['Dokumen analisis pasar dan referensi penyedia tidak dilampirkan.', 'PPK melampirkan hasil analisis pasar, paling sedikit daftar penyedia yang tayang di Katalog Elektronik beserta varietas/spesifikasi, wilayah pengiriman, kategori usaha, dan perkiraan ketersediaan stok.', 'pas.1'] };
  for (const [k, [u, r, it]] of Object.entries(TD)) if (o.tidak && o.tidak[k] && !I(k)) F(k, 'Kelengkapan', 'sedang', u, r, it);
  /* ---- risiko ---- */
  { const has = (re) => out.some((f) => re.test(f.uraian)), R = [];
    if (has(/hanya sekitar \d+ minggu/)) R.push('waktu pelaksanaan singkat sehingga berpotensi melewati tahun anggaran atau masa penggunaan barang;');
    if (has(/^Varietas/)) R.push('perbedaan penyebutan varietas/spesifikasi antar dokumen dapat menimbulkan perbedaan penawaran, sanggahan, atau penolakan barang;');
    if (has(/pembayaran tidak konsisten|Bentuk pembayaran/)) R.push('bentuk pembayaran yang belum tegas mempengaruhi arus kas penyedia dan dasar pembayaran;');
    if (has(/Penomoran tabel|Subtotal pada tabel|volume .* tertulis|Baris \d/)) R.push('data volume/penerima yang belum sinkron sehingga BAST dan HPS berpotensi tidak sesuai;');
    if (has(/Nilai HPS|HPS paket|melebihi pagu|dasar penyusunan/)) R.push('nilai/dasar HPS yang belum sinkron atau belum didukung data sehingga kewajaran harga belum dapat diuji;');
    if (out.some((f) => f.kat === 'Isian' && ['kontrak', 'sskk', 'ssuk'].includes(f.doc))) R.push('isian rancangan kontrak yang masih kosong berpotensi menghambat penerbitan Surat Pesanan;');
    if (out.some((f) => f.doc === 'pasar')) R.push('ketersediaan penyedia dan stok belum terkonfirmasi melalui analisis pasar;');
    R.forEach((r, i) => N('kual.4', r[0].toUpperCase() + r.slice(1, -1) + (i === R.length - 1 ? '.' : ';'))); if (!R.length) N('kual.4', 'Belum ada risiko yang teridentifikasi otomatis; tambahkan risiko spesifik paket secara manual (mis. mutu barang, pengiriman, ketersediaan penyedia).'); }
  const order = Object.fromEntries(RV.map((x, i) => [x[0], i])), sv = { tinggi: 0, sedang: 1, rendah: 2 };
  out.forEach((f) => { f.item = rvMap(f); }); out.sort((a, b) => order[a.doc] - order[b.doc] || sv[a.sev] - sv[b.sev]); out.notes = NTS; return out;
};

/* ---------- penyusunan catatan & rekomendasi per butir ---------- */
const lc1 = (s) => s.replace(/^[A-Z](?=[a-z])/, (c) => c.toLowerCase());
function rvLines(l, id) {
  const ov = (l.rvCat || {})[id]; if (ov !== undefined) return String(ov).split('\n').filter((s) => s.trim() !== '');
  const notes = (l.rvNotes || {})[id] || [], fs = (l.rvTemuan || []).filter((x) => x.on !== false && (x.uraian || '').trim() && rvMap(x) === id).map((x) => x.uraian.trim());
  const need = RVITEM[id].docs, got = need.some((k) => l.rvDocs && l.rvDocs[k]);
  if (!got && !notes.length && !fs.length) return [`Dokumen ${need.map((k) => RVS[k]).join('/')} belum diunggah/dipindai sehingga butir ini belum dapat diperiksa.`];
  const all = [...notes, ...fs]; return all.length ? all : ['Tidak ditemukan ketidaksesuaian pada dokumen yang dipindai.'];
}
function rvRecs(l, g) {
  const ov = (l.rvRek || {})[g.id]; if (ov !== undefined) return String(ov).split('\n').filter((s) => s.trim());
  const ids = g.items.map((i) => g.id + '.' + i.no), sv = { tinggi: 0, sedang: 1, rendah: 2 };
  const fs = (l.rvTemuan || []).filter((x) => x.on !== false && (x.koreksi || '').trim() && ids.includes(rvMap(x))).sort((a, b) => (sv[a.sev] ?? 3) - (sv[b.sev] ?? 3));
  return [...new Set(fs.map((x) => `Pada ${RVS[x.doc] || x.doc}: ${lc1(x.koreksi.trim())}`))];
}
const cellH = (txt) => { let h = '', ul = []; const fl = () => { if (ul.length) { h += `<ul style="margin:2px 0 4px 16px;padding:0">${ul.join('')}</ul>`; ul = []; } };
  for (const ln of String(txt).split('\n')) { if (/^- /.test(ln)) ul.push(`<li>${esc(ln.slice(2))}</li>`); else if (ln.trim()) { fl(); h += `<p style="margin:2px 0;text-align:left">${esc(ln)}</p>`; } } fl(); return h; };
R.bareviu = function (l, p) {
  const t = rvOn(l), nm = l.kegiatan || p.nama, c = (s) => t.filter((x) => x.sev === s).length, hasT = c('tinggi');
  const kes = !t.length ? 'dokumen persiapan telah sesuai dan dapat dilanjutkan ke tahap pemilihan penyedia.' : hasT ? 'dokumen persiapan <b>belum dapat dilanjutkan</b> ke tahap pemilihan penyedia sebelum PPK memperbaiki temuan, terutama yang berkategori tinggi, dan menyampaikan kembali dokumen hasil perbaikan kepada Pokja Pemilihan.' : 'dokumen persiapan <b>dapat dilanjutkan</b> dengan ketentuan PPK menindaklanjuti rekomendasi reviu sebagaimana tabel di atas.';
  const grp = RVG.map((g) => { const rows = g.items.map((it) => `<tr><td style="text-align:center">${it.no}.</td><td>${cellH(it.uraian)}</td><td>${cellH(rvLines(l, g.id + '.' + it.no).join('\n'))}</td></tr>`).join(''), rec = rvRecs(l, g);
    return `<p style="margin:12px 0 4px;text-align:left"><b>${esc(g.judul)}</b></p><table class=b style="margin:2px 0;font-size:10pt;width:100%"><tr><th style="width:7%">No.</th><th style="width:44%">Uraian</th><th>Catatan/Pembahasan</th></tr>${rows}</table><p style="margin:6px 0 2px">Rekomendasi/hasil catatan reviu:</p>${rec.length ? ol(rec.map(esc)) : '<p style="margin:0">-</p>'}`; }).join('');
  return `<p class=tc style="margin:0">BERITA ACARA REVIU DOKUMEN PERSIAPAN PENGADAAN</p><p class=tc style="font-weight:400;margin-top:4px">Nomor: ${nomor(l)}</p>
  <p>Pada hari ini ${tglKata(l.tgl)}, kami selaku Kelompok Kerja (Pokja) Pemilihan berdasarkan Surat Tugas ${esc(p.pejabatST || S().pejabat)} Nomor: ${esc(p.stNo)} tanggal ${tgl(p.stTgl)}, telah melakukan reviu${(l.rvRonde || 1) > 1 ? ` (reviu ke-${l.rvRonde})` : ''} terhadap dokumen persiapan pengadaan pada:</p>
  ${kv([['Nama Paket', esc(nm)], ['Satuan Kerja', esc([p.satker, p.eselon1].filter(Boolean).join(', '))], ['Nilai Pagu Anggaran', rn(num(p.pagu))], ['Nilai HPS', rn(num(p.hps))], ['Sumber Anggaran', esc(p.sumber)], ['Kode RUP', esc(p.rup)]], 170)}
  <p style="text-align:left"><b>Hasil reviu dokumen pemilihan adalah sebagai berikut:</b></p>${grp}
  <p>${t.length ? `Secara keseluruhan terdapat <b>${t.length}</b> temuan (${c('tinggi')} tinggi, ${c('sedang')} sedang, ${c('rendah')} rendah). ` : ''}${l.rvTeratasi && l.rvTeratasi.length ? `Dari hasil reviu sebelumnya, <b>${l.rvTeratasi.length}</b> temuan telah ditindaklanjuti dan dinyatakan sesuai. ` : ''}Berdasarkan hasil reviu tersebut, ${kes}</p>
  <p>Demikian Berita Acara Reviu Dokumen Persiapan ini dibuat untuk dipergunakan sebagaimana mestinya.</p>${angTable(l, { num: false })}
  <div style="break-inside:avoid;margin-top:14px"><p style="margin:0">Menerima hasil reviu,</p><p style="margin:0">${esc(p.ppk || 'Pejabat Pembuat Komitmen')}</p><div style="height:54px"></div><p style="margin:0">( ........................................ )</p></div>`;
};

/* ---------- pemindaian ---------- */
rvRun = function () {
  const T = RVT[L.id] || {}, p = paketOf(L), msg = $('#rvmsg');
  if (!p) { if (msg) msg.textContent = 'Pilih paket dulu.'; return; }
  if (!RV.some(([k]) => T[k] && T[k].text.trim()) && !Object.values(L.rvTidak || {}).some(Boolean)) { if (msg) msg.textContent = 'Unggah atau tempel minimal satu dokumen dulu.'; return; }
  const prev = (L.rvTemuan || []).filter((x) => x.kat !== 'Manual'), manual = (L.rvTemuan || []).filter((x) => x.kat === 'Manual'), nw = rvScan(T, p, { tidak: L.rvTidak || {}, tgl: L.tgl }), nk = new Map(nw.map((x) => [rvKey(x), x]));
  const off = new Set(prev.filter((x) => x.on === false).map(rvKey)); nw.forEach((x) => { if (off.has(rvKey(x))) x.on = false; });
  L.rvTeratasi = prev.filter((x) => !nk.has(rvKey(x))).map((x) => x.uraian.slice(0, 140));
  L.rvRonde = prev.length || L.rvScanAt ? (L.rvRonde || 1) + 1 : 1; L.rvTemuan = [...nw, ...manual]; L.rvNotes = nw.notes || {}; L.rvScanAt = Date.now(); T._ext = rvExtract(T, p);
  rerender(); const m2 = $('#rvmsg'); if (m2) m2.textContent = `Selesai dipindai: ${rvOn(L).length} temuan${L.rvTeratasi.length ? `, ${L.rvTeratasi.length} teratasi` : ''}.`;
};

/* ---------- formulir ---------- */
const RVOPT = ['kontrak', 'anggaran', 'rup', 'pasar'];
FB.bareviu = function () {
  const ts = (L.rvTemuan ||= []), n = rvOn(L);
  const docs = RV.map(([k, nm]) => `<div class=card2><div class=r1><b style="flex:1">${esc(nm)}</b><a data-rv="drive:${k}">dari Drive</a> · <a data-rv="paste:${k}">tempel teks</a></div><input type=file accept=".docx,.xlsx,.pdf,.txt" data-rvf=${k}><div class=muted id="rvs-${k}" style="margin-top:4px">${rvStat(k)}</div>${RVOPT.includes(k) ? `<label class=cbx style="margin:4px 0 0"><input type=checkbox data-rvno=${k} ${L.rvTidak && L.rvTidak[k] ? 'checked' : ''}> Tidak dilampirkan (catat sebagai temuan)</label>` : ''}<textarea id="rvta-${k}" data-rvt=${k} style="display:none;margin-top:6px" placeholder="Tempel isi ${esc(RVS[k])} di sini…"></textarea></div>`).join('');
  const itemOpts = RVITEMS.map((i) => [i.id, `${i.g.toUpperCase()}.${i.no}`]);
  const sel = (i, k, opts, cur) => `<select data-p="rvTemuan.${i}.${k}">${opts.map(([v, t]) => `<option value="${v}" ${(cur ?? ts[i][k]) === v ? 'selected' : ''}>${t}</option>`).join('')}</select>`;
  const list = ts.map((x, i) => `<div class=card2 style="${x.on === false ? 'opacity:.55' : ''}"><div class=r1><label class=cbx style="margin:0;flex:1"><input type=checkbox data-rvon=${i} ${x.on === false ? '' : 'checked'}> <b>${i + 1}.</b> <span class=muted>${esc(x.kat || 'Manual')}</span></label><button class=ib data-rv="del:${i}">×</button></div><div class=g2><div><label>Dokumen</label>${sel(i, 'doc', RV.map(([k, , s]) => [k, s]))}</div><div><label>Tingkat</label>${sel(i, 'sev', [['tinggi', 'Tinggi'], ['sedang', 'Sedang'], ['rendah', 'Rendah']])}</div></div><label>Butir reviu</label>${sel(i, 'item', itemOpts, rvMap(x))}<label>Temuan</label><textarea data-p="rvTemuan.${i}.uraian">${esc(x.uraian || '')}</textarea><label>Koreksi / saran</label><textarea data-p="rvTemuan.${i}.koreksi">${esc(x.koreksi || '')}</textarea>${x.lok ? `<small class=muted>Kutipan: ${esc(x.lok.slice(0, 160))}</small>` : ''}</div>`).join('');
  const matriks = RVG.map((g) => `<details class=more><summary>${esc(g.judul.replace(/^Reviu terhadap /, ''))}</summary>${g.items.map((it) => { const id = g.id + '.' + it.no, ov = (L.rvCat || {})[id] !== undefined; return `<label>Butir ${it.no} ${ov ? '<a data-rv="rc:' + id + '">(kembalikan otomatis)</a>' : ''}</label><textarea data-rvc="${id}" rows=4>${esc(rvLines(L, id).join('\n'))}</textarea>`; }).join('')}<label>Rekomendasi/hasil catatan reviu ${(L.rvRek || {})[g.id] !== undefined ? '<a data-rv="rr:' + g.id + '">(kembalikan otomatis)</a>' : ''} <span class=muted>(satu rekomendasi per baris)</span></label><textarea data-rvr="${g.id}" rows=4>${esc(rvRecs(L, g).join('\n'))}</textarea></details>`).join('');
  return sec(2, 'Dokumen yang dipindai (9 jenis sesuai format reviu)', `<div class=nfo>Unggah berkas <b>.docx / .xlsx / .pdf / .txt</b> atau tempel teks. Dibaca di browser; isi dokumen tidak disimpan ke server — hanya temuan, catatan, dan rekomendasi. Dokumen yang tidak ada boleh dikosongkan.</div>${docs}<p><button class="btn p" data-rv="scan:0">Pindai kesesuaian</button> <button class=btn data-rv="auto:0" title="Cari dokumen di folder Drive paket ini lalu langsung dipindai">☁ Ambil dari Drive & pindai</button> <span class=muted id=rvmsg>${L.rvScanAt ? `Terakhir dipindai ${new Date(L.rvScanAt).toLocaleString('id-ID')} · ${n.length} temuan aktif` : ''}</span></p>`)
    + rvExtCard()
    + sec(3, `Temuan & koreksi (${n.length} aktif dari ${ts.length})`, (L.rvTeratasi && L.rvTeratasi.length ? `<div class=nfo style="background:#e3f6ea">✓ ${L.rvTeratasi.length} temuan dari pemindaian sebelumnya sudah teratasi (reviu ke-${L.rvRonde || 1}).</div>` : '') + (list || '<p class=muted>Belum ada temuan. Pindai dokumen, atau tambahkan temuan manual.</p>') + '<p><a data-rv="add:0">+ Tambah temuan manual</a>' + (ts.length ? ' · <a data-rv="copy:0">Salin ringkasan (WhatsApp)</a> · <a data-rv="csv:0">Unduh .csv</a>' : '') + '</p>')
    + sec(4, 'Catatan/Pembahasan & Rekomendasi per butir (format BA)', `<p class=muted>Disusun otomatis dari temuan dan pemeriksaan. Ubah teks sesuai kebutuhan — perubahan Anda dipertahankan saat pindai ulang. <a data-rv="reset:0">Susun ulang semua otomatis</a></p>${matriks}`)
    + sec(5, 'Nomor & tanggal', numBox('Tanggal BA'))
    + more('Lainnya — anggota Pokja, teks tambahan, kertas', `${angPanel()}${fx('tambah', 'Paragraf tambahan sebelum kalimat penutup (opsional)', { area: 1 })}${fx('kegiatan', 'Nama Pokja / kegiatan (kosong = nama paket)', { area: 1, ph: (paketOf(L) || {}).nama })}${kertasBln()}`);
};
const _wire6 = wire;
wire = function () {
  _wire6(); const f = $('#fm'); if (!f || f._rv2) return; f._rv2 = 1;
  f.addEventListener('input', (e) => { const x = e.target, d = x.dataset; if (d.rvc) { (L.rvCat ||= {})[d.rvc] = x.value; prev(); } else if (d.rvr) { (L.rvRek ||= {})[d.rvr] = x.value; prev(); } });
  f.addEventListener('change', (e) => { const x = e.target, d = x.dataset; if (d.rvno) { (L.rvTidak ||= {})[d.rvno] = x.checked; } });
  f.addEventListener('click', (e) => { const b = e.target.closest('[data-rv]'); if (!b) return; const [c, i] = b.dataset.rv.split(':');
    if (c === 'rc') { delete (L.rvCat || {})[i]; rerender(); } else if (c === 'rr') { delete (L.rvRek || {})[i]; rerender(); }
    else if (c === 'reset') { if (confirm('Hapus semua perubahan manual pada catatan & rekomendasi?')) { L.rvCat = {}; L.rvRek = {}; rerender(); } } });
};
const _nl7 = newLetter;
newLetter = function (tpl, from) { const l = _nl7(tpl, from); if (tpl === 'bareviu' && !(from && from.tpl === 'bareviu')) { l.rvNotes = {}; l.rvCat = {}; l.rvRek = {}; l.rvTidak = {}; } return l; };
