// kanhasleep_sfx.mjs: the sound of "Fall asleep with Kanha" (src/scenes/kanhasleep.js), a seamless 30 s loop.
//   a soft tanpura on Sa = D3 · a slow bansuri lullaby in Bhupali (S R G P D): rising as he breathes in (4 s), falling
//   as he breathes out (6 s), a little different each round · crickets, the river lapping, now and then a firefly chime
//   node tools/kanhasleep_sfx.mjs → assets/kanhasleep_sfx.wav
import { note, seed, rnd, noise, tone, env, chirp, bell, mixb } from './sfx.mjs';
import { tanpuraCycle, breath, loopTrack } from './sc_audio.mjs';
seed(19);
const LOOP = 30, T = loopTrack(LOOP), SA = note(50);
for (let t = 0; t < LOOP; t += 5) tanpuraCycle(T.at, t, SA, .3, 5);
// a bansuri: a breathy sine with a little second harmonic, a slow vibrato that opens up as the note holds
const flute = (m, d) => {
  const f = note(m), e = env.swell(.18, Math.min(.6, d * .4)), vib = t => .004 * Math.sin(t * 2 * Math.PI * 5) * Math.min(1, t / .6);
  return mixb(tone(d, t => f * (1 + vib(t)), { e, amp: 1 }), tone(d, t => 2 * f * (1 + vib(t)), { e, amp: .12 }), noise(d, { hp: f * .8, lp: f * 2.4, e, amp: .12 }));
};
const S = 74, R = 76, G = 78, P = 81, D = 83, S2 = 86, D1 = 71, P1 = 69;   // Sa = D5 for the flute
const PHRASES = [
  [[0, G, 1.2], [1.3, P, 1.1], [2.5, D, 1.5], [4.2, P, .9], [5.2, G, 1.1], [6.4, R, 1.2], [7.7, S, 1.9]],
  [[0, P, 1.2], [1.3, D, 1.1], [2.5, S2, 1.5], [4.2, D, .9], [5.2, P, 1.1], [6.4, G, 1.2], [7.7, R, 1.9]],
  [[0, G, 1.2], [1.3, R, 1.1], [2.5, G, 1.5], [4.2, R, .9], [5.2, S, 1.1], [6.4, D1, 1.2], [7.7, S, 1.9]],
];
PHRASES.forEach((ph, r) => ph.forEach(([t, m, d]) => T.at(r * 10 + t + .2, flute(m, d + .4), .11, .1)));
for (let r = 0; r < 3; r++) { T.at(r * 10, breath(4, 1, 350, 1100), .07, 0); T.at(r * 10 + 4, breath(6, -1, 300, 1000), .07, 0); }
for (let t = .2; t < LOOP; t += .7 + rnd() * .6) for (let k = 0; k < 3; k++) T.at(t + k * .05, chirp(), .008, rnd() < .5 ? -.9 : .9);
T.at(0, noise(LOOP + 2, { hp: 200, lp: 700, e: env.swell(1, 1), amp: 1 }), .02, 0);
const twinkle = bell(note(96), 1.5, { k: 2.5, partials: [[1, 1], [2.76, .2]] });
for (let i = 0; i < 9; i++) T.at(1.1 + i * 3.3, twinkle, .02, (rnd() - .5) * 1.4);
T.write('assets/kanhasleep_sfx.wav');
