// shani2_sfx.mjs: the sound effects for Shani series Part 2 (src/scenes/shani2.js) → assets/shani2_sfx.wav.
// Times are the scene's constants (keep them in sync). Every shot sits on its own bed (a low drone on the wall, the
// palace's sun hum, the chamber's room tone and lamp, courtyard birds, the forge's fire, dusk wind, the night sky, the
// rivers), with foley on the holds: the shadow's eyes open (the violet ting from Part 1 for the baby's), "shh", the peel
// and its puff, Sanjna's steps out, the children's pops, laddoos tossed, Manu's "meh", Yama's steam, his stomp, the
// raised foot, the curse, the hops and the wail, Surya's om and the flare, the trembling heart, the lathe's whir and file,
// the comet, the slow limping steps and the crow, the orbit's ticks and the three lit signs, the evening bell, the river.
import { track, tone, noise, bell, mixb, env, whoosh, rumble, plink, clang, click, thud, crunch, shimmer, slide, squeak, chirp, laughter, chime, note, seed, rnd, clamp, lerp, SR, drone, thunder, wingbeat, wind, crackle, conch, screech, om, heart, whir, fire, gurgle } from './sfx.mjs';

const EYES = 1.4, BABYEYES = 2.3, B0 = 3.6, SHH = 5.2, C0 = 7.0;
const CLOSE = 8.8, D0 = 10.8;
const PEEL = 12.4, SHH2 = 16.2, NOD = 16.8, LEAVE = 18.0, E0 = 20.8;
const KID1 = 22.4, KID2 = 22.9, KID3 = 23.4, SHANI_HI = 24.7, F0 = 28.2;
const PAT = 30.0, SHRUG = 32.4, FUME = 33.6, G0 = 35.6;
const FOOT = 37.2, TURN = 37.8, CURSE = 39.2, HOP = 39.6, H0 = 42.6;
const MED = 45.2, SEE = 46.2, CONFESS = 47.8, I0 = 50.0;
const SPIN = 50.8, DONE = 53.6, FLY = 54.8, J0 = 56.6, K0 = 60.2;
const TILT = 66.8, SIGNS = 70.1, L0 = 73.2;
const GLANCE = 75.4, SMILE = 76.2, PRAY = 78.6, M0 = 81.6, CARD = 85.6, END = 93.2;
const CAP_T = CARD + .1, COVERS = CARD + .4, PRICE = CARD + 1.2, STRIKE = CARD + 1.7, DEAD = CARD + 2.2, PILL = CARD + 2.7, SUB = CARD + 3.2, FOLLOW = CARD + 3.7;
const TOSS = [PAT - 1.2, PAT - .2, PAT + .8, PAT + 1.8, SHRUG - .4];
const T = track(END);
seed(23);
const add = (o, b, s0, g = 1) => { const s = Math.round(s0 * SR); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j] * g; return o; };
const ting = (m, amp = 1) => bell(note(m), 1.4, { amp });
const pop = (amp = 1, f = 1) => mixb(click(amp), tone(.08, t => f * (500 + 2600 * t / .08), { e: env.pluck(40), amp: amp * .7 }));
const boing = (amp = 1, f = 1) => tone(.45, t => f * (300 + 500 * Math.sin(Math.PI * clamp(t / .3))) * (1 + .08 * Math.sin(t * 2 * Math.PI * 22)), { type: 'tri', e: env.ad(.005, .15), amp });
const step = (amp = 1) => mixb(noise(.06, { hp: 200, lp: 1800, e: env.pluck(60), amp }), tone(.06, 160, { e: env.pluck(50), amp: amp * .5 }));
const drag = (amp = 1) => noise(.32, { hp: 300, lp: 1400, e: env.hann(), amp });
const coo = (amp = 1, f = 1) => tone(.45, t => f * (620 + 180 * Math.sin(Math.PI * clamp(t / .45))), { type: 'tri', e: env.hann(), fm: t => .015 * Math.sin(t * 2 * Math.PI * 7), amp });
const caw = (amp = 1) => mixb(tone(.28, t => 640 - 300 * t, { type: 'saw', e: env.swell(.02, .1), fm: t => .2 * Math.sin(t * 2 * Math.PI * 70), amp: amp * .6 }), noise(.28, { hp: 800, lp: 2600, e: env.swell(.02, .1), amp: amp * .4 }));
const hmm = (f0, f1, dur, amp = 1) => tone(dur, t => lerp(f0, f1, t / dur), { type: 'saw', e: env.hann(), fm: t => .004 * Math.sin(t * 2 * Math.PI * 6), amp: amp * .5 });
const shh = (dur = .8, amp = 1) => noise(dur, { hp: 2400, lp: 7000, e: env.hann(), amp });
const hiss = (dur, amp = 1) => noise(dur, { hp: 3000, lp: 9000, e: env.swell(.05, .3), amp });
const room = (dur, amp = 1) => noise(dur, { brown: true, lp: 500, e: env.swell(.3, .3), amp });
const cricket = (amp = 1) => { const o = new Float32Array(Math.round(.32 * SR)); for (let k = 0; k < 3; k++) add(o, tone(.045, 4300 + rnd() * 400, { e: env.hann(), amp }), k * .07); return o; };
const tweet = (amp = 1) => tone(.16, t => 2800 + 900 * Math.sin(t * 2 * Math.PI * 14), { e: env.hann(), amp });
const tick = (amp = 1, f = 2400) => mixb(click(amp * .6), tone(.04, f, { e: env.pluck(120), amp: amp * .5 }));
const wail = (dur, amp = 1) => tone(dur, t => 520 + 140 * Math.sin(t * 2 * Math.PI * 2.5) - 120 * t / dur, { type: 'tri', e: env.hann(), fm: t => .02 * Math.sin(t * 2 * Math.PI * 9), amp });
const sob = (amp = 1) => tone(.22, t => 440 - 200 * t, { type: 'tri', e: env.hann(), amp });
const rasp = (amp = 1) => noise(.12, { hp: 1800, lp: 6000, e: env.hann(), amp });
const water = (dur, amp = 1) => noise(dur, { lp: 900, hp: 120, e: env.swell(.4, .4), amp });
const flute = (m, dur, amp = 1) => mixb(
  tone(dur, t => note(m) * (1 + .006 * Math.sin(t * 2 * Math.PI * 5.2) * clamp(t / .3)), { e: env.swell(.08, .18), amp }),
  tone(dur, note(m) * 2, { e: env.swell(.1, .18), amp: amp * .12 }),
  noise(dur, { hp: note(m) * .8, lp: note(m) * 3, e: env.swell(.05, .15), amp: amp * .18 }));
const phrase = (t0, mel, amp, pan, stop = 1e9) => { let ft = t0; for (const [m, d] of mel) { if (ft > stop) break; T.at(ft, flute(m, d + .08, amp), .15, pan); ft += d; } };

// ---- A · the hook: a low drone and a heartbeat; the eyes open (a soft ting); the baby's violet glint (Part 1's)
T.at(0, drone(C0, note(38), .5), .3);
T.at(.2, heart(.5), .22); T.at(1.1, heart(.5), .22); T.at(2.0, heart(.55), .25); T.at(2.9, heart(.55), .25);
T.at(EYES, shimmer(.8, [79, 83, 86].map(note), .5), .25); T.at(EYES + .05, ting(86, .5), .25);
T.at(BABYEYES, ting(93, .8), .4, .3); T.at(BABYEYES + .05, ting(98, .5), .28, .3);
// ---- B · "shh"
T.at(B0, room(C0 - B0, .9), .06);
T.at(SHH, shh(.9, .8), .3, .1);
T.at(C0 - .35, whoosh(.5, 400, 2400), .35);
// ---- C · the palace: the sun's hum and heat; Sanjna whimpers; she shuts her eyes (a sizzle and a squeak)
T.at(C0, om(D0 - C0, 110, .6), .2); T.at(C0, fire(D0 - C0, .3, .5), .08, -.5);
T.at(C0 + .8, hmm(330, 420, .4), .25, .5);
T.at(CLOSE - .3, hiss(.6, .7), .2, -.3); T.at(CLOSE, squeak(700, 500, .2, .6), .25, .5);
T.at(CLOSE + .2, shimmer(.6, [84, 88, 91].map(note), .5), .2, -.4);
T.at(D0 - .35, whoosh(.5, 400, 2400), .35);
// ---- D · the chamber: room tone, the lamp, crickets; the peel, the puff; "shh" twice (hers, then the copy's); steps
T.at(D0, room(E0 - D0, 1), .07); T.at(D0, fire(E0 - D0, .1, .15), .05, .7);
seed(77); for (let i = 0; i < 18; i++) T.at(D0 + .3 + i * .52 + rnd() * .2, cricket(.5), .06, rnd() * 1.2 - .9);
T.at(PEEL - .7, shimmer(.8, [76, 79, 83, 86].map(note), .5), .22, .2);
T.at(PEEL, slide(1.1, 300, 900, .4), .22, -.4); T.at(PEEL + .2, crunch(.4), .1, -.4);
T.at(PEEL + 1.1, pop(.9, .8), .5, -.4); T.at(PEEL + 1.15, chime(note(74), .6, 2.5), .35, -.4);
T.at(PEEL + 1.3, squeak(500, 900, .15, .6), .2, .3);   // Sanjna's "!"
T.at(SHH2, shh(.8, .8), .28, .3); T.at(NOD, shh(.6, .6), .22, -.4); T.at(NOD + .2, plink(note(84), .6), .2, -.4);
for (let i = 0; i < 6; i++) T.at(LEAVE + .3 + i * .32, step(.55), .25, .3 + i * .1);
T.at(LEAVE + .8, chime(note(64), .4, 3), .2);
phrase(LEAVE + 1, [[69, .6], [67, .5], [64, 1.1]], .5, -.4);
T.at(E0 - .35, whoosh(.5, 400, 2400), .35);
// ---- E · the palace: Surya's hearts; three pops (coos, rising); Shani's shy look; a little wave
T.at(E0, om(F0 - E0, 110, .5), .16);
for (let i = 0; i < 4; i++) T.at(E0 + .6 + i * .35, plink(note(84 + i * 3), .5), .15, -.4);
[[KID1, 1], [KID2, 1.12], [KID3, 1.25]].forEach(([t0, f], i) => { T.at(t0, pop(.8, f), .45, -.4 + i * .4); T.at(t0 + .1, coo(.6, f), .2, -.4 + i * .4); });
T.at(SHANI_HI, whoosh(.8, 300, 1600, .6), .2);
T.at(SHANI_HI + 1, ting(91, .5), .3); T.at(SHANI_HI + 1.05, shimmer(.7, [86, 91, 95].map(note), .4), .18);
for (let i = 0; i < 4; i++) T.at(SHANI_HI + 1.4 + i * .18, plink(note(91 + (i % 2) * 2), .4), .1, .2);
T.at(F0 - .25, whoosh(.35, 800, 5000), .4);
// ---- F · lunch: birds; laddoos tossed (a whoosh, a plop); munching; Manu's "meh"; Yama's steam
T.at(F0, wind(G0 - F0, 2, .8), .12);
seed(31); for (let i = 0; i < 10; i++) T.at(F0 + .2 + i * .7 + rnd() * .2, tweet(.5), .09, rnd() * 1.6 - .8);
for (const t0 of TOSS) { T.at(t0, whoosh(.3, 900, 2800, .5), .18, -.6); T.at(t0 + .5, thud(.35), .25, -.5); T.at(t0 + .5, plink(note(79), .4), .12, -.5); }
for (let i = 0; i < 12; i++) T.at(TOSS[0] + .7 + i * .38, crunch(.25), .08, -.6);
T.at(SHRUG, hmm(260, 200, .5), .3, .3); T.at(SHRUG + .1, boing(.4, .8), .12, .3);
T.at(FUME - 1, hmm(200, 160, .4), .25, .5);
T.at(FUME, hiss(1.6, .8), .25, .5); T.at(FUME + .3, tone(1.1, t => 1800 + 300 * t, { e: env.swell(.2, .3), amp: .3 }), .08, .5);
// ---- G · stomp in; the raised foot (a squeak up, a wobble); she whirls; the curse; the hops and the wail
for (let i = 0; i < 5; i++) T.at(G0 + .2 + i * .27, thud(.45), .3, .7 - i * .1);
T.at(FOOT, squeak(300, 900, .25, .7), .3, .2);
T.at(FOOT + .3, tone(1.5, t => 220 + 20 * Math.sin(t * 2 * Math.PI * 7), { type: 'tri', e: env.swell(.1, .3), amp: .4 }), .12, .2);
T.at(TURN, whoosh(.25, 900, 3000), .35, -.3); T.at(TURN + .3, plink(note(91), .7), .2, -.3);
T.at(CURSE - .3, hmm(330, 200, .35), .3, -.3);
T.at(CURSE - .05, crackle(1.0, .8), .4); T.at(CURSE, thunder(1.3, .7), .42);
T.at(CURSE + .3, drone(H0 - CURSE - .3, note(41), .4), .2);
for (let i = 0; i < 7; i++) T.at(HOP + .1 + i * .45, boing(.5, 1.2), .18, .3);
T.at(HOP + .2, wail(2.2, .8), .22, .3);
T.at(H0 - .35, whoosh(.5, 400, 2400), .35);
// ---- H · Yama hops in sobbing; Surya's om in meditation; the flare; her trembling heart; the confession
T.at(H0, om(I0 - H0, 110, .45), .12);
for (let i = 0; i < 5; i++) T.at(H0 + .2 + i * .32, boing(.4, 1.25), .14, -.8 + i * .1);
for (let i = 0; i < 4; i++) T.at(H0 + 1.8 + i * .5, sob(.6), .16, -.7);
T.at(MED, om(SEE - MED + .3, 147, .7), .3);
T.at(SEE, chime(note(88), .8, 2.5), .4); T.at(SEE, whoosh(.5, 600, 4000), .3, .2); T.at(SEE + .05, shimmer(.8, [84, 88, 91, 96].map(note), .6), .3);
for (let i = 0; i < 4; i++) T.at(SEE + .3 + i * .38, heart(.6 + i * .08), .25, .6);
T.at(CONFESS, slide(1.2, 600, 260, .45), .22, .5); T.at(CONFESS + .3, chime(note(62), .4, 3), .22, .5);
T.at(I0 - .35, whoosh(.5, 400, 2400), .35);
// ---- I · the forge: fire; the lathe's whir; the file; two tings for the chakra and the trishul sparks; the comet
T.at(I0, fire(J0 - I0, .5, .7), .18);
T.at(I0 + .3, clang(note(60), .5), .15, .5);
T.at(SPIN, whir(DONE - SPIN, .7), .2, -.2);
for (let t = SPIN + .3; t < DONE - .1; t += .22) T.at(t, rasp(.7), .12, .3);
T.at(SPIN + .8, ting(96, .6), .3, .5); T.at(SPIN + 1.6, ting(91, .6), .3, .6);
T.at(DONE, slide(.6, 500, 200, .4), .2, -.2);
for (let i = 0; i < 4; i++) T.at(DONE + .2 + i * .18, tweet(.5), .1, -.3);   // dizzy birds
T.at(FLY - .1, pop(.8, .7), .4, -.2); T.at(FLY, whoosh(.9, 300, 5000), .45, .5); T.at(FLY + .1, shimmer(1, [84, 88, 91, 96].map(note), .5), .3, .6);
T.at(FLY + 1.1, laughter(.8, .5), .12, .5);
// ---- J · dusk wind; the gold streak passes; a sad little flute; his first step
T.at(J0, wind(K0 - J0 + .3, 1, 1), .22);
T.at(J0 + .2, whoosh(1.4, 300, 2600, .7), .3, .6);
phrase(J0 + 1.6, [[71, .5], [69, .5], [67, .7], [64, 1.2]], .5, -.2);
T.at(K0 - .4, step(.5), .25);
// ---- K · the night sky: wind; the slow limping steps (a step and a drag); the crow; up to the orbit; ticks; lit signs
T.at(K0, drone(L0 - K0, note(36), .45), .22);
T.at(K0, wind(TILT - K0 + .5, 4, .7), .1);
for (let t = K0 + .3; t < TILT - .2; t += 1.43) { T.at(t, step(.6), .22, -.3 + (t - K0) * .08); T.at(t + .72, drag(.6), .14, -.3 + (t - K0) * .08); }
seed(9); for (let i = 0; i < 10; i++) T.at(K0 + .4 + i * 1.2 + rnd() * .3, plink(note(96 + (i % 3) * 2), .3), .07, rnd() * 1.4 - .7);
T.at(K0 + 2, caw(.6), .2, .2);
T.at(TILT, whoosh(1.2, 300, 1800, .6), .3); T.at(TILT + 1, shimmer(1, [79, 83, 86, 91].map(note), .4), .18);
for (let i = 0; i < 12; i++) T.at(SIGNS - .5 + i * .05, tick(.6, 2000 + i * 60), .14, -.6 + i * .1);
for (let j = 0; j < 3; j++) T.at(SIGNS + .2 + j * 1, ting(84 + j * 3, .7), .3, -.3 + j * .3);
T.at(SIGNS + .1, chime(note(79), .5, 2.5), .22);   // the Moon
// ---- L · the evening wall: a warm om; the glance; the smile (a chime); the shadow's blink; the temple bell
T.at(L0, om(M0 - L0, 98, .55), .16); T.at(L0, room(M0 - L0, 1), .05);
T.at(L0 + .2, heart(.5), .18); T.at(L0 + 1.1, heart(.5), .18);
T.at(GLANCE, whoosh(.4, 500, 1800, .4), .15, .3);
T.at(SMILE, chime(note(76), .5, 2.5), .3, .2); T.at(SMILE + .8, plink(note(88), .5), .2, .4);
phrase(SMILE + .4, [[74, .6], [76, .5], [79, .9], [76, .7]], .5, .2, PRAY - .2);
T.at(PRAY, bell(note(57), 3.5, { amp: .8 }), .35); T.at(PRAY + .4, conch(1.6, 311, .4), .12);
T.at(M0 - .35, whoosh(.5, 400, 2400), .35);
// ---- M · the rivers: water; the girls giggle; the crow
T.at(M0, water(CARD - M0, .9), .2); T.at(M0, gurgle(CARD - M0, .4), .1);
T.at(M0 + .3, laughter(1.2, .5), .14, -.5); T.at(M0 + 1.4, laughter(1, .5), .12, .5);
T.at(M0 + .9, caw(.6), .2, .3);
for (let i = 0; i < 5; i++) T.at(M0 + .5 + i * .6, plink(note(84 + (i % 3) * 3), .4), .12, -.6 + i * .3);
T.at(CARD - .3, whoosh(.6, 500, 3000), .4);
// ---- N · the card (as Part 1)
T.at(CAP_T, om(END - CAP_T, 147, .5), .12);
T.at(CAP_T, chime(note(79), .6, 2.5), .45);
T.at(COVERS, plink(note(84)), .3, -.4); T.at(COVERS + .12, plink(note(88)), .3, .4); T.at(COVERS + .24, plink(note(91)), .3);
T.at(STRIKE, squeak(900, 400, .15, .6), .3); T.at(STRIKE + .1, chime(note(84), .6, 2), .4);
T.at(PILL, ting(91, .7), .4);
T.at(SUB, plink(note(86)), .25, -.3); T.at(FOLLOW, chime(note(84), .6, 2.5), .35); T.at(FOLLOW + .15, chime(note(91), .4, 2.5), .25);
T.at(FOLLOW + 2, shimmer(1.4, [79, 83, 86, 91].map(note), .4), .18);
T.write('assets/shani2_sfx.wav');
