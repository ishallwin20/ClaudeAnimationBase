// durgama_sfx.mjs: the sound effects for ad 19 (src/scenes/durgama.js), under the Lyria score. Times match TL in the
// scene. Then it mixes the score (assets/durgama_score.mp3, Lyria take 1 of 3: it hits at 0, hushes at 52–54 s for the
// drawn bow and lands its biggest hit at 56.0, the five arrows in the heart) under the effects.
//   The hook: storm, a conch for her. The boon: an Om, the lotus chimes, the mantras whooshing into him. The yagna: fire
//   that dies. The drought: hot wind, the sun passing. The prayer: cold wind; she comes (a swell, a bell, a conch). The
//   eyes: a sparkle for each eye. The tears: drops, then rain. The rivers: rain and running water, birds. The war: the
//   march, roars, the ring of light, the burst (a boom, a whoosh per goddess, a chime per name), clashes. The bow: a
//   tick for each of the fifteen arrows, the twang, the hits, the heart, the fall. Dawn: the Vedas given back, DURGA.
//   node tools/durgama_sfx.mjs   → assets/durgama_sfx.wav and assets/durgama_mix.wav
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { track, tone, noise, bell, mixb, whoosh, crackle, env, note, seed, rnd, thunder, wind, drum, fire, om, conch, chime, chirp, clang, roar, rockfall, heart } from './sfx.mjs';

const TL = { hook: 0, boon: 4.6, wish: 7.1, vedas: 9.4, forgot: 11.7, drought: 13.8, years: 16.2, pray: 18.6, came: 21.2,
  eyes: 22.6, name1: 25.0, tears: 26.8, nine: 29.2, rivers: 31.4, feed: 33.8, attack: 36.2, ring: 39.2, alone: 41.6,
  shaktis: 43.2, burst: 43.6, names: 45.4, war: 47.6, arrows: 50.2, count: 51.0, release: 54.0, heart: 56.0, fall: 57.0,
  name: 58.0, said: 61.6, durga: 63.4, ask: 65.0, card: 68.2, end: 73.2 };
const ARROW_T = (i) => TL.count + i * .2, HITS = { flag: 54.4, eyes: 54.7, arms: 55.0 };
const T = track(TL.end);
seed(19);
const pent = [0, 2, 4, 7, 9];
const thunk = (amp = 1) => mixb(drum(70, amp, .25), noise(.08, { hp: 600, lp: 4000, e: env.pluck(50), amp: amp * .8 }), tone(.12, t => 900 - 4000 * t, { e: env.pluck(30), amp: amp * .3 }));
const drop = (f) => tone(.14, t => f * (1 + 1.2 * t), { e: env.pluck(30), amp: 1 });   // a water drop: a short rising blip

// ---------- the hook (0–4.6) ----------
T.at(0, mixb(drum(36, 1, 1.8), noise(.6, { brown: true, lp: 200, e: env.pluck(4), amp: 1.2 })), .6);
T.at(0, wind(TL.boon + .4, 0, .6), .2, -.5); T.at(0, wind(TL.boon + .4, 2, .6), .2, .5);
T.at(.15, conch(2.2, 311, 1), .2);
T.at(1.2, thunder(2.6, .8), .45, -.5); T.at(3.6, thunder(2.4, .9), .45, .5);
T.at(2.5, drum(44, 1, 1.1), .4);
T.at(3.4, whoosh(.35, 3000, 600, 1), .3, -.4); T.at(3.72, thunk(1), .4, .3);   // an arrow, teased

// ---------- the boon (4.6–9.4) ----------
T.at(TL.boon, om(TL.vedas - TL.boon + .5, 73, 1), .26);
for (let i = 0; i < 6; i++) T.at(TL.boon + .2 + i * .22, chime(note(76 + pent[i % 5] + (i > 4 ? 12 : 0)), .8, 2.5), .1, (i % 2 ? .3 : -.3));   // the lotus opens
T.at(TL.wish - .2, whoosh(2.4, 300, 3000, 1), .22);
for (let i = 0; i < 22; i++) T.at(TL.wish + .1 + rnd() * 2.1, whoosh(.5, 3500, 900, .6), .07, rnd() * 1.6 - .8);   // mantras flying in
T.at(TL.wish + 1.4, tone(1.6, note(38), { type: 'saw', e: env.swell(.6, .8), amp: .5 }), .1);   // his power grows
T.at(TL.vedas - .3, drum(42, 1, 1.2), .4);

// ---------- the yagna dies (9.4–13.8) ----------
T.at(TL.vedas, fire(TL.drought - TL.vedas, 1, .1), .32);
T.at(TL.vedas + .2, crackle(3, 1), .08);
for (let i = 0; i < 14; i++) T.at(TL.vedas + .2 + rnd() * 2.6, whoosh(.6, 1200, 4000, .6), .06, rnd() * 1.6 - .8);   // mantras leaving
T.at(TL.forgot, mixb(drum(40, 1, 1.4), bell(note(45), 3, { partials: [[1, 1], [2.4, .4], [3.9, .2]], k: 1 })), .4);
T.at(TL.drought - 1.2, noise(1.2, { hp: 2000, lp: 7000, e: env.ad(.02, .5), amp: 1 }), .06);   // the fire hisses out

// ---------- the drought (13.8–18.6) ----------
T.at(TL.drought - .2, wind(TL.pray - TL.drought + .6, 4, 1), .3, -.5); T.at(TL.drought - .2, wind(TL.pray - TL.drought + .6, 5, 1), .3, .5);
T.at(TL.drought, tone(TL.pray - TL.drought, t => note(33) + .4 * Math.sin(t * 2), { e: env.swell(.8, .8), amp: 1 }), .1);
T.at(TL.drought + .3, noise(4, { hp: 3000, lp: 9000, e: env.swell(1, 1), amp: 1 }), .03);   // heat shimmer
for (let i = 0; i < 4; i++) T.at(TL.years - .2 + i * .77, whoosh(.8, 300, 1500, 1), .14, -.6 + i * .4);   // the sun passing, year after year
T.at(TL.years, drum(40, 1, 1.6), .45);

// ---------- the prayer (18.6–22.6) ----------
T.at(TL.pray - .2, wind(TL.eyes - TL.pray + .6, 7, .8), .22, -.5); T.at(TL.pray - .2, wind(TL.eyes - TL.pray + .6, 8, .8), .22, .5);
T.at(TL.pray, om(TL.eyes - TL.pray, 98, 1), .16);
T.at(TL.came - .3, tone(1.6, t => 200 + 600 * (t / 1.6) ** 2, { e: env.swell(1.3, .05), amp: 1 }), .1);   // the light rising
T.at(TL.came - .3, noise(1.6, { hp: t => 1000 + 4000 * t / 1.6, lp: 9000, e: env.swell(1.4, .05), amp: 1 }), .05);
T.at(TL.eyes, mixb(bell(note(57), 4, { partials: [[1, 1], [2.4, .5], [3.9, .3], [5.4, .15]], k: .7 }), drum(38, 1, 1.4)), .5);
T.at(TL.eyes + .1, conch(2.6, 294, 1), .22);

// ---------- the eyes (22.6–26.8) ----------
T.at(TL.eyes, om(TL.tears - TL.eyes + .6, 110, 1), .18);
for (let i = 0; i < 40; i++) T.at(TL.eyes + .3 + i / 40 * 2.2 + rnd() * .05, chime(note(84 + pent[Math.floor(rnd() * 5)] + (rnd() > .6 ? 12 : 0)), .5, 1.2), .05, rnd() * 1.6 - .8);
T.at(TL.name1, mixb(bell(note(62), 3.5, { partials: [[1, 1], [2.4, .5], [3.9, .3]], k: .9 }), drum(44, 1, 1.2)), .4);   // SHATAKSHI

// ---------- the tears (26.8–31.4) ----------
for (let i = 0; i < 9; i++) T.at(TL.tears + .6 + i * .5 + rnd() * .15, drop(note(86 + pent[i % 5])), .06, rnd() * 1.2 - .6);
T.at(TL.nine, noise(TL.rivers - TL.nine + .8, { hp: 900, lp: 7000, e: env.swell(2, .3), amp: 1 }), .1, -.3);   // the rain begins
T.at(TL.nine, noise(TL.rivers - TL.nine + .8, { hp: 1100, lp: 8000, e: env.swell(2.2, .3), amp: 1 }), .1, .3);

// ---------- the rivers, Shakambhari (31.4–36.2) ----------
T.at(TL.rivers, noise(TL.feed - TL.rivers + .4, { hp: 800, lp: 8000, e: env.swell(.1, .6), amp: 1 }), .16, -.4);
T.at(TL.rivers, noise(TL.feed - TL.rivers + .4, { hp: 900, lp: 8000, e: env.swell(.1, .6), amp: 1 }), .16, .4);
T.at(TL.rivers + .3, noise(TL.feed - TL.rivers, { brown: true, lp: t => 900 + 400 * Math.sin(t * 3), e: env.swell(1, .6), amp: 1 }), .3);   // running water
T.at(TL.rivers + .2, thunder(2.4, .4), .3, .5);
for (let i = 0; i < 9; i++) T.at(TL.feed + .2 + i * .25 + rnd() * .15, chirp(1), .05 + rnd() * .03, rnd() * 1.4 - .7);
for (let i = 0; i < 5; i++) T.at(TL.feed + .4 + i * .3, chime(note(79 + pent[i]), .8, 2), .1, (i % 2 ? .3 : -.3));

// ---------- the attack (36.2–39.2) ----------
T.at(TL.attack, mixb(drum(36, 1, 1.6), noise(.5, { brown: true, lp: 220, e: env.pluck(5), amp: 1.2 })), .55);
T.at(TL.attack + .1, roar(2.4, 105, 6, 1), .4);
for (let i = 0; i < 12; i++) T.at(TL.attack + .3 + i * .5, drum(58, 1, .4), .22, (i % 2 ? .3 : -.3));   // the march
T.at(TL.attack + .6, tone(2, note(41), { type: 'saw', e: env.swell(.3, .8), amp: .6 }), .08, -.4);   // war horns
T.at(TL.attack + .6, tone(2, note(48), { type: 'saw', e: env.swell(.3, .8), amp: .6 }), .06, .4);
T.at(36.9, thunder(2.2, .8), .4, -.4); T.at(38.5, thunder(2.2, .9), .4, .4);

// ---------- the ring of light; alone (39.2–43.2) ----------
T.at(TL.ring + .1, mixb(bell(note(64), 3, { partials: [[1, 1], [2.76, .4], [5.4, .2]], k: 1 }), whoosh(1.2, 400, 3000, 1)), .3);
T.at(TL.ring + .2, tone(3.5, note(76), { e: env.swell(.4, 1.2), amp: 1 }), .04);   // the ring hums
T.at(TL.ring, wind(TL.shaktis - TL.ring + .4, 10, .6), .2, -.5); T.at(TL.ring, wind(TL.shaktis - TL.ring + .4, 11, .6), .2, .5);
for (let i = 0; i < 6; i++) T.at(TL.ring + .3 + i * .55, drum(62, 1, .35), .14, .5);   // the army nearing
T.at(TL.alone, drum(40, 1, 1.4), .4);
for (let i = 0; i < 3; i++) T.at(TL.alone + .4 + i * .45, heart(1), .28);

// ---------- the burst: goddesses (43.2–47.6) ----------
T.at(TL.burst - .5, tone(.5, t => 60 + 300 * (t / .5) ** 2, { e: env.swell(.45, .02), amp: 1 }), .2);
T.at(TL.burst, mixb(drum(30, 1, 2.6), thunder(3, 1), noise(1.6, { brown: true, lp: 240, e: env.pluck(1.8), amp: 1.5 })), .55);
T.at(TL.burst + .05, conch(3, 311, 1), .3); T.at(TL.burst + .1, conch(2.8, 466, 1), .14);
for (let i = 0; i < 40; i++) T.at(TL.burst + i * .1, whoosh(.45, 600 + rnd() * 600, 3500, .8), .09, rnd() * 1.8 - .9);
T.at(TL.burst + .3, roar(2.6, 230, 5, 1), .16);   // a war cry
['Kalika', 'Tarini', 'Bhairavi', 'Bagala', 'Chhinnamasta'].forEach((_, i) => T.at(TL.names + .15 + i * .42, mixb(chime(note(81 + pent[i]), 1, 2), drum(56, 1, .4)), .18, -.6 + i * .3));

// ---------- the war (47.6–50.2) ----------
for (const h of [48.1, 48.8, 49.5]) { T.at(h, mixb(drum(34, 1, 1.4), thunder(1.8, 1)), .5, rnd() - .5); T.at(h + .05, rockfall(1.2, .8), .25, rnd() - .5); }
for (let i = 0; i < 10; i++) T.at(TL.war + .1 + rnd() * 2.4, clang(900 + rnd() * 800, 1), .12, rnd() * 1.6 - .8);   // weapons
T.at(TL.war + .2, roar(2.2, 120, 8, 1), .25);
T.at(TL.war + 1, roar(1.6, 240, 4, 1), .12);

// ---------- the bow: fifteen arrows (50.2–54.0) ----------
T.at(TL.arrows, wind(TL.release - TL.arrows + .3, 12, .5), .2);
T.at(TL.arrows + .3, tone(1.2, t => 80 + 30 * t, { type: 'saw', e: env.swell(.8, .3), amp: .5 }), .05);   // the bow creaks as it bends
T.at(TL.arrows + .3, noise(1.2, { hp: 300, lp: 1400, e: env.swell(.8, .3), amp: 1 }), .05);
for (let i = 0; i < 15; i++) T.at(ARROW_T(i), mixb(chime(note(69 + i * 1.5), 1, .8), noise(.03, { hp: 3000, lp: 9000, e: env.pluck(120), amp: .8 })), .14 + i * .004, .2);
T.at(TL.count, tone(TL.release - TL.count, t => note(57) * Math.pow(2, t / 3.2), { e: env.swell(1.2, .02), amp: 1 }), .07);   // the held breath rising
T.at(TL.release - .9, heart(1), .35); T.at(TL.release - .45, heart(1), .4);

// ---------- the release and the hits (54.0–58.0) ----------
T.at(TL.release, mixb(tone(.5, 98, { type: 'tri', e: env.pluck(9), fm: t => .02 * Math.sin(t * 300), amp: 1 }), noise(.12, { hp: 800, lp: 5000, e: env.pluck(30), amp: 1 })), .5);   // the twang
T.at(TL.release, whoosh(.8, 4000, 500, 1), .45, .3);
for (let i = 0; i < 5; i++) T.at(54.3 + i * .05, thunk(.8), .2, .6);   // the horses and the charioteer
T.at(HITS.flag, mixb(thunk(1), noise(.3, { hp: 1500, lp: 6000, e: env.pluck(12), amp: .8 })), .4, .6);   // the flag tears
T.at(HITS.eyes, thunk(1), .45); T.at(HITS.eyes + .03, thunk(1), .4);
T.at(HITS.eyes + .05, roar(1.2, 150, 6, 1), .4);
T.at(HITS.arms, thunk(1), .4, -.5); T.at(HITS.arms + .04, thunk(1), .4, .5);
for (let i = 0; i < 5; i++) T.at(TL.heart - .02 + i * .025, thunk(1), .3);
T.at(TL.heart, mixb(drum(28, 1, 3), thunder(3.4, 1), noise(2, { brown: true, lp: 260, e: env.pluck(1.4), amp: 1.6 })), .55);
T.at(TL.heart + .05, roar(1.6, 130, 6, 1), .45);
T.at(TL.heart + .3, tone(2.4, 2093, { e: env.ad(.02, 1), amp: 1 }), .03);   // ears ringing
T.at(TL.fall, whoosh(1.2, 900, 120, 1), .3);
T.at(TL.fall + .95, mixb(drum(34, 1, 1.6), rockfall(1.6, .8), noise(1, { brown: true, lp: 300, e: env.pluck(3), amp: 1 })), .55);   // he hits the ground

// ---------- dawn: the Vedas given back; DURGA (58.0–65.0) ----------
for (let i = 0; i < 8; i++) T.at(TL.name + .3 + i * .35 + rnd() * .2, chirp(1), .04 + rnd() * .03, rnd() * 1.4 - .7);
for (let i = 0; i < 12; i++) T.at(TL.name + .5 + i * .2, chime(note(84 + pent[i % 5]), .7, 1.6), .06, (i % 2 ? .4 : -.4));
T.at(TL.said, om(TL.ask - TL.said + .4, 110, 1), .14);
T.at(TL.durga - .25, whoosh(.3, 800, 3000, 1), .2);
T.at(TL.durga, mixb(drum(36, 1, 2), bell(note(50), 4, { partials: [[1, 1], [2.4, .5], [3.9, .3]], k: .8 })), .6);
T.at(TL.durga + .05, conch(3, 311, 1), .3);

// ---------- the ask and the card (65.0–73.2) ----------
T.at(TL.ask, om(TL.end - TL.ask, 98, 1), .3);
T.at(TL.ask + .2, bell(note(62), 4, { partials: [[1, 1], [2.4, .5], [3.9, .3]], k: .7 }), .25);
T.at(TL.card, chime(note(84), 1, 3), .2, -.2); T.at(TL.card + .25, chime(note(88), 1, 3), .18, .2); T.at(TL.card + 1.6, chime(note(91), 1, 3), .16);

T.write('assets/durgama_sfx.wav');

// ---------- the score under it: take 1 as it came (71 s), on a level curve: lower under the barren drought and the
// tears, full for the war and the strike; it has ended by the card, where the Om and the chimes carry on ----------
const SCORE = 'assets/durgama_score.mp3';
if (existsSync(SCORE)) {
  const lv = `if(lt(t,13.6),1,if(lt(t,18.6),0.55,if(lt(t,26.8),0.9,if(lt(t,31.4),0.8,1))))`;
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', SCORE, '-i', 'assets/durgama_sfx.wav', '-filter_complex', [
    `[0:a]aresample=48000,atrim=0:${TL.end},asetpts=PTS-STARTPTS,volume='${lv}':eval=frame,volume=0.42,afade=t=out:st=69.6:d=2.2[m]`,
    '[m][1:a]amix=inputs=2:duration=longest:normalize=0,loudnorm=I=-15:TP=-1.5:LRA=14,aresample=48000[o]'].join(';'),
    '-map', '[o]', '-t', String(TL.end), '-ar', '48000', '-ac', '2', 'assets/durgama_mix.wav'], { stdio: 'inherit' });
  console.log('wrote assets/durgama_mix.wav');
}
