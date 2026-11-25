// kula_sfx.mjs: the sound of ad 115 (src/scenes/kula.js) → assets/kula_sfx.wav, then the mix with the voice and the
// Lyria score (assets/kula_score_cut.wav) → assets/kula_mix.wav. Times come from the voice and the timeline
// (src/scenes/kula_vo.js + kula_tl.js, loaded with vm), so they follow the picture.
// The arc: the summit fire roaring, wind → a cut to the hill: a deep hit → the diya: a small flame, crickets, a bell
// each evening as the years race (ticks speeding up) → the wick: wind on the summit, a cloth flap, a rising whoosh as
// it stands up, a ping on TWICE → the pot: a copper clang, a thud on FOUR → the climb: footsteps on rock, breathing
// drum, a chant-like hum → the lighters: torches crackling, a conch on FISHERMEN → the map: a gong, quiet → the sea:
// waves on the shore, wind → the shark: a rumble, a breach splash → the vow: drum → the net: a whoosh, a splash,
// thrashing water → SHIVA: a big bell and shimmer → NANDI: a bell, a soft om → the clan: bells, torches → the climb
// at dusk → the ignition: silence, a whoosh, a fire roar, a crowd's cheer and conch → the hill: crowd far below → card.
import { readFileSync, existsSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, plink, shimmer, note, seed, chime, thud, rnd, drum, om, conch, wind, drone, slide, fire, rumble } from './sfx.mjs';

const TL = runInNewContext(readFileSync('src/scenes/kula_vo.js', 'utf8') + '\n' + readFileSync('src/scenes/kula_tl.js', 'utf8') + '\n;TL');
const T = track(TL.END);
seed(115);
const templeBell = (f = 76, amp = 1, dur = 4) => bell(note(f), dur, { partials: [[1, 1], [2.02, .6], [2.76, .45], [4.1, .3], [5.4, .18]], k: 1.1, amp });
const gong = (f = 40, amp = 1, dur = 5) => bell(note(f), dur, { partials: [[1, 1], [1.48, .6], [2.1, .5], [2.9, .3], [3.7, .2]], k: .6, amp });
const copper = (amp = 1) => bell(note(50), 2.5, { partials: [[1, 1], [1.7, .7], [2.6, .5], [3.9, .35], [5.3, .2]], k: 1.6, amp });
const swellUp = (dur, amp = 1) => noise(dur, { hp: 300, lp: t => 800 + 7000 * (t / dur) ** 2, e: (t, D) => (t / D) ** 2.2, amp });
const boom = (amp = 1) => mixb(drum(34, amp, 2.2), thud(amp * 1.1), noise(.8, { lp: 600, e: env.pluck(4), amp: amp * .6 }));
const crowd = (dur, k = 1) => { const b = noise(dur, { hp: 280, lp: 2200, e: env.swell(.6, .8), amp: 1 }); for (let i = 0; i < b.length; i++) { const t = i / 48000; b[i] *= k * (.75 + .25 * Math.sin(t * 3.7) * Math.sin(t * 1.7 + 1)); } return b; };
const waves = (dur, amp = 1) => { const b = noise(dur, { hp: 60, lp: 1400, e: env.swell(.6, 1), amp }); for (let i = 0; i < b.length; i++) { const t = i / 48000; b[i] *= .35 + .65 * Math.max(0, Math.sin(t * .9)) ** 3; } return b; };
const splash = (amp = 1) => mixb(noise(1.4, { hp: 400, lp: t => 6000 - 3000 * t, e: env.pluck(2.2), amp }), noise(.5, { lp: 500, e: env.pluck(6), amp: amp * .7 }));
const step = (amp = 1) => mixb(noise(.09, { hp: 200, lp: 1800, e: env.pluck(30), amp }), drum(70, amp * .25, .08));
const crickets = (dur, amp = 1) => { const b = new Float32Array(Math.floor(dur * 48000)); for (let i = 0; i < b.length; i++) { const t = i / 48000; b[i] = amp * Math.sin(TAU * 4400 * t) * (Math.sin(TAU * 28 * t) > .2 ? 1 : 0) * (Math.sin(TAU * .9 * t) > 0 ? 1 : .15) * .3; } return b; };
const TAU = Math.PI * 2, rr = (a, b) => a + (b - a) * rnd();
const roar = (dur, amp = 1) => mixb(fire(dur, .9, amp), noise(dur, { hp: 40, lp: 400, e: env.swell(.3, .8), amp: amp * .8 }));

// ================= A · the summit fire (sound from frame 0), the cut to the hill =================
T.at(0, roar(TL.MOUNTAIN, 1), .12, 0);
T.at(0, wind(TL.B0 + .3, 3, 1.2), .05, 0);
T.at(0, mixb(gong(40, .8, 5), om(3, note(36), .6)), .08, 0);
T.at(TL.KILOS - .05, mixb(drum(45, .7, 1), chime(note(79), .5, 2.5)), .08, 0);
T.at(TL.MOUNTAIN - .3, mixb(boom(.7), templeBell(57, .8, 5)), .16, 0);
T.at(TL.MOUNTAIN - .3, crowd(TL.B0 - TL.MOUNTAIN + .6, .6), .03, 0);
// ================= B · the diya; the years race =================
T.at(TL.B0 - .1, whoosh(.9, 2000, 300, .5), .06, 0);
T.at(TL.B0, crickets(TL.C0 - TL.B0, 1), .02, .3);
T.at(TL.B0, fire(TL.C0 - TL.B0, .12, .3), .05, 0);
T.at(TL.ONE - .05, templeBell(76, .6, 3), .06, 0);
T.at(TL.EVENING - .05, chime(note(81), .5, 2.5), .05, 0);
{ let t = TL.B1, dt = .5; while (t < TL.YEARS + .3) { T.at(t, plink(note(88 + ((t * 7) | 0) % 5), .5), .035, rr(-.5, .5)); t += dt; dt = Math.max(.06, dt * .8); } }
T.at(TL.B1, swellUp(TL.YEARS - TL.B1 + .3, .8), .06, 0);
T.at(TL.YEARS + .25, mixb(templeBell(64, 1, 5), shimmer(1.4, [note(81), note(86), note(88)], .5, .1)), .1, 0);
// ================= C · the wick; stood up =================
T.at(TL.C0 - .15, whoosh(1, 300, 2200, .6), .07, 0);
T.at(TL.C0, wind(TL.D0 - TL.C0 + .3, 4, 1.5), .06, 0);
T.at(TL.METRES - .05, mixb(drum(50, .6, .7), noise(.6, { hp: 800, lp: 3000, e: env.pluck(5), amp: .6 })), .07, 0);
T.at(TL.C1, whoosh(2.2, 200, 3200, 1), .1, 0);
T.at(TL.TWICE - .05, mixb(plink(note(86), .8), chime(note(79), .6, 2.5)), .09, 0);
T.at(TL.MOUNT2 - .1, templeBell(60, .7, 4), .07, 0);
// ================= D · the pot =================
T.at(TL.D0 - .1, whoosh(.9, 2400, 400, .6), .06, 0);
T.at(TL.D0, wind(TL.E0 - TL.D0 + .3, 3, 1), .05, 0);
T.at(TL.COPPER - .05, copper(.9), .12, 0);
T.at(TL.MAN - .05, plink(note(84), .6), .06, 0);
T.at(TL.FOUR - .05, mixb(thud(1), drum(40, .8, 1.2)), .2, 0);
// ================= E · the climb =================
T.at(TL.E0, wind(TL.F0 - TL.E0 + .3, 2, 1), .05, 0);
for (let t = TL.E0 + .1; t < TL.F0; t += .38) T.at(t + rr(-.04, .04), step(rr(.6, 1)), .07, rr(-.6, .6));
for (let t = TL.E0 + .2; t < TL.F0; t += .76) T.at(t, drum(46, .5, .4), .06, 0);
T.at(TL.FORTY - .05, mixb(drum(42, .8, 1), templeBell(67, .5, 3)), .08, 0);
// ================= F · the lighters at dusk =================
T.at(TL.F0 - .1, whoosh(1, 300, 1800, .6), .06, 0);
T.at(TL.F0, fire(TL.G0 - TL.F0 + .3, .35, .6), .08, 0);
T.at(TL.F0, wind(TL.G0 - TL.F0 + .3, 3, 1), .04, 0);
T.at(TL.GENS - .1, templeBell(62, .7, 4), .07, 0);
T.at(TL.FISHER - .15, conch(2.4, 311, .9), .09, 0);
// ================= G · the map: 90 km from the sea =================
T.at(TL.G0 - .05, gong(36, 1, 5), .12, 0);
T.at(TL.G0, drone(TL.H0 - TL.G0 + .3, note(33), .6), .05, 0);
T.at(TL.KM - .05, mixb(plink(note(86), .8), shimmer(1, [note(90), note(93)], .5, .07)), .08, 0);
T.at(TL.SEA - .1, waves(2.6, .7), .06, .3);
// ================= H · the shore; Parvati =================
T.at(TL.H0 - .2, whoosh(1.4, 2600, 200, .8), .08, 0);
T.at(TL.H0, waves(TL.I0 - TL.H0 + .3, 1), .1, 0);
T.at(TL.H0, wind(TL.I0 - TL.H0 + .3, 4, 1.3), .04, 0);
T.at(TL.PURANAM - .1, mixb(templeBell(60, .8, 5), shimmer(1.6, [note(76), note(81), note(84)], .4, .08)), .08, 0);
T.at(TL.PARVATI - .05, chime(note(81), .6, 3), .07, 0);
T.at(TL.CHIEF - .05, drum(48, .6, .8), .06, 0);
// ================= I · the shark =================
T.at(TL.I0, waves(TL.I1 - TL.I0 + .3, 1.1), .1, 0);
T.at(TL.I0, rumble(TL.SHARK - TL.I0 + .3, 1), .1, 0);
T.at(TL.SHARK - .25, mixb(splash(1), boom(.6)), .2, 0);
T.at(TL.SHARK + .9, splash(.9), .16, .3);
// ================= I1 · the vow =================
T.at(TL.I1, waves(TL.J0 - TL.I1 + .3, .8), .07, 0);
T.at(TL.I1 + .4, mixb(drum(44, .9, 1), conch(1.4, 330, .5)), .09, 0);
T.at(TL.MARRIES - .05, mixb(templeBell(64, .8, 4), drum(40, .7, 1)), .09, 0);
// ================= J · the net =================
T.at(TL.J0, waves(TL.K0 - TL.J0 + .3, 1), .09, 0);
T.at(TL.NET - .9, swellUp(.8, .6), .05, 0);
T.at(TL.NET - .1, whoosh(.9, 600, 3400, .9), .1, 0);
T.at(TL.NET + .7, splash(.7), .12, .3);
for (let i = 0; i < 6; i++) T.at(TL.DRAGS - .2 + i * .22, splash(.5), .09, .4);
// ================= K · SHIVA; K1 · NANDI =================
T.at(TL.SHIVA - .7, swellUp(.7, 1), .1, 0);
T.at(TL.SHIVA - .15, mixb(templeBell(52, 1, 7), gong(40, .8, 6), shimmer(2.4, [note(76), note(81), note(84), note(88), note(93)], .8, .12)), .16, 0);
T.at(TL.SHIVA + .1, conch(2.6, 300, .8), .08, 0);
T.at(TL.K1, waves(TL.L0 - TL.K1 + .3, .7), .06, 0);
T.at(TL.NANDI - .2, mixb(templeBell(57, .9, 5), om(3.5, note(36), .8)), .12, 0);
// ================= L · Parvatha Raja Kulam =================
T.at(TL.L0 - .1, whoosh(1.2, 300, 2000, .6), .07, 0);
T.at(TL.L0, fire(TL.M0 - TL.L0 + .3, .35, .6), .07, 0);
T.at(TL.L0, wind(TL.M0 - TL.L0 + .3, 3, 1), .04, 0);
T.at(TL.KULAM - .1, mixb(templeBell(60, 1, 5), templeBell(67, .6, 4)), .1, 0);
T.at(TL.FATHER - .05, chime(note(84), .5, 3), .06, 0);
// ================= M · the bride's family climbs =================
T.at(TL.M0, fire(TL.M1 - TL.M0 + .3, .3, .5), .06, 0);
for (let t = TL.M0 + .1; t < TL.M1; t += .4) T.at(t + rr(-.04, .04), step(rr(.6, 1)), .06, rr(-.6, .6));
T.at(TL.BRIDE - .05, chime(note(81), .6, 2.5), .06, 0);
T.at(TL.HIS - .05, mixb(drum(42, .8, 1), templeBell(55, .7, 4)), .09, 0);
// ================= M1 · the ignition; the hill =================
T.at(TL.FIRE - .5, whoosh(.5, 200, 4000, .9), .1, 0);
T.at(TL.FIRE - .05, mixb(boom(1), roar(4, 1.2)), .26, 0);
T.at(TL.FIRE + .1, mixb(templeBell(48, 1, 8), templeBell(55, .8, 7)), .14, 0);
T.at(TL.FIRE + .25, crowd(TL.CARD - TL.FIRE, 1.2), .07, 0);
T.at(TL.FIRE + .6, conch(3, 300, 1), .1, -.2);
T.at(TL.FIRE + .9, conch(2.6, 350, .8), .07, .3);
// ================= N · eleven days; tag them =================
T.at(TL.DAYS - .1, mixb(templeBell(64, .9, 5), drum(45, .7, 1)), .09, 0);
T.at(TL.TAG - .05, plink(note(86), .8), .07, 0);
// ================= the card =================
T.at(TL.CARD - .3, whoosh(.7, 400, 3200), .12, 0);
T.at(TL.CARD + .35, mixb(...[67, 71, 74, 79].map((m) => bell(note(m), 2.2, { partials: [[1, 1], [2, .35], [3, .12]], k: 1.4, amp: .7 }))), .12, 0);

T.write('assets/kula_sfx.wav');
console.log('assets/kula_sfx.wav', TL.END.toFixed(2), 's');
// the mix: the voice over the SFX and the score (ducked under the voice), normalised to -14 LUFS
const D = TL.END.toFixed(3), score = existsSync('assets/kula_score_cut.wav') ? 'assets/kula_score_cut.wav' : null;
const inputs = ['-i', 'assets/kula_vo.wav', '-i', 'assets/kula_sfx.wav', ...(score ? ['-i', score] : [])];
const fc = score
  ? `[0:a]volume=1.15,asplit[v][vk];[1:a]volume=0.75[s];[2:a]volume=0.5[m0];[m0][vk]sidechaincompress=threshold=0.04:ratio=3:attack=40:release=450:makeup=1[m];[v][s][m]amix=inputs=3:normalize=0:duration=longest,apad=whole_dur=${D},atrim=0:${D},loudnorm=I=-14:TP=-1.5:LRA=11[o]`
  : `[1:a]volume=0.95[s];[0:a][s]amix=inputs=2:normalize=0:duration=longest,apad=whole_dur=${D},atrim=0:${D},loudnorm=I=-14:TP=-1.5:LRA=11[o]`;
execFileSync('ffmpeg', ['-y', '-v', 'error', ...inputs, '-filter_complex', fc, '-map', '[o]', '-ar', '48000', '-ac', '2', 'assets/kula_mix.wav']);
console.log('assets/kula_mix.wav', score ? '(with the score)' : '(voice + SFX)');
