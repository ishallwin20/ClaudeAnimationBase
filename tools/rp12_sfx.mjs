// rp12_sfx.mjs: the sound for Ramayan Part 12, the finale (src/scenes/rp12.js, no voice) → assets/rp12_sfx.wav, then
// levelled to -16 LUFS → assets/rp12_mix.wav. Times come from src/scenes/rp12_tl.js. Retro cartoon foley as in Parts
// 6–11: the twang-pop-boing of heads cut and regrown (faster and faster), hee-haws and Indra's chariot coming down with a
// shimmer, the sage's voice and Ram's chant three times over a soft tanpura, a power-up, Matali's lightbulb "ding", the
// Brahmastra's hum and zing, the flash-boom at the heart, the topple and the crowns clinking, the arrow whooshing home,
// a harp shower of petals and the monkeys' "woo!"s; a gentle reed tune for the homecoming and the end.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, plink, clang, click, thud, shimmer, slide, squeak, note, seed, rnd, clamp, chime, wind, drum, heart, conch, thunder, roar, splash, chirp, crinkle, rumble, crackle, fire, laughter, SR } from './sfx.mjs';

const TL = runInNewContext(readFileSync('src/scenes/rp12_tl.js', 'utf8') + '\n;TL');
const { GROWS, CUT, B0, C0, D0, E0, F0, G0, H0, I0, J0, K0, END, INDRA, MATALI, AGASTYA, THRICE, STRONG, CUTS, HUNDRED, LOOSE, HEART, FELL, BACK, KING, CROWN, CARD } = TL;

const T = track(END);
seed(47);
const lp = (b, fc) => { let l = 0; const a = 1 - Math.exp(-2 * Math.PI * fc / SR); for (let i = 0; i < b.length; i++) { l += a * (b[i] - l); b[i] = l; } return b; };
const add = (o, b, s0, g = 1) => { const s = Math.round(s0 * SR); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j] * g; return o; };
// a buzzy cartoon voice: syllables [start, dur, pitch ×, brightness 0..1]
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
// n syllables of mumbled talk over dur s
const talk = (dur, f, { gap = .17, amp = 1, br = .5, fall = .1, shake = 0 } = {}) =>
  voice(Array.from({ length: Math.max(1, Math.floor(dur / gap)) }, (_, i) => [i * gap, gap * .72, 1 + .14 * Math.sin(i * 2.3) - (i % 5 === 4 ? .12 : 0), br]), f, { amp, fall, shake });
const sob = (n, f, amp = 1) => voice(Array.from({ length: n }, (_, i) => [i * .32, .26, 1.1 - i * .04, .5]), f, { amp, fall: .35, shake: 1 });

const pop = (amp = 1, f = 1) => mixb(click(amp), tone(.07, t => f * (500 + 2600 * t / .07), { e: env.pluck(40), amp: amp * .7 }), noise(.05, { lp: 2500, hp: 300, e: env.pluck(60), amp: amp * .5 }));
const unpop = (amp = 1) => tone(.12, t => 2400 - 18000 * t, { e: env.pluck(20), amp });   // a pop in reverse: something shrinks away
const poof = (amp = 1) => noise(.45, { lp: 1800, hp: 200, e: env.ad(.02, .3), amp });      // a cloud puffs up
const tok = (amp = 1, f = 1) => mixb(tone(.07, 1250 * f, { type: 'tri', e: env.pluck(90), amp }), tone(.05, 2500 * f, { e: env.pluck(120), amp: amp * .3 }), click(amp * .4));   // woodblock
const bird = (f, amp = 1) => mixb(squeak(f, f * 1.4, .07, amp), squeak(f * 1.3, f * 1.1, .06, amp * .7));
const cricket = (dur, amp = 1) => { const o = new Float32Array(Math.round(dur * SR)); for (let k = 0; k * .7 < dur - .3; k++) for (let j = 0; j < 3; j++) add(o, tone(.03, 4300 + rnd() * 300, { e: env.hann(), amp }), k * .7 + j * .045 + rnd() * .08); return o; };
const harp = (up = true, amp = 1) => { const sc = [62, 64, 66, 69, 71, 74, 76, 78, 81, 83, 86, 88], o = new Float32Array(Math.round(2.2 * SR)); (up ? sc : [...sc].reverse()).forEach((m, i) => add(o, bell(note(m), 1.4, { partials: [[1, 1], [2, .3], [3, .1]], k: 2.6, amp }), i * .045)); return o; };
const tada = (amp = 1) => { const o = new Float32Array(Math.round(2.4 * SR)); [[74, 0], [78, .12], [81, .24], [86, .36]].forEach(([m, s]) => add(o, bell(note(m), 1.6, { partials: [[1, 1], [2, .4], [3, .15]], k: 2, amp }), s)); return o; };
const zing = (amp = 1) => mixb(bell(note(98), .8, { partials: [[1, 1], [2.4, .4]], k: 4, amp }), noise(.25, { hp: 2500, lp: 9000, e: env.pluck(14), amp: amp * .6 }), slide(.3, 2400, 3600, amp * .3));
// the bed's music: a tanpura (Pa Sa Sa low-Sa plucked over a held low Sa, D as Sa) and a veena note
const SA = 50;
const tanpura = (dur, amp = 1) => {
  const o = mixb(tone(dur, note(SA - 12), { type: 'tri', e: env.swell(1.2, .5), amp: .25 * amp }), tone(dur, note(SA - 5), { e: env.swell(1.2, .5), amp: .12 * amp }));
  const pl = [SA - 5, SA, SA, SA - 12];
  for (let k = 0; k * .6 < dur - .8; k++) add(o, bell(note(pl[k % 4]), 2.2, { partials: [[1, 1], [2, .5], [3, .3], [4, .2]], k: 1.1, amp: .22 * amp }), k * .6, Math.min(1, (dur - k * .6) / 1.5));
  return o;
};
const veena = (m, amp = 1) => mixb(bell(note(m), 1.6, { partials: [[1, 1], [2, .6], [3, .35], [5, .12]], k: 2.4, amp }), noise(.02, { hp: 2000, lp: 6000, e: env.pluck(80), amp: amp * .3 }));
const stream = (dur) => noise(dur, { lp: 1600, hp: 250, e: env.swell(.6, .6), amp: .4 });
const room = (a, b, g = .05) => T.at(a, noise(b - a, { lp: 500, hp: 60, e: env.swell(.4, .4), amp: .5 }), g, 0);
// the reel's own: a tuba footstep, the bow drawn and loosed, an arrow's thwip, a bonk, a sword's shing, a scream,
// war horns, an 8-bit victory jingle, a clock's tick and tock
const bomp = (amp = 1, f = 62) => lp(tone(.2, t => f * (1 - .25 * t / .2), { type: 'saw', e: env.pluck(16), amp }), 700);
const creak = (dur = .6, amp = 1) => mixb(slide(dur, 180, 420, .4 * amp), noise(dur, { hp: 300, lp: 1500, e: env.hann(), amp: .3 * amp }));
const twang = (amp = 1) => mixb(tone(.3, t => 196 * (1 + .25 * Math.exp(-t * 30)), { type: 'tri', e: env.pluck(14), amp }), whoosh(.25, 1500, 5000, amp * .5));
const thwip = (amp = 1) => mixb(whoosh(.13, 2500, 7000, amp), tone(.1, t => 1800 - 6000 * t, { e: env.pluck(30), amp: amp * .15 }));
const bonk = (amp = 1, f = 520) => mixb(tone(.14, t => f * (1 - 2.4 * t), { e: env.pluck(26), amp }), tone(.1, f * 2.1, { e: env.pluck(60), amp: amp * .25 }), click(amp * .5));
const shing = (amp = 1) => mixb(clang(note(98), amp * .8), noise(.35, { hp: 3000, lp: 11000, e: env.pluck(9), amp: amp * .7 }), slide(.3, 2600, 5200, amp * .3));
const scream = (dur, f, { amp = 1, fall = .2 } = {}) => voice([[0, dur, 1.3, .95]], f, { amp, fall, shake: 1 });
const horn = (dur, m = 43, amp = 1) => lp(mixb(tone(dur, t => note(m) * (1 + .01 * Math.sin(t * 2 * Math.PI * 5)), { type: 'saw', e: env.swell(.25, .4), amp }), tone(dur, note(m + 7), { type: 'saw', e: env.swell(.3, .4), amp: amp * .5 })), 900);
const chip = (m, d, amp = 1) => tone(d, note(m), { type: 'square', e: env.swell(.005, .03), amp });
const jingle = (amp = 1) => { const o = new Float32Array(Math.round(1.4 * SR)); [[72, 0, .08], [76, .09, .08], [79, .18, .08], [84, .27, .08], [79, .36, .08], [84, .45, .6]].forEach(([m, s, d]) => { add(o, chip(m, d, amp), s); add(o, chip(m - 12, d, amp * .4), s); }); return lp(o, 5000); };
const tick = (amp = 1, f = 1) => mixb(tok(amp, f), click(amp * .3));
const scurry = (dur, amp = 1, gap = .085) => { const o = new Float32Array(Math.round((dur + .2) * SR)); for (let k = 0; k * gap < dur; k++) add(o, tok(amp * (.7 + .3 * rnd()), k % 2 ? .62 : .7), k * gap); return o; };
const pant = (dur, f, amp = 1) => voice(Array.from({ length: Math.floor(dur / .22) }, (_, i) => [i * .22, .12, i % 2 ? .9 : 1.05, .25]), f, { amp, fall: .3 });

const bells = (amp = 1) => { const o = new Float32Array(Math.round(1.2 * SR)); for (let i = 0; i < 9; i++) add(o, bell(note(100 + (i % 3) * 3) * (1 + .01 * rnd()), .5, { partials: [[1, 1], [2.7, .4]], k: 6, amp: amp * (.5 + .5 * rnd()) }), i * .05 + .02 * rnd()); return o; };
const ow = (f, amp = 1) => voice([[0, .35, 1.3, .8]], f, { amp, fall: .6 });
const scuffle = (dur, amp = 1) => { const o = new Float32Array(Math.round((dur + .3) * SR)); for (let s = 0; s < dur; s += .09 + .12 * rnd()) add(o, rnd() < .35 ? bonk(amp * .7, 350 + 300 * rnd()) : noise(.12, { hp: 300, lp: 2500, e: env.pluck(30), amp: amp * .6 }), s); return o; };
const steps = (a, b, gap, g, f = 62, pan = 0) => { for (let s = a; s < b - .05; s += gap) T.at(s, bomp(1, f * (1 + .04 * Math.sin(s * 9))), g, pan); };

const sneak = (amp = 1, f = 1) => mixb(tone(.06, 1900 * f, { type: 'tri', e: env.pluck(70), amp }), click(amp * .2));   // a tiptoe plink
const boing = (amp = 1, f0 = 180) => tone(.5, t => f0 * (1 + .6 * Math.sin(t * 40) * Math.exp(-t * 6)) * (1 + t * .6), { type: 'tri', e: env.pluck(5), amp });
const zip = (amp = 1, up = true) => mixb(slide(.28, up ? 600 : 2400, up ? 2600 : 500, amp * .6), whoosh(.3, 1500, 6000, amp * .6));
const gulp = (amp = 1) => mixb(tone(.22, t => 260 - 700 * t, { type: 'tri', e: env.pluck(14), amp }), noise(.12, { lp: 900, hp: 100, e: env.pluck(30), amp: amp * .5 }));
const snore = (dur, amp = 1) => { const o = new Float32Array(Math.round(dur * SR)); for (let s = 0; s + 1.6 < dur; s += 2.2) { add(o, lp(noise(1.0, { lp: 600, hp: 80, e: env.hann(), amp }), 500), s); add(o, slide(.8, 900, 1300, amp * .12), s + 1.1); } return o; };
const scratch = (amp = 1) => mixb(noise(.25, { hp: t => 800 + 4000 * Math.sin(t * 40) ** 2, lp: 7000, e: env.pluck(10), amp }), tone(.2, t => 600 - 1500 * t, { type: 'saw', e: env.pluck(14), amp: amp * .3 }));
const trombone = (amp = 1) => { const o = new Float32Array(Math.round(2 * SR)); [[55, 0, .32], [54, .34, .32], [53, .68, .32], [52, 1.02, .8]].forEach(([m, s, d]) => add(o, lp(tone(d, t => note(m) * (1 + .015 * Math.sin(t * 30)), { type: 'saw', e: env.swell(.03, .1), amp }), 1100), s)); return o; };
const mwah = (amp = 1) => mixb(noise(.06, { hp: 1500, lp: 6000, e: env.pluck(50), amp }), tone(.12, t => 900 + 1200 * t, { e: env.pluck(25), amp: amp * .5 }));
const stretch = (dur, amp = 1) => mixb(slide(dur, 120, 520, amp * .5), tone(dur, t => 90 + 200 * t / dur, { type: 'saw', e: env.swell(.05, .1), amp: amp * .15 }));
const rubber = (dur, amp = 1) => tone(dur, t => 110 + 40 * Math.sin(t * 50), { type: 'saw', e: env.swell(.05, .2), amp });
const bubbles = (dur, amp = 1) => { const o = new Float32Array(Math.round((dur + .2) * SR)); for (let s = 0; s < dur; s += .08 + .12 * rnd()) add(o, tone(.06, t => (500 + 600 * rnd()) * (1 + t * 12), { e: env.pluck(40), amp: amp * (.5 + .5 * rnd()) }), s); return o; };



const HANV = 210, RAMV = 150, RAVV = 105, AGV = 170, MATV = 160;
const boing2 = (amp = 1, f0 = 220) => tone(.45, t => f0 * (1 + .6 * Math.sin(t * 44) * Math.exp(-t * 7)) * (1 + t * .8), { type: 'tri', e: env.pluck(6), amp });
const hum2 = (dur, amp = 1, rise = 0) => mixb(tone(dur, t => (180 + rise * 200 * t / dur) * (1 + .01 * Math.sin(t * 30)), { type: 'saw', e: env.swell(.4, .3), amp: amp * .3 }), tone(dur, t => 360 + rise * 400 * t / dur, { e: env.swell(.4, .3), amp: amp * .4 }));
// a gentle reed tune (a shehnai-like voice) for the homecoming and the end: a slow phrase in D
const reed = (m, d, amp = 1) => lp(tone(d, t => note(m) * (1 + .006 * Math.sin(t * 2 * Math.PI * 5.5)), { type: 'saw', e: env.swell(.06, .2), amp }), 1800);
const tune = (amp = 1) => { const o = new Float32Array(Math.round(6 * SR)); [[74, 0, .5], [76, .5, .5], [78, 1, .9], [76, 1.9, .4], [74, 2.3, .4], [71, 2.7, .8], [74, 3.5, 1.4]].forEach(([m, s, d]) => add(o, reed(m, d, amp), s)); return o; };

// ---- A: the hook (battle wind; a twang and thwip; the head pops off; a boing as it grows back with a sparkle; "?")
T.at(0, wind(B0 + .2, 0, .5), .07, 0);
T.at(CUT - .3, mixb(twang(1), thwip(1)), .14, -.4);
T.at(CUT, mixb(pop(1, .7), slide(.6, 900, 300, .5)), .16, .3);
T.at(GROWS - .3, boing2(1, 240), .14, .3);
T.at(GROWS - .1, shimmer(.6, [note(96), note(100), note(103)], .4, .04), .06, .3);
T.at(GROWS, mixb(squeak(700, 1300, .2, .7), plink(note(91), .4)), .08, .4);
T.at(B0 - .3, whoosh(.6, 600, 3600), .2, 0);
// ---- B: the ident
T.at(B0, conch(1.6, 311, .7), .14, 0);
T.at(B0 + .35, pop(.8), .22, 0); T.at(B0 + .7, pop(.6, 1.2), .18, 0);
T.at(C0 - .3, whoosh(.6, 2200, 500), .14, 0);
// ---- C: the chariots (war drums; Ravana's donkeys hee-haw; Indra's chariot comes down: a shimmer, hooves, a whinny; Matali)
T.at(C0, wind(D0 - C0, 1, .5), .06, 0);
for (let k = 0; k < 4; k++) T.at(C0 + .2 + k * .7, drum(44, .8, .7), .08, .2);
T.at(C0 + .6, mixb(voice([[0, .3, 1.4, .8], [.35, .4, .9, .6]], 260, { shake: .3 })), .07, .5);   // hee-haw
T.at(INDRA, mixb(shimmer(1.6, [note(86), note(90), note(93), note(98), note(102)], .5, .1), whoosh(1.2, 3000, 800)), .1, -.4);
T.at(INDRA + .4, scurry(.8, .9, .1), .07, -.4);   // hooves
T.at(INDRA + 1.2, mixb(thud(.6), voice([[0, .6, 1.6, .9]], 420, { fall: .5, shake: .8 })), .07, -.4);   // a whinny
T.at(MATALI, talk(D0 - MATALI - .4, MATV, { amp: .7, gap: .18, br: .6 }), .09, -.4);
T.at(D0 - .3, whoosh(.5, 600, 2600), .12, 0);
// ---- D: the hymn (a soft tanpura; the sage's voice; Ram's chant x3 with a rising shimmer; a power-up for new strength)
T.at(D0, tanpura(E0 - D0, .7), .08, 0);
steps(D0, AGASTYA + .6, .2, .05, 90, -.4);
T.at(AGASTYA + .6, talk(THRICE - AGASTYA - .9, AGV, { amp: .65, gap: .2, br: .5 }), .09, -.4);
for (let k = 0; k < 3; k++) { T.at(THRICE + k * .45, voice([[0, .38, 1 + k * .05, .4]], RAMV, { rise: .1 }), .07, 0); T.at(THRICE + k * .45 + .1, chime(note(86 + k * 4), .4, 1.2), .05, 0); }
T.at(STRONG - .3, mixb(slide(1, 200, 1400, .6), tone(1, t => 100 + 300 * t, { type: 'saw', e: env.swell(.3, .2), amp: .12 })), .08, 0);
T.at(STRONG + .4, mixb(shimmer(1.2, [note(86), note(90), note(93), note(98)], .5, .06), drum(46, .9, 1)), .1, 0);
// ---- E: the heads (twang + thwip + pop off + boing back, faster and faster; Ram's panting)
T.at(E0, wind(F0 - E0, 2, .5), .05, 0);
for (const c of CUTS) { T.at(c - .3, mixb(twang(.8), thwip(.8)), .1, -.4); T.at(c, pop(.9, .8), .13, .3); T.at(c + .35, boing2(.8, 220 + 20 * Math.sin(c)), .1, .3); }
for (let s = HUNDRED + .1; s < F0 - .2; s += .2) { T.at(s, pop(.6, .7 + (s * 7 % 3) * .1), .08, .3); T.at(s + .3, boing2(.5, 260), .05, .3); }
T.at(HUNDRED, mixb(voice([[0, .14, 1.1, .7], [.2, .14, 1.15, .7], [.4, .3, 1.2, .8]], RAVV + 40)), .08, .4);   // the heads laugh
T.at(HUNDRED + .5, pant(F0 - HUNDRED - .6, RAMV, .7), .06, -.4);
// ---- F: Matali's tip (his voice; a lightbulb "ding")
T.at(F0, wind(G0 - F0, 1, .5), .05, 0);
T.at(F0 + .3, talk(G0 - F0 - .7, MATV, { amp: .75, gap: .17, br: .6 }), .1, -.4);
T.at(F0 + 1.2, mixb(bell(note(96), 1.2, { partials: [[1, 1], [2.76, .4]], k: 3, amp: 1 }), click(.3)), .1, .2);
// ---- G: the Brahmastra (a rising hum; a hush; LOOSE: a great zing; HEART: a flash-boom; FELL: a slow topple and a thud,
// crowns clinking; BACK: a whoosh home and a "shk" into the quiver)
T.at(G0 + .2, hum2(LOOSE - G0 - .1, 1, 1), .1, -.3);
T.at(G0 + .3, creak(LOOSE - G0 - .4, 1), .1, -.4);
T.at(LOOSE, mixb(twang(1), zing(1), whoosh(.5, 1000, 6000)), .16, -.2);
T.at(HEART, mixb(drum(38, 1, 1.6), thunder(1.6, .6), shimmer(1.2, [note(86), note(91), note(98)], .5, .05)), .16, .3);
T.at(HEART + .2, roar(1.2, RAVV, 10, .8), .07, .4);
T.at(FELL - .4, slide(.9, 400, 120, .5), .07, .4);
T.at(FELL + .4, mixb(thud(1), rumble(1, .6)), .16, .4);
for (let k = 0; k < 4; k++) T.at(FELL + .5 + k * .15, clang(note(84 + k * 3), .4), .05, .2 + k * .1);
T.at(BACK, mixb(whoosh(.6, 4000, 1000), shimmer(.8, [note(98), note(93), note(91)], .4, .1)), .12, -.1);
T.at(BACK + .6, mixb(click(.8), noise(.1, { hp: 1500, lp: 6000, e: env.pluck(40), amp: .6 })), .1, -.4);
T.at(H0 - .3, whoosh(.5, 600, 2600), .12, 0);
// ---- H: the flowers (a sparkling harp shower; the monkeys cheer; a fanfare)
T.at(H0, harp(true, .6), .08, 0); T.at(H0 + .8, harp(false, .5), .06, 0);
T.at(H0 + .2, laughter(I0 - H0 - .3, .6), .05, 0);
for (let k = 0; k < 6; k++) T.at(H0 + .3 + k * .4, voice([[0, .2, 1.3, .9]], 230 + k * 15, { rise: .5 }), .05, -.5 + k * .2);   // "woo!"
T.at(H0 + .4, tada(1), .1, 0);
T.at(I0 - .3, whoosh(.6, 2200, 500), .12, 0);
// ---- I: home (the wind in the sky; the reed tune; the coronation: a conch, bells, a harp, petals)
T.at(I0, wind(KING - I0, 1, .5), .05, 0);
T.at(I0 + .2, tune(1), .06, 0);
T.at(I0 + .4, tanpura(J0 - I0, .5), .05, 0);
T.at(KING - .3, whoosh(.5, 2200, 500), .1, 0);
T.at(KING, conch(1.8, 311, .7), .12, 0);
T.at(CROWN, mixb(chime(note(93), .7, 1.6), chime(note(98), .5, 1.6), shimmer(1.2, [note(86), note(90), note(93), note(98), note(102)], .4, .08)), .08, 0);
for (let k = 0; k < 4; k++) T.at(KING + .6 + k * .5, bell(note(81 + (k % 2) * 4), 1.2, { partials: [[1, 1], [2.7, .4]], k: 3, amp: .6 }), .05, -.4 + k * .25);
T.at(J0 - .3, whoosh(.6, 600, 2600), .12, 0);
// ---- J: the end (the reed tune once more; a final conch)
T.at(J0 + .1, tune(1), .06, 0);
T.at(J0 + .3, harp(true, .5), .06, 0);
T.at(K0 - .3, whoosh(.7, 400, 3200), .2, 0);
// ---- K: the card
room(K0, END, .03);
T.at(CARD.head, conch(1.5, 311, .6), .12, 0);
T.at(CARD.title, pop(.9), .22, 0); T.at(CARD.title + .2, pop(.7, 1.2), .18, 0);
T.at(CARD.pill, pop(1, 1.3), .22, 0);
T.at(CARD.ask, plink(note(93), .8), .14, 0);
for (let k = 0; k < 3; k++) T.at(CARD.books + k * .12, pop(.6, 1 + k * .15), .14, (k - 1) * .4);

T.write('assets/rp12_sfx.wav');
// level to -16 LUFS with a fixed gain (no dynamic loudnorm: it would pump the quiet beds up between the hits)
const probe = execFileSync('sh', ['-c', `ffmpeg -hide_banner -i assets/rp12_sfx.wav -af ebur128 -f null - 2>&1 | grep -E '^ +I:' | tail -1`], { encoding: 'utf8' });
const I = parseFloat(probe.match(/-?[\d.]+/)[0]), gain = -16 - I;
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'assets/rp12_sfx.wav', '-af', `volume=${gain.toFixed(2)}dB,alimiter=limit=0.84:level=false,aresample=48000`, '-ar', '48000', '-ac', '2', 'assets/rp12_mix.wav']);
console.log('assets/rp12_mix.wav', END.toFixed(2), 's,', I.toFixed(1), 'LUFS raw, +' + gain.toFixed(1), 'dB');
