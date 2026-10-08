// mahish_sfx.mjs: the sound effects for "Mahishasura turned into a LION. In front of HER lion." (src/scenes/mahish.js) →
// assets/mahish_sfx.wav. Times are the scene's constants (keep them in sync). The signatures: a DHAK (the Durga Puja
// drum) under the fight, the SHANKH (conch) when she is named, a TING per gift, Sher's roars and his SLAP, the demon's
// laugh, the elephant's trumpet, the trishul's white-out.
import { track, tone, noise, bell, mixb, env, whoosh, rumble, plink, clang, click, thud, crackle, crunch, shimmer, wah, slide, drone, note, seed, rnd, clamp, lerp, SR } from './sfx.mjs';

const REVEAL = 2.3, BRO = 2.9, LOOK = 3.5, REWIND = 4.9, B0 = 5.4;
const POOF_M = 5.7, MEET = 6.3, BOON = 8.7, KICK = 11.0, SWAT = 11.3, C0 = 12.9;
const ANGRY = 13.0, CONVERGE = 13.5, BLAZE = 14.9, RISE = 15.2, NOTGOD = 15.4, FAN = 15.6, DURGA = 17.2;
const GIFTS = 19.4, G = [20.0, 20.75, 21.5, 22.25, 23.0], VOLLEY = 23.75, MOUNTAIN = 24.9, SHER_IN = 25.5, SKID = 26.2, ME = 26.4, JUMP = 27.75, E0 = 28.0;
const HOP = 28.0, CHARGE = 28.4, BUF1 = 28.7, LEAP1 = 29.85, CLASH = 30.2, LIONF = 31.2, POOF_L = 31.5, TWITCH = 32.1,
  COPYTW = 32.6, SLAP = 33.4, SLAPCAP = 33.6, ELE = 35.4, POOF_E = 35.5, TRUMPET = 35.9, SLASH = 36.9, BUF2 = 38.6,
  LEAP = 39.3, PIN = 40.0, EMERGE = 40.4, STRIKE = 41.2, F0 = 42.4;
const NINE = 42.6, DIYAS = 43.0, VIJAY = 45.0, DEMANDS = 47.6, BROW = 49.1, JMD = 49.5, ASK = 51.0, WIPE = 54.2;
const CARD = 54.5, CARD_CAP = 54.6, COVERS = 54.8, PRICE = 55.6, LOGO = 55.9, PILL = 56.2, FOLLOW = 56.6, END = 59.3;

const T = track(END);
seed(11);
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
// the lion's ROAR (from ad 9): a growling saw under a noise roar, falling, with a rumble
const roar = (d, amp = 1, f0 = 230) => mixb(
  lp(tone(d, t => f0 * (1.15 - .45 * t / d), { type: 'saw', e: env.swell(.05, d * .35), fm: t => .02 * Math.sin(t * 2 * Math.PI * 34), amp }), 1600),
  noise(d, { lp: t => 2600 - 1400 * t / d, hp: 120, e: env.swell(.04, d * .4), amp: amp * .8 }), rumble(d * .9, amp * .6));
// the DHAK: a big barrel drum, a low skin thump with a stick crack; pattern of [beat offsets in 16ths, accent]
const dhakHit = (amp = 1, low = 1) => mixb(tone(.32, t => lerp(140, 62, clamp(t / .12)) * low, { e: env.pluck(14), amp }), noise(.04, { hp: 1800, lp: 7000, e: env.pluck(90), amp: amp * .55 }), noise(.12, { lp: 700, hp: 80, e: env.pluck(30), amp: amp * .4 }));
const kathi = (amp = 1) => mixb(click(amp), noise(.03, { hp: 2500, lp: 9000, e: env.pluck(120), amp: amp * .5 }));
function dhak(t0, t1, bpm, amp = 1) {
  const s16 = 60 / bpm / 4, o = new Float32Array(Math.round((t1 - t0 + .5) * SR)), pat = [[0, 1, 1], [3, .6, 1], [4, .8, 1.2], [6, .7, 1], [8, 1, 1], [10, .55, 1.1], [11, .6, 1], [12, .9, .9], [14, .7, 1]];
  for (let bar = 0; bar * 16 * s16 < t1 - t0; bar++) for (const [k, a, low] of pat) { const at = (bar * 16 + k) * s16; if (at < t1 - t0) add(o, dhakHit(a * amp, low), at); }
  for (let k = 0; bk(k) < t1 - t0; k++) add(o, kathi(.35 * amp * (k % 2 ? .6 : 1)), bk(k));
  function bk(k) { return k * s16 * 2 + s16; }
  return o;
}
// the SHANKH (conch): a breathy, slightly buzzy horn swelling up and bending up at the end
const shankhCall = (d, amp = 1) => mixb(
  lp(tone(d, t => note(58) * (1 + .03 * clamp((t - d * .7) / (d * .3))), { type: 'saw', e: env.swell(.25, .35), fm: t => .004 * Math.sin(t * 2 * Math.PI * 5.5), amp }), 1400),
  tone(d, t => note(70) * (1 + .03 * clamp((t - d * .7) / (d * .3))), { e: env.swell(.3, .35), amp: amp * .25 }),
  noise(d, { hp: 500, lp: 3500, e: env.swell(.2, .4), amp: amp * .18 }));
const ting = (m, amp = 1) => bell(note(m), 1.2, { amp });
const poof = (amp = 1) => noise(.4, { lp: 1800, hp: 150, e: env.ad(.01, .1), amp });
const boing = (amp = 1, f = 1) => tone(.45, t => f * (300 + 500 * Math.sin(Math.PI * clamp(t / .3))) * (1 + .08 * Math.sin(t * 2 * Math.PI * 22)), { type: 'tri', e: env.ad(.005, .15), amp });
const slapCrack = (amp = 1) => mixb(noise(.07, { hp: 1500, lp: 9000, e: env.pluck(55), amp }), click(amp), thud(amp * .5));
const impactBoom = (amp = 1) => mixb(thud(amp), crunch(amp * .5), noise(.5, { lp: 900, hp: 40, e: env.ad(.005, .18), brown: true, amp: amp * .9 }), clang(note(55), amp * .25));
const hooves = (d, rate, amp = 1) => { const o = new Float32Array(Math.round((d + .3) * SR)); for (let k = 0; k * (1 / rate) < d; k++) for (const off of [0, .06, .17, .23]) add(o, noise(.05, { lp: 800, hp: 60, e: env.pluck(60), amp: amp * (.6 + rnd() * .4) }), k / rate + off); return o; };
const laugh = (n, f0, amp = 1) => voice(Array.from({ length: n }, (_, i) => [i * .2, .14, 1 - i * .04, .7]), f0, { amp, growl: 1.2 });
const trumpet = (amp = 1) => mixb(lp(tone(1.1, t => note(76) * (1 + .12 * Math.sin(Math.PI * clamp(t / 1.1))) * (1 + .01 * Math.sin(t * 2 * Math.PI * 7)), { type: 'saw', e: env.swell(.06, .3), amp }), 3200), noise(1.1, { hp: 1200, lp: 5000, e: env.swell(.05, .3), amp: amp * .2 }));
const tapeRewind = (d, amp = 1) => mixb(tone(d, t => 900 + 2800 * (t / d) ** 2 + 300 * Math.sin(t * 2 * Math.PI * 30), { type: 'square', e: env.swell(.03, .08), amp: amp * .3 }), noise(d, { hp: 2000, lp: 8000, e: env.swell(.03, .1), amp: amp * .4 }));

// ---- A: the cold open
T.at(0, drone(B0, 49, .6), .16, 0);
T.at(0, dhakHit(1, .8), .45, 0); T.at(.9, dhakHit(.6, .8), .3, 0);
T.at(.1, noise(B0 - .2, { lp: 900, hp: 80, e: env.swell(.5, .5), amp: .6 }), .1, 0);              // wind over the battlefield
T.at(.2, voice([[0, 1.2, .55, .3]], 90, { growl: 1.6 }), .35, -.2);                            // Sher growls low
[1.4, 1.62, 1.82].forEach(c => T.at(c, click(.9), .3, -.2));                                     // the twitch
T.at(REVEAL, whoosh(.6, 2400, 400), .3, 0);
T.at(REVEAL + .4, voice([[0, .9, .62, .3]], 95, { growl: 1.8 }), .3, .4);                      // the copy growls back
T.at(BRO, voice([[0, .3, .8, .5]], 120, { growl: 1 }), .55, -.2);                               // "Bro."
T.at(LOOK, voice([[0, .14, .9, .6], [.18, .14, 1.0, .6], [.38, .38, .85, .5]], 120, { growl: 1 }), .55, -.2);   // "that's MY look"
[LOOK - .1, LOOK + .12, LOOK + .32].forEach(c => T.at(c, click(.9), .25, .4));                    // the copy twitches
T.at(REWIND, tapeRewind(.5, 1), .5, 0); T.at(REWIND + .45, whoosh(.5, 3000, 600), .3, 0);

// ---- B: heaven
T.at(B0, shimmer(2.2, [79, 83, 86, 91].map(note), .4, .15), .18, 0);
T.at(B0, drone(C0 - B0, 55, .5), .12, 0);
T.at(POOF_M, poof(1), .4, -.3); T.at(POOF_M, thud(.6), .3, -.3);
T.at(POOF_M + .15, laugh(6, 110, 1), .55, -.3);
T.at(MEET + .1, dhakHit(.8, .7), .3, 0); T.at(MEET + .35, dhakHit(.6, .7), .25, 0);
T.at(MEET + .9, laugh(5, 100, .9), .4, -.3);
[BOON + .35, BOON + .55, BOON + .75].forEach(c => T.at(c, thud(.4), .25, -.3));                // he taps his chest
T.at(BOON + .2, voice([[0, .9, .9, .5]], 105, { growl: 1.4 }), .25, -.3);                       // smug "hmmm"
T.at(SWAT - .25, whoosh(.4, 600, 3000), .4, 0);
[0, .06, .12, .18, .24].forEach((d, i) => { T.at(SWAT + d, boing(.9, 1 + i * .12), .32, .2 + i * .15); T.at(SWAT + d, click(.8), .2, .3); });
T.at(SWAT + .9, whoosh(.3, 500, 1800), .2, 0); T.at(SWAT + 1.3, thud(.7), .4, .3);             // onto the throne
T.at(SWAT + 1.35, laugh(3, 105, .8), .35, .3);
T.at(C0 - .3, whoosh(.6, 3000, 500), .3, 0);

// ---- C: the gods' light becomes Durga
T.at(C0, drone(BLAZE - C0, 43, .6), .18, 0);
T.at(ANGRY, voice([[0, .25, 1.6, .7], [.3, .25, 1.4, .7], [.6, .3, 1.7, .8]], 260), .18, 0);   // little angry mutters
T.at(CONVERGE, whoosh(BLAZE - CONVERGE, 300, 4000, .5), .45, 0);
T.at(CONVERGE, shimmer(BLAZE - CONVERGE, [72, 76, 79, 84, 88, 91].map(note), .25, .1), .3, 0);
T.at(BLAZE, mixb(noise(1.2, { hp: 200, lp: 9000, e: env.ad(.01, .4), amp: 1 }), bell(note(48), 3, { k: 1.4 })), .5, 0);
T.at(BLAZE, rumble(1.2, .8), .35, 0);
T.at(RISE, shimmer(3, [72, 79, 84, 88, 91, 96].map(note), .5, .18), .3, 0);
[0, .25, .5, .75].forEach((d, i) => T.at(FAN + d, ting(84 + [0, 4, 7, 12][i]), .3, i % 2 ? .4 : -.4));
T.at(DURGA - .1, shankhCall(2.2, 1), .55, 0);                                                    // the SHANKH
T.at(DURGA, dhakHit(1, 1), .45, 0); T.at(DURGA + .25, dhakHit(.7, 1), .3, 0);

// ---- D: the gifts; Sher
G.forEach((g, i) => { T.at(g - .5, whoosh(.5, 800, 4200), .22, i % 2 ? .4 : -.4); T.at(g, ting(86 + [0, 3, 7, 10, 12][i]), .45, i % 2 ? .4 : -.4); T.at(g, click(1), .25, 0); });
T.at(G[1] + .05, noise(1.4, { hp: 1500, lp: 4000, e: env.swell(.05, .4), amp: .5 }), .12, -.4);   // the chakra whirrs
[0, .12, .24].forEach((d, i) => { T.at(VOLLEY - .45 + d, whoosh(.45, 900, 4500), .18, -.3 + i * .3); T.at(VOLLEY + d, ting(91 + i * 4), .4, -.3 + i * .3); });
T.at(VOLLEY + .3, shimmer(1.4, [84, 88, 91, 96, 100].map(note), .4, .1), .25, 0);
T.at(MOUNTAIN, bell(note(41), 2.5, { k: 1.5 }), .35, 0);
T.at(SHER_IN, hooves(SKID - SHER_IN, 2.1, 1), .4, -.5);
T.at(SKID - .1, noise(.6, { hp: 300, lp: 2500, e: env.ad(.02, .25), amp: 1 }), .4, -.3);        // the skid
T.at(ME, roar(1.1, .9, 240), .5, -.2);
T.at(ME + .7, plink(note(96)), .35, -.2);                                                        // the wink: ting
T.at(JUMP, whoosh(.4, 600, 3500), .4, 0);

// ---- E: the fight, on a dhak
T.at(CHARGE, dhak(CHARGE, F0 - .2, 112, 1), .42, 0);
T.at(HOP, thud(.6), .3, -.2); T.at(HOP + .05, roar(.9, 1, 220), .55, -.3);
T.at(CHARGE, hooves(CLASH - CHARGE, 2.0, .9), .28, -.4);
T.at(BUF1, hooves(CLASH - BUF1, 2.3, 1.1), .3, .5);
T.at(BUF1 + .1, noise(.5, { lp: 1600, hp: 200, e: env.ad(.02, .2), amp: 1 }), .35, .5);        // the snort
T.at(BUF1 + .7, voice([[0, .8, .5, .4]], 80, { growl: 2 }), .4, .5);                             // a buffalo bellow
T.at(LEAP1, whoosh(.4, 500, 3000), .35, -.1);
T.at(CLASH, impactBoom(1), .6, 0);
T.at(CLASH + .05, whoosh(.8, 2000, 300), .3, .5); T.at(CLASH + .2, slide(.7, 700, 1500, .6), .2, .6);   // flung away
T.at(CLASH + .8, plink(note(100)), .4, .5);                                                       // ding
T.at(POOF_L, poof(1), .4, .4); T.at(POOF_L + .1, voice([[0, .7, .6, .4]], 95, { growl: 1.8 }), .3, .4);
[TWITCH, TWITCH + .22, TWITCH + .42].forEach(c => T.at(c, click(.9), .3, -.2));
[COPYTW, COPYTW + .22, COPYTW + .42].forEach(c => T.at(c, click(.9), .3, .4));
T.at(SLAP - .55, whoosh(.35, 400, 1600), .25, -.2);                                               // the wind-up
T.at(SLAP - .12, whoosh(.14, 1500, 5000), .45, 0);
T.at(SLAP - .02, slapCrack(1), .75, .2);
T.at(SLAP + .12, whoosh(.55, 3000, 800), .3, .5); T.at(SLAP + .12, slide(.5, 900, 300, .7), .25, .5);   // spinning off
T.at(SLAP + .67, poof(.9), .35, .6);
T.at(SLAPCAP + .1, roar(.6, .5, 280), .25, -.2);                                                 // a smug little rumble
T.at(POOF_E, poof(1.1), .45, .4); T.at(POOF_E, thud(.8), .35, .4);
T.at(TRUMPET, trumpet(1), .55, .4); T.at(TRUMPET, rumble(.9, .7), .3, .4);
T.at(SLASH - .3, whoosh(.32, 600, 6000), .5, 0);
T.at(SLASH, mixb(clang(note(88), .7), noise(.25, { hp: 3000, lp: 10000, e: env.ad(.005, .08), amp: .8 })), .45, .2);
T.at(SLASH + .15, poof(1.2), .5, .4); T.at(SLASH + .2, shimmer(1, [91, 95, 98].map(note), .4), .2, .3);
T.at(BUF2, hooves(LEAP + .5 - BUF2, 2.3, 1.1), .32, .5); T.at(BUF2 + .2, noise(.5, { lp: 1600, hp: 200, e: env.ad(.02, .2), amp: 1 }), .35, .5);
T.at(LEAP, whoosh(PIN - LEAP, 400, 2600, .3), .45, 0); T.at(LEAP + .05, voice([[0, .5, 1.5, .9]], 240), .35, 0);   // her battle cry
T.at(PIN, impactBoom(1), .65, .3);
T.at(EMERGE, poof(1), .35, .1); T.at(EMERGE + .05, voice([[0, .9, .55, .6]], 100, { growl: 2 }), .55, 0);   // he roars out
T.at(STRIKE - .15, whoosh(.17, 800, 7000), .5, 0);
T.at(STRIKE, impactBoom(1.2), .42, 0);
T.at(STRIKE, mixb(bell(note(48), 3.5, { k: 1.2 }), bell(note(60), 2.5, { k: 1.6 })), .3, 0);
T.at(STRIKE + .1, shimmer(2.4, [84, 88, 91, 96, 100, 103].map(note), .5, .12), .4, 0);

// ---- F: victory
T.at(F0, drone(DEMANDS - F0, 50, .6), .12, 0);
for (let i = 0; i < 9; i++) T.at(DIYAS + i * .18, plink(note(72 + [0, 2, 4, 7, 9, 12, 14, 16, 19][i])), .35, -.6 + i * .15);
T.at(VIJAY, shankhCall(1.8, .9), .45, 0);
T.at(VIJAY + .4, dhak(VIJAY + .4, DEMANDS, 112, .7), .3, 0);
T.at(VIJAY + .2, crackle(2, .5), .1, 0);                                                          // petals
T.at(DEMANDS + .1, whoosh(.3, 600, 2200), .2, .3);
T.at(DEMANDS + .2, voice([[0, .14, .9, .5], [.2, .4, .85, .4], [.75, .16, .9, .5], [.95, .14, 1.0, .5], [1.15, .4, .9, .5]], 120, { growl: .8 }), .45, .3);
T.at(BROW, slide(.2, 600, 1400, .6), .35, -.3);                                                   // the eyebrow goes up
T.at(BROW + .1, voice([[0, .14, 1.6, .4]], 120), .3, .3);                                          // gulp
T.at(JMD, whoosh(.25, 900, 4000), .35, .3);
T.at(JMD + .05, voice([[0, .18, 1.2, .9], [.22, .16, 1.35, .9], [.42, .16, 1.45, .9], [.62, .4, 1.6, 1]], 150, { growl: .5 }), .6, .3);   // JAI MA-TA DI!
T.at(JMD + .05, shimmer(1, [88, 91, 96].map(note), .3), .25, .3);
T.at(ASK, drone(WIPE - ASK, 55, .5), .12, 0);
T.at(ASK, shimmer(2.6, [79, 83, 86, 91].map(note), .7, .2), .14, 0);
T.at(WIPE, whoosh(.6, 400, 3000), .35, 0);

// ---- the card
T.at(COVERS, plink(note(84)), .3, -.4); T.at(COVERS + .15, plink(note(88)), .3, 0); T.at(COVERS + .3, plink(note(91)), .3, .4);
T.at(PRICE, ting(96), .3, 0);
T.at(PILL, mixb(click(1), plink(note(91))), .35, 0);
T.at(FOLLOW, shimmer(1.5, [84, 88, 91, 96].map(note), .4, .15), .2, 0);

T.write('assets/mahish_sfx.wav');
