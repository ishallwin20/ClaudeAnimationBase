// parshu6_sfx.mjs: the sound for "PARSHURAMA challenged LORD RAM" (src/scenes/parshu6.js, ad 75, no voice) →
// assets/parshu6_sfx.wav. Times are the scene's constants (keep them in sync). A royal brass and a blue shimmer for the
// cold open; a tanpura, birds and wedding bells on the road; harsh caws, a gale and thunder for the omens and the storm;
// a war drum and a low sub under the challenge; a sitar-like pluck and harp for the flashback; a bowstring creak, a
// twang and a rising whine for the bow; silence, then the astra and three blasts; a choir pad for the gods; the storm
// draining to birdsong as he leaves; a night drone under the ask; retro pops on the card. Mild, never loud: the music is
// added on Instagram.
import { tone, noise, bell, mixb, env, whoosh, plink, squeak, click, thud, shimmer, chime, drum, om, wind, damru, thunder,
  note, seed, rnd, clamp, SR, track, heart, roar, crunch } from './sfx.mjs';

const B0 = 3.8, C0 = 7.4;
const D0 = 10.2, E0 = 15.0, F0 = 19.6, REVEAL = 21.8;
const G0 = 24.8, H0 = 29.4, REV = 32.2, I0 = 34.4;
const J0 = 39.0, SNAP = 41.0, DESC = 42.6;
const L0 = 45.0, GRAB = 45.5, STRUNG = 46.6, NOCK = 47.4;
const M0 = 49.8, N0 = 54.8, O0 = 59.8, DRAIN = 60.2;
const P0 = 65.4, Q0 = 70.4, LOOSE = 70.9, HIT = 71.7;
const R0 = 74.8, GONE = 78.0, S0 = 79.4, CARD = 84.4, END = 88.4;

const T0 = track(END);
seed(75);
// the soft stretches (the ashram, the ancestors, the gift, the princes) sit well under the hits: lift them on a phone
const LIFT = [[D0 - .3, E0 - .3, 2.2], [J0 - .3, L0 - .3, 1.6], [R0 - .3, S0 - .3, 1.6], [CARD - .3, END, 2]];
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

const twang = (f = 110, amp = 1) => mixb(tone(.9, t => f * (1 + .02 * Math.exp(-t * 20)), { type: 'saw', e: env.pluck(5), amp: amp * .5 }), tone(.9, f * 2, { e: env.pluck(7), amp: amp * .3 }), click(amp * .5));
const creak = (dur, amp = 1) => lp(tone(dur, t => 70 + 40 * t / dur + 8 * Math.sin(t * 90), { type: 'saw', e: env.swell(dur * .8, .05), amp }), 900);
const caw = (amp = 1) => voice([[0, .22, 1, .9], [.3, .25, .92, .85]], 620, { fall: .35, amp });
const pluck = (m, amp = 1) => mixb(tone(1.2, note(m), { type: 'tri', e: env.pluck(4), amp: amp * .6 }), tone(1.2, note(m + 12), { e: env.pluck(6), amp: amp * .25 }));
const whine = (dur, amp = 1) => tone(dur, t => 600 + 1800 * Math.pow(t / dur, 2), { e: env.swell(dur * .9, .03), amp });

// ================= A · the hook: Parshurama with Vishnu's bow =================
T.at(0, sub(C0 + .2, 41, 1), .2, 0);
T.at(0, brass(3.4, [38, 45, 50], 1, .1, .8), .11, 0);
T.at(.2, taiko(1), .25, 0); T.at(1.0, taiko(.7), .18, 0);
T.at(1.0, mixb(bell(note(57), 2.4, { k: 1.4 }), click(.3)), .08, 0);
T.at(B0 - .3, whoosh(.4, 300, 4000), .2, 0);

// ================= B · Ram, the bow drawn, the arrow lit =================
T.at(B0, mixb(drum(44, 1, 1.0), thud(.7)), .3, 0);
T.at(B0, shimmer(3.4, [note(79), note(83), note(86), note(91)], .6, .1), .07, .2);   // the blue light
T.at(B0, pad(C0 - B0 + .3, [55, 62, 67, 71], 1, .4, .6), .06, 0);
T.at(B0 + .3, creak(.8, .8), .1, .3);
T.at(C0 - .3, whoosh(.35, 600, 5000), .22, 0);

// ================= C · one bow decided it =================
T.at(C0, boom(1.1), .55, 0);
T.at(C0, thunder(2.4, 1), .35, .1);
[C0 + .1, C0 + 1.0, C0 + 1.9].forEach(t0 => T.at(t0, heart(1.2), .5, 0));
T.at(C0 + 1.2, ring(1.6, 1480, .3), .04, 0);
T.at(D0 - .5, whoosh(.5, 3000, 300), .14, 0);

// ================= D · the wedding party on the road home =================
T.at(D0, tanpura(E0 - D0, 50, 1), .03, 0);
for (let k = 0; k < 6; k++) T.at(D0 + .5 + k * .75, tink(.8), .06, -.5 + k * .2);          // wedding bells on the chariot
for (let t = D0 + .4; t < E0 - .4; t += 1 + rnd() * .5) T.at(t, bird(2700 + rnd() * 800, .5), .035, rnd() * 1.4 - .7);
for (let k = 0; k < 18; k++) T.at(D0 + .2 + k * .26, step(.4), .04, .5);                 // hooves
T.at(D0 + .6, mixb(shimmer(1.4, [note(84), note(88), note(91)], .5, .06)), .05, 0);         // petals

// ================= E · the omens =================
T.at(E0, strings(F0 - E0 + .3, [45, 46, 51], 1, 1.4, .6), .07, 0);
T.at(E0, wind(F0 - E0, 1, .5), .05, 0);
for (let k = 0; k < 7; k++) T.at(E0 + .4 + k * .55 + rnd() * .2, caw(.8), .07, rnd() * 1.6 - .8);
for (let k = 0; k < 10; k++) T.at(E0 + .3 + k * .42, step(.3), .04, -.4 + k * .08);      // the deer go round
T.at(E0 + 1.6, mixb(boom(.4)), .1, 0);
T.at(E0 + 2.4, talk(1.4, SAGE, { gap: .2, br: .35, amp: .7 }), .07, .3);                   // Vasishtha: it will pass
[E0 + 2, E0 + 2.9, E0 + 3.7, E0 + 4.4].forEach(t0 => T.at(t0, heart(.9), .25, 0));

// ================= F · the storm; a figure; the lightning =================
T.at(F0, wind(G0 - F0, 2, 1), .2, 0);
T.at(F0, sub(G0 - F0, 36, .9), .16, 0);
T.at(F0 + .2, mixb(crunch(.8), thud(.8)), .12, -.5);                                       // a tree goes down
for (let k = 0; k < 6; k++) T.at(F0 + .2 + k * .36, mixb(step(.9), thud(.4)), .1, 0);     // the footsteps
T.at(REVEAL, mixb(boom(1.2), thunder(3, 1.2)), .6, 0);
T.at(REVEAL + .05, brass(2.6, [38, 45, 50, 57], 1, .05, 1), .14, 0);
T.at(REVEAL + 1.9, thunder(1.6, .6), .2, .4);

// ================= G · the sages whisper =================
T.at(G0, wind(H0 - G0, 1, .5), .07, 0);
T.at(G0 + .6, voice(Array.from({ length: 8 }, (_, i) => [i * .19, .14, 1 + .1 * Math.sin(i * 2), .2]), 140, { amp: .5 }), .05, -.3);   // whisper
T.at(G0 + 2.3, voice(Array.from({ length: 8 }, (_, i) => [i * .19, .14, 1 + .1 * Math.sin(i * 3), .2]), 150, { amp: .5 }), .05, .3);
[G0 + .5, G0 + 1.3, G0 + 2.0, G0 + 2.7, G0 + 3.3, G0 + 3.9].forEach(t0 => T.at(t0, heart(.9), .3, 0));
T.at(H0 - .3, whoosh(.4, 500, 3500), .14, 0);

// ================= H · the challenge / Ram's calm =================
T.at(H0, mixb(taiko(1)), .3, 0);
for (let k = 1; k < 6; k++) T.at(H0 + k * .5, taiko(.5 + k * .08), .12 + k * .02, 0);
T.at(H0 + .3, talk(REV - H0 - .6, 88, { gap: .2, br: .5, amp: 1, fall: .15 }), .14, .1);
T.at(H0 + 1.3, creak(.6, .7), .08, .2);                                                    // he holds the bow out
T.at(REV, mixb(boom(.6)), .2, 0);
T.at(REV, pad(I0 - REV + .3, [55, 62, 67], 1, .3, .8), .05, 0);
T.at(REV + .3, tone(1.8, note(79), { e: env.swell(.3, 1), amp: .5 }), .04, 0);              // Ram is calm

// ================= I · Dasharatha begs =================
T.at(I0, strings(J0 - I0 + .3, [50, 53, 57], 1, .8, .8), .07, 0);
T.at(I0 + .8, talk(1.8, ELDER, { gap: .17, br: .5, amp: .9, shake: .6 }), .12, -.3);
T.at(I0 + 3, heart(1), .3, 0); T.at(I0 + 3.8, heart(1), .3, 0);
T.at(J0 - .4, mixb(whoosh(.5, 300, 2500), shimmer(.6, [note(84), note(91)], .5, .05)), .12, 0);

// ================= J · the two bows (a flashback) =================
T.at(J0, pad(L0 - J0 + .3, [50, 57, 62, 66], 1, .8, 1), .07, 0);
[62, 66, 69, 74, 69, 66].forEach((m, k) => T.at(J0 + .3 + k * .32, pluck(m, .8), .07, -.4 + k * .15));
T.at(SNAP - .4, creak(.4, 1), .14, -.3);
T.at(SNAP, mixb(crunch(1.2), boom(.7), click(1)), .5, -.3);                                 // Shiva's bow breaks
T.at(SNAP + .1, ring(1.4, 2200, .3), .05, -.3);
T.at(DESC, mixb(shimmer(2.2, [note(79), note(83), note(86), note(91)], .6, .1), chime(note(86), .8, 2)), .1, .3);   // Vishnu's comes down
[DESC + .3, DESC + .8, DESC + 1.3].forEach((t0, i) => T.at(t0, mixb(bell(note(50 + i * 5), 1.4, { k: 2 })), .06, -.4 + i * .4));

// ================= L · Ram takes the bow, strings it, nocks an arrow =================
T.at(L0, wind(M0 - L0, 1, .6), .07, 0);
T.at(L0 + .1, whoosh(.4, 500, 3000), .2, .4);
T.at(GRAB, mixb(thud(.9), click(.6)), .3, 0);
T.at(GRAB + .2, creak(STRUNG - GRAB - .2, 1), .18, 0);
T.at(STRUNG, mixb(twang(98, 1.2), boom(.6)), .45, 0);
T.at(NOCK, mixb(click(.6), squeak(300, 420, .6, .5)), .12, .1);
T.at(NOCK + .3, whine(M0 - NOCK - .3, .8), .05, 0);                                         // the arrow lights
T.at(NOCK + .3, shimmer(2, [note(84), note(88), note(91)], .6, .08), .06, 0);

// ================= M · "you are a brahmin": the arrow held =================
T.at(M0, sub(N0 - M0, 43, .8), .1, 0);
T.at(M0, tone(N0 - M0, t => 1600 + 30 * Math.sin(t * 7), { e: env.swell(.3, .3), amp: .3 }), .03, 0);   // the arrow's hum
T.at(M0 + .3, talk(3.8, 112, { gap: .2, br: .45, amp: .9 }), .12, -.2);
[M0 + .5, M0 + 1.5, M0 + 2.5, M0 + 3.4, M0 + 4.2].forEach(t0 => T.at(t0, heart(.9), .25, 0));

// ================= N · "choose" =================
T.at(N0, mixb(boom(.7)), .25, 0);
T.at(N0, strings(O0 - N0 + .3, [43, 50, 55, 58], 1, .6, .8), .09, 0);
T.at(N0 + .3, talk(4, 108, { gap: .2, br: .55, amp: 1 }), .14, -.1);
T.at(N0 + .5, whine(O0 - N0 - .6, .8), .06, 0);
T.at(O0 - .4, mixb(whoosh(.5, 400, 3000)), .14, 0);

// ================= O · the gods gather; his power drains =================
T.at(O0, pad(P0 - O0 + .3, [62, 66, 69, 74, 78], 1, 1, 1), .08, 0);                         // a choir of light
T.at(O0, om(3, 110, .8), .07, 0);
T.at(DRAIN, tone(2.2, t => 220 * Math.pow(.4, t / 2.2), { type: 'saw', e: env.swell(.1, .5), amp: .4 }), .1, 0);   // the power runs out
T.at(DRAIN, noise(2.2, { lp: t => 3000 - 1200 * t, hp: 200, e: env.swell(.1, .6), amp: .6 }), .06, 0);
T.at(DRAIN + 2.2, ring(1.6, 1760, .3), .04, 0);

// ================= P · he yields =================
T.at(P0, pad(Q0 - P0 + .3, [55, 59, 62, 67], 1, .6, .8), .07, 0);
T.at(P0 + .3, talk(3.9, 88, { gap: .21, br: .35, amp: .8, fall: .2 }), .12, .1);
T.at(P0 + .2, tanpura(Q0 - P0 - .4, 43, .8), .03, 0);

// ================= Q · the arrow; the heavens break =================
T.at(Q0, whine(LOOSE - Q0, 1), .1, 0);
T.at(LOOSE - .4, creak(.35, 1), .14, 0);
// LOOSE - .05 .. LOOSE: silence, then the release
T.at(LOOSE, mixb(twang(110, 1.2), whoosh(.6, 6000, 800)), .5, 0);
T.at(LOOSE + .3, whoosh(1.2, 800, 6000), .3, .3);
[HIT + .2, HIT + .6, HIT + 1.0].forEach((t0, i) => { T.at(t0, mixb(boom(1 - i * .1), crunch(.9), chime(note(84 - i * 3), .8, 1.4)), .5, -.4 + i * .4); T.at(t0 + .05, shimmer(1.4, [note(91), note(96)], .5, .06), .08, 0); });
T.at(HIT + 1.4, ring(2, 2200, .3), .04, 0);

// ================= R · he goes round Ram, and is gone; the sky clears =================
T.at(R0, pad(S0 - R0 + .3, [60, 64, 67, 72], 1, .8, 1.2), .06, 0);
for (let k = 0; k < 10; k++) T.at(R0 + .4 + k * .3, step(.4), .06, Math.sin(k * .6) * .8);
T.at(R0 + .3, bell(note(69), 2.4, { k: 1.4 }), .06, 0);
T.at(GONE, mixb(whoosh(.5, 800, 8000), shimmer(1.2, [note(88), note(93), note(96)], .6, .1)), .3, .5);
T.at(GONE + .3, conch(1.8, .9), .1, 0);
for (let t = GONE + .4; t < S0 - .2; t += .6 + rnd() * .4) T.at(t, bird(2900 + rnd() * 600, .5), .04, rnd() - .5);

// ================= S · the ask: Mahendra at night =================
T.at(S0 - .25, whoosh(.5, 400, 3000), .14, 0);
T.at(S0, mixb(bell(note(45), 3, { k: 1.3 })), .12, 0);
T.at(S0, tanpura(CARD - S0, 45, 1), .04, 0);
for (let t = S0 + .5; t < CARD - .4; t += .5 + rnd() * .3) T.at(t, tone(.08, 4200 + rnd() * 400, { e: env.pluck(30), amp: .3 }), .02, rnd() - .5);   // crickets
T.at(S0 + 1.1, mixb(squeak(400, 900, .25, .6), shimmer(.8, [note(91), note(96)], .5, .08)), .08, 0);

// ================= the card =================
T.at(CARD - .3, whoosh(.6, 400, 3000), .2, 0);
[0, .15, .3].forEach((d, i) => T.at(CARD + .3 + d, pop(800 + i * 140, .9), .14, -.3 + i * .3));
T.at(CARD + 1.0, chime(note(84), .7, 1.4), .1, 0); T.at(CARD + 1.3, chime(note(91), .7, 1.4), .1, 0);
T.at(CARD + 1.6, pop(1000, 1), .16, 0); T.at(CARD + 2.0, chime(note(96), .6, 2), .08, 0);
T.at(CARD + .2, pad(3.8, [64, 67, 71, 76], 1, .5, 1.2), .05, 0);

T.write('assets/parshu6_sfx.wav');
