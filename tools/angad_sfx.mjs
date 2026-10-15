// angad_sfx.mjs: the sound effects for ad 20 (src/scenes/angad.js), under the Lyria score. Times match TL in the scene.
// Then it mixes the score (assets/angad_score.mp3, Lyria take 3 of 3 from tools/angad_score.txt) under the effects.
//   The hook: a boom, the court's fire, hands gripping and heaving at the foot. Suvela: the sea, a blessing bell. The
//   court: Angad's steps, the murmur, everyone rising (a rustle and a gong). Ravana's laugh. The roast: memory whooshes,
//   chains, a squeak and muffled screams under Vali's arm, the court's gasp. The boast: a roar, Kailash's rocks. The
//   strike: the wind-up and the biggest boom yet, courtiers thudding down, crowns clanging off and clattering. The
//   crowns as meteors, Hanuman's leap and catch. The foot: the slam. The tug-of-war: a war cry, heaving, the slip and
//   the pile-up, sheepish sitting. Ravana's heavy steps, the hush and heartbeats, the grab, the foot pulled away, a
//   radiant swell. His glory draining. Dawn: birds, a conch for JAI SHRI RAM, the card's chimes.
//   node tools/angad_sfx.mjs   → assets/angad_sfx.wav and assets/angad_mix.wav
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { track, tone, noise, bell, mixb, whoosh, crackle, env, note, seed, rnd, thunder, wind, drum, fire, om, conch, chime, chirp, clang, roar, rockfall, heart, laughter, thud, slide, squeak } from './sfx.mjs';

const TL = { hook: 0, send: 4.6, peace: 7.2, court: 9.4, rise: 11.4, who: 13.6, intro: 15.8, friend: 18.2, ten: 20.4,
  roast: 22.8, sahas: 25.0, armpit: 27.2, which: 29.4, boast: 31.6, heads: 33.8, strike: 35.8, hit: 36.6, crowns: 38.0,
  fling: 40.0, catch: 42.2, foot: 44.4, plant: 45.0, close: 45.7, stakes: 46.6, rush: 49.2, fail: 51.8, slip: 52.2,
  down: 54.0, grab: 56.4, seize: 58.7, lift: 58.8, gone: 60.6, bow: 62.6, jai: 64.7, stand: 66.6, ask: 67.4, card: 70.4, end: 75.4 };
const CROWN_T = (i) => TL.crowns + .1 + [0, 3, 6, 1, 4, 7, 2, 5, 8, 9][i] * .09;
const T = track(TL.end);
seed(20);
const pent = [0, 2, 4, 7, 9];
const boom = (f = 32, amp = 1, len = 2.2) => mixb(drum(f, amp, len), noise(.8, { brown: true, lp: 220, e: env.pluck(3), amp: 1.3 * amp }));
const step = (amp = 1) => mixb(drum(90, amp * .6, .18), noise(.06, { hp: 300, lp: 2400, e: env.pluck(60), amp: amp * .5 }));
const grip = (amp = 1) => mixb(thud(amp), noise(.12, { hp: 800, lp: 5000, e: env.pluck(25), amp: amp * .4 }));
const strain = (dur, amp = 1) => roar(dur, 85, 4, amp);
const sea = (dur) => noise(dur, { brown: true, lp: t => 500 + 300 * Math.sin(t * 1.3), e: env.swell(.8, .8), amp: 1 });
const murmur = (dur) => noise(dur, { hp: 250, lp: 900, e: env.swell(.5, .5), amp: 1 });

// ---------- the hook (0–4.6) ----------
T.at(0, boom(32, 1, 2.4), .6);
T.at(0, fire(TL.send + .3, .4, .5), .12);
T.at(0, wind(TL.send + .3, 1, .5), .12, -.4);
for (const [d, p] of [[1.0, .5], [1.25, -.5], [1.5, .4], [1.75, -.4]]) { T.at(d - .25, whoosh(.3, 2400, 500, 1), .14, p); T.at(d + .62, grip(1), .4, p); }
T.at(2.6, strain(2, 1), .22);
for (const h of [2.8, 3.4, 4.0]) T.at(h, mixb(drum(48, 1, .5), slide(.3, 140, 90, .6)), .3);
T.at(2.4, drum(40, 1, 1.4), .4);

// ---------- Suvela (4.6–9.4) ----------
T.at(TL.send, sea(TL.court - TL.send + .4), .28, -.2);
T.at(TL.send, wind(TL.court - TL.send + .4, 2, .8), .14, .4);
for (let i = 0; i < 4; i++) T.at(TL.send + .5 + i * 1.1, chirp(1), .03, rnd() - .5);
T.at(TL.peace, chime(note(76), .8, 3), .16); T.at(TL.peace + .25, chime(note(81), .8, 3), .12);   // the blessing
T.at(TL.peace + .1, om(TL.court - TL.peace + .4, 98, 1), .12);

// ---------- the court: steps, everyone rises (9.4–13.6) ----------
T.at(TL.court, fire(TL.who - TL.court + .3, .5, .6), .14);
T.at(TL.court, murmur(TL.rise - TL.court + .3), .12);
for (let i = 0; i < 9; i++) T.at(TL.court + .3 + i * .45, step(1), .3, (i % 2 ? .15 : -.15));
T.at(TL.rise - .1, whoosh(1.2, 300, 1800, 1), .2);
for (let i = 0; i < 26; i++) T.at(TL.rise + rnd() * 1.4, mixb(thud(.5), noise(.1, { hp: 600, lp: 3000, e: env.pluck(30), amp: .4 })), .08, rnd() * 1.6 - .8);   // chairs scraping, robes
T.at(TL.rise + .2, bell(note(38), 4, { partials: [[1, 1], [2.1, .5], [3.3, .3], [4.7, .15]], k: .6 }), .35);   // a gong
T.at(TL.rise + 1, noise(1.2, { hp: 200, lp: 600, e: env.swell(.2, .9), amp: 1 }), .1);   // silence settles

// ---------- "Who are you, monkey?" (13.6–15.8) ----------
T.at(TL.who, fire(TL.roast - TL.who, .4, .4), .1);
T.at(TL.who + .15, laughter(2, 1), .3); T.at(TL.who + .1, roar(1.8, 95, 10, 1), .14);   // ten heads laughing
// ---------- "ANGAD. Son of your friend, VALI." (15.8–18.2) ----------
T.at(TL.intro, mixb(drum(44, 1, 1), bell(note(50), 2.5, { partials: [[1, 1], [2.4, .4], [3.9, .2]], k: 1 })), .35);
// ---------- "And how is my friend?" / "In TEN days." (18.2–22.8) ----------
T.at(TL.friend + .1, tone(2, note(38), { e: env.swell(.5, .8), amp: 1 }), .08);
T.at(TL.ten + 1.4, mixb(drum(40, 1, 1.4), noise(.4, { brown: true, lp: 200, e: env.pluck(6), amp: 1 })), .45);   // TEN days
T.at(TL.ten + 1.5, noise(.6, { hp: 300, lp: 1200, e: env.ad(.02, .4), amp: 1 }), .1);   // the court gasps

// ---------- the roast (22.8–31.6) ----------
T.at(TL.roast, laughter(1.4, .6), .08, .5);
T.at(TL.sahas - .3, whoosh(.5, 500, 3500, 1), .25); T.at(TL.sahas, bell(note(57), 2.6, { partials: [[1, 1], [2.76, .4]], k: 1 }), .18);   // into a memory
for (let i = 0; i < 6; i++) T.at(TL.sahas + .5 + i * .28, clang(1800 + rnd() * 600, 1), .05, .4);   // the chain
T.at(TL.armpit - .3, whoosh(.5, 500, 3500, 1), .25); T.at(TL.armpit, bell(note(55), 2.6, { partials: [[1, 1], [2.76, .4]], k: 1 }), .16);
T.at(TL.armpit + .4, squeak(900, 1400, .2, 1), .12); T.at(TL.armpit + .9, squeak(1000, 1600, .18, 1), .1);
T.at(TL.armpit + .3, roar(1.8, 260, 8, 1), .07);   // muffled screams
T.at(TL.which, mixb(drum(42, 1, 1.2), noise(.3, { brown: true, lp: 260, e: env.pluck(8), amp: 1 })), .4);
T.at(TL.which + .1, noise(.8, { hp: 300, lp: 1400, e: env.ad(.02, .6), amp: 1 }), .14);   // the court gasps
T.at(TL.which + .2, roar(2, 110, 10, 1), .14);   // ten heads fuming

// ---------- the boast (31.6–35.8) ----------
T.at(TL.boast, roar(2.4, 110, 10, 1), .45); T.at(TL.boast, boom(34, 1, 1.8), .5);
T.at(TL.boast + .3, thunder(2.6, .9), .35, -.3);
T.at(TL.boast + .5, rockfall(1.8, .8), .25, .3);   // Kailash
T.at(TL.heads, mixb(drum(40, 1, 1.3), bell(note(45), 3, { partials: [[1, 1], [2.4, .5], [3.9, .2]], k: .8 })), .4);
T.at(TL.heads + .1, om(2, 73, 1), .16);

// ---------- the strike; the crowns fall (35.8–40.0) ----------
T.at(TL.hit - .6, tone(.6, t => 60 + 400 * (t / .6) ** 2, { e: env.swell(.55, .02), amp: 1 }), .22);
T.at(TL.hit - .3, whoosh(.3, 600, 3000, 1), .3);
T.at(TL.hit, mixb(boom(26, 1, 3), thunder(3, 1), rockfall(2, 1)), .62);
for (let i = 0; i < 14; i++) T.at(TL.hit + .15 + rnd() * .7, thud(.8), .14, rnd() * 1.6 - .8);   // courtiers knocked down
T.at(TL.hit + .1, crackle(1.4, 1), .12);
for (let i = 0; i < 10; i++) { T.at(CROWN_T(i), clang(1100 + i * 90, 1), .12, -.6 + i * .13); if (i % 3) T.at(CROWN_T(i) + .55 + rnd() * .2, clang(700 + rnd() * 300, .8), .1, rnd() - .5); }

// ---------- the crowns over the sea; Hanuman's catch (40.0–44.4) ----------
T.at(TL.fling, sea(TL.foot - TL.fling), .16);
for (let i = 0; i < 4; i++) { T.at(TL.fling + .1 + i * .35, whoosh(2.4, 2600, 300, 1), .2, .7 - i * .3); T.at(TL.fling + .2 + i * .35, crackle(2.2, 1), .05, .5 - i * .3); }
T.at(TL.catch - .1, whoosh(1, 300, 2400, 1), .3, -.4);   // Hanuman leaps
T.at(TL.catch + 1.1, mixb(chime(note(81), 1, 2.5), chime(note(88), 1, 2.5), drum(52, 1, .6)), .3, -.2);   // caught
for (let i = 0; i < 6; i++) T.at(TL.catch + 1.3 + i * .12, chirp(1), .05, -.6 + rnd() * .4);   // the monkeys cheer

// ---------- the foot planted (44.4–49.2) ----------
T.at(TL.foot, fire(TL.rush - TL.foot, .5, .5), .12);
T.at(TL.plant - .55, tone(.55, t => 50 + 300 * (t / .55) ** 2, { e: env.swell(.5, .02), amp: 1 }), .22);
T.at(TL.plant, mixb(boom(24, 1, 3.2), thunder(3.2, 1), rockfall(2.2, 1)), .7);
T.at(TL.plant + .05, tone(2.4, 2093, { e: env.ad(.02, 1), amp: 1 }), .02);
T.at(TL.close, mixb(crackle(1.6, 1), drum(36, 1, 1.4)), .25);
T.at(TL.stakes + .2, tone(2.6, note(36), { e: env.swell(.4, 1), amp: 1 }), .1);

// ---------- the tug-of-war; the pile-up (49.2–54.0) ----------
for (let i = 0; i < 10; i++) T.at(TL.rush + .1 + i * .15, step(1.1), .2, -.6 + rnd() * .3);   // they charge in
T.at(TL.rush + .2, roar(1.6, 150, 8, 1), .3, -.4);   // a war cry
for (let i = 0; i < 6; i++) { const h = TL.rush + 1.4 + i * .42; T.at(h, mixb(drum(50, 1, .4), slide(.32, 160, 100, .5)), .26, -.3); T.at(h, strain(.4, 1), .1, -.3); }
T.at(TL.slip - .05, mixb(slide(.6, 420, 90, 1), whoosh(.6, 2000, 300, 1)), .25, -.3);
for (let i = 0; i < 5; i++) T.at(TL.slip + .35 + i * .09, mixb(thud(1), drum(44, 1, .5)), .3, -.7 + i * .12);   // dominoes
T.at(TL.slip + .9, tone(.9, note(33), { type: 'tri', e: env.ad(.02, .8), amp: 1 }), .14);   // a sheepish note
for (let i = 0; i < 5; i++) T.at(TL.slip + 1.1 + i * .12, thud(.5), .12, -.6 + i * .1);   // sitting down

// ---------- Ravana comes down (54.0–56.4) ----------
for (let i = 0; i < 4; i++) T.at(TL.down + .3 + i * .62, mixb(drum(34, 1, 1), noise(.12, { hp: 200, lp: 1500, e: env.pluck(30), amp: .6 })), .42);
T.at(TL.down + .1, roar(2.2, 80, 6, 1), .12);

// ---------- the hush, the grab, the foot pulled away (56.4–60.8) ----------
T.at(TL.grab, tone(2.4, note(84), { e: env.swell(1.6, .1), amp: 1 }), .04);
T.at(TL.grab, wind(2.4, 9, .6), .1);
for (const h of [56.7, 57.3, 57.9, 58.4]) T.at(h, heart(1), .35);
T.at(TL.seize - .35, whoosh(.35, 2400, 500, 1), .22, .4);
T.at(TL.seize, grip(1), .3, .2);
T.at(TL.lift, whoosh(.6, 400, 2600, 1), .3, -.3);
T.at(TL.lift + .45, mixb(drum(46, 1, .7), noise(.15, { hp: 600, lp: 4000, e: env.pluck(25), amp: .8 })), .4, .3);   // his hands slap bare floor
T.at(TL.lift + .45, mixb(bell(note(62), 4, { partials: [[1, 1], [2.4, .5], [3.9, .3], [5.4, .15]], k: .7 }), conch(2.6, 311, 1)), .32);   // RAM's feet
T.at(TL.lift + .5, om(2.2, 110, 1), .2);

// ---------- his glory gone (60.8–63.2) ----------
T.at(TL.gone, slide(2.2, 220, 70, 1), .12);
T.at(TL.gone + .2, drum(36, 1, 1.6), .3);
T.at(TL.gone, fire(TL.bow - TL.gone, .4, .1), .1);

// ---------- dawn: Angad at Ram's feet; JAI SHRI RAM (63.2–70.4) ----------
T.at(TL.bow, sea(TL.ask - TL.bow), .14);
for (let i = 0; i < 9; i++) T.at(TL.bow + .3 + i * .4 + rnd() * .2, chirp(1), .04 + rnd() * .03, rnd() * 1.4 - .7);
for (let i = 0; i < 5; i++) T.at(TL.bow + .6 + i * .35, chime(note(79 + pent[i]), .7, 2), .08, (i % 2 ? .3 : -.3));
T.at(TL.jai, mixb(drum(36, 1, 2), bell(note(50), 4, { partials: [[1, 1], [2.4, .5], [3.9, .3]], k: .8 })), .5);
T.at(TL.jai + .05, conch(3, 311, 1), .18);
T.at(TL.ask, om(TL.end - TL.ask, 98, 1), .26);
T.at(TL.ask + .2, bell(note(62), 4, { partials: [[1, 1], [2.4, .5], [3.9, .3]], k: .7 }), .22);

// ---------- the card (70.4–75.4) ----------
T.at(TL.card, chime(note(84), 1, 3), .2, -.2); T.at(TL.card + .25, chime(note(88), 1, 3), .18, .2); T.at(TL.card + 1.6, chime(note(91), 1, 3), .16);

T.write('assets/angad_sfx.wav');

// ---------- the score under it, on a level curve: a little lower under the dialogue and the roast so the effects and
// the jokes land, full for the strike, the slam and the swell; faded out under the card's chimes ----------
const SCORE = 'assets/angad_score.mp3', TRIM = .5;   // Lyria take 3 of 3, its first 0.5 s cut so its hits land on TL (strike 36.6, the hush, the swell at 59.3, the chant at 64.3)
if (existsSync(SCORE)) {
  const lv = `if(lt(t,13.6),1,if(lt(t,31.6),0.75,if(lt(t,56.4),1,if(lt(t,58.8),0.6,1))))`;
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', SCORE, '-i', 'assets/angad_sfx.wav', '-filter_complex', [
    `[0:a]aresample=48000,atrim=${TRIM}:${TL.end + TRIM},asetpts=PTS-STARTPTS,volume='${lv}':eval=frame,volume=0.42,afade=t=out:st=72.6:d=2.6[m]`,
    '[m][1:a]amix=inputs=2:duration=longest:normalize=0,loudnorm=I=-15:TP=-1.5:LRA=14,aresample=48000[o]'].join(';'),
    '-map', '[o]', '-t', String(TL.end), '-ar', '48000', '-ac', '2', 'assets/angad_mix.wav'], { stdio: 'inherit' });
  console.log('wrote assets/angad_mix.wav');
}
