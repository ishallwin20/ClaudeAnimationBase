// stickers.mjs: cuts the stickers of stickers.html (src/scenes/stickers.js) and lays them out on a print sheet.
//
//   node tools/stickers.mjs [--sheet=12x18] [--dpi=300] [--border=30] [--margin=0.35] [--gap=0.14] [--scale=.84]
//                           [--only=id,id] [--pick=16] [--fit] [--pack] [--out=out/stickers_out]
//   --pick=N takes N stickers at random; --fit finds the largest scale at which the chosen set fills one sheet;
//   --pack lays a chosen set out in shelves (tallest first) instead of STK's own rows (--pick and --fit do too).
//
// Writes, into --out:
//   stickers/<id>.png     each sticker on its own (RGBA: white border, clear outside the cut)
//   sheet_print.png       the sheet at print size (white, art only), 300 dpi
//   sheet_cut.svg         the cut lines as vectors, the same size as the sheet (for the plotter / the printer's cut layer)
//   sheet_preview.jpg     what the sheet looks like: a coloured backing, the cut lines, soft shadows
// Sizes come from each sticker's h (or w) in inches in STK, times STK_K (or --scale); the border is the same width on
// every sticker. A sticker with br: 1 starts a new row; a row that gets too wide wraps by itself.
import puppeteer from 'puppeteer-core';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { crc32 } from 'node:zlib';

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const CHROME = [args.chrome, process.env.CHROME_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium',
  'C:/Program Files/Google/Chrome/Application/chrome.exe'].find(p => p && existsSync(p));
if (!CHROME) { console.error('Chrome not found: pass --chrome=<path> or set CHROME_PATH'); process.exit(1); }
const dpi = +(args.dpi || 300), [SW, SH] = String(args.sheet || '12x18').split('x').map(v => Math.round(+v * dpi));
const border = +(args.border || 30), margin = Math.round(+(args.margin || .35) * dpi), gap = Math.round(+(args.gap || .14) * dpi);
const out = args.out || 'out/stickers_out'; mkdirSync(out + '/stickers', { recursive: true });
const bytes = url => Buffer.from(url.slice(url.indexOf(',') + 1), 'base64');
// a PNG with its resolution written in (a pHYs chunk after IHDR), so print software opens it at the right size
function withDpi(png, dpi) {
  const ppm = Math.round(dpi / .0254), data = Buffer.alloc(9); data.writeUInt32BE(ppm, 0); data.writeUInt32BE(ppm, 4); data[8] = 1;
  const body = Buffer.concat([Buffer.from('pHYs'), data]), chunk = Buffer.alloc(body.length + 8);
  chunk.writeUInt32BE(9, 0); body.copy(chunk, 4); chunk.writeUInt32BE(crc32(body) >>> 0, body.length + 4);
  return Buffer.concat([png.subarray(0, 33), chunk, png.subarray(33)]);
}

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, protocolTimeout: 0,
  args: ['--allow-file-access-from-files', '--ignore-gpu-blocklist', process.platform === 'darwin' ? '--use-angle=metal' : '--use-gl=angle', '--enable-gpu-rasterization', '--window-size=1920,1080'] });
const page = await browser.newPage();
page.on('console', m => { if (['error', 'warn'].includes(m.type())) console.log('[page]', m.text()); });
page.on('pageerror', e => console.log('[page error]', e.message));
await page.goto(pathToFileURL(resolve('stickers.html')).href + '?render', { waitUntil: 'networkidle0' });
await page.waitForFunction('window.ready === true', { timeout: 60000 });

const ids = await page.evaluate(() => STK.map(s => s.id));
let only = args.only ? String(args.only).split(',') : null;
if (args.pick) {   // --pick=N: N stickers at random (the ids are printed, so --only=… repeats the sheet)
  const pool = (only || ids).slice(); for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
  only = pool.slice(0, +args.pick); console.log('picked: --only=' + only.join(','));
}
const want = ids.map((id, i) => ({ id, i })).filter(s => !only || only.includes(s.id));
const UW = SW - 2 * margin, UH = SH - 2 * margin, pad = 2 * (border + 6);
// Shelves: the tallest first, each sticker into the first row with room for it. Used for --pack and --fit, where the
// set isn't the full sheet and STK's own rows (br) mean nothing.
function shelves(list) {
  const rows = [];
  for (const s of [...list].sort((a, b) => b.h - a.h)) {
    const row = rows.find(r => r.reduce((a, b) => a + b.w + gap, 0) + s.w <= UW);
    if (row) row.push(s); else rows.push([s]);
  }
  return rows;
}
const heightOf = rows => rows.reduce((a, r) => a + Math.max(...r.map(s => s.h)), 0) + gap * (rows.length - 1);
// --fit: the largest scale at which the set still fits the sheet, from the art's sizes at scale 1
let scale = args.scale ? +args.scale : null;
if (args.fit) {
  const sizes = []; for (const s of want) sizes.push(await page.evaluate((i, o) => window.stickerAt(i, o), s.i, { dpi, measure: true }));
  const fits = k => { const list = sizes.map(s => ({ w: s.h * s.ar * k * dpi + pad, h: s.h * k * dpi + pad })); return list.every(s => s.w <= UW) && heightOf(shelves(list)) <= UH; };
  let lo = .2, hi = 6; for (let n = 0; n < 40; n++) { const mid = (lo + hi) / 2; if (fits(mid)) lo = mid; else hi = mid; }
  scale = Math.floor(lo * 100) / 100; console.log(`--fit: scale ${scale}`);
}
const items = [];
for (const { i } of want) {
  const t0 = Date.now(), s = await page.evaluate((i, o) => window.stickerAt(i, o), i, { dpi, border, ...(scale ? { k: scale } : {}) });
  writeFileSync(`${out}/stickers/${s.id}.png`, withDpi(bytes(s.png), dpi));
  console.log(`${s.id.padEnd(22)} ${(s.w / dpi).toFixed(2)} x ${(s.h / dpi).toFixed(2)} in  scale ${s.scale.toFixed(2)}${s.scale > 1 ? '  (enlarged past the painted size)' : ''}${s.parts > 1 ? '  !! more than one piece' : ''}${s.clipped ? '  !! art touches the canvas edge' : ''}  ${Date.now() - t0} ms`);
  items.push(s);
}

// rows: STK's own (in order, a new row at br: 1 or when one fills up), or shelves; then spread the rows down the sheet
// and the stickers along each row
let rows = [[]];
if (args.pack || args.fit || args.pick) rows = shelves(items);
else for (const s of items) {
  const row = rows[rows.length - 1], w = row.reduce((a, b) => a + b.w + gap, 0);
  if (row.length && (s.br || w + s.w > UW)) rows.push([s]); else row.push(s);
}
const rowH = rows.map(r => Math.max(...r.map(s => s.h))), total = heightOf(rows);
const vgap = rows.length > 1 ? gap + Math.min(Math.max(0, UH - total) / (rows.length - 1), gap * 2) : gap;
let y = margin + Math.max(0, (UH - (total + (vgap - gap) * (rows.length - 1))) / 2);
rows.forEach((r, k) => {
  const w = r.reduce((a, b) => a + b.w, 0), free = UW - w, g = free / (r.length + 1);
  let x = margin + g;
  for (const s of r) { s.x = Math.round(x); s.y = Math.round(y + (rowH[k] - s.h) / 2); x += s.w + g; }
  y += rowH[k] + vgap;
});
const wide = rows.some(r => r.reduce((a, b) => a + b.w + gap, -gap) > UW);
console.log(`${items.length} stickers in ${rows.length} rows (${rows.map(r => r.length).join(' ')}); rows need ${(total / dpi).toFixed(2)} in of ${(UH / dpi).toFixed(2)} in${total > UH ? '  !! TOO TALL: the sheet overflows' : ''}${wide ? '  !! TOO WIDE: a row overflows' : ''}`);

const place = items.map(({ png, x, y, w, h, path }) => ({ png, x, y, w, h, path }));
const compose = o => page.evaluate((items, o) => window.sheetCompose(items, o), place, { w: SW, h: SH, ...o });
writeFileSync(`${out}/sheet_print.png`, withDpi(bytes(await compose({ mode: 'print' })), dpi));
writeFileSync(`${out}/sheet_preview.jpg`, bytes(await compose({ mode: 'preview', scale: 2400 / SH, type: 'image/jpeg' })));
const d = s => 'M' + s.path.map(([a, b]) => `${(s.x + a).toFixed(1)} ${(s.y + b).toFixed(1)}`).join('L') + 'Z';
writeFileSync(`${out}/sheet_cut.svg`, `<svg xmlns="http://www.w3.org/2000/svg" width="${SW / dpi}in" height="${SH / dpi}in" viewBox="0 0 ${SW} ${SH}">\n` +
  `<g id="CutContour" fill="none" stroke="#E6007E" stroke-width="1">\n${items.map(s => `<path id="${s.id}" d="${d(s)}"/>`).join('\n')}\n</g>\n</svg>\n`);
console.log(`wrote ${out}/sheet_print.png (${SW} x ${SH}), sheet_cut.svg, sheet_preview.jpg`);
await browser.close();
