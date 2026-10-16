// kailasa_sfx.mjs: the sound effects for reel/kailasa-ellora (src/scenes/kailasa.js), and the final mix. Times come
// from TL (src/scenes/kailasa_tl.js, itself from the voice's timings in src/scenes/kailasa_vo.js), so re-rendering the
// voice moves the effects with it.
//   The hook: a hard first frame, dawn wind; "CARVED": a chisel strike, a hit, a sub. Kailasa: a temple bell, om;
//   Shiva's mountain: a chime. No bricks, no blocks, no mortar: a strike-through on each. The hill: wind. The trenches:
//   picks and chisels, rock falling; the island: a hit and a chime. Top down: chisels and a rockfall at each level. The
//   carvers at dusk: their blows in turn, debris. The chisel close: three blows, the fourth breaks a chip, which falls a
//   long way and clinks; FINAL: a heavy hit. The reveal: a conch and a shimmer. The elephants and Nandi: lamps, bells.
//   The bridge: a whoosh. Ravana: the mountain groaning. The copper plate: a metallic shimmer as the light sweeps. The
//   gods: high wind, chimes; struck with wonder: om and a bell. Made itself: a shimmer. "BUILT": the biggest hit, a
//   conch. The night: crickets, bells. The card: chimes.
//   node tools/kailasa_sfx.mjs   → assets/kailasa_sfx.wav, and with the score assets/kailasa_mix.wav (voice + SFX + score)
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { track, tone, noise, bell, mixb, whoosh, crackle, click, env, note, seed, rnd, thunder, wind, drum, fire, om, conch, chime, chirp, roar, rockfall, shimmer, drone, crunch, thud, clang } from './sfx.mjs';

const ctx = {}; runInNewContext(readFileSync('src/scenes/kailasa_vo.js', 'utf8') + '\n' + readFileSync('src/scenes/kailasa_tl.js', 'utf8') + '\n;this.VO = VO; this.TL = TL;', ctx);
const { TL } = ctx;
const T = track(TL.end);
seed(31);
const hit = (t, f = 36, amp = 1) => T.at(t, mixb(drum(f, 1, 2.4), noise(1, { brown: true, lp: 200, e: env.pluck(2.6), amp: 1.3 })), amp);
const sub = (t, amp = 1) => T.at(t, tone(2.2, x => 62 * Math.exp(-x * 1.1) + 26, { e: env.ad(.005, 1.3), amp: 1 }), amp);
const temple = (t, f, amp) => T.at(t, bell(note(f), 4, { partials: [[1, 1], [2.4, .5], [3.9, .3]], k: .7 }), amp);
// iron on stone: a ring and a crunch
const chisel = (t, amp = 1, pan = 0, f = 88) => { T.at(t, clang(note(f + Math.round(rnd() * 3)), 1), .35 * amp, pan); T.at(t, crunch(1), .5 * amp, pan); };

// ---------- the hook ----------
hit(0, 38, .7);
T.at(0, wind(TL.name + .6, 0, .4), .16, -.5); T.at(0, wind(TL.name + .6, 2, .4), .16, .5);
T.at(TL.carved - .5, whoosh(.6, 300, 3000, 1), .2);
chisel(TL.carved, 1.4); hit(TL.carved, 34, .6); sub(TL.carved, .5);
T.at(TL.carved + .1, rockfall(1.4, .6), .2);
T.at(TL.one, chime(note(76), .7, 3), .12);

// ---------- Kailasa, at Ellora; Shiva's mountain ----------
temple(TL.name + .3, 52, .26);
T.at(TL.name, om(TL.none - TL.name + .4, 82, 1), .14);
T.at(TL.mountain - .2, shimmer(2, [79, 83, 86, 91].map(note), .6, .14), .14);

// ---------- no bricks, no blocks, no mortar; the hill ----------
for (const w of [TL.bricks, TL.blocks, TL.mortar]) { T.at(w - .3, chime(note(84), .4, 1.2), .08); T.at(w + .3, whoosh(.35, 800, 4000, 1), .2); T.at(w + .55, thud(1), .3); }
T.at(TL.hill - .2, wind(TL.trench - TL.hill + .6, 4, .8), .22, -.3); T.at(TL.hill - .2, wind(TL.trench - TL.hill + .6, 5, .8), .2, .3);

// ---------- the three trenches; the island ----------
for (let t = TL.three - .1; t < TL.standing - .5; t += .19 + rnd() * .1) chisel(t, .35 + rnd() * .2, (rnd() - .5) * 1.4, 92);
T.at(TL.down, rockfall(2.4, 1), .25); T.at(TL.down + 1.4, rockfall(2, .8), .2, .4);
T.at(TL.trench, noise(TL.topdown - TL.trench, { brown: true, lp: 160, e: env.swell(.8, .6), amp: 1 }), .2);
hit(TL.standing, 40, .45); T.at(TL.standing, chime(note(79), 1, 3), .16);

// ---------- carved from the top down ----------
for (let t = TL.top - .3; t < TL.floor + 1.1; t += .16 + rnd() * .12) chisel(t, .3 + rnd() * .25, (rnd() - .5) * 1.4, 90);
for (const w of [TL.tower, TL.halls, TL.floor]) { T.at(w + .1, rockfall(1.6, 1), .28, (rnd() - .5) * .6); T.at(w + .05, drum(48, 1, .8), .3); }
T.at(TL.topdown, noise(TL.tonnes - TL.topdown, { brown: true, lp: 200, e: env.swell(.6, .6), amp: 1 }), .16);

// ---------- the carvers at dusk: each blow when his mallet comes down (carveSwing in the scene) ----------
const CARVERS = [[-.6, 0], [-.2, 1.7], [.2, 3.1], [.6, 4.4]];
for (const [pan, ph] of CARVERS) for (let n = 0; n < 200; n++) { const t = (n - ph * .23) / 1.25; if (t > TL.tonnes + .2 && t < TL.final + .2) chisel(t, .55, pan, 86); }
T.at(TL.tonnes, wind(TL.final - TL.tonnes + .4, 6, .8), .14);
T.at(TL.tonnes + .5, rockfall(3, .9), .2, -.3); T.at(TL.hand - .2, rockfall(2, .8), .18, .3);
T.at(TL.hand, drum(44, 1, 1.2), .3);

// ---------- the chisel, close: three blows, then the one that breaks a chip; FINAL ----------
const STRIKES = [TL.final + .45, TL.final + 1.25, TL.final + 2.05, TL.strike + .1];
STRIKES.forEach((s, i) => { chisel(s, i === 3 ? 1.6 : 1, 0, 84); if (i === 3) { T.at(s, crackle(.5, 1), .3); T.at(s + .2, whoosh(1.1, 1200, 200, 1), .12); T.at(s + 1.35, click(1), .12, -.2); T.at(s + 1.5, click(1), .07, -.2); } });
hit(TL.fin, 32, .85); sub(TL.fin, .7);

// ---------- what remained; the elephants; Nandi; the bridge ----------
T.at(TL.reveal - .1, conch(2.8, 294, 1), .26);
T.at(TL.reveal + .2, shimmer(2.4, [72, 76, 79, 84, 88, 91].map(note), .8, .12), .18);
T.at(TL.reveal, wind(TL.eleph - TL.reveal + .5, 8, 1), .12);
T.at(TL.tall - .1, drum(40, 1, 1.4), .3);
T.at(TL.eleph + .3, fire(TL.bridge - TL.eleph, .3, .5), .1);
temple(TL.elephants, 48, .2);
temple(TL.nandi + .2, 55, .24);
T.at(TL.bridge - .3, whoosh(1.4, 400, 2400, 1), .18);
T.at(TL.bridge, chime(note(81), .7, 3), .12);

// ---------- Ravana under the mountain ----------
T.at(TL.ravana, noise(TL.plate - TL.ravana + .2, { brown: true, lp: 130, e: env.swell(.6, .6), amp: 1.3 }), .26);
T.at(TL.ravana + .2, fire(TL.plate - TL.ravana, .4, .6), .1);
T.at(TL.lifting - .1, roar(1.8, 110, 6, .8), .18); T.at(TL.lifting, rockfall(2, .8), .22); hit(TL.lifting, 42, .35);

// ---------- the copper plate; the gods in their sky-chariots ----------
T.at(TL.plate + .6, shimmer(2.8, [84, 86, 91, 93, 98].map(note), .5, .3), .12);
T.at(TL.plate + .4, whoosh(2.6, 500, 3000, 1), .08);
T.at(TL.gods - .2, wind(TL.quote - TL.gods + .6, 9, 1), .18, -.4); T.at(TL.gods - .2, wind(TL.quote - TL.gods + .6, 10, 1), .16, .4);
for (let i = 0; i < 5; i++) T.at(TL.gods + .2 + i * .5, chime(note(84 + [0, 3, 7, 10, 12][i]), .5, 2.4), .08, (i - 2) * .3);
T.at(TL.struck - .1, om(TL.quote - TL.struck + 1.5, 98, 1), .2); temple(TL.struck, 50, .22);

// ---------- made itself; the architect; BUILT ----------
T.at(TL.quote, drone(TL.arch - TL.quote + .4, 65, 1), .1);
T.at(TL.itself - .1, shimmer(2.4, [79, 83, 86, 91, 95].map(note), .7, .14), .16);
T.at(TL.arch, om(TL.ask - TL.arch + .4, 73, 1), .14);
T.at(TL.built - 1, whoosh(1.1, 200, 2400, 1), .2);
hit(TL.built, 30, 1); sub(TL.built, .8); T.at(TL.built + .05, conch(3.2, 311, 1), .3);
T.at(TL.built + .1, shimmer(2.6, [72, 76, 79, 84, 88, 91, 96].map(note), .9, .1), .2);

// ---------- the night and the card ----------
temple(TL.ask + .1, 55, .24); temple(TL.ask + 2.6, 55, .16);
for (let i = 0; i < 14; i++) T.at(TL.ask + .3 + i * .42 + rnd() * .2, chirp(1), .03, rnd() * 1.4 - .7);
T.at(TL.ask, fire(TL.end - TL.ask, .25, .3), .05);
T.at(TL.card, om(TL.end - TL.card, 98, 1), .14);
T.at(TL.card + .3, chime(note(84), 1, 3), .2, -.2); T.at(TL.card + .55, chime(note(88), 1, 3), .18, .2); T.at(TL.card + 1.7, chime(note(91), 1, 3), .16);

T.write('assets/kailasa_sfx.wav');

// ---------- the mix: the voice on top, the score ducked under it, the effects ----------
const ff = (inputs, graph, out) => execFileSync('ffmpeg', ['-y', '-v', 'error', ...inputs.flatMap(i => ['-i', i]), '-filter_complex', graph, '-map', '[o]', '-t', String(TL.end), '-ar', '48000', '-ac', '2', out], { stdio: 'inherit' });
const voFx = '[0:a]aresample=48000,volume=1.0,asplit=2[vo][key]';
const SCORE = process.env.SCORE || 'assets/kailasa_score.mp3', HEAD = +(process.env.SCORE_HEAD || 0);
if (existsSync(SCORE)) {
  // the score's level over time: it drops away under the chisel close-up and comes back on FINAL
  const keys = [[0, 1], [TL.final - .3, 1], [TL.final + .3, .2], [TL.fin - .05, .2], [TL.fin + .5, 1], [TL.end, 1]];
  const env = keys.slice(1).reduceRight((acc, [t1, v1], i) => { const [t0, v0] = keys[i]; return `if(lt(t,${t1.toFixed(3)}),${v0}+(${v1}-${v0})*(t-${t0.toFixed(3)})/${Math.max(.001, t1 - t0).toFixed(3)},${acc})`; }, '1');
  const score = `[2:a]aresample=48000,atrim=${HEAD}:${HEAD + TL.end},asetpts=PTS-STARTPTS,volume='${env}':eval=frame,volume=0.42,afade=t=out:st=${(TL.end - 3).toFixed(2)}:d=3[sc]`;
  ff(['assets/kailasa_vo.wav', 'assets/kailasa_sfx.wav', SCORE],
    `${voFx};${score};[sc][key]sidechaincompress=threshold=0.02:ratio=6:attack=25:release=450:makeup=1[duck];[1:a]volume=0.85[fx];[vo][fx][duck]amix=inputs=3:duration=longest:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=12[o]`, 'assets/kailasa_mix.wav');
  console.log('wrote assets/kailasa_mix.wav');
} else {
  ff(['assets/kailasa_vo.wav', 'assets/kailasa_sfx.wav'], `${voFx};[key]anullsink;[1:a]volume=0.85[fx];[vo][fx]amix=inputs=2:duration=longest:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=12[o]`, 'assets/kailasa_mix.wav');
  console.log('wrote assets/kailasa_mix.wav (voice + SFX; no score yet)');
}
