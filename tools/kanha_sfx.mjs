// kanha_sfx.mjs: the sound effects for "Every mom says OPEN YOUR MOUTH" (src/scenes/kanha.js) → assets/kanha_sfx.wav.
// Times are the scene's constants (keep them in sync). The signatures: the mud squelch and the chewing, the caught
// freeze, the boys' gasp and patter, Maa's anklets and her scolding, the "nuh-uh", the long "aaaa", the dive into his
// mouth, the cosmic bells, the bansuri over Gokul, the heartbeat, the temple bell, the maya sparkle, the "mwah".
import { track, tone, noise, bell, mixb, env, whoosh, rumble, plink, clang, click, thud, crunch, shimmer, slide, drone, gurgle, squeak, note, seed, clamp, SR } from './sfx.mjs';

const EAT = .5, CAUGHT = 2.7, B0 = 3.6, LICK = 4.4, GIGGLE = 5.4;
const C0 = 6.4, PEEK = 6.8, RUN = 7.6, TELL = 8.9;
const D0 = 11.2, STORM = 11.3, GRAB = 12.5, WAG = 13.6;
const E0 = 16.2, SHAKE = 16.4, POINT = 19.2;
const F0 = 22.6, HANDIN = 22.8, OPEN = 23.8, GLOWIN = 24.4, DIVE = 24.7;
const G0 = 25.6, PLANETS = 26.0, EARTH = 29.0, GOKUL = 32.2, SELF = 35.0;
const H0 = 38.0, DREAM = 38.1, BOW = 40.8;
const I0 = 43.6, CLOSE = 43.8, MAYA = 44.2, FORGET = 45.4, SCOOP = 46.4, HUG = 47.3;
const J0 = 50.2, WINK = 51.0, WIPE = 53.5;
const CARD = 53.8, FOLLOW = 54.4, PILL = 54.9, END = 57.6;

const T = track(END);
seed(7);
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
const BABY = 450, BOY = 360, MAA = 255;
const chatter = (n, f, gap = .13, amp = 1) => voice(Array.from({ length: n }, (_, i) => [i * gap, gap * .75, 1 + .12 * Math.sin(i * 2.3), .6]), f, { amp });
const giggle = (n = 5, amp = 1, f = BABY) => voice(Array.from({ length: n }, (_, i) => [i * .11, .08, 1.15 - i * .03, .8]), f, { amp });
const ting = (m, amp = 1) => bell(note(m), 1.2, { amp });
const pop = (amp = 1, f = 1) => mixb(click(amp), tone(.07, t => f * (500 + 2600 * t / .07), { e: env.pluck(40), amp: amp * .7 }), noise(.05, { lp: 2500, hp: 300, e: env.pluck(60), amp: amp * .5 }));
const chirp = (f = 1, amp = 1) => mixb(tone(.07, t => f * (3000 + 1800 * Math.sin(t * 90)), { e: env.hann(), amp }), tone(.06, t => f * (3600 - 9000 * t), { e: env.hann(), amp: amp * .7 }));
const squelch = (amp = 1) => mixb(gurgle(.25, amp), lp(noise(.2, { lp: 900, hp: 80, e: env.pluck(18), amp }), 700));
const chew = (amp = 1) => lp(crunch(amp), 1800);
const moo = (amp = 1) => lp(tone(1.1, t => 120 + 30 * Math.sin(Math.PI * clamp(t / 1.0)), { type: 'saw', e: env.swell(.15, .4), amp }), 700);
const jingle = (amp = 1) => shimmer(.25, [note(100), note(103), note(98)], amp, .03);
const chord = (ms, d = 2, amp = 1) => { const o = new Float32Array(Math.round((d + 1) * SR)); ms.forEach((m, i) => add(o, bell(note(m), d, { partials: [[1, 1], [2, .35], [3, .12]], k: 1.4, amp }), i * .05)); return o; };
const pad = (ms, d, amp = 1) => mixb(...ms.map((m, i) => tone(d, t => note(m) * (1 + .002 * Math.sin(t * 5 + i)), { e: env.swell(1.2, 1.5), amp: amp / ms.length })));
const heartbeat = (amp = 1) => mixb(lp(tone(.18, t => 60 * Math.exp(-t * 5) + 40, { e: env.pluck(12), amp }), 300), (() => { const o = new Float32Array(Math.round(.5 * SR)); add(o, lp(tone(.15, t => 55 * Math.exp(-t * 5) + 38, { e: env.pluck(12), amp: amp * .7 }), 300), .22); return o; })());
// a bansuri: a breathy sine with vibrato; notes [start, dur, midi]
function flute(notes, amp = 1) {
  const D = Math.max(...notes.map(([s, d]) => s + d)) + .4, o = new Float32Array(Math.round(D * SR));
  for (const [s, d, m] of notes) {
    add(o, tone(d + .15, t => note(m) * (1 + .006 * Math.sin(t * 2 * Math.PI * 5.5) * clamp(t / .3)), { e: env.swell(.06, .12), amp }), s);
    add(o, noise(d + .1, { lp: 3500, hp: 900, e: env.swell(.05, .1), amp: amp * .12 }), s);
  }
  return o;
}

// ---- A + B: the courtyard, the mud
T.at(0, drone(C0, 98, .5), .07, 0);
for (const [tt, f, p] of [[.3, 1, -.6], [.48, 1.1, -.6], [2.0, .95, .6], [4.8, 1.05, -.5], [5.9, 1, .6]]) T.at(tt, chirp(f), .06, p);
T.at(1.6, moo(1), .08, .7);
T.at(EAT + .2, squelch(1), .35, 0);
for (let k = 0; k < 8; k++) T.at(EAT + .4 + k * .24, chew(.8), .16, 0);
T.at(EAT + .5, voice([[0, .5, 1.0, .3]], BABY, { fall: -.1 }), .12, 0);          // "mmm"
T.at(CAUGHT, squeak(1600, 700, .18), .18, 0); T.at(CAUGHT + .02, ting(93, 1), .22, .2);
T.at(B0 + .15, mixb(tone(.3, t => 300 * Math.exp(-t * 7) + 60, { e: env.ad(.01, .12), amp: 1 }), pop(.5, .6)), .35, 0);   // gulp
T.at(LICK, slide(.25, 500, 1100, 1), .1, 0); T.at(LICK + .3, slide(.2, 600, 1200, 1), .08, 0);
T.at(GIGGLE, giggle(6, 1), .3, 0);

// ---- C: the snitch
T.at(C0 - .25, whoosh(.45, 400, 5000), .45, .3);
T.at(PEEK, voice([[0, .22, 1.2, .8]], BOY, { rise: .3 }), .25, .3); T.at(PEEK + .06, voice([[0, .2, 1.3, .8]], BOY + 60, { rise: .3 }), .2, .5); T.at(PEEK + .1, voice([[0, .22, 1.1, .8]], BOY - 40, { rise: .3 }), .2, .1);
for (let k = 0; k < 11; k++) T.at(RUN + k * .11, click(.6), .12, .2 + k * .03);
T.at(RUN + .5, jingle(1), .08, .7);
T.at(TELL, chatter(8, BOY, .13, 1), .3, .3); T.at(TELL + .05, chatter(6, BOY + 50, .15, 1), .18, .5);
T.at(TELL + 1.3, voice([[0, .18, 1.0, .5], [.22, .3, 1.25, .6]], MAA, { rise: .2 }), .3, .6);   // "hm?!"

// ---- D: Maa storms over, grabs his hand, scolds
for (let k = 0; k < 4; k++) { T.at(STORM + .1 + k * .28, thud(.5), .25, .5 - k * .25); T.at(STORM + .12 + k * .28, jingle(1), .1, .5 - k * .25); }
T.at(GRAB, pop(1, .9), .25, -.2); T.at(GRAB + .1, voice([[0, .14, 1.4, .9]], BABY), .25, -.3);   // "eep!"
T.at(WAG, voice([[0, .2, 1.0, .5], [.25, .2, 1.1, .5], [.5, .3, 1.2, .6], [.95, .2, 1.0, .5], [1.2, .35, 1.25, .6]], MAA), .3, .3);
for (let k = 0; k < 8; k++) T.at(WAG + .2 + k * .23, click(.5), .08, .4);
T.at(WAG + .4, voice([[0, .3, 1.0, .3]], BABY, { fall: .3 }), .12, -.3);   // a nervous whimper

// ---- E: "who, ME?"
T.at(E0 + .1, voice([[0, .15, 1.0, .6], [.2, .15, .9, .6], [.45, .2, 1.1, .6], [.7, .15, 1.0, .6], [.9, .25, 1.2, .7]], BABY), .3, 0);
for (let k = 0; k < 4; k++) T.at(SHAKE + k * .2, whoosh(.12, 1500, 3500), .05, k % 2 ? .3 : -.3);
T.at(E0 + 1.4, chatter(6, BABY, .14, 1), .26, 0);
T.at(POINT, ting(96, 1), .2, 0); T.at(POINT + .3, chatter(7, BABY, .13, 1), .26, 0);
T.at(POINT + 1.6, voice([[0, .25, 1.1, .7]], BABY, { rise: .3 }), .2, 0);

// ---- F: OPEN; the dive
T.at(HANDIN, whoosh(.4, 300, 1500), .15, .5); T.at(HANDIN + .4, jingle(1), .08, .5);
T.at(F0 + .5, voice([[0, .4, 1.15, .6]], MAA), .28, .4);    // "Open!"
T.at(OPEN, voice([[0, 1.5, 1.0, .5]], BABY, { fall: -.05 }), .3, 0);   // "aaaaaa"
T.at(GLOWIN, shimmer(1.2, [84, 88, 91, 96, 100].map(note), 1, .1), .2, 0);
T.at(DIVE, whoosh(1.0, 200, 7000), .5, 0); T.at(DIVE + .2, rumble(1.0, .6), .2, 0);

// ---- G: the universe
T.at(G0, pad([50, 57, 62, 66], 12.5, 1), .22, 0);
T.at(G0, chord([74, 78, 81, 86], 3, 1), .25, 0);
for (const [tt, m, p] of [[PLANETS, 88, -.5], [PLANETS + .5, 93, .5], [PLANETS + 1.0, 86, -.3], [PLANETS + 1.05, 90, .4], [PLANETS + 1.4, 95, .2], [PLANETS + 1.45, 83, -.5]]) T.at(tt, ting(m, 1), .18, p);
T.at(EARTH, rumble(1.6, .8), .25, 0); T.at(EARTH + .1, whoosh(1.4, 150, 1200), .25, 0);
T.at(EARTH + 1.6, whoosh(1.6, 300, 6000), .35, 0);
T.at(GOKUL, chime(note(86)), .2, 0);
T.at(GOKUL + .3, flute([[0, .5, 74], [.5, .3, 76], [.8, .6, 78], [1.4, .3, 81], [1.7, .9, 78]], 1), .2, 0);
for (const [tt, p] of [[GOKUL + .4, -.5], [GOKUL + .6, -.5], [GOKUL + 1.9, .6]]) T.at(tt, chirp(1), .05, p);
T.at(GOKUL + 1.2, moo(1), .07, .5);
T.at(SELF, shimmer(.8, [86, 90, 93, 98].map(note), 1, .06), .22, 0);
T.at(SELF + .6, whoosh(2.2, 200, 2500), .15, 0);
function chime(f) { return bell(f, 2, { partials: [[1, 1], [2.76, .4], [5.4, .15]], k: 2.2, amp: 1 }); }

// ---- H: awe; the bow
T.at(H0, chord([62, 69, 74, 78], 3, 1), .25, 0);
for (let k = 0; k < 3; k++) T.at(DREAM + .3 + k * .9, heartbeat(1), .35, 0);
T.at(DREAM + .2, noise(1.6, { lp: 1200, hp: 200, e: env.swell(.3, .8), amp: 1 }), .05, 0);   // a trembling breath
T.at(BOW, bell(note(62), 4, { partials: [[1, 1], [2.4, .5], [4.1, .25], [6.2, .1]], k: 1.2, amp: 1 }), .3, 0);
T.at(BOW + .1, pad([50, 57, 62], 2.8, 1), .15, 0);

// ---- I: she forgets; the hug
T.at(I0 - .45, whoosh(.9, 300, 2800), .25, 0);
T.at(CLOSE, pop(.8, 1.1), .2, -.2); T.at(CLOSE + .1, giggle(7, 1), .32, -.2);
T.at(MAYA, shimmer(1.2, [79, 83, 86, 88, 91, 95, 98, 100].map(note), 1, .12), .22, 0);
T.at(FORGET, ting(91, 1), .18, .3);
T.at(FORGET + .4, voice([[0, .3, 1.0, .4], [.35, .4, 1.15, .4]], MAA, { fall: -.1 }), .2, .3);   // "mm? oh, my Kanha"
T.at(SCOOP, whoosh(.5, 300, 2000), .25, 0); T.at(SCOOP + .2, voice([[0, .5, 1.1, .7]], BABY, { rise: .4 }), .25, -.2);   // "wheee"
T.at(HUG, pop(.7, 1.6), .25, 0); T.at(HUG + .05, chord([67, 71, 74, 79], 2.5, 1), .22, 0);   // mwah
T.at(HUG + .3, giggle(6, 1), .28, -.2);
T.at(HUG + .6, flute([[0, .4, 79], [.4, .4, 78], [.8, .4, 76], [1.2, .9, 74], [2.2, .4, 76], [2.6, 1.0, 78]], 1), .18, 0);
for (let k = 0; k < 3; k++) T.at(HUG + .3 + k * .5, plink(note(91 + k * 2)), .08, .3);

// ---- J: the wink, the wipe
T.at(WINK, ting(98, 1), .25, -.3); T.at(WINK + .1, giggle(4, 1), .25, -.3);
T.at(WIPE - .05, whoosh(.6, 300, 2400), .3, 0);

// ---- the card
T.at(CARD, chord([72, 76, 79, 84], 2, 1), .2, 0);
T.at(CARD + .5, plink(note(86)), .15, 0);
T.at(FOLLOW, plink(note(84)), .2, 0); T.at(PILL, pop(.9, 1.1), .25, 0); T.at(PILL + .1, ting(91, 1), .14, 0);
T.at(56.2, giggle(5, 1), .18, -.1);

T.write('assets/kanha_sfx.wav');
