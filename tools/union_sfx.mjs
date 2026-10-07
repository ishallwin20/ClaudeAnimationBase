// union_sfx.mjs: the sound effects for "Maa Durga's LION just went ON STRIKE." (src/scenes/union.js) →
// assets/union_sfx.wav. Times are the scene's constants (keep them in sync). The signatures: the megaphone voice
// (a buzzy synthesized "ha-ma-ri maan-gein"), the crowd chant, the roster's stamp + plink, the donkey's hee-haw.
import { track, tone, noise, bell, mixb, env, whoosh, rumble, plink, clang, squeak, click, thud, crackle, crunch, crinkle, shimmer, wah, slide, drone, note, seed, rnd, clamp, lerp, SR } from './sfx.mjs';

const YELL = 1.0, PULL = 2.3, CHANT = 2.95, LATE = 3.75, GLANCE = 3.95, B0 = 5.2;
const ROSTER_T = 5.2, LION0 = 7.9, BEANS = [8.5, 8.85, 9.2, 9.55], NAMES = 10.3, TIG0 = 12.3, STAMP3 = 12.7, ARMS = 14.4,
  NAN0 = 16.6, STAMP18 = [17.0, 17.35], SHIVA = 18.6, DNK0 = 20.8, STAMP7 = 21.2, WHY = 22.8, TWITCH = 23.4,
  N2 = 25.2, WALKS = 27.1, FEET = 27.5, GASP = 27.6;
const ENTER = 29.3, NOTICE = 29.8, HIDE = 30.1, EAT = 30.4, VIRTUE = 31.8, TAGS = [32.4, 32.9, 33.4, 33.9], LIFT = 35.6,
  WALK = 37.4, EXIT = 38.2, FLIP = 39.8, FLIPS = [40.0, 40.25, 40.45], STRIKE = 40.9, BOARD = 42.9, ASK = 43.5, WIPE = 46.5;
const CARD = 46.8, CARD_CAP = 46.9, COVERS = 47.1, PRICE = 47.9, LOGO = 48.2, PILL = 48.5, FOLLOW = 48.9, END = 51.6;

const T = track(END);
seed(10);
const add = (o, b, s0) => { const s = Math.round(s0 * SR); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j]; return o; };
// a buzzy cartoon voice: syllables [start, dur, pitch ×, brightness 0..1]; mega: through a megaphone (band-limited, driven)
function voice(syl, f0, { amp = 1, mega = false, growl = 0 } = {}) {
  const D = Math.max(...syl.map(([s, d]) => s + d)) + .1, o = new Float32Array(Math.round(D * SR));
  let ph = 0, l = 0, h = 0, hp = 0;
  for (let i = 0; i < o.length; i++) {
    const t = i / SR, s = syl.find(([a, d]) => t >= a && t < a + d);
    if (!s) { l *= .995; o[i] = 0; continue; }
    const [a, d, pm, br] = s, k = (t - a) / d, e = clamp(k / .12) * clamp((1 - k) / .25);
    ph += f0 * pm * (1.04 - .1 * k) * (1 + .01 * Math.sin(t * 40) + growl * .03 * Math.sin(t * 190)) / SR;
    const x = 2 * (ph - Math.floor(ph)) - 1, fc = 500 + br * 2200 * Math.sin(Math.PI * clamp(k * 1.3)), al = 1 - Math.exp(-2 * Math.PI * fc / SR);
    l += al * (x * e - l);
    let v = l;
    if (mega) { const ah = Math.exp(-2 * Math.PI * 600 / SR); hp = ah * (hp + v - h); h = v; v = Math.tanh(hp * 3.5) * .6; }
    o[i] = v * amp;
  }
  return o;
}
const crowdVoice = (syl, n, amp) => { let o = null; for (let k = 0; k < n; k++) { const b = voice(syl.map(([s, d, p, br]) => [s + rnd() * .04, d, p, br]), 150 + rnd() * 140, { amp: amp * (.6 + rnd() * .4) }); o = o ? mixb(o, b) : b; } return o; };
const stamp = (amp = 1) => mixb(thud(amp * .7), noise(.05, { hp: 600, lp: 3000, e: env.pluck(80), amp: amp * .6 }));
const heehaw = (amp = 1, n = 2) => { const o = new Float32Array(Math.round((n * .55 + .2) * SR)); for (let i = 0; i < n; i++) { add(o, voice([[0, .22, 2.6, .9]], 300, { amp }), i * .55); add(o, voice([[0, .3, 1.0, .5]], 300, { amp, growl: 1 }), i * .55 + .24); } return o; };
const fwip = (amp = 1) => noise(.12, { hp: t => 800 + 6000 * t / .12, lp: 9000, e: env.hann(), amp });
const steps = (n, gap, amp = 1) => { const o = new Float32Array(Math.round((n * gap + .2) * SR)); for (let i = 0; i < n; i++) add(o, noise(.06, { lp: 900, hp: 120, e: env.pluck(50), amp: amp * (.7 + rnd() * .3) }), i * gap); return o; };
const beads = (n, amp = 1) => { const o = new Float32Array(Math.round((n * .09 + .2) * SR)); for (let i = 0; i < n; i++) add(o, click(amp * (.5 + rnd() * .5)), i * .09 + rnd() * .02); return o; };
const cheer = (d, amp = 1) => mixb(noise(d, { lp: 2400, hp: 300, e: env.swell(.15, .8), amp }), crackle(d, amp * .4));

// ---- A: the hook
T.at(0, noise(PULL + .6, { lp: 1200, hp: 200, e: env.swell(.3, .3), amp: .5 }), .12, 0);      // a crowd murmur under the tent
T.at(0, noise(1.0, { lp: t => 600 + 2400 * t, hp: 300, e: (t, D) => clamp(t / D) ** 1.5 * clamp((D - t) / .05), amp: 1 }), .45, 0);   // the big breath in
T.at(YELL - .08, tone(.18, t => 2600 + 2000 * t, { e: env.swell(.01, .05), amp: 1 }), .12, 0);   // megaphone squeal
T.at(YELL, voice([[0, .16, 1.1, .7], [.18, .14, 1.2, .9], [.34, .3, 1.35, .7], [.72, .28, 1.5, 1], [1.02, .34, 1.25, .8]], 210, { mega: true, amp: 1 }), 1.8, 0);   // ha-ma-ri maan-gein
T.at(YELL, rumble(.4, .5), .15, 0);
T.at(PULL, whoosh(.6, 2500, 400), .3, 0);
T.at(CHANT, crowdVoice([[0, .16, 1.0, .8], [.2, .2, 1.1, .6], [.46, .18, 1.2, 1], [.68, .36, 1.3, .9]], 5, 1), .32, 0);   // poo-ri ka-ro!
T.at(CHANT, voice([[0, .16, 1.0, .8], [.2, .2, 1.1, .6], [.46, .18, 1.2, 1], [.68, .36, 1.3, .9]], 210, { mega: true }), .9, 0);
T.at(CHANT, thud(.6), .25, 0); T.at(CHANT + .46, thud(.5), .2, 0);
T.at(LATE, voice([[0, .14, 1.0, .25], [.18, .3, 1.1, .2]], 260, { amp: 1 }), .55, .5);   // the donkey, late and muffled: "ka-ro"
T.at(GLANCE + .05, slide(.35, 900, 500, .5), .2, .4); T.at(GLANCE + .4, click(1), .25, .4);

// ---- B: the roster
T.at(ROSTER_T, whoosh(.45, 400, 2400), .3, 0); T.at(ROSTER_T + .38, stamp(1), .35, 0);
T.at(ROSTER_T + .15, voice([[0, .12, 1, .5], [.14, .12, 1.1, .6], [.3, .2, 1.05, .5]], 230), .15, 0);
T.at(LION0, whoosh(.35, 600, 2600), .22, -.2);
T.at(LION0 + .1, voice([[0, .1, 1.2, .7], [.13, .12, 1.3, .7], [.3, .12, 1.2, .6], [.45, .14, 1.15, .6], [.62, .3, 1.5, 1], [1.0, .3, 1.3, .8]], 180, { growl: .6 }), .35, 0);
BEANS.forEach((b, i) => { T.at(b, plink(note(76 + [0, 4, 7, 12][i])), .45, -.2); T.at(b, stamp(.8), .25, -.3 + i * .2); });
T.at(NAMES, voice([[0, .9, .7, .3]], 120, { growl: 1.5 }), .3, 0);                              // a grumble
T.at(TIG0, whoosh(.35, 600, 2600), .22, .4);
T.at(TIG0 + .1, voice([[0, .14, 1.4, .6], [.2, .14, 1.5, .5], [.5, .3, 1.7, .9]], 220), .35, .3);
T.at(STAMP3, stamp(1), .35, .3); T.at(STAMP3, plink(note(81)), .4, .3);
T.at(ARMS, voice([[0, .12, 1.4, .6], [.15, .14, 1.4, .6], [.32, .2, 1.6, .8], [.6, .3, 1.5, .7]], 220), .3, .3);
T.at(ARMS + .5, slide(.8, 420, 180, .6), .25, .3);                                                // a groan
[15.1, 15.25, 15.4].forEach(c => T.at(c, click(1), .35, .3));                                     // crick crick crack
T.at(NAN0, whoosh(.35, 2600, 600), .22, -.4);
T.at(NAN0 + .1, voice([[0, .2, .7, .4], [.3, .3, .7, .3], [.75, .35, .65, .4]], 110, { growl: 1 }), .4, -.4);
STAMP18.forEach((s, i) => { T.at(s, stamp(1), .35, -.4); T.at(s, plink(note(72 + i * 7)), .4, -.4); });
T.at(SHIVA, voice([[0, .14, .7, .4], [.2, .3, .72, .3], [.6, .3, .8, .5]], 110, { growl: 1 }), .35, -.4);
T.at(SHIVA + .5, bell(note(43), 2.4, { k: 1.6 }), .35, 0);                                       // SHIVA: a deep temple bell
T.at(SHIVA + 1.1, noise(1.0, { lp: 1400, hp: 150, e: env.ad(.05, .4), amp: 1 }), .35, -.4);      // the long-suffering snort
T.at(DNK0, whoosh(.35, 600, 2600), .22, .4);
T.at(DNK0 + .1, voice([[0, .14, 2.0, .6], [.18, .2, 2.2, .7], [.5, .2, 2.0, .6]], 220), .3, .3);
T.at(STAMP7, stamp(1), .35, .3); T.at(STAMP7, plink(note(79)), .4, .3); T.at(STAMP7 + .1, heehaw(.9, 1), .3, .3);
T.at(WHY, voice([[0, .12, 2, .6], [.15, .14, 2.1, .6], [.32, .14, 2, .6], [.5, .3, 2.3, .8]], 220), .3, .3);
T.at(WHY + .5, crowdVoice([[0, .18, 1.6, .9], [.22, .14, 1.5, .7], [.4, .4, 1.9, 1]], 3, .8), .3, -.2);   // "why a DONKEY?!"
T.at(TWITCH, wah(220, .5, 1), .25, .3); [0, .12, .24, .36, .5].forEach(d => T.at(TWITCH + d, click(.8), .3, .3));
T.at(N2, whoosh(.5, 2600, 500), .25, 0);
T.at(N2 + .15, slide(.4, 500, 1100, .7), .3, 0);                                                    // "?"
T.at(WALKS, voice([[0, .12, 1.2, .6], [.15, .12, 1.25, .6], [.3, .14, 1.2, .6], [.48, .3, 1.4, .9]], 180, { growl: .6 }), .35, 0);
T.at(FEET - .12, steps(2, .14, 1), .4, -.2); T.at(FEET, stamp(1), .3, -.2); T.at(FEET, plink(note(84)), .4, -.2);
T.at(GASP, noise(.5, { lp: 3000, hp: 600, e: (t, D) => clamp(t / D) ** .6 * clamp((D - t) / .05), amp: 1 }), .4, 0);   // everyone gasps

// ---- C: she walks in
T.at(ENTER, steps(7, .26, .8), .25, -.5); T.at(ENTER + .1, beads(14, .6), .2, -.5);
T.at(ENTER + .2, shimmer(1.6, [84, 88, 91, 96].map(note), .4, .12), .22, -.4);
T.at(NOTICE, slide(.2, 1600, 400, .8), .3, 0); T.at(NOTICE + .05, thud(.5), .2, 0);              // freeze!
T.at(HIDE, whoosh(.3, 800, 3000), .3, 0); T.at(HIDE + .4, thud(.4), .2, -.1);
[0, .22, .44, .66].forEach(d => T.at(EAT + d, crunch(1), .4, .4));                                // munch munch
T.at(EAT + 1.0, slide(.3, 300, 110, 1), .35, .4);                                                  // gulp
T.at(VIRTUE, voice([[0, .14, 1.9, .4], [.18, .14, 2, .4], [.36, .3, 1.8, .4]], 220), .2, -.4);
TAGS.forEach((g, i) => { T.at(g, bell(note(79 + [0, 4, 7, 12][i]), 1.4), .4, [0, .4, -.4, .5][i]); T.at(g, noise(.12, { hp: 2000, lp: 9000, e: env.pluck(30), amp: .5 }), .15, 0); });
T.at(LIFT, slide(.3, 500, 800, .6), .25, 0); T.at(LIFT + .1, voice([[0, .14, 1.3, .6], [.18, .14, 1.35, .6], [.4, .3, 1.6, .8]], 180), .3, 0);
T.at(WALK, voice([[0, .3, 1.9, .4], [.4, .2, 2.0, .4], [.7, .35, 1.8, .4]], 220), .2, -.4);
T.at(WALK + .1, bell(note(72), 2), .2, -.4);
T.at(EXIT, steps(7, .27, .7), .22, 0); T.at(EXIT, beads(12, .5), .15, 0);
T.at(FLIP, whoosh(.3, 800, 3000), .25, -.2);
FLIPS.forEach((f, i) => T.at(f + .05, fwip(1), .35, [-.1, .5, -.5][i]));
T.at(FLIPS[0], voice([[0, .22, 1.3, .9], [.26, .16, 1.2, .8], [.44, .16, 1.3, .8], [.62, .36, 1.6, 1]], 210, { mega: true }), 1.6, 0);   // JAI MA-TA DI!
T.at(FLIPS[0] + .3, crowdVoice([[0, .22, 1.3, .9], [.26, .16, 1.2, .8], [.44, .16, 1.3, .8], [.62, .36, 1.6, 1]], 5, 1), .25, 0);
T.at(FLIPS[0] + .1, bell(note(55), 2.2, { k: 2 }), .4, 0); T.at(FLIPS[0] + .1, shimmer(1.6, [91, 95, 98, 103].map(note), .4, .08), .3, 0);
T.at(FLIPS[2] + .15, heehaw(1, 2), .35, .5);
T.at(STRIKE, cheer(2.2, 1), .25, 0);
T.at(BOARD, whoosh(.6, 400, 2600), .3, 0); [0, 1, 2].forEach(r => T.at(BOARD + .2 + r * .12, plink(note(84 + r * 3)), .25, 0));
T.at(ASK, shimmer(1.2, [86, 90, 93].map(note), .4, .1), .2, 0);
T.at(WIPE, whoosh(.6, 400, 3500), .4, 0);
// ---- the card
T.at(CARD_CAP, bell(note(79), 1.5), .25, 0);
[0, 1, 2].forEach(j => T.at(COVERS + j * .15, plink(note(84 + j * 4)), .35, j - 1));
T.at(PRICE, shimmer(1.2, [86, 91, 95].map(note), .4, .1), .25, 0);
T.at(PILL, plink(note(91)), .35, 0); T.at(PILL, bell(note(79), 1.6), .2, 0);
T.at(FOLLOW, shimmer(1.4, [91, 95, 98, 103].map(note), .3, .1), .2, 0);
T.write('assets/union_sfx.wav');
