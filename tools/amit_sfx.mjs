// amit_sfx.mjs: the sound of "Amit roop pragate" (src/scenes/amit.js) → assets/amit_sfx.wav, then the mix with
// @lame_batman's voice (assets/vo/ramji/clean.wav: the recording denoised, kept out of git) → assets/amit_mix.wav.
// Times come from the scene's TL, so the sound follows the picture. A mild synth bed (a soft pad, a tanpura under
// Tulsidas and the verses), ducked under the voice; quiet SFX: wind and bells in the sky, the vanaras' pops, birds by
// the walls, the conch and a cheer at the landing, the sorrow clouds' drizzle and pops, the crowd, the riser and the
// cascade of poofs as the forms appear, the boy's chime and hug, bells and a cheer on "Jai Shri Ram", the card.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, shimmer, note, seed, chime, wind, click, slide, conch, squeak, SR, rnd, clamp } from './sfx.mjs';

const src = readFileSync('src/scenes/amit.js', 'utf8'), TL = runInNewContext(src.match(/const TL = \{[\s\S]*?\};/)[0] + '\n;TL');
const END = TL.end, T = track(END);
seed(108);
const lp = (b, fc) => { let l = 0; const a = 1 - Math.exp(-2 * Math.PI * fc / SR); for (let i = 0; i < b.length; i++) { l += a * (b[i] - l); b[i] = l; } return b; };
const add = (o, b, s0, g = 1) => { const s = Math.round(s0 * SR); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j] * g; return o; };
const pad = (dur, ms, amp = 1) => mixb(...ms.map((m, i) => tone(dur, t => note(m) * (1 + .003 * Math.sin(t * 2 + i)), { type: 'tri', e: env.swell(.9, .9), amp: amp / ms.length })));
const tanpura = (dur, root = 50, amp = 1) => { const o = new Float32Array(Math.round((dur + 1) * SR)); const ns = [root + 7, root + 12, root + 12, root]; for (let k = 0; k * .9 < dur; k++) add(o, lp(tone(2.4, note(ns[k % 4]), { type: 'saw', e: env.ad(.05, .9), amp }), 1600), k * .9); return o; };
const pop = (amp = 1, f = 1) => mixb(click(amp), tone(.07, t => f * (500 + 2600 * t / .07), { e: env.pluck(40), amp: amp * .7 }), noise(.05, { lp: 2500, hp: 300, e: env.pluck(60), amp: amp * .5 }));
const templeBell = (m = 88, amp = 1) => bell(note(m), 2.8, { partials: [[1, 1], [2.4, .55], [3.9, .3], [5.6, .15]], k: 1.2, amp });
const tinkle = (amp = 1) => bell(note(96 + Math.floor(rnd() * 5)), .8, { partials: [[1, 1], [2.7, .3]], k: 5, amp });
const bird = (f, amp = 1) => mixb(squeak(f, f * 1.4, .07, amp), squeak(f * 1.3, f * 1.1, .06, amp * .7));
const crowd = (dur, amp = 1) => noise(dur, { lp: t => 900 + 300 * Math.sin(t * 1.3), hp: 180, e: env.swell(.8, .8), amp });
const cheer = (dur, amp = 1) => mixb(noise(dur, { lp: 2400, hp: 300, e: env.ad(.15, dur * .6), amp }), noise(dur, { lp: 1200, hp: 150, e: env.ad(.3, dur * .5), amp: amp * .6 }));
const drizzle = (dur, amp = 1) => noise(dur, { hp: 3000, lp: 8000, e: env.swell(.3, .2), amp });
const riser = (dur, amp = 1) => noise(dur, { lp: t => 300 + 5000 * (t / dur) ** 2, hp: 120, e: (t, D) => clamp(t / D) ** 2, amp });
const chord = (ms, d = 2.4, amp = 1) => { const o = new Float32Array(Math.round((d + 1) * SR)); ms.forEach((m, i) => add(o, bell(note(m), d, { partials: [[1, 1], [2, .35], [3, .12]], k: 1.2, amp }), i * .06)); return o; };
const chatter = (n, amp = 1) => { const o = new Float32Array(Math.round((n * .1 + .3) * SR)); for (let i = 0; i < n; i++) add(o, squeak(900 + rnd() * 600, 1400 + rnd() * 700, .07, amp), i * .1); return o; };

// ---- the bed: a soft pad through the reel (D major), a tanpura under Tulsidas and both verses
T.at(0, pad(TL.tulsi + .4, [62, 69, 74, 78], 1), .1, 0);
T.at(TL.tulsi, tanpura(TL.faces - TL.tulsi, 50, .6), .06, 0);
T.at(TL.land, pad(TL.wide - TL.land, [62, 66, 69, 74], .9), .08, 0);
T.at(TL.wide, pad(TL.eyes - TL.wide, [59, 66, 71], .9), .07, 0);
T.at(TL.eyes, pad(TL.many - TL.eyes, [62, 69, 74], .8), .07, 0);
T.at(TL.many, pad(TL.tulsi2 - TL.many + .5, [62, 66, 69, 74, 78], 1), .1, 0);
T.at(TL.tulsi2, tanpura(TL.boy - TL.tulsi2, 50, .6), .06, 0);
T.at(TL.verse2, pad(TL.boy - TL.verse2, [62, 69, 74], .8), .06, 0);
T.at(TL.boy, pad(TL.rise - TL.boy, [64, 69, 73], .8), .07, 0);
T.at(TL.rise, pad(TL.royal - TL.rise, [62, 66, 69, 74], .9), .09, 0);
T.at(TL.royal, pad(TL.card - TL.royal + 1, [62, 66, 69, 74, 78], 1), .11, 0);
T.at(TL.card, pad(END - TL.card, [67, 71, 74], .7), .07, 0);

// ---- A: the sky: wind, the vimana's bells; the pull-back whoosh; Sita's heart; Lakshman's wave; the vanaras pop up
T.at(0, wind(TL.city + .3, 0, 1.2), .06, 0);
for (let t = .4; t < TL.city - .3; t += .9 + rnd() * .7) T.at(t, tinkle(.7), .03, rnd() * .6 - .3);
T.at(3.3, whoosh(2.2, 300, 1800), .05, 0);
T.at(TL.sita + .1, chime(note(86), .7, 1.6), .05, -.3);
T.at(TL.laksh + .1, chime(note(90), .6, 1.4), .04, .3);
[0, .18, .32].forEach((d, i) => { T.at(TL.vanar + d, pop(.8, 1 + i * .15), .12, [-.4, .3, .6][i]); });
T.at(TL.vanar + .4, chatter(6, .8), .05, .2);
// ---- B: by the walls: birds, a far murmur; the girl spots it (a ding); the tilt up (a shimmer)
T.at(TL.city, crowd(TL.tulsi - TL.city + .3, 1), .03, 0);
[.4, 1.1, 1.9].forEach((d, i) => T.at(TL.city + d, bird(2600 + i * 300, .8), .03, i - 1));
T.at(TL.spot, chime(note(93), .8, 1.2), .08, 0);
T.at(TL.spot + .4, shimmer(1.4, [note(81), note(86), note(90), note(93)], .6, .12), .05, .3);
// ---- C: the lamp: a soft bell as the line glows
T.at(TL.tulsi + .5, templeBell(76, .6), .05, 0);
// ---- D: the vimana comes down (a falling whoosh), lands (a soft thump), the conch, bells, the cheer
T.at(TL.land, slide(1.6, 900, 300, .6), .03, 0);
T.at(TL.land, whoosh(1.8, 2500, 400), .05, 0);
T.at(TL.touch, mixb(tone(.4, t => 90 * Math.exp(-t * 5) + 40, { e: env.pluck(8) }), noise(.3, { lp: 500, e: env.pluck(14) })), .1, 0);
T.at(TL.touch + .15, conch(2.2, 311, 1), .05, 0);
T.at(TL.touch + .3, cheer(3, 1), .06, 0);
T.at(TL.touch + .5, templeBell(88, .8), .05, -.3); T.at(TL.touch + 1.2, templeBell(91, .7), .04, .3);
T.at(TL.touch + .3, crowd(TL.faces - TL.touch, 1), .03, 0);
// ---- E: drizzle under the sorrow clouds; each pops (a pop and a rising chime)
T.at(TL.faces, drizzle(TL.pop3 - TL.faces + .2, 1), .015, 0);
[[TL.pop1, 81, -.4], [TL.pop2, 86, 0], [TL.pop3, 90, .4]].forEach(([t, m, p]) => { T.at(t, pop(.7, 1.2), .08, p); T.at(t + .05, chime(note(m), .7, 1.4), .07, p); });
// ---- F/G: the crowd presses in; the boy gives up (a small falling note)
T.at(TL.wide, crowd(TL.eyes - TL.wide + .4, 1), .045, 0);
T.at(TL.boySad, slide(.6, 520, 380, .5), .03, -.3);
// ---- H/I: Ram's eyes find him (a soft chime, a twinkle); he glows (a riser); the forms (a burst, a cascade of poofs)
T.at(TL.find + .1, chime(note(86), .6, 1.4), .05, -.2);
T.at(TL.smile + .1, shimmer(1.2, [note(93), note(98), note(102)], .6, .08), .05, 0);
T.at(TL.glow, riser(TL.many - TL.glow, 1), .05, 0);
T.at(TL.many - .05, mixb(chord([62, 66, 69, 74, 78], 3, 1), noise(.6, { hp: 2000, lp: 9000, e: env.ad(.01, .4) })), .12, 0);
T.at(TL.many, shimmer(2.6, [81, 86, 90, 93, 98, 102].map(note), .7, .08), .07, 0);
for (let i = 0; i < 26; i++) { const d = .05 + i * .06 + rnd() * .05; T.at(TL.many + d, pop(.5, .9 + rnd() * .5), .05, rnd() * 1.4 - .7); }
T.at(TL.mile, chord([62, 69, 74, 78], 2.6, .8), .06, 0);
T.at(TL.mile + .2, crowd(TL.tulsi2 - TL.mile + .3, 1), .03, 0);
// ---- J: Tulsidas again (a bell)
T.at(TL.tulsi2 + .2, templeBell(79, .6), .05, 0);
// ---- K: the three meetings along the row: a chime each
[[TL.verse2 + .3, 86], [TL.k2, 90], [TL.k3, 93]].forEach(([t, m], i) => T.at(t, chime(note(m), .6, 1.6), .05, i - 1));
// ---- L: the boy's own Ram: a poof and a chime; the hug: a warm chord and a twinkle
T.at(TL.kneel, pop(.8, 1.1), .1, -.2); T.at(TL.kneel + .05, shimmer(1.6, [note(86), note(90), note(93), note(98)], .7, .08), .06, -.2);
T.at(TL.hug, chord([66, 69, 74, 78], 2.6, .9), .08, 0); T.at(TL.hug + .3, shimmer(1.2, [note(98), note(102), note(105)], .5, .1), .04, 0);
// ---- M: up over the walls: a swell and the lights (chimes)
T.at(TL.rise, whoosh(3.5, 200, 1500), .04, 0);
for (let i = 0; i < 6; i++) T.at(TL.rise + 1.3 + i * .4, chime(note(86 + [0, 4, 7, 12, 7, 16][i]), .5, 1.2), .035, (i % 3 - 1) * .5);
// ---- N/O: the pull back (a whoosh), the cheer on "poori Ayodhya"; bells, the conch and the cheer on "Jai Shri Ram"
T.at(TL.out - .3, whoosh(1.8, 300, 2400), .05, 0);
T.at(TL.poori, cheer(3.2, 1), .06, 0);
T.at(TL.jai, templeBell(88, 1), .08, -.3); T.at(TL.jai + .45, templeBell(91, .9), .07, .3); T.at(TL.jai + .9, templeBell(86, .8), .06, 0);
T.at(TL.jai + .1, conch(2.4, 311, 1), .05, 0);
T.at(TL.jai + .2, cheer(2.6, 1), .07, 0);
// ---- P: the card
T.at(TL.card - .2, whoosh(.8, 400, 3000), .06, 0);
T.at(TL.card + .5, chime(note(86), .7, 2.4), .06, -.2); T.at(TL.card + 1.1, chime(note(90), .7, 2.4), .06, .2);

T.write('assets/amit_sfx.wav');
console.log('assets/amit_sfx.wav', END.toFixed(2), 's');
// the mix: the voice on top, the SFX and bed side-chain ducked under it; -14 LUFS
const D = END.toFixed(3);
const fc = `[0:a]aresample=48000,volume=1.0,asplit=2[v][key];[1:a]aresample=48000,volume=${process.env.SFXV ?? .38}[s];[s][key]sidechaincompress=threshold=0.04:ratio=3:attack=40:release=500[sd];[v][sd]amix=inputs=2:normalize=0:duration=longest,apad=whole_dur=${D},atrim=0:${D},afade=t=out:st=${(END - 1.2).toFixed(2)}:d=1.2,loudnorm=I=-14:TP=-1.5:LRA=11[o]`;
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'assets/vo/ramji/clean.wav', '-i', 'assets/amit_sfx.wav', '-filter_complex', fc, '-map', '[o]', '-ar', '48000', '-ac', '2', 'assets/amit_mix.wav']);
console.log('assets/amit_mix.wav');
