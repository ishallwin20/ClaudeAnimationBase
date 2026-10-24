// tools/wallpack.mjs: a wallpaper's six deliverables, in out/wallpapers2/<NN>-<slug>/:
//   wallpaper.png                        the still (1290×2796; Android crops it), the iPhone Live Photo's key frame
//   wallpaper_with_time.png              the same under the iPhone lock screen (tools/lockscreen.py)
//   live_wallpaper_ios.heic/.mov/.pvt    an iPhone Live Photo: 2 s at 30 fps, the motion in the first 1.5 s landing on
//                                        the still (the key frame, at 1.5 s), as batch 1's tested wall_shiva_wake: the
//                                        lock screen plays ~1.5 s on wake, and a 60 fps movie (frames doubled) stuttered.
//                                        Written by tools/livephoto.swift as the camera writes it (one content identifier
//                                        in both files, the live-photo-info and still-image-time tracks); the .pvt is the
//                                        AirDrop package (makelive)
//   live_wallpaper_ios_with_time.*       the same with the lock screen baked in (a preview)
//   live_wallpaper_android.mp4           the seamless 6 s loop played twice (12 s, under Samsung's 15 s cap), 1080×2400, 30 fps
//   live_wallpaper_android_with_time.mp4 the same under a One UI lock screen
// Usage: node tools/wallpack.mjs [--only=shiva,owl] [--ios] [--keep]     (--ios: only the iPhone files)      (MAKELIVE=<path> if makelive isn't on PATH)
import { spawnSync } from 'node:child_process';
import { mkdirSync, rmSync, existsSync, readdirSync, copyFileSync, linkSync } from 'node:fs';

// [folder, loop, [the iPhone clip's loop, the still's time in it]]: the clip runs from 1.5 s before the still to .5 s after
const WALLS = [
  ['01-shiva', 'wall_shiva', ['wall_shiva_wake', 1.5]],   // Vasuki pops up and flicks his tongue
  ['02-bappa-mooshak', 'wall_bappa', ['wall_bappa', 6]],
  ['03-owl', 'wall_owl', ['wall_owl', 4.1]],               // his head turns right round
  ['04-hanuman-sun', 'wall_hanuman', ['wall_hanuman', 6]],
  ['05-hanuman-sindoor', 'wall_sindoor', ['wall_sindoor', 6]],
  ['06-krishna-cow', 'wall_kanha_cow', ['wall_kanha_cow', 6]],
  ['07-krishna-makhan', 'wall_krishna', ['wall_krishna', 3.2]],   // a lick of butter
  ['08-lakshmi', 'wall_lakshmi', ['wall_lakshmi', 6]],
  ['09-narad', 'wall_narad', ['wall_narad', 6]],
  ['10-durga-sher', 'wall_durga', ['wall_durga', 6]],
];
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const only = args.only ? String(args.only).split(',') : null, FPS = 30, ROOT = 'out/wallpapers2', TMP = `${ROOT}/_work`;
const run = (cmd, a) => { const r = spawnSync(cmd, a, { stdio: ['ignore', 'ignore', 'inherit'] }); if (r.error || r.status) { console.error(`${cmd} ${a.slice(0, 3).join(' ')} failed`); process.exit(1); } };
const ff = a => run('ffmpeg', ['-y', '-loglevel', 'error', ...a]);
const pngs = d => readdirSync(d).filter(f => f.endsWith('.png')).sort().map(f => `${d}/${f}`);
const render = (loop, dir, range) => { rmSync(dir, { recursive: true, force: true });
  run('node', ['render.mjs', `--loop=${loop}`, '--png', `--fps=${FPS}`, `--out=${dir}`, ...(range ? [`--range=${range}`] : [])]); };

mkdirSync(TMP, { recursive: true });
const LP = `${TMP}/livephoto`, ML = process.env.MAKELIVE || 'makelive';
if (!existsSync(LP)) run('swiftc', ['-O', '-o', LP, 'tools/livephoto.swift']);
for (const k of ['ios', 'android']) if (!existsSync(`${TMP}/lock_${k}.png`)) run('python3', ['tools/lockscreen.py', k, `${TMP}/lock_${k}.png`]);
const h264 = ['-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-r', String(FPS)];
const android = 'scale=-2:2400:flags=lanczos,crop=1080:2400';

// a Live Photo: 60 frames at 30 fps, the key (the still) at 1.5 s
const KEY = 45;
function live(frames, still, base) {
  const dir = `${base}_f`; rmSync(dir, { recursive: true, force: true }); mkdirSync(dir);
  frames.forEach((f, i) => linkSync(f, `${dir}/f${String(i).padStart(4, '0')}.png`));
  run(LP, [`--frames=${dir}`, `--still=${still}`, `--key=${KEY}`, `--fps=${FPS}`, '--fadeIn=0', '--fadeOut=0', `--out=${base}`]);
  rmSync(dir, { recursive: true, force: true });
  const r = spawnSync(ML, ['--pvt', '--manual', `${base}.heic`, `${base}.mov`], { stdio: 'ignore' });
  if (r.error || r.status) console.warn('  makelive not run: no .pvt (set MAKELIVE)');
}

for (const [folder, loop, [wake, a]] of WALLS) {
  if (only && !only.some(o => folder.includes(o))) continue;
  const out = `${ROOT}/${folder}`, w = `${TMP}/${folder}`; mkdirSync(out, { recursive: true }); mkdirSync(w, { recursive: true });
  console.log(`${folder}: rendering`);
  for (const f of readdirSync(out)) if (f.startsWith('live_wallpaper_ios')) rmSync(`${out}/${f}`, { recursive: true, force: true });
  render(wake, `${w}/ios`, `${a - 1.5}:${a + .5}`);           // 60 frames, the still at index 45
  const ios = pngs(`${w}/ios`), still = ios[KEY];
  if (!args.ios) {
    copyFileSync(still, `${out}/wallpaper.png`);
    ff(['-i', still, '-i', `${TMP}/lock_ios.png`, '-filter_complex', 'overlay', `${out}/wallpaper_with_time.png`]);
  }
  live(ios, still, `${out}/live_wallpaper_ios`);
  const tdir = `${w}/ios_t`; rmSync(tdir, { recursive: true, force: true }); mkdirSync(tdir);
  ios.forEach((f, i) => ff(['-i', f, '-i', `${TMP}/lock_ios.png`, '-filter_complex', 'overlay', `${tdir}/f${String(i).padStart(4, '0')}.png`]));
  const T = pngs(tdir); live(T, T[KEY], `${out}/live_wallpaper_ios_with_time`);
  if (args.ios) { if (!args.keep) rmSync(w, { recursive: true, force: true }); console.log(`  → ${out}/`); continue; }
  render(loop, `${w}/loop`);                                   // 180 frames, t = i/30
  const L = pngs(`${w}/loop`);
  // Android: the loop twice
  const seq = ['-framerate', String(FPS), '-i', `${w}/loop/f%04d.png`];
  ff([...seq, '-vf', `${android},loop=loop=1:size=${L.length}`, ...h264, `${out}/live_wallpaper_android.mp4`]);
  ff([...seq, '-i', `${TMP}/lock_android.png`, '-filter_complex', `[0]${android}[b];[b][1]overlay,loop=loop=1:size=${L.length}`, ...h264, `${out}/live_wallpaper_android_with_time.mp4`]);
  if (!args.keep) rmSync(w, { recursive: true, force: true });
  console.log(`  → ${out}/`);
}
