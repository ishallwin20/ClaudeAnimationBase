// rp6_sfx.mjs: the sound for Ramayan Part 6 (src/scenes/rp6.js, no voice) → assets/rp6_sfx.wav, then levelled to
// -16 LUFS → assets/rp6_mix.wav. Times come from src/scenes/rp6_tl.js. Retro cartoon foley in the manner of the
// Shumbha and Bal Hanuman sun reels: the deer's sparkle and a blink "plink", the demon shadow's DUN, ten heads gasping
// and fuming, Maricha's chattering teeth and knocking knees, a harp into the sepia flashback, his "whoaaa" over the sea
// and a far-off splash and bloop, the thought bubble's pops, the poof of the change, the deer's wink, the hide-and-seek
// poofs of the chase, the cry that echoes in Ram's voice, Lakshman's "hmph", a wrong-answer buzzer on the Lakshman
// Rekha, the holy man's staff, a low ten-voiced laugh. Quiet beds under it (night crickets, the hall, waves, birds);
// the only music is a soft tanpura under Sita alone at the end.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, plink, clang, click, thud, shimmer, slide, squeak, note, seed, rnd, clamp, chime, wind, drum, heart, conch, thunder, roar, splash, chirp, SR } from './sfx.mjs';

const TL = runInNewContext(readFileSync('src/scenes/rp6_tl.js', 'utf8') + '\n;TL');
const { B0, C0, D0, E0, F0, G0, H0, I0, J0, K1, L0, M0, N0, K0, END, SHADOW, REVENGE, SHOOK, SHOT, YOJ, CHOSE, ARROW, TURN, SPOTS, CATCH, WARN, GUARD, CHASED,
  STRUCK, VOICE, HA, NO, HARSH, LINE, REKHA, HOLY, RAVANA7, CARD } = TL;
const OCEAN = SHOT + 1.3, HIDES = [CHASED - .6, CHASED + .5, CHASED + 1.3, CHASED + 2.1, CHASED + 2.8];   // as in rp6.js

const T = track(END);
seed(38);
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

const SITA = 330, RAM = 150, LAKSH = 175, MARI = 125, IMP = 340, RAVAN = 95;
// the reel's own: teeth chattering, knees knocking, a wrong-answer buzzer, a cry echoing through the trees, a laugh
const chatter = (dur, amp = 1) => { const o = new Float32Array(Math.round((dur + .1) * SR)); for (let k = 0; k * .045 < dur; k++) add(o, tok(amp * (.6 + .4 * rnd()), 2.2 + .2 * (k % 2)), k * .045); return o; };
const knees = (dur, amp = 1) => { const o = new Float32Array(Math.round((dur + .2) * SR)); for (let k = 0; k * .11 < dur; k++) add(o, tok(amp, k % 2 ? .45 : .5), k * .11); return o; };
const buzzer = (amp = 1) => { const o = new Float32Array(Math.round(1.1 * SR)); for (const s of [0, .42]) add(o, lp(mixb(tone(.34, 110, { type: 'square', e: env.swell(.005, .03), amp }), tone(.34, 116, { type: 'saw', e: env.swell(.005, .03), amp: amp * .6 })), 2500), s); return o; };
const echo = (b, n = 4, gap = .32, k = .5) => { const o = new Float32Array(b.length + Math.round(n * gap * SR)); for (let i = 0; i <= n; i++) add(o, i ? lp(Float32Array.from(b), 2600 - i * 400) : b, i * gap, Math.pow(k, i)); return o; };
const laugh = (n, f, amp = 1) => voice(Array.from({ length: n }, (_, i) => [i * .2, .14, 1.15 - i * .04, .55]), f, { amp, fall: .25 });
const steps = (a, b, gap, g, f = 62, pan = 0) => { for (let s = a; s < b - .05; s += gap) T.at(s, bomp(1, f * (1 + .04 * Math.sin(s * 9))), g, pan); };

// ---- A: the hook (night crickets; the deer's glow and blink; the demon shadow rises behind it: DUN)
room(0, B0, .04);
T.at(0, cricket(B0, .5), .035, .4);
T.at(.02, shimmer(1.4, [note(86), note(90), note(93), note(98)], .5, .08), .07, 0);
T.at(SHADOW - .05, mixb(drum(40, 1, 1.6), roar(1.6, 70, 6, .7)), .13, 0);   // DUN… the shadow
T.at(SHADOW + .1, slide(1.2, 160, 90, .6), .06, 0);
T.at(2.2, plink(note(100), .7), .1, .2);   // blink!
T.at(2.8, squeak(1400, 2000, .1, .6), .05, .2);   // looks back
T.at(B0 - .3, whoosh(.6, 600, 3600), .2, 0);
// ---- B: the ident
T.at(B0, conch(1.6, 311, .7), .14, 0);
T.at(B0 + .35, pop(.8), .22, 0); T.at(B0 + .7, pop(.6, 1.2), .18, 0);
T.at(C0 - .3, whoosh(.6, 400, 2600), .18, 0);
// ---- C: Lanka (the hall's hum; the messenger's babble; ten heads gasp; REVENGE: they fume)
room(C0, D0, .06);
T.at(C0 + .1, talk(REVENGE - C0 - .5, IMP, { amp: .7, gap: .12, shake: .5 }), .07, -.5);
for (let i = 0; i < 5; i++) T.at(C0 + .35 + i * .06, voice([[0, .3, 1.2, .6]], RAVAN * (1 + i * .12), { rise: .4 }), .03, -.3 + i * .15);   // "huh?!" ×5
T.at(REVENGE - .25, mixb(drum(40, 1, 1.4), roar(1.2, 100, 10, 1)), .11, 0);
T.at(REVENGE - .1, noise(1.2, { hp: 2500, lp: 9000, e: env.swell(.05, .6), amp: .5 }), .05, 0);   // steam
T.at(REVENGE, talk(1, RAVAN, { amp: .9, br: .8, gap: .2 }), .07, 0);   // "REVENGE!"
T.at(D0 - .3, whoosh(.6, 500, 2600), .18, 0);
// ---- D: the shore (waves, gulls; Ravana stomps in and talks; Maricha's teeth chatter and his knees knock)
T.at(D0, stream(E0 - D0 + .2), .07, .2);
for (let k = 0; k < 3; k++) T.at(D0 + .6 + k * 1.1, mixb(squeak(2200, 1700, .12, .6), squeak(2000, 1600, .1, .5)), .02, .6 - k * .4);
steps(D0 + .05, D0 + 1, .3, .1, 58, -.6);
T.at(D0 + .9, talk(SHOOK - D0 - 1.1, RAVAN, { amp: .8, gap: .2 }), .11, -.4);
T.at(SHOOK - .3, mixb(slide(.25, 900, 1800, .5), plink(note(93), .5)), .08, .3);   // "!!"
T.at(SHOOK - .2, chatter(E0 - SHOOK, .7), .1, .3);
T.at(SHOOK - .1, knees(E0 - SHOOK, .9), .11, .3);
T.at(SHOOK + .2, voice([[0, .9, 1.3, .5]], MARI, { shake: 1, fall: .2 }), .05, .3);   // "eeee…"
T.at(E0 - .3, harp(false, .6), .08, 0);   // into the flashback
// ---- E: years ago, sepia (the boy's bow; "whoaaa" over the sea; a far splash; his head bobs up, dizzy)
T.at(E0, stream(F0 - E0), .04, .2);
T.at(SHOT - .5, creak(.5, .8), .1, -.5);
T.at(SHOT, twang(1), .16, -.5); T.at(SHOT + .02, thwip(1), .12, -.2);
T.at(SHOT + .05, bonk(1, 420), .14, .3);
T.at(SHOT + .1, voice([[0, 1.2, 1.2, .6]], MARI, { fall: .5, shake: .4 }), .08, .5);   // "whoaaaa…"
T.at(SHOT + .1, slide(1.2, 1500, 300, .6), .06, .5);
T.at(OCEAN, splash(.6), .08, .6); T.at(OCEAN + .05, plink(note(84), .5), .05, .6);
T.at(YOJ - .35, slide(.25, 300, 1100, .6), .08, .5);   // bloop
T.at(YOJ - .1, pop(.6, .8), .1, .5);
for (let k = 0; k < 6; k++) T.at(YOJ + .2 + k * .3, chirp(.6), .025, .4 + (k % 2) * .3);   // dizzy tweets
T.at(YOJ + .3, mixb(chime(note(93), .7, 1.2), chime(note(98), .4, 1.2)), .06, 0);
T.at(F0 - .3, harp(true, .5), .07, 0);
// ---- F: help me or die (the sword; Ravana's threat; Maricha's gulp; the thought bubble; Ram's arrow)
T.at(F0, stream(G0 - F0), .04, .2);
T.at(F0 + .55, shing(.9), .14, -.4);
T.at(F0 + .2, talk(CHOSE - F0 - .6, RAVAN, { amp: .9, br: .7, gap: .2 }), .09, -.4);
T.at(CHOSE - .5, mixb(slide(.2, 500, 200, .7), tone(.12, 140, { type: 'tri', e: env.pluck(20) })), .1, .4);   // gulp
T.at(CHOSE - .15, pop(.5, 1.6), .1, .4); T.at(CHOSE - .05, pop(.5, 1.3), .1, .3); T.at(CHOSE + .05, pop(.8, 1), .14, .2);   // the bubble
T.at(CHOSE + .2, shimmer(1, [note(81), note(86)], .4, .08), .05, .2);
T.at(ARROW - .2, thwip(1), .12, .2); T.at(ARROW, plink(note(96), .6), .07, .2);
T.at(G0 - .3, whoosh(.6, 500, 2600), .18, 0);
// ---- G: the change (birds; a poof and a harp; sparkles; the wink)
room(G0, H0, .04);
for (let k = 0; k < 4; k++) T.at(G0 + .3 + k * 1.3, bird(2600 + (k % 3) * 400, .5), .025, -.6 + k * .4);
T.at(G0 + .1, laugh(3, MARI, .7), .05, .1);   // heh heh heh
T.at(TURN - .3, poof(1), .16, 0); T.at(TURN - .25, pop(1, .8), .14, 0);
T.at(TURN - .1, harp(true, .6), .09, 0);
T.at(TURN + .3, shimmer(2, [note(86), note(90), note(93), note(98), note(102)], .5, .1), .06, 0);
for (let k = 0; k < 9; k++) T.at(TURN + .6 + k * .45, plink(note(96 + (k % 4) * 3), .35), .04, -.5 + rnd());
T.at(SPOTS + .05, chime(note(98), .6, 1.4), .07, 0);
T.at(SPOTS + 1.6, mixb(plink(note(103), .8), slide(.15, 2400, 3600, .3)), .1, .1);   // the wink: ting!
T.at(H0 - .3, whoosh(.5, 500, 2200), .14, 0);
// ---- H: Sita: catch it for me (her "ooh!", hearts); Lakshman: it's Maricha ("!")
room(H0, I0, .04);
for (let k = 0; k < 4; k++) T.at(H0 + .5 + k * 1.5, bird(2800 + (k % 2) * 500, .5), .025, .5 - k * .3);
T.at(H0 + .15, voice([[0, .6, 1, .6]], SITA, { rise: .5 }), .1, -.6);   // "oooh!"
for (let k = 0; k < 3; k++) T.at(H0 + .3 + k * .25, pop(.5, 1.4 + k * .15), .07, -.6);
T.at(CATCH, talk(WARN - CATCH - .4, SITA, { amp: .7, gap: .15 }), .1, -.6);
for (let s = H0; s < I0; s += .5) T.at(s, tok(.3, 1.8), .02, .6);   // the deer's light hooves
T.at(WARN, talk(2.2, LAKSH, { amp: .75 }), .11, .2);
T.at(WARN + 1.4, mixb(plink(note(91), .8), drum(52, .6, .4)), .12, .2);   // "!"
T.at(I0 - .3, whoosh(.6, 500, 2600), .16, 0);
// ---- I: the chase (Ram: guard Sita; running feet; the deer pops in and out)
T.at(I0, wind(J0 - I0, 1, .5), .07, 0);
T.at(GUARD, talk(1.1, RAM, { amp: .75 }), .11, -.4);
T.at(CHASED - .4, scurry(J0 - CHASED + .2, .7, .14), .1, 0);
HIDES.forEach((s, i) => { if (i) { T.at(s - .2, poof(.6), .07, 0); T.at(s - .15, unpop(.6), .06, 0); T.at(s, pop(.8, 1 + i * .1), .14, (i % 2 ? .5 : -.5)); T.at(s + .05, plink(note(98 + i * 2), .4), .05, (i % 2 ? .5 : -.5)); } });
T.at(HIDES[2] + .1, squeak(700, 1300, .2, .6), .05, -.2);   // "?"
T.at(J0 - .3, whoosh(.5, 500, 2200), .14, 0);
// ---- J: the arrow strikes (twang; the deer poofs back into Maricha; he falls; the cry echoes in Ram's voice)
room(J0, K1, .05);
T.at(J0, creak(.5, .8), .1, -.5);
T.at(STRUCK - .3, twang(1), .16, -.5); T.at(STRUCK - .25, thwip(1), .12, 0);
T.at(STRUCK, mixb(bonk(1, 380), thud(.6)), .16, .4);
T.at(STRUCK + .2, poof(1), .14, .4);
T.at(STRUCK + .25, shimmer(1, [note(98), note(93), note(90), note(86)], .5, .07), .06, .4);   // the magic falls away
T.at(VOICE + .3, voice([[0, .9, 1, .5]], MARI, { fall: .6 }), .08, .4);
T.at(VOICE + 1.15, mixb(thud(1), drum(48, .7, .8)), .16, .4);
const cry = voice([[0, .25, 1.2, .7], [.3, .25, 1.35, .8], [.58, .55, 1.25, .8], [1.25, .25, 1.2, .7], [1.55, .3, 1.35, .8], [1.9, .6, 1.2, .7]], RAM, { shake: .4 });
T.at(HA, echo(cry, 4, .38, .5), .1, .3);   // "HA SI-TAAA! HA LAKSH-MAAAN!"
T.at(HA - .1, drum(40, 1, 1.6), .18, 0);
T.at(HA + .35, mixb(slide(.25, 900, 1800, .5), plink(note(93), .6)), .08, -.5);   // Ram's "!!"
T.at(K1 - .3, whoosh(.5, 2200, 500), .14, 0);
// ---- K: Sita begs (sobs); Lakshman: "NO."; her harsh words (steam); he goes, sad
room(K1, L0, .04);
T.at(K1 + .3, talk(NO - K1 - .6, SITA, { amp: .7, gap: .13, shake: .8 }), .1, -.4);
T.at(K1 + .2, sob(3, SITA, .6), .06, -.4);
T.at(NO, voice([[0, .3, .9, .3]], LAKSH, { fall: .4 }), .1, .3);   // "hmph. No."
T.at(NO + .05, mixb(tok(.8, .6), drum(60, .5, .3)), .1, .3);
for (let k = 0; k < 4; k++) T.at(NO + .2 + k * .13, tok(.5, 1.2 + (k % 2) * .1), .05, .3);   // head shake
T.at(HARSH, talk(1.5, SITA, { amp: .85, gap: .11, br: .8 }), .11, -.4);
T.at(HARSH + .1, noise(1.1, { hp: 2500, lp: 9000, e: env.swell(.05, .5), amp: .4 }), .04, -.4);   // steam
T.at(HARSH + .3, mixb(drum(46, .8, .6), roar(.6, 260, 3, .4)), .1, -.3);
T.at(HARSH + 1.7, slide(1.2, 600, 300, .5), .05, .4);   // a sad slide as he goes
steps(HARSH + 1.7, L0 + .2, .34, .06, 66, .6);
T.at(L0 - .3, whoosh(.5, 500, 2200), .14, 0);
// ---- L: no line drawn (scratches; a red cross; the wrong-answer buzzer)
room(L0, M0, .04);
for (let s = LINE; s < LINE + 1; s += .09) T.at(s, noise(.07, { hp: 1500, lp: 6000, e: env.pluck(30), amp: .5 }), .05, -.3 + (s - LINE) * .6);
T.at(LINE + .8, squeak(700, 1300, .2, .6), .05, -.4);   // "?"
T.at(REKHA - .1, whoosh(.25, 1500, 6000), .12, 0);
T.at(REKHA + .1, buzzer(1), .05, 0);   // EHH-EHH!
T.at(REKHA + .1, drum(44, 1, 1), .09, 0);
// ---- M: Sita alone (a soft tanpura, crickets at dusk; the holy man's staff and steps)
T.at(M0 - .3, whoosh(.5, 2200, 500), .12, 0);
T.at(M0, tanpura(K0 - M0 + .3, .7), .09, 0);
T.at(M0, cricket(K0 - M0, .5), .04, .5);
T.at(M0 + .6, veena(SA + 12, .4), .04, 0); T.at(M0 + 1.6, veena(SA + 10, .35), .035, 0);
for (let s = HOLY - .2, k = 0; s < HOLY + 1.6; s += .5, k++) { T.at(s, tok(.6, .55), .1, .6 - k * .1); T.at(s + .25, thud(.3), .07, .6 - k * .1); }   // tok (the staff)… step
T.at(HOLY + .6, mixb(plink(note(93), .5), slide(.2, 900, 1500, .4)), .07, -.3);   // Sita's "!"
// ---- N: the tease (DUN, thunder; the shadow's ten heads; a low ten-voiced laugh)
T.at(RAVANA7 - .8, slide(.8, 90, 180, .7), .06, .2);
T.at(RAVANA7 - .1, mixb(drum(38, 1, 1.8), thunder(2.2, .6)), .2, .2);
for (let i = 0; i < 4; i++) T.at(RAVANA7 + .3 + i * .03, laugh(5, RAVAN * (1 + i * .15), .8), .04, .2 - i * .1);   // MWAHAHA ×10
T.at(K0 - .3, whoosh(.7, 400, 3200), .2, 0);
// ---- O: the card
room(K0, END, .03);
T.at(CARD.head, conch(1.5, 311, .6), .12, 0);
T.at(CARD.title, pop(.9), .22, 0); T.at(CARD.title + .2, pop(.7, 1.2), .18, 0);
T.at(CARD.pill, pop(1, 1.3), .22, 0);
T.at(CARD.ask, plink(note(93), .8), .14, 0);
for (let k = 0; k < 3; k++) T.at(CARD.books + k * .12, pop(.6, 1 + k * .15), .14, (k - 1) * .4);

T.write('assets/rp6_sfx.wav');
// level to -16 LUFS with a fixed gain (no dynamic loudnorm: it would pump the quiet beds up between the hits)
const probe = execFileSync('sh', ['-c', `ffmpeg -hide_banner -i assets/rp6_sfx.wav -af ebur128 -f null - 2>&1 | grep -E '^ +I:' | tail -1`], { encoding: 'utf8' });
const I = parseFloat(probe.match(/-?[\d.]+/)[0]), gain = -16 - I;
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'assets/rp6_sfx.wav', '-af', `volume=${gain.toFixed(2)}dB,alimiter=limit=0.84:level=false,aresample=48000`, '-ar', '48000', '-ac', '2', 'assets/rp6_mix.wav']);
console.log('assets/rp6_mix.wav', END.toFixed(2), 's,', I.toFixed(1), 'LUFS raw, +' + gain.toFixed(1), 'dB');
