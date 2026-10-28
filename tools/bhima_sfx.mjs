// bhima_sfx.mjs: the sound effects for "BHIMA couldn't lift an old monkey's TAIL" (src/scenes/bhima.js) →
// assets/bhima_sfx.wav, then mixed with the Lyria score (kept mild, under everything) into assets/bhima_mix.wav.
// Times are the scene's TL (keep them in sync). Beds: forest birds and a breeze in the grove, a wind on the mountain,
// dust and a far army at Kurukshetra. On top: the lotus shimmer, Bhima's heavy steps, the trees crashing, the roars, the
// snore, cartoon voices under every spoken line (Bhima low, Hanuman higher and lazy), the grab, the grunts and the
// creak of the pull, the yawn, the reveal, the growing rumble and the boom, the hug, the conch and the flag, the card.
//   node tools/bhima_sfx.mjs [--score=assets/bhima_score_a.mp3]
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, plink, click, thud, shimmer, slide, squeak, crunch, note, seed, clamp, chime, wind, drum, roar, conch, wingbeat, rumble, chirp, SR } from './sfx.mjs';

const TL = {
  hook: 0, lotus: 3.4, charge: 6.8, roar: 9.8, monkey: 12.4, wake: 15.4, getup: 18.6, jump: 21.0, god: 24.0, leap: 27.2,
  who: 30.4, bro: 32.8, tail: 35.6, one: 38.8, both: 40.4, budge: 42.2, bow: 44.8, iam: 48.0, elder: 51.0, vayu: 53.4,
  show: 56.4, giant: 59.4, grow2: 62.4, hug: 65.0, flag: 68.4, ask: 72.0, card: 75.4, end: 80.4,
};
const FALLS = [[TL.charge + 1.2, -.7], [TL.roar + .1, .7], [TL.roar + 1.3, -.8]], ENTER = TL.monkey + 1.4, ROAR2 = TL.monkey + 2.0;
const T = track(TL.end);
seed(57);
const add = (o, b, s0, g = 1) => { const s = Math.round(s0 * SR); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j] * g; return o; };
const lp = (b, fc) => { let l = 0; const a = 1 - Math.exp(-2 * Math.PI * fc / SR); for (let i = 0; i < b.length; i++) { l += a * (b[i] - l); b[i] = l; } return b; };
// a buzzy cartoon voice: syllables [start, dur, pitch ×, brightness]
function voice(syl, f0, { amp = 1, fall = .1, rise = 0 } = {}) {
  const D = Math.max(...syl.map(([s, d]) => s + d)) + .1, o = new Float32Array(Math.round(D * SR));
  let ph = 0, l = 0;
  for (let i = 0; i < o.length; i++) {
    const t = i / SR, s = syl.find(([a, d]) => t >= a && t < a + d);
    if (!s) { o[i] = 0; continue; }
    const [a, d, pm, br] = s, k = (t - a) / d, e = clamp(k / .12) * clamp((1 - k) / .25);
    ph += f0 * pm * (1.04 - fall * k + rise * k) * (1 + .012 * Math.sin(t * 38)) / SR;
    const x = 2 * (ph - Math.floor(ph)) - 1, fc = 600 + br * 2400 * Math.sin(Math.PI * clamp(k * 1.3)), al = 1 - Math.exp(-2 * Math.PI * fc / SR);
    l += al * (x * e - l); o[i] = l * amp;
  }
  return o;
}
const chatter = (dur, f, gap = .14, br = .6, var_ = .12) => voice(Array.from({ length: Math.max(1, Math.floor(dur / gap)) }, (_, i) => [i * gap, gap * .72, 1 + var_ * Math.sin(i * 2.3) + var_ * .5 * Math.sin(i * 5.1), br]), f);
const BHIMA = 118, HAN = 190;
const step = (amp = 1) => mixb(thud(amp), noise(.08, { lp: 700, hp: 90, e: env.pluck(35), amp: amp * .6 }));
const birdcall = (f, amp = 1) => mixb(squeak(f, f * 1.35, .07, amp), squeak(f * 1.25, f * 1.05, .06, amp * .7));
const pop = (amp = 1, f = 1) => mixb(click(amp), tone(.07, t => f * (500 + 2600 * t / .07), { e: env.pluck(40), amp: amp * .7 }));
const snore = (amp = 1) => mixb(noise(1.1, { brown: true, lp: t => 300 + 500 * Math.sin(Math.PI * t / 1.1), hp: 60, e: env.hann(), amp }), voice([[0, .9, .5, .1]], HAN, { amp: amp * .4, fall: .3 }));
const forest = (t0, t1, k = 1) => {
  T.at(t0, wind(t1 - t0, t0), .08 * k, 0);
  for (let t = t0 + .3; t < t1 - .3; t += .55 + ((t * 7.13) % 1) * .9) T.at(t, birdcall(2400 + ((t * 13.7) % 1) * 1400, .6), .05 * k, ((t * 3.3) % 2) - 1);
};
const grunt = (amp = 1) => voice([[0, .32, .9, .25]], BHIMA, { amp, fall: .2 });

// ---- beds
forest(0, TL.lotus + .2);
forest(TL.charge, TL.bow + .2, .9);
forest(TL.bow, TL.giant + .2, .7);
forest(TL.hug, TL.flag + .2, .8);
forest(TL.ask, TL.card + .2, .8);

// ---- 1. hook: a tail-tip swish
T.at(.2, whoosh(.5, 300, 1500), .1, .2);
T.at(.15, plink(note(81), .6), .12, .2);

// ---- 2. the lotus
T.at(TL.lotus - .2, whoosh(.9, 400, 2600), .16, .3);
T.at(TL.lotus, wind(3.6, 2), .12, 0);
T.at(TL.lotus + .2, shimmer(3, [84, 88, 91, 96, 100, 103].map(note), .8, .18), .16, .3);
T.at(TL.lotus + 1.6, chime(note(96), .7, 2), .1, -.2);

// ---- 3. the charge: heavy steps getting closer, the trees, the roar, the birds
for (let t = TL.charge + .1; t < TL.monkey; t += 1 / 3) { const k = (t - TL.charge) / (TL.monkey - TL.charge); T.at(t, step(1), .18 + .35 * k * k, 0); }
FALLS.forEach(([t0, pan]) => { T.at(t0, crunch(1), .35, pan); T.at(t0 + .05, mixb(noise(.6, { lp: 2400, hp: 300, e: env.ad(.02, .3), amp: .8 })), .3, pan); T.at(t0 + .5, whoosh(.3, 200, 900), .2, pan); T.at(t0 + .58, thud(1), .5, pan); T.at(t0 + .6, noise(.5, { brown: true, lp: 500, e: env.ad(.01, .25), amp: 1 }), .25, pan); });
T.at(TL.roar, roar(1.4, 110, 6, 1), .45, 0);
T.at(TL.roar + .1, rumble(1.2, .8), .25, 0);
for (let k = 0; k < 6; k++) T.at(TL.roar + .15 + k * .12, wingbeat(.6, .6), .14, (k % 2 ? 1 : -1) * .6);
for (let k = 0; k < 8; k++) T.at(TL.roar + .2 + k * .1, birdcall(2800 + k * 180, .8), .1, (k % 3 - 1) * .7);

// ---- 4. the monkey: he walks in; a snore; the roar wakes the birds
for (let t = TL.monkey + .05; t < ENTER; t += 1 / 3) T.at(t, step(.8), .3, -.6 + (t - TL.monkey) / 2);
T.at(TL.monkey + .2, snore(1), .2, .4);
T.at(ROAR2, roar(1.0, 120, 6, .9), .35, -.3);
for (let k = 0; k < 4; k++) T.at(ROAR2 + .1 + k * .14, wingbeat(.5, .6), .1, .3);
T.at(TL.wake - 1.0, snore(.8), .12, .4);

// ---- the conversation: cartoon voices under each line
const lines = [
  [TL.wake + .8, TL.getup - .4, HAN, .45, .16], [TL.getup + .1, TL.jump - .4, BHIMA * 1.1, .95, .12], [TL.jump + .2, TL.god - .4, HAN, .4, .16],
  [TL.god + .2, TL.leap - .4, BHIMA, .55, .15], [TL.leap + .2, TL.who - .4, BHIMA * 1.05, .75, .13], [TL.who + .5, TL.bro - .5, HAN * 1.05, .5, .17],
  [TL.bro + .2, TL.tail - .4, BHIMA * 1.1, .8, .13], [TL.tail + .2, TL.one - .5, HAN * .95, .4, .17], [TL.bow + .3, TL.iam - .5, BHIMA * 1.08, .45, .15],
  [TL.iam + .5, TL.elder - .6, HAN * .92, .55, .2], [TL.elder + .2, TL.vayu - .4, BHIMA * 1.25, .9, .12], [TL.show + .2, TL.giant - .4, BHIMA * 1.15, .8, .13],
];
lines.forEach(([a, b, f, br, gap], i) => T.at(a, chatter(b - a, f, gap, br), f > 150 ? .16 : .2, f > 150 ? .25 : -.25));
T.at(TL.wake + .3, voice([[0, .5, .8, .2], [.5, .3, .7, .1]], HAN, { fall: .3 }), .14, .25);   // "mmh…?"
T.at(TL.getup, thud(.8), .25, 0);                                                                  // he stamps
T.at(TL.god + .15, chime(note(84), .6, 1.6), .08, 0);                                              // hand on heart
T.at(TL.who + .1, slide(.3, 700, 1100, .7), .12, .2);                                              // the eyebrow
T.at(TL.bro + .15, mixb(click(.8), plink(note(76))), .2, -.2);                                     // the flex
T.at(TL.bro + .3, shimmer(.6, [88, 95].map(note), .6), .08, -.2);

// ---- the pull
T.at(TL.one + .15, mixb(click(1), noise(.08, { lp: 2000, hp: 300, e: env.pluck(40) })), .3, -.1);   // grab
T.at(TL.one + .9, voice([[0, .25, 1.1, .5], [.3, .35, 1.3, .6]], BHIMA, { rise: .2 }), .14, -.2);   // "hm? hmm!"
T.at(TL.both, mixb(click(1), thud(.5)), .35, -.1);
for (let k = 0; k < 11; k++) T.at(TL.both + .3 + k * .42, grunt(.9 + (k % 3) * .1), .2, -.2);
T.at(TL.both + .2, tone(TL.bow - TL.both - .3, t => 90 + 6 * Math.sin(t * 7), { type: 'saw', e: env.swell(.4, .3), amp: .2 }), .14, 0);   // the creak of the strain
for (let k = 0; k < 6; k++) T.at(TL.budge + .2 + k * .4, plink(note(93 + (k % 3) * 2), .5), .12, (k % 2 ? 1 : -1) * .4);   // sweat drops
T.at(TL.budge + .5, voice([[0, 1.1, 1.0, .3]], HAN, { fall: .5, amp: 1 }), .2, .4);   // the yawn
T.at(TL.bow - .2, slide(.6, 300, 120, .8), .18, -.1);                                // the deflate
T.at(TL.bow + .1, mixb(click(.4), noise(.3, { lp: 1200, hp: 200, e: env.hann(), amp: .4 })), .15, -.2);   // he bows

// ---- the reveal
T.at(TL.iam - .1, whoosh(1, 300, 3000), .2, .2);
T.at(TL.iam, shimmer(2.4, [76, 81, 84, 88, 93, 96].map(note), 1, .12), .22, .2);
T.at(TL.iam + .3, chime(note(76), 1, 3), .14, 0);
T.at(TL.elder + .05, shimmer(1.2, [88, 92, 95].map(note), .8), .12, -.2);
T.at(TL.vayu, whoosh(2.8, 200, 1800), .22, 0);
T.at(TL.vayu + .4, wind(2.6, 4), .2, 0);
for (let k = 0; k < 6; k++) T.at(TL.vayu + .3 + k * .45, chirp(.5), .04, (k % 2 ? 1 : -1) * .5);

// ---- the giant
T.at(TL.giant + .3, rumble(4.6, 1), .4, 0);
T.at(TL.giant + .3, slide(3.6, 60, 240, .8), .18, 0);
T.at(TL.giant + .4, whoosh(3.4, 150, 2400), .25, 0);
T.at(TL.grow2 + .8, mixb(drum(48, 1, 1.4), thud(1)), .6, 0);   // the boom as he stops growing
T.at(TL.grow2 + .85, noise(2, { brown: true, lp: 400, e: env.ad(.02, .9), amp: 1 }), .3, 0);
T.at(TL.grow2 + 1, wind(2.5, 6), .2, 0);
T.at(TL.grow2 + .9, voice([[0, .5, 1.6, .7]], BHIMA * 1.2, { rise: .2 }), .14, -.5);   // tiny Bhima: "wooah"

// ---- the hug, the flag, the ask
T.at(TL.hug - .1, whoosh(.6, 3000, 400), .2, 0);
T.at(TL.hug, shimmer(1.6, [91, 88, 84, 81].map(note), .9, .1), .18, 0);
T.at(TL.hug + .5, voice([[0, .7, 1.1, .3]], HAN, { fall: .2 }), .1, .3);
T.at(TL.hug + .55, voice([[0, .7, 1.05, .3]], BHIMA * 1.3, { fall: .2 }), .1, -.3);   // "awww"
T.at(TL.flag - .1, wind(3.8, 8), .25, .2);
T.at(TL.flag + .2, conch(2.6, 311, .8), .2, 0);
for (let t = TL.flag + .1; t < TL.ask; t += .23) T.at(t, noise(.16, { lp: 1800, hp: 300, e: env.hann(), amp: .7 }), .1, .4);   // the banner flapping
T.at(TL.flag + 1.5, roar(1.2, 150, 5, .6), .1, .3);   // a far roar from the flag
T.at(TL.ask + .1, mixb(plink(note(88)), chime(note(100), .6, 1)), .16, 0);

// ---- the card
const C0 = TL.card;
T.at(C0, whoosh(.5, 500, 2500), .2, 0);
[[.2, 1], [.35, 1.2], [.55, 1.1], [.7, .9], [.82, 1], [.94, 1.1], [1.25, 1.3], [1.65, 1.5], [1.95, 1.2]].forEach(([d, f], i) => T.at(C0 + d, pop(.8, f), .2, (i % 3 - 1) * .3));
T.at(C0 + 1.65, chime(note(96), 1, 2), .14, 0);
T.at(C0 + .3, shimmer(3, [84, 88, 91, 96].map(note), .6, .3), .08, 0);

T.write('assets/bhima_sfx.wav');

// ---- the mix: the score mild and low under the SFX (owner: SFX must stand out, so the score sits at 0.16), a fixed loudness for Instagram
const score = (process.argv.find(a => a.startsWith('--score=')) || '--score=assets/bhima_score_a.mp3').split('=')[1];
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'assets/bhima_sfx.wav', '-i', score, '-filter_complex',
  `[1:a]atrim=0:${TL.end},afade=t=out:st=${TL.end - 2.5}:d=2.5,volume=0.16[m];[0:a][m]amix=inputs=2:normalize=0:duration=first,loudnorm=I=-16:TP=-1.5:LRA=11[o]`,
  '-map', '[o]', '-ar', '48000', '-ac', '2', 'assets/bhima_mix.wav']);
console.log('wrote assets/bhima_mix.wav (score: ' + score + ')');
