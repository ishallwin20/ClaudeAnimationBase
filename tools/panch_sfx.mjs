// panch_sfx.mjs: the sound for "HANUMAN JI has 5 FACES" (src/scenes/panch.js, ad 55, no voice) → assets/panch_sfx.wav.
// Times are the scene's constants (keep them in sync). Retro cartoon foley, as on the cute Ramayan parts: pops and
// plinks for the faces, a buzzy villain laugh, a squeaky guard, Hanuman's "huh?!", a fight cloud of bonks, a roar, a
// screech, a snort and a neigh as the four faces arrive, a long inhale, half a second of silence, one big FWOOSH, five
// little flames going out, a bonk and a poof. Quiet beds only: crickets at night, birds at dawn, a cave hum in Patala,
// a soft drone under the saffron halo.
import { track, tone, noise, bell, mixb, env, whoosh, plink, squeak, click, thud, shimmer, slide, drone, chime, chirp, roar, screech, crinkle, drum, rumble, note, seed, rnd, clamp, SR } from './sfx.mjs';

const POPOFF = 3.5, WIPE1 = 5.6;
const RISE = 6.2, LAUGH = 7.4, MAGIC = 9.0, BUBBLE = 9.4, FLOAT = 10.1, SINK = 12.1, CLOSE = 13.5, WIPE2 = 14.7;
const WALKIN = 14.9, PEEK = 15.9, TAKE = 16.4, LOOKH = 17.5, CROUCH = 18.3, LEAP = 18.6, FALL = 18.9, LANDG = 21.0;
const GUARD = 21.3, SON = 24.0, HTAKE = 24.6, SWEAT = 26.5, FIGHT = 29.6, TIED = 30.5, WIPE3 = 32.4;
const SECRET = 32.6, ONCE = 36.0, PEEKH = 39.0, STEP = 41.5, GLOW = 41.6, P_N = 42.4, P_G = 43.3, P_V = 44.2, P_H = 45.1,
  PANCH = 46.1, REACT = 47.4, INHALE = 48.6, HUSH = 49.5, BLOW = 49.9, OUT = 50.3, KO = 50.6, POOF = 51.6, ALL = 51.2,
  SAVED = 53.4, WIPE5 = 57.0, BLESS = 57.2, ASK = 61.4, WIPE6 = 64.6;
const CARD = 64.9, CARD_CAP = 65.0, COVERS = 65.2, PRICE = 66.0, LOGO = 66.3, PILL = 66.6, FOLLOW = 67.0, END = 69.5;

const T = track(END);
seed(55);
const PENTA = [0, 2, 4, 7, 9];
const pent = (base, i) => note(base + 12 * Math.floor(i / 5) + PENTA[i % 5]);
// a buzzy cartoon voice: syllables [start, dur, pitch ×, brightness 0..1] (as in the Ramayan parts)
function voice(syl, f0, { amp = 1, fall = .1, rise = 0, shake = 0 } = {}) {
  const D = Math.max(...syl.map(([s, d]) => s + d)) + .1, o = new Float32Array(Math.round(D * SR));
  let ph = 0, l = 0;
  for (let i = 0; i < o.length; i++) {
    const t = i / SR, s = syl.find(([a, d]) => t >= a && t < a + d);
    if (!s) { o[i] = 0; continue; }
    const [a, d, pm, br] = s, k = (t - a) / d, e = clamp(k / .12) * clamp((1 - k) / .25);
    ph += f0 * pm * (1.04 - fall * k + rise * k) * (1 + .012 * Math.sin(t * 38) + shake * .04 * Math.sin(t * 2 * Math.PI * 7)) / SR;
    const x = 2 * (ph - Math.floor(ph)) - 1, fc = 600 + br * 2400 * Math.sin(Math.PI * clamp(k * 1.3)), al = 1 - Math.exp(-2 * Math.PI * fc / SR);
    l += al * (x * e - l); o[i] = l * amp;
  }
  return o;
}
const talk = (dur, f, { gap = .17, amp = 1, br = .5, fall = .1, shake = 0 } = {}) =>
  voice(Array.from({ length: Math.max(1, Math.floor(dur / gap)) }, (_, i) => [i * gap, gap * .72, 1 + .14 * Math.sin(i * 2.3) - (i % 5 === 4 ? .12 : 0), br]), f, { amp, fall, shake });
const villainLaugh = (n, f = 95, amp = 1) => voice(Array.from({ length: n }, (_, i) => [i * .2, .15, 1.15 - i * .03, .7]), f, { amp, fall: .3 });
const huh = amp => voice([[0, .32, 1, .6]], 220, { amp, rise: .9, fall: 0 });
const pop = (f = 900, amp = 1) => mixb(squeak(f * .6, f * 1.6, .07, amp), plink(f * 1.5, amp * .5));
const snort = amp => mixb(noise(.18, { lp: 900, hp: 150, e: env.pluck(14), amp }), tone(.16, t => 110 - 80 * t, { type: 'saw', e: env.pluck(16), amp: amp * .35 }));
const neigh = amp => tone(.75, t => 820 * (1 - .45 * t) * (1 + .06 * Math.sin(t * 2 * Math.PI * 11)), { type: 'saw', e: env.swell(.05, .3), amp });
const bonk = amp => mixb(tone(.18, t => 520 * Math.exp(-t * 9) + 180, { type: 'tri', e: env.pluck(14), amp }), click(amp * .5));
const flameOut = amp => noise(.16, { hp: 1800, lp: 6000, e: env.pluck(20), amp });
const inhale = (dur, amp) => noise(dur, { lp: t => 600 + 3000 * (t / dur), hp: 300, e: env.swell(dur * .8, .05), amp });

// ---- beds (quiet)
T.at(0, drone(WIPE1, note(45), 1), .05, 0);                          // the halo
for (let t = WIPE1 + .2; t < WIPE2; t += .5 + rnd() * .5) { const n = 2 + Math.floor(rnd() * 3); for (let k = 0; k < n; k++) T.at(t + k * .07, chirp(1), .03, rnd() * 1.4 - .7); }   // crickets
for (let t = WIPE2 + .3; t < FALL; t += .7 + rnd() * .5) T.at(t, squeak(2600 + rnd() * 800, 3400 + rnd() * 600, .09, 1), .04, rnd() * 1.4 - .7);   // dawn birds
T.at(LANDG - .3, drone(WIPE3 - LANDG + .3, note(38), 1), .06, 0);   // the cave hum
for (let t = LANDG + .5; t < WIPE3; t += 1.1 + rnd() * .8) T.at(t, plink(note(76 + Math.floor(rnd() * 5)), .5), .06, rnd() * 1.2 - .6);   // drips
T.at(WIPE3, drone(HUSH - WIPE3, note(41), 1), .06, 0);              // the hall
T.at(SAVED, drone(WIPE5 - SAVED, note(48), 1), .05, 0);
T.at(WIPE5, drone(WIPE6 - WIPE5 + .3, note(45), 1), .05, 0);

// ---- 1 the hook: twinkles as the faces blink, four pops as they go, a wink
T.at(0, shimmer(1.4, [note(84), note(88), note(91)], .5, .12), .12, 0);
[.7, 1.5, 2.2, 2.9].forEach((t, i) => T.at(t, plink(pent(84, i * 2), .6), .07, -.4 + i * .27));
for (let i = 0; i < 4; i++) T.at(POPOFF + i * .25 + .18, pop(700 + i * 120, 1), .3, [-.5, -.3, .5, .3][i]);
T.at(POPOFF + 1.2, chime(note(88), .6, 1), .14, 0);
T.at(WIPE1 - .3, whoosh(.6, 600, 3000), .25, 0);

// ---- 2 the camp: the ground cracks, the swirl, he pops up, laughs, casts, the bubble, the sink
T.at(RISE - .4, rumble(.8, .8), .25, .3);
T.at(RISE - .3, slide(.6, 200, 900, .5), .1, .3);
T.at(RISE, pop(500, 1), .35, .3); T.at(RISE + .05, thud(.8), .2, .3);
T.at(LAUGH, villainLaugh(6, 95), .38, .3);
T.at(MAGIC, shimmer(1.2, [note(79), note(83), note(86), note(91)], .6, .08), .16, 0);
for (let i = 0; i < 6; i++) T.at(MAGIC + .1 + i * .1, plink(pent(84, 9 - i), .6), .08, .2 - i * .1);
T.at(BUBBLE, mixb(squeak(300, 900, .25, 1), tone(.4, 600, { type: 'sine', e: env.pluck(6), amp: .4 })), .25, -.3);
for (let i = 0; i < 3; i++) T.at(BUBBLE + .6 + i * .9, voice([[0, .5, 1, .2]], 110 - i * 8, { fall: .2 }), .08, -.3);   // a snore in the bubble
T.at(FLOAT, slide(1.2, 400, 700, .4), .1, 0);
T.at(LAUGH + 3.6, villainLaugh(4, 100), .25, .3);
T.at(SINK, slide(1.2, 700, 120, .7), .22, .2);
T.at(SINK + .1, whoosh(1.2, 2000, 300), .2, .2);
T.at(CLOSE + .3, pop(300, 1), .3, .2);
T.at(WIPE2 - .3, whoosh(.6, 600, 3000), .25, 0);

// ---- 3 dawn: footsteps, the peek, the take, the leap
for (let i = 0; i < 6; i++) T.at(WALKIN + i * .17, tone(.06, 180 + (i % 2) * 40, { type: 'tri', e: env.pluck(40), amp: 1 }), .14, .5 - i * .12);
T.at(PEEK, squeak(500, 700, .12, .8), .1, -.2);
T.at(TAKE, mixb(slide(.25, 300, 1600, .8), click(.6)), .3, 0);
T.at(TAKE + .05, voice([[0, .5, 1, .9]], 380, { rise: .5, shake: 1 }), .2, 0);
T.at(LOOKH + .7, squeak(900, 600, .1, .6), .08, .3);
T.at(CROUCH, squeak(500, 260, .25, .8), .14, .2);
T.at(LEAP, slide(.3, 300, 1200, .7), .25, .2);
T.at(LEAP + .1, whoosh(.5, 800, 3000), .25, .2);

// ---- 4 the fall: a long whistle down, a spin, the landing
T.at(FALL, slide(1.9, 1800, 260, .6), .2, 0);
T.at(FALL, whoosh(2.0, 400, 2400), .2, 0);
T.at(LANDG - .45, whoosh(.3, 1000, 4000), .2, 0);
T.at(LANDG, thud(1), .5, -.3); T.at(LANDG, drum(60, 1, .5), .3, -.3);

// ---- 5 the gate: the guard's tail flops, his proud squeak, Hanuman's "huh?!", the sweat-drop story, the fight, tied
for (let i = 0; i < 5; i++) T.at(GUARD + .4 + i * .32, mixb(noise(.06, { lp: 1500, e: env.pluck(40), amp: 1 }), tone(.07, 240, { e: env.pluck(30), amp: .5 })), .16, .4);
T.at(SON, talk(1.3, 520, { gap: .14, br: .8, amp: 1 }), .3, .4);
T.at(HTAKE, mixb(slide(.25, 300, 1600, .8), click(.6)), .28, -.3);
T.at(HTAKE + .1, huh(1), .32, -.3);
T.at(SWEAT, shimmer(1, [note(88), note(84), note(79)], .5, .1), .12, 0);                    // into the thought cloud
T.at(SWEAT + 1.0, mixb(plink(note(91), .8), plink(note(96), .5)), .2, 0);                   // the drop
T.at(SWEAT + 1.6, mixb(tone(.12, t => 300 - 150 * t, { e: env.pluck(12), amp: 1 })), .3, .2);   // the gulp
T.at(SWEAT + 2.1, chime(note(91), .6, 1), .12, .2);
T.at(FIGHT, rumble(.9, 1), .2, 0);
for (let i = 0; i < 7; i++) T.at(FIGHT + .05 + i * .12, i % 2 ? bonk(1) : thud(.8), .24, rnd() * 1.2 - .6);
T.at(TIED, mixb(slide(.3, 600, 300, .5), click(.6)), .2, .3);
for (let i = 0; i < 3; i++) T.at(TIED + .35 + i * .27, tone(.06, 900, { type: 'tri', e: env.pluck(40), amp: 1 }), .12, .2);   // pat pat pat
T.at(TIED + .6, voice([[0, .45, 1, .3]], 420, { fall: .4 }), .14, .3);                           // a little "hmph"
T.at(WIPE3 - .3, whoosh(.6, 600, 3000), .25, 0);

// ---- 6 the hall: five flares counted up, the laugh, the darting eyes
for (let i = 0; i < 5; i++) T.at(SECRET + .6 + i * .45, mixb(chime(pent(72, i * 2), .7, 1.4), noise(.12, { hp: 2000, lp: 6000, e: env.pluck(20), amp: .3 })), .2, [0, -.6, -.4, .6, .4][i]);
T.at(ONCE, villainLaugh(8, 90), .38, .3);
T.at(ONCE + .2, tone(.5, 60, { e: env.pluck(4), amp: 1 }), .2, .3);
[0, .35, .7, 1.05, 1.4].forEach((d, i) => T.at(PEEKH + d, squeak(1200 + i * 100, 1000, .05, .8), .08, i % 2 ? .4 : -.4));
T.at(PEEKH + 1.6, mixb(plink(note(72), .6), squeak(800, 400, .2, .6)), .14, 0);                   // the sweat drop

// ---- 7 the five faces: a rising glow, then a pop + each creature's call
T.at(STEP - .1, inhale(1.0, 1), .14, 0);
T.at(GLOW, shimmer(1.2, [note(72), note(76), note(79), note(84)], .6, .12), .18, 0);
T.at(GLOW, slide(.8, 220, 440, .5), .08, 0);
T.at(P_N, pop(700, 1), .3, -.5); T.at(P_N + .05, roar(.6, 150, 6, 1), .35, -.5);
T.at(P_G, pop(900, 1), .3, -.4); T.at(P_G + .05, screech(.5, 2700, 1), .18, -.4);
T.at(P_V, pop(600, 1), .3, .5); T.at(P_V + .05, snort(1), .4, .5); T.at(P_V + .3, snort(.8), .3, .5);
T.at(P_H, pop(1000, 1), .3, .4); T.at(P_H + .05, neigh(1), .16, .4);
T.at(PANCH, mixb(drum(70, 1, .7), bell(note(60), 2.5, { k: 1.4, amp: .8 })), .4, 0);
T.at(PANCH, shimmer(1.6, [note(84), note(88), note(91), note(96)], .7, .07), .2, 0);
T.at(REACT + .1, mixb(slide(.3, 260, 1400, .8), click(.6)), .25, .3);
T.at(REACT + .55, mixb(bell(note(83), .6, { k: 6, amp: .7 }), click(1)), .3, .3);              // the sword clatters
T.at(REACT + .7, bell(note(86), .4, { k: 8, amp: .5 }), .2, .3);

// ---- 8 one breath: inhale, SILENCE, FWOOSH, five flames out, darkness, the bonk and poof
T.at(INHALE, inhale(HUSH - INHALE, 1), .35, 0);
T.at(INHALE, slide(HUSH - INHALE, 200, 600, .5), .08, 0);
// (HUSH → BLOW: nothing at all)
T.at(BLOW, whoosh(.8, 300, 5000, 1), .7, 0);
T.at(BLOW, noise(.9, { lp: 2500, hp: 80, e: env.swell(.02, .5), amp: 1 }), .3, 0);
T.at(BLOW, drum(55, 1, .8), .35, 0);
[-.7, -.4, 0, .4, .7].forEach((p, i) => T.at(OUT - .05 + i * .03, flameOut(1), .25, p));
T.at(OUT + .1, tone(1.2, 50, { e: env.pluck(2), amp: 1 }), .2, 0);
T.at(KO + .2, mixb(tone(.6, t => 600 * Math.pow(.5, t * 3), { type: 'tri', e: env.swell(.02, .2), amp: 1 })), .2, .3);   // dizzy wobble down
for (let i = 0; i < 4; i++) T.at(KO + .1 + i * .18, plink(note(96 - i * 2), .4), .06, .3);
T.at(POOF - .15, bonk(1), .3, .3);
T.at(POOF, mixb(crinkle(.6, 1), whoosh(.5, 3000, 600)), .3, .3);
T.at(POOF + .05, slide(.4, 900, 200, .5), .12, .3);
T.at(ALL, chime(note(84), .8, 2), .16, 0);

// ---- 9 the rescue: light, the faces pop back, the hop up, the lift, the wave
T.at(SAVED, shimmer(1.6, [note(79), note(84), note(88), note(91)], .7, .1), .2, 0);
for (let i = 0; i < 4; i++) T.at(SAVED + .2 + i * .12, pop(1100 - i * 100, .8), .18, [-.4, -.2, .4, .2][i]);
T.at(SAVED + .5, mixb(squeak(400, 1200, .15, 1)), .16, 0);
T.at(SAVED + 1.0, slide(2.4, 300, 1200, .4), .1, 0);
for (let i = 0; i < 12; i++) T.at(SAVED + 1.0 + i * .18, plink(pent(72, i), .6), .08, -.3 + i * .05);
T.at(WIPE5 - .3, whoosh(.6, 600, 3000), .25, 0);

// ---- 10–11 the blessings, the ask
for (let i = 0; i < 5; i++) T.at(BLESS + .7 + i * .35, mixb(chime(pent(79, i * 2), .7, 1.4), plink(pent(91, i), .4)), .18, [0, -.5, -.3, .5, .3][i]);
T.at(ASK, chime(note(84), .8, 2), .14, 0);
for (let i = 0; i < 4; i++) T.at(ASK + .9 + i * .35, plink(note(91 + i * 2), .5), .1, [-.5, -.3, .5, .3][i]);   // the faces wink
T.at(ASK + 2.4, chime(note(96), .6, 1), .12, 0);
T.at(WIPE6 - .3, whoosh(.6, 600, 3000), .25, 0);

// ---- 12 the card
T.at(CARD_CAP, shimmer(1.6, [note(79), note(84), note(88)], .6, .1), .14, 0);
for (let i = 0; i < 3; i++) T.at(COVERS + i * .15, plink(pent(84, i * 2), .7), .14, -.3 + i * .3);
T.at(PRICE, chime(note(88), .6, 1.2), .14, 0);
T.at(PILL, mixb(plink(note(96), .7), click(.4)), .16, 0);
T.at(FOLLOW, chime(note(91), .5, 1.5), .1, 0);

T.write('assets/panch_sfx.wav');
