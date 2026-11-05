// parshu7_sfx.mjs: the sound for "PARSHURAMA broke GANESHA'S TUSK" (src/scenes/parshu7.js, ad 76, no voice) →
// assets/parshu7_sfx.wav. Times are the scene's constants (keep them in sync). A temple bell and a low brass for the
// cold open; wind and a tanpura on Kailash; comic foley for the door fight (a boing, scuffles, a trunk whoosh); the
// worlds (a choir, cowbells and a flute, a deep drone below, a splash, a gulp); a slowed spinning hum for the axe, a
// harp for the memory, silence, then the CLANG; a thud and a rumble as the tusk lands; a war drum under Parvati; a harp
// and a flute for Krishna; a warm pad for the forgiveness; retro pops on the card. Mild, never loud: the music is added
// on Instagram.
import { tone, noise, bell, mixb, env, whoosh, plink, squeak, click, thud, shimmer, chime, drum, om, wind, damru, thunder,
  note, seed, rnd, clamp, SR, track, heart, roar, crunch, clang, rumble, slide, splash, gurgle, laughter, drone } from './sfx.mjs';

const B0 = 3.8, C0 = 7.4;
const D0 = 10.2, E0 = 15.0, F0 = 19.6, REV = 22.4;
const G0 = 24.6, SPLIT = 26.8, H0 = 29.2, LIFT = 31.4;
const I0 = 34.0, DOWN = 36.4, SPLASH = 38.3, BACK = 39.8;
const J0 = 40.6, WIND = 43.6, THROW = 44.5;
const K0 = 45.2, KNOW = 46.8, L0 = 50.2, HIT = 54.2;
const M0 = 55.0, LAND = 56.1, N0 = 59.6, O0 = 64.6, ARRIVE = 66.4;
const Q0 = 69.2, NAME = 70.6, R0 = 74.2, BLESS = 75.4, S0 = 79.2, CARD = 84.2, END = 88.2;

const T0 = track(END);
seed(76);
// the soft stretches (Kailash, the memory, the forgiveness, the card) sit well under the hits: lift them on a phone
const LIFTS = [[D0 - .3, E0 - .3, 2.2], [KNOW, L0, 1.6], [R0 - .3, S0 - .3, 1.6], [CARD - .3, END, 2]];
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

// ================= A · the hook: Ganesha with his tusk =================
T.at(0, sub(C0 + .2, 41, 1), .2, 0);
T.at(0, mixb(bell(note(57), 3.4, { k: 1.4 }), click(.3)), .1, 0);
T.at(.15, taiko(1), .24, 0); T.at(.9, taiko(.6), .16, 0);
T.at(.3, brass(3.2, [38, 45, 50], 1, .2, .8), .09, 0);
T.at(1.7, mixb(chime(note(84), .6, 1.4), plink(1800, .4)), .07, .2);   // his look up
T.at(B0 - .3, whoosh(.4, 300, 4000), .2, 0);

// ================= B · the axe raised =================
T.at(B0, mixb(drum(44, 1, 1.0), thud(.7)), .3, 0);
T.at(B0 + .1, ring(3.2, 2600, .5), .05, -.2);   // the blade sings
T.at(B0, brass(3.4, [38, 42, 45], 1, .2, .6), .1, 0);
T.at(B0 + 1.4, taiko(.8), .2, 0);
T.at(C0 - .3, whoosh(.4, 4000, 300), .18, 0);

// ================= C · he lets it come =================
T.at(C0, shimmer(2.6, [note(79), note(83), note(86), note(91)], .6, .1), .07, .2);
T.at(C0, pad(D0 - C0, [55, 62, 67, 71], 1, .3, .6), .07, 0);
T.at(C0 + 1.1, chime(note(91), .6, 1.6), .08, 0);
T.at(D0 - .5, whoosh(.5, 300, 3000), .2, 0);

// ================= D · Kailash =================
T.at(D0, wind(E0 - D0 + .6, 0, 1), .14, 0);
T.at(D0, tanpura(E0 - D0, 50, 1), .04, 0);
for (let k = 0; k < 14; k++) T.at(D0 + .3 + k * .32, step(.35), .06, -.2 + k * .03);
T.at(D0 + 2.2, bell(note(69), 2.4, { k: 1.4 }), .07, 0);   // the palace on the summit

// ================= E · the door =================
T.at(E0, wind(F0 - E0, 1, .8), .06, 0);
for (let k = 0; k < 3; k++) T.at(E0 + .1 + k * .3, step(.4), .07, .4);
T.at(E0 + 1.1, chime(note(79), .5, 1.2), .05, .3);   // the bow
T.at(E0 + 2.0, boing(220, 1), .16, -.1);           // Ganesha hops in front of the door
T.at(E0 + 2.6, thud(.6), .14, 0);
T.at(E0 + 2.7, talk(1.6, 260, { gap: .14, br: .6, amp: .7 }), .1, -.1);

// ================= F · "I'll just bow and come back" / "No." =================
T.at(F0 + .3, talk(2.3, SAGE, { gap: .2, br: .4, amp: .8 }), .12, .1);
T.at(REV, mixb(drum(60, .8, .4), click(.6)), .22, 0);
T.at(REV + .2, voice([[0, .32, 1, .7]], 240, { fall: .25, amp: .9 }), .14, 0);   // "No."
for (let k = 0; k < 4; k++) T.at(REV + .5 + k * .16, squeak(500, 380, .07, .5), .05, k % 2 ? .3 : -.3);   // head shakes
T.at(G0 - .2, whoosh(.3, 400, 3000), .14, 0);

// ================= G · the tug =================
for (let k = 0; k < 7; k++) T.at(G0 + .1 + k * .3, scuffle(.8), .14, Math.sin(k) * .4);
T.at(G0 + .4, voice([[0, .2, 1.2, .8], [.25, .2, 1.1, .8]], 260, { amp: .6 }), .08, -.2);   // Ganesha grunts
T.at(G0 + .9, voice([[0, .25, 1, .5]], SAGE, { amp: .6 }), .08, .3);
T.at(SPLIT - .4, whoosh(.4, 600, 3000), .14, -.3);
T.at(SPLIT, mixb(boing(160, 1), thud(.8)), .22, 0);
T.at(SPLIT + .2, mixb(scuffle(1), scuffle(.8)), .2, 0);

// ================= H · the axe; the trunk; the lift =================
T.at(H0 + .2, mixb(whoosh(.4, 300, 2500), ring(1.8, 2600, .5)), .16, .3);
T.at(H0 + .3, brass(1.2, [38, 45], 1, .05, .5), .1, 0);
T.at(LIFT, mixb(whoosh(.35, 500, 5000), slide(.3, 300, 900, .6)), .22, -.2);   // the trunk shoots out
T.at(LIFT + .35, mixb(thud(.6), squeak(700, 500, .1, .6)), .16, .2);          // wraps him
T.at(LIFT + .45, slide(.8, 200, 700, .7), .12, 0);                           // up he goes
T.at(LIFT + .6, voice([[0, .5, 1.3, .9]], SAGE, { rise: .4, amp: .8 }), .12, .2);   // his yelp
for (let k = 0; k < 6; k++) T.at(LIFT + .8 + k * .25, scuffle(.4), .06, .3);   // legs kicking

// ================= I · the worlds =================
T.at(I0, whoosh(1.2, 300, 6000), .24, 0);
T.at(I0, mixb(pad(DOWN - I0, [64, 67, 71, 76], 1, .3, .4), shimmer(2.2, [note(84), note(88), note(91), note(96)], .6, .08)), .08, 0);   // the heavens
T.at(I0 + 1.0, mixb(chime(note(88), .7, 1.2), conch(.8, .7)), .1, 0);   // Vaikuntha
T.at(I0 + 1.7, flute(.7, [79, 81, 83, 86], .9), .08, 0);              // Goloka
for (let k = 0; k < 4; k++) T.at(I0 + 1.75 + k * .17, cowbell(.6), .05, Math.sin(k * 2) * .5);
T.at(I0 + 1.9, moo(.5, 140, .8), .05, .3);
T.at(DOWN, mixb(whoosh(1.2, 6000, 300), drone(1.8, 55, .9)), .22, 0);   // down into the underworlds
T.at(DOWN + .2, hiss(.8, .6), .05, -.4);
T.at(DOWN + 1.2, whoosh(.9, 3000, 400), .18, 0);
T.at(SPLASH, mixb(splash(1.2), thud(.8)), .4, 0);
T.at(SPLASH + .4, gurgle(1.0, .8), .12, 0);
T.at(SPLASH + .7, laughter(.9, .6), .06, -.2);                    // Ganesha giggles
T.at(SPLASH + .9, mixb(squeak(900, 400, .15, .6), plink(1400, .4)), .1, .1);   // he spits
T.at(BACK, mixb(splash(.7), whoosh(.6, 400, 5000)), .26, 0);

// ================= J · back; dizzy; the throw =================
T.at(J0, mixb(thud(.8), drum(52, .7, .5)), .22, 0);
for (let k = 0; k < 6; k++) T.at(J0 + .1 + k * .2, plink(2000 + 300 * Math.sin(k * 2), .5), .06, Math.sin(k * 2) * .6);   // the stars
for (let t = J0 + .2; t < J0 + 2.4; t += .14 + rnd() * .1) T.at(t, tone(.05, 2500 + rnd() * 800, { e: env.pluck(40), amp: .25 }), .03, rnd() - .5);   // drips
T.at(J0 + 1.3, mixb(noise(.5, { lp: 2500, hp: 300, e: env.swell(.02, .3), amp: .6 })), .08, 0);   // he shakes it off
T.at(J0 + 1.8, mixb(sub(WIND - J0 - 1.8 + .9, 46, 1), brass(2.0, [38, 41, 45], 1, .8, .3)), .14, 0);
T.at(WIND, mixb(creak(.8, 1), ring(1, 2600, .4)), .12, 0);
T.at(THROW, mixb(whoosh(.5, 600, 6000), thud(.5)), .3, -.2);
T.at(THROW + .1, hum(K0 - THROW + .2, 180, .8), .1, -.3);

// ================= K · slow motion; he knows it =================
T.at(K0, mixb(whoosh(2.2, 200, 900), hum(1.6, 90, 1)), .2, 0);   // the axe, slowed down
T.at(K0, sub(L0 - K0, 38, 1), .16, 0);
T.at(K0 + .1, heart(.8), .16, 0); T.at(K0 + 1.0, heart(.7), .14, 0);
T.at(KNOW, mixb(chime(note(86), .7, 1.6), shimmer(1.4, [note(79), note(86), note(91)], .5, .1)), .1, 0);
T.at(KNOW + .4, harp([62, 66, 69, 74, 78], .1, .8), .1, 0);   // the memory
T.at(KNOW + .4, pad(L0 - KNOW - .4, [62, 66, 69, 74], 1, .5, .6), .06, 0);

// ================= L · the choice; silence; the CLANG =================
T.at(L0, pad(HIT - L0 - .5, [57, 64, 69, 72], 1, .6, .4), .08, 0);
T.at(L0 + .2, tanpura(HIT - L0 - .8, 45, .8), .04, 0);
T.at(L0 + 1.4, chime(note(81), .5, 1.6), .06, 0);   // he closes his eyes
T.at(L0 + 2.6, riser(HIT - L0 - 2.6 - .45, 200, 1600, .8), .12, 0);
// HIT - .45 .. HIT: silence
T.at(HIT, mixb(clang(note(76), 1.2), clang(note(83), .8), crunch(1), boom(1)), .55, 0);
T.at(HIT + .05, ring(2.6, 3200, .5), .07, 0);

// ================= M · the tusk falls; the earth shakes =================
T.at(M0, whoosh(.9, 2000, 400), .12, .1);
T.at(LAND, mixb(boom(1.2), thud(1), rumble(2.6, 1)), .45, 0);
T.at(LAND + .2, thunder(2.8, .6), .18, 0);
T.at(LAND + .4, mixb(voice([[0, .5, 1.4, .8]], 300, { amp: .4 }), voice([[.1, .5, 1.2, .8]], 220, { amp: .4 })), .08, 0);   // the devas cry out

// ================= N · Parvati =================
T.at(N0, mixb(creak(.7, .8), noise(.6, { lp: 900, e: env.swell(.1, .4), amp: .5 })), .12, 0);   // the doors swing open
T.at(N0 + .2, mixb(taiko(1), drum(50, .8, .9)), .24, 0);
for (let k = 0; k < 6; k++) T.at(N0 + 1.1 + k * .55, taiko(.6 + .1 * (k % 2)), .14, 0);
T.at(N0 + .4, talk(4.0, 230, { gap: .15, br: .7, amp: .8, shake: .3 }), .13, -.1);
T.at(N0 + .2, strings(O0 - N0, [50, 53, 57], 1, .4, .5), .07, 0);

// ================= O · Shiva silent; Krishna arrives =================
T.at(O0, mixb(om(ARRIVE - O0 + .5, 110, .9)), .1, 0);
T.at(O0 + .2, damru(240, .5), .06, 0); T.at(O0 + .35, damru(260, .5), .06, 0);
T.at(ARRIVE - .3, whoosh(.4, 400, 6000), .16, .2);
T.at(ARRIVE, mixb(harp([67, 71, 74, 79, 83, 86], .07, 1), shimmer(1.6, [note(88), note(91), note(95)], .6, .08)), .14, .2);
T.at(ARRIVE + .4, flute(2.4, [74, 76, 79, 81, 79, 76], .9), .09, .2);
T.at(ARRIVE, pad(Q0 - ARRIVE + .3, [62, 67, 71, 74], 1, .3, .6), .07, 0);

// ================= Q · EKADANTA =================
T.at(Q0 + .3, talk(1.3, 150, { gap: .17, br: .4, amp: .7 }), .1, .2);
T.at(NAME - .1, mixb(bell(note(69), 2.6, { k: 1.4 }), chime(note(81), .8, 2)), .16, 0);
T.at(NAME, mixb(shimmer(1.6, [note(81), note(86), note(88), note(93)], .7, .08), drum(48, .7, .8)), .16, 0);
T.at(NAME + .5, talk(1.0, 150, { gap: .17, br: .4, amp: .6 }), .08, .2);
T.at(NAME, pad(R0 - NAME + .2, [57, 64, 69, 73], 1, .3, .6), .07, 0);

// ================= R · forgiven =================
T.at(R0 + .5, mixb(chime(note(88), .6, 1.4), shimmer(1, [note(91), note(96)], .5, .08)), .1, -.1);   // Radha's touch
T.at(R0 + .7, laughter(.6, .4), .05, -.2);
T.at(BLESS, flute(3.6, [69, 71, 74, 76, 74, 71, 69, 74], .8), .08, 0);
T.at(BLESS, pad(S0 - BLESS, [57, 61, 64, 69], 1, .6, 1), .07, 0);
T.at(BLESS + 1.2, mixb(bell(note(69), 2.4, { k: 1.4 }), chime(note(81), .5, 1.8)), .08, 0);

// ================= S · the ask =================
T.at(S0 - .25, whoosh(.5, 400, 3000), .14, 0);
T.at(S0, mixb(taiko(.9), bell(note(57), 2.4, { k: 1.4 })), .16, 0);
T.at(S0, tanpura(CARD - S0, 45, 1), .04, 0);
T.at(S0 + .6, boing(240, .8), .08, 0);
T.at(S0 + 1.1, mixb(squeak(400, 900, .25, .6), shimmer(.8, [note(91), note(96)], .5, .08)), .08, 0);

// ================= the card =================
T.at(CARD - .3, whoosh(.6, 400, 3000), .2, 0);
[0, .15, .3].forEach((d, i) => T.at(CARD + .3 + d, pop(800 + i * 140, .9), .14, -.3 + i * .3));
T.at(CARD + 1.0, chime(note(84), .7, 1.4), .1, 0); T.at(CARD + 1.3, chime(note(91), .7, 1.4), .1, 0);
T.at(CARD + 1.6, pop(1000, 1), .16, 0); T.at(CARD + 2.0, chime(note(96), .6, 2), .08, 0);
T.at(CARD + .2, pad(3.8, [64, 67, 71, 76], 1, .5, 1.2), .05, 0);

T.write('assets/parshu7_sfx.wav');
