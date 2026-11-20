// kvr2_sfx.mjs: the sound of "Kanha vs Radha" #2, The universe in his mouth (src/scenes/kvr_universe.js), 16.6 s. No
// voice: each kid "talks" in a babble of pitched blips (Kanha mid, Radha higher, tiny Radha very high). His wind-up, the
// "Aaaa!", the universe bursting out (a whoosh, a soft boom, a magic shimmer), a quiet space pad with twinkles while it is
// out, a shooting star, the clod's bloop, the suck back in, the gulp, both kids dropping to the ground, her giggles, hearts.
//   node tools/kvr2_sfx.mjs → assets/kvr2_sfx.wav
import { track, seed, rnd, note, tone, env, mixb, plink, squeak, thud, slide, shimmer, chime, whoosh, click, drone, drum } from './sfx.mjs';
seed(11);
const T = track(16.6);
const babble = (t0, t1, base, pan, { gap = .085, spread = 5, type = 'tri', amp = .26, q = false, fall = 0 } = {}) => {
  for (let t = t0; t < t1 - .04; t += gap * (.85 + rnd() * .35)) {
    const last = t + gap * 1.3 >= t1, m = base + Math.round((rnd() - .5) * spread) + (q && last ? 5 : 0) - fall * (t - t0) / (t1 - t0), d = .055 + rnd() * .03, f = note(m);
    T.at(t, mixb(tone(d, x => f * (1 + .06 * x / d), { type, e: env.hann(), amp: 1 }), tone(d, 2 * f, { e: env.hann(), amp: .18 })), amp, pan);
  }
};
const pop = (t, m = 84, pan = 0, g = .32) => { T.at(t, plink(note(m)), g, pan); T.at(t, click(.6), .12, pan); };
const boing = (t, pan, f0 = 260, f1 = 720, g = .2) => T.at(t, slide(.22, f0, f1), g, pan);
const KP = -.35, RP = .35;

// 0–3.3 "I did NOT eat mud.": he insists, nose up ("hmph!")
babble(0, 1.5, 72, KP);
T.at(1.82, slide(.2, note(76), note(67)), .14, KP); boing(1.9, KP, 300, 560, .14); T.at(2.15, thud(.4), .2, KP);
// 3.4 "Open."
pop(3.4, 88, RP); babble(3.42, 3.9, 80, RP, { gap: .1 });
T.at(3.6, squeak(500, 900, .12), .12, KP);
// 4.25 the wind-up, 4.7 "Aaaa!", 4.85 the universe bursts out
T.at(4.22, slide(.45, note(60), note(74)), .12, KP);
T.at(4.7, tone(.55, x => note(74) * (1 + .02 * Math.sin(x * 38)), { type: 'tri', e: env.swell(.03, .2), amp: 1 }), .2, KP);
T.at(4.8, whoosh(1.0, 300, 6500), .3, -.1);
T.at(4.86, drum(52, 1, .9), .3, 0);
T.at(4.86, shimmer(1.6, [72, 76, 79, 84, 88, 91, 96].map(note), 1, .05), .2, 0);
T.at(4.95, squeak(700, 1700, .14), .18, RP); pop(4.96, 98, RP, .16);   // her gasp
// 5.0–10.45 the space pad: a soft drone, glints here and there
T.at(5.0, drone(5.45, note(43), 1), .07, 0);
T.at(5.0, drone(5.45, note(55), 1), .04, 0);
for (let t = 5.4; t < 10.2; t += .45 + rnd() * .4) T.at(t, chime(note([88, 91, 95, 98, 100, 103][Math.floor(rnd() * 6)]), .5, 1.4), .035, (rnd() - .5) * 1.4);
// 5.7 her awe; 6.15 "Wow…"
T.at(5.7, shimmer(.8, [91, 95, 98, 103].map(note), .8, .06), .1, RP);
pop(6.15, 86, RP, .22); babble(6.17, 6.75, 81, RP, { gap: .16, spread: 2, fall: 4 });
// 6.5 a shooting star; 6.85 the earth floats in; 7.8 tiny Radha: "hi hi!"; 8.2 Radha waves back
T.at(6.5, whoosh(.6, 2500, 7000), .07, .6); T.at(6.95, chime(note(100), .8, 1.2), .07, 0);
T.at(6.85, whoosh(.9, 400, 1600), .07, .7); T.at(7.6, plink(note(91)), .12, .3);
babble(7.8, 8.25, 96, .25, { gap: .07, amp: .16 }); babble(8.4, 8.8, 98, .25, { gap: .07, amp: .14 });
pop(8.2, 86, RP, .14); babble(8.22, 8.5, 84, RP, { gap: .12, amp: .15 });
// 8.0 Kanha peeks; his brow wiggles
T.at(8.0, click(.6), .1, KP); T.at(8.0, squeak(800, 1100, .08), .08, KP);
for (const t of [8.6, 8.8, 9.0, 9.2]) T.at(t, squeak(t * 10 % 4 < 2 ? 900 : 1200, t * 10 % 4 < 2 ? 1200 : 900, .07), .08, KP);
// 9.2 the clod drifts in and stops with a bloop
T.at(9.2, whoosh(.75, 200, 900), .1, -.6); T.at(9.92, squeak(380, 160, .16), .2, -.1); T.at(9.95, plink(note(55)), .12, -.1);
// 9.55 "…is that MUD?"; 9.95 his "!"
pop(9.55, 86, RP); babble(9.6, 10.35, 79, RP, { q: true, gap: .1 });
T.at(9.95, squeak(600, 1500, .14), .2, KP); pop(9.97, 96, KP, .16);
// 10.25 the swell, 10.45 the suck, 10.62 the GULP, 10.82 they drop
T.at(10.2, whoosh(.3, 800, 2000), .08, KP);
T.at(10.42, whoosh(.4, 7000, 300), .3, KP); T.at(10.42, slide(.32, note(96), note(48)), .14, KP);
T.at(10.62, squeak(420, 170, .14), .26, KP); T.at(10.74, click(.9), .14, KP); boing(10.64, KP, 700, 260, .12);
T.at(10.82, thud(.55), .28, KP); T.at(10.83, thud(.45), .24, RP);
T.at(11.15, squeak(380, 220, .1), .14, KP);   // swallowed
// 11.7 "That's a planet.": puppy eyes, twinkles
pop(11.7, 84, KP); babble(11.72, 12.9, 74, KP, { q: true });
T.at(11.8, shimmer(1.2, [84, 88, 91, 96, 100].map(note), .9, .07), .16, KP);
for (const [t, m] of [[12.4, 100], [12.9, 103], [13.4, 98]]) T.at(t, chime(note(m), .5, 1.2), .06, KP + (rnd() - .5) * .4);
// 13.4 she tries not to laugh, 13.75 she cracks up; he giggles too
babble(13.42, 13.7, 82, RP, { gap: .07, type: 'square', amp: .08, spread: 2 });
for (let i = 0; i < 4; i++) { const t0 = 13.78 + i * .34; [93, 91, 89].forEach((m, j) => T.at(t0 + j * .085, tone(.07, note(m - i), { type: 'tri', e: env.hann(), amp: 1 }), .2, RP)); }
for (let i = 0; i < 2; i++) { const t0 = 14.12 + i * .3; [78, 76].forEach((m, j) => T.at(t0 + j * .1, tone(.08, note(m), { type: 'tri', e: env.hann(), amp: 1 }), .16, KP)); }
// 15.2 hearts
[15.2, 15.45, 15.75, 16.05].forEach((t, i) => { T.at(t, plink(note([84, 88, 91, 96][i])), .2, RP + (i % 2 ? .2 : -.2)); T.at(t, chime(note([96, 100, 103, 108][i]), .4, .8), .05, RP); });
T.at(15.25, slide(.5, note(79), note(86)), .08, RP);
T.write('assets/kvr2_sfx.wav');
