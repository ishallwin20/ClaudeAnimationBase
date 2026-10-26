// aarti_sfx.mjs: the sound effects for "You've been doing AARTI wrong" (src/scenes/aarti.js) → assets/aarti_sfx.wav,
// then the mix with the voice → assets/aarti_mix.wav. Times come from the voice and the timeline (src/scenes/aarti_vo.js
// + aarti_tl.js, loaded with vm), so they follow the picture.
// A sanctum's hush (a low drone, the lamps' soft crackle); the hand bell rung all through the aarti, as it is in a
// temple, and a chime as each circle closes, one step higher each time, so the count can be heard; the scribble a
// jangle; the wicks catching one by one; the twist a drop to silence; the verse a conch; the parent line and the ask;
// the card.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, plink, click, shimmer, drone, note, seed, chime, drum, conch, crackle, rnd, SR } from './sfx.mjs';

const TL = runInNewContext(readFileSync('src/scenes/aarti_vo.js', 'utf8') + '\n' + readFileSync('src/scenes/aarti_tl.js', 'utf8') + '\n;TL');
const T = track(TL.END);
seed(54);
const add = (o, b, s0, g = 1) => { const s = Math.round(s0 * SR); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j] * g; return o; };
const pop = (amp = 1, f = 1) => mixb(click(amp), tone(.07, t => f * (500 + 2600 * t / .07), { e: env.pluck(40), amp: amp * .7 }), noise(.05, { lp: 2500, hp: 300, e: env.pluck(60), amp: amp * .5 }));
const chord = (ms, d = 2, amp = 1) => { const o = new Float32Array(Math.round((d + 1) * SR)); ms.forEach((m, i) => add(o, bell(note(m), d, { partials: [[1, 1], [2, .35], [3, .12]], k: 1.4, amp }), i * .05)); return o; };
const pad = (dur, ms, amp = 1) => mixb(...ms.map((m, i) => tone(dur, t => note(m) * (1 + .003 * Math.sin(t * 2 + i)), { type: 'tri', e: env.swell(.8, .8), amp: amp / ms.length })));
// the hand bell (ghanti): a bright small bell struck back and forth, about eight strokes a second
const ghantiStroke = (amp = 1) => bell(note(98) * (1 + .004 * (rnd() - .5)), .5, { partials: [[1, 1], [2.4, .5], [3.9, .3], [6.1, .15]], k: 5, amp });
const ghanti = (t0, t1, amp = 1, rate = 7.5) => { for (let t = t0, i = 0; t < t1; t += 1 / rate, i++) T.at(t + .012 * Math.sin(i * 2.3), ghantiStroke(amp * (i % 2 ? .8 : 1)), .07, i % 2 ? .35 : .25); };
const templeBell = (f = 74, amp = 1) => bell(note(f), 4, { partials: [[1, 1], [2.02, .6], [2.76, .45], [4.1, .3], [5.4, .18]], k: 1.1, amp });
const PARTS_N = { feet: 4, navel: 2, face: 3, whole: 7 };   // the circles (as PARTS in aarti_props.js)
const SCALE = [74, 76, 78, 81, 83, 86, 88];   // the circles' chimes: D major pentatonic, climbing
const circles = (id, n, pan = 0) => { const [t0, d] = TL[id]; for (let k = 0; k < n; k++) T.at(t0 + (k + 1) * d - .04, chime(note(SCALE[k]), .8, 1.6), .2, pan); };
const whooshAt = (t, amp = .2) => T.at(t - .3, whoosh(.7, 400, 2600), amp, 0);

// ---- the bed: the sanctum's hush and the lamps
T.at(0, drone(TL.CARD + .3, 65.4, .9), .1, 0);
T.at(0, crackle(TL.CARD, .4), .03, .2);

// ---- A: the hook: a temple bell, the lamp's shimmer
T.at(.05, templeBell(74, .8), .22, -.2);
T.at(.05, shimmer(1.2, [note(81), note(86), note(90), note(93)], .5, .08), .1, 0);

// ---- B: round and round: the bell rung any old way, a jangle
whooshAt(TL.B0);
ghanti(TL.B0 + .3, TL.C0 + .2, .8, 9.5);
T.at(TL.ROUND, plink(note(70), .6), .12, 0);
// ---- C: a path, a number for each part
whooshAt(TL.C0);
T.at(TL.PATH, chord([62, 66, 69, 74], 1.8, .6), .14, 0);
for (let i = 0; i < 4; i++) T.at(TL.NUMBER - .1 + i * .14, plink(note(81 + [0, 3, 5, 7][i]), .6), .14, (i - 1.5) * .3);

// ---- D–G: the circles, the bell under them
[['feet', TL.D0], ['navel', TL.E0], ['face', TL.F0], ['whole', TL.G0]].forEach(([id, a]) => {
  whooshAt(a, .14);
  const [t0, d] = TL[id], n = PARTS_N[id];
  ghanti(t0, t0 + n * d, .7);
  circles(id, n);
});
// ---- H: the flame: the wicks catch, one by one
whooshAt(TL.H0);
for (let i = 0; i < 5; i++) { const t = lerpT(TL.FLAME - .2, TL.ODD - .1, (i + 1) / 5); T.at(t, mixb(noise(.25, { hp: 600, lp: 4000, e: env.swell(.01, .2), amp: .8 }), tone(.3, 180, { e: env.pluck(10), amp: .4 })), .16, (i - 2) * .25); }
for (let i = 0; i < 3; i++) T.at(TL.ODD + i * .16, pop(.7, 1 + i * .15), .22, (i - 1) * .4);

// ---- I: forgot the mantras? the wrong bell again, then it stops
whooshAt(TL.I0);
ghanti(TL.I0 + .5, TL.WRONG + .2, .6, 9.5);
T.at(TL.WRONG + .25, drum(55, .9, .8), .2, 0);

// ---- J: the Skanda Purana: a conch; COMPLETE: every circle lights, a chord, the temple bell
T.at(TL.SKANDA - .3, conch(2.6, 233, .6), .12, 0);
T.at(TL.SHIVA, shimmer(1.6, [note(86), note(90), note(93), note(98)], .6, .07), .1, 0);
for (let k = 0; k < 16; k++) T.at(TL.COMPLETE - .3 + k * .03, plink(note(86 + (k % 5) * 2), .4), .06, (k % 3 - 1) * .4);
T.at(TL.COMPLETE, chord([62, 66, 69, 74, 78], 2.6, .8), .2, 0);
T.at(TL.COMPLETE + .05, templeBell(74, 1), .22, 0);
ghanti(TL.COMPLETE + .2, TL.K0 + 1, .45);

// ---- K: count with your child: 4, 2, 3, 7, a chime on each
whooshAt(TL.K0, .14);
[TL.N4, TL.N2, TL.N3, TL.N7].forEach((t, i) => T.at(t - .05, chime(note([74, 78, 81, 86][i]), .9, 1.5), .2, (i - 1.5) * .3));
// ---- L: the ask: once, or three times?
whooshAt(TL.L0, .14);
T.at(TL.L0, pad(TL.CARD - TL.L0, [62, 66, 69], .9), .1, 0);
T.at(TL.ONCE - .1, mixb(plink(note(86)), click(.6)), .22, -.3);
T.at(TL.C3 - .1, mixb(plink(note(93)), click(.6)), .22, .3);

// ---- the card
T.at(TL.CARD - .3, whoosh(.7, 400, 3200), .3, 0);
T.at(TL.CAP_T, chord([67, 71, 74, 79], 2.2, .7), .25, 0);
for (let k = 0; k < 3; k++) T.at(TL.COVERS + k * .12, pop(.8, 1 + k * .15), .3, (k - 1) * .4);
T.at(TL.PRICE, pop(.6, .9), .2, 0);
T.at(TL.PILL, mixb(pop(1, 1.3), shimmer(.7, [note(91), note(95), note(98)], .6, .06)), .32, 0);
T.at(TL.CARD, pad(TL.END - TL.CARD, [67, 71, 74], .7), .08, 0);

T.write('assets/aarti_sfx.wav');
console.log('assets/aarti_sfx.wav', TL.END.toFixed(2), 's');
// the mix: the voice at full level over the SFX, normalised to -14 LUFS
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'assets/aarti_vo.wav', '-i', 'assets/aarti_sfx.wav', '-filter_complex',
  `[1:a]volume=0.85[s];[0:a][s]amix=inputs=2:normalize=0:duration=longest,apad=whole_dur=${TL.END.toFixed(3)},atrim=0:${TL.END.toFixed(3)},loudnorm=I=-14:TP=-1.5:LRA=11[o]`,
  '-map', '[o]', '-ar', '48000', '-ac', '2', 'assets/aarti_mix.wav']);
console.log('assets/aarti_mix.wav');

function lerpT(a, b, k) { return a + (b - a) * k; }
