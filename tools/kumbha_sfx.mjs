// kumbha_sfx.mjs: the sound effects for reel/kumbhakarna-sleep (src/scenes/kumbha.js), and the final mix. Times come
// from TL (src/scenes/kumbha_tl.js, itself from the voice's timings in src/scenes/kumbha_vo.js), so re-rendering the
// voice moves the effects with it.
//   The hook: a hard first frame, the tapas fires, a low chant; "TONGUE": a shimmer and a hit. The name: a drum and a
//   growl. The newborn: a roar, wings bursting away. The garden: chimes, then a low drone and a laugh. The vajra:
//   thunder, a hit, a sub. The tusk: a crunch, the elephant's scream; the stab: a hit. Tapas: fire, then icy water.
//   Brahma: a conch, om. Saraswati: veena-like plucks and a shimmer; the syllables pouring in: a whoosh. SLEEP: a hit.
//   "So be it": a temple bell. She leaves: a whoosh out; he freezes: near silence, a stinger. Six months: a drone, the
//   moon's sweeps; one day: a chime and birds. The war: drums, food thudding down; conches and drums, birds falling;
//   the elephants: trumpets and the stampede. The yawn: a huge low groan; HUNGRY: a hit and a roar. The cave: snoring.
//   The card: chimes.
//   node tools/kumbha_sfx.mjs   → assets/kumbha_sfx.wav, and with the score assets/kumbha_mix.wav (voice + SFX + score)
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { track, tone, noise, bell, mixb, whoosh, crackle, click, env, note, seed, rnd, thunder, wind, drum, fire, om, conch, chime, chirp, roar, rockfall, shimmer, drone, crunch, thud, laughter, wingbeat, splash } from './sfx.mjs';

const ctx = {}; runInNewContext(readFileSync('src/scenes/kumbha_vo.js', 'utf8') + '\n' + readFileSync('src/scenes/kumbha_tl.js', 'utf8') + '\n;this.VO = VO; this.TL = TL;', ctx);
const { TL } = ctx;
const T = track(TL.end);
seed(41);
const hit = (t, f = 36, amp = 1) => T.at(t, mixb(drum(f, 1, 2.4), noise(1, { brown: true, lp: 200, e: env.pluck(2.6), amp: 1.3 })), amp);
const sub = (t, amp = 1) => T.at(t, tone(2.2, x => 62 * Math.exp(-x * 1.1) + 26, { e: env.ad(.005, 1.3), amp: 1 }), amp);
const temple = (t, f, amp) => T.at(t, bell(note(f), 4, { partials: [[1, 1], [2.4, .5], [3.9, .3]], k: .7 }), amp);
// an elephant's trumpet: a bright sawtooth blare that bends up and wavers, with breath
const trumpet = (dur = 1.1, f = 520) => mixb(tone(dur, x => f * (1 + .35 * Math.min(1, x * 4)) * (1 + .03 * Math.sin(x * 40)), { type: 'saw', e: env.swell(.05, .35), amp: .7 }), noise(dur, { hp: 1200, lp: 5000, e: env.swell(.05, .3), amp: .4 }));
// a veena-like pluck: a bright string with a bend
const pluck = (f) => mixb(tone(1.4, x => f * (1 + .01 * Math.min(1, x * 6)), { type: 'tri', e: env.pluck(3), amp: .8 }), tone(1, f * 2, { e: env.pluck(5), amp: .25 }));
// a snore: a rasping low noise swelling in, then a soft whistle out
const snore = () => mixb(noise(1.4, { brown: true, lp: x => 300 + 200 * Math.sin(x * 60), e: env.hann(), amp: 1 }), tone(1, x => 900 - x * 200, { e: env.ad(1.4, .6), amp: .05 }));

// ---------- the hook ----------
hit(0, 38, .7);
T.at(0, fire(TL.tongue - 1, .5, .8), .2);
T.at(0, om(TL.tongue - 1, 65, 1), .14);
T.at(TL.tongue - 1.6, whoosh(1.4, 300, 3000, 1), .18);
T.at(TL.tongue - .2, shimmer(1.8, [79, 83, 86, 91, 95].map(note), .7, .08), .2); hit(TL.tongue, 34, .6); sub(TL.tongue, .5);

// ---------- Kumbhakarna, Ravana's brother ----------
T.at(TL.name, drum(44, 1, 1.4), .4); T.at(TL.name + .2, roar(1.6, 90, 4, .7), .18);
T.at(TL.name, fire(TL.born - TL.name + .4, .3, .5), .12);

// ---------- the newborn: a roar, the birds burst away ----------
T.at(TL.born, wind(TL.ate - TL.born + .4, 2, .8), .16);
T.at(TL.born + .6, roar(2.2, 80, 6, 1), .3);
for (let i = 0; i < 14; i++) T.at(TL.thousands - .2 + i * .09 + rnd() * .05, wingbeat(1, 1), .1, (rnd() - .5) * 1.4);

// ---------- Indra's garden: chimes, then the shadow ----------
for (let i = 0; i < 6; i++) T.at(TL.ate + .2 + i * .45, chime(note(84 + [0, 4, 7, 12, 7, 4][i]), .5, 2), .08, (i - 2.5) * .25);
T.at(TL.ate + .8, drone(TL.indra - TL.ate, 49, 1), .14);
T.at(TL.apsaras - .2, laughter(2.2, 1), .14); T.at(TL.apsaras, roar(1.6, 70, 5, .7), .2);

// ---------- the vajra ----------
T.at(TL.indra, thunder(2, .5), .2, -.4);
T.at(TL.vajra - .3, whoosh(.4, 600, 5000, 1), .25);
T.at(TL.vajra, thunder(3, 1.2), .55); hit(TL.vajra, 32, .7); sub(TL.vajra, .6);
T.at(TL.vajra + .2, roar(1.6, 100, 6, 1), .25);

// ---------- the tusk; the stab ----------
T.at(TL.ripped + .2, mixb(crunch(1), crackle(.5, 1)), .5); T.at(TL.ripped + .25, trumpet(1.4, 600), .25, -.4);
T.at(TL.stab - .25, whoosh(.35, 400, 4000, 1), .3); hit(TL.stab, 34, .75); sub(TL.stab, .5); T.at(TL.stab + .05, thunder(2, .8), .3, .4);

// ---------- tapas: the fires all summer, the water all winter ----------
T.at(TL.tapas, fire(TL.water - TL.tapas + .5, .6, 1), .3);
T.at(TL.tapas, om(TL.brahma - TL.tapas + .4, 73, 1), .14);
for (let t = TL.tapas + .5; t < TL.water - .5; t += 1.4) T.at(t, whoosh(1.4, 300, 1400, 1), .07, -.5);   // the sun's arcs
T.at(TL.water - .1, splash(1), .35); T.at(TL.water, wind(TL.brahma - TL.water + .4, 5, 1), .2);
T.at(TL.water + .2, chime(note(88), .6, 3), .12);

// ---------- Brahma; the gods beg ----------
T.at(TL.brahma - .1, conch(2.8, 294, 1), .26);
T.at(TL.brahma + .3, shimmer(2.4, [72, 76, 79, 84, 88, 91].map(note), .8, .12), .16);
T.at(TL.begged, roar(2.4, 160, 12, .5), .08);   // the gods' murmur
temple(TL.delusion, 50, .2);

// ---------- Saraswati; the syllables pour into his mouth ----------
[74, 76, 79, 81, 83, 86, 88, 91].forEach((m, i) => T.at(TL.sara + .2 + i * .32, pluck(note(m)), .16, (i - 3.5) * .15));
T.at(TL.saraswati, shimmer(2.4, [84, 88, 91, 96, 100].map(note), .7, .16), .16);
T.at(TL.mouth - .8, whoosh(1.2, 4000, 400, 1), .25); T.at(TL.mouth, chime(note(79), 1, 3), .15);

// ---------- "I wish to SLEEP"; "So be it" ----------
hit(TL.sleep, 40, .45); T.at(TL.sleep, shimmer(1.6, [91, 95, 98].map(note), .5, .1), .1);
temple(TL.be, 48, .34); T.at(TL.be + .1, shimmer(2.4, [72, 76, 79, 84].map(note), .8, .2), .14);

// ---------- she leaves; he freezes; "What came out of my MOUTH?!" ----------
T.at(TL.left + .2, whoosh(1.4, 400, 4000, 1), .2);
T.at(TL.froze, click(1), .2);
hit(TL.what + .4, 46, .4); T.at(TL.what + .4, tone(.8, x => 1200 - x * 600, { type: 'tri', e: env.ad(.01, .6), amp: 1 }), .08);

// ---------- six months asleep, one day awake ----------
T.at(TL.eased, drone(TL.war - TL.eased, 55, 1), .12);
for (let t = TL.eased + .3; t < TL.one - .4; t += 1.1) T.at(t, whoosh(1.1, 600, 200, 1), .06, (rnd() - .5));
for (let i = 0; i < 4; i++) T.at(TL.eased + 1 + i * 1.1, snore(), .12);
T.at(TL.one - .1, chime(note(84), .8, 3), .2); for (let i = 0; i < 5; i++) T.at(TL.one + .2 + i * .2, chirp(1), .05, rnd() - .5);

// ---------- the war: food piled by his head ----------
for (let i = 0; i < 10; i++) T.at(TL.war + .3 + i * .4, drum(i % 2 ? 58 : 50, 1, .5), .2, i % 2 ? .3 : -.3);
for (let i = 0; i < 8; i++) T.at(TL.war + .8 + i * .45 + rnd() * .1, thud(1), .3, (rnd() - .5) * .8);
T.at(TL.war, snore(), .14); T.at(TL.war + 1.8, snore(), .14);

// ---------- conches and drums; birds fall from the sky ----------
[0, .3, .7].forEach((d, i) => T.at(TL.noise + d, conch(2.6, [262, 294, 330][i], 1), .28, (i - 1) * .5));
for (let i = 0; i < 18; i++) T.at(TL.noise + i * .16, drum(i % 3 ? 70 : 48, 1, .4), .26, i % 2 ? .4 : -.4);
for (let i = 0; i < 6; i++) { const t = TL.birds + i * .25 + rnd() * .1; T.at(t, whoosh(.5, 3000, 600, 1), .08, (rnd() - .5) * 1.4); T.at(t + .5, thud(.5), .08); }
T.at(TL.noise + 1.5, snore(), .16);

// ---------- a thousand elephants ----------
T.at(TL.eleph, trumpet(1.2, 540), .3, -.4); T.at(TL.thousand + .2, trumpet(1.1, 620), .25, .4); T.at(TL.thousand + 1.1, trumpet(1.3, 480), .22);
for (let t = TL.eleph; t < TL.yawn + .2; t += .09) T.at(t, thud(1), .14 + rnd() * .08, (rnd() - .5) * 1.2);
T.at(TL.eleph, rockfall(TL.yawn - TL.eleph, .8), .2);

// ---------- the yawn; HUNGRY ----------
T.at(TL.yawning - .3, mixb(roar(2.2, 60, 4, 1), tone(2, x => 70 + 40 * Math.sin(x * 2), { type: 'saw', e: env.swell(.4, .8), amp: .3 })), .4);
hit(TL.hungry, 32, .9); sub(TL.hungry, .8); T.at(TL.hungry + .05, roar(1.8, 100, 6, 1), .35);

// ---------- the cave: snoring; the card ----------
for (let t = TL.ask + .4; t < TL.card; t += 2.8) T.at(t, snore(), .2);
T.at(TL.ask, fire(TL.end - TL.ask, .25, .3), .06);
T.at(TL.card, om(TL.end - TL.card, 98, 1), .12);
T.at(TL.card + .3, chime(note(84), 1, 3), .2, -.2); T.at(TL.card + .55, chime(note(88), 1, 3), .18, .2); T.at(TL.card + 1.7, chime(note(91), 1, 3), .16);

T.write('assets/kumbha_sfx.wav');

// ---------- the mix: the voice on top, the score ducked under it, the effects ----------
const ff = (inputs, graph, out) => execFileSync('ffmpeg', ['-y', '-v', 'error', ...inputs.flatMap(i => ['-i', i]), '-filter_complex', graph, '-map', '[o]', '-t', String(TL.end), '-ar', '48000', '-ac', '2', out], { stdio: 'inherit' });
const voFx = '[0:a]aresample=48000,volume=1.0,asplit=2[vo][key]';
const SCORE = process.env.SCORE || 'assets/kumbha_score.mp3', HEAD = +(process.env.SCORE_HEAD || 0);
if (existsSync(SCORE)) {
  // the score's level over time: it falls away while he freezes ("So be it" → "What came out of my mouth?!")
  const keys = [[0, 1], [TL.be - .3, 1], [TL.be + .4, .22], [TL.what + .3, .22], [TL.what + 1.2, 1], [TL.end, 1]];
  const env = keys.slice(1).reduceRight((acc, [t1, v1], i) => { const [t0, v0] = keys[i]; return `if(lt(t,${t1.toFixed(3)}),${v0}+(${v1}-${v0})*(t-${t0.toFixed(3)})/${Math.max(.001, t1 - t0).toFixed(3)},${acc})`; }, '1');
  const score = `[2:a]aresample=48000,atrim=${HEAD}:${HEAD + TL.end},asetpts=PTS-STARTPTS,volume='${env}':eval=frame,volume=0.42,afade=t=out:st=${(TL.end - 3).toFixed(2)}:d=3[sc]`;
  ff(['assets/kumbha_vo.wav', 'assets/kumbha_sfx.wav', SCORE],
    `${voFx};${score};[sc][key]sidechaincompress=threshold=0.02:ratio=6:attack=25:release=450:makeup=1[duck];[1:a]volume=0.85[fx];[vo][fx][duck]amix=inputs=3:duration=longest:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=12[o]`, 'assets/kumbha_mix.wav');
  console.log('wrote assets/kumbha_mix.wav');
} else {
  ff(['assets/kumbha_vo.wav', 'assets/kumbha_sfx.wav'], `${voFx};[key]anullsink;[1:a]volume=0.85[fx];[vo][fx]amix=inputs=2:duration=longest:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=12[o]`, 'assets/kumbha_mix.wav');
  console.log('wrote assets/kumbha_mix.wav (voice + SFX; no score yet)');
}
