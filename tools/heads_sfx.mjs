// heads_sfx.mjs: the sound effects for "Imagine waking up as RAVANA" (src/scenes/heads.js) → assets/heads_sfx.wav.
// Times are the scene's constants (keep them in sync). The signatures: TEN of everything, in waves that rise in pitch
// left to right (ten "hm?"s, ten burps, ten ACHOOs, ten pops through the door, ten tags), the alarm and its SMASH, the
// scrubbing, the munching, the sacred fire, Brahma's shimmer, the grass "tink", the sunrise, Dussehra fireworks.
import { track, tone, noise, bell, mixb, env, whoosh, rumble, plink, clang, click, thud, crackle, crunch, crinkle, shimmer, slide, drone, gurgle, note, seed, rnd, clamp, lerp, SR } from './sfx.mjs';

const TEN = 2.7, PEEK = 1.4, RING = 4.4, WAKE = 4.7, REACH = 5.1, SMASH = 6.5, NINE = 7.3, YELL = 8.4, C0 = 9.5;
const BRUSH = 9.6, MIRROR = 12.0, SHOVE = 12.9, FIB = 13.4, D0 = 14.6;
const TRAY = 14.7, GOBBLE = 15.2, MINE = 16.4, SWELL = 16.9, UGH = 17.4, BURP0 = 18.2, E0 = 20.8;
const SNIFF = 21.0, AH = 21.4, ACHOO = 22.8, CROWN = 24.0, CLANK = 24.8, F0 = 25.6;
const OPIN = 25.7, SHOUT0 = 25.9, DOOR = 28.0, SMACK1 = 28.5, SMACK2 = 29.4, SQUEEZE = 29.8, POP0 = 30.0, G0 = 31.4;
const CRAZY = 31.5, PEN = 33.6, OFFER0 = 34.0, BRAHMA = 36.8, RESTORE = 38.0, WISH = 39.0, GRASS = 41.4, FLICK = 42.0, HUMAN = 43.6, RAMA = 44.2, H0 = 46.0;
const BAD = 46.1, TAGS = 48.4, BURN = 51.0, FW = 51.2, I0 = 53.6;
const ASK = 53.7, WIPE = 56.8;
const CARD = 57.1, CARD_CAP = 57.2, COVERS = 57.4, PRICE = 58.1, LOGO = 58.4, PILL = 58.7, FOLLOW = 59.1, END = 61.6;
const wake = i => WAKE + (i - 1) * .13;
const ACHOO_ORDER = [0, 1, 2, 3, 4, 6, 7, 8, 9];
const achooT = i => i === 5 ? CROWN : ACHOO + ACHOO_ORDER.indexOf(i) * .12;
const OFFER_ORDER = [9, 0, 8, 1, 7, 2, 6, 3, 5];
const DPOP = [4, 3, 5, 2, 6, 1, 7, 0, 9, 8];
const dpopT = i => i === 8 ? POP0 + 1.0 : POP0 + DPOP.indexOf(i) * .09;
const pan = i => -.8 + i * .18;   // head i's place across the screen

const T = track(END);
seed(13);
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
// a snore: a rasping breath in, a fluttering whistle out
const snore = (amp = 1, f = 1) => { const o = new Float32Array(Math.round(1.3 * SR)); add(o, lp(tone(.6, t => f * (70 + 15 * Math.sin(t * 6)), { type: 'saw', e: env.hann(), fm: t => .4 * Math.sin(t * 2 * Math.PI * 38), amp }), 700), 0); add(o, tone(.45, t => f * (900 - 300 * t / .45), { e: env.hann(), amp: amp * .25 }), .7); return o; };
// the alarm: a bell hammered fast between two notes
const alarm = (d, amp = 1) => { const o = new Float32Array(Math.round((d + .4) * SR)); for (let k = 0; k * .045 < d; k++) add(o, bell(note(k % 2 ? 98 : 96), .25, { k: 9, amp }), k * .045); return o; };
const scrub = (d, amp = 1) => { const n = noise(d, { hp: t => 2200 + 1800 * Math.abs(Math.sin(t * 2 * Math.PI * 6)), lp: 9000, e: env.swell(.1, .2), amp }); for (let i = 0; i < n.length; i++) n[i] *= .4 + .6 * Math.abs(Math.sin(i / SR * 2 * Math.PI * 6)); return n; };
const chomp = (amp = 1) => mixb(crunch(amp * .6), tone(.08, t => 220 - 900 * t, { type: 'tri', e: env.pluck(30), amp: amp * .5 }));
const burpF = (f, amp = 1, d = .45) => lp(tone(d, t => f * (1 - .25 * t / d), { type: 'saw', e: env.swell(.03, .12), fm: t => .5 * Math.sin(t * 2 * Math.PI * 31), amp }), 700);
const achoo = (f, amp = 1, big = 1) => mixb(voice([[0, .12 * big, 1.6, .9]], f, { amp: amp * .8 }), noise(.35 * big, { hp: 1200, lp: 9000, e: env.ad(.005, .12 * big), amp }));
const fireLoop = (d, amp = 1) => mixb(crackle(d, amp), noise(d, { lp: 500, hp: 40, e: env.swell(.3, .3), brown: true, amp: amp * .6 }));
const whistleUp = (amp = 1) => slide(.35, 600, 2400, amp);
const boom = (amp = 1) => mixb(thud(amp), crackle(.6, amp * .6), noise(.4, { lp: 1500, hp: 60, e: env.ad(.005, .15), amp: amp * .7 }));
const cheer = (d, amp = 1) => { const o = mixb(noise(d, { lp: 2400, hp: 300, e: env.swell(.3, .5), amp: amp * .7 })); for (let k = 0; k < 14; k++) add(o, voice([[0, .3 + rnd() * .3, 1 + rnd() * .5, .8]], 220 + rnd() * 200, { amp: amp * .35 }), rnd() * (d - .6)); return o; };
const yawn = (f, amp = 1) => voice([[0, .75, 1.2, .8]], f, { amp, fall: .5 });

// ---- A+B: the bed: snores, the peek, the alarm, twenty hands, SMASH, the one who did NOT wake
T.at(0, drone(RING, 52, .5), .12, 0);
for (let k = 0; k < 4; k++) { T.at(k * 1.15, snore(1, 1), .35, pan(0)); T.at(.4 + k * 1.15, snore(.8, 1.25), .22, pan(4)); T.at(.8 + k * 1.15, snore(.7, .85), .2, pan(8)); }
T.at(PEEK, click(.6), .2, .1); T.at(PEEK + .05, plink(note(88)), .2, .1);
T.at(TEN, plink(note(84)), .25, 0); T.at(TEN + .35, plink(note(88)), .25, 0);
T.at(RING, alarm(SMASH - RING, 1), .3, .2);
for (let i = 1; i < 10; i++) T.at(wake(i), voice([[0, .14, 1 + i * .06, .8]], 200), .22, pan(i));   // ten "hm?!"s (nine), rising
T.at(REACH, whoosh(.5, 500, 2400), .35, -.3); T.at(REACH + .1, whoosh(.5, 400, 2000), .3, .3);
T.at(REACH + .65, crinkle(SMASH - REACH - .65, 1), .25, 0);
T.at(SMASH, impactBoom(1), .55, .1); T.at(SMASH + .05, boing(.7, 1.6), .25, 0);
for (let k = 0; k < 4; k++) T.at(SMASH + .15 + k * .12, plink(note(90 + k * 2)), .14, -.6 + k * .4);
T.at(NINE, plink(note(84)), .2, 0);
for (let k = 0; k < 2; k++) T.at(NINE + .1 + k * 1.2, snore(1, 1), .4, pan(0));
T.at(YELL, voice([[0, .22, 1.3, 1], [.26, .3, 1.5, 1]], 190, { amp: 1, growl: 1.5 }), .55, -.4);   // WAKE UP!!
T.at(YELL + .1, pop(1, 1.3), .4, -.7);
T.at(YELL + .55, snore(1, 1), .35, pan(0));
T.at(C0 - .3, whoosh(.4, 600, 3500), .35, .3);

// ---- C: the mirror: scrubbing, the show-off, the shove, DONE!
T.at(BRUSH, scrub(D0 - BRUSH - .3, 1), .3, 0);
for (let k = 0; k < 10; k++) T.at(BRUSH + .5 + k * .25, plink(note(96 + (k % 3) * 2), .5), .07, -.6 + (k % 5) * .3);   // foam bubbles
T.at(BRUSH, plink(note(84)), .2, 0); T.at(BRUSH + .35, plink(note(91)), .25, 0);
T.at(MIRROR, shimmer(1, [84, 88, 91, 96].map(note), .5, .07), .25, -.2);
T.at(MIRROR + .4, voice([[0, .18, 2.2, .6]], 260), .3, 0);   // mwah
T.at(SHOVE, mixb(thud(.8), boing(.8, 1.2)), .45, -.2);
T.at(SHOVE + .1, slide(.6, 1200, 500, .5), .18, -.3);
T.at(FIB, ting(96), .35, .5); T.at(FIB + .15, pop(.7, 1.4), .3, .5);
T.at(D0 - .3, whoosh(.6, 400, 3000), .35, 0);

// ---- D: breakfast: munching, MINE, the swell, the buttons, the gurgle, ten burps
T.at(TRAY, plink(note(84)), .2, 0); T.at(TRAY + .4, plink(note(88)), .25, 0);
for (let c = GOBBLE + .2; c < MINE; c += .21) T.at(c, chomp(.8 + rnd() * .3), .3, pan(1));
T.at(MINE - .4, whoosh(.3, 800, 2400), .25, .4); T.at(MINE + .3, chomp(1), .35, pan(6)); T.at(MINE + .45, chomp(.8), .3, pan(6));
T.at(SWELL, slide(.4, 160, 520, 1), .3, 0);
T.at(SWELL + .3, mixb(click(1), plink(note(93))), .35, -.4); T.at(SWELL + .38, mixb(click(1), plink(note(95))), .35, .4);
T.at(UGH, gurgle(.8, .9), .4, 0);
for (let i = 0; i < 10; i++) T.at(BURP0 + i * .16, burpF(78 + i * 9, 1, i === 1 ? .6 : .4), i === 1 ? .55 : .4, pan(i));
T.at(E0 - .3, plink(note(91)), .15, 0);

// ---- E: one sneeze = ten
T.at(SNIFF, noise(.25, { hp: 1500, lp: 5000, e: env.hann(), amp: 1 }), .25, pan(5)); T.at(SNIFF + .25, noise(.2, { hp: 1500, lp: 5000, e: env.hann(), amp: 1 }), .25, pan(5));
T.at(AH, voice([[0, .5, 1.3, .7], [.7, .6, 1.5, .8]], 210, { amp: 1, fall: -.1 }), .3, -.2);
T.at(AH + .1, voice([[0, .5, 1.1, .7], [.7, .6, 1.3, .8]], 170, { amp: .8, fall: -.1 }), .25, .3);
for (const i of ACHOO_ORDER) T.at(achooT(i), achoo(200 + i * 18, 1), .38, pan(i));
T.at(CROWN - .5, voice([[0, .45, 1.6, .9]], 220, { fall: -.2 }), .35, pan(5));   // AH—
T.at(CROWN, achoo(170, 1.3, 1.8), .6, pan(5));
T.at(CROWN + .05, whoosh(.75, 900, 3000), .35, 0);
for (let k = 0; k < 5; k++) T.at(CROWN + .1 + k * .14, click(.5), .12, .4 - k * .25);   // the mukut spinning
T.at(CLANK, clang(note(79), 1), .4, pan(0)); T.at(CLANK + .03, boing(.7, 1.3), .25, pan(0));
T.at(CLANK + .35, shimmer(.8, [88, 91, 96].map(note), .5, .06), .25, pan(0));
T.at(F0 - .3, whoosh(.4, 600, 3500), .35, .3);

// ---- F: ten opinions, one door
const shoutP = [1.1, 1.0, 1.4, .8, .9, 1.2, 1.3, 1.25, .7, 1.5];
for (let i = 0; i < 10; i++) T.at(SHOUT0 + i * .15, voice([[0, .16, shoutP[i], 1], [.2, .18, shoutP[i] * .9, .9]], 200, { growl: i === 3 ? 1.5 : .4 }), .26, pan(i));
for (let k = 0; k < 4; k++) T.at(DOOR + .05 + k * .11, thud(.6), .3, 0);
T.at(SMACK1, impactBoom(1), .5, 0); T.at(SMACK1 + .05, boing(.7, 1), .25, 0);
T.at(SMACK2 - .22, thud(.6), .3, 0); T.at(SMACK2, impactBoom(1.1), .55, 0); T.at(SMACK2 + .05, boing(.8, .9), .25, 0);
T.at(SMACK2 + .2, lp(tone(.6, t => 300 - 220 * t / .6, { type: 'saw', e: env.swell(.05, .2), fm: t => .2 * Math.sin(t * 2 * Math.PI * 30), amp: 1 }), 900), .3, 0);   // squeeeeze
for (let i = 0; i < 10; i++) T.at(dpopT(i), pop(1, .9 + i * .05), i === 8 ? .5 : .32, pan(i));
T.at(POP0 + .45, voice([[0, .32, .7, .6]], 160, { growl: .6 }), .4, pan(8));   // NO.
T.at(G0 - .3, whoosh(.6, 300, 1800), .3, 0);

// ---- G: long ago: the fire, the heads, Brahma, the grass
T.at(G0, fireLoop(HUMAN - G0, 1), .2, 0);
T.at(CRAZY, mixb(thud(.6), bell(note(50), 1.6, { amp: .6 })), .35, 0); T.at(CRAZY + .4, plink(note(86)), .2, 0);
for (let k = 0; k < 6; k++) T.at(PEN + k * .52, whoosh(.5, 300, 2400), .14, -.5 + (k % 2));   // days and nights racing
for (let k = 0; k < 24; k++) T.at(PEN + k * .13, click(.5), .06, .6);                       // a clock ticking fast
OFFER_ORDER.forEach((i, j) => { const t0 = OFFER0 + j * .26; T.at(t0, slide(.3, 500, 900, .6), .14, pan(i)); T.at(t0 + .5, poof(1), .3, 0); T.at(t0 + .5, plink(note(91 - j * 2)), .2, .6); });
T.at(BRAHMA, shimmer(2, [72, 76, 79, 84, 88, 91].map(note), .6, .12), .4, 0);
T.at(BRAHMA, drone(2.2, 55, .6), .2, 0);
[0, 1, 2].forEach(j => T.at(BRAHMA + .35 + j * .27, plink(note(84 + j * 3)), .3, .2));
T.at(BRAHMA + .35 + 3 * .27, boing(.7, 1.5), .3, .3);   // 4?!
for (let i = 0; i < 10; i++) if (i !== 4) T.at(RESTORE + Math.abs(i - 4) * .07, pop(.8, 1 + Math.abs(i - 4) * .1), .28, pan(i));
for (let i = 0; i < 10; i++) T.at(WISH + .1 + i * .2, voice([[0, .14, 1 + (i % 4) * .1, .8], [.18, .14, 1.1, .8]], 190 + (i % 3) * 20, { growl: .3 }), .18, pan(i));
T.at(WISH + .6, ting(91), .2, 0);
T.at(GRASS, mixb(click(.8), slide(.12, 1800, 2600, .4)), .3, -.4);
T.at(FLICK, mixb(click(1), tone(.08, 2600, { e: env.pluck(40), amp: .8 })), .45, -.2); T.at(FLICK + .02, whoosh(.45, 1200, 4000), .25, .4);
T.at(FLICK + .1, laugh(6, 210, 1), .35, -.3); T.at(FLICK + .2, laugh(5, 260, .8), .3, .3);
T.at(HUMAN - .25, whoosh(.4, 600, 3500), .3, .3);

// ---- the sunrise: RAMA
T.at(HUMAN, drone(H0 - HUMAN, 58, .7), .2, 0);
T.at(HUMAN + .2, slide(.9, 300, 900, .3), .1, -.4);   // the blade drifting
T.at(RAMA, shimmer(1.6, [74, 79, 83, 86, 91].map(note), .7, .1), .4, 0);
T.at(RAMA + .1, ting(98), .35, -.4);   // the glint on the bow
T.at(H0 - .3, whoosh(.6, 300, 2000), .3, 0);

// ---- H: Dussehra night
T.at(H0, noise(BURN - H0, { lp: 1200, hp: 200, e: env.swell(.5, .5), amp: 1 }), .06, 0);   // the crowd, murmuring
T.at(BAD, mixb(thud(.4), bell(note(52), 1.4, { amp: .5 })), .3, 0);
for (let i = 0; i < 10; i++) T.at(TAGS + i * .18, mixb(click(.7), plink(note(79 + i * 2))), .26, pan(i));
T.at(BURN, whoosh(.8, 300, 3000), .4, 0);
T.at(BURN + .2, noise(I0 - BURN - .2, { hp: 2500, lp: 9000, e: env.swell(.3, .3), amp: 1 }), .1, 0);   // the fountains
T.at(BURN + .1, cheer(I0 - BURN, 1), .35, 0);
for (let k = 0; k < 9; k++) { T.at(FW + k * .26, whistleUp(.6), .12, -.6 + (k % 5) * .3); T.at(FW + k * .26 + .35, boom(.8), .3, -.6 + (k % 5) * .3); }

// ---- I: the ask: a yawn wave, the name tags
T.at(I0, mixb(plink(note(84)), shimmer(.6, [88, 91].map(note), .4, .05)), .25, 0);
for (let i = 1; i < 10; i++) T.at(ASK + .2 + i * .14, yawn(150 + i * 14, 1), .22, pan(i));
T.at(ASK + .4, snore(1, 1), .3, pan(0)); T.at(ASK + 1.7, snore(1, 1), .3, pan(0));
for (let i = 0; i < 10; i++) T.at(ASK + 1.0 + i * .08, click(.6), .14, pan(i));
T.at(ASK, shimmer(2.6, [79, 83, 86, 91].map(note), .7, .2), .12, 0);
T.at(WIPE, whoosh(.6, 400, 3000), .35, 0);

// ---- the card
T.at(LOGO, plink(note(84)), .25, 0);
[0, .12, .24].forEach((d, i) => T.at(COVERS + d, plink(note(86 + i * 3)), .28, -.4 + i * .4));
T.at(PRICE, ting(96), .3, 0);
T.at(PILL, mixb(click(1), plink(note(91))), .35, 0);
T.at(FOLLOW, shimmer(1.5, [84, 88, 91, 96].map(note), .4, .15), .2, 0);

T.write('assets/heads_sfx.wav');
