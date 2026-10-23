// rp3_sfx.mjs: the sound for Ramayan Part 3 (src/scenes/rp3.js, no voice) → assets/rp3_sfx.wav, then levelled to
// -16 LUFS → assets/rp3_mix.wav. Times come from src/scenes/rp3_tl.js. Retro cartoon foley in the manner of the
// Shumbha and Bal Hanuman sun reels (buzzy cartoon voices, coconut hooves, a harp glissando into the flashback, a
// cartoon trumpet for the imagined elephant) over quiet beds (crickets, rain, river, wind, birds). The only music is a
// soft tanpura with a few veena notes under the three sad scenes (the secret, the truth and curse, the death), the way
// the Sindoor reel's beds sat. The lamp going out cuts everything to a second and more of silence.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, plink, click, thud, shimmer, slide, squeak, note, seed, rnd, clamp, chirp, wind, drum, heart, conch, wingbeat, crackle, thunder, gurgle, splash, SR } from './sfx.mjs';

const TL = runInNewContext(readFileSync('src/scenes/rp3_tl.js', 'utf8') + '\n;TL');
const { B0, C0, D0, E0, F0, G0, H0, I0, J0, K0, END, KILLED, HIM, WEPT, RAN, ALONE, SECRET, SKILL, BYSOUND, SOUND, ELEPH, SHOT, BOY,
  ASCETIC, TAKE, DIED, QUIET, TRUTH, CURSED, GRIEV, NOSON, CRYING, VERY, CROW, GRASS, CARD } = TL;

const T = track(END);
seed(35);
const lp = (b, fc) => { let l = 0; const a = 1 - Math.exp(-2 * Math.PI * fc / SR); for (let i = 0; i < b.length; i++) { l += a * (b[i] - l); b[i] = l; } return b; };
const add = (o, b, s0, g = 1) => { const s = Math.round(s0 * SR); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j] * g; return o; };
// a buzzy cartoon voice: syllables [start, dur, pitch ×, brightness 0..1]
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
// n syllables of mumbled talk over dur s
const talk = (dur, f, { gap = .16, amp = 1, br = .5, fall = .1, shake = 0 } = {}) =>
  voice(Array.from({ length: Math.max(1, Math.floor(dur / gap)) }, (_, i) => [i * gap, gap * .72, 1 + .14 * Math.sin(i * 2.3) - (i % 5 === 4 ? .12 : 0), br]), f, { amp, fall, shake });
const sob = (n, f, amp = 1) => voice(Array.from({ length: n }, (_, i) => [i * .32, .26, 1.1 - i * .04, .5]), f, { amp, fall: .35, shake: 1 });
const KING = 150, YOUNG = 175, BOYV = 300, OLD = 135, MUM = 250, SITA = 330;

const pop = (amp = 1, f = 1) => mixb(click(amp), tone(.07, t => f * (500 + 2600 * t / .07), { e: env.pluck(40), amp: amp * .7 }), noise(.05, { lp: 2500, hp: 300, e: env.pluck(60), amp: amp * .5 }));
// coconut-shell hooves: a hollow two-tone clop
const clop = (amp = 1, f = 1) => mixb(tone(.06, 820 * f, { type: 'tri', e: env.pluck(70), amp }), tone(.05, 560 * f, { e: env.pluck(80), amp: amp * .7 }), noise(.03, { hp: 1500, lp: 5000, e: env.pluck(120), amp: amp * .4 }));
const creak = (amp = 1, f = 1) => { const n = tone(.35, t => f * (190 + 60 * Math.sin(t * 9)), { type: 'saw', e: env.hann(), amp }); let g = 1; for (let i = 0; i < n.length; i++) { if (i % 300 === 0) g = .2 + rnd() * .8; n[i] *= g; } return lp(n, 1600); };
const step = (amp = 1) => noise(.07, { lp: 900, hp: 120, e: env.pluck(40), amp });
const squelch = (amp = 1) => mixb(step(amp), noise(.12, { lp: 2500, hp: 600, e: env.ad(.01, .04), amp: amp * .5 }));
const twang = (amp = 1) => mixb(tone(.5, t => 98 * (1 + .25 * Math.exp(-t * 30)), { type: 'tri', e: env.pluck(7), fm: t => .02 * Math.sin(t * 2 * Math.PI * 9), amp }), tone(.3, 196, { e: env.pluck(12), amp: amp * .4 }), click(amp * .6));
const bowDraw = (dur, amp = 1) => mixb(creak(amp, .8), slide(dur, 180, 420, amp * .35));
const thunk = (amp = 1) => mixb(thud(amp), tone(.12, t => 420 - 1600 * t, { type: 'tri', e: env.pluck(30), amp: amp * .5 }));
const cricket = (dur, amp = 1) => { const o = new Float32Array(Math.round(dur * SR)); for (let k = 0; k * .7 < dur - .3; k++) for (let j = 0; j < 3; j++) add(o, tone(.03, 4300 + rnd() * 300, { e: env.hann(), amp }), k * .7 + j * .045 + rnd() * .08); return o; };
const ribbit = (amp = 1) => mixb(voice([[0, .09, 1, .2], [.11, .12, .9, .2]], 95, { amp, fall: .4 }));
const trumpet = (amp = 1) => lp(tone(.8, t => (330 + 240 * Math.sin(Math.PI * clamp(t / .6))) * (1 + .02 * Math.sin(t * 2 * Math.PI * 7)), { type: 'saw', e: env.swell(.05, .25), amp }), 2600);
const caw = (amp = 1) => lp(mixb(tone(.28, t => 640 - 340 * t, { type: 'saw', e: env.ad(.01, .1), amp }), tone(.28, t => 690 - 340 * t, { type: 'saw', e: env.ad(.01, .1), amp: amp * .7 })), 3000);
const bird = (f, amp = 1) => mixb(squeak(f, f * 1.4, .07, amp), squeak(f * 1.3, f * 1.1, .06, amp * .7));
const question = (amp = 1) => tone(.4, t => 300 + 500 * (t / .4) ** 2, { type: 'tri', e: env.ad(.01, .2), amp });   // "hm?" slide up
// a harp glissando up (into the flashback) or down
const harp = (up = true, amp = 1) => { const sc = [62, 64, 66, 69, 71, 74, 76, 78, 81, 83, 86, 88], o = new Float32Array(Math.round(2.2 * SR)); (up ? sc : [...sc].reverse()).forEach((m, i) => add(o, bell(note(m), 1.4, { partials: [[1, 1], [2, .3], [3, .1]], k: 2.6, amp }), i * .045)); return o; };
// the bed's music: a tanpura (Pa Sa Sa low-Sa plucked over a held low Sa, D as Sa) and a veena note
const SA = 50;
const tanpura = (dur, amp = 1) => {
  const o = mixb(tone(dur, note(SA - 12), { type: 'tri', e: env.swell(1.2, 1.2), amp: .25 * amp }), tone(dur, note(SA - 5), { e: env.swell(1.2, 1.2), amp: .12 * amp }));
  const pl = [SA - 5, SA, SA, SA - 12];
  for (let k = 0; k * .6 < dur - 1.2; k++) add(o, bell(note(pl[k % 4]), 2.2, { partials: [[1, 1], [2, .5], [3, .3], [4, .2]], k: 1.1, amp: .22 * amp }), k * .6, Math.min(1, (dur - k * .6) / 1.5));
  return o;
};
const veena = (m, amp = 1) => mixb(bell(note(m), 1.6, { partials: [[1, 1], [2, .6], [3, .35], [5, .12]], k: 2.4, amp }), noise(.02, { hp: 2000, lp: 6000, e: env.pluck(80), amp: amp * .3 }));
// rain and river with a level curve: g(t) in 0..1 over the bed's own time
const rainBed = (dur, g = () => 1) => noise(dur, { hp: 1500, lp: 7000, e: (t, D) => clamp(t / .6) * clamp((D - t) / .6) * g(t), amp: .5 });
const riverBed = (dur, g = () => 1) => noise(dur, { lp: 1400, hp: 150, e: (t, D) => clamp(t / .6) * clamp((D - t) / .6) * g(t), amp: .4 });
const room = (a, b, g = .05) => T.at(a, noise(b - a, { lp: 500, hp: 60, e: env.swell(.4, .4), amp: .5 }), g, 0);

// ---- A: the hook (night)
room(0, B0 + .2, .06);
T.at(0, cricket(B0 + .2, .5), .05, .5);
T.at(.05, bowDraw(KILLED - .1, .8), .14, -.2);
T.at(KILLED, twang(1), .3, -.2);
T.at(KILLED + .02, whoosh(.4, 1200, 4500), .3, -.6);
T.at(HIM - .05, mixb(drum(44, 1, 1.2), noise(1, { brown: true, lp: 300, e: env.pluck(3), amp: .7 })), .3, 0);   // the red light
T.at(B0 - .3, whoosh(.6, 500, 3000), .2, 0);
// ---- B: the ident
T.at(B0, conch(1.6, 311, .7), .14, 0);
T.at(B0 + .35, pop(.8), .22, 0); T.at(B0 + .7, pop(.6, 1.2), .18, 0);
T.at(C0 - .3, whoosh(.6, 400, 2600), .18, 0);
// ---- C: the leaving (day, the gate)
room(C0, D0, .05);
for (let k = 0; k * .9 < D0 - C0 - .4; k++) T.at(C0 + .2 + k * .9, talk(.8, 180 + (k % 4) * 30, { amp: .7, br: .25, fall: .3 }), .035, -.6 + (k % 3) * .25);   // the crowd murmurs
T.at(WEPT, sob(5, 220, .8), .06, -.6); T.at(WEPT + .4, sob(4, 260, .8), .05, -.4);
for (let k = 0; k * .26 < D0 - C0 - .3; k++) { const p = (k * .26) / (D0 - C0); T.at(C0 + .4 + k * .26, clop(.9, k % 2 ? 1 : .88), .12 * (1 - p * .7), clamp(-.1 + p * 1.2, -1, .9)); }   // the horse trots off right
for (let k = 0; k * .55 < D0 - C0 - .5; k++) { const p = (k * .55) / (D0 - C0); T.at(C0 + .6 + k * .55, creak(.8, k % 2 ? 1 : 1.12), .07 * (1 - p * .7), clamp(p * 1.1, -1, .9)); }   // the wheels
for (let k = 0; k * .2 < D0 - .8 - RAN; k++) T.at(RAN - .3 + k * .2, step(.9), .14, -.3 + k * .03);   // the old king runs
T.at(RAN, voice([[0, .9, 1.2, .5], [1.1, 1.1, 1.1, .4]], KING, { fall: .25, shake: 1 }), .1, -.2);   // his cry
T.at(D0 - .6, thud(.7), .22, 0);   // he drops to his knees
T.at(D0 - .3, whoosh(.6, 2600, 500), .16, 0);
// ---- D: the return (dusk)
T.at(D0, wind(E0 - D0, 2, .6), .08, 0);
for (let k = 0; k * .45 < ALONE - .2 - D0; k++) { const p = k * .45 / (ALONE - D0); T.at(D0 + .1 + k * .45, clop(.8, k % 2 ? .92 : .82), .06 + .06 * p, .8 - p * .8); }   // slow hooves, in from the right
T.at(ALONE - .2, voice([[0, .5, 1, .3]], 900, { amp: .5, fall: -.2 }), .04, 0);   // the horse snorts (soft)
T.at(ALONE + .1, noise(.9, { hp: 300, lp: 1800, e: env.hann(), amp: .7 }), .07, 0);   // Sumantra's sigh
T.at(ALONE + .2, slide(1.1, 330, 220, .5), .08, 0);   // a small falling "womp"
// ---- E: the night (the secret)
room(E0, F0, .05);
T.at(E0, cricket(F0 - E0, .5), .035, .6);
T.at(E0, crackle(F0 - E0, .3), .04, -.7);   // the lamp
T.at(E0 + .2, tanpura(F0 - E0 + .6, .7), .06, 0);
T.at(E0 + .3, talk(F0 - E0 - .8, KING, { amp: .6, br: .3, gap: .2 }), .06, .1);   // the king, low
T.at(SECRET - .25, pop(.7), .16, -.4);   // the bubble
T.at(F0 - .9, harp(true, .7), .12, 0);   // into the flashback
// ---- F: the flashback at the Sarayu (rain; it falls away while he listens; it rushes back with the shot)
const fDur = G0 - F0 + .3;
const duck = t => { const tt = t + F0; return tt < SKILL ? 1 : tt < SKILL + .6 ? 1 - .75 * (tt - SKILL) / .6 : tt < SHOT ? .25 : 1; };
T.at(F0, rainBed(fDur, duck), .11, 0);
T.at(F0, riverBed(fDur, duck), .08, .2);
T.at(F0 + .6, thunder(2, .4), .07, -.5);
T.at(F0 + .3, ribbit(.8), .06, .6); T.at(F0 + .9, ribbit(.7), .05, .7);
T.at(BYSOUND - .2, shimmer(1.2, [note(84), note(88), note(91)], .5, .12), .08, -.4);   // the listening rings
for (let k = 0; k * .55 < SHOT - SOUND - .3; k++) T.at(SOUND + k * .55, gurgle(.4, .8), .16, .5);   // glug-glug: the pot filling
T.at(ELEPH - .05, trumpet(.8), .09, .45);   // what he imagines
T.at(ELEPH + .2, bowDraw(SHOT - ELEPH - .3, .8), .12, -.4);
T.at(SHOT, twang(1), .3, -.4);
T.at(SHOT + .02, whoosh(.36, 1200, 4500), .3, 0);
T.at(SHOT + .34, thunk(.8), .22, .5);
T.at(BOY, voice([[0, .6, 1.5, .9]], BOYV, { fall: .35, amp: 1 }), .14, .5);   // the boy's cry
T.at(BOY + .15, mixb(thud(.6), splash(.5)), .12, .55);   // the pot falls and spills
for (let k = 0; k * .18 < ASCETIC - BOY - .5; k++) T.at(BOY + .4 + k * .18, squelch(.9), .1, -.2 + k * .07);   // he runs through the mud
T.at(ASCETIC - .2, thud(.5), .14, .2);   // kneels
for (let k = 0, tt = TAKE - .6; tt < DIED - .1; k++) { T.at(tt, heart(.8), .14 * (1 - k * .1), 0); tt += .7 + k * .14; }   // the boy's heart, slowing
T.at(TAKE, talk(DIED - TAKE - .4, BOYV * .85, { amp: .5, br: .2, gap: .22, fall: .25 }), .06, .4);   // "take them this water…" (faint)
T.at(DIED + .1, veena(SA + 12, .7), .07, 0);
T.at(DIED + .7, veena(SA + 7, .6), .05, 0);
// ---- G: the blind parents (soft rain; the curse)
const gDur = H0 - G0 + .2, gRain = t => t + G0 < GRIEV ? .55 : 1;
T.at(G0, rainBed(gDur, gRain), .09, 0);
T.at(G0, cricket(gDur, .5), .03, -.6);
for (let k = 0; k * .35 < 1.4; k++) T.at(G0 + .1 + k * .35, squelch(.7), .08, .7 - k * .1);   // he comes
T.at(QUIET - .3, mixb(thud(.4), clop(.5, .6)), .1, .3);   // the pot set down
T.at(QUIET - .2, talk(TRUTH - QUIET - .2, OLD, { amp: .7, br: .45, gap: .18 }), .07, -.4);   // "son, why so quiet?"
T.at(TRUTH, talk(CURSED - TRUTH - .4, YOUNG, { amp: .6, br: .25, gap: .2, fall: .2 }), .06, .3);   // the confession, low
T.at(TRUTH - .2, tanpura(H0 - TRUTH + .4, .7), .055, 0);
T.at(TRUTH + .7, sob(5, MUM, .8), .05, -.1);   // the mother
T.at(CURSED - .2, thunder(2.2, 1), .2, 0);
T.at(CURSED + .1, talk(H0 - CURSED - .6, OLD * 1.15, { amp: .9, br: .8, gap: .17, shake: .6 }), .08, -.4);   // the curse
T.at(GRIEV - .1, mixb(drum(40, 1, 1.4), noise(1.4, { brown: true, lp: 400, e: env.pluck(3), amp: .8 })), .3, 0);
T.at(GRIEV + .1, veena(SA, .8), .07, 0);
T.at(H0 - .3, whoosh(.6, 400, 2600), .16, 0);
// ---- H: no son at all (a still room, an empty cradle)
room(H0, I0, .04);
for (let k = 0; k < 4; k++) T.at(H0 + .3 + k * .8, creak(.6, k % 2 ? .9 : 1.05), .06, .4);   // the cradle rocks
T.at(NOSON, mixb(question(.7), plink(note(81), .5)), .12, 0);
T.at(I0 - .3, whoosh(.6, 2600, 500), .14, 0);
// ---- I: the king dies (tanpura, his sobs, a slowing heart; the lamp goes out; then silence)
room(I0, VERY, .05);
T.at(I0, cricket(VERY - I0, .5), .03, .6);
T.at(I0, crackle(VERY - I0, .3), .04, -.7);
T.at(I0, tanpura(VERY - I0 + .3, .7), .06, 0);
T.at(CRYING - .1, sob(Math.floor((VERY - CRYING - .4) / .32), KING, .9), .08, .1);
T.at(CRYING, veena(SA + 12, .5), .05, 0);
for (let k = 0, tt = CRYING + .2; tt < VERY - .3; k++) { T.at(tt, heart(.7), .1 * (1 - k * .12), 0); tt += .75 + k * .2; }
T.at(VERY - .2, noise(.55, { hp: 900, lp: 4000, e: env.hann(), amp: .7 }), .12, -.6);   // the lamp blown out: "fff"
// (silence until the tease)
// ---- J: the tease (the forest by day)
T.at(J0 - .3, whoosh(.6, 400, 2600), .14, 0);
room(J0, K0, .04);
for (let k = 0; k < 5; k++) T.at(J0 + .2 + k * .7, bird(2600 + (k % 3) * 400, .5), .04, -.6 + k * .3);
T.at(CROW - .6, mixb(wingbeat(1), whoosh(.6, 600, 2400)), .2, .5);
T.at(CROW - .05, caw(.9), .13, .3); T.at(CROW + .35, caw(.8), .11, .2);
T.at(CROW + .05, voice([[0, .3, 1.3, .7]], SITA, { rise: .4, amp: .8 }), .09, -.3);   // Sita gasps
T.at(GRASS - .6, noise(.3, { hp: 1500, lp: 6000, e: env.hann(), amp: .5 }), .06, .3);   // he plucks the grass
T.at(GRASS - .1, mixb(shimmer(1.1, [note(86), note(90), note(93)], .6, .07), drum(52, .8, .9)), .17, .2);
// ---- K: the card
T.at(K0 - .3, whoosh(.7, 400, 3200), .2, 0);
room(K0, END, .03);
T.at(CARD.head, conch(1.5, 311, .6), .12, 0);
T.at(CARD.title, pop(.9), .22, 0); T.at(CARD.title + .2, pop(.7, 1.2), .18, 0);
T.at(CARD.pill, pop(1, 1.3), .22, 0);
T.at(CARD.ask, plink(note(93), .8), .14, 0);
for (let k = 0; k < 3; k++) T.at(CARD.books + k * .12, pop(.6, 1 + k * .15), .14, (k - 1) * .4);

T.write('assets/rp3_sfx.wav');
// level to -16 LUFS with a fixed gain (no dynamic loudnorm: it would pump the quiet beds up between the hits)
const probe = execFileSync('sh', ['-c', `ffmpeg -hide_banner -i assets/rp3_sfx.wav -af ebur128 -f null - 2>&1 | grep -E '^ +I:' | tail -1`], { encoding: 'utf8' });
const I = parseFloat(probe.match(/-?[\d.]+/)[0]), gain = -16 - I;
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'assets/rp3_sfx.wav', '-af', `volume=${gain.toFixed(2)}dB,alimiter=limit=0.84:level=false,aresample=48000`, '-ar', '48000', '-ac', '2', 'assets/rp3_mix.wav']);
console.log('assets/rp3_mix.wav', END.toFixed(2), 's,', I.toFixed(1), 'LUFS raw, +' + gain.toFixed(1), 'dB');
