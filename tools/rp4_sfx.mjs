// rp4_sfx.mjs: the sound for Ramayan Part 4 (src/scenes/rp4.js, no voice) → assets/rp4_sfx.wav, then levelled to
// -16 LUFS → assets/rp4_mix.wav. Times come from src/scenes/rp4_tl.js. Retro cartoon foley in the manner of the
// Shumbha and Bal Hanuman sun reels: Ram's snore, the crow's woodblock pecks in time with its bobbing head, a dive-bomb
// whistle, a power-up whine for the grass, whoosh-bys in the chase, buzzy "nuh-uh"s from Indra and the sage, a sad
// trombone on "no one", the zing on the eye, a villain's laugh in Sita's bubble, war drums for the tease. Quiet beds
// under it (the stream and birds, the wind of the three worlds, crickets in Lanka); the only music is a soft tanpura
// under the Lanka scene, cut off on "why not" so the question lands in near silence.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, plink, click, thud, shimmer, slide, squeak, note, seed, rnd, clamp, chime, wind, drum, heart, om, conch, wingbeat, crackle, thunder, roar, whir, wah, SR } from './sfx.mjs';

const TL = runInNewContext(readFileSync('src/scenes/rp4_tl.js', 'utf8') + '\n;TL');
const { B0, C0, D0, E0, F0, G0, H0, K0, END, CROWH, PECK, CLOD, CAME, CLAW, BLED, WOKE, BLOOD, INDRAS, PICK, BLADE, BRAHM, FATHER, GODS, SAGES, NOONE,
  FEET, WASTED, RIGHT, HIT, SPARED, LANKA, ONLY, ASKED, WHYNOT, TOOK, FOURTEEN, CARD } = TL;

const T = track(END);
seed(36);
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
const talk = (dur, f, { gap = .17, amp = 1, br = .5, fall = .1, shake = 0 } = {}) =>
  voice(Array.from({ length: Math.max(1, Math.floor(dur / gap)) }, (_, i) => [i * gap, gap * .72, 1 + .14 * Math.sin(i * 2.3) - (i % 5 === 4 ? .12 : 0), br]), f, { amp, fall, shake });
const sob = (n, f, amp = 1) => voice(Array.from({ length: n }, (_, i) => [i * .32, .26, 1.1 - i * .04, .5]), f, { amp, fall: .35, shake: 1 });
const SITA = 330, INDRA = 170, SAGE = 120, HANU = 210, RAVAN = 95, CROWV = 520;

const pop = (amp = 1, f = 1) => mixb(click(amp), tone(.07, t => f * (500 + 2600 * t / .07), { e: env.pluck(40), amp: amp * .7 }), noise(.05, { lp: 2500, hp: 300, e: env.pluck(60), amp: amp * .5 }));
const unpop = (amp = 1) => tone(.12, t => 2400 - 18000 * t, { e: env.pluck(20), amp });   // a pop in reverse: something shrinks away
const poof = (amp = 1) => noise(.45, { lp: 1800, hp: 200, e: env.ad(.02, .3), amp });      // a cloud puffs up
const tok = (amp = 1, f = 1) => mixb(tone(.07, 1250 * f, { type: 'tri', e: env.pluck(90), amp }), tone(.05, 2500 * f, { e: env.pluck(120), amp: amp * .3 }), click(amp * .4));   // woodblock
const caw = (amp = 1, f = 1) => lp(mixb(tone(.28, t => f * (640 - 340 * t), { type: 'saw', e: env.ad(.01, .1), amp }), tone(.28, t => f * (690 - 340 * t), { type: 'saw', e: env.ad(.01, .1), amp: amp * .7 })), 3000);
const whimper = (n, amp = 1) => voice(Array.from({ length: n }, (_, i) => [i * .4, .22, 1.1 - (i % 2) * .08, .7]), CROWV * 1.6, { amp, fall: .5, shake: .8 });
const bird = (f, amp = 1) => mixb(squeak(f, f * 1.4, .07, amp), squeak(f * 1.3, f * 1.1, .06, amp * .7));
const cricket = (dur, amp = 1) => { const o = new Float32Array(Math.round(dur * SR)); for (let k = 0; k * .7 < dur - .3; k++) for (let j = 0; j < 3; j++) add(o, tone(.03, 4300 + rnd() * 300, { e: env.hann(), amp }), k * .7 + j * .045 + rnd() * .08); return o; };
const scratch = (amp = 1) => { const n = noise(.22, { hp: 2200, lp: 7000, e: env.ad(.005, .12), amp }); for (let i = 0; i < n.length; i++) n[i] *= .4 + .6 * Math.abs(Math.sin(i / SR * 2 * Math.PI * 38)); return n; };
const drip = (f, amp = 1) => tone(.12, t => f * (1 + 2.5 * t / .12), { e: env.pluck(30), amp });   // a cartoon "plip"
const snoreIn = (amp = 1) => mixb(lp(noise(.85, { lp: 700, hp: 80, e: env.swell(.3, .1), amp }), 900), voice([[.15, .7, 1, .15]], 70, { amp: amp * .6, fall: -.1 }));
const snoreOut = (amp = 1) => mixb(tone(.6, t => 900 - 450 * t / .6, { e: env.swell(.05, .25), amp: amp * .35 }), noise(.6, { hp: 400, lp: 2500, e: env.swell(.05, .3), amp: amp * .3 }));
const snort = (amp = 1) => mixb(voice([[0, .18, 1, .3]], 80, { amp, fall: -.3 }), noise(.18, { lp: 900, hp: 100, e: env.ad(.01, .1), amp: amp * .8 }));
const question = (amp = 1) => tone(.4, t => 300 + 500 * (t / .4) ** 2, { type: 'tri', e: env.ad(.01, .2), amp });
const trumpet = (amp = 1) => lp(tone(.6, t => (300 + 200 * Math.sin(Math.PI * clamp(t / .45))) * (1 + .02 * Math.sin(t * 2 * Math.PI * 7)), { type: 'saw', e: env.swell(.04, .2), amp }), 2600);
const harp = (up = true, amp = 1) => { const sc = [62, 64, 66, 69, 71, 74, 76, 78, 81, 83, 86, 88], o = new Float32Array(Math.round(2.2 * SR)); (up ? sc : [...sc].reverse()).forEach((m, i) => add(o, bell(note(m), 1.4, { partials: [[1, 1], [2, .3], [3, .1]], k: 2.6, amp }), i * .045)); return o; };
const tada = (amp = 1) => { const o = new Float32Array(Math.round(2.4 * SR)); [[74, 0], [78, .12], [81, .24], [86, .36]].forEach(([m, s]) => add(o, bell(note(m), 1.6, { partials: [[1, 1], [2, .4], [3, .15]], k: 2, amp }), s)); return o; };
// the sad trombone: four notes down, the last one wobbling
const womp = (amp = 1) => { const o = new Float32Array(Math.round(2.4 * SR)); [[55, 0, .3], [54, .32, .3], [53, .64, .3], [52, .96, 1]].forEach(([m, s, d], i) => add(o, i < 3 ? wah(note(m), d, amp) : tone(d, t => note(m) * (1 + .03 * Math.sin(t * 2 * Math.PI * 6)), { type: 'saw', e: env.swell(.03, .4), amp: amp * .5 }), s)); return lp(o, 1800); };
const zing = (amp = 1) => mixb(bell(note(98), .8, { partials: [[1, 1], [2.4, .4]], k: 4, amp }), noise(.25, { hp: 2500, lp: 9000, e: env.pluck(14), amp: amp * .6 }), slide(.3, 2400, 3600, amp * .3));
const laugh = (amp = 1) => voice([[0, .2, 1.1, .6], [.26, .2, 1.05, .6], [.52, .2, 1, .6], [.78, .3, .92, .6]], RAVAN, { amp, fall: .15 });   // "ha ha ha haa"
// the bed's music: a tanpura (Pa Sa Sa low-Sa plucked over a held low Sa, D as Sa) and a veena note
const SA = 50;
const tanpura = (dur, amp = 1) => {
  const o = mixb(tone(dur, note(SA - 12), { type: 'tri', e: env.swell(1.2, .5), amp: .25 * amp }), tone(dur, note(SA - 5), { e: env.swell(1.2, .5), amp: .12 * amp }));
  const pl = [SA - 5, SA, SA, SA - 12];
  for (let k = 0; k * .6 < dur - .8; k++) add(o, bell(note(pl[k % 4]), 2.2, { partials: [[1, 1], [2, .5], [3, .3], [4, .2]], k: 1.1, amp: .22 * amp }), k * .6, Math.min(1, (dur - k * .6) / 1.5));
  return o;
};
const veena = (m, amp = 1) => mixb(bell(note(m), 1.6, { partials: [[1, 1], [2, .6], [3, .35], [5, .12]], k: 2.4, amp }), noise(.02, { hp: 2000, lp: 6000, e: env.pluck(80), amp: amp * .3 }));
const stream = (dur) => noise(dur, { lp: 1600, hp: 250, e: env.swell(.6, .6), amp: .4 });
const room = (a, b, g = .05) => T.at(a, noise(b - a, { lp: 500, hp: 60, e: env.swell(.4, .4), amp: .5 }), g, 0);
const astraHum = (dur, amp = 1) => mixb(tone(dur, t => 220 + 8 * Math.sin(t * 30), { type: 'tri', e: env.swell(.3, .3), amp: .5 * amp }), tone(dur, 440, { e: env.swell(.3, .3), amp: .15 * amp }));

// ---- A: the hook (the blade blazes; a crow flaps past)
T.at(0, mixb(astraHum(B0 + .1, .7), crackle(B0 + .1, .25)), .1, .2);   // the grass hums and fizzes like a sparkler
T.at(.05, shimmer(1.2, [note(86), note(90), note(93)], .5, .08), .07, .2);
T.at(CROWH - .3, mixb(wingbeat(1), whoosh(.6, 700, 2400)), .16, .5);
T.at(CROWH + .1, caw(.9), .12, .7);
T.at(B0 - .3, whoosh(.6, 500, 3000), .2, 0);
// ---- B: the ident
T.at(B0, conch(1.6, 311, .7), .14, 0);
T.at(B0 + .35, pop(.8), .22, 0); T.at(B0 + .7, pop(.6, 1.2), .18, 0);
T.at(C0 - .3, whoosh(.6, 400, 2600), .18, 0);
// ---- C: Chitrakoot (the stream, birds; Ram snores until he wakes)
room(C0, D0, .04);
T.at(C0, stream(D0 - C0 + .2), .05, .3);
for (let k = 0; k < 6; k++) T.at(C0 + .3 + k * 1.3, bird(2600 + (k % 3) * 400, .5), .035, -.7 + (k % 4) * .4);
for (let s = C0 + .3; s < WOKE - .3; s += 1.6) { T.at(s, snoreIn(.9), .1, .25); T.at(s + .88, snoreOut(.9), .07, .25); }
T.at(C0 + 1, mixb(wingbeat(.8), whoosh(.8, 2200, 700)), .12, .6);   // the crow swoops in
T.at(PECK - .5, caw(.7, 1.1), .08, -.1);
for (let k = Math.ceil((PECK - .5) * 9 / Math.PI - .5); (k + .5) * Math.PI / 9 < CLOD + .1; k++) T.at((k + .5) * Math.PI / 9, tok(.9, k % 2 ? 1 : 1.12), .1, -.15);   // tok-tok: on each bob of its head
T.at(PECK + .1, voice([[0, .25, 1.4, .8]], SITA, { rise: .5 }), .08, -.3);   // "eek!"
T.at(CLOD - .4, voice([[0, .3, 1.15, .7]], SITA, { fall: .3 }), .08, -.3);    // "shoo!"
T.at(CLOD - .1, whoosh(.45, 900, 2600), .16, 0);   // the clod flies
T.at(CLOD + .15, mixb(caw(1, 1.15), wingbeat(1)), .14, .2);   // the crow jumps up, squawking
T.at(CLOD + .75, mixb(thud(.4), noise(.2, { lp: 1500, hp: 200, e: env.pluck(20), amp: .4 })), .08, .6);   // the clod lands, missed
T.at(CAME - .45, slide(.9, 2200, 700, .7), .1, .4);   // the dive-bomb whistle
T.at(CAME + .3, wingbeat(1), .14, -.1);
T.at(CLAW - .3, caw(1, .9), .14, -.1);
T.at(CLAW, scratch(1), .16, -.2); T.at(CLAW + .25, scratch(.9), .14, -.25);
T.at(CLAW + .1, voice([[0, .55, 1.5, .9]], SITA, { fall: .35, shake: .5 }), .1, -.3);   // her cry
[0, .15, .3].forEach((s, i) => T.at(BLED - .1 + s, drip(1300 - i * 150, .8), .07, -.25));
T.at(WOKE - .15, snort(1), .14, .25);   // HNK!
T.at(WOKE + .05, slide(.3, 400, 800, .5), .1, .25);   // the "!"
T.at(BLOOD + .1, mixb(drum(48, .9, 1), tone(.9, note(38), { type: 'saw', e: env.ad(.02, .6), amp: .2 })), .2, 0);   // DUN
T.at(INDRAS + .45, mixb(tada(.7), shimmer(1.2, [note(90), note(93), note(98)], .5, .06)), .12, .3);   // the crown pops on
T.at(INDRAS + 1.3, caw(.6, 1.2), .07, .4);   // the crow, nervous
// ---- D: the grass becomes the Brahmastra (a power-up whine, then BOOM)
T.at(D0 - .3, whoosh(.6, 600, 3000), .18, 0);
room(D0, E0, .04);
T.at(PICK, mixb(noise(.25, { hp: 1500, lp: 6000, e: env.hann(), amp: .5 }), plink(note(88), .6)), .12, .2);   // pluck
T.at(BLADE - .1, whir(BRAHM - BLADE - .05, .8), .1, .1);   // the charge winds up
T.at(BLADE, astraHum(BRAHM - BLADE + 2.2, 1), .12, .1);
T.at(BLADE + .2, om(BRAHM - BLADE + 1.8, 98, .5), .08, 0);
T.at(BRAHM - .05, mixb(drum(40, 1, 1.6), noise(1.6, { brown: true, lp: 400, e: env.pluck(2.5), amp: .8 }), shimmer(1.6, [note(86), note(90), note(93), note(98)], .7, .05)), .3, 0);
// ---- E: the chase through the three worlds (wind, wings, whoosh-bys; the refusals; the sad trombone)
T.at(E0 - .2, whoosh(1, 300, 5000), .25, -.4);
T.at(E0, wind(F0 - E0, 2, .6), .1, 0);
for (let s = E0 + .1; s < F0 - .3; s += .26) T.at(s, wingbeat(.7), .07, clamp(Math.sin(s * 1.4) * .5, -1, 1));   // flap-flap, following the crow
for (let s = E0 + .3; s < F0 - .5; s += 2.24) T.at(s, whoosh(.7, 800, 3600), .14, Math.sin(s * 1.4) > 0 ? .5 : -.5);   // the glowing grass whips past
T.at(E0 + .2, astraHum(F0 - E0 - .3, .6), .06, .3);
for (const s of [E0 + .6, E0 + 1.7, FATHER - .5]) T.at(s, caw(.8, 1.2), .08, Math.sin(s * 1.4) * .5);   // panicky caws
T.at(FATHER - .3, mixb(poof(.7), pop(.8)), .14, .4);   // Indra pops up on a cloud
T.at(FATHER + .1, trumpet(.7), .05, .5);   // Airavata
T.at(FATHER + .05, voice([[0, .22, 1.1, .6], [.27, .3, .9, .6], [.7, .22, 1.1, .6], [.97, .3, .9, .6]], INDRA, { fall: .2 }), .08, .4);   // "nuh-uh, nuh-uh"
T.at(GODS + .7, unpop(.7), .1, .4);
T.at(SAGES - .3, mixb(poof(.7), pop(.7, 1.1)), .14, -.4);
T.at(SAGES + .05, voice([[0, .3, 1, .4], [.38, .4, .85, .4]], SAGE, { fall: .15 }), .08, -.4);   // "hmm-mm"
T.at(NOONE - .1, mixb(plink(note(93), .6), drum(50, .6, .6)), .12, 0);   // the star
T.at(NOONE + .2, womp(.9), .1, 0);   // wah wah wah waaah
// ---- F: back at Ram's feet; the eye
T.at(F0 - .3, whoosh(.7, 4000, 600), .18, .4);
room(F0, G0, .04);
T.at(F0, stream(G0 - F0), .04, .3);
T.at(FEET - .7, slide(.7, 1800, 600, .5), .07, .4);
T.at(FEET - .05, mixb(thud(.6), wingbeat(.5)), .16, .2);   // flop
T.at(FEET + .4, whimper(Math.floor((HIT - FEET - .8) / .4), .6), .05, .2);
T.at(WASTED - .4, astraHum(HIT - WASTED + .3, .8), .08, .4);   // the grass hovers, humming
for (let k = 0, s = RIGHT; s < HIT - .1; k++) { T.at(s, heart(.7), .1, 0); s += .4 - k * .03; }   // ba-dum, faster
T.at(HIT - .5, whoosh(.5, 900, 4000), .14, .3);
T.at(HIT, zing(1), .18, .3);
T.at(HIT + .05, caw(1, 1.3), .14, .3);   // ow!
T.at(SPARED - .1, mixb(harp(false, .6), veena(SA + 12, .5)), .1, 0);
T.at(SPARED + .3, mixb(wingbeat(.9), whoosh(.9, 600, 2400)), .12, .6);
for (const s of [.7, 1.05, 1.55]) T.at(SPARED + s, wingbeat(.6), .06, .7);   // off he goes, wobbling
T.at(SPARED + 1.2, caw(.5, 1.1), .04, .8);
// ---- G: Lanka, years later (crickets, a soft tanpura; it stops on "why not", then the demon's laugh)
T.at(G0 - .3, whoosh(.7, 2600, 500), .16, 0);
room(G0, H0, .05);
T.at(G0, cricket(H0 - G0, .5), .035, .6);
T.at(G0 + .1, tanpura(WHYNOT - G0 + .2, .7), .06, 0);
T.at(G0 + .3, talk(ASKED - G0 - .4, SITA, { amp: .55, br: .3 }), .05, -.3);
T.at(LANKA - .2, mixb(pop(.7), shimmer(.9, [note(84), note(88), note(91)], .5, .08)), .14, .1);   // the bubble
T.at(LANKA + .3, lp(caw(.6, 1.1), 1500), .04, .2);   // the crow, as a memory
T.at(ONLY + .1, voice([[0, .35, 1, .5]], HANU, { rise: .6 }), .07, .3);   // Hanuman: "oh!"
T.at(ASKED, talk(H0 - ASKED - .6, SITA, { amp: .55, br: .35, shake: .5 }), .05, -.3);
T.at(ASKED + .2, veena(SA + 12, .6), .06, 0);
T.at(TOOK - .15, mixb(drum(42, 1, 1.4), thunder(1.8, .5)), .22, 0);   // Ravana's head
T.at(TOOK + .2, laugh(1), .09, .2);
T.at(TOOK + 1.4, sob(3, SITA, .7), .05, -.3);
T.at(TOOK + 1.6, veena(SA + 7, .5), .05, 0);
// ---- H: the tease (dusk; war drums, the horde growls, the bow drawn)
T.at(H0 - .3, whoosh(.7, 400, 3000), .18, 0);
T.at(H0, wind(K0 - H0, 1, .5), .07, 0);
for (let k = 0; H0 + .15 + k * .3 < K0 - .3; k++) T.at(H0 + .15 + k * .3, drum(k % 4 === 0 ? 48 : k % 2 ? 72 : 60, k % 4 === 0 ? 1 : .55, .5), .14, 0);   // DUM ta-ta ta
T.at(H0 + .5, roar(2.6, 110, 10, .6), .1, .5);
T.at(FOURTEEN - .6, mixb(slide(.6, 180, 420, .4), noise(.6, { hp: 300, lp: 1500, e: env.hann(), amp: .3 })), .12, -.4);   // the bow drawn
T.at(FOURTEEN, mixb(drum(40, 1, 1.4), noise(1.2, { brown: true, lp: 300, e: env.pluck(3), amp: .7 })), .2, 0);
// ---- K: the card
T.at(K0 - .3, whoosh(.7, 400, 3200), .2, 0);
room(K0, END, .03);
T.at(CARD.head, conch(1.5, 311, .6), .12, 0);
T.at(CARD.title, pop(.9), .22, 0); T.at(CARD.title + .2, pop(.7, 1.2), .18, 0);
T.at(CARD.pill, pop(1, 1.3), .22, 0);
T.at(CARD.ask, plink(note(93), .8), .14, 0);
for (let k = 0; k < 3; k++) T.at(CARD.books + k * .12, pop(.6, 1 + k * .15), .14, (k - 1) * .4);

T.write('assets/rp4_sfx.wav');
// level to -16 LUFS with a fixed gain (no dynamic loudnorm: it would pump the quiet beds up between the hits)
const probe = execFileSync('sh', ['-c', `ffmpeg -hide_banner -i assets/rp4_sfx.wav -af ebur128 -f null - 2>&1 | grep -E '^ +I:' | tail -1`], { encoding: 'utf8' });
const I = parseFloat(probe.match(/-?[\d.]+/)[0]), gain = -16 - I;
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'assets/rp4_sfx.wav', '-af', `volume=${gain.toFixed(2)}dB,alimiter=limit=0.84:level=false,aresample=48000`, '-ar', '48000', '-ac', '2', 'assets/rp4_mix.wav']);
console.log('assets/rp4_mix.wav', END.toFixed(2), 's,', I.toFixed(1), 'LUFS raw, +' + gain.toFixed(1), 'dB');
