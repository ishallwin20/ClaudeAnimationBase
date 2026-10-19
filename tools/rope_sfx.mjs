// rope_sfx.mjs: the sound effects for "The rope was ALWAYS two fingers short" (src/scenes/rope.js) → assets/rope_sfx.wav.
// Times are the scene's constants (keep them in sync). The signatures: the churn's slosh and Maa's humming, the boil-over
// hiss, the smash, the monkeys' chitter, the chase (little feet, anklets), the wail, the rope snapping short with a
// "ting" every time, the gopis' laughter, the soft chord when the rope closes, the bansuri, the trees' crash, the devas.
import { track, tone, noise, bell, mixb, env, whoosh, rumble, plink, clang, click, thud, crunch, shimmer, slide, drone, gurgle, squeak, note, seed, clamp, SR } from './sfx.mjs';

const B0 = 3.6, WALKIN = 3.8, GRABROD = 4.9, LIFT = 5.3, BOIL = 6.0, PUTDOWN = 6.9, RUNOFF = 7.2;
const C0 = 8.4, STONE = 9.3, SMASH = 10.2, BUTTER = 11.0, SCURRY = 11.7;
const D0 = 12.6, MAAIN = 12.7, SEE = 13.6, HIPS = 14.2, PAN = 15.3;
const E0 = 18.6, SPOT = 19.2, JUMP = 19.5, CATCH = 23.4;
const F0 = 24.6, THROW = 26.6;
const G0 = 28.6, WRAP1 = 29.0, GAP1 = 30.0, ADD = 31.6, WRAP2 = 32.2, GAP2 = 33.0, MANY = 34.6, GOPIS = 35.0, TIRED = 37.6;
const H0 = 40.6, CLOSE = 41.4, DAMODAR = 43.4;
const I0 = 46.0, STUCK = 48.0, CRASH = 48.4, DEVAS = 49.0;
const J0 = 51.4, WINK = 52.4;
const CARD = 54.6, FOLLOW = 55.2, PILL = 55.7, END = 58.4;

const T = track(END);
seed(5);
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
const BABY = 450, MAA = 255, GOPI = 290, MONK = 700, DEVA = 210;
const chatter = (n, f, gap = .13, amp = 1) => voice(Array.from({ length: n }, (_, i) => [i * gap, gap * .75, 1 + .12 * Math.sin(i * 2.3), .6]), f, { amp });
const giggle = (n = 5, amp = 1, f = BABY) => voice(Array.from({ length: n }, (_, i) => [i * .11, .08, 1.15 - i * .03, .8]), f, { amp });
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


const squelch = (amp = 1) => mixb(gurgle(.25, amp), lp(noise(.2, { lp: 900, hp: 80, e: env.pluck(18), amp }), 700));
const jingle = (amp = 1) => shimmer(.25, [note(100), note(103), note(98)], amp, .03);
const smash = (amp = 1) => mixb(lp(noise(.5, { lp: 6000, hp: 400, e: env.pluck(7), amp }), 5000), thud(amp), crunch(amp * .8), clang(900, amp * .3));
const chitter = (n = 6, amp = 1) => voice(Array.from({ length: n }, (_, i) => [i * .07, .05, 1 + .2 * Math.sin(i * 3), 1]), MONK, { amp });
const ropeSnap = (amp = 1) => mixb(noise(.12, { lp: 3000, hp: 600, e: env.pluck(30), amp }), click(amp));
const creak = (d, amp = 1) => lp(tone(d, t => 90 + 40 * Math.sin(t * 9) + 20 * Math.sin(t * 31), { type: 'saw', e: env.swell(.1, .2), amp }), 900);
const flute = (notes, amp = 1) => { const D = Math.max(...notes.map(([s, d]) => s + d)) + .4, o = new Float32Array(Math.round(D * SR)); for (const [s, d, m] of notes) { add(o, tone(d + .15, t => note(m) * (1 + .006 * Math.sin(t * 2 * Math.PI * 5.5) * clamp(t / .3)), { e: env.swell(.06, .12), amp }), s); add(o, noise(d + .1, { lp: 3500, hp: 900, e: env.swell(.05, .1), amp: amp * .12 }), s); } return o; };

// ---- A: the hook
T.at(0, drone(C0, 98, .5), .06, 0);
T.at(.2, shimmer(1, [86, 90, 93].map(note), 1, .06), .14, 0);
T.at(.6, giggle(5, 1), .22, 0);
for (let k = 0; k < 3; k++) T.at(1.4 + k * .6, ting(93 + k * 2, 1), .1, (k - 1) * .4);

// ---- B: churning; the milk boils over
for (let k = 0; k < 9; k++) T.at(B0 + .1 + k * .45, mixb(squelch(.6), noise(.12, { lp: 1600, hp: 200, e: env.hann(), amp: .5 })), .12, .2);
T.at(B0 + .2, voice([[0, .4, 1.0, .4], [.45, .4, 1.06, .4], [.9, .6, 1.12, .4]], MAA, { fall: 0 }), .1, .2);   // humming
for (let k = 0; k < 6; k++) T.at(WALKIN + k * .18, click(.4), .07, -.4 + k * .06);
T.at(GRABROD, voice([[0, .25, 1.2, .8], [.3, .3, 1.3, .8]], BABY, { rise: .2 }), .25, 0);   // "Maa! milk!"
T.at(LIFT, whoosh(.4, 300, 1800), .15, 0); T.at(LIFT + .3, voice([[0, .4, 1.1, .6]], BABY, { rise: .3 }), .18, 0);
T.at(BOIL - .1, mixb(gurgle(1.8, 1), noise(1.8, { lp: 2500, hp: 600, e: env.swell(.4, .3), amp: .6 })), .2, .6);   // the hiss of the boil-over
T.at(BOIL + .2, voice([[0, .25, 1.3, .9]], MAA, { rise: .3 }), .28, .3);   // "oh no!"
for (let k = 0; k < 5; k++) { T.at(RUNOFF + .1 + k * .2, thud(.4), .2, .4 + k * .1); T.at(RUNOFF + .12 + k * .2, jingle(1), .07, .4 + k * .1); }
T.at(PUTDOWN + .1, voice([[0, .5, 1.0, .5]], BABY, { fall: .3 }), .2, -.2);   // "awww"

// ---- C: the stone; the smash
T.at(C0 + .5, voice([[0, .25, .9, .5], [.3, .35, .85, .5]], BABY, { fall: .2 }), .2, 0);   // "hmph"
T.at(STONE, mixb(click(.6), thud(.3)), .2, 0);
T.at(SMASH - .25, whoosh(.25, 600, 3000), .2, .1);
T.at(SMASH, smash(1), .6, .1); T.at(SMASH + .05, rumble(.5, .4), .2, 0);
T.at(SMASH + .4, voice([[0, .14, 1.3, .8]], BABY), .2, 0);   // "oops"
T.at(BUTTER, squelch(.8), .25, 0); T.at(BUTTER + .2, giggle(6, 1), .26, 0);
for (let k = 0; k < 6; k++) T.at(SCURRY + .05 + k * .12, click(.5), .1, -.2 - k * .1);

// ---- D: Maa sees; the monkeys
for (let k = 0; k < 4; k++) { T.at(MAAIN + k * .28, thud(.4), .2, .6 - k * .1); T.at(MAAIN + .02 + k * .28, jingle(1), .07, .6 - k * .1); }
T.at(SEE, squeak(1500, 700, .2), .15, .3); T.at(SEE + .05, voice([[0, .4, 1.3, .9]], MAA, { rise: .3 }), .3, .3);   // gasp
T.at(HIPS, voice([[0, .3, 1.0, .5], [.35, .3, 1.1, .5]], MAA), .22, .3);   // "Kanha!"
T.at(PAN, whoosh(.6, 400, 2500), .2, -.3);
T.at(PAN + .5, chitter(8, 1), .2, -.5); T.at(PAN + 1.4, chitter(6, 1), .18, .4); T.at(PAN + 2.2, chitter(7, 1), .18, -.5);
for (let k = 0; k < 4; k++) T.at(PAN + .6 + k * .7, squelch(.5), .12, k % 2 ? .4 : -.4);
T.at(PAN + 1.0, voice([[0, .15, 1.2, .7], [.2, .15, 1.1, .7], [.4, .2, 1.25, .7]], BABY), .14, 0);   // "here, have some"

// ---- E: the stick; the chase
T.at(E0 + .2, mixb(whoosh(.3, 500, 2600), click(.5)), .25, -.5);
T.at(SPOT, ting(96, 1), .2, 0); T.at(SPOT + .05, voice([[0, .25, 1.5, .9]], BABY, { rise: .3 }), .3, 0);   // "eek!"
T.at(SPOT + .1, chitter(10, 1), .25, -.2);
T.at(JUMP, slide(.3, 500, 1000, 1), .14, 0); T.at(JUMP + .35, thud(.5), .25, 0);
for (let k = 0; k < 18; k++) T.at(JUMP + .4 + k * .2, click(.45), .1, -.2 + k * .04);
for (let k = 0; k < 13; k++) { T.at(E0 + .5 + k * .36, thud(.45), .22, -.5 + k * .08); T.at(E0 + .52 + k * .36, jingle(1), .06, -.5 + k * .08); }
T.at(JUMP + .6, voice([[0, .25, 1.1, .6], [.35, .3, 1.15, .6]], MAA), .22, -.2);   // "Kanha! stop!"
T.at(21.6, shimmer(1, [86, 90, 93, 98].map(note), 1, .07), .14, 0);
T.at(CATCH, pop(1, .9), .3, .3); T.at(CATCH + .05, voice([[0, .2, 1.4, .9]], BABY), .25, .3);

// ---- F: tears; the stick goes
T.at(F0 + .1, voice([[0, .8, 1.2, .8], [.9, .9, 1.3, .9], [1.9, .6, 1.2, .8]], BABY, { fall: .15 }), .32, .1);   // waaah
for (let k = 0; k < 4; k++) T.at(F0 + .3 + k * .45, noise(.18, { lp: 1200, hp: 200, e: env.hann(), amp: .7 }), .08, .1);   // sniffs
T.at(F0 + 1.0, voice([[0, .6, 1.0, .3]], MAA, { fall: .2 }), .12, .4);   // a soft sigh
T.at(THROW, whoosh(.5, 400, 3000), .25, .6); T.at(THROW + .6, thud(.4), .15, .8);
T.at(THROW + .4, plink(note(86)), .1, .2);

// ---- G: the ropes
T.at(WRAP1, whoosh(.9, 300, 1500), .15, 0); T.at(WRAP1 + .3, creak(.7, 1), .08, 0);
T.at(GAP1 - .05, ropeSnap(1), .25, 0); T.at(GAP1, ting(93, 1), .25, 0); T.at(GAP1 + .1, squeak(900, 1500, .2), .12, 0);
T.at(GAP1 + .3, voice([[0, .3, 1.2, .8]], MAA, { rise: .3 }), .22, .3);   // "huh?!"
T.at(GAP1 + .5, giggle(4, 1), .18, 0);
T.at(ADD + .3, mixb(click(.6), noise(.2, { lp: 2000, hp: 300, e: env.hann(), amp: .5 })), .15, .5);
T.at(WRAP2, whoosh(.8, 300, 1500), .15, 0); T.at(WRAP2 + .3, creak(.6, 1), .08, 0);
T.at(GAP2 - .05, ropeSnap(1), .25, 0); T.at(GAP2, ting(95, 1), .25, 0);
T.at(GAP2 + .3, voice([[0, .25, 1.2, .8], [.3, .3, 1.35, .8]], MAA, { rise: .3 }), .22, .3);
T.at(GAP2 + .5, giggle(5, 1), .2, 0);
for (let k = 0; k < 8; k++) { T.at(MANY + .2 + k * .33, whoosh(.2, 600, 2400), .1, (k % 2 ? .3 : -.3)); T.at(MANY + .35 + k * .33, ropeSnap(.7), .14, 0); }
for (let k = 0; k < 4; k++) T.at(MANY + .4 + k * .7, ting(91 + (k % 2) * 2, 1), .1, 0);
T.at(GOPIS + .3, voice(Array.from({ length: 8 }, (_, i) => [i * .15, .1, 1.3 - i * .02, .8]), GOPI), .2, .7);
T.at(GOPIS + 1.4, voice(Array.from({ length: 7 }, (_, i) => [i * .14, .1, 1.4 - i * .02, .8]), GOPI + 40), .16, .8);
T.at(TIRED, voice([[0, .9, 1.0, .3]], MAA, { fall: .25 }), .16, .2);   // a tired breath
for (let k = 0; k < 4; k++) T.at(TIRED + .3 + k * .6, plink(note(98 - k * 3)), .06, -.2 + k * .15);   // flowers falling

// ---- H: he lets her
T.at(H0 + .5, voice([[0, .5, 1.1, .5]], BABY, { fall: -.1 }), .15, 0);
T.at(CLOSE, shimmer(1.2, [79, 83, 86, 91, 95].map(note), 1, .1), .22, 0);
T.at(CLOSE + .45, ropeSnap(.8), .2, 0); T.at(CLOSE + .5, chord([67, 71, 74, 79], 2.5, 1), .2, 0);
T.at(CLOSE + .9, voice([[0, .5, 1.15, .5]], MAA, { fall: .2 }), .16, .3);
T.at(DAMODAR, flute([[0, .4, 79], [.4, .4, 78], [.8, .4, 76], [1.2, .8, 74], [2.1, .4, 76]], 1), .16, 0);

// ---- I: the trees
for (let k = 0; k < 7; k++) T.at(I0 + .1 + k * .3, mixb(noise(.25, { lp: 600, hp: 60, e: env.hann(), amp: .6 }), click(.3)), .18, .1 + k * .05);   // the mortar scraping
T.at(STUCK, thud(.8), .3, .3); T.at(STUCK + .1, voice([[0, .3, 1.0, .6]], BABY, { fall: -.2 }), .2, .3);   // "nnngh"
T.at(CRASH - .2, creak(.3, 1), .14, 0);
T.at(CRASH, mixb(smash(1), rumble(1.4, 1)), .55, 0); T.at(CRASH + .2, rumble(1.2, .8), .35, -.3); T.at(CRASH + .3, noise(1.0, { lp: 2500, hp: 200, e: env.pluck(3), amp: 1 }), .2, .3);   // leaves
T.at(DEVAS - .2, shimmer(1.6, [74, 78, 81, 86, 90, 93].map(note), 1, .12), .24, 0);
T.at(DEVAS, pad([62, 66, 69, 74], 2.6, 1), .16, 0);
T.at(DEVAS + 1.3, voice([[0, .4, 1.0, .4], [.45, .5, 1.05, .4]], DEVA), .12, -.4); T.at(DEVAS + 1.4, voice([[0, .4, 1.1, .4], [.45, .5, 1.15, .4]], DEVA + 30), .1, .4);

// ---- J: the ask
T.at(J0 + .1, giggle(6, 1), .24, 0);
T.at(WINK, ting(98, 1), .25, 0); T.at(WINK + .05, pop(.6, 1.4), .15, 0);
T.at(CARD - .35, whoosh(.6, 300, 2400), .3, 0);

// ---- the card
T.at(CARD, chord([72, 76, 79, 84], 2, 1), .2, 0);
T.at(CARD + .5, plink(note(86)), .15, 0);
T.at(FOLLOW, plink(note(84)), .2, 0); T.at(PILL, pop(.9, 1.1), .25, 0); T.at(PILL + .1, ting(91, 1), .14, 0);
T.at(57.0, giggle(5, 1), .18, -.1);

T.write('assets/rope_sfx.wav');
