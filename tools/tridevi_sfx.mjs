// tridevi_sfx.mjs: the sound effects for "Lakshmi was born as BRAHMA'S sister" (src/scenes/tridevi.js) →
// assets/tridevi_sfx.wav, then the mix with the voice → assets/tridevi_mix.wav. Times come from the voice and the
// timeline (src/scenes/tridevi_vo.js + tridevi_tl.js, loaded with vm), so they follow the picture.
// A cosmic hall: a low drone and a soft pad under everything, a temple bell on frame 0. The hook: a shimmer on each
// pair. The book: a page turn, a deep bell. One goddess: a swell, a bell; she becomes three: two whooshes, two bells.
// The pairs: rising streams, a chime as each appears. The cross: a long whoosh as the goddesses circle, three bells as
// the couples light. The egg: a hum as it forms, a tremble, the crack and a boom, a bright shimmer for the world, a
// warm chord for the shell. Why: three soft bells. Wasted: coins clinking away; helpless: a hollow tone; dangerous: a
// low boom. One: the streams rise, a big bell. The ask: pops. The card.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, plink, click, shimmer, drone, note, seed, chime, thud, rnd, crinkle } from './sfx.mjs';

const TL = runInNewContext(readFileSync('src/scenes/tridevi_vo.js', 'utf8') + '\n' + readFileSync('src/scenes/tridevi_tl.js', 'utf8') + '\n;TL');
const T = track(TL.END);
seed(91);
const pop = (amp = 1, f = 1) => mixb(click(amp), tone(.07, t => f * (500 + 2600 * t / .07), { e: env.pluck(40), amp: amp * .7 }), noise(.05, { lp: 2500, hp: 300, e: env.pluck(60), amp: amp * .5 }));
const pad = (dur, ms, amp = 1) => mixb(...ms.map((m, i) => tone(dur, t => note(m) * (1 + .003 * Math.sin(t * 2 + i)), { type: 'tri', e: env.swell(.9, .9), amp: amp / ms.length })));
const templeBell = (f = 76, amp = 1) => bell(note(f), 4, { partials: [[1, 1], [2.02, .6], [2.76, .45], [4.1, .3], [5.4, .18]], k: 1.1, amp });
const boom = (amp = 1) => mixb(tone(2.2, t => 52 * Math.exp(-t * .9) + 26, { e: env.pluck(1.6), amp }), noise(.9, { lp: 380, hp: 25, brown: true, e: env.pluck(4), amp: amp * .7 }));
const rise = (dur, f0, f1, amp = 1) => tone(dur, t => f0 * Math.pow(f1 / f0, t / dur), { type: 'tri', e: env.swell(dur * .5, .25), amp });
const sparkle = (amp = 1) => shimmer(.9, [note(88), note(91), note(95), note(100)], .7 * amp, .05);
const coin = (amp = 1) => mixb(plink(note(96 + Math.floor(rnd() * 6)), .35 * amp), plink(note(103 + Math.floor(rnd() * 4)), .2 * amp), click(.4 * amp));
const crack = (amp = 1) => mixb(crinkle(.35, amp), click(amp), noise(.18, { hp: 1800, lp: 9000, e: env.pluck(18), amp: amp * .7 }));

// ---- the bed: a cosmic drone and a pad all the way to the card
T.at(0, drone(TL.CARD + .4, 41, 1), .05, 0);
const PADS = [[0, TL.C0, [57, 64, 69]], [TL.C0, TL.E0, [55, 62, 67, 71]], [TL.E0, TL.G0, [57, 64, 69, 72]], [TL.G0, TL.I0, [53, 60, 65, 69]], [TL.I0, TL.CARD, [57, 64, 69, 76]]];
for (const [a, b, ms] of PADS) T.at(a, pad(b - a + .8, ms, 1), .05, 0);
// ---- A: the hook
T.at(0, templeBell(62, 1), .13, 0);
T.at(.05, sparkle(.8), .06, -.2);
T.at(TL.BRAHMAS, chime(note(79), .6, 1.8), .07, -.2);
T.at(TL.SARASWATI - .3, whoosh(.6, 500, 2600, 1), .08, .2);
T.at(TL.SARASWATI, sparkle(.8), .06, .2);
T.at(TL.SHIVAS, chime(note(76), .6, 1.8), .08, 0);
// ---- B: the book
T.at(TL.B0, whoosh(1.0, 300, 1600, 1), .06, 0);
T.at(TL.DEVI - .4, mixb(crinkle(.6, .9), noise(.5, { hp: 900, lp: 5000, e: env.swell(.15, .3), amp: .5 })), .07, 0);
T.at(TL.DEVI + .3, thud(.4), .06, 0);
T.at(TL.PRADHANIKA - .05, templeBell(55, 1), .13, 0);
// ---- C: one goddess; she becomes three
T.at(TL.ONE - .9, rise(1.1, note(57), note(69), 1), .05, 0);
T.at(TL.ONE - .05, mixb(templeBell(64, .9), sparkle(1)), .12, 0);
T.at(TL.MAHAK - .5, whoosh(.9, 300, 1400, 1), .08, -.4); T.at(TL.MAHAK, templeBell(52, .9), .12, -.4);
T.at(TL.MAHAS - .5, whoosh(.9, 600, 3000, 1), .08, .4); T.at(TL.MAHAS, mixb(templeBell(71, .8), sparkle(.8)), .1, .4);
// ---- D: the pairs
T.at(TL.PAIR - .5, rise(1.3, note(60), note(84), 1), .045, 0);
T.at(TL.PAIR, chime(note(81), .7, 2), .07, 0);
for (const [w, m, p] of [[TL.P_BR, 72, -.2], [TL.P_LA, 79, .2], [TL.P_SH, 69, -.3], [TL.P_SA, 76, .1], [TL.P_VI, 74, .3], [TL.P_GA, 81, .4]]) T.at(w - .2, mixb(pop(.6, 1 + (m - 70) / 30), chime(note(m), .6, 1.6)), .09, p);
// ---- E: the cross
T.at(TL.DIFFERENT - .3, whoosh(2.2, 250, 1800, 1), .09, 0);
T.at(TL.DIFFERENT, mixb(rise(2.0, note(62), note(74), 1), sparkle(.6)), .05, 0);
for (const [w, m] of [[TL.X_BR, 67], [TL.X_SH, 64], [TL.X_VI, 71]]) T.at(w - .05, templeBell(m, .8), .11, 0);
// ---- F: the egg
T.at(TL.E_BR, rise(TL.EGG - TL.E_BR, note(55), note(67), 1), .05, 0);
T.at(TL.EGG - .1, mixb(templeBell(57, .8), sparkle(.7)), .11, 0);
T.at(TL.EGG, tone(TL.OPEN - TL.EGG, t => 70 + 6 * Math.sin(t * 30) * Math.min(1, t / 2), { type: 'tri', e: env.swell(.8, .2), amp: 1 }), .06, 0);
T.at(TL.E_SH, rise(TL.OPEN - TL.E_SH, note(50), note(62), 1), .05, 0);
T.at(TL.OPEN - .15, crack(1), .14, -.1); T.at(TL.OPEN - .05, crack(.8), .12, .1);
T.at(TL.OPEN, mixb(boom(1), thud(.8)), .2, 0);
T.at(TL.OPEN + .1, shimmer(1.6, [note(84), note(88), note(91), note(96)], .8, .04), .07, 0);
T.at(TL.E_VI, rise(TL.PROTECT - TL.E_VI, note(57), note(69), 1), .05, 0);
T.at(TL.PROTECT - .1, mixb(...[57, 64, 69, 76].map(m => bell(note(m), 2.6, { partials: [[1, 1], [2, .3], [3, .1]], k: 1.2, amp: .5 }))), .12, 0);
// ---- G: why
T.at(TL.ALONE, chime(note(74), .6, 1.8), .06, 0);
for (const [w, m, p] of [[TL.KNOW, 79, 0], [TL.STRONG, 72, -.4], [TL.WEALTH, 76, .4]]) T.at(w - .05, templeBell(m, .7), .1, p);
// ---- H: one without the others
T.at(TL.H0, whoosh(.8, 400, 1500, 1), .06, 0);
{ const t0 = TL.H0 + .5; for (let i = 0; i < 36; i++) T.at(t0 + i * .09 + rnd() * .05 + .3, coin(.6 + rnd() * .4), .05, .3 + (rnd() - .5) * .4); }
T.at(TL.WASTED, mixb(thud(.7), tone(.8, t => 220 * Math.pow(.5, t / .8), { type: 'tri', e: env.pluck(4), amp: .6 })), .1, 0);
T.at(TL.L_KN - .25, whoosh(.6, 300, 1200, 1), .06, -.2);
T.at(TL.HELPLESS, tone(1.6, t => note(62) * (1 - .03 * t), { type: 'sine', e: env.swell(.05, 1.3), amp: 1 }), .07, 0);
T.at(TL.L_ST - .25, whoosh(.6, 200, 900, 1), .07, .2);
T.at(TL.DANGEROUS - .6, rise(.6, 40, 70, 1), .08, 0);
T.at(TL.DANGEROUS, mixb(boom(1.1), thud(1)), .22, 0);
// ---- I: all of them are one
T.at(TL.ONE2 - .5, rise(1.6, note(57), note(81), 1), .06, 0);
T.at(TL.ONE2 + .1, sparkle(1), .07, 0);
T.at(TL.MAHAL2 - .05, templeBell(50, 1.1), .16, 0);
T.at(TL.MOTHER, chime(note(81), .7, 2.2), .07, 0);
// ---- J: the ask
for (const [w, f, p] of [[TL.A_LA, 1, -.4], [TL.A_SA, 1.15, 0], [TL.A_PA, 1.3, .4]]) T.at(w, pop(.7, f), .1, p);
T.at(TL.YOUR, chime(note(79), .5, 1.5), .06, 0);
T.at(TL.STATE, mixb(pop(1, 1.3), shimmer(.7, [note(91), note(95), note(98)], .6, .06)), .16, 0);
// ---- the card
T.at(TL.CARD - .3, whoosh(.7, 400, 3200), .22, 0);
T.at(TL.CARD + .35, mixb(...[67, 71, 74, 79].map((m) => bell(note(m), 2.2, { partials: [[1, 1], [2, .35], [3, .12]], k: 1.4, amp: .7 }))), .2, 0);
for (let k = 0; k < 3; k++) T.at(TL.CARD + .7 + k * .12, pop(.8, 1 + k * .15), .22, (k - 1) * .4);
T.at(TL.CARD + 1.65, mixb(pop(1, 1.3), shimmer(.7, [note(91), note(95), note(98)], .6, .06)), .24, 0);
T.at(TL.CARD, pad(TL.END - TL.CARD, [67, 71, 74], .7), .07, 0);

T.write('assets/tridevi_sfx.wav');
console.log('assets/tridevi_sfx.wav', TL.END.toFixed(2), 's');
// the mix: the voice at full level over the SFX, normalised to -14 LUFS
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'assets/tridevi_vo.wav', '-i', 'assets/tridevi_sfx.wav', '-filter_complex',
  `[1:a]volume=0.85[s];[0:a][s]amix=inputs=2:normalize=0:duration=longest,apad=whole_dur=${TL.END.toFixed(3)},atrim=0:${TL.END.toFixed(3)},loudnorm=I=-14:TP=-1.5:LRA=11[o]`,
  '-map', '[o]', '-ar', '48000', '-ac', '2', 'assets/tridevi_mix.wav']);
console.log('assets/tridevi_mix.wav');
