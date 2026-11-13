// palm_sfx.mjs: the sound effects for "Your palm has FOUR holy places" (src/scenes/palm.js) → assets/palm_sfx.wav, then
// the mix with the voice → assets/palm_mix.wav. Times come from the voice and the timeline (src/scenes/palm_vo.js +
// palm_tl.js, loaded with vm), so they follow the picture.
// A river at dawn under everything (low water, soft lapping, a far bird now and then) and a warm pad; a temple bell on
// frame 0, a soft chime as the four places light; THE DEAD: a cold swell, the pad goes minor. Palm reading struck out:
// a scratch; tirtha: a bell. One: a chime; the lota pours (a trickle into the palm), the hand tips and water drips off
// the fingertips. Two, three: chimes; sip from here: a tick. Four: the pad goes cold, a low bell; water and sesame run
// off the web, drops falling into the river below. The rule: a chime on SIP, a bell on THREE, soft pops on one and two;
// NEVER: a low boom. The sips: three
// small sips with a count chime each; not hot, no foam, twice: pops. The ask: a pop per number; save: a shimmer. The card.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, plink, click, shimmer, drone, note, seed, chime, thud, rnd, chirp, crinkle } from './sfx.mjs';

const TL = runInNewContext(readFileSync('src/scenes/palm_vo.js', 'utf8') + '\n' + readFileSync('src/scenes/palm_tl.js', 'utf8') + '\n;TL');
const T = track(TL.END);
seed(92);
const pop = (amp = 1, f = 1) => mixb(click(amp), tone(.07, t => f * (500 + 2600 * t / .07), { e: env.pluck(40), amp: amp * .7 }), noise(.05, { lp: 2500, hp: 300, e: env.pluck(60), amp: amp * .5 }));
const pad = (dur, ms, amp = 1) => mixb(...ms.map((m, i) => tone(dur, t => note(m) * (1 + .003 * Math.sin(t * 2 + i)), { type: 'tri', e: env.swell(.9, .9), amp: amp / ms.length })));
const templeBell = (f = 76, amp = 1) => bell(note(f), 4, { partials: [[1, 1], [2.02, .6], [2.76, .45], [4.1, .3], [5.4, .18]], k: 1.1, amp });
const boom = (amp = 1) => mixb(tone(2.2, t => 52 * Math.exp(-t * .9) + 26, { e: env.pluck(1.6), amp }), noise(.9, { lp: 380, hp: 25, brown: true, e: env.pluck(4), amp: amp * .7 }));
const sparkle = (amp = 1) => shimmer(.9, [note(88), note(91), note(95), note(100)], .7 * amp, .05);
const tick = (amp = 1) => mixb(plink(note(91), .6 * amp), plink(note(98), .4 * amp));
// water: a drop (a quick upward bloop), a trickle (bright noise with drops in it), a sip
const drop = (amp = 1, f = 700) => mixb(tone(.07, t => f * (1 + t * 16), { e: env.pluck(55), amp }), noise(.03, { hp: 1500, lp: 6000, e: env.pluck(120), amp: amp * .25 }));
function trickle(dur, amp = 1, rate = 10, f = 900) {
  const parts = [noise(dur, { hp: 700, lp: t => 3600 + 900 * Math.sin(t * 7), e: env.swell(.15, .25), amp: .5 * amp })];
  const o = mixb(...parts);
  for (let i = 0; i < dur * rate; i++) { const d = drop(.35 * amp * (.5 + rnd() * .5), f * (.7 + rnd() * .8)), s = Math.round((i / rate + rnd() * .05) * 48000); for (let j = 0; j < d.length && s + j < o.length; j++) o[s + j] += d[j]; }
  return o;
}
const sip = (amp = 1) => mixb(noise(.32, { hp: 400, lp: t => 2600 - 1800 * t / .32, e: env.swell(.06, .12), amp: .7 * amp }), drop(.4 * amp, 420));
function river(dur) {
  const o = mixb(noise(dur, { brown: true, lp: 420, e: env.swell(1.5, 1.5), amp: .9 }), noise(dur, { hp: 300, lp: 1300, e: env.swell(1.5, 1.5), amp: .25 }));
  for (let i = 0; i < o.length; i++) { const t = i / 48000; o[i] *= .7 + .3 * Math.sin(t * 1.3) * Math.sin(t * .47 + 1); }
  return o;
}

// ---- the bed: the river and a pad to the card
T.at(0, river(TL.CARD + .4), .05, 0);
const PADS = [[0, TL.DEAD - .3, [57, 64, 69, 76]], [TL.DEAD - .3, TL.B0 + .4, [57, 60, 64, 69]], [TL.B0 + .4, TL.F0, [55, 62, 67, 71]], [TL.F0, TL.G0, [53, 57, 60, 64]], [TL.G0, TL.I0, [57, 64, 69, 72]], [TL.I0, TL.CARD, [55, 62, 67, 74]]];
for (const [a, b, ms] of PADS) T.at(a, pad(b - a + .8, ms, 1), .04, 0);
for (const b of [3.1, 11.8, 22.6, 27.3, 41.2, 49.1, 57.9]) T.at(b, mixb(chirp(.5), chirp(.4)), .012, .6 * (rnd() - .5) * 2);
// ---- A: the hook
T.at(0, templeBell(64, 1), .12, 0);
T.at(.05, sparkle(.8), .06, 0);
T.at(TL.FOUR, chime(note(81), .6, 1.8), .06, 0);
T.at(TL.DEAD - .5, whoosh(1.0, 200, 1200, 1), .07, .2);
T.at(TL.DEAD, mixb(tone(1.8, t => note(50) * (1 - .02 * t), { type: 'sine', e: env.swell(.05, 1.4), amp: 1 }), templeBell(45, .7)), .12, 0);
// ---- B: not palm reading; tirtha; the books
T.at(TL.B0, whoosh(1.0, 300, 1600, 1), .06, 0);
T.at(TL.NOT + .35, crinkle(.35, .8), .06, 0);
T.at(TL.TIRTHA - .05, templeBell(57, .9), .11, 0);
for (const [w, m, p] of [[TL.TIRTHA + .05, 79, -.3], [TL.TIRTHA + .15, 83, -.1], [TL.TIRTHA + .25, 86, .1], [TL.TIRTHA + .35, 88, .3]]) T.at(w, chime(note(m), .5, 1.4), .04, p);
T.at(TL.LAW - .1, mixb(crinkle(.6, .7), noise(.5, { hp: 900, lp: 5000, e: env.swell(.15, .3), amp: .4 })), .05, 0);
for (const w of [TL.MANU, TL.YAJ, TL.VISHNU]) T.at(w - .05, pop(.6, 1.1), .07, 0);
// ---- C: one, the fingertips; the pour; the drips
T.at(TL.ONE - .1, mixb(chime(note(84), .7, 2), sparkle(.5)), .08, 0);
T.at(TL.WATER - .9, whoosh(.7, 300, 1200, 1), .05, -.4);
T.at(TL.WATER - .2, trickle(TL.OFFERED + .35 - TL.WATER, 1, 8, 650), .14, -.1);
T.at(TL.OFFERED + .35, whoosh(.6, 200, 900, 1), .05, 0);
T.at(TL.OFFERED + .7, trickle(TL.D0 - TL.OFFERED - .4, .8, 16, 1100), .11, -.2);
T.at(TL.HERE1 - .05, chime(note(81), .6, 1.8), .06, 0);
// ---- D, E: two, three
T.at(TL.TWO - .1, mixb(chime(note(79), .7, 2), sparkle(.4)), .08, -.3);
T.at(TL.THREE - .1, mixb(chime(note(76), .7, 2), sparkle(.4)), .08, .3);
T.at(TL.FIRST - .5, trickle(1.0, .6, 6, 600), .07, .2);
T.at(TL.SIP, tick(1), .09, .2);
// ---- F: four, the ancestors'
T.at(TL.F0, whoosh(1.4, 200, 700, 1), .06, 0);
T.at(TL.FOUR2 - .1, templeBell(48, .9), .12, .2);
T.at(TL.PITRI - .05, tone(2.2, t => note(57) * (1 - .01 * t), { type: 'sine', e: env.swell(.3, 1.6), amp: 1 }), .05, 0);
T.at(TL.ANCESTORS - .3, trickle(.7, .5, 6, 600), .06, .3);
T.at(TL.W4 + .3, trickle(TL.G0 + .3 - TL.W4 - .3, 1, 12, 760), .12, .3);
T.at(TL.DEAD2, mixb(templeBell(43, .8), tone(1.6, t => note(45), { e: env.swell(.05, 1.3), amp: .6 })), .12, 0);
// ---- G: the rule
T.at(TL.G0, whoosh(1.2, 300, 1500, 1), .05, 0);
T.at(TL.R_SIP - .05, chime(note(79), .5, 1.5), .06, 0);
T.at(TL.R_THREE - .05, mixb(templeBell(67, .8), sparkle(.6)), .11, .2);
T.at(TL.R_ONE, pop(.5, .9), .07, -.2);
T.at(TL.R_TWO, pop(.5, .95), .07, -.4);
T.at(TL.R_FOUR - .4, tone(.5, t => 40 + 30 * t / .5, { type: 'tri', e: env.swell(.3, .1), amp: 1 }), .06, 0);
T.at(TL.NEVER - .05, mixb(boom(1.1), thud(1)), .22, 0);
T.at(TL.ONCE, thud(.6), .1, 0);
// ---- H: the sips
TL.SIPS.forEach((s, i) => { T.at(s - .45, whoosh(.5, 200, 800, 1), .04, 0); T.at(s - .1, sip(1), .14, 0); T.at(s + .05, chime(note(76 + i * 3), .6, 1.4), .07, 0); });
T.at(TL.HOT - .05, pop(.7, 1), .09, -.3);
T.at(TL.FOAM - .05, pop(.7, 1.15), .09, .3);
T.at(TL.TWICE - .1, mixb(pop(.6, 1.3), pop(.5, 1.45)), .09, 0);
// ---- I: the ask
T.at(TL.YOU, chime(note(79), .5, 1.5), .06, 0);
for (const [w, f, p] of [[TL.N1, 1, -.4], [TL.N2, 1.12, -.1], [TL.N3, 1.25, .1], [TL.N4, 1.4, .4]]) T.at(w - .05, pop(.8, f), .11, p);
T.at(TL.SAVE, mixb(pop(1, 1.3), shimmer(.7, [note(91), note(95), note(98)], .6, .06)), .14, 0);
// ---- the card
T.at(TL.CARD - .3, whoosh(.7, 400, 3200), .22, 0);
T.at(TL.CARD + .35, mixb(...[67, 71, 74, 79].map((m) => bell(note(m), 2.2, { partials: [[1, 1], [2, .35], [3, .12]], k: 1.4, amp: .7 }))), .2, 0);
for (let k = 0; k < 3; k++) T.at(TL.CARD + .7 + k * .12, pop(.8, 1 + k * .15), .22, (k - 1) * .4);
T.at(TL.CARD + 1.65, mixb(pop(1, 1.3), shimmer(.7, [note(91), note(95), note(98)], .6, .06)), .24, 0);
T.at(TL.CARD, pad(TL.END - TL.CARD, [67, 71, 74], .7), .07, 0);

T.write('assets/palm_sfx.wav');
console.log('assets/palm_sfx.wav', TL.END.toFixed(2), 's');
// the mix: the voice at full level over the SFX, normalised to -14 LUFS
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'assets/palm_vo.wav', '-i', 'assets/palm_sfx.wav', '-filter_complex',
  `[1:a]volume=0.85[s];[0:a][s]amix=inputs=2:normalize=0:duration=longest,apad=whole_dur=${TL.END.toFixed(3)},atrim=0:${TL.END.toFixed(3)},loudnorm=I=-14:TP=-1.5:LRA=11[o]`,
  '-map', '[o]', '-ar', '48000', '-ac', '2', 'assets/palm_mix.wav']);
console.log('assets/palm_mix.wav');
