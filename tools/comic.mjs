// comic.mjs: letters a comic's pages over their art and writes the reader files.
//
//   node tools/comic.mjs --comic=comics/ashwatthama [--pages=11,12,13,14] [--look=cine|ink] [--render[=all]] [--out=…]
//
// The art comes from the comic's studio page (comic.html for look A 'cine', comic_ink.html for look B 'ink'; any
// other with --page=): page n is rendered at t = n + .5 into out/comic_<slug>/art_<look>/t<n>_50.png (--render renders
// the missing ones, --render=all all of them). The words come from comics/<slug>/comic.js (COMIC.pages[n].panels[i]:
// box, say, sfx in panel units) and stay live text: vector, selectable, in the PDF.
//
// Writes into --out (default out/comics/<slug>_out/<look>):
//   pages/p<NN>.png     each page lettered, 2160 × 2700 (the master)
//   ig/p<NN>.jpg        1080 × 1350 JPEGs for an Instagram carousel
//   <slug>.pdf          one 4:5 page per swipe page (1080 × 1350 px pages), fonts embedded; the art at full size
//                       (2160 × 2700): the master, for print or zooming in (~1.7 MB a page)
//   <slug>_reader.pdf   the same, the art at 1440 × 1800 and JPEG quality 6: what readers download and share on a
//                       phone (~0.4 MB a page). The words stay vector text in both, so they're sharp at any zoom.
//   <slug>.epub         fixed-layout EPUB 3 (pre-paginated, one page at a time, no spreads): each page a lettered
//                       1440 × 1800 JPEG with its words as the image's alt text; for Apple Books, Google Play Books
//   <slug>.cbz          the PNG pages zipped, for comic-reader apps
// Fonts: assets/fonts (Kalam for the words, Bangers for sound effects, Marcellus for titles; all SIL OFL).
import puppeteer from 'puppeteer-core';
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
if (!args.comic) { console.error('usage: node tools/comic.mjs --comic=comics/<slug> [--pages=11,12] [--look=cine|ink] [--render]'); process.exit(1); }
const COMIC = runInNewContext(readFileSync(join(args.comic, 'comic.js'), 'utf8') + '\n;COMIC');
const look = args.look || 'cine', S = COMIC.slug, PW = 1080, PH = 1350;
const OUT = args.out || `out/comics/${S}_out/${look}`, ART = `out/comic_${S}/art_${look}`, TMP = `out/comic_${S}/tmp_${look}`;
const studio = args.page || (look === 'ink' ? 'comic_ink.html' : 'comic.html');
const pages = (args.pages ? String(args.pages).split(',') : Object.keys(COMIC.pages)).map(Number).filter(n => COMIC.pages[n]);
for (const d of [OUT, `${OUT}/pages`, `${OUT}/ig`, TMP]) mkdirSync(d, { recursive: true });

// ---- the art
const artOf = n => `${ART}/t${n}_50.png`;
const todo = pages.filter(n => args.render === 'all' || !existsSync(artOf(n)));
if (todo.length) {
  if (!args.render) { console.error(`missing art for pages ${todo.join(', ')} (pass --render)`); process.exit(1); }
  const r = spawnSync('node', ['render.mjs', `--page=${studio}`, `--stills=${todo.map(n => n + .5).join(',')}`, `--out=${ART}`], { stdio: 'inherit' });
  if (r.status) process.exit(r.status);
}
// JPEG copies for the PDF (Chrome embeds a JPEG as it is; a PNG would be re-compressed losslessly and be huge)
for (const n of pages) {
  spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', artOf(n), '-q:v', '2', `${TMP}/a${n}.jpg`]);
  spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', artOf(n), '-vf', 'scale=1440:1800:flags=lanczos', '-q:v', '6', `${TMP}/r${n}.jpg`]);
}

// ---- the lettering
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const font = f => pathToFileURL(resolve('assets/fonts', f)).href;
const css = `
@font-face { font-family: Kalam; font-weight: 400; src: url(${font('Kalam-Regular.ttf')}); }
@font-face { font-family: Kalam; font-weight: 700; src: url(${font('Kalam-Bold.ttf')}); }
@font-face { font-family: Bangers; src: url(${font('Bangers-Regular.ttf')}); }
@font-face { font-family: Marcellus; src: url(${font('Marcellus-Regular.ttf')}); }
@page { size: ${PW}px ${PH}px; margin: 0; }
html, body { margin: 0; padding: 0; background: #000; }
.page { position: relative; width: ${PW}px; height: ${PH}px; overflow: hidden; break-after: page; }
.page > img.art { position: absolute; inset: 0; width: ${PW}px; height: ${PH}px; }
.page > svg { position: absolute; inset: 0; }
.box { position: absolute; box-sizing: border-box; background: #F1E7D2; color: #1A1410; border: 3px solid #0B0810;
  padding: 10px 16px 9px; font: 700 31px/1.22 Kalam; box-shadow: 4px 5px 0 rgba(0,0,0,.45); width: fit-content; }
.box { white-space: pre-line; }
.box.list { font: 400 23px/1.3 Kalam; }
.title { white-space: nowrap; position: absolute; transform: translate(-50%, -50%); text-align: center; font: 400 96px/1.05 Marcellus; letter-spacing: 6px; paint-order: stroke fill; -webkit-text-stroke: 6px #0B0810; text-shadow: 0 0 30px rgba(0,0,0,.8); }
.title.Kalam { font-family: Kalam; font-weight: 700; letter-spacing: 1px; }
.box.small { font: 700 26px/1.2 Kalam; padding: 7px 12px 6px; }
/* a note: explains a word or a measure (siddha, yojana); pale blue so it reads as an aside, not the story */
.box.note { background: #DDEAF0; font-weight: 400; }
/* a gift tag: gold, for the boons */
.box.gift { background: #F6D77A; padding: 6px 14px 5px; }
.bal { position: absolute; transform: translate(-50%, -50%); text-align: center; color: #15110E; font: 700 33px/1.18 Kalam; width: fit-content; }
.bal.whisper { font-weight: 400; font-style: italic; }
.bal.sky { color: #FFE7A6; }
.sfx { position: absolute; transform: translate(-50%, -50%); font: 400 44px/1 Bangers; letter-spacing: 2px; paint-order: stroke fill;
  -webkit-text-stroke: 7px #0B0810; white-space: nowrap; }
.wm { position: absolute; right: 26px; bottom: 3px; font: 400 15px/1 Marcellus; letter-spacing: 1px; color: rgba(241,231,210,.55); }
`;
// positions in panel units; a number in (0, 1] is a fraction of the panel (x of its width, y of its height)
// the smallest lettering a phone can read: a 1080-wide page is ~390 pt on a phone, so 27 px ≈ 10 pt (owner, 21 Nov:
// 19-px caption boxes "look small on phone"). Balloons and boxes below it are raised to it; the back-matter lists aren't.
const MIN_TEXT = 27;
const fr = (v, size) => typeof v === 'number' && v > 0 && v <= 1 ? v * size : v;
function pageHtml(n) {
  const pg = COMIC.pages[n]; let h = `<section class="page" id="p${n}"><img class="art" src="a${n}.jpg"><svg width="${PW}" height="${PH}" viewBox="0 0 ${PW} ${PH}"></svg>`;
  for (const pn of pg.panels) {
    const [px, py, pw, ph] = pn.r, X = v => px + fr(v, pw), Y = v => py + fr(v, ph);
    for (const b of pn.box || []) h += `<div class="box${b.small ? ' small' : ''}${b.list ? ' list' : ''}${b.note ? ' note' : ''}${b.gift ? ' gift' : ''}" style="left:${X(b.x ?? 24)}px;top:${Y(b.y ?? 22)}px;max-width:${fr(b.w ?? .5, pw)}px${b.size ? `;font-size:${b.list ? b.size : Math.max(b.size, MIN_TEXT)}px` : ''}">${esc(b.text)}</div>`;
    for (const t of pn.title || []) h += `<div class="title${t.font ? ' ' + t.font : ''}" style="left:${X(t.x ?? .5)}px;top:${Y(t.y)}px;font-size:${t.size || 96}px;color:${t.col || '#F1E7D2'};${t.w ? `width:${fr(t.w, pw)}px;` : ''}">${esc(t.text)}</div>`;
    for (const b of pn.say || []) {
      const [tx, ty] = b.tail ? [X(b.tail[0]), Y(b.tail[1])] : ['', ''];
      h += `<div class="bal ${b.kind || 'speech'}" data-kind="${b.kind || 'speech'}" data-tx="${tx}" data-ty="${ty}" style="left:${X(b.x)}px;top:${Y(b.y)}px;max-width:${fr(b.w ?? .45, pw)}px${b.size ? `;font-size:${Math.max(b.size, MIN_TEXT)}px` : ''}">${esc(b.text)}</div>`;
    }
    for (const f of pn.sfx || []) h += `<div class="sfx" style="left:${X(f.x)}px;top:${Y(f.y)}px;font-size:${f.size || 44}px;color:${f.col || '#FFE7A6'};transform:translate(-50%,-50%) rotate(${f.rot || 0}rad)">${esc(f.text)}</div>`;
  }
  return h + `<div class="wm">@therishikatha · rishikatha.com</div></section>`;
}
// balloons are drawn in the page, after the words are laid out: an outline pass (ink, wide) then a fill pass, so a
// balloon and its tail read as one shape
const balloonScript = `
const NS = 'http://www.w3.org/2000/svg';
const el = (svg, tag, at) => { const e = document.createElementNS(NS, tag); for (const k in at) e.setAttribute(k, at[k]); svg.appendChild(e); return e; };
for (const page of document.querySelectorAll('.page')) {
  const svg = page.querySelector('svg'), pr = page.getBoundingClientRect(), shapes = [];
  for (const b of page.querySelectorAll('.bal')) {
    const r = b.getBoundingClientRect(), cx = r.left - pr.left + r.width / 2, cy = r.top - pr.top + r.height / 2;
    const kind = b.dataset.kind, rx = r.width / 2 * 1.16 + 24, ry = r.height / 2 * 1.22 + 20;
    let tx = parseFloat(b.dataset.tx), ty = parseFloat(b.dataset.ty);
    // a tail reaches at most ~100 px past the balloon's edge, toward its speaker
    if (!isNaN(tx)) { const a = Math.atan2(ty - cy, tx - cx), ex = cx + Math.cos(a) * rx, ey = cy + Math.sin(a) * ry, d = Math.hypot(tx - ex, ty - ey), m = kind === 'thought' ? 130 : 100;
      if (d > m) { tx = ex + (tx - ex) * m / d; ty = ey + (ty - ey) * m / d; } }
    const s = { kind, parts: [] };
    if (kind === 'thought') {
      const n = Math.max(10, Math.round((rx + ry) / 26));
      for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, bx = cx + Math.cos(a) * rx, by = cy + Math.sin(a) * ry; s.parts.push(['circle', { cx: bx, cy: by, r: Math.min(rx, ry) * .3 + (i % 2) * 6 }]); }
      s.parts.push(['ellipse', { cx, cy, rx, ry }]);
      if (!isNaN(tx)) { const a = Math.atan2(ty - cy, tx - cx), ex = cx + Math.cos(a) * rx * 1.12, ey = cy + Math.sin(a) * ry * 1.12;
        [[.3, 16], [.6, 11], [.85, 7]].forEach(([u, rr]) => s.parts.push(['circle', { cx: ex + (tx - ex) * u, cy: ey + (ty - ey) * u, r: rr }])); }
    } else {
      s.parts.push(['ellipse', { cx, cy, rx, ry }]);
      if (!isNaN(tx)) { const a = Math.atan2(ty - cy, tx - cx), w = .2;
        const p = (da, k) => [cx + Math.cos(a + da) * rx * k, cy + Math.sin(a + da) * ry * k];
        const [ax, ay] = p(-w, .92), [bx, by] = p(w, .92), mx = (ax + tx) / 2, my = (ay + ty) / 2;
        s.parts.push(['path', { d: 'M ' + ax + ' ' + ay + ' Q ' + (mx + (by - ay) * .25) + ' ' + (my - (bx - ax) * .25) + ' ' + tx + ' ' + ty + ' Q ' + ((bx + tx) / 2) + ' ' + ((by + ty) / 2) + ' ' + bx + ' ' + by + ' Z' }]); }
    }
    shapes.push(s);
  }
  for (const s of shapes) for (const [tag, at] of s.parts) el(svg, tag, { ...at, fill: s.kind === 'sky' ? '#1A1206' : '#0B0810', stroke: s.kind === 'sky' ? '#E8B442' : '#0B0810', 'stroke-width': 8, 'stroke-dasharray': s.kind === 'whisper' ? '14 10' : 'none' });
  for (const s of shapes) for (const [tag, at] of s.parts) el(svg, tag, { ...at, fill: s.kind === 'sky' ? '#1A1206' : '#FBF7EE' });
}
window.lettered = true;
`;
const html = `<!doctype html><html><head><meta charset="utf-8"><title>${esc(COMIC.title)}</title><style>${css}</style></head><body>
${pages.map(pageHtml).join('\n')}
<script>document.fonts.ready.then(() => {${balloonScript}});</script></body></html>`;
writeFileSync(`${TMP}/comic.html`, html);

// ---- render: PNG masters, Instagram JPEGs, the PDF, the CBZ
const CHROME = [process.env.CHROME_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find(p => p && existsSync(p));
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--allow-file-access-from-files'] });
const page = await browser.newPage();
await page.setViewport({ width: PW, height: PH, deviceScaleFactor: 2 });
await page.goto(pathToFileURL(resolve(TMP, 'comic.html')).href, { waitUntil: 'networkidle0' });
await page.waitForFunction('window.lettered === true');
const pad = n => String(n).padStart(2, '0');
for (const n of pages) {
  const h = await page.$(`#p${n}`);
  const png = `${OUT}/pages/p${pad(n)}.png`;
  await h.screenshot({ path: png });
  spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', png, '-vf', `scale=${PW}:${PH}:flags=lanczos`, '-q:v', '2', `${OUT}/ig/p${pad(n)}.jpg`]);
  console.log(png);
}
await page.pdf({ path: `${OUT}/${S}.pdf`, width: `${PW}px`, height: `${PH}px`, printBackground: true, preferCSSPageSize: true });
// the reader PDF: the same pages over the smaller art
await page.evaluate(() => Promise.all([...document.querySelectorAll('img.art')].map(i => new Promise(r => { i.onload = i.onerror = r; i.src = i.getAttribute('src').replace(/^a(\d+)\.jpg$/, 'r$1.jpg'); }))));
await page.pdf({ path: `${OUT}/${S}_reader.pdf`, width: `${PW}px`, height: `${PH}px`, printBackground: true, preferCSSPageSize: true });
await browser.close();
rmSync(`${OUT}/${S}.cbz`, { force: true });
spawnSync('zip', ['-q', '-j', '-0', resolve(`${OUT}/${S}.cbz`), ...pages.map(n => resolve(`${OUT}/pages/p${pad(n)}.png`))]);
console.log(`${OUT}/${S}.pdf\n${OUT}/${S}_reader.pdf\n${OUT}/${S}.cbz`);

// ---- EPUB 3, fixed layout: one page at a time
if (!args.pages) {
  const E = `${TMP}/epub`; rmSync(E, { recursive: true, force: true });
  mkdirSync(`${E}/META-INF`, { recursive: true }); mkdirSync(`${E}/OEBPS/img`, { recursive: true });
  writeFileSync(`${E}/mimetype`, 'application/epub+zip');
  writeFileSync(`${E}/META-INF/container.xml`, `<?xml version="1.0" encoding="UTF-8"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>`);
  const VW = 1440, VH = 1800, lang = COMIC.lang || 'en', title = `${COMIC.series} ${COMIC.issue}: ${COMIC.title}`;
  writeFileSync(`${E}/OEBPS/page.css`, `html, body { margin: 0; padding: 0; } body { width: ${VW}px; height: ${VH}px; overflow: hidden; background: #000; } img { position: absolute; left: 0; top: 0; width: ${VW}px; height: ${VH}px; }`);
  // the words of a page, in reading order, for the image's alt text (screen readers, search)
  const words = n => COMIC.pages[n].panels.flatMap(p => [...(p.title || []), ...(p.box || []), ...(p.say || []), ...(p.sfx || [])].map(w => w.text)).join(' / ').replace(/\s+/g, ' ');
  for (const n of pages) {
    spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', `${OUT}/pages/p${pad(n)}.png`, '-vf', `scale=${VW}:${VH}:flags=lanczos`, '-q:v', '3', `${E}/OEBPS/img/p${pad(n)}.jpg`]);
    writeFileSync(`${E}/OEBPS/p${pad(n)}.xhtml`, `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="${lang}" xml:lang="${lang}"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=${VW}, height=${VH}"/><title>${esc(title)}, page ${n}</title><link rel="stylesheet" href="page.css"/></head>
<body><img src="img/p${pad(n)}.jpg" alt="${esc(words(n) || 'Page ' + n)}"/></body></html>`);
  }
  writeFileSync(`${E}/OEBPS/nav.xhtml`, `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="${lang}" xml:lang="${lang}"><head><meta charset="utf-8"/><title>${esc(title)}</title></head><body>
<nav epub:type="toc" id="toc"><ol><li><a href="p01.xhtml">${esc(title)}</a></li><li><a href="p${pad(pages[pages.length - 2])}.xhtml">Facts used</a></li></ol></nav>
<nav epub:type="page-list" hidden=""><ol>${pages.map(n => `<li><a href="p${pad(n)}.xhtml">${n}</a></li>`).join('')}</ol></nav></body></html>`);
  const now = new Date().toISOString().replace(/\.\d+Z$/, 'Z'), id = COMIC.uuid || `urn:uuid:3c6a1e52-9b0f-4d8e-a7c1-${S.padEnd(12, '0').slice(0, 12).replace(/[^0-9a-f]/g, 'a')}`;
  writeFileSync(`${E}/OEBPS/content.opf`, `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="bookid" xml:lang="${lang}" prefix="rendition: http://www.idpf.org/vocab/rendition/#">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
<dc:identifier id="bookid">${id}</dc:identifier><dc:title>${esc(title)}</dc:title><dc:language>${lang}</dc:language>
<dc:creator>Rishi Katha</dc:creator><dc:publisher>Rishi Katha</dc:publisher>
<meta property="dcterms:modified">${now}</meta>
<meta property="rendition:layout">pre-paginated</meta><meta property="rendition:spread">none</meta><meta property="rendition:orientation">portrait</meta>
<meta name="cover" content="cover-img"/>
</metadata>
<manifest>
<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
<item id="css" href="page.css" media-type="text/css"/>
${pages.map((n, i) => `<item id="p${pad(n)}" href="p${pad(n)}.xhtml" media-type="application/xhtml+xml"/>
<item id="${i ? 'i' + pad(n) : 'cover-img'}" href="img/p${pad(n)}.jpg" media-type="image/jpeg"${i ? '' : ' properties="cover-image"'}/>`).join('\n')}
</manifest>
<spine>${pages.map(n => `<itemref idref="p${pad(n)}"/>`).join('')}</spine>
</package>`);
  const ep = resolve(OUT, `${S}.epub`); rmSync(ep, { force: true });
  spawnSync('zip', ['-X0q', ep, 'mimetype'], { cwd: E, stdio: 'inherit' });
  spawnSync('zip', ['-rX9q', ep, 'META-INF', 'OEBPS'], { cwd: E, stdio: 'inherit' });
  console.log(`${OUT}/${S}.epub`);
}
