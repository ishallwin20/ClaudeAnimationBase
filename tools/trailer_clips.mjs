// trailer_clips.mjs: the Ramayan trailer's picture, re-rendered from each part's own branch with its captions switched
// off. For each part it checks the branch out as a worktree in out/trailer/wt/<branch> (node_modules linked in), writes
// a copy of its studio.html with caption() made a no-op, and renders each clip with render.mjs --clip --range (no audio)
// to out/trailer/clips/<nn>.mp4. Clips that already exist are kept (delete one to redo it).
//   node tools/trailer_clips.mjs [--only=05,06] [--sheet]   (--sheet: contact sheets of each clip instead, to check)
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync, symlinkSync } from 'node:fs';
import { resolve } from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
// [id, branch, from, to] in each part's own seconds; the trailer plays them in this order (STORYBOARD.md)
export const CLIPS = [
  ['01', 'ad/33-ramayan-p1-first-poem', 27.8, 31.4],     // Valmiki's verse rises in golden padas
  ['02', 'ad/34-ramayan-p2-two-boons', 52.2, 55.0],      // Ram, calm, hands joined: "I will go"
  ['03', 'ad/35-ramayan-p3-kings-curse', 7.2, 9.6],      // the chariot leaves Ayodhya
  ['04', 'ad/38-ramayan-p6-golden-deer', 27.4, 29.8],    // the golden deer's wink
  ['05', 'ad/39-ramayan-p7-sita-taken', 12.4, 15.2],     // ten heads with heart eyes
  ['06', 'ad/39-ramayan-p7-sita-taken', 19.6, 22.0],     // the chariot rises with Sita
  ['07', 'ad/39-ramayan-p7-sita-taken', 54.8, 56.6],     // Hanuman, glowing, with the bundle
  ['08', 'ad/44-ramayan-p9-hanuman-leap', 11.4, 13.2],   // he leaps off Mahendra
  ['09', 'ad/44-ramayan-p9-hanuman-leap', 29.6, 31.6],   // thumb-sized, in and out of Surasa's mouth
  ['10', 'ad/45-ramayan-p10-lanka-burns', 46.0, 48.8],   // roof to roof, Lanka burning
  ['11', 'ad/36-ramayan-p4-crow-grass', 24.0, 25.8],     // the blade of grass becomes the Brahmastra
  ['12', 'ad/37-ramayan-p5-14000', 40.0, 41.8],          // arrows like rain on the horde
  ['13', 'ad/40-ramayan-p8-vali-tree', 36.0, 37.6],      // the arrow from behind the tree
  ['14', 'ad/46-ramayan-p11-ram-vs-ocean', 43.0, 45.8],  // the army marches across the bridge
  ['15', 'ad/47-ramayan-p12-last-arrow', .2, 3.2],       // a head cut off grows back (Part 12's hook)
  ['16', 'ad/47-ramayan-p12-last-arrow', 30.2, 34.0],    // the Brahmastra strikes; Ravana falls
];
if (process.argv[1] && process.argv[1].endsWith('trailer_clips.mjs')) {
  const root = process.cwd(), only = args.only ? String(args.only).split(',') : null;
  mkdirSync('out/trailer/clips', { recursive: true }); mkdirSync('out/trailer/wt', { recursive: true }); mkdirSync('out/trailer/check', { recursive: true });
  for (const [id, br, a, b] of CLIPS) {
    if (only && !only.includes(id)) continue;
    const wt = resolve(`out/trailer/wt/${br.replace(/\//g, '_')}`);
    if (!existsSync(wt)) { execFileSync('git', ['worktree', 'add', '--detach', wt, br], { stdio: 'inherit' }); symlinkSync(resolve(root, 'node_modules'), `${wt}/node_modules`); }
    // the part's studio page with caption() switched off (scripts after core.js see the no-op)
    const page = readFileSync(`${wt}/studio.html`, 'utf8').replace('<script src="src/timeline.js"></script>', '<script src="src/timeline.js"></script>\n<script>caption = () => {};</script>');
    writeFileSync(`${wt}/trailer_nocap.html`, page);
    const out = resolve(`out/trailer/clips/${id}.mp4`);
    if (args.sheet) {
      const ts = [0, .25, .5, .75, 1].map(k => (a + (b - a) * k - (k === 1 ? .05 : 0)).toFixed(2)).join(',');
      execFileSync('node', ['render.mjs', '--page=trailer_nocap.html', `--sheet=${ts}`, '--cols=5', '--w=240', `--out=${resolve(`out/trailer/check/${id}.jpg`)}`], { cwd: wt, stdio: 'inherit' });
      continue;
    }
    if (existsSync(out)) { console.log('have', id); continue; }
    execFileSync('node', ['render.mjs', '--page=trailer_nocap.html', '--clip', `--range=${a}:${b}`, '--audio=none', `--out=${out}`], { cwd: wt, stdio: 'inherit' });
  }
}
