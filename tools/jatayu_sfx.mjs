// jatayu_sfx.mjs: the sound effects for the Jatayu reel (src/scenes/jatayu.js), under the Lyria score. Times match TL.
// Then it mixes the score (assets/jatayu_score.mp3, Lyria take 4 of 6 from tools/jatayu_score.txt) under the effects.
//   The hook: a boom, the dusk wind, a distant eagle's cry. Panchavati: the river, crickets, a bell as Ram raises his
//   hand. The storm: thunder, hooves in the air, the chariot's rumble, the mules braying. Sita's cry: a gust. The eye:
//   a heartbeat, then the hit. The rise: great wingbeats and his war cry. Ravana laughs. "While I live": a rising
//   whoosh into the fight's boom. Arrows whizzing and thunking, the talons diving, the bow's crack and the pearls
//   tinkling, the chariot smashed and the mules' last bray, Ravana's crash; ten tearing hits, a breath of silence,
//   the arms growing back with a roar and his laugh. The tired bird: slow wings, breath. The sword's ring, the swing,
//   the cut, then near silence: a high note, feathers, the body landing. Sita's quiet. The anklet falling. Night:
//   crickets, a failing heart. Ram kneels; the heart stops; a bell. The pyre's fire and a conch. The spirit: shimmer,
//   a far cry, a conch under the choir. The card's chimes.
//   node tools/jatayu_sfx.mjs   → assets/jatayu_sfx.wav and assets/jatayu_mix.wav
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { clamp, track, tone, noise, bell, mixb, whoosh, crackle, crunch, clang, plink, shimmer, env, note, seed, rnd, thunder, wind, drum, fire, om, conch, chime, chirp, roar, rockfall, heart, laughter, thud, slide, rumble, screech, wingbeat } from './sfx.mjs';

const TL = { hook: 0, panch: 4.6, take: 9.4, mules: 11.6, cry: 13.4, wake: 15.4, snap: 15.75, rise: 18.2, spread: 19.0,
  old: 20.5, live: 22.9, fight: 25.25, bow: 27.6, snapBow: 28.6, smashT: 30.0, smash: 30.9, crash: 32.6, land: 33.2,
  arms: 35.0, tear: 35.3, grow: 37.5, tired: 39.9, sword: 42.4, swing: 44.8, cut: 45.2, sita: 48.2, away: 50.8,
  back: 52.75, alone: 53.2, ram: 56.0, dies: 59.25, pyre: 61.0, anyway: 65.3, jai: 65.5, ask: 68.1, card: 71.0, end: 76.0 };
const T = track(TL.end);
seed(21);
const pent = [0, 2, 4, 7, 9];
const boom = (f = 32, amp = 1, len = 2.2) => mixb(drum(f, amp, len), noise(.8, { brown: true, lp: 220, e: env.pluck(3), amp: 1.3 * amp }));
const river = (dur) => noise(dur, { brown: true, lp: t => 600 + 250 * Math.sin(t * 1.7), e: env.swell(.8, .8), amp: 1 });
const cricket = (dur, f = 4600) => tone(dur, t => f, { e: (t, D) => clamp(t / .3) * clamp((D - t) / .3) * (Math.sin(t * 2 * Math.PI * 28) > .2 ? 1 : 0), amp: 1 });
const bray = (amp = 1, f = 1) => mixb(tone(.34, t => (900 - 1200 * t) * f, { type: 'saw', e: env.hann(), amp: .5 * amp }), tone(.5, t => (300 + 300 * t) * f, { type: 'saw', e: env.hann(), amp: .6 * amp }));
const hooves = (dur, rate = 4) => { const bs = []; for (let i = 0; i < dur * rate; i++) bs.push([i / rate, mixb(drum(110, .5, .12), noise(.05, { hp: 400, lp: 3000, e: env.pluck(60), amp: .3 }))]); return bs; };
const arrowWhiz = (amp = 1) => mixb(whoosh(.28, 3400, 1200, amp), tone(.22, t => 2400 - 3000 * t, { e: env.hann(), amp: .15 * amp }));
const shing = (amp = 1) => mixb(noise(.9, { hp: t => 3000 + 4000 * t, lp: 12000, e: env.swell(.02, .6), amp: .5 * amp }), bell(note(96), 2.2, { partials: [[1, 1], [2.7, .5], [5.1, .3]], k: 1.2, amp: .6 * amp }));
const breath = (dur) => noise(dur, { hp: 300, lp: t => 900 + 500 * Math.sin(t * 2.6 * Math.PI / 1.2), e: (t, D) => (.5 + .5 * Math.sin(t * Math.PI * 2 / 1.3)) * clamp(t / .3) * clamp((D - t) / .3), amp: 1 });

// ---------- the hook (0–4.6) ----------
T.at(0, boom(30, 1, 2.6), .6);
T.at(0, wind(TL.take, 1, 1.2), .14, -.4); T.at(0, wind(TL.take, 4, 1.2), .12, .4);
T.at(1.3, screech(1.2, 2300, 1), .1, .5);
T.at(3.4, screech(.9, 2600, 1), .06, -.5);

// ---------- Panchavati (4.6–9.4) ----------
T.at(TL.panch, river(TL.take - TL.panch + .4), .2, -.3);
for (let i = 0; i < 6; i++) T.at(TL.panch + .3 + i * .8, cricket(.5, 4300 + i * 120), .025, rnd() - .5);
T.at(TL.panch + 2.5, bell(note(74), 3, { partials: [[1, 1], [2.4, .5], [3.9, .3]], k: .9 }), .14);

// ---------- the chariot in the storm (9.4–13.4) ----------
T.at(TL.take + .5, thunder(3, 1), .55, .3); T.at(TL.take + 1.9, thunder(2.6, .8), .4, -.4); T.at(TL.mules + .9, thunder(2.6, .9), .45, -.3);
T.at(TL.take, rumble(TL.cry - TL.take), .3);
T.at(TL.take, wind(TL.cry - TL.take + .3, 7, .5), .2);
for (const [d, b] of hooves(TL.cry - TL.take, 4.4)) T.at(TL.take + d, b, .18, .3);
T.at(TL.take + 1.0, bray(1), .14, .5); T.at(TL.mules + .3, bray(1, 1.1), .26, .3); T.at(TL.mules + 1.2, bray(1, .9), .2, -.2);
T.at(TL.mules + .2, roar(1.4, 140, 4, 1), .1);

// ---------- Sita's cry (13.4–15.4) ----------
T.at(TL.cry, whoosh(1.4, 300, 1800, 1), .3, -.3);
T.at(TL.cry, wind(2.2, 11, .4), .2);

// ---------- the eye (15.4–18.2) ----------
T.at(TL.wake, heart(1), .4); T.at(TL.wake + .2, whoosh(.5, 300, 3000, 1), .2);
T.at(TL.snap, mixb(boom(34, 1, 2), bell(note(86), 2.5, { partials: [[1, 1], [2.76, .45], [5.4, .2]], k: 1.5 })), .55);
T.at(TL.snap + .1, screech(1.4, 2100, 1), .14, .2);
T.at(TL.snap + .2, rumble(2.4), .3);

// ---------- the rise (18.2–20.5) ----------
for (const [h, a, k] of [[18.4, .6, 1], [TL.spread, 1, 1.3], [19.8, .7, 1.1], [20.5, .6, 1.1]]) T.at(h - .25, wingbeat(1, k), .6 * a);
T.at(TL.spread, boom(30, 1, 2.2), .5);
T.at(TL.spread + .05, screech(1.6, 2000, 1), .4, 0);
T.at(TL.rise, wind(2.5, 13, .4), .18);

// ---------- Ravana laughs (20.5–22.9) ----------
T.at(TL.old + .1, laughter(2.4, 1), .35); T.at(TL.old + .1, roar(2.2, 70, 5, .7), .12);
T.at(TL.old + 1.2, thunder(2, .6), .3, .4);

// ---------- "while I live" (22.9–25.25) ----------
T.at(TL.live, heart(1), .3); T.at(TL.live + .8, heart(1), .32); T.at(TL.live + 1.5, heart(1), .34);
T.at(TL.live + 1.2, screech(.7, 2400, 1), .16);
T.at(TL.fight - 1.0, whoosh(1.0, 200, 3000, 1), .4);

// ---------- the fight: arrows (25.25–27.6) ----------
T.at(TL.fight, mixb(boom(28, 1, 2.6), thunder(2.6, 1)), .7);
for (let i = 0; i < 18; i++) { const st = TL.fight + rnd() * 2; T.at(st, arrowWhiz(1), .12 + rnd() * .06, rnd() * 1.6 - .8); }
for (let i = 0; i < 6; i++) T.at(TL.fight + .3 + i * .36, wingbeat(1, .8), .4, .3);
T.at(TL.fight + .9, screech(1.1, 2500, 1), .3, .4);

// ---------- the bow (27.6–30.0) ----------
T.at(TL.bow + .1, whoosh(.9, 500, 3200, 1), .35);
T.at(TL.snapBow - .1, wingbeat(1, 1), .4);
T.at(TL.snapBow, mixb(noise(.25, { hp: 1500, lp: 9000, e: env.pluck(18), amp: 1 }), crunch(1), clang(note(64), .8), boom(40, .8, 1.4)), .7);
for (let i = 0; i < 14; i++) T.at(TL.snapBow + .1 + rnd() * 1.1, plink(note(88 + pent[i % 5] + (i % 2) * 12), .8), .08, rnd() * 1.6 - .8);

// ---------- the chariot smashed (30.0–32.6) ----------
T.at(TL.smashT, whoosh(.9, 300, 2600, 1), .4, .2);
T.at(TL.smashT + .1, screech(.9, 2300, 1), .26, .3);
T.at(TL.smash, mixb(rockfall(1.6, 1), crunch(1), clang(note(55), 1), boom(30, 1, 2.2)), .75);
T.at(TL.smash + .05, bray(1, .8), .25, .4); T.at(TL.smash + .25, bray(.8, .7), .2, .6);
T.at(TL.smash + .3, whoosh(1.4, 1800, 200, 1), .25, -.3);   // the charioteer falls
for (let i = 0; i < 8; i++) T.at(TL.smash + .2 + rnd() * 1.2, clang(note(60 + rnd() * 24), .5), .08, rnd() * 1.6 - .8);

// ---------- Ravana crashes down (32.6–35.0) ----------
T.at(TL.crash, whoosh(.65, 2400, 200, 1), .4);
T.at(TL.crash + .05, roar(.8, 160, 6, 1), .2);
T.at(TL.land, mixb(boom(26, 1, 3), rockfall(2, 1), thud(1)), .9);

// ---------- ten arms, and they grow back (35.0–39.9) ----------
T.at(TL.arms + .05, screech(1, 2600, 1), .35, -.3);
for (let j = 0; j < 10; j++) T.at(TL.tear + j * .11, mixb(crunch(1), thud(.8), drum(60 - j * 2, .6, .3)), .4, -.5 + j * .05);
T.at(TL.tear + .2, roar(1.2, 120, 8, 1), .3);
T.at(TL.grow - .6, whoosh(.6, 300, 3600, 1), .35);
T.at(TL.grow, mixb(boom(30, 1, 2.4), roar(2.2, 90, 8, 1)), .7);
T.at(TL.grow + .6, laughter(1.8, 1), .32);

// ---------- the old bird tires (39.9–42.4) ----------
T.at(TL.tired, wind(2.6, 17, .6), .2);
T.at(TL.tired + .1, breath(2.4), .18);
T.at(TL.tired + .5, wingbeat(.7, 1.4), .3); T.at(TL.tired + 1.6, wingbeat(.6, 1.5), .26);
for (const h of [40.2, 41.1, 42.0]) T.at(h, heart(.8), .3);

// ---------- the sword (42.4–45.2) ----------
T.at(TL.sword + .2, shing(1), .45, .2);
T.at(TL.sword, roar(2, 80, 5, .6), .1);
T.at(TL.swing, whoosh(.4, 600, 4200, 1), .6);
T.at(TL.cut, mixb(noise(.18, { hp: 2000, lp: 10000, e: env.pluck(20), amp: 1 }), boom(30, 1, 2.6), clang(note(70), 1)), .5);

// ---------- the fall, in near silence (45.2–48.2) ----------
T.at(TL.cut + .3, tone(2.8, note(88), { e: env.swell(1.2, 1.2), amp: 1 }), .03);
T.at(TL.cut + .2, wind(3, 19, 1), .08);
for (let i = 0; i < 6; i++) T.at(TL.cut + .4 + i * .4, whoosh(.5, 900, 300, 1), .05, rnd() - .5);
T.at(TL.sita - .3, mixb(thud(1), drum(40, .8, .8)), .35);

// ---------- Sita weeps (48.2–50.8) ----------
T.at(TL.sita, om(2.8, 98, 1), .08);
T.at(TL.sita, wind(2.8, 23, .8), .08);

// ---------- Ravana flies off; the anklet (50.8–53.2) ----------
T.at(TL.away, whoosh(1.6, 300, 2400, 1), .3, .3);
T.at(TL.away + .2, laughter(1.6, .8), .14, .5);
T.at(TL.away + .9, chime(note(91), 1, 2), .12, .2);
T.at(TL.away + 1.6, plink(note(96), 1), .08, -.1); T.at(TL.away + 2.1, plink(note(91), 1), .06, -.2);

// ---------- night: alone, still breathing (53.2–56.0) ----------
for (let i = 0; i < 5; i++) T.at(TL.alone + .2 + i * .9, cricket(.5, 4500 + i * 80), .02, rnd() - .5);
T.at(TL.alone, wind(TL.ram - TL.alone + .4, 29, .8), .1);
for (const h of [53.6, 54.8, 56.2, 57.8]) T.at(h, heart(.7), .22);

// ---------- Ram cradles him; he dies (56.0–61.0) ----------
T.at(TL.ram + .1, noise(.5, { hp: 300, lp: 2000, e: env.hann(), amp: 1 }), .1);   // he kneels
T.at(TL.dies, bell(note(62), 4, { partials: [[1, 1], [2.4, .5], [3.9, .3]], k: .7 }), .3);
T.at(TL.dies, om(3.4, 98, 1), .16);
for (let i = 0; i < 4; i++) T.at(TL.alone + .1 + i * 2.3, cricket(.4, 4400), .015, .5);

// ---------- the pyre (61.0–65.3) ----------
T.at(TL.pyre, fire(TL.anyway - TL.pyre + .5, .4, 1), .3);
T.at(TL.pyre + .2, crackle(4, 1), .1);
T.at(TL.pyre + .3, conch(3, 311, 1), .14);
T.at(TL.pyre + 2.4, bell(note(57), 4, { partials: [[1, 1], [2.4, .5], [3.9, .3]], k: .8 }), .2);

// ---------- the spirit rises; the call-out (65.3–71.0) ----------
T.at(TL.anyway, shimmer(3, [0, 2, 4, 7, 9, 12, 14].map(i => note(79 + i)), 1, .12), .12);
T.at(TL.jai, conch(3.4, 311, 1), .16);
T.at(TL.jai + 1.2, screech(1.8, 1800, .7), .05, .4);
T.at(TL.ask, om(TL.end - TL.ask, 98, 1), .18);
for (let i = 0; i < 5; i++) T.at(TL.ask + .3 + i * .4, chime(note(79 + pent[i]), .7, 2), .07, (i % 2 ? .3 : -.3));

// ---------- the card (71.0–76.0) ----------
T.at(TL.card, chime(note(84), 1, 3), .2, -.2); T.at(TL.card + .25, chime(note(88), 1, 3), .18, .2); T.at(TL.card + 1.6, chime(note(91), 1, 3), .16);

T.write('assets/jatayu_sfx.wav');

// ---------- the score under it, on a level curve: a little lower under the opening captions, full through the fight,
// cut to a whisper from the sword's stroke until its own swell at 52.75 (Lyria played its hush late, at 49.5), then
// full again; faded out under the card's chimes ----------
const SCORE = 'assets/jatayu_score.mp3';   // Lyria take 4 of 6, used as it came (its hits: 15.75, 19.0, 25.25, 37.5; its hush 49.5–52.5; the choir at 65.5)
if (existsSync(SCORE)) {
  const lv = `if(lt(t,15.4),0.85,if(lt(t,45.2),1,if(lt(t,45.5),1-(t-45.2)/0.3*0.94,if(lt(t,52.6),0.06,if(lt(t,52.8),0.06+(t-52.6)/0.2*0.94,1)))))`;
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', SCORE, '-i', 'assets/jatayu_sfx.wav', '-filter_complex', [
    `[0:a]aresample=48000,atrim=0:${TL.end},asetpts=PTS-STARTPTS,volume='${lv}':eval=frame,volume=0.42,afade=t=out:st=72.4:d=2.4[m]`,
    '[1:a]volume=1.5[s]', '[m][s]amix=inputs=2:duration=longest:normalize=0,loudnorm=I=-15:TP=-1.5:LRA=14,aresample=48000[o]'].join(';'),
    '-map', '[o]', '-t', String(TL.end), '-ar', '48000', '-ac', '2', 'assets/jatayu_mix.wav'], { stdio: 'inherit' });
  console.log('wrote assets/jatayu_mix.wav');
}
