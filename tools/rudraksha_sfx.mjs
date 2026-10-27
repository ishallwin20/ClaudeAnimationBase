// rudraksha_sfx.mjs: the sound effects for "Count the lines on your RUDRAKSHA" (src/scenes/rudraksha.js) →
// assets/rudraksha_sfx.wav, then the mix with the voice → assets/rudraksha_mix.wav. Times come from the voice and the
// timeline (src/scenes/rudraksha_vo.js + rudraksha_tl.js, loaded with vm), so they follow the picture.
// The bead: a low hum and a shimmer as its lines glow; the numerals a climbing plink each. The night: wind, crickets,
// an om under Shiva in tapas; his eyes open on a swell, the tear falls (a glassy glint, a falling whoosh) and lands (a
// drop, a deep boom, a ring of shimmer); the tree grows on a rising swell and a rustle. The name, a chord; the fruit
// cracks open. The count: a swoosh as each bead turns, a tick that climbs a step for every line, a bell on the number.
// The heap rattles; Kalagni roars; the mala clicks bead by bead and swells on CRORE; the list pops in; the card.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, plink, click, shimmer, drone, note, seed, chime, drum, conch, om, wind, chirp, fire, thud, splash, rnd, SR } from './sfx.mjs';

const TL = runInNewContext(readFileSync('src/scenes/rudraksha_vo.js', 'utf8') + '\n' + readFileSync('src/scenes/rudraksha_tl.js', 'utf8') + '\n;TL');
const T = track(TL.END);
seed(56);
const add = (o, b, s0, g = 1) => { const s = Math.round(s0 * SR); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j] * g; return o; };
const pop = (amp = 1, f = 1) => mixb(click(amp), tone(.07, t => f * (500 + 2600 * t / .07), { e: env.pluck(40), amp: amp * .7 }), noise(.05, { lp: 2500, hp: 300, e: env.pluck(60), amp: amp * .5 }));
const chord = (ms, d = 2, amp = 1) => { const o = new Float32Array(Math.round((d + 1) * SR)); ms.forEach((m, i) => add(o, bell(note(m), d, { partials: [[1, 1], [2, .35], [3, .12]], k: 1.4, amp }), i * .05)); return o; };
const pad = (dur, ms, amp = 1) => mixb(...ms.map((m, i) => tone(dur, t => note(m) * (1 + .003 * Math.sin(t * 2 + i)), { type: 'tri', e: env.swell(.8, .8), amp: amp / ms.length })));
const templeBell = (f = 74, amp = 1) => bell(note(f), 4, { partials: [[1, 1], [2.02, .6], [2.76, .45], [4.1, .3], [5.4, .18]], k: 1.1, amp });
const whooshAt = (t, amp = .2, d = .7) => T.at(t - d / 2, whoosh(d, 400, 2600), amp, 0);
const swell = (d, f0, f1, amp = 1) => mixb(noise(d, { lp: t => lerp(f0, f1, t / d), hp: 80, e: (t, D) => Math.pow(t / D, 2) * (1 - Math.pow(Math.max(0, t / D - .92) / .08, 2)), amp }), tone(d, t => lerp(110, 220, t / d), { type: 'tri', e: (t, D) => Math.pow(t / D, 2), amp: amp * .3 }));
const rustle = (d, amp = 1) => { const n = noise(d, { hp: 1800, lp: 7000, e: env.swell(.3, .4), amp }); let g = 1; for (let i = 0; i < n.length; i++) { if (i % 400 === 0) g = rnd() < .5 ? .2 : 1; n[i] *= g; } return n; };
const SCALE = [74, 76, 78, 81, 83, 86, 88, 90, 93, 95, 98, 100, 102, 105];   // D major pentatonic, climbing: one step a line
function lerp(a, b, k) { return a + (b - a) * k; }

// ---- the studio bed: a low hum under every bead shot; the night bed under the forest
const studioSpans = [[0, TL.C0 + .4], [TL.BLUE + .1, TL.CARD]];
for (const [a, b] of studioSpans) T.at(a, drone(b - a, 65.4, .8), .08, 0);
T.at(TL.C0, wind(TL.BLUE + .6 - TL.C0, 0, 1), .07, -.2);
for (let t = TL.C0 + .3; t < TL.BLUE; t += .35 + rnd() * .5) T.at(t, mixb(chirp(.5), chirp(.4)), .025, rnd() * 1.6 - .8);

// ---- A: the hook: a temple bell, the lines' shimmer
T.at(.05, templeBell(74, .8), .18, -.2);
T.at(.05, shimmer(1.4, [note(86), note(90), note(93), note(98)], .5, .1), .1, 0);
// ---- B: the numerals light, one plink each; GOD: a chord
whooshAt(TL.B0, .16);
for (let i = 0; i < 14; i++) T.at(TL.B0 + .3 + i * .13, plink(note(SCALE[i])), .08, (i / 13 - .5) * 1.2);
T.at(TL.GOD, chord([62, 66, 69, 74], 2, .6), .15, 0);

// ---- C: Shiva in tapas: an om, a conch far off
T.at(TL.C0 + .2, om(TL.D0 - TL.C0 + .6, 98, 1), .16, 0);
T.at(TL.PURANA - .4, conch(2.4, 233, .5), .08, .2);
// ---- D: his eyes open on a swell; the tear glints and falls
T.at(TL.OPENED - .5, shimmer(1.6, [note(81), note(86), note(90), note(93), note(98)], .6, .12), .12, 0);
T.at(TL.EYES, mixb(bell(note(105), 1.2, { partials: [[1, 1], [2.4, .3]], k: 4 }), bell(note(110), 1, { k: 5 })), .09, -.3);
T.at(TL.TEARS, tone(1.1, t => 2400 - 1500 * t, { e: env.swell(.05, .3), amp: .5 }), .05, -.2);
whooshAt(TL.E0 - .1, .26, 1.0);
// ---- E: the tear lands: a drop, a boom, a ring of light; the tree grows
const IMP = TL.WHERE - .1;
T.at(IMP, mixb(tone(.25, t => 900 * Math.exp(-t * 18) + 300, { e: env.pluck(20), amp: .9 }), splash(.4)), .2, 0);
T.at(IMP, thud(1), .3, 0); T.at(IMP, drum(45, 1, 1.4), .25, 0);
T.at(IMP + .05, shimmer(2, [note(74), note(81), note(86), note(93), note(98), note(102)], .6, .08), .14, 0);
T.at(IMP + .2, swell(TL.GREW + .7 - IMP - .2, 300, 4000, 1), .1, 0);
T.at(IMP + .8, rustle(TL.F0 + .5 - IMP - .8, 1), .05, .3);
for (let i = 0; i < 8; i++) T.at(IMP + .5 + i * .12 + .4, plink(note(93 + (i % 4) * 2), .6), .05, (i % 2 ? .5 : -.5));
// ---- F: rudra · aksha: a chord; EYE: the temple bell
T.at(TL.RUDRA - .05, chord([62, 69, 74], 1.6, .6), .12, -.2);
T.at(TL.AKSHA - .05, chord([66, 69, 78], 1.6, .6), .12, .2);
T.at(TL.EYE - .1, templeBell(74, .9), .2, 0);
// ---- G: into the canopy; the fruit cracks open on SEED
whooshAt(TL.G0 + .6, .2, 1.4);
T.at(TL.BLUE, plink(note(98), .8), .1, 0);
T.at(TL.SEED - .4, mixb(click(1), noise(.18, { hp: 500, lp: 5000, e: env.pluck(14), amp: .8 }), tone(.2, 220, { e: env.pluck(14), amp: .4 })), .22, 0);
T.at(TL.SEED - .3, shimmer(1.2, [note(81), note(86), note(90)], .6, .07), .1, 0);
// ---- H: count its lines: each line a rising glint
for (let i = 0; i < 5; i++) T.at(TL.LINES - .2 + i * .14, tone(.9, t => note(81 + i * 2) * (1 + .5 * t), { type: 'tri', e: env.swell(.05, .5), amp: .5 }), .06, (i - 2) * .3);

// ---- I: the count
for (const G of TL.GODS) {
  whooshAt(G.a + .15, .18, .6);
  const dt = Math.min(.9, 1.1 - G.n * .02);
  for (let i = 0; i < G.n; i++) T.at(G.num + .3 + i * dt / G.n, plink(note(SCALE[i]), .9), .1, (i / Math.max(1, G.n - 1) - .5) * .8);
  T.at(G.num, chime(note(G.n > 9 ? 69 : 74), .9, 1.6), .14, 0);
  T.at(G.name - .15, shimmer(1.2, [note(86), note(90), note(93)], .5, .06), .08, 0);
}

// ---- J: the heap rattles; FIVE: a drum
T.at(TL.J0 - .1, (() => { const o = new Float32Array(Math.round(1.8 * SR)); for (let i = 0; i < 40; i++) add(o, click(.4 + rnd() * .6), rnd() * 1.4 * Math.pow(rnd(), .5)); return o; })(), .2, 0);
T.at(TL.FIVE1 - .05, drum(60, 1, .9), .28, 0); T.at(TL.FIVE1 - .05, pop(.8, .9), .14, 0);
// Kalagni: the fire of time rises and roars
T.at(TL.RUDRA5 - .5, fire(TL.K0 + .3 - TL.RUDRA5 + .5, .3, 1), .22, 0);
T.at(TL.KALAGNI - .05, drum(42, 1, 1.6), .32, 0); T.at(TL.KALAGNI - .05, thud(1), .25, 0);
for (let i = 0; i < 5; i++) T.at(TL.FIVE2 + i * .12 + .3, plink(note(SCALE[i] - 12), .9), .1, (i - 2) * .3);

// ---- K: the mala: a click each bead; CRORE: a swell and a chord
for (let t = TL.K0 + .05, i = 0; t < TL.CRORE - .1; t += 1 / 2.2, i++) T.at(t, mixb(click(.7), tone(.05, 1200 + (i % 2) * 200, { e: env.pluck(80), amp: .3 })), .12, .2);
T.at(TL.MANTRA - .6, swell(TL.CRORE - TL.MANTRA + .6, 300, 6000, 1), .12, 0);
T.at(TL.CRORE - .1, chord([62, 66, 69, 74, 78, 81], 3, .9), .24, 0);
T.at(TL.CRORE - .05, templeBell(74, 1), .2, 0);
for (let k = 0; k < 24; k++) T.at(TL.CRORE - .1 + k * .02, plink(note(86 + (k % 6) * 2), .4), .05, (k % 3 - 1) * .5);

// ---- L: the list pops in; the ask
whooshAt(TL.L0, .16);
for (let i = 0; i < 14; i++) T.at(TL.L0 + .3 + i * .05, pop(.35, 1 + i * .04), .07, (i < 7 ? -.3 : .3));
T.at(TL.SAVE - .05, chime(note(81), .8, 1.6), .14, 0);
T.at(TL.M0, pad(TL.CARD - TL.M0, [62, 66, 69], .9), .1, 0);
T.at(TL.YOURS - .05, plink(note(86)), .14, 0);
T.at(TL.COMMENT - .05, mixb(plink(note(93)), click(.6)), .18, 0);

// ---- the card
T.at(TL.CARD - .3, whoosh(.7, 400, 3200), .3, 0);
T.at(TL.CAP_T, chord([67, 71, 74, 79], 2.2, .7), .25, 0);
for (let k = 0; k < 3; k++) T.at(TL.COVERS + k * .12, pop(.8, 1 + k * .15), .3, (k - 1) * .4);
T.at(TL.PRICE, pop(.6, .9), .2, 0);
T.at(TL.PILL, mixb(pop(1, 1.3), shimmer(.7, [note(91), note(95), note(98)], .6, .06)), .32, 0);
T.at(TL.CARD, pad(TL.END - TL.CARD, [67, 71, 74], .7), .08, 0);

T.write('assets/rudraksha_sfx.wav');
console.log('assets/rudraksha_sfx.wav', TL.END.toFixed(2), 's');
// the mix: the voice at full level over the SFX, normalised to -14 LUFS
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'assets/rudraksha_vo.wav', '-i', 'assets/rudraksha_sfx.wav', '-filter_complex',
  `[1:a]volume=0.85[s];[0:a][s]amix=inputs=2:normalize=0:duration=longest,apad=whole_dur=${TL.END.toFixed(3)},atrim=0:${TL.END.toFixed(3)},loudnorm=I=-14:TP=-1.5:LRA=11[o]`,
  '-map', '[o]', '-ar', '48000', '-ac', '2', 'assets/rudraksha_mix.wav']);
console.log('assets/rudraksha_mix.wav');
