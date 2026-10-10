// sun_sfx.mjs: the sound effects for "Baby HANUMAN once tried to EAT the SUN" (src/scenes/sun.js) → assets/sun_sfx.wav.
// Times are the scene's constants (keep them in sync). The signatures: a baby voice (coos, "ooh", "wheee", giggles, a
// yawn), the tummy grumble, the GULP, the sudden dark, Rahu's shriek, Airavata's trumpet, the vajra's crack and BONK,
// the falling whistle, Vayu's storm and then SILENCE (no air), Brahma's bells, the boons, the name, the CHOMP.
import { track, tone, noise, bell, mixb, env, whoosh, rumble, plink, clang, click, thud, crackle, crunch, crinkle, shimmer, slide, drone, gurgle, squeak, note, seed, rnd, clamp, lerp, SR } from './sfx.mjs';

const GRUMBLE = 1.6, B0 = 3.0, LOOK = 3.3, RISE = 4.0, SEE = 5.2, MANGO = 5.8, DROOL = 6.8, HOP = 7.5;
const WIGGLE = 8.0, LEAP = 8.9, C0 = 9.0, D0 = 12.0;
const NOTICE = 12.3, SOFT = 13.3, AAM = 14.9, GULP = 15.5, CHALISA = 17.7;
const RAHU = 22.1, SPOT = 23.2, LUNGE = 24.5, FLEE = 24.9, G0 = 26.4;
const INDRA = 26.5, FRUIT = 28.6, JUMP = 29.4, WIND = 29.9, THROW = 30.5, HIT = 30.8, H0 = 31.0;
const LAND = 32.4, I0 = 35.0, VAYU = 35.1, ANGRY = 36.5, STOP = 37.7, J0 = 40.4;
const BRAHMA = 40.5, TOUCH = 41.3, WAKE = 41.8, PHEW = 42.3, BOONS = 42.9, GARLAND = 44.3, K0 = 46.0;
const HANU = 46.1, NAME = 48.4, L0 = 50.4;
const BASKET = 50.6, GRAB = 51.3, WINK = 52.2, CHOMP = 52.8, ASK = 50.6, WIPE = 54.1;
const CARD = 54.4, FOLLOW = 55.0, PILL = 55.5, END = 58.4;

const T = track(END);
seed(21);
const lp = (b, fc) => { let l = 0; const a = 1 - Math.exp(-2 * Math.PI * fc / SR); for (let i = 0; i < b.length; i++) { l += a * (b[i] - l); b[i] = l; } return b; };
const add = (o, b, s0, g = 1) => { const s = Math.round(s0 * SR); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j] * g; return o; };
// a buzzy cartoon voice: syllables [start, dur, pitch ×, brightness 0..1]
function voice(syl, f0, { amp = 1, growl = 0, fall = .1, rise = 0 } = {}) {
  const D = Math.max(...syl.map(([s, d]) => s + d)) + .1, o = new Float32Array(Math.round(D * SR));
  let ph = 0, l = 0;
  for (let i = 0; i < o.length; i++) {
    const t = i / SR, s = syl.find(([a, d]) => t >= a && t < a + d);
    if (!s) { o[i] = 0; continue; }
    const [a, d, pm, br] = s, k = (t - a) / d, e = clamp(k / .12) * clamp((1 - k) / .25);
    ph += f0 * pm * (1.04 - fall * k + rise * k) * (1 + .012 * Math.sin(t * 38) + growl * .03 * Math.sin(t * 190)) / SR;
    const x = 2 * (ph - Math.floor(ph)) - 1, fc = 600 + br * 2400 * Math.sin(Math.PI * clamp(k * 1.3)), al = 1 - Math.exp(-2 * Math.PI * fc / SR);
    l += al * (x * e - l); o[i] = l * amp;
  }
  return o;
}
const BABY = 430;   // the baby's pitch
const coo = (pm = 1, d = .25, amp = 1) => voice([[0, d, pm, .6]], BABY, { amp, fall: -.15 });
const giggle = (n = 5, amp = 1, f = BABY) => voice(Array.from({ length: n }, (_, i) => [i * .11, .08, 1.15 - i * .03, .8]), f, { amp });
const ooh = (amp = 1) => voice([[0, .55, 1.0, .5]], BABY, { amp, fall: -.3 });
const ting = (m, amp = 1) => bell(note(m), 1.2, { amp });
const pop = (amp = 1, f = 1) => mixb(click(amp), tone(.07, t => f * (500 + 2600 * t / .07), { e: env.pluck(40), amp: amp * .7 }), noise(.05, { lp: 2500, hp: 300, e: env.pluck(60), amp: amp * .5 }));
const boing = (amp = 1, f = 1) => tone(.45, t => f * (300 + 500 * Math.sin(Math.PI * clamp(t / .3))) * (1 + .08 * Math.sin(t * 2 * Math.PI * 22)), { type: 'tri', e: env.ad(.005, .15), amp });
const chirp = (f = 1, amp = 1) => mixb(tone(.07, t => f * (3000 + 1800 * Math.sin(t * 90)), { e: env.hann(), amp }), tone(.06, t => f * (3600 - 9000 * t), { e: env.hann(), amp: amp * .7 }));
const tummy = (amp = 1) => mixb(gurgle(.6, amp * .8), lp(tone(.55, t => 70 + 25 * Math.sin(t * 9), { type: 'saw', e: env.hann(), fm: t => .3 * Math.sin(t * 2 * Math.PI * 23), amp }), 400));
const thunder = (d, amp = 1) => mixb(rumble(d, amp), noise(d, { lp: 300, hp: 30, e: env.ad(.02, d * .4), brown: true, amp: amp * .8 }));
const crack = (amp = 1) => mixb(noise(.25, { hp: 1500, lp: 12000, e: env.pluck(14), amp }), click(amp), thud(amp * .7));
const trumpet = (amp = 1, up = 1) => lp(tone(.8, t => (380 + up * 260 * Math.sin(Math.PI * clamp(t / .6))) * (1 + .02 * Math.sin(t * 2 * Math.PI * 7)), { type: 'saw', e: env.swell(.05, .25), amp }), 2600);
const chomp = (amp = 1) => mixb(crunch(amp * .7), tone(.08, t => 220 - 900 * t, { type: 'tri', e: env.pluck(30), amp: amp * .5 }));
const gulp = (amp = 1) => mixb(tone(.35, t => 300 * Math.exp(-t * 7) + 60, { e: env.ad(.01, .12), amp }), pop(amp * .5, .6));
const chord = (ms, d = 2, amp = 1) => { const o = new Float32Array(Math.round((d + 1) * SR)); ms.forEach((m, i) => add(o, bell(note(m), d, { partials: [[1, 1], [2, .35], [3, .12]], k: 1.4, amp }), i * .05)); return o; };
const drumroll = (d, amp = 1) => { const o = new Float32Array(Math.round((d + .3) * SR)); for (let k = 0; k * .045 < d; k++) add(o, noise(.06, { lp: 1800, hp: 150, e: env.pluck(50), amp: amp * (.5 + .5 * k * .045 / d) }), k * .045); return o; };

// ---- A+B: the clearing at dawn
T.at(0, drone(C0, 55, .5), .1, 0);
for (const [tt, f, p] of [[.4, 1, -.6], [.6, 1.1, -.6], [2.6, .95, .5], [4.5, 1.05, -.5], [4.68, 1.15, -.5], [6.3, 1, .6]]) T.at(tt, chirp(f), .07, p);
T.at(.3, coo(1.1, .22), .18, 0);
T.at(GRUMBLE, tummy(1), .5, 0); T.at(GRUMBLE + .45, tummy(.9), .45, 0);
T.at(GRUMBLE + .25, voice([[0, .18, 1.25, .7]], BABY), .2, 0);                  // "oh!"
T.at(GRUMBLE + .75, voice([[0, .35, .9, .4]], BABY, { fall: .3 }), .18, 0);      // "hmmph"
T.at(LOOK + .1, squeak(900, 1300, .08), .08, .4); T.at(LOOK + .75, squeak(1300, 900, .08), .08, -.4);
T.at(RISE, slide(1.2, 220, 440, 1), .07, .4); T.at(RISE + .2, shimmer(1.5, [72, 76, 79, 84].map(note), .6, .25), .13, .4);
T.at(SEE, shimmer(.8, [88, 91, 96].map(note), 1, .06), .2, .3); T.at(SEE + .1, ooh(1), .25, 0);
T.at(MANGO, ting(84, 1), .25, .4); T.at(MANGO + .05, ting(91, 1), .15, .4);
T.at(MANGO + .3, voice([[0, .3, 1.2, .5], [.35, .45, 1.45, .6]], BABY), .2, 0);    // "mm-MAA!"
T.at(DROOL + .4, plink(note(93), 1), .12, 0);
T.at(HOP, boing(.8, 1.4), .2, 0);
for (let k = 0; k < 7; k++) T.at(WIGGLE + .1 + k * .11, squeak(k % 2 ? 1500 : 1200, k % 2 ? 1200 : 1500, .07), .07, k % 2 ? .1 : -.1);
T.at(LEAP - .1, voice([[0, .9, 1.0, .9]], BABY, { rise: .9, fall: 0 }), .3, 0);    // "wheeee!"
T.at(LEAP - .05, whoosh(.6, 400, 3800), .45, .2);

// ---- C: up through the sky
T.at(C0, noise(D0 - C0, { lp: 1600, hp: 200, e: env.swell(.3, .4), amp: 1 }), .1, 0);
for (let k = 0; k < 4; k++) T.at(C0 + .2 + k * .7, whoosh(.5, 300, 1800), .12, -.5 + k * .3);
T.at(10.0, squeak(1800, 2600, .1), .12, .5); T.at(10.12, squeak(2000, 2900, .1), .1, .6);
T.at(10.65, giggle(5, 1), .22, 0);

// ---- D: the sun
T.at(D0, drone(GULP - D0, 82, .6), .12, .3);
T.at(D0 - .15, whoosh(.4, 500, 3000), .3, -.3);
T.at(NOTICE, plink(note(79)), .22, .3); T.at(NOTICE + .12, plink(note(86)), .22, .3);
T.at(SOFT, shimmer(1.2, [76, 79, 83, 88].map(note), 1, .09), .18, .3);
T.at(SOFT + .25, giggle(6, 1), .24, -.2);
T.at(AAM - .45, voice([[0, .7, .9, .9]], BABY, { rise: .5, fall: 0 }), .3, -.2);    // "aaaaa"
T.at(GULP - .38, whoosh(.4, 300, 2600), .4, 0);
T.at(GULP, gulp(1), .7, 0);
T.at(GULP + .03, slide(.8, 300, 70, 1), .25, 0);                                     // the light goes out
T.at(GULP + .1, thud(.8), .3, 0);

// ---- E: the Chalisa: a temple bell, the munching, the stars
T.at(GULP + .6, voice([[0, .3, 1.0, .3], [.4, .3, 1.1, .3]], BABY), .2, 0);         // "mm-mm"
T.at(CHALISA + .4, clang(note(64), 1), .2, 0); T.at(CHALISA + .45, clang(note(71), 1), .1, 0);
for (let k = 0; k < 8; k++) T.at(CHALISA + .3 + k * .5, plink(note(96 + (k * 5) % 7), .7), .05, -.6 + (k % 4) * .4);
T.at(19.4, voice([[0, .25, 1.0, .3], [.3, .25, 1.15, .3], [.6, .35, 1.25, .35]], BABY), .18, 0);

// ---- F: Rahu
T.at(RAHU - .1, whoosh(.9, 200, 1400), .3, .7);
T.at(RAHU + .3, voice([[0, .16, 1, .7], [.2, .16, 1.05, .7], [.4, .2, 1.1, .7]], 150, { growl: 1.2 }), .3, .5);   // "heh heh heh"
T.at(RAHU + .5, noise(.4, { hp: 900, lp: 5000, e: env.hann(), amp: 1 }), .1, .5);       // a slurp
T.at(SPOT, plink(note(79)), .22, .5); T.at(SPOT + .12, plink(note(86)), .22, .5);
T.at(SPOT + .4, pop(1, 1.2), .25, -.2);
T.at(LUNGE - .1, voice([[0, .25, 1.2, .8]], BABY), .25, -.2); T.at(LUNGE, whoosh(.4, 500, 3200), .35, 0);
T.at(FLEE, voice([[0, .9, 1.6, 1]], 170, { fall: .5, growl: 1.5 }), .4, .5);        // Rahu shrieks
T.at(FLEE + .1, whoosh(.6, 300, 2500), .35, .8);
T.at(FLEE + .5, voice([[0, .35, .9, .4]], BABY, { fall: .3 }), .18, -.2);           // "hmph"
T.at(G0 - .3, whoosh(.6, 400, 2200), .3, 0);

// ---- G: Indra
T.at(G0, thunder(2.0, 1), .35, .3);
T.at(INDRA + .7, trumpet(1, 1), .3, .4);
T.at(27.6, plink(note(88)), .15, -.3); T.at(27.75, plink(note(91)), .15, -.3);
T.at(27.9, pop(1, 1.2), .25, -.3); T.at(28.0, ooh(1), .22, -.3);
T.at(JUMP, whoosh(.6, 400, 3000), .4, -.1);
T.at(JUMP + .15, trumpet(1, 1.6), .32, .4);                                          // Airavata panics
T.at(WIND, slide(.6, 200, 900, 1), .14, .4); T.at(WIND, crackle(.6, 1), .18, .4);   // the vajra charges
T.at(THROW, whoosh(.3, 800, 5000), .4, .2);
T.at(HIT, crack(1), .6, 0); T.at(HIT + .02, boing(1, 1), .35, 0); T.at(HIT + .02, thunder(1.2, 1), .4, 0);
T.at(HIT + .08, pop(1, .9), .4, .3);                                                 // the sun pops out

// ---- H: the fall, the mountain, the jaw
T.at(H0, slide(1.35, 1800, 300, 1), .2, 0);
T.at(LAND, thud(1), .7, 0); T.at(LAND, rumble(.6, 1), .25, 0);
T.at(LAND + .45, boing(.8, 1.8), .25, .2);                                            // the jaw swells
for (let k = 0; k < 6; k++) T.at(LAND + .3 + k * .28, chirp(1.2 + (k % 2) * .2, .8), .06, -.5 + (k % 3) * .5);
T.at(34.05, slide(.6, 500, 250, 1), .1, 0);

// ---- I: Vayu, the storm, then SILENCE
T.at(VAYU - .2, whoosh(1.0, 200, 2400), .45, -.6);
T.at(VAYU + .9, voice([[0, .3, 1.1, .4], [.35, .4, 1.0, .4]], 240, { fall: .3 }), .2, 0);   // a sob
T.at(ANGRY, noise(STOP - ANGRY, { lp: t => 600 + 1800 * t, hp: 80, e: env.swell(.2, .02), amp: 1 }), .35, 0);
T.at(ANGRY, thunder(1.2, 1), .3, 0);
T.at(ANGRY + .1, voice([[0, .6, .7, .9]], 200, { growl: 2 }), .3, 0);                // a roar
T.at(36.9, whoosh(.7, 300, 3000), .4, .5);
// STOP: everything cuts; only strained little hums
T.at(STOP + .6, voice([[0, 1.2, 1.0, .2]], 160, { fall: 0 }), .08, -.3);
T.at(STOP + .9, voice([[0, 1.0, 1.0, .2]], 260, { fall: 0 }), .06, .4);
T.at(STOP + 1.6, squeak(700, 900, .2), .05, .5);
T.at(39.3, voice([[0, .8, 1.05, .25]], 120, { fall: 0 }), .07, 0);

// ---- J: Brahma, waking, the boons
T.at(BRAHMA, chord([62, 66, 69, 74, 78], 2.5, 1), .25, .3);
T.at(TOUCH, shimmer(.8, [91, 95, 98].map(note), 1, .05), .22, 0);
T.at(WAKE, voice([[0, .7, 1.0, .5]], BABY, { fall: .4 }), .25, 0);                  // the yawn
T.at(WAKE + .5, voice([[0, .15, 1.3, .8]], BABY), .2, 0);                            // "?"
T.at(PHEW, whoosh(1.2, 200, 1800), .45, 0); T.at(PHEW + .05, noise(1.4, { lp: 1200, hp: 100, e: env.swell(.3, .6), amp: 1 }), .15, 0);
T.at(PHEW + .2, giggle(6, 1), .24, 0);
for (let k = 0; k < 4; k++) { T.at(BOONS + k * .4, whoosh(.3, 800, 4000), .15, -.6 + k * .4); T.at(BOONS + .28 + k * .4, ting(84 + k * 3, 1), .2, 0); }
T.at(GARLAND - .3, whoosh(.5, 600, 2000), .2, 0); T.at(GARLAND + .25, shimmer(.6, [86, 90, 93].map(note), 1, .04), .2, 0);
T.at(44.9, voice([[0, .2, 1.1, .9]], BABY), .25, 0); T.at(44.95, shimmer(.5, [96, 100].map(note), 1, .06), .15, 0);   // "hup!"

// ---- K: the name
for (let k = 0; k < 3; k++) T.at(HANU + .7 + k * .22, click(.8), .15, -.2);         // pat pat pat
T.at(HANU + .8, voice([[0, .2, 1.0, .6], [.25, .2, 1.05, .6]], BABY), .18, -.2);    // "uh-huh?"
T.at(NAME - .1, drumroll(.45, 1), .3, 0);
T.at(NAME + .35, chord([60, 64, 67, 72, 76, 79], 3, 1), .35, 0); T.at(NAME + .35, clang(note(60), 1), .2, 0);
T.at(NAME + .6, giggle(7, 1), .25, -.2);

// ---- L: the mango
T.at(L0 - .3, whoosh(.6, 300, 2400), .3, 0);
for (const [tt, f, p] of [[L0 + .3, 1, -.6], [L0 + .45, 1.1, -.6], [52.6, 1, .6]]) T.at(tt, chirp(f), .07, p);
T.at(BASKET, crinkle(.4, 1), .2, -.6); T.at(BASKET + .38, thud(.6), .3, -.6);
T.at(BASKET + .45, ooh(1), .25, -.2);
T.at(GRAB, pop(.8, 1.2), .2, 0);
T.at(GRAB + .5, voice([[0, .4, 1.1, .6]], BABY, { rise: .2 }), .18, 0);
T.at(WINK, ting(96, 1), .25, .5); T.at(WINK + .06, plink(note(100)), .15, .5);
T.at(CHOMP, chomp(1), .55, 0); T.at(CHOMP + .3, voice([[0, .25, 1.0, .3], [.3, .25, 1.12, .3], [.6, .4, 1.3, .4]], BABY), .22, 0);   // "mm mm MMM!"
T.at(CHOMP + .4, shimmer(.6, [88, 91].map(note), 1, .1), .12, 0);
T.at(WIPE - .05, whoosh(.6, 300, 2400), .3, 0);

// ---- the card
T.at(CARD, chord([72, 76, 79, 84], 2, 1), .2, 0);
T.at(FOLLOW, plink(note(84)), .2, 0); T.at(PILL, pop(.9, 1.1), .25, 0); T.at(PILL + .1, ting(91, 1), .14, 0);
T.at(56.4, giggle(5, 1), .18, -.1);

T.write('assets/sun_sfx.wav');
