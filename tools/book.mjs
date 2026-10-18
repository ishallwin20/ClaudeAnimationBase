// book.mjs: lays out a picture book from its art and its words, and writes the print PDFs and a fixed-layout EPUB.
//
//   node tools/book.mjs --book=books/surya [--pages=6,7] [--render] [--out=out/books/surya_out]
//   node tools/book.mjs --book=books/surya --pages=10,11 --page=book_cine.html --art=out/book_surya/art_cine --variant=cine --panels
//     (another art style: --page renders the art from another studio page into --art; --variant merges
//     BOOK.variants[name].pages over the pages, e.g. bubbles placed for that art; --panels sets the story text on soft
//     cream panels, as picture books over busy art do)
//
// The art is the book's spreads, painted in the reel engine (studio.html on the book's branch: one slot per spread,
// rendered at t = slot + .5 into out/book_<slug>/art/t<slot>_50.png; --render renders any that are missing, --render=all
// re-renders them). The words come from <book>/book.js (BOOK: pages, text blocks, speech bubbles, in mm on the trim).
// Text stays live text: vector in the PDFs, reflow-free but selectable and read-aloud in the EPUB.
//
// Writes into --out:
//   <slug>_interior.pdf   the 16 (or --pages) interior pages, one per PDF page, trim + bleed all round (146 × 226 mm for
//                         a 140 × 220 trim); the printer imposes them onto sheets
//   <slug>_cover.pdf      the cover sheet with bleed: outside (back | front), inside (inside front | inside back)
//   <slug>_preview.pdf    reader spreads at trim size, no bleed (for reviewing and sharing)
//   <slug>.epub           fixed-layout EPUB 3 (pre-paginated, spreads), 10 px per mm, fonts embedded
// Fonts: assets/fonts (Andika for the story, Marcellus for titles; both SIL OFL).
import puppeteer from 'puppeteer-core';
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync, existsSync, rmSync, copyFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
if (!args.book) { console.error('usage: node tools/book.mjs --book=books/<slug> [--pages=6,7] [--render]'); process.exit(1); }
const BOOK = runInNewContext(readFileSync(join(args.book, 'book.js'), 'utf8') + '\n;BOOK');
if (args.variant) for (const [k, v] of Object.entries(BOOK.variants?.[args.variant]?.pages || {})) BOOK.pages[k] = { ...BOOK.pages[k], ...v };
const S = BOOK.slug, TW = BOOK.trim.w, TH = BOOK.trim.h, BL = BOOK.bleed, OUT = args.out || `out/books/${S}_out`;
const ART = args.art || `out/book_${S}/art`, TMP = `out/book_${S}/tmp`;
mkdirSync(OUT, { recursive: true }); mkdirSync(TMP, { recursive: true });

// ---- which art a page uses: [slot, 'L' | 'R']
const where = k => k === 'ifc' ? [0, 'L'] : k === 'ibc' ? [8, 'R'] : k === 'back' ? [9, 'L'] : k === 'front' ? [9, 'R'] : [Math.floor(k / 2), k % 2 ? 'R' : 'L'];
const ALL = Array.from({ length: 16 }, (_, i) => i + 1);
const pages = args.pages ? String(args.pages).split(',').map(Number) : ALL;
const sample = !!args.pages;
const SPREADS = [['ifc', 1], [2, 3], [4, 5], [6, 7], [8, 9], [10, 11], [12, 13], [14, 15], [16, 'ibc']]
  .filter(([a, b]) => !sample || pages.includes(a) || pages.includes(b));
const needed = [...new Set([...pages, ...(sample ? [] : ['ifc', 'ibc', 'front', 'back']), ...SPREADS.flat()].map(k => where(k)[0]))].sort((a, b) => a - b);

// ---- render missing art through render.mjs
const artOf = slot => `${ART}/t${slot}_50.png`;
const todo = needed.filter(s => args.render === 'all' || !existsSync(artOf(s)));
if (todo.length) {
  if (!args.render) { console.error(`missing art for slots ${todo.join(', ')} (pass --render)`); process.exit(1); }
  const r = spawnSync('node', ['render.mjs', `--stills=${todo.map(s => s + .5).join(',')}`, `--out=${ART}`, ...(args.page ? [`--page=${args.page}`] : [])], { stdio: 'inherit' });
  if (r.status) process.exit(r.status);
}

const CHROME = [process.env.CHROME_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find(p => p && existsSync(p));
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--allow-file-access-from-files'] });
const page = await browser.newPage();
const url = p => pathToFileURL(resolve(p)).href;

// ---- crop the spreads into page images: with bleed for print (JPEG at 300 dpi), at trim for the screen (10 px/mm)
writeFileSync(`${TMP}/blank.html`, '<!doctype html><title>crop</title>'); await page.goto(url(`${TMP}/blank.html`));   // file:// so the art loads untainted
async function crop(src, mmBox, pxPerMM, dst, q = .93) {
  const data = await page.evaluate(async (src, box, k, q) => {
    const img = new Image(); img.src = src; await img.decode();
    const s = img.naturalWidth / 286;   // art px per mm (the spread is 286 mm wide with its bleed)
    const [x, y, w, h] = box, c = document.createElement('canvas'); c.width = Math.round(w * k); c.height = Math.round(h * k);
    const g = c.getContext('2d'); g.imageSmoothingQuality = 'high';
    g.drawImage(img, x * s, y * s, w * s, h * s, 0, 0, c.width, c.height);
    return c.toDataURL('image/jpeg', q);
  }, url(src), mmBox, pxPerMM, q);
  writeFileSync(dst, Buffer.from(data.split(',')[1], 'base64'));
  return dst;
}
const SW = 2 * TW + 2 * BL;
const bleedBox = side => side === 'L' ? [0, 0, TW + 2 * BL, TH + 2 * BL] : [TW, 0, TW + 2 * BL, TH + 2 * BL];
const trimBox = side => side === 'L' ? [BL, BL, TW, TH] : [BL + TW, BL, TW, TH];
const keys = [...new Set([...pages, ...SPREADS.flat(), ...(sample ? [] : ['front', 'back'])])];
const IMG = {};
for (const k of keys) {
  const [slot, side] = where(k), dpi300 = 300 / 25.4;
  IMG[k] = { print: await crop(artOf(slot), bleedBox(side), dpi300, `${TMP}/p_${k}.jpg`), screen: await crop(artOf(slot), trimBox(side), 10, `${TMP}/s_${k}.jpg`, .88) };
}
if (!sample) IMG.outside = { print: await crop(artOf(9), [0, 0, SW, TH + 2 * BL], 300 / 25.4, `${TMP}/p_outside.jpg`) };

// ---- page markup. U() turns mm into the unit of the medium: mm in the PDFs, px (10 per mm) in the EPUB
const FONTS = { story: 'Andika', title: 'Marcellus' };
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function fontCSS(base) {
  return `@font-face { font-family: Andika; src: url(${base}Andika-Regular.ttf); }
@font-face { font-family: Andika; font-weight: bold; src: url(${base}Andika-Bold.ttf); }
@font-face { font-family: Marcellus; src: url(${base}Marcellus-Regular.ttf); }`;
}
// a speech bubble's tail, from the bubble's edge nearest the point it speaks from to that point
function tailPath(b, h, U) {
  const [tx, ty] = b.tail, below = ty > b.y + h, bx = clamp(tx, b.x + b.w * .22, b.x + b.w * .78), by = below ? b.y + h - .6 : b.y + .6, hw = 3.6;
  const mx = (bx + tx) / 2 + (tx > bx ? -2 : 2), my = (by + ty) / 2;
  return `M${U(bx - hw)} ${U(by)} Q${U(mx)} ${U(my)} ${U(tx)} ${U(ty)} Q${U(mx + hw * .6)} ${U(my)} ${U(bx + hw)} ${U(by)} Z`;
}
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
// the inside of one page: text blocks, boxes, pictures and bubbles over the art. ox/oy: where the trim sits in the page
// box (the bleed). src maps a picture's path to its URL in the medium.
const BOX = { fact: 'Did you know?', find: 'Can you find…?' };
function pageInner(k, U, ox, oy, heights, src = p => url(p)) {
  const P = BOOK.pages[k] || {}, n = U.n, pt = v => U.pt(v);
  let h = '';
  for (const im of P.images || []) h += `<img class="im" src="${src(im.src)}" alt="" style="left:${n(ox + im.x)};top:${n(oy + im.y)};width:${n(im.w)}"/>`;
  for (const b of P.boxes || []) {
    const sz = b.size || BOOK.size - 4;
    h += `<div class="bx" style="left:${n(ox + b.x)};top:${n(oy + b.y)};width:${n(b.w)};font-size:${pt(sz)};padding:${n(2.2)} ${n(3)};border-width:${n(.45)};border-radius:${n(4)}">`
      + `<p style="margin:0 0 ${pt(sz * .2)};font-weight:bold;color:${BOOK.accent || '#F15A24'}">${esc(b.title || BOX[b.kind])}</p><p style="margin:0">${esc(b.text)}</p></div>`;
  }
  for (const b of P.text || []) {
    const f = FONTS[b.font || 'story'], sz = b.size || BOOK.size;
    const pan = args.panels && (b.font || 'story') === 'story' && !b.size;
    h += `<div class="tx${pan ? ' pan' : ''}" style="left:${n(ox + b.x)};top:${n(oy + b.y)};width:${n(b.w)};font-family:${f};font-size:${pt(sz)};text-align:${b.align || 'left'};color:${pan ? BOOK.ink : b.color || BOOK.ink}${pan ? `;padding:${n(3)} ${n(4)};border-radius:${n(6)};box-shadow:0 0 ${n(4)} ${n(2.5)} rgba(255,250,240,.86)` : ''}">`
      + b.lines.map(l => `<p style="margin:0 0 ${pt(sz * .45)}">${esc(l)}</p>`).join('') + '</div>';
  }
  (P.bubbles || []).forEach((b, i) => {
    const sz = b.size || BOOK.size - 2, bh = heights?.[`${k}.${i}`];
    const Bm = { ...b, x: ox + b.x, y: oy + b.y, tail: [ox + b.tail[0], oy + b.tail[1]] };
    if (bh) h += `<svg xmlns="http://www.w3.org/2000/svg" class="tl" style="left:0;top:0;width:${n(TW + 2 * ox)};height:${n(TH + 2 * oy)}" viewBox="0 0 ${U.v(TW + 2 * ox)} ${U.v(TH + 2 * oy)}"><path d="${tailPath(Bm, bh, U.v)}" fill="#FFF8EC" stroke="${BOOK.ink}" stroke-width="${U.v(1)}" stroke-linejoin="round"/></svg>`;
    h += `<div class="bb" data-k="${k}.${i}" style="left:${n(Bm.x)};top:${n(Bm.y)};width:${n(b.w)};font-size:${pt(sz)};padding:${n(2.4)} ${n(3.4)};border-width:${n(.5)};border-radius:${n(6)}">${esc(b.text)}</div>`;
    if (bh) h += `<svg xmlns="http://www.w3.org/2000/svg" class="tl" style="left:0;top:0;width:${n(TW + 2 * ox)};height:${n(TH + 2 * oy)}" viewBox="0 0 ${U.v(TW + 2 * ox)} ${U.v(TH + 2 * oy)}"><path d="${tailPath(Bm, bh, U.v)}" fill="#FFF8EC"/></svg>`;
  });
  return h;
}
const MM = { n: v => `${+v.toFixed(3)}mm`, v: v => +v.toFixed(3), pt: v => `${v}pt` };
const PX = { n: v => `${+(v * 10).toFixed(2)}px`, v: v => +(v * 10).toFixed(2), pt: v => `${+(v * 25.4 / 72 * 10).toFixed(2)}px` };
const baseCSS = `* { box-sizing: border-box; } html, body { margin: 0; padding: 0; }
.pg { position: relative; overflow: hidden; break-after: page; }
.pg > img:not(.im) { position: absolute; left: 0; top: 0; width: 100%; height: 100%; }
.tx { position: absolute; line-height: 1.32; }
.pan { background: rgba(255,250,240,.86); }
.bb { position: absolute; background: #FFF8EC; border-style: solid; border-color: ${BOOK.ink}; color: ${BOOK.ink}; font-family: Andika; line-height: 1.25; text-align: center; }
.tl { position: absolute; overflow: visible; }
.im { position: absolute; height: auto; }
.bx { position: absolute; background: #FFF8EC; border-style: solid; border-color: ${BOOK.ink}; color: ${BOOK.ink}; font-family: Andika; line-height: 1.28; }`;

async function pdf(html, file, w, h) {
  const f = `${TMP}/${file}.html`; writeFileSync(f, html);
  await page.goto(url(f), { waitUntil: 'load' }); await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: join(OUT, file + '.pdf'), width: `${w}mm`, height: `${h}mm`, printBackground: true, pageRanges: '' });
  console.log('wrote', join(OUT, file + '.pdf'));
}
const doc = (body, w, h) => `<!doctype html><html><head><meta charset="utf-8"><style>${fontCSS(url('assets/fonts') + '/')}
@page { size: ${w}mm ${h}mm; margin: 0; } ${baseCSS} .pg { width: ${w}mm; height: ${h}mm; }</style></head><body>${body}</body></html>`;

// ---- measure the bubbles once (their height sets where the tail leaves them), at print size
const PW = TW + 2 * BL, PH = TH + 2 * BL;
const measureHTML = doc(keys.map(k => `<section class="pg">${pageInner(k, MM, BL, BL)}</section>`).join(''), PW, PH);
writeFileSync(`${TMP}/measure.html`, measureHTML);
await page.goto(url(`${TMP}/measure.html`), { waitUntil: 'load' }); await page.evaluate(() => document.fonts.ready);
const HT = await page.evaluate(() => { const o = {}, mm = 96 / 25.4; document.querySelectorAll('.bb').forEach(e => { o[e.dataset.k] = e.getBoundingClientRect().height / mm; }); return o; });

// ---- interior, preview, cover
const pgP = k => `<section class="pg"><img src="${url(IMG[k].print)}">${pageInner(k, MM, BL, BL, HT)}</section>`;
await pdf(doc(pages.map(pgP).join(''), PW, PH), `${S}_interior`, PW, PH);
const half = (k, dx) => `<div style="position:absolute;left:${dx}mm;top:0;width:${TW}mm;height:${TH}mm;overflow:hidden"><img src="${url(IMG[k].screen)}" style="width:100%;height:100%;position:absolute">${pageInner(k, MM, 0, 0, HT)}</div>`;
await pdf(doc(SPREADS.map(([a, b]) => `<section class="pg">${half(a, 0)}${half(b, TW)}</section>`).join(''), 2 * TW, TH), `${S}_preview`, 2 * TW, TH);
if (!sample) {
  const CW = 2 * TW + 2 * BL, side = (k, dx) => `<div style="position:absolute;left:${dx}mm;top:0;width:${PW}mm;height:${PH}mm">${pageInner(k, MM, BL, BL, HT)}</div>`;
  const outside = `<section class="pg"><img src="${url(IMG.outside.print)}">${side('back', 0)}${side('front', TW)}</section>`;
  const inside = `<section class="pg"><div style="position:absolute;left:0;top:0;width:${PW}mm;height:${PH}mm;overflow:hidden"><img src="${url(IMG.ifc.print)}" style="width:100%;height:100%">${pageInner('ifc', MM, BL, BL, HT)}</div>`
    + `<div style="position:absolute;left:${TW}mm;top:0;width:${PW}mm;height:${PH}mm;overflow:hidden;clip-path:inset(0 0 0 ${BL}mm)"><img src="${url(IMG.ibc.print)}" style="width:100%;height:100%">${pageInner('ibc', MM, BL, BL, HT)}</div></section>`;
  await pdf(doc(outside + inside, CW, PH), `${S}_cover`, CW, PH);
}

// ---- EPUB 3, fixed layout
{
  const E = `${TMP}/epub`; rmSync(E, { recursive: true, force: true });
  mkdirSync(`${E}/META-INF`, { recursive: true }); mkdirSync(`${E}/OEBPS/img`, { recursive: true }); mkdirSync(`${E}/OEBPS/fonts`, { recursive: true });
  writeFileSync(`${E}/mimetype`, 'application/epub+zip');
  writeFileSync(`${E}/META-INF/container.xml`, `<?xml version="1.0" encoding="UTF-8"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>`);
  for (const f of ['Andika-Regular.ttf', 'Andika-Bold.ttf', 'Marcellus-Regular.ttf']) copyFileSync(`assets/fonts/${f}`, `${E}/OEBPS/fonts/${f}`);
  writeFileSync(`${E}/OEBPS/book.css`, `${fontCSS('fonts/')}\n${baseCSS}\nbody { width: ${TW * 10}px; height: ${TH * 10}px; position: relative; overflow: hidden; }`);
  const order = sample ? pages : ['front', ...ALL, 'ibc', 'back'], VW = TW * 10, VH = TH * 10;
  const name = k => `p_${k}`, PICS = new Map();
  const epubSrc = p => { const f = 'pic_' + p.split('/').pop(); if (!PICS.has(f)) { copyFileSync(p, `${E}/OEBPS/img/${f}`); PICS.set(f, p); } return `img/${f}`; };
  for (const k of order) {
    copyFileSync(IMG[k].screen, `${E}/OEBPS/img/${name(k)}.jpg`);
    writeFileSync(`${E}/OEBPS/${name(k)}.xhtml`, `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="${BOOK.lang}" xml:lang="${BOOK.lang}"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=${VW}, height=${VH}"/><title>${esc(BOOK.title)} ${k}</title><link rel="stylesheet" href="book.css"/></head>
<body><img src="img/${name(k)}.jpg" alt="" style="position:absolute;left:0;top:0;width:${VW}px;height:${VH}px"/>${pageInner(k, PX, 0, 0, HT, epubSrc)}</body></html>`);
  }
  const spreadProp = (k, i) => k === 'front' || k === 'back' ? 'rendition:page-spread-center' : (typeof k === 'number' ? (k % 2 ? 'page-spread-right' : 'page-spread-left') : (k === 'ibc' ? 'page-spread-right' : 'page-spread-left'));
  const nav = `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="${BOOK.lang}" xml:lang="${BOOK.lang}"><head><meta charset="utf-8"/><title>${esc(BOOK.title)}</title></head><body>
<nav epub:type="toc" id="toc"><ol><li><a href="${name(order[0])}.xhtml">${esc(BOOK.title)}: ${esc(BOOK.subtitle)}</a></li></ol></nav>
<nav epub:type="page-list" hidden=""><ol>${order.filter(k => typeof k === 'number').map(k => `<li><a href="${name(k)}.xhtml">${k}</a></li>`).join('')}</ol></nav></body></html>`;
  writeFileSync(`${E}/OEBPS/nav.xhtml`, nav);
  const now = new Date().toISOString().replace(/\.\d+Z$/, 'Z'), id = `urn:uuid:${BOOK.uuid || '7b1f3c2e-5d1a-4f7e-9a51-' + S.padEnd(12, '0').slice(0, 12).replace(/[^0-9a-f]/g, 'a')}`;
  const opf = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="bookid" xml:lang="${BOOK.lang}" prefix="rendition: http://www.idpf.org/vocab/rendition/#">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
<dc:identifier id="bookid">${id}</dc:identifier><dc:title>${esc(BOOK.title)}: ${esc(BOOK.subtitle)}</dc:title><dc:language>${BOOK.lang}</dc:language>
<dc:creator>${esc(BOOK.publisher)}</dc:creator><dc:publisher>${esc(BOOK.publisher)}</dc:publisher>
<meta property="dcterms:modified">${now}</meta>
<meta property="rendition:layout">pre-paginated</meta><meta property="rendition:spread">landscape</meta><meta property="rendition:orientation">auto</meta>
<meta name="cover" content="cover-img"/>
</metadata>
<manifest>
<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
<item id="css" href="book.css" media-type="text/css"/>
${['Andika-Regular', 'Andika-Bold', 'Marcellus-Regular'].map((f, i) => `<item id="f${i}" href="fonts/${f}.ttf" media-type="font/ttf"/>`).join('\n')}
${order.map(k => `<item id="${name(k)}" href="${name(k)}.xhtml" media-type="application/xhtml+xml"${BOOK.pages[k]?.bubbles?.length ? ' properties="svg"' : ''}/>
<item id="${k === order[0] ? 'cover-img' : 'i_' + k}" href="img/${name(k)}.jpg" media-type="image/jpeg"${k === order[0] ? ' properties="cover-image"' : ''}/>`).join('\n')}
${[...PICS.keys()].map((f, i) => `<item id="pic${i}" href="img/${f}" media-type="${f.endsWith('.png') ? 'image/png' : 'image/jpeg'}"/>`).join('\n')}
</manifest>
<spine>${order.map((k, i) => `<itemref idref="${name(k)}" properties="${spreadProp(k, i)}"/>`).join('')}</spine>
</package>`;
  writeFileSync(`${E}/OEBPS/content.opf`, opf);
  const ep = resolve(OUT, `${S}.epub`); rmSync(ep, { force: true });
  spawnSync('zip', ['-X0q', ep, 'mimetype'], { cwd: E, stdio: 'inherit' });
  spawnSync('zip', ['-rX9q', ep, 'META-INF', 'OEBPS'], { cwd: E, stdio: 'inherit' });
  console.log('wrote', ep);
}
await browser.close();
