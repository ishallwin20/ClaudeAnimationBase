// story_review_sfx.mjs: the sound for the Book 1 review Story (src/scenes/story_review.js, 24 s); same times as its RV.
// Light and cute, like ad 53: star chimes, Mooshak's hop and squeaks, paper whooshes on the wipes, the like's pop, a
// page riffle, question-mark boings, a shimmer and a bell on the card. Music, if any, is added on Instagram.
//   node tools/story_review_sfx.mjs   → assets/story_review.wav
import { track, whoosh, plink, click, squeak, slide, shimmer, chime, crinkle, bell, note, seed, rnd } from './sfx.mjs';
const RV = { hook: 0, insta: 4.2, like: 5.6, glad: 6.4, kid: 8.6, ask: 10.9, hist: 13.4, card: 17.4, end: 24 };
const STARS = [.5, .7, .9, 1.1, 1.3], Q = [0, .25, .5, .75, 1.0, 1.2], PENTA = [0, 2, 4, 7, 9];
const T = track(RV.end); seed(7);
// the hook: each star twinkles in turn, then Mooshak hops for joy
STARS.forEach((t, i) => T.at(t, chime(note(79 + PENTA[i]), 1, 1.6), .2, (i - 2) * .25));
T.at(1.7, slide(.16, 320, 620), .2); T.at(2.12, click(.6), .18); T.at(1.85, squeak(1900, 2800, .09), .18); T.at(2.0, squeak(2100, 3000, .07), .14);
// the wipes
for (const t of [RV.insta, RV.kid, RV.hist, RV.card]) T.at(t - .05, whoosh(.45, 300, 2200), .22);
// the Insta post: the phone pops up, the like, then "So glad I did!"
T.at(RV.insta + .2, plink(note(84), .6), .22);
T.at(RV.like, click(.9), .3); T.at(RV.like + .02, plink(note(88), .9), .3); T.at(RV.like + .08, shimmer(.5, [0, 4, 7, 12].map(k => note(84 + k)), .35), .25);
T.at(RV.glad, shimmer(.6, [0, 4, 7, 12].map(k => note(72 + k)), .45), .3);
// the little one: page riffles as he re-reads, then a "?" boing for each question mark
for (const t of [RV.kid + .5, RV.kid + 1.5]) T.at(t, crinkle(.35, .8), .12);
Q.forEach((d, i) => { const t = RV.ask + d; T.at(t, slide(.2, 380 + i * 40, 760 + i * 60), .17, (rnd() - .5) * .8); T.at(t + .02, plink(note(81 + PENTA[i % 5]), .5), .12); });
T.at(RV.ask + .3, squeak(1500, 2400, .14), .14);
// "Indian history" and the review slip
T.at(RV.hist + 1.0, plink(note(79), .7), .22); T.at(RV.hist + 1.1, shimmer(.4, [0, 4, 7].map(k => note(91 + k)), .25), .18);
// the card
T.at(RV.card + .3, shimmer(.8, [0, 4, 7, 12, 16].map(k => note(72 + k)), .4), .25);
T.at(RV.card + .55, plink(note(84), .6), .2);
T.at(RV.card + 1.25, bell(note(76), 3, { partials: [[1, 1], [2.76, .5], [5.4, .25]], k: 1.2 }), .28);
T.at(RV.card + 1.65, plink(note(88), .7), .22);
T.at(RV.card + 1.95, click(.6), .16);
T.write('assets/story_review.wav');
