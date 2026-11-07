// ninth_sfx.mjs: the sound effects for "The 9th avatar" (src/scenes/ninth.js) → assets/ninth_sfx.wav, then the mix with
// the voice → assets/ninth_mix.wav. Times come from the voice and the timeline (src/scenes/ninth_vo.js + ninth_tl.js,
// loaded with vm), so they follow the picture.
// The hall: a low temple drone and a boom with a deep bell on frame 0; the two emblems over seat 9 clash twice (a whoosh,
// a beat of quiet, a bronze clang, sparks). The crane: a whoosh, each of the eight seats lighting with a diya's puff and
// a rising note. The three candidates each have a voice: Krishna a bamboo flute phrase, Balaram a deep bronze clang,
// the Buddha a singing bowl; they rise out of the pool with a splash and land on a seat with a soft stone knock. Jaydev:
// a suspense rise on "where is Krishna", the flute in the sky, a great bell as the light falls on all ten. Desika: a temple
// bell. The Mahabharat: a conch, the swan's ripple. The Bhagavata: a gong, the outer tier grinding up, a pop per number.
// Countless: a swell, flowing water, a glitter of lamps. The board, the ask, the card.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, plink, clang, click, shimmer, drone, note, seed, chime, thud, rnd, rumble, fire, conch, om, splash, torrent } from './sfx.mjs';

const TL = runInNewContext(readFileSync('src/scenes/ninth_vo.js', 'utf8') + '\n' + readFileSync('src/scenes/ninth_tl.js', 'utf8') + '\n;TL');
const T = track(TL.END);
seed(81);
const pop = (amp = 1, f = 1) => mixb(click(amp), tone(.07, t => f * (500 + 2600 * t / .07), { e: env.pluck(40), amp: amp * .7 }), noise(.05, { lp: 2500, hp: 300, e: env.pluck(60), amp: amp * .5 }));
const pad = (dur, ms, amp = 1) => mixb(...ms.map((m, i) => tone(dur, t => note(m) * (1 + .003 * Math.sin(t * 2 + i)), { type: 'tri', e: env.swell(.8, .8), amp: amp / ms.length })));
const templeBell = (f = 76, amp = 1) => bell(note(f), 4, { partials: [[1, 1], [2.02, .6], [2.76, .45], [4.1, .3], [5.4, .18]], k: 1.1, amp });
const boom = (amp = 1) => mixb(tone(2.2, t => 52 * Math.exp(-t * .9) + 26, { e: env.pluck(1.6), amp }), noise(.9, { lp: 380, hp: 25, brown: true, e: env.pluck(4), amp: amp * .7 }));
const gong = (amp = 1) => mixb(bell(note(43), 5, { partials: [[1, 1], [1.48, .7], [2.1, .5], [2.9, .35], [4.2, .2]], k: .7, amp }), boom(amp * .5));
// the three voices
const flute = (ms, step = .22, amp = 1) => mixb(...ms.map((m, i) => { const d = i === ms.length - 1 ? 1.3 : step + .1, b = mixb(tone(d, t => note(m) * (1 + .006 * Math.sin(t * 34) * Math.min(1, t * 3)), { e: env.swell(.05, Math.min(.5, d * .5)), amp }), noise(d, { lp: note(m) * 3, hp: note(m) * .8, e: env.swell(.04, .2), amp: amp * .12 }));
  const o = new Float32Array(Math.round((i * step) * 48000) + b.length); o.set(b, Math.round(i * step * 48000)); return o; }));
const bronze = (amp = 1) => mixb(clang(note(45), amp), clang(note(52), amp * .5), thud(amp * .6));
const bowl = (amp = 1) => bell(note(62), 4.5, { partials: [[1, 1], [2.71, .5], [5.15, .22], [8.4, .08]], k: .65, amp });
const VOICE = { krishna: () => flute([74, 76, 79, 81, 79]), balaram: () => bronze(.9), buddha: () => bowl(1) };
const knock = (amp = 1) => mixb(thud(amp), noise(.08, { hp: 300, lp: 2500, e: env.pluck(40), amp: amp * .4 }));
const rise = (t, amp = 1) => { T.at(t, splash(.5 * amp), .07, 0); T.at(t, whoosh(.8, 500, 2400, amp), .08, 0); };
const land = (t, amp = 1) => { T.at(t - .5, whoosh(.6, 900, 2800, amp), .08, 0); T.at(t, knock(amp), .14, 0); };
const sink = (t) => { T.at(t, whoosh(.9, 2400, 300), .07, 0); T.at(t + .7, splash(.35), .06, 0); };

// ---- the bed: a low temple drone and a soft pad, all the way to the card
T.at(0, drone(TL.CARD, 41, 1), .05, 0);
T.at(0, om(TL.J0, 98, .7), .025, 0);
// ---- A: frame 0, the two emblems over seat 9
T.at(0, boom(1), .3, 0);
T.at(0, templeBell(57, 1), .18, 0);
T.at(TL.NINTH, chime(note(81), .5, 2), .08, 0);
T.at(TL.BAL0, bronze(.6), .1, -.35);
T.at(TL.BUD0, bowl(.7), .1, .35);
// ---- B: the fight: a lunge, a beat of quiet, the clash, sparks; twice
for (const h of [TL.FIGHT, TL.BREAK + .25]) {
  T.at(h - .45, whoosh(.45, 600, 3600, 1), .14, 0);
  T.at(h, mixb(clang(note(50), 1), clang(note(57), .7), noise(.3, { hp: 2500, lp: 9000, e: env.pluck(10), amp: .8 }), boom(.4)), .3, 0);
  for (let k = 0; k < 8; k++) T.at(h + .03 + k * .04, mixb(click(.5), tone(.05, 3000 + rnd() * 3000, { e: env.pluck(80), amp: .3 })), .05, (rnd() - .5) * 1.4);
}
// ---- C: the crane; the eight seats light one by one
T.at(TL.C0, whoosh(1.6, 300, 1800, 1), .14, 0);
for (let j = 0; j < 8; j++) { const t = TL.AGREES + .05 + j * .2; T.at(t, fire(.35, .8, .2), .05, (j - 3.5) * .2); T.at(t + .05, plink(note(67 + [0, 2, 4, 7, 9, 12, 14, 16][j]), .7), .07, (j - 3.5) * .2); }
T.at(TL.TEN, mixb(thud(.7), tone(.6, note(43), { e: env.pluck(4), amp: .5 })), .12, -.2);
T.at(TL.TEN + .2, mixb(thud(.7), tone(.6, note(42), { e: env.pluck(4), amp: .5 })), .12, .2);
// ---- D: two places (two knocks), three names (each rises from the pool with its voice)
T.at(TL.TWO, knock(.8), .12, -.3); T.at(TL.PLACES, knock(.8), .12, .3);
T.at(TL.THREE - .1, shimmer(1.4, [74, 79, 83].map(note), .5, .12), .1, 0);
for (const [n, t] of [['krishna', TL.KRI1], ['balaram', TL.BAL1], ['buddha', TL.BUD1]]) { rise(t - .25); T.at(t, VOICE[n](), .12, n === 'krishna' ? -.4 : n === 'buddha' ? .4 : 0); }
// ---- E: the Varaha Purana: Krishna to 8, Buddha to 9, Balaram sinks
T.at(TL.VARAHA - .05, mixb(thud(.6), templeBell(64, .5)), .12, 0);
land(TL.KRI2 + .7); T.at(TL.KRI2 + .3, flute([79, 81]), .08, -.3);
land(TL.BUD2 + .7); T.at(TL.BUD2 + .3, bowl(.6), .08, .3);
sink(TL.BUD2 + .35);
// ---- F: Jaydev: Balaram up to 8; "where is Krishna?" (a rising question); the flute in the sky; the light on all ten
T.at(TL.GEET - .05, mixb(thud(.5), templeBell(66, .5)), .1, 0);
T.at(TL.PICKS2 - .4, whoosh(1.2, 400, 4000, 1), .1, -.2);
rise(TL.BAL3 - .3); land(TL.BAL3 + .7); T.at(TL.BAL3 + .3, bronze(.6), .1, -.3);
T.at(TL.BUD3, bowl(.5), .08, .3);
T.at(TL.WHERE - .2, tone(1.3, t => 220 * Math.pow(2, t / 1.3), { type: 'tri', e: env.swell(.3, .2), amp: 1 }), .05, 0);
T.at(TL.KRI3 - .1, flute([79, 81, 83, 86, 83, 81], .2), .14, 0);
T.at(TL.TAKES - .1, mixb(templeBell(55, 1), shimmer(2.4, [67, 71, 74, 79, 83, 86, 91].map(note), .6, .08)), .2, 0);
T.at(TL.TAKES, pad(TL.G0 - TL.TAKES + .5, [55, 62, 67, 71], 1), .08, 0);
// ---- G: Vedanta Desika: Buddha sinks, Krishna descends to 9
T.at(TL.DESIKA - .05, templeBell(69, .8), .14, 0);
sink(TL.KRI4 - .9);
T.at(TL.KRI4 - .3, whoosh(1.2, 3000, 500), .08, .3); land(TL.KRI4 + 1.0); T.at(TL.KRI4 + .2, flute([81, 79, 76]), .08, .3);
T.at(TL.NOBUD, mixb(thud(.6), tone(.5, note(40), { e: env.pluck(5), amp: .5 })), .1, 0);
// ---- H: the Mahabharat: a conch; Balaram sinks; the swan glides on the water
T.at(TL.MBH - .5, conch(2.2, 311, 1), .14, 0);
sink(TL.NEITHER - .1);
T.at(TL.NEITHER + .3, noise(2.4, { lp: t => 900 + 300 * Math.sin(t * 4), hp: 200, e: env.swell(.4, .8), amp: 1 }), .04, -.3);
T.at(TL.SWAN - .1, mixb(splash(.4), shimmer(1.2, [76, 81, 84].map(note), .4, .1)), .1, 0);
// ---- I: the Bhagavata: a beat of quiet on "who is right?", a gong; the outer tier grinds up; 19, 20, 21
T.at(TL.BHAG - .1, gong(1), .22, 0);
T.at(TL.BHAG - .3, rumble(2.0, 1), .1, 0);
for (const [n, t, nt] of [['balaram', TL.BAL5, TL.N19], ['krishna', TL.KRI5, TL.N20], ['buddha', TL.BUD5, TL.N21]]) {
  if (n !== 'krishna') rise(t - .35, .7); else T.at(t - .35, whoosh(.9, 800, 2800), .08, 0);
  land(t + .65, .8); T.at(nt, pop(.8, 1 + (nt - TL.N19) * .1), .12, n === 'balaram' ? -.4 : n === 'buddha' ? .4 : 0);
}
// ---- J: countless: a swell, water flowing out, the lamps glittering on
T.at(TL.J0, whoosh(2.4, 200, 2000, 1), .12, 0);
T.at(TL.COUNTLESS - .6, mixb(boom(.6), pad(5, [50, 57, 62, 69, 74], 1.2)), .16, 0);
T.at(TL.STREAMS - .6, torrent(TL.K0 - TL.STREAMS + 1.4, .5, .6), .08, 0);
for (let k = 0; k < 46; k++) T.at(TL.STREAMS - .2 + k * .05 + rnd() * .04, plink(note(84 + [0, 2, 4, 7, 9][k % 5] + 12 * (k % 2)), .3), .035, (rnd() - .5) * 1.6);
T.at(TL.LAKE, chime(note(88), .6, 2.4), .1, 0);
// ---- K: the board, the three back over the pool; SAVE; the ask
T.at(TL.K0 - .1, whoosh(.8, 400, 2600), .16, 0);
for (let i = 0; i < 5; i++) T.at(TL.K0 + .3 + i * .12, pop(.5, 1 + i * .06), .1, (i - 2) * .15);
T.at(TL.SAVE, chime(note(86), .6, 1.8), .12, 0);
T.at(TL.K0, pad(TL.CARD - TL.K0, [57, 64, 69], .8), .05, 0);
T.at(TL.YOUR, pop(.7, 1.2), .14, 0);
T.at(TL.STATE, mixb(pop(1, 1.3), shimmer(.7, [note(91), note(95), note(98)], .6, .06)), .18, 0);
// ---- the card
T.at(TL.CARD - .3, whoosh(.7, 400, 3200), .24, 0);
T.at(TL.CARD + .35, mixb(...[67, 71, 74, 79].map((m) => bell(note(m), 2.2, { partials: [[1, 1], [2, .35], [3, .12]], k: 1.4, amp: .7 }))), .2, 0);
for (let k = 0; k < 3; k++) T.at(TL.CARD + .7 + k * .12, pop(.8, 1 + k * .15), .24, (k - 1) * .4);
T.at(TL.CARD + 1.65, mixb(pop(1, 1.3), shimmer(.7, [note(91), note(95), note(98)], .6, .06)), .26, 0);
T.at(TL.CARD, pad(TL.END - TL.CARD, [67, 71, 74], .7), .07, 0);

T.write('assets/ninth_sfx.wav');
console.log('assets/ninth_sfx.wav', TL.END.toFixed(2), 's');
// the mix: the voice at full level over the SFX, normalised to -14 LUFS
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'assets/ninth_vo.wav', '-i', 'assets/ninth_sfx.wav', '-filter_complex',
  `[1:a]volume=0.85[s];[0:a][s]amix=inputs=2:normalize=0:duration=longest,apad=whole_dur=${TL.END.toFixed(3)},atrim=0:${TL.END.toFixed(3)},loudnorm=I=-14:TP=-1.5:LRA=11[o]`,
  '-map', '[o]', '-ar', '48000', '-ac', '2', 'assets/ninth_mix.wav']);
console.log('assets/ninth_mix.wav');
