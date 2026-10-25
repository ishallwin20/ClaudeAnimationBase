// kojagari_sfx.mjs: the sound effects for "Tonight at MIDNIGHT, Maa Lakshmi asks ONE question" (src/scenes/kojagari.js)
// → assets/kojagari_sfx.wav. Times are the scene's constants (keep them in sync). A quiet night: crickets and a soft
// drone under it all; the sixteen kalas as sixteen rising chimes; a temple bell at midnight; a harp glide as she comes
// down; three snores; the owl's head spin and hoot; a phone under a razai; a gasp, a ghanti, a shower of coins.
import { track, tone, noise, bell, mixb, env, whoosh, plink, squeak, click, thud, crinkle, shimmer, drone, chime, chirp, wingbeat, whir, laughter, note, seed, rnd, clamp, SR } from './sfx.mjs';

const TILT0 = 3.3, KALA0 = 4.9, KHEER = 8.0, MID = 11.3, DESC0 = 11.9, LAND = 13.6, ASKQ = 14.6, WIPE1 = 17.9;
const SLEEP = 18.1, SPIN1 = 19.6, SHAKE = 20.2, PAN = 21.2, PERCH = 22.0, EXCEPT = 22.1, REVEAL = 23.0, FOUND = 23.7,
  LKIN = 24.9, SHADES = 25.3, NOTICE = 25.7, GASP = 26.1, PRAY = 26.8, COINS = 28.8, TURN = 32.2, YOU = 32.6, AWAKE = 35.1,
  ASK = 38.0, WIPE = 41.6;
const CARD = 41.9, CARD_CAP = 42.0, COVERS = 42.2, PRICE = 43.0, LOGO = 43.3, PILL = 43.6, FOLLOW = 44.0, END = 46.6;

const T = track(END);
seed(51);
const PENTA = [0, 2, 4, 7, 9];
const pent = (base, i) => note(base + 12 * Math.floor(i / 5) + PENTA[i % 5]);
// a snore: a rough inhale, a buzzing exhale with a whistle at the end
const snore = (f, amp = 1) => mixb(
  noise(.9, { lp: 700, hp: 80, e: env.swell(.3, .25), amp: .6 * amp }),
  tone(.9, t => f * (1 + .2 * Math.sin(t * 3)), { type: 'saw', e: env.swell(.3, .3), fm: t => .3 * Math.sin(t * 2 * Math.PI * 28), amp: .25 * amp }),
  tone(.35, t => 900 - 300 * t, { e: env.hann(), amp: .05 * amp }));
const hoot = (amp = 1) => mixb(tone(.26, t => 370 * (1 - .12 * t), { e: env.swell(.05, .12), amp }), tone(.4, t => 330 * (1 - .1 * t), { e: (t, D) => t < .32 ? 0 : env.swell(.05, .15)(t - .32, D - .32), amp }));
const coin = (f, amp = 1) => mixb(bell(f, .5, { partials: [[1, 1], [2.4, .5], [4.1, .3]], k: 9, amp }), click(amp * .3));

// ---- the bed: crickets and a soft drone through the night (until the card)
T.at(0, drone(WIPE + .4, note(43), 1), .07, 0);
for (let t = .3; t < WIPE; t += .55 + rnd() * .5) {
  const pan = rnd() * 1.6 - .8, n = 2 + Math.floor(rnd() * 3);
  for (let k = 0; k < n; k++) T.at(t + k * .07, chirp(1), .035 + rnd() * .02, pan);
}

// ---- A the hook, the tilt
T.at(0, shimmer(1.6, [note(84), note(88), note(91)], .5, .18), .12, 0);
T.at(TILT0, whoosh(1.2, 500, 1600), .14, 0);
// ---- B the sixteen kalas: a rising pentatonic run, one per kala
for (let i = 0; i < 16; i++) T.at(KALA0 + i * .1, plink(pent(72, i), .8), .16 + i * .006, -.3 + i * .04);
T.at(KALA0 + 1.7, shimmer(1.2, [note(96), note(100), note(103)], .5, .1), .12, 0);
T.at(KHEER, whoosh(.9, 300, 1400), .16, 0);
for (let i = 0; i < 6; i++) T.at(KHEER + .6 + i * .45, chime(note(91 + (i % 3) * 2), .4, 1.2), .07, -.2 + rnd() * .4);   // motes into the bowl
// ---- C midnight: a temple bell, the moon swells, a harp glide down the beam, the owl's wings, the landing
T.at(MID, whoosh(.7, 1600, 400), .16, 0);
T.at(MID + .1, bell(note(55), 4, { partials: [[1, 1], [2.32, .6], [3.87, .4], [5.9, .25]], k: 1.2, amp: 1 }), .35, 0);
T.at(MID + .1, bell(note(67), 3, { k: 1.6, amp: 1 }), .12, 0);
T.at(MID + .3, noise(1.2, { lp: t => 800 + 3000 * t, hp: 300, e: env.hann(), amp: 1 }), .06, 0);
for (let i = 0; i < 14; i++) T.at(DESC0 + i * .11, plink(pent(84, 13 - i), .8), .11, .2 - i * .02);   // harp glide down
for (let i = 0; i < 4; i++) T.at(DESC0 + .3 + i * .42, wingbeat(.6, .8), .14, -.4);
T.at(LAND, chime(note(79), .8, 1.6), .2, 0); T.at(LAND, thud(.3), .08, 0);
// the call: three ringing echoes, then the owl's hoot
for (let i = 0; i < 3; i++) T.at(ASKQ + i * .25, bell(note(86 - i * 2), 1.2, { k: 3, amp: 1 }), .18 * (1 - i * .25), .2 + i * .2);
T.at(ASKQ + 1.2, hoot(1), .3, .5);
T.at(WIPE1 - .3, whoosh(.6, 600, 3000), .3, 0);

// ---- D window 1: everyone asleep
T.at(SLEEP + .1, snore(70, 1), .5, -.3); T.at(SLEEP + 1.0, snore(110, .9), .4, 0); T.at(SLEEP + 1.7, snore(160, .8), .35, .3);
T.at(SLEEP + 2.2, snore(70, 1), .45, -.3);
T.at(SPIN1, whir(.4, 1), .16, -.4); T.at(SPIN1 + .38, click(1), .3, -.4);
for (let i = 0; i < 5; i++) T.at(SHAKE + i * .1, squeak(900, 700, .06, .6), .12, -.4);
T.at(PAN, whoosh(.8, 400, 2600), .3, 0); T.at(PAN + .05, wingbeat(1, .7), .3, 0); T.at(PAN + .4, wingbeat(.9, .7), .25, .2);
T.at(PERCH, thud(.4), .2, -.1);
// ---- window 2: the one who's awake
T.at(EXCEPT, chime(note(88), 1, 1.4), .22, 0);
for (let i = 0; i < 6; i++) T.at(PERCH + .2 + i * .14, click(.6), .14, .2);                                 // taps under the razai
T.at(REVEAL, whoosh(.4, 2000, 500), .25, .2); T.at(REVEAL + .05, crinkle(.3, 1), .25, .2);
T.at(REVEAL + .3, tone(.12, 1320, { e: env.pluck(30), amp: 1 }), .08, .3); T.at(REVEAL + .45, tone(.12, 1760, { e: env.pluck(30), amp: 1 }), .08, .3);   // the phone
T.at(REVEAL + .7, laughter(1.2, 1), .14, .3);
T.at(FOUND, hoot(1), .3, -.2);
// ---- she comes: warmth, anklets, the owl's shades
T.at(LKIN, shimmer(1.6, [note(76), note(79), note(83), note(86)], .5, .14), .18, -.4);
for (let i = 0; i < 6; i++) T.at(LKIN + .1 + i * .15, plink(note(100 + (i % 2) * 3), .5), .06, -.5);
T.at(SHADES, squeak(1200, 2400, .12, .7), .14, -.2); T.at(SHADES + .3, chime(note(96), .5, .6), .16, -.2);
T.at(NOTICE, tone(.2, t => 600 + 300 * t, { e: env.hann(), amp: 1 }), .06, .2);
T.at(GASP, noise(.35, { lp: t => 1200 + 3000 * t, hp: 400, e: env.hann(), amp: 1 }), .3, .2);                // the gasp
T.at(GASP + .3, thud(.25), .14, .3); T.at(GASP + .32, click(.8), .12, .3);                                      // phone on the razai
T.at(PRAY + .1, bell(note(81), 2.2, { partials: [[1, 1], [2.76, .45], [5.4, .2]], k: 2.4, amp: 1 }), .25, .1);   // a ghanti
T.at(PRAY + .5, bell(note(81), 2, { partials: [[1, 1], [2.76, .45], [5.4, .2]], k: 2.6, amp: 1 }), .18, .1);
// the blessing: coins pouring into the room
for (let t = COINS; t < TURN - .2; t += .09 + rnd() * .1) T.at(t + .45, coin(1800 + rnd() * 1600, 1), .1 + rnd() * .06, rnd() * .6 - .1);
T.at(COINS, shimmer(1.8, [note(84), note(88), note(91), note(96)], .6, .12), .2, 0);

// ---- E to you
T.at(TURN, whoosh(.8, 300, 1500), .2, 0); T.at(TURN + .1, wingbeat(.8, .7), .2, .3); T.at(TURN + .5, wingbeat(.7, .7), .16, .3);
T.at(YOU, chime(note(74), 1, 2.2), .16, 0);
T.at(AWAKE, shimmer(1.6, [note(86), note(91), note(95), note(98)], .6, .1), .24, 0);
T.at(AWAKE, whir(.6, 1), .12, .3); T.at(AWAKE + .58, click(1), .25, .3);
T.at(AWAKE + .55, tone(.18, t => 1800 + 1400 * t, { e: env.hann(), amp: 1 }), .06, -.1);                       // the wink
for (let t = AWAKE + .1; t < AWAKE + 2.2; t += .12 + rnd() * .1) T.at(t + .3, coin(1900 + rnd() * 1500, 1), .07, rnd() * 1.4 - .7);
// ---- F the ask
T.at(ASK, bell(note(79), 2.5, { partials: [[1, 1], [2.76, .45], [5.4, .2]], k: 2.2, amp: 1 }), .2, 0);
for (let t = ASK + .3; t < WIPE - .2; t += .3 + rnd() * .25) T.at(t, coin(2000 + rnd() * 1200, 1), .05, -.2);

// ---- the card
T.at(WIPE, whoosh(.6, 600, 3200), .3, 0);
T.at(CARD_CAP, chime(note(84), 1, 1.6), .2, 0);
[0, .15, .3].forEach((d, i) => T.at(COVERS + d, plink(note(76 + i * 4), 1), .25, -.3 + i * .3));
T.at(PRICE, click(1), .2, 0); T.at(LOGO, plink(note(88), .8), .2, 0);
T.at(PILL, plink(note(91), 1), .25, 0); T.at(PILL + .05, shimmer(.8, [note(96), note(100)], .5, .08), .12, 0);
T.at(FOLLOW, chime(note(79), .8, 1.8), .16, 0);

T.write('assets/kojagari_sfx.wav');
console.log('wrote assets/kojagari_sfx.wav');
