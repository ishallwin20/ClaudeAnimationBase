// rp7_sfx.mjs: the sound for Ramayan Part 7 (src/scenes/rp7.js, no voice) → assets/rp7_sfx.wav, then levelled to
// -16 LUFS → assets/rp7_mix.wav. Times come from src/scenes/rp7_tl.js. Retro cartoon foley in the manner of the
// Shumbha and Bal Hanuman sun reels: the jewels tumbling with a slide whistle, the poof and Ravana's laugh, ten heads
// swooning (heartbeats, a slide whistle up), a cartoon lion's roar on "lioness" and their gasp, the donkeys' hee-haw,
// the wind of the sky, Jatayu's screech and wingbeats, the sword, the feathers, the monkeys' chatter and their "ooh?!"
// as the bundle plops down, a ta-da for Hanuman, the arrow's thwip. Quiet beds under it (birds, wind, crickets); the
// only music is a soft tanpura and veena under the empty hut, Jatayu dying and the pyre.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, plink, clang, click, thud, shimmer, slide, squeak, note, seed, rnd, clamp, chime, wind, drum, heart, conch, thunder, roar, splash, chirp, fire, screech, wingbeat, crinkle, SR } from './sfx.mjs';

const TL = runInNewContext(readFileSync('src/scenes/rp7_tl.js', 'utf8') + '\n;TL');
const { B0, C0, D0, E0, F0, G0, H0, I0, J0, K1, L0, M0, K0, END, FACE, GUEST, QUEEN, ANSW, LIONESS, GRAB, ROSE, DONKEYS, TREES, RIVER, DEER, TELL, CUT, FIVE, TIED, DROPPED,
  SEARCH, BREATH, TOOK, HANU, TREE, CARD } = TL;

const T = track(END);
seed(39);
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

const SITA = 330, RAM = 150, LAKSH = 175, MEND = 130, MONK = 420, RAVAN = 95, JAT = 520;
const laugh = (n, f, amp = 1) => voice(Array.from({ length: n }, (_, i) => [i * .2, .14, 1.15 - i * .04, .55]), f, { amp, fall: .25 });
const echo = (b, n = 4, gap = .32, k = .5) => { const o = new Float32Array(b.length + Math.round(n * gap * SR)); for (let i = 0; i <= n; i++) add(o, i ? lp(Float32Array.from(b), 2600 - i * 400) : b, i * gap, Math.pow(k, i)); return o; };
const heehaw = (amp = 1) => voice([[0, .32, 1.6, .9], [.36, .45, .9, .6], [.86, .3, 1.6, .9], [1.2, .5, .85, .6]], 300, { amp, shake: .6, fall: .15 });
const ooh = (f, amp = 1) => voice([[0, .22, 1, .4], [.26, .22, 1.2, .5], [.52, .3, 1.5, .7]], f, { amp, rise: .2 });   // monkey: ooh-ooh-AAH
const steps = (a, b, gap, g, f = 62, pan = 0) => { for (let s = a; s < b - .05; s += gap) T.at(s, bomp(1, f * (1 + .04 * Math.sin(s * 9))), g, pan); };

// ---- A: the hook (sky wind; the bundle tumbles and sparkles; "?")
T.at(0, wind(B0 + .2, 0, .5), .1, 0);
T.at(.02, shimmer(1.6, [note(86), note(90), note(93), note(98)], .5, .09), .1, 0);
T.at(.1, slide(1.6, 1800, 600, .5), .08, 0);   // wheee, falling
for (let k = 0; k < 5; k++) T.at(.3 + k * .55, plink(note(96 + (k % 3) * 4), .35), .04, -.4 + k * .2);
T.at(1.4, squeak(700, 1300, .2, .6), .06, .4);   // "?"
T.at(B0 - .3, whoosh(.6, 600, 3600), .2, 0);
// ---- B: the ident
T.at(B0, conch(1.6, 311, .7), .14, 0);
T.at(B0 + .35, pop(.8), .22, 0); T.at(B0 + .7, pop(.6, 1.2), .18, 0);
T.at(C0 - .3, whoosh(.6, 400, 2600), .18, 0);
// ---- C: the guest (birds; Sita's welcome; the holy man's chuckle; POOF: Ravana and his laugh; her eek)
room(C0, D0, .04);
for (let k = 0; k < 4; k++) T.at(C0 + .3 + k * 1.4, bird(2600 + (k % 3) * 400, .5), .03, -.6 + k * .4);
T.at(GUEST, talk(1.2, SITA, { amp: .7, gap: .15 }), .1, -.3);
T.at(FACE - 1, laugh(3, MEND, .6), .06, .4);   // heh heh heh
T.at(FACE - .25, poof(1), .16, .4); T.at(FACE - .2, pop(1, .7), .14, .4);
T.at(FACE - .1, mixb(drum(40, 1, 1.4), thunder(1.6, .5)), .15, .3);
T.at(FACE + .3, laugh(5, RAVAN, .9), .08, .4);   // MWAHAHA
T.at(FACE + .05, voice([[0, .3, 1.4, .8]], SITA, { rise: .5 }), .08, -.3);   // "eek!"
T.at(FACE + .15, mixb(slide(.25, 900, 1800, .5), plink(note(93), .6)), .07, -.3);
T.at(D0 - .3, whoosh(.5, 500, 2200), .14, 0);
// ---- D: be my queen (ten heads swoon); a jackal wants a lioness? (a lion's roar; the heads gasp)
room(D0, E0, .04);
for (let k = 0; k < 3; k++) T.at(D0 + .1 + k * .45, heart(.8), .1, .4);   // ba-dum
T.at(D0 + .15, slide(.7, 500, 1500, .6), .06, .4);   // the slide whistle up
for (let i = 0; i < 5; i++) T.at(D0 + .3 + i * .12, pop(.5, 1.3 + i * .1), .06, .1 + i * .15);   // hearts
T.at(QUEEN, talk(1.3, RAVAN, { amp: .8, gap: .2, fall: .2 }), .1, .4);
for (let i = 0; i < 4; i++) T.at(QUEEN + 1.4 + i * .05, voice([[0, .7, 1, .4]], RAVAN * (1 + i * .15), { fall: .3 }), .025, .1 + i * .15);   // "hmmm~"
T.at(ANSW - .2, mixb(shimmer(.8, [note(81), note(86)], .4, .06), whoosh(.4, 800, 3000, .4)), .07, -.3);   // she lights up
T.at(ANSW, talk(LIONESS - ANSW + .6, SITA, { amp: .85, gap: .14, br: .7 }), .1, -.3);
T.at(LIONESS - .1, roar(1, 180, 3, 1), .1, -.3);   // RAWR (the lioness)
T.at(LIONESS, drum(44, 1, 1), .14, 0);
for (let i = 0; i < 6; i++) T.at(LIONESS + .05 + i * .05, voice([[0, .3, 1.3, .7]], RAVAN * (1 + i * .13), { rise: .6 }), .03, .1 + i * .12);   // "HUH?!" ×6
for (let i = 0; i < 4; i++) T.at(LIONESS + .4 + i * .1, tok(.4, 2 + i * .1), .05, .3);   // sweat drops
T.at(E0 - .3, whoosh(.5, 500, 2600), .16, 0);
// ---- E: the grab (her scream); the chariot rises (wind, rumbling wheels, a magic shimmer); hee-haw: the donkeys
T.at(E0, wind(F0 - E0, 1, .5), .07, 0);
T.at(GRAB - .1, whoosh(.4, 600, 3000), .16, 0);
T.at(GRAB, scream(1, SITA, { fall: .1 }), .09, -.2);
T.at(GRAB + .3, mixb(drum(44, .8, .8), thud(.6)), .12, 0);
T.at(ROSE - .6, mixb(slide(1.6, 200, 900, .6), shimmer(1.8, [note(74), note(78), note(81), note(86)], .5, .12)), .07, 0);
T.at(ROSE - .6, noise(2.2, { lp: 300, hp: 40, e: env.swell(.3, .8), amp: .6 }), .08, 0);   // the wheels' rumble
for (let s = E0 + .5; s < F0; s += .26) T.at(s, tok(.5, s % .52 < .26 ? .6 : .66), .04, .5);   // clip-clop
T.at(DONKEYS + .2, heehaw(1), .12, .5);   // HEE-HAW
T.at(DONKEYS + .3, plink(note(91), .6), .07, .5);
T.at(F0 - .3, whoosh(.6, 600, 2600), .16, 0);
// ---- F: she cries out (to the trees: rustle; the river; the deer looks up: "!")
T.at(F0, wind(G0 - F0, 2, .5), .07, 0);
T.at(F0 + .2, talk(TELL - F0 + .8, SITA, { amp: .85, gap: .16, shake: .8, br: .8 }), .1, -.2);
T.at(TREES, noise(1, { hp: 800, lp: 5000, e: env.swell(.1, .5), amp: .5 }), .06, -.4);   // the trees rustle
T.at(RIVER - .1, stream(1.4), .07, .2);
T.at(DEER + .2, mixb(plink(note(91), .7), slide(.2, 900, 1600, .4)), .08, .5);
T.at(TELL, scream(.9, SITA, { amp: .9, fall: .3 }), .07, -.2);
T.at(G0 - .3, whoosh(.5, 600, 2600), .16, 0);
// ---- G: Jatayu (screeches, wingbeats; Ravana fumes); the sword cuts his wings; feathers; he falls
T.at(G0, wind(H0 - G0, 3, .5), .07, 0);
T.at(G0 + .2, screech(.9, 2600, .9), .07, .5);
for (let s = G0 + .1; s < CUT; s += .22) T.at(s, wingbeat(.8, 1), .05, .4);
T.at(G0 + 1.2, screech(.7, 2900, .8), .06, .3);
T.at(G0 + .8, talk(1.4, RAVAN, { amp: .9, br: .8, gap: .2 }), .08, -.4);
T.at(CUT - .3, whoosh(.3, 1500, 6000), .14, 0);
T.at(CUT, shing(1), .15, 0); T.at(CUT, drum(40, 1, 1.4), .16, 0);
T.at(CUT + .05, screech(1.1, 2200, 1), .08, .2);
for (let i = 0; i < 8; i++) T.at(CUT + .1 + i * .08, noise(.2, { hp: 1200, lp: 5000, e: env.hann(), amp: .4 }), .035, -.6 + i * .15);   // feathers
T.at(CUT + .3, slide(1.6, 1400, 260, .6), .07, .2);   // the long fall
T.at(H0 - .3, whoosh(.5, 600, 2600), .14, 0);
// ---- H: five monkeys (chatter below); she ties the jewels; they drop; plop; "ooh?!"
T.at(H0, wind(I0 - H0, 4, .5), .08, 0);
for (let k = 0; k < 4; k++) T.at(H0 + .3 + k * .75, ooh(MONK * (1 + (k % 3) * .1), .6), .07, -.4 + k * .25);
T.at(FIVE, mixb(plink(note(86), .5), plink(note(90), .5)), .06, 0);
T.at(TIED, crinkle(.8, .8), .06, -.3);   // the scarf knotted
T.at(DROPPED - .3, slide(.6, 1800, 500, .6), .07, 0);   // wheee
T.at(DROPPED + .3, mixb(thud(.7), bonk(.6, 300)), .12, 0);   // plop
for (let i = 0; i < 5; i++) T.at(DROPPED + .4 + i * .08, voice([[0, .35, 1.2, .6]], MONK * (1 + i * .1), { rise: .7 }), .06, -.6 + i * .3);   // "ooh?!"
T.at(I0 - .3, whoosh(.5, 2200, 500), .12, 0);
// ---- I: the empty hut (a soft tanpura; his call echoes, "Si-taaa!")
T.at(I0, tanpura(L0 - I0 + .2, .7), .08, 0);
T.at(I0, wind(J0 - I0, 1, .6), .04, 0);
steps(I0, I0 + .9, .3, .07, 62, 0);
T.at(I0 + .4, squeak(700, 1300, .2, .6), .05, 0);   // "?"
T.at(I0 + .9, veena(SA + 12, .45), .05, 0);
const call = voice([[0, .3, 1.2, .7], [.35, .8, 1.35, .7]], RAM, { shake: .5, fall: .1 });
T.at(SEARCH, echo(call, 3, .4, .45), .1, 0); T.at(SEARCH + 1.5, echo(call, 3, .4, .45), .08, 0);
// ---- J: Jatayu dying (his weak voice; a slowing heart; Ram's sobs)
T.at(J0 - .3, whoosh(.5, 2200, 500), .1, 0);
T.at(J0 + .3, sob(4, RAM, .6), .07, -.2);
T.at(BREATH, voice([[0, .25, 1, .4], [.35, .25, .95, .4], [.7, .4, .9, .4]], JAT, { amp: .7, fall: .3, shake: .3 }), .1, .3);   // "Ra-va-na…"
for (let k = 0; k < 4; k++) T.at(BREATH + .2 + k * (.7 + k * .25), heart(.6 - k * .1), .1, .3);   // the heart slows
T.at(TOOK + 1, veena(SA + 7, .45), .05, 0);
// ---- K: the pyre (fire; hands joined; a veena)
T.at(K1 - .3, whoosh(.5, 2200, 500), .1, 0);
T.at(K1, fire(L0 - K1, .3, 1), .08, .3);
T.at(K1 + .3, veena(SA + 12, .45), .05, 0); T.at(K1 + 1.5, veena(SA + 10, .4), .045, 0); T.at(K1 + 2.4, veena(SA + 7, .45), .05, 0);
// ---- L: the twist (birds; a drum roll; ta-da for Hanuman; his giggle)
T.at(L0 - .3, whoosh(.5, 500, 2400), .14, 0);
room(L0, M0, .04);
for (let k = 0; k < 3; k++) T.at(L0 + .3 + k * 1.2, bird(2700 + (k % 2) * 500, .5), .03, -.5 + k * .5);
for (let s = HANU - 1; s < HANU - .05; s += .05) T.at(s, drum(66, .3 + .5 * (s - HANU + 1), .2), .06, 0);   // drrrrr…
T.at(HANU, tada(.8), .1, 0); T.at(HANU, drum(48, 1, .8), .12, 0);
T.at(HANU + .2, shimmer(1.4, [note(86), note(90), note(93), note(98), note(102)], .5, .08), .06, 0);
T.at(HANU + .5, laugh(4, MONK * .8, .6), .05, 0);   // hee hee
// ---- M: the tease (Ram meets Hanuman: a heart pop; the arrow by the tree: thwip, DUN)
T.at(M0 - .3, whoosh(.5, 500, 2400), .14, 0);
room(M0, K0, .04);
T.at(M0 + .2, mixb(pop(.6, 1.4), harp(true, .4)), .06, .3);
T.at(TREE - .4, thwip(1), .14, 0); T.at(TREE, mixb(thud(.6), drum(42, 1, 1.4)), .16, .2);
T.at(TREE + .1, thunder(1.4, .4), .08, 0);
T.at(K0 - .3, whoosh(.7, 400, 3200), .2, 0);
// ---- N: the card
room(K0, END, .03);
T.at(CARD.head, conch(1.5, 311, .6), .12, 0);
T.at(CARD.title, pop(.9), .22, 0); T.at(CARD.title + .2, pop(.7, 1.2), .18, 0);
T.at(CARD.pill, pop(1, 1.3), .22, 0);
T.at(CARD.ask, plink(note(93), .8), .14, 0);
for (let k = 0; k < 3; k++) T.at(CARD.books + k * .12, pop(.6, 1 + k * .15), .14, (k - 1) * .4);

T.write('assets/rp7_sfx.wav');
// level to -16 LUFS with a fixed gain (no dynamic loudnorm: it would pump the quiet beds up between the hits)
const probe = execFileSync('sh', ['-c', `ffmpeg -hide_banner -i assets/rp7_sfx.wav -af ebur128 -f null - 2>&1 | grep -E '^ +I:' | tail -1`], { encoding: 'utf8' });
const I = parseFloat(probe.match(/-?[\d.]+/)[0]), gain = -16 - I;
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'assets/rp7_sfx.wav', '-af', `volume=${gain.toFixed(2)}dB,alimiter=limit=0.84:level=false,aresample=48000`, '-ar', '48000', '-ac', '2', 'assets/rp7_mix.wav']);
console.log('assets/rp7_mix.wav', END.toFixed(2), 's,', I.toFixed(1), 'LUFS raw, +' + gain.toFixed(1), 'dB');
