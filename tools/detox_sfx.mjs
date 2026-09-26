// detox_sfx.mjs: the sound-effects cue list for "Bappa's Post-Visarjan Detox" (src/scenes/detox.js), built with
// tools/sfx.mjs. The times match the scene's constants and STORYBOARD.md. The level sits under music: Instagram's track
// goes on top.
//   node tools/detox_sfx.mjs [--out=assets/detox_sfx.wav]
import { track, rnd, env, tone, noise, bell, mixb, note, whoosh, rumble, plink, squeak, click, thud, crunch, shimmer, wah, drone, slide } from './sfx.mjs';

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const { at, write } = track(31.5);

// the scale's beep: a short square-wave blip, like a kitchen scale that has seen too much
const beep = (f = 1760, dur = .1) => tone(dur, f, { type: 'square', e: env.swell(.004, .02), amp: .35 });
// Mooshak's coach whistle: a bright trilled tone
const tweet = (dur = .28) => mixb(tone(dur, t => 2700 + 180 * Math.sin(t * 190), { e: env.swell(.01, .05), amp: .6 }), noise(dur, { hp: 3000, lp: 9000, e: env.swell(.01, .05), amp: .15 }));
// a strain grunt: a low buzzy swell
const grunt = (dur = .35) => tone(dur, t => 150 + 40 * Math.sin(t * 9), { type: 'saw', e: env.hann(), fm: t => .3 * Math.sin(t * 190), amp: .35 });
// a drum hit: a thud with a snare's snap
const drum = () => mixb(thud(1), noise(.18, { hp: 1200, lp: 7000, e: env.pluck(18), amp: .6 }));
// a record scratch, for the freeze
const scratch = () => mixb(noise(.22, { lp: t => 3000 - 9000 * t, hp: 300, e: env.hann(), amp: .8 }), tone(.22, t => 900 - 2600 * t, { type: 'saw', e: env.hann(), amp: .2 }));

// ---------- A · the weigh-in ----------
for (const b of [.15, .75, 1.35, 1.95, 2.55, 3.15, 3.75, 4.35, 4.95, 5.55]) at(b, beep(), .5, .25);
at(.05, shimmer(1, [84, 88, 91].map(note), .4, .05), .12, .2);            // the heavenly scale hums awake
at(2.4, squeak(900, 1500, .14), .3, -.2);                                  // "!?"
at(2.5, plink(note(86), .7), .15, -.2);                                     // sweat drop
// B · the suck-in
at(4.0, noise(.8, { lp: t => 800 + 2500 * t, hp: 300, e: env.hann(), amp: .9 }), .35, -.1);   // the huge inhale
at(4.05, slide(.7, 300, 900, .5), .2, -.1);
at(4.8, tone(.8, t => 520 + 30 * Math.sin(t * 60), { type: 'tri', e: env.swell(.05, .1), amp: .12 }), .3, -.1);   // held breath, straining
at(5.7, noise(.3, { lp: t => 5000 - 12000 * t, hp: 200, e: env.hann(), amp: 1 }), .45, -.1);   // the gasp
at(5.72, slide(.35, 180, 90, 1), .5, -.1);                                  // BOING: the belly
at(5.74, wah(110, .4, .8), .35, -.1);
for (const b of [5.8, 5.95, 6.1]) at(b, beep(2090, .09), .55, .25);        // the triple beep
at(6.25, slide(.8, 520, 300, .4), .2, -.1);                                  // sad trombone-ish sigh
at(6.9, click(.8), .3, -.1);                                                 // determination
at(7.05, slide(.35, 300, 800, .5), .3, 0);                                   // hop off
at(7.2, whoosh(.35, 600, 3800), .6, .5);                                     // whip pan
// C · gear up
for (let i = 0; i < 6; i++) at(7.62 + i * .12, noise(.06, { hp: 1500, lp: 5000, e: env.hann(), amp: .5 }), .2, (i % 2 ? .3 : -.3));   // cloth tugs
at(8.4, drum(), .8, 0);                                                      // KNOT
at(8.42, whoosh(.25, 1500, 4500, .7), .3, .3);                              // tails snap out
at(8.75, bell(note(100), .5, { k: 7 }), .3, 0);                              // crown glint
at(9.6, tweet(), .45, -.5);                                                  // coach's whistle
at(9.95, tone(.18, t => 240 - 300 * t, { e: env.hann(), amp: .6 }), .35, 0);   // gulp
at(10.5, slide(.3, 300, 700, .5), .25, .1); at(10.9, thud(.6), .35, .1);     // hop to the bar, land
// D · the struggle
for (const e of [11.4, 12.0, 12.6]) {
  at(e - .12, grunt(.5), .5, .1);
  at(e, rumble(.35, .8), .35, .1);
  at(e + .02, tweet(.18), .25, -.6);                                         // Mooshak toots every tug
  at(e + .08, plink(note(92), .5), .12, .4);                                 // sweat flies
}
at(13.2, whoosh(.3, 800, 3000), .5, 0); at(13.22, squeak(1600, 700, .25), .35, 0);   // hands slip
at(13.55, thud(1), .8, -.2); at(13.6, rumble(.4, .7), .35, -.2);           // flat on his back
for (let i = 0; i < 5; i++) at(13.75 + i * .22, bell(note(96 + (i % 3) * 3), .3, { k: 10 }), .12, -.3);   // dizzy stars
for (let i = 0; i < 9; i++) at(14.6 + i * .45, noise(.22, { lp: 1800, hp: 200, e: env.hann(), amp: .5 }), .15, -.4);   // fanning
// E · divine assist
at(16.2, drone(4.6, 65, 1), .35, 0);                                         // om
at(16.3, whoosh(1.1, 300, 1200, .6), .2, -.6);                              // floating in
at(17.5, click(.6), .25, .2); at(17.52, tone(.12, 1300, { e: env.pluck(30), amp: .3 }), .15, .2);   // one eye opens
at(18.4, bell(note(98), 1.6, { k: 1.6 }), .55, .1);                          // TING
at(18.45, shimmer(1.2, [86, 90, 93, 98, 102].map(note), .6, .06), .3, .1);   // lighter than air
at(18.8, squeak(1200, 2000, .16), .35, -.5);                                 // Mooshak: !!
at(19.3, noise(.6, { hp: 2500, lp: 8000, e: env.hann(), amp: .6 }), .3, 0);  // "shhh"
at(19.75, bell(note(103), .35, { k: 9 }), .3, 0);                            // the wink
at(20.1, whoosh(1.0, 400, 1500, .5), .2, .6);                               // floating off
// F · the lift
at(21.0, slide(.45, 250, 700, .5), .3, -.2); at(21.6, thud(.5), .3, 0);     // back on his feet
at(21.95, grunt(.3), .5, 0);
at(22.1, whoosh(.45, 500, 6000, 1.1), .7, 0); at(22.1, slide(.4, 300, 2400, .6), .3, 0);   // it ROCKETS up
at(22.2, squeak(1400, 900, .2), .25, 0);                                     // "!?"
at(22.45, slide(.8, 1500, 700, .3), .15, .2);                                // drifting down like a feather
at(23.2, plink(note(96), 1), .45, .3); at(23.22, bell(note(108), .3, { k: 9 }), .2, .3);   // lands on the pinky
at(23.6, shimmer(.6, [88, 92, 95].map(note), .4, .07), .2, .2);             // proud
at(24.1, slide(.3, 350, 750, .5), .25, .3); at(24.6, thud(.5), .3, .4);     // hop to the mirror
at(24.7, bell(note(100), .8, { k: 3 }), .45, .2); at(24.72, shimmer(.8, [93, 97, 100, 105].map(note), .5, .05), .2, .2);   // FLEX: ding!
at(25.25, bell(note(108), .25, { k: 12 }), .35, .6);                         // the reflection winks
at(25.45, squeak(700, 1100, .12), .3, .3);                                   // "?"
// G · the reward
at(25.9, whoosh(1.2, 300, 1800, .5), .25, .5); at(25.95, slide(1.2, 600, 1400, .3), .12, .5);   // off it floats
at(26.35, click(.6), .25, -.4); at(26.75, click(.6), .25, .4);              // shifty eyes
at(27.2, squeak(500, 900, .25, .7), .35, 0);                                 // the crown lid creaks open
at(27.45, shimmer(.9, [84, 88, 91, 96].map(note), .6, .06), .35, 0);         // treasure!
at(27.8, noise(.12, { hp: 1000, lp: 5000, e: env.hann(), amp: .5 }), .2, 0); // trunk grabs
at(27.95, click(1), .35, 0); at(27.97, tone(.08, 600, { e: env.pluck(40), amp: .5 }), .25, 0);   // lid snaps shut
at(28.3, crunch(1), .6, 0); at(28.7, crunch(.8), .5, 0);                     // CHOMP, chomp
for (let i = 0; i < 3; i++) at(28.45 + i * .2, tone(.08, 180 + rnd() * 40, { e: env.pluck(30), amp: .5 }), .2, 0);   // chewing
at(28.8, shimmer(.8, [79, 83, 86].map(note), .4, .1), .2, 0);                // bliss
// the last beep, the freeze, the loop
for (const b of [29.25, 29.85, 30.45, 31.05]) at(b, beep(), .5, -.6);   // on the opening's beat: the loop's next beep is at .15
at(29.27, scratch(), .45, 0);                                                // freeze
at(29.55, click(.5), .2, -.3);                                                // eyes slide
at(30.1, squeak(900, 1300, .12, .6), .25, 0); at(30.25, squeak(1000, 1400, .1, .5), .2, 0);   // an innocent giggle
at(30.5, whoosh(.55, 600, 4200), .6, -.5);                                   // whip back to the scale

write(args.out || 'assets/detox_sfx.wav');
