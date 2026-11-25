// onemoon_sfx.mjs: the sound of "One moon" (src/scenes/onemoon.js) → assets/onemoon_sfx.wav, then the mix with the voice
// and the Lyria score (assets/onemoon_score_cut.wav, when there is one) → assets/onemoon_mix.wav. Times come from the
// voice and the timeline (src/scenes/onemoon_vo.js + onemoon_tl.js, loaded with vm), so they follow the picture.
// The arc: water lapping under the krathongs, a far festival crowd, candle flickers → Thai: a soft gong, lanterns
// whooshing up → Kashi: bells, a far aarti crowd, a conch → Arunachala: the fire's crackle, a bell → the map: a rise
// and a deep hit, a chime per beam, a ping on 2,000 KM → "Coincidence?": a gong, then quiet → the sea: waves, wind,
// creaking → the route: whooshes as the boats sail → script, city, song: chimes on each reveal → the hymn: bells and
// an om → the climax: a swell, every place's sound at once → the ask: water and a bell → the card.
import { readFileSync, existsSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, plink, shimmer, note, seed, chime, thud, rnd, drum, om, conch, wind, drone, slide, fire, rumble } from './sfx.mjs';

const TL = runInNewContext(readFileSync('src/scenes/onemoon_vo.js', 'utf8') + '\n' + readFileSync('src/scenes/onemoon_tl.js', 'utf8') + '\n;TL');
const T = track(TL.END);
seed(114);
const templeBell = (f = 76, amp = 1, dur = 4) => bell(note(f), dur, { partials: [[1, 1], [2.02, .6], [2.76, .45], [4.1, .3], [5.4, .18]], k: 1.1, amp });
const gong = (f = 40, amp = 1, dur = 5) => bell(note(f), dur, { partials: [[1, 1], [1.48, .6], [2.1, .5], [2.9, .3], [3.7, .2]], k: .6, amp });
const swellUp = (dur, amp = 1) => noise(dur, { hp: 300, lp: t => 800 + 7000 * (t / dur) ** 2, e: (t, D) => (t / D) ** 2.2, amp });
const boom = (amp = 1) => mixb(drum(34, amp, 2.2), thud(amp * 1.1), noise(.8, { lp: 600, e: env.pluck(4), amp: amp * .6 }));
// water lapping: low noise breathing in slow waves, with little clucks
const lap = (dur, amp = 1) => { const b = noise(dur, { hp: 90, lp: 900, e: env.swell(.8, .8), amp }); for (let i = 0; i < b.length; i++) { const t = i / 48000; b[i] *= .55 + .45 * Math.sin(t * 1.3 + Math.sin(t * .7) * 2) ** 2; } return b; };
const crowd = (dur, k = 1) => { const b = noise(dur, { hp: 280, lp: 2200, e: env.swell(.6, .8), amp: 1 }); for (let i = 0; i < b.length; i++) { const t = i / 48000; b[i] *= k * (.75 + .25 * Math.sin(t * 3.7) * Math.sin(t * 1.7 + 1)); } return b; };
const waves = (dur, amp = 1) => { const b = noise(dur, { hp: 60, lp: 1400, e: env.swell(.6, 1), amp }); for (let i = 0; i < b.length; i++) { const t = i / 48000; b[i] *= .35 + .65 * Math.max(0, Math.sin(t * .9)) ** 3; } return b; };
const lantern = (amp = 1) => mixb(noise(1.6, { hp: 200, lp: t => 2600 - 1400 * t / 1.6, e: env.swell(.15, 1.2), amp }), fire(1.4, .3, .5));

// ================= A · Thailand: water, krathongs, lanterns (sound from frame 0) =================
T.at(0, lap(TL.B0 + .3, 1), .08, 0);
T.at(0, crowd(TL.B0 + .3, .7), .025, .3);
T.at(0, fire(TL.B0, .15, .4), .03, -.2);
T.at(0, mixb(gong(45, .8, 5), shimmer(2, [note(81), note(86), note(88), note(93)], .5, .12)), .09, 0);
T.at(TL.GANGA - .05, chime(note(79), .7, 3), .07, 0);
T.at(TL.A2, whoosh(1.4, 300, 1200, .5), .05, 0);
T.at(TL.MOTHER - .05, mixb(templeBell(64, .7, 4), chime(note(84), .5, 2.5)), .07, 0);
for (let i = 0; i < 4; i++) T.at(TL.A3 + .3 + i * .45, lantern(.8), .05, (i % 2 ? .5 : -.5));
// ================= B · Kashi =================
T.at(TL.B0 - .2, whoosh(1.2, 2200, 300, .7), .08, 0);
T.at(TL.B0, crowd(TL.C0 - TL.B0 + .3, 1), .05, 0);
T.at(TL.B0, lap(TL.C0 - TL.B0 + .3, .8), .06, 0);
T.at(TL.KASHI - .1, mixb(templeBell(60, 1, 5), templeBell(67, .6, 4)), .1, 0);
for (let i = 0; i < 6; i++) T.at(TL.KASHI + .5 + i * .38, templeBell(74 + (i % 3) * 2, .3, 1.4), .04, (i % 2 ? .45 : -.45));
T.at(TL.GODS - .2, conch(2.2, 311, .8), .06, 0);
// ================= C · Arunachala =================
T.at(TL.C0 - .15, whoosh(1.2, 300, 2200, .7), .08, 0);
T.at(TL.C0, fire(TL.D0 - TL.C0 + .3, .8, .8), .09, 0);
T.at(TL.C0, crowd(TL.D0 - TL.C0 + .3, .9), .05, 0);
T.at(TL.FIRE - .05, mixb(templeBell(55, 1, 5), om(3, note(38), .7)), .1, 0);
// ================= D · the map: three lights =================
T.at(TL.D0 - .9, swellUp(1, 1), .1, 0);
T.at(TL.D0 - .05, boom(.8), .3, 0);
T.at(TL.D0, wind(TL.D1 - TL.D0 + .4, 2, 1.2), .05, 0);
[.15, .45, .75, .95].forEach((d, i) => T.at(TL.D0 + d, chime(note(74 + [0, 5, 7, 12][i]), .7, 2.5), .07, [-.5, -.2, .3, .5][i]));
T.at(TL.KM - .05, mixb(plink(note(86), .8), shimmer(1, [note(90), note(93)], .5, .07)), .08, 0);
T.at(TL.SMOON - .1, chime(note(81), .6, 3), .06, 0);
// ================= D1 · Coincidence? =================
T.at(TL.COIN - .05, gong(36, 1, 6), .16, 0);
T.at(TL.COIN, drone(TL.E0 - TL.COIN + .3, note(33), .7), .05, 0);
T.at(TL.RAMA - .1, mixb(drum(50, .6, .8), chime(note(76), .5, 2)), .08, 0);
T.at(TL.HINDU - .05, mixb(templeBell(57, 1, 5), om(3.5, note(36), .7)), .11, 0);
// ================= E · the sea, the boats =================
T.at(TL.E0 - .2, whoosh(1.6, 2400, 200, .9), .1, 0);
T.at(TL.E0, waves(TL.E1 - TL.E0 + .5, 1), .1, 0);
T.at(TL.E0, wind(TL.E1 - TL.E0 + .5, 4, 1.5), .05, 0);
T.at(TL.ODISHA - .1, mixb(templeBell(62, .7, 4), conch(1.8, 330, .5)), .07, 0);
T.at(TL.BOATS - .05, fire(1.4, .25, .5), .05, 0);
T.at(TL.E1 - .15, whoosh(1.8, 200, 2600, 1), .1, 0);
T.at(TL.E1, waves(TL.F0 - TL.E1 + .4, .8), .06, 0);
for (const w of [TL.BALI, TL.JAVA]) T.at(w - .05, mixb(plink(note(84), .7), chime(note(79), .5, 2)), .07, 0);
// ================= F · G · H · the script, the city, the songs =================
T.at(TL.F0 - .15, whoosh(1.2, 400, 2600, .7), .07, 0);
T.at(TL.SCRIPT - .05, mixb(chime(note(76), .7, 2.5), drum(55, .5, .6)), .08, 0);
T.at(TL.LETTER - .05, chime(note(81), .6, 2), .06, .3);
T.at(TL.KA - .1, mixb(shimmer(1.6, [note(79), note(84), note(88), note(91)], .6, .1), templeBell(67, .6, 3)), .1, 0);
T.at(TL.G0 - .15, whoosh(1.2, 2600, 400, .7), .07, 0);
T.at(TL.AYUTTHAYA - .05, chime(note(79), .6, 2.5), .07, .4);
T.at(TL.AYODHYA - .05, mixb(templeBell(60, .9, 5), conch(1.6, 311, .5)), .1, -.3);
T.at(TL.H0 - .2, whoosh(1.4, 300, 1800, .6), .07, 0);
T.at(TL.H0, lap(TL.I0 - TL.H0 + .3, .8), .06, 0);
T.at(TL.SONGS - .05, gong(43, .8, 5), .08, 0);
T.at(TL.TAMIL - .1, mixb(om(3.5, note(38), .8), templeBell(64, .8, 4)), .1, 0);
T.at(TL.SHIVA - .05, mixb(templeBell(57, 1, 6), shimmer(1.4, [note(81), note(86), note(88)], .4, .1)), .1, 0);
// ================= I · one moon: three places, one family =================
T.at(TL.I0 - .9, swellUp(1, .8), .07, 0);
T.at(TL.I0, lap(TL.J0 - TL.I0, .7), .05, 0);
T.at(TL.I0, chime(note(76), .6, 2), .06, -.4);
T.at(TL.I1 - .05, templeBell(67, .7, 2.5), .07, 0);
T.at(TL.I2 - .05, mixb(fire(1.2, .4, .5), templeBell(60, .6, 3)), .07, .4);
T.at(TL.I3 - .3, swellUp(.4, .8), .08, 0);
T.at(TL.I3, mixb(boom(.6), gong(38, .9, 6)), .2, 0);
T.at(TL.FAMILY - .1, shimmer(2, [note(76), note(81), note(84), note(88), note(93)], .7, .12), .09, 0);
T.at(TL.LAMP - .05, mixb(templeBell(64, 1, 6), templeBell(71, .6, 5)), .1, 0);
// ================= J · the ask =================
T.at(TL.J0, lap(TL.CARD - TL.J0 + .5, 1), .07, 0);
T.at(TL.J0, crowd(TL.CARD - TL.J0, .6), .025, 0);
T.at(TL.YOU - .05, plink(note(86), .8), .07, 0);
T.at(TL.CITY2 - .1, chime(note(79), .6, 3), .06, 0);
// ================= the card =================
T.at(TL.CARD - .3, whoosh(.7, 400, 3200), .12, 0);
T.at(TL.CARD + .35, mixb(...[67, 71, 74, 79].map((m) => bell(note(m), 2.2, { partials: [[1, 1], [2, .35], [3, .12]], k: 1.4, amp: .7 }))), .12, 0);
T.at(TL.CARD + .2, drone(TL.END - TL.CARD - .2, note(38), .8), .04, 0);

T.write('assets/onemoon_sfx.wav');
console.log('assets/onemoon_sfx.wav', TL.END.toFixed(2), 's');
// the mix: the voice over the SFX and the score, normalised to -14 LUFS
const D = TL.END.toFixed(3), score = existsSync('assets/onemoon_score_cut.wav') ? 'assets/onemoon_score_cut.wav' : null;
const inputs = ['-i', 'assets/onemoon_vo.wav', '-i', 'assets/onemoon_sfx.wav', ...(score ? ['-i', score] : [])];
const fc = score
  ? `[0:a]volume=1.15,asplit[v][vk];[1:a]volume=0.75[s];[2:a]volume=0.5[m0];[m0][vk]sidechaincompress=threshold=0.04:ratio=3:attack=40:release=450:makeup=1[m];[v][s][m]amix=inputs=3:normalize=0:duration=longest,apad=whole_dur=${D},atrim=0:${D},loudnorm=I=-14:TP=-1.5:LRA=11[o]`
  : `[1:a]volume=0.95[s];[0:a][s]amix=inputs=2:normalize=0:duration=longest,apad=whole_dur=${D},atrim=0:${D},loudnorm=I=-14:TP=-1.5:LRA=11[o]`;
execFileSync('ffmpeg', ['-y', '-v', 'error', ...inputs, '-filter_complex', fc, '-map', '[o]', '-ar', '48000', '-ac', '2', 'assets/onemoon_mix.wav']);
console.log('assets/onemoon_mix.wav', score ? '(with the score)' : '(voice + SFX)');
