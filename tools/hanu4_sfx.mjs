// hanu4_sfx.mjs: the sound for "The night HANUMAN almost GAVE UP" (src/scenes/hanu4.js, ad 89, Hanuman Part 4, no
// voice) → assets/hanu4_sfx.wav. Times are the scene's constants (keep them in sync). Retro synth cartoon foley as in
// Parts 1–3: crickets and a rain cloud on the wall; ten snoring heads and a tiptoe; a "mwah", a sung tune, a scrabble up
// the pillar and a slide-whistle fall; door creaks and buzzers; a splash in the well, a pot lid; domino clacks; the
// lamp guttering, then flaring. Music only as mild beds: a low pad under the night, a warm swell and harp for the hug,
// a music box under the ask.
import { track, tone, noise, bell, mixb, env, whoosh, plink, squeak, click, thud, shimmer, slide, chime, drum, om, wind, note, seed, rnd, clamp, splash, heart, SR } from './sfx.mjs';

const TEAR = 1.2, SIGH = 2.4;
const B0 = 4.4, SNORT = 6.4, C0 = 8.8, SEEQ = 9.5, D0 = 13.2, KISS1 = 14.0, CLIMB = 14.8, TOP = 15.9, BUMP = 16.6;
const E0 = 17.6, F0 = 22.0, FACE = 22.5, TIPTOE = 24.2;
const G0 = 26.4, DOOR = .95, SLUMP = 29.4, H0 = 30.8, VERSE = 31.3, RISE = 33.6;
const I0 = 35.8, WELL = 36.1, POT = 37.3, STILL = 38.6, J0 = 40.4, K0 = 45.0, FALL0 = 45.8, FSTEP = .24, NTILE = 12;
const L0 = 49.8, M0 = 54.6, FLARE = 55.2, UP = 56.6, N0 = 59.4, GARDEN = 60.4, LEAP = 62.9;
const O0 = 64.0, P0 = 68.6, Q0 = 73.4, HUG = 73.8, R0 = 78.4, S0 = 82.8, CARD = 86.2, END = 90.2;

const T = track(END);
seed(89);
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
const HANU = 230, RAMF = 150, SITAF = 330;
const giggle = (f, amp = 1, n = 4) => voice(Array.from({ length: n }, (_, i) => [i * .11, .08, 1.25 - i * .04, .7]), f, { amp, fall: .2 });
const huh = (f, amp = 1) => voice([[0, .32, 1, .6]], f, { amp, rise: .9, fall: 0 });
const ooh = (f, amp = 1) => voice([[0, .3, 1.1, .5]], f, { amp, rise: .3, fall: 0 });
const aww = (f, amp = 1) => voice([[0, .6, 1.1, .3]], f, { amp, fall: .45 });
const eek = (f, amp = 1) => voice([[0, .35, 1.6, .9]], f, { amp, rise: .5, shake: 1 });
const sob = (f, amp = 1) => voice([[0, .22, 1.2, .3], [.3, .22, 1.15, .3], [.62, .5, 1.1, .3]], f, { amp, fall: .3, shake: 1 });
const pop = (f = 900, amp = 1) => mixb(squeak(f * .6, f * 1.6, .07, amp), plink(f * 1.5, amp * .5));
const boing = (amp = 1, f = 220) => tone(.35, t => f * (1 + 2.2 * t) * (1 + .18 * Math.sin(t * 2 * Math.PI * 18) * Math.exp(-t * 6)), { type: 'tri', e: env.pluck(6), amp });
const pad = (dur, ms, amp = 1, a = 1.2, r = 1.4) => mixb(...ms.map((m, i) => tone(dur, t => note(m) * (1 + .003 * Math.sin(t * 2 + i)), { type: 'tri', e: env.swell(a, r), amp: amp / ms.length })));
const musicBox = f => bell(f, 1.6, { partials: [[1, 1], [3.0, .25], [5.1, .08]], k: 2.6 });
const harp = f => mixb(tone(1.2, f, { type: 'tri', e: env.pluck(3.5), amp: 1 }), tone(.6, f * 2, { e: env.pluck(8), amp: .25 }));
const cricket = amp => mixb(...[0, .09, .18].map(d => { const b = tone(.06, 4200, { e: env.pluck(30), amp }); const o = new Float32Array(Math.round((.06 + d) * SR) + b.length); o.set(b, Math.round(d * SR)); return o; }));
const crickets = (a, b, amp = .5) => { for (let t = a + .2; t < b - .3; t += .7 + rnd() * .9) T.at(t, cricket(amp), .045, rnd() * 1.4 - .7); };
const rain = (dur, amp = 1) => { const n = noise(dur, { hp: 1800, lp: 7000, e: env.swell(.3, .4), amp: amp * .3 }); for (let t = 0; t < dur - .1; t += .05 + rnd() * .09) { const i = Math.round(t * SR), b = tone(.03, 2600 + rnd() * 2400, { e: env.pluck(60), amp: amp * (.3 + rnd() * .4) }); for (let j = 0; j < b.length && i + j < n.length; j++) n[i + j] += b[j]; } return n; };
const snore = (f = 70, amp = 1) => mixb(noise(1.1, { lp: 700, hp: 60, e: env.swell(.35, .5), amp: amp * .7 }), tone(1.1, t => f * (1 + .2 * Math.sin(t * 2 * Math.PI * 28)), { type: 'saw', e: env.swell(.35, .5), amp: amp * .35 }));
const whistle = (amp = 1) => mixb(squeak(1200, 3600, .12, amp * .6), squeak(3600, 2600, .25, amp * .5));
const tip = (k, amp = .6) => plink(note(76 + [0, 3, 7, 3][k % 4]), amp);
const creak = (amp = 1) => tone(.4, t => 260 + 180 * Math.sin(t * 9) + 300 * t, { type: 'saw', e: env.swell(.05, .15), amp: amp * .35 });
const buzzer = (amp = 1) => tone(.32, 140, { type: 'square', e: env.swell(.01, .08), amp: amp * .35 });
const trombone = (amp = 1) => mixb(...[[0, 58], [.3, 57], [.6, 56], [.9, 55]].map(([d, m]) => { const b = tone(d === .9 ? .9 : .32, t => note(m) * (1 - (d === .9 ? .04 * Math.sin(t * 30) : 0)), { type: 'saw', e: env.swell(.03, .1), amp: amp * .3 }); const o = new Float32Array(Math.round(d * SR) + b.length); o.set(b, Math.round(d * SR)); return o; }));
const clack = (amp = 1, f = 1300) => mixb(click(amp), tone(.05, f, { type: 'square', e: env.pluck(70), amp: amp * .35 }), tone(.08, f * .55, { e: env.pluck(40), amp: amp * .4 }));
const poofS = (amp = 1) => mixb(noise(.45, { hp: 500, lp: 4000, e: env.pluck(7), amp }), slide(.35, 400, 1400, amp * .6), plink(1800, amp * .4));
const swell = (dur, ms, amp = 1) => mixb(...ms.map((m, i) => tone(dur, note(m), { type: 'tri', e: env.swell(dur * .45, dur * .5), amp: amp / ms.length })));

// ================= A · the hook: alone on the wall =================
T.at(0, pad(B0 + .3, [45, 52, 57, 60], 1, .2, .8), .07, 0);
T.at(0, rain(B0, .9), .14, .1);
crickets(0, B0, .4);
T.at(TEAR, plink(note(84), .6), .1, -.1); T.at(TEAR + .7, plink(note(81), .5), .08, -.1);
T.at(SIGH, voice([[0, 1.0, 1, .2]], HANU, { fall: .5 }), .1, 0);                                               // a long sigh
T.at(B0 - .3, whoosh(.6, 400, 3000), .16, 0);

// ================= B · ten snoring heads; a tiptoe; a snort =================
for (let t = B0 + .1, k = 0; t < C0 - .2; t += .55, k++) T.at(t, snore(60 + (k % 5) * 14, 1), .13, (k % 2 ? .4 : -.1));
for (let k = 0; k < 6; k++) T.at(B0 + .3 + k * .32, tip(k), .07, -.5 + k * .06);                                 // tiptoe
T.at(SNORT, mixb(snore(46, 1.6), drum(50, .8, .5)), .3, .2);
T.at(SNORT + .05, eek(HANU, 1), .18, -.4);
for (let k = 0; k < 6; k++) T.at(SNORT + .15 + k * .09, mixb(click(.5), tone(.05, 900 + k * 60, { type: 'square', e: env.pluck(40), amp: .3 })), .06, -.5);   // scurry
T.at(SNORT + .9, voice([[0, .5, 1.05, .3]], HANU, { fall: .3, shake: .8 }), .08, -.5);                         // phew

// ================= C · a queen asleep: "Sita!" =================
for (let t = C0 + .2, k = 0; t < E0 + 4.2; t += 1.6, k++) T.at(t, mixb(noise(1.0, { lp: 600, e: env.swell(.4, .5), amp: .5 })), .05, .4);   // her soft breathing
T.at(C0 + .2, pad(D0 - C0, [57, 61, 64, 69], 1, .6, .6), .045, 0);
T.at(SEEQ, mixb(pop(900, .9), pop(1100, .8), drum(60, .6, .4)), .2, -.3);
T.at(SEEQ + .05, voice([[0, .25, 1.3, .7]], HANU, { rise: .6 }), .14, -.3);                                     // a gasp
T.at(C0 + 2.1, mixb(chime(note(88), 1, 1.6), shimmer(1, [note(88), note(93), note(97)], .7, .08)), .16, -.3);
T.at(C0 + 2.2, voice([[0, .22, 1.3, .7], [.28, .4, 1.5, .8]], HANU, { rise: .3 }), .15, -.3);                   // "Si-ta!"
T.at(C0 + 2.9, giggle(HANU, 1, 6), .15, -.3);
for (let k = 0; k < 3; k++) T.at(C0 + 2.4 + k * .22, pop(800 + k * 120, .6), .1, -.3);

// ================= D · mwah; a song; up the pillar; down he comes =================
T.at(D0 + .25, mixb(squeak(900, 1900, .12, .9), squeak(1900, 600, .1, .6)), .2, -.3);                        // mwah
T.at(D0 + .3, mixb(pop(1000, .7), chime(note(93), .7, 1.2)), .12, -.3);
{ const TUNE = [0, 4, 7, 9, 7, 4, 7, 12]; TUNE.forEach((m, i) => { T.at(KISS1 + i * .1, voice([[0, .09, Math.pow(2, m / 12), .6]], HANU * 1.2, { fall: 0 }), .12, -.4); T.at(KISS1 + i * .1, plink(note(76 + m), .5), .06, -.2); }); }
for (let k = 0; k < 9; k++) T.at(CLIMB + .05 + k * .12, mixb(click(.6), noise(.05, { hp: 1200, lp: 5000, e: env.pluck(40), amp: .4 })), .07, -.6);   // scrabble up
T.at(TOP, voice([[0, .5, 1.4, .6]], HANU, { rise: .3 }), .12, -.6);                                            // wheee
T.at(TOP + .3, slide(BUMP - TOP - .3, 2200, 300, .9), .16, -.6);                                               // slide whistle down
T.at(BUMP, mixb(thud(1), drum(55, .9, .5), boing(.7, 140)), .32, -.5);
for (let k = 0; k < 4; k++) T.at(BUMP + .2 + k * .17, mixb(squeak(2400, 3200, .07, .6), squeak(3200, 2600, .06, .4)), .07, -.5 + k * .15);   // tweety stars

// ================= E · wait… =================
T.at(E0 + .5, voice([[0, .8, .95, .2]], HANU, { fall: 0 }), .1, -.3);                                         // "hmmm"
T.at(E0 + .8, mixb(pop(800, .8), plink(note(84), .5)), .12, -.2);
T.at(E0 + .9, pad(F0 - E0 - .9, [52, 59, 64, 67], 1, .8, .6), .045, 0);
for (let k = 0; k < 4; k++) T.at(E0 + 1.1 + k * .7, harp(note(64 + [0, 3, 7, 3][k])), .045, -.1);
T.at(E0 + 3.0, mixb(pop(1100, .8), huh(HANU, 1)), .14, -.3);

// ================= F · oops: Mandodari =================
T.at(F0, mixb(slide(.35, 900, 120, .7), noise(.3, { hp: 800, lp: 5000, e: env.pluck(10), amp: .4 })), .16, 0);   // record scratch
T.at(F0 + .6, mixb(chime(note(93), .7, 1), plink(note(100), .5)), .1, .4);                                       // her crown twinkles
T.at(FACE, mixb(thud(.4), click(.6)), .14, -.3); T.at(FACE + .1, voice([[0, .25, 1.0, .4], [.3, .4, .85, .3]], HANU, { fall: .3 }), .12, -.3);   // "oh no"
T.at(FACE + .2, plink(note(86), .6), .08, -.3);
for (let k = 0; k < 7; k++) T.at(TIPTOE + k * .26, tip(k, .5), .06, -.3 - k * .06);

// ================= G · doors: no Sita =================
for (let i = 0; i < 3; i++) { const t0 = G0 + .35 + i * DOOR; T.at(t0, creak(1), .12, -.5 + i * .5); T.at(t0 + .1, mixb(pop(700 + i * 100, .6), huh(HANU, .6)), .1, -.5 + i * .5); T.at(t0 + .58, buzzer(1), .1, -.5 + i * .5); T.at(t0 + .78, mixb(thud(.5), click(.6)), .12, -.5 + i * .5); }
T.at(SLUMP, trombone(1), .14, 0); T.at(SLUMP + .2, aww(HANU, .8), .1, 0);

// ================= H · not losing heart =================
T.at(H0, om(5, 110, .6), .05, 0);
T.at(VERSE, mixb(shimmer(1.6, [note(81), note(85), note(88), note(93)], .8, .1), chime(note(81), .6, 2)), .1, 0);
T.at(H0 + 1.6, voice([[0, .3, 1, .2], [.4, .3, 1.05, .2], [.8, .5, 1.1, .3]], HANU, { fall: .05 }), .08, 0);   // he says it to himself
T.at(RISE - .4, tone(.4, t => 200 + 900 * t * t, { e: env.swell(.3, .02), amp: .4 }), .08, 0);
T.at(RISE, mixb(drum(58, 1, .7), swell(1.8, [57, 64, 69, 73, 76], 1)), .24, 0);
T.at(RISE + .05, shimmer(1.2, [note(81), note(85), note(88), note(93), note(97)], 1, .06), .14, 0);
T.at(RISE + .2, voice([[0, .3, 1.2, .6], [.34, .3, 1.35, .7]], HANU), .14, 0);                                 // "hup!"
T.at(I0 - .3, whoosh(.5, 400, 3000), .14, 0);

// ================= I · again: the well, the pot =================
for (let t = I0 + .1, k = 0; t < STILL - .2; t += .2, k++) T.at(t, plink(note(64 + [0, 7, 12, 7][k % 4]), .5), .04, k % 2 ? .3 : -.3);   // a hurry vamp
T.at(WELL - .05, whoosh(.3, 2000, 500), .12, 0); T.at(WELL + .02, splash(1), .3, 0);
for (let k = 0; k < 5; k++) T.at(WELL + .2 + k * .15, mixb(noise(.08, { lp: 1200, e: env.pluck(20), amp: .5 }), plink(note(60 + k * 2), .3)), .08, 0);   // kicking in the water
T.at(WELL + .9, buzzer(1), .09, 0);
T.at(POT, mixb(tone(.12, t => 320 - 200 * t, { type: 'tri', e: env.pluck(10), amp: 1 }), click(.7)), .2, .5);   // the lid: tonk
T.at(POT + .1, mixb(boing(.8, 300), huh(HANU, .8)), .14, .5);
T.at(POT + .8, buzzer(1), .09, .5);
T.at(STILL, mixb(slide(.9, 500, 160, .6), thud(.4)), .12, -.3);
T.at(STILL + .3, rain(I0 + 4.6 - STILL - .3, .7), .1, -.3);
T.at(STILL + .4, aww(HANU, .7), .09, -.3);

// ================= J–L · the night: Ram, the dominoes, the low lamp =================
T.at(J0, pad(M0 - J0 + .4, [43, 50, 55, 58], 1, 1.4, .8), .08, 0);
T.at(J0, wind(FLARE - J0, .6, 1.2), .05, 0);
crickets(J0, FLARE, .45);
T.at(J0 + .6, pop(700, .6), .08, .3);
T.at(J0 + 1.4, voice([[0, .9, 1, .2]], HANU, { fall: .3, shake: .4 }), .07, -.3);
T.at(J0 + 2.4, mixb(aww(RAMF, .7), slide(1.0, 400, 220, .3)), .08, .3);
for (let k = 0; k < 3; k++) T.at(J0 + 2.6 + k * .5, plink(note(81 - k * 2), .4), .06, .3);
T.at(K0 + .2, pop(600, .6), .08, 0);
for (let i = 0; i < NTILE; i++) T.at(FALL0 + i * FSTEP + .3, clack(1, 1500 - i * 50), .12, -.6 + i * .11);
T.at(FALL0 + (NTILE - 1) * FSTEP + .35, mixb(thud(.6), click(.6)), .14, .6);
T.at(FALL0 + .4, heart(.8), .1, 0); T.at(FALL0 + 1.2, heart(.8), .1, 0); T.at(FALL0 + 2.0, heart(.7), .1, 0);
T.at(K0 + 1.0, sob(HANU, .8), .08, 0);
T.at(L0 + .4, rain(M0 - L0 - .2, .8), .12, .1);
T.at(L0 + .6, mixb(noise(2.8, { lp: 500, hp: 80, e: env.swell(.4, 1), amp: .6 })), .06, .5);                  // the lamp gutters in the wind
T.at(L0 + 1.0, voice([[0, 1.4, .95, .15]], HANU, { fall: .4, shake: .3 }), .07, 0);

// ================= M · "one who stays alive sees good things": the flare =================
T.at(FLARE - .3, tone(.4, t => 300 + 900 * t * t, { e: env.swell(.3, .02), amp: .3 }), .07, .4);
T.at(FLARE, mixb(whoosh(.8, 300, 3000), noise(.6, { lp: 1500, hp: 200, e: env.pluck(4), amp: .5 })), .18, .4);   // fwoomp
T.at(FLARE + .05, swell(2.6, [57, 64, 69, 73, 76, 81], 1), .2, 0);
T.at(FLARE + .1, shimmer(1.6, [note(81), note(85), note(88), note(93), note(97), note(100)], 1, .08), .14, .3);
T.at(FLARE + .9, ooh(HANU, .9), .1, 0);
T.at(UP, mixb(drum(58, 1, .7), boing(.6, 200)), .24, 0); T.at(UP + .15, giggle(HANU, 1, 5), .13, 0);
T.at(N0 - .3, whoosh(.5, 400, 3000), .12, 0);

// ================= N · the garden =================
T.at(N0, pad(O0 - N0, [50, 57, 62, 66], 1, .6, .8), .05, 0);
crickets(N0, O0, .4);
T.at(GARDEN, mixb(pop(900, .9), chime(note(93), 1, 1.6)), .18, -.2); T.at(GARDEN + .15, voice([[0, .3, 1.3, .7]], HANU, { rise: .5 }), .12, -.2);
T.at(LEAP - .2, tone(.3, t => 150 + 300 * t, { type: 'tri', e: env.swell(.25, .02), amp: .5 }), .1, 0);
T.at(LEAP, mixb(drum(52, 1, .7), whoosh(1.1, 300, 4000)), .3, -.4);

// ================= O · Sita =================
T.at(O0, mixb(tone(4.6, note(50), { type: 'tri', e: env.swell(1.2, 1.2), amp: .5 }), tone(4.6, note(57), { type: 'tri', e: env.swell(1.2, 1.2), amp: .4 }), tone(4.6, note(62), { type: 'tri', e: env.swell(1.2, 1.2), amp: .3 })), .08, 0);   // a tanpura-like drone
for (let k = 0; k < 6; k++) T.at(O0 + .3 + k * .7, harp(note(62 + [0, 4, 7, 12, 7, 4][k])), .05, .3 - k * .1);
crickets(O0, P0, .35);
T.at(O0 + 1.4, sob(HANU * 1.05, .8), .08, -.4);
for (let k = 0; k < 3; k++) T.at(O0 + 1.6 + k * .22, pop(800 + k * 120, .5), .08, -.4);
T.at(P0 - .3, whoosh(.6, 400, 3000), .12, 0);

// ================= P, Q · home: the hug =================
T.at(P0, pad(Q0 - P0 + .3, [55, 62, 67, 71], 1, .8, .8), .06, 0);
for (let t = P0 + .3; t < Q0 - .3; t += 1.4 + rnd()) T.at(t, mixb(squeak(2600, 3400, .07, .5), squeak(3400, 2900, .06, .35)), .03, rnd() * 1.4 - .7);   // birds
T.at(P0 + .3, talk(3.5, RAMF, { gap: .2, br: .3 }), .1, -.3);
T.at(P0 + .9, plink(note(76), .5), .06, -.2);
T.at(HUG - .3, mixb(click(.5), thud(.3)), .08, 0);
T.at(HUG, swell(4.6, [53, 60, 65, 69, 72, 77], 1), .22, 0);
for (let k = 0; k < 10; k++) T.at(HUG + .1 + k * .07, harp(note(65 + [0, 4, 7, 12, 16, 19, 24, 28, 31, 36][k])), .06, -.6 + k * .12);   // harp glissando
T.at(HUG + .2, shimmer(2, [note(84), note(88), note(91), note(96)], .8, .12), .1, 0);
T.at(HUG + 1.2, sob(HANU, .8), .08, .3);
for (let k = 0; k < 3; k++) { T.at(HUG + .6 + k * .22, pop(800 + k * 120, .5), .07, 0); T.at(HUG + 2.2 + k * .22, pop(900 + k * 120, .5), .07, 0); }
T.at(R0 - .3, whoosh(.6, 400, 3000), .12, 0);

// ================= ask, next, card =================
{
  const TUNE = [0, 4, 7, 4, 9, 7, 4, 2, 0, 2, 4, 7, 4, 2, 0, -3];
  let i = 0;
  for (let t = R0 + .2; t < S0 - .2; t += .34) { const m = TUNE[i++ % TUNE.length]; T.at(t, musicBox(note(81 + m)), .08, i % 2 ? -.25 : .25); }
  T.at(R0, pad(S0 - R0, [57, 64, 69, 73], 1, .6, .8), .06, 0);
}
T.at(R0 + .8, giggle(HANU, 1, 5), .14, 0); T.at(R0 + 1.2, mixb(pop(900, .7), pop(1100, .6)), .1, 0);
T.at(S0, mixb(whoosh(.5, 3000, 400), slide(.6, 600, 200, .5)), .14, 0);
T.at(S0, pad(CARD - S0, [50, 57, 62, 65], 1, .6, .6), .06, 0);
crickets(S0, CARD, .4);
T.at(S0 + .4, giggle(HANU, .8, 4), .1, .4);
T.at(S0 + 1.1, voice([[0, .3, 1, .3], [.36, .3, .9, .3]], SITAF, { fall: .2 }), .12, -.4);                     // "no, no"
T.at(S0 + 1.3, mixb(pop(1100, .8), huh(HANU, 1)), .14, .4);
T.at(CARD, whoosh(.4, 3000, 600), .14, 0);
[.3, .45, .6].forEach((d, i) => T.at(CARD + d, pop(600 + i * 100, .8), .14, -.4 + i * .4));
T.at(CARD + 1.0, chime(note(81), 1, 1.6), .14, 0); T.at(CARD + 1.6, mixb(pop(900, .8), plink(note(88), .8)), .14, 0);
T.at(CARD + 2.2, shimmer(1.2, [note(81), note(85), note(88), note(93)], .7, .09), .12, 0);

T.write('assets/hanu4_sfx.wav');
console.log('assets/hanu4_sfx.wav', END + ' s');
