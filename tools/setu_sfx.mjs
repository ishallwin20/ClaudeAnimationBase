// setu_sfx.mjs: the sound effects for "This bridge across the SEA was built in FIVE DAYS." (src/scenes/setu.js) →
// assets/setu_sfx.wav, then the mix with the voice → assets/setu_mix.wav. Times come from the voice and the timeline
// (src/scenes/setu_vo.js + setu_tl.js, loaded with vm), so they follow the picture.
// The sea's surf under it all; a conch for the hook; the army's murmur at dawn; three nights of crickets and the camp fire;
// the bow's twang, the fire arrows and their thunder, the waves rising; the Ocean god's shimmer; NALA's hit; rocks and
// trees crashing into the sea; a drum for each of the five days; the Milky Way's bells; the army's march; the card.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, plink, clang, click, thud, shimmer, slide, drone, note, seed, rnd, chime, drum, om, rumble, thunder, conch, torrent, crunch, splash, chirp, fire, SR } from './sfx.mjs';

const TAU = Math.PI * 2;
const TL = runInNewContext(readFileSync('src/scenes/setu_vo.js', 'utf8') + '\n' + readFileSync('src/scenes/setu_tl.js', 'utf8') + '\n;TL');
const T = track(TL.END);
seed(42);
const add = (o, b, s0, g = 1) => { const s = Math.round(s0 * SR); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j] * g; return o; };
const pop = (amp = 1, f = 1) => mixb(click(amp), tone(.07, t => f * (500 + 2600 * t / .07), { e: env.pluck(40), amp: amp * .7 }), noise(.05, { lp: 2500, hp: 300, e: env.pluck(60), amp: amp * .5 }));
const chord = (ms, d = 2, amp = 1) => { const o = new Float32Array(Math.round((d + 1) * SR)); ms.forEach((m, i) => add(o, bell(note(m), d, { partials: [[1, 1], [2, .35], [3, .12]], k: 1.4, amp }), i * .05)); return o; };
const pad = (dur, ms, amp = 1) => mixb(...ms.map((m, i) => tone(dur, t => note(m) * (1 + .003 * Math.sin(t * 2 + i)), { type: 'tri', e: env.swell(.8, .8), amp: amp / ms.length })));
// the sea: surf washing in and out
const surf = (dur, ph = 0, amp = 1) => { const n = noise(dur, { lp: t => 700 + 500 * Math.sin(t * .9 + ph), hp: 90, e: env.swell(1.2, 1.2), amp }); for (let i = 0; i < n.length; i++) { const t = i / SR; n[i] *= .45 + .55 * Math.max(0, Math.sin(t * TAU / 5.5 + ph)) ** 2; } return n; };
// an army's murmur: a low band of voices rising and falling
const murmur = (dur, amp = 1) => { const n = noise(dur, { lp: 900, hp: 220, e: env.swell(.8, .8), amp }); for (let i = 0; i < n.length; i++) { const t = i / SR; n[i] *= .5 + .5 * Math.sin(t * TAU * (3.1 + Math.sin(t * .7))) ** 2; } return n; };
const crickets = (dur, amp = 1) => { const o = new Float32Array(Math.round((dur + .2) * SR)); for (let t = 0; t < dur; t += .26 + rnd() * .1) for (let k = 0; k < 3; k++) add(o, chirp(amp * (.5 + rnd() * .5)), t + k * .05); return o; };
const twang = (amp = 1) => mixb(tone(.6, t => 180 * (1 + .5 * Math.exp(-t * 30)), { type: 'tri', e: env.pluck(7), amp }), click(amp * .8), noise(.08, { hp: 2000, lp: 8000, e: env.pluck(50), amp: amp * .4 }));
const roll = (t0, n, gap = .07, amp = .8) => { for (let k = 0; k < n; k++) T.at(t0 + k * gap, drum(90 + (k % 2) * 20, amp, .3), .14, k % 2 ? .3 : -.3); };

// ---- the bed: the sea all through (quieter on the maps), a low drone
T.at(0, surf(TL.CARD + .5, 0, 1), .16, -.35);
T.at(0, surf(TL.CARD + .5, 2.4, 1), .13, .35);
T.at(0, drone(TL.CARD, 55, .8), .07, 0);

// ---- A: the hook
T.at(.05, conch(2.6, 233, .7), .14, 0);
T.at(TL.SEA, chime(note(74), .6, 1.6), .14, -.3);
T.at(TL.FIVE, chord([62, 69, 74], 1.8, .7), .18, 0);

// ---- B: India from the sky, Ram Setu
T.at(TL.B0 - .3, whoosh(1.2, 300, 2600), .22, 0);
T.at(TL.SETU, mixb(chime(note(81), .7, 1.8), shimmer(.6, [note(86), note(90), note(93)], .4, .06)), .18, 0);
T.at(TL.WASNT, mixb(drum(48, 1, 1.2), om(1.6, 55, .4)), .3, 0);

// ---- C: the army reaches the sea at dawn
T.at(TL.C0, murmur(TL.D0 - TL.C0 + .6, 1), .1, -.2);
T.at(TL.VANARAS, mixb(drum(70, .8, .5), conch(1.6, 262, .5)), .14, 0);
T.at(TL.LANKA, chime(note(76), .6, 2), .16, .5);

// ---- D: three nights: crickets, the fire, a bell each night; it never came
T.at(TL.D0, crickets(TL.E0 - TL.D0 + .3, .5), .08, .4);
T.at(TL.D0, fire(TL.E0 - TL.D0 + 4, .4, .6), .1, -.3);
for (let k = 0; k < 3; k++) T.at(TL.NIGHTS - .2 + k * .75, bell(note(69 - k * 2), 2.4, { partials: [[1, 1], [2.02, .5], [2.76, .35], [4.1, .2]], k: 1.4, amp: .8 }), .14, (k - 1) * .4);
T.at(TL.NEVER, om(2.4, 55, .5), .14, 0);

// ---- E: the bow, the fire arrows, the waves like mountains
T.at(TL.BOW - .1, twang(1), .3, -.3);
for (let i = 0; i < 4; i++) { const t0 = TL.BOW + .05 + i * .32;
  T.at(t0, mixb(whoosh(.9, 2400, 500), fire(.9, .5, .3)), .2, -.3 + i * .2);
  T.at(t0 + .9, mixb(thunder(1.8, .8), splash(1), drum(44, 1, 1.2)), .3, -.3 + i * .25); }
T.at(TL.WAVES, mixb(rumble(3, 1), torrent(3.2, 1, .6)), .22, 0);

// ---- F: the Ocean god rises
T.at(TL.GOD - .4, mixb(om(3.4, 110, .7), shimmer(2.2, [note(74), note(78), note(81), note(86), note(90), note(93)], .6, .18)), .2, 0);
T.at(TL.GOD, conch(2.8, 196, .7), .14, 0);
T.at(TL.CANNOT, pad(TL.G0 - TL.CANNOT + .6, [50, 57, 62], .9), .1, 0);

// ---- G: NALA, son of Vishwakarma; the bridge's line; "I will hold it"
T.at(TL.NALA, mixb(drum(48, 1.2, 1.4), chord([62, 69, 74, 78], 2.4, .7)), .32, 0);
T.at(TL.VISHWA, clang(note(64), .6), .16, .3);
T.at(TL.BRIDGE - .3, mixb(whoosh(1.8, 300, 2400), shimmer(1.4, [note(74), note(78), note(81), note(86)], .4, .3)), .18, 0);
T.at(TL.HOLD, chord([62, 66, 69, 74], 2.2, .6), .16, 0);

// ---- H, I: rocks and trees crashing into the sea; five days, a drum and a chime for each
for (let t = TL.HURLED - .2; t < TL.DEND; t += .22 + rnd() * .3) { const r = rnd();
  T.at(t, r < .5 ? mixb(splash(.7 + rnd() * .3), thud(.4)) : mixb(crunch(.6), splash(.5)), .12 + rnd() * .06, rnd() * 1.2 - .6); }
T.at(TL.ELEPHANTS, mixb(drum(52, 1, 1.2), rumble(1.4, .6)), .26, 0);
TL.D.forEach((t, i) => { T.at(t - .25, whoosh(.5, 500, 2400), .14, 0); T.at(t, mixb(drum(50 + i * 3, 1.1, 1), chime(note(74 + [0, 2, 4, 7, 12][i]), .7, 1.8)), .28, 0); });
TL.DN.forEach((t, i) => T.at(t, plink(note(86 + i * 2), .7), .16, .3));

// ---- J: 100 long, 10 wide
T.at(TL.J0 - .3, whoosh(.8, 300, 2600), .2, 0);
T.at(TL.HUNDRED, chime(note(86), .7, 1.6), .18, -.3);
T.at(TL.TEN, chime(note(81), .7, 1.6), .18, .3);

// ---- K: the gods watched; the Milky Way on the sea
T.at(TL.K0, pad(TL.L0 - TL.K0 + .6, [62, 69, 74, 81], .9), .12, 0);
for (let k = 0; k < 14; k++) T.at(TL.GODS + k * .3, bell(note([86, 90, 93, 98, 93, 90][k % 6]), 1.4, { partials: [[1, 1], [2, .3], [4, .1]], k: 3, amp: .5 }), .1, Math.sin(k * 1.7) * .7);
T.at(TL.MILKY, shimmer(1.6, [note(86), note(90), note(93), note(98), note(102)], .7, .09), .2, 0);

// ---- L: the army crosses: a march, Ram, Hanuman, Lakshman, Angad
for (let t = TL.L0; t < TL.M0; t += .5) T.at(t, drum(66, .8, .4), .12, 0);
T.at(TL.L0, murmur(TL.M0 - TL.L0 + .5, 1), .08, 0);
T.at(TL.XRAM, conch(2.2, 262, .6), .14, 0);
[[TL.HANUMAN, 81], [TL.LAKSHMAN, 78], [TL.ANGAD, 83]].forEach(([t, m]) => T.at(t, chime(note(m), .7, 1.6), .16, 0));

// ---- M: today: the shoals
T.at(TL.M0 - .3, whoosh(1, 300, 2600), .2, 0);
T.at(TL.KM, chime(note(84), .6, 1.8), .16, 0);
T.at(TL.SETU2, chord([62, 66, 69, 74], 2.4, .7), .2, 0);

// ---- N: the ask
T.at(TL.N0 - .3, whoosh(.6, 400, 3000), .22, 0);
T.at(TL.N0, pad(TL.CARD - TL.N0, [62, 66, 69], .9), .12, 0);
T.at(TL.RAMESWARAM, chime(note(86), .6, 1.4), .18, 0);
T.at(TL.CITY, mixb(plink(note(96)), click(.6)), .3, 0);

// ---- N: the card
T.at(TL.CARD - .3, whoosh(.7, 400, 3200), .3, 0);
T.at(TL.CAP_T, chord([67, 71, 74, 79], 2.2, .7), .25, 0);
for (let k = 0; k < 3; k++) T.at(TL.COVERS + k * .12, pop(.8, 1 + k * .15), .3, (k - 1) * .4);
T.at(TL.PRICE, pop(.6, .9), .2, 0);
T.at(TL.STRIKE, mixb(noise(.28, { lp: 4200, hp: 900, e: env.hann(), amp: .8 }), clang(note(88), .5)), .3, 0);
T.at(TL.DEAD, plink(note(91)), .2, 0);
T.at(TL.PILL, mixb(pop(1, 1.3), shimmer(.7, [note(91), note(95), note(98)], .6, .06)), .32, 0);
T.at(TL.CARD, pad(TL.END - TL.CARD, [67, 71, 74], .7), .08, 0);

T.write('assets/setu_sfx.wav');
console.log('assets/setu_sfx.wav', TL.END.toFixed(2), 's');
// the mix: the voice at full level over the SFX, normalised to -14 LUFS
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'assets/setu_vo.wav', '-i', 'assets/setu_sfx.wav', '-filter_complex',
  `[1:a]volume=0.85[s];[0:a][s]amix=inputs=2:normalize=0:duration=longest,apad=whole_dur=${TL.END.toFixed(3)},atrim=0:${TL.END.toFixed(3)},loudnorm=I=-14:TP=-1.5:LRA=11[o]`,
  '-map', '[o]', '-ar', '48000', '-ac', '2', 'assets/setu_mix.wav']);
console.log('assets/setu_mix.wav');
