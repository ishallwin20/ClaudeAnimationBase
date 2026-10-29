// curse_sfx.mjs: the sound for "Baby HANUMAN was SO naughty, the rishis CURSED him!" (src/scenes/curse.js, ad 60, no
// voice) → assets/curse_sfx.wav. Times are the scene's constants (keep them in sync). Retro synth cartoon foley carries
// it (snaps, twinkles, bonks, rips, pot drums, whoomph, coughs, boings, buzzy "NO!"s, the deflate, the womp-womp).
// Music only twice: a music-box lullaby over a soft tanpura while he turns gentle (F), and a heroic swell from the
// heartbeat to the leap (I), with half a second of silence before the roar. Quiet beds: ashram birds, ocean waves.
import { track, tone, noise, bell, mixb, env, whoosh, plink, squeak, click, thud, shimmer, slide, crunch, crinkle, chime, drum, heart, conch, om, roar, rockfall,
  wind, whir, fire, chirp, splash, note, seed, rnd, clamp, SR } from './sfx.mjs';

const BLINK = .8, SIDE = 1.5, SNAP = 2.1, GRIN = 2.5, B0 = 3.6;
const SPARK = 3.8, FLEX = 5.6, ROCK = 6.2, BONK = 7.0, GIGGLE = 7.4, C0 = 8.2;
const BARK0 = 10.6, SWING = 11.0, YAG0 = 14.2, GRAB = 14.9, DRUM = 15.4, CRACK = 16.4, WHOOMPH = 16.9, FORG0 = 18.4, D0 = 22.6;
const NO1 = 22.9, NO2 = 23.5, NO3 = 24.1, ANGEL0 = 25.9, NOD = 26.0, ZIP = 26.9, CRASH = 27.5, PALM0 = 27.7, E0 = 28.4;
const OPEN = 28.6, RED = 29.2, CALM = 30.5, CURSE = 32.5, SPRINKLE = 33.0, DRAIN = 33.6, LIFT = 35.7, PLOP = 36.7, F0 = 37.4;
const OFFER = 39.6, PAT = 40.3, YEARS = 41.0, LAPSE0 = 41.7, G0 = 43.4;
const PUSHG = 46.9, H0 = 49.6, JSIT = 51.4, REFL = 52.6, WIDE = 54.2, I0 = 55.6;
const THUMP = 55.7, STAND = 56.4, GROW = 56.8, ROAR = 58.2, TURN = 59.4, WINK = 59.8, CROUCH = 60.2, LEAP = 60.6, FLY0 = 60.85, J0 = 62.4;
const CARD = 66.2, END = 70.2;
const STRIPK = [.15, .32, .5, .68, .85], RIPS = STRIPK.map(k => SWING + (k - .04) / .92 * 2.3);
const BEATS = [0, 1, 2, 3].map(i => DRUM + i * .3), TWITCH = [19.5, 20.5, 21.5];

const T = track(END);
seed(60);
const PENTA = [0, 2, 4, 7, 9];
const pent = (base, i) => note(base + 12 * Math.floor(i / 5) + PENTA[i % 5]);
// a buzzy cartoon voice: syllables [start, dur, pitch ×, brightness 0..1] (as in ad 59)
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
const BABY = 330, ELDER = 125, ANJ = 290, KES = 165, VAYU = 210, HAN = 170, JMB = 105;
const giggle = (f = BABY, amp = 1, n = 4) => voice(Array.from({ length: n }, (_, i) => [i * .11, .08, 1.25 - i * .04, .7]), f, { amp, fall: .2 });
const huh = (f, amp = 1) => voice([[0, .32, 1, .6]], f, { amp, rise: .9, fall: 0 });
const no = (f, amp = 1) => voice([[0, .34, 1.15, .75]], f, { amp, fall: .5 });
const aww = (f, amp = 1) => voice([[0, .6, 1.1, .3]], f, { amp, fall: .45 });
const hmph = (f, amp = 1) => voice([[0, .22, 1, .3]], f * .9, { amp, fall: .4 });
const cough = (f, amp = 1) => mixb(noise(.14, { hp: 400, lp: 2600, e: env.pluck(14), amp }), voice([[0, .1, 1, .5]], f, { amp: amp * .6, fall: .5 }));
const pop = (f = 900, amp = 1) => mixb(squeak(f * .6, f * 1.6, .07, amp), plink(f * 1.5, amp * .5));
const boing = (amp = 1, f = 220) => tone(.35, t => f * (1 + 2.2 * t) * (1 + .18 * Math.sin(t * 2 * Math.PI * 18) * Math.exp(-t * 6)), { type: 'tri', e: env.pluck(6), amp });
const womp = (amp = 1, f = 330) => tone(.55, t => f * Math.pow(.55, t * 2), { type: 'saw', e: env.swell(.02, .3), fm: t => .01 * Math.sin(t * 2 * Math.PI * 6), amp });
const bonk = amp => mixb(tone(.18, t => 520 * Math.exp(-t * 9) + 180, { type: 'tri', e: env.pluck(14), amp }), click(amp * .5));
const snap = amp => mixb(crunch(amp), click(amp * .8), tone(.06, 1400, { e: env.pluck(80), amp: amp * .3 }));
const woodTick = (i, amp = 1) => mixb(tone(.08, 600 + (i % 3) * 140, { type: 'tri', e: env.pluck(40), amp }), click(amp * .4));
const rip = amp => mixb(noise(.22, { hp: 1200, lp: t => 3000 + 6000 * t / .22, e: env.swell(.01, .05), amp }), squeak(900, 400, .1, amp * .25));
const potDrum = (f, amp = 1) => mixb(drum(f, amp, .35), tone(.12, f * 4.1, { type: 'tri', e: env.pluck(30), amp: amp * .35 }), click(amp * .3));
const glug = amp => { const o = new Float32Array(Math.round(.5 * SR)); for (let k = 0; k < 4; k++) { const b = tone(.09, t => 260 + 200 * t / .09 - k * 25, { e: env.hann(), amp }); o.set(b.map((v, j) => v + (o[Math.round(k * .1 * SR) + j] || 0)), Math.round(k * .1 * SR)); } return o; };
const slap = amp => mixb(noise(.06, { hp: 800, lp: 5000, e: env.pluck(50), amp }), thud(amp * .5));
const add = (o, b, s0, g = 1) => { const s = Math.round(s0 * SR); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j] * g; return o; };
const lp = (b, fc) => { let l = 0; const a = 1 - Math.exp(-2 * Math.PI * fc / SR); for (let i = 0; i < b.length; i++) { l += a * (b[i] - l); b[i] = l; } return b; };
const tanpura = (dur, root = 50, amp = 1) => { const o = new Float32Array(Math.round((dur + 2.5) * SR)); const ns = [root + 7, root + 12, root + 12, root];
  for (let k = 0; k * .9 < dur; k++) add(o, lp(tone(2.4, note(ns[k % 4]), { type: 'saw', e: env.ad(.05, .9), amp }), 1400), k * .9, 1 - .5 * clamp((k * .9 - dur + 1.5) / 1.5)); return o; };
const pad = (dur, ms, amp = 1, a = 1.2, r = 1.4) => mixb(...ms.map((m, i) => tone(dur, t => note(m) * (1 + .003 * Math.sin(t * 2 + i)), { type: 'tri', e: env.swell(a, r), amp: amp / ms.length })));
const brass = (dur, ms, amp = 1, a = .08, r = .5) => mixb(...ms.map((m, i) => lp(tone(dur, t => note(m) * (1 + .004 * Math.sin(t * 30 + i)), { type: 'saw', e: env.swell(a, r), amp: amp / ms.length }), 2200)));
const musicBox = f => bell(f, 1.6, { partials: [[1, 1], [3.0, .25], [5.1, .08]], k: 2.6 });
const bird = (f, amp = 1) => mixb(squeak(f, f * 1.4, .07, amp), squeak(f * 1.3, f * 1.1, .06, amp * .7));
const waves = (dur, amp = 1) => noise(dur, { lp: t => 500 + 450 * Math.max(0, Math.sin(t * 1.1)) ** 2, hp: 90, e: (t, D) => clamp(t / 1) * clamp((D - t) / 1) * (.45 + .55 * Math.max(0, Math.sin(t * 1.1)) ** 2), amp });

// ================= beds: the ashram's birds, the ocean =================
for (const [a, b] of [[0, 37.4], [J0, CARD]]) for (let t = a + .4; t < b - .3; t += 1.3 + rnd() * 1.4) T.at(t, bird(2400 + rnd() * 1200, .6), .05, rnd() * 1.6 - .8);
T.at(0, wind(37.4, 0, 1.5), .035, -.4); T.at(0, wind(37.4, 2.1, 1.5), .035, .4);
T.at(G0, waves(I0 + 1 - G0), .13, -.3); T.at(G0 + .7, waves(I0 + .4 - G0), .1, .4);
T.at(G0, wind(18, 1.1, 2), .04, 0);

// ================= A · the hook =================
T.at(.15, voice([[0, .14, 1.2, .6], [.17, .14, 1.3, .6], [.34, .22, 1.45, .7]], BABY), .1, 0);   // an innocent "hm-hm-hmm"
T.at(BLINK, click(.5), .07, 0);
T.at(SIDE, squeak(600, 420, .16, .8), .12, -.3);
T.at(SNAP, snap(1), .55, -.4); T.at(SNAP + .02, thud(.3), .2, -.4);
T.at(SNAP + .05, plink(note(86), 1), .22, -.5);                                        // "!"
T.at(SNAP + .08, whoosh(.45, 900, 3000), .14, -.6);
[SNAP + .55, SNAP + .72, SNAP + .84, SNAP + .92].forEach((t, i) => T.at(t, woodTick(i, 1 - i * .2), .22, -.7));   // the bowl clatters down
T.at(GRIN, giggle(BABY, 1, 5), .16, 0);                                                // sheepish "hehehe"
T.at(B0 - .3, whoosh(.6, 400, 3000), .22, 0);                                          // the wipe

// ================= B · the boons, the boulder =================
for (let i = 0; i < 5; i++) {
  const t0 = SPARK + i * .32;
  T.at(t0, whoosh(.5, 1500, 5000), .08, [-.7, .7, -.4, .4, 0][i]);
  T.at(t0 + .5, mixb(chime(pent(79, i * 2), .9, 1.4), shimmer(.6, [pent(91, i), pent(91, i + 2)], .5, .06)), .14, -.2);
}
T.at(FLEX, hmph(BABY * 1.1, 1), .14, -.2); T.at(FLEX + .05, shimmer(.7, [note(96), note(100), note(103)], .6, .07), .12, -.2);
T.at(ROCK, noise(.55, { brown: true, lp: 300, e: env.swell(.05, .2), amp: 1 }), .5, .6); T.at(ROCK + .5, thud(1), .35, .5);
T.at(BONK - .4, squeak(300, 200, .12, .6), .1, -.2);                                    // the crouch
T.at(BONK, bonk(1), .5, .1); T.at(BONK, rockfall(.8, 1), .32, .4); T.at(BONK + .02, thud(1), .3, .2);
T.at(GIGGLE, giggle(BABY, 1, 6), .18, -.2);
T.at(C0 - .32, whoosh(.45, 300, 4500), .3, 0);                                        // whip up to the canopy

// ================= C · the ashram =================
T.at(C0 + .05, slide(2.0, 1400, 500, 1), .07, 0);                                      // a slide whistle down the crane
T.at(C0 + .3, om(2.2, 98, 1), .06, .2);                                                // the rishis' om, far
T.at(9.3, giggle(BABY * 1.05, 1, 5), .15, -.4);
T.at(BARK0 + .05, whoosh(.4, 2000, 600), .15, 0); T.at(SWING - .05, boing(.9, 260), .18, -.6);   // he drops onto the line
for (let k = 0; k < 6; k++) T.at(SWING + .2 + k * .45, whoosh(.3, 800, 2400), .07, -.6 + k * .25);   // the swings
RIPS.forEach((r, i) => { T.at(r, rip(1), .35, -.7 + i * .35); T.at(r + .05, pop(700 + i * 90, .8), .08, -.7 + i * .35); });
T.at(12.7, boing(1, 200), .2, -.6); T.at(12.85, huh(ELDER * 1.2, 1), .22, -.6); T.at(12.9, plink(note(88), 1), .14, -.6);

// the yagna
for (let k = 0; k < 4; k++) T.at(YAG0 + .05 + k * .14, plink(note(72 + [0, 4, 7, 4][k]), .8), .12, -.7);   // tiptoe pizzicato
T.at(YAG0, talk(WHOOMPH - YAG0, ELDER, { gap: .22, amp: .7, br: .2 }), .06, .3);                  // the chant
T.at(GRAB, whoosh(.25, 1500, 4000), .18, -.3); T.at(GRAB + .05, woodTick(0, 1), .16, -.3); T.at(GRAB + .12, woodTick(1, 1), .16, -.3);
BEATS.forEach((b, i) => T.at(b, potDrum(i % 2 ? 150 : 120, 1), .55, i % 2 ? .1 : -.4));
T.at(DRUM + 1.2, giggle(BABY, 1, 3), .12, -.3);
T.at(CRACK, crunch(1), .5, -.2); T.at(CRACK + .08, crunch(1), .45, .1); T.at(CRACK + .1, plink(note(84), .8), .12, 0);
T.at(CRACK + .15, glug(1), .18, .1);
T.at(WHOOMPH, mixb(noise(.7, { lp: t => 300 + 3000 * Math.exp(-t * 3), hp: 60, e: env.ad(.02, .35), amp: 1 }), fire(1.2, 1, .2)), .55, .3);
T.at(WHOOMPH + .02, drum(55, 1, .6), .3, .3);
T.at(WHOOMPH + .55, cough(ELDER, 1), .26, .3); T.at(WHOOMPH + .8, cough(ELDER * 1.05, 1), .22, .3);
T.at(17.75, click(.6), .1, .3); T.at(18.05, click(.6), .1, .3);
T.at(17.9, whoosh(.5, 300, 1500), .22, 0);                                             // the smoke fills the frame

// the forgiving: forced chuckles, eye twitches, baby pats on a head
T.at(FORG0 + .3, whoosh(.5, 1500, 300), .12, 0);
for (let t = FORG0 + .5; t < D0 - .3; t += .224) T.at(t, mixb(click(.4), tone(.06, 380, { type: 'tri', e: env.pluck(40), amp: .5 })), .07, 0);   // pat-pat on the head
T.at(FORG0 + .9, voice([[0, .1, 1, .3], [.16, .1, .98, .3], [.32, .1, .96, .3]], ELDER, { fall: .1 }), .13, -.4);   // "heh heh heh"
T.at(FORG0 + 1.3, voice([[0, .1, 1, .3], [.16, .1, .98, .3]], ELDER * 1.15, { fall: .1 }), .12, .4);
TWITCH.forEach((t, i) => { T.at(t, boing(1, 380), .16, [-.6, .6, 0][i]); T.at(t + .02, click(.6), .1, 0); });

// ================= D · NO! NO! NO! · the angel, the zip, the crash, the facepalm =================
T.at(D0, whoosh(.3, 3000, 800), .12, 0);
[[NO1, ANJ, -.4], [NO2, KES, .4], [NO3, VAYU, 0]].forEach(([t, f, p]) => {
  T.at(t, no(f, 1), .3, p); T.at(t + .02, tone(.25, t2 => 140 - 30 * t2, { type: 'square', e: env.swell(.01, .1), amp: .5 }), .08, p);   // a little buzzer
  for (let k = 0; k < 4; k++) T.at(t + .1 + k * .16, whoosh(.12, 1500, 2500), .05, p);   // the finger wag
});
T.at(ANGEL0 + .05, pad(1.0, [79, 83, 86, 91], 1, .2, .5), .12, 0);                      // the angelic "aah"
T.at(NOD + .1, shimmer(1.0, [note(96), note(100), note(103), note(108)], .7, .08), .14, 0);
T.at(ZIP - .18, squeak(400, 300, .15, .7), .1, 0);
T.at(ZIP, mixb(slide(.25, 600, 2400, 1), whoosh(.3, 1500, 6000)), .3, .5);
T.at(ZIP + .55, bell(note(96), .5, { partials: [[1, 1], [2.4, .4]], k: 9 }), .2, 0); T.at(ZIP + .7, bell(note(96), .3, { partials: [[1, 1]], k: 14 }), .1, 0);   // the halo lands
T.at(CRASH, mixb(rockfall(.7, 1), crunch(1)), .4, .8); T.at(CRASH + .05, bell(note(70), .8, { partials: [[1, 1], [2.32, .6], [3.87, .4]], k: 5 }), .2, .8);
T.at(PALM0 + .02, slap(1), .3, -.3); T.at(PALM0 + .07, slap(1), .26, .3); T.at(PALM0 + .12, slap(.9), .24, 0);
T.at(PALM0 + .25, aww(ANJ * .8, .8), .12, -.3);

// ================= E · the rishis get angry (a little); the curse =================
T.at(E0 + .02, crunch(.4), .1, 0);
T.at(OPEN, pop(800, 1), .18, 0); T.at(OPEN + .05, pop(900, 1), .14, .2);
T.at(RED, tone(1.4, t => 900 + 1600 * clamp(t / 1.1), { type: 'tri', e: env.swell(.15, .2), fm: t => .002 * Math.sin(t * 80), amp: .8 }), .1, .3);   // a kettle whistle rising
T.at(RED + .1, voice([[0, .7, 1, .4]], ELDER * .9, { shake: 1, amp: 1 }), .12, .3);   // "grrrr"
for (let k = 0; k < 3; k++) T.at(CALM + .05 + k * .1, click(.5), .1, -.1);              // pat pat pat
T.at(CALM + .3, slide(.6, 1500, 400, .7), .08, .3);                                     // the steam dies down
T.at(CALM + .6, hmph(ELDER * 1.1, 1), .14, .3);
T.at(CURSE, om(3.2, 82, 1), .2, 0); T.at(CURSE, tone(3.2, note(38), { e: env.swell(.4, 1), amp: 1 }), .12, 0);   // a low drone
T.at(CURSE + .05, talk(1.4, ELDER, { gap: .2, amp: 1, br: .3 }), .14, -.5); T.at(CURSE + .25, talk(1.4, ELDER * 1.1, { gap: .19, amp: 1, br: .3 }), .12, -.2);
for (let i = 0; i < 7; i++) T.at(SPRINKLE + i * .07, plink(note(93 + (i * 3) % 7), .8), .1, -.2 + i * .1);
T.at(SPRINKLE + .45, shimmer(.8, [note(98), note(101), note(105)], .5, .06), .12, .5);
T.at(SPRINKLE + .35, huh(BABY, 1), .14, .5);
T.at(DRAIN, slide(1.6, 900, 160, 1), .16, .5);                                          // the deflate
T.at(DRAIN + .1, shimmer(1.5, [note(96), note(93), note(89), note(86), note(81), note(77)], .5, .2), .1, .5);
T.at(34.4, aww(BABY, 1), .16, .5);
T.at(LIFT, voice([[0, .85, 1, .5]], BABY * .9, { shake: 1, rise: .3, amp: 1 }), .16, .4);   // "nnnngh"
T.at(PLOP, mixb(thud(1), tone(.12, t => 300 - 900 * t, { e: env.pluck(20), amp: .5 })), .4, .4);
T.at(PLOP + .2, womp(1, 330), .12, 0); T.at(PLOP + .55, womp(1, 280), .12, 0);           // womp womp
T.at(37.0, click(.5), .08, .4); T.at(37.25, click(.5), .08, .4);
T.at(F0 - .35, slide(.35, 900, 300, .6), .08, 0);                                       // the iris closes

// ================= F · gentle: the lullaby =================
{
  const LUL = [76, 79, 81, 79, 76, 74, 76, 0, 79, 81, 84, 81, 79, 76, 79, 0, 76, 74, 72, 74, 76];
  LUL.forEach((m, i) => { if (m) T.at(F0 + .3 + i * .27, musicBox(note(m)), .1, (i % 4 - 1.5) * .2); });
  T.at(F0, tanpura(YEARS - F0 + .6, 52, 1), .05, 0);
  T.at(F0 + .1, pad(YEARS - F0, [64, 67, 71], 1, 1, 1.2), .05, 0);
}
for (let k = 0; k < 6; k++) T.at(F0 + .2 + k * .32, plink(note(84), .6), .05, -.5);      // careful little steps
T.at(OFFER, chime(note(91), .8, 1.5), .1, 0);
for (let k = 0; k < 3; k++) T.at(PAT + .05 + k * .22, click(.4), .08, .2);
T.at(PAT + .15, aww(BABY * 1.1, 1), .12, 0); T.at(PAT + .2, shimmer(.8, [note(91), note(96), note(100)], .5, .08), .1, 0);
T.at(YEARS, whoosh(.8, 300, 3000), .2, 0);
T.at(LAPSE0, whir(1.6, 1), .06, 0);
for (let k = 0; k < 14; k++) T.at(LAPSE0 + k * .12, click(.5), .05, k % 2 ? .3 : -.3);   // a clock racing
T.at(G0 - .5, whoosh(.6, 3000, 400), .16, 0);

// ================= G · the shore =================
T.at(G0 + 1.2, talk(1.6, 220, { gap: .2, amp: .6, br: .3 }), .05, -.7); T.at(G0 + 1.5, talk(1.4, 250, { gap: .21, amp: .6, br: .3 }), .05, -.6);   // the vanaras: "hmm, no…"
T.at(PUSHG, tanpura(H0 - PUSHG + .4, 47, 1), .045, 0);
T.at(PUSHG + .2, chime(note(79), .6, 2), .05, .3);

// ================= H · Jambavan; the reflection; the eyes =================
for (let k = 0; k < 4; k++) { T.at(H0 + .1 + k * .4, mixb(woodTick(2, .8), noise(.05, { lp: 900, e: env.pluck(40), amp: .5 })), .1, -.6 + k * .12); }   // staff and paws
T.at(JSIT, thud(.6), .15, -.1); T.at(JSIT + .05, voice([[0, .3, 1, .3]], JMB, { fall: .3 }), .14, -.1);   // "oof"
T.at(51.7, talk(.9, JMB, { gap: .17, amp: 1, br: .35 }), .16, -.1);
T.at(REFL, mixb(shimmer(1.2, [note(84), note(88), note(91), note(96)], .6, .1), splash(.3)), .14, 0);
T.at(REFL + .4, voice([[0, .12, 1.2, .6], [.15, .12, 1.3, .6], [.3, .3, 1.5, .7]], BABY, { amp: .6 }), .07, -.3);   // a far-off baby giggle (memory)
T.at(REFL + .4, voice([[0, .12, 1.2, .6], [.15, .12, 1.3, .6], [.3, .3, 1.5, .7]], BABY, { amp: .35 }), .05, .3);
T.at(WIDE, tone(1.4, t => 300 + 600 * t / 1.4, { type: 'tri', e: env.swell(.3, .2), amp: .6 }), .05, 0);
T.at(WIDE + .1, shimmer(1.2, [note(91), note(96), note(100), note(103)], .5, .25), .1, 0);
T.at(WIDE + .7, heart(.5), .14, 0);

// ================= I · he remembers: the heroic swell =================
T.at(THUMP, heart(1), .45, 0); T.at(THUMP + .4, heart(1), .4, 0);
T.at(STAND - .05, whoosh(.4, 400, 2000), .14, .2);
T.at(STAND, brass(1.4, [50, 57, 62], 1, .05, .5), .14, 0);
T.at(GROW, mixb(whir(1.1, 1), noise(1.1, { brown: true, lp: t => 200 + 500 * t, e: env.swell(.1, .2), amp: 1 })), .14, 0);   // growing
for (let k = 0; k < 10; k++) T.at(GROW + k * .11, drum(70 + k * 4, .7 + k * .03, .25), .22, k % 2 ? .2 : -.2);   // a drum roll building
T.at(GROW + .1, brass(1.0, [55, 62, 67], 1, .3, .2), .16, 0);
// half a second of silence, then the roar
T.at(ROAR, roar(1.0, 140, 5, 1), .4, 0); T.at(ROAR, drum(45, 1, 1.2), .5, 0); T.at(ROAR + .02, thud(1), .35, 0);
T.at(ROAR + .05, noise(1.6, { brown: true, lp: 180, e: env.ad(.02, .6), amp: 1 }), .3, 0);
T.at(ROAR + .3, brass(1.3, [50, 57, 62, 66], 1, .05, .6), .2, 0);
T.at(ROAR + .4, conch(1.2, 311, 1), .12, 0);
T.at(TURN + .05, voice([[0, .1, 1, .5], [.14, .1, .95, .5], [.28, .14, .9, .5]], HAN, { fall: .15 }), .14, 0);   // a deep "heh heh heh"
T.at(WINK, mixb(bell(note(100), .6, { partials: [[1, 1], [2.7, .3]], k: 7 }), plink(note(103), .8)), .2, .2);
T.at(CROUCH, tone(.4, t => 200 + 800 * (t / .4) ** 2, { type: 'tri', e: env.swell(.05, .05), amp: .7 }), .12, 0);
T.at(LEAP, mixb(whoosh(.9, 300, 6000), drum(40, 1, 1)), .45, 0); T.at(LEAP + .02, thud(1), .25, 0);
T.at(LEAP + .05, brass(1.9, [55, 59, 62, 67], 1, .04, 1.0), .2, 0);
T.at(LEAP + .1, conch(1.6, 349, 1), .1, 0);
T.at(FLY0, shimmer(1.4, [note(91), note(96), note(100), note(103), note(108)], .6, .18), .1, -.4);
T.at(FLY0 + .2, whoosh(1.2, 2500, 800), .1, -.5);
T.at(J0 - .3, whoosh(.6, 400, 3000), .2, 0);                                            // the gold wipe

// ================= J · the ask; the card =================
T.at(J0 + .4, giggle(BABY, 1, 5), .15, 0);
T.at(J0 + .75, chime(note(91), .7, 1.2), .08, 0);
T.at(CARD - .3, whoosh(.6, 400, 3000), .2, 0);
[0, .15, .3].forEach((d, i) => T.at(CARD + .3 + d, pop(800 + i * 140, .9), .14, -.3 + i * .3));
T.at(CARD + 1.1, chime(note(84), .7, 1.4), .1, 0); T.at(CARD + 1.4, chime(note(91), .7, 1.4), .1, 0);
T.at(CARD + 1.7, pop(1000, 1), .16, 0); T.at(CARD + 2.1, chime(note(96), .6, 2), .08, 0);
T.at(CARD + .2, pad(3.6, [64, 67, 71, 76], 1, .5, 1.2), .05, 0);

T.write('assets/curse_sfx.wav');
