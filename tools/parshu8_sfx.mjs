// parshu8_sfx.mjs: the sound for "PARSHURAMA'S 3 STUDENTS" (src/scenes/parshu8.js, ad 80, no voice) →
// assets/parshu8_sfx.wav. Times are the scene's constants (keep them in sync). A bell and low brass for the cold open
// and a heartbeat under Karna; wind and drums on Kurukshetra; the 23 days as war drums that speed up, bowstrings, volleys
// and clashes with a tick for each day; a rising whine for the sleep weapon and a harp for Narada; a choir for the
// ancestors; a tanpura and birds on Mahendra, the astras whooshing into Drona's hands; the insect's skitter and sting,
// a heartbeat and silence; a boom for the curse and a falling shimmer as the Brahmastra leaves him; a lone flute as
// Karna goes; three lamps going out at Kurukshetra; dawn on Mahendra, a gallop and a brass swell for the rider to come.
// Mild, never loud: the music is added on Instagram.
import { tone, noise, bell, mixb, env, whoosh, plink, squeak, click, thud, shimmer, chime, drum, om, wind, damru, thunder,
  note, seed, rnd, clamp, SR, track, heart, roar, crunch, clang, rumble, slide, splash, gurgle, laughter, drone } from './sfx.mjs';

const B0 = 3.8, C0 = 6.2, D0 = 8.6;
const F0 = 11.0, FREV = 15.8, G0 = 19.4, H0 = 25.0, NARADA = 26.8, J0 = 30.0, KNEEL = 31.6;
const L0 = 35.6, M0 = 40.2, MREV = 43.8, GIFT = 44.4;
const O0 = 46.6, P0 = 51.6, BITE = 53.4, R0 = 57.2, RREV = 60.8, S0 = 63.8, DRAIN = 66.6, T0 = 69.2;
const U0 = 73.6, W0 = 79.2, X0 = 83.8, Y0 = 88.2, CARD = 92.8, END = 96.8;
const DAY0 = G0 + .7, DAY1 = H0 - .5;
const DUEL = [[G0, 'wide'], [G0 + 1.3, 'rama'], [G0 + 2.2, 'bhishma'], [G0 + 3.0, 'clash'], [G0 + 3.6, 'rama'], [G0 + 4.1, 'bhishma'], [G0 + 4.5, 'clash'], [G0 + 4.85, 'rama'], [G0 + 5.2, 'bhishma']];
const LAMP_ON = [U0 + .5, U0 + 1.0, U0 + 1.5], LAMP_OUT = [U0 + 3.0, U0 + 3.55, U0 + 4.1];

const TR = track(END);
seed(80);
// the soft stretches (Kailash, the memory, the forgiveness, the card) sit well under the hits: lift them on a phone
const LIFTS = [[L0 - .3, M0, 1.8], [O0 - .3, P0, 1.6], [W0 - .3, X0, 1.8], [CARD - .3, END, 2]];
const T = { at: (t0, b, g = 1, pan = 0) => { const l = LIFTS.find(([a, z]) => t0 >= a && t0 < z); TR.at(t0, b, g * (l ? l[2] : 1), pan); }, write: (...a) => TR.write(...a) };
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


const KARNA = 150;
const birds = (t0, dur, n = 5) => { for (let k = 0; k < n; k++) T.at(t0 + rnd() * dur, bird(2400 + rnd() * 900, .6), .03, rnd() * 1.4 - .7); };
const gallop = (dur, amp = 1) => { const o = new Float32Array(Math.round((dur + .3) * SR)); for (let b = 0; b * .42 < dur; b++) for (const d of [0, .07, .16, .22]) add(o, mixb(drum(70 + rnd() * 10, amp * .5, .12), noise(.05, { lp: 900, e: env.pluck(40), amp: amp * .4 })), b * .42 + d); return o; };

// ================= A · the hook =================
T.at(0, sub(B0 + .3, 41, 1), .2, 0);
T.at(0, mixb(bell(note(57), 3.4, { k: 1.4 }), click(.3)), .1, 0);
T.at(.15, taiko(1), .24, 0); T.at(.9, taiko(.6), .16, 0);
T.at(.3, brass(3.2, [38, 45, 50], 1, .2, .8), .09, 0);
T.at(B0 - .3, whoosh(.4, 300, 4000), .2, 0);

// ================= B · Bhishma · C · Drona · D · Karna =================
T.at(B0, mixb(drum(44, 1, 1.0), thud(.7)), .3, 0);
T.at(B0 + .1, creak(.8, .8), .1, -.2);              // the bow drawn
T.at(B0, brass(2.4, [36, 43, 48], 1, .1, .5), .1, 0);
T.at(C0 - .2, whoosh(.3, 4000, 300), .14, 0);
T.at(C0, mixb(drum(48, .8, .8), shimmer(2.2, [note(79), note(83), note(86), note(91)], .6, .1)), .14, 0);
T.at(C0 + .2, hum(2.0, 220, .6), .06, 0);
for (let k = 0; k < 5; k++) T.at(C0 + .2 + k * .14, chime(note(84 + k * 2), .4, 1), .05, -.4 + k * .2);
T.at(D0 - .2, whoosh(.3, 4000, 300), .14, 0);
T.at(D0, mixb(drum(40, .9, 1.2), drone(2.4, 49, .7)), .18, 0);
T.at(D0 + .1, heart(.8), .16, 0); T.at(D0 + .9, heart(.7), .14, 0); T.at(D0 + 1.7, heart(.6), .12, 0);
T.at(D0 + .2, strings(F0 - D0, [50, 53, 57], 1, .3, .5), .06, 0);
T.at(F0 - .45, whoosh(.5, 3000, 200), .16, 0);

// ================= F · the order / "I cannot." =================
T.at(F0, wind(FREV - F0 + .5, 0, .8), .1, 0);
T.at(F0 + .1, taiko(.8), .16, 0);
T.at(F0 + 1.4, talk(FREV - F0 - 1.8, SAGE, { gap: .19, br: .5, amp: .8 }), .12, -.1);
T.at(F0 + 1.4, strings(FREV - F0 - 1.4, [45, 52, 57], 1, .5, .4), .06, 0);
T.at(FREV, mixb(drum(52, .9, .7), bell(note(52), 2.4, { k: 1.3 })), .2, 0);
T.at(FREV + .2, talk(1.3, ELDER, { gap: .22, br: .35, amp: .8 }), .12, .1);   // "I cannot. Not even for my guru."
T.at(FREV + .2, brass(G0 - FREV - .2, [38, 45, 49], 1, .3, .6), .07, 0);

// ================= G · 23 days =================
T.at(G0, mixb(conch(1.6, .8), whoosh(.6, 300, 3000)), .16, 0);
for (let t = G0 + .2, k = 0; t < H0 - .1; k++) { T.at(t, taiko(.7 + .2 * (k % 2)), .16, k % 2 ? .2 : -.2); t += Math.max(.16, .5 - k * .02); }   // war drums, faster and faster
T.at(G0, sub(H0 - G0, 44, 1), .12, 0);
DUEL.forEach(([s0, kind], i) => {
  const s1 = (DUEL[i + 1] || [H0])[0];
  T.at(s0, whoosh(.25, 3000, 300), .1, 0);
  if (kind === 'clash') { T.at(s0 + .3, whoosh(.3, 400, 4000), .14, 0); T.at(s0 + .45, mixb(clang(note(76), .7), crunch(.8), thud(.6)), .3, 0); }
  else for (let l = 0; s0 + l < s1; l += 1 / 1.4) { T.at(s0 + l + .5, twang(110 + rnd() * 30, .8), .14, kind === 'rama' ? -.3 : .3); T.at(s0 + l + .55, whoosh(.3, 1500, 5000), .1, kind === 'rama' ? .4 : -.4); }
});
for (let d = 2; d <= 23; d++) T.at(DAY0 + (d - 1) * (DAY1 - DAY0) / 22, plink(900 + d * 40, .5), .05, 0);   // a tick for each day

// ================= H · the sleep weapon; Narada =================
T.at(H0, mixb(drone(NARADA - H0 + .3, 46, 1), hiss(.6, .3)), .14, 0);
T.at(H0 + .2, creak(1.0, .9), .1, .2);
T.at(H0 + .6, whine(NARADA - H0 - .7, .5), .07, 0);
T.at(H0 + .6, pad(NARADA - H0 - .4, [47, 54, 59, 62], 1, .6, .2), .08, 0);
// NARADA - .15 .. NARADA: a hush
T.at(NARADA, mixb(harp([67, 71, 74, 79, 83, 86], .06, 1), shimmer(1.4, [note(88), note(91), note(95)], .6, .08)), .16, -.2);
T.at(NARADA + .1, mixb(chime(note(86), .7, 1.4), bell(note(74), 2, { k: 1.6 })), .1, 0);
T.at(NARADA + .5, talk(1.6, 200, { gap: .15, br: .6, amp: .7 }), .12, -.2);
T.at(NARADA + 1.2, slide(1.0, 900, 300, .4), .05, .2);   // the arrow's light dies

// ================= J · dawn: the ancestors; "No warrior on earth…" =================
T.at(J0, pad(KNEEL - J0 + .4, [57, 64, 69, 72, 76], 1, .5, .5), .1, 0);   // the ancestors' choir
T.at(J0, shimmer(1.6, [note(81), note(84), note(88)], .5, .08), .07, 0);
T.at(J0 + 1.4, mixb(thud(.6), tink(.6)), .1, .2);   // the bow laid down
T.at(KNEEL, mixb(bell(note(57), 3, { k: 1.4 }), brass(L0 - KNEEL, [45, 52, 57, 61], 1, .6, 1)), .12, 0);
T.at(KNEEL + .2, talk(2.6, SAGE, { gap: .2, br: .45, amp: .8 }), .12, .1);
T.at(KNEEL + 1.1, mixb(chime(note(81), .6, 1.6), shimmer(1, [note(88), note(93)], .5, .08)), .08, 0);

// ================= L · Mahendra; Drona =================
T.at(L0, wind(M0 - L0, 1, .6), .07, 0);
T.at(L0, tanpura(M0 - L0 + MREV - M0, 50, 1), .04, 0);
birds(L0 + .3, 3.6, 5);
for (let k = 0; k < 8; k++) T.at(L0 + .3 + k * .3, step(.35), .06, .4 - k * .04);
T.at(L0 + 3.0, chime(note(79), .5, 1.2), .05, .3);   // his bow

// ================= M · "Choose." / "All your weapons." =================
T.at(M0, mixb(drum(50, .6, .6)), .1, 0);
T.at(M0 + .3, talk(MREV - M0 - .7, SAGE, { gap: .2, br: .45, amp: .8 }), .12, 0);
T.at(MREV, mixb(drum(52, .8, .5), click(.5)), .16, 0);
T.at(MREV + .2, talk(.9, 130, { gap: .2, br: .5, amp: .8 }), .12, 0);
T.at(GIFT, mixb(shimmer(2.2, [note(79), note(83), note(86), note(91)], .7, .1), brass(2.2, [45, 52, 57], 1, .3, .8)), .14, 0);
for (let k = 0; k < 5; k++) { T.at(GIFT + k * .14 + .1, whoosh(.35, 500, 5000), .14, -.6 + k * .1); T.at(GIFT + k * .14 + .5, chime(note(86 + k), .4, 1.2), .07, 0); }

// ================= O · Karna: "I am a brahmin"; the Brahmastra =================
T.at(O0, tanpura(P0 - O0, 50, 1), .04, 0);
birds(O0 + .3, 3, 4);
for (let k = 0; k < 6; k++) T.at(O0 + .1 + k * .3, step(.35), .06, .4 - k * .06);
T.at(O0 + .9, talk(1.0, KARNA, { gap: .17, br: .45, amp: .7 }), .1, .2);
T.at(O0 + 1.0, mixb(drum(40, .5, .6)), .08, 0);   // the lie lands low
T.at(O0 + 2.8, mixb(whoosh(.8, 400, 3000), shimmer(1.6, [note(81), note(86), note(88), note(93)], .6, .08)), .12, 0);
T.at(O0 + 3.7, mixb(bell(note(69), 2.4, { k: 1.4 }), chime(note(93), .6, 1.6)), .1, .2);

// ================= P · the lap; the insect; he doesn't move =================
T.at(P0, pad(BITE - P0, [57, 62, 66, 69], 1, .5, .3), .06, 0);
birds(P0 + .2, 1.4, 2);
for (let t = P0 + .4; t < BITE - .1; t += .07 + rnd() * .05) T.at(t, tone(.03, 3000 + rnd() * 1500, { e: env.pluck(60), amp: .3 }), .03, .4);   // the skitter
// BITE - .2 .. BITE + .2: a hush, then the sting
T.at(BITE + .2, mixb(squeak(1800, 900, .12, .8), click(.8), noise(.15, { hp: 2000, lp: 8000, e: env.pluck(20), amp: .6 })), .26, 0);
T.at(BITE + .2, ring(2.4, 3400, .4), .05, 0);
for (let k = 0; k < 5; k++) T.at(BITE + .6 + k * .7, heart(.9), .2, 0);
T.at(BITE + 1.0, sub(R0 - BITE - 1.0, 38, 1), .1, 0);
for (let k = 0; k < 3; k++) T.at(BITE + 1.4 + k * 1.4, tone(.06, 1200, { e: env.pluck(30), amp: .4 }), .05, .3);   // the drops

// ================= R · "Who are you?" / "Karna, son of Radha." =================
T.at(R0, mixb(drum(48, 1, .9), whoosh(.4, 300, 2500)), .24, 0);
T.at(R0 + .1, voice([[0, .3, 1.2, .7]], SAGE, { rise: .3, amp: .6 }), .1, 0);   // he wakes with a start
T.at(R0 + .4, talk(RREV - R0 - .8, SAGE, { gap: .17, br: .6, amp: .9, shake: .3 }), .14, 0);
T.at(R0 + 1.0, mixb(brass(RREV - R0 - 1.0, [38, 41, 45], 1, .4, .3), ring(1.6, 2600, .3)), .1, 0);
T.at(RREV, strings(S0 - RREV + .2, [53, 57, 60, 65], 1, .4, .6), .08, 0);
T.at(RREV + .2, talk(1.4, KARNA, { gap: .22, br: .35, amp: .7, shake: .4 }), .12, 0);
T.at(RREV + .3, chime(note(76), .5, 1.6), .05, 0);

// ================= S · the curse; the light leaves him =================
T.at(S0, mixb(boom(1), thunder(2.4, .5)), .34, 0);
T.at(S0 + .3, talk(DRAIN - S0 - .6, SAGE, { gap: .18, br: .7, amp: .9, shake: .4 }), .14, 0);
T.at(S0 + .6, mixb(whoosh(1.4, 200, 1200), drone(2.2, 44, .9)), .2, 0);
T.at(S0, strings(DRAIN - S0, [38, 41, 45, 50], 1, .2, .4), .1, 0);
T.at(DRAIN, mixb(slide(1.6, 1800, 300, .5), shimmer(1.8, [note(93), note(88), note(84), note(79)], .5, .1)), .12, 0);
T.at(DRAIN, strings(T0 - DRAIN + .3, [50, 53, 57, 62], 1, .5, .6), .08, 0);
T.at(DRAIN + .3, heart(.6), .1, 0); T.at(DRAIN + 1.3, heart(.5), .08, 0);

// ================= T · "Go. But no warrior on earth will be your equal." =================
T.at(T0, wind(U0 - T0, 2, .8), .1, 0);
T.at(T0 + .3, talk(2.2, SAGE, { gap: .22, br: .35, amp: .7 }), .1, -.2);
T.at(T0 + 1.0, flute(3.2, [69, 67, 64, 62, 64, 60], .9), .08, .2);
for (let k = 0; k < 7; k++) T.at(T0 + 1.1 + k * .42, step(.25), .04, .3 + k * .05);

// ================= U · Kurukshetra: all three fell there =================
T.at(U0, mixb(conch(2.2, .7), drum(40, .8, 1.4)), .14, 0);
T.at(U0, sub(W0 - U0, 41, 1), .12, 0);
for (let k = 0; k < 4; k++) T.at(U0 + .3 + k * .62, taiko(.5), .1, 0);
LAMP_ON.forEach((t, i) => T.at(t, mixb(chime(note(76 + i * 3), .5, 1.4), noise(.2, { hp: 1200, lp: 5000, e: env.pluck(14), amp: .3 })), .08, -.4 + i * .4));
LAMP_OUT.forEach((t, i) => { T.at(t, mixb(drum(44 - i * 2, .9, 1.2), whoosh(.5, 1200, 200)), .2, -.4 + i * .4); T.at(t + .3, thud(.6), .12, -.4 + i * .4); });
T.at(LAMP_OUT[2] + .5, rumble(2.2, .8), .14, 0);
T.at(LAMP_OUT[0], strings(W0 - LAMP_OUT[0], [45, 48, 52, 57], 1, .5, .8), .08, 0);

// ================= W · still alive · X · the next student =================
T.at(W0 - .2, whoosh(.5, 300, 3000), .12, 0);
T.at(W0, tanpura(X0 - W0 + 4.5, 50, 1), .045, 0);
T.at(W0, om(X0 - W0, 110, .9), .08, 0);
birds(W0 + .3, 4, 5);
T.at(W0 + .9, bell(note(69), 2.6, { k: 1.4 }), .08, 0);
T.at(X0 + .3, gallop(4.0, 1), .12, 0);
T.at(X0 + .3, mixb(brass(Y0 - X0 - .3, [50, 57, 62, 66], 1, 2.4, .4), pad(Y0 - X0, [62, 66, 69, 74], 1, 1.5, .5)), .1, 0);
T.at(X0 + .5, shimmer(3, [note(86), note(90), note(93), note(98)], .6, .1), .06, 0);
T.at(X0 + 2.2, mixb(chime(note(86), .7, 1.6), bell(note(74), 2.4, { k: 1.4 })), .1, 0);   // his eyes open

// ================= Y · the ask =================
T.at(Y0 - .25, whoosh(.5, 400, 3000), .14, 0);
T.at(Y0, mixb(taiko(.9), bell(note(57), 2.4, { k: 1.4 })), .16, 0);
T.at(Y0, tanpura(CARD - Y0, 45, 1), .04, 0);
[0, .25, .5].forEach((d, i) => T.at(Y0 + .2 + d, pop(700 + i * 160, .8), .12, -.4 + i * .4));
T.at(Y0 + 1.2, mixb(drum(48, .7, .6), shimmer(.8, [note(91), note(96)], .5, .08)), .1, 0);

// ================= the card =================
T.at(CARD - .3, whoosh(.6, 400, 3000), .2, 0);
[0, .15, .3].forEach((d, i) => T.at(CARD + .3 + d, pop(800 + i * 140, .9), .14, -.3 + i * .3));
T.at(CARD + 1.0, chime(note(84), .7, 1.4), .1, 0); T.at(CARD + 1.3, chime(note(91), .7, 1.4), .1, 0);
T.at(CARD + 1.6, pop(1000, 1), .16, 0); T.at(CARD + 2.0, chime(note(96), .6, 2), .08, 0);
T.at(CARD + .2, pad(3.8, [64, 67, 71, 76], 1, .5, 1.2), .05, 0);

T.write('assets/parshu8_sfx.wav');
