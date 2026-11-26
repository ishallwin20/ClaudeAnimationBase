// ashowl_sfx.mjs: the sound for "An OWL gave him the darkest idea in the Mahabharata" (src/scenes/ashowl.js, ad 118,
// no voice) → assets/ashowl_sfx.wav (then ffmpeg loudnorm → assets/ashowl_mix.wav). Times are the scene's constants
// (keep them in sync). A night under the banyan (wind, crickets, a low drone), the owl's hoot as the motif, the strikes,
// a heartbeat under his decision, the walk to the camp, half a second of silence, then the boom as the painting turns
// to ink, paper swipes for the pages, a lock's click, and a warm chord under the cover.
import { track, tone, noise, mixb, env, whoosh, crinkle, thud, drum, rumble, shimmer, chime, drone, slide, heart, wingbeat, wind, fire, click, note, seed, rnd, clamp, roar, screech } from './sfx.mjs';

const BLINK = .8, LOOKUP = 1.3, EYESOFF = 2.5;
const B0 = 3, LIT = [3.8, 4.4, 5];
const C0 = 7.6, ZZ = 8.4, HISS = 9.8, FLARE = 10.6, UP = 11.4;
const D0 = 12.2, EYES = 15;
const E0 = 16.8, STRIKES = [18, 18.9, 19.7], WAVE0 = 19.9, WAVE1 = 20.7, PERCH = 21.1;
const F0 = 22.4, PULL = 23.4, SMILE = 25, GFLARE = 25.4;
const G0 = 27.4, TURN = 27.7, GRIP = 28.4, WALK0 = 29, PUSH = 30.2, RISE = 30.7;
const H0 = 31.8, INKED = 32.3, SLOT = 33.4;
const I0 = 36.4, SW1 = 36.4, SW2 = 38.7, SW3 = 40.8, LOCK = 41.2;
const J0 = 44.2, END = 50.4;

const T = track(END);
seed(118);
// the owl's hoot: two soft, breathy "hoo"s, the second lower
const hoo = (f = 330, amp = 1) => { const one = (ff, d) => mixb(tone(d, t => ff * (1 - .06 * t / d) * (1 + .01 * Math.sin(t * 40)), { e: env.swell(.06, d * .6), amp }), noise(d, { lp: 900, hp: 200, e: env.swell(.05, d * .6), amp: amp * .15 })); const a = one(f, .32), b = one(f * .9, .5), o = new Float32Array(a.length + Math.round(.18 * 48000) + b.length); o.set(a, 0); const s = a.length + Math.round(.18 * 48000); for (let i = 0; i < b.length; i++) o[s + i] += b[i]; return o; };
// crickets: short chirp trains, scattered
const crickets = (dur, amp = 1) => { const o = new Float32Array(Math.round(dur * 48000)); for (let k = 0; k < dur * 2.2; k++) { const t0 = rnd() * dur, f = 4200 + rnd() * 900; for (let j = 0; j < 3; j++) { const b = tone(.035, f, { e: env.hann(), amp: amp * (.5 + rnd() * .5) }), s = Math.round((t0 + j * .05) * 48000); for (let i = 0; i < b.length && s + i < o.length; i++) o[s + i] += b[i]; } } return o; };
const snore = (amp = 1) => mixb(noise(1.0, { lp: t => 300 + 200 * Math.sin(t * 9), hp: 60, e: env.swell(.3, .4), amp }), tone(1.0, t => 70 + 8 * Math.sin(t * 50), { type: 'saw', e: env.swell(.3, .4), amp: amp * .25 }));
const hiss = (amp = 1) => noise(.9, { hp: 2600, lp: 9000, e: env.swell(.05, .7), amp });
const step = (amp = 1) => mixb(noise(.12, { lp: 700, hp: 80, e: env.pluck(30), amp }), crinkle(.08, amp * .3));
const pageSwipe = (amp = 1) => mixb(whoosh(.45, 900, 5000, amp * .8), crinkle(.3, amp * .5));
const boom = (amp = 1) => mixb(drum(42, amp, 2.4), rumble(2.2, amp * .6), noise(.6, { lp: 300, e: env.pluck(4), amp: amp * .5 }));

// ---- the night bed (A–G): wind, crickets, a low drone that thickens toward the gate; silence at the freeze
T.at(0, wind(H0, 0, 1.0), .07, -.2);
T.at(0, wind(H0, 2, 1.0), .055, .3);
T.at(0, crickets(H0, .05), .9, .4);
T.at(0, drone(E0, 73.4, .5), .3);
T.at(F0 - .5, drone(H0 - F0 + .6, 65.4, .5), .35);
T.at(G0, fire(H0 - G0, .15, .4), .25, .4);

// ---- A: the hook
T.at(0, mixb(drum(48, 1, 1.6), noise(1.2, { lp: 500, e: env.pluck(3), amp: .4 })), .7);
T.at(.25, hoo(330, .8), .5, .5);
T.at(BLINK + .3, hoo(320, .7), .45, .5);
T.at(LOOKUP, slide(1.6, 110, 98, .3), .4);
T.at(EYESOFF, whoosh(.9, 200, 1500, .5), .4);

// ---- B: three survivors, one note each
T.at(B0 - .1, whoosh(.6, 400, 3000, .6), .4);
LIT.forEach((t0, i) => T.at(t0, chime(note([62, 65, 69][i]), .35, 2.2), .35, [-.5, .5, 0][i]));
T.at(B0 + 1.2, snore(.3), .35, .5);

// ---- C: he can't sleep
T.at(ZZ - .2, snore(.4), .5, -.4);
T.at(ZZ + 1.0, snore(.35), .45, -.4);
T.at(HISS, hiss(.6), .6);
T.at(FLARE, mixb(shimmer(1.4, [note(86), note(89), note(93), note(98)], .25, .05), drum(52, .6, 1)), .55);
for (let i = 0; i < 4; i++) T.at(FLARE + .3 + i * .95, heart(.5), .45);

// ---- D: the crows asleep; two eyes open
T.at(D0, slide(3.0, 220, 330, .15), .3);
T.at(EYES, mixb(chime(note(98), .3, 1.5), drum(40, .8, 1.5)), .6);
T.at(EYES + .6, hoo(300, .9), .6, .4);

// ---- E: the owl takes them
T.at(E0, whoosh(1.2, 120, 2400, 1), .8, .5);
for (let i = 0; i < 7; i++) T.at(E0 + .2 + i * .4, wingbeat(.5, 1), .45, .4 - i * .1);
STRIKES.forEach((s, i) => { T.at(s - .04, thud(1), .8, [.3, -.3, .4][i]); T.at(s, crinkle(.5, .8), .7, [.3, -.3, .4][i]); T.at(s - .25, whoosh(.3, 400, 3500, .6), .5); });
for (let i = 0; i < 9; i++) T.at(lerp(WAVE0, WAVE1, i / 8), mixb(crinkle(.25, .5), thud(.35)), .5, (rnd() - .5) * 1.4);
T.at(PERCH, thud(.6), .5);
T.at(PERCH + .4, hoo(310, 1), .6, 0);

// ---- F: his eye; the lesson
T.at(F0 - .1, whoosh(.5, 300, 2600, .5), .35);
for (let i = 0; i < 5; i++) T.at(F0 + .3 + i * .9, heart(.6), .55);
T.at(SMILE, mixb(tone(2.6, 55, { e: env.swell(.3, 1.2), amp: .6 }), tone(2.6, 82.5, { type: 'tri', e: env.swell(.4, 1.2), amp: .25 })), .7);
T.at(GFLARE, shimmer(1.6, [note(81), note(86), note(88), note(93)], .3, .07), .5);

// ---- G: to the camp; something rises
T.at(G0 - .1, whoosh(.5, 300, 2600, .5), .35);
T.at(GRIP, mixb(click(.5), noise(.15, { lp: 2000, hp: 300, e: env.pluck(20), amp: .4 })), .5, -.3);
for (let t = WALK0; t < PUSH + 1.2; t += .62) T.at(t, step(.6), .45, -.2);
T.at(PUSH, slide(H0 - PUSH, 80, 160, .4), .55);
T.at(RISE, rumble(H0 - RISE, .7), .7);
for (let i = 0; i < 4; i++) T.at(PUSH + i * .38, heart(.7), .55);

// ---- H: half a second of nothing, then the boom; the page lands
T.at(INKED - .05, boom(1), 1);
T.at(INKED, whoosh(1.1, 3000, 300, .6), .5);
T.at(SLOT - .05, mixb(crinkle(.2, .6), thud(.4)), .55);
T.at(INKED + .1, drone(I0 + 7.8 - INKED, 61.7, .4), .5);   // a low drone under the pages

// ---- I: the pages, the lock
[SW1, SW2, SW3].forEach(s => T.at(s, pageSwipe(.8), .6, .2));
T.at(LOCK, mixb(click(1), tone(.25, 1400, { e: env.pluck(30), amp: .3 }), thud(.4)), .7);

// ---- J: the cover, a warm chord to the end
T.at(J0, pageSwipe(.8), .6, -.2);
T.at(J0 + .2, mixb(...[50, 57, 62, 65, 69].map((m, i) => tone(END - J0, note(m), { type: i ? 'sine' : 'tri', e: env.swell(.8, 1.2), amp: .22 }))), .8);
T.at(J0 + .4, shimmer(2, [note(74), note(77), note(81), note(86)], .25, .09), .45);
T.at(J0 + 1.3, chime(note(86), .3, 2), .35);


// ---- extra sound design (owner, 26 Nov: "it all feels dry"): risers into each beat, squawks, the thing at the gate
T.at(C0 - .5, whoosh(.6, 200, 2200, .5), .35);
T.at(D0 - .3, whoosh(1.2, 150, 1800, .6), .35);
T.at(E0 - 1.2, mixb(whoosh(1.4, 100, 4000, .8), slide(1.3, 180, 720, .25)), .6);   // the riser into the attack
STRIKES.forEach((s, i) => T.at(s + .02, screech(.28, 1500 + i * 180, .6), .32, [.3, -.3, .4][i]));
T.at(WAVE0, crinkle(WAVE1 - WAVE0 + .6, .5), .45);
T.at(PERCH + .1, rumble(1.2, .4), .3);
T.at(F0 + .2, tone(2.5, 49, { e: env.swell(.2, 1.2), amp: .6 }), .5);   // a sub swell under the eye
T.at(GFLARE, drum(45, .9, 1.4), .6);
T.at(G0, whoosh(1.5, 120, 900, .5), .3);
T.at(RISE, roar(H0 - RISE, 70, 5, .8), .55);   // the thing at the gate
T.at(H0 - .9, whoosh(.9, 300, 5000, .7), .45);   // sucked into the freeze
[SW1, SW2, SW3].forEach(s => T.at(s + .05, drum(55, .5, .6), .45));
T.at(J0 + .2, drum(48, .9, 1.6), .6);

// the freeze: total silence from H0 until the boom (a short fade into it)
{ const SR = 48000, a = Math.round(H0 * SR), b = Math.round((INKED - .06) * SR), f = Math.round(.08 * SR);
  for (let i = a - f; i < b; i++) { const g = i < a ? (a - i) / f : 0; T.L[i] *= g; T.R[i] *= g; } }
T.write('assets/ashowl_sfx.wav', { peak: .5, fade: .3 });
function lerp(a, b, k) { return a + (b - a) * k; }
