// rp2_sfx_lite.mjs: the quiet sound for Ramayan Part 2 (owner: the score + SFX version felt overwhelming) → assets/rp2_lite.wav.
// No score: foley carries it (steps, jewels, the throw, steam, fireworks, hooves, birds, the river) over soft room tone, with
// a few small stings on the big beats (the boons, the 14 years, the fall). Same picture, so no re-render: the WAV is muxed onto
// out/rp2_out/rp2.mp4's video (-c:v copy). Times come from src/scenes/rp2_tl.js. The full version stays in tools/rp2_sfx.mjs.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, plink, clang, click, thud, slide, note, seed, chime, wind, drum, conch, chirp, crackle, heart } from './sfx.mjs';

const TL = runInNewContext(readFileSync('src/scenes/rp2_tl.js', 'utf8') + '\n;TL');
const { B0, C0, D0, E0, G0, H0, L0, M0, K0, END, SEND, TOMORROW, CROWNED, LIT, WATCH, OVERJOY, GAVE, JEWEL, NODIFF, THREW, WAKE, BANISH,
  TWO, USE, TORE, LAY, FOUND, SWORE, FIRST, SECOND, YEARS, FELL, BEGGED, MOVE, FACE, LETBE, GO, CURSE, YOUTH, TRUE, CARD } = TL;

const T = track(END);
seed(7);
const pop = (amp = 1, f = 1) => mixb(click(amp), tone(.07, t => f * (500 + 2600 * t / .07), { e: env.pluck(40), amp: amp * .7 }), noise(.05, { lp: 2500, hp: 300, e: env.pluck(60), amp: amp * .5 }));
const veena = (m, amp = 1) => mixb(bell(note(m), 1.4, { partials: [[1, 1], [2, .6], [3, .35], [5, .12]], k: 3, amp }), noise(.02, { hp: 2000, lp: 6000, e: env.pluck(80), amp: amp * .3 }));
const hiss = d => noise(d, { hp: 1500, lp: 7000, e: env.swell(.05, d * .5), amp: .6 });
const jingle = (t, n, pan, g = .1) => { for (let k = 0; k < n; k++) T.at(t + k * .11, chime(note(93 + (k * 5) % 9), .5, .6), g, pan + (k % 3 - 1) * .2); };
const room = (a, b, o = {}) => T.at(a, noise(b - a, { lp: 500, hp: 60, e: env.swell(.6, .6), amp: 1, ...o }), o.g || .05, 0);

// ---- A: the hook (Kaikeyi with Ram) and the ident
room(0, C0);
T.at(.1, heart(.8), .16, 0);   // the little heart
T.at(SEND - .1, mixb(thud(.6), slide(.7, 380, 260, .4)), .16, 0);   // "send him away?"
T.at(B0 - .3, whoosh(.6, 500, 3000, .7), .14, 0);
T.at(B0 + .1, conch(1.4, 311, .5), .1, 0);
T.at(B0 + .35, pop(.7), .16, 0); T.at(B0 + .7, pop(.5, 1.2), .12, 0);
T.at(C0 - .3, whoosh(.5, 400, 2600, .6), .12, 0);
// ---- C: the court
T.at(C0, noise(D0 - C0, { lp: 900, hp: 150, e: env.swell(.6, .6), amp: 1 }), .06, 0);   // the court murmurs
T.at(TOMORROW - .2, conch(1.2, 330, .5), .08, 0);
T.at(CROWNED, noise(1.8, { lp: 3000, hp: 300, e: env.swell(.15, 1.2), amp: 1 }), .12, 0);   // the cheer
for (let k = 0; k < 3; k++) T.at(CROWNED + .2 + k * .45, chime(note([86, 90, 93][k]), .5, 1.4), .07, (k - 1) * .5);   // temple bells
// ---- D: the festival night, Manthara on the terrace
T.at(D0, noise(E0 - D0, { lp: 1200, hp: 150, e: env.swell(.6, .6), amp: 1 }), .05, 0);   // the crowd far off
for (let k = 0; k < 3; k++) { T.at(LIT + k * .66, whoosh(.5, 600, 3000, .5), .1, -.5 + k * .5); T.at(LIT + k * .66 + .45, crackle(.7, .6), .1, -.5 + k * .5); }
T.at(WATCH - .1, slide(.7, 420, 320, .35), .08, .4);   // her look
T.at(WATCH + .4, hiss(1.2), .1, .4);   // the steam
// ---- E–F: the chamber
room(E0, G0, { g: .04 });
for (let k = 0; k < 9; k++) T.at(E0 + .1 + k * .14, click(.55), .14, .7 - k * .08);   // Manthara's hurried steps
T.at(E0 + .05, whoosh(.4, 900, 2600, .5), .08, .6);
for (let k = 0; k < 3; k++) T.at(OVERJOY + .1 + k * .22, pop(.6, 1.2 + k * .15), .14, -.3 + k * .2);   // the hearts
T.at(GAVE, whoosh(.4, 800, 2400, .6), .1, 0);
T.at(JEWEL, chime(note(93), .9, 1.4), .14, .3);   // the jewel glints
T.at(NODIFF - .1, plink(note(91), .6), .1, -.3);
T.at(THREW - .2, whoosh(.5, 400, 3000), .2, .4);
T.at(THREW + .55, mixb(clang(note(93), .6), click(.8)), .2, .7);   // it lands
jingle(THREW + .8, 3, .7, .08);
T.at(WAKE - .1, noise(BANISH + 1 - WAKE, { hp: 1800, lp: 6000, e: env.swell(.2, .3), amp: 1 }), .04, .3);   // the whisper
T.at(BANISH - .3, slide(.6, 500, 340, .4), .1, -.2);
// ---- G: the war (sepia, a memory: kept far away)
T.at(G0 - .3, whoosh(.7, 3000, 500, .7), .14, 0);
T.at(G0, noise(H0 - G0, { brown: true, lp: 300, e: env.swell(.4, .6), amp: 1 }), .08, 0);
for (let k = 0; k < 4; k++) T.at(G0 + .1 + k * .85, drum(50, .7, .9), .1, 0);   // distant war drums
for (let k = 0; k * .28 < TWO - G0 - .4; k++) T.at(G0 + .2 + k * .28, thud(.4), .06, .5);   // hooves
for (let k = 0; k < 4; k++) T.at(G0 + .3 + k * .7, whoosh(.25, 1500, 4500, .6), .08, .8 - k * .4);   // arrows
T.at(TWO - .1, chime(note(86), .7, 2), .12, -.2); T.at(TWO + .25, chime(note(93), .7, 2), .12, .2);   // the two boons
T.at(USE - .1, drum(52, .8, .8), .14, 0);
// ---- H–K: the room of anger
T.at(H0 - .3, whoosh(.6, 2600, 400, .7), .12, 0);
T.at(H0, noise(L0 - H0, { brown: true, lp: 220, e: env.swell(.8, .8), amp: 1 }), .06, 0);
T.at(TORE - .1, noise(.3, { hp: 900, lp: 5000, e: env.hann(), amp: .8 }), .14, 0);   // jewels torn off
jingle(TORE + .25, 5, -.2, .09);
T.at(LAY + .4, thud(.6), .16, 0);
T.at(LAY + .5, hiss(1.6), .1, .3);   // she fumes
for (let k = 0; k < 4; k++) T.at(FOUND - .6 + k * .3, thud(.35), .12, .6 - k * .1);   // the king's steps
T.at(SWORE, veena(74, .7), .1, .3);   // "I swear it"
T.at(FIRST - .1, mixb(drum(52, .8, .8), chime(note(86), .5, 1.4)), .16, -.2);   // FIRST
T.at(SECOND - .1, mixb(drum(48, .8, .8), chime(note(81), .5, 1.4)), .16, .2);   // SECOND
T.at(YEARS - .05, mixb(drum(40, 1, 1.4), noise(1.2, { brown: true, lp: 400, e: env.pluck(3), amp: .8 })), .26, 0);   // 14 YEARS
T.at(FELL - .1, thud(1), .3, .3);   // the king falls
T.at(FELL + .4, veena(62, .6), .08, 0);
T.at(BEGGED, wind(MOVE - BEGGED, 0, .8), .04, 0);   // the long night
T.at(MOVE - .4, whoosh(.4, 800, 300, .6), .1, -.3);   // she turns away
// ---- L: dawn
T.at(L0, wind(M0 - L0, 1, 1), .04, 0);
for (let k = 0; k < 6; k++) T.at(L0 + .4 + k * .7 + (k % 2) * .15, chirp(.5), .05, k % 2 ? .6 : -.5);   // birds
T.at(FACE + .3, veena(69, .6), .08, 0);
T.at(LETBE + .2, veena(74, .5), .06, 0);
T.at(GO - .1, conch(1.4, 294, .45), .08, 0);
// ---- M: the tease (the river at night)
T.at(M0 - .3, whoosh(.6, 2600, 400, .7), .12, 0);
T.at(M0, noise(K0 - M0, { lp: 1600, hp: 200, e: env.swell(.6, .6), amp: 1 }), .06, 0);
for (let k = 0; k < 4; k++) T.at(M0 + .3 + k * .9, tone(.25, 2200, { e: env.pluck(20), amp: .5 }), .03, -.5);   // crickets
T.at(CURSE - .4, slide(.6, 200, 600, .5), .1, -.3);   // the bow drawn
T.at(YOUTH, noise(.8, { lp: 1200, hp: 300, e: env.hann(), amp: .7 }), .16, .5);   // a sound at the water
T.at(TRUE, drum(44, 1, 1.4), .24, 0);
// ---- N: the card
room(K0, END, { g: .03 });
T.at(K0 - .3, whoosh(.6, 400, 3200, .7), .16, 0);
T.at(CARD.head, conch(1.4, 311, .5), .1, 0);
T.at(CARD.title, pop(.9), .2, 0); T.at(CARD.title + .2, pop(.7, 1.2), .16, 0);
T.at(CARD.pill, pop(1, 1.3), .2, 0);
T.at(CARD.ask, plink(note(93)), .14, 0);
for (let k = 0; k < 3; k++) T.at(CARD.books + k * .12, pop(.6, 1 + k * .15), .14, (k - 1) * .4);

T.write('assets/rp2_lite_sfx.wav');
// loudness: SFX alone is spiky, so a linear gain to -16 LUFS and a peak limiter, never loudnorm's dynamic mode (it would
// pump the room tone up between the hits)
const probe = execFileSync('sh', ['-c', `ffmpeg -hide_banner -i assets/rp2_lite_sfx.wav -af ebur128 -f null - 2>&1 | grep -E '^ +I:' | tail -1`], { encoding: 'utf8' });
const I = parseFloat(probe.match(/-?[\d.]+/)[0]), gain = -16 - I;
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'assets/rp2_lite_sfx.wav', '-af', `volume=${gain.toFixed(2)}dB,alimiter=limit=0.84:level=false,aresample=48000`, '-ar', '48000', '-ac', '2', 'assets/rp2_lite.wav']);
console.log('assets/rp2_lite.wav', END.toFixed(2), 's; SFX', I, 'LUFS, gain', gain.toFixed(1), 'dB');
