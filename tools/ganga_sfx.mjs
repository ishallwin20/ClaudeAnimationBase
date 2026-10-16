// ganga_sfx.mjs: the sound effects for reel/ganga-jata (src/scenes/ganga.js), and the final mix. Times come from TL
// (src/scenes/ganga_tl.js, itself from the voice's timings in src/scenes/ganga_vo.js), so re-rendering the voice moves
// the effects with it.
//   The hook: a hard first frame, the storm, the torrent roaring down, a crash and a sub on "His HAIR". Sagara: dusk wind,
//   marching drums as the princes arrive, a gust as the horse vanishes. The dig: picks and falling rock, torches. Kapila:
//   a cave drone; "THIEF": the mob's roar. One sound: a hit and a burning rush, then wind over the ash. The river of
//   heaven: a shimmer. The kings: a drone; Bhagiratha: a chime. Tapas: the fires, the days racing, Brahma's conch. The
//   warning: the ground cracking; Shiva: om. A year on one toe: wind and snow. Ganga: the torrent far off, rising. The
//   fall: the roar, thunder, the crash; the pour into his hair, cut off: silence. Lost: a trickle wandering. Seven
//   streams: water and chimes; the chariot's hooves. Jahnu: fire, the flood, the hiss, gulps, a trickle from his ear.
//   The souls rising: the pour and rising chimes. Gangadhara: a conch. The ghat: bells. The card: chimes.
//   node tools/ganga_sfx.mjs   → assets/ganga_sfx.wav, and with the score assets/ganga_mix.wav (voice + SFX + score)
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { track, tone, noise, bell, mixb, whoosh, crackle, click, env, note, seed, rnd, thunder, wind, drum, fire, om, conch, chime, chirp, roar, rockfall, shimmer, drone, gurgle, crunch, thud, torrent, splash } from './sfx.mjs';

const ctx = {}; runInNewContext(readFileSync('src/scenes/ganga_vo.js', 'utf8') + '\n' + readFileSync('src/scenes/ganga_tl.js', 'utf8') + '\n;this.VO = VO; this.TL = TL;', ctx);
const { TL, VO } = ctx;
const T = track(TL.end);
seed(21);
const hit = (t, f = 36, amp = 1) => T.at(t, mixb(drum(f, 1, 2.4), noise(1, { brown: true, lp: 200, e: env.pluck(2.6), amp: 1.3 })), amp);
const sub = (t, amp = 1) => T.at(t, tone(2.2, x => 62 * Math.exp(-x * 1.1) + 26, { e: env.ad(.005, 1.3), amp: 1 }), amp);
const temple = (t, f, amp) => T.at(t, bell(note(f), 4, { partials: [[1, 1], [2.4, .5], [3.9, .3]], k: .7 }), amp);
const hooves = (t0, dur, amp) => { for (let t = t0, i = 0; t < t0 + dur; t += .11, i++) if (i % 4 !== 3) T.at(t, thud(1), amp * (.6 + rnd() * .4), (rnd() - .5) * .4); };
const wordAt = (id, word) => { for (const k of VO.caps) if (k.id === id) { const ws = k.text.split(/\s+/).filter(x => x && x !== '|'); const i = ws.findIndex(x => x.replace(/[^A-Za-z]/g, '').toLowerCase() === word); if (i >= 0) return k.at[i]; } return VO.lines[id].a; };

// ---------- the hook (0 → Sagara) ----------
hit(0, 38, .7);
T.at(0, wind(TL.sagara + .6, 0, .4), .2, -.5); T.at(0, wind(TL.sagara + .6, 2, .4), .2, .5);
T.at(0, torrent(TL.hair + .2, 1, .3), .42);                                     // the torrent coming down
T.at(1.6, thunder(2.6, .8), .4, -.5); T.at(3.2, thunder(2.4, 1), .4, .5);
T.at(TL.hair - .9, whoosh(1, 300, 3000, 1), .3);
T.at(TL.hair, splash(1), .8); hit(TL.hair, 34, .6); sub(TL.hair, .55);
T.at(TL.hair + .1, torrent(TL.sagara - TL.hair + .5, 1, .05), .22);            // pouring on into his hair

// ---------- Sagara's horse, the 60,000 princes, the horse gone ----------
T.at(TL.sagara, wind(TL.down - TL.sagara, 3, .8), .16, -.4); T.at(TL.sagara, wind(TL.down - TL.sagara, 4, .8), .16, .4);
for (let i = 0; i < 18; i++) T.at(TL.princes - .3 + i * .22, drum(i % 2 ? 60 : 52, 1, .4), .16 + Math.min(i, 8) * .015, i % 2 ? .3 : -.3);   // marching
T.at(TL.princes, roar(3, 180, 14, .5), .1);                                      // the crowd's murmur
T.at(TL.princes + .4, fire(TL.down - TL.princes, .3, .7), .12);                  // torches
T.at(TL.stolen - .05, whoosh(1.4, 2400, 400, 1), .25, -.3);

// ---------- the dig ----------
for (let i = 0; i < 12; i++) T.at(TL.down - .2 + i * .27 + rnd() * .08, crunch(1), .18, (rnd() - .5) * 1.2);   // picks in rock
T.at(TL.down + .3, rockfall(2.2, 1), .25);
T.at(TL.down, fire(TL.kapila - TL.down + .4, .4, .7), .15);
T.at(TL.down, noise(TL.kapila - TL.down + .4, { brown: true, lp: 140, e: env.swell(.5, .6), amp: 1.2 }), .25);   // the deep

// ---------- Kapila; "THIEF" ----------
T.at(TL.kapila, om(TL.ash - TL.kapila + .3, 73, 1), .18);
T.at(TL.kapila, drone(TL.ash - TL.kapila + .3, 98, 1), .08);
T.at(TL.thief - .05, roar(1.8, 170, 14, .9), .3);
for (let i = 0; i < 4; i++) T.at(TL.thief + i * .2, drum(46, 1, .5), .3, i % 2 ? .3 : -.3);

// ---------- one sound: ash ----------
T.at(TL.sound - .15, tone(.3, 1500, { e: env.ad(.01, .2), amp: 1 }), .06);   // the eye
T.at(TL.sound, mixb(om(1.6, 110, 1), om(1.6, 55, 1)), .6);                    // HUM
hit(TL.sound + .4, 32, .9); sub(TL.sound + .4, .7);
T.at(TL.sound + .4, mixb(whoosh(1.8, 4000, 300, 1), crackle(1.6, 1)), .4);
T.at(TL.sound + .9, wind(TL.souls - TL.sound + 1, 6, 1.2), .2, -.3); T.at(TL.sound + .9, wind(TL.souls - TL.sound + 1, 7, 1.2), .2, .3);

// ---------- the river of heaven ----------
T.at(TL.souls, wind(TL.kings - TL.souls + .4, 8, 1), .14);
T.at(TL.heaven - .3, shimmer(2, [79, 83, 86, 91, 95].map(note), .6, .14), .14);
T.at(TL.heaven, torrent(2.4, .5, 1.2), .05, .3);

// ---------- the kings; Bhagiratha ----------
T.at(TL.kings, drone(TL.tapas - TL.kings + .4, 65, 1), .12);
T.at(TL.kings + 1, whoosh(1.6, 900, 200, 1), .08, -.5); T.at(TL.kings + 2, whoosh(1.6, 900, 200, 1), .08, .5);   // fading like smoke
T.at(TL.bhag, chime(note(76), 1, 3), .2); temple(TL.bhag + .1, 52, .18);

// ---------- tapas: the five fires, the days racing, Brahma's yes ----------
T.at(TL.tapas, fire(TL.warn - TL.tapas + .3, .5, 1), .26);
T.at(TL.tapas, om(TL.warn - TL.tapas + .3, 82, 1), .14);
for (let t = TL.tapas + .3; t < TL.brahma - .4; t += 1.26) T.at(t, whoosh(1.2, 300, 1600, 1), .1, -.5);   // the sun's arcs
T.at(TL.brahma - .25, conch(2.8, 294, 1), .3);
T.at(TL.brahma, shimmer(1.6, [72, 76, 79, 84, 88, 91].map(note), .8, .12), .2);

// ---------- the warning: the earth cracks; only Shiva ----------
T.at(TL.warn, noise(TL.only - TL.warn, { brown: true, lp: 160, e: env.swell(.6, .4), amp: 1.4 }), .35);
T.at(TL.warn + 1.1, rockfall(2, 1), .3); T.at(TL.warn + .6, torrent(1.6, .6, 1.2), .1);
T.at(TL.only - .1, mixb(om(TL.toe - TL.only + .4, 65, 1), chime(note(81), .7, 3)), .22);

// ---------- a year on one toe ----------
T.at(TL.toe, wind(TL.pride - TL.toe + .4, 10, 1), .2, -.4); T.at(TL.toe, wind(TL.pride - TL.toe + .4, 11, 1), .2, .4);
T.at(TL.toe, drone(TL.pride - TL.toe + .4, 55, 1), .1);
T.at(TL.year - .1, chime(note(84), .6, 3), .12);

// ---------- Ganga: the river gathering far off ----------
T.at(TL.pride, torrent(TL.fall - TL.pride + .2, .5, 2), .2);
T.at(TL.pride + .3, shimmer(2, [86, 91, 95, 98].map(note), .6, .2), .1);

// ---------- the fall and the catch ----------
T.at(TL.fall, torrent(TL.hit - TL.fall + .2, 1, TL.hit - TL.fall), .95);
T.at(TL.fall + .4, thunder(2.6, 1), .45, -.4); T.at(TL.hit - .3, thunder(2.2, 1), .4, .4);
T.at(TL.hit, splash(1), 1); hit(TL.hit, 30, .9); sub(TL.hit, .8);
const cut = wordAt('catch', 'hair') + .2;
T.at(TL.hit + .1, torrent(cut - TL.hit, 1, .05), .4);                           // pouring into his hair… then gone
T.at(cut, chime(note(88), .5, 4), .14);
T.at(TL.lost - .3, drone(TL.streams - TL.lost + .6, 49, 1), .1);
T.at(TL.lost - .2, gurgle(TL.streams - TL.lost + .2, 1), .05, -.2);               // a small lost trickle

// ---------- seven streams; the chariot ----------
T.at(TL.seven - .3, torrent(TL.jahnu - TL.seven + .3, .4, 1), .14);
for (let i = 0; i < 7; i++) T.at(TL.seven + i * .18, chime(note(76 + [0, 2, 4, 7, 9, 12, 14][i]), .6, 2), .1, (i - 3) * .2);
hooves(TL.chariot - .2, TL.jahnu - TL.chariot + .3, .2);
T.at(TL.chariot, wind(TL.jahnu - TL.chariot + .3, 12, .6), .12);

// ---------- Jahnu ----------
T.at(TL.jahnu, fire(TL.jahnu - TL.jahnu + 2, .5, 1), .24);
T.at(TL.jahnu + .2, torrent(1.6, .7, .8), .2, -.4);
T.at(TL.jahnu + 1.3, noise(1.4, { hp: 2500, lp: 9000, e: env.ad(.02, 1.2), amp: 1 }), .2);   // the fire hissing out
for (let i = 0; i < 4; i++) T.at(TL.drank + .15 + i * .3, gurgle(.28, 1), .3);   // gulp
T.at(TL.drank, whoosh(1, 200, 1400, 1), .15);
T.at(TL.ear + .1, mixb(gurgle(1.2, 1), torrent(1.6, .5, .3)), .2, .4);

// ---------- the souls rise ----------
T.at(TL.free, torrent(TL.why - TL.free + .3, .8, 1.2), .3);
for (let i = 0; i < 10; i++) T.at(TL.souls2 - .4 + i * .3, chime(note(72 + [0, 4, 7, 12, 16, 19, 24, 19, 24, 28][i]), .6, 2.5), .1, (rnd() - .5) * 1);
T.at(TL.souls2, shimmer(2, [84, 88, 91, 96, 100].map(note), .7, .2), .16);

// ---------- Gangadhara ----------
T.at(TL.why, om(TL.ask - TL.why + .3, 98, 1), .16);
T.at(TL.why + .3, gurgle(TL.ask - TL.why, 1), .04, .3);
T.at(TL.gangadhara - .2, conch(2.6, 311, 1), .3);

// ---------- the ghat and the card ----------
temple(TL.ask + .1, 55, .28); temple(TL.ask + 2.1, 55, .18);
for (let i = 0; i < 6; i++) T.at(TL.ask + .4 + i * .6 + rnd() * .2, chirp(1), .04, rnd() * 1.4 - .7);
T.at(TL.ask, noise(TL.end - TL.ask, { lp: 900, hp: 150, e: env.swell(.6, 1), amp: .5 }), .06);   // the water lapping
T.at(TL.card, om(TL.end - TL.card, 98, 1), .14);
T.at(TL.card + .3, chime(note(84), 1, 3), .2, -.2); T.at(TL.card + .55, chime(note(88), 1, 3), .18, .2); T.at(TL.card + 1.7, chime(note(91), 1, 3), .16);

T.write('assets/ganga_sfx.wav');

// ---------- the mix: the voice on top, the score ducked under it, the effects ----------
const ff = (inputs, graph, out) => execFileSync('ffmpeg', ['-y', '-v', 'error', ...inputs.flatMap(i => ['-i', i]), '-filter_complex', graph, '-map', '[o]', '-t', String(TL.end), '-ar', '48000', '-ac', '2', out], { stdio: 'inherit' });
const voFx = '[0:a]aresample=48000,volume=1.0,asplit=2[vo][key]';
const SCORE = process.env.SCORE || 'assets/ganga_score.mp3', HEAD = +(process.env.SCORE_HEAD || 0);
if (existsSync(SCORE)) {
  // the score's level over time: the hush after the catch made in the mix, whatever the take does there
  const keys = [[0, 1], [cut - .2, 1], [cut + .2, .12], [TL.streams - .4, .12], [TL.streams + .4, 1], [TL.end, 1]];
  const env = keys.slice(1).reduceRight((acc, [t1, v1], i) => { const [t0, v0] = keys[i]; return `if(lt(t,${t1.toFixed(3)}),${v0}+(${v1}-${v0})*(t-${t0.toFixed(3)})/${Math.max(.001, t1 - t0).toFixed(3)},${acc})`; }, '1');
  const score = `[2:a]aresample=48000,atrim=${HEAD}:${HEAD + TL.end},asetpts=PTS-STARTPTS,volume='${env}':eval=frame,volume=0.42,afade=t=out:st=${(TL.end - 2).toFixed(2)}:d=2[sc]`;
  ff(['assets/ganga_vo.wav', 'assets/ganga_sfx.wav', SCORE],
    `${voFx};${score};[sc][key]sidechaincompress=threshold=0.02:ratio=6:attack=25:release=450:makeup=1[duck];[1:a]volume=0.85[fx];[vo][fx][duck]amix=inputs=3:duration=longest:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=12[o]`, 'assets/ganga_mix.wav');
  console.log('wrote assets/ganga_mix.wav');
} else {
  ff(['assets/ganga_vo.wav', 'assets/ganga_sfx.wav'], `${voFx};[key]anullsink;[1:a]volume=0.85[fx];[vo][fx]amix=inputs=2:duration=longest:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=12[o]`, 'assets/ganga_mix.wav');
  console.log('wrote assets/ganga_mix.wav (voice + SFX; no score yet)');
}
