// parshu4_sfx.mjs: the sound for "PARSHURAMA vs the KING with 1000 ARMS" (src/scenes/parshu4.js, ad 72, no voice) →
// assets/parshu4_sfx.wav. Times are the scene's constants (keep them in sync). Part 2's retro cartoon foley for the
// king and Ravana (pops as the arms sprout, splashes, the flood, Ravana's grumbles and the queens' laughter), Part 3's
// dark hits for the cold open, the theft and the axe (a sub, a heartbeat, a taiko, silence before the blow), a mild
// tanpura under the ashram, a war drum under the armies, the arrows' hiss, a crown rolling to rest, a warm pad home.
import { tone, noise, bell, mixb, env, whoosh, plink, squeak, click, thud, shimmer, chime, drum, om, wind, damru, thunder,
  laughter, note, seed, rnd, clamp, SR, track, splash, heart, roar, rockfall, torrent, crunch } from './sfx.mjs';

const B0 = 3.6, C0 = 7.2;
const D0 = 9.8, SPROUT = 11.0;
const E0 = 15.2, F0 = 20.2, WAVE = 21.4;
const G0 = 25.0, CAUGHT = 26.6;
const H0 = 30.0, I0 = 35.0, J0 = 39.6;
const K0 = 44.6, SEE = 46.4, L0 = 48.6;
const M0 = 53.0, N0 = 58.4, LOOSE = 59.8, N1 = 60.6;
const O0 = 63.4, LEAP = 64.5, AXE = 65.0;
const P0 = 68.0, Q0 = 72.6, R0 = 78.4, CARD = 83.4, END = 87.4;

const T0 = track(END);
seed(72);
// the soft stretches (the ashram, home, the father) sit well under the hits: lift them so they carry on a phone
const LIFT = [[H0 - .3, J0, 2.6], [P0 - .3, R0 - .3, 3], [CARD - .3, END, 2]];
const T = { at: (t0, b, g = 1, pan = 0) => { const l = LIFT.find(([a, z]) => t0 >= a && t0 < z); T0.at(t0, b, g * (l ? l[2] : 1), pan); }, write: (...a) => T0.write(...a) };
// a buzzy voice: syllables [start, dur, pitch ×, brightness 0..1] (as in ads 63, 68, 70)
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
const SAGE = 92, RAMAV = 165, KINGV = 110, RAV = 82;
const add = (o, b, s0, g = 1) => { const s = Math.round(s0 * SR); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j] * g; return o; };
const lp = (b, fc) => { let l = 0; const a = 1 - Math.exp(-2 * Math.PI * fc / SR); for (let i = 0; i < b.length; i++) { l += a * (b[i] - l); b[i] = l; } return b; };
const tanpura = (dur, root = 50, amp = 1) => { const o = new Float32Array(Math.round((dur + 2.5) * SR)); const ns = [root + 7, root + 12, root + 12, root];
  for (let k = 0; k * .9 < dur; k++) add(o, lp(tone(2.4, note(ns[k % 4]), { type: 'saw', e: env.ad(.05, .9), amp }), 1400), k * .9, 1 - .5 * clamp((k * .9 - dur + 1.5) / 1.5)); return o; };
const pad = (dur, ms, amp = 1, a = 1.2, r = 1.4) => mixb(...ms.map((m, i) => tone(dur, t => note(m) * (1 + .003 * Math.sin(t * 2 + i)), { type: 'tri', e: env.swell(a, r), amp: amp / ms.length })));
const strings = (dur, ms, amp = 1, a = .8, r = 1) => mixb(...ms.map((m, i) => lp(tone(dur, t => note(m) * (1 + .004 * Math.sin(t * 31 + i * 2)), { type: 'saw', e: env.swell(a, r), amp: amp / ms.length }), 1600)));
const brass = (dur, ms, amp = 1, a = .08, r = .5) => mixb(...ms.map((m, i) => lp(tone(dur, t => note(m) * (1 + .004 * Math.sin(t * 30 + i)), { type: 'saw', e: env.swell(a, r), amp: amp / ms.length }), 2200)));
const harp = (f, amp = 1) => bell(f, 1.5, { partials: [[1, 1], [2, .35], [3, .12]], k: 2.8, amp });
const bird = (f, amp = 1) => mixb(squeak(f, f * 1.4, .07, amp), squeak(f * 1.3, f * 1.1, .06, amp * .7));
const sub = (dur, f = 41, amp = 1) => tone(dur, t => f + .6 * Math.sin(t * 1.3), { e: env.swell(.8, 1), amp });
const boom = (amp = 1) => mixb(drum(36, amp * .7, 1.8), noise(2.4, { brown: true, lp: 180, e: env.ad(.01, 1.6), amp }), thud(amp * .7));
const riser = (dur, f0 = 200, f1 = 1600, amp = 1) => mixb(tone(dur, t => f0 * Math.pow(f1 / f0, t / dur), { type: 'saw', e: env.swell(dur * .9, .02), amp: amp * .35 }), noise(dur, { hp: t => 300 + 3000 * t / dur, lp: 9000, e: env.swell(dur * .95, .02), amp: amp * .5 }));
const ring = (dur, f = 3100, amp = 1) => tone(dur, f, { e: env.swell(.05, dur * .8), amp });
const water = (dur, amp = 1) => noise(dur, { lp: t => 900 + 400 * Math.sin(t * 2.3), hp: 200, e: env.swell(.6, .8), amp });
const step = (amp = 1) => mixb(noise(.06, { lp: 900, hp: 80, e: env.pluck(40), amp }), tone(.08, t => 90 - 200 * t, { e: env.pluck(30), amp: amp * .5 }));
const pop = (f = 900, amp = 1) => mixb(squeak(f * .6, f * 1.6, .07, amp), plink(f * 1.5, amp * .5));
const thwack = (amp = 1) => mixb(noise(.08, { hp: 600, lp: 5000, e: env.pluck(50), amp }), tone(.12, t => 220 * Math.exp(-t * 18) + 90, { e: env.pluck(20), amp: amp * .8 }));
const boing = (f = 180, amp = 1) => tone(.45, t => f * (1 + .35 * Math.sin(t * 60) * Math.exp(-t * 6)), { type: 'tri', e: env.pluck(6), amp });
const moo = (dur = 1, f = 120, amp = 1) => lp(tone(dur, t => f * (1 + .25 * Math.sin(Math.PI * t / dur)) * (1 - .15 * t / dur), { type: 'saw', e: env.swell(.15, .35), amp }), 900);
const hiss = (dur, amp = 1) => noise(dur, { hp: 2500, lp: 9000, e: env.swell(.05, .2), amp });
const tink = (amp = 1) => mixb(bell(note(98), .4, { partials: [[1, 1], [2.7, .4]], k: 10, amp }), click(amp * .4));
const warDrum = (dur, bpm = 140, amp = 1) => { const o = new Float32Array(Math.round((dur + 1) * SR)), g = 60 / bpm; for (let k = 0; k * g < dur; k++) add(o, drum(k % 4 === 0 ? 46 : 58, amp * (k % 4 === 0 ? 1 : .6), .45), k * g); return o; };

// ================= A · the hook: the king, Ravana dangling =================
T.at(0, sub(C0 + .2, 41, 1), .2, 0);
T.at(0, brass(3.4, [38, 45, 50], 1, .1, .8), .1, 0);                                     // a royal low brass
T.at(.2, voice([[0, .3, 1, .4], [.4, .3, .9, .4], [.9, .4, 1.1, .5]], RAV, { fall: .2, amp: .9 }), .1, .4);   // Ravana grumbling
T.at(1.6, voice([[0, .25, 1.2, .5], [.3, .35, .9, .4]], RAV * 1.1, { amp: .8 }), .08, .5);
T.at(1.2, mixb(squeak(500, 300, .2, .6)), .05, .45);                                     // the rope creaks
T.at(2.6, voice([[0, .5, 1, .6]], KINGV, { rise: .1, amp: .8, shake: .5 }), .1, -.3);     // the king's laugh
T.at(B0 - .3, whoosh(.4, 300, 4000), .2, 0);

// ================= B · the theft =================
T.at(B0, mixb(drum(44, 1, 1.2), thud(.8)), .45, 0);
T.at(B0 + .2, moo(1.4, 130, 1), .16, -.2);                                               // the cow cries
T.at(B0 + 1.9, moo(1.0, 150, 1), .14, -.1);
for (let k = 0; k < 8; k++) T.at(B0 + .3 + k * .4, step(.6), .1, .3);
T.at(B0 + .2, strings(3.2, [50, 51], 1, .3, .6), .07, 0);
T.at(C0 - .3, whoosh(.35, 600, 5000), .22, 0);

// ================= C · big mistake =================
T.at(C0, boom(1.1), .6, 0);
T.at(C0, thunder(2.4, 1), .4, .1);
[C0 + .1, C0 + 1.0, C0 + 1.9].forEach(t0 => T.at(t0, heart(1.2), .5, 0));
T.at(C0 + .35, mixb(bell(note(88), 1.6, { partials: [[1, 1], [2.7, .5], [5.2, .25]], k: 3 }), click(.6)), .14, -.3);   // the eyes ignite
T.at(D0 - .5, whoosh(.5, 3000, 300), .14, 0);

// ================= D · Dattatreya's boon: the arms sprout =================
T.at(D0 + .1, pad(5, [62, 66, 69, 74], 1, 1, 1.2), .07, 0);
T.at(D0 + .2, shimmer(1.6, [note(86), note(90), note(93), note(98)], .6, .1), .07, 0);
T.at(D0 + .3, om(SPROUT - D0, 110, .7), .07, 0);
for (let k = 0; k < 18; k++) T.at(SPROUT + k * .14, pop(700 + k * 40, .8), .09, -.6 + (k % 5) * .3);   // pop, pop, pop… ring by ring
T.at(SPROUT + 2.6, mixb(chime(note(86), .8, 1.6), boing(220, .6)), .12, 0);
T.at(SPROUT + 2.8, voice([[0, .25, 1.2, .6], [.3, .5, 1.4, .7]], KINGV, { rise: .3, amp: .8 }), .1, 0);   // "whoa!"

// ================= E · the Narmada stopped =================
T.at(E0, water(F0 - E0, 1), .08, 0);
T.at(E0 - .2, whoosh(.5, 400, 3000), .14, 0);
for (let k = 0; k < 6; k++) T.at(E0 + .4 + k * .7 + rnd() * .3, splash(.6), .07, rnd() - .5);
T.at(E0 + .9, laughter(1.4, .8), .05, -.5); T.at(E0 + 3.0, laughter(1.2, .7), .045, .5);
T.at(E0 + .6, torrent(2.6, 1, 1), .1, 0);                                                 // the water heaps up
T.at(E0 + 1.2, mixb(slideUp()), .06, 0);
function slideUp() { return tone(1.4, t => 180 * Math.pow(2.5, t / 1.4), { type: 'tri', e: env.swell(.2, .2), amp: 1 }); }

// ================= F · the flood: Ravana's camp =================
T.at(F0, water(1.2, .6), .05, 0);
for (let t = F0 + .2; t < WAVE - .1; t += .45) T.at(t, mixb(tone(.08, 180, { type: 'tri', e: env.pluck(20), amp: .6 })), .05, .2);   // chewing, munch munch
T.at(WAVE - .3, torrent(1.8, 1, 1.4), .3, -.4);
T.at(WAVE + .4, mixb(splash(1.4), thud(.8)), .35, 0);
T.at(WAVE + .5, voice([[0, .9, 1.4, .8]], RAV, { fall: .4, amp: 1, shake: .7 }), .16, 0);   // a ten-headed yelp
for (let k = 0; k < 6; k++) T.at(WAVE + 1.2 + k * .5, plink(note(84 + (k % 3) * 2), .4), .05, .3);   // drips
T.at(WAVE + 2, boing(160, .6), .06, -.4);                                                   // the nightcap bobs away

// ================= G · Ravana picks a fight; caught like a monkey =================
for (let k = 0; k < 4; k++) T.at(G0 + .1 + k * .35, mixb(drum(40, 1, .5), thud(.6)), .3, 0);   // stomp stomp
T.at(G0 + .2, roar(1.2, 110, 6, 1), .14, 0);
T.at(CAUGHT - .2, whoosh(.3, 500, 4000), .2, .3);
T.at(CAUGHT, mixb(thwack(1), boing(260, .8)), .35, .3);                                     // YOINK
T.at(CAUGHT + .3, laughter(2.4, .9), .08, -.4); T.at(CAUGHT + .6, laughter(2.0, .8), .07, .5);
T.at(CAUGHT + .5, voice([[0, .4, .9, .4], [.5, .4, .8, .3], [1.1, .5, .7, .3]], RAV, { fall: .3, amp: .8 }), .1, .4);   // a sulk
for (let k = 0; k < 4; k++) T.at(CAUGHT + .3 + k * .75, squeak(600, 420, .18, .5), .04, .45);   // he swings, creak
T.at(H0 - .4, whoosh(.5, 3000, 300), .12, 0);

// ================= H · the wish-cow feeds the army =================
T.at(H0, tanpura(J0 - H0 + 1, 50, 1), .03, 0);
for (let t = H0 + .5; t < I0 - .4; t += 1 + rnd() * .5) T.at(t, bird(2600 + rnd() * 800, .5), .035, rnd() * 1.4 - .7);
T.at(H0 + .5, moo(.9, 160, .8), .06, -.4);
for (let i = 0; i < 3; i++) T.at(H0 + .8 + i * .5, mixb(chime(note(84 + i * 3), .7, 1.4), shimmer(.6, [note(96 + i * 2)], .4, .1)), .08, -.1 + i * .3);   // plates fill
for (let k = 0; k < 7; k++) T.at(H0 + 2.4 + k * .3, tone(.07, 200 + (k % 3) * 40, { type: 'tri', e: env.pluck(20), amp: .5 }), .04, .2);   // munching

// ================= I · greed =================
T.at(I0, strings(4.4, [45, 46, 52], 1, .6, .8), .06, 0);
T.at(I0 + 1.0, mixb(tink(1), shimmer(.6, [note(100), note(103)], .5, .05)), .1, -.2);   // the gold glint
T.at(I0 + 1.3, voice([[0, .8, .9, .3]], KINGV, { rise: .15, amp: .7 }), .07, -.3);     // "hmmm"

// ================= J · dragged away, crying =================
T.at(J0, strings(K0 - J0, [50, 53, 57], 1, .8, 1), .07, 0);
T.at(J0 + .3, moo(1.6, 125, 1), .14, 0); T.at(J0 + 2.4, moo(1.4, 115, 1), .12, 0);
T.at(J0 + 1.2, moo(.9, 260, .8), .08, -.3); T.at(J0 + 3.2, moo(.8, 280, .8), .07, -.3);   // the calf
for (let k = 0; k < 12; k++) T.at(J0 + .2 + k * .38, step(.5), .08, .4);
T.at(J0 + .6, mixb(squeak(400, 300, .3, .5)), .04, .2);                                   // the rope

// ================= K · home: the empty post =================
T.at(K0, wind(L0 - K0, 1, .8), .06, -.2);
for (let k = 0; k < 7; k++) T.at(K0 + .1 + k * .22, step(.6), .1, -.5 + k * .1);
T.at(SEE - .1, mixb(click(.5), whoosh(.2, 2000, 5000)), .12, 0);
T.at(SEE + .1, ring(1.4, 1760, .4), .03, 0);
T.at(SEE + .9, mixb(boom(.9), thunder(2, .8)), .45, 0);
T.at(SEE + .95, roar(1.1, 150, 5, .8), .1, 0);                                           // a struck cobra's hiss, a roar
T.at(SEE + .9, hiss(1.0, 1), .05, 0);

// ================= L · he runs after the king =================
T.at(L0, warDrum(M0 - L0, 150, 1), .14, 0);
for (let k = 0; k * .18 < M0 - L0 - .2; k++) T.at(L0 + k * .18, step(.8), .12, .1);
T.at(L0, wind(M0 - L0, 2, .3), .1, 0);
T.at(L0, brass(M0 - L0, [45, 52, 57], 1, .3, .4), .05, 0);

// ================= M · seventeen armies =================
T.at(M0, roar(2.2, 90, 14, 1), .14, 0);                                                    // the army's war cry
T.at(M0, warDrum(N0 - M0, 160, 1), .16, 0);
T.at(M0 + .3, conchLike(), .06, -.3);
function conchLike() { return lp(tone(1.6, t => 311 * (1 + .01 * Math.sin(t * 30)), { type: 'saw', e: env.swell(.2, .5), amp: 1 }), 1500); }
for (let t = M0 + 1.0; t < N0 - .5; t += .16 + rnd() * .12) T.at(t, rnd() < .25 ? boing(160 + rnd() * 120, .7) : thwack(.8), .14, rnd() * 1.2 - .6);
for (let k = 0; k < 5; k++) T.at(M0 + 1.6 + k * .8, mixb(squeak(900, 300, .35, .5)), .05, (k % 2 ? 1 : -1) * .6);   // flung soldiers "wheee"
T.at(M0 + 2.2, clangLike(), .1, .2); T.at(M0 + 3.6, clangLike(), .1, -.3);
function clangLike() { return bell(note(76), .8, { partials: [[1, 1], [2.32, .6], [3.87, .4]], k: 5, amp: 1 }); }

// ================= N · 500 bows; Rama has one =================
T.at(N0, strings(N1 - N0 + .3, [45, 51, 52], 1, .2, .2), .08, 0);
for (let k = 0; k < 10; k++) T.at(N0 + .3 + k * .12, squeak(300 + k * 30, 500 + k * 40, .1, .4), .04, -.6 + k * .12);   // bowstrings drawn
T.at(LOOSE, mixb(...[0, 1, 2, 3, 4].map(i => whoosh(.6, 2000 + i * 400, 300))), .3, 0);   // the volley
T.at(LOOSE, thunder(1.2, .6), .15, 0);
for (let t = N1 + .05; t < O0 - .3; t += .2 + rnd() * .1) T.at(t, mixb(hiss(.2, .6), tink(.6)), .1, rnd() * 1.2 - .4);   // arrows meet arrows
for (let k = 0; k < 8; k++) T.at(N1 + .1 + k * .35, mixb(squeak(800, 500, .06, .5), whoosh(.18, 4000, 1500)), .09, -.4);   // his one bow

// ================= O · the hill; the axe; a crown in the dust =================
T.at(O0, rockfall(1.4, 1), .22, 0);
T.at(O0 + .1, roar(1.0, 120, 6, 1), .14, 0);
T.at(O0 + .2, mixb(crunch(1), thud(.8)), .2, 0);
T.at(LEAP - .6, riser(.55, 150, 2000, 1), .2, 0);
// LEAP: the leap, then 0.2 s of silence before the blow
T.at(LEAP, whoosh(.3, 400, 5000), .2, 0);
T.at(AXE, boom(1.3), .75, 0);
T.at(AXE, mixb(bell(note(43), 3.6, { k: 1.1 }), whoosh(1.0, 6000, 200)), .3, 0);
T.at(AXE + .05, ring(3.2, 2600, .3), .03, 0);
for (let k = 0; k < 6; k++) T.at(AXE + .25 + k * (.24 - k * .025), tink(.8 - k * .1), .12, .5 - k * .1);   // the crown rolls: clink, clink… still
T.at(AXE + 1.7, wind(P0 - AXE - 1.7, 1, .5), .06, 0);
T.at(AXE + 1.4, om(P0 - AXE - 1.2, 70, .6), .08, 0);

// ================= P · home with the cow and calf =================
T.at(P0 - .2, whoosh(.5, 400, 3000), .12, 0);
T.at(P0, pad(Q0 - P0 + .4, [62, 66, 69, 74], 1, .6, 1.2), .05, 0);
T.at(P0 + .3, moo(.8, 170, .8), .06, .2); T.at(P0 + 1.4, mixb(chime(note(91), .6, 1.4), pop(1000, .6)), .07, 0);   // the heart
for (let k = 0; k < 6; k++) T.at(P0 + .4 + k * .4, boing(300 + (k % 2) * 60, .4), .04, .5);   // the calf hops
for (let t = P0 + .6; t < Q0 - .5; t += 1.3 + rnd() * .6) T.at(t, bird(2800 + rnd() * 600, .4), .03, rnd() - .5);

// ================= Q · the father =================
T.at(Q0, tanpura(R0 - Q0, 50, 1), .03, 0);
T.at(Q0, pad(R0 - Q0, [50, 57, 62, 65], 1, 1.2, 1), .05, 0);
T.at(Q0 + .2, bell(note(62), 3, { k: 1.4 }), .06, 0);
T.at(Q0 + 1.0, talk(3.2, SAGE, { gap: .22, br: .3, amp: .8 }), .1, -.2);

// ================= R · the ask: a ladder =================
T.at(R0 - .25, whoosh(.5, 400, 3000), .16, 0);
T.at(R0, mixb(boom(.7), bell(note(45), 3, { k: 1.3 })), .25, 0);
for (let i = 0; i < 4; i++) T.at(R0 + .3 + i * .25, plink(note(72 + i * 4), .6), .1, -.5 + i * .33);   // up the steps
T.at(R0 + .9, mixb(squeak(400, 900, .25, .6), shimmer(.8, [note(91), note(96)], .5, .08)), .1, .5);   // the "?"
for (let k = 0; k < 5; k++) T.at(R0 + 1.4 + k * .09, damru(250 + (k % 2) * 30, .5), .06, 0);
T.at(R0, sub(CARD - R0, 41, .7), .1, 0);

// ================= S · the card =================
T.at(CARD - .3, whoosh(.6, 400, 3000), .2, 0);
[0, .15, .3].forEach((d, i) => T.at(CARD + .3 + d, pop(800 + i * 140, .9), .14, -.3 + i * .3));
T.at(CARD + 1.0, chime(note(84), .7, 1.4), .1, 0); T.at(CARD + 1.3, chime(note(91), .7, 1.4), .1, 0);
T.at(CARD + 1.6, pop(1000, 1), .16, 0); T.at(CARD + 2.0, chime(note(96), .6, 2), .08, 0);
T.at(CARD + .2, pad(3.8, [64, 67, 71, 76], 1, .5, 1.2), .05, 0);

T.write('assets/parshu4_sfx.wav');
