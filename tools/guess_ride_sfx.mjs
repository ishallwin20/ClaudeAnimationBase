// guess_ride_sfx.mjs: the SFX track for "Guess whose ride I am?" (ad 53). Times from GR in src/scenes/guess_ride.js.
//   node tools/guess_ride_sfx.mjs   → assets/guess_ride_sfx.wav (music is added on Instagram)
import { track, whoosh, plink, click, squeak, slide, shimmer, wah, drum, chime, crackle, note, seed } from './sfx.mjs';
const T = track(25);
const R = [
  { a: 0, rev: 3.4, dots: [1.1, 1.9, 2.7] },
  { a: 5.4, rev: 8.8, dots: [6.5, 7.3, 8.1] },
  { a: 11.0, rev: 15.0, dots: [11.9, 12.7, 13.5, 14.3] },
];
const ASK = 17.6, CARD = 21.0;
const tick = (t, i, n) => { T.at(t, click(.8), .35); T.at(t, plink(note(76 + i * 2 + (i === n - 1 ? 2 : 0)), .8), .3); };
const tada = (t, root) => { T.at(t, whoosh(.3, 500, 4000), .22); T.at(t + .06, shimmer(.5, [0, 4, 7, 12].map(k => note(root + k))), .42); T.at(t + .1, slide(.18, 320, 640), .3); };
const hop = (t, f0 = 300) => { T.at(t, slide(.16, f0, f0 * 1.9), .22); T.at(t + .42, click(.6), .2); };
const hoot = (t, f = 430) => { T.at(t, slide(.22, f, f * .86), .3); T.at(t + .28, slide(.36, f * .96, f * .8), .3); };
const heehaw = t => { T.at(t, wah(note(64), .32, .9), .3); T.at(t + .34, wah(note(55), .5, .9), .32); T.at(t + .9, wah(note(64), .28, .8), .24); T.at(t + 1.2, wah(note(55), .42, .8), .26); };
seed(5);
// round intros (after round 1, a whoosh for the paint wipe) and the tag pop
R.forEach((r, i) => { if (i) T.at(r.a - .05, whoosh(.45, 300, 2200), .25); T.at(r.a + (i ? .1 : .05), plink(note(84), .6), .25); r.dots.forEach((d, j) => tick(d, j, r.dots.length)); });
// round 1: the mouse squeaks, then hops for joy; Bappa pops in
T.at(.6, squeak(1800, 2600, .1), .22); T.at(.78, squeak(2000, 2900, .08), .18);
tada(R[0].rev, 72); hop(R[0].rev + .05); T.at(R[0].rev + .1, squeak(2200, 3200, .12), .25); T.at(R[0].rev + .62, slide(.14, 360, 620), .18);
// round 2: the owl hoots, flaps; Lakshmi's coins chime as they fall
hoot(6.0); tada(R[1].rev, 74); hop(R[1].rev + .05, 260); hoot(R[1].rev + .4, 470);
for (let i = 0; i < 10; i++) T.at(R[1].rev + .5 + i * .16, plink(note(91 + (i * 5) % 7), .5), .14, (i % 2 ? .3 : .1));
// round 3: a sleepy snort, the long wait, the reveal and a hee-haw; a little crackle of Kalaratri's lightning
T.at(12.2, slide(.3, 160, 110), .2);
tada(R[2].rev, 69); T.at(R[2].rev + .08, drum(60, .8, .6), .35); heehaw(R[2].rev + .1); T.at(R[2].rev + .25, crackle(.35), .12, .4);
// the ask: three hops, a pop per word
T.at(ASK - .05, whoosh(.45, 300, 2200), .25); [0, 1, 2].forEach(j => hop(ASK + .35 + j * .18, 280 + j * 60));
T.at(ASK + .95, plink(note(79)), .25); T.at(ASK + 1.3, plink(note(83)), .25);
// the card
T.at(CARD - .05, whoosh(.45, 300, 2200), .25); T.at(CARD + .5, chime(note(84), .8, 2), .3); T.at(CARD + 1.0, chime(note(88), .7, 2), .22); T.at(CARD + 1.95, chime(note(91), .6, 2), .2);
T.write('assets/guess_ride_sfx.wav');
