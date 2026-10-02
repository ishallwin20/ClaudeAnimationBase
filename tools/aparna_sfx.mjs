// aparna_sfx.mjs: the sound-effects cue list for "Bappa can't wait 3 seconds. His mother waited 3,000 years."
// (src/scenes/aparna.js), built with tools/sfx.mjs. The times are the scene's constants (STORYBOARD.md). The hook is
// dense (chomps, gulp, record-scratch freeze, boing), then it stays sparse and soft: Instagram's music goes on top.
//   node tools/aparna_sfx.mjs [--out=assets/aparna_sfx.wav]
import { track, SR, env, tone, noise, bell, mixb, note, lerp, whoosh, plink, squeak, click, thud, crackle, shimmer, drone, slide, wah, crunch, crinkle, clang } from './sfx.mjs';

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const TAU = Math.PI * 2;
const { at, write } = track(53.6);
const px = x => Math.max(-1, Math.min(1, (x - 540) / 540));   // screen x 0..1080 → pan -1..1

// the scene's times (the same block as STORYBOARD.md)
// A hook
const CHOMP1 = .30, CHOMP2 = .70, CHOMP3 = 1.10, GULP = 1.38, HOOK2 = 1.60, TAKE = 1.72, A_OUT = 3.55, B0 = 4.0;
// B princess and yogi
const B_CAP1 = 4.15, P_STOP = 5.2, GARLAND = 5.4, WAVE0 = 5.85, WAVE1 = 6.45, FLAKE = 6.55, B_CAP2 = 6.35, P_SAD = 7.1,
  P_DET = 8.0, B_CAP3 = 8.1, TAPASYA = 8.35, WIPE1 = 9.2, C0 = 9.6;
// C the change
const C_CAP1 = 9.85, CROWN = 10.0, EARRINGS = 10.5, BANGLES = 11.0, SWIRL0 = 11.5, SWIRL_FULL = 11.9, REVEAL = 12.0,
  C_CAP2 = 12.25, PULLBACK = 13.85, D0 = 14.2;
// D1 the seasons
const SUMMER = 14.2, YR1 = 14.4, FRUIT_GONE = [16.0, 16.45, 16.9, 17.3],
  RAINS = 17.5, YR2 = 17.6, GREENS_GONE = [19.3, 19.75, 20.2],
  WINTER = 20.5, YR3 = 20.6, BILVA_GONE = [22.6, 23.1],
  D2 = 23.8, BAPPA_HUG = 24.05, BAPPA_CAP = 24.1, D3 = 25.2;
// D3 night
const NIGHT_CAP1 = 25.4, LEAF_LIFT = 26.2, AURA_BLOOM = 26.6, NIGHT_CAP2 = 27.2, NIGHT_CAP3 = 27.6, LEAF_CAM = 29.0, E0 = 29.4;
// E the name
const NAME_CAP1 = 29.6, GUESS = 30.1, APARNA = 31.5, APARNA_SUB = 31.8, F0 = 33.6;
// F the test
const STRANGER_IN = 33.65, F_CAP1 = 33.75, STRANGER_STOP = 34.9, P_EYES = 35.0, MOCK = 35.3, TAIL0 = 36.2, TAIL1 = 37.3,
  MOON_GLINT = 36.8, ANGRY = 37.9, TURN_AWAY = 38.6, POOF = 39.4, SHIVA_REVEAL = 39.8, SHIVA_CAP = 39.85,
  P_TURN_BACK = 40.0, P_DELIGHT = 40.7, YOURS = 41.3, PETALS = 41.3, G0 = 43.6;
// G Bappa rhyme
const G_CAP1 = 43.9, OFFER = 44.0, MOM_IN = 44.3, TAKE_MODAK = 44.9, BREAK = 45.3, HALF_BACK = 45.6, SHARE_CHOMP = 46.0,
  QUESTION = 45.9, QUESTION_SUB = 46.3, HEART_IRIS = 47.4, CARD = 47.8;
// Card
const CARD_CAP = 48.0, COVER = 48.1, FAN = 48.5, LOGO = 49.1, SERIES = 49.4, PRICE = 49.8, PILL = 50.2, FOLLOW = 50.8, END = 53.6;

// ---------- helpers ----------
const blank = d => new Float32Array(Math.max(1, Math.round(d * SR)));
const stamp = (o, b, t, g = 1) => { const s = Math.round(t * SR); for (let i = 0; i < b.length && s + i < o.length; i++) o[s + i] += b[i] * g; };
const lowpass = (b, fc) => { const a = 1 - Math.exp(-TAU * fc / SR); let l = 0; for (let i = 0; i < b.length; i++) { l += a * (b[i] - l); b[i] = l; } return b; };

// chomp: a crunch plus a squelchy falling "wah"
const chomp = (amp = 1) => mixb(crunch(amp), tone(.2, t => 330 * Math.exp(-t * 4) + 120, { type: 'saw', e: env.ad(.01, .07), fm: t => .01 * Math.sin(t * TAU * 18), amp: amp * .18 }));
// gulp: a quick falling glug
const gulp = (amp = 1) => { const o = blank(.4); stamp(o, tone(.14, t => 230 * Math.exp(-t * 6) + 80, { e: env.pluck(20), amp }), 0); stamp(o, tone(.1, t => 160 * Math.exp(-t * 6) + 70, { e: env.pluck(28), amp: amp * .6 }), .17); return o; };
// scratch: a record-scratch stop: a fast downward saw slide with a gritty noise bite, then a click
const scratch = (amp = 1) => { const o = blank(.35); stamp(o, tone(.22, t => 1800 * Math.exp(-t * 11) + 90, { type: 'saw', e: env.ad(.004, .09), amp: amp * .5 }), 0); stamp(o, noise(.2, { hp: 1200, lp: 7000, e: env.ad(.004, .06), amp: amp * .5 }), 0); stamp(o, click(amp), .24); return o; };
// boing: a springy stinger, a rising wobbling glide
const boing = (amp = 1) => tone(.5, t => 220 * Math.pow(2.6, Math.min(1, t / .18)) * (1 + .05 * Math.sin(t * TAU * 14) * Math.exp(-t * 5)), { e: env.ad(.005, .16), amp });
// soft pop / puff: a falling blip with a little air (f = the starting pitch)
const pop = (f = 700, amp = 1) => mixb(tone(.14, t => f * Math.exp(-t * 9) + 150, { e: env.pluck(24), amp }), noise(.1, { lp: 3500, hp: 600, e: env.pluck(30), amp: amp * .35 }));
// tick: a dry clock tick
const tick = (amp = 1, f = 1300) => mixb(tone(.05, f, { e: env.pluck(90), amp }), noise(.02, { hp: 2000, e: env.pluck(200), amp: amp * .5 }));
// soft boom: a short low hit that ends fast
const sboom = (amp = 1) => mixb(tone(.6, t => 62 * Math.exp(-t * 2.2) + 36, { e: env.ad(.004, .22), amp }), thud(amp * .35));
// counter: clicks accelerating over dur, ending (placed by the caller) in a boom
const counter = (dur = .7, amp = 1) => { const o = blank(dur + .1); let t = 0, k = 0; while (t < dur) { stamp(o, tick(amp, 1100 + (k % 3) * 160), t, .8); t += lerp(.11, .022, t / dur); k++; } return o; };
// jingle: a handful of tiny bells in quick succession (notes in MIDI)
const jingle = (notes, gap = .045, amp = 1) => { const o = blank(notes.length * gap + 1); notes.forEach((m, i) => stamp(o, bell(note(m), .7, { partials: [[1, 1], [2.4, .5], [4.1, .25]], k: 6, amp }), i * gap, .7 + .3 * ((i * 7) % 3) / 2)); return o; };
// metal clink: a bright struck-metal ping with a tick
const clink = (f, amp = 1) => mixb(clang(f, amp * .8), click(amp * .5));
// footsteps: n soft thuds with a little scuff, alternating pitch
const steps = (n, gap, amp = 1) => { const o = blank(n * gap + .3); for (let i = 0; i < n; i++) stamp(o, mixb(tone(.1, t => (i % 2 ? 95 : 120) * Math.exp(-t * 14) + 55, { e: env.pluck(26), amp }), noise(.08, { lp: 1800, hp: 400, e: env.pluck(40), amp: amp * .5 })), i * gap, 1); return o; };
// cicada: a high buzzing trill, AM at ~45 Hz
const cicada = (dur, amp = 1) => { const n = tone(dur, t => 4300 + 150 * Math.sin(t * 9), { e: env.swell(.05, .08), amp }); for (let i = 0; i < n.length; i++) n[i] *= .5 + .5 * Math.sin(i / SR * TAU * 38) * Math.sin(i / SR * TAU * 7); return n; };
// rain: steady hissy noise with a pitter patter
const rain = (dur, amp = 1) => mixb(noise(dur, { hp: 1800, lp: 9000, e: env.swell(.6, .6), amp }), noise(dur, { hp: 400, lp: 1500, e: env.swell(.6, .6), amp: amp * .35 }));
// wind: low swelling noise
const wind = (dur, lo, amp = 1) => noise(dur, { lp: t => lo + lo * .5 * Math.sin(t * 1.3), hp: 120, e: (t, D) => env.swell(1, 1)(t, D) * (.6 + .4 * Math.sin(t * 1.7)), amp });
// om: a warm low tone with its fifth, a slow swell and a little chorus
const om = (dur, f = 110, amp = 1) => { const o = blank(dur); for (const [r, a] of [[1, 1], [1.5, .45], [2, .3], [3, .1]]) for (const d of [-.004, .004]) stamp(o, tone(dur, f * r * (1 + d), { e: (t, D) => Math.pow(clamp01(t / D), 1.6) * clamp01((D - t) / .25), amp: a * .5 * amp }), 0); return o; };
const clamp01 = x => Math.max(0, Math.min(1, x));
// aww: a soft rising tone (two voices, gentle vibrato)
const aww = (amp = 1) => tone(.55, t => 330 + 150 * Math.min(1, t / .4), { e: env.swell(.12, .2), fm: t => .004 * Math.sin(t * TAU * 5), amp });
// brush: a soft airy sweep (down-pass lowpassed whoosh)
const brush = (dur, amp = 1) => mixb(whoosh(dur, 500, 2600, amp), noise(dur, { hp: 3000, lp: 9000, e: env.hann(), amp: amp * .12 }));
// glint: a tiny high ting
const ting = (f = note(103), amp = 1) => bell(f, .7, { partials: [[1, 1], [2.7, .3]], k: 7, amp });
// rattle: a quiet snake rattle: dry fast clicks with a hiss
const rattle = (dur, amp = 1) => { const o = noise(dur, { hp: 4000, lp: 10000, e: env.swell(.08, .15), amp: amp * .6 }); for (let i = 0; i < o.length; i++) o[i] *= .35 + .65 * Math.max(0, Math.sin(i / SR * TAU * 24)); return o; };
// reveal chord: a bright bell plus a shimmer
const chord = (m, dur = 2, amp = 1, notes = [0, 4, 7, 12]) => mixb(bell(note(m), dur, { k: 2.4, amp }), shimmer(1, notes.map(d => note(m + 12 + d)), amp * .4, .06));

// ---------- A · the hook (dense, bright) ----------
at(0, tone(1.5, 196, { type: 'tri', e: env.swell(.05, .4), amp: .3 }), .05, 0);   // a faint warm hum so frame 0 is not dead air
[CHOMP1, CHOMP2, CHOMP3].forEach((t, i) => {
  at(t, chomp(1), .5, 0);
  at(t + .06, crackle(.12, 1), .12, (i - 1) * .3);   // crumbs
  at(t + .08, plink(note(88 + i * 2), .5), .08, 0);
});
at(GULP, gulp(1), .55, 0); at(GULP, thud(.4), .18, 0);
at(TAKE - .02, scratch(1), .5, 0);   // record scratch: the freeze
at(TAKE + .05, boing(1), .32, 0);
at(TAKE + .05, bell(note(96), .9, { k: 4 }), .14, 0);
at(2.9, plink(note(100), 1), .3, .25);   // sweat plink
at(A_OUT - .05, whoosh(.55, 400, 1600, .7), .16, 0);   // airy whoosh as the cloud swells
at(A_OUT + .1, noise(.5, { lp: 1400, hp: 300, e: env.swell(.25, .2), amp: .5 }), .06, 0);

// ---------- B · princess and yogi ----------
at(B0, wind(5.6, 700, 1), .12, 0);   // cold mountain wind, 4.0 – 9.6
at(4.2, steps(5, .2, .8), .22, -.4);   // she walks in from the left, 4.2 – 5.2
at(4.3, steps(3, .22, .8), .08, -.2);
at(GARLAND, jingle([88, 91, 95, 93], .05, .7), .18, -.1);
[0, 1, 2].forEach(i => at(lerp(WAVE0, WAVE1 - .15, i / 2), whoosh(.18, 900 + i * 150, 2400, .8), .15, .15 + i * .05));   // hand wave: swish swish swish
at(FLAKE, plink(note(105), .6), .2, .15);   // snowflake on his nose
at(P_SAD, wah(note(59), .5, .8), .2, -.1); at(P_SAD + .45, wah(note(55), .8, .8), .2, -.1);   // sad descending wah
at(P_DET, tone(.5, 1400, { type: 'saw', e: env.ad(.003, .12), amp: .15 }), .1, 0);   // shing
at(P_DET, mixb(noise(.35, { hp: 3000, lp: 11000, e: env.ad(.003, .12), amp: .5 }), bell(note(100), .8, { k: 5 })), .22, 0);
at(P_DET + .03, sboom(1), .3, 0);   // low hit
at(TAPASYA, sboom(.8), .26, 0);
at(WIPE1, brush(.5, 1), .22, 0);   // saffron brush wipe

// ---------- C · the change ----------
at(CROWN, clink(note(88), 1), .38, -.1); at(CROWN + .02, shimmer(.3, [96, 100, 103].map(note), .4, .05), .12, 0.3);
at(EARRINGS, clink(note(93), .8), .3, -.3); at(EARRINGS + .1, clink(note(96), .7), .26, .3);   // jhumkas and nath
at(BANGLES, jingle([84, 88, 91, 96], .06, 1), .4, .1);
at(SWIRL0, mixb(whoosh(SWIRL_FULL - SWIRL0 + .1, 400, 3200, 1), tone(SWIRL_FULL - SWIRL0 + .1, t => 300 * Math.pow(4, t / .5), { e: env.hann(), amp: .15 })), .26, 0);   // rising swirl
at(REVEAL, shimmer(.5, [79, 84, 88, 91, 96].map(note), .8, .07), .3, 0); at(REVEAL, chord(67, 2.5, .7, [0, 4, 7]), .26, 0);
at(PULLBACK, whoosh(.4, 400, 2800, 1), .24, 0);

// ---------- D1 · the seasons ----------
// season beds, cross-faded
at(SUMMER, mixb(drone(3.5, note(48), .8), noise(3.5, { lp: 900, hp: 200, e: env.swell(.5, .6), amp: .3 })), .12, 0);   // warm drone
at(14.6, cicada(.9, 1), .06, -.5); at(15.6, cicada(1.1, 1), .06, .5); at(16.7, cicada(.8, 1), .05, -.3);
at(RAINS, rain(3.2, 1), .13, 0);
at(WINTER, mixb(wind(3.2, 1300, 1), drone(3.2, note(60), .2)), .09, 0);   // thin wind
[21.4, 22.1, 22.9].forEach((t, i) => at(t, ting(note(103 + i * 2), .8), .08, i % 2 ? .4 : -.4));   // faint ice chimes
// year cards: ticking counter + deep soft boom
for (const y of [YR1, YR2, YR3]) { at(y, counter(.7, 1), .22, 0); at(y + .7, sboom(1), .38, 0); }
// foods vanishing: soft pops, each a bit lower
const plate = px(300);
FRUIT_GONE.forEach((t, i) => at(t, pop(900 - i * 80, 1), .4, plate));
GREENS_GONE.forEach((t, i) => at(t, pop(780 - i * 90, 1), .4, plate));
BILVA_GONE.forEach((t, i) => at(t, pop(650 - i * 110, 1), .4, plate));
at(23.6, whoosh(.3, 500, 4000, 1), .3, 0.2);   // whip pan

// ---------- D2 · Bappa insert ----------
at(BAPPA_HUG, squeak(1800, 3000, .1, 1), .3, 0); at(BAPPA_HUG + .1, squeak(2800, 1500, .14, 1), .26, 0);   // panic squeak
at(BAPPA_HUG + .12, tone(.35, t => 160 - 70 * t / .35, { type: 'saw', e: env.ad(.01, .1), fm: t => .02 * Math.sin(t * TAU * 22), amp: .25 }), .22, 0);   // rubbery squeeze
at(24.3, plink(note(100), 1), .26, .3); at(24.62, plink(note(97), 1), .24, -.3);   // sweat
at(24.9, whoosh(.3, 500, 4000, 1), .3, -.2);   // whip back

// ---------- D3 · night: not even a leaf ----------
at(D3 + .1, noise(1, { lp: 500, hp: 100, e: env.swell(.5, .5), amp: .5 }), .04, 0);   // a hush
at(LEAF_LIFT, crinkle(.5, 1), .22, -.1); at(LEAF_LIFT + .05, whoosh(.5, 300, 1500, .5), .08, 0.1);   // dry-leaf rustle and breeze
at(AURA_BLOOM, om(29.0 - AURA_BLOOM + .2, 110, 1), .28, 0);   // warm rising om
at(AURA_BLOOM + .3, shimmer(.4, [84, 88, 91].map(note), .5, .1), .1, 0);
at(LEAF_CAM - .1, whoosh(.55, 400, 2800, 1), .3, 0);

// ---------- E · the name ----------
{ let i = 0; for (let t = GUESS; t < APARNA - .05; t += .25, i++) at(t, tick(1, i % 2 ? 1000 : 1250), .06 + .08 * (t - GUESS) / (APARNA - GUESS), i % 2 ? .1 : -.1); }   // clock ticks, building
at(APARNA - .06, whoosh(.2, 600, 3000, .6), .1, 0);
at(APARNA, chord(79, 3, 1, [0, 4, 7, 12]), .24, 0); at(APARNA, shimmer(.5, [91, 95, 98, 103].map(note), .8, .06), .16, 0);

// ---------- F · the test ----------
at(STRANGER_IN, steps(5, .25, .8), .2, .6);   // he walks in from the right
at(STRANGER_STOP, mixb(tone(.1, 520, { e: env.pluck(40), amp: .5 }), click(.8)), .25, .55);   // staff tap
at(STRANGER_STOP, thud(.3), .1, .55);
at(MOCK, mixb(wah(note(52), .35, .7), wah(note(55), .3, .5)), .16, .5); at(MOCK + .3, wah(note(50), .5, .6), .15, .5);
at(TAIL0, rattle(.7, 1), .2, .6);   // snake tail
at(MOON_GLINT, ting(note(105), 1), .3, .5);
at(ANGRY, mixb(tone(.5, t => 98 * Math.exp(-t * .8), { type: 'saw', e: env.ad(.01, .2), amp: .35 }), bell(note(46), .8, { k: 5, amp: .6 })), .26, -.3);   // angry low stinger
at(TURN_AWAY, whoosh(.25, 900, 2200, 1), .22, -.2);
at(POOF - .03, mixb(whoosh(.35, 600, 2800, 1), noise(.4, { lp: 2500, hp: 500, e: env.ad(.01, .15), amp: .5 })), .3, .5);
at(POOF, crackle(.4, 1), .16, .5); at(POOF + .03, thud(.8), .22, .5);
at(SHIVA_REVEAL, shimmer(.5, [79, 84, 88, 91, 96].map(note), .8, .07), .3, .4); at(SHIVA_REVEAL, bell(note(72), 2.5, { k: 2.2 }), .3, .4);
at(YOURS, chord(76, 3, .9, [0, 3, 7, 12]), .34, 0);   // warm bell chord
for (let i = 0; i < 9; i++) at(41.3 + .1 + i * .22 + ((i * 5) % 3) * .03, plink(note(100 + (i * 5) % 9), .5), .07, ((i * 37) % 9 - 4) / 5);   // petal sparkles, 41.3 – 43.3
at(43.3, brush(.4, 1), .22, 0);

// ---------- G · Bappa rhyme ----------
at(OFFER, aww(1), .22, 0);
at(BREAK, mixb(click(1), crunch(.5)), .35, -.4);   // crumb crack
at(HALF_BACK, plink(note(91), .6), .1, -.2);
at(SHARE_CHOMP, chomp(.7), .3, 0); at(SHARE_CHOMP + .22, chomp(.55), .24, -.5); at(SHARE_CHOMP + .3, chomp(.55), .2, .1);
[46.0, 46.2, 46.45, 46.75].forEach((t, i) => at(t + .1, pop(1100 + i * 100, .8), .22, (i % 2 ? .3 : -.3)));   // heart pops
at(HEART_IRIS - .05, mixb(whoosh(.45, 400, 3000, 1)), .26, 0); at(HEART_IRIS + .3, pop(1200, 1), .3, 0);

// ---------- Card ----------
at(COVER, mixb(thud(.5), plink(note(72))), .34, 0);
at(FAN, pop(950, 1), .22, -.3); at(FAN + .06, pop(1050, 1), .22, .3);
at(LOGO, pop(900, 1), .28, -.4); at(LOGO, bell(note(84), 1.2), .14, -.4);
at(SERIES, pop(850, 1), .26, 0);
at(PRICE, pop(800, 1), .3, 0);
at(PILL, shimmer(1.2, [76, 79, 84, 88].map(note), .7, .06), .32, 0); at(PILL, bell(note(91), 1.5, { k: 3 }), .12, 0);
at(FOLLOW, bell(note(84), 2.2, { k: 2.5 }), .24, 0); at(FOLLOW, plink(note(96), .6), .1, 0);
// then silence to the end

write(args.out || 'assets/aparna_sfx.wav');
