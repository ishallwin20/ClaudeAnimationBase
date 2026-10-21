// shani_forms_sfx.mjs: the sound effects for the Shani forms reel (src/scenes/shani_forms.js), under the Lyria score.
// Times match the scene (a form every 6 s from 6 s). Sparse, the score carries it: a gong-like boom and a low wind on
// the hook; on every change, the shadow's whoosh and a shimmer as the gold sheen crosses the next painting; an om and a
// conch under the ask; the card's chimes. Then it mixes the score (assets/shani_forms_score.mp3, Lyria take 3 of 3 from
// tools/shani_forms_score.txt: its hits land on the 6 s grid, a drum at 36 s, the chant from ~53 s) under the effects.
//   node tools/shani_forms_sfx.mjs   → assets/shani_forms_sfx.wav and assets/shani_forms_mix.wav
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { track, noise, mixb, whoosh, shimmer, env, note, seed, rnd, wind, drum, om, conch, chime, bell } from './sfx.mjs';

const TL = { ASK: 54, CARD: 60, END: 66 }, F = i => 6 + i * 6;
const T = track(TL.END);
seed(28);
const boom = (f = 32, amp = 1, len = 2.2) => mixb(drum(f, amp, len), noise(.8, { brown: true, lp: 220, e: env.pluck(3), amp: 1.3 * amp }));
const pent = [0, 2, 4, 7, 9, 12];

// ---------- the hook ----------
T.at(0, mixb(boom(30, 1, 3), bell(note(45), 4, { partials: [[1, 1], [2.1, .5], [3.3, .3]], k: .6 })), .55);
T.at(0, wind(F(0), 1, 1), .08, -.4); T.at(0, wind(F(0), 4, 1), .06, .4);
T.at(2.7, shimmer(1.8, pent.map(i => note(74 + i)), 1, .12), .07);

// ---------- each painting: the shadow sweeps the last away, a shimmer as the sheen crosses the new one ----------
for (let i = 0; i <= 8; i++) {
  const t0 = i < 8 ? F(i) : TL.ASK;
  if (i > 0) T.at(t0 - .6, whoosh(1.1, 160, 1800, 1), .22, rnd() * .6 - .3);
  if (i < 8) T.at(t0 + .5, shimmer(1.6, pent.map(k => note(76 + k + (i % 3) * 2)), 1, .1), .06, rnd() * .6 - .3);
}

// ---------- the ask ----------
T.at(TL.ASK + .2, om(5.6, 98, 1), .12);
T.at(TL.ASK + 3, conch(2.6, 311, 1), .14);

// ---------- the card ----------
T.at(TL.CARD, chime(note(84), 1, 3), .18, -.2); T.at(TL.CARD + .25, chime(note(88), 1, 3), .16, .2); T.at(TL.CARD + 1.3, chime(note(91), 1, 3), .14);

T.write('assets/shani_forms_sfx.wav');

const SCORE = 'assets/shani_forms_score.mp3';
if (existsSync(SCORE)) {
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', SCORE, '-i', 'assets/shani_forms_sfx.wav', '-filter_complex', [
    `[0:a]aresample=48000,atrim=0:${TL.END},asetpts=PTS-STARTPTS,afade=t=out:st=${TL.END - 1.2}:d=1.2,volume=0.6[m]`,
    '[1:a]volume=1.2[s]', '[m][s]amix=inputs=2:duration=longest:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=14,aresample=48000[o]'].join(';'),
    '-map', '[o]', '-t', String(TL.END), '-ar', '48000', '-ac', '2', 'assets/shani_forms_mix.wav'], { stdio: 'inherit' });
  console.log('wrote assets/shani_forms_mix.wav');
}
