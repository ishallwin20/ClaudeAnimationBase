// modak_sfx.mjs: the sound-effects cue list for "2 AM Modak Run" (src/scenes/modak_2am.js), built with tools/sfx.mjs.
// The times match the scene's constants and STORYBOARD.md. The level sits under music: Instagram's track goes on top.
//   node tools/modak_sfx.mjs [--out=assets/modak_sfx.wav]
import { track, rnd, env, tone, noise, bell, mixb, note, whoosh, gurgle, rumble, plink, clang, squeak, click, thud, crackle, crunch, crinkle, shimmer, wah, burp, drone, slide } from './sfx.mjs';

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const { at, write } = track(35);

// ---------- the cue list (times match the storyboard / scene) ----------
// A · study
at(.05, bell(note(84), 2.5, { k: 1.4 }), .12, -.2);                       // a soft chime as the iris opens
at(2.42, slide(.22, 300, 520, .5), .5, .1);                                // jolted awake: a little boing
at(3.35, gurgle(.6, .8), .55, 0);                                          // the first gurgle
// B · rumble
at(4.0, rumble(1.35, 1), .32, 0);
at(5.2, rumble(.95, .7), .28, 0);
at(5.2, crinkle(.5, .5), .35, .4);                                         // leaves jumping
at(5.45, squeak(1700, 2600, .14), .35, -.6);                               // Mooshak wakes
at(5.72, clang(620), .45, .5); at(5.95, clang(700), .2, .5);              // the lota hits the floor, bounces
at(6.75, plink(note(79)), .35, 0); at(6.87, plink(note(75)), .3, 0);      // mischief
at(7.12, whoosh(.4, 600, 3500), .6, .3);                                  // whip pan
// C · tiptoe
for (const [i, s] of [8.15, 8.75, 9.35].entries()) { at(s, plink(note([72, 76, 74][i])), .6, -.1); at(s + .28, plink(note([84, 88, 86][i]), .6), .4, -.4); }
at(9.2, noise(.12, { lp: 3000, hp: 900, e: env.hann(), amp: .9 }), .45, .2); at(9.36, noise(.16, { lp: 3000, hp: 900, e: env.hann() }), .45, .2);   // sniff sniff
at(9.5, shimmer(.8, [72, 76, 79, 83, 86].map(note), .7, .12), .35, 0);    // floating on the smell
at(10.55, bell(note(88), .6, { k: 6 }), .45, 0);                          // "!"
// D · padlock
for (const s of [11.65, 11.95, 12.25]) { at(s, clang(1300 + rnd() * 200, .6), .25, .3); at(s + .05, clang(1700, .4), .18, .3); }
at(12.45, drone(1.1, 98, .9), .5, .2); at(12.45, shimmer(.5, [note(90), note(95)], .4, .08), .25, .3);   // the eye opens
at(13.0, crackle(.5, 1), .55, .1); at(13.0, tone(.45, t => 800 * Math.exp(-t * 4) + 60, { type: 'saw', e: env.pluck(6), amp: .5 }), .45, 0);   // ZAP
at(13.42, thud(1), .7, -.2);
for (const [i, s] of [13.5, 13.62, 13.74].entries()) at(s, squeak(2400 + i * 300, 3000 + i * 300, .06), .15, -.3);   // birdie stars
at(13.85, wah(note(55), .45, .8), .35, 0); at(14.3, wah(note(53), .7, .8), .35, 0);   // wah-wah
for (const s of [14.45, 14.76, 15.07]) at(s, noise(.05, { lp: 1200, e: env.pluck(60) }), .25, -.3);   // pats
at(15.35, bell(note(96), 1.2, { k: 3 }), .45, 0); at(15.4, bell(note(91), 1.2, { k: 3 }), .3, 0);   // idea!
at(15.55, shimmer(.4, [note(84), note(88), note(91)], .6, .05), .3, .2);  // the phone comes out
at(15.85, whoosh(.35, 800, 6000, .7), .35, 0);
// E · order
at(16.3, shimmer(.5, [72, 76, 79, 84].map(note), 1, .09), .45, 0);       // the app's jingle
at(17.25, click(1), .4, 0);
{ const taps = Array.from({ length: 20 }, (_, k) => 17.62 + .9 * Math.pow(k / 19, .62)); taps.forEach((s, k) => { at(s, click(.8), .5, .1); at(s, tone(.05, 700 * Math.pow(1.045, k), { e: env.pluck(60) }), .4, .1); }); }
at(18.52, shimmer(.6, [79, 83, 86, 91].map(note), 1, .05), .5, 0);       // 21!
at(19.2, tone(.3, t => 500 + 80 * Math.sin(t * 40), { e: env.hann(), amp: .4 }), .15, .1);   // the hover
at(19.45, click(1.2), .5, 0); at(19.5, crackle(.3, .7), .45, 0); at(19.5, slide(.3, 400, 2400, .6), .4, 0);   // ORDER: the bolt goes up
// F · meteor run
at(19.8, whoosh(.7, 300, 5000, 1), .6, -.5);                              // Vayu blasts in
at(20.2, whoosh(1.2, 200, 1800, 1.2), .6, .6);                            // the big meteor passes
at(20.68, slide(.45, 500, 1400, .7), .3, 0); at(20.9, slide(.25, 1400, 700, .6), .25, 0);   // wheee (the loop)
at(21.3, whoosh(.7, 300, 2500, 1), .55, .5);                              // the duck
at(21.55, squeak(900, 600, .15, .7), .3, 0);
for (let i = 0; i < 5; i++) at(19.9 + i * .7 + rnd() * .3, whoosh(.4, 900, 3000, .5), .2, rnd() * 2 - 1);
at(22.1, drone(1.3, 65, .8), .25, 0);                                      // the mountain rises
at(22.85, slide(.6, 1600, 300, .8), .35, .2);                             // the dive
at(23.46, noise(.3, { lp: 5000, hp: 200, e: env.pluck(10) }), .45, 0);    // poof, into the window
// G · delivery
at(23.6, noise(1.2, { lp: t => 900 + 1800 * Math.sin(Math.PI * t / 1.2), hp: 150, e: env.ad(.08, .5), amp: 1.2 }), .75, -.3);   // the gust
at(23.65, crinkle(.7, .8), .35, .3);                                      // curtains and paper
at(24.1, squeak(2000, 1500, .1), .3, .7);                                 // Mooshak, flattened
at(24.55, bell(note(100), .5, { k: 7 }), .35, -.2);                       // shades up: a glint
at(25.35, shimmer(.5, [84, 88, 91, 96].map(note), .7, .05), .3, .1);     // starstruck
at(25.9, crinkle(.35, 1), .5, 0);                                         // the handoff
at(26.4, crinkle(.4, .9), .45, 0); at(26.45, drone(1, note(60), .5), .3, 0); at(26.5, shimmer(.8, [60, 64, 67, 72].map(note), .5, .12), .3, 0);   // the bag opens: aah
at(27.2, crinkle(.25, .6), .3, 0);
at(27.98, crunch(1), .7, 0); at(28.2, crunch(1), .7, 0);                  // chomp, chomp
at(28.33, tone(.25, t => 300 * Math.exp(-t * 7) + 90, { e: env.pluck(10) }), .5, 0);   // gulp
at(28.3, shimmer(.6, [79, 84, 88].map(note), .5, .08), .3, 0);           // hearts
at(28.4, whoosh(.35, 500, 3000, .7), .35, 0);                             // the phone rises
[28.86, 28.98, 29.1, 29.22, 29.34].forEach((s, i) => { at(s, click(.6), .25, 0); at(s, bell(note([84, 86, 88, 91, 93][i]), .9, { k: 4 }), .4, (i - 2) * .2); });   // five stars
at(29.4, shimmer(1, [84, 88, 91, 96, 100].map(note), .6, .05), .35, 0);
at(29.72, whoosh(.3, 2500, 500, .6), .3, 0);
at(29.95, bell(note(96), .4, { k: 9 }), .3, -.3);                         // salute
at(30.3, whoosh(.6, 400, 6000, 1.2), .6, -.4);                            // gone
at(30.45, noise(1.1, { lp: t => 600 + 2200 * Math.sin(Math.PI * t / 1.1), hp: 120, e: env.hann(), amp: 1.1 }), .6, 0);   // the wind wipe
// I · after, and the lock
at(31.95, burp(1), .3, 0);
at(32.3, squeak(1100, 1500, .1, .5), .2, 0); at(32.42, squeak(1200, 1700, .1, .5), .2, 0);   // a tiny giggle
at(32.45, whoosh(.35, 600, 3500), .55, .3);
at(33.05, drone(1.9, 55, 1), .35, 0); at(33.05, tone(.55, t => 70 + 30 * Math.sin(t * 25), { type: 'saw', e: env.hann(), amp: .25 }), .35, 0);   // the eye creaks open
at(33.65, noise(.12, { lp: 4000, hp: 1500, e: env.hann() }), .25, -.4);  // the glance
at(33.95, mixb(tone(.9, t => 55 * Math.exp(-t * 2) + 35, { e: env.pluck(4) }), bell(note(62), 1.2, { k: 2.5 })), .4, 0);   // dun.
at(34.25, slide(.6, 700, 180, .5), .2, 0);

write(args.out || 'assets/modak_sfx.wav');
