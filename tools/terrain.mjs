// terrain.mjs: real ground heights for the 3D style's maps. Fetches open elevation tiles (Mapzen/AWS "terrarium": land
// from SRTM and others, the sea floor from GEBCO/ETOPO; heights in metres, below sea level negative), stitches them,
// reprojects them to a plain lon/lat grid and writes src/data/<name>_dem.js: DEM_DATA.<name> = { lon0, lat0, lon1,
// lat1, w, h, png } (png: a data URI, the height in R·256 + G as (m + 12000) · 2; decode with cine3d_india.js's dem3()).
//   node tools/terrain.mjs --name=india --bbox=60,0,100,40 --z=6 --res=.025       (India and its neighbours)
//   node tools/terrain.mjs --name=palk --bbox=78.9,8.7,80.15,9.55 --z=11 --res=.001  (the Palk Strait, Adam's Bridge)
// Tiles are cached in out/dem_tiles/<z>/. Data: https://registry.opendata.aws/terrain-tiles/ (attribution in 3D_GUIDE.md).
import { mkdirSync, existsSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const [lon0, lat0, lon1, lat1] = String(args.bbox).split(',').map(Number), z = +args.z, res = +args.res, name = args.name;
if (!name || !(lon1 > lon0) || !(lat1 > lat0) || !z || !res) { console.error('usage: --name=india --bbox=lon0,lat0,lon1,lat1 --z=6 --res=.025'); process.exit(1); }
const N = 2 ** z, T = 256;
const gx = lon => (lon + 180) / 360 * N * T;
const gy = lat => { const r = lat * Math.PI / 180; return (1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2 * N * T; };
const tx0 = Math.floor(gx(lon0) / T), tx1 = Math.floor(gx(lon1) / T), ty0 = Math.floor(gy(lat1) / T), ty1 = Math.floor(gy(lat0) / T);
const dir = `out/dem_tiles/${z}`; mkdirSync(dir, { recursive: true });

// fetch and decode the tiles (ffmpeg turns each PNG into raw RGB)
const tiles = new Map();
for (let x = tx0; x <= tx1; x++) for (let y = ty0; y <= ty1; y++) {
  const f = `${dir}/${x}-${y}.png`;
  if (!existsSync(f)) {
    const r = await fetch(`https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${z}/${x}/${y}.png`);
    if (!r.ok) throw new Error(`tile ${z}/${x}/${y}: ${r.status}`);
    writeFileSync(f, Buffer.from(await r.arrayBuffer()));
  }
  const raw = execFileSync('ffmpeg', ['-v', 'error', '-i', f, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], { maxBuffer: 1 << 24 });
  const e = new Float32Array(T * T); for (let i = 0; i < T * T; i++) e[i] = raw[i * 3] * 256 + raw[i * 3 + 1] + raw[i * 3 + 2] / 256 - 32768;
  tiles.set(`${x},${y}`, e);
}
console.log(`${tiles.size} tiles at z${z}`);
const at = (X, Y) => { const x = Math.floor(X / T), y = Math.floor(Y / T), t = tiles.get(`${x},${y}`); return t ? t[(Y - y * T) * T + (X - x * T)] : 0; };
const sample = (X, Y) => {
  X -= .5; Y -= .5; const x = Math.floor(X), y = Math.floor(Y), fx = X - x, fy = Y - y;
  return (at(x, y) * (1 - fx) + at(x + 1, y) * fx) * (1 - fy) + (at(x, y + 1) * (1 - fx) + at(x + 1, y + 1) * fx) * fy;
};

// the lon/lat grid
const w = Math.round((lon1 - lon0) / res), h = Math.round((lat1 - lat0) / res), out = Buffer.alloc(w * h * 3);
let lo = 1e9, hi = -1e9;
for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
  const lon = lon0 + (i + .5) * res, lat = lat1 - (j + .5) * res, e = sample(gx(lon), gy(lat));
  lo = Math.min(lo, e); hi = Math.max(hi, e);
  const v = Math.max(0, Math.min(65535, Math.round((e + 12000) * 2))), k = (j * w + i) * 3;
  out[k] = v >> 8; out[k + 1] = v & 255; out[k + 2] = 0;
}
const png = execFileSync('ffmpeg', ['-v', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', `${w}x${h}`, '-i', '-', '-frames:v', '1', '-f', 'image2', '-c:v', 'png', '-compression_level', '9', '-'], { input: out, maxBuffer: 1 << 28 });
mkdirSync('src/data', { recursive: true });
writeFileSync(`src/data/${name}_dem.js`, `// ${name}_dem.js: written by tools/terrain.mjs (--name=${name} --bbox=${args.bbox} --z=${z} --res=${res}); don't edit.\n` +
  `// Heights in metres from open terrain tiles (SRTM, GEBCO, ETOPO via registry.opendata.aws/terrain-tiles), on a lon/lat grid.\n` +
  `var DEM_DATA = window.DEM_DATA || (window.DEM_DATA = {});\n` +
  `DEM_DATA.${name} = ${JSON.stringify({ lon0, lat0, lon1, lat1, w, h })};\nDEM_DATA.${name}.png = 'data:image/png;base64,${png.toString('base64')}';\n`);
console.log(`src/data/${name}_dem.js: ${w}×${h}, ${lo.toFixed(0)}…${hi.toFixed(0)} m, ${(png.length / 1e6).toFixed(1)} MB`);
