// cutout.mjs: makes a generated image usable in the Matte style. A character painted on flat chroma green is keyed to
// a transparent PNG (ffmpeg chromakey + despill); a plate (a background, --key=none) is just scaled. Either way it is
// embedded as a data URI in a scene's images file (PICS.<name>), which keeps the canvas untainted under file:// so the
// rig can cut it into parts. Re-running with the same name replaces that entry.
//   node tools/cutout.mjs --in=assets/matte/kushmanda_a.png --name=kushmanda --js=src/matte_images.js
//        [--key=17DE3D | none] [--sim=.13] [--blend=.05] [--w=2000]
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
if (!args.in || !args.name || !args.js) { console.error('usage: node tools/cutout.mjs --in=<png> --name=<PICS name> --js=<images file> [--key=<hex>|none] [--w=<px>]'); process.exit(1); }
const out = args.in.replace(/(_\w)?\.(png|jpg)$/, '') + (args.key === 'none' ? '_plate.jpg' : '_cut.png');
const vf = [args.w ? `scale=${args.w}:-1:flags=lanczos` : null,
  args.key === 'none' ? null : `chromakey=0x${args.key || '17DE3D'}:${args.sim || .13}:${args.blend || .05},despill=type=green:mix=.6:expand=.2,format=rgba`].filter(Boolean).join(',');
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', args.in, ...(vf ? ['-vf', vf] : []), ...(args.key === 'none' ? ['-q:v', '3'] : []), out]);
const mime = out.endsWith('.png') ? 'image/png' : 'image/jpeg';
const line = `PICS.${args.name} = Object.assign(new Image(), { src: 'data:${mime};base64,${readFileSync(out).toString('base64')}' });`;
const head = '// Made by tools/cutout.mjs: the Matte cutouts and plates as data URIs. Do not edit.';
const keep = existsSync(args.js) ? readFileSync(args.js, 'utf8').split('\n').filter(l => l.startsWith('PICS.') && !l.startsWith(`PICS.${args.name} =`)) : [];
writeFileSync(args.js, [head, ...keep, line].join('\n') + '\n');
console.log(`wrote ${out} → PICS.${args.name} in ${args.js} (${(line.length / 1e6).toFixed(1)} MB)`);
