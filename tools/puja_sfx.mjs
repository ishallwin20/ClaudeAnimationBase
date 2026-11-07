// puja_sfx.mjs: the sound effects for "Lakshmi Puja, step by step" (src/scenes/puja.js) → assets/puja_sfx.wav, then the
// mix with the voice → assets/puja_mix.wav. Times come from the voice and the timeline (src/scenes/puja_vo.js +
// puja_tl.js, loaded with vm), so they follow the picture.
// A soft tanpura-like drone of a few notes runs under everything (mild, a Sindoor-style bed: never loud); a small
// bell rings on each STEP number; then each step's own sounds: a shine for cleaning, water pouring, a cloth swish, three
// soft landings, a rustle for the clothes, the coin's clink in the pot, three drops, a conch for Ganesha first, the
// incense, the havan's fire and "swaha" whoosh, the aarti's hand bell, petals, a hush and a chime for forgiveness,
// diyas puffing alight, anklet bells on the footprints, a pop on the ask, the card.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, plink, click, shimmer, note, seed, chime, thud, rnd, fire, conch, crinkle, splash, wind } from './sfx.mjs';

const TL = runInNewContext(readFileSync('src/scenes/puja_vo.js', 'utf8') + '\n' + readFileSync('src/scenes/puja_tl.js', 'utf8') + '\n;TL');
const T = track(TL.END);
seed(83);
const pop = (amp = 1, f = 1) => mixb(click(amp), tone(.07, t => f * (500 + 2600 * t / .07), { e: env.pluck(40), amp: amp * .7 }), noise(.05, { lp: 2500, hp: 300, e: env.pluck(60), amp: amp * .5 }));
const pad = (dur, ms, amp = 1) => mixb(...ms.map((m, i) => tone(dur, t => note(m) * (1 + .003 * Math.sin(t * 2 + i)), { type: 'tri', e: env.swell(1.2, 1.2), amp: amp / ms.length })));
const handBell = (amp = 1) => bell(note(93 + Math.floor(rnd() * 2)), 1.2, { partials: [[1, 1], [2.3, .5], [3.9, .3], [5.6, .15]], k: 3, amp });
const templeBell = (f = 76, amp = 1) => bell(note(f), 4, { partials: [[1, 1], [2.02, .6], [2.76, .45], [4.1, .3], [5.4, .18]], k: 1.1, amp });
const puff = (amp = 1) => mixb(noise(.25, { lp: 1400, hp: 120, e: env.pluck(14), amp }), fire(.4, .5 * amp, .2 * amp));
const swish = (dur = .6, amp = 1) => noise(dur, { lp: t => 1200 + 3000 * Math.sin(Math.PI * t / dur), hp: 400, e: env.hann(), amp });
const clink = (amp = 1, f = 2900) => bell(f, .5, { partials: [[1, 1], [2.4, .5], [4.1, .3]], k: 7, amp });
const drop = (amp = 1) => mixb(tone(.12, t => 900 + 1400 * t / .12, { e: env.pluck(30), amp }), noise(.05, { hp: 1500, lp: 6000, e: env.pluck(70), amp: amp * .3 }));
const ghungroo = (amp = 1) => { const o = []; for (let k = 0; k < 5; k++) o.push(bell(4200 + rnd() * 2600, .35, { partials: [[1, 1], [1.6, .4]], k: 10, amp: amp * (.5 + rnd() * .5) })); return mixb(...o.map((b, k) => { const s = Math.round(k * .012 * 48000), z = new Float32Array(b.length + s); z.set(b, s); return z; })); };
const pour = (dur, amp = 1) => noise(dur, { lp: t => 2600 + 600 * Math.sin(t * 17), hp: 500, e: env.swell(.15, .3), amp });

// ---- the bed: a soft drone (Sa and Pa) all the way, quieter under the voice
T.at(0, pad(TL.CARD + .5, [50, 57, 62], 1), .035, 0);
T.at(0, templeBell(64, 1), .1, .3);
T.at(TL.SAVE, chime(note(79), .7, 2), .08, 0);
T.at(TL.STEP, chime(note(84), .6, 2), .06, 0);
// when: dusk at the door, a far bell, the lamps lit
T.at(TL.WHEN0, wind(TL.S10 - TL.WHEN0 + .4, 1, .4), .03, 0);
T.at(TL.PRADOSH, templeBell(60, .8), .08, -.3);
for (let i = 0; i < 6; i++) T.at(TL.PRADOSH - .1 + i * .15, puff(.5), .035, (i - 2.5) * .25);
// a small bell on every step's number
const steps = ['S10', 'S20', 'S30', 'S40', 'S50', 'S60', 'S70', 'S80', 'S90', 'S100', 'S110', 'S120', 'S130', 'S140'];
steps.forEach((k, i) => T.at(TL[k] + .2, clink(.9, note(86 + (i % 3) * 2)), .09, 0));
// 1 · clean: a shine sweeps; water pours over the brass; the cloth wipes
T.at(TL.CLEAN, shimmer(1.4, [79, 83, 86, 91].map(note), .5, .12), .07, 0);
T.at(TL.BATH - .6, pour(TL.CLAY - TL.BATH + .4, 1), .07, .2);
T.at(TL.BATH, splash(.6), .05, .1);
for (let i = 0; i < 3; i++) T.at(TL.WIPE - .4 + i * .42, swish(.4, .8), .05, .3 - i * .3);
// 2 · the red cloth flicks open
T.at(TL.RED - .3, swish(.9, 1), .09, 0);
// 3 · each murti set down softly, a bell for each name
for (const [t, f] of [[TL.SARAS, 79], [TL.LAKSH, 83], [TL.GANESH, 86]]) { T.at(t - .05, thud(.35), .06, 0); T.at(t, chime(note(f), .5, 1.6), .06, 0); }
// 4 · clothes rustle, the mala, flowers
T.at(TL.CLOTHES - .3, crinkle(.7, .8), .05, 0);
T.at(TL.MALA, crinkle(.5, .6), .04, 0);
T.at(TL.FLOWERS, shimmer(.8, [86, 91].map(note), .4, .08), .05, 0);
T.at(TL.LOTUS, chime(note(88), .5, 1.8), .06, 0);
// 5 · the kalash: water fills, the coin clinks, supari, rice, leaves, the coconut lands, mauli
T.at(TL.WATER - .2, pour(.8, .7), .05, .2);
T.at(TL.COIN, clink(1, 3300), .1, .2); T.at(TL.SUPARI, mixb(thud(.2), clink(.4, 1800)), .07, .2);
for (let i = 0; i < 6; i++) T.at(TL.RICE + i * .04, click(.4), .04, .2);
T.at(TL.LEAVES, crinkle(.6, .8), .05, .2);
T.at(TL.COCONUT, thud(.5), .08, .2);
T.at(TL.MAULI, chime(note(84), .5, 1.6), .06, .2);
// 6 · sit (a soft settle), three drops
T.at(TL.SIT, noise(.6, { lp: 600, hp: 80, e: env.swell(.1, .4), amp: 1 }), .04, 0);
for (let i = 0; i < 3; i++) T.at(TL.SIP + .1 + i * ((TL.ACHAMAN - TL.SIP) / 2.6) + .25, drop(.8), .07, -.2);
// 7 · the sankalp: a held tone under the three words
T.at(TL.NAME - .2, pad(TL.S80 - TL.NAME + .8, [62, 69, 74, 78], .8), .04, 0);
for (const t of [TL.NAME, TL.DAY, TL.WHY]) T.at(t, plink(note(86), .4), .05, 0);
T.at(TL.SANKALP, templeBell(67, .7), .08, 0);
// 8 · Ganesha first: a conch
T.at(TL.GANESHA8 - .3, conch(2.2, 311, 1), .09, 0);
T.at(TL.FIRST, mixb(chime(note(84), .8, 3), shimmer(1.4, [79, 83, 86, 91].map(note), .5, .07)), .09, 0);
// 9 · offerings: a soft tick for each, the bell for the lamp, a chime on each mantra
for (const t of [TL.TILAK, TL.AKSHAT, TL.FLOWERS9, TL.INCENSE, TL.LAMP9, TL.BHOG]) T.at(t, plink(note(91), .35), .05, 0);
T.at(TL.LAMP9 - .1, puff(.5), .04, 0);
T.at(TL.MANTRA, chime(note(81), .5, 2), .05, 0);
// 10 · havan: the fire, a flare on each "swaha"
T.at(TL.S100, fire(TL.S110 - TL.S100 + .5, .6, 1), .08, 0);
T.at(TL.HAVAN, mixb(whoosh(.8, 200, 1600), fire(.8, 1, .3)), .1, 0);
T.at(TL.NOW, mixb(whoosh(.8, 200, 1600), fire(.8, 1, .3)), .1, 0);
// 11 · aarti: the hand bell, rung steadily
for (let t = TL.AARTI - .4; t < TL.S120; t += .32) T.at(t, handBell(.6 + rnd() * .3), .05, .15);
// 12 · petals falling: a soft shimmer
T.at(TL.FOLDED - .3, shimmer(2.4, [74, 79, 83, 86, 91, 95].map(note), .4, .25), .05, 0);
// 13 · forgiveness: the bed thins, a low bell; a chime on "complete", coins
T.at(TL.S130, templeBell(55, .7), .08, 0);
T.at(TL.COMPLETE, mixb(chime(note(84), .8, 3), shimmer(1.6, [79, 83, 86, 91, 95].map(note), .5, .07)), .08, 0);
for (let i = 0; i < 6; i++) T.at(TL.COMPLETE + .1 + i * .16, clink(.6, 3000 + i * 180), .04, -.2);
// 14 · the diyas at the door lit one by one, anklet bells on the footprints, the door
for (let i = 0; i < 6; i++) { const t = TL.DIYAS - .2 + i * .2; T.at(t, puff(.6), .05, (i - 2.5) * .25); T.at(t + .05, plink(note([67, 71, 74, 79, 83, 86][i]), .6), .05, (i - 2.5) * .25); }
for (let i = 0; i < 8; i++) T.at(TL.FOOT - .5 + i * (TL.DOOR + 1.1 - TL.FOOT) / 8, ghungroo(.9), .04, i % 2 ? .25 : -.25);
T.at(TL.ALL, chime(note(79), .6, 2.4), .06, 0);
// the ask
T.at(TL.YOUR, pop(.7, 1.1), .1, 0);
T.at(TL.COMMENT, pop(.8, 1.25), .1, 0);
T.at(TL.SAVE2, mixb(pop(1, 1.3), shimmer(.7, [note(91), note(95), note(98)], .6, .06)), .12, 0);
// the card
T.at(TL.CARD - .3, whoosh(.7, 400, 3200), .18, 0);
T.at(TL.CARD + .35, mixb(...[67, 71, 74, 79].map((m) => bell(note(m), 2.2, { partials: [[1, 1], [2, .35], [3, .12]], k: 1.4, amp: .7 }))), .16, 0);
for (let k = 0; k < 3; k++) T.at(TL.CARD + .7 + k * .12, pop(.8, 1 + k * .15), .18, (k - 1) * .4);
T.at(TL.CARD, pad(TL.END - TL.CARD, [67, 71, 74], .7), .05, 0);

T.write('assets/puja_sfx.wav');
console.log('assets/puja_sfx.wav', TL.END.toFixed(2), 's');
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'assets/puja_vo.wav', '-i', 'assets/puja_sfx.wav', '-filter_complex',
  `[1:a]volume=0.85[s];[0:a][s]amix=inputs=2:normalize=0:duration=longest,apad=whole_dur=${TL.END.toFixed(3)},atrim=0:${TL.END.toFixed(3)},loudnorm=I=-14:TP=-1.5:LRA=11[o]`,
  '-map', '[o]', '-ar', '48000', '-ac', '2', 'assets/puja_mix.wav']);
console.log('assets/puja_mix.wav');
