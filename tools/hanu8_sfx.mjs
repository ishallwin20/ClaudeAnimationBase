// hanu8_sfx.mjs: the sound for "RAM gave everyone JEWELS. HANUMAN asked for this." (src/scenes/hanu8.js, ad 96, Hanuman
// Part 8, no voice) → assets/hanu8_sfx.wav (then loudness-normalised to assets/hanu8_mix.wav). Times are the scene's
// constants (keep them in sync). Retro synth cartoon foley as in Parts 1–7: coins and gem twinkles, court chatter, a
// feast; sobs at the parting; two "not this" buzzes; his small voice asking; a harp and two sung lines for the apsaras,
// a puff of wind; footsteps off the throne and the hug; a blessing swell; the necklace's bright chime; slow steps
// going home; a low drone for the end of Ram's time, a crowd's plea, a cheer; one held near-silence before "you chose
// to live"; a gold burst when he is glad. Music only as mild beds: warm pads under the asking, the hug and the
// blessing, a drone under the parting, a music box under the ask.
import { track, tone, noise, bell, mixb, env, whoosh, plink, squeak, click, thud, shimmer, slide, chime, drum, note, seed, rnd, clamp, heart, rumble, chirp, wingbeat, laughter, om, SR } from './sfx.mjs';

const ASK = 2.6;
const B0 = 4.4, C0 = 8.8, GIVE = 9.8, D0 = 13.2, E0 = 17.6, NOGOLD = 19.2, NOCROWN = 20.4, F0 = 22.2, G0 = 27.2, H0 = 32.2, BLOW = 35.4;
const I0 = 37.4, HUG = 38.9, J0 = 41.8, K0 = 47.0, L0 = 51.6, LIFT = 52.4, TIE = 53.8, M0 = 56.6, N0 = 61.2, O0 = 66.0, YES = 66.7;
const P0 = 70.4, TURN = 71.2, Q0 = 75.4, GLAD = 78.2, U0 = 80.6, V0 = 85.4, GONE = 86.6, ASH = 87.2, CARD = 88.6, END = 92.2;

const T = track(END);
seed(96);
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

const RAMF = 150, SUGF = 190, APSF = 380;
const coins = (t0, n = 5, pan = 0, amp = 1) => { for (let k = 0; k < n; k++) T.at(t0 + k * .09 + rnd() * .03, mixb(plink(note(96 + Math.floor(rnd() * 8)), .6 * amp), click(.3 * amp)), .08, pan + (rnd() - .5) * .4); };
const sob = (t0, f = 150, pan = 0, amp = .7) => T.at(t0, voice([[0, .22, 1.1, .4], [.26, .3, .9, .3]], f, { amp, fall: .3, shake: 1 }), .08, pan);
const buzz = (amp = 1) => mixb(tone(.28, 110, { type: 'saw', e: env.pluck(5), amp: amp * .6 }), tone(.28, 117, { type: 'saw', e: env.pluck(5), amp: amp * .5 }));
const hpop = (t0, pan = 0) => { for (let k = 0; k < 3; k++) T.at(t0 + k * .22, pop(800 + k * 120, .5), .07, pan); };
const sing = (t0, ms, f = APSF, pan = 0, amp = .8) => ms.forEach((m, i) => T.at(t0 + i * .42, voice([[0, .38, Math.pow(2, m / 12), .6]], f, { amp, fall: 0 }), .07, pan));
const step = (t0, n, gap = .22, pan = 0, amp = .5) => { for (let k = 0; k < n; k++) T.at(t0 + k * gap, mixb(click(amp), drum(60, amp * .6, .2)), .08, pan + k * .04); };

// ================= A · the hook: a heap of jewels, and one small wish =================
T.at(0, pad(B0 + .3, [60, 67, 72, 76], .9, .3, .8), .06, 0);
coins(.1, 4, -.5, .8); coins(1.5, 3, -.5, .6);
T.at(.2, shimmer(2.0, [note(93), note(97), note(100)], .5, .08), .07, -.5);
T.at(ASK, mixb(pop(1000, .9), plink(note(88), .6), chime(note(93), .8, 1.6)), .14, .4);
T.at(ASK + .1, talk(1.3, HANU, { gap: .16, br: .7 }), .11, .1);
T.at(B0 - .3, whoosh(.6, 400, 3000), .13, 0);

// ================= B · friends in Ayodhya: a feast, a month like a moment =================
T.at(B0, pad(C0 - B0, [62, 66, 69, 74], 1, .4, .6), .06, 0);
T.at(B0 + .3, talk(1.4, SUGF, { gap: .15, br: .7 }), .09, 0);
T.at(B0 + 1.0, talk(1.8, 120, { gap: .2, br: .4 }), .09, .5);
for (let k = 0; k < 5; k++) T.at(B0 + .6 + k * .7, mixb(click(.5), squeak(500, 380, .09, .4)), .07, (k % 2 ? .3 : -.1));   // munching
T.at(B0 + .4, boing(.5, 300), .08, 0);
hpop(B0 + 1.2, -.3); hpop(B0 + 2.6, .2);
T.at(B0 + 2.4, giggle(HANU, .7, 5), .09, .2);
[0, 4, 7, 12].forEach((m, i) => T.at(B0 + 3.0 + i * .2, bell(note(81 + m), 1, { k: 3 }), .07, .4));

// ================= C · the kings' gifts, given away =================
T.at(C0, pad(D0 - C0, [64, 68, 71, 76], 1, .4, .6), .06, 0);
coins(C0 + .1, 6, -.2); T.at(C0 + .2, talk(.8, RAMF, { gap: .18, br: .6 }), .1, -.5);
T.at(GIVE, mixb(whoosh(.5, 800, 4000, .8), chime(note(88), 1, 1.8)), .14, 0);
coins(GIVE + .1, 8, .2, 1); coins(GIVE + .7, 5, .4, .8);
T.at(GIVE + .15, mixb(ooh(SUGF, .9), boing(.7, 260)), .12, 0);
T.at(GIVE + .4, ooh(120, .8), .1, .5);
T.at(GIVE + .5, shimmer(1.6, [note(88), note(93), note(96), note(100)], .8, .08), .1, 0);
T.at(GIVE + 1.0, giggle(SUGF, .8, 5), .09, 0);
T.at(D0 - .2, slide(.4, 700, 300, .4), .08, 0);

// ================= D · time to go home =================
T.at(D0, drone(E0 - D0, .8), .07, 0);
T.at(D0 + .1, talk(.9, RAMF, { gap: .2, br: .5 }), .1, -.3);
T.at(D0 + .9, mixb(slide(.3, 400, 600, .4), thud(.3)), .09, -.1);
hpop(D0 + 1.2, -.1);
sob(D0 + 1.5, SUGF, 0); sob(D0 + 2.3, SUGF, 0); sob(D0 + 2.9, 120, .5); sob(D0 + 3.5, SUGF, 0);
T.at(E0 - .3, whoosh(.5, 3000, 500), .11, 0);

// ================= E · Hanuman bows: not gold, not a kingdom =================
T.at(E0, pad(F0 - E0, [57, 64, 69], .8, .5, .7), .05, 0);
T.at(E0 + .3, mixb(slide(.5, 500, 300, .5), thud(.3)), .09, .3);
T.at(NOGOLD - .5, mixb(pop(900, .8), plink(note(93), .5)), .11, -.2); coins(NOGOLD - .4, 3, -.2, .6);
T.at(NOGOLD, mixb(buzz(1), click(.8)), .14, -.2);
T.at(NOCROWN - .5, mixb(pop(1000, .8), plink(note(96), .5)), .11, .2);
T.at(NOCROWN, mixb(buzz(1), click(.8)), .14, .2);
T.at(E0 + 3.0, mixb(pop(1100, .7), huh(RAMF, .8)), .11, -.5);

// ================= F · "let my love for you last" =================
T.at(F0, pad(G0 - F0 + .3, [60, 64, 67, 72], 1, .8, .8), .07, 0);
T.at(F0 + .3, talk(3.9, HANU, { gap: .19, br: .6 }), .1, .3);
T.at(F0 + .6, mixb(pop(900, .8), chime(note(88), .8, 1.6)), .11, 0);
for (let k = 0; k < 5; k++) T.at(F0 + .8 + k * .78, heart(.8), .08, 0);
hpop(F0 + 2.2, .1);

// ================= G · "as long as your story is told, let me stay alive" =================
T.at(G0, swell(H0 - G0 + .2, [57, 64, 69, 73, 76], 1), .12, 0);
T.at(G0 + .3, talk(3.7, HANU, { gap: .2, br: .6 }), .1, .3);
T.at(G0 + .7, mixb(pop(900, .8), shimmer(2.6, [note(81), note(88), note(93), note(97)], .8, .07)), .11, 0);
T.at(G0 + 1.6, mixb(pop(1100, .7), huh(RAMF, .8)), .1, -.5);
T.at(G0 + 3.0, chime(note(93), 1, 2.2), .12, 0);
T.at(H0 - .3, whoosh(.6, 400, 3000), .12, 0);

// ================= H · the apsaras sing; the cloud of longing blows away =================
T.at(H0, pad(I0 - H0, [62, 69, 74, 78], 1, .6, .8), .07, 0);
[0, 4, 7, 12, 16, 19, 24].forEach((m, i) => T.at(H0 + .1 + i * .08, bell(note(74 + m), 1.2, { k: 3 }), .08, 0));
sing(H0 + .7, [0, 2, 4, 7, 4, 2], APSF, -.5); sing(H0 + .9, [4, 5, 7, 12, 7, 5], APSF * .75, .5, .6);
T.at(H0 + .5, tone(2.6, note(50), { type: 'tri', e: env.swell(.6, 1.2), amp: .3 }), .06, 0);                      // the longing, low
T.at(BLOW, mixb(whoosh(1.0, 500, 5000, 1), slide(.9, 300, 1200, .4)), .15, .2);
T.at(BLOW + .4, mixb(chime(note(93), 1, 2), ooh(HANU, .8)), .12, 0);
hpop(BLOW + .5, 0);
T.at(I0 - .3, whoosh(.5, 3000, 500), .11, 0);

// ================= I · Ram rises from his throne and embraces him =================
T.at(I0 + .4, mixb(squeak(300, 420, .2, .4), thud(.4)), .09, -.5);
step(I0 + .6, 4, .2, -.4);
T.at(I0 + .7, huh(HANU, .7), .09, .3);
T.at(HUG, mixb(thud(.5), slide(.3, 400, 700, .4), chime(note(88), 1, 2.4)), .14, 0);
T.at(HUG, swell(J0 - HUG + .4, [60, 67, 72, 76, 79], 1), .13, 0);
T.at(HUG + .2, shimmer(1.8, [note(88), note(93), note(96), note(100)], .8, .08), .1, 0);
hpop(HUG + .3, 0); hpop(HUG + 1.5, 0);

// ================= J · "so it will be" =================
T.at(J0, pad(K0 - J0 + .3, [55, 62, 67, 71], 1, .8, .8), .08, 0);
T.at(J0 + .3, talk(4.1, RAMF, { gap: .21, br: .5 }), .1, -.3);
T.at(J0 + .5, mixb(pop(900, .7), shimmer(3.0, [note(81), note(88), note(93), note(97)], .8, .07)), .1, 0);
T.at(J0 + 1.4, mixb(boing(.6, 300), giggle(HANU, .8, 4)), .1, .4);
for (let k = 0; k < 5; k++) T.at(J0 + 1.3 + k * .5, plink(note(100 - k * 2), .5), .06, .4);

// ================= K · "for each thing you did for me, I would give my life" =================
T.at(K0, pad(L0 - K0 + .3, [57, 60, 64, 69], 1, .8, .8), .08, 0);
T.at(K0 + .3, talk(3.5, RAMF, { gap: .23, br: .4 }), .1, -.3);
[0, 1, 2].forEach(i => T.at(K0 + .5 + i * .6, mixb(pop(850 + i * 120, .8), plink(note(88 + i * 2), .5)), .11, -.3 + i * .3));
T.at(K0 + 1.3, voice([[0, .3, 1.2, .5]], HANU, { amp: .7, fall: .3 }), .08, .4);                                   // shy
[0, 1, 2].forEach(i => T.at(K0 + 2.3 + i * .25, pop(900 + i * 120, .5), .07, -.3 + i * .3));
for (let k = 0; k < 3; k++) T.at(K0 + 2.6 + k * .7, heart(.8), .08, 0);

// ================= L · the necklace =================
T.at(L0, pad(M0 - L0, [62, 69, 74], .8, .6, .8), .06, 0);
T.at(LIFT, mixb(slide(.6, 500, 1000, .4), shimmer(1.2, [note(93), note(98), note(100)], .6, .07)), .1, -.3);
for (let k = 0; k < 4; k++) T.at(LIFT + .3 + k * .25, plink(note(96 + k * 2), .5), .07, -.3 + k * .15);            // pearls clicking
T.at(TIE, mixb(chime(note(96), 1.2, 2.6), bell(note(84), 2, { k: 2 }), pop(1000, .8)), .16, .3);
T.at(TIE + .1, shimmer(2.0, [note(88), note(93), note(96), note(100), note(105)], .9, .07), .11, .3);
T.at(TIE + .2, ooh(HANU, .9), .1, .3);
T.at(TIE + .9, mixb(boing(.6, 300), giggle(HANU, .8, 5)), .1, .3);
hpop(TIE + 1.0, .3);
T.at(M0 - .3, whoosh(.6, 3000, 400), .11, 0);

// ================= M · the others go home in tears =================
T.at(M0, drone(N0 - M0 + .2, .9), .08, 0);
step(M0 + .2, 12, .34, 0, .35);
sob(M0 + .5, SUGF, -.1); sob(M0 + 1.4, 130, .4); sob(M0 + 2.3, SUGF, .1); sob(M0 + 3.2, 120, .5);
T.at(M0 + 1.0, tone(3.0, note(69), { type: 'tri', e: env.swell(1.2, 1.4), amp: .25 }), .07, 0);
T.at(N0 - .3, whoosh(.7, 2000, 300), .1, 0);

// ================= N · years later: everyone begs to go with him =================
T.at(N0, drone(O0 - N0 + .6, 1), .09, 0);
T.at(N0 + .2, bell(note(57), 3, { k: 1.2 }), .1, 0);
T.at(N0 + 1.4, chorus(2.6, .9), .1, .3);
sob(N0 + 1.8, SUGF, .1); sob(N0 + 2.8, 210, .4); sob(N0 + 3.6, SUGF, .2);

// ================= O · Ram says yes =================
T.at(O0 + .2, talk(.5, RAMF, { gap: .2, br: .5 }), .1, -.5);
T.at(YES, mixb(chime(note(88), 1, 2), pop(1000, .9)), .14, -.3);
T.at(YES, pad(P0 - YES, [60, 64, 67, 72], 1, .3, .7), .07, 0);
T.at(YES + .1, mixb(...[0, 1, 2, 3].map(i => voice([[0, .5, 1.2 + i * .1, .7]], 170 + i * 40, { amp: .5, rise: .3, fall: 0 }))), .12, .3);   // a cheer
for (let k = 0; k < 4; k++) T.at(YES + .2 + k * .18, boing(.4, 260 + k * 30), .07, .1 + k * .15);
T.at(YES + .3, shimmer(1.6, [note(88), note(93), note(96)], .8, .08), .09, .3);
hpop(YES + .4, .2); hpop(YES + 1.2, .5);

// ================= P · he turns to Hanuman (near silence, then the line) =================
T.at(P0 + .1, tone(P0 + 2.0 - P0, note(45), { type: 'tri', e: env.swell(.8, .6), amp: .3 }), .07, 0);
T.at(TURN, mixb(slide(.3, 500, 350, .3), click(.4)), .08, -.3);
T.at(TURN + .2, talk(.6, RAMF, { gap: .22, br: .4 }), .09, -.3);
T.at(P0 + 2.0, mixb(drum(40, 1, 1.2), bell(note(62), 2.6, { k: 1.4 })), .15, 0);
T.at(P0 + 2.05, mixb(pop(1100, .9), huh(HANU, .9)), .12, .4);
T.at(P0 + 2.3, talk(1.8, RAMF, { gap: .24, br: .4 }), .1, -.3);
T.at(P0 + 2.6, pad(Q0 - P0 - 2.4, [57, 64, 69], .9, .6, .6), .07, 0);

// ================= Q · "stay, and be happy." And Hanuman was. =================
T.at(Q0, pad(GLAD - Q0 + .3, [55, 62, 67, 71], 1, .8, .6), .08, 0);
T.at(Q0 + .2, talk(2.2, RAMF, { gap: .23, br: .5 }), .1, -.3);
T.at(Q0 + .6, mixb(pop(900, .7), shimmer(2.0, [note(81), note(88), note(93)], .7, .07)), .1, 0);
T.at(GLAD, mixb(chime(note(91), 1.1, 2.4), pop(1000, .9), boing(.6, 300)), .15, .3);
T.at(GLAD, swell(U0 - GLAD + .4, [60, 67, 72, 76, 79], 1), .14, 0);
T.at(GLAD + .1, voice([[0, .22, 1.2, .7], [.26, .22, 1.35, .7], [.52, .5, 1.5, .8]], HANU, { amp: 1, fall: 0 }), .12, .3);
T.at(GLAD + .3, shimmer(1.6, [note(88), note(93), note(96), note(100)], .8, .08), .1, 0);
hpop(GLAD + .3, .3); hpop(GLAD + 1.3, .3);

// ================= ask, next, card =================
{
  const TUNE = [0, 4, 7, 4, 9, 7, 4, 2, 0, 2, 4, 7, 4, 2, 0, -3];
  let i = 0;
  for (let t = U0 + .2; t < V0 - .2; t += .34) { const m = TUNE[i++ % TUNE.length]; T.at(t, musicBox(note(81 + m)), .08, i % 2 ? -.25 : .25); }
  T.at(U0, pad(V0 - U0, [57, 64, 69, 73], 1, .6, .8), .06, 0);
}
T.at(U0 + 1.4, mixb(pop(900, .8), huh(RAMF * 1.2, .6)), .1, 0);
hpop(U0 + 2.2, .4);
T.at(V0, mixb(whoosh(.5, 3000, 400), slide(.6, 300, 900, .5)), .13, 0);
T.at(V0, drone(CARD - V0, .8), .08, 0);
warDrum(V0 + .1, GONE, .4);
T.at(GONE, mixb(noise(.4, { hp: 600, lp: 7000, e: env.pluck(8), amp: .7 }), slide(.4, 900, 300, .5)), .13, .1);
T.at(ASH, mixb(boom(.9), whoosh(1.2, 300, 3000, 1), noise(1.3, { hp: 500, lp: 5000, e: env.swell(.2, .9), amp: .6 })), .17, 0);
T.at(ASH + .2, mixb(pop(1100, .8), huh(170, .8)), .11, .4);
T.at(CARD, whoosh(.4, 3000, 600), .14, 0);
[.3, .45, .6].forEach((d, i) => T.at(CARD + d, pop(600 + i * 100, .8), .14, -.4 + i * .4));
T.at(CARD + 1.0, chime(note(81), 1, 1.6), .14, 0); T.at(CARD + 1.6, mixb(pop(900, .8), plink(note(88), .8)), .14, 0);
T.at(CARD + 2.2, shimmer(1.2, [note(81), note(85), note(88), note(93)], .7, .09), .12, 0);

T.write('assets/hanu8_sfx.wav');
console.log('assets/hanu8_sfx.wav', END + ' s');
