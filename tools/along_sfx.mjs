// along_sfx.mjs: the sound of the Diwali aarti-along (src/scenes/along.js) → assets/along_sfx.wav, then the reel's
// track at -16 LUFS → assets/along_mix.wav. No voice and no song (any family's aarti goes over it): the hand bell rung
// all through, as in a temple; a chime as each circle begins, one step higher each time, so the count can be heard; a
// temple bell as each part begins; a soft breath as the lamp moves; a low drone and the lamps' crackle under it.
// The track is one seamless loop: every sound that rings past the end wraps round to the start, and the drone's
// pitches and swells repeat a whole number of times in LOOP, so Instagram's replay doesn't click.
// The times mirror along.js (TL, D_S, D_W, LOOP): change them together.
import { execFileSync, spawnSync } from 'node:child_process';
import { track, tone, noise, bell, whoosh, chime, crackle, note, seed, rnd, SR } from './sfx.mjs';

const TAU = Math.PI * 2, LOOP = 31, D_S = 1.4, D_W = 2.0;
const TL = { feet: [0, D_S, 4], navel: [6.5, D_S, 2], face: [10.2, D_S, 3], whole: [15.4, D_W, 7] };
const BACK = TL.whole[0] + 7 * D_W;
const T = track(LOOP);
seed(73);
// place a sound at t, wrapping what runs past the loop's end round to its start
const at = (t, b, g = 1, pan = 0) => { T.at(t, b, g, pan); if (t + b.length / SR > LOOP) T.at(t - LOOP, b, g, pan); };
// a whole number of cycles in LOOP: f rounded so the waveform meets itself at the seam
const per = f => Math.round(f * LOOP) / LOOP;

// ---- the bed: a drone on D (with its fifth and octave), breathing 8 times a loop; the lamps' crackle
{
  const N = Math.round(LOOP * SR), b = new Float32Array(N), parts = [[note(38), 1], [note(45), .45], [note(50), .3], [note(57), .12]].map(([f, a]) => [per(f), a]);
  for (let i = 0; i < N; i++) {
    const t = i / SR, sw = .75 + .25 * Math.sin(TAU * 8 * t / LOOP);
    let v = 0; for (const [f, a] of parts) v += Math.sin(TAU * f * t) * a;
    b[i] = v * sw;
  }
  T.at(0, b, .07, 0);
  const cr = crackle(LOOP, .4); for (let i = 0; i < 2400; i++) { const k = i / 2400; cr[i] *= k; cr[cr.length - 1 - i] *= k; }   // soft at the seam
  T.at(0, cr, .025, .2);
}

// ---- the hand bell (ghanti): about seven strokes a second, all the way round
const ghantiStroke = (amp = 1) => bell(note(98) * (1 + .004 * (rnd() - .5)), .5, { partials: [[1, 1], [2.4, .5], [3.9, .3], [6.1, .15]], k: 5, amp });
{ const n = Math.round(7.2 * LOOP); for (let i = 0; i < n; i++) at(i * LOOP / n + .01 * Math.sin(i * 2.3), ghantiStroke(i % 2 ? .75 : 1), .055, i % 2 ? .3 : .2); }

// ---- each part: a temple bell as it begins; a chime as each circle begins, climbing (D major pentatonic)
const templeBell = (m, amp = 1) => bell(note(m), 4, { partials: [[1, 1], [2.02, .6], [2.76, .45], [4.1, .3], [5.4, .18]], k: 1.1, amp });
const SCALE = [74, 76, 78, 81, 83, 86, 88];
for (const id in TL) {
  const [t0, d, n] = TL[id];
  at(t0, templeBell(id === 'whole' ? 62 : 74, .9), id === 'whole' ? .2 : .16, -.1);
  for (let k = 0; k < n; k++) at(t0 + k * d, chime(note(SCALE[k] - (id === 'whole' ? 12 : 0)), .9, 1.8), id === 'whole' ? .22 : .2, k % 2 ? .15 : -.15);
}
// ---- the moves: a soft breath of air as the lamp glides to the next part, and back down to her feet
for (const [a, b] of [[5.6, 6.5], [9.3, 10.2], [14.4, 15.4], [BACK, LOOP]]) at(a - .1, whoosh(b - a + .3, 300, 1800), .1, 0);
// the drop back to her feet: a falling sparkle into the next round's first bell
for (let i = 0; i < 6; i++) at(BACK + .15 + i * .2, chime(note(93 - i * 2), .5, 1.2), .07, (i % 2 ? .3 : -.3));

T.write('assets/along_sfx.wav', { fade: 0 });
console.log('assets/along_sfx.wav', LOOP, 's');

// the reel's track: the same loop at -16 LUFS (a measured, linear gain: loudnorm's own dynamics would differ at the seam)
const meas = spawnSync('ffmpeg', ['-hide_banner', '-i', 'assets/along_sfx.wav', '-af', 'loudnorm=I=-16:TP=-1.5:print_format=json', '-f', 'null', '-'], { encoding: 'utf8' }).stderr;
const I = +meas.match(/"input_i"\s*:\s*"(-?[\d.]+)"/)[1];
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'assets/along_sfx.wav', '-af', `volume=${(-16 - I).toFixed(2)}dB,alimiter=limit=0.84:attack=1:release=60:level=disabled:latency=1`, '-ar', '48000', '-ac', '2', 'assets/along_mix.wav']);
console.log('assets/along_mix.wav', `(${I.toFixed(1)} LUFS → -16)`);
