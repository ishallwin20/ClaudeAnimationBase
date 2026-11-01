// parshu3_sfx.mjs: the sound for "His father ordered PARSHURAMA to KILL HIS MOTHER" (src/scenes/parshu3.js, ad 70, no
// voice) → assets/parshu3_sfx.wav. Times are the scene's constants (keep them in sync). Dark and spare, not cartoon:
// a sub drone and a heartbeat under the cold open, thunder on the order, a whip and a drum on each refusal, a morning of
// birds and a mild tanpura, the river (water, splashes, laughter), a wistful harp, dusk crickets and drips, a riser,
// silence, then the "DHIK!" (a taiko, thunder, a roar, a long ring); the order, the curse (a reversed swell, a dissonant
// shimmer, dull falling voices), the sunset wind, the heartbeat slowing under the raised axe, silence, the lamp blown
// out and a ringing in the dark; the boons (chimes, a harp glissando, a choir pad as she rises); a warm pad as she wakes.
import { tone, noise, bell, mixb, env, whoosh, plink, click, thud, shimmer, chime, drum, om, wind, damru, thunder,
  laughter, note, seed, rnd, clamp, SR, track, splash, drone, heart, chirp } from './sfx.mjs';

const B0 = 3.4, C0 = 4.8, D0 = 7.6;
const E0 = 10.2, WALK = 13.6;
const F0 = 15.2, G0 = 20.6;
const H0 = 25.6, OPEN = 27.4, DHIK = 30.4;
const I0 = 34.0, J0 = 39.4, CURSE = 40.6;
const K0 = 45.0, FATHER = 47.2, REACT = 49.6;
const L0 = 51.6, LAMP = 55.1, M0 = 59.0;
const N0 = 64.2, B1 = 65.0, B2 = 67.6, B3 = 70.2;
const O0 = 73.8, P0 = 79.0, CARD = 83.4, END = 87.4;

const T0 = track(END);
seed(70);
// the soft stretches (the morning, the river, the boons, the waking) sit well under the hits: lift them so they carry on
// a phone, and keep the big hits from setting the peak
const LIFT = [[E0 - .3, H0 - .2, 3.6], [H0 - .2, DHIK - .05, 1.6], [K0 - .3, FATHER - .05, 2.4], [M0, P0 - .3, 3.4], [CARD - .3, END, 2]];
const T = { at: (t0, b, g = 1, pan = 0) => { const l = LIFT.find(([a, z]) => t0 >= a && t0 < z); T0.at(t0, b, g * (l ? l[2] : 1), pan); }, write: (...a) => T0.write(...a) };
// a buzzy voice: syllables [start, dur, pitch ×, brightness 0..1] (as in ads 63 and 68), here low and dark
function voice(syl, f0, { amp = 1, fall = .1, rise = 0, shake = 0 } = {}) {
  const D = Math.max(...syl.map(([s, d]) => s + d)) + .1, o = new Float32Array(Math.round(D * SR));
  let ph = 0, l = 0;
  for (let i = 0; i < o.length; i++) {
    const t = i / SR, s = syl.find(([a, d]) => t >= a && t < a + d);
    if (!s) { o[i] = 0; continue; }
    const [a, d, pm, br] = s, k = (t - a) / d, e = clamp(k / .12) * clamp((1 - k) / .25);
    ph += f0 * pm * (1.04 - fall * k + rise * k) * (1 + .012 * Math.sin(t * 38) + shake * .04 * Math.sin(t * 2 * Math.PI * 7)) / SR;
    const x = 2 * (ph - Math.floor(ph)) - 1, fc = 500 + br * 1800 * Math.sin(Math.PI * clamp(k * 1.3)), al = 1 - Math.exp(-2 * Math.PI * fc / SR);
    l += al * (x * e - l); o[i] = l * amp;
  }
  return o;
}
const talk = (dur, f, { gap = .18, amp = 1, br = .4, fall = .1, shake = 0 } = {}) =>
  voice(Array.from({ length: Math.max(1, Math.floor(dur / gap)) }, (_, i) => [i * gap, gap * .72, 1 + .12 * Math.sin(i * 2.3) - (i % 5 === 4 ? .12 : 0), br]), f, { amp, fall, shake });
const SAGE = 92, RAMAV = 165, RENU = 250, BRO = 120;
const add = (o, b, s0, g = 1) => { const s = Math.round(s0 * SR); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j] * g; return o; };
const lp = (b, fc) => { let l = 0; const a = 1 - Math.exp(-2 * Math.PI * fc / SR); for (let i = 0; i < b.length; i++) { l += a * (b[i] - l); b[i] = l; } return b; };
const tanpura = (dur, root = 50, amp = 1) => { const o = new Float32Array(Math.round((dur + 2.5) * SR)); const ns = [root + 7, root + 12, root + 12, root];
  for (let k = 0; k * .9 < dur; k++) add(o, lp(tone(2.4, note(ns[k % 4]), { type: 'saw', e: env.ad(.05, .9), amp }), 1400), k * .9, 1 - .5 * clamp((k * .9 - dur + 1.5) / 1.5)); return o; };
const pad = (dur, ms, amp = 1, a = 1.2, r = 1.4) => mixb(...ms.map((m, i) => tone(dur, t => note(m) * (1 + .003 * Math.sin(t * 2 + i)), { type: 'tri', e: env.swell(a, r), amp: amp / ms.length })));
const strings = (dur, ms, amp = 1, a = .8, r = 1) => mixb(...ms.map((m, i) => lp(tone(dur, t => note(m) * (1 + .004 * Math.sin(t * 31 + i * 2)), { type: 'saw', e: env.swell(a, r), amp: amp / ms.length }), 1600)));
const harp = (f, amp = 1) => bell(f, 1.6, { partials: [[1, 1], [2, .35], [3, .12]], k: 2.6, amp });
const bird = (f, amp = 1) => mixb(tone(.07, t => f + 400 * t / .07, { e: env.hann(), amp }), tone(.06, t => f * 1.3 - 300 * t / .06, { e: env.hann(), amp: amp * .7 }));
const sub = (dur, f = 41, amp = 1) => tone(dur, t => f + .6 * Math.sin(t * 1.3), { e: env.swell(.8, 1), amp });
const boom = (amp = 1) => mixb(drum(36, amp * .7, 1.8), noise(2.4, { brown: true, lp: 180, e: env.ad(.01, 1.6), amp }), thud(amp * .7));
const riser = (dur, f0 = 200, f1 = 1600, amp = 1) => mixb(tone(dur, t => f0 * Math.pow(f1 / f0, t / dur), { type: 'saw', e: env.swell(dur * .9, .02), amp: amp * .35 }), noise(dur, { hp: t => 300 + 3000 * t / dur, lp: 9000, e: env.swell(dur * .95, .02), amp: amp * .5 }));
const reverseSwell = (dur, amp = 1) => noise(dur, { hp: 400, lp: t => 800 + 6000 * (t / dur) ** 2, e: (t, D) => (t / D) ** 3, amp });
const ring = (dur, f = 3100, amp = 1) => tone(dur, f, { e: env.swell(.05, dur * .8), amp });
const water = (dur, amp = 1) => noise(dur, { lp: t => 900 + 400 * Math.sin(t * 2.3), hp: 200, e: env.swell(.6, .8), amp });
const step = (amp = 1) => mixb(noise(.06, { lp: 900, hp: 80, e: env.pluck(40), amp }), tone(.08, t => 90 - 200 * t, { e: env.pluck(30), amp: amp * .5 }));

// ================= A · the hook (dark) =================
T.at(0, sub(D0 + .4, 41, 1), .22, 0);                                                 // a sub drone under the whole cold open
T.at(0, strings(3.4, [62, 63], 1, .2, .6), .05, 0);                                    // a high, tense minor second
[.25, 1.25, 2.25].forEach(t0 => T.at(t0, heart(1), .45, 0));                          // a heartbeat
T.at(.1, noise(3.2, { hp: 3000, lp: 9000, e: env.swell(.3, .5), amp: .2 }), .05, -.4);   // the axe's faint rattle
T.at(B0 - .3, whoosh(.4, 300, 4000), .2, 0);

// ================= B · the order =================
T.at(B0, thunder(2.4, 1), .55, .1);
T.at(B0, boom(1), .45, 0);
T.at(B0 + .15, voice([[0, .32, 1, .35], [.36, .5, .9, .3]], SAGE, { fall: .2, amp: 1 }), .2, 0);   // "Kill her."

// ================= C · four refuse =================
for (let i = 0; i < 4; i++) {
  const t0 = C0 + i * .7;
  T.at(t0 - .05, whoosh(.25, 600, 4000), .22, i % 2 ? .5 : -.5);                     // the whip
  T.at(t0, drum(52 - i * 3, 1, .5), .35, 0);
  T.at(t0 + .15, voice([[0, .12, 1, .3], [.16, .16, .82, .3]], BRO * (1 + i * .06), { fall: .3, amp: .8 }), .1, i % 2 ? .3 : -.3);   // "mm-mm"
}

// ================= D · one didn't =================
T.at(D0, whoosh(.25, 4000, 500), .2, 0);
[D0 + .1, D0 + 1.0, D0 + 1.9].forEach(t0 => T.at(t0, heart(1.2), .55, 0));
T.at(D0 + .7, mixb(bell(note(88), 1.6, { partials: [[1, 1], [2.7, .5], [5.2, .25]], k: 3 }), click(.6)), .12, -.3);   // the blade glints
T.at(D0 + .8, strings(2, [38, 45, 50], 1, .3, .8), .12, 0);
T.at(E0 - .5, whoosh(.5, 3000, 300), .14, 0);                                          // the iris closes

// ================= E · the family =================
T.at(E0 + .2, tanpura(F0 - E0 + 4, 50, 1), .03, 0);                                   // a mild tanpura under the morning and the river
T.at(E0, wind(F0 - E0, 0, 1.2), .03, -.3);
for (let t = E0 + .5; t < F0 - .3; t += 1.1 + rnd() * .6) T.at(t, bird(2600 + rnd() * 900, .5), .04, rnd() * 1.4 - .7);
T.at(E0 + .5, bell(note(74), 2.4, { k: 1.8 }), .06, 0);
T.at(E0 + 1.6, mixb(plink(note(88), .6), chime(note(91), .5, 1.2)), .07, .5);         // the RAMA tag
for (let k = 0; k < 10; k++) T.at(WALK + .1 + k * .17, step(.6), .1, .2 + k * .05);   // off to gather fruit

// ================= F · the river =================
T.at(F0, water(G0 - F0 + 1, 1), .07, 0);
T.at(F0 - .2, whoosh(.5, 400, 3000), .14, 0);
for (let k = 0; k < 6; k++) T.at(F0 + .6 + k * .8 + rnd() * .3, splash(.6), .06, .35);
T.at(F0 + .8, laughter(1.4, .8), .04, .4); T.at(F0 + 3.2, laughter(1.2, .7), .035, .45);
T.at(F0 + 1.2, harp(note(76), .6), .05, 0);

// ================= G · her heart wandered =================
T.at(G0, pad(4.8, [64, 67, 71, 76], 1, .8, 1.4), .05, 0);
for (let k = 0; k < 6; k++) T.at(G0 + .3 + k * .14, harp(note([76, 79, 83, 86, 88, 91][k]), .6), .07, -.2 + k * .08);
T.at(G0 + 1.4, shimmer(1.4, [note(96), note(100), note(103)], .5, .1), .05, .2);
T.at(H0 - 1.1, strings(1.6, [38, 39], 1, 1, .3), .1, 0);                              // a low, wrong swell into dusk

// ================= H · home, shaking; the sage sees; "DHIK!" =================
T.at(H0, sub(DHIK - H0, 44, 1), .14, 0);
for (let t = H0 + .2; t < DHIK - 1.2; t += .35 + rnd() * .3) T.at(t, chirp(.35), .02, rnd() * 1.6 - .8);   // crickets
for (let k = 0; k < 6; k++) T.at(H0 + .1 + k * .3, step(.35), .1, .5 - k * .1);
for (let k = 0; k < 7; k++) T.at(H0 + .6 + k * .5 + rnd() * .2, plink(note(96 + (k % 3) * 2), .35), .035, .2);   // drips
T.at(OPEN, mixb(strings(DHIK - OPEN, [50, 51, 57], 1, 1.4, .1), om(DHIK - OPEN, 70, .6)), .1, 0);   // his eyes open
T.at(DHIK - 1.25, riser(1.05, 120, 1400, 1), .18, 0);
// silence 0.2 s, then the hit
T.at(DHIK, boom(1.2), .7, 0);
T.at(DHIK, thunder(3, 1), .6, -.1);
T.at(DHIK + .02, voice([[0, .7, 1, .7]], SAGE, { fall: .25, amp: 1, shake: .6 }), .35, 0);   // "DHIK!"
T.at(DHIK + .05, mixb(bell(note(43), 3.4, { k: 1.2 }), whoosh(.9, 200, 2000)), .25, 0);
T.at(DHIK + .2, ring(3, 2600, .3), .03, 0);

// ================= I · the order to each son =================
T.at(I0, sub(CURSE - I0, 41, 1), .16, 0);
T.at(I0 + .3, talk(1.9, SAGE, { gap: .2, br: .35, amp: .9 }), .16, -.3);
T.at(I0 + .5, strings(CURSE - I0 - .5, [45, 46], 1, 1.4, .2), .07, 0);
for (let k = 0; k < 4; k++) T.at(I0 + 2.4 + k * .25, plink(note(72 + k), .5), .06, -.2 + k * .2);   // the names
for (let t = I0 + 2.0, g = .95; t < CURSE - .2; t += g, g *= .9) T.at(t, heart(.9), .4, 0);   // a heartbeat, quickening

// ================= J · the curse =================
T.at(CURSE - 1.0, reverseSwell(1.0, 1), .22, 0);
T.at(CURSE, boom(1), .5, 0);
T.at(CURSE, mixb(shimmer(1.8, [note(73), note(74), note(80), note(81)], .7, .08), strings(3.6, [49, 50, 56], 1, .05, 2)), .12, 0);   // dissonant
T.at(CURSE + .05, whoosh(1.4, 3000, 200), .2, .3);
for (let i = 0; i < 4; i++) T.at(CURSE + .4 + i * .14, voice([[0, .9, 1, .25]], BRO * (1 + i * .05), { fall: .5, amp: .6 }), .06, -.2 + i * .25);   // dull, falling "uhhh"
T.at(CURSE + 1.5, om(K0 - CURSE - 1.5, 65, .5), .06, .3);

// ================= K · Rama comes home; the order; his face =================
T.at(K0, wind(L0 - K0, 1, .8), .06, -.2);
T.at(K0 - .25, whoosh(.5, 400, 3000), .14, 0);
for (let k = 0; k < 7; k++) T.at(K0 + .1 + k * .2, step(.6), .1, -.5 + k * .1);
T.at(K0 + 1.5, voice([[0, .3, 1.3, .6]], RAMAV, { rise: .3, amp: .7 }), .07, -.2);   // a gasp at his brothers
T.at(FATHER, mixb(drum(44, 1, 1.2), thud(.8)), .45, 0);
T.at(FATHER + .1, talk(1.9, SAGE, { gap: .2, br: .35, amp: 1 }), .2, 0);
T.at(FATHER, sub(L0 - FATHER, 41, 1), .16, 0);
T.at(REACT, mixb(click(.5), whoosh(.2, 2000, 5000)), .12, 0);
T.at(REACT + .3, ring(2, 1760, .5), .03, 0);                                           // the world goes thin
T.at(REACT + .6, strings(2, [62, 63, 69], 1, .6, .6), .07, 0);

// ================= L · he obeyed =================
T.at(L0, wind(LAMP - L0, 2, .5), .07, 0);
T.at(L0, sub(LAMP - L0 - .4, 38, 1), .2, 0);
[L0 + .2, L0 + 1.1, L0 + 2.1, L0 + 3.2].forEach((t0, i) => T.at(t0, heart(1.1 - i * .15), .55, 0));   // the heartbeat slows
T.at(L0 + .8, riser(2.4, 80, 400, .6), .07, 0);                                         // the axe lifts
// LAMP - .5 .. LAMP: silence
T.at(LAMP, noise(.35, { lp: 1600, hp: 300, e: env.ad(.01, .3), amp: 1 }), .2, -.1);   // the flame blown out
T.at(LAMP + .02, boom(.8), .4, 0);
T.at(LAMP + .2, ring(3.6, 3300, .35), .025, 0);                                        // a ringing in the dark
T.at(LAMP + .6, bell(note(38), 3.2, { k: 1 }), .14, 0);                                 // one deep bell under "HE OBEYED."

// ================= M · "ask for any boon" =================
T.at(M0 + .2, tanpura(N0 - M0 + 9.4, 50, 1), .028, 0);
T.at(M0 + .4, talk(2.2, SAGE, { gap: .22, br: .3, amp: .8 }), .12, -.3);
T.at(M0 + .3, pad(5, [50, 57, 62], 1, 1.4, 1.2), .05, 0);
T.at(M0 + 2.9, chime(note(74), .6, 2), .05, 0);

// ================= N · the boons =================
for (const [t0, m] of [[B1, 79], [B2, 83], [B3, 86]]) { T.at(t0, mixb(chime(note(m), .8, 2), click(.3)), .1, 0); T.at(t0 + .05, talk(1.1, RAMAV, { gap: .16, br: .5, amp: .7, shake: .4 }), .08, -.4); }
T.at(B1 + .35, whoosh(.6, 400, 2400), .1, .1);                                           // the lamp catches
for (let k = 0; k < 9; k++) T.at(B1 + .5 + k * .1, harp(note([67, 71, 74, 79, 83, 86, 91, 95, 98][k]), .7), .08, -.2 + k * .05);   // the glissando
T.at(B1 + .9, mixb(shimmer(2, [note(91), note(96), note(100), note(103)], .6, .14), pad(5.6, [67, 71, 74, 79], 1, 1, 1.6)), .1, 0);   // she rises: a choir pad
T.at(B2 + .4, pad(3, [69, 72, 76], 1, .8, 1.2), .04, 0);
for (let i = 0; i < 2; i++) T.at(B3 + .45 + i * .2, mixb(plink(note(84 + i * 3), .6), voice([[0, .25, 1.3, .6]], BRO, { rise: .3, amp: .5 })), .06, .4 + i * .2);   // the brothers wake

// ================= O · she never knew =================
T.at(O0 - .1, shimmer(.7, [note(96), note(100), note(103)], .5, .06), .08, 0);
T.at(O0, pad(P0 - O0 + .4, [64, 67, 71, 76], 1, .8, 1.4), .06, 0);
for (let t = O0 + .6; t < P0 - .6; t += 1.6 + rnd()) T.at(t, bird(2800 + rnd() * 600, .4), .025, rnd() - .5);
T.at(O0 + 1.3, harp(note(76), .7), .07, .2);
T.at(O0 + 1.6, mixb(chime(note(91), .6, 1.4), voice([[0, .35, 1.1, .4]], RENU, { amp: .5 })), .06, .3);   // her warm "mm"
T.at(O0 + 2.4, voice([[0, .4, 1, .4], [.5, .3, .9, .3]], RAMAV, { fall: .2, amp: .5, shake: .5 }), .05, -.3);   // a sob that is half a laugh

// ================= P · the ask =================
T.at(P0 - .25, whoosh(.5, 400, 3000), .16, 0);
T.at(P0, mixb(boom(.8), bell(note(45), 3.4, { k: 1.3 })), .3, 0);
T.at(P0, sub(CARD - P0, 41, .8), .12, 0);
T.at(P0 + .8, mixb(click(.6), plink(note(76), .5)), .08, 0);                           // VS
T.at(P0 + 1.0, mixb(damru(240, .7)), .08, 0);
for (let k = 0; k < 5; k++) T.at(P0 + 1.2 + k * .09, damru(250 + (k % 2) * 30, .5), .06, 0);

// ================= Q · the card =================
const pop = (f = 900, amp = 1) => mixb(tone(.07, t => f * .6 + f * t / .07, { e: env.hann(), amp }), plink(f * 1.5, amp * .5));
T.at(CARD - .3, whoosh(.6, 400, 3000), .2, 0);
[0, .15, .3].forEach((d, i) => T.at(CARD + .3 + d, pop(800 + i * 140, .9), .14, -.3 + i * .3));
T.at(CARD + 1.0, chime(note(84), .7, 1.4), .1, 0); T.at(CARD + 1.3, chime(note(91), .7, 1.4), .1, 0);
T.at(CARD + 1.6, pop(1000, 1), .16, 0); T.at(CARD + 2.0, chime(note(96), .6, 2), .08, 0);
T.at(CARD + .2, pad(3.8, [64, 67, 71, 76], 1, .5, 1.2), .05, 0);

T.write('assets/parshu3_sfx.wav');
