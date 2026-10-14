// surya_sfx.mjs: the sound effects for ad/16-book4-sun (src/scenes/surya.js), and the final mix. Times come from TL
// (src/scenes/surya_tl.js, itself from the voice's timings in src/scenes/surya_vo.js), so re-rendering the voice moves
// the effects with it.
//   The hook: a hard first frame, an icy wind, the dead sun's low hum. The devotees: lamps, a soft om, a temple bell.
//   Surya: a roar of fire swelling, the brothers burning (crackle, a scream), ash on the wind. Shiva: a drop, a damru
//   roll, a hit on the third eye. The trishul: a whir rising to an impact on the sun. The fall: a long descending
//   whoosh, a boom, then the dark: silence, ice creaking, the river freezing. The curse: thunder. Ganesha: an om and a
//   bell. The plea: near silence, one chime. She steps out: a swell, a conch, birds as the warmth returns. The
//   question: a held drone and a heartbeat. The card: a hit and chimes.
//   node tools/surya_sfx.mjs   → assets/surya_sfx.wav, assets/surya_mix.wav (voice + SFX + score) and
//                                 assets/surya_vo_sfx.wav (voice + SFX, for music added on Instagram)
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { track, tone, noise, bell, mixb, whoosh, crackle, crinkle, plink, click, env, note, seed, rnd, thunder, wind, drum, fire, om, conch, chime, chirp, clang, roar, rockfall, shimmer, drone, damru, whir, heart } from './sfx.mjs';

const ctx = {}; runInNewContext(readFileSync('src/scenes/surya_vo.js', 'utf8') + '\n' + readFileSync('src/scenes/surya_tl.js', 'utf8') + '\n;this.VO = VO; this.TL = TL;', ctx);
const { TL, VO } = ctx;
const T = track(TL.end);
seed(16);
const hit = (t, f = 36, amp = 1) => T.at(t, mixb(drum(f, 1, 2.4), noise(1, { brown: true, lp: 200, e: env.pluck(2.6), amp: 1.3 })), amp);
const sub = (t, amp = 1) => T.at(t, tone(2.2, x => 62 * Math.exp(-x * 1.1) + 26, { e: env.ad(.005, 1.3), amp: 1 }), amp);
const temple = (t, m, amp) => T.at(t, bell(note(m), 4, { partials: [[1, 1], [2.4, .5], [3.9, .3]], k: .7 }), amp);

// ---------- the hook: the dead sun over the frozen land ----------
hit(0, 38, .7); sub(0, .4);
T.at(0, wind(TL.mali + .6, 0, .4), .26, -.5); T.at(0, wind(TL.mali + .6, 2, .4), .26, .5);
T.at(0, drone(TL.mali + .3, 55, 1), .1);
T.at(TL.sunOut, mixb(tone(1.6, x => 180 * Math.exp(-x * 1.6) + 40, { e: env.ad(.01, 1.2), amp: 1 }), noise(1.2, { brown: true, lp: 300, e: env.pluck(3), amp: .8 })), .35);   // the last light dying
T.at(.6, shimmer(1.6, [96, 91, 88, 84].map(note), .5, .14), .1);   // ice glints

// ---------- Mali and Sumali at the linga ----------
T.at(TL.mali, om(TL.surya - TL.mali + .4, 98, 1), .2); T.at(TL.mali + .3, om(TL.surya - TL.mali, 147, 1), .08, .2);
temple(TL.mali + .3, 55, .28); temple(TL.mali + 2.6, 55, .16);
T.at(TL.mali, fire(TL.surya - TL.mali, .2, .3), .1);   // the lamps

// ---------- Surya's fire; the brothers burn ----------
T.at(TL.surya, fire(TL.fury - TL.surya + .3, .4, 1), .45);
T.at(TL.blaze - .2, mixb(roar(2.2, 90, 8, .6), noise(2.4, { brown: true, lp: t => 200 + 300 * t, e: env.swell(.6, .8), amp: 1 })), .4);
T.at(TL.blaze, conch(2.2, 262, 1), .2);
T.at(TL.burned - .1, mixb(drum(34, 1, 2.4), crackle(2.2, 1)), .55); sub(TL.burned, .5);
T.at(TL.burned + .2, roar(1.6, 160, 6, .8), .3, -.1);                          // their scream
T.at(TL.ashes, mixb(drum(30, 1, 2.6), noise(1.4, { brown: true, lp: 260, e: env.pluck(2), amp: 1.4 })), .7);
T.at(TL.ashes + .2, whoosh(2.2, 2400, 300, 1), .3);                            // ash on the wind
T.at(TL.ashes + .3, crinkle(1.4, 1), .2);

// ---------- Shiva's fury ----------
T.at(TL.fury, tone(1.4, x => 90 * Math.exp(-x * .8) + 30, { e: env.ad(.01, 1), amp: 1 }), .45);
for (let i = 0; i < 12; i++) T.at(TL.eyes + .1 + i * .07, damru(240 + i * 6, 1), .14 + i * .015, i % 2 ? .2 : -.2);   // the damru rolls up
T.at(TL.eyes, thunder(1.8, .6), .3);
T.at(TL.third, mixb(drum(32, 1, 2.6), bell(note(45), 3, { partials: [[1, 1], [2.4, .5], [3.9, .3]], k: .9 })), .7); sub(TL.third, .6);
T.at(TL.third, fire(1.4, 1, .2), .3);

// ---------- the trishul ----------
T.at(TL.throw - .1, whoosh(.6, 300, 2400, 1), .35);
T.at(TL.throw, whir(TL.impact - TL.throw, 1), .22);
T.at(TL.throw, whoosh(TL.impact - TL.throw + .1, 400, 5000, 1), .4);
T.at(TL.impact, mixb(drum(28, 1, 3), thunder(3, 1), clang(420, 1)), .95); sub(TL.impact, 1);
T.at(TL.impact + .05, noise(1.8, { hp: 2000, lp: 12000, e: env.pluck(3), amp: 1 }), .25);

// ---------- Surya falls; the dark ----------
T.at(TL.fell, drone(TL.drop - TL.fell + .6, 49, 1), .15);
T.at(TL.closing, tone(1.6, x => 400 * Math.exp(-x * 1.4) + 60, { type: 'tri', e: env.ad(.02, 1.2), amp: 1 }), .14);   // consciousness slipping
T.at(TL.drop - .1, whoosh(TL.dark - TL.drop + .2, 3000, 200, 1), .45);
T.at(TL.drop, fire(TL.dark - TL.drop, 1, .4), .3);
T.at(TL.dark - .1, mixb(drum(26, 1, 3.4), rockfall(2.4, 1)), .85); sub(TL.dark - .1, .9);
T.at(TL.dark + .3, thunder(3, .4), .25);

// ---------- the cold ----------
T.at(TL.cold - .2, wind(TL.curse - TL.cold + .8, 4, .8), .3, -.5); T.at(TL.cold - .2, wind(TL.curse - TL.cold + .8, 6, .8), .3, .5);
for (let i = 0; i < 10; i++) T.at(TL.cold + .2 + i * .42 + rnd() * .15, crinkle(.35, 1), .09 + rnd() * .05, rnd() * 1.4 - .7);   // ice creaking
T.at(TL.cold, tone(.8, x => 220 * Math.exp(-x * 3), { e: env.pluck(4), amp: 1 }), .2);   // the lamps go out
T.at(TL.froze - .1, mixb(crinkle(1.6, 1), noise(1.4, { hp: 3000, lp: 10000, e: env.swell(.05, .9), amp: .6 })), .3);
T.at(TL.froze + .1, shimmer(1.4, [96, 93, 89, 86, 84].map(note), .7, .1), .14);
T.at(TL.died, tone(2.2, x => note(57) * (1 - .1 * x), { type: 'tri', e: env.ad(.05, 1.8), amp: 1 }), .1);

// ---------- the curse ----------
T.at(TL.curse, drone(TL.ganesha - TL.curse, 41, 1), .16);
T.at(TL.cursed - .05, thunder(3, 1), .6, -.3); hit(TL.cursed, 34, .5);
T.at(TL.curse2, roar(1.4, 70, 4, .5), .12);
T.at(TL.head - .05, thunder(3.2, 1), .6, .3); hit(TL.head, 30, .65); sub(TL.head, .6);

// ---------- Ganesha in light ----------
T.at(TL.ganesha + .2, om(TL.plea - TL.ganesha + .6, 73, 1), .22);
T.at(TL.gname, bell(note(57), 4, { partials: [[1, 1], [2.4, .5], [3.9, .3]], k: .7 }), .35);
T.at(TL.gname, shimmer(2, [72, 76, 79, 84, 88].map(note), .8, .18), .16);
T.at(TL.elephant + .3, conch(1.8, 233, 1), .14);

// ---------- the plea: near silence, one point of light ----------
T.at(TL.plea, wind(TL.warm - TL.plea + .4, 9, .8), .12);
T.at(TL.one + .05, chime(note(93), .8, 3), .3, .1); T.at(TL.one + .6, chime(note(100), .4, 2), .14, .2);
T.at(TL.one + .2, shimmer(1.8, [84, 88, 91, 96].map(note), .6, .12), .1);

// ---------- she steps out; warmth ----------
T.at(TL.warm - .2, noise(2.2, { brown: true, lp: t => 200 + 900 * t, e: env.swell(1.6, .4), amp: 1 }), .35);   // the light swelling
T.at(TL.stepped + .1, mixb(drum(32, 1, 2.6), bell(note(52), 3.6, { partials: [[1, 1], [2.4, .5], [3.9, .3], [5.4, .15]], k: .8 })), .7); sub(TL.stepped + .1, .5);
T.at(TL.stepped + .2, conch(3, 311, 1), .26);
T.at(TL.stepped + .1, shimmer(2, [76, 79, 84, 88, 91].map(note), .8, .1), .22);
for (let i = 0; i < 10; i++) T.at(TL.wrapped + .2 + i * .32 + rnd() * .15, chirp(1), .05 + rnd() * .03, rnd() * 1.4 - .7);   // birds wake

// ---------- the question ----------
T.at(TL.ask, drone(TL.card - TL.ask, 62, 1), .14);
for (let t = TL.ask + .4; t < TL.card - .3; t += .85) T.at(t, heart(1), .3);
T.at(TL.become, chime(note(81), .6, 2), .12);

// ---------- the card ----------
T.at(TL.card, mixb(drum(34, 1, 2.4), shimmer(2, [84, 88, 91, 96].map(note), .8, .08)), .6);
T.at(TL.card + .3, chime(note(84), 1, 3), .2, -.2); T.at(TL.card + .6, chime(note(88), 1, 3), .18, .2); T.at(TL.card + 1.7, chime(note(91), 1, 3), .16);
temple(TL.set, 62, .18); T.at(TL.end - 3, chime(note(96), .6, 3), .12);

T.write('assets/surya_sfx.wav');

// ---------- the mix: the voice on top, the score ducked under it, the effects ----------
const ff = (inputs, graph, out) => execFileSync('ffmpeg', ['-y', '-v', 'error', ...inputs.flatMap(i => ['-i', i]), '-filter_complex', graph, '-map', '[o]', '-t', String(TL.end), '-ar', '48000', '-ac', '2', out], { stdio: 'inherit' });
const voFx = '[0:a]aresample=48000,volume=1.0,asplit=2[vo][key]';
ff(['assets/surya_vo.wav', 'assets/surya_sfx.wav'], `${voFx};[key]anullsink;[1:a]volume=0.85[fx];[vo][fx]amix=inputs=2:duration=longest:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=12[o]`, 'assets/surya_vo_sfx.wav');
console.log('wrote assets/surya_vo_sfx.wav');
const SCORE = 'assets/surya_score.mp3';
if (existsSync(SCORE)) {
  // the score's level over time (Lyria take 6, the third of a second batch of three, cut to 67.7 s): full under the story, a near silence for the frozen
  // world (the take only dipped for 2 s there), low at the plea, back up as she steps out
  const keys = [[0, 1], [TL.dark - .2, 1], [TL.dark + .2, .08], [TL.curse - .4, .08], [TL.curse + .4, .8], [TL.plea - .2, .8], [TL.plea + .4, .25],
    [TL.warm - .2, .3], [TL.stepped + .2, 1], [TL.end, 1]];
  const env = keys.slice(1).reduceRight((acc, [t1, v1], i) => { const [t0, v0] = keys[i]; return `if(lt(t,${t1.toFixed(3)}),${v0}+(${v1}-${v0})*(t-${t0.toFixed(3)})/${Math.max(.001, t1 - t0).toFixed(3)},${acc})`; }, '1');
  const score = `[2:a]aresample=48000,atrim=0:${TL.end},volume='${env}':eval=frame,volume=0.42,afade=t=out:st=${(TL.end - 2).toFixed(2)}:d=2[sc]`;
  ff(['assets/surya_vo.wav', 'assets/surya_sfx.wav', SCORE],
    `${voFx};${score};[sc][key]sidechaincompress=threshold=0.02:ratio=6:attack=25:release=450:makeup=1[duck];[1:a]volume=0.85[fx];[vo][fx][duck]amix=inputs=3:duration=longest:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=12[o]`, 'assets/surya_mix.wav');
  console.log('wrote assets/surya_mix.wav');
}
