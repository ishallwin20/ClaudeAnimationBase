// ayy2_sfx.mjs: the sound for "A 12-year-old went for TIGER'S MILK" (src/scenes/ayy2.js, ad 103, Ayyappa Part 2, no
// voice) -> assets/ayy2_sfx.wav (then loudness-normalised to assets/ayy2_mix.wav).
// Times are the scene's constants (keep them in sync). Retro synth cartoon foley as in Part 1, his bell ("ting") as the
// thread, a friendly tiger (a purr and a small roar), and mild pads only under the tender beats.
import { track, tone, noise, bell, mixb, env, whoosh, plink, squeak, click, thud, shimmer, slide, chime, drum, note, seed, rnd, clamp, heart, chirp, wind, rumble, roar, SR } from './sfx.mjs';

const RING = 1.6, PURR = 2.7;
const B0 = 5.0, CRY = 7.4, C0 = 10.0, PART = 10.5, BRAH = 12.0, BGONE = 14.7;
const D0 = 15.4, SON = 18.2, E0 = 20.4, HATE = 22.9, F0 = 25.2, HEAL = 27.3, G0 = 30.0, GAR = 31.6;
const H0 = 34.6, NOD = 37.4, I0 = 39.0, VAID = 40.6, MILK = 41.6, J0 = 44.4, PROM = 46.0, LETGO = 47.7;
const K0 = 49.4, FLOP = 50.3, L0 = 54.4, M0 = 59.0, WILL = 61.4, N0 = 63.8, TIGIN = 65.2;
const O0 = 69.0, INDRA = 69.6, BACK = 71.2, CROWNS = 72.2, P0 = 74.6, WELL = 76.4, Q0 = 79.0, KNEEL = 80.2, R0 = 84.4, CARD = 89.4, END = 93.0;

const T = track(END);
seed(103);
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
const talk = (dur, f, { gap = .16, amp = 1, br = .5, fall = .1 } = {}) =>
  voice(Array.from({ length: Math.max(1, Math.floor(dur / gap)) }, (_, i) => [i * gap, gap * .72, 1 + .14 * Math.sin(i * 2.3) - (i % 5 === 4 ? .12 : 0), br]), f, { amp, fall });
const KID = 430, MHIF = 150, BRF = 120, MOHF = 330, SHVF = 140, ASF = 110;
const giggle = (f, amp = 1, n = 4) => voice(Array.from({ length: n }, (_, i) => [i * .11, .08, 1.25 - i * .04, .7]), f, { amp, fall: .2 });
const huh = (f, amp = 1) => voice([[0, .32, 1, .6]], f, { amp, rise: .9, fall: 0 });
const ooh = (f, amp = 1) => voice([[0, .3, 1.1, .5]], f, { amp, rise: .3, fall: 0 });
const cackle = (f, amp = 1, n = 6) => voice(Array.from({ length: n }, (_, i) => [i * .13, .1, 1.3 - (i % 2) * .15, .8]), f, { amp, fall: .1, shake: 1 });
const hmm = (f, amp = 1) => voice([[0, .5, 1, .2]], f, { amp, fall: 0, shake: .5 });
const pop = (f = 900, amp = 1) => mixb(squeak(f * .6, f * 1.6, .07, amp), plink(f * 1.5, amp * .5));
const boing = (amp = 1, f = 220) => tone(.35, t => f * (1 + 2.2 * t) * (1 + .18 * Math.sin(t * 2 * Math.PI * 18) * Math.exp(-t * 6)), { type: 'tri', e: env.pluck(6), amp });
const pad = (dur, ms, amp = 1, a = 1.2, r = 1.4) => mixb(...ms.map((m, i) => tone(dur, t => note(m) * (1 + .003 * Math.sin(t * 2 + i)), { type: 'tri', e: env.swell(a, r), amp: amp / ms.length })));
const hpop = (t0, pan = 0) => { for (let k = 0; k < 3; k++) T.at(t0 + k * .22, pop(800 + k * 120, .5), .07, pan); };
const step = (t0, n, gap = .22, pan = 0, amp = .5) => { for (let k = 0; k < n; k++) T.at(t0 + k * gap, mixb(click(amp), drum(60, amp * .6, .2)), .08, pan + k * .04); };
// HIS BELL: a small bright brass bell, with a second strike a hair later (it swings back)
const ting = (amp = 1) => mixb(bell(note(98), 1.4, { partials: [[1, 1], [2.4, .5], [4.1, .25], [6.3, .1]], k: 3, amp }), bell(note(98) * 1.002, 1.0, { partials: [[1, .5], [2.4, .25]], k: 4, amp: amp * .5 }));
const tingAt = (t0, gain = .14, pan = 0) => { T.at(t0, ting(1), gain, pan); T.at(t0 + .16, ting(.5), gain * .6, pan); };
const sparkle = (t0, gain = .08, pan = 0) => T.at(t0, shimmer(1.4, [note(91), note(95), note(98), note(103)], .7, .06), gain, pan);
const whooshOut = t0 => T.at(t0, whoosh(.5, 3000, 500), .11, 0);
const whooshIn = t0 => T.at(t0, whoosh(.5, 500, 3000), .11, 0);


const KINGF = 125, QUEENF = 300, MINF = 105, VAIF = 135, LADYF = 340, MANF = 150, INDF = 160;
const purr = (dur, amp = 1) => mixb(...Array.from({ length: Math.floor(dur / .09) }, (_, i) => noise(.09, { lp: 260, hp: 40, e: env.hann(), amp: amp * (.7 + .3 * Math.sin(i)) })).map((b, i) => { const o = new Float32Array(Math.round((i * .09) * SR) + b.length); o.set(b, Math.round(i * .09 * SR)); return o; }));
const wail = (f, amp = 1, n = 3) => voice(Array.from({ length: n }, (_, i) => [i * .42, .36, 1.2 - (i % 2) * .1, .8]), f, { amp, fall: .3 });
const sob = (f, amp = 1, n = 4) => voice(Array.from({ length: n }, (_, i) => [i * .2, .14, 1 + (i % 2) * .15, .6]), f, { amp, fall: .4, shake: 1 });
const ow = (f, amp = 1) => voice([[0, .25, 1.1, .6], [.4, .3, 1.0, .6]], f, { amp, fall: .3 });
const chuckle = (f, amp = 1) => voice(Array.from({ length: 4 }, (_, i) => [i * .12, .08, 1 - i * .03, .4]), f, { amp, fall: .1 });
const scream = (f, amp = 1) => voice([[0, .7, 1.6, .9]], f, { amp, rise: .3, fall: 0, shake: 1 });
const gasp = (f, amp = 1) => voice([[0, .18, 1.3, .9]], f, { amp, rise: .5, fall: 0 });

// ================= A · the hook =================
T.at(0, pad(B0, [62, 69, 74, 78], 1, .3, .8), .07, 0);
T.at(.15, chime(note(86), .5, 1.4), .07, 0);
for (let k = 0; k < 8; k++) T.at(.3 + k * .6, mixb(drum(90, .25, .1), noise(.05, { lp: 900, e: env.pluck(40), amp: .2 })), .05, .1);   // soft paws
T.at(RING - .45, squeak(500, 800, .1, .5), .05, 0);
tingAt(RING, .16, 0); sparkle(RING + .05, .07);
T.at(PURR, purr(1.0, 1), .16, .1); T.at(PURR + .2, giggle(KID, .9, 5), .1, -.1); hpop(PURR + .4, -.3);
whooshOut(B0 - .3);

// ================= B · the hunt =================
for (let t = B0; t < C0 + 5; t += .4) T.at(t, mixb(chirp(.5), squeak(2600, 3400, .07, .3)), .025, (rnd() - .5) * .8);   // the forest
T.at(B0, noise(C0 - B0 + 5, { hp: 300, lp: 1500, e: env.swell(1, 1), amp: .25 }), .04, .4);   // the river
step(B0 + .1, 9, .24, -.6, .4);
T.at(CRY - .2, wail(KID * 1.2, .8, 3), .09, .5);
T.at(CRY, mixb(pop(1000, .8), huh(KINGF, .7)), .1, -.2);

// ================= C · the baby; the old brahmin =================
T.at(C0, pad(D0 - C0, [62, 69, 74, 78], 1, .8, .6), .06, 0);
T.at(PART, noise(.6, { hp: 800, lp: 5000, e: env.hann(), amp: .7 }), .07, .2);   // the leaves
T.at(PART + .1, shimmer(1.6, [note(86), note(90), note(93), note(98)], .7, .08), .08, .2);
T.at(PART + .3, mixb(ooh(KINGF, .6), heart(.5)), .08, -.4);
tingAt(PART + 1.2, .14, .2); T.at(PART + 1.3, giggle(KID * 1.15, .9, 5), .1, .2); hpop(PART + 1.5, -.4);
T.at(BRAH, mixb(pop(700, .8), chime(note(81), .7, 2)), .1, .5);
T.at(BRAH + .5, talk(BGONE - BRAH - 1.7, 115, { gap: .21, br: .35 }), .08, .5);
T.at(BGONE, mixb(pop(800, 1), noise(.4, { hp: 800, lp: 6000, e: env.pluck(9), amp: .6 })), .11, .5);
sparkle(BGONE + .05, .09, .5);
whooshIn(D0 - .3);

// ================= D · raised as their own =================
T.at(D0, pad(E0 - D0 + .2, [64, 71, 76, 79], 1, .5, .6), .07, 0);
for (let k = 0; k < 3; k++) T.at(D0 + .3 + k * 1.2, giggle(KID, .7, 4), .08, 0);
hpop(D0 + .6, 0); tingAt(D0 + .8, .1, 0);
T.at(SON, mixb(pop(1100, .9), chime(note(93), .6, 1.6)), .1, .5);
T.at(SON + .3, giggle(KID * 1.4, .7, 4), .08, .5);

// ================= E · crown prince; one man hated that =================
T.at(E0, pad(HATE - E0, [62, 69, 74, 78], 1, .4, .4), .06, 0);
T.at(E0 + .3, talk(1.9, KINGF, { gap: .2, br: .45 }), .09, -.4);
T.at(E0 + 1.2, mixb(chime(note(93), .9, 2), shimmer(1.4, [note(86), note(90), note(93), note(98)], .7, .06)), .1, 0);
T.at(E0 + 1.4, giggle(KID, .8, 4), .08, 0);
T.at(HATE, mixb(slide(.5, 400, 120, .7), drum(55, .8, .5)), .12, .5);
T.at(HATE + .1, hmm(MINF * .9, .9), .1, .5);
T.at(HATE + .6, pad(F0 - HATE - .4, [41, 48, 51], 1, .3, .5), .07, 0);

// ================= F · black magic; the sadhu heals him =================
T.at(F0, pad(HEAL - F0, [41, 48, 51, 56], 1, .5, .5), .07, 0);
T.at(F0 + .3, sob(KID, .5, 4), .06, -.3);
step(F0 + .3, 7, .2, .5, .35);
T.at(HEAL - .4, mixb(click(.5), noise(.25, { hp: 2000, lp: 8000, e: env.hann(), amp: .4 })), .06, 0);   // the ash
T.at(HEAL, mixb(chime(note(93), 1, 2.2), shimmer(1.8, [note(86), note(90), note(93), note(98), note(102)], .8, .06)), .12, -.2);
T.at(HEAL + .3, pad(G0 - HEAL, [62, 69, 74, 78], 1, .3, .4), .06, 0);
T.at(HEAL + .4, giggle(KID, 1, 5), .1, -.3); hpop(HEAL + .6, -.3);

// ================= G · poison; Garuda =================
T.at(G0, chuckle(MINF, .8), .08, .4);
for (let k = 0; k < 5; k++) T.at(G0 + .6 + k * .17, noise(.1, { hp: 1500, lp: 5000, e: env.hann(), amp: .4 }), .04, .4);   // rubbing hands
T.at(GAR - .2, mixb(whoosh(1.6, 600, 3000, .9), slide(1.2, 500, 1400, .3)), .11, -.6);
T.at(GAR + .2, squeak(1800, 2600, .25, .6), .08, -.2);   // Garuda's cry
for (let k = 0; k < 5; k++) T.at(GAR + .6 + k * .14, plink(note(93 + k * 2), .7), .06, 0);   // the amrit drops
T.at(GAR + .8, mixb(chime(note(98), .8, 2), shimmer(1.4, [note(91), note(95), note(98)], .7, .06)), .1, -.2);
for (let k = 0; k < 6; k++) T.at(GAR + 1.5 + k * .22, mixb(click(.4), squeak(500, 420, .06, .3)), .05, -.3);   // chewing
T.at(GAR + 1.4, mixb(pop(1200, .9), gasp(MINF * 1.6, .9)), .1, .5);
whooshOut(H0 - .3);

// ================= H · plan 3 =================
for (let t = H0; t < I0; t += .35) T.at(t, tone(.06, 4200 + 300 * rnd(), { e: env.hann(), amp: .4 }), .025, (rnd() - .5));   // crickets
T.at(H0, pad(I0 - H0, [45, 52, 55, 60], 1, .6, .4), .06, 0);
T.at(H0 + .3, mixb(talk(NOD - H0 - .5, MINF, { gap: .18, br: .3 }), sob(MINF, .3, 6)), .08, -.4);
T.at(NOD, hmm(QUEENF, .7), .08, .4);
whooshIn(I0 - .3);

// ================= I · the headache; tiger's milk =================
T.at(I0 + .1, ow(QUEENF, .9), .1, -.6); T.at(I0 + 2.4, ow(QUEENF, .9), .1, -.6);
T.at(I0 + 1.5, mixb(plink(note(93), .8), squeak(1200, 1800, .08, .5)), .07, -.6);   // her peek
T.at(VAID, talk(1.4, VAIF, { gap: .2, br: .35 }), .09, .5);
T.at(MILK, mixb(pop(900, .9), plink(note(86), .6)), .1, .4);
T.at(MILK + .3, roar(.5, 150, 4, .6), .07, .4);
T.at(MILK + .3, mixb(gasp(KINGF * 1.5, .8), drum(60, .5, .3)), .09, 0);

// ================= J · "I'll go"; the promise =================
T.at(J0 + .2, talk(1.0, KID, { gap: .15, br: .6 }), .09, .4);
T.at(J0 + 1.4, talk(1.4, KINGF, { gap: .2, br: .4 }), .08, -.3);
T.at(PROM, mixb(shimmer(1.6, [note(81), note(86), note(88), note(93)], .6, .1), slide(1.4, 300, 600, .3)), .09, 0);   // his maya
T.at(PROM + .3, voice([[0, .3, 1, .5], [.35, .3, 1.1, .5]], KINGF * 1.2, { amp: .6, fall: 0, shake: .5 }), .07, -.3);   // dreamy "yes, yes"
T.at(LETGO - .3, talk(.6, KID, { gap: .15, br: .6 }), .08, .4);
T.at(LETGO + .4, mixb(pop(1100, .9), gasp(KINGF * 1.4, 1)), .11, -.3);

// ================= K · "you have become Ram, I Dasharatha!" =================
T.at(K0, mixb(scream(KINGF * 1.3, .8)), .09, -.2);
T.at(FLOP, mixb(thud(1), drum(50, .6, .4)), .13, -.2);
T.at(FLOP + .3, wail(KINGF * 1.4, .8, 6), .08, -.2);
T.at(K0 + 1.2, pad(L0 - K0 - 1, [57, 60, 64], 1, .5, .6), .05, 0);

// ================= L · he leaves, alone =================
whooshIn(L0 - .3);
T.at(L0, pad(M0 - L0, [57, 64, 69, 72], 1, .6, .4), .06, 0);
T.at(L0, wind(N0 - L0, 1, .8), .03, 0);
step(L0 + .4, 18, .24, .3, .35);
T.at(L0 + .8, sob(KINGF, .4, 3), .05, -.6);
T.at(L0 + 1.0, chime(note(81), .5, 2), .05, 0);

// ================= M · "bring us tiger cubs!" "I will." =================
T.at(M0 + .2, mixb(giggle(LADYF, .9, 7), giggle(LADYF * 1.15, .8, 6)), .1, -.5);
T.at(M0 + .8, talk(1.3, LADYF, { gap: .15, br: .7 }), .07, -.5);
T.at(WILL - .2, talk(.6, KID, { gap: .15, br: .6 }), .09, .4);
T.at(WILL + .1, mixb(plink(note(98), .8), shimmer(1.2, [note(93), note(98), note(102)], .6, .06)), .08, .4);
whooshIn(N0 - .3);

// ================= N · Pandalam runs; he is back on a tiger =================
for (let k = 0; k < 3; k++) T.at(N0 + .1 + k * .45, scream(k === 1 ? LADYF : MANF * 1.6, .8), .08, .6 - k * .5);
step(N0, 14, .12, 0, .4);
T.at(TIGIN - .3, roar(1.4, 110, 7, 1), .14, .6);
T.at(TIGIN, rumble(2.6, .8), .06, .3);
for (let k = 0; k < 10; k++) T.at(TIGIN + k * .3, mixb(drum(80, .4, .15), noise(.06, { lp: 900, e: env.pluck(40), amp: .3 })), .06, .5 - k * .06);   // paws
T.at(TIGIN + 2.8, ting(1), .12, 0);
T.at(TIGIN + 3.0, giggle(KID, .8, 4), .08, 0);

// ================= O · the tiger was Indra =================
T.at(INDRA, mixb(pop(800, 1), noise(.4, { hp: 800, lp: 6000, e: env.pluck(9), amp: .6 }), chime(note(86), .6, 1.6)), .12, -.2);
T.at(INDRA + .4, chuckle(INDF, .8), .09, -.1);
T.at(INDRA + .4, giggle(KID, .8, 4), .07, -.5);
T.at(BACK, mixb(pop(900, 1), noise(.4, { hp: 800, lp: 6000, e: env.pluck(9), amp: .6 })), .12, -.2);
T.at(BACK + .2, purr(.8, 1), .12, -.2);
for (let k = 0; k < 5; k++) T.at(CROWNS + k * .18, mixb(pop(900 + k * 120, .8), plink(note(86 + k * 2), .5)), .09, .2 + k * .1);
T.at(CROWNS + .2, shimmer(2, [note(86), note(90), note(93), note(98), note(102)], .8, .07), .09, .3);
T.at(O0, pad(P0 - O0, [62, 69, 74, 78], 1, .5, .5), .06, 0);

// ================= P · the headache was gone =================
whooshIn(P0 - .3);
T.at(P0 + .3, mixb(pop(1100, .8), gasp(QUEENF, .8)), .09, -.5);
T.at(WELL, mixb(voice(Array.from({ length: 4 }, (_, i) => [i * .13, .09, 1.1 - i * .05, .6]), QUEENF, { amp: .8, fall: .1 }), squeak(900, 700, .15, .3)), .09, -.5);   // a sheepish "ehehe"
T.at(WELL + .5, mixb(boing(.5, 260), plink(note(81), .5)), .07, -.4);
T.at(WELL + 1.0, purr(.8, .8), .08, .4);

// ================= Q · "who are you, really?" =================
T.at(Q0, pad(R0 - Q0, [62, 69, 74, 78, 81], 1, 1.2, 1.0), .09, 0);
T.at(Q0 + .1, shimmer(2.4, [note(86), note(93), note(98), note(105)], .6, .2), .07, 0);
T.at(KNEEL, mixb(noise(.3, { hp: 300, lp: 2000, e: env.hann(), amp: .4 }), heart(.6)), .07, -.3);
tingAt(Q0 + 3.6, .14, .3);

// ================= R · the ask =================
whooshIn(R0 - .3);
T.at(R0, pad(CARD - R0, [62, 69, 74, 78], 1, .4, .8), .07, 0);
tingAt(R0 + 1.0, .15, 0); sparkle(R0 + 1.05, .06);
T.at(R0 + 1.7, giggle(KID, .8, 4), .08, -.2);
T.at(R0 + 2.2, purr(.8, .8), .1, .2);
tingAt(R0 + 2.8, .15, 0);
T.at(R0 + 3.2, squeak(900, 1400, .18, .5), .06, -.6);   // the cub mews

// ================= the card =================
T.at(CARD, pad(END - CARD, [62, 69, 74, 78, 81], 1, .3, .6), .08, 0);
T.at(CARD + .1, chime(note(86), .8, 2), .09, 0);
for (let i = 0; i < 7; i++) T.at(CARD + .1 + i * .1, plink(note(81 + i * 2), .5), .05, -.6 + i * .2);
T.at(CARD + 1.6, pop(900, .8), .08, 0);

T.write('assets/ayy2_sfx.wav');
