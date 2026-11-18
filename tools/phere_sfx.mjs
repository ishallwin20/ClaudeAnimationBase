// phere_sfx.mjs: the sound effects for "Saat phere were never seven rounds" (src/scenes/phere.js) → assets/phere_sfx.wav,
// then the mix with the voice → assets/phere_mix.wav. Times come from the voice and the timeline (src/scenes/phere_vo.js
// + phere_tl.js, loaded with vm), so they follow the picture. Music is added on Instagram, so the bed stays quiet.
// Under everything: the havan crackling, a night's crickets far off, a warm pad. The hook: a temple bell, the seven rings
// shimmer; on THREE four of them blow out (soft breaths); the seven steps light with a rising run of plinks. The source:
// a bell, pops for the tags. The laja: grains rattling down; into the fire: a whoomp and the fire flares. The stone: a
// thud and grit; BE FIRM: a bell. The rounds: soft bare-foot taps round the fire, a rising swish, a bell per round
// (higher each time). The seven steps: a tap and a plink up the scale on each number, a pop on each word; FRIEND: a
// warm bell chord. The law: a stamp. The ask: pops on 3, 4, 7. The card.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, plink, click, shimmer, note, seed, chime, thud, rnd, fire, crackle, crinkle } from './sfx.mjs';

const TL = runInNewContext(readFileSync('src/scenes/phere_vo.js', 'utf8') + '\n' + readFileSync('src/scenes/phere_tl.js', 'utf8') + '\n;TL');
const T = track(TL.END);
seed(102);
const pop = (amp = 1, f = 1) => mixb(click(amp), tone(.07, t => f * (500 + 2600 * t / .07), { e: env.pluck(40), amp: amp * .7 }), noise(.05, { lp: 2500, hp: 300, e: env.pluck(60), amp: amp * .5 }));
const pad = (dur, ms, amp = 1) => mixb(...ms.map((m, i) => tone(dur, t => note(m) * (1 + .003 * Math.sin(t * 2 + i)), { type: 'tri', e: env.swell(.9, .9), amp: amp / ms.length })));
const templeBell = (f = 76, amp = 1) => bell(note(f), 4, { partials: [[1, 1], [2.02, .6], [2.76, .45], [4.1, .3], [5.4, .18]], k: 1.1, amp });
const sparkle = (amp = 1) => shimmer(.9, [note(88), note(91), note(95), note(100)], .7 * amp, .05);
const breath = (amp = 1) => noise(.45, { hp: 500, lp: t => 2600 - 1800 * t / .45, e: env.swell(.05, .3), amp });
// a bare foot on stone: a soft low tap with a little skin
const tap = (amp = 1) => mixb(tone(.08, t => 150 * Math.exp(-t * 30) + 70, { e: env.pluck(45), amp }), noise(.05, { hp: 300, lp: 1800, e: env.pluck(70), amp: amp * .35 }));
// grains falling: many tiny ticks
function grains(dur, amp = 1, rate = 90) {
  const o = mixb(noise(dur, { hp: 2500, lp: 9000, e: env.swell(.1, .2), amp: .12 * amp }));
  for (let i = 0; i < dur * rate; i++) { const d = click(.25 * amp * (.3 + rnd() * .7)), s = Math.round((i / rate + rnd() * .01) * 48000); for (let j = 0; j < d.length && s + j < o.length; j++) o[s + j] += d[j] * (.5 + .5 * Math.sin(j)); }
  return o;
}
// crickets far off: short high pulses in trains
function crickets(dur) {
  const o = mixb(noise(.01, { amp: 0 }), tone(dur, 0, { amp: 0 }));
  for (let t = .3; t < dur - .5; t += .9 + rnd() * 1.6) { const n = 3 + Math.floor(rnd() * 4), f = 4300 + rnd() * 500; for (let k = 0; k < n; k++) { const b = tone(.035, f, { e: env.hann(), amp: .5 }), s = Math.round((t + k * .07) * 48000); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j]; } }
  return o;
}

// ---- the bed: the fire, crickets, a pad to the card
T.at(0, fire(TL.CARD + .3, .7, .7), .07, 0);
T.at(0, crickets(TL.CARD), .012, .3);
const PADS = [[0, TL.B0 + .4, [57, 64, 69, 76]], [TL.B0 + .4, TL.D0, [55, 62, 67, 71]], [TL.D0, TL.E0, [57, 64, 69, 72]], [TL.E0, TL.G0, [53, 60, 65, 69]], [TL.G0, TL.I0, [57, 64, 69, 76]], [TL.I0, TL.CARD, [55, 62, 67, 74]]];
for (const [a, b, ms] of PADS) T.at(a, pad(b - a + .8, ms, 1), .035, 0);
// ---- A: the hook
T.at(0, templeBell(64, 1), .12, 0);
T.at(.05, sparkle(.8), .06, 0);
for (let i = 0; i < 4; i++) T.at(TL.THREE0 - .05 + i * .12, breath(.8), .05, (i - 1.5) * .3);
T.at(TL.THREE0 - .05, chime(note(76), .6, 1.8), .07, 0);
T.at(TL.NEVER - .1, tone(1.6, t => note(48), { e: env.swell(.1, 1.2), amp: .7 }), .06, 0);
T.at(TL.SEVEN0 + .1, whoosh(2.4, 200, 1400, 1), .05, 0);
for (let i = 0; i < 7; i++) T.at(TL.STEPS0 - .45 + i * .1, plink(note([72, 74, 76, 79, 81, 84, 86][i]), .8), .07, (i - 3) * .08);
// ---- B: the source
T.at(TL.B0, whoosh(1.0, 300, 1600, 1), .05, 0);
T.at(TL.PARAS - .25, templeBell(57, .9), .1, 0);
T.at(TL.SHUKLA - .1, pop(.6, 1), .07, 0);
T.at(TL.TWOMORE - .1, chime(note(79), .5, 1.5), .06, 0);
for (const [w, f] of [[TL.TWOMORE + .1, 1], [TL.TWOMORE + .35, 1.12], [TL.TWOMORE + .6, 1.25]]) T.at(w, pop(.6, f), .07, 0);
// ---- C: the laja, the fire, the stone
T.at(TL.BROTHER - .2, grains(TL.OFFERS - TL.BROTHER, 1, 80), .11, -.2);
T.at(TL.OFFERS - .2, grains(TL.FIRE - TL.OFFERS + .5, .9, 70), .1, 0);
T.at(TL.FIRE - .45, mixb(noise(.9, { lp: t => 300 + 2500 * t, hp: 60, e: env.swell(.3, .5), amp: .9 }), tone(.7, t => 70 + 40 * t, { e: env.swell(.2, .4), amp: .6 })), .13, 0);
T.at(TL.FIRE, crackle(1.4, 1), .1, .1);
T.at(TL.STONE - .05, mixb(thud(1.1), crinkle(.25, .5)), .2, 0);
T.at(TL.FIRM - .05, templeBell(60, .8), .1, 0);
// ---- D: the rounds
TL.R.forEach(([a, b], k) => {
  T.at(a, whoosh(b - a + .2, 300, 1500 + 400 * k, 1), .045, 0);
  const n = Math.round((b - a) * 6);
  for (let i = 0; i < n; i++) { const s = i / n, ang = s * Math.PI * 2; T.at(a + (b - a) * s, tap(.8 + .2 * rnd()), .12, .6 * Math.sin(ang)); }
});
for (const [w, m] of [[TL.ONE, 67], [TL.TWO, 71], [TL.THREE, 74]]) T.at(w - .05, mixb(templeBell(m, .8), sparkle(.4)), .11, 0);
T.at(TL.ONLY - .1, chime(note(79), .6, 2), .06, 0);
// ---- E, F, G: the seven steps
T.at(TL.E0, whoosh(1.6, 200, 900, 1), .05, 0);
T.at(TL.SEVENSTEPS - .1, sparkle(.7), .06, 0);
T.at(TL.NORTH - .1, chime(note(83), .5, 1.5), .05, 0);
const SCALE = [72, 74, 76, 79, 81, 84, 86];
TL.W.forEach((w, i) => { T.at(w - .1, tap(1), .16, 0); T.at(w - .05, plink(note(SCALE[i]), .9), .08, 0); });
TL.WW.forEach((w) => T.at(w - .03, pop(.5, 1.2), .06, 0));
T.at(TL.SEVENTH - .1, tap(1.1), .16, 0);
T.at(TL.SEVENTH - .05, plink(note(SCALE[6]), 1), .09, 0);
T.at(TL.FRIEND - .08, mixb(...[60, 64, 67, 72].map(m => templeBell(m, .55)), shimmer(1.2, [note(84), note(88), note(91), note(96)], .6, .07)), .16, 0);
// ---- H: the law
T.at(TL.H0, whoosh(1.0, 300, 1200, 1), .05, 0);
T.at(TL.ACT - .4, mixb(thud(1), click(.8)), .16, 0);
T.at(TL.SEVSTEP - .05, chime(note(84), .7, 2), .07, 0);
// ---- I: the ask
T.at(TL.HOW - .05, chime(note(79), .5, 1.5), .06, 0);
for (const [w, f, p] of [[TL.N3, 1, -.3], [TL.N4, 1.12, 0], [TL.N7, 1.25, .3]]) T.at(w - .05, pop(.8, f), .11, p);
T.at(TL.STATE - .05, pop(.7, 1.35), .09, 0);
T.at(TL.SEND, mixb(pop(1, 1.3), shimmer(.7, [note(91), note(95), note(98)], .6, .06)), .13, 0);
// ---- the card
T.at(TL.CARD - .3, whoosh(.7, 400, 3200), .22, 0);
T.at(TL.CARD + .35, mixb(...[67, 71, 74, 79].map((m) => bell(note(m), 2.2, { partials: [[1, 1], [2, .35], [3, .12]], k: 1.4, amp: .7 }))), .2, 0);
for (let k = 0; k < 3; k++) T.at(TL.CARD + .7 + k * .12, pop(.8, 1 + k * .15), .22, (k - 1) * .4);
T.at(TL.CARD + 1.65, mixb(pop(1, 1.3), shimmer(.7, [note(91), note(95), note(98)], .6, .06)), .24, 0);
T.at(TL.CARD, pad(TL.END - TL.CARD, [67, 71, 74], .7), .07, 0);

T.write('assets/phere_sfx.wav');
console.log('assets/phere_sfx.wav', TL.END.toFixed(2), 's');
// the mix: the voice at full level over the SFX, normalised to -14 LUFS
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'assets/phere_vo.wav', '-i', 'assets/phere_sfx.wav', '-filter_complex',
  `[1:a]volume=0.85[s];[0:a][s]amix=inputs=2:normalize=0:duration=longest,apad=whole_dur=${TL.END.toFixed(3)},atrim=0:${TL.END.toFixed(3)},loudnorm=I=-14:TP=-1.5:LRA=11[o]`,
  '-map', '[o]', '-ar', '48000', '-ac', '2', 'assets/phere_mix.wav']);
console.log('assets/phere_mix.wav');
