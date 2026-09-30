// wifi_sfx.mjs: the sound-effects cue list for "The Cosmic Wi-Fi Battle" (src/scenes/wifi_battle.js), built with
// tools/sfx.mjs. The times match the scene's constants and STORYBOARD.md. The level sits under music: Instagram's track
// goes on top.
//   node tools/wifi_sfx.mjs [--out=assets/wifi_sfx.wav]
import { track, rnd, env, tone, noise, bell, mixb, note, whoosh, rumble, plink, clang, squeak, click, thud, crackle, shimmer, wah, drone, slide } from './sfx.mjs';

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const { at, write } = track(28);

// the scene's times
const FRZ_K = 4.6, TAP_K = [4.95, 5.2], FRZ_G = 5.35, TAP_G = [5.7, 5.95], VR_UP = 6.05, GLARE = [6.45, 7.05], EYES_R = 7.15,
  CROUCH = 7.55, HOP = [7.75, 8.3], GRAB = 8.35, KP = [9.0, 9.5, 10.0], GP = [10.5, 11.0, 11.5], ALL = 12.0, DARK = 14.2,
  JIG = 15.3, ACC = 15.9, FOL = 16.55, WHIP = [17.2, 17.6], LOWER = [19.9, 20.35], SLURP = [20.4, 21.35], DRAG = 20.55,
  THUD = 21.35, GULP = 21.5, JAW = 21.95, PEEK = 22.95, SNAP = 23.55, STING = 25.0, BPEEK = 25.3, SLIDE = 25.75, SHUT = 26.15, CRT = [27.25, 27.95];

// a chiptune blip: a square-ish beep, for the game
const blip = (f, d = .07) => tone(d, f, { type: 'square', e: env.pluck(30), amp: .5 });
// the buffering tick: a soft, dull tock, the same for both screens
const tock = () => mixb(tone(.05, 900, { e: env.pluck(90), amp: .5 }), noise(.02, { hp: 3000, e: env.pluck(200), amp: .3 }));
// a boing: an antenna springing back
const boing = (f = 180) => tone(.5, t => f * (1 + .35 * Math.sin(t * 60) * Math.exp(-t * 7)), { type: 'tri', e: env.pluck(6), amp: .7 });
// a zap: the glare
const zap = d => mixb(tone(d, t => 1400 + 700 * Math.sin(t * 90), { type: 'saw', e: env.swell(.02, .1), amp: .35 }), noise(d, { hp: 2500, lp: 9000, e: env.swell(.02, .1), amp: .4 }));

// ---------- A · the setup: two streams at once ----------
at(.05, tone(.9, t => 90 + 700 * t * t, { type: 'sine', e: env.swell(.05, .2), amp: .6 }), .3, 0);   // the LED powers up
at(.5, shimmer(.9, [72, 76, 79, 84].map(note), .6, .07), .25, 0);   // the fan opens: a Wi-Fi chime
// Kartikeya's game (left): an arpeggio on the beat, lasers, pops — until it freezes
for (let b = 0; b * .25 < FRZ_K - .9; b++) { const s = .9 + b * .25; at(s, blip(note([69, 72, 76, 81][b % 4] + (b % 16 >= 8 ? 2 : 0))), .12, -.55); }
for (let s = 1.0; s < FRZ_K; s += .5) at(s, tone(.09, t => 2200 - 9000 * t, { type: 'square', e: env.pluck(20), amp: .4 }), .08, -.5);   // pew
for (let s = 1.3; s < FRZ_K; s += 1 / 1.3) at(s, noise(.18, { lp: 2500, e: env.pluck(14) }), .12, -.5);   // pops
// Bappa's tutorial (right): a sizzle bed and the steamer, a modak plopping on the pile; his munching
at(.9, noise(FRZ_G - .9, { hp: 2500, lp: 9000, e: env.swell(.3, .05), amp: .25 }), .12, .55);
for (let s = 1.2; s < FRZ_G; s += 1.1) at(s, plink(note(79 + Math.floor(rnd() * 5))), .12, .5);
for (let s = 1.9; s < FRZ_G; s += 1.0) at(s, noise(.12, { lp: 1600, hp: 200, e: env.pluck(30), amp: .8 }), .2, .45);   // munch
at(2.75, shimmer(.6, [84, 88].map(note), .5, .1), .15, .5);   // love
// ---------- B · the buffer ----------
at(FRZ_K, slide(.35, 900, 250, .6), .3, -.5);   // the game winds down
for (let s = FRZ_K + .1; s < GRAB; s += .14) at(s, tock(), s < FRZ_G ? .08 : .12, s < FRZ_G ? -.5 : 0);   // tick, tick, tick (both, in sync)
for (const s of TAP_K) at(s, mixb(clang(1300, .4), click(1)), .3, -.5);   // shield on the headset: bonk
at(FRZ_G, slide(.35, 800, 200, .6), .3, .5);   // the video winds down
for (const s of TAP_G) at(s, mixb(click(1), tone(.06, 600, { e: env.pluck(60) })), .3, .5);   // trunk jabs
at(VR_UP, whoosh(.2, 800, 2400, .5), .25, -.5);
at(6.2, slide(.4, 300, 250, .5), .15, 0);   // slow head turns
at(GLARE[0], zap(GLARE[1] - GLARE[0]), .35, 0);
at(EYES_R, squeak(1500, 2200, .06), .25, 0);   // the eyes snap to the router
at(CROUCH, slide(.2, 500, 350, .4), .2, 0);
at(HOP[0], whoosh(.45, 500, 3500), .45, 0); at(HOP[0], slide(.4, 400, 1100, .5), .3, -.4); at(HOP[0] + .03, slide(.4, 450, 1200, .5), .3, .4);
at(HOP[1], thud(.7), .45, 0);
// ---------- C · the tug-of-war ----------
at(GRAB, clang(1800, .5), .35, -.3); at(GRAB + .08, noise(.25, { lp: 1200, hp: 150, e: env.pluck(12), amp: .8 }), .3, .3);   // hook; trunk wraps
for (const s of KP) { at(s, whoosh(.18, 400, 1800, .8), .3, -.4); at(s + .05, tone(.3, t => 220 - 90 * t, { type: 'tri', e: env.pluck(10) }), .35, -.3); at(s + .08, squeak(900, 600, .12, .5), .15, 0); }
for (const s of GP) { at(s, whoosh(.18, 400, 1800, .8), .3, .4); at(s + .05, tone(.3, t => 200 - 80 * t, { type: 'tri', e: env.pluck(10) }), .35, .3); at(s + .08, squeak(700, 480, .12, .5), .15, 0); }
for (let b = 0; b < 6; b++) at(9.1 + b * .25, blip(note([81, 84, 88][b % 3])), .1, -.55);   // his game, back for a beat
at(11.1, noise(.9, { hp: 2500, lp: 9000, e: env.swell(.05, .05), amp: .25 }), .1, .55);   // the sizzle, back for a beat
at(9.15, shimmer(.5, [79, 83].map(note), .5, .08), .12, -.4); at(11.6, shimmer(.5, [79, 83].map(note), .5, .08), .12, .4);   // smug
// all-out: straining, creaking stretch, a rising whine, sparks
at(ALL, tone(DARK - ALL, t => 180 + 60 * t * t, { type: 'saw', e: env.swell(.3, .02), amp: .3 }), .25, 0);
at(ALL, noise(DARK - ALL, { lp: t => 600 + 500 * t, hp: 100, e: env.swell(.3, .02), amp: .5 }), .2, 0);
for (let s = ALL; s < DARK; s += .22) at(s, tone(.12, t => 300 + 200 * Math.sin(t * 50), { type: 'saw', e: env.hann(), amp: .4 }), .15, (rnd() - .5));   // creak
at(ALL + .8, crackle(DARK - ALL - .8, .7), .3, 0);
for (let s = ALL + .4; s < DARK; s += .3) at(s, squeak(800 + rnd() * 400, 500, .1, .4), .12, rnd() > .5 ? -.4 : .4);   // grunts
// ---------- D · the blackout ----------
at(DARK, mixb(tone(.25, t => 1200 * Math.exp(-t * 18) + 60, { e: env.pluck(12) }), noise(.08, { lp: 5000, e: env.pluck(50) })), .55, 0);   // pfft — then silence
at(DARK + .9, tone(.3, 2400, { e: env.pluck(30), amp: .2 }), .08, 0);   // a cricket in the dark
at(DARK + 1.4, tone(.3, 2500, { e: env.pluck(30), amp: .2 }), .08, 0);
at(JIG, mixb(click(.8), boing(160)), .2, -.3);   // jiggle: nothing
at(ACC, zap(.35), .22, 0);
at(FOL, slide(.6, 400, 900, .4), .15, 0);   // eyes travel along the cord
at(WHIP[0] + .1, whoosh(.35, 600, 4000), .6, .3);
// ---------- E · the reveal ----------
at(WHIP[1] + .1, drone(4.6, 65, .8), .25, .3);   // Om: the alcove's hum
at(18.6, bell(note(79), 2.5, { k: 1.2 }), .22, .4);   // a temple bell as Shiva comes into view
at(LOWER[0], slide(.4, 700, 400, .4), .15, .3);
at(LOWER[0] + .1, noise(.4, { hp: 3500, lp: 11000, e: env.swell(.05, .25), amp: .8 }), .25, .35);   // Vasuki: hiss
at(LOWER[1], click(1), .3, .35);   // he takes it
at(SLURP[0], noise(SLURP[1] - SLURP[0], { lp: t => 800 + 2400 * Math.sin(Math.PI * t / .95), hp: 300, e: env.swell(.05, .1), amp: 1 }), .5, .3);   // SLURRRP
at(SLURP[0], slide(SLURP[1] - SLURP[0], 200, 900, .6), .25, .3);
for (let i = 0; i < 4; i++) at(SLURP[0] + (3 - i) * .06, click(1), .3, .3 - i * .2);   // the clips pop off the wall
at(DRAG, whoosh(THUD - DRAG, 300, 2500, 1), .5, -.5);   // the router and the boys come skidding in
at(DRAG + .1, noise(THUD - DRAG - .1, { hp: 1500, lp: 6000, e: env.swell(.1, .05), amp: .5 }), .3, -.3);   // skid
at(THUD, thud(1), .7, 0); at(THUD + .02, clang(500, .4), .2, 0);
for (const [i, s] of [THUD + .1, THUD + .22, THUD + .34].entries()) at(s, squeak(2300 + i * 300, 2900 + i * 300, .06), .12, -.2);   // dizzy birdies
at(GULP, tone(.25, t => 180 - 120 * t, { type: 'sine', e: env.pluck(8), amp: 1 }), .55, .3);   // GULP
at(GULP + .6, noise(.2, { lp: 3000, hp: 600, e: env.hann(), amp: .6 }), .2, .3);   // lip lick
at(JAW, mixb(squeak(900, 1800, .15), squeak(1100, 2100, .15)), .35, 0);   // !!
// ---------- F · the button ----------
at(PEEK, bell(note(96), .5, { k: 8 }), .3, .2);   // ting: one eye opens
at(PEEK, drone(1.2, 55, .8), .15, 0);
at(SNAP, whoosh(.15, 1000, 3000, .6), .3, 0); at(SNAP + .2, thud(.5), .3, .1);   // snap to it; Bappa plops down
at(SNAP + .05, boing(170), .3, -.2); at(SNAP + .1, boing(210), .25, .2);   // the antennas spring back
at(STING - .1, drone(3, 65, .6), .15, 0);
at(BPEEK, squeak(1200, 1500, .08, .5), .2, 0);   // a sneaky peek
at(SLIDE, slide(.3, 600, 400, .4), .15, .2);   // his eye slides over
at(SHUT, mixb(click(.8), squeak(1600, 1100, .1)), .3, 0);   // shut!
at(CRT[0], tone(.7, t => 3000 * Math.exp(-t * 5) + 80, { e: env.swell(.01, .3), amp: .5 }), .3, 0);   // the old-TV switch-off
at(CRT[0] + .45, noise(.25, { hp: 3000, lp: 9000, e: env.pluck(12), amp: .5 }), .2, 0);

write(args.out || 'assets/wifi_sfx.wav');
