// ayy1_sfx.mjs: the sound for "His father is SHIVA. His mother is VISHNU." (src/scenes/ayy1.js, ad 101, Ayyappa
// Part 1, no voice) -> assets/ayy1_sfx.wav (then loudness-normalised to assets/ayy1_mix.wav).
// Times are the scene's constants (keep them in sync). Retro synth cartoon foley as in the Hanuman series, and one
// thread: HIS BELL. A small gold bell ("ting") rings in the hook, is missing from the birth (a soft chime instead), is
// tied on with a bright ring, rings as he lands by the Pampa, and twice in the ask. Mild pads under the tender beats.
import { track, tone, noise, bell, mixb, env, whoosh, plink, squeak, click, thud, shimmer, slide, chime, drum, note, seed, rnd, clamp, heart, chirp, wind, rumble, roar, SR } from './sfx.mjs';

const RING = 1.6, GIG = 2.4;
const B0 = 4.6, BRAHMA = 7.4, C0 = 9.6, BUB = 11.4, LAUGH = 12.9, D0 = 15.0, BUFF = 15.5, FLEE = 16.7;
const E0 = 19.0, MPOP = 19.4, F0 = 24.0, SHUT = 26.4, G0 = 29.0, SERVE = 30.2, PEEKA = 31.6;
const H0 = 33.0, VANISH = 36.4, I0 = 37.6, SEE = 39.5, J0 = 43.0, CATCH = 45.6;
const K0 = 47.4, OPEN = 49.4, L0 = 52.6, MPOOF = 54.8, HOP = 55.8, M0 = 58.0, LKS = 59.8, ALL4 = 61.0;
const N0 = 63.4, O0 = 67.6, TIE = 70.2, P0 = 73.6, LAND = 75.4, Q0 = 78.4, CARD = 83.0, END = 86.6;

const T = track(END);
seed(101);
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
const KID = 430, MHIF = 150, BRF = 120, MOHF = 330, SHVF = 140, ASF = 110;
const giggle = (f, amp = 1, n = 4) => voice(Array.from({ length: n }, (_, i) => [i * .11, .08, 1.25 - i * .04, .7]), f, { amp, fall: .2 });
const huh = (f, amp = 1) => voice([[0, .32, 1, .6]], f, { amp, rise: .9, fall: 0 });
const ooh = (f, amp = 1) => voice([[0, .3, 1.1, .5]], f, { amp, rise: .3, fall: 0 });
const cackle = (f, amp = 1, n = 6) => voice(Array.from({ length: n }, (_, i) => [i * .13, .1, 1.3 - (i % 2) * .15, .8]), f, { amp, fall: .1, shake: 1 });
const hmm = (f, amp = 1) => voice([[0, .5, 1, .2]], f, { amp, fall: 0, shake: .5 });
const pop = (f = 900, amp = 1) => mixb(squeak(f * .6, f * 1.6, .07, amp), plink(f * 1.5, amp * .5));
const boing = (amp = 1, f = 220) => tone(.35, t => f * (1 + 2.2 * t) * (1 + .18 * Math.sin(t * 2 * Math.PI * 18) * Math.exp(-t * 6)), { type: 'tri', e: env.pluck(6), amp });
const pad = (dur, ms, amp = 1, a = 1.2, r = 1.4) => mixb(...ms.map((m, i) => tone(dur, t => note(m) * (1 + .003 * Math.sin(t * 2 + i)), { type: 'tri', e: env.swell(a, r), amp: amp / ms.length })));
const hpop = (t0, pan = 0) => { for (let k = 0; k < 3; k++) T.at(t0 + k * .22, pop(800 + k * 120, .5), .07, pan); };
const step = (t0, n, gap = .22, pan = 0, amp = .5) => { for (let k = 0; k < n; k++) T.at(t0 + k * gap, mixb(click(amp), drum(60, amp * .6, .2)), .08, pan + k * .04); };
// HIS BELL: a small bright brass bell, with a second strike a hair later (it swings back)
const ting = (amp = 1) => mixb(bell(note(98), 1.4, { partials: [[1, 1], [2.4, .5], [4.1, .25], [6.3, .1]], k: 3, amp }), bell(note(98) * 1.002, 1.0, { partials: [[1, .5], [2.4, .25]], k: 4, amp: amp * .5 }));
const tingAt = (t0, gain = .14, pan = 0) => { T.at(t0, ting(1), gain, pan); T.at(t0 + .16, ting(.5), gain * .6, pan); };
const sparkle = (t0, gain = .08, pan = 0) => T.at(t0, shimmer(1.4, [note(91), note(95), note(98), note(103)], .7, .06), gain, pan);
const whooshOut = t0 => T.at(t0, whoosh(.5, 3000, 500), .11, 0);
const whooshIn = t0 => T.at(t0, whoosh(.5, 500, 3000), .11, 0);

// ================= A · the hook =================
T.at(0, pad(B0, [62, 69, 74, 78], 1, .3, .8), .07, 0);
T.at(.15, chime(note(86), .5, 1.4), .07, 0);
T.at(RING - .45, squeak(500, 800, .1, .5), .05, 0);
tingAt(RING, .16, 0); sparkle(RING + .05, .07);
T.at(GIG, giggle(KID, .9, 5), .11, 0); hpop(GIG + .35, 0);
whooshOut(B0 - .3);

// ================= B · Mahishi's tapas =================
T.at(B0, wind(C0 - B0 + .3, 0, .8), .1, 0);
T.at(B0, pad(C0 - B0 + .2, [45, 52, 57, 60], 1, .8, .6), .07, 0);
T.at(B0 + .4, hmm(MHIF, .6), .06, .1);
T.at(BRAHMA, mixb(pop(700, .8), chime(note(81), .8, 2.2)), .12, -.4);
T.at(BRAHMA + .1, shimmer(1.6, [note(81), note(85), note(88), note(93)], .8, .07), .08, -.4);
T.at(BRAHMA + .35, huh(MHIF, .7), .08, .1);

// ================= C · the boon =================
T.at(C0, pad(D0 - C0 + .2, [45, 52, 57, 60], 1, .4, .6), .06, 0);
T.at(C0 + .2, talk(1.4, BRF, { gap: .2, br: .4 }), .08, -.4);
T.at(BUB, mixb(pop(900, .8), plink(note(86), .6)), .1, -.1);
T.at(BUB + .4, plink(note(81), .7), .07, -.2); T.at(BUB + .6, plink(note(85), .7), .07, -.1); T.at(BUB + .85, boing(.5, 260), .07, 0);
T.at(LAUGH, cackle(MHIF, 1, 9), .12, .1);
whooshOut(D0 - .3);

// ================= D · heaven =================
T.at(D0, pad(E0 - D0 + .2, [50, 57, 62, 65], 1, .4, .6), .06, 0);
for (let i = 0; i < 4; i++) { const t0 = BUFF + i * .35, pan = [-.6, .6, -.8, .8][i]; T.at(t0, pop(600 + i * 80, .8), .1, pan); T.at(t0 + .2, noise(.35, { hp: 200, lp: 1500, e: env.pluck(8), amp: .7 }), .07, pan); }
T.at(D0 + .3, cackle(MHIF, .8, 6), .08, 0);
T.at(FLEE - 1.2, mixb(pop(1100, .8), huh(260, .6)), .1, .5);
T.at(FLEE, mixb(whoosh(1.0, 400, 2600, .8), slide(.8, 300, 900, .4)), .1, .7);
whooshIn(E0 - .3);

// ================= E · the churning: Mohini =================
T.at(E0, noise(E0 + .1 - E0 + 5, { hp: 200, lp: 900, e: env.swell(1, 1), amp: .25 }), .06, 0);   // the sea
T.at(MPOP, mixb(pop(900, .9), chime(note(88), .9, 2)), .13, .4);
sparkle(MPOP + .1, .09, .4);
T.at(MPOP + .6, mixb(ooh(ASF, .6), ooh(ASF * 1.2, .5)), .09, -.5); hpop(MPOP + .8, -.5);
T.at(MPOP + 1.7, mixb(plink(note(93), .8), squeak(1200, 1800, .08, .5)), .08, .4);   // the wink
whooshOut(F0 - .3);

// ================= F · "close your eyes" =================
T.at(F0, noise(G0 - F0, { hp: 200, lp: 900, e: env.swell(1, 1), amp: .2 }), .05, 0);
T.at(F0 + .3, talk(2.0, MOHF, { gap: .17, br: .6 }), .09, .4);
T.at(SHUT, mixb(pop(1000, .8), click(.7)), .1, -.5);
T.at(SHUT + .1, mixb(hmm(ASF, .7), hmm(ASF * 1.25, .6), hmm(ASF * .85, .6)), .08, -.5);
for (let i = 0; i < 4; i++) T.at(SHUT + .6 + i * .5, squeak(300, 260, .12, .3), .04, -.5);   // squeezing
T.at(G0 - .4, plink(note(93), .8), .07, .4);

// ================= G · the devas get the amrit =================
T.at(G0, noise(H0 - G0, { hp: 200, lp: 900, e: env.swell(1, 1), amp: .2 }), .05, 0);
step(G0 + .2, 5, .2, 0, .3);
T.at(SERVE, gurgleish(1.4), .08, .3);
T.at(SERVE + .2, mixb(chime(note(93), .8, 1.6), giggle(MOHF, .6, 3)), .09, .3);
sparkle(SERVE + .25, .08, .4); sparkle(SERVE + .95, .08, .6);
T.at(PEEKA, mixb(pop(1200, .8), huh(ASF, .7)), .1, -.6);
whooshOut(H0 - .3);
function gurgleish(d) { return mixb(...[0, .25, .5, .75, 1].map(k => tone(.2, t => 500 + 300 * Math.sin(t * 50) + k * 80, { e: env.hann(), amp: .4 }))); }

// ================= H · "show me that form" =================
T.at(H0, pad(I0 - H0 + .2, [57, 64, 69, 73], 1, .5, .6), .07, 0);
T.at(H0 + .3, talk(2.3, SHVF, { gap: .2, br: .45 }), .09, -.4);
T.at(VANISH - 1.0, mixb(plink(note(93), .8), squeak(1200, 1800, .08, .5)), .08, .4);
T.at(VANISH, mixb(pop(800, 1), noise(.4, { hp: 800, lp: 6000, e: env.pluck(9), amp: .6 })), .12, .4);
T.at(VANISH + .3, huh(SHVF, .8), .1, -.4);
whooshIn(I0 - .3);

// ================= I · the garden =================
for (let t = I0; t < J0; t += .33) T.at(t, mixb(chirp(.5), squeak(2600, 3400, .07, .3)), .03, (rnd() - .5) * .8);
for (let t = I0 + .2; t < J0 - .2; t += Math.PI / 3.1) T.at(t, mixb(drum(180, .4, .15), plink(note(84), .3)), .06, .3);   // the ball bouncing
step(I0 + .4, 7, .26, -.6, .4);
T.at(SEE, mixb(pop(1000, .9), heart(.8)), .1, -.3);
T.at(SEE + .4, slide(.9, 400, 1000, .5), .07, -.3);
T.at(SEE + 1.0, giggle(MOHF, .6, 4), .08, .3);

// ================= J · the chase =================
T.at(J0, pad(K0 - J0, [62, 66, 69, 74], 1, .3, .3), .06, 0);
step(J0, 12, .2, -.2, .45);
T.at(J0 + .3, giggle(MOHF, .8, 5), .09, .4); T.at(J0 + 1.4, giggle(MOHF, .7, 4), .08, .5);
for (let t = J0; t < CATCH; t += .4) T.at(t, drum(200, .3, .12), .05, .6);
T.at(CATCH - .6, slide(.6, 300, 1400, .5), .07, 0);
T.at(CATCH, mixb(chime(note(98), 1, 2.4), shimmer(2, [note(86), note(90), note(93), note(98), note(102)], .9, .07)), .14, 0);
T.at(CATCH + .3, noise(1.4, { hp: 1500, lp: 9000, e: env.swell(.3, 1), amp: .4 }), .07, 0);

// ================= K · the birth =================
T.at(K0, pad(L0 - K0 + .2, [62, 69, 74, 78, 81], 1, 1.2, 1.0), .09, 0);
T.at(K0 + .1, shimmer(2.4, [note(86), note(93), note(98), note(105)], .7, .2), .08, 0);
T.at(OPEN, mixb(giggle(KID, 1, 5), chime(note(93), .7, 2)), .11, 0); hpop(OPEN + .4, 0);
T.at(OPEN + .2, mixb(ooh(SHVF, .6), ooh(MOHF, .5)), .07, 0);

// ================= L · the hugs =================
T.at(L0, pad(M0 - L0 + .2, [62, 69, 74, 78], 1, .5, .6), .07, 0);
T.at(L0 + .3, mixb(heart(.7), giggle(KID, .8, 4)), .09, -.3); hpop(L0 + .6, -.3);
T.at(MPOOF, mixb(pop(800, 1), noise(.4, { hp: 800, lp: 6000, e: env.pluck(9), amp: .6 }), chime(note(86), .6, 1.6)), .12, .4);
T.at(HOP, slide(.5, 500, 1200, .5), .08, 0);
T.at(HOP + .55, mixb(boing(.5, 300), giggle(KID, 1, 5)), .1, .4); hpop(HOP + .7, .4);

// ================= M · the milk =================
T.at(M0, pad(N0 - M0 + .2, [64, 71, 76, 79], 1, .5, .6), .07, 0);
step(M0, 4, .2, -.6, .3); step(M0 + .4, 4, .2, .6, .3);
for (const t0 of [M0 + 1.0, LKS + .2]) for (let k = 0; k < 4; k++) T.at(t0 + k * .17, mixb(slide(.12, 500, 300, .5), noise(.08, { hp: 600, lp: 2500, e: env.pluck(30), amp: .4 })), .07, t0 > LKS ? .3 : -.3);   // gulps
T.at(M0 + 1.75, mixb(pop(900, .7), giggle(KID, .7, 3)), .08, 0);
T.at(LKS + .95, mixb(boing(.4, 340), giggle(KID, .8, 4)), .09, 0);
for (let i = 0; i < 4; i++) T.at(ALL4 + i * .15, pop(700 + i * 150, .8), .09, -.6 + i * .4);
T.at(ALL4 + .1, chime(note(93), .7, 2), .08, 0);

// ================= N · a thousand names =================
T.at(N0, pad(O0 - N0 + .2, [62, 69, 74, 78], 1, .4, .5), .06, 0);
T.at(N0 + .4, talk(2.6, BRF, { gap: .21, br: .4 }), .07, -.5);
for (let i = 0; i < 5; i++) T.at(N0 + .8 + i * .45, mixb(pop(800 + i * 110, .9), plink(note(81 + i * 2), .5)), .1, (i % 2 ? .4 : -.2));

// ================= O · the bell =================
whooshIn(O0 - .3);
T.at(O0, wind(P0 - O0, 1, .8), .05, 0);
T.at(O0, pad(P0 - O0 + .2, [57, 64, 69, 76], 1, .6, .6), .07, 0);
T.at(TIE - .5, mixb(click(.6), squeak(700, 900, .1, .4)), .06, 0);
tingAt(TIE, .18, .2); sparkle(TIE + .05, .08, .2);
T.at(TIE + .5, ooh(KID, .7), .08, .2);
tingAt(TIE + 1.4, .15, .2);
T.at(TIE + 1.8, giggle(KID, 1, 5), .1, .2); hpop(TIE + 2.0, .2);
T.at(P0 - .3, whoosh(.5, 2600, 400), .1, 0);

// ================= P · down to the Pampa =================
for (let t = P0; t < Q0; t += .35) T.at(t, tone(.06, 4200 + 300 * rnd(), { e: env.hann(), amp: .4 }), .03, (rnd() - .5));   // crickets
T.at(P0, noise(Q0 - P0, { hp: 300, lp: 1600, e: env.swell(1, 1), amp: .35 }), .06, 0);   // the river
T.at(P0 + .2, slide(LAND - P0 - .2, 1400, 500, .3), .05, 0);
T.at(LAND, mixb(chime(note(86), .8, 2), thud(.3)), .1, 0); sparkle(LAND + .05, .07);
tingAt(LAND + .5, .15, 0);
T.at(LAND + .9, giggle(KID, .8, 4), .08, 0);
whooshIn(Q0 - .3);

// ================= Q · the ask =================
T.at(Q0, pad(CARD - Q0, [62, 69, 74, 78], 1, .4, .8), .07, 0);
tingAt(Q0 + .9, .15, 0); sparkle(Q0 + .95, .06);
T.at(Q0 + 1.7, giggle(KID, .8, 4), .08, -.2);
tingAt(Q0 + 2.6, .15, 0);
T.at(Q0 + 2.9, mixb(boing(.4, 320), giggle(KID, .9, 5)), .09, 0);

// ================= the card =================
T.at(CARD, pad(END - CARD, [62, 69, 74, 78, 81], 1, .3, .6), .08, 0);
T.at(CARD + .1, chime(note(86), .8, 2), .09, 0);
for (let i = 0; i < 7; i++) T.at(CARD + .1 + i * .1, plink(note(81 + i * 2), .5), .05, -.6 + i * .2);
T.at(CARD + 1.6, pop(900, .8), .08, 0);

T.write('assets/ayy1_sfx.wav');
