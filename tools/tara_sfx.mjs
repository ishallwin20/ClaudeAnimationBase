// tara_sfx.mjs: the sound of "Maa Tara and Shiva" (src/scenes/tara.js) → assets/tara_sfx.wav, then the mix with the voice
// (assets/vo/tara_vo.mp3, @shagunshrotriyaparashar_'s, kept out of git) and the Lyria score (assets/tara_score.mp3,
// tools/tara_score.txt) → assets/tara_mix.wav. Times come from the scene's TL, so the sound follows the picture.
// Quiet, under the voice: the river and crickets with a temple bell on the hook; the sea churning and thunder; the poison's
// hiss as he draws it in; a heartbeat slowing as it spreads; the change (a swell, a crack of light, a bell); the orb's
// shimmer and a chime as it becomes a child; a soft chime as the poison clears, a cool shimmer on "sheetalta"; the
// devotees' night, a whoosh of light as their pain lifts; a low swell on "Mahadev"; bells on "Jai Maa Tara"; the card.
import { readFileSync, existsSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, noise, bell, mixb, env, whoosh, shimmer, note, seed, chime, drum, wind, chirp, thunder, rumble, heart, rnd } from './sfx.mjs';

const src = readFileSync('src/scenes/tara.js', 'utf8'), TL = runInNewContext(src.match(/const TL = \{[\s\S]*?\};/)[0] + '\n;TL');
const END = TL.end, T = track(END);
seed(81);
const templeBell = (f = 62, amp = 1) => bell(note(f), 4, { partials: [[1, 1], [2.02, .6], [2.76, .45], [4.1, .3], [5.4, .18]], k: 1.1, amp });
const water = (dur, amp = 1) => noise(dur, { lp: t => 600 + 220 * Math.sin(t * .8), hp: 120, e: env.swell(1, 1), amp });
const crickets = (t0, t1, amp = .008) => { for (let t = t0; t < t1; t += .25 + rnd() * .4) T.at(t, chirp(.5), amp, rnd() - .5); };
const sea = (dur, amp = 1) => noise(dur, { lp: t => 500 + 400 * Math.abs(Math.sin(t * .6)), hp: 40, e: env.swell(.6, .6), amp, brown: true });
const hiss = (dur, amp = 1) => noise(dur, { hp: 2500, lp: 7000, e: env.swell(.4, .6), amp });

// ---- 1–2: the river at night, a bell, crickets
T.at(0, water(TL.sea + .5, 1), .04, 0); crickets(.3, TL.sea);
T.at(.05, templeBell(62, .8), .1, 0);
// ---- 3: the churning: the sea, thunder on each bolt, a rumble
T.at(TL.sea - .3, sea(TL.drink - TL.sea + 1, 1), .12, 0); T.at(TL.sea, rumble(TL.drink - TL.sea + .5, 1), .07, 0);
for (const b of [TL.sea + .5, TL.sea + 2.2]) T.at(b, thunder(2.2, .8), .12, rnd() - .5);
// ---- 4: he draws the poison in: a hiss pulling toward the middle; the burn at his throat
T.at(TL.drink - .2, hiss(TL.gale - TL.drink + 2, 1), .04, .3); T.at(TL.drink, sea(TL.spread - TL.drink, .6), .05, 0);
T.at(TL.gale - .2, noise(2.4, { lp: 900, hp: 60, e: env.swell(.3, 1), amp: 1 }), .05, 0);
// ---- 5: it spreads: a heartbeat, slowing and fading; the sound drops away
[0, 1.0, 2.1].forEach((d, i) => T.at(TL.spread + .2 + d, heart(1 - i * .25), .16, 0));
// ---- 6–7: Parvati's grief, the change: a swell, a crack of light, a deep bell
T.at(TL.parvati, wind(TL.tara - TL.parvati + 1, 1, .8), .03, 0);
T.at(TL.tara - .8, noise(1.6, { lp: t => 300 + 3000 * t / 1.6, hp: 100, e: env.swell(1.4, .1), amp: 1 }), .07, 0);
T.at(TL.tara + .72, mixb(drum(40, 1, 1.4), noise(.4, { hp: 1500, lp: 9000, e: env.pluck(14), amp: .6 })), .16, 0);
T.at(TL.tara + .75, templeBell(50, 1), .14, 0);
T.at(TL.tara + 1.1, shimmer(1.6, [note(81), note(86), note(88), note(93)], .7, .08), .06, 0);
// ---- 8–9: the orb comes down (a shimmer); on "shishu" it becomes a child (a chime, a soft bell)
T.at(TL.lap, water(TL.wide2 - TL.lap, 1), .025, 0); crickets(TL.lap, TL.dev);
T.at(TL.lap + .1, shimmer(2.6, [note(86), note(90), note(93), note(98), note(102)], .6, .35), .05, 0);
T.at(TL.shishu - .2, whoosh(.9, 600, 3000), .05, 0);
T.at(TL.shishu + .2, chime(note(93), .8, 3), .09, 0); T.at(TL.shishu + .2, templeBell(69, .5), .05, 0);
// ---- 10–11: the milk as light; the poison clears; sheetal
T.at(TL.milk, shimmer(2.4, [note(81), note(86), note(90)], .5, .5), .04, 0);
T.at(TL.kaata, chime(note(86), .8, 3), .08, 0);
T.at(TL.sheetal - .1, shimmer(2.2, [note(98), note(102), note(105), note(110)], .6, .1), .07, 0);
// ---- 13: the devotees' night; their pain lifts as light
crickets(TL.dev, TL.wide2, .01);
T.at(TL.door - .2, whoosh(1.6, 300, 4000), .05, 0); T.at(TL.door + .1, shimmer(2.4, [note(81), note(86), note(88), note(93), note(98)], .6, .2), .06, 0);
T.at(TL.karuna, templeBell(66, .6), .06, -.2);
// ---- 14: Mahadev rises: a low swell; back to the child: a chime
T.at(TL.wide2, water(TL.card - TL.wide2, 1), .025, 0); crickets(TL.wide2, TL.card);
T.at(TL.mahadev - .8, rumble(2.4, 1), .06, 0); T.at(TL.mahadev, templeBell(43, .9), .08, 0);
T.at(TL.shiv + .1, chime(note(93), .7, 2.6), .07, 0);
// ---- 15–16: the rings open; bells on "Jai Maa Tara"
T.at(TL.darshan + 1, shimmer(2.4, [note(81), note(85), note(88), note(93)], .6, .3), .05, 0);
T.at(TL.jai, templeBell(62, 1), .13, -.2); T.at(TL.jai + .5, templeBell(67, .8), .1, .2);
// ---- 17: the card
T.at(TL.card - .2, whoosh(.8, 400, 3000), .08, 0);
T.at(TL.card + .4, chime(note(86), .7, 3), .08, 0);

T.write('assets/tara_sfx.wav');
console.log('assets/tara_sfx.wav', END.toFixed(2), 's');
// the mix: the voice, the SFX, and the score side-chain ducked under the voice; -14 LUFS
const D = END.toFixed(3), score = 'assets/tara_score.mp3', hasScore = existsSync(score);
const ins = ['-i', 'assets/vo/tara_vo.mp3', '-i', 'assets/tara_sfx.wav', ...(hasScore ? ['-i', score] : [])];
const fc = hasScore
  ? `[0:a]aresample=48000,asplit=2[v][key];[2:a]aresample=48000,volume=${process.env.SCORE ?? .22},afade=t=out:st=${(END - 3).toFixed(2)}:d=3[m];[m][key]sidechaincompress=threshold=0.03:ratio=4:attack=60:release=600[md];[1:a]volume=0.8[s];[v][s][md]amix=inputs=3:normalize=0:duration=longest,apad=whole_dur=${D},atrim=0:${D},loudnorm=I=-14:TP=-1.5:LRA=11[o]`
  : `[1:a]volume=0.8[s];[0:a]aresample=48000[v];[v][s]amix=inputs=2:normalize=0:duration=longest,apad=whole_dur=${D},atrim=0:${D},loudnorm=I=-14:TP=-1.5:LRA=11[o]`;
execFileSync('ffmpeg', ['-y', '-v', 'error', ...ins, '-filter_complex', fc, '-map', '[o]', '-ar', '48000', '-ac', '2', 'assets/tara_mix.wav']);
console.log('assets/tara_mix.wav', hasScore ? '(with score)' : '(no score)');
