// beebreath_sfx.mjs: the sound of "Bee breath with Bal Ganesha" (src/scenes/beebreath.js), a seamless 36 s loop.
//   a tanpura on Sa = C#3, a round every 4 s · a soft breath in through the nose (0–4 s of each 12 s round)
//   the hum (4–12 s): a hummed "mmm" on Sa with the low Sa under it, and the bees joining in, swelling and fading
//   a singing bowl at each in-breath; a bee or two buzzing past now and then
//   node tools/beebreath_sfx.mjs → assets/beebreath_sfx.wav
import { note, seed, bell, buzz, swarmHum } from './sfx.mjs';
import { tanpuraCycle, hum, breath, loopTrack } from './sc_audio.mjs';
seed(11);
const LOOP = 36, T = loopTrack(LOOP), SA = note(49);
for (let t = 0; t < LOOP; t += 4) tanpuraCycle(T.at, t, SA, .4);
const bowl = bell(note(73), 7, { partials: [[1, 1], [2.71, .35], [5.12, .12], [8.6, .04]], k: .55 });
for (let r = 0; r < 3; r++) {
  const t0 = r * 12;
  T.at(t0, bowl, .18, -.1);
  T.at(t0, breath(4, 1), .3, 0);
  T.at(t0 + 4, hum(8, SA), .11, 0);
  T.at(t0 + 4, hum(8, SA / 2), .05, 0);
  T.at(t0 + 4.3, swarmHum(7.5, 10, .2, 1, 230), .05, .2);
  T.at(t0 + 1 + r * .7, buzz(1.3, 250, 310), .05, -.7 + r * .7);
}
T.write('assets/beebreath_sfx.wav');
