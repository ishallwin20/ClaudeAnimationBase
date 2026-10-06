// lion_sfx.mjs: the sound effects for "Aarav had ONE job: ROAR." (src/scenes/lion.js) → assets/lion_sfx.wav. Times are the
// scene's constants (keep them in sync). The signatures: the tiny MEW (three times), her bell's GHANNN, the little bell's
// ting, and the two ROARs (the second is the loudest thing in the film).
import { track, tone, noise, bell, mixb, env, whoosh, rumble, plink, clang, squeak, click, thud, crackle, crinkle, shimmer, wah, slide, drone, note, seed, rnd, clamp, lerp, SR } from './sfx.mjs';

const MEW_A = 1.15, PETAL_A = 1.3, GIGGLE_A = 1.75, DROOP = 2.3, TOMORROW = 2.6, IRIS_A = 3.9, B0 = 4.4;
const SIGH = 4.8, PETAL_B = 5.2, TING_B = 5.9, FLY = 6.6, CATCH = 7.3, OPEN = 8.5, BEAM = 8.8, C0 = 9.4;
const TOPPLE = 9.9, RISE1 = 10.6, FAN = 10.8, NAME = 11.0, MANE_UP = 13.2, BROW = 13.5, MEW_C = 15.0, D0 = 15.6;
const NOISE = 15.7, RING = 16.2, TURN = 17.6, INHALE1 = 18.8, MEW_D = 19.4, PALM = 19.6, COACH = [20.4, 21.3, 22.2],
  INHALE2 = 23.8, ROAR_D = 24.4, WONDER = 25.0, LESSON = 25.6, TIE = 28.8, BELL_TIE = 29.6, EXIT = 30.4, SHUT = 30.9, E0 = 31.0;
const CUE = 31.7, INHALE3 = 33.6, MEW_E = 34.2, GIGGLE_E = 34.5, DROOP_E = 35.0, BELL_E = 35.6, TING_E = 36.0, WINGS = 36.4,
  ECHO = 36.6, BACK = 37.6, INHALE4 = 37.8, ROAR_E = 38.5, HUSH = 40.0, CHEER = 40.4, CLAP10 = 42.4, F0 = 44.5;
const STORY = 45.0, GLINT = 45.8, COMMENT = 47.4, IRIS = 50.2, CARD = 50.7, CARD_CAP = 50.9, COVER3 = 51.1, ROW13 = 51.8,
  PRICE = 52.2, LOGO = 52.7, PILL = 53.0, FOLLOW = 53.5, END = 55.9;

const T = track(END);
seed(9);
const lp = (b, fc) => { let l = 0; const a = 1 - Math.exp(-2 * Math.PI * fc / SR); for (let i = 0; i < b.length; i++) { l += a * (b[i] - l); b[i] = l; } return b; };
// the tiny mew: a kitten-ish rise and fall with a little vibrato
const mew = (amp = 1, f = 1) => mixb(tone(.32, t => f * (t < .1 ? lerp(820, 1350, t / .1) : lerp(1350, 760, (t - .1) / .22)), { type: 'tri', e: env.swell(.02, .1), fm: t => .006 * Math.sin(t * 2 * Math.PI * 18), amp }),
  tone(.32, t => 2 * f * (t < .1 ? lerp(820, 1350, t / .1) : lerp(1350, 760, (t - .1) / .22)), { e: env.swell(.02, .1), amp: amp * .2 }));
// her ghanta: a big temple bell, struck hard, with a low hum under it
const ghannn = (amp = 1) => mixb(bell(note(50), 3.2, { partials: [[1, 1], [2.02, .55], [2.76, .5], [5.4, .25], [8.9, .12]], k: 1.1, amp }), bell(note(62), 2.2, { k: 1.6, amp: amp * .35 }), noise(.06, { hp: 1500, lp: 9000, e: env.pluck(60), amp: amp * .5 }));
const ting = (m, amp = 1) => bell(note(m), 1.2, { amp });
// a breath in (rising) / out
const breathIn = (d, amp = 1) => noise(d, { lp: t => 600 + 2400 * t / d, hp: 300, e: (t, D) => clamp(t / D) ** 1.5 * clamp((D - t) / .05), amp });
const breathOut = (d, amp = 1) => noise(d, { lp: t => 1800 - 1200 * t / d, hp: 200, e: env.hann(), amp });
// kids giggling: short "hee" chirps, two voices
const giggle = (n, amp = 1, f0 = 900) => { const o = new Float32Array(Math.round((n * .13 + .3) * SR)); for (let i = 0; i < n; i++) { const f = f0 * (.85 + rnd() * .4), b = tone(.09, t => f * (1 + .3 * Math.sin(t * 40)), { type: 'tri', e: env.hann(), amp: amp * (.6 + rnd() * .4) }), s = Math.round((i * .13 + rnd() * .03) * SR); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j]; } return o; };
// the ROAR: a growling saw under a noise roar, falling, with a rumble
const roar = (d, amp = 1, f0 = 230) => mixb(
  lp(tone(d, t => f0 * (1.15 - .45 * t / d), { type: 'saw', e: env.swell(.05, d * .35), fm: t => .02 * Math.sin(t * 2 * Math.PI * 34), amp }), 1600),
  noise(d, { lp: t => 2600 - 1400 * t / d, hp: 120, e: env.swell(.04, d * .4), amp: amp * .8 }),
  rumble(d * .9, amp * .6));
const clap = (amp = 1) => mixb(noise(.06, { hp: 900, lp: 5000, e: env.pluck(70), amp }), click(amp * .5));
const applause = (d, amp = 1) => { const o = new Float32Array(Math.round((d + .2) * SR)); const n = Math.round(d * 40); for (let i = 0; i < n; i++) { const c = clap(amp * (.4 + rnd() * .6)), s = Math.round(rnd() * d * SR); for (let j = 0; j < c.length && s + j < o.length; j++) o[s + j] += c[j] * (1 - .6 * s / o.length); } return o; };
const crowd = (d, amp = 1) => noise(d, { lp: 1400, hp: 250, e: env.swell(.4, .6), amp });
const crickets = (d, amp = 1) => { const o = new Float32Array(Math.round(d * SR)); for (let k = 0; k < d * 3; k++) { const b = tone(.12, 4200 + rnd() * 400, { e: (t, D) => Math.sin(Math.PI * t / D) * (Math.sin(t * 2 * Math.PI * 60) > 0 ? 1 : .2), amp: amp * (.5 + rnd() * .5) }), s = Math.round((k / 3 + rnd() * .1) * SR); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j]; } return o; };

// ---- A: the rehearsal (dense)
T.at(0, drone(IRIS_A + .5, 55, .5), .18, 0);
T.at(0, breathIn(1.05, 1), .55, 0);
T.at(.3, crinkle(.5, .5), .12, .2);                                        // the mane bristles
T.at(MEW_A, mew(1), .75, 0);
T.at(PETAL_A, crinkle(.25, .7), .2, .3); T.at(PETAL_A + .05, whoosh(1.0, 300, 900, .4), .12, .2);
T.at(GIGGLE_A, giggle(5, 1, 950), .3, -.5); T.at(GIGGLE_A + .12, giggle(4, 1, 1150), .25, .5);
T.at(DROOP, slide(.7, 330, 180, .7), .22, 0);
T.at(TOMORROW, bell(note(43), 1.6, { k: 2.5 }), .3, 0);
T.at(IRIS_A, whoosh(.5, 2400, 300), .3, 0);

// ---- B: the bedroom; the doorway opens
T.at(B0, crickets(C0 - B0, .5), .07, .6);
T.at(B0, whoosh(.45, 300, 1800, .6), .2, -.4);
T.at(SIGH, breathOut(.7, 1), .3, 0);
T.at(PETAL_B, crinkle(.2, .5), .15, .2);
T.at(TING_B, ting(91), .45, -.5); T.at(TING_B + .06, shimmer(1, [96, 100, 103].map(note), .4), .2, -.5);
T.at(FLY, noise(.15, { hp: 400, lp: 2200, e: env.hann(), amp: .7 }), .25, -.5);   // the book scrapes out
T.at(FLY + .15, whoosh(.6, 400, 3000), .35, -.2); T.at(FLY + .2, shimmer(1.2, [84, 88, 91, 96].map(note), .4, .1), .25, 0);
T.at(CATCH, thud(.5), .35, 0); T.at(CATCH, plink(note(84)), .25, 0);
T.at(CATCH + .1, shimmer(1.3, [79, 83, 86, 91].map(note), .3, .2), .18, 0);
T.at(OPEN, crinkle(.3, .6), .2, 0);
T.at(BEAM, ghannn(1), .38, 0); T.at(BEAM, whoosh(1.0, 300, 5000), .35, 0); T.at(BEAM + .05, shimmer(1.6, [91, 95, 98, 103, 107].map(note), .5, .07), .3, 0);

// ---- C: she steps out
T.at(BEAM + .4, whoosh(1.1, 3000, 500), .35, -.4);
T.at(C0 + .25, noise(.4, { lp: 1800, hp: 150, e: env.ad(.01, .1), amp: .8 }), .3, -.4);   // poof
T.at(TOPPLE, slide(.25, 500, 1100, .6), .3, .3); T.at(TOPPLE + .22, thud(.6), .35, .3);   // whoops, onto the bed
T.at(TOPPLE + .4, thud(.4), .2, .6);                                                       // the book lands
[0, .2, .4, .6].forEach((d, i) => { T.at(FAN + d, ting(84 + [0, 3, 7, 12][i]), .35, i % 2 ? .4 : -.4); T.at(FAN + d, noise(.12, { hp: 2000, lp: 9000, e: env.pluck(30), amp: .5 }), .12, i % 2 ? .4 : -.4); });
T.at(NAME, shimmer(1.6, [86, 90, 93, 98].map(note), .5, .12), .25, 0);
T.at(MANE_UP, crinkle(.4, .5), .18, -.3); T.at(MANE_UP, whoosh(.45, 500, 2500, .5), .2, -.3);
T.at(BROW, slide(.18, 600, 1300, .6), .25, -.3);          // the eyebrow goes up
T.at(MEW_C, mew(.8, 1.2), .4, .3);
T.at(D0 - .15, whoosh(.32, 600, 4500), .4, .5);

// ---- D: training
T.at(RING, ghannn(1.2), .42, -.4); T.at(RING + .02, rumble(.8, .6), .3, 0);
T.at(RING + .05, crackle(.5, .5), .12, .5);                                               // the window rattles
T.at(TURN, whoosh(.45, 500, 2600), .3, 0); T.at(TURN + .4, crinkle(.3, .6), .25, .2); T.at(TURN + .4, plink(note(86)), .3, .2);
T.at(INHALE1, breathIn(.58, 1), .4, .2);
T.at(MEW_D, mew(1, .95), .7, .2);
T.at(PALM + .2, mixb(click(1), thud(.3)), .4, -.3);       // facepalm
T.at(COACH[0], plink(note(79)), .35, .2); T.at(COACH[0] + .3, slide(.2, 500, 900, .5), .25, .2);
T.at(COACH[1], plink(note(83)), .35, .2); T.at(COACH[1] + .1, thud(.25), .25, .2);
T.at(COACH[2] + .1, thud(.3), .3, .2); T.at(COACH[2] + .35, thud(.3), .3, .2); T.at(COACH[2], plink(note(86)), .3, .2);
T.at(INHALE2, breathIn(.6, 1), .5, .2); T.at(INHALE2, slide(.6, 200, 420, .5), .15, .2);
T.at(ROAR_D, roar(.85, 1, 240), .6, .2); T.at(ROAR_D, ghannn(.8), .22, -.4);
T.at(ROAR_D + .1, clang(note(70), .6), .2, .6); T.at(ROAR_D + .1, crackle(.4, .6), .15, .6);   // the window bangs open
T.at(WONDER, shimmer(1, [88, 91, 95].map(note), .4), .2, .2);
T.at(LESSON, shimmer(2.5, [67, 71, 74, 79].map(note), .35, .35), .15, 0);
T.at(LESSON + 1.1, mixb(plink(note(91)), squeak(900, 1500, .1, .6)), .35, .2);   // boop, his nose
T.at(LESSON + 1.15, giggle(4, .9, 1100), .3, .2);
T.at(TIE, shimmer(.9, [96, 100, 103, 108].map(note), .4, .06), .3, -.3); T.at(TIE + .2, whoosh(.8, 800, 3500, .6), .25, 0);
T.at(BELL_TIE, ting(98), .55, .4); T.at(BELL_TIE + .03, ting(103, .5), .3, .4);
T.at(EXIT - .3, ting(93, .5), .2, -.3);                   // the wink
T.at(EXIT, whoosh(.5, 600, 5000), .45, .3); T.at(EXIT, shimmer(.6, [91, 95, 98, 103].map(note), .4, .05), .25, .3);
T.at(SHUT - .1, mixb(thud(1), click(1)), .55, .4);

// ---- E: the play
T.at(E0, noise(.6, { lp: 2400, hp: 200, e: env.hann(), amp: .8 }), .3, 0);              // the curtains swish open
T.at(E0, crowd(CUE + .4 - E0, .6), .2, 0);
T.at(INHALE3, breathIn(.6, 1), .4, .1);
T.at(MEW_E, mew(1, 1.05), .7, .1);
T.at(GIGGLE_E, giggle(8, 1, 900), .3, -.4); T.at(GIGGLE_E + .06, giggle(7, 1, 1150), .28, .4); T.at(GIGGLE_E, crowd(.9, .5), .12, 0);
T.at(DROOP_E, slide(.6, 300, 170, .6), .2, 0);
T.at(BELL_E, shimmer(.6, [100, 103].map(note), .3), .15, .4);
T.at(TING_E, ting(100, .9), .55, .4);
T.at(WINGS - .05, whoosh(.3, 500, 4500), .4, -.5); T.at(WINGS, ghannn(1.1), .38, -.6);
T.at(BACK, whoosh(.3, 500, 4500), .4, .5);
T.at(INHALE4, breathIn(.7, 1), .55, 0); T.at(INHALE4, slide(.7, 160, 420, .6), .2, 0); T.at(INHALE4 + .2, rumble(.5, .3), .15, 0);
T.at(ROAR_E, roar(1.4, 1.3, 200), .55, 0); T.at(ROAR_E, ghannn(.7), .2, 0); T.at(ROAR_E, whoosh(1.0, 3500, 300, .8), .35, 0);
T.at(ROAR_E + .2, clang(note(76), .7), .25, -.5); T.at(ROAR_E + .3, squeak(700, 1300, .2, .6), .25, -.5);   // the horns pop off
T.at(ROAR_E + .45, thud(.8), .4, -.5);                                                                           // and he sits down
T.at(CHEER, applause(2.2, 1), 1.6, 0); T.at(CHEER, crowd(2.2, 1), .4, 0); T.at(CHEER + .1, giggle(6, .8, 1300), .2, .3);
T.at(CLAP10 - .1, whoosh(.3, 500, 4500), .35, -.5);
for (let i = 0; i < 12; i++) T.at(CLAP10 + .12 + i * .11 + (i % 2) * .02, clap(1), .4, -.5 + (i % 3) * .2);
T.at(43.3, ting(93, .5), .25, -.4);                       // her wink
T.at(43.9, noise(.4, { lp: 1800, hp: 150, e: env.ad(.01, .1), amp: .6 }), .2, -.4); T.at(43.9, shimmer(1.2, [96, 100, 103, 108, 112].map(note), .4, .08), .3, -.2);

// ---- F: bedtime, and the card
T.at(F0, crickets(CARD - F0, .5), .06, .5);
[72, 76, 79, 84, 79, 76, 81, 79].forEach((m, i) => T.at(STORY + i * .38, bell(note(m), 1.2, { partials: [[1, 1], [3, .2]], k: 3 }), .14, (i % 2 ? .2 : -.2)));   // a music box
T.at(GLINT + .1, ting(96, .7), .3, 0);
[0, .15, .35, .55].forEach((d, i) => T.at(COMMENT + d, plink(note(84 + i * 3)), .25, 0));
T.at(IRIS, whoosh(.5, 2400, 300), .3, 0);
T.at(CARD + .05, shimmer(1, [84, 88, 91, 96].map(note), .5), .3, 0);
T.at(COVER3, plink(note(88)), .3, 0); T.at(ROW13, plink(note(84)), .25, -.3); T.at(ROW13 + .12, plink(note(86)), .25, .3);
T.at(PRICE, ting(91), .35, 0); T.at(LOGO, plink(note(93)), .3, 0); T.at(PILL, mixb(plink(note(96)), squeak(600, 1200, .08, .5)), .35, 0);
T.at(FOLLOW, shimmer(1, [96, 100, 103].map(note), .4), .2, 0);

T.write('assets/lion_sfx.wav');
