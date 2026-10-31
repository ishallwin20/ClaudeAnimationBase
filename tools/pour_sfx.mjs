// pour_sfx.mjs: the sound effects for "What you POUR on SHIVA decides what you GET" (src/scenes/pour.js) →
// assets/pour_sfx.wav, then the mix with the voice → assets/pour_mix.wav. Times come from the voice and the timeline
// (src/scenes/pour_vo.js + pour_tl.js, loaded with vm), so they follow the picture.
// The sanctum: a low hum and the lamps' hush under everything, a temple bell to open. Each liquid has its own pour (a
// trickle tuned to how thick it is: water bright and quick, honey low and slow) and a soft chime as its drop fills the
// row. Not a splash: a thrown splatter and a stamp; the stream: a clean pour and a bright ✓. The enemies: a low drum and
// the hum dropping out. Moksha: the light opening (a rising shimmer), Ganga a deep bell and a conch. The mantra an om,
// the counter ticking. The screenshot a shutter, the ask two plinks, next the aarti bell, the card.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, plink, clang, click, shimmer, drone, note, seed, chime, drum, om, conch, thud, splash, SR } from './sfx.mjs';

const TL = runInNewContext(readFileSync('src/scenes/pour_vo.js', 'utf8') + '\n' + readFileSync('src/scenes/pour_tl.js', 'utf8') + '\n;TL');
const T = track(TL.END);
seed(69);
const add = (o, b, s0, g = 1) => { const s = Math.round(s0 * SR); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j] * g; return o; };
const pop = (amp = 1, f = 1) => mixb(click(amp), tone(.07, t => f * (500 + 2600 * t / .07), { e: env.pluck(40), amp: amp * .7 }), noise(.05, { lp: 2500, hp: 300, e: env.pluck(60), amp: amp * .5 }));
const chord = (ms, d = 2, amp = 1) => { const o = new Float32Array(Math.round((d + 1) * SR)); ms.forEach((m, i) => add(o, bell(note(m), d, { partials: [[1, 1], [2, .35], [3, .12]], k: 1.4, amp }), i * .05)); return o; };
const pad = (dur, ms, amp = 1) => mixb(...ms.map((m, i) => tone(dur, t => note(m) * (1 + .003 * Math.sin(t * 2 + i)), { type: 'tri', e: env.swell(.8, .8), amp: amp / ms.length })));
const templeBell = (f = 76, amp = 1) => bell(note(f), 4, { partials: [[1, 1], [2.02, .6], [2.76, .45], [4.1, .3], [5.4, .18]], k: 1.1, amp });
// a pour: a stream of liquid onto stone. f (the brightness: water ~3000, honey ~700), rate (how fast it wobbles)
const pourS = (dur, f = 2600, rate = 7, amp = 1) => noise(dur, { lp: t => f + f * .35 * Math.sin(t * rate) + f * .2 * Math.sin(t * rate * 1.9), hp: f * .18, e: env.swell(.25, .5), amp });
// drips falling off the spout into the bowl
const drips = (dur, f = 1200, rate = 3, amp = 1) => { const o = new Float32Array(Math.round(dur * SR)); for (let k = 0; k < dur * rate; k++) add(o, tone(.06, t => f * (1 + 1.2 * t / .06), { e: env.pluck(50), amp }), k / rate + (k * .37 % .2)); return o; };
const POUR = { water: [3000, 8, 1], ghee: [1700, 5, .9], milk: [2200, 6, 1], honey: [800, 2.4, .8], cane: [2000, 6, .95], oil: [1100, 3, .8], ganga: [3400, 9, 1.1] };
const pourAt = (id, t0, t1, g = .12) => { const [f, r, a] = POUR[id]; T.at(t0, pourS(t1 - t0, f, r, a), g, .15); T.at(t0 + 1.4, drips(Math.max(.5, t1 - t0 - 1.4), f * .5, 2.5, .5), g * .5, .4); };
const yes = (amp = 1) => mixb(chime(note(88), amp * .8, 1.6), add(new Float32Array(Math.round(2 * SR)), chime(note(95), amp * .7, 1.4), .09));
const nope = (amp = 1) => mixb(thud(amp), click(amp * .8), tone(.25, t => 180 - 120 * t, { type: 'saw', e: env.pluck(14), amp: amp * .12 }));

// ---- the beds: the sanctum's hum (out for the enemies, back for Ganga), a soft tanpura-like pad from the mantra on
T.at(0, drone(TL.I0 + .6, 55, .7), .07, 0);
T.at(TL.J0 + .5, drone(TL.CARD - TL.J0, 55, .7), .07, 0);
T.at(TL.L0, pad(TL.CARD - TL.L0 + .3, [50, 57, 62], .9), .06, 0);

// ---- A: the hook: a temple bell, milk pouring
T.at(.02, templeBell(76, .8), .2, -.2);
pourAt('milk', 0, TL.B0 + .2, .11);
T.at(TL.GET, chime(note(83), .5, 1.6), .1, .2);
// ---- B: not a splash: a thrown splatter, the stamp
T.at(TL.SPLASH - .3, whoosh(.3, 900, 3200), .14, .3);
T.at(TL.SPLASH - .02, splash(1), .3, .1);
T.at(TL.SPLASH + .05, nope(1), .3, 0);
// ---- C: the stream that never breaks; ✓
pourAt('water', TL.C0 + .1, TL.D0 + .3, .13);
T.at(TL.STREAM + .05, yes(1), .26, .2);
T.at(TL.PURANA - .2, shimmer(1, [note(86), note(90), note(93)], .5, .07), .08, 0);
// ---- D–H: the liquids, each its pour and its drop's chime
const LIQS = [['water', TL.D0, TL.E0, TL.WATER, 88], ['ghee', TL.E0, TL.F0, TL.GHEE, 86], ['milk', TL.F0, TL.G0, TL.MILK, 90], ['honey', TL.G0, TL.H0, TL.HONEY, 83], ['cane', TL.H0, TL.I0, TL.CANE, 85]];
LIQS.forEach(([id, a, b, at, m]) => {
  T.at(a - .25, whoosh(.6, 400, 2200), .1, 0);
  pourAt(id, a + .3, b + .4, .12);
  T.at(at + .05, mixb(pop(.5, 1.1), chime(note(m), .6, 1.6)), .14, -.3);
});
T.at(TL.BRIHASPATI, chime(note(93), .5, 1.6), .08, .3);
T.at(TL.KUBERA, shimmer(.9, [note(93), note(97), note(100)], .5, .06), .08, .2);
// ---- I: enemies: the hum out, a low drum, a dark oil pour
T.at(TL.I0 - .2, whoosh(.7, 300, 1400), .12, 0);
pourAt('oil', TL.I0 + .3, TL.J0 + .3, .1);
T.at(TL.ENEMIES - .05, mixb(drum(42, 1, 1.4), clang(note(49), .4)), .3, 0);
// ---- J–K: only one gives moksha; the light opens; GANGA JAL
T.at(TL.ONE - .1, tone(1.6, note(62), { type: 'tri', e: env.swell(.3, .8), amp: .4 }), .08, 0);
T.at(TL.MOKSHA - .5, shimmer(2.2, [74, 78, 81, 86, 90, 93].map(note), .5, .18), .12, 0);
T.at(TL.GANGA - .3, whoosh(1.0, 3000, 400), .14, 0);
T.at(TL.GANGA + .05, templeBell(64, 1), .28, 0);
T.at(TL.GANGA + .2, conch(2.8, 233, .6), .12, 0);
pourAt('ganga', TL.GANGA + .1, TL.M0 + .3, .12);
// ---- L: the mantra: an om; the counter ticks
T.at(TL.MANTRA - .3, om(3.4, 110, .7), .12, 0);
for (let k = 0; k < 16; k++) T.at(TL.TEN - .1 + k * (TL.TIMES + .3 - TL.TEN) / 16, click(.5), .1, (k % 2 ? .2 : -.2));
T.at(TL.TIMES + .25, templeBell(76, .8), .2, 0);
// ---- M: screenshot: a shutter, the rows popping
T.at(TL.M0 - .2, whoosh(.7, 400, 2600), .16, 0);
T.at(TL.SCREEN + .25, mixb(click(1), noise(.06, { lp: 6000, hp: 1500, e: env.pluck(50), amp: .7 }), click(.6)), .35, 0);
for (let i = 0; i < 7; i++) T.at(TL.SCREEN + .05 + i * .1, pop(.4, 1 + i * .06), .12, 0);
// ---- N: the ask: the six drops pop
T.at(TL.N0 - .2, whoosh(.7, 400, 2600), .14, 0);
for (let i = 0; i < 6; i++) T.at(TL.YOU - .2 + i * .1, plink(note(81 + [0, 2, 4, 7, 9, 12][i]), .7), .12, (i % 3 - 1) * .4);
pourAt('milk', TL.N0, TL.O0 + .3, .08);
// ---- O: next: the aarti bell, the plate going round
T.at(TL.O0 - .2, whoosh(.8, 400, 2600), .16, 0);
T.at(TL.NEXT, chime(note(81), .7, 1.6), .16, 0);
for (let k = 0; TL.AARTI - .2 + k * .6 < TL.CARD - .3; k++) T.at(TL.AARTI - .2 + k * .6, mixb(bell(note(88), .5, { k: 6, amp: .5 }), click(.3)), .1, k % 2 ? .3 : -.3);
T.at(TL.FOLLOW, templeBell(76, .7), .18, 0);

// ---- the card
T.at(TL.CARD - .3, whoosh(.7, 400, 3200), .26, 0);
T.at(TL.CARD + .35, chord([67, 71, 74, 79], 2.2, .7), .22, 0);
for (let k = 0; k < 3; k++) T.at(TL.CARD + .7 + k * .12, pop(.8, 1 + k * .15), .26, (k - 1) * .4);
T.at(TL.CARD + 1.25, pop(.6, .9), .18, 0);
T.at(TL.CARD + 1.65, mixb(pop(1, 1.3), shimmer(.7, [note(91), note(95), note(98)], .6, .06)), .28, 0);
T.at(TL.CARD, pad(TL.END - TL.CARD, [67, 71, 74], .7), .07, 0);

T.write('assets/pour_sfx.wav');
console.log('assets/pour_sfx.wav', TL.END.toFixed(2), 's');
// the mix: the voice at full level over the SFX, normalised to -14 LUFS
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'assets/pour_vo.wav', '-i', 'assets/pour_sfx.wav', '-filter_complex',
  `[1:a]volume=0.85[s];[0:a][s]amix=inputs=2:normalize=0:duration=longest,apad=whole_dur=${TL.END.toFixed(3)},atrim=0:${TL.END.toFixed(3)},loudnorm=I=-14:TP=-1.5:LRA=11[o]`,
  '-map', '[o]', '-ar', '48000', '-ac', '2', 'assets/pour_mix.wav']);
console.log('assets/pour_mix.wav');
