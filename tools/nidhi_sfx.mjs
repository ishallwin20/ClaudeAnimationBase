// nidhi_sfx.mjs: the sound of ad 116 (src/scenes/nidhi.js). Three steps, times from the voice and the timeline
// (src/scenes/nidhi_vo.js + nidhi_tl.js, loaded with vm), so they follow the picture:
//   1. the score cut: sections of Lyria take 2 (assets/nidhi_score_2.mp3, 146 s; Lyria stretched the brief) laid on
//      the picture's beats, picked by loudness (quiet under the lock and the windows, a rise into the white-out,
//      silence after it, the loud plateau under the Raas and HEARS, the take's own ending under the card)
//      → assets/nidhi_score_cut.wav
//   2. the SFX → assets/nidhi_sfx.wav
//   3. the mix: the voice over the SFX and the score (ducked under the voice), -14 LUFS → assets/nidhi_mix.wav
// The arc: dusk wind and a chain at the gate → steps on the path, a far bell → night: crickets, an owl, a faint
// ghungroo → leaves in the wind → the diya; each offering its own small sound → doors creak shut, the chain, the
// lock's click, a low boom, silence → a shutter, a brick → a heartbeat speeding up, bells closing in, a rising roar
// into the white → a ringing silence → dawn birds, a bell, the door → wind → bells as each Krishna appears → shimmer on HEARS → crickets, a bell on RADHE → the card,
// the score at full under it.
import { readFileSync, existsSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, plink, shimmer, note, seed, chime, thud, rnd, drum, om, wind, drone, chirp, heart, crinkle, click, clang, gurgle } from './sfx.mjs';

const TL = runInNewContext(readFileSync('src/scenes/nidhi_vo.js', 'utf8') + '\n' + readFileSync('src/scenes/nidhi_tl.js', 'utf8') + '\n;TL');
const TAU = Math.PI * 2, rr = (a, b) => a + (b - a) * rnd();

// ---------- 1. the score cut ----------
// Two Lyria briefs: a suspense score (tools/nidhi_score_a.txt → takes a1, a2, ~65 s) for the mystery, and a radiant
// devotional one (nidhi_score_b.txt → b2, ~62 s) from the Bhagavatam on. Sections picked by loudness; a volume ramp
// makes the build into the white-out; silence after it; b2's last full statement under the card.
const SRCS = ['assets/nidhi_score_a1.mp3', 'assets/nidhi_score_a2.mp3', 'assets/nidhi_score_b2.mp3'];
if (SRCS.every(existsSync)) {
  // [source, picture start, picture end, take start, fade in, fade out, ramp (fade in as a build)]
  const SEG = [
    [0, 0, TL.F0, 0, 0, .8],
    [1, TL.F0 - .4, TL.H0, 28, .8, .5],
    [0, TL.H0, TL.I0, 34.9 - .0, .3, .4],
    [1, TL.I0 - .2, TL.J0, 38, .5, .4],
    [0, TL.J0, TL.SIGHT + .02, 43, 0, .05, 1],
    [1, TL.K0 - .3, TL.M0 + .3, 30.5, 1.4, 1],
    [2, TL.M0, TL.P0 + .2, 1, .4, 1],
    [2, TL.P0 - .3, TL.CARD + .2, 34, 1, .6],
    [2, TL.CARD - .2, TL.END, 50.5, .4, .9],
  ];
  const parts = SEG.map(([src, a, b, s, fi, fo, ramp], i) => {
    const d = b - a, fin = ramp ? `afade=t=in:d=${d.toFixed(3)}:curve=exp` : `afade=t=in:d=${fi || .01}`;
    return `[${src}:a]atrim=${s}:${(s + d).toFixed(3)},asetpts=PTS-STARTPTS,${fin},afade=t=out:st=${(d - fo).toFixed(3)}:d=${fo},adelay=${Math.round(a * 1000)}|${Math.round(a * 1000)}[p${i}]`;
  });
  const fc = parts.join(';') + ';' + SEG.map((_, i) => `[p${i}]`).join('') + `amix=inputs=${SEG.length}:normalize=0:duration=longest,apad=whole_dur=${TL.END.toFixed(3)},atrim=0:${TL.END.toFixed(3)}[o]`;
  execFileSync('ffmpeg', ['-y', '-v', 'error', ...SRCS.flatMap(f => ['-i', f]), '-filter_complex', fc, '-map', '[o]', '-ar', '48000', '-ac', '2', 'assets/nidhi_score_cut.wav']);
  console.log('assets/nidhi_score_cut.wav');
}

// ---------- 2. the SFX ----------
const T = track(TL.END);
seed(116);
const templeBell = (f = 76, amp = 1, dur = 4) => bell(note(f), dur, { partials: [[1, 1], [2.02, .6], [2.76, .45], [4.1, .3], [5.4, .18]], k: 1.1, amp });
const boom = (amp = 1) => mixb(drum(34, amp, 2.2), thud(amp * 1.1), noise(.8, { lp: 600, e: env.pluck(4), amp: amp * .6 }));
const crickets = (dur, amp = 1, f = 4400) => { const b = new Float32Array(Math.floor(dur * 48000)); for (let i = 0; i < b.length; i++) { const t = i / 48000; b[i] = amp * Math.sin(TAU * f * t) * (Math.sin(TAU * 28 * t) > .2 ? 1 : 0) * (Math.sin(TAU * .9 * t) > 0 ? 1 : .15) * .3 * Math.min(1, t / 1.5, (dur - t) / 1.5); } return b; };
const step = (amp = 1) => mixb(noise(.09, { hp: 200, lp: 1800, e: env.pluck(30), amp }), drum(70, amp * .25, .08));
const rustle = (dur, amp = 1) => crinkle(dur, amp * .6);
// small brass bells on an anklet: a cluster of high bells, scattered
const ghungroo = (amp = 1, n = 9) => { const o = new Float32Array(Math.floor(1.4 * 48000)); for (let i = 0; i < n; i++) { const b = bell(4200 + rnd() * 2600, .5, { partials: [[1, 1], [1.5, .4], [2.3, .2]], k: 9, amp: amp * (.4 + rnd() * .6) }), s = Math.floor(rnd() * .12 * 48000); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j]; } return o; };
const chainRattle = (amp = 1) => { const o = new Float32Array(Math.floor(.9 * 48000)); for (let i = 0; i < 7; i++) { const b = clang(1800 + rnd() * 1600, amp * (.3 + rnd() * .5)), s = Math.floor((i * .07 + rnd() * .05) * 48000); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j] * .5; } return o; };
const lockClick = (amp = 1) => mixb(click(amp), tone(.08, 2600, { e: env.pluck(80), amp: amp * .5 }), noise(.05, { hp: 3000, lp: 9000, e: env.pluck(120), amp: amp * .6 }));
// a wooden door: a creak (a rough rising tone), then optionally the thud of it shutting
const creak = (dur = 1.2, f0 = 140, f1 = 230, amp = 1) => { const b = tone(dur, t => f0 + (f1 - f0) * (t / dur) + 18 * Math.sin(t * 90), { type: 'saw', e: env.hann(), amp: amp * .5 }); let l = 0; for (let i = 0; i < b.length; i++) { l += .08 * (b[i] - l); b[i] = l * (Math.sin(i / 48000 * TAU * 23) > -.3 ? 1 : .2); } return b; };
const owl = (amp = 1) => mixb(tone(.5, t => 370 - 20 * t, { e: env.hann(), amp }), (() => { const b = tone(.9, t => 360 - 30 * t, { e: env.hann(), amp: amp * .8 }); const o = new Float32Array(b.length + 30000); o.set(b, 30000); return o; })());
const ring = (dur, f = 5800, amp = 1) => tone(dur, f, { e: (t, D) => Math.min(1, t / .02) * Math.exp(-t * 1.1), amp });
const swellUp = (dur, amp = 1) => noise(dur, { hp: 200, lp: t => 600 + 9000 * (t / dur) ** 2, e: (t, D) => (t / D) ** 2.4, amp });
const birds = (dur, amp = 1) => { const o = new Float32Array(Math.floor(dur * 48000)); for (let t = .2; t < dur - .3; t += rr(.25, .9)) { const b = chirp(amp * rr(.4, 1)), s = Math.floor(t * 48000); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j]; } return o; };

// ================= A · the lock at dusk =================
T.at(0, wind(TL.C0 + .5, 2, 1.2), .05, 0);
T.at(0, chainRattle(.8), .06, .1);
T.at(0, crickets(TL.D0, .5, 4100), .008, -.3);
T.at(TL.NOBODY - .05, drum(40, .6, 1.2), .07, 0);
T.at(TL.SUNSET - .1, templeBell(64, .6, 5), .05, -.4);
// ================= B · through the gate =================
T.at(TL.B0 - .3, whoosh(1.6, 300, 1800, .6), .06, 0);
T.at(TL.B0 + .2, creak(1.6, 120, 180, .7), .03, .2);
T.at(TL.BELIEVE - .1, mixb(chime(note(81), .5, 3), drone(4, note(38), .5)), .06, 0);
// ================= C · the path at dusk =================
for (let t = TL.C0 + .3; t < TL.D0; t += .62) T.at(t + rr(-.04, .04), step(rr(.5, .8)), .04, rr(-.3, .3));
T.at(TL.NIDHIVAN - .1, templeBell(57, .9, 6), .07, 0);
T.at(TL.BANKE - .05, chime(note(84), .5, 3), .04, .3);
T.at(TL.C0, birds(TL.D0 - TL.C0, .4), .02, -.4);
// ================= D · night falls =================
T.at(TL.D0 - .3, whoosh(1.4, 1800, 300, .5), .05, 0);
T.at(TL.D0, crickets(TL.F0 - TL.D0, 1, 4400), .02, .3);
T.at(TL.D0 + .4, wind(TL.F0 - TL.D0, 4, 2), .04, 0);
T.at(TL.KRISHNA - .3, owl(.6), .03, -.6);
T.at(TL.MAHARAAS - .1, ghungroo(.4, 7), .03, .5);
T.at(TL.MAHARAAS + .5, ghungroo(.3, 6), .02, -.5);
// ================= E · the pair =================
T.at(TL.E0, rustle(TL.F0 - TL.E0, 1), .03, 0);
T.at(TL.NIGHT - .2, creak(2, 90, 120, .5), .025, -.3);
T.at(TL.GOPIS2 - .1, mixb(shimmer(1.6, [note(88), note(91), note(95)], .5, .12), ghungroo(.4, 5)), .04, 0);
// ================= F · the Rang Mahal =================
T.at(TL.F0 - .2, whoosh(1, 400, 1500, .5), .04, 0);
T.at(TL.F0, crickets(TL.H0 - TL.F0, .5, 4300), .006, 0);
T.at(TL.F0, noise(TL.H0 - TL.F0, { hp: 300, lp: 2500, e: env.swell(.5, .5), amp: .25 }), .015, 0);   // the diya's breath
T.at(TL.BED - .05, chime(note(79), .5, 2.5), .04, 0);
// ================= G · the offerings =================
T.at(TL.WATER - .05, gurgle(.6, .7), .05, -.2);
T.at(TL.PAAN - .05, crinkle(.35, .9), .05, .2);
T.at(TL.SWEETS - .05, clang(note(86), .5), .04, 0);
T.at(TL.NEEM - .05, mixb(click(.9), noise(.12, { hp: 1500, lp: 6000, e: env.pluck(30), amp: .6 })), .05, -.2);
T.at(TL.BANGLES - .05, mixb(ghungroo(.8, 6), shimmer(1, [note(96), note(98), note(101)], .4, .05)), .05, .2);
T.at(TL.SINDOOR - .05, click(.7), .05, 0);
// ================= H · locked =================
T.at(TL.H0 + .2, creak(1.4, 130, 90, 1), .05, 0);
T.at(TL.LOCKED + .15, mixb(thud(1), drum(50, .8, .9)), .12, 0);
T.at(TL.OUTSIDE - .2, chainRattle(1), .1, 0);
T.at(TL.OUTSIDE + .22, lockClick(1.2), .14, 0);
T.at(TL.OUTSIDE + .25, boom(.8), .16, 0);
// ================= I · the windows =================
T.at(TL.I0, wind(TL.J0 - TL.I0, 1, 1.4), .05, 0);
T.at(TL.WINDOWS - .1, mixb(thud(.8), click(.5)), .07, .3);
T.at(TL.BRICKED - .05, mixb(thud(1), noise(.25, { hp: 300, lp: 2500, e: env.pluck(14), amp: .5 })), .08, 0);
// ================= J · the warning: the peek =================
T.at(TL.J0, crickets(TL.SIGHT - TL.J0, .7, 4600), .012, .2);
{ let t = TL.WARN - .3, dt = .9; while (t < TL.SIGHT - .35) { T.at(t, heart(.9), .1, 0); t += dt; dt = Math.max(.32, dt * .9); } }
for (let t = TL.J0 + .8; t < TL.SIGHT - .4; t += rr(.35, .7)) T.at(t, ghungroo(rr(.3, .7) * (.4 + .6 * (t - TL.J0) / (TL.SIGHT - TL.J0)), 6), .04, rr(-.6, .6));
T.at(TL.WATCH - .4, swellUp(TL.SIGHT - TL.WATCH + .4, 1), .12, 0);
T.at(TL.SIGHT - .05, mixb(boom(1), shimmer(1.2, [note(84), note(88), note(91), note(96)], .6, .03)), .14, 0);
T.at(TL.SIGHT + .05, ring(TL.K0 - TL.SIGHT, 5800, .6), .02, 0);
T.at(TL.MIND - .05, drum(36, .7, 1.4), .08, 0);
// ================= K · dawn =================
T.at(TL.K0, birds(TL.M0 - TL.K0 - .5, .7), .03, .3);
T.at(TL.K0 + .2, creak(1.8, 100, 170, .9), .04, 0);
T.at(TL.DAWN - .1, templeBell(69, .7, 5), .05, -.4);
T.at(TL.SLEPT - .05, chime(note(76), .4, 2), .03, 0);
// ================= L · true? =================
T.at(TL.L0, wind(TL.M0 - TL.L0, 3, 1.2), .04, 0);
T.at(TL.TRUE - .05, mixb(drum(38, .8, 1.6), chainRattle(.4)), .08, 0);
// ================= M · the Raas =================
T.at(TL.M0 - .3, whoosh(1.2, 300, 2400, .5), .05, 0);
T.at(TL.BHAG - .05, templeBell(60, .8, 6), .06, 0);
T.at(TL.M0, crickets(TL.O0 - TL.M0, .5, 4400), .008, -.3);
for (let i = 0; i < 11; i++) { const t = TL.MANY - .1 + i * 1.6 / 11; T.at(t, mixb(chime(note(84 + [0, 3, 5, 7, 10, 12][i % 6]), .5, 2), ghungroo(.4, 4)), .035, (i % 2 ? .4 : -.4)); }
// ================= O · whoever hears it =================
T.at(TL.HEARS - .1, shimmer(2, [note(79), note(84), note(88), note(91)], .6, .1), .05, 0);
T.at(TL.DISEASE - .1, templeBell(64, .7, 5), .05, 0);
// ================= P · do you believe? RADHE RADHE =================
T.at(TL.P0, crickets(TL.CARD - TL.P0, .8, 4400), .012, 0);
T.at(TL.P0, wind(TL.CARD - TL.P0, 2, 1.4), .03, 0);
T.at(TL.COMES - .1, ghungroo(.4, 6), .03, .4);
T.at(TL.RADHE - .1, mixb(templeBell(64, .9, 6), shimmer(1.6, [note(81), note(84), note(88), note(93)], .5, .1)), .06, 0);
// ================= the card =================
T.at(TL.CARD - .3, whoosh(.7, 400, 3200), .1, 0);
T.at(TL.CARD + .35, mixb(...[67, 71, 74, 79].map((m) => bell(note(m), 2.2, { partials: [[1, 1], [2, .35], [3, .12]], k: 1.4, amp: .7 }))), .1, 0);

T.write('assets/nidhi_sfx.wav');
console.log('assets/nidhi_sfx.wav', TL.END.toFixed(2), 's');

// ---------- 3. the mix ----------
const D = TL.END.toFixed(3), score = existsSync('assets/nidhi_score_cut.wav') ? 'assets/nidhi_score_cut.wav' : null;
const inputs = ['-i', 'assets/nidhi_vo.wav', '-i', 'assets/nidhi_sfx.wav', ...(score ? ['-i', score] : [])];
const fc = score
  ? `[0:a]volume=1.15,apad=whole_dur=${D},asplit[v][vk];[1:a]volume=0.75[s];[2:a]volume='if(gte(t,${TL.CARD.toFixed(2)}),1.1,0.55)':eval=frame[m0];[m0][vk]sidechaincompress=threshold=0.04:ratio=3:attack=40:release=450:makeup=1[m];[v][s][m]amix=inputs=3:normalize=0:duration=longest,apad=whole_dur=${D},atrim=0:${D},loudnorm=I=-14:TP=-1.5:LRA=11[o]`
  : `[1:a]volume=0.95[s];[0:a][s]amix=inputs=2:normalize=0:duration=longest,apad=whole_dur=${D},atrim=0:${D},loudnorm=I=-14:TP=-1.5:LRA=11[o]`;
execFileSync('ffmpeg', ['-y', '-v', 'error', ...inputs, '-filter_complex', fc, '-map', '[o]', '-ar', '48000', '-ac', '2', 'assets/nidhi_mix.wav']);
console.log('assets/nidhi_mix.wav', score ? '(with the score)' : '(voice + SFX)');
