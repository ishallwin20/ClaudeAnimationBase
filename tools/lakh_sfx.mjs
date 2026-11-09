// lakh_sfx.mjs: the sound for the 1 lakh thank-you reel (src/scenes/lakh.js, no voice) → assets/lakh_sfx.wav. Times are
// the scene's constants (keep them in sync). A party popper and hops for the hook, a shimmer for the 15K photo, the camera
// rolled in on squeaky wheels; footsteps for every arrival; Hanuman's idea and the sindoor POOF; Parshurama's stomps and
// the twang of his grin; Shani's limp, the crow, a rising whine for the gaze, Bappa's alarm and the owl's wings; Kanha's
// tiptoes and a slurp; Ravana's ten heads squabbling, a zoom-out and the snores; a comet whoosh; Narad's veena; a choir
// and bells for Shiva, Nandi's bell; the spot's chime, the shutter and the flash; pops for the card.
import { tone, noise, bell, mixb, env, whoosh, plink, squeak, click, thud, shimmer, chime, drum, om, note, seed, rnd, clamp,
  SR, track, heart, gurgle, laughter, slide, crinkle, wingbeat } from './sfx.mjs';

const B0 = 4.0, C0 = 8.4, D0 = 12.4, E1 = 16.0, SIND = 18.9, E2 = 21.4, SMILE = 23.4, E3 = 25.6, LOOKUP = 26.9, CLUTCH = 27.3;
const OWL = 28.0, PUT = 28.8, E4 = 31.2, LICK = 33.0, E5 = 35.2, PULL = 37.0, E6 = 40.6, LAND = 41.6, E7 = 43.6, SHIVA = 45.0;
const F0 = 49.0, G0 = 54.2, MODAK = 55.0, FLASH = 56.2, H0 = 60.6, CARD = 65.4, END = 71.6;

const T = track(END);
seed(100);
const add = (o, b, s0, g = 1) => { const s = Math.round(s0 * SR); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j] * g; return o; };
const lp = (b, fc) => { let l = 0; const a = 1 - Math.exp(-2 * Math.PI * fc / SR); for (let i = 0; i < b.length; i++) { l += a * (b[i] - l); b[i] = l; } return b; };
const step = (amp = 1) => mixb(noise(.06, { lp: 900, hp: 80, e: env.pluck(40), amp }), tone(.08, t => 90 - 200 * t, { e: env.pluck(30), amp: amp * .5 }));
const tip = (f, amp = 1) => mixb(tone(.12, f, { type: 'tri', e: env.pluck(30), amp }), tone(.1, f * 2, { e: env.pluck(40), amp: amp * .25 }));
const pop = (f = 900, amp = 1) => mixb(squeak(f * .6, f * 1.6, .07, amp), plink(f * 1.5, amp * .5));
const boing = (f = 180, amp = 1) => tone(.45, t => f * (1 + .35 * Math.sin(t * 60) * Math.exp(-t * 6)), { type: 'tri', e: env.pluck(6), amp });
const popper = (amp = 1) => mixb(noise(.12, { hp: 600, lp: 7000, e: env.pluck(30), amp }), tone(.08, t => 300 - 1500 * t, { e: env.pluck(40), amp: amp * .6 }), crinkle(.8, amp * .35));
const puff = (amp = 1) => mixb(noise(.5, { lp: 1600, hp: 150, e: env.ad(.01, .45), amp }), tone(.2, t => 140 - 200 * t, { e: env.pluck(14), amp: amp * .7 }));
const twang = (f = 140, amp = 1) => mixb(tone(.7, t => f * (1 + .3 * Math.sin(t * 50) * Math.exp(-t * 5)), { type: 'saw', e: env.pluck(5), amp: amp * .35 }), click(amp * .4));
const whine = (dur, amp = 1) => tone(dur, t => 500 + 1300 * Math.pow(t / dur, 2), { e: env.swell(dur * .9, .03), fm: t => .01 * Math.sin(t * 40), amp });
const pluck = (m, amp = 1) => mixb(tone(1.1, note(m), { type: 'tri', e: env.pluck(4), amp: amp * .6 }), tone(1.1, note(m + 12), { e: env.pluck(6), amp: amp * .25 }));
const caw = (amp = 1) => mixb(lp(tone(.22, t => 640 - 300 * t, { type: 'saw', e: env.swell(.02, .08), amp }), 2400));
const moo = (dur = 1, f = 120, amp = 1) => lp(tone(dur, t => f * (1 + .25 * Math.sin(Math.PI * t / dur)) * (1 - .15 * t / dur), { type: 'saw', e: env.swell(.15, .35), amp }), 900);
const snore = (amp = 1) => mixb(lp(noise(1.1, { lp: 500, hp: 60, e: env.swell(.45, .4), amp }), 700), tone(1.0, t => 70 + 20 * Math.sin(t * 6), { type: 'saw', e: env.swell(.4, .4), amp: amp * .2 }));
const babble = (dur, f, amp = 1) => { const o = new Float32Array(Math.round((dur + .3) * SR)); for (let k = 0; k * .11 < dur; k++) add(o, lp(tone(.09, t => f * (1 + .3 * rnd()) * (1 - t * 2), { type: 'saw', e: env.hann(), amp: amp * (.5 + .5 * rnd()) }), 1800), k * .11); return o; };
const shutter = (amp = 1) => mixb(click(amp), noise(.05, { hp: 1500, lp: 8000, e: env.pluck(80), amp: amp * .7 }), add(new Float32Array(Math.round(.15 * SR)), click(amp * .7), .07));
const flashPop = (amp = 1) => mixb(noise(.25, { hp: 800, lp: 9000, e: env.pluck(14), amp }), tone(.6, t => 2400 * Math.exp(-t * 5) + 300, { e: env.pluck(5), amp: amp * .3 }));
const tick = (amp = 1) => mixb(click(amp), tone(.03, 2600, { e: env.pluck(150), amp: amp * .3 }));

// ---- A · the hook: a popper at frame 0, two hops
T.at(.0, popper(.8), .5);
T.at(.03, shimmer(1.2, [note(86), note(90), note(93), note(98)], .25, .05), .35, .2);
T.at(.9, slide(.25, 300, 700, .25), .3);
T.at(1.5, boing(160, .5), .4);
T.at(2.1, slide(.22, 320, 650, .2), .25);
T.at(2.7, boing(180, .4), .35);
T.at(1.2, popper(.6), .3, -.5);
// ---- B · the 15K photo
T.at(B0 - .15, whoosh(.35, 500, 3500), .4);
T.at(B0 + .5, shimmer(1.3, [note(81), note(85), note(88), note(93)], .3, .07), .3);
T.at(B0 + 1.4, plink(note(93), .5), .3, .3); T.at(B0 + 1.6, plink(note(97), .5), .3, .35);
T.at(C0 - .6, whoosh(.4, 600, 4000), .4, .5);
// ---- C · the camera on squeaky wheels, the pats, under the cloth
for (let k = 0; k < 6; k++) T.at(C0 + .15 + k * .24, squeak(1300 + 200 * (k % 2), 1100, .08, .3), .25, -.4 + k * .1);
T.at(C0 + .1, noise(1.5, { lp: 400, hp: 60, e: env.swell(.2, .3), amp: .6 }), .3);
T.at(C0 + 1.6, thud(.8), .45, .2);
for (let k = 0; k < 4; k++) T.at(C0 + 1.95 + k * .32, tip(note(72 + (k % 2) * 5), .7), .3, .2);
T.at(D0 - 1.0, crinkle(.6, .7), .3, .2);
T.at(D0 - .5, whoosh(.5, 3000, 300), .35);
// ---- D · the empty studio: the lens opens, Bappa runs in and calls everyone
T.at(D0 + .05, shutter(.6), .35);
for (let k = 0; k < 6; k++) T.at(D0 + .55 + k * .2, step(.5), .35, -.6 + k * .12);
for (let k = 0; k < 5; k++) T.at(D0 + 1.9 + k * .26, plink(note(84 + (k % 3) * 3), .5), .25);
// ---- E1 · Ram's family walks in; Hanuman's idea; POOF
T.at(E1 - .3, whoosh(.4, 600, 3000), .3);
for (let k = 0; k < 10; k++) T.at(E1 + .1 + k * .19, step(.45), .3, k % 2 ? .5 : -.5);
T.at(E1 + 2.5, mixb(plink(note(88), .7), plink(note(95), .5)), .45, .4);
T.at(SIND - .05, puff(1), .7, .4);
T.at(SIND + .05, shimmer(.8, [note(84), note(88), note(91)], .3, .05), .25, .4);
T.at(SIND + .6, laughter(1.0, .5), .2, .2);
// ---- E2 · Parshurama stomps; the grin
for (let i = 0; i < 4; i++) T.at(E2 + .35 + i * .3, thud(1), .55, -.4);
T.at(E2 + .9, noise(.3, { lp: 300, e: env.pluck(8), amp: .6 }), .2);
T.at(SMILE, twang(150, 1), .5, -.2);
T.at(SMILE + .05, chime(note(96), .6, 1), .35, -.2);
T.at(SMILE + .25, plink(note(100), .4), .25, -.2);
T.at(SMILE + 1.2, whoosh(.3, 800, 2500, .8), .3, -.3);
// ---- E3 · Shani limps in; the crow; the gaze; Bappa's alarm; the owl's shades
T.at(E3 - .3, whoosh(.4, 600, 3000), .3);
for (let k = 0; k < 5; k++) T.at(E3 + .15 + k * .26, step(k % 2 ? .25 : .55), .35, -.6);
T.at(E3 + 1.0, caw(.8), .3, -.6);
T.at(LOOKUP, whine(.45, .6), .3, -.4);
T.at(CLUTCH, mixb(squeak(900, 1800, .18, .8), thud(.5)), .5);
T.at(CLUTCH + .1, heart(.8), .4);
T.at(CLUTCH + .45, heart(.8), .35);
for (let k = 0; k < 5; k++) T.at(OWL + k * .15, wingbeat(.7, 1), .35, .5 - k * .2);
T.at(PUT, mixb(click(.8), shimmer(.6, [note(91), note(95), note(98)], .35, .04)), .45, -.5);
T.at(PUT + .1, caw(.6), .2, -.6);
for (let k = 0; k < 4; k++) T.at(PUT + .3 + k * .18, wingbeat(.5, 1), .25, .2 + k * .1);
// ---- E4 · Kanha tiptoes in; the pot; the slurp; Mooshak's hop
T.at(E4 - .3, whoosh(.4, 600, 3000), .3);
for (let k = 0; k < 6; k++) T.at(E4 + .15 + k * .2, tip(note(79 + [0, 4, 7, 4, 0, 7][k]), .7), .3, -.6);
T.at(E4 + 1.5, thud(.5), .3, -.4);
T.at(LICK, gurgle(.5, .6), .35, -.5);
T.at(LICK + .5, plink(note(91), .4), .25, -.5);
T.at(LICK + .4, squeak(1400, 2600, .14, .6), .3, -.1);
T.at(LICK + 1.1, pop(1200, .5), .3, -.3);
// ---- E5 · Ravana's heads squabble; the zoom out; the snores
for (let k = 0; k < 6; k++) T.at(E5 + .15 + k * .17, step(.7), .4, .7);
for (let h = 0; h < 5; h++) T.at(E5 + .9 + h * .05, babble(1.0, 220 + h * 45, .5), .14, .4 + h * .1);
T.at(PULL, slide(.8, 1200, 300, .5), .35);
T.at(PULL + .05, whoosh(1.2, 3000, 400), .35);
T.at(PULL + 1.5, mixb(plink(note(84), .6), plink(note(88), .6), plink(note(91), .6)), .35);
for (let k = 0; k < 11; k++) T.at(PULL + 1.8 + k * 1.6, snore(.6), k < 2 ? .25 : .12, .7);
// ---- E6 · the comet; the landing; Narad's veena
T.at(E6 + .1, whoosh(1.0, 400, 5000), .45, .6);
T.at(E6 + .1, slide(.9, 1600, 500, .25), .2, .5);
T.at(LAND, thud(.9), .5, -.3);
T.at(LAND + .02, boing(220, .6), .35, -.3);
[67, 71, 74, 79, 78, 74].forEach((m, k) => T.at(E6 + 1.5 + k * .3, pluck(m, .7), .3, .7));
// ---- E7 · Shiva in gold light; the bells; Nandi
T.at(E7, om(4.5, 110, .7), .3);
T.at(E7 + .1, shimmer(2.5, [note(74), note(78), note(81), note(86), note(90), note(93)], .3, .25), .35);
T.at(SHIVA, mixb(chime(note(81), .8, 3), chime(note(88), .5, 3)), .45);
T.at(SHIVA + .02, drum(55, .6, 1.2), .3);
for (let k = 0; k < 6; k++) T.at(SHIVA + .7 + k * .24, step(.35), .25, .7);
for (let k = 0; k < 4; k++) T.at(SHIVA + .7 + k * .48, bell(note(96), .5, { amp: .3 }), .2, .7);
T.at(SHIVA + 2.3, moo(.9, 115, .7), .22, .7);
// ---- F · the empty spot
T.at(F0 + .9, mixb(chime(note(86), .6, 2.5), chime(note(93), .4, 2.5)), .35, .1);
T.at(F0 + 1.4, shimmer(1.5, [note(86), note(90), note(93), note(98)], .3, .08), .3, .1);
T.at(F0 + 1.6, laughter(1.2, .4), .12);
// ---- G · say modak, the shutter, FLASH
for (let k = 0; k < 6; k++) T.at(G0 + .2 + k * .3, tick(.5), .2, -.2);
T.at(MODAK, laughter(1.1, .6), .2);
T.at(MODAK + .1, mixb(plink(note(88), .5), plink(note(93), .5)), .25);
T.at(FLASH - .02, shutter(1), .5);
T.at(FLASH, flashPop(1), .45);
T.at(FLASH + .3, shimmer(2, [note(81), note(86), note(90), note(93), note(98)], .35, .1), .35);
// ---- H · the ask
T.at(H0 + 1.2, pop(900, .6), .3);
// ---- I · the card
T.at(CARD - .3, whoosh(.5, 600, 3500), .35);
[[.1, 800], [.3, 950], [.6, 1100], [1.0, 1300], [1.5, 1000], [2.4, 900], [2.6, 1000], [3.4, 1200]].forEach(([d, f]) => T.at(CARD + d, pop(f, .5), .25));
T.at(CARD + 1.0, shimmer(1.4, [note(86), note(90), note(93), note(98)], .3, .07), .3);

T.write('assets/lakh_sfx.wav');
