// hanuman_trailer_sfx.mjs: the sound of the CHIRANJEEVI Issue 2 trailers (src/scenes/hanuman_trailer.js).
//   node tools/hanuman_trailer_sfx.mjs --cut=a   → assets/hanuman_trailer_a_sfx.wav   (the baby who leapt at the Sun)
//   node tools/hanuman_trailer_sfx.mjs --cut=b   → assets/hanuman_trailer_b_sfx.wav   (he forgot his strength)
// A warm drone under the reel; cute plinks and squeaks for the baby, whooshes on the leaps, thunder on the vajra and
// on "He remembered", the Wind dropping to silence, eight chimes for the eight gifts, fire for Lanka, a shimmer on the card.
import { track, drone, wind, whoosh, thunder, drum, thud, rumble, fire, bell, chime, shimmer, plink, squeak, slide, chirp, crinkle, heart, roar, splash, torrent, note, seed } from './sfx.mjs';
const cut = (process.argv.find(a => a.startsWith('--cut=')) || '--cut=a').slice(6);
const B = [0, 4.4, 8.2, 12, 15.8, 19.6, 23.4, 27.2, 31, 37];   // the shot boundaries in the scene
seed(cut === 'a' ? 11 : 12);
const T = track(37);
T.at(0, drone(31.2, 98), .14);                                          // a warm bed, ending on the card
const card = () => {
  T.at(B[8], whoosh(.6, 200, 2500), .3);
  T.at(B[8] + .3, shimmer(3, [note(72), note(76), note(79), note(84)], .5), .5);
  T.at(B[8] + 1.3, chime(note(84), .6, 3), .4);
};
const cuteSteps = (t0, n, base) => { for (let i = 0; i < n; i++) T.at(t0 + i * .2, plink(note(base + [0, 4, 7, 12, 7, 4][i % 6]), .8), .3, (i % 2 ? .3 : -.3)); };
if (cut === 'a') {
  for (let i = 0; i < 3; i++) T.at(.4 + i * .55, squeak(900, 1300 - i * 120, .28), .22);   // the baby's wail
  T.at(2.2, squeak(1200, 700, .5), .2);
  T.at(B[1] - .2, whoosh(1.1, 300, 4500), .55, .2);                    // the leap
  cuteSteps(B[1] + .9, 5, 72);
  T.at(B[2], shimmer(2.6, [note(76), note(79), note(83), note(88)], .45), .45);   // the Sun
  T.at(B[3] + .2, plink(note(84), 1), .45); T.at(B[3] + .45, plink(note(88), 1), .45);   // a bigger fruit
  T.at(B[3] + 1.4, squeak(700, 1500, .35), .25);
  T.at(B[4] - .3, whoosh(.32, 400, 5000), .5);
  T.at(B[4], thunder(3.2, 1), .85); T.at(B[4], drum(52, 1, 1.2), .8); T.at(B[4], thud(1), .6);   // the vajra
  T.at(B[5], wind(2.4, 0, 1.8), .45);                                   // the Wind leaves… then silence
  T.at(B[5] + 2.2, bell(note(45), 2), .2);
  for (let i = 0; i < 8; i++) T.at(B[6] + .3 + i * .36, chime(note([72, 74, 76, 79, 81, 84, 86, 88][i]), .5, 1.4), .32, (i % 2 ? .25 : -.25));   // eight gifts
  T.at(B[7] + .1, slide(1.4, 900, 220), .25);                           // dizzy
  for (let i = 0; i < 5; i++) T.at(B[7] + .8 + i * .35, chirp(.8), .15, (i % 2 ? .4 : -.4));
  card();
  T.write('assets/hanuman_trailer_a_sfx.wav');
} else {
  cuteSteps(.3, 6, 74);                                                 // the naughty boy
  T.at(1.8, crinkle(.6), .35); T.at(2.6, squeak(1000, 1600, .2), .25);
  T.at(B[1], bell(note(45), 3.6), .45); T.at(B[1] + 1.6, bell(note(44), 2.2), .3);   // the curse
  T.at(B[2] + .1, slide(1.6, 900, 200), .25);                           // he forgot
  for (let i = 0; i < 4; i++) T.at(B[2] + .9 + i * .4, chirp(.8), .14, (i % 2 ? .4 : -.4));
  T.at(B[3], wind(3.8, 1, 1.5), .35);                                   // the ocean
  for (let i = 0; i < 4; i++) T.at(B[4] + .3 + i * .8, heart(.7), .55);   // Jambavan
  T.at(B[5] - .3, whoosh(.32, 400, 5000), .5);
  T.at(B[5], thunder(3.4, 1), .8); T.at(B[5], drum(48, 1, 1.4), .85); T.at(B[5] + .1, roar(1.6, 110, 6, 1), .45);   // He remembered
  T.at(B[6] - .1, whoosh(1.4, 200, 5000), .6, -.2); T.at(B[6] + .2, torrent(2.2, .6, 0), .3); T.at(B[6] + .3, splash(.8), .35);   // the leap
  T.at(B[7], fire(3.8, .5, 1), .55); T.at(B[7], rumble(3.8), .3); T.at(B[7], thud(1), .6);   // Lanka burns
  card();
  T.write('assets/hanuman_trailer_b_sfx.wav');
}
