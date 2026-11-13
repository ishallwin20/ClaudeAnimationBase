// hanu21_sfx.mjs: the sound for "8 BOONS. 8 SIDDHIS. 9 NIDHIS." (src/scenes/hanu21.js, ad 90, Hanuman Part 2.1, no
// voice) → assets/hanu21_sfx.wav. Times are the scene's constants (keep them in sync). Retro synth cartoon foley as in
// Parts 1–4: pops for the badges, a hummed Chalisa phrase over a drone, chimes for the boon slots, a zap / twang / bonk
// off the shield, an om under the meditation, a fanfare note a step higher for each siddhi, a poof and a cat's "mrrp?",
// a rising rumble for Meru, Surasa's growls and his "hup"s, a zip in and out, a thud and rockfall for the mountain, a
// breeze and harp for the feather, a twinkle, a laddoo pop, a crown shimmer, a gust; coins-and-bells for Kubera and nine
// plinks for the nidhis; a warm swell for the giver, a harp for Sita's blessing; a music box under the ask; card pops.
//   node tools/hanu21_sfx.mjs && ffmpeg -y -i assets/hanu21_sfx.wav -af loudnorm=I=-16:TP=-1.5:LRA=11 -ar 48000 assets/hanu21_mix.wav
import { track, tone, noise, bell, mixb, env, whoosh, plink, squeak, click, thud, shimmer, slide, chime, drum, om, wind, note, seed, rnd, clamp, rumble, rockfall, splash, SR } from './sfx.mjs';

const LOOK = 1.2, SCRATCH = 2.6;
const B0 = 4.4, C0 = 9.0, QM = 11.4, D0 = 13.4, BOLT = 14.0, ARROW = 15.0, MACE = 16.0, E0 = 17.8;
const F1 = 22.6, SHRINK = 23.5, F2 = 26.8, GROW = 27.6, F3 = 31.0, SG = [31.4, 32.0, 32.6], THUMB = 33.3, INTO = 33.7, OUT = 34.3;
const F4 = 35.6, PRESS = 36.3, SINK = 36.5, LEAP = 36.7, F5 = 40.0, F6 = 44.0, F7 = 48.6, PAIR = 2.2;
const G0 = 53.2, H0 = 57.6, I0 = 62.4, K0 = 67.0, BLESS = 68.2, L0 = 71.8, M0 = 76.4, CARD = 80.8, END = 84.8;
const SFILL = [SHRINK, GROW, PRESS, F5 + .6, F6 + .5, F6 + PAIR + .9, F7 + .5, F7 + PAIR + .6];
const NFILL = [.4, .9, 1.4, 1.9, 2.4, 2.9, 3.4, 3.8, 4.2].map(d => H0 + d);
const ALLS = F7 + PAIR + 1.4;

const T = track(END);
seed(90);
// a buzzy cartoon voice: syllables [start, dur, pitch mul, brightness]
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
const HANU = 230, BABY = 380, SITAF = 330;
const giggle = (f, amp = 1, n = 4) => voice(Array.from({ length: n }, (_, i) => [i * .11, .08, 1.25 - i * .04, .7]), f, { amp, fall: .2 });
const huh = (f, amp = 1) => voice([[0, .32, 1, .6]], f, { amp, rise: .9, fall: 0 });
const ooh = (f, amp = 1) => voice([[0, .3, 1.1, .5]], f, { amp, rise: .3, fall: 0 });
const hup = (f, amp = 1) => voice([[0, .16, 1.2, .8]], f, { amp, fall: .3 });
const pop = (f = 900, amp = 1) => mixb(squeak(f * .6, f * 1.6, .07, amp), plink(f * 1.5, amp * .5));
const boing = (amp = 1, f = 220) => tone(.35, t => f * (1 + 2.2 * t) * (1 + .18 * Math.sin(t * 2 * Math.PI * 18) * Math.exp(-t * 6)), { type: 'tri', e: env.pluck(6), amp });
const pad = (dur, ms, amp = 1, a = 1.2, r = 1.4) => mixb(...ms.map((m, i) => tone(dur, t => note(m) * (1 + .003 * Math.sin(t * 2 + i)), { type: 'tri', e: env.swell(a, r), amp: amp / ms.length })));
const musicBox = f => bell(f, 1.6, { partials: [[1, 1], [3.0, .25], [5.1, .08]], k: 2.6 });
const harp = f => mixb(tone(1.2, f, { type: 'tri', e: env.pluck(3.5), amp: 1 }), tone(.6, f * 2, { e: env.pluck(8), amp: .25 }));
const poofS = (amp = 1) => mixb(noise(.45, { hp: 500, lp: 4000, e: env.pluck(7), amp }), slide(.35, 400, 1400, amp * .6), plink(1800, amp * .4));
const swell = (dur, ms, amp = 1) => mixb(...ms.map((m, i) => tone(dur, note(m), { type: 'tri', e: env.swell(dur * .45, dur * .5), amp: amp / ms.length })));
const zip = (up = 1, amp = 1) => mixb(slide(.22, up ? 500 : 2400, up ? 2400 : 500, amp * .6), noise(.22, { hp: 1500, lp: 6000, e: env.hann(), amp: amp * .4 }));
const zap = (amp = 1) => mixb(tone(.25, t => 1800 * Math.exp(-t * 9) + 200, { type: 'square', e: env.pluck(10), amp: amp * .35 }), noise(.2, { hp: 2000, lp: 8000, e: env.pluck(14), amp: amp * .5 }));
const twang = (amp = 1) => tone(.5, t => 180 * (1 + .25 * Math.sin(t * 2 * Math.PI * 22) * Math.exp(-t * 5)), { type: 'saw', e: env.pluck(5), amp: amp * .35 });
const bonk = (amp = 1) => mixb(tone(.25, t => 520 * Math.exp(-t * 5) + 220, { type: 'tri', e: env.pluck(10), amp }), click(amp * .6));
const growl = (dur, f = 70, amp = 1) => mixb(noise(dur, { lp: 500, hp: 40, e: env.swell(.08, .2), amp: amp * .8 }), tone(dur, t => f * (1 + .25 * Math.sin(t * 2 * Math.PI * 24)), { type: 'saw', e: env.swell(.08, .2), amp: amp * .4 }));
const mrrp = (amp = 1) => voice([[0, .14, 1, .5], [.14, .22, 1.4, .6]], 520, { amp, rise: .5, fall: 0 });
const twinkle = (amp = 1) => shimmer(.8, [note(96), note(100), note(103), note(108)], amp, .05);
const tick = (k, amp = .6) => plink(note(84 + k), amp);
const hum = (t0, ms, step = .32, f0 = HANU, amp = .8) => ms.forEach((m, i) => T.at(t0 + i * step, voice([[0, step * .92, note(m) / f0, .35]], f0, { amp, fall: 0 }), .1, 0));
// the siddhi fanfare: a drum and a note a step higher each time (pentatonic)
const SCALE = [0, 2, 4, 7, 9, 12, 14, 16, 19];
const fanfare = (i, base = 67) => mixb(chime(note(base + SCALE[i]), 1, 1.4), tone(.5, note(base + SCALE[i] - 12), { type: 'tri', e: env.pluck(4), amp: .5 }), drum(80, .5, .4));

// ================= A · the hook =================
T.at(0, pad(B0 + .3, [57, 64, 69, 73], 1, .2, .8), .06, 0);
[0, 1, 2].forEach(i => T.at(.05 + i * .12, pop(800 + i * 150, .6), .09, [-.6, .6, .6][i]));
T.at(LOOK, plink(note(81), .5), .08, -.5); T.at(LOOK + .5, plink(note(85), .5), .08, .5); T.at(LOOK + .95, plink(note(88), .5), .08, .5);
T.at(SCRATCH, mixb(pop(1100, .8), huh(HANU, 1)), .16, 0);
for (let k = 0; k < 6; k++) T.at(SCRATCH + .2 + k * .1, mixb(click(.4), noise(.06, { hp: 2000, lp: 6000, e: env.pluck(40), amp: .3 })), .05, .1);   // scratch scratch
T.at(B0 - .3, whoosh(.6, 400, 3000), .14, 0);

// ================= B · the Chalisa line, hummed over a drone =================
T.at(B0, mixb(tone(4.6, note(50), { type: 'tri', e: env.swell(.6, .8), amp: .5 }), tone(4.6, note(57), { type: 'tri', e: env.swell(.6, .8), amp: .35 }), tone(4.6, note(62), { e: env.swell(.6, .8), amp: .25 })), .1, 0);
hum(B0 + .5, [62, 62, 64, 66, 66, 64, 62, 64, 66, 69, 66], .34);   // "ash-ta sid-dhi nau ni-dhi ke da-ta"
T.at(B0 + .6, chime(note(86), .6, 1.6), .06, .2);
T.at(C0 - .3, whoosh(.6, 400, 3000), .12, 0);

// ================= C, D · the boons, the shield =================
for (let i = 0; i < 8; i++) T.at(C0 + .3 + i * .08, tick(i * 2, .5), .07, -.7 + i * .2);
T.at(C0 + .1, giggle(BABY, .9, 4), .1, 0);
T.at(QM, mixb(pop(1100, .8), huh(BABY, 1)), .15, .2);
T.at(D0 + .1, shimmer(1, [note(81), note(85), note(88), note(93)], .7, .07), .12, 0);
T.at(D0 + .2, tone(1, t => 300 + 40 * Math.sin(t * 30), { e: env.swell(.2, .6), amp: .3 }), .08, 0);   // the bubble hums up
T.at(BOLT - .25, slide(.25, 2400, 900, .5), .08, 0); T.at(BOLT, zap(1), .2, 0); T.at(BOLT + .05, boing(.7, 300), .12, .1);
T.at(ARROW - .3, whoosh(.3, 1500, 5000), .1, .6); T.at(ARROW, twang(1), .18, .4); T.at(ARROW + .05, plink(note(88), .5), .08, .4);
T.at(MACE - .3, whoosh(.3, 500, 1800), .1, -.6); T.at(MACE, bonk(1), .22, -.4); T.at(MACE + .05, boing(.7, 200), .12, -.4);
[BOLT, ARROW, MACE].forEach((h, i) => T.at(h + .3, giggle(BABY, .7, 3), .08, 0));
T.at(E0 - .3, whoosh(.6, 400, 3000), .12, 0);

// ================= E · the siddhis: a yogi's om =================
T.at(E0 + .1, om(4.6, 110, 1), .12, 0);
T.at(E0 + .3, pad(4.6, [50, 57, 62, 66], 1, 1, 1), .05, 0);
for (let i = 0; i < 8; i++) T.at(E0 + 1.0 + i * .1, tick(i, .45), .06, -.7 + i * .2);
T.at(E0 + 1.0, shimmer(1.4, [note(86), note(90), note(93)], .5, .1), .06, 0);
T.at(F1 - .3, whoosh(.6, 400, 3000), .12, 0);

// ================= the slots fill: a fanfare note each =================
SFILL.forEach((t, i) => T.at(t + .02, fanfare(i), .16, -.6 + i * .15));
for (let i = 0; i < 8; i++) T.at(ALLS + i * .1, plink(note(79 + SCALE[i]), .6), .08, -.7 + i * .2);

// ================= F1 · anima: the size of a cat =================
for (let t = F1 + .2; t < F2 - .3; t += .7 + rnd() * .8) T.at(t, mixb(...[0, .09, .18].map(d => { const b = tone(.06, 4200, { e: env.pluck(30), amp: .4 }); const o = new Float32Array(Math.round((.06 + d) * SR) + b.length); o.set(b, Math.round(d * SR)); return o; })), .04, rnd() * 1.4 - .7);   // crickets
T.at(SHRINK, poofS(1), .2, -.2); T.at(SHRINK + .05, slide(.35, 900, 2600, .5), .1, -.2); T.at(SHRINK + .2, squeak(2600, 3200, .08, .5), .08, -.2);
T.at(SHRINK + .5, mrrp(1), .13, .3);
for (let k = 0; k < 8; k++) T.at(SHRINK + 1.1 + k * .32, plink(note(88 + [0, 3, 7, 3][k % 4]), .5), .06, -.3 + k * .1);   // tiptoe
T.at(F2 - .3, whoosh(.6, 400, 3000), .12, 0);

// ================= F2 · mahima: like Meru =================
T.at(F2 + .1, pad(4, [45, 52, 57, 60], 1, .4, .6), .05, 0);
T.at(GROW, slide(1.6, 90, 520, .9), .2, 0); T.at(GROW, rumble(1.8, .8), .2, 0);
T.at(GROW + .1, whoosh(1.5, 200, 2500), .14, 0);
T.at(GROW + 1.6, mixb(drum(55, 1, .8), chime(note(74), .7, 1.6)), .2, 0);
T.at(GROW + .5, voice([[0, .4, 1.3, .7]], SITAF, { rise: .5 }), .12, -.5);   // Sita gasps
T.at(F3 - .3, whoosh(.6, 400, 3000), .12, 0);

// ================= F3 · Surasa =================
T.at(F3, mixb(noise(4.6, { lp: 800, hp: 100, e: env.swell(.5, .5), amp: .3 })), .06, .3);   // the sea
SG.forEach((t, i) => { T.at(t, growl(.45, 60 - i * 6, 1), .2, .5); T.at(t + .3, mixb(hup(HANU, 1), slide(.3, 200 + i * 80, 500 + i * 120, .5)), .14, -.5); });
T.at(THUMB, poofS(1), .2, -.4); T.at(THUMB + .05, squeak(2400, 3600, .1, .6), .1, -.4);
T.at(INTO, zip(1, 1), .2, 0); T.at(INTO + .25, mixb(click(.6), noise(.12, { lp: 600, e: env.pluck(20), amp: .5 })), .14, .4);
T.at(OUT, zip(0, 1), .2, .2); T.at(OUT + .05, pop(1000, .8), .14, .2);
T.at(OUT + .3, giggle(HANU, 1, 4), .12, -.3);
T.at(OUT + .7, voice([[0, .14, 1, .5], [.18, .14, 1.05, .5], [.36, .2, 1.1, .5]], 160, { fall: .2 }), .12, .5);   // Surasa laughs
T.at(F4 - .3, whoosh(.6, 400, 3000), .12, 0);

// ================= F4 · garima: the mountain sinks =================
T.at(F4 + .2, slide(1.0, 300, 120, .5), .1, 0);   // he crouches, heavier and heavier
T.at(PRESS, mixb(thud(1.2), drum(40, 1, 1)), .3, 0);
T.at(PRESS + .05, rockfall(1.4, .8), .16, 0);
T.at(LEAP, mixb(boing(.8, 200), whoosh(.6, 600, 3000)), .14, .5);
T.at(SINK, rumble(2.4, 1), .28, 0);
T.at(SINK + .3, slide(2, 160, 50, .6), .14, 0);
T.at(SINK + 2.0, thud(1), .2, 0);
T.at(F5 - .3, whoosh(.6, 400, 3000), .12, 0);

// ================= F5 · laghima: the feather =================
T.at(F5, wind(4, 0, 1), .12, 0);
for (let k = 0; k < 8; k++) T.at(F5 + .3 + k * .42, harp(note(72 + [0, 4, 7, 11, 12, 11, 7, 4][k])), .05, -.4 + k * .1);
T.at(F6 - .3, whoosh(.6, 400, 3000), .12, 0);

// ================= F6, F7 · prapti, prakamya, ishitva, vashitva =================
T.at(F6, pad(9.2, [52, 59, 64, 68], 1, .8, .8), .05, 0);
T.at(F6 + .3, slide(.3, 300, 700, .4), .06, .2);
T.at(F6 + .4, twinkle(1), .14, .2); T.at(F6 + .95, mixb(plink(note(93), .8), pop(1200, .6)), .12, .2);
T.at(F6 + PAIR + .2, mixb(pop(800, .7), ooh(HANU, .9)), .12, .3);
T.at(F6 + PAIR + .9, mixb(pop(900, 1), poofS(.6)), .16, .2); T.at(F6 + PAIR + 1.1, voice([[0, .25, 1, .4], [.3, .25, 1.15, .4]], HANU, { fall: .2 }), .12, 0);   // "mm-mm!"
T.at(F7 + .3, shimmer(1.4, [note(86), note(90), note(93), note(98)], .9, .07), .14, 0);
T.at(F7 + .3, tone(1.2, note(62), { type: 'saw', e: env.swell(.3, .6), amp: .25 }), .08, 0);
T.at(F7 + PAIR, wind(2.4, 1, .6), .18, .4);
T.at(F7 + PAIR + .5, mixb(whoosh(.8, 3000, 300), slide(.4, 900, 400, .4)), .18, -.5);   // the wind turns
T.at(G0 - .3, whoosh(.6, 400, 3000), .12, 0);

// ================= G, H · Kubera's nine treasures =================
T.at(G0, pad(9.2, [57, 61, 64, 69], 1, .6, .8), .05, 0);
for (let k = 0; k < 10; k++) T.at(G0 + .2 + k * .12, bell(note(91 + (k % 5) * 2), .5, { k: 8, amp: .5 }), .07, -.6 + k * .12);   // coins and bells
T.at(G0 + .4, shimmer(1.6, [note(81), note(85), note(88), note(93)], .8, .1), .1, 0);
for (let i = 0; i < 9; i++) T.at(G0 + 1.2 + i * .07, tick(i, .4), .05, -.7 + i * .17);
NFILL.forEach((t, i) => T.at(t, mixb(plink(note(72 + SCALE[i]), .9), pop(800 + i * 60, .4)), .14, -.7 + i * .17));
for (let i = 0; i < 9; i++) T.at(H0 + 4.6 + i * .08, plink(note(84 + SCALE[i]), .5), .07, -.7 + i * .17);
T.at(I0 - .3, whoosh(.6, 400, 3000), .12, 0);

// ================= I · the giver =================
T.at(I0, swell(4.6, [53, 60, 65, 69, 72], 1), .14, 0);
for (let k = 0; k < 17; k++) T.at(I0 + 1.0 + k * .17, plink(note(84 + SCALE[k % 9]), .4), .05, -.7 + (k % 9) * .17);
T.at(I0 + 1.4, chime(note(81), 1, 2), .12, 0);
T.at(K0 - .3, whoosh(.6, 400, 3000), .12, 0);

// ================= K · Sita's boon =================
T.at(K0, pad(4.8, [50, 57, 62, 65], 1, .8, .8), .06, 0);
for (let t = K0 + .2; t < L0 - .3; t += .7 + rnd() * .8) T.at(t, tone(.06, 4200, { e: env.pluck(30), amp: .3 }), .03, rnd() * 1.4 - .7);
for (let k = 0; k < 8; k++) T.at(BLESS - .2 + k * .08, harp(note(62 + [0, 4, 7, 12, 16, 19, 24, 28][k])), .06, -.5 + k * .12);
T.at(BLESS + .9, shimmer(1.6, [note(84), note(88), note(91), note(96)], .8, .1), .1, .3);
for (let k = 0; k < 3; k++) T.at(BLESS + 1.4 + k * .22, pop(800 + k * 120, .5), .07, .3);
T.at(L0 - .3, whoosh(.6, 400, 3000), .12, 0);

// ================= L · the summary =================
T.at(L0, pad(4.6, [57, 64, 69, 73], 1, .4, .8), .05, 0);
[L0 + .15, L0 + 1.3, L0 + 2.5].forEach((t, i) => { T.at(t, mixb(pop(800 + i * 200, .9), drum(70, .5, .4)), .16, [-.5, 0, .5][i]); T.at(t + .05, chime(note(76 + i * 4), .7, 1.2), .1, [-.5, 0, .5][i]); });
T.at(L0 + 3.2, giggle(HANU, .9, 4), .1, 0);

// ================= ask, card =================
{
  const TUNE = [2, 2, 4, 6, 6, 4, 2, 4, 6, 9, 6, 4];
  let i = 0;
  for (let t = M0 + .2; t < CARD - .2; t += .34) { const m = TUNE[i++ % TUNE.length]; T.at(t, musicBox(note(74 + m)), .08, i % 2 ? -.25 : .25); }
  T.at(M0, pad(CARD - M0, [50, 57, 62, 66], 1, .6, .8), .06, 0);
}
T.at(M0 + .9, mixb(pop(900, .7), pop(1100, .6)), .1, 0);
T.at(CARD, whoosh(.4, 3000, 600), .14, 0);
[.3, .45, .6].forEach((d, i) => T.at(CARD + d, pop(600 + i * 100, .8), .14, -.4 + i * .4));
T.at(CARD + 1.0, chime(note(81), 1, 1.6), .14, 0); T.at(CARD + 1.6, mixb(pop(900, .8), plink(note(88), .8)), .14, 0);
T.at(CARD + 2.2, shimmer(1.2, [note(81), note(85), note(88), note(93)], .7, .09), .12, 0);

T.write('assets/hanu21_sfx.wav');
console.log('assets/hanu21_sfx.wav', END + ' s');
