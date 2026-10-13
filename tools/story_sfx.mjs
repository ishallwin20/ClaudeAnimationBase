// story_sfx.mjs: the sound for the two Instagram Story ads (src/scenes/story_book1.js, story_set.js); same times as
// their TL. Soft and devotional: an Om bed, wind or night air, bells, a conch on the goddess's name, chimes for lights.
//   node tools/story_sfx.mjs   → assets/story_book1.wav, assets/story_set.wav
import { track, bell, whoosh, note, seed, rnd, wind, om, conch, chime, chirp } from './sfx.mjs';
const PENTA = [0, 2, 4, 7, 9];

// ---------- Book 1 (13 s): night on Kailash → dawn, Shailputri → the cover and ₹200 ----------
{
  const TL = { night: 0, dawn: 4.0, name: 6.6, card: 8.0, price: 9.0, end: 13 }, T = track(TL.end); seed(1);
  T.at(0, wind(TL.dawn + .8, 0, .4), .2, -.5); T.at(0, wind(TL.dawn + .8, 2, .4), .2, .5);
  T.at(0, om(TL.end, 98, 1), .22);
  T.at(0, bell(note(57), 4, { partials: [[1, 1], [2.4, .5], [3.9, .3]], k: .8 }), .3);
  T.at(TL.dawn - .3, whoosh(1.2, 400, 2500, 1), .12);
  for (let i = 0; i < 6; i++) T.at(TL.dawn + .3 + i * .5 + rnd() * .2, chirp(1), .05 + rnd() * .03, rnd() * 1.4 - .7);
  T.at(TL.name - .2, conch(2.4, 311, 1), .28);
  T.at(TL.card + .25, chime(note(84), 1, 3), .2, -.2); T.at(TL.card + .45, chime(note(88), 1, 3), .18, .2); T.at(TL.card + .7, chime(note(91), 1, 3), .16);
  T.at(TL.price, bell(note(76), 3, { partials: [[1, 1], [2.76, .5], [5.4, .25]], k: 1.2 }), .3);
  T.write('assets/story_book1.wav');
}

// ---------- the set (14 s): three diyas, three covers → the fan of three and ₹500 ----------
{
  const TL = { open: 0, b: [2.4, 4.4, 6.4], set: 8.4, price: 9.5, end: 14 }, T = track(TL.end); seed(2);
  T.at(0, om(TL.end, 98, 1), .22); T.at(.5, om(TL.end - .5, 147, 1), .08, .2);
  T.at(0, bell(note(57), 4, { partials: [[1, 1], [2.4, .5], [3.9, .3]], k: .8 }), .3);
  TL.b.forEach((t0, i) => { T.at(t0 - .25, whoosh(.5, 300, 3000, 1), .12, (i - 1) * .5); T.at(t0, chime(note(74 + PENTA[i * 2]), 1, 3), .22, (i - 1) * .5); T.at(t0 + .15, bell(note(62 + i * 2), 2.5, { partials: [[1, 1], [2.4, .5], [3.9, .3]], k: 1.2 }), .16); });
  T.at(TL.set, conch(2.4, 311, 1), .26);
  for (let i = 0; i < 5; i++) T.at(TL.set + .5 + i * .12, chime(note(84 + PENTA[i]), 1, 2.5), .12, (i - 2) * .3);
  T.at(TL.price, bell(note(76), 3, { partials: [[1, 1], [2.76, .5], [5.4, .25]], k: 1.2 }), .3);
  T.write('assets/story_set.wav');
}
