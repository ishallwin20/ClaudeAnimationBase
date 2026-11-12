// hanu3_sfx.mjs: the sound for "HANUMAN met RAM in DISGUISE" (src/scenes/hanu3.js, ad 88, Hanuman Part 3, no voice)
// → assets/hanu3_sfx.wav. Times are the scene's constants (keep them in sync). Retro synth cartoon foley as in Parts
// 1–2: poofs and giggles for the disguise, a scared buzzy Sugriva and his boing-hops, the monk's soft chatter, a
// silence with one cricket, a big shimmer for "his words", a whoosh of a leap. Music only as mild beds: a plucked
// vamp at the lake, a warm pad over the dusk flight, a music box under the ask.
import { track, tone, noise, bell, mixb, env, whoosh, plink, squeak, click, thud, shimmer, slide, chime, drum, om, wind, note, seed, rnd, clamp, SR } from './sfx.mjs';

const PEEK = .9, POOF1 = 1.5, POOF2 = 2.7, SHH = 3.3;
const B0 = 4.6, SEE = 6.2, DUCK = 7.2, C0 = 9.0, CATCH = 11.6, D0 = 13.4, E0 = 17.6, SPIN = 18.3, POOF = 19.0, CHECK = 20.2, PHEW = 21.1;
const F0 = 22.2, BOWS = 23.9, G1 = 26.4, G2 = 30.6, G3 = 34.8, WHY = 36.0, H1 = 39.8, H2 = 44.2;
const I1 = 48.2, I2 = 53.0, I3 = 57.4, J0 = 62.2, WORDS = 64.6;
const K0 = 67.2, KPOOF = 67.8, LIFT = 69.2, LEAP = 71.2, L0 = 72.4, ASK0 = 77.4, NEXT0 = 81.8, CARD = 85.2, END = 89.2;
const HOPD = .52;

const T = track(END);
seed(88);
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
const HANU = 230, SUG = 260, RAMF = 150, LAKF = 175;
const giggle = (f, amp = 1, n = 4) => voice(Array.from({ length: n }, (_, i) => [i * .11, .08, 1.25 - i * .04, .7]), f, { amp, fall: .2 });
const huh = (f, amp = 1) => voice([[0, .32, 1, .6]], f, { amp, rise: .9, fall: 0 });
const ooh = (f, amp = 1) => voice([[0, .3, 1.1, .5]], f, { amp, rise: .3, fall: 0 });
const aww = (f, amp = 1) => voice([[0, .6, 1.1, .3]], f, { amp, fall: .45 });
const eek = (f, amp = 1) => voice([[0, .35, 1.6, .9]], f, { amp, rise: .5, shake: 1 });
const pop = (f = 900, amp = 1) => mixb(squeak(f * .6, f * 1.6, .07, amp), plink(f * 1.5, amp * .5));
const boing = (amp = 1, f = 220) => tone(.35, t => f * (1 + 2.2 * t) * (1 + .18 * Math.sin(t * 2 * Math.PI * 18) * Math.exp(-t * 6)), { type: 'tri', e: env.pluck(6), amp });
const pad = (dur, ms, amp = 1, a = 1.2, r = 1.4) => mixb(...ms.map((m, i) => tone(dur, t => note(m) * (1 + .003 * Math.sin(t * 2 + i)), { type: 'tri', e: env.swell(a, r), amp: amp / ms.length })));
const musicBox = f => bell(f, 1.6, { partials: [[1, 1], [3.0, .25], [5.1, .08]], k: 2.6 });
const bird = (f, amp = 1) => mixb(squeak(f, f * 1.4, .07, amp), squeak(f * 1.3, f * 1.1, .06, amp * .7));
const poofS = (amp = 1) => mixb(noise(.45, { hp: 500, lp: 4000, e: env.pluck(7), amp }), slide(.35, 400, 1400, amp * .6), plink(1800, amp * .4));
const cricket = amp => mixb(...[0, .09, .18].map(d => { const b = tone(.06, 4200, { e: env.pluck(30), amp }); const o = new Float32Array(Math.round((.06 + d) * SR) + b.length); o.set(b, Math.round(d * SR)); return o; }));
const ambient = (a, b) => { for (let t = a + .3; t < b - .3; t += 1.2 + rnd() * 1.3) T.at(t, bird(2300 + rnd() * 1300, .55), .035, rnd() * 1.6 - .8); };

// ================= A · the hook =================
T.at(.05, pad(B0, [57, 64, 69, 73], 1, .3, .8), .06, 0);
T.at(.2, om(1.2, 120, .7), .05, 0);
T.at(PEEK, mixb(click(.6), plink(note(88), .7)), .14, 0); T.at(PEEK + .15, giggle(HANU, .7, 2), .08, 0);
T.at(POOF1, poofS(1), .3, 0); T.at(POOF1 + .1, mixb(boing(.8, 300), shimmer(1, [note(81), note(85), note(88), note(93)], .7, .07)), .2, 0);
T.at(POOF1 + .2, giggle(HANU, 1, 6), .18, 0); T.at(POOF1 + .3, voice([[0, .2, 1.3, .6], [.24, .3, 1.5, .7]], HANU), .12, 0);   // "it's me!"
T.at(POOF2, poofS(.9), .26, 0); T.at(POOF2 + .1, ooh(HANU, 1), .12, 0);
T.at(SHH, voice([[0, .7, 1, .15]], HANU, { fall: 0 }), .08, 0);                                                // "shhh"
T.at(SHH + .8, mixb(click(.5), plink(note(93), .6)), .1, 0);
T.at(B0 - .3, whoosh(.6, 400, 3000), .18, 0);

// ================= B · Rishyamuka =================
T.at(B0, wind(C0 - B0 + 4.4, .8, 1), .04, 0); ambient(B0, D0);
T.at(B0 + .5, voice([[0, .4, 1, .3]], SUG, { fall: .1, shake: .5 }), .07, -.1);                                 // nervous hum
T.at(SEE, mixb(drum(56, 1, .6), tone(.4, t => 900 - 500 * t, { type: 'square', e: env.pluck(6), amp: .4 })), .3, 0);
T.at(SEE + .05, eek(SUG, 1), .2, -.1); T.at(SEE + .1, mixb(pop(900, .9), click(.7)), .14, -.1);
for (let k = 0; k < 6; k++) T.at(SEE + .4 + k * .13, tone(.08, 1300 + 200 * (k % 2), { type: 'square', e: env.pluck(30), amp: .25 }), .05, -.1);   // teeth chatter
T.at(DUCK, mixb(slide(.25, 900, 300, .8), thud(.6)), .16, -.1);
T.at(DUCK + .8, voice([[0, .6, 1.05, .3]], SUG, { fall: .4, shake: 1 }), .1, -.1);                              // a whimper
T.at(C0 - .2, whoosh(.3, 600, 3000), .1, 0);

// ================= C · panic: hops; Hanuman catches him =================
T.at(C0, talk(1.2, SUG * 1.1, { gap: .12, br: .9, fall: .2 }), .16, 0);                                         // "Vali sent them!"
for (let k = 1; k <= 4; k++) { T.at(C0 + (k - 1) * HOPD, boing(.9, 200 + k * 30), .2, k % 2 ? -.4 : .3); T.at(C0 + k * HOPD - .03, mixb(thud(.7), noise(.2, { lp: 1800, e: env.pluck(14), amp: .5 })), .2, k % 2 ? -.4 : .3); }
T.at(C0 + 1.5, eek(SUG, .8), .12, 0);
T.at(C0 + .9, mixb(click(.5), plink(note(84), .5)), .08, .5);                                                   // Hanuman's sweat drop
T.at(CATCH, mixb(thud(.8), boing(.6, 160)), .22, .2);
T.at(CATCH + .3, talk(1.6, HANU, { gap: .17, br: .4 }), .12, .4);                                               // "Vali isn't here…"
T.at(CATCH + 1.2, voice([[0, .7, 1.05, .3]], SUG, { fall: .35, shake: 1 }), .1, .1);

// ================= D · the order =================
T.at(D0, pad(E0 - D0, [57, 64, 69, 72], 1, .6, .8), .05, 0);
T.at(D0 + .3, talk(2.5, SUG, { gap: .15, br: .6 }), .13, -.3);
T.at(D0 + .7, mixb(pop(800, .8), plink(note(88), .6)), .12, 0); T.at(D0 + 1.3, mixb(pop(1000, .7), huh(SUG, .8)), .1, 0);
T.at(D0 + 2.9, mixb(voice([[0, .18, 1.2, .5], [.22, .26, 1.35, .6]], HANU), chime(note(88), .8, 1.2)), .14, .4);   // "ji!"
T.at(E0 - .3, whoosh(.6, 400, 3000), .18, 0);

// ================= E · the disguise =================
T.at(E0 + .25, mixb(pop(900, .9), chime(note(93), .9, 1.4)), .16, 0);                                          // the bulb
T.at(E0 + .4, giggle(HANU, .8, 3), .1, 0);
T.at(SPIN, mixb(slide(POOF - SPIN, 300, 1600, .8), shimmer(POOF - SPIN + .4, [note(81), note(85), note(88), note(93), note(97)], .9, .06)), .2, 0);
T.at(POOF, mixb(poofS(1.2), drum(60, .8, .5)), .36, 0); T.at(POOF + .05, mixb(boing(.9, 260), plink(note(96), .8)), .22, 0);
T.at(POOF + .3, ooh(HANU * 1.05, 1), .13, 0);
T.at(CHECK, mixb(click(.6), huh(HANU, 1)), .14, .2); for (let k = 0; k < 3; k++) T.at(CHECK + .2 + k * .12, tone(.07, 700 + k * 40, { type: 'square', e: env.pluck(25), amp: .3 }), .06, .3);   // pat-pat: no tail
T.at(PHEW, mixb(chime(note(88), 1, 1.6), shimmer(1, [note(93), note(97), note(100)], .6, .08)), .2, 0); T.at(PHEW + .1, giggle(HANU, 1, 6), .17, 0);
T.at(F0 - .3, whoosh(.6, 400, 3000), .18, 0);

// ================= F–I · the lake =================
T.at(F0, wind(K0 - F0, .5, .8), .03, 0); ambient(F0, K0);
for (let t = F0 + .2, k = 0; t < G3 - .2; t += .5, k++) T.at(t, plink(note(57 + [0, 7, 12, 7, 4, 7][k % 6]), .5), .035, k % 2 ? .3 : -.3);   // a soft plucked vamp
for (let k = 0; k < 6; k++) T.at(F0 + .3 + k * .26, mixb(click(.4), noise(.06, { hp: 1500, lp: 5000, e: env.pluck(30), amp: .3 })), .05, .5 - k * .05);   // footsteps
T.at(BOWS, mixb(chime(note(81), .8, 1.6), plink(note(88), .5)), .14, .3);
T.at(BOWS + .3, voice([[0, .3, 1.1, .3]], HANU, { fall: .2 }), .08, .3);
// G1 kings or gods
T.at(G1 + .2, talk(3.4, HANU, { gap: .16, br: .45 }), .12, .4);
T.at(G1 + .5, mixb(pop(900, .7), plink(note(91), .6)), .12, -.3); T.at(G1 + .8, mixb(pop(1000, .6), plink(note(93), .5)), .1, -.4);
T.at(G1 + 1.9, mixb(shimmer(1.2, [note(84), note(88), note(91), note(96)], .8, .07), chime(note(96), .7, 1.6)), .16, -.3);
T.at(G1 + 2.95, mixb(pop(1100, .8), huh(HANU, .7)), .12, .4);
// G2 arms and eyes
T.at(G2 + .2, talk(3.3, HANU, { gap: .14, br: .55 }), .12, .4);
T.at(G2 + .5, mixb(pop(800, .8), voice([[0, .4, 1, .4]], 520, { rise: .6 })), .13, 0);                       // a tiny trumpet
T.at(G2 + 2.0, mixb(pop(900, .7), shimmer(.8, [note(88), note(93)], .5, .08)), .12, 0);
T.at(G2 + 1.3, mixb(click(.5), ooh(LAKF, .7)), .1, -.6);
T.at(G2 + 2.4, giggle(HANU, .9, 5), .14, .4); for (let k = 0; k < 3; k++) T.at(G2 + 2.5 + k * .22, pop(800 + k * 120, .6), .1, .4);
// G3 silence
T.at(G3 + .3, mixb(click(.5), plink(note(84), .4)), .08, -.3);
for (let k = 0; k < 2; k++) T.at(G3 + .4 + k * .5, cricket(.6), .06, .6);                                      // only a cricket
T.at(G3 + .6, whoosh(.9, 1200, 600), .04, .5);                                                                 // the leaf
T.at(WHY + .1, talk(3.0, HANU * 1.05, { gap: .15, br: .5, fall: .15 }), .13, .4);
T.at(WHY + 2.4, voice([[0, .5, 1.1, .3]], HANU, { fall: .4, shake: .8 }), .09, .4);
// H1, H2: I am Hanuman; Sugriva wants your friendship
T.at(H1 + .2, talk(3.3, HANU, { gap: .16, br: .4 }), .12, .4);
T.at(H1 + .6, mixb(pop(900, .9), boing(.6, 300)), .14, 0); T.at(H1 + .75, mixb(drum(60, .7, .4), huh(LAKF, 1), huh(RAMF, .8)), .2, -.5);
T.at(H1 + 1.1, giggle(HANU * 1.3, .7, 3), .08, 0);
T.at(H2 + .1, pop(850, .8), .12, 0); T.at(H2 + .2, talk(3.0, HANU, { gap: .17, br: .4 }), .12, .4);
T.at(H2 + .8, mixb(pop(1100, .7), chime(note(93), .7, 1.2)), .12, .1);
T.at(H2 + 1.6, giggle(RAMF, .7, 3), .08, -.4);
T.at(I1 - .3, whoosh(.6, 400, 3000), .14, 0);
// I1–I3: Ram's praise
T.at(I1, pad(J0 - I1, [55, 62, 67, 71], 1, .8, 1), .06, 0);
T.at(I1 + .5, talk(3.7, RAMF, { gap: .2, br: .3 }), .11, -.4);
for (let i = 0; i < 3; i++) T.at(I1 + 1.5 + i * .45, mixb(pop(700 + i * 150, .8), chime(note(81 + [0, 4, 7][i]), .9, 1.4)), .16, -.2 + i * .2);
T.at(I1 + 1.6, ooh(LAKF, .9), .1, -.6);
T.at(I2 + .2, talk(3.6, RAMF, { gap: .2, br: .3 }), .11, -.4);
for (let k = 0; k < 6; k++) T.at(I2 + .6 + k * .4, musicBox(note(81 + [0, 4, 7, 12, 7, 4][k])), .06, .4);
T.at(I2 + 1.0, voice([[0, .9, 1.2, .3]], HANU, { rise: .2, shake: .6 }), .1, .4);                               // an overwhelmed "awww"
T.at(I2 + 2.2, mixb(pop(900, .6), pop(1100, .5)), .1, .4);
T.at(I3 + .2, talk(3.4, RAMF, { gap: .2, br: .3 }), .11, -.4);
T.at(I3 + .4, mixb(tone(.6, t => 200 + 500 * t, { type: 'square', e: env.swell(.1, .3), amp: .3 }), squeak(400, 1200, .5, .6)), .1, .4);   // steam
T.at(I3 + .6, pop(800, .7), .1, -.1);
T.at(I3 + 1.6, mixb(slide(.9, 700, 200, .7), boing(.6, 140)), .14, -.1);                                       // the sword goes soft
T.at(I3 + 2.5, mixb(pop(1000, .8), chime(note(93), .8, 1.2)), .12, -.1);
T.at(I3 + 1.2, giggle(HANU, .9, 7), .14, .4);
T.at(J0 - .3, whoosh(.6, 400, 3000), .14, 0);

// ================= J · the twist =================
T.at(J0 + .6, mixb(pop(800, .8), drum(56, .7, .4)), .14, -.4);
T.at(J0 + 1.5, slide(.7, 500, 220, .6), .08, -.4);
T.at(WORDS - .5, tone(.5, t => 200 + 1200 * t * t, { e: env.swell(.4, .02), amp: .4 }), .08, 0);
T.at(WORDS, mixb(drum(58, 1, .8), shimmer(2, [note(81), note(85), note(88), note(93), note(97)], 1.2, .06)), .4, 0);
T.at(WORDS + .05, mixb(...[57, 64, 69, 73, 76, 81].map(m => tone(1.6, note(m), { type: 'tri', e: env.swell(.02, .9), amp: .17 }))), .3, 0);
for (let k = 0; k < 8; k++) T.at(WORDS + .3 + k * .14, musicBox(note(81 + [0, 2, 4, 7, 9, 12, 16, 19][k])), .08, -.5 + k * .14);
T.at(WORDS + .2, giggle(HANU, 1, 6), .15, 0);
T.at(K0 - .3, whoosh(.6, 400, 3000), .14, 0);

// ================= K · himself again; up on his back; the leap =================
T.at(KPOOF, mixb(poofS(1.2), drum(60, .8, .5)), .36, .3); T.at(KPOOF + .1, mixb(boing(.9, 240), shimmer(1, [note(88), note(93), note(97)], .6, .08)), .2, .3);
T.at(KPOOF + .1, mixb(huh(LAKF, 1), huh(RAMF, .8)), .14, -.5); T.at(KPOOF + .3, giggle(HANU, 1, 6), .16, .3);
for (let k = 0; k < 4; k++) T.at(KPOOF + .6 + k * .22, mixb(click(.5), plink(note(76 + k * 2), .4)), .07, .2 - k * .1);   // he trots over
T.at(LIFT, mixb(whoosh(.45, 500, 2400), slide(.45, 300, 900, .6)), .18, -.3); T.at(LIFT + .05, eek(LAKF, .9), .13, -.2);
T.at(LIFT + .45, mixb(thud(.8), boing(.8, 200)), .22, 0); T.at(LIFT + .6, mixb(giggle(LAKF, .8, 4), giggle(RAMF, .6, 3)), .12, 0);
T.at(LEAP - .35, tone(.35, t => 150 + 300 * t, { type: 'tri', e: env.swell(.3, .02), amp: .5 }), .1, 0);
T.at(LEAP, mixb(drum(52, 1, .7), whoosh(1.1, 300, 4000), slide(1.1, 300, 1700, .8)), .34, .2);
T.at(LEAP + .1, voice([[0, .9, 1.3, .6]], HANU, { rise: .4, shake: .4 }), .12, .2);                             // "wheee"

// ================= L · the dusk flight =================
T.at(L0, pad(ASK0 - L0 + .4, [53, 60, 65, 69, 72], 1, 1, 1.2), .08, 0);
T.at(L0, wind(ASK0 - L0, 1.4, 1.6), .06, 0);
for (let k = 0; k < 8; k++) T.at(L0 + .5 + k * .55, harpish(note(69 + [0, 4, 7, 12, 11, 7, 4, 7][k])), .07, -.4 + k * .1);
function harpish(f) { return mixb(tone(1.2, f, { type: 'tri', e: env.pluck(3.5), amp: 1 }), tone(.6, f * 2, { e: env.pluck(8), amp: .25 })); }
T.at(L0 + 2.6, mixb(pop(900, .6), pop(1100, .5)), .08, .4);
T.at(L0 + 1.6, aww(RAMF, .7), .06, -.3);
T.at(ASK0 - .3, whoosh(.6, 400, 3000), .14, 0);

// ================= ask, next, card =================
{
  const TUNE = [0, 4, 7, 4, 9, 7, 4, 2, 0, 2, 4, 7, 4, 2, 0, -3];
  let i = 0;
  for (let t = ASK0 + .2; t < NEXT0 - .2; t += .34) { const m = TUNE[i++ % TUNE.length]; T.at(t, musicBox(note(81 + m)), .08, i % 2 ? -.25 : .25); }
  T.at(ASK0, pad(NEXT0 - ASK0, [57, 64, 69, 73], 1, .6, .8), .06, 0);
}
T.at(ASK0 + .8, giggle(HANU, 1, 5), .14, 0); T.at(ASK0 + 1.2, mixb(pop(900, .7), pop(1100, .6)), .1, 0);
T.at(NEXT0, mixb(whoosh(.5, 3000, 400), slide(.6, 600, 200, .5)), .14, 0);
T.at(NEXT0, pad(CARD - NEXT0, [50, 57, 60, 65], 1, .8, .8), .07, 0);
for (let k = 0; k < 3; k++) T.at(NEXT0 + .3 + k * .9, cricket(.5), .05, .6);
T.at(NEXT0 + .6, mixb(pop(500, .7), noise(.8, { lp: 900, e: env.swell(.1, .6), amp: .5 })), .1, .4);           // the rain cloud
T.at(NEXT0 + 1.0, aww(HANU, .8), .1, 0);
T.at(CARD, whoosh(.4, 3000, 600), .14, 0);
[.3, .45, .6].forEach((d, i) => T.at(CARD + d, pop(600 + i * 100, .8), .14, -.4 + i * .4));
T.at(CARD + 1.0, chime(note(81), 1, 1.6), .14, 0); T.at(CARD + 1.6, mixb(pop(900, .8), plink(note(88), .8)), .14, 0);
T.at(CARD + 2.2, shimmer(1.2, [note(81), note(85), note(88), note(93)], .7, .09), .12, 0);

T.write('assets/hanu3_sfx.wav');
console.log('assets/hanu3_sfx.wav', END + ' s');
