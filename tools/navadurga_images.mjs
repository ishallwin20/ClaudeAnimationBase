// navadurga_images.mjs: the owner's nine Navadurga paintings as data URIs in src/scenes/navadurga_images.js (PICS.nd1 …
// PICS.nd9, Navadurga order). Data URIs keep the canvas untainted, so the bloom works in studio.html opened from disk.
//   node tools/navadurga_images.mjs
// Source: assets/durga-maa-all-avatars/1.png … 9.png (1632×2912, kept out of git); the 1080-wide copies land in
// assets/navadurga/ and are used when the sources aren't on this machine.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';

mkdirSync('assets/navadurga', { recursive: true });
const names = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => {
  const src = `assets/durga-maa-all-avatars/${i}.png`, out = `assets/navadurga/nd${i}.jpg`;
  if (existsSync(src)) execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', src, '-vf', 'scale=1080:-2:flags=lanczos', '-q:v', '4', out]);
  else if (!existsSync(out)) throw new Error('no painting ' + i);
  return [`nd${i}`, `data:image/jpeg;base64,${readFileSync(out).toString('base64')}`];
});
const lines = names.map(([n, u]) => `PICS.${n} = Object.assign(new Image(), { src: '${u}' });`);
writeFileSync('src/scenes/navadurga_images.js', '// Made by tools/navadurga_images.mjs: the nine Navadurga paintings for picture(). Do not edit.\n' + lines.join('\n') + '\n');
console.log('wrote src/scenes/navadurga_images.js', lines.map(l => l.length));
