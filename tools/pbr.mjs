// pbr.mjs: fetch an ambientCG material (CC0, ambientcg.com) and pack it for the 3D style as src/data/pbr_<name>.js:
// its colour, normal (OpenGL), roughness, ambient-occlusion and height maps as JPEG data URIs (so studio.html still opens
// from file://). --res 1K (default) or 2K; --q JPEG quality for the re-encode (sips), 80.
//
//   node tools/pbr.mjs --id=Gravel041 --name=pebbles [--res=1K]
//
// In the page: <script src="src/data/pbr_pebbles.js"> after cine3d_fx.js, then pbr3('pebbles', { rep: [4, 4] }).
import { writeFileSync, mkdirSync, readFileSync, existsSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const id = args.id, name = args.name || id.toLowerCase(), res = args.res || '1K', q = args.q || 80;
if (!id) { console.error('usage: node tools/pbr.mjs --id=<ambientCG id> --name=<short name> [--res=1K]'); process.exit(1); }
const dir = `out/pbr_cache/${id}_${res}`; mkdirSync(dir, { recursive: true });
const zip = `${dir}.zip`;
if (!existsSync(zip)) {
  // curl: ambientCG's download redirect refuses some clients
  execFileSync('curl', ['-sfL', '-A', 'Mozilla/5.0', '-o', zip, `https://ambientcg.com/get?file=${id}_${res}-JPG.zip`]);
}
execFileSync('unzip', ['-o', '-q', zip, '-d', dir]);
const all = readdirSync(dir), pick = k => all.find(f => f.includes('_' + k) && f.endsWith('.jpg'));
const MAPS = { map: 'Color', normal: 'NormalGL', rough: 'Roughness', ao: 'AmbientOcclusion' };
const out = {};
for (const [k, suffix] of Object.entries(MAPS)) {
  const f = pick(suffix); if (!f) continue;
  const small = `${dir}/_${k}.jpg`;
  execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', String(q), `${dir}/${f}`, '--out', small], { stdio: 'ignore' });
  out[k] = 'data:image/jpeg;base64,' + readFileSync(small).toString('base64');
}
mkdirSync('src/data', { recursive: true });
const js = `// pbr_${name}.js: written by tools/pbr.mjs from ambientCG's ${id} (${res}, CC0, ambientcg.com/view?id=${id}); don't edit.\n` +
  `(window.PBR3DATA = window.PBR3DATA || {})[${JSON.stringify(name)}] = ${JSON.stringify(out)};\n`;
writeFileSync(`src/data/pbr_${name}.js`, js);
console.log(`src/data/pbr_${name}.js  ${Object.keys(out).join(', ')}  ${(js.length / 1e6).toFixed(2)} MB`);
