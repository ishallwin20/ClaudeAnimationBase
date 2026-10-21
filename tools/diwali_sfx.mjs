// diwali_sfx.mjs: the sound effects for "Maa Lakshmi's OWL just went ON STRIKE." (src/scenes/diwali.js) →
// assets/diwali_sfx.wav. Times are the scene's constants (keep them in sync). The signatures, as in ad 10: the megaphone
// voice (a buzzy "ha-ma-ri maang… di-wa-li bo-nus"), the crowd chant, the roster's stamp + plink; new here: the owl's
// hoot, the broom's swish, the rockets, the cricket after ULLU, the coin shower.
import { track, tone, noise, bell, mixb, env, whoosh, rumble, plink, squeak, click, thud, crackle, crinkle, shimmer, wah, slide, drone, conch, chime, chirp, wingbeat, whir, laughter, note, seed, rnd, clamp, SR } from './sfx.mjs';

const YELL = 1.0, PULL = 2.3, CHANT = 2.95, LATE = 3.7, GLANCE = 4.05, B0 = 5.0;
const ROSTER_T = 5.0, BUF0 = 7.55, STAMP1 = 7.95, BHAI = 10.1, STAMP5 = 10.5, WAIT = 12.4,
  GAR0 = 14.5, STAMP2 = 14.9, ZERO = 17.5, MSK0 = 19.6, STAMP3 = 20.0, SAFAI = 22.1, BROOM = 22.7, HIT = 22.95,
  OWL0 = 24.6, STAMPO = 25.0, DARK = 25.3, LAMPS = 27.6, DAZZLE = 28.1, SPIN = 28.7, OTHER = 30.1, ULLU = 32.2,
  DAY4 = 34.2, COWIN = 35.5, COWS = 36.2, COWSTAMP = 36.4, NOBODY = 38.1, WORSHIP = 39.0, JEALOUS = 39.4, COWOUT = 40.3;
const ENTER = 41.0, NOTICE = 41.5, HIDE = 41.8, BONUSQ = 43.3, COINS = 45.6, GIFTS = [46.0, 46.4, 46.8, 47.3], SHADES = 47.3,
  FLIP = 48.3, FLIPS = [48.5, 48.75, 48.95], STRIKE = 49.1, BOARD = 51.1, ASK = 51.6, WIPE = 54.8;
const CARD = 55.1, CARD_CAP = 55.2, COVERS = 55.4, PRICE = 56.2, LOGO = 56.5, PILL = 56.8, FOLLOW = 57.2, END = 59.6;

const T = track(END);
seed(26);
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
// syllables at an even pace: n of them from a pitch contour
const syls = (pitches, gap = .16, dur = .13, br = .7) => pitches.map((p, i) => [i * gap, i === pitches.length - 1 ? dur * 2 : dur, p, br]);
const crowdVoice = (syl, n, amp) => { let o = null; for (let k = 0; k < n; k++) { const b = voice(syl.map(([s, d, p, br]) => [s + rnd() * .04, d, p, br]), 150 + rnd() * 140, { amp: amp * (.6 + rnd() * .4) }); o = o ? mixb(o, b) : b; } return o; };
const stamp = (amp = 1) => mixb(thud(amp * .7), noise(.05, { hp: 600, lp: 3000, e: env.pluck(80), amp: amp * .6 }));
const hoot = (amp = 1, n = 2) => { const o = new Float32Array(Math.round((n * .32 + .4) * SR)); for (let i = 0; i < n; i++) add(o, tone(.26, t => (i ? 330 : 370) * (1 - .12 * t), { e: env.swell(.05, .12), fm: t => .002 * Math.sin(t * 40), amp }), i * .32); return o; };
const fwip = (amp = 1) => noise(.12, { hp: t => 800 + 6000 * t / .12, lp: 9000, e: env.hann(), amp });
const steps = (n, gap, amp = 1) => { const o = new Float32Array(Math.round((n * gap + .2) * SR)); for (let i = 0; i < n; i++) add(o, noise(.06, { lp: 900, hp: 120, e: env.pluck(50), amp: amp * (.7 + rnd() * .3) }), i * gap); return o; };
const anklets = (n, amp = 1) => { const o = new Float32Array(Math.round((n * .13 + .4) * SR)); for (let i = 0; i < n; i++) add(o, bell(4200 + rnd() * 1800, .25, { partials: [[1, 1], [1.5, .4]], k: 14, amp: amp * (.5 + rnd() * .5) }), i * .13 + rnd() * .03); return o; };
const coins = (dur, n, amp = 1) => { const o = new Float32Array(Math.round((dur + .5) * SR)); for (let i = 0; i < n; i++) add(o, bell(2600 + rnd() * 2400, .3, { partials: [[1, 1], [2.4, .5], [3.9, .2]], k: 12, amp: amp * (.4 + rnd() * .6) }), rnd() * dur); return o; };
const cheer = (d, amp = 1) => mixb(noise(d, { lp: 2400, hp: 300, e: env.swell(.15, .8), amp }), crackle(d, amp * .4));
const rocket = (amp = 1) => { const o = new Float32Array(Math.round(1.8 * SR)); add(o, tone(.5, t => 900 + 2600 * t, { e: env.swell(.05, .05), amp: amp * .35 }), 0); add(o, mixb(noise(.6, { lp: 1600, hp: 60, e: env.pluck(7), amp }), tone(.4, t => 90 * Math.exp(-t * 5) + 40, { e: env.pluck(8), amp: amp * .8 })), .5); add(o, crackle(1.1, amp * .45), .62); return o; };
const moo = (amp = 1) => voice([[0, .9, 1, .35]], 110, { amp, growl: .8 });

// ---- A: the hook
T.at(0, noise(PULL + .6, { lp: 1200, hp: 200, e: env.swell(.3, .3), amp: .5 }), .12, 0);      // a crowd murmur under the tent
T.at(0, noise(1.0, { lp: t => 600 + 2400 * t, hp: 300, e: (t, D) => clamp(t / D) ** 1.5 * clamp((D - t) / .05), amp: 1 }), .45, 0);   // the big breath in
T.at(YELL - .08, tone(.18, t => 2600 + 2000 * t, { e: env.swell(.01, .05), amp: 1 }), .12, -.2);   // megaphone squeal
T.at(YELL, voice([[0, .16, 1.1, .7], [.18, .14, 1.2, .9], [.34, .22, 1.35, .7], [.62, .55, 1.5, 1]], 230, { mega: true, amp: 1 }), 1.8, -.2);   // ha-ma-ri maang
T.at(YELL, rumble(.4, .5), .15, 0);
T.at(PULL, whoosh(.6, 2500, 400), .3, 0);
const bonus = [[0, .14, 1.0, .8], [.17, .14, 1.1, .6], [.34, .16, 1.2, .9], [.56, .16, 1.3, 1], [.76, .36, 1.45, .9]];   // di-wa-li bo-nus!
T.at(CHANT, crowdVoice(bonus, 5, 1), .32, 0);
T.at(CHANT, voice(bonus, 230, { mega: true }), .9, -.2);
T.at(CHANT, thud(.6), .25, 0); T.at(CHANT + .56, thud(.5), .2, 0);
T.at(LATE, voice([[0, .3, .9, .25], [.38, .8, .8, .2]], 95, { amp: 1, growl: 1.2 }), .6, -.5);   // the buffalo, late and slow: "bo-nuuus"
T.at(GLANCE + .05, slide(.35, 900, 500, .5), .2, -.4); T.at(GLANCE + .4, click(1), .25, -.4);

// ---- B: the roster
T.at(ROSTER_T, whoosh(.45, 400, 2400), .3, 0); T.at(ROSTER_T + .38, stamp(1), .35, 0);
T.at(ROSTER_T + .15, voice(syls([1, 1.1, 1.05, 1.2], .15), 230), .15, 0);
// the buffalo: low and slow
T.at(BUF0, whoosh(.35, 2600, 600), .22, -.4);
T.at(BUF0 + .1, voice(syls([.8, .85, .8, .9, .75, .8, .85, .7], .24, .2, .4), 100, { growl: 1 }), .45, -.4);
T.at(STAMP1, stamp(1), .35, -.4); T.at(STAMP1, plink(note(72)), .4, -.4);
T.at(STAMP1, fwip(.6), .2, -.3); T.at(STAMP1 + .05, chime(note(88), .6, 1.2), .2, -.3);   // the lamp for Yama lights
T.at(BHAI + .1, voice(syls([.8, .9, .85, .8, .9, .75, .85, .8], .24, .2, .4), 100, { growl: 1 }), .45, -.4);
T.at(STAMP5, stamp(1), .35, -.4); T.at(STAMP5, plink(note(79)), .4, -.4);
T.at(WAIT + .05, voice([[0, .25, .8, .4], [.32, .25, .75, .3], [.66, .5, .65, .3]], 100, { growl: 1 }), .5, -.4);
T.at(WAIT + 1.3, noise(1.0, { lp: 1400, hp: 150, e: env.ad(.05, .4), amp: 1 }), .35, -.4);      // the long-suffering snort
// Garuda: a proud squawk
T.at(GAR0, whoosh(.35, 600, 2600), .22, .4);
T.at(GAR0 + .1, voice(syls([1.3, 1.4, 1.35, 1.5, 1.4, 1.35, 1.6, 1.45, 1.5, 1.7], .2, .15, .9), 300), .3, .5);
T.at(GAR0 + .4, wingbeat(1), .35, .5); T.at(GAR0 + .8, wingbeat(.8), .3, .5);
T.at(STAMP2, stamp(1), .35, .4); T.at(STAMP2, plink(note(76)), .4, .4);
T.at(ZERO, voice(syls([1.4, 1.5, 1.6], .18, .15, .9), 300), .3, .5);
T.at(ZERO + .55, voice([[0, .2, 1.6, 1], [.25, .4, 1.3, .8]], 300), .4, .5);                     // ZE-RO
T.at(ZERO + .7, wah(220, .4, 1), .2, .4); T.at(ZERO + 1.1, wah(200, .4, 1), .2, .4); T.at(ZERO + 1.5, wah(170, .8, 1), .22, .4);   // a sad trombone
// Mooshak: squeaky
T.at(MSK0, whoosh(.35, 600, 2600), .2, .5);
T.at(MSK0 + .1, voice(syls([2.6, 2.8, 2.7, 3.0, 2.8, 2.7, 3.1, 2.9, 3.2], .2, .13, .9), 260), .28, .5);
T.at(STAMP3, stamp(1), .35, .5); T.at(STAMP3, plink(note(81)), .4, .5);
T.at(SAFAI, voice(syls([2.6, 2.8, 2.6], .2, .14, .8), 260), .28, .5);
T.at(SAFAI + .45, slide(.4, 1400, 700, .7), .2, .5);                                                // gulp
T.at(BROOM, whoosh(.3, 500, 4000), .5, .7); T.at(BROOM + .05, crinkle(.35, 1), .35, .6);          // the broom's swish
T.at(HIT, thud(.6), .35, .4); T.at(HIT, squeak(1800, 2600, .18, 1), .35, .4);
T.at(HIT + .05, noise(.4, { hp: 300, lp: 2500, e: env.ad(.01, .15), amp: 1 }), .25, .3);         // dust
T.at(HIT + .1, slide(.5, 1600, 900, .6), .2, .2); T.at(HIT + .6, thud(.5), .3, 0);
T.at(HIT + .65, shimmer(.8, [96, 100, 96, 100].map(note), .4, .12), .2, 0);                       // dizzy tweets
// the owl
T.at(OWL0, whoosh(.4, 2600, 500), .22, 0);
T.at(OWL0 + .1, voice(syls([1.0, 1.1, 1.05, 1.2, 1.1, 1.0, 1.3, 1.2, 1.15, 1.4], .21, .15, .7), 220), .35, 0);
T.at(STAMPO, stamp(1), .35, 0); T.at(STAMPO + .05, hoot(.8, 2), .3, 0);
T.at(DARK, click(1), .3, -.3); T.at(DARK + .12, click(.8), .25, .3); T.at(DARK + .1, drone(1.8, 65, .6), .2, 0);   // the lights go off
T.at(DARK + .4, voice(syls([1.2, 1.3, 1.25, 1.4, 1.5, 1.3, 1.6], .2, .14, .7), 220), .3, 0);
T.at(LAMPS, voice(syls([1.0, .95, 1.0, 1.05, 1.1, .9], .2, .15, .6), 220), .35, 0);
T.at(DAZZLE - .45, rocket(1), .45, .4);                                                             // a rocket goes up…
T.at(DAZZLE, shimmer(1.2, [84, 88, 91, 96, 100].map(note), .5, .04), .4, 0); T.at(DAZZLE, chime(note(96), 1, 1.6), .25, 0);   // …every lamp flares
T.at(DAZZLE + .05, voice([[0, .5, 1.6, 1]], 220), .35, 0);                                          // aaagh
T.at(SPIN, whir(.7, 1), .3, 0); T.at(SPIN, whoosh(.7, 800, 3000), .3, 0);
T.at(SPIN + .7, tone(.5, t => 300 + 200 * Math.sin(t * 50) * Math.exp(-t * 6), { e: env.pluck(6), amp: 1 }), .3, 0);   // boing
T.at(SPIN + .8, shimmer(.8, [96, 100, 96, 100].map(note), .4, .14), .2, 0);
T.at(OTHER, voice(syls([1.0, .95, .9, 1.0, .95, .9, .85, .9, .8], .2, .15, .5), 220), .35, 0);
T.at(ULLU, hoot(1, 1), .45, 0);                                                                     // "ULLU": one flat hoot…
[.8, 1.1, 1.5, 1.8].forEach(d => T.at(ULLU + d, chirp(1), .12, .6));                             // …and a cricket
T.at(ULLU + .9, click(.6), .2, 0);                                                                  // the slow blink
// Day 4: the cows
T.at(DAY4, whoosh(.5, 2600, 500), .25, 0);
T.at(DAY4 + .1, voice(syls([1.0, 1.1, 1.0, 1.1, 1.2, 1.1, 1.5], .19, .14, .7), 220), .3, 0);
T.at(DAY4 + .3, slide(.4, 500, 1100, .7), .25, 0);                                                  // "?"
T.at(COWIN, steps(6, .24, .7), .2, .6); T.at(COWIN, bell(note(67), 1.6, { k: 2.5 }), .2, .6);      // hooves and her bell
T.at(COWS, moo(1), .45, .5); T.at(COWSTAMP, stamp(1), .3, .3); T.at(COWSTAMP, plink(note(84)), .4, .3);
T.at(COWS + .3, shimmer(1.4, [88, 91, 95].map(note), .3, .2), .2, .5);                             // petals
T.at(NOBODY, voice(syls([1.0, 1.05, 1.0, 1.2, 1.1], .2, .15, .6), 220), .3, 0);
T.at(WORSHIP, conch(1.4, 311, 1), .25, .4); T.at(WORSHIP + .1, bell(note(64), 2.2, { k: 1.8 }), .3, .4);   // the puja for her
T.at(JEALOUS, noise(.5, { lp: 3000, hp: 600, e: (t, D) => clamp(t / D) ** .6 * clamp((D - t) / .05), amp: 1 }), .35, 0);   // everyone gasps
T.at(JEALOUS + .5, voice([[0, .9, .7, .3]], 120, { growl: 1.5 }), .25, -.3); T.at(JEALOUS + .6, voice([[0, .7, 1.4, .4]], 300, { growl: 1 }), .15, .5);   // grumbles
T.at(COWOUT, steps(4, .22, .6), .18, .7);

// ---- C: she walks in
T.at(ENTER, steps(7, .26, .8), .22, -.5); T.at(ENTER + .1, anklets(14, .6), .25, -.5);
T.at(ENTER + .1, shimmer(1.8, [84, 88, 91, 96].map(note), .4, .14), .25, -.4);
T.at(ENTER + .2, coins(1.6, 10, .5), .2, -.5);
T.at(NOTICE, slide(.2, 1600, 400, .8), .3, 0); T.at(NOTICE + .05, thud(.5), .2, 0);              // freeze!
T.at(HIDE, whoosh(.3, 800, 3000), .3, 0); T.at(HIDE + .4, thud(.4), .2, -.1);
T.at(BONUSQ, voice(syls([1.9, 2.0, 1.9, 2.1, 2.0, 2.2, 2.4], .19, .14, .4), 220), .22, -.4);
T.at(BONUSQ + .5, crowdVoice([[0, .5, 1.5, .8]], 4, .9), .25, .1);                                  // ooooh!
T.at(COINS - .1, bell(note(79), 1.6), .3, -.3);
T.at(COINS + .1, coins(2.8, 70, 1), .35, 0);                                                        // the coin shower
GIFTS.forEach((g, i) => { T.at(g - .45, whoosh(.45, 600, 2600), .15, [.2, -.4, .5, 0][i]); T.at(g, plink(note(84 + [0, 4, 7, 12][i])), .4, [.2, -.4, .5, 0][i]); });
T.at(GIFTS[0] + .1, squeak(1600, 2600, .2, 1), .3, .2);                                              // Mooshak's squeal
T.at(GIFTS[1] + .1, moo(.7), .25, -.4);
T.at(GIFTS[2], click(1), .45, .5);                                                                   // Garuda's snap
T.at(SHADES + .1, shimmer(1, [91, 95, 98, 103].map(note), .4, .07), .3, 0);                       // cool
T.at(SHADES + .55, noise(.08, { hp: 3000, lp: 9000, e: env.pluck(40), amp: 1 }), .25, 0); T.at(SHADES + .55, chime(note(103), .6, .6), .2, 0);   // the glint
T.at(FLIP, whoosh(.3, 800, 3000), .25, -.2);
FLIPS.forEach((f, i) => T.at(f + .05, fwip(1), .35, [0, -.4, .5][i]));
const shubh = [[0, .2, 1.2, .9], [.24, .2, 1.3, .8], [.48, .16, 1.25, .8], [.66, .16, 1.3, .8], [.84, .36, 1.6, 1]];   // shubh di-wa-li!
T.at(FLIPS[0], voice(shubh, 230, { mega: true }), 1.6, -.2);
T.at(FLIPS[0] + .3, crowdVoice(shubh, 5, 1), .25, 0);
T.at(FLIPS[0] + .1, bell(note(55), 2.2, { k: 2 }), .35, 0);
T.at(FLIPS[0] + .1, rocket(1), .4, -.6); T.at(FLIPS[0] + .55, rocket(.9), .38, .6); T.at(STRIKE + .7, rocket(.8), .35, 0);
T.at(FLIPS[2] + .2, moo(.8), .2, -.4); T.at(FLIPS[2] + .2, squeak(1400, 2400, .25, 1), .25, .3);
T.at(STRIKE, cheer(2.2, 1), .25, 0); T.at(STRIKE + .3, laughter(1.6, 1), .12, 0);
T.at(BOARD, whoosh(.6, 400, 2600), .3, 0); [0, 1, 2, 3, 4].forEach(r => T.at(BOARD + .2 + r * .1, plink(note(84 + r * 2)), .25, 0));
T.at(ASK, shimmer(1.2, [86, 90, 93].map(note), .4, .1), .2, 0);
T.at(WIPE, whoosh(.6, 400, 3500), .4, 0);
// ---- the card
T.at(CARD_CAP, bell(note(79), 1.5), .25, 0);
[0, 1, 2].forEach(j => T.at(COVERS + j * .15, plink(note(84 + j * 4)), .35, j - 1));
T.at(PRICE, shimmer(1.2, [86, 91, 95].map(note), .4, .1), .25, 0);
T.at(PILL, plink(note(91)), .35, 0); T.at(PILL, bell(note(79), 1.6), .2, 0);
T.at(FOLLOW, shimmer(1.4, [91, 95, 98, 103].map(note), .3, .1), .2, 0);
T.write('assets/diwali_sfx.wav');
