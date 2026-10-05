// kalaratri_sfx.mjs: the sound effects for "Why does the SCARIEST goddess ride a DONKEY?" (src/scenes/kalaratri.js)
// → assets/kalaratri_sfx.wav. Times are the scene's constants (keep them in sync). Dense in the hook; the HEE-HAW is the
// signature, and the lightning is the loudest thing in the film.
import { track, tone, noise, bell, mixb, env, whoosh, rumble, plink, clang, squeak, click, thud, crunch, crackle, shimmer, wah, slide, drone, gurgle, note, seed, rnd, clamp, lerp, SR } from './sfx.mjs';

const CRACK0 = .15, FIRE0 = .45, PULL0 = .9, GRIN = 1.55, BRAY_A = 1.65, LOOKDOWN = 2.4, BLINK = 2.8, WHIP_A = 3.9, B0 = 4.2;
const NAME = 4.4, KAAL = 6.6, RATRI = 7.3, LABELS = [8.9, 9.5, 10.1, 10.7], WIPE_B = 11.6, C0 = 11.8;
const WHY = 12.0, TWIRL = 13.2, ARROW = 14.0, DROP_LAND = 14.9, POPS = [15.4, 15.8, 16.2, 16.5, 16.8], BONK = 16.4,
  DURGA = 17.0, INK0 = 17.4, EYE3 = 18.6, BOLT = 18.8, SLASH = 19.4, ZAPS = [19.6, 19.8, 20.0, 20.2, 20.4, 20.6], ALONE = 21.0, FLASH = 21.4, D0 = 22.0;
const LINEUP = [22.3, 22.7, 23.1, 23.5, 23.9], DONKEY_IN = 24.4, BRAY_D = 24.65, JAW = 24.9, PASTURE = 26.6, EYES = 27.0,
  HORSE = 27.2, PLANT = 28.0, BRAY_W = 28.2, CREEP = 28.6, SPIN = 28.95, KICK = 29.1, TWINKLE = 29.8, FARMERS = 30.2, RIDE_IN = 32.2, SCRATCH = 34.4, E0 = 36.6;
const SCARY = 36.8, WINDOW = 37.4, SOFT = 37.9, SHUBH = 39.9, LICK = 40.8, DARK_LINE = 42.2, F0 = 44.4;
const COMMENT = 44.5, WAVES = [44.9, 45.1, 45.3], IRIS = 47.8, CARD = 48.3, COVER7 = 48.7, ROW13 = 49.4, PRICE = 49.8, LOGO = 50.3, PILL = 50.6, FOLLOW = 51.1;

const T = track(54.1);
seed(11);
const cat = (...parts) => { const n = parts.reduce((a, p) => a + p.length, 0), o = new Float32Array(n); let s = 0; for (const p of parts) { o.set(p, s); s += p.length; } return o; };
const lp = (b, fc) => { let l = 0; const a = 1 - Math.exp(-2 * Math.PI * fc / SR); for (let i = 0; i < b.length; i++) { l += a * (b[i] - l); b[i] = l; } return b; };
// a donkey's HEE-HAW: a nasal rising "hee" (an in-breath) and a honking falling "haw", n times
const honk = (d, f0, f1, amp) => lp(tone(d, t => lerp(f0, f1, t / d), { type: 'saw', e: env.swell(.025, .06), fm: t => .006 * Math.sin(t * 2 * Math.PI * 28), amp }), 1900);
const heehaw = (n = 2, amp = 1) => { const parts = []; for (let i = 0; i < n; i++) parts.push(honk(.2, 760, 980, amp * .8), honk(.3, 420, 300, amp)); return cat(...parts); };
const zapS = (amp = 1) => mixb(crackle(.22, amp), tone(.18, t => 2600 * Math.exp(-t * 12) + 500, { type: 'square', e: env.pluck(14), amp: amp * .25 }));
const thunder = (amp = 1) => mixb(noise(.25, { hp: 300, lp: 8000, e: env.pluck(10), amp }), rumble(1.4, amp * .8));
const fwoosh = (amp = 1) => mixb(noise(.6, { lp: t => 400 + 3000 * Math.sin(Math.PI * clamp(t / .6)), hp: 120, e: env.hann(), amp }), noise(.5, { lp: 300, brown: true, e: env.hann(), amp: amp * .6 }));
const ting = (m, amp = 1) => bell(note(m), 1.3, { amp });
const pop = (f = 300, amp = 1) => squeak(f, f * 3, .08, amp);
const poof = (amp = 1) => noise(.35, { lp: 1800, hp: 150, e: env.ad(.01, .1), amp });
const rattle = (amp = 1) => { const o = new Float32Array(Math.round(.5 * SR)); for (let i = 0; i < 7; i++) { const c = mixb(click(amp), tone(.04, 700 + rnd() * 500, { type: 'tri', e: env.pluck(80), amp: amp * .5 })), s = Math.round((i * .06 + rnd() * .02) * SR); for (let j = 0; j < c.length && s + j < o.length; j++) o[s + j] += c[j]; } return o; };
const howl = (amp = 1) => tone(1.5, t => t < .4 ? lerp(380, 720, t / .4) : t < 1.1 ? 720 - 40 * Math.sin((t - .4) * 6) : lerp(700, 420, (t - 1.1) / .4), { e: env.swell(.15, .35), fm: t => .004 * Math.sin(t * 2 * Math.PI * 5.5), amp });
const whinny = (amp = 1) => lp(tone(.8, t => 700 + 260 * Math.sin(t * 40) * (1 - t) - 200 * t, { type: 'saw', e: env.swell(.03, .25), amp }), 2600);
const hoof = (amp = 1) => mixb(tone(.08, 520, { type: 'tri', e: env.pluck(45), amp }), noise(.05, { hp: 700, lp: 3500, e: env.pluck(55), amp: amp * .5 }));
const thwack = (amp = 1) => mixb(thud(amp), crunch(amp * .7), click(amp));
const slurp = (amp = 1) => mixb(noise(.35, { lp: t => 600 + 2400 * t / .35, hp: 300, e: env.hann(), amp }), gurgle(.3, amp * .5));
const sadTrombone = (amp = 1) => cat(wah(note(55), .32, amp), wah(note(54), .32, amp), wah(note(53), .32, amp), wah(note(52), .9, amp));

// ---- A: the hook (dense)
T.at(0, drone(4, 55, .6), .3, 0);
T.at(.02, crackle(.6, .7), .35, .1); T.at(CRACK0, zapS(1), .55, 0); T.at(CRACK0 + .02, thunder(.6), .3, 0);
T.at(FIRE0 - .05, noise(.12, { lp: 900, hp: 200, e: env.hann(), amp: .7 }), .35, .1);   // the sniff before the snort
T.at(FIRE0, fwoosh(1), .6, .3);
T.at(PULL0, whoosh(.55, 2600, 400), .4, 0);
T.at(GRIN - .02, plink(note(91)), .35, .3);
T.at(BRAY_A, heehaw(2, 1), .7, .3);
T.at(LOOKDOWN, slide(.35, 520, 300, .6), .2, -.1);
T.at(BLINK + .1, plink(note(86)), .3, .3); T.at(3.0, tone(.35, t => 900 - 600 * t, { type: 'tri', e: env.pluck(8), amp: .5 }), .3, .3);   // the ear flop
T.at(3.05, squeak(500, 1100, .16), .3, .3);
T.at(WHIP_A, whoosh(.32, 500, 4200), .45, .6);

// ---- B: who she is, the roll call
T.at(NAME, ting(79), .35, 0); T.at(NAME + .15, ting(86), .3, 0);
T.at(KAAL, drone(.8, 41, 1), .45, 0); T.at(RATRI, shimmer(1.2, [96, 100, 103, 108].map(note), .5), .35, .2);
T.at(8.75, whoosh(.5, 300, 2500), .35, 0);
LABELS.forEach((l, i) => T.at(l, ting(88 + i * 2), .4, i % 2 ? -.4 : .4));
T.at(LABELS[0] + .1, tone(.5, t => 300 + 200 * t, { e: env.swell(.05, .3), amp: .5 }), .25, .3);
T.at(LABELS[1], fwoosh(.8), .45, -.3);
T.at(LABELS[2], zapS(.9), .45, .3);
T.at(LABELS[3] + .05, rattle(.8), .5, -.3);
T.at(WIPE_B - .05, whoosh(.4, 600, 3200), .4, -.3);

// ---- C: Raktabija
T.at(WHY, drone(5, 49, .7), .25, 0);
[12.1, 12.35, 12.6, 12.85].forEach((s, i) => T.at(s, thud(.6), .35, .5 - i * .1));   // his stomping strut
T.at(TWIRL + .1, squeak(900, 1400, .2), .25, 0); T.at(TWIRL + .35, squeak(1400, 900, .2), .2, 0);
T.at(ARROW - .2, whoosh(.22, 1500, 5000), .4, -.6); T.at(ARROW, clang(note(91), .6), .4, -.2);
T.at(ARROW + .15, plink(note(84)), .4, -.2);
T.at(ARROW + .2, slide(.7, 900, 300, .5), .2, -.3);   // the drop falls (slow)
T.at(DROP_LAND, plink(note(72)), .55, -.3); T.at(DROP_LAND + .02, pop(250), .5, -.3);
POPS.forEach((p, i) => { const n = [2, 4, 4, 2, 2][i]; for (let k = 0; k < n; k++) T.at(p + k * .05, pop(300 + i * 90 + k * 30), .35, (rnd() - .5) * 1.4); });
T.at(BONK + .1, clang(note(72), .5), .35, 0); T.at(BONK + .2, shimmer(.4, [91, 95, 98].map(note), .3, .05), .25, 0);
T.at(DURGA, bell(note(64), 2.5, { amp: .7 }), .3, 0);
T.at(INK0, drone(1.6, 36, 1), .5, 0); T.at(INK0, noise(1.4, { lp: t => 2000 - 1200 * t, hp: 80, e: env.swell(.3, .4), amp: .5 }), .3, 0);
T.at(EYE3, shimmer(.6, [100, 103, 107].map(note), .6, .04), .4, 0);
T.at(BOLT, thunder(1), .85, 0); T.at(BOLT, zapS(1), .7, 0);
T.at(SLASH, whoosh(.25, 900, 7000), .55, .2);
ZAPS.forEach((z, i) => { T.at(z, zapS(.9), .45, .5 - i * .05); T.at(z + .06, poof(.7), .25, .5); });
T.at(ALONE + .05, tone(.25, t => 420 - 500 * t, { e: env.swell(.02, .1), amp: .7 }), .35, .4);   // the gulp
T.at(ALONE + .25, squeak(500, 1100, .16), .25, .4);
T.at(FLASH, zapS(1), .7, .3); T.at(FLASH + .02, thunder(.8), .6, .3); T.at(FLASH + .1, poof(1), .4, .3);
T.at(FLASH + .3, slide(.6, 1200, 700, .4), .15, .3);   // the moustache floats down

// ---- D: the rides, the wolf, the ride in
LINEUP.forEach((l, i) => T.at(l, shimmer(.5, [84 + i * 2, 88 + i * 2, 91 + i * 2].map(note), .4, .05), .35, -.2 + i * .1));
[DONKEY_IN - .3, DONKEY_IN - .15, DONKEY_IN, BRAY_D - .2].forEach((h, i) => T.at(h, hoof(.8), .35, .6));
T.at(BRAY_D, heehaw(2, 1), .7, .3);
T.at(JAW + .05, sadTrombone(.7), .3, 0);
T.at(PASTURE - .2, whoosh(.4, 3000, 500), .3, 0);
T.at(PASTURE, noise(5.5, { lp: 2600, hp: 1800, e: env.swell(.5, .5), amp: .08 }), .3, 0);   // crickets, a soft night hiss
for (let i = 0; i < 10; i++) T.at(PASTURE + .3 + i * .45, tone(.05, 4200, { e: env.pluck(60), amp: .3 }), .12, .3 - (i % 3) * .2);
T.at(EYES, howl(1), .45, .6);
T.at(HORSE + .15, whinny(1), .5, -.3);
for (let i = 0; i < 7; i++) T.at(HORSE + .5 + i * .11, hoof(.9), .35, -.4 - i * .08);
T.at(PLANT, thud(.5), .35, .1);
T.at(BRAY_W, heehaw(1, 1.1), .75, .1);
T.at(CREEP, noise(.8, { lp: 600, hp: 100, brown: true, e: env.swell(.2, .3), amp: .6 }), .25, .5);   // a low growl
T.at(SPIN - .05, whoosh(.2, 600, 3000), .35, .2);
T.at(KICK, thwack(1), .8, .3);
T.at(KICK + .08, squeak(900, 1600, .25), .4, .4);   // the yelp
T.at(KICK + .2, slide(.6, 600, 1400, .4), .2, .5);
T.at(TWINKLE, bell(note(100), 1, { amp: .7 }), .4, .4);
T.at(FARMERS, shimmer(.6, [88, 91, 95].map(note), .4), .3, -.2);
[30.3, 30.45, 30.6].forEach((s, i) => T.at(s, squeak(700 + i * 120, 1000 + i * 150, .1), .2, -.3 + i * .2));   // the sheep's bleaty hops
T.at(RIDE_IN - .2, whoosh(.32, 500, 4000), .4, .5);
for (let i = 0; i < 6; i++) T.at(RIDE_IN + .1 + i * .17, hoof(.6), .25, -.5 + i * .12);
T.at(33.3, plink(note(91)), .3, 0);
T.at(SCRATCH + .35, crinkleish(1.2), .2, .2);
T.at(34.9, shimmer(.5, [91, 95, 98].map(note), .4), .3, .3);
T.at(36.35, whoosh(.4, 500, 2500), .3, 0);
function crinkleish(d) { return noise(d, { hp: 2500, lp: 7000, e: env.swell(.05, .1), amp: .5 }).map((x, i) => x * (.5 + .5 * Math.sin(i / SR * 2 * Math.PI * 11))); }

// ---- E + F: the bedroom
T.at(E0, drone(1.3, 62, .5), .3, 0);
T.at(SCARY, tone(1, t => 330 + 6 * Math.sin(t * 30), { type: 'tri', e: env.swell(.1, .3), amp: .4 }), .15, -.4);   // a nervous little tremolo
T.at(WINDOW, shimmer(.8, [84, 88, 91, 96].map(note), .5, .07), .4, .4);
T.at(WINDOW + .12, squeak(600, 1400, .14), .35, -.3);   // the boy startles
T.at(SOFT, drone(6, 65.4, .6), .25, 0); T.at(SOFT, drone(6, 98, .4), .2, 0);   // a warm pad under the scene
T.at(SOFT + .15, slide(.5, 300, 900, .5), .25, -.4);   // the shadow melts into a bunny
T.at(SOFT + .65, plink(note(96)), .35, -.4);
T.at(SHUBH, shimmer(1.4, [79, 83, 86, 91].map(note), .5, .12), .4, 0);
T.at(LICK + .1, slurp(1), .45, .1);
[LICK + .3, LICK + .45, LICK + .6, LICK + .75].forEach((s, i) => T.at(s, plink(note(91 + (i % 2) * 4)), .25, -.2));   // giggles
T.at(DARK_LINE, bell(note(76), 2, { amp: .5 }), .3, 0);
T.at(COMMENT, shimmer(.8, [86, 90, 93, 98].map(note), .5, .08), .35, 0);
WAVES.forEach((w, i) => T.at(w, plink(note(88 + i * 3)), .25, -.3 + i * .3));
T.at(IRIS, whoosh(.5, 3000, 600), .35, 0);
T.at(CARD - .02, bell(note(84), 1.5, { amp: .6 }), .35, 0);

// ---- the card
T.at(COVER7, ting(86), .4, 0); T.at(COVER7 + .25, pop(400), .3, .2);
[0, .1, .2].forEach((d, i) => T.at(ROW13 + d, plink(note(84 + i * 3)), .3, -.3 + i * .3));
T.at(PRICE, ting(91), .3, 0);
T.at(LOGO, ting(88), .35, 0);
T.at(PILL, mixb(click(.8), ting(96, .6)), .4, 0);
T.at(FOLLOW, shimmer(.8, [91, 95, 98, 103].map(note), .4, .06), .3, 0);

T.write('assets/kalaratri_sfx.wav');
