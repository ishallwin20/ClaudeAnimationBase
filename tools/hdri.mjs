// hdri.mjs: fetch a Poly Haven HDRI (CC0, polyhaven.com) and pack it for the 3D style as src/data/hdri_<name>.js, so
// studio.html still opens from file://. The light: the .hdr at --res (1k, 2k), its RLE scanlines decoded to raw RGBE
// bytes, deflated (pako inflates it in the page) and base64'd. --bg=<width>: also the Poly Haven tonemapped JPG, scaled
// to that width (sips), as a data URI, for a sharp sky behind the scene (the 1k light is too soft to look at).
//
//   node tools/hdri.mjs --id=kloofendal_48d_partly_cloudy_puresky --name=day [--res=1k] [--bg=4096]
//
// In the page: <script src="src/data/hdri_day.js"> after cine3d_fx.js, then env3(scene, 'day', { bg: true }).
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
import { execFileSync } from 'node:child_process';

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const id = args.id, name = args.name || id, res = args.res || '1k';
if (!id) { console.error('usage: node tools/hdri.mjs --id=<polyhaven id> --name=<short name> [--res=1k] [--bg=4096]'); process.exit(1); }
const CACHE = 'out/hdri_cache'; mkdirSync(CACHE, { recursive: true });
async function get(url, file) {
  if (existsSync(file)) return readFileSync(file);
  const r = await fetch(url); if (!r.ok) throw new Error(url + ' ' + r.status);
  const b = Buffer.from(await r.arrayBuffer()); writeFileSync(file, b); return b;
}
const files = await (await fetch('https://api.polyhaven.com/files/' + id)).json();
const hdr = await get(files.hdri[res].hdr.url, `${CACHE}/${id}_${res}.hdr`);

// ---- Radiance .hdr: a text header, a blank line, "-Y h +X w", then w × h RGBE pixels, each scanline new-style RLE
let p = 0; const line = () => { let s = ''; while (hdr[p] !== 0x0a) s += String.fromCharCode(hdr[p++]); p++; return s; };
let l; do l = line(); while (l !== '');
const m = line().match(/-Y (\d+) \+X (\d+)/), h = +m[1], w = +m[2];
const out = new Uint8Array(w * h * 4), row = new Uint8Array(w * 4);
for (let y = 0; y < h; y++) {
  if (hdr[p] === 2 && hdr[p + 1] === 2 && ((hdr[p + 2] << 8) | hdr[p + 3]) === w) {
    p += 4;
    for (let ch = 0; ch < 4; ch++) for (let x = 0; x < w;) {
      let n = hdr[p++];
      if (n > 128) { n -= 128; const v = hdr[p++]; while (n--) row[(x++) * 4 + ch] = v; }
      else while (n--) row[(x++) * 4 + ch] = hdr[p++];
    }
  } else { for (let i = 0; i < w * 4; i++) row[i] = hdr[p++]; }   // flat scanline
  out.set(row, y * w * 4);
}
const light = deflateSync(Buffer.from(out), { level: 9 }).toString('base64');

// ---- the sky to look at: the tonemapped JPG, scaled
let bg = '';
if (args.bg) {
  const big = `${CACHE}/${id}_tm.jpg`, small = `${CACHE}/${id}_tm_${args.bg}.jpg`;
  await get(files.tonemapped.url, big);
  if (!existsSync(small)) execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '82', '--resampleWidth', String(args.bg), big, '--out', small], { stdio: 'ignore' });
  bg = 'data:image/jpeg;base64,' + readFileSync(small).toString('base64');
}
mkdirSync('src/data', { recursive: true });
const js = `// hdri_${name}.js: written by tools/hdri.mjs from Poly Haven's "${id}" (CC0, polyhaven.com/a/${id}); don't edit.\n` +
  `// light: ${w} × ${h} RGBE, deflated, base64; bg: the tonemapped sky as a JPEG data URI (or empty).\n` +
  `(window.HDRI3 = window.HDRI3 || {})[${JSON.stringify(name)}] = { w: ${w}, h: ${h}, light: "${light}", bg: "${bg}" };\n`;
writeFileSync(`src/data/hdri_${name}.js`, js);
console.log(`src/data/hdri_${name}.js  ${w}×${h}  ${(js.length / 1e6).toFixed(2)} MB`);
