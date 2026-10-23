// tools/wallpaper.mjs: renders a wallpaper loop and makes the files a phone needs, in out/wallpapers/<name>/:
//   <name>_iphone.mp4       the seamless loop, 1290×2796 (H.264, for the website preview and video-wallpaper apps)
//   <name>_android.mp4      the loop at 1080×2400 (20:9), for Samsung's video lock screen (≤15 s) and wallpaper apps
//   <name>_live.jpg + .mov  an iPhone Live Photo (the still is frame 0; the motion is the first LIVE seconds), paired
//                           by makelive so Photos imports them as one Live Photo
//   <name>_iphone.png, <name>_android.png   the still (frame 0)
//   <name>_lock.mp4         (with --lock) the loop under a mock lock screen, to show it off
// Usage:
//   node tools/wallpaper.mjs --name=wall_bappa [--lock]                         a Painted loop (studio.html, LOOPS)
//   node tools/wallpaper.mjs --name=wall_shiva_cine --page=studio_wall_cine.html  a Cinematic one (its single shot)
// makelive: `uv tool install makelive` (or pip install makelive); set MAKELIVE=<path> if it isn't on PATH. Without it the
// Live Photo pair is written unpaired and the tool says so.
import { spawnSync } from 'node:child_process';
import { mkdirSync, rmSync, existsSync, readdirSync, copyFileSync } from 'node:fs';

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const name = args.name, page = args.page, LIVE = +(args.live || 3), FPS = 24;
if (!name) { console.error('usage: node tools/wallpaper.mjs --name=<loop> [--page=<html>] [--lock]'); process.exit(1); }
const out = `out/wallpapers/${name}`, frames = `${out}/frames`;
const run = (cmd, a) => { const r = spawnSync(cmd, a, { stdio: 'inherit' }); if (r.status) { console.error(`${cmd} failed`); process.exit(1); } };
const ff = (a) => run('ffmpeg', ['-y', '-loglevel', 'error', ...a]);
const render = (loop, dir) => {
  rmSync(dir, { recursive: true, force: true });
  // a Painted wallpaper is a LOOP; a Cinematic one is its page's whole timeline (one cycle: 0..duration)
  run('node', ['render.mjs', ...(page ? [`--page=${page}`, '--range=0:6'] : [`--loop=${loop}`]), '--png', `--out=${dir}`, ...(args.workers ? [`--workers=${args.workers}`] : [])]);
};

mkdirSync(out, { recursive: true });
render(name, frames);
const n = readdirSync(frames).filter(f => f.endsWith('.png')).length;
console.log(`${n} frames (${(n / FPS).toFixed(2)} s)`);
const seq = ['-framerate', String(FPS), '-i', `${frames}/f%04d.png`];
const h264 = ['-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-pix_fmt', 'yuv420p', '-movflags', '+faststart'];
const android = 'scale=-2:2400:flags=lanczos,crop=1080:2400';

ff([...seq, ...h264, `${out}/${name}_iphone.mp4`]);
ff([...seq, '-vf', android, ...h264, `${out}/${name}_android.mp4`]);
copyFileSync(`${frames}/f0000.png`, `${out}/${name}_iphone.png`);
ff(['-i', `${frames}/f0000.png`, '-vf', android, `${out}/${name}_android.png`]);
// the Live Photo: a JPEG still and a MOV of the first LIVE seconds (iOS plays it once on wake, then holds the still)
ff(['-i', `${frames}/f0000.png`, '-q:v', '2', `${out}/${name}_live.jpg`]);
ff([...seq, '-frames:v', String(LIVE * FPS), '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-tag:v', 'avc1', `${out}/${name}_live.mov`]);
const ml = process.env.MAKELIVE || 'makelive';
const r = spawnSync(ml, ['--manual', `${out}/${name}_live.jpg`, `${out}/${name}_live.mov`], { stdio: 'inherit' });
if (r.error || r.status) console.warn('makelive not run: the Live Photo pair is unpaired (uv tool install makelive, or set MAKELIVE)');

if (args.lock && !page) {
  render(name + '_lock', `${out}/frames_lock`);
  ff(['-framerate', String(FPS), '-i', `${out}/frames_lock/f%04d.png`, ...h264, `${out}/${name}_lock.mp4`]);
  rmSync(`${out}/frames_lock`, { recursive: true, force: true });
}
rmSync(frames, { recursive: true, force: true });
console.log(`→ ${out}/`);
