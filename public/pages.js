/* ===== Paginasi: dokumen dibagi per halaman (pratinjau = hasil unduhan) =====
   Isi dokumen (HTML dari renderLetter) diukur di browser lalu dipotong menjadi halaman-halaman kertas terpisah:
   - tabel dipotong per baris (baris judul diulang di halaman berikutnya), daftar bernomor dipotong per butir,
   - blok yang tak boleh terbelah (tanda tangan, tabel data) dipindah utuh ke halaman berikutnya,
   - judul/kalimat pengantar tidak ditinggal sendirian di dasar halaman,
   - <div class="pgb"> = pemisah halaman paksa.
   Setiap halaman berukuran kertas penuh (margin ada di dalam halaman) sehingga cetak/PDF persis seperti pratinjau. */
const PGZ = { A4: [210, 297], F4: [215, 330], Letter: [215.9, 279.4] };
const PGM = { t: 20, r: 20, b: 20, l: 25 }; // margin halaman (mm)
const PNO = { eval: 'n', ubah: 'n', batal: 'n', nego: 'n', bareviu: 'n', bakla: 'n', dmk: 'n2', lap: 'h2' }; // nomor halaman: n = semua, n2/h2 = mulai halaman 2
const mmPx = (mm) => (mm * 96) / 25.4;

function paginate(html, wMm, hMm) {
  const host = document.createElement('div');
  host.className = 'sheet pgm';
  host.style.width = wMm + 'mm';
  const mkPg = () => { const d = document.createElement('div'); d.className = 'pgc'; host.appendChild(d); return d; };
  document.body.appendChild(host);
  const out = [], limit = mmPx(hMm);
  let pg = mkPg(), first = true;
  try {
    const src = document.createElement('div'); src.innerHTML = html;
    const queue = [...src.childNodes].filter((n) => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()));
    const over = () => { const l = pg.lastElementChild; return !!l && l.getBoundingClientRect().bottom - pg.getBoundingClientRect().top > limit + 0.5; };
    const isKn = (e) => e.classList.contains('kn') || e.classList.contains('kop') || e.tagName === 'H4' || e.style.breakAfter === 'avoid' || (e.tagName === 'P' && /:\s*$/.test(e.textContent));
    /* tutup halaman; judul/pengantar di dasar halaman ikut pindah ke halaman berikutnya. Mengembalikan jumlah elemen yang dipindah (di depan antrean). */
    const push = () => {
      const carry = [];
      while (pg.children.length > 1 && isKn(pg.lastElementChild)) carry.unshift(pg.removeChild(pg.lastElementChild));
      out.push(pg.innerHTML); host.removeChild(pg); pg = mkPg(); first = false;
      queue.unshift(...carry); return carry.length;
    };
    const place = (e) => { pg.appendChild(e); if (!first && pg.children.length === 1) e.style.marginTop = '0'; };

    /* tabel: isi sisa halaman dengan sebagian baris. null = tak bisa dipotong; {fail} = satu baris pun tak muat; {done} = semua muat; {rest} = sisa untuk halaman berikut */
    const splitTable = (t) => {
      const rows = [...t.rows]; if (rows.length < 2) return null;
      let h = 0; while (h < rows.length - 1 && [...rows[h].cells].every((c) => c.tagName === 'TH')) h++;
      const hdr = rows.slice(0, h).map((r) => r.cloneNode(true)), body = rows.slice(h);
      const part = t.cloneNode(false), tb = document.createElement('tbody'); part.appendChild(tb); place(part);
      rows.slice(0, h).forEach((r) => tb.appendChild(r));
      let n = 0;
      for (const r of body) { tb.appendChild(r); if (over()) { tb.removeChild(r); break; } n++; }
      if (n === 0) { pg.removeChild(part); const tt = t.tBodies[0]; rows.forEach((r) => tt.appendChild(r)); return { fail: true }; }
      if (n === body.length) return { done: true };
      const rest = t.cloneNode(false), rb = document.createElement('tbody'); rest.appendChild(rb);
      hdr.forEach((r) => rb.appendChild(r)); body.slice(n).forEach((r) => rb.appendChild(r));
      return { rest };
    };
    /* daftar bernomor: dipotong per butir, nomor lanjut lewat atribut start */
    const splitList = (ol) => {
      const lis = [...ol.children]; if (lis.length < 2) return null;
      const part = ol.cloneNode(false); place(part); let n = 0;
      for (const li of lis) { part.appendChild(li); if (over()) { part.removeChild(li); break; } n++; }
      if (n === 0) { pg.removeChild(part); lis.forEach((li) => ol.appendChild(li)); return { fail: true }; }
      if (n === lis.length) return { done: true };
      const rest = ol.cloneNode(false); rest.setAttribute('start', (parseInt(ol.getAttribute('start'), 10) || 1) + n);
      lis.slice(n).forEach((li) => rest.appendChild(li));
      return { rest };
    };

    let guard = 0;
    while (queue.length && guard++ < 5000) {
      const c = queue.shift();
      if (c.nodeType === 3) { const p = document.createElement('p'); p.textContent = c.textContent; queue.unshift(p); continue; }
      if (c.classList.contains('pgb')) { if (pg.children.length) push(); continue; }
      place(c);
      if (!over()) continue;
      pg.removeChild(c); // tidak muat di sisa halaman
      const kind = c.tagName === 'TABLE' && c.classList.contains('b') && c.style.breakInside !== 'avoid' ? 't' : c.tagName === 'OL' || c.tagName === 'UL' ? 'l' : '';
      const r = kind === 't' ? splitTable(c) : kind === 'l' ? splitList(c) : null;
      if (r && r.done) continue;
      if (r && r.rest) { const k = push(); queue.splice(k, 0, r.rest); continue; }
      // blok utuh: pindah ke halaman berikutnya (atau tetap di sini bila halaman masih kosong)
      if (pg.children.length) { const k = push(); queue.splice(k, 0, c); }
      else { place(c); push(); }
    }
    if (pg.children.length || !out.length) out.push(pg.innerHTML);
  } finally { host.remove(); }
  return out;
}

/* nomor halaman di pojok kanan bawah */
const pnoHtml = (tpl, i) => { const m = PNO[tpl]; if (!m || (m.endsWith('2') && i === 0)) return ''; return `<div class=pno>${m === 'h2' ? 'Hal. ' : ''}${i + 1}</div>`; };

/* isi #sh dengan halaman-halaman; kembalikan jumlah halaman */
function fillPages(sh, l) {
  const k = l.kertas || S().kertas, [pw, ph] = PGZ[k] || PGZ.A4;
  const pages = paginate(renderLetter(l), pw - PGM.l - PGM.r, ph - PGM.t - PGM.b - 1), n = pages.length;
  sh.innerHTML = pages.map((h, i) => `<div class="pgl noprint">Halaman ${i + 1} dari ${n}</div><div class="sheet pg ${l.tpl}" style="--pw:${pw}mm;--ph:${ph}mm">${h}${pnoHtml(l.tpl, i)}</div>`).join('');
  return n;
}
