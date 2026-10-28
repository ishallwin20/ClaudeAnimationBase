// pearls_sfx.mjs: the sound for "Why did HANUMAN JI bite Maa Sita's PEARLS?" (src/scenes/pearls.js, ad 59, no voice)
// → assets/pearls_sfx.wav. Times are the scene's constants (keep them in sync). SFX carry the reel: cute retro cartoon
// foley (pearl plinks and glints, crunches and munches, boings and womps for the hopeful vanaras, buzzy cartoon voices,
// gasps, the bonk, the hush). Music only where it's needed: a soft tanpura and pad from the moment he grips his chest to
// the end of the hug, nothing anywhere else. Quiet beds: palace birds and murmur in the court, bells at the mandir.
import { track, tone, noise, bell, mixb, env, whoosh, plink, squeak, click, thud, shimmer, slide, crunch, crinkle, chime, drum, heart, laughter, note, seed, rnd, clamp, SR } from './sfx.mjs';

const SNIFF = 1.3, BITE0 = 2.2, PEER0 = 3.0, TOSS0 = 4.4, ZOOM = 5.9, B0 = 6.6;
const OFF = 7.6, LK1 = 10.6, LK2 = 11.3, LK3 = 12.0, LK4 = 12.7, RAMSAY = 13.9, WALK = 16.6, PLACE = 18.4, SHINE = 19.8, C0 = 23.4;
const EYE1 = 25.0, HUH = 25.9, D0 = 27.0;
const SNAP = 27.4, BITE1 = 29.5, BITE2 = 30.7, BONK = 32.0, BITE3 = 33.0, FAST = 34.0, STAND = 35.7, MUMBLE = 38.6, GULP = 39.4;
const NORAM = 41.6, TOSS = 43.1, MOCK = 44.7, HUSH = 47.7, E0 = 48.6;
const GRIP = 49.5, OPEN = 50.3, PUSH = 51.7, WAVE = 54.1, F0 = 56.3;
const TURBAN = 56.8, G0 = 59.7;
const HUG = 61.5, HEAL = 62.1, GIVE = 63.6, PEEK = 64.7, H0 = 66.7;
const PWINK = H0 + 5.6, I0 = 73.9, WINK = 76.1, CARD = 78.1, END = 85.1;
const BITES = [BITE1, BITE2, BITE3, FAST, FAST + .35, FAST + .7, FAST + 1.05];
const tossT = k => BITES[k] + (k < 3 ? .88 : .2);

const T = track(END);
seed(59);
const PENTA = [0, 2, 4, 7, 9];
const pent = (base, i) => note(base + 12 * Math.floor(i / 5) + PENTA[i % 5]);
// a buzzy cartoon voice: syllables [start, dur, pitch ×, brightness 0..1] (as in ad 55 and the Ramayan parts)
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
const talk = (dur, f, { gap = .16, amp = 1, br = .5, fall = .1, shake = 0 } = {}) =>
  voice(Array.from({ length: Math.max(1, Math.floor(dur / gap)) }, (_, i) => [i * gap, gap * .72, 1 + .14 * Math.sin(i * 2.3) - (i % 5 === 4 ? .12 : 0), br]), f, { amp, fall, shake });
const HAN = 230, RAM = 150, SITA = 340, ELDER = 125, VAN = 300;
const huh = (f = HAN, amp = 1) => voice([[0, .32, 1, .6]], f, { amp, rise: .9, fall: 0 });
const ooh = (f, amp = 1, d = .5) => voice([[0, d, 1, .25]], f, { amp, rise: .15, fall: .05 });
const aww = (f, amp = 1) => voice([[0, .6, 1.1, .3]], f, { amp, fall: .45 });
const pop = (f = 900, amp = 1) => mixb(squeak(f * .6, f * 1.6, .07, amp), plink(f * 1.5, amp * .5));
const glint = (amp = 1) => mixb(bell(note(100), .6, { partials: [[1, 1], [2.7, .3]], k: 7, amp }), bell(note(105), .5, { partials: [[1, 1]], k: 9, amp: amp * .6 }));
const pearlTick = (i, amp = 1) => mixb(plink(note(91 + (i * 5) % 12), amp), click(amp * .25));   // a pearl landing on stone
const boing = (amp = 1) => tone(.35, t => 220 * (1 + 2.2 * t) * (1 + .18 * Math.sin(t * 2 * Math.PI * 18) * Math.exp(-t * 6)), { type: 'tri', e: env.pluck(6), amp });
const womp = (amp = 1) => tone(.55, t => 330 * Math.pow(.55, t * 2), { type: 'saw', e: env.swell(.02, .3), fm: t => .01 * Math.sin(t * 2 * Math.PI * 6), amp });
const bonk = amp => mixb(tone(.18, t => 520 * Math.exp(-t * 9) + 180, { type: 'tri', e: env.pluck(14), amp }), click(amp * .5));
const munch = amp => mixb(crunch(amp * .6), tone(.08, t => 160 - 300 * t, { e: env.pluck(30), amp: amp * .4 }));
const gulp = amp => mixb(tone(.22, t => 260 - 160 * t / .22, { e: env.swell(.02, .1), amp }), tone(.1, 90, { e: env.pluck(30), amp: amp * .6 }));
const sniff = amp => noise(.12, { lp: 3000, hp: 900, e: env.swell(.03, .06), amp });
const step = (amp = 1) => noise(.07, { lp: 900, hp: 120, e: env.pluck(40), amp });
const bird = (f, amp = 1) => mixb(squeak(f, f * 1.4, .07, amp), squeak(f * 1.3, f * 1.1, .06, amp * .7));
const gasp = (amp = 1) => noise(.45, { lp: t => 1200 + 3000 * t, hp: 300, e: env.swell(.15, .12), amp });
const add = (o, b, s0, g = 1) => { const s = Math.round(s0 * SR); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j] * g; return o; };
const lp = (b, fc) => { let l = 0; const a = 1 - Math.exp(-2 * Math.PI * fc / SR); for (let i = 0; i < b.length; i++) { l += a * (b[i] - l); b[i] = l; } return b; };
const tanpura = (dur, root = 50, amp = 1) => { const o = new Float32Array(Math.round((dur + 2.5) * SR)); const ns = [root + 7, root + 12, root + 12, root]; for (let k = 0; k * .9 < dur; k++) add(o, lp(tone(2.4, note(ns[k % 4]), { type: 'saw', e: env.ad(.05, .9), amp }), 1800), k * .9); return o; };
const pad = (dur, ms, amp = 1) => mixb(...ms.map((m, i) => tone(dur, t => note(m) * (1 + .003 * Math.sin(t * 2 + i)), { type: 'tri', e: env.swell(1.2, 1.4), amp: amp / ms.length })));
const murmur = (dur, amp = 1) => { const o = new Float32Array(Math.round((dur + 1) * SR)); for (let k = 0; k * .5 < dur; k++) add(o, talk(.45, 130 + (k % 5) * 22, { gap: .14, amp: amp * (.5 + .25 * (k % 3)), br: .25 }), k * .5); return o; };
const templeBell = (amp = 1) => bell(note(88), 2.8, { partials: [[1, 1], [2.4, .55], [3.9, .3], [5.6, .15]], k: 1.2, amp });

// ================= A · the hook =================
T.at(0, shimmer(1.2, [note(93), note(98), note(100)], .5, .1), .1, .2);              // the pearl twinkles
T.at(.15, voice([[0, .14, 1.3, .6], [.17, .14, 1.4, .6], [.34, .2, 1.5, .7]], HAN), .12, 0);   // a curious "hm-hm-hmm"
T.at(.82, click(.5), .06, .2);                                                       // the blink
T.at(SNIFF + .35, sniff(1), .3, .1); T.at(SNIFF + .55, sniff(1), .3, .1); T.at(SNIFF + .75, sniff(1), .35, .1);
T.at(BITE0 - .28, pop(700, 1), .25, 0);                                               // in it goes
T.at(BITE0, crunch(1), .6, 0); T.at(BITE0 + .03, thud(.4), .2, 0);
for (let i = 0; i < 3; i++) T.at(BITE0 + .2 + i * .14, munch(.7), .3, 0);
T.at(PEER0 - .05, squeak(500, 900, .14, .8), .12, .2);
T.at(PEER0 + .1, plink(note(84), 1), .2, .4);                                         // "?"
T.at(PEER0 + .2, huh(HAN, 1), .22, .2);
T.at(TOSS0, whoosh(.35, 1200, 4000), .2, .5);
[TOSS0 + .85, TOSS0 + 1.05, TOSS0 + 1.2, TOSS0 + 1.32].forEach((t, i) => T.at(t, pearlTick(i, .8 - i * .15), .14, .7));   // off screen: plink plink plink
T.at(TOSS0 + .4, voice([[0, .3, 1, .3]], HAN * .9, { fall: .4 }), .14, 0);           // "hmph"
T.at(ZOOM, shimmer(.8, [note(84), note(88), note(91), note(96)], .6, .1), .16, 0);
T.at(ZOOM + .1, whoosh(.6, 500, 5000), .3, 0);

// ================= B · the court: the gift =================
T.at(B0, mixb(glint(1), chime(note(96), .6, 1.2)), .2, 0);
T.at(B0, murmur(WALK - B0, .5), .05, .2);
for (let k = 0; k < 10; k++) T.at(B0 + .5 + k * 1.6, bird(2600 + (k % 3) * 380, .5), .045, k % 2 ? .7 : -.7);
T.at(OFF - .2, mixb(crinkle(.5, .6), shimmer(.7, [note(91), note(95), note(98)], .5, .08)), .16, .5);   // the necklace lifted off
T.at(OFF + .55, glint(1), .22, .5);
T.at(OFF + .75, shimmer(.6, [note(98), note(103)], .4, .1), .12, .5);
for (const [t, i] of [[LK1, 0], [LK3, 1]]) {   // she looks their way: boing, "ooh!"; Hanuman looks behind him, "huh?"
  T.at(t, boing(1), .22, -.6);
  T.at(t + .08, ooh(VAN * 1.1, 1, .4), .14, -.7); T.at(t + .14, ooh(VAN * 1.3, 1, .38), .11, -.5);
  T.at(t + .2, huh(HAN, 1), .2, -.3);
  T.at(t + .22, squeak(700, 1100, .1, .6), .1, -.3);
}
for (const t of [LK2, LK4]) { T.at(t, womp(1), .14, -.6); T.at(t + .05, aww(VAN, .8), .08, -.6); }   // …she looks at Ram: womp
T.at(RAMSAY, talk(2.0, RAM, { gap: .17, br: .4 }), .2, .2);
T.at(RAMSAY + 2.1, chime(note(84), .6, 1.5), .1, .2);
for (let k = 0; k < 6; k++) T.at(WALK + .1 + k * .25, step(.6), .14, .4 - k * .1);
T.at(WALK + .2, mixb(plink(note(88), 1), squeak(600, 1300, .12, .7)), .22, -.2);   // "!"
T.at(WALK + .9, slide(.3, 300, 900, .8), .2, -.2);                                 // hop up
T.at(WALK + 1.35, mixb(thud(.4), boing(.5)), .2, -.2);
for (let i = 0; i < 8; i++) T.at(PLACE + i * .045, pearlTick(i, .7), .1, -.1);     // into his hands
T.at(PLACE + .55, aww(HAN * 1.15, 1), .2, -.2);                                     // clutched to his chest
T.at(PLACE + .7, mixb(pop(1100, .8), pop(1300, .6)), .16, -.2);                    // hearts
T.at(PLACE + 1.2, mixb(crinkle(.4, .8), shimmer(.6, [note(96), note(100), note(103)], .5, .05)), .2, -.2);   // it's on
T.at(SHINE, shimmer(2.0, [note(79), note(84), note(88), note(91), note(96)], .6, .14), .2, 0);
T.at(SHINE + .1, bell(note(72), 2.5, { partials: [[1, 1], [2, .3], [3, .1]], k: 1.2, amp: .8 }), .12, 0);
T.at(SHINE + .5, aww(VAN * 1.1, 1), .14, -.6); T.at(SHINE + .6, aww(VAN * 1.35, 1), .1, -.5);
T.at(C0 - .3, whoosh(.6, 600, 3000), .22, 0);

// ================= C · the bridge =================
T.at(C0 + .3, voice([[0, .3, 1.1, .3], [.35, .3, 1.25, .3], [.7, .3, 1.15, .3], [1.05, .4, 1.3, .3]], HAN, { fall: .05 }), .1, 0);   // a happy hum
for (let i = 0; i < 4; i++) T.at(C0 + .4 + i * .5, crinkle(.12, .5), .06, i % 2 ? .3 : -.3);   // pearls clinking as he rocks
T.at(EYE1 - .1, squeak(500, 800, .12, .7), .12, .2);
T.at(HUH, plink(note(84), 1), .2, .4);
T.at(HUH + .1, huh(HAN * .95, 1), .22, .2);

// ================= D · the biting =================
T.at(D0, murmur(STAND - D0, .45), .045, .2);
T.at(D0, slide(.4, 180, 420, .6), .1, -.2);                                         // the string strains
T.at(SNAP - .02, mixb(tone(.25, t => 900 * Math.exp(-t * 14) + 200, { type: 'tri', e: env.pluck(14), amp: 1 }), click(1)), .4, -.2);   // TWANG
for (let i = 0; i < 15; i++) T.at(SNAP + .35 + rnd() * .5, pearlTick(i, .5 + rnd() * .4), .1, -.5 + rnd() * .5);   // pearls into his lap
BITES.forEach((tb, k) => {
  const slow = k < 3;
  T.at(tb - .08, pop(650 + k * 40, .7), .14, -.3);
  T.at(tb, crunch(1), slow ? .55 : .45, -.3);
  for (let i = 0; i < (slow ? 2 : 1); i++) T.at(tb + .12 + i * .12, munch(.6), .22, -.3);
  if (slow) { T.at(tb + .5, squeak(500, 900, .12, .7), .1, -.2); T.at(tb + .55, plink(note(84), .8), .12, -.2); }
  T.at(tossT(k), whoosh(.3, 1500, 4500), .14, 0);
  if (k !== 1) T.at(tossT(k) + .7, mixb(pearlTick(k, .7), pearlTick(k + 3, .5)), .1, -.5);
});
T.at(BITE1 + .1, gasp(1), .3, .2);                                                  // the court gasps
for (const [d, f] of [[.15, 150], [.2, 220], [.28, 330], [.3, 280]]) T.at(BITE1 + d, ooh(f, 1, .55), .09, .3 - f / 600);
T.at(BONK, mixb(bonk(1), boing(.6)), .45, .5);
T.at(BONK + .1, shimmer(.6, [note(91), note(96), note(91), note(96)], .5, .1), .12, .5);   // stars
T.at(BONK + .25, voice([[0, .25, 1.4, .8], [.3, .3, 1.2, .6]], ELDER, { fall: .3 }), .22, .5);   // "oof!"
T.at(FAST - .1, slide(1.4, 400, 900, .4), .06, -.3);                                // cheeks filling
T.at(STAND - .2, mixb(slide(.25, 300, 1600, .8), click(.6)), .2, .4);
T.at(STAND, talk(2.2, ELDER, { gap: .15, br: .8, amp: 1, shake: .6 }), .3, .4);    // "Hanuman! Those pearls are priceless!"
T.at(MUMBLE, voice(Array.from({ length: 5 }, (_, i) => [i * .15, .11, 1 + .12 * Math.sin(i * 2), .15]), HAN * .9), .22, -.2);   // "mmf mmf"
T.at(GULP, gulp(1), .4, -.2);
T.at(GULP + .25, plink(note(96), .6), .1, -.2);
T.at(GULP + .35, talk(1.8, HAN, { gap: .15, br: .55 }), .26, -.2);                 // "…I'm looking for Ram inside them."
T.at(NORAM, talk(2.4, HAN, { gap: .16, br: .5 }), .26, -.2);                       // "No Ram inside? Then it's just a stone."
T.at(TOSS, whoosh(.35, 1200, 4000), .18, -.4);
[TOSS + .75, TOSS + .92, TOSS + 1.05].forEach((t, i) => T.at(t, pearlTick(i, .7 - i * .15), .12, -.6));
T.at(MOCK, talk(1.6, ELDER * 1.05, { gap: .16, br: .5, fall: .2 }), .3, .4);        // "Oh? Then is Ram inside YOU?"
T.at(MOCK + 1.2, laughter(1.6, 1), .07, .5);                                       // the snicker
T.at(MOCK + 1.25, voice([[0, .1, 1.3, .7], [.14, .1, 1.35, .7], [.28, .1, 1.3, .7], [.42, .12, 1.4, .7]], 260), .12, .6);
// HUSH: nothing at all, then a heartbeat
T.at(HUSH + .6, heart(1), .35, 0);

// ================= E · the heart (music from GRIP) =================
T.at(E0 + .1, heart(1), .3, 0);
T.at(GRIP - .5, tanpura(G0 + 4.5 - GRIP, 50, .6), .07, 0);
T.at(GRIP - .3, pad(H0 - GRIP + .3, [62, 69, 74, 78], 1), .09, 0);
T.at(GRIP, squeak(400, 300, .2, .5), .06, 0);
T.at(OPEN - .1, slide(.5, 300, 700, .4), .08, 0);                                   // the little doors
T.at(OPEN, mixb(whoosh(.8, 400, 6000), shimmer(1.8, [note(72), note(79), note(84), note(88), note(91), note(96)], .8, .09)), .26, 0);
T.at(OPEN + .05, bell(note(60), 3, { partials: [[1, 1], [2, .35], [3, .15], [4.2, .06]], k: 1, amp: 1 }), .2, 0);
T.at(PUSH, shimmer(1.6, [note(84), note(88), note(91), note(96)], .5, .2), .12, 0);
for (let i = 0; i < 6; i++) T.at(OPEN + .8 + i * .55, pop(1300 + i * 80, .5), .06, rnd() * .8 - .4);   // the drifting hearts
T.at(WAVE, voice([[0, .14, 1.5, .8], [.16, .2, 1.7, .8]], SITA * 1.3), .14, .2);     // "hi!" (tiny)
T.at(WAVE + .08, voice([[0, .14, 1.5, .8], [.16, .2, 1.65, .8]], RAM * 1.6), .12, -.2);
for (let i = 0; i < 4; i++) T.at(WAVE + .3 + i * .22, plink(pent(91, i), .5), .08, i % 2 ? .3 : -.3);

// ================= F · the court, wide =================
T.at(F0, gasp(1), .3, .2);
for (const [d, f] of [[.05, 140], [.1, 210], [.15, 300], [.2, 260], [.25, 180]]) T.at(F0 + d, ooh(f, 1, .7), .08, .4 - f / 500);
T.at(TURBAN, mixb(pop(500, 1), slide(.4, 400, 1400, .6)), .3, .5);
T.at(TURBAN + .8, mixb(thud(.6), boing(.4)), .2, .4);
T.at(TURBAN + 1.0, voice([[0, .3, 1.2, .4], [.35, .4, .95, .3]], ELDER, { fall: .3 }), .14, .5);   // a sheepish "ah… hm."
for (let i = 0; i < 3; i++) T.at(F0 + .9 + i * .5, voice([[0, .18, 1.2, .2], [.2, .25, 1, .2]], VAN * (1 + i * .1), { fall: .4 }), .08, -.6);   // happy sniffles

// ================= G · the hug =================
for (let k = 0; k < 6; k++) T.at(G0 + .1 + k * .28, step(.5), .12, .4 - k * .08);
T.at(HUG, mixb(chime(note(84), .8, 2), pop(1200, .5)), .16, 0);
T.at(HUG + .2, mixb(pop(1000, .6), pop(1250, .5)), .1, 0);
T.at(HEAL, shimmer(1.2, [note(88), note(91), note(96), note(100)], .6, .12), .2, -.1);
T.at(HEAL + .6, slide(.6, 600, 300, .3), .05, -.1);
T.at(GIVE, plink(note(96), .9), .16, 0); T.at(GIVE + .05, glint(.8), .12, 0);
T.at(PEEK - .2, squeak(500, 900, .12, .7), .1, -.2);
T.at(PEEK + .35, mixb(pop(1000, 1), chime(note(96), .7, 1)), .22, -.2);              // the heart in the pearl
T.at(PEEK + .6, voice([[0, .12, 1.4, .7], [.15, .12, 1.5, .7], [.3, .2, 1.6, .8]], HAN), .18, -.2);   // a giggle
T.at(H0 - .3, whoosh(.6, 600, 3000), .2, 0);

// ================= H · the picture at home =================
T.at(H0 + .3, templeBell(1), .14, .6);
T.at(H0 + 4.2, templeBell(.8), .1, .6);
for (let k = 0; k < 8; k++) T.at(H0 + .5 + k * .8, crinkle(.2, .3), .02, k % 2 ? -.5 : .5);   // the diyas
T.at(PWINK, mixb(plink(note(96), .8), chime(note(103), .5, .8)), .18, .2);
T.at(I0 - .3, whoosh(.6, 600, 3000), .2, 0);

// ================= I · the ask =================
for (let i = 0; i < 7; i++) T.at(I0 + .65 + i * .45, drum(110, .6, .15), .1, -.1);   // pat pat on his heart
T.at(I0 + .3, chime(note(84), .7, 2), .1, 0);
T.at(WINK, mixb(plink(note(96), .8), chime(note(103), .5, .8)), .2, .2);
T.at(CARD - .3, whoosh(.6, 600, 3000), .2, 0);

// ================= J · the card =================
T.at(CARD + .1, shimmer(1.6, [note(79), note(84), note(88)], .6, .1), .14, 0);
for (let i = 0; i < 3; i++) T.at(CARD + .3 + i * .15, plink(pent(84, i * 2), .7), .14, -.3 + i * .3);
T.at(CARD + 1.1, chime(note(88), .6, 1.2), .14, 0);
T.at(CARD + 1.7, mixb(plink(note(96), .7), click(.4)), .16, 0);
T.at(CARD + 2.1, chime(note(91), .5, 1.5), .1, 0);

T.write('assets/pearls_sfx.wav');
