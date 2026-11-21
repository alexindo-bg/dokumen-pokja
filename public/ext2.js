/* ===== Dokumen Pokja — ekstensi v2 (fitur tambahan dari sisi programmer) =====
   Dimuat setelah ext.js. Semua format dokumen tetap sama dengan v1. */
let MODE = (() => { try { return localStorage.getItem('mode') || 'terang'; } catch { return 'terang'; } })();
const setMode = (m) => { MODE = m; document.documentElement.dataset.mode = m === 'gelap' ? 'dark' : 'light'; try { localStorage.setItem('mode', m); } catch {} };
setMode(MODE);
try { if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {}); } catch {}

/* ---------- tombol mode gelap di topbar ---------- */
const _shell1 = shell;
shell = function () {
  _shell1();
  const b = $('#bell'); if (!b || !b.parentElement) return;
  b.insertAdjacentHTML('beforebegin', `<button class=tbtn id=mdb title="Mode terang/gelap">${MODE === 'gelap' ? '☀' : '☾'}</button><button class=tbtn id=ckb title="Palet perintah (Ctrl+K)">⌘</button>`);
  $('#mdb').onclick = () => { setMode(MODE === 'gelap' ? 'terang' : 'gelap'); shell(); };
  $('#ckb').onclick = () => cmdk();
};

/* ---------- palet perintah Ctrl+K ---------- */
function cmdItems() {
  const go = (v) => () => { view = v; curPk = null; shell(); };
  const a = [
    ...NAV.map(([k, n, i]) => ({ i, t: 'Buka ' + n, h: 'halaman', f: go(k) })),
    ...KEYS.map((k) => ({ i: TPL[k].i, t: 'Buat ' + TPL[k].n, h: 'surat baru', f: () => openLetter(newLetter(k, { pid: L?.pid ?? D.paket[D.paket.length - 1]?.id })) })),
    { i: MODE === 'gelap' ? '☀' : '☾', t: 'Ganti mode terang/gelap', h: 'tampilan', f: () => { setMode(MODE === 'gelap' ? 'terang' : 'gelap'); shell(); } },
    { i: '⇩', t: 'Unduh cadangan data (.json)', h: 'data', f: () => { tab = 'cad'; view = 'set'; shell(); $('#dl') && $('#dl').click(); } },
    ...D.paket.map((p) => ({ i: '▦', t: p.nama, h: 'riwayat paket', f: () => { curPk = p.id; view = 'pkt'; shell(); } })),
    ...D.surat.slice().sort((x, y) => (y.ts || 0) - (x.ts || 0)).slice(0, 80).map((s) => ({ i: TPL[s.tpl].i, t: `${TPL[s.tpl].n}${s.no ? ' · ' + s.no : ''} — ${(paketOf(s) || {}).nama || ''}`, h: 'buka surat', f: () => openLetter(clone(s)) })),
  ];
  return a;
}
function cmdk() {
  if ($('.cmdk')) return;
  const all = cmdItems(); let sel = 0, cur = all;
  const m = document.createElement('div'); m.className = 'cmdk';
  m.innerHTML = '<div><input placeholder="Ketik perintah, nama paket, atau nomor surat…" id=ci><div class=li id=cl2></div><div class=ft2>↑↓ pilih · Enter jalankan · Esc tutup</div></div>';
  document.body.append(m);
  const draw = () => { $('#cl2').innerHTML = cur.slice(0, 40).map((x, i) => `<div class="it ${i === sel ? 'on' : ''}" data-i=${i}><i>${x.i}</i><span class=cl>${esc(x.t)}</span><small>${x.h}</small></div>`).join('') || '<div class=it>Tidak ada hasil</div>'; };
  const run = (i) => { const x = cur[i]; m.remove(); x && x.f(); };
  const ci = $('#ci'); ci.focus(); draw();
  ci.oninput = () => { const q = ci.value.toLowerCase().split(/\s+/).filter(Boolean); cur = all.filter((x) => q.every((w) => (x.t + ' ' + x.h).toLowerCase().includes(w))); sel = 0; draw(); };
  m.onkeydown = (e) => { if (e.key === 'Escape') m.remove(); else if (e.key === 'ArrowDown') { sel = Math.min(sel + 1, Math.min(cur.length, 40) - 1); draw(); e.preventDefault(); } else if (e.key === 'ArrowUp') { sel = Math.max(sel - 1, 0); draw(); e.preventDefault(); } else if (e.key === 'Enter') run(sel); };
  m.onmousedown = (e) => { if (e.target === m) m.remove(); const it = e.target.closest('[data-i]'); if (it) run(+it.dataset.i); };
}
addEventListener('keydown', (e) => {
  if (!U) return;
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); cmdk(); }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p' && view === 'surat' && L) { e.preventDefault(); doPdf(); }
});

/* ---------- Word (.doc), Cetak, Fokus & Zoom pratinjau ---------- */
const kopTabel = () => { const s = S(); return `<table style="width:100%;border-collapse:collapse;border-bottom:4px double #2b3f8c"><tr><td style="width:100px;padding-left:${+s.logoOff || 10}px">${s.logo ? `<img src="${s.logo}" height="${+s.logoH || 86}">` : ''}</td><td style="text-align:center;color:#2b3f8c;font-size:7.5pt;line-height:1.3"><b style="font-size:12pt">${esc(s.kop1)}</b><br><span style="font-size:16pt">${esc(s.kop2)}</span><br>${nl(s.kop3)}</td><td style="width:100px"></td></tr></table><br>`; };
function wordHtml() {
  const k0 = kop; let body; kop = kopTabel; try { body = renderLetter(L); } finally { kop = k0; }
  const css = '@page{size:21cm 29.7cm;margin:2cm 2cm 2cm 2.5cm}body{font:12pt Arial}p{margin:6pt 0;text-align:justify}.tc{text-align:center;font-weight:bold}table{border-collapse:collapse}table.b td,table.b th{border:1px solid #000;padding:3px 6px;vertical-align:top}table.k td{vertical-align:top;padding:2px 6px 2px 0}ol{margin:4pt 0}.ttd{margin-left:55%;text-align:center}h4{font-size:12pt;margin:10pt 0 4pt}';
  return `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>${esc(judul(L))}</title><style>${css}</style></head><body>${body}</body></html>`;
}
function exportWord() {
  saveL(); const html = wordHtml();
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['\ufeff', html], { type: 'application/msword' })); a.download = judul(L) + '.doc'; a.click(); setSt('Word diunduh');
}
let ZM = 1;
const _form2 = form;
form = function () {
  _form2();
  const b = $('#fm') && $('#fm').querySelector('.bar'); if (!b) return;
  b.insertAdjacentHTML('beforeend', '<button class=btn id=wd title="Unduh sebagai Word (.doc)">Word</button><button class=btn id=pt title="Cetak (Ctrl+P)">Cetak</button>');
  $('#wd').onclick = exportWord; $('#pt').onclick = doPdf;
};
const _prev2 = prev;
prev = function () {
  _prev2();
  const sh = $('#sh'); if (!sh) return;
  sh.style.zoom = String((parseFloat(sh.style.zoom) || 1) * ZM);
  const h = $('.pvh'); if (h && !h.querySelector('.zc')) {
    h.insertAdjacentHTML('beforeend', '<span class=zc><a id=zm1>−</a><a id=zm2>+</a><a id=zfk>Fokus</a></span>');
    $('#zm1').onclick = () => { ZM = Math.max(0.6, ZM - 0.1); prev(); }; $('#zm2').onclick = () => { ZM = Math.min(1.6, ZM + 0.1); prev(); };
    $('#zfk').onclick = () => { const w = $('.wrap'); w.classList.toggle('fokus'); prev(); };
  }
  try { localStorage.setItem('draf', JSON.stringify({ L, at: Date.now() })); } catch {}
};

/* ---------- log aktivitas ---------- */
const _saveL2 = saveL;
saveL = function () {
  const baru = !D.surat.some((s) => s.id === L.id);
  _saveL2();
  (D.log ||= []).push({ at: Date.now(), u: U.name, a: baru ? 'membuat' : 'menyimpan', tpl: L.tpl, no: L.no || '', pid: L.pid });
  if (D.log.length > 300) D.log.splice(0, D.log.length - 300);
  try { const d = JSON.parse(localStorage.getItem('draf') || 'null'); if (d && d.L && d.L.id === L.id) localStorage.removeItem('draf'); } catch {}
};
function pLog(el) {
  const lg = (D.log || []).slice().reverse().slice(0, 120), fm = (t) => { const d = new Date(t); return `${d.getDate()} ${MON[d.getMonth()]} ${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}.${String(d.getMinutes()).padStart(2, '0')}`; };
  el.innerHTML = `<div class=card><h3>Riwayat aktivitas</h3><p class=muted>300 aktivitas terakhir (siapa menyimpan/membuat surat apa).</p><table class=ft><tr><th>WAKTU</th><th>OLEH</th><th>AKSI</th><th>PAKET</th></tr>${lg.map((x) => `<tr><td class=m>${fm(x.at)}</td><td>${esc(x.u)}</td><td>${x.a} ${esc((TPL[x.tpl] || {}).n || x.tpl)}${x.no ? ' · ' + esc(x.no) : ''}</td><td class=m>${esc(((D.paket.find((p) => p.id === x.pid)) || {}).nama || '')}</td></tr>`).join('') || '<tr><td colspan=4 class=m>Belum ada aktivitas.</td></tr>'}</table></div>`;
}
TABS.push(['log', 'Riwayat aktivitas']);
const _setView2 = setView;
setView = function () {
  if (tab === 'log') {
    $('#main').innerHTML = `<div class=set><div>${TABS.filter((t) => t[0] !== 'ref' || U.admin).map(([k, n]) => `<div class="t ${tab === k ? 'on' : ''}" data-t=${k}>${n}</div>`).join('')}</div><div id=pn></div></div>`;
    document.querySelectorAll('.set [data-t]').forEach((e) => (e.onclick = () => { tab = e.dataset.t; setView(); })); pLog($('#pn')); return;
  }
  _setView2();
};

/* ---------- pengingat tambahan: nomor terlewat, draf, cadangan ---------- */
const _notes2 = notes;
notes = function () {
  const a = _notes2(), cur = String(new Date().getFullYear());
  const nos = [...new Set(D.surat.filter((s) => !TPL[s.tpl].nonum && yr(s) === cur && +s.no).map((s) => +s.no))].sort((x, y) => x - y).slice(-30), gaps = [];
  for (let i = 1; i < nos.length; i++) for (let n = nos[i - 1] + 1; n < nos[i] && gaps.length < 6; n++) gaps.push(n);
  if (gaps.length) a.unshift({ k: 'w', i: '∅', t: 'Nomor surat terlewat', d: gaps.join(', ') + ' — cek apakah dipakai di luar aplikasi.', go: () => alert('Nomor yang terlewat (30 nomor terakhir tahun ' + cur + '): ' + gaps.join(', ')) });
  try { const d = JSON.parse(localStorage.getItem('draf') || 'null'); if (d && d.L && !D.surat.some((s) => s.id === d.L.id) && Date.now() - d.at < 7 * 864e5) a.unshift({ k: 'w', i: '✎', t: 'Draf belum disimpan', d: `${(TPL[d.L.tpl] || {}).n || ''} — klik untuk melanjutkan`, go: () => openLetter(d.L) }); } catch {}
  try { const t = +localStorage.getItem('bk') || 0; if (D.surat.length && Date.now() - t > 14 * 864e5) a.push({ k: '', i: '⇩', t: 'Waktunya unduh cadangan data', d: 'Terakhir lebih dari 14 hari lalu.', go: () => { tab = 'cad'; view = 'set'; shell(); } }); } catch {}
  return a.slice(0, 14);
};
const _pCad2 = pCad;
pCad = function (el) { _pCad2(el); const b = $('#dl'); if (b) b.addEventListener('click', () => { try { localStorage.setItem('bk', String(Date.now())); } catch {} }); };

/* ---------- riwayat paket: kelengkapan dokumen + duplikasi paket ---------- */
const _pktDetail2 = pktDetail;
pktDetail = function () {
  _pktDetail2();
  const p = D.paket.find((x) => x.id === curPk); if (!p) return; const I = pktInfo(p.id), has = (t) => I.ls.some((s) => s.tpl === t);
  const ck = [['Dokumen mini kompetisi', has('dmk')], ['Undangan reviu', has('reviu')], ['BA perubahan paket', has('ubah'), 1], ['BA hasil evaluasi', has('eval')], ['BA negosiasi harga', has('nego'), 1], ['Undangan pembuktian', has('bukti')], ['Laporan hasil pemilihan', has('lap')], ['Data paket lengkap (HPS, ST, RUP)', !!(num(p.hps) && p.stNo && p.rup)]];
  const req = ck.filter((x) => !x[2]), pc = Math.round((req.filter((x) => x[1]).length / req.length) * 100);
  $('#main').insertAdjacentHTML('beforeend', `<div class=card style="margin-top:16px"><div style="display:flex;gap:20px;align-items:center;flex-wrap:wrap"><div class=ring style="--v:${pc}"><b>${pc}%</b></div><div style="flex:1;min-width:260px"><h3 style="margin-bottom:8px">Kelengkapan dokumen paket</h3><div class=ckl>${ck.map(([n, ok, opt]) => `<span class="${ok ? 'ok' : 'no'}">${ok ? '✓' : '○'} ${n}${opt ? ' <small>(bila perlu)</small>' : ''}</span>`).join('')}</div></div><button class=btn id=dup>Duplikat paket</button></div></div>`);
  $('#dup').onclick = () => { const c = { ...clone(p), id: uid(), nama: p.nama + ' (salinan)' }; D.paket.push(c); dirty(); curPk = c.id; shell(); };
};
