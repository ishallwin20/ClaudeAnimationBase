// addicted_art.mjs: the two Book 1 spreads the boy reads in ad 7, as data URIs in src/scenes/addicted_art.js
// (PICS.spread1: Menavati praying by the Ganga, the page ad-maker's shot 4 opens on; PICS.spread2: Narada's visit).
//   node tools/addicted_art.mjs
// Source: assets/1-shailputri/sample_spread_<n>.png (5100×2550, git-ignored); the working copies land in assets/rk/.
// spread1 is kept large (4400 px) because the camera dives into its right page until it fills the frame.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const SPREADS = [['spread1', 4400, 3], ['spread2', 1800, 4]];
for (const [name, w, q] of SPREADS) {
  const src = `assets/1-shailputri/sample_${name.replace('spread', 'spread_')}.png`, out = `assets/rk/${name}.jpg`;
  if (existsSync(src)) execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', src, '-vf', `scale=${w}:${w / 2}:flags=lanczos`, '-q:v', String(q), out]);
  else if (!existsSync(out)) throw new Error('no source for ' + name);
}
const lines = SPREADS.map(([n]) => `PICS.${n} = Object.assign(new Image(), { src: 'data:image/jpeg;base64,${readFileSync(`assets/rk/${n}.jpg`).toString('base64')}' });`);
writeFileSync('src/scenes/addicted_art.js', '// Made by tools/addicted_art.mjs: the Book 1 spreads for ad 7. Do not edit.\n' + lines.join('\n') + '\n');
console.log('wrote src/scenes/addicted_art.js', lines.map(l => l.length));
