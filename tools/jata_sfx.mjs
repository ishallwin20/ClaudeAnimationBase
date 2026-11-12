// jata_sfx.mjs: the sound effects for "Why do some sadhus keep JATA and some SHAVE?" (src/scenes/jata.js) →
// assets/jata_sfx.wav, then the mix with the voice → assets/jata_mix.wav. Times come from the voice and the timeline
// (src/scenes/jata_vo.js + jata_tl.js, loaded with vm), so they follow the picture.
// Dawn on the river bank: birds, a breeze, the dhuni crackling, a far temple bell on frame 0; a whoosh as the focus goes to
// the shaven head. Two roads: a low boom, a chime. The hermit: forest birds, leaves; his hair grows with a long rustle.
// Ram: a soft pad, the banyan's milk dripping (a plink a drop). The sannyasi: a bell; the razor on SHAVEN; the shikha
// into the water. The comb: two pops, a wooden click. Today: a damaru's rattle on SHIVA, the staff's knock on DANDI.
// The diksha: the razor again, a deep bell. Bhaja Govindam: a low drone at dusk, one bell, a thud on COSTUME. The ask. The card.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, plink, click, shimmer, drone, note, seed, chime, thud, rnd, fire, chirp, wind, crinkle, splash } from './sfx.mjs';

const TL = runInNewContext(readFileSync('src/scenes/jata_vo.js', 'utf8') + '\n' + readFileSync('src/scenes/jata_tl.js', 'utf8') + '\n;TL');
const T = track(TL.END);
seed(87);
const pop = (amp = 1, f = 1) => mixb(click(amp), tone(.07, t => f * (500 + 2600 * t / .07), { e: env.pluck(40), amp: amp * .7 }), noise(.05, { lp: 2500, hp: 300, e: env.pluck(60), amp: amp * .5 }));
const pad = (dur, ms, amp = 1) => mixb(...ms.map((m, i) => tone(dur, t => note(m) * (1 + .003 * Math.sin(t * 2 + i)), { type: 'tri', e: env.swell(.8, .8), amp: amp / ms.length })));
const templeBell = (f = 76, amp = 1) => bell(note(f), 4, { partials: [[1, 1], [2.02, .6], [2.76, .45], [4.1, .3], [5.4, .18]], k: 1.1, amp });
const boom = (amp = 1) => mixb(tone(2.2, t => 52 * Math.exp(-t * .9) + 26, { e: env.pluck(1.6), amp }), noise(.9, { lp: 380, hp: 25, brown: true, e: env.pluck(4), amp: amp * .7 }));
const rustle = (dur = .6, amp = 1) => mixb(crinkle(dur, amp), noise(dur, { hp: 2500, lp: 9000, e: env.swell(.05, dur * .6), amp: amp * .4 }));
const razor = (amp = 1) => mixb(noise(.38, { hp: 3200, lp: 11000, e: env.swell(.03, .3), amp }), tone(.3, t => 2400 + 1800 * t / .3, { e: env.pluck(9), amp: amp * .12 }));
const birds = (t0, t1, n, amp = 1) => { for (let k = 0; k < n; k++) { const t = t0 + rnd() * (t1 - t0), p = (rnd() - .5) * 1.4; for (let j = 0; j < 2 + Math.floor(rnd() * 3); j++) T.at(t + j * .11, chirp(1), .03 * amp, p); } };
const river = (t0, t1, amp = 1) => T.at(t0, noise(t1 - t0 + .5, { lp: t => 900 + 250 * Math.sin(t * .7), hp: 180, e: env.swell(.6, .6), amp }), .035, 0);

// ---- A: dawn, the two sadhus
river(0, TL.C0); T.at(0, wind(TL.B0 + .5, 0, .2), .04, 0);
birds(0, TL.C0, 12);
T.at(0, templeBell(62, 1), .12, .3);
T.at(0, pad(TL.C0 + .5, [57, 64, 69], .9), .05, 0);
T.at(0, fire(TL.C0, .5, .25), .05, .4);
T.at(TL.SHAVE - .35, whoosh(.8, 500, 2200, 1), .07, .2);
T.at(TL.WHY, chime(note(81), .6, 1.8), .08, 0);
// ---- B: two roads
T.at(TL.B0, whoosh(1.2, 300, 1800, 1), .07, 0);
T.at(TL.TWO - .05, mixb(boom(.7), chime(note(74), .7, 2)), .16, 0);
T.at(TL.ROADS, chime(note(78), .6, 1.6), .07, 0);
// ---- C: the forest hermit; the jata grows
T.at(TL.C0, wind(TL.E0 - TL.C0 + .5, 3, .5), .05, 0);
birds(TL.C0, TL.E0, 16, 1.1);
T.at(TL.C0, drone(TL.D0 - TL.C0 + .6, 50, 1), .045, 0);
T.at(TL.HERMIT, templeBell(57, .7), .1, -.2);
for (let k = 0; k < 9; k++) T.at(TL.MANU + .2 + k * (TL.NAILS + .5 - TL.MANU - .2) / 9, rustle(.55, .7 + k * .04), .05, (k % 2 ? .3 : -.3));
T.at(TL.MANU + .2, tone(TL.NAILS - TL.MANU + .3, t => note(57) * Math.pow(2, t / (TL.NAILS - TL.MANU + .3) * .5), { type: 'tri', e: env.swell(.6, .4), amp: 1 }), .035, 0);
T.at(TL.JATA, chime(note(81), .7, 2), .08, 0);
// ---- D: Ram and the banyan's milk
T.at(TL.D0, pad(TL.E0 - TL.D0 + .6, [55, 62, 67, 71], 1), .06, 0);
T.at(TL.RAM - .05, templeBell(67, .7), .1, 0);
for (let t = TL.BANYAN; t < TL.E0; t += 1 / 1.5) T.at(t, mixb(plink(note(86 + Math.floor(rnd() * 5)), .5), splash(.12)), .05, -.2);
T.at(TL.MILK, chime(note(83), .7, 2), .08, 0);
T.at(TL.MATTED, rustle(.9, .9), .06, 0);
// ---- E: the wandering sannyasi; the razor, the shikha into the water
river(TL.E0, TL.I0, .9); birds(TL.E0, TL.I0, 14, .8);
T.at(TL.E0, pad(TL.G0 - TL.E0 + .6, [57, 64, 69], .8), .05, 0);
T.at(TL.SANNYASI - .2, templeBell(64, .8), .1, .2);
T.at(TL.SHAVEN - .35, razor(1), .1, .2); T.at(TL.SHAVEN - .05, razor(.8), .08, -.1);
T.at(TL.SHAVEN + .1, chime(note(84), .6, 1.6), .07, 0);
T.at(TL.GIVEN, mixb(razor(.6), plink(note(76), .5)), .08, 0);
T.at(TL.GIVEN + .35, splash(.5), .07, 0);
// ---- F: one never cuts, one cuts it all; the comb
T.at(TL.ONE1, pop(.8, 1), .1, -.3); T.at(TL.ONE2, pop(.8, 1.2), .1, .3);
T.at(TL.BOTH - .3, whoosh(1.4, 300, 1600, 1), .07, 0);
T.at(TL.COMB - .05, mixb(click(1), thud(.5), chime(note(79), .7, 2.2)), .14, 0);
// ---- G: today: Shiva the matted-haired, the Nagas; the Dandis
T.at(TL.G0, fire(TL.I0 - TL.G0, .6, .3), .05, .3);
T.at(TL.G0, drone(TL.DANDI - TL.G0, 45, 1), .045, 0);
for (let k = 0; k < 10; k++) T.at(TL.SHIVA - .1 + k * .075, thud(.5 + .05 * k), .07, (k % 2 ? .25 : -.25));
T.at(TL.SHIVA + .7, templeBell(50, .9), .12, 0);
T.at(TL.NAGA, chime(note(76), .7, 2), .08, 0);
T.at(TL.DANDI - .3, whoosh(.7, 400, 2400, 1), .08, 0);
T.at(TL.DANDI, templeBell(69, .7), .1, .2);
T.at(TL.STAFF, mixb(thud(1), click(.8)), .14, .3);
T.at(TL.SHAVEN2, chime(note(81), .6, 1.6), .07, 0);
// ---- H: even a Naga begins with a shaved head
T.at(TL.H0, drone(TL.I0 - TL.H0 + .4, 43, 1), .05, 0);
T.at(TL.SHAVED - .5, razor(1), .1, -.2); T.at(TL.SHAVED - .2, razor(.9), .09, .2);
T.at(TL.SHAVED + .1, boom(.6), .14, 0);
T.at(TL.DIKSHA - .05, templeBell(52, 1), .14, 0);
// ---- I: Bhaja Govindam at dusk
T.at(TL.I0, drone(TL.J0 - TL.I0 + .5, 38, 1), .07, 0);
T.at(TL.I0, pad(TL.J0 - TL.I0 + .5, [50, 57, 62], 1), .06, 0);
T.at(TL.I0, fire(TL.J0 - TL.I0, .7, .35), .05, .3);
T.at(TL.BHAJA, templeBell(57, 1), .13, 0);
T.at(TL.COSTUME, mixb(boom(.9), thud(.8)), .2, 0);
// ---- J: the ask
river(TL.J0, TL.CARD, .9); birds(TL.J0, TL.CARD, 6);
T.at(TL.J0, pad(TL.CARD - TL.J0, [57, 64, 69], .8), .05, 0);
T.at(TL.YOU, pop(.7, 1.1), .1, 0);
T.at(TL.PLACE, mixb(pop(1, 1.3), shimmer(.7, [note(91), note(95), note(98)], .6, .06)), .16, 0);
// ---- the card
T.at(TL.CARD - .3, whoosh(.7, 400, 3200), .22, 0);
T.at(TL.CARD + .35, mixb(...[67, 71, 74, 79].map((m) => bell(note(m), 2.2, { partials: [[1, 1], [2, .35], [3, .12]], k: 1.4, amp: .7 }))), .2, 0);
for (let k = 0; k < 3; k++) T.at(TL.CARD + .7 + k * .12, pop(.8, 1 + k * .15), .22, (k - 1) * .4);
T.at(TL.CARD + 1.65, mixb(pop(1, 1.3), shimmer(.7, [note(91), note(95), note(98)], .6, .06)), .24, 0);
T.at(TL.CARD, pad(TL.END - TL.CARD, [67, 71, 74], .7), .07, 0);

T.write('assets/jata_sfx.wav');
console.log('assets/jata_sfx.wav', TL.END.toFixed(2), 's');
// the mix: the voice at full level over the SFX, normalised to -14 LUFS
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'assets/jata_vo.wav', '-i', 'assets/jata_sfx.wav', '-filter_complex',
  `[1:a]volume=0.85[s];[0:a][s]amix=inputs=2:normalize=0:duration=longest,apad=whole_dur=${TL.END.toFixed(3)},atrim=0:${TL.END.toFixed(3)},loudnorm=I=-14:TP=-1.5:LRA=11[o]`,
  '-map', '[o]', '-ar', '48000', '-ac', '2', 'assets/jata_mix.wav']);
console.log('assets/jata_mix.wav');
