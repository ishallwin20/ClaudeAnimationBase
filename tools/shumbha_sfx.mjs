// shumbha_sfx.mjs: the sound effects for "A DEMON KING proposed to MAA DURGA" (src/scenes/shumbha.js) →
// assets/shumbha_sfx.wav. Times are the scene's constants (keep them in sync). The signatures: a love-struck "ahh" and
// heart pops (the proposal), the scroll rattling down the mountain and SNAPPING back, the one-word "HUM" (a deep
// bell + a shockwave), Kali's streak and landing, the BONK, the shaktis' rising bells into her heart, the BLAZE.
import { track, tone, noise, bell, mixb, env, whoosh, rumble, plink, clang, click, thud, crackle, crunch, crinkle, shimmer, slide, drone, note, seed, rnd, clamp, SR } from './sfx.mjs';

const WHIP = 2.4, B0 = 4.6;
const MEET = 4.75, ELE = 7.5, TRUMPET = 8.2, C0 = 10.2;
const SPY = 10.3, POPUP = 10.6, JAW = 11.5, REPORT = 12.7, EXCEPT = 13.9, HEARTS = 14.2, D0 = 16.0;
const PROP = 16.1, UNROLL = 16.6, CHOICE = 18.4, SNORT = 19.3, SURE = 20.7, FINGER = 21.0, COND = 22.7, MARRY = 23.7, GULP = 24.4, SNAP = 25.4, E0 = 26.6;
const GEN = 26.7, ONE = 29.1, HUM = 30.6, ASH = 30.85, ASHCAP = 31.9, SHERRUN = 33.9, F0 = 36.2;
const CM = 36.3, DARK = 37.2, BURST = 38.3, KLAND = 38.7, KALI = 38.9, BONK = 40.0, CHAMU = 41.0, G0 = 43.3;
const RB = 43.3, RBPOP = 44.2, NISH = 45.4, FLING = 46.0, H0 = 47.5;
const CHEAT = 47.6, ALONE = 50.0, MERGE = 50.5, ALLME = 51.2, BLAZE = 51.9, ONE1 = 53.0, DROP = 53.2, STRIKE = 53.6, TW = 54.6, I0 = 55.3;
const ASK = 55.4, GARL = 55.7, WIPE = 58.5;
const CARD = 58.8, CARD_CAP = 58.9, COVERS = 59.1, PRICE = 59.9, LOGO = 60.2, PILL = 60.5, FOLLOW = 60.9, END = 63.3;

const T = track(END);
seed(14);
const lp = (b, fc) => { let l = 0; const a = 1 - Math.exp(-2 * Math.PI * fc / SR); for (let i = 0; i < b.length; i++) { l += a * (b[i] - l); b[i] = l; } return b; };
const add = (o, b, s0, g = 1) => { const s = Math.round(s0 * SR); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j] * g; return o; };
// a buzzy cartoon voice (from ad 10): syllables [start, dur, pitch ×, brightness 0..1]
function voice(syl, f0, { amp = 1, growl = 0, fall = .1 } = {}) {
  const D = Math.max(...syl.map(([s, d]) => s + d)) + .1, o = new Float32Array(Math.round(D * SR));
  let ph = 0, l = 0;
  for (let i = 0; i < o.length; i++) {
    const t = i / SR, s = syl.find(([a, d]) => t >= a && t < a + d);
    if (!s) { l *= .995; o[i] = 0; continue; }
    const [a, d, pm, br] = s, k = (t - a) / d, e = clamp(k / .12) * clamp((1 - k) / .25);
    ph += f0 * pm * (1.04 - fall * k) * (1 + .01 * Math.sin(t * 40) + growl * .03 * Math.sin(t * 190)) / SR;
    const x = 2 * (ph - Math.floor(ph)) - 1, fc = 500 + br * 2200 * Math.sin(Math.PI * clamp(k * 1.3)), al = 1 - Math.exp(-2 * Math.PI * fc / SR);
    l += al * (x * e - l); o[i] = l * amp;
  }
  return o;
}
const ting = (m, amp = 1) => bell(note(m), 1.2, { amp });
const poof = (amp = 1) => noise(.4, { lp: 1800, hp: 150, e: env.ad(.01, .1), amp });
const boing = (amp = 1, f = 1) => tone(.45, t => f * (300 + 500 * Math.sin(Math.PI * clamp(t / .3))) * (1 + .08 * Math.sin(t * 2 * Math.PI * 22)), { type: 'tri', e: env.ad(.005, .15), amp });
const impactBoom = (amp = 1) => mixb(thud(amp), crunch(amp * .5), noise(.5, { lp: 900, hp: 40, e: env.ad(.005, .18), brown: true, amp: amp * .9 }), clang(note(55), amp * .25));
const pop = (amp = 1, f = 1) => mixb(click(amp), tone(.07, t => f * (500 + 2600 * t / .07), { e: env.pluck(40), amp: amp * .7 }), noise(.05, { lp: 2500, hp: 300, e: env.pluck(60), amp: amp * .5 }));
const laugh = (n, f0, amp = 1) => voice(Array.from({ length: n }, (_, i) => [i * .17, .12, 1 - i * .04, .7]), f0, { amp, growl: 1.2 });
const roar = (d, f0, amp = 1) => mixb(lp(tone(d, t => f0 * (1 + .3 * Math.sin(Math.PI * t / d)), { type: 'saw', e: env.swell(.05, .25), fm: t => .5 * Math.sin(t * 2 * Math.PI * 33), amp }), 900), noise(d, { lp: 1400, hp: 120, e: env.swell(.05, .25), amp: amp * .5 }));
const sigh = (f, amp = 1) => voice([[0, .7, 1.25, .5]], f, { amp, fall: .35 });   // the love-struck "ahhh"
const heartPop = (m, amp = 1) => mixb(pop(amp * .6, 1.3), plink(note(m), amp));
const gallop = (d, amp = 1) => { const o = new Float32Array(Math.round((d + .3) * SR)); for (let k = 0; k * .16 < d; k++) add(o, thud(amp * (k % 2 ? .6 : 1)), k * .16 + (k % 2) * .05); return o; };
const humBell = (amp = 1) => mixb(bell(note(38), 3.0, { k: 1.6, amp }), bell(note(50), 2.4, { k: 2.2, amp: amp * .5 }), voice([[0, .55, 1, .35]], 110, { amp: amp * .5, fall: .05 }), noise(1.2, { lp: 600, hp: 30, e: env.ad(.01, .5), brown: true, amp: amp * .7 }));
const rattle = (d, amp = 1) => { const o = new Float32Array(Math.round((d + .2) * SR)); for (let k = 0; k * .055 < d; k++) add(o, click(amp * (.6 + rnd() * .4)), k * .055 + rnd() * .015); return mixb(o, noise(d, { hp: 900, lp: 5000, e: env.swell(.05, .2), amp: amp * .25 })); };

// ---- A: the hook: the love-struck sigh, heart pops; the whip; "LEGENDARY"
T.at(0, drone(B0, 62, .4), .1, 0);
T.at(.15, sigh(170, 1), .35, 0);
[.6, 1.3, 1.9].forEach((d, i) => T.at(d, heartPop(84 + i * 3, .8), .22, .3));
T.at(WHIP - .12, whoosh(.35, 600, 3500), .4, .4);
T.at(WHIP + .45, mixb(click(.6), plink(note(91))), .3, -.2);   // the eyebrow goes up
T.at(WHIP + .5, ting(96), .25, 0);
T.at(B0 - .3, whoosh(.6, 400, 2500), .3, 0);

// ---- B: stolen heaven: gold, the gem counting, Airavata's sad little trumpet
T.at(B0, shimmer(1.4, [76, 79, 83, 88].map(note), .5, .1), .2, 0);
for (let k = 0; k < 6; k++) T.at(B0 + .3 + k * .9, mixb(click(.5), plink(note(93))), .14, -.6);   // the gems
T.at(MEET + .2, laugh(5, 120), .25, 0);
T.at(TRUMPET, slide(.7, 520, 320, 1), .3, .5); T.at(TRUMPET + .1, tone(.6, t => 380 - 120 * t, { type: 'saw', e: env.swell(.05, .3), amp: .4 }), .15, .5);
T.at(C0 - .15, whoosh(.3, 700, 3800), .35, -.3);

// ---- C: the spies pop up; jaws drop; the report; HEARTS
T.at(POPUP, boing(.7, 1.1), .25, -.6); T.at(POPUP + .18, boing(.7, 1.35), .22, -.3);
T.at(JAW, mixb(slide(.3, 900, 300, 1), click(.5)), .25, -.5); T.at(JAW + .1, slide(.3, 1100, 350, 1), .2, -.3);
T.at(REPORT - .1, whoosh(.3, 700, 3800), .35, .3);
T.at(REPORT + .1, voice([[0, .14, 1.1, .8], [.18, .14, 1.0, .8], [.36, .18, 1.2, .9], [.7, .14, 1.05, .8], [.88, .2, 1.15, .9]], 210, { amp: 1 }), .22, -.5);
T.at(EXCEPT, voice([[0, .14, 1.2, .9], [.18, .3, 1.35, .9]], 230, { amp: 1 }), .26, .5);
T.at(HEARTS, mixb(boing(.6, 1.6), sigh(160, .8)), .3, 0);
[.25, .5, .75].forEach((d, i) => T.at(HEARTS + d, heartPop(86 + i * 3, .8), .2, .1));
T.at(D0 - .3, whoosh(.6, 400, 2500), .3, 0);

// ---- D: the proposal: the scroll rolls down the mountain; Sher snorts; the finger; the condition; SNAP, bonk
T.at(PROP, bell(note(72), 1.2, { amp: .6 }), .15, .3);
T.at(UNROLL, rattle(1.1, 1), .3, .5); T.at(UNROLL, whoosh(1.1, 300, 1400), .2, .6);
T.at(UNROLL + 1.1, thud(.5), .25, .7);
T.at(SNORT, mixb(noise(.25, { lp: 1200, hp: 200, e: env.ad(.01, .1), amp: 1 }), laugh(4, 140, .8)), .3, -.8);
T.at(SNORT + .7, laugh(4, 150, .7), .22, -.8);
T.at(FINGER, mixb(click(.6), plink(note(88))), .3, -.3);
T.at(COND, shimmer(1.0, [79, 83, 86].map(note), .4, .1), .12, -.3);
T.at(MARRY, ting(96), .28, -.3);
T.at(GULP, mixb(tone(.12, t => 300 - 900 * t, { type: 'tri', e: env.pluck(20), amp: 1 }), click(.4)), .35, .4);
T.at(SNAP, mixb(whoosh(.2, 1500, 5000), rattle(.2, .8)), .35, .5);
T.at(SNAP + .2, mixb(clang(note(64), .6), boing(.8, 1.2)), .32, .4);
T.at(SNAP + .5, voice([[0, .4, 1.5, 1]], 260, { amp: 1, fall: .2 }), .2, .6);   // "eep!"
for (let k = 0; k < 5; k++) T.at(SNAP + .5 + k * .1, click(.4), .14, .6 + k * .06);
T.at(E0 - .3, whoosh(.6, 400, 2500), .3, 0);

// ---- E: Dhumralochana and 60,000; HUM; ash; Sher's charge
T.at(E0, noise(ONE - E0, { lp: 900, hp: 60, e: env.swell(.4, .4), brown: true, amp: 1 }), .12, .3);   // the army marching
for (let k = 0; k < 10; k++) T.at(E0 + .1 + k * .24, thud(.35), .12, .5);
T.at(GEN + .9, laugh(6, 105, 1), .35, .4);
T.at(GEN + 1.2, mixb(laugh(5, 150, .6), laugh(5, 180, .5)), .18, .7);   // the army laughs along
T.at(ONE + .2, noise(1.1, { lp: 1600, hp: 300, e: env.swell(.5, .2), amp: 1 }), .14, -.3);   // a breath in
T.at(HUM, humBell(1), .6, -.2);
T.at(HUM, whoosh(.8, 200, 1800), .3, 0);
T.at(ASH, mixb(poof(1), crackle(.6, .6)), .45, .4);
T.at(ASH + .6, plink(note(91)), .2, .4); T.at(ASH + 1.6, plink(note(91)), .16, .4);   // the ash blinks
T.at(SHERRUN, roar(.9, 110, 1), .35, -.6);
T.at(SHERRUN + .1, gallop(1.8, 1), .3, 0);
T.at(SHERRUN + .3, noise(1.6, { lp: 2600, hp: 300, e: env.swell(.2, .5), amp: 1 }), .14, .5);   // the army scatters
T.at(SHERRUN + .4, mixb(voice([[0, .3, 1.6, 1]], 240), voice([[.1, .3, 1.8, 1]], 280)), .2, .7);
T.at(F0 - .15, whoosh(.3, 700, 3800), .35, 0);

// ---- F: Chanda and Munda charge; Maa darkens; the streak; KALI; BONK
T.at(CM, mixb(roar(.8, 130, .8), gallop(.8, .5)), .3, .6);
T.at(DARK, drone(1.2, 46, 1), .25, -.4);
T.at(DARK + .5, bell(note(40), 1.5, { k: 2, amp: .7 }), .25, -.4);
T.at(BURST, mixb(whoosh(.5, 800, 6000), crackle(.5, .8)), .45, 0);
T.at(KLAND, impactBoom(1), .55, .3); T.at(KLAND + .05, rumble(.8, .8), .3, .3);
T.at(KLAND + .25, roar(1.0, 150, 1), .4, .3);
T.at(KLAND + .4, mixb(tone(.12, t => 300 - 900 * t, { type: 'tri', e: env.pluck(20), amp: 1 }), tone(.12, t => 380 - 900 * t, { type: 'tri', e: env.pluck(20), amp: .8 })), .3, .5);
T.at(BONK, mixb(clang(note(70), .8), boing(.9, 1.4), crunch(.5)), .45, .5);
for (let k = 0; k < 4; k++) T.at(BONK + .15 + k * .1, plink(note(90 + k * 2)), .14, .4);
T.at(BONK + .9, mixb(thud(.6), thud(.4)), .3, .5);
T.at(CHAMU, shimmer(1.5, [74, 79, 83, 86].map(note), .6, .12), .25, 0);
T.at(G0 - .15, whoosh(.3, 700, 3800), .35, 0);

// ---- G: Raktabija (a tongue wag, POP), Nishumbha (the trishul, the fling, the twinkle)
T.at(RB + .2, slide(.3, 400, 800, .8), .14, -.2);
T.at(RB + .4, voice([[0, .12, 1.8, 1], [.16, .12, 1.9, 1]], 250), .2, .4);   // eep eep
T.at(RBPOP, pop(1, 1.4), .45, .4);
T.at(NISH - .15, whoosh(.3, 700, 3800), .35, 0);
T.at(NISH + .2, roar(.6, 120, .7), .25, .5);
T.at(FLING - .2, whoosh(.25, 900, 4500), .3, -.2);
T.at(FLING, impactBoom(.9), .45, .3);
T.at(FLING + .1, slide(.8, 400, 1600, 1), .2, .5);
T.at(FLING + .9, ting(100), .3, .5);
T.at(H0 - .3, whoosh(.6, 300, 2000), .3, 0);

// ---- H: CHEAT!; "I am ALONE"; the shaktis fly in; BLAZE; the strike; the twinkle
T.at(H0, drone(BLAZE - H0, 49, 1), .16, 0);
T.at(CHEAT, voice([[0, .18, 1.2, 1], [.22, .35, 1.4, 1]], 150, { amp: 1, growl: 1.5 }), .45, .5);
T.at(CHEAT + .9, voice([[0, .14, 1.1, .9], [.17, .14, 1.05, .9], [.34, .14, 1.15, .9], [.51, .3, 1.3, 1]], 150, { amp: 1, growl: 1.2 }), .35, .5);
T.at(ALONE, shimmer(1.2, [62, 69, 74].map(note), .5, .2), .2, -.2);
T.at(MERGE, slide(.4, 300, 1200, 1), .2, -.6);
T.at(MERGE + .35, mixb(ting(84), poof(.4)), .25, -.3);
for (let i = 0; i < 7; i++) T.at(MERGE + .7 + i * .14, ting(86 + i * 2, .8), .22, -.5 + i * .12);
T.at(BLAZE, mixb(whoosh(1.0, 300, 6000), bell(note(50), 2.5, { k: 1.5, amp: .8 }), crackle(1.0, .5)), .5, 0);
T.at(BLAZE + .05, shimmer(1.8, [74, 79, 86, 91, 98].map(note), .6, .08), .25, 0);
T.at(DROP, mixb(tone(.14, t => 280 - 900 * t, { type: 'tri', e: env.pluck(18), amp: 1 }), click(.4)), .35, .5);
T.at(STRIKE - .2, whoosh(.25, 900, 5000), .35, 0);
T.at(STRIKE, impactBoom(1), .6, .3); T.at(STRIKE + .05, rumble(.8, .7), .3, .3);
T.at(STRIKE + .1, slide(1.0, 380, 1700, 1), .22, .5);
T.at(TW, ting(101), .35, .5);

// ---- I: the garland falls on Sher; Maa laughs; the ask
T.at(I0, mixb(plink(note(84)), shimmer(.6, [88, 91].map(note), .4, .05)), .2, 0);
T.at(I0 + .05, slide(.4, 1400, 600, .8), .15, .3);
T.at(GARL, mixb(crinkle(.3, .8), thud(.3)), .3, .3);
T.at(GARL + .2, mixb(boing(.6, 1.7), sigh(200, .6)), .25, .3);
[.4, .6].forEach((d, i) => T.at(GARL + d, heartPop(88 + i * 3, .8), .2, .4));
T.at(GARL + .3, voice([[0, .12, 1.3, .8], [.15, .12, 1.25, .8], [.3, .12, 1.2, .8], [.45, .16, 1.15, .8]], 300, { amp: .9 }), .2, -.3);   // Maa laughs
T.at(ASK, shimmer(2.8, [79, 83, 86, 91].map(note), .7, .2), .12, 0);
T.at(ASK + .7, mixb(click(.6), plink(note(91))), .25, 0);
T.at(WIPE, whoosh(.6, 400, 3000), .35, 0);

// ---- the card
T.at(LOGO, plink(note(84)), .25, 0);
[0, .12, .24].forEach((d, i) => T.at(COVERS + d, plink(note(86 + i * 3)), .28, -.4 + i * .4));
T.at(PRICE, ting(96), .3, 0);
T.at(PILL, mixb(click(1), plink(note(91))), .35, 0);
T.at(FOLLOW, shimmer(1.5, [84, 88, 91, 96].map(note), .4, .15), .2, 0);

T.write('assets/shumbha_sfx.wav');
