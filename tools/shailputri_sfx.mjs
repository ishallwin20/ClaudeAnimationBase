// shailputri_sfx.mjs: the sound-effects cue list for "Why does Shailputri ride a bull?" (src/scenes/shailputri_bull.js),
// built with tools/sfx.mjs. The times are the scene's constants. Quiet and warm: Instagram's music goes on top.
//   node tools/shailputri_sfx.mjs [--out=assets/shailputri_sfx.wav]
import { track, env, tone, noise, bell, mixb, note, whoosh, rumble, plink, clang, squeak, click, thud, crackle, shimmer, drone, slide } from './sfx.mjs';

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
// the title card of shot B holds HOLD longer (as in the scene): every cue after it lands HOLD later
const HOLD = 1.8, { at: at0, write } = track(40.2 + HOLD), at = (t, ...a) => at0(t > 8.25 ? t + HOLD : t, ...a);

// the scene's times
const QMARK = 1.5, PAT = 2.3, SHAIL = 5.0, PUTRI = 6.7, HEART = [6.9, 8.0], TITLE = 8.2, WIPE_BC = 9.3;
const LOOK = 10.5, ROLL = [10.8, 11.4], IMPACT = 11.4, BURST = 11.55, SNORT = 12.3, WIND = [12.6, 14.6], W_STAB = 13.2, BIRD_IN = [13.0, 13.8],
  CHIRP = 14.8, LAPSE = [15.0, 17.2], W_STEAD = 15.6, SHE_IN = [17.4, 18.3];
const SHAKE = 18.9, STOMP = 19.2, PALM = 19.8, TOUCH = 20.6, BOW = [21.0, 21.7], SWIRL = [22.2, 22.8], RIDE = 23.1, ARCH_IRIS = [26.4, 27.0];
const LIGHT0 = 28.2, LIGHT_STEP = .3, FIRST = 30.6, Q_TRISHUL = 32.8, Q_LOTUS = 33.3, WINK = 33.7, WIPE_EF = 33.9;
const CARD = { book: 34.5, fan: 35.0, logo: 35.5, series: 35.9, sub: 36.3, pill: 36.7, follow: 37.3 };
// the ride's hoof-falls, as in the scene (rideT)
const RATE = 1.15, rd = a => a - .4 * (1 - Math.exp(-a / .4));
const rideT = d => { let lo = 0, hi = 12; for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; if (rd(m) < d) lo = m; else hi = m; } return RIDE + lo; };

const ting = (m = 88, d = 1.2) => bell(note(m), d, { partials: [[1, 1], [2.7, .35], [5.2, .12]], k: 5 });   // Nandi's bell
const snort = () => noise(.32, { lp: 900, hp: 120, e: env.ad(.03, .1), amp: 1 });
const chirp = () => tone(.09, t => 3200 + 1800 * Math.sin(t * 70), { e: env.hann(), amp: .7 });
const hoof = () => mixb(click(.5), tone(.12, t => 150 * Math.exp(-t * 14) + 60, { e: env.pluck(22), amp: .8 }));
const PENTA = [72, 74, 76, 79, 81, 84, 86, 88];

// ---------- A · the hook ----------
at(.05, ting(88), .3, .1); at(.1, shimmer(.8, [76, 83].map(note), .5, .12), .15, 0);
at(QMARK, plink(note(81)), .3, .35); at(QMARK + .12, plink(note(86)), .25, .35);
for (const s of [PAT + .2, PAT + .5]) at(s, tone(.08, 220, { e: env.pluck(40) }), .25, .1);
at(PAT + .25, ting(91, .7), .15, .2);
// ---------- B · who she is ----------
at(3.1, whoosh(1.8, 1800, 350, .6), .22, 0);   // the pull back
at(4.75, shimmer(.8, [84, 88, 91].map(note), .6, .07), .22, 0);   // the summit glints
at(SHAIL, mixb(plink(note(72)), bell(note(60), 1.4)), .3, 0);
at(PUTRI, plink(note(76)), .3, -.1);
at(HEART[0], shimmer(1, [79, 83, 86, 91].map(note), .5, .16), .2, 0);
at(TITLE, mixb(plink(note(79)), bell(note(67), 1.4)), .3, 0);
at(WIPE_BC, whoosh(.6, 600, 3200), .4, 0);
// ---------- C · the bull ----------
at(LOOK, squeak(1400, 2100, .07), .25, .2);
at(ROLL[0] - .25, rumble(.85, 1), .45, .5);
at(IMPACT, thud(1), .7, .3); at(IMPACT, clang(180, .6), .3, .3); at(IMPACT + .02, crackle(.35, .8), .35, .3);
at(BURST, crackle(.5, 1), .4, .4); at(BURST, whoosh(.4, 900, 2600), .25, .5);
for (let i = 0; i < 3; i++) at(BURST + .55 + i * .12, tone(.06, 300 - i * 40, { e: env.pluck(50) }), .2, .2 + i * .15);   // pebbles land
at(IMPACT + .05, plink(note(67)), .35, 0);   // STRENGTH stamps
at(SNORT, snort(), .35, .2);
at(WIND[0] - .1, noise(WIND[1] - WIND[0] + .5, { lp: t => 900 + 700 * Math.sin(t * 2.2), hp: 250, e: env.swell(.5, .7), amp: 1 }), .4, .2);
at(WIND[0] + .1, whoosh(1.2, 500, 2400, .7), .25, .5); at(WIND[0] + 1, whoosh(1, 2200, 600, .7), .2, -.3);
at(W_STAB, plink(note(69)), .35, 0);
at(BIRD_IN[0] + .1, slide(.6, 2600, 1500, .5), .15, .6); at(BIRD_IN[1], squeak(2000, 2800, .06), .25, .1);
at(CHIRP, chirp(), .3, .1); at(CHIRP + .16, chirp(), .3, .1);
at(LAPSE[0], tone(1, t => 520 - 260 * t, { e: env.swell(.2, .4), amp: .5 }), .15, 0);   // the sun goes down
at(LAPSE[0] + .7, drone(1.4, note(45), .7), .22, 0);   // night
for (let i = 0; i < 5; i++) at(15.75 + i * .2, plink(note(91 - i * 2), .4), .1, -.4 + i * .2);   // stars
at(W_STEAD, plink(note(71)), .35, 0);
at(16.5, tone(.8, t => 260 + 300 * t, { e: env.swell(.3, .3), amp: .5 }), .15, 0);   // the sun comes up
at(16.9, shimmer(.8, [72, 76, 79].map(note), .5, .1), .18, -.3);
for (let i = 0; i < 4; i++) { at(SHE_IN[0] + .1 + i * .22, tone(.05, 180, { e: env.pluck(60) }), .15, .6 - i * .1); at(SHE_IN[0] + .16 + i * .22, plink(note(96), .4), .08, .6 - i * .1); }
at(SHE_IN[0] + .5, chirp(), .22, 0);
// ---------- D · the deeper meaning ----------
at(SHAKE, whoosh(.35, 500, 3000), .45, -.2); at(SHAKE + .02, crackle(.45, 1), .35, -.2);
at(STOMP, thud(1), .75, -.1); at(STOMP, rumble(.45, .8), .35, 0);
at(STOMP + .1, snort(), .4, 0);
at(SHAKE + .05, slide(.5, 1800, 3000, .4), .12, .4);   // the bird takes off
at(PALM + .2, shimmer(1.1, [72, 76, 79, 84, 88].map(note), .6, .13), .25, .3);
at(TOUCH, ting(84, 1.6), .35, .1);
at(BOW[0], slide(.6, 300, 150, .5), .2, -.1); at(BOW[1] - .05, thud(.5), .3, -.1);
at(SWIRL[0], shimmer(1.2, [76, 79, 83, 88, 91, 95].map(note), .7, .07), .3, 0); at(SWIRL[0], whoosh(.7, 800, 4000, .6), .25, 0);
at(RIDE, drone(3.6, note(48), .6), .18, 0); at(RIDE, drone(3.6, note(55), .4), .12, 0);
for (let m = 0; m < 12; m++) {
  const tn = rideT((m * .5 + .25) / RATE); if (tn > ARCH_IRIS[0] + .3) break;
  at(tn, hoof(), .2, m % 2 ? .1 : .2);
  at(tn + .08, plink(note(PENTA[m % 8]), .7), .2, .2);   // a flower blooms
  if (m % 2 === 0) at(tn + .02, ting(88, .6), .1, .25);
}
at(ARCH_IRIS[0], whoosh(.6, 2400, 500), .3, 0);
// ---------- E · nine nights ----------
at(27.0, drone(5, note(50), .5), .16, 0);
at(27.3, whoosh(.9, 1500, 400, .5), .18, 0);
for (let i = 0; i < 8; i++) { const s = LIGHT0 + i * LIGHT_STEP; at(s, plink(note(PENTA[i])), .3, -.4 + (i % 3) * .4); at(s + .02, noise(.08, { hp: 3000, e: env.pluck(40), amp: .5 }), .1, 0); }
at(FIRST, shimmer(1.2, [72, 76, 79, 84].map(note), .7, .05), .3, -.3); at(FIRST, bell(note(60), 1.8), .2, -.3);
at(32.4, whoosh(.6, 600, 1800, .5), .18, -.2);
at(Q_TRISHUL - .1, mixb(plink(note(84)), clang(900, .3)), .25, -.3);
at(Q_LOTUS - .1, plink(note(88)), .25, 0); at(Q_LOTUS, shimmer(.4, [91].map(note), .4), .12, 0);
at(WINK, squeak(1800, 2600, .05), .2, -.2);
at(WIPE_EF, whoosh(.6, 600, 3200), .4, 0);
// ---------- F · the book ----------
at(CARD.book, mixb(thud(.5), plink(note(72))), .35, 0);
at(CARD.fan, whoosh(.25, 900, 2400, .6), .2, -.4); at(CARD.fan + .05, whoosh(.25, 900, 2400, .6), .2, .4);
at(CARD.logo, ting(84, 1.4), .3, 0);
at(CARD.series, plink(note(76)), .22, 0); at(CARD.sub, plink(note(79)), .22, 0);
at(CARD.pill, shimmer(1.2, [76, 79, 84, 88].map(note), .7, .06), .32, 0);
at(CARD.follow, plink(note(84)), .2, 0);
at(38.6, ting(88, 1.5), .12, 0);

write(args.out || 'assets/shailputri_sfx.wav');
