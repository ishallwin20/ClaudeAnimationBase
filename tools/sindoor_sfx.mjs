// sindoor_sfx.mjs: the sound effects for "Why is HANUMAN JI covered in SINDOOR?" (src/scenes/sindoor.js) →
// assets/sindoor_sfx.wav. Times are the scene's constants (keep them in sync). Every shot has a bed under it (a warm pad
// on the hook, palace birds and a tanpura in the chamber, room tone in the storeroom, court murmur, temple bells and
// diyas at dusk) so nothing goes silent; on top: the pat puff, the sneeze, the dab chime, the peek, the idea ding, the
// pot pours (a sandy whoosh), the spin, the tail dip, footsteps, the court's laughter, the hush, the hug, the blessing,
// the bell and the oil, the wink, and the card.
import { track, tone, noise, bell, mixb, env, whoosh, plink, clang, click, thud, shimmer, slide, drone, squeak, crackle, note, seed, clamp, chime, laughter, wind, drum, SR } from './sfx.mjs';

const PAT = 1.7, SNIFF = 4.9, SNEEZE = 5.6, C0 = 6.4;
const DAB1 = 8.4, PEEK = 7.6, DAB2 = 10.6, STEP = 12.1, TURN = 15.2, E0 = 18.6;
const PINCH = 19.0, IDEA = 21.4, F0 = 24.4;
const POUR1 = 25.3, POUR2 = 26.7, SPIN = 27.8, EMERGE = 28.9, LOOK = 29.6, DIP = 30.4, G0 = 31.6;
const STARE = 34.0, LAUGH = 35.0, ASKR = 37.7, BOWH = 40.4, QUIET = 43.6, RAMK = 45.0, I0 = 46.4;
const HUG = 47.6, PART = 49.3, BLESS = 49.6, J0 = 53.4;
const DAB3 = 55.0, WINK = 59.4, K0 = 60.6, KWINK = 63.2, CARD = 64.6, END = 72.2;
const CAP_T = CARD + .1, COVERS = CARD + .4, PRICE = CARD + 1.2, STRIKE = CARD + 1.7, DEAD = CARD + 2.2, PILL = CARD + 2.7;

const T = track(END);
seed(29);
const SRr = SR;
const lp = (b, fc) => { let l = 0; const a = 1 - Math.exp(-2 * Math.PI * fc / SRr); for (let i = 0; i < b.length; i++) { l += a * (b[i] - l); b[i] = l; } return b; };
const add = (o, b, s0, g = 1) => { const s = Math.round(s0 * SRr); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j] * g; return o; };
// a buzzy cartoon voice: syllables [start, dur, pitch ×, brightness 0..1]
function voice(syl, f0, { amp = 1, fall = .1, rise = 0 } = {}) {
  const D = Math.max(...syl.map(([s, d]) => s + d)) + .1, o = new Float32Array(Math.round(D * SRr));
  let ph = 0, l = 0;
  for (let i = 0; i < o.length; i++) {
    const t = i / SRr, s = syl.find(([a, d]) => t >= a && t < a + d);
    if (!s) { o[i] = 0; continue; }
    const [a, d, pm, br] = s, k = (t - a) / d, e = clamp(k / .12) * clamp((1 - k) / .25);
    ph += f0 * pm * (1.04 - fall * k + rise * k) * (1 + .012 * Math.sin(t * 38)) / SRr;
    const x = 2 * (ph - Math.floor(ph)) - 1, fc = 600 + br * 2400 * Math.sin(Math.PI * clamp(k * 1.3)), al = 1 - Math.exp(-2 * Math.PI * fc / SRr);
    l += al * (x * e - l); o[i] = l * amp;
  }
  return o;
}
const chatter = (n, f, gap = .13, amp = 1, br = .6) => voice(Array.from({ length: n }, (_, i) => [i * gap, gap * .75, 1 + .12 * Math.sin(i * 2.3), br]), f, { amp });
const HAN = 210, SITA = 330, RAM = 150;
const pop = (amp = 1, f = 1) => mixb(click(amp), tone(.07, t => f * (500 + 2600 * t / .07), { e: env.pluck(40), amp: amp * .7 }), noise(.05, { lp: 2500, hp: 300, e: env.pluck(60), amp: amp * .5 }));
const chord = (ms, d = 2, amp = 1) => { const o = new Float32Array(Math.round((d + 1) * SRr)); ms.forEach((m, i) => add(o, bell(note(m), d, { partials: [[1, 1], [2, .35], [3, .12]], k: 1.4, amp }), i * .05)); return o; };
const pad = (dur, ms, amp = 1) => mixb(...ms.map((m, i) => tone(dur, t => note(m) * (1 + .003 * Math.sin(t * 2 + i)), { type: 'tri', e: env.swell(.8, .8), amp: amp / ms.length })));
const tanpura = (dur, root = 50, amp = 1) => { const o = new Float32Array(Math.round((dur + 1) * SRr)); const ns = [root + 7, root + 12, root + 12, root]; for (let k = 0; k * .9 < dur; k++) add(o, lp(tone(2.4, note(ns[k % 4]), { type: 'saw', e: env.ad(.05, .9), amp }), 1800), k * .9); return o; };
const powderWhoosh = (d = .8, amp = 1) => mixb(noise(d, { lp: t => 5000 - 3000 * t / d, hp: 600, e: env.ad(.02, d * .35), amp }), noise(d, { lp: 900, hp: 80, e: env.ad(.03, .2), amp: amp * .5 }));
const sneeze = (amp = 1) => mixb(noise(.45, { lp: 6000, hp: 900, e: env.ad(.01, .12), amp }), voice([[0, .22, 1.6, 1]], HAN, { fall: .6, amp: amp * .6 }));
const step = (amp = 1) => noise(.07, { lp: 900, hp: 120, e: env.pluck(40), amp });
const bird = (f, amp = 1) => mixb(squeak(f, f * 1.4, .07, amp), squeak(f * 1.3, f * 1.1, .06, amp * .7));
const templeBell = (amp = 1) => bell(note(88), 2.8, { partials: [[1, 1], [2.4, .55], [3.9, .3], [5.6, .15]], k: 1.2, amp });
const murmur = (dur, amp = 1) => { const o = new Float32Array(Math.round((dur + 1) * SRr)); for (let k = 0; k * .45 < dur; k++) add(o, chatter(3, 140 + (k % 5) * 25, .14, amp * (.5 + .5 * ((k * 7) % 3) / 2), .3), k * .45); return o; };

// ---- A: the hook
T.at(0, pad(C0 + .2, [62, 69, 74], 1), .16, 0);
T.at(0, chord([74, 78, 81], 1.8, .7), .2, 0);
T.at(.15, voice([[0, .14, 1.3, .7], [.16, .14, 1.4, .7], [.32, .24, 1.5, .8]], HAN), .16, -.1);   // a chuckle
T.at(PAT - .05, mixb(click(.6), noise(.35, { lp: 3500, hp: 500, e: env.ad(.01, .12), amp: .6 })), .35, -.2);   // pat + puff
T.at(SNIFF, voice([[0, .25, 1.3, .3], [.35, .3, 1.5, .4]], HAN, { rise: .3 }), .2, 0);      // "ah… ah…"
T.at(SNEEZE, sneeze(1), .5, 0);
T.at(SNEEZE + .05, powderWhoosh(1.0, 1), .45, 0);

// ---- B: Sita's chamber
T.at(C0, powderWhoosh(.8, .6), .25, 0);
T.at(C0 + .2, tanpura(E0 - C0 - .4, 50, .6), .07, 0);
for (let k = 0; k < 9; k++) T.at(C0 + .6 + k * 1.3, bird(2600 + (k % 3) * 380, .5), .06, k % 2 ? .6 : -.5);
T.at(DAB1 - 1.0, mixb(click(.3), plink(note(88), .5)), .12, -.2);              // the box's lid
T.at(DAB1, chime(note(93), .8, 1.6), .22, -.1);                               // the dab
T.at(PEEK, squeak(700, 1200, .14, .8), .25, .5);                              // the peek
T.at(PEEK + .25, plink(note(84)), .2, .5);                                    // "?"
T.at(DAB2 - .3, crackle(.5, .3), .05, -.1);
for (let k = 0; k < 4; k++) T.at(STEP + k * .28, step(.7), .2, .4 - k * .1);
T.at(STEP + .2, chatter(7, HAN, .14, 1, .5), .2, .3);                        // "Maa, why the sindoor?"
T.at(TURN + .1, chatter(8, SITA, .13, 1, .6), .18, -.2);                     // "for Shri Ram's long life"
T.at(TURN + .4, chord([76, 79, 83], 1.8, .6), .14, 0);

// ---- C: the pinch, the idea
T.at(E0 - .3, whoosh(.6, 400, 2800), .25, 0);
T.at(E0, pad(F0 - E0, [64, 71], .9), .12, 0);
T.at(PINCH, mixb(squeak(900, 1300, .1, .6), plink(note(91), .6)), .2, .3);
T.at(PINCH + .7, voice([[0, .5, 1.0, .3]], HAN, { rise: .2 }), .14, 0);       // "hmm…"
T.at(IDEA, mixb(chime(note(96), 1, 1.2), plink(note(103))), .32, 0);           // the bulb
T.at(IDEA + .1, slide(.35, 400, 1400, .7), .2, 0);                            // the take
T.at(IDEA + 1.5, chatter(5, HAN * 1.1, .12, 1, .8), .18, .2);
T.at(F0 - .25, whoosh(.5, 600, 4500), .4, .6);                                // the whip

// ---- D: the storeroom
T.at(F0, noise(G0 - F0, { lp: 700, hp: 90, e: env.swell(.3, .4), amp: 1 }), .05, 0);   // room tone
for (const t0 of [POUR1, POUR2]) {
  T.at(t0 - .7, mixb(thud(.4), click(.4)), .25, 0);                          // the pot lifted
  T.at(t0 - .65, voice([[0, .2, 1.2, .6]], HAN, { rise: .3 }), .14, 0);       // "hup!"
  T.at(t0, powderWhoosh(1.1, 1), .5, 0);
  T.at(t0 + .05, noise(.9, { lp: 2500, hp: 400, e: env.swell(.05, .4), amp: .7 }), .25, 0);   // the sand-like pour
  T.at(t0 + .8, whoosh(.4, 900, 3000), .2, t0 === POUR1 ? -.7 : .7);        // the pot tossed
  T.at(t0 + 1.25, thud(.5), .15, t0 === POUR1 ? -.9 : .9);
}
T.at(SPIN - .1, whoosh(1.1, 300, 2600), .3, 0);
for (let k = 0; k < 6; k++) T.at(SPIN + k * .17, squeak(900 + k * 90, 700, .08, .4), .12, k % 2 ? .4 : -.4);
T.at(EMERGE, mixb(chord([72, 76, 79, 84], 1.6, 1), plink(note(96))), .3, 0);   // ta-da
T.at(EMERGE + .1, voice([[0, .18, 1.4, .8], [.2, .3, 1.6, .9]], HAN), .2, 0);
T.at(LOOK - .1, slide(.3, 1200, 500, .7), .2, .3);                            // uh-oh
T.at(DIP, powderWhoosh(.6, .7), .35, .5);
T.at(DIP + .6, mixb(shimmer(.8, [note(88), note(91), note(96)], .7, .06), plink(note(100))), .25, .5);

// ---- E: the court
T.at(G0, murmur(LAUGH - G0, 1), .1, 0);
T.at(G0, pad(I0 - G0, [57, 64, 69], .8), .08, 0);
for (let k = 0; k < 8; k++) T.at(G0 + .15 + k * .29, step(.8), .22, -.8 + k * .14);
T.at(STARE, mixb(slide(.25, 300, 900, .6), click(.5)), .25, 0);              // record-stop take
T.at(STARE + .1, noise(.6, { lp: 500, hp: 60, e: env.swell(.05, .3), amp: .3 }), .1, 0);   // silence settles
T.at(LAUGH, laughter(ASKR - LAUGH + .6, 1), .3, 0);
T.at(LAUGH + .1, voice([[0, .12, 1.1, .8], [.16, .12, 1.15, .8], [.32, .12, 1.2, .8], [.48, .12, 1.25, .8], [.64, .2, 1.3, .9]], 190), .2, -.4);   // Lakshman
T.at(LAUGH + .4, voice([[0, .12, 1, .7], [.18, .12, 1.05, .7], [.36, .2, 1.1, .7]], 130), .16, .6);
T.at(ASKR, chatter(8, RAM, .14, 1, .4), .22, 0);                            // "Hanuman, what is all this?"
T.at(BOWH - .2, mixb(chime(note(81), .7, 2), click(.2)), .16, 0);
T.at(BOWH + .2, chatter(10, HAN, .14, 1, .5), .2, -.2);
T.at(QUIET - .2, chatter(10, HAN, .13, 1, .55), .2, -.2);
T.at(QUIET, noise(.8, { lp: 300, hp: 40, e: env.swell(.1, .5), amp: .3 }), .1, 0);
T.at(RAMK, pad(I0 - RAMK + 1, [62, 66, 69, 74], 1), .16, 0);
T.at(RAMK + .3, plink(note(91), .6), .14, 0);                                // a tear

// ---- F: the hug
T.at(I0, murmur(J0 - I0, .5), .05, 0);
T.at(I0, pad(J0 - I0, [62, 69, 74, 78], 1), .14, 0);
for (let k = 0; k < 4; k++) T.at(I0 + .1 + k * .3, step(.6), .18, -.5 + k * .1);
T.at(HUG, mixb(chord([74, 78, 81, 86], 2.2, 1), noise(.3, { lp: 1500, hp: 200, e: env.hann(), amp: .4 })), .3, 0);
T.at(PART + .1, chatter(9, RAM, .14, 1, .45), .2, -.1);                     // the blessing
T.at(BLESS + .3, shimmer(1.2, [note(84), note(88), note(91), note(96), note(100)], .8, .08), .22, -.1);

// ---- G: the mandir at dusk
T.at(J0, templeBell(1), .35, .7);
T.at(J0 + 1.4, templeBell(.7), .2, -.7);
T.at(J0, crackle(K0 - J0, .5), .05, -.3);                                    // the diyas
T.at(J0, drone(K0 - J0, 65, .5), .1, 0);
T.at(J0 + 4.6, templeBell(.5), .15, .7);
T.at(DAB3 - .7, click(.3), .15, .5);                                         // finger in the katori
for (let k = 0; k < 5; k++) T.at(DAB3 + k * .35, noise(.25, { lp: 1800, hp: 300, e: env.hann(), amp: .5 }), .12, .3);   // the smear
T.at(DAB3 + .6, shimmer(.6, [note(96), note(100)], .5, .07), .12, .2);       // the oil glints
T.at(WINK, mixb(plink(note(96)), click(.6)), .35, 0);

// ---- H: the ask
T.at(K0 - .3, whoosh(.7, 400, 3000), .25, 0);
T.at(K0, pad(CARD - K0, [65, 69, 72], .9), .12, 0);
T.at(K0 + .2, voice([[0, .14, 1.3, .7], [.16, .14, 1.4, .7], [.32, .24, 1.5, .8]], HAN), .16, 0);
for (let k = 0; k < 4; k++) T.at(K0 + .3 + k * .65, drum(90, .6, .3), .1, 0);
T.at(KWINK, mixb(plink(note(96)), click(.6)), .35, 0);

// ---- I: the card
T.at(CARD - .3, whoosh(.7, 400, 3200), .3, 0);
T.at(CAP_T, chord([67, 71, 74, 79], 2.2, .7), .25, 0);
for (let k = 0; k < 3; k++) T.at(COVERS + k * .12, pop(.8, 1 + k * .15), .3, (k - 1) * .4);
T.at(PRICE, pop(.6, .9), .2, 0);
T.at(STRIKE, mixb(noise(.28, { lp: 4200, hp: 900, e: env.hann(), amp: .8 }), clang(note(88), .5)), .3, 0);
T.at(DEAD, plink(note(91)), .2, 0);
T.at(PILL, mixb(pop(1, 1.3), shimmer(.7, [note(91), note(95), note(98)], .6, .06)), .32, 0);
T.at(CARD, pad(END - CARD, [67, 71, 74], .7), .08, 0);

T.write('assets/sindoor_sfx.wav');
console.log('assets/sindoor_sfx.wav', END, 's');
