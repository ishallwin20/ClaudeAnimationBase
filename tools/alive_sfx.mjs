// alive_sfx.mjs: the sound effects for "Is HANUMAN alive?" (src/scenes/alive.js), under the Lyria score. Times match TL.
//   The field: a low boom, wind, small fires, a tolling bell. Jambavan: torches, then a hush with a slow heart. The
//   charge: Trikuta groaning under him, rock falling, a rising rush; the leap (a boom, thunder, a whoosh away). The map:
//   wind streaming. The Himalaya: the herbs as shimmering chimes; they go out one by one, down the scale, into a cold
//   wind. He rises: a low rumble, his eyes (a deep hit), a heart speeding up. The grip (two thuds), the stone cracking,
//   a rising rush; half a second of nothing but one high note; the tear (the biggest hit: boom, thunder, rockfall, a
//   shimmer), rocks raining, a conch. The second sun: a rush and a shimmer. The fragrance: rising chimes, the army's
//   roar. Dawn: birds, an om, a bell, a conch on the ask. The card's chimes.
//   node tools/alive_sfx.mjs [--score=assets/alive_score.mp3] → assets/alive_sfx.wav and assets/alive_mix.wav
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { clamp, track, tone, noise, bell, mixb, whoosh, crackle, crunch, shimmer, env, note, seed, rnd, thunder, wind, drum, fire, om, conch, chime, chirp, roar, rockfall, heart, thud, rumble, drone } from './sfx.mjs';

const TL = { A: 0, B: 4.0, C: 7.6, D: 12.2, E: 16.0, F: 21.6, G: 26.2, H: 28.2, I: 33.0, J: 38.5, K: 43.5, EYES: 45.0, L: 47.5, RIP: 50.8, M: 56.4, N: 61.4, O: 67.4, CARD: 77.0, END: 82.5 };
const T = track(TL.END);
seed(84);
const pent = [0, 2, 4, 7, 9];
const boom = (f = 32, amp = 1, len = 2.2) => mixb(drum(f, amp, len), noise(.8, { brown: true, lp: 220, e: env.pluck(3), amp: 1.3 * amp }));
const toll = (m, len = 4, amp = 1) => bell(note(m), len, { partials: [[1, 1], [2.4, .5], [3.9, .3]], k: .8, amp });
const flame = (amp = 1, dur = .7) => noise(dur, { brown: true, lp: t => 300 + 1600 * Math.exp(-t * 4), e: env.swell(.02, .5), amp });

// ---------- the field (0–7.6) ----------
T.at(0, boom(28, 1, 3), .7);
T.at(0, drone(TL.D, 49, 1), .09);
T.at(0, wind(TL.F, 2, 1), .12, -.4); T.at(0, wind(TL.F, 6, 1), .09, .4);
T.at(0, fire(TL.D, .25, .4), .07, -.3); T.at(.4, fire(TL.D - .4, .2, .3), .05, .4);
T.at(.3, toll(50, 4.5), .22);
T.at(TL.B, toll(45, 4.5), .26); T.at(TL.B, boom(36, .5, 1.6), .3);
// ---------- the torches, Jambavan (7.6–12.2) ----------
T.at(TL.C + .2, flame(.8, .9), .22, -.5); T.at(TL.C + .9, flame(.7, .8), .18, -.3);
T.at(TL.C, fire(TL.F - TL.C, .4, .6), .1, -.2);
for (let i = 0; i < 7; i++) T.at(TL.C + .5 + i * .52, thud(.5), .08, -.5 + i * .08);
// ---------- "Is Hanuman alive?" (12.2–16) ----------
for (const d of [.3, 1.2, 2.1, 3.0]) T.at(TL.D + d, heart(1), .34);
T.at(TL.D + .5, tone(3.2, note(81), { e: env.swell(.8, 1.2), amp: 1 }), .02);
// ---------- at his feet (16–21.6) ----------
T.at(TL.E, om(TL.F - TL.E, 98, 1), .12);
T.at(18.7, chime(note(81), 1, 3), .1); T.at(19.6, chime(note(88), 1, 3), .08, .3);
// ---------- Trikuta, the second mountain (21.6–26.2) ----------
T.at(TL.F, boom(30, .7, 2.4), .4);
T.at(TL.F + 1.6, rumble(3.0), .34);
T.at(TL.F + 2.7, rockfall(1.9, .8), .3);
T.at(TL.G - 1.1, whoosh(1.1, 150, 4200, 1), .5);
// ---------- the leap (26.2–28.2) ----------
T.at(TL.G, mixb(boom(24, 1, 3), thunder(2.6, 1)), .95);
T.at(TL.G + .05, whoosh(1.6, 3000, 300, 1), .5, .4);
T.at(TL.G + .2, rockfall(1.6, .6), .22);
// ---------- the map (28.2–33) ----------
T.at(TL.H, wind(4.8, 12, 1), .22); T.at(TL.H, whoosh(4.6, 500, 1800, 1), .16);
T.at(TL.H + .3, shimmer(4, [0, 7, 12, 19].map(i => note(64 + i)), 1, .2), .06);
// ---------- the mountain of herbs (33–38.5) ----------
T.at(TL.I, wind(TL.L - TL.I, 20, .6), .1);
T.at(TL.I + .2, shimmer(5.2, [0, 2, 4, 7, 9, 12, 14, 16].map(i => note(76 + i)), 1, .09), .16);
for (let i = 0; i < 9; i++) T.at(TL.I + .6 + i * .5, chime(note(84 + pent[i % 5] + 12 * (i % 2)), .7, 2.4), .06, rnd() * 1.4 - .7);
T.at(TL.I + .4, om(4.6, 131, 1), .08);
// ---------- the herbs hide (38.5–43.5) ----------
for (let i = 0; i < 12; i++) T.at(TL.J + 1.0 + i * .24, chime(note(96 - i * 2), .5, 1.2), .08 * (1 - i / 16), rnd() * 1.4 - .7);
T.at(TL.J + 3.9, noise(.7, { hp: 400, lp: 2400, e: env.swell(.01, .6), amp: 1 }), .14);
T.at(TL.J + 3.6, wind(2.4, 31, 1), .2);
// ---------- he rises; the eyes (43.5–47.5) ----------
T.at(TL.K + .2, rumble(3.6), .26);
T.at(TL.K, drone(TL.L - TL.K, 41, 1), .14);
T.at(TL.EYES, mixb(boom(26, .9, 2.6), roar(1.6, 60, 3, .8)), .5);
for (let i = 0; i < 6; i++) T.at(TL.EYES + .6 + i * (.42 - i * .03), heart(1), .26 + i * .02);
// ---------- the grip, the strain, the silence, the tear (47.5–56.4) ----------
T.at(TL.L + .9, mixb(thud(1), crunch(.7)), .42, -.4); T.at(TL.L + 1.15, mixb(thud(1), crunch(.7)), .42, .4);
T.at(TL.RIP - 1.8, crackle(1.4, 1), .2); T.at(TL.RIP - 1.8, rumble(1.5), .4);
T.at(TL.RIP - 1.4, whoosh(1.0, 150, 5200, 1), .55);
T.at(TL.RIP - .42, tone(.44, note(96), { e: env.swell(.05, .2), amp: 1 }), .025);
T.at(TL.RIP, mixb(boom(22, 1, 3.8), thunder(3.4, 1), rockfall(2.6, 1), drum(40, 1, 1.2)), 1.0);
T.at(TL.RIP + .05, shimmer(3, [0, 4, 7, 12, 16, 19, 24].map(i => note(72 + i)), 1, .07), .22);
T.at(TL.RIP + .3, roar(2.2, 80, 6, 1), .14);
T.at(TL.RIP + 1.0, rockfall(3.2, .7), .26, -.3); T.at(TL.RIP + 1.8, rockfall(2.4, .5), .2, .4);
T.at(TL.RIP + 2.5, conch(2.8, 294, 1), .2);
T.at(TL.RIP + 2.2, shimmer(3.2, [0, 2, 4, 7, 9, 12].map(i => note(79 + i)), 1, .1), .12);
// ---------- the second sun (56.4–61.4) ----------
T.at(TL.M - .3, whoosh(1.4, 300, 3000, 1), .4);
T.at(TL.M, wind(5, 17, 1), .2); T.at(TL.M + .2, shimmer(4.6, [0, 4, 7, 12, 16].map(i => note(74 + i)), 1, .12), .12);
T.at(TL.M + .1, om(4.8, 147, 1), .1);
// ---------- the fragrance; they rise (61.4–67.4) ----------
T.at(TL.N, wind(6, 23, .5), .1);
for (let i = 0; i < 12; i++) T.at(TL.N + .4 + i * .3, chime(note(76 + pent[i % 5] + 12 * Math.floor(i / 5)), .8, 2.6), .07, rnd() * 1.4 - .7);
T.at(TL.N + 2.4, roar(3.6, 150, 14, .8), .16); T.at(TL.N + 3.2, roar(2.8, 190, 12, .8), .12, .4);
T.at(TL.N + 2.8, boom(34, .7, 2), .34);
T.at(TL.N + 3.0, conch(2.6, 311, 1), .16);
// ---------- dawn; the ask (67.4–77) ----------
for (let i = 0; i < 12; i++) T.at(TL.O + .3 + rnd() * 8.5, chirp(1), .045, rnd() * 1.4 - .7);
T.at(TL.O, om(TL.CARD - TL.O, 98, 1), .12);
T.at(70.9, toll(62, 4), .22);
T.at(74.0, conch(2.6, 311, 1), .2);
// ---------- the card ----------
T.at(TL.CARD, chime(note(84), 1, 3), .2, -.2); T.at(TL.CARD + .25, chime(note(88), 1, 3), .18, .2); T.at(TL.CARD + 1.3, chime(note(91), 1, 3), .16);
T.at(TL.CARD + .2, om(TL.END - TL.CARD - .2, 98, 1), .1);

T.write('assets/alive_sfx.wav');

// ---------- the score under it (Lyria): cut from --off seconds in, a level curve that makes the hush under Jambavan's
// question and the half-second of nothing before the tear ----------
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const SCORE = args.score || 'assets/alive_score.wav', off = +(args.off || 0);
if (existsSync(SCORE)) {
  const pts = [[0, 1], [TL.D - .4, 1], [TL.D + .2, .45], [TL.E, .45], [TL.E + 1, .9], [TL.RIP - .55, 1], [TL.RIP - .45, 0], [TL.RIP - .04, 0], [TL.RIP, 1.15], [TL.CARD, 1], [TL.END - 2.5, .8], [TL.END - .2, 0]];
  let lv = String(pts[pts.length - 1][1]);
  for (let i = pts.length - 2; i >= 0; i--) { const [t0, v0] = pts[i], [t1, v1] = pts[i + 1]; lv = `if(lt(t,${t1}),${v0}+(t-${t0})/${(t1 - t0).toFixed(3)}*${(v1 - v0).toFixed(3)},${lv})`; }
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', SCORE, '-i', 'assets/alive_sfx.wav', '-filter_complex', [
    `[0:a]aresample=48000,atrim=${off}:${off + TL.END},asetpts=PTS-STARTPTS,volume='${lv}':eval=frame,volume=${args.k || .55}[m]`,
    '[1:a]volume=1.3[s]', '[m][s]amix=inputs=2:duration=longest:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=14,aresample=48000[o]'].join(';'),
    '-map', '[o]', '-t', String(TL.END), '-ar', '48000', '-ac', '2', 'assets/alive_mix.wav'], { stdio: 'inherit' });
  console.log('wrote assets/alive_mix.wav');
}
