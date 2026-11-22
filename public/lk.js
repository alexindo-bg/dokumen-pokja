/* ===== Kertas Kerja Evaluasi (format "Kertas Kerja Evaluasi" + Rekap), bisa Excel (.xlsx) & PDF =====
   Satu model baris dipakai untuk pratinjau HTML (cetak/PDF) dan berkas Excel, jadi hasilnya identik. */
const LK_ADM = `Memiliki NIB
- Nomor
- Tanggal terbit Izin Usaha
- Masa berlaku Izin Usaha
- Instansi Pemberi Izin
- Kualifikasi Usaha
- Bidang pekerjaan KBLI
Akte Pendirian Perusahaan
- Nomor & tgl Akta
- Nama Notaris
- Nama perusahaan
- SK Kementerian Hukum dan HAM Republik Indonesia
Perubahan Akte Pendirian Perusahaan
- Nomor & tgl Akta
- Nama Notaris
- Nama perusahaan
- SK Kemenkumham
- Nama Direktur
- NIK
- Alamat
Kewajiban Perpajakan
- NPWP
- Bukti setor pajak tahun berjalan
- Nomor / Tanggal
- Memiliki status valid keterangan Wajib Pajak berdasarkan hasil Konfirmasi Status Wajib Pajak
Mempunyai atau menguasai tempat usaha/kantor dengan alamat yang benar
- Nomor
- Tgl terbit Izin Usaha
- Instansi Pemberi Izin
- Alamat Kantor
Tidak sedang dikenakan sanksi daftar hitam`;
const LK_KUAL = `Sertifikat/surat izin usaha atau produksi sesuai bidang pengadaan
- Nomor
- Tgl terbit izin sertifikat/surat
- Masa berlaku izin
- Instansi Pemberi Izin
- Bidang pekerjaan KBLI
Sertifikat/surat kelayakan atau kemampuan penyediaan barang
- Nomor
- Tgl terbit izin sertifikat/surat
- Masa berlaku
- Instansi Pemberi Izin`;
const LK_TEK = `Sesuai spesifikasi teknis pada KAK
Memiliki Sertifikat Mutu / Laporan Hasil Pengujian (LHP)
- Nomor
- Tgl terbit
- Masa berlaku
- Jenis/varietas
- Jumlah pada sertifikat
Surat pernyataan jaminan/kesanggupan menyediakan barang sesuai volume kontrak
- Nomor
- Lokasi/titik koordinat (bila ada)
Struktur Harga`;
const lkParse = (t) => { const it = []; for (const raw of String(t || '').split('\n')) { const s = raw.trim(); if (!s) continue; if (/^[-•]\s*/.test(s)) { if (!it.length) it.push({ label: '', subs: [] }); it[it.length - 1].subs.push(s.replace(/^[-•]\s*/, '')); } else it.push({ label: s.replace(/^\d+[.)]\s*/, ''), subs: [] }); } return it; };
const lkTxt = (l, k, d) => (l[k] !== undefined ? l[k] : d);
const LKMS = ['', 'MS', 'TMS'], LKHASIL = ['', 'Memenuhi', 'Tidak Memenuhi'], LKTIND = ['', 'Tunjuk Sebagai Pemenang', 'Tolak Penawaran'];
const lkPesDef = () => ({ nama: '', npwp: '', telp: '', email: '', alamat: '', rank: '', nilai: 0, msA: '', msK: '', msT: '', msH: '', klar: '', hasil: '', tindak: '', alasan: '' });
const lkShort = (s) => String(s || '').replace(/[\\/?*\[\]:]/g, ' ').slice(0, 31);
const lkLet = (i) => String.fromCharCode(65 + i);

/* ---- model baris (dipakai HTML & Excel) ---- */
function lkSheetRows(l, p, x) {
  const adm = l.lkAdm !== false, hps = num(p.hps), R_ = [], add = (s, c, o = {}) => R_.push({ s, c, ...o });
  add('title', [adm ? 'LEMBAR KERJA EVALUASI KUALIFIKASI, ADMINISTRASI, TEKNIS DAN HARGA' : 'LEMBAR KERJA EVALUASI KUALIFIKASI TEKNIS, TEKNIS DAN HARGA'], { m: [[0, 4]] });
  add('title', [String(p.nama || '').toUpperCase()], { m: [[0, 4]] }); add('title', ['SATUAN KERJA ' + String(p.satker || '').toUpperCase()], { m: [[0, 4]] }); add('blank', []);
  for (const [lb, k] of [['Nama Perusahaan', 'nama'], ['NPWP', 'npwp'], ['No. Telepon', 'telp'], ['Email', 'email'], ['Alamat', 'alamat']]) add('kv', ['', lb, x[k] || ''], { m: [[2, 4]] });
  add('blank', []);
  const sections = [...(adm ? [['HASIL EVALUASI KUALIFIKASI ADMINISTRASI/LEGALITAS', lkTxt(l, 'lkAdmTxt', LK_ADM), x.msA]] : []), ['HASIL EVALUASI KUALIFIKASI TEKNIS', lkTxt(l, 'lkKualTxt', LK_KUAL), x.msK], ['HASIL EVALUASI TEKNIS', lkTxt(l, 'lkTekTxt', LK_TEK), x.msT]];
  sections.forEach(([jd, txt, ms], si) => {
    add('hdr', ['NO.', 'PERSYARATAN', 'HASIL VERIFIKASI/DETAIL DOKUMEN', 'MS/TMS', 'CATATAN/KETERANGAN EVALUATOR']); add('sec', [`${lkLet(si)}. ${jd}:`], { m: [[0, 4]] });
    lkParse(txt).forEach((it, i) => { add('item', [`${i + 1}.`, it.label, '', '', '']); it.subs.forEach((sb) => add('sub', ['', sb, '', '', ''])); });
    add('concl', ['KESIMPULAN', '', '', ms || '', ''], { m: [[0, 2]] });
  });
  const hi = sections.length; add('hdr', ['NO.', 'PERSYARATAN', 'HASIL VERIFIKASI/DETAIL DOKUMEN', 'MS/TMS', 'CATATAN/KETERANGAN EVALUATOR']); add('sec', [`${lkLet(hi)}. HASIL EVALUASI HARGA`], { m: [[0, 4]] });
  add('item', ['1', 'Nama Perusahaan', x.nama || '', '', '']); add('kv2', ['', 'Total HPS (Rp.)', hps || '', '', ''], { f: 'num' }); add('kv2', ['', 'Total Penawaran (Rp.)', num(x.nilai) || '', '', ''], { f: 'num' }); add('kv2', ['', '% Penawaran dg HPS', hps && num(x.nilai) ? num(x.nilai) / hps : '', '', ''], { f: 'pct' });
  add('concl', ['KESIMPULAN', '', '', x.msH || '', ''], { m: [[0, 2]] }); add('blank', []);
  add('note', ['Catatan :*) MS = Memenuhi Syarat; TMS = Tidak Memenuhi Syarat'], { m: [[0, 4]] }); add('blank', []);
  add('plain', [`${l.kota || ''}, ${tgl(l.tgl)}`], { m: [[0, 4]] }); add('blank', []); add('plain', ['Pokja Pemilihan Barang/Jasa'], { m: [[0, 4]] }); add('plain', [`${S().lap2} - ${S().instansi}`], { m: [[0, 4]] }); add('blank', []);
  const ang = angOf(l); (ang.length ? ang : [{ p: { nama: '' } }]).forEach((a, i) => add('sign', [String(i + 1), a.p.nama || '', '.......................................................', '', ''], { m: [[2, 4]] }));
  return R_;
}
function lkRekap(l, p) {
  const ps = l.lkPes && l.lkPes.length ? l.lkPes : [lkPesDef()], hps = num(p.hps), adm = l.lkAdm !== false;
  return ps.map((x, i) => { const kq = [adm ? x.msA : '', x.msK].filter(Boolean), kual = kq.includes('TMS') ? 'TMS' : kq.length && kq.every((v) => v === 'MS') ? 'MS' : ''; return { no: i + 1, nama: x.nama, rank: x.rank, nilai: num(x.nilai), pct: hps && num(x.nilai) ? num(x.nilai) / hps : '', kual, tek: x.msT, harga: x.msH, klar: x.klar, hasil: x.hasil, tindak: x.tindak, alasan: x.alasan }; });
}
const lkPct = (v) => (v === '' || v == null ? '' : (v * 100).toFixed(2).replace('.', ',') + '%');
const lkNum = (v) => (v === '' || v == null || v === 0 ? '' : Number(v).toLocaleString('id-ID'));

/* ---- HTML ---- */
function lkHtmlSheet(rows) {
  const td = (v, o = '') => `<td ${o}>${esc(v)}</td>`;
  const body = rows.map((r) => {
    const c = r.c, sp = r.m && r.m[0];
    switch (r.s) {
      case 'title': return `<tr class=nb><td colspan=5 style="text-align:center;font-weight:700;border:0">${esc(c[0])}</td></tr>`;
      case 'blank': return '<tr class=nb><td colspan=5 style="border:0;height:8px"></td></tr>';
      case 'kv': return `<tr class=nb><td style="border:0"></td><td style="border:0">${esc(c[1])}</td><td colspan=3 style="border:0">${c[2] ? ':&nbsp; ' + esc(c[2]) : ':'}</td></tr>`;
      case 'hdr': return `<tr>${c.map((v) => `<th style="background:#d9d9d9;font-size:8.5pt">${esc(v)}</th>`).join('')}</tr>`;
      case 'sec': return `<tr><td colspan=5 style="font-weight:700;background:#f2f2f2">${esc(c[0])}</td></tr>`;
      case 'item': return `<tr>${td(c[0], 'style="text-align:center;vertical-align:top"')}${td(c[1], 'style="font-weight:600"')}${td(c[2])}${td(c[3], 'style="text-align:center"')}${td(c[4])}</tr>`;
      case 'sub': return `<tr>${td('')}${td(c[1], 'style="padding-left:14px"')}${td('')}${td('')}${td('')}</tr>`;
      case 'concl': return `<tr><td colspan=3 style="font-weight:700">${esc(c[0])}</td>${td(c[3], 'style="text-align:center;font-weight:700"')}${td('')}</tr>`;
      case 'kv2': return `<tr>${td('')}${td(c[1])}${td(r.f === 'pct' ? lkPct(c[2]) : r.f === 'num' ? lkNum(c[2]) : c[2], 'style="text-align:right"')}${td('')}${td('')}</tr>`;
      case 'note': return `<tr class=nb><td colspan=5 style="border:0;font-size:9pt">${esc(c[0])}</td></tr>`;
      case 'plain': return `<tr class=nb><td colspan=5 style="border:0;text-align:left">${esc(c[0])}</td></tr>`;
      case 'sign': return `<tr class=nb><td style="border:0;text-align:center">${esc(c[0])}</td><td style="border:0">${esc(c[1])}</td><td colspan=3 style="border:0">${esc(c[2])}</td></tr>`;
      default: return '';
    }
  }).join('');
  return `<table class="b lk" style="width:100%;font-size:9pt;margin:0"><colgroup><col style="width:5%"><col style="width:34%"><col style="width:27%"><col style="width:9%"><col></colgroup>${body}</table>`;
}
function lkRekapHtml(l, p) {
  const rk = lkRekap(l, p), hps = num(p.hps), th = ['No.', 'Nama Penyedia', 'Peringkat Sistem (rekomendasi)', 'Total Penawaran (Rp)', `% thd HPS (${rp(hps)})`, 'I. Kualifikasi', 'II. Teknis', 'III. Harga', 'IV. Klarifikasi', 'Hasil Evaluasi', 'Tindakan di INAPROC', 'Alasan Tolak'];
  return `<p class=tc style="margin:0">REKAP EVALUASI</p><p class=tc style="margin:0">${esc(String(p.nama || '').toUpperCase())}</p><p class=tc style="margin:0 0 8px">SATUAN KERJA ${esc(String(p.satker || '').toUpperCase())}</p><table class=b style="width:100%;font-size:8.5pt"><tr>${th.map((h) => `<th style="background:#d9d9d9">${esc(h)}</th>`).join('')}</tr>${rk.map((r) => `<tr><td style="text-align:center">${r.no}</td><td>${esc(r.nama)}</td><td style="text-align:center">${esc(r.rank)}</td><td style="text-align:right">${lkNum(r.nilai)}</td><td style="text-align:right">${lkPct(r.pct)}</td><td style="text-align:center">${esc(r.kual)}</td><td style="text-align:center">${esc(r.tek)}</td><td style="text-align:center">${esc(r.harga)}</td><td>${esc(r.klar)}</td><td>${esc(r.hasil)}</td><td>${esc(r.tindak)}</td><td>${esc(r.alasan)}</td></tr>`).join('')}</table><p style="font-size:9pt;margin-top:6px">Catatan: MS = Memenuhi Syarat; TMS = Tidak Memenuhi Syarat.</p>`;
}
R.lk = function (l, p) {
  const ps = l.lkPes && l.lkPes.length ? l.lkPes : [lkPesDef()];
  return ps.map((x) => `<div style="break-after:page">${lkHtmlSheet(lkSheetRows(l, p, x))}</div>`).join('') + `<div>${lkRekapHtml(l, p)}</div>`;
};

/* ---- penulis XLSX (tanpa pustaka) ---- */
const CRCT = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
const crc32 = (u) => { let c = ~0; for (let i = 0; i < u.length; i++) c = CRCT[(c ^ u[i]) & 255] ^ (c >>> 8); return (~c) >>> 0; };
function zipStore(files) {
  const enc = new TextEncoder(), chunks = [], cd = []; let off = 0; const u16 = (v) => [v & 255, (v >> 8) & 255], u32 = (v) => [v & 255, (v >>> 8) & 255, (v >>> 16) & 255, (v >>> 24) & 255];
  for (const [name, str] of files) { const nb = enc.encode(name), d = enc.encode(str), cr = crc32(d), h = new Uint8Array([0x50, 0x4b, 3, 4, ...u16(20), ...u16(0x0800), ...u16(0), ...u16(0), ...u16(0x21), ...u32(cr), ...u32(d.length), ...u32(d.length), ...u16(nb.length), ...u16(0)]); chunks.push(h, nb, d);
    cd.push(new Uint8Array([0x50, 0x4b, 1, 2, ...u16(20), ...u16(20), ...u16(0x0800), ...u16(0), ...u16(0), ...u16(0x21), ...u32(cr), ...u32(d.length), ...u32(d.length), ...u16(nb.length), ...u16(0), ...u16(0), ...u16(0), ...u16(0), ...u32(0), ...u32(off)]), nb); off += h.length + nb.length + d.length; }
  const cdl = cd.reduce((a, b) => a + b.length, 0); return new Blob([...chunks, ...cd, new Uint8Array([0x50, 0x4b, 5, 6, 0, 0, 0, 0, ...u16(files.length), ...u16(files.length), ...u32(cdl), ...u32(off), 0, 0])], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}
const xe = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const XS = { def: 0, title: 1, hdr: 2, cell: 3, bold: 4, num: 5, pct: 6, ctr: 7, plain: 8, pboldfill: 9, sec: 10, ctrb: 11, small: 12 };
const xcol = (i) => String.fromCharCode(65 + i);
function xlsxSheet(sh) {
  const rows = sh.rows.map((r, ri) => `<row r="${ri + 1}">${r.map((c, ci) => { if (c == null) return ''; const ref = xcol(ci) + (ri + 1), s = c.s ?? 0; let inner;
    if (c.f) inner = typeof c.v === 'number' ? `<f>${xe(c.f)}</f><v>${c.v}</v>` : `<f>${xe(c.f)}</f><v>${xe(c.v ?? '')}</v>`; else if (typeof c.v === 'number') inner = `<v>${c.v}</v>`; else if (c.v === '' || c.v == null) return `<c r="${ref}" s="${s}"/>`; else inner = `<is><t xml:space="preserve">${xe(c.v)}</t></is>`;
    return `<c r="${ref}" s="${s}"${c.f ? (typeof c.v === 'number' ? '' : ' t="str"') : typeof c.v === 'number' ? '' : ' t="inlineStr"'}>${inner}</c>`; }).join('')}</row>`).join('');
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetPr><pageSetUpPr fitToPage="1"/></sheetPr><sheetViews><sheetView workbookViewId="0" showGridLines="0"/></sheetViews><sheetFormatPr defaultRowHeight="15"/><cols>${sh.cols.map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`).join('')}</cols><sheetData>${rows}</sheetData>${sh.merges && sh.merges.length ? `<mergeCells count="${sh.merges.length}">${sh.merges.map((m) => `<mergeCell ref="${m}"/>`).join('')}</mergeCells>` : ''}${sh.dv ? `<dataValidations count="${sh.dv.length}">${sh.dv.map((d) => `<dataValidation type="list" allowBlank="1" showErrorMessage="1" sqref="${d.sq}"><formula1>"${xe(d.list)}"</formula1></dataValidation>`).join('')}</dataValidations>` : ''}<pageMargins left="0.5" right="0.5" top="0.6" bottom="0.6" header="0.3" footer="0.3"/><pageSetup paperSize="9" orientation="${sh.land ? 'landscape' : 'portrait'}" fitToWidth="1" fitToHeight="0"/></worksheet>`;
}
const XSTYLES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><numFmts count="2"><numFmt numFmtId="164" formatCode="#,##0"/><numFmt numFmtId="165" formatCode="0.00%"/></numFmts><fonts count="4"><font><sz val="10"/><name val="Arial"/></font><font><b/><sz val="10"/><name val="Arial"/></font><font><b/><sz val="12"/><name val="Arial"/></font><font><i/><sz val="9"/><name val="Arial"/></font></fonts><fills count="4"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFD9D9D9"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFF2F2F2"/></patternFill></fill></fills><borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border><border><left style="thin"><color auto="1"/></left><right style="thin"><color auto="1"/></right><top style="thin"><color auto="1"/></top><bottom style="thin"><color auto="1"/></bottom><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="13"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf><xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf><xf numFmtId="0" fontId="1" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf><xf numFmtId="164" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right" vertical="top"/></xf><xf numFmtId="165" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right" vertical="top"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="top" wrapText="1"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/><xf numFmtId="0" fontId="1" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="center"/></xf><xf numFmtId="0" fontId="1" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="top"/></xf><xf numFmtId="0" fontId="3" fillId="0" borderId="0" xfId="0" applyFont="1"/></cellXfs></styleSheet>`;
function lkWorkbook(l, p) {
  const ps = l.lkPes && l.lkPes.length ? l.lkPes : [lkPesDef()], hps = num(p.hps), sheets = [];
  // 1. Rincian Pekerjaan
  const rin = [['Nama Paket Pekerjaan/Pengadaan', p.nama], ['Uraian Pekerjaan', p.uraian || p.nama], ['RUP', p.rup], ['Nama PPK', p.ppk], ['Kode Anggaran', p.mak], ['Pagu Anggaran', num(p.pagu) ? rn(num(p.pagu)) : ''], ['Nilai HPS', hps ? rn(hps) : ''], ['Rencana Waktu', p.waktu ? tgl(p.waktu) : ''], ['Lokasi Pekerjaan', p.lokasi]];
  sheets.push({ name: 'Rincian Pekerjaan', cols: [6, 34, 80], rows: [[{ v: 'NO', s: XS.hdr }, { v: 'Keterangan', s: XS.hdr }, { v: 'Uraian', s: XS.hdr }], ...rin.map(([a, b], i) => [{ v: i + 1, s: XS.ctr }, { v: a, s: XS.cell }, { v: b || '', s: XS.cell }])] });
  // 2. LK per peserta (+ catat baris kunci untuk formula rekap)
  const keys = [];
  ps.forEach((x, pi) => {
    const rows = lkSheetRows(l, p, x), out = [], merges = [], dv = []; let penRow = 0, conclRows = [], hasilIdx = 0;
    rows.forEach((r, ri) => { const n = ri + 1, c = r.c, cells = [null, null, null, null, null], st = { title: XS.title, kv: XS.plain, hdr: XS.hdr, sec: XS.sec, item: XS.cell, sub: XS.cell, concl: XS.bold, kv2: XS.cell, note: XS.small, plain: XS.plain, sign: XS.plain, blank: XS.def }[r.s];
      if (r.s === 'title') cells[0] = { v: c[0], s: XS.title }; else if (r.s === 'blank') { } else if (r.s === 'kv') { cells[1] = { v: c[1], s: XS.plain }; cells[2] = { v: c[2], s: XS.plain }; }
      else if (r.s === 'hdr') c.forEach((v, i) => (cells[i] = { v, s: XS.hdr })); else if (r.s === 'sec') { cells[0] = { v: c[0], s: XS.sec }; for (let i = 1; i < 5; i++) cells[i] = { v: '', s: XS.sec }; }
      else if (r.s === 'item') { cells[0] = { v: c[0], s: XS.ctr }; cells[1] = { v: c[1], s: XS.bold }; cells[2] = { v: c[2], s: XS.cell }; cells[3] = { v: '', s: XS.ctr }; cells[4] = { v: '', s: XS.cell }; if (c[1] === 'Nama Perusahaan' && c[0] === '1') cells[2] = { v: c[2], s: XS.cell }; }
      else if (r.s === 'sub') { cells[0] = { v: '', s: XS.cell }; cells[1] = { v: c[1], s: XS.cell }; cells[2] = { v: '', s: XS.cell }; cells[3] = { v: '', s: XS.ctr }; cells[4] = { v: '', s: XS.cell }; }
      else if (r.s === 'concl') { cells[0] = { v: c[0], s: XS.bold }; cells[1] = { v: '', s: XS.bold }; cells[2] = { v: '', s: XS.bold }; cells[3] = { v: c[3], s: XS.ctrb }; cells[4] = { v: '', s: XS.cell }; conclRows.push(n); }
      else if (r.s === 'kv2') { cells[0] = { v: '', s: XS.cell }; cells[1] = { v: c[1], s: XS.cell }; cells[4] = { v: '', s: XS.cell }; cells[3] = { v: '', s: XS.cell };
        if (r.f === 'pct') cells[2] = { v: c[2], s: XS.pct, f: c[2] !== '' ? `C${n - 1}/C${n - 2}` : undefined }; else cells[2] = { v: c[2], s: r.f === 'num' ? XS.num : XS.cell }; if (c[1].startsWith('Total Penawaran')) penRow = n; }
      else if (r.s === 'note') cells[0] = { v: c[0], s: XS.small }; else if (r.s === 'plain') cells[0] = { v: c[0], s: XS.plain }; else if (r.s === 'sign') { cells[0] = { v: c[0], s: XS.plain }; cells[1] = { v: c[1], s: XS.plain }; cells[2] = { v: c[2], s: XS.plain }; }
      out.push(cells); (r.m || []).forEach(([a, b]) => merges.push(`${xcol(a)}${n}:${xcol(b)}${n}`)); });
    if (conclRows.length) dv.push({ sq: conclRows.map((n) => `D${n}`).join(' '), list: 'MS,TMS' });
    const nm = lkShort(`LK ${pi + 1}`); sheets.push({ name: nm, cols: [6, 46, 40, 12, 36], rows: out, merges, dv, land: true, _pen: penRow, _concl: conclRows, _x: x }); keys.push({ nm, penRow, conclRows });
  });
  // 3. Rekap Evaluasi (formula merujuk ke lembar LK)
  const adm = l.lkAdm !== false, rk = lkRekap(l, p), H = ['No.', 'Nama Penyedia', 'Peringkat Sistem (rekomendasi)', 'Total Penawaran (Rp)', `% thd HPS (${rn(hps)})`, 'I. Kualifikasi', 'II. Teknis', 'III. Harga', 'IV. Klarifikasi', 'Hasil Evaluasi', 'Tindakan di INAPROC', 'Alasan Tolak'];
  const nCon = adm ? 3 : 2, rrows = [[{ v: 'REKAP EVALUASI', s: XS.title }], [{ v: String(p.nama || '').toUpperCase(), s: XS.title }], [{ v: 'SATUAN KERJA ' + String(p.satker || '').toUpperCase(), s: XS.title }], [], H.map((h) => ({ v: h, s: XS.hdr }))];
  rk.forEach((r, i) => { const k = keys[i], n = rrows.length + 1, q = `'${k.nm}'!`, cr = k.conclRows;
    const kualF = adm ? `IF(OR(${q}D${cr[0]}="TMS",${q}D${cr[1]}="TMS"),"TMS",IF(AND(${q}D${cr[0]}="MS",${q}D${cr[1]}="MS"),"MS",""))` : `IF(${q}D${cr[0]}="TMS","TMS",IF(${q}D${cr[0]}="MS","MS",""))`, tekRow = cr[adm ? 2 : 1];
    rrows.push([{ v: r.no, s: XS.ctr }, { v: r.nama || '', s: XS.cell, f: `IF(${q}C5="","",${q}C5)` }, { v: r.rank === '' ? '' : (+r.rank || r.rank), s: XS.ctr }, { v: r.nilai || '', s: XS.num, f: `IF(${q}C${k.penRow}="","",${q}C${k.penRow})` }, { v: r.pct, s: XS.pct, f: hps ? `IF(D${n}="","",D${n}/${hps})` : undefined }, { v: r.kual, s: XS.ctr, f: kualF }, { v: r.tek || '', s: XS.ctr, f: `${q}D${tekRow}&""` }, { v: r.harga || '', s: XS.ctr, f: `${q}D${cr[cr.length - 1] || ''}&""`.replace(/D$/, 'D1') }, { v: r.klar || '', s: XS.cell }, { v: r.hasil || '', s: XS.cell }, { v: r.tindak || '', s: XS.cell }, { v: r.alasan || '', s: XS.cell }]); });
  // harga: kesimpulan harga adalah baris KESIMPULAN terakhir di tiap LK
  rk.forEach((r, i) => { const k = keys[i], row = rrows[5 + i]; row[7] = { v: r.harga || '', s: XS.ctr, f: `'${k.nm}'!D${k.conclRows[k.conclRows.length - 1]}&""` }; });
  const last = 5 + rk.length; sheets.push({ name: 'Rekap Evaluasi', cols: [5, 32, 14, 18, 14, 16, 12, 12, 26, 16, 22, 34], rows: [...rrows, [], [{ v: 'Catatan: MS = Memenuhi Syarat; TMS = Tidak Memenuhi Syarat. Kolom Nama, Total Penawaran, % dan I–III terisi otomatis dari lembar LK.', s: XS.small }]], merges: ['A1:L1', 'A2:L2', 'A3:L3'], dv: [{ sq: `J6:J${last}`, list: 'Memenuhi,Tidak Memenuhi' }, { sq: `K6:K${last}`, list: 'Tunjuk Sebagai Pemenang,Tolak Penawaran' }], land: true });
  const files = [['[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>${sheets.map((s, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')}</Types>`],
    ['_rels/.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'],
    ['xl/workbook.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${sheets.map((s, i) => `<sheet name="${xe(s.name)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join('')}</sheets><calcPr calcId="191029" fullCalcOnLoad="1"/></workbook>`],
    ['xl/_rels/workbook.xml.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${sheets.map((s, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join('')}<Relationship Id="rId${sheets.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`],
    ['xl/styles.xml', XSTYLES], ...sheets.map((s, i) => [`xl/worksheets/sheet${i + 1}.xml`, xlsxSheet(s)])];
  return zipStore(files);
}

/* ---- template, formulir, tombol ---- */
TPL.lk = { n: 'Kertas kerja evaluasi (LK + Rekap, Excel/PDF)', d: 'Lembar kerja evaluasi per penyedia + Rekap Evaluasi; unduh Excel (.xlsx) atau cetak PDF. Evaluasi administrasi bisa dimatikan.', i: '☰', nonum: 1 };
TPL.kk.n = 'Kertas kerja per produk (format lama)';
{ const old = { ...TPL }, ord = ['reviu', 'bareviu', 'dmk', 'ubah', 'eval', 'batal', 'nego', 'bukti', 'lap', 'lk', 'kk'].filter((k) => old[k]); Object.keys(TPL).forEach((k) => delete TPL[k]); ord.forEach((k) => (TPL[k] = old[k])); KEYS.length = 0; KEYS.push(...ord); }
const lkSel = (i, k, opts) => `<select data-p="lkPes.${i}.${k}">${opts.map((o) => `<option value="${o}" ${(L.lkPes[i][k] || '') === o ? 'selected' : ''}>${o || '—'}</option>`).join('')}</select>`;
FB.lk = function () {
  const ps = (L.lkPes ||= []), adm = L.lkAdm !== false, inp = (i, k, lb, ph = '') => `<div><label>${lb}</label><input data-p="lkPes.${i}.${k}" value="${esc(ps[i][k] ?? '')}" placeholder="${ph}"></div>`;
  const cards = ps.map((x, i) => `<details class=more ${i === 0 ? 'open' : ''}><summary>${i + 1}. ${esc(x.nama || '(penyedia baru)')} ${x.rank ? `<span class=muted>· peringkat ${esc(x.rank)}</span>` : ''}</summary>
    <div class=g2>${inp(i, 'nama', 'Nama penyedia', 'Nama perusahaan')}${inp(i, 'npwp', 'NPWP')}${inp(i, 'telp', 'No. telepon')}${inp(i, 'email', 'Email')}</div><label>Alamat</label><textarea data-p="lkPes.${i}.alamat">${esc(x.alamat || '')}</textarea>
    <div class=g2>${inp(i, 'rank', 'Peringkat sistem', 'mis. 1')}${inp(i, 'nilai', 'Total penawaran (Rp)', 'mis. 1937360700')}</div>
    <div class=g2>${adm ? `<div><label>Kesimpulan administrasi</label>${lkSel(i, 'msA', LKMS)}</div>` : ''}<div><label>Kesimpulan kualifikasi teknis</label>${lkSel(i, 'msK', LKMS)}</div><div><label>Kesimpulan teknis</label>${lkSel(i, 'msT', LKMS)}</div><div><label>Kesimpulan harga</label>${lkSel(i, 'msH', LKMS)}</div></div>
    ${inp(i, 'klar', 'IV. Klarifikasi (catatan)', 'mis. Perlu klarifikasi terkait Akte perusahaan')}<div class=g2><div><label>Hasil evaluasi</label>${lkSel(i, 'hasil', LKHASIL)}</div><div><label>Tindakan di INAPROC</label>${lkSel(i, 'tindak', LKTIND)}</div></div>${inp(i, 'alasan', 'Alasan tolak (bila ditolak)')}
    <p><button class="btn s" data-lk="del:${i}">Hapus penyedia</button></p></details>`).join('');
  const txa = (k, lb, d) => `<div class=fld><label>${lb} ${L[k] !== undefined ? `<a data-lk="rst:${k}">(kembalikan default)</a>` : ''}</label><textarea data-k="${k}" rows=9>${esc(lkTxt(L, k, d))}</textarea></div>`;
  return sec(2, 'Cakupan evaluasi', `${chk('lkAdm', 'Ada evaluasi kualifikasi administrasi/legalitas (matikan bila tidak diperlukan — bagian administrasi tidak ditampilkan)', true)}<p class=muted>Dengan administrasi: A Administrasi · B Kualifikasi Teknis · C Teknis · D Harga. Tanpa administrasi: A Kualifikasi Teknis · B Teknis · C Harga.</p>`)
    + sec(3, `Penyedia (${ps.length})`, `<p><button class="btn p" data-lk="import">Ambil dari BA hasil evaluasi / papan peringkat</button> <button class=btn data-lk="add">+ Tambah penyedia</button></p>${cards || '<p class=muted>Belum ada penyedia — ambil dari BA hasil evaluasi atau tambah manual. Tanpa penyedia, satu lembar kosong tetap ditampilkan.</p>'}`)
    + sec(4, 'Butir persyaratan (bisa diubah)', `<p class=muted>Satu baris = satu persyaratan; baris diawali “-” = rincian di bawahnya. Penomoran otomatis.</p>${adm ? txa('lkAdmTxt', 'A. Kualifikasi administrasi/legalitas', LK_ADM) : ''}${txa('lkKualTxt', 'Kualifikasi teknis', LK_KUAL)}${txa('lkTekTxt', 'Evaluasi teknis', LK_TEK)}`)
    + sec(5, 'Tanggal & Pokja', `<div class=g2>${fx('tgl', 'Tanggal', { t: 'date' })}${fx('kota', 'Kota')}</div>${angPanel()}${kertasBln()}`);
};
function lkImport() {
  const e = lastOf(L.pid, 'eval'); if (!e) { alert('Belum ada BA hasil evaluasi pada paket ini.'); return; } norm(e); const pes = (e.items && e.items[0] && e.items[0].pes) || [];
  if (!pes.length) { alert('BA hasil evaluasi belum berisi peserta.'); return; }
  let won = false; L.lkPes = pes.map((x, i) => { const ok = x.st === 'Memenuhi', o = { ...lkPesDef(), nama: x.nama || '', rank: String(x.rank || i + 1), nilai: num(x.nilai) }; if (ok) { Object.assign(o, { msK: 'MS', msT: 'MS', msH: 'MS', msA: 'MS', hasil: 'Memenuhi', tindak: won ? 'Tolak Penawaran' : 'Tunjuk Sebagai Pemenang' }); won = true; } else Object.assign(o, { hasil: 'Tidak Memenuhi', tindak: 'Tolak Penawaran', alasan: /memenuhi syarat/i.test(x.ket || '') ? '' : x.ket || '' }); return o; });
  rerender();
}
const _wire9 = wire;
wire = function () {
  _wire9(); const f = $('#fm'); if (!f || f._lk) return; f._lk = 1;
  f.addEventListener('click', (e) => { const b = e.target.closest('[data-lk]'); if (!b) return; const [c, v] = b.dataset.lk.split(':');
    if (c === 'import') lkImport(); else if (c === 'add') { (L.lkPes ||= []).push(lkPesDef()); rerender(); } else if (c === 'del') { L.lkPes.splice(+v, 1); rerender(); } else if (c === 'rst') { delete L[v]; rerender(); } });
  f.addEventListener('change', (e) => { if (e.target.dataset.k === 'lkAdm') rerender(); });
};
const lkFile = () => judul(L).replace(/\s+/g, ' ') + '.xlsx';
const _form9 = form;
form = function () {
  _form9(); if (L.tpl !== 'lk') return; const b = $('#fm') && $('#fm').querySelector('.bar'); if (!b) return;
  b.insertAdjacentHTML('beforeend', '<button class=btn id=lkx title="Unduh sebagai Excel (.xlsx) lengkap dengan lembar Rekap">Excel</button><button class=btn id=lkd title="Simpan Excel ke folder Drive paket">☁ Excel</button>');
  $('#lkx').onclick = () => { saveL(); const a = document.createElement('a'); a.href = URL.createObjectURL(lkWorkbook(L, paketOf(L))); a.download = lkFile(); a.click(); setSt('Excel diunduh'); };
  $('#lkd').onclick = async () => { saveL(); setSt('Mengunggah Excel ke Drive…'); try { const r = await driveUp(lkWorkbook(L, paketOf(L)), lkFile(), 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', { sub: pktFolder(paketOf(L)) }); (L.drv ||= []).push({ id: r.id, url: drvLink({ id: r.id, webViewLink: r.webViewLink }), nama: lkFile(), at: Date.now() }); saveL(); setSt('Excel tersimpan di Drive ✓'); rerender(); } catch (e) { setSt('Gagal ke Drive'); alert(e.message); } };
};
