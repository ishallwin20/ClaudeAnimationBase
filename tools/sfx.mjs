// sfx.mjs: synthesizes the sound effects for "2 AM Modak Run" (src/scenes/modak_2am.js) into one WAV, no dependencies.
// Every sound is made from oscillators and filtered noise, placed on a cue list timed to the storyboard.
// The level sits under music: Instagram's track goes on top.
//   node tools/sfx.mjs [--out=assets/modak_sfx.wav]
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const OUT = args.out || 'assets/modak_sfx.wav', SR = 48000, DUR = 35, N = SR * DUR, TAU = Math.PI * 2;
const L = new Float32Array(N), R = new Float32Array(N);

// ---------- building blocks ----------
let seed = 12345;
const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, k) => a + (b - a) * k;
const buf = d => new Float32Array(Math.max(1, Math.round(d * SR)));
// envelopes: functions of (t, dur) → 0..1
const env = {
  pluck: k => (t) => Math.exp(-t * k) * clamp(t * 400),
  ad: (a, d) => (t, D) => t < a ? t / a : Math.exp(-(t - a) / d),
  swell: (a, r) => (t, D) => clamp(t / a) * clamp((D - t) / r),
  hann: () => (t, D) => Math.sin(Math.PI * clamp(t / D)) ** 2,
};
// an oscillator whose frequency (and optional FM) are functions of time
function tone(dur, f, { type = 'sine', e = env.swell(.01, .05), fm = null, amp = 1 } = {}) {
  const b = buf(dur); let ph = 0;
  for (let i = 0; i < b.length; i++) {
    const t = i / SR; ph += (typeof f === 'function' ? f(t) : f) / SR;
    const p = ph + (fm ? fm(t) : 0), x = p - Math.floor(p);
    const v = type === 'sine' ? Math.sin(p * TAU) : type === 'tri' ? 1 - 4 * Math.abs(x - .5) : type === 'saw' ? 2 * x - 1 : x < .5 ? 1 : -1;
    b[i] = v * e(t, dur) * amp;
  }
  return b;
}
// filtered noise: lp / hp cutoffs may be functions of time; brown = integrated (rumbly)
function noise(dur, { lp = 8000, hp = 20, e = env.swell(.01, .05), brown = false, amp = 1 } = {}) {
  const b = buf(dur); let l1 = 0, l2 = 0, h = 0, prev = 0, br = 0;
  for (let i = 0; i < b.length; i++) {
    const t = i / SR; let x = rnd() * 2 - 1;
    if (brown) { br = (br + x * .06) * .996; x = br * 3; }
    const fl = typeof lp === 'function' ? lp(t) : lp, fh = typeof hp === 'function' ? hp(t) : hp;
    const al = 1 - Math.exp(-TAU * fl / SR), ah = Math.exp(-TAU * fh / SR);
    l1 += al * (x - l1); l2 += al * (l1 - l2);
    h = ah * (h + l2 - prev); prev = l2;
    b[i] = h * e(t, dur) * amp;
  }
  return b;
}
// a struck bell / marimba: inharmonic partials, each decaying
function bell(f0, dur, { partials = [[1, 1], [2.76, .45], [5.4, .2], [8.9, .08]], k = 4, amp = 1 } = {}) {
  const b = buf(dur);
  for (const [r, a] of partials) for (let i = 0; i < b.length; i++) { const t = i / SR; b[i] += Math.sin(TAU * f0 * r * t) * a * Math.exp(-t * k * (1 + r * .35)) * clamp(t * 800) * amp; }
  return b;
}
const mixb = (...bs) => { const o = buf(Math.max(...bs.map(b => b.length)) / SR); for (const b of bs) for (let i = 0; i < b.length; i++) o[i] += b[i]; return o; };
// place a sound on the timeline: gain, and pan -1..1
function at(t0, b, gain = 1, pan = 0) {
  const s0 = Math.round(t0 * SR), gl = gain * Math.cos((pan + 1) * Math.PI / 4), gr = gain * Math.sin((pan + 1) * Math.PI / 4);
  for (let i = 0; i < b.length; i++) { const j = s0 + i; if (j < 0 || j >= N) continue; L[j] += b[i] * gl * 1.41; R[j] += b[i] * gr * 1.41; }
}

// ---------- the sounds ----------
const whoosh = (dur, f0, f1, amp = 1) => noise(dur, { lp: t => lerp(f0, f1, t / dur), hp: t => lerp(f0, f1, t / dur) * .25, e: env.hann(), amp });
const gurgle = (dur, amp = 1) => { const bs = []; for (let i = 0; i < dur * 14; i++) { const f = 140 + rnd() * 160; bs.push({ t: i / 14 + rnd() * .03, b: tone(.07, t => f * (1 + t * 9), { e: env.pluck(40), amp: amp * (.5 + rnd() * .5) }) }); } const o = buf(dur + .1); for (const { t, b } of bs) { const s = Math.round(t * SR); for (let i = 0; i < b.length && s + i < o.length; i++) o[s + i] += b[i]; } return o; };
const rumble = (dur, amp = 1) => mixb(
  tone(dur, t => 42 + 8 * Math.sin(t * 11), { e: env.swell(.05, .4), amp: .9 * amp }),
  tone(dur, t => 63 + 10 * Math.sin(t * 7.3), { type: 'tri', e: (t, D) => env.swell(.05, .4)(t, D) * (.6 + .4 * Math.sin(t * TAU * 9)), amp: .5 * amp }),
  noise(dur, { brown: true, lp: 180, e: env.swell(.04, .4), amp: .8 * amp }),
  gurgle(dur, .35 * amp));
const plink = (f, amp = 1) => mixb(tone(.18, f, { type: 'tri', e: env.pluck(28), amp }), tone(.12, f * 2, { e: env.pluck(40), amp: amp * .3 }));
const clang = (f, amp = 1) => bell(f, 1.2, { partials: [[1, 1], [2.32, .6], [3.87, .4], [5.9, .25]], k: 3.2, amp });
const squeak = (f0, f1, dur = .12, amp = 1) => tone(dur, t => lerp(f0, f1, t / dur), { e: env.hann(), amp });
const click = (amp = 1) => mixb(noise(.03, { hp: 2000, lp: 9000, e: env.pluck(180), amp }), tone(.03, 1800, { e: env.pluck(200), amp: amp * .4 }));
const thud = (amp = 1) => mixb(tone(.35, t => 110 * Math.exp(-t * 6) + 40, { e: env.pluck(9), amp }), noise(.15, { lp: 400, e: env.pluck(25), amp: amp * .6 }));
const crackle = (dur, amp = 1) => { const n = noise(dur, { hp: 900, lp: 7000, e: env.swell(.005, .15), amp }); let g = 1; for (let i = 0; i < n.length; i++) { if (i % 240 === 0) g = rnd() < .45 ? 1 : .08; n[i] *= g; } return n; };
const crunch = (amp = 1) => { const n = noise(.16, { hp: 700, lp: 6000, e: env.pluck(22), amp }); let g = 1; for (let i = 0; i < n.length; i++) { if (i % 160 === 0) g = .3 + rnd() * .7; n[i] *= g; } return mixb(n, tone(.12, t => 90 - t * 200, { e: env.pluck(30), amp: amp * .7 })); };
const crinkle = (dur, amp = 1) => { const n = noise(dur, { hp: 1500, lp: 8000, e: env.swell(.02, .08), amp }); let g = 1; for (let i = 0; i < n.length; i++) { if (i % 300 === 0) g = rnd() < .5 ? rnd() : 0; n[i] *= g; } return n; };
const shimmer = (dur, notes, amp = 1, gap = .06) => { const o = buf(dur + 1); notes.forEach((f, i) => { const b = bell(f, 1, { partials: [[1, 1], [2, .3], [4, .1]], k: 3.5, amp }), s = Math.round(i * gap * SR); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j]; }); return o; };
const wah = (f, dur, amp = 1) => { const n = tone(dur, t => f * (1 - .03 * t), { type: 'saw', e: env.swell(.04, .15), fm: t => .004 * Math.sin(t * TAU * 5.5), amp }); let l = 0; for (let i = 0; i < n.length; i++) { const t = i / SR, fc = 300 + 1500 * Math.sin(Math.PI * clamp(t / dur)) ** 2, a = 1 - Math.exp(-TAU * fc / SR); l += a * (n[i] - l); n[i] = l * 1.5; } return n; };
const burp = (amp = 1) => { const d = .55; const n = tone(d, t => 88 - 20 * t, { type: 'saw', e: env.swell(.03, .12), fm: t => .5 * Math.sin(t * TAU * 31) * (.6 + .4 * Math.sin(t * 40)), amp }); let l = 0; for (let i = 0; i < n.length; i++) { const a = 1 - Math.exp(-TAU * 520 / SR); l += a * (n[i] - l); n[i] = l * 2.2; } return n; };
const drone = (dur, f, amp = 1) => mixb(tone(dur, t => f + 2 * Math.sin(t * 3), { e: env.swell(.5, .5), amp }), tone(dur, t => f * 1.5 + 1.5 * Math.sin(t * 2.2), { type: 'tri', e: env.swell(.8, .5), amp: amp * .35 }), noise(dur, { lp: 3000, hp: 1800, e: env.swell(.8, .4), amp: amp * .08 }));
const slide = (dur, f0, f1, amp = 1) => tone(dur, t => f0 * Math.pow(f1 / f0, t / dur), { e: env.swell(.02, .06), fm: t => .003 * Math.sin(t * TAU * 6), amp });
const note = (m) => 440 * Math.pow(2, (m - 69) / 12);

// ---------- the cue list (times match the storyboard / scene) ----------
// A · study
at(.05, bell(note(84), 2.5, { k: 1.4 }), .12, -.2);                       // a soft chime as the iris opens
at(2.42, slide(.22, 300, 520, .5), .5, .1);                                // jolted awake: a little boing
at(3.35, gurgle(.6, .8), .55, 0);                                          // the first gurgle
// B · rumble
at(4.0, rumble(1.35, 1), .32, 0);
at(5.2, rumble(.95, .7), .28, 0);
at(5.2, crinkle(.5, .5), .35, .4);                                         // leaves jumping
at(5.45, squeak(1700, 2600, .14), .35, -.6);                               // Mooshak wakes
at(5.72, clang(620), .45, .5); at(5.95, clang(700), .2, .5);              // the lota hits the floor, bounces
at(6.75, plink(note(79)), .35, 0); at(6.87, plink(note(75)), .3, 0);      // mischief
at(7.12, whoosh(.4, 600, 3500), .6, .3);                                  // whip pan
// C · tiptoe
for (const [i, s] of [8.15, 8.75, 9.35].entries()) { at(s, plink(note([72, 76, 74][i])), .6, -.1); at(s + .28, plink(note([84, 88, 86][i]), .6), .4, -.4); }
at(9.2, noise(.12, { lp: 3000, hp: 900, e: env.hann(), amp: .9 }), .45, .2); at(9.36, noise(.16, { lp: 3000, hp: 900, e: env.hann() }), .45, .2);   // sniff sniff
at(9.5, shimmer(.8, [72, 76, 79, 83, 86].map(note), .7, .12), .35, 0);    // floating on the smell
at(10.55, bell(note(88), .6, { k: 6 }), .45, 0);                          // "!"
// D · padlock
for (const s of [11.65, 11.95, 12.25]) { at(s, clang(1300 + rnd() * 200, .6), .25, .3); at(s + .05, clang(1700, .4), .18, .3); }
at(12.45, drone(1.1, 98, .9), .5, .2); at(12.45, shimmer(.5, [note(90), note(95)], .4, .08), .25, .3);   // the eye opens
at(13.0, crackle(.5, 1), .55, .1); at(13.0, tone(.45, t => 800 * Math.exp(-t * 4) + 60, { type: 'saw', e: env.pluck(6), amp: .5 }), .45, 0);   // ZAP
at(13.42, thud(1), .7, -.2);
for (const [i, s] of [13.5, 13.62, 13.74].entries()) at(s, squeak(2400 + i * 300, 3000 + i * 300, .06), .15, -.3);   // birdie stars
at(13.85, wah(note(55), .45, .8), .35, 0); at(14.3, wah(note(53), .7, .8), .35, 0);   // wah-wah
for (const s of [14.45, 14.76, 15.07]) at(s, noise(.05, { lp: 1200, e: env.pluck(60) }), .25, -.3);   // pats
at(15.35, bell(note(96), 1.2, { k: 3 }), .45, 0); at(15.4, bell(note(91), 1.2, { k: 3 }), .3, 0);   // idea!
at(15.55, shimmer(.4, [note(84), note(88), note(91)], .6, .05), .3, .2);  // the phone comes out
at(15.85, whoosh(.35, 800, 6000, .7), .35, 0);
// E · order
at(16.3, shimmer(.5, [72, 76, 79, 84].map(note), 1, .09), .45, 0);       // the app's jingle
at(17.25, click(1), .4, 0);
{ const taps = Array.from({ length: 20 }, (_, k) => 17.62 + .9 * Math.pow(k / 19, .62)); taps.forEach((s, k) => { at(s, click(.8), .5, .1); at(s, tone(.05, 700 * Math.pow(1.045, k), { e: env.pluck(60) }), .4, .1); }); }
at(18.52, shimmer(.6, [79, 83, 86, 91].map(note), 1, .05), .5, 0);       // 21!
at(19.2, tone(.3, t => 500 + 80 * Math.sin(t * 40), { e: env.hann(), amp: .4 }), .15, .1);   // the hover
at(19.45, click(1.2), .5, 0); at(19.5, crackle(.3, .7), .45, 0); at(19.5, slide(.3, 400, 2400, .6), .4, 0);   // ORDER: the bolt goes up
// F · meteor run
at(19.8, whoosh(.7, 300, 5000, 1), .6, -.5);                              // Vayu blasts in
at(20.2, whoosh(1.2, 200, 1800, 1.2), .6, .6);                            // the big meteor passes
at(20.68, slide(.45, 500, 1400, .7), .3, 0); at(20.9, slide(.25, 1400, 700, .6), .25, 0);   // wheee (the loop)
at(21.3, whoosh(.7, 300, 2500, 1), .55, .5);                              // the duck
at(21.55, squeak(900, 600, .15, .7), .3, 0);
for (let i = 0; i < 5; i++) at(19.9 + i * .7 + rnd() * .3, whoosh(.4, 900, 3000, .5), .2, rnd() * 2 - 1);
at(22.1, drone(1.3, 65, .8), .25, 0);                                      // the mountain rises
at(22.85, slide(.6, 1600, 300, .8), .35, .2);                             // the dive
at(23.46, noise(.3, { lp: 5000, hp: 200, e: env.pluck(10) }), .45, 0);    // poof, into the window
// G · delivery
at(23.6, noise(1.2, { lp: t => 900 + 1800 * Math.sin(Math.PI * t / 1.2), hp: 150, e: env.ad(.08, .5), amp: 1.2 }), .75, -.3);   // the gust
at(23.65, crinkle(.7, .8), .35, .3);                                      // curtains and paper
at(24.1, squeak(2000, 1500, .1), .3, .7);                                 // Mooshak, flattened
at(24.55, bell(note(100), .5, { k: 7 }), .35, -.2);                       // shades up: a glint
at(25.35, shimmer(.5, [84, 88, 91, 96].map(note), .7, .05), .3, .1);     // starstruck
at(25.9, crinkle(.35, 1), .5, 0);                                         // the handoff
at(26.4, crinkle(.4, .9), .45, 0); at(26.45, drone(1, note(60), .5), .3, 0); at(26.5, shimmer(.8, [60, 64, 67, 72].map(note), .5, .12), .3, 0);   // the bag opens: aah
at(27.2, crinkle(.25, .6), .3, 0);
at(27.98, crunch(1), .7, 0); at(28.2, crunch(1), .7, 0);                  // chomp, chomp
at(28.33, tone(.25, t => 300 * Math.exp(-t * 7) + 90, { e: env.pluck(10) }), .5, 0);   // gulp
at(28.3, shimmer(.6, [79, 84, 88].map(note), .5, .08), .3, 0);           // hearts
at(28.4, whoosh(.35, 500, 3000, .7), .35, 0);                             // the phone rises
[28.86, 28.98, 29.1, 29.22, 29.34].forEach((s, i) => { at(s, click(.6), .25, 0); at(s, bell(note([84, 86, 88, 91, 93][i]), .9, { k: 4 }), .4, (i - 2) * .2); });   // five stars
at(29.4, shimmer(1, [84, 88, 91, 96, 100].map(note), .6, .05), .35, 0);
at(29.72, whoosh(.3, 2500, 500, .6), .3, 0);
at(29.95, bell(note(96), .4, { k: 9 }), .3, -.3);                         // salute
at(30.3, whoosh(.6, 400, 6000, 1.2), .6, -.4);                            // gone
at(30.45, noise(1.1, { lp: t => 600 + 2200 * Math.sin(Math.PI * t / 1.1), hp: 120, e: env.hann(), amp: 1.1 }), .6, 0);   // the wind wipe
// I · after, and the lock
at(31.95, burp(1), .3, 0);
at(32.3, squeak(1100, 1500, .1, .5), .2, 0); at(32.42, squeak(1200, 1700, .1, .5), .2, 0);   // a tiny giggle
at(32.45, whoosh(.35, 600, 3500), .55, .3);
at(33.05, drone(1.9, 55, 1), .35, 0); at(33.05, tone(.55, t => 70 + 30 * Math.sin(t * 25), { type: 'saw', e: env.hann(), amp: .25 }), .35, 0);   // the eye creaks open
at(33.65, noise(.12, { lp: 4000, hp: 1500, e: env.hann() }), .25, -.4);  // the glance
at(33.95, mixb(tone(.9, t => 55 * Math.exp(-t * 2) + 35, { e: env.pluck(4) }), bell(note(62), 1.2, { k: 2.5 })), .4, 0);   // dun.
at(34.25, slide(.6, 700, 180, .5), .2, 0);

// ---------- master: normalize to -6 dBFS (headroom under the music), 16-bit stereo WAV ----------
let peak = 0; for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
const g = .5 / (peak || 1), fade = Math.round(.05 * SR);
const data = Buffer.alloc(N * 4);
for (let i = 0; i < N; i++) {
  const f = i > N - fade ? (N - i) / fade : 1;
  data.writeInt16LE(Math.round(clamp(L[i] * g * f, -1, 1) * 32767), i * 4);
  data.writeInt16LE(Math.round(clamp(R[i] * g * f, -1, 1) * 32767), i * 4 + 2);
}
const hdr = Buffer.alloc(44);
hdr.write('RIFF', 0); hdr.writeUInt32LE(36 + data.length, 4); hdr.write('WAVE', 8); hdr.write('fmt ', 12);
hdr.writeUInt32LE(16, 16); hdr.writeUInt16LE(1, 20); hdr.writeUInt16LE(2, 22); hdr.writeUInt32LE(SR, 24); hdr.writeUInt32LE(SR * 4, 28); hdr.writeUInt16LE(4, 32); hdr.writeUInt16LE(16, 34);
hdr.write('data', 36); hdr.writeUInt32LE(data.length, 40);
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, Buffer.concat([hdr, data]));
console.log(`wrote ${OUT}: ${DUR}s, ${SR} Hz stereo, peak gain ${g.toFixed(2)}`);
