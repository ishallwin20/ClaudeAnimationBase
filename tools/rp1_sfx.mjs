// rp1_sfx.mjs: the sound effects for Ramayan Part 1 (src/scenes/rp1.js) → assets/rp1_sfx.wav, then the mix with the
// voice → assets/rp1_mix.wav. Times come from the voice (src/scenes/rp1_vo.js), computed as the scene does.
// Beds: a soft tanpura drone (Sa and Pa) under the story, the forest at the ashram, the river and its birds, the court's
// veena, the night chamber. Hits: the hook's blaze, the ident's chord, Narad's cloud and veena, the bubble, the cranes'
// calls, the arrow and its strike, her cry, the verse's bells, the hunter's gasp, the counted beats, the notes, Brahma's
// conch and light, the leaf, the pull-back, the boys' song, the boons, the card.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, plink, clang, click, thud, shimmer, slide, drone, squeak, note, seed, chime, wind, drum, heart, om, conch, chirp, screech, wingbeat, SR } from './sfx.mjs';

const VO = runInNewContext(readFileSync('src/scenes/rp1_vo.js', 'utf8') + '\n;VO');
const LN = VO.lines, capOf = id => VO.caps.filter(c => c.id === id), Wd = (id, ci, wi) => capOf(id)[ci].at[wi];
const mid = (a, b) => (LN[a].end + LN[b].a) / 2;
const B0 = mid('hook', 'intro'), C0 = mid('intro', 'ask'), D0 = mid('narad', 'river'), F0 = mid('arrow', 'burst'), F2 = mid('shloka', 'curse');
const G0 = mid('curse', 'froze'), H0 = mid('shoka', 'brahma'), I0 = mid('promise', 'twist'), J0 = mid('twist', 'next'), K0 = mid('next', 'follow'), END = LN.follow.end + 2.5;
const PERFECT = Wd('ask', 1, 7), SMILED = Wd('narad', 0, 1), RAMW = Wd('narad', 0, 7);
const KRAUNCHA = Wd('river', 1, 3), MALE = Wd('arrow', 0, 6), HIT = MALE - .2, MATE = Wd('arrow', 1, 1);
const BROKE = Wd('burst', 0, 2), BURST = Wd('burst', 0, 5), SHL = LN.shloka.a, HUNTER = LN.curse.a, LOVE = Wd('curse', 1, 5);
const FROZE = Wd('froze', 0, 2), RHYTHM = Wd('froze', 1, 6), SUNG = Wd('froze', 1, 11), SHOKA = Wd('shoka', 0, 1), SHLOKA = Wd('shoka', 0, 6);
const BRAHMA = Wd('brahma', 0, 1), WILL = Wd('brahma', 1, 5), STORY = Wd('brahma', 2, 3), MOUNT = Wd('promise', 0, 3), TOLD = Wd('promise', 1, 4);
const SING = Wd('twist', 0, 4), HIMSELF = Wd('twist', 2, 4), QUEEN = Wd('next', 1, 1), BOONS = Wd('next', 1, 4);
const CARD = { head: K0 + .1, title: K0 + .5, pill: LN.follow.a + .2, ask: Wd('follow', 1, 1), books: Wd('follow', 1, 2) + .6 };

const T = track(END);
seed(41);
const pop = (amp = 1, f = 1) => mixb(click(amp), tone(.07, t => f * (500 + 2600 * t / .07), { e: env.pluck(40), amp: amp * .7 }), noise(.05, { lp: 2500, hp: 300, e: env.pluck(60), amp: amp * .5 }));
const chord = (ms, d = 2, amp = 1) => { const o = new Float32Array(Math.round((d + 1) * SR)); ms.forEach((m, i) => { const b = bell(note(m), d, { partials: [[1, 1], [2, .35], [3, .12]], k: 1.4, amp }); const s = Math.round(i * .05 * SR); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j]; }); return o; };
// a tanpura-ish drone: Pa, Sa, Sa, low Sa plucked in turn over a held tone (D as Sa)
const SA = 50;
const tanpura = (dur, amp = 1) => {
  const o = mixb(tone(dur, note(SA - 12), { type: 'tri', e: env.swell(1.2, 1.2), amp: .25 * amp }), tone(dur, note(SA - 5), { type: 'sine', e: env.swell(1.2, 1.2), amp: .12 * amp }));
  const pl = [SA - 5, SA, SA, SA - 12];
  for (let k = 0; k * .55 < dur - 1.5; k++) { const b = bell(note(pl[k % 4]), 2.2, { partials: [[1, 1], [2, .5], [3, .3], [4, .2]], k: 1.1, amp: .22 * amp }); const s = Math.round(k * .55 * SR); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j] * Math.min(1, (dur - k * .55) / 1.5); }
  return o;
};
const veena = (m, amp = 1) => mixb(bell(note(m), 1.2, { partials: [[1, 1], [2, .6], [3, .35], [5, .12]], k: 3, amp }), noise(.02, { hp: 2000, lp: 6000, e: env.pluck(80), amp: amp * .3 }));
const craneCall = (amp = 1, f = 1) => mixb(tone(.32, t => f * (900 + 500 * Math.sin(t * 30) * Math.exp(-t * 4)), { type: 'tri', e: env.ad(.02, .14), amp }), tone(.32, t => f * 1800, { e: env.ad(.02, .08), amp: amp * .25 }));

// ---- A: the hook's blaze
T.at(0, mixb(noise(B0 + .2, { brown: true, lp: 300, e: env.swell(.05, .4), amp: .6 }), shimmer(1.6, [note(74), note(78), note(81), note(86)], .7, .08)), .18, 0);
T.at(.05, chord([62, 66, 69, 74], 2.2, .8), .2, 0);
T.at(B0 - .3, whoosh(.6, 500, 3000), .25, 0);

// ---- B: the ident
T.at(B0, mixb(conch(1.8, 311, .8), chord([62, 69, 74, 78], 2.4, .9)), .22, 0);
T.at(B0 + .35, pop(.8), .25, 0); T.at(B0 + .7, pop(.6, 1.2), .2, 0);
T.at(C0 - .3, whoosh(.6, 400, 2600), .22, 0);

// ---- C: the ashram
T.at(C0, wind(D0 - C0, 1, .8), .06, 0);
for (let k = 0; k < 7; k++) T.at(C0 + .5 + k * 1.3 + (k % 3) * .2, chirp(.6), .08, -.6 + (k % 4) * .4);
T.at(C0 + .1, whoosh(1.6, 800, 300), .12, .4);   // Narad's cloud drifts down
T.at(C0 + 1.6, mixb(shimmer(.8, [note(86), note(90), note(93)], .5, .07)), .14, .4);
T.at(PERFECT, plink(note(81), .8), .22, -.3);
for (let k = 0; k < 6; k++) T.at(SMILED + .3 + k * .22, veena([74, 76, 78, 81, 78, 86][k], .8), .2, .4);
T.at(RAMW - .25, mixb(pop(.9), shimmer(1.2, [note(86), note(90), note(93), note(98)], .7, .07)), .26, .2);
T.at(RAMW, chord([74, 78, 81, 86], 2, .8), .18, 0);

// ---- D–E: the river, the pair, the arrow, her cry
T.at(D0, noise(F0 - D0, { lp: 1800, hp: 200, e: env.swell(.8, .8), amp: .5 }), .08, 0);   // the water
T.at(D0, tanpura(F0 - D0 + .5, .8), .12, 0);
for (let k = 0; k < 4; k++) T.at(KRAUNCHA - .6 + k * .7, craneCall(.7, k % 2 ? 1.15 : 1), .16, k % 2 ? .3 : -.1);
for (let k = 0; k < 3; k++) T.at(KRAUNCHA + .3 + k * 1.1, wingbeat(.6), .1, 0);
T.at(HIT - .5, whoosh(.52, 1200, 4500), .4, .6);
T.at(HIT, mixb(thud(.8), click(1)), .4, -.1);
T.at(HIT + .45, thud(.6), .3, -.1);
T.at(MATE - .2, screech(1.1, 2200, .5), .14, .2);
for (let k = 0; k < 3; k++) T.at(MATE + .4 + k * .55, craneCall(.7, .85), .16, .2);

// ---- F: the burst, the shloka
T.at(F0, tanpura(F2 - F0 + .5, .7), .1, 0);
T.at(BROKE, slide(1.2, 520, 420, .3), .08, 0);
T.at(BURST - .3, noise(1, { brown: true, lp: 400, e: env.swell(.6, .2), amp: .7 }), .2, 0);
T.at(SHL - .05, mixb(chord([62, 66, 69, 74, 78], 3, .9), om(4.5, 98, .5)), .22, 0);
for (let i = 0; i < 4; i++) T.at(SHL + i * 1.05, mixb(chime(note(86 + [0, 4, 7, 12][i]), .7, 1.6)), .2, -.3 + i * .2);
// ---- F2: the curse lands
T.at(F2 - .3, whoosh(.5, 3000, 600), .2, .3);
T.at(HUNTER, squeak(500, 900, .25, .7), .14, .4);   // his gasp
T.at(HUNTER + .1, noise(.6, { hp: 1500, lp: 6000, e: env.swell(.05, .4), amp: .5 }), .1, .4);
T.at(LOVE - .1, whoosh(.8, 300, 1500), .16, .6);   // he backs off into the bushes
T.at(F2, drone(G0 - F2, note(SA - 12), .6), .1, 0);

// ---- G: he froze; the beats; the notes
T.at(FROZE, plink(note(93), .8), .25, 0);
for (let k = 0; k < 4; k++) T.at(RHYTHM - .5 + k / 3, click(.8), .25, -.3);
for (let k = 0; k < 5; k++) T.at(SUNG - .1 + k * .25, veena([74, 78, 81, 86, 81][k], .8), .2, .2);
T.at(G0, tanpura(H0 - G0 + .5, .7), .1, 0);
T.at(SHLOKA - .1, mixb(shimmer(1.2, [note(86), note(90), note(93), note(98)], .7, .08), chord([74, 78, 81], 1.8, .6)), .22, 0);

// ---- H: Brahma
T.at(H0, mixb(conch(2.6, 294, .9)), .2, 0);
T.at(H0 + .2, shimmer(2.4, [note(81), note(86), note(90), note(93), note(98)], .7, .12), .16, 0);
T.at(H0, om(I0 - H0, 98, .5), .1, 0);
T.at(WILL - .3, chord([62, 69, 74, 78], 2.2, .8), .2, -.1);
T.at(STORY - .2, mixb(whoosh(.8, 600, 2400), shimmer(.9, [note(93), note(98)], .6, .1)), .2, -.3);
T.at(MOUNT - .5, mixb(whoosh(1.4, 200, 1600), drum(55, .8, 1.2)), .2, 0);
T.at(TOLD, chord([62, 66, 69, 74, 78, 81], 2.6, .9), .24, 0);
T.at(I0 - .3, whoosh(.6, 400, 2600), .2, 0);

// ---- I: the court
T.at(I0, noise(J0 - I0, { lp: 700, hp: 100, e: env.swell(.6, .6), amp: .3 }), .06, 0);   // the hall's murmur
const raga = [74, 76, 78, 81, 83, 81, 78, 76];
for (let k = 0; k * .3 < J0 - I0 - .6; k++) T.at(I0 + .4 + k * .3, veena(raga[k % 8] + (k % 16 > 7 ? 0 : -12 + 12), .7), .14, k % 2 ? .3 : -.3);
T.at(SING, tanpura(J0 - SING, .6), .08, 0);
T.at(HIMSELF - .3, mixb(shimmer(1.4, [note(86), note(90), note(93)], .6, .1), chord([74, 78, 81, 86], 2.2, .7)), .2, 0);

// ---- J: the night chamber
T.at(J0 - .3, whoosh(.7, 2600, 400), .2, 0);
T.at(J0, mixb(drone(K0 - J0, note(SA - 24), .8), noise(K0 - J0, { brown: true, lp: 250, e: env.swell(.8, .8), amp: .5 })), .14, 0);
for (let k = 0; k < 4; k++) T.at(J0 + .8 + k * 1.4, drum(48, .7, 1), .12, 0);
T.at(QUEEN - .3, slide(.8, 300, 220, .4), .1, 0);
T.at(BOONS - .2, chime(note(86), .8, 1.6), .25, -.2); T.at(BOONS + .05, chime(note(81), .8, 1.6), .22, .2);

// ---- K: the follow card
T.at(K0 - .3, whoosh(.7, 400, 3200), .3, 0);
T.at(CARD.head, mixb(conch(1.6, 311, .7), chord([62, 69, 74, 78], 2.4, .8)), .22, 0);
T.at(CARD.title, pop(.9), .28, 0); T.at(CARD.title + .2, pop(.7, 1.2), .22, 0);
T.at(CARD.pill, mixb(pop(1, 1.3), shimmer(.7, [note(91), note(95), note(98)], .6, .06)), .3, 0);
T.at(CARD.ask, plink(note(93)), .22, 0);
for (let k = 0; k < 3; k++) T.at(CARD.books + k * .12, pop(.6, 1 + k * .15), .2, (k - 1) * .4);
T.at(K0, tanpura(END - K0, .6), .08, 0);

T.write('assets/rp1_sfx.wav');
console.log('assets/rp1_sfx.wav', END.toFixed(2), 's');
// the mix: the voice at full level over the SFX, normalised to -14 LUFS (apad needs whole_dur, or it never ends)
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'assets/rp1_vo.wav', '-i', 'assets/rp1_sfx.wav', '-filter_complex',
  `[1:a]volume=0.85[s];[0:a][s]amix=inputs=2:normalize=0:duration=longest,apad=whole_dur=${END.toFixed(3)},atrim=0:${END.toFixed(3)},loudnorm=I=-14:TP=-1.5:LRA=11[o]`,
  '-map', '[o]', '-ar', '48000', '-ac', '2', 'assets/rp1_mix.wav']);
console.log('assets/rp1_mix.wav');
