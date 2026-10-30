// never_sfx.mjs: the sound effects for "NEVER offer THIS flower to SHIVA" (src/scenes/never.js) → assets/never_sfx.wav,
// then the mix with the voice → assets/never_mix.wav. Times come from the voice and the timeline (src/scenes/never_vo.js
// + never_tl.js, loaded with vm), so they follow the picture.
// The ketaki on black: a temple bell, then on "LIE" a low drum and a sour clang. The void: a cosmic drone, the two orbs,
// the pillar's boom and its fire roaring under the whole story; a dive down and a rise up; the flower falling (a
// shimmer stepping down); the lie a drum; Shiva's word an om and a deep drum, the flower whooshing away. Back in the
// temple: crickets and the dusk drone; each ✗ a stamp (thud + click), each ✓ a bright chime; the tulsi's ✓ a conch;
// the curse a crackle and a drum; the screenshot a shutter; the ask; water on the linga for next; the card.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, plink, clang, click, shimmer, drone, note, seed, chime, drum, om, conch, thud, crackle, fire, SR } from './sfx.mjs';

const TL = runInNewContext(readFileSync('src/scenes/never_vo.js', 'utf8') + '\n' + readFileSync('src/scenes/never_tl.js', 'utf8') + '\n;TL');
const T = track(TL.END);
seed(66);
const add = (o, b, s0, g = 1) => { const s = Math.round(s0 * SR); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j] * g; return o; };
const pop = (amp = 1, f = 1) => mixb(click(amp), tone(.07, t => f * (500 + 2600 * t / .07), { e: env.pluck(40), amp: amp * .7 }), noise(.05, { lp: 2500, hp: 300, e: env.pluck(60), amp: amp * .5 }));
const chord = (ms, d = 2, amp = 1) => { const o = new Float32Array(Math.round((d + 1) * SR)); ms.forEach((m, i) => add(o, bell(note(m), d, { partials: [[1, 1], [2, .35], [3, .12]], k: 1.4, amp }), i * .05)); return o; };
const pad = (dur, ms, amp = 1) => mixb(...ms.map((m, i) => tone(dur, t => note(m) * (1 + .003 * Math.sin(t * 2 + i)), { type: 'tri', e: env.swell(.8, .8), amp: amp / ms.length })));
const crickets = (dur, amp = 1) => { const o = new Float32Array(Math.round(dur * SR)); for (const [f, rate, ph] of [[4300, 3.1, 0], [4700, 2.6, .4]]) for (let k = 0; k < dur * rate; k++) { const t0 = k / rate + ph; for (let j = 0; j < 3; j++) add(o, tone(.03, f, { e: env.hann(), amp: amp * .5 }), t0 + j * .045); } return o; };
const trickle = (dur, amp = 1) => noise(dur, { lp: t => 2600 + 900 * Math.sin(t * 7) + 500 * Math.sin(t * 13), hp: 500, e: env.swell(.3, .4), amp });
const templeBell = (f = 76, amp = 1) => bell(note(f), 4, { partials: [[1, 1], [2.02, .6], [2.76, .45], [4.1, .3], [5.4, .18]], k: 1.1, amp });
// a ✗ landing: a low stamp; a ✓: a bright two-note chime
const nope = (amp = 1) => mixb(thud(amp), click(amp * .8), tone(.25, t => 180 - 120 * t, { type: 'saw', e: env.pluck(14), amp: amp * .12 }));
const yes = (amp = 1) => mixb(chime(note(88), amp * .8, 1.6), add(new Float32Array(Math.round(2 * SR)), chime(note(95), amp * .7, 1.4), .09));

// ---- the beds: the studio's hush, the void (B–G0), the temple at dusk (G0 on)
T.at(0, drone(TL.B0 + .5, 55, .5), .08, 0);
T.at(TL.B0 - .2, drone(TL.G0 - TL.B0 + .8, 41.2, 1), .14, 0);
T.at(TL.PILLAR - .2, fire(TL.G0 - TL.PILLAR + .6, .5, .8), .1, 0);
T.at(TL.G0, drone(TL.CARD - TL.G0 + .3, 65.4, .9), .08, 0);
T.at(TL.H0, crickets(TL.CARD - TL.H0 + .3, 1), .045, .3);

// ---- A: the hook; "it once told a LIE"
T.at(.05, templeBell(76, .8), .22, -.2);
T.at(.1, shimmer(1.2, [note(81), note(86), note(90), note(93)], .5, .08), .08, 0);
T.at(TL.LIE - .05, mixb(drum(48, 1, 1.2), clang(note(61), .6), clang(note(62), .5)), .3, 0);
// ---- B: Brahma, Vishnu, the clash, the pillar
T.at(TL.B0 - .3, whoosh(.8, 300, 2400), .22, 0);
T.at(TL.BRAHMA, plink(note(81), .7), .14, -.4); T.at(TL.VISHNU, plink(note(76), .7), .14, .4);
T.at(TL.GREATER - .1, mixb(clang(note(57), .5), noise(.4, { lp: 2400, hp: 300, e: env.pluck(8), amp: .5 })), .14, 0);
T.at(TL.PILLAR - .35, mixb(drum(40, 1, 1.6), noise(1.6, { lp: 900, brown: true, e: env.pluck(2.4), amp: 1 })), .45, 0);
T.at(TL.NOEND - .2, om(2.4, 110, .6), .1, 0);
// ---- C: down, up
T.at(TL.C0 - .1, whoosh(1.6, 1800, 200), .24, .3);
T.at(TL.C1 - .1, whoosh(1.8, 200, 2600), .24, -.3);
// ---- D: the flower falls (a shimmer stepping down); its name
T.at(TL.FELL - .3, shimmer(1.8, [98, 95, 93, 90, 88, 86].map(note), .5, .22), .14, -.2);
T.at(TL.KETAKI, chime(note(86), .7, 2), .16, 0);
// ---- E: "say I saw the top"; the lie
T.at(TL.SAY - .1, tone(1.2, note(62), { type: 'tri', e: env.swell(.2, .6), amp: .5 }), .1, 0);
T.at(TL.LIED - .05, mixb(drum(44, 1, 1.4), clang(note(58), .5)), .32, 0);
// ---- F: Shiva's word; the flower falls away
T.at(TL.SAID - .1, mixb(om(3.6, 98, .9), drum(36, .8, 1.8)), .3, 0);
T.at(TL.WORSHIP - .4, whoosh(1.6, 2400, 150), .22, -.3);
// ---- G: the champa; the two ✗
T.at(TL.G0 - .2, whoosh(.7, 400, 2600), .2, 0);
T.at(TL.G0 + .35, nope(1), .32, -.2);
T.at(TL.CHAMPA - .25, pop(.7, 1.1), .2, .2);
T.at(TL.CHAMPA + .15, nope(1), .32, .2);
// ---- H: the sanctum; NEVER (✗) → LISTS (✓), the sprig settles; joy and moksha
T.at(TL.H0 - .2, whoosh(.7, 400, 2200), .18, 0);
T.at(TL.TULSI - .1, shimmer(1, [note(86), note(90), note(93)], .5, .07), .1, 0);
T.at(TL.NEVER, nope(1), .32, .2);
T.at(TL.LISTS + .05, yes(1), .3, .2);
T.at(TL.JOY - .3, conch(2.6, 233, .6), .12, 0);
T.at(TL.MOKSHA, templeBell(74, .9), .2, 0);
// ---- I: Ganesha refuses tulsi; the curse
T.at(TL.I0 - .2, whoosh(.7, 400, 2600), .2, 0);
T.at(TL.I0 + .1, shimmer(1.2, [note(86), note(90), note(93), note(98)], .6, .07), .12, 0);
T.at(TL.REFUSES, nope(1), .32, -.3);
T.at(TL.CURSED - .1, mixb(crackle(.9, 1), drum(50, .9, 1)), .3, 0);
// ---- J: Vishnu: ✗ ✗ then ✓ ✓
T.at(TL.J0 - .2, whoosh(.7, 400, 2600), .2, 0);
T.at(TL.J0 + .1, shimmer(1.2, [note(86), note(90), note(93), note(98)], .6, .07), .12, 0);
T.at(TL.TWO, nope(.8), .26, -.3); T.at(TL.TWO + .12, nope(.8), .26, .3);
T.at(TL.LOVES, yes(1), .3, -.3); T.at(TL.LOVES + .12, yes(1), .26, .3);
// ---- K: screenshot this: a shutter, the marks popping
T.at(TL.K0 - .2, whoosh(.7, 400, 2600), .2, 0);
T.at(TL.SCREEN + .25, mixb(click(1), noise(.06, { lp: 6000, hp: 1500, e: env.pluck(50), amp: .7 }), click(.6)), .35, 0);
for (let i = 0; i < 7; i++) T.at(TL.SCREEN + .25 + Math.floor(i / 3) * .15 + (i % 3) * .06 + .2, pop(.45, 1 + i * .06), .14, 0);
// ---- L: the ask
T.at(TL.L0 - .2, whoosh(.7, 400, 2600), .16, 0);
T.at(TL.L0, pad(TL.M0 - TL.L0 + .3, [62, 66, 69], .9), .1, 0);
T.at(TL.YES, mixb(plink(note(86)), click(.6)), .22, -.3);
T.at(TL.NOQ, mixb(plink(note(81)), click(.6)), .22, .3);
// ---- M: next: water starts on the linga
T.at(TL.M0 - .2, whoosh(.8, 400, 2600), .18, 0);
T.at(TL.NEXT, chime(note(81), .7, 1.6), .16, 0);
T.at(TL.POUR - .5, trickle(TL.CARD - TL.POUR + .6, 1), .1, 0);
T.at(TL.POUR, pop(.8, 1.1), .24, 0);
T.at(TL.FOLLOW, templeBell(76, .7), .18, 0);

// ---- the card
T.at(TL.CARD - .3, whoosh(.7, 400, 3200), .3, 0);
T.at(TL.CAP_T, chord([67, 71, 74, 79], 2.2, .7), .25, 0);
for (let k = 0; k < 3; k++) T.at(TL.COVERS + k * .12, pop(.8, 1 + k * .15), .3, (k - 1) * .4);
T.at(TL.PRICE, pop(.6, .9), .2, 0);
T.at(TL.PILL, mixb(pop(1, 1.3), shimmer(.7, [note(91), note(95), note(98)], .6, .06)), .32, 0);
T.at(TL.CARD, pad(TL.END - TL.CARD, [67, 71, 74], .7), .08, 0);

T.write('assets/never_sfx.wav');
console.log('assets/never_sfx.wav', TL.END.toFixed(2), 's');
// the mix: the voice at full level over the SFX, normalised to -14 LUFS
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'assets/never_vo.wav', '-i', 'assets/never_sfx.wav', '-filter_complex',
  `[1:a]volume=0.85[s];[0:a][s]amix=inputs=2:normalize=0:duration=longest,apad=whole_dur=${TL.END.toFixed(3)},atrim=0:${TL.END.toFixed(3)},loudnorm=I=-14:TP=-1.5:LRA=11[o]`,
  '-map', '[o]', '-ar', '48000', '-ac', '2', 'assets/never_mix.wav']);
console.log('assets/never_mix.wav');
