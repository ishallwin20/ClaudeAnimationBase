// kai_sfx.mjs: the sound effects for "No human has EVER climbed this mountain." (src/scenes/kai.js) →
// assets/kai_sfx.wav, then the mix with the voice → assets/kai_mix.wav. Times come from the voice and the timeline
// (src/scenes/kai_vo.js + kai_tl.js, loaded with vm), so they follow the picture.
// A high wind and a low drone under it all; the climbers' counter ticking up; ZERO's hit; Shiva's damru; the mountain
// shaking for Ravana; four chimes for the four rivers; the summit's wind; the gold line going round; the prayer flags
// snapping at the Dolma La; the ad 31 temple bell on the callback; the card.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, plink, clang, click, thud, shimmer, slide, drone, note, seed, chime, drum, om, wind, rumble, rockfall, thunder, damru, conch, torrent, crunch, SR } from './sfx.mjs';

const TAU = Math.PI * 2;
const TL = runInNewContext(readFileSync('src/scenes/kai_vo.js', 'utf8') + '\n' + readFileSync('src/scenes/kai_tl.js', 'utf8') + '\n;TL');
const T = track(TL.END);
seed(41);
const add = (o, b, s0, g = 1) => { const s = Math.round(s0 * SR); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j] * g; return o; };
const pop = (amp = 1, f = 1) => mixb(click(amp), tone(.07, t => f * (500 + 2600 * t / .07), { e: env.pluck(40), amp: amp * .7 }), noise(.05, { lp: 2500, hp: 300, e: env.pluck(60), amp: amp * .5 }));
const chord = (ms, d = 2, amp = 1) => { const o = new Float32Array(Math.round((d + 1) * SR)); ms.forEach((m, i) => add(o, bell(note(m), d, { partials: [[1, 1], [2, .35], [3, .12]], k: 1.4, amp }), i * .05)); return o; };
const pad = (dur, ms, amp = 1) => mixb(...ms.map((m, i) => tone(dur, t => note(m) * (1 + .003 * Math.sin(t * 2 + i)), { type: 'tri', e: env.swell(.8, .8), amp: amp / ms.length })));
const templeBell = (amp = 1) => bell(note(76), 4, { partials: [[1, 1], [2.02, .6], [2.76, .45], [4.1, .3], [5.4, .18]], k: 1.1, amp });
// flags snapping in the wind: bursts of flutter
const flutter = (dur, amp = 1) => { const n = noise(dur, { hp: 600, lp: 3800, e: env.swell(.3, .4), amp }); for (let i = 0; i < n.length; i++) { const t = i / SR; n[i] *= .25 + .75 * Math.max(0, Math.sin(t * TAU * (11 + 3 * Math.sin(t * 2.1)))) ** 3; } return n; };
const roll = (t0, n, gap = .07, amp = .8) => { for (let k = 0; k < n; k++) T.at(t0 + k * gap, damru(240 + (k % 2) * 40, amp), .22, k % 2 ? .3 : -.3); };

// ---- the bed: the high wind all through, a low drone (deeper at night)
T.at(0, wind(TL.CARD + .5, 0, 1.5), .16, -.3);
T.at(0, wind(TL.CARD + .5, 2.1, 1.5), .12, .3);
T.at(0, drone(TL.B0 + .3, 55, .9), .1, 0);
T.at(TL.D0 - .2, drone(TL.CARD - TL.D0 + .2, 55, .9), .09, 0);

// ---- A: the hook
T.at(.05, conch(2.6, 233, .7), .14, 0);
T.at(TL.MOUNTAIN, chord([62, 69, 74], 1.8, .6), .14, 0);

// ---- B: Everest and Kailash
T.at(TL.B0 - .3, whoosh(.7, 400, 2600), .25, 0);
T.at(TL.EVEREST, chime(note(81), .7, 1.6), .16, -.5);
T.at(TL.TALLER - .3, slide(.6, 300, 900, .5), .14, 0);
for (let k = 0; k < 22; k++) { const u = k / 21, tk = TL.TIMES - 1.5 + 1.6 * Math.pow(u, .7); T.at(tk, click(.5), .16, -.4); }
T.at(TL.TIMES + .1, mixb(plink(note(91)), chime(note(86), .5, 1.2)), .2, -.4);
T.at(TL.ONE - .4, whoosh(.6, 2000, 400), .18, .3);
T.at(TL.ZERO, mixb(drum(48, 1.2, 1.4), clang(note(57), .6), om(2.2, 55, .5)), .38, 0);

// ---- D: Mount Kailash, Shiva's home
T.at(TL.D0, om(TL.E0 - TL.D0 + .6, 110, .6), .12, 0);
T.at(TL.KAILASH, chord([62, 66, 69, 74], 2.4, .6), .16, 0);
roll(TL.SHIVA - .05, 10);

// ---- E: Ravana: the mountain shakes
T.at(TL.RAVANA - .1, rumble(2.2, 1), .32, 0);
T.at(TL.RAVANA, thunder(2.4, .8), .3, 0);
T.at(TL.RAVANA + .2, rockfall(1.6, .8), .18, .4);

// ---- F: four rivers
T.at(TL.F0, torrent(TL.G0 - TL.F0 + .3, .5, 1), .07, 0);
['INDUS', 'SUTLEJ', 'BRAHMA', 'KARNALI'].forEach((w, i) => T.at(TL[w], mixb(chime(note([74, 78, 81, 86][i]), .7, 1.8), shimmer(.6, [note(86 + i * 2), note(90 + i * 2)], .4, .05)), .18, [0, -.6, .6, 0][i]));

// ---- G: Messner, the north face at dusk
T.at(TL.G0, wind(TL.H0 - TL.G0 + .5, 4, .8), .2, 0);
T.at(TL.MESSNER, chime(note(69), .6, 2), .14, 0);
T.at(TL.G2 - .3, whoosh(.7, 600, 2200), .16, 0);
T.at(TL.REFUSED, mixb(drum(52, 1, 1.2), clang(note(60), .4)), .3, 0);

// ---- H: the quote
T.at(TL.H0, pad(TL.I0 - TL.H0 + .4, [62, 69, 74], .8), .1, 0);
T.at(TL.SOULS, shimmer(1.2, [note(86), note(90), note(93), note(98)], .7, .08), .2, 0);

// ---- I: forbidden
T.at(TL.FORBIDDEN, mixb(drum(44, 1.1, 1.5), om(2.0, 55, .5)), .32, 0);

// ---- J: they walk AROUND it: the line goes round
T.at(TL.J0, whoosh(1.2, 300, 3000), .2, 0);
for (let k = 0; k < 12; k++) T.at(TL.WALK + k * (TL.K0 + .3 - TL.WALK) / 12, plink(note(74 + [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24, 26][k]), .55), .12, Math.sin(k * .52) * .7);
T.at(TL.AROUND, chord([69, 74, 78], 1.8, .6), .16, 0);

// ---- K: the kora: the pass, the flags, Shiva on their right
T.at(TL.K0, flutter(TL.K2 - TL.K0 + .4, 1), .14, -.4);
T.at(TL.K0, wind(TL.K2 - TL.K0 + .5, 7, .5), .2, .2);
for (let k = 0; k < 6; k++) T.at(TL.K0 + .2 + k * .5, crunch(.5), .12, k % 2 ? .2 : -.2);
T.at(TL.PASS, chime(note(84), .6, 1.8), .16, 0);
T.at(TL.METRES, chime(note(88), .6, 1.8), .16, .3);
T.at(TL.K2 - .3, whoosh(.7, 500, 2600), .2, 0);
T.at(TL.KSHIVA, chord([62, 66, 69, 74], 2, .6), .16, 0);
roll(TL.RIGHT, 6, .08, .6);

// ---- L: pradakshina: the ad 31 bell, then Kailash
T.at(TL.L0 - .1, templeBell(1), .3, -.2);
T.at(TL.PRAD, chord([67, 71, 74, 79], 2.2, .6), .16, 0);
T.at(TL.L0 + 1.2, whoosh(1.0, 300, 2600), .2, 0);
T.at(TL.HOME, om(2.4, 110, .6), .12, 0);

// ---- M: the ask
T.at(TL.M0 - .3, whoosh(.6, 400, 3000), .22, 0);
T.at(TL.M0, pad(TL.CARD - TL.M0, [62, 66, 69], .9), .12, 0);
for (let k = 0; k < 5; k++) T.at(TL.M0 + .3 + k * .8, drum(90, .6, .3), .08, 0);
T.at(TL.YATRA, chime(note(86), .6, 1.4), .18, 0);
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

T.write('assets/kai_sfx.wav');
console.log('assets/kai_sfx.wav', TL.END.toFixed(2), 's');
// the mix: the voice at full level over the SFX, normalised to -14 LUFS
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'assets/kai_vo.wav', '-i', 'assets/kai_sfx.wav', '-filter_complex',
  `[1:a]volume=0.85[s];[0:a][s]amix=inputs=2:normalize=0:duration=longest,apad=whole_dur=${TL.END.toFixed(3)},atrim=0:${TL.END.toFixed(3)},loudnorm=I=-14:TP=-1.5:LRA=11[o]`,
  '-map', '[o]', '-ar', '48000', '-ac', '2', 'assets/kai_mix.wav']);
console.log('assets/kai_mix.wav');
