// ashwatthama_trailer_sfx.mjs: the sound of the CHIRANJEEVI Issue 1 trailer (src/scenes/ashwatthama_trailer.js).
// A low drone under the whole reel; night wind and the banyan's crows, the owl's screech and wings, a heartbeat at the
// gate, a hit on "How can I sleep?", fire, the two weapons, a bell for the curse, a shimmer for the end card.
//   node tools/ashwatthama_trailer_sfx.mjs   → assets/ashwatthama_trailer_sfx.wav
import { track, drone, wind, screech, wingbeat, heart, drum, thud, fire, rumble, thunder, rockfall, whoosh, bell, chime, shimmer, note, seed } from './sfx.mjs';
const B = [0, 7.6, 11.4, 15.2, 19, 22.8, 26.6, 30.4, 36];   // the shot boundaries in the scene
seed(7);
const T = track(36);
T.at(0, drone(30.6, 55), .22);                                         // the bed, ending on the card
T.at(0, wind(7.8, 0, 1.5), .3, -.2);
T.at(.2, bell(note(45), 6), .25);                                      // a low toll under the hook
T.at(B[1] - .25, whoosh(.5, 300, 3000), .4, .3);
T.at(B[1] + .1, screech(1, 2600), .32, .4);                           // the owl
for (let i = 0; i < 4; i++) T.at(B[1] + .3 + i * .32, wingbeat(.8, 1), .35, .2);
T.at(B[2], rumble(3.8), .3);                                            // the gate
for (let i = 0; i < 5; i++) T.at(B[2] + .4 + i * .72, heart(.7), .6);
T.at(B[3] - .3, whoosh(.32, 400, 5000), .5);
T.at(B[3], drum(52, 1, 1.2), .9); T.at(B[3], thud(1), .7);              // "How can I sleep?"
T.at(B[4], fire(3.8, .6, 1), .45);                                      // the burning camp
T.at(B[5] - .2, whoosh(.3, 300, 4000), .5);
T.at(B[5], thunder(3.2, 1), .8); T.at(B[5] + .1, rockfall(2.2), .4);   // the two weapons
T.at(B[6], bell(note(41), 3.6), .5); T.at(B[6] + 1.6, bell(note(40), 2.2), .3);   // the curse
T.at(B[7], whoosh(.6, 200, 2500), .3);
T.at(B[7] + .3, shimmer(3, [note(69), note(73), note(76), note(81)], .5), .5);   // the end card
T.at(B[7] + 1.3, chime(note(81), .6, 3), .4);
T.write('assets/ashwatthama_trailer_sfx.wav');
