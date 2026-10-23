// rp5_sfx.mjs: the sound effects for Ramayan Part 5 (src/scenes/rp5.js) → assets/rp5_sfx.wav, then the mix with the
// voice → assets/rp5_mix.wav. Times come from the voice (src/scenes/rp1_vo.js), computed as the scene does.
// Beds: the tanpura, Panchavati's birds, the battle's drums and rumble, the dusk after, the forest at night. Hits: the
// bow, the ident, her swoon, the brothers' laugh, the lunge and the sword, her scream, Khara's roar, the fourteen, the
// march, the cave, the arrows' rain and the falls, the counter, the hug, the escape, Ravana, the deer, the card.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, plink, clang, click, thud, shimmer, slide, drone, squeak, note, seed, chime, wind, drum, heart, om, conch, chirp, screech, wingbeat, crackle, thunder, gurgle, roar, SR } from './sfx.mjs';

const VO = runInNewContext(readFileSync('src/scenes/rp5_vo.js', 'utf8') + '\n;VO');
const LN = VO.lines, capOf = id => VO.caps.filter(c => c.id === id), Wd = (id, ci, wi) => capOf(id)[ci].at[wi];
const mid = (a, b) => (LN[a].end + LN[b].a) / 2;
const B0 = mid('hook', 'intro'), C0 = mid('intro', 'pan'), D0 = mid('attack', 'khara'), E0 = mid('khara', 'army'), F0 = mid('cave', 'fight'), G0 = mid('time', 'hug');
const H0 = mid('hug', 'twist'), I0 = mid('twist', 'next'), K0 = mid('next', 'follow'), END = LN.follow.end + 2.5;
const ALONE0 = Wd('hook', 0, 4), SURP = Wd('pan', 0, 5), WANTED = Wd('pan', 1, 1), MARRIED = Wd('refuse', 0, 4), BROTHER = Wd('refuse', 0, 7), SENT = Wd('refuse', 1, 1);
const LUNGED = Wd('attack', 0, 2), CUT = Wd('attack', 1, 2), KHARA = Wd('khara', 0, 6), FOURTEEN = Wd('khara', 0, 9), FINISHED = Wd('khara', 0, 13);
const ARMY = Wd('army', 0, 5), CAVE = Wd('cave', 0, 7), FACED = Wd('cave', 0, 9), RAIN = Wd('fight', 0, 4), DUSH = Wd('fight', 0, 5), TRISH = Wd('fight', 0, 7), LASTK = Wd('fight', 0, 12);
const MUH = Wd('time', 0, 8), MIN72 = Wd('time', 1, 1), HUGGED = Wd('hug', 0, 7), ESCAPED = Wd('twist', 0, 3), RAVANA = Wd('twist', 0, 7), DEER = Wd('next', 0, 7);
const CARD = { head: K0 + .1, title: K0 + .5, pill: LN.follow.a + .2, ask: Wd('follow', 1, 1), books: Wd('follow', 1, 2) + .6 };

const T = track(END);
seed(45);
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
const pad = (dur, ms, amp = 1) => mixb(...ms.map((m, i) => tone(dur, t => note(m) * (1 + .003 * Math.sin(t * 2 + i)), { type: 'tri', e: env.swell(.8, .8), amp: amp / ms.length })));
const war = (dur, amp = 1) => noise(dur, { brown: true, lp: 260, e: env.swell(.4, .5), amp: .6 * amp });
// ---- A: the hook
T.at(0, war(B0 + .3), .16, 0);
for (let k = 0; k * .45 < B0; k++) T.at(.1 + k * .45, drum(k % 2 ? 60 : 48, .7, .5), .14, .3);
T.at(.1, slide(ALONE0 - .2, 200, 600, .5), .14, -.4);   // the bow drawn
T.at(ALONE0, mixb(drum(40, 1, 1.4), chord([50, 57, 62], 2, .7)), .3, 0);
T.at(B0 - .3, whoosh(.6, 500, 3000), .25, 0);
// ---- B: the ident
T.at(B0, mixb(conch(1.8, 311, .8), chord([62, 69, 74, 78], 2.4, .9)), .22, 0);
T.at(B0 + .35, pop(.8), .25, 0); T.at(B0 + .7, pop(.6, 1.2), .2, 0);
T.at(C0 - .3, whoosh(.6, 400, 2600), .22, 0);
// ---- C: Panchavati
T.at(C0, tanpura(D0 - C0, .6), .08, 0);
for (let k = 0; k < 5; k++) T.at(C0 + .4 + k * 1.3, chirp(.5), .06, -.5 + k * .25);
for (let k = 0; k < 4; k++) T.at(C0 + .2 + k * .3, thud(.25), .1, .6 - k * .1);   // her steps
T.at(WANTED - .3, mixb(shimmer(1, [note(84), note(88), note(91)], .6, .08), slide(.6, 500, 800, .3)), .18, .2);   // the swoon
T.at(MARRIED, plink(note(81), .7), .2, -.2);
T.at(BROTHER, whoosh(.5, 600, 1600), .14, .4);
T.at(SENT, mixb(plink(note(76), .7), slide(.4, 700, 400, .3)), .2, .5);
T.at(LUNGED - .2, mixb(whoosh(.5, 400, 2400), roar(.6, 180, 6, .4)), .24, -.3);
T.at(CUT - .25, whoosh(.3, 2000, 6000), .3, -.2);
T.at(CUT, mixb(clang(note(88), .6), noise(.2, { hp: 3000, lp: 8000, e: env.pluck(20), amp: .8 })), .3, -.2);
T.at(CUT + .15, slide(1.2, 1100, 700, .6), .2, -.3);   // her scream
// ---- D: Khara
T.at(D0 - .3, whoosh(.6, 2600, 500), .2, 0);
T.at(D0, war(E0 - D0, .8), .12, 0);
T.at(KHARA - .2, roar(1.4, 110, 10, .7), .24, .3);
for (let k = 0; k < 8; k++) T.at(FOURTEEN + k * .2, thud(.3), .1, .5 - k * .1);
for (let k = 0; k < 8; k++) T.at(FINISHED - .8 + k * .12, whoosh(.2, 1500, 5000, .6), .1, -.4 + k * .1);
T.at(FINISHED, mixb(thud(.6), drum(44, .8, 1)), .22, 0);
// ---- E: the army; the cave
T.at(E0, war(F0 - E0, 1), .16, 0);
for (let k = 0; k * .4 < F0 - E0; k++) T.at(E0 + .1 + k * .4, mixb(drum(k % 2 ? 56 : 46, .8, .5), thud(.3)), .14, .3);
T.at(ARMY, roar(1.6, 100, 14, .8), .2, .5);
T.at(CAVE - .4, whoosh(.6, 900, 300), .12, -.6);
T.at(FACED - .3, slide(.6, 200, 600, .5), .18, -.2);
T.at(FACED + .2, mixb(conch(1.4, 294, .7)), .16, -.2);
// ---- F: the battle
T.at(F0, war(G0 - F0, 1.2), .2, 0);
for (let k = 0; k * .3 < G0 - F0; k++) T.at(F0 + .05 + k * .3, mixb(drum(k % 2 ? 62 : 50, .9, .4)), .16, 0);
for (let k = 0; k * .09 < LASTK - RAIN + 1.4; k++) T.at(RAIN - .8 + k * .09, whoosh(.16, 1500, 5000, .5), .07, -.6 + (k % 7) * .2);   // the arrows' rain
for (const [tt, p] of [[DUSH, .2], [TRISH, .4], [LASTK, .6]]) T.at(tt, mixb(roar(.8, 140, 6, .6), thud(1)), .28, p);
for (let k = 0; k < 10; k++) T.at(RAIN + k * ((LASTK - RAIN) / 10), thud(.4), .1, .3 + (k % 3) * .2);
T.at(LASTK + .4, mixb(chord([62, 66, 69, 74], 2.6, .9), shimmer(1.6, [note(86), note(90), note(93), note(98)], .7, .1)), .26, 0);
T.at(MIN72, plink(note(93), .9), .26, 0);
// ---- G: the hug
T.at(G0 - .3, whoosh(.6, 400, 2600), .2, 0);
T.at(G0, tanpura(H0 - G0 + .3, .6), .1, 0);
T.at(HUGGED - .1, mixb(chord([67, 71, 74, 79], 2, .7), pop(.6, 1.3)), .22, 0);
// ---- H: the escape
T.at(H0 - .3, whoosh(.6, 2600, 400), .2, 0);
for (let k = 0; k * .18 < I0 - H0 - .2; k++) T.at(H0 + .1 + k * .18, click(.5), .12, -.4 + k * .04);   // running feet
T.at(ESCAPED, slide(.5, 600, 900, .4), .14, 0);
T.at(RAVANA - .2, mixb(roar(1.6, 100, 10, .8), drum(40, 1, 1.4)), .26, .4);
// ---- I: the tease
T.at(I0 - .3, whoosh(.7, 2600, 400), .2, 0);
T.at(I0, mixb(drone(K0 - I0, note(SA - 24), .7)), .1, 0);
for (let k = 0; k < 4; k++) T.at(I0 + .3 + k * .9, tone(.25, 2200, { e: env.pluck(20), amp: .5 }), .04, .5);
T.at(DEER - .6, mixb(shimmer(1.6, [note(86), note(90), note(93), note(98)], .7, .1), chime(note(98), .6, 2)), .24, .3);
// ---- K: the card
T.at(K0 - .3, whoosh(.7, 400, 3200), .3, 0);
T.at(CARD.head, mixb(conch(1.6, 311, .7), chord([62, 69, 74, 78], 2.4, .8)), .22, 0);
T.at(CARD.title, pop(.9), .28, 0); T.at(CARD.title + .2, pop(.7, 1.2), .22, 0);
T.at(CARD.pill, mixb(pop(1, 1.3), shimmer(.7, [note(91), note(95), note(98)], .6, .06)), .3, 0);
T.at(CARD.ask, plink(note(93)), .22, 0);
for (let k = 0; k < 3; k++) T.at(CARD.books + k * .12, pop(.6, 1 + k * .15), .2, (k - 1) * .4);
T.at(K0, tanpura(END - K0, .6), .08, 0);

T.write('assets/rp5_sfx.wav');
console.log('assets/rp5_sfx.wav', END.toFixed(2), 's');
// the mix: the voice at full level over the SFX, normalised to -14 LUFS (apad needs whole_dur, or it never ends)
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'assets/rp5_vo.wav', '-i', 'assets/rp5_sfx.wav', '-filter_complex',
  `[1:a]volume=0.85[s];[0:a][s]amix=inputs=2:normalize=0:duration=longest,apad=whole_dur=${END.toFixed(3)},atrim=0:${END.toFixed(3)},loudnorm=I=-14:TP=-1.5:LRA=11[o]`,
  '-map', '[o]', '-ar', '48000', '-ac', '2', 'assets/rp5_mix.wav']);
console.log('assets/rp5_mix.wav');
