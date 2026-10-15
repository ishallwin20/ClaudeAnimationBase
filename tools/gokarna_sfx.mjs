// gokarna_sfx.mjs: the sound effects for "RAVANA needed a TOILET." (src/scenes/gokarna.js) → assets/gokarna_sfx.wav.
// Times are the scene's constants (keep them in sync). The signatures: the bathroom dance (squeaky juttis, a nervous
// trill), Kailash's wind and Shiva's bell, Airavata's panicked trumpet, the heat (cicadas), ten gulps rising in pitch,
// the GRRRGL, the waves at Gokarna, the cheeky "boing" of the slipping moustache, three dings VERY fast, ten heads
// yelling WAIT, the BOOM of the linga, the strain and the stone's creak, a cow's moo, the BONK, the temple bell.
import { track, tone, noise, bell, mixb, env, whoosh, rumble, plink, clang, click, thud, crunch, crinkle, shimmer, slide, drone, gurgle, squeak, chirp, wind, om, note, seed, rnd, clamp, lerp, SR } from './sfx.mjs';

const TEASE = 2.7, B0 = 5.6;
const PRAY = 5.7, GIVE = 7.0, ATMA = 8.4, RULE = 10.6, FAKE = 12.0, CATCH = 12.5, C0 = 14.0;
const PANIC = 14.1, WALK = 16.6, POT = 17.3, WINK = 17.75, GULP0 = 18.25, GSTEP = .13, D0 = 19.6;
const TEN = 19.7, GURGLE = 20.3, WAVE = 20.6, DANCE = 21.2, NOT = 23.2, LOOK = 23.8, E0 = 26.0;
const BOY = 26.1, TOTALLY = 28.4, SLIP = 29.0, SUSPECT = 29.6, KID = 30.7, HAND = 31.4, F0 = 33.0;
const DEAL = 33.1, RUN = 33.9, HIDE = 34.6, COUNT = 35.5, N1 = 35.8, N2 = 36.0, N3 = 36.2, WAIT = 36.35, DOWN = 36.6, BOOM = 36.85, STAY = 37.9, G0 = 40.2;
const PULL = 40.3, GRIP = 40.5, TWIST = 42.4, EAR = 42.9, FLICK = 43.6, H0 = 46.2;
const ANGRY = 46.3, BONK = 47.1, TODAY = 48.6, I0 = 52.2;
const ASK = 52.3, WIPE = 55.5;
const CARD = 55.8, CARD_CAP = 55.9, COVERS = 56.1, PRICE = 56.8, LOGO = 57.1, PILL = 57.4, FOLLOW = 57.8, END = 60.3;
const pan = i => -.75 + i * .17;   // head i's place across the screen

const T = track(END);
seed(17);
const lp = (b, fc) => { let l = 0; const a = 1 - Math.exp(-2 * Math.PI * fc / SR); for (let i = 0; i < b.length; i++) { l += a * (b[i] - l); b[i] = l; } return b; };
const add = (o, b, s0, g = 1) => { const s = Math.round(s0 * SR); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j] * g; return o; };
// a buzzy cartoon voice (from ad 13): syllables [start, dur, pitch ×, brightness 0..1]
function voice(syl, f0, { amp = 1, growl = 0, fall = .1 } = {}) {
  const D = Math.max(...syl.map(([s, d]) => s + d)) + .1, o = new Float32Array(Math.round(D * SR));
  let ph = 0, l = 0;
  for (let i = 0; i < o.length; i++) {
    const t = i / SR, s = syl.find(([a, d]) => t >= a && t < a + d);
    if (!s) { l *= .995; o[i] = 0; continue; }
    const [a, d, pm, br] = s, k = (t - a) / d, e = clamp(k / .12) * clamp((1 - k) / .25);
    ph += f0 * pm * (1.04 - fall * k) * (1 + .01 * Math.sin(t * 40) + growl * .03 * Math.sin(t * 190)) / SR;
    const x = 2 * (ph - Math.floor(ph)) - 1, fc = 500 + br * 2200 * Math.sin(Math.PI * clamp(k * 1.3)), al = 1 - Math.exp(-2 * Math.PI * fc / SR);
    l += al * (x * e - l); o[i] = l * amp;
  }
  return o;
}
const ting = (m, amp = 1) => bell(note(m), 1.2, { amp });
const boing = (amp = 1, f = 1) => tone(.45, t => f * (300 + 500 * Math.sin(Math.PI * clamp(t / .3))) * (1 + .08 * Math.sin(t * 2 * Math.PI * 22)), { type: 'tri', e: env.ad(.005, .15), amp });
const impactBoom = (amp = 1) => mixb(thud(amp), crunch(amp * .5), noise(.6, { lp: 900, hp: 40, e: env.ad(.005, .22), brown: true, amp: amp * .9 }), clang(note(50), amp * .25));
const pop = (amp = 1, f = 1) => mixb(click(amp), tone(.07, t => f * (500 + 2600 * t / .07), { e: env.pluck(40), amp: amp * .7 }));
const laugh = (n, f0, amp = 1) => voice(Array.from({ length: n }, (_, i) => [i * .17, .12, 1 - i * .04, .7]), f0, { amp, growl: 1.2 });
const gulp = (f, amp = 1) => mixb(lp(tone(.14, t => f * (1.4 - 2.2 * t), { type: 'tri', e: env.hann(), amp }), 1400), tone(.05, t => f * 3, { e: env.pluck(60), amp: amp * .3 }));
const squeakStep = (f, amp = 1) => mixb(squeak(f, f * 1.5, .07, amp * .6), click(amp * .4));
const step = (amp = 1) => mixb(thud(amp * .5), noise(.06, { hp: 300, lp: 2500, e: env.pluck(50), amp: amp * .4 }));
const sandStep = (amp = 1) => noise(.09, { hp: 1200, lp: 6000, e: env.pluck(35), amp });
const waves = (d, amp = 1) => { const n = noise(d, { lp: 1200, hp: 80, e: env.swell(1, 1), amp }); for (let i = 0; i < n.length; i++) n[i] *= .45 + .55 * Math.pow(Math.sin(i / SR * Math.PI / 3.2), 2); return n; };
const cicadas = (d, amp = 1) => { const n = noise(d, { hp: 4200, lp: 9000, e: env.swell(.4, .4), amp }); for (let i = 0; i < n.length; i++) n[i] *= .5 + .5 * Math.sin(i / SR * 2 * Math.PI * 38); return n; };
const moo = (amp = 1) => lp(voice([[0, .75, 1, .35]], 120, { amp, fall: .35, growl: .8 }), 900);
const hiss = (d, amp = 1) => noise(d, { hp: 3500, lp: 9000, e: env.swell(.05, .3), amp });
const trumpet = (amp = 1) => lp(tone(.8, t => 420 + 380 * Math.sin(Math.PI * clamp(t / .5)) + 30 * Math.sin(t * 60), { type: 'saw', e: env.swell(.05, .25), amp }), 2600);
const chatter = (d, amp = 1) => { const o = new Float32Array(Math.round((d + .1) * SR)); for (let k = 0; k * .045 < d; k++) add(o, click(amp), k * .045); return o; };
const trill = (d, amp = 1) => tone(d, t => 880 + 60 * Math.sign(Math.sin(t * 2 * Math.PI * 9)), { type: 'tri', e: env.swell(.1, .2), amp });

// ---- A · the hook: squeaky dancing feet, a nervous trill, the embarrassed slide
for (let t = .05; t < B0 - .3; t += 1 / 4.6) T.at(t, squeakStep(t % .43 < .22 ? 1200 : 1400, .5), .3, (t % .43 < .22) ? -.3 : .3);
T.at(0, trill(B0 - .5, .4), .12, 0);
T.at(.3, voice([[0, .25, 1.3, .6], [.35, .3, 1.2, .5], [.8, .4, 1.15, .4]], 300, { amp: .7 }), .22, 0);   // a whimper
T.at(TEASE + .55, slide(.5, 900, 300, 1), .25, 0);
T.at(B0 - .32, whoosh(.4, 500, 4500, 1), .5, 0);

// ---- B · Kailash: wind, the drone, the gift's shimmer, ATMALINGA's bell, the rule, the fake drop
T.at(B0, wind(C0 - B0, 0, 1), .35, 0);
T.at(B0, om(C0 - B0, 98, 1), .12, 0);
T.at(GIVE, shimmer(1.6, [72, 76, 79, 84, 88].map(note), 1, .18), .3, -.2);
T.at(ATMA, bell(note(57), 3.5, { amp: 1 }), .45, 0);
T.at(ATMA + .05, shimmer(1.2, [84, 88, 91, 96].map(note), 1, .1), .25, .3);
for (let i = 0; i < 9; i++) T.at(ATMA + i * .03, pop(.6, 1 + i * .05), .15, pan(i + 1));
T.at(RULE, ting(81, 1), .3, -.4);
for (let k = 0; k < 5; k++) T.at(RULE + .25 + k * .22, click(1), .25, -.4);   // the wagging finger: tick, tick
T.at(FAKE, slide(.22, 900, 250, 1), .4, .5);
T.at(FAKE + .05, voice([[0, .25, 1.6, .9]], 260, { amp: 1 }), .4, .2);   // the gasp
T.at(CATCH, mixb(thud(.6), plink(note(76), .8)), .45, .2);
T.at(CATCH + .25, laugh(4, 330, 1), .3, .7);
T.at(C0 - .3, whoosh(.5, 400, 3000, 1), .45, 0);

// ---- C1 · the gods panic
T.at(C0 + .05, trumpet(1), .4, 0);
T.at(C0 + .1, chatter(2.2, 1), .25, .1);
for (let k = 0; k < 9; k++) T.at(C0 + .1 + k * .26, whoosh(.18, 300, 1200, .8), .12, k % 2 ? .5 : -.5);   // ear flaps
T.at(C0 + 1.1, voice([[0, .18, 1.5, .8], [.24, .18, 1.6, .8], [.48, .3, 1.7, .9]], 240, { amp: .8 }), .25, 0);
T.at(WALK - .3, whoosh(.45, 3500, 400, 1), .45, 0);

// ---- C2 · the hot road: cicadas, footsteps, panting; the pot, Varuna's ting, ten gulps
T.at(WALK, cicadas(E0 - WALK, 1), .1, 0);
for (let t = WALK + .1; t < D0; t += .3125) T.at(t, step(1), .35, 0);
T.at(WALK + .2, voice([[0, .15, 1, .3], [.3, .15, .95, .3], [.6, .15, 1, .3]], 180, { amp: .6 }), .2, 0);
T.at(POT, mixb(clang(note(86), .5), click(.8)), .25, .4);
T.at(POT + .3, whoosh(.3, 600, 2000, .6), .2, .4);
T.at(WINK, mixb(ting(98, 1), tone(.08, t => 1200 + 3000 * t, { e: env.pluck(40), amp: .6 })), .35, .3);
for (let i = 0; i < 10; i++) T.at(GULP0 + i * GSTEP + .02, gulp(180 + i * 18, 1), .55, pan(i));
T.at(GULP0 + 10 * GSTEP, whoosh(.4, 800, 4000, .8), .3, .8);
T.at(GULP0 + 10 * GSTEP + .45, clang(note(81), .6), .15, 1);

// ---- D · ten heads, one bladder
T.at(GURGLE, gurgle(1.2, 1), .6, 0);
T.at(GURGLE, lp(tone(1.0, t => 70 + 25 * Math.sin(t * 30), { type: 'saw', e: env.swell(.05, .3), amp: 1 }), 400), .35, 0);
for (let i = 1; i < 10; i++) T.at(WAVE + i * .08, mixb(pop(.7, 1 + i * .07), voice([[0, .1, 1.5 + i * .04, .8]], 260, { amp: .6 })), .25, pan(i));
for (let t = DANCE; t < E0 - .3; t += 1 / 4.6) T.at(t, squeakStep(Math.floor((t - DANCE) * 4.6) % 2 ? 1200 : 1450, .5), .3, Math.floor((t - DANCE) * 4.6) % 2 ? -.3 : .3);
T.at(DANCE, trill(E0 - DANCE - .3, .5), .14, 0);
for (const k of [0, .6, 1.2]) T.at(LOOK + k, whoosh(.12, 600, 1600, .6), .12, k === .6 ? -.5 : 0);
T.at(LOOK + 1.6, voice([[0, .3, 1.3, .5], [.35, .35, 1.2, .4], [.75, .5, 1.1, .3]], 320, { amp: .8 }), .3, 0);   // the whimper
T.at(E0 - .3, whoosh(.5, 400, 3000, 1), .45, 0);

// ---- E · the coast: waves, gulls; the cowherd boy's light steps; the moustache; "KID! Hold this!"
T.at(E0, waves(G0 + 6 - E0, 1), .3, 0);
for (const t of [E0 + .4, E0 + 4.3, E0 + 9.7, E0 + 15.5]) { T.at(t, chirp(.8), .12, .6); T.at(t + .12, chirp(.7), .1, .6); }
for (let t = BOY; t < BOY + 1.6; t += .29) T.at(t, mixb(sandStep(.7), plink(note(84), .3)), .22, .6);
T.at(TOTALLY, ting(91, 1), .3, .5);
T.at(SLIP, slide(.18, 800, 300, 1), .3, .5);
T.at(SLIP + .38, boing(1, 1.2), .3, .5);
T.at(SUSPECT, voice([[0, .5, .8, .3]], 160, { amp: .8, fall: -.1 }), .25, 0);   // "hmmm?"
T.at(KID, voice([[0, .14, 1.4, .9], [.2, .14, 1.4, .9], [.42, .16, 1.3, .8], [.62, .14, 1.2, .8], [.82, .3, 1.5, .9]], 210, { amp: 1, growl: .8 }), .4, -.3);
T.at(HAND, whoosh(.35, 500, 2500, 1), .4, .3);
T.at(HAND + .45, mixb(thud(.6), voice([[0, .15, 1.8, .7]], 380, { amp: .7 })), .4, .5);   // the boy's "oof"

// ---- F · three counts, VERY fast
T.at(DEAL, voice([[0, .14, 1, .8], [.18, .14, 1.1, .8], [.36, .14, 1.05, .8], [.6, .16, 1.15, .8], [.84, .14, 1.0, .8], [1.05, .14, 1.1, .8], [1.3, .3, 1.2, .9]], 420, { amp: .8 }), .3, .5);
T.at(RUN, whoosh(.55, 600, 5000, 1), .5, -.5);
for (let t = RUN; t < HIDE; t += .09) T.at(t, sandStep(.8), .25, -.5);
T.at(HIDE, crinkle(.6, 1), .35, -.5);
T.at(HIDE + .2, voice([[0, .7, 1.0, .3]], 200, { amp: .7, fall: .3 }), .25, -.5);   // aaah
[76, 79, 81, 79, 76].forEach((m, k) => T.at(HIDE + .9 + k * .14, tone(.12, note(m), { e: env.swell(.01, .05), amp: 1 }), .1, -.5));   // whistling
[N1, N2, N3].forEach((n, j) => { T.at(n, bell(note(88 + j * 4), .8, { amp: 1 }), .4, .4); T.at(n, click(1), .3, .4); });
for (let i = 0; i < 10; i++) T.at(WAIT + i * .015, voice([[0, .18, 1.3, .9], [.22, .35, 1.6, 1]], 200 + i * 22, { amp: .5, growl: .5 }), .2, pan(i) - .3);
T.at(DOWN, whoosh(.25, 1500, 400, .7), .3, .3);
T.at(BOOM, impactBoom(1), .9, .2);
T.at(BOOM, rumble(1.2, 1), .4, 0);
T.at(BOOM + .05, shimmer(1.5, [72, 79, 84, 88, 91].map(note), 1, .08), .3, .2);
for (const k of [0, .25, .5, .75]) T.at(STAY + .6 + k, mixb(click(1), noise(.05, { hp: 800, lp: 5000, e: env.pluck(60), amp: .6 })), .3, .6);   // dusting his hands

// ---- G · twenty arms; the cow's ear
T.at(G0 - .5, whoosh(.5, 600, 4500, 1), .45, -.3);
for (let i = 0; i < 20; i++) T.at(GRIP + rnd() * .5, click(.6), .15, .2);
T.at(GRIP + .3, voice([[0, 1.6, .9, .5]], 110, { amp: 1, growl: 2, fall: -.15 }), .3, 0);   // nnnngh
T.at(GRIP + .3, rumble(1.7, 1), .3, 0);
T.at(TWIST, mixb(squeak(300, 900, .35, 1), crunch(.7)), .45, .2);
T.at(TWIST + .3, boing(.8, .7), .25, .2);
T.at(FLICK, mixb(click(1), whoosh(.1, 1500, 4000, .7)), .3, -.6);
T.at(FLICK + .1, moo(1), .4, -.6);

// ---- H · the BONK
T.at(ANGRY, hiss(1.2, 1), .25, -.2);
T.at(ANGRY + .05, voice([[0, .7, .8, .6]], 120, { amp: 1, growl: 2 }), .3, -.2);
T.at(BONK - .3, whoosh(.3, 400, 3000, 1), .4, .3);
T.at(BONK, mixb(clang(note(64), .8), thud(1), tone(.12, t => 900 - 3000 * t, { type: 'tri', e: env.pluck(25), amp: .8 })), .7, .4);
T.at(BONK + .05, boing(1, .9), .35, .4);
T.at(BONK + .1, shimmer(1, [91, 96, 91, 96].map(note), 1, .12), .2, .4);
T.at(BONK + .2, voice([[0, .35, 1.9, .8]], 400, { amp: .8, fall: .4 }), .3, .4);   // the boy's "ow!"
T.at(BONK + .1, voice([[0, .12, 1.3, .7], [.16, .2, 1.7, .9]], 260, { amp: .6 }), .25, -.7);   // SLEEPY: "hm?!"
T.at(TODAY - .25, whoosh(.3, 400, 2500, .8), .3, 0);

// ---- H2 · the sanctum: the temple bell, the drone, the lamps
T.at(TODAY, bell(note(55), 4, { amp: 1 }), .6, 0);
T.at(TODAY + .02, bell(note(67), 3, { amp: .6 }), .3, 0);
T.at(TODAY, om(I0 - TODAY + .4, 110, 1), .2, 0);
T.at(TODAY + 1.4, shimmer(1.2, [84, 88, 91].map(note), 1, .2), .15, -.1);
T.at(I0 - .3, whoosh(.5, 400, 3000, 1), .4, 0);

// ---- I · the ask: waves at sunset, the fan, the far grumbles
T.at(I0, waves(WIPE - I0 + .6, 1), .3, 0);
for (let t = I0 + .2; t < WIPE; t += .35) T.at(t, whoosh(.15, 500, 1500, .5), .08, .4);
T.at(ASK + .3, shimmer(1.2, [79, 84, 88].map(note), 1, .12), .2, 0);
T.at(WIPE, whoosh(.6, 400, 3500, 1), .45, 0);

// ---- the card
T.at(CARD_CAP, plink(note(79)), .25, 0);
T.at(LOGO, plink(note(84)), .25, 0);
[0, .12, .24].forEach((d, i) => T.at(COVERS + d, plink(note(86 + i * 3)), .28, -.4 + i * .4));
T.at(PRICE, ting(96), .3, 0);
T.at(PILL, mixb(click(1), plink(note(91))), .35, 0);
T.at(FOLLOW, shimmer(1.5, [84, 88, 91, 96].map(note), .4, .15), .2, 0);

T.write('assets/gokarna_sfx.wav');
