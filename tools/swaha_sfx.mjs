// swaha_sfx.mjs: the sound effects for "Every time you say SWAHA, you're calling a GODDESS." (src/scenes/swaha.js) →
// assets/swaha_sfx.wav, then the mix with the voice → assets/swaha_mix.wav. Times come from the voice and the timeline
// (src/scenes/swaha_vo.js + swaha_tl.js, loaded with vm), so they follow the picture.
// The fire's crackle under everything and a low om; each offering a hiss of ghee and the fire's whoomp; the Vedic
// letters a temple bell; the hungry gods a hollow drone and the night's wind, the failed offerings a dead fizz; Svaha a
// conch, a shimmer and an om; the offering that reaches the gods a rising shimmer and a chord; the tarpan water, the
// dakshina coins; three chimes for the three names; the ask; the card.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, plink, clang, click, shimmer, slide, drone, note, seed, chime, drum, om, rumble, conch, fire, wind, crackle, SR } from './sfx.mjs';

const TL = runInNewContext(readFileSync('src/scenes/swaha_vo.js', 'utf8') + '\n' + readFileSync('src/scenes/swaha_tl.js', 'utf8') + '\n;TL');
const T = track(TL.END);
seed(49);
const add = (o, b, s0, g = 1) => { const s = Math.round(s0 * SR); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j] * g; return o; };
const pop = (amp = 1, f = 1) => mixb(click(amp), tone(.07, t => f * (500 + 2600 * t / .07), { e: env.pluck(40), amp: amp * .7 }), noise(.05, { lp: 2500, hp: 300, e: env.pluck(60), amp: amp * .5 }));
const chord = (ms, d = 2, amp = 1) => { const o = new Float32Array(Math.round((d + 1) * SR)); ms.forEach((m, i) => add(o, bell(note(m), d, { partials: [[1, 1], [2, .35], [3, .12]], k: 1.4, amp }), i * .05)); return o; };
const pad = (dur, ms, amp = 1) => mixb(...ms.map((m, i) => tone(dur, t => note(m) * (1 + .003 * Math.sin(t * 2 + i)), { type: 'tri', e: env.swell(.8, .8), amp: amp / ms.length })));
const templeBell = (f = 76, amp = 1) => bell(note(f), 4, { partials: [[1, 1], [2.02, .6], [2.76, .45], [4.1, .3], [5.4, .18]], k: 1.1, amp });
// ghee on the fire: a hiss and sizzle, then the flames' whoomp
const sizzle = (amp = 1) => mixb(noise(.9, { hp: 2500, lp: 9000, e: env.swell(.02, .6), amp: amp * .7 }), crackle(.8, amp * .6));
const whoomp = (amp = 1) => mixb(noise(.9, { lp: t => 300 + 1600 * Math.exp(-t * 3), hp: 40, e: env.swell(.03, .7), amp }), tone(.6, t => 70 + 50 * Math.exp(-t * 5), { e: env.pluck(4), amp: amp * .6 }));
const fizz = (amp = 1) => mixb(noise(.7, { hp: 1800, lp: 5000, e: env.swell(.02, .5), amp: amp * .6 }), noise(.8, { lp: 500, hp: 60, e: env.swell(.05, .6), amp: amp * .4 }));
const water = (dur, amp = 1) => mixb(noise(dur, { hp: 600, lp: t => 2600 + 900 * Math.sin(t * 13), e: env.swell(.15, .3), amp: amp * .6 }), noise(dur, { hp: 200, lp: 900, e: env.swell(.15, .3), amp: amp * .3 }));
const coin = (f, amp = 1) => bell(f, .9, { partials: [[1, 1], [2.7, .6], [5.1, .35], [8.2, .2]], k: 6, amp });

// ---- the bed: the fire's crackle all through (quieter on the far shots), a low om under the story
T.at(0, fire(TL.CARD, .5, .7), .2, 0);
for (let t0 = .3; t0 < TL.CARD - 1; t0 += .9 + (t0 * 7 % 1) * .8) T.at(t0, crackle(.25, .6), .05, ((t0 * 13) % 2 - 1) * .4);
T.at(0, om(TL.E0 + .4, 110, .5), .07, 0);
T.at(TL.F0 - .3, om(TL.J0 - TL.F0 + .6, 110, .6), .08, 0);
T.at(TL.M0 - .3, om(TL.CARD - TL.M0 + .3, 110, .5), .07, 0);

// ---- the offerings
TL.POURS.forEach((t0, i) => { T.at(t0 - .25, sizzle(1), .16, .15); T.at(t0, whoomp(1), i ? .32 : .38, 0); });
TL.FAILS.forEach(t0 => { T.at(t0 - .25, sizzle(.6), .12, .15); T.at(t0, fizz(1), .25, 0); });

// ---- A: the hook
T.at(TL.GODDESS0, mixb(chime(note(81), .7, 2.4), shimmer(1, [note(86), note(90), note(93)], .5, .07)), .16, 0);
// ---- B: havan, wedding, griha pravesh: a bell on each
[TL.HAVAN, TL.WEDDING, TL.GRIHA].forEach((t0, i) => T.at(t0 + .05, templeBell(72 + [0, 2, 4][i], .7), .12, (i - 1) * .4));
// ---- C: the Vedas
T.at(TL.VEDAS, conch(2.4, 233, .6), .12, 0);
T.at(TL.AGNAYE, templeBell(69, 1), .22, 0);
// ---- D: the Devi Bhagavatam; NAME
T.at(TL.DEVIB, chime(note(74), .6, 2), .14, 0);
T.at(TL.NAME - .1, mixb(drum(52, .8, 1), shimmer(1.6, [note(86), note(90), note(93), note(98)], .7, .06)), .26, 0);
// ---- E: the gods went hungry: a hollow drone, the wind high up
T.at(TL.E0, drone(TL.F0 - TL.E0 + .6, 46, .9), .14, 0);
T.at(TL.GODS0 - .9, wind(TL.F0 - TL.GODS0 + 1.4, 1.1, .8), .2, 0);
T.at(TL.GODS0, mixb(drum(44, 1, 1.4), rumble(1.6, .6)), .2, 0);
// ---- F, G: Svaha appears; Agni's power to burn
T.at(TL.BRAHMA, chime(note(67), .6, 2), .12, -.3);
T.at(TL.DEVI, slide(1.8, 220, 660, .5), .08, 0);
T.at(TL.GODDESS - .4, mixb(whoosh(1.2, 300, 3800), shimmer(1.4, [note(81), note(85), note(88), note(93)], .6, .1)), .22, 0);
T.at(TL.SWAHA3 - .05, mixb(conch(3.2, 311, .8), chord([62, 66, 69, 74], 3, .7), om(3.5, 110, .7)), .3, 0);
T.at(TL.BURN - .15, whoomp(1.4), .4, 0);
T.at(TL.WIFE, mixb(chime(note(86), .6, 2.4), chime(note(90), .5, 2.4)), .14, 0);
// ---- H: her name, and it reaches the gods
T.at(TL.POURS[6] + .2, mixb(slide(1.6, 330, 1320, .5), whoosh(1.6, 400, 5200)), .18, 0);
T.at(TL.REACH, shimmer(1.4, [note(86), note(90), note(93), note(98), note(102)], .6, .1), .2, 0);
T.at(TL.GODS - .05, mixb(chord([62, 69, 74, 78, 81], 3, .8), templeBell(62, .7)), .32, 0);
// ---- I: a mantra without her: a snake without poison
T.at(TL.SNAKE, noise(.9, { hp: 3000, lp: 9000, e: env.swell(.05, .6), amp: .5 }), .14, .3);
T.at(TL.POISON, drum(48, .7, 1), .14, 0);
// ---- J, K, L: Svadha's water, Dakshina's coins, the three names
T.at(TL.J0 - .2, whoosh(.7, 400, 2600), .18, 0);
T.at(TL.ALONE, water(TL.K0 - TL.ALONE + .3, 1), .2, 0);
T.at(TL.SWADHA, mixb(templeBell(67, .8), chime(note(79), .5, 2)), .2, -.2);
T.at(TL.K0 - .2, whoosh(.6, 400, 2600), .16, 0);
[0, .12, .2, .34, .5].forEach((d, i) => T.at(TL.DAKSHINA - .3 + d, coin(note(96 + (i * 5) % 7), .6), .12, (i % 2 - .5) * .6));
T.at(TL.DAKSHINA, mixb(templeBell(71, .8), chime(note(83), .5, 2)), .2, .2);
[TL.L0 + .1, TL.L0 + .3, TL.L0 + .5].forEach((t0, i) => T.at(t0, chime(note([74, 78, 81][i]), .6, 2), .16, (i - 1) * .5));
T.at(TL.BOTH + .6, chord([62, 66, 69, 74], 2.4, .6), .16, 0);
// ---- M, N: the child; the ask
T.at(TL.M0 - .2, whoosh(.7, 400, 2600), .16, 0);
T.at(TL.M0, pad(TL.CARD - TL.M0, [62, 66, 69], .9), .1, 0);
T.at(TL.CHILD, chime(note(86), .5, 2), .12, 0);
T.at(TL.SWAHA4, templeBell(74, .8), .18, 0);
T.at(TL.NO, mixb(plink(note(96)), click(.6)), .22, 0);

// ---- the card
T.at(TL.CARD - .3, whoosh(.7, 400, 3200), .3, 0);
T.at(TL.CAP_T, chord([67, 71, 74, 79], 2.2, .7), .25, 0);
for (let k = 0; k < 3; k++) T.at(TL.COVERS + k * .12, pop(.8, 1 + k * .15), .3, (k - 1) * .4);
T.at(TL.PRICE, pop(.6, .9), .2, 0);
T.at(TL.STRIKE, mixb(noise(.28, { lp: 4200, hp: 900, e: env.hann(), amp: .8 }), clang(note(88), .5)), .3, 0);
T.at(TL.DEAD, plink(note(91)), .2, 0);
T.at(TL.PILL, mixb(pop(1, 1.3), shimmer(.7, [note(91), note(95), note(98)], .6, .06)), .32, 0);
T.at(TL.CARD, pad(TL.END - TL.CARD, [67, 71, 74], .7), .08, 0);

T.write('assets/swaha_sfx.wav');
console.log('assets/swaha_sfx.wav', TL.END.toFixed(2), 's');
// the mix: the voice at full level over the SFX, normalised to -14 LUFS
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'assets/swaha_vo.wav', '-i', 'assets/swaha_sfx.wav', '-filter_complex',
  `[1:a]volume=0.85[s];[0:a][s]amix=inputs=2:normalize=0:duration=longest,apad=whole_dur=${TL.END.toFixed(3)},atrim=0:${TL.END.toFixed(3)},loudnorm=I=-14:TP=-1.5:LRA=11[o]`,
  '-map', '[o]', '-ar', '48000', '-ac', '2', 'assets/swaha_mix.wav']);
console.log('assets/swaha_mix.wav');
