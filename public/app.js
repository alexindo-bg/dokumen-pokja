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
const dtm = (s) => (s ? `${hari(s)}, ${tgl(s)}, pukul ${jam(s)} ${(typeof D !== 'undefined' && D && D.set && D.set.zona) || 'WIB'}` : '......');
const num = (s) => Number(String(s || '').replace(/\D/g, '')) || 0;
const rp = (n) => (n ? 'Rp' + Number(n).toLocaleString('id-ID') + ',00' : '......');
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
  reviuIsi: `Menindaklanjuti Surat Tugas {pejabatST} Nomor {stNo} tanggal {stTgl} tentang Kelompok Kerja Pemilihan {nama}, bersama ini Pokja Pemilihan akan melakukan {kegiatan} paket pekerjaan dimaksud.`,
  evalPembuka: `Pada hari ini {hariTgl}, kami selaku Kelompok Kerja (Pokja) Pemilihan berdasarkan Surat Tugas {pejabatST} Nomor: {stNo} tanggal {stTgl}, pada:`,
  evalIsi: `Dengan ini kami Pokja Pemilihan telah melaksanakan proses evaluasi Mini Kompetisi dengan uraian sebagai berikut:`,
  evalPenutup: `Demikian Berita Acara Hasil Evaluasi Mini Kompetisi dibuat untuk dipergunakan sebagaimana mestinya.`,
  evalSepakatPembuka: `Berdasarkan proses evaluasi yang telah dilakukan, dengan ini Pokja Pemilihan menyatakan dan menyepakati sebagai berikut:`,
  evalSepakat: `Pokja Pemilihan telah melakukan dan menyetujui hasil seluruh proses evaluasi kepada Pelaku Usaha/Penyedia di papan peringkat Mini Kompetisi pada Aplikasi Katalog Elektronik;
Berdasarkan hasil seluruh proses evaluasi sebagaimana tercantum di atas, Pokja Pemilihan menyepakati pemenang Pengadaan Barang pada Mini Kompetisi {metode} yaitu {pemenang}.
Pokja Pemilihan menunjuk dan melimpahkan kewenangan kepada Pokja {akun} untuk melakukan proses Mini Kompetisi pada Aplikasi Katalog Elektronik. Namun, tidak melepaskan segala keputusan dan tanggung jawab setiap anggota Pokja Pemilihan.
Segala keputusan dan tindakan yang disepakati oleh seluruh anggota Pokja Pemilihan pada proses evaluasi sebagaimana diatur di dalam Berita Acara ini merupakan kesepakatan bersama yang sah.
Apabila terdapat perbedaan antara Berita Acara ini dengan hasil dalam Aplikasi Katalog Elektronik, maka yang digunakan adalah informasi dan keputusan yang terdapat dalam Aplikasi Katalog Elektronik. Dalam hal tersebut, maka dokumen berita acara ini dapat disesuaikan.`,
  ubahPembaruan: `Sehubungan dengan perubahan tersebut, Pokja Pemilihan memperbarui Paket Kompetisi sesuai dengan informasi yang telah diubah oleh Pokja Pemilihan.`,
  ubahSepakat: `Segala keputusan dan tindakan yang disepakati oleh seluruh anggota Kelompok Kerja (Pokja) Pemilihan pada proses Perubahan Paket Kompetisi sebagaimana diatur di dalam Berita Acara ini merupakan kesepakatan bersama yang sah.`,
  ubahPenutup: `Demikian Berita Acara Perubahan Paket Kompetisi dibuat untuk dipergunakan sebagaimana mestinya.`,
  batalPembuka: `Pada hari ini {hariTgl}, kami Kelompok Kerja (Pokja) Pemilihan {pokja} UKPBJ {instansi} yang ditetapkan berdasarkan Surat Tugas {pejabatST} Nomor: {stNo} tanggal {stTgl}, melaksanakan proses E-Purchasing menggunakan metode Mini-Kompetisi untuk paket Kompetisi sebagai berikut:`,
  batalTindak: `Sehubungan dengan hal tersebut, Pokja Pemilihan akan melakukan tindak lanjut berupa {tindak} mengacu pada ketentuan yang berlaku.`,
  batalSepakat: `Segala keputusan dan tindakan yang disepakati oleh seluruh anggota Kelompok Kerja (Pokja) Pemilihan pada proses Pembatalan Paket Mini Kompetisi sebagaimana diatur di dalam Berita Acara ini merupakan kesepakatan bersama yang sah.`,
  batalPenutup: `Demikian Berita Acara Pembatalan Mini Kompetisi dibuat dan ditandatangani untuk dipergunakan sebagaimana mestinya.`,
};
const TXL = { evalSepakatPembuka: 'BA hasil evaluasi — pembuka kesepakatan', evalSepakat: 'BA hasil evaluasi — butir kesepakatan (satu per baris; {metode} {pemenang} {akun})', ubahPembaruan: 'BA perubahan — kalimat pembaruan', ubahSepakat: 'BA perubahan — kesepakatan', ubahPenutup: 'BA perubahan — penutup', batalPembuka: 'BA pembatalan — pembuka', batalTindak: 'BA pembatalan — tindak lanjut ({tindak})', batalSepakat: 'BA pembatalan — kesepakatan', batalPenutup: 'BA pembatalan — penutup', dmkDasar: 'DMK — Dasar hukum (satu per baris)', dmkIsi: 'DMK — Isi bab B–H ("# Judul", "- butir", [KATEGORI] = tabel kategori)', reviuIsi: 'Undangan reviu — paragraf pembuka', buktiIsi: 'Undangan pembuktian — paragraf pembuka', buktiPenutup: 'Undangan pembuktian — kalimat sebelum penutup', buktiTembusan: 'Undangan pembuktian — tembusan', evalPembuka: 'BA hasil evaluasi — pembuka', evalIsi: 'BA hasil evaluasi — kalimat sebelum tabel hasil', evalPenutup: 'BA hasil evaluasi — penutup', lapDasar: 'Laporan — dasar pelaksanaan', lapTindak: 'Laporan — tindak lanjut', lapPenutup: 'Laporan — paragraf penutup', lapTembusan: 'Laporan — tembusan' };
const tx = (k) => (D.tpl[k] != null && D.tpl[k] !== '' ? D.tpl[k] : TX[k]);

const DEF = () => ({
  set: { klas: 'PL.030', unit: 'A.5.3', kota: 'Bogor', kertas: 'A4', zoomTempat: '', zoomLink: '', zoomId: '', zoomPass: '', zona: 'WIB', pejabat: 'Kepala Biro Umum dan Pengadaan', instansi: 'Kementerian Pertanian', penutupMK: 'a.n. Pokja Pemilihan', an: 'a.n. Kelompok Kerja Pemilihan', unitBaris: 'Biro Umum dan Pengadaan', lap1: 'Kelompok Kerja Pemilihan', lap2: 'Biro Umum dan Pengadaan', penutup: 'Demikian, atas perhatian dan kerjasamanya diucapkan terima kasih.', kop1: 'KEMENTERIAN PERTANIAN', kop2: 'SEKRETARIAT JENDERAL', kop3: 'JALAN HARSONO RM NOMOR 3 PASAR MINGGU, JAKARTA 12550\nKOTAK POS 83/1200/PASARMINGGU\nTELEPON (021) 7804116 – 7806131, FAKSIMILI (021) 7816180\nWEBSITE: https://pertanian.go.id', logo: '', stUnit: 'Sekretariat Jenderal Kementerian Pertanian', katalogUrl: 'https://katalog.inaproc.id/', last: {} },
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
async function load() { const r = await api('ws'); V = r.v; D = r.data || DEF(); D.set = { ...DEF().set, ...D.set }; D.tpl ||= {}; D.monitor ||= []; if (!D.mpk) { D.mpk = D.wil && D.wil.length ? [{ id: uid(), nama: 'Paket Monitoring', jenis: '', wil: D.wil }] : []; delete D.wil; } D.mpk.forEach((p) => p.wil.forEach((r) => (r.sat ||= 'Kg'))); if (!r.data) await persist(); }

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
let hq = '', sq = '', Lnew = false;
const NAV = [['home', 'Beranda'], ['surat', 'Surat'], ['mon', 'Monitoring'], ['drv', 'Drive'], ['set', 'Pengaturan']];
function shell() {
  const ini = (U.name || '?').split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  $('#app').innerHTML = `<header class="top noprint"><div class=brand><span class=lg></span>Dokumen Pokja</div><nav>${NAV.map(([k, n]) => `<a data-v=${k} class="${view === k ? 'on' : ''}">${n}</a>`).join('')}</nav><span class=sp></span><small id=st></small><span class=av title="${esc(U.name)}">${esc(ini)}</span><a id=out class=lo>Keluar</a></header><main class="main v-${view}" id=main></main>`;
  document.querySelectorAll('.top [data-v]').forEach((a) => (a.onclick = () => { view = a.dataset.v; shell(); }));
  $('#out').onclick = async () => { await api('auth?a=logout', 'POST'); U = null; authView(); };
  ({ home: homeView, surat: suratView, mon: monView, drv: driveView, set: setView })[view]();
}
async function start() { await load(); L = null; view = 'home'; shell(); }
function openLetter(l) { L = norm(l); view = 'surat'; shell(); }
function homeList() {
  const q = hq.toLowerCase(), rec = D.surat.slice().sort((a, b) => b.ts - a.ts).filter((s) => TPL[s.tpl] && (!q || (judul(s) + ' ' + s.no).toLowerCase().includes(q))).slice(0, 40);
  $('#rc').innerHTML = `<table class=ft><tr><th>NAMA</th><th>PAKET</th><th>TANGGAL</th><th>OLEH</th><th></th></tr>${rec.map((s) => `<tr><td><i class=fi>${TPL[s.tpl].i}</i>${esc(TPL[s.tpl].n)}${s.no ? ' · ' + s.no : ''}</td><td class=m>${esc((paketOf(s) || {}).nama || '')}</td><td class=m>${tgl(s.tgl)}</td><td class=m>${esc(s.by || '')}</td><td class=r><a data-o=${s.id}>Buka</a><a data-c=${s.id}>Buat lagi</a></td></tr>`).join('') || '<tr><td colspan=5 class=m>Belum ada surat.</td></tr>'}</table>`;
  $('#rc').onclick = (e) => { const o = e.target.dataset.o, c = e.target.dataset.c; if (o) openLetter(JSON.parse(JSON.stringify(D.surat.find((x) => x.id === o)))); if (c) { const x = D.surat.find((y) => y.id === c); openLetter(newLetter(x.tpl, x)); } };
}
function homeView() {
  $('#main').innerHTML = `<div class=pg-home><div class=head><h1>Beranda</h1><input id=gq placeholder="Cari surat atau paket…" value="${esc(hq)}" style="max-width:300px;margin-left:auto"></div><h6>AKSES CEPAT</h6><div class=cards>${KEYS.map((k, n) => `<div class="cd ${n === 0 ? 'hot' : ''}" data-n=${k}><i class=ic>${TPL[k].i}</i><b>${TPL[k].n}</b><small>${TPL[k].d}</small></div>`).join('')}</div><h6 style="margin-top:22px">SEMUA SURAT</h6><div id=rc></div></div>`;
  homeList();
  $('#gq').oninput = (e) => { hq = e.target.value; homeList(); };
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
const DOKS = ['Spesifikasi Teknis', 'KAK', 'HPS', 'Rancangan Kontrak', 'Dokumen Anggaran', 'Jadwal Pelaksanaan'];
const HASIL = ['Memenuhi', 'Tidak Memenuhi', 'Gugur'];
const JMK = ['Mini Kompetisi Barang Jasa Lainnya Itemized', 'Mini Kompetisi Barang Jasa Lainnya Non Itemized', 'Mini Kompetisi Pekerjaan Konstruksi'];
const ALASAN = ['hanya 1 (satu) peserta yang menyampaikan penawaran', 'tidak ada penawaran yang masuk setelah perpanjangan waktu', 'tidak ada peserta yang memenuhi persyaratan', 'terdapat kesalahan evaluasi/prosedur', 'PPK menolak hasil pemilihan', 'anggaran tidak mencukupi akibat realokasi anggaran'];
const TAHAP = ['evaluasi penawaran', 'pembuktian dan klarifikasi kualifikasi', 'pemasukan penawaran pada masa tayang paket', 'pertimbangan dan penilaian Pokja Pemilihan'];
const TINDAK = ['Mini Kompetisi Ulang', 'E-Purchasing menggunakan metode lain seperti Negosiasi', 'menggunakan metode Pemilihan Penyedia lainnya'];
const TPL = {
  reviu: { i: '✉', n: 'Undangan reviu dokumen persiapan', s: 'Undangan reviu', d: 'Undangan konsolidasi dan reviu dokumen persiapan pengadaan.', fn: '' },
  dmk: { i: '▤', n: 'Dokumen mini kompetisi', s: 'Dokumen mini kompetisi', d: 'Dokumen ketentuan pelaksanaan mini kompetisi e-purchasing.', nonum: 1, fn: 'Dokumen Mini Kompetisi', f: [{ k: 'kat1', l: 'Kategori Tingkat I' }, { k: 'kat2', l: 'Kategori Tingkat II' }, { k: 'kat3', l: 'Kategori Tingkat III' }] },
  ubah: { i: '⟳', n: 'BA perubahan paket kompetisi', s: 'BA perubahan', d: 'Berita acara perubahan paket (perpanjangan masa tayang, dll).', fn: 'BA Perubahan Paket Kompetisi' },
  batal: { i: '✕', n: 'BA pembatalan kompetisi', s: 'BA pembatalan', d: 'Berita acara pembatalan paket mini kompetisi.', fn: 'BA Pembatalan Kompetisi' },
  bukti: { i: '✉', n: 'Undangan pembuktian & klarifikasi', s: 'Undangan pembuktian', d: 'Undangan pembuktian dan klarifikasi kualifikasi penyedia.', fn: '' },
  eval: { i: '✓', n: 'BA hasil evaluasi', s: 'BA hasil evaluasi', d: 'Berita acara hasil evaluasi, peringkat, dan pemenang.', fn: 'Berita Acara Hasil Evaluasi Mini Kompetisi' },
  lap: { i: '▣', n: 'Laporan hasil pemilihan', s: 'Laporan hasil', d: 'Laporan hasil pemilihan untuk PPK.', fn: '' },
  kk: { i: '☰', n: 'Kertas kerja evaluasi', s: 'Kertas kerja', d: 'Lembar kerja evaluasi per peserta, bisa lebih dari 1 produk.', nonum: 1, fn: 'Kertas Kerja Evaluasi', f: [] },
};
const KEYS = Object.keys(TPL);
const defProd = () => ({ jml: '', sat: 'Kg', hps: '', tot: '', rows: [['Kategori', '', ''], ['KBLI', '', ''], ['Tipe Kategori', 'Barang', 'Barang'], ['Spesifikasi', '', ''], ['Struktur Harga', '', ''], ['Informasi Lainnya', '', '']].map(([l, k, e]) => ({ l, k, e, n: '' })) });
const blankPes = () => ({ id: uid(), nama: '', nilai: '', hasil: 'Memenuhi', ket: 'Memenuhi Syarat' });
const paketOf = (l) => D.paket.find((p) => p.id === l.pid);
const yr = (l) => String(l.tgl || '').slice(0, 4);
const lastOf = (pid, t) => D.surat.filter((s) => s.pid === pid && s.tpl === t).sort((a, b) => (b.ts || 0) - (a.ts || 0))[0];
const savedL = (l) => D.surat.find((s) => s.id === l.id);
function lastNo(y) { return D.surat.filter((s) => yr(s) === String(y) && TPL[s.tpl] && !TPL[s.tpl].nonum && +s.no).sort((a, b) => +b.no - +a.no || (b.ts || 0) - (a.ts || 0))[0]; }
function nextNo(y) { return Math.max(0, ...D.surat.filter((s) => yr(s) === String(y) && TPL[s.tpl] && !TPL[s.tpl].nonum).map((s) => +s.no || 0)) + 1; }
function bulanNo(l) { const m = pd(l.tgl || today()).getMonth() + 1; return l.blnMode === 'lalu' ? (m === 1 ? 12 : m - 1) : m; }
const nomorOf = (l) => `${l.no || '......'}/${S().klas}/${S().unit}/${bulanNo(l)}/${yr(l)}`;
const nomor = nomorOf;
const join3 = (a) => (a.length < 2 ? a.join('') : a.length === 2 ? a.join(' dan ') : a.slice(0, -1).join(', ') + ', dan ' + a[a.length - 1]);
const dokStr = (l) => join3([...(l.doks || []), ...String(l.dokLain || '').split(',').map((x) => x.trim()).filter(Boolean)]);
const kegReviu = (l) => `${l.konsol !== false ? 'Konsolidasi dan ' : ''}Reviu ${dokStr(l) || '......'}`;
const kegOf = (l) => (l.keg !== undefined ? l.keg : kegReviu(l));
const pokjaNama = (l, p) => l.pokja || p.pokjaNama || p.nama || '......';
const ppkBase = (p) => (p.ppk || 'Pejabat Pembuat Komitmen').replace(p.satker || '\u0000', '').trim();
const ppkFull = (p) => `${ppkBase(p)} ${p.satker || ''}`.trim();
const zoomOf = (l) => ({ tempat: l.zTempat || S().zoomTempat, link: l.zLink || S().zoomLink, id: l.zId || S().zoomId, pass: l.zPass || S().zoomPass });
const parsePes = (t) => lines(t).map((x) => { const [nama, nilai, ket] = x.split('|').map((y) => y.trim()); return { id: uid(), nama, nilai: String(num(nilai) || ''), hasil: 'Memenuhi', ket: ket || 'Memenuhi Syarat' }; });
const winOf = (it) => { const ps = it.pes.filter((x) => x.nama); return ps.find((x) => x.id === it.win) || ps.find((x) => x.hasil === 'Memenuhi') || ps[0]; };
const evalOf = (l) => (l.tpl === 'eval' ? l : lastOf(l.pid, 'eval'));
function norm(l) {
  l.ang ||= D.pokja.map((p) => p.id); l.noTtd ||= {};
  if (l.tpl === 'eval' && !l.items) l.items = [{ id: uid(), nama: '', pes: parsePes(l.peserta) }];
  if (l.tpl === 'ubah' && !l.chg) l.chg = [{ id: uid(), t: 'perp', semula: l.semula || '', baru: l.baru || '' }];
  if (l.tpl === 'bukti' && l.pic && l.direktur === undefined) { const m = String(l.pic).match(/^(Bapak|Ibu|Saudara)\s+(.*)$/i); l.sapaan = m ? m[1] : 'Bapak'; l.direktur = m ? m[2] : l.pic; }
  if (l.tpl === 'reviu' && !l.doks) { l.doks = []; if (l.dok) l.dokLain = l.dok; }
  if (l.tpl === 'batal') { l.alasanPil ||= []; }
  return l;
}
const INIT = {
  reviu: (l) => Object.assign(l, { tglKeg: '', jam: '10.00', cara: 'Daring', doks: ['Spesifikasi Teknis', 'HPS'], konsol: true, rcpt: { ppk: true, tim: true, pokja: true }, tglPos: 'auto' }),
  bukti: (l) => Object.assign(l, { tglKeg: '', jam: '14.00', cara: 'Daring', kepada: '', sapaan: 'Bapak', direktur: '', di: 'Tempat', tglPos: 'auto' }),
  eval: (l) => Object.assign(l, { tglEval: today(), items: [{ id: uid(), nama: '', pes: [blankPes()] }], akun: D.pokja[0]?.id }),
  ubah: (l) => Object.assign(l, { chg: [{ id: uid(), t: 'perp', semula: '', baru: '' }] }),
  batal: (l) => Object.assign(l, { tahap: TAHAP[0], tindak: TINDAK[0], alasanPil: [], alasan: '', jmk: '' }),
  lap: (l) => Object.assign(l, { mulai: '', selesai: '', hanyaMenang: true, halNo: true }),
  kk: (l) => (l.prods = [defProd()]),
};
function newLetter(tpl, from) {
  const t = TPL[tpl], pid = from?.pid ?? D.paket[D.paket.length - 1]?.id;
  const l = { id: uid(), tpl, pid, tgl: today(), kota: tpl === 'lap' || tpl === 'dmk' || tpl === 'kk' ? 'Jakarta' : S().kota, blnMode: 'ikut', scan: true, ang: D.pokja.map((p) => p.id), noTtd: {}, ttd: D.pokja[0]?.id, dataPaket: true, judulTengah: false };
  (t.f || []).forEach((f) => { if (f.d != null) l[f.k] = f.d; });
  INIT[tpl] && INIT[tpl](l);
  const mem = (S().last || {})[tpl]; if (mem) Object.assign(l, JSON.parse(JSON.stringify(mem)));
  if (from && from.tpl === tpl && from.id) Object.assign(l, JSON.parse(JSON.stringify(from)), { id: l.id, tgl: today(), no: undefined, ts: undefined, by: undefined });
  if (!t.nonum) l.no = nextNo(yr(l));
  return norm(l);
}
function vars(l) {
  const p = paketOf(l) || {}, ev = evalOf(l), w = ev && ev.items ? winOf(ev.items[0]) : null, a = D.pokja.find((x) => x.id === (ev || l).akun) || D.pokja[0] || {};
  const d = pd(l.tglEval || l.tgl || today());
  return { nama: p.nama || '......', stNo: p.stNo || '......', stTgl: tgl(p.stTgl), pejabatST: p.pejabatST || S().pejabat, satker: p.satker || '......', instansi: p.instansi || S().instansi, baNo: l.baNo || (ev ? nomorOf(ev) : '......'), baTgl: tgl(l.baTgl || (ev && (ev.tglEval || ev.tgl))), pemenang: w ? w.nama : '......', dok: dokStr(l) || l.dok || '......', kegiatan: kegOf(l), cara: String(l.cara || 'Daring') === 'Daring' ? 'secara daring' : 'secara luring', hariTgl: `${hari(l.tglEval || l.tgl)} tanggal ${d.getDate()} bulan ${BL[d.getMonth()]} tahun ${d.getFullYear()}`, metode: p.metode || 'Itemized', akun: a.nama || '......', pokja: pokjaNama(l, p), tindak: l.tindak || '......' };
}
/* nilai otomatis (bisa ditimpa pengguna; undefined = otomatis, '' = sengaja dikosongkan) */
function AUTO(l) {
  const p = paketOf(l) || {}, v = vars(l), a = { penutup: S().penutup, an: S().an, unitBaris: S().unitBaris, lamp: '-', tembusan: '', extra: '' };
  if (l.tpl === 'reviu') a.keg = kegReviu(l);
  if (l.tpl === 'reviu') a.hal = `Undangan ${kegOf(l)} ${p.nama || '......'}`;
  if (l.tpl === 'bukti') { a.hal = 'Undangan Pembuktian dan Klarifikasi Kualifikasi Penyedia'; a.minta = tx('buktiPenutup'); a.tembusan = fill(tx('buktiTembusan'), v); }
  if (l.tpl === 'lap') { a.lamp = '1 (satu) bendel'; a.hal = `Laporan Hasil Katalog Elektronik Paket ${p.nama || '......'}`; a.tembusan = fill(tx('lapTembusan'), v); a.dasar = fill(tx('lapDasar'), v); a.pel = lapPel(l, p, v).join('\n'); a.tindakL = fill(tx('lapTindak'), v); a.penutupL = fill(tx('lapPenutup'), v); a.lap1 = S().lap1; a.lap2 = S().lap2; }
  return a;
}
const Vg = (l, k) => (l[k] !== undefined ? l[k] : AUTO(l)[k]);
/* isian yang masih kosong, ditampilkan sebagai tautan cepat */
function need(l) {
  const n = [], z = (k, t) => { if (l[k] === undefined || l[k] === '' || l[k] === null) n.push([k, t]); };
  if (!TPL[l.tpl].nonum) z('no', 'Nomor urut');
  if (l.tpl === 'reviu') { z('tglKeg', 'Tanggal kegiatan'); if (!dokStr(l)) n.push(['dokLain', 'Dokumen']); }
  if (l.tpl === 'bukti') { z('kepada', 'Nama penyedia'); z('direktur', 'Nama direktur'); z('tglKeg', 'Tanggal'); }
  if (l.tpl === 'eval' && !l.items.some((it) => it.pes.some((x) => x.nama && num(x.nilai)))) n.push(['pes', 'Peserta & nilai']);
  if (l.tpl === 'ubah' && l.chg.some((c) => c.t === 'perp' && (!c.semula || !c.baru))) n.push(['chg', 'Tanggal perpanjangan']);
  if (l.tpl === 'batal') { if (!(l.alasanPil || []).length && !l.alasan) n.push(['alasan', 'Alasan pembatalan']); }
  if (l.tpl === 'lap') { z('mulai', 'Mulai tayang'); { const ub = lastOf(l.pid, 'ubah'); if (!(ub && ub.chg && ub.chg.some((c) => c.t === 'perp' && c.baru))) z('selesai', 'Selesai tayang'); } if (!evalOf(l)) n.push(['baNo', 'BA hasil evaluasi']); }
  return n;
}

/* ===== pembuat HTML dokumen ===== */
const kop = () => { const s = S(); return `<div class=kop>${s.logo ? `<img src="${s.logo}">` : ''}<div class=x><b>${esc(s.kop1)}</b><i>${esc(s.kop2)}</i>${nl(s.kop3)}</div></div>`; };
const linkify = (h) => h.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" style="color:#0645ad">$1</a>');
const ol = (arr, cls = '', st = 1) => `<ol ${cls} ${st > 1 ? `start=${st}` : ''}>${arr.map((x) => `<li>${x}</li>`).join('')}</ol>`;
const kv = (rows, w = 135) => `<table class=k>${rows.map(([a, b]) => `<tr><td style="width:${w}px">${a}</td><td>:</td><td>${b}</td></tr>`).join('')}</table>`;
const sigImg = (p, w) => (p.ttd ? `<img src="${p.ttd}" style="width:${w ?? p.w ?? 140}pt;max-width:none">` : '');
/* teks berbutir: satu butir per baris, "- " = sub-butir, [TABEL] = sisipkan tabel */
function olLines(text, tabel = '', fn = (x) => linkify(esc(x))) {
  let o = '', cur = null, n = 0;
  const flush = () => { if (cur) { o += `<ol ${n - cur.length > 0 ? `start=${n - cur.length + 1}` : ''}>${cur.map((x) => `<li>${x.t}${x.s.length ? `<ol type=a>${x.s.map((y) => `<li>${y}</li>`).join('')}</ol>` : ''}</li>`).join('')}</ol>`; cur = null; } };
  for (const raw of String(text || '').split('\n')) {
    const t = raw.trim(); if (!t) continue;
    if (t === '[TABEL]') { flush(); o += tabel; continue; }
    if (t.startsWith('- ') && cur && cur.length) { cur[cur.length - 1].s.push(fn(t.slice(2))); continue; }
    (cur ||= []).push({ t: fn(t), s: [] }); n++;
  }
  flush(); return o;
}
const jt = (l, t) => (l.judulTengah ? `<p class=tc style="margin:0 0 16px;text-decoration:underline">${t}</p>` : '');
const tpos = (l, def) => (l.tglPos && l.tglPos !== 'auto' ? l.tglPos : def);
const tglTop = (l, def) => (tpos(l, def) === 'atas' ? `<p style="text-align:right;margin:0 0 6px">${esc(l.kota)}, ${tgl(l.tgl)}</p>` : '');
const tglRight = (l, def) => (tpos(l, def) === 'sebaris' ? (l.tpl === 'bukti' ? '' : esc(l.kota) + ', ') + tgl(l.tgl) : '');
const headTbl = (l, hal, lamp, right = '', lab = 'Hal') => `<table class=hd style="width:100%"><tr><td style="width:70px">Nomor</td><td>:</td><td>${nomorOf(l)}</td><td style="text-align:right">${right}</td></tr><tr><td>Lampiran</td><td>:</td><td colspan=2>${esc(lamp)}</td></tr><tr><td>${lab}</td><td>:</td><td colspan=2>${esc(hal)}</td></tr></table>`;
const tembus = (t) => (String(t || '').trim() ? `<p style="margin-top:22px;margin-bottom:0;break-after:avoid">Tembusan Yth.:</p>${ol(lines(t).map(esc))}` : '');
const angOf = (l) => (l.ang || []).map((id) => D.pokja.find((p) => p.id === id)).filter(Boolean);
const sigCell = (l, a, mh = 52) => (a.ttd && !(l.noTtd || {})[a.id] ? `<img src="${a.ttd}" style="max-height:${mh}px;max-width:110px">` : '');
const angTable = (l, o = {}) => `<table class=b style="margin-top:12px;break-inside:avoid"><tr><th style="width:30px">No</th><th>Nama Anggota Pokja Pemilihan</th><th>Jabatan</th><th>Tanda Tangan</th></tr>${angOf(l).map((p, i) => `<tr><td>${i + 1}.</td><td>${esc(p.nama)}${p.nip ? `<br>${o.nipLab || 'NIP'} ${esc(p.nip)}` : ''}</td><td>Anggota Pokja Pemilihan${o.nonum ? '' : ' ' + (i + 1)}</td><td style="height:58px;text-align:center;vertical-align:middle">${sigCell(l, p)}</td></tr>`).join('')}</table>`;
const ttdUndang = (l) => { const p = D.pokja.find((x) => x.id === l.ttd) || {}, nm = esc(p.nama || ''); return `<div class=ttd>${esc(Vg(l, 'an'))}<br>${esc(Vg(l, 'unitBaris'))}${l.scan !== false && p.ttd ? sigImg(p) : '<br><br><br>'}${l.garis ? `<u>${nm}</u>` : nm}</div>`; };
function tempatRows(l) {
  const z = zoomOf(l), dar = (l.cara || 'Daring') === 'Daring';
  const tempat = dar ? `Zoom Meeting (Meeting ID: ${esc(z.id)}; Passcode: ${esc(z.pass)})` : esc(z.tempat);
  return [['Tempat', tempat]].concat(dar && z.link ? [['Tautan', `<a href="${esc(z.link)}" style="color:#0645ad">${esc(z.link)}</a>`]] : []);
}
const hariTgl2 = (s) => (s ? `${hari(s)}, ${tgl(s)}` : '…………');
const instSatker = (p, sp = ' / ') => esc(`${p.instansi || S().instansi}${sp}${p.satker || ''}`);
const kodeRows = (p) => [p.kodeAng ? ['Kode Anggaran', esc(p.kodeAng)] : null, p.kodeSatker ? ['Kode Satker', esc(p.kodeSatker)] : null].filter(Boolean);
/* tabel hasil peserta (BA hasil evaluasi & laporan) */
function pesTable(items, only, mark) {
  return items.map((it, k) => {
    const w = winOf(it), rows = it.pes.filter((x) => x.nama && (!only || x === w));
    return `${items.length > 1 ? `<p style="margin:10px 0 4px;break-after:avoid"><b>${esc(it.nama || 'Item ' + (k + 1))}</b></p>` : ''}<table class=b style="break-inside:avoid;margin-top:${items.length > 1 ? 0 : 6}px"><tr><th style="width:30px">No</th><th>Nama Peserta</th><th>Nilai Penawaran</th><th>Hasil</th><th>Keterangan</th></tr>${rows.map((x, i) => `<tr><td style="text-align:center">${only ? 1 : i + 1}</td><td>${esc(x.nama)}</td><td style="text-align:right;white-space:nowrap">${rp(num(x.nilai))}</td><td>${esc(x.hasil)}</td><td>${esc(x.ket)}${mark && x === w ? ' (Pemenang)' : ''}</td></tr>`).join('') || '<tr><td colspan=5>......</td></tr>'}</table>`;
  }).join('');
}
const winText = (items) => items.length > 1 ? items.map((it, k) => { const w = winOf(it); return `${it.nama || 'Item ' + (k + 1)}: ${w ? w.nama + ' (' + rp(num(w.nilai)) + ')' : '......'}`; }).join('; ') : (() => { const w = winOf(items[0]); return w ? `${w.nama} dengan nilai penawaran ${rp(num(w.nilai))}` : '......'; })();
function lapPel(l, p, v) {
  const ev = evalOf(l), ub = lastOf(l.pid, 'ubah'), bk = lastOf(l.pid, 'bukti'), perp = ub && ub.chg && ub.chg.find((c) => c.t === 'perp' && c.baru);
  const it = ev && ev.items ? ev.items[0] : null, n = it ? it.pes.filter((x) => x.nama).length : 0, w = it ? winOf(it) : null, rank = w ? it.pes.filter((x) => x.nama).indexOf(w) + 1 : 1;
  const baNo = l.baNo || (ev ? nomorOf(ev) : '......'), baTgl = tgl(l.baTgl || (ev && (ev.tglEval || ev.tgl))), tb2 = l.tglBukti || (bk && bk.tglKeg), sel = l.selesai || (perp && perp.baru) || '';
  const out = [`Pelaksanaan ${p.nama || '......'} dilaksanakan melalui katalog elektronik mini kompetisi ${p.metode || 'Itemized'}, kontrak ${p.kontrak || 'harga satuan'}.`, `Penayangan mini kompetisi pada ${S().katalogUrl} dilaksanakan mulai ${dtm(l.mulai)} sampai dengan ${dtm(sel)}.`];
  if (perp) out.push(`Batas akhir masa tayang (pemasukan penawaran) diperpanjang sampai dengan ${dtm(perp.baru)} sesuai Berita Acara Perubahan Paket Kompetisi Nomor ${nomorOf(ub)} tanggal ${tgl(ub.tgl)}.`);
  out.push(`Dari ${n ? `${n} (${tb(n)})` : '......'} penawaran pada papan peringkat mini kompetisi, hasil evaluasi penawaran (administrasi, kualifikasi, teknis, dan harga) dituangkan dalam Berita Acara Hasil Evaluasi Mini Kompetisi Nomor ${baNo} tanggal ${baTgl}.`);
  out.push(`Klarifikasi dan pembuktian kualifikasi terhadap ${w ? w.nama : '......'} (peringkat ke-${rank} pada papan peringkat mini kompetisi) dilaksanakan pada ${tb2 ? hari(tb2) + ', ' + tgl(tb2) : '......'} ${bk && bk.cara === 'Luring' ? 'secara luring' : 'melalui Zoom Meeting'}, dengan nilai penawaran ${w ? rp(num(w.nilai)) : '......'}.`);
  return out;
}

const R = {
  reviu(l, p, v) {
    const hal = Vg(l, 'hal'), keg = kegOf(l), rc = [];
    if (l.rcpt?.ppk !== false) rc.push(esc(ppkFull(p))); if (l.rcpt?.tim !== false) rc.push('Tim Teknis Kegiatan'); if (l.rcpt?.pokja !== false) rc.push(esc('Kelompok Kerja Pemilihan Penyedia ' + (p.nama || '')));
    lines(l.rcptLain).forEach((x) => rc.push(esc(x)));
    return `${jt(l, 'UNDANGAN')}${tglTop(l, 'atas')}${headTbl(l, hal, Vg(l, 'lamp'), tglRight(l, 'atas'))}<p style="margin-top:22px;margin-bottom:0">Yth.</p>${rc.length > 1 ? ol(rc) : `<p style="margin:0">${rc[0] || ''}</p>`}<p style="margin:0">di<br>&nbsp;&nbsp;&nbsp;&nbsp;Tempat</p>
    <p style="margin-top:18px">${esc(fill(tx('reviuIsi'), v))}</p>${Vg(l, 'extra') ? `<p>${nl(Vg(l, 'extra'))}</p>` : ''}<p style="margin-bottom:4px">Sehubungan dengan hal tersebut kami mengharapkan kehadiran Saudara pada:</p>
    ${kv([['Hari/Tanggal', hariTgl2(l.tglKeg)], ['Waktu', `${esc(l.jam)} ${S().zona} – Selesai`], ...tempatRows(l), ['Acara', esc(`Pembahasan ${keg} ${p.nama || ''}`)]], 100)}
    <p>${esc(Vg(l, 'penutup'))}</p>${ttdUndang(l)}${tembus(Vg(l, 'tembusan'))}`;
  },
  bukti(l, p, v) {
    const pic = `${l.sapaan || ''} ${l.direktur || ''}`.trim() || l.pic || '';
    return `${jt(l, 'UNDANGAN')}${tglTop(l, 'sebaris')}${headTbl(l, Vg(l, 'hal'), Vg(l, 'lamp'), tglRight(l, 'sebaris'))}<p style="margin:20px 0 0">Yth.<br>${esc(pic)}<br>${esc(l.kepada)}<br>di<br>&nbsp;&nbsp;&nbsp;&nbsp;${esc(l.di || 'Tempat')}</p>
    <p style="margin-top:18px">${esc(fill(tx('buktiIsi'), v)).replace(/secara (daring|luring)\.?$/, '<b>secara $1</b>.')}</p><p style="margin-bottom:4px">Sehubungan dengan hal tersebut kami mengharapkan kehadiran Saudara pada:</p>
    ${kv([['Hari/Tanggal', hariTgl2(l.tglKeg)], ['Waktu', `${esc(l.jam)} ${S().zona} – Selesai`], ...tempatRows(l), ['Acara', 'Rapat Pembuktian dan Klarifikasi Kualifikasi']], 100)}
    <p>${Vg(l, 'minta') ? esc(Vg(l, 'minta')) + '<br>' : ''}${esc(Vg(l, 'penutup'))}</p>${ttdUndang(l)}${tembus(Vg(l, 'tembusan'))}`;
  },
  eval(l, p, v) {
    const items = l.items, sep = lines(tx('evalSepakat')).map((x) => esc(fill(x, { ...v, pemenang: winText(items) })).replace(/Mini Kompetisi (Itemized|Total)/, 'Mini Kompetisi <i>$1</i>'));
    return `<p class=tc style="margin:0">BERITA ACARA HASIL EVALUASI<br>MINI KOMPETISI PADA PENGADAAN BARANG</p><p class=tc style="font-weight:400">Nomor: ${nomorOf(l)}</p>
    <p>${esc(fill(tx('evalPembuka'), v))}</p>
    ${kv([['Nama Paket', esc(p.nama)], ['Metode Pengadaan Mini Kompetisi', `<i>${esc(p.metode || 'Itemized')}</i>`], ['Nama Instansi/Satuan Kerja', instSatker(p, '/')], ['Nilai Pagu Anggaran', rp(num(p.pagu))], ['Nilai Harga Perkiraan Sendiri (HPS)', rp(num(p.hps))], ['Sumber Anggaran', esc(p.sumber)], ['Lokasi Pekerjaan/Pengiriman', esc(p.lokasi)], ['Waktu Pelaksanaan Pekerjaan/ Tanggal Penyelesaian Pekerjaan', tgl(p.waktu)]], 250)}
    <p>${esc(tx('evalIsi'))}</p>${pesTable(items, false, true)}
    <p style="margin-top:14px;margin-bottom:0">${esc(tx('evalSepakatPembuka'))}</p>${ol(sep)}<p>${esc(tx('evalPenutup'))}</p>${angTable(l)}`;
  },
  ubah(l, p, v) {
    const d = l.tgl ? pd(l.tgl) : new Date(), th = d.getFullYear();
    const kata = `${hari(l.tgl)} tanggal ${cap(tb(d.getDate()))} bulan ${BL[d.getMonth()]} tahun ${cap(tb(th))} (${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${th})`;
    const sent = (c) => (c.t === 'perp' ? `perpanjangan masa tayang, dengan batas akhir semula ${dtm(c.semula)} diperpanjang menjadi ${dtm(c.baru)}` : `${esc(c.label || 'perubahan lain')}${c.dari || c.menjadi ? `, dari ${esc(c.dari)} menjadi ${esc(c.menjadi)}` : ''}${c.ket ? `; ${esc(c.ket)}` : ''}`);
    const ch = l.chg.map(sent);
    return `<p class=tc style="margin:0">BERITA ACARA PERUBAHAN PAKET KOMPETISI BARANG</p><p class=tc style="font-weight:400">Nomor: ${nomorOf(l)}</p>
    <p>Pada hari ini ${kata}, kami Kelompok Kerja (Pokja) Pemilihan ${esc(pokjaNama(l, p))} UKPBJ ${esc(p.instansi || S().instansi)} yang ditetapkan berdasarkan Surat Tugas ${esc(p.pejabatST || S().pejabat)} ${esc(S().stUnit || '')} Nomor: ${esc(p.stNo)} tanggal ${tgl(p.stTgl)} melaksanakan proses <i>E-Purchasing</i> menggunakan metode Mini-Kompetisi untuk paket Kompetisi sebagai berikut:</p>
    ${kv([['Nama Paket Kompetisi', esc(p.nama)], ['Nama Instansi/Satuan Kerja', instSatker(p)], ['Nilai Pagu Anggaran', rupiahKata(num(p.pagu))], ['Nilai HPS', rupiahKata(num(p.hps))], ['Sumber Anggaran', esc(`${p.sumber || ''} Tahun Anggaran ${p.tahun || th}`)], ['Lokasi Pekerjaan/Pengiriman', esc(p.lokasi)], ['Jenis Mini Kompetisi', esc(l.jmk || `Mini Kompetisi ${p.jenis || 'Barang'} ${p.metode || 'Itemized'}`)], ['Kode RUP', esc(p.rup)], ...kodeRows(p), ['Metode Pemilihan', 'E-Purchasing melalui Mini Kompetisi Katalog Elektronik']], 200)}
    ${ch.length > 1 ? `<p style="margin-bottom:0">Pokja Pemilihan melakukan perubahan paket kompetisi sebagai berikut:</p>${ol(ch)}` : `<p>Pokja Pemilihan melakukan perubahan paket kompetisi berupa ${ch[0] || '......'}.</p>`}
    <p>${esc(tx('ubahPembaruan'))}</p><p>${esc(tx('ubahSepakat'))}</p><p>${esc(tx('ubahPenutup'))}</p><p class=tc style="margin:18px 0 0;break-after:avoid">Pokja Pemilihan ${esc(pokjaNama(l, p))}</p>${angTable(l, { nonum: true })}`;
  },
  batal(l, p, v) {
    const jenis = String(p.jenis || 'Barang').toUpperCase(), al = [...(l.alasanPil || []), l.alasan].map((x) => String(x || '').trim()).filter(Boolean);
    const alasan = al.length > 1 ? al.map((x, i) => `(${i + 1}) ${x}`).join('; ') : al[0] || '......';
    const jm = l.jmk || `Mini Kompetisi ${p.jenis || 'Barang'} ${p.metode || 'Itemized'}`;
    return `<p class=tc style="margin:0">BERITA ACARA PEMBATALAN KOMPETISI ${esc(jenis)}<br>(POKJA PEMILIHAN)</p><p class=tc style="font-weight:400">Nomor: ${nomorOf(l)}</p>
    <p>${esc(fill(tx('batalPembuka'), v))}</p>
    ${kv([['Nama Paket Kompetisi', esc(p.nama)], ['Nama Instansi/Satuan Kerja', instSatker(p)], ['Nilai Pagu Anggaran', rupiahKata(num(p.pagu))], ['Nilai HPS', rupiahKata(num(p.hps))], ['Sumber Anggaran', esc(`${p.sumber || ''}${p.tahun ? ' Tahun Anggaran ' + p.tahun : ''}`)], ['Lokasi Pekerjaan/Pengiriman', esc(p.lokasi)], ['Jenis Mini Kompetisi', esc(jm)], ...(l.infoLain ? [['Informasi Lain', nl(l.infoLain)]] : [])], 200)}
    <p>Berdasarkan hasil ${esc(l.tahap || '......')}, Pokja Pemilihan ${esc(pokjaNama(l, p))} memutuskan bahwa Paket Mini Kompetisi ${esc(p.nama)} <b>dilakukan Pembatalan Kompetisi dengan alasan</b> ${esc(alasan)}.</p>
    <p>${esc(fill(tx('batalTindak'), v))}</p><p>${esc(tx('batalSepakat'))}</p><p>${esc(tx('batalPenutup'))}</p><p class=tc style="margin:18px 0 0;break-after:avoid">Pokja Pemilihan ${esc(pokjaNama(l, p))}</p>${angTable(l, { nipLab: 'NIP/NIK/Nomor Kepegawaian:' })}`;
  },
  lap(l, p, v) {
    const ev = evalOf(l), items = ev && ev.items ? ev.items : [{ id: 'x', nama: '', pes: [] }], hps = num(p.hps), w0 = winOf(items[0]);
    const tabel = pesTable(items, l.hanyaMenang !== false, false), ABC = 'ABCDEFGH'; let k = 0; const H = (t) => `<h4>${ABC[k++]}.&nbsp; ${t}</h4>`;
    const win = items.length > 1 ? `<p style="margin-bottom:0">Berdasarkan hasil evaluasi dan pembuktian kualifikasi, Pokja Pemilihan menetapkan pemenang Mini Kompetisi per item sebagai berikut:</p>${ol(items.map((it, i) => { const w = winOf(it); return `<b>${esc(it.nama || 'Item ' + (i + 1))}: ${esc(w ? w.nama : '......')} dengan nilai penawaran ${rp(num(w && w.nilai))}</b>`; }))}<p>Sebagaimana dituangkan dalam Berita Acara Hasil Evaluasi Mini Kompetisi Nomor ${esc(v.baNo)} tanggal ${v.baTgl}.</p>`
      : `<p>Berdasarkan hasil evaluasi dan pembuktian kualifikasi, Pokja Pemilihan menetapkan pemenang Mini Kompetisi yaitu <b>${esc(w0 ? w0.nama : '......')} dengan nilai penawaran ${rp(num(w0 && w0.nilai))}${w0 && num(w0.nilai) ? ` (${tb(num(w0.nilai))} rupiah)` : ''},</b> sebagaimana dituangkan dalam Berita Acara Hasil Evaluasi Mini Kompetisi Nomor ${esc(v.baNo)} tanggal ${v.baTgl}.</p>`;
    const ppkL = esc(ppkBase(p));
    return `${jt(l, 'LAPORAN HASIL PEMILIHAN')}<p style="text-align:right;margin:0 0 6px">${esc(l.kota)}, ${tgl(l.tgl)}</p><table class=hd><tr><td style="width:70px">Nomor</td><td>:</td><td>${nomorOf(l)}</td></tr><tr><td>Lampiran</td><td>:</td><td>${esc(Vg(l, 'lamp'))}</td></tr><tr><td>Perihal</td><td>:</td><td>${esc(Vg(l, 'hal'))}</td></tr></table>
    <p style="margin:20px 0 0">Yth.<br>${ppkL}<br>${esc(p.satker)}<br>di<br>&nbsp;&nbsp;&nbsp;&nbsp;Tempat</p>
    <p style="margin-top:16px">Bersama ini kami sampaikan hasil mini kompetisi katalog elektronik pada Satuan Kerja ${esc(p.satker)}, sebagai berikut:</p>
    ${H('Dasar Pelaksanaan')}${olLines(Vg(l, 'dasar'))}
    ${l.dataPaket !== false ? `${H('Data Paket')}<table class=b style="break-inside:avoid">${[['Kode RUP', p.rup], ['Nama Paket', p.nama], ['Satuan Kerja', p.satker], ['Sumber Dana', p.sumber], ['Nilai Pagu', rp(num(p.pagu))], ['Nilai HPS', rp(hps)], ['Metode / Kontrak', p.metodeKontrak || `Katalog Elektronik – Mini Kompetisi ${p.metode || 'Itemized'}`], ['Lokasi Pekerjaan', p.lokasi], ['Jangka Waktu Pelaksanaan', tgl(p.waktu)]].map(([a, b]) => `<tr><th style="width:36%;text-align:left">${a}</th><td>${esc(b)}</td></tr>`).join('')}</table>` : ''}
    ${H('Pelaksanaan Katalog Elektronik')}${olLines(Vg(l, 'pel'), tabel)}
    ${H('Hasil Pemilihan')}${tabel}${win}
    ${H('Tindak Lanjut')}${olLines(Vg(l, 'tindakL'))}${l.extraJudul || l.extraIsi ? `${H(esc(l.extraJudul || 'Lain-lain'))}${olLines(l.extraIsi, tabel)}` : ''}<p>${esc(Vg(l, 'penutupL'))}</p>
    <div style="break-inside:avoid;margin-top:14px"><p style="font-weight:700;margin:0 0 6px">${esc(Vg(l, 'lap1'))}<br>${esc(Vg(l, 'lap2'))}</p><table class=b><tr><th style="width:30px">No</th><th>Nama</th><th>Tanda Tangan</th></tr>${angOf(l).map((a, i) => `<tr><td style="text-align:center">${i + 1}.</td><td>${esc(a.nama)}${a.nip ? `<br>NIP ${esc(a.nip)}` : ''}</td><td style="height:58px;text-align:center;vertical-align:middle">${sigCell(l, a)}</td></tr>`).join('')}</table></div>${tembus(Vg(l, 'tembusan'))}`;
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
  if (!p) return '<p style="padding:40px 0;text-align:center;color:#888">Pilih atau buat paket dulu (Pengaturan › Paket).</p>';
  const body = R[l.tpl](l, p, vars(l));
  return l.tpl === 'dmk' || l.tpl === 'kk' ? body : kop() + body;
}
function judul(l) {
  const p = paketOf(l) || {}, t = TPL[l.tpl], base = t.fn ? `${t.fn} ${p.nama || ''}` : Vg(l, 'hal');
  return `${(l.tgl || '').replace(/-/g, '')} ${base}`.replace(/[\\/:*?"<>|]/g, '-');
}

/* ===== pagination: pratinjau = hasil cetak (halaman dipecah sekali, dipakai untuk layar dan PDF) ===== */
const PAPER = { A4: [210, 297], F4: [215, 330], Letter: [216, 279] };
const mmpx = (x) => (x * 96) / 25.4;
async function paginate(l) {
  const [W, H] = PAPER[S().kertas] || PAPER.A4, html = renderLetter(l);
  const m = document.createElement('div'); m.className = 'pg meas'; m.style.width = W - 45 + 'mm'; m.innerHTML = `<div class=pc>${html}</div>`; document.body.append(m);
  await Promise.all([...m.querySelectorAll('img')].map((i) => (i.decode ? i.decode().catch(() => {}) : 0)));
  const pc = m.firstChild, base = pc.getBoundingClientRect().top, lim = mmpx(H - 40), units = [];
  for (const c of pc.children) {
    if (c.tagName === 'OL') {
      const st = +c.getAttribute('start') || 1, ty = c.getAttribute('type');
      [...c.children].forEach((li, i) => { const r = li.getBoundingClientRect(); units.push({ h: `<ol ${ty ? `type=${ty}` : ''} start=${st + i} style="margin:0">${li.outerHTML}</ol>`, t: r.top - base, b: r.bottom - base }); });
    } else { const r = c.getBoundingClientRect(); units.push({ h: c.outerHTML, t: r.top - base, b: r.bottom - base, kn: c.tagName === 'H4' || c.style.breakAfter === 'avoid', brk: c.classList.contains('pb') }); }
  }
  m.remove();
  const pages = [[]]; let start = null;
  for (const u of units) {
    let cur = pages[pages.length - 1];
    if (start === null) start = u.t;
    if (cur.length && u.b - start > lim) {
      const mv = []; while (cur.length > 1 && cur[cur.length - 1].kn) mv.unshift(cur.pop());
      pages.push(mv); cur = mv; start = (mv[0] || u).t;
    }
    cur.push(u);
    if (u.brk) { pages.push([]); start = null; }
  }
  while (pages.length > 1 && !pages[pages.length - 1].length) pages.pop();
  const total = pages.length;
  return { total, W, H, html: pages.map((pg, i) => `<div class=pgw>${total > 1 ? `<span class="bdg noprint">${i + 1} / ${total}</span>` : ''}<div class=pg style="width:${W}mm;height:${H}mm"><div class=pc>${pg.map((u) => u.h).join('')}</div>${l.tpl === 'lap' && l.halNo !== false && i > 0 ? `<div class=hal>Hal. ${i + 1}</div>` : ''}</div></div>`).join('') };
}
let rendT, rendTok = 0, rendP = Promise.resolve(), zoomMode = 'fit', pgW = 210;
function prev(now) {
  clearTimeout(rendT);
  const f = async () => {
    const tok = ++rendTok; let r;
    try { r = await paginate(L); } catch (e) { return; }
    if (tok !== rendTok || !$('#sh')) return;
    pgW = r.W; $('#sh').innerHTML = r.html;
    $('#pg').textContent = `@page{size:${r.W}mm ${r.H}mm;margin:0}`;
    $('#pgc').textContent = `${r.total} halaman · ${S().kertas}`; fitZoom();
  };
  if (now) return (rendP = f());
  rendT = setTimeout(() => (rendP = f()), 70); return rendP;
}
function fitZoom() { const box = $('.pvs'), s = $('#sh'); if (!box || !s) return; const z = zoomMode === 'fit' ? Math.min(1, (box.clientWidth - 28) / mmpx(pgW)) : +zoomMode; s.style.zoom = Math.max(0.3, z); }
addEventListener('resize', fitZoom);

/* ===== layar Surat ===== */
const DESC = {
  reviu: 'Paket dan pengaturan sudah terisi. Yang baru biasanya hanya dokumen yang direviu, waktu, dan nomor.',
  bukti: 'Yang baru biasanya hanya penyedia, waktu, dan nomor. Sisanya dari paket dan Pengaturan.',
  eval: 'Paket, nilai, dan Pokja sudah terisi. Yang baru hanya hasil dari papan peringkat dan nomor.',
  ubah: 'Data paket dan Pokja sudah terisi. Yang baru biasanya hanya butir perubahan (mis. perpanjangan masa tayang) dan nomor.',
  batal: 'Data paket dan Pokja sudah terisi. Pilih alasan pembatalan dan tindak lanjutnya.',
  lap: 'Rujukan BA, pembuktian, dan perubahan diambil otomatis dari surat lain pada paket yang sama.',
  dmk: 'Dokumen ketentuan mini kompetisi untuk paket ini.',
  kk: 'Lembar kerja evaluasi per peserta.',
};
const fmtT = (ts) => new Date(ts).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' });
const addDays = (s, n) => { const d = pd(s || today()); d.setDate(d.getDate() + n); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const lb = (t, extra = '') => `<div class=lb><span>${t}</span>${extra}</div>`;
/* kolom generik; auto=true -> isi otomatis yang bisa ditimpa */
function F(k, label, o = {}) {
  const t = o.t || 'text', manual = L[k] !== undefined, v = o.auto ? Vg(L, k) : L[k] ?? '', a = `data-k="${k}"${o.auto ? ' data-auto=1' : ''}`, ph = o.ph ? ` placeholder="${esc(o.ph)}"` : '';
  const badge = o.auto ? (manual ? `<em class=w>Diubah</em><a data-act="reset:${k}">Kembalikan</a>` : '<em>Otomatis</em>') : o.hint ? `<small>${o.hint}</small>` : '';
  if (t === 'chk') return `<label class=ck2><input type=checkbox ${a} ${v ? 'checked' : ''}>${label}</label>`;
  const head = lb(label, `<span class=bd>${badge}</span>`);
  if (t === 'area') return `<div class=f>${head}<textarea ${a}${ph} rows=${o.rows || 2}>${esc(v)}</textarea></div>`;
  if (t === 'sel') return `<div class=f>${head}<select ${a}>${o.o.map((x) => { const [val, tx2] = Array.isArray(x) ? x : [x, x]; return `<option value="${esc(val)}" ${String(val) === String(v) ? 'selected' : ''}>${esc(tx2)}</option>`; }).join('')}</select></div>`;
  return `<div class=f>${head}<input type="${t}" ${a} value="${esc(v)}"${ph}${o.list ? ` list=${o.list}` : ''}></div>`;
}
const seg = (k, opts, cur) => `<div class=seg>${opts.map((x) => `<button type=button data-seg="${k}:${x}" class="${x === cur ? 'on' : ''}">${x}</button>`).join('')}</div>`;
const chip = (t, on, attr) => `<button type=button class="chp ${on ? 'on' : ''}" ${attr}>${esc(t)}</button>`;
const sec = (n, t) => `<h5><b>${n}</b> · ${t}</h5>`;

function suratView() {
  L ||= newLetter('reviu');
  $('#main').innerHTML = '<div class=wrap><aside class="side noprint" id=sd></aside><div class="form noprint" id=fm></div><div class=prev><div class="pvbar noprint"><span>Pratinjau sama dengan hasil unduhan</span><span class=sp></span><select id=zm><option value=fit>Pas lebar</option><option value=0.75>75%</option><option value=1>100%</option></select><span id=pgc></span></div><div class=pvs><div id=sh></div></div></div></div><style id=pg></style>';
  side(); form(); bindForm(); prev(); $('#zm').value = zoomMode;
  $('#zm').onchange = (e) => { zoomMode = e.target.value; fitZoom(); };
}
function recent() {
  const q = sq.toLowerCase(), rec = D.surat.slice().sort((a, b) => (b.ts || 0) - (a.ts || 0)).filter((s) => TPL[s.tpl] && (!q || `${s.no} ${(paketOf(s) || {}).nama || ''} ${TPL[s.tpl].n}`.toLowerCase().includes(q))).slice(0, 14);
  const el = $('#rcl'); if (!el) return;
  el.innerHTML = rec.map((s) => `<div class="rc2 ${s.id === L.id ? 'on' : ''}" data-o=${s.id}><b>${esc(TPL[s.tpl].s)}${s.no ? ' · ' + s.no : ''}</b><span>${esc((paketOf(s) || {}).nama || '')}</span><small>${new Date(s.ts || 0).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })} · ${esc(s.by || '')}</small><a data-c=${s.id}>Buat lagi seperti ini</a></div>`).join('') || '<small class=muted>Belum ada.</small>';
}
function side() {
  $('#sd').innerHTML = `<h6>BUAT SURAT</h6>${KEYS.map((k) => `<a class="tp ${k === L.tpl ? 'on' : ''}" data-tp=${k}>${TPL[k].n}${D.surat.some((s) => s.pid === L.pid && s.tpl === k) ? '<i class=ck3>✓</i>' : ''}</a>`).join('')}<h6>TERAKHIR DIBUAT</h6><input id=sqi placeholder="Cari paket atau nomor…" value="${esc(sq)}"><div id=rcl></div>`;
  recent();
  $('#sqi').oninput = (e) => { sq = e.target.value; recent(); };
  $('#sd').onclick = (e) => {
    const t = e.target, tp = t.closest('[data-tp]'), c = t.dataset.c, o = t.closest('[data-o]');
    if (c) { const x = D.surat.find((y) => y.id === c); keep(); L = newLetter(x.tpl, x); return rerender(); }
    if (tp) { keep(); const k = tp.dataset.tp, ex = lastOf(L.pid, k); L = ex ? norm(JSON.parse(JSON.stringify(ex))) : newLetter(k, { pid: L.pid }); return rerender(); }
    if (o) { keep(); L = norm(JSON.parse(JSON.stringify(D.surat.find((y) => y.id === o.dataset.o)))); rerender(); }
  };
}
const keep = () => { if (L && L.touched) saveL(true); };
function rerender() { side(); form(); prev(); }
let asT, zOpen = false;
const touch = () => { L.touched = true; clearTimeout(asT); asT = setTimeout(() => saveL(true), 1800); setSt('Menyimpan…'); };

const pkMissing = (p) => { const m = { reviu: ['nama', 'stNo', 'stTgl', 'pejabatST', 'satker'], bukti: ['nama', 'stNo', 'stTgl'], eval: ['nama', 'stNo', 'stTgl', 'satker', 'pagu', 'hps', 'sumber', 'lokasi', 'waktu'], ubah: ['nama', 'stNo', 'stTgl', 'satker', 'pagu', 'hps', 'sumber', 'lokasi', 'rup'], batal: ['nama', 'stNo', 'stTgl', 'satker', 'pagu', 'hps', 'sumber', 'lokasi'], lap: ['nama', 'satker', 'rup', 'pagu', 'hps', 'sumber', 'lokasi', 'waktu'] }[L.tpl] || ['nama']; const lab = Object.fromEntries(PF.map(([k, l]) => [k, l])); return m.filter((k) => !p[k]).map((k) => lab[k] || k); };
const INFO = { reviu: 'nama paket, surat tugas, tanggal ST, satker, pejabat ST', bukti: 'nama paket, surat tugas, tanggal ST, pejabat ST', eval: 'nama paket, surat tugas, tanggal ST, satker, pagu, HPS, lokasi, itemized/total, jenis pengadaan, sumber anggaran, instansi, pejabat ST', ubah: 'nama paket, surat tugas, tanggal ST, satker, pagu, HPS, lokasi, kode RUP, itemized/total, jenis pengadaan, sumber dana, instansi, pejabat ST', batal: 'nama paket, surat tugas, tanggal ST, satker, pagu, HPS, lokasi, itemized/total, sumber dana, instansi, pejabat ST', lap: 'nama paket, satker, PPK, RUP, pagu, HPS, sumber dana, lokasi, metode, instansi', dmk: 'nama paket, satker, RUP, sumber dana, jenis pengadaan', kk: 'nama paket dan satker' };

/* --- blok isian per dokumen --- */
function blkWaktu(title) {
  const z = zoomOf(L), dar = (L.cara || 'Daring') === 'Daring', hrs = [['Hari ini', 0], ['Besok', 1], ['Lusa', 2]];
  return `${sec(3, title)}<div class=g3><div class=f>${lb('Tanggal', `<small>${hari(L.tglKeg) === '......' ? '' : hari(L.tglKeg)}</small>`)}<input type=date data-k=tglKeg value="${esc(L.tglKeg || '')}"></div><div class=f>${lb('Mulai')}<input data-k=jam value="${esc(L.jam)}" list=jml></div><div class=f>${lb('Cara')}${seg('cara', ['Luring', 'Daring'], L.cara || 'Daring')}</div></div>
  <div class=qk>${hrs.map(([t, n]) => chip(t, L.tglKeg === addDays(today(), n), `data-act="dt:${n}"`)).join('')}<span class=sep></span>${['09.00', '10.00', '13.30', '14.00'].map((t) => chip(t, L.jam === t, `data-act="jm:${t}"`)).join('')}</div><datalist id=jml>${['08.30', '09.00', '09.30', '10.00', '13.00', '13.30', '14.00', '15.00'].map((x) => `<option value="${x}">`).join('')}</datalist>
  <div class=info>${dar ? `<b>Zoom:</b> Meeting ID ${esc(z.id) || '—'} · passcode ${esc(z.pass) || '—'}` : `<b>Tempat:</b> ${esc(z.tempat) || '—'}`} <a data-act=zoom>${zOpen ? 'Tutup' : 'Ubah'}</a></div>
  ${zOpen ? `<div class="g2 zbx">${[['zId', 'Meeting ID', 'zoomId'], ['zPass', 'Passcode', 'zoomPass'], ['zLink', 'Tautan Zoom', 'zoomLink'], ['zTempat', 'Tempat (luring)', 'zoomTempat']].map(([k, t, s]) => `<div class=f>${lb(t)}<input data-k=${k} value="${esc(L[k] || '')}" placeholder="${esc(S()[s] || '')}"></div>`).join('')}<p class=muted style="grid-column:1/-1">Kosong = pakai bawaan Pengaturan. <a data-act=zdef>Jadikan bawaan</a></p></div>` : ''}`;
}
function blkReviu() {
  const extra = String(L.dokLain || '').split(',').map((x) => x.trim()).filter(Boolean);
  return `${sec(2, 'Dokumen yang direviu')}<div class=chps>${DOKS.map((d) => chip(d, (L.doks || []).includes(d), `data-dk="${esc(d)}"`)).join('')}</div>
  <div class=f>${lb('Dokumen lain', '<small>pisahkan dengan koma</small>')}<input data-k=dokLain value="${esc(L.dokLain || '')}" placeholder="mis. Rancangan Surat Pesanan"></div>${F('konsol', 'Diawali konsolidasi', { t: 'chk' })}<p class=muted style="margin:2px 0 0">Kegiatan: <b>${esc(kegOf(L))}</b></p>${blkWaktu('Waktu reviu')}`;
}
function blkBukti() {
  const ev = lastOf(L.pid, 'eval'), names = ev && ev.items ? [...new Set(ev.items.flatMap((it) => it.pes.map((x) => x.nama)).filter(Boolean))] : [];
  return `${sec(2, 'Penyedia yang diundang')}<div class=chps>${names.map((n) => chip(n, L.kepada === n, `data-pny="${esc(n)}"`)).join('')}</div>
  <div class=f>${lb('Nama penyedia')}<input data-k=kepada value="${esc(L.kepada || '')}" placeholder="mis. CV Sumber Makmoer Mandiri"></div>
  <div class=g2><div class=f>${lb('Sapaan')}<select data-k=sapaan>${['Bapak', 'Ibu', 'Saudara'].map((x) => `<option ${x === L.sapaan ? 'selected' : ''}>${x}</option>`).join('')}</select></div>${F('direktur', 'Nama direktur/kuasa')}</div>
  ${F('di', 'di (alamat / “Tempat”)')}<p class=muted style="margin:0">Nama direktur, sapaan, dan alamat diingat untuk penyedia ini.</p>${blkWaktu('Waktu pembuktian')}`;
}
function blkEval(p) {
  const hps = num(p.hps);
  return `<div class=f>${lb('Waktu pelaksanaan / tgl. penyelesaian')}<input type=date data-pk=waktu value="${esc(p.waktu || '')}"></div>
  ${sec(2, 'Peserta & hasil evaluasi')}${L.items.map((it, i) => { const w = winOf(it); return `<div class=itm>${L.items.length > 1 ? `<div class=g2s><input data-it="${i}.nama" value="${esc(it.nama)}" placeholder="Nama item ${i + 1}"><button class=ib data-act="itr:${i}" title="Hapus item">×</button></div>` : ''}
    <textarea class=pz data-pz=${i} rows=1 placeholder="Tempel papan peringkat dari katalog untuk mengganti (Ctrl+V)"></textarea>
    ${it.pes.map((x, j) => `<div class=pr><div class=pr1><span class=no>${j + 1}</span><input data-pl="${i}.${j}.nama" value="${esc(x.nama)}" placeholder="Nama peserta">${x === w ? '<em class=win>Pemenang</em>' : ''}<button class=ib data-act="pu:${i}.${j}" ${j ? '' : 'disabled'}>↑</button><button class=ib data-act="pd:${i}.${j}" ${j < it.pes.length - 1 ? '' : 'disabled'}>↓</button><button class=ib data-act="pr:${i}.${j}">×</button></div>
      <div class=g2s><input data-pl="${i}.${j}.nilai" inputmode=numeric value="${esc(x.nilai)}" placeholder="Nilai penawaran"><select data-pl="${i}.${j}.hasil">${HASIL.map((h) => `<option ${h === x.hasil ? 'selected' : ''}>${h}</option>`).join('')}</select></div>
      <small class=hpsn>${num(x.nilai) ? rp(num(x.nilai)) + (hps ? ' · ' + ((num(x.nilai) / hps) * 100).toFixed(2).replace('.', ',') + '% HPS' : '') : '&nbsp;'}</small><input data-pl="${i}.${j}.ket" value="${esc(x.ket)}" placeholder="Keterangan"></div>`).join('')}
    <div class=g2s><button class=btn data-act="pa:${i}">+ Peserta</button><div class=wn><span class=muted>Pemenang</span><select data-win=${i}><option value="">Otomatis (teratas Memenuhi)</option>${it.pes.filter((x) => x.nama).map((x) => `<option value="${x.id}" ${it.win === x.id ? 'selected' : ''}>${esc(x.nama)}</option>`).join('')}</select></div></div></div>`; }).join('')}
  <p><a data-act=ia>+ Tambah item (mini kompetisi itemized dengan beberapa produk)</a></p><p class=muted>Urutkan sesuai papan peringkat. Nilai boleh ditulis bebas, mis. 544635000 atau Rp544.635.000,00.</p>`;
}
function blkUbah() {
  return `${F('pokja', 'Nama Pokja / kegiatan', { hint: 'kosong = nama paket', ph: (paketOf(L) || {}).nama })}${sec(2, 'Perubahan paket kompetisi')}${L.chg.map((c, i) => `<div class=itm><div class=g2s><div class=seg>${[['perp', 'Perpanjangan masa tayang'], ['lain', 'Perubahan lain']].map(([t, n]) => `<button type=button data-act="ct:${i}.${t}" class="${c.t === t ? 'on' : ''}">${n}</button>`).join('')}</div>${L.chg.length > 1 ? `<button class=ib data-act="cr:${i}">×</button>` : ''}</div>
  ${c.t === 'perp' ? `<div class=g2><div class=f>${lb('Batas akhir semula')}<input type=datetime-local data-ch="${i}.semula" value="${esc(c.semula)}"><small class=muted>${c.semula ? dtm(c.semula) : ''}</small></div><div class=f>${lb('Diperpanjang menjadi', `<a data-act="p1:${i}">+1 hari</a>`)}<input type=datetime-local data-ch="${i}.baru" value="${esc(c.baru)}"><small class=muted>${c.baru ? dtm(c.baru) : ''}</small></div></div><p class=muted>Jadwal tayang paket ikut diperbarui, jadi laporan hasil pemilihan memakai batas akhir yang baru.</p>`
    : `<div class=f>${lb('Perubahan')}<input data-ch="${i}.label" value="${esc(c.label || '')}" placeholder="mis. jumlah item paket"></div><div class=g2><div class=f>${lb('Semula')}<input data-ch="${i}.dari" value="${esc(c.dari || '')}"></div><div class=f>${lb('Menjadi')}<input data-ch="${i}.menjadi" value="${esc(c.menjadi || '')}"></div></div><div class=f>${lb('Keterangan', '<small>opsional</small>')}<input data-ch="${i}.ket" value="${esc(c.ket || '')}"></div>`}</div>`).join('')}
  <div class=g2s><button class=btn data-act="ca:perp">+ Perpanjangan masa tayang</button><button class=btn data-act="ca:lain">+ Perubahan lain</button></div>`;
}
function blkBatal() {
  const sel = L.alasanPil || [];
  return `${F('pokja', 'Nama Pokja / kegiatan', { hint: 'kosong = nama paket', ph: (paketOf(L) || {}).nama })}${sec(2, 'Pembatalan')}
  ${F('tahap', 'Berdasarkan hasil (tahapan / pertimbangan)', { list: 'thl' })}<datalist id=thl>${TAHAP.map((x) => `<option value="${esc(x)}">`).join('')}</datalist>
  ${lb('Alasan pembatalan', '<small>pilih satu atau lebih</small>')}<div class="chps col">${ALASAN.map((a) => chip(a, sel.includes(a), `data-al="${esc(a)}"`)).join('')}</div>${F('alasan', 'Alasan lain / uraian tambahan', { t: 'area', hint: 'boleh kosong' })}
  ${F('tindak', 'Tindak lanjut', { list: 'tdl' })}<datalist id=tdl>${TINDAK.map((x) => `<option value="${esc(x)}">`).join('')}</datalist>
  ${F('jmk', 'Jenis Mini Kompetisi', { t: 'sel', o: [['', `Otomatis (Mini Kompetisi ${(paketOf(L) || {}).jenis || 'Barang'} ${(paketOf(L) || {}).metode || 'Itemized'})`], ...JMK] })}${F('infoLain', 'Informasi lain', { t: 'area', hint: 'opsional, tampil sebagai baris tabel' })}<p class=muted>Alasan mengacu pada Keputusan Kepala LKPP Nomor 93 Tahun 2025 (butir pembatalan di Template teks › Dokumen mini kompetisi).</p>`;
}
function blkLap() {
  const ev = evalOf(L), ub = lastOf(L.pid, 'ubah'), bk = lastOf(L.pid, 'bukti');
  return `${sec(2, 'Penayangan')}<div class=g2>${F('mulai', 'Penayangan mulai', { t: 'datetime-local' })}${F('selesai', 'Penayangan selesai', { t: 'datetime-local', hint: ub ? 'kosong = batas akhir baru dari BA perubahan' : '' })}</div>
  <div class=info>${ev ? `<b>BA hasil evaluasi:</b> ${nomorOf(ev)} · ${tgl(ev.tglEval || ev.tgl)}` : '<span class=err2>Belum ada BA hasil evaluasi untuk paket ini</span>'}${bk ? `<br><b>Pembuktian:</b> ${hariTgl2(bk.tglKeg)}` : ''}${ub ? `<br><b>BA perubahan:</b> ${nomorOf(ub)}` : ''} <span class=muted>(otomatis dari surat lain)</span></div>
  ${F('dataPaket', 'Tampilkan tabel Data Paket', { t: 'chk' })}${F('hanyaMenang', 'Tabel hasil: hanya pemenang', { t: 'chk' })}${F('halNo', 'Nomor halaman (Hal. 2, 3 …)', { t: 'chk' })}`;
}
function blkDmk() { return `${sec(2, 'Isian dokumen')}${TPL.dmk.f.map((f) => F(f.k, f.l)).join('')}`; }
function kkForm() {
  const h = (i, k, l) => `<div><label>${l}</label><input data-kk="${i}.h.${k}" value="${esc(L.prods[i][k])}"></div>`;
  return `${sec(2, 'Peserta & produk')}<div class=g2>${[['pNama', 'Nama perusahaan'], ['pNpwp', 'NPWP'], ['pTelp', 'No. telepon'], ['pEmail', 'Email']].map((f) => F(f[0], f[1])).join('')}</div>${F('pAlamat', 'Alamat', { t: 'area' })}
  ${L.prods.map((p, i) => `<div class=itm><div class=g2s><b>Produk ${i + 1}</b>${L.prods.length > 1 ? `<button class="btn s" data-x="dp:${i}">Hapus produk</button>` : ''}</div>
  <table class=kt><tr><th>Keterangan</th><th>Kualifikasi</th><th>Evaluasi</th><th>Ket.</th><th></th></tr>${p.rows.map((r, j) => `<tr><td><input data-kk="${i}.${j}.l" value="${esc(r.l)}"></td><td><textarea data-kk="${i}.${j}.k">${esc(r.k)}</textarea></td><td><textarea data-kk="${i}.${j}.e">${esc(r.e)}</textarea></td><td><textarea data-kk="${i}.${j}.n">${esc(r.n)}</textarea></td><td><button class="btn s" data-x="dr:${i}.${j}">×</button></td></tr>`).join('')}</table>
  <p><button class="btn s" data-x="ar:${i}">+ Tambah baris</button></p><div class=g2>${h(i, 'jml', 'Jumlah')}${h(i, 'sat', 'Satuan')}${h(i, 'hps', 'HPS per satuan (angka)')}${h(i, 'tot', 'Total penawaran (angka)')}</div></div>`).join('')}
  <p><button class=btn data-x=ap>+ Tambah produk</button></p>${F('alasan', 'Alasan tolak (bila tidak memenuhi syarat)', { t: 'area' })}`;
}
function angUI() {
  return `${lb('Anggota Pokja', '<small>urutan = urutan tanda tangan</small>')}<div class=ang>${angOf(L).map((a, i) => `<div class=ar><span class=no>${i + 1}</span><div class=an><b>${esc(a.nama)}</b><small>${a.nip ? 'NIP ' + esc(a.nip) : 'NIP belum diisi'}</small></div>${a.ttd ? `<img src="${a.ttd}">` : ''}<label class=tt><input type=checkbox data-tt=${a.id} ${L.noTtd[a.id] ? '' : 'checked'} ${a.ttd ? '' : 'disabled'}>TTD</label><button class=ib data-act="au:${i}" ${i ? '' : 'disabled'}>↑</button><button class=ib data-act="ax:${i}">×</button></div>`).join('') || '<small class=muted>Belum ada anggota.</small>'}</div>
  <input id=aadd list=pkl placeholder="Tambah anggota: ketik nama atau NIP…" autocomplete=off><datalist id=pkl>${D.pokja.filter((x) => !L.ang.includes(x.id)).map((x) => `<option value="${esc(x.nama)}">${esc(x.nip || '')}</option>`).join('')}</datalist>
  <select id=acp><option value="">Salin susunan dari paket lain…</option>${D.paket.filter((x) => x.id !== L.pid && D.surat.some((s) => s.pid === x.id && s.ang)).map((x) => `<option value="${x.id}">${esc(x.nama)}</option>`).join('')}</select><p style="margin:4px 0 0"><a data-act=kelola>Kelola Daftar Pokja</a></p>`;
}
const signer = () => `${lb('Penandatangan')}<select data-k=ttd>${D.pokja.map((p) => `<option value="${p.id}" ${p.id === L.ttd ? 'selected' : ''}>${esc(p.nama)}${p.nip ? ' · NIP ' + esc(p.nip) : ''}</option>`).join('')}</select><div class=sgn>${(() => { const s = D.pokja.find((x) => x.id === L.ttd); return s && s.ttd ? `<img src="${s.ttd}">` : ''; })()}${F('scan', 'Bubuhkan scan tanda tangan', { t: 'chk' })}</div>${F('garis', 'Garis bawah nama penandatangan', { t: 'chk' })}`;

function more() {
  const t = L.tpl, tp = [['auto', 'Otomatis'], ['atas', 'Di atas (dengan kota)'], ['sebaris', 'Sebaris Nomor']], bl = [['ikut', 'Ikut tanggal surat'], ['lalu', 'Bulan lalu']];
  const common = `<div class=g2>${F('lamp', 'Lampiran', { auto: 1 })}${F('kota', 'Kota')}</div>`, bln = `${F('blnMode', 'Bulan pada nomor', { t: 'sel', o: bl, hint: 'bila nomor diambil bulan lalu' })}`;
  if (t === 'reviu') return `<p class=muted>penerima, nama kegiatan, perihal, tembusan, penandatangan</p>${lb('Penerima undangan')}${[['ppk', 'Pejabat Pembuat Komitmen (satker dari data paket)'], ['tim', 'Tim Teknis Kegiatan'], ['pokja', 'Kelompok Kerja Pemilihan Penyedia (nama paket otomatis)']].map(([k, n]) => `<label class=ck2><input type=checkbox data-rp=${k} ${L.rcpt?.[k] !== false ? 'checked' : ''}>${n}</label>`).join('')}${F('rcptLain', 'Penerima lain', { t: 'area', hint: 'satu per baris' })}${F('keg', 'Nama kegiatan', { t: 'area', auto: 1 })}${F('hal', 'Hal', { t: 'area', auto: 1 })}${F('extra', 'Paragraf tambahan', { t: 'area', auto: 1, hint: 'boleh kosong' })}${F('penutup', 'Kalimat penutup', { auto: 1 })}${F('tembusan', 'Tembusan', { t: 'area', auto: 1, hint: 'satu per baris, kosong = tanpa tembusan' })}${signer()}<div class=g2>${F('an', 'Baris a.n.', { auto: 1 })}${F('unitBaris', 'Baris unit', { auto: 1 })}</div>${common}<div class=g2>${F('tglPos', 'Letak tanggal', { t: 'sel', o: tp })}${bln}</div>${F('judulTengah', 'Judul “UNDANGAN” di tengah', { t: 'chk' })}`;
  if (t === 'bukti') return `<p class=muted>perihal, paragraf, tembusan, penandatangan, lampiran</p>${F('minta', 'Paragraf permintaan dokumen', { t: 'area', auto: 1, hint: 'boleh kosong' })}${F('penutup', 'Kalimat penutup', { auto: 1 })}${F('tembusan', 'Tembusan', { t: 'area', auto: 1, hint: 'satu per baris, kosong = tanpa tembusan' })}${F('hal', 'Hal', { t: 'area', auto: 1 })}${signer()}<div class=g2>${F('an', 'Baris a.n.', { auto: 1 })}${F('unitBaris', 'Baris unit', { auto: 1 })}</div>${common}<div class=g2>${F('tglPos', 'Letak tanggal', { t: 'sel', o: tp })}${bln}</div>${F('judulTengah', 'Judul “UNDANGAN” di tengah', { t: 'chk' })}`;
  if (t === 'eval') return `<p class=muted>anggota Pokja & tanda tangan, pemegang akun katalog</p>${F('akun', 'Pemegang akun katalog', { t: 'sel', o: D.pokja.map((p) => [p.id, p.nama]) })}${F('tglEval', 'Tanggal evaluasi', { t: 'date' })}${angUI()}${bln}`;
  if (t === 'ubah' || t === 'batal') return `<p class=muted>anggota Pokja & tanda tangan, bulan nomor</p>${angUI()}${bln}`;
  if (t === 'lap') return `<p class=muted>rujukan BA, teks laporan, perihal, tembusan, anggota Pokja</p><div class=g2>${F('baNo', 'Nomor BA (timpa)', { ph: vars(L).baNo })}${F('baTgl', 'Tanggal BA (timpa)', { t: 'date' })}</div>${F('tglBukti', 'Tanggal pembuktian (timpa)', { t: 'date' })}<p class=muted>Penulisan teks: satu butir per baris · awali “- ” untuk sub-butir · tulis [TABEL] pada baris tersendiri untuk tabel penawaran.</p>${F('dasar', 'A. Dasar pelaksanaan', { t: 'area', auto: 1, rows: 4 })}${F('pel', 'Pelaksanaan pemilihan', { t: 'area', auto: 1, rows: 5 })}${F('tindakL', 'Tindak lanjut', { t: 'area', auto: 1, rows: 3 })}${F('extraJudul', 'Bagian tambahan — judul', { hint: 'opsional' })}${F('extraIsi', 'Bagian tambahan — isi', { t: 'area' })}${F('penutupL', 'Paragraf penutup', { t: 'area', auto: 1, rows: 3 })}${F('hal', 'Perihal', { t: 'area', auto: 1 })}${F('tembusan', 'Tembusan', { t: 'area', auto: 1, hint: 'satu per baris' })}<div class=g2>${F('lap1', 'Baris 1 di atas tabel TTD', { auto: 1 })}${F('lap2', 'Baris 2', { auto: 1 })}</div>${angUI()}<div class=g2>${F('lamp', 'Lampiran', { auto: 1 })}${F('kota', 'Kota')}</div>${bln}`;
  return `<div class=g2>${F('kota', 'Kota')}${bln}</div>${angUI()}`;
}

function form() {
  const t = TPL[L.tpl], p = paketOf(L), ex = savedL(L), n = need(L), dup = !t.nonum && D.surat.some((s) => s.id !== L.id && TPL[s.tpl] && !TPL[s.tpl].nonum && yr(s) === yr(L) && +s.no === +L.no), ln = lastNo(yr(L)), pm = p ? pkMissing(p) : [];
  const body = { reviu: blkReviu, bukti: blkBukti, eval: () => blkEval(p || {}), ubah: blkUbah, batal: blkBatal, lap: blkLap, dmk: blkDmk, kk: kkForm }[L.tpl]();
  const cnt = p ? D.surat.filter((s) => s.pid === p.id).length : 0;
  const sc = $('#fm') ? $('#fm').scrollTop : 0;
  $('#fm').innerHTML = `<div class=fb><div class=fh><h2>${t.n}</h2><p class=muted>${DESC[L.tpl]}</p>${ex ? `<p class=muted style="font-size:11px">Terakhir diubah ${fmtT(ex.ts)} oleh ${esc(ex.by || '')}</p>` : ''}</div>
  ${ex && ex.id === L.id && !L.touched ? `<div class=ban>Membuka ${t.s} yang sudah ada untuk paket ini${ex.no ? ` (No. ${ex.no})` : ''}. <a data-act=baru>Buat surat baru</a></div>` : ''}
  ${sec(1, 'Paket')}<div class=pk><i>▣</i><div><b>${p ? esc(p.nama) : '(belum ada paket)'}</b><small>${cnt} surat dalam paket ini</small></div><a data-act=pkt>Ganti paket</a></div>${D.paket.length ? '' : '<p class=err2>Tambahkan paket di Pengaturan › Paket.</p>'}
  ${n.length ? `<div class=warn><b>${n.length} isian lagi:</b> ${n.map(([k, x]) => `<a data-f="${k}">${x}</a>`).join('')}</div>` : ''}
  <div class=info><b>Terisi dari paket:</b> ${INFO[L.tpl]}. <a data-act=editpk>Ubah</a>${pm.length ? `<br><span class=err2>Belum diisi di paket: ${pm.join(', ')}</span>` : ''}</div>
  ${body}
  ${sec(4, 'Nomor & tanggal')}<div class=g2>${t.nonum ? '' : F('no', 'Nomor urut', { t: 'number', ph: 'mis. ' + nextNo(yr(L)) })}${F('tgl', 'Tanggal surat', { t: 'date' })}</div>
  ${t.nonum ? '' : `<p class=muted style="margin:4px 0">Nomor: <b>${nomorOf(L)}</b>${dup ? ' <span class=err2>· nomor sudah dipakai surat lain pada tahun yang sama</span>' : ''}</p>${ln ? `<p class=muted style="margin:0;font-size:11px">Nomor terakhir di aplikasi (${yr(L)}): <b>${ln.no}</b> · ${esc(TPL[ln.tpl].s)}, ${tgl(ln.tgl)}${ln.by ? ', ' + esc(ln.by) : ''} <a data-act=pakai>Pakai ${nextNo(yr(L))}</a></p>` : ''}`}
  <details class=mo ${L.tpl === 'eval' || L.tpl === 'ubah' || L.tpl === 'batal' ? 'open' : ''}><summary>Lainnya</summary>${more()}<p class=muted style="margin-top:8px">Ukuran kertas: ${esc(S().kertas)} (ubah di Pengaturan › Kode surat & rapat)</p></details></div>
  <div class=bar><button class="btn p" id=pdf>Unduh PDF</button><button class=btn id=prt>🖨 Cetak</button><button class=btn id=mn>⋯</button><small class=muted>${esc(judul(L)).slice(0, 38)}… · Ctrl+Enter PDF</small></div>`;
  $('#fm').scrollTop = sc;
  $('#pdf').onclick = () => doPrint(true); $('#prt').onclick = () => doPrint(false); $('#mn').onclick = menu;
}
async function doPrint(named) {
  await prev(true); saveL(true);
  const old = document.title; if (named) document.title = judul(L); addEventListener('afterprint', () => (document.title = old), { once: true }); print();
}
function saveL(quiet) {
  if (!L || !D.paket.length) return;
  L.ts = Date.now(); L.by = U.name; delete L.touched;
  const c = JSON.parse(JSON.stringify(L)), i = D.surat.findIndex((s) => s.id === L.id); i < 0 ? D.surat.push(c) : (D.surat[i] = c);
  const m = (S().last ||= {}), pick = (o, ks) => Object.fromEntries(ks.filter((k) => o[k] !== undefined).map((k) => [k, o[k]]));
  if (L.tpl === 'reviu') m.reviu = pick(L, ['jam', 'cara', 'doks', 'konsol', 'zId', 'zPass', 'zLink', 'zTempat']);
  if (L.tpl === 'bukti') { m.bukti = pick(L, ['jam', 'cara', 'zId', 'zPass', 'zLink', 'zTempat']); if (L.kepada) (D.pny ||= {})[L.kepada.toLowerCase()] = { sapaan: L.sapaan, direktur: L.direktur, di: L.di }; }
  dirty(); recent(); if (!quiet) { side(); form(); }
}
function menu() {
  const wa = L.tpl === 'reviu' || L.tpl === 'bukti', m = modal(`<h3>Tindakan</h3><div class=mlist><button class=btn data-m=sv>Simpan sekarang</button>${wa ? '<button class=btn data-m=wa>Salin pesan WhatsApp</button>' : ''}<button class=btn data-m=multi>Buat salinan untuk paket lain…</button>${savedL(L) ? '<button class=btn data-m=del style="color:#b42318">Hapus surat ini</button>' : ''}</div>`);
  m.onclick = async (e) => {
    const a = e.target.dataset.m; if (!a) return;
    if (a === 'sv') { saveL(); m.remove(); }
    if (a === 'wa') { await navigator.clipboard.writeText(waText()).catch(() => {}); m.remove(); setSt('Pesan disalin'); }
    if (a === 'multi') { m.remove(); multi(); }
    if (a === 'del' && confirm('Hapus surat ini?')) { D.surat = D.surat.filter((s) => s.id !== L.id); dirty(); m.remove(); L = newLetter(L.tpl, { pid: L.pid }); rerender(); }
  };
}
function waText() {
  const p = paketOf(L) || {}, z = zoomOf(L), dar = (L.cara || 'Daring') === 'Daring';
  return [`*${Vg(L, 'hal')}*`, '', `Hari/Tanggal: ${hariTgl2(L.tglKeg)}`, `Waktu: ${L.jam} ${S().zona} – Selesai`, dar ? `Zoom Meeting\nMeeting ID: ${z.id}\nPasscode: ${z.pass}${z.link ? '\nTautan: ' + z.link : ''}` : `Tempat: ${z.tempat}`, `Acara: ${L.tpl === 'reviu' ? 'Pembahasan ' + kegOf(L) + ' ' + (p.nama || '') : 'Rapat Pembuktian dan Klarifikasi Kualifikasi'}`].join('\n');
}
function multi() {
  const m = modal(`<h3>Buat salinan untuk paket lain</h3><p class=muted>Isian (tanggal, jam, cara, dokumen/penyedia, Zoom) disalin; nomor urut dibuat berurutan; nama paket mengikuti masing-masing paket.</p><div class=wr style="max-height:300px">${D.paket.filter((x) => x.id !== L.pid).map((x) => `<label class=wi style="margin:0"><input type=checkbox data-mp=${x.id} style="width:auto"><span>${esc(x.nama)}</span></label>`).join('') || '<p class=muted style="padding:10px">Tidak ada paket lain.</p>'}</div><p style="text-align:right"><button class=btn id=mx>Batal</button> <button class="btn p" id=mk>Buat</button></p>`);
  $('#mx').onclick = () => m.remove();
  $('#mk').onclick = () => {
    const ids = [...m.querySelectorAll('[data-mp]:checked')].map((x) => x.dataset.mp); if (!ids.length) return;
    keep(); saveL(true);
    ids.forEach((pid) => { const c = JSON.parse(JSON.stringify(L)); delete c.keg; delete c.hal; delete c.touched; Object.assign(c, { id: uid(), pid, ts: Date.now(), by: U.name }); if (!TPL[c.tpl].nonum) c.no = nextNo(yr(c)); D.surat.push(c); });
    dirty(); m.remove(); recent(); setSt(`${ids.length} surat dibuat`);
  };
}
function pickPaket() {
  const m = modal(`<h3>Pilih paket</h3><input id=ppq placeholder="Cari paket…" autofocus><div class=wr id=ppl style="max-height:340px"></div><p style="text-align:right"><button class=btn id=ppx>Tutup</button></p>`);
  const draw = () => { const q = $('#ppq').value.toLowerCase(); $('#ppl').innerHTML = D.paket.filter((p) => !q || p.nama.toLowerCase().includes(q)).slice().reverse().map((p) => `<div class="wi ${p.id === L.pid ? 'on' : ''}" data-p=${p.id}><span><b>${esc(p.nama)}</b><small>${esc(p.satker || '')} · ${D.surat.filter((s) => s.pid === p.id).length} surat</small></span></div>`).join('') || '<p class=muted style="padding:10px">Tidak ada.</p>'; };
  draw(); $('#ppq').oninput = draw; $('#ppx').onclick = () => m.remove();
  $('#ppl').onclick = (e) => { const w = e.target.closest('[data-p]'); if (!w) return; L.pid = w.dataset.p; if (L.tpl === 'bukti' || L.tpl === 'eval') { /* peserta dari paket baru */ } m.remove(); touch(); rerender(); };
}
const reparse = (txt) => {
  const out = [];
  for (const raw of String(txt).split('\n')) {
    const line = raw.trim(); if (!line) continue; const tk = line.split(/\t| {2,}|\|/).map((x) => x.trim()).filter(Boolean); let nilai = '', nama = '', hasil = '';
    for (const x of tk) { const d = x.replace(/[^\d]/g, ''); if (!nilai && /^(rp\.?\s*)?[\d.,\s]+$/i.test(x) && d.length >= 5) nilai = d; else if (/^(memenuhi|tidak memenuhi|gugur|lulus)/i.test(x)) hasil = /tidak|gugur/i.test(x) ? 'Tidak Memenuhi' : 'Memenuhi'; else if (!nama && /[a-z]/i.test(x) && !/^\d+\.?$/.test(x)) nama = x; }
    if (!nama) { const m = line.match(/^\d*\.?\s*(.+?)\s+(?:rp\.?\s*)?([\d.,]{5,})/i); if (m) { nama = m[1]; nilai = m[2].replace(/\D/g, ''); } }
    if (nama) out.push({ id: uid(), nama, nilai, hasil: hasil || 'Memenuhi', ket: hasil === 'Tidak Memenuhi' ? 'Tidak Memenuhi Syarat' : 'Memenuhi Syarat' });
  }
  return out;
};
const ketAuto = (h) => (h === 'Memenuhi' ? 'Memenuhi Syarat' : h === 'Tidak Memenuhi' ? 'Tidak Memenuhi Syarat' : h);
const syncAuto = () => document.querySelectorAll('#fm [data-auto]').forEach((el) => { const k = el.dataset.k; if (L[k] === undefined && document.activeElement !== el) el.value = AUTO(L)[k] ?? ''; });

/* helper yang masih dipakai layar Pengaturan */
const fh = (o, [k, l, t = 'text', op]) => {
  const v = o[k] ?? '', a = `data-k="${k}"`;
  if (t === 'area') return `<label>${l}</label><textarea ${a}>${esc(v)}</textarea>`;
  if (t === 'sel') return `<label>${l}</label><select ${a}>${op.map((x) => `<option ${x === v ? 'selected' : ''}>${esc(x)}</option>`).join('')}</select>`;
  if (t === 'chk') return `<label style="display:flex;gap:8px;align-items:center"><input type=checkbox style="width:auto" ${a} ${v ? 'checked' : ''}>${l}</label>`;
  return `<label>${l}</label><input type="${t}" ${a} value="${esc(v)}">`;
};
const bind = (root, obj, after) => { root.oninput = root.onchange = (e) => { const t = e.target; if (!t.dataset.k) return; obj[t.dataset.k] = t.type === 'checkbox' ? t.checked : t.value; after && after(t); }; };

/* ===== penanganan form ===== */
function refreshForm() {
  setTimeout(() => {
    const a = document.activeElement, at = ['data-k', 'data-pl', 'data-ch', 'data-it', 'data-kk', 'data-pk', 'data-win'].find((x) => a && a.getAttribute && a.getAttribute(x) != null);
    const sel = a && a.id ? '#' + a.id : at ? `[${at}="${a.getAttribute(at)}"]` : null, pos = a && a.selectionStart;
    form();
    if (sel) { const n = $('#fm ' + sel); if (n) { n.focus(); try { if (pos != null) n.setSelectionRange(pos, pos); } catch {} } }
  }, 0);
}
const RE_K = ['tglKeg', 'jam', 'no', 'tgl', 'blnMode', 'kepada', 'sapaan', 'ttd', 'scan', 'konsol', 'dokLain', 'tglPos', 'selesai', 'mulai', 'hal'];
function addAng(txt) {
  txt = String(txt || '').trim(); if (!txt) return;
  let p = D.pokja.find((x) => x.nama.toLowerCase() === txt.toLowerCase() || (x.nip && x.nip === txt));
  if (!p) { p = { id: uid(), nama: txt, nip: '', ttd: '', w: 140 }; D.pokja.push(p); dirty(); }
  if (!L.ang.includes(p.id)) L.ang.push(p.id);
  touch(); form(); prev();
}
function bindForm() {
  const f = $('#fm');
  f.oninput = f.onchange = (e) => {
    const x = e.target, ch = e.type === 'change';
    if (x.id === 'aadd') { if (ch && x.value) addAng(x.value); return; }
    if (x.id === 'acp') { if (ch && x.value) { const s = D.surat.filter((y) => y.pid === x.value && y.ang).sort((a, b) => (b.ts || 0) - (a.ts || 0))[0]; if (s) { L.ang = s.ang.slice(); L.noTtd = { ...(s.noTtd || {}) }; touch(); form(); prev(); } } return; }
    const d = x.dataset;
    if (d.pl) {
      const [i, j, k] = d.pl.split('.'), r = L.items[+i].pes[+j]; r[k] = x.value;
      if (k === 'hasil' && ch) { if (!r.ket || ['Memenuhi Syarat', 'Tidak Memenuhi Syarat', 'Gugur', 'Memenuhi', 'Tidak Memenuhi'].includes(r.ket)) r.ket = ketAuto(x.value); refreshForm(); }
      if (k === 'nilai') { const h = num((paketOf(L) || {}).hps), hn = x.closest('.pr').querySelector('.hpsn'); hn.innerHTML = num(x.value) ? rp(num(x.value)) + (h ? ' · ' + ((num(x.value) / h) * 100).toFixed(2).replace('.', ',') + '% HPS' : '') : '&nbsp;'; }
      if (k === 'nama' && ch) refreshForm();
    } else if (d.it) { const [i, k] = d.it.split('.'); L.items[+i][k] = x.value; }
    else if (d.win !== undefined) { L.items[+d.win].win = x.value || undefined; if (ch) refreshForm(); }
    else if (d.ch) { const [i, k] = d.ch.split('.'); L.chg[+i][k] = x.value; if (ch && (k === 'semula' || k === 'baru')) refreshForm(); }
    else if (d.kk) { const [i, j, k] = d.kk.split('.'), P = L.prods[+i]; j === 'h' ? (P[k] = x.value) : (P.rows[+j][k] = x.value); }
    else if (d.pk) { (paketOf(L) || {})[d.pk] = x.value; dirty(); }
    else if (d.rp) { (L.rcpt ||= { ppk: true, tim: true, pokja: true })[d.rp] = x.checked; }
    else if (d.tt) { L.noTtd[d.tt] = !x.checked; }
    else if (d.k) { const k = d.k; L[k] = x.type === 'checkbox' ? x.checked : x.type === 'number' ? (x.value === '' ? '' : +x.value) : x.value; if (ch && RE_K.includes(k)) refreshForm(); }
    else return;
    touch(); prev(); syncAuto();
  };
  f.onpaste = (e) => { const z = e.target; if (z.dataset.pz === undefined) return; e.preventDefault(); const rows = reparse(e.clipboardData.getData('text')); if (!rows.length) return; L.items[+z.dataset.pz].pes = rows; touch(); form(); prev(); };
  f.onclick = (e) => {
    const t = e.target.closest('[data-act],[data-seg],[data-dk],[data-pny],[data-al],[data-f],[data-x]'); if (!t) return; const d = t.dataset;
    if (d.seg) { const [k, v] = d.seg.split(':'); L[k] = v; touch(); form(); prev(); return; }
    if (d.dk) { const a = (L.doks ||= []), i = a.indexOf(d.dk); i < 0 ? a.push(d.dk) : a.splice(i, 1); touch(); form(); prev(); return; }
    if (d.al) { const a = (L.alasanPil ||= []), i = a.indexOf(d.al); i < 0 ? a.push(d.al) : a.splice(i, 1); touch(); form(); prev(); return; }
    if (d.pny) { L.kepada = d.pny; const m = (D.pny || {})[d.pny.toLowerCase()]; if (m) Object.assign(L, m); touch(); form(); prev(); return; }
    if (d.f) {
      if (d.f === 'baNo') return goTpl('eval');
      const q = { pes: '[data-pl]', chg: '[data-ch]', alasan: '[data-al]', dokLain: '[data-dk]' }[d.f] || `[data-k="${d.f}"]`, n = $('#fm ' + q); if (n) { n.scrollIntoView({ block: 'center' }); n.focus(); } return;
    }
    if (d.x) { const [c, v] = d.x.split(':'), [i, j] = String(v).split('.').map(Number); if (c === 'ap') L.prods.push(defProd()); else if (c === 'dp') L.prods.splice(i, 1); else if (c === 'ar') L.prods[i].rows.push({ l: '', k: '', e: '', n: '' }); else if (c === 'dr') L.prods[i].rows.splice(j, 1); touch(); form(); prev(); return; }
    act(...String(d.act).split(/:(.*)/s).slice(0, 2));
  };
}
function goTpl(k) { keep(); const ex = lastOf(L.pid, k); L = ex ? norm(JSON.parse(JSON.stringify(ex))) : newLetter(k, { pid: L.pid }); rerender(); }
function act(a, arg) {
  const [i, j] = String(arg || '').split('.').map((x) => (x === '' || isNaN(+x) ? x : +x)), mv = (arr, from, to) => { if (to < 0 || to >= arr.length) return; arr.splice(to, 0, arr.splice(from, 1)[0]); };
  let ch = true;
  switch (a) {
    case 'reset': delete L[arg]; break;
    case 'dt': L.tglKeg = addDays(today(), +arg); break;
    case 'jm': L.jam = arg; break;
    case 'zoom': zOpen = !zOpen; break;
    case 'zdef': Object.assign(S(), { zoomId: L.zId || S().zoomId, zoomPass: L.zPass || S().zoomPass, zoomLink: L.zLink || S().zoomLink, zoomTempat: L.zTempat || S().zoomTempat }); ['zId', 'zPass', 'zLink', 'zTempat'].forEach((k) => delete L[k]); dirty(); break;
    case 'baru': L = newLetter(L.tpl, { pid: L.pid }); rerender(); return;
    case 'pkt': pickPaket(); return;
    case 'editpk': keep(); pe = L.pid; tab = 'paket'; view = 'set'; shell(); return;
    case 'kelola': keep(); tab = 'pokja'; view = 'set'; shell(); return;
    case 'pakai': L.no = nextNo(yr(L)); break;
    case 'pa': L.items[i].pes.push(blankPes()); break;
    case 'pr': L.items[i].pes.splice(j, 1); if (!L.items[i].pes.length) L.items[i].pes.push(blankPes()); break;
    case 'pu': mv(L.items[i].pes, j, j - 1); break;
    case 'pd': mv(L.items[i].pes, j, j + 1); break;
    case 'ia': L.items.push({ id: uid(), nama: '', pes: [blankPes()] }); break;
    case 'itr': L.items.splice(i, 1); break;
    case 'ca': L.chg.push(arg === 'perp' ? { id: uid(), t: 'perp', semula: '', baru: '' } : { id: uid(), t: 'lain', label: '', dari: '', menjadi: '' }); break;
    case 'cr': L.chg.splice(i, 1); break;
    case 'ct': L.chg[i].t = j; break;
    case 'p1': { const c = L.chg[i]; if (c.semula) c.baru = addDays(c.semula.slice(0, 10), 1) + c.semula.slice(10); break; }
    case 'au': mv(L.ang, i, i - 1); break;
    case 'ax': L.ang.splice(i, 1); break;
    default: ch = false;
  }
  if (ch) { touch(); form(); prev(); }
}
if (!window._kb) { window._kb = 1; addEventListener('keydown', (e) => { if (view !== 'surat' || !L || !$('#fm')) return; if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); doPrint(true); } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); saveL(); } }); }

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
  <div class=card><h3>Kalimat & baris baku</h3>${[['pejabat', 'Pejabat penerbit surat tugas'], ['instansi', 'Instansi'], ['penutupMK', 'Baris penutup Dokumen Mini Kompetisi'], ['an', 'Undangan: baris a.n.'], ['unitBaris', 'Undangan: baris unit'], ['lap1', 'Laporan: baris 1 di atas tabel TTD'], ['lap2', 'Laporan: baris 2'], ['penutup', 'Kalimat penutup undangan'], ['stUnit', 'Unit penerbit ST (BA perubahan)'], ['katalogUrl', 'Alamat situs katalog (laporan)']].map((f) => fh(s, f)).join('')}</div>
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
const PF = [['nama', 'Nama paket'], ['rup', 'Kode RUP'], ['satker', 'Satuan kerja'], ['instansi', 'Instansi'], ['pagu', 'Nilai pagu (angka)'], ['hps', 'Nilai HPS (angka)'], ['sumber', 'Sumber dana'], ['lokasi', 'Lokasi pekerjaan'], ['waktu', 'Waktu pelaksanaan / tgl. penyelesaian', 'date'], ['metode', 'Metode', 'sel', ['Itemized', 'Total']], ['jenis', 'Jenis pengadaan'], ['tahun', 'Tahun anggaran'], ['stNo', 'Nomor surat tugas'], ['stTgl', 'Tanggal surat tugas', 'date'], ['pejabatST', 'Pejabat penerbit ST'], ['ppk', 'Pejabat Pembuat Komitmen (tujuan surat)'], ['pokjaNama', 'Nama Pokja (kosong = nama paket)'], ['kontrak', 'Jenis kontrak (laporan; mis. harga satuan)'], ['kodeAng', 'Kode anggaran (opsional)'], ['kodeSatker', 'Kode satker (opsional)']];
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
const fnum = (v) => (v === '' || v == null ? '' : Number(num(v)).toLocaleString('id-ID'));
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
    if (t.dataset.o) { curp = t.dataset.o; mq = mf = ''; monView(); }
    if (t.dataset.d && confirm('Hapus paket beserta seluruh data wilayahnya?')) { D.mpk = D.mpk.filter((x) => x.id !== t.dataset.d); dirty(); monList(); }
    if (t.id === 'addp') { const m = modal(`<h3>Tambah paket</h3><label>Nama paket</label><input id=an placeholder="mis. Pengadaan Benih Tebu Tahap IV"><label>Jenis / komoditi</label><input id=aj list=jl placeholder="Pilih atau ketik sendiri"><p style="text-align:right"><button class=btn id=ac>Batal</button> <button class="btn p" id=ao>Tambah</button></p>`); $('#an').focus(); $('#ac').onclick = () => m.remove(); $('#ao').onclick = () => { const n = $('#an').value.trim(); if (!n) return $('#an').focus(); D.mpk.push({ id: uid(), nama: n, jenis: $('#aj').value.trim(), wil: [] }); dirty(); m.remove(); monList(); }; } };
}
/* --- level 2: detail wilayah dalam paket --- */
function monDetail() {
  const p = pkt(), st = stList();
  const vis = () => p.wil.filter((r) => (!mq || (r.wil + ' ' + r.prov).toLowerCase().includes(mq.toLowerCase())) && (!mf || r.status === mf)), rows = vis();
  const chipsHtml = () => { const cnt = {}; p.wil.forEach((r) => (cnt[r.status] = (cnt[r.status] || 0) + 1)); return Object.entries(cnt).map(([k, v]) => `<span class="pill ${stCls(k)} ${mf === k ? 'sel' : ''}" data-s="${esc(k)}" style="cursor:pointer">${esc(k)} · ${v}</span>`).join(''); };
  const footRow = () => { const vs = vis(), tot = vs.reduce((a, r) => { a.l += num(r.lahan); a.p += num(r.penawar); const u = (r.sat || '').trim() || '-'; a.q[u] = (a.q[u] || 0) + num(r.qty); return a; }, { l: 0, p: 0, q: {} });
    return `<tr><td></td><td>Total (${vs.length} wilayah)</td><td></td><td class=n>${tot.l.toLocaleString('id-ID')}</td><td colspan=2 class=tq>${Object.entries(tot.q).map(([u, v]) => `${v.toLocaleString('id-ID')} ${esc(u)}`).join('<br>') || '0'}</td><td></td><td></td><td class=c>${tot.p}</td><td></td></tr>`; };
  $('#mb').innerHTML = `${dls()}<p style="margin:12px 0 0"><a id=bk>‹ Semua paket</a></p><div class=tools style="margin-top:8px"><input id=pn class=big value="${esc(p.nama)}" placeholder="Nama paket"><input id=pj list=jl value="${esc(p.jenis)}" placeholder="Jenis / komoditi paket" style="max-width:240px"></div>
  <div class=chips>${chipsHtml()}</div>
  <div class=tools><input id=mqi placeholder="Cari kabupaten/kota…" value="${esc(mq)}"><select id=mfi><option value="">Semua status progress</option>${st.map((x) => `<option ${x === mf ? 'selected' : ''}>${esc(x)}</option>`).join('')}</select><button class="btn p" id=addw>+ Tambah wilayah</button><button class=btn id=adds>+ Status baru</button></div>
  <div class=tw><table class="mt det"><thead><tr><th>NO</th><th>PROVINSI / WILAYAH / KABUPATEN / KOTA</th><th>JENIS / KOMODITI</th><th>LAHAN (HA)</th><th colspan=2>QUANTITY &amp; SATUAN</th><th>STATUS PROGRESS PENGADAAN</th><th>PENAWARAN SELESAI</th><th>JUMLAH PENAWAR</th><th>PETA</th></tr></thead><tbody>${rows.map((r, i) => `<tr data-id=${r.id}><td>${i + 1}</td><td><input class=tag data-f=prov value="${esc(r.prov)}" placeholder="Provinsi" style="color:${pcol(r.prov)};background:${pcol(r.prov)}14"><input class=nm data-f=wil value="${esc(r.wil)}" placeholder="Kabupaten / Kota"></td><td><input class=jn data-f=jenis list=jl value="${esc(r.jenis || '')}" placeholder="${esc(p.jenis || 'Komoditi')}"></td><td><input class=n data-f=lahan value="${fnum(r.lahan)}"></td><td><input class=n data-f=qty value="${fnum(r.qty)}"></td><td><input class=su data-f=sat list=sl value="${esc(r.sat || '')}" placeholder="Satuan"></td><td><select class="pill ${stCls(r.status)}" data-f=status>${st.map((x) => `<option ${x === r.status ? 'selected' : ''}>${esc(x)}</option>`).join('')}</select></td><td><input type=datetime-local data-f=selesai value="${esc(r.selesai)}"></td><td><input type=number min=0 class=c data-f=penawar value="${esc(r.penawar)}"></td><td class=act><a class=pt data-m=${r.id}>Peta</a><a class=x data-pe=${r.id} title="Ubah tautan peta">✎</a><a class=x data-x=${r.id} title="Hapus baris">×</a></td></tr>`).join('') || '<tr><td colspan=10 class=m style="padding:24px;text-align:center">Belum ada wilayah. Klik “+ Tambah wilayah”.</td></tr>'}</tbody><tfoot>${footRow()}</tfoot></table></div>`;
  const root = $('#mb'), refocus = (id, v) => { const q = $(id); q.focus(); q.setSelectionRange(v.length, v.length); };
  root.oninput = root.onchange = (e) => { const t = e.target;
    if (t.id === 'mqi') { mq = t.value; monDetail(); refocus('#mqi', mq); return; }
    if (t.id === 'mfi') { mf = t.value; monDetail(); return; }
    if (t.id === 'pn') { p.nama = t.value; dirty(); return; } if (t.id === 'pj') { p.jenis = t.value; dirty(); return; }
    const tr = t.closest('tr[data-id]'); if (!tr || !t.dataset.f) return;
    const r = p.wil.find((x) => x.id === tr.dataset.id); r[t.dataset.f] = t.value;
    if (t.dataset.f === 'status') t.className = 'pill ' + stCls(t.value);
    dirty(); if (e.type === 'change' && ['lahan', 'qty'].includes(t.dataset.f)) t.value = fnum(t.value);
    if (['lahan', 'qty', 'sat', 'penawar', 'status'].includes(t.dataset.f)) { $('.det tfoot').innerHTML = footRow(); $('.chips').innerHTML = chipsHtml(); } };
  root.onclick = (e) => { const t = e.target;
    if (t.id === 'bk') { curp = null; monView(); }
    if (t.dataset.s) { mf = mf === t.dataset.s ? '' : t.dataset.s; monDetail(); }
    if (t.id === 'addw') addWil(p);
    if (t.id === 'adds') { const n = (prompt('Nama status baru') || '').trim(); if (n) { D.statusList = [...stList(), n]; dirty(); monDetail(); } }
    if (t.dataset.x && confirm('Hapus wilayah ini?')) { p.wil = p.wil.filter((x) => x.id !== t.dataset.x); dirty(); monDetail(); }
    if (t.dataset.pe) { const r = p.wil.find((x) => x.id === t.dataset.pe), u = prompt('Tautan peta (kosongkan = cari otomatis di Google Maps)', r.peta || ''); if (u !== null) { r.peta = u.trim(); dirty(); } }
    if (t.dataset.m) { const r = p.wil.find((x) => x.id === t.dataset.m), q = `${r.wil} ${r.prov}`; const m = modal(`<h3>${esc(r.wil)} <span class=muted>${esc(r.prov)}</span></h3><iframe src="https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed" loading=lazy style="width:100%;height:55vh;border:1px solid #e7ebf3;border-radius:12px"></iframe><p style="text-align:right"><a class="btn s" href="${esc(mapUrl(r))}" target=_blank rel=noopener>Buka di Google Maps</a> <button class="btn s p" id=mc>Tutup</button></p>`); $('#mc').onclick = () => m.remove(); } };
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

