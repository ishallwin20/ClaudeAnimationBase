// hanu2_sfx.mjs: the sound for "The day baby HANUMAN got 8 SUPERPOWERS" (src/scenes/hanu2.js, ad 86, Hanuman Part 2,
// no voice) → assets/hanu2_sfx.wav. Times are the scene's constants (keep them in sync). Retro synth cartoon foley
// carries it: eight chimes for the eight lights, the leap, thunder and the vajra's zap, Vayu's fury, then the wind
// STOPS (four seconds of almost nothing: one slow heartbeat), Brahma's om, the yawn, the wind rushing back, and for
// each boon the same little fanfare one step higher, the light's slide, a chime up the scale and a gag of its own.
// Music only as mild beds: a plucked vamp under the boons, a music box under the ask. Nothing loud.
import { track, tone, noise, bell, mixb, env, whoosh, plink, squeak, click, thud, shimmer, slide, chime, drum, om, wind, thunder, note, seed, rnd, clamp, SR } from './sfx.mjs';

const LOOK = 1.2, FLEX = 2.4, L0 = 4.4, J0 = 8.0, THROW = 9.2, HIT = 9.7;
const V0 = 11.6, VIN = 12.0, ANGRY = 13.2, TOCAVE = 14.5, S0 = 15.8;
const F0 = 20.2, BRAHMA = 20.5, TOUCH = 23.0, WAKE = 23.7, EYES = 24.4, BREATH = 25.0, G0 = 26.2, SLOTS = 28.0;
const BN = [30.2, 38.0, 42.8, 46.8, 50.8, 54.6, 58.4, 62.6], NAME0 = 34.2, ALL0 = 66.4;
const GIVE = .9, LAND = 1.7, GAG = 2.2;
const K0 = 70.4, CRACK = 71.6, K2 = 74.6, CURSE = 75.6, DRAIN = 76.4, ASK0 = 79.4, NEXT0 = 84.0, CARD = 87.6, END = 91.6;

const T = track(END);
seed(86);
const PENTA = [0, 2, 4, 7, 9];
const pent = (base, i) => note(base + 12 * Math.floor(i / 5) + PENTA[i % 5]);
// a buzzy cartoon voice: syllables [start, dur, pitch ×, brightness 0..1] (as in ads 59, 60 and 85)
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
const BABY = 330, VAYU = 210, ELDER = 125, GODF = [150, 190, 170, 105, 140, 120, 125, 135];
const giggle = (f = BABY, amp = 1, n = 4) => voice(Array.from({ length: n }, (_, i) => [i * .11, .08, 1.25 - i * .04, .7]), f, { amp, fall: .2 });
const huh = (f, amp = 1) => voice([[0, .32, 1, .6]], f, { amp, rise: .9, fall: 0 });
const ooh = (f, amp = 1) => voice([[0, .3, 1.1, .5]], f, { amp, rise: .3, fall: 0 });
const aww = (f, amp = 1) => voice([[0, .6, 1.1, .3]], f, { amp, fall: .45 });
const pop = (f = 900, amp = 1) => mixb(squeak(f * .6, f * 1.6, .07, amp), plink(f * 1.5, amp * .5));
const boing = (amp = 1, f = 220) => tone(.35, t => f * (1 + 2.2 * t) * (1 + .18 * Math.sin(t * 2 * Math.PI * 18) * Math.exp(-t * 6)), { type: 'tri', e: env.pluck(6), amp });
const lp = (b, fc) => { let l = 0; const a = 1 - Math.exp(-2 * Math.PI * fc / SR); for (let i = 0; i < b.length; i++) { l += a * (b[i] - l); b[i] = l; } return b; };
const pad = (dur, ms, amp = 1, a = 1.2, r = 1.4) => mixb(...ms.map((m, i) => tone(dur, t => note(m) * (1 + .003 * Math.sin(t * 2 + i)), { type: 'tri', e: env.swell(a, r), amp: amp / ms.length })));
const musicBox = f => bell(f, 1.6, { partials: [[1, 1], [3.0, .25], [5.1, .08]], k: 2.6 });
const harp = (f, amp = 1) => mixb(tone(1.2, f, { type: 'tri', e: env.pluck(3.5), amp }), tone(.6, f * 2, { e: env.pluck(8), amp: amp * .25 }));
const bird = (f, amp = 1) => mixb(squeak(f, f * 1.4, .07, amp), squeak(f * 1.3, f * 1.1, .06, amp * .7));
const zap = amp => mixb(tone(.5, t => 900 * Math.exp(-t * 5) + 120, { type: 'saw', e: env.pluck(5), fm: t => .3 * Math.sin(t * 2 * Math.PI * 40), amp }), noise(.25, { hp: 1500, lp: 7000, e: env.pluck(14), amp: amp * .5 }));
const crash = amp => mixb(noise(.5, { hp: 900, lp: 6000, e: env.pluck(9), amp }), thud(amp * .8), plink(1900, amp * .5), plink(2600, amp * .4));
const splash = amp => mixb(noise(.9, { hp: 700, lp: 5000, e: env.swell(.15, .6), amp }), whoosh(.8, 500, 2400));
// the boon stamp: a drum and a three-note call, a step higher for each god, with a shimmer
const stamp = step => {
  const r = 57 + PENTA[step % 5] + 12 * Math.floor(step / 5), o = new Float32Array(Math.round(2 * SR));
  const add = (b, s0, g = 1) => { const s = Math.round(s0 * SR); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j] * g; };
  add(drum(62, 1, .6), 0, .8); add(thud(.7), .02, .4);
  [[0, r], [.12, r + 4], [.24, r + 7]].forEach(([s, m], i) => add(lp(tone(i === 2 ? .6 : .13, note(m), { type: 'saw', e: env.swell(.01, i === 2 ? .35 : .05), amp: .5 }), 2400), s));
  add(shimmer(.7, [note(r + 24), note(r + 28), note(r + 31)], .5, .07), .28, .45);
  return o;
};

// ================= A · the hook: eight lights =================
T.at(.1, pad(L0, [57, 64, 69, 73], 1, .4, .8), .06, 0);
for (let i = 0; i < 8; i++) T.at(.15 + i * .13, chime(pent(76, i), .8, 1.2), .1, -.7 + i * .2);
T.at(.3, voice([[0, .14, 1.2, .6], [.17, .14, 1.3, .6], [.34, .22, 1.45, .7]], BABY), .1, 0);
T.at(LOOK, mixb(pop(800, .9), ooh(BABY, 1)), .16, 0);
for (let k = 0; k < 3; k++) T.at(LOOK + .3 + k * .3, whoosh(.25, 900, 2400), .06, k % 2 ? .5 : -.5);
T.at(FLEX, mixb(drum(60, .9, .5), shimmer(1.2, [note(81), note(85), note(88), note(93)], .8, .07), boing(.7, 300)), .26, 0);
T.at(FLEX + .15, giggle(BABY, 1, 6), .17, 0);
T.at(L0 - .3, whoosh(.6, 400, 3000), .2, 0);

// ================= B · the leap; the vajra =================
T.at(L0, mixb(slide(2.6, 300, 1500, .8), whoosh(2.8, 500, 3500)), .13, -.2);
T.at(L0 + .2, voice([[0, 1.1, 1.3, .6]], BABY, { rise: .4, shake: .5 }), .12, -.2);                         // "wheee"
T.at(L0 + 1.6, mixb(pop(700, .8), huh(260, 1)), .14, .5);                                                    // the sun notices
T.at(L0 + 2.2, voice([[0, .5, 1.5, .8]], BABY, { fall: .1 }), .13, 0);                                       // "aam!"
T.at(J0, thunder(3, .5), .2, -.3); T.at(J0, wind(HIT - J0 + .4, 0, 1.5), .08, 0);
T.at(J0 + .2, tone(HIT - J0 - .2, t => 70 + 10 * t, { type: 'saw', e: env.swell(.3, .1), amp: .5 }), .07, 0);
T.at(J0 + .5, voice([[0, .4, 1, .5]], 95, { rise: .3 }), .1, .5);                                            // Airavata
T.at(THROW - .7, squeak(300, 700, .5, .7), .1, .5);
T.at(THROW, whoosh(.5, 800, 5000), .26, .3);
T.at(HIT, mixb(zap(1), drum(48, 1, .9), thud(1)), .5, 0); T.at(HIT + .03, thunder(1.6, .2), .22, 0);
T.at(HIT + .12, voice([[0, .25, 1.4, .7]], BABY, { fall: .3 }), .16, -.3);
T.at(HIT + .3, slide(1.2, 1700, 280, 1), .15, -.4);                                                          // he falls
T.at(HIT + .6, huh(150, 1), .12, .5);                                                                        // Indra: "oh."
T.at(V0 - .15, mixb(thud(1), noise(.4, { lp: 1500, hp: 150, e: env.pluck(8), amp: .8 })), .34, 0);

// ================= C · Vayu =================
T.at(V0, wind(S0 - V0, 1.3, 1.5), .06, 0);
for (let t = V0 + .5; t < TOCAVE; t += 1.1 + rnd()) T.at(t, bird(2400 + rnd() * 1200, .6), .04, rnd() * 1.6 - .8);
T.at(VIN, whoosh(.6, 3000, 600), .22, -.5);
T.at(VIN + .6, mixb(pop(600, .8), huh(VAYU, 1)), .18, -.3);
T.at(VIN + .9, voice([[0, .5, 1.05, .3]], VAYU, { fall: .4, shake: 1 }), .13, -.3);                          // a sob
T.at(ANGRY, mixb(drum(52, 1, .7), tone(.5, t => 130 - 30 * t, { type: 'square', e: env.swell(.01, .2), amp: .5 })), .34, 0);
T.at(ANGRY + .08, talk(1.1, VAYU * .8, { gap: .14, amp: 1, br: .9, fall: .25 }), .17, -.2);
T.at(TOCAVE, mixb(whoosh(1.2, 2600, 300), slide(1.2, 700, 200, .6)), .24, .4);
T.at(S0 - .5, tone(.5, t => 400 - 600 * t, { e: env.swell(.02, .3), amp: .4 }), .08, 0);                     // the air goes out

// ================= D · the wind stops: almost silence =================
T.at(S0 + .1, tone(F0 - S0 - .3, 2100, { e: env.swell(1.5, 1), amp: .3 }), .012, 0);
[.5, 1.5, 2.7, 3.8].forEach((d, i) => { T.at(S0 + d, drum(46, .8 - i * .1, .3), .2 - i * .03, 0); T.at(S0 + d + .16, drum(44, .5, .25), .13 - i * .02, 0); });   // one slow heartbeat
T.at(S0 + 1.2, squeak(900, 700, .12, .5), .07, .6);                                                          // the bird
T.at(S0 + 2.2, voice([[0, .3, 1, .2]], 150, { fall: .2, shake: 1 }), .06, -.4);                              // a strangled "mmf"
T.at(F0 - .3, whoosh(.6, 300, 1600), .12, 0);

// ================= F · Brahma; the touch; he wakes; the wind returns =================
T.at(F0 + .1, pad(G0 - F0, [50, 57, 62, 66], 1, 1.2, 1), .07, 0);
T.at(BRAHMA, om(TOUCH - BRAHMA, 98, 1), .1, .3);
T.at(BRAHMA, mixb(shimmer(1.6, [note(74), note(78), note(81), note(86), note(90)], .9, .07), chime(note(74), 1, 2.4)), .2, .4);
T.at(BRAHMA + .6, voice([[0, .4, 1, .3]], VAYU, { fall: .3, shake: 1 }), .09, -.5);                          // Vayu sniffs
T.at(TOUCH - .2, slide(.45, 900, 1500, .8), .12, .2);
T.at(TOUCH + .25, mixb(chime(note(86), 1, 2), plink(note(93), 1)), .22, -.2);
T.at(WAKE, voice([[0, .65, 1.25, .35]], BABY, { fall: .45 }), .17, -.3);                                      // the yawn
T.at(WAKE, shimmer(1.2, [note(81), note(86), note(90)], .7, .08), .12, -.3);
T.at(EYES, mixb(pop(1000, .9), plink(note(93), .9), ooh(BABY, 1)), .2, -.3);
T.at(EYES + .2, voice([[0, .5, 1.2, .5]], VAYU, { rise: .4 }), .13, -.5); T.at(EYES + .6, giggle(BABY, 1, 6), .17, -.3);
T.at(BREATH, mixb(whoosh(1.3, 300, 4500), wind(1.4, 0, 2)), .34, 0);                                          // the world breathes again
for (let k = 0; k < 4; k++) T.at(BREATH + .4 + k * .22, bird(2400 + k * 300, .7), .07, -.6 + k * .4);
T.at(G0 - .25, whoosh(.5, 400, 3000), .14, 0);

// ================= G · Brahma's ask; the slots =================
T.at(G0, pad(BN[0] - G0, [57, 64, 69, 73], 1, .6, .8), .07, 0);
T.at(G0 + .3, talk(3.0, ELDER, { gap: .2, amp: .9, br: .3 }), .12, .2);
for (let i = 0; i < 8; i++) T.at(SLOTS + .1 * i, mixb(click(.6), plink(pent(69, i), .6)), .09, -.7 + i * .2);
T.at(BN[0] - .3, whoosh(.6, 400, 3000), .18, 0);

// ================= the eight boons =================
// a mild plucked vamp underneath, a step up every boon
for (let i = 0; i < 8; i++) {
  const a = BN[i], b = i < 7 ? (i === 0 ? ALL0 * 0 + BN[1] : BN[i + 1]) : ALL0, root = 57 + PENTA[i % 5];
  for (let k = 0; a + .3 + k * .4 < b - .2; k++) T.at(a + .3 + k * .4, plink(note(root + [0, 7, 12, 7][k % 4]), .6), .045, k % 2 ? .3 : -.3);
}
BN.forEach((b, i) => {
  T.at(b - .1, whoosh(.25, 500, 3500), .12, .3);
  T.at(b, stamp(i), .42, 0); T.at(b + .05, pop(600, .8), .12, .4);
  T.at(b + .4, talk(i === 1 || i === 6 ? 2.0 : 1.4, GODF[i], { gap: .19, amp: .9, br: .35 }), .11, .4);
  T.at(b + GIVE - .4, squeak(500, 900, .3, .6), .07, .4);
  T.at(b + GIVE, mixb(slide(LAND - GIVE, 1500, 800, .8), whoosh(LAND - GIVE, 3000, 1200)), .13, 0);
  T.at(b + LAND, mixb(chime(pent(76, i), 1, 1.8), pop(800 + i * 60, .8), shimmer(.8, [pent(88, i), pent(88, i + 2)], .6, .08)), .28, -.4);
  T.at(b + LAND + .1, ooh(BABY, 1), .13, -.4);
  T.at(b + LAND + .02, mixb(click(.7), plink(pent(88, i), .8)), .12, -.7 + i * .2);                          // the slot fills
});
// the gags
T.at(BN[0] + .3, voice([[0, .3, 1, .3]], GODF[0], { fall: .3, shake: 1 }), .09, .4);                           // Indra: "er…"
T.at(BN[0] + GAG, slide(.3, 1800, 900, .8), .1, -.4); T.at(BN[0] + GAG + .3, mixb(zap(.5), boing(1, 330)), .24, -.4); T.at(BN[0] + GAG + .7, giggle(BABY, 1, 5), .16, -.4);
T.at(BN[1] + GAG, mixb(shimmer(1.4, [note(81), note(85), note(88), note(93)], .9, .07), tone(1.2, t => 440 + 220 * t, { e: env.swell(.3, .5), amp: .4 })), .16, -.4);
T.at(BN[1] + GAG + .5, mixb(pop(700, .9), click(.6)), .16, -.4); T.at(BN[1] + GAG + .9, ooh(BABY, 1), .13, -.4);
T.at(BN[2] + GAG, splash(1), .2, -.4); T.at(BN[2] + GAG + .4, voice([[0, .6, 1.3, .6]], BABY, { rise: .3, shake: .6 }), .13, -.4); T.at(BN[2] + GAG + 1.3, mixb(boing(.7, 280), giggle(BABY, 1, 4)), .14, -.4);
T.at(BN[3] + .2, tone(.8, 70, { type: 'saw', e: env.swell(.1, .5), amp: .5 }), .08, .4);                        // Yama, stern
T.at(BN[3] + 1.1, plink(note(84), .8), .1, .4);
T.at(BN[3] + GAG, mixb(boing(.8, 300), giggle(BABY, 1, 5)), .16, -.4); [0, .22, .44].forEach((d, i) => T.at(BN[3] + GAG + .1 + d, pop(800 + i * 120, .8), .11, -.4));
T.at(BN[4] + GAG, whoosh(.3, 600, 2400), .14, -.2); T.at(BN[4] + GAG + .3, mixb(thud(.8), boing(1, 200), plink(1700, .7)), .28, -.4); T.at(BN[4] + GAG + .7, giggle(BABY, 1, 5), .16, -.4);
for (let k = 0; k < 4; k++) T.at(BN[4] + .9 + k * .13, plink(note(96 + k * 2), .5), .06, .5);                    // coins
T.at(BN[5] + .1, om(2.6, 98, 1), .1, .4); T.at(BN[5] + GAG, mixb(chime(note(81), 1, 2), shimmer(1.2, [note(88), note(93), note(97)], .7, .08)), .2, -.3);
T.at(BN[5] + GAG + .2, voice([[0, .4, 1.1, .3]], BABY, { fall: .2 }), .1, -.4);
for (let k = 0; k < 8; k++) T.at(BN[6] + GAG + k * .16, harp(pent(76, k), .9), .1, -.6 + k * .12);
T.at(BN[6] + GAG + .3, giggle(BABY, 1, 4), .13, -.4);
[0, .28, .56].forEach((d, i) => { T.at(BN[7] + GAG + d, whoosh(.3, 2400, 800), .12, .5); T.at(BN[7] + GAG + d + .3, mixb(boing(.9, 240 + i * 50), click(.7), plink(1500 + i * 300, .6)), .22, -.3); });
T.at(BN[7] + GAG + 1.2, giggle(BABY, 1, 5), .16, -.4);

// ================= the name =================
T.at(NAME0, whoosh(.4, 500, 3000), .14, 0);
T.at(NAME0 + .3, talk(2.4, GODF[0], { gap: .19, amp: .9, br: .4 }), .11, .5);
T.at(NAME0 + .9, mixb(pop(900, .9), voice([[0, .25, 1.2, .5]], BABY, { rise: .5 })), .16, -.3);               // "ow?"
T.at(NAME0 + 2.0, mixb(drum(62, .9, .5), chime(note(81), 1, 2), shimmer(1.2, [note(85), note(88), note(93), note(97)], .8, .07)), .3, 0);
T.at(NAME0 + 2.15, giggle(BABY, 1, 6), .17, -.3);

// ================= all eight =================
T.at(ALL0 - .15, whoosh(.25, 500, 3500), .14, 0);
T.at(ALL0, mixb(drum(58, 1, .8), shimmer(1.6, [note(81), note(85), note(88), note(93), note(97)], 1, .06)), .4, 0);
T.at(ALL0 + .08, mixb(...[57, 64, 69, 73, 76, 81].map(m => lp(tone(1.3, note(m), { type: 'saw', e: env.swell(.02, .7), amp: .25 }), 2400))), .24, 0);
for (let i = 0; i < 8; i++) T.at(ALL0 + .5 + i * .11, chime(pent(76, i), .8, 1.2), .1, -.7 + i * .2);
T.at(ALL0 + .3, giggle(BABY, 1, 6), .17, 0); T.at(ALL0 + .6, talk(2.4, ELDER, { gap: .2, amp: .9, br: .3 }), .1, -.5); T.at(ALL0 + .5, giggle(VAYU, 1, 4), .08, .6);
T.at(ALL0 + .2, pad(K0 - ALL0, [57, 64, 69, 73], 1, .4, .8), .07, 0);
T.at(K0 - .3, whoosh(.6, 400, 3000), .18, 0);

// ================= K · the ashram; the curse =================
for (let t = K0 + .3; t < K2; t += .9 + rnd()) T.at(t, bird(2400 + rnd() * 1200, .6), .045, rnd() * 1.6 - .8);
for (let k = 0; K0 + .2 + k * .16 < CRACK - .1; k++) T.at(K0 + .2 + k * .16, plink(note([69, 73, 76, 81, 76, 73][k % 6]), .7), .1, -.6 + k * .12);   // scampering in
T.at(K0 + .3, voice([[0, .9, 1.3, .6]], BABY, { rise: .4, shake: .5 }), .12, -.4);
T.at(CRACK - .25, slide(.25, 900, 300, .8), .12, 0);
T.at(CRACK, crash(1), .42, .1); T.at(CRACK + .25, crash(.7), .3, .3); T.at(CRACK + .02, mixb(squeak(700, 300, .1, .8), click(.8)), .2, -.2);   // pots; the ladle snaps
T.at(CRACK + .12, mixb(boing(1, 200), huh(ELDER * 1.3, 1)), .22, .5); T.at(CRACK + .3, voice([[0, .5, 1.4, .6]], ELDER * 1.2, { rise: .3, shake: 1 }), .12, .6);
T.at(CRACK + .3, mixb(slide(.5, 500, 1300, .8), boing(.7, 300)), .13, -.3);
T.at(CRACK + 1.4, giggle(BABY, 1, 7), .18, -.4);
T.at(K2, pad(ASK0 - K2, [50, 57, 60, 65], 1, .8, 1), .08, 0); T.at(K2, tone(1.2, 82, { type: 'saw', e: env.swell(.3, .6), amp: .4 }), .06, 0);
T.at(K2 + .2, giggle(BABY, .8, 3), .1, -.4);
T.at(CURSE - .5, squeak(300, 520, .4, .7), .09, .4);
T.at(CURSE, talk(1.5, ELDER, { gap: .22, amp: 1, br: .3, fall: .15 }), .13, .4); T.at(CURSE + .1, talk(1.4, ELDER * 1.15, { gap: .22, amp: .8, br: .3 }), .08, .6);
T.at(CURSE, shimmer(1.6, [note(84), note(87), note(90)], .7, .09), .1, 0);
for (let i = 0; i < 8; i++) T.at(DRAIN + i * .12, mixb(chime(pent(76, 7 - i), .8, 1), click(.5)), .13, -.7 + i * .2);   // the powers go grey, down the scale
T.at(DRAIN, slide(1.2, 900, 260, .8), .1, -.4); T.at(DRAIN + .4, aww(BABY, 1), .13, -.4);
T.at(DRAIN + 1.2, mixb(pop(900, 1), huh(BABY, 1)), .18, -.4);
T.at(ASK0 - .3, whoosh(.6, 400, 3000), .18, 0);

// ================= the ask; next =================
{
  const TUNE = [0, 2, 4, 2, 0, 4, 7, 4, 9, 7, 4, 2, 4, 2, 0, -3];
  let i = 0;
  for (let t = ASK0 + .2; t < CARD - .3; t += .32) { const m = TUNE[i++ % TUNE.length]; T.at(t, musicBox(note(81 + m)), .085, i % 2 ? -.25 : .25); }
  T.at(ASK0, pad(CARD - ASK0, [57, 64, 69, 73], 1, .6, 1), .07, 0);
}
T.at(ASK0 + .2, voice([[0, .14, 1.2, .6], [.17, .14, 1.3, .6], [.34, .22, 1.45, .7]], BABY), .1, 0);
for (let i = 0; i < 8; i++) T.at(ASK0 + .95 + i * .17, pop(700 + i * 70, .8), .12, -.7 + i * .2);
T.at(ASK0 + 2.4, giggle(BABY, 1, 4), .14, 0);
T.at(NEXT0, mixb(whoosh(.35, 600, 4000), pop(500, .9)), .18, 0); T.at(NEXT0 + .1, boing(.8, 180), .12, 0);
T.at(NEXT0 + .5, mixb(pop(900, .9), huh(180, 1)), .16, .4);
T.at(NEXT0 + 1.2, mixb(click(.6), plink(note(88), .8)), .12, 0); T.at(NEXT0 + 1.4, voice([[0, .5, 1, .2]], 180, { fall: 0 }), .08, 0);   // "shh"

// ================= the card =================
T.at(CARD, whoosh(.4, 3000, 600), .14, 0);
[.3, .45, .6].forEach((d, i) => T.at(CARD + d, pop(600 + i * 100, .8), .14, -.4 + i * .4));
T.at(CARD + 1.0, chime(note(81), 1, 1.6), .14, 0); T.at(CARD + 1.6, mixb(pop(900, .8), plink(note(88), .8)), .14, 0);
T.at(CARD + 2.2, shimmer(1.2, [note(81), note(85), note(88), note(93)], .7, .09), .12, 0);

T.write('assets/hanu2_sfx.wav');
console.log('assets/hanu2_sfx.wav', END + ' s');
