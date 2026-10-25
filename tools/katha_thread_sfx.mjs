// katha_thread_sfx.mjs: the sound for "The gold thread" (src/scenes/katha_thread.js), under the Lyria score. Soft and
// sparse, so the score carries it: a low warm drone; a glass chime as each thread is born; a pentatonic plink as each
// story's spark lands on the listener's thread (a little brighter for the grandkid's); a slow rising shimmer as each
// light goes up into the sky; Me's light: the sound stops for half a second, then a deep soft swell and a long shimmer;
// the constellation lines chime in turn; the card's chimes.
// Times come from the same TL and age curve as the scene (AGEK copied from it).
//   node tools/katha_thread_sfx.mjs   → assets/katha_thread_sfx.wav and assets/katha_thread_mix.wav
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { track, tone, noise, mixb, shimmer, env, note, seed, rnd, drone, chime, bell, drum } from './sfx.mjs';

const TL = { hook: 0, born: 3.6, nani: 6.5, names: 9.4, dadu: 13.8, naniEnd: 20.4, stay: 23.1, partner: 28.4, little: 32.7,
  tell: 35.5, back: 40.2, fast: 42.5, grand: 46.8, me: 56.0, leave: 57.6, ask: 60.6, card: 64.0, end: 70 };
const AGEK = [[0, -3], [3, 0], [6.5, 3], [12, 8.2], [15.5, 10], [20.5, 15], [25.5, 19], [30, 26], [32.5, 30], [38.5, 36],
  [42, 48], [44.5, 58], [46, 61], [50, 68], [53, 80], [56, 84], [60, 86], [70, 90]];
const ageLin = t => { if (t <= AGEK[0][0]) return AGEK[0][1]; for (let i = 1; i < AGEK.length; i++) if (t < AGEK[i][0]) { const [a, va] = AGEK[i - 1], [b, vb] = AGEK[i]; return va + (vb - va) * (t - a) / (b - a); } return AGEK[AGEK.length - 1][1]; };
const AGE = t => { let s = 0; for (let i = -4; i <= 4; i++) s += ageLin(t + i * .14); return s / 9; };
const tOf = a => { let lo = 0, hi = 70; for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; AGE(m) < a ? lo = m : hi = m; } return (lo + hi) / 2; };

const T = track(TL.end);
seed(52);
const pent = [0, 2, 4, 7, 9, 12, 14];
const glass = (m, amp = 1) => bell(note(m), 2.6, { partials: [[1, 1], [2, .35], [3.01, .12], [4.2, .05]], k: 1.6, amp });
const rise = (dur, amp = 1) => mixb(noise(dur, { hp: 1800, lp: t => 3000 + 5000 * t / dur, e: env.swell(dur * .7, .3), amp: amp * .5 }),
  shimmer(dur, [0, 4, 7, 12, 16].map(i => note(79 + i)), amp * .7, dur / 6));

// the bed: a low warm drone, out under the hush and Me's half-second of silence
T.at(0, drone(TL.me - .7, 65.4, 1), .05);
T.at(TL.me, drone(TL.end - TL.me, 65.4, 1), .05);

// births: a glass chime
for (const [a, m] of [[0, 84], [30, 86], [60, 88]]) T.at(tOf(a) + .05, glass(m), .16);
T.at(tOf(22) + .9, glass(81, .8), .1, -.3);   // the partner arrives

// the stories: a plink as each spark lands (the arc takes ~.7 of a year to draw)
const ST = [[3.3, 0], [4.3, 1], [5.3, 2], [6.3, 3], [7.3, 4], [32.6, 2], [33.4, 3], [34.2, 4], [35, 5], [35.8, 6],
  [63.2, 3], [64.6, 4], [66, 5], [67.4, 6], [85, 2], [86, 3], [87, 4]];
for (const [a, i] of ST) {
  const t = tOf(a + .5);
  T.at(t, chime(note(84 + pent[i]), 1, 2), .1, rnd() * .6 - .3);
  T.at(t + .12, chime(note(96 + pent[i % 5]), .5, 1.2), .04);
}

// the lights rising (Dadu, Nani, Papa, Mummy, Bestie, the partner)
for (const a of [9, 15, 54, 58, 74, 81]) T.at(tOf(a), rise(2.2), .14, rnd() * .6 - .3);
// Me: half a second of silence (the drone and the score drop out), then the swell
const tMe = tOf(84);
T.at(tMe, mixb(drum(44, .6, 2.4), noise(2, { brown: true, lp: 260, e: env.swell(.05, 1.6), amp: .9 })), .3);
T.at(tMe + .05, rise(3.2, 1.2), .24);
T.at(tMe + .2, glass(76, 1), .2);

// the constellation lines (8 links, .32 s apart, from 2 s after Me's light)
for (let i = 0; i < 8; i++) T.at(tMe + 2 + i * .32 + .4, chime(note(81 + pent[i % 7]), .8, 1.6), .07, (i % 2 ? .3 : -.3));

// the card
T.at(TL.card + .2, chime(note(84), 1, 3), .18, -.2); T.at(TL.card + .45, chime(note(88), 1, 3), .16, .2); T.at(TL.card + 1.6, chime(note(91), 1, 3), .14);

T.write('assets/katha_thread_sfx.wav');

// ---------- the score under it: full, dropped out for the half-second of silence before Me's light, back in with it over a second ----------
const SCORE = process.env.SCORE || 'assets/katha_thread_score.mp3';   // Lyria take 2 of 3 (quiet 23–26 and 40–51, its swell from 52, gone by 70)
if (existsSync(SCORE)) {
  const d0 = tMe - .7, d1 = tMe;
  const lv = `if(lt(t,${d0}),1,if(lt(t,${d0 + .12}),1-(t-${d0})/0.12,if(lt(t,${d1}),0,if(lt(t,${d1 + 1.0}),(t-${d1})/1.0,1))))`;
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', SCORE, '-i', 'assets/katha_thread_sfx.wav', '-filter_complex', [
    `[0:a]aresample=48000,atrim=0:${TL.end},asetpts=PTS-STARTPTS,volume='${lv}':eval=frame,afade=t=out:st=${TL.end - 2.5}:d=2.5,volume=0.75[m]`,
    '[1:a]volume=1.2[s]', '[m][s]amix=inputs=2:duration=longest:normalize=0,loudnorm=I=-15:TP=-1.5:LRA=12,aresample=48000[o]'].join(';'),
    '-map', '[o]', '-t', String(TL.end), '-ar', '48000', '-ac', '2', 'assets/katha_thread_mix.wav'], { stdio: 'inherit' });
  console.log('wrote assets/katha_thread_mix.wav');
}
