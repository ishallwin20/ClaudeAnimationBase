// breathe_sfx.mjs: the sound of "Breathe with Bal Hanuman" (src/scenes/breathe.js), a seamless 32 s loop.
//   a tanpura drone: Pa, Sa', Sa', Sa, one cycle per 4 s phase, the jawari's bright formant sweeping up each pluck
//   the breath: soft air rising as he breathes in, falling as he breathes out, silent in the holds
//   a singing bowl at the start of each in-breath and out-breath, a small bell at each hold
// Everything past 32 s folds back onto the start, so the loop has no seam.
//   node tools/breathe_sfx.mjs  → assets/breathe_sfx.wav
import { SR, noise, bell, note, env, seed, writeWav } from './sfx.mjs';

const LOOP = 32, TAIL = 10, N = Math.round(SR * (LOOP + TAIL)), L = new Float32Array(N), R = new Float32Array(N);
const at = (t0, b, gain = 1, pan = 0) => {
  const s0 = Math.round(t0 * SR), gl = gain * Math.cos((pan + 1) * Math.PI / 4), gr = gain * Math.sin((pan + 1) * Math.PI / 4);
  for (let i = 0; i < b.length; i++) { const j = s0 + i; if (j >= 0 && j < N) { L[j] += b[i] * gl * 1.41; R[j] += b[i] * gr * 1.41; } }
};
seed(7);

// a tanpura string: 24 harmonics, the higher ones dying sooner, a formant (the jawari's buzz) sweeping up through them
function tanpura(f, dur = 5.5) {
  const n = Math.round(dur * SR), b = new Float32Array(n), H = 24;
  const ph = new Array(H).fill(0), det = Array.from({ length: H }, (_, k) => 1 + (k + 1) * 0.00035);
  for (let i = 0; i < n; i++) {
    const t = i / SR, centre = 3 + 13 * Math.min(1, t / 3.2), atk = Math.min(1, t * 250);
    let v = 0;
    for (let k = 1; k <= H; k++) {
      const a = (1 / Math.pow(k, .9)) * Math.exp(-t * (.35 + .07 * k)) * (.35 + 1.4 * Math.exp(-Math.pow((k - centre) / 2.2, 2)));
      v += a * Math.sin(2 * Math.PI * f * k * det[k - 1] * t + ph[k - 1]);
    }
    b[i] = v * atk * .22 * Math.min(1, (dur - t) / .4);
  }
  return b;
}
const SA = note(49);   // C#3, a male tanpura's Sa
const PLUCKS = [[SA * 1.5 / 2, -.35], [SA, .25], [SA, .3], [SA / 2, -.1]];   // Pa (mandra), Sa, Sa, Sa (kharaj)
const strings = PLUCKS.map(([f]) => tanpura(f));
for (let t = 0; t < LOOP; t += 4) PLUCKS.forEach(([, pan], i) => at(t + i * .95 + .05, strings[i], .5, pan));

// the breath: air through a soft filter, opening as the lungs fill, closing as they empty
const breathIn = noise(4, { hp: 180, lp: t => 450 + 1000 * Math.sin(Math.PI / 2 * t / 4), e: (t, D) => Math.sin(Math.PI * Math.min(1, t / D)) ** 1.5, amp: 1 });
const breathOut = noise(4, { hp: 140, lp: t => 1500 - 1100 * (t / 4), e: (t, D) => Math.sin(Math.PI * Math.min(1, t / D)) ** 1.2, amp: 1 });
for (let t = 0; t < LOOP; t += 16) { at(t, breathIn, .16, 0); at(t + 8, breathOut, .14, 0); }

// the turns: a singing bowl for in and out, a small bell for the holds
const bowl = f => bell(f, 7, { partials: [[1, 1], [2.71, .35], [5.12, .12], [8.6, .04]], k: .55 });
for (let t = 0; t < LOOP; t += 16) {
  at(t, bowl(note(73)), .2, -.1);          // in
  at(t + 4, bell(note(85), 2.5, { k: 2.2, partials: [[1, 1], [2.76, .25], [5.4, .08]] }), .07, .2);   // hold
  at(t + 8, bowl(note(68)), .2, .1);       // out
  at(t + 12, bell(note(80), 2.5, { k: 2.2, partials: [[1, 1], [2.76, .25], [5.4, .08]] }), .06, -.2);   // hold
}

// fold the tail back onto the start: the loop has no seam
const M = Math.round(SR * LOOP);
for (let i = M; i < N; i++) { L[i - M] += L[i]; R[i - M] += R[i]; }
writeWav('assets/breathe_sfx.wav', L.subarray(0, M), R.subarray(0, M), { peak: .5, fade: 0 });
console.log('wrote assets/breathe_sfx.wav');
