// rounds3_sfx.mjs: the sound effects for "How many times should you walk around HANUMAN?" (src/scenes/rounds3.js) →
// assets/rounds3_sfx.wav, then the mix with the voice → assets/rounds3_mix.wav. Times come from the voice and the
// timeline (src/scenes/rounds3_vo.js + rounds3_tl.js, loaded with vm), so they follow the picture.
// Part 2's dusk bed (crickets, a low drone); bare feet on stone while the rings land, and a chime as each round closes,
// one step higher each time, so the count can be heard (Hanuman's eight more, after "eleven", climb faster); each god's
// emblem a shimmer; the twist a drum; the verse a conch; the custom and the priest the temple bell; the screenshot a
// shutter; the ask; Part 4; the card.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, plink, clang, click, shimmer, drone, note, seed, chime, drum, om, conch, SR } from './sfx.mjs';

const TL = runInNewContext(readFileSync('src/scenes/rounds3_vo.js', 'utf8') + '\n' + readFileSync('src/scenes/rounds3_tl.js', 'utf8') + '\n;TL');
const T = track(TL.END);
seed(65);
const add = (o, b, s0, g = 1) => { const s = Math.round(s0 * SR); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j] * g; return o; };
const pop = (amp = 1, f = 1) => mixb(click(amp), tone(.07, t => f * (500 + 2600 * t / .07), { e: env.pluck(40), amp: amp * .7 }), noise(.05, { lp: 2500, hp: 300, e: env.pluck(60), amp: amp * .5 }));
const chord = (ms, d = 2, amp = 1) => { const o = new Float32Array(Math.round((d + 1) * SR)); ms.forEach((m, i) => add(o, bell(note(m), d, { partials: [[1, 1], [2, .35], [3, .12]], k: 1.4, amp }), i * .05)); return o; };
const pad = (dur, ms, amp = 1) => mixb(...ms.map((m, i) => tone(dur, t => note(m) * (1 + .003 * Math.sin(t * 2 + i)), { type: 'tri', e: env.swell(.8, .8), amp: amp / ms.length })));
const step = (amp = 1) => mixb(tone(.09, t => 95 - t * 300, { e: env.pluck(30), amp }), noise(.07, { lp: 1800, hp: 250, e: env.pluck(45), amp: amp * .45 }));
const crickets = (dur, amp = 1) => { const o = new Float32Array(Math.round(dur * SR)); for (const [f, rate, ph] of [[4300, 3.1, 0], [4700, 2.6, .4]]) for (let k = 0; k < dur * rate; k++) { const t0 = k / rate + ph; for (let j = 0; j < 3; j++) add(o, tone(.03, f, { e: env.hann(), amp: amp * .5 }), t0 + j * .045); } return o; };
const trickle = (dur, amp = 1) => noise(dur, { lp: t => 2600 + 900 * Math.sin(t * 7) + 500 * Math.sin(t * 13), hp: 500, e: env.swell(.3, .4), amp });
const templeBell = (f = 76, amp = 1) => bell(note(f), 4, { partials: [[1, 1], [2.02, .6], [2.76, .45], [4.1, .3], [5.4, .18]], k: 1.1, amp });
const steps = (t0, t1, every = .2, amp = .6) => { for (let t = t0, i = 0; t < t1; t += every, i++) T.at(t, step(amp * (.85 + .15 * (i % 2))), .22, i % 2 ? .25 : -.25); };
const SCALE = [74, 76, 78, 81, 83, 86, 88, 90, 93, 95, 98];   // the rounds' chimes: D major pentatonic, climbing
// a god's rounds: feet while they land, a chime as each one closes
const rounds = ([t0, d], n, pan = 0) => { steps(t0 + .05, t0 + n * d - .1, Math.min(.2, d / 4)); for (let k = 0; k < n; k++) T.at(t0 + (k + 1) * d - .04, chime(note(SCALE[k]), .8, 1.8), .2, pan); };

// ---- the bed: dusk all through
T.at(0, drone(TL.CARD + .3, 65.4, .9), .1, 0);
T.at(0, crickets(TL.CARD + .3, 1), .05, .3);

// ---- A: the hook
T.at(.1, templeBell(76, .8), .22, -.2);
T.at(.05, shimmer(1.2, [note(81), note(86), note(90), note(93)], .5, .08), .1, 0);
// ---- B: four more gods: the question marks
T.at(TL.B0 - .3, whoosh(.7, 400, 2600), .25, 0);
for (let i = 0; i < 4; i++) T.at(TL.FOUR_MORE - .2 + i * .16, plink(note(81 + [0, 3, 5, 7][i]), .6), .14, (i - 1.5) * .3);
T.at(TL.FOUR_MORE + .5, chord([62, 66, 69, 74], 1.8, .6), .14, 0);

// ---- C–F: each god's rounds
[[TL.C0, TL.KRISHNA, TL.ringsC, 4], [TL.D0, TL.MURUGAN, TL.ringsD, 6], [TL.E0, TL.NAVA, TL.ringsE, 9]].forEach(([a, name, r, n], i) => {
  T.at(a - .3, whoosh(.7, 400, 2800), .22, 0);
  T.at(name - .1, shimmer(1.2, [note(86), note(90), note(93), note(98)], .6, .07), .14, (i % 2 ? .3 : -.3));
  rounds(r, n, 0);
});
// Hanuman: three, then (on "eleven") eight more, quicker, a step higher each
T.at(TL.F0 - .3, whoosh(.7, 400, 2800), .22, 0);
T.at(TL.HANUMAN - .1, shimmer(1.2, [note(86), note(90), note(93), note(98)], .6, .07), .14, .3);
rounds(TL.ringsF, 3, 0);
T.at(TL.ELEVEN - .1, drum(55, .9, .8), .2, 0);
steps(TL.ringsF2[0] + .05, TL.ringsF2[0] + 8 * TL.ringsF2[1] - .1, .12, .55);
for (let k = 0; k < 8; k++) T.at(TL.ringsF2[0] + (k + 1) * TL.ringsF2[1] - .04, chime(note(SCALE[3 + k]), .8, 1.4), .18, 0);

// ---- G: only ONE is in a Purana
T.at(TL.G0 - .3, whoosh(.8, 300, 2400), .22, 0);
for (let i = 0; i < 4; i++) T.at(TL.ONE + i * .22, plink(note(86 + i * 2), .5), .1, (i - 1.5) * .3);
T.at(TL.PURANA - .05, mixb(drum(52, 1, 1.1), clang(note(62), .5)), .3, 0);
// ---- H: Krishna's four: the verse
T.at(TL.H0 - .2, whoosh(.7, 400, 2600), .2, 0);
T.at(TL.KV + .3, conch(2.6, 233, .6), .12, 0);
T.at(TL.NARASIMHA, chord([62, 69, 74, 78], 2.4, .7), .18, 0);
// ---- I: Murugan's six: no known source
T.at(TL.I0 - .2, whoosh(.7, 400, 2600), .2, 0);
T.at(TL.SOUTH, pop(.6, .9), .2, 0);
T.at(TL.NOSRC, mixb(plink(note(79), .6), plink(note(74), .5)), .16, 0);
// ---- J, K: temple custom; follow your temple's priest (the bell)
T.at(TL.J0 - .2, whoosh(.7, 400, 2600), .2, 0);
T.at(TL.CUSTOM, pop(.7, 1), .22, -.3); T.at(TL.CUSTOM + .15, pop(.7, 1.1), .22, -.3);
T.at(TL.K0 - .2, whoosh(.6, 500, 2200), .16, 0);
T.at(TL.PRIEST - .5, templeBell(74, 1), .26, 0);
// ---- L: screenshot this: a shutter
T.at(TL.L0 - .2, whoosh(.7, 400, 2600), .2, 0);
T.at(TL.SCREEN + .25, mixb(click(1), noise(.06, { lp: 6000, hp: 1500, e: env.pluck(50), amp: .7 }), click(.6)), .35, 0);
for (let i = 0; i < 4; i++) T.at(TL.SCREEN + .3 + i * .12, pop(.5, 1 + i * .1), .16, 0);
// ---- M: the ask
T.at(TL.M0 - .2, whoosh(.7, 400, 2600), .16, 0);
T.at(TL.M0, pad(TL.N0 - TL.M0 + .3, [62, 66, 69], .9), .1, 0);
T.at(TL.ASK3, mixb(plink(note(86)), click(.6)), .22, -.3);
T.at(TL.ASK11, mixb(plink(note(93)), click(.6)), .22, .3);
// ---- N: Part 4
T.at(TL.N0 - .2, whoosh(.8, 400, 2600), .18, 0);
T.at(TL.PART4, chime(note(81), .7, 1.6), .16, 0);
['SHANI', 'LAKSHMI', 'AYYAPPA'].forEach((n, i) => T.at(TL[n], pop(.8, 1 + i * .15), .26, (i - 1) * .3));
T.at(TL.FOLLOW, templeBell(76, .7), .18, 0);

// ---- the card
T.at(TL.CARD - .3, whoosh(.7, 400, 3200), .3, 0);
T.at(TL.CAP_T, chord([67, 71, 74, 79], 2.2, .7), .25, 0);
for (let k = 0; k < 3; k++) T.at(TL.COVERS + k * .12, pop(.8, 1 + k * .15), .3, (k - 1) * .4);
T.at(TL.PRICE, pop(.6, .9), .2, 0);
T.at(TL.PILL, mixb(pop(1, 1.3), shimmer(.7, [note(91), note(95), note(98)], .6, .06)), .32, 0);
T.at(TL.CARD, pad(TL.END - TL.CARD, [67, 71, 74], .7), .08, 0);

T.write('assets/rounds3_sfx.wav');
console.log('assets/rounds3_sfx.wav', TL.END.toFixed(2), 's');
// the mix: the voice at full level over the SFX, normalised to -14 LUFS
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'assets/rounds3_vo.wav', '-i', 'assets/rounds3_sfx.wav', '-filter_complex',
  `[1:a]volume=0.85[s];[0:a][s]amix=inputs=2:normalize=0:duration=longest,apad=whole_dur=${TL.END.toFixed(3)},atrim=0:${TL.END.toFixed(3)},loudnorm=I=-14:TP=-1.5:LRA=11[o]`,
  '-map', '[o]', '-ar', '48000', '-ac', '2', 'assets/rounds3_mix.wav']);
console.log('assets/rounds3_mix.wav');
