// hanu10_sfx.mjs: the sound for "HANUMAN is still alive. This is what he does ALL DAY." (src/scenes/hanu10.js, ad 99,
// Hanuman Part 10, the finale, no voice) -> assets/hanu10_sfx.wav (then loudness-normalised to assets/hanu10_mix.wav).
// Times are the scene's constants (keep them in sync). Retro synth cartoon foley as in Parts 1-9, and one thread through
// the whole reel: the gandharvas' song, a plucked veena phrase in a major pentatonic (D E F# A B) that first drifts in
// from off screen in the hook, is sung in the grove and in Kimpurusha-varsha, stops when he stands to sing his own
// verse, and comes back as a music box in the child's room. Music stays mild: beds under the story, never loud.
import { track, tone, noise, bell, mixb, env, whoosh, plink, squeak, click, thud, shimmer, slide, chime, drum, note, seed, rnd, clamp, heart, chirp, SR } from './sfx.mjs';

const HEAR = 1.5, LOVE = 2.8;
const B0 = 4.4, C0 = 9.4, GONE = 10.8, WHERE = 12.0, D0 = 13.6, SEE = 15.1, PEEK = 17.0, E0 = 18.4, F0 = 23.4, G0 = 28.6, ONE = 30.1;
const H0 = 32.8, H2 = 34.9, I0 = 37.0, REACH = 40.4, J0 = 42.4, RISE = 43.0, SING = 44.2, K0 = 46.0, HUG = 48.5, L0 = 51.8, M0 = 55.6, SEEN = 57.3;
const N0 = 61.2, PEEKN = 62.2, O0 = 65.6, P0 = 70.2, CARD = 73.8, END = 77.4;

const T = track(END);
seed(99);
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
const HANU = 230, RAMF = 150, BHIF = 125, APSF = 380, GANF = 250, DADIF = 270, KIDF = 420;
const giggle = (f, amp = 1, n = 4) => voice(Array.from({ length: n }, (_, i) => [i * .11, .08, 1.25 - i * .04, .7]), f, { amp, fall: .2 });
const huh = (f, amp = 1) => voice([[0, .32, 1, .6]], f, { amp, rise: .9, fall: 0 });
const ooh = (f, amp = 1) => voice([[0, .3, 1.1, .5]], f, { amp, rise: .3, fall: 0 });
const pop = (f = 900, amp = 1) => mixb(squeak(f * .6, f * 1.6, .07, amp), plink(f * 1.5, amp * .5));
const boing = (amp = 1, f = 220) => tone(.35, t => f * (1 + 2.2 * t) * (1 + .18 * Math.sin(t * 2 * Math.PI * 18) * Math.exp(-t * 6)), { type: 'tri', e: env.pluck(6), amp });
const pad = (dur, ms, amp = 1, a = 1.2, r = 1.4) => mixb(...ms.map((m, i) => tone(dur, t => note(m) * (1 + .003 * Math.sin(t * 2 + i)), { type: 'tri', e: env.swell(a, r), amp: amp / ms.length })));
const swell = (dur, ms, amp = 1) => mixb(...ms.map(m => tone(dur, note(m), { type: 'tri', e: env.swell(dur * .45, dur * .5), amp: amp / ms.length })));
const musicBox = f => bell(f, 1.6, { partials: [[1, 1], [3.0, .25], [5.1, .08]], k: 2.6 });
const hpop = (t0, pan = 0) => { for (let k = 0; k < 3; k++) T.at(t0 + k * .22, pop(800 + k * 120, .5), .07, pan); };
const step = (t0, n, gap = .22, pan = 0, amp = .5) => { for (let k = 0; k < n; k++) T.at(t0 + k * gap, mixb(click(amp), drum(60, amp * .6, .2)), .08, pan + k * .04); };
const tweets = (t0, dur, pan = 0) => { for (let t = t0; t < t0 + dur; t += .28) T.at(t, mixb(chirp(.6), squeak(2600, 3400, .08, .4)), .05, pan + (rnd() - .5) * .3); };
const sob = (t0, f = 150, pan = 0, amp = .7) => T.at(t0, voice([[0, .22, 1.1, .4], [.26, .3, .9, .3]], f, { amp, fall: .3, shake: 1 }), .08, pan);
// the veena: a plucked string with a little meend (the pitch settles from just below)
const veena = (m, amp = 1, len = 1.1) => mixb(tone(len, t => note(m) * (1 - .03 * Math.exp(-t * 18)), { type: 'tri', e: env.pluck(3.2), amp }), tone(len * .6, note(m) * 2, { e: env.pluck(7), amp: amp * .3 }), tone(.05, note(m) * 3, { e: env.pluck(60), amp: amp * .25 }));
// the song (D major pentatonic): one eight-note phrase, .34 s a note; played a..b, panned, with the tanpura under it
const SONG = [74, 71, 69, 71, 74, 76, 78, 74, 71, 69, 66, 69, 71, 69, 66, 62];
const song = (a, b, gain = .07, pan = 0, i0 = 0, stepT = .34) => { let i = i0; for (let t = a; t < b - .1; t += stepT) T.at(t, veena(SONG[i++ % SONG.length], 1), gain, pan + (i % 2 ? -.12 : .12)); return i; };
const tanpura = (a, b, gain = .05) => T.at(a, pad(b - a, [50, 57, 62], 1, .8, .8), gain, 0);
// a sung line over it: held vowels on the phrase's long notes
const sung = (a, b, f, pan = 0, gain = .06) => { let i = 0; for (let t = a; t < b - .5; t += .68) { const m = SONG[(i++ * 2) % SONG.length] - 74; T.at(t, voice([[0, .6, Math.pow(2, m / 12), .55]], f, { amp: .8, fall: 0 }), gain, pan); } };

// ================= A · the hook: he sits; a song drifts in; he lights up =================
T.at(0, pad(B0, [50, 57, 62, 66], 1, .3, .8), .07, 0);
T.at(.15, mixb(pop(1000, .6), chime(note(86), .5, 1.4)), .09, 0);
song(HEAR - .5, B0 - .3, .09, .5);
T.at(HEAR, mixb(pop(900, .8), huh(HANU, .7)), .11, 0);
T.at(LOVE, mixb(giggle(HANU, .8, 5), shimmer(1.6, [note(86), note(90), note(93), note(98)], .8, .07)), .11, 0);
hpop(LOVE + .25, 0);
T.at(B0 - .3, whoosh(.5, 3000, 500), .11, 0);

// ================= B · the promise in Ayodhya's court =================
T.at(B0, pad(C0 - B0 + .2, [57, 64, 69, 73], 1, .6, .8), .07, 0);
T.at(B0 + .6, talk(3.5, HANU, { gap: .22, br: .6 }), .09, .3);
T.at(B0 + 1.3, mixb(pop(900, .8), shimmer(2.2, [note(81), note(88), note(93)], .7, .08)), .1, -.1);
T.at(B0 + 3.3, ooh(RAMF, .6), .08, -.4); hpop(B0 + 3.5, -.4);
T.at(C0 - .3, whoosh(.5, 2600, 400), .11, 0);

// ================= C · Ram leaves the earth; he stays =================
T.at(C0, pad(D0 - C0 + .2, [50, 57, 62, 65], 1, .6, .8), .08, 0);
T.at(C0 + .5, slide(GONE - C0 - .5, 300, 1200, .5), .08, -.3);
T.at(GONE, mixb(chime(note(93), .9, 2.2), noise(.5, { hp: 800, lp: 7000, e: env.pluck(7), amp: .5 }), shimmer(1.8, [note(88), note(93), note(96), note(100)], .7, .07)), .12, -.3);
sob(GONE + .4, HANU * .8, .3, .6);
T.at(WHERE, mixb(pop(800, .8), huh(HANU, .6)), .1, .2);
T.at(D0 - .3, whoosh(.5, 500, 3000), .11, 0);

// ================= D · the plantain grove: Bhima finds him asleep =================
tweets(D0, E0 - D0, -.2);
for (let t = D0 + .25; t < PEEK - .3; t += 1.85) { T.at(t, mixb(noise(.75, { hp: 150, lp: 700, e: env.swell(.3, .3), amp: .8 }), tone(.75, t2 => 90 + 14 * Math.sin(t2 * 60), { type: 'saw', e: env.swell(.3, .3), amp: .25 })), .08, .4); T.at(t + .9, slide(.7, 500, 900, .35), .05, .4); }
step(D0 + .25, 5, .22, -.6);
T.at(SEE, mixb(pop(1000, .9), huh(BHIF, .8)), .11, -.4);
T.at(SEE + 1.0, squeak(300, 380, .25, .4), .06, -.3);
T.at(PEEK, mixb(pop(1200, .8), plink(note(88), .8), boing(.5, 300)), .11, .4);
T.at(E0 - .3, whoosh(.4, 600, 2600, .7), .08, 0);

// ================= E · "here gandharvas and apsaras sing his story to me" =================
tweets(E0, 1.6, -.2);
T.at(E0 + .3, talk(2.0, HANU, { gap: .22, br: .6 }), .09, .4);
T.at(E0 + .9, shimmer(1.6, [note(86), note(90), note(93), note(98)], .7, .1), .09, 0);
T.at(E0 + 1.7, ooh(BHIF, .7), .08, -.3);
tanpura(E0 + 1.6, F0 + .2);
let si = song(E0 + 1.9, F0 - .1, .08, -.2);
sung(E0 + 2.2, F0, APSF, .5, .05);
hpop(E0 + 2.9, .4);
T.at(F0 - .3, whoosh(.5, 3000, 600), .1, 0);

// ================= F · the Bhagavata: Kimpurusha-varsha =================
tanpura(F0, G0 + .2, .055);
si = song(F0 + .2, G0 - .1, .085, 0, si);
sung(F0 + .4, G0 - .2, GANF, -.4, .05); sung(F0 + .74, G0 - .2, GANF * 1.5, .4, .04);
T.at(F0 + 3.3, chime(note(86), .7, 1.8), .08, 0); hpop(F0 + 3.6, 0);
T.at(G0 - .3, whoosh(.5, 3000, 500), .11, 0);

// ================= G · two books, two addresses, one answer =================
T.at(G0, pad(H0 - G0 + .2, [57, 64, 69, 73], 1, .4, .6), .07, 0);
T.at(G0 + .2, pop(700, .9), .12, -.4); T.at(G0 + .5, plink(note(81), .8), .09, -.4);
T.at(G0 + .8, pop(850, .9), .12, .4); T.at(G0 + 1.1, plink(note(85), .8), .09, .4);
T.at(ONE, mixb(chime(note(88), 1, 2), shimmer(1.6, [note(81), note(85), note(88), note(93)], .8, .07)), .12, 0);
song(ONE + .1, H0 - .3, .07, 0, 0);
T.at(ONE + .4, giggle(HANU, .7, 4), .09, 0); hpop(ONE + .5, 0);
T.at(H0 - .3, whoosh(.5, 3000, 500), .11, 0);

// ================= H · he lived half of this story himself =================
tanpura(H0, J0 + .2, .05);
si = song(H0 + .2, I0 - .1, .07, -.5, 0);
T.at(H0 + .1, pop(800, .8), .1, -.2);
T.at(H0 + .5, whoosh(1.2, 400, 2400, .8), .08, -.2);                         // the leap, in the song
T.at(H0 + .9, mixb(giggle(HANU, .9, 5), ooh(HANU, .6)), .1, .3);              // he cheers himself on
for (const d of [1.2, 1.5, 1.8]) T.at(H0 + d, pop(1000, .5), .07, .3);
T.at(H2, mixb(noise(.9, { hp: 400, lp: 4000, e: env.swell(.1, .6), amp: .6 }), pop(1100, .9), huh(HANU, .9)), .11, .2);   // the tail on fire: he checks his own
for (let t = H2 + .1; t < I0 - .3; t += .09 + rnd() * .08) T.at(t, click(.3 + rnd() * .3), .04, -.3 + rnd() * .2);
for (const d of [.5, .95, 1.4]) T.at(H2 + d, noise(.28, { hp: 900, lp: 5000, e: env.hann(), amp: .7 }), .07, .4);      // puff, puff, puff

// ================= I · Ram's embrace in the song; "your story will blow my longing away" =================
T.at(I0, swell(J0 - I0 + .3, [57, 64, 69, 73, 76], 1), .11, 0);
si = song(I0 + .2, J0 - .4, .055, -.5, 8, .68);
T.at(I0 + .7, mixb(chime(note(88), .9, 2.4), shimmer(2, [note(81), note(88), note(93)], .6, .09)), .11, -.2);
sob(I0 + 1.3, HANU * .8, .3, .6);
T.at(I0 + 2.0, heart(.8), .09, .3); T.at(I0 + 2.9, heart(.8), .09, .3);
T.at(REACH, mixb(ooh(HANU, .6), shimmer(1.6, [note(86), note(90), note(93), note(98)], .7, .08)), .09, .2); hpop(REACH + .25, .2);
T.at(J0 - .3, whoosh(.5, 3000, 500), .1, 0);

// ================= J · and then he sings too =================
song(J0 + .05, RISE - .05, .07, 0, 0);
T.at(RISE, mixb(boing(.5, 260), pop(700, .6)), .09, 0);                        // he gets up; the veenas stop
T.at(RISE + .35, voice([[0, .1, 1, .3], [.16, .14, .9, .3]], HANU * .7, { amp: .8, fall: .2 }), .09, 0);   // ahem
T.at(SING, pad(K0 - SING + .2, [50, 57, 62, 66, 69], 1, .2, .5), .09, 0);
T.at(SING, chime(note(86), .9, 2), .1, 0);
[0, 4, 7, 9, 7].forEach((m, i) => T.at(SING + .05 + i * .34, voice([[0, .3, Math.pow(2, m / 12), .6]], HANU, { amp: .9, fall: 0 }), .09, 0));
T.at(K0 - .3, whoosh(.5, 600, 3000), .1, 0);

// ================= K · "only forest monkeys, and Ram made us his friends" =================
T.at(K0, pad(HUG - K0 + .2, [50, 57, 60, 65], 1, .5, .4), .07, 0);
[0, 4, 7, 9, 7, 4, 7].forEach((m, i) => T.at(K0 + .15 + i * .34, voice([[0, .3, Math.pow(2, (m - 5) / 12), .5]], HANU, { amp: .7, fall: 0 }), .06, .2));
T.at(K0 + .8, boing(.5, 200), .07, -.6); T.at(K0 + 1.5, squeak(500, 380, .2, .4), .06, .6);
T.at(HUG, mixb(chime(note(86), 1, 2.8), thud(.4), shimmer(2.4, [note(86), note(90), note(93), note(98), note(102)], .9, .07)), .13, 0);
T.at(HUG, swell(L0 - HUG + .3, [62, 69, 74, 78, 81], 1), .13, 0);
T.at(HUG + .3, mixb(giggle(HANU, .7, 4), giggle(HANU * 1.4, .5, 5)), .09, 0);
hpop(HUG + .35, 0); hpop(HUG + 1.5, 0);
T.at(L0 - .3, whoosh(.5, 3000, 500), .11, 0);

// ================= L · god or demon, monkey or human =================
T.at(L0, pad(M0 - L0 + .2, [57, 64, 69, 73], 1, .4, .6), .07, 0);
[0, 1, 2, 3].forEach(i => T.at(L0 + .25 + i * .32, mixb(pop(600 + i * 130, .9), plink(note(81 + [0, 4, 7, 12][i]), .8)), .11, -.6 + i * .4));
T.at(L0 + 2.2, mixb(chime(note(93), .9, 1.8), shimmer(1.4, [note(81), note(85), note(88), note(93)], .8, .07)), .11, 0);
T.at(L0 + 2.3, giggle(KIDF, .6, 4), .07, .6);
T.at(M0 - .3, whoosh(.5, 2400, 300, .8), .09, 0);

// ================= M · the child's room: an old prayer =================
T.at(M0, pad(N0 - M0 + .2, [50, 57, 62, 66], 1, .6, .8), .08, 0);
for (let t = M0 + .2; t < N0 - .2; t += .5 + rnd() * .2) T.at(t, mixb(chirp(.25), chirp(.2)), .02, -.7 + rnd() * .3);   // crickets
{ let i = 0; for (let t = M0 + .2; t < N0 - .4; t += .68) T.at(t, musicBox(note(SONG[(i++ * 2) % SONG.length] + 12)), .06, i % 2 ? -.2 : .2); }
T.at(M0 + .3, talk(1.4, DADIF, { gap: .26, br: .4, amp: .8 }), .07, -.5);
T.at(M0 + 2.4, ooh(KIDF, .6), .07, 0);
T.at(M0 + 3.2, talk(1.6, DADIF, { gap: .26, br: .4, amp: .8 }), .06, -.5);
T.at(SEEN, mixb(chime(note(86), .9, 2.8), shimmer(2.2, [note(86), note(90), note(93), note(98)], .7, .1)), .11, .5);
T.at(SEEN + 1.0, heart(.7), .08, .5); hpop(SEEN + 1.6, .5);

// ================= N · guess who was listening with you =================
T.at(N0, pad(O0 - N0 + .2, [57, 64, 69, 73], 1, .4, .6), .07, 0);
T.at(N0 + .15, mixb(click(.6), plink(note(93), .7)), .09, 0);
T.at(PEEKN, mixb(boing(.8, 260), pop(900, .8)), .12, 0);
T.at(PEEKN + .5, giggle(HANU, .8, 5), .1, 0);
for (const d of [.9, 1.1, 1.3]) T.at(PEEKN + d, pop(1100, .5), .07, .3);
hpop(PEEKN + 1.4, -.4);
T.at(O0 - .3, whoosh(.5, 600, 3000), .11, 0);

// ================= O, P · the ask; ten parts; the card =================
T.at(O0, pad(P0 - O0 + .2, [50, 57, 62, 66], 1, .5, .6), .07, 0);
{ let i = 0; for (let t = O0 + .2; t < P0 - .3; t += .34) T.at(t, musicBox(note(SONG[i++ % SONG.length] + 12)), .07, i % 2 ? -.25 : .25); }
for (let t = O0 + .6; t < P0 - .4; t += .6) T.at(t, mixb(pop(900 + rnd() * 300, .7), plink(note(93), .5)), .08, .4);
T.at(O0 + 1.5, giggle(HANU, .8, 5), .09, 0); hpop(O0 + 1.6, -.4); hpop(O0 + 3.2, -.4);
T.at(P0 - .3, whoosh(.5, 3000, 500), .1, 0);
T.at(P0, pad(CARD - P0 + .2, [62, 69, 74, 78], 1, .3, .5), .08, 0);
for (let i = 0; i < 10; i++) T.at(P0 + .2 + i * .08, plink(note(74 + [0, 2, 4, 7, 9, 12, 14, 16, 19, 21][i]), .8), .09, -.6 + i * .13);
T.at(P0 + .5, mixb(giggle(HANU * 1.5, .7, 5), giggle(HANU, .6, 4)), .09, 0);
T.at(P0 + 1.2, mixb(chime(note(93), 1, 2), shimmer(1.6, [note(86), note(90), note(93), note(98)], .8, .08)), .12, 0); hpop(P0 + 1.3, 0);
T.at(CARD, whoosh(.4, 3000, 600), .14, 0);
[.3, .45, .6].forEach((d, i) => T.at(CARD + d, pop(600 + i * 100, .8), .14, -.4 + i * .4));
T.at(CARD + 1.0, chime(note(81), 1, 1.6), .14, 0); T.at(CARD + 1.6, mixb(pop(900, .8), plink(note(88), .8)), .14, 0);
T.at(CARD + 2.2, shimmer(1.2, [note(81), note(85), note(88), note(93)], .7, .09), .12, 0);

T.write('assets/hanu10_sfx.wav');
console.log('assets/hanu10_sfx.wav', END + ' s');
