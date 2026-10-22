// blue_sfx.mjs: the sound effects for "Why are Hindu gods BLUE?" (src/scenes/blue.js) → assets/blue_sfx.wav, then the
// mix with the voice → assets/blue_mix.wav. Times come from the voice (src/scenes/blue_vo.js), computed as the scene does.
// Each shot has a quiet bed under the voice (a warm pad, monsoon rain, dusk frogs, the sea, paper, a night drone, a
// room) and a few hits on top: the "?" plink, the gods popping in, the cloud, thunder and rain, the lotus shimmer, the
// chakra and the clouds turning blue, brush strokes and the pop, the white sweep and the take, the aarti bell, the gulp
// and the throat, crayon scribbles, the card.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, plink, clang, click, thud, shimmer, slide, drone, squeak, crackle, note, seed, chime, wind, drum, thunder, gurgle, crinkle, om, SR } from './sfx.mjs';

const VO = runInNewContext(readFileSync('src/scenes/blue_vo.js', 'utf8') + '\n;VO');
const LN = VO.lines, capOf = id => VO.caps.filter(c => c.id === id), Wd = (id, ci, wi) => capOf(id)[ci].at[wi];
const mid = (a, b) => (LN[a].end + LN[b].a) / 2;
const B0 = mid('names', 'krsna'), C0 = mid('ghana', 'ram'), D0 = mid('ram', 'vish'), E0 = mid('vish', 'paint');
const F0 = mid('paint', 'twist'), I0 = mid('throat', 'kid'), J0 = mid('kid', 'ask'), CARD = LN.ask.end + 1.4, END = CARD + 7.6;
const N0 = Wd('names', 0, 0), NAMES = Wd('names', 0, 6);
const DARK = Wd('krsna', 0, 3), GHAN = Wd('ghana', 0, 5), RAINC = Wd('ghana', 1, 3);
const BLOTUS = Wd('ram', 1, 3), VISH = Wd('vish', 0, 2), MEGHA = Wd('vish', 1, 0);
const MONS = LN.paint.a, SO = Wd('paint', 1, 0), BLUEW = Wd('paint', 1, 6);
const NOTB = Wd('twist', 1, 3), KARP = LN.karp.a, THR0 = LN.throat.a, THROAT = Wd('throat', 0, 2), SAVE = Wd('throat', 2, 0);
const ASKK = Wd('kid', 0, 4), NOWK = Wd('kid', 1, 0), YES = Wd('ask', 1, 1);
const CAP_T = CARD + .1, COVERS = CARD + .4, PRICE = CARD + 1.2, STRIKE = CARD + 1.7, DEAD = CARD + 2.2, PILL = CARD + 2.7;

const T = track(END);
seed(30);
const add = (o, b, s0, g = 1) => { const s = Math.round(s0 * SR); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j] * g; return o; };
const pop = (amp = 1, f = 1) => mixb(click(amp), tone(.07, t => f * (500 + 2600 * t / .07), { e: env.pluck(40), amp: amp * .7 }), noise(.05, { lp: 2500, hp: 300, e: env.pluck(60), amp: amp * .5 }));
const chord = (ms, d = 2, amp = 1) => { const o = new Float32Array(Math.round((d + 1) * SR)); ms.forEach((m, i) => add(o, bell(note(m), d, { partials: [[1, 1], [2, .35], [3, .12]], k: 1.4, amp }), i * .05)); return o; };
const pad = (dur, ms, amp = 1) => mixb(...ms.map((m, i) => tone(dur, t => note(m) * (1 + .003 * Math.sin(t * 2 + i)), { type: 'tri', e: env.swell(.8, .8), amp: amp / ms.length })));
const rainBed = (dur, amp = 1) => noise(dur, { lp: 5200, hp: 900, e: env.swell(.8, .8), amp });
const frog = (amp = 1) => mixb(tone(.09, t => 330 + 120 * Math.sin(t * 90), { type: 'saw', e: env.hann(), amp }), tone(.09, 660, { e: env.hann(), amp: amp * .2 }));
const sea = (dur, amp = 1) => noise(dur, { lp: t => 500 + 350 * Math.sin(t * .9), hp: 80, e: env.swell(.8, .8), amp });
const brushSwish = (d = .5, amp = 1) => noise(d, { lp: 3800, hp: 1200, e: env.hann(), amp });
const handBell = (amp = 1) => bell(note(93), 1.2, { partials: [[1, 1], [2.7, .5], [4.1, .25]], k: 3, amp });

// ---- A: the hook
T.at(0, pad(B0 + .3, [62, 69, 74], 1), .14, 0);
T.at(.2, plink(note(86)), .22, .3);                                          // "?"
T.at(.95, squeak(900, 1300, .1, .5), .1, -.2);                               // hands flip
for (const [k, dt] of [[0, 0], [1, .3], [2, .6]]) T.at(N0 + dt, pop(.9, 1 + k * .18), .3, [-.6, -.25, .5][k]);
T.at(NAMES, chord([74, 78, 81], 1.4, .7), .16, 0);
T.at(B0 - .45, whoosh(.9, 300, 2400), .35, .6);                             // the cloud rolls over

// ---- B: monsoon
T.at(B0, wind(C0 - B0, 0), .08, 0);
T.at(B0 + .3, thunder(2.4, .35), .22, .5);
T.at(DARK, plink(note(81)), .18, 0);
T.at(GHAN + .2, shimmer(.8, [note(84), note(88), note(91)], .7, .07), .2, .3);   // the swatch
T.at(RAINC - .1, thunder(2.0, .7), .3, .4);
T.at(RAINC, rainBed(C0 - RAINC, 1), .22, 0);
T.at(RAINC + .2, chord([72, 76, 79], 1.4, .6), .12, 0);
T.at(C0 - .25, whoosh(.5, 600, 4500), .35, .6);                             // whip

// ---- C: the pond at dusk
T.at(C0, pad(D0 - C0, [60, 67, 72], .8), .1, 0);
for (let k = 0; k < 6; k++) T.at(C0 + .4 + k * .7, frog(.6), .05, k % 2 ? .6 : -.5);
T.at(C0 + 1.3, plink(note(79), .6), .1, .3);                                 // water
T.at(BLOTUS, mixb(shimmer(1.0, [note(88), note(91), note(95), note(100)], .7, .06), plink(note(100))), .22, 0);
T.at(D0 - .3, brushSwish(.6, 1), .25, 0);

// ---- D: the ocean, megha-varnam
T.at(D0, sea(E0 - D0, 1), .14, 0);
T.at(D0, om(E0 - D0, 110, .5), .06, 0);
T.at(VISH, chime(note(86), .7, 1.6), .14, 0);
T.at(MEGHA, mixb(shimmer(1.2, [note(84), note(88), note(91), note(96)], .8, .08), slide(.6, 300, 900, .3)), .22, 0);
T.at(E0 - .45, whoosh(.5, 500, 3500), .3, 0);                               // push into the paper

// ---- E: the painting
T.at(E0, noise(F0 - E0, { lp: 1200, hp: 200, e: env.swell(.3, .3), amp: .4 }), .04, 0);   // room
T.at(MONS - .45, click(.5), .2, -.4);                                       // brush taps the bowl
T.at(MONS + .2, brushSwish(1.0, 1), .2, -.2);
T.at(MONS + 1.2, brushSwish(.7, .8), .18, .2);
T.at(SO - .35, click(.5), .2, -.1);
for (const dt of [.1, .6, 1.1]) T.at(SO + dt, brushSwish(.5, 1), .2, 0);
T.at(BLUEW - .05, mixb(pop(1, 1.2), chord([76, 79, 83, 88], 1.4, .7)), .3, 0);
T.at(BLUEW + .9, mixb(plink(note(96)), click(.5)), .25, .1);               // wink

// ---- F: Shiva
T.at(F0, drone(I0 - F0, 55, .6), .12, 0);
T.at(F0 + .3, chime(note(74), .6, 2.5), .1, 0);
T.at(NOTB - .15, mixb(whoosh(1.0, 2000, 6000), shimmer(1.0, [note(91), note(95), note(98), note(103)], .7, .08)), .25, 0);   // the white sweep
T.at(NOTB + .75, mixb(slide(.25, 300, 900, .6), click(.6)), .3, 0);         // the take
for (let k = 0; k < 7; k++) T.at(KARP + .3 + k * .55, handBell(.8), .12, (k % 2 ? .3 : -.3));   // the aarti bell
T.at(KARP + .2, crackle(THR0 - KARP - .5, .3), .05, .2);                    // the camphor flame
T.at(THR0 + .1, noise(1.2, { lp: 400, hp: 40, e: env.swell(.3, .5), amp: .5 }), .12, 0);   // the poison's rumble
T.at(THROAT - .2, gurgle(.7, .8), .2, .1);                                   // the gulp
T.at(THROAT + .3, mixb(slide(.5, 200, 120, .4), chord([62, 65, 69], 1.6, .6)), .16, 0);
T.at(SAVE, mixb(chord([74, 78, 81, 86], 2.0, .8), shimmer(1.2, [note(86), note(90), note(93)], .6, .08)), .2, 0);

// ---- I: home
T.at(I0, noise(J0 - I0, { lp: 900, hp: 120, e: env.swell(.3, .3), amp: .4 }), .04, 0);
for (let k = 0; k < 5; k++) T.at(I0 + .2 + k * .42, crinkle(.3, .8), .1, .2);   // crayon scribbles
T.at(ASKK, plink(note(84)), .2, 0);                                         // "?"
T.at(NOWK, mixb(chord([72, 76, 79, 84], 1.6, .8), plink(note(96))), .25, 0);

// ---- J: the ask
T.at(J0 - .3, whoosh(.6, 400, 3000), .22, 0);
T.at(J0, pad(CARD - J0, [65, 69, 72], .9), .12, 0);
for (let k = 0; k < 4; k++) T.at(J0 + .3 + k * .8, drum(90, .6, .3), .08, 0);
T.at(YES, mixb(plink(note(96)), click(.6)), .3, 0);

// ---- K: the card
T.at(CARD - .3, whoosh(.7, 400, 3200), .3, 0);
T.at(CAP_T, chord([67, 71, 74, 79], 2.2, .7), .25, 0);
for (let k = 0; k < 3; k++) T.at(COVERS + k * .12, pop(.8, 1 + k * .15), .3, (k - 1) * .4);
T.at(PRICE, pop(.6, .9), .2, 0);
T.at(STRIKE, mixb(noise(.28, { lp: 4200, hp: 900, e: env.hann(), amp: .8 }), clang(note(88), .5)), .3, 0);
T.at(DEAD, plink(note(91)), .2, 0);
T.at(PILL, mixb(pop(1, 1.3), shimmer(.7, [note(91), note(95), note(98)], .6, .06)), .32, 0);
T.at(CARD, pad(END - CARD, [67, 71, 74], .7), .08, 0);

T.write('assets/blue_sfx.wav');
console.log('assets/blue_sfx.wav', END.toFixed(2), 's');
// the mix: the voice at full level over the SFX, normalised to -14 LUFS
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'assets/blue_vo.wav', '-i', 'assets/blue_sfx.wav', '-filter_complex',
  `[1:a]volume=0.85[s];[0:a][s]amix=inputs=2:normalize=0:duration=longest,apad,atrim=0:${END.toFixed(3)},loudnorm=I=-14:TP=-1.5:LRA=11[o]`,
  '-map', '[o]', '-ar', '48000', '-ac', '2', 'assets/blue_mix.wav']);
console.log('assets/blue_mix.wav');
