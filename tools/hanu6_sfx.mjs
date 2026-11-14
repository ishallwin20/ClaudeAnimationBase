// hanu6_sfx.mjs: the sound for "RAVANA could lift MOUNTAINS. He couldn't lift LAKSHMAN." (src/scenes/hanu6.js, ad 94,
// Hanuman Part 6, no voice) → assets/hanu6_sfx.wav (then loudness-normalised to assets/hanu6_mix.wav). Times are the
// scene's constants (keep them in sync). Retro synth cartoon foley as in Parts 1–5: Ravana straining and creaking; the
// chariot, donkeys and arrows; a landing; sass and an angry chorus with steam; two big slaps, a wobble, a quake, cheers;
// twenty arms clapping; the spear's roar and a hit; mountains popping in the bubble; a gold swell for Vishnu; a held
// silence, then the punch; dizzy tweets; a light boing for the easy lift; heartbeats under the twist; a war horn for Ram
// on his back. Music only as mild beds: a war drum under the duel, a drone under the fall, a music box under the ask.
import { track, tone, noise, bell, mixb, env, whoosh, plink, squeak, click, thud, shimmer, slide, chime, drum, note, seed, rnd, clamp, heart, rumble, chirp, wingbeat, laughter, om, SR } from './sfx.mjs';

const BUDGE = 2.4;
const B0 = 4.4, C0 = 8.8, LAND = 9.0, D0 = 13.2, RED = 14.4, E0 = 17.6, SLAP1 = 18.8, F0 = 22.0, SLAP2 = 22.9;
const G0 = 26.4, CLAP = 27.0, H0 = 30.8, I0 = 35.2, HURL = 35.9, HIT = 37.4, J0 = 39.6, GRAB = 41.4, K0 = 44.0, L0 = 48.4;
const M0 = 52.8, GLOW = 53.6, N0 = 57.2, RUSH = 57.6, PUNCH = 59.4, O0 = 61.6, SCOOP = 62.4, P0 = 66.0, WAKE = 69.0;
const Q0 = 71.0, MOUNT = 72.6, R0 = 75.4, S0 = 79.8, CARD = 83.1, END = 86.7;

const T = track(END);
seed(94);
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
const talk = (dur, f, { gap = .16, amp = 1, br = .5, fall = .1 } = {}) =>
  voice(Array.from({ length: Math.max(1, Math.floor(dur / gap)) }, (_, i) => [i * gap, gap * .72, 1 + .14 * Math.sin(i * 2.3) - (i % 5 === 4 ? .12 : 0), br]), f, { amp, fall });
const HANU = 230, RAVF = 110, LAKF = 200;
const giggle = (f, amp = 1, n = 4) => voice(Array.from({ length: n }, (_, i) => [i * .11, .08, 1.25 - i * .04, .7]), f, { amp, fall: .2 });
const huh = (f, amp = 1) => voice([[0, .32, 1, .6]], f, { amp, rise: .9, fall: 0 });
const ooh = (f, amp = 1) => voice([[0, .3, 1.1, .5]], f, { amp, rise: .3, fall: 0 });
const strain = (f, amp = 1, d = .5) => voice([[0, d, .9, .3]], f, { amp, fall: .1, shake: 1 });
const hmph = f => voice([[0, .14, 1.1, .5], [.18, .3, .85, .3]], f, { fall: .4 });
const pop = (f = 900, amp = 1) => mixb(squeak(f * .6, f * 1.6, .07, amp), plink(f * 1.5, amp * .5));
const boing = (amp = 1, f = 220) => tone(.35, t => f * (1 + 2.2 * t) * (1 + .18 * Math.sin(t * 2 * Math.PI * 18) * Math.exp(-t * 6)), { type: 'tri', e: env.pluck(6), amp });
const pad = (dur, ms, amp = 1, a = 1.2, r = 1.4) => mixb(...ms.map((m, i) => tone(dur, t => note(m) * (1 + .003 * Math.sin(t * 2 + i)), { type: 'tri', e: env.swell(a, r), amp: amp / ms.length })));
const swell = (dur, ms, amp = 1) => mixb(...ms.map((m, i) => tone(dur, note(m), { type: 'tri', e: env.swell(dur * .45, dur * .5), amp: amp / ms.length })));
const drone = (dur, amp = 1) => mixb(tone(dur, note(43), { type: 'tri', e: env.swell(1.0, 1.0), amp: .5 * amp }), tone(dur, note(50), { type: 'tri', e: env.swell(1.0, 1.0), amp: .4 * amp }), tone(dur, note(55), { type: 'tri', e: env.swell(1.0, 1.0), amp: .25 * amp }));
const musicBox = f => bell(f, 1.6, { partials: [[1, 1], [3.0, .25], [5.1, .08]], k: 2.6 });
const slap = (amp = 1) => mixb(noise(.09, { hp: 1500, lp: 9000, e: env.pluck(60), amp }), noise(.25, { hp: 300, lp: 2500, e: env.pluck(14), amp: amp * .6 }), thud(amp * .9), tone(.1, 1200, { e: env.pluck(50), amp: amp * .3 }));
const boom = (amp = 1) => mixb(drum(38, amp * 1.4, 1.4), thud(amp), noise(1.4, { lp: 1200, hp: 30, e: env.pluck(2.5), amp: amp * .8 }), noise(.12, { hp: 2000, lp: 9000, e: env.pluck(40), amp: amp * .6 }));
const bray = (amp = 1) => voice([[0, .22, 1.6, .7], [.24, .3, 1.0, .5], [.56, .22, 1.6, .7], [.8, .3, 1.0, .5]], 300, { amp, fall: .2 });
const arrowSnd = (amp = 1) => whoosh(.25, 3200, 900, amp);
const tweets = (t0, dur, pan = 0) => { for (let t = t0; t < t0 + dur; t += .28) T.at(t, mixb(chirp(.6), squeak(2600, 3400, .08, .4)), .05, pan + (rnd() - .5) * .3); };
const warDrum = (a, b, amp = .5) => { for (let t = a; t < b; t += .62) { T.at(t, drum(52, amp, .5), .1, 0); T.at(t + .31, drum(64, amp * .6, .3), .07, 0); } };
const chorus = (dur, amp = 1) => mixb(...[0, 1, 2, 3, 4].map(i => talk(dur, RAVF * (1 + i * .18), { gap: .13 + i * .01, br: .5, amp: amp / 3 })));

// ================= A · the hook: ten heads straining; "!?" =================
T.at(0, drone(B0 + .3, .7), .07, 0);
for (let k = 0; k < 4; k++) T.at(.1 + k * .55, strain(RAVF * (1 + (k % 3) * .2), .9, .45), .12, (k % 2 ? .3 : -.3));
for (let k = 0; k < 5; k++) T.at(.3 + k * .4, mixb(squeak(300, 220, .25, .5), click(.3)), .06, 0);              // creaks
T.at(BUDGE, mixb(pop(1100, .9), plink(note(88), .5)), .14, 0);
T.at(BUDGE + .1, mixb(...[0, 1, 2].map(i => huh(RAVF * (1.3 + i * .25), .5))), .12, 0);
T.at(B0 - .3, whoosh(.6, 400, 3000), .14, 0);

// ================= B · the chariot =================
warDrum(B0, C0, .45);
T.at(B0, mixb(rumble(1.6, .9), noise(1.5, { lp: 900, hp: 80, e: env.swell(.2, .6), amp: .5 })), .16, .5);       // wheels
T.at(B0 + .3, bray(.8), .1, .5);
for (let k = 0; k < 7; k++) T.at(B0 + 1.5 + k * .38, arrowSnd(.9), .08, .4 - k * .12);
T.at(B0 + 1.5, chorus(1.4, .7), .08, .4);                                                                          // Ravana's laugh
T.at(B0 + 1.8, mixb(pop(1100, .7), voice([[0, .3, 1.6, .9]], 380, { rise: .5, shake: 1 })), .1, -.4);
T.at(B0 + 2.1, voice([[0, .3, 1.5, .9]], 330, { rise: .5, shake: 1 }), .09, -.5);
for (let k = 0; k < 8; k++) T.at(B0 + 1.8 + k * .14, click(.4), .05, -.5);                                          // running feet

// ================= C · Hanuman lands; "beware of monkeys!" =================
warDrum(C0, E0, .35);
T.at(LAND - .45, slide(.45, 1600, 300, .6), .1, -.3);
T.at(LAND, mixb(thud(1), drum(48, .8, .6), noise(.5, { lp: 1500, hp: 200, e: env.pluck(6), amp: .5 })), .22, -.3);
T.at(C0 + .6, talk(3.0, HANU, { gap: .15, br: .6 }), .11, -.3);
T.at(LAND + .5, mixb(chime(note(93), .7, 1.2), shimmer(.8, [note(88), note(93)], .5, .08)), .08, -.3);
T.at(C0 + 2.4, mixb(...[0, 1].map(i => voice([[0, .18, 1.2 + i * .2, .5]], RAVF * 2, { fall: .3 }))), .1, .3);   // gulps
T.at(C0 + 2.5, mixb(squeak(2000, 2600, .08, .5), plink(note(91), .4)), .06, .3);

// ================= D · "remember Aksha?"; ten heads go red =================
T.at(D0 + .3, talk(2.7, HANU, { gap: .15, br: .6 }), .11, -.3);
T.at(D0 + 2.8, giggle(HANU, .7, 3), .08, -.3);
for (let k = 0; k < 5; k++) T.at(RED + k * .14, tone(.25, t => 300 + k * 60 + 500 * t, { type: 'tri', e: env.pluck(8), amp: .5 }), .07, .3);   // reddening
T.at(RED + .9, noise(2.4, { hp: 2500, lp: 9000, e: env.swell(.1, 1), amp: .45 }), .1, .3);                       // steam
T.at(RED + .9, chorus(1.6, .9), .1, .3);                                                                            // an angry rumble of ten

// ================= E · slap 1 =================
warDrum(E0, G0, .3);
T.at(SLAP1 - .7, tone(.6, t => 200 + 500 * t, { type: 'tri', e: env.swell(.5, .05), amp: .4 }), .08, .2);          // wind-up
T.at(SLAP1 - .1, whoosh(.2, 3000, 800), .12, .1);
T.at(SLAP1, slap(1), .32, -.1);
T.at(SLAP1 + .15, tone(1.4, t => 220 * (1 + .25 * Math.sin(t * 22) * Math.exp(-t * 1.6)), { type: 'tri', e: env.pluck(1.6), amp: .5 }), .1, -.3);   // the wobble
tweets(SLAP1 + .2, 1.2, -.3);
T.at(SLAP1 + 1.6, hmph(HANU), .12, -.3);

// ================= F · slap 2; the mountain shakes; cheers =================
T.at(SLAP2 - .45, slide(.4, 400, 1400, .5), .1, -.2);
T.at(SLAP2, mixb(slap(1.1), boom(.5)), .34, .1);
T.at(SLAP2 + .05, rumble(2.2, 1), .22, .2);                                                                         // the quake
for (let i = 0; i < 10; i++) T.at(SLAP2 + .05 + i * .05, boing(.25, 180 + i * 30), .05, -.5 + i * .1);              // ten heads wobbling
T.at(SLAP2 + .6, laughter(2.4, .9), .12, -.6);                                                                      // cheering
T.at(SLAP2 + .7, mixb(voice([[0, .4, 1.6, .9]], 380, { rise: .3 }), voice([[0, .4, 1.4, .9]], 330, { rise: .3 })), .1, -.6);
T.at(SLAP2 + 1.0, giggle(HANU, .8, 5), .1, -.2);

// ================= G · "well done, monkey!"; twenty arms clap =================
T.at(G0 + .2, chorus(2.8, .8), .1, .3);
for (let t = CLAP; t < H0 - .3; t += .175) for (let j = 0; j < 3; j++) T.at(t + j * .02 + rnd() * .03, mixb(noise(.05, { hp: 1200, lp: 6000, e: env.pluck(80), amp: .7 }), click(.3)), .06, .3 + (rnd() - .5) * .8);
T.at(CLAP + .6, mixb(pop(1100, .8), huh(HANU, .9)), .12, -.3);

// ================= H · "shame on my strength" =================
T.at(H0 + .5, mixb(squeak(1400, 600, .2, .6), noise(.5, { hp: 2500, lp: 8000, e: env.swell(.05, .3), amp: .35 })), .1, -.3);
T.at(H0 + .3, hmph(HANU), .12, -.3);
T.at(H0 + 1.8, talk(2.0, HANU, { gap: .14, br: .6 }), .11, -.3);
T.at(H0 + 2.3, mixb(pop(1100, .8), ...[0, 1, 2].map(i => voice([[0, .3, 1.3 + i * .2, .6]], RAVF * 2, { rise: .5 }))), .1, .3);   // offended gasps

// ================= I · the spear =================
T.at(I0, drone(J0 - I0 + .4, .5), .06, 0);
T.at(HURL - .4, strain(RAVF, .8, .35), .1, .3);
T.at(HURL, mixb(whoosh(1.5, 600, 2400), noise(1.5, { hp: 200, lp: 2200, e: env.swell(.2, .3), amp: .5 })), .2, .3);   // the spear's roar
for (let k = 0; k < 4; k++) { T.at(HURL + .15 + k * .32, mixb(squeak(900, 1200, .06, .4), click(.5)), .07, -.4); T.at(HURL + .3 + k * .32, mixb(plink(2400, .6), click(.4)), .08, 0); }   // twangs, pings
T.at(HIT, mixb(boom(.8), noise(.6, { hp: 400, lp: 4000, e: env.pluck(6), amp: .6 })), .3, -.3);
T.at(HIT + .1, voice([[0, .4, 1.1, .5]], LAKF, { fall: .5 }), .1, -.3);
T.at(HIT + .55, thud(.9), .14, -.4);

// ================= J · he runs to carry him off =================
T.at(J0, drone(K0 - J0 + .2, .6), .06, 0);
for (let k = 0; k < 6; k++) T.at(J0 + .5 + k * .24, mixb(drum(60, .4, .3), click(.3)), .09, .3 - k * .06);         // big steps
T.at(J0 + .5, chorus(1.2, .6), .07, .3);
T.at(GRAB, mixb(thud(.6), click(.5)), .1, 0);
for (let k = 0; k < 4; k++) T.at(GRAB + .9 + k * .5, strain(RAVF * (1 + k * .15), .8, .4), .1, 0);

// ================= K · the mountains in his bubble =================
T.at(K0 + .2, mixb(pop(900, .8), plink(note(88), .5)), .12, 0);
for (let i = 0; i < 4; i++) T.at(K0 + .5 + i * .45, mixb(pop(600 + i * 150, .8), drum(50 + i * 4, .5, .4)), .12, -.3 + i * .2);
T.at(K0 + .4, swell(4, [50, 57, 62], .7), .07, 0);
for (let k = 0; k < 5; k++) T.at(K0 + 2.4 + k * .4, mixb(whoosh(.3, 600, 1500, .5)), .05, 0);                      // juggling
T.at(K0 + 1.0, voice([[0, .6, .9, .2]], RAVF * 2, { fall: .2 }), .07, 0);                                           // a bored yawn

// ================= L · but not Lakshman =================
T.at(L0, rumble(4.4, .5), .1, 0);
for (let k = 0; k < 8; k++) T.at(L0 + .1 + k * .5, strain(RAVF * (1 + (k % 4) * .17), .9, .42), .12, (k % 2 ? .3 : -.3));
for (let k = 0; k < 6; k++) T.at(L0 + .3 + k * .65, mixb(squeak(320, 200, .3, .6), click(.4)), .07, 0);           // creaks
for (let k = 0; k < 4; k++) T.at(L0 + .4 + k * .9, mixb(slide(.25, 900, 500, .4), noise(.2, { hp: 600, lp: 3000, e: env.pluck(12), amp: .3 })), .07, -.2);   // feet slipping
T.at(L0 + 1.2, mixb(pop(1100, .9), plink(note(88), .5)), .14, 0);

// ================= M · a part of Vishnu =================
T.at(GLOW - .2, swell(4.2, [57, 64, 69, 73, 76], 1), .16, 0);
T.at(GLOW + .6, mixb(chime(note(93), 1, 2), shimmer(1.6, [note(88), note(93), note(97), note(100)], .8, .1)), .12, 0);
T.at(GLOW + 1.2, om(2.6, 110, .6), .1, 0);

// ================= N · the punch =================
for (let k = 0; k < 7; k++) T.at(RUSH + k * .13, mixb(click(.5), drum(70, .25, .2)), .1, -.6 + k * .1);            // running in
T.at(RUSH, whoosh(.9, 500, 3000), .1, -.4);
T.at(RUSH + .95, hmph(HANU), .1, -.2);
// … a held breath (PUNCH − .7 to PUNCH): nothing at all, then:
T.at(PUNCH, boom(1.2), .45, .1);
T.at(PUNCH + .02, slap(.9), .2, .1);
T.at(PUNCH + .2, thud(1), .2, .2); T.at(PUNCH + .45, thud(.8), .18, .2);                                            // down to his knees
tweets(PUNCH + .5, 1.8, .3);
T.at(PUNCH + .7, laughter(1.4, .6), .07, -.5);

// ================= O · the easy lift =================
T.at(SCOOP, mixb(boing(.7, 300), pop(1200, .7)), .14, -.2);
T.at(SCOOP + .4, mixb(chime(note(88), .8, 1.4), shimmer(.9, [note(93), note(97), note(100)], .7, .06)), .12, -.2);
T.at(SCOOP + .6, mixb(pop(1100, .8), ...[0, 1, 2].map(i => huh(RAVF * (1.4 + i * .3), .5))), .12, .4);           // "!?"
T.at(SCOOP + .5, giggle(HANU, .9, 5), .1, -.2);
for (let k = 0; k < 5; k++) T.at(O0 + 3.0 + k * .28, mixb(click(.35), drum(70, .2, .2)), .08, -.4);

// ================= P · the twist =================
T.at(P0, swell(5.0, [55, 62, 67, 71, 74], 1), .14, 0);
T.at(P0 + .2, pad(5.0, [55, 62, 67], .8, 1, 1), .06, 0);
for (let k = 0; k < 4; k++) T.at(P0 + .6 + k * 1.1, heart(.7), .07, 0);
T.at(P0 + 1.8, mixb(pop(800, .5), pop(950, .5)), .07, 0);
T.at(P0 + 1.5, mixb(chime(note(93), .9, 2), plink(note(100), .4)), .1, 0);
T.at(WAKE, mixb(ooh(LAKF, .8), chime(note(88), .7, 1.4)), .1, -.2);
T.at(WAKE + .5, giggle(HANU, .9, 5), .1, 0);

// ================= Q · Ram on his back, like Vishnu on Garuda =================
T.at(Q0 + .2, talk(1.3, HANU, { gap: .15, br: .6 }), .11, -.3);
T.at(Q0 + .3, mixb(pop(900, .8), plink(note(88), .5)), .12, 0);
for (let k = 0; k < 3; k++) T.at(Q0 + .5 + k * .3, wingbeat(.6, 1), .08, .2);
T.at(MOUNT, mixb(slide(.5, 500, 1200, .5), boing(.5, 260)), .12, .2);
T.at(MOUNT + .5, thud(.6), .1, 0);
T.at(MOUNT + .8, mixb(squeak(800, 1100, .15, .5), click(.4)), .08, 0);                                              // the bowstring
T.at(MOUNT + .9, tone(1.8, t => note(50) * (1 + .01 * Math.sin(t * 30)), { type: 'saw', e: env.swell(.3, .8), amp: .35 }), .12, 0);   // war horn
T.at(MOUNT + 1.2, whoosh(1.4, 400, 3200), .14, .3);
warDrum(MOUNT + .9, R0, .4);

// ================= ask, next, card =================
{
  const TUNE = [0, 4, 7, 4, 9, 7, 4, 2, 0, 2, 4, 7, 4, 2, 0, -3];
  let i = 0;
  for (let t = R0 + .2; t < S0 - .2; t += .34) { const m = TUNE[i++ % TUNE.length]; T.at(t, musicBox(note(81 + m)), .08, i % 2 ? -.25 : .25); }
  T.at(R0, pad(S0 - R0, [57, 64, 69, 73], 1, .6, .8), .06, 0);
}
for (let k = 0; k < 3; k++) { T.at(R0 + 1.2 + k * .22, pop(800 + k * 120, .5), .07, 0); T.at(R0 + 2.8 + k * .22, pop(900 + k * 120, .5), .07, 0); }
T.at(S0, mixb(whoosh(.5, 3000, 400), slide(.6, 600, 200, .5)), .14, 0);
T.at(S0, pad(CARD - S0, [50, 57, 62, 65], 1, .4, .6), .06, 0);
T.at(S0 + .2, whoosh(2.6, 300, 1400), .1, -.2);                                                                    // flying
T.at(S0 + .6, whoosh(1.6, 4000, 1200, .8), .12, .4);                                                               // the arrow rising
T.at(S0 + 1.4, mixb(pop(1100, .8), plink(note(88), .5), huh(HANU, .8)), .12, 0);
T.at(CARD, whoosh(.4, 3000, 600), .14, 0);
[.3, .45, .6].forEach((d, i) => T.at(CARD + d, pop(600 + i * 100, .8), .14, -.4 + i * .4));
T.at(CARD + 1.0, chime(note(81), 1, 1.6), .14, 0); T.at(CARD + 1.6, mixb(pop(900, .8), plink(note(88), .8)), .14, 0);
T.at(CARD + 2.2, shimmer(1.2, [note(81), note(85), note(88), note(93)], .7, .09), .12, 0);

T.write('assets/hanu6_sfx.wav');
console.log('assets/hanu6_sfx.wav', END + ' s');
