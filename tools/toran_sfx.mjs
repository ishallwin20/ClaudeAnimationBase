// toran_sfx.mjs: the sound effects for "Why mango leaves over the door?" (src/scenes/toran.js) → assets/toran_sfx.wav,
// then the mix with the voice → assets/toran_mix.wav. Times come from the voice and the timeline (src/scenes/toran_vo.js +
// toran_tl.js, loaded with vm), so they follow the picture.
// Morning at the door: birds, a breeze in the leaves, a far temple bell on frame 0; a rustle into the close-up. Torana: a
// chime, then the stone gateway lands with a low boom and desert wind. Dhruva leaves: a cold drone, one low bell. He comes
// back: a warm swell; each gate's toran rustles in, the pots knock down, the lamps puff alight with rising notes. Dwarka:
// a conch, festive bells, flags flapping as the arches rise. The kalash: a bell, a drop of water. Never decoration: a beat
// of quiet, the diyas lit one by one, the door creaks open on "someone we love", a warm pad. Lakshmi: an anklet's bells
// on every footprint, a chime on her name. The ask: a pop per toran; the state. The card.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, plink, click, shimmer, drone, note, seed, chime, thud, rnd, fire, conch, chirp, wind, crinkle, squeak, splash } from './sfx.mjs';

const TL = runInNewContext(readFileSync('src/scenes/toran_vo.js', 'utf8') + '\n' + readFileSync('src/scenes/toran_tl.js', 'utf8') + '\n;TL');
const T = track(TL.END);
seed(82);
const pop = (amp = 1, f = 1) => mixb(click(amp), tone(.07, t => f * (500 + 2600 * t / .07), { e: env.pluck(40), amp: amp * .7 }), noise(.05, { lp: 2500, hp: 300, e: env.pluck(60), amp: amp * .5 }));
const pad = (dur, ms, amp = 1) => mixb(...ms.map((m, i) => tone(dur, t => note(m) * (1 + .003 * Math.sin(t * 2 + i)), { type: 'tri', e: env.swell(.8, .8), amp: amp / ms.length })));
const templeBell = (f = 76, amp = 1) => bell(note(f), 4, { partials: [[1, 1], [2.02, .6], [2.76, .45], [4.1, .3], [5.4, .18]], k: 1.1, amp });
const boom = (amp = 1) => mixb(tone(2.2, t => 52 * Math.exp(-t * .9) + 26, { e: env.pluck(1.6), amp }), noise(.9, { lp: 380, hp: 25, brown: true, e: env.pluck(4), amp: amp * .7 }));
const rustle = (dur = .6, amp = 1) => mixb(crinkle(dur, amp), noise(dur, { hp: 2500, lp: 9000, e: env.swell(.05, dur * .6), amp: amp * .4 }));
const puff = (amp = 1) => mixb(noise(.25, { lp: 1400, hp: 120, e: env.pluck(14), amp }), fire(.4, .5 * amp, .2 * amp));
const knock = (amp = 1) => mixb(thud(amp), bell(note(62 + Math.floor(rnd() * 5)), .5, { partials: [[1, 1], [2.4, .4]], k: 6, amp: amp * .35 }));
const ghungroo = (amp = 1) => { const o = []; for (let k = 0; k < 5; k++) o.push(bell(4200 + rnd() * 2600, .35, { partials: [[1, 1], [1.6, .4]], k: 10, amp: amp * (.5 + rnd() * .5) })); return mixb(...o.map((b, k) => { const s = Math.round(k * .012 * 48000), z = new Float32Array(b.length + s); z.set(b, s); return z; })); };
const creak = (amp = 1) => mixb(squeak(180, 120, .9, amp * .6), squeak(240, 170, .7, amp * .3), noise(.9, { lp: 900, hp: 200, e: env.swell(.1, .5), amp: amp * .2 }));
const birds = (t0, t1, n, amp = 1) => { for (let k = 0; k < n; k++) { const t = t0 + rnd() * (t1 - t0), p = (rnd() - .5) * 1.4; for (let j = 0; j < 2 + Math.floor(rnd() * 3); j++) T.at(t + j * .11, chirp(1), .03 * amp, p); } };

// ---- A: morning at the door
T.at(0, wind(TL.TORANA + .5, 0, .2), .05, 0);
birds(0, TL.TORANA, 9);
T.at(0, templeBell(64, 1), .12, .3);
T.at(0, pad(TL.TORANA + .5, [62, 69, 74], .9), .05, 0);
T.at(TL.MANGO - .1, rustle(.9, 1), .07, -.2);
T.at(TL.WASNT - .4, whoosh(1.0, 500, 2200, 1), .08, 0);
T.at(TL.DECOR, rustle(.7, 1), .08, .2);
T.at(TL.DECOR + .1, chime(note(79), .6, 1.6), .07, 0);
// ---- B: toran → torana: a chime on the word, the gateway lands
T.at(TL.TORAN, chime(note(76), .7, 2), .09, 0);
T.at(TL.TORANA - .4, whoosh(.9, 300, 2600, 1), .12, 0);
T.at(TL.TORANA, mixb(boom(1), templeBell(52, .6)), .26, 0);
T.at(TL.TORANA, noise(TL.C0 - TL.TORANA + .5, { lp: t => 700 + 300 * Math.sin(t * 1.3), hp: 150, e: env.swell(.5, .6), amp: 1 }), .05, 0);
T.at(TL.GATEWAY, chime(note(83), .6, 2), .08, 0);
// ---- C: Dhruva leaves home crying: a cold drone, one low bell
T.at(TL.C0 - .1, drone(TL.D0 - TL.C0 + .6, 46, 1), .06, 0);
T.at(TL.C0, wind(TL.D0 - TL.C0 + .6, 2, .4), .05, 0);
T.at(TL.DHRUVA - .05, templeBell(50, .8), .12, 0);
T.at(TL.CRYING, tone(1.6, t => note(70) * Math.pow(2, -t / 1.6 * .25), { type: 'tri', e: env.swell(.2, .9), amp: 1 }), .05, 0);
// ---- D: he comes back: a warm swell; torans rustle in, pots knock down, lamps puff alight
T.at(TL.D0, pad(TL.E0 - TL.D0 + .6, [57, 64, 69, 73], 1), .07, 0);
T.at(TL.BACK - .2, whoosh(1.2, 300, 1800, 1), .08, 0);
const near = [0, .4, 1, 1.4, 2, 2.4, 3, 3.4];   // the nearest gates (GAP), right then left
near.forEach((g, j) => {
  const d = g * .14, pan = j % 2 ? -.4 : .5;
  T.at(TL.EVERY - .2 + d + .2, rustle(.5, .8), .05, pan);
  T.at(TL.POTS - .25 + d * .7 + .3, knock(.7), .06, pan);
  T.at(TL.LAMPS - .45 + d * .7 + .1, puff(.8), .05, pan);
  T.at(TL.LAMPS - .4 + d * .7 + .1, plink(note(74 + [0, 2, 4, 7, 9, 12, 14, 16][j]), .6), .05, pan);
});
T.at(TL.LAMPS + .2, shimmer(1.4, [74, 79, 83, 86].map(note), .5, .1), .07, 0);
// ---- E: Krishna comes home to Dwarka: a conch, festive bells, the arches rise, flags flap
T.at(TL.KRISHNA - .5, conch(2.4, 311, 1), .13, 0);
birds(TL.E0, TL.F0, 6, .8);
T.at(TL.KRISHNA, whoosh(1.4, 200, 2400, 1), .1, 0);
for (let k = 0; k < 4; k++) T.at(TL.KRISHNA + .2 + k * .3, templeBell(72 + [0, 3, 7, 12][k], .5), .06, (k - 1.5) * .3);
T.at(TL.KRISHNA, noise(TL.F0 - TL.KRISHNA + .4, { lp: t => 2200 + 1500 * Math.abs(Math.sin(t * 9)), hp: 600, e: env.swell(.4, .5), amp: 1 }), .03, .2);
T.at(TL.TORANA2, chime(note(84), .6, 2), .08, 0);
// ---- F: the kalash: a bell, a drop of water; back to the toran
T.at(TL.F0 + .1, wind(TL.G0 - TL.F0 + .5, 4, .4), .04, 0);
birds(TL.F0, TL.G0, 4, .7);
T.at(TL.KALASH - .05, templeBell(67, .8), .12, -.3);
T.at(TL.KALASH + .4, mixb(splash(.25), plink(note(88), .4)), .05, -.3);
T.at(TL.PUJA, rustle(.7, .8), .06, .2);
// ---- G: never decoration: quiet, the diyas lit one by one, the door opens, a warm pad
T.at(TL.G0, tone(TL.H0 - TL.G0 + .6, 55, { e: env.swell(1, .8), amp: 1 }), .04, 0);
for (let i = 0; i < 6; i++) { const t = TL.NEVER + .3 + i * .22; T.at(t, puff(.7), .06, (i - 2.5) * .25); T.at(t + .05, plink(note([67, 71, 74, 79, 83, 86][i]), .6), .06, (i - 2.5) * .25); }
T.at(TL.LOVE - .5, creak(1), .12, 0);
T.at(TL.LOVE - .3, pad(TL.I0 - TL.LOVE + 1, [55, 62, 67, 71, 74], 1.1), .08, 0);
T.at(TL.HOME, chime(note(79), .7, 2.4), .08, 0);
// ---- H: Lakshmi: an anklet on every footprint, a chime on her name
for (let i = 0; i < 8; i++) { const t = TL.DIWALI - .2 + (i + .1) / 8 * (TL.LAKSHMI + .9 - TL.DIWALI + .2); T.at(t, ghungroo(1), .05, (i % 2 ? .25 : -.25)); }
T.at(TL.LAKSHMI - .05, mixb(chime(note(84), .8, 3), shimmer(1.6, [79, 83, 86, 91, 95].map(note), .5, .07)), .12, 0);
// ---- I: the ask: a pop per toran; your state
T.at(TL.I0, pad(TL.CARD - TL.I0, [62, 69, 74], .8), .05, 0);
for (const [t, f] of [[TL.MANGO2 - .1, 1], [TL.MARIGOLDS - .15, 1.12], [TL.BEADS - .15, 1.25]]) { T.at(t, pop(.9, f), .12, 0); T.at(t + .05, rustle(.4, .7), .05, 0); }
T.at(TL.BEADS, ghungroo(.8), .05, 0);
T.at(TL.YOUR, pop(.7, 1.2), .12, 0);
T.at(TL.STATE, mixb(pop(1, 1.3), shimmer(.7, [note(91), note(95), note(98)], .6, .06)), .16, 0);
// ---- J: send: the mango toran back
T.at(TL.J0, rustle(.6, .8), .06, 0);
T.at(TL.SEND, chime(note(86), .6, 1.8), .1, 0);
// ---- the card
T.at(TL.CARD - .3, whoosh(.7, 400, 3200), .22, 0);
T.at(TL.CARD + .35, mixb(...[67, 71, 74, 79].map((m) => bell(note(m), 2.2, { partials: [[1, 1], [2, .35], [3, .12]], k: 1.4, amp: .7 }))), .2, 0);
for (let k = 0; k < 3; k++) T.at(TL.CARD + .7 + k * .12, pop(.8, 1 + k * .15), .22, (k - 1) * .4);
T.at(TL.CARD + 1.65, mixb(pop(1, 1.3), shimmer(.7, [note(91), note(95), note(98)], .6, .06)), .24, 0);
T.at(TL.CARD, pad(TL.END - TL.CARD, [67, 71, 74], .7), .07, 0);

T.write('assets/toran_sfx.wav');
console.log('assets/toran_sfx.wav', TL.END.toFixed(2), 's');
// the mix: the voice at full level over the SFX, normalised to -14 LUFS
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'assets/toran_vo.wav', '-i', 'assets/toran_sfx.wav', '-filter_complex',
  `[1:a]volume=0.85[s];[0:a][s]amix=inputs=2:normalize=0:duration=longest,apad=whole_dur=${TL.END.toFixed(3)},atrim=0:${TL.END.toFixed(3)},loudnorm=I=-14:TP=-1.5:LRA=11[o]`,
  '-map', '[o]', '-ar', '48000', '-ac', '2', 'assets/toran_mix.wav']);
console.log('assets/toran_mix.wav');
