// rk_images.mjs: the Rishi Katha brand images for the end card, as data URIs in src/scenes/rk_images.js (PICS.book1,
// PICS.book2, PICS.book3, PICS.logo). Data URIs keep the canvas untainted, so picture() works in studio.html opened
// from disk as well as in render.mjs.
//   node tools/rk_images.mjs
// Sources: the print wraps in assets/<n>-<slug>/Book<n>-Coverpage.png (5100×2550: back cover | front cover; the front
// is the right half) and the logo from the website repo next to this one. The small copies land in assets/rk/.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';

const SITE = '../rishikatha/public/images';
const BOOKS = [['book1', 'assets/1-shailputri/Book1-Coverpage.png', 'shailputri'], ['book2', 'assets/2-brahmacharini/Book2-Coverpage.png', 'brahmacharini'],
  ['book3', 'assets/3-chandraghanta/Book3-Coverpage.png', 'chandraghanta']];
mkdirSync('assets/rk', { recursive: true });
const ff = a => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...a]);
for (const [name, wrap, slug] of BOOKS) {
  const out = `assets/rk/${name}.jpg`;
  if (existsSync(wrap)) ff(['-i', wrap, '-vf', 'crop=iw/2:ih:iw/2:0,scale=800:800', '-q:v', '3', out]);
  else if (existsSync(`${SITE}/${slug}-web.jpg`)) ff(['-i', `${SITE}/${slug}-web.jpg`, '-vf', 'scale=800:800', '-q:v', '3', out]);
  else if (!existsSync(out)) throw new Error('no cover for ' + name);
}
if (existsSync(`${SITE}/logo-512.png`)) copyFileSync(`${SITE}/logo-512.png`, 'assets/rk/logo.png');
const uri = (f, mime) => `data:${mime};base64,${readFileSync(f).toString('base64')}`;
const lines = [...BOOKS.map(([n]) => [n, uri(`assets/rk/${n}.jpg`, 'image/jpeg')]), ['logo', uri('assets/rk/logo.png', 'image/png')]]
  .map(([n, u]) => `PICS.${n} = Object.assign(new Image(), { src: '${u}' });`);
writeFileSync('src/scenes/rk_images.js', '// Made by tools/rk_images.mjs: the brand images for picture(). Do not edit.\n' + lines.join('\n') + '\n');
console.log('wrote src/scenes/rk_images.js', lines.map(l => l.length));
