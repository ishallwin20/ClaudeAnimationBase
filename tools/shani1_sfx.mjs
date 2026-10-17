// shani1_sfx.mjs: the sound effects for Shani series Part 1 (src/scenes/shani.js) → assets/shani1_sfx.wav.
// Times are the scene's constants (keep them in sync). The signatures: a low drone and a glassy "ting" for Shani's
// side glance, the POP and the head's rising whistle, Shiva's "hm?" and relieved exhale, a temple-bell calm for the
// flashback, the wife's footsteps and foot-tap, the curse's crackle and boom, the wilt's falling slide, the BONK and the
// crow's caw, a baby's coo and the party murmur, the second glance and pop, Parvati's faint (a slide and a thud),
// Garuda's wingbeats and whooshes, the head's arrival shimmer and Bappa's trumpet, the red curse, the gods' plea, the
// limp's twang, snow wind, the ask's plinks, the card's chimes.
import { track, tone, noise, bell, mixb, env, whoosh, rumble, plink, clang, click, thud, crunch, shimmer, slide, squeak, chirp, laughter, chime, note, seed, rnd, clamp, lerp, SR, drone, thunder, wingbeat, wind, crackle, conch, screech } from './sfx.mjs';

const GL0 = 1.3, GLINT = 2.1, B0 = 3.6, POP = 4.1, C0 = 7.4;
const SHRUG = 8.2, POINT = 10.7, D0 = 14.2;
const D1 = 17.6, WIFE = 16.3, ARRIVE = 17.6, WAVE = 18.2, TAP = 19.3, D2 = 21.0, ANGRY = 20.3, CURSE = 21.3, OPEN = 21.8, WILT = 23.4, E0 = 25.6;
const BONK = 27.7, CROW = 28.7, F0 = 31.0;
const SHANI_IN = 32.6, ASK = 34.6, EXPLAIN = 38.0, G0 = 41.6;
const GLANCE = 43.3, GLINT2 = 44.0, GC = 44.9, POP2 = 45.3, FAINT = 46.3, H0 = 48.8;
const BACK = 52.3, HC = 55.5, JOIN = 55.9, TOOT = 56.9, I0 = 59.0;
const CURSE2 = 60.9, PLEAD = 62.5, I2 = 65.9, LIMP = 66.2, J0 = 69.4, K0 = 73.0, CARD = 77.0;
const CAP_T = 77.1, COVERS = 77.4, PRICE = 78.2, STRIKE = 78.7, DEAD = 79.2, PILL = 79.7, SUB = 80.2, FOLLOW = 80.7, END = 84.6;
const T = track(END);
seed(21);
const add = (o, b, s0, g = 1) => { const s = Math.round(s0 * SR); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j] * g; return o; };
const ting = (m, amp = 1) => bell(note(m), 1.4, { amp });
const pop = (amp = 1, f = 1) => mixb(click(amp), tone(.08, t => f * (500 + 2600 * t / .08), { e: env.pluck(40), amp: amp * .7 }));
const boing = (amp = 1, f = 1) => tone(.45, t => f * (300 + 500 * Math.sin(Math.PI * clamp(t / .3))) * (1 + .08 * Math.sin(t * 2 * Math.PI * 22)), { type: 'tri', e: env.ad(.005, .15), amp });
const rise = (dur, amp = 1) => tone(dur, t => 500 * Math.pow(5, t / dur), { type: 'tri', e: env.swell(.02, .2), fm: t => .01 * Math.sin(t * 2 * Math.PI * 9), amp });
const step = (amp = 1) => mixb(noise(.06, { hp: 200, lp: 1800, e: env.pluck(60), amp }), tone(.06, 160, { e: env.pluck(50), amp: amp * .5 }));
const coo = (amp = 1) => tone(.5, t => 620 + 180 * Math.sin(Math.PI * clamp(t / .5)), { type: 'tri', e: env.hann(), fm: t => .015 * Math.sin(t * 2 * Math.PI * 7), amp });
const caw = (amp = 1) => mixb(tone(.28, t => 640 - 300 * t, { type: 'saw', e: env.swell(.02, .1), fm: t => .2 * Math.sin(t * 2 * Math.PI * 70), amp: amp * .6 }), noise(.28, { hp: 800, lp: 2600, e: env.swell(.02, .1), amp: amp * .4 }));
const hmm = (f0, f1, dur, amp = 1) => tone(dur, t => lerp(f0, f1, t / dur), { type: 'saw', e: env.hann(), fm: t => .004 * Math.sin(t * 2 * Math.PI * 6), amp: amp * .5 });
const exhale = (amp = 1) => noise(.7, { hp: 400, lp: 2200, e: env.hann(), amp });
const trumpet = (amp = 1) => { const o = new Float32Array(Math.round(1.3 * SR)); for (const [s, d, f] of [[0, .22, 520], [.22, .55, 660]]) add(o, tone(d, t => f * (1 + .02 * Math.sin(t * 40)), { type: 'saw', e: env.swell(.03, .12), fm: t => .006 * Math.sin(t * 2 * Math.PI * 6), amp }), s); return o; };

// ---- A · the hook: a low drone, the glance's slide, the glint
T.at(0, drone(3.6, note(38), .5), .35);
T.at(GL0, slide(.35, 900, 600, .3), .25, .2);
T.at(GLINT, ting(93, .8), .45, .3); T.at(GLINT + .05, ting(98, .5), .3, .3);
T.at(B0 - .25, whoosh(.35, 800, 5000), .45, .3);
// ---- B · POP and the head's whistle up
T.at(B0 + .15, coo(.6), .3);
T.at(POP, pop(1, .9), .8); T.at(POP + .02, thud(.5), .35);
T.at(POP + .05, boing(.6, 1.3), .3);
T.at(POP + .55, rise(.8), .3, .1);
T.at(POP + .6, shimmer(.8, [84, 88, 91, 96].map(note), .5), .3, .1);
T.at(C0 - .3, whoosh(.5, 400, 2400), .35, -.3);
// ---- C · Shiva's "hm?", the point, Shani's sweat
T.at(SHRUG, hmm(180, 260, .45), .5, -.4);
T.at(SHRUG + .5, plink(note(79)), .25, -.4);
T.at(POINT, squeak(500, 1100, .12, .7), .35, .2);
T.at(POINT + .2, ting(86, .6), .35, .4);
T.at(POINT + .35, exhale(.5), .3, -.4);
T.at(D0 - .3, whoosh(.5, 400, 2400), .35, .3);
// ---- D · the flashback: a calm bell, steps, the wave, the tap, the curse
T.at(D0 + .1, chime(note(67), .6, 3), .3); T.at(D0 + .9, chime(note(74), .4, 3), .22);
T.at(D0 + .3, shimmer(.6, [79, 83, 86].map(note), .4), .2, -.5);
for (let i = 0; i < 6; i++) T.at(WIFE + .25 + i * .22, step(.5), .25, .6 - i * .05);
for (let i = 0; i < 4; i++) T.at(WAVE + i * .22, whoosh(.14, 900, 2500, .5), .15, .3);
for (let i = 0; i < 4; i++) T.at(TAP + .05 + i * .2, step(.7), .35, .3);
T.at(ANGRY, hmm(330, 200, .35), .3, .3);
T.at(CURSE - .1, crackle(1.1, .8), .4, .1);
T.at(CURSE, thunder(1.4, .7), .45);
T.at(OPEN, ting(91, .8), .35); T.at(OPEN, drone(1.6, note(45), .5), .3);
T.at(WILT, slide(.9, 700, 180, .5), .3, -.5);
T.at(WILT + 1.2, squeak(400, 300, .2, .4), .25);
T.at(E0 - .3, whoosh(.5, 400, 2400), .35, .3);
// ---- E · steps, BONK, the crow
for (let i = 0; i < 7; i++) T.at(E0 + .2 + i * .33, step(.6), .3, -.4 + i * .08);
T.at(BONK, thud(1), .7, .2); T.at(BONK, clang(note(62), .5), .25, .2);
T.at(BONK + .1, shimmer(.8, [91, 95, 98].map(note), .5), .3);
T.at(CROW - .8, wingbeat(.6), .35, .6); T.at(CROW - .5, wingbeat(.6), .35, .4); T.at(CROW - .2, wingbeat(.5), .3, .2);
T.at(CROW + .4, caw(1), .5); T.at(CROW + .75, caw(.8), .35);
T.at(F0 - .25, whoosh(.35, 800, 5000), .4);
// ---- F · the party: a murmur, a coo, steps, "?", the explanation, a laugh
T.at(F0, laughter(ASK - F0, .35), .2);
T.at(F0 + .4, chime(note(76), .5, 2), .25); T.at(F0 + 1.6, coo(.6), .25, .1);
for (let i = 0; i < 5; i++) T.at(SHANI_IN + .1 + i * .28, step(.5), .25, -.6 + i * .1);
T.at(ASK + .2, hmm(220, 330, .4), .35, .5);
for (let i = 0; i < 5; i++) T.at(EXPLAIN + i * .28, whoosh(.16, 800, 2400, .5), .18, -.5);
T.at(EXPLAIN + 1, laughter(1.2, .6), .35, .5);
T.at(EXPLAIN + 2, plink(note(84)), .3, .5);
// ---- G · the glance again, POP, the faint
T.at(G0, drone(GC - G0, note(38), .5), .35);
T.at(GLANCE, slide(.4, 900, 600, .3), .3, .2);
T.at(GLINT2, ting(93, .8), .45, .3); T.at(GLINT2 + .05, ting(98, .5), .3, .3);
T.at(GC - .2, whoosh(.3, 800, 5000), .4);
T.at(POP2, pop(1, .9), .8); T.at(POP2 + .02, thud(.5), .35);
T.at(POP2 + .55, rise(.8), .3, .1); T.at(POP2 + .6, shimmer(.8, [84, 88, 91, 96].map(note), .5), .3, .1);
T.at(FAINT - .2, slide(.6, 900, 250, .5), .3, -.5); T.at(FAINT + .55, thud(.7), .45, -.5);
T.at(H0 - .25, whoosh(.4, 600, 4000), .4);
// ---- H · Garuda out and back, the head joins, Bappa's trumpet
for (let i = 0; i < 6; i++) T.at(H0 + .1 + i * .42, wingbeat(.9), .4, -.8 + i * .3);
T.at(H0 + 1, whoosh(1.2, 300, 1800), .4, .4);
T.at(BACK - .2, screech(.7, 2400, .6), .2, .6);
for (let i = 0; i < 6; i++) T.at(BACK + i * .5, wingbeat(.7), .3, .6 - i * .2);
T.at(BACK + 1, shimmer(1.2, [76, 79, 83, 88].map(note), .5), .3);
T.at(HC - .9, whoosh(.8, 300, 2000), .35, -.6);
T.at(HC, chime(note(72), .7, 2.5), .45);
T.at(JOIN, shimmer(1.2, [84, 88, 91, 96, 100].map(note), .7), .45);
T.at(JOIN + .3, boing(.6, 1), .3);
T.at(TOOT, trumpet(.8), .55);
T.at(TOOT + .3, laughter(1.4, .6), .25);
// ---- I · the red curse, the plea, the softening, the limp
T.at(CURSE2 - .3, hmm(260, 160, .5), .4, .4);
T.at(CURSE2, thunder(1.6, .9), .5); T.at(CURSE2, crackle(1.2, .9), .4, -.3);
T.at(PLEAD - .9, whoosh(.9, 300, 1600), .3, .6);
for (let i = 0; i < 3; i++) T.at(PLEAD - .8 + i * .3, wingbeat(.5), .25, .4);
T.at(PLEAD + .3, conch(1.6, 311, .5), .2, .1);
T.at(I2, chime(note(69), .6, 2), .35);
T.at(LIMP, plink(note(55), 1), .45, -.6); T.at(LIMP + .05, thud(.5), .3, -.6);
T.at(LIMP + .3, squeak(300, 220, .25, .5), .25, -.6);
T.at(LIMP + 1, chime(note(64), .4, 2), .25);
// ---- J · snow wind and the limping steps; the crow
T.at(J0, wind(K0 - J0 + .3, 0, 1), .3);
for (let i = 0; i < 6; i++) T.at(J0 + .2 + i * .58, crunch(i % 2 ? .4 : .8), .3, .3 - i * .1);
T.at(J0 + 2, caw(.6), .25, -.3);
// ---- K · the ask
T.at(K0 + .1, trumpet(.5), .3, -.1);
T.at(K0 + .5, plink(note(79)), .3); T.at(K0 + .9, plink(note(84)), .3); T.at(K0 + 1.2, plink(note(88)), .3, .6);
T.at(CARD - .3, whoosh(.6, 500, 3000), .4);
// ---- L · the card
T.at(CAP_T, chime(note(79), .6, 2.5), .45);
T.at(COVERS, plink(note(84)), .3, -.4); T.at(COVERS + .12, plink(note(88)), .3, .4); T.at(COVERS + .24, plink(note(91)), .3);
T.at(STRIKE, squeak(900, 400, .15, .6), .3); T.at(STRIKE + .1, chime(note(84), .6, 2), .4);
T.at(PILL, ting(91, .7), .4);
T.write('assets/shani1_sfx.wav');
