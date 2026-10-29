// kerala_sfx.mjs: the sound of "Kerala was pulled out of the SEA" (src/scenes/kerala.js) → assets/kerala_sfx.wav, at
// the mix with the voice → assets/kerala_mix.wav (-14 LUFS). Times come from the voice and the timeline (kerala_vo.js +
// kerala_tl.js, loaded with vm), so they follow the picture.
// The shore: waves and a soft sea wind, a temple bell and a swell on the hook; the map: high wind; the gift: a low drum,
// the light flowing away; Kashyapa: a staff's tap, a low chord; the ocean: a shimmer; Gokarna: a bell; Varuna: a conch
// and the sea's hum rising; the wind-up swells, a beat of silence, the throw (whoosh, crack, boom); the axe whistles
// away; the sweep: the sea rushing back under a rising shimmer; KANYAKUMARI a chord; PARASHURAMA KSHETRAM a bell and a
// chord; science: a glassy turn; THEN / TODAY whooshes, the water; the backwaters: lapping water and birds; KUTTANAD a
// plink; same: two hits; Piravi: a festive chenda roll and bells; the districts pop; the ask; the card.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, plink, click, shimmer, drone, note, seed, chime, drum, conch, wind, chirp, thud, splash, rumble, torrent, rnd, SR } from './sfx.mjs';

const TL = runInNewContext(readFileSync('src/scenes/kerala_vo.js', 'utf8') + '\n' + readFileSync('src/scenes/kerala_tl.js', 'utf8') + '\n;TL');
const T = track(TL.END);
seed(62);
const TAU = Math.PI * 2, lerp = (a, b, k) => a + (b - a) * k;
const add = (o, b, s0, g = 1) => { const s = Math.round(s0 * SR); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j] * g; return o; };
const chord = (ms, d = 2, amp = 1) => { const o = new Float32Array(Math.round((d + 1) * SR)); ms.forEach((m, i) => add(o, bell(note(m), d, { partials: [[1, 1], [2, .35], [3, .12]], k: 1.4, amp }), i * .05)); return o; };
const pad = (dur, ms, amp = 1) => mixb(...ms.map((m, i) => tone(dur, t => note(m) * (1 + .003 * Math.sin(t * 2 + i)), { type: 'tri', e: env.swell(.8, .8), amp: amp / ms.length })));
const templeBell = (f = 74, amp = 1) => bell(note(f), 4, { partials: [[1, 1], [2.02, .6], [2.76, .45], [4.1, .3], [5.4, .18]], k: 1.1, amp });
const swell = (d, f0, f1, amp = 1) => mixb(noise(d, { lp: t => lerp(f0, f1, t / d), hp: 80, e: (t, D) => Math.pow(t / D, 2) * (1 - Math.pow(Math.max(0, t / D - .92) / .08, 2)), amp }), tone(d, t => lerp(110, 220, t / d), { type: 'tri', e: (t, D) => Math.pow(t / D, 2), amp: amp * .3 }));
const crack = (amp = 1) => mixb(click(amp), noise(.25, { hp: 600, lp: 7000, e: env.pluck(16), amp: amp * .9 }), tone(.3, t => 180 * Math.exp(-t * 8) + 60, { e: env.pluck(12), amp: amp * .6 }));
const water = (d, amp = 1) => noise(d, { lp: t => 1400 + 500 * Math.sin(t * 1.3), hp: 300, e: env.swell(.6, .6), amp });
// waves on the shore: slow swells of surf, each breaking and drawing back
const waves = (d, amp = 1) => { const o = new Float32Array(Math.round((d + 4) * SR)); for (let t = 0; t < d; t += 3 + rnd() * 1.6) add(o, noise(3.4, { lp: t => 600 + 900 * Math.sin(Math.PI * Math.min(1, t / 3.4)), hp: 90, e: (t, D) => Math.sin(Math.PI * Math.min(1, t / D)) ** 2, amp: amp * (.6 + rnd() * .4) }), t); return o; };
// the chenda: a fast roll of tight, bright hits building to a stroke
const chenda = (d, amp = 1) => { const o = new Float32Array(Math.round((d + 1) * SR)); for (let t = 0, i = 0; t < d; t += .085, i++) add(o, mixb(noise(.06, { hp: 900, lp: 6000, e: env.pluck(50), amp: amp * (.5 + .5 * t / d) * (i % 4 ? .7 : 1) }), tone(.08, x => 220 * Math.exp(-x * 20) + 140, { e: env.pluck(30), amp: amp * .4 })), t); return o; };
const pop = (amp = 1, f = 1) => mixb(click(amp), tone(.07, t => f * (500 + 2600 * t / .07), { e: env.pluck(40), amp: amp * .7 }), noise(.05, { lp: 2500, hp: 300, e: env.pluck(60), amp: amp * .5 }));
const whooshAt = (t, amp = .2, d = .7) => T.at(t - d / 2, whoosh(d, 400, 2600), amp, 0);

// ---- beds: the shore's waves (A, C, F-G), the map's wind
T.at(0, waves(TL.B0 + .4, 1), .12, -.2);
T.at(TL.C0, waves(TL.D0 + .4 - TL.C0, 1), .06, 0);
T.at(TL.F0, waves(TL.H0 + .3 - TL.F0, 1), .12, -.2);
T.at(TL.B0, wind(TL.C0 + .4 - TL.B0, 0, .7), .06, .2);
T.at(TL.D0, wind(TL.F0 + .4 - TL.D0, 1, .6), .06, .2);
T.at(TL.H0, wind(TL.CARD - TL.H0, 2, .6), .045, -.2);
T.at(TL.A0, drone(TL.B0 + .4, 55, .8), .05, 0); T.at(TL.F0, drone(TL.H0 - TL.F0, 55, .8), .06, 0);

// ---- A: the hook: a temple bell, the axe's hum
T.at(.05, templeBell(74, .9), .2, -.1);
T.at(.05, shimmer(1.6, [note(86), note(90), note(93), note(98)], .5, .1), .08, .2);
T.at(1.3, chord([50, 57, 62], 2.4, .8), .12, 0);
// ---- B: the gift: a low drum, the light flowing away
T.at(TL.B0 + .1, mixb(drum(40, 1, 1.4), rumble(1.2, .6)), .25, 0);
T.at(TL.C0 - 1.6, mixb(whoosh(1.4, 2600, 400, 1), shimmer(1.6, [note(93), note(90), note(86), note(81)], .5, .1)), .1, 0);
// ---- C: Kashyapa: a staff tap, a low chord
T.at(TL.C0 + .4, mixb(click(.8), thud(.5)), .12, -.3);
T.at(TL.C0 + 1.2, chord([45, 52, 57], 2.6, .7), .1, 0);
// ---- D: the ocean made new land: a shimmer; E: Gokarna's bell
T.at(TL.D0 + .2, shimmer(2.4, [note(81), note(86), note(90), note(93), note(98)], .6, .12), .08, 0);
T.at(TL.E0 + 1.7, templeBell(76, .8), .16, -.1);
// ---- F: Varuna: a conch, the sea's hum rising; the wind-up swells; silence; the throw
T.at(TL.F0 + .2, conch(2.8, 233, .8), .13, 0);
T.at(TL.F0 + .4, pad(3, [43, 50, 55], .9), .08, 0);
T.at(TL.THROW - 2.2, swell(1.9, 200, 2600, 1), .1, 0);
T.at(TL.THROW - .2, whoosh(.4, 800, 4000, 1), .3, .2);
T.at(TL.THROW, mixb(crack(1), drum(36, 1, 1.8)), .4, 0); T.at(TL.THROW, rumble(1.6, 1), .15, 0);
T.at(TL.THROW + .1, tone(2, t => 1800 - 900 * t, { e: env.swell(.05, 1.6), amp: .5 }), .05, -.4);   // the axe whistles away
// ---- H: the sweep: the sea rushing back, a rising shimmer; KANYAKUMARI
T.at(TL.SWEEP0, torrent(TL.SWEEP1 - TL.SWEEP0 + .5, .5, .4), .09, .2);
T.at(TL.SWEEP0, swell(TL.SWEEP1 - TL.SWEEP0, 300, 3000, 1), .06, 0);
T.at(TL.SWEEP0 + .5, shimmer(TL.SWEEP1 - TL.SWEEP0, [note(74), note(78), note(81), note(86), note(90), note(93)], .6, .4), .07, 0);
T.at(TL.KANYA - .05, mixb(chord([50, 57, 62, 69], 2.6, .9), drum(42, 1, 1.4)), .18, 0);
// ---- I: Parashurama Kshetram
T.at(TL.I0 + .1, templeBell(74, .9), .18, 0); T.at(TL.I0 + .15, chord([62, 66, 69, 74], 2.6, .7), .12, 0);
// ---- J, K: science: a glassy turn; THEN / TODAY; the water
T.at(TL.J0 - .1, mixb(whoosh(.6, 3000, 600, 1), tone(1.4, t => note(98) * (1 - .02 * t), { e: env.swell(.05, .9), amp: .5 })), .12, 0);
whooshAt(TL.RISE0 + .5, .2, .8); T.at(TL.RISE0 + .3, water(2.4, 1), .06, 0);
whooshAt(TL.K0 - .7, .2, .8);
// ---- K, L: the backwaters: lapping water and birds; Kuttanad
T.at(TL.K0, water(TL.L0 + .4 - TL.K0, 1), .05, 0);
for (let t = TL.K0 + .3; t < TL.L0; t += .5 + rnd() * .8) T.at(t, mixb(chirp(.6), chirp(.4)), .02, rnd() * 1.4 - .7);
T.at(TL.KUTT + .2, plink(note(86)), .12, 0);
// ---- L: the legend says, the land says: two hits
T.at(TL.L0 + .3, mixb(drum(44, 1, 1.2), templeBell(74, .5)), .22, -.2);
T.at(TL.L0 + 2.0, mixb(drum(41, 1, 1.4), chord([50, 57, 62, 66, 69], 2.8, .9)), .24, .2);
// ---- M: Happy Kerala Piravi: a chenda roll and bells; the districts light up; the ask
T.at(TL.M0 - .6, chenda(1.2, 1), .2, 0); T.at(TL.M0 + .6, mixb(drum(40, 1, 1.4), templeBell(79, .7)), .22, 0);
for (let i = 0; i < 14; i++) T.at(TL.M0 + .8 + i * .22, plink(note(86 + (i % 5) * 2), .5), .05, (i % 2 ? .4 : -.4));
T.at(TL.ASK - .05, mixb(plink(note(93)), click(.6)), .16, 0);
// ---- the card
T.at(TL.CARD - .3, whoosh(.7, 400, 3200), .3, 0);
T.at(TL.CAP_T, chord([67, 71, 74, 79], 2.2, .7), .25, 0);
for (let k = 0; k < 3; k++) T.at(TL.COVERS + k * .12, pop(.8, 1 + k * .15), .3, (k - 1) * .4);
T.at(TL.PRICE, pop(.6, .9), .2, 0);
T.at(TL.PILL, mixb(pop(1, 1.3), shimmer(.7, [note(91), note(95), note(98)], .6, .06)), .32, 0);
T.at(TL.CARD, pad(TL.END - TL.CARD, [67, 71, 74], .7), .08, 0);

T.write('assets/kerala_sfx.wav');
console.log('assets/kerala_sfx.wav', TL.END.toFixed(2), 's');
// the mix: the voice over the SFX, normalised to -14 LUFS
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'assets/kerala_vo.wav', '-i', 'assets/kerala_sfx.wav', '-filter_complex',
  `[1:a]volume=0.8[s];[0:a][s]amix=inputs=2:normalize=0:duration=longest,apad=whole_dur=${TL.END.toFixed(3)},atrim=0:${TL.END.toFixed(3)},loudnorm=I=-14:TP=-1.5:LRA=11[o]`,
  '-map', '[o]', '-ar', '48000', '-ac', '2', 'assets/kerala_mix.wav']);
console.log('assets/kerala_mix.wav');
