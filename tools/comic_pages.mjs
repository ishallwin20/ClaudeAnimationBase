// comic_pages.mjs: real pages of a Rishi Katha comic as data URIs for picture() (the comic-marketing reels: the Painted
// story stops and the comic's own pages take over). Pages come from the issue's IG export (1080 × 1350 JPEGs, lettered),
// small copies land in assets/<issue>/ and the data URIs in src/scenes/<issue>_pages.js as PICS.<issue>_pNN (and
// PICS.<issue>_pNN_blur, a blurred "locked" copy).
//   node tools/comic_pages.mjs ashwatthama 01,17,20,23,24 29          (pages, then blurred pages)
// Source: ../ClaudeAnimationBase-comic/out/comics/<issue>_out/ink/ig (the comic/1-ashwatthama worktree), else
// out/comics/<issue>_out/ink/ig, else the copies already in assets/<issue>/.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';

const [issue, pages = '', blurs = ''] = process.argv.slice(2);
if (!issue) throw new Error('usage: node tools/comic_pages.mjs <issue> <pages> [blurred pages]');
const SRC = [`../ClaudeAnimationBase-comic/out/comics/${issue}_out/ink/ig`, `out/comics/${issue}_out/ink/ig`].find(existsSync);
const DST = `assets/${issue}`; mkdirSync(DST, { recursive: true });
const ff = a => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...a]);
const list = s => s.split(',').filter(Boolean).map(n => n.padStart(2, '0'));
const lines = [];
for (const [n, blur] of [...list(pages).map(n => [n, 0]), ...list(blurs).map(n => [n, 1])]) {
  const out = `${DST}/p${n}${blur ? '_blur' : ''}.jpg`, src = SRC && `${SRC}/p${n}.jpg`;
  if (src && existsSync(src)) ff(['-i', src, '-vf', blur ? 'scale=540:675,boxblur=14:2,scale=1080:1350' : 'scale=1080:1350', '-q:v', blur ? '6' : '4', out]);
  else if (!existsSync(out)) throw new Error('no page ' + n);
  lines.push(`PICS.${issue}_p${n}${blur ? '_blur' : ''} = Object.assign(new Image(), { src: 'data:image/jpeg;base64,${readFileSync(out).toString('base64')}' });`);
}
if (existsSync(`${DST}/lock.png`)) lines.push(`PICS.${issue}_lock = Object.assign(new Image(), { src: 'data:image/png;base64,${readFileSync(`${DST}/lock.png`).toString('base64')}' });`);   // the padlock for a locked page (drawn once by hand, kept in assets)
writeFileSync(`src/scenes/${issue}_pages.js`, `// Made by tools/comic_pages.mjs: pages of the ${issue} comic for picture(). Do not edit.\n` + lines.join('\n') + '\n');
console.log('wrote', `src/scenes/${issue}_pages.js`, lines.map(l => Math.round(l.length / 1024) + 'k').join(' '));
