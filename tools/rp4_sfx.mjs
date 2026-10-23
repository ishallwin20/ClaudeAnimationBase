// rp4_sfx.mjs: the sound effects for Ramayan Part 4 (src/scenes/rp4.js) → assets/rp4_sfx.wav, then the mix with the
// voice → assets/rp4_mix.wav. Times come from the voice (src/scenes/rp1_vo.js), computed as the scene does.
// Beds: the tanpura, the forest and the stream at Chitrakoot, the wind of the three worlds, the night grove in Lanka,
// the dusk of the horde. Hits: the grass's charge, the crow's wings and caws, the clod, the cry, Ram waking, the crown,
// the astra's hum, the chase, the refusals, the landing at his feet, the strike on the eye, the bubble, the card.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, plink, clang, click, thud, shimmer, slide, drone, squeak, note, seed, chime, wind, drum, heart, om, conch, chirp, screech, wingbeat, crackle, thunder, gurgle, roar, SR } from './sfx.mjs';

const VO = runInNewContext(readFileSync('src/scenes/rp4_vo.js', 'utf8') + '\n;VO');
const LN = VO.lines, capOf = id => VO.caps.filter(c => c.id === id), Wd = (id, ci, wi) => capOf(id)[ci].at[wi];
const mid = (a, b) => (LN[a].end + LN[b].a) / 2;
const B0 = mid('hook', 'intro'), C0 = mid('intro', 'rest'), D0 = mid('wake', 'grass'), E0 = mid('grass', 'flee'), F0 = mid('flee', 'back'), G0 = mid('eye', 'twist');
const H0 = mid('why', 'next'), K0 = mid('next', 'follow'), END = LN.follow.end + 2.5;
const CROWH = Wd('hook', 0, 7), PECK = Wd('peck', 0, 3), CLOD = Wd('peck', 0, 9), CAME = Wd('peck', 1, 1), CLAW = Wd('peck', 1, 4), BLED = Wd('peck', 1, 8);
const WOKE = Wd('wake', 0, 1), BLOOD = Wd('wake', 0, 5), INDRAS = Wd('wake', 1, 7);
const PICK = Wd('grass', 0, 1), BLADE = Wd('grass', 0, 4), BRAHM = Wd('grass', 0, 12), FLED = Wd('flee', 0, 2), WORLDS = Wd('flee', 0, 6);
const FATHER = Wd('flee', 1, 1), GODS = Wd('flee', 1, 4), SAGES = Wd('flee', 1, 6), NOONE = Wd('flee', 1, 7), FEET = Wd('back', 0, 7);
const WASTED = Wd('eye', 0, 5), RIGHT = Wd('eye', 1, 6), SPARED = Wd('eye', 1, 10), LANKA = Wd('twist', 0, 3), ONLY = Wd('twist', 1, 2);
const WHYNOT = Wd('why', 1, 0), TOOK = Wd('why', 1, 6), FOURTEEN = Wd('next', 0, 6);
const CARD = { head: K0 + .1, title: K0 + .5, pill: LN.follow.a + .2, ask: Wd('follow', 1, 1), books: Wd('follow', 1, 2) + .6 };

const T = track(END);
seed(44);
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
const caw = (amp = 1) => mixb(tone(.3, t => 600 - 300 * t, { type: 'saw', e: env.ad(.01, .1), amp: .5 * amp }), tone(.3, t => 640 - 300 * t, { type: 'saw', e: env.ad(.01, .1), amp: .4 * amp }));
const hum = (dur, amp = 1) => mixb(tone(dur, t => 220 + 8 * Math.sin(t * 30), { type: 'tri', e: env.swell(.2, .3), amp: .5 * amp }), tone(dur, 440, { e: env.swell(.2, .3), amp: .2 * amp }));
// ---- A: the hook
T.at(0, mixb(hum(B0 + .2, .8), shimmer(1.4, [note(86), note(90), note(93), note(98)], .7, .08)), .18, 0);
T.at(CROWH - .3, mixb(wingbeat(1), caw(.8)), .2, .5);
T.at(B0 - .3, whoosh(.6, 500, 3000), .25, 0);
// ---- B: the ident
T.at(B0, mixb(conch(1.8, 311, .8), chord([62, 69, 74, 78], 2.4, .9)), .22, 0);
T.at(B0 + .35, pop(.8), .25, 0); T.at(B0 + .7, pop(.6, 1.2), .2, 0);
T.at(C0 - .3, whoosh(.6, 400, 2600), .22, 0);
// ---- C: Chitrakoot
T.at(C0, noise(D0 - C0, { lp: 1800, hp: 200, e: env.swell(.6, .6), amp: .4 }), .06, 0);   // the stream
T.at(C0, tanpura(D0 - C0 + .4, .6), .09, 0);
for (let k = 0; k < 4; k++) T.at(C0 + .4 + k * 1.1, chirp(.5), .06, -.5 + k * .3);
T.at(C0 + 1, mixb(wingbeat(.8)), .14, .6);
for (let k = 0; k * .22 < CLOD - PECK + .4; k++) T.at(PECK - .4 + k * .22, click(.6), .14, -.2);   // pecking
T.at(PECK, caw(.7), .14, -.1);
T.at(CLOD - .1, whoosh(.4, 800, 2400), .18, 0); T.at(CLOD + .6, mixb(caw(1), wingbeat(1)), .2, .3);
T.at(CAME - .1, mixb(wingbeat(1), whoosh(.5, 2000, 600)), .2, -.1);
T.at(CLAW, mixb(noise(.3, { hp: 2000, lp: 6000, e: env.hann(), amp: .8 }), slide(.5, 900, 700, .5)), .2, -.2);   // the claw, her cry
T.at(BLED, slide(.8, 520, 440, .3), .1, -.2);
T.at(WOKE - .1, mixb(plink(note(81), .8), slide(.3, 400, 700, .4)), .2, .2);
T.at(BLOOD + .2, drum(48, .8, 1), .2, 0);
T.at(INDRAS - .2, mixb(shimmer(1.2, [note(86), note(90), note(93)], .6, .08), chime(note(91), .7, 1.4)), .22, .3);
// ---- D: the grass
T.at(D0 - .3, whoosh(.6, 600, 3000), .2, 0);
T.at(PICK, noise(.3, { hp: 1500, lp: 5000, e: env.hann(), amp: .5 }), .12, .2);
T.at(BLADE, hum(BRAHM - BLADE + 1, 1), .2, .1);
T.at(BLADE + .2, om(BRAHM - BLADE + 1, 98, .5), .12, 0);
T.at(BRAHM - .1, mixb(chord([62, 66, 69, 74, 78], 2.4, .9), drum(44, 1, 1.4)), .3, 0);
// ---- E: the three worlds
T.at(E0 - .2, whoosh(1, 300, 5000), .35, -.4);
T.at(E0, wind(F0 - E0, 2, .6), .16, 0);
for (let k = 0; k * .5 < F0 - E0; k++) T.at(E0 + .2 + k * .5, wingbeat(.8), .1, Math.sin(k) * .5);
T.at(E0 + .2, hum(F0 - E0 - .2, .7), .12, .3);
T.at(FATHER - .3, mixb(pop(.8), chime(note(86), .6, 1.2)), .2, .4);
T.at(GODS, mixb(tone(.5, t => 300 - 120 * t, { type: 'tri', e: env.ad(.02, .2), amp: .6 })), .14, .4);   // "no"
T.at(SAGES - .3, mixb(pop(.7, 1.1), chime(note(81), .6, 1.2)), .2, -.4);
T.at(NOONE - .1, mixb(drum(50, .9, 1), noise(.8, { brown: true, lp: 300, e: env.pluck(4), amp: .7 })), .28, 0);
// ---- F: at his feet; the eye
T.at(F0 - .3, whoosh(.7, 4000, 600), .25, .4);
T.at(FEET - .1, mixb(thud(.5), wingbeat(.6)), .2, .2);
T.at(WASTED - .6, hum(RIGHT - WASTED + .6, .8), .14, .3);
T.at(RIGHT, mixb(chord([62, 69, 74], 2, .7), noise(.4, { hp: 1500, lp: 6000, e: env.pluck(10), amp: .8 }), caw(1)), .3, .3);
T.at(SPARED, mixb(shimmer(1.4, [note(81), note(86), note(90)], .6, .1)), .18, 0);
T.at(SPARED + .4, mixb(wingbeat(1), whoosh(.8, 600, 2400)), .2, .6);
// ---- G: Lanka
T.at(G0 - .3, whoosh(.7, 2600, 500), .2, 0);
T.at(G0, mixb(drone(H0 - G0, note(SA - 24), .7), noise(H0 - G0, { lp: 900, hp: 100, e: env.swell(.6, .6), amp: .3 })), .1, 0);
for (let k = 0; k < 4; k++) T.at(G0 + .5 + k * 1.3, tone(.25, 2200, { e: env.pluck(20), amp: .5 }), .04, .5);
T.at(LANKA - .2, mixb(pop(.7), shimmer(.9, [note(84), note(88), note(91)], .5, .08)), .2, 0);
T.at(ONLY, chime(note(86), .7, 1.6), .2, 0);
T.at(WHYNOT, pad(H0 - WHYNOT, [57, 60, 64], .9), .12, 0);
T.at(TOOK - .2, mixb(drum(44, 1, 1.2), noise(1, { brown: true, lp: 300, e: env.pluck(3), amp: .7 })), .28, 0);
// ---- H: the tease
T.at(H0 - .3, whoosh(.7, 400, 3000), .2, 0);
T.at(H0, mixb(noise(K0 - H0, { brown: true, lp: 300, e: env.swell(.5, .5), amp: .6 })), .14, 0);
for (let k = 0; k * .45 < K0 - H0; k++) T.at(H0 + .2 + k * .45, drum(k % 2 ? 60 : 48, .7, .5), .14, 0);
T.at(FOURTEEN - .6, slide(.6, 200, 600, .5), .16, -.4);   // the bow drawn
T.at(FOURTEEN + .2, roar(1.4, 110, 10, .6), .16, .4);
// ---- I: the card
T.at(K0 - .3, whoosh(.7, 400, 3200), .3, 0);
T.at(CARD.head, mixb(conch(1.6, 311, .7), chord([62, 69, 74, 78], 2.4, .8)), .22, 0);
T.at(CARD.title, pop(.9), .28, 0); T.at(CARD.title + .2, pop(.7, 1.2), .22, 0);
T.at(CARD.pill, mixb(pop(1, 1.3), shimmer(.7, [note(91), note(95), note(98)], .6, .06)), .3, 0);
T.at(CARD.ask, plink(note(93)), .22, 0);
for (let k = 0; k < 3; k++) T.at(CARD.books + k * .12, pop(.6, 1 + k * .15), .2, (k - 1) * .4);
T.at(K0, tanpura(END - K0, .6), .08, 0);

T.write('assets/rp4_sfx.wav');
console.log('assets/rp4_sfx.wav', END.toFixed(2), 's');
// the mix: the voice at full level over the SFX, normalised to -14 LUFS (apad needs whole_dur, or it never ends)
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'assets/rp4_vo.wav', '-i', 'assets/rp4_sfx.wav', '-filter_complex',
  `[1:a]volume=0.85[s];[0:a][s]amix=inputs=2:normalize=0:duration=longest,apad=whole_dur=${END.toFixed(3)},atrim=0:${END.toFixed(3)},loudnorm=I=-14:TP=-1.5:LRA=11[o]`,
  '-map', '[o]', '-ar', '48000', '-ac', '2', 'assets/rp4_mix.wav']);
console.log('assets/rp4_mix.wav');
