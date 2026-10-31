// sita_sfx.mjs: the sound of "Was RAM right to leave SITA?" (src/scenes/sita.js) → assets/sita_sfx.wav, then the mix with
// the voice and the Lyria score → assets/sita_mix.wav. Times come from the voice and the timeline (sita_vo.js +
// sita_tl.js, loaded with vm), so they follow the picture.
// Quiet, under the voice: the river and a temple bell on the hook; a chime as each poet's pillar rises; the city's night
// (crickets, whispers on RAVANA); cold wind at the window and a glint on the tear; the river again under Sita's message;
// birds at dawn; the yagna's fire and bell; the Earth's rumble rising on MOTHER EARTH, a shimmer as the throne comes up,
// a deep bell as she goes; a shimmer on GOLD; the crowd's murmur swelling on each side, then both; a pop per Ramayan on
// the map; the card. The score (assets/sita_score.mp3, cut to the reel) sits under the voice, side-chain ducked.
import { readFileSync, existsSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, plink, click, shimmer, note, seed, chime, drum, wind, chirp, fire, thud, rumble, crackle, rnd, clamp, SR } from './sfx.mjs';

const TL = runInNewContext(readFileSync('src/scenes/sita_vo.js', 'utf8') + '\n' + readFileSync('src/scenes/sita_tl.js', 'utf8') + '\n;TL');
const T = track(TL.END);
seed(67);
const templeBell = (f = 62, amp = 1) => bell(note(f), 4, { partials: [[1, 1], [2.02, .6], [2.76, .45], [4.1, .3], [5.4, .18]], k: 1.1, amp });
const chord = (ms, d = 2, amp = 1) => { const o = new Float32Array(Math.round((d + 1) * SR)); ms.forEach((m, i) => { const b = bell(note(m), d, { partials: [[1, 1], [2, .35], [3, .12]], k: 1.4, amp }); for (let j = 0; j < b.length; j++) o[Math.round(i * .05 * SR) + j] += b[j]; }); return o; };
const pop = (amp = 1, f = 1) => mixb(click(amp), tone(.07, t => f * (500 + 2600 * t / .07), { e: env.pluck(40), amp: amp * .7 }), noise(.05, { lp: 2500, hp: 300, e: env.pluck(60), amp: amp * .5 }));
const water = (dur, amp = 1) => noise(dur, { lp: t => 700 + 250 * Math.sin(t * .9), hp: 120, e: env.swell(.8, .8), amp });
const whisper = (dur, amp = 1) => { const n = noise(dur, { hp: 1800, lp: 6500, e: env.swell(.08, .2), amp }); for (let i = 0; i < n.length; i++) n[i] *= .4 + .6 * Math.abs(Math.sin(i / SR * 9 + Math.sin(i / SR * 3) * 2)); return n; };
const murmur = (dur, amp = 1) => { const n = noise(dur, { hp: 250, lp: 1400, e: env.swell(.3, .5), amp }); for (let i = 0; i < n.length; i++) n[i] *= .55 + .45 * Math.sin(i / SR * 5.3 + Math.sin(i / SR * 1.7) * 3); return n; };
const pillar = (t, f = 86, pan = 0) => { T.at(t - .1, chime(note(f), .9, 2.4), .08, pan); T.at(t - .25, whoosh(.5, 800, 4000, .6), .04, pan); };
const whooshAt = (t, amp = .12, d = .8) => T.at(t - d / 2, whoosh(d, 400, 2600), amp, 0);

// ---- A: the hook: the river, a temple bell
T.at(0, water(TL.B0 + .6, 1), .05, 0); T.at(0, wind(TL.B0 + .6, 0, .6), .03, 0);
T.at(.03, templeBell(62, .8), .12, 0);
// ---- B: four pillars rise; C: down to Valmiki
whooshAt(TL.B0 + .1, .12, 1);
['valmiki', 'kalidasa', 'bhava', 'tulsi'].forEach((k, i) => pillar(TL.POETS + i * .22, [81, 84, 86, 89][i], (i - 1.5) * .25));
T.at(TL.POETS + 1.05, chord([62, 66, 69, 74], 2.2, .6), .07, 0);
whooshAt(TL.C0 + .2, .12, 1); pillar(TL.VALMIKI - .1, 86);
// ---- C1: Ayodhya at night: crickets, whispers
for (let t = TL.C1; t < TL.D0 + .3; t += .2 + rnd() * .35) T.at(t, chirp(.4), .01, rnd() - .5);
T.at(TL.WHISPER - .3, whisper(1.6, 1), .05, -.3); T.at(TL.RAVANA - .1, whisper(2.4, 1), .06, .3); T.at(TL.RAVANA + 1.6, whisper(2.2, 1), .05, -.2);
// ---- D: the window: cold wind; a glint on the tear
T.at(TL.D0, wind(TL.E0 - TL.D0 + .4, 1, 1), .04, 0);
T.at(TL.LIFE - .4, chime(note(98), .7, 2.6), .05, -.2);
// ---- E: Kalidasa's pillar; E1: the river under Sita's message
whooshAt(TL.E0 + .1, .12, .8); pillar(TL.KALIDASA - .1, 84);
T.at(TL.E1, water(TL.F0 - TL.E1 + .4, 1), .045, 0);
// ---- F: dawn: birds
for (let t = TL.F0 + .3; t < TL.G0 + .3; t += .3 + rnd() * .5) T.at(t, chirp(.6), .015, rnd() - .5);
// ---- G: the winter moon: wind, a cold shimmer; HEART
T.at(TL.G0, wind(TL.H0 - TL.G0 + .4, 2, 1), .045, 0);
T.at(TL.HEART - .1, chime(note(86), .7, 2.6), .05, 0);
// ---- H: the yagna: fire, a bell on YAGNA, a soft drum on FORGIVE
T.at(TL.H0, fire(TL.I0 - TL.H0 + .4, .3, .5), .06, 0); T.at(TL.H0, crackle(TL.I0 - TL.H0, .6), .02, .1);
T.at(TL.YAGNA - .05, templeBell(64, .8), .1, 0);
T.at(TL.FORGIVE - .05, drum(44, .8, 1.4), .08, 0);
// ---- I: the oath: the Earth's rumble rises from MOTHER EARTH
T.at(TL.I0, fire(TL.J0 - TL.I0, .2, .2), .03, 0);
T.at(TL.MOTHER - .4, rumble(TL.J0 - TL.MOTHER + 1.6, 1), .1, 0);
T.at(TL.OPEN - .3, noise(1.8, { lp: t => 200 + 600 * t, hp: 40, e: env.swell(.6, .4), amp: 1 }), .08, 0);
// ---- J: the ground opens: a crack, the throne rises (shimmer), she goes (a deep bell), petals
T.at(TL.J0 - .1, thud(1), .14, 0); T.at(TL.J0 - .1, drum(36, 1, 1.6), .14, 0);
T.at(TL.J0 + .1, shimmer(1.8, [note(74), note(78), note(81), note(86), note(90), note(93)], .8, .1), .1, 0);
T.at(TL.HOME - .2, templeBell(55, 1), .14, 0); T.at(TL.HOME - .3, whoosh(1.2, 2000, 300, 1), .06, 0);
// ---- K: the golden Sita: fire, a shimmer on GOLD
T.at(TL.K0, fire(TL.L0 - TL.K0 + .4, .25, .35), .05, 0);
T.at(TL.GOLD - .15, shimmer(1.2, [note(86), note(90), note(93), note(98)], .7, .07), .09, 0);
// ---- L: Bhavabhuti; L1: dawn, birds, petals on REUNITED
whooshAt(TL.L0 + .1, .12, .8); pillar(TL.BHAVA - .1, 86);
for (let t = TL.L1 + .2; t < TL.M0 + .3; t += .3 + rnd() * .4) T.at(t, chirp(.6), .015, rnd() - .5);
T.at(TL.REUNITED - .1, chord([62, 66, 69, 74, 78], 2.6, .7), .08, 0);
// ---- M: Tulsidas; M1: the page: a lamp, a page turn, a chime on NO EXILE
whooshAt(TL.M0 + .1, .12, .7); pillar(TL.TULSI - .1, 89);
T.at(TL.M1, crackle(TL.N0 - TL.M1, .5), .015, -.2);
T.at(TL.M1 + .05, noise(.35, { hp: 1500, lp: 7000, e: env.hann(), amp: 1 }), .05, 0);   // the page
T.at(TL.NOEXILE - .05, chime(note(81), .8, 2.4), .08, 0);
// ---- N: the crowd divided: a murmur swells left on SITA, right on RAM, both on BOTH
T.at(TL.N0, murmur(TL.O0 - TL.N0 + .4, 1), .025, 0);
T.at(TL.SITA_W - .3, murmur(2.2, 1), .07, -.6); T.at(TL.RAM_W - .3, murmur(2.2, 1), .07, .6);
T.at(TL.BOTH - .3, murmur(2.4, 1), .09, -.3); T.at(TL.BOTH - .3, murmur(2.4, 1), .09, .3);
T.at(TL.BOTH - .05, templeBell(67, .7), .08, 0);
// ---- O: the ask: a pop per Ramayan
whooshAt(TL.O0 + .1, .12, 1);
for (let i = 0; i < 11; i++) T.at(TL.O0 + .25 + i * .17, plink(note([74, 76, 79, 81, 83, 86][i % 6] + (i > 5 ? 12 : 0)), .7), .05, (i % 2 ? .3 : -.3));
// ---- the card
T.at(TL.CARD - .3, whoosh(.7, 400, 3200), .18, 0);
T.at(TL.CARD + .4, chord([67, 71, 74, 79], 2.2, .7), .14, 0);
for (let k = 0; k < 3; k++) T.at(TL.CARD + .9 + k * .12, pop(.8, 1 + k * .15), .18, (k - 1) * .4);
T.at(TL.CARD + 1.8, chord([55, 62, 67, 71, 74], 4.4, .6), .07, 0);   // held under the card to the end
T.at(TL.CARD + 1.6, mixb(pop(1, 1.3), shimmer(.7, [note(91), note(95), note(98)], .6, .06)), .2, 0);

T.write('assets/sita_sfx.wav');
console.log('assets/sita_sfx.wav', TL.END.toFixed(2), 's');
// the mix: the voice, the SFX, and the score (Lyria take 4 of 5, the only one in length that kept the brief's swell at
// 0:52) side-chain ducked under the voice, hushed under Ram alone at the window (the take's own hush came late); -14 LUFS
const D = TL.END.toFixed(3), score = 'assets/sita_score.mp3', hasScore = existsSync(score);
const ins = ['-i', 'assets/sita_vo.wav', '-i', 'assets/sita_sfx.wav', ...(hasScore ? ['-i', score] : [])];
const fc = hasScore
  ? `[0:a]asplit=2[v][key];[2:a]aresample=48000,volume=${process.env.SCORE ?? .32},volume='1-0.6*between(t,${(TL.G0 + .2).toFixed(2)},${(TL.H0 - .2).toFixed(2)})':eval=frame,afade=t=out:st=${(TL.END - 2.5).toFixed(2)}:d=2.5[m];[m][key]sidechaincompress=threshold=0.03:ratio=5:attack=40:release=500[md];[1:a]volume=0.85[s];[v][s][md]amix=inputs=3:normalize=0:duration=longest,apad=whole_dur=${D},atrim=0:${D},loudnorm=I=-14:TP=-1.5:LRA=11[o]`
  : `[1:a]volume=0.85[s];[0:a][s]amix=inputs=2:normalize=0:duration=longest,apad=whole_dur=${D},atrim=0:${D},loudnorm=I=-14:TP=-1.5:LRA=11[o]`;
execFileSync('ffmpeg', ['-y', '-v', 'error', ...ins, '-filter_complex', fc, '-map', '[o]', '-ar', '48000', '-ac', '2', 'assets/sita_mix.wav']);
console.log('assets/sita_mix.wav', hasScore ? '(with score)' : '(no score)');
