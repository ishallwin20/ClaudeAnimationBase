// orn_sfx.mjs: the sound effects for "Why does SHIVA wear such SCARY ornaments?" (src/scenes/orn.js) →
// assets/orn_sfx.wav, then the mix with the voice → assets/orn_mix.wav. Times come from the voice and the timeline
// (src/scenes/orn_vo.js + orn_tl.js, loaded with vm), so they follow the picture.
// The studio: a low dark drone; the cobra's hiss, louder as the hood spreads; a deep hit. The ocean: the sea,
// the churn's groan, a rising rumble as the poison spreads, a dissonant low cluster on HALAHAL. Shiva: an airy pad, a
// swallowing swell as he drinks, a bell and a glassy shimmer as the throat turns blue; the moon's falling shimmer and bell. The tusk: a hum, a heavy thud and
// grit as it falls, a rising shimmer and a bell as he takes it up. The trishul: a falling whoosh, a ringing clang and
// sparks, the fire's crackle; the hide's flapping fall and soft settle; a temple bell on KRITTIVASA. Ganga: a roar that
// builds, the hit, then the roar cut to a trickle as he holds her; a chime on JATA. The skulls: a low hollow wind,
// a single bell. Rudraksha: a warm pad, the tear's drop and a ring of light. The devotees' three: glass, wood, thread.
// The board: a whoosh and a pop per row; the ask; the card.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, plink, clang, click, shimmer, drone, note, seed, chime, drum, conch, thud, wind, rnd, crackle, crunch, torrent, splash, rumble, SR } from './sfx.mjs';

const TL = runInNewContext(readFileSync('src/scenes/orn_vo.js', 'utf8') + '\n' + readFileSync('src/scenes/orn_tl.js', 'utf8') + '\n;TL');
const T = track(TL.END);
seed(78);
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const seg = (t, a, b) => clamp((t - a) / (b - a));
const pop = (amp = 1, f = 1) => mixb(click(amp), tone(.07, t => f * (500 + 2600 * t / .07), { e: env.pluck(40), amp: amp * .7 }), noise(.05, { lp: 2500, hp: 300, e: env.pluck(60), amp: amp * .5 }));
const pad = (dur, ms, amp = 1) => mixb(...ms.map((m, i) => tone(dur, t => note(m) * (1 + .003 * Math.sin(t * 2 + i)), { type: 'tri', e: env.swell(.8, .8), amp: amp / ms.length })));
const templeBell = (f = 76, amp = 1) => bell(note(f), 4, { partials: [[1, 1], [2.02, .6], [2.76, .45], [4.1, .3], [5.4, .18]], k: 1.1, amp });
// the cobra's hiss: breathy noise, high, in a swell
const hiss = (dur, amp = 1) => noise(dur, { lp: 9000, hp: 3200, e: env.swell(.06, Math.min(.4, dur * .5)), amp });
// a deep hit: a sub drop and a dark noise burst
const hit = (amp = 1) => mixb(tone(1.4, t => 60 * Math.exp(-t * 1.4) + 32, { e: env.pluck(2.2), amp }), noise(.5, { lp: 500, hp: 30, brown: true, e: env.pluck(7), amp: amp * .7 }));
// the sea, the churn's groan
const sea = (dur, amp = 1) => noise(dur, { lp: t => 380 + 180 * Math.sin(t * .5) + 90 * Math.sin(t * 1.3), hp: 40, brown: true, e: (t, D) => clamp(t / 1.2) * clamp((D - t) / 1.2) * (.7 + .3 * Math.sin(t * .9)), amp });
const groan = (dur, rate = .9, amp = 1) => mixb(noise(dur, { lp: 220, hp: 30, brown: true, e: (t, D) => clamp(t / .8) * clamp((D - t) / .8) * (.4 + .6 * Math.abs(Math.cos(t * rate))), amp }),
  tone(dur, t => 46 + 6 * Math.sin(t * rate), { type: 'saw', e: (t, D) => clamp(t / .8) * clamp((D - t) / .8) * .5 * Math.abs(Math.cos(t * rate)), amp: amp * .25 }));
// a dissonant low cluster (the poison)
const cluster = (dur, amp = 1) => mixb(...[38, 39, 45, 46].map((m, i) => tone(dur, t => note(m) * (1 + .004 * Math.sin(t * (3 + i))), { type: i % 2 ? 'saw' : 'tri', e: env.swell(.3, 1.2), amp: amp / 4 })));
// cloth flapping as it falls
const flap = (dur, amp = 1) => noise(dur, { lp: 1800, hp: 200, e: (t, D) => clamp(t / .1) * clamp((D - t) / .3) * (.4 + .6 * Math.abs(Math.sin(t * 22 + Math.sin(t * 7) * 3))), amp });
const shutter = () => mixb(click(1), noise(.06, { lp: 6000, hp: 1500, e: env.pluck(50), amp: .7 }), click(.6));

// ---- A: the hook: a dark drone, the hiss; the hood spreads on SCARY
T.at(0, drone(TL.D0 + .5, 41, .8), .07, 0);
T.at(0, hiss(1.2, 1), .06, .1);
T.at(TL.SCARY - .25, hiss(1.1, 1.3), .12, .1);
T.at(TL.SCARY - .1, hit(.8), .22, 0);
// ---- C: the snake: a hiss and a lunge on BITE; a chime on KING
T.at(TL.SNAKE - .05, hiss(.9, 1.2), .12, -.1);
T.at(TL.BITE - .05, mixb(hiss(.5, 1.5), whoosh(.3, 300, 2400, .6)), .16, 0);
T.at(TL.KILL, thud(.5), .12, 0);
T.at(TL.KING, mixb(chime(note(76), .6, 2.4), shimmer(1.4, [note(88), note(91), note(95)], .4, .08)), .12, 0);
// ---- D: the ocean, the churn, the poison spreading
T.at(TL.D0 - .4, whoosh(1, 300, 2200), .14, 0);
T.at(TL.D0, sea(TL.F0 - TL.D0 + .4, 1), .05, 0);
T.at(TL.D0, groan(TL.E0 - TL.D0 + .4, 1.2, 1), .07, 0);
T.at(TL.HALAHAL - .2, mixb(hit(1), cluster(4.5, 1)), .22, 0);
T.at(TL.HALAHAL, rumble(TL.E0 - TL.HALAHAL + 1.5, 1), .1, 0);
T.at(TL.SPREAD - .2, noise(2.6, { lp: t => 300 + 900 * t / 2.6, hp: 60, e: env.swell(.4, .8), amp: 1 }), .08, 0);
// ---- E: Shiva drinks: an airy pad; the swallow; the bell as the throat turns blue
T.at(TL.E0, pad(TL.F0 - TL.E0 + .3, [62, 69, 74, 78], 1), .06, 0);
T.at(TL.DRANK - .7, noise(1.3, { lp: t => 2400 - 2000 * t / 1.3, hp: 60, e: env.swell(.6, .3), amp: 1 }), .14, 0);
T.at(TL.DRANK + .45, mixb(tone(.5, t => 120 - 60 * t, { e: env.pluck(6), amp: 1 }), noise(.3, { lp: 400, e: env.pluck(12), amp: .6 })), .2, 0);
T.at(TL.BLUE - .05, mixb(templeBell(72, .8), shimmer(2, [74, 78, 81, 86, 90].map(note), .5, .1)), .18, 0);
T.at(TL.ORNAMENT, chime(note(93), .5, 2), .1, .2);
// ---- M: the moon comes down: a glassy falling shimmer, a soft bell as it settles; relief: a cool rising chord
T.at(TL.MOON - .4, shimmer(1.6, [98, 95, 93, 90, 86, 83].map(note), .45, .16), .12, .2);
T.at(TL.MOON + .95, mixb(bell(note(88), 2.4, { partials: [[1, 1], [2.4, .35], [5.2, .12]], k: 1.6, amp: .9 }), click(.2)), .16, 0);
T.at(TL.RELIEF - .2, pad(2.6, [69, 76, 81, 85], 1), .1, 0);
T.at(TL.RELIEF + .5, chime(note(93), .45, 2.2), .08, -.2);
// ---- F: the tusk: a hum; it falls (thud, grit); he takes it up (shimmer, bell)
T.at(TL.F0 - .2, whoosh(.9, 400, 2600), .12, 0);
T.at(TL.F0, tone(TL.FELL - TL.F0, t => 98 + 2 * Math.sin(t * 2), { type: 'tri', e: env.swell(.6, .3), amp: 1 }), .04, 0);
T.at(TL.HIRANYAKSHA, mixb(hit(.6), crunch(.6)), .14, 0);
T.at(TL.VARAHA, chime(note(64), .6, 2), .1, 0);
T.at(TL.FELL - .3, whoosh(.35, 1800, 300, .8), .12, 0);
T.at(TL.FELL + .22, mixb(thud(1.2), crunch(1), noise(.6, { lp: 1200, hp: 200, e: env.pluck(5), amp: .5 })), .32, 0);
T.at(TL.PICKED - .1, shimmer(2.2, [67, 71, 74, 79, 83, 86].map(note), .5, .14), .12, 0);
T.at(TL.WORE, templeBell(79, .8), .2, 0);
// ---- G: the trishul strikes; the hide falls; KRITTIVASA
const STRIKE = TL.FELL2 - .05;
T.at(TL.G0, drone(TL.H0 - TL.G0, 36, 1), .06, 0);
T.at(TL.GAJASURA, mixb(hit(.8), drum(40, 1, 1.4)), .24, 0);
T.at(STRIKE - .5, whoosh(.5, 300, 4000, 1), .2, 0);
T.at(STRIKE, mixb(clang(note(55), 1), clang(note(62), .6), hit(1.2), noise(.25, { hp: 2000, lp: 9000, e: env.pluck(14), amp: .8 })), .4, .2);
T.at(STRIKE + .05, crackle(1.2, 1), .1, .3);
T.at(STRIKE + .2, crackle(TL.H0 - STRIKE, .6), .05, .2);
T.at(TL.WEAR - .35, flap(1.6, 1), .12, 0);
T.at(TL.WEAR + 1.2, mixb(thud(.6), noise(.5, { lp: 600, hp: 60, e: env.pluck(6), amp: .6 })), .18, 0);
T.at(TL.KRITTIVASA - .05, templeBell(64, 1), .26, 0);
// ---- H: Ganga: the roar builds; she hits; held, the roar becomes a trickle
T.at(TL.H0 - .2, whoosh(1, 2600, 300), .1, 0);
T.at(TL.H0, torrent(TL.HELD - TL.H0 + .3, 1, 1), .16, 0);
T.at(TL.EARTH + .7, mixb(hit(1.1), splash(1)), .26, 0);
T.at(TL.GANGA, chime(note(81), .5, 2), .08, 0);
T.at(TL.HELD - .1, whoosh(1.2, 3000, 200, .8), .12, 0);
T.at(TL.HELD + .3, noise(TL.I0 - TL.HELD + .3, { lp: 5200, hp: 1600, e: env.swell(.6, .6), amp: 1 }), .03, 0);
for (let k = 0; k < 10; k++) T.at(TL.HELD + .4 + k * .26 + rnd() * .1, plink(note(84 + Math.floor(rnd() * 8)), .4), .05, (rnd() - .5) * .6);
T.at(TL.JATA, mixb(chime(note(76), .7, 2.4), shimmer(1.4, [note(88), note(93)], .4, .1)), .14, 0);
// ---- I: the skulls: a hollow wind, a bell
T.at(TL.I0 - .2, whoosh(.9, 2600, 400), .1, 0);
T.at(TL.I0, wind(TL.J0 - TL.I0 + .4, .5, 1), .07, 0);
T.at(TL.I0, drone(TL.J0 - TL.I0 + .4, 33, 1), .07, 0);
for (let k = 0; k < 4; k++) T.at(TL.SKULLS + k * .32, mixb(click(.5), tone(.15, 220 - k * 20, { e: env.pluck(20), amp: .6 })), .07, (k - 1.5) * .3);
T.at(TL.BRAHMAS - .05, templeBell(57, .9), .22, 0);
// ---- J: rudraksha: a warm pad; the tear's drop; a ring of light
T.at(TL.J0, pad(TL.K0 - TL.J0 + .3, [55, 62, 67, 71], 1), .08, 0);
T.at(TL.RUDRAKSHA, chime(note(79), .6, 2.2), .12, 0);
T.at(TL.TEARS + .1, mixb(tone(.25, t => 900 + 1800 * Math.exp(-t * 18), { e: env.pluck(14), amp: 1 }), click(.4)), .16, 0);
T.at(TL.TEARS + .15, shimmer(2.2, [74, 78, 81, 86, 90, 93].map(note), .5, .07), .14, 0);
// ---- K: crystal (glass), karungali (wood), red thread (soft)
T.at(TL.K0 - .2, whoosh(.8, 400, 2400), .1, 0);
T.at(TL.CRYSTAL, mixb(bell(note(96), 1.2, { partials: [[1, 1], [2.4, .4], [5.1, .2]], k: 4, amp: 1 }), bell(note(103), .8, { k: 6, amp: .5 })), .1, -.3);
T.at(TL.KARUNGALI, mixb(tone(.12, 520, { e: env.pluck(40), amp: 1 }), tone(.1, 760, { e: env.pluck(50), amp: .5 }), click(.5)), .16, 0);
T.at(TL.RED, noise(.35, { lp: 1600, hp: 300, e: env.swell(.05, .2), amp: 1 }), .08, .3);
T.at(TL.DEVOTEES, chime(note(81), .5, 1.8), .08, 0);
// ---- L: the board: a whoosh, a pop per row; SAVE; the ask
T.at(TL.L0 - .1, whoosh(.8, 400, 2600), .16, 0);
for (let i = 0; i < 7; i++) T.at(TL.L0 + .25 + i * .1, pop(.5, 1 + i * .06), .1, (i - 3) * .1);
T.at(TL.SAVE, chime(note(86), .6, 1.8), .12, 0);
T.at(TL.L0, pad(TL.CARD - TL.L0, [57, 64, 69], .8), .05, 0);
T.at(TL.YOU, pop(.7, 1.2), .14, 0);
T.at(TL.COMMENT, mixb(pop(1, 1.3), shimmer(.7, [note(91), note(95), note(98)], .6, .06)), .18, 0);
// ---- the card
T.at(TL.CARD - .3, whoosh(.7, 400, 3200), .24, 0);
T.at(TL.CARD + .35, mixb(...[67, 71, 74, 79].map((m, i) => bell(note(m), 2.2, { partials: [[1, 1], [2, .35], [3, .12]], k: 1.4, amp: .7 }))), .2, 0);
for (let k = 0; k < 3; k++) T.at(TL.CARD + .7 + k * .12, pop(.8, 1 + k * .15), .24, (k - 1) * .4);
T.at(TL.CARD + 1.65, mixb(pop(1, 1.3), shimmer(.7, [note(91), note(95), note(98)], .6, .06)), .26, 0);
T.at(TL.CARD, pad(TL.END - TL.CARD, [67, 71, 74], .7), .07, 0);

T.write('assets/orn_sfx.wav');
console.log('assets/orn_sfx.wav', TL.END.toFixed(2), 's');
// the mix: the voice at full level over the SFX, normalised to -14 LUFS
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'assets/orn_vo.wav', '-i', 'assets/orn_sfx.wav', '-filter_complex',
  `[1:a]volume=0.85[s];[0:a][s]amix=inputs=2:normalize=0:duration=longest,apad=whole_dur=${TL.END.toFixed(3)},atrim=0:${TL.END.toFixed(3)},loudnorm=I=-14:TP=-1.5:LRA=11[o]`,
  '-map', '[o]', '-ar', '48000', '-ac', '2', 'assets/orn_mix.wav']);
console.log('assets/orn_mix.wav');
