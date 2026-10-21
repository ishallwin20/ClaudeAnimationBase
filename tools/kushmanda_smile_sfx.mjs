// kushmanda_smile_sfx.mjs: the sound for ad 27 (src/scenes/kushmanda_smile.js), times from its TL. A soft forest wind
// and the lion's padding paws; a cold drone in the darkness; a high chime for the spark of her smile; a rising
// shimmer as the egg swells; the burst (a bell chord, a whoosh, a low bloom); the forest waking (a warm om, birds);
// a plink for each part of her name; a swell for the Sun; the card's chime. No music: that's added on Instagram.
//   node tools/kushmanda_smile_sfx.mjs  → assets/kushmanda_smile_sfx.wav
import { track, wind, thud, drone, om, chime, shimmer, whoosh, bell, rumble, chirp, plink, note, seed } from './sfx.mjs';

const TL = { DARK: 3.4, SMILE: 6.6, SPARK: 7.2, EGG: 8.2, BURST: 10.9, NAME: 13.2, SUN: 16.8, ASK: 20, CARD: 23.2, END: 28.4 };
const STEP = 1.15, LEGS = { hindNear: [.45, .12], foreFar: [.3, .07], hindFar: [.95, .07], foreNear: [0, .12] };
seed(27);
const T = track(TL.END);

// the forest: wind all through the walk, colder in the dark
T.at(0, wind(TL.CARD + .5, 0, 1.5), .22, -.2);
// the paws: each foot lands where its stance begins (phase 0), quieter in the dark
for (const [p0, g] of Object.values(LEGS))
  for (let k = 1; (k - p0) * STEP < TL.CARD; k++) { const t = (k - p0) * STEP; if (t > .05) T.at(t, thud(.5), g * (t > TL.DARK + 1 && t < TL.BURST ? .6 : 1), .1); }
// the darkness before creation
T.at(TL.DARK, drone(TL.BURST - TL.DARK + .4, 55), .32);
T.at(TL.DARK + .2, whoosh(1.6, 900, 200), .14, .3);
// the spark of her smile, then the egg swelling (a rising shimmer)
T.at(TL.SPARK, chime(note(96), .5, 2.5), .32, 0);
T.at(TL.SPARK + .25, chime(note(103), .4, 2), .18, .1);
[0, .7, 1.4, 2.0].forEach((d, i) => T.at(TL.EGG + d, shimmer(1.2, [note(79 + i * 2), note(83 + i * 2), note(86 + i * 2)], .5, .08), .16 + i * .04, (i % 2 ? .2 : -.2)));
T.at(TL.BURST - 1.2, whoosh(1.25, 300, 5000), .3);
// the burst
T.at(TL.BURST, bell(note(62), 4, { amp: 1 }), .3);
T.at(TL.BURST, bell(note(69), 3.5, { amp: 1 }), .22, -.2);
T.at(TL.BURST, bell(note(74), 3, { amp: 1 }), .2, .2);
T.at(TL.BURST, rumble(1.6), .25);
// the forest wakes: a warm om under the gold, and birds
T.at(TL.BURST + .3, om(TL.CARD - TL.BURST + .4, 110), .22);
[12.2, 13.9, 15.1, 16.0, 18.3, 19.4, 21.0, 22.2].forEach((t, i) => { T.at(t, chirp(1), .1, i % 2 ? .6 : -.5); T.at(t + .12, chirp(1), .08, i % 2 ? .6 : -.5); });
// her name, part by part, as the karaoke lights Ku, Ushma and Anda (13.25, 13.94, 14.64 by say()'s spread)
[TL.NAME + .05, TL.NAME + .74, TL.NAME + 1.44].forEach((t, i) => T.at(t, plink(note(84 + [0, 4, 7][i])), .3, 0));
// the Sun
T.at(TL.SUN - .4, whoosh(1.6, 400, 2500), .16, .4);
T.at(TL.SUN, bell(note(57), 4), .22, .3);
// the card
T.at(TL.CARD + .2, chime(note(88), .6, 2), .3);
T.at(TL.CARD + .8, plink(note(91)), .22);
T.at(TL.CARD + 1.7, plink(note(96)), .22);
T.write('assets/kushmanda_smile_sfx.wav');
console.log('wrote assets/kushmanda_smile_sfx.wav');
