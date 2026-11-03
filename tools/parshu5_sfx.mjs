// parshu5_sfx.mjs: the sound for "PARSHURAMA won the whole EARTH, then gave it away" (src/scenes/parshu5.js, ad 74, no
// voice) → assets/parshu5_sfx.wav. Times are the scene's constants (keep them in sync). Part 3's dark hits for the cold
// open, the sons, the cry, the lamp and the vow (a sub, a heartbeat, a taiko, silence before the blow); a war drum and a
// tick per war under the tally; a tanpura and a warm pad for the ashram, the ancestors and the crowning; retro pops on
// the card. Mild, never loud: the music is added on Instagram.
import { tone, noise, bell, mixb, env, whoosh, plink, squeak, click, thud, shimmer, chime, drum, om, wind, damru, thunder,
  note, seed, rnd, clamp, SR, track, heart, roar, crunch } from './sfx.mjs';

const B0 = 3.8, C0 = 7.4;
const D0 = 10.2, E0 = 15.0, F0 = 19.6;
const G0 = 24.6, CRY = 25.4, LAMP = 26.6, OUT = 27.4;
const H0 = 29.2, DROP = 31.0, I0 = 33.8, VOW = 36.4;
const J0 = 38.8, CROWNS = 41.4, K0 = 43.6, TALLY = 44.2, TOP = 48.0;
const L0 = 50.0, M0 = 54.8, O0 = 60.0, CALM = 60.2, KURU = 61.6;
const P0 = 64.8, GIVE = 65.4, LEAVE = 67.0, R0 = 69.6, CROWN1 = 71.6, S0 = 75.0, CARD = 80.0, END = 84.0;
const tick = n => TALLY + (TOP - TALLY) * Math.sqrt((n - 1) / 20);

const T0 = track(END);
seed(74);
// the soft stretches (the ashram, the ancestors, the gift, the princes) sit well under the hits: lift them on a phone
const LIFT = [[E0 - .3, F0, 2.4], [M0 - .3, O0 - .3, 1.6], [O0 - .3, S0 - .3, 2.6], [CARD - .3, END, 2]];
const T = { at: (t0, b, g = 1, pan = 0) => { const l = LIFT.find(([a, z]) => t0 >= a && t0 < z); T0.at(t0, b, g * (l ? l[2] : 1), pan); }, write: (...a) => T0.write(...a) };
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

// ================= A · the hook: Parshurama on top of the earth =================
T.at(0, sub(C0 + .2, 41, 1), .2, 0);
T.at(0, brass(3.4, [38, 45, 50], 1, .1, .8), .11, 0);                                    // a low royal brass
T.at(.1, shimmer(2.4, [note(81), note(86), note(88)], .6, .1), .05, 0);
T.at(1.0, mixb(bell(note(57), 2.4, { k: 1.4 }), click(.3)), .08, 0);
T.at(B0 - .3, whoosh(.4, 300, 4000), .2, 0);

// ================= B · he gives it away; "now leave my land" =================
T.at(B0, mixb(drum(44, 1, 1.0), thud(.7)), .35, 0);
T.at(B0 + .1, fire(3.4, 1), .05, .1);
T.at(B0 + .3, mixb(chime(note(84), .8, 1.4), pop(900, .5)), .08, .3);                    // the earth changes hands
T.at(B0 + 1.2, talk(1.4, SAGE, { gap: .2, br: .35, amp: .8 }), .12, .3);                 // "now leave my land"
T.at(B0 + 2.7, boing(150, .7), .08, -.3);                                               // Rama's blink
T.at(C0 - .3, whoosh(.35, 600, 5000), .22, 0);

// ================= C · 21 wars =================
T.at(C0, boom(1.1), .6, 0);
T.at(C0, thunder(2.4, 1), .4, .1);
[C0 + .1, C0 + 1.0, C0 + 1.9].forEach(t0 => T.at(t0, heart(1.2), .5, 0));
T.at(C0 + .35, mixb(bell(note(88), 1.6, { partials: [[1, 1], [2.7, .5], [5.2, .25]], k: 3 }), click(.6)), .14, -.3);   // the eyes ignite
T.at(D0 - .5, whoosh(.5, 3000, 300), .14, 0);

// ================= D · the sons by the empty throne =================
T.at(D0, strings(E0 - D0, [38, 45, 46], 1, 1, 1), .09, 0);
T.at(D0, sub(E0 - D0, 38, .7), .12, 0);
T.at(D0 + 1.4, mixb(boom(.6), roar(.9, 110, 4, .6)), .16, 0);                            // they turn: revenge
T.at(D0 + 1.5, voice([[0, .6, .9, .3], [.7, .5, .8, .3]], 105, { fall: .3, amp: .7 }), .07, -.4);   // a growl
T.at(E0 - .4, whoosh(.5, 400, 3000), .12, 0);

// ================= E · the ashram by day: Rama goes for firewood =================
T.at(E0, tanpura(F0 - E0, 50, 1), .03, 0);
for (let t = E0 + .5; t < F0 - .4; t += .9 + rnd() * .6) T.at(t, bird(2600 + rnd() * 800, .5), .035, rnd() * 1.4 - .7);
T.at(E0, fire(F0 - E0, .5), .03, -.1);
for (let k = 0; k < 10; k++) T.at(E0 + .6 + k * .38, step(.5), .06, .2 + k * .05);

// ================= F · dusk: the sons creep in =================
T.at(F0, wind(G0 - F0, 1, .7), .07, 0);
T.at(F0, strings(G0 - F0 + .3, [45, 46, 51], 1, 1.2, .6), .08, 0);
T.at(F0 + .3, sub(G0 - F0, 36, .8), .14, 0);
for (let k = 0; k < 9; k++) T.at(F0 + .4 + k * .36, step(.4), .06, .6 - k * .04);
[F0 + 1.0, F0 + 1.9, F0 + 2.7, F0 + 3.4, F0 + 4.0, F0 + 4.5].forEach(t0 => T.at(t0, heart(1), .3, 0));
T.at(F0 + 3.5, mixb(squeak(380, 520, .5, .5)), .04, .5);                                 // a bowstring drawn

// ================= G · "Rama! Rama!"; the arrows; the lamp goes out =================
T.at(CRY - .05, mixb(boom(.7), whoosh(.3, 4000, 600)), .3, 0);
T.at(CRY, voice([[0, .55, 1.2, .7], [.65, .6, 1.0, .6], [1.45, .55, 1.25, .7], [2.1, .7, 1.0, .5]], 120, { fall: .2, amp: 1, shake: .4 }), .2, -.1);   // "Ra-ma! Ra-ma!"
T.at(LAMP - .1, mixb(...[0, 1, 2, 3].map(i => whoosh(.5, 2600 + i * 500, 400))), .3, .2);   // the volley
for (let k = 0; k < 6; k++) T.at(LAMP + k * .09, hiss(.25, .8), .08, .6 - k * .2);
T.at(OUT - .25, wind(.5, 2, .8), .14, 0);                                                 // the flame gutters
T.at(OUT, mixb(click(.4)), .1, 0);
// OUT: then silence, a ringing, the smoke
T.at(OUT + .2, ring(1.8, 1760, .3), .03, 0);

// ================= H · Rama comes back with the firewood; the bundle falls =================
T.at(H0, wind(DROP - H0, 1, .5), .05, 0);
for (let t = H0 + .3; t < DROP - .2; t += .9 + rnd() * .5) T.at(t, bird(2900 + rnd() * 600, .4), .03, rnd() - .5);
for (let k = 0; k < 6; k++) T.at(H0 + .1 + k * .3, step(.6), .09, .3 - k * .1);
T.at(DROP, mixb(click(.5), whoosh(.2, 2000, 5000)), .1, 0);
for (let k = 0; k < 5; k++) T.at(DROP + .15 + k * .07 + rnd() * .05, mixb(crunch(.5), thud(.4)), .14, -.2 + k * .1);   // the sticks clatter
T.at(DROP + .4, mixb(boom(.9), thunder(2, .7)), .4, 0);
T.at(DROP + .5, strings(I0 - DROP, [38, 45, 50, 53], 1, .8, 1), .1, 0);
T.at(DROP + .5, ring(1.6, 2600, .3), .03, 0);

// ================= I · the pyre; the vow =================
T.at(I0, fire(J0 - I0 + .3, 1.2), .12, .2);
T.at(I0, pad(VOW - I0 + .4, [45, 52, 57, 60], 1, 1.4, 1), .07, 0);
T.at(I0 + .2, bell(note(57), 3.4, { k: 1.4 }), .06, 0);
T.at(VOW - .45, riser(.45, 120, 1600, 1), .16, 0);
T.at(VOW, mixb(taiko(1.2), boom(.9)), .5, 0);
T.at(VOW + .05, mixb(bell(note(88), 1.6, { partials: [[1, 1], [2.7, .5], [5.2, .25]], k: 3 }), click(.6)), .12, -.3);   // the eyes ignite
T.at(VOW, thunder(2.4, 1), .3, 0);
[VOW + .5, VOW + 1.3].forEach(t0 => T.at(t0, heart(1.1), .4, 0));

// ================= J · the king's city: he faces the sons; two crowns in the dust =================
T.at(J0, brass(CROWNS - J0, [38, 45, 50], 1, .2, .3), .12, 0);
for (let k = 0; k < 4; k++) T.at(J0 + .2 + k * .28, mixb(drum(42, .9, .5), thud(.5)), .3, -.3);   // his steps
T.at(J0 + 1.2, mixb(voice([[0, .7, 1.4, .8]], 140, { shake: .8, amp: .8 }), voice([[.1, .6, 1.6, .8]], 160, { shake: .8, amp: .7 })), .1, .4);   // the sons yelp
T.at(CROWNS - .45, riser(.4, 200, 2400, 1), .2, 0);
// CROWNS - .05: a beat of silence, then the blow
T.at(CROWNS, boom(1.3), .7, 0);
T.at(CROWNS, mixb(bell(note(43), 3.4, { k: 1.1 }), whoosh(1.0, 6000, 200)), .3, 0);
T.at(CROWNS + .05, ring(2.4, 2600, .3), .03, 0);
for (let i = 0; i < 2; i++) for (let k = 0; k < 5; k++) T.at(CROWNS + .25 + i * .3 + k * (.22 - k * .025), tink(.7 - k * .1), .1, .4 - i * .5);   // clink, clink… still
T.at(CROWNS + 1.0, wind(K0 - CROWNS - .6, 1, .5), .06, 0);

// ================= K · 21 times: the tally =================
T.at(K0, sub(TOP - K0 + 1.2, 41, 1), .16, 0);
T.at(K0, wind(L0 - K0, 2, .4), .06, 0);
T.at(K0 + .1, conch(1.8, 1), .06, -.2);
for (let n = 1; n <= 21; n++) T.at(tick(n), mixb(taiko(n === 21 ? 1.4 : .9), click(.4), plink(note(60 + n), .3)), n === 21 ? .55 : .26 + n * .006, (n % 2 ? -.2 : .2));
T.at(TOP, mixb(boom(1), bell(note(45), 3, { k: 1.2 })), .4, 0);
T.at(TOP + .1, roar(1.4, 90, 14, .8), .08, 0);                                          // the far roar of armies

// ================= L · Samantapanchaka: the five lakes =================
T.at(L0, strings(M0 - L0 + .3, [38, 45, 46, 50], 1, 1, .6), .09, 0);
T.at(L0, wind(M0 - L0, 1, .6), .07, 0);
for (let k = 0; k < 5; k++) T.at(L0 + .8 + k * .7, mixb(tone(.3, note(50 + (k % 3) * 2), { type: 'tri', e: env.pluck(8), amp: .6 })), .05, -.4 + k * .2);   // drops of water offered
T.at(L0 + .3, om(M0 - L0 - .6, 70, .7), .07, 0);

// ================= M · the ancestors =================
T.at(M0 - .2, whoosh(.6, 400, 4000), .12, 0);
T.at(M0, pad(O0 - M0 + .4, [57, 62, 66, 69, 74], 1, 1.6, 1.2), .09, 0);
T.at(M0 + .1, shimmer(2.6, [note(86), note(90), note(93), note(98)], .6, .1), .07, 0);
T.at(M0 + .3, bell(note(62), 4, { k: 1.4 }), .07, 0);
T.at(M0 + 1.4, talk(2.8, ELDER, { gap: .22, br: .3, amp: .8 }), .11, -.1);              // "Rama, we are pleased. Now be at peace."
T.at(M0 + 1.2, om(3.6, 110, .6), .05, 0);

// ================= O · at peace; the lakes clear; Kurukshetra =================
T.at(CALM, mixb(chime(note(84), .8, 2), shimmer(1.6, [note(91), note(96)], .5, .08)), .1, 0);
T.at(O0, tanpura(P0 - O0, 50, 1), .03, 0);
for (let t = CALM + .8; t < P0 - .4; t += .9 + rnd() * .6) T.at(t, bird(2700 + rnd() * 700, .4), .03, rnd() - .5);
T.at(KURU, mixb(boom(.6), conch(2.2, 1)), .14, 0);                                      // a conch on the horizon
T.at(KURU + .4, mixb(drum(46, .6, .6)), .08, 0); T.at(KURU + .8, mixb(drum(46, .5, .6)), .07, 0);
T.at(KURU, pop(800, .7), .08, .3);                                                       // the signpost pops up

// ================= P · the earth to Kashyapa =================
T.at(P0 - .2, whoosh(.5, 400, 3000), .12, 0);
T.at(P0, fire(R0 - P0, 1), .05, 0);
T.at(P0, pad(R0 - P0 + .3, [62, 66, 69, 74], 1, .8, 1.2), .05, 0);
T.at(GIVE, mixb(squeak(500, 1100, .5, .5), shimmer(1.2, [note(88), note(93), note(96)], .6, .08)), .1, 0);   // the earth floats across
T.at(GIVE + 1.2, mixb(chime(note(91), .8, 1.6), pop(1000, .5)), .08, .3);
for (let k = 0; k < 7; k++) T.at(LEAVE + .2 + k * .3, step(.5), .07, -.3 - k * .08);

// ================= R · the hidden princes crowned =================
T.at(R0 - .2, whoosh(.5, 400, 3000), .1, 0);
T.at(R0, pad(S0 - R0 + .3, [60, 64, 67, 72], 1, .6, 1.2), .05, 0);
T.at(R0 + .5, voice([[0, .4, .7, .3], [.5, .5, .65, .3]], 70, { fall: .2, amp: .7 }), .06, -.6);   // the bear's grumble
T.at(R0 + 1.2, moo(.9, 150, .8), .06, .5); T.at(R0 + 2.0, moo(.7, 280, .7), .05, .6);
for (let k = 0; k < 6; k++) T.at(R0 + .3 + k * .45, boing(300 + (k % 2) * 60, .35), .03, .6);   // the calf hops
[CROWN1, CROWN1 + .6].forEach((t0, i) => T.at(t0, mixb(pop(900 + i * 200, .9), chime(note(86 + i * 3), .8, 1.4)), .12, i ? .3 : -.4));
T.at(CROWN1 + 1.0, brass(1.6, [57, 62, 66], 1, .1, .6), .06, 0);                       // a small fanfare
for (let t = R0 + .4; t < S0 - .4; t += 1 + rnd() * .5) T.at(t, bird(2900 + rnd() * 600, .4), .03, rnd() - .5);

// ================= S · the ask: why 21? =================
T.at(S0 - .25, whoosh(.5, 400, 3000), .16, 0);
T.at(S0, mixb(boom(.7), bell(note(45), 3, { k: 1.3 })), .25, 0);
T.at(S0 + .2, mixb(squeak(400, 900, .25, .6), shimmer(.8, [note(91), note(96)], .5, .08)), .1, 0);   // the 21
for (let k = 0; k < 5; k++) T.at(S0 + 1.2 + k * .09, damru(250 + (k % 2) * 30, .5), .06, 0);
T.at(S0, sub(CARD - S0, 41, .7), .1, 0);

// ================= the card =================
T.at(CARD - .3, whoosh(.6, 400, 3000), .2, 0);
[0, .15, .3].forEach((d, i) => T.at(CARD + .3 + d, pop(800 + i * 140, .9), .14, -.3 + i * .3));
T.at(CARD + 1.0, chime(note(84), .7, 1.4), .1, 0); T.at(CARD + 1.3, chime(note(91), .7, 1.4), .1, 0);
T.at(CARD + 1.6, pop(1000, 1), .16, 0); T.at(CARD + 2.0, chime(note(96), .6, 2), .08, 0);
T.at(CARD + .2, pad(3.8, [64, 67, 71, 76], 1, .5, 1.2), .05, 0);

T.write('assets/parshu5_sfx.wav');
