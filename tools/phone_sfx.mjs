// phone_sfx.mjs: the sound effects for "Be Like A Tortoise" (times from src/scenes/phone_tl.js, loaded with vm).
//   node tools/phone_sfx.mjs   → assets/phone_sfx.wav   (the score goes on top in the mix: see STORYBOARD.md, Sound)
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { track, whoosh, thud, plink, squeak, click, crunch, chime, slide, wind, laughter, note, tone, env, mixb, buzz, crinkle, shimmer, noise, chirp, bell } from './sfx.mjs';

const TL = runInNewContext(readFileSync('src/scenes/phone_tl.js', 'utf8') + '\n;TL');
const END = 37.5;
const T = track(END);

// ---- the kit
const bubIn = (t, pan = 0) => { T.at(t, plink(note(84), .8), .26, pan); T.at(t + .05, plink(note(91), .5), .16, pan); };
const bubOut = (t, pan = 0) => T.at(t, squeak(900, 500, .08, .6), .1, pan);
const vib = (t, g = .5, pan = .2, n = 2) => vib0(t, g * .6, pan, n), vib0 = (t, g, pan, n) => { for (let i = 0; i < n; i++) T.at(t + i * .2, buzz(.15, 150, 146, 1), g, pan); };   // a phone on vibrate: bzz-bzz
const swipe = (t, g = .12) => { T.at(t, whoosh(.09, 2500, 6000, .8), g, .2); T.at(t + .02, click(.3), g * .8, .2); };
const tok = (t, g = .3, pan = .2) => { T.at(t, tone(.09, 1050, { e: env.pluck(55), amp: 1 }), g, pan); T.at(t, click(.6), g * .6, pan); };
const thwip = (t, g = .22, pan = .3) => { T.at(t, squeak(500, 1500, .1, .8), g, pan); T.at(t + .08, tone(.08, 180, { e: env.pluck(40), amp: .8 }), g * .8, pan); };   // into the shell
const hoot = (t, f = 620, g = .1, pan = .5) => T.at(t, tone(.22, x => f * (1 + .35 * Math.sin(Math.min(1, x / .22) * Math.PI)), { type: 'tri', e: env.hann(), fm: x => .004 * Math.sin(x * TAU * 9), amp: .8 }), g, pan);
const giggle = (t, dur, g = .14, f = 760, pan = 0) => { for (let i = 0; i < dur * 7; i++) T.at(t + i / 7, tone(.09, x => f * (1.1 - x * 2) * (1 + (i % 2) * .08), { type: 'tri', e: env.hann(), amp: .8 }), g, pan); };
const step = (t, g = .12, pan = 0) => T.at(t, mixb(noise(.06, { lp: 900, e: env.pluck(50), amp: 1 }), click(.2)), g, pan);
const TAU = Math.PI * 2;

// ---- the bed: a soft afternoon wind, birds now and then; it warms and settles at the sunset
T.at(0, wind(33, 0, 1.5), .045);
for (const c of [2.2, 5.9, 13.4, 16.3, 24.2, 27.9, 28.3, 31.2]) { T.at(c, chirp(1), .05, -.6); T.at(c + .12, chirp(.8), .04, -.6); }

// ---- A · on the branch
for (let k = 0; ; k++) { const t = (Math.PI / 2 + TAU * k) / 7.5; if (t > TL.JOLT - .3) break; swipe(t); }   // thumb flicks (the scene's sin(t·7.5) peaks)
bubIn(TL.LIKES0, .4); for (const d of [.35, .7, 1.0, 1.25]) T.at(TL.LIKES0 + d, plink(note(96 + (d * 4 | 0)), .5), .1, .4); bubOut(TL.LIKES1, .4);
giggle(TL.GRIN + .05, .5, .07);
bubIn(TL.CAT0, .4); [72, 76, 79, 76, 81, 79].forEach((m, i) => T.at(TL.CAT0 + .3 + i * .17, plink(note(m + 12), .6), .1, .4)); bubOut(TL.CAT1, .4);
giggle(TL.LAUGH, 1.0, .12); T.at(TL.LAUGH, laughter(1.0, .7), .07);
bubIn(TL.SHOW0, .4); T.at(TL.SHOW0 + .4, shimmer(.8, [note(88), note(91), note(95), note(100)], .6, .07), .08, .4); bubOut(TL.SHOW1, .4);
T.at(TL.SULK + .2, slide(.7, 330, 220, .6), .08); T.at(TL.SULK + .95, slide(.5, 247, 165, .6), .07);   // wah-wah
// the friends swing in, call him, give up and swing off
T.at(TL.FRIENDS, whoosh(.6, 400, 2200), .2, .6); T.at(TL.FRIENDS + .2, whoosh(.6, 400, 2200), .16, .7); T.at(TL.FRIENDS_IN - .05, squeak(300, 380, .25, .4), .06, .6);
hoot(TL.PLAY0 + .1, 640, .1, .6); hoot(TL.PLAY0 + .4, 700, .1, .6); hoot(TL.PLAY0 + .7, 600, .08, .7);
bubIn(TL.PLAY0, .5); bubOut(TL.PLAY1, .5);
T.at(TL.NOTNOW + .1, click(.5), .1); T.at(TL.SHRUG, tone(.3, x => 260 - 80 * x, { type: 'tri', e: env.swell(.03, .2), amp: .6 }), .07, .6);
T.at(TL.FRIENDS_GO, whoosh(.7, 300, 2000), .18, .7); T.at(TL.FRIENDS_GO + .1, whoosh(.7, 300, 2000), .14, .8);
// the buzzes, the jolt, the fumble
for (const b of TL.BUZZ_A) vib(b, .45);
T.at(TL.TIRED, tone(.8, x => 200 - 40 * x, { e: env.swell(.1, .5), amp: .5 }), .06);   // a heavy sigh
vib(TL.JOLT, .8, .2, 3); T.at(TL.JOLT, squeak(700, 1300, .12, .7), .14);
for (const d of [.14, .3, .42]) T.at(TL.JOLT + d, click(.9), .25, .3);   // juggling it
T.at(TL.FUMBLE1, slide(.7, 1400, 300, .6), .16, .2);                     // the drop
T.at(TL.FUMBLE1 + .05, whoosh(.5, 800, 3000), .18);
T.at(TL.BONK, mixb(bell(note(57), .5, { partials: [[1, 1], [2.7, .3]], k: 9 }), thud(.6)), .45, .3);   // tonk, on her shell
T.at(TL.BONK + .02, click(1), .3, .3);
T.at(TL.LAND_PH, crunch(.5), .2, .1); T.at(TL.LAND_PH + .12, click(.6), .14, .1);

// ---- B · the tortoise
T.at(TL.ONE_EYE, squeak(400, 520, .08, .5), .06, .3);
T.at(TL.JUMP0, whoosh(.45, 500, 2400), .16); T.at(TL.JUMP1, thud(.7), .3); step(TL.JUMP1 + .05, .2);
vib(TL.BUZZ_LEGS, .4, .1); thwip(TL.BUZZ_LEGS + .12, .18); thwip(TL.BUZZ_LEGS + .2, .14);
vib(TL.BUZZ_HEAD, .4, .1); thwip(TL.BUZZ_HEAD + .08, .26);
T.at(TL.HUH, plink(note(79), .6), .14); T.at(TL.HUH + .08, plink(note(84), .5), .1);
T.at(TL.WALK0, buzz(TL.WALK1 - TL.WALK0, 150, 148, 1), .3, .15);
for (const k of TL.TOKS) tok(k, .26);
T.at(TL.WALK0 + .3, crinkle(.6, .5), .05, -.1);   // scratching his head
T.at(TL.POPOUT, squeak(900, 400, .08, .7), .14, .3); T.at(TL.POPOUT + .15, squeak(800, 450, .07, .6), .1, .3);
bubIn(TL.SHELL0, .3); for (let i = 0; i < 4; i++) tok(TL.SHELL0 + .5 + i * .3, .05, .3); bubOut(TL.SHELL1, .3);
T.at(TL.SHELL1 - .4, chime(note(88), .7, 1.5), .16); T.at(TL.SHELL1 - .32, chime(note(95), .5, 1.3), .1);
for (let i = 0; i < 2; i++) T.at(TL.NOD + .05 + i * .22, click(.5), .12);
T.at(TL.SIT, thud(.4), .16); T.at(TL.TUCK, crinkle(.4, .5), .08);

// ---- C · the struggle
T.at(TL.PROUD, shimmer(.6, [note(91), note(96)], .6, .08), .07);
vib(TL.BUZZ_C1, .45, .2); thwip(TL.BUZZ_C1 + .1, .2, .4);
T.at(TL.SNAP, whoosh(.14, 1500, 5000), .16); T.at(TL.SLAP, mixb(noise(.05, { hp: 900, lp: 8000, e: env.pluck(70), amp: 1 }), tone(.08, 160, { e: env.pluck(40), amp: .7 })), .35);
T.at(TL.SLAP + .1, squeak(1200, 800, .1, .5), .06);
for (const b of TL.BUZZ_C2) vib(b, .35, .2, 1);
[0, 1, 2, 3, 4, 5].forEach(i => T.at(TL.TAIL0 + .1 + i * .14, plink(note(67 + i * 2), .5), .1, .1));   // tiptoe pizzicato: the tail creeps
T.at(TL.CAUGHT, squeak(800, 1600, .12, .7), .12); T.at(TL.YANK, slide(.25, 300, 1200, .6), .12);
giggle(TL.YANK + .25, .35, .06, 600);
bubIn(TL.TEMPT0, .2); for (let t = TL.TEMPT0 + .2; t < TL.TEMPT1; t += .6) vib(t, .3, .15, 1);
T.at(TL.TEMPT0 + .1, plink(note(88), .4), .06, -.2); T.at(TL.TEMPT0 + .7, plink(note(86), .4), .05, -.2);   // a sweat drop
bubOut(TL.TEMPT1, .2);
bubIn(TL.REMIND0, .2); T.at(TL.REMIND0 + .3, chime(note(79), .5, 2), .08); bubOut(TL.REMIND1, .2);
T.at(TL.BREATHE, noise(.45, { hp: 300, lp: t => 900 + 1500 * t / .45, e: env.swell(.15, .1), amp: 1 }), .06);   // a deep breath in
T.at(TL.BREATHE + .38, noise(.6, { hp: 200, lp: t => 1800 - 1200 * t / .6, e: env.swell(.05, .4), amp: 1 }), .07);   // and out
T.at(TL.STAND, thud(.3), .12);
for (const s of [TL.STAND + .15, TL.STAND + .32]) step(s, .1);
T.at(TL.GRAB, click(.7), .2, .1); T.at(TL.GRAB, buzz(TL.STUFF - TL.GRAB, 150, 148, 1), .18, .1);
T.at(TL.LIFT, squeak(600, 450, .14, .6), .08);   // ew
for (let s = TL.WALKH0; s < TL.WALKH1; s += .2) step(s, .1, -.3);
T.at(TL.STUFF, thud(.5), .22, -.4); T.at(TL.STUFF + .02, crunch(.4), .1, -.4);
T.at(TL.LEAF, crinkle(.25, .7), .12, -.4); T.at(TL.LEAF + .08, click(.6), .14, -.4);
for (let i = 0; i < 3; i++) T.at(TL.DUST + i * .14, click(.8), .14, -.3);

// ---- D · the sunset
T.at(TL.REVEAL - .2, shimmer(1.6, [note(79), note(83), note(86), note(91), note(95)], .7, .12), .1);
T.at(TL.FRIENDS2, laughter(1.6, .8), .08, .5); giggle(TL.FRIENDS2 + .1, 1.2, .07, 720, .5);
T.at(TL.FRIENDS2, whoosh(.8, 300, 2400), .16, -.2); T.at(TL.FRIENDS2 + .45, whoosh(.8, 300, 2400), .14, .2);
T.at(TL.VINE, whoosh(.5, 300, 1500), .1, .5);
T.at(TL.LEAP, whoosh(.3, 600, 2600), .14); T.at(TL.CATCH, squeak(260, 340, .3, .5), .08, .1);
T.at(TL.CATCH + .05, slide(.6, 500, 1100, .6), .08, .2); T.at(TL.CATCH, whoosh(1.0, 300, 2600), .2, .4);   // wheee
bubIn(TL.HEART0, .3); T.at(TL.HEART0 + .25, chime(note(84), .6, 2), .1); bubOut(TL.HEART1, .3);
T.at(TL.LEAFBUZZ, buzz(.35, 150, 148, 1), .1, -.4);   // muffled, in the hollow
thwip(TL.TUCKEND, .12);
T.at(TL.VERSE, chime(note(76), .5, 3), .08); T.at(TL.CITE, chime(note(83), .4, 2.5), .06);
T.write('assets/phone_sfx.wav');
