// tvidhi_sfx.mjs: the sound effects for "Tulsi Vivah, step by step" (src/scenes/tvidhi.js) → assets/tvidhi_sfx.wav, then the
// mix with the voice → assets/tvidhi_mix.wav. Times come from the voice and the timeline (src/scenes/tvidhi_vo.js +
// tvidhi_tl.js, loaded with vm), so they follow the picture.
// A soft drone of Sa and Pa runs under everything (mild, never loud); a small bell rings on each STEP number; then each
// step's own sounds: dusk birds and a far temple bell, a shine and the rangoli, four canes set down, cloth and bangles,
// water for the bath, a conch for Ganesha, offerings, the kanyadaan pour, the shower on "savdhan", a whoosh per phera,
// the aarti hand bell, the bhog landing, wedding shehnai-like swells at the close, a pop on the ask, the card.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, plink, click, shimmer, note, seed, chime, thud, rnd, fire, conch, crinkle, splash, wind } from './sfx.mjs';

const TL = runInNewContext(readFileSync('src/scenes/tvidhi_vo.js', 'utf8') + '\n' + readFileSync('src/scenes/tvidhi_tl.js', 'utf8') + '\n;TL');
const T = track(TL.END);
const lerp = (a, b, k) => a + (b - a) * k;
seed(105);
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
// when: dusk air, birds going home, a far temple bell, the lamps lit
T.at(TL.WHEN0, wind(TL.S10 - TL.WHEN0 + .4, 1, .4), .03, 0);
for (let i = 0; i < 7; i++) T.at(TL.WHEN0 + .4 + i * .55 + rnd() * .2, mixb(tone(.08, t => 3200 + 900 * Math.sin(t * 90), { e: env.pluck(30), amp: .5 }), tone(.06, t => 4100 - 2000 * t, { e: env.pluck(40), amp: .3 })), .025, rnd() - .5);
T.at(TL.GODHULI, templeBell(60, .8), .08, -.3);
for (let i = 0; i < 6; i++) T.at(TL.FAST - .2 + i * .17, puff(.5), .03, (i - 2.5) * .25);
// a small bell on every step's number
['S10', 'S20', 'S30', 'S40', 'S50', 'S60', 'S70', 'S80', 'S90', 'S100', 'S110', 'S120'].forEach((k, i) => T.at(TL[k] + .2, clink(.9, note(86 + (i % 3) * 2)), .09, 0));
// 1 · clean: a shine; the rangoli spreads; the leaves
T.at(TL.CLEAN, shimmer(1.4, [79, 83, 86, 91].map(note), .5, .12), .07, 0);
T.at(TL.RANGOLI - .3, mixb(noise(1.2, { lp: 5000, hp: 1500, e: env.swell(.2, .6), amp: .6 }), shimmer(1.2, [74, 79, 83, 86].map(note), .4, .1)), .05, 0);
T.at(TL.BEFORE, crinkle(.5, .6), .04, 0);
// 2 · four canes set down, a knot, marigolds
for (let i = 0; i < 4; i++) T.at(lerp(TL.FOUR - .2, TL.TIED + .2, (i + .5) / 4), mixb(thud(.45), click(.4)), .07, [-.4, .4, .3, -.3][i]);
T.at(TL.TIED, crinkle(.6, .7), .05, 0);
T.at(TL.MARIGOLDS - .2, mixb(crinkle(.8, .8), shimmer(1, [83, 86, 91].map(note), .4, .1)), .05, 0);
// 3 · the chunari settles, bangles tinkle, the bindi
T.at(TL.CHUNARI - .4, swish(.9, 1), .08, 0);
for (let i = 0; i < 4; i++) T.at(TL.BANGLES - .1 + i * .07, clink(.6, 3600 + i * 240), .05, .2);
T.at(TL.BINDI, plink(note(91), .5), .06, 0);
T.at(TL.LIVING, chime(note(79), .5, 2.2), .05, 0);
// 4 · the groom set down, his bath, the dhoti, the tilak
T.at(TL.SHALI - .1, mixb(thud(.4), chime(note(74), .6, 2.4)), .08, .2);
T.at(TL.BATHE - .4, pour(TL.YELLOW - TL.BATHE + .1, 1), .06, .2);
T.at(TL.YELLOW, swish(.5, .8), .05, .2);
T.at(TL.TILAK, plink(note(88), .5), .05, .2);
T.at(TL.NOSHALI, pop(.5, 1), .06, 0);
// 5 · sit (a settle), a conch for Ganesha, the sankalp bell
T.at(TL.SIT, noise(.6, { lp: 600, hp: 80, e: env.swell(.1, .4), amp: 1 }), .04, 0);
T.at(TL.GANESHA - .3, conch(2.0, 311, 1), .08, -.2);
T.at(TL.SANKALP, templeBell(67, .7), .08, 0);
// 6 · the offerings: a soft tick for each, the lamp puffs alight
for (const t of [TL.FLOWERS, TL.SANDAL, TL.KUMKUM, TL.AKSHAT, TL.INCENSE, TL.LAMP]) T.at(t, plink(note(91), .35), .05, 0);
T.at(TL.LAMP - .1, puff(.5), .04, 0);
T.at(TL.LAMP + .3, chime(note(81), .5, 2), .05, 0);
// 7 · the kanyadaan: water poured
T.at(TL.KANYA, chime(note(76), .6, 2.6), .07, 0);
T.at(TL.GIVE - .2, pour(TL.COUPLES - TL.GIVE + .4, .9), .06, .25);
// 8 · the thread drawn across, a knot
T.at(TL.TIE - .2, noise(TL.EDGE - TL.TIE + .5, { lp: 3000, hp: 900, e: env.hann(), amp: .5 }), .04, 0);
T.at(TL.TOGETHER, chime(note(84), .5, 1.8), .06, 0);
// 9 · the verses: a held chord; "savdhan!": a gong-like bell and the rice pattering down
T.at(TL.VERSES - .2, pad(TL.SAVDHAN - TL.VERSES + .4, [62, 66, 69, 74], .8), .04, 0);
T.at(TL.SAVDHAN, mixb(templeBell(62, 1), whoosh(.6, 300, 2400)), .1, 0);
for (let i = 0; i < 40; i++) T.at(TL.SAVDHAN + .15 + rnd() * 1.6, click(.25 + rnd() * .3), .035, rnd() - .5);
// 10 · the pheras: a soft whoosh each round, a bell on each count
for (let i = 0; i < 7; i++) { const t = lerp(TL.CARRY - .3, TL.MANY + .4, (i + 1) / 7 * .98); T.at(t - .3, whoosh(.5, 300, 1800), .04, Math.sin(i) * .5); T.at(t, clink(.6, note(79 + [0, 2, 4, 5, 7, 9, 11][i])), .06, 0); }
// 11 · sindoor (a soft puff), the aarti hand bell rung steadily
T.at(TL.SINDOOR, mixb(noise(.3, { lp: 2500, hp: 400, e: env.pluck(12), amp: .7 }), plink(note(88), .4)), .05, 0);
for (let t = TL.AARTI - .4; t < TL.S120; t += .32) T.at(t, handBell(.6 + rnd() * .3), .05, .15);
// 12 · the bhog lands item by item
for (const t of [TL.SEASON, TL.CANE2, TL.AMLA, TL.BER, TL.POTATO]) T.at(t, mixb(thud(.3), plink(note(86), .3)), .05, .2);
T.at(TL.PRASAD, chime(note(84), .5, 2), .05, 0);
// close: the wedding season: a bright swell of bells
T.at(TL.CLOSE0, shimmer(2.4, [74, 79, 83, 86, 91, 95].map(note), .5, .25), .06, 0);
T.at(TL.WSEASON, mixb(...[67, 71, 74, 79].map((m) => bell(note(m), 2.2, { partials: [[1, 1], [2, .35], [3, .12]], k: 1.4, amp: .6 }))), .07, 0);
// the ask
T.at(TL.ROUNDS, pop(.7, 1.1), .1, 0);
T.at(TL.COMMENT, pop(.8, 1.25), .1, 0);
T.at(TL.SAVE2, mixb(pop(1, 1.3), shimmer(.7, [note(91), note(95), note(98)], .6, .06)), .12, 0);
// the card
T.at(TL.CARD - .3, whoosh(.7, 400, 3200), .18, 0);
T.at(TL.CARD + .35, mixb(...[67, 71, 74, 79].map((m) => bell(note(m), 2.2, { partials: [[1, 1], [2, .35], [3, .12]], k: 1.4, amp: .7 }))), .16, 0);
for (let k = 0; k < 3; k++) T.at(TL.CARD + .7 + k * .12, pop(.8, 1 + k * .15), .18, (k - 1) * .4);
T.at(TL.CARD, pad(TL.END - TL.CARD, [67, 71, 74], .7), .05, 0);

T.write('assets/tvidhi_sfx.wav');
console.log('assets/tvidhi_sfx.wav', TL.END.toFixed(2), 's');
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'assets/tvidhi_vo.wav', '-i', 'assets/tvidhi_sfx.wav', '-filter_complex',
  `[1:a]volume=0.85[s];[0:a][s]amix=inputs=2:normalize=0:duration=longest,apad=whole_dur=${TL.END.toFixed(3)},atrim=0:${TL.END.toFixed(3)},loudnorm=I=-14:TP=-1.5:LRA=11[o]`,
  '-map', '[o]', '-ar', '48000', '-ac', '2', 'assets/tvidhi_mix.wav']);
console.log('assets/tvidhi_mix.wav');
