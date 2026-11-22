/* ===== Dokumen Pokja — ekstensi v1 (lanjutan versi lama) =====
   Dimuat setelah app.js. Menambah: profil + karakter + tema, dashboard, riwayat paket,
   BA negosiasi, tabel BA perubahan, dokumen mini kompetisi multi paket, kop surat rapi. */
const AV = ['🐻‍❄️', '🐼', '🦊', '🐱', '🐶', '🐰', '🐨', '🦁', '🐯', '🐸', '🐵', '🐧', '🦉', '🐥', '🦄', '🐹', '🐷', '🐮', '🐙', '🦖', '🐢', '🦋', '🐝', '🐳'];
const THEMES = [['biru', 'Biru'], ['hitam', 'Hitam'], ['pink', 'Pink'], ['hijau', 'Hijau'], ['ungu', 'Ungu'], ['oranye', 'Oranye'], ['merah', 'Merah'], ['teal', 'Teal'], ['emas', 'Emas'], ['abu', 'Abu-abu']];
const THC = { biru: '#4a6fd0', hitam: '#1f1f24', pink: '#e0508c', hijau: '#2e9e6b', ungu: '#7c55d6', oranye: '#ee7d22', merah: '#d6403f', teal: '#12a2b0', emas: '#d9a514', abu: '#5b6b82' };
const PERAN = { pokja: 'Anggota Pokja', ppk: 'Pimpinan / PPK' };
const applyTheme = (t) => { t = THC[t] ? t : 'biru'; document.documentElement.dataset.theme = t; try { localStorage.setItem('tema', t); } catch {} };
applyTheme((() => { try { return localStorage.getItem('tema'); } catch { return 'biru'; } })());
const firstName = (n) => String(n || '').replace(/^((dr|ir|drs|prof|h|hj)\.?\s+)+/i, '').split(/\s+/)[0] || 'Teman';
const avOf = (u) => AV[(u && u.avatar) || 0] || AV[0];
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const sd = (s) => (s ? `${pd(s).getDate()} ${MON[pd(s).getMonth()]}` : '');
const dtm2 = (s) => (s ? `${hari(s)}, ${tgl(s)} pukul ${jam(s)} ${S().zona || 'WIB'}` : '......');
const fl = (s) => { s = String(s ?? '').trim().replace(/\s|Rp/gi, ''); if (!s) return 0; if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.'); else if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, ''); const n = parseFloat(s); return isNaN(n) ? 0 : n; };
const rn = (n) => 'Rp ' + Math.round(n).toLocaleString('id-ID') + ',00';
const pctS = (a, b) => (b ? ((a / b) * 100).toFixed(2).replace('.', ',') + '%' : '—');

/* ---------- autentikasi: nama lengkap, NIP, karakter, warna ---------- */
const regSel = { avatar: 0, theme: 'biru', peran: 'pokja' };
authView = function (mode = 'login', err = '') {
  const reg = mode === 'reg';
  $('#app').innerHTML = `<div class=auth><div class=card><h3 style="font-size:22px">Dokumen Pokja</h3>
  <p class=muted>${reg ? 'Pendaftaran hanya dengan kode referral dari admin.' : 'Masuk untuk membuat surat dan dokumen Pokja.'}</p>
  ${reg ? `<div class=g2><div><label>Nama lengkap (beserta gelar)</label><input id=n autocomplete=name></div><div><label>NIP</label><input id=ni inputmode=numeric placeholder="18 digit"></div></div>` : ''}
  <label>Email</label><input id=e type=email autocomplete=email>
  <label>Sandi${reg ? ' (min. 8 karakter)' : ''}</label><input id=p type=password autocomplete=${reg ? 'new-password' : 'current-password'}>
  ${reg ? `<label>Kode referral</label><input id=r autocapitalize=characters style="text-transform:uppercase;letter-spacing:.08em">
  <label>Peran</label><select id=pr>${Object.entries(PERAN).map(([k, v]) => `<option value=${k} ${regSel.peran === k ? 'selected' : ''}>${v}</option>`).join('')}</select>
  <label>Pilih karakter lucu</label><div class=avg id=avg>${AV.map((a, i) => `<span data-av=${i} class="${regSel.avatar === i ? 'on' : ''}">${a}</span>`).join('')}</div>
  <label>Pilih warna tampilan</label><div class=thg id=thg>${THEMES.map(([k, n]) => `<span data-th=${k} title="${n}" style="background:${THC[k]}" class="${regSel.theme === k ? 'on' : ''}"></span>`).join('')}</div>` : ''}
  <div class=err>${esc(err)}</div><p><button class="btn p" id=go style="width:100%">${reg ? 'Daftar' : 'Masuk'}</button></p>
  <p class=muted style="text-align:center"><a href=# id=sw>${reg ? 'Sudah punya akun? Masuk' : 'Belum punya akun? Daftar dengan kode referral'}</a></p></div></div>`;
  $('#sw').onclick = (e) => { e.preventDefault(); authView(reg ? 'login' : 'reg'); };
  if (reg) {
    $('#avg').onclick = (e) => { const t = e.target.closest('[data-av]'); if (!t) return; regSel.avatar = +t.dataset.av; document.querySelectorAll('#avg span').forEach((x) => x.classList.toggle('on', x === t)); };
    $('#thg').onclick = (e) => { const t = e.target.closest('[data-th]'); if (!t) return; regSel.theme = t.dataset.th; applyTheme(regSel.theme); document.querySelectorAll('#thg span').forEach((x) => x.classList.toggle('on', x === t)); };
  }
  const go = async () => {
    try {
      const b = { email: $('#e').value, password: $('#p').value };
      if (reg) Object.assign(b, { name: $('#n').value, nip: $('#ni').value, ref: $('#r').value, peran: $('#pr').value, avatar: regSel.avatar, theme: regSel.theme });
      U = (await api('auth?a=' + (reg ? 'register' : 'login'), 'POST', b)).user;
      applyTheme(U.theme); await start();
    } catch (x) { authView(mode, x.message); }
  };
  $('#go').onclick = go;
  $('#app').onkeydown = (e) => { if (e.key === 'Enter') go(); };
};

/* data pendaftar otomatis menjadi anggota Pokja (nama + NIP siap dipakai di dokumen) */
function syncSelf() {
  if (!U || !U.nip) return;
  const p = D.pokja.find((x) => x.nip === U.nip || x.uid === U.id);
  if (!p) { D.pokja.push({ id: uid(), nama: U.name, nip: U.nip, ttd: '', w: 140, uid: U.id }); dirty(); }
  else if (p.nama !== U.name || p.nip !== U.nip || p.uid !== U.id) { Object.assign(p, { nama: U.name, nip: U.nip, uid: U.id }); dirty(); }
}
const _load0 = load;
load = async function () { await _load0(); BASE = JSON.stringify(D); syncSelf(); D.paket.forEach((p) => { p.eselon1 ??= ''; }); };
start = async function () {
  applyTheme(U.theme); await load(); L = null; view = U.peran === 'ppk' ? 'dash' : 'home'; shell();
};

/* ---------- kerangka baru (sidebar ikon + topbar) ---------- */
const NAV = [['home', 'Beranda', '⌂'], ['surat', 'Buat Surat', '✎'], ['pkt', 'Paket & Riwayat', '▦'], ['dash', 'Dashboard Pimpinan', '◧'], ['mon', 'Monitoring', '◔'], ['drv', 'Dokumen Drive', '☁'], ['set', 'Pengaturan', '⚙']];
let curPk = null, popOpen = '';
function shell() {
  const wide = localStorage.getItem('col') === 'w';
  const nt = notes(), n = nt.filter((x) => x.k !== 'g').length;
  $('#app').innerHTML = `<div class="frame ${wide ? 'wide' : ''}"><aside class=noprint><div class=brand><span class=lg></span><span class=tx>Dokumen Pokja</span></div><button class=up id=nw title="Buat surat baru"><span class=tx>Buat Surat Baru</span><i class=pl>+</i></button>
  <nav>${NAV.map(([k, nm, c]) => `<a data-v=${k} title="${nm}" class="${view === k ? 'on' : ''}"><i>${c}</i><span class=tx>${nm}</span></a>`).join('')}</nav>
  <div class=sp></div><small id=st></small><a id=cl title="Lebarkan / ciutkan menu"><i>⇔</i><span class=tx>Lebarkan menu</span></a><a id=out title="Keluar"><i>⇥</i><span class=tx>Keluar</span></a></aside>
  <section class=body><div class="topbar noprint"><div class=sch><input id=tq placeholder="Cari surat atau paket… (Enter)"></div><div class=dt>${hari(today())}, ${tgl(today())}</div>
  <button class=tbtn id=bell title="Pengingat">🔔${n ? `<span class=bg>${n}</span>` : ''}</button><div class=me id=meb title="Profil & tampilan"><span class=ch2>${avOf(U)}</span><div><b>${esc(firstName(U.name))}</b><small>${PERAN[U.peran] || PERAN.pokja}</small></div></div></div>
  <div id=pp></div><main class=main id=main></main></section></div>`;
  document.querySelectorAll('aside [data-v]').forEach((a) => (a.onclick = () => { view = a.dataset.v; if (view === 'pkt') curPk = null; shell(); }));
  $('#nw').onclick = () => openLetter(newLetter(L?.tpl || 'reviu', { pid: L?.pid }));
  $('#cl').onclick = () => { localStorage.setItem('col', wide ? 'n' : 'w'); shell(); };
  $('#out').onclick = async () => { await api('auth?a=logout', 'POST'); U = null; authView(); };
  $('#meb').onclick = () => { tab = 'profil'; view = 'set'; shell(); };
  $('#bell').onclick = () => { popOpen = popOpen === 'b' ? '' : 'b'; drawPop(); };
  $('#tq').onkeydown = (e) => { if (e.key === 'Enter') { popOpen = 's'; drawPop(e.target.value); } };
  drawPop();
  ({ home: homeView, surat: suratView, pkt: pktView, dash: dashView, mon: monView, drv: driveView, set: setView })[view]();
}
let NT = [];
function drawPop(q) {
  const el = $('#pp'); if (!el) return;
  if (!popOpen) { el.innerHTML = ''; return; }
  if (popOpen === 'b') { NT = notes(); el.innerHTML = `<div class="pop noprint"><h3>Pengingat</h3>${ntHtml(NT)}</div>`; bindNt(el); return; }
  const k = String(q || '').toLowerCase().trim();
  const ps = D.paket.filter((p) => !k || (p.nama + ' ' + (p.rup || '') + ' ' + (p.stNo || '')).toLowerCase().includes(k)).slice(0, 6);
  const ss = D.surat.filter((s) => !k || (judul(s) + ' ' + (s.no || '')).toLowerCase().includes(k)).sort((a, b) => b.ts - a.ts).slice(0, 8);
  el.innerHTML = `<div class="pop noprint"><h3>Hasil pencarian “${esc(q || '')}”</h3><h6>PAKET</h6>${ps.map((p) => `<div class=nt data-gp=${p.id}><i>▦</i><span><b>${esc(p.nama)}</b>HPS ${rp(num(p.hps))}</span></div>`).join('') || '<p class=muted>Tidak ada paket.</p>'}<h6>SURAT</h6>${ss.map((s) => `<div class=nt data-gs=${s.id}><i>${TPL[s.tpl].i}</i><span><b>${esc(TPL[s.tpl].n)}${s.no ? ' · ' + s.no : ''}</b>${esc((paketOf(s) || {}).nama || '')}</span></div>`).join('') || '<p class=muted>Tidak ada surat.</p>'}</div>`;
  el.onclick = (e) => { const g = e.target.closest('[data-gp],[data-gs]'); if (!g) return; popOpen = ''; if (g.dataset.gp) { curPk = g.dataset.gp; view = 'pkt'; shell(); } else openLetter(clone(D.surat.find((x) => x.id === g.dataset.gs))); };
}
const ntHtml = (a) => a.map((x, i) => `<div class="nt ${x.k}" data-nt=${i}><i>${x.i}</i><span><b>${esc(x.t)}</b>${esc(x.d || '')}</span><span class=go>›</span></div>`).join('') || '<p class=muted>Tidak ada pengingat.</p>';
function bindNt(root) { root.onclick = (e) => { const t = e.target.closest('[data-nt]'); if (!t) return; popOpen = ''; NT[+t.dataset.nt].go(); }; }
function notes() {
  const a = [], yrs = {};
  const nb = D.surat.filter((s) => !TPL[s.tpl].nonum && !s.no);
  if (nb.length) a.push({ k: 'w', i: '#', t: `${nb.length} surat belum bernomor`, d: `${TPL[nb[0].tpl].n} — ${(paketOf(nb[0]) || {}).nama || ''}`, go: () => openLetter(clone(nb[0])) });
  D.surat.filter((s) => !TPL[s.tpl].nonum && s.no).forEach((s) => { const k = yr(s) + '|' + +s.no; (yrs[k] ||= []).push(s); });
  Object.values(yrs).filter((x) => x.length > 1).slice(0, 2).forEach((x) => a.push({ k: 'e', i: '!', t: `Nomor ${x[0].no} dipakai ${x.length} surat`, d: 'Periksa agar tidak ganda.', go: () => openLetter(clone(x[0])) }));
  D.paket.forEach((p) => { const m = []; if (!num(p.hps)) m.push('HPS'); if (!p.stNo) m.push('nomor ST'); if (!p.rup) m.push('kode RUP'); if (m.length) a.push({ k: 'w', i: '▦', t: 'Data paket belum lengkap', d: `${p.nama}: ${m.join(', ')}`, go: () => { pe = p.id; tab = 'paket'; view = 'set'; shell(); } }); });
  const nt = D.pokja.filter((p) => !p.ttd); if (nt.length) a.push({ k: 'w', i: '✍', t: `${nt.length} anggota Pokja belum punya TTD`, d: nt.map((x) => x.nama).slice(0, 2).join(', '), go: () => { tab = 'pokja'; view = 'set'; shell(); } });
  D.paket.forEach((p) => { const I = pktInfo(p.id), nx = pktNext(I); if (nx && I.ls.length) a.push({ k: '', i: '→', t: 'Langkah berikutnya', d: `${p.nama}: ${nx.t}`, go: () => { curPk = p.id; view = 'pkt'; shell(); } }); });
  return a.slice(0, 12);
}

/* ---------- beranda ---------- */
/* sapaan beranda: berganti sesuai jam, ucapan dipilih acak sekali per sesi lalu tetap (tidak berkedip saat layar disegarkan) */
const GREET = {
  dini: { e: '🧑‍💻', s: 'Apa yang kita selesaikan malam ini?', t: ['Masih begadang, {n}?', 'Larut malam, {n}! Istirahat ya', 'Halo {n}, tetap jaga kesehatan ya'] },
  pagi: { e: '🙋', s: 'Apa yang kita kerjakan pagi ini?', t: ['Selamat pagi, {n}!', 'Pagi, {n}! Semangat hari ini', 'Selamat pagi, {n}. Sudah sarapan?', 'Hai {n}, semangat pagi!'] },
  siang: { e: '🧑‍💼', s: 'Apa yang kita kerjakan siang ini?', t: ['Selamat siang, {n}!', 'Siang, {n}! Sudah makan siang?', 'Halo {n}, tetap semangat ya', 'Selamat siang, {n}. Lanjut kerja?'] },
  sore: { e: '🚶', s: 'Apa yang perlu dirampungkan sore ini?', t: ['Selamat sore, {n}!', 'Sore, {n}! Sedikit lagi selesai', 'Halo {n}, sore yang produktif!', 'Sore, {n}! Ngopi dulu?'] },
  malam: { e: '🧘', s: 'Apa yang kita kerjakan malam ini?', t: ['Selamat malam, {n}!', 'Malam, {n}! Jangan terlalu larut ya', 'Halo {n}, jangan lupa istirahat', 'Malam, {n}! Masih ada yang dikejar?'] },
};
const GCH = {};
function greet(name) {
  const h = new Date().getHours(), k = h < 4 ? 'dini' : h < 11 ? 'pagi' : h < 15 ? 'siang' : h < 18 ? 'sore' : 'malam', g = GREET[k];
  if (GCH[k] == null) GCH[k] = Math.floor(Math.random() * g.t.length);
  return { e: g.e, s: g.s, t: g.t[GCH[k]].replace('{n}', esc(name)) };
}
function homeView() {
  const I = D.paket.map((p) => pktInfo(p.id)), bln = today().slice(0, 7);
  const st = [['▦', 'Total paket', D.paket.length], ['✎', 'Surat bulan ini', D.surat.filter((s) => (s.tgl || '').startsWith(bln)).length], ['◔', 'Paket sedang tayang', I.filter((x) => x.status === 'Tayang').length], ['✓', 'Paket selesai (laporan)', I.filter((x) => x.status === 'Selesai').length]];
  const nt = (NT = notes()).slice(0, 4), G = greet(firstName(U.name));
  $('#main').innerHTML = `<div class=hg><div class=hero><span style="color:var(--m);font-size:13px">${hari(today())}, ${tgl(today())}</span><h2 class=gh><span class=gi aria-hidden=true>${G.e}</span>${G.t}</h2><p>${G.s}</p>
  <div class=ql><a data-n=reviu>Undangan reviu</a><a data-n=eval>BA hasil evaluasi</a><a data-n=nego>BA negosiasi harga</a><a data-n=lap>Laporan hasil pemilihan</a><a data-vv=pkt>Riwayat paket</a><a data-vv=dash>Dashboard pimpinan</a></div><div class=ch3>${avOf(U)}</div></div>
  <div class=ntf><h3>Pengingat <small data-vv=none id=nall>lihat semua</small></h3>${ntHtml(nt)}</div></div>
  <div class=sg>${st.map(([i, t, v]) => `<div class=sc><i>${i}</i><small>${t}</small><b>${v}</b></div>`).join('')}</div>
  <div class=head><h3 style="margin:0">Semua surat</h3><input id=gq placeholder="Cari surat atau paket…" value="${esc(hq)}" style="max-width:280px;margin-left:auto"></div><div id=rc class=card style="margin-top:10px"></div>`;
  homeList(); $('#gq').oninput = (e) => { hq = e.target.value; homeList(); };
  document.querySelectorAll('#main [data-n]').forEach((b) => (b.onclick = () => openLetter(newLetter(b.dataset.n, { pid: L?.pid }))));
  document.querySelectorAll('#main [data-vv]').forEach((b) => (b.onclick = () => { if (b.dataset.vv === 'none') { popOpen = 'b'; drawPop(); return; } view = b.dataset.vv; curPk = null; shell(); }));
  const m = $('#main'); m.querySelectorAll('[data-nt]').forEach((t) => (t.onclick = () => NT[+t.dataset.nt].go()));
}

/* ---------- profil & tampilan ---------- */
function pProfil(el) {
  const d = { name: U.name, nip: U.nip || '', avatar: U.avatar || 0, theme: U.theme || 'biru', peran: U.peran || 'pokja' };
  el.innerHTML = `<div class=card><h3>Profil saya</h3><div class=g2><div><label>Nama lengkap</label><input id=pn_ value="${esc(d.name)}"></div><div><label>NIP</label><input id=pni value="${esc(d.nip)}" inputmode=numeric></div></div>
  <p class=muted>Nama & NIP ini otomatis menjadi anggota di Daftar Pokja sehingga langsung bisa dipilih di surat/BA.</p><label>Peran</label><select id=ppr>${Object.entries(PERAN).map(([k, v]) => `<option value=${k} ${d.peran === k ? 'selected' : ''}>${v}</option>`).join('')}</select>
  <label>Karakter</label><div class=avg id=avg>${AV.map((a, i) => `<span data-av=${i} class="${d.avatar === i ? 'on' : ''}">${a}</span>`).join('')}</div>
  <label>Warna tampilan</label><div class=thg id=thg>${THEMES.map(([k, n]) => `<span data-th=${k} title="${n}" style="background:${THC[k]}" class="${d.theme === k ? 'on' : ''}"></span>`).join('')}</div>
  <p><button class="btn p" id=sp>Simpan profil</button> <span class=muted id=pmsg></span></p></div>`;
  el.onclick = (e) => { const a = e.target.closest('[data-av]'), t = e.target.closest('[data-th]'); if (a) { d.avatar = +a.dataset.av; el.querySelectorAll('#avg span').forEach((x) => x.classList.toggle('on', x === a)); } if (t) { d.theme = t.dataset.th; applyTheme(d.theme); el.querySelectorAll('#thg span').forEach((x) => x.classList.toggle('on', x === t)); } };
  $('#sp').onclick = async () => { try { U = (await api('auth?a=profile', 'POST', { name: $('#pn_').value, nip: $('#pni').value, peran: $('#ppr').value, avatar: d.avatar, theme: d.theme })).user; applyTheme(U.theme); syncSelf(); shell(); } catch (x) { $('#pmsg').textContent = x.message; } };
}
TABS.unshift(['profil', 'Profil & Tampilan']);
setView = function () {
  $('#main').innerHTML = `<div class=set><div>${TABS.filter((t) => t[0] !== 'ref' || U.admin).map(([k, n]) => `<div class="t ${tab === k ? 'on' : ''}" data-t=${k}>${n}</div>`).join('')}</div><div id=pn></div></div><p class=muted style="text-align:center">Masuk sebagai ${esc(U.name)} · ${esc(U.email)}</p>`;
  document.querySelectorAll('.set [data-t]').forEach((e) => (e.onclick = () => { tab = e.dataset.t; setView(); }));
  ({ profil: pProfil, kode: pKode, pokja: pPokja, paket: pPaket, tpl: pTpl, ref: pRef, cad: pCad })[tab]($('#pn'));
};

/* ---------- paket: dropdown + ubah langsung ---------- */
PF.push(['eselon1', 'Eselon I / Direktorat Jenderal'], ['singkat', 'Nama singkat paket (untuk nama berkas; kosong = otomatis)']);
UI.pke = false;
const pfIn = (p, [k, lb, t, op]) => (t === 'sel' ? `<label>${lb}</label><select data-pf=${k}>${op.map((x) => `<option ${x === p[k] ? 'selected' : ''}>${esc(x)}</option>`).join('')}</select>` : `<label>${lb}</label><input type=${t || 'text'} data-pf=${k} value="${esc(p[k] ?? '')}">`);
const pktCount = (id) => D.surat.filter((s) => s.pid === id).length;
const pktLast = (id) => Math.max(0, ...D.surat.filter((s) => s.pid === id).map((s) => s.ts || 0));
paketSec = function () {
  const p = paketOf(L), list = D.paket.slice().sort((a, b) => pktLast(b.id) - pktLast(a.id));
  return `<section class=sec><div style="display:flex;justify-content:space-between;align-items:center"><label style="margin:0">1 · Paket</label><a data-pk2=toggle>${UI.pke ? 'Tutup editor' : 'Ganti / ubah paket'}</a></div>
  <div class=pkc style="margin-top:6px"><select id=pk>${list.map((x) => `<option value="${x.id}" ${x.id === L.pid ? 'selected' : ''}>${esc(x.nama)}${pktCount(x.id) ? ` · ${pktCount(x.id)} surat` : ''}</option>`).join('') || '<option value="">(belum ada paket)</option>'}</select>
  <div class=m style="margin-top:6px">${p ? `${pktCount(p.id)} surat dalam paket ini · <a data-pk2=riwayat>Riwayat paket</a> · ` : ''}<a data-pk2=baru>+ Paket baru</a></div></div>
  ${UI.pke && p ? `<div class=pke><div class=g2>${PF.map((f) => `<div class="${['nama', 'lokasi', 'ppk', 'singkat'].includes(f[0]) ? 'sp2' : ''}">${pfIn(p, f)}</div>`).join('')}</div></div>` : ''}
  <div class=nfo><b>Terisi dari paket:</b> nama paket, surat tugas, tanggal ST, satker, eselon I, pagu, HPS, lokasi, waktu pelaksanaan, jenis pengadaan, sumber dana, instansi, pejabat ST. <a data-pk2=toggle>Ubah</a></div><div id=wn>${warnHtml()}</div></section>`;
};
function rerender() { const f = $('#fm'), sc = f.scrollTop; form(); $('#fm').scrollTop = sc; prev(); }
const _wire0 = wire;
wire = function () {
  _wire0();
  const f = $('#fm'); if (f._x) return; f._x = 1;
  const ref = () => { const w = $('#wn'); if (w) w.innerHTML = warnHtml(); const n = $('#nmtxt'); if (n) n.innerHTML = numInfo(); prev(); };
  const live = (e) => {
    const x = e.target, d = x.dataset;
    if (d.pf) { const p = paketOf(L); if (p) { p[d.pf] = x.value; dirty(); ref(); } return; }
    if (d.pkadd !== undefined && e.type === 'change' && x.value) { (L.pkts ||= []).push(x.value); rerender(); return; }
    if (d.cat && e.type === 'change') { const n = +d.cat; L['kat' + n] = x.value; for (let i = n + 1; i <= 3; i++) L['kat' + i] = ''; rerender(); return; }
    if (d.k === 'tayangRef' && e.type === 'change') { lapFromTayang(x.value); return; }
    const g = $('#ngc'); if (g && (d.p || d.k)) g.innerHTML = ngBox(L);
  };
  f.addEventListener('input', live); f.addEventListener('change', live);
  f.addEventListener('click', (e) => {
    const x = e.target.closest('[data-pk2],[data-ng],[data-pkrm],[data-catpick]'); if (!x) return; const d = x.dataset;
    if (d.pk2 === 'toggle') { UI.pke = !UI.pke; rerender(); }
    else if (d.pk2 === 'riwayat') { curPk = L.pid; view = 'pkt'; shell(); }
    else if (d.pk2 === 'baru') { const n = { id: uid(), nama: 'Paket baru', instansi: S().instansi, pejabatST: S().pejabat, metode: 'Itemized', jenis: 'Barang', sumber: 'APBN', tahun: String(new Date().getFullYear()) }; D.paket.push(n); L.pid = n.id; UI.pke = true; dirty(); rerender(); }
    else if (d.ng) { const [c, i] = d.ng.split(':'); const a = (L.prods2 ||= []); if (c === 'add') a.push(defN()); else if (c === 'rm' && a.length > 1) a.splice(+i, 1); rerender(); }
    else if (d.pkrm) { L.pkts = (L.pkts || []).filter((q) => q !== d.pkrm); rerender(); }
    else if (d.catpick) { const [a, b, c] = d.catpick.split('|'); Object.assign(L, { kat1: a, kat2: b, kat3: c, katMode: 'Katalog INAPROC (Kementan)' }); rerender(); }
  });
};

/* ---------- riwayat paket ---------- */
const lastOf0 = lastOf;
lastOf = (pid, t) => D.surat.filter((s) => s.pid === pid && s.tpl === t).sort((a, b) => {
  const k = (s) => (t === 'eval' && itemsPes(norm(s)).length ? 1 : 0);
  return k(b) - k(a) || (+b.tayang || 0) - (+a.tayang || 0) || (b.ts || 0) - (a.ts || 0);
})[0];
function pktInfo(pid) {
  const ls = D.surat.filter((s) => s.pid === pid).map((s) => norm(s)).sort((a, b) => (a.tgl || '').localeCompare(b.tgl || '') || (a.ts || 0) - (b.ts || 0));
  const m = new Map();
  for (const s of ls) {
    if (!['eval', 'batal', 'ubah', 'nego'].includes(s.tpl)) continue;
    const n = +s.tayang || 1, t = m.get(n) || { n, ubah: [], tgls: [] }; m.set(n, t); t.tgls.push(s.tgl);
    if (s.tpl === 'batal') t.batal = s; else if (s.tpl === 'eval') t.eval = s; else if (s.tpl === 'ubah') t.ubah.push(s); else t.nego = s;
  }
  const tn = [...m.values()].sort((a, b) => a.n - b.n);
  tn.forEach((t) => { t.st = t.batal ? 'batal' : t.eval && winnerOf(itemsPes(t.eval), t.eval.items[0].win) ? 'selesai' : 'jalan'; });
  const by = (t) => ls.filter((s) => s.tpl === t), lap = by('lap').pop(), bukti = by('bukti').pop(), dmk = by('dmk').pop();
  const last = tn[tn.length - 1];
  const status = lap ? 'Selesai' : !last ? 'Belum tayang' : last.st === 'batal' ? 'Batal' : 'Tayang';
  const ev = [...tn].reverse().find((t) => t.eval && t.st === 'selesai'), ng = ls.filter((s) => s.tpl === 'nego').pop();
  const w = ev ? winnerOf(itemsPes(ev.eval), ev.eval.items[0].win) : null;
  return { ls, tn, lap, bukti, dmk, last, status, ev, w, nego: ng };
}
function pktNext(I) {
  if (I.lap) return null;
  const o = (s) => ({ open: s.id });
  if (!I.dmk && !I.tn.length) return { t: 'Buat dokumen mini kompetisi dulu.', b: 'Buat dokumen mini kompetisi', tpl: 'dmk' };
  if (!I.last) return { t: 'Paket belum tayang — isi BA hasil evaluasi setelah penayangan selesai.', b: 'Isi BA hasil evaluasi', tpl: 'eval' };
  if (I.last.st === 'batal') return { t: `Tayang ${I.last.n} dibatalkan. Siapkan tayang ${I.last.n + 1}.`, b: `Isi BA hasil evaluasi tayang ${I.last.n + 1}`, tpl: 'eval', ex: { tayang: String(I.last.n + 1) }, b2: ['Perpanjang / ubah paket', 'ubah', { tayang: String(I.last.n + 1) }] };
  if (I.last.st === 'jalan') return { t: `Tayang ${I.last.n} sedang berjalan. Isi peserta dari papan peringkat setelah penayangan selesai.`, b: 'Isi BA hasil evaluasi', ...(I.last.eval ? o(I.last.eval) : { tpl: 'eval', ex: { tayang: String(I.last.n) } }), c: ['BA pembatalan (tanpa/1 penawar)', 'batal', { tayang: String(I.last.n) }] };
  if (!I.bukti) return { t: 'Pemenang sudah ditetapkan. Lanjutkan klarifikasi & pembuktian kualifikasi.', b: 'Buat undangan pembuktian', tpl: 'bukti', b2: ['BA kesepakatan negosiasi harga', 'nego', { tayang: String(I.last.n) }] };
  return { t: 'Pembuktian selesai. Susun laporan hasil pemilihan untuk PPK.', b: 'Buat laporan hasil pemilihan', tpl: 'lap' };
}
const guessTayang = (pid, tpl) => {
  const I = pktInfo(pid); if (!I.last) return '1';
  if (tpl === 'eval' && I.last.st === 'batal') return String(I.last.n + 1);
  return String(I.last.n);
};
const _nl0 = newLetter;
newLetter = function (tpl, from) {
  const l = _nl0(tpl, from);
  if (['eval', 'batal', 'ubah', 'nego'].includes(tpl) && l.pid && !l.tayang) l.tayang = guessTayang(l.pid, tpl);
  if (tpl === 'nego') { l.prods2 ||= [defN()]; l.ppn ??= '11'; }
  if (tpl === 'lap' && l.pid) { const I = pktInfo(l.pid); if (I.tn.some((t) => t.st === 'batal')) l.ulang = true; const u = lastOf(l.pid, 'ubah'); const ub = u && (u.items || []).filter((x) => x.t === 'tayang' && x.baru).pop(); if (ub && !l.selesai) l.selesai = ub.baru; }
  return l;
};
const openNew = (tpl, pid, ex) => openLetter(Object.assign(newLetter(tpl, { pid }), ex || {}));
const alasanTxt = (b) => listID(b.alasanSel || []) + (b.alasanTxt ? ((b.alasanSel || []).length ? '; ' : '') + b.alasanTxt : '');
function pktBoard(I) {
  const cols = I.tn.slice();
  if (!cols.length || cols[cols.length - 1].st === 'batal') cols.push({ n: (cols.length ? cols[cols.length - 1].n : 0) + 1, st: 'belum', ubah: [], tgls: [] });
  const cell = (t) => {
    const ts = (t.tgls || []).filter(Boolean).sort(), rng = ts.length ? (sd(ts[0]) === sd(ts[ts.length - 1]) ? sd(ts[0]) : sd(ts[0]) + '–' + sd(ts[ts.length - 1])) : '';
    const ub = t.ubah && t.ubah.length ? (t.ubah[t.ubah.length - 1].items || []).filter((x) => x.t === 'tayang' && x.baru).pop() : null;
    const src = t.batal || t.eval, no = src ? (src.no ? 'BA ' + src.no : 'BA belum bernomor') + ', ' + sd(src.tgl) : '';
    let stamp = '<div class="stp n">BELUM</div>', tx2 = 'Belum ada BA.';
    if (t.st === 'batal') { stamp = `<div class="stp r">BATAL<small>${esc(alasanTxt(t.batal).slice(0, 34) || 'dibatalkan')}</small></div>`; tx2 = 'Pembatalan paket, ' + esc(alasanTxt(t.batal) || '—'); }
    if (t.st === 'jalan') { stamp = '<div class="stp a">BERJALAN</div>'; tx2 = 'Peserta belum diisi'; }
    if (t.st === 'selesai') { const w = winnerOf(itemsPes(t.eval), t.eval.items[0].win); stamp = '<div class="stp g">SELESAI<small>ada pemenang</small></div>'; tx2 = `Pemenang: ${esc(w.nama)}<br>${rp(w.nilai)}`; }
    return `<div><h5>Tayang ${t.n}</h5><span class=m>${rng}</span>${ub ? `<span class="bd m" style="margin-top:4px;display:inline-block">diperpanjang s.d. ${sd(ub.baru)}</span>` : ''}<div>${stamp}</div>${tx2}<span class=m>${no}</span></div>`;
  };
  const lap = I.lap ? `<div class="stp g">TERKIRIM</div><span class=m>${I.lap.no ? 'Nomor ' + I.lap.no : 'belum bernomor'}, ${sd(I.lap.tgl)}</span>` : '<span class=m>belum</span>';
  return `<div class=bd2><div style="min-width:70px"><h5 style="margin-top:34px">Paket</h5></div>${cols.map(cell).join('')}<div><h5>Laporan</h5>${lap}</div></div>`;
}
const ubSum = (s) => (s.items || []).map((x) => (x.t === 'tayang' ? `perpanjangan masa tayang s.d. ${sd(x.baru)}` : x.komp || x.uraian || 'perubahan lain')).join('; ');
function pktView() { curPk && D.paket.find((p) => p.id === curPk) ? pktDetail() : pktList(); }
function pktList() {
  const q = (pktList.q || '').toLowerCase();
  const rows = D.paket.filter((p) => !q || (p.nama + (p.rup || '')).toLowerCase().includes(q)).sort((a, b) => pktLast(b.id) - pktLast(a.id));
  const cls = { Tayang: 'a', Batal: 'r', Selesai: 'g', 'Belum tayang': 'n' };
  $('#main').innerHTML = `<div class=head><h1>Paket & Riwayat</h1><input id=pq placeholder="Cari paket…" value="${esc(pktList.q || '')}" style="max-width:260px;margin-left:auto"><button class="btn p" id=pnb>+ Paket baru</button></div>
  <div class=pkg>${rows.map((p) => { const I = pktInfo(p.id); return `<div class=pkd data-pk=${p.id}><span class="stp ${cls[I.status]}" style="transform:none;font-size:11px;padding:1px 8px;border-width:2px">${I.status.toUpperCase()}</span><b>${esc(p.nama || '(tanpa nama)')}</b><span class=m>${esc(p.satker || '')}</span><div class=m style="margin-top:8px">HPS ${rp(num(p.hps))} · ${I.ls.length} surat · ${I.tn.length} tayang</div></div>`; }).join('') || '<p class=muted>Belum ada paket.</p>'}</div>`;
  $('#pq').oninput = (e) => { pktList.q = e.target.value; const c = e.target.selectionStart; pktList(); $('#pq').focus(); $('#pq').setSelectionRange(c, c); };
  $('#pnb').onclick = () => { const n = { id: uid(), nama: 'Paket baru', instansi: S().instansi, pejabatST: S().pejabat, metode: 'Itemized', jenis: 'Barang', sumber: 'APBN', tahun: String(new Date().getFullYear()) }; D.paket.push(n); pe = n.id; tab = 'paket'; view = 'set'; dirty(); shell(); };
  document.querySelectorAll('.pkd').forEach((c) => (c.onclick = () => { curPk = c.dataset.pk; pktView(); }));
}
function pktDetail() {
  const p = D.paket.find((x) => x.id === curPk), I = pktInfo(p.id), nx = pktNext(I);
  const kv2 = [['Satuan kerja', p.satker], ['HPS', rp(num(p.hps))], ['Pagu', rp(num(p.pagu))], ['Surat tugas', p.stNo ? `${p.stNo} · ${tgl(p.stTgl)}` : '—'], ['Mini kompetisi', `<i>${esc(p.metode || 'Itemized')}</i>, 1 item`], ['Kode RUP', p.rup || '—'], ['Lokasi', p.lokasi || '—'], ['Penyelesaian', p.waktu ? tgl(p.waktu) : '—']];
  const btn = (b, tpl, ex, open) => `<button class="btn p" style="width:100%;margin:6px 0" data-nx="${open ? 'o:' + open : 'n:' + tpl}" data-ex='${JSON.stringify(ex || {})}'>${esc(b)}</button>`;
  $('#main').innerHTML = `<a id=bk>‹ Semua paket</a><div class=head style="margin-top:6px;align-items:flex-start"><h1 style="max-width:760px;line-height:1.2">${esc(p.nama)}</h1><select id=mk style="max-width:240px;margin-left:auto"><option value="">+ Buat surat di paket ini…</option>${KEYS.map((k) => `<option value=${k}>${esc(TPL[k].n)}</option>`).join('')}</select></div>
  <div class=kvh>${kv2.map(([a, b]) => `<div><small>${a}</small><b>${typeof b === 'string' && b.includes('<i>') ? b : esc(b || '—')}</b></div>`).join('')}</div>
  <div class=gr2><div class=card><h3>Papan riwayat</h3><p class=muted style="margin-top:-8px">Setiap kolom satu tahap pemilihan: tayang, pembatalan, atau selesai.</p>${pktBoard(I)}</div>
  <div class=card><h3>Langkah berikutnya</h3>${nx ? `<p class=muted>${esc(nx.t)}</p>${btn(nx.b, nx.tpl, nx.ex, nx.open)}${nx.b2 ? `<button class=btn style="width:100%;margin:2px 0" data-nx="n:${nx.b2[1]}" data-ex='${JSON.stringify(nx.b2[2])}'>${esc(nx.b2[0])}</button>` : ''}${nx.c ? `<p><a data-nx="n:${nx.c[1]}" data-ex='${JSON.stringify(nx.c[2])}'>${esc(nx.c[0])}</a></p>` : ''}` : '<p class=muted>Semua tahap sudah selesai ✓</p>'}</div></div>
  <div class=card><h3>Semua surat dalam paket</h3><p class=muted style="margin-top:-8px">Urut tanggal, terbaru di bawah.</p>${I.ls.map((s) => { const t = I.tn.find((x) => x.n === +s.tayang), dot = s.tpl === 'batal' ? 'r' : s.tpl === 'eval' && t && t.st === 'selesai' ? 'g' : '';
    const sub = s.tpl === 'batal' ? 'batal — ' + esc(alasanTxt(s) || '') : s.tpl === 'eval' ? (winnerOf(itemsPes(s), s.items[0].win) ? 'pemenang: ' + esc(winnerOf(itemsPes(s), s.items[0].win).nama) : 'berjalan') : s.tpl === 'ubah' ? esc(ubSum(s)) : s.tpl === 'nego' ? 'nilai akhir ' + rn(negoCalc(s).final) : 'dibuat ' + esc(s.by || '');
    return `<div class=tl><div class=d>${s.tgl ? pd(s.tgl).getDate() : '—'}<small>${s.tgl ? MON[pd(s.tgl).getMonth()] : ''}</small></div><div class="o ${dot}"></div><div><b>${esc(TPL[s.tpl].n)}${['eval', 'batal', 'ubah', 'nego'].includes(s.tpl) ? `<span class=tg>Tayang ${s.tayang || 1}</span>` : ''}</b><span class=m>${sub}</span></div><div class=m style="text-align:right">${TPL[s.tpl].nonum ? '' : s.no ? 'No. ' + s.no : 'belum bernomor'} &nbsp;<a data-o=${s.id}><b>Buka</b></a> · <a data-c=${s.id}>Buat lagi</a></div></div>`; }).join('') || '<p class=muted>Belum ada surat di paket ini.</p>'}</div>`;
  $('#bk').onclick = () => { curPk = null; pktView(); };
  $('#mk').onchange = (e) => e.target.value && openNew(e.target.value, p.id);
  $('#main').onclick = (e) => {
    const o = e.target.closest('[data-o]'), c = e.target.closest('[data-c]'), n = e.target.closest('[data-nx]');
    if (o) openLetter(clone(D.surat.find((x) => x.id === o.dataset.o)));
    if (c) { const x = D.surat.find((y) => y.id === c.dataset.c); openLetter(newLetter(x.tpl, x)); }
    if (n) { const [k, v] = n.dataset.nx.split(':'); if (k === 'o') openLetter(clone(D.surat.find((x) => x.id === v))); else openNew(v, p.id, JSON.parse(n.dataset.ex || '{}')); }
  };
}
const tayangBox = () => `<div class=fld style="margin-top:8px"><label>Tayang ke- <span class=muted>(untuk riwayat paket)</span></label><select data-k=tayang>${[1, 2, 3, 4, 5, 6].map((n) => `<option value=${n} ${String(L.tayang || 1) === String(n) ? 'selected' : ''}>Tayang ${n}</option>`).join('')}</select></div>`;
function lapFromTayang(n) {
  const e = D.surat.filter((s) => s.pid === L.pid && s.tpl === 'eval' && String(s.tayang || 1) === String(n)).sort((a, b) => (b.ts || 0) - (a.ts || 0))[0];
  if (!e) return; norm(e); L.pes = clone(e.items[0].pes); L.win = e.items[0].win; L.baNo = nomor(e); L.baTgl = e.tgl; rerender();
}
const _ms0 = missing;
missing = function () {
  const m = _ms0(), t = L.tpl;
  if (t === 'nego') {
    if (!L.prov) m.push(['Penyedia negosiasi', '[data-k=prov]']);
    if (!(L.prods2 || []).some((x) => x.nama && fl(x.vol) && fl(x.hNego))) m.push(['Produk & harga negosiasi', '[data-p^="prods2."]']);
    if (!angOf(L).length) m.push(['Anggota Pokja', '#angq']);
  }
  return m;
};

/* ---------- BA Kesepakatan Negosiasi Harga ---------- */
const defN = () => ({ nama: '', vol: '', sat: '', hTayang: '', hNego: '' });
function negoCalc(l) {
  const ps = l.prods2 || [], sum = (f) => ps.reduce((a, x) => a + f(x), 0);
  const barang = sum((x) => fl(x.vol) * fl(x.hNego)), barangT = sum((x) => fl(x.vol) * fl(x.hTayang)), ongT = fl(l.ongT), ongN = fl(l.ongN);
  const rate = l.ppn === '' || l.ppn == null ? 11 : fl(l.ppn), base = (l.ppnB ? barang : 0) + ((l.ppnO ?? true) ? ongN : 0);
  const ppn = Math.round((base * rate) / 100), akhir = Math.round(barang + ongN + ppn), ov = fl(l.akhirOv);
  return { barang, barangT, ongT, ongN, rate, ppn, akhir, final: ov || akhir };
}
const ngBox = (l) => { const c = negoCalc(l); return `Barang (volume × harga negosiasi) <b style="float:right">${rn(c.barang)}</b><br>Ongkos kirim <b style="float:right">${rn(c.ongN)}</b><br>PPN ${c.rate}% <b style="float:right">${rn(c.ppn)}</b><br><b>Nilai akhir (dihitung)</b> <b style="float:right">${c.akhir ? rn(c.akhir) : '—'}</b>`; };
const tglKata = (s) => { const d = pd(s || today()); return `${hari(s || today())} tanggal ${d.getDate()} (${tb(d.getDate())}) bulan ${BL[d.getMonth()]} tahun ${d.getFullYear()} (${tb(d.getFullYear())})`; };
R.nego = function (l, p) {
  const c = negoCalc(l), ps = (l.prods2 || []).filter((x) => x.nama || x.vol || x.hNego), nm = l.kegiatan || p.nama;
  const akun = (D.pokja.find((x) => x.id === l.akun) || angOf(l)[0]?.p || {}).nama || '......';
  const n0 = (x) => (fl(x) ? Math.round(fl(x) * 100) / 100 : 0).toLocaleString('id-ID');
  const trs = ps.map((x, i) => `<tr><td style="text-align:center">${i + 1}</td><td>${esc(x.nama)}</td><td style="text-align:right">${n0(x.vol)}</td><td>${esc(x.sat)}</td><td style="text-align:right">${rn(fl(x.hTayang))}</td><td style="text-align:right">${rn(fl(x.hNego))}</td><td style="text-align:right">${rn(fl(x.vol) * fl(x.hNego))}</td></tr>`).join('') || '<tr><td colspan=7 style="height:26px"></td></tr>';
  const tot = (lb, v) => `<tr><td colspan=6 style="text-align:right"><b>${lb}</b></td><td style="text-align:right"><b>${v}</b></td></tr>`;
  const ong = fl(l.ongT) || fl(l.ongN) ? `<tr><td></td><td colspan=3>Ongkos Kirim${fl(l.berat) ? ` (${n0(l.berat)} kg)` : ''}</td><td style="text-align:right">${rn(c.ongT)}</td><td style="text-align:right">${rn(c.ongN)}</td><td style="text-align:right">${rn(c.ongN)}</td></tr>` : '';
  return `<p class=tc style="margin:0">BERITA ACARA HASIL EVALUASI KESEPAKATAN NEGOSIASI HARGA<br>PADA PENGADAAN BARANG</p><p class=tc style="font-weight:400;margin-top:4px">Nomor: ${nomor(l)}</p>
  <p>Pada hari ini ${tglKata(l.tgl)}, kami selaku Kelompok Kerja (Pokja) Pemilihan berdasarkan Surat Tugas ${esc(p.pejabatST || S().pejabat)} Nomor: ${esc(p.stNo)} tanggal ${tgl(p.stTgl)}, pada:</p>
  ${kv([['Nama Paket', esc(nm)], ['Nama Instansi/Satuan Kerja', esc([p.satker, p.eselon1].filter(Boolean).join(', ') + ' – ' + (p.instansi || S().instansi))], ['Nilai Pagu Anggaran', rn(num(p.pagu))], ['Nilai Harga Perkiraan Sendiri (HPS)', rn(num(p.hps))], ['Sumber Anggaran', esc(p.sumber)], ['Lokasi Pekerjaan/Pengiriman', esc(p.lokasi)], ['Waktu Penyelesaian Pekerjaan', tgl(p.waktu)]], 215)}
  <p>Dengan ini kami Pokja Pemilihan telah melakukan proses <i>E-Purchasing</i> dengan metode Negosiasi Harga terhadap Pelaku Usaha/Penyedia <b>${esc(l.prov || '......')}</b> melalui Aplikasi Katalog Elektronik dengan rincian sebagai berikut:</p>
  <table class=b style="margin:6px 0;font-size:10.5pt"><tr><th style="width:30px">No</th><th>Nama Barang/Jasa</th><th style="width:62px">Volume</th><th style="width:56px">Satuan</th><th style="width:15%">Harga Tayang (per satuan)</th><th style="width:15%">Harga Hasil Negosiasi (per satuan)</th><th style="width:17%">Jumlah Hasil Negosiasi</th></tr>${trs}${ong}
  ${(l.ppnB || (l.ppnO ?? true)) && c.ppn ? `<tr><td></td><td colspan=5>PPN ${c.rate}%${l.ppnB && (l.ppnO ?? true) ? ' atas barang dan ongkos kirim' : l.ppnB ? ' atas barang' : ' atas ongkos kirim'}</td><td style="text-align:right">${rn(c.ppn)}</td></tr>` : ''}${tot('Nilai Akhir Hasil Negosiasi', rn(c.final))}</table>
  <p style="margin-top:2px">Terbilang: <i>${esc(cap(tb(Math.round(c.final)) || 'nol'))} Rupiah</i></p>
  <p>Berdasarkan atas proses Negosiasi Harga yang telah dilakukan oleh Pokja Pemilihan menyatakan dan menyepakati bahwa:</p>
  ${ol(['Para anggota Pokja Pemilihan telah melakukan seluruh proses negosiasi dan menyetujui barang/jasa yang telah dilakukan negosiasi kepada Pelaku Usaha/Penyedia pada Aplikasi Katalog Elektronik sesuai ketentuan yang berlaku.', `Pokja Pemilihan menunjuk dan melimpahkan kewenangan kepada Pokja Pemilihan <b>${esc(akun)}</b> <i>(salah satu anggota Pokja Pemilihan)</i> untuk melakukan proses pemilihan Negosiasi pada Aplikasi Katalog Elektronik. Namun, tidak melepaskan segala keputusan dan tanggung jawab setiap anggota Pokja Pemilihan.`, 'Segala keputusan dan tindakan yang disepakati oleh seluruh anggota Pokja Pemilihan pada proses <i>E-Purchasing</i> dengan Metode Negosiasi Harga sebagaimana diatur di dalam Berita Acara ini merupakan kesepakatan bersama yang sah.', 'Apabila terdapat perbedaan antara Berita Acara dengan hasil dalam Aplikasi Katalog Elektronik, maka yang digunakan adalah informasi dan keputusan yang terdapat dalam Berita Acara ini.'])}
  <p>Demikian Berita Acara Hasil Evaluasi Kesepakatan Negosiasi Harga dibuat untuk dipergunakan sebagaimana mestinya.</p>${angTable(l, { num: false })}`;
};
FB.nego = function () {
  const ps = (L.prods2 ||= [defN()]);
  const ws = [...new Set(D.surat.filter((s) => s.pid === L.pid && s.tpl === 'eval').map((s) => { norm(s); const w = winnerOf(itemsPes(s), s.items[0].win); return w && w.nama; }).filter(Boolean))];
  const pin = (i, k, lb, ph) => `<div><label>${lb}</label><input data-p="prods2.${i}.${k}" value="${esc(ps[i][k])}" placeholder="${ph}"></div>`;
  return sec(2, 'Pelaku usaha/penyedia', `<div class=chs>${ws.map((n) => `<span class="ch ${L.prov === n ? 'on' : ''}" data-q="prov=${esc(n)}">${L.prov === n ? '✓ ' : ''}${esc(n)}</span>`).join('')}</div>${fx('prov', 'Nama penyedia', { ph: 'mis. Koperasi Produsen Perwira Cipta Mandiri' })}`)
    + sec(3, 'Barang/jasa yang dinegosiasikan', ps.map((x, i) => `<div class=card2><div class=r1><span class=n>${i + 1}</span><input data-p="prods2.${i}.nama" value="${esc(x.nama)}" placeholder="Nama produk, mis. Benih Tebu Varietas Bululawang"><button class=ib data-ng="rm:${i}">×</button></div><div class=g2>${pin(i, 'vol', 'Volume', 'mis. 1389000')}${pin(i, 'sat', 'Satuan', 'mis. mata, batang, kg')}${pin(i, 'hTayang', 'Harga tayang /satuan', 'mis. 166')}${pin(i, 'hNego', 'Harga hasil negosiasi /satuan', 'mis. 131')}</div></div>`).join('') + '<p><a data-ng="add:0">+ Tambah produk</a></p>')
    + sec(4, 'Ongkos kirim & pajak', `<div class=g2>${fx('ongT', 'Ongkir tayang (total)', { ph: 'mis. 610050000' })}${fx('ongN', 'Ongkir hasil negosiasi', { ph: 'mis. 610050000' })}${fx('berat', 'Berat kiriman (kg)', { ph: 'mis. 166680' })}${fx('ppn', 'Tarif PPN (%)', { val: '11' })}</div>${chk('ppnB', 'PPN atas barang', false)}${chk('ppnO', 'PPN atas ongkos kirim', true)}<div class=zb id=ngc>${ngBox(L)}</div>${fx('akhirOv', 'Timpa nilai akhir (kosong = pakai hasil hitung)', { ph: 'mis. 610050000' })}`)
    + sec(5, 'Nomor & tanggal', numBox('Tanggal BA'))
    + more('Lainnya — anggota Pokja & tanda tangan, pemegang akun katalog', `${angPanel()}<div class=fld><label>Pokja pemegang akun katalog <span class=muted>(butir 2 kesepakatan)</span></label><select data-k=akun>${L.angs.map((a) => { const q = D.pokja.find((x) => x.id === a.id); return q ? `<option value="${q.id}" ${q.id === L.akun ? 'selected' : ''}>${esc(q.nama)}</option>` : ''; }).join('')}</select></div>${kertasBln()}`);
};
TPL.nego = { n: 'BA kesepakatan negosiasi harga', d: 'Berita acara hasil evaluasi kesepakatan negosiasi harga (produk, harga tayang vs negosiasi, PPN, nilai akhir).', i: '⚖' };
{ // urutan menu mengikuti alur kerja
  const ord = ['reviu', 'dmk', 'ubah', 'eval', 'batal', 'nego', 'bukti', 'lap'], old = { ...TPL };
  Object.keys(TPL).forEach((k) => delete TPL[k]); ord.forEach((k) => (TPL[k] = old[k])); KEYS.length = 0; KEYS.push(...ord);
}

/* ---------- BA Perubahan Paket: tabel Semula | Perubahan ---------- */
R.ubah = function (l, p) {
  const nm = l.kegiatan || p.nama;
  const rows = (l.items || []).map((x, i) => {
    let a, b;
    if (x.t === 'tayang') {
      a = `Batas akhir masa tayang (batas akhir pemasukan penawaran) Paket Kompetisi pada Katalog Elektronik INAPROC:<br><br>${dtm2(x.semula)}`;
      b = `Batas akhir masa tayang (batas akhir pemasukan penawaran) Paket Kompetisi pada Katalog Elektronik INAPROC diperpanjang menjadi:<br><br>${dtm2(x.baru)}`;
    } else { const lab = x.komp ? `<b>${esc(x.komp)}</b><br>` : ''; a = lab + nl(x.semula || ''); b = lab + nl(x.baru || x.uraian || ''); }
    return `<tr><td style="text-align:left">${i + 1}.</td><td style="text-align:justify">${a}</td><td style="text-align:justify">${b}</td></tr>`;
  }).join('');
  return `<p class=tc style="margin:0">BERITA ACARA PERUBAHAN PAKET KOMPETISI BARANG</p><p class=tc style="font-weight:400;margin-top:4px">Nomor: ${nomor(l)}</p>
  <p>Pada hari ini ${kataTgl(l.tgl)}, kami Kelompok Kerja (Pokja) Pemilihan ${esc(nm)} UKPBJ ${esc(p.instansi || S().instansi)} yang ditetapkan berdasarkan Surat Tugas ${esc(p.pejabatST || S().pejabat)} Nomor: ${esc(p.stNo)} tanggal ${tgl(p.stTgl)} melaksanakan proses <i>E-Purchasing</i> menggunakan metode Mini-Kompetisi untuk paket Kompetisi sebagai berikut:</p>
  ${rowsPaket(l, p, [['Kode RUP', esc(p.rup)], ['Metode Pemilihan', 'E-Purchasing melalui Mini Kompetisi Katalog Elektronik']])}
  <p>Berdasarkan Paket Kompetisi yang telah dibuat dan dipublikasikan kepada Peserta Kompetisi, Pokja Pemilihan ${esc(nm)} memutuskan untuk melakukan perubahan Paket Kompetisi sebagai berikut:</p>
  <table class=b style="margin:6px 0"><tr><th style="width:44px">No.</th><th>Semula</th><th>Perubahan</th></tr>${rows || '<tr><td colspan=3 style="height:26px"></td></tr>'}</table>
  <p>Perubahan Paket Kompetisi yang dilakukan oleh Pokja Pemilihan ${esc(nm)} mengacu pada ketentuan yang diatur pada Keputusan Kepala LKPP Nomor 93 Tahun 2025 dan/atau ketentuan yang berlaku. Setelah perubahan Paket Kompetisi disimpan, aplikasi Katalog Elektronik memperbarui Paket Kompetisi sesuai dengan informasi yang telah diubah oleh Pokja Pemilihan.</p>
  <p>Segala keputusan dan tindakan yang disepakati oleh seluruh anggota Kelompok Kerja (Pokja) Pemilihan pada proses Perubahan Paket Kompetisi sebagaimana diatur di dalam Berita Acara ini merupakan kesepakatan bersama yang sah.</p>
  <p>Demikian Berita Acara Perubahan Paket Kompetisi dibuat untuk dipergunakan sebagaimana mestinya.</p>${angTable(l, { title: 'Pokja Pemilihan ' + nm, num: false, plain: true })}`;
};
FB.ubah = function () {
  const it = (x, i) => `<div class=card2><div class=r1><span class=n>${i + 1}</span><div class=seg>${[['tayang', 'Perpanjangan masa tayang'], ['lain', 'Perubahan lain']].map(([t, n]) => `<a class="${x.t === t ? 'on' : ''}" data-act="ubt:${i}|${t}">${n}</a>`).join('')}</div><button class=ib data-act="ubr:${i}">×</button></div>${x.t === 'tayang'
    ? `<div class=g2><div class=fld><label>Batas akhir semula</label><input type=datetime-local data-p="items.${i}.semula" value="${esc(x.semula)}"><small class=muted data-dtm="items.${i}.semula"></small></div><div class=fld><label>Diperpanjang menjadi</label><input type=datetime-local data-p="items.${i}.baru" value="${esc(x.baru)}"><small class=muted data-dtm="items.${i}.baru"></small></div></div><p class=muted>Jadwal tayang paket ikut diperbarui, jadi laporan hasil pemilihan memakai batas akhir yang baru.</p>`
    : `<div class=fld><label>Komponen yang diubah (judul baris, opsional)</label><input data-p="items.${i}.komp" value="${esc(x.komp || '')}" placeholder="mis. Volume / Spesifikasi / Lokasi pengiriman"></div><div class=fld><label>Semula</label><textarea data-p="items.${i}.semula">${esc(x.semula || '')}</textarea></div><div class=fld><label>Perubahan (menjadi)</label><textarea data-p="items.${i}.baru">${esc(x.baru || x.uraian || '')}</textarea></div>`}</div>`;
  return sec(2, 'Perubahan paket kompetisi (tabel Semula | Perubahan)', L.items.map(it).join('') + '<button class="btn s" data-act="uba:tayang">+ Perpanjangan masa tayang</button> <button class="btn s" data-act="uba:lain">+ Perubahan lain</button>')
    + sec(3, 'Nomor & tanggal', numBox('Tanggal BA')) + sec(4, 'Anggota Pokja', angPanel()) + more('Lainnya — bulan nomor, kertas', kertasBln());
};

/* ---------- Dokumen Mini Kompetisi: banyak paket, kategori katalog, KBLI ---------- */
const CAT = {
  'Tanaman dan Sarana Pendukung': { 'Benih Tanaman Perkebunan': ['Benih Tanaman Semusim', 'Benih Tanaman Tahunan'], 'Benih Tanaman Pangan': ['Benih Padi', 'Benih Jagung', 'Benih Kedelai'], 'Pupuk': ['Pupuk Anorganik', 'Pupuk Organik', 'Pupuk Hayati', 'Pembenah Tanah'], 'Pestisida': ['Insektisida', 'Fungisida', 'Herbisida'] },
  'Peternakan dan Kesehatan Hewan': { 'Ternak': ['Sapi', 'Kambing/Domba', 'Unggas'], 'Pakan': ['Pakan Ternak', 'Bahan Pakan'], 'Obat Hewan': ['Vaksin', 'Obat dan Vitamin'] },
  'Alat dan Mesin Pertanian': { 'Alat dan Mesin Pra-Panen': ['Traktor', 'Pompa Air'], 'Alat dan Mesin Pasca-Panen': ['Pengering', 'Penggiling'] },
  'Perlengkapan Kantor dan Penyuluh': { 'Pakaian Kerja': ['Seragam Penyuluh', 'Pakaian Lapangan'], 'Perlengkapan Lapangan': ['Sepatu dan Topi', 'Tas dan Alat Tulis'] },
};
const catFlat = () => Object.entries(CAT).flatMap(([a, m]) => Object.entries(m).flatMap(([b, c]) => c.map((x) => [a, b, x])));
const _dmk0 = R.dmk;
R.dmk = function (l, p, v) {
  const sd0 = D.tpl.dmkDasar, sp0 = S().penutupMK, hadD = 'dmkDasar' in D.tpl;
  if (l.dasarOv) D.tpl.dmkDasar = l.dasarOv; if (l.penutupMK) S().penutupMK = l.penutupMK;
  let h; try { h = _dmk0(l, p, v); } finally { if (hadD) D.tpl.dmkDasar = sd0; else delete D.tpl.dmkDasar; S().penutupMK = sp0; }
  const ps = [p, ...(l.pkts || []).map((id) => D.paket.find((x) => x.id === id)).filter(Boolean)], n = ps.length;
  h = h.replace(`<tr><td>1</td><td>${esc(p.nama)}</td><td style="text-align:center">${esc(p.rup)}</td></tr>`, ps.map((q, i) => `<tr><td>${i + 1}</td><td>${esc(q.nama)}</td><td style="text-align:center">${esc(q.rup)}</td></tr>`).join(''));
  h = h.replace('1 (satu) paket', `${n} (${tb(n)}) paket`);
  const kb = lines(l.kbli);
  if (l.kbliOn && kb.length) h = h.replace(/(Kategori Tingkat III<\/th><td>[^<]*<\/td><\/tr><\/table>)/, `$1<p style="margin:8px 0 2px">Klasifikasi Baku Lapangan Usaha Indonesia (KBLI) yang dipersyaratkan bagi Penyedia Katalog:</p>${ol(kb.map(esc))}`);
  return h;
};
FB.dmk = function () {
  const p = paketOf(L) || {}, extra = (L.pkts || []).map((id) => D.paket.find((x) => x.id === id)).filter(Boolean), all = [p, ...extra], mode = L.katMode || 'Katalog INAPROC (Kementan)', q = (L.katQ || '').toLowerCase();
  const rupDup = all.map((x, i) => all.slice(0, i).find((y) => y.rup && y.rup === x.rup) ? `<div class=nfo style="background:var(--f)">ID RUP paket ${i + 1} sama dengan paket lain (${esc(x.rup)}) — setiap paket dilaksanakan sesuai ID RUP masing-masing.</div>` : '').join('');
  const sel = (n, arr, v) => `<select data-cat=${n}><option value="">— pilih —</option>${arr.map((x) => `<option ${x === v ? 'selected' : ''}>${esc(x)}</option>`).join('')}</select>`;
  const hits = q ? catFlat().filter((r) => r.join(' ').toLowerCase().includes(q)).slice(0, 6) : [];
  const cat = mode.startsWith('Katalog')
    ? `<input data-k=katQ placeholder="Cari, mis. benih tahunan, pupuk npk, sapi, seragam" value="${esc(L.katQ || '')}">${hits.map((r) => `<div class=nt data-catpick="${esc(r.join('|'))}" style="margin:6px 0;padding:8px 10px"><span><b>${esc(r[2])}</b>${esc(r[0])} › ${esc(r[1])}</span></div>`).join('')}${sel(1, Object.keys(CAT), L.kat1)}${sel(2, L.kat1 && CAT[L.kat1] ? Object.keys(CAT[L.kat1]) : [], L.kat2)}${sel(3, L.kat1 && L.kat2 && CAT[L.kat1] && CAT[L.kat1][L.kat2] ? CAT[L.kat1][L.kat2] : [], L.kat3)}<p class=muted>Daftar kategori contoh — bila kategori katalog Anda tidak ada, pilih “Isi sendiri”.</p>`
    : `${fx('kat1', 'Kategori Tingkat I')}${fx('kat2', 'Kategori Tingkat II')}${fx('kat3', 'Kategori Tingkat III')}`;
  return sec(2, `Daftar paket (${all.length})`, `<div class=pkc><b style="font-size:13px">1. ${esc(p.nama || '—')}</b><span class=m>ID RUP ${esc(p.rup || '—')}</span></div>${extra.map((x, i) => `<div class=pkc style="margin-top:6px;display:flex;gap:8px;align-items:center"><span style="flex:1"><b style="font-size:13px">${i + 2}. ${esc(x.nama)}</b><br><span class=m>ID RUP ${esc(x.rup || '—')}</span></span><button class=ib data-pkrm="${x.id}">×</button></div>`).join('')}<select data-pkadd style="margin-top:8px"><option value="">+ Tambah paket sejenis…</option>${D.paket.filter((x) => !all.includes(x)).map((x) => `<option value="${x.id}">${esc(x.nama)}</option>`).join('')}</select>${rupDup}`)
    + sec(3, 'Kategori produk', `${seg('katMode', ['Katalog INAPROC (Kementan)', 'Isi sendiri'])}<div style="margin-top:8px">${cat}</div>${chk('kbliOn', 'Cantumkan daftar KBLI pada persyaratan peserta (Bab IV huruf D)', false)}${L.kbliOn ? fx('kbli', 'Daftar KBLI (satu per baris, mis. “01131 – Perkebunan Tebu”)', { area: 1 }) : ''}`)
    + sec(4, 'Tanggal dokumen', `<div class=g2>${fx('tgl', 'Tanggal', { t: 'date' })}${fx('kota', 'Kota')}</div>`)
    + more('Lainnya — dasar hukum, baris penutup', `${fx('dasarOv', 'Dasar hukum (satu per baris; kosong = template)', { area: 1, val: tx('dmkDasar') })}${fx('penutupMK', 'Baris penutup', { val: S().penutupMK })}`);
};
LASTK.push('katMode');

/* ---------- teks dokumen yang bisa diubah di halaman pembuatan ---------- */
const docText = (t) => `<details class=more><summary>Ubah teks dokumen — paragraf tambahan, kalimat penutup${t !== 'eval' && t !== 'batal' ? ', nama kegiatan' : ''}</summary>${fx('tambah', 'Paragraf tambahan sebelum kalimat penutup (boleh kosong)', { area: 1 })}${fx('penutupBA', 'Kalimat penutup (kosong = bawaan)', { area: 1 })}${t === 'ubah' || t === 'nego' ? fx('kegiatan', 'Nama Pokja / kegiatan (kosong = nama paket)', { area: 1, ph: (paketOf(L) || {}).nama }) : ''}</details>`;
['eval', 'batal', 'ubah', 'nego'].forEach((t) => { const o = FB[t]; FB[t] = () => tayangBox() + o() + docText(t); });
{ const o = FB.lap; FB.lap = () => { const I = pktInfo(L.pid), ev = I.tn.filter((t) => t.eval); return `<div class=nfo><b>Riwayat tayang:</b> ${I.tn.map((t) => `Tayang ${t.n} ${{ batal: 'batal', jalan: 'berjalan', selesai: 'selesai' }[t.st]}`).join(' · ') || 'belum ada'}.${ev.length > 1 ? `<br>${fx('tayangRef', 'Ambil peserta & BA dari tayang', { opts: [['', '— pilih —'], ...ev.map((t) => [String(t.n), 'Tayang ' + t.n])] })}` : ''}</div>` + o(); }; }
const _rl0 = renderLetter;
renderLetter = function (l) {
  let h = _rl0(l);
  if (['eval', 'batal', 'ubah', 'nego'].includes(l.tpl)) {
    if (l.tambah) h = h.replace(/<p( class=kn)?>Demikian/, `<p>${nl(l.tambah)}</p><p$1>Demikian`);
    if (l.penutupBA) h = h.replace(/<p( class=kn)?>Demikian[^<]*<\/p>/, `<p$1>${esc(l.penutupBA)}</p>`);
  }
  return h;
};

/* ---------- kop surat rapi (logo tidak mepet tepi) ---------- */
kop = function () {
  const s = S();
  return `<div class=kop style="--kw:${+s.logoW || 100}px;--kh:${+s.logoH || 86}px;--ko:${s.logoOff == null || s.logoOff === '' ? 10 : +s.logoOff}px"><div class=kl>${s.logo ? `<img src="${s.logo}">` : ''}</div><div class=x><b>${esc(s.kop1)}</b><i>${esc(s.kop2)}</i>${nl(s.kop3)}</div><div></div></div>`;
};
const _pKode0 = pKode;
pKode = function (el) {
  _pKode0(el);
  const s = S(), v = (k, d) => (s[k] == null || s[k] === '' ? d : s[k]);
  el.insertAdjacentHTML('beforeend', `<div class=card><h3>Tata letak kop (logo tidak terlalu ke pinggir)</h3><div class=g2><div><label>Tinggi logo: <b id=kh_>${v('logoH', 86)}</b> px</label><input type=range min=50 max=140 data-k=logoH value="${v('logoH', 86)}"></div><div><label>Lebar kolom logo: <b id=kw_>${v('logoW', 100)}</b> px</label><input type=range min=70 max=160 data-k=logoW value="${v('logoW', 100)}"></div><div><label>Jarak logo dari tepi kiri: <b id=ko_>${v('logoOff', 10)}</b> px</label><input type=range min=0 max=60 data-k=logoOff value="${v('logoOff', 10)}"></div></div><div class=sheet style="zoom:.6;min-height:0;padding:10px 14px;margin:8px 0" id=kpv>${kop()}</div></div>`);
  el.addEventListener('input', (e) => { const k = e.target.dataset.k; if (!['logoH', 'logoW', 'logoOff'].includes(k)) return; const m = { logoH: 'kh_', logoW: 'kw_', logoOff: 'ko_' }[k]; $('#' + m).textContent = e.target.value; $('#kpv').innerHTML = kop(); });
};

/* ---------- dashboard laporan untuk pimpinan / PPK ---------- */
let dashPk = '';
function dashRow(p) {
  const I = pktInfo(p.id), hps = num(p.hps), nilai = I.nego ? negoCalc(I.nego).final : I.w ? num(I.w.nilai) : 0;
  return { p, I, hps, nilai, hemat: nilai && hps ? hps - nilai : 0 };
}
function dashView() {
  const ps = D.paket.filter((p) => !dashPk || p.id === dashPk), rows = ps.map(dashRow), one = dashPk && rows[0];
  const sum = (f) => rows.reduce((a, r) => a + f(r), 0), win = rows.filter((r) => r.nilai);
  const hpsW = win.reduce((a, r) => a + r.hps, 0), nilW = win.reduce((a, r) => a + r.nilai, 0);
  const cnt = (s) => rows.filter((r) => r.I.status === s).length;
  const kpi = [['▦', 'Jumlah paket', rows.length], ['◔', 'Sedang tayang', cnt('Tayang')], ['✓', 'Selesai (laporan)', cnt('Selesai')], ['⊘', 'Batal', cnt('Batal')], ['Rp', 'Total HPS', rp(sum((r) => r.hps)) === '......' ? 'Rp 0,00' : rp(sum((r) => r.hps))], ['Rp', 'Nilai pemenang', nilW ? rp(nilW) : '—'], ['%', 'Efisiensi vs HPS', hpsW ? pctS(hpsW - nilW, hpsW) : '—']];
  let detail = '';
  if (one) {
    const { p, I, hps, nilai } = one, nx = pktNext(I);
    const steps = [['Dokumen kompetisi', !!I.dmk], ['Tayang', I.tn.length > 0], ['Evaluasi & pemenang', !!I.ev], ['Negosiasi harga', !!I.nego], ['Pembuktian', !!I.bukti], ['Laporan ke PPK', !!I.lap]];
    const cur = steps.findIndex((s) => !s[1]), pr = Math.round((steps.filter((s) => s[1]).length / steps.length) * 100);
    const pes = I.ev ? itemsPes(I.ev.eval) : [];
    detail = `<div class=card><h3>Posisi ${esc(p.nama)}</h3><div class=bar2><i style="width:${pr}%"></i></div><p class=muted>${pr}% tahapan tercatat · status <b>${I.status}</b>${nx ? ' · berikutnya: ' + esc(nx.t) : ''}</p>
    <div class=stepper>${steps.map(([n, ok], i) => `<div class="${ok ? 'ok' : ''} ${i === cur ? 'cur' : ''}"><i>${ok ? '✓' : i + 1}</i>${n}</div>`).join('')}</div></div>
    <div class=gr2><div class=card><h3>Data paket</h3><div class=kvh>${[['Satuan kerja', p.satker], ['Kode RUP', p.rup], ['Pagu', rp(num(p.pagu))], ['HPS', rp(hps)], ['Surat tugas', p.stNo ? `${p.stNo} · ${tgl(p.stTgl)}` : ''], ['Lokasi', p.lokasi], ['Penyelesaian', p.waktu ? tgl(p.waktu) : ''], ['Sumber dana', p.sumber]].map(([a, b]) => `<div><small>${a}</small><b>${esc(b || '—')}</b></div>`).join('')}</div></div>
    <div class=card><h3>Hasil pemilihan</h3>${I.w ? `<small class=muted>Pemenang</small><br><b>${esc(I.w.nama)}</b><p>Nilai ${rp(nilai)}<br>${pctS(nilai, hps)} dari HPS · hemat ${rp(hps - nilai)}</p>${I.nego ? `<p class=muted>Nilai akhir negosiasi harga (BA No. ${esc(I.nego.no || 'belum bernomor')}).</p>` : ''}` : '<p class=muted>Belum ada pemenang.</p>'}</div></div>
    <div class=card><h3>Papan riwayat tayang</h3>${pktBoard(I)}</div>
    ${pes.length ? `<div class=card><h3>Peringkat peserta (tayang ${I.ev.n})</h3><table class=ft><tr><th>NO</th><th>PESERTA</th><th class=r>NILAI</th><th class=r>% HPS</th><th>HASIL</th></tr>${pes.map((x, i) => `<tr><td>${i + 1}</td><td>${esc(x.nama)}</td><td class=r>${rp(x.nilai)}</td><td class=r>${pctS(num(x.nilai), hps)}</td><td>${esc(x.st)}</td></tr>`).join('')}</table></div>` : ''}`;
  } else {
    const bars = win.map((r) => { const w = Math.min(100, (r.nilai / r.hps) * 100); return `<div class=hbar><span class=cl title="${esc(r.p.nama)}">${esc(r.p.nama)}</span><div class=t><i style="width:${w}%"></i><u style="left:calc(100% - 2px)"></u></div><span>${pctS(r.nilai, r.hps)}</span></div>`; }).join('');
    detail = `<div class=card><h3>Nilai pemenang terhadap HPS</h3>${bars || '<p class=muted>Belum ada paket dengan pemenang.</p>'}<p class=muted>Garis merah = 100% HPS.</p></div>`;
  }
  const cls = { Tayang: 'a', Batal: 'r', Selesai: 'g', 'Belum tayang': 'n' };
  $('#main').innerHTML = `<style>@media print{.dsh .ph{display:block!important}}</style><div class="dsh"><div class="noprint" style="display:flex;gap:12px;align-items:center;flex-wrap:wrap"><h1>Dashboard Pimpinan / PPK</h1><select id=dp style="max-width:380px;margin-left:auto"><option value="">Semua paket (${D.paket.length})</option>${D.paket.map((p) => `<option value=${p.id} ${p.id === dashPk ? 'selected' : ''}>${esc(p.nama)}</option>`).join('')}</select><button class="btn p" id=dpr>Cetak laporan</button></div>
  <div class=ph style="display:none"><h2 style="margin:0">Laporan Progres Pengadaan</h2><p>${esc(S().instansi)} — ${esc(S().unitBaris)} · per ${tgl(today())} · disiapkan ${esc(U.name)}</p></div>
  <div class=sg>${kpi.map(([i, t, v]) => `<div class=sc><i>${i}</i><small>${t}</small><b style="font-size:${String(v).length > 14 ? 15 : 20}px">${v}</b></div>`).join('')}</div>${detail}
  <div class=card><h3>Ringkasan semua paket</h3><div class=tw><table class=ft><tr><th>PAKET</th><th>SATKER</th><th class=r>HPS</th><th>PEMENANG</th><th class=r>NILAI</th><th class=r>% HPS</th><th>TAYANG</th><th>STATUS</th></tr>${D.paket.map(dashRow).map((r) => `<tr data-dp=${r.p.id} style="cursor:pointer"><td>${esc(r.p.nama)}</td><td class=m>${esc(r.p.satker || '')}</td><td class=r>${rp(r.hps)}</td><td>${esc(r.I.w ? r.I.w.nama : '—')}</td><td class=r>${r.nilai ? rp(r.nilai) : '—'}</td><td class=r>${r.nilai ? pctS(r.nilai, r.hps) : '—'}</td><td>${r.I.tn.length ? 'ke-' + r.I.tn[r.I.tn.length - 1].n : '—'}</td><td><span class="stp ${cls[r.I.status]}" style="transform:none;font-size:10px;padding:0 7px;border-width:2px">${r.I.status.toUpperCase()}</span></td></tr>`).join('') || '<tr><td colspan=8 class=m>Belum ada paket.</td></tr>'}</table></div></div></div>`;
  $('#dp').onchange = (e) => { dashPk = e.target.value; dashView(); };
  $('#dpr').onclick = () => print();
  document.querySelectorAll('[data-dp]').forEach((t) => (t.onclick = () => { dashPk = t.dataset.dp; dashView(); }));
}

/* ---------- penyimpanan tanpa "Muat ulang": gabung otomatis saat bentrok ---------- */
let BASE = null, savingNow = false, saveAgain = false;
const jEq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const isObj = (x) => x && typeof x === 'object' && !Array.isArray(x);
const hasId = (a) => a.every((x) => isObj(x) && x.id !== undefined);
function merge3(b, m, t, key) { // b = dasar terakhir, m = perubahan saya, t = data terbaru di server
  if (jEq(m, b) || jEq(m, t)) return t === undefined ? m : jEq(m, b) ? t : m;
  if (jEq(t, b)) return m;
  if (isObj(m) && isObj(t)) {
    const bb = isObj(b) ? b : {}, r = {};
    for (const k of new Set([...Object.keys(m), ...Object.keys(t)])) {
      const iM = k in m, iT = k in t, iB = k in bb;
      if (iM && iT) r[k] = merge3(bb[k], m[k], t[k], k);
      else if (iM) { if (!iB || !jEq(m[k], bb[k])) r[k] = m[k]; }
      else if (!iB || !jEq(t[k], bb[k])) r[k] = t[k];
    }
    return r;
  }
  if (Array.isArray(m) && Array.isArray(t)) {
    const bb = Array.isArray(b) ? b : [];
    if (hasId(m) && hasId(t) && hasId(bb)) {
      const bm = new Map(bb.map((x) => [x.id, x])), mm = new Map(m.map((x) => [x.id, x])), out = [], seen = new Set();
      for (const x of t) { seen.add(x.id); if (mm.has(x.id)) out.push(merge3(bm.get(x.id), mm.get(x.id), x, '')); else if (!bm.has(x.id) || !jEq(x, bm.get(x.id))) out.push(x); }
      for (const x of m) if (!seen.has(x.id) && (!bm.has(x.id) || !jEq(x, bm.get(x.id)))) out.push(x);
      return out;
    }
    if (key === 'log') { const s = new Set(t.map((x) => JSON.stringify(x))), bs = new Set(bb.map((x) => JSON.stringify(x))); return [...t, ...m.filter((x) => { const j = JSON.stringify(x); return !s.has(j) && !bs.has(j); })]; }
  }
  return m;
}
function syncInto(tg, src) { // isi D di tempat agar referensi yang dipegang tampilan tetap valid
  if (Array.isArray(tg) && Array.isArray(src)) {
    const by = new Map(tg.filter((x) => isObj(x) && x.id !== undefined).map((x) => [x.id, x])), out = src.map((x) => { const e = isObj(x) && by.get(x.id); if (e) { syncInto(e, x); return e; } return x; });
    tg.length = 0; tg.push(...out); return;
  }
  for (const k of Object.keys(tg)) if (!(k in src)) delete tg[k];
  for (const k of Object.keys(src)) { const a = tg[k], b = src[k]; if ((isObj(a) && isObj(b)) || (Array.isArray(a) && Array.isArray(b))) syncInto(a, b); else tg[k] = b; }
}
persist = async function (force) {
  if (savingNow) { saveAgain = true; return; }
  savingNow = true;
  try {
    let ok = false;
    for (let i = 0; i < 5 && !ok; i++) {
      const snap = JSON.stringify(D);
      try { V = (await api('ws', 'PUT', { v: V, data: JSON.parse(snap) })).v; BASE = snap; ok = true; setSt('Tersimpan'); }
      catch (e) {
        if (e.status !== 409) { setSt('Gagal menyimpan: ' + e.message); return; }
        const r = await api('ws'); V = r.v;
        if (force === true || !r.data) continue;
        const merged = merge3(BASE ? JSON.parse(BASE) : r.data, JSON.parse(JSON.stringify(D)), r.data, '');
        syncInto(D, merged); BASE = JSON.stringify(r.data);
        if (['home', 'pkt', 'dash', 'mon', 'drv'].includes(view)) { const fn = { home: homeView, pkt: pktView, dash: dashView, mon: monView, drv: driveView }[view]; try { fn(); } catch {} }
      }
    }
    if (!ok) setSt('Gagal menyimpan: terlalu banyak perubahan bersamaan, coba lagi.');
  } finally { savingNow = false; if (saveAgain) { saveAgain = false; dirty(); } }
};
