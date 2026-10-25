// kanha_puzzle_sfx.mjs: the sound bed of "How many KRISHNAS?" (kanha_puzzle.js), an 8 s loop. Everything wraps round
// the loop point (a sound that runs past 8 s comes back in at 0 s), so the reel loops on Instagram without a seam.
// Times match the scene: the laddoo toss at .3 s of every 4 s, caught at 1.5; Kanha's morsel at .6; the calf's frisk
// lands at 1.2 s; Brahma rises and sinks once a loop. A trending sound goes on top in Instagram.
//   node tools/kanha_puzzle_sfx.mjs   → assets/kanha_puzzle_sfx.wav
import { track, noise, tone, bell, squeak, whoosh, plink, note, env, seed, rnd, SR } from './sfx.mjs';

const LOOP = 8;
const T = track(LOOP);
const N = T.L.length;
// place a sound at t0, wrapping its tail round to the start
function at(t0, b, gain = 1, pan = 0) {
  const s0 = Math.round(t0 * SR), gl = gain * Math.cos((pan + 1) * Math.PI / 4), gr = gain * Math.sin((pan + 1) * Math.PI / 4);
  for (let i = 0; i < b.length; i++) { const j = (s0 + i) % N; T.L[j] += b[i] * gl * 1.41; T.R[j] += b[i] * gr * 1.41; }
}

// the Yamuna: two decorrelated babbling noise beds, 8.6 s each, crossfading over the wrap
seed(7);
for (const [ph, pan] of [[0, -.5], [2.1, .5]]) {
  const river = noise(LOOP + .6, { lp: t => 900 + 350 * Math.sin(t * Math.PI / 2 + ph) + 200 * Math.sin(t * 5.3 + ph), hp: 220, e: env.swell(.3, .3) });
  at(LOOP - .3, river, .16, pan);
}
// little water plops near the bank
for (const [t, f, p] of [[1.9, 900, -.2], [3.7, 760, .3], [6.6, 840, .1]]) at(t, tone(.12, x => f * (1 + x * 6), { e: env.pluck(35) }), .12, p);

// birds in the kadamb (left) and over Govardhan (right)
for (const [t, p] of [[.8, -.7], [.94, -.7], [1.05, -.7], [3.3, .5], [5.6, -.6], [5.72, -.6], [7.1, .6], [7.2, .6]]) {
  const f = 2500 + rnd() * 900; at(t, squeak(f, f * 1.25, .07), .1, p);
}
// calf and cow bells, each on its own beat
for (const [t, m, p] of [[.4, 88, -.6], [2.4, 91, .5], [4.4, 88, -.6], [6.4, 86, .4], [1.2, 93, -.3], [5.2, 93, -.3], [3.1, 84, .2], [7.1, 84, .2]]) at(t, bell(note(m), 1.2, { k: 5 }), .1, p);

// the laddoo toss (every 4 s): a little whoosh up, a giggle, the catch
for (const k of [0, 4]) {
  at(k + .3, whoosh(.35, 900, 2600), .16, -.4);
  at(k + .45, squeak(1300, 1900, .09), .09, -.4); at(k + .58, squeak(1250, 1800, .09), .08, -.4);
  at(k + 1.5, plink(note(76)), .2, -.4);
}
// Kanha's morsel: a soft "nom" as it reaches his mouth (every 4 s)
for (const k of [0, 4]) at(k + .6, tone(.14, x => 320 - x * 600, { type: 'tri', e: env.pluck(25) }), .16, 0);
// the calf's frisk lands
for (const k of [0, 4]) at(k + 1.2, tone(.15, x => 140 * Math.exp(-x * 9) + 60, { e: env.pluck(14) }), .14, -.5);
// one soft moo from the cow by the tree
function moo(dur, amp = 1) {
  const b = tone(dur, t => 128 - 26 * (t / dur) + 6 * Math.sin(t * 9), { type: 'saw', e: env.swell(.12, .3), amp });
  let l = 0; for (let i = 0; i < b.length; i++) { const t = i / SR, fc = 380 + 520 * Math.sin(Math.PI * Math.min(1, t / dur)), a = 1 - Math.exp(-2 * Math.PI * fc / SR); l += a * (b[i] - l); b[i] = l * 1.8; }
  return b;
}
at(5.9, moo(1.1), .22, -.3);
// Brahma: a faint glassy shimmer as he rises (peak at 4 s)
at(3.2, bell(note(96), 1.6, { partials: [[1, 1], [2, .2]], k: 2.5 }), .05, .5);

T.write('assets/kanha_puzzle_sfx.wav', { fade: 0 });
