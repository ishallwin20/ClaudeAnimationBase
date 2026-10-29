// shaligram_sfx.mjs: the sound of "This stone is 150 MILLION years old" (src/scenes/shaligram.js) → assets/shaligram_sfx.wav,
// then the mix with the voice → assets/shaligram_mix.wav. Times come from the voice and the timeline (shaligram_vo.js +
// shaligram_tl.js, loaded with vm), so they follow the picture.
// A low drone under the studio and the altar; a temple bell on the hook; the diya's crackle; a chord for SHALIGRAM and a
// glassy turn to cold on SCIENCE. The stage: night air, a chime for Tulsi, the tear's drop; the curse swells and booms,
// the light falls (whoosh) and lands as stone (thud, crack, dust); the river of light flows and shimmers, the bush
// rustles up; a bell on BANK. The carving grinds and glints. The split cracks open. Under the sea: a muffled hum and
// bubbles, a deep tone as the ammonite turns to stone; the rise and the splash, waves and gulls of the old shore, a far
// sauropod's low call. The crash rumbles and booms; the range rises on a swell, wind on HIMALAYAS. The map: high wind,
// the river drawing on a shimmer. Same · same · same: three hits. The puja: a hand bell, leaves, the pour. The Gita: a
// conch and an om. The riverbed: water and birds. A leaf lands. The ask. The card.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, plink, click, shimmer, drone, note, seed, chime, drum, conch, om, wind, chirp, fire, thud, splash, rumble, crackle, torrent, rnd, SR } from './sfx.mjs';

const TL = runInNewContext(readFileSync('src/scenes/shaligram_vo.js', 'utf8') + '\n' + readFileSync('src/scenes/shaligram_tl.js', 'utf8') + '\n;TL');
const T = track(TL.END);
seed(61);
const lerp = (a, b, k) => a + (b - a) * k;
const add = (o, b, s0, g = 1) => { const s = Math.round(s0 * SR); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j] * g; return o; };
const chord = (ms, d = 2, amp = 1) => { const o = new Float32Array(Math.round((d + 1) * SR)); ms.forEach((m, i) => add(o, bell(note(m), d, { partials: [[1, 1], [2, .35], [3, .12]], k: 1.4, amp }), i * .05)); return o; };
const pad = (dur, ms, amp = 1) => mixb(...ms.map((m, i) => tone(dur, t => note(m) * (1 + .003 * Math.sin(t * 2 + i)), { type: 'tri', e: env.swell(.8, .8), amp: amp / ms.length })));
const templeBell = (f = 74, amp = 1) => bell(note(f), 4, { partials: [[1, 1], [2.02, .6], [2.76, .45], [4.1, .3], [5.4, .18]], k: 1.1, amp });
const handBell = (amp = 1) => bell(note(93), 2.2, { partials: [[1, 1], [2.4, .5], [3.9, .3], [5.6, .15]], k: 2.4, amp });
const whooshAt = (t, amp = .2, d = .7) => T.at(t - d / 2, whoosh(d, 400, 2600), amp, 0);
const swell = (d, f0, f1, amp = 1) => mixb(noise(d, { lp: t => lerp(f0, f1, t / d), hp: 80, e: (t, D) => Math.pow(t / D, 2) * (1 - Math.pow(Math.max(0, t / D - .92) / .08, 2)), amp }), tone(d, t => lerp(110, 220, t / d), { type: 'tri', e: (t, D) => Math.pow(t / D, 2), amp: amp * .3 }));
const rustle = (d, amp = 1) => { const n = noise(d, { hp: 1800, lp: 7000, e: env.swell(.3, .4), amp }); let g = 1; for (let i = 0; i < n.length; i++) { if (i % 400 === 0) g = rnd() < .5 ? .2 : 1; n[i] *= g; } return n; };
const grind = (d, amp = 1) => { const n = noise(d, { hp: 2500, lp: 9000, e: env.swell(.1, .3), amp }); for (let i = 0; i < n.length; i++) { const t = i / SR; n[i] *= .4 + .6 * Math.abs(Math.sin(t * TAU * (13 + 4 * Math.sin(t * 3)))); } return n; };
const crack = (amp = 1) => mixb(click(amp), noise(.25, { hp: 600, lp: 7000, e: env.pluck(16), amp: amp * .9 }), tone(.3, t => 180 * Math.exp(-t * 8) + 60, { e: env.pluck(12), amp: amp * .6 }));
const bubbles = (d, amp = 1) => { const o = new Float32Array(Math.round((d + .3) * SR)); for (let t = 0; t < d; t += .05 + rnd() * .25) add(o, tone(.06, x => (300 + rnd() * 500) * (1 + x * 14), { e: env.pluck(40), amp: amp * (.3 + rnd() * .7) }), t); return o; };
const water = (d, amp = 1) => noise(d, { lp: t => 1400 + 500 * Math.sin(t * 1.3), hp: 300, e: env.swell(.6, .6), amp });
const lowpass = (b, fc) => { let l = 0; const a = 1 - Math.exp(-TAU * fc / SR); for (let i = 0; i < b.length; i++) { l += a * (b[i] - l); b[i] = l; } return b; };
const TAU = Math.PI * 2;

// ---- beds: the studio/altar drone; the stage's night air; the sea's hum; the mountains' wind; the riverbed's water
const bed = (a, b, f, g) => T.at(a, drone(b - a, f, .8), g, 0);
bed(0, TL.D0 + .4, 65.4, .07);                      // studio + altar
bed(TL.G0, TL.H0 + .4, 65.4, .06);                  // split
bed(TL.M0, TL.N0 + .4, 61.7, .06); bed(TL.P0, TL.CARD, 65.4, .07);
T.at(TL.D0, wind(TL.G0 + .4 - TL.D0, 0, 1), .045, -.2);
T.at(TL.H0, lowpass(noise(TL.AGO + .15 - TL.H0, { lp: 500, hp: 40, e: env.swell(.5, .2), brown: true, amp: 1 }), 600), .25, 0);
T.at(TL.H0, bubbles(TL.AGO - TL.H0, 1), .05, .3);
T.at(TL.K0, wind(TL.GANDAKI2 - TL.K0, 1, .6), .07, .2);
T.at(TL.N0, wind(TL.O0 + .4 - TL.N0, 2, 1), .06, -.2);
T.at(TL.GANDAKI2 - .5, water(TL.L0 + .5 - TL.GANDAKI2, 1), .05, 0);
T.at(TL.O0, water(TL.P0 + .4 - TL.O0, 1), .06, 0);
for (let t = TL.O0 + .3; t < TL.P0; t += .4 + rnd() * .7) T.at(t, mixb(chirp(.6), chirp(.4)), .02, rnd() * 1.4 - .7);

// ---- A: the hook: a temple bell, a shimmer
T.at(.05, templeBell(74, .9), .2, -.1);
T.at(.05, shimmer(1.4, [note(86), note(90), note(93), note(98)], .5, .1), .1, 0);
T.at(TL.MILLION - .05, chord([50, 57, 62], 2.4, .8), .12, 0);
// ---- B: the altar: the diya, a hand bell on VISHNU
T.at(TL.B0, fire(TL.C0 + .4 - TL.B0, .25, .35), .05, -.3);
T.at(TL.VISHNU - .05, handBell(.8), .12, .2);
// ---- C: SHALIGRAM a chord; SCIENCE: a glassy turn to cold
T.at(TL.SHALIGRAM - .05, chord([62, 66, 69, 74], 2, .7), .14, 0);
T.at(TL.SCIENCE - .35, mixb(whoosh(.6, 3000, 600, 1), tone(1.4, t => note(98) * (1 - .02 * t), { e: env.swell(.05, .9), amp: .5 })), .12, 0);

// ---- D: Tulsi: a chime; the tear drops; the curse booms; the light falls and lands as stone
T.at(TL.D0 + .3, chime(note(86), .7, 2.4), .08, -.3);
T.at(TL.TULSI1 + .45, mixb(tone(.2, t => 1400 * Math.exp(-t * 14) + 500, { e: env.pluck(24), amp: .8 }), splash(.3)), .07, -.3);
T.at(TL.CURSED - .3, swell(TL.STONE1 + .1 - TL.CURSED + .3, 200, 3000, 1), .1, 0);
T.at(TL.STONE1 - .05, drum(42, 1, 1.6), .3, 0); T.at(TL.STONE1 - .05, rumble(1.4, 1), .12, 0);
whooshAt(TL.STONE2 + .15, .26, .6);
const LAND = TL.STONE2 + .3;
T.at(LAND, thud(1), .4, .2); T.at(LAND, drum(38, 1, 1.4), .3, .2); T.at(LAND + .02, crack(1), .2, .2);
T.at(LAND + .1, noise(1.2, { lp: 1200, hp: 200, e: env.swell(.02, 1), amp: 1 }), .05, .2);
// ---- E: the river of light, the bush, the bank
T.at(TL.RIVER1 - .2, mixb(torrent(TL.F0 + .4 - TL.RIVER1, .5, .4)), .07, -.2);
T.at(TL.RIVER1 - .1, shimmer(2, [note(81), note(86), note(90), note(93), note(98), note(102)], .6, .1), .1, -.2);
T.at(TL.TULSI2 - .3, rustle(1.8, 1), .06, -.4); T.at(TL.TULSI2 - .2, chord([66, 69, 74, 78], 2.2, .6), .1, -.3);
T.at(TL.BANK - .05, templeBell(74, .8), .16, .1);
// ---- F: the carving: a fine grind, glints
T.at(TL.TINY - .1, grind(TL.CHAKRAS + .6 - TL.TINY, 1), .05, 0);
for (let t = TL.TINY; t < TL.CHAKRAS + .5; t += .18 + rnd() * .2) T.at(t, plink(note(93 + Math.floor(rnd() * 3) * 2), .6), .04, rnd() - .5);
T.at(TL.CHAKRAS - .05, chime(note(81), .9, 2), .14, 0);
// ---- G: the split
T.at(TL.INSIDE - .2, crack(1), .3, 0); T.at(TL.INSIDE - .1, whoosh(.7, 600, 3000, 1), .14, .3);
T.at(TL.SPIRAL1 - .05, shimmer(1.6, [note(74), note(78), note(81), note(86), note(90)], .7, .08), .14, 0);
// ---- H, I: under the sea; the ammonite turns to stone; the rise; the splash; the shore
T.at(TL.H0 + .2, pad(TL.I0 - TL.H0 + 2, [50, 57, 62], .9), .06, 0);
T.at(TL.STONE4 - .4, mixb(tone(1.6, t => note(38) * (1 - .1 * t), { e: env.swell(.1, 1), amp: 1 }), noise(1, { lp: 300, e: env.swell(.1, .8), amp: .5 })), .2, 0);
const UP = TL.AGO + .15;
T.at(TL.I0 + .5, swell(UP - TL.I0 - .5, 200, 1800, 1), .08, 0);
T.at(UP - .02, splash(1), .3, 0); T.at(UP, noise(.5, { hp: 1500, lp: 9000, e: env.pluck(6), amp: 1 }), .12, 0);
T.at(UP + .1, noise(TL.J0 + .4 - UP, { lp: 900, hp: 150, e: env.swell(.3, .4), amp: 1 }), .07, 0);   // surf
T.at(TL.DINOS - .1, tone(1.8, t => 55 + 18 * Math.sin(Math.PI * t / 1.8), { type: 'saw', e: env.swell(.3, .6), amp: .6 }), .06, -.3);
// ---- J: the crash and the rise
T.at(TL.J0 + .1, rumble(TL.K0 - TL.J0, 1), .1, 0);
T.at(TL.CRASHED, drum(36, 1, 1.8), .35, 0); T.at(TL.CRASHED, thud(1), .3, 0); T.at(TL.CRASHED + .02, crack(.8), .15, 0);
T.at(TL.ROSE - .4, swell(TL.HIMALAYAS1 - TL.ROSE + .6, 150, 2500, 1), .12, 0);
T.at(TL.HIMALAYAS1 - .05, chord([50, 57, 62, 69], 2.6, .8), .16, 0); T.at(TL.HIMALAYAS1, wind(2, 3, .4), .05, .3);
// ---- K: the map: the river draws on a shimmer; GANDAKI
T.at(TL.FOSSILS - .2, shimmer(2.2, [note(86), note(88), note(90), note(93), note(95), note(98)], .5, .2), .07, .2);
T.at(TL.GANDAKI2 - .05, chime(note(74), .8, 2.2), .14, 0);
// ---- L: same · same · same
for (const [t, f] of [[TL.SAME_R, 45], [TL.SAME_S, 43], [TL.SAME_P, 40]]) { T.at(t - .05, drum(f, 1, 1.2), .3, 0); T.at(t - .05, templeBell(74 - (45 - f), .6), .1, 0); }
T.at(TL.SAME_P - .05, chord([50, 57, 62, 66, 69], 2.8, .9), .14, 0);
// ---- M: the puja: a hand bell, the leaves fall, the pour
T.at(TL.M0 + .2, handBell(.7), .1, .2);
T.at(TL.TULSI3 - .4, noise(.6, { hp: 2000, lp: 6000, e: env.hann(), amp: 1 }), .03, -.2);
T.at(TL.RIVERW - .45, mixb(water(1.6, 1), splash(.5)), .1, .2);
// ---- N: the Gita: a conch, an om
T.at(TL.N0 + .1, conch(2.8, 233, .8), .12, 0);
T.at(TL.STILL - .3, om(TL.O0 - TL.STILL + .8, 98, 1), .14, 0);
T.at(TL.HIMALAYA3 - .05, chord([50, 57, 62, 66], 2.6, .7), .12, 0);
// ---- O, P: nature is sacred (a soft chord); the leaf lands on the stone
T.at(TL.NATURE - .05, chord([62, 66, 69, 74], 2.6, .6), .1, 0);
T.at(TL.TULSI4 + .25, mixb(plink(note(93), .8), noise(.15, { hp: 2500, lp: 7000, e: env.pluck(30), amp: .5 })), .1, 0);
T.at(TL.TULSI4 + .2, chime(note(81), .7, 2.4), .1, 0);
// ---- Q: the ask
T.at(TL.Q0 + .1, templeBell(74, .7), .12, 0);
T.at(TL.FOSSIL - .05, plink(note(86)), .12, 0);
T.at(TL.COMMENT - .05, mixb(plink(note(93)), click(.6)), .16, 0);
// ---- the card
T.at(TL.CARD - .3, whoosh(.7, 400, 3200), .3, 0);
T.at(TL.CAP_T, chord([67, 71, 74, 79], 2.2, .7), .25, 0);
const pop = (amp = 1, f = 1) => mixb(click(amp), tone(.07, t => f * (500 + 2600 * t / .07), { e: env.pluck(40), amp: amp * .7 }), noise(.05, { lp: 2500, hp: 300, e: env.pluck(60), amp: amp * .5 }));
for (let k = 0; k < 3; k++) T.at(TL.COVERS + k * .12, pop(.8, 1 + k * .15), .3, (k - 1) * .4);
T.at(TL.PRICE, pop(.6, .9), .2, 0);
T.at(TL.PILL, mixb(pop(1, 1.3), shimmer(.7, [note(91), note(95), note(98)], .6, .06)), .32, 0);
T.at(TL.CARD, pad(TL.END - TL.CARD, [67, 71, 74], .7), .08, 0);

T.write('assets/shaligram_sfx.wav');
console.log('assets/shaligram_sfx.wav', TL.END.toFixed(2), 's');
// the mix: the voice over the SFX, normalised to -14 LUFS
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'assets/shaligram_vo.wav', '-i', 'assets/shaligram_sfx.wav', '-filter_complex',
  `[1:a]volume=0.85[s];[0:a][s]amix=inputs=2:normalize=0:duration=longest,apad=whole_dur=${TL.END.toFixed(3)},atrim=0:${TL.END.toFixed(3)},loudnorm=I=-14:TP=-1.5:LRA=11[o]`,
  '-map', '[o]', '-ar', '48000', '-ac', '2', 'assets/shaligram_mix.wav']);
console.log('assets/shaligram_mix.wav');
