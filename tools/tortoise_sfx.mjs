// tortoise_sfx.mjs: the sound effects for the wordless tortoise-and-swans test (times from src/scenes/tortoise.js).
//   node tools/tortoise_sfx.mjs   → assets/tortoise_sfx.wav
import { track, whoosh, thud, plink, squeak, click, crunch, chime, slide, wind, laughter, note, tone, env, mixb } from './sfx.mjs';

const DRY1 = 1.6, LANDB = 1.95, LANDA = 2.3, LAKE0 = 2.9, LAKE1 = 4.6, NODB = [3.7, 4.05], WING0 = 4.8, WING1 = 6.2, IDEA = 6.3;
const PLAN0 = 6.6, PLAN1 = 8.3, AGREE = 7.9, ZIP0 = 8.5, ZIP1 = 9.9, NODT = 9.45, DIP = 10.0, CHOMP = 10.3, UPS = 10.45;
const SWOOP0 = 11.0, GRAB = 11.5, LIFT = 11.75, B0 = 12.4, KIDS = 14.4, POINT = 15.0, WHEEL0 = 15.6, WHEEL1 = 17.6, FROWN = 17.7;
const LEGS0 = 18.8, LEGS1 = 20.6, PUFF = 20.7, WARN0 = 21.7, WARN1 = 23.3, ROLL = 23.4, SNAP = 24.6, DROP = 24.72, POPB = 25.45;
const THUD = 26.5, LAST0 = 26.9, LAST1 = 28.4, GO = 28.5, END = 31;

const T = track(END);
const bubIn = (t, pan = 0) => { T.at(t, plink(note(84), .8), .3, pan); T.at(t + .05, plink(note(91), .5), .18, pan); };
const bubOut = (t, pan = 0) => T.at(t, squeak(900, 500, .08, .6), .12, pan);
const flap = (t, g = .22, pan = 0) => T.at(t, whoosh(.16, 500, 1600), g, pan);
const honk = (t, f = 520, pan = 0) => T.at(t, mixb(tone(.16, x => f * (1 + .15 * Math.sin(x * 60)), { type: 'saw', e: env.hann(), amp: .5 }), tone(.16, f * 2, { e: env.hann(), amp: .15 })), .12, pan);

// ---- act 1: the dry pond
T.at(0, wind(12.4, 0, 1), .05);
T.at(DRY1 - .1, plink(note(76), .5), .2, .3); T.at(DRY1 + .05, squeak(700, 300, .18, .5), .1, .3);   // the last drop
T.at(1.8, tone(.6, x => 220 - 60 * x, { e: env.swell(.05, .4), amp: .4 }), .12);                      // a sigh
for (let i = 0; i < 4; i++) { flap(LANDB - .55 + i * .15, .18, -.5); flap(LANDA - .55 + i * .15, .18, .5); }
T.at(LANDB, click(.8), .3, -.5); T.at(LANDA, click(.8), .3, .5); honk(LANDB + .3, 560, -.5); honk(LANDA + .3, 500, .5);
bubIn(LAKE0, .3); bubOut(LAKE1, .3);
for (const n of NODB) T.at(n, click(.5), .2, -.5);
bubIn(WING0); T.at(WING0 + .4, tone(.9, x => 300 - 100 * x, { type: 'tri', e: env.swell(.1, .5), amp: .3 }), .12); bubOut(WING1);
T.at(IDEA, chime(note(88), .8, 1.4), .3); T.at(IDEA + .08, chime(note(95), .5, 1.2), .2);
bubIn(PLAN0); bubOut(PLAN1);
T.at(AGREE + .25, click(.6), .2, -.5); T.at(AGREE + .3, click(.6), .2, .5);
bubIn(ZIP0, .3); T.at(ZIP0 + .45, squeak(1200, 2400, .22, .5), .2, .3); bubOut(ZIP1, .3);                   // zzzip
for (let i = 0; i < 4; i++) T.at(NODT + i * .12, click(.5), .18);
T.at(DIP, whoosh(.2, 300, 900), .15); T.at(CHOMP, crunch(.9), .45);
for (let i = 0; i < 6; i++) { flap(UPS + i * .15, .2, -.3); flap(UPS + .1 + i * .15, .2, .3); }
for (let i = 0; i < 4; i++) { flap(SWOOP0 + i * .14, .18, -.3); flap(SWOOP0 + .07 + i * .14, .18, .3); }
T.at(GRAB, click(.9), .3, -.3); T.at(GRAB + .03, click(.9), .3, .3); T.at(GRAB + .05, squeak(600, 900, .1, .5), .12);
for (let i = 0; i < 5; i++) { flap(LIFT + i * .12, .26, -.3); flap(LIFT + .06 + i * .12, .26, .3); }
T.at(B0 - .35, whoosh(.6, 400, 4000), .35);                                                                 // the tilt up

// ---- act 2: the sky over the town
T.at(B0, wind(END - B0, 1.3, 1.2), .12);
for (let t = B0 + .4; t < GO; t += 1 / 2.6) flap(t, .07, -.2);
for (let t = GO; t < GO + 1.6; t += .22) flap(t, .1, .4);
T.at(KIDS, click(.6), .2, .4); T.at(KIDS + .25, click(.6), .2, .5);
T.at(POINT, squeak(500, 900, .14, .5), .12, .4);
bubIn(WHEEL0, .3); bubOut(WHEEL1, .3);
T.at(WHEEL0 + 1.0, laughter(1.6, .8), .25, .4);
T.at(FROWN, tone(.3, x => 160 - 30 * x, { type: 'tri', e: env.swell(.05, .2), amp: .4 }), .12);
bubIn(LEGS0, .4); bubOut(LEGS1, .4);
T.at(LEGS0 + 1.0, laughter(SNAP - LEGS0 - .85, 1), .32, .4);
T.at(PUFF, slide(.6, 200, 400, .5), .12);                                                                   // he puffs up
bubIn(WARN0, .3); T.at(WARN0 + .45, squeak(1200, 2400, .22, .5), .2, .3); bubOut(WARN1, .3);
T.at(WARN1 - .1, tone(.25, x => 140 - 40 * x, { e: env.hann(), amp: .4 }), .15);                            // a gulp
T.at(ROLL, laughter(SNAP - ROLL + .1, 1), .2, .5);
T.at(SNAP, mixb(tone(.25, x => 260 + 300 * x, { type: 'saw', e: env.hann(), amp: .4 }), plink(note(79), .6)), .22, -.2);   // "WHAT—"
bubIn(SNAP + .02, -.4);
T.at(DROP, slide(.9, 1500, 220, .6), .3, -.1);                                                               // the drop
T.at(POPB, squeak(1400, 400, .1, .7), .18, -.4);
T.at(THUD, thud(1), .5); T.at(THUD + .02, crunch(.5), .15);
bubIn(LAST0, .3); T.at(LAST0 + .45, squeak(1200, 2400, .22, .5), .16, .3); bubOut(LAST1, .3);
T.at(LAST0 + .7, tone(.7, x => 330 - 120 * x, { e: env.swell(.05, .4), amp: .3 }), .1);                      // a sigh
honk(GO + .1, 520, .5);
T.write('assets/tortoise_sfx.wav');
