// hanu7_sfx.mjs: the sound for "BHARAT shot HANUMAN out of the sky" (src/scenes/hanu7.js, ad 95, Hanuman Part 7, no
// voice) → assets/hanu7_sfx.wav (then loudness-normalised to assets/hanu7_mix.wav). Times are the scene's constants
// (keep them in sync). Retro synth cartoon foley as in Parts 1–6: night wind and the arrow; a sob and a healer's hum;
// Ravana's chorus and a magic poof; a too-sweet sage; splashes, a snap of jaws, a bonk, a harp for the apsara; the tail's
// whip and a wham; a held silence, a bowstring, a thunk and a long fall; running feet, a low drone, a prayer swell, a
// gold burst as he wakes; sobs; an arrow idea, pride's tuba and a humble chime. Music only as mild beds: a drone under
// the grief, a warm pad under the prayer and the twist, a music box under the ask.
import { track, tone, noise, bell, mixb, env, whoosh, plink, squeak, click, thud, shimmer, slide, chime, drum, note, seed, rnd, clamp, heart, rumble, chirp, wingbeat, laughter, om, SR } from './sfx.mjs';

const STRIKE = 2.6;
const B0 = 4.4, LEAP = 7.7, C0 = 9.0, POOF = 11.6, D0 = 13.4, E0 = 17.8, BITE = 18.7, BONK = 19.8, RISE = 20.4, F0 = 22.2, TRUTH = 24.4;
const G0 = 26.6, WHAM = 28.7, I0 = 31.0, SEES = 33.2, J0 = 35.4, DRAW = 37.0, SHOOT = 38.5, K0 = 39.8, HIT = 40.4, GROUND = 42.1;
const L0 = 44.2, KNEEL = 45.5, M0 = 48.6, LIGHT = 50.6, N0 = 53.4, WAKE = 53.9, HUG = 55.4, O0 = 57.8, P0 = 62.4, Q0 = 67.4, BOW = 70.0;
const R0 = 72.4, S0 = 77.4, U0 = 81.0, V0 = 86.0, CARD = 89.2, END = 92.8;

const T = track(END);
seed(95);
function voice(syl, f0, { amp = 1, fall = .1, rise = 0, shake = 0 } = {}) {
  const D = Math.max(...syl.map(([s, d]) => s + d)) + .1, o = new Float32Array(Math.round(D * SR));
  let ph = 0, l = 0;
  for (let i = 0; i < o.length; i++) {
    const t = i / SR, s = syl.find(([a, d]) => t >= a && t < a + d);
    if (!s) { o[i] = 0; continue; }
    const [a, d, pm, br] = s, k = (t - a) / d, e = clamp(k / .12) * clamp((1 - k) / .25);
    ph += f0 * pm * (1.04 - fall * k + rise * k) * (1 + .012 * Math.sin(t * 38) + shake * .04 * Math.sin(t * 2 * Math.PI * 7)) / SR;
    const x = 2 * (ph - Math.floor(ph)) - 1, fc = 600 + br * 2400 * Math.sin(Math.PI * clamp(k * 1.3)), al = 1 - Math.exp(-2 * Math.PI * fc / SR);
    l += al * (x * e - l); o[i] = l * amp;
  }
  return o;
}
const talk = (dur, f, { gap = .16, amp = 1, br = .5, fall = .1 } = {}) =>
  voice(Array.from({ length: Math.max(1, Math.floor(dur / gap)) }, (_, i) => [i * gap, gap * .72, 1 + .14 * Math.sin(i * 2.3) - (i % 5 === 4 ? .12 : 0), br]), f, { amp, fall });
const HANU = 230, RAVF = 110, LAKF = 200;
const giggle = (f, amp = 1, n = 4) => voice(Array.from({ length: n }, (_, i) => [i * .11, .08, 1.25 - i * .04, .7]), f, { amp, fall: .2 });
const huh = (f, amp = 1) => voice([[0, .32, 1, .6]], f, { amp, rise: .9, fall: 0 });
const ooh = (f, amp = 1) => voice([[0, .3, 1.1, .5]], f, { amp, rise: .3, fall: 0 });
const strain = (f, amp = 1, d = .5) => voice([[0, d, .9, .3]], f, { amp, fall: .1, shake: 1 });
const hmph = f => voice([[0, .14, 1.1, .5], [.18, .3, .85, .3]], f, { fall: .4 });
const pop = (f = 900, amp = 1) => mixb(squeak(f * .6, f * 1.6, .07, amp), plink(f * 1.5, amp * .5));
const boing = (amp = 1, f = 220) => tone(.35, t => f * (1 + 2.2 * t) * (1 + .18 * Math.sin(t * 2 * Math.PI * 18) * Math.exp(-t * 6)), { type: 'tri', e: env.pluck(6), amp });
const pad = (dur, ms, amp = 1, a = 1.2, r = 1.4) => mixb(...ms.map((m, i) => tone(dur, t => note(m) * (1 + .003 * Math.sin(t * 2 + i)), { type: 'tri', e: env.swell(a, r), amp: amp / ms.length })));
const swell = (dur, ms, amp = 1) => mixb(...ms.map((m, i) => tone(dur, note(m), { type: 'tri', e: env.swell(dur * .45, dur * .5), amp: amp / ms.length })));
const drone = (dur, amp = 1) => mixb(tone(dur, note(43), { type: 'tri', e: env.swell(1.0, 1.0), amp: .5 * amp }), tone(dur, note(50), { type: 'tri', e: env.swell(1.0, 1.0), amp: .4 * amp }), tone(dur, note(55), { type: 'tri', e: env.swell(1.0, 1.0), amp: .25 * amp }));
const musicBox = f => bell(f, 1.6, { partials: [[1, 1], [3.0, .25], [5.1, .08]], k: 2.6 });
const slap = (amp = 1) => mixb(noise(.09, { hp: 1500, lp: 9000, e: env.pluck(60), amp }), noise(.25, { hp: 300, lp: 2500, e: env.pluck(14), amp: amp * .6 }), thud(amp * .9), tone(.1, 1200, { e: env.pluck(50), amp: amp * .3 }));
const boom = (amp = 1) => mixb(drum(38, amp * 1.4, 1.4), thud(amp), noise(1.4, { lp: 1200, hp: 30, e: env.pluck(2.5), amp: amp * .8 }), noise(.12, { hp: 2000, lp: 9000, e: env.pluck(40), amp: amp * .6 }));
const bray = (amp = 1) => voice([[0, .22, 1.6, .7], [.24, .3, 1.0, .5], [.56, .22, 1.6, .7], [.8, .3, 1.0, .5]], 300, { amp, fall: .2 });
const arrowSnd = (amp = 1) => whoosh(.25, 3200, 900, amp);
const tweets = (t0, dur, pan = 0) => { for (let t = t0; t < t0 + dur; t += .28) T.at(t, mixb(chirp(.6), squeak(2600, 3400, .08, .4)), .05, pan + (rnd() - .5) * .3); };
const warDrum = (a, b, amp = .5) => { for (let t = a; t < b; t += .62) { T.at(t, drum(52, amp, .5), .1, 0); T.at(t + .31, drum(64, amp * .6, .3), .07, 0); } };
const chorus = (dur, amp = 1) => mixb(...[0, 1, 2, 3, 4].map(i => talk(dur, RAVF * (1 + i * .18), { gap: .13 + i * .01, br: .5, amp: amp / 3 })));

// ================= A · the hook: night wind, the arrow rising, the hit =================
T.at(0, drone(B0 + .3, .5), .06, 0);
T.at(0, whoosh(2.6, 300, 1400), .09, -.2);
T.at(.2, whoosh(2.3, 1200, 4200, .8), .11, .4);
T.at(STRIKE, mixb(thud(1), slap(.7)), .16, 0);
T.at(STRIKE + .05, mixb(pop(1100, .9), huh(HANU, .8)), .13, 0);
tweets(STRIKE + .3, 1.2, 0);
T.at(B0 - .3, whoosh(.6, 400, 3000), .14, 0);

// ================= B · Lakshman down; the healer names the herb; Hanuman leaps =================
T.at(B0, drone(C0 - B0, .8), .07, 0);
for (let k = 0; k < 3; k++) T.at(B0 + .3 + k * .9, voice([[0, .22, 1.1, .4], [.26, .3, .9, .3]], 150, { amp: .7, fall: .3, shake: 1 }), .09, -.5);   // Ram's sobs
T.at(B0 + .7, mixb(pop(900, .8), plink(note(88), .5)), .12, .1);
T.at(B0 + .8, talk(2.0, 170, { gap: .19, br: .4 }), .1, .1);
T.at(B0 + .9, shimmer(1.6, [note(88), note(93), note(97)], .6, .08), .09, .1);
T.at(LEAP - .5, squeak(300, 200, .4, .6), .08, .4);
T.at(LEAP, mixb(boing(.9, 240), whoosh(.7, 500, 4000)), .15, .4);
T.at(C0 - .3, whoosh(.5, 3000, 500), .12, 0);

// ================= C · Ravana and Kalanemi; the demon becomes a sage =================
T.at(C0 + .2, chorus(2.0, 1), .12, -.4);
warDrum(C0, POOF, .3);
T.at(C0 + .9, mixb(pop(800, .8), noise(.8, { hp: 800, lp: 5000, e: env.swell(.2, .5), amp: .3 })), .1, .2);       // Lanka burning, in his head
T.at(C0 + 1.2, voice([[0, .2, 1.3, .6], [.24, .2, 1.4, .6], [.48, .3, 1.5, .6]], 130, { amp: .8, shake: 1 }), .11, .4);
T.at(POOF, mixb(noise(.5, { hp: 600, lp: 7000, e: env.pluck(7), amp: .8 }), slide(.5, 300, 1400, .6), shimmer(.9, [note(81), note(88), note(93)], .7, .07)), .14, .4);
T.at(POOF + .35, chime(note(96), 1, 1.4), .12, .4);
T.at(POOF + .9, giggle(RAVF * 1.3, .7, 5), .09, -.4);

// ================= D · the false ashram =================
T.at(D0, pad(E0 - D0, [60, 64, 67, 72], .9, .5, .7), .05, 0);
for (let k = 0; k < 5; k++) T.at(D0 + .2 + k * .8, chirp(.5), .04, (k % 2 ? .5 : -.5));                           // crickets
T.at(D0 + .5, talk(2.1, 150, { gap: .2, br: .7 }), .1, -.3);
T.at(D0 + .3, chime(note(93), .6, 1.2), .07, -.3);
T.at(D0 + 2.7, mixb(plink(note(100), .7), squeak(1800, 2600, .08, .4)), .1, -.3);                                   // the fang's glint
T.at(D0 + 2.8, ooh(HANU, .8), .1, .2);
T.at(D0 + 3.3, giggle(120, .5, 4), .07, -.3);

// ================= E · the crocodile; one blow; the apsara =================
const splash = (amp = 1) => mixb(noise(.5, { hp: 900, lp: 6000, e: env.pluck(8), amp }), noise(.3, { hp: 200, lp: 1500, e: env.pluck(12), amp: amp * .6 }));
T.at(E0 + .1, splash(.5), .1, -.2);
T.at(E0 + .3, tone(.6, t => 90 + 30 * t, { type: 'tri', e: env.swell(.2, .3), amp: .5 }), .1, .3);                // something under the water
T.at(BITE - .1, splash(.9), .13, .1);
T.at(BITE, mixb(click(1), thud(.6), squeak(500, 300, .12, .6)), .15, 0);                                           // jaws
T.at(BITE + .05, mixb(pop(1100, .9), voice([[0, .45, 1.6, .8]], HANU, { amp: 1, rise: .3 })), .13, -.2);
for (let k = 0; k < 3; k++) T.at(BITE + .3 + k * .22, mixb(boing(.5, 300), splash(.4)), .09, -.2);
T.at(BONK, mixb(slap(1), drum(45, 1, .5), tone(.25, t => 700 - 900 * t, { type: 'tri', e: env.pluck(10), amp: .6 })), .17, .1);
tweets(BONK + .15, .5, .2);
T.at(RISE, mixb(noise(.5, { hp: 600, lp: 7000, e: env.pluck(7), amp: .6 }), slide(.8, 400, 1800, .5)), .12, .2);
[0, 4, 7, 12, 16, 19, 24].forEach((m, i) => T.at(RISE + .1 + i * .08, bell(note(76 + m), 1.2, { k: 3 }), .08, .2));   // a harp run
T.at(RISE + .5, mixb(pop(1000, .7), huh(HANU, .7)), .11, -.3);

// ================= F · the truth =================
T.at(F0, pad(G0 - F0, [64, 69, 73, 76], .9, .5, .7), .05, 0);
T.at(F0 + .3, talk(3.0, 330, { gap: .17, br: .8 }), .09, .3);
T.at(F0 + 1.5, mixb(pop(900, .7), plink(note(88), .5)), .1, 0);
T.at(TRUTH, mixb(noise(.4, { hp: 600, lp: 6000, e: env.pluck(8), amp: .7 }), tone(.5, t => note(46) * (1 - .1 * t), { type: 'saw', e: env.pluck(4), amp: .5 })), .13, 0);
T.at(TRUTH + .5, mixb(hmph(HANU), pop(700, .6)), .12, -.3);
T.at(F0 + 3.6, mixb(slide(.8, 600, 2400, .5), shimmer(.8, [note(93), note(97), note(100)], .6, .06)), .1, .3);

// ================= G · the fee: the tail, and wham =================
for (let k = 0; k < 4; k++) T.at(G0 + .1 + k * .8, chirp(.5), .04, (k % 2 ? .5 : -.5));
T.at(G0 + .3, talk(1.3, HANU, { gap: .15, br: .7 }), .11, .2);
T.at(G0 + 1.2, giggle(120, .6, 4), .08, -.3);
T.at(WHAM - .55, whoosh(.5, 600, 5000, 1), .14, 0);
T.at(WHAM, mixb(boom(1), slap(.9)), .18, -.2);
T.at(WHAM + .35, thud(.8), .13, -.3);
tweets(WHAM + .5, 1.4, -.3);
for (let k = 0; k < 6; k++) T.at(WHAM + .3 + k * .2, mixb(plink(note(96 - k), .5), click(.3)), .07, -.5);          // the halo rolls off
for (let k = 0; k < 4; k++) T.at(WHAM + .8 + k * .16, noise(.07, { hp: 1200, lp: 6000, e: env.pluck(30), amp: .6 }), .08, .2);   // dusting his hands
T.at(I0 - .3, whoosh(.6, 400, 3000), .13, 0);

// ================= I · over Ayodhya =================
T.at(I0, pad(J0 - I0, [57, 64, 69], .8, .6, .8), .05, 0);
T.at(I0 + .1, whoosh(4.0, 300, 1200), .1, 0);
for (let k = 0; k < 6; k++) T.at(I0 + .3 + k * .7, chirp(.4), .035, (k % 2 ? .5 : -.5));
T.at(I0 + .8, mixb(pop(800, .6), huh(150, .6)), .1, -.4);
T.at(SEES, mixb(pop(1100, .9), plink(note(88), .5), voice([[0, .3, 1.3, .7]], 150, { rise: .4 })), .13, -.4);

// ================= J · the shot: silence, the string, the release =================
T.at(J0 + .25, mixb(pop(700, .7), tone(.9, note(40), { type: 'saw', e: env.swell(.3, .5), amp: .35 })), .11, 0);
T.at(DRAW - .4, squeak(200, 320, .35, .5), .08, -.2);
T.at(DRAW, tone(1.0, t => 180 + 240 * t, { type: 'tri', e: env.swell(.5, .1), amp: .4 }), .09, -.2);              // the string creaks tight
for (let k = 0; k < 4; k++) T.at(DRAW + .1 + k * .25, click(.4), .06, -.2);
T.at(SHOOT, mixb(tone(.5, t => 240 * (1 + .25 * Math.sin(t * 2 * Math.PI * 30) * Math.exp(-t * 8)), { type: 'tri', e: env.pluck(7), amp: 1 }), click(.8)), .16, -.2);
T.at(SHOOT + .02, whoosh(.9, 5000, 1200, 1), .15, .3);

// ================= K · the hit; the fall; "Ram… Ram…" =================
T.at(K0, whoosh(.6, 4000, 1500, .8), .11, -.3);
T.at(HIT, mixb(thud(1.1), drum(48, 1, .5), noise(.1, { hp: 1500, lp: 8000, e: env.pluck(40), amp: .6 })), .17, .2);
T.at(HIT + .1, tone(GROUND - HIT - .1, t => 1500 * Math.exp(-t * 1.2), { type: 'tri', e: env.swell(.1, .1), amp: .4 }), .1, .2);   // falling
for (let k = 0; k < 3; k++) T.at(HIT + .3 + k * .75, mixb(voice([[0, .34, 1, .5], [.4, .34, .9, .4]], HANU * .8, { amp: .9, fall: .15 }), chime(note(81 + k * 2), .5, 1.6)), .11, .1);   // "Ram… Ram…"
T.at(HIT + .95, mixb(pop(1100, .8), voice([[0, .3, 1.3, .7]], 150, { rise: .4 })), .12, -.5);
T.at(GROUND, mixb(boom(.8), thud(1)), .16, .2);
T.at(GROUND + .5, drone(L0 - GROUND, .6), .07, 0);

// ================= L · he runs; he holds him; no answer =================
T.at(L0, drone(M0 - L0 + .5, .9), .08, 0);
for (let k = 0; k < 6; k++) T.at(L0 + .1 + k * .2, mixb(click(.5), drum(64, .3, .2)), .09, -.5 + k * .1);
T.at(KNEEL, thud(.5), .1, -.3);
T.at(KNEEL + .4, talk(1.5, 150, { gap: .2, br: .5 }), .1, -.3);
for (let k = 0; k < 2; k++) T.at(KNEEL + 2.1 + k * .5, voice([[0, .22, 1.1, .4], [.26, .3, .9, .3]], 150, { amp: .7, fall: .3, shake: 1 }), .09, -.3);

// ================= M · the prayer =================
T.at(M0, pad(N0 - M0 + .4, [55, 62, 67], 1, 1.4, 1), .07, 0);
T.at(M0 + .3, talk(3.2, 150, { gap: .22, br: .4 }), .09, -.3);
for (let k = 0; k < 3; k++) T.at(M0 + .6 + k * 1.2, heart(.6), .06, 0);
T.at(LIGHT, swell(N0 - LIGHT + .5, [67, 71, 74, 79], 1), .12, 0);
T.at(LIGHT + .3, shimmer(2.2, [note(86), note(91), note(95), note(98)], .7, .07), .09, .2);

// ================= N · he wakes =================
T.at(WAKE, mixb(chime(note(91), 1, 2), pop(1000, .9), boing(.6, 300)), .15, .2);
T.at(WAKE + .1, voice([[0, .22, 1.2, .7], [.26, .22, 1.35, .7], [.52, .5, 1.5, .8]], HANU, { amp: 1, fall: 0 }), .13, .2);
T.at(WAKE + .15, voice([[0, .35, 1.3, .7]], 150, { rise: .5 }), .11, -.3);
T.at(WAKE + .3, shimmer(1.4, [note(88), note(93), note(96), note(100)], .8, .08), .1, 0);
T.at(HUG, mixb(slide(.3, 400, 700, .4), thud(.3)), .09, 0);
T.at(HUG, pad(O0 - HUG, [60, 67, 72, 76], 1, .4, .6), .07, 0);
for (let k = 0; k < 3; k++) { T.at(HUG + .3 + k * .22, pop(800 + k * 120, .5), .07, 0); T.at(HUG + 1.3 + k * .22, pop(900 + k * 120, .5), .07, 0); }

// ================= O · the grief =================
T.at(O0, drone(P0 - O0, .8), .07, 0);
T.at(O0 + .1, talk(1.6, HANU, { gap: .16, br: .5 }), .1, .3);
T.at(O0 + .2, pop(800, .6), .08, 0);
T.at(O0 + 2.2, talk(1.9, 140, { gap: .24, br: .3, fall: .2 }), .1, -.3);
for (let k = 0; k < 3; k++) T.at(O0 + 2.0 + k * .8, voice([[0, .2, 1.1, .4], [.24, .3, .9, .3]], 150, { amp: .7, fall: .3, shake: 1 }), .08, -.3);

// ================= P · "sit on my arrow" =================
T.at(P0, pad(Q0 - P0, [62, 66, 69, 74], .9, .4, .6), .06, 0);
T.at(P0 + .3, talk(3.6, 150, { gap: .17, br: .6 }), .1, -.3);
T.at(P0 + 1.3, mixb(pop(900, .8), plink(note(88), .5)), .11, 0);
T.at(P0 + 1.5, whoosh(2.6, 2500, 3500, .5), .07, 0);
T.at(P0 + 2.4, mixb(pop(1000, .7), huh(HANU, .8)), .11, .4);

// ================= Q · pride, then Ram =================
[0, -2, -4, -5].forEach((m, i) => T.at(Q0 + .3 + i * .35, tone(.3, note(48 + m), { type: 'saw', e: env.pluck(5), amp: .5 }), .1, .3));   // pride's tuba
T.at(Q0 + .9, mixb(pop(800, .7), hmph(HANU)), .11, .3);
T.at(Q0 + 1.6, mixb(squeak(400, 250, .5, .5), click(.5)), .08, .2);                                               // the arrow creaks in his head
T.at(Q0 + 2.1, mixb(click(1), noise(.1, { hp: 1500, lp: 7000, e: env.pluck(30), amp: .6 })), .1, .2);            // …and snaps
T.at(BOW - .1, pop(600, .6), .09, .2);
T.at(BOW, mixb(chime(note(88), 1, 2.2), shimmer(1.6, [note(81), note(88), note(93)], .8, .08)), .13, 0);
T.at(BOW, swell(R0 - BOW + .3, [62, 69, 74, 78], 1), .1, 0);
T.at(BOW + .5, ooh(HANU, .7), .09, .3);

// ================= R · the twist =================
T.at(R0, swell(5.0, [55, 62, 67, 71, 74], 1), .14, 0);
T.at(R0 + .2, pad(5.0, [55, 62, 67], .8, 1, 1), .06, 0);
T.at(R0 + .1, whoosh(4.6, 300, 1300), .07, 0);
for (let k = 0; k < 4; k++) T.at(R0 + .6 + k * 1.1, heart(.7), .07, 0);
T.at(R0 + .7, mixb(pop(900, .7), plink(note(88), .5)), .1, .3);
T.at(R0 + 1.5, mixb(chime(note(93), .9, 2), plink(note(100), .4)), .1, 0);
for (let k = 0; k < 3; k++) { T.at(R0 + 1.6 + k * .22, pop(800 + k * 120, .5), .07, .3); T.at(R0 + 3.2 + k * .22, pop(900 + k * 120, .5), .07, .3); }

// ================= S · in time =================
T.at(S0, mixb(whoosh(.5, 3000, 500), thud(.5)), .12, .3);
T.at(S0 + .7, mixb(chime(note(88), 1, 1.6), boing(.6, 280), ooh(LAKF, .8)), .13, -.1);
T.at(S0 + .9, shimmer(1.4, [note(88), note(93), note(96)], .8, .08), .1, 0);
T.at(S0 + 1.1, giggle(HANU, .8, 5), .09, .4);
T.at(S0, pad(U0 - S0, [60, 64, 67, 72], 1, .4, .6), .07, 0);

// ================= ask, next, card =================
{
  const TUNE = [0, 4, 7, 4, 9, 7, 4, 2, 0, 2, 4, 7, 4, 2, 0, -3];
  let i = 0;
  for (let t = U0 + .2; t < V0 - .2; t += .34) { const m = TUNE[i++ % TUNE.length]; T.at(t, musicBox(note(81 + m)), .08, i % 2 ? -.25 : .25); }
  T.at(U0, pad(V0 - U0, [57, 64, 69, 73], 1, .6, .8), .06, 0);
}
T.at(U0 + .5, pop(800, .7), .09, -.4); T.at(U0 + 1.0, pop(900, .6), .08, 0); T.at(U0 + 1.3, pop(1000, .7), .09, .4);
for (let k = 0; k < 3; k++) T.at(U0 + 2.4 + k * .22, pop(900 + k * 120, .5), .07, 0);
T.at(V0, mixb(whoosh(.5, 3000, 400), slide(.6, 300, 900, .5)), .13, 0);
T.at(V0, pad(CARD - V0, [62, 66, 69, 74], 1, .4, .6), .07, 0);
T.at(V0 + .2, talk(1.3, 160, { gap: .18, br: .6 }), .09, -.3);
T.at(V0 + .6, shimmer(1.2, [note(88), note(93), note(96)], .7, .08), .09, 0);
T.at(V0 + 1.6, mixb(pop(1100, .8), plink(note(88), .5), huh(HANU, .8)), .12, .3);
T.at(CARD, whoosh(.4, 3000, 600), .14, 0);
[.3, .45, .6].forEach((d, i) => T.at(CARD + d, pop(600 + i * 100, .8), .14, -.4 + i * .4));
T.at(CARD + 1.0, chime(note(81), 1, 1.6), .14, 0); T.at(CARD + 1.6, mixb(pop(900, .8), plink(note(88), .8)), .14, 0);
T.at(CARD + 2.2, shimmer(1.2, [note(81), note(85), note(88), note(93)], .7, .09), .12, 0);

T.write('assets/hanu7_sfx.wav');
console.log('assets/hanu7_sfx.wav', END + ' s');
