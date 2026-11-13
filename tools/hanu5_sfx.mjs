// hanu5_sfx.mjs: the sound for "HANUMAN offered to carry SITA home. She said NO." (src/scenes/hanu5.js, ad 93, Hanuman
// Part 5, no voice) → assets/hanu5_sfx.wav (then loudness-normalised to assets/hanu5_mix.wav). Times are the scene's
// constants (keep them in sync). Retro synth cartoon foley as in Parts 1–4: crickets in the grove; Sita's "no"; a ring
// twinkle; pats on his back; Lanka lifted with a rumble and tiny Ravana squeaking; a "hmph"; a power-up whine, a rumble
// and a big impact for Meru; a slide-whistle shrink; a flight whoosh, a fall and a splash, fish blubs; growls, clinks
// and arrows; a sunrise swell; a jewel twinkle; a squeeze and a "ta-da". Music only as mild beds: a soft pad under
// the night, a drone and harp under Sita's two hard reasons, a music box under the ask.
import { track, tone, noise, bell, mixb, env, whoosh, plink, squeak, click, thud, shimmer, slide, chime, drum, om, wind, note, seed, rnd, clamp, splash, heart, SR } from './sfx.mjs';

const NOPE = 2.5;
const B0 = 4.4, RING = 5.2, HOLD = 6.2, C0 = 8.8, PAT = 9.5, D0 = 13.2, LIFT = 13.9, E0 = 17.6, HURT = 19.7;
const F0 = 22.0, GROW0 = 22.6, GROW1 = 25.4, G0 = 26.4, H0 = 30.8, SHRINK = 31.0;
const I0 = 35.2, SLIP = 36.6, SPLASH = 37.5, J0 = 39.8, K0 = 44.4, L0 = 48.9, M0 = 53.4, N0 = 58.4;
const O0 = 62.8, P0 = 67.4, GIVE = 68.6, Q0 = 71.8, TRY = 72.5, FIT = 74.2, R0 = 76.2, S0 = 80.6, CARD = 84.0, END = 87.6;

const T = track(END);
seed(93);
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
const HANU = 230, SITAF = 330, RAVF = 520;
const giggle = (f, amp = 1, n = 4) => voice(Array.from({ length: n }, (_, i) => [i * .11, .08, 1.25 - i * .04, .7]), f, { amp, fall: .2 });
const huh = (f, amp = 1) => voice([[0, .32, 1, .6]], f, { amp, rise: .9, fall: 0 });
const ooh = (f, amp = 1) => voice([[0, .3, 1.1, .5]], f, { amp, rise: .3, fall: 0 });
const aww = (f, amp = 1) => voice([[0, .6, 1.1, .3]], f, { amp, fall: .45 });
const eek = (f, amp = 1) => voice([[0, .35, 1.6, .9]], f, { amp, rise: .5, shake: 1 });
const sob = (f, amp = 1) => voice([[0, .22, 1.2, .3], [.3, .22, 1.15, .3], [.62, .5, 1.1, .3]], f, { amp, fall: .3, shake: 1 });
const nono = (f, amp = 1) => voice([[0, .26, 1, .3], [.34, .32, .9, .3]], f, { amp, fall: .2 });
const pop = (f = 900, amp = 1) => mixb(squeak(f * .6, f * 1.6, .07, amp), plink(f * 1.5, amp * .5));
const boing = (amp = 1, f = 220) => tone(.35, t => f * (1 + 2.2 * t) * (1 + .18 * Math.sin(t * 2 * Math.PI * 18) * Math.exp(-t * 6)), { type: 'tri', e: env.pluck(6), amp });
const pad = (dur, ms, amp = 1, a = 1.2, r = 1.4) => mixb(...ms.map((m, i) => tone(dur, t => note(m) * (1 + .003 * Math.sin(t * 2 + i)), { type: 'tri', e: env.swell(a, r), amp: amp / ms.length })));
const musicBox = f => bell(f, 1.6, { partials: [[1, 1], [3.0, .25], [5.1, .08]], k: 2.6 });
const harp = f => mixb(tone(1.2, f, { type: 'tri', e: env.pluck(3.5), amp: 1 }), tone(.6, f * 2, { e: env.pluck(8), amp: .25 }));
const cricket = amp => mixb(...[0, .09, .18].map(d => { const b = tone(.06, 4200, { e: env.pluck(30), amp }); const o = new Float32Array(Math.round((.06 + d) * SR) + b.length); o.set(b, Math.round(d * SR)); return o; }));
const crickets = (a, b, amp = .5) => { for (let t = a + .2; t < b - .3; t += .7 + rnd() * .9) T.at(t, cricket(amp), .045, rnd() * 1.4 - .7); };
const swell = (dur, ms, amp = 1) => mixb(...ms.map((m, i) => tone(dur, note(m), { type: 'tri', e: env.swell(dur * .45, dur * .5), amp: amp / ms.length })));
const drone = (dur, amp = 1) => mixb(tone(dur, note(50), { type: 'tri', e: env.swell(1.0, 1.0), amp: .5 * amp }), tone(dur, note(57), { type: 'tri', e: env.swell(1.0, 1.0), amp: .4 * amp }), tone(dur, note(62), { type: 'tri', e: env.swell(1.0, 1.0), amp: .3 * amp }));
const rumble = (dur, amp = 1) => noise(dur, { lp: 220, hp: 30, e: env.swell(dur * .4, dur * .4), amp });
const clink = (amp = 1) => mixb(bell(2600 + rnd() * 600, .3, { partials: [[1, 1], [2.7, .4]], k: 9 }), click(amp * .5));
const growl = (amp = 1) => mixb(noise(.5, { lp: 500, hp: 80, e: env.swell(.1, .3), amp: amp * .6 }), tone(.5, t => 90 + 20 * Math.sin(t * 40), { type: 'saw', e: env.swell(.1, .3), amp: amp * .3 }));
const blub = (f = 500, amp = 1) => tone(.12, t => f * (1 + 1.5 * t), { type: 'sine', e: env.pluck(14), amp });
const hmph = f => voice([[0, .14, 1.1, .5], [.18, .3, .85, .3]], f, { fall: .4 });

// ================= A · the hook: "climb on!"… "no." =================
T.at(0, pad(B0 + .3, [50, 57, 62, 66], 1, .2, .8), .06, 0);
crickets(0, B0, .4);
T.at(.2, giggle(HANU, 1, 5), .14, 0);
for (let k = 0; k < 3; k++) T.at(.7 + k * .26, mixb(thud(.35), click(.4)), .12, .1);                         // pat pat pat
T.at(NOPE - .1, nono(SITAF, 1), .16, .5);                                                                        // "no, no"
T.at(NOPE, mixb(slide(.35, 900, 120, .7), noise(.3, { hp: 800, lp: 5000, e: env.pluck(10), amp: .4 })), .14, 0);  // record scratch
T.at(NOPE + .2, mixb(pop(1100, .8), huh(HANU, 1)), .14, 0);
T.at(B0 - .3, whoosh(.6, 400, 3000), .14, 0);

// ================= B · the ring =================
T.at(B0, drone(C0 - B0 + .2, .8), .07, 0);
crickets(B0, C0, .35);
T.at(RING - .7, mixb(whoosh(.6, 1200, 3000), slide(.6, 700, 1600, .3)), .08, 0);
T.at(RING, mixb(chime(note(93), 1, 1.6), shimmer(1, [note(88), note(93), note(97)], .7, .08)), .14, .2);
T.at(RING + .1, voice([[0, .3, 1.3, .6]], SITAF, { rise: .4 }), .12, .3);                                       // a gasp
for (let k = 0; k < 6; k++) T.at(HOLD + .1 + k * .1, harp(note(64 + [0, 4, 7, 12, 16, 19][k])), .05, .3 - k * .1);
T.at(HOLD + .5, sob(SITAF, .7), .07, .3);
for (let k = 0; k < 3; k++) T.at(HOLD + .4 + k * .22, pop(800 + k * 120, .5), .07, .3);
T.at(C0 - .2, mixb(click(.4), plink(note(84), .4)), .06, 0);

// ================= C · "climb on my back!" =================
T.at(C0 + .2, talk(3.2, HANU, { gap: .15, br: .6 }), .1, -.3);
for (let k = 0; k < 4; k++) T.at(PAT + k * .2, mixb(thud(.4), click(.5)), .13, -.3);
T.at(PAT + .1, pop(1000, .6), .08, -.3);
crickets(C0, D0, .3);

// ================= D · "all of Lanka, with Ravana in it!" =================
T.at(D0 + .2, mixb(pop(900, .8), plink(note(88), .5)), .12, 0);                                                  // the bubble
T.at(D0 + .2, talk(2.2, HANU, { gap: .15, br: .6 }), .1, -.3);
T.at(LIFT - .2, tone(.3, t => 150 + 300 * t, { type: 'tri', e: env.swell(.25, .02), amp: .5 }), .08, 0);
T.at(LIFT, mixb(rumble(1.2, .9), drum(52, .8, .5)), .2, 0);
T.at(LIFT + .3, mixb(boing(.6, 260), pop(700, .6)), .1, 0);
for (let k = 0; k < 6; k++) T.at(LIFT + .4 + k * .17, voice([[0, .12, 1 + .2 * (k % 2), .8]], RAVF, { fall: .2 }), .06, .2);   // tiny Ravana's fury
T.at(LIFT + 1.6, giggle(HANU, .9, 5), .12, -.3);
crickets(D0, E0, .3);

// ================= E · "you? that small?" =================
T.at(E0 + .2, talk(1.8, SITAF, { gap: .14, br: .4 }), .1, .4);
T.at(E0 + 2.0, giggle(SITAF, .9, 5), .1, .4);
T.at(E0 + .5, mixb(pop(1100, .8), plink(note(88), .5)), .12, -.3);                                               // "!"
T.at(HURT, hmph(HANU), .14, -.3);
T.at(HURT + .1, mixb(squeak(1400, 600, .2, .6), noise(.6, { hp: 2500, lp: 8000, e: env.swell(.05, .4), amp: .4 })), .1, -.3);   // offended steam
crickets(E0, F0, .3);
T.at(F0 - .3, whoosh(.6, 400, 3000), .14, 0);

// ================= F · he grows… =================
T.at(GROW0 - .2, tone(GROW1 - GROW0 + .4, t => 120 + 60 * t * t * 9, { type: 'saw', e: env.swell(1.6, .1), amp: .3 }), .1, -.2);   // power-up whine
T.at(GROW0, rumble(GROW1 - GROW0 + .6, 1), .16, 0);
for (let k = 0; k < 6; k++) T.at(GROW0 + .3 + k * .45, mixb(drum(48 + k * 2, .5 + k * .08, .4), tone(.3, t => 200 + 80 * k + 300 * t, { type: 'tri', e: env.pluck(5), amp: .3 })), .14, -.2);   // stretchy thumps
T.at(GROW1 - .2, voice([[0, .5, .95, .3]], SITAF, { rise: .6 }), .1, .4);                                          // "ooh"

// ================= G · Meru, blazing =================
T.at(G0, mixb(drum(42, 1.4, .9), thud(1), noise(1.2, { lp: 1800, hp: 200, e: env.pluck(2), amp: .7 })), .3, 0);
T.at(G0 + .05, swell(3.6, [45, 52, 57, 64, 69], 1), .2, 0);
T.at(G0 + .1, mixb(whoosh(1.2, 300, 2000), noise(3.6, { hp: 300, lp: 2200, e: env.swell(.4, 1.2), amp: .25 })), .12, -.2);   // fire roar
for (let t = G0 + .3; t < H0 - .2; t += .07 + rnd() * .12) T.at(t, click(.3 + rnd() * .3), .05, rnd() * 1.2 - .6);   // crackle
T.at(G0 + .6, eek(SITAF * 1.4, .6), .08, .6);
T.at(G0 + 1.0, voice([[0, .8, .8, .5]], HANU * .7, { fall: .1 }), .08, -.2);                                    // a big low "hmmph!"

// ================= H · "I will not come"; he shrinks =================
T.at(H0, pad(I0 - H0, [50, 57, 62, 66], 1, .4, .6), .05, 0);
T.at(SHRINK, mixb(slide(.5, 2400, 400, .9), poofSnd()), .14, -.3);
function poofSnd() { return mixb(noise(.45, { hp: 500, lp: 4000, e: env.pluck(7), amp: 1 }), plink(1800, .4)); }
T.at(H0 + .8, talk(2.8, SITAF, { gap: .16, br: .4 }), .1, .4);
T.at(SHRINK + 2.3, mixb(pop(1100, .8), huh(HANU, 1)), .14, -.3);
crickets(H0, I0, .3);

// ================= I · reason 1: the fall =================
const badge = t0 => { T.at(t0 + .2, mixb(pop(900, .8), plink(note(88), .5)), .12, 0); T.at(t0 + .5, mixb(bell(note(84), .8), click(.4)), .12, -.3); };
badge(I0);
T.at(I0 + .3, talk(3.3, SITAF, { gap: .16, br: .4, amp: .7 }), .07, .4);
T.at(I0 + .5, whoosh(2.4, 500, 4500), .12, 0);
T.at(SLIP - .1, eek(SITAF, .9), .12, -.1);
T.at(SLIP, slide(SPLASH - SLIP, 1800, 300, .7), .1, -.1);
T.at(SPLASH, splash(1), .22, -.1);
for (let k = 0; k < 5; k++) T.at(SPLASH + .3 + k * .21, blub(400 + (k % 3) * 160, .8), .1, -.4 + k * .2);   // fish blubs
crickets(I0, J0, .25);

// ================= J · reason 2: the demons =================
badge(J0);
T.at(J0 + .3, talk(3.3, SITAF, { gap: .16, br: .4, amp: .7 }), .07, .4);
[0, .3, .6].forEach((d, i) => T.at(J0 + .6 + d, growl(1), .12, i === 0 ? -.5 : .5));
for (let k = 0; k < 4; k++) T.at(J0 + 1.2 + k * .55, clink(1), .08, k % 2 ? .4 : -.4);
for (let k = 0; k < 5; k++) T.at(J0 + 1.1 + k * .6, whoosh(.25, 3000, 800), .07, -.6 + k * .3);              // arrows
T.at(J0 + 1.5, eek(HANU, .9), .1, 0);
T.at(J0 + 2.4, mixb(squeak(2000, 2600, .08, .5), plink(note(91), .4)), .06, 0);                                // sweat

// ================= K, L · reason 3: no one but Ram; by force =================
T.at(K0, drone(L0 - K0 + 4.4, .9), .08, 0);
for (let k = 0; k < 5; k++) T.at(K0 + .4 + k * .8, harp(note(62 + [0, 4, 7, 4, 0][k])), .04, .3 - k * .1);
T.at(K0 + .5, mixb(bell(note(84), .8), click(.4)), .1, .3);
T.at(K0 + .3, talk(3.1, SITAF, { gap: .18, br: .3, amp: .6 }), .06, .4);
crickets(K0, M0, .25);
T.at(L0 + .3, talk(2.9, SITAF, { gap: .2, br: .25, amp: .55 }), .06, .4);
T.at(L0 + .6, sob(SITAF, .8), .07, .4);
T.at(L0 + 1.8, sob(HANU, .7), .06, -.3);
for (let k = 0; k < 3; k++) T.at(L0 + .6 + k * 1.1, plink(note(81 - k * 2), .4), .05, .3);

// ================= M · reason 4: Ram must come =================
badge(M0);
T.at(M0 + .3, talk(3.9, SITAF, { gap: .16, br: .45, amp: .7 }), .07, .4);
T.at(M0 + .6, swell(4.4, [55, 62, 67, 71, 74], 1), .16, 0);                                                    // the sunrise
T.at(M0 + .7, tone(1.8, t => note(50) * (1 + .01 * Math.sin(t * 30)), { type: 'saw', e: env.swell(.6, .8), amp: .25 }), .08, 0);   // a far horn
for (let k = 0; k < 8; k++) T.at(M0 + .9 + k * .38, mixb(drum(60, .4, .3), click(.3)), .08, -.2);              // marching
T.at(M0 + 2.6, shimmer(1.6, [note(81), note(85), note(88), note(93)], .8, .1), .1, -.2);

// ================= N · delighted =================
T.at(N0 + .3, mixb(pop(900, .8), chime(note(93), .8, 1.4)), .12, -.3);
T.at(N0 + .4, giggle(HANU, 1, 6), .14, -.3);
for (let k = 0; k < 3; k++) { T.at(N0 + .6 + k * .22, pop(800 + k * 120, .5), .07, -.3); T.at(N0 + 2.1 + k * .22, pop(900 + k * 120, .5), .07, -.3); }
T.at(N0 + 1.6, talk(2.0, HANU, { gap: .15, br: .6 }), .1, -.3);
T.at(N0, pad(O0 - N0, [55, 62, 67, 71], 1, .6, .6), .05, 0);
crickets(N0, O0, .3);

// ================= O · one more month =================
T.at(O0, pad(P0 - O0 + .2, [45, 52, 57, 60], 1, .8, .8), .07, 0);
T.at(O0 + .5, mixb(chime(note(88), .8, 2), shimmer(1.2, [note(88), note(93)], .5, .1)), .08, -.1);           // the moon
T.at(O0 + .3, talk(3.3, SITAF, { gap: .2, br: .25, amp: .55 }), .06, .4);
T.at(O0 + 2.5, sob(SITAF, .7), .07, .4);
T.at(O0 + 1.2, heart(.7), .06, 0); T.at(O0 + 2.2, heart(.7), .06, 0); T.at(O0 + 3.2, heart(.6), .06, 0);
crickets(O0, P0, .3);

// ================= P · the hair jewel =================
T.at(P0 + .5, mixb(chime(note(96), .8, 1.4), plink(note(100), .5)), .12, .3);
T.at(GIVE, mixb(whoosh(.9, 1200, 3000), slide(.9, 700, 1500, .3)), .08, 0);
T.at(GIVE + 1.0, mixb(chime(note(93), 1, 1.6), shimmer(1.2, [note(88), note(93), note(97)], .8, .08)), .14, -.3);
T.at(GIVE + 1.1, ooh(HANU, .9), .1, -.3);
for (let k = 0; k < 4; k++) T.at(P0 + .3 + k * .9, harp(note(67 + [0, 4, 7, 12][k])), .04, 0);
crickets(P0, Q0, .3);

// ================= Q · on his finger =================
T.at(Q0 + .2, mixb(plink(note(84), .5), click(.4)), .06, 0);
for (let k = 0; k < 7; k++) T.at(TRY + .1 + k * .22, mixb(squeak(900 + 120 * (k % 3), 1300, .12, .7), voice([[0, .15, .9 + .08 * (k % 2), .4]], HANU, { fall: .1 })), .09, 0);   // squeeze, grunt
T.at(TRY + 1.0, mixb(squeak(2000, 2600, .08, .5), plink(note(91), .4)), .06, 0);                               // sweat
T.at(FIT, mixb(pop(1200, 1), boing(.6, 300)), .2, -.2);
T.at(FIT + .1, mixb(chime(note(88), 1, 1.4), chime(note(93), .8, 1.4), shimmer(1, [note(93), note(97), note(100)], .8, .06)), .14, -.2);   // ta-da
T.at(FIT + .3, giggle(HANU, 1, 6), .14, 0);
for (let k = 0; k < 3; k++) T.at(FIT + .4 + k * .22, pop(800 + k * 120, .5), .07, .2);

// ================= ask, next, card =================
{
  const TUNE = [0, 4, 7, 4, 9, 7, 4, 2, 0, 2, 4, 7, 4, 2, 0, -3];
  let i = 0;
  for (let t = R0 + .2; t < S0 - .2; t += .34) { const m = TUNE[i++ % TUNE.length]; T.at(t, musicBox(note(81 + m)), .08, i % 2 ? -.25 : .25); }
  T.at(R0, pad(S0 - R0, [57, 64, 69, 73], 1, .6, .8), .06, 0);
}
T.at(R0 + 1.0, pop(900, .8), .14, -.4); T.at(R0 + 1.35, pop(700, .8), .14, .4);                               // YES, NO
T.at(R0 + .6, giggle(HANU, .8, 4), .1, 0);
T.at(S0, mixb(whoosh(.5, 3000, 400), slide(.6, 600, 200, .5)), .14, 0);
T.at(S0, pad(CARD - S0, [50, 57, 62, 65], 1, .4, .6), .06, 0);
for (let k = 0; k < 5; k++) T.at(S0 + .2 + k * .55, voice([[0, .45, .9 + .05 * (k % 3), .3]], 120, { fall: .2, shake: 1 }), .1, .1);   // Ravana straining
T.at(S0 + .3, rumble(2.6, .7), .1, 0);
T.at(S0 + .8, mixb(pop(1100, .8), plink(note(88), .5)), .12, 0);
T.at(CARD, whoosh(.4, 3000, 600), .14, 0);
[.3, .45, .6].forEach((d, i) => T.at(CARD + d, pop(600 + i * 100, .8), .14, -.4 + i * .4));
T.at(CARD + 1.0, chime(note(81), 1, 1.6), .14, 0); T.at(CARD + 1.6, mixb(pop(900, .8), plink(note(88), .8)), .14, 0);
T.at(CARD + 2.2, shimmer(1.2, [note(81), note(85), note(88), note(93)], .7, .09), .12, 0);

T.write('assets/hanu5_sfx.wav');
console.log('assets/hanu5_sfx.wav', END + ' s');
