// kumbhabreath_sfx.mjs: the sound of "Breathe with Kumbhakarna" (src/scenes/kumbhabreath.js), a seamless 28 s loop.
//   in (4 s): a huge rattling snore rising · hold (4 s): silence, the myna's two chirps and its hop
//   out (6 s): lips pursed, a long falling whistle over a soft "pffff", the lamp's flame fluttering
//   a very soft tanpura under it all, so it still feels like the breathing series
//   node tools/kumbhabreath_sfx.mjs → assets/kumbhabreath_sfx.wav
import { SR, note, seed, noise, tone, env, chirp, plink, mixb } from './sfx.mjs';
import { tanpuraCycle, lowpass, loopTrack } from './sc_audio.mjs';
seed(17);
const LOOP = 28, T = loopTrack(LOOP), SA = note(47);
for (let t = 0; t < LOOP; t += 7) tanpuraCycle(T.at, t, SA, .18, 7);
// the snore: a low buzz whose pitch and loudness rise as he breathes in, the soft palate flapping ~30 times a second
function snore(dur) {
  const b = mixb(tone(dur, t => 62 + 26 * t / dur, { type: 'saw', e: (t, D) => Math.sin(Math.PI * Math.min(1, t / D)) ** .8 }), noise(dur, { hp: 120, lp: 1200, e: (t, D) => Math.sin(Math.PI * Math.min(1, t / D)), amp: .8 }));
  for (let i = 0; i < b.length; i++) { const t = i / SR; b[i] *= .35 + .65 * Math.max(0, Math.sin(t * 2 * Math.PI * (24 + 10 * t / dur))) ** 2; }
  return lowpass(b, 900, 2);
}
// the out-breath: a whistle falling, over air through pursed lips
const whistle = d => tone(d, t => 1500 - 650 * (t / d) ** .8, { e: (t, D) => Math.min(1, t / .3) * Math.min(1, (D - t) / .8) * (.85 + .15 * Math.sin(t * 2 * Math.PI * 6)), fm: t => .002 * Math.sin(t * 40) });
const pff = d => noise(d, { hp: 600, lp: 3800, e: (t, D) => Math.min(1, t / .25) * Math.min(1, (D - t) / 1) });
for (let r = 0; r < 2; r++) {
  const t0 = r * 14;
  T.at(t0, snore(4), .5, -.2);
  T.at(t0 + 5.25, chirp(), .12, .5); T.at(t0 + 5.38, chirp(), .1, .5);
  T.at(t0 + 5.55, plink(note(84)), .08, .5); T.at(t0 + 6.15, plink(note(79)), .08, .5);
  T.at(t0 + 8.2, whistle(5.2), .13, -.2);
  T.at(t0 + 8.1, pff(5.6), .18, -.2);
}
T.write('assets/kumbhabreath_sfx.wav');
