// hanu1_sfx.mjs: the sound for "HANUMAN JI has THREE fathers" (src/scenes/hanu1.js, ad 85, Hanuman Part 1, no voice)
// → assets/hanu1_sfx.wav. Times are the scene's constants (keep them in sync). Retro synth cartoon foley carries it
// (pops for the question marks, a harp in heaven, the curse zap and the falling whistle, the poof, a three-note
// "father" fanfare that climbs a step each time, wind and rain on the mountain, a wisp, an om on Kailash, the sages'
// marching pizzicato and the trip, a trickle of chimes into her ear, the birth). Music only as mild beds: a harp bed in
// heaven, an om-and-pad on Kailash, a music-box lullaby from the birth through the family picture. Nothing loud.
import { track, tone, noise, bell, mixb, env, whoosh, plink, squeak, click, thud, shimmer, slide, chime, drum, om, wind, thunder, note, seed, rnd, clamp, SR } from './sfx.mjs';

const Q = [1.6, 2.0, 2.4], SHRUG = 3.2, B0 = 4.4;
const C0 = 9.0, CURSE = 9.5, FALL0 = 10.6, LAND0 = 11.6, APPEAR = 11.9, TAILQ = 12.7, D0 = 14.2;
const KARR = 15.7, FLOWER = 16.0, HEART = 16.8, ST1 = 18.4, E0 = 20.4;
const PEEK = 22.0, E2 = 24.6, SWIRL = 24.8, SNAPT = 25.8, E3 = 29.0, VPOP = 29.2, CALM = 31.4, WISP = 33.6, WISPIN = 34.8, ST2 = 37.2, F0 = 39.2;
const F2 = 43.4, OPEN = 43.9, ORB = 44.6, ORBOFF = 46.6, F3 = 48.0, TRIP = 50.4, F4 = 53.2, POUR = 54.5, LIT = 55.5, ST3 = 57.4, G0 = 59.6;
const BORN = 60.9, YAWN = 61.6, EYES = 62.7, H0 = 64.6, LOOKS = [65.2, 66.0, 66.8], ALL = 68.3, CH0 = 71.3, NAMES = [72.4, 73.6, 74.8], I0 = 77.3, J0 = 81.8;
const CARD = 85.4, END = 89.4;

const T = track(END);
seed(85);
const PENTA = [0, 2, 4, 7, 9];
const pent = (base, i) => note(base + 12 * Math.floor(i / 5) + PENTA[i % 5]);
// a buzzy cartoon voice: syllables [start, dur, pitch ×, brightness 0..1] (as in ads 59 and 60)
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
const BABY = 330, ANJ = 290, KES = 165, VAYU = 210, ELDER = 125;
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
const rain = (dur, amp = 1) => noise(dur, { hp: 2500, lp: 9000, e: env.swell(.8, .8), amp });
const zap = amp => mixb(tone(.5, t => 900 * Math.exp(-t * 5) + 120, { type: 'saw', e: env.pluck(5), fm: t => .3 * Math.sin(t * 2 * Math.PI * 40), amp }), noise(.25, { hp: 1500, lp: 7000, e: env.pluck(14), amp: amp * .5 }));
// the "father" stamp: a drum, a little three-note brass call (step raises it each time), a shimmer
const stamp = step => {
  const r = 60 + step * 2, o = new Float32Array(Math.round(2 * SR));
  const add = (b, s0, g = 1) => { const s = Math.round(s0 * SR); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j] * g; };
  add(drum(62, 1, .6), 0, .9); add(thud(.8), .02, .5);
  [[0, r], [.13, r + 4], [.26, r + 7]].forEach(([s, m], i) => add(lp(tone(i === 2 ? .7 : .14, note(m), { type: 'saw', e: env.swell(.01, i === 2 ? .4 : .05), amp: .5 }), 2400), s));
  add(shimmer(.8, [note(r + 24), note(r + 28), note(r + 31), note(r + 36)], .5, .07), .3, .5);
  return o;
};

// ================= beds =================
// A, I, J: a warm quiet room tone with two soft birds; D, F4, H: forest birds
for (const [a, b] of [[LAND0, E0], [F4, ST3], [H0, I0]]) for (let t = a + .4; t < b - .3; t += 1.2 + rnd() * 1.5) T.at(t, bird(2400 + rnd() * 1200, .6), .05, rnd() * 1.6 - .8);
// B: heaven, a slow harp arpeggio over a soft pad
T.at(B0, pad(C0 + .6 - B0, [72, 76, 79, 84], 1, .8, .6), .07, 0);
for (let i = 0; i < 14; i++) T.at(B0 + .15 + i * .32, harp(pent(72, [0, 2, 4, 5, 7, 5, 4, 2][i % 8]), 1), .11, Math.sin(i) * .5);
// E: the mountain top: wind and rain
T.at(E0, wind(F0 - E0 + .3, 0, 1.5), .07, -.3); T.at(E0, wind(F0 - E0 + .3, 2.1, 1.5), .06, .4);
T.at(E0, rain(F0 - E0, 1), .035, 0);
T.at(E0 + .4, thunder(2.6, .35), .16, .3);
// F: Kailash: an om and a still pad; a soft wind
T.at(F0 + .1, om(F3 - F0 - .3, 98, 1), .1, 0); T.at(F0, pad(F3 - F0, [50, 57, 62, 66], 1, 1.5, 1.2), .07, 0);
T.at(F0, wind(F3 - F0, 1.1, 1.5), .03, 0);
T.at(ST3, om(G0 - ST3, 98, 1), .08, 0);
// G–H: the lullaby (a music box over a warm pad) from the birth through the family picture
{
  const TUNE = [0, 2, 4, 2, 0, 4, 7, 4, 9, 7, 4, 2, 4, 2, 0, -3, 0, 2, 4, 7, 4, 2, 0, 0];
  let i = 0;
  for (let t = BORN + .5; t < ALL - .2; t += .32) { const m = TUNE[i++ % TUNE.length]; T.at(t, musicBox(note(76 + m)), .1, i % 2 ? -.25 : .25); }
  T.at(BORN + .3, pad(ALL - BORN, [52, 59, 64, 68], 1, 1.2, 1.2), .07, 0);
  // H2–H3: the same tune, brighter, under ALL THREE and the Chalisa names
  i = 0;
  for (let t = ALL + .4; t < I0 - .3; t += .32) { const m = TUNE[i++ % TUNE.length]; T.at(t, musicBox(note(81 + m)), .085, i % 2 ? -.25 : .25); }
  T.at(ALL, pad(I0 - ALL, [57, 64, 69, 73], 1, .6, 1), .08, 0);
}
// I–J: a light plucked vamp under the ask and the tease
for (let k = 0; k * .4 < CARD - I0 - .4; k++) T.at(I0 + .2 + k * .4, plink(note([69, 73, 76, 73][k % 4]), .7), .07, k % 2 ? .3 : -.3);

// ================= A · the hook =================
T.at(.15, voice([[0, .14, 1.2, .6], [.17, .14, 1.3, .6], [.34, .22, 1.45, .7]], BABY), .1, 0);
T.at(.9, click(.5), .06, 0);
Q.forEach((q, i) => { T.at(q, pop(700 + i * 160, 1), .26, [-.6, .2, .6][i]); T.at(q + .04, plink(note(79 + i * 3), .9), .16, [-.6, .2, .6][i]); });
T.at(Q[0] + .08, huh(BABY, 1), .13, 0);
T.at(SHRUG, giggle(BABY, 1, 5), .17, 0); T.at(SHRUG, boing(.7, 300), .1, 0);
T.at(B0 - .3, whoosh(.6, 400, 3000), .2, 0);

// ================= B · heaven =================
T.at(B0 + .4, shimmer(1.2, [note(84), note(88), note(91), note(96)], .7, .09), .12, 0);
for (let k = 0; k < 5; k++) T.at(B0 + 1 + k * .98, mixb(click(.4), plink(note(96), .4)), .06, k % 2 ? .3 : -.3);   // her anklets

// ================= C · the curse, the fall, the landing =================
T.at(CURSE, zap(1), .42, 0); T.at(CURSE + .02, drum(50, 1, .7), .34, 0); T.at(CURSE + .1, huh(ANJ * 1.1, 1), .2, 0);
T.at(CURSE + .5, tone(.6, t => 180 - 60 * t, { type: 'saw', e: env.swell(.05, .3), amp: .5 }), .08, 0);
T.at(FALL0 - .05, slide(1.05, 1900, 320, 1), .16, 0); T.at(FALL0, whoosh(1.0, 3000, 500), .22, 0);
T.at(FALL0 + .1, voice([[0, .8, 1.3, .6]], ANJ, { fall: .5, shake: 1 }), .12, 0);
T.at(LAND0, mixb(thud(1), noise(.5, { lp: 1800, hp: 200, e: env.pluck(7), amp: .8 })), .4, 0); T.at(LAND0 + .05, shimmer(.9, [note(88), note(91), note(96), note(100)], .7, .06), .16, 0);
T.at(APPEAR, pop(600, 1), .2, 0); T.at(APPEAR + .1, boing(.8, 240), .14, 0);
T.at(TAILQ, pop(900, 1), .2, .3); T.at(TAILQ + .05, huh(ANJ, 1), .18, 0);
for (let k = 0; k < 3; k++) T.at(TAILQ + .25 + k * .2, whoosh(.14, 900, 2000), .06, .4);   // the tail wags
T.at(TAILQ + 1.0, giggle(ANJ, 1, 3), .14, 0);
T.at(D0 - .3, whoosh(.6, 400, 3000), .18, 0);

// ================= D · Kesari; FATHER NO. 1 =================
for (let k = 0; k < 6; k++) T.at(D0 + .25 + k * .24, mixb(thud(.35), click(.3)), .1, .7 - k * .1);   // his steps
T.at(FLOWER - .2, whoosh(.3, 1200, 3000), .08, .3); T.at(FLOWER, plink(note(88), 1), .16, .2);
T.at(FLOWER + .35, aww(ANJ, 1), .14, -.4);
T.at(HEART, shimmer(.9, [note(84), note(88), note(91)], .7, .1), .16, 0); [0, .22, .44].forEach((d, i) => T.at(HEART + d, pop(800 + i * 120, .8), .12, 0));
T.at(ST1 - .25, whoosh(.3, 500, 3500), .16, .2); T.at(ST1, stamp(0), .5, 0);
T.at(ST1 + .35, voice([[0, .12, 1, .4], [.16, .12, 1.05, .4], [.32, .2, 1.1, .5]], KES, { fall: .1 }), .15, .2);   // a proud "ha ha haa"
T.at(E0 - .3, whoosh(.6, 3000, 400), .18, 0);

// ================= E · the mountain top; the wind; Vayu; FATHER NO. 2 =================
for (let k = 0; k < 9; k++) T.at(E0 + .3 + k * .45, mixb(click(.35), plink(note(96), .35)), .05, -.6 + k * .08);   // her anklets
T.at(E0 + .8, talk(1.4, ANJ * 1.2, { gap: .2, amp: .6, br: .3 }), .05, -.4);                                    // humming
T.at(PEEK, mixb(slide(.3, 500, 1100, 1), pop(700, .8)), .18, .6); T.at(PEEK + .5, boing(1, 300), .16, .6); T.at(PEEK + .55, ooh(VAYU, 1), .18, .6);
T.at(PEEK + .6, plink(note(91), 1), .13, .6);
T.at(SWIRL, whoosh(1.0, 400, 2600), .3, -.3); T.at(SWIRL + .5, whoosh(.9, 2600, 700), .26, .3); T.at(SWIRL + 1.0, whoosh(.9, 600, 2400), .22, -.2);
T.at(SWIRL + .3, huh(ANJ, 1), .16, 0);
for (let k = 0; k < 6; k++) T.at(SNAPT + 1 + k * .5, whoosh(.5, 500 + 300 * (k % 2), 1800), .1, k % 2 ? .4 : -.4);
T.at(SNAPT, mixb(drum(70, 1, .4), tone(.25, t => 150 - 30 * t, { type: 'square', e: env.swell(.01, .1), amp: .5 })), .3, 0);
T.at(SNAPT + .1, talk(2.3, ANJ, { gap: .15, amp: 1, br: .8, fall: .2 }), .15, 0);
T.at(VPOP, mixb(whoosh(.5, 600, 5000), pop(500, 1)), .3, .4); T.at(VPOP + .1, shimmer(.8, [note(86), note(91), note(93)], .6, .07), .14, .4);
T.at(E3 + .4, talk(2.6, VAYU, { gap: .19, amp: .9, br: .35 }), .12, .4);
T.at(CALM, voice([[0, .25, 1, .3]], ANJ * .9, { fall: .3 }), .1, -.4);                                          // "hm."
T.at(WISP - .4, talk(1.5, VAYU, { gap: .19, amp: .9, br: .4 }), .12, .4);
T.at(WISP, mixb(slide(WISPIN - WISP, 1400, 700, .8), whoosh(WISPIN - WISP, 3000, 1200)), .14, .2);
for (let k = 0; k < 6; k++) T.at(WISP + .1 + k * .19, chime(pent(84, 6 - k), .7, 1), .09, .4 - k * .15);
T.at(WISPIN, shimmer(1.2, [note(84), note(88), note(91), note(96), note(100)], .8, .07), .2, -.4); T.at(WISPIN + .1, aww(ANJ * 1.1, 1), .14, -.4);
T.at(WISPIN + .5, giggle(VAYU * 1.2, 1, 4), .12, .4);
T.at(ST2 - .25, whoosh(.3, 500, 3500), .16, .3); T.at(ST2, stamp(1), .5, 0);
T.at(ST2 + .35, giggle(VAYU, 1, 4), .13, .3);
T.at(F0 - .3, whoosh(.6, 3000, 300), .2, 0);

// ================= F · Kailash; the energy; the seven sages; the ear; FATHER NO. 3 =================
T.at(F0 + .2, chime(note(69), 1, 2.4), .12, 0);
T.at(OPEN, mixb(chime(note(81), 1, 1.6), click(.4)), .14, 0);
T.at(ORB - .2, whoosh(.6, 300, 2400), .12, 0);
T.at(ORB, mixb(shimmer(1.4, [note(81), note(85), note(88), note(93), note(97)], .8, .08), drum(55, .7, .8)), .22, 0);
T.at(ORB + .3, tone(ORBOFF - ORB, t => 440 + 30 * Math.sin(t * 6), { e: env.swell(.3, .4), amp: .5 }), .05, 0);
T.at(ORBOFF, mixb(slide(1.2, 500, 1800, .8), whoosh(1.2, 800, 5000)), .16, .4);
T.at(F3 - .3, whoosh(.6, 400, 3000), .18, 0);
for (let k = 0; k * .25 < F4 - F3 - .5; k++) {   // the sages' march: pizzicato steps
  const t = F3 + .2 + k * .25; if (t > TRIP - .05 && t < TRIP + 1.2) continue;
  T.at(t, plink(note([57, 64, 60, 64][k % 4]), .8), .13, -.6 + (k % 7) * .2); T.at(t, click(.3), .04, 0);
}
T.at(F3 + .3, talk(1.8, ELDER, { gap: .25, amp: .7, br: .2 }), .06, 0);
T.at(TRIP, mixb(boing(1, 200), squeak(500, 900, .12, .8)), .26, 0); T.at(TRIP + .1, huh(ELDER * 1.3, 1), .2, 0);
T.at(TRIP + .15, slide(.45, 600, 1700, 1), .16, 0); T.at(TRIP + .6, slide(.45, 1700, 700, 1), .14, 0);
T.at(TRIP + .3, voice([[0, .5, 1.4, .6]], ELDER * 1.2, { rise: .3, shake: 1 }), .12, .3);                       // the others gasp
T.at(TRIP + 1.05, mixb(plink(note(93), 1), chime(note(81), .8, 1)), .2, 0); T.at(TRIP + 1.25, aww(ELDER, 1), .13, 0);   // caught: "phew"
T.at(F4 - .3, whoosh(.6, 3000, 400), .18, 0);
T.at(POUR - .5, squeak(300, 520, .4, .7), .1, .4);
for (let k = 0; k < 8; k++) T.at(POUR + k * .125, chime(pent(81, 8 - k), .7, .9), .12, .4 - k * .09);                 // the trickle down the leaf
T.at(POUR + .35, giggle(ANJ * 1.1, 1, 4), .13, -.3);                                                                  // it tickles
T.at(LIT, mixb(shimmer(1.4, [note(81), note(85), note(88), note(93), note(97)], .9, .07), drum(55, .6, .7)), .24, -.2);
T.at(LIT + .5, aww(ANJ * 1.1, 1), .14, -.3); T.at(LIT + .6, giggle(ELDER * 1.2, 1, 3), .1, .5);
T.at(ST3 - .12, whoosh(.25, 500, 3500), .14, 0); T.at(ST3, stamp(2), .52, 0);
T.at(ST3 + .3, chime(note(86), 1, 1.8), .12, 0);
T.at(G0 - .3, whoosh(.6, 3000, 300), .18, 0);

// ================= G · the birth =================
for (let k = 0; k < 4; k++) T.at(G0 + .15 + k * .3, drum(48, .5 + k * .15, .35), .2 + k * .04, 0);                     // a heartbeat, growing
T.at(G0 + .1, tone(BORN - G0, t => 220 + 330 * (t / (BORN - G0)) ** 2, { e: env.swell(.3, .05), amp: .6 }), .07, 0);
T.at(BORN, mixb(shimmer(1.6, [note(76), note(80), note(83), note(88), note(92), note(95)], 1, .06), drum(52, 1, .9), whoosh(.6, 500, 5000)), .34, 0);
T.at(BORN + .25, pop(700, 1), .16, 0);
T.at(YAWN, voice([[0, .7, 1.25, .35]], BABY, { fall: .45 }), .16, 0);                                                    // the yawn
T.at(EYES, mixb(pop(1000, .9), plink(note(93), .9)), .18, 0); T.at(EYES + .1, ooh(BABY, 1), .16, 0);
T.at(EYES + .75, giggle(BABY, 1, 6), .18, 0);
T.at(H0 - .3, whoosh(.6, 400, 3000), .18, 0);

// ================= H · which one? ALL THREE; the Chalisa =================
LOOKS.forEach((q, i) => { T.at(q, mixb(squeak(500 + i * 120, 760 + i * 120, .12, .8), click(.4)), .14, [.6, .6, -.6][i]); });
T.at(LOOKS[2] + .6, mixb(pop(900, 1), huh(BABY, 1)), .18, 0);
T.at(ALL - .15, whoosh(.25, 500, 3500), .14, 0);
T.at(ALL, mixb(drum(60, 1, .7), shimmer(1.4, [note(81), note(85), note(88), note(93), note(97)], 1, .06)), .4, 0);
T.at(ALL + .1, mixb(...[69, 73, 76, 81].map(m => lp(tone(1.0, note(m), { type: 'saw', e: env.swell(.02, .6), amp: .3 }), 2400))), .22, 0);
T.at(ALL + .3, giggle(BABY, 1, 6), .18, 0); T.at(ALL + .45, giggle(VAYU, 1, 3), .08, .6); T.at(ALL + .5, giggle(KES * 1.3, 1, 3), .08, .4);
NAMES.forEach((q, i) => { T.at(q, mixb(drum(66, .8, .4), chime(note(81 + i * 2), 1, 1.6), pop(700, .6)), .3, [-.5, .5, .5][i]); T.at(q + .08, shimmer(.6, [note(93 + i * 2), note(97 + i * 2)], .6, .08), .12, [-.5, .5, .5][i]); });
T.at(I0 - .3, whoosh(.6, 400, 3000), .18, 0);

// ================= I · the ask; J · next =================
T.at(I0 + .2, voice([[0, .14, 1.2, .6], [.17, .14, 1.3, .6], [.34, .22, 1.45, .7]], BABY), .1, 0);
[0, .25, .5].forEach((d, i) => T.at(I0 + .9 + d, pop(800 + i * 140, .9), .16, [-.6, 0, .6][i]));
T.at(I0 + 1.3, giggle(BABY, 1, 4), .14, 0);
T.at(J0, whoosh(.35, 600, 4000), .16, 0);
for (let i = 0; i < 8; i++) T.at(J0 + .1 + i * .08, chime(pent(79, i), .8, 1.2), .11, -.7 + i * .2);
T.at(J0 + .9, mixb(ooh(BABY, 1), shimmer(.8, [note(96), note(100), note(103)], .6, .07)), .16, 0);
T.at(J0 + 1.6, giggle(BABY, 1, 5), .14, 0);

// ================= the card =================
T.at(CARD, whoosh(.4, 3000, 600), .14, 0);
[.3, .45, .6].forEach((d, i) => T.at(CARD + d, pop(600 + i * 100, .8), .14, -.4 + i * .4));
T.at(CARD + 1.0, chime(note(81), 1, 1.6), .14, 0); T.at(CARD + 1.6, mixb(pop(900, .8), plink(note(88), .8)), .14, 0);
T.at(CARD + 2.2, shimmer(1.2, [note(81), note(85), note(88), note(93)], .7, .09), .12, 0);

T.write('assets/hanu1_sfx.wav');
console.log('assets/hanu1_sfx.wav', END + ' s');
