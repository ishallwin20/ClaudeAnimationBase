// rp9_sfx.mjs: the sound for Ramayan Part 9 (src/scenes/rp9.js, no voice) → assets/rp9_sfx.wav, then levelled to
// -16 LUFS → assets/rp9_mix.wav. Times come from src/scenes/rp9_tl.js. Retro cartoon foley as in Parts 6–8: a zoom and a
// GULP for the hook, a power-up and a stretchy grow, Mahendra's creak and rumble with squirting springs and flapping
// birds, the boing of the leap, Mainaka's splash and deep happy voice, Surasa's boing-stretch rounds, the tiny pop, the
// zip in and out, Simhika's grab and rubber-band stretch, pedalling squeaks, a bonk, bubbles, a tiptoe across Lanka,
// snores, a kiss and a woodblock dance, a record scratch and a sad trombone, the ring's twinkle. Quiet beds under it (the
// sea, wind, crickets); the only music is a soft tanpura and veena under Sita in the grove.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, plink, clang, click, thud, shimmer, slide, squeak, note, seed, rnd, clamp, chime, wind, drum, heart, conch, thunder, roar, splash, chirp, crinkle, rumble, crackle, SR } from './sfx.mjs';

const TL = runInNewContext(readFileSync('src/scenes/rp9_tl.js', 'utf8') + '\n;TL');
const { GULP, B0, C0, D0, E0, F0, G0, H0, I0, J0, K0, END, BIG, PRESS, LEAP, RISE, MAIN, THANKS, PAT, SURA, GROW, GROW1, GROW2, TINY, ZIPIN, ZIPOUT, BLESS,
  GRAB, SIMH, THRU, SANK, LAND, CAT, SHRINK, QUEEN, JOY, DOUBT, SHAKE, SING, LOOK, RING, TAKE, CARD } = TL;

const T = track(END);
seed(44);
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

const HANV = 210, SURV = 260, MAIV = 95, SIMV = 110, SITAV = 300;

// ---- A: the hook (sea, wind; a zoom whine as he dives at her mouth; GULP; "?")
T.at(0, stream(B0 + .2), .06, 0); T.at(0, wind(B0 + .2, 0, .5), .05, 0);
T.at(0, mixb(slide(GULP, 500, 1800, .5), whoosh(GULP, 800, 4000, .5)), .1, -.3);
T.at(GULP - .05, gulp(1), .22, 0);
T.at(GULP + .25, mixb(squeak(700, 1300, .2, .7), plink(note(91), .4)), .08, .4);
T.at(B0 - .3, whoosh(.6, 600, 3600), .2, 0);
// ---- B: the ident
T.at(B0, conch(1.6, 311, .7), .14, 0);
T.at(B0 + .35, pop(.8), .22, 0); T.at(B0 + .7, pop(.6, 1.2), .18, 0);
T.at(C0 - .3, whoosh(.6, 400, 2600), .18, 0);
// ---- C: Mahendra (birds, the sea; a power-up and a stretchy grow; the press: creaks and a rumble, squirts, flapping
// birds, a snake's "?"; the crouch and the leap: boing, whoosh)
T.at(C0, stream(D0 - C0), .05, .3);
for (let k = 0; k < 3; k++) T.at(C0 + .3 + k * 1.1, bird(2800 + k * 300, .5), .03, -.4 + k * .4);
T.at(BIG - .4, mixb(slide(1.1, 200, 1300, .6), tone(1.1, t => 100 + 300 * t, { type: 'saw', e: env.swell(.3, .2), amp: .12 })), .08, 0);
T.at(BIG - .2, stretch(1.0, 1), .12, 0);
T.at(BIG + .5, mixb(shimmer(1, [note(86), note(90), note(93), note(98)], .5, .06), drum(46, .8, 1)), .08, 0);
T.at(PRESS, creak(1.2, 1), .12, 0); T.at(PRESS, rumble(LEAP - PRESS, .8), .12, 0);
for (let k = 0; k < 4; k++) T.at(PRESS + .2 + k * .12, noise(.5, { hp: 900, lp: 5000, e: env.ad(.02, .4), amp: .7 }), .05, k % 2 ? .5 : -.5);   // squirts
for (let k = 0; k < 6; k++) T.at(PRESS + .3 + k * .12, mixb(noise(.08, { hp: 600, lp: 3000, e: env.pluck(40), amp: .6 }), bird(2600 + k * 200, .5)), .04, -.6 + k * .24);   // flap-flap
T.at(PRESS + .6, mixb(noise(.4, { hp: 3000, lp: 9000, e: env.ad(.02, .3), amp: .6 }), squeak(800, 1300, .2, .6)), .06, .2);   // the snake: "sss?"
T.at(LEAP - .5, creak(.5, .8), .1, 0);
T.at(LEAP, mixb(boing(1, 140), whoosh(.7, 400, 3800)), .2, 0);
T.at(LEAP + .05, voice([[0, .5, 1.2, .9]], HANV, { rise: .4 }), .09, 0);   // "hup!"
// ---- D: over the sea (the wind of flight; Mainaka bursts up: a splash and a harp; its deep happy voice; the pat,
// Hanuman's "thanks!", the zoom off)
T.at(D0, wind(E0 - D0, 2, .4), .1, 0); T.at(D0, stream(E0 - D0), .05, 0);
T.at(RISE, mixb(splash(1), rumble(.8, .6)), .2, .3);
T.at(RISE + .3, harp(true, .5), .07, .3);
T.at(MAIN, talk(THANKS - MAIN - .5, MAIV, { amp: .8, gap: .22, br: .4 }), .12, .3);
T.at(MAIN + .2, mixb(plink(note(91), .6), squeak(900, 1400, .15, .5)), .06, -.4);   // Hanuman's "!"
T.at(PAT, mixb(tok(1, .8), plink(note(98), .6)), .14, .2);
T.at(PAT + .05, talk(.6, HANV, { amp: .7, gap: .15, br: .7 }), .1, .1);
T.at(PAT + .1, shimmer(1, [note(91), note(96), note(100)], .4, .05), .06, .2);
T.at(PAT + .9, zip(1), .14, .5);
T.at(E0 - .3, whoosh(.6, 2200, 500), .14, 0);
// ---- E: Surasa (a splash, her voice "into my mouth!"; two rounds of boing-stretch and a creaky jaw; a tiny pop-shrink,
// zip in, a muffled gulp, "?", zip out with a pop; a chime and a harp for the blessing)
T.at(E0, stream(F0 - E0), .05, 0);
T.at(SURA, splash(1), .16, .4);
T.at(E0 + .5, talk(GROW - E0 - 1.2, SURV, { amp: .8, gap: .18, br: .7 }), .1, .4);
for (const g of [GROW1, GROW2]) { T.at(g, mixb(boing(1, 160), stretch(.6, .8)), .16, -.4); T.at(g + .45, creak(.4, 1), .14, .4); }
T.at(TINY - .1, poof(.8), .1, -.4); T.at(TINY, unpop(1), .14, -.4);
T.at(TINY + .1, mixb(squeak(2400, 2800, .1, .5), squeak(2600, 3000, .08, .4)), .06, -.4);   // a teeny "hi!"
T.at(ZIPIN, zip(1), .14, 0);
T.at(ZIPIN + .35, gulp(.6), .1, .4);
T.at(ZIPIN + .45, mixb(squeak(600, 1200, .2, .7), plink(note(91), .4)), .07, .4);   // "?"
T.at(ZIPOUT - .1, mixb(zip(1, false), pop(.9, 1.3)), .14, -.2);
T.at(ZIPOUT + .1, pop(1, .8), .16, -.4);
T.at(BLESS, mixb(chime(note(93), .7, 1.6), chime(note(98), .4, 1.6)), .08, .3);
T.at(BLESS + .3, harp(true, .5), .07, 0);
T.at(BLESS + .5, talk(1.2, SURV, { amp: .6, gap: .2, br: .5 }), .08, .4);
T.at(F0 - .3, whoosh(.6, 600, 2600), .14, 0);
// ---- F: Simhika (the wind of flight; a grab-thwack, a rubber-band stretch; pedalling squeaks; a deep growl as she rises;
// zip in, a bonk, zip out; she sinks with a slide whistle down and bubbles)
T.at(F0, wind(GRAB - F0 + .1, 3, .3), .1, 0); T.at(F0, stream(G0 - F0), .05, 0);
T.at(GRAB - .3, splash(.6), .1, .1);
T.at(GRAB, mixb(bonk(1, 220), noise(.1, { hp: 500, lp: 4000, e: env.pluck(30), amp: .8 })), .18, 0);
T.at(GRAB + .05, rubber(.9, 1), .07, 0);
T.at(GRAB + .1, voice([[0, .5, 1.3, .9]], HANV, { fall: .3, shake: .6 }), .09, -.2);   // "whoa!"
for (let s = GRAB + .5; s < THRU - .3; s += .16) T.at(s, squeak(1200, 1500, .07, .5), .03, -.3);   // pedalling
T.at(SIMH - .2, splash(1), .16, .4);
T.at(SIMH + .1, roar(1.2, SIMV, 5, .9), .08, .4);
T.at(THRU - .1, unpop(1), .12, -.2); T.at(THRU, zip(1), .14, .2);
T.at(THRU + .3, mixb(bonk(1, 300), drum(52, .8, .6)), .18, .4);
T.at(THRU + .4, zip(1, false), .14, 0); T.at(THRU + .7, pop(1, .9), .14, -.4);
T.at(SANK, slide(1, 1200, 200, .6), .08, .4);
T.at(SANK + .2, bubbles(1.2, 1), .07, .4);
T.at(SANK + .5, mixb(shimmer(.9, [note(86), note(90), note(93)], .4, .06)), .06, -.3);
T.at(G0 - .3, whoosh(.6, 2200, 500), .14, 0);
// ---- G: Lanka at dusk (a soft landing, a "ting" and a shimmer at the gold city; crickets; a poof; tiptoe plinks)
T.at(G0, stream(H0 - G0), .04, .3);
T.at(LAND - .3, whoosh(.3, 2500, 600), .1, 0); T.at(LAND, mixb(thud(.7), bomp(1, 70)), .14, -.4);
T.at(LAND + .4, mixb(chime(note(96), .8, 1.6), shimmer(1.4, [note(86), note(90), note(93), note(98), note(102)], .5, .08)), .08, .2);
T.at(CAT - .4, cricket(H0 - CAT + .4, 1), .03, .3);
T.at(SHRINK - .15, poof(.8), .1, -.4); T.at(SHRINK, unpop(.8), .12, -.4);
for (let s = SHRINK + .45, k = 0; s < H0 - .2; s += .3, k++) T.at(s, sneak(1, k % 2 ? 1 : 1.2), .05, -.3 + k * .05);
T.at(H0 - .3, whoosh(.5, 2200, 500), .1, 0);
// ---- H: the palace (soft snores; a gasp; "mwah", a little woodblock dance tune; a record-scratch stop; a "hmm"; a sad trombone)
room(H0, I0, .04);
T.at(H0, snore(I0 - H0, 1), .05, .3);
for (let s = H0 + .4, k = 0; s < QUEEN - .1; s += .32, k++) T.at(s, sneak(.8, k % 2 ? 1 : 1.15), .04, -.4);
T.at(QUEEN, voice([[0, .3, 1.3, .9]], HANV, { rise: .6 }), .09, -.4);   // a gasp
T.at(QUEEN + .2, mixb(chime(note(98), .6, 1.2), plink(note(103), .4)), .06, -.4);
T.at(JOY, boing(.8, 220), .1, -.4);
T.at(JOY + .7, mwah(1), .14, -.4);
T.at(JOY + .75, shimmer(.6, [note(96), note(100), note(103)], .4, .04), .05, -.4);
[[79, 0], [83, .25], [86, .5], [83, .75], [88, 1.0], [86, 1.25]].forEach(([m, s]) => T.at(JOY + 1 + s, mixb(tok(.9, note(m) / 1250), plink(note(m), .3)), .07, -.3));   // the dance tune
T.at(DOUBT, scratch(1), .12, 0);
T.at(DOUBT + .3, voice([[0, .7, .9, .3]], HANV, { fall: .05 }), .08, -.4);   // "hmm…"
T.at(SHAKE, mixb(squeak(900, 700, .12, .5), squeak(700, 900, .12, .5)), .05, -.4);
T.at(SHAKE + .3, trombone(1), .07, 0);
T.at(I0 - .3, whoosh(.5, 2200, 500), .1, 0);
// ---- I: the grove (crickets; a soft tanpura; his gentle voice and veena notes; Sita looks up: a "ting"; the ring:
// a twinkle; her sob of joy, a harp)
T.at(I0, cricket(J0 - I0, 1), .03, -.3);
T.at(I0, tanpura(J0 - I0 + .3, .7), .08, 0);
T.at(SING + .1, talk(RING - SING - .4, HANV, { amp: .55, gap: .19, br: .4 }), .08, -.3);
[[74, .3], [78, 1.1], [81, 1.9]].forEach(([m, s]) => T.at(SING + s, veena(m, .4), .05, -.2));
T.at(LOOK, mixb(chime(note(93), .6, 1.4)), .06, .2);
T.at(RING - .1, slide(.6, 1400, 600, .4), .05, -.2); T.at(RING + .5, mixb(thud(.4), sneak(.8)), .06, -.1);
T.at(RING + .5, mixb(shimmer(1.2, [note(91), note(96), note(100), note(103)], .5, .06), zing(.6)), .07, 0);
T.at(TAKE + .2, sob(3, SITAV, .6), .07, .2);
T.at(TAKE + .3, harp(true, .5), .06, 0);
T.at(TAKE + 1.2, veena(SA + 12, .45), .05, 0);
T.at(J0 - .3, whoosh(.6, 600, 2600), .14, 0);
// ---- J: the tease (night wind; a low drum, a spark crackle at the tail; "hehe")
T.at(J0, wind(K0 - J0, 1, .5), .05, 0);
T.at(J0 + .3, drum(44, .9, 1.2), .12, 0); T.at(J0 + 1.3, drum(44, .9, 1.2), .1, 0);
T.at(J0 + .5, crackle(K0 - J0 - .6, 1), .05, .3);
T.at(J0 + 1.6, voice([[0, .14, 1.1, .7], [.2, .14, 1.15, .7]], HANV), .1, -.2);   // "he-he"
T.at(K0 - .3, whoosh(.7, 400, 3200), .2, 0);
// ---- K: the card
room(K0, END, .03);
T.at(CARD.head, conch(1.5, 311, .6), .12, 0);
T.at(CARD.title, pop(.9), .22, 0); T.at(CARD.title + .2, pop(.7, 1.2), .18, 0);
T.at(CARD.pill, pop(1, 1.3), .22, 0);
T.at(CARD.ask, plink(note(93), .8), .14, 0);
for (let k = 0; k < 3; k++) T.at(CARD.books + k * .12, pop(.6, 1 + k * .15), .14, (k - 1) * .4);

T.write('assets/rp9_sfx.wav');
// level to -16 LUFS with a fixed gain (no dynamic loudnorm: it would pump the quiet beds up between the hits)
const probe = execFileSync('sh', ['-c', `ffmpeg -hide_banner -i assets/rp9_sfx.wav -af ebur128 -f null - 2>&1 | grep -E '^ +I:' | tail -1`], { encoding: 'utf8' });
const I = parseFloat(probe.match(/-?[\d.]+/)[0]), gain = -16 - I;
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'assets/rp9_sfx.wav', '-af', `volume=${gain.toFixed(2)}dB,alimiter=limit=0.84:level=false,aresample=48000`, '-ar', '48000', '-ac', '2', 'assets/rp9_mix.wav']);
console.log('assets/rp9_mix.wav', END.toFixed(2), 's,', I.toFixed(1), 'LUFS raw, +' + gain.toFixed(1), 'dB');
