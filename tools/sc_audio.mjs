// tools/sc_audio.mjs: shared sounds for the Scribble breathing loops (see SCRIBBLE_GUIDE.md).
//   tanpura(f, dur)         one tanpura string: 24 harmonics, the jawari's formant sweeping up through them
//   tanpuraCycle(at, t0, sa, gain)  one round of the four strings (Pa, Sa, Sa, low Sa), 4 s
//   lowpass(b, f), hum(dur, f)      a closed-mouth "mmm" (a voice through the nose), breath(dur, dir)
//   loopTrack(loop, tail)   a timeline whose tail folds back onto its start: write(out) makes a seamless loop
import { SR, noise, tone, env, writeWav } from './sfx.mjs';

export function tanpura(f, dur = 5.5) {
  const n = Math.round(dur * SR), b = new Float32Array(n), H = 24;
  const det = Array.from({ length: H }, (_, k) => 1 + (k + 1) * 0.00035);
  for (let i = 0; i < n; i++) {
    const t = i / SR, centre = 3 + 13 * Math.min(1, t / 3.2), atk = Math.min(1, t * 250);
    let v = 0;
    for (let k = 1; k <= H; k++) v += (1 / Math.pow(k, .9)) * Math.exp(-t * (.35 + .07 * k)) * (.35 + 1.4 * Math.exp(-Math.pow((k - centre) / 2.2, 2))) * Math.sin(2 * Math.PI * f * k * det[k - 1] * t);
    b[i] = v * atk * .22 * Math.min(1, (dur - t) / .4);
  }
  return b;
}
const STR = new Map();
export function tanpuraCycle(at, t0, sa, gain = .5, period = 4) {
  const P = [[sa * 1.5 / 2, -.35], [sa, .25], [sa, .3], [sa / 2, -.1]];
  P.forEach(([f, pan], i) => { const k = f.toFixed(2); if (!STR.has(k)) STR.set(k, tanpura(f)); at(t0 + i * period * .2375 + .05, STR.get(k), gain, pan); });
}
export function lowpass(b, f, passes = 2) {
  const a = 1 - Math.exp(-2 * Math.PI * f / SR);
  for (let p = 0; p < passes; p++) { let l = 0; for (let i = 0; i < b.length; i++) { l += a * (b[i] - l); b[i] = l; } }
  return b;
}
// a hummed "mmm": a buzzy voice with vibrato, dark (the lips are closed), swelling in and out
export function hum(dur, f, amp = 1) {
  const b = tone(dur, t => f * (1 + .006 * Math.sin(t * 2 * Math.PI * 5.2) * Math.min(1, t / 1.5)), { type: 'saw', e: env.swell(.5, 1.2), amp });
  lowpass(b, 520, 3);
  for (let i = 0; i < b.length; i++) b[i] *= 3;
  return b;
}
// a breath through the nose: in (the filter opening as the lungs fill) or out (closing)
export const breath = (dur, dir = 1, lo = 450, hi = 1450) => noise(dur, { hp: 160, lp: dir > 0 ? (t => lo + (hi - lo) * Math.sin(Math.PI / 2 * t / dur)) : (t => hi - (hi - lo) * (t / dur)), e: (t, D) => Math.sin(Math.PI * Math.min(1, t / D)) ** 1.4 });

export function loopTrack(loop, tail = 10) {
  const N = Math.round(SR * (loop + tail)), L = new Float32Array(N), R = new Float32Array(N);
  const at = (t0, b, gain = 1, pan = 0) => {
    const s0 = Math.round(t0 * SR), gl = gain * Math.cos((pan + 1) * Math.PI / 4), gr = gain * Math.sin((pan + 1) * Math.PI / 4);
    for (let i = 0; i < b.length; i++) { const j = s0 + i; if (j >= 0 && j < N) { L[j] += b[i] * gl * 1.41; R[j] += b[i] * gr * 1.41; } }
  };
  const write = (out, peak = .5) => {
    const M = Math.round(SR * loop);
    for (let i = M; i < N; i++) { L[i - M] += L[i]; R[i - M] += R[i]; }
    writeWav(out, L.subarray(0, M), R.subarray(0, M), { peak, fade: 0 });
  };
  return { at, write };
}
