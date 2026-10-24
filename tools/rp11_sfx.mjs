// rp11_sfx.mjs: the sound for Ramayan Part 11 (src/scenes/rp11.js, no voice) → assets/rp11_sfx.wav, then levelled to
// -16 LUFS → assets/rp11_mix.wav. Times come from src/scenes/rp11_tl.js. Retro cartoon foley as in Parts 6–10: the sea,
// a magic whoosh as Vibhishana flies in, the monkeys' angry chatter and their "ooh?!", a ticking day-night cycle with
// crickets and a soft tanpura, twangs and splashes as the arrows hit, panicked fish bloops and a crab's snaps, the
// Brahmastra's rising hum and thunder, the Ocean's rise, a zing as the arrow flies north, Nala's "yes!", boulders
// thunking down and a chime for each day, marching tuba feet, Ravana's ten-head growl.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, plink, clang, click, thud, shimmer, slide, squeak, note, seed, rnd, clamp, chime, wind, drum, heart, conch, thunder, roar, splash, chirp, crinkle, rumble, crackle, fire, laughter, SR } from './sfx.mjs';

const TL = runInNewContext(readFileSync('src/scenes/rp11_tl.js', 'utf8') + '\n;TL');
const { B0, C0, D0, E0, F0, G0, H0, I0, END, ARRIVE, SPY, SAFE, DAYS, SHOOT, ASTRA, RISE, NORTH, FLY, NALA, FIVE, MARCH, CARD } = TL;

const T = track(END);
seed(46);
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



const HANV = 210, RAMV = 150, SUGV = 190, VIBV = 150, SAGV = 120, NALV = 230, RAVV = 105;
const bloop = (amp = 1, f = 1) => tone(.14, t => (300 + 900 * t / .14) * f, { e: env.pluck(20), amp });
const snap = (amp = 1) => mixb(click(amp), tone(.05, 2200, { e: env.pluck(80), amp: amp * .4 }));
const hum2 = (dur, amp = 1, rise = 0) => mixb(tone(dur, t => (180 + rise * 200 * t / dur) * (1 + .01 * Math.sin(t * 30)), { type: 'saw', e: env.swell(.4, .3), amp: amp * .3 }), tone(dur, t => 360 + rise * 400 * t / dur, { e: env.swell(.4, .3), amp: amp * .4 }));

// ---- A: the hook (a stormy sea; the bow held drawn; a heartbeat)
T.at(0, stream(B0 + .2), .08, .3); T.at(0, wind(B0 + .2, 0, .5), .07, 0);
T.at(0, creak(1.4, .9), .1, -.4);
for (let k = 0; k < 3; k++) T.at(.2 + k * .9, heart(.9), .13, 0);
T.at(B0 - .35, twang(.8), .12, -.4); T.at(B0 - .3, whoosh(.6, 600, 3600), .2, 0);
// ---- B: the ident
T.at(B0, conch(1.6, 311, .7), .14, 0);
T.at(B0 + .35, pop(.8), .22, 0); T.at(B0 + .7, pop(.6, 1.2), .18, 0);
T.at(C0 - .3, whoosh(.6, 400, 2600), .18, 0);
// ---- C: Vibhishana (the sea; a magic whoosh in; his voice; the monkeys' angry chatter and hops; Ram's calm voice; "ooh?!")
T.at(C0, stream(D0 - C0), .06, .3);
for (let k = 0; k < 3; k++) T.at(C0 + .3 + k * 1.3, bird(2800 + k * 300, .5), .03, -.4 + k * .4);
T.at(C0 + .1, mixb(whoosh(1.3, 3000, 600), shimmer(1, [note(86), note(90), note(93)], .4, .1)), .08, .5);
T.at(ARRIVE, talk(SPY - ARRIVE - .3, VIBV, { amp: .6, gap: .2, br: .4 }), .09, .4);
T.at(SPY, mixb(talk(SAFE - SPY - .2, SUGV, { amp: .9, gap: .11, br: .9 }), talk(SAFE - SPY - .4, SUGV + 60, { amp: .7, gap: .09, br: .9 })), .08, -.4);
for (let s = SPY; s < SAFE - .1; s += .3) T.at(s, bomp(.8, 80), .05, -.4);   // hop-hop
T.at(SAFE + .1, talk(D0 - SAFE - .6, RAMV, { amp: .75, gap: .18, br: .5 }), .1, -.1);
T.at(SAFE + .3, mixb(voice([[0, .4, 1.2, .7]], SUGV, { rise: .5 }), slide(.3, 500, 1100, .5)), .08, -.4);   // "ooh?!"
T.at(SAFE + .5, harp(true, .4), .06, .3);
T.at(D0 - .3, whoosh(.5, 2200, 500), .12, 0);
// ---- D: three days (a soft tanpura; crickets by night, birds by day, a chime each day; a tick-tock; "hmm")
T.at(D0, tanpura(E0 - D0 + .2, .7), .08, 0);
T.at(D0, stream(E0 - D0), .04, .3);
const per = (E0 - D0 - .6) / 3;
for (let d = 0; d < 3; d++) { T.at(D0 + d * per + per * .3, cricket(per * .5, 1), .03, .3); T.at(D0 + d * per + per * .9, bird(2900, .5), .03, -.3); T.at(D0 + d * per + .5, chime(note(91 + d * 2), .4, 1.2), .05, .3); }
for (let s = D0 + .2; s < E0 - .5; s += .5) T.at(s, tick(.6, Math.round((s - D0) * 2) % 2 ? .8 : 1), .03, .5);
T.at(DAYS + .3, voice([[0, .7, .9, .3]], RAMV, { fall: .1 }), .08, -.2);   // "hmm."
T.at(E0 - .3, mixb(whoosh(.5, 500, 2200), thunder(1.2, .5)), .1, 0);
// ---- E: anger (wind rising; three twangs and splashes; fish bloops, crab snaps; the Brahmastra's hum and thunder)
T.at(E0, wind(F0 - E0, 2, .5), .1, 0);
T.at(E0 + .2, stream(F0 - E0), .1, .3);
for (const s of [SHOOT, SHOOT + .6, SHOOT + 1.2]) { T.at(s - .5, creak(.45, .8), .08, -.4); T.at(s, mixb(twang(1), thwip(1)), .14, -.3); T.at(s + .33, splash(.9), .14, .4); }
for (let k = 0; k < 8; k++) T.at(SHOOT + .5 + k * .3, bloop(.8, 1 + (k % 3) * .2), .06, .2 + (k % 3) * .2);
for (let k = 0; k < 6; k++) T.at(SHOOT + 1 + k * .22, snap(.8), .05, .5);
T.at(SHOOT + .3, rumble(ASTRA - SHOOT, .7), .08, 0);
T.at(ASTRA, hum2(F0 - ASTRA + 1.2, 1, 1), .1, -.3);
T.at(ASTRA + .4, thunder(2, .8), .1, 0);
T.at(F0 - .2, thunder(1.5, 1), .08, 0);
// ---- F: the Ocean rises (a great splash and a harp; his deep voice; the arrow flies north: a zing, a boom; Nala's "yes!")
T.at(F0, stream(G0 - F0), .07, .3);
T.at(RISE, mixb(splash(1), rumble(1, .6)), .2, .4);
T.at(RISE + .4, harp(true, .5), .07, .4);
T.at(F0 + .8, talk(NORTH - F0 - 1.1, SAGV, { amp: .8, gap: .22, br: .4 }), .1, .4);
T.at(NORTH + .1, creak(FLY - NORTH - .2, 1), .1, -.4);
T.at(FLY, mixb(twang(1), zing(1), slide(.7, 800, 4000, .6)), .14, -.2);
T.at(FLY + .5, mixb(drum(40, 1, 1.5), thunder(1.5, .4)), .1, 0);
T.at(NALA + .1, talk(G0 - NALA - .5, SAGV, { amp: .7, gap: .22, br: .4 }), .09, .4);
T.at(NALA + .3, pop(.9, 1), .14, -.1);
T.at(NALA + .4, voice([[0, .3, 1.1, .8], [.35, .3, 1.3, .9]], NALV, { rise: .3 }), .09, -.1);   // "yes-yes!"
T.at(G0 - .3, whoosh(.5, 600, 2600), .12, 0);
// ---- G: the bridge (the sea; boulders thunking down; a chime each new day; then marching tuba feet and horns)
T.at(G0, stream(H0 - G0), .06, .3);
for (let s = G0 + .5; s < MARCH - .2; s += .6) T.at(s, mixb(thud(.6), bomp(.8, 70)), .07, .3);
for (let d = 0; d < 5; d++) T.at(G0 + .2 + d * (FIVE + 2.4 - G0) / 5, chime(note(86 + d * 2), .6, 1.2), .06, .4);
T.at(G0 + .3, talk(FIVE - G0 - .3, NALV, { amp: .6, gap: .14, br: .7 }), .06, .4);
T.at(FIVE + 2.6, tada(.8), .08, 0);
steps(MARCH, H0 - .2, .27, .1, 62, 0);
for (let k = 0; k < 4; k++) T.at(MARCH + .2 + k * .6, horn(.4, 50 + (k % 2) * 5, .5), .04, 0);
T.at(H0 - .3, whoosh(.6, 2200, 500), .14, 0);
// ---- H: the finale tease (a low wind, war drums; Ravana's ten-head growl)
T.at(H0, wind(I0 - H0, 3, .5), .06, 0);
T.at(H0 + .2, drum(42, 1, 1.2), .12, 0); T.at(H0 + 1.1, drum(42, 1, 1.2), .12, 0); T.at(H0 + 2, drum(40, 1, 1.4), .14, 0);
T.at(H0 + .5, roar(1.6, RAVV, 10, .9), .08, 0);
T.at(I0 - .3, whoosh(.7, 400, 3200), .2, 0);
// ---- I: the card
room(I0, END, .03);
T.at(CARD.head, conch(1.5, 311, .6), .12, 0);
T.at(CARD.title, pop(.9), .22, 0); T.at(CARD.title + .2, pop(.7, 1.2), .18, 0);
T.at(CARD.pill, pop(1, 1.3), .22, 0);
T.at(CARD.ask, plink(note(93), .8), .14, 0);
for (let k = 0; k < 3; k++) T.at(CARD.books + k * .12, pop(.6, 1 + k * .15), .14, (k - 1) * .4);

T.write('assets/rp11_sfx.wav');
// level to -16 LUFS with a fixed gain (no dynamic loudnorm: it would pump the quiet beds up between the hits)
const probe = execFileSync('sh', ['-c', `ffmpeg -hide_banner -i assets/rp11_sfx.wav -af ebur128 -f null - 2>&1 | grep -E '^ +I:' | tail -1`], { encoding: 'utf8' });
const I = parseFloat(probe.match(/-?[\d.]+/)[0]), gain = -16 - I;
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'assets/rp11_sfx.wav', '-af', `volume=${gain.toFixed(2)}dB,alimiter=limit=0.84:level=false,aresample=48000`, '-ar', '48000', '-ac', '2', 'assets/rp11_mix.wav']);
console.log('assets/rp11_mix.wav', END.toFixed(2), 's,', I.toFixed(1), 'LUFS raw, +' + gain.toFixed(1), 'dB');
