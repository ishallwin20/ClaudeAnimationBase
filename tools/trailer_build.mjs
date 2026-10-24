// trailer_build.mjs: puts the Ramayan trailer together (48.0 s) → out/trailer_out/trailer.mp4.
//   1. the SFX: a whoosh into every cut, drum booms on the montage's three punch words, a riser into the last arrow's
//      stop, the big hit at 39.6, a conch and a shimmer as RAMAYAN pops, pops for the card (tools/sfx.mjs)
//   2. the score: Lyria's take (assets/trailer_score.mp3, 82.8 s) cut to fit: 0–39.7 as it is (it builds and stops on
//      its own at ~39.5), then its resolution from 43.3 on the card's hit at 40.2, crossfading at 43.0 into its final
//      held chord (76.5–81.5) so it ends at 48.0
//   3. the picture: the sixteen clips (tools/trailer_clips.mjs) and the end card (src/scenes/trailer.js), cut end to
//      end, the captions (tools/trailer_caps.mjs) over them
//   4. the mix: the voice in front, the score ducked under it (sidechaincompress), the SFX, loudnorm to -14 LUFS
//   node tools/trailer_build.mjs   (after: node render.mjs --clip --audio=none --out=out/trailer/card.mp4)
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { track, whoosh, drum, thunder, conch, shimmer, note, chime, slide, noise, env, mixb, click, tone, seed } from './sfx.mjs';
import { CLIPS } from './trailer_clips.mjs';

const ff = a => execFileSync('ffmpeg', ['-y', '-v', 'error', ...a], { stdio: 'inherit' });
const END = 48.0, CARD = 39.6, HIT = 40.2, WATCH = 43.6;
mkdirSync('out/trailer_out', { recursive: true });
// the cuts, from the clips' lengths
const cuts = []; let at = 0;
for (const [, , a, b] of CLIPS) { cuts.push(at); at += b - a; }
console.log('clips end at', at.toFixed(2), '(the card starts at', CARD + ')');

// ---- 1. the SFX
seed(48);
const T = track(END);
const pop = (amp = 1, f = 1) => mixb(click(amp), tone(.07, t => f * (500 + 2600 * t / .07), { e: env.pluck(40), amp: amp * .7 }));
cuts.slice(1).forEach((c, i) => T.at(c - .22, whoosh(.32, 700, 3200, .7), .07, (i % 2 ? .3 : -.3)));
for (const c of [24.8, 26.6, 28.4]) { T.at(c, mixb(drum(44, 1, 1), thunder(.8, .3)), .16, 0); T.at(c + .05, whoosh(.25, 2000, 6000, .5), .05, 0); }
T.at(35.8, slide(3.6, 200, 1600, .5), .06, 0);                                   // a riser into the stop
T.at(35.8, noise(3.7, { lp: t => 600 + 5000 * t / 3.7, hp: 200, e: env.swell(3.2, .05), amp: .6 }), .05, 0);
T.at(CARD, mixb(drum(36, 1, 2), thunder(2, .6)), .2, 0);                         // the big hit, with the white flash
T.at(HIT, conch(1.8, 311, .8), .12, 0);
T.at(HIT + .05, shimmer(1.6, [note(86), note(90), note(93), note(98), note(102)], .5, .08), .07, 0);
T.at(HIT + .9, pop(.9), .16, 0); T.at(HIT + 1.3, pop(.9, 1.2), .18, 0);          // THE COMPLETE SERIES, 12 PARTS
T.at(WATCH, pop(1, 1.3), .2, 0); T.at(WATCH + .3, chime(note(93), .6, 1.6), .07, 0);
T.write('out/trailer/sfx.wav');

// ---- 2. the score, cut to 48 s
ff(['-i', 'assets/trailer_score.mp3', '-filter_complex',
  '[0:a]asplit=3[s0][s1][s2];[s0]atrim=0:39.7,asetpts=PTS-STARTPTS,afade=t=out:st=39.55:d=0.15[a];' +
  '[s1]atrim=43.3:46.5,asetpts=PTS-STARTPTS,afade=t=in:d=0.05,afade=t=out:st=1.3:d=1.5,adelay=40200|40200[b];' +
  '[s2]atrim=74:79,asetpts=PTS-STARTPTS,afade=t=in:d=1.5,afade=t=out:st=3.2:d=1.8,adelay=43000|43000[c];' +
  '[a][b][c]amix=inputs=3:normalize=0,atrim=0:48,aresample=48000[s]', '-map', '[s]', '-ac', '2', 'out/trailer/score.wav']);

// ---- 3. the picture: clips + card, then the captions over them
const ins = [...CLIPS.map(([id]) => ['-i', `out/trailer/clips/${id}.mp4`]).flat(), '-i', 'out/trailer/card.mp4'];
const n = CLIPS.length + 1;
const norm = Array.from({ length: n }, (_, i) => `[${i}:v]fps=24,scale=1080:1920,setsar=1,format=yuv420p[v${i}]`).join(';');
ff([...ins, '-framerate', '24', '-i', 'out/trailer/caps/%04d.png', '-filter_complex',
  `${norm};${Array.from({ length: n }, (_, i) => `[v${i}]`).join('')}concat=n=${n}:v=1:a=0[cat];[cat][${n}:v]overlay=0:0:format=auto,trim=0:${END},format=yuv420p[out]`,
  '-map', '[out]', '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-r', '24', 'out/trailer/video.mp4']);

// ---- 4. the mix: voice, ducked score, SFX → -14 LUFS, muxed
ff(['-i', 'assets/trailer_vo.wav', '-i', 'out/trailer/score.wav', '-i', 'out/trailer/sfx.wav', '-i', 'out/trailer/video.mp4', '-filter_complex',
  '[0:a]aresample=48000,pan=stereo|c0=c0|c1=c0,volume=1.0,asplit=2[vo][key];' +
  '[1:a]volume=0.4[sc];[sc][key]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=350[duck];' +
  '[2:a]volume=0.85[fx];[vo][duck][fx]amix=inputs=3:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11,atrim=0:48[mix]',
  '-map', '3:v', '-map', '[mix]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-shortest', 'out/trailer_out/trailer.mp4']);
console.log('wrote out/trailer_out/trailer.mp4');
