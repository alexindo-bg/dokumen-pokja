/* ===== Integrasi Google Drive v2 =====
   Memakai koneksi Drive yang sama dengan menu Dokumen Drive (OAuth admin, folder utama DRIVE_FOLDER_ID).
   Fitur: simpan surat ke subfolder per paket (Word / Google Docs), ambil dokumen dari Drive untuk dipindai,
   cadangan data ke Drive, dan penjelajah folder bergrup per paket. */
let DS = null;
async function drvReady() {
  DS ||= await api('drive?a=status').catch(() => ({}));
  if (!DS.connected) { DS = null; throw new Error('Google Drive belum terhubung — admin: buka Dokumen Drive › Hubungkan Google Drive.'); }
  return DS;
}
const pktFolder = (p) => String((p && (p.singkat || p.nama)) || '').slice(0, 80);
const drvLink = (f) => (f.webViewLink || (f.mimeType === 'application/vnd.google-apps.document' ? `https://docs.google.com/document/d/${f.id}/edit` : `https://drive.google.com/file/d/${f.id}/view`));
async function driveUp(blob, name, type, o = {}, onp) {
  await drvReady();
  const { url, folder } = await api('drive?a=init', 'POST', { name, type, sub: o.sub || '', gdoc: !!o.gdoc });
  const j = await new Promise((ok, no) => {
    const x = new XMLHttpRequest(); x.open('PUT', url); if (onp) x.upload.onprogress = (e) => onp(e.loaded / e.total);
    x.onload = () => (x.status < 300 ? ok((() => { try { return JSON.parse(x.responseText); } catch { return {}; } })()) : no(new Error('Google menolak unggahan (' + x.status + ')')));
    x.onerror = () => no(new Error('Koneksi ke Google terputus')); x.send(blob);
  });
  return { ...j, name: j.name || name, folder };
}
async function driveFile(id) {
  const r = await fetch('/api/drive?a=get&id=' + encodeURIComponent(id));
  if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || 'Gagal mengunduh dari Drive');
  return new File([await r.blob()], decodeURIComponent(r.headers.get('X-File-Name') || 'berkas'));
}
const driveTree = async () => { await drvReady(); return api('drive?a=tree'); };
const OKT = /pdf|wordprocessingml|spreadsheetml|text\/plain|google-apps\.(document|spreadsheet)/;

/* ---------- pemilih berkas Drive ---------- */
async function drivePick(title, filt, cb) {
  const m = modal(`<h3 style="margin-top:0">${esc(title)}</h3><input id=dpq placeholder="Cari nama berkas…"><div id=dpl class=muted style="max-height:50vh;overflow:auto;margin-top:8px">Memuat…</div>`);
  let T; try { T = await driveTree(); } catch (e) { m.querySelector('#dpl').innerHTML = `<span class=err>${esc(e.message)}</span>`; return; }
  const fn = Object.fromEntries([[T.root, 'Folder utama'], ...T.folders.map((f) => [f.id, f.name])]);
  const draw = () => {
    const q = m.querySelector('#dpq').value.toLowerCase(), fs = T.files.filter((f) => OKT.test(f.mimeType) && (!filt || filt(f)) && f.name.toLowerCase().includes(q)), by = {};
    fs.forEach((f) => (by[(f.parents || [])[0]] ||= []).push(f));
    m.querySelector('#dpl').innerHTML = Object.entries(by).map(([k, a]) => `<h6 style="margin:10px 0 4px">📁 ${esc(fn[k] || 'Folder')}</h6>${a.map((f) => `<div class=nt data-id="${f.id}" style="margin:4px 0;padding:8px 12px"><span><b>${esc(f.name)}</b><small class=muted>${new Date(f.modifiedTime).toLocaleDateString('id-ID')}</small></span></div>`).join('')}`).join('') || '<p class=muted>Tidak ada berkas yang cocok (didukung: Word, Excel, PDF, txt, Google Docs/Sheets).</p>';
  };
  draw(); m.querySelector('#dpq').oninput = draw;
  m.querySelector('#dpl').onclick = (e) => { const t = e.target.closest('[data-id]'); if (!t) return; const f = T.files.find((x) => x.id === t.dataset.id); m.remove(); cb(f); };
}

/* ---------- pemindai: ambil dokumen dari Drive ---------- */
async function rvLoad(k, f) {
  rvSet(k, `Mengunduh ${esc(f.name)}…`);
  try { const d = await readDoc(await driveFile(f.id)); (RVT[L.id] ||= {})[k] = d; (L.rvDocs ||= {})[k] = { nama: d.nama + ' (Drive)', n: d.text.length }; rvSet(k, rvStat(k)); return true; }
  catch (e) { rvSet(k, `<span style="color:#b3261e">Gagal: ${esc(e.message)}</span>`); return false; }
}
function rvFromDrive(k) { drivePick('Pilih ' + RVN[k] + ' dari Drive', null, (f) => rvLoad(k, f)); }
const RVKW = { ppp: /permintaan|pemilihan penyedia|\bppp\b/i, kak: /\bkak\b|kerangka acuan/i, hps: /\bhps\b|harga perkiraan/i, ssuk: /ssuk|syarat.{0,12}umum/i, sskk: /sskk|syarat.{0,12}khusus/i, kontrak: /kontrak|perjanjian|surat pesanan|rancangan/i, anggaran: /dipa|\bpok\b|anggaran|rka/i, rup: /\brup\b|sirup/i, pasar: /pasar|analisis/i };
const RVEX = { kontrak: /ssuk|sskk|syarat/i, kak: /hps|harga perkiraan/i };
async function rvAuto() {
  const msg = $('#rvmsg'), p = paketOf(L); if (!p) { msg.textContent = 'Pilih paket dulu.'; return; }
  msg.textContent = 'Mencari di Drive…';
  let T; try { T = await driveTree(); } catch (e) { msg.textContent = e.message; return; }
  const want = pktFolder(p).replace(/[\\/:*?"<>|]+/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase(), fo = T.folders.find((f) => f.name.toLowerCase() === want);
  const ok = T.files.filter((f) => OKT.test(f.mimeType)), pool = fo ? ok.filter((f) => (f.parents || [])[0] === fo.id) : ok;
  const got = [], miss = [];
  for (const [k] of RV) {
    const f = pool.filter((x) => RVKW[k].test(x.name) && !(RVEX[k] && RVEX[k].test(x.name))).sort((a, b) => new Date(b.modifiedTime) - new Date(a.modifiedTime))[0];
    if (f && (await rvLoad(k, f))) got.push(RVS[k]); else miss.push(RVS[k]);
  }
  if (!got.length) { msg.textContent = `Tidak ada dokumen yang cocok${fo ? ` di folder “${fo.name}”` : ''}. Beri nama berkas memuat kata KAK/HPS/SSUK/SSKK/Permintaan, atau pilih manual.`; return; }
  rvRun(); const m2 = $('#rvmsg'); if (m2) m2.textContent += ` Terbaca: ${got.join(', ')}${miss.length ? ` · tidak ditemukan: ${miss.join(', ')}` : ''}.`;
}

/* ---------- simpan surat ke Drive ---------- */
const _form5 = form;
form = function () {
  _form5();
  const f = $('#fm'), b = f && f.querySelector('.bar'); if (!b) return;
  if (L.drv && L.drv.length) b.insertAdjacentHTML('beforebegin', `<div class=nfo style="margin:8px 14px">☁ Tersimpan di Drive: ${L.drv.slice(-3).reverse().map((x) => `<a href="${esc(x.url)}" target=_blank rel=noopener>${esc(x.nama)}</a>`).join(' · ')}</div>`);
  b.insertAdjacentHTML('beforeend', '<button class=btn id=dv1 title="Simpan salinan Word ke folder Drive paket">☁ Drive</button><button class=btn id=dv2 title="Simpan sebagai Google Docs yang bisa disunting">☁ Docs</button>');
  $('#dv1').onclick = () => saveToDrive(false); $('#dv2').onclick = () => saveToDrive(true);
};
async function saveToDrive(gdoc) {
  const m = missing(); if (m.length && !confirm(`Masih ada ${m.length} isian kosong (${m.map((x) => x[0]).join(', ')}). Tetap simpan ke Drive?`)) return;
  saveL(); const p = paketOf(L), nama = judul(L) + (gdoc ? '' : '.doc'); setSt('Mengunggah ke Drive…');
  try {
    const r = await driveUp(new Blob(['\ufeff', wordHtml()], { type: gdoc ? 'text/html' : 'application/msword' }), nama, gdoc ? 'text/html' : 'application/msword', { sub: pktFolder(p), gdoc });
    (L.drv ||= []).push({ id: r.id, url: drvLink({ id: r.id, webViewLink: r.webViewLink, mimeType: r.mimeType }), nama, at: Date.now(), g: !!gdoc });
    if (p && r.folder && r.folder.id && p.driveFolder !== r.folder.id) p.driveFolder = r.folder.id;
    saveL(); setSt('Tersimpan di Drive ✓'); rerender();
  } catch (e) { setSt('Gagal ke Drive'); alert(e.message); }
}

/* ---------- cadangan ke Drive ---------- */
const _pCad5 = pCad;
pCad = function (el) {
  _pCad5(el);
  el.insertAdjacentHTML('beforeend', '<div class=card><h3>Cadangan ke Google Drive</h3><p class=muted>Unggah cadangan semua data (.json) ke folder “_Cadangan” di Drive.</p><button class="btn p" id=bkd>☁ Cadangkan ke Drive sekarang</button> <span class=muted id=bkm></span></div>');
  $('#bkd').onclick = async () => {
    const m = $('#bkm'); m.textContent = 'Mengunggah…';
    try { await driveUp(new Blob([JSON.stringify(D)], { type: 'application/json' }), `cadangan-dokumen-pokja-${today()}.json`, 'application/json', { sub: '_Cadangan' }); try { localStorage.setItem('bk', String(Date.now())); } catch {} m.textContent = 'Tersimpan ✓'; }
    catch (e) { m.textContent = e.message; }
  };
};

/* ---------- penjelajah Drive per paket ---------- */
driveView = async function () {
  $('#main').innerHTML = `<div class=head><h1>Dokumen Drive</h1><span id=gds class=muted></span></div><div class=drop id=dz><b>Tarik &amp; lepas dokumen di sini</b><span class=muted>atau</span><label class="btn p">Pilih file<input type=file multiple hidden id=fi></label><div style="margin-top:8px"><label style="display:inline">Simpan ke folder:</label> <select id=dsub style="width:auto;display:inline-block"><option value="">Folder utama</option>${D.paket.map((p) => `<option value="${esc(pktFolder(p))}">${esc(pktFolder(p))}</option>`).join('')}</select></div><div id=up></div></div><div style="display:flex;gap:10px;align-items:center;margin-top:20px"><h6 style="margin:0">SEMUA FILE</h6><input id=dq placeholder="Cari berkas…" style="max-width:260px;margin-left:auto"></div><div id=fl class=muted>Memuat…</div>`;
  let st = {}; try { st = await api('drive?a=status'); } catch (e) { $('#fl').textContent = e.message; return; }
  const g = $('#gds');
  if (!st.configured) g.innerHTML = 'Belum dikonfigurasi (isi GOOGLE_CLIENT_ID dan GOOGLE_CLIENT_SECRET di Vercel).';
  else if (!st.connected) g.innerHTML = st.admin ? '<a class="btn p" href="/api/drive?a=auth">Hubungkan Google Drive</a>' : 'Belum terhubung. Minta admin menghubungkan Google Drive.';
  else g.innerHTML = `Terhubung · <a href="https://drive.google.com/drive/folders/${esc(st.folder)}" target=_blank rel=noopener>buka folder</a>${st.admin ? ' · <a href="/api/drive?a=auth">hubungkan ulang</a>' : ''}`;
  let T = null;
  const draw = () => {
    if (!T) return; const q = $('#dq').value.toLowerCase(), fn = Object.fromEntries([[T.root, 'Folder utama'], ...T.folders.map((f) => [f.id, f.name])]), by = {};
    T.files.filter((f) => f.name.toLowerCase().includes(q)).forEach((f) => (by[(f.parents || [])[0]] ||= []).push(f));
    $('#fl').className = '';
    $('#fl').innerHTML = Object.entries(by).map(([k, a]) => `<h6 style="margin:16px 0 4px">📁 ${esc(fn[k] || 'Folder')} <span class=muted>(${a.length})</span> <a href="https://drive.google.com/drive/folders/${k}" target=_blank rel=noopener style="font-weight:400">buka</a></h6><table class=ft><tr><th>NAMA</th><th>TERAKHIR DIUBAH</th><th>UKURAN</th><th></th></tr>${a.map((f) => `<tr><td><i class=fi>${/pdf/.test(f.mimeType) ? 'P' : /sheet|excel/.test(f.mimeType) ? 'X' : /word|document/.test(f.mimeType) ? 'W' : '▤'}</i><a href="${esc(drvLink(f))}" target=_blank rel=noopener>${esc(f.name)}</a></td><td class=m>${new Date(f.modifiedTime).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</td><td class=m>${f.size ? (f.size / 1024 < 1024 ? Math.round(f.size / 1024) + ' KB' : (f.size / 1048576).toFixed(1) + ' MB') : '—'}</td><td>${st.admin ? `<a data-d="${f.id}">hapus</a>` : ''}</td></tr>`).join('')}</table>`).join('') || '<p class=muted>Belum ada berkas.</p>';
  };
  const list = async () => { if (!st.connected) { $('#fl').textContent = 'Hubungkan Google Drive untuk melihat dan mengunggah file.'; return; } try { T = await api('drive?a=tree'); draw(); } catch (e) { $('#fl').innerHTML = `<span class=err>${esc(e.message)}</span>`; } };
  $('#dq').oninput = draw;
  $('#fl').onclick = async (e) => { const d = e.target.dataset.d; if (d && confirm('Pindahkan file ke Sampah Drive?')) { await api('drive?a=del', 'POST', { id: d }).catch((x) => alert(x.message)); list(); } };
  const send = async (files) => {
    for (const f of files) { const row = document.createElement('div'); row.className = 'upr'; row.innerHTML = `<span>${esc(f.name)}</span><progress max=100 value=0></progress>`; $('#up').append(row); const end = (t, bad) => row.lastChild.replaceWith(Object.assign(document.createElement('b'), { textContent: t, style: bad ? 'color:#b91c1c' : 'color:#0f7b3f' }));
      try { await driveUp(f, f.name, f.type || 'application/octet-stream', { sub: $('#dsub').value }, (v) => (row.lastChild.value = v * 100)); end('✓ Terunggah'); } catch (e) { end('Gagal: ' + e.message, true); } }
    list();
  };
  const dz = $('#dz'); dz.ondragover = (e) => { e.preventDefault(); dz.classList.add('on'); }; dz.ondragleave = () => dz.classList.remove('on');
  dz.ondrop = (e) => { e.preventDefault(); dz.classList.remove('on'); send([...e.dataTransfer.files]); };
  $('#fi').onchange = (e) => { send([...e.target.files]); e.target.value = ''; };
  list();
};

/* ---------- tautan folder Drive di riwayat paket ---------- */
const _pktDetail5 = pktDetail;
pktDetail = function () {
  _pktDetail5(); const p = D.paket.find((x) => x.id === curPk), b = $('#bk');
  if (p && p.driveFolder && b) b.insertAdjacentHTML('afterend', ` &nbsp;·&nbsp; <a href="https://drive.google.com/drive/folders/${esc(p.driveFolder)}" target=_blank rel=noopener>📁 Folder Drive paket</a>`);
};
