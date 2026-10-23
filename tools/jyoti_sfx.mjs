// jyoti_sfx.mjs: the sound effects for "Shiva appeared as LIGHT in 12 places in India." (src/scenes/jyoti.js) →
// assets/jyoti_sfx.wav, then the mix with the voice → assets/jyoti_mix.wav. Times come from the voice and the timeline
// (src/scenes/jyoti_vo.js + jyoti_tl.js, loaded with vm), so they follow the picture.
// A low om under the map; the void's hum; the pillar of fire's roar; Brahma's rising whoosh, Vishnu's falling one; the
// temple bell and the linga's light; a bell and a chime for each of the twelve; the Himalaya's wind, the sea at
// Rameswaram; the argued-over sites' question chimes; the card.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, plink, clang, click, shimmer, slide, drone, note, seed, rnd, chime, drum, om, rumble, thunder, conch, fire, wind, damru, SR } from './sfx.mjs';

const TAU = Math.PI * 2;
const TL = runInNewContext(readFileSync('src/scenes/jyoti_vo.js', 'utf8') + '\n' + readFileSync('src/scenes/jyoti_tl.js', 'utf8') + '\n;TL');
const T = track(TL.END);
seed(43);
const add = (o, b, s0, g = 1) => { const s = Math.round(s0 * SR); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j] * g; return o; };
const pop = (amp = 1, f = 1) => mixb(click(amp), tone(.07, t => f * (500 + 2600 * t / .07), { e: env.pluck(40), amp: amp * .7 }), noise(.05, { lp: 2500, hp: 300, e: env.pluck(60), amp: amp * .5 }));
const chord = (ms, d = 2, amp = 1) => { const o = new Float32Array(Math.round((d + 1) * SR)); ms.forEach((m, i) => add(o, bell(note(m), d, { partials: [[1, 1], [2, .35], [3, .12]], k: 1.4, amp }), i * .05)); return o; };
const pad = (dur, ms, amp = 1) => mixb(...ms.map((m, i) => tone(dur, t => note(m) * (1 + .003 * Math.sin(t * 2 + i)), { type: 'tri', e: env.swell(.8, .8), amp: amp / ms.length })));
const templeBell = (f = 76, amp = 1) => bell(note(f), 4, { partials: [[1, 1], [2.02, .6], [2.76, .45], [4.1, .3], [5.4, .18]], k: 1.1, amp });
const roll = (t0, n, gap = .07, amp = .8) => { for (let k = 0; k < n; k++) T.at(t0 + k * gap, damru(240 + (k % 2) * 40, amp), .2, k % 2 ? .3 : -.3); };
const sea = (dur, amp = 1) => { const n = noise(dur, { lp: t => 700 + 500 * Math.sin(t * .9), hp: 90, e: env.swell(1, 1), amp }); for (let i = 0; i < n.length; i++) { const t = i / SR; n[i] *= .45 + .55 * Math.max(0, Math.sin(t * TAU / 5.5)) ** 2; } return n; };

// ---- the bed: an om under the maps, the void's low hum
T.at(0, om(TL.B0 + .5, 110, .6), .1, 0);
T.at(TL.D0 - .3, om(TL.E0 - TL.D0 + .6, 110, .6), .09, 0);
T.at(TL.G0 - .3, om(TL.CARD - TL.G0 + .3, 110, .6), .09, 0);

// ---- A: the hook
T.at(.05, conch(2.8, 233, .7), .14, 0);
T.at(TL.LIGHT, mixb(chime(note(81), .7, 2), shimmer(.8, [note(86), note(90), note(93)], .5, .06)), .18, 0);
T.at(TL.TWELVE, templeBell(76, .9), .2, 0);
for (let i = 0; i < 12; i++) T.at(TL.YOU - .1 + i * .04, plink(note(84 + (i % 6) * 2), .5), .1, (i / 11 - .5) * 1.2);

// ---- B: the void; Brahma and Vishnu; the pillar of fire; up, down, no end
T.at(TL.B0, drone(TL.C0 - TL.B0 + .5, 41, .9), .14, 0);
T.at(TL.BRAHMA, chime(note(79), .6, 1.8), .16, -.5);
T.at(TL.VISHNU, chime(note(74), .6, 1.8), .16, .5);
T.at(TL.GREATER, mixb(drum(52, .8, 1), clang(note(58), .3)), .2, 0);
T.at(TL.FIRE - .4, mixb(thunder(2.6, 1), rumble(3, 1)), .34, 0);
T.at(TL.FIRE - .3, fire(TL.C0 - TL.FIRE + .6, .7, 1), .22, 0);
T.at(TL.UP - .25, whoosh(1.6, 300, 4200), .26, -.3);
T.at(TL.UP, slide(1.4, 300, 1400, .6), .1, -.3);
T.at(TL.VDOWN - .1, whoosh(1.6, 4200, 200), .26, .3);
T.at(TL.DOWN, slide(1.4, 400, 90, .7), .12, .3);
T.at(TL.NEITHER - .3, whoosh(2, 800, 200), .2, 0);
T.at(TL.ENDW, mixb(om(2.6, 55, .6), shimmer(1.8, [note(74), note(81), note(86), note(93)], .5, .2)), .2, 0);

// ---- C: the pillar was Shiva: the temple bell, the linga's light
T.at(TL.C0 - .1, templeBell(76, 1), .3, -.2);
T.at(TL.SHIVA, chord([62, 66, 69, 74], 2.4, .6), .18, 0);
roll(TL.LINGA, 8);
T.at(TL.JYOTI, mixb(shimmer(1.6, [note(86), note(90), note(93), note(98), note(102)], .7, .08), om(2.4, 110, .5)), .24, 0);

// ---- D: the twelve, a bell and a chime as each pillar rises
T.at(TL.PURANA, chime(note(74), .6, 2), .16, 0);
TL.NAMES.forEach((t, i) => { T.at(t - .12, mixb(whoosh(.3, 600, 3000), templeBell(64 + [0, 2, 4, 7, 9, 12][i % 6], .55)), .16, ((i * 7) % 12 / 11 - .5) * 1.2); T.at(t, plink(note(86 + (i % 4) * 2), .6), .14, 0); });
T.at(TL.NAMES[11] + .4, chord([62, 69, 74, 78], 2.4, .7), .2, 0);

// ---- E: Kedarnath: the Himalaya's wind
T.at(TL.E0 - .2, whoosh(.9, 400, 2600), .22, 0);
T.at(TL.E0, wind(TL.F0 - TL.E0 + .6, 1.2, .8), .22, 0);
T.at(TL.KEDAR, templeBell(72, .9), .22, -.2);
T.at(TL.METRES, chime(note(86), .6, 1.6), .16, .3);

// ---- F: Rameswaram by the sea
T.at(TL.F0, sea(TL.G0 - TL.F0 + .6, 1), .2, 0);
T.at(TL.RAMES, templeBell(69, .9), .22, .2);
T.at(TL.RAM, conch(2.2, 262, .6), .14, 0);

// ---- G: the two argued over
T.at(TL.ARGUED, mixb(drum(52, .8, 1), clang(note(60), .35)), .2, 0);
[TL.VAIDYA, TL.NAGESH].forEach(t => T.at(t, mixb(drum(48, 1, 1), chime(note(81), .6, 1.6)), .24, 0));
[TL.DEOGHAR, TL.PARLI, TL.DWARKA, TL.AUNDHA, TL.JAGESH].forEach((t, i) => T.at(t, slide(.35, note(86 + i), note(91 + i), .5), .12, (i - 2) * .3));

// ---- H: the ask
T.at(TL.H0 - .3, whoosh(.6, 400, 3000), .22, 0);
T.at(TL.H0, pad(TL.CARD - TL.H0, [62, 66, 69], .9), .12, 0);
T.at(TL.JYOTI2, chime(note(86), .6, 1.4), .18, 0);
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

T.write('assets/jyoti_sfx.wav');
console.log('assets/jyoti_sfx.wav', TL.END.toFixed(2), 's');
// the mix: the voice at full level over the SFX, normalised to -14 LUFS
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'assets/jyoti_vo.wav', '-i', 'assets/jyoti_sfx.wav', '-filter_complex',
  `[1:a]volume=0.85[s];[0:a][s]amix=inputs=2:normalize=0:duration=longest,apad=whole_dur=${TL.END.toFixed(3)},atrim=0:${TL.END.toFixed(3)},loudnorm=I=-14:TP=-1.5:LRA=11[o]`,
  '-map', '[o]', '-ar', '48000', '-ac', '2', 'assets/jyoti_mix.wav']);
console.log('assets/jyoti_mix.wav');
