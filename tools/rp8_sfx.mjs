// rp8_sfx.mjs: the sound for Ramayan Part 8 (src/scenes/rp8.js, no voice) → assets/rp8_sfx.wav, then levelled to
// -16 LUFS → assets/rp8_mix.wav. Times come from src/scenes/rp8_tl.js. Retro cartoon foley in the manner of the
// Shumbha and Bal Hanuman sun reels: the bow held drawn over a slow heartbeat, Hanuman's soft steps and voice, a "ting"
// and a little tune when Ram is amazed, the scarf opening, Lakshman's shy mumble, the anklet's bells, Vali's roar and
// Sugriva flung out with a slide whistle and tweeting stars, the brawl's bonks, Ram's puzzled squeaks, the garland's
// sparkle, the twang and the arrow, Vali's weak voice, Angad's sobs, the scales creaking for YES or NO, a power-up for
// Hanuman. Quiet beds under it (the lake, dusty wind, the sea); the only music is a soft tanpura and veena under the
// anklets and Vali's last words.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, plink, clang, click, thud, shimmer, slide, squeak, note, seed, rnd, clamp, chime, wind, drum, heart, conch, thunder, roar, splash, chirp, crinkle, SR } from './sfx.mjs';

const TL = runInNewContext(readFileSync('src/scenes/rp8_tl.js', 'utf8') + '\n;TL');
const { B0, C0, D0, E0, F0, G0, H0, I0, J0, K0, END, FAIR0, HANU, AMAZED, JEWELS, EARR, ANK, BOWED, THROWN, WIFE, ALIKE, BEATEN, GARL, STRUCK, TOOK, BHARAT, ACCEPT, ANGAD,
  YESNO, LEAPS, CARD } = TL;

const T = track(END);
seed(40);
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

const RAM = 150, LAKSH = 175, HANV = 210, SUGV = 190, VALIV = 120, ANGV = 300, RUMA = 300;
const bells = (amp = 1) => { const o = new Float32Array(Math.round(1.2 * SR)); for (let i = 0; i < 9; i++) add(o, bell(note(100 + (i % 3) * 3) * (1 + .01 * rnd()), .5, { partials: [[1, 1], [2.7, .4]], k: 6, amp: amp * (.5 + .5 * rnd()) }), i * .05 + .02 * rnd()); return o; };
const ow = (f, amp = 1) => voice([[0, .35, 1.3, .8]], f, { amp, fall: .6 });
const scuffle = (dur, amp = 1) => { const o = new Float32Array(Math.round((dur + .3) * SR)); for (let s = 0; s < dur; s += .09 + .12 * rnd()) add(o, rnd() < .35 ? bonk(amp * .7, 350 + 300 * rnd()) : noise(.12, { hp: 300, lp: 2500, e: env.pluck(30), amp: amp * .6 }), s); return o; };
const steps = (a, b, gap, g, f = 62, pan = 0) => { for (let s = a; s < b - .05; s += gap) T.at(s, bomp(1, f * (1 + .04 * Math.sin(s * 9))), g, pan); };

// ---- A: the hook (dusty wind; the bow held drawn; a slow heartbeat; "?")
T.at(0, wind(B0 + .2, 0, .5), .08, 0);
T.at(0, creak(1.2, .9), .1, -.4);
for (let k = 0; k < 3; k++) T.at(.2 + k * .9, heart(.9), .14, 0);   // ba-dum… ba-dum
T.at(FAIR0, mixb(squeak(700, 1300, .2, .7), plink(note(91), .4)), .08, .4);
T.at(B0 - .35, twang(.8), .12, -.4); T.at(B0 - .3, whoosh(.6, 600, 3600), .2, 0);
// ---- B: the ident
T.at(B0, conch(1.6, 311, .7), .14, 0);
T.at(B0 + .35, pop(.8), .22, 0); T.at(B0 + .7, pop(.6, 1.2), .18, 0);
T.at(C0 - .3, whoosh(.6, 400, 2600), .18, 0);
// ---- C: lake Pampa (water, birds; Hanuman's soft steps and voice; "ting!", a little tune: Ram is amazed)
T.at(C0, stream(D0 - C0), .06, .2);
for (let k = 0; k < 4; k++) T.at(C0 + .4 + k * 1.5, bird(2700 + (k % 3) * 400, .5), .035, -.5 + k * .35);
steps(C0, HANU, .32, .08, 70, .6);
T.at(HANU + .2, talk(AMAZED - HANU + 1.4, HANV, { amp: .7, gap: .15, br: .6 }), .1, .4);
T.at(AMAZED - .15, mixb(chime(note(96), .8, 1.4), shimmer(.8, [note(91), note(96), note(100)], .4, .05)), .09, -.3);   // ting!
T.at(AMAZED, voice([[0, .6, 1, .5]], RAM, { rise: .4 }), .08, -.3);   // "ooh!"
[[79, 0], [83, .3], [86, .6], [91, 1.0]].forEach(([m, s]) => T.at(AMAZED + .5 + s, veena(m, .4), .05, .2));   // the notes
T.at(D0 - .3, whoosh(.5, 500, 2200), .14, 0);
// ---- D: the jewels (the scarf opens: sparkle; Ram's sob); Lakshman shy about the earrings; the anklet's bells
T.at(D0, stream(E0 - D0), .05, .2);
T.at(D0 + .3, talk(JEWELS - D0 - .3, SUGV, { amp: .7 }), .1, .4);
T.at(JEWELS - .3, crinkle(.6, .8), .07, .1);
T.at(JEWELS, mixb(shimmer(1.4, [note(86), note(90), note(93), note(98)], .5, .08), harp(true, .4)), .07, .1);
T.at(JEWELS + .4, sob(3, RAM, .6), .07, -.1);
T.at(EARR, talk(1.4, LAKSH, { amp: .6, gap: .14, br: .4 }), .1, -.4);   // mumble, eyes shut
for (let k = 0; k < 2; k++) T.at(EARR + .4 + k * .3, tok(.4, 2.2), .05, -.4);   // sweat drops
T.at(ANK - .3, bells(.9), .09, -.4);   // ching-ching
T.at(ANK - .2, tanpura(E0 - ANK + .5, .7), .08, 0);
T.at(ANK, talk(BOWED - ANK + 1.2, LAKSH, { amp: .7, gap: .17, shake: .8 }), .1, -.4);
T.at(BOWED, veena(SA + 12, .45), .06, 0); T.at(BOWED + 1, veena(SA + 7, .4), .05, 0);
T.at(E0 - .3, whoosh(.5, 2200, 500), .14, 0);
// ---- E: Vali throws him out (a roar; whoosh; "whoaaa", the slide whistle, a thud and tweeting stars); Ruma, sad
T.at(E0, wind(F0 - E0, 1, .5), .07, 0);
T.at(E0 + .2, roar(.9, 140, 6, 1), .07, -.3);
T.at(THROWN - .1, mixb(whoosh(.4, 600, 3000), bonk(1, 300)), .11, 0);
T.at(THROWN, voice([[0, .8, 1.2, .6]], SUGV, { fall: .5, shake: .4 }), .08, .4);   // "whoaaa"
T.at(THROWN + .05, slide(.8, 600, 1800, .6), .07, .4);
T.at(THROWN + .9, mixb(thud(1), drum(52, .7, .6)), .1, .5);
for (let k = 0; k < 5; k++) T.at(THROWN + 1 + k * .25, chirp(.6), .03, .5);
T.at(WIFE - .2, pop(.6, 1), .08, -.5);
T.at(WIFE, sob(3, RUMA, .5), .05, -.5);
T.at(WIFE + .3, veena(SA + 5, .4), .05, -.3);
T.at(F0 - .3, whoosh(.5, 500, 2600), .16, 0);
// ---- F: the brawl (scuffle, bonks; Ram's puzzled squeaks); Sugriva beaten ("ow!", stars); the garland: ting; again
T.at(F0, wind(G0 - F0, 2, .5), .06, 0);
T.at(F0 + .1, talk(1.2, SUGV, { amp: .8, br: .8, gap: .2 }), .08, .3);   // "VALI! COME OUT!"
T.at(F0 + .3, scuffle(BEATEN - F0 - .3, .9), .2, .4);
for (let k = 0; k < 3; k++) T.at(ALIKE + .2 + k * .6, squeak(600 + k * 150, 1200 + k * 200, .18, .6), .06, -.6);   // ? ? ?
T.at(BEATEN - .05, bonk(1, 260), .18, .5);
T.at(BEATEN, ow(SUGV, .9), .08, .6);
for (let k = 0; k < 5; k++) T.at(BEATEN + .4 + k * .25, chirp(.6), .03, .6);
T.at(GARL - .1, mixb(plink(note(98), .8), shimmer(1, [note(91), note(96), note(100), note(103)], .5, .05)), .1, .3);   // ting! the garland
T.at(GARL + .1, pop(.8, 1.3), .12, .3);
T.at(GARL + .6, scuffle(G0 - GARL - .8, .9), .2, .4);
T.at(G0 - .3, whoosh(.5, 500, 2200), .12, 0);
// ---- G: the arrow (a hush, the bow drawn, a heartbeat; twang, thwip, the hit; "!!")
T.at(G0, wind(H0 - G0, 3, .5), .06, 0);
T.at(G0 + .2, scuffle(STRUCK - G0 - .3, .5), .06, .4);
T.at(G0 + .3, creak(STRUCK - G0 - .6, 1), .1, -.5);
for (let k = 0; k < 2; k++) T.at(G0 + .6 + k * .7, heart(.8), .12, 0);
T.at(STRUCK - .3, twang(1), .16, -.5); T.at(STRUCK - .28, thwip(1), .14, 0);
T.at(STRUCK, mixb(thud(1), drum(40, 1, 1.4)), .18, .2);
T.at(STRUCK + .05, ow(VALIV, 1), .09, .2);
T.at(STRUCK + .1, mixb(slide(.25, 900, 1800, .5), plink(note(93), .6)), .07, .5);   // Sugriva's "!!"
T.at(STRUCK + .6, thud(.8), .12, .1);
// ---- H: is that dharma? (a soft tanpura; Vali's weak voice; Ram's answer; the bubble; Angad's sobs)
T.at(H0 - .3, whoosh(.5, 2200, 500), .1, 0);
T.at(H0, tanpura(I0 - H0 + .3, .7), .08, 0);
T.at(H0, wind(I0 - H0, 1, .6), .04, 0);
T.at(H0 + .3, talk(TOOK - H0 - .5, VALIV, { amp: .7, gap: .2, shake: .7, fall: .2 }), .1, .3);
T.at(TOOK, talk(ACCEPT - TOOK - .3, RAM, { amp: .75, gap: .18 }), .1, -.3);
T.at(BHARAT - .3, pop(.7, 1.1), .1, -.3); T.at(BHARAT - .2, harp(true, .4), .05, -.3);
T.at(ACCEPT, talk(ANGAD - ACCEPT + .4, VALIV, { amp: .6, gap: .2, shake: .7, fall: .2 }), .09, .3);
T.at(ACCEPT + .2, veena(SA + 12, .4), .05, 0);
steps(ANGAD - .5, ANGAD, .2, .05, 80, .6);
T.at(ANGAD + .1, sob(4, ANGV, .6), .07, .6);
T.at(I0 - .3, whoosh(.5, 2200, 500), .1, 0);
// ---- I: the ask (the scales creak to and fro; YES / NO pop)
room(I0, J0, .04);
for (let s = I0 + .2; s < J0 - .2; s += Math.PI / 2.4) T.at(s, creak(.35, .6), .11, Math.sin(s * 2.4) > 0 ? .4 : -.4);
T.at(I0 + .4, mixb(squeak(700, 1300, .2, .6), plink(note(91), .4)), .06, 0);
T.at(YESNO - .15, pop(.9, 1), .14, -.4); T.at(YESNO, pop(.9, 1.3), .14, .4);
T.at(YESNO + .2, mixb(chime(note(93), .7, 1.4), chime(note(98), .4, 1.4)), .07, 0);
// ---- J: the tease (the sea, wind; Hanuman crouches: a power-up whine and a sparkle)
T.at(J0 - .3, whoosh(.6, 600, 2600), .16, 0);
T.at(J0, stream(K0 - J0), .07, .3);
T.at(J0, wind(K0 - J0, 2, .5), .05, 0);
T.at(LEAPS - .4, mixb(slide(1.2, 200, 1400, .7), tone(1.2, t => 100 + 300 * t, { type: 'saw', e: env.swell(.3, .2), amp: .15 })), .08, -.3);   // vwoooOOP
T.at(LEAPS + .7, mixb(shimmer(1.2, [note(86), note(90), note(93), note(98)], .5, .06), drum(46, .9, 1)), .1, -.3);
T.at(K0 - .3, whoosh(.7, 400, 3200), .2, 0);
// ---- K: the card
room(K0, END, .03);
T.at(CARD.head, conch(1.5, 311, .6), .12, 0);
T.at(CARD.title, pop(.9), .22, 0); T.at(CARD.title + .2, pop(.7, 1.2), .18, 0);
T.at(CARD.pill, pop(1, 1.3), .22, 0);
T.at(CARD.ask, plink(note(93), .8), .14, 0);
for (let k = 0; k < 3; k++) T.at(CARD.books + k * .12, pop(.6, 1 + k * .15), .14, (k - 1) * .4);

T.write('assets/rp8_sfx.wav');
// level to -16 LUFS with a fixed gain (no dynamic loudnorm: it would pump the quiet beds up between the hits)
const probe = execFileSync('sh', ['-c', `ffmpeg -hide_banner -i assets/rp8_sfx.wav -af ebur128 -f null - 2>&1 | grep -E '^ +I:' | tail -1`], { encoding: 'utf8' });
const I = parseFloat(probe.match(/-?[\d.]+/)[0]), gain = -16 - I;
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'assets/rp8_sfx.wav', '-af', `volume=${gain.toFixed(2)}dB,alimiter=limit=0.84:level=false,aresample=48000`, '-ar', '48000', '-ac', '2', 'assets/rp8_mix.wav']);
console.log('assets/rp8_mix.wav', END.toFixed(2), 's,', I.toFixed(1), 'LUFS raw, +' + gain.toFixed(1), 'dB');
