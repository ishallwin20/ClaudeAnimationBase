// chhath_sfx.mjs: the sound effects for the Chhath reel (src/scenes/chhath.js) → assets/chhath_sfx.wav, then the mix
// with the voice → assets/chhath_mix.wav. Times come from the voice and the timeline (src/scenes/chhath_vo.js +
// chhath_tl.js, loaded with vm), so they follow the picture.
// A river under the ghat shots and a soft warm pad (mild: the owner adds a Chhath song on Instagram); a temple bell on
// frame 0; a chime as the soop rises; pops on NO PRIEST / IDOL / TEMPLE; a low bell on 36 HOURS. A rising chime for
// each day's title. Day 1: a splash, then a brass tick. Day 2: the stove's fire, which dies to a hush on "36 hours" with
// a low boom. Day 3: the river, a swell as the soops rise. Day 4: near silence, a far bell, then the sunrise: a conch,
// a bright bell and a shimmer. Chhathi Maiya: a bell. The close: the pad falls and rises with the sun. Jai Chhathi
// Maiya: bells and the conch. The card.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, plink, click, shimmer, note, seed, chime, rnd, fire } from './sfx.mjs';

const TL = runInNewContext(readFileSync('src/scenes/chhath_vo.js', 'utf8') + '\n' + readFileSync('src/scenes/chhath_tl.js', 'utf8') + '\n;TL');
const T = track(TL.END);
seed(97);
const pop = (amp = 1, f = 1) => mixb(click(amp), tone(.07, t => f * (500 + 2600 * t / .07), { e: env.pluck(40), amp: amp * .7 }), noise(.05, { lp: 2500, hp: 300, e: env.pluck(60), amp: amp * .5 }));
const pad = (dur, ms, amp = 1) => mixb(...ms.map((m, i) => tone(dur, t => note(m) * (1 + .003 * Math.sin(t * 2 + i)), { type: 'tri', e: env.swell(.9, .9), amp: amp / ms.length })));
const templeBell = (f = 76, amp = 1) => bell(note(f), 4, { partials: [[1, 1], [2.02, .6], [2.76, .45], [4.1, .3], [5.4, .18]], k: 1.1, amp });
const boom = (amp = 1) => mixb(tone(2.2, t => 52 * Math.exp(-t * .9) + 26, { e: env.pluck(1.6), amp }), noise(.9, { lp: 380, hp: 25, brown: true, e: env.pluck(4), amp: amp * .7 }));
const sparkle = (amp = 1) => shimmer(.9, [note(88), note(91), note(95), note(100)], .7 * amp, .05);
const drop = (amp = 1, f = 700) => mixb(tone(.07, t => f * (1 + t * 16), { e: env.pluck(55), amp }), noise(.03, { hp: 1500, lp: 6000, e: env.pluck(120), amp: amp * .25 }));
const splash = (amp = 1) => mixb(noise(.7, { hp: 500, lp: t => 5200 - 3600 * t / .7, e: env.ad(.02, .22), amp: amp }), drop(.5 * amp, 380), noise(.25, { brown: true, lp: 500, e: env.pluck(9), amp: amp * .8 }));
// a conch (shankh): a reedy tone that swells and bends up a little
const conch = (dur, m = 62, amp = 1) => mixb(
  tone(dur, t => note(m) * (1 + .035 * Math.min(1, t / .5)) * (1 + .004 * Math.sin(t * 31)), { type: 'saw', e: env.swell(.35, .7), amp: amp * .22 }),
  tone(dur, t => note(m) * (1 + .035 * Math.min(1, t / .5)), { type: 'tri', e: env.swell(.3, .7), amp: amp * .7 }),
  tone(dur, t => note(m + 12) * (1 + .035 * Math.min(1, t / .5)), { e: env.swell(.5, .6), amp: amp * .22 }));
function river(dur, amp = 1) {
  const o = mixb(noise(dur, { brown: true, lp: 420, e: env.swell(1.2, 1.2), amp: .9 * amp }), noise(dur, { hp: 300, lp: 1300, e: env.swell(1.2, 1.2), amp: .25 * amp }));
  for (let i = 0; i < o.length; i++) { const t = i / 48000; o[i] *= .7 + .3 * Math.sin(t * 1.3) * Math.sin(t * .47 + 1); }
  return o;
}
const dayChime = (n) => mixb(chime(note(72 + n * 2), .8, 2), chime(note(79 + n * 2), .5, 2), sparkle(.4));

// ---- the beds: the river at the ghat, a pad
for (const [a, b, g] of [[0, TL.MEAL - .75, .05], [TL.F0, TL.G0, .05], [TL.G0, TL.H0, .03], [TL.H0, TL.CARD + .3, .05]]) T.at(a, river(b - a + .5), g, 0);
const PADS = [[0, TL.B0, [57, 64, 69, 76]], [TL.B0, TL.C0, [55, 62, 67, 74]], [TL.C0, TL.D0, [60, 64, 67, 72]], [TL.D0, TL.THEN, [57, 60, 64, 69]], [TL.THEN, TL.F0, [50, 57, 62]],
  [TL.F0, TL.G0, [57, 64, 69, 76]], [TL.G0, TL.H0, [50, 57, 64]], [TL.H0, TL.I0, [62, 66, 69, 74]], [TL.I0, TL.J0, [60, 64, 67, 72]], [TL.J0, TL.SETS + .3, [57, 60, 64, 69]], [TL.SETS + .3, TL.K0, [62, 66, 69, 74]], [TL.K0, TL.CARD, [62, 69, 74, 78]]];
for (const [a, b, ms] of PADS) T.at(a, pad(b - a + .8, ms, 1), .04, 0);
// ---- A: the hook
T.at(0, templeBell(64, 1), .12, 0);
T.at(.05, sparkle(.7), .05, 0);
T.at(TL.ONE - .1, whoosh(.9, 250, 1200, 1), .05, 0);
T.at(TL.SETTING - .05, mixb(templeBell(57, .8), chime(note(81), .5, 2)), .1, 0);
// ---- B: Chhath; no priest, no idol, no temple; 36 hours
T.at(TL.B0, whoosh(.9, 300, 1600, 1), .05, 0);
T.at(TL.CHHATH - .05, templeBell(69, .9), .1, 0);
for (const [w, f, p] of [[TL.PRIEST, 1, -.4], [TL.IDOL, 1.12, 0], [TL.TEMPLE, 1.25, .4]]) { T.at(w - .06, pop(.8, f), .11, p); T.at(w + .14, noise(.22, { hp: 1200, lp: 5000, e: env.hann(), amp: .6 }), .05, p); }
T.at(TL.JUST - .1, whoosh(.8, 300, 1400, 1), .05, 0);
T.at(TL.H36 - .1, mixb(templeBell(50, 1), boom(.5)), .13, 0);
// ---- C: day 1
T.at(TL.C0, whoosh(.8, 300, 1800, 1), .05, 0);
T.at(TL.DAY1 - .05, dayChime(0), .09, 0);
T.at(TL.DIP - .25, splash(1), .09, -.2); T.at(TL.DIP + .5, splash(.6), .05, .3);
T.at(TL.MEAL - .75, whoosh(.6, 400, 1600, 1), .04, 0);
for (const [w, f, p] of [[TL.RICE, 1, -.3], [TL.DAL, 1.15, .3], [TL.LAUKI, 1.3, .2]]) T.at(w - .05, mixb(pop(.6, f), plink(note(84 + (f - 1) * 20), .4)), .09, p);
// ---- D: day 2; the fire; 36 hours
T.at(TL.D0, whoosh(.8, 300, 1400, 1), .05, 0);
T.at(TL.DAY2 - .05, dayChime(1), .09, 0);
T.at(TL.D0, fire(TL.THEN - TL.D0 + 1.2, .5, 1), .05, 0);
T.at(TL.THEN + .9, fire(TL.F0 - TL.THEN - .6, .5, .1), .02, 0);
T.at(TL.KHEER - .05, pop(.6, 1), .08, -.2); T.at(TL.ROTI - .05, pop(.6, 1.2), .08, .3);
T.at(TL.THEN - .2, whoosh(.9, 900, 200, 1), .06, 0);
T.at(TL.E36 - .08, mixb(boom(1), templeBell(45, .9)), .16, 0);
T.at(TL.FOOD - .12, pop(.8, .9), .1, -.3); T.at(TL.DROP - .08, pop(.8, 1.05), .1, .3);
T.at(TL.WATER, drop(1, 520), .1, .3);
// ---- F: day 3; the soop raised to the setting sun
T.at(TL.F0, whoosh(.9, 300, 1800, 1), .05, 0);
T.at(TL.DAY3 - .05, dayChime(2), .09, 0);
T.at(TL.SOOP - .05, mixb(pop(.6, 1.1), sparkle(.5)), .08, .2);
T.at(TL.RAISED - .4, whoosh(1.2, 200, 1500, 1), .06, 0);
T.at(TL.SET3 - .1, mixb(templeBell(57, 1), conch(2.2, 57, .6)), .1, 0);
// ---- G: day 4; before dawn; waiting
T.at(TL.G0 + .1, whoosh(1.2, 600, 200, 1), .04, 0);
T.at(TL.DAY4 - .05, dayChime(3), .07, 0);
T.at(TL.COLD, mixb(drop(.7, 420), drop(.5, 640)), .05, -.3);
T.at(TL.WAITING + .1, bell(note(81), 3, { partials: [[1, 1], [2.76, .3]], k: 1.2, amp: .6 }), .05, .4);
// ---- H: the sun rises
T.at(TL.H0 + .2, tone(TL.RISES - TL.H0 - .2, t => note(50) * (1 + .5 * t / (TL.RISES - TL.H0)), { type: 'tri', e: env.swell(1.4, .1), amp: 1 }), .05, 0);
T.at(TL.RISES - 1.0, whoosh(1.1, 200, 2400, 1), .08, 0);
T.at(TL.RISES - .12, mixb(conch(3.2, 62, 1), templeBell(62, 1), templeBell(74, .6)), .2, 0);
T.at(TL.RISES + .05, sparkle(1), .09, 0);
T.at(TL.BREAK - .05, mixb(chime(note(86), .7, 2), sparkle(.6)), .08, 0);
// ---- I: Chhathi Maiya
T.at(TL.I0, whoosh(.8, 300, 1600, 1), .04, 0);
T.at(TL.MAIYA - .05, templeBell(69, 1), .11, 0);
T.at(TL.SHASHTHI - .05, mixb(pop(.6, 1.1), chime(note(84), .5, 1.6)), .08, 0);
T.at(TL.GUARD - .05, pop(.5, 1.2), .06, 0);
T.at(TL.SISTER - .05, sparkle(.8), .07, 0);
// ---- J: the sun sets, and rises again
T.at(TL.BOWS - .6, tone(TL.SETS - TL.BOWS + .9, t => note(69) * Math.pow(.5, t / (TL.SETS - TL.BOWS + .9) * .75), { type: 'tri', e: env.swell(.5, .5), amp: 1 }), .05, 0);
T.at(TL.SETS, templeBell(50, 1), .11, 0);
T.at(TL.BECAUSE + .5, tone(TL.K0 - TL.BECAUSE - .2, t => note(57) * Math.pow(2, t / (TL.K0 - TL.BECAUSE - .2) * .75), { type: 'tri', e: env.swell(.5, .4), amp: 1 }), .05, 0);
T.at(TL.RISE2 - .05, mixb(templeBell(69, .9), sparkle(.8)), .1, 0);
// ---- K: your ghat; Jai Chhathi Maiya
T.at(TL.GHAT - .1, mixb(pop(.9, 1.2), chime(note(79), .6, 1.6)), .1, 0);
T.at(TL.JAI - .5, whoosh(.6, 300, 2600, 1), .08, 0);
T.at(TL.JAI - .08, mixb(conch(3, 62, 1), templeBell(62, 1), templeBell(69, .8), templeBell(74, .6)), .22, 0);
T.at(TL.JAI + .1, sparkle(1), .09, 0);
// ---- the card
T.at(TL.CARD - .3, whoosh(.7, 400, 3200), .2, 0);
T.at(TL.CARD + .35, mixb(...[62, 65, 69, 74].map((m) => bell(note(m), 2.2, { partials: [[1, 1], [2, .35], [3, .12]], k: 1.4, amp: .7 }))), .18, 0);
for (let k = 0; k < 3; k++) T.at(TL.CARD + .8 + k * .2, pop(.8, 1 + k * .15), .18, (k - 1) * .4);
T.at(TL.CARD + 1.3, mixb(pop(1, 1.3), shimmer(.7, [note(86), note(89), note(93)], .6, .06)), .2, 0);
T.at(TL.CARD, pad(TL.END - TL.CARD, [50, 57, 62, 65], .7), .07, 0);

T.write('assets/chhath_sfx.wav');
console.log('assets/chhath_sfx.wav', TL.END.toFixed(2), 's');
// the mix: the voice at full level over the SFX, normalised to -14 LUFS
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'assets/chhath_vo.wav', '-i', 'assets/chhath_sfx.wav', '-filter_complex',
  `[1:a]volume=0.8[s];[0:a][s]amix=inputs=2:normalize=0:duration=longest,apad=whole_dur=${TL.END.toFixed(3)},atrim=0:${TL.END.toFixed(3)},loudnorm=I=-14:TP=-1.5:LRA=11[o]`,
  '-map', '[o]', '-ar', '48000', '-ac', '2', 'assets/chhath_mix.wav']);
console.log('assets/chhath_mix.wav');
