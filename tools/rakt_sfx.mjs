// rakt_sfx.mjs: the sound effects for "Why is Maa Kali's TONGUE out?" (src/scenes/rakt.js) → assets/rakt_sfx.wav.
// Times are the scene's constants (keep them in sync). The signatures: the BLEP (a rubbery tongue wobble), a PLIP for
// every drop and a POP for every clone (sparse, then a popcorn storm), Sher's SLAPs, the red carpet's FWRRRP, the
// deflating balloon, the dance on a dhak, the record scratch and crickets, and the "oops" squeak.
import { track, tone, noise, bell, mixb, env, whoosh, rumble, plink, clang, click, thud, crackle, crunch, shimmer, slide, drone, note, seed, rnd, clamp, lerp, SR } from './sfx.mjs';

const BLEP = 1.0, TWO = 2.7, FALL = 4.15, B0 = 4.6;
const LAND = 4.75, SPROUT = 5.0, POP0 = 5.45, MEET = 6.9, BOON = 9.3, POKE = 9.6, DRIP = 9.8, LAND2 = 10.4, POP2 = 11.6, HI5 = 12.6, SMUG = 13.2, C0 = 14.4;
const ROAR = 14.6, SLAP1 = 16.0, POPS1 = 16.5, MORE = 16.7, SLAP2 = 17.7, POPS2 = 18.2, FACEPALM = 18.3, CHAKRA = 19.0, COUNT = [19.2, 19.7, 20.2], THOUS = 20.7, GAGS = 22.6, D0 = 24.6;
const ANGRY = 24.7, EYE3 = 25.8, BURST = 26.8, KLAND = 27.3, KALI = 28.6, GULP = 29.0, CARPET = 30.6;
const UNROLL = 31.0, UNROLLED = 32.2, NOTONE = 33.0, NODROPS = 35.6, SELFIE = 36.0, FLASH = 36.5, BOOP = 36.9, ORIG = 37.8, FINGER = 38.4, SLAP3 = 39.0, DEFLATE = 39.1, TWINK = 39.95, SLURP = 40.0, F0 = 40.4;
const R2 = 40.4, DANCE = 41.0, SHOOK = 42.4, SHIVA = 44.8, LIE = 45.6, HOPON = 46.6, STEP = 47.0, WAIT = 47.2, HUSB = 47.9, BITE = 49.2, OOPS = 49.3, THUMB = 49.8, BLEP2 = 50.4;
const RECAP = 51.6, ASK = 53.9, WIPE = 56.8;
const CARD = 57.1, CARD_CAP = 57.2, COVER = 57.4, ROW = 58.0, PRICE = 58.4, LOGO = 58.7, PILL = 59.0, FOLLOW = 59.4, END = 61.6;

const T = track(END);
seed(12);
const add = (o, b, s0, g = 1) => { const s = Math.round(s0 * SR); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j] * g; return o; };
const lp = (b, fc) => { let l = 0; const a = 1 - Math.exp(-2 * Math.PI * fc / SR); for (let i = 0; i < b.length; i++) { l += a * (b[i] - l); b[i] = l; } return b; };
// a buzzy cartoon voice (from ad 10): syllables [start, dur, pitch ×, brightness 0..1]
function voice(syl, f0, { amp = 1, growl = 0 } = {}) {
  const D = Math.max(...syl.map(([s, d]) => s + d)) + .1, o = new Float32Array(Math.round(D * SR));
  let ph = 0, l = 0;
  for (let i = 0; i < o.length; i++) {
    const t = i / SR, s = syl.find(([a, d]) => t >= a && t < a + d);
    if (!s) { l *= .995; o[i] = 0; continue; }
    const [a, d, pm, br] = s, k = (t - a) / d, e = clamp(k / .12) * clamp((1 - k) / .25);
    ph += f0 * pm * (1.04 - .1 * k) * (1 + .01 * Math.sin(t * 40) + growl * .03 * Math.sin(t * 190)) / SR;
    const x = 2 * (ph - Math.floor(ph)) - 1, fc = 500 + br * 2200 * Math.sin(Math.PI * clamp(k * 1.3)), al = 1 - Math.exp(-2 * Math.PI * fc / SR);
    l += al * (x * e - l); o[i] = l * amp;
  }
  return o;
}
const roar = (d, amp = 1, f0 = 230) => mixb(
  lp(tone(d, t => f0 * (1.15 - .45 * t / d), { type: 'saw', e: env.swell(.05, d * .35), fm: t => .02 * Math.sin(t * 2 * Math.PI * 34), amp }), 1600),
  noise(d, { lp: t => 2600 - 1400 * t / d, hp: 120, e: env.swell(.04, d * .4), amp: amp * .8 }), rumble(d * .9, amp * .6));
const dhakHit = (amp = 1, low = 1) => mixb(tone(.32, t => lerp(140, 62, clamp(t / .12)) * low, { e: env.pluck(14), amp }), noise(.04, { hp: 1800, lp: 7000, e: env.pluck(90), amp: amp * .55 }), noise(.12, { lp: 700, hp: 80, e: env.pluck(30), amp: amp * .4 }));
const ting = (m, amp = 1) => bell(note(m), 1.2, { amp });
const poof = (amp = 1) => noise(.4, { lp: 1800, hp: 150, e: env.ad(.01, .1), amp });
const boing = (amp = 1, f = 1) => tone(.45, t => f * (300 + 500 * Math.sin(Math.PI * clamp(t / .3))) * (1 + .08 * Math.sin(t * 2 * Math.PI * 22)), { type: 'tri', e: env.ad(.005, .15), amp });
const slapCrack = (amp = 1) => mixb(noise(.07, { hp: 1500, lp: 9000, e: env.pluck(55), amp }), click(amp), thud(amp * .5));
const impactBoom = (amp = 1) => mixb(thud(amp), crunch(amp * .5), noise(.5, { lp: 900, hp: 40, e: env.ad(.005, .18), brown: true, amp: amp * .9 }), clang(note(55), amp * .25));
const laugh = (n, f0, amp = 1) => voice(Array.from({ length: n }, (_, i) => [i * .2, .14, 1 - i * .04, .7]), f0, { amp, growl: 1.2 });
// new: a clone POP (a cork pop: a click and a quick upward blip), a drop PLIP (a water blip), the sprout's squeak
const pop = (amp = 1, f = 1) => mixb(click(amp), tone(.07, t => f * (500 + 2600 * t / .07), { e: env.pluck(40), amp: amp * .7 }), noise(.05, { lp: 2500, hp: 300, e: env.pluck(60), amp: amp * .5 }));
const plip = (amp = 1, f = 1) => tone(.12, t => f * (900 + 1600 * Math.min(1, t / .05)), { e: env.pluck(30), amp });
const sprout = (amp = 1) => slide(.22, 500, 1400, amp);
const blep = (amp = 1) => { const d = .7; return lp(tone(d, t => 180 + 60 * Math.sin(t * 2 * Math.PI * 9), { type: 'saw', e: env.swell(.02, .2), fm: t => .3 * Math.sin(t * 2 * Math.PI * 18), amp }), 900); };
const shutter = (amp = 1) => mixb(click(amp), noise(.06, { hp: 2500, lp: 9000, e: env.pluck(70), amp: amp * .6 }), click(amp * .7));
const scratch = (amp = 1) => mixb(noise(.45, { hp: t => 600 + 3000 * Math.abs(Math.sin(t * 18)), lp: t => 2000 + 5000 * Math.abs(Math.sin(t * 18)), e: env.ad(.01, .2), amp }), tone(.45, t => 300 + 900 * Math.abs(Math.sin(t * 18)), { type: 'saw', e: env.ad(.01, .2), amp: amp * .25 }));
const cricket = (amp = 1) => { const o = new Float32Array(Math.round(.5 * SR)); for (let k = 0; k < 4; k++) add(o, tone(.04, 4400, { e: env.pluck(40), amp }), k * .05); return o; };
const deflate = (d, amp = 1) => mixb(lp(tone(d, t => 520 * Math.pow(.32, t / d) * (1 + .15 * Math.sin(t * 2 * Math.PI * 23)), { type: 'saw', e: env.swell(.02, .15), fm: t => .05 * Math.sin(t * 2 * Math.PI * 41), amp }), 2600), noise(d, { hp: 900, lp: 5000, e: env.swell(.02, .2), amp: amp * .35 }));
const fwrrp = (d, amp = 1) => mixb(noise(d, { lp: t => 600 + 3000 * t / d, hp: 120, e: env.swell(.05, .2), amp }), tone(d, t => 90 + 30 * Math.sin(t * 2 * Math.PI * 14), { type: 'saw', e: env.swell(.05, .2), amp: amp * .25 }));
const slurp = (amp = 1) => mixb(noise(.4, { lp: t => 4000 - 3500 * t / .4, hp: 200, e: env.swell(.02, .15), amp }), tone(.4, t => 900 - 600 * t / .4, { type: 'tri', e: env.swell(.02, .15), amp: amp * .4 }));
const gulp = (amp = 1, f = 1) => tone(.14, t => f * (420 - 1400 * t), { type: 'tri', e: env.pluck(18), amp });

// ---- A: the hook
T.at(0, drone(B0, 46, .6), .14, 0);
T.at(BLEP, blep(1), .4, 0); T.at(BLEP + .15, click(.6), .15, -.4); T.at(BLEP + .5, click(.6), .15, .4);   // eyes dart
[TWO, TWO + .35, TWO + .7].forEach((c, i) => T.at(c, plink(note(84 + i * 3)), .25, 0));
T.at(FALL, slide(.5, 1800, 300, .6), .3, 0); T.at(FALL + .1, whoosh(.5, 3000, 500), .35, 0);

// ---- B: the seed
T.at(B0, noise(C0 - B0, { lp: 800, hp: 80, e: env.swell(.5, .5), amp: .6 }), .08, 0);   // night wind
T.at(LAND, plip(1), .55, 0);
T.at(SPROUT, sprout(.8), .3, 0);
T.at(POP0, pop(1), .55, 0); T.at(POP0, boing(.8, 1), .3, 0); T.at(POP0, poof(.6), .2, 0);
T.at(POP0 + .55, voice([[0, .5, 1.1, .5]], 150), .25, .1);                                     // a stretchy "mmmh"
T.at(MEET, laugh(8, 130, 1), .45, .1);
for (let k = 0; k < 7; k++) T.at(MEET + .1 + k * .3, whoosh(.25, 700, 2600), .14, .2);           // the mace twirls
T.at(POKE, mixb(clang(note(91), .5), click(1)), .35, .1);
T.at(POKE + .02, voice([[0, .35, 2.0, .9]], 220), .5, .1);                                        // OW!
T.at(DRIP, slide(.55, 1500, 500, .5), .2, -.3);
T.at(LAND2, plip(1, .9), .55, -.3); T.at(LAND2 + .2, sprout(.8), .3, -.3);
T.at(POP2, pop(1, .95), .55, -.3); T.at(POP2, boing(.8, 1.1), .3, -.3);
T.at(POP2 + .35, voice([[0, .25, 1.6, .7]], 160), .3, .1);                                        // "huh?"
T.at(HI5, mixb(slapCrack(.8), shimmer(.6, [88, 91, 96].map(note), .4)), .45, 0);
T.at(HI5 + .2, laugh(4, 140, .9), .3, -.2); T.at(HI5 + .25, laugh(4, 125, .9), .3, .2);
T.at(SMUG, voice([[0, .7, .9, .3]], 120, { growl: 1 }), .2, 0);                                   // "hmm-hmm"
T.at(C0 - .3, whoosh(.5, 600, 3500), .35, 0);

// ---- C: the fight makes it worse
T.at(ROAR, roar(.9, 1, 230), .55, -.2);
T.at(SLAP1 - .45, whoosh(.35, 400, 1600), .22, -.2);
T.at(SLAP1, slapCrack(1), .7, .1);
T.at(SLAP1 + .05, tone(.85, t => 400 + 300 * Math.sin(t * 2 * Math.PI * 9), { type: 'tri', e: env.swell(.02, .2), amp: .5 }), .25, .3);   // spinning like a top
[16.55, 16.62, 16.7].forEach((c, i) => { T.at(c - .02, plip(.8, 1 + i * .1), .3, .2 + i * .1); T.at(c + .22, pop(.9, 1 + i * .12), .4, .2 + i * .15); });
T.at(MORE + .3, voice([[0, .3, 1.4, .6]], 170, { growl: .6 }), .25, -.2);                        // Sher: "...huh"
T.at(SLAP2 - .45, whoosh(.35, 400, 1600), .22, -.2);
T.at(SLAP2, slapCrack(1), .7, 0);
[18.2, 18.26, 18.32, 18.38, 18.44, 18.5].forEach((c, i) => T.at(c + .22, pop(.85, .9 + i * .08), .35, -.4 + i * .18));
T.at(FACEPALM, mixb(slapCrack(.35), thud(.3)), .3, -.5);                                          // the facepalm
T.at(CHAKRA, noise(.9, { hp: 1500, lp: 4500, e: env.swell(.05, .3), amp: .6 }), .25, 0);         // the chakra whirrs
T.at(CHAKRA, whoosh(.9, 800, 3800), .3, 0);
for (let k = 0; k < 70; k++) { const c = 19.45 + 1.75 * Math.pow(rnd(), .8); T.at(c, pop(.6 + rnd() * .4, .8 + rnd() * .7), .16 + rnd() * .1, -.8 + rnd() * 1.6); }   // popcorn storm
COUNT.forEach((c, i) => T.at(c, dhakHit(.8, 1 + i * .15), .35, 0));
T.at(THOUS, mixb(impactBoom(.8), bell(note(43), 2.4, { k: 1.4 })), .4, 0);
T.at(THOUS + .2, laugh(10, 125, 1), .2, -.3); T.at(THOUS + .3, laugh(10, 145, 1), .2, .3);       // the crowd laughs
T.at(GAGS, whoosh(.3, 3000, 900), .3, 0);
T.at(GAGS + .8, shutter(1), .45, .3);                                                             // the selfie
T.at(GAGS + .5, voice([[0, .3, 1.1, .5], [.35, .3, 1.15, .5]], 150), .2, .2);                     // "you!" "no, YOU!"
T.at(GAGS + .9, voice([[0, .3, 1.15, .5], [.35, .3, 1.1, .5]], 140), .2, .4);
T.at(GAGS + 1.0, voice([[0, .9, .8, .4]], 140, { growl: .4 }), .2, -.3);                         // Sher, sheepish hum

// ---- D: Durga's anger → Kali
T.at(D0, laugh(12, 130, .8), .18, 0);
T.at(ANGRY, drone(BURST - ANGRY, 41, .8), .3, 0);
T.at(ANGRY + .3, rumble(BURST - ANGRY - .3, .6), .25, 0);
T.at(EYE3, crackle(1, .7), .25, 0); T.at(EYE3, bell(note(52), 1.5, { k: 2 }), .2, 0);
T.at(BURST, mixb(crackle(.6, 1), whoosh(.5, 500, 7000)), .55, 0);
T.at(KLAND + .16, impactBoom(1.3), .7, -.2); T.at(KLAND + .16, rumble(1.4, 1), .4, -.2);
T.at(KLAND + .5, roar(1.3, .8, 170), .5, -.3);                                                   // KALI's roar
T.at(KALI, dhakHit(1, .8), .45, 0); T.at(KALI + .2, dhakHit(.8, .8), .35, 0); T.at(KALI + .4, dhakHit(1, .7), .45, 0);
for (let k = 0; k < 14; k++) T.at(GULP + rnd() * .25, gulp(.6 + rnd() * .4, .8 + rnd() * .6), .14, -.8 + rnd() * 1.6);   // every clone gulps
T.at(GULP + .35, thud(.4), .2, .5);                                                               // one faints

// ---- E: the tongue
T.at(CARPET + .1, voice([[0, .4, .7, .3]], 110, { growl: 1.2 }), .3, -.3);                       // "aaah" (mouth open)
T.at(UNROLL, fwrrp(UNROLLED - UNROLL, 1), .5, .2);
T.at(UNROLL, slide(UNROLLED - UNROLL, 120, 60, .5), .25, .2);
T.at(UNROLL + .15, poof(.6), .2, -.1);                                                            // the upside-down one flattened
T.at(UNROLL + .2, voice([[0, .9, 1.8, .7]], 200), .25, .5);                                       // the log-roller's "wa-wa-wa"
T.at(UNROLLED - .2, whoosh(.6, 600, 3500), .3, .6); T.at(UNROLLED + .5, ting(100), .35, .5);
T.at(NOTONE, noise(NODROPS - NOTONE, { hp: 1500, lp: 4500, e: env.swell(.1, .3), amp: .3 }), .12, .3);   // the chakra loops
for (let k = 0; k < 9; k++) T.at(NOTONE + .1 + k * .3, whoosh(.25, 900, 4000), .15, -.4);        // khadga swishes
for (let k = 0; k < 6; k++) T.at(NOTONE + .2 + k * .42, slapCrack(.5), .25, -.1);                 // Sher slaps
for (let k = 0; k < 64; k++) { const c = 33.25 + 2.2 * k / 63; T.at(c, pop(.6 + rnd() * .4, .9 + rnd() * .6), .15, -.6 + rnd() * 1.4); T.at(c + .32, plip(.5 + rnd() * .3, .8 + rnd() * .5), .12, -.5 + rnd()); }
T.at(SELFIE, voice([[0, .25, 1.4, .7], [.3, .3, 1.6, .7]], 170), .25, .3);                        // "cheese!"
T.at(FLASH, shutter(1), .5, .3);
T.at(BOOP - .15, boing(.9, 1.3), .35, .3); T.at(BOOP + .1, pop(1, 1.1), .45, .3);
[BOOP + .5, BOOP + .58].forEach(c => T.at(c, click(1), .3, .3));                                 // the phone clatters
T.at(ORIG + .1, voice([[0, .2, 1.9, .6], [.25, .2, 1.8, .6]], 160), .25, .2);                    // "eep. eep."
T.at(FINGER, voice([[0, .5, 1.2, .5]], 150), .3, .2);                                              // "uh, one sec…"
for (let k = 0; k < 4; k++) T.at(FINGER + .3 + k * .15, plink(note(79 + (k % 2) * 2), .7), .2, .25);   // tiptoes
T.at(SLAP3 - .45, whoosh(.35, 400, 1600), .22, -.1);
T.at(SLAP3, slapCrack(1), .7, 0);
T.at(SLAP3 + .35, plip(1, 1), .5, .1);
T.at(DEFLATE, deflate(TWINK - DEFLATE, 1), .5, .2);
T.at(TWINK, ting(103), .45, .2);
T.at(SLURP, slurp(1), .55, -.3); T.at(SLURP + .32, gulp(1, .8), .4, -.3);

// ---- F: reason 2, on a dhak
T.at(R2, shimmer(1, [79, 83, 86].map(note), .4, .12), .2, 0);
const beat = 60 / 112;
for (let k = 0; DANCE + k * beat < HOPON; k++) {
  const c = DANCE + k * beat, g = clamp(.5 + k * .06, .5, 1);
  T.at(c, dhakHit(g, 1), .45, 0); T.at(c, thud(g), .35, 0);
  if (c > SHOOK) T.at(c, rumble(.4, g * .7), .18, 0);
  T.at(c + beat / 2, dhakHit(.4, 1.2), .25, 0);
  if (k % 2) T.at(c + .05, boing(.5, 1.4), .14, -.4);                                               // Sher bounces
}
T.at(SHIVA, shimmer(1.6, [72, 76, 79, 84, 88].map(note), .5, .15), .35, -.4);
T.at(SHIVA + .1, drone(1.4, 55, .5), .2, -.4);
T.at(LIE, poof(.5), .2, -.2);
T.at(HOPON, whoosh(.4, 500, 2600), .35, 0);
T.at(STEP, thud(1), .5, 0); T.at(STEP + .02, scratch(1), .5, 0);                                   // STOMP… record scratch
[WAIT + .3, WAIT + .9, WAIT + 1.5].forEach((c, i) => T.at(c, cricket(.8), .12, .5 - i * .4));      // crickets
T.at(HUSB, mixb(ting(96), slide(.3, 700, 1600, .5)), .3, 0);
T.at(BITE, voice([[0, .3, 2.2, .9]], 230), .4, 0);                                                 // eek!
T.at(BITE + .05, slide(.35, 1400, 500, .7), .3, 0);                                                // oops: a falling whistle
T.at(OOPS + .45, mixb(plink(note(84)), plink(note(79))), .3, 0);
T.at(THUMB + .2, ting(96), .4, -.3);
T.at(BLEP2, blep(.8), .3, -.4);
T.at(BLEP2 + .3, laugh(5, 260, .7), .25, -.6);                                                     // Durga giggles

// ---- G: recap and ask
T.at(RECAP, plink(note(84)), .3, 0); T.at(RECAP + .7, plink(note(88)), .3, 0);
T.at(ASK, drone(WIPE - ASK, 55, .5), .12, 0);
T.at(ASK, shimmer(2.6, [79, 83, 86, 91].map(note), .7, .2), .14, 0);
T.at(WIPE, whoosh(.6, 400, 3000), .35, 0);

// ---- the card
T.at(COVER, plink(note(84)), .3, 0); T.at(COVER + .25, ting(96), .25, .3);
[0, .1, .2].forEach((d, i) => T.at(ROW + d, plink(note(86 + i * 3)), .25, -.4 + i * .4));
T.at(PRICE, ting(96), .3, 0);
T.at(PILL, mixb(click(1), plink(note(91))), .35, 0);
T.at(FOLLOW, shimmer(1.5, [84, 88, 91, 96].map(note), .4, .15), .2, 0);

T.write('assets/rakt_sfx.wav');
