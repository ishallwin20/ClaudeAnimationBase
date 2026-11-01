// dhan_sfx.mjs: the sound effects for "DHANTERAS was never about GOLD" (src/scenes/dhan.js) → assets/dhan_sfx.wav, then
// the mix with the voice → assets/dhan_mix.wav. Times come from the voice and the timeline (src/scenes/dhan_vo.js +
// dhan_tl.js, loaded with vm), so they follow the picture.
// The coin: its ring as it spins, the clatter speeding up as it falls flat, a last clink. The ocean: a low sea and the
// churn's slow groan, a conch; each treasure a rising shimmer, Lakshmi a harp-like run and a bell; the churn quickening
// under a drum; Dhanvantari a deep bell, a conch and the amrit's glow; Ayurveda a chime; wealth a low plink, life a
// bright bell. The dusk: crickets, a soft wind, the lamp catching; not one word about gold, a lone coin tick in silence.
// The screenshot a shutter, the ask a clink and a shimmer, next the aarti bells as the lamps light, the card.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, plink, clang, click, shimmer, drone, note, seed, chime, drum, conch, thud, wind, rnd, SR } from './sfx.mjs';

const TL = runInNewContext(readFileSync('src/scenes/dhan_vo.js', 'utf8') + '\n' + readFileSync('src/scenes/dhan_tl.js', 'utf8') + '\n;TL');
const T = track(TL.END);
seed(71);
const add = (o, b, s0, g = 1) => { const s = Math.round(s0 * SR); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j] * g; return o; };
const buf = d => new Float32Array(Math.round(d * SR)), TAU = Math.PI * 2;
const pop = (amp = 1, f = 1) => mixb(click(amp), tone(.07, t => f * (500 + 2600 * t / .07), { e: env.pluck(40), amp: amp * .7 }), noise(.05, { lp: 2500, hp: 300, e: env.pluck(60), amp: amp * .5 }));
const chord = (ms, d = 2, amp = 1) => { const o = buf(d + 1); ms.forEach((m, i) => add(o, bell(note(m), d, { partials: [[1, 1], [2, .35], [3, .12]], k: 1.4, amp }), i * .05)); return o; };
const pad = (dur, ms, amp = 1) => mixb(...ms.map((m, i) => tone(dur, t => note(m) * (1 + .003 * Math.sin(t * 2 + i)), { type: 'tri', e: env.swell(.8, .8), amp: amp / ms.length })));
const templeBell = (f = 76, amp = 1) => bell(note(f), 4, { partials: [[1, 1], [2.02, .6], [2.76, .45], [4.1, .3], [5.4, .18]], k: 1.1, amp });
// a coin's ring: a bright metallic partial set, short
const coinRing = (amp = 1, f = 3100) => bell(f, .5, { partials: [[1, 1], [1.47, .6], [2.3, .35], [3.1, .2]], k: 9, amp });
// the spin on cloth: a soft rolling whirr pulsing at the spin rate
const spinWhirr = (dur, rate = 2.4, amp = 1) => noise(dur, { lp: 3200, hp: 900, e: (t, D) => clamp(t / .2) * clamp((D - t) / .2) * (.5 + .5 * Math.sin(t * rate * TAU)) ** 2, amp });
// the sea of milk: slow swells of low noise
const sea = (dur, amp = 1) => noise(dur, { lp: t => 380 + 180 * Math.sin(t * .5) + 90 * Math.sin(t * 1.3), hp: 40, brown: true, e: (t, D) => clamp(t / 1.2) * clamp((D - t) / 1.2) * (.7 + .3 * Math.sin(t * .9)), amp });
// the churn's groan: the mountain grinding to and fro
const groan = (dur, rate = .9, amp = 1) => mixb(noise(dur, { lp: 220, hp: 30, brown: true, e: (t, D) => clamp(t / .8) * clamp((D - t) / .8) * (.4 + .6 * Math.abs(Math.cos(t * rate))), amp }),
  tone(dur, t => 46 + 6 * Math.sin(t * rate), { type: 'saw', e: (t, D) => clamp(t / .8) * clamp((D - t) / .8) * .5 * Math.abs(Math.cos(t * rate)), amp: amp * .25 }));
// crickets at dusk: chirps in short trains
const crickets = (dur, amp = 1) => { const o = buf(dur); for (let k = 0; k < dur * 2.2; k++) { const t0 = k / 2.2 + rnd() * .2, f = 4200 + rnd() * 600; for (let j = 0; j < 3; j++) add(o, tone(.035, f, { e: env.hann(), amp: amp * (.6 + .4 * rnd()) }), t0 + j * .05); } return o; };
// a flame catching: a soft breathy whoomp
const catchFlame = (amp = 1) => mixb(noise(.5, { lp: t => 600 + 2400 * Math.exp(-t * 6), hp: 120, e: env.swell(.02, .4), amp }), tone(.3, t => 90 + 60 * Math.exp(-t * 10), { e: env.pluck(8), amp: amp * .4 }));
const shutter = () => mixb(click(1), noise(.06, { lp: 6000, hp: 1500, e: env.pluck(50), amp: .7 }), click(.6));

// ---- A: the coin: spinning, then falling flat with the clatter speeding up, a last clink
const FALL0 = TL.NAME - .15, FALL1 = FALL0 + .85;
T.at(0, coinRing(.5), .12, 0);
T.at(0, spinWhirr(FALL0 + .1, 2.4, 1), .16, 0);
{ let t = FALL0, gap = .16; while (t < FALL1 + .5) { T.at(t, mixb(click(.8), coinRing(.3, 2800 + rnd() * 600)), .14 * (1 - seg(t, FALL1, FALL1 + .55) * .7), (rnd() - .5) * .3); t += gap; gap = Math.max(.018, gap * .82); } }
T.at(FALL1 + .5, coinRing(.9, 3000), .2, 0);
T.at(TL.NAME, chime(note(86), .5, 1.8), .09, -.2);
T.at(TL.TRAY, chime(note(90), .5, 1.8), .09, .2);

// ---- C: the ocean of milk: the sea and the churn under the whole ocean act
T.at(TL.C0 - .4, whoosh(.9, 300, 2200), .16, 0);
T.at(TL.C0, sea(TL.J0 - TL.C0 + .5, 1), .045, 0);
T.at(TL.C0, groan(TL.F0 - TL.C0 + .3, .9, 1), .06, 0);
T.at(TL.C0 + .3, drone(TL.J0 - TL.C0, 55, .7), .05, 0);
T.at(TL.AMRIT - .05, mixb(conch(2.4, 233, .5), shimmer(1.8, [note(86), note(90), note(93)], .5, .08)), .12, 0);
// ---- D: the treasures rising
[[TL.COW, 81], [TL.ELEPHANT, 84], [TL.JEWEL, 88]].forEach(([at, m], i) => {
  T.at(at - .6, whoosh(.8, 500, 3000, .7), .08, (i - 1) * .4);
  T.at(at - .1, shimmer(1.6, [note(m), note(m + 4), note(m + 7), note(m + 12)], .55, .07), .1, (i - 1) * .4);
});
// ---- E: Lakshmi: a harp-like run as the lotus opens, a bell on her name
T.at(TL.E0, shimmer(2.6, [72, 74, 76, 79, 81, 84, 86, 88, 91].map(note), .45, .09), .1, 0);
T.at(TL.LAKSHMI, templeBell(79, .7), .16, 0);
T.at(TL.WEALTH, chime(note(91), .4, 1.6), .07, .3);
// ---- F: they kept churning: the groan quickens under a drum, building
T.at(TL.F0, groan(TL.G0 - TL.F0 + .4, 2.3, 1.3), .08, 0);
{ const n = 8; for (let i = 0; i < n; i++) { const tt = TL.F0 + .2 + i * (TL.G0 - TL.F0 - .2) / n; T.at(tt, drum(52, .8 + .4 * i / n, .6), .09 + .06 * i / n, 0); } }
T.at(TL.G0 - 1.2, whoosh(1.4, 200, 3000), .14, 0);
// ---- G: Dhanvantari rises: a deep bell, a conch; the amrit's glow
T.at(TL.G0 + .05, mixb(thud(1), drum(40, 1, 1.2)), .3, 0);
T.at(TL.G0 + .3, noise(2.4, { lp: t => 300 + 1600 * t / 2.4, hp: 80, e: env.swell(.3, .8), amp: 1 }), .08, 0);
T.at(TL.DHANV - .05, templeBell(64, 1), .28, 0);
T.at(TL.DHANV + .2, conch(3.2, 233, .6), .11, 0);
T.at(TL.AMRIT2 - .1, shimmer(2.2, [74, 78, 81, 86, 90, 93].map(note), .5, .12), .1, 0);
T.at(TL.G0, pad(TL.J0 - TL.G0 + .5, [50, 57, 62], .9), .06, 0);
// ---- H: Ayurveda
T.at(TL.AYURVEDA, chime(note(88), .6, 2), .12, 0);
// ---- I: wealth came first (low), life was the prize (bright)
T.at(TL.WEALTH2, plink(note(67), .8), .14, -.4);
T.at(TL.LIFE, mixb(templeBell(76, .8), shimmer(1.6, [note(88), note(93), note(98)], .5, .08)), .2, .3);

// ---- J: dusk at the door: crickets, wind, the room's lamplight
T.at(TL.J0 - .3, whoosh(1.0, 2600, 300), .12, 0);
T.at(TL.J0, crickets(TL.CARD - TL.J0, .5), .05, .3);
T.at(TL.J0, wind(TL.CARD - TL.J0, .3, 1.5), .05, -.2);
T.at(TL.PADMA, chime(note(81), .4, 1.6), .08, 0);
// ---- K: the lamp catches for Yama
T.at(TL.LAMP - .15, mixb(click(.6), catchFlame(1)), .22, .2);
T.at(TL.YAMA, bell(note(52), 3, { partials: [[1, 1], [2.02, .5], [3.1, .25]], k: .9, amp: .8 }), .12, 0);
T.at(TL.DEATH + .1, drone(2.4, 41, .6), .08, 0);
// ---- L: not one word about gold: a lone coin tick in near silence
T.at(TL.GOLD, coinRing(.6, 3300), .12, -.2);
// ---- M: screenshot
T.at(TL.M0 - .2, whoosh(.7, 400, 2600), .14, 0);
T.at(TL.SCREEN + .25, shutter(), .35, 0);
for (let i = 0; i < 3; i++) T.at(TL.SCREEN + .1 + i * .15, pop(.4, 1 + i * .1), .12, 0);
// ---- N: the ask: a clink on GOLD, the amrit's shimmer on HEALTH
T.at(TL.N0 - .2, whoosh(.7, 400, 2600), .14, 0);
T.at(TL.GOLD2, coinRing(.9, 3000), .16, -.4);
T.at(TL.HEALTH2, shimmer(1.6, [note(86), note(90), note(93)], .55, .08), .14, .4);
// ---- O: next: the lamps lighting one by one, aarti bells
T.at(TL.O0 - .2, whoosh(.8, 400, 2600), .16, 0);
T.at(TL.NEXT, chime(note(81), .7, 1.6), .14, 0);
for (let i = 0; i < 7; i++) T.at(TL.O0 + i * .3 / 1.6 * 1.0 + .05, mixb(click(.3), catchFlame(.35)), .1, (i - 3) * .12);
for (let k = 0; TL.AARTI - .2 + k * .6 < TL.CARD - .3; k++) T.at(TL.AARTI - .2 + k * .6, mixb(bell(note(88), .5, { k: 6, amp: .5 }), click(.3)), .09, k % 2 ? .3 : -.3);
T.at(TL.FOLLOW, templeBell(76, .7), .16, 0);

// ---- the card
T.at(TL.CARD - .3, whoosh(.7, 400, 3200), .26, 0);
T.at(TL.CARD + .35, chord([67, 71, 74, 79], 2.2, .7), .22, 0);
for (let k = 0; k < 3; k++) T.at(TL.CARD + .7 + k * .12, pop(.8, 1 + k * .15), .26, (k - 1) * .4);
T.at(TL.CARD + 1.25, pop(.6, .9), .18, 0);
T.at(TL.CARD + 1.65, mixb(pop(1, 1.3), shimmer(.7, [note(91), note(95), note(98)], .6, .06)), .28, 0);
T.at(TL.CARD, pad(TL.END - TL.CARD, [67, 71, 74], .7), .07, 0);

function seg(t, a, b) { return clamp((t - a) / (b - a)); }
function clamp(x, a = 0, b = 1) { return Math.max(a, Math.min(b, x)); }

T.write('assets/dhan_sfx.wav');
console.log('assets/dhan_sfx.wav', TL.END.toFixed(2), 's');
// the mix: the voice at full level over the SFX, normalised to -14 LUFS
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'assets/dhan_vo.wav', '-i', 'assets/dhan_sfx.wav', '-filter_complex',
  `[1:a]volume=0.85[s];[0:a][s]amix=inputs=2:normalize=0:duration=longest,apad=whole_dur=${TL.END.toFixed(3)},atrim=0:${TL.END.toFixed(3)},loudnorm=I=-14:TP=-1.5:LRA=11[o]`,
  '-map', '[o]', '-ar', '48000', '-ac', '2', 'assets/dhan_mix.wav']);
console.log('assets/dhan_mix.wav');
