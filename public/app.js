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
const dtm = (s) => (s ? `${hari(s)}, ${tgl(s)}, pukul ${jam(s)} WIB` : '......');
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
Dalam hal PPK/KPA tidak menyetujui hasil pemilihan Penyedia, PPK/KPA menyampaikan tanggapan tertulis beserta alasannya kepada Pokja Pemilihan.`,
  lapPenutup: `Bersama ini kami sampaikan Berita Acara Hasil Evaluasi Mini Kompetisi, Berita Acara Pembuktian dan Klarifikasi, serta Dokumen Penawaran dari {pemenang}. Demikian laporan ini disampaikan, atas perhatian dan kerjasamanya diucapkan terima kasih.`,
  lapTembusan: `Kepala Biro Umum dan Pengadaan selaku Kepala UKPBJ Kementerian Pertanian;\nKuasa Pengguna Anggaran {satker}.`,
  buktiIsi: `Menindaklanjuti Surat Tugas {pejabatST} Nomor: {stNo} tanggal {stTgl} tentang Pokja Pemilihan Barang/Jasa {nama}, bersama ini Pokja Pemilihan akan melakukan Pembuktian dan Klarifikasi Kualifikasi Penyedia pekerjaan dimaksud {cara}.`,
  buktiPenutup: `Sehubungan hal di atas, Saudara agar menyiapkan dokumen kualifikasi dan penawaran.`,
  buktiTembusan: `Kepala Biro Umum dan Pengadaan selaku Kepala UKPBJ Kementerian Pertanian;\nInspektur Jenderal Kementerian Pertanian.`,
  reviuIsi: `Menindaklanjuti Surat Tugas {pejabatST} Nomor {stNo} tanggal {stTgl} tentang Kelompok Kerja Pemilihan {nama}, bersama ini Pokja Pemilihan akan melakukan Konsolidasi dan Reviu {dok} paket pekerjaan dimaksud.`,
  evalPembuka: `Pada hari ini {hariTgl}, kami selaku Kelompok Kerja (Pokja) Pemilihan berdasarkan Surat Tugas {pejabatST} Nomor: {stNo} tanggal {stTgl}, pada:`,
  evalIsi: `Dengan ini kami Pokja Pemilihan telah melaksanakan proses evaluasi Mini Kompetisi dengan uraian sebagai berikut:`,
  evalPenutup: `Demikian Berita Acara ini dibuat dengan sebenarnya untuk dipergunakan sebagaimana mestinya.`,
};
const TXL = { dmkDasar: 'DMK — Dasar hukum (satu per baris)', dmkIsi: 'DMK — Isi bab B–H ("# Judul", "- butir", [KATEGORI] = tabel kategori)', reviuIsi: 'Undangan reviu — paragraf pembuka', buktiIsi: 'Undangan pembuktian — paragraf pembuka', buktiPenutup: 'Undangan pembuktian — kalimat sebelum penutup', buktiTembusan: 'Undangan pembuktian — tembusan', evalPembuka: 'BA hasil evaluasi — pembuka', evalIsi: 'BA hasil evaluasi — kalimat sebelum tabel hasil', evalPenutup: 'BA hasil evaluasi — penutup', lapDasar: 'Laporan — dasar pelaksanaan', lapTindak: 'Laporan — tindak lanjut', lapPenutup: 'Laporan — paragraf penutup', lapTembusan: 'Laporan — tembusan' };
const tx = (k) => (D.tpl[k] != null && D.tpl[k] !== '' ? D.tpl[k] : TX[k]);

const DEF = () => ({
  set: { klas: 'PL.030', unit: 'A.5.3', kota: 'Bogor', kertas: 'A4', zoomTempat: '', zoomLink: '', zoomId: '', zoomPass: '', zona: 'WIB', pejabat: 'Kepala Biro Umum dan Pengadaan', instansi: 'Kementerian Pertanian', penutupMK: 'a.n. Pokja Pemilihan', an: 'a.n. Kelompok Kerja Pemilihan', unitBaris: 'Biro Umum dan Pengadaan', lap1: 'Kelompok Kerja Pemilihan', lap2: 'Biro Umum dan Pengadaan', penutup: 'Demikian, atas perhatian dan kerjasamanya diucapkan terima kasih.', kop1: 'KEMENTERIAN PERTANIAN', kop2: 'SEKRETARIAT JENDERAL', kop3: 'JALAN HARSONO RM NOMOR 3 PASAR MINGGU, JAKARTA 12550\nKOTAK POS 83/1200/PASARMINGGU\nTELEPON (021) 7804116 – 7806131, FAKSIMILI (021) 7816180\nWEBSITE: https://pertanian.go.id', logo: '' },
  pokja: [], paket: [], surat: [], tpl: {}, monitor: [],
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
async function load() { const r = await api('ws'); V = r.v; D = r.data || DEF(); D.set = { ...DEF().set, ...D.set }; D.tpl ||= {}; D.monitor ||= []; if (!r.data) await persist(); }

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
  const nav = [['home', 'Beranda', '⌂'], ['surat', 'Buat Surat', '✉'], ['mon', 'Monitoring', '◔'], ['set', 'Pengaturan', '⚙']];
  $('#app').innerHTML = `<div class=frame><aside class=noprint><div class=prof><span class=av>${esc(ini)}</span><div><b>${esc(U.name)}</b><small>${esc(S().unitBaris)}</small></div></div><input id=gq placeholder="Cari surat atau paket…" value="${esc(hq)}">
  <h6>Utama</h6>${nav.map(([k, n, c]) => `<a data-v=${k} class="${view === k ? 'on' : ''}"><i>${c}</i>${n}</a>`).join('')}
  <h6>Paket</h6>${D.paket.slice(0, 10).map((p) => `<a data-pk=${p.id}><i class=dot></i><span class=cl>${esc(p.nama)}</span></a>`).join('') || '<small style="padding:0 12px;color:#888">Belum ada paket</small>'}
  <h6>Akun</h6><a id=out><i>⇥</i>Keluar</a><small id=st style="padding:6px 12px;color:#888"></small></aside><main class=main id=main></main></div>`;
  document.querySelectorAll('aside [data-v]').forEach((a) => (a.onclick = () => { view = a.dataset.v; shell(); }));
  document.querySelectorAll('aside [data-pk]').forEach((a) => (a.onclick = () => { pe = a.dataset.pk; tab = 'paket'; view = 'set'; shell(); }));
  $('#gq').oninput = (e) => { hq = e.target.value; if (view !== 'home') { view = 'home'; shell(); const g = $('#gq'); g.focus(); g.setSelectionRange(hq.length, hq.length); } else homeList(); };
  $('#out').onclick = async () => { await api('auth?a=logout', 'POST'); U = null; authView(); };
  ({ home: homeView, surat: suratView, mon: monView, set: setView })[view]();
}
function openLetter(l) { L = l; view = 'surat'; shell(); }
function homeList() {
  const q = hq.toLowerCase(), rec = D.surat.slice().sort((a, b) => b.ts - a.ts).filter((s) => !q || (judul(s) + ' ' + s.no).toLowerCase().includes(q)).slice(0, 12);
  $('#rc').innerHTML = rec.map((s) => `<div class=it><b>${esc(TPL[s.tpl].n)}${s.no ? ' · ' + s.no : ''}</b><small>${esc((paketOf(s) || {}).nama || '')}</small><small>Dibuat: ${tgl(s.tgl)} · ${esc(s.by || '')}</small><div><button class="btn s" data-o=${s.id}>Buka</button> <button class="btn s" data-c=${s.id}>Buat lagi</button></div></div>`).join('') || '<p class=muted>Belum ada surat.</p>';
  $('#rc').onclick = (e) => { const o = e.target.dataset.o, c = e.target.dataset.c; if (o) openLetter(JSON.parse(JSON.stringify(D.surat.find((x) => x.id === o)))); if (c) { const x = D.surat.find((y) => y.id === c); openLetter(newLetter(x.tpl, x)); } };
}
function homeView() {
  const now = new Date(), ms = [...Array(6)].map((_, k) => new Date(now.getFullYear(), now.getMonth() - 5 + k, 1));
  const ct = ms.map((d) => D.surat.filter((s) => { const x = pd(s.tgl || today()); return x.getFullYear() === d.getFullYear() && x.getMonth() === d.getMonth(); }).length), mx = Math.max(3, ...ct);
  const pts = ct.map((v, k) => [30 + k * 58, 130 - (v / mx) * 105]);
  const withLap = new Set(D.surat.filter((x) => x.tpl === 'lap').map((x) => x.pid)).size, tot = Math.max(1, D.paket.length), fr = Math.min(1, withLap / tot), C = 2 * Math.PI * 58;
  const fold = [['Paket', 'paket'], ['Daftar Pokja & TTD', 'pokja'], ['Kode surat & rapat', 'kode'], ['Template teks', 'tpl'], ['Data & cadangan', 'cad']];
  $('#main').innerHTML = `<h1>Dokumen</h1><div class=hg><div>
  <div class=cards>${KEYS.map((k) => `<div class=cd><i class=ic>${TPL[k].i}</i><b>${TPL[k].n}</b><p>${TPL[k].d}</p><button class="btn s" data-n=${k}>Buat</button></div>`).join('')}</div>
  <div class=panel><h3>Pintasan</h3><div class=fold>${fold.map(([n, t]) => `<div data-f=${t}><i></i>${n}</div>`).join('')}<div data-m=1><i></i>Monitoring</div></div></div>
  <div class=g2><div class=panel><h3>Surat dibuat per bulan</h3><svg viewBox="0 0 350 160" width=100%><polyline fill=none stroke="#e8884a" stroke-width=2 points="${pts.map((p) => p.join(',')).join(' ')}"/>${pts.map((p, k) => `<line x1=${p[0]} x2=${p[0]} y1=${p[1]} y2=135 stroke="#ddd"/><circle cx=${p[0]} cy=${p[1]} r=5 fill="#fff" stroke="#d6204b" stroke-width=3 /><text x=${p[0]} y=152 font-size=10 text-anchor=middle fill="#666">${BL[ms[k].getMonth()].slice(0, 3)}</text><text x=${p[0]} y=${p[1] - 9} font-size=10 text-anchor=middle>${ct[k]}</text>`).join('')}</svg></div>
  <div class=panel><h3>Paket sudah berlaporan</h3><svg viewBox="0 0 160 160" width=150 style="display:block;margin:auto"><circle cx=80 cy=80 r=58 fill=none stroke="#e8e6e3" stroke-width=16 /><circle cx=80 cy=80 r=58 fill=none stroke="#111" stroke-width=16 stroke-dasharray="${C * fr} ${C}" transform="rotate(-90 80 80)"/><text x=80 y=86 text-anchor=middle font-size=20 font-weight=700>${withLap}/${D.paket.length}</text></svg></div></div></div>
  <div class=panel style="margin-top:0"><h3>Terakhir dibuat</h3><div id=rc></div></div></div>`;
  homeList();
  document.querySelectorAll('#main [data-n]').forEach((b) => (b.onclick = () => openLetter(newLetter(b.dataset.n, { pid: L?.pid }))));
  document.querySelectorAll('#main [data-f]').forEach((b) => (b.onclick = () => { tab = b.dataset.f; view = 'set'; shell(); }));
  $('#main [data-m]').onclick = () => { view = 'mon'; shell(); };
}
function monView() {
  const embed = (v) => ((String(v).match(/src=["']([^"']+)/) || [0, v])[1] || '').trim();
  $('#main').innerHTML = `<h1>Monitoring</h1><div class=panel style="margin-top:0"><div class=g2><div><label>Nama monitoring</label><input id=mn placeholder="mis. Progres paket dolomit"></div><div><label>Tautan Google Sites (atau kode embed)</label><input id=mu placeholder="https://sites.google.com/view/..."></div></div><p><button class="btn p" id=ma>Tambah monitoring</button></p><p class=muted>Pakai situs yang sudah diterbitkan (Google Sites › Terbitkan, akses "Siapa saja"). Jika kotak di bawah kosong, Google/pemilik situs memblokir penyematan; gunakan "Buka di tab baru".</p><div class=err id=me></div></div>
  ${D.monitor.map((x) => `<div class=panel><div class=row style="border:0;padding:0 0 10px"><b style="flex:1">${esc(x.nama)}</b><a class="btn s" href="${esc(x.url)}" target=_blank rel=noopener style="text-decoration:none;color:inherit">Buka di tab baru</a><button class="btn s" data-r=${x.id}>Ubah</button><button class="btn s" data-d=${x.id}>Hapus</button></div><iframe src="${esc(x.url)}" loading=lazy referrerpolicy=no-referrer allowfullscreen style="width:100%;height:72vh;border:1px solid #e3ded8;border-radius:10px;background:#fff"></iframe></div>`).join('') || '<p class=muted>Belum ada monitoring.</p>'}`;
  $('#ma').onclick = () => { const u = embed($('#mu').value), n = $('#mn').value.trim(); if (!n || !/^https:\/\//.test(u)) return ($('#me').textContent = 'Isi nama dan tautan https://'); D.monitor.push({ id: uid(), nama: n, url: u }); dirty(); monView(); };
  $('#main').onclick = (e) => { const t = e.target, m = (id) => D.monitor.find((x) => x.id === id);
    if (t.dataset.d && confirm('Hapus monitoring ini?')) { D.monitor = D.monitor.filter((x) => x.id !== t.dataset.d); dirty(); monView(); }
    if (t.dataset.r) { const x = m(t.dataset.r), n = prompt('Nama', x.nama), u = n && embed(prompt('Tautan', x.url) || ''); if (n && /^https:\/\//.test(u)) { x.nama = n; x.url = u; dirty(); monView(); } } };
}

/* ===== definisi template surat ===== */
const CARA = ['Daring', 'Luring'];
const TPL = {
  reviu: { d: 'Undangan konsolidasi dan reviu dokumen persiapan pengadaan.', i: '✉', n: 'Undangan reviu dokumen persiapan', hal: 'Undangan Konsolidasi dan Reviu {dok} {nama}', f: [{ k: 'tglKeg', l: 'Tanggal kegiatan', t: 'date' }, { k: 'jam', l: 'Mulai (jam)', d: '10.00' }, { k: 'cara', l: 'Cara', t: 'sel', o: CARA, d: 'Daring' }, { k: 'dok', l: 'Dokumen yang direviu', d: 'Spesifikasi Teknis dan HPS' }] },
  dmk: { d: 'Dokumen ketentuan pelaksanaan mini kompetisi e-purchasing.', i: '▤', n: 'Dokumen mini kompetisi', nonum: 1, f: [{ k: 'kat1', l: 'Kategori Tingkat I' }, { k: 'kat2', l: 'Kategori Tingkat II' }, { k: 'kat3', l: 'Kategori Tingkat III' }] },
  ubah: { d: 'Berita acara perpanjangan masa tayang paket.', i: '⟳', n: 'BA perubahan paket kompetisi', f: [{ k: 'semula', l: 'Batas akhir semula', t: 'datetime-local' }, { k: 'baru', l: 'Diperpanjang menjadi', t: 'datetime-local' }] },
  bukti: { d: 'Undangan pembuktian dan klarifikasi kualifikasi penyedia.', i: '✉', n: 'Undangan pembuktian & klarifikasi', hal: 'Undangan Pembuktian dan Klarifikasi Kualifikasi Penyedia', f: [{ k: 'pic', l: 'Kepada Yth. (mis. Bapak …)' }, { k: 'kepada', l: 'Nama penyedia' }, { k: 'tglKeg', l: 'Tanggal', t: 'date' }, { k: 'jam', l: 'Pukul mulai', d: '14.00' }, { k: 'cara', l: 'Cara', t: 'sel', o: CARA, d: 'Daring' }] },
  eval: { d: 'Berita acara hasil evaluasi, peringkat, dan pemenang.', i: '✓', n: 'BA hasil evaluasi', f: [{ k: 'tglEval', l: 'Tanggal evaluasi', t: 'date' }, { k: 'peserta', l: 'Peserta & hasil — satu per baris: nama | nilai penawaran | keterangan (baris 1 = pemenang)', t: 'area' }] },
  lap: { d: 'Laporan hasil pemilihan untuk PPK.', i: '▣', n: 'Laporan hasil pemilihan', hal: 'Laporan Hasil Katalog Elektronik Paket {nama}', f: [{ k: 'mulai', l: 'Penayangan mulai', t: 'datetime-local' }, { k: 'selesai', l: 'Penayangan selesai', t: 'datetime-local' }, { k: 'baNo', l: 'Nomor BA hasil evaluasi (otomatis dari BA)' }, { k: 'baTgl', l: 'Tanggal BA', t: 'date' }, { k: 'tglBukti', l: 'Tanggal pembuktian', t: 'date' }, { k: 'peserta', l: 'Peserta & hasil — nama | nilai | keterangan (otomatis dari BA)', t: 'area' }, { k: 'dataPaket', l: 'Tampilkan tabel Data Paket', t: 'chk', d: true }] },
};
TPL.kk = { n: 'Kertas kerja evaluasi', d: 'Lembar kerja evaluasi kualifikasi, administrasi, teknis dan harga per peserta, bisa lebih dari 1 produk.', i: '☰', nonum: 1, f: [] };
const KEYS = Object.keys(TPL);
const defProd = () => ({ jml: '', sat: 'Kg', hps: '', tot: '', rows: [['Kategori', '', ''], ['KBLI', '', ''], ['Tipe Kategori', 'Barang', 'Barang'], ['Spesifikasi', '', ''], ['Struktur Harga', '', ''], ['Informasi Lainnya', '', '']].map(([l, k, e]) => ({ l, k, e, n: '' })) });
const paketOf = (l) => D.paket.find((p) => p.id === l.pid);
const yr = (l) => String(l.tgl || '').slice(0, 4);
function nextNo(y) { return Math.max(0, ...D.surat.filter((s) => yr(s) === String(y) && TPL[s.tpl] && !TPL[s.tpl].nonum).map((s) => +s.no || 0)) + 1; }
function bulanNo(l) { const m = pd(l.tgl || today()).getMonth() + 1; return l.blnMode === 'lalu' ? (m === 1 ? 12 : m - 1) : m; }
const nomor = (l) => `${l.no || '......'}/${S().klas}/${S().unit}/${bulanNo(l)}/${yr(l)}`;

function newLetter(tpl, from) {
  const t = TPL[tpl], l = { id: uid(), tpl, pid: from?.pid ?? D.paket[D.paket.length - 1]?.id, tgl: today(), kota: tpl === 'lap' || tpl === 'dmk' || tpl === 'kk' ? 'Jakarta' : S().kota, blnMode: 'ikut', scan: true, ang: D.pokja.filter((p) => p.ttd || true).map((p) => p.id), ttd: D.pokja[0]?.id, dataPaket: true, judulTengah: true };
  if (tpl === 'kk') l.prods = [defProd()];
  t.f.forEach((f) => { if (f.d != null) l[f.k] = f.d; });
  if (from) Object.assign(l, JSON.parse(JSON.stringify(from)), { id: l.id, tgl: today(), no: undefined });
  if (!t.nonum) l.no = nextNo(yr(l));
  if (tpl === 'lap') autoLap(l);
  return l;
}
function autoLap(l) {
  const last = (t) => D.surat.filter((s) => s.pid === l.pid && s.tpl === t).sort((a, b) => b.ts - a.ts)[0];
  const e = last('eval'), b = last('bukti');
  if (e) { l.baNo ||= nomor(e); l.baTgl ||= e.tglEval || e.tgl; l.peserta ||= e.peserta; }
  if (b) l.tglBukti ||= b.tglKeg;
}

/* ===== pembuat HTML dokumen ===== */
const kop = () => { const s = S(); return `<div class=kop>${s.logo ? `<img src="${s.logo}">` : ''}<div class=x><b>${esc(s.kop1)}</b><i>${esc(s.kop2)}</i>${nl(s.kop3)}</div></div>`; };
const parsePes = (t) => lines(t).map((x) => { const [nama, nilai, ket] = x.split('|').map((y) => y.trim()); return { nama, nilai: num(nilai), ket: ket || '' }; });
const ol = (arr, cls = '') => `<ol ${cls}>${arr.map((x) => `<li>${x}</li>`).join('')}</ol>`;
const kv = (rows, w = 135) => `<table class=k>${rows.map(([a, b]) => `<tr><td style="width:${w}px">${a}</td><td>:</td><td>${b}</td></tr>`).join('')}</table>`;
const sigImg = (p, w) => (p.ttd ? `<img src="${p.ttd}" style="width:${w ?? p.w ?? 140}pt;max-width:none">` : '');
function vars(l) {
  const p = paketOf(l) || {}, w = parsePes(l.peserta)[0] || {};
  return { nama: p.nama || '......', stNo: p.stNo || '......', stTgl: tgl(p.stTgl), pejabatST: p.pejabatST || S().pejabat, satker: p.satker || '......', baNo: l.baNo || '......', baTgl: tgl(l.baTgl), pemenang: w.nama || '......', dok: l.dok || '......', cara: String(l.cara || 'Daring') === 'Daring' ? 'secara daring' : 'secara luring', hariTgl: l.tglEval ? `${hari(l.tglEval)} tanggal ${tgl(l.tglEval).replace(/^(\d+)/, '$1')}` : '......' };
}
function tempatRows(l) {
  const s = S(), dar = (l.cara || 'Daring') === 'Daring';
  const tempat = dar ? `Zoom Meeting (Meeting ID: ${esc(s.zoomId)}; Passcode: ${esc(s.zoomPass)})` : esc(s.zoomTempat);
  return [['Tempat', tempat]].concat(dar && s.zoomLink ? [['Tautan', `<a href="${esc(s.zoomLink)}" style="color:#0645ad">${esc(s.zoomLink)}</a>`]] : []);
}
const ttdUndang = (l) => { const p = D.pokja.find((x) => x.id === l.ttd) || {}; return `<div class=ttd>${esc(S().an)}<br>${esc(S().unitBaris)}${l.scan !== false && p.ttd ? sigImg(p) : '<br><br><br>'}${esc(p.nama || '')}</div>`; };
const angOf = (l) => (l.ang || []).map((id) => D.pokja.find((p) => p.id === id)).filter(Boolean);
const angTable = (l) => `<table class=b style="margin-top:12px"><tr><th style="width:30px">No</th><th>Nama Anggota Pokja Pemilihan</th><th>Jabatan</th><th>Tanda Tangan</th></tr>${angOf(l).map((p, i) => `<tr><td>${i + 1}</td><td>${esc(p.nama)}${p.nip ? `<br>NIP ${esc(p.nip)}` : ''}</td><td>Anggota Pokja Pemilihan ${i + 1}</td><td style="height:58px;text-align:center;vertical-align:middle">${p.ttd ? `<img src="${p.ttd}" style="max-height:52px;max-width:110px">` : ''}</td></tr>`).join('')}</table>`;
const jt = (l, t) => (l.judulTengah !== false ? `<p class=tc style="margin:0 0 16px;text-decoration:underline">${t}</p>` : '');
const dateLine = (l) => `<p style="text-align:right;margin-bottom:6px">${esc(l.kota)}, ${tgl(l.tgl)}</p>`;
const headTbl = (l, hal, lamp = '-', right = '') => `<table class=hd style="width:100%"><tr><td style="width:70px">Nomor</td><td>:</td><td>${nomor(l)}</td><td style="text-align:right">${right}</td></tr><tr><td>Lampiran</td><td>:</td><td colspan=2>${lamp}</td></tr><tr><td>Hal</td><td>:</td><td colspan=2>${esc(hal)}</td></tr></table>`;
const tembus = (t, v) => `<p style="margin-top:22px;margin-bottom:0">Tembusan Yth.:</p>${ol(lines(fill(t, v)).map(esc))}`;

const R = {
  reviu(l, p, v) {
    const hal = fill(TPL.reviu.hal, v);
    return `${jt(l, 'UNDANGAN')}${headTbl(l, hal, '-', tgl(l.tgl) ? `${esc(l.kota)}, ${tgl(l.tgl)}` : '')}<p style="margin-top:22px;margin-bottom:0">Yth.</p>${ol([esc(p.ppk || 'Pejabat Pembuat Komitmen ' + (p.satker || '')), 'Tim Teknis Kegiatan', esc('Kelompok Kerja Pemilihan Penyedia ' + (p.nama || ''))])}<p style="margin:0">di<br>&nbsp;&nbsp;&nbsp;&nbsp;Tempat</p>
    <p style="margin-top:18px">${esc(fill(tx('reviuIsi'), v))}</p><p>Sehubungan dengan hal tersebut kami mengharapkan kehadiran Saudara pada:</p>
    ${kv([['Hari/Tanggal', `${hari(l.tglKeg)}, ${tgl(l.tglKeg)}`], ['Waktu', `${esc(l.jam)} ${S().zona} – Selesai`], ...tempatRows(l), ['Acara', esc('Pembahasan Konsolidasi dan Reviu ' + (l.dok || ''))]], 100)}
    <p>${esc(S().penutup)}</p>${ttdUndang(l)}`;
  },
  bukti(l, p, v) {
    const hal = TPL.bukti.hal;
    return `${jt(l, 'UNDANGAN')}${headTbl(l, hal, '-', tgl(l.tgl))}<p style="margin:20px 0 0">Yth.<br>${esc(l.pic)}<br>${esc(l.kepada)}<br>di<br>&nbsp;&nbsp;&nbsp;&nbsp;Tempat</p>
    <p style="margin-top:18px">${esc(fill(tx('buktiIsi'), v)).replace(/secara (daring|luring)\.?$/, '<b>secara $1</b>.')}</p><p style="margin-bottom:4px">Sehubungan dengan hal tersebut kami mengharapkan kehadiran Saudara pada:</p>
    ${kv([['Hari/Tanggal', `${hari(l.tglKeg)}, ${tgl(l.tglKeg)}`], ['Waktu', `${esc(l.jam)} ${S().zona} – Selesai`], ...tempatRows(l), ['Acara', 'Rapat Pembuktian dan Klarifikasi Kualifikasi']], 100)}
    <p>${esc(tx('buktiPenutup'))}<br>${esc(S().penutup)}</p>${ttdUndang(l)}${tembus(tx('buktiTembusan'), v)}`;
  },
  eval(l, p, v) {
    const pes = parsePes(l.peserta), hps = num(p.hps);
    return `<p class=tc style="margin:0">BERITA ACARA HASIL EVALUASI<br>MINI KOMPETISI PADA PENGADAAN BARANG</p><p class=tc style="font-weight:400">Nomor: ${nomor(l)}</p>
    <p>${esc(fill(tx('evalPembuka'), v))}</p>
    ${kv([['Nama Paket', esc(p.nama)], ['Metode Pengadaan Mini Kompetisi', `<i>${esc(p.metode || 'Itemized')}</i>`], ['Nama Instansi/Satuan Kerja', esc(`${p.instansi || S().instansi}/${p.satker || ''}`)], ['Nilai Pagu Anggaran', rp(num(p.pagu))], ['Nilai Harga Perkiraan Sendiri (HPS)', rp(hps)], ['Sumber Anggaran', esc(p.sumber)], ['Lokasi Pekerjaan/Pengiriman', esc(p.lokasi)], ['Waktu Pelaksanaan Pekerjaan/ Tanggal Penyelesaian Pekerjaan', tgl(p.waktu)]], 250)}
    <p>${esc(tx('evalIsi'))}</p>
    <table class=b><tr><th style="width:30px">No</th><th>Nama Peserta</th><th>Nilai Penawaran</th><th>Keterangan</th></tr>${pes.map((x, i) => `<tr><td>${i + 1}</td><td>${esc(x.nama)}</td><td>${rp(x.nilai)}${hps && x.nilai ? `<br><small>${((x.nilai / hps) * 100).toFixed(2).replace('.', ',')}% HPS</small>` : ''}</td><td>${esc(x.ket)}${i === 0 ? ' (Pemenang)' : ''}</td></tr>`).join('')}</table>
    <p>Berdasarkan hasil evaluasi tersebut, Pokja Pemilihan menetapkan <b>${esc(pes[0]?.nama || '......')}</b> sebagai pemenang Mini Kompetisi paket ${esc(p.nama)}.</p><p>${esc(tx('evalPenutup'))}</p>${angTable(l)}`;
  },
  ubah(l, p) {
    const d = l.tgl ? pd(l.tgl) : new Date(), th = d.getFullYear();
    const kata = `${hari(l.tgl)} tanggal ${cap(tb(d.getDate()))} bulan ${BL[d.getMonth()]} tahun ${cap(tb(th))} (${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${th})`;
    return `<p class=tc style="margin:0">BERITA ACARA PERUBAHAN PAKET KOMPETISI BARANG</p><p class=tc style="font-weight:400">Nomor: ${nomor(l)}</p>
    <p>Pada hari ini ${kata}, kami Kelompok Kerja (Pokja) Pemilihan ${esc(p.nama)} UKPBJ ${esc(p.instansi || S().instansi)} yang ditetapkan berdasarkan Surat Tugas ${esc(p.pejabatST || S().pejabat)} Nomor: ${esc(p.stNo)} tanggal ${tgl(p.stTgl)} melaksanakan proses <i>E-Purchasing</i> menggunakan metode Mini-Kompetisi untuk paket Kompetisi sebagai berikut:</p>
    ${kv([['Nama Paket Kompetisi', esc(p.nama)], ['Nama Instansi/Satuan Kerja', esc(`${p.instansi || S().instansi} / ${p.satker || ''}`)], ['Nilai Pagu Anggaran', rupiahKata(num(p.pagu))], ['Nilai HPS', rupiahKata(num(p.hps))], ['Sumber Anggaran', esc(`${p.sumber || ''} Tahun Anggaran ${p.tahun || th}`)], ['Lokasi Pekerjaan/Pengiriman', esc(p.lokasi)], ['Jenis Mini Kompetisi', esc('Mini Kompetisi Barang ' + (p.metode || 'Itemized'))], ['Kode RUP', esc(p.rup)], ['Metode Pemilihan', 'E-Purchasing melalui Mini Kompetisi Katalog Elektronik']], 200)}
    <p>Pokja Pemilihan melakukan perubahan paket kompetisi berupa perpanjangan masa tayang, dengan batas akhir semula ${dtm(l.semula)} diperpanjang menjadi ${dtm(l.baru)}.</p><p>Demikian Berita Acara ini dibuat dengan sebenarnya untuk dipergunakan sebagaimana mestinya.</p>${angTable(l)}`;
  },
  lap(l, p, v) {
    const pes = parsePes(l.peserta), hps = num(p.hps);
    return `${jt(l, 'LAPORAN HASIL PEMILIHAN')}${dateLine(l)}<table class=hd><tr><td style="width:70px">Nomor</td><td>:</td><td>${nomor(l)}</td></tr><tr><td>Lampiran</td><td>:</td><td>${esc(l.lamp || '1 (satu) bendel')}</td></tr><tr><td>Perihal</td><td>:</td><td>${esc(fill(TPL.lap.hal, v))}</td></tr></table>
    <p style="margin:20px 0 0">Yth.<br>${esc(p.ppk || 'Pejabat Pembuat Komitmen ' + (p.satker || ''))}<br>${esc(p.satker)}<br>di<br>&nbsp;&nbsp;&nbsp;&nbsp;Tempat</p>
    <p style="margin-top:16px">Bersama ini kami sampaikan hasil mini kompetisi katalog elektronik pada Satuan Kerja ${esc(p.satker)}, sebagai berikut:</p>
    <h4>A.&nbsp; Dasar Pelaksanaan</h4>${ol(lines(fill(tx('lapDasar'), v)).map(esc))}
    ${l.dataPaket !== false ? `<h4>B.&nbsp; Data Paket</h4><table class=b>${[['Kode RUP', p.rup], ['Nama Paket', p.nama], ['Satuan Kerja', p.satker], ['Sumber Dana', p.sumber], ['Nilai Pagu', rp(num(p.pagu))], ['Nilai HPS', rp(hps)], ['Metode / Kontrak', p.metodeKontrak || `Katalog Elektronik – Mini Kompetisi ${p.metode || 'Itemized'}`], ['Lokasi Pekerjaan', p.lokasi], ['Jangka Waktu Pelaksanaan', tgl(p.waktu)]].map(([a, b]) => `<tr><th style="width:36%;text-align:left">${a}</th><td>${esc(b)}</td></tr>`).join('')}</table>` : ''}
    <h4>C.&nbsp; Pelaksanaan Katalog Elektronik</h4>${ol([`Pelaksanaan ${esc(p.nama)} dilaksanakan melalui katalog elektronik mini kompetisi ${esc(p.metode || 'Itemized')}.`, `Penayangan mini kompetisi dilaksanakan mulai ${dtm(l.mulai)} sampai dengan ${dtm(l.selesai)}.`, `Pembuktian dan klarifikasi dilaksanakan pada ${hari(l.tglBukti)}, ${tgl(l.tglBukti)}.`])}
    <h4>D.&nbsp; Hasil Pemilihan</h4><table class=b><tr><th style="width:30px">No</th><th>Nama Peserta</th><th>Nilai Penawaran</th><th>Keterangan</th></tr>${pes.map((x, i) => `<tr><td>${i + 1}</td><td>${esc(x.nama)}</td><td>${rp(x.nilai)}${hps && x.nilai ? `<br><small>${((x.nilai / hps) * 100).toFixed(2).replace('.', ',')}% HPS</small>` : ''}</td><td>${esc(x.ket)}${i === 0 ? ' (Pemenang)' : ''}</td></tr>`).join('')}</table>
    <h4>E.&nbsp; Tindak Lanjut</h4>${ol(lines(fill(tx('lapTindak'), v)).map(esc))}<p>${esc(fill(tx('lapPenutup'), v))}</p>
    <div class=ttd style="margin-left:50%;break-inside:avoid">${esc(S().lap1)}<br>${esc(S().lap2)}</div><table class=b style="margin-top:6px;break-inside:avoid"><tr><th style="width:30px">No</th><th>Nama</th><th>Tanda Tangan</th></tr>${angOf(l).map((a, i) => `<tr><td>${i + 1}</td><td>${esc(a.nama)}${a.nip ? `<br>NIP ${esc(a.nip)}` : ''}</td><td style="height:58px;text-align:center;vertical-align:middle">${a.ttd ? `<img src="${a.ttd}" style="max-height:52px;max-width:110px">` : ''}</td></tr>`).join('')}</table>${tembus(tx('lapTembusan'), v)}`;
  },
  kk(l, p) {
    const U1 = (x) => esc(String(x || '').toUpperCase()), r = (a, b, c, d) => `<tr><td><b>${a}</b></td><td>${b}</td><td>${c}</td><td>${d}</td></tr>`;
    const prods = (l.prods || []).map((q, i) => { const jml = num(q.jml), hps = num(q.hps), tot = num(q.tot), th = jml * hps, n = (x) => Number(x).toLocaleString('id-ID');
      return `<table class="b kk" style="margin-top:12px"><tr><th colspan=4 style="text-align:left;background:#e5e5e5">PRODUK ${i + 1}</th></tr><tr><th style="width:21%">KETERANGAN</th><th style="width:32%">KUALIFIKASI</th><th style="width:32%">EVALUASI</th><th>KETERANGAN</th></tr>${(q.rows || []).map((x) => r(esc(x.l), nl(x.k), nl(x.e), nl(x.n))).join('')}${r('Jumlah', n(jml), n(jml), '')}${r('Satuan', esc(q.sat), esc(q.sat), '')}${r('HPS Produk', rp(hps), jml ? rp(Math.round(tot / jml)) : '......', '')}${r('Total HPS Produk', rp(th), rp(tot), '')}${r('Persentase dengan HPS Produk', '', th ? ((tot / th) * 100).toFixed(2).replace('.', ',') + '%' : '......', '')}</table>`; }).join('');
    return `${kop()}<p class=tc style="margin:0">LEMBAR KERJA EVALUASI KUALIFIKASI, ADMINISTRASI, TEKNIS DAN HARGA</p><p class=tc style="margin:0">${U1(p.nama)}</p><p class=tc style="margin:0 0 14px">SATUAN KERJA ${U1(p.satker)}</p>
    ${kv([['Nama Perusahaan', esc(l.pNama)], ['NPWP', esc(l.pNpwp)], ['No. Telepon', esc(l.pTelp)], ['Email', esc(l.pEmail)], ['Alamat', esc(l.pAlamat)]], 150)}${prods}
    <table class=b style="margin-top:12px;break-inside:avoid"><tr><th style="text-align:left">Apabila Tidak Memenuhi Syarat — ALASAN TOLAK</th></tr><tr><td style="height:40px">${nl(l.alasan)}</td></tr></table>
    <div style="break-inside:avoid;margin-top:18px"><p style="margin:0">${esc(l.kota)}, ${tgl(l.tgl)}</p><p style="margin:0 0 6px">Pokja Pemilihan Barang/Jasa<br>${esc(S().lap2)} - ${esc(S().instansi)}</p><table class=k>${angOf(l).map((a, i) => `<tr><td style="width:24px">${i + 1}</td><td style="width:230px">${esc(a.nama)}</td><td style="width:180px;text-align:center;height:46px;vertical-align:bottom">${a.ttd ? `<img src="${a.ttd}" style="max-height:44px;max-width:150px;display:block;margin:0 auto">` : ''}<div style="border-top:1px dotted #000"></div></td></tr>`).join('')}</table></div>`;
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
    return `<div class=pb><p class=tc style="font-size:16pt;margin:150px 0 0">DOKUMEN MINI KOMPETISI</p><p class=tc style="font-size:13pt;margin-top:2px">E-PURCHASING KATALOG ELEKTRONIK</p>
    <div style="margin-top:90px">${kv([['Nama Kegiatan', esc(p.nama)], ['Jumlah Paket', '1 (satu) paket'], ['Satuan Kerja', esc(p.satker)], ['Sumber Dana', esc(p.sumber)], ['Jenis Pengadaan', esc(p.jenis || 'Barang')], ['Tahun Anggaran', esc(p.tahun || yr(l))]], 150)}</div></div>
    <h4>I.&nbsp; PENDAHULUAN</h4><p>Dokumen ini memuat dokumen persiapan pengadaan dan ketentuan pelaksanaan E-purchasing Katalog Elektronik melalui metode Mini Kompetisi untuk paket Barang sebagaimana tercantum dalam Daftar Paket pada Bab IV huruf A. Penyedia Katalog wajib mempelajari dokumen ini bersama Kerangka Acuan Kerja (KAK)/Spesifikasi Teknis dan Rancangan Surat Pesanan sebelum menyampaikan penawaran. Dengan menyampaikan penawaran, Penyedia Katalog dianggap telah memahami dan menyetujui seluruh ketentuan dalam dokumen ini.</p>
    <h4>II.&nbsp; DASAR HUKUM</h4>${ol(lines(tx('dmkDasar')).map(esc))}
    <h4>III.&nbsp; DOKUMEN PERSIAPAN PENGADAAN</h4><p style="margin-bottom:0">Dokumen persiapan pengadaan untuk paket terdiri atas:</p>${ol(['Kerangka Acuan Kerja (KAK)/Spesifikasi Teknis;', 'Rancangan Surat Pesanan beserta Syarat-Syarat Umum Kontrak (SSUK) dan Syarat-Syarat Khusus Kontrak (SSKK);', 'Berita Acara Hasil Reviu Dokumen Persiapan Pengadaan antara Pokja Pemilihan dan PPK.'])}<p>Dokumen sebagaimana dimaksud di atas merupakan bagian yang tidak terpisahkan dari Dokumen Mini Kompetisi ini.</p>
    <h4>IV.&nbsp; KETENTUAN PELAKSANAAN MINI KOMPETISI</h4><h4>A.&nbsp; DAFTAR PAKET</h4><p>Dokumen ini berlaku untuk paket sebagai berikut:</p><table class=b><tr><th style="width:36px">No</th><th>Nama Paket</th><th style="width:110px">ID RUP</th></tr><tr><td>1</td><td>${esc(p.nama)}</td><td style="text-align:center">${esc(p.rup)}</td></tr></table>
    <p style="margin-bottom:0">Ketentuan untuk paket tersebut:</p>${ol(['Mini Kompetisi dilaksanakan pada aplikasi Katalog Elektronik sesuai ID RUP paket.'])}${o}
    <p>Demikian Dokumen Mini Kompetisi ini disusun untuk dipergunakan sebagaimana mestinya.</p><div class=ttd style="margin-left:55%">${esc(l.kota)}, ${tgl(l.tgl)}<br>${esc(S().penutupMK)}</div>`;
  },
};
function renderLetter(l) {
  const p = paketOf(l);
  if (!p) return '<p style="padding:40px;text-align:center;color:#888">Pilih atau buat paket dulu (Pengaturan › Paket).</p>';
  const body = R[l.tpl](l, p, vars(l));
  return l.tpl === 'dmk' || l.tpl === 'kk' ? body : kop() + body;
}
function judul(l) { const p = paketOf(l) || {}, v = vars(l); return `${(l.tgl || '').replace(/-/g, '')} ${TPL[l.tpl].hal ? fill(TPL[l.tpl].hal, v) : TPL[l.tpl].n + ' ' + (p.nama || '')}`.replace(/[\\/:*?"<>|]/g, '-'); }

/* ===== layar Surat ===== */
const fh = (o, [k, l, t = 'text', op]) => {
  const v = o[k] ?? '', a = `data-k="${k}"`;
  if (t === 'area') return `<label>${l}</label><textarea ${a}>${esc(v)}</textarea>`;
  if (t === 'sel') return `<label>${l}</label><select ${a}>${op.map((x) => `<option ${x === v ? 'selected' : ''}>${esc(x)}</option>`).join('')}</select>`;
  if (t === 'chk') return `<label style="display:flex;gap:8px;align-items:center"><input type=checkbox style="width:auto" ${a} ${v ? 'checked' : ''}>${l}</label>`;
  return `<label>${l}</label><input type="${t}" ${a} value="${esc(v)}">`;
};
const bind = (root, obj, after) => { root.oninput = root.onchange = (e) => { const t = e.target; if (!t.dataset.k) return; obj[t.dataset.k] = t.type === 'checkbox' ? t.checked : t.value; after && after(t); }; };

function suratView() {
  L ||= newLetter('reviu');
  $('#main').innerHTML = '<div class=wrap><div class="form noprint" id=fm></div><div class=prev><div class=sheet id=sh></div></div></div><style id=pg></style>';
  side(); form(); prev();
}
function side() {}
function form() {
  const t = TPL[L.tpl], dup = !t.nonum && D.surat.some((s) => s.id !== L.id && s.tpl && !TPL[s.tpl].nonum && yr(s) === yr(L) && +s.no === +L.no);
  const common = [['no', 'Nomor urut', 'number'], ['tgl', 'Tanggal surat', 'date'], ['kota', 'Kota'], ['blnMode', 'Bulan pada nomor', 'sel', ['ikut', 'lalu']]];
  const sig = L.tpl === 'reviu' || L.tpl === 'bukti';
  L.judulTengah ??= true;
  $('#fm').innerHTML = `<select id=tp style="font-weight:700;font-size:15px">${KEYS.map((k) => `<option value=${k} ${k === L.tpl ? 'selected' : ''}>${TPL[k].n}</option>`).join('')}</select><p class=muted>Data paket dan Pokja terisi otomatis. Yang baru biasanya hanya tanggal, waktu, dan nomor.</p>
  <label>1 · Paket</label><select id=pk>${D.paket.length ? D.paket.map((p) => `<option value="${p.id}" ${p.id === L.pid ? 'selected' : ''}>${esc(p.nama)}</option>`).join('') : '<option value="">(belum ada paket)</option>'}</select>
  ${D.paket.length ? '' : '<p class=err>Tambahkan paket di Pengaturan › Paket.</p>'}
  <label>2 · Isian ${t.n}</label><div id=ff>${t.f.map((f) => fh(L, [f.k, f.l, f.t, f.o])).join('')}${L.tpl === 'kk' ? kkForm() : ''}${['reviu', 'bukti', 'lap'].includes(L.tpl) ? fh(L, ['judulTengah', 'Judul di tengah', 'chk']) : ''}</div>
  <label>3 · Nomor & tanggal</label><div class=g2>${common.map((c) => (c[0] === 'no' && t.nonum ? '' : fh(L, c.slice(0, 1).concat(c.slice(1)))) ).join('')}</div>
  ${t.nonum ? '' : `<p class=muted>Nomor: <b>${nomor(L)}</b> · saran berikutnya: ${nextNo(yr(L))}</p>${dup ? '<p class=err>Nomor ini sudah dipakai surat lain pada tahun yang sama.</p>' : ''}`}
  ${sig ? `<label>Penandatangan</label><select data-k=ttd>${D.pokja.map((p) => `<option value="${p.id}" ${p.id === L.ttd ? 'selected' : ''}>${esc(p.nama)}</option>`).join('')}</select>${fh(L, ['scan', 'Bubuhkan scan tanda tangan', 'chk'])}` : `<label>Anggota Pokja pada tanda tangan</label>${D.pokja.map((p) => `<label style="display:flex;gap:8px;font-weight:400"><input type=checkbox style="width:auto" data-a="${p.id}" ${L.ang.includes(p.id) ? 'checked' : ''}>${esc(p.nama)}${p.ttd ? '' : ' <span class=muted>(belum ada TTD)</span>'}</label>`).join('')}`}
  <div class=bar><button class="btn p" id=pdf>Unduh PDF</button><button class=btn id=sv>Simpan</button></div>`;
  $('#tp').onchange = (e) => { L = newLetter(e.target.value, { pid: L.pid }); form(); prev(); };
  $('#pk').onchange = (e) => { L.pid = e.target.value; if (L.tpl === 'lap') autoLap(L); form(); prev(); };
  const f = $('#fm');
  f.oninput = f.onchange = (e) => {
    const x = e.target;
    if (x.dataset.a) { L.ang = D.pokja.map((p) => p.id).filter((id) => (id === x.dataset.a ? x.checked : L.ang.includes(id))); }
    else if (x.dataset.kk) { const [i, j, k] = x.dataset.kk.split('.'), P = L.prods[+i]; j === 'h' ? (P[k] = x.value) : (P.rows[+j][k] = x.value); }
    else if (x.dataset.k) L[x.dataset.k] = x.type === 'checkbox' ? x.checked : x.type === 'number' ? +x.value : x.value;
    else return;
    prev();
  };
  f.onclick = (e) => {
    const a = e.target.dataset.x; if (!a) return;
    const [c, v] = a.split(':'), [i, j] = String(v).split('.').map(Number), sc = f.scrollTop;
    if (c === 'ap') L.prods.push(defProd()); else if (c === 'dp') L.prods.splice(i, 1); else if (c === 'ar') L.prods[i].rows.push({ l: '', k: '', e: '', n: '' }); else if (c === 'dr') L.prods[i].rows.splice(j, 1);
    form(); $('#fm').scrollTop = sc; prev();
  };
  $('#sv').onclick = () => { saveL(); form(); };
  $('#pdf').onclick = () => { saveL(); const old = document.title; document.title = judul(L); addEventListener('afterprint', () => (document.title = old), { once: true }); print(); };
}
function kkForm() {
  const h = (i, k, l) => `<div><label>${l}</label><input data-kk="${i}.h.${k}" value="${esc(L.prods[i][k])}"></div>`;
  return `<div class=g2>${[['pNama', 'Nama perusahaan'], ['pNpwp', 'NPWP'], ['pTelp', 'No. telepon'], ['pEmail', 'Email']].map((f) => fh(L, f)).join('')}</div>${fh(L, ['pAlamat', 'Alamat', 'area'])}
  ${L.prods.map((p, i) => `<div class=panel style="padding:12px"><div class=row style="border:0;padding:0"><b style="flex:1">Produk ${i + 1}</b>${L.prods.length > 1 ? `<button class="btn s" data-x="dp:${i}">Hapus produk</button>` : ''}</div>
  <table class=kt><tr><th>Keterangan</th><th>Kualifikasi</th><th>Evaluasi</th><th>Ket.</th><th></th></tr>${p.rows.map((r, j) => `<tr><td><input data-kk="${i}.${j}.l" value="${esc(r.l)}"></td><td><textarea data-kk="${i}.${j}.k">${esc(r.k)}</textarea></td><td><textarea data-kk="${i}.${j}.e">${esc(r.e)}</textarea></td><td><textarea data-kk="${i}.${j}.n">${esc(r.n)}</textarea></td><td><button class="btn s" data-x="dr:${i}.${j}">×</button></td></tr>`).join('')}</table>
  <p><button class="btn s" data-x="ar:${i}">+ Tambah baris</button></p><div class=g2>${h(i, 'jml', 'Jumlah')}${h(i, 'sat', 'Satuan')}${h(i, 'hps', 'HPS produk per satuan (angka)')}${h(i, 'tot', 'Total penawaran peserta (angka)')}</div></div>`).join('')}
  <p><button class=btn data-x=ap>+ Tambah produk</button></p>${fh(L, ['alasan', 'Alasan tolak (bila tidak memenuhi syarat)', 'area'])}`;
}
function saveL() {
  L.ts = Date.now(); L.by = U.name;
  const i = D.surat.findIndex((s) => s.id === L.id), c = JSON.parse(JSON.stringify(L));
  i < 0 ? D.surat.push(c) : (D.surat[i] = c); dirty(); side();
}
function prev() {
  const k = S().kertas;
  $('#pg').textContent = `@page{size:${k === 'F4' ? '215mm 330mm' : k === 'Letter' ? 'letter' : 'A4'};margin:20mm 20mm 20mm 25mm}`;
  $('#sh').innerHTML = renderLetter(L);
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
  $('#rs').onchange = async (e) => { try { const j = JSON.parse(await e.target.files[0].text()); if (!j.set || !j.pokja || !j.paket) throw 0; if (!confirm('Timpa semua data saat ini dengan isi cadangan?')) return; D = { ...DEF(), ...j }; await persist(); alert('Data dipulihkan.'); } catch { alert('File cadangan tidak valid.'); } };
}

/* ===== mulai ===== */
(async () => {
  try { U = (await api('auth?a=me')).user; } catch { U = null; }
  U ? start().catch((e) => { $('#app').innerHTML = `<div class=auth><div class=card><p class=err>${esc(e.message)}</p></div></div>`; }) : authView();
})();
