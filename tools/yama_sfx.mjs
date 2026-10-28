// yama_sfx.mjs: the sound for "Diwali is FIVE days. The god of DEATH gets THREE." (src/scenes/yama.js) →
// assets/yama_sfx.wav, then the mix with the voice (and the score, when assets/yama_score.mp3 is there) →
// assets/yama_mix.wav. Times come from the voice and the timeline (src/scenes/yama_vo.js + yama_tl.js, loaded with vm),
// so they follow the picture.
// Night: crickets and a cold wind in the lane, the diya's soft flutter; the five days a row of chimes, Yama's three a
// low toll; his buffalo's hooves and bell coming up the lane, a heartbeat, the flame flaring, the hooves going away.
// Dawn: birds, water lapping, the pour; the fourteen names a climbing chime each. The new moon: lamps catching all
// down the lane, temple bells far off. Day four: a conch at first light. A beat of silence; day five: morning birds,
// the hooves slow and stop at her door; the room: a lamp, brass on brass. The close, the ask, the card.
import { readFileSync, existsSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, plink, click, shimmer, drone, note, seed, chime, drum, conch, crackle, rnd, SR, wind, heart, chirp, thud, om } from './sfx.mjs';

const TL = runInNewContext(readFileSync('src/scenes/yama_vo.js', 'utf8') + '\n' + readFileSync('src/scenes/yama_tl.js', 'utf8') + '\n;TL');
const T = track(TL.END);
seed(58);
const pop = (amp = 1, f = 1) => mixb(click(amp), tone(.07, t => f * (500 + 2600 * t / .07), { e: env.pluck(40), amp: amp * .7 }), noise(.05, { lp: 2500, hp: 300, e: env.pluck(60), amp: amp * .5 }));
const add = (o, b, s0, g = 1) => { const s = Math.round(s0 * SR); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j] * g; return o; };
const chord = (ms, d = 2, amp = 1) => { const o = new Float32Array(Math.round((d + 1) * SR)); ms.forEach((m, i) => add(o, bell(note(m), d, { partials: [[1, 1], [2, .35], [3, .12]], k: 1.4, amp }), i * .05)); return o; };
const pad = (dur, ms, amp = 1) => mixb(...ms.map((m, i) => tone(dur, t => note(m) * (1 + .003 * Math.sin(t * 2 + i)), { type: 'tri', e: env.swell(.8, .8), amp: amp / ms.length })));
const whooshAt = (t, amp = .18) => T.at(t - .3, whoosh(.7, 400, 2600), amp, 0);
const templeBell = (f = 74, amp = 1) => bell(note(f), 4, { partials: [[1, 1], [2.02, .6], [2.76, .45], [4.1, .3], [5.4, .18]], k: 1.1, amp });
const toll = (amp = 1) => mixb(bell(note(38), 4.5, { partials: [[1, 1], [2.01, .5], [2.9, .35], [4.2, .2]], k: .9, amp }), drum(41, amp * .8, 1.4));
// crickets: a bed of short high trills
const crickets = (dur, amp = 1) => { const o = new Float32Array(Math.round(dur * SR)); for (let t = 0; t < dur; t += .32 + rnd() * .5) { const f = 4200 + rnd() * 900, n = 3 + Math.floor(rnd() * 4); for (let k = 0; k < n; k++) add(o, tone(.03, f, { e: env.hann(), amp: amp * (.5 + rnd() * .5) }), t + k * .045); } return o; };
// water lapping on the steps
const lap = (dur, amp = 1) => noise(dur, { lp: t => 700 + 400 * Math.sin(t * 1.3), hp: 150, e: (t, D) => env.swell(.6, .6)(t, D) * (.55 + .45 * Math.sin(t * 2.1) * Math.sin(t * .9 + 1)), amp });
// the buffalo's hoof, and its neck bell (a dull clank)
const hoof = (amp = 1) => mixb(thud(amp * .8), noise(.05, { hp: 600, lp: 3000, e: env.pluck(70), amp: amp * .3 }));
const neckBell = (amp = 1) => bell(note(70) * (1 + .01 * (rnd() - .5)), .9, { partials: [[1, 1], [2.3, .5], [3.6, .3]], k: 4.5, amp });
// footfalls along a walk: the distance walked d(t) (m) gives the gait (two heavy falls a 1.7 m cycle); a bell each cycle
function walk(t0, t1, dOf, gain, pan) {
  let last = dOf(t0);
  for (let t = t0; t < t1; t += 1 / 120) { const d = dOf(t); if (Math.floor(d / .85) > Math.floor(last / .85)) { T.at(t, hoof(1), gain(t), pan(t)); if (Math.floor(d / 1.7) > Math.floor(last / 1.7)) T.at(t + .05, neckBell(.7), gain(t) * .35, pan(t)); } last = d; }
}
const flameFlare = (amp = 1) => mixb(noise(.7, { lp: t => 900 + 1800 * Math.exp(-t * 3), hp: 120, e: env.ad(.03, .25), amp }), tone(.5, t => 90 + 40 * Math.exp(-t * 6), { e: env.pluck(5), amp: amp * .5 }));
const SCALE = [62, 64, 66, 69, 71, 74, 76, 78, 81, 83, 86, 88, 90, 93];   // D major pentatonic, climbing: the fourteen names

// ================= night one: the lane =================
const NIGHT1 = TL.D0 + .3;
T.at(0, crickets(NIGHT1, 1), .05, -.4); T.at(.3, crickets(NIGHT1 - .3, 1), .04, .4);
T.at(0, wind(NIGHT1, 0, 1.0), .06, -.5); T.at(0, wind(NIGHT1, 2, 1.0), .06, .5);
T.at(0, drone(NIGHT1, 55, .9), .06, 0);
// A: the hook: a soft bell, the five chips, Yama's three tolled
T.at(.05, templeBell(74, .7), .12, -.2);
for (let i = 0; i < 5; i++) T.at(TL.FIVE - .25 + i * .07, plink(note(74 + [0, 2, 4, 7, 9][i]), .6), .1, (i - 2) * .3);
T.at(TL.DEATH - .05, drum(46, .9, 1.2), .2, 0);
T.at(TL.THREE - .05, toll(1), .22, 0);
// B: the crane down the lane; far off, on YAMA, his bell and a low swell
whooshAt(TL.B0, .16);
T.at(TL.OUTSIDE - .1, flameFlare(.5), .12, 0);
T.at(TL.YAMA - .1, neckBell(.8), .1, .6); T.at(TL.YAMA + .5, neckBell(.6), .07, .6);
T.at(TL.YAMA - .3, drone(2.8, 41.2, 1), .14, 0);
// C1: south: a deep hit and a whoosh for the arrow
whooshAt(TL.C0, .14);
T.at(TL.SOUTH - .1, mixb(drum(52, .9, 1), bell(note(50), 2.2, { partials: [[1, 1], [2.4, .4]], k: 1.6, amp: .7 })), .2, -.3);
// C2: he comes up the lane, halts at the light, turns back
function yamaPass(t0, gain = 1) {
  const t1 = t0 + 2.0, t2 = t1 + .9, t3 = t2 + 2.4, zIn = 11, zStop = 2.2;
  walk(t0, t1, t => seg(t, t0, t1) * (zIn - zStop), t => gain * lerpN(.25, .6, seg(t, t0, t1)), t => lerpN(.7, .2, seg(t, t0, t1)));
  walk(t2, t3, t => zIn - zStop + seg(t, t2, t3) * 9, t => gain * lerpN(.5, .08, seg(t, t2, t3)), t => lerpN(.2, .8, seg(t, t2, t3)));
  for (let k = 0; k < 4; k++) T.at(t0 + .2 + k * .55, heart(1), .22 * gain, 0);
  T.at(t1, flameFlare(1), .3 * gain, 0);
  T.at(t1 + .02, mixb(drum(38, 1, 1.6), whoosh(1.2, 2400, 300)), .24 * gain, 0);
  T.at(t1 + .2, drone(2.4, 36.7, 1), .12 * gain, 0);
}
yamaPass(TL.C1 + .1);

// ================= day two: dawn at the ghat =================
const DAWN = [TL.D0, TL.E0 + .2];
T.at(DAWN[0], lap(DAWN[1] - DAWN[0], 1), .1, .2);
for (let i = 0; i < 12; i++) T.at(lerpN(DAWN[0] + .5, DAWN[1] - .5, rnd()), mixb(chirp(.6), chirp(.4)), .05 + rnd() * .04, rnd() * 1.6 - .8);
T.at(DAWN[0], pad(DAWN[1] - DAWN[0], [62, 69, 74], .7), .06, 0);
whooshAt(TL.D0, .12);
// the pour: water into water, the sesame ticking
T.at(TL.WATER - .1, noise(TL.E0 - TL.WATER, { lp: 2600, hp: 400, e: env.swell(.3, .5), amp: 1 }), .07, .3);
for (let i = 0; i < 14; i++) T.at(TL.WATER + .2 + i * .28, click(.4), .05, .3);
// the names: a chime each, climbing; the last a chord
for (let i = 0; i < 14; i++) T.at(TL.N14 + i * TL.NSTEP - .03, chime(note(SCALE[i]), .8, 1.6), .16, ((i % 5) - 2) * .25);
T.at(TL.N14 + 13 * TL.NSTEP + .25, chord([62, 66, 69, 74, 78], 2.4, .7), .18, 0);
T.at(TL.N14 - .3, conch(2.4, 233, .5), .08, 0);

// ================= day three: the new moon, every lamp =================
const E1 = TL.F0 + .2;
T.at(TL.E0, crickets(E1 - TL.E0, 1), .04, 0);
whooshAt(TL.E0, .16);
for (let i = 0; i < 26; i++) { const t = TL.E0 + .1 + Math.pow(i / 26, .8) * 1.9; T.at(t, plink(note(78 + [0, 2, 4, 7, 9, 12][i % 6]), .5), .05 + .04 * (1 - i / 26), rnd() * 1.4 - .7); }
T.at(TL.LAKSHMI - .2, shimmer(1.6, [note(81), note(86), note(90), note(93), note(98)], .6, .09), .12, 0);
T.at(TL.E0 + .4, templeBell(79, .6), .07, -.6); T.at(TL.E0 + 1.6, templeBell(76, .5), .05, .6);
T.at(TL.E0, pad(E1 - TL.E0, [62, 66, 69, 74], .8), .08, 0);
// day four: first light, a conch from the hill
whooshAt(TL.F0, .12);
T.at(TL.GOVARDHAN - .4, conch(2.4, 262, .7), .1, .2);
T.at(TL.GOVARDHAN - .1, shimmer(1.2, [note(74), note(78), note(81), note(86)], .5, .08), .08, 0);

// ================= the beat of silence; day five =================
// (nothing between G0 - .25 and G0 + .3) then a single bell, morning birds, the hooves slowing to her door
T.at(TL.G0 + .25, templeBell(74, .8), .16, 0);
const MORN = [TL.G0 + .3, TL.H0 + .4];
for (let i = 0; i < 10; i++) T.at(lerpN(MORN[0], MORN[1], rnd()), mixb(chirp(.7), chirp(.5)), .06 + rnd() * .04, rnd() * 1.6 - .8);
T.at(MORN[0], lap(MORN[1] - MORN[0], .8), .06, .5);
const gWalk = (a, b) => { const easeO = x => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3); walk(a, b, t => easeO(seg(t, a, b)) * 12, () => .22, t => lerpN(.4, -.3, seg(t, a, b))); };
gWalk(TL.G0 + .2, TL.HOUSE + .3);
T.at(TL.G0 + .3, pad(TL.H0 + .4 - TL.G0 - .3, [62, 66, 69], .7), .07, 0);
T.at(TL.SISTERS - .1, chord([66, 69, 74, 78], 2.2, .6), .12, 0);
// the room: a lamp burning, his shadow (a low warm swell), brass on brass
T.at(TL.H0, crackle(TL.J0 - TL.H0, .25), .015, -.3);
T.at(TL.H0, pad(TL.J0 + .4 - TL.H0, [57, 64, 69, 73], .9), .09, 0);
T.at(TL.YAMUNA - .2, drone(3, 49, 1), .08, 0);
T.at(TL.FED, chime(note(81), .7, 2.4), .12, 0);
whooshAt(TL.I0, .12);
for (const [dt, f] of [[.3, 1500], [.9, 1350], [1.5, 1700]]) T.at(TL.I0 + dt, bell(f, 1.0, { partials: [[1, 1], [2.32, .6], [3.87, .4]], k: 4, amp: .6 }), .07, (rnd() - .5) * .6);
T.at(TL.SISTERH - .1, shimmer(1.2, [note(78), note(81), note(86), note(90)], .5, .08), .1, 0);

// ================= the close: two days (the lane again), the third (her door) =================
T.at(TL.J0, crickets(TL.J1 - TL.J0 + .3, 1), .04, 0);
yamaPass(TL.J0 - 1.3, .8);
for (let i = 0; i < 6; i++) T.at(lerpN(TL.J1, TL.K0, rnd()), chirp(.6), .05, rnd() * 1.4 - .7);
{ const a = TL.J1 - .2, b = TL.HOME + .1, easeO = x => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3); walk(Math.max(a, TL.J1), b, t => easeO(seg(t, a, b)) * 12, () => .2, () => -.1); }
T.at(TL.HOME - .1, chord([62, 66, 69, 74, 78], 3, .8), .16, 0);
T.at(TL.J1, pad(TL.K0 + .4 - TL.J1, [62, 69, 74, 78], .8), .09, 0);

// ================= the ask =================
T.at(TL.K0, crickets(TL.CARD - TL.K0, 1), .04, 0);
whooshAt(TL.K0, .12);
T.at(TL.DIYA - .3, mixb(whoosh(.5, 600, 3000), plink(note(74), .6)), .12, -.4);
T.at(TL.YES - .05, mixb(plink(note(86)), click(.6)), .2, -.3);
T.at(TL.NO - .05, mixb(plink(note(81)), click(.6)), .2, .3);
T.at(TL.K0, pad(TL.CARD - TL.K0, [62, 66, 69], .8), .08, 0);

// ================= the card =================
T.at(TL.CARD - .3, whoosh(.7, 400, 3200), .3, 0);
T.at(TL.CAP_T, chord([67, 71, 74, 79], 2.2, .7), .25, 0);
for (let k = 0; k < 3; k++) T.at(TL.COVERS + k * .12, pop(.8, 1 + k * .15), .3, (k - 1) * .4);
T.at(TL.PRICE, pop(.6, .9), .2, 0);
T.at(TL.PILL, mixb(pop(1, 1.3), shimmer(.7, [note(91), note(95), note(98)], .6, .06)), .32, 0);
T.at(TL.CARD, pad(TL.END - TL.CARD, [67, 71, 74], .7), .08, 0);

T.write('assets/yama_sfx.wav');
console.log('assets/yama_sfx.wav', TL.END.toFixed(2), 's');
// the mix: the voice at full level over the SFX (and the score, ducked under the voice and dropped out for the beat of
// silence before day five), normalised to -14 LUFS
const D = TL.END.toFixed(3), score = existsSync('assets/yama_score.mp3');
const fc = score
  ? `[1:a]volume=0.85[s];[2:a]atrim=0:${D},volume=${process.env.SCORE ?? '0.18'},volume='min(1,max(0,(abs(t-${(TL.G0 + .05).toFixed(2)})-0.3)/0.9))':eval=frame[m];[m][0:a]sidechaincompress=threshold=0.03:ratio=4:attack=20:release=400[md];[0:a][s][md]amix=inputs=3:normalize=0:duration=longest,apad=whole_dur=${D},atrim=0:${D},loudnorm=I=-14:TP=-1.5:LRA=11[o]`
  : `[1:a]volume=0.85[s];[0:a][s]amix=inputs=2:normalize=0:duration=longest,apad=whole_dur=${D},atrim=0:${D},loudnorm=I=-14:TP=-1.5:LRA=11[o]`;
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'assets/yama_vo.wav', '-i', 'assets/yama_sfx.wav', ...(score ? ['-i', 'assets/yama_score.mp3'] : []), '-filter_complex', fc,
  '-map', '[o]', '-ar', '48000', '-ac', '2', 'assets/yama_mix.wav']);
console.log('assets/yama_mix.wav', score ? '(with the score)' : '(voice + SFX)');

function seg(t, a, b) { return Math.min(1, Math.max(0, (t - a) / (b - a))); }
function lerpN(a, b, k) { return a + (b - a) * k; }
