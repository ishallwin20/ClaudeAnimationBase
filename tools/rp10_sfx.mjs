// rp10_sfx.mjs: the sound for Ramayan Part 10 (src/scenes/rp10.js, no voice) → assets/rp10_sfx.wav, then levelled to
// -16 LUFS → assets/rp10_mix.wav. Times come from src/scenes/rp10_tl.js. Retro cartoon foley as in Parts 6–9: the
// crackle of the tail fire, the jewel's twinkle, a lightbulb "ding", trees creaking down with thuds, bonks with tweeting
// stars and slide whistles for the soldiers, the astra's zing and the ropes' magic hum, a wink "ting", Ravana's ten-head
// roar, Vibhishana's calm voice, a whoosh-WHUMP as the tail lights, Hanuman's blissful "ahh", boings from roof to roof
// over a growing fire, a hiss and steam in the sea, a panicked yelp. The only music is a soft tanpura under Sita's
// prayer and her waving.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, plink, clang, click, thud, shimmer, slide, squeak, note, seed, rnd, clamp, chime, wind, drum, heart, conch, thunder, roar, splash, chirp, crinkle, rumble, crackle, fire, laughter, SR } from './sfx.mjs';

const TL = runInNewContext(readFileSync('src/scenes/rp10_tl.js', 'utf8') + '\n;TL');
const { B0, C0, D0, E0, F0, G0, H0, I0, J0, K0, END, GEM, THINK, BULB, SMASH, ARMY, SON, ROPES, LET, WINK, RET, KILL, VIBH, LIGHT, PRAY, COOL, AHH,
  SLIP, BURN, SPARE, DIP, PANIC, SAFE, CARD } = TL;

const T = track(END);
seed(45);
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


const HANV = 210, SITAV = 300, RAVV = 105, VIBV = 150, GUARDV = 170, INDV = 140;
const ding = (amp = 1) => mixb(bell(note(96), 1.2, { partials: [[1, 1], [2.76, .4]], k: 3, amp }), click(amp * .3));
const timber = (amp = 1) => mixb(creak(.6, amp), tone(.6, t => 300 - 280 * t, { type: 'saw', e: env.swell(.05, .2), amp: amp * .08 }));
const sizzle = (dur, amp = 1) => mixb(noise(dur, { hp: 2500, lp: 9000, e: env.swell(.02, dur * .7), amp }), noise(dur, { lp: 900, hp: 200, e: env.ad(.02, dur * .5), amp: amp * .5 }));
const whump = (amp = 1) => mixb(noise(.6, { lp: t => 300 + 3000 * t, hp: 80, e: env.ad(.03, .5), amp }), drum(50, amp * .7, .6));
const hum = (dur, amp = 1) => mixb(tone(dur, t => 220 + 4 * Math.sin(t * 14), { type: 'tri', e: env.swell(.3, .3), amp }), tone(dur, 330, { e: env.swell(.3, .3), amp: amp * .4 }));

// ---- A: the hook (night wind; the tail fire crackling; a smug "heh")
T.at(0, wind(B0 + .2, 0, .5), .05, 0);
T.at(0, fire(B0 + .2, .7, .9), 0.04, .3);
T.at(.3, crackle(B0, 1), .05, .3);
T.at(1.6, voice([[0, .14, 1.1, .7], [.2, .14, 1.15, .7]], HANV), .1, -.2);
T.at(B0 - .3, whoosh(.6, 600, 3600), .2, 0);
// ---- B: the ident
T.at(B0, conch(1.6, 311, .7), .14, 0);
T.at(B0 + .35, pop(.8), .22, 0); T.at(B0 + .7, pop(.6, 1.2), .18, 0);
T.at(C0 - .3, whoosh(.6, 2200, 500), .14, 0);
// ---- C: the grove (crickets; Sita's soft voice; the jewel's twinkle; the bulb's "ding"; the gada; trees creak and fall
// with thuds and dust; a "ting" for Sita's tree)
T.at(C0, cricket(D0 - C0, 1), .03, -.3);
T.at(C0 + .3, talk(GEM - C0 - .6, SITAV, { amp: .6, gap: .18, br: .5 }), .08, .3);
T.at(GEM, mixb(shimmer(1.2, [note(91), note(96), note(100), note(103)], .5, .06), zing(.5)), .07, 0);
T.at(GEM + .3, voice([[0, .5, 1.1, .6]], HANV, { rise: .3 }), .07, -.3);   // "ooh"
T.at(BULB, ding(1), .12, -.3);
T.at(THINK + .6, voice([[0, .14, 1.1, .7], [.2, .14, 1.15, .7], [.4, .14, 1.2, .7]], HANV), .09, -.3);   // "he-he-he"
T.at(SMASH - .2, mixb(whoosh(.4, 600, 3000), shing(.4)), .1, -.3);
for (const t0 of [SMASH + .3, SMASH + .9, SMASH + 1.5]) { T.at(t0, timber(1), .12, -.4); T.at(t0 + .48, mixb(thud(1), drum(48, .7, .6)), .16, -.4); T.at(t0 + .5, noise(.6, { lp: 1200, hp: 100, e: env.ad(.02, .5), amp: .6 }), .06, -.4); }
T.at(SMASH + 1.9, mixb(chime(note(98), .7, 1.4), plink(note(103), .4)), .08, .4);
T.at(D0 - .3, whoosh(.5, 500, 2600), .14, 0);
// ---- D: the army (war drums, running feet; bonk + slide whistle + tweets for each; Akshaya's roar; a ta-da)
T.at(D0, drum(46, .8, .8), .1, .3); T.at(D0 + .45, drum(46, .8, .8), .1, .3);
T.at(ARMY, scurry(SON - ARMY - .3, 1), .05, .5);
T.at(ARMY + .1, talk(.8, GUARDV, { amp: .8, br: .9, gap: .12 }), .06, .5);   // a war cry
for (const h of [ARMY + .7, ARMY + 1.3, ARMY + 1.9, SON + 1.1]) { T.at(h - .25, whoosh(.3, 800, 3000), .1, -.2); T.at(h, mixb(bonk(1, 300), clang(note(62), .4)), .2, .1); T.at(h + .05, slide(.8, 600, 2000, .6), .07, .5); for (let k = 0; k < 3; k++) T.at(h + .5 + k * .2, chirp(.6), .03, .6); }
T.at(SON - .3, roar(1, INDV + 20, 4, .8), .08, .5);
T.at(SON + 2.0, tada(.8), .08, -.2);
T.at(E0 - .3, whoosh(.5, 2200, 500), .12, 0);
// ---- E: Indrajit (the bow creaks; the astra: a rising whine and a zing; the ropes' magic hum; a wink "ting")
T.at(E0, wind(F0 - E0, 1, .5), .04, 0);
T.at(E0 + .3, creak(ROPES - E0 - .9, 1), .1, .5);
T.at(ROPES - .55, twang(1), .14, .5);
T.at(ROPES - .5, mixb(slide(.5, 800, 3000, .5), zing(.8)), .12, .2);
T.at(ROPES, mixb(shimmer(1.4, [note(86), note(90), note(93), note(98)], .5, .1), whoosh(.5, 3000, 800)), .1, -.3);
T.at(ROPES + .1, hum(F0 - ROPES - .1, .6), .05, -.3);
T.at(ROPES + .2, voice([[0, .4, 1.25, .9]], HANV, { fall: .3 }), .08, -.3);   // "whoa"
T.at(ROPES + .5, voice([[0, .15, 1, .7], [.2, .15, 1.1, .7], [.4, .15, 1.2, .7], [.6, .2, 1.1, .7]], INDV), .1, .5);   // Indrajit: "ha-ha-ha-ha"
T.at(WINK, mixb(plink(note(103), .7), chime(note(98), .4, 1)), .1, -.3);
T.at(F0 - .3, whoosh(.5, 2200, 500), .12, 0);
// ---- F: the court (a low room tone; Hanuman's steady voice; the ten heads' ROAR; a snore cut off; Vibhishana's calm voice)
room(F0, G0, .05);
T.at(F0, hum(G0 - F0, .3), .03, -.3);
T.at(F0 + .2, snore(KILL - F0, .8), .04, .3);
T.at(RET, talk(KILL - RET - .4, HANV, { amp: .75, gap: .17, br: .6 }), .1, -.4);
T.at(KILL - .1, mixb(roar(1.3, RAVV, 10, 1), drum(42, 1, 1.2)), .14, .3);
T.at(KILL + .1, talk(1.0, RAVV + 30, { amp: .9, br: .9, gap: .14, shake: .6 }), .08, .3);
steps(VIBH - .5, VIBH + .2, .26, .06, 64, .6);
T.at(VIBH + .2, talk(G0 - VIBH - .6, VIBV, { amp: .7, gap: .2, br: .4 }), .1, .5);
T.at(G0 - .3, whoosh(.5, 600, 2600), .12, 0);
// ---- G: the tail (crowd laughter; the torch; WHUMP as it lights; the fire; a yelp)
T.at(G0, wind(PRAY - G0, 2, .4), .04, 0);
T.at(G0 + .2, laughter(LIGHT - G0, .7), .05, .4);
T.at(G0 + .4, fire(PRAY - G0 - .4, .2, .3), 0.025, .5);   // the torch
for (let k = 0; k < 5; k++) T.at(G0 + .3 + k * .25, crinkle(.2, .7), .05, .2);   // the cloth wrapped on
T.at(LIGHT, whump(1), .18, .3);
T.at(LIGHT + .05, fire(PRAY - LIGHT, .5, 1), 0.05, .2);
T.at(LIGHT + .2, mixb(squeak(800, 1600, .2, .7), voice([[0, .3, 1.3, .9]], HANV, { rise: .4 })), .08, -.3);   // "!!"
T.at(LIGHT + .4, laughter(1.2, .8), .06, .5);
T.at(PRAY - .3, whoosh(.6, 2200, 500), .12, 0);
// ---- G2: Sita's prayer (crickets, a soft tanpura, her voice; a shimmer as the glow comes)
T.at(PRAY, cricket(COOL - PRAY, 1), .03, -.3);
T.at(PRAY, tanpura(COOL - PRAY + .4, .7), .08, 0);
T.at(PRAY + .8, talk(COOL - PRAY - 1.2, SITAV, { amp: .55, gap: .2, br: .4 }), .08, .1);
T.at(PRAY + .4, shimmer(1.6, [note(86), note(90), note(93), note(98), note(102)], .4, .12), .06, 0);
T.at(COOL - .3, whoosh(.6, 600, 2600), .12, 0);
// ---- G3: the fire feels cool ("ahh…", a frosty twinkle, the fire purring on)
T.at(COOL, fire(H0 - COOL, .6, .6), 0.035, .3);
T.at(AHH, voice([[0, 1.0, .95, .35]], HANV, { fall: .25 }), .1, -.1);   // "ahhh…"
T.at(AHH + .2, mixb(shimmer(1, [note(98), note(103), note(105), note(110)], .4, .08)), .06, .3);
T.at(H0 - .3, whoosh(.5, 600, 2600), .12, 0);
// ---- H: roof to roof (a poof and the ropes drop; boing-whoosh hops; the fire grows to a roar; a "ting" for the house)
T.at(SLIP - .1, mixb(poof(.8), unpop(.8)), .12, 0);
T.at(SLIP + .2, mixb(bonk(.4, 700), click(.5)), .06, 0);
T.at(H0, fire(I0 - H0, .3, 1), 0.07, 0);
T.at(H0 + 1, crackle(I0 - H0 - 1, 1), .06, .2);
for (let k = 0; k < 4; k++) { const s = SLIP + .5 + k * (BURN - SLIP - .5) / 4; T.at(s, mixb(boing(.8, 160 + k * 20), whoosh(.4, 600, 3000)), .1, (k % 2 ? .4 : -.4)); T.at(s + (BURN - SLIP - .5) / 4 - .05, mixb(whump(.6), thud(.5)), .1, (k % 2 ? -.4 : .4)); }
T.at(BURN, mixb(rumble(1.5, .8), drum(40, 1, 1.4)), .12, 0);
T.at(BURN + .3, voice([[0, .14, 1.1, .7], [.2, .14, 1.15, .7], [.4, .3, 1.2, .8]], HANV), .1, .2);   // "he-he-HA"
T.at(SPARE, mixb(chime(note(96), .7, 1.6), shimmer(1, [note(91), note(96), note(100)], .4, .06)), .08, -.5);
T.at(I0 - .3, whoosh(.5, 2200, 500), .12, 0);
// ---- I: the sea (waves; the fire; the dip: a big hiss and steam; relief; then the panic)
T.at(I0, stream(SAFE - I0), .07, 0);
T.at(I0, fire(DIP - I0, .6, .6), 0.04, .2);
T.at(DIP - .1, mixb(splash(.7), sizzle(1.3, 1)), .14, .3);
T.at(DIP + .4, voice([[0, .6, 1, .4]], HANV, { fall: .2 }), .08, -.2);   // "phew"
T.at(PANIC - .05, mixb(slide(.25, 900, 1800, .6), plink(note(93), .6)), .1, 0);
T.at(PANIC, scream(.7, HANV, { amp: .8 }), .08, -.2);
T.at(PANIC + .4, talk(SAFE - PANIC - .6, HANV, { amp: .8, gap: .11, br: .9, shake: .7 }), .08, -.2);
T.at(SAFE - .3, whoosh(.5, 2200, 500), .12, 0);
// ---- I2: Sita is safe (crickets, a soft tanpura; his footsteps; a big sigh of relief; a harp)
T.at(SAFE, cricket(J0 - SAFE, 1), .03, .3);
T.at(SAFE, tanpura(J0 - SAFE + .3, .6), .07, 0);
steps(SAFE, SAFE + .6, .15, .07, 80, -.4);
T.at(SAFE + .9, voice([[0, .9, 1, .3]], HANV, { fall: .4 }), .09, -.3);   // "haaah"
T.at(SAFE + 1, harp(true, .5), .06, 0);
T.at(J0 - .3, whoosh(.6, 600, 2600), .14, 0);
// ---- J: the tease (the sea at dawn; the bow drawn: a creak; a deep drum)
T.at(J0, stream(K0 - J0), .07, .3); T.at(J0, wind(K0 - J0, 2, .5), .05, 0);
T.at(J0 + .8, creak(1.4, 1), .12, -.4);
T.at(J0 + 2.2, mixb(drum(42, 1, 1.4), shimmer(1, [note(86), note(90), note(93)], .4, .06)), .12, 0);
T.at(K0 - .3, whoosh(.7, 400, 3200), .2, 0);
// ---- K: the card
room(K0, END, .03);
T.at(CARD.head, conch(1.5, 311, .6), .12, 0);
T.at(CARD.title, pop(.9), .22, 0); T.at(CARD.title + .2, pop(.7, 1.2), .18, 0);
T.at(CARD.pill, pop(1, 1.3), .22, 0);
T.at(CARD.ask, plink(note(93), .8), .14, 0);
for (let k = 0; k < 3; k++) T.at(CARD.books + k * .12, pop(.6, 1 + k * .15), .14, (k - 1) * .4);

T.write('assets/rp10_sfx.wav');
// level to -16 LUFS with a fixed gain (no dynamic loudnorm: it would pump the quiet beds up between the hits)
const probe = execFileSync('sh', ['-c', `ffmpeg -hide_banner -i assets/rp10_sfx.wav -af ebur128 -f null - 2>&1 | grep -E '^ +I:' | tail -1`], { encoding: 'utf8' });
const I = parseFloat(probe.match(/-?[\d.]+/)[0]), gain = -16 - I;
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'assets/rp10_sfx.wav', '-af', `volume=${gain.toFixed(2)}dB,alimiter=limit=0.84:level=false,aresample=48000`, '-ar', '48000', '-ac', '2', 'assets/rp10_mix.wav']);
console.log('assets/rp10_mix.wav', END.toFixed(2), 's,', I.toFixed(1), 'LUFS raw, +' + gain.toFixed(1), 'dB');
