// shiva_cine_sfx.mjs: the sound bed for the cinematic Shiva style test (src/scenes/shiva_cine.js). Wind on Kailash,
// two thunderclaps on the lightning, a damru roll for "Tandava", a low boom as his eyes open, the third eye's fire
// rising into the white-out, then a temple bell and the damru's rhythm at dawn. Music goes on top in Instagram.
//   node tools/shiva_cine_sfx.mjs   → assets/shiva_cine_sfx.wav
import { track, tone, noise, bell, mixb, whoosh, crackle, env, note, seed, rnd, lerp } from './sfx.mjs';

const DUR = 15.2, STRIKE1 = 2.75, STRIKE2 = 6.35, TANDAVA = 4.15, EYES = 8.85, THIRD = 9.5, WHITE = 10.45, DAWN = 10.7;
const T = track(DUR);
seed(7);

// thunder: a crack, then a long low roll of brown noise that swells and dies away
const thunder = (dur, near = 1) => mixb(
  crackle(.5 * near, .7 * near),
  noise(.25, { hp: 300, lp: 4000, e: env.pluck(14), amp: .8 * near }),
  noise(dur, { brown: true, lp: 260, e: (t) => Math.min(1, t * 6) * Math.exp(-t * 1.1) * (.75 + .25 * Math.sin(t * 9)), amp: 1.4 }));
// one damru stroke: the bead strikes a small tight skin (a pitched knock plus a rattle of noise)
const damru = (f, amp = 1) => mixb(tone(.16, t => f * (1 + .5 * Math.exp(-t * 60)), { e: env.pluck(26), amp }), noise(.06, { hp: 1200, lp: 6000, e: env.pluck(60), amp: amp * .35 }));
const roll = (t0, dur, rate, f, amp) => { for (let i = 0; i < dur * rate; i++) T.at(t0 + i / rate + (rnd() - .5) * .008, damru(f * (i % 2 ? 1.12 : 1), amp * (.7 + .3 * Math.sin(i * .9))), 1, (i % 2 ? .25 : -.25)); };

// wind across the whole night (shots 1-3): two bands of noise whose filters drift, in stereo
const wind = (dur, ph) => noise(dur, { lp: t => 600 + 400 * Math.sin(t * .7 + ph) + 250 * Math.sin(t * 1.9 + ph), hp: 120, e: env.swell(1.2, 1.2), amp: 1 });
T.at(0, wind(WHITE + .2, 0), .22, -.5); T.at(0, wind(WHITE + .2, 2), .22, .5);
// a low drone that grows toward the third eye
T.at(0, tone(WHITE, t => note(33) + .6 * Math.sin(t * 2), { e: (t, D) => Math.min(1, t / 2) * lerp(.4, 1, t / D) * Math.min(1, (D - t) / .3), amp: 1 }), .3);
T.at(0, tone(WHITE, t => note(40) + .5 * Math.sin(t * 1.4), { type: 'tri', e: (t, D) => Math.min(1, t / 3) * lerp(.2, 1, t / D) * Math.min(1, (D - t) / .3), amp: 1 }), .1);

T.at(STRIKE1, thunder(2.6, .5), .5, -.4);       // far, behind Kailash
T.at(STRIKE2, thunder(3.2, 1), .75, .4);        // close, behind him
roll(TANDAVA - .05, 1.3, 14, 230, .32);         // "Shiva's Tandava"
T.at(EYES, mixb(tone(1.6, t => 55 * Math.exp(-t * .8) + 30, { e: env.ad(.01, .5), amp: 1 }), whoosh(.5, 900, 120, .5)), .7);   // the eyes open
T.at(THIRD - .2, whoosh(1.2, 200, 3000, 1), .4);                                                                            // the third eye opens
T.at(THIRD, noise(WHITE - THIRD + .3, { hp: 600, lp: t => 2000 + 4000 * t, e: env.swell(.6, .1), amp: 1 }), .3);           // its fire
T.at(THIRD, crackle(WHITE - THIRD + .3, 1), .25);
T.at(WHITE - .25, whoosh(.5, 300, 6000, 1), .6);                                                                            // the white-out
// dawn: a temple bell, a low gong, the damru's dance rhythm, the fire ring crackling
T.at(DAWN, bell(note(69), 4, { partials: [[1, 1], [2.4, .5], [3.9, .3], [5.2, .2], [6.8, .1]], k: .7 }), .45);
T.at(DAWN, bell(note(38), 4.5, { partials: [[1, 1], [2.1, .5], [3.3, .25]], k: .5 }), .5);
for (let b = 0; b < 8; b++) { const t0 = DAWN + 1.1 + b * .5; T.at(t0, damru(240, .5), 1, -.2); T.at(t0 + .125, damru(270, .3), 1, .2); if (b % 2) T.at(t0 + .25, damru(240, .38), 1, -.2); }
T.at(DAWN, crackle(DUR - DAWN, 1), .12);
T.write('assets/shiva_cine_sfx.wav');
