// parshu1_sfx.mjs: the sound for "PARSHURAMA was born a WARRIOR because of a KHEER MIX-UP" (src/scenes/parshu1.js, ad 63,
// no voice) → assets/parshu1_sfx.wav. Times are the scene's constants (keep them in sync). Retro synth cartoon foley
// carries it (the swap whoosh and clink, the court fanfare, Gadhi's sly "hmm", the river heaving, hooves, the conch,
// the fire and the bubbling kheer, tiptoes, slurps, the "busted" bell, the plea's harp, the cradle's music box, the
// time-lapse), over a mild tanpura bed. Half a second of silence, then a deep hit on PARSHURAMA.
import { track, tone, noise, bell, mixb, env, whoosh, plink, squeak, click, thud, shimmer, chime, drum, heart, conch, om, wind, whir, fire, splash, crackle,
  note, seed, rnd, clamp, SR } from './sfx.mjs';

const SWAP = 1.2, B0 = 3.6;
const WALK0 = 3.7, FOLD = 4.7, SLY = 6.6, C0 = 8.6;
const FINGER = 8.8, BUBBLE = 11.2, RICH = 13.4, D0 = 15.6;
const LIFT = 15.8, HEAVE = 16.2, HORSE0 = 16.9, GJAW = 19.0, WED = 19.8, E0 = 22.0;
const BOWLS = 25.0, VIS = 25.6, LABEL = 27.2, BATHE = 29.6, F0 = 30.6;
const EYE = 30.8, WHISPER = 32.2, NOD = 33.0, SWAP2 = 33.5, EAT = 34.6, DOOR = 36.6, G0 = 37.6;
const KNOW = 38.0, SCARED = 40.2, H0 = 43.0;
const PLEA = 43.2, SIGH = 45.4, PALM = 45.8, DRIFT = 46.4, I0 = 49.2;
const YAWN = 50.6, LAPSE = 52.4, J0 = 54.6;
const REVEAL = 56.4, K0 = 60.6;
const VISH = 62.6, L0 = 65.4;
const ASK = 66.0, CARD = 69.0, END = 73.0;
const HORSES = 9, HORSE_GAP = .32;

const T = track(END);
seed(63);
// a buzzy cartoon voice: syllables [start, dur, pitch ×, brightness 0..1] (as in ads 59 and 60)
function voice(syl, f0, { amp = 1, fall = .1, rise = 0, shake = 0 } = {}) {
  const D = Math.max(...syl.map(([s, d]) => s + d)) + .1, o = new Float32Array(Math.round(D * SR));
  let ph = 0, l = 0;
  for (let i = 0; i < o.length; i++) {
    const t = i / SR, s = syl.find(([a, d]) => t >= a && t < a + d);
    if (!s) { o[i] = 0; continue; }
    const [a, d, pm, br] = s, k = (t - a) / d, e = clamp(k / .12) * clamp((1 - k) / .25);
    ph += f0 * pm * (1.04 - fall * k + rise * k) * (1 + .012 * Math.sin(t * 38) + shake * .04 * Math.sin(t * 2 * Math.PI * 7)) / SR;
    const x = 2 * (ph - Math.floor(ph)) - 1, fc = 600 + br * 2400 * Math.sin(Math.PI * clamp(k * 1.3)), al = 1 - Math.exp(-2 * Math.PI * fc / SR);
    l += al * (x * e - l); o[i] = l * amp;
  }
  return o;
}
const talk = (dur, f, { gap = .16, amp = 1, br = .5, fall = .1, shake = 0 } = {}) =>
  voice(Array.from({ length: Math.max(1, Math.floor(dur / gap)) }, (_, i) => [i * gap, gap * .72, 1 + .14 * Math.sin(i * 2.3) - (i % 5 === 4 ? .12 : 0), br]), f, { amp, fall, shake });
const RICHV = 140, GADHI = 115, QUEEN = 230, SATYA = 290, BABY = 380;
const pop = (f = 900, amp = 1) => mixb(squeak(f * .6, f * 1.6, .07, amp), plink(f * 1.5, amp * .5));
const clink = (amp = 1) => mixb(bell(note(96), .5, { partials: [[1, 1], [2.7, .4], [5.2, .2]], k: 9, amp }), click(amp * .5));
const hoof = amp => mixb(tone(.06, 380 + rnd() * 120, { type: 'tri', e: env.pluck(50), amp }), noise(.04, { lp: 1800, e: env.pluck(60), amp: amp * .5 }));
const tip = (i, amp = 1) => tone(.09, note([72, 76, 79, 76][i % 4]), { type: 'tri', e: env.pluck(30), amp });
const slurp = amp => noise(.42, { lp: t => 900 + 2400 * t / .42, hp: 300, e: env.swell(.05, .1), amp });
const bubble = amp => tone(.07, t => 300 + 900 * t / .07, { e: env.hann(), amp });
const add = (o, b, s0, g = 1) => { const s = Math.round(s0 * SR); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j] * g; return o; };
const lp = (b, fc) => { let l = 0; const a = 1 - Math.exp(-2 * Math.PI * fc / SR); for (let i = 0; i < b.length; i++) { l += a * (b[i] - l); b[i] = l; } return b; };
const tanpura = (dur, root = 50, amp = 1) => { const o = new Float32Array(Math.round((dur + 2.5) * SR)); const ns = [root + 7, root + 12, root + 12, root];
  for (let k = 0; k * .9 < dur; k++) add(o, lp(tone(2.4, note(ns[k % 4]), { type: 'saw', e: env.ad(.05, .9), amp }), 1400), k * .9, 1 - .5 * clamp((k * .9 - dur + 1.5) / 1.5)); return o; };
const pad = (dur, ms, amp = 1, a = 1.2, r = 1.4) => mixb(...ms.map((m, i) => tone(dur, t => note(m) * (1 + .003 * Math.sin(t * 2 + i)), { type: 'tri', e: env.swell(a, r), amp: amp / ms.length })));
const brass = (dur, ms, amp = 1, a = .08, r = .5) => mixb(...ms.map((m, i) => lp(tone(dur, t => note(m) * (1 + .004 * Math.sin(t * 30 + i)), { type: 'saw', e: env.swell(a, r), amp: amp / ms.length }), 2200)));
const musicBox = f => bell(f, 1.6, { partials: [[1, 1], [3.0, .25], [5.1, .08]], k: 2.6 });
const harp = (f, amp = 1) => bell(f, 1.4, { partials: [[1, 1], [2, .35], [3, .12]], k: 3, amp });
const bird = (f, amp = 1) => mixb(squeak(f, f * 1.4, .07, amp), squeak(f * 1.3, f * 1.1, .06, amp * .7));
const water = (dur, amp = 1) => noise(dur, { lp: t => 700 + 500 * Math.sin(t * 1.7) ** 2, hp: 200, e: env.swell(.6, .6), amp });

// ================= beds: a mild tanpura under the story; birds by day; the hearth by lamplight =================
T.at(B0, tanpura(J0 - B0 - .8, 50, 1), .035, 0);
for (const [a, b] of [[B0, E0 - 3], [E0, F0], [I0, LAPSE]]) for (let t = a + .5; t < b - .3; t += 1.5 + rnd() * 1.5) T.at(t, bird(2600 + rnd() * 1000, .5), .035, rnd() * 1.6 - .8);
T.at(F0, fire(I0 - F0, .4, .6), .05, -.4);
T.at(D0, water(GJAW - D0 + .3), .1, .2);

// ================= A · the hook: the two bowls =================
T.at(.1, mixb(bubble(.6), bubble(.5)), .06, -.3); T.at(.5, bubble(.5), .05, .3);
T.at(SWAP - .05, whoosh(.6, 600, 4000), .3, 0);
T.at(SWAP + .7, clink(1), .3, -.2); T.at(SWAP + .76, clink(.8), .25, .2);
T.at(SWAP + .8, pop(1000, .8), .12, 0);
T.at(2.4, noise(.6, { lp: 2400, hp: 900, e: env.swell(.1, .3), amp: 1 }), .06, .3);   // the red bowl hisses
T.at(B0 - .3, whoosh(.6, 400, 3000), .2, 0);                                          // the wipe

// ================= B · the court =================
T.at(B0 + .05, brass(1.1, [55, 59, 62], 1, .03, .5), .14, 0);                          // a court fanfare sting
T.at(B0 + .45, brass(1.2, [60, 64, 67], 1, .03, .6), .14, 0);
for (let k = 0; k < 4; k++) T.at(WALK0 + .1 + k * .25, click(.5), .08, -.6 + k * .1);    // bare feet on the floor
T.at(FOLD + .05, mixb(chime(note(84), .6, 1.2), click(.4)), .1, -.3);                   // namaste
T.at(FOLD + .6, talk(1.6, RICHV, { gap: .18, br: .35 }), .1, -.3);
T.at(5.3, voice([[0, .25, 1.2, .6], [.3, .25, 1.35, .6]], SATYA, { amp: .7 }), .06, .4);   // a shy "hm-hm"
T.at(SLY, voice([[0, .6, 1, .25]], GADHI, { fall: .25, rise: .1 }), .18, 0);           // Gadhi's sly "hmmm"
T.at(SLY + .1, tone(.6, t => 180 - 60 * t, { type: 'saw', e: env.swell(.05, .3), amp: .6 }), .06, 0);

// ================= C · the bride price =================
T.at(C0 - .1, whoosh(.3, 2000, 600), .1, 0);
T.at(FINGER, plink(note(88), 1), .14, .2);                                            // the finger goes up
T.at(FINGER + .2, talk(2.2, GADHI, { gap: .17, br: .4 }), .16, 0);
T.at(BUBBLE - .1, mixb(pop(700, 1), shimmer(.6, [note(84), note(88)], .5, .05)), .14, -.4);
T.at(BUBBLE + .2, talk(1.6, GADHI, { gap: .17, br: .4 }), .16, 0);
for (let k = 0; k < 6; k++) T.at(BUBBLE + .3 + k * .12, hoof(.6), .08, -.5);            // the little horse canters
T.at(BUBBLE + .5, voice([[0, .3, 1.3, .7]], 900, { amp: .5, fall: .3 }), .05, -.5);    // a neigh
T.at(BUBBLE + 1.9, voice([[0, .1, 1, .4], [.14, .1, .95, .4], [.28, .18, .9, .4]], GADHI, { fall: .15 }), .14, 0);   // "heh heh heh"
T.at(RICH, whoosh(.3, 600, 2400), .1, 0);
T.at(RICH + .5, chime(note(91), .6, 1.4), .08, 0);                                     // calm smile
T.at(RICH + 1, voice([[0, .3, 1, .3]], RICHV, { fall: .1 }), .08, 0);                   // "mm."

// ================= D · Varuna's horses =================
T.at(LIFT, mixb(shimmer(1.2, [note(79), note(84), note(88), note(91)], .6, .1), om(1.6, 110, .5)), .12, 0);
T.at(HEAVE, mixb(noise(1.4, { brown: true, lp: t => 200 + 900 * t, e: env.swell(.3, .4), amp: 1 }), whir(1.2, .5)), .2, .3);
T.at(HEAVE + .9, splash(1), .3, .3);
for (let i = 0; i < HORSES; i++) {
  const t0 = HORSE0 + i * HORSE_GAP, pan = clamp(.4 - i * .1, -.8, .8);
  T.at(t0, splash(.5), .1, pan);
  for (let k = 0; k < 12; k++) T.at(t0 + k * .17 + (k % 2) * .05, hoof(.8), .05 + .07 * (k / 12), pan - k * .05);
  if (i % 3 === 0) T.at(t0 + .3, voice([[0, .35, 1.3, .7], [.38, .2, 1.1, .5]], 820 + i * 30, { amp: .6, fall: .4, shake: 1 }), .06, pan);   // neighs
}
T.at(HORSE0 + .3, brass(2.0, [55, 62, 67], 1, .2, .6), .1, 0);
T.at(GJAW, mixb(thud(1), tone(.5, t => 700 - 500 * t, { type: 'tri', e: env.pluck(4), amp: .8 })), .3, 0);   // the jaw drops
T.at(GJAW + .05, voice([[0, .45, 1.4, .8]], GADHI, { fall: .2, shake: 1 }), .2, 0);        // "WHAAA"
T.at(GJAW + .5, plink(note(91), .8), .1, .4);                                            // the crown slips
T.at(WED - .3, whoosh(.6, 400, 3000), .2, 0);
T.at(WED, conch(1.6, 311, 1), .12, 0);
T.at(WED + .2, mixb(chime(note(84), 1, 2), chime(note(88), .8, 2), chime(note(91), .7, 2)), .12, 0);
for (let k = 0; k < 10; k++) T.at(WED + .3 + k * .16, plink(note([84, 88, 91, 96][k % 4]), .5), .05, rnd() - .5);   // petals

// ================= E · two wishes, two bowls =================
T.at(E0 + .6, mixb(pop(900, .8), chime(note(96), .5, 1)), .08, .1);
T.at(E0 + 1.2, mixb(pop(1000, .8), chime(note(100), .5, 1)), .08, .5);
T.at(E0 + 1.6, talk(1.2, QUEEN, { gap: .15, amp: .7, br: .5 }), .06, .2);
T.at(BOWLS - .1, whoosh(.3, 2000, 600), .1, 0);
T.at(BOWLS, fire(BATHE - BOWLS + .6, .6, 1), .1, 0);
for (let k = 0; k < 14; k++) T.at(BOWLS + .2 + k * .3 + rnd() * .1, bubble(.6), .05, k % 2 ? -.4 : .4);   // the kheer bubbles
T.at(BOWLS + .1, om(BATHE - BOWLS - .2, 120, .6), .07, 0);                                 // Richika chants
T.at(VIS, mixb(shimmer(1.4, [note(84), note(88), note(91), note(96)], .7, .1), pad(1.6, [72, 76, 79], 1, .2, .8)), .12, -.4);   // the sage's light
T.at(VIS + .3, mixb(drum(60, 1, .6), brass(1.4, [50, 57, 62], 1, .05, .6)), .14, .4);     // the warrior's
T.at(LABEL, chime(note(91), .6, 1.2), .08, -.3); T.at(LABEL + .3, drum(70, .7, .4), .1, .3);
for (let k = 0; k < 5; k++) T.at(BATHE + .4 + k * .2, click(.5), .07, .2 + k * .12);       // off to the river
T.at(BATHE + .5, voice([[0, .14, 1.2, .5], [.18, .14, 1.3, .5], [.36, .2, 1.1, .5]], RICHV, { amp: .7 }), .07, .5);   // a hummed tune
T.at(F0 - .3, whoosh(.6, 400, 3000), .2, 0);

// ================= F · the swap =================
for (let t = F0 + .4; t < DOOR; t += 2.4) T.at(t, mixb(squeak(3200, 3000, .05, .5), squeak(3300, 3100, .05, .4)), .03, .7);   // crickets outside
T.at(EYE + .2, mixb(tone(.5, t => 300 + 200 * Math.sin(t * 9), { type: 'tri', e: env.hann(), amp: .6 })), .07, -.4);   // the side-eye
T.at(EYE + .9, voice([[0, .5, 1, .3]], QUEEN, { rise: .2 }), .08, -.4);                    // "hmmm"
T.at(WHISPER, noise(.8, { hp: 2000, lp: 6000, e: env.swell(.1, .2), amp: .6 }), .05, -.2); // pss-pss
T.at(WHISPER + .1, talk(.7, QUEEN * 1.2, { gap: .1, amp: .4, br: .8 }), .05, -.2);
T.at(NOD - .3, voice([[0, .3, 1.1, .6]], SATYA, { rise: .4 }), .06, .2);                    // "huh?"
T.at(NOD + .15, mixb(plink(note(84), .6), plink(note(88), .5)), .08, .2);                   // nod nod
for (let k = 0; k < 4; k++) T.at(SWAP2 - .2 + k * .14, tip(k, .8), .1, 0);                 // tiptoe pizzicato
T.at(SWAP2 + .1, whoosh(.6, 800, 3600), .18, 0);
T.at(SWAP2 + .8, clink(.8), .2, -.2); T.at(SWAP2 + .85, clink(.7), .18, .2);
T.at(EAT + .1, slurp(1), .12, -.3); T.at(EAT + .6, slurp(1), .12, .3);
T.at(EAT + 1.1, voice([[0, .3, 1.1, .4]], QUEEN, { fall: .2 }), .07, -.3);                   // "mmm!"
T.at(EAT + 1.3, voice([[0, .3, 1.15, .4]], SATYA, { fall: .2 }), .07, .3);
T.at(DOOR - .05, mixb(thud(.8), squeak(500, 200, .2, .6)), .2, .6);                         // the door
T.at(DOOR + .1, mixb(plink(note(86), 1), plink(note(91), .8)), .2, 0);                      // "!" "!"
T.at(G0 - .1, whoosh(.3, 2000, 500), .12, 0);

// ================= G · busted =================
T.at(KNOW + .2, bell(note(67), 2.4, { k: 2 }), .3, 0);                                       // he knows
T.at(KNOW + .2, drum(45, 1, 1.0), .3, 0);
T.at(KNOW + .3, talk(1.3, RICHV, { gap: .16, br: .55, amp: 1.1 }), .18, 0);
T.at(SCARED - .1, whoosh(.3, 2000, 500), .1, 0);
T.at(SCARED, mixb(heart(.8)), .25, 0); T.at(SCARED + .7, heart(.8), .25, 0); T.at(SCARED + 1.4, heart(.9), .28, 0);
T.at(SCARED + .1, talk(2.2, RICHV, { gap: .17, br: .5 }), .12, .4);
T.at(SCARED + .2, mixb(drum(55, .8, .5), brass(2.0, [50, 53, 57], 1, .3, .6)), .08, 0);   // the warrior's fire, ominous
T.at(H0 - .3, whoosh(.6, 400, 3000), .2, 0);

// ================= H · the plea =================
T.at(PLEA, voice([[0, .25, 1.3, .7], [.3, .3, 1.4, .7], [.65, .45, 1.5, .8]], SATYA, { fall: .3, shake: 1 }), .14, -.3);   // "not my son, please!"
for (let k = 0; k < 6; k++) T.at(PLEA + .3 + k * .35, harp(note([67, 71, 74, 79, 74, 71][k]), .7), .08, -.2);
T.at(SIGH, noise(.9, { lp: 900, hp: 150, e: env.swell(.2, .5), amp: 1 }), .1, .3);          // the sigh
T.at(PALM, mixb(shimmer(1.2, [note(79), note(84), note(88), note(91)], .6, .12), pad(3.2, [67, 71, 74], 1, .4, 1.2)), .12, .3);
T.at(PALM + .3, talk(1.2, RICHV, { gap: .2, br: .3, amp: .9 }), .1, .3);
T.at(DRIFT, mixb(whoosh(2.2, 600, 2400), shimmer(2, [note(91), note(96), note(100), note(103)], .5, .3)), .1, .6);
T.at(I0 - .3, whoosh(.6, 400, 3000), .2, 0);

// ================= I · baby Jamadagni; the years =================
[76, 79, 84, 83, 79, 76, 74, 76, 79].forEach((m, k) => T.at(I0 + .3 + k * .42, musicBox(note(m)), .08, 0));   // a music-box lullaby
T.at(YAWN, voice([[0, .7, 1.2, .3]], BABY, { fall: .4 }), .1, 0);
T.at(YAWN + .9, mixb(shimmer(.8, [note(96), note(100), note(103)], .5, .08)), .1, 0);
T.at(YAWN + 1.1, voice([[0, .12, 1.3, .7], [.16, .14, 1.45, .8]], BABY, { amp: .7 }), .07, 0);   // a coo
T.at(LAPSE - .3, whoosh(.6, 400, 3000), .2, 0);
T.at(LAPSE, whir(2.0, 1), .06, 0);
for (let k = 0; k < 16; k++) T.at(LAPSE + k * .12, click(.5), .05, k % 2 ? .3 : -.3);   // a clock racing
T.at(J0 - .3, whoosh(.6, 3000, 400), .2, 0);

// ================= J · Parshurama: wind, a held breath, then the hit =================
T.at(J0, wind(K0 - J0 + .5, 0, .8), .14, -.3); T.at(J0, wind(K0 - J0 + .5, 2, .8), .12, .3);
T.at(J0 + .2, tone(REVEAL - J0 - .7, t => 55 + 8 * t, { type: 'saw', e: env.swell(.8, .2), amp: .6 }), .06, 0);   // a low swell, cut before the hit
for (let k = 0; k < 3; k++) T.at(J0 + .4 + k * .45, drum(52, .6 + k * .15, .5), .14, 0);
// silence (REVEAL - .5 .. REVEAL), then:
T.at(REVEAL, drum(40, 1, 1.4), .6, 0); T.at(REVEAL, thud(1), .45, 0);
T.at(REVEAL + .02, noise(2.0, { brown: true, lp: 200, e: env.ad(.01, .8), amp: 1 }), .35, 0);
T.at(REVEAL + .05, bell(note(55), 3.2, { k: 1.4 }), .2, 0);                                   // a great temple bell
T.at(REVEAL + .1, brass(2.6, [43, 50, 55, 62], 1, .04, 1.2), .22, 0);
T.at(REVEAL + .3, conch(2.0, 277, 1), .12, 0);
T.at(REVEAL + 1.1, mixb(clink(.5), shimmer(1.4, [note(91), note(96), note(103)], .5, .1)), .08, -.4);   // the axe glints
T.at(K0 - .3, whoosh(.6, 400, 3000), .2, 0);

// ================= K · the queen's son: Vishvamitra =================
[79, 76, 74, 76].forEach((m, k) => T.at(K0 + .3 + k * .42, musicBox(note(m)), .07, 0));
T.at(VISH - .25, mixb(pop(800, 1), whoosh(.5, 1200, 4000)), .14, 0);
T.at(VISH, bell(note(62), 2.6, { k: 1.8 }), .16, 0);
T.at(VISH + .1, om(2.6, 110, .8), .12, 0);
T.at(VISH + .2, pad(2.6, [62, 66, 69], 1, .4, 1.2), .06, 0);
T.at(L0 - .3, whoosh(.6, 400, 3000), .2, 0);

// ================= L · the ask; the card =================
T.at(L0 + .1, clink(.7), .14, -.3); T.at(L0 + .35, clink(.7), .14, .3);
T.at(L0 + .2, pad(3.4, [64, 67, 71, 76], 1, .5, 1.2), .05, 0);
T.at(ASK, mixb(chime(note(91), .7, 1.2), conch(1.0, 311, .6)), .1, 0);
T.at(CARD - .3, whoosh(.6, 400, 3000), .2, 0);
[0, .15, .3].forEach((d, i) => T.at(CARD + .3 + d, pop(800 + i * 140, .9), .14, -.3 + i * .3));
T.at(CARD + 1.1, chime(note(84), .7, 1.4), .1, 0); T.at(CARD + 1.4, chime(note(91), .7, 1.4), .1, 0);
T.at(CARD + 1.7, pop(1000, 1), .16, 0); T.at(CARD + 2.1, chime(note(96), .6, 2), .08, 0);
T.at(CARD + .2, pad(3.6, [64, 67, 71, 76], 1, .5, 1.2), .05, 0);

T.write('assets/parshu1_sfx.wav');
