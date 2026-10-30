// pushpak_sfx.mjs: the sound of "The whole Ramayan in one flight" (src/scenes/pushpak.js) → assets/pushpak_sfx.wav, then the
// mix with the voice → assets/pushpak_mix.wav. Times come from the voice and the timeline (pushpak_vo.js + pushpak_tl.js,
// loaded with vm), so they follow the picture.
// A mild tanpura bed under the whole flight (owner: BGM present but mild); high wind and the Pushpak's soft hum when we
// fly with it, whooshes on the cuts; a temple bell on the hook. Bharata's vow: the fire crackles and roars on FIRE, a
// low drum. Each place: a chime as its pillar rises; each memory: a harp run in and a pop; the bridge's 5 DAYS a woodblock
// count; four months of rain; the sandals rise on a shimmer; Ayodhya: a soft chord and a hand bell; the landing: the hum
// settling, crickets, a deep bell on PANCHAMI; Hanuman's run: a rising whoosh and a bright hit on HOME; the route
// lighting up on a swell; the ask's numbers pop one by one; the card.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, plink, click, shimmer, note, seed, chime, drum, wind, chirp, fire, thud, rumble, crackle, rnd, clamp, SR } from './sfx.mjs';

const TL = runInNewContext(readFileSync('src/scenes/pushpak_vo.js', 'utf8') + '\n' + readFileSync('src/scenes/pushpak_tl.js', 'utf8') + '\n;TL');
const T = track(TL.END);
seed(64);
const add = (o, b, s0, g = 1) => { const s = Math.round(s0 * SR); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j] * g; return o; };
const lp = (b, fc) => { let l = 0; const a = 1 - Math.exp(-2 * Math.PI * fc / SR); for (let i = 0; i < b.length; i++) { l += a * (b[i] - l); b[i] = l; } return b; };
const tanpura = (dur, root = 50, amp = 1) => { const o = new Float32Array(Math.round((dur + 2.5) * SR)); const ns = [root + 7, root + 12, root + 12, root];
  for (let k = 0; k * .9 < dur; k++) add(o, lp(tone(2.4, note(ns[k % 4]), { type: 'saw', e: env.ad(.05, .9), amp }), 1400), k * .9, 1 - .5 * clamp((k * .9 - dur + 1.5) / 1.5)); return o; };
const pad = (dur, ms, amp = 1) => mixb(...ms.map((m, i) => tone(dur, t => note(m) * (1 + .003 * Math.sin(t * 2 + i)), { type: 'tri', e: env.swell(1, 1.2), amp: amp / ms.length })));
const harp = (f, amp = 1) => bell(f, 1.4, { partials: [[1, 1], [2, .35], [3, .12]], k: 3, amp });
const harpRun = (ms, amp = 1, gap = .045) => { const o = new Float32Array(Math.round((ms.length * gap + 1.6) * SR)); ms.forEach((m, i) => add(o, harp(note(m), amp), i * gap)); return o; };
const chord = (ms, d = 2, amp = 1) => { const o = new Float32Array(Math.round((d + 1) * SR)); ms.forEach((m, i) => add(o, bell(note(m), d, { partials: [[1, 1], [2, .35], [3, .12]], k: 1.4, amp }), i * .05)); return o; };
const templeBell = (f = 74, amp = 1) => bell(note(f), 4, { partials: [[1, 1], [2.02, .6], [2.76, .45], [4.1, .3], [5.4, .18]], k: 1.1, amp });
const handBell = (amp = 1) => bell(note(93), 2.2, { partials: [[1, 1], [2.4, .5], [3.9, .3], [5.6, .15]], k: 2.4, amp });
const hum = (dur, amp = 1) => mixb(tone(dur, t => 98 + 2 * Math.sin(t * 2.3), { type: 'tri', e: env.swell(.6, .6), amp }), tone(dur, t => 147 + 2 * Math.sin(t * 1.7), { e: env.swell(.6, .6), amp: amp * .5 }));
const whooshAt = (t, amp = .2, d = .7) => T.at(t - d / 2, whoosh(d, 400, 2600), amp, 0);
const pop = (amp = 1, f = 1) => mixb(click(amp), tone(.07, t => f * (500 + 2600 * t / .07), { e: env.pluck(40), amp: amp * .7 }), noise(.05, { lp: 2500, hp: 300, e: env.pluck(60), amp: amp * .5 }));
const woodblock = (amp = 1, f = 1) => mixb(tone(.08, 900 * f, { e: env.pluck(50), amp }), noise(.03, { hp: 1500, lp: 5000, e: env.pluck(90), amp: amp * .4 }));
const rainN = (dur, amp = 1) => { const n = noise(dur, { hp: 1200, lp: 9000, e: env.swell(.5, .5), amp }); for (let i = 0; i < n.length; i++) if (rnd() < .002) n[i] += (rnd() - .5) * 3 * amp; return n; };
const memIn = (t) => { T.at(t - .25, harpRun([74, 78, 81, 86, 90, 93], .7), .07, 0); T.at(t, pop(.7, 1.1), .14, 0); };
const pillar = (t, f = 86, pan = 0) => { T.at(t - .1, chime(note(f), .9, 2.4), .09, pan); T.at(t - .25, whoosh(.5, 800, 4000, .6), .05, pan); };

// ---- beds: the tanpura under the whole flight; high wind and the Pushpak's hum where we fly beside it
T.at(.1, tanpura(TL.CARD - .5, 50, 1), .03, 0);
const flying = [[0, TL.C0 + .4], [TL.F0, TL.G0 + .4], [TL.I0, TL.J0 + .4]];
for (const [a, b] of flying) { T.at(a, wind(b - a, a, .8), .06, 0); T.at(a, hum(b - a, 1), .05, 0); }
T.at(TL.D0, wind(TL.F0 - TL.D0 + .4, 2, 1), .03, 0); T.at(TL.G0, wind(TL.I0 - TL.G0 + .4, 3, 1), .03, 0);
T.at(TL.J0, wind(TL.N0 - TL.J0 + .4, 4, 1), .03, 0);

// ---- A: the hook: a temple bell, a shimmer
T.at(.05, templeBell(74, .8), .16, 0);
T.at(.1, shimmer(1.4, [note(86), note(90), note(93), note(98)], .5, .1), .08, 0);
// ---- B: away; Ayodhya far off; Valmiki
whooshAt(TL.B0 + .2, .14, 1.2);
T.at(TL.SITA - .1, chime(note(81), .7, 2.4), .07, .2);
T.at(TL.VALMIKI - .1, chord([62, 66, 69, 74], 2.2, .6), .08, 0);
// ---- C: the vow: the fire, a low drum on FIRE
T.at(TL.C0, fire(TL.D0 + .4 - TL.C0, .3, .7), .1, 0);
T.at(TL.C0 + .2, crackle(TL.D0 - TL.C0, 1), .03, .1);
T.at(TL.YEARS14 - .05, plink(note(81)), .08, 0);
for (let i = 0; i < 6; i++) T.at(TL.YEARS14 + .25 + i * .3, click(.5), .05, 0);   // the clock ticking
T.at(TL.FIRE - .1, drum(38, 1, 1.6), .28, 0); T.at(TL.FIRE - .1, rumble(1.4, 1), .1, 0); T.at(TL.FIRE - .2, whoosh(.8, 300, 2400, 1), .12, 0);
// ---- D–N: the places
whooshAt(TL.D0 + .1, .18, .8);
pillar(TL.LANKA, 86); memIn(TL.LANKA + .45);
T.at(TL.LANKA + 1.6, drum(44, 1, 1), .14, 0); T.at(TL.RAVANA1 + .3, thud(1), .12, 0);
whooshAt(TL.E0 + .1, .16, .7);
pillar(TL.BRIDGE - .2, 88); memIn(TL.BRIDGE + .1);
for (let i = 0; i < 5; i++) T.at(TL.DAYS5 - .5 + i * .12, woodblock(.8, 1 + i * .08), .1, (i - 2) * .2);
whooshAt(TL.F0 + .1, .2, .8);
memIn(TL.MAINAKA - .1); T.at(TL.MAINAKA + .4, mixb(noise(.6, { lp: 1200, hp: 200, e: env.swell(.05, .5), amp: 1 }), tone(.4, t => 300 + 900 * t, { e: env.hann(), amp: .4 })), .08, 0);   // the mountain pops up
whooshAt(TL.G0 + .1, .18, .8);
pillar(TL.KISH, 86); memIn(TL.KISH + .3);
T.at(TL.VALI - .3, whoosh(.3, 2000, 6000, 1), .1, .2); T.at(TL.VALI, thud(.8), .1, 0);
T.at(TL.MONTHS4 - 1, rainN(TL.H0 - TL.MONTHS4 + 1.4, 1), .07, 0); T.at(TL.MONTHS4 - .6, rumble(2, .8), .12, 0);
pillar(TL.RISHYA, 88, -.3); pillar(TL.PAMPA, 91, .3); memIn(TL.SUGRIVA - .5);
T.at(TL.SHABARI - .05, plink(note(93), .8), .08, 0);
whooshAt(TL.I0 + .1, .2, .8);
pillar(TL.JATAYU, 84); memIn(TL.JATAYU - .1);
T.at(TL.FELL - .1, tone(1, t => 900 * Math.pow(.4, t), { e: env.swell(.02, .3), amp: .6 }), .07, 0);   // a falling slide
whooshAt(TL.J0 + .1, .16, .8);
pillar(TL.PANCH, 86); memIn(TL.KHARA - .5);
for (let i = 0; i < 8; i++) T.at(TL.KHARA - .2 + i * .1, whoosh(.18, 2500, 6000, .6), .05, rnd() - .5);   // arrows
T.at(TL.HUT - .1, pop(.6, .9), .1, 0); T.at(TL.RAVANA2, drum(42, 1, 1.2), .16, 0);
whooshAt(TL.K0 + .1, .2, 1.2);
for (let i = 0; i < 10; i++) T.at(TL.AGASTYA + i * .12, plink(note(86 + (i % 5) * 2), .6), .04, (i % 2 ? .3 : -.3));   // the ashram lamps
pillar(TL.ATRI, 88); T.at(TL.YEARS10 - .05, chord([57, 62, 66, 69], 2.4, .7), .1, 0);
whooshAt(TL.L0 + .1, .16, .8);
pillar(TL.CHITRA, 86); T.at(TL.SANDALS - .7, shimmer(1.6, [note(81), note(86), note(90), note(93), note(98)], .7, .1), .1, 0);
T.at(TL.SANDALS - .05, chime(note(74), .9, 2.4), .12, 0);
whooshAt(TL.M0 + .1, .16, .8);
T.at(TL.YAMUNA - .2, noise(2.4, { lp: 1600, hp: 300, e: env.swell(.4, .8), amp: 1 }), .04, -.2);   // water
pillar(TL.YAMUNA + .2, 86, .2); pillar(TL.GUHA, 89, -.3);
whooshAt(TL.N0 + .1, .14, 1);
T.at(TL.AYODHYA - .1, chord([62, 66, 69, 74, 78], 3, .8), .12, 0); memIn(TL.BOW - .1);
T.at(TL.BOW + .3, handBell(.7), .08, .2);
// ---- O: the landing at dusk: the hum settles, crickets, a deep bell on PANCHAMI
T.at(TL.O0, hum(TL.P0 + .4 - TL.O0, 1), .05, 0);
for (let t = TL.O0 + .4; t < TL.P0 + 4; t += .25 + rnd() * .4) T.at(t, chirp(.5), .012, rnd() - .5);
T.at(TL.PANCHAMI - .1, templeBell(62, .9), .14, 0);
T.at(TL.LANDED + .5, thud(.6), .1, 0); T.at(TL.LANDED + .5, noise(.8, { lp: 900, hp: 100, e: env.swell(.02, .6), amp: 1 }), .05, 0);
// ---- P: Hanuman's run; HOME
T.at(TL.RACING - .4, whoosh(2.4, 300, 5000, 1), .16, 0);
T.at(TL.HOME - .1, chord([66, 69, 74, 78, 81], 2.8, .9), .16, 0); T.at(TL.HOME - .1, drum(45, 1, 1), .14, 0); T.at(TL.HOME, shimmer(1.6, [note(86), note(90), note(93), note(98), note(102)], .7, .08), .1, 0);
// ---- Q: the whole route lights up
T.at(TL.Q0, mixb(noise(TL.ONE - TL.Q0, { lp: t => 600 + 2000 * t / (TL.ONE - TL.Q0), hp: 200, e: (t, D) => Math.pow(t / D, 2), amp: 1 })), .06, 0);
T.at(TL.LANKA2 - .05, chime(note(81), .8, 2), .08, -.3); T.at(TL.AYODHYA2 - .05, chime(note(86), .8, 2), .08, .3);
T.at(TL.ONE - .05, chord([62, 66, 69, 74, 78], 3, .9), .14, 0);
// ---- R: the ask: the numbers pop
for (let i = 0; i < 8; i++) T.at(TL.R0 + .2 + i * .22, pop(.7, 1 + i * .07), .14, (i % 2 ? .3 : -.3));
// ---- the card
T.at(TL.CARD - .3, whoosh(.7, 400, 3200), .25, 0);
T.at(TL.CARD + .4, chord([67, 71, 74, 79], 2.2, .7), .2, 0);
for (let k = 0; k < 3; k++) T.at(TL.CARD + .9 + k * .12, pop(.8, 1 + k * .15), .26, (k - 1) * .4);
T.at(TL.CARD + 1.6, mixb(pop(1, 1.3), shimmer(.7, [note(91), note(95), note(98)], .6, .06)), .28, 0);
T.at(TL.CARD, pad(TL.END - TL.CARD, [67, 71, 74], .7), .07, 0);

T.write('assets/pushpak_sfx.wav');
console.log('assets/pushpak_sfx.wav', TL.END.toFixed(2), 's');
// the mix: the voice over the SFX, normalised to -14 LUFS
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'assets/pushpak_vo.wav', '-i', 'assets/pushpak_sfx.wav', '-filter_complex',
  `[1:a]volume=0.85[s];[0:a][s]amix=inputs=2:normalize=0:duration=longest,apad=whole_dur=${TL.END.toFixed(3)},atrim=0:${TL.END.toFixed(3)},loudnorm=I=-14:TP=-1.5:LRA=11[o]`,
  '-map', '[o]', '-ar', '48000', '-ac', '2', 'assets/pushpak_mix.wav']);
console.log('assets/pushpak_mix.wav');
