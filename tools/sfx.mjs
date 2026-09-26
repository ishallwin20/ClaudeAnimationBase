// sfx.mjs: a tiny sound-effects synthesizer for cartoons, in plain Node (no dependencies, no samples).
// Every sound is built from oscillators, filtered noise and struck-bell partials, so it's deterministic and
// easy to retune. A reel's sound effects are a cue list: one short .mjs file that imports this, places sounds
// at the times its shots use, and writes a WAV for `render.mjs --encode --audio=…`.
//
//   import { track, whoosh, thud, bell, note } from './sfx.mjs';
//   const T = track(12);                          // a 12-second stereo timeline
//   T.at(1.50, whoosh(.4, 600, 3500), .6, .3);    // at(time s, sound, gain, pan -1 left … 1 right)
//   T.at(2.10, thud(), .7);                       // land it on the frame the character hits the floor
//   T.at(2.40, bell(note(84), 1.5), .3);          // note(midi): 60 = middle C, 72 = an octave up
//   T.write('assets/my_sfx.wav');                 // normalized to -6 dBFS: headroom for music on top
//
//   node tools/sfx.mjs [--out=out/sfx_sampler.wav]   plays every named sound once, 1.2 s apart, and prints
//                                                     when each one starts: audition them before you pick
//
// Tips
// - Take the times straight from the scene's constants (ZAP, LAND, …), so picture and sound stay in sync.
// - Mix quietly: most cues sit at gain .2–.6. Big body sounds (rumble, thud, whoosh) mask everything else, so
//   keep them short and lower than feels right, and give small ones (plinks, clicks) more gain than you'd think.
// - Pan by where the thing is on screen. Stack two sounds for one event (a click + a pitched tone = a tap).
// - Random choices come from one seeded stream (rnd), shared in call order: the same script always writes the
//   same file, but inserting a cue early can change the grain of later noisy ones. seed(n) to pin a section.
// Example cue list: tools/modak_sfx.mjs on the reel/bappa-modak branch (the "2 AM Modak Run" reel).
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { pathToFileURL } from 'node:url';

export const SR = 48000;
const TAU = Math.PI * 2;

// ---------- building blocks ----------
let _seed = 12345;
export const seed = n => { _seed = n >>> 0; };
export const rnd = () => { _seed = (_seed * 1664525 + 1013904223) >>> 0; return _seed / 4294967296; };
export const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const lerp = (a, b, k) => a + (b - a) * k;
export const note = m => 440 * Math.pow(2, (m - 69) / 12);   // MIDI note → Hz (69 = A4 = 440)
const buf = d => new Float32Array(Math.max(1, Math.round(d * SR)));
// envelopes: (t, dur) → 0..1
export const env = {
  pluck: k => (t) => Math.exp(-t * k) * clamp(t * 400),            // instant attack, exponential decay (k: higher = shorter)
  ad: (a, d) => (t, D) => t < a ? t / a : Math.exp(-(t - a) / d),  // attack a s, then decay with time constant d
  swell: (a, r) => (t, D) => clamp(t / a) * clamp((D - t) / r),    // fade in over a, hold, fade out over the last r
  hann: () => (t, D) => Math.sin(Math.PI * clamp(t / D)) ** 2,     // smooth in and out: whooshes, sniffs
};
// an oscillator. f (Hz) may be a function of time for sweeps; fm adds phase wobble (vibrato, growl).
// type: sine | tri | saw | square
export function tone(dur, f, { type = 'sine', e = env.swell(.01, .05), fm = null, amp = 1 } = {}) {
  const b = buf(dur); let ph = 0;
  for (let i = 0; i < b.length; i++) {
    const t = i / SR; ph += (typeof f === 'function' ? f(t) : f) / SR;
    const p = ph + (fm ? fm(t) : 0), x = p - Math.floor(p);
    const v = type === 'sine' ? Math.sin(p * TAU) : type === 'tri' ? 1 - 4 * Math.abs(x - .5) : type === 'saw' ? 2 * x - 1 : x < .5 ? 1 : -1;
    b[i] = v * e(t, dur) * amp;
  }
  return b;
}
// filtered noise: a band between hp and lp (Hz; either may be a function of time). brown = integrated, rumbly.
export function noise(dur, { lp = 8000, hp = 20, e = env.swell(.01, .05), brown = false, amp = 1 } = {}) {
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
// a struck bell / marimba: [ratio, level] partials, each decaying (k: higher = shorter; high partials die first)
export function bell(f0, dur, { partials = [[1, 1], [2.76, .45], [5.4, .2], [8.9, .08]], k = 4, amp = 1 } = {}) {
  const b = buf(dur);
  for (const [r, a] of partials) for (let i = 0; i < b.length; i++) { const t = i / SR; b[i] += Math.sin(TAU * f0 * r * t) * a * Math.exp(-t * k * (1 + r * .35)) * clamp(t * 800) * amp; }
  return b;
}
// layer sounds into one (all start together; offset one by placing them separately with at())
export const mixb = (...bs) => { const o = buf(Math.max(...bs.map(b => b.length)) / SR); for (const b of bs) for (let i = 0; i < b.length; i++) o[i] += b[i]; return o; };

// ---------- the sound library ----------
// Each returns a mono buffer; amp scales it (1 is the designed level). Times are seconds, pitches Hz.
// "used for" lists what each did in the Modak reel, as a starting point.

// air moving: a band of noise sweeping f0 → f1 Hz. Up (600→3500) = whip pan, fly-by; down = a dive, a swipe
export const whoosh = (dur, f0, f1, amp = 1) => noise(dur, { lp: t => lerp(f0, f1, t / dur), hp: t => lerp(f0, f1, t / dur) * .25, e: env.hann(), amp });
// a hungry stomach: ~14 quick bubbly upward blips a second. Also: bubbling pots, potions
export const gurgle = (dur, amp = 1) => { const bs = []; for (let i = 0; i < dur * 14; i++) { const f = 140 + rnd() * 160; bs.push({ t: i / 14 + rnd() * .03, b: tone(.07, t => f * (1 + t * 9), { e: env.pluck(40), amp: amp * (.5 + rnd() * .5) }) }); } const o = buf(dur + .1); for (const { t, b } of bs) { const s = Math.round(t * SR); for (let i = 0; i < b.length && s + i < o.length; i++) o[s + i] += b[i]; } return o; };
// a big comic belly rumble (sub tones + brown noise + gurgle). Heavy: gain ~.3. Also: earthquakes, a monster nearby
export const rumble = (dur, amp = 1) => mixb(
  tone(dur, t => 42 + 8 * Math.sin(t * 11), { e: env.swell(.05, .4), amp: .9 * amp }),
  tone(dur, t => 63 + 10 * Math.sin(t * 7.3), { type: 'tri', e: (t, D) => env.swell(.05, .4)(t, D) * (.6 + .4 * Math.sin(t * TAU * 9)), amp: .5 * amp }),
  noise(dur, { brown: true, lp: 180, e: env.swell(.04, .4), amp: .8 * amp }),
  gurgle(dur, .35 * amp));
// a short pizzicato note: tiptoe steps (alternate two pitches), sneaky/mischief stings, UI blips
export const plink = (f, amp = 1) => mixb(tone(.18, f, { type: 'tri', e: env.pluck(28), amp }), tone(.12, f * 2, { e: env.pluck(40), amp: amp * .3 }));
// struck metal (1.2 s ring): ~600 Hz a brass pot on the floor, ~1300–1700 Hz a rattling padlock or chain
export const clang = (f, amp = 1) => bell(f, 1.2, { partials: [[1, 1], [2.32, .6], [3.87, .4], [5.9, .25]], k: 3.2, amp });
// a pitch glide f0 → f1: mouse squeaks (1700→2600), tiny giggles, cartoon birdies (short, 2400+)
export const squeak = (f0, f1, dur = .12, amp = 1) => tone(dur, t => lerp(f0, f1, t / dur), { e: env.hann(), amp });
// a crisp tick: buttons, taps on a phone, a switch. Pair with a short tone() for a pitched UI tap
export const click = (amp = 1) => mixb(noise(.03, { hp: 2000, lp: 9000, e: env.pluck(180), amp }), tone(.03, 1800, { e: env.pluck(200), amp: amp * .4 }));
// a body hitting the floor: a falling low tone + a puff. Landings, pratfalls, a dropped sack
export const thud = (amp = 1) => mixb(tone(.35, t => 110 * Math.exp(-t * 6) + 40, { e: env.pluck(9), amp }), noise(.15, { lp: 400, e: env.pluck(25), amp: amp * .6 }));
// electric sparks: gated bright noise. Zaps, shorts, a lightning bolt (stack with a falling saw tone())
export const crackle = (dur, amp = 1) => { const n = noise(dur, { hp: 900, lp: 7000, e: env.swell(.005, .15), amp }); let g = 1; for (let i = 0; i < n.length; i++) { if (i % 240 === 0) g = rnd() < .45 ? 1 : .08; n[i] *= g; } return n; };
// one bite: grainy noise + a low knock. Chomps, crunching snacks, a stick snapping
export const crunch = (amp = 1) => { const n = noise(.16, { hp: 700, lp: 6000, e: env.pluck(22), amp }); let g = 1; for (let i = 0; i < n.length; i++) { if (i % 160 === 0) g = .3 + rnd() * .7; n[i] *= g; } return mixb(n, tone(.12, t => 90 - t * 200, { e: env.pluck(30), amp: amp * .7 })); };
// paper handled: a paper bag, pages, leaves, curtains in a gust
export const crinkle = (dur, amp = 1) => { const n = noise(dur, { hp: 1500, lp: 8000, e: env.swell(.02, .08), amp }); let g = 1; for (let i = 0; i < n.length; i++) { if (i % 300 === 0) g = rnd() < .5 ? rnd() : 0; n[i] *= g; } return n; };
// a sparkle arpeggio: notes (Hz) struck gap s apart. Magic, "aah" reveals, an app jingle, hearts, a win
export const shimmer = (dur, notes, amp = 1, gap = .06) => { const o = buf(dur + 1); notes.forEach((f, i) => { const b = bell(f, 1, { partials: [[1, 1], [2, .3], [4, .1]], k: 3.5, amp }), s = Math.round(i * gap * SR); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j]; }); return o; };
// a muted-trumpet "wah": sad trombone when used twice, falling (note(55), then note(53))
export const wah = (f, dur, amp = 1) => { const n = tone(dur, t => f * (1 - .03 * t), { type: 'saw', e: env.swell(.04, .15), fm: t => .004 * Math.sin(t * TAU * 5.5), amp }); let l = 0; for (let i = 0; i < n.length; i++) { const t = i / SR, fc = 300 + 1500 * Math.sin(Math.PI * clamp(t / dur)) ** 2, a = 1 - Math.exp(-TAU * fc / SR); l += a * (n[i] - l); n[i] = l * 1.5; } return n; };
// a small burp (0.55 s). Loud for its size: gain ~.3
export const burp = (amp = 1) => { const d = .55; const n = tone(d, t => 88 - 20 * t, { type: 'saw', e: env.swell(.03, .12), fm: t => .5 * Math.sin(t * TAU * 31) * (.6 + .4 * Math.sin(t * 40)), amp }); let l = 0; for (let i = 0; i < n.length; i++) { const a = 1 - Math.exp(-TAU * 520 / SR); l += a * (n[i] - l); n[i] = l * 2.2; } return n; };
// a sustained pad at f Hz (with a fifth and air): suspense, a magic eye opening, a mountain rising. Low f = ominous
export const drone = (dur, f, amp = 1) => mixb(tone(dur, t => f + 2 * Math.sin(t * 3), { e: env.swell(.5, .5), amp }), tone(dur, t => f * 1.5 + 1.5 * Math.sin(t * 2.2), { type: 'tri', e: env.swell(.8, .5), amp: amp * .35 }), noise(dur, { lp: 3000, hp: 1800, e: env.swell(.8, .4), amp: amp * .08 }));
// a slide-whistle glide f0 → f1 (exponential, with vibrato): up = a boing / jolt / launch, down = a fall or dive
export const slide = (dur, f0, f1, amp = 1) => tone(dur, t => f0 * Math.pow(f1 / f0, t / dur), { e: env.swell(.02, .06), fm: t => .003 * Math.sin(t * TAU * 6), amp });

// ---------- the timeline ----------
// track(dur) → { at, write, L, R }: a stereo timeline. Sounds past either end are clipped.
export function track(dur) {
  const N = Math.round(SR * dur), L = new Float32Array(N), R = new Float32Array(N);
  // place a sound: start time (s), gain, pan -1..1 (equal-power)
  const at = (t0, b, gain = 1, pan = 0) => {
    const s0 = Math.round(t0 * SR), gl = gain * Math.cos((pan + 1) * Math.PI / 4), gr = gain * Math.sin((pan + 1) * Math.PI / 4);
    for (let i = 0; i < b.length; i++) { const j = s0 + i; if (j < 0 || j >= N) continue; L[j] += b[i] * gl * 1.41; R[j] += b[i] * gr * 1.41; }
  };
  const write = (out, o) => writeWav(out, L, R, o);
  return { at, write, L, R, dur };
}
// normalize the peak to `peak` (.5 = -6 dBFS, room for music on top), fade the last `fade` s, 16-bit stereo WAV
export function writeWav(out, L, R, { peak: target = .5, fade: fd = .05 } = {}) {
  const N = L.length;
  let peak = 0; for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
  const g = target / (peak || 1), fade = Math.round(fd * SR);
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
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, Buffer.concat([hdr, data]));
  console.log(`wrote ${out}: ${(N / SR).toFixed(2)}s, ${SR} Hz stereo, peak gain ${g.toFixed(2)}`);
}

// ---------- the sampler: node tools/sfx.mjs ----------
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
  const demos = [
    ['whoosh(.5, 600, 3500)', whoosh(.5, 600, 3500), .6], ['whoosh(.6, 1600, 300)', whoosh(.6, 1600, 300), .6],
    ['gurgle(.6)', gurgle(.6), .55], ['rumble(1)', rumble(1), .32],
    ['plink(note(72)), plink(note(84)) (a tiptoe step)', null, .6],
    ['clang(620)', clang(620), .45], ['squeak(1700, 2600)', squeak(1700, 2600, .14), .35], ['click()', click(), .5],
    ['thud()', thud(), .7], ['crackle(.5)', crackle(.5), .55], ['crunch()', crunch(), .7], ['crinkle(.5)', crinkle(.5), .45],
    ['shimmer(.5, C E G C)', shimmer(.5, [72, 76, 79, 84].map(note)), .45], ['wah(note(55)) wah(note(53))', null, .35],
    ['burp()', burp(), .3], ['drone(1, 98)', drone(1, 98), .5], ['slide(.25, 300, 520) boing', slide(.25, 300, 520), .5],
    ['slide(.6, 1600, 300) fall', slide(.6, 1600, 300), .35], ['bell(note(84), 1.5)', bell(note(84), 1.5), .3],
  ];
  const T = track(demos.length * 1.2 + 1);
  demos.forEach(([name, b, g], i) => {
    const s = .3 + i * 1.2;
    if (name.startsWith('plink')) { T.at(s, plink(note(72)), .6); T.at(s + .28, plink(note(84), .6), .4); }
    else if (name.startsWith('wah')) { T.at(s, wah(note(55), .45, .8), g); T.at(s + .45, wah(note(53), .7, .8), g); }
    else T.at(s, b, g);
    console.log(`${s.toFixed(1).padStart(5)}s  ${name}`);
  });
  T.write(args.out || 'out/sfx_sampler.wav');
}
