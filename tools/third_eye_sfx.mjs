// third_eye_sfx.mjs: the sound-effects cue list for "The Third Eye Alarm Clock" (src/scenes/third_eye.js), built with
// tools/sfx.mjs. The times match the scene's constants and STORYBOARD.md. The level sits under music: Instagram's track
// goes on top.
//   node tools/third_eye_sfx.mjs [--out=assets/third_eye_sfx.wav]
import { track, rnd, env, tone, noise, bell, mixb, note, whoosh, rumble, plink, clang, squeak, click, thud, crackle, shimmer, wah, drone, slide } from './sfx.mjs';

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const { at, write } = track(30);

// a hiss: bright noise, swelling and fading
const hiss = (dur, amp = 1) => noise(dur, { hp: 3500, lp: 11000, e: env.swell(.05, .25), amp });
// a rattle: the damaru's beads, n quick clicks with a woody knock
const rattle = (t0, dur, rate, gain, pan) => { for (let i = 0; i < dur * rate; i++) { const s = t0 + i / rate + rnd() * .012; at(s, click(.9), gain, pan); at(s, tone(.05, 420 + rnd() * 90, { e: env.pluck(60) }), gain * .8, pan); } };
// ghungroo: little bells on Parvati's anklets, one jingle a step
const jingle = (t, gain, pan) => { for (let i = 0; i < 4; i++) at(t + i * .018, bell(note(96 + Math.floor(rnd() * 6)), .35, { k: 9 }), gain, pan); };
// a trunk trumpet: a brassy saw rising then wobbling
const trumpet = dur => tone(dur, t => 330 + 220 * Math.min(1, t * 6) + 30 * Math.sin(t * 40), { type: 'saw', e: env.swell(.03, .15), amp: .5 });

// ---------- A · dawn, the peek ----------
at(.05, drone(3.8, 65, .8), .22, 0);                                        // Kailash hum ("om")
at(.1, bell(note(79), 2.5, { k: 1.2 }), .18, 0);                            // a temple bell as the eye opens
for (let i = 0; i < 6; i++) at(.4 + i * .55, noise(.5, { hp: 3000, lp: 6000, e: env.hann(), amp: .25 }), .12, .4);   // the Ganga trickle
at(1.9, slide(.2, 700, 1100, .5), .3, -.6);                                // spear tip pops up
at(2.25, slide(.2, 500, 800, .5), .3, -.7);                                // Bappa peeks
at(2.6, slide(.2, 800, 1250, .5), .3, -.5);                                // Kartikeya peeks
at(3.1, drone(1.1, 55, 1), .35, 0);                                         // push in: tension
at(3.72, noise(.4, { lp: 900, e: env.hann(), amp: .7 }), .25, 0);           // the ember breathes
at(4.0, whoosh(.35, 600, 3500), .6, -.4);                                   // whip pan
// B · attempt 1: the clang
at(4.25, slide(.3, 400, 900, .5), .35, -.5); at(4.75, thud(.6), .4, -.4);   // hop out, land
at(4.95, whoosh(.2, 900, 2400, .6), .3, -.4);                               // wind-up
for (const s of [5.25, 5.55, 5.85]) { at(s, clang(880 + rnd() * 60), .55, -.4); at(s, clang(1320, .5), .3, -.4); }
at(6.3, tone(.25, 1000, { e: env.pluck(20), amp: .4 }), .15, .2);            // ...nothing. a cricket-ish tick
at(6.6, slide(.25, 300, 700, .6), .3, 0);                                   // Vasuki rises
at(6.9, hiss(.5, 1), .55, .1);                                              // HISSS
at(6.75, squeak(1600, 2400, .12), .3, -.4);                                  // Kartikeya: eep
at(7.5, slide(.5, 700, 300, .5), .2, 0);                                     // back to sleep
// C · attempt 2: the damaru
at(8.1, slide(.45, 350, 1000, .5), .35, -.6); at(8.6, thud(.7), .45, -.2);  // Bappa's hop in
at(8.85, slide(.25, 400, 1200, .6), .35, -.2);                               // the hop up
at(9.08, click(1.2), .45, -.1); at(9.3, thud(.5), .35, -.1);                 // grab, land
rattle(9.6, 1.6, 12, .35, -.1);                                              // rattle-rattle (two shakes a beat, lots of beads)
for (let i = 0; i < 6; i++) at(9.6 + i * .3, tone(.06, 180, { e: env.pluck(40), amp: .8 }), .35, -.1);   // the drumheads
at(11.3, bell(note(88), .8, { k: 3 }), .15, 0);                              // silence... the moon chimes
at(11.9, wah(note(62), .4, .7), .3, 0); at(12.2, wah(note(59), .3, .7), .3, 0);   // dizzy
at(12.45, thud(1), .6, -.1);                                                 // plop
for (const [i, s] of [12.55, 12.67, 12.79].entries()) at(s, squeak(2300 + i * 300, 2900 + i * 300, .06), .15, -.2);   // birdies
at(12.5, squeak(900, 1500, .12, .6), .25, -.4); at(12.62, squeak(1000, 1700, .12, .6), .25, -.4);   // Kartikeya giggles
// D · attempt 3: all out, and the scare
at(13.3, slide(.25, 300, 700, .5), .3, -.1);
for (const s of [13.65, 13.8, 13.95, 14.1, 14.25]) at(s, clang(900 + rnd() * 80), .45, -.4);
rattle(13.55, .85, 16, .3, -.1);
at(13.6, trumpet(.8), .35, 0);
at(14.45, drone(2.2, 44, 1), .6, 0); at(14.45, rumble(1.9, 1), .4, 0);       // the third eye stirs
at(14.5, tone(1.6, t => 90 + 40 * Math.sin(t * 22), { type: 'saw', e: env.swell(.3, .6), amp: .3 }), .3, 0);
at(14.5, crackle(1.4, .6), .25, 0);                                          // embers
at(14.5, squeak(1700, 900, .2), .3, -.4); at(15.25, squeak(1300, 1900, .12), .3, -.3);   // gulp; eep
at(15.35, clang(700, .6), .3, -.2); at(15.6, thud(.4), .3, -.2);              // the damaru falls, bumps
at(16.1, slide(.8, 300, 120, .4), .25, 0);                                   // it settles
at(16.6, noise(.6, { lp: 1500, hp: 200, e: env.hann(), amp: .6 }), .35, -.3); // phew
// E · Parvati and the chai
for (const s of [17.0, 17.35, 17.65, 17.95, 18.25]) jingle(s, .25, .6);    // anklets
at(17.2, shimmer(.8, [72, 76, 79, 84].map(note), .6, .1), .2, .5);          // Maa's theme
at(18.45, bell(note(96), .4, { k: 8 }), .35, .5); at(18.5, slide(.12, 1400, 1900, .4), .2, .5);   // the wink: ting!
at(18.9, whoosh(.4, 400, 1200, .5), .2, .3);
at(19.6, noise(1.8, { lp: 2500, hp: 800, e: env.swell(.4, .6), amp: .35 }), .25, .2);   // the steam curls
at(19.9, shimmer(1, [79, 83, 86, 91].map(note), .4, .14), .2, .1);          // the aroma
for (const s of [19.95, 20.3, 20.65]) at(s, noise(.16, { lp: 3000, hp: 900, e: env.hann(), amp: .9 }), .5, 0);   // sniff sniff sniff
at(20.9, slide(.7, 300, 900, .5), .25, 0);                                   // he floats after it
// F · POP
at(21.6, mixb(tone(.12, t => 900 * Math.exp(-t * 20) + 200, { e: env.pluck(20) }), noise(.1, { lp: 6000, e: env.pluck(40) })), .8, 0);   // POP
at(21.6, bell(note(84), 2.5, { k: 1.6 }), .35, 0); at(21.62, bell(note(91), 2.5, { k: 1.6 }), .3, 0);   // the sunrise
at(21.65, shimmer(1.6, [60, 64, 67, 72, 76, 79, 84].map(note), .6, .08), .35, 0);
at(21.7, slide(.4, 500, 1600, .6), .25, 0);                                  // Ganga spurts
at(22.45, click(.6), .25, .2);                                                // takes the cup
at(22.9, noise(.9, { lp: t => 1400 + 1200 * Math.sin(Math.PI * t / .9), hp: 300, e: env.swell(.05, .3), amp: .8 }), .45, 0);   // slurrrp
at(23.4, tone(.9, t => 330 - 60 * t, { type: 'tri', e: env.swell(.1, .5), amp: .5 }), .3, 0);   // aaah
at(23.5, shimmer(.8, [84, 88, 91].map(note), .5, .12), .3, 0);              // hearts
// G · the hug
at(24.9, click(.6), .2, .3);                                                  // cup back to Maa
at(25.2, whoosh(.4, 300, 1200, .7), .35, 0);                                  // arms wide
at(25.7, slide(.45, 400, 1300, .6), .35, -.2); at(25.72, slide(.45, 500, 1500, .6), .3, .2);   // wheee
at(26.15, thud(.5), .35, 0); at(26.2, noise(.25, { lp: 900, e: env.pluck(12), amp: .7 }), .4, 0);   // SQUEEZE
at(26.2, shimmer(2, [72, 76, 79, 84, 88].map(note), .6, .15), .3, 0);       // the warm chord
for (const s of [26.5, 26.9, 27.3]) at(s, squeak(1100 + rnd() * 400, 1600 + rnd() * 400, .1, .5), .18, rnd() - .5);   // giggles
at(27.7, noise(.6, { lp: 2000, hp: 400, e: env.swell(.05, .3), amp: .5 }), .3, .5);   // Maa's sip
at(28.35, bell(note(96), .6, { k: 5 }), .3, .5);                             // her wink
at(28.2, drone(1.8, 65, .6), .2, 0);
at(29.3, slide(.6, 800, 200, .5), .2, 0);   // the eye shuts

write(args.out || 'assets/third_eye_sfx.wav');
