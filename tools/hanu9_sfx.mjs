// hanu9_sfx.mjs: the sound for "The moment HANUMAN left, ARJUNA's chariot turned to ASH." (src/scenes/hanu9.js, ad 98,
// Hanuman Part 9, no voice) -> assets/hanu9_sfx.wav (then loudness-normalised to assets/hanu9_mix.wav). Times are the
// scene's constants (keep them in sync). Retro synth cartoon foley as in Parts 1-8: grove birds, Bhima's strain, the
// hug; a rock's thud; war drums and a conch for Kurukshetra; an arrow, a held beat, then the roar; a scuffle for the
// banners; slow wheels home; the reins dropping; a soft chime as he goes, half a second of nothing, then the blaze;
// two astra hits in the flashback. Music only as mild beds: warm pads under the brothers and Krishna's answer, a low
// drone under the camp, a music box under the ask.
import { track, tone, noise, bell, mixb, env, whoosh, plink, squeak, click, thud, shimmer, slide, chime, drum, note, seed, rnd, clamp, heart, rumble, chirp, wingbeat, laughter, om, SR } from './sfx.mjs';

const VAN0 = 2.4, IGN0 = 2.9;
const C0 = 4.6, D0 = 8.8, HUG = 10.1, E0 = 13.0, F0 = 17.8, G0 = 21.6, GONE = 26.1, H0 = 26.8, I0 = 31.4, ARW = 32.3, ROAR = 33.0, FRZ = 34.4;
const J0 = 36.4, LEAP = 37.8, BITE = 38.3, K0 = 41.4, L0 = 45.4, M0 = 50.4, HOP = 50.9, REINS = 52.4, DOWN = 53.0;
const N0 = 54.8, VAN = 57.2, B0 = 59.0, IGN = 59.5, O0 = 64.6, P0 = 68.8, HIT1 = 70.2, HIT2 = 71.2, Q0 = 74.0, LET = 77.4;
const R0 = 79.2, S0 = 84.8, T0 = 89.4, CARD = 92.2, END = 95.8;

const T = track(END);
seed(98);
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

const RAMF = 150, SUGF = 190, APSF = 380;
const coins = (t0, n = 5, pan = 0, amp = 1) => { for (let k = 0; k < n; k++) T.at(t0 + k * .09 + rnd() * .03, mixb(plink(note(96 + Math.floor(rnd() * 8)), .6 * amp), click(.3 * amp)), .08, pan + (rnd() - .5) * .4); };
const sob = (t0, f = 150, pan = 0, amp = .7) => T.at(t0, voice([[0, .22, 1.1, .4], [.26, .3, .9, .3]], f, { amp, fall: .3, shake: 1 }), .08, pan);
const buzz = (amp = 1) => mixb(tone(.28, 110, { type: 'saw', e: env.pluck(5), amp: amp * .6 }), tone(.28, 117, { type: 'saw', e: env.pluck(5), amp: amp * .5 }));
const hpop = (t0, pan = 0) => { for (let k = 0; k < 3; k++) T.at(t0 + k * .22, pop(800 + k * 120, .5), .07, pan); };
const sing = (t0, ms, f = APSF, pan = 0, amp = .8) => ms.forEach((m, i) => T.at(t0 + i * .42, voice([[0, .38, Math.pow(2, m / 12), .6]], f, { amp, fall: 0 }), .07, pan));
const step = (t0, n, gap = .22, pan = 0, amp = .5) => { for (let k = 0; k < n; k++) T.at(t0 + k * gap, mixb(click(amp), drum(60, amp * .6, .2)), .08, pan + k * .04); };

const BHIF = 125, KRSF = 165, ARJF = 185;
const roar = (amp = 1, d = 1.2) => mixb(voice([[0, d, 1, .9]], 150, { amp, fall: .25, shake: 1 }), voice([[0, d, 1, .7]], 76, { amp: amp * .8, fall: .2, shake: 1 }), noise(d, { hp: 200, lp: 2400, e: env.swell(.08, d * .7), amp: amp * .5 }));
const conch = (dur, amp = 1) => mixb(tone(dur, t => 233 * (1 + .12 * clamp(t / .5)), { type: 'tri', e: env.swell(.3, .6), amp }), tone(dur, t => 466 * (1 + .12 * clamp(t / .5)), { type: 'tri', e: env.swell(.4, .6), amp: amp * .3 }));
const fire = (dur, amp = 1) => mixb(noise(dur, { hp: 300, lp: 4200, e: env.swell(.15, dur * .7), amp }), noise(dur, { hp: 40, lp: 500, e: env.swell(.1, dur * .6), amp: amp * .8 }));
const crackle = (t0, dur, pan = 0, amp = .5) => { for (let t = t0; t < t0 + dur; t += .07 + rnd() * .1) T.at(t, click(amp * (.4 + rnd() * .6)), .06, pan + (rnd() - .5) * .5); };
const wheels = (t0, dur, pan = 0) => { for (let t = t0; t < t0 + dur; t += .3) { T.at(t, mixb(squeak(380, 330, .1, .25), thud(.2)), .05, pan); T.at(t + .15, click(.25), .04, pan + .2); } };
const hooves = (t0, dur, pan = .4, gap = .22) => { for (let t = t0; t < t0 + dur; t += gap) T.at(t, mixb(click(.5), drum(70, .3, .12)), .05, pan + (rnd() - .5) * .2); };

// ================= A · the hook: he waves, he is gone, the chariot is ash =================
T.at(0, drone(C0, .8), .07, 0);
T.at(.2, mixb(pop(1000, .7), giggle(HANU, .7, 4)), .1, -.3);
T.at(.3, shimmer(1.8, [note(88), note(93), note(96)], .6, .08), .07, -.3);
T.at(VAN0, mixb(noise(.4, { hp: 600, lp: 7000, e: env.pluck(8), amp: .7 }), slide(.4, 900, 300, .5), chime(note(93), .8, 1.4)), .13, -.3);
T.at(IGN0, mixb(boom(1), whoosh(1.2, 300, 3000, 1)), .18, 0);
T.at(IGN0, fire(1.6, .9), .13, 0); crackle(IGN0 + .1, 1.5, 0);
T.at(IGN0 + .3, mixb(pop(1100, .8), huh(170, .8)), .1, .4);
T.at(C0 - .3, whoosh(.6, 400, 3000), .13, 0);

// ================= C · the recap: the tail that would not move =================
T.at(C0, pad(D0 - C0, [62, 66, 69, 74], .8, .4, .6), .05, 0);
tweets(C0 + .1, 3.8, .2);
for (let k = 0; k < 4; k++) T.at(C0 + .4 + k * .95, mixb(strain(BHIF, .9, .6), squeak(260, 300, .3, .3)), .1, -.5);
T.at(C0 + 2.3, voice([[0, .7, 1.2, .4]], HANU * .8, { amp: .7, fall: .4 }), .08, .5);      // a yawn
T.at(C0 + 3.2, boing(.5, 180), .08, -.3);
T.at(D0 - .15, slide(.3, 500, 800, .3), .07, 0);

// ================= D · his elder brother: the hug =================
T.at(D0, pad(E0 - D0 + .3, [60, 64, 67, 72], 1, .6, .8), .07, 0);
T.at(D0 + .2, mixb(pop(1000, .8), huh(BHIF, .9)), .11, -.3);
T.at(D0 + .3, shimmer(1.2, [note(86), note(91), note(95)], .7, .08), .08, .3);
T.at(HUG, mixb(thud(.5), slide(.3, 400, 700, .4), chime(note(88), 1, 2.4)), .14, 0);
T.at(HUG, swell(E0 - HUG + .3, [60, 67, 72, 76, 79], 1), .12, 0);
hpop(HUG + .4, 0); hpop(HUG + 1.6, 0);
sob(HUG + .8, HANU * .8, .2, .5);

// ================= E · "shall I crush their city with a rock?" =================
T.at(E0 + .3, talk(1.2, HANU, { gap: .17, br: .6 }), .1, .4);
T.at(E0 + 1.5, mixb(thud(.8), squeak(200, 320, .2, .5), boing(.6, 160)), .12, .4);
T.at(E0 + 1.9, mixb(pop(900, .8), plink(note(88), .5)), .11, 0);
T.at(E0 + 2.1, talk(2.0, HANU, { gap: .17, br: .7 }), .1, .4);
T.at(E0 + 2.9, slide(.4, 900, 200, .5), .1, 0);
T.at(E0 + 3.3, mixb(boom(.6), click(.8)), .13, 0);
T.at(E0 + 3.4, mixb(pop(1100, .7), huh(BHIF, .9)), .11, -.4);

// ================= F · "with you protecting us, we will win" =================
T.at(F0, pad(G0 - F0 + .2, [57, 64, 69, 73], 1, .5, .7), .07, 0);
T.at(F0 + .3, talk(2.6, BHIF, { gap: .21, br: .5 }), .1, -.4);
T.at(F0 + 1.6, mixb(boing(.6, 300), giggle(HANU, .8, 5)), .1, .4);
hpop(F0 + 1.7, 0);

// ================= G · the promise; he vanishes =================
T.at(G0, pad(H0 - G0, [55, 62, 67, 71], 1, .6, .6), .07, 0);
T.at(G0 + .3, talk(3.9, HANU, { gap: .2, br: .6 }), .1, .4);
T.at(G0 + 1.3, mixb(pop(900, .8), plink(note(91), .5)), .11, 0);
for (let k = 0; k < 3; k++) T.at(G0 + 1.7 + k * .9, roar(.35, .5), .07, 0);
T.at(G0 + 2.4, mixb(boing(.5, 280), ooh(BHIF, .8)), .1, -.4);
T.at(GONE, mixb(noise(.4, { hp: 600, lp: 7000, e: env.pluck(8), amp: .7 }), slide(.4, 900, 300, .5), chime(note(93), .8, 1.4)), .13, .4);
T.at(GONE + .1, mixb(pop(1100, .8), huh(BHIF, .9)), .1, -.4);
T.at(H0 - .3, whoosh(.6, 400, 3000), .13, 0);

// ================= H · Kurukshetra =================
T.at(H0, conch(2.4, .8), .11, -.2);
warDrum(H0 + .2, I0, .45);
T.at(H0, drone(I0 - H0, .8), .07, 0);
hooves(H0 + .2, 4.2, .4, .3); wheels(H0 + .2, 4.2, 0);
T.at(H0 + 1.4, mixb(chime(note(88), 1, 2), shimmer(1.6, [note(88), note(93), note(96)], .7, .08)), .11, -.3);
T.at(H0 + 2.1, giggle(HANU, .6, 4), .08, -.3);

// ================= I · the arrow, the roar, the frozen army =================
warDrum(I0, ARW - .3, .35);
T.at(ARW - .35, arrowSnd(1), .13, .5);
T.at(ARW, mixb(thud(.7), click(1), tone(.5, t => 900 * Math.exp(-t * 2), { type: 'tri', e: env.pluck(7), amp: .4 })), .15, .2);
T.at(ARW + .05, mixb(pop(1100, .8), huh(HANU, .9)), .11, 0);
T.at(ROAR, mixb(roar(1.2, 1.3), boom(.8)), .2, 0);
T.at(ROAR + .1, rumble ? rumble(1.2, .6) : noise(1.2, { lp: 200, e: env.swell(.1, .8), amp: .6 }), .12, 0);
T.at(FRZ, mixb(click(.9), tone(1.8, note(96), { type: 'tri', e: env.swell(.02, 1.6), amp: .15 })), .1, 0);
for (let k = 0; k < 12; k++) T.at(FRZ + .2 + k * .11, click(.3), .05, (k % 3 - 1) * .5);                       // knees and teeth
T.at(FRZ + .3, voice([[0, .5, 1.3, .4]], 200, { amp: .6, fall: 0, shake: 1 }), .08, 0);
T.at(J0 - .3, whoosh(.5, 3000, 500), .11, 0);

// ================= J · the banners fight =================
warDrum(J0, LEAP, .45);
T.at(J0 + .7, voice([[0, .4, 1, .8]], HANU * .7, { amp: .8, fall: .1, shake: 1 }), .1, -.4);                   // a growl
T.at(LEAP, mixb(whoosh(.5, 600, 4000, 1), boing(.8, 240)), .14, 0);
T.at(BITE, mixb(slap(1), boom(.5)), .16, .4);
for (let k = 0; k < 9; k++) { const t = BITE + .15 + k * .3; T.at(t, mixb(k % 2 ? slap(.6) : thud(.6), squeak(500 + rnd() * 500, 300, .08, .5)), .1, .4 + (rnd() - .5) * .3); if (k % 3 === 0) T.at(t + .1, roar(.4, .35), .08, .4); }
for (let k = 0; k < 6; k++) T.at(BITE + .4 + k * .42, plink(note(98 + Math.floor(rnd() * 6)), .5), .07, .6);    // the rope's bells
T.at(K0 - .3, whoosh(.7, 2000, 300), .11, 0);

// ================= K · day 18: back to camp =================
T.at(K0, drone(L0 - K0, 1), .08, 0);
T.at(K0 + .1, conch(2.0, .5), .08, .3);
hooves(K0 + .1, 3.8, .3, .42); wheels(K0 + .1, 3.8, -.1);
T.at(K0 + 1.7, voice([[0, .7, 1.2, .4]], HANU * .8, { amp: .6, fall: .4 }), .07, -.3);
tweets(K0 + 2.4, 1.2, -.4);

// ================= L · "get down first" =================
T.at(L0, pad(M0 - L0, [57, 64, 69], .9, .6, .7), .06, 0);
T.at(L0, mixb(squeak(340, 300, .25, .3), thud(.4)), .08, 0);
T.at(L0 + .3, talk(4.0, KRSF, { gap: .22, br: .5 }), .1, .2);
T.at(L0 + 2.7, mixb(pop(1100, .7), huh(ARJF, .8)), .1, -.3);

// ================= M · Arjuna down; the reins; Krishna down =================
T.at(M0, drone(N0 - M0, .7), .07, 0);
T.at(HOP, mixb(slide(.35, 500, 300, .4), whoosh(.3, 1500, 600, .5)), .09, -.2);
T.at(HOP + .45, mixb(thud(.7), click(.5)), .12, -.5);
T.at(REINS, mixb(noise(.3, { hp: 800, lp: 5000, e: env.pluck(10), amp: .5 }), slide(.4, 600, 250, .4)), .1, .4);
T.at(REINS + .5, thud(.4), .08, .4);
T.at(DOWN, mixb(slide(.35, 600, 350, .4), whoosh(.3, 1500, 600, .5)), .09, 0);
T.at(DOWN + .45, mixb(thud(.8), bell(note(62), 2.2, { k: 1.6 })), .14, -.2);

// ================= N · he bows and is gone =================
T.at(N0, pad(VAN - N0 + .2, [60, 67, 72], .8, .8, .5), .06, 0);
T.at(N0 + 1.0, plink(note(91), .5), .07, 0);
T.at(N0 + 1.5, tone(VAN - N0 - 1.5, t => note(72) * (1 + .1 * t), { type: 'tri', e: env.swell(.5, .1), amp: .25 }), .08, 0);
T.at(VAN, mixb(chime(note(93), 1.1, 2.4), noise(.5, { hp: 800, lp: 8000, e: env.pluck(6), amp: .6 }), slide(.5, 1200, 400, .4)), .15, 0);
T.at(VAN + .1, shimmer(1.4, [note(88), note(93), note(96), note(100)], .7, .08), .09, 0);
// B0 … IGN: nothing at all

// ================= B · the blaze =================
T.at(IGN, mixb(boom(1.3), whoosh(1.4, 200, 3500, 1.2), drum(34, 1.2, 1.6)), .22, 0);
T.at(IGN, fire(3.0, 1), .15, .1); crackle(IGN + .1, 3.2, .2, .6);
T.at(IGN + .1, voice([[0, .5, 1.5, .8]], ARJF, { amp: .9, rise: .3, fall: 0, shake: 1 }), .11, -.5);
T.at(IGN + 1.0, slide(1.2, 500, 120, .5), .09, .2);
T.at(IGN + 1.6, noise(2.4, { hp: 1500, lp: 6000, e: env.swell(.3, 1.8), amp: .25 }), .07, .2);                 // ash hissing
T.at(IGN + 1.6, tone(3.2, note(96), { type: 'tri', e: env.swell(.05, 2.8), amp: .1 }), .06, 0);              // ringing
T.at(IGN + 1.7, drone(O0 - IGN - 1.7, .8), .07, 0);

// ================= O · "why did my chariot burn?" =================
T.at(O0, pad(P0 - O0, [57, 60, 64, 69], .9, .6, .6), .07, 0);
T.at(O0 + .7, talk(2.8, ARJF, { gap: .22, br: .4, fall: 0 }), .1, -.3);
T.at(O0 + 1.2, mixb(pop(900, .7), huh(ARJF, .7)), .09, 0);
crackle(O0, 4, .6, .25);
T.at(P0 - .3, whoosh(.6, 400, 3000), .12, 0);

// ================= P · long before: the astras =================
warDrum(P0, Q0 - .4, .45);
T.at(P0, drone(Q0 - P0, .9), .08, 0);
T.at(P0 + .3, talk(1.0, KRSF, { gap: .22, br: .5 }), .08, 0);
for (const [h, pan] of [[HIT1, -.2], [HIT2, -.3]]) {
  T.at(h - .45, mixb(arrowSnd(1), whoosh(.45, 800, 4000, .8), tone(.45, t => 500 + 1800 * t, { type: 'saw', e: env.swell(.1, .05), amp: .2 })), .13, pan);
  T.at(h, mixb(boom(1.1), slap(.7)), .2, .1);
  T.at(h + .05, fire(.9, .6), .1, .1); crackle(h + .1, .7, .1, .5);
}
T.at(HIT2 + .5, mixb(chime(note(84), .9, 2.4), shimmer(1.8, [note(81), note(88), note(93)], .6, .08)), .11, .1);   // it holds
T.at(Q0 - .3, whoosh(.5, 3000, 500), .11, 0);

// ================= Q · "because I sat on it… I let it go" =================
T.at(Q0, pad(R0 - Q0 + .3, [55, 62, 67, 71], 1, .8, .8), .08, 0);
T.at(Q0 + .3, talk(4.0, KRSF, { gap: .23, br: .5 }), .1, .3);
T.at(Q0 + .7, mixb(pop(900, .8), shimmer(2.4, [note(81), note(88), note(93)], .7, .07)), .1, 0);
T.at(LET, mixb(slide(.5, 800, 200, .5), noise(.6, { hp: 500, lp: 5000, e: env.pluck(5), amp: .5 }), thud(.5)), .13, 0);
T.at(LET + .3, voice([[0, .4, 1.1, .4]], ARJF, { amp: .6, fall: .3 }), .08, -.4);

// ================= R · a chariot of ash =================
T.at(R0, swell(S0 - R0 + .3, [60, 67, 72, 76, 79], 1), .13, 0);
T.at(R0 + .2, bell(note(60), 3, { k: 1.2 }), .1, 0);
crackle(R0, 5, .3, .2);
T.at(R0 + 1.8, mixb(chime(note(91), 1, 2.6), shimmer(2.2, [note(88), note(93), note(96), note(100)], .8, .08)), .12, .3);
T.at(R0 + 2.6, giggle(HANU, .6, 4), .08, .3);
hpop(R0 + 3.4, .3);

// ================= ask, next, card =================
{
  const TUNE = [0, 4, 7, 4, 9, 7, 4, 2, 0, 2, 4, 7, 4, 2, 0, -3];
  let i = 0;
  for (let t = S0 + .2; t < T0 - .2; t += .34) { const m = TUNE[i++ % TUNE.length]; T.at(t, musicBox(note(81 + m)), .08, i % 2 ? -.25 : .25); }
  T.at(S0, pad(T0 - S0, [57, 64, 69, 73], 1, .6, .8), .06, 0);
}
T.at(S0 + 1.4, mixb(pop(900, .8), huh(HANU, .6)), .1, .4);
hpop(S0 + 2.2, -.4);
T.at(T0, mixb(whoosh(.5, 3000, 400), slide(.6, 300, 900, .5)), .13, 0);
T.at(T0, pad(CARD - T0, [62, 69, 74, 78], 1, .3, .5), .07, 0);
T.at(T0 + .5, mixb(pop(1000, .9), chime(note(93), 1, 1.8)), .13, 0);
T.at(T0 + .7, shimmer(1.6, [note(88), note(93), note(96), note(100)], .7, .08), .09, 0);
T.at(CARD, whoosh(.4, 3000, 600), .14, 0);
[.3, .45, .6].forEach((d, i) => T.at(CARD + d, pop(600 + i * 100, .8), .14, -.4 + i * .4));
T.at(CARD + 1.0, chime(note(81), 1, 1.6), .14, 0); T.at(CARD + 1.6, mixb(pop(900, .8), plink(note(88), .8)), .14, 0);
T.at(CARD + 2.2, shimmer(1.2, [note(81), note(85), note(88), note(93)], .7, .09), .12, 0);

T.write('assets/hanu9_sfx.wav');
console.log('assets/hanu9_sfx.wav', END + ' s');
