// parshu2_sfx.mjs: the sound for "PARSHURAMA fought a DEMON ARMY with NO WEAPONS" (src/scenes/parshu2.js, ad 68, no
// voice) → assets/parshu2_sfx.wav. Times are the scene's constants (keep them in sync). Retro synth cartoon foley over a
// mild tanpura bed: the hook's "?", dawn wind and birds, a damru and a choir pad as Shiva appears, the weapons' white-hot
// hiss and sparks, the time-lapse, Kailash's bell, thunder and demon stomps, the "huh?" shrug, the warm bell on "GO",
// silence and one knuckle crack before the brawl (thwacks, boings, a cymbal), the heal's harp, the gifts' chimes,
// silence then a taiko on the axe, three ticks and a big hit on the name.
import { track, tone, noise, bell, mixb, env, whoosh, plink, squeak, click, thud, shimmer, chime, drum, om, wind, whir, crackle, damru, thunder,
  laughter, note, seed, rnd, clamp, SR } from './sfx.mjs';

const B0 = 5.4;
const PRAY = 5.8, SHIVA_IN = 9.9, SAYS = 10.9, C0 = 15.5;
const HOT = 15.6, WARN = 16.0, D0 = 20.6;
const LAPSE = 20.8, E0 = 25.6;
const SMILE = 26.0, F0 = 31.0;
const STOMP = 31.0, SEND = 33.8, G0 = 36.0;
const SHRUG = 36.4, H0 = 41.5;
const GO = 41.9, I0 = 46.6;
const STRIDE = 46.6, BRAWL = 47.8, CLEAR = 50.2, J0 = 53.1;
const KNEEL = 53.2, TOUCH = 55.2, K0 = 58.6;
const GIFTS = 58.8, AXE_IN = 61.0, CATCH = 62.0, L0 = 64.6;
const N1 = 65.0, N2 = 66.2, NAME = 67.4, M0 = 70.6;
const ASK = 70.7, CARD = 74.3, END = 78.3;

const T = track(END);
seed(68);
// a buzzy cartoon voice: syllables [start, dur, pitch ×, brightness 0..1] (as in ads 59, 60 and 63)
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
const talk = (dur, f, { gap = .16, amp = 1, br = .5, fall = .1, shake = 0 } = {}) =>
  voice(Array.from({ length: Math.max(1, Math.floor(dur / gap)) }, (_, i) => [i * gap, gap * .72, 1 + .14 * Math.sin(i * 2.3) - (i % 5 === 4 ? .12 : 0), br]), f, { amp, fall, shake });
const RAMAV = 170, SHIVAV = 105, UMA = 260, DEMON = 75;
const pop = (f = 900, amp = 1) => mixb(squeak(f * .6, f * 1.6, .07, amp), plink(f * 1.5, amp * .5));
const add = (o, b, s0, g = 1) => { const s = Math.round(s0 * SR); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j] * g; return o; };
const lp = (b, fc) => { let l = 0; const a = 1 - Math.exp(-2 * Math.PI * fc / SR); for (let i = 0; i < b.length; i++) { l += a * (b[i] - l); b[i] = l; } return b; };
const tanpura = (dur, root = 50, amp = 1) => { const o = new Float32Array(Math.round((dur + 2.5) * SR)); const ns = [root + 7, root + 12, root + 12, root];
  for (let k = 0; k * .9 < dur; k++) add(o, lp(tone(2.4, note(ns[k % 4]), { type: 'saw', e: env.ad(.05, .9), amp }), 1400), k * .9, 1 - .5 * clamp((k * .9 - dur + 1.5) / 1.5)); return o; };
const pad = (dur, ms, amp = 1, a = 1.2, r = 1.4) => mixb(...ms.map((m, i) => tone(dur, t => note(m) * (1 + .003 * Math.sin(t * 2 + i)), { type: 'tri', e: env.swell(a, r), amp: amp / ms.length })));
const brass = (dur, ms, amp = 1, a = .08, r = .5) => mixb(...ms.map((m, i) => lp(tone(dur, t => note(m) * (1 + .004 * Math.sin(t * 30 + i)), { type: 'saw', e: env.swell(a, r), amp: amp / ms.length }), 2200)));
const harp = (f, amp = 1) => bell(f, 1.4, { partials: [[1, 1], [2, .35], [3, .12]], k: 3, amp });
const bird = (f, amp = 1) => mixb(squeak(f, f * 1.4, .07, amp), squeak(f * 1.3, f * 1.1, .06, amp * .7));
const clink = (amp = 1) => mixb(bell(note(96), .5, { partials: [[1, 1], [2.7, .4], [5.2, .2]], k: 9, amp }), click(amp * .5));
const thwack = (amp = 1) => mixb(noise(.08, { hp: 600, lp: 5000, e: env.pluck(50), amp }), tone(.12, t => 220 * Math.exp(-t * 18) + 90, { e: env.pluck(20), amp: amp * .8 }));
const boing = (f = 180, amp = 1) => tone(.45, t => f * (1 + .35 * Math.sin(t * 60) * Math.exp(-t * 6)), { type: 'tri', e: env.pluck(6), amp });
const cymbal = (amp = 1) => noise(1.2, { hp: 4000, lp: 12000, e: env.ad(.005, 1.1), amp });
const hiss = (dur, amp = 1) => noise(dur, { hp: 2400, lp: 9000, e: env.swell(.15, .3), amp });

// ================= beds =================
T.at(B0, tanpura(G0 - B0 - 1.0, 50, 1), .032, 0);                      // a mild tanpura under the tapas and Kailash
T.at(J0, tanpura(L0 - J0 - .5, 50, 1), .032, 0);                       // and again under the touch and the gifts
T.at(B0, wind(C0 - B0 + .4, 0, 1.2), .05, -.3);                         // dawn wind on the height
for (let t = B0 + .8; t < SHIVA_IN - .4; t += 1.6 + rnd()) T.at(t, bird(2600 + rnd() * 900, .5), .03, rnd() * 1.4 - .7);
T.at(G0, wind(I0 - G0, 1, .8), .04, .3);
T.at(I0, wind(J0 - I0, 2, .6), .05, 0);

// ================= A · the hook =================
T.at(.25, pop(1200, .8), .1, -.4);                                         // the "?" pops
T.at(.3, mixb(plink(note(84), .6), plink(note(79), .5)), .07, -.4);
T.at(1.0, tone(.6, t => 300 + 120 * Math.sin(t * 12), { type: 'tri', e: env.hann(), amp: .4 }), .05, -.4);   // a wobbling "hmm?"
T.at(4.9, mixb(squeak(500, 900, .12, .6), squeak(900, 600, .1, .4)), .07, 0);   // the glance and the little shrug
T.at(B0 - .3, whoosh(.6, 400, 3000), .2, 0);

// ================= B · tapas; Shiva answers =================
T.at(PRAY, om(SHIVA_IN - PRAY - .2, 120, .5), .06, -.3);                  // Rama chants
T.at(SHIVA_IN - .5, mixb(damru(240, 1), damru(260, .8)), .2, .3);
for (let k = 0; k < 8; k++) T.at(SHIVA_IN - .3 + k * .09, damru(250 + (k % 2) * 30, .7), .14, .3);   // a damru roll
T.at(SHIVA_IN, mixb(shimmer(1.4, [note(79), note(84), note(88), note(91)], .6, .1), pad(4.8, [62, 66, 69, 74], 1, .6, 1.4)), .1, .3);   // the light, a choir pad
T.at(SHIVA_IN + .4, whoosh(.8, 500, 2500), .1, .3);                       // the clouds part
T.at(SHIVA_IN + .6, pop(700, .6), .06, -.3);                               // Rama's eyes open
T.at(SAYS + .1, talk(3.6, SHIVAV, { gap: .2, br: .35, amp: .9 }), .11, .3);
T.at(C0 - .3, mixb(shimmer(.5, [note(96), note(100), note(103)], .6, .05), whoosh(.4, 1000, 5000)), .14, 0);   // the halo flares

// ================= C · the warning =================
T.at(HOT, mixb(hiss(4.6, 1), crackle(4.6, .5)), .07, .3);                   // white-hot: hissing, spitting
T.at(HOT, tone(4.8, t => 1320 + 30 * Math.sin(t * 7), { type: 'tri', e: env.swell(.4, .6), amp: .25 }), .05, .3);   // a cold glassy drone
for (let k = 0; k < 9; k++) T.at(HOT + .2 + k * .45 + rnd() * .2, mixb(click(.6), plink(3000 + rnd() * 1500, .3)), .05, .1 + rnd() * .6);   // sparks
T.at(HOT + .3, voice([[0, .3, 1.5, .8]], RAMAV, { rise: .4, amp: .8 }), .08, -.4);   // "whoa"
T.at(WARN + .1, talk(3.4, SHIVAV, { gap: .2, br: .35, amp: .8 }), .09, .2);
T.at(HOT + .9, squeak(1400, 1000, .2, .5), .04, -.4);                              // the sweat drop
T.at(D0 - .5, whoosh(.5, 3000, 300), .14, 0);                                       // the light dims shut

// ================= D · the years =================
T.at(LAPSE, whir(4.4, .8), .05, 0);
for (let k = 0; k < 30; k++) T.at(LAPSE + .1 + k * .15, click(.4), .04, k % 2 ? .3 : -.3);   // the days tick past
for (let k = 0; k < 4; k++) T.at(LAPSE + .3 + k * 1.1, chime(note([79, 84, 76, 81][k]), .5, 1.2), .05, 0);   // seasons
T.at(LAPSE + 1.2, wind(2.4, 3, .8), .06, .2);                                         // a snow wind
T.at(E0 - .35, whoosh(.5, 600, 5000), .25, 0);                                       // the whip-pan up

// ================= E · Kailash =================
T.at(E0 + .05, bell(note(74), 2.6, { k: 1.8 }), .1, 0);
T.at(E0 + .1, pad(5, [67, 71, 74, 79], 1, .5, 1.4), .05, 0);
T.at(SMILE + .1, talk(2.3, SHIVAV, { gap: .2, br: .4, amp: .9 }), .11, -.2);
T.at(SMILE + 1.6, voice([[0, .2, 1.2, .6], [.24, .3, 1.35, .6]], UMA, { amp: .7 }), .07, .3);   // Uma's warm "mm-hm"
T.at(SMILE + 1.7, mixb(pop(1000, .6), chime(note(96), .6, 1.4)), .08, .3);   // the heart

// ================= F · the demons; Shiva sends him =================
T.at(F0 - .05, thunder(2.6, 1), .4, .2);
for (let k = 0; k < 4; k++) T.at(STOMP + .2 + k * .6, mixb(thud(1), drum(42, .9, .6)), .3, -.4 + k * .2);   // the stomps
T.at(STOMP + .6, mixb(laughter(1.6, 1), voice([[0, .25, 1, .4], [.3, .25, .95, .4], [.6, .3, .9, .4]], DEMON, { fall: .2 })), .12, -.3);   // demon laughter
T.at(STOMP + .9, brass(2.4, [38, 41, 44], 1, .2, .6), .09, 0);
for (let k = 0; k < 6; k++) T.at(STOMP + .5 + k * .2, squeak(1600 + rnd() * 400, 1200, .08, .4), .04, .6);   // the devas squeak away
T.at(SEND - .25, whoosh(.5, 400, 3000), .18, 0);                                   // the wipe
T.at(SEND + .3, mixb(bell(note(62), 2.2, { k: 2 }), om(2.0, 110, .7)), .12, 0);    // Shiva points
T.at(SEND + .6, whoosh(.8, 3000, 400), .1, -.4);                                   // the beam goes down
T.at(G0 - .05, mixb(shimmer(.5, [note(91), note(96)], .5, .05)), .08, 0);

// ================= G · "but Lord… I have no weapons!" =================
T.at(SHRUG + .05, voice([[0, .3, 1.2, .5], [.35, .45, 1.1, .6]], RAMAV, { amp: .9 }), .11, 0);   // "but Lord…"
T.at(SHRUG + .4, mixb(squeak(300, 600, .25, .6), tone(.5, t => 140 + 60 * t, { type: 'saw', e: env.swell(.05, .2), amp: .4 })), .08, 0);   // the bassoon "huh?"
T.at(SHRUG + .95, plink(note(76), .5), .06, -.5); T.at(SHRUG + 1.95, plink(note(79), .5), .06, .5);   // look left, look right
T.at(SHRUG + 1.1, talk(1.6, RAMAV, { gap: .15, br: .6, amp: .9, shake: .5 }), .1, 0);   // "I have no weapons!"
T.at(SHRUG + 1.0, squeak(1400, 1000, .2, .5), .04, .3);                                  // sweat
T.at(SHRUG + 2.9, tone(.5, t => 200 - 60 * t, { type: 'saw', e: env.swell(.05, .2), amp: .4 }), .06, 0);   // the second shrug

// ================= H · "Go." =================
T.at(GO, mixb(bell(note(50), 3.2, { k: 1.4 }), drum(48, .8, 1.0)), .22, 0);            // a deep, warm bell
T.at(GO + .02, voice([[0, .45, 1, .3]], SHIVAV, { fall: .15, amp: 1 }), .14, 0);        // "Go."
T.at(GO + 1.0, talk(1.2, SHIVAV, { gap: .2, br: .35, amp: .9 }), .11, 0);              // "you will win"
T.at(GO + 1.2, pad(3, [62, 69, 74], 1, .6, 1.2), .06, 0);

// ================= I · bare hands =================
for (let k = 0; k < 4; k++) T.at(STRIDE + .1 + k * .22, thud(.4), .1, -.6 + k * .2);    // the strides
T.at(STRIDE + .2, laughter(1.0, .9), .08, .4);                                          // the Danavas laugh
// silence, one knuckle crack
T.at(STRIDE + 1.05, mixb(click(1), noise(.06, { hp: 1500, lp: 7000, e: env.pluck(80), amp: .8 })), .25, -.2);
T.at(STRIDE + 1.12, mixb(click(.8)), .2, -.2);
T.at(BRAWL - .05, whoosh(.3, 800, 3000), .2, 0);
for (let k = 0; k < 16; k++) {
  const t0 = BRAWL + .05 + k * .14 + rnd() * .05, r = rnd();
  T.at(t0, r < .5 ? thwack(1) : r < .8 ? boing(140 + rnd() * 120, .8) : pop(600 + rnd() * 600, .8), .16, rnd() * 1.2 - .6);
}
for (let k = 0; k < 5; k++) T.at(BRAWL + .3 + k * .42, voice([[0, .18, 1 + rnd() * .4, .6]], DEMON * 1.6, { fall: .4, amp: .7 }), .07, rnd() - .5);   // oofs
T.at(49.0, whoosh(1.2, 2000, 600), .12, .6);                                             // the club spins away
T.at(49.3, cymbal(1), .07, .2);
T.at(CLEAR, mixb(thud(1), drum(55, .8, .5)), .25, .2);                                   // the heap settles
for (let k = 0; k < 3; k++) T.at(CLEAR + .2 + k * .3, plink(note(91 + k * 2), .5), .05, .4);   // the swirl-eyed stars
for (let k = 0; k < 4; k++) T.at(CLEAR + .5 + k * .14, click(.4), .06, -.3);               // dusting his hands
T.at(J0 - .3, whoosh(.6, 400, 3000), .2, 0);

// ================= J · the touch =================
T.at(KNEEL + .2, noise(.9, { lp: 900, hp: 150, e: env.swell(.2, .5), amp: 1 }), .06, -.3);   // a tired breath
T.at(TOUCH - .5, whoosh(.6, 300, 1200), .06, .2);                                          // the reach
for (let k = 0; k < 8; k++) T.at(TOUCH + k * .12, harp(note([67, 71, 74, 79, 83, 86, 91, 95][k]), .7), .09, -.1 + k * .05);   // the harp glissando
T.at(TOUCH + .2, mixb(shimmer(1.6, [note(91), note(96), note(100), note(103)], .6, .12), pad(3.2, [67, 71, 74, 79], 1, .3, 1.2)), .1, 0);
T.at(TOUCH + 1.5, voice([[0, .3, 1.2, .5]], RAMAV, { rise: .2, amp: .6 }), .06, -.3);    // a happy "mm!"
T.at(K0 - .3, shimmer(.6, [note(96), note(100), note(103)], .5, .06), .1, 0);              // the bloom

// ================= K · the gifts; the axe =================
T.at(GIFTS, pad(2.2, [67, 71, 74, 79], 1, .3, 1), .07, 0);
for (let i = 0; i < 5; i++) {
  T.at(GIFTS + .1 + i * .12, whoosh(.5, 600, 2000), .05, -.6 + i * .3);                   // they float down
  T.at(GIFTS + 1.5 + i * .32, chime(note([79, 83, 86, 91, 95][i]), .7, 1.2), .1, -.6 + i * .3);   // each settles into him
}
// silence from AXE_IN - .3, then the beam and the fall
T.at(AXE_IN, tone(1.0, t => 400 + 900 * t, { type: 'tri', e: env.swell(.3, .05), amp: .5 }), .06, 0);   // the beam hums up
T.at(AXE_IN + .25, whoosh(.75, 400, 3500), .12, -.2);                                     // the axe falls
T.at(CATCH, drum(40, 1, 1.4), .6, 0); T.at(CATCH, thud(1), .4, 0);                        // the taiko
T.at(CATCH + .02, noise(1.6, { brown: true, lp: 220, e: env.ad(.01, .8), amp: 1 }), .3, 0);
T.at(CATCH + .04, mixb(clink(1), bell(note(84), 1.6, { partials: [[1, 1], [2.7, .5], [5.2, .25]], k: 3 })), .2, -.2);   // a metal ring
T.at(CATCH + .1, brass(2.2, [43, 50, 55, 62], 1, .04, 1), .18, 0);
T.at(L0 - .3, whoosh(.6, 400, 3000), .2, 0);

// ================= L/M · the name; the ask =================
T.at(N1, mixb(plink(note(79), 1), click(.4)), .12, 0);                                   // three rising ticks
T.at(N2, mixb(plink(note(83), 1), click(.4)), .12, 0);
T.at(NAME - .45, tone(.4, t => 300 + 900 * t / .4, { type: 'tri', e: env.swell(.3, .02), amp: .4 }), .06, 0);   // a short riser
T.at(NAME, drum(42, 1, 1.4), .55, 0); T.at(NAME, thud(1), .35, 0);                       // the big hit
T.at(NAME + .03, bell(note(55), 3.2, { k: 1.4 }), .2, 0);                                 // a great temple bell
T.at(NAME + .1, brass(2.6, [43, 50, 55, 62], 1, .04, 1.2), .2, 0);
T.at(NAME + .5, shimmer(1.4, [note(91), note(96), note(103)], .5, .1), .08, -.3);
T.at(M0, pad(CARD - M0 + .3, [62, 66, 69, 74], 1, .5, 1.2), .05, 0);
T.at(ASK, mixb(bell(note(62), 2.4, { k: 1.8 }), damru(240, .7)), .12, 0);                 // a temple bell under the ask
for (let k = 0; k < 5; k++) T.at(ASK + .2 + k * .09, damru(250 + (k % 2) * 30, .5), .08, 0);

// ================= N · the card =================
T.at(CARD - .3, whoosh(.6, 400, 3000), .2, 0);
[0, .15, .3].forEach((d, i) => T.at(CARD + .3 + d, pop(800 + i * 140, .9), .14, -.3 + i * .3));
T.at(CARD + 1.0, chime(note(84), .7, 1.4), .1, 0); T.at(CARD + 1.3, chime(note(91), .7, 1.4), .1, 0);
T.at(CARD + 1.6, pop(1000, 1), .16, 0); T.at(CARD + 2.0, chime(note(96), .6, 2), .08, 0);
T.at(CARD + .2, pad(3.8, [64, 67, 71, 76], 1, .5, 1.2), .05, 0);

T.write('assets/parshu2_sfx.wav');
