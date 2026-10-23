// rp5_sfx.mjs: the sound for Ramayan Part 5 (src/scenes/rp5.js, no voice) → assets/rp5_sfx.wav, then levelled to
// -16 LUFS → assets/rp5_mix.wav. Times come from src/scenes/rp5_tl.js. Retro cartoon foley in the manner of the
// Shumbha and Bal Hanuman sun reels: Surpanakha's tuba footsteps and swoon (heartbeats, a slide whistle, a sigh), a
// "ting" on "married", the brothers' chuckle, a sword's shing and her scream as she flees, Khara's roar, a bonk for
// each of the fourteen, the army's stomping march and then one lonely wind whistle on "ALONE", the battle (a hail of
// arrows, war drums, the counter ticking down, an 8-bit victory jingle at zero), a tick-tock clock for the 72 minutes,
// the escaping demon's scurry, Ravana's growl, the golden deer's sparkle. Quiet beds under it (birds, dusk wind,
// crickets); the only music is a soft tanpura and veena under the hug.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, plink, clang, click, thud, shimmer, slide, squeak, note, seed, rnd, clamp, chime, wind, drum, heart, conch, thunder, roar, SR } from './sfx.mjs';

const TL = runInNewContext(readFileSync('src/scenes/rp5_tl.js', 'utf8') + '\n;TL');
const { B0, C0, D0, E0, F0, G0, H0, I0, K0, END, ALONE0, WALKIN, MARRIED, BROTHER, SENT, LUNGED, CUT, KHARA, FOURTEEN, FINISHED, ARMY, CAVE, FACED,
  RAIN, DUSH, TRISH, LASTK, MUH, MIN72, SEC3, HUGGED, RAVANA, DEER, CARD } = TL;

const T = track(END);
seed(37);
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
const SITA = 330, RAM = 150, LAKSH = 175, SURP = 270, KHARAV = 80, IMP = 340, RAVAN = 95;

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

// ---- A: the hook (dusk wind; the horde growls; Ram draws; a slow war drum; he looses into the ident)
T.at(0, wind(B0 + .2, 0, .4), .08, 0);
T.at(0, roar(B0, 120, 10, .5), .07, .5);
T.at(0, creak(ALONE0 - .2, .9), .12, -.4);
for (const s of [.02, .95, 1.9, 2.85]) T.at(s, drum(46, s < .1 ? 1 : .7, 1), .2, 0);   // DUM… DUM…
T.at(.05, shimmer(1, [note(81), note(86)], .4, .1), .06, 0);
T.at(B0 - .35, twang(1), .18, -.4); T.at(B0 - .3, whoosh(.6, 600, 4000), .2, .3);
// ---- B: the ident
T.at(B0, conch(1.6, 311, .7), .14, 0);
T.at(B0 + .35, pop(.8), .22, 0); T.at(B0 + .7, pop(.6, 1.2), .18, 0);
T.at(C0 - .3, whoosh(.6, 400, 2600), .18, 0);
// ---- C: Panchavati (birds; Surpanakha stomps in and swoons; "I'm married"; sent back; the lunge; the sword)
room(C0, D0, .04);
for (let k = 0; k < 8; k++) T.at(C0 + .3 + k * 1.6, bird(2600 + (k % 3) * 400, .5), .03, -.7 + (k % 4) * .4);
const SWOON = C0 + .9;
const steps = (a, b, gap = .32, g = .1, f = 62) => { for (let s = a; s < b - .05; s += gap) T.at(s, bomp(1, f * (1 + .04 * Math.sin(s * 9))), g, clamp((540 - 1350) / 900 + (s - a) / (b - a) * .3 + .6, -1, 1) * .6); };
steps(C0 + .1, WALKIN, .34, .1);   // bomp… bomp…
for (let k = 0; k < 3; k++) T.at(SWOON + k * .45, heart(.8), .1, .3);   // ba-dum ba-dum
T.at(SWOON + .05, slide(.7, 500, 1500, .6), .06, .3);   // the slide whistle up
T.at(SWOON + .2, pop(.6, 1.3), .1, .3); T.at(SWOON + .45, pop(.5, 1.5), .08, .3);   // the little hearts
T.at(SWOON + 1.1, voice([[0, .9, 1, .4]], SURP, { fall: .35 }), .07, .3);   // "haaah…" (the sigh)
T.at(SWOON + 1.4, harp(true, .5), .06, .2);
T.at(MARRIED + .3, talk(1.9, RAM, { amp: .7 }), .08, -.1);
T.at(MARRIED + .7, mixb(chime(note(96), .8, 1.4), shimmer(.8, [note(91), note(96), note(100)], .4, .05)), .07, -.1);   // "ting!": married
T.at(BROTHER - .05, mixb(plink(note(84), .7), slide(.35, 700, 1400, .4)), .1, .3);   // he points at his brother
steps(BROTHER - .2, BROTHER + .4, .2, .1, 66);
T.at(BROTHER + .6, voice([[0, .25, 1.1, .6], [.3, .45, 1.25, .7]], SURP, { rise: .25 }), .07, .5);   // "hey-yy~"
T.at(SENT, talk(1.3, LAKSH, { amp: .7 }), .08, .5);
T.at(SENT + .3, slide(.55, 1300, 380, .7), .08, .4);   // the slide whistle down: sent back
steps(SENT + .3, SENT + .8, .2, .1, 58);
T.at(SENT + 1.4, voice([[0, .16, 1, .6], [.2, .16, .96, .6], [.4, .22, .92, .6]], RAM, { fall: .2 }), .05, -.1);   // the brothers chuckle
T.at(SENT + 1.45, voice([[0, .16, 1, .6], [.2, .16, .96, .6], [.4, .22, .92, .6]], LAKSH, { fall: .2 }), .05, .5);
T.at(LUNGED - .35, roar(.7, 220, 4, .7), .12, .1);   // the snarl
T.at(LUNGED - .2, whoosh(.5, 600, 3000), .16, -.3);
T.at(LUNGED + .1, voice([[0, .3, 1.4, .8]], SITA, { rise: .5 }), .08, -.6);   // "eek!"
T.at(CUT - .3, whoosh(.3, 1500, 6000), .14, -.2);
T.at(CUT - .05, shing(1), .16, -.2);
T.at(CUT, drum(44, 1, 1.2), .16, 0);
T.at(CUT + .1, scream(1.1, SURP, { fall: .1 }), .1, -.3);   // "AAAH!"
T.at(CUT + .7, scream(1.5, SURP, { amp: .8, fall: .55 }), .07, .6);   // and away, fading off
steps(CUT + .6, D0 - .3, .16, .07, 70);
T.at(D0 - .3, whoosh(.6, 500, 2600), .18, 0);
// ---- D: Khara (dusk wind; her wailing; his roar; the fourteen charge and fall in a cascade of bonks)
T.at(D0, wind(E0 - D0, 1, .6), .07, 0);
T.at(D0 + .3, sob(6, SURP, .8), .06, -.4);
T.at(KHARA - .1, mixb(drum(42, 1, 1.2), roar(1.4, 90, 8, 1)), .16, .2);
T.at(FOURTEEN - .1, talk(1.1, KHARAV, { amp: .9, br: .8, gap: .2 }), .1, .2);   // "GO! GET THEM!"
for (let i = 0; i < 6; i++) T.at(FOURTEEN + .3 + i * .07, voice([[0, .5, 1, .7]], IMP * (1 + i * .08), { rise: .2, shake: .5 }), .035, .4 - i * .1);   // "yaaa!"
T.at(FOURTEEN + .2, scurry(FINISHED - FOURTEEN - .8, .8, .07), .07, 0);
for (let s = FINISHED - .8; s < FINISHED + .3; s += .06) T.at(s, thwip(.8), .06, -.7 + (s - FINISHED + .8) * 1.2);
for (let i = 0; i < 14; i++) T.at(FINISHED - .6 + (i + 1) / 14 * .8, bonk(.9, 700 - i * 22), .09, -.5 + i * .07);   // bonk-bonk-bonk… ×14
T.at(FINISHED + .35, plink(note(96), .7), .08, 0);   // ding
T.at(FINISHED + .7, voice([[0, .45, .9, .6]], KHARAV, { rise: .9 }), .09, .2);   // "huh?!"
T.at(E0 - .3, whoosh(.6, 400, 2600), .18, 0);
// ---- E: the army marches in (stomps, horns, a roaring crowd); into the cave; then one lone wind on "ALONE"
T.at(E0, wind(F0 - E0, 2, .5), .06, 0);
for (let k = 0, s = E0 + .1; s < CAVE - .6; k++, s += .45) T.at(s, mixb(drum(44, .5 + .5 * Math.min(1, k / 8), .6), thud(.6)), .11, .4);   // STOMP… STOMP…
T.at(E0 + .2, horn(1.6, 43, .8), .07, .4);
T.at(ARMY - .15, mixb(drum(40, 1, 1.4), roar(2.6, 110, 14, 1)), .11, .4);
T.at(ARMY + 1.4, horn(1.4, 46, .7), .06, .5);
T.at(CAVE - .6, roar(1.2, 95, 4, .5), .1, .5);   // Khara
T.at(CAVE, talk(1, RAM, { amp: .7 }), .08, -.2);   // "Go, into the cave"
T.at(CAVE + .3, scurry(1.1, .7, .1), .06, -.6);
T.at(CAVE + 1.3, mixb(thud(.3), noise(.6, { lp: 600, hp: 80, e: env.ad(.02, .3), amp: .4 })), .08, -.7);   // the cave swallows them
T.at(CAVE + 1.2, thud(1), .14, -.2); T.at(CAVE + 1.9, thud(1), .14, -.1);   // he steps forward
T.at(FACED - .4, creak(.6, 1), .13, -.3);
T.at(FACED, drum(40, 1, 1.6), .18, 0);
T.at(FACED + .1, slide(2, 820, 640, .5), .05, .3);   // a lonely whistle of wind
T.at(F0 - .3, whoosh(.6, 400, 3000), .18, 0);
// ---- F: the battle (arrows like rain, war drums, the counter ticking down; the generals fall; Khara; 72 minutes)
T.at(F0, wind(G0 - F0, 3, .8), .06, 0);
T.at(F0, roar(LASTK - F0 + .3, 110, 14, .6), .06, .4);
for (let k = 0; F0 + .2 + k * .3 < LASTK + .3; k++) T.at(F0 + .2 + k * .3, drum(k % 4 === 0 ? 48 : k % 2 ? 72 : 60, k % 4 === 0 ? 1 : .55, .5), .16, 0);   // DUM ta-ta ta
for (let k = Math.ceil((F0 * 8 - Math.PI / 2) / (2 * Math.PI)); (Math.PI / 2 + 2 * Math.PI * k) / 8 < LASTK + .5; k++) T.at((Math.PI / 2 + 2 * Math.PI * k) / 8, twang(.8), .1, -.5);   // each loose of his bow
for (let s = RAIN - .4; s < LASTK + .3; s += .05 + .05 * rnd()) T.at(s, thwip(.7 + .3 * rnd()), .035, -.3 + rnd() * .9);   // the hail of arrows
for (let s = RAIN; s < LASTK + .2; s += .12 + .15 * rnd()) T.at(s, bonk(.6, 450 + 300 * rnd()), .035, .2 + rnd() * .6);   // demons going down
for (let s = RAIN - .4; s < LASTK + .3; s += .055) T.at(s, click(.6), .025, .1);   // the counter, ticking
for (const [s, f] of [[DUSH, 1], [TRISH, .85], [LASTK, .7]]) {   // a general falls: bonk, a falling "whoaa", a thud
  T.at(s - .1, bonk(1, 300 * f), .16, .3);
  T.at(s, voice([[0, .7, 1.1, .6]], 120 * f, { fall: .6 }), .08, .3);
  T.at(s + .45, mixb(thud(1), drum(50 * f, .8, .8)), .16, .3);
}
T.at(LASTK + .45, mixb(drum(38, 1, 1.6), thunder(1.6, .4)), .2, .2);   // KHARA, at last
T.at(LASTK + .4, jingle(.8), .07, 0);   // the counter hits zero: ta-da-da-DAAA
T.at(MUH - .2, mixb(noise(MIN72 - MUH + .5, { lp: 400, hp: 60, e: env.swell(.5, .5), amp: .5 })), .04, 0);
for (let s = MUH + .2, k = 0; s < MIN72 - .1; s += .5, k++) T.at(s, tick(.8, k % 2 ? .8 : 1), .07, 0);   // tick… tock…
T.at(MIN72 + .35, mixb(chime(note(93), 1, 2), chime(note(100), .5, 2)), .1, 0);   // DING: 72 minutes
for (let i = 0; i < 3; i++) T.at(SEC3 + .35 + i * .16, bonk(.9, 620 + i * 90), .12, (i - 1) * .4);   // one, two, three
T.at(SEC3 + .7, mixb(slide(.5, 400, 1600, .6), shimmer(1.2, [note(84), note(88), note(91), note(96)], .5, .05)), .08, 0);
T.at(SEC3 + .75, drum(46, .9, 1), .14, 0);
// ---- G: the hug (a soft tanpura and veena; her running feet; hearts)
T.at(G0 - .3, whoosh(.6, 2400, 600), .14, 0);
T.at(G0, wind(H0 - G0 + .3, 1, .6), .04, 0);
T.at(G0 + .05, tanpura(H0 - G0 + .4, .7), .06, 0);
T.at(G0 + .1, scurry(HUGGED - G0 - .2, .5, .14), .05, -.4);
T.at(HUGGED, mixb(harp(true, .5), veena(SA + 12, .5)), .08, 0);
T.at(HUGGED + .1, pop(.5, 1.4), .08, -.1); T.at(HUGGED + .35, pop(.4, 1.6), .07, .1);
T.at(HUGGED + .8, veena(SA + 19, .45), .05, 0);
// ---- H: the escape (scurrying, panting, a zip; DUN and thunder for Ravana; his growl)
T.at(H0 - .3, whoosh(.6, 600, 2600), .16, 0);
T.at(H0, wind(I0 - H0, 2, .5), .06, 0);
T.at(H0 + .1, scurry(I0 - H0 - .4, .7, .08), .07, .3);
T.at(H0 + .2, pant(2.4, IMP, .6), .05, .3);
T.at(H0 + .3, slide(.4, 500, 2200, .4), .06, .2);   // the zip off
T.at(RAVANA - .2, mixb(drum(40, 1, 1.6), thunder(2, .6)), .2, .4);
T.at(RAVANA + .2, talk(1, RAVAN, { amp: .9, br: .7, gap: .22, fall: .2 }), .09, .4);   // "WHAT?!"
T.at(I0 - .3, whoosh(.6, 2600, 500), .16, 0);
// ---- I: the tease (night, crickets; the golden deer sparkles in, looks back)
room(I0, K0, .04);
T.at(I0, cricket(K0 - I0, .5), .035, .5);
for (let s = DEER - .8; s < DEER; s += .2) T.at(s, tok(.4, 1.8), .04, .4);   // light hooves
T.at(DEER - .6, shimmer(1.4, [note(86), note(90), note(93), note(98)], .6, .09), .08, .2);
T.at(DEER + .4, veena(SA + 14, .5), .05, 0); T.at(DEER + .8, veena(SA + 17, .45), .05, 0); T.at(DEER + 1.3, veena(SA + 19, .5), .05, 0);   // a question, rising
// ---- K: the card
T.at(K0 - .3, whoosh(.7, 400, 3200), .2, 0);
room(K0, END, .03);
T.at(CARD.head, conch(1.5, 311, .6), .12, 0);
T.at(CARD.title, pop(.9), .22, 0); T.at(CARD.title + .2, pop(.7, 1.2), .18, 0);
T.at(CARD.pill, pop(1, 1.3), .22, 0);
T.at(CARD.ask, plink(note(93), .8), .14, 0);
for (let k = 0; k < 3; k++) T.at(CARD.books + k * .12, pop(.6, 1 + k * .15), .14, (k - 1) * .4);

T.write('assets/rp5_sfx.wav');
// level to -16 LUFS with a fixed gain (no dynamic loudnorm: it would pump the quiet beds up between the hits)
const probe = execFileSync('sh', ['-c', `ffmpeg -hide_banner -i assets/rp5_sfx.wav -af ebur128 -f null - 2>&1 | grep -E '^ +I:' | tail -1`], { encoding: 'utf8' });
const I = parseFloat(probe.match(/-?[\d.]+/)[0]), gain = -16 - I;
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'assets/rp5_sfx.wav', '-af', `volume=${gain.toFixed(2)}dB,alimiter=limit=0.84:level=false,aresample=48000`, '-ar', '48000', '-ac', '2', 'assets/rp5_mix.wav']);
console.log('assets/rp5_mix.wav', END.toFixed(2), 's,', I.toFixed(1), 'LUFS raw, +' + gain.toFixed(1), 'dB');
