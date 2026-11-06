// lokas_sfx.mjs: the sound effects for "7 worlds below your feet" (src/scenes/lokas.js) → assets/lokas_sfx.wav, then the
// mix with the voice → assets/lokas_mix.wav. Times come from the voice and the timeline (src/scenes/lokas_vo.js +
// lokas_tl.js, loaded with vm), so they follow the picture.
// The column: a deep space drone, a boom on frame 0, a glint per world as the numbers pop. HELL: a low distorted swell
// cut off, then a bright rising shimmer. Narada: a plucked veena note, the comet's falling whoosh, its rise and a choir-
// like pad for heaven. The depths: a tick per number. Each world: a falling whoosh and a rock rumble as the camera drops,
// then its own sound: Atal's glyphs (a run of plinks to 96, a burst), Vital's molten flow and a temple bell, Sutal's
// conch for Vishnu and the mace's ring, Talatal's rising towers, the arrow, the fire and a calm chord, Mahatal's hiss and
// Garuda's wings and cry, Rasatal's growls and Indra's thunder, Patal's hum, the silence of no sun, the jewels chiming
// alight. Shesha: a vast low swell, a bell on ONE, a tiny bright ping on the seed. The board, the ask, the card.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, plink, clang, click, shimmer, drone, note, seed, chime, drum, conch, thud, wind, rnd, crackle, rumble, thunder, fire, screech, wingbeat, roar, om, SR } from './sfx.mjs';

const TL = runInNewContext(readFileSync('src/scenes/lokas_vo.js', 'utf8') + '\n' + readFileSync('src/scenes/lokas_tl.js', 'utf8') + '\n;TL');
const T = track(TL.END);
seed(79);
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const pop = (amp = 1, f = 1) => mixb(click(amp), tone(.07, t => f * (500 + 2600 * t / .07), { e: env.pluck(40), amp: amp * .7 }), noise(.05, { lp: 2500, hp: 300, e: env.pluck(60), amp: amp * .5 }));
const pad = (dur, ms, amp = 1) => mixb(...ms.map((m, i) => tone(dur, t => note(m) * (1 + .003 * Math.sin(t * 2 + i)), { type: 'tri', e: env.swell(.8, .8), amp: amp / ms.length })));
const templeBell = (f = 76, amp = 1) => bell(note(f), 4, { partials: [[1, 1], [2.02, .6], [2.76, .45], [4.1, .3], [5.4, .18]], k: 1.1, amp });
const boom = (amp = 1) => mixb(tone(2.2, t => 52 * Math.exp(-t * .9) + 26, { e: env.pluck(1.6), amp }), noise(.9, { lp: 380, hp: 25, brown: true, e: env.pluck(4), amp: amp * .7 }));
const hiss = (dur, amp = 1) => noise(dur, { lp: 9000, hp: 3200, e: env.swell(.06, Math.min(.4, dur * .5)), amp });
// the drop between worlds: a falling whoosh and a short rock rumble as the camera passes the slab
const drop = (t0) => { T.at(t0 - .15, whoosh(1.1, 2600, 260, 1), .16, 0); T.at(t0 + .1, rumble(1.2, .9), .1, 0); T.at(t0 + .55, thud(.5), .1, 0); };
// a veena-like pluck: a bright string with a buzzing attack
const veena = (m, amp = 1) => mixb(tone(1.6, t => note(m) * (1 + .002 * Math.sin(t * 30)), { type: 'saw', e: env.pluck(2.6), amp: amp * .35 }), tone(1.6, note(m), { e: env.pluck(2.2), amp }), tone(1.2, note(m + 12), { e: env.pluck(3), amp: amp * .3 }));

// ---- A: the hook: a boom at frame 0, the space drone, a glint per world
T.at(0, boom(1), .3, 0);
T.at(0, drone(TL.C0 + .4, 36, 1), .07, 0);
T.at(0, pad(TL.C0 + .4, [48, 55, 60], 1), .05, 0);
for (let i = 0; i < 7; i++) T.at(TL.SEVEN + .05 + i * .09, plink(note(79 + [0, 2, 4, 7, 9, 12, 14][i]), .6), .07, (i - 3) * .1);
// ---- B: not HELL: a dark swell that cuts off, then light
T.at(TL.HELL - .6, mixb(noise(.8, { lp: 300, hp: 30, brown: true, e: env.swell(.6, .05), amp: 1 }), tone(.8, t => 55 + 8 * Math.sin(t * 40), { type: 'saw', e: env.swell(.6, .05), amp: .4 })), .16, 0);
T.at(TL.HELL + .45, shimmer(1.8, [72, 76, 79, 84, 88, 91].map(note), .5, .07), .14, 0);
// ---- C: Narada: the veena, the comet falling, rising, heaven's pad
T.at(TL.NARADA - .3, veena(62, 1), .16, -.2);
T.at(TL.NARADA + .25, veena(69, .8), .12, .2);
T.at(TL.NARADA - .1, whoosh(1.6, 3000, 300, 1), .14, 0);
T.at(TL.BEAUTIFUL - .3, whoosh(2.2, 300, 3400, 1), .12, 0);
T.at(TL.INDRA - .2, pad(2.6, [67, 71, 74, 79, 83], 1), .1, 0);
T.at(TL.HEAVEN, chime(note(84), .6, 2.4), .1, 0);
// ---- D: the depths: a tick per number; YOJANAS
T.at(TL.D0, drone(TL.W0[0] - TL.D0 + .3, 33, 1), .07, 0);
for (let i = 0; i < 7; i++) T.at(TL.SEVEN2 + i * .16, mixb(click(.6), tone(.12, 900 - i * 70, { e: env.pluck(30), amp: .6 })), .08, 0);
T.at(TL.YOJANAS, thud(.8), .12, 0);
// ---- the drops into each world
TL.W0.forEach((t0) => drop(t0));
// ---- 1 ATAL: a glassy pad; plinks running up to 96; a burst on MAGIC, the mirages' shimmer
T.at(TL.W0[0] + .3, pad(TL.W0[1] - TL.W0[0], [62, 69, 73, 76], 1), .06, 0);
for (let k = 0; k < 40; k++) { const x = k / 40, t = TL.BALA + .2 + (TL.N96 - TL.BALA - .15) * (x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2); T.at(t, plink(note(76 + (k % 12) + (k % 3) * 2), .35), .05, (rnd() - .5) * .8); }
T.at(TL.MAGIC - .05, mixb(shimmer(2, [79, 83, 86, 91, 95, 98].map(note), .6, .05), noise(.6, { hp: 3000, lp: 9000, e: env.pluck(5), amp: .6 })), .16, 0);
// ---- 2 VITAL: the molten river; a temple bell on SHIVA; shimmer on GOLD
T.at(TL.W0[1] + .3, noise(TL.W0[2] - TL.W0[1], { lp: t => 500 + 120 * Math.sin(t * 1.3), hp: 60, brown: true, e: env.swell(.8, .6), amp: 1 }), .06, 0);
T.at(TL.W0[1] + .3, crackle(TL.W0[2] - TL.W0[1], .4), .03, .3);
T.at(TL.SHIVA1 - .05, templeBell(69, .9), .18, 0);
T.at(TL.GOLD - .05, shimmer(2.2, [74, 78, 81, 86, 90].map(note), .55, .08), .14, 0);
// ---- 3 SUTAL: a royal pad; the conch for Vishnu; the mace's ring
T.at(TL.W0[2] + .3, pad(TL.W0[3] - TL.W0[2], [60, 64, 67, 72], 1), .06, 0);
T.at(TL.BALI, chime(note(72), .5, 2), .1, 0);
T.at(TL.VISHNU - .4, conch(2.4, 311, 1), .16, 0);
T.at(TL.MACE, mixb(clang(note(57), .8), thud(.6)), .14, .1);
// ---- 4 TALATAL: towers rising; the arrow, the fire; the calm
T.at(TL.MAYA - .2, tone(1.8, t => 120 + 160 * t / 1.8, { type: 'tri', e: env.swell(.3, .3), amp: 1 }), .06, 0);
for (let k = 0; k < 7; k++) T.at(TL.MAYA + k * .22, mixb(click(.4), tone(.1, 300 + k * 60, { e: env.pluck(30), amp: .5 })), .06, (k - 3) * .12);
T.at(TL.BURNED - .75, whoosh(.8, 600, 5000, 1), .18, -.3);
T.at(TL.BURNED - .02, mixb(boom(.8), noise(.4, { hp: 500, lp: 6000, e: env.pluck(6), amp: .8 })), .26, 0);
T.at(TL.BURNED, fire(TL.PLEASED - TL.BURNED + .6, .7, 1), .16, 0);
T.at(TL.PLEASED - .1, pad(TL.W0[4] - TL.PLEASED + .2, [64, 68, 71, 76], 1), .09, 0);
T.at(TL.GAVE, chime(note(83), .5, 2), .1, 0);
// ---- 5 MAHATAL: hisses; Garuda's wings and cry; the snakes recoil
T.at(TL.W0[4] + .3, hiss(1.4, 1), .06, -.3);
T.at(TL.MANY - .1, hiss(1.2, 1.1), .08, .3);
T.at(TL.HOODS, hiss(.9, 1), .06, 0);
for (let k = 0; k < 3; k++) T.at(TL.AFRAID + .1 + k * .38, wingbeat(1, 1.2), .2, -.5 + k * .4);
T.at(TL.GARUDA - .05, screech(1.1, 2400, 1), .14, .2);
T.at(TL.GARUDA + .25, hiss(.6, 1.6), .1, 0);
// ---- 6 RASATAL: low growls from the holes; Indra's thunder; silence
T.at(TL.W0[5] + .3, drone(TL.INDRA2 - TL.W0[5], 31, 1), .08, 0);
T.at(TL.DEMONS, roar(1.4, 70, 5, 1), .07, -.3);
T.at(TL.HOLES - .2, roar(1.2, 60, 5, 1), .06, .3);
T.at(TL.INDRA2 - .12, thunder(3, 1), .3, 0);
// ---- 7 PATAL: a deep hum; at NO SUN the hum drops out; the jewels chime alight one by one
T.at(TL.W0[6] + .3, om(TL.NO - TL.W0[6], 98, 1), .06, 0);
T.at(TL.VASUKI, hiss(.9, 1), .06, 0);
T.at(TL.SUN, tone(1.2, 55, { e: env.swell(.4, .6), amp: 1 }), .06, 0);
for (let k = 0; k < 14; k++) T.at(TL.JEWELS - .1 + k * .1, bell(note(84 + [0, 3, 5, 7, 10, 12, 15][k % 7]), 1.4, { partials: [[1, 1], [2.4, .3], [5.1, .1]], k: 3, amp: .6 }), .06, (rnd() - .5) * 1.2);
T.at(TL.EVERY, pad(TL.L0 - TL.EVERY + .4, [66, 70, 73, 78], 1), .08, 0);
// ---- L: below all seven: the fall into the deep, a vast low swell; Shesha; ONE; the seed
T.at(TL.L0 - .2, whoosh(1.6, 2000, 150, 1), .16, 0);
T.at(TL.L0, drone(TL.M0 - TL.L0 + .3, 29, 1), .1, 0);
T.at(TL.ANANTA - .4, mixb(boom(1), pad(4.5, [41, 48, 53, 60, 64], 1.2)), .2, 0);
T.at(TL.WHOLE - .1, shimmer(1.6, [72, 76, 79, 83].map(note), .4, .1), .1, 0);
T.at(TL.ONE - .05, templeBell(64, 1), .22, 0);
T.at(TL.MUSTARD, whoosh(1.4, 2600, 400, 1), .12, 0);
T.at(TL.SEED, mixb(tone(.4, note(100), { e: env.pluck(8), amp: 1 }), click(.4)), .08, 0);
// ---- M: the board: a whoosh, a pop per row; SAVE; the ask
T.at(TL.M0 - .1, whoosh(.8, 400, 2600), .16, 0);
for (let i = 0; i < 7; i++) T.at(TL.M0 + .25 + i * .1, pop(.5, 1 + i * .06), .1, (i - 3) * .1);
T.at(TL.SAVE, chime(note(86), .6, 1.8), .12, 0);
T.at(TL.M0, pad(TL.CARD - TL.M0, [57, 64, 69], .8), .05, 0);
T.at(TL.YOU, pop(.7, 1.2), .14, 0);
T.at(TL.COMMENT, mixb(pop(1, 1.3), shimmer(.7, [note(91), note(95), note(98)], .6, .06)), .18, 0);
// ---- the card
T.at(TL.CARD - .3, whoosh(.7, 400, 3200), .24, 0);
T.at(TL.CARD + .35, mixb(...[67, 71, 74, 79].map((m, i) => bell(note(m), 2.2, { partials: [[1, 1], [2, .35], [3, .12]], k: 1.4, amp: .7 }))), .2, 0);
for (let k = 0; k < 3; k++) T.at(TL.CARD + .7 + k * .12, pop(.8, 1 + k * .15), .24, (k - 1) * .4);
T.at(TL.CARD + 1.65, mixb(pop(1, 1.3), shimmer(.7, [note(91), note(95), note(98)], .6, .06)), .26, 0);
T.at(TL.CARD, pad(TL.END - TL.CARD, [67, 71, 74], .7), .07, 0);

T.write('assets/lokas_sfx.wav');
console.log('assets/lokas_sfx.wav', TL.END.toFixed(2), 's');
// the mix: the voice at full level over the SFX, normalised to -14 LUFS
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'assets/lokas_vo.wav', '-i', 'assets/lokas_sfx.wav', '-filter_complex',
  `[1:a]volume=0.85[s];[0:a][s]amix=inputs=2:normalize=0:duration=longest,apad=whole_dur=${TL.END.toFixed(3)},atrim=0:${TL.END.toFixed(3)},loudnorm=I=-14:TP=-1.5:LRA=11[o]`,
  '-map', '[o]', '-ar', '48000', '-ac', '2', 'assets/lokas_mix.wav']);
console.log('assets/lokas_mix.wav');
