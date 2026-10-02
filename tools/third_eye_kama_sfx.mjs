// third_eye_kama_sfx.mjs: the sound-effects cue list for "What happens if Shiva opens his third eye?"
// (src/scenes/third_eye_kama.js), built with tools/sfx.mjs. The times are the scene's constants. Dark and low under the
// hook and the strike, bright and plucky for Kama's spring, one beat of real silence before the eye opens. Instagram's
// music goes on top, so it stays quiet and leaves room.
//   node tools/third_eye_kama_sfx.mjs [--out=assets/third_eye_kama_sfx.wav]
import { track, env, tone, noise, bell, mixb, note, whoosh, rumble, plink, clang, squeak, click, thud, crackle, shimmer, drone, slide } from './sfx.mjs';

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const { at, write } = track(47.5);

// the scene's times
const B0 = 3.4, CU = 15.9, E0 = 17.3, H0 = 40.1, CARD0 = 41.6;
const FLARE = 1.5, VAS = 1.7, CRACK = 2.6, RED_FULL = 3.25;
const GODS = 4.7, SWOOP = [6.6, 7.7], HOP = [7.75, 8.15];
const WINK = 8.95, SNAP = 9.5, SPRING = [9.55, 11.0], AIM = [11.7, 12.3], DRAW = [12.4, 13.6], SNAKE_EYE = 12.8, RELEASE = 13.9;
const HIT = 14.45, HUH = 15.0, PUSH = [15.45, 15.9], OPEN = 16.6, FIRE = 17.05;
const ASH = 17.85, FLEE = [17.5, 18.5], ASH_CAP = 19.2;
const F0 = 21.2, NEVER = 21.6, CLOSE3 = [23.4, 24.1], ANGER = 24.1, ILLUSION = 26.1, REAL = 29.3, GLINT = 29.8, PEEK = 31.7;
const G0 = 34.4, HEART = [34.7, 36.0], BURST = 36.0, TAPAS = 37.4, GOLD_FLASH = [39.75, 40.1];
const GOLD = 40.75, ALMOND = [41.0, 41.6];
const CARD = { book: 41.8, fan: 42.2, logo: 42.85, series: 43.2, sub: 43.6, pill: 44.0, follow: 44.6 };

// sounds of this film
const heart = (amp = 1) => mixb(tone(.22, t => 62 * Math.exp(-t * 4) + 38, { e: env.pluck(14), amp }), noise(.08, { lp: 220, e: env.pluck(30), amp: amp * .5 }));   // a heartbeat thump
const beat = (t0, g = .5) => { at(t0, heart(), g, 0); at(t0 + .22, heart(.7), g, 0); };
const flap = () => noise(.09, { lp: 1800, hp: 300, e: env.hann(), amp: 1 });
const squawk = () => mixb(tone(.32, t => 1300 + 500 * Math.sin(t * 40), { type: 'saw', e: env.ad(.01, .1), fm: t => .02 * Math.sin(t * 380), amp: .5 }), noise(.3, { hp: 1500, lp: 5000, e: env.ad(.01, .08), amp: .5 }));
const buzz = (dur) => tone(dur, t => 220 + 12 * Math.sin(t * 9), { type: 'saw', e: env.swell(.2, .3), fm: t => .01 * Math.sin(t * 160), amp: .35 });
const creak = (dur) => tone(dur, t => 180 + 140 * t / dur, { type: 'saw', e: env.swell(.1, .1), fm: t => .02 * Math.sin(t * 90), amp: .25 });
const twang = () => mixb(tone(.6, t => 196 * (1 + .03 * Math.exp(-t * 20)), { type: 'tri', e: env.pluck(7), amp: 1 }), tone(.4, 392, { e: env.pluck(10), amp: .3 }));
const roar = (dur, amp = 1) => mixb(noise(dur, { lp: t => 900 + 500 * Math.sin(t * 7), hp: 60, brown: true, e: env.swell(.05, dur * .6), amp }), noise(dur, { lp: 3000, hp: 800, e: env.swell(.05, dur * .5), amp: amp * .25 }));
const boom = () => mixb(thud(1), tone(1.6, t => 55 * Math.exp(-t * .8) + 30, { e: env.ad(.005, .6), amp: .9 }));
const PENTA = [72, 74, 76, 79, 81, 84, 86, 88, 91];

// ---------- A · the hook ----------
at(0, drone(3.5, note(38), .8), .35, 0);
beat(.15, .45); beat(1.05, .5);
at(FLARE, rumble(1.3, .8), .3, 0); beat(FLARE + .45, .6); beat(FLARE + .9, .65);
at(VAS, mixb(noise(.35, { hp: 3000, lp: 9000, e: env.hann(), amp: .6 })), .25, -.4);   // Vasuki hisses
at(CRACK, slide(.6, 120, 900, .6), .2, 0); at(CRACK + .1, crackle(.5, .7), .3, 0);
at(CRACK + .3, whoosh(.7, 300, 3800, .9), .4, 0);
// ---------- B · the gods' plan ----------
at(B0, whoosh(.8, 3000, 400, .6), .3, 0);   // the eye-iris opens on Kailash
at(B0 + .2, noise(4.5, { lp: 700, hp: 150, e: env.swell(1, 1.5), amp: 1 }), .12, -.2);   // night wind
at(GODS + .3, bell(note(62), 2), .16, -.4); at(GODS + .35, bell(note(69), 2), .1, -.4);   // her offering
for (let i = 0; i < 9; i++) at(SWOOP[0] + i * .12, flap(), .25 * (.5 + i / 18), .7 - i * .06);   // wings, swooping in
at(SWOOP[0], whoosh(1.1, 600, 2600, .7), .3, .7);
at(SWOOP[0] + .3, shimmer(.6, [84, 88, 91].map(note), .4, .08), .12, .6);
at(SWOOP[1] - .05, squawk(), .22, .6);
at(HOP[0], slide(.3, 500, 900, .4), .15, .5); at(HOP[1], thud(.4), .3, .45);
// ---------- C · the false spring ----------
at(WINK + .1, mixb(click(.6), plink(note(88), .6)), .3, .4);
at(SNAP, mixb(click(1), noise(.05, { hp: 2500, e: env.pluck(90), amp: 1 })), .45, .4);
for (let i = 0; i < 9; i++) at(SPRING[0] + .05 + i * .14, plink(note(PENTA[i])), .26, .4 - i * .1);   // flowers pop outward
at(SPRING[0] + .1, shimmer(1.4, [72, 76, 79, 84, 88, 91].map(note), .6, .12), .2, 0);
at(SPRING[0] + .3, squawk(), .12, .7);
at(SPRING[0] + .6, buzz(3.2), .1, -.2); at(SPRING[0] + 1.5, buzz(2.8), .07, .3);
at(SPRING[0] + .2, drone(4, note(60), .5), .1, 0);   // a warm, too-sweet pad under it
at(AIM[0], whoosh(.4, 500, 1500, .5), .2, .4);
at(SNAKE_EYE, squeak(900, 700, .1), .12, -.3);
at(DRAW[0], creak(DRAW[1] - DRAW[0] + .2), .35, .3);
beat(12.6, .25); beat(13.2, .3);
at(RELEASE, twang(), .5, .3); at(RELEASE + .02, whoosh(.55, 800, 3200, .7), .32, 0);
// ---------- D · the strike ----------
at(HIT, mixb(thud(.3), noise(.3, { hp: 1500, lp: 6000, e: env.ad(.005, .1), amp: .6 })), .35, -.2);
at(HIT + .05, shimmer(.6, [91, 88, 84].map(note), .5, .07), .18, -.2);
// … then nothing at all for a beat: the silence is the read
at(HUH, squeak(900, 1300, .14), .12, .4);   // Kama's "?"
at(PUSH[0], whoosh(.5, 300, 1200, .6), .22, 0);
at(CU, drone(1.6, note(31), 1), .4, 0); at(CU, rumble(.75, 1), .22, 0);
beat(CU + .05, .7); beat(CU + .45, .8);   // the heart, then
at(OPEN, boom(), .7, 0); at(OPEN, clang(110, .8), .25, 0); at(OPEN + .02, crackle(.4, 1), .3, 0);
at(FIRE, roar(1.4, 1), .55, .3); at(FIRE, whoosh(.5, 400, 3000), .45, .5);
// ---------- E · ash ----------
at(E0, crackle(1.6, 1), .35, .4); at(E0 + .05, roar(2, .9), .45, .4);
at(E0 + .1, squeak(700, 1500, .18), .15, .4);   // Kama's gasp
at(FLEE[0] - .1, squawk(), .3, .6); for (let i = 0; i < 7; i++) at(FLEE[0] + i * .09, flap(), .2, .6 + i * .05);
at(E0 + .3, whoosh(1.4, 2000, 300, .8), .3, 0);   // the wave of fire sweeping the spring away
at(ASH, thud(.35), .18, .4); at(ASH + .4, crackle(1.2, .5), .12, .4);
at(18.9, noise(3.5, { lp: 600, hp: 120, e: env.swell(1, 1.5), amp: 1 }), .12, 0);   // the wind comes back
at(ASH_CAP, bell(note(45), 2.4), .18, 0);
// ---------- F · the twist ----------
at(F0, drone(10.5, note(43), .6), .14, 0);
at(NEVER + .35, bell(note(74), 2), .18, -.2);
at(CLOSE3[0], slide(.7, 700, 400, .3), .1, 0);
at(ANGER, mixb(bell(note(50), 2.2), bell(note(57), 2.2)), .25, 0);
at(ILLUSION, whoosh(1, 1400, 400, .5), .14, 0); at(ILLUSION + .2, shimmer(1.4, [79, 76, 72, 67].map(note), .5, .18), .12, 0);
at(REAL + .55, bell(note(62), 2), .2, 0);
at(GLINT, shimmer(.6, [91, 96].map(note), .6, .06), .22, 0);
at(PEEK + .05, mixb(squeak(900, 1500, .1), click(.5)), .3, 0);
at(PEEK + .3, plink(note(79)), .2, 0); at(PEEK + .45, plink(note(84)), .2, 0);
// ---------- G · after ----------
at(G0, whoosh(.7, 1500, 500, .5), .2, 0);
at(HEART[0], drone(2.5, note(57), .5), .14, .3);
at(HEART[0] + .1, shimmer(1.2, [76, 79, 84, 88].map(note), .5, .25), .18, .3);
at(BURST, shimmer(1, [88, 91, 96, 100, 103].map(note), .6, .05), .26, 0);
at(TAPAS, bell(note(55), 3), .25, -.3); at(TAPAS + .05, drone(2.6, note(48), .7), .18, -.3);
at(GOLD_FLASH[0], whoosh(.6, 600, 3600, .6), .28, 0);
// ---------- H · the blessing, the card ----------
at(H0 + .35, plink(note(84)), .18, 0);
at(GOLD - .1, mixb(bell(note(72), 2.4), bell(note(79), 2.4)), .3, 0);
at(GOLD, shimmer(1.2, [72, 76, 79, 84, 88, 91].map(note), .7, .07), .26, 0);
at(ALMOND[0], whoosh(.7, 400, 4000, .7), .32, 0);
at(CARD.book, mixb(thud(.5), plink(note(72))), .35, 0);
at(CARD.fan, whoosh(.25, 900, 2400, .6), .2, -.4); at(CARD.fan + .05, whoosh(.25, 900, 2400, .6), .2, .4);
at(CARD.logo, bell(note(84), 1.4), .25, 0);
at(CARD.series, plink(note(76)), .22, 0); at(CARD.sub, plink(note(79)), .22, 0);
at(CARD.pill, shimmer(1.2, [76, 79, 84, 88].map(note), .7, .06), .32, 0);
at(CARD.follow, plink(note(84)), .2, 0);
at(46, bell(note(88), 1.5), .1, 0);

write(args.out || 'assets/third_eye_kama_sfx.wav');
