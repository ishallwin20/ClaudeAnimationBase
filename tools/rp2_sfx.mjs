// rp2_sfx.mjs: the sound effects for Ramayan Part 2 (src/scenes/rp2.js) → assets/rp2_sfx.wav, then the mix with the Lyria
// score → assets/rp2_mix.wav. Times come from the scene's timeline (src/scenes/rp2_tl.js). No voice: the score carries the
// mood (its beds and chords), so these are the hits and the foley: the hook's heart and chill, the ident, the crowning,
// fireworks, Manthara's scurry, the jewel's chime and its throw, the whisper, the war, the boons, the jewels torn off,
// the king's steps and oath, the asks, the fall, dawn, the tease, the card.
import { readFileSync, existsSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, plink, clang, click, thud, shimmer, slide, drone, squeak, note, seed, chime, wind, drum, heart, om, conch, chirp, screech, wingbeat, crackle, SR } from './sfx.mjs';

const TL = runInNewContext(readFileSync('src/scenes/rp2_tl.js', 'utf8') + '\n;TL');
const { B0, C0, D0, E0, G0, H0, L0, M0, K0, END, SEND, TOMORROW, CROWNED, LIT, WATCH, RAN, OVERJOY, GAVE, JEWEL, NODIFF, THREW, WAKE, BANISH,
  TWO, TORE, LAY, FOUND, SWORE, RAMS, FIRST, CROWNB, SECOND, FOREST, YEARS, FELL, BEGGED, MOVE, FACE, LETBE, GO, CURSE, YOUTH, TRUE, CARD } = TL;

const T = track(END);
seed(42);
const pop = (amp = 1, f = 1) => mixb(click(amp), tone(.07, t => f * (500 + 2600 * t / .07), { e: env.pluck(40), amp: amp * .7 }), noise(.05, { lp: 2500, hp: 300, e: env.pluck(60), amp: amp * .5 }));
const chord = (ms, d = 2, amp = 1) => { const o = new Float32Array(Math.round((d + 1) * SR)); ms.forEach((m, i) => { const b = bell(note(m), d, { partials: [[1, 1], [2, .35], [3, .12]], k: 1.4, amp }); const s = Math.round(i * .05 * SR); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j]; }); return o; };
const veena = (m, amp = 1) => mixb(bell(note(m), 1.2, { partials: [[1, 1], [2, .6], [3, .35], [5, .12]], k: 3, amp }), noise(.02, { hp: 2000, lp: 6000, e: env.pluck(80), amp: amp * .3 }));
const craneCall = (amp = 1, f = 1) => mixb(tone(.32, t => f * (900 + 500 * Math.sin(t * 30) * Math.exp(-t * 4)), { type: 'tri', e: env.ad(.02, .14), amp }), tone(.32, t => f * 1800, { e: env.ad(.02, .08), amp: amp * .25 }));

const boonHit = () => mixb(shimmer(.8, [note(90), note(93), note(98)], .7, .06), chime(note(86), .7, 1.2));
// ---- A: the hook
T.at(0, chord([67, 71, 74, 79], 2, .7), .18, 0);
T.at(.1, mixb(pop(.6, 1.3), shimmer(.8, [note(84), note(88), note(91)], .5, .07)), .18, .2);   // the heart
T.at(SEND - .3, mixb(slide(.8, 520, 300, .5), noise(.8, { brown: true, lp: 300, e: env.swell(.2, .4), amp: .5 })), .2, 0);   // the chill
T.at(B0 - .3, whoosh(.6, 500, 3000), .25, 0);
// ---- B: the ident
T.at(B0, mixb(conch(1.8, 311, .8), chord([62, 69, 74, 78], 2.4, .9)), .22, 0);
T.at(B0 + .35, pop(.8), .25, 0); T.at(B0 + .7, pop(.6, 1.2), .2, 0);
T.at(C0 - .3, whoosh(.6, 400, 2600), .22, 0);
// ---- C: the court
T.at(C0, noise(D0 - C0, { lp: 700, hp: 100, e: env.swell(.5, .5), amp: .3 }), .06, 0);
T.at(TOMORROW - .2, conch(1.4, 330, .7), .16, 0);
T.at(CROWNED - .2, mixb(shimmer(1.6, [note(86), note(90), note(93), note(98)], .6, .1), chord([74, 78, 81, 86], 2, .7)), .2, 0);
for (let k = 0; k < 6; k++) T.at(CROWNED + k * .3, chime(note([86, 90, 93, 98, 93, 90][k]), .5, 1.2), .1, (k % 3 - 1) * .5);
// ---- D: festival night
T.at(D0, noise(E0 - D0, { lp: 1200, hp: 150, e: env.swell(.6, .6), amp: .35 }), .07, 0);   // the crowd far off
for (let k = 0; k < 3; k++) T.at(LIT + k * .66, mixb(whoosh(.5, 600, 3000, .6), crackle(.6, .6)), .14, -.5 + k * .5);
for (let k = 0; k < 6; k++) T.at(D0 + .6 + k * .6, drum(k % 2 ? 90 : 70, .4, .4), .07, 0);
T.at(WATCH - .1, mixb(slide(.9, 420, 300, .4)), .14, .4);   // her look\nT.at(WATCH + .4, noise(1.2, { hp: 1500, lp: 7000, e: env.swell(.05, .6), amp: .6 }), .12, .4);   // the steam
// ---- E–F: the chamber
for (let k = 0; k < 9; k++) T.at(E0 + .1 + k * .14, click(.55), .16, .7 - k * .08);   // Manthara's hurried steps
T.at(E0 + .05, whoosh(.5, 900, 2600, .7), .12, .6);
for (let k = 0; k < 3; k++) T.at(OVERJOY + .1 + k * .22, pop(.6, 1.2 + k * .15), .14, -.3 + k * .2);   // the hearts
T.at(OVERJOY - .2, mixb(chord([72, 76, 79, 84], 1.8, .8), shimmer(.9, [note(88), note(91), note(96)], .6, .07)), .2, -.2);
T.at(GAVE, whoosh(.5, 800, 2400), .14, 0);
T.at(JEWEL, mixb(chime(note(93), .9, 1.4), chime(note(98), .6, 1.2)), .24, .3);
T.at(NODIFF - .1, mixb(pop(.6, 1.3), plink(note(91), .7)), .18, -.3);
T.at(THREW - .2, whoosh(.6, 400, 3000), .26, .4);
T.at(THREW + .55, mixb(clang(note(93), .6), click(.8)), .26, .7);   // it lands
for (let k = 0; k < 3; k++) T.at(THREW + .8 + k * .18, chime(note(98 - k * 5), .4, .6), .12, .7);
T.at(WAKE - .1, noise(G0 - WAKE, { hp: 1800, lp: 6000, e: env.swell(.2, .3), amp: .3 }), .07, .3);   // the whisper
T.at(BANISH - .3, mixb(pop(.7), slide(.6, 500, 340, .4)), .2, -.2);
// ---- G: the war (sepia)
T.at(G0 - .3, whoosh(.7, 3000, 500), .25, 0);
T.at(G0, mixb(noise(H0 - G0, { brown: true, lp: 300, e: env.swell(.3, .5), amp: .7 })), .16, 0);
for (let k = 0; k * .42 < H0 - G0 - .3; k++) T.at(G0 + .1 + k * .42, mixb(drum(k % 2 ? 58 : 48, .9, .6)), .18, 0);
for (let k = 0; k * .28 < H0 - G0 - .3; k++) T.at(G0 + .2 + k * .28, thud(.4), .07, .5);   // hooves
for (let k = 0; k < 6; k++) T.at(G0 + .3 + k * .8, whoosh(.25, 1500, 4500, .7), .1, .8 - k * .3);   // arrows
T.at(TWO - .3, mixb(chord([74, 78, 81, 86], 2.2, .9), shimmer(1.4, [note(90), note(93), note(98)], .7, .1)), .26, 0);
// ---- H–K: the room of anger
T.at(H0 - .3, whoosh(.7, 2600, 400), .2, 0);
T.at(H0, noise(L0 - H0, { brown: true, lp: 220, e: env.swell(.8, .8), amp: .5 }), .1, 0);
T.at(TORE - .1, mixb(noise(.3, { hp: 900, lp: 5000, e: env.hann(), amp: .8 })), .2, 0);
for (let k = 0; k < 5; k++) T.at(TORE + .25 + k * .17, chime(note(93 + (k % 3) * 3), .5, .7), .15, -.6 + k * .2);
T.at(LAY + .4, thud(.6), .2, 0);
T.at(LAY + .5, noise(1.6, { hp: 1500, lp: 7000, e: env.swell(.05, .8), amp: .6 }), .12, .3);   // she fumes
for (let k = 0; k < 4; k++) T.at(FOUND - .6 + k * .3, thud(.35), .14, .6 - k * .1);   // the king's steps
T.at(RAMS - .3, mixb(shimmer(1.2, [note(86), note(90), note(93)], .6, .08), chime(note(86), .6, 1.6)), .2, .3);
T.at(FIRST - .1, mixb(drum(52, 1, 1), boonHit()), .28, -.2);
T.at(CROWNB - .1, chime(note(91), .8, 1.4), .2, -.2);
T.at(SECOND - .1, mixb(drum(48, 1, 1), boonHit()), .28, .2);
T.at(FOREST - .1, mixb(chime(note(79), .7, 1.6)), .2, .2);
T.at(YEARS - .05, mixb(drum(40, 1, 1.4), noise(1.2, { brown: true, lp: 400, e: env.pluck(3), amp: .8 })), .34, 0);
T.at(FELL - .1, mixb(thud(1), slide(1, 400, 200, .5)), .36, .3);
T.at(BEGGED, slide(2.6, 600, 480, .3), .07, .3);
T.at(MOVE - .4, whoosh(.4, 800, 300), .14, -.3);
// ---- L: dawn
T.at(L0 - .3, mixb(shimmer(1.6, [note(81), note(86), note(90)], .5, .12)), .14, 0);
for (let k = 0; k < 4; k++) T.at(L0 + .5 + k * 1.1, chirp(.5), .06, .6);
T.at(FACE, chord([62, 69, 74], 2.4, .6), .14, 0);
T.at(GO - .1, mixb(conch(1.6, 294, .6)), .14, 0);
// ---- M: the tease
T.at(M0 - .3, whoosh(.7, 2600, 400), .2, 0);
T.at(M0, noise(K0 - M0, { lp: 1600, hp: 200, e: env.swell(.6, .6), amp: .4 }), .1, 0);   // the river at night
for (let k = 0; k < 4; k++) T.at(M0 + .3 + k * .9, tone(.25, 2200, { e: env.pluck(20), amp: .5 }), .04, -.5);   // crickets
T.at(CURSE - .4, slide(.6, 200, 600, .5), .14, -.3);   // the bow drawn
T.at(YOUTH, mixb(noise(.8, { lp: 1200, hp: 300, e: env.hann(), amp: .7 })), .2, .5);   // a sound at the water
T.at(TRUE, mixb(drum(44, 1, 1.4)), .3, 0);
// ---- N: the card
T.at(K0 - .3, whoosh(.7, 400, 3200), .3, 0);
T.at(CARD.head, mixb(conch(1.6, 311, .7), chord([62, 69, 74, 78], 2.4, .8)), .22, 0);
T.at(CARD.title, pop(.9), .28, 0); T.at(CARD.title + .2, pop(.7, 1.2), .22, 0);
T.at(CARD.pill, mixb(pop(1, 1.3), shimmer(.7, [note(91), note(95), note(98)], .6, .06)), .3, 0);
T.at(CARD.ask, plink(note(93)), .22, 0);
for (let k = 0; k < 3; k++) T.at(CARD.books + k * .12, pop(.6, 1 + k * .15), .2, (k - 1) * .4);

T.write('assets/rp2_sfx.wav');
console.log('assets/rp2_sfx.wav', END.toFixed(2), 's');
// the mix: the score (Lyria take A of 2 from tools/rp2_score.txt: 70.2 s, its celebration at 6.5, a hush at 27.5, the
// heartbreak from 47, the outro from 64, faded out by 67.5) under the SFX, normalised to -14 LUFS
const SCORE = 'assets/rp2_score.mp3';
if (existsSync(SCORE)) {
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', SCORE, '-i', 'assets/rp2_sfx.wav', '-filter_complex', [
    `[0:a]aresample=48000,atrim=0:${END},asetpts=PTS-STARTPTS,volume=0.55[m]`,
    '[1:a]volume=1.3[s]', `[m][s]amix=inputs=2:duration=longest:normalize=0,apad=whole_dur=${END.toFixed(3)},atrim=0:${END.toFixed(3)},loudnorm=I=-14:TP=-1.5:LRA=14,aresample=48000[o]`].join(';'),
    '-map', '[o]', '-ar', '48000', '-ac', '2', 'assets/rp2_mix.wav']);
  console.log('assets/rp2_mix.wav');
}
