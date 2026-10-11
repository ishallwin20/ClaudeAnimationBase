// shiva_cine_sfx.mjs: the sound bed for the cinematic Shiva reel (src/scenes/shiva_cine.js). No voice, no music: the
// sound tells the story under the captions. Times match TL in the scene.
//   Kailash: wind, a far and a close thunderclap, a damru roll for "Tandava", a boom as his eyes open, the third eye's fire.
//   The yagna: fire, a temple drone, a drum hit on Daksha's insult, the guests' laughter, her heartbeat, the fire's roar.
//   The Rudra Tandava: a stamp on every step, thunder, a frantic damru, the earth cracking. The chakra whirs and strikes.
//   The Shakti Peethas: a small bell for each of the 51 lights. Silence and wind; a conch for Shailputri; bells and the
//   damru for the dance of joy; a chime for the card.
//   node tools/shiva_cine_sfx.mjs   → assets/shiva_cine_sfx.wav
import { track, tone, noise, bell, mixb, whoosh, crackle, env, note, seed, rnd, lerp, thunder, damru, wind, drum, fire, om, conch, laughter, heart, whir, chime, chirp } from './sfx.mjs';

const TL = { strike1: 2.75, tandava: 4.15, strike2: 6.35, eyes: 8.85, third: 9.5, white: 10.45, yagna: 10.7, point: 15.8, laugh: 17.9,
  walk: 22.2, burn: 24.75, rudra: 25.3, chakra: 32.8, hit: 35.4, peethas: 35.9, medit: 41.4, shail: 44.2, name: 46.6, joy: 49.0, card: 56.8, end: 62.0 };
const T = track(TL.end);
seed(7);

// ---------- instruments (the rest are shared, in sfx.mjs) ----------
const roll = (t0, dur, rate, f, amp) => { for (let i = 0; i < dur * rate; i++) T.at(t0 + i / rate + (rnd() - .5) * .008, damru(f * (i % 2 ? 1.12 : 1), amp * (.7 + .3 * Math.sin(i * .9))), 1, (i % 2 ? .25 : -.25)); };
const hash = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };   // the scene's hash, for matching times

// ---------- Kailash (0–10.7) ----------
T.at(0, wind(TL.yagna, 0), .22, -.5); T.at(0, wind(TL.yagna, 2), .22, .5);
T.at(0, tone(TL.white, t => note(33) + .6 * Math.sin(t * 2), { e: (t, D) => Math.min(1, t / 2) * lerp(.4, 1, t / D) * Math.min(1, (D - t) / .3), amp: 1 }), .3);
T.at(0, tone(TL.white, t => note(40) + .5 * Math.sin(t * 1.4), { type: 'tri', e: (t, D) => Math.min(1, t / 3) * lerp(.2, 1, t / D) * Math.min(1, (D - t) / .3), amp: 1 }), .1);
T.at(TL.strike1, thunder(2.6, .5), .5, -.4);
T.at(TL.strike2, thunder(3.2, 1), .75, .4);
roll(TL.tandava - .05, 1.3, 14, 230, .32);
T.at(TL.eyes, mixb(tone(1.6, t => 55 * Math.exp(-t * .8) + 30, { e: env.ad(.01, .5), amp: 1 }), whoosh(.5, 900, 120, .5)), .7);
T.at(TL.third - .2, whoosh(1.2, 200, 3000, 1), .4);
T.at(TL.third, noise(TL.white - TL.third + .3, { hp: 600, lp: t => 2000 + 4000 * t, e: env.swell(.6, .1), amp: 1 }), .3);
T.at(TL.third, crackle(TL.white - TL.third + .3, 1), .25);
T.at(TL.white - .25, whoosh(.5, 300, 6000, 1), .6);

// ---------- the yagna (10.7–25.3) ----------
T.at(TL.yagna, fire(TL.burn - TL.yagna, .35, 1), .3);
T.at(TL.yagna, om(TL.walk - TL.yagna, 110, 1), .16, -.2); T.at(TL.yagna + .4, om(TL.walk - TL.yagna - .4, 165, 1), .08, .2);
T.at(TL.yagna + .3, chime(note(76), .8, 2.5), .14, .3);
T.at(TL.point, drum(52, 1, 1.4), .7);                               // the insult
T.at(TL.point + .02, noise(.8, { brown: true, lp: 200, e: env.pluck(4), amp: 1 }), .4);
T.at(TL.laugh, laughter(2.6, 1), .28, -.3); T.at(TL.laugh + .15, laughter(2.4, 1), .24, .3);
for (let i = 0; i < 4; i++) T.at(TL.walk + .2 + i * .62, heart(1), .5 - i * .05);   // her heartbeat, as she walks
T.at(TL.walk + 1.2, noise(TL.burn - TL.walk - 1.2 + .2, { brown: true, lp: t => 300 + 900 * t, e: env.swell(1, .05), amp: 1.4 }), .45);   // the fire rises
T.at(TL.burn - .3, whoosh(.7, 200, 5000, 1), .7);
T.at(TL.burn, mixb(drum(40, 1, 2.2), thunder(2.5, .8)), .8);
T.at(TL.burn + .2, tone(2.2, 2093, { e: env.ad(.02, .9), amp: 1 }), .05);   // the ringing silence after

// ---------- the Rudra Tandava (25.3–32.8) ----------
for (let n = 0; n < 7; n++) { const t0 = TL.rudra + (n + .7) * 1.1; if (t0 > TL.chakra + .2) break; T.at(t0, mixb(drum(42, 1, 1.1), noise(.5, { brown: true, lp: 160, e: env.pluck(5), amp: 1.2 })), .75, n % 2 ? .25 : -.25); }
roll(TL.rudra + .3, TL.chakra - TL.rudra, 16, 250, .26);
T.at(26.2, thunder(2.4, .9), .6, -.5); T.at(28.9, thunder(2.6, 1), .65, .5); T.at(31.3, thunder(2.4, 1), .65, -.2);
T.at(TL.rudra + .8, noise(TL.chakra - TL.rudra + 3.5, { brown: true, lp: 120, e: env.swell(1.5, 1), amp: 1.4 }), .35);   // the earth groaning
for (let i = 0; i < 9; i++) { const t0 = TL.rudra + hash(i * 3.3 + 3) * 6; T.at(t0, whoosh(.8, 2400, 500, .7), .14, (hash(i * 5.1 + 3) - .5) * 1.6); }   // meteors (same times as the scene's)

// ---------- the Sudarshan chakra (32.8–35.9) ----------
T.at(TL.chakra + .3, whir(TL.hit - TL.chakra - .3, 1), .16, .6);
T.at(TL.chakra + .3, whoosh(TL.hit - TL.chakra - .3, 300, 4000, 1), .3, .4);
T.at(TL.hit, mixb(bell(note(88), 3, { partials: [[1, 1], [2.32, .6], [3.87, .4], [5.9, .25]], k: 1.4 }), drum(36, 1, 2)), .65);

// ---------- the Shakti Peethas (35.9–41.4): a bell for each of the 51 lights, the same landing times as the scene ----------
const PENTA = [0, 2, 4, 7, 9];
for (let i = 0; i < 51; i++) {
  const L = Math.min(3, Math.floor(hash(i * 3.1 + 1) * 4)), x = 50 + hash(i * 7.7) * 980, tl = TL.peethas + .7 + i / 51 * 3.4 + (hash(i * 9.9) - .5) * .25;
  T.at(tl, chime(note(79 + PENTA[i % 5] + 12 * (i % 3 === 0)), 1, 1.6), .09 + .04 * L, (x - 540) / 540 * .8);
}
T.at(TL.peethas, om(TL.medit - TL.peethas + .4, 98, 1), .14);
T.at(TL.peethas, noise(TL.medit - TL.peethas, { hp: 3000, lp: 9000, e: env.swell(1, 1), amp: 1 }), .03);

// ---------- meditation (41.4–44.2): wind and a long low Om ----------
T.at(TL.medit, wind(TL.shail - TL.medit + .6, 4, .6), .3, -.4); T.at(TL.medit, wind(TL.shail - TL.medit + .6, 6, .6), .3, .4);
T.at(TL.medit, om(TL.shail - TL.medit + 1, 73, 1), .3);

// ---------- Shailputri at dawn (44.2–49.0) ----------
for (let i = 0; i < 9; i++) T.at(TL.shail + .6 + i * .5 + rnd() * .2, chirp(1), .05 + rnd() * .04, (rnd() - .5) * 1.4);
T.at(TL.name - .2, conch(2.6, 311, 1), .3);
T.at(TL.name, chime(note(81), 1, 3), .2, .2);

// ---------- the dance of joy (49.0–56.8) ----------
T.at(TL.joy, bell(note(69), 4, { partials: [[1, 1], [2.4, .5], [3.9, .3], [5.2, .2], [6.8, .1]], k: .7 }), .45);
T.at(TL.joy, bell(note(38), 4.5, { partials: [[1, 1], [2.1, .5], [3.3, .25]], k: .5 }), .45);
for (let b = 0; b < 14; b++) { const t0 = TL.joy + 1.1 + b * .5; if (t0 > TL.card - .2) break; T.at(t0, damru(240, .75), 1, -.2); T.at(t0 + .125, damru(270, .45), 1, .2); if (b % 2) T.at(t0 + .25, damru(240, .55), 1, -.2); }
T.at(TL.joy, crackle(TL.card - TL.joy, 1), .1);
for (let i = 0; i < 3; i++) T.at(TL.joy + 2.6 + i * 2.2, chime(note(84 - i * 3), 1, 2), .1, (i - 1) * .5);

// ---------- the card (56.8–62.0) ----------
for (let i = 0; i < 6; i++) T.at(TL.card + .3 + i * .09, chime(note([72, 76, 79, 84, 88, 91][i]), 1, 1.8), .12, (i - 2.5) * .2);
T.at(TL.card + 1.65, chime(note(84), 1, 2.5), .16);
T.at(TL.card, om(TL.end - TL.card, 110, 1), .14); T.at(TL.card, om(TL.end - TL.card, 165, 1), .06);
T.write('assets/shiva_cine_sfx.wav');
