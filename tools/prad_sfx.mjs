// prad_sfx.mjs: the sound effects for "Why do Hindus walk around a temple CLOCKWISE?" (src/scenes/prad.js) →
// assets/prad_sfx.wav, then the mix with the voice → assets/prad_mix.wav. Times come from the voice and the timeline
// (src/scenes/prad_vo.js + prad_tl.js, loaded with vm), so they follow the picture.
// A dusk bed under it all (crickets, a low tanpura-like drone), a day bed with birds for the sun; bare feet on stone
// on the walks; the trails as rising shimmers; the water (drips in the sanctum, the pour from the pranala, the
// channel); the stop, the temple bell, the card.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, plink, clang, click, thud, shimmer, slide, drone, note, seed, chime, drum, chirp, om, SR } from './sfx.mjs';

const TL = runInNewContext(readFileSync('src/scenes/prad_vo.js', 'utf8') + '\n' + readFileSync('src/scenes/prad_tl.js', 'utf8') + '\n;TL');
const T = track(TL.END);
seed(31);
const add = (o, b, s0, g = 1) => { const s = Math.round(s0 * SR); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j] * g; return o; };
const pop = (amp = 1, f = 1) => mixb(click(amp), tone(.07, t => f * (500 + 2600 * t / .07), { e: env.pluck(40), amp: amp * .7 }), noise(.05, { lp: 2500, hp: 300, e: env.pluck(60), amp: amp * .5 }));
const chord = (ms, d = 2, amp = 1) => { const o = new Float32Array(Math.round((d + 1) * SR)); ms.forEach((m, i) => add(o, bell(note(m), d, { partials: [[1, 1], [2, .35], [3, .12]], k: 1.4, amp }), i * .05)); return o; };
const pad = (dur, ms, amp = 1) => mixb(...ms.map((m, i) => tone(dur, t => note(m) * (1 + .003 * Math.sin(t * 2 + i)), { type: 'tri', e: env.swell(.8, .8), amp: amp / ms.length })));
// a bare foot on stone: a soft low knock and a brush of grit
const step = (amp = 1) => mixb(tone(.09, t => 95 - t * 300, { e: env.pluck(30), amp }), noise(.07, { lp: 1800, hp: 250, e: env.pluck(45), amp: amp * .45 }));
// crickets: pulsed chirps, two of them
const crickets = (dur, amp = 1) => { const o = new Float32Array(Math.round(dur * SR)); for (const [f, rate, ph] of [[4300, 3.1, 0], [4700, 2.6, .4]]) for (let k = 0; k < dur * rate; k++) { const t0 = k / rate + ph; for (let j = 0; j < 3; j++) add(o, tone(.03, f, { e: env.hann(), amp: amp * .5 }), t0 + j * .045); } return o; };
const trickle = (dur, amp = 1) => noise(dur, { lp: t => 2600 + 900 * Math.sin(t * 7) + 500 * Math.sin(t * 13), hp: 500, e: env.swell(.3, .4), amp });
const drip = (amp = 1) => mixb(tone(.12, t => 900 + 1400 * t / .12, { e: env.pluck(35), amp }), tone(.05, 2400, { e: env.pluck(80), amp: amp * .3 }));
const templeBell = (amp = 1) => bell(note(76), 4, { partials: [[1, 1], [2.02, .6], [2.76, .45], [4.1, .3], [5.4, .18]], k: 1.1, amp });
const steps = (t0, t1, every = .48, amp = .9) => { for (let t = t0, i = 0; t < t1; t += every, i++) T.at(t, step(amp * (.85 + .15 * (i % 2))), .3, i % 2 ? .25 : -.25); };

// ---- the bed: dusk all through, except the sun's day
T.at(0, drone(TL.D0 + .3, 65.4, .9), .1, 0);
T.at(0, crickets(TL.D0 + .3, 1), .05, .3);
T.at(TL.E0 - .2, drone(TL.CARD - TL.E0 + .2, 65.4, .9), .1, 0);
T.at(TL.E0 - .2, crickets(TL.CARD - TL.E0 + .2, 1), .05, .3);

// ---- A: the hook
T.at(.1, templeBell(.8), .22, -.2);
steps(.3, TL.B0, .52, .7);

// ---- B: the map, the footprints round
T.at(TL.B0 - .3, whoosh(.7, 400, 2600), .25, 0);
for (let k = 0; k < 10; k++) T.at(TL.B0 + .3 + k * (TL.RIGHTW - TL.B0 - .1) / 10, plink(note(79 + [0, 2, 4, 7, 9, 12, 14, 16, 19, 21][k]), .6), .12, Math.sin(k * .63) * .6);
T.at(TL.PRAD, chord([67, 71, 74], 1.6, .6), .14, 0);
T.at(TL.RIGHTW, chime(note(86), .7, 1.6), .16, .5);

// ---- C: the walk past the shrine
steps(TL.C0 + .1, TL.D0 + .2);
T.at(TL.RSIDE, chord([72, 76, 79], 1.4, .5), .12, .4);

// ---- D: the sun
T.at(TL.D0 - .3, whoosh(.8, 300, 3800), .25, 0);
T.at(TL.D0, pad(TL.E0 - TL.D0 + .3, [72, 79, 84], .8), .12, 0);
for (let k = 0; k < 12; k++) T.at(TL.D0 + .3 + k * .38 + (k % 3) * .07, chirp(.7), .05, (k % 2 ? .6 : -.6));
T.at(TL.EAST, chime(note(84), .7, 1.6), .2, -.6);
T.at(TL.SOUTH, chime(note(88), .7, 1.6), .2, 0);
T.at(TL.WEST, chime(note(91), .7, 1.6), .2, .6);
T.at(TL.SUNW, shimmer(1.2, [note(91), note(95), note(98), note(103)], .7, .08), .2, 0);

// ---- E: the twist: walking, then the stop
T.at(TL.E0 - .3, whoosh(.6, 2000, 400), .2, 0);
steps(TL.E0 + .1, TL.NEVER - .2);
T.at(TL.NEVER, mixb(drum(55, 1, 1.2), clang(note(62), .5)), .3, 0);

// ---- F: the water: drips in the sanctum, the pour outside
for (let k = 0; k < 9; k++) T.at(TL.F0 + .2 + k * .3, drip(.7), .14, .1);
T.at(TL.F0, trickle(TL.F2 - TL.F0 + .3, .6), .08, 0);
T.at(TL.F2, trickle(TL.G0 - TL.F2 + .5, 1), .16, 0);
T.at(TL.SOMA, chord([74, 78, 81], 1.8, .6), .14, 0);

// ---- G: tirtha, the edge
T.at(TL.G0, trickle(TL.H0 - TL.G0 + .3, 1), .2, .2);
steps(TL.G0 + .15, TL.STEP - .3, .5, .9);
T.at(TL.TIRTHA, shimmer(1.0, [note(86), note(90), note(93)], .6, .08), .14, 0);
T.at(TL.STEP, mixb(thud(.7), slide(.4, 500, 260, .4)), .3, 0);

// ---- H: round to it, back the other way
T.at(TL.H0 - .3, whoosh(.6, 400, 2600), .22, 0);
for (let k = 0; k < 8; k++) T.at(TL.H0 + .25 + k * (TL.REACH - TL.H0) / 8, plink(note(76 + k * 2), .6), .12, -.5 + k * .14);
T.at(TL.REACH + .3, click(.7), .25, 0);
T.at(TL.TURN, slide(.35, 900, 500, .5), .14, 0);
for (let k = 0; k < 8; k++) T.at(TL.TURN + .1 + k * (TL.OTHER + .5 - TL.TURN) / 8, plink(note(91 - k * 2), .6), .12, .5 - k * .14);
T.at(TL.OTHER + .55, click(.7), .25, 0);

// ---- I: the Shiva Rahasya
T.at(TL.I0, om(TL.J0 - TL.I0, 110, .6), .1, 0);
T.at(TL.I0 + .5, chime(note(81), .7, 2.5), .16, 0);
T.at(TL.SOMA2, chord([69, 73, 76], 1.8, .6), .12, 0);

// ---- J: the bell
for (const dt of [-.5, .6, 1.7]) T.at(TL.CHILD + dt, templeBell(1), .3, .2);

// ---- K: the ask
T.at(TL.K0 - .3, whoosh(.6, 400, 3000), .22, 0);
T.at(TL.K0, pad(TL.CARD - TL.K0, [65, 69, 72], .9), .12, 0);
for (let k = 0; k < 4; k++) T.at(TL.K0 + .3 + k * .8, drum(90, .6, .3), .08, 0);
T.at(TL.YES, mixb(plink(note(96)), click(.6)), .3, 0);

// ---- L: the card
T.at(TL.CARD - .3, whoosh(.7, 400, 3200), .3, 0);
T.at(TL.CAP_T, chord([67, 71, 74, 79], 2.2, .7), .25, 0);
for (let k = 0; k < 3; k++) T.at(TL.COVERS + k * .12, pop(.8, 1 + k * .15), .3, (k - 1) * .4);
T.at(TL.PRICE, pop(.6, .9), .2, 0);
T.at(TL.STRIKE, mixb(noise(.28, { lp: 4200, hp: 900, e: env.hann(), amp: .8 }), clang(note(88), .5)), .3, 0);
T.at(TL.DEAD, plink(note(91)), .2, 0);
T.at(TL.PILL, mixb(pop(1, 1.3), shimmer(.7, [note(91), note(95), note(98)], .6, .06)), .32, 0);
T.at(TL.CARD, pad(TL.END - TL.CARD, [67, 71, 74], .7), .08, 0);

T.write('assets/prad_sfx.wav');
console.log('assets/prad_sfx.wav', TL.END.toFixed(2), 's');
// the mix: the voice at full level over the SFX, normalised to -14 LUFS
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'assets/prad_vo.wav', '-i', 'assets/prad_sfx.wav', '-filter_complex',
  `[1:a]volume=0.85[s];[0:a][s]amix=inputs=2:normalize=0:duration=longest,apad=whole_dur=${TL.END.toFixed(3)},atrim=0:${TL.END.toFixed(3)},loudnorm=I=-14:TP=-1.5:LRA=11[o]`,
  '-map', '[o]', '-ar', '48000', '-ac', '2', 'assets/prad_mix.wav']);
console.log('assets/prad_mix.wav');
