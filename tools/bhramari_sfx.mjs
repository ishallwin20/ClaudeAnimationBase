// bhramari_sfx.mjs: the sound effects for reel/bhramari-bees (src/scenes/bhramari.js), and the final mix. Times come
// from TL (src/scenes/bhramari_tl.js, itself from the voice's timings in src/scenes/bhramari_vo.js), so re-rendering
// the voice moves the effects with it.
//   The hook: a hard first frame, the storm, his laugh, one gold bee buzzing past, a sub hit on "SIX LEGS". The tapas:
//   desert wind, a ticking that speeds up as days race, leaves, a drop, a gust, then silence. The boon: a conch, the
//   lotus's shimmer, a lock for each seal. Heaven: war drums, fire, the city falling. The shield: a chant that shatters.
//   The prayer: near silence, one tiny chime. The bee: it buzzes in and lands; his laugh; a tick for each leg, rising;
//   a sub drop on SIX. Bhramari: one bee swelling into millions (the hum is the music here), her eyes: a hit. The swarm:
//   the roar of it, drums, his scream. Gone: silence, the crown's clang, one bee. Srisailam: birds, a temple bell, a
//   soft hum. The card: chimes.
//   node tools/bhramari_sfx.mjs   → assets/bhramari_sfx.wav, assets/bhramari_mix.wav (voice + SFX + score) and
//                                    assets/bhramari_vo_sfx.wav (voice + SFX, for music added on Instagram)
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { track, tone, noise, bell, mixb, whoosh, crackle, crinkle, plink, click, env, note, seed, rnd, thunder, wind, drum, fire, om, conch, laughter, chime, chirp, clang, roar, rockfall, shimmer, drone, buzz, swarmHum } from './sfx.mjs';

const ctx = {}; runInNewContext(readFileSync('src/scenes/bhramari_vo.js', 'utf8') + '\n' + readFileSync('src/scenes/bhramari_tl.js', 'utf8') + '\n;this.VO = VO; this.TL = TL;', ctx);
const { TL, VO } = ctx, six = VO.caps.find(k => k.id === 'hook2' && /SIX/.test(k.text)).at[0];
const T = track(TL.end);
seed(16);
const hit = (t, f = 36, amp = 1) => T.at(t, mixb(drum(f, 1, 2.4), noise(1, { brown: true, lp: 200, e: env.pluck(2.6), amp: 1.3 })), amp);
const sub = (t, amp = 1) => T.at(t, tone(2.2, x => 62 * Math.exp(-x * 1.1) + 26, { e: env.ad(.005, 1.3), amp: 1 }), amp);
// a buzz that pans across: slices of one fly-by, each at its own pan
const flyBy = (t0, dur, f0, f1, p0, p1, amp) => { const n = 8; for (let i = 0; i < n; i++) { const u = i / n; T.at(t0 + u * dur, buzz(dur / n + .08, f0 + (f1 - f0) * u, f0 + (f1 - f0) * (u + 1 / n), 1), amp * Math.sin(Math.PI * (u + .5 / n)) ** .5, p0 + (p1 - p0) * u); } };
const laugh = (t, dur, amp) => { T.at(t, roar(.4, 150, 3, .3), amp * .4); T.at(t + .1, laughter(dur, 1), amp, -.3); T.at(t + .2, laughter(dur - .1, 1), amp * .9, .3); for (let i = 0; i < Math.floor(dur / .6); i++) T.at(t + .15 + i * .6, tone(.25, x => 120 - x * 80, { type: 'tri', e: env.pluck(10), amp: 1 }), amp * .45, i % 2 ? .3 : -.3); };

// ---------- the hook (0 → tapas) ----------
hit(0, 38, .75);
T.at(0, wind(TL.tapas + .6, 0, .4), .22, -.5); T.at(0, wind(TL.tapas + .6, 2, .4), .22, .5);
T.at(0, noise(TL.tapas + .4, { brown: true, lp: t => 110 + 50 * Math.sin(t * 1.3), e: env.swell(.3, .6), amp: 1.2 }), .3);
T.at(TL.strike1, thunder(2.6, .8), .5, -.5); T.at(TL.strike2, thunder(2.4, 1), .5, .5);
laugh(.25, 2.6, .28);
flyBy(TL.gbee, .95, 300, 210, -.9, .9, .5);
T.at(six, mixb(drum(34, 1, 2.6), bell(note(45), 3, { partials: [[1, 1], [2.4, .5], [3.9, .3]], k: .9 })), .6); sub(six, .5);

// ---------- the tapas: time racing in the desert, then nothing ----------
T.at(TL.tapas, wind(TL.boon - TL.tapas, 3, 1), .2, -.4); T.at(TL.tapas, wind(TL.boon - TL.tapas, 5, 1), .2, .4);
T.at(TL.tapas, om(TL.nothing - TL.tapas + .4, 73, 1), .12);
for (let t = TL.tapas + .8, gap = .5; t < TL.nothing - .1; t += gap, gap = Math.max(.12, gap * .9)) T.at(t, click(1), .16, (rnd() - .5) * .6);   // days ticking past, faster
for (let t = TL.tapas + .8; t < TL.nothing; t += 1.4) T.at(t, whoosh(1.3, 300, 1400, 1), .08, -.6);   // the sun's arcs
T.at(TL.leaves - .2, crinkle(1.2, 1), .22, -.2); T.at(TL.leaves + .3, crinkle(.8, 1), .14, .3);
T.at(TL.water - .05, mixb(plink(note(88), 1), bell(note(83), 1.6, { partials: [[1, 1], [2.1, .3]], k: 3 })), .35); T.at(TL.water + .1, shimmer(1, [91, 88, 84, 79].map(note), .6, .09), .12);
T.at(TL.air - .1, whoosh(1.4, 400, 3200, 1), .3, -.6); T.at(TL.air + .3, whoosh(1.2, 3000, 500, 1), .2, .6);
T.at(TL.nothing, mixb(om(TL.boon - TL.nothing + .6, 55, 1), chime(note(76), .6, 3)), .2);

// ---------- the boon ----------
T.at(TL.lotus - .25, conch(2.6, 294, 1), .3);
T.at(TL.lotus, shimmer(1.6, [72, 76, 79, 84, 88, 91].map(note), .8, .12), .22);
T.at(TL.lotus, drone(TL.heaven - TL.lotus + .4, 98, 1), .14);
[TL.seal1, TL.seal2, TL.seal3].forEach((t0, i) => { T.at(t0 + .25, mixb(clang(380 + i * 60, 1), drum(42 - i * 3, 1, 1.2), noise(.2, { hp: 1000, lp: 6000, e: env.pluck(14), amp: .6 })), .45, (i - 1) * .4); T.at(t0 + .25, bell(note(50 + i * 3), 2.4, { partials: [[1, 1], [2.4, .5], [3.9, .3]], k: 1.4 }), .2); });

// ---------- heaven falls ----------
T.at(TL.heaven, fire(TL.shield - TL.heaven + .4, .4, 1), .35);
for (let i = 0; i < 10; i++) T.at(TL.heaven + .1 + i * .32, drum(i % 2 ? 58 : 46, 1, .5), .32, i % 2 ? .3 : -.3);   // war drums
T.at(TL.storm - .05, mixb(rockfall(2.4, 1), thunder(2.4, .8)), .45);
T.at(TL.storm + .1, roar(2, 140, 12, .8), .2);                                  // the army
for (let i = 0; i < 6; i++) T.at(TL.storm + .2 + i * .3, whoosh(.7, 1800, 300, .8), .12, rnd() * 1.4 - .7);   // the gods falling
laugh(TL.heaven + 1.4, 1.8, .2);

// ---------- the shield: the chant, Brihaspati, the letters shatter ----------
T.at(TL.shield, om(TL.drop - TL.shield + .2, 98, 1), .22); T.at(TL.shield + .3, om(TL.drop - TL.shield, 147, 1), .1, .2);
for (let t = TL.shield + .4, i = 0; t < TL.drop; t += .55, i++) T.at(t, chime(note(79 + [0, 3, 5, 7, 10][i % 5]), .5, 1.5), .06, (i % 2 ? .4 : -.4));
T.at(TL.brihas, bell(note(57), 3, { partials: [[1, 1], [2.1, .5], [3.3, .25]], k: .9 }), .25);
T.at(TL.drop, mixb(noise(.5, { hp: 3000, lp: 11000, e: env.pluck(7), amp: 1 }), ...[0, 1, 2, 3, 4, 5, 6, 7].map(i => { const b = bell(note(96 - i * 3), .6, { partials: [[1, 1], [2.6, .4]], k: 6 }), o = new Float32Array(b.length + i * 2400); o.set(b, i * 2400); return o; })), .3);
T.at(TL.drop + .05, tone(1.2, x => 420 * Math.exp(-x * 2), { type: 'tri', e: env.ad(.01, .6), amp: 1 }), .15);   // the chant collapsing

// ---------- the prayer: near silence, then one chime ----------
T.at(TL.pray, drone(TL.beeIn - TL.pray + .3, 65, 1), .1);
T.at(TL.pray, wind(TL.beeIn - TL.pray, 7, .8), .1);
T.at(TL.spark, chime(note(93), .8, 3), .22, .3); T.at(TL.spark + .6, chime(note(100), .4, 2), .1, .3);

// ---------- THE BEE ----------
flyBy(TL.beeIn, TL.land - TL.beeIn + .2, 330, 230, .8, 0, .45);
T.at(TL.land + .05, click(1), .3);
T.at(TL.land + .2, buzz(.35, 240, 200, 1), .2);                                // wings settling
laugh(VO.lines.abee.end + .05, 1.5, .3);
T.at(TL.count - .1, drone(TL.six - TL.count + .3, 49, 1), .15);
TL.legs.forEach((t0, i) => { T.at(t0, mixb(plink(note(72 + i * 2), 1), bell(note(84 + i * 2), 1.2, { partials: [[1, 1], [2.76, .3]], k: 3 })), .32 + i * .04, i < 3 ? -.4 : .4); });
T.at(TL.six, mixb(drum(30, 1, 3), bell(note(41), 4, { partials: [[1, 1], [2.4, .5], [3.9, .3]], k: .7 })), .8); sub(TL.six, .7);
T.at(TL.six, shimmer(1.4, [84, 88, 91, 96].map(note), .7, .08), .18);

// ---------- Bhramari: one bee becomes millions ----------
T.at(TL.six + .5, swarmHum(TL.face - TL.six + 1.2, 28, .97, 1, 190), .5, -.2);
T.at(TL.six + .9, swarmHum(TL.face - TL.six + .8, 22, .97, 1, 260), .32, .3);
T.at(TL.formed - .3, conch(3, 311, 1), .28);                                    // the goddess
T.at(TL.face, swarmHum(TL.swarm - TL.face + .4, 20, .2, 1, 200), .3);
T.at(TL.eyes, mixb(drum(34, 1, 2.6), bell(note(52), 3.6, { partials: [[1, 1], [2.4, .5], [3.9, .3], [5.4, .15]], k: .8 })), .75); sub(TL.eyes, .5);
T.at(TL.eyes, shimmer(1.6, [76, 79, 84, 88, 91].map(note), .8, .07), .2);

// ---------- the swarm ----------
T.at(TL.swarm, swarmHum(TL.gone - TL.swarm + .2, 32, .5, 1, 170), .6, -.3); T.at(TL.swarm + .2, swarmHum(TL.gone - TL.swarm, 26, .5, 1, 240), .45, .3);
for (let i = 0; i < 9; i++) T.at(TL.swarm + .2 + i * .36, drum(i % 3 ? 50 : 40, 1, .6), .35, i % 2 ? .3 : -.3);
T.at(TL.millions, mixb(drum(32, 1, 2.4), thunder(2.6, .8)), .55);
T.at(TL.swarm + .4, roar(2.4, 160, 12, .7), .14, -.5);                          // the army breaks
T.at(TL.engulf, mixb(drum(30, 1, 3), noise(1.4, { brown: true, lp: 240, e: env.pluck(2), amp: 1.5 })), .8);
T.at(TL.engulf + .1, roar(2.3, 120, 6, 1), .45);                                 // his scream
T.at(TL.engulf + .3, thunder(2.4, 1), .4, .4);

// ---------- gone: silence, the crown, one bee ----------
T.at(TL.gone - .2, whoosh(1.6, 2400, 300, 1), .3);                              // the swarm lifting away
T.at(TL.gone, wind(TL.sri - TL.gone, 9, .8), .12, -.4); T.at(TL.gone, wind(TL.sri - TL.gone, 10, .8), .12, .4);
T.at(TL.crown + .7, clang(560, 1), .45, .2); T.at(TL.crown + .86, clang(620, .5), .25, .25); T.at(TL.crown + 1.0, clang(600, .25), .15, .25);
flyBy(TL.lone - .6, 1.4, 280, 220, .7, .2, .3);

// ---------- Srisailam at dawn ----------
for (let i = 0; i < 8; i++) T.at(TL.sri + .3 + i * .45 + rnd() * .2, chirp(1), .05 + rnd() * .03, rnd() * 1.4 - .7);
T.at(TL.sri + .2, bell(note(55), 4, { partials: [[1, 1], [2.4, .5], [3.9, .3]], k: .7 }), .3); T.at(TL.sri + 2.2, bell(note(55), 3, { partials: [[1, 1], [2.4, .5], [3.9, .3]], k: .8 }), .2);
T.at(TL.sri + 1.2, swarmHum(TL.ask - TL.sri, 14, 0, 1, 230), .12);              // the hum behind her shrine

// ---------- the ask and the card ----------
T.at(TL.ask, om(TL.end - TL.ask, 98, 1), .18);
T.at(TL.ask + .2, bell(note(62), 4, { partials: [[1, 1], [2.4, .5], [3.9, .3]], k: .7 }), .25);
T.at(TL.card + .3, chime(note(84), 1, 3), .2, -.2); T.at(TL.card + .55, chime(note(88), 1, 3), .18, .2); T.at(TL.card + 1.7, chime(note(91), 1, 3), .16);

T.write('assets/bhramari_sfx.wav');

// ---------- the mix: the voice on top, the score ducked under it, the effects ----------
const ff = (inputs, graph, out) => execFileSync('ffmpeg', ['-y', '-v', 'error', ...inputs.flatMap(i => ['-i', i]), '-filter_complex', graph, '-map', '[o]', '-t', String(TL.end), '-ar', '48000', '-ac', '2', out], { stdio: 'inherit' });
const voFx = '[0:a]aresample=48000,volume=1.0,asplit=2[vo][key]';
ff(['assets/bhramari_vo.wav', 'assets/bhramari_sfx.wav'], `${voFx};[key]anullsink;[1:a]volume=0.85[fx];[vo][fx]amix=inputs=2:duration=longest:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=12[o]`, 'assets/bhramari_vo_sfx.wav');
console.log('wrote assets/bhramari_vo_sfx.wav');
const SCORE = 'assets/bhramari_score.mp3';
if (existsSync(SCORE)) {
  // the score's level over time: Lyria played through the silences the brief asked for, so the mix makes them: near
  // silence from the bee's arrival to SIX, low under the swarm's hum until her eyes open, almost nothing at the empty throne
  const keys = [[0, 1], [TL.pray - .2, 1], [TL.beeIn, .3], [TL.beeIn + .6, .05], [TL.six - .05, .05], [TL.six + .4, .3], [TL.eyes - .3, .45], [TL.eyes, 1],
    [TL.gone - .15, 1], [TL.gone + .25, .08], [TL.sri - .6, .08], [TL.sri + .6, 1], [TL.end, 1]];
  const env = keys.slice(1).reduceRight((acc, [t1, v1], i) => { const [t0, v0] = keys[i]; return `if(lt(t,${t1.toFixed(3)}),${v0}+(${v1}-${v0})*(t-${t0.toFixed(3)})/${Math.max(.001, t1 - t0).toFixed(3)},${acc})`; }, '1');
  const score = `[2:a]aresample=48000,atrim=0:${TL.end},volume='${env}':eval=frame,volume=0.42,afade=t=out:st=${(TL.end - 2).toFixed(2)}:d=2[sc]`;
  ff(['assets/bhramari_vo.wav', 'assets/bhramari_sfx.wav', SCORE],
    `${voFx};${score};[sc][key]sidechaincompress=threshold=0.02:ratio=6:attack=25:release=450:makeup=1[duck];[1:a]volume=0.85[fx];[vo][fx][duck]amix=inputs=3:duration=longest:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=12[o]`, 'assets/bhramari_mix.wav');
  console.log('wrote assets/bhramari_mix.wav');
}
