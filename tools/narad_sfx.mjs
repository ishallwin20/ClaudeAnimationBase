// narad_sfx.mjs: the sound effects for ad 22, "Narad Muni thought he looked like VISHNU" (src/scenes/narad.js)
// → assets/narad_sfx.wav. Times are the scene's constants (keep them in sync). Every shot sits on its own bed (no
// silent stretches: the owner's note on ad 21), with foley on the holds. Signatures: Narada's veena (a plucked,
// buzzing string), the monkey's "ooh-ooh", Kama's twang and the arrows' PING off the guard, the bee, Shiva's finger
// wag, the ZOOM, the tree of pride's sprouting bloops, the city's rise, the heartbeats, the POOF, the swayamvara's
// boings, the SCREAM, the curse's thunder, the vision's conch, the illusion's falling shimmer.
import { track, tone, noise, bell, mixb, env, whoosh, rumble, plink, clang, click, thud, crunch, shimmer, slide, squeak, chirp, laughter, chime, note, seed, rnd, clamp, lerp, SR, drone, thunder, wingbeat, wind, crackle, conch, screech, om, buzz, splash, wah } from './sfx.mjs';

const B0 = 3.6, D0 = 7.6, E0 = 16.9, F0 = 26.2, G0 = 32.4, P0 = 38.6, H0 = 44.8, I0 = 54.1, J0 = 66.5, K0 = 75.8, M0 = 85.1, N0 = 91.3, CARD = 95.1, END = 102.1;
const PREEN = 1.0, TING = 2.0, VIS = 3.9, RAMV = 4.3, DEERV = 4.9, VANV = 5.5;
const KAMA_IN = 7.9, LAND = 8.9, BLOOM = 8.6, AIM = 10.4, SHOTS = [10.9, 11.6, 12.3], BEE = 12.8, GUARD = 13.8, GIVEUP = 14.9, BOWK = 15.4, NOPEN = 15.9;
const WAG = 20.3, NOD = 22.6, ZOOM = 23.2, PALM = 24.0;
const MIME = 26.4, FLEX = 27.3, SPROUT = 27.6, NOTICE = 27.9, WINK = 29.9, SPARK = 30.6;
const CITY = 32.9, PRIN = 35.4, HEARTS = 36.6, LINES = 39.0, SWOON = 42.4;
const VIN = 45.3, WINK2 = 48.6, POOF = 51.3, PREEN2 = 52.3, TING2 = 52.9, VOUT = 53.4;
const GIG = 54.4, PIN = 59.4, SEES = 60.6, POPS = [61.1, 61.8, 62.5], KING = 63.4, GARL = 64.4, JAW = 65.2;
const LOOK = 67.8, REFLECT = 68.2, SCREAM = 68.8, WIDE2 = 69.7, CURSEG = 70.0, DEMON = 70.4, FLEE = 71.3, FACEBACK = 73.0, STEAM = 73.8;
const CURSE = 76.2, RAM_V = 76.6, SITA_V = 77.6, VAN_V = 79.3, ACCEPT = 82.3, VANISH = 83.4;
const FALL = 85.4, BLESS = 86.4, LOOKUP = 87.4, DROP = 88.6;
const CAP_T = CARD + .1, COVERS = CARD + .4, PRICE = CARD + 1.2, STRIKE = CARD + 1.7, DEAD = CARD + 2.2, PILL = CARD + 2.7, SUB = CARD + 3.2, FOLLOW = CARD + 3.7;

const T = track(END);
seed(22);
const add = (o, b, s0, g = 1) => { const s = Math.round(s0 * SR); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j] * g; return o; };
const ting = (m, amp = 1) => bell(note(m), 1.4, { amp });
const pop = (amp = 1, f = 1) => mixb(click(amp), tone(.08, t => f * (500 + 2600 * t / .08), { e: env.pluck(40), amp: amp * .7 }));
const boing = (amp = 1, f = 1) => tone(.45, t => f * (300 + 500 * Math.sin(Math.PI * clamp(t / .3))) * (1 + .08 * Math.sin(t * 2 * Math.PI * 22)), { type: 'tri', e: env.ad(.005, .15), amp });
const rise = (dur, amp = 1) => tone(dur, t => 500 * Math.pow(5, t / dur), { type: 'tri', e: env.swell(.02, .2), fm: t => .01 * Math.sin(t * 2 * Math.PI * 9), amp });
const step = (amp = 1) => mixb(noise(.06, { hp: 200, lp: 1800, e: env.pluck(60), amp }), tone(.06, 160, { e: env.pluck(50), amp: amp * .5 }));
const hmm = (f0, f1, dur, amp = 1) => tone(dur, t => lerp(f0, f1, t / dur), { type: 'saw', e: env.hann(), fm: t => .004 * Math.sin(t * 2 * Math.PI * 6), amp: amp * .5 });
const murmur = (dur, amp = 1) => { const b = noise(dur, { hp: 220, lp: 1100, e: env.swell(.6, .6), amp }); for (let i = 0; i < b.length; i++) { const t = i / SR; b[i] *= .45 + .55 * Math.abs(Math.sin(t * 2 * Math.PI * (2.3 + .7 * Math.sin(t * .9))) * Math.sin(t * 2 * Math.PI * (3.1 + Math.sin(t * .6)))); } return b; };
const room = (dur, amp = 1) => noise(dur, { brown: true, lp: 500, e: env.swell(.3, .3), amp });
const drip = (amp = 1) => tone(.12, t => 900 + 1400 * t / .12, { e: env.pluck(30), amp });
const gulp = (amp = 1) => mixb(tone(.18, t => 260 - 600 * t, { e: env.hann(), amp }), click(amp * .3));
const heart = (amp = 1) => { const o = new Float32Array(Math.round(.6 * SR)); add(o, thud(amp), 0); add(o, thud(amp * .7), .2); return o; };
const tweet = (amp = 1) => tone(.16, t => 2800 + 900 * Math.sin(t * 2 * Math.PI * 14), { e: env.hann(), amp });
const tabla = (f, amp = 1) => mixb(tone(.22, t => f * (1 + .25 * Math.exp(-t * 30)), { e: env.pluck(14), amp }), noise(.04, { hp: 1500, lp: 5000, e: env.pluck(80), amp: amp * .3 }));
const stream = (dur, amp = 1) => { const b = noise(dur, { hp: 500, lp: 3000, e: env.swell(.6, .6), amp }); for (let i = 0; i < b.length; i++) { const t = i / SR; b[i] *= .6 + .4 * Math.sin(t * 2 * Math.PI * (.7 + .3 * Math.sin(t * 1.3))); } return b; };
const waves = (dur, amp = 1) => { const b = noise(dur, { brown: true, lp: 900, e: env.swell(.8, .8), amp }); for (let i = 0; i < b.length; i++) { const t = i / SR; b[i] *= .3 + .7 * Math.pow(.5 + .5 * Math.sin(t * 2 * Math.PI * .28), 2); } return b; };
// the veena: a plucked string (Karplus-Strong) with a little jawari buzz
const veena = (m, amp = 1, dur = 1.6) => {
  const f = note(m), n = Math.round(SR / f), b = new Float32Array(Math.round(dur * SR)), ring = new Float32Array(n);
  for (let i = 0; i < n; i++) ring[i] = rnd() * 2 - 1;
  let p = 0;
  for (let i = 0; i < b.length; i++) { const a = ring[p], c = ring[(p + 1) % n]; ring[p] = (a + c) * .4985; const v = a; b[i] = (v + .25 * Math.tanh(v * 6)) * amp * clamp(1 - i / b.length * .3); p = (p + 1) % n; }
  return b;
};
const strum = (base, amp = 1) => { const o = new Float32Array(Math.round(1.8 * SR)); [0, 7, 12, 19].forEach((d, i) => add(o, veena(base + d, amp * (1 - i * .15)), i * .03)); return o; };
const melody = (t0, notes, gap, amp = .35, pan = 0) => notes.forEach((m, i) => m && T.at(t0 + i * gap, veena(m, 1, 1.2), amp, pan));
const twang = (amp = 1) => mixb(tone(.4, t => 220 - 120 * t, { type: 'saw', e: env.pluck(9), amp: amp * .5 }), tone(.4, t => 440 - 200 * t, { e: env.pluck(12), amp: amp * .4 }));
const ooh = (amp = 1, f = 1) => { const o = new Float32Array(Math.round(.9 * SR)); [[0, 420, 620], [.22, 440, 660], [.48, 700, 900], [.62, 720, 940]].forEach(([s, a, b2]) => add(o, tone(.17, t => f * lerp(a, b2, t / .17), { type: 'tri', e: env.hann(), fm: t => .01 * Math.sin(t * 2 * Math.PI * 30), amp }), s)); return o; };
const scream = (amp = 1) => mixb(tone(1.1, t => 700 + 500 * Math.sin(Math.min(1, t * 3) * Math.PI / 2) + 60 * Math.sin(t * 2 * Math.PI * 9), { type: 'saw', e: env.swell(.03, .3), amp: amp * .4 }), noise(1.1, { hp: 1200, lp: 4500, e: env.swell(.03, .3), amp: amp * .3 }));
const kettle = (dur, amp = 1) => mixb(tone(dur, t => 2200 + 300 * Math.min(1, t * 2) + 40 * Math.sin(t * 2 * Math.PI * 7), { e: env.swell(.25, .2), amp: amp * .4 }), noise(dur, { hp: 3000, lp: 9000, e: env.swell(.1, .2), amp: amp * .3 }));
const slap = (amp = 1) => mixb(noise(.08, { hp: 600, lp: 5000, e: env.pluck(50), amp }), thud(amp * .4));
const zip = (amp = 1) => tone(.35, t => 400 * Math.pow(8, t / .35), { type: 'tri', e: env.ad(.01, .2), amp });

// ==== A · the hook: a sparkly rose bed, the preen's swish, the tooth TING, a smug "ooh-ooh"
T.at(0, shimmer(1.6, [84, 88, 91].map(note), .3), .14);
T.at(0, strum(50, .5), .22, -.3);
T.at(.3, ooh(.7, 1), .3);
for (let i = 0; i < 6; i++) T.at(.2 + i * .55, tabla(i % 3 === 2 ? 180 : 300, .6), .16, .1);
T.at(PREEN - .2, whoosh(.35, 900, 3000), .3, .3);
T.at(TING, ting(96, .9), .45, .2); T.at(TING + .05, ting(101, .6), .3, .2);
T.at(TING + .7, veena(62, 1), .25, -.3); T.at(TING + .95, veena(66, 1), .22, -.3);
T.at(B0 - .25, whoosh(.35, 600, 4000), .45);
// ==== B · the vision: a deep boom, a conch, a pop for each silhouette
T.at(B0, drone(D0 - B0, note(36), .6), .3);
T.at(VIS, thunder(1.4, .5), .35); T.at(VIS + .1, conch(2.2, 233, .6), .25);
T.at(RAMV, plink(note(67)), .3, -.3); T.at(RAMV + .05, twang(.6), .25, -.3);
T.at(DEERV, plink(note(74)), .3, .3); for (let i = 0; i < 4; i++) T.at(DEERV + .1 + i * .12, click(.6), .2, .3);
for (let i = 0; i < 4; i++) T.at(VANV + i * .1, ooh(.4, 1.3 + i * .1), .12, -.4 + i * .25);
T.at(D0 - .3, whoosh(.6, 400, 2400), .35);
// ==== D · the cave: the Ganga, birds, an om for the tapas; Kama's arrival, spring, three twangs and PINGs, the bee
T.at(D0, stream(E0 - D0, .8), .16, .5);
T.at(D0, om(E0 - D0, 110, .6), .12);
seed(31); for (let i = 0; i < 12; i++) T.at(D0 + .3 + i * .7 + rnd() * .2, tweet(.6), .1, rnd() * 1.6 - .8);
T.at(D0 + .2, squeak(700, 500, .3, .5), .2, .7);   // Indra's nervous "eep"
for (let i = 0; i < 4; i++) T.at(KAMA_IN + i * .25, wingbeat(.8), .35, .8 - i * .1);
T.at(KAMA_IN + .5, chirp(1), .3, .6); T.at(LAND, chirp(.8), .25, .4); T.at(LAND, thud(.4), .2, .4);
for (let i = 0; i < 10; i++) T.at(BLOOM + i * .15, plink(note(79 + (i * 5) % 12), .7), .2, -.5 + (i % 5) * .25);
T.at(BLOOM + .2, shimmer(1.4, [79, 83, 86, 91, 95].map(note), .5), .2);
T.at(AIM, squeak(300, 500, .25, .5), .18, .5);
SHOTS.forEach((s, i) => { T.at(s - .45, squeak(200, 260, .4, .4), .15, .5); T.at(s, twang(1), .4, .5); T.at(s + .02, whoosh(.25, 1200, 4000), .3, .2); T.at(s + .25, ting(100 - i * 2, .9), .45, -.4); T.at(s + .25, plink(note(96), .6), .25, -.4); });
T.at(BEE, buzz(GIVEUP + .8 - BEE, 230, 260, 1), .2, -.1);
T.at(GUARD, shimmer(1.6, [72, 79, 84, 88, 91].map(note), .7), .4, -.3); T.at(GUARD + .1, chime(note(72), .7, 2.5), .35, -.3);
T.at(GUARD + .2, tone(1, t => 300 + 80 * Math.sin(t * 30), { type: 'tri', e: env.swell(.2, .3), amp: .5 }), .12, -.3);   // the chakra's whir
T.at(GIVEUP, slide(.8, 500, 180, .6), .3, .5); T.at(GIVEUP + .45, thud(.6), .3, .4); T.at(GIVEUP + .45, clang(note(70), .4), .15, .4);
T.at(BOWK, hmm(260, 200, .5), .3, .5);
T.at(NOPEN, chime(note(76), .6, 2), .35, -.3); T.at(NOPEN + .3, shimmer(1, [84, 88, 91].map(note), .4), .25, -.3);
T.at(E0 - .25, whoosh(.35, 800, 5000), .4);
// ==== E · Kailash: wind; he sails in strumming; Shiva's wag (tick-tock), nods (boings), ZOOM, the facepalm
T.at(E0, wind(F0 - E0, 0, 1), .38);
melody(E0 + 3.6, [74, 0, 71, 69, 0, 66, 69, 0, 62], .3, .16, .4);
for (let i = 0; i < 4; i++) T.at(WAG + 1.6 + i * .3, hmm(220, 250, .2, .6), .18, .4);   // "mm-hm, mm-hm"
T.at(PALM + 1.4, wind(1.6, 2, .4), .3);
T.at(E0 + .1, whoosh(1.4, 300, 1400), .3, -.6);
melody(E0 + .4, [62, 66, 69, 74, 69, 66, 69, 74, 78, 74], .3, .28, .4);
T.at(WAG - .3, hmm(160, 230, .4), .45, -.4);
for (let i = 0; i < 6; i++) T.at(WAG + .05 + i * .22, click(.8), .3, -.3);
T.at(WAG + .6, hmm(230, 180, .5), .3, -.4);
for (let i = 0; i < 5; i++) T.at(NOD + i * .1, boing(.4, 1.6), .14, .4);
T.at(ZOOM, zip(.9), .45, .5); T.at(ZOOM + .05, whoosh(.5, 600, 6000), .5, .8);
T.at(ZOOM + .1, noise(.4, { hp: 300, lp: 2500, e: env.hann(), amp: .7 }), .25, .3);
T.at(PALM, slap(1), .5, -.4); T.at(PALM + .3, hmm(200, 150, .9, .8), .3, -.4);
T.at(PALM + .6, drip(.7), .2, -.4); T.at(PALM + 1.1, drip(.6), .2, -.4);
T.at(F0 - .25, whoosh(.35, 800, 5000), .4);
// ==== F · the milk ocean: waves; the brag (a mimed twang, a flex squeak); the sprout's bloops; the wink; the plan
T.at(F0, waves(G0 - F0, .9), .3);
T.at(F0 + .1, shimmer(1.2, [76, 81, 84].map(note), .3), .14);
T.at(MIME, twang(.6), .25, -.4); T.at(MIME + .3, whoosh(.2, 1500, 4000), .15, -.2);
T.at(FLEX, squeak(500, 900, .2, .7), .3, -.4); T.at(FLEX + .25, squeak(900, 700, .15, .5), .2, -.4);
for (let i = 0; i < 4; i++) T.at(SPROUT + i * .3, tone(.18, t => (300 + i * 120) * (1 + 3 * t), { type: 'tri', e: env.hann(), amp: .7 }), .3, -.4);
T.at(NOTICE, plink(note(91)), .25, .5);
T.at(WINK, ting(98, .8), .4, .5); T.at(WINK + .05, slide(.5, 600, 1400, .5), .2, .5);
T.at(SPARK, shimmer(1.2, [84, 88, 91, 96, 100].map(note), .6), .35, .5);
T.at(SPARK + .1, rise(1, .5), .15, .4);
T.at(G0 - .25, whoosh(.3, 1000, 6000), .35);
// ==== G · the city rises: a rumble, a conch fanfare, sparkles; the princess's anklets; hearts
T.at(G0, wind(P0 - G0, 2, .8), .12);
T.at(G0 + .2, whoosh(1.4, 300, 1200), .2, -.6);
T.at(CITY, rumble(1.6, .6), .3); T.at(CITY + .3, shimmer(1.6, [72, 76, 79, 84, 88].map(note), .6), .35);
T.at(CITY + 1.2, conch(1.6, 311, .6), .25); T.at(CITY + 1.3, conch(1.4, 415, .4), .15);
for (let i = 0; i < 8; i++) T.at(PRIN + .1 + i * .14, plink(note(88 + (i % 3) * 3), .4), .12, .6);
T.at(HEARTS - .2, gulp(.8), .3, -.3);
T.at(HEARTS, boing(.8, 1.2), .4, -.3); T.at(HEARTS + .1, chime(note(84), .5, 2), .3, -.3);
for (let i = 0; i < 4; i++) T.at(HEARTS + .4 + i * .4, heart(.7), .3, -.3);
// ==== P · the palm: palace room tone, the lines glow (a rising shimmer), a racing heart, the swoon
T.at(P0, room(H0 - P0, .9), .06);
T.at(P0 + .1, chime(note(79), .4, 2.5), .2);
T.at(LINES, shimmer(1.4, [72, 76, 79, 83, 86, 91].map(note), .6), .4); T.at(LINES + .2, rise(1.2, .5), .2);
for (let i = 0; i < 9; i++) T.at(LINES + 1 + i * .3, heart(.6 + i * .03), .26, -.2);
T.at(SWOON, slide(1, 1400, 400, .6), .3, -.2);
for (let i = 0; i < 5; i++) T.at(SWOON + .3 + i * .2, ting(91 + i * 2, .4), .14, -.3 + i * .15);
T.at(H0 - .3, whoosh(.6, 400, 2400), .35);
// ==== H · the begging hums; Vishnu pops in; the wink; POOF; the monkey loves his face
T.at(H0, wind(I0 - H0, 3, .8), .25);
seed(52); for (let i = 0; i < 10; i++) T.at(H0 + .2 + i * .6 + rnd() * .2, tweet(.5), .1, rnd() * 1.6 - .8);
for (let i = 0; i < 8; i++) T.at(H0 + 2.8 + i * .25, veena(62 + (i % 2) * 2, .9, .6), .12, -.4);   // a nervous tremolo
T.at(WINK2 + .6, laughter(1, .4), .15, .4);
T.at(WINK2 + 1.2, rise(1.6, .4), .14, -.2);
for (let i = 0; i < 4; i++) T.at(H0 + .3 + i * .6, hmm(240 + i * 20, 300 + i * 20, .4, .7), .25, -.4);
T.at(VIN, pop(1, 1.2), .5, .4); T.at(VIN + .05, chime(note(84), .7, 2.5), .4, .4); T.at(VIN + .1, shimmer(1, [88, 91, 96].map(note), .5), .3, .4);
T.at(WINK2, ting(98, .8), .4, .4); T.at(WINK2 + .05, slide(.5, 600, 1400, .5), .2, .4);
T.at(POOF - .4, rise(.4, .4), .15, -.4);
T.at(POOF, pop(1, .8), .6, -.4); T.at(POOF, noise(.5, { hp: 300, lp: 3000, e: env.ad(.005, .15), amp: 1 }), .35, -.4);
T.at(POOF + .5, ooh(.9, 1), .4, -.4);
for (let i = 0; i < 3; i++) T.at(POOF + .5 + i * .15, squeak(600, 800, .1, .5), .12, -.4);   // patting his cheeks
T.at(PREEN2, whoosh(.35, 900, 3000), .3, -.3);
T.at(TING2, ting(96, .9), .45, -.3); T.at(TING2 + .05, ting(101, .6), .3, -.3);
T.at(VOUT, pop(.7, 1.4), .3, .4);
T.at(I0 - .3, whoosh(.6, 400, 2400), .35);
// ==== I · the swayamvara: a murmur; the ganas giggle; a shehnai-ish entrance; "hmph"; three boings; the king's fanfare
T.at(I0, murmur(J0 - I0, .7), .5);
T.at(I0 + 2.6, laughter(2.6, .6), .25, -.6);
T.at(57.3, ting(91, .7), .3); T.at(57.9, ooh(1, 1), .45, -.2); T.at(58.7, ooh(.8, 1.15), .35, -.2);   // "...but also MONKEY!"
for (let i = 0; i < 6; i++) T.at(57.9 + i * .25, laughter(.3, .8), .2, -.6);
T.at(GIG, laughter(2.4, .7), .3, -.6); T.at(GIG + 2.8, laughter(1.6, .6), .25, -.6);
for (let i = 0; i < 5; i++) T.at(GIG + .2 + i * .3, tone(.12, t => 900 + 300 * Math.sin(t * 60), { type: 'tri', e: env.hann(), amp: .5 }), .12, -.6);   // tee-hee
{ const mel = [74, 76, 78, 81, 78, 76, 74, 71]; mel.forEach((m, i) => T.at(PIN + .1 + i * .28, wah(note(m), .3, .6), .14, .5)); }
for (let i = 0; i < 6; i++) T.at(PIN + .1 + i * .2, plink(note(88 + (i % 2) * 3), .3), .1, .5);
T.at(SEES + .1, hmm(330, 200, .35), .35, .4);
POPS.forEach((p, i) => { T.at(p, boing(1, 1 + i * .25), .45, -.2); T.at(p + .02, squeak(500 + i * 200, 900 + i * 300, .15, .5), .2, -.2); T.at(p + .3, hmm(330, 210, .3, .6), .2, .4); });
T.at(KING, conch(1.6, 311, .7), .3, .6); T.at(KING + .1, shimmer(1.4, [76, 80, 83, 88, 92].map(note), .6), .35, .6);
T.at(GARL, chime(note(84), .7, 2.5), .4, .5); T.at(GARL + .1, chime(note(91), .5, 2.5), .3, .5);
T.at(GARL + .3, murmur(1.4, 1), .35); for (let i = 0; i < 6; i++) T.at(GARL + .3 + i * .15, plink(note(84 + i * 2), .4), .12, .6);   // flowers and cheers
T.at(JAW, slide(.35, 1200, 200, .8), .4, -.2); T.at(JAW + .1, noise(.6, { hp: 400, lp: 2200, e: env.swell(.05, .4), amp: .8 }), .25, -.2);
T.at(J0 - .25, whoosh(.35, 800, 5000), .4);
// ==== J · the garden: birds; laughter; the reflection; the SCREAM; the curse; POOF demons; they flee; his face back; steam
T.at(J0, wind(K0 - J0, 1, .8), .12);
seed(41); for (let i = 0; i < 6; i++) T.at(J0 + .2 + i * .5 + rnd() * .2, tweet(.6), .1, rnd() * 1.6 - .8);
T.at(J0 + .1, laughter(1.8, .8), .4, .6); T.at(J0 + .3, murmur(1.4, .5), .15, .5);
for (let i = 0; i < 4; i++) T.at(J0 + .2 + i * .3, step(.5), .2, -.4);
T.at(LOOK, plink(note(76), .6), .2); T.at(LOOK + .2, drip(.8), .25);
T.at(REFLECT, whoosh(.25, 2000, 6000), .3); T.at(REFLECT + .05, splash(.4), .2);
T.at(REFLECT + .4, squeak(800, 400, .2, .6), .3);
T.at(SCREAM, scream(1), .55); T.at(SCREAM + .05, screech(.9, 2200, .7), .3); T.at(SCREAM, splash(.7), .3);
T.at(WIDE2 - .1, whoosh(.25, 2000, 6000), .3);
T.at(CURSEG - .1, crackle(1, .8), .4, .3); T.at(CURSEG, thunder(1.2, .7), .4, .3);
T.at(DEMON, pop(1, .6), .5, .5); T.at(DEMON + .05, noise(.5, { hp: 300, lp: 3000, e: env.ad(.005, .15), amp: 1 }), .3, .5);
T.at(DEMON + .3, hmm(180, 120, .5), .35, .5); T.at(DEMON + .5, squeak(900, 1400, .2, .6), .25, .6);
for (let i = 0; i < 9; i++) T.at(FLEE + i * .13, step(.8), .3, .5 + i * .05);
T.at(FLEE + .3, whoosh(.6, 400, 2000), .25, .8);
T.at(FLEE + .7, splash(.5), .2, -.2); T.at(FLEE + .9, hmm(200, 140, .8, .9), .3, -.3);
for (let i = 0; i < 4; i++) T.at(FLEE + 1.3 + i * .3, noise(.25, { hp: 300, lp: 1600, e: env.hann(), amp: .8 }), .25, -.3);   // his angry huffs
T.at(FLEE + 1.2, laughter(1, .4), .12, .9);
T.at(FACEBACK - .1, whoosh(.25, 2000, 6000), .3); T.at(FACEBACK + .05, pop(.6, 1), .3);
T.at(FACEBACK + .2, chime(note(79), .5, 1.5), .3); T.at(FACEBACK + .3, noise(.7, { hp: 400, lp: 2200, e: env.hann(), amp: .6 }), .2);   // a relieved sigh
T.at(STEAM, kettle(1.8, 1), .3); T.at(STEAM, hmm(150, 110, 1, .9), .3);
T.at(K0 - .25, whoosh(.35, 800, 5000), .4);
// ==== K · the road at dusk: wind; the curse's thunder; the vision (a conch, pops, hooves, monkeys); acceptance; the illusion falls away
T.at(K0, wind(M0 - K0, 4, 1), .2);
T.at(K0 + .2, drone(M0 - K0 - .4, note(38), .5), .3);
T.at(CURSE - .1, crackle(1.3, .9), .45, -.2); T.at(CURSE, thunder(1.6, 1), .5);
T.at(CURSE + .25, conch(2, 233, .6), .25);
T.at(RAM_V, plink(note(67)), .3, -.2); T.at(RAM_V + .05, twang(.5), .2, -.2);
T.at(SITA_V, plink(note(72)), .3, .2); for (let i = 0; i < 5; i++) T.at(SITA_V + .1 + i * .11, click(.6), .2, .2);
T.at(VAN_V - .1, crackle(1, .8), .35, -.2); T.at(VAN_V, thunder(1.2, .7), .35);
for (let i = 0; i < 4; i++) T.at(VAN_V + .1 + i * .1, ooh(.5, 1.2 + i * .1), .14, -.3 + i * .2);
T.at(ACCEPT, om(2.6, 110, .8), .3, .2); T.at(ACCEPT + .1, chime(note(72), .6, 2.5), .35, .2);
T.at(VANISH, shimmer(1.6, [96, 91, 88, 84, 79, 76].map(note), .7), .45, .5); T.at(VANISH + .2, slide(1.2, 1600, 300, .5), .2, .5);
T.at(VANISH + .9, plink(note(91), .8), .3, -.6);   // "?"
T.at(M0 - .25, whoosh(.3, 1000, 6000), .35);
// ==== M · forgiven: a warm om pad, the blessing, a few veena notes; the tree of pride wilts and drops
T.at(M0, om(N0 - M0, 147, .5), .16);
T.at(M0 + .1, shimmer(1.4, [79, 83, 86, 91].map(note), .4), .2);
T.at(FALL, thud(.4), .2, -.4); T.at(FALL + .2, noise(.5, { hp: 300, lp: 1500, e: env.hann(), amp: .5 }), .15, -.4);
T.at(BLESS, chime(note(76), .7, 3), .4, .3); T.at(BLESS + .1, shimmer(1.4, [84, 88, 91, 96].map(note), .5), .3, .3);
melody(LOOKUP, [62, 0, 66, 0, 69, 71, 69], .32, .22, -.4);
T.at(DROP - .3, slide(.9, 600, 200, .5), .3, -.4); T.at(DROP + 1.05, thud(.4), .25, -.4); T.at(DROP + 1.1, plink(note(60), .5), .2, -.4);
T.at(DROP + 1.4, chime(note(81), .5, 2.5), .25);
// ==== N · the ask: a veena tune and a tabla; his wink
T.at(N0, room(CARD - N0, .6), .05);
melody(N0 + .1, [62, 66, 69, 74, 71, 69, 66, 69, 62, 66, 69, 74], .3, .32, -.1);
for (let i = 0; i < 12; i++) T.at(N0 + .1 + i * .3, tabla(i % 4 === 2 ? 180 : 300, i % 2 ? .4 : .6), .14, .1 * Math.sin(i));
T.at(N0 + 2.4, ting(96, .8), .35);
T.at(CARD - .3, whoosh(.6, 500, 3000), .4);
// ==== O · the card
T.at(CAP_T, om(END - CAP_T, 147, .5), .12);
T.at(CAP_T, chime(note(79), .6, 2.5), .45);
T.at(COVERS, plink(note(84)), .3, -.4); T.at(COVERS + .12, plink(note(88)), .3, .4); T.at(COVERS + .24, plink(note(91)), .3);
T.at(STRIKE, squeak(900, 400, .15, .6), .3); T.at(STRIKE + .1, chime(note(84), .6, 2), .4);
T.at(PILL, ting(91, .7), .4);
T.at(SUB, plink(note(86)), .25, -.3); T.at(FOLLOW, chime(note(84), .6, 2.5), .35); T.at(FOLLOW + .15, chime(note(91), .4, 2.5), .25);
T.at(FOLLOW + 1.5, strum(50, .5), .18);
T.write('assets/narad_sfx.wav');
