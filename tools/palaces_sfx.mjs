// palaces_sfx.mjs: the sound effects for "Krishna had 16,108 queens" (src/scenes/palaces.js) → assets/palaces_sfx.wav.
// Times are the scene's constants (keep them in sync). The signatures: Narad's veena (plucked strings) and his cloud,
// the palace bell at every door, the chamara swish, Krishna's hop, the water poured on Narad's feet, the dice rattle,
// "Narad-ji!", Narad's yelp, the kids' giggles, the bath splash, the fire's crackle, the sword's swish and clang, the
// cow, the meditation drone, the counter racing up, the laugh, the queens' chime, and the walk-off song.
import { track, tone, noise, bell, mixb, env, whoosh, rumble, plink, clang, click, thud, crunch, shimmer, slide, drone, gurgle, squeak, note, seed, clamp, SR } from './sfx.mjs';

const B0 = 3.8, SCRATCH = 4.4, DIVE = 6.8;
const C0 = 7.4, ENTER = 7.6, JUMP = 9.8, LAND = 10.3, POUR = 10.6, HEAD = 12.4;
const D0 = 14.6, ROLL = 15.0, LOOK = 16.6, TAKE = 17.4, BACK = 18.9;
const E0 = 21.0, EK = 2.03;
const F0 = 33.2, G0 = 36.4, TEACH = 39.7, H0 = 43.0, I0 = 48.6, WINK = 52.4;
const CARD = 54.0, FOLLOW = 54.6, PILL = 55.1, END = 57.6;

const T = track(END);
seed(11);
const lp = (b, fc) => { let l = 0; const a = 1 - Math.exp(-2 * Math.PI * fc / SR); for (let i = 0; i < b.length; i++) { l += a * (b[i] - l); b[i] = l; } return b; };
const add = (o, b, s0, g = 1) => { const s = Math.round(s0 * SR); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j] * g; return o; };
// a buzzy cartoon voice: syllables [start, dur, pitch ×, brightness 0..1]
function voice(syl, f0, { amp = 1, fall = .1, rise = 0 } = {}) {
  const D = Math.max(...syl.map(([s, d]) => s + d)) + .1, o = new Float32Array(Math.round(D * SR));
  let ph = 0, l = 0;
  for (let i = 0; i < o.length; i++) {
    const t = i / SR, s = syl.find(([a, d]) => t >= a && t < a + d);
    if (!s) { o[i] = 0; continue; }
    const [a, d, pm, br] = s, k = (t - a) / d, e = clamp(k / .12) * clamp((1 - k) / .25);
    ph += f0 * pm * (1.04 - fall * k + rise * k) * (1 + .012 * Math.sin(t * 38)) / SR;
    const x = 2 * (ph - Math.floor(ph)) - 1, fc = 600 + br * 2400 * Math.sin(Math.PI * clamp(k * 1.3)), al = 1 - Math.exp(-2 * Math.PI * fc / SR);
    l += al * (x * e - l); o[i] = l * amp;
  }
  return o;
}
const NAR = 240, KRS = 200, KID = 430, QUEEN = 300, SAGE = 170;
const chatter = (n, f, gap = .13, amp = 1) => voice(Array.from({ length: n }, (_, i) => [i * gap, gap * .75, 1 + .12 * Math.sin(i * 2.3), .6]), f, { amp });
const giggle = (n = 5, amp = 1, f = KID) => voice(Array.from({ length: n }, (_, i) => [i * .11, .08, 1.15 - i * .03, .8]), f, { amp });
const ting = (m, amp = 1) => bell(note(m), 1.2, { amp });
const pop = (amp = 1, f = 1) => mixb(click(amp), tone(.07, t => f * (500 + 2600 * t / .07), { e: env.pluck(40), amp: amp * .7 }), noise(.05, { lp: 2500, hp: 300, e: env.pluck(60), amp: amp * .5 }));
const chord = (ms, d = 2, amp = 1) => { const o = new Float32Array(Math.round((d + 1) * SR)); ms.forEach((m, i) => add(o, bell(note(m), d, { partials: [[1, 1], [2, .35], [3, .12]], k: 1.4, amp }), i * .05)); return o; };
const pad = (ms, d, amp = 1) => mixb(...ms.map((m, i) => tone(d, t => note(m) * (1 + .002 * Math.sin(t * 5 + i)), { e: env.swell(1.2, 1.5), amp: amp / ms.length })));
// a plucked veena string: a bright, buzzing pluck with a little bend
const pluck = (m, d = 1.1, amp = 1) => lp(tone(d, t => note(m) * (1 + .004 * Math.exp(-t * 6)), { type: 'saw', e: env.pluck(4.5), amp }), 2600);
const strum = (ms, gap = .05, amp = 1) => { const o = new Float32Array(Math.round((ms.length * gap + 1.4) * SR)); ms.forEach((m, i) => add(o, pluck(m, 1.2, amp), i * gap)); return o; };
// a little tune on the veena: [start, midi]
const veena = (ns, amp = 1) => { const o = new Float32Array(Math.round((Math.max(...ns.map(n => n[0])) + 1.4) * SR)); for (const [s, m] of ns) add(o, pluck(m, 1.0, amp), s); return o; };
const doorBell = (m = 88) => mixb(bell(note(m), 1.4, { partials: [[1, 1], [2.76, .35], [5.4, .12]], k: 2.0, amp: 1 }), bell(note(m + 7), 1.0, { amp: .4 }));
const swish = (amp = 1) => noise(.28, { lp: 4200, hp: 900, e: env.hann(), amp });
const pour = (d, amp = 1) => mixb(noise(d, { lp: 2400, hp: 300, e: env.swell(.1, .2), amp }), gurgle(d * .8, amp * .4));
const crackle = (d, amp = 1) => { const o = new Float32Array(Math.round(d * SR)); for (let k = 0; k < d * 14; k++) add(o, click(amp * (.3 + Math.random() * .7)), Math.random() * d); return mixb(o, noise(d, { lp: 900, hp: 100, e: env.swell(.2, .3), amp: amp * .4 })); };
const moo = (amp = 1) => lp(tone(1.1, t => 120 + 30 * Math.sin(Math.PI * clamp(t / 1.0)), { type: 'saw', e: env.swell(.15, .4), amp }), 700);

// ---- A + B: Narad over Dwarka
T.at(0, drone(C0, 110, .5), .06, 0);
T.at(.1, strum([62, 66, 69, 74], .06, 1), .2, -.3);
T.at(1.65, voice([[0, .45, 1.0, .4]], NAR, { fall: -.15 }), .18, 0);              // "hmmm?"
for (let k = 0; k < 3; k++) T.at(2.6 + k * .4, plink(note(86 + k * 3)), .06, .5);
T.at(B0 - .2, whoosh(.8, 300, 2400), .25, 0);
for (let k = 0; k < 6; k++) T.at(SCRATCH + k * .16, noise(.08, { lp: 5000, hp: 1500, e: env.hann(), amp: .6 }), .12, .2);   // scratching his head
T.at(B0 + .5, voice([[0, .3, 1.0, .5], [.35, .25, 1.1, .5], [.7, .2, 1.0, .5], [1.0, .3, 1.25, .7], [1.4, .45, 1.4, .8]], NAR, { rise: .2 }), .28, 0);   // "one Krishna… HOW?!"
T.at(DIVE, whoosh(.7, 200, 5000), .45, 0);

// ---- C: Palace #1
T.at(C0 - .2, doorBell(88), .25, 0);
for (let k = 0; k < 6; k++) T.at(ENTER + .1 + k * .18, click(.4), .07, -.6 + k * .1);
for (let k = 0; k < 4; k++) T.at(C0 + .3 + k * .62, swish(1), .08, .5);                // the chamara
T.at(JUMP - .1, voice([[0, .2, 1.2, .8]], KRS, { rise: .4 }), .25, 0);               // "oh!"
T.at(JUMP, slide(.45, 300, 900, 1), .16, 0); T.at(LAND, thud(.8), .3, -.2); T.at(LAND + .02, pop(.6, .8), .15, -.2);
T.at(POUR + .1, pour(1.6, 1), .2, -.3);
T.at(POUR + .5, voice([[0, .25, 1.3, .8], [.3, .25, 1.2, .8]], NAR, { rise: .2 }), .2, -.4);   // flustered
T.at(HEAD + .2, shimmer(.8, [86, 90, 93, 98].map(note), 1, .07), .18, 0);
for (let k = 0; k < 4; k++) T.at(HEAD + .5 + k * .2, plink(note(93 + k * 2)), .07, .2);
T.at(HEAD + .4, voice([[0, .5, 1.1, .5]], NAR, { fall: -.2 }), .2, -.4);            // "aww"

// ---- D: Palace #2
T.at(D0 - .2, doorBell(91), .25, 0);
for (let k = 0; k < 5; k++) T.at(D0 + .3 + k * .22, click(.3), .06, -.6);               // tiptoe
for (let k = 0; k < 9; k++) T.at(ROLL + k * .055, click(.8), .2, .2 + k * .02);        // the dice
T.at(ROLL + .55, thud(.4), .15, .2);
T.at(ROLL + .6, chatter(4, QUEEN, .12, 1), .14, .5); T.at(ROLL + .7, voice([[0, .4, 1.1, .6]], KRS, { rise: .2 }), .14, 0);
T.at(LOOK + .1, voice([[0, .18, 1.1, .7], [.2, .14, 1.2, .7], [.38, .2, 1.3, .8], [.7, .16, 1.0, .6], [.9, .16, 1.05, .6], [1.1, .18, 1.1, .6], [1.32, .3, 1.35, .8]], KRS, { rise: .1 }), .3, .1);   // "Narad-ji! When did you arrive?"
T.at(TAKE, squeak(1800, 600, .2), .18, -.4); T.at(TAKE + .02, voice([[0, .3, 1.5, .9]], NAR, { rise: .3 }), .3, -.4);   // the yelp
for (let k = 0; k < 4; k++) T.at(TAKE + .05 + k * .1, whoosh(.1, 1500, 3500), .05, k % 2 ? -.2 : -.5);
T.at(BACK, voice([[0, .15, 1.2, .7], [.18, .15, 1.3, .7], [.36, .15, 1.2, .7], [.6, .3, 1.4, .8]], NAR), .25, -.4);

// ---- E: six doorways
for (let i = 0; i < 6; i++) {
  const t0 = E0 + i * EK;
  T.at(t0 - .05, whoosh(.3, 500, 4000), .22, i % 2 ? .3 : -.3);
  T.at(t0 + .05, doorBell([86, 88, 90, 91, 93, 95][i]), .2, 0);
  T.at(t0 + .25, voice([[0, .22, 1.2 + i * .06, .8]], NAR, { rise: .3 }), .18 + i * .02, -.5);   // the yelp, higher each time
}
T.at(E0 + .3, giggle(7, 1), .26, -.1); T.at(E0 + .9, giggle(6, 1, KID + 60), .22, .3);
T.at(E0 + EK + .5, pour(1.2, 1), .22, .1); T.at(E0 + EK + .6, voice([[0, .25, 1.1, .7], [.3, .25, 1.0, .7]], KRS), .14, .1);   // "brrr-ha"
T.at(E0 + 2 * EK + .1, crackle(1.9, 1), .22, -.2); T.at(E0 + 2 * EK + .3, voice([[0, 1.4, 1.0, .3]], KRS, { fall: 0 }), .08, .1);   // a chant
for (let k = 0; k < 3; k++) { T.at(E0 + 3 * EK + .2 + k * .55, swish(1.4), .22, .3); T.at(E0 + 3 * EK + .45 + k * .55, clang(1400, .5), .12, .3); }
T.at(E0 + 4 * EK + .3, moo(1), .14, .4); T.at(E0 + 4 * EK + .9, voice([[0, .3, 1.0, .4], [.35, .4, .95, .4]], SAGE), .14, .6);
T.at(E0 + 5 * EK + .1, pad([50, 57, 62], 2.1, 1), .2, 0); T.at(E0 + 5 * EK + .2, bell(note(62), 2.2, { partials: [[1, 1], [2.4, .5], [4.1, .25]], k: 1.2, amp: 1 }), .2, 0);

// ---- F: the wall of windows; the counter
T.at(F0, chord([74, 78, 81, 86], 2, 1), .2, 0);
for (let k = 0; k < 22; k++) { const q = k / 21; T.at(F0 + .3 + 2.4 * Math.cbrt(q), click(.6), .12, (k % 3 - 1) * .4); }
T.at(F0 + 2.75, ting(96, 1), .25, 0); T.at(F0 + 2.75, shimmer(.6, [88, 91, 96].map(note), 1, .06), .15, 0);

// ---- G: the laugh; the teaching
T.at(G0 + .1, voice(Array.from({ length: 9 }, (_, i) => [i * .17, .12, 1.25 - i * .02, .8]), NAR), .3, -.3);
T.at(G0 + 1.8, voice(Array.from({ length: 6 }, (_, i) => [i * .16, .12, 1.15 - i * .02, .8]), NAR), .26, -.3);
T.at(TEACH, chord([62, 69, 74, 78], 3, 1), .18, 0);
T.at(TEACH + .1, voice([[0, .2, 1.0, .4], [.25, .2, .95, .4], [.5, .3, 1.05, .4], [.9, .2, 1.0, .4], [1.15, .25, .95, .4], [1.45, .4, 1.0, .4], [2.0, .5, .9, .3]], KRS, { fall: .05 }), .22, .3);
T.at(TEACH + .5, shimmer(1.4, [79, 83, 86, 91].map(note), 1, .06), .12, .3);

// ---- H: the queens
T.at(H0, chord([67, 71, 74, 79], 2.5, 1), .2, 0);
for (let k = 0; k < 4; k++) T.at(H0 + .3 + k * .2, plink(note(91 + k * 2)), .1, [-.5, .5, -.5, .5][k]);
T.at(H0 + 1.6, voice([[0, .6, 1.2, .5]], QUEEN, { fall: .2 }), .12, -.3); T.at(H0 + 2.1, voice([[0, .6, 1.1, .5]], QUEEN + 30, { fall: .2 }), .1, .3);   // "aww"
T.at(H0 + 3.0, pad([62, 66, 69, 74], 2.6, 1), .12, 0);

// ---- I: the walk-off song; the wink
T.at(I0, veena([[0, 74], [.35, 76], [.7, 78], [1.05, 81], [1.6, 78], [1.95, 76], [2.3, 74], [2.9, 76], [3.25, 78], [3.6, 74]], 1), .16, 0);
T.at(I0 + .2, voice([[0, .4, 1.0, .5], [.45, .4, 1.06, .5], [.9, .6, 1.12, .5], [1.6, .4, 1.06, .5], [2.1, .7, 1.0, .5]], NAR, { fall: 0 }), .12, 0);   // "Narayana, Narayana"
T.at(WINK, ting(98, 1), .25, 0); T.at(WINK + .05, pop(.6, 1.4), .15, 0);
T.at(CARD - .35, whoosh(.6, 300, 2400), .3, 0);

// ---- the card
T.at(CARD, chord([72, 76, 79, 84], 2, 1), .2, 0);
T.at(CARD + .5, plink(note(86)), .15, 0);
T.at(FOLLOW, plink(note(84)), .2, 0); T.at(PILL, pop(.9, 1.1), .25, 0); T.at(PILL + .1, ting(91, 1), .14, 0);
T.at(56.2, giggle(5, 1, 450), .18, -.1);

T.write('assets/palaces_sfx.wav');
