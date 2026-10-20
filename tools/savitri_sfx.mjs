// savitri_sfx.mjs: the sound effects for "She OUTSMARTED YAMRAJ" (src/scenes/savitri.js) → assets/savitri_sfx.wav.
// Times are the scene's constants (keep them in sync). The signatures: Yama's low drone and gong, the buffalo's bell
// and snort, the forest birds, Narad's veena and pop, the axe chops and the drop, the noose's whoosh and snap, the
// soul's shimmer, the voices (a deep Yama, a bright Savitri, Narad), the bubble pops and tathastu sparkles, the
// record-scratch take, Yama's laugh, the homecoming chime, the yawn, the diya and the card.
import { track, tone, noise, bell, mixb, env, whoosh, rumble, plink, clang, click, thud, crunch, shimmer, slide, drone, gurgle, squeak, crackle, note, seed, clamp, SR } from './sfx.mjs';

const SIDE = 1.7, GULP = 2.6, B0 = 3.6;
const SEE = 4.2, WARN = 6.1, ONCE = 8.8, C0 = 11.0;
const CHOP1 = 11.55, CHOP2 = 12.25, HURT = 12.75, C2 = 13.8;
const RED = 15.6, YIN = 16.0, D0 = 18.4;
const THROW = 18.7, LOOP = 19.2, PULL = 19.7, TURNS = 21.2, RISE = 21.6, E0 = 23.4;
const GOBACK = 23.5, BOON = 26.0, F0 = 28.8;
const B1 = 28.8, B2 = 31.2, B3 = 33.6, G0 = 36.0;
const TATH = 38.8, TRAP = 40.4, TAKE = 41.6, H0 = 43.6;
const LET = 44.6, H2 = 46.0, LAND = 46.45, WAKE = 46.8, JOY = 47.3, I0 = 48.8;
const J0 = 52.2, WINK = 54.2, CARD = 55.6, END = 60.0;
const CAP_T = CARD + .1, COVERS = CARD + .4, PRICE = CARD + 1.2, STRIKE = CARD + 1.7, DEAD = CARD + 2.2, PILL = CARD + 2.7;

const T = track(END);
seed(24);
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
const YAMA = 95, SAV = 330, NAR = 240, SATY = 180;
const chatter = (n, f, gap = .13, amp = 1, br = .6) => voice(Array.from({ length: n }, (_, i) => [i * gap, gap * .75, 1 + .12 * Math.sin(i * 2.3), br]), f, { amp });
const pop = (amp = 1, f = 1) => mixb(click(amp), tone(.07, t => f * (500 + 2600 * t / .07), { e: env.pluck(40), amp: amp * .7 }), noise(.05, { lp: 2500, hp: 300, e: env.pluck(60), amp: amp * .5 }));
const chord = (ms, d = 2, amp = 1) => { const o = new Float32Array(Math.round((d + 1) * SR)); ms.forEach((m, i) => add(o, bell(note(m), d, { partials: [[1, 1], [2, .35], [3, .12]], k: 1.4, amp }), i * .05)); return o; };
const pluck = (m, d = 1.1, amp = 1) => lp(tone(d, t => note(m) * (1 + .004 * Math.exp(-t * 6)), { type: 'saw', e: env.pluck(4.5), amp }), 2600);
const strum = (ms, gap = .05, amp = 1) => { const o = new Float32Array(Math.round((ms.length * gap + 1.4) * SR)); ms.forEach((m, i) => add(o, pluck(m, 1.2, amp), i * gap)); return o; };
const gong = (f = 70, amp = 1) => mixb(bell(f, 3.5, { partials: [[1, 1], [1.5, .5], [2.1, .35], [2.9, .2]], k: 1.0, amp }), noise(.4, { lp: 600, e: env.pluck(8), amp: amp * .3 }));
const cowbell = (amp = 1) => bell(note(76), .5, { partials: [[1, 1], [2.4, .5], [3.6, .2]], k: 7, amp });
const chirp = (f, amp = 1) => mixb(squeak(f, f * 1.4, .07, amp), squeak(f * 1.3, f * 1.1, .06, amp * .7));
const step = (amp = 1) => noise(.07, { lp: 900, hp: 120, e: env.pluck(40), amp });
const snort = (amp = 1) => noise(.35, { lp: 1400, hp: 200, e: env.swell(.02, .25), amp });
const swish = (amp = 1) => noise(.28, { lp: 4200, hp: 900, e: env.hann(), amp });
const scratch = (amp = 1) => mixb(noise(.3, { lp: t => 4000 - t * 9000, hp: 400, e: env.swell(.01, .2), amp }), slide(.3, 900, 220, amp * .4));

// ---- A: Yama close
T.at(0, gong(62, 1), .5, 0);
T.at(0, drone(B0 + .3, 55, .6), .25, 0);
T.at(.1, rumble(B0, .4), .12, 0);
T.at(SIDE + .2, plink(note(91), .8), .25, .3);                 // the sweat drop
T.at(GULP, gurgle(.25, .9), .35, 0);                          // the gulp
T.at(B0 - .3, whoosh(.7, 400, 3200), .3, 0);

// ---- B: the forest; she chooses; Narad's warning
for (let k = 0; k < 9; k++) T.at(B0 + .3 + k * .8 + (k % 3) * .17, chirp(2600 + (k % 4) * 300, .7), .1, k % 2 ? .6 : -.6);
for (let k = 0; k < 5; k++) T.at(B0 + .1 + k * .3, step(.7), .12, .5);
T.at(SEE, chord([72, 76, 79, 84], 1.6, .8), .2, -.2);
T.at(WARN - .15, pop(1, 1.2), .35, 0);
T.at(WARN - .1, strum([62, 65, 69, 74], .05, 1), .22, 0);
T.at(WARN + .4, chatter(10, NAR, .14, 1, .7), .26, 0);
T.at(WARN + .6, slide(.8, 600, 300, .5), .1, 0);              // a falling warning
T.at(ONCE, thud(.8), .3, -.3);
T.at(ONCE + .15, chatter(9, SAV, .13, 1, .6), .24, -.3);
T.at(C0 - .3, whoosh(.7, 400, 3000), .28, 0);

// ---- C1: the last day: chops, the pain, the axe drops
T.at(C0, drone(C2 - C0, 98, .4), .1, 0);
for (const tc of [CHOP1, CHOP2]) { T.at(tc - .2, swish(.8), .25, .3); T.at(tc, mixb(thud(1), crunch(.8)), .5, .3); }
T.at(HURT, slide(.9, 320, 140, .8), .22, .2);
T.at(HURT + .1, voice([[0, .5, 1.0, .4]], SATY, { fall: .4 }), .25, .2);     // "ohh…"
T.at(HURT + .35, clang(note(70), .6), .2, .4);                 // the axe hits the ground
T.at(C2 - .15, whoosh(.3, 2000, 6000), .25, 0);

// ---- C2 + D: the lap; Yama comes; the noose; the soul; he walks, she follows
T.at(C2, chord([60, 63, 67], 2.5, .6), .12, 0);
T.at(RED - .2, rumble(2.8, 1), .35, .4);
T.at(RED, drone(E0 - RED, 49, .7), .3, .3);
T.at(YIN, whoosh(1.1, 3000, 300), .35, .5);
T.at(YIN + .9, gong(58, 1), .55, .4);
T.at(YIN + .5, snort(1), .2, .8);
T.at(YIN + 1.0, cowbell(.7), .14, .8);
T.at(THROW - .25, swish(1), .45, .3);
T.at(THROW, whoosh(.5, 600, 2400), .3, 0);
T.at(LOOP, mixb(click(1), thud(.4)), .4, -.1);
T.at(PULL, shimmer(1.2, [note(84), note(88), note(91), note(96), note(100)], .9, .1), .35, 0);
T.at(PULL + .2, voice([[0, .9, 1.0, .9]], SAV, { fall: .2 }), .3, -.3);     // Savitri's cry
for (let k = 0; k < 6; k++) { T.at(TURNS + .3 + k * .38, step(1), .22, .5 + k * .06); if (k % 2 === 0) T.at(TURNS + .5 + k * .38, cowbell(.6), .12, .8); }
for (let k = 0; k < 3; k++) T.at(RISE + .6 + k * .4, step(.7), .14, -.2);
T.at(E0 - .3, whoosh(.7, 300, 2600), .3, 0);

// ---- E · F · G: the road south
T.at(E0, drone(H2 - E0, 65, .5), .14, 0);
const walkEnd = TAKE;
for (let tt = E0 + .2; tt < walkEnd; tt += .62) { T.at(tt, step(.6), .14, .1); T.at(tt + .31, step(.45), .1, -.3); }
for (let tt = E0 + .4; tt < walkEnd; tt += 1.24) T.at(tt, cowbell(.5), .1, .6);
T.at(GOBACK + .05, voice([[0, .35, 1.0, .5], [.4, .5, .9, .6]], YAMA, { fall: .2 }), .5, .2);   // "Go BACK!"
T.at(E0 + 1.0, chatter(10, SAV, .14, 1, .6), .22, -.3);
T.at(BOON, voice([[0, .3, 1.0, .5], [.35, .25, 1.1, .5], [.65, .4, 1.0, .4]], YAMA, { fall: .1 }), .42, .2);
T.at(BOON + .2, chord([67, 71, 74], 1.4, .6), .14, .2);
for (const [b, i] of [[B1, 0], [B2, 1], [B3, 2]]) {
  T.at(b, chatter(5, SAV, .14, 1, .6), .18, -.3);
  T.at(b + .1, pop(1, 1), .35, 0);
  T.at(b + .45, shimmer(.8, [note(88), note(93), note(96)], .8, .07), .3, .2);
  if (i === 0) T.at(b + .9, mixb(plink(note(96)), plink(note(100), .7)), .3, 0);         // the eyes open
  if (i === 1) { T.at(b + .9, whoosh(.25, 3000, 800), .2, 0); T.at(b + 1.05, clang(note(84), .6), .25, 0); }   // the crown lands
  if (i === 2) for (let k = 0; k < 10; k++) T.at(b + .9 + k * .09, pop(.6, 1.4 + (k % 3) * .2), .16, (k % 2 ? .3 : -.3));   // the babies
  T.at(b + 2.15, pop(.6, .7), .2, 0);
}
T.at(G0 + .1, chatter(11, SAV, .14, 1, .65), .24, -.3);
T.at(TATH - .05, voice([[0, .25, 1.0, .5], [.27, .25, 1.05, .5], [.55, .6, .95, .4]], YAMA, { fall: .15 }), .4, .2);   // "ta-thas-tuuu"
T.at(TATH, shimmer(.9, [note(86), note(91), note(95), note(98)], .7, .07), .3, .2);
T.at(TRAP + .1, chatter(9, SAV, .15, 1, .55), .25, -.3);
T.at(TAKE, scratch(1), .5, 0);
T.at(TAKE + .02, plink(note(98), 1), .3, .2);
T.at(TAKE + .3, plink(note(91), .6), .2, .2);                  // the sweat
T.at(H0, voice([[0, .18, 1.0, .7], [.24, .18, 1.08, .7], [.48, .18, 1.15, .7], [.72, .2, 1.2, .8], [.98, .3, 1.1, .7]], YAMA, { fall: .05 }), .5, .2);   // HA HA HA
T.at(H0 + .3, chord([69, 73, 76, 81], 1.6, .5), .12, -.3);
T.at(LET, whoosh(.9, 500, 6000), .3, -.4);
T.at(LET + .1, shimmer(1.0, [note(88), note(91), note(95), note(100), note(103)], .8, .08), .3, -.5);

// ---- H2: home
T.at(H2 - .3, whoosh(.6, 600, 3000), .25, 0);
T.at(H2, shimmer(.5, [note(91), note(95), note(98)], .6, .1), .25, -.5);
T.at(LAND, mixb(chord([72, 76, 79, 84], 2, 1), plink(note(96))), .32, 0);
T.at(WAKE, voice([[0, .9, 1.0, .3]], SATY, { fall: .5 }), .28, .2);       // the yawn
T.at(JOY, chord([74, 78, 81, 86], 1.8, .8), .25, -.2);
T.at(JOY + .1, voice([[0, .15, 1.2, .8], [.18, .15, 1.3, .8], [.36, .3, 1.4, .9]], SAV, {}), .2, -.3);

// ---- I: Vat Savitri
T.at(I0 - .3, whoosh(.7, 400, 2800), .25, 0);
T.at(I0, bell(note(81), 2.2, { amp: 1 }), .2, 0);
T.at(I0 + 1.5, bell(note(81), 2.2, { amp: .7 }), .14, 0);
T.at(I0, crackle(J0 - I0, .5), .05, .4);
for (let k = 0; k < 7; k++) T.at(I0 + .2 + k * .45, chirp(2400 + (k % 3) * 400, .5), .07, k % 2 ? .6 : -.6);

// ---- J: Yama again, the wink
T.at(J0 - .3, whoosh(.7, 400, 3000), .25, 0);
T.at(J0, gong(62, .6), .3, 0);
T.at(J0, drone(CARD - J0, 55, .4), .14, 0);
T.at(WINK, mixb(plink(note(93)), click(.6)), .35, .1);
T.at(WINK + .05, voice([[0, .3, 1.0, .6]], YAMA, { rise: .3 }), .25, .1);   // "hm!"

// ---- K: the card
T.at(CARD - .3, whoosh(.7, 400, 3200), .3, 0);
T.at(CAP_T, chord([67, 71, 74, 79], 2.2, .7), .25, 0);
for (let k = 0; k < 3; k++) T.at(COVERS + k * .12, pop(.8, 1 + k * .15), .3, (k - 1) * .4);
T.at(PRICE, pop(.6, .9), .2, 0);
T.at(STRIKE, mixb(swish(.8), clang(note(88), .5)), .3, 0);
T.at(DEAD, plink(note(91)), .2, 0);
T.at(PILL, mixb(pop(1, 1.3), shimmer(.7, [note(91), note(95), note(98)], .6, .06)), .32, 0);

T.write('assets/savitri_sfx.wav');
console.log('assets/savitri_sfx.wav', END, 's');
