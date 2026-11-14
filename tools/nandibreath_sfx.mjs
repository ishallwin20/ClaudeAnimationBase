// nandibreath_sfx.mjs: the sound of "Breathe with Nandi" (src/scenes/nandibreath.js), a seamless 30 s loop.
//   a tanpura on Sa = C3 · a far temple bell at each in-breath · a big slow bull's breath in (5 s) and out (5 s)
//   a little brass bell on his neck at each out-breath · a jingle when an ear flicks · crickets at dusk
//   node tools/nandibreath_sfx.mjs → assets/nandibreath_sfx.wav
import { note, seed, bell, chirp, rnd } from './sfx.mjs';
import { tanpuraCycle, breath, loopTrack } from './sc_audio.mjs';
seed(13);
const LOOP = 30, T = loopTrack(LOOP), SA = note(48);
for (let t = 0; t < LOOP; t += 5) tanpuraCycle(T.at, t, SA, .4, 5);
const ghanta = bell(note(68), 6, { partials: [[1, 1], [2.32, .5], [3.87, .3], [5.9, .15], [8.2, .06]], k: .7 });
const tink = bell(note(88), 1.2, { k: 3, partials: [[1, 1], [2.76, .3]] });
for (let r = 0; r < 3; r++) {
  const t0 = r * 10;
  T.at(t0, ghanta, .14, .4);
  T.at(t0, breath(5, 1, 250, 900), .26, 0);
  T.at(t0 + 5, breath(5, -1, 220, 850), .24, 0);
  T.at(t0 + 5.1, tink, .06, .05);
}
[2.3, 13.1, 21.7, 7.8, 17.4, 26.6].forEach((t, i) => { T.at(t + .05, tink, .04, i < 3 ? -.4 : .4); T.at(t + .12, tink, .025, i < 3 ? -.4 : .4); });
for (let t = .3; t < LOOP; t += .9 + rnd() * .5) for (let k = 0; k < 3; k++) T.at(t + k * .06, chirp(), .012, rnd() < .5 ? -.8 : .8);
T.write('assets/nandibreath_sfx.wav');
