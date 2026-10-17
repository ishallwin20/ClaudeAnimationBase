// k15_sfx.mjs: the sound effects for the 15K thank-you reel (src/scenes/k15.js) → assets/k15_sfx.wav.
// Times are the scene's constants (keep them in sync). The signatures: a party murmur and string-light tinkle, Sher's
// strain and the cake's thud, Kali's slurp and Shiva's "oof", Hanuman's AAM gulp and the power-down into the dark,
// Shumbha's ring box and the third eye's boom, a goat's trotting and MEH, ten heads' "MINE!", the strain and creak of the
// lift, a falling whistle for the toe, the SPLAT, a drip in the silence, the topper's boing, the self-timer's beeps
// and the shutter, the gift's pop and the books' whooshes, the card's chimes.
import { track, tone, noise, bell, mixb, env, whoosh, rumble, plink, clang, click, thud, crunch, crinkle, shimmer, slide, gurgle, squeak, chirp, laughter, chime, splash, note, seed, rnd, clamp, lerp, SR } from './sfx.mjs';

const UP = 2.2, B0 = 3.2, SET = 4.7, PHEW = 5.6, C0 = 7.6;
const SEE = 8.0, LICK = 9.0, BACK = 10.4, STEP = 10.8, BITE = 11.2, THUMB = 12.0, D0 = 13.8;
const EYE = 14.1, DROOL = 14.8, WIG = 16.0, LEAP = 16.5, GULP = 17.1, DARK = 17.25, E0 = 20.6;
const RING = 21.0, KNEEL = 21.4, LOOK = 23.6, EYE3 = 23.9, FLEE = 24.7, F0 = 26.6;
const GOAT = 26.7, NANDI = 29.2, BUTT = 30.0, G0 = 31.8;
const MINE = 32.2, GRAB = 34.2, LIFT = 34.6, TOE = 37.0, SPLAT = 37.6, MILLION = 39.0, H0 = 40.8;
const TOPPER = 41.0, HOST = 43.8, TIMER = 45.6, FLASH = 46.8, I0 = 49.8;
const GIFT = 50.0, OPEN = 51.2, FLY = 52.0, CARD = 53.6;
const CAP_T = 53.7, COVERS = 54.0, PRICE = 54.8, STRIKE = 55.3, DEAD = 55.8, PILL = 56.3, SUB = 56.8, FOLLOW = 57.3, END = 61.0;

const T = track(END);
seed(15);
const lp = (b, fc) => { let l = 0; const a = 1 - Math.exp(-2 * Math.PI * fc / SR); for (let i = 0; i < b.length; i++) { l += a * (b[i] - l); b[i] = l; } return b; };
const add = (o, b, s0, g = 1) => { const s = Math.round(s0 * SR); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j] * g; return o; };
// a buzzy cartoon voice (from ad 13): syllables [start, dur, pitch ×, brightness 0..1]
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
const boing = (amp = 1, f = 1) => tone(.45, t => f * (300 + 500 * Math.sin(Math.PI * clamp(t / .3))) * (1 + .08 * Math.sin(t * 2 * Math.PI * 22)), { type: 'tri', e: env.ad(.005, .15), amp });
const pop = (amp = 1, f = 1) => mixb(click(amp), tone(.07, t => f * (500 + 2600 * t / .07), { e: env.pluck(40), amp: amp * .7 }));
const murmur = (d, amp = 1) => { const b = noise(d, { hp: 300, lp: 1400, e: env.swell(.6, .6), amp }); for (let i = 0; i < b.length; i++) { const t = i / SR; b[i] *= .55 + .45 * Math.sin(t * 7.3) * Math.sin(t * 3.1 + 1); } return b; };
const tinkle = (d, amp = 1) => { const o = new Float32Array(Math.round((d + 1) * SR)); for (let k = 0; k * .35 < d; k++) add(o, bell(note(84 + [0, 4, 7, 12, 9][k % 5]), .6, { amp: amp * (.5 + .5 * rnd()) }), k * .35 + rnd() * .1); return o; };
const slurp = (d, amp = 1) => mixb(lp(gurgle(d, amp), 2200), tone(d, t => 260 + 520 * (t / d), { type: 'tri', e: env.swell(.05, .2), amp: amp * .35 }), noise(d, { hp: 1500, lp: 5000, e: env.swell(.05, .2), amp: amp * .25 }));
const squish = (amp = 1) => mixb(lp(gurgle(.25, amp), 1200), thud(amp * .6), noise(.2, { hp: 200, lp: 1600, e: env.pluck(14), amp: amp * .5 }));
const gulp = (amp = 1) => mixb(tone(.22, t => 180 - 260 * t, { e: env.pluck(10), amp }), pop(amp * .6, .4));
const powerDown = (amp = 1) => mixb(slide(.6, 520, 70, amp), click(amp * .8));
const hoof = (amp = 1) => mixb(click(amp), tone(.05, 900, { e: env.pluck(80), amp: amp * .5 }));
const meh = (amp = 1) => lp(voice([[0, .7, 1, .55]], 260, { amp, growl: 2.2, fall: .2 }), 2600);
const creak = (d, amp = 1) => { const o = tone(d, t => 140 + 60 * Math.sin(t * 9), { type: 'saw', e: env.swell(.1, .2), amp }); for (let i = 0; i < o.length; i++) o[i] *= .4 + .6 * (Math.sin(i / SR * 2 * Math.PI * 17) > 0 ? 1 : .2); return lp(o, 1500); };
const fallWhistle = (d, amp = 1) => tone(d, t => 2200 * Math.pow(500 / 2200, t / d), { e: env.swell(.05, .05), amp });
const beep = (amp = 1) => tone(.07, 1760, { e: env.pluck(30), amp });
const shutter = (amp = 1) => mixb(click(amp), noise(.08, { hp: 1500, lp: 7000, e: env.pluck(40), amp: amp * .6 }), click(amp * .7).map((v, i, a) => a[Math.max(0, i - 2600)] || 0));

// ---- A + B · the hook and Sher: the party murmur, the strain, the thud, the phew
T.at(0, murmur(PHEW, 1), .12);
T.at(0, tinkle(C0, .6), .08, .2);
T.at(.15, lp(voice([[0, 1.1, 1, .2], [1.3, .9, 1.05, .2]], 95, { amp: 1, growl: 1.5, fall: 0 }), 900), .32, -.2);   // Sher straining
[.6, 1.4, 2.4].forEach((s, i) => T.at(s, plink(note(88 - i * 2), .8), .2, -.1));   // sweat drips
T.at(UP, whoosh(.9, 300, 1800), .25);
T.at(B0, shimmer(.6, [note(76), note(79), note(84)], .8), .22);
T.at(SET - .55, slide(.45, 300, 600, .5), .15);
T.at(SET, thud(1), .55, .1); T.at(SET + .02, clang(note(91), .5), .08, .1);
T.at(PHEW, noise(.9, { hp: 300, lp: 2200, e: env.swell(.05, .6), amp: 1 }), .25, -.2);
[0, .35, .7, 1.05].forEach(d => T.at(PHEW + .9 + d, noise(.18, { hp: 400, lp: 2600, e: env.hann(), amp: .7 }), .14, -.2));   // pant
// ---- C · Kali: the whip, the hearts, the slurp, the step on Shiva
T.at(C0 - .3, whoosh(.45, 500, 4000), .35, .4);
T.at(SEE, shimmer(.5, [note(81), note(85), note(88)], .7), .2, .3);
T.at(SEE + .1, boing(.6, 1.4), .16, .3);
T.at(LICK - .15, slide(.2, 300, 900, .5), .18, .2);
T.at(LICK, slurp(.85, 1), .5, -.1);
T.at(LICK + .95, pop(1, .8), .4, .2);   // the smack
T.at(BACK, whoosh(.35, 400, 2400), .2, .3);
T.at(STEP, squish(1), .55, .4);
T.at(STEP + .05, lp(voice([[0, .32, 1.1, .5]], 150, { amp: 1, fall: .4 }), 1600), .4, .5);   // Shiva: "oof"
T.at(BITE, slide(.6, 700, 350, .6), .2, .3);   // the embarrassed slide
T.at(THUMB, ting(88, .9), .3, .5);
// ---- D · Hanuman: the lamp, the drool, the wiggle, AAM, the dark
T.at(D0 - .3, whoosh(.4, 4000, 500), .3);
T.at(EYE, shimmer(.6, [note(84), note(88), note(91), note(96)], .7), .2, -.3);
T.at(DROOL + .4, plink(note(70), 1), .3, -.3);
for (let i = 0; i < 8; i++) T.at(WIG + i * .06, squeak(900 + (i % 2) * 300, 1200 + (i % 2) * 300, .05, .7), .12, -.3);
T.at(LEAP, slide(.6, 300, 1400, .8), .3, -.1);
T.at(LEAP, whoosh(.6, 400, 3500), .25, .1);
T.at(GULP - .05, voice([[0, .25, 1.6, .9]], 300, { amp: 1 }), .3, .2);   // "AAM"
T.at(GULP + .08, gulp(1), .6, .2);
T.at(DARK, powerDown(1), .45);
T.at(GULP + .7, thud(.6), .3, -.2);
T.at(DARK + .5, tone(2.4, t => 220 + 3 * Math.sin(t * 6), { e: env.swell(.5, .6), amp: 1 }), .06);   // the hum of glowing cheeks
T.at(GULP + 2.2, laughter(.8, 1), .15, .3);   // the room giggles in the dark
// ---- E · Shumbha: a romantic tinkle, the ring box, the one look
T.at(E0 + .1, shimmer(1.4, [note(72), note(76), note(79), note(83), note(84)], .7, .18), .2, -.2);
T.at(RING, click(1), .4, -.3); T.at(RING + .05, shimmer(.5, [note(96), note(100), note(103)], .7, .04), .25, -.3);
T.at(KNEEL, boing(.5, .8), .12, -.3);
T.at(LOOK, tone(.6, 90, { type: 'tri', e: env.swell(.1, .3), amp: 1 }), .2);
T.at(EYE3, mixb(thud(1), rumble(.9, .8), clang(note(38), .5)), .6, .3);
T.at(EYE3 + .1, slide(.5, 1800, 600, .6), .18, -.3);   // his yelp
T.at(FLEE, whoosh(.4, 600, 5000), .35, -.6); T.at(FLEE + .02, pop(1, .6), .3, -.5);
T.at(F0 - .15, shimmer(.4, [note(84), note(91)], .6), .2);
// ---- F · the goat and Nandi
for (let k = 0; k * .14 < 1.6; k++) T.at(GOAT + k * .14, hoof(.8), .22, -.6 + k * .05);
T.at(GOAT + 1.7, chirp(1), .1, -.1);   // a proud little pose
for (let k = 0; k < 6; k++) T.at(NANDI + k * .27, thud(.5), .25, -.7 + k * .1);
T.at(BUTT, mixb(thud(1), crunch(.5)), .5);
T.at(BUTT + .05, meh(1), .45, .3);
T.at(BUTT + .05, whoosh(.7, 600, 3000), .3, .5);
T.at(BUTT + .8, noise(.4, { hp: 300, lp: 1800, e: env.ad(.02, .3), amp: 1 }), .2, -.2);   // Nandi's snort
T.at(G0 - .3, whoosh(.5, 400, 2500), .3);
// ---- G · Ravana: MINE!, the lift, the falling toe, the SPLAT
T.at(MINE, mixb(...[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => voice([[i * .03, .7, 1 + i * .06, .5]], 140 + i * 12, { amp: .3 }))), .5);   // ten heads: "ooooh"
T.at(MINE + .3, voice([[0, .2, 1.2, .8], [.24, .32, 1, .7]], 190, { amp: 1, growl: .8 }), .45, .3);   // "MI-NE!"
T.at(GRAB, mixb(...[0, 1, 2].map(i => voice([[i * .12, .2, .9, .4]], 110, { amp: .6, growl: 1 }))), .35);
T.at(LIFT, rumble(1.0, .8), .25);
T.at(LIFT, creak(2.2, 1), .14);
T.at(LIFT + .3, lp(voice([[0, 1.8, 1, .25]], 85, { amp: 1, growl: 2, fall: 0 }), 900), .3);   // the strain
T.at(TOE - .05, fallWhistle(.5, 1), .2, -.1);
T.at(TOE + .45, plink(note(84), 1), .5);   // the toe: boop
T.at(SPLAT, mixb(thud(1), crunch(.8), splash(.9), lp(gurgle(.35, 1), 1500)), .85);
for (let k = 0; k < 7; k++) T.at(SPLAT + .15 + k * .07 + rnd() * .04, lp(gurgle(.12, .8), 1600), .2, -.8 + k * .26);   // splats land
T.at(SPLAT + .5, mixb(...[0, 1, 2].map(i => tone(1.0, t => 600 + i * 200 + 80 * Math.sin(t * 14 + i), { type: 'tri', e: env.swell(.05, .6), amp: .3 }))), .1);   // dizzy birdies
T.at(MILLION, ting(93, .8), .22);
// ---- H · the silence, the drip, the topper, the thank-you, the photo
T.at(H0 + .1, plink(note(76), 1), .25);
T.at(TOPPER, fallWhistle(.5, .8), .15, -.1);
T.at(TOPPER + .5, mixb(thud(.6), boing(.8, 1)), .4, -.1);
T.at(HOST, shimmer(1.2, [note(67), note(72), note(76), note(79)], .8, .16), .26);
T.at(HOST + .2, chime(note(84), .7, 2), .12);
for (let k = 0, s = TIMER; s < FLASH - .05; k++) { T.at(s, beep(1), .22, -.5); s += Math.max(.08, .42 - k * .06); }
for (let k = 0; k < 6; k++) T.at(TIMER + .1 + k * .09, squeak(1800, 2200, .04, .6), .1, -.5 + k * .2);   // Mooshak's scamper
T.at(FLASH, shutter(1), .6);
T.at(FLASH + .02, noise(.25, { hp: 3000, lp: 9000, e: env.ad(.005, .2), amp: 1 }), .2);
T.at(FLASH + .25, shimmer(2.5, [note(72), note(76), note(79), note(84), note(88)], .9, .12), .3);
T.at(FLASH + .3, chime(note(60), .8, 3), .18);
// ---- I · the gift
T.at(I0 - .3, whoosh(.5, 500, 3000), .3);
T.at(GIFT, slide(.6, 200, 500, .7), .2);
T.at(GIFT + .65, thud(.5), .3);
T.at(OPEN, pop(1, 1), .5); T.at(OPEN + .03, shimmer(.8, [note(84), note(88), note(91), note(96)], .9, .05), .3);
[0, .12, .24].forEach((d, i) => T.at(FLY + d, whoosh(.5, 800, 4000), .25, -.6 + i * .6));
// ---- J · the card
T.at(CARD - .3, whoosh(.5, 400, 2500), .3);
T.at(CAP_T, chime(note(79), .8), .25);
[0, .12, .24].forEach((d, i) => T.at(COVERS + d, pop(.8, 1 + i * .2), .3, -.4 + i * .4));
T.at(PRICE, click(1), .2);
T.at(STRIKE, whoosh(.25, 2000, 6000), .3); T.at(STRIKE + .05, ting(91, .9), .35);
T.at(DEAD, click(.8), .15);
T.at(PILL, pop(1, 1.2), .4); T.at(PILL + .02, chime(note(84), .7), .2);
T.at(FOLLOW, shimmer(.8, [note(88), note(91), note(96)], .7, .08), .2);
T.write('assets/k15_sfx.wav');
