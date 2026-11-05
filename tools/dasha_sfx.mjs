// dasha_sfx.mjs: the sound for "VISHNU has come 9 times" (src/scenes/dasha.js, ad 77, Dashavatar, no voice) →
// assets/dasha_sfx.wav. Times are the scene's constants (keep them in sync). One signature sound for the descent (a
// falling whistle into a chime and a shimmer) every time the light becomes a form, and a pop for each badge; then each
// avatar's world: a river and a pleading squeak, a storm at sea; the churning, a groan, a splash and a cheer; the deep,
// a demon's laugh, the boar's burst into dawn; a laugh, three drum ticks for the boon, the fist, the pillar's boom and
// the ROAR; a fire, a bubble, a laugh, a riser and two giant steps; war drums and the axe; ten heads laughing, the bow,
// ten gulps; the conch, a flute and a tanpura for the Gita; a split chime, a river's rush, a goat; the storm, hooves,
// thunder and a neigh; the ring of pops on the ask. Mild, never loud: the music is added on Instagram.
import { tone, noise, bell, mixb, env, whoosh, plink, squeak, click, thud, shimmer, chime, drum, om, wind, thunder,
  note, seed, rnd, clamp, SR, track, heart, roar, crunch, clang, rumble, slide, splash, gurgle, laughter, drone, rockfall, crackle } from './sfx.mjs';

const FLASH0 = 2.4;
const M0 = 4.0, MGROW = 8.2;
const K0 = 12.4, KRISE = 14.6;
const V0 = 19.4, VBURST = 22.2;
const N0 = 26.8, STRIKE = 31.2, PILLAR = 31.8, FEAR = 33.8, ROAR2 = 35.0;
const W0 = 36.8, WGROW = 41.6, STEP1 = 42.4, STEP2 = 43.4, HEAD = 44.4;
const P0 = 46.8, PAXE = 49.4, PFLEE = 51.6;
const R0 = 53.3, RAM = 57.6, REV = 59.8;
const G0 = 61.3;
const B9 = 70.3, BAL = 74.0, BUD = 79.0;
const X0 = 84.3, YET = 88.6;
const ASK = 92.3, CARD = 97.8, END = 101.8;

const T0 = track(END);
seed(77);
// the soft stretches (Manu's river, the Gita, the Buddha, the card) sit well under the hits: lift them on a phone
const LIFTS = [[M0, MGROW - .4, 1.8], [G0 + .8, B9 - .3, 1.5], [BUD + .2, X0 - .3, 1.6], [CARD - .3, END, 2]];
const T = { at: (t0, b, g = 1, pan = 0) => { const l = LIFTS.find(([a, z]) => t0 >= a && t0 < z); T0.at(t0, b, g * (l ? l[2] : 1), pan); }, write: (...a) => T0.write(...a) };
// a buzzy voice: syllables [start, dur, pitch ×, brightness 0..1] (as in ads 63, 68, 70, 72)
function voice(syl, f0, { amp = 1, fall = .1, rise = 0, shake = 0 } = {}) {
  const D = Math.max(...syl.map(([s, d]) => s + d)) + .1, o = new Float32Array(Math.round(D * SR));
  let ph = 0, l = 0;
  for (let i = 0; i < o.length; i++) {
    const t = i / SR, s = syl.find(([a, d]) => t >= a && t < a + d);
    if (!s) { o[i] = 0; continue; }
    const [a, d, pm, br] = s, k = (t - a) / d, e = clamp(k / .12) * clamp((1 - k) / .25);
    ph += f0 * pm * (1.04 - fall * k + rise * k) * (1 + .012 * Math.sin(t * 38) + shake * .04 * Math.sin(t * 2 * Math.PI * 7)) / SR;
    const x = 2 * (ph - Math.floor(ph)) - 1, fc = 600 + br * 2200 * Math.sin(Math.PI * clamp(k * 1.3)), al = 1 - Math.exp(-2 * Math.PI * fc / SR);
    l += al * (x * e - l); o[i] = l * amp;
  }
  return o;
}
const talk = (dur, f, { gap = .17, amp = 1, br = .45, fall = .1, shake = 0 } = {}) =>
  voice(Array.from({ length: Math.max(1, Math.floor(dur / gap)) }, (_, i) => [i * gap, gap * .72, 1 + .12 * Math.sin(i * 2.3) - (i % 5 === 4 ? .12 : 0), br]), f, { amp, fall, shake });
const SAGE = 92, ELDER = 100;
const add = (o, b, s0, g = 1) => { const s = Math.round(s0 * SR); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j] * g; return o; };
const lp = (b, fc) => { let l = 0; const a = 1 - Math.exp(-2 * Math.PI * fc / SR); for (let i = 0; i < b.length; i++) { l += a * (b[i] - l); b[i] = l; } return b; };
const tanpura = (dur, root = 50, amp = 1) => { const o = new Float32Array(Math.round((dur + 2.5) * SR)); const ns = [root + 7, root + 12, root + 12, root];
  for (let k = 0; k * .9 < dur; k++) add(o, lp(tone(2.4, note(ns[k % 4]), { type: 'saw', e: env.ad(.05, .9), amp }), 1400), k * .9, 1 - .5 * clamp((k * .9 - dur + 1.5) / 1.5)); return o; };
const pad = (dur, ms, amp = 1, a = 1.2, r = 1.4) => mixb(...ms.map((m, i) => tone(dur, t => note(m) * (1 + .003 * Math.sin(t * 2 + i)), { type: 'tri', e: env.swell(a, r), amp: amp / ms.length })));
const strings = (dur, ms, amp = 1, a = .8, r = 1) => mixb(...ms.map((m, i) => lp(tone(dur, t => note(m) * (1 + .004 * Math.sin(t * 31 + i * 2)), { type: 'saw', e: env.swell(a, r), amp: amp / ms.length }), 1600)));
const brass = (dur, ms, amp = 1, a = .08, r = .5) => mixb(...ms.map((m, i) => lp(tone(dur, t => note(m) * (1 + .004 * Math.sin(t * 30 + i)), { type: 'saw', e: env.swell(a, r), amp: amp / ms.length }), 2200)));
const bird = (f, amp = 1) => mixb(squeak(f, f * 1.4, .07, amp), squeak(f * 1.3, f * 1.1, .06, amp * .7));
const sub = (dur, f = 41, amp = 1) => tone(dur, t => f + .6 * Math.sin(t * 1.3), { e: env.swell(.8, 1), amp });
const boom = (amp = 1) => mixb(drum(36, amp * .7, 1.8), noise(2.4, { brown: true, lp: 180, e: env.ad(.01, 1.6), amp }), thud(amp * .7));
const riser = (dur, f0 = 200, f1 = 1600, amp = 1) => mixb(tone(dur, t => f0 * Math.pow(f1 / f0, t / dur), { type: 'saw', e: env.swell(dur * .9, .02), amp: amp * .35 }), noise(dur, { hp: t => 300 + 3000 * t / dur, lp: 9000, e: env.swell(dur * .95, .02), amp: amp * .5 }));
const ring = (dur, f = 3100, amp = 1) => tone(dur, f, { e: env.swell(.05, dur * .8), amp });
const step = (amp = 1) => mixb(noise(.06, { lp: 900, hp: 80, e: env.pluck(40), amp }), tone(.08, t => 90 - 200 * t, { e: env.pluck(30), amp: amp * .5 }));
const pop = (f = 900, amp = 1) => mixb(squeak(f * .6, f * 1.6, .07, amp), plink(f * 1.5, amp * .5));
const boing = (f = 180, amp = 1) => tone(.45, t => f * (1 + .35 * Math.sin(t * 60) * Math.exp(-t * 6)), { type: 'tri', e: env.pluck(6), amp });
const moo = (dur = 1, f = 120, amp = 1) => lp(tone(dur, t => f * (1 + .25 * Math.sin(Math.PI * t / dur)) * (1 - .15 * t / dur), { type: 'saw', e: env.swell(.15, .35), amp }), 900);
const tink = (amp = 1) => mixb(bell(note(98), .4, { partials: [[1, 1], [2.7, .4]], k: 10, amp }), click(amp * .4));
const fire = (dur, amp = 1) => { const o = noise(dur, { brown: true, lp: 700, e: env.swell(.6, .8), amp }); for (let k = 0; k < dur * 9; k++) add(o, noise(.02, { hp: 2000, lp: 8000, e: env.pluck(80), amp: amp * (.3 + rnd() * .5) }), rnd() * dur); return o; };
const taiko = (amp = 1) => mixb(drum(48, amp, .9), noise(.15, { lp: 400, e: env.pluck(25), amp: amp * .6 }));
const conch = (dur = 1.6, amp = 1) => lp(tone(dur, t => 311 * (1 + .01 * Math.sin(t * 30)), { type: 'saw', e: env.swell(.25, .6), amp }), 1500);
const hiss = (dur, amp = 1) => noise(dur, { hp: 2500, lp: 9000, e: env.swell(.05, .2), amp });

const twang = (f = 110, amp = 1) => mixb(tone(.9, t => f * (1 + .02 * Math.exp(-t * 20)), { type: 'saw', e: env.pluck(5), amp: amp * .5 }), tone(.9, f * 2, { e: env.pluck(7), amp: amp * .3 }), click(amp * .5));
const creak = (dur, amp = 1) => lp(tone(dur, t => 70 + 40 * t / dur + 8 * Math.sin(t * 90), { type: 'saw', e: env.swell(dur * .8, .05), amp }), 900);
const caw = (amp = 1) => voice([[0, .22, 1, .9], [.3, .25, .92, .85]], 620, { fall: .35, amp });
const pluck = (m, amp = 1) => mixb(tone(1.2, note(m), { type: 'tri', e: env.pluck(4), amp: amp * .6 }), tone(1.2, note(m + 12), { e: env.pluck(6), amp: amp * .25 }));
const whine = (dur, amp = 1) => tone(dur, t => 600 + 1800 * Math.pow(t / dur, 2), { e: env.swell(dur * .9, .03), amp });

const harp = (ms, gap = .09, amp = 1) => { const o = new Float32Array(Math.round((ms.length * gap + 1.6) * SR)); ms.forEach((m, i) => add(o, pluck(m, amp), i * gap)); return o; };
const flute = (dur, ms, amp = 1) => { const o = new Float32Array(Math.round((dur + .5) * SR)), d = dur / ms.length;
  ms.forEach((m, i) => add(o, mixb(tone(d * 1.1, t => note(m) * (1 + .006 * Math.sin(t * 32)), { e: env.swell(.06, .12), amp: amp * .7 }), noise(d * 1.1, { hp: 1800, lp: 5000, e: env.swell(.05, .1), amp: amp * .08 })), i * d)); return o; };
const cowbell = (amp = 1) => bell(note(81 + Math.floor(rnd() * 3)), .8, { partials: [[1, 1], [1.5, .5], [2.4, .3]], k: 6, amp });
const scuffle = (amp = 1) => mixb(noise(.12, { lp: 1500, hp: 200, e: env.pluck(20), amp }), squeak(300 + rnd() * 200, 200, .08, amp * .4));
const gulp = (amp = 1) => mixb(tone(.18, t => 300 - 900 * t, { e: env.pluck(12), amp }), noise(.2, { lp: 900, e: env.pluck(14), amp: amp * .4 }));
const hum = (dur, f, amp = 1) => mixb(tone(dur, t => f * (1 + .02 * Math.sin(t * 9)), { type: 'tri', e: env.swell(.3, .3), amp }), tone(dur, t => f * 2.01, { e: env.swell(.3, .3), amp: amp * .3 }));


// ---- the signature: the light falling to become a form (lands at t0), and the badge's pop
const descend = (t0, pan = 0, g = 1) => {
  T.at(t0 - .6, slide(.6, 2600, 700, .7), .1 * g, pan);
  T.at(t0 - .6, whoosh(.6, 6000, 900), .1 * g, pan);
  T.at(t0, mixb(chime(note(88), .8, 1.6), shimmer(1.2, [note(81), note(88), note(93), note(100)], .6, .06), drum(52, .5, .5)), .16 * g, pan);
};
const badgePop = (t0, n) => { T.at(t0, pop(700 + n * 40, .9), .12, 0); T.at(t0 + .08, plink(1400 + n * 60, .5), .06, 0); };
const BADGE_AT = [M0, K0, V0, N0, W0, P0, R0, G0, B9, X0];
BADGE_AT.forEach((a, i) => badgePop(a + .3, i));
const neigh = (amp = 1) => voice([[0, .25, 1.5, .9], [.22, .35, 1.2, .8], [.55, .3, 1.0, .7]], 520, { fall: .4, shake: 1, amp });
const bleat = (amp = 1) => voice([[0, .4, 1, .6]], 420, { fall: .15, shake: 1.5, amp });
const hoof = (amp = 1) => mixb(drum(90, amp, .15), click(amp * .6));
const rain = (dur, amp = 1) => noise(dur, { hp: 1800, lp: 8000, e: env.swell(.5, .5), amp });

// ================= A · the hook =================
T.at(0, sub(4.2, 41, 1), .2, 0);
T.at(0, om(4.2, 110, .8), .07, 0);
T.at(.05, mixb(conch(1.8, 1), bell(note(57), 3.4, { k: 1.4 })), .12, 0);   // the shankh
T.at(.1, taiko(1), .22, 0);
T.at(1.5, chime(note(84), .5, 1.4), .05, -.1);   // his blink
T.at(FLASH0, mixb(thunder(2.2, 1), click(1)), .3, .5);
T.at(FLASH0 + .15, neigh(1), .1, .5);
T.at(M0 - .3, whoosh(.4, 300, 4000), .16, 0);

// ================= 1 · Matsya =================
T.at(M0, wind(MGROW - M0, 0, 1), .04, 0);
T.at(M0, gurgle(MGROW - M0, .6), .04, 0);
for (let k = 0; k < 4; k++) T.at(M0 + .3 + k * 1.1, bird(2400 + k * 200, .5), .04, .4 - k * .2);
descend(M0 + .6, 0);
T.at(M0 + .7, mixb(splash(.4), plink(1600, .5)), .1, 0);
T.at(M0 + 1.0, voice([[0, .22, 1.3, .9], [.28, .3, 1.5, .9]], 700, { rise: .3, amp: .6 }), .08, 0);   // "please?"
T.at(M0 + 1.9, voice([[0, .25, 1.4, .9]], 700, { rise: .4, amp: .5 }), .06, 0);
T.at(M0 + 3.0, mixb(chime(note(91), .5, 1.2), plink(1800, .4)), .06, 0);   // he's happy
T.at(MGROW - .7, mixb(slide(.7, 200, 1400, .8), whoosh(.7, 300, 4000)), .2, 0);   // he grows
T.at(MGROW, mixb(thunder(2.4, 1), splash(1)), .32, .3);
T.at(MGROW, rain(K0 - MGROW + .3, 1), .1, 0);
T.at(MGROW, wind(K0 - MGROW, 1, .8), .1, 0);
for (let k = 0; k < 4; k++) T.at(MGROW + .4 + k * 1.0, whoosh(.9, 200, 900), .1, -.3 + k * .2);   // the swell
T.at(MGROW + .9, thunder(2.2, .9), .22, .4);
T.at(MGROW + 2.9, thunder(1.8, .6), .14, -.3);
T.at(MGROW + .6, creak(1.2, .8), .06, -.5);
T.at(MGROW + 1.4, mixb(chime(note(84), .6, 1.4), drum(46, .6, .6)), .1, .3);
T.at(K0 - .3, whoosh(.4, 300, 4000), .16, 0);

// ================= 2 · Kurma =================
T.at(K0, pad(KRISE - K0, [52, 59, 64], 1, .4, .3), .05, 0);
T.at(K0 + .3, creak(1.8, 1), .08, 0);
T.at(K0 + .6, mixb(slide(1.6, 220, 80, .8), rumble(1.8, .7)), .14, 0);   // it sinks
T.at(K0 + .8, gurgle(1.4, .8), .1, 0);
T.at(K0 + 1.1, talk(.8, 230, { gap: .12, br: .7, amp: .5 }), .07, -.5);   // "oh no!"
T.at(K0 + 1.3, talk(.8, 150, { gap: .13, br: .7, amp: .5 }), .07, .5);
descend(KRISE, 0);
T.at(KRISE + .1, mixb(splash(1.2), boom(.9)), .34, 0);
T.at(KRISE + .2, brass(1.6, [45, 52, 57], 1, .3, .6), .1, 0);
T.at(KRISE + .9, laughter(1.0, .6), .08, 0);   // the cheer
T.at(KRISE + 1.0, mixb(chime(note(81), .6, 1.4), shimmer(1, [note(88), note(93)], .5, .08)), .08, 0);
for (let k = 0; k < 5; k++) T.at(KRISE + 1.2 + k * .8, creak(.6, .6), .05, k % 2 ? .3 : -.3);   // the churning again
T.at(V0 - .3, whoosh(.4, 3000, 200), .16, 0);

// ================= 3 · Varaha =================
T.at(V0, drone(VBURST - V0, 46, 1), .1, 0);
T.at(V0, gurgle(VBURST - V0, .7), .08, 0);
T.at(V0 + .4, mixb(laughter(1.6, .8), voice([[0, .3, 1, .4], [.32, .3, .9, .4], [.64, .4, .8, .4]], 90, { amp: .9 })), .12, -.4);   // the demon laughs
T.at(V0 + .6, slide(1.6, 400, 120, .6), .06, .2);   // the earth sinks
descend(VBURST, .1);
T.at(VBURST, mixb(splash(1.4), boom(1), whoosh(.6, 300, 5000)), .36, 0);
T.at(VBURST + .2, voice([[0, .35, 1, .3], [.4, .3, .8, .3]], 70, { amp: 1, shake: .5 }), .14, 0);   // the boar's snort
T.at(VBURST + .3, pad(N0 - VBURST - .2, [57, 64, 69, 73], 1, .6, .8), .07, 0);
T.at(VBURST + .5, brass(1.6, [45, 52, 57, 64], 1, .2, .7), .09, 0);
for (let k = 0; k < 4; k++) T.at(VBURST + 1.2 + k * .7, bird(2600 + k * 150, .5), .04, .5 - k * .3);
T.at(N0 - .3, whoosh(.4, 300, 3000), .14, 0);

// ================= 4 · Narasimha =================
T.at(N0, tanpura(STRIKE - N0, 43, 1), .04, 0);
T.at(N0 + .3, mixb(laughter(2, .9), voice([[0, .3, 1, .4], [.35, .3, .92, .4], [.7, .3, .85, .4], [1.05, .45, .8, .4]], 85, { amp: 1 })), .13, 0);
[N0 + .9, N0 + 1.4, N0 + 1.9].forEach((a, i) => T.at(a, mixb(drum(60 - i * 6, .9, .5), click(.6)), .16, 0));   // the clauses
for (let k = 0; k < 4; k++) T.at(STRIKE - 1.0 + k * .16, step(.6), .1, -.2);
T.at(STRIKE - .45, whoosh(.4, 300, 2000), .12, -.2);
T.at(STRIKE, mixb(thud(1), crunch(1), drum(44, 1, .6)), .38, -.3);   // the fist
T.at(STRIKE + .1, slide(.7, 300, 1600, .5), .08, -.3);   // the cracks run up
descend(PILLAR, -.2, .8);
T.at(PILLAR, mixb(boom(1.3), rockfall(1.8, 1)), .45, 0);
T.at(PILLAR + .05, roar(1.6, 95, 6, 1), .3, 0);
T.at(PILLAR + .2, thunder(2, .6), .1, 0);
T.at(PILLAR + .3, brass(2.4, [38, 45, 50, 53], 1, .1, 1), .12, 0);
T.at(FEAR, mixb(heart(1), sub(1.2, 44, .7)), .18, 0); T.at(FEAR + .5, heart(1), .2, 0);
T.at(FEAR + .3, voice([[0, .5, 1, .8]], 160, { fall: -.3, shake: 1.5, amp: .6 }), .07, 0);   // a whimper
T.at(ROAR2, mixb(roar(1.5, 100, 6, 1), boom(.8)), .3, 0);
T.at(W0 - .3, whoosh(.4, 300, 3000), .14, 0);

// ================= 5 · Vamana =================
T.at(W0, fire(WGROW - W0, .7), .05, 0);
for (let k = 0; k < 3; k++) T.at(W0 + .2 + k * 1.4, bell(note(76 + k * 2), 1.4, { k: 2 }), .04, -.3 + k * .3);
descend(W0 + .6, .5);
T.at(W0 + .7, mixb(plink(1800, .6), squeak(600, 1200, .12, .5)), .08, .5);
T.at(W0 + 1.5, pop(900, 1), .12, .3);   // his wish
[0, .25, .5].forEach((d, i) => T.at(W0 + 1.9 + d, plink(1200 + i * 200, .6), .07, .3));   // three footsteps
T.at(W0 + 3.0, mixb(laughter(1.2, .7), voice([[0, .2, 1, .5], [.25, .2, 1.1, .5], [.5, .3, 1, .5]], 120, { amp: .8 })), .1, -.3);   // Bali laughs
T.at(WGROW, mixb(riser(.85, 120, 1200, 1), pad(.9, [50, 57, 62, 69], 1, .5, .3)), .2, 0);
T.at(STEP1 + .45, mixb(boom(1.3), rumble(1.4, .8)), .45, 0);
T.at(STEP1 + .45, shimmer(1.2, [note(76), note(83), note(88)], .5, .08), .07, 0);
T.at(STEP2, mixb(whoosh(1, 200, 6000), slide(.9, 300, 900, .5)), .3, 0);
T.at(STEP2 + .6, boom(.8), .2, .4);
T.at(HEAD + .1, pad(P0 - HEAD, [57, 61, 64, 69], 1, .5, .6), .07, 0);
T.at(HEAD + 1.3, mixb(bell(note(69), 2.2, { k: 1.4 }), chime(note(81), .6, 1.8)), .12, 0);
T.at(P0 - .3, whoosh(.4, 300, 3000), .14, 0);

// ================= 6 · Parshurama =================
for (let k = 0; k < 6; k++) T.at(P0 + .1 + k * .45, taiko(k % 2 ? .6 : 1), .14, 0);
T.at(P0 + .2, brass(2.4, [45, 49, 52], 1, .2, .6), .08, 0);   // the kings' swagger
T.at(P0 + 1.2, laughter(1.0, .6), .06, 0);
descend(PAXE, 0);
T.at(PAXE, mixb(drum(44, 1, 1.0), thud(.7)), .3, 0);
T.at(PAXE + .1, ring(2.2, 2600, .5), .05, -.2);
T.at(PAXE, brass(2.2, [38, 42, 45], 1, .2, .6), .1, 0);
for (let k = 0; k < 10; k++) T.at(PFLEE + k * .13, step(.7), .1, -.6 + k * .12);
T.at(PFLEE + .1, voice([[0, .5, 1.2, .9]], 300, { fall: -.4, shake: 1, amp: .6 }), .07, -.3);   // a scream
[.4, .55, .7].forEach((d, i) => T.at(PFLEE + d, mixb(plink(2000 + i * 300, .7), click(.5)), .1, -.4 + i * .4));   // crowns hit the ground
T.at(R0 - .3, whoosh(.4, 300, 3000), .14, 0);

// ================= 7 · Ram =================
T.at(R0, sub(RAM - R0, 41, .8), .1, 0);
T.at(R0 + .2, mixb(laughter(1.6, 1), voice([[0, .25, 1, .5], [.3, .25, .95, .5], [.6, .25, .9, .5]], 110, { amp: .8 }), voice([[.1, .25, 1.4, .6], [.4, .25, 1.3, .6]], 160, { amp: .6 })), .12, 0);
T.at(R0 + 1.9, mixb(noise(.3, { hp: 600, lp: 3000, e: env.pluck(10), amp: .8 }), voice([[0, .4, .8, .3]], 140, { fall: .2, amp: .6 })), .08, 0);   // "pfft, humans"
descend(RAM, 0);
T.at(RAM + .4, creak(1.2, .8), .1, .2);   // the string drawn
T.at(RAM + .3, pad(REV - RAM, [57, 64, 69, 76], 1, .3, .4), .07, 0);
T.at(RAM + 1.6, ring(1.4, 2200, .4), .05, .2);
for (let k = 0; k < 10; k++) T.at(REV + .1 + k * .1, gulp(.6 + .3 * rnd()), .07, -.6 + k * .13);   // ten gulps
T.at(REV + 1.0, squeak(600, 300, .3, .5), .05, 0);
T.at(G0 - .3, whoosh(.4, 300, 3000), .14, 0);

// ================= 8 · Krishna =================
descend(G0 + .6, 0, .7);
T.at(G0 + .3, conch(1.8, 1), .12, 0);   // Panchajanya
T.at(G0 + .3, tanpura(B9 - G0 - .3, 50, 1), .045, 0);
T.at(G0 + 1.2, flute(7.2, [74, 76, 79, 81, 79, 76, 74, 71, 74, 76, 74, 69], .9), .08, .1);
T.at(G0 + 1.0, pad(B9 - G0 - 1.0, [50, 57, 62, 66], 1, 1.4, 1.2), .06, 0);
T.at(G0 + 1.2, bell(note(69), 2.6, { k: 1.4 }), .08, 0);
T.at(G0 + 3.2, mixb(chime(note(86), .6, 1.8), shimmer(1.4, [note(81), note(86), note(90)], .5, .1)), .08, 0);
T.at(B9 - .3, whoosh(.4, 300, 3000), .14, 0);

// ================= 9 · Balarama or Buddha =================
descend(B9 + .6, -.4, .8); descend(B9 + .75, .4, .8);
T.at(B9 + 1.2, boing(200, .9), .12, 0);   // the ?
T.at(B9 + 1.4, mixb(chime(note(79), .6, 1.4), chime(note(80), .6, 1.4)), .06, 0);   // two notes that don't agree
T.at(BAL, mixb(taiko(1), drum(52, .6, .6)), .2, -.2);
T.at(BAL + .8, mixb(thud(.8), crunch(.6)), .2, .1);   // the plough bites
T.at(BAL + 1.4, mixb(splash(.6), whoosh(2.0, 300, 1200), gurgle(2, .7)), .2, .1);   // the river drags
T.at(BAL + 1.4, brass(2.2, [43, 50, 55], 1, .6, .6), .08, 0);
T.at(BUD - .3, whoosh(.4, 3000, 300), .12, 0);
T.at(BUD, bell(note(62), 3.4, { k: 1 }), .1, 0);
T.at(BUD, pad(X0 - BUD, [62, 69, 74, 78], 1, 1, 1.2), .05, 0);
for (let k = 0; k < 3; k++) T.at(BUD + .6 + k * 1.3, bird(2800 + k * 300, .5), .03, -.5 + k * .3);
for (let k = 0; k < 6; k++) T.at(BUD + .5 + k * .36, step(.25), .05, -.6 + k * .1);
T.at(BUD + 1.4, bleat(.8), .07, -.4);
T.at(BUD + 3.3, mixb(chime(note(88), .5, 1.4), plink(1600, .4)), .06, -.1);   // the heart

// ================= 10 · Kalki =================
T.at(X0, mixb(thunder(2.6, 1), click(1)), .34, -.3);
T.at(X0, rain(ASK - X0, 1), .09, 0);
T.at(X0, wind(ASK - X0, 2, 1), .1, 0);
T.at(X0, sub(YET - X0 + 2, 38, 1), .14, 0);
for (let k = 0; k < 13; k++) { const a = X0 + .4 + k * .3; T.at(a, hoof(.8), .13, -.5 + k * .06); T.at(a + .09, hoof(.6), .1, -.5 + k * .06); }
T.at(X0 + 2.4, thunder(1.8, .6), .14, .4);
T.at(YET - .6, mixb(riser(.6, 200, 1400, .6)), .08, 0);
T.at(YET, mixb(thunder(3, 1.2), boom(1.1)), .45, 0);
T.at(YET + .1, neigh(1.2), .16, .2);
T.at(YET + .3, brass(3, [38, 45, 50, 57], 1, .4, 1.2), .12, 0);

// ================= ASK =================
T.at(ASK, mixb(bell(note(57), 3.4, { k: 1.4 }), taiko(.9)), .16, 0);
T.at(ASK, om(CARD - ASK, 110, .8), .05, 0);
for (let i = 0; i < 10; i++) T.at(ASK + .2 + i * .12, pop(700 + i * 70, .8), .09, -.6 + i * .13);
T.at(ASK + 1.5, mixb(boing(240, .8), shimmer(.8, [note(91), note(96)], .5, .08)), .08, 0);

// ================= the card =================
T.at(CARD - .3, whoosh(.6, 400, 3000), .2, 0);
[0, .15, .3].forEach((d, i) => T.at(CARD + .3 + d, pop(800 + i * 140, .9), .14, -.3 + i * .3));
T.at(CARD + 1.0, chime(note(84), .7, 1.4), .1, 0); T.at(CARD + 1.3, chime(note(91), .7, 1.4), .1, 0);
T.at(CARD + 1.6, pop(1000, 1), .16, 0); T.at(CARD + 2.0, chime(note(96), .6, 2), .08, 0);
T.at(CARD + .2, pad(3.8, [64, 67, 71, 76], 1, .5, 1.2), .05, 0);

T.write('assets/dasha_sfx.wav');
