'use strict';
/* ===== util ===== */
const $ = (s, e = document) => e.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const nl = (s) => esc(s).replace(/\n/g, '<br>');
const lines = (s) => String(s || '').split('\n').map((x) => x.trim()).filter(Boolean);
const uid = () => Math.random().toString(36).slice(2, 9);
const BL = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const HR = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const pd = (s) => { const [y, m, d] = String(s).slice(0, 10).split('-').map(Number); return new Date(y, m - 1, d); };
const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const tgl = (s) => { if (!s) return '......'; const d = pd(s); return `${d.getDate()} ${BL[d.getMonth()]} ${d.getFullYear()}`; };
const hari = (s) => (s ? HR[pd(s).getDay()] : '......');
const jam = (s) => String(s || '').slice(11, 16).replace(':', '.');
const dtm = (s) => (s ? `${hari(s)}, ${tgl(s)}, pukul ${jam(s)} ${(D && D.set && D.set.zona) || 'WIB'}` : '......');
const num = (s) => Number(String(s || '').replace(/\D/g, '')) || 0;
const rp = (n) => (n ? 'Rp ' + Number(n).toLocaleString('id-ID') + ',00' : '......');
const SAT = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas'];
const tb = (n) => {
  n = Math.floor(n);
  if (n < 12) return SAT[n];
  if (n < 20) return tb(n - 10) + ' belas';
  if (n < 100) return tb(Math.floor(n / 10)) + ' puluh' + (n % 10 ? ' ' + tb(n % 10) : '');
  if (n < 200) return 'seratus' + (n % 100 ? ' ' + tb(n % 100) : '');
  if (n < 1000) return tb(Math.floor(n / 100)) + ' ratus' + (n % 100 ? ' ' + tb(n % 100) : '');
  if (n < 2000) return 'seribu' + (n % 1000 ? ' ' + tb(n % 1000) : '');
  for (const [v, w] of [[1e12, 'triliun'], [1e9, 'miliar'], [1e6, 'juta'], [1e3, 'ribu']])
    if (n >= v) return tb(Math.floor(n / v)) + ' ' + w + (n % v ? ' ' + tb(n % v) : '');
};
const cap = (s) => s.replace(/\b\w/g, (c) => c.toUpperCase());
const rupiahKata = (n) => (n ? `${rp(n)} (${cap(tb(n))} Rupiah)` : '......');
const fill = (t, v) => String(t || '').replace(/\{(\w+)\}/g, (_, k) => (v[k] ?? '......'));

/* ===== teks baku (bisa diedit di Pengaturan > Template) ===== */
const TX = {
  dmkDasar: `Peraturan Presiden Nomor 16 Tahun 2018 tentang Pengadaan Barang/Jasa Pemerintah sebagaimana telah diubah terakhir dengan Peraturan Presiden Nomor 46 Tahun 2025;
Peraturan LKPP Nomor 2 Tahun 2026 tentang Katalog Elektronik dalam Pengadaan Barang/Jasa Pemerintah;
Peraturan LKPP Nomor 3 Tahun 2026 tentang Pedoman Persiapan dan Pelaksanaan Pengadaan Barang/Jasa Pemerintah melalui Penyedia;
Keputusan Kepala LKPP Nomor 93 Tahun 2025 tentang Pelaksanaan E-purchasing Katalog Elektronik melalui Metode Mini-Kompetisi.`,
  dmkIsi: `# KATEGORI PRODUK DAN SKEMA PENAWARAN
Paket diumumkan pada Katalog Elektronik dengan kategori produk sebagai berikut:
[KATEGORI]
Skema penawaran: Mini Kompetisi Itemized, yaitu penawaran, peringkat, dan pemenang ditetapkan per item produk.
# JADWAL DAN JANGKA WAKTU
- Jadwal penayangan paket, batas akhir pemasukan penawaran, dan batas akhir penyelesaian pekerjaan untuk paket sesuai dengan yang diumumkan pada aplikasi Katalog Elektronik.
- Jangka waktu pemasukan penawaran paling singkat 1 (satu) hari kerja sejak paket ditayangkan, tidak dapat dipercepat, tetapi dapat diperpanjang melalui aplikasi.
- Jangka waktu pelaksanaan pekerjaan sesuai KAK dan dihitung sejak tanggal Surat Pesanan.
# PERSYARATAN PESERTA
- Terdaftar sebagai Penyedia Katalog dan memiliki produk yang tayang pada Kategori Tingkat III sebagaimana dimaksud pada huruf B.
- Memiliki NIB dengan KBLI yang sesuai dengan persyaratan KBLI pada Kategori Tingkat III.
- Memiliki perizinan berusaha/sertifikat yang dipersyaratkan untuk produk yang ditawarkan sesuai KAK dan peraturan perundang-undangan (apabila ada).
- Memiliki NPWP dengan status KSWP valid.
- Memiliki tempat usaha dengan alamat yang benar, tetap, dan jelas (milik sendiri atau sewa).
- Tidak masuk dalam Daftar Hitam.
- Memiliki kapasitas hukum untuk mengikatkan diri pada Surat Pesanan, dibuktikan dengan akta pendirian dan perubahannya (badan usaha) atau KTP (perorangan); penandatangan adalah pihak yang berwenang atau penerima kuasa yang sah.
# KETENTUAN PENAWARAN
- Penawaran disampaikan melalui aplikasi Katalog Elektronik pada paket sesuai jadwal yang diumumkan; penawaran di luar aplikasi atau setelah batas akhir tidak diterima.
- Produk yang ditawarkan wajib memenuhi seluruh spesifikasi teknis dalam KAK, dan peserta wajib mengunggah dokumen pendukung yang dipersyaratkan (antara lain brosur, sertifikat, surat dukungan/jaminan apabila dipersyaratkan) pada paket yang ditawar.
- Harga penawaran tidak boleh melebihi harga pagu per produk pada paket yang bersangkutan, dan telah memperhitungkan keuntungan, seluruh biaya sampai lokasi penyerahan, serta pajak dan pungutan lain yang berlaku.
- Peserta wajib memilih opsi pengiriman pada aplikasi. Apabila menggunakan kurir penyedia, ongkos kirim wajib dicantumkan terpisah dari harga satuan produk (harga satuan tidak boleh lagi memuat ongkos kirim) dan menjadi bagian dari total penawaran. Ketentuan ini tidak berlaku untuk kategori yang menerapkan harga zonasi atau tidak memiliki opsi pengiriman.
- Penawaran yang telah disampaikan tidak dapat dibatalkan, tetapi dapat diubah selama jadwal penawaran berlangsung (produk, harga, opsi dan harga pengiriman).
- Peserta dilarang meminjamkan atau menggunakan nama perusahaan pihak lain (pinjam bendera), mengalihkan seluruh pekerjaan kepada pihak lain, melakukan persekongkolan/KKN, atau menyampaikan dokumen/keterangan tidak benar. Pelanggaran mengakibatkan penawaran digugurkan dan dikenakan sanksi sesuai ketentuan.
# EVALUASI DAN PENETAPAN PEMENANG
- Peringkat disusun otomatis oleh aplikasi Katalog Elektronik untuk paket per item, berdasarkan prioritas Produk Dalam Negeri (PDN) kemudian harga terendah; untuk pengadaan barang di atas Rp 1.000.000.000,00 menggunakan Harga Evaluasi Akhir (HEA) dengan preferensi TKDN.
- Pokja Pemilihan mengevaluasi peserta peringkat pertama pada paket; apabila tidak memenuhi syarat, evaluasi dilanjutkan ke peringkat berikutnya.
- Evaluasi meliputi pemenuhan persyaratan peserta (huruf D), pemenuhan spesifikasi teknis dan dokumen pendukung (huruf E), serta kesesuaian data TKDN dengan Daftar Inventarisasi pada tkdn.kemenperin.go.id (apabila produk mencantumkan TKDN).
- Pokja Pemilihan dapat melakukan klarifikasi, termasuk kebenaran surat dukungan kepada penerbitnya, tanpa mengubah substansi penawaran. Hasil klarifikasi dituangkan dalam Berita Acara Klarifikasi; dokumen yang tidak benar atau tidak sesuai mengakibatkan peserta gugur.
- Pemenang ditetapkan per item.
- Calon pemenang wajib mengonfirmasi penetapan paling lambat 3 (tiga) hari kerja. Apabila menolak atau tidak menjawab, evaluasi dilanjutkan ke peringkat berikutnya; penolakan tanpa alasan yang dapat diterima dikenakan sanksi.
- Hasil penetapan diumumkan melalui aplikasi Katalog Elektronik, dilanjutkan dengan penandatanganan Surat Pesanan secara elektronik oleh PPK dan Penyedia untuk paket.
# PEMBATALAN MINI KOMPETISI
- Mini Kompetisi pada paket dapat dibatalkan apabila hanya 1 (satu) peserta yang menyampaikan penawaran, tidak ada penawaran setelah perpanjangan waktu, tidak ada peserta yang memenuhi syarat, terdapat kesalahan evaluasi/prosedur, PPK menolak hasil pemilihan, anggaran tidak mencukupi akibat realokasi, atau alasan lain sesuai ketentuan.
- Alasan pembatalan diumumkan melalui aplikasi. Tindak lanjutnya berupa Mini Kompetisi ulang, E-purchasing dengan metode lain, atau metode pemilihan lain untuk paket yang bersangkutan.
# JAMINAN PELAKSANAAN
- Untuk nilai Surat Pesanan di atas Rp 200.000.000,00 pada paket, calon Penyedia wajib menyerahkan Jaminan Pelaksanaan kepada PPK sebelum penandatanganan Surat Pesanan.
- Besaran: 5% dari nilai Surat Pesanan apabila nilai penawaran 80%–100% dari HPS paket; atau 5% dari nilai total HPS paket apabila nilai penawaran di bawah 80% dari HPS.
- Bentuk bank garansi atau surety bond, tidak bersyarat, mudah dicairkan, dan berlaku sampai serah terima pekerjaan.
- Calon Penyedia yang tidak menyerahkan Jaminan Pelaksanaan dianggap mengundurkan diri dan dikenakan sanksi sesuai ketentuan.`,
  lapDasar: `Peraturan Presiden Nomor 16 Tahun 2018 tentang Pengadaan Barang/Jasa Pemerintah sebagaimana telah beberapa kali diubah, terakhir dengan Peraturan Presiden Nomor 46 Tahun 2025;
Peraturan Lembaga Kebijakan Pengadaan Barang/Jasa Pemerintah Nomor 2 Tahun 2026 tentang Katalog Elektronik pada Pengadaan Barang/Jasa Pemerintah;
Surat Tugas {pejabatST} Nomor {stNo} tanggal {stTgl} tentang Kelompok Kerja Pemilihan paket {nama};
Berita Acara Hasil Evaluasi Mini Kompetisi Nomor {baNo} tanggal {baTgl}.`,
  lapTindak: `PPK/KPA mereviu laporan hasil pemilihan penyedia;
PPK/KPA menetapkan Surat Penunjukan Penyedia Barang/Jasa (SPPBJ);
Dalam hal PPK/KPA tidak menyetujui hasil pemilihan Penyedia, PPK/KPA menyampaikan penolakan tersebut kepada Pokja Pemilihan disertai dengan alasan dan bukti.`,
  lapPenutup: `Bersama ini kami sampaikan Berita Acara Hasil Evaluasi Mini Kompetisi, Berita Acara Pembuktian dan Klarifikasi, serta Dokumen Penawaran dari {pemenang}. Demikian laporan ini disampaikan, atas perhatian dan kerjasamanya diucapkan terima kasih.`,
  lapTembusan: `Kepala Biro Umum dan Pengadaan selaku Kepala UKPBJ Kementerian Pertanian;\nKuasa Pengguna Anggaran {satker}.`,
  buktiIsi: `Menindaklanjuti Surat Tugas {pejabatST} Nomor: {stNo} tanggal {stTgl} tentang Pokja Pemilihan Barang/Jasa {nama}, bersama ini Pokja Pemilihan akan melakukan Pembuktian dan Klarifikasi Kualifikasi Penyedia pekerjaan dimaksud {cara}.`,
  buktiPenutup: `Sehubungan hal di atas, Saudara agar menyiapkan dokumen kualifikasi dan penawaran.`,
  buktiTembusan: `Kepala Biro Umum dan Pengadaan selaku Kepala UKPBJ Kementerian Pertanian;\nInspektur Jenderal Kementerian Pertanian.`,
  reviuIsi: `Menindaklanjuti Surat Tugas {pejabatST} Nomor {stNo} tanggal {stTgl} tentang Kelompok Kerja Pemilihan Penyedia {nama}, bersama ini Pokja Pemilihan akan melakukan {kegiatan} paket pekerjaan dimaksud.`,
  evalPembuka: `Pada hari ini {hariKata}, kami selaku Kelompok Kerja (Pokja) Pemilihan {nama} berdasarkan Surat {pejabatST} Nomor: {stNo} tanggal {stTgl}, pada:`,
  evalIsi: `Dengan ini kami Pokja Pemilihan telah melaksanakan proses evaluasi Mini Kompetisi dengan uraian sebagai berikut:`,
  evalPenutup: `Demikian Berita Acara ini dibuat dengan sebenarnya untuk dipergunakan sebagaimana mestinya.`,
};
const TXL = { dmkDasar: 'DMK — Dasar hukum (satu per baris)', dmkIsi: 'DMK — Isi bab B–H ("# Judul", "- butir", [KATEGORI] = tabel kategori)', reviuIsi: 'Undangan reviu — paragraf pembuka', buktiIsi: 'Undangan pembuktian — paragraf pembuka', buktiPenutup: 'Undangan pembuktian — kalimat sebelum penutup', buktiTembusan: 'Undangan pembuktian — tembusan', evalPembuka: 'BA hasil evaluasi — pembuka', evalIsi: 'BA hasil evaluasi — kalimat sebelum tabel hasil', evalPenutup: 'BA hasil evaluasi — penutup', lapDasar: 'Laporan — dasar pelaksanaan', lapTindak: 'Laporan — tindak lanjut', lapTembusan: 'Laporan — tembusan' };
const tx = (k) => (D.tpl[k] != null && D.tpl[k] !== '' ? D.tpl[k] : TX[k]);

const DEF = () => ({
  set: { klas: 'PL.030', unit: 'A.5.3', kota: 'Bogor', kertas: 'A4', zoomTempat: '', zoomLink: '', zoomId: '', zoomPass: '', zona: 'WIB', pejabat: 'Kepala Biro Umum dan Pengadaan', instansi: 'Kementerian Pertanian', penutupMK: 'a.n. Pokja Pemilihan', an: 'a.n. Kelompok Kerja Pemilihan', unitBaris: 'Biro Umum dan Pengadaan', lap1: 'Kelompok Kerja Pemilihan', lap2: 'Biro Umum dan Pengadaan', penutup: 'Demikian, atas perhatian dan kerjasamanya diucapkan terima kasih.', kop1: 'KEMENTERIAN PERTANIAN', kop2: 'SEKRETARIAT JENDERAL', kop3: 'JALAN HARSONO RM NOMOR 3 PASAR MINGGU, JAKARTA 12550\nKOTAK POS 83/1200/PASARMINGGU\nTELEPON (021) 7804116 – 7806131, FAKSIMILI (021) 7816180\nWEBSITE: https://pertanian.go.id', logo: '' },
  pokja: [], paket: [], surat: [], tpl: {}, monitor: [], mpk: null,
});

/* ===== state & api ===== */
let U, D, V = 0, view = 'surat', tab = 'kode', L = null, saveT;
const S = () => D.set;
const api = async (p, m = 'GET', b) => {
  const r = await fetch('/api/' + p, { method: m, headers: { 'content-type': 'application/json' }, body: b && JSON.stringify(b) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error(j.error || 'Gagal'), { status: r.status });
  return j;
};
const setSt = (t) => { const e = $('#st'); if (e) e.textContent = t; };
function dirty() { clearTimeout(saveT); setSt('Menyimpan…'); saveT = setTimeout(persist, 900); }
async function persist() {
  try { V = (await api('ws', 'PUT', { v: V, data: D })).v; setSt('Tersimpan'); }
  catch (e) { if (e.status === 409) { alert(e.message); location.reload(); } else setSt('Gagal menyimpan: ' + e.message); }
}
async function load() { const r = await api('ws'); V = r.v; D = r.data || DEF(); D.set = { ...DEF().set, ...D.set }; D.tpl ||= {}; D.monitor ||= []; if (!D.mpk) { D.mpk = D.wil && D.wil.length ? [{ id: uid(), nama: 'Paket Monitoring', jenis: '', wil: D.wil }] : []; delete D.wil; } D.mpk.forEach((p) => p.wil.forEach((r) => (r.sat ||= 'Kg'))); purgeObs(); if (!r.data) await persist(); }

/* surat jenis lama (kertas kerja evaluasi / per produk) sudah dihapus: datanya dipindah ke D.arsip (tidak dibuang) */
const OBS = ['kk', 'lk'];
const EVAL_PEMBUKA_LAMA = 'Pada hari ini {hariTgl}, kami selaku Kelompok Kerja (Pokja) Pemilihan berdasarkan Surat Tugas {pejabatST} Nomor: {stNo} tanggal {stTgl}, pada:';
function purgeObs() {
  const old = (D.surat || []).filter((s) => OBS.includes(s.tpl));
  if (old.length) { (D.arsip ||= []).push(...old); D.surat = D.surat.filter((s) => !OBS.includes(s.tpl)); }
  if (D.last) OBS.forEach((k) => delete D.last[k]);
  if (D.tpl && D.tpl.evalPembuka === EVAL_PEMBUKA_LAMA) delete D.tpl.evalPembuka; // pakai kalimat pembuka format baru
}

/* ===== autentikasi (kode referral) ===== */
function authView(mode = 'login', err = '') {
  const reg = mode === 'reg';
  $('#app').innerHTML = `<div class=auth><div class=card><h3 style="font-size:20px">Dokumen Pokja</h3>
  <p class=muted>${reg ? 'Pendaftaran hanya dengan kode referral dari admin.' : 'Masuk untuk membuat surat dan dokumen Pokja.'}</p>
  ${reg ? '<label>Nama lengkap</label><input id=n autocomplete=name>' : ''}<label>Email</label><input id=e type=email autocomplete=email>
  <label>Sandi${reg ? ' (min. 8 karakter)' : ''}</label><input id=p type=password autocomplete=${reg ? 'new-password' : 'current-password'}>
  ${reg ? '<label>Kode referral</label><input id=r autocapitalize=characters style="text-transform:uppercase;letter-spacing:.08em">' : ''}
  <div class=err>${esc(err)}</div><p><button class="btn p" id=go style="width:100%">${reg ? 'Daftar' : 'Masuk'}</button></p>
  <p class=muted style="text-align:center"><a href=# id=sw>${reg ? 'Sudah punya akun? Masuk' : 'Belum punya akun? Daftar dengan kode referral'}</a></p></div></div>`;
  $('#sw').onclick = (e) => { e.preventDefault(); authView(reg ? 'login' : 'reg'); };
  const go = async () => {
    try {
      const b = { email: $('#e').value, password: $('#p').value };
      if (reg) { b.name = $('#n').value; b.ref = $('#r').value; }
      U = (await api('auth?a=' + (reg ? 'register' : 'login'), 'POST', b)).user;
      await start();
    } catch (x) { authView(mode, x.message); }
  };
  $('#go').onclick = go;
  $('#app').onkeydown = (e) => { if (e.key === 'Enter') go(); };
}

/* ===== kerangka ===== */
async function start() {
  await load();
  L = null; view = 'home';
  shell();
}
let hq = '';
function shell() {
  const ini = (U.name || '?').split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  const nav = [['home', 'Beranda', '⌂'], ['surat', 'Buat Surat', '✎'], ['mon', 'Monitoring', '◔'], ['drv', 'Dokumen Drive', '☁'], ['set', 'Pengaturan', '⚙']];
  $('#app').innerHTML = `<div class="frame ${localStorage.getItem('col') === '1' ? 'col' : ''}"><aside class=noprint><div class=brand><span class=lg></span><span class=tx>Dokumen Pokja</span><a id=cl title="Ciutkan / lebarkan sidebar">‹</a></div><button class=up id=nw><span class=tx>Buat Surat Baru</span><i class=pl>+</i></button>
  <nav>${nav.map(([k, n, c]) => `<a data-v=${k} class="${view === k ? 'on' : ''}"><i>${c}</i><span class=tx>${n}</span></a>`).join('')}</nav>
  <h6 class=tx>PAKET</h6><nav>${D.paket.slice(0, 8).map((p) => `<a data-pk=${p.id}><i class=dot></i><span class=cl>${esc(p.nama)}</span></a>`).join('') || '<small>Belum ada paket</small>'}</nav>
  <div class=sp></div><small id=st></small><a id=out><i>⇥</i><span class=tx>Keluar (${esc(U.name.split(' ')[0])})</span></a></aside>
  <section class=body><main class=main id=main></main></section></div>`;
  document.querySelectorAll('aside [data-v]').forEach((a) => (a.onclick = () => { view = a.dataset.v; shell(); }));
  document.querySelectorAll('aside [data-pk]').forEach((a) => (a.onclick = () => { pe = a.dataset.pk; tab = 'paket'; view = 'set'; shell(); }));
  $('#nw').onclick = () => openLetter(newLetter(L?.tpl || 'reviu', { pid: L?.pid }));
  $('#cl').onclick = () => { localStorage.setItem('col', localStorage.getItem('col') === '1' ? '0' : '1'); shell(); };
  $('#out').onclick = async () => { await api('auth?a=logout', 'POST'); U = null; authView(); };
  ({ home: homeView, surat: suratView, mon: monView, drv: driveView, set: setView })[view]();
}
function openLetter(l) { L = l; view = 'surat'; shell(); }
function homeList() {
  const q = hq.toLowerCase(), rec = D.surat.slice().sort((a, b) => b.ts - a.ts).filter((s) => !q || (judul(s) + ' ' + s.no).toLowerCase().includes(q)).slice(0, 30);
  $('#rc').innerHTML = `<table class=ft><tr><th>NAMA</th><th>PAKET</th><th>TANGGAL</th><th>OLEH</th><th></th></tr>${rec.map((s) => `<tr><td><i class=fi>${TPL[s.tpl].i}</i>${esc(TPL[s.tpl].n)}${s.no ? ' · ' + s.no : ''}</td><td class=m>${esc((paketOf(s) || {}).nama || '')}</td><td class=m>${tgl(s.tgl)}</td><td class=m>${esc(s.by || '')}</td><td class=r><a data-o=${s.id}>Buka</a><a data-c=${s.id}>Buat lagi</a></td></tr>`).join('') || '<tr><td colspan=5 class=m>Belum ada surat.</td></tr>'}</table>`;
  $('#rc').onclick = (e) => { const o = e.target.dataset.o, c = e.target.dataset.c; if (o) openLetter(JSON.parse(JSON.stringify(D.surat.find((x) => x.id === o)))); if (c) { const x = D.surat.find((y) => y.id === c); openLetter(newLetter(x.tpl, x)); } };
}
function homeView() {
  $('#main').innerHTML = `<div class=head><h1>Beranda</h1><input id=gq placeholder="Cari surat atau paket…" value="${esc(hq)}" style="max-width:320px;margin-left:auto"></div><h6>AKSES CEPAT</h6><div class=cards>${KEYS.map((k, n) => `<div class="cd ${n === 0 ? 'hot' : ''}" data-n=${k}><i class=ic>${TPL[k].i}</i><b>${TPL[k].n}</b><small>${TPL[k].d}</small></div>`).join('')}</div><h6 style="margin-top:30px">SEMUA SURAT</h6><div id=rc></div>`;
  homeList(); $('#gq').oninput = (e) => { hq = e.target.value; homeList(); };
  document.querySelectorAll('#main [data-n]').forEach((b) => (b.onclick = () => openLetter(newLetter(b.dataset.n, { pid: L?.pid }))));
}
function monSites() {
  const embed = (v) => ((String(v).match(/src=["']([^"']+)/) || [0, v])[1] || '').trim();
  $('#mb').innerHTML = `<div class=panel style="margin-top:0"><div class=g2><div><label>Nama monitoring</label><input id=mn placeholder="mis. Progres paket dolomit"></div><div><label>Tautan Google Sites (atau kode embed)</label><input id=mu placeholder="https://sites.google.com/view/..."></div></div><p><button class="btn p" id=ma>Tambah monitoring</button></p><p class=muted>Pakai situs yang sudah diterbitkan (Google Sites › Terbitkan, akses "Siapa saja"). Jika kotak di bawah kosong, Google/pemilik situs memblokir penyematan; gunakan "Buka di tab baru".</p><div class=err id=me></div></div>
  ${D.monitor.map((x) => `<div class=panel><div class=row style="border:0;padding:0 0 10px"><b style="flex:1">${esc(x.nama)}</b><a class="btn s" href="${esc(x.url)}" target=_blank rel=noopener style="text-decoration:none;color:inherit">Buka di tab baru</a><button class="btn s" data-r=${x.id}>Ubah</button><button class="btn s" data-d=${x.id}>Hapus</button></div><iframe src="${esc(x.url)}" loading=lazy referrerpolicy=no-referrer allowfullscreen style="width:100%;height:72vh;border:1px solid #e3ded8;border-radius:10px;background:#fff"></iframe></div>`).join('') || '<p class=muted>Belum ada monitoring.</p>'}`;
  $('#ma').onclick = () => { const u = embed($('#mu').value), n = $('#mn').value.trim(); if (!n || !/^https:\/\//.test(u)) return ($('#me').textContent = 'Isi nama dan tautan https://'); D.monitor.push({ id: uid(), nama: n, url: u }); dirty(); monView(); };
  $('#mb').onclick = (e) => { const t = e.target, m = (id) => D.monitor.find((x) => x.id === id);
    if (t.dataset.d && confirm('Hapus monitoring ini?')) { D.monitor = D.monitor.filter((x) => x.id !== t.dataset.d); dirty(); monView(); }
    if (t.dataset.r) { const x = m(t.dataset.r), n = prompt('Nama', x.nama), u = n && embed(prompt('Tautan', x.url) || ''); if (n && /^https:\/\//.test(u)) { x.nama = n; x.url = u; dirty(); monView(); } } };
}

/* ===== definisi template surat ===== */
const CARA = ['Daring', 'Luring'];
const TPL = {
  reviu: { n: 'Undangan reviu dokumen persiapan', d: 'Undangan konsolidasi dan reviu dokumen persiapan pengadaan.', i: '✉' },
  dmk: { n: 'Dokumen mini kompetisi', d: 'Dokumen ketentuan pelaksanaan mini kompetisi e-purchasing.', i: '▤', nonum: 1 },
  ubah: { n: 'BA perubahan paket kompetisi', d: 'Berita acara perpanjangan masa tayang atau perubahan paket.', i: '⟳' },
  bukti: { n: 'Undangan pembuktian & klarifikasi', d: 'Undangan pembuktian dan klarifikasi kualifikasi penyedia.', i: '✉' },
  eval: { n: 'BA hasil evaluasi', d: 'Berita acara hasil evaluasi, peringkat, dan pemenang.', i: '✓' },
  batal: { n: 'BA pembatalan kompetisi', d: 'Berita acara pembatalan mini kompetisi beserta alasan dan tindak lanjut.', i: '⊘' },
  lap: { n: 'Laporan hasil pemilihan', d: 'Laporan hasil pemilihan untuk PPK.', i: '▣' },
};
const KEYS = Object.keys(TPL);
const DOKS = ['Spesifikasi Teknis', 'KAK', 'HPS', 'Rancangan Kontrak', 'Dokumen Anggaran', 'Jadwal Pelaksanaan'];
const ALASAN = ['hanya 1 (satu) peserta yang menyampaikan penawaran', 'tidak ada penawaran setelah perpanjangan waktu', 'tidak ada peserta yang memenuhi syarat', 'terdapat kesalahan evaluasi/prosedur', 'PPK menolak hasil pemilihan', 'anggaran tidak mencukupi akibat realokasi'];
const TINDAK = ['Mini Kompetisi Ulang', 'Menggunakan metode E-Purchasing lain seperti Negosiasi', 'Menggunakan metode Pemilihan Penyedia lainnya'];
const JENISMK = ['Mini Kompetisi Barang Itemized', 'Mini Kompetisi Barang Non Itemized', 'Mini Kompetisi Barang Jasa Lainnya Itemized', 'Mini Kompetisi Barang Jasa Lainnya Non Itemized', 'Mini Kompetisi Pekerjaan Konstruksi'];
const STP = ['Memenuhi', 'Tidak Memenuhi', 'Gugur'];
const listID = (a, last = 'dan') => (a.length < 2 ? a[0] || '' : a.length === 2 ? a.join(' ' + last + ' ') : a.slice(0, -1).join(', ') + ', ' + last + ' ' + a[a.length - 1]);
const paketOf = (l) => D.paket.find((p) => p.id === l.pid);
const yr = (l) => String(l.tgl || '').slice(0, 4);
const numbered = (y) => D.surat.filter((s) => yr(s) === String(y) && TPL[s.tpl] && !TPL[s.tpl].nonum && +s.no);
const lastNo = (y) => numbered(y).sort((a, b) => +b.no - +a.no)[0];
const nextNo = (y) => (lastNo(y) ? +lastNo(y).no : 0) + 1;
let lastOf = (pid, t) => D.surat.filter((s) => s.pid === pid && s.tpl === t).sort((a, b) => b.ts - a.ts)[0];
function bulanNo(l) { const m = pd(l.tgl || today()).getMonth() + 1; return l.blnMode === 'lalu' ? (m === 1 ? 12 : m - 1) : m; }
const nomor = (l) => `${l.no || '......'}/${S().klas}/${S().unit}/${bulanNo(l)}/${yr(l)}`;
const winnerOf = (pes, win) => { pes = pes || []; if (win !== '' && win != null && pes[+win]) return pes[+win]; return pes.find((x) => x.st === 'Memenuhi'); };
const itemsPes = (l) => (l.tpl === 'eval' ? (l.items && l.items[0] ? l.items[0].pes : []) : l.pes || []);
const clone = (x) => JSON.parse(JSON.stringify(x));
const qdate = (n) => { const d = new Date(); let k = 0; while (k < n) { d.setDate(d.getDate() + 1); if (d.getDay() % 6) k++; } if (n === 0) return today(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const LASTK = ['docs', 'konsol', 'jam', 'cara', 'pen', 'lain', 'penutup', 'sap', 'letak', 'an', 'ub', 'lamp', 'garis', 'scan', 'ttd', 'tindak', 'dasar', 'jenisMK', 'blnMode', 'kertas', 'kota'];

function norm(l) {
  l.o ||= {};
  if (['reviu', 'bukti', 'lap'].includes(l.tpl) && l.judulTengah === undefined) l.judulTengah = true;
  if (!l.angs) l.angs = (l.ang || []).map((id) => ({ id, ttd: true }));
  if (l.tpl === 'eval' && !l.items) l.items = [{ nama: '', pes: parsePes(l.peserta).map((x) => ({ nama: x.nama, nilai: x.nilai, st: 'Memenuhi', ket: x.ket || 'Memenuhi Syarat' })), win: '' }];
  if (l.tpl === 'ubah' && !l.items) l.items = [{ t: 'tayang', semula: l.semula || '', baru: l.baru || '' }];
  if (l.tpl === 'bukti' && l.sap === undefined) { l.sap = /^ibu/i.test(l.pic || '') ? 'Ibu' : 'Bapak'; l.dir = (l.pic || '').replace(/^(bapak|ibu)\s*/i, ''); }
  if (l.tpl === 'lap' && !l.pes) l.pes = parsePes(l.peserta).map((x) => ({ nama: x.nama, nilai: x.nilai, st: 'Memenuhi', ket: x.ket || 'Memenuhi Syarat' }));
  return l;
}
function newLetter(tpl, from) {
  const last = (D.last && D.last[tpl]) || {};
  const l = { id: uid(), tpl, pid: from?.pid ?? D.paket[D.paket.length - 1]?.id, tgl: today(), kota: tpl === 'lap' || tpl === 'dmk' ? 'Jakarta' : S().kota, blnMode: 'ikut', scan: true, ttd: D.pokja[0]?.id, o: {}, ...clone(last) };
  const same = D.surat.filter((s) => s.pid === l.pid && s.angs && s.angs.length).sort((a, b) => b.ts - a.ts)[0];
  l.angs = same ? clone(same.angs) : D.pokja.map((p) => ({ id: p.id, ttd: true }));
  if (tpl === 'reviu') Object.assign(l, { docs: l.docs || ['Spesifikasi Teknis', 'HPS'], konsol: l.konsol ?? true, jam: l.jam || '10.00', cara: l.cara || 'Daring', pen: l.pen || { ppk: true, tim: true, pokja: true } });
  if (tpl === 'bukti') { const e = lastOf(l.pid, 'eval'), w = e && winnerOf(itemsPes(norm(e)), e.items[0].win); Object.assign(l, { jam: l.jam || '14.00', cara: l.cara || 'Daring', sap: l.sap || 'Bapak', kepada: w ? w.nama : '', dir: '', di: 'Tempat' }); }
  if (tpl === 'ubah') l.items = [{ t: 'tayang', semula: '', baru: '' }];
  if (tpl === 'eval') l.items = [{ nama: '', pes: [], win: '' }];
  if (tpl === 'batal') Object.assign(l, { alasanSel: [], alasanTxt: '', dasar: l.dasar || 'pertimbangan dan penilaian Pokja Pemilihan', tindak: l.tindak || TINDAK[0], jenisMK: l.jenisMK || '' });
  if (tpl === 'lap') { const e = lastOf(l.pid, 'eval'); l.pes = e ? clone(norm(e).items[0].pes) : []; l.win = e ? e.items[0].win : ''; }
  if (['reviu', 'bukti', 'lap'].includes(tpl)) l.judulTengah = true;
  if (from && from.tpl === tpl) Object.assign(l, clone(from), { id: l.id, tgl: today(), no: undefined, ts: undefined });
  return norm(l);
}

/* ===== pembuat HTML dokumen ===== */
let kop = () => { const s = S(); return `<div class=kop>${s.logo ? `<img src="${s.logo}">` : ''}<div class=x><b>${esc(s.kop1)}</b><i>${esc(s.kop2)}</i>${nl(s.kop3)}</div></div>`; };
const parsePes = (t) => lines(t).map((x) => { const [nama, nilai, ket] = x.split('|').map((y) => y.trim()); return { nama, nilai: num(nilai), ket: ket || '' }; });
const ol = (arr, cls = '') => `<ol ${cls}>${arr.map((x) => `<li>${x}</li>`).join('')}</ol>`;
const kv = (rows, w = 135) => `<table class=k>${rows.map(([a, b]) => `<tr><td style="width:${w}px">${a}</td><td>:</td><td>${b}</td></tr>`).join('')}</table>`;
const sigImg = (p, w) => (p.ttd ? `<img src="${p.ttd}" style="width:${w ?? p.w ?? 140}pt;max-width:none">` : '');
const kataTgl = (s) => { const d = pd(s || today()), z = (n) => String(n).padStart(2, '0'); return `${hari(s || today())} tanggal ${cap(tb(d.getDate()))} bulan ${BL[d.getMonth()]} tahun ${cap(tb(d.getFullYear()))} (${z(d.getDate())}-${z(d.getMonth() + 1)}-${d.getFullYear()})`; };
function vars(l) {
  const p = paketOf(l) || {}, w = winnerOf(itemsPes(l), l.win) || {};
  const keg = l.o && l.o.kegiatan != null ? l.o.kegiatan : `${l.konsol !== false ? 'Konsolidasi dan ' : ''}Reviu ${listID(l.docs || [])}`;
  const d = l.tgl ? pd(l.tgl) : new Date();
  return { nama: p.nama || '......', stNo: p.stNo || '......', stTgl: tgl(p.stTgl), pejabatST: p.pejabatST || S().pejabat, satker: p.satker || '......', baNo: l.baNo || '......', baTgl: tgl(l.baTgl), pemenang: w.nama || '......', dok: listID(l.docs || []) || '......', kegiatan: keg, cara: (l.cara || 'Daring') === 'Daring' ? 'secara daring' : 'secara luring', hariTgl: `${hari(l.tgl)} tanggal ${d.getDate()} bulan ${BL[d.getMonth()]} tahun ${d.getFullYear()}`, hariKata: `${hari(l.tgl)} tanggal ${cap(tb(d.getDate()))} bulan ${BL[d.getMonth()]} tahun ${cap(tb(d.getFullYear()))}` };
}
/* nilai otomatis yang boleh ditimpa manual (L.o) */
function lapAuto(l) {
  const p = paketOf(l) || {}, ev = lastOf(l.pid, 'eval'), bk = lastOf(l.pid, 'bukti'), ub = lastOf(l.pid, 'ubah');
  const pes = l.pes || [], w = winnerOf(pes, l.win), wi = pes.indexOf(w), cr = bk ? bk.cara : 'Daring';
  const baNo = l.baNo || (ev ? nomor(ev) : '......'), baTgl = l.baTgl || (ev ? ev.tgl : ''), tb2 = l.tglBukti || (bk ? bk.tglKeg : '');
  const ubT = ub && (ub.items || []).filter((x) => x.t === 'tayang' && x.baru).slice(-1)[0];
  const docs = lines(l.docsLap).length ? lines(l.docsLap) : ['Berita Acara Hasil Evaluasi Mini Kompetisi', 'Berita Acara Pembuktian dan Klarifikasi', 'Dokumen Penawaran dari ' + (w ? w.nama : '......')];
  return { p, pes, w, wi, baNo, baTgl, tb2, ub, ubT, docs, cr };
}
function A(l) {
  const p = paketOf(l) || {}, v = vars(l), a = {};
  if (l.tpl === 'reviu') { a.kegiatan = v.kegiatan; a.hal = `Undangan ${v.kegiatan} ${p.nama || ''}`; a.tembusan = ''; }
  if (l.tpl === 'bukti') { a.hal = 'Undangan Pembuktian dan Klarifikasi Kualifikasi Penyedia'; a.tembusan = fill(tx('buktiTembusan'), v); a.minta = tx('buktiPenutup'); }
  if (l.tpl === 'lap') {
    const x = lapAuto(l), vv = { ...v, baNo: x.baNo, baTgl: tgl(x.baTgl), pemenang: x.w ? x.w.nama : '......' };
    a.hal = `Laporan Hasil Katalog Elektronik Paket ${p.nama || ''}`; a.tembusan = fill(tx('lapTembusan'), vv); a.dasar = lines(fill(tx('lapDasar'), vv)).join('\n'); a.tindak = tx('lapTindak');
    const pel = [`Pelaksanaan ${p.nama || '......'} dilaksanakan melalui katalog elektronik mini kompetisi ${p.metode || 'Itemized'}, kontrak harga satuan.`, `Penayangan mini kompetisi pada https://katalog.inaproc.id/ dilaksanakan mulai ${dtm(l.mulai)} sampai dengan ${dtm(l.selesai)}.`];
    if (l.ulang) pel.push('Penayangan pertama paket dinyatakan gagal, sehingga paket ditayangkan ulang.');
    if (x.ubT) pel.push(`Batas akhir masa tayang (pemasukan penawaran) diperpanjang sampai dengan ${dtm(x.ubT.baru)} sesuai Berita Acara Perubahan Paket Kompetisi Nomor ${nomor(x.ub)} tanggal ${tgl(x.ub.tgl)}.`);
    pel.push(`Dari ${x.pes.length} (${tb(x.pes.length) || 'nol'}) penawaran pada papan peringkat mini kompetisi, hasil evaluasi penawaran (administrasi, kualifikasi, teknis, dan harga) dituangkan dalam Berita Acara Hasil Evaluasi Mini Kompetisi Nomor ${x.baNo} tanggal ${tgl(x.baTgl)}.`);
    pel.push(`Klarifikasi dan pembuktian kualifikasi terhadap ${x.w ? x.w.nama : '......'} (peringkat ke-${x.wi >= 0 ? x.wi + 1 : '...'} pada papan peringkat mini kompetisi) dilaksanakan pada ${hari(x.tb2)}, ${tgl(x.tb2)} ${x.cr === 'Luring' ? 'secara luring' : 'melalui Zoom Meeting'}, dengan nilai penawaran ${x.w ? rp(x.w.nilai) : '......'}.`);
    a.pel = pel.join('\n'); a.penutup = `Bersama ini kami sampaikan ${listID(x.docs, 'serta')}. Demikian laporan ini disampaikan, atas perhatian dan kerjasamanya diucapkan terima kasih.`;
  }
  return a;
}
const gv = (l, k) => (l.o && l.o[k] != null ? l.o[k] : A(l)[k] ?? '');
const zoomOf = (l) => ({ id: l.zid ?? S().zoomId, pass: l.zpass ?? S().zoomPass, link: l.zlink ?? S().zoomLink, tempat: l.tmp ?? S().zoomTempat });
function tempatRows(l) {
  const z = zoomOf(l), dar = (l.cara || 'Daring') === 'Daring';
  return [['Tempat', dar ? `Zoom Meeting (Meeting ID: ${esc(z.id)}; Passcode: ${esc(z.pass)})` : esc(z.tempat)]].concat(dar && z.link ? [['Tautan', `<a href="${esc(z.link)}" style="color:#0645ad">${esc(z.link)}</a>`]] : []);
}
const ttdUndang = (l) => { const p = D.pokja.find((x) => x.id === l.ttd) || {}; return `<div class=ttd>${esc(l.an || S().an)}<br>${esc(l.ub || S().unitBaris)}${l.scan !== false && p.ttd ? sigImg(p) : '<br><br><br>'}<span style="${l.garis ? 'text-decoration:underline' : ''}">${esc(p.nama || '')}</span></div>`; };
const angOf = (l) => (l.angs || []).map((a) => ({ p: D.pokja.find((x) => x.id === a.id), ttd: a.ttd })).filter((x) => x.p);
const sigCell = (a) => (a.ttd && a.p.ttd ? `<img src="${a.p.ttd}" style="max-height:52px;max-width:120px">` : '');
const angTable = (l, o = {}) => `<div style="break-inside:avoid">${o.title ? `<p ${o.plain ? 'style="margin:16px 0 6px;text-align:center;font-weight:400"' : 'class=tc style="margin:16px 0 6px"'}>${esc(o.title)}</p>` : '<div style="height:6px"></div>'}<table class=b style="break-inside:avoid;width:100%"><tr><th style="width:34px">No</th><th>Nama Anggota Pokja Pemilihan</th><th style="width:27%">Jabatan</th><th style="width:25%">Tanda Tangan</th></tr>${angOf(l).map((a, i) => `<tr><td>${i + 1}.</td><td>${esc(a.p.nama)}${a.p.nip ? `<br>NIP ${esc(a.p.nip)}` : ''}</td><td>Anggota Pokja Pemilihan${o.num === false ? '' : ' ' + (i + 1)}</td><td style="height:60px;text-align:center;vertical-align:middle">${sigCell(a)}</td></tr>`).join('')}</table></div>`;
const jt = () => ''; // judul tengah (UNDANGAN / LAPORAN HASIL PEMILIHAN) dihapus sesuai permintaan
const headBlock = (l, hal) => { const pos = l.letak && l.letak !== 'auto' ? l.letak : l.tpl === 'bukti' ? 'sejajar' : 'atas'; return `${pos === 'atas' ? `<p style="text-align:right;margin:0 0 6px">${esc(l.kota)}, ${tgl(l.tgl)}</p>` : ''}<table class=hd style="width:100%"><tr><td style="width:70px">Nomor</td><td style="width:14px">:</td><td>${nomor(l)}</td><td style="text-align:right">${pos === 'sejajar' ? tgl(l.tgl) : ''}</td></tr><tr><td>Lampiran</td><td>:</td><td colspan=2>${esc(l.lamp ?? '-')}</td></tr><tr><td>Hal</td><td>:</td><td colspan=2>${esc(hal)}</td></tr></table>`; };
const yth = (arr, di) => `<p style="margin:22px 0 0">Yth.</p>${arr.length > 1 ? ol(arr.map(esc)) : `<p style="margin:0;text-align:left">${arr.map(esc).join('<br>')}</p>`}<p style="margin:0;text-align:left">di<br>&nbsp;&nbsp;&nbsp;&nbsp;${esc(di || 'Tempat')}</p>`;
const tembus = (t) => (lines(t).length ? `<p style="margin-top:22px;margin-bottom:0">Tembusan Yth.:</p>${ol(lines(t).map(esc))}` : '');
const papanTable = (l, pes, intro = true) => (l.papan === false || !(pes || []).length ? '' : `${intro ? '<p class=kn style="margin:10px 0 3px;text-align:left">Papan Peringkat Kompetisi pada Aplikasi Katalog Elektronik:</p>' : ''}<table class=b style="width:100%;margin:2px 0"><tr><th style="width:90px">Peringkat</th><th>Nama Penyedia</th><th style="width:30%">Total Penawaran</th></tr>${pes.map((x, i) => `<tr><td style="text-align:center">${esc(x.rank || i + 1)}</td><td>${esc(x.nama)}</td><td>${rpd(x.nilai)}</td></tr>`).join('')}</table><p style="font-size:10pt;margin:4px 0 10px"><i>Keterangan:</i> Peringkat otomatis ditentukan berdasarkan akumulasi nilai dari beberapa aspek seperti skor kandungan TKDN, harga, dan penawaran kompetisi di dalam Aplikasi Katalog Elektronik.</p>`);
const rpd = (n) => (n ? 'Rp ' + Number(n).toLocaleString('id-ID') + ',-' : '......');
const PB = '<div class=pgb></div>'; // pemisah halaman paksa (dipakai paginasi di pages.js)
/* judul bertingkat gaya Word: nomor menggantung, tingkat 1 = A. / B., tingkat 2 = 1. / 2., tingkat 3 = a. / b. */
const hl = (lv, no, t, bold) => `<p class="hl l${lv}${bold ? ' hb' : ''} kn"><span class=hn>${no}</span><span class=ht>${t}</span></p>`;
const pesTableEval = (pes) => `<table class="b ev"><tr><th style="width:8%">No.</th><th style="width:27%">Nama Peserta Kompetisi</th><th style="width:24%">Nilai Penawaran</th><th style="width:16%">Hasil Evaluasi</th><th>Keterangan</th></tr>${(pes || []).map((x, i) => `<tr><td style="text-align:center">${i + 1}.</td><td>${esc(x.nama)}</td><td style="white-space:nowrap">${rpd(x.nilai)}</td><td style="text-align:center"><i>${esc(x.st)}</i></td><td style="text-align:justify">${esc(x.ket)}</td></tr>`).join('') || '<tr><td colspan=5 style="height:24px"></td></tr>'}</table>`;
const pesTable = (pes, hps) => `<table class=b style="margin:6px 0"><tr><th style="width:32px">No</th><th>Nama Peserta</th><th>Nilai Penawaran</th><th>Hasil</th><th>Keterangan</th></tr>${pes.map((x, i) => `<tr><td style="text-align:center">${i + 1}</td><td>${esc(x.nama)}</td><td style="text-align:right">${rp(x.nilai)}${hps && x.nilai ? `<br><small>${((x.nilai / hps) * 100).toFixed(2).replace('.', ',')}% HPS</small>` : ''}</td><td style="text-align:center">${esc(x.st)}</td><td>${esc(x.ket)}</td></tr>`).join('') || '<tr><td colspan=5 style="height:24px"></td></tr>'}</table>`;
const rowsPaket = (l, p, extra = []) => kv([['Nama Paket Kompetisi', esc(l.kegiatan || p.nama)], ['Nama Instansi/Satuan Kerja', esc(`${p.instansi || S().instansi} / ${p.satker || ''}`)], ['Nilai Pagu Anggaran', rupiahKata(num(p.pagu))], ['Nilai HPS', rupiahKata(num(p.hps))], ['Sumber Anggaran', esc(`${p.sumber || ''} Tahun Anggaran ${p.tahun || yr(l)}`)], ['Lokasi Pekerjaan/Pengiriman', esc(p.lokasi)], ['Jenis Mini Kompetisi', esc(l.jenisMK || `Mini Kompetisi Barang ${p.metode || 'Itemized'}`)], ...extra], 200);

/* ===== layar Surat ===== */
const fh = (o, [k, l, t = 'text', op]) => {
  const v = o[k] ?? '', a = `data-k="${k}"`;
  if (t === 'area') return `<label>${l}</label><textarea ${a}>${esc(v)}</textarea>`;
  if (t === 'sel') return `<label>${l}</label><select ${a}>${op.map((x) => `<option ${x === v ? 'selected' : ''}>${esc(x)}</option>`).join('')}</select>`;
  if (t === 'chk') return `<label style="display:flex;gap:8px;align-items:center"><input type=checkbox style="width:auto" ${a} ${v ? 'checked' : ''}>${l}</label>`;
  return `<label>${l}</label><input type="${t}" ${a} value="${esc(v)}">`;
};
const bind = (root, obj, after) => { root.oninput = root.onchange = (e) => { const t = e.target; if (!t.dataset.k) return; obj[t.dataset.k] = t.type === 'checkbox' ? t.checked : t.value; after && after(t); }; };

const R = {
  reviu(l, p, v) {
    const pen = l.pen || {}, rec = [pen.ppk && (p.ppk || 'Pejabat Pembuat Komitmen ' + (p.satker || '')), pen.tim && 'Tim Teknis Kegiatan', pen.pokja && 'Kelompok Kerja Pemilihan Penyedia ' + (p.nama || ''), ...lines(l.lain)].filter(Boolean);
    return `${jt(l, 'UNDANGAN')}${headBlock(l, gv(l, 'hal'))}${yth(rec, l.di)}
    <p style="margin-top:20px">${esc(fill(tx('reviuIsi'), v))}</p><p>Sehubungan dengan hal tersebut kami mengharapkan kehadiran Saudara pada:</p>
    ${kv([['Hari/Tanggal', l.tglKeg ? `${hari(l.tglKeg)}, ${tgl(l.tglKeg)}` : '…………'], ['Waktu', `${esc(l.jam)} ${S().zona} – Selesai`], ...tempatRows(l), ['Acara', esc('Pembahasan ' + v.kegiatan)]], 100)}
    ${l.tambah ? `<p>${nl(l.tambah)}</p>` : ''}<p>${esc(l.penutup ?? S().penutup)}</p>${ttdUndang(l)}${tembus(gv(l, 'tembusan'))}`;
  },
  bukti(l, p, v) {
    return `${jt(l, 'UNDANGAN')}${headBlock(l, gv(l, 'hal'))}${yth([`${l.sap || ''} ${l.dir || ''}`.trim(), l.kepada || '......'], l.di)}
    <p style="margin-top:20px">${esc(fill(tx('buktiIsi'), v)).replace(/secara (daring|luring)\.?$/, '<b>secara $1</b>.')}</p><p style="margin-bottom:4px">Sehubungan dengan hal tersebut kami mengharapkan kehadiran Saudara pada:</p>
    ${kv([['Hari/Tanggal', l.tglKeg ? `${hari(l.tglKeg)}, ${tgl(l.tglKeg)}` : '…………'], ['Waktu', `${esc(l.jam)} ${S().zona} – Selesai`], ...tempatRows(l), ['Acara', 'Rapat Pembuktian dan Klarifikasi Kualifikasi']], 100)}
    <p>${esc(gv(l, 'minta'))}<br>${esc(l.penutup ?? S().penutup)}</p>${ttdUndang(l)}${tembus(gv(l, 'tembusan'))}`;
  },
  ubah(l, p) {
    const its = (l.items || []).map((x) => (x.t === 'tayang' ? `Perpanjangan masa tayang, dengan batas akhir semula ${dtm(x.semula)} diperpanjang menjadi ${dtm(x.baru)}.` : esc(x.uraian || '......')));
    return `<p class=tc style="margin:0">BERITA ACARA PERUBAHAN PAKET KOMPETISI BARANG</p><p class=tc style="font-weight:400;margin-top:4px">Nomor: ${nomor(l)}</p>
    <p>Pada hari ini ${kataTgl(l.tgl)}, kami Kelompok Kerja (Pokja) Pemilihan ${esc(l.kegiatan || p.nama)} UKPBJ ${esc(p.instansi || S().instansi)} yang ditetapkan berdasarkan Surat Tugas ${esc(p.pejabatST || S().pejabat)} Nomor: ${esc(p.stNo)} tanggal ${tgl(p.stTgl)} melaksanakan proses <i>E-Purchasing</i> menggunakan metode Mini-Kompetisi untuk paket Kompetisi sebagai berikut:</p>
    ${rowsPaket(l, p, [['Kode RUP', esc(p.rup)], ['Metode Pemilihan', 'E-Purchasing melalui Mini Kompetisi Katalog Elektronik']])}
    <p>Pokja Pemilihan melakukan perubahan pada paket kompetisi tersebut sebagai berikut:</p>${ol(its)}<p>Perubahan tersebut dilaksanakan dengan memperbarui Paket Kompetisi sesuai dengan informasi yang telah diubah oleh Pokja Pemilihan.</p>
    <p>Segala keputusan dan tindakan yang disepakati oleh seluruh anggota Kelompok Kerja (Pokja) Pemilihan pada proses Perubahan Paket Kompetisi sebagaimana diatur di dalam Berita Acara ini merupakan kesepakatan bersama yang sah.</p>
    <p>Demikian Berita Acara Perubahan Paket Kompetisi dibuat untuk dipergunakan sebagaimana mestinya.</p>${angTable(l, { title: 'Pokja Pemilihan ' + (l.kegiatan || p.nama), num: false })}`;
  },
  eval(l, p, v) {
    const hps = num(p.hps), its = l.items || [], multi = its.length > 1, met = esc(p.metode || 'Itemized');
    const win = its.map((it) => winnerOf(it.pes, it.win)), tunjuk = (D.pokja.find((x) => x.id === l.akun) || angOf(l)[0]?.p || {}).nama || '......';
    const pemTxt = multi ? '' : win[0] ? `${esc(win[0].nama)} dengan nilai penawaran ${rp(win[0].nilai)}` : '......';
    const nmIt = (it, i) => esc(it.nama || (multi ? `Item ${i + 1}` : p.nama));
    const papan = its.map((it, i) => { const t = papanTable(l, it.pes, false); return t ? `${multi ? `<p class="kn in1" style="margin:8px 0 3px"><b>${nmIt(it, i)}</b></p>` : ''}${t}` : ''; }).join('');
    return `<p class=tc style="margin:0">BERITA ACARA HASIL EVALUASI<br>MINI KOMPETISI PADA PENGADAAN BARANG</p><p class=tc style="font-weight:400;margin-top:6px">Nomor: ${nomor(l)}</p>
    <p style="margin-top:16pt">${esc(fill(tx('evalPembuka'), v))}</p>
    ${kv([['Nama Paket', esc(p.nama)], ['Metode Pengadaan Mini Kompetisi', `<i>${met}</i>`], ['Nama Instansi/Satuan Kerja', esc(`${p.instansi || S().instansi}/${p.satker || ''}`)], ['Nilai Pagu Anggaran', rpd(num(p.pagu))], ['Nilai Harga Perkiraan Sendiri (HPS)', rpd(hps)], ['Sumber Anggaran', esc(p.sumber)], ['Lokasi Pekerjaan/Pengiriman', esc(p.lokasi)], ['Waktu Pelaksanaan Pekerjaan/ Tanggal Penyelesaian Pekerjaan', tgl(l.waktu || p.waktu)]], 290)}
    <p>${esc(tx('evalIsi'))}</p>
    ${hl(1, 'A.', 'Papan Peringkat Kompetisi', 1)}<p class=in1>Hasil evaluasi terhadap calon pemenang Mini Kompetisi pada setiap indikator penilaian sesuai ketentuan yang berlaku mengacu pada data dan informasi yang tercantum dalam Papan Peringkat Kompetisi pada Aplikasi Katalog Elektronik.</p>${papan}
    ${l.pisahA === false ? '' : PB}
    ${hl(1, 'B.', 'Evaluasi', 1)}${hl(2, '1.', `Evaluasi dalam Mini Kompetisi <i>${met}</i> Barang`)}${its.map((it, i) => `${hl(3, String.fromCharCode(97 + i) + '.', nmIt(it, i))}${pesTableEval(it.pes)}`).join('')}
    <p>Berdasarkan proses evaluasi yang telah dilakukan, dengan ini Pokja Pemilihan menyatakan dan menyepakati sebagai berikut:</p>
    ${ol(['Pokja Pemilihan telah melakukan dan menyetujui hasil seluruh proses evaluasi kepada Pelaku Usaha/Penyedia di papan peringkat Mini Kompetisi pada Aplikasi Katalog Elektronik;',
      `Berdasarkan hasil seluruh proses evaluasi sebagaimana tercantum di atas, Pokja Pemilihan menyepakati pemenang Pengadaan Barang pada Mini Kompetisi <i>${met}</i> yaitu ${multi ? '<br>' + its.map((it, i) => `${i + 1}) ${nmIt(it, i)}: ${win[i] ? `${esc(win[i].nama)} dengan nilai penawaran ${rp(win[i].nilai)}` : '......'}`).join('<br>') : pemTxt}.`,
      `Pokja Pemilihan menunjuk dan melimpahkan kewenangan kepada Pokja ${esc(tunjuk)} untuk melakukan proses Mini Kompetisi pada Aplikasi Katalog Elektronik. Namun, tidak melepaskan segala keputusan dan tanggung jawab setiap anggota Pokja Pemilihan.`,
      'Segala keputusan dan tindakan yang disepakati oleh seluruh anggota Pokja Pemilihan pada proses evaluasi sebagaimana diatur di dalam Berita Acara ini merupakan kesepakatan bersama yang sah.',
      'Apabila terdapat perbedaan antara Berita Acara ini dengan hasil dalam Aplikasi Katalog Elektronik, maka yang digunakan adalah informasi dan keputusan yang terdapat dalam Aplikasi Katalog Elektronik. Dalam hal tersebut, maka dokumen berita acara ini dapat disesuaikan.'])}
    <p class=kn>Demikian Berita Acara Hasil Evaluasi Mini Kompetisi dibuat untuk dipergunakan sebagaimana mestinya.</p>${angTable(l)}`;
  },
  batal(l, p, v) {
    const al = listID(l.alasanSel || []) + (l.alasanTxt ? ((l.alasanSel || []).length ? '; ' : '') + l.alasanTxt : ''), nm = l.kegiatan || p.nama;
    return `<p class=tc style="margin:0">BERITA ACARA PEMBATALAN KOMPETISI<br>BARANG/JASA/PEKERJAAN KONSTRUKSI (POKJA PEMILIHAN)</p><p class=tc style="font-weight:400;margin-top:6px">Nomor: ${nomor(l)}</p>
    <p>Pada hari ini ${kataTgl(l.tgl)}, kami Kelompok Kerja (Pokja) Pemilihan ${esc(nm)} UKPBJ ${esc(p.instansi || S().instansi)} yang ditetapkan berdasarkan Surat Tugas ${esc(p.pejabatST || S().pejabat)} Nomor: ${esc(p.stNo)} tanggal ${tgl(p.stTgl)}, melaksanakan proses <i>E-Purchasing</i> menggunakan metode Mini-Kompetisi untuk paket Kompetisi sebagai berikut:</p>
    ${rowsPaket(l, p, l.infoL || l.infoV ? [[esc(l.infoL), esc(l.infoV)]] : [])}
    <p>Berdasarkan hasil ${esc(l.dasar || '......')}, Pokja Pemilihan ${esc(nm)} memutuskan bahwa Paket Mini Kompetisi ${esc(p.nama)} dilakukan Pembatalan Kompetisi dengan alasan ${esc(al || '......')}.</p>
    <p>Sehubungan dengan hal tersebut, Pokja Pemilihan akan melakukan tindak lanjut berupa ${esc(l.tindak || '......')} mengacu pada ketentuan yang berlaku.</p>
    <p>Segala keputusan dan tindakan yang disepakati oleh seluruh anggota Kelompok Kerja (Pokja) Pemilihan pada proses Pembatalan Paket Mini Kompetisi sebagaimana diatur di dalam Berita Acara ini merupakan kesepakatan bersama yang sah.</p>
    <p>Demikian Berita Acara Pembatalan Mini Kompetisi dibuat dan ditandatangani untuk dipergunakan sebagaimana mestinya.</p>${angTable(l, { title: 'Pokja Pemilihan ' + nm })}`;
  },
  lap(l, p, v) {
    const x = lapAuto(l), hps = num(p.hps), w = x.w, vv = { ...v, baNo: x.baNo, baTgl: tgl(x.baTgl), pemenang: w ? w.nama : '......' };
    const yt = p.ppk ? [p.ppk] : ['Pejabat Pembuat Komitmen', p.satker || '......'];
    const H = (c, t) => `<h4>${c}.&nbsp; ${t}</h4>`;
    const wtxt = w ? `${esc(w.nama)} dengan nilai penawaran ${rp(w.nilai)} (${cap(tb(w.nilai))} rupiah),` : '......';
    return `${jt(l, 'LAPORAN HASIL PEMILIHAN')}<p style="text-align:right;margin:0 0 6px">${esc(l.kota)}, ${tgl(l.tgl)}</p><table class=hd><tr><td style="width:70px">Nomor</td><td>:</td><td>${nomor(l)}</td></tr><tr><td>Lampiran</td><td>:</td><td>${esc(l.lamp ?? '1 (satu) bendel')}</td></tr><tr><td>Perihal</td><td>:</td><td>${esc(gv(l, 'hal'))}</td></tr></table>
    <p style="margin:22px 0 0;text-align:left">Yth.<br>${yt.map(esc).join('<br>')}<br>di<br>&nbsp;&nbsp;&nbsp;&nbsp;Tempat</p>
    <p style="margin-top:18px">Bersama ini kami sampaikan hasil mini kompetisi katalog elektronik pada Satuan Kerja ${esc(p.satker)}, sebagai berikut:</p>
    ${H('A', 'Dasar Pelaksanaan')}${ol(lines(gv(l, 'dasar')).map(esc))}
    ${l.dataPaket !== false ? `${H('B', 'Data Paket')}<table class=b>${[['Kode RUP', p.rup], ['Nama Paket', p.nama], ['Satuan Kerja', p.satker], ['Sumber Dana', p.sumber], ['Nilai Pagu', rp(num(p.pagu))], ['Nilai HPS', rp(hps)], ['Metode / Kontrak', p.metodeKontrak || `Katalog Elektronik – Mini Kompetisi ${p.metode || 'Itemized'} / Harga Satuan`], ['Lokasi Pekerjaan', p.lokasi], ['Jangka Waktu Pelaksanaan', tgl(p.waktu)]].map(([a, b]) => `<tr><th style="width:36%;text-align:left">${a}</th><td>${esc(b)}</td></tr>`).join('')}</table>` : ''}
    ${H(l.dataPaket !== false ? 'C' : 'B', 'Pelaksanaan Katalog Elektronik')}${ol(lines(gv(l, 'pel')).map((t) => esc(t).replace('https://katalog.inaproc.id/', '<a style="color:#0645ad">https://katalog.inaproc.id/</a>')))}
    ${H(l.dataPaket !== false ? 'D' : 'C', 'Hasil Pemilihan')}${pesTable(x.pes, 0)}
    <p>Berdasarkan hasil evaluasi dan pembuktian kualifikasi, Pokja Pemilihan menetapkan pemenang Mini Kompetisi yaitu <b>${wtxt}</b> sebagaimana dituangkan dalam Berita Acara Hasil Evaluasi Mini Kompetisi Nomor ${esc(x.baNo)} tanggal ${tgl(x.baTgl)}.</p>
    ${H(l.dataPaket !== false ? 'E' : 'D', 'Tindak Lanjut')}${ol(lines(gv(l, 'tindak')).map(esc))}
    ${l.xj ? `${H(l.dataPaket !== false ? 'F' : 'E', esc(l.xj))}${ol(lines(l.xi).map(esc))}` : ''}
    <p>${esc(gv(l, 'penutup'))}</p>
    <p style="margin:18px 0 4px;font-weight:400;text-align:left;break-after:avoid">${esc(l.lap1 || S().lap1)}<br>${esc(l.lap2 || S().lap2)}</p><table class=b style="break-inside:avoid;width:100%"><tr><th style="width:34px">No</th><th>Nama</th><th style="width:36%">Tanda Tangan</th></tr>${angOf(l).map((a, i) => `<tr><td style="text-align:center">${i + 1}.</td><td>${esc(a.p.nama)}${a.p.nip ? `<br>NIP ${esc(a.p.nip)}` : ''}</td><td style="height:62px;text-align:center;vertical-align:middle">${sigCell(a)}</td></tr>`).join('')}</table>${tembus(gv(l, 'tembusan'))}`;
  },
  dmk(l, p, v) {
    let k = 1, open = false, o = '';
    const close = () => { if (open) { o += '</ol>'; open = false; } };
    for (const raw of String(tx('dmkIsi')).split('\n')) {
      const t = raw.trim(); if (!t) continue;
      if (t.startsWith('# ')) { close(); o += `<h4>${String.fromCharCode(65 + k++)}.&nbsp; ${esc(t.slice(2))}</h4>`; }
      else if (t.startsWith('- ')) { if (!open) { o += '<ol>'; open = true; } o += `<li>${esc(fill(t.slice(2), v))}</li>`; }
      else if (t === '[KATEGORI]') { close(); o += `<table class=b style="width:80%"><tr><th style="text-align:left;width:38%">Kategori Tingkat I</th><td>${esc(l.kat1 || '…………')}</td></tr><tr><th style="text-align:left">Kategori Tingkat II</th><td>${esc(l.kat2 || '…………')}</td></tr><tr><th style="text-align:left">Kategori Tingkat III</th><td>${esc(l.kat3 || '…………')}</td></tr></table>`; }
      else { close(); o += `<p>${esc(t)}</p>`; }
    }
    close();
    return `<div class=cover style="height:250mm;display:flex;flex-direction:column"><p class=tc style="font-size:16pt;margin:130px 0 0">DOKUMEN MINI KOMPETISI</p><p class=tc style="font-size:13pt;margin-top:2px">E-PURCHASING KATALOG ELEKTRONIK</p>
    <div style="margin-top:80px">${kv([['Nama Kegiatan', esc(p.nama)], ['Jumlah Paket', '1 (satu) paket'], ['Satuan Kerja', esc(p.satker)], ['Sumber Dana', esc(p.sumber)], ['Jenis Pengadaan', esc(p.jenis || 'Barang')], ['Tahun Anggaran', esc(p.tahun || yr(l))]], 150)}</div>
    <div style="margin-top:auto;padding-bottom:12px"><p class=tc style="font-size:16pt;margin:0">KEMENTERIAN PERTANIAN</p><p class=tc style="font-size:13pt;margin:2px 0 0">TAHUN ${esc(p.tahun || yr(l))}</p></div></div>${PB}
    <h4>I.&nbsp; PENDAHULUAN</h4><p>Dokumen ini memuat dokumen persiapan pengadaan dan ketentuan pelaksanaan E-purchasing Katalog Elektronik melalui metode Mini Kompetisi untuk paket Barang sebagaimana tercantum dalam Daftar Paket pada Bab IV huruf A. Penyedia Katalog wajib mempelajari dokumen ini bersama Kerangka Acuan Kerja (KAK)/Spesifikasi Teknis dan Rancangan Surat Pesanan sebelum menyampaikan penawaran. Dengan menyampaikan penawaran, Penyedia Katalog dianggap telah memahami dan menyetujui seluruh ketentuan dalam dokumen ini.</p>
    <h4>II.&nbsp; DASAR HUKUM</h4>${ol(lines(tx('dmkDasar')).map(esc))}
    <h4>III.&nbsp; DOKUMEN PERSIAPAN PENGADAAN</h4><p style="margin-bottom:0">Dokumen persiapan pengadaan untuk paket terdiri atas:</p>${ol(['Kerangka Acuan Kerja (KAK)/Spesifikasi Teknis;', 'Rancangan Surat Pesanan beserta Syarat-Syarat Umum Kontrak (SSUK) dan Syarat-Syarat Khusus Kontrak (SSKK);', 'Berita Acara Hasil Reviu Dokumen Persiapan Pengadaan antara Pokja Pemilihan dan PPK.'])}<p>Dokumen sebagaimana dimaksud di atas merupakan bagian yang tidak terpisahkan dari Dokumen Mini Kompetisi ini.</p>
    <h4>IV.&nbsp; KETENTUAN PELAKSANAAN MINI KOMPETISI</h4><h4>A.&nbsp; DAFTAR PAKET</h4><p>Dokumen ini berlaku untuk paket sebagai berikut:</p><table class=b><tr><th style="width:36px">No</th><th>Nama Paket</th><th style="width:110px">ID RUP</th></tr><tr><td>1</td><td>${esc(p.nama)}</td><td style="text-align:center">${esc(p.rup)}</td></tr></table>
    <p style="margin-bottom:0">Ketentuan untuk paket tersebut:</p>${ol(['Mini Kompetisi dilaksanakan pada aplikasi Katalog Elektronik sesuai ID RUP paket.'])}${o}
    <p>Demikian Dokumen Mini Kompetisi ini disusun untuk dipergunakan sebagaimana mestinya.</p><div class=ttd style="margin-left:55%">${esc(l.kota)}, ${tgl(l.tgl)}<br>${esc(S().penutupMK)}</div>`;
  },
};
function renderLetter(l) {
  norm(l); const p = paketOf(l);
  if (!p) return '<p style="padding:40px;text-align:center;color:#888">Pilih atau buat paket dulu (Pengaturan › Paket).</p>';
  const body = R[l.tpl](l, p, vars(l));
  return l.tpl === 'dmk' ? body : kop() + body;
}
function judul(l) { const p = paketOf(l) || {}, h = ['reviu', 'bukti', 'lap'].includes(l.tpl) ? gv(l, 'hal') : `${TPL[l.tpl].n} ${p.nama || ''}`; return `${(l.tgl || '').replace(/-/g, '')} ${h}`.replace(/[\\/:*?"<>|]/g, '-'); }

/* ===== formulir surat ===== */
const UI = { more: false, zoom: false };
const getP = (o, p) => p.split('.').reduce((a, k) => (a == null ? a : a[k]), o);
const setP = (o, p, v) => { const ks = p.split('.'), last = ks.pop(); ks.reduce((a, k) => a[k], o)[last] = last === 'nilai' ? num(v) : v; };
const fx = (k, lb, o = {}) => {
  const v = L[k] ?? o.val ?? '', a = `data-k="${k}"`; let c;
  if (o.area) c = `<textarea ${a} placeholder="${esc(o.ph || '')}">${esc(v)}</textarea>`;
  else if (o.opts) c = `<select ${a}>${o.opts.map((x) => { const [val, lab] = Array.isArray(x) ? x : [x, x]; return `<option value="${esc(val)}" ${val === v ? 'selected' : ''}>${esc(lab)}</option>`; }).join('')}</select>`;
  else c = `<input type="${o.t || 'text'}" ${a} value="${esc(v)}" placeholder="${esc(o.ph || '')}" ${o.list ? `list=${o.list}` : ''}>`;
  return `<div class="fld ${o.cls || ''}"><label>${lb}</label>${c}</div>`;
};
const chk = (k, lb, def) => `<label class=cbx><input type=checkbox data-k=${k} ${(L[k] ?? def) ? 'checked' : ''}>${lb}</label>`;
const seg = (k, opts) => `<div class=seg>${opts.map((o) => `<a class="${(L[k] || opts[0]) === o ? 'on' : ''}" data-seg="${k}:${o}">${o}</a>`).join('')}</div>`;
const chips = (k, arr, sel) => `<div class=chs>${arr.map((x) => `<span class="ch ${(sel || []).includes(x) ? 'on' : ''}" data-ch="${k}:${esc(x)}">${(sel || []).includes(x) ? '✓ ' : ''}${esc(x)}</span>`).join('')}</div>`;
const sec = (n, t, h) => `<section class=sec><h5>${n} · ${t}</h5>${h}</section>`;
const more = (lb, h) => `<details class=more ${UI.more ? 'open' : ''}><summary>${lb}</summary>${h}</details>`;
const ovf = (k, lb, rows = 2) => { const man = L.o[k] != null; return `<div class=fld><label>${lb} <span class="bd ${man ? 'm' : ''}" data-bd=${k}>${man ? 'Diubah manual' : 'Otomatis'}</span>${man ? ` <a data-rev=${k}>Kembalikan</a>` : ''}</label><textarea data-ov=${k} rows=${rows}>${esc(gv(L, k))}</textarea></div>`; };
const numInfo = () => { const y = yr(L), lt = lastNo(y), nx = nextNo(y), dup = !TPL[L.tpl].nonum && L.no && numbered(y).some((s) => s.id !== L.id && +s.no === +L.no); return `Nomor: <b>${nomor(L)}</b>${lt ? ` · terakhir di aplikasi (${y}): <b>${lt.no}</b> <span class=m>${esc(TPL[lt.tpl].n)}, ${tgl(lt.tgl)}, ${esc(lt.by || '')}</span> <a data-q="no=${nx}">Pakai ${nx}</a>` : ` <a data-q="no=${nx}">Pakai ${nx}</a>`}${dup ? '<br><span class=err>Nomor ini sudah dipakai surat lain pada tahun yang sama.</span>' : ''}`; };
const numBox = (lb = 'Tanggal surat') => `<div class=g2>${fx('no', 'Nomor urut', { t: 'number', ph: 'mis. ' + nextNo(yr(L)) })}${fx('tgl', lb, { t: 'date' })}</div><p class=muted id=nmtxt>${numInfo()}</p>`;
const zoomBox = () => { const z = zoomOf(L), dar = (L.cara || 'Daring') === 'Daring'; return `<div class=zb>${dar ? `<b>Zoom:</b> Meeting ID ${esc(z.id) || '—'} · passcode ${esc(z.pass) || '—'}` : `<b>Tempat:</b> ${esc(z.tempat) || '—'}`} <a data-act=zoom>Ubah</a></div>${UI.zoom ? `<div class=g2>${fx('zid', 'Meeting ID', { ph: S().zoomId })}${fx('zpass', 'Passcode', { ph: S().zoomPass })}${fx('zlink', 'Tautan Zoom', { ph: S().zoomLink })}${fx('tmp', 'Tempat luring', { ph: S().zoomTempat })}</div>` : ''}`; };
const signer = () => `<div class=fld><label>Penandatangan</label><select data-k=ttd>${D.pokja.map((p) => `<option value="${p.id}" ${p.id === L.ttd ? 'selected' : ''}>${esc(p.nama)}${p.nip ? ' · NIP ' + esc(p.nip) : ''}</option>`).join('')}</select></div><div class=sgr>${(() => { const p = D.pokja.find((x) => x.id === L.ttd); return p && p.ttd ? `<img src="${p.ttd}">` : ''; })()}${chk('scan', 'Bubuhkan scan tanda tangan', true)}${chk('garis', 'Garis bawah nama penandatangan')}</div>`;
const kertasBln = () => `<div class=g2>${fx('blnMode', 'Bulan pada nomor', { opts: [['ikut', 'Ikut tanggal surat'], ['lalu', 'Bulan lalu']] })}${fx('kertas', 'Ukuran kertas', { opts: [['A4', 'A4 (210 × 297 mm)'], ['F4', 'F4 (215 × 330 mm)'], ['Letter', 'Letter']], val: S().kertas })}</div>`;
const tataSurat = () => `${signer()}<div class=g2>${fx('an', 'Baris a.n.', { val: S().an })}${fx('ub', 'Baris unit', { val: S().unitBaris })}${fx('lamp', 'Lampiran', { val: '-' })}${fx('kota', 'Kota')}${fx('letak', 'Letak tanggal', { opts: [['auto', 'Otomatis'], ['atas', 'Atas (kanan)'], ['sejajar', 'Sejajar Nomor']], val: 'auto' })}</div>${kertasBln()}`;
const otherAng = () => { const m = new Map(); D.surat.filter((s) => s.pid !== L.pid && s.angs && s.angs.length).sort((a, b) => b.ts - a.ts).forEach((s) => m.has(s.pid) || m.set(s.pid, s)); return [...m.values()]; };
const angPanel = () => `<div class=angs>${L.angs.map((a, i) => { const p = D.pokja.find((x) => x.id === a.id) || {}; return `<div class=ar><span class=n>${i + 1}</span><div class=nm2><b>${esc(p.nama)}</b><small>${p.nip ? 'NIP ' + esc(p.nip) : 'NIP belum diisi'}</small></div>${p.ttd ? `<img src="${p.ttd}">` : '<small class=m>belum ada TTD</small>'}<label class=ck2><input type=checkbox data-ang=${i} ${a.ttd ? 'checked' : ''}>TTD</label><button class=ib data-act="aup:${i}" ${i ? '' : 'disabled'}>↑</button><button class=ib data-act="arm:${i}">×</button></div>`; }).join('') || '<p class=muted>Belum ada anggota.</p>'}</div>
<input id=angq list=angdl placeholder="Tambah anggota: ketik nama atau NIP…"><datalist id=angdl>${D.pokja.filter((p) => !L.angs.some((a) => a.id === p.id)).map((p) => `<option value="${esc(p.nama)}">${esc(p.nip || '')}</option>`).join('')}</datalist>
<select data-copy style="margin-top:6px"><option value="">Salin susunan dari paket lain…</option>${otherAng().map((s) => `<option value="${s.id}">${esc((paketOf(s) || {}).nama || '')} · ${s.angs.length} anggota</option>`).join('')}</select><p><a data-go=pokja>Kelola Daftar Pokja</a></p>`;
const pesEd = (path, wp) => { const pes = getP(L, path) || [], win = getP(L, wp); return `<div class=pes>${pes.map((x, i) => `<div class=pr><div class=r1><span class=n>${i + 1}</span><input data-p="${path}.${i}.nama" value="${esc(x.nama)}" placeholder="Nama peserta">${winnerOf(pes, win) === x ? '<span class="bd m">Pemenang</span>' : ''}<button class=ib data-act="pup:${path}|${i}" ${i ? '' : 'disabled'}>↑</button><button class=ib data-act="pdn:${path}|${i}" ${i < pes.length - 1 ? '' : 'disabled'}>↓</button><button class=ib data-act="prm:${path}|${i}">×</button></div><div class=g2><input data-p="${path}.${i}.nilai" value="${esc(x.nilai || '')}" placeholder="Nilai penawaran (angka)"><select data-p="${path}.${i}.st">${STP.map((s) => `<option ${s === x.st ? 'selected' : ''}>${s}</option>`).join('')}</select></div><input data-p="${path}.${i}.ket" value="${esc(x.ket)}" placeholder="Keterangan" style="margin-top:4px"><small class=muted data-hint="${path}.${i}"></small></div>`).join('')}</div>
<div class=r3><button class="btn s" data-act="padd:${path}">+ Peserta</button><span class=muted>Pemenang</span><select data-p="${wp}"><option value="">Otomatis (teratas Memenuhi)</option>${pes.map((x, i) => `<option value="${i}" ${String(win) === String(i) ? 'selected' : ''}>${i + 1}. ${esc(x.nama)}</option>`).join('')}</select></div>`; };
let paketSec = () => `<section class=sec><label style="margin-top:0">1 · Paket</label><div class=pkrow><select id=pk>${D.paket.map((p) => `<option value="${p.id}" ${p.id === L.pid ? 'selected' : ''}>${esc(p.nama)}</option>`).join('') || '<option value="">(belum ada paket)</option>'}</select><a data-go=paket>Ubah paket</a></div><p class=muted>Terisi dari paket: nama, surat tugas, satker, pagu, HPS, lokasi, sumber dana.</p><div id=wn>${warnHtml()}</div></section>`;
function missing() {
  const m = [], t = L.tpl, need = (c, lb, sel) => { if (!c) m.push([lb, sel]); };
  if (!paketOf(L)) need(0, 'Paket', '#pk');
  if (!TPL[t].nonum) need(L.no, 'Nomor urut', '[data-k=no]');
  if (t === 'reviu') { need(L.tglKeg, 'Tanggal kegiatan', '[data-k=tglKeg]'); need((L.docs || []).length, 'Dokumen yang direviu', '.chs'); }
  if (t === 'bukti') { need(L.kepada, 'Nama penyedia', '[data-k=kepada]'); need(L.tglKeg, 'Tanggal pembuktian', '[data-k=tglKeg]'); }
  if (t === 'ubah') (L.items || []).forEach((it, i) => need(it.t === 'tayang' ? it.semula && it.baru : it.uraian, `Perubahan ${i + 1}`, `[data-p^="items.${i}."]`));
  if (t === 'eval') need(itemsPes(L).length && itemsPes(L).every((x) => x.nama && x.nilai), 'Peserta & nilai', '[data-p^="items.0.pes"]');
  if (t === 'batal') need((L.alasanSel || []).length || L.alasanTxt, 'Alasan pembatalan', '.chs');
  if (t === 'lap') { need(L.mulai, 'Penayangan mulai', '[data-k=mulai]'); need(L.selesai, 'Penayangan selesai', '[data-k=selesai]'); need((L.pes || []).length, 'Peserta & hasil', '[data-p^="pes."]'); }
  if (['ubah', 'eval', 'batal', 'lap'].includes(t)) need(angOf(L).length, 'Anggota Pokja', '#angq');
  return m;
}
const warnHtml = () => { const m = missing(); return m.length ? `<div class=warn><b>${m.length} isian lagi:</b> ${m.map(([lb, s]) => `<a data-fz='${esc(s)}'>${lb}</a>`).join(' ')}</div>` : '<div class="warn ok">Semua isian wajib sudah terisi ✓</div>'; };
const PRE = [['Spek + HPS (konsolidasi)', ['Spesifikasi Teknis', 'HPS'], true], ['KAK', ['KAK'], false], ['Spek, KAK & HPS', ['Spesifikasi Teknis', 'KAK', 'HPS'], true], ['Semua dokumen', DOKS, true]];
const quick = (k, arr) => `<div class=qk>${arr.map(([n, v]) => `<a data-q="${k}=${v}">${n}</a>`).join('')}</div>`;
const FB = {
  reviu() {
    return sec(2, 'Dokumen yang direviu', `<div class=qk><small>Cepat:</small>${PRE.map((x, i) => `<a data-act="pre:${i}">${x[0]}</a>`).join('')}</div>${chips('docs', DOKS, L.docs)}${chk('konsol', 'Diawali konsolidasi', true)}`)
      + sec(3, 'Waktu reviu', `<div class=g3>${fx('tglKeg', 'Tanggal', { t: 'date' })}${fx('jam', 'Mulai', { list: 'jamdl' })}<div class=fld><label>Cara</label>${seg('cara', CARA)}</div></div>${quick('tglKeg', [['Hari ini', qdate(0)], ['Hari kerja berikut', qdate(1)], ['+2 hari kerja', qdate(2)], ['+5 hari kerja', qdate(5)]])}${quick('jam', ['09.00', '10.00', '13.30', '14.00'].map((x) => [x, x]))}${zoomBox()}`)
      + sec(4, 'Nomor & tanggal', numBox())
      + more('Lainnya — penerima, nama kegiatan, perihal, tembusan, penandatangan', `<label>Penerima undangan</label>${['ppk:Pejabat Pembuat Komitmen (dari data paket)', 'tim:Tim Teknis Kegiatan', 'pokja:Kelompok Kerja Pemilihan Penyedia (nama paket otomatis)'].map((x) => { const [k, n] = x.split(':'); return `<label class=cbx><input type=checkbox data-pen=${k} ${(L.pen || {})[k] ? 'checked' : ''}>${n}</label>`; }).join('')}${fx('lain', 'Penerima lain (satu per baris)', { area: 1 })}${ovf('kegiatan', 'Nama kegiatan')}${ovf('hal', 'Hal')}${fx('tambah', 'Paragraf tambahan (boleh kosong)', { area: 1 })}${fx('penutup', 'Kalimat penutup', { val: S().penutup })}${ovf('tembusan', 'Tembusan (satu per baris, kosong = tanpa tembusan)')}${fx('di', 'di (kota/alamat tujuan)', { val: 'Tempat' })}${tataSurat()}`);
  },
  bukti() {
    const ws = [...new Set(D.surat.filter((s) => s.pid === L.pid && s.tpl === 'eval').map((s) => { norm(s); const w = winnerOf(itemsPes(s), s.items[0].win); return w && w.nama; }).filter(Boolean))];
    return sec(2, 'Penyedia yang diundang', `<div class=chs>${ws.map((n) => `<span class="ch ${L.kepada === n ? 'on' : ''}" data-q="kepada=${esc(n)}">${L.kepada === n ? '✓ ' : ''}${esc(n)}</span>`).join('')}</div>${fx('kepada', 'Nama penyedia (perusahaan)', { ph: '+ Ketik nama' })}<div class=g3>${fx('sap', 'Sapaan', { opts: ['Bapak', 'Ibu', 'Saudara'] })}${fx('dir', 'Nama direktur/kuasa', { cls: 'sp2' })}</div>${fx('di', 'di (alamat / “Tempat”)', { val: 'Tempat' })}`)
      + sec(3, 'Waktu pembuktian', `<div class=g3>${fx('tglKeg', 'Tanggal', { t: 'date' })}${fx('jam', 'Mulai', { list: 'jamdl' })}<div class=fld><label>Cara</label>${seg('cara', CARA)}</div></div>${quick('tglKeg', [['Hari ini', qdate(0)], ['Hari kerja berikut', qdate(1)], ['+2 hari kerja', qdate(2)]])}${zoomBox()}`)
      + sec(4, 'Nomor & tanggal', numBox())
      + more('Lainnya — perihal, paragraf, tembusan, penandatangan, lampiran', `${ovf('minta', 'Paragraf permintaan dokumen (boleh kosong)')}${fx('penutup', 'Kalimat penutup', { val: S().penutup })}${ovf('tembusan', 'Tembusan (satu per baris, kosong = tanpa tembusan)')}${ovf('hal', 'Hal')}${tataSurat()}`);
  },
  ubah() {
    const it = (x, i) => `<div class=card2><div class=r1><span class=n>${i + 1}</span><div class=seg>${[['tayang', 'Perpanjangan masa tayang'], ['lain', 'Perubahan lain']].map(([t, n]) => `<a class="${x.t === t ? 'on' : ''}" data-act="ubt:${i}|${t}">${n}</a>`).join('')}</div><button class=ib data-act="ubr:${i}">×</button></div>${x.t === 'tayang' ? `<div class=g2><div class=fld><label>Batas akhir semula</label><input type=datetime-local data-p="items.${i}.semula" value="${esc(x.semula)}"><small class=muted data-dtm="items.${i}.semula"></small></div><div class=fld><label>Diperpanjang menjadi</label><input type=datetime-local data-p="items.${i}.baru" value="${esc(x.baru)}"><small class=muted data-dtm="items.${i}.baru"></small></div></div><p class=muted>Jadwal tayang paket ikut diperbarui, jadi laporan hasil pemilihan memakai batas akhir yang baru.</p>` : `<div class=fld><label>Uraian perubahan</label><textarea data-p="items.${i}.uraian">${esc(x.uraian || '')}</textarea></div>`}</div>`;
    return sec(2, 'Perubahan paket kompetisi', L.items.map(it).join('') + '<button class="btn s" data-act="uba:tayang">+ Perpanjangan masa tayang</button> <button class="btn s" data-act="uba:lain">+ Perubahan lain</button>')
      + sec(3, 'Nomor & tanggal', numBox('Tanggal BA')) + sec(4, 'Anggota Pokja', angPanel()) + more('Lainnya — bulan nomor, kertas', kertasBln());
  },
  eval() {
    const p = paketOf(L) || {};
    return `<section class=sec>${fx('waktu', 'Waktu pelaksanaan / tgl. penyelesaian', { t: 'date', val: p.waktu || '' })}</section>`
      + sec(2, 'Peserta & hasil evaluasi', L.items.map((it, k) => `${L.items.length > 1 ? `<div class=r1><b>Item ${k + 1}</b><input data-p="items.${k}.nama" value="${esc(it.nama)}" placeholder="Nama item/produk"><button class=ib data-act="itr:${k}">×</button></div>` : ''}<textarea class=paste data-paste="items.${k}.pes" placeholder="Tempel papan peringkat dari katalog untuk mengganti (Ctrl+V)"></textarea>${pesEd(`items.${k}.pes`, `items.${k}.win`)}`).join('') + '<p><a data-act=ita>+ Tambah item (mini kompetisi itemized dengan beberapa produk)</a></p><p class=muted>Urutkan sesuai papan peringkat. Nilai boleh ditulis bebas, mis. 544635000 atau Rp544.635.000,00.</p>')
      + sec(3, 'Nomor & tanggal', numBox('Tanggal BA'))
      + more('Lainnya — anggota Pokja & tanda tangan, pemegang akun katalog', `${angPanel()}<div class=fld><label>Pokja pemegang akun katalog</label><select data-k=akun>${L.angs.map((a) => { const q = D.pokja.find((x) => x.id === a.id); return q ? `<option value="${q.id}" ${q.id === L.akun ? 'selected' : ''}>${esc(q.nama)}</option>` : ''; }).join('')}</select></div>${chk('pisahA', 'Bagian B (Evaluasi) mulai di halaman baru', true)}${kertasBln()}`);
  },
  batal() {
    return `<section class=sec>${fx('kegiatan', 'Nama Pokja / kegiatan (kosong = nama paket)', { area: 1, ph: (paketOf(L) || {}).nama })}</section>`
      + sec(2, 'Dasar & alasan pembatalan', `${fx('dasar', 'Berdasarkan hasil …', { list: 'dasardl' })}<datalist id=dasardl>${['penayangan mini kompetisi', 'evaluasi penawaran', 'pembuktian kualifikasi', 'pertimbangan dan penilaian Pokja Pemilihan'].map((x) => `<option value="${x}">`).join('')}</datalist><label>Alasan (pilih satu atau lebih)</label>${chips('alasanSel', ALASAN, L.alasanSel)}${fx('alasanTxt', 'Alasan lain / tambahan', { area: 1 })}<p class=muted>Sesuai Keputusan Kepala LKPP Nomor 93 Tahun 2025 dan/atau ketentuan yang berlaku.</p>`)
      + sec(3, 'Tindak lanjut', `${chips('tindakPilih', TINDAK, [L.tindak])}${fx('tindak', 'Tindak lanjut berupa', { area: 1 })}`)
      + sec(4, 'Data paket', `${fx('jenisMK', 'Jenis Mini Kompetisi', { opts: [['', 'Otomatis (dari metode paket)'], ...JENISMK] })}<div class=g2>${fx('infoL', 'Informasi lain — label')}${fx('infoV', 'Informasi lain — isi')}</div>`)
      + sec(5, 'Nomor & tanggal', numBox('Tanggal BA')) + sec(6, 'Anggota Pokja', angPanel()) + more('Lainnya — bulan nomor, kertas', kertasBln());
  },
  lap() {
    const x = lapAuto(L), w = x.w;
    return sec(2, 'Jadwal penayangan mini kompetisi', `<div class=g2>${fx('mulai', 'Mulai', { t: 'datetime-local' })}${fx('selesai', 'Selesai', { t: 'datetime-local' })}</div>${chk('ulang', 'Penayangan pertama gagal, lalu ditayangkan ulang')}`)
      + sec(3, 'Peserta & hasil evaluasi', `<p class=muted><b>${x.pes.length} peserta</b>${w ? ' · pemenang ' + esc(w.nama) : ''}. Otomatis dari BA Hasil Evaluasi; ubah bila perlu.</p><textarea class=paste data-paste="pes" placeholder="Tempel papan peringkat (Ctrl+V)"></textarea>${pesEd('pes', 'win')}`)
      + sec(4, 'Nomor & tanggal', `${numBox('Tanggal laporan')}<div class=zb><b>Mengutip otomatis:</b> BA No. ${esc(x.baNo)}, ${tgl(x.baTgl)} · pembuktian ${tgl(x.tb2)}${x.ub ? ' · BA perubahan No. ' + esc(nomor(x.ub)) : ''}. Ubah di “Lainnya”.</div>`)
      + more('Lainnya — rujukan BA, teks laporan, perihal, tembusan, anggota Pokja', `<div class=g3>${fx('baNo', 'Nomor BA (timpa)', { ph: x.baNo })}${fx('baTgl', 'Tanggal BA (timpa)', { t: 'date' })}${fx('tglBukti', 'Tanggal pembuktian (timpa)', { t: 'date' })}</div>${ovf('dasar', 'A. Dasar pelaksanaan', 4)}${ovf('pel', 'Pelaksanaan pemilihan', 5)}<div class=g2>${fx('xj', 'Bagian tambahan — judul (opsional)')}${fx('xi', 'Bagian tambahan — isi (satu butir per baris)', { area: 1 })}</div>${ovf('tindak', 'Tindak lanjut (satu butir per baris)', 4)}${fx('docsLap', 'Dokumen yang disampaikan (satu per baris, kosong = otomatis)', { area: 1 })}${ovf('penutup', 'Paragraf penutup', 3)}${chk('dataPaket', 'Tampilkan tabel “Data Paket” di laporan', true)}${ovf('hal', 'Perihal')}${ovf('tembusan', 'Tembusan (satu per baris)', 3)}<label>Anggota Pokja</label><div class=g2>${fx('lap1', 'Baris 1 di atas tabel TTD', { val: S().lap1 })}${fx('lap2', 'Baris 2', { val: S().lap2 })}</div>${angPanel()}<div class=g2>${fx('lamp', 'Lampiran', { val: '1 (satu) bendel' })}${fx('kota', 'Kota')}</div>${kertasBln()}`);
  },
  dmk() { return sec(2, 'Kategori produk', `${fx('kat1', 'Kategori Tingkat I')}${fx('kat2', 'Kategori Tingkat II')}${fx('kat3', 'Kategori Tingkat III')}`) + sec(3, 'Tanggal dokumen', `<div class=g2>${fx('tgl', 'Tanggal', { t: 'date' })}${fx('kota', 'Kota')}</div>`); },
};
const datalists = () => `<datalist id=jamdl>${['08.00', '09.00', '10.00', '13.00', '13.30', '14.00', '15.00'].map((x) => `<option value="${x}">`).join('')}</datalist>`;
function suratView() {
  L ||= newLetter('reviu'); norm(L);
  $('#main').innerHTML = '<div class=wrap><div class="form noprint" id=fm></div><div class=prev><div class="pvh noprint"><span>Pratinjau sama dengan hasil unduhan</span><span id=pgc></span></div><div class=pages id=sh></div></div></div><style id=pg></style>';
  form(); prev();
  if (!window._kb) { window._kb = 1; addEventListener('keydown', (e) => { if (view !== 'surat' || !L) return; if (e.ctrlKey && e.key === 'Enter') { e.preventDefault(); doPdf(); } if (e.ctrlKey && e.key.toLowerCase() === 's') { e.preventDefault(); saveL(); setSt('Surat disimpan'); } }); addEventListener('resize', () => view === 'surat' && $('#sh') && prev()); }
}
function form() {
  norm(L); const t = TPL[L.tpl];
  $('#fm').innerHTML = `<div class=fh><select id=tp>${KEYS.map((k) => `<option value=${k} ${k === L.tpl ? 'selected' : ''}>${TPL[k].n}</option>`).join('')}</select></div>${paketSec()}${FB[L.tpl]()}<div class=bar><button class="btn p" id=pdf>Unduh PDF</button><button class=btn id=sv>Simpan</button><span class=muted>Ctrl+Enter PDF · Ctrl+S simpan</span></div>${datalists()}`;
  wire();
}
function fromPaket() {
  if (L.tpl === 'bukti' && !L.kepada) { const e = lastOf(L.pid, 'eval'), w = e && winnerOf(itemsPes(norm(e)), e.items[0].win); if (w) L.kepada = w.nama; }
  if (L.tpl === 'lap') { const e = lastOf(L.pid, 'eval'); if (e) { L.pes = clone(norm(e).items[0].pes); L.win = e.items[0].win; } }
}
function wire() {
  const f = $('#fm');
  const hints = () => { f.querySelectorAll('[data-hint]').forEach((h) => { const x = getP(L, h.dataset.hint), hp = num((paketOf(L) || {}).hps); h.textContent = x && x.nilai ? `${rp(x.nilai)}${hp ? ' · ' + ((x.nilai / hp) * 100).toFixed(2).replace('.', ',') + '% HPS' : ''}` : ''; }); f.querySelectorAll('[data-dtm]').forEach((h) => { const v = getP(L, h.dataset.dtm); h.textContent = v ? dtm(v) : ''; }); };
  const after = () => { f.querySelectorAll('textarea[data-ov]').forEach((e) => { if (L.o[e.dataset.ov] == null) e.value = gv(L, e.dataset.ov); }); $('#wn').innerHTML = warnHtml(); const n = $('#nmtxt'); if (n) n.innerHTML = numInfo(); hints(); prev(); };
  const rr = () => { const sc = f.scrollTop; form(); $('#fm').scrollTop = sc; prev(); };
  hints();
  f.ontoggle = (e) => { if (e.target.tagName === 'DETAILS') UI.more = e.target.open; };
  f.oninput = f.onchange = (e) => {
    const x = e.target, d = x.dataset;
    if (x.id === 'tp') { L = newLetter(x.value, { pid: L.pid }); form(); prev(); return; }
    if (x.id === 'pk') { L.pid = x.value; fromPaket(); rr(); return; }
    if (d.k) { L[d.k] = x.type === 'checkbox' ? x.checked : x.type === 'number' ? (x.value === '' ? '' : +x.value) : x.value; if (d.k === 'tindak') { /* teks bebas */ } }
    else if (d.ov) { L.o[d.ov] = x.value; const b = f.querySelector(`[data-bd=${d.ov}]`); if (b) { b.textContent = 'Diubah manual'; b.classList.add('m'); if (!b.parentElement.querySelector('[data-rev]')) b.parentElement.insertAdjacentHTML('beforeend', ` <a data-rev="${d.ov}">Kembalikan</a>`); } }
    else if (d.p) setP(L, d.p, x.value);
    else if (d.ang !== undefined) L.angs[+d.ang].ttd = x.checked;
    else if (d.pen) { L.pen = { ...(L.pen || {}), [d.pen]: x.checked }; }
    else if (x.id === 'angq') { if (e.type !== 'change') return; const q = x.value.trim().toLowerCase(), p = D.pokja.find((p) => !L.angs.some((a) => a.id === p.id) && (p.nama.toLowerCase() === q || (p.nip && p.nip === q))); if (p) { L.angs.push({ id: p.id, ttd: true }); rr(); } return; }
    else if (d.copy !== undefined) { if (!x.value) return; L.angs = clone(D.surat.find((y) => y.id === x.value).angs); rr(); return; }
    else return;
    if (d.p && /\.(st|win)$|^win$/.test(d.p) && e.type === 'change') { rr(); return; }
    if (e.type === 'change' && (d.k === 'konsol' || d.k === 'ttd' || d.k === 'akun' || d.k === 'jenisMK' || d.p === 'win')) { rr(); return; }
    after();
  };
  f.onpaste = (e) => { const x = e.target; if (!x.dataset.paste) return; e.preventDefault(); const rows = parsePaste(e.clipboardData.getData('text')); if (rows.length) { setP(L, x.dataset.paste, rows); rr(); } };
  f.onclick = (e) => {
    const x = e.target.closest('[data-act],[data-ch],[data-seg],[data-q],[data-rev],[data-go],[data-fz]'); if (!x) return; const d = x.dataset, cut = (s) => { const i = s.indexOf(':'); return [s.slice(0, i), s.slice(i + 1)]; };
    if (d.ch) { const [k, v] = cut(d.ch); if (k === 'tindakPilih') { L.tindak = v; rr(); return; } const a = (L[k] ||= []), j = a.indexOf(v); j < 0 ? a.push(v) : a.splice(j, 1); rr(); return; }
    if (d.seg) { const [k, v] = cut(d.seg); L[k] = v; rr(); return; }
    if (d.q) { const i = d.q.indexOf('='); L[d.q.slice(0, i)] = d.q.slice(i + 1); rr(); return; }
    if (d.rev) { delete L.o[d.rev]; rr(); return; }
    if (d.go) { saveL(); tab = d.go; view = 'set'; shell(); return; }
    if (d.fz) { const el = f.querySelector(d.fz); if (el) { el.scrollIntoView({ block: 'center' }); el.focus && el.focus(); } return; }
    const [c, v] = cut(d.act + ':'), a = v.replace(/:$/, '');
    if (c === 'zoom') UI.zoom = !UI.zoom;
    else if (c === 'pre') { const q = PRE[+a]; L.docs = [...q[1]]; L.konsol = q[2]; }
    else if (c === 'aup') { const i = +a; [L.angs[i - 1], L.angs[i]] = [L.angs[i], L.angs[i - 1]]; }
    else if (c === 'arm') L.angs.splice(+a, 1);
    else if (c === 'padd') getP(L, a).push({ nama: '', nilai: '', st: 'Memenuhi', ket: 'Memenuhi Syarat' });
    else if (c === 'prm' || c === 'pup' || c === 'pdn') { const [path, i] = a.split('|'), arr = getP(L, path), n = +i; if (c === 'prm') arr.splice(n, 1); else { const m = c === 'pup' ? n - 1 : n + 1; [arr[n], arr[m]] = [arr[m], arr[n]]; } const wp = path.replace(/pes$/, 'win'); if (getP(L, wp) !== undefined) setP(L, wp, ''); }
    else if (c === 'ita') L.items.push({ nama: '', pes: [], win: '' });
    else if (c === 'itr') { if (L.items.length > 1) L.items.splice(+a, 1); }
    else if (c === 'uba') L.items.push(a === 'tayang' ? { t: 'tayang', semula: '', baru: '' } : { t: 'lain', uraian: '' });
    else if (c === 'ubt') { const [i, t] = a.split('|'); L.items[+i].t = t; }
    else if (c === 'ubr') { if (L.items.length > 1) L.items.splice(+a, 1); }
    rr();
  };
  $('#sv').onclick = () => { saveL(); setSt('Surat disimpan'); };
  $('#pdf').onclick = doPdf;
}
function parsePaste(t) {
  return lines(t).map((ln) => { const c = ln.split(/\t| {2,}/).map((x) => x.trim()).filter(Boolean), money = c.find((x) => /\d[\d.,]{3,}/.test(x.replace(/rp/gi, ''))); const nama = c.filter((x) => x !== money && !/^\d{1,3}$/.test(x)).sort((a, b) => b.length - a.length)[0]; return nama ? { nama, nilai: money ? num(money) : '', st: 'Memenuhi', ket: 'Memenuhi Syarat' } : null; }).filter(Boolean);
}
function doPdf() { const m = missing(); if (m.length && !confirm(`Masih ada ${m.length} isian kosong (${m.map((x) => x[0]).join(', ')}). Tetap unduh PDF?`)) return; saveL(); const old = document.title; document.title = judul(L); addEventListener('afterprint', () => (document.title = old), { once: true }); print(); }
function saveL() {
  L.ts = Date.now(); L.by = U.name;
  const i = D.surat.findIndex((s) => s.id === L.id), c = clone(L);
  i < 0 ? D.surat.push(c) : (D.surat[i] = c);
  D.last ||= {}; D.last[L.tpl] = Object.fromEntries(LASTK.filter((k) => L[k] !== undefined).map((k) => [k, L[k]]));
  dirty();
}
function prev() {
  const k = L.kertas || S().kertas, [pw, ph] = PGZ[k] || PGZ.A4;
  $('#pg').textContent = `@page{size:${pw}mm ${ph}mm;margin:0}`; // margin ada di dalam tiap halaman (lihat pages.js)
  const sh = $('#sh'), pane = $('.prev'); sh.className = 'pages ' + L.tpl;
  const n = fillPages(sh, L);
  sh.style.zoom = Math.max(0.4, Math.min(1.3, (pane.clientWidth - 24) / (pw * 3.7795)));
  $('#pgc').textContent = `${n} halaman · ${k}`;
}

/* ===== layar Pengaturan ===== */
const TABS = [['kode', 'Kode surat & rapat'], ['pokja', 'Daftar Pokja & TTD'], ['paket', 'Paket'], ['tpl', 'Template teks'], ['ref', 'Kode referral'], ['cad', 'Data & cadangan']];
function setView() {
  $('#main').innerHTML = `<div class=set><div>${TABS.filter((t) => t[0] !== 'ref' || U.admin).map(([k, n]) => `<div class="t ${tab === k ? 'on' : ''}" data-t=${k}>${n}</div>`).join('')}</div><div id=pn></div></div><p class=muted style="text-align:center">Masuk sebagai ${esc(U.name)} · ${esc(U.email)}</p>`;
  document.querySelectorAll('.set [data-t]').forEach((e) => (e.onclick = () => { tab = e.dataset.t; setView(); }));
  const P = { kode: pKode, pokja: pPokja, paket: pPaket, tpl: pTpl, ref: pRef, cad: pCad }[tab];
  P($('#pn'));
}
function pKode(el) {
  const s = S();
  el.innerHTML = `<div class=card><h3>Penomoran & kertas</h3><div class=g2>${[['klas', 'Kode klasifikasi'], ['unit', 'Kode unit'], ['kota', 'Kota'], ['kertas', 'Ukuran kertas', 'sel', ['A4', 'F4', 'Letter']]].map((f) => fh(s, f)).join('')}</div><p class=muted>Format nomor: urut/${esc(s.klas)}/${esc(s.unit)}/bulan/tahun</p></div>
  <div class=card><h3>Rapat (undangan)</h3>${[['zoomTempat', 'Tempat rapat bawaan (luring)'], ['zoomLink', 'Tautan Zoom bawaan']].map((f) => fh(s, f)).join('')}<div class=g2>${[['zoomId', 'Meeting ID'], ['zoomPass', 'Passcode'], ['zona', 'Zona waktu', 'sel', ['WIB', 'WITA', 'WIT']]].map((f) => fh(s, f)).join('')}</div></div>
  <div class=card><h3>Kalimat & baris baku</h3>${[['pejabat', 'Pejabat penerbit surat tugas'], ['instansi', 'Instansi'], ['penutupMK', 'Baris penutup Dokumen Mini Kompetisi'], ['an', 'Undangan: baris a.n.'], ['unitBaris', 'Undangan: baris unit'], ['lap1', 'Laporan: baris 1 di atas tabel TTD'], ['lap2', 'Laporan: baris 2'], ['penutup', 'Kalimat penutup undangan']].map((f) => fh(s, f)).join('')}</div>
  <div class=card><h3>Kop surat</h3>${[['kop1', 'Baris 1'], ['kop2', 'Baris 2 (besar)'], ['kop3', 'Alamat & kontak', 'area']].map((f) => fh(s, f)).join('')}<label>Logo</label><div class=row>${s.logo ? `<img src="${s.logo}">` : '<span class=muted>belum ada logo</span>'}<input type=file accept="image/*" id=lg style="width:auto"></div></div>`;
  bind(el, s, dirty);
  $('#lg').onchange = (e) => e.target.files[0] && ttdUp(e.target.files[0], (d) => { s.logo = d; dirty(); pKode(el); });
}
function cropData(url) {
  return new Promise((res) => { const im = new Image(); im.onload = () => {
    const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const x = c.getContext('2d'); x.drawImage(im, 0, 0);
    const d = x.getImageData(0, 0, c.width, c.height).data; let a = c.width, b = c.height, e = -1, f = -1;
    for (let y = 0; y < c.height; y++) for (let X = 0; X < c.width; X++) { const i = (y * c.width + X) * 4; if (d[i + 3] > 20 && d[i] + d[i + 1] + d[i + 2] < 720) { if (X < a) a = X; if (X > e) e = X; if (y < b) b = y; if (y > f) f = y; } }
    if (e < a) return res(url);
    const o = document.createElement('canvas'); o.width = e - a + 1; o.height = f - b + 1; o.getContext('2d').drawImage(c, a, b, o.width, o.height, 0, 0, o.width, o.height); res(o.toDataURL('image/png')); }; im.src = url; });
}
function ttdUp(file, cb) {
  const fr = new FileReader();
  fr.onload = () => { const im = new Image(); im.onload = () => { const sc = Math.min(1, 500 / im.width), c = document.createElement('canvas'); c.width = im.width * sc; c.height = im.height * sc; c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); cropData(c.toDataURL('image/png')).then(cb); }; im.src = fr.result; };
  fr.readAsDataURL(file);
}
function pPokja(el) {
  el.innerHTML = `<div class=card><h3>Daftar Pokja & TTD</h3><div class=g2><div><label>Nama</label><input id=pn1></div><div><label>NIP</label><input id=pn2></div></div><p><button class="btn p" id=add>Tambah</button> <button class=btn id=crop>Rapikan semua TTD (tengahkan)</button></p>
  ${D.pokja.map((p) => `<div class=row data-i=${p.id}>${p.ttd ? `<img src="${p.ttd}">` : '<span class=muted style="width:120px">belum ada TTD</span>'}<div style="flex:1"><b>${esc(p.nama)}</b><br><span class=muted>${p.nip ? 'NIP ' + esc(p.nip) : 'NIP belum diisi'}</span>${p.ttd ? `<br><span class=muted>Lebar pada undangan: <input type=range min=60 max=220 value="${p.w || 140}" data-w=${p.id} style="width:120px"> ${p.w || 140} pt</span>` : ''}</div><label class=btn style="margin:0">${p.ttd ? 'Ganti' : 'Unggah'} TTD<input type=file accept="image/*" data-u=${p.id} hidden></label><button class="btn s" data-d=${p.id}>Hapus</button></div>`).join('')}</div>`;
  $('#add').onclick = () => { const n = $('#pn1').value.trim(); if (!n) return; D.pokja.push({ id: uid(), nama: n, nip: $('#pn2').value.trim(), ttd: '', w: 140 }); dirty(); pPokja(el); };
  $('#crop').onclick = async () => { for (const p of D.pokja) if (p.ttd) p.ttd = await cropData(p.ttd); dirty(); pPokja(el); };
  el.onchange = (e) => { const t = e.target; if (t.dataset.u) ttdUp(t.files[0], (d) => { D.pokja.find((p) => p.id === t.dataset.u).ttd = d; dirty(); pPokja(el); }); };
  el.oninput = (e) => { const t = e.target; if (t.dataset.w) { D.pokja.find((p) => p.id === t.dataset.w).w = +t.value; t.parentElement.lastChild.textContent = ' ' + t.value + ' pt'; dirty(); } };
  el.onclick = (e) => { const d = e.target.dataset.d; if (d && confirm('Hapus anggota ini?')) { D.pokja = D.pokja.filter((p) => p.id !== d); dirty(); pPokja(el); } };
}
const PF = [['nama', 'Nama paket'], ['rup', 'Kode RUP'], ['satker', 'Satuan kerja'], ['instansi', 'Instansi'], ['pagu', 'Nilai pagu (angka)'], ['hps', 'Nilai HPS (angka)'], ['sumber', 'Sumber dana'], ['lokasi', 'Lokasi pekerjaan'], ['waktu', 'Waktu pelaksanaan / tgl. penyelesaian', 'date'], ['metode', 'Metode', 'sel', ['Itemized', 'Total']], ['jenis', 'Jenis pengadaan'], ['tahun', 'Tahun anggaran'], ['stNo', 'Nomor surat tugas'], ['stTgl', 'Tanggal surat tugas', 'date'], ['pejabatST', 'Pejabat penerbit ST'], ['ppk', 'Pejabat Pembuat Komitmen (tujuan surat)']];
let pe = null;
function pPaket(el) {
  const p = D.paket.find((x) => x.id === pe);
  el.innerHTML = `<div class=card><h3>Paket</h3><p><button class="btn p" id=np>Paket baru</button></p>${D.paket.map((x) => `<div class=row><b style="flex:1">${esc(x.nama || '(tanpa nama)')}</b><button class="btn s" data-e=${x.id}>Ubah</button><button class="btn s" data-d=${x.id}>Hapus</button></div>`).join('')}</div>
  ${p ? `<div class=card><h3>Ubah paket</h3><div class=g2>${PF.map((f) => fh(p, f)).join('')}</div></div>` : ''}`;
  if (p) bind(el.lastElementChild, p, dirty);
  $('#np').onclick = () => { const n = { id: uid(), nama: 'Paket baru', instansi: S().instansi, pejabatST: S().pejabat, metode: 'Itemized', jenis: 'Barang', sumber: 'APBN', tahun: String(new Date().getFullYear()) }; D.paket.push(n); pe = n.id; dirty(); pPaket(el); };
  el.onclick = (e) => { const t = e.target; if (t.dataset.e) { pe = t.dataset.e; pPaket(el); } if (t.dataset.d && confirm('Hapus paket? Surat yang sudah dibuat tidak ikut terhapus.')) { D.paket = D.paket.filter((x) => x.id !== t.dataset.d); dirty(); pPaket(el); } };
}
function pTpl(el) {
  el.innerHTML = `<div class=card><h3>Template teks</h3><p class=muted>Ubah kalimat baku tiap dokumen. Pakai {nama}, {stNo}, {stTgl}, {pejabatST}, {satker}, {baNo}, {baTgl}, {pemenang}, {dok}, {cara}. Kosongkan untuk kembali ke bawaan.</p>${Object.keys(TXL).map((k) => `<label>${TXL[k]}</label><textarea data-k=${k} style="min-height:${k === 'dmkIsi' ? 320 : 100}px">${esc(tx(k))}</textarea>`).join('')}</div>`;
  bind(el, D.tpl, (t) => { if (t.value === TX[t.dataset.k]) delete D.tpl[t.dataset.k]; dirty(); });
}
async function pRef(el) {
  const draw = (r, err = '') => {
    el.innerHTML = `<div class=card><h3>Kode referral</h3><p class=muted>Orang baru hanya bisa mendaftar dengan kode ini. Kuota habis = kode tidak berlaku lagi.</p><div class=g2><div><label>Kode (kosong = acak)</label><input id=rc></div><div><label>Kuota pemakaian</label><input id=rm type=number value=5></div></div><p><button class="btn p" id=rg>Buat kode</button></p><div class=err>${esc(err)}</div>${r.map((x) => `<div class=row><b style="flex:1;letter-spacing:.06em">${esc(x.code)}</b><span class=muted>${x.used}/${x.max} terpakai</span><button class="btn s" data-x=${x.code}>Hapus</button></div>`).join('')}</div>`;
    $('#rg').onclick = async () => { try { draw((await api('admin', 'POST', { code: $('#rc').value, max: $('#rm').value })).refs); } catch (e) { draw(r, e.message); } };
    el.onclick = async (e) => { if (e.target.dataset.x) draw((await api('admin?code=' + encodeURIComponent(e.target.dataset.x), 'DELETE')).refs); };
  };
  try { draw((await api('admin')).refs); } catch (e) { el.innerHTML = `<div class=card>${esc(e.message)}</div>`; }
}
function pCad(el) {
  el.innerHTML = `<div class=card><h3>Cadangan</h3><p class=muted>Unduh cadangan semua data (.json) secara berkala dan simpan di Drive.</p><button class=btn id=dl>Unduh cadangan semua data (.json)</button> <label class=btn style="display:inline-block;margin:0">Pulihkan dari file<input type=file accept=.json id=rs hidden></label></div>`;
  $('#dl').onclick = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(D)], { type: 'application/json' })); a.download = `cadangan-dokumen-pokja-${today()}.json`; a.click(); };
  $('#rs').onchange = async (e) => { try { const j = JSON.parse(await e.target.files[0].text()); if (!j.set || !j.pokja || !j.paket) throw 0; if (!confirm('Timpa semua data saat ini dengan isi cadangan?')) return; D = { ...DEF(), ...j }; purgeObs(); await persist(true); alert('Data dipulihkan.'); } catch { alert('File cadangan tidak valid.'); } };
}

/* ===== monitoring progres ===== */
const STAT = ['Draft Paket', 'Pengumuman Paket', 'Upload Dokumen Penawaran', 'Evaluasi Penawaran', 'Paket Batal', 'Paket Gagal', 'Penetapan Pemenang', 'Paket Sudah Selesai', 'Pembuktian Kualifikasi', 'Pengumuman Ulang', 'Perpanjangan Waktu', 'Perpanjangan Waktu II', 'Perpanjangan Waktu III', 'Perpanjangan Waktu IV', 'Perpanjangan Waktu V', 'Perpanjangan Waktu VI', 'Pembuatan Paket Baru', 'Perpanjangan Waktu I (Ulang)', 'Perpanjangan Waktu II (Ulang)', 'Perpanjangan Waktu III (Ulang)'];
const stList = () => (D.statusList && D.statusList.length ? D.statusList : STAT);
const stCls = (x) => (/batal|gagal/i.test(x) ? 'r' : /selesai|penetapan/i.test(x) ? 'g' : /perpanjangan/i.test(x) ? 'a' : '');
const PC = ['#7c3aed', '#0d9488', '#d97706', '#2563eb', '#db2777'];
const pcol = (p) => { let h = 0; for (const c of p || '') h = (h * 31 + c.charCodeAt(0)) % PC.length; return PC[h]; };
const mapUrl = (r) => r.peta || 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent((r.wil || '') + ' ' + (r.prov || ''));
const JENIS = ['Benih Tebu', 'Senyawa Humat', 'Seragam Penyuluh', 'Pupuk', 'Benih Padi', 'Benih Jagung', 'Pestisida', 'Alat dan Mesin Pertanian'];
const SATU = ['Kg', 'Liter', 'Ton', 'Kwintal', 'Unit', 'Paket', 'Set', 'Batang', 'Butir', 'Buah', 'Lembar', 'Pcs', 'Meter'];
let mtab = 'tbl', mq = '', mf = '', pq = '', curp = null;
const pkt = () => D.mpk.find((x) => x.id === curp);
/* angka monitoring: "1.500" = seribu lima ratus, "12,5" / "12.5" = desimal */
const dnum = (v) => { let t = String(v ?? '').trim().replace(/\s/g, ''); if (!t) return 0; t = /^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(t) ? t.replace(/\./g, '').replace(',', '.') : t.replace(',', '.'); const n = parseFloat(t.replace(/[^\d.\-]/g, '')); return isNaN(n) ? 0 : n; };
const idn = (n) => n.toLocaleString('id-ID', { maximumFractionDigits: 3 });
const fnum = (v) => (v === '' || v == null ? '' : idn(dnum(v)));
const msel = new Set();
const mopen = new Set(); // wilayah yang detail pesertanya sedang dibuka // wilayah yang dicentang (untuk total & ubah massal)
const dl = (id, arr) => `<datalist id=${id}>${[...new Set(arr)].map((x) => `<option value="${esc(x)}">`).join('')}</datalist>`;
const dls = () => dl('jl', [...JENIS, ...D.mpk.flatMap((p) => [p.jenis, ...p.wil.map((r) => r.jenis)]).filter(Boolean)]) + dl('sl', [...SATU, ...D.mpk.flatMap((p) => p.wil.map((r) => r.sat)).filter(Boolean)]);
function modal(html) { const m = document.createElement('div'); m.className = 'mdl'; m.innerHTML = `<div class=mbox>${html}</div>`; m.onmousedown = (e) => { if (e.target === m) m.remove(); }; document.body.append(m); return m; }
function monView() {
  $('#main').innerHTML = `<div class=head><h1>Monitoring</h1><div class=tabs><a data-t=tbl class="${mtab === 'tbl' ? 'on' : ''}">Progres pengadaan</a><a data-t=gs class="${mtab === 'gs' ? 'on' : ''}">Google Sites</a></div></div><div id=mb></div>`;
  document.querySelectorAll('.tabs a').forEach((a) => (a.onclick = () => { mtab = a.dataset.t; monView(); }));
  mtab === 'gs' ? monSites() : pkt() ? monDetail() : monList();
}
/* --- level 1: daftar paket --- */
function summ(p) {
  const c = {}; p.wil.forEach((r) => (c[r.status] = (c[r.status] || 0) + 1));
  const top = Object.entries(c).sort((a, b) => b[1] - a[1]), done = p.wil.filter((r) => /selesai/i.test(r.status)).length;
  return `<b>${p.wil.length}</b> wilayah ${top.slice(0, 2).map(([k, v]) => `<span class="pill ${stCls(k)}">${esc(k)} · ${v}</span>`).join(' ')}${top.length > 2 ? ` <span class=muted>+${top.length - 2} status</span>` : ''}${p.wil.length ? ` <span class=muted>· ${Math.round((done / p.wil.length) * 100)}% selesai</span>` : ''}`;
}
function monList() {
  const rows = D.mpk.filter((p) => !pq || (p.nama + ' ' + p.jenis).toLowerCase().includes(pq.toLowerCase()));
  $('#mb').innerHTML = `${dls()}<div class=tools><input id=pqi placeholder="Cari paket…" value="${esc(pq)}"><button class="btn p" id=addp>+ Tambah Paket</button></div>
  <div class=tw><table class=mt style="min-width:820px"><thead><tr><th style="width:56px">NO</th><th>NAMA PAKET</th><th>JENIS / KOMODITI</th><th>RINGKASAN STATUS</th><th>AKSI</th></tr></thead><tbody>${rows.map((p, i) => `<tr data-id=${p.id}><td>${i + 1}</td><td><div class=fl><i class=fd></i><input class=nm data-pf=nama value="${esc(p.nama)}" placeholder="Nama paket"></div></td><td><input data-pf=jenis list=jl value="${esc(p.jenis)}" placeholder="Pilih / ketik komoditi"></td><td>${summ(p)}</td><td class=act><button class="btn s p" data-o=${p.id}>Buka Detail ›</button><a class=x data-d=${p.id} title="Hapus paket">×</a></td></tr>`).join('') || '<tr><td colspan=5 class=m style="padding:24px;text-align:center">Belum ada paket. Klik “+ Tambah Paket”.</td></tr>'}</tbody></table></div>`;
  const root = $('#mb');
  root.oninput = (e) => { const t = e.target; if (t.id === 'pqi') { pq = t.value; monList(); const q = $('#pqi'); q.focus(); q.setSelectionRange(pq.length, pq.length); return; } if (!t.dataset.pf) return; D.mpk.find((x) => x.id === t.closest('tr').dataset.id)[t.dataset.pf] = t.value; dirty(); };
  root.onclick = (e) => { const t = e.target;
    if (t.dataset.o) { curp = t.dataset.o; mq = mf = ''; msel.clear(); monView(); }
    if (t.dataset.d && confirm('Hapus paket beserta seluruh data wilayahnya?')) { D.mpk = D.mpk.filter((x) => x.id !== t.dataset.d); dirty(); monList(); }
    if (t.id === 'addp') { const m = modal(`<h3>Tambah paket</h3><label>Nama paket</label><input id=an placeholder="mis. Pengadaan Benih Tebu Tahap IV"><label>Jenis / komoditi</label><input id=aj list=jl placeholder="Pilih atau ketik sendiri"><p style="text-align:right"><button class=btn id=ac>Batal</button> <button class="btn p" id=ao>Tambah</button></p>`); $('#an').focus(); $('#ac').onclick = () => m.remove(); $('#ao').onclick = () => { const n = $('#an').value.trim(); if (!n) return $('#an').focus(); D.mpk.push({ id: uid(), nama: n, jenis: $('#aj').value.trim(), wil: [] }); dirty(); m.remove(); monList(); }; } };
}
/* --- level 2: detail wilayah dalam paket --- */
function monDetail() {
  const p = pkt(), st = stList();
  const vis = () => p.wil.filter((r) => (!mq || (r.wil + ' ' + r.prov).toLowerCase().includes(mq.toLowerCase())) && (!mf || r.status === mf)), rows = vis();
  const chipsHtml = () => { const cnt = {}; p.wil.forEach((r) => (cnt[r.status] = (cnt[r.status] || 0) + 1)); return Object.entries(cnt).map(([k, v]) => `<span class="pill ${stCls(k)} ${mf === k ? 'sel' : ''}" data-s="${esc(k)}" style="cursor:pointer">${esc(k)} · ${v}</span>`).join(''); };
  const sumOf = (vs) => vs.reduce((a, r) => { a.l += dnum(r.lahan); a.p += num(r.penawar); const u = (r.sat || '').trim() || '-'; a.q[u] = (a.q[u] || 0) + dnum(r.qty); return a; }, { l: 0, p: 0, q: {} });
  const qtxt = (q) => Object.entries(q).map(([u, v]) => `${idn(v)} ${esc(u)}`).join('<br>') || '0';
  const picked = () => p.wil.filter((r) => msel.has(r.id));
  const footRow = () => { const vs = vis(), tot = sumOf(vs), ps = picked(), sp = sumOf(ps);
    return `<tr><td></td><td>Total semua tampil (${vs.length} wilayah)</td><td></td><td class=n>${idn(tot.l)}</td><td colspan=2 class=tq>${qtxt(tot.q)}</td><td></td><td></td><td class=c>${tot.p}</td><td></td></tr>${ps.length ? `<tr class=sumsel><td></td><td>Total DIPILIH (${ps.length} wilayah)</td><td></td><td class=n>${idn(sp.l)}</td><td colspan=2 class=tq>${qtxt(sp.q)}</td><td></td><td></td><td class=c>${sp.p}</td><td></td></tr>` : ''}`; };
  const selBar = () => { const ps = picked(); if (!ps.length) return '<p class=muted style="margin:6px 2px">Centang wilayah di kolom NO untuk menjumlahkan lahan, quantity, dan penawar item yang dipilih, atau mengubahnya sekaligus.</p>'; const sp = sumOf(ps);
    return `<div class=selbar><div><b>${ps.length} wilayah dipilih</b> — Lahan <b>${idn(sp.l)}</b> Ha · Quantity <b>${Object.entries(sp.q).map(([u, v]) => `${idn(v)} ${esc(u)}`).join(' + ') || '0'}</b> · Penawar <b>${sp.p}</b></div>
    <div class=bulk><span>Ubah massal:</span><input id=bq class=n placeholder="Quantity" inputmode=decimal><select id=bu><option value="">Satuan…</option>${satOpts('')}</select><select id=bs><option value="">Status…</option>${st.map((x) => `<option>${esc(x)}</option>`).join('')}</select><button class="btn s p" id=bok>Terapkan</button><button class="btn s" id=bno>Batal pilih</button></div></div>`; };
  const satOpts = (cur) => [...new Set([...SATU, ...(cur && !SATU.includes(cur) ? [cur] : [])])].map((x) => `<option ${x === cur ? 'selected' : ''}>${esc(x)}</option>`).join('') + '<option value="__baru">+ Satuan lain…</option>';
  $('#mb').innerHTML = `${dls()}<p style="margin:12px 0 0"><a id=bk>‹ Semua paket</a></p><div class=tools style="margin-top:8px"><input id=pn class=big value="${esc(p.nama)}" placeholder="Nama paket"><input id=pj list=jl value="${esc(p.jenis)}" placeholder="Jenis / komoditi paket" style="max-width:240px"></div>
  <div class=chips>${chipsHtml()}</div>
  <div class=tools><input id=mqi placeholder="Cari kabupaten/kota…" value="${esc(mq)}"><select id=mfi><option value="">Semua status progress</option>${st.map((x) => `<option ${x === mf ? 'selected' : ''}>${esc(x)}</option>`).join('')}</select><button class="btn p" id=addw>+ Tambah wilayah</button><button class=btn id=adds>+ Status baru</button></div>
  <div id=selbar>${selBar()}</div><div class=tw><table class="mt det"><thead><tr><th><label class=ckn title="Pilih semua yang tampil"><input type=checkbox id=sa ${rows.length && rows.every((r) => msel.has(r.id)) ? 'checked' : ''}> NO</label></th><th>PROVINSI / WILAYAH / KABUPATEN / KOTA</th><th>JENIS / KOMODITI</th><th>LAHAN (HA)</th><th colspan=2>QUANTITY &amp; SATUAN</th><th>STATUS PROGRESS PENGADAAN</th><th>PENAWARAN SELESAI</th><th>JUMLAH PENAWAR</th><th>PESERTA / PETA</th></tr></thead><tbody>${rows.map((r, i) => `<tr data-id=${r.id} class="${msel.has(r.id) ? 'pk' : ''}"><td><label class=ckn><input type=checkbox data-ck ${msel.has(r.id) ? 'checked' : ''}> ${i + 1}</label></td><td><input class=tag data-f=prov value="${esc(r.prov)}" placeholder="Provinsi" style="color:${pcol(r.prov)};background:${pcol(r.prov)}14"><input class=nm data-f=wil value="${esc(r.wil)}" placeholder="Kabupaten / Kota"></td><td><input class=jn data-f=jenis list=jl value="${esc(r.jenis || '')}" placeholder="${esc(p.jenis || 'Komoditi')}"></td><td><input class=n data-f=lahan inputmode=decimal value="${fnum(r.lahan)}"></td><td><input class=n data-f=qty inputmode=decimal value="${fnum(r.qty)}"></td><td><select class=su data-f=sat><option value="">—</option>${satOpts(r.sat || '')}</select></td><td><select class="pill ${stCls(r.status)}" data-f=status>${st.map((x) => `<option ${x === r.status ? 'selected' : ''}>${esc(x)}</option>`).join('')}</select></td><td><input type=datetime-local data-f=selesai value="${esc(r.selesai)}"></td><td><input type=number min=0 class=c data-f=penawar value="${esc(r.penawar)}"></td><td class=act><a class="pt pbtn ${mopen.has(r.id) ? 'on' : ''}" data-pw=${r.id}>Peserta ${(r.pes || []).length ? '· ' + r.pes.length : ''} ${mopen.has(r.id) ? '▴' : '▾'}</a> <a class=pt data-m=${r.id}>Peta</a><a class=x data-pe=${r.id} title="Ubah tautan peta">✎</a><a class=x data-x=${r.id} title="Hapus baris">×</a></td></tr>${mopen.has(r.id) ? pesRow(r) : ''}`).join('') || '<tr><td colspan=10 class=m style="padding:24px;text-align:center">Belum ada wilayah. Klik “+ Tambah wilayah”.</td></tr>'}</tbody><tfoot>${footRow()}</tfoot></table></div>`;
  const root = $('#mb'), refocus = (id, v) => { const q = $(id); q.focus(); q.setSelectionRange(v.length, v.length); };
  const inp = (e) => { const t = e.target;
    if (t.dataset.pf) { const box = t.closest('[data-w]'), r = p.wil.find((x) => x.id === box.dataset.w), q = r.pes.find((x) => x.id === t.closest('tr').dataset.pid); q[t.dataset.pf] = t.value;
      if (e.type === 'change' && ['jml', 'total'].includes(t.dataset.pf)) { t.value = rpTot(t.value); q[t.dataset.pf] = t.value; } dirty(); box.querySelector('.pbest').innerHTML = pbest(r); return; }
    if (t.id === 'mqi') { mq = t.value; monDetail(); refocus('#mqi', mq); return; }
    if (t.id === 'mfi') { mf = t.value; monDetail(); return; }
    if (t.id === 'pn') { p.nama = t.value; dirty(); return; } if (t.id === 'pj') { p.jenis = t.value; dirty(); return; }
    const tr = t.closest('tr[data-id]'); if (!tr || !t.dataset.f) return;
    const r = p.wil.find((x) => x.id === tr.dataset.id);
    if (t.dataset.f === 'sat' && t.value === '__baru') { const n = (prompt('Satuan baru (mis. Kg, Ton, Unit)') || '').trim(); if (n) { r.sat = n; dirty(); monDetail(); } else t.value = r.sat || ''; return; }
    r[t.dataset.f] = t.value;
    if (t.dataset.f === 'status') t.className = 'pill ' + stCls(t.value);
    dirty(); if (e.type === 'change' && ['lahan', 'qty'].includes(t.dataset.f)) t.value = fnum(t.value);
    if (['lahan', 'qty', 'sat', 'penawar', 'status'].includes(t.dataset.f)) { $('.det tfoot').innerHTML = footRow(); $('.chips').innerHTML = chipsHtml(); $('#selbar').innerHTML = selBar(); } };
  root.onfocusin = (e) => { const t = e.target; if (t.dataset && (['lahan', 'qty'].includes(t.dataset.f) || t.dataset.pf)) t.select(); if (t.id === 'bq') t.select(); };
  const chg = (e) => { const t = e.target;
    if (t.id === 'sa') { vis().forEach((r) => (t.checked ? msel.add(r.id) : msel.delete(r.id))); monDetail(); return; }
    if (t.dataset && t.dataset.ck !== undefined) { const id = t.closest('tr').dataset.id; t.checked ? msel.add(id) : msel.delete(id); t.closest('tr').classList.toggle('pk', t.checked); $('.det tfoot').innerHTML = footRow(); $('#selbar').innerHTML = selBar(); const sa = $('#sa'); if (sa) sa.checked = vis().length > 0 && vis().every((r) => msel.has(r.id)); }
    if (t.id === 'bu' && t.value === '__baru') { const n = (prompt('Satuan baru') || '').trim(); t.innerHTML = `<option value="">Satuan…</option>${satOpts(n)}`; if (n) t.value = n; else t.value = ''; } };
  root.oninput = inp; root.onchange = (e) => { inp(e); chg(e); };
  root.onclick = (e) => { const t = e.target;
    if (t.id === 'bk') { curp = null; msel.clear(); monView(); }
    if (t.dataset.s) { mf = mf === t.dataset.s ? '' : t.dataset.s; monDetail(); }
    if (t.dataset.pw) { mopen.has(t.dataset.pw) ? mopen.delete(t.dataset.pw) : mopen.add(t.dataset.pw); monDetail(); return; }
    const pbx = t.closest && t.closest('[data-w]');
    if (pbx) { const r = p.wil.find((x) => x.id === pbx.dataset.w), sync = () => { if (r.pes.length) r.penawar = String(r.pes.length); dirty(); monDetail(); };
      if (t.dataset.pa !== undefined) { r.pes.push({ id: uid(), rank: String(r.pes.length + 1), nama: '', lokasi: '', jenis: 'PDN', tkdn: '', bmp: '', jml: '', total: '' }); sync(); const bx = document.querySelector(`[data-w="${r.id}"] tbody tr:last-child [data-pf=nama]`); bx && bx.focus(); return; }
      if (t.dataset.ps !== undefined) { r.pes.sort((a, b) => (dnum(a.rank) || 1e9) - (dnum(b.rank) || 1e9)); dirty(); monDetail(); return; }
      if (t.dataset.pp !== undefined) { pastePes(r, sync); return; }
      if (t.dataset.px && confirm('Hapus peserta ini?')) { r.pes = r.pes.filter((x) => x.id !== t.dataset.px); sync(); return; } }
    if (t.id === 'bno') { msel.clear(); monDetail(); }
    if (t.id === 'bok') { const q = $('#bq').value, u = $('#bu').value, sv = $('#bs').value; if (q === '' && !u && !sv) return alert('Isi quantity, satuan, atau status yang mau diterapkan.');
      picked().forEach((r) => { if (q !== '') r.qty = q; if (u && u !== '__baru') r.sat = u; if (sv) r.status = sv; }); dirty(); monDetail(); }
    if (t.id === 'addw') addWil(p);
    if (t.id === 'adds') { const n = (prompt('Nama status baru') || '').trim(); if (n) { D.statusList = [...stList(), n]; dirty(); monDetail(); } }
    if (t.dataset.x && confirm('Hapus wilayah ini?')) { p.wil = p.wil.filter((x) => x.id !== t.dataset.x); msel.delete(t.dataset.x); dirty(); monDetail(); }
    if (t.dataset.pe) { const r = p.wil.find((x) => x.id === t.dataset.pe), u = prompt('Tautan peta (kosongkan = cari otomatis di Google Maps)', r.peta || ''); if (u !== null) { r.peta = u.trim(); dirty(); } }
    if (t.dataset.m) { const r = p.wil.find((x) => x.id === t.dataset.m), q = `${r.wil} ${r.prov}`; const m = modal(`<h3>${esc(r.wil)} <span class=muted>${esc(r.prov)}</span></h3><iframe src="https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed" loading=lazy style="width:100%;height:55vh;border:1px solid #e7ebf3;border-radius:12px"></iframe><p style="text-align:right"><a class="btn s" href="${esc(mapUrl(r))}" target=_blank rel=noopener>Buka di Google Maps</a> <button class="btn s p" id=mc>Tutup</button></p>`); $('#mc').onclick = () => m.remove(); } };
}
/* --- peserta kompetisi PER WILAYAH (dibuka dari tombol "Peserta" pada tiap baris wilayah): ranking, penyedia, lokasi, jenis produk, TKDN, BMP, jumlah produk, total penawaran (termasuk pajak) --- */
const rpTot = (v) => (v === '' || v == null ? '' : dnum(v).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
const PESF = ['rank', 'nama', 'lokasi', 'jenis', 'tkdn', 'bmp', 'jml', 'total'];
const pbest = (r) => { const t = (r.pes || []).filter((x) => dnum(x.total) > 0).sort((a, b) => dnum(a.total) - dnum(b.total))[0]; return t ? `Penawaran terendah: <b>${esc(t.nama || '-')}</b> · Rp ${rpTot(t.total)}` : ''; };
const pesRow = (r) => { r.pes ||= [];
  return `<tr class=pxr><td colspan=10><div class=pxbox data-w=${r.id}><div class=pxh><b>Peserta kompetisi · ${esc(r.wil)}</b><button class="btn s p" data-pa>+ Tambah peserta</button><button class="btn s" data-pp>Tempel dari Excel</button><button class="btn s" data-ps>Urutkan ranking</button><span class="muted pbest">${pbest(r)}</span></div>
  <div class=tw><table class="mt pes"><thead><tr><th>RANKING</th><th>NAMA PENYEDIA</th><th>LOKASI</th><th>JENIS PRODUK</th><th>TKDN</th><th>BMP</th><th>JUMLAH PRODUK</th><th>TOTAL PENAWARAN (TERMASUK PAJAK)</th><th></th></tr></thead><tbody>${r.pes.map((q) => `<tr data-pid=${q.id}><td><input class=c data-pf=rank value="${esc(q.rank)}" inputmode=numeric></td><td><input class=nm data-pf=nama value="${esc(q.nama)}" placeholder="Nama penyedia"></td><td><input data-pf=lokasi value="${esc(q.lokasi)}" placeholder="Kota / Kabupaten"></td><td><input class=su data-pf=jenis value="${esc(q.jenis)}" placeholder="PDN"></td><td><input class=n data-pf=tkdn value="${esc(q.tkdn)}" placeholder="0.00%"></td><td><input class=n data-pf=bmp value="${esc(q.bmp)}" placeholder="0.00%"></td><td><input class=n data-pf=jml value="${esc(q.jml)}" inputmode=decimal></td><td><input class="n tt" data-pf=total value="${esc(q.total)}" inputmode=decimal></td><td class=act><a class=x data-px=${q.id} title="Hapus peserta">×</a></td></tr>`).join('') || '<tr><td colspan=9 class=m style="padding:18px;text-align:center">Belum ada peserta. Klik “+ Tambah peserta” atau “Tempel dari Excel”.</td></tr>'}</tbody></table></div></div></td></tr>`; };
function pastePes(r, done) {
  const m = modal(`<h3>Tempel dari Excel · ${esc(r.wil)}</h3><p class=muted>Salin baris dari Excel / katalog lalu tempel. Urutan kolom: Ranking, Nama Penyedia, Lokasi, Jenis Produk, TKDN, BMP, Jumlah Produk, Total Penawaran. Baris judul otomatis dilewati.</p><textarea id=pt rows=9 style="width:100%" placeholder="1&#9;ENAM PURNAMA&#9;BANDA ACEH&#9;PDN&#9;94.74%&#9;0.00%&#9;40.370,00&#9;2.262.940.350,00"></textarea><p><label><input type=checkbox id=prp style="width:auto"> Ganti seluruh daftar peserta (bukan menambahkan)</label></p><p style="text-align:right"><button class=btn id=pc>Batal</button> <button class="btn p" id=po>Impor</button></p>`);
  $('#pt').focus(); $('#pc').onclick = () => m.remove();
  $('#po').onclick = () => { const rows = $('#pt').value.split(/\r?\n/).map((l) => l.split('\t').map((c) => c.trim())).filter((c) => c.filter(Boolean).length >= 2).filter((c) => !/^rank/i.test(c[0])).map((c) => { const o = { id: uid() }; PESF.forEach((k, i) => (o[k] = c[i] || '')); o.jenis ||= 'PDN'; o.jml = rpTot(o.jml); o.total = rpTot(o.total); return o; });
    if (!rows.length) return alert('Tidak ada baris yang terbaca. Pastikan disalin dari Excel (kolom dipisah tab).');
    r.pes = $('#prp').checked ? rows : [...(r.pes || []), ...rows]; dirty(); m.remove(); done(); };
}
/* --- modal tambah wilayah (autocomplete seluruh Indonesia) --- */
let ALLW;
const allw = () => ALLW || (ALLW = WIL.flatMap(([pv, kb, kt]) => [...kb.split(',').filter(Boolean).map((n) => ({ p: 'Provinsi ' + pv, n: 'Kabupaten ' + n })), ...kt.split(',').filter(Boolean).map((n) => ({ p: 'Provinsi ' + pv, n: 'Kota ' + n }))]).map((o) => ({ ...o, k: (o.n + ' ' + o.p).toLowerCase() })));
function addWil(p) {
  const have = new Set(p.wil.map((r) => r.wil + '|' + r.prov)), sel = new Map(), provs = WIL.map((w) => 'Provinsi ' + w[0]);
  const m = modal(`<h3>Tambah wilayah</h3><div class=g2><div><input id=ws placeholder="Ketik kabupaten, kota, atau provinsi…" autocomplete=off></div><div><select id=wp><option value="">Semua provinsi</option>${provs.map((x) => `<option>${x}</option>`).join('')}</select></div></div><div id=wr class=wr></div><p class=muted id=wc></p>
  <div class=g2><div><label>Lahan (Ha)</label><input id=wl></div><div><label>Status awal</label><select id=wst>${stList().map((x) => `<option>${esc(x)}</option>`).join('')}</select></div><div><label>Quantity</label><input id=wq></div><div><label>Satuan</label><input id=wu list=sl value="Kg"></div></div>
  <p style="text-align:right"><button class=btn id=wx>Batal</button> <button class="btn p" id=wok>Tambah</button></p>`);
  let act = 0, list = [];
  const key = (o) => o.n + '|' + o.p;
  const draw = () => {
    const q = $('#ws').value.trim().toLowerCase(), pv = $('#wp').value, tk = q.split(/\s+/).filter(Boolean);
    list = allw().filter((o) => (!pv || o.p === pv) && tk.every((t) => o.k.includes(t))).sort((a, b) => (tk[0] ? (a.n.toLowerCase().indexOf(tk[0]) < 0 ? 99 : a.n.toLowerCase().indexOf(tk[0])) - (b.n.toLowerCase().indexOf(tk[0]) < 0 ? 99 : b.n.toLowerCase().indexOf(tk[0])) : 0)).slice(0, 80);
    act = Math.min(act, Math.max(0, list.length - 1));
    const hl = (t) => (tk[0] ? esc(t).replace(new RegExp('(' + tk.map((x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'ig'), '<mark>$1</mark>') : esc(t));
    $('#wr').innerHTML = list.map((o, i) => `<div class="wi ${i === act ? 'ac' : ''} ${sel.has(key(o)) ? 'on' : ''} ${have.has(key(o)) ? 'dis' : ''}" data-i=${i}><span class=ck>${sel.has(key(o)) ? '✓' : ''}</span><span><b>${hl(o.n)}</b><small>${hl(o.p)}${have.has(key(o)) ? ' · sudah ada di paket' : ''}</small></span></div>`).join('') + (q ? `<div class=wi data-man=1><span class=ck>+</span><span><b>Tambah manual “${esc($('#ws').value.trim())}”</b><small>${pv ? esc(pv) : 'tanpa provinsi'} · wilayah tidak ada di daftar</small></span></div>` : '') || '<p class=muted style="padding:10px">Ketik untuk mencari…</p>';
    $('#wc').textContent = `${list.length} hasil dari ${allw().length} kabupaten/kota · ${sel.size} dipilih`;
    const a = $('#wr .ac'); a && a.scrollIntoView({ block: 'nearest' });
  };
  const toggle = (o) => { if (have.has(key(o))) return; sel.has(key(o)) ? sel.delete(key(o)) : sel.set(key(o), o); draw(); };
  $('#ws').oninput = () => { act = 0; draw(); }; $('#wp').onchange = () => { act = 0; draw(); };
  $('#ws').onkeydown = (e) => { if (e.key === 'ArrowDown') { act = Math.min(list.length - 1, act + 1); draw(); e.preventDefault(); } if (e.key === 'ArrowUp') { act = Math.max(0, act - 1); draw(); e.preventDefault(); } if (e.key === 'Enter') { e.preventDefault(); list[act] && toggle(list[act]); } };
  $('#wr').onclick = (e) => { const w = e.target.closest('.wi'); if (!w) return; if (w.dataset.man) { const n = $('#ws').value.trim(), o = { n, p: $('#wp').value }; sel.set(key(o), o); draw(); } else toggle(list[+w.dataset.i]); };
  $('#wx').onclick = () => m.remove();
  $('#wok').onclick = () => { if (!sel.size) return ($('#wc').textContent = 'Pilih minimal satu wilayah.'); [...sel.values()].forEach((o) => p.wil.push({ id: uid(), prov: o.p, wil: o.n, jenis: '', lahan: $('#wl').value, qty: $('#wq').value, sat: $('#wu').value.trim() || 'Kg', status: $('#wst').value, selesai: '', penawar: '', peta: '' })); dirty(); m.remove(); monDetail(); };
  draw(); $('#ws').focus();
}

/* ===== Dokumen: koneksi Google Drive ===== */
const sz = (n) => (n == null ? '—' : n > 1e6 ? (n / 1e6).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1e3)) + ' KB');
async function driveView() {
  $('#main').innerHTML = `<div class=head><h1>Dokumen Drive</h1><span id=gds class=muted></span></div><div class=drop id=dz><b>Tarik &amp; lepas dokumen di sini</b><span class=muted>atau</span><label class="btn p">Pilih file<input type=file multiple hidden id=fi></label><div id=up></div></div><h6 style="margin-top:26px">SEMUA FILE</h6><div id=fl class=muted>Memuat…</div>`;
  let st = {};
  try { st = await api('drive?a=status'); } catch (e) { $('#fl').textContent = e.message; return; }
  const g = $('#gds');
  if (!st.configured) g.innerHTML = 'Belum dikonfigurasi (isi GOOGLE_CLIENT_ID dan GOOGLE_CLIENT_SECRET di Vercel).';
  else if (!st.connected) g.innerHTML = st.admin ? '<a class="btn p" href="/api/drive?a=auth">Hubungkan Google Drive</a>' : 'Belum terhubung. Minta admin menghubungkan Google Drive.';
  else g.innerHTML = `Terhubung · <a href="https://drive.google.com/drive/folders/${esc(st.folder)}" target=_blank rel=noopener>buka folder</a>${st.admin ? ' · <a href="/api/drive?a=auth">hubungkan ulang</a>' : ''}`;
  const list = async () => {
    if (!st.connected) { $('#fl').textContent = 'Hubungkan Google Drive untuk melihat dan mengunggah file.'; return; }
    try {
      const { files } = await api('drive?a=list'); $('#fl').className = '';
      $('#fl').innerHTML = `<table class=ft><tr><th>NAMA</th><th>TERAKHIR DIUBAH</th><th>UKURAN</th><th></th></tr>${files.map((f) => `<tr><td><i class=fi>${/pdf/.test(f.mimeType) ? 'P' : /sheet|excel/.test(f.mimeType) ? 'X' : /word|document/.test(f.mimeType) ? 'W' : '▤'}</i>${esc(f.name)}</td><td class=m>${new Date(f.modifiedTime).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</td><td class=m>${sz(f.size && +f.size)}</td><td class=r><a href="${esc(f.webViewLink)}" target=_blank rel=noopener>Buka</a>${st.admin ? `<a data-d=${f.id}>Hapus</a>` : ''}</td></tr>`).join('') || '<tr><td colspan=4 class=m>Folder masih kosong.</td></tr>'}</table>`;
    } catch (e) { $('#fl').innerHTML = `<span class=err>${esc(e.message)}</span>`; }
  };
  $('#fl').onclick = async (e) => { const d = e.target.dataset.d; if (d && confirm('Pindahkan file ke Sampah Drive?')) { await api('drive?a=del', 'POST', { id: d }).catch((x) => alert(x.message)); list(); } };
  const send = async (files) => { for (const f of files) await upFile(f, $('#up')); list(); };
  const dz = $('#dz');
  dz.ondragover = (e) => { e.preventDefault(); dz.classList.add('on'); };
  dz.ondragleave = () => dz.classList.remove('on');
  dz.ondrop = (e) => { e.preventDefault(); dz.classList.remove('on'); send([...e.dataTransfer.files]); };
  $('#fi').onchange = (e) => { send([...e.target.files]); e.target.value = ''; };
  list();
}
async function upFile(f, box) {
  const row = document.createElement('div'); row.className = 'upr'; row.innerHTML = `<span>${esc(f.name)}</span><progress max=100 value=0></progress>`; box.append(row);
  const end = (t, bad) => row.lastChild.replaceWith(Object.assign(document.createElement('b'), { textContent: t, style: bad ? 'color:#b91c1c' : 'color:#0f7b3f' }));
  try {
    const { url } = await api('drive?a=init', 'POST', { name: f.name, type: f.type || 'application/octet-stream', size: f.size });
    await new Promise((ok, no) => { const x = new XMLHttpRequest(); x.open('PUT', url); x.upload.onprogress = (e) => (row.lastChild.value = (e.loaded / e.total) * 100); x.onload = () => (x.status < 300 ? ok() : no(new Error('Google menolak unggahan (' + x.status + ')'))); x.onerror = () => no(new Error('Koneksi ke Google terputus')); x.send(f); });
    end('✓ Terunggah');
  } catch (e) { end('Gagal: ' + e.message, true); }
}

/* ===== mulai ===== */
(async () => {
  try { U = (await api('auth?a=me')).user; } catch { U = null; }
  U ? start().catch((e) => { $('#app').innerHTML = `<div class=auth><div class=card><p class=err>${esc(e.message)}</p></div></div>`; }) : authView();
})();
