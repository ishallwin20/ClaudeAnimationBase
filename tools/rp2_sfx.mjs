// rp2_sfx.mjs: the sound effects for Ramayan Part 2 (src/scenes/rp2.js) → assets/rp2_sfx.wav, then the mix with the
// voice → assets/rp2_mix.wav. Times come from the voice (src/scenes/rp1_vo.js), computed as the scene does.
// Beds: the tanpura under the story, the court, festival night, the chamber, the war's drums, the dark room, dawn.
// Hits: the hook's heart and chill, the ident, the crowning, fireworks, Manthara's steps, the jewel's chime and its throw,
// the whisper, the war, the boons, the jewels torn off, the king's steps and oath, the asks, the fall, dawn, the tease.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, plink, clang, click, thud, shimmer, slide, drone, squeak, note, seed, chime, wind, drum, heart, om, conch, chirp, screech, wingbeat, crackle, SR } from './sfx.mjs';

const VO = runInNewContext(readFileSync('src/scenes/rp2_vo.js', 'utf8') + '\n;VO');
const LN = VO.lines, capOf = id => VO.caps.filter(c => c.id === id), Wd = (id, ci, wi) => capOf(id)[ci].at[wi];
const mid = (a, b) => (LN[a].end + LN[b].a) / 2;
const B0 = mid('hook', 'intro'), C0 = mid('intro', 'crown'), D0 = mid('crown', 'city'), E0 = mid('city', 'happy'), G0 = mid('throw', 'boons'), H0 = mid('boons', 'room');
const L0 = mid('fell', 'dawn'), M0 = mid('dawn', 'next'), K0 = mid('next', 'follow'), END = LN.follow.end + 2.5;
const SEND = Wd('hook', 0, 7), TOMORROW = Wd('crown', 0, 3), CROWNED = Wd('crown', 0, 7), LIT = Wd('city', 0, 1), WATCH = Wd('city', 0, 7);
const RAN = Wd('happy', 0, 1), OVERJOY = Wd('happy', 0, 8), GAVE = Wd('happy', 1, 1), JEWEL = Wd('happy', 1, 4), NODIFF = Wd('same', 0, 3);
const THREW = Wd('throw', 0, 1), WAKE = Wd('throw', 0, 5), BANISH = Wd('throw', 0, 9);
const TWO = Wd('boons', 1, 4), TORE = Wd('room', 0, 2), LAY = Wd('room', 0, 7), FOUND = Wd('swear', 0, 2), SWORE = Wd('swear', 0, 6), RAMS = Wd('swear', 0, 8);
const FIRST = Wd('ask', 0, 0), CROWNB = Wd('ask', 0, 2), SECOND = Wd('ask', 1, 0), FOREST = Wd('ask', 1, 5), YEARS = Wd('ask', 1, 7);
const FELL = Wd('fell', 0, 1), BEGGED = Wd('fell', 0, 3), MOVE = Wd('fell', 0, 10), FACE = Wd('dawn', 0, 7), GO = Wd('dawn', 1, 5);
const CURSE = Wd('next', 0, 6), YOUTH = Wd('next', 0, 9), TRUE = Wd('next', 0, 13);
const CARD = { head: K0 + .1, title: K0 + .5, pill: LN.follow.a + .2, ask: Wd('follow', 1, 1), books: Wd('follow', 1, 2) + .6 };

const T = track(END);
seed(42);
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
T.at(C0, tanpura(D0 - C0 + .4, .7), .1, 0);
T.at(TOMORROW - .2, conch(1.4, 330, .7), .16, 0);
T.at(CROWNED - .2, mixb(shimmer(1.6, [note(86), note(90), note(93), note(98)], .6, .1), chord([74, 78, 81, 86], 2, .7)), .2, 0);
for (let k = 0; k < 6; k++) T.at(CROWNED + k * .3, chime(note([86, 90, 93, 98, 93, 90][k]), .5, 1.2), .1, (k % 3 - 1) * .5);
// ---- D: festival night
T.at(D0, noise(E0 - D0, { lp: 1200, hp: 150, e: env.swell(.6, .6), amp: .35 }), .07, 0);   // the crowd far off
for (let k = 0; k < 3; k++) T.at(LIT + k * .66, mixb(whoosh(.5, 600, 3000, .6), crackle(.6, .6)), .14, -.5 + k * .5);
for (let k = 0; k < 6; k++) T.at(D0 + .6 + k * .6, drum(k % 2 ? 90 : 70, .4, .4), .07, 0);
T.at(WATCH - .1, mixb(slide(.9, 420, 300, .4)), .14, .4);   // her look
// ---- E–F: the chamber
T.at(E0, tanpura(G0 - E0 + .4, .6), .09, 0);
for (let k = 0; k < 5; k++) T.at(E0 + .1 + k * .2, click(.5), .14, .6 - k * .1);   // Manthara's hurried steps
T.at(OVERJOY - .2, mixb(chord([72, 76, 79, 84], 1.8, .8), shimmer(.9, [note(88), note(91), note(96)], .6, .07)), .2, -.2);
T.at(GAVE, whoosh(.5, 800, 2400), .14, 0);
T.at(JEWEL, mixb(chime(note(93), .9, 1.4), chime(note(98), .6, 1.2)), .24, .3);
T.at(NODIFF - .1, mixb(pop(.6, 1.3), plink(note(91), .7)), .18, -.3);
T.at(THREW - .2, whoosh(.6, 400, 3000), .26, .4);
T.at(THREW + .55, mixb(clang(note(93), .6), click(.8)), .26, .7);   // it lands
for (let k = 0; k < 3; k++) T.at(THREW + .8 + k * .18, chime(note(98 - k * 5), .4, .6), .12, .7);
T.at(WAKE - .1, noise(G0 - WAKE, { hp: 1800, lp: 6000, e: env.swell(.2, .3), amp: .3 }), .07, .3);   // the whisper
T.at(WAKE, drone(G0 - WAKE, note(38), .8), .12, 0);
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
T.at(H0, mixb(drone(L0 - H0, note(SA - 24), .8), noise(L0 - H0, { brown: true, lp: 220, e: env.swell(.8, .8), amp: .5 })), .12, 0);
T.at(TORE - .1, mixb(noise(.3, { hp: 900, lp: 5000, e: env.hann(), amp: .8 })), .2, 0);
for (let k = 0; k < 5; k++) T.at(TORE + .25 + k * .17, chime(note(93 + (k % 3) * 3), .5, .7), .15, -.6 + k * .2);
T.at(LAY + .4, thud(.6), .2, 0);
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
T.at(L0, tanpura(M0 - L0 + .4, .7), .1, 0);
for (let k = 0; k < 4; k++) T.at(L0 + .5 + k * 1.1, chirp(.5), .06, .6);
T.at(FACE, chord([62, 69, 74], 2.4, .6), .14, 0);
T.at(GO - .1, mixb(conch(1.6, 294, .6)), .14, 0);
// ---- M: the tease
T.at(M0 - .3, whoosh(.7, 2600, 400), .2, 0);
T.at(M0, mixb(noise(K0 - M0, { lp: 1600, hp: 200, e: env.swell(.6, .6), amp: .4 }), drone(K0 - M0, note(SA - 24), .7)), .1, 0);   // the river at night
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
T.at(K0, tanpura(END - K0, .6), .08, 0);

T.write('assets/rp2_sfx.wav');
console.log('assets/rp2_sfx.wav', END.toFixed(2), 's');
// the mix: the voice at full level over the SFX, normalised to -14 LUFS (apad needs whole_dur, or it never ends)
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'assets/rp2_vo.wav', '-i', 'assets/rp2_sfx.wav', '-filter_complex',
  `[1:a]volume=0.85[s];[0:a][s]amix=inputs=2:normalize=0:duration=longest,apad=whole_dur=${END.toFixed(3)},atrim=0:${END.toFixed(3)},loudnorm=I=-14:TP=-1.5:LRA=11[o]`,
  '-map', '[o]', '-ar', '48000', '-ac', '2', 'assets/rp2_mix.wav']);
console.log('assets/rp2_mix.wav');
