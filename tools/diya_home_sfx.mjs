// diya_home_sfx.mjs: the sound under "Pass it on" (src/scenes/diya_home.js). Soft and sparse: music goes on in
// Instagram. Crickets in the village (loud enough at both ends that the loop joins), a shimmer as the sparks lift, air
// on the journey with a far train and far crackers, a soft catch and a rising chime for each balcony diya, a whistle up,
// the burst, the ember falling home and a warm low bell as it lands in her diya.
//   node tools/diya_home_sfx.mjs   →  assets/diya_home_sfx.wav
import { track, seed, rnd, note, chirp, shimmer, whoosh, noise, env, chime, crackle, thud, slide, rumble, bell, mixb } from './sfx.mjs';

const D = 20, T = track(D);
const LIGHT = [9.6, 10.35, 11.1, 11.85], BURST = 15.35, LAND = 18.85;
seed(7);
// crickets: pairs of chirps, scattered, in the village (0–4.2 and 16.9–20)
for (const [a, b] of [[0, 4.3], [16.9, 20]]) for (let t = a; t < b; t += .22 + rnd() * .3) { T.at(t, chirp(.5), .05 + rnd() * .04, rnd() * 1.6 - .8); T.at(t + .07, chirp(.5), .04, rnd() * 1.6 - .8); }
// the flame's soft breath under the village shots
T.at(0, noise(4.2, { lp: 900, hp: 120, e: env.swell(.05, .4), amp: .5 }), .05);
T.at(16.9, noise(3.1, { lp: 900, hp: 120, e: env.swell(.4, .05), amp: .5 }), .05);
// the sparks lift off
T.at(.9, shimmer(1.2, [84, 88, 91, 96].map(note), .8, .1), .14, .05);
T.at(3.2, whoosh(1.1, 500, 2600), .18, .1);
// the journey: air, a far train on the bridge, far crackers over the city
T.at(4.0, noise(4.6, { lp: t => 500 + 300 * Math.sin(t * 1.3), hp: 150, e: env.swell(.6, .6), amp: 1 }), .1);
T.at(5.6, rumble(2.4, .5), .07, .5);
T.at(5.6, noise(2.4, { lp: 1500, hp: 300, e: env.hann(), amp: .6 }), .04, .5);
for (const t of [6.6, 7.3, 7.9]) { T.at(t, crackle(.5, .8), .05, .5); T.at(t, thud(.4), .06, .5); }
// the balcony: the wisp swoops in, each diya catches with a chime a step higher
T.at(8.3, whoosh(.9, 2400, 700), .2, .4);
const NOTES = [72, 74, 76, 79];
LIGHT.forEach((t, i) => {
  T.at(t - .3, whoosh(.32, 900, 2600), .07, -.6 + i * .4);
  T.at(t, noise(.25, { lp: 700, hp: 80, e: env.pluck(14) }), .2, -.6 + i * .4);   // the soft catch
  T.at(t, chime(note(NOTES[i]), 1, 2.2), .2, -.6 + i * .4);
  T.at(t + .02, chime(note(NOTES[i] + 12), 1, 1.2), .05, -.6 + i * .4);
});
// a spark rises with a whistle, bursts, an ember falls home
T.at(13.1, slide(2.2, 700, 1900, .6), .05);
T.at(BURST, thud(.9), .22);
T.at(BURST, crackle(1.1, 1), .1);
T.at(BURST + .05, shimmer(1.6, [79, 84, 88, 91, 96, 100].map(note), 1, .07), .14);
T.at(15.95, slide(1.1, 1500, 500, .6), .035, -.3);
T.at(16.95, whoosh(1.9, 2600, 500), .16);
// home: it lands in her diya
T.at(LAND, noise(.3, { lp: 600, hp: 60, e: env.pluck(10) }), .22);
T.at(LAND, chime(note(60), 1, 3), .24);
T.at(LAND + .03, chime(note(67), 1, 2.5), .1);
T.write('assets/diya_home_sfx.wav');
