// pushpak_clips.mjs: the memories in "The whole Ramayan in one flight" (ad 64): moments of the Ramayan series, re-rendered
// from each part's own branch with its captions switched off (as tools/trailer_clips.mjs does for the trailer), then cut
// to square JPEG frames the scene draws inside its memory bubbles (src/scenes/pushpak_mem.js lists them for the page).
// For each clip it checks the branch out as a worktree in out/pushpak/wt/<branch> (node_modules linked in), writes a
// copy of its studio.html with caption() a no-op, renders out/pushpak/clips/<id>.mp4 (no audio), and cuts the crop
// [x, y, side] to out/pushpak/mem/<id>/f0001.jpg … at 24 fps, 600 px. Clips that already exist are kept.
//   node tools/pushpak_clips.mjs [--only=lanka,setu] [--sheet]   (--sheet: contact sheets of each range, to pick crops)
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync, symlinkSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
// [id, part, branch, from, to (the part's own seconds), crop [x, y, side] in its 1080×1920 frame]
export const MEMS = [
  ['lanka', 12, 'ad/47-ramayan-p12-last-arrow', 39.3, 42.6, [0, 580, 1080]],      // the Brahmastra strikes; Ravana falls
  ['setu', 11, 'ad/46-ramayan-p11-ram-vs-ocean', 39.6, 43.0, [0, 560, 1080]],     // the monkeys build the bridge
  ['mainaka', 9, 'ad/44-ramayan-p9-hanuman-leap', 15.5, 18.9, [0, 520, 1080]],    // the smiling golden mountain: "Rest on me!"
  ['vali', 8, 'ad/40-ramayan-p8-vali-tree', 35.4, 38.2, [0, 560, 1080]],          // the arrow from behind the tree
  ['sugriva', 8, 'ad/40-ramayan-p8-vali-tree', 14.0, 18.6, [0, 520, 1080]],       // Sugriva shows the bundle; Ram weeps
  ['jatayu', 7, 'ad/39-ramayan-p7-sita-taken', 27.6, 31.4, [0, 420, 1080]],       // Jatayu flies at the chariot and falls
  ['khara', 5, 'ad/37-ramayan-p5-14000', 39.6, 42.4, [0, 520, 1080]],             // arrows like rain on Khara's army
  ['taken', 7, 'ad/39-ramayan-p7-sita-taken', 18.6, 22.0, [0, 300, 1080]],        // he grabs her; the chariot rises
  ['ayodhya', 3, 'ad/35-ramayan-p3-kings-curse', 6.8, 10.6, [0, 400, 1080]],      // the chariot leaves Ayodhya, 14 years before
];
if (process.argv[1] && process.argv[1].endsWith('pushpak_clips.mjs')) {
  const root = process.cwd(), only = args.only ? String(args.only).split(',') : null;
  for (const d of ['out/pushpak/clips', 'out/pushpak/wt', 'out/pushpak/check', 'out/pushpak/mem']) mkdirSync(d, { recursive: true });
  for (const [id, , br, a, b, [cx, cy, cs]] of MEMS) {
    if (only && !only.includes(id)) continue;
    const wt = resolve(`out/pushpak/wt/${br.replace(/\//g, '_')}`);
    if (!existsSync(wt)) { execFileSync('git', ['worktree', 'add', '--detach', wt, br], { stdio: 'inherit' }); symlinkSync(resolve(root, 'node_modules'), `${wt}/node_modules`); }
    // the part's studio page with caption() switched off (scripts after core.js see the no-op)
    const page = readFileSync(`${wt}/studio.html`, 'utf8').replace('<script src="src/timeline.js"></script>', '<script src="src/timeline.js"></script>\n<script>caption = () => {};</script>');
    writeFileSync(`${wt}/pushpak_nocap.html`, page);
    if (args.sheet) {
      const ts = [0, .25, .5, .75, 1].map(k => (a + (b - a) * k - (k === 1 ? .05 : 0)).toFixed(2)).join(',');
      execFileSync('node', ['render.mjs', '--page=pushpak_nocap.html', `--sheet=${ts}`, '--cols=5', '--w=300', `--out=${resolve(`out/pushpak/check/${id}.jpg`)}`], { cwd: wt, stdio: 'inherit' });
      continue;
    }
    const out = resolve(`out/pushpak/clips/${id}.mp4`), dir = resolve(`out/pushpak/mem/${id}`);
    if (!existsSync(out)) execFileSync('node', ['render.mjs', '--page=pushpak_nocap.html', '--clip', `--range=${a}:${b}`, '--audio=none', `--out=${out}`], { cwd: wt, stdio: 'inherit' });
    mkdirSync(dir, { recursive: true });
    for (const f of readdirSync(dir)) if (f.endsWith('.jpg')) execFileSync('rm', [`${dir}/${f}`]);
    execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', out, '-vf', `crop=${cs}:${cs}:${cx}:${cy},scale=600:600`, '-q:v', '3', `${dir}/f%04d.jpg`], { stdio: 'inherit' });
    console.log(id, readdirSync(dir).length, 'frames');
  }
  // the list the page loads: { id: frame count }
  const n = Object.fromEntries(MEMS.filter(m => existsSync(`out/pushpak/mem/${m[0]}`)).map(m => [m[0], readdirSync(`out/pushpak/mem/${m[0]}`).filter(f => f.endsWith('.jpg')).length]));
  if (!args.sheet) writeFileSync('src/scenes/pushpak_mem.js', `// pushpak_mem.js: written by tools/pushpak_clips.mjs; don't edit. The memories' frame counts (out/pushpak/mem/<id>/f0001.jpg …).\nconst MEM_N = ${JSON.stringify(n)};\n`);
}
