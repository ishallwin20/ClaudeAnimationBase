// baraat_sfx.mjs: the sound effects for "The SCARIEST baraat in history" (src/scenes/baraat.js) → assets/baraat_sfx.wav.
// Times are the scene's constants (keep them in sync). Dense in the hook; the bell is the loudest thing in the film.
import { track, tone, noise, bell, mixb, env, whoosh, rumble, plink, clang, squeak, click, thud, crunch, shimmer, wah, burp, slide, note, seed } from './sfx.mjs';

const DHAM1 = .35, DHAM2 = .75, WHIP_A = 1.05, GHOST_POP = 1.45, MENA_TAKE = 1.6, FAINT0 = 1.85, FLOOR = 2.15, THALI_LAND = 2.6, PEEK = 2.75, A_OUT = 4.0;
const HOOF = [4.8, 5.4, 6.0, 6.6], STOP1 = 7.0, BADGE1 = 7.2, STOP2 = 9.2, BADGE2 = 9.4, DHOL_HITS = [9.5, 9.9, 10.3, 10.55, 10.8],
  STOP3 = 11.4, BADGE3 = 11.6, EYE_FOOD = 12.0, GULP = 12.5, BURP = 13.1, STOP4 = 13.6, BADGE4 = 13.8, SNAP = 14.4, Q4 = 14.9, B_OUT = 15.4;
const SIT_UP = 16.0, REFUSE = 16.7, TURN_AWAY = 17.6, BRIDE_IN = 18.2, BRIDE_DET = 19.6;
const MOON0 = 21.3, BURST = 22.0, REVEAL = 22.35, ARMS = [22.45, 22.65, 22.85, 23.05, 23.25], RINGS = [24.9, 25.2, 25.5], STICKS_FREEZE = 25.0, BOW = 25.9,
  CHANDRA = 27.2, GHANTA = 28.6, D_OUT = 29.6;
const BROW = 30.5, SHIVA_Q = 30.95, GULP_S = 31.3, POOF = 31.6, GROOM = 32.1, NOD = 32.8, WHIP_E = 33.5, MENA_HEART = 33.8, FAINT2 = 34.25, E_OUT = 35.3;
const GARLAND = 35.9, LINEUP = 37.7, WAVES = [38.0, 38.15, 38.3, 38.45], BELL_IRIS = 39.3, CARD = 39.8, COVER = 40.1, LOGO = 41.1, PILL = 42.2;

const T = track(45.6);
seed(7);
// a dhol hit: a deep boom and a skin slap
const dham = (amp = 1) => mixb(tone(.5, t => 95 * Math.exp(-t * 5) + 52, { e: env.pluck(7), amp }), noise(.08, { hp: 600, lp: 3500, e: env.pluck(45), amp: amp * .45 }), tone(.25, 180, { type: 'tri', e: env.pluck(18), amp: amp * .25 }));
const tilli = (amp = 1) => mixb(noise(.05, { hp: 1800, lp: 7000, e: env.pluck(70), amp }), tone(.08, 420, { type: 'tri', e: env.pluck(40), amp: amp * .4 }));
const pop = (amp = 1) => squeak(300, 900, .09, amp);
const ding = (m, amp = 1) => bell(note(m), 1.4, { amp });

// ---- A: the hook
T.at(0, dham(.7), .5, 0); T.at(DHAM1, dham(1), .8, -.1); T.at(.55, tilli(), .35, .2); T.at(DHAM2, dham(1), .85, .1); T.at(.95, tilli(), .35, -.2);
T.at(WHIP_A - .12, whoosh(.3, 500, 4200), .5, .6);
T.at(GHOST_POP - .08, pop(), .5, .6); T.at(GHOST_POP + .05, dham(1), .9, .6);
T.at(MENA_TAKE, squeak(700, 1500, .14), .4, 0); T.at(MENA_TAKE + .02, plink(note(88)), .3, 0);
T.at(FAINT0, whoosh(.32, 300, 1400), .35, -.2);
T.at(FLOOR, thud(1), .75, -.3);
T.at(FAINT0 + .05, tone(.6, t => 1400 + 500 * Math.sin(t * 40), { type: 'tri', e: env.swell(.02, .1), amp: .3 }), .2, -.1);   // the thali spinning
T.at(THALI_LAND, clang(note(76)), .45, -.2); T.at(THALI_LAND + .12, clang(note(79), .5), .2, -.2);
T.at(PEEK + .05, plink(note(84)), .35, .2); T.at(PEEK + .15, plink(note(89)), .3, .2);
T.at(A_OUT + .05, whoosh(.35, 400, 3800), .45, .6);

// ---- B: the roll call
HOOF.forEach((h, i) => { T.at(h, mixb(tone(.08, 900 - i * 40, { type: 'tri', e: env.pluck(45), amp: .5 }), noise(.06, { hp: 800, lp: 4000, e: env.pluck(50), amp: .4 })), .35, .2); T.at(h + .02, noise(.3, { lp: 1200, hp: 200, e: env.hann(), amp: .4 }), .2, .2); });
[STOP1, STOP2, STOP3, STOP4].forEach(s => T.at(s - .3, whoosh(.4, 500, 3000), .35, -.4));
[BADGE1, BADGE2, BADGE3, BADGE4].forEach((b, i) => T.at(b, ding(84 + i * 2), .35, -.2));
T.at(STOP1 + .1, wah(note(62), 1.6), .3, 0);   // the been, for the nagin dance
T.at(STOP1 + 1.0, wah(note(65), .8), .25, 0);
DHOL_HITS.forEach((h, i) => T.at(h, i % 2 ? tilli() : dham(.9), i % 2 ? .35 : .75, i % 2 ? -.2 : .2));
T.at(EYE_FOOD, plink(note(91)), .3, 0); T.at(EYE_FOOD + .2, squeak(200, 120, .25), .3, 0);
T.at(GULP - .2, whoosh(.25, 600, 2500), .3, -.2);
T.at(GULP, mixb(tone(.35, t => 160 * Math.exp(-t * 4) + 60, { e: env.pluck(8), amp: 1 }), crunch(.6)), .7, 0);   // GULP
T.at(BURP, burp(1), .55, .1);
T.at(BADGE4 + .2, squeak(500, 800, .1), .25, 0);
T.at(SNAP, click(1), .7, .2); T.at(SNAP + .01, noise(.2, { hp: 3000, lp: 9000, e: env.pluck(18), amp: .5 }), .3, .2);
T.at(Q4, plink(note(84)), .35, -.2); T.at(Q4 + .12, plink(note(80)), .3, -.2);
T.at(Q4 + .2, noise(.4, { hp: 2500, lp: 6000, e: env.swell(.02, .1), amp: .25 }), .2, -.2);   // the head scratch
T.at(B_OUT, whoosh(.4, 400, 4000), .5, -.6);

// ---- C: the refusal
T.at(SIT_UP, slide(.4, 300, 600), .2, 0);
T.at(16.4, squeak(600, 1300, .12), .3, .2);
T.at(REFUSE, mixb(noise(.25, { lp: 900, hp: 150, e: env.ad(.02, .08), amp: 1 }), tone(.2, 140, { type: 'saw', e: env.pluck(14), amp: .4 })), .45, 0);   // the huff
T.at(REFUSE + .08, clang(note(70), .5), .25, -.2);   // the thali hits the floor
T.at(TURN_AWAY, whoosh(.2, 800, 2600), .3, -.2);
for (let i = 0; i < 4; i++) T.at(BRIDE_IN + i * .2, tone(.06, 300, { type: 'tri', e: env.pluck(50), amp: .4 }), .2, -.3);   // her steps
T.at(BRIDE_DET, ding(69, .6), .25, 0);
T.at(20.4, tone(.8, t => 220 + 220 * t, { e: env.swell(.3, .3), amp: .5 }), .25, 0);   // the push in rises

// ---- D: the bride becomes Chandraghanta
T.at(MOON0, shimmer(1, [note(88), note(91), note(95)], 1, .08), .3, 0);
T.at(BURST - .5, noise(.6, { lp: t => 800 + 6000 * t, hp: 400, e: env.swell(.5, .02), amp: .6 }), .35, 0);   // the rise
T.at(BURST, mixb(rumble(.8, .8), whoosh(.8, 300, 5000)), .5, 0);
T.at(REVEAL, shimmer(1.4, [note(76), note(80), note(83), note(88), note(92)], 1, .07), .45, 0);
ARMS.forEach((a, i) => T.at(a, clang(note(86 + (i % 3) * 3), .6), .25, i % 2 ? .4 : -.4));
RINGS.forEach((r, i) => T.at(r, bell(note(69), 3.2, { partials: [[1, 1], [2.4, .5], [3.9, .35], [5.6, .2], [8.1, .1]], k: 1.1 }), [1, .75, .55][i], -.3));   // GHANTAAA
T.at(BOW, thud(.4), .2, .3); T.at(BOW + .15, thud(.35), .18, .4); T.at(BOW + .3, thud(.35), .16, .5); T.at(BOW + .45, thud(.3), .14, .6);
T.at(CHANDRA, shimmer(1, [note(84), note(88), note(91)], 1, .09), .3, 0);
T.at(GHANTA, bell(note(76), 2, { partials: [[1, 1], [2.4, .5], [3.9, .3]], k: 1.6 }), .45, 0);
T.at(D_OUT, whoosh(.35, 500, 4200), .45, .6);

// ---- E: the glow-up
T.at(BROW, squeak(500, 1200, .5, .8), .3, -.3);   // the eyebrow goes up
T.at(SHIVA_Q, plink(note(84)), .35, .3); T.at(SHIVA_Q + .12, plink(note(81)), .3, .3);
T.at(GULP_S, tone(.25, t => 300 * Math.exp(-t * 6) + 80, { e: env.pluck(10), amp: 1 }), .45, .3);
T.at(POOF, mixb(noise(.6, { lp: 2500, hp: 150, e: env.ad(.01, .18), amp: 1 }), tone(.3, t => 160 - 200 * t, { e: env.pluck(10), amp: .6 })), .55, .3);
T.at(GROOM, shimmer(1.4, [note(79), note(83), note(86), note(91), note(95)], 1, .06), .45, .3);
T.at(NOD, ding(91, .5), .25, .3);
T.at(WHIP_E - .15, whoosh(.3, 500, 4000), .45, -.6);
T.at(MENA_HEART, mixb(plink(note(86)), plink(note(91), .6)), .4, .3); T.at(MENA_HEART + .15, plink(note(93)), .3, .3);
T.at(FAINT2, slide(.6, 900, 300), .3, 0); T.at(FAINT2 + .5, thud(.4), .3, -.2);
T.at(E_OUT, whoosh(.4, 400, 3000), .35, 0);

// ---- F: the wedding and the comment beat
T.at(GARLAND + .6, shimmer(1, [note(81), note(84), note(88)], 1, .07), .35, .2);
for (let i = 0; i < 4; i++) T.at(LINEUP + i * .08, pop(.8), .35, -.6 + i * .4);
WAVES.forEach((w, i) => T.at(w, plink(note(84 + i * 3)), .3, -.6 + i * .4));
T.at(BELL_IRIS, bell(note(81), 1.6), .35, 0);

// ---- the card
T.at(COVER, ding(88), .35, 0); T.at(LOGO, ding(93, .6), .25, 0); T.at(PILL, ding(96, .6), .3, 0);

T.write('assets/baraat_sfx.wav');
