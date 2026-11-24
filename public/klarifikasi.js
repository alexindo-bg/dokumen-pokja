/* ===== BA Hasil Klarifikasi: daring (Zoom/INAPROC) atau luring (di lokasi penyedia) =====
   Dua format dalam satu template, dipilih lewat "Cara pelaksanaan":
   - Daring  → "BA Pembuktian dan Klarifikasi Mini Kompetisi": data paket, undangan INAPROC + Zoom, data pihak penyedia, hasil klarifikasi, tabel tanda tangan.
   - Luring  → "BA Klarifikasi Teknis": kotak data (nama klarifikasi, nomor, uraian, tanggal, lokasi), hasil klarifikasi, TTD Pokja / Tim Teknis / Mengetahui penyedia.
   Lampiran dokumentasi (foto) opsional untuk keduanya. */
TPL.bakla = { n: 'BA hasil klarifikasi', d: 'Berita acara hasil klarifikasi/pembuktian penyedia, dapat dibuat untuk pelaksanaan daring (Zoom) maupun luring (di lokasi).', i: '✎' };
{ const ks = Object.keys(TPL).filter((k) => k !== 'bakla'), at = ks.indexOf('bukti') + 1 || ks.length; ks.splice(at, 0, 'bakla');
  const old = { ...TPL }; Object.keys(TPL).forEach((k) => delete TPL[k]); ks.forEach((k) => (TPL[k] = old[k])); KEYS.length = 0; KEYS.push(...ks); }

const BK_PRE = [
  ['Struktur harga penawaran', 'Berdasarkan hasil klarifikasi, struktur harga penawaran penyedia mencakup rincian harga barang per ...... yang terdiri dari komponen bahan baku, pengemasan (packaging), biaya tenaga kerja, serta keuntungan, dan harga tersebut sudah termasuk PPN. Pada dokumen penawaran, rincian tersebut disesuaikan menjadi total harga barang per ...... sebesar Rp ...... dan ongkos kirim sebesar Rp ...... . Seluruh komponen biaya tersebut telah mencakup keuntungan penyedia dan dinyatakan telah sesuai tanpa menimbulkan perubahan harga.'],
  ['Kapasitas produksi', 'Berdasarkan hasil klarifikasi, Penyedia mampu memproduksi/mengemas dengan kapasitas ...... per hari. Dengan total kepemilikan sebanyak ...... unit mesin/fasilitas, kapasitas produksi maksimal Penyedia dapat mencapai ...... per hari, sehingga mencukupi kebutuhan pengadaan sesuai jadwal pelaksanaan.'],
  ['Ketersediaan barang', 'Berdasarkan hasil klarifikasi ketersediaan barang, Penyedia memiliki stok persediaan di gudang sebanyak ......, jumlah stok tersebut mencukupi untuk memenuhi kebutuhan pengadaan sebanyak ...... .'],
  ['Keabsahan & metode pengujian', 'Metode pengujian yang digunakan mengacu pada standar ...... dengan nilai toleransi sebagai berikut:\n- ......\n- ......'],
  ['Pengiriman & pengemasan', 'Berdasarkan hasil klarifikasi, Penyedia menyatakan sanggup melakukan pengiriman ke lokasi ...... paling lambat tanggal ...... dengan pengemasan sesuai spesifikasi teknis yang ditetapkan.'],
];
const bkDar = (l) => (l.cara || 'Daring') === 'Daring';
const bkWin = (pid) => { const e = lastOf(pid, 'eval'), w = e && winnerOf(itemsPes(norm(e)), e.items[0].win); return w ? w.nama : ''; };

/* isian awal: ambil dari undangan pembuktian pada paket yang sama */
function bkInit(l) {
  const b = lastOf(l.pid, 'bukti');
  l.cara ||= (b && b.cara) || 'Daring';
  l.kepada ??= (b && b.kepada) || bkWin(l.pid);
  l.tglKeg ??= (b && b.tglKeg) || today();
  l.jam ??= (b && b.jam) || '';
  l.undNo ??= b && b.no ? nomor(b) : ''; l.undTgl ??= (b && b.tgl) || '';
  ['zid', 'zpass', 'zlink', 'tmp'].forEach((k) => { if (b && b[k] != null && l[k] == null) l[k] = b[k]; });
  l.hadir ??= [{ nama: '', jabatan: 'Direktur Utama', kontak: '', email: '', alamat: '' }];
  l.hasil ??= [{ judul: '', isi: '' }];
  l.fotos ??= []; l.tim ??= '';
}
{ const _nl = newLetter; newLetter = function (tpl, from) { const l = _nl(tpl, from); if (tpl === 'bakla') bkInit(l); return l; }; }
{ const _ms = missing; missing = function () { const m = _ms(); if (L.tpl === 'bakla') { if (!L.kepada) m.push(['Nama penyedia', '[data-k=kepada]']); if (!L.tglKeg) m.push(['Tanggal klarifikasi', '[data-k=tglKeg]']); if (!(L.hasil || []).some((x) => (x.judul || '').trim() || (x.isi || '').trim())) m.push(['Hasil klarifikasi', '[data-p^="hasil."]']); if (!angOf(L).length) m.push(['Anggota Pokja', '#angq']); } return m; }; }

/* ---------- dokumen ---------- */
const bkTitle = (l) => l.judulBA || (bkDar(l) ? 'BERITA ACARA PEMBUKTIAN DAN KLARIFIKASI\nMINI KOMPETISI PADA PENGADAAN BARANG' : 'BERITA ACARA KLARIFIKASI TEKNIS');
const bkHasil = (l) => {
  const it = (l.hasil || []).filter((x) => (x.judul || '').trim() || (x.isi || '').trim()); if (!it.length) return '<p>......</p>';
  return it.map((x, i) => { const ls = lines(x.isi), subs = ls.filter((y) => /^[-•]/.test(y)).map((y) => y.replace(/^[-•]\s*/, '')), body = ls.filter((y) => !/^[-•]/.test(y)).join('\n'), no = `${i + 1}.`;
    const head = x.judul ? `<p class="hl l1 kn" style="margin-bottom:3pt"><span class=hn>${no}</span><span class=ht>${esc(x.judul)}</span></p>${body ? `<p class=in1 style="text-align:justify;margin-top:0">${nl(body)}</p>` : ''}` : `<p class="hl l1" style="text-align:justify"><span class=hn>${no}</span><span class=ht>${nl(body)}</span></p>`;
    return head + (subs.length ? `<ol class=in1 style="list-style-type:lower-alpha;margin:2px 0 8px;padding-left:22px;text-align:justify">${subs.map((y) => `<li>${esc(y)}</li>`).join('')}</ol>` : ''); }).join('');
};
const bkSig = (l, p) => {
  const kp = esc(l.kepada || 'PT./CV. ......'), hd = (l.hadir || []).filter((h) => h.nama);
  if (bkDar(l)) {
    const rows = [...hd.map((h) => ({ n: esc(h.nama), j: `${esc(h.jabatan || '')}<br>${kp}`, s: '' })), ...angOf(l).map((a) => ({ n: esc(a.p.nama), j: `${a.p.nip ? 'NIP ' + esc(a.p.nip) + '<br>' : ''}Anggota Pokja Pemilihan`, s: sigCell(a) }))];
    return `<p class=kn style="margin:14px 0 4px">Tanda tangan para pihak dalam pembuktian dan klarifikasi dokumen penawaran:</p><table class=b style="width:100%"><tr><th style="width:34px">No</th><th style="width:32%">Nama</th><th>Jabatan</th><th style="width:25%">Tanda Tangan</th></tr>${rows.map((r, i) => `<tr><td style="text-align:center">${i + 1}.</td><td>${r.n}</td><td>${r.j}</td><td style="height:56px;text-align:center;vertical-align:middle">${r.s}</td></tr>`).join('')}</table>`;
  }
  const dots = '...……', tim = lines(l.tim);
  const lst = (ttl, rows) => `<p class=kn style="margin:0 0 4px;text-align:left">${ttl}</p><table style="width:100%;border-collapse:collapse">${rows.map(([n, sg], i) => `<tr><td style="width:7mm;padding:0;height:44px;vertical-align:middle;text-align:left">${i + 1}.</td><td style="padding:0 6px 0 0;vertical-align:middle;text-align:left">${n}</td><td style="width:34%;vertical-align:middle;text-align:left">${sg || dots}</td></tr>`).join('')}</table>`;
  const kiri = lst(`Pokja Pemilihan Barang/Jasa<br>${esc(p.instansi || S().instansi)}`, angOf(l).map((a) => [esc(a.p.nama), sigCell(a)])) + (tim.length ? `<div style="height:14px"></div>${lst('Tim Teknis Kegiatan', tim.map((n) => [esc(n), '']))}` : '');
  const kanan = `<p class=kn style="margin:0;text-align:center">Mengetahui,<br>${kp}</p>${(hd.length ? hd : [{ nama: '......' }]).map((h) => `<div style="text-align:center;margin-top:8px"><div style="height:44px;line-height:44px">${dots}</div>${esc(h.nama)}${h.jabatan ? `<br><small>${esc(h.jabatan)}</small>` : ''}</div>`).join('')}`;
  return `<div style="break-inside:avoid;margin-top:16px"><table style="width:100%;border-collapse:collapse"><tr><td style="width:56%;vertical-align:top;padding:0 14px 0 0">${kiri}</td><td style="vertical-align:top;padding:0">${kanan}</td></tr></table></div>`;
};
const bkDok = (l) => ((l.fotos || []).length ? `${PB}<p class=tc style="margin:0 0 10px">Lampiran Dokumentasi</p>${l.fotos.map((f) => `<p style="text-align:center;margin:10px 0"><img src="${f.src}" style="max-width:88%;max-height:270px">${f.cap ? `<br><span style="font-size:10pt">${esc(f.cap)}</span>` : ''}</p>`).join('')}` : '');
R.bakla = function (l, p) {
  const dar = bkDar(l), kp = esc(l.kepada || 'PT./CV. ......'), nm = esc(l.kegiatan || p.nama || '......'), tg = l.tglKeg || l.tgl, hd = (l.hadir || []).filter((h) => h.nama), h0 = (l.hadir || [])[0] || {};
  const st = `Surat ${esc(p.pejabatST || S().pejabat)} Nomor: ${esc(p.stNo)} tanggal ${tgl(p.stTgl)}`;
  const ttl = `<p class=tc style="margin:0">${nl(bkTitle(l))}</p>`;
  const penutup = esc(l.penutupBA || (dar ? 'Demikian Berita Acara ini dibuat dengan penuh tanggung jawab, untuk dapat dipergunakan sebagaimana mestinya.' : 'Demikian Berita Acara ini dibuat untuk dapat dipergunakan sebagai dasar Pokja untuk mengevaluasi dokumen penawaran.'));
  if (dar) {
    const z = zoomOf(l);
    return `${ttl}<p class=tc style="font-weight:400;margin-top:4px">Nomor: ${nomor(l)}</p>
    <p>Pada hari ini ${kataTgl(tg)}, kami selaku Kelompok Kerja (Pokja) Pemilihan ${nm}, berdasarkan ${st}, pada:</p>
    ${kv([['Nama Paket', nm], ['Metode Pengadaan Mini Kompetisi', esc(p.metode || 'Itemized')], ['Nama Instansi/Satuan Kerja', esc([p.instansi || S().instansi, p.satker].filter(Boolean).join('/'))], ['Nilai Pagu Anggaran', rpd(num(p.pagu))], ['Nilai Harga Perkiraan Sendiri (HPS)', rpd(num(p.hps))], ['Sumber Anggaran', esc(p.sumber)], ['Lokasi Pekerjaan/Pengiriman', esc(p.lokasi)], ['Waktu Pelaksanaan Pekerjaan/Tanggal Penyelesaian Pekerjaan', tgl(p.waktu)]], 215)}
    <p>Pokja Pemilihan Barang/Jasa telah melakukan pembuktian dan klarifikasi dokumen penawaran <b>${kp}</b> dengan undangan melalui INAPROC Nomor ${esc(l.undNo || '......')} tanggal ${tgl(l.undTgl)} via Zoom Meeting${z.link ? ' ' + esc(z.link) : ''}${z.id ? ' Meeting ID: ' + esc(z.id) : ''}${z.pass ? ', Passcode: ' + esc(z.pass) : ''}. Pihak ${kp} dihadiri oleh:</p>
    ${kv([['Nama', esc(h0.nama || '......')], ['No Kontak', esc(h0.kontak || 'Via INAPROC')], ['Email', esc(h0.email || '......')], ['Jabatan', esc(h0.jabatan || '......')], ['Alamat', esc(h0.alamat || '......')]], 100)}
    <p class=kn>Berdasarkan hasil klarifikasi dan pembuktian dokumen penawaran yang dilaksanakan bersama ${kp}, diperoleh hasil klarifikasi sebagai berikut:</p>
    ${bkHasil(l)}<p>${penutup}</p>${bkSig(l, p)}${bkDok(l)}`;
  }
  const dihadiri = hd.length ? listID(hd.map((h) => `<b>${esc(h.nama)}</b>${h.jabatan ? ` selaku ${esc(h.jabatan)} ${kp}` : ''}`)) : '......';
  return `${ttl}
  ${kv([['Nama Klarifikasi', esc(l.nmKlar || 'Klarifikasi')], ['Nomor', nomor(l)], ['Uraian Pekerjaan', esc(l.uraian || nm)], ['Tanggal', tgl(tg)], ['Lokasi', esc(l.lokasi || '......')], ['Lampiran', esc(l.lamp ?? '-')]], 135)}
  <p>Pada hari ini ${kataTgl(tg)}, Pokja Pengadaan Barang/Jasa yang ditunjuk dengan ${st.replace(/^Surat /, 'Surat Tugas ')} telah melakukan klarifikasi${l.uraian ? ` (khususnya terkait ${esc(l.uraian)})` : ''} <b>${kp}</b> bertempat di ${esc(l.lokasi || '......')}${l.alamat ? ` di ${esc(l.alamat)}` : ''}${hd.length ? ', dihadiri/didampingi oleh ' + dihadiri : ''}.</p>
  <p class=kn style="text-align:left"><b>Hasil Klarifikasi :</b></p>${bkHasil(l)}<p>${penutup}</p>${bkSig(l, p)}${bkDok(l)}`;
};

/* ---------- formulir ---------- */
FB.bakla = function () {
  const dar = bkDar(L), ws = [...new Set([bkWin(L.pid), ...D.surat.filter((s) => s.pid === L.pid && s.tpl === 'bukti').map((s) => s.kepada)].filter(Boolean))];
  const hadir = (L.hadir ||= []), hasil = (L.hasil ||= []), fotos = (L.fotos ||= []);
  const pin = (path, v, ph, lb) => `<div class=fld><label>${lb}</label><input data-p="${path}" value="${esc(v || '')}" placeholder="${esc(ph || '')}"></div>`;
  return sec(2, 'Cara pelaksanaan', `<div class=fld>${seg('cara', CARA)}</div><p class=muted>${dar ? 'Daring: format “BA Pembuktian dan Klarifikasi” (undangan INAPROC + Zoom, tabel tanda tangan).' : 'Luring: format “BA Klarifikasi Teknis” (di lokasi penyedia, tanda tangan Pokja / Tim Teknis / Mengetahui penyedia).'}</p>`)
    + sec(3, 'Penyedia & waktu', `<div class=chs>${ws.map((n) => `<span class="ch ${L.kepada === n ? 'on' : ''}" data-q="kepada=${esc(n)}">${L.kepada === n ? '✓ ' : ''}${esc(n)}</span>`).join('')}</div>${fx('kepada', 'Nama penyedia (perusahaan)', { ph: 'mis. PT. Dharma Ayu Tani' })}
      <div class=g2>${fx('tglKeg', 'Tanggal klarifikasi', { t: 'date' })}${dar ? fx('jam', 'Jam mulai', { list: 'jamdl' }) : fx('nmKlar', 'Nama klarifikasi', { val: 'Klarifikasi' })}</div>
      ${dar ? `<div class=g2>${fx('undNo', 'Nomor undangan INAPROC', { ph: 'mis. 1533/PL.030/A.5.3/10/2026' })}${fx('undTgl', 'Tanggal undangan', { t: 'date' })}</div>${zoomBox()}`
        : `${fx('lokasi', 'Lokasi klarifikasi', { ph: 'mis. Head Office & Laboratory' })}${fx('alamat', 'Alamat lokasi (opsional)', { ph: 'mis. Jl. Pajajaran No.17, Gandasari, Jatiuwung, Tangerang' })}${fx('uraian', 'Uraian pekerjaan / pokok klarifikasi', { area: 1, ph: 'mis. keabsahan dan metode pengujian laboratorium pada sampel bahan seragam' })}`}`)
    + sec(4, 'Pihak penyedia yang hadir', hadir.map((h, i) => `<div class=card2><div class=r1><span class=n>${i + 1}</span><input data-p="hadir.${i}.nama" value="${esc(h.nama)}" placeholder="Nama yang hadir"><button class=ib data-bk="hrm:${i}" ${hadir.length > 1 ? '' : 'disabled'}>×</button></div><div class=g2>${pin(`hadir.${i}.jabatan`, h.jabatan, 'mis. Direktur Utama', 'Jabatan')}${dar ? pin(`hadir.${i}.kontak`, h.kontak, 'mis. Via INAPROC/08123…', 'No kontak') : ''}</div>${i === 0 && dar ? `<div class=g2>${pin('hadir.0.email', h.email, 'email penyedia', 'Email')}${pin('hadir.0.alamat', h.alamat, 'alamat penyedia', 'Alamat')}</div>` : ''}</div>`).join('') + `<p><a data-bk="hadd">+ Tambah yang hadir</a></p>`)
    + sec(5, 'Hasil klarifikasi', `<div class=qk><small>Tambah cepat:</small>${BK_PRE.map((x, i) => `<a data-bk="spre:${i}">${x[0]}</a>`).join('')}</div>${hasil.map((x, i) => `<div class=card2><div class=r1><span class=n>${i + 1}</span><input data-p="hasil.${i}.judul" value="${esc(x.judul)}" placeholder="Judul butir (boleh kosong), mis. Struktur Harga Penawaran"><button class=ib data-bk="srm:${i}" ${hasil.length > 1 ? '' : 'disabled'}>×</button></div><textarea data-p="hasil.${i}.isi" rows=5 placeholder="Uraian hasil klarifikasi. Butir otomatis bernomor 1. 2. 3.; baris berawalan “- ” menjadi poin a. b. c.">${esc(x.isi)}</textarea></div>`).join('')}<p><a data-bk="sadd">+ Tambah butir hasil</a></p>`)
    + sec(6, 'Nomor & tanggal BA', numBox('Tanggal BA'))
    + more('Lainnya — judul, anggota Pokja & TTD, tim teknis, penutup, lampiran foto', `${fx('judulBA', 'Judul BA (kosong = otomatis)', { area: 1, ph: bkTitle({ cara: L.cara }) })}${angPanel()}${dar ? '' : fx('tim', 'Tim Teknis Kegiatan (satu nama per baris)', { area: 1 })}${fx('penutupBA', 'Kalimat penutup (kosong = otomatis)', { area: 1 })}${fx('lamp', 'Lampiran', { val: '-' })}
      <div class=fld><label>Lampiran dokumentasi (foto)</label><input type=file accept="image/*" multiple data-bkfoto><small class=muted>Foto dikecilkan otomatis. Maks. 8 foto.</small></div>${fotos.map((f, i) => `<div class=card2><div class=r1><span class=n>${i + 1}</span><img src="${f.src}" style="height:44px;border-radius:6px"><input data-p="fotos.${i}.cap" value="${esc(f.cap)}" placeholder="Keterangan foto"><button class=ib data-bk="frm:${i}">×</button></div></div>`).join('')}${kertasBln()}`);
};

const bkImg = (file) => new Promise((ok) => { const r = new FileReader(); r.onerror = () => ok(''); r.onload = () => { const im = new Image(); im.onerror = () => ok(''); im.onload = () => { const k = Math.min(1, 1000 / Math.max(im.width, im.height)), c = document.createElement('canvas'); c.width = Math.round(im.width * k); c.height = Math.round(im.height * k); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); ok(c.toDataURL('image/jpeg', 0.75)); }; im.src = r.result; }; r.readAsDataURL(file); });
{ const _w = wire; wire = function () {
  _w(); const f = $('#fm'); if (!f || f._bk) return; f._bk = 1;
  f.addEventListener('click', (e) => { const x = e.target.closest('[data-bk]'); if (!x) return; const [c, i] = x.dataset.bk.split(':');
    if (c === 'hadd') L.hadir.push({ nama: '', jabatan: '', kontak: '', email: '', alamat: '' });
    else if (c === 'hrm' && L.hadir.length > 1) L.hadir.splice(+i, 1);
    else if (c === 'sadd') L.hasil.push({ judul: '', isi: '' });
    else if (c === 'srm' && L.hasil.length > 1) L.hasil.splice(+i, 1);
    else if (c === 'spre') { const b = BK_PRE[+i], e0 = L.hasil.length === 1 && !L.hasil[0].judul && !L.hasil[0].isi; const n = { judul: b[0], isi: b[1] }; e0 ? (L.hasil[0] = n) : L.hasil.push(n); }
    else if (c === 'frm') L.fotos.splice(+i, 1);
    else return; rerender(); });
  f.addEventListener('change', async (e) => { const x = e.target; if (!x.dataset || x.dataset.bkfoto === undefined) return; const fs = [...x.files].slice(0, Math.max(0, 8 - (L.fotos || []).length)); for (const fl0 of fs) { const src = await bkImg(fl0); if (src) (L.fotos ||= []).push({ src, cap: '' }); } rerender(); });
}; }
