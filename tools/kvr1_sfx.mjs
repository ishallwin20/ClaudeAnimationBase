// kvr1_sfx.mjs: the sound of "Kanha vs Radha" #1, The butter thief (src/scenes/kvr_butter.js), 15.6 s. No voice: each
// kid "talks" in a babble of little pitched blips while the line is up (Kanha mid, Radha higher, the monkey a fast high
// chitter); boings for the hops, a sweat-drop bloop, twinkles round his puppy eyes, a gulp, and heart pops as she melts.
//   node tools/kvr1_sfx.mjs → assets/kvr1_sfx.wav
import { track, seed, rnd, note, tone, env, mixb, plink, squeak, thud, slide, shimmer, chime, whoosh, click } from './sfx.mjs';
seed(7);
const T = track(15.6);
// a babble: blips round a note, a syllable every ~85 ms, rising at the end like a question when q
const babble = (t0, t1, base, pan, { gap = .085, spread = 5, type = 'tri', amp = .26, q = false } = {}) => {
  for (let t = t0; t < t1 - .04; t += gap * (.85 + rnd() * .35)) {
    const last = t + gap * 1.3 >= t1, m = base + Math.round((rnd() - .5) * spread) + (q && last ? 5 : 0), d = .055 + rnd() * .03, f = note(m);
    T.at(t, mixb(tone(d, x => f * (1 + .06 * x / d), { type, e: env.hann(), amp: 1 }), tone(d, 2 * f, { e: env.hann(), amp: .18 })), amp, pan);
  }
};
const pop = (t, m = 84, pan = 0, g = .32) => { T.at(t, plink(note(m)), g, pan); T.at(t, click(.6), .12, pan); };
const boing = (t, pan, f0 = 260, f1 = 720) => T.at(t, slide(.22, f0, f1), .2, pan);
const KP = -.35, RP = .35, MP = .1;

// 0–3.2 "Nobody can catch the butter thief!": he brags, hops
babble(0, 1.5, 72, KP);
boing(1.85, KP); T.at(2.2, thud(.5), .25, KP); T.at(2.2, whoosh(.25, 500, 1800), .06, KP);
// 3.3–6.5 "Kanha… your face.": she points; he freezes, sweats
pop(3.3, 88, RP); babble(3.32, 4.7, 79, RP, { q: false });
pop(4.05, 91, RP, .24);
T.at(3.5, squeak(500, 900, .12), .12, KP);
T.at(4.4, squeak(600, 1500, .14), .2, KP); pop(4.4, 96, KP, .2);
T.at(4.5, squeak(1400, 500, .12), .16, KP);           // the sweat drop: a bloop
// 6.6–9.5 "The MONKEYS ate it!": puppy eyes, twinkles
pop(6.6, 84, KP); babble(6.62, 7.9, 74, KP, { q: true });
T.at(6.7, shimmer(1.2, [84, 88, 91, 96, 100].map(note), .9, .07), .18, KP);
for (const [t, m] of [[7.6, 100], [8.2, 103], [8.8, 98], [9.3, 105]]) T.at(t, chime(note(m), .5, 1.2), .07, KP + (rnd() - .5) * .4);
// 9.3–10.1 the monkey hops in; "Not me."
boing(9.3, .9, 300, 820); T.at(9.7, thud(.4), .2, .55); boing(9.72, .5, 280, 760); T.at(10.1, thud(.45), .24, MP);
T.at(10.15, squeak(500, 1600, .16), .2, KP); pop(10.17, 98, KP, .18);
pop(10.4, 86, MP); babble(10.45, 11.3, 88, MP, { gap: .065, spread: 7, type: 'square', amp: .14 });
for (const t of [10.5, 10.8, 11.1]) T.at(t, whoosh(.14, 900, 2600), .05, MP);
T.at(11.0, squeak(420, 170, .14), .2, KP); T.at(11.12, click(.8), .1, KP);   // the gulp
// 12.4–15.6 "…want some?": she melts, hearts pop
pop(12.4, 84, KP); babble(12.42, 13.3, 76, KP, { q: true });
T.at(13.3, slide(.5, note(79), note(86)), .1, RP);
[13.45, 13.75, 14.05, 14.4].forEach((t, i) => { T.at(t, plink(note([84, 88, 91, 96][i])), .22, RP + (i % 2 ? .2 : -.2)); T.at(t, chime(note([96, 100, 103, 108][i]), .4, .8), .05, RP); });
T.at(13.5, squeak(1200, 2000, .1), .08, MP);
T.at(15.0, shimmer(1, [96, 100, 103, 108].map(note), .8, .06), .1, 0);
T.write('assets/kvr1_sfx.wav');
