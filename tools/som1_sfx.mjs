// som1_sfx.mjs: the sound of ad 120, 12 JYOTIRLINGAS Episode 1: Somnath I (src/scenes/som1.js). Times from the voice and
// the timeline (src/scenes/som1_vo.js + som1_tl.js, loaded with vm), in step with the scene.
//   1. the score: a Lyria take (assets/som1_score_<n>.mp3, --take=n) cut to the picture → assets/som1_score_cut.wav
//   2. the SFX → assets/som1_sfx.wav
//   3. the mix: the voice over the SFX and the score (ducked under the voice, up under the card), -14 LUFS
//      → assets/som1_mix.wav
import { readFileSync, existsSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, shimmer, note, seed, chime, thud, rnd, drum, om, wind, drone, crunch, crackle, fire, conch, click, clang, damru } from './sfx.mjs';

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const { VO, TL } = runInNewContext(readFileSync('src/scenes/som1_vo.js', 'utf8') + '\n' + readFileSync('src/scenes/som1_tl.js', 'utf8') + '\n;({ VO, TL })');
const TAU = Math.PI * 2, rr = (a, b) => a + (b - a) * rnd(), LN = VO.lines, END = TL.END;

// ---------- 1. the score ----------
// [picture start, picture end, take start, fade in, fade out, volume, tempo]. Take 3 (120.4 s for a 112 s brief) follows
// the brief's sections (the hit at 0:04, the curse's drop at 0:12) but drifts ~5 s late by its final chord (at ~1:52
// against 1:47 asked): played 4.5% faster, whole, its chord lands on the card.
// Since the myth bust grew (owner, 27 Nov: Ghazni, 17 raids, one hit Somnath), the take is spliced: 4.5% faster to the
// myth bust; its tense stretch (take 79.5–) under the myth bust; its quiet, questioning stretch (take 104–) under the ask
// and next; its final chord (take 111.2–) under the card.
const J1 = TL.MY0 - .1, J2 = TL.ASK - .1, J3 = TL.CARD - .3;
const CUTS = {
  3: [[0, J1 + .4, 0, 0, .5, 1, 1.045], [J1 - .1, J2 + .4, 79.5, .4, .5, .9], [J2 - .1, J3 + .4, 104, .4, .5, 1], [J3 - .1, END, 111.2, .4, 1.2, 1]],
};
const take = args.take || 3, SRC = `assets/som1_score_${take}.mp3`;
if (existsSync(SRC)) {
  const SEG = CUTS[take] || [[0, END, 0, 0, 1.5, 1]];
  const parts = SEG.map(([a, b, st, fi, fo, v, tp = 1], i) => { const d = b - a; return `[0:a]atrim=${st}:${(st + d * tp).toFixed(3)},asetpts=PTS-STARTPTS,atempo=${tp},volume=${v},afade=t=in:d=${fi || .01},afade=t=out:st=${(d - fo).toFixed(3)}:d=${fo},adelay=${Math.round(a * 1000)}|${Math.round(a * 1000)}[p${i}]`; });
  const fc = parts.join(';') + ';' + SEG.map((_, i) => `[p${i}]`).join('') + `amix=inputs=${SEG.length}:normalize=0:duration=longest,apad=whole_dur=${END.toFixed(3)},atrim=0:${END.toFixed(3)}[o]`;
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', SRC, '-filter_complex', fc, '-map', '[o]', '-ar', '48000', '-ac', '2', 'assets/som1_score_cut.wav']);
  console.log('assets/som1_score_cut.wav from', SRC);
}

// ---------- 2. the SFX ----------
const T = track(END);
seed(120);
const lp1 = (b, fc) => { const a = 1 - Math.exp(-TAU * fc / 48000); let l = 0; for (let i = 0; i < b.length; i++) { l += a * (b[i] - l); b[i] = l; } return b; };
const sub = (amp = 1, dur = 3) => mixb(tone(dur, t => 26 + 36 * Math.exp(-t * 2.2), { e: (t, D) => Math.min(1, t / .006) * Math.exp(-t * 1.5), amp }), thud(amp * .9), lp1(noise(dur * .7, { e: env.pluck(2.2), amp: amp * .5 }), 260));
const braam = (amp = 1, dur = 3.4) => lp1(mixb(...[note(31), note(38), note(43), note(31) * 1.004].map((f, i) => tone(dur, t => f * (1 + .002 * Math.sin(t * 5 + i)), { type: 'saw', e: (t, D) => Math.min(1, t / .07) * Math.exp(-t * 1.1), amp: amp * (i === 2 ? .5 : .8) }))), 420);
const riser = (dur, amp = 1) => mixb(noise(dur, { hp: 300, lp: t => 500 + 9000 * (t / dur) ** 2.2, e: (t, D) => (t / D) ** 2.6, amp }), tone(dur, t => 140 * Math.pow(9, t / dur), { type: 'tri', e: (t, D) => (t / D) ** 3, amp: amp * .35 }));
const fall = (dur, amp = 1) => mixb(tone(dur, t => 900 * Math.pow(.08, t / dur), { type: 'tri', e: (t, D) => Math.min(1, t / .05) * (1 - t / D), amp: amp * .5 }), noise(dur, { hp: 200, lp: t => 6000 * Math.pow(.05, t / dur) + 300, e: (t, D) => (1 - t / D), amp: amp * .6 }));
const templeBell = (f = 76, amp = 1, dur = 4) => bell(note(f), dur, { partials: [[1, 1], [2.02, .6], [2.76, .45], [4.1, .3], [5.4, .18]], k: 1.1, amp });
const debris = (dur, amp = 1) => { const o = new Float32Array(Math.floor(dur * 48000)); for (let t = 0; t < dur; t += rr(.015, .08)) { const k = Math.exp(-t * 1.6), b = mixb(click(amp * k * rr(.3, 1)), drum(rr(90, 260), amp * k * rr(.1, .4), .08)), s = Math.floor(t * 48000); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j]; } return o; };
const crash = (amp = 1) => mixb(sub(amp, 3), crunch(amp), lp1(noise(1.6, { hp: 80, lp: 3000, e: env.pluck(2.5), amp: amp * .7 }), 2400), debris(2.4, amp * .6));
const clacks = (dur, amp = 1) => { const o = new Float32Array(Math.floor(dur * 48000)); let dt = .22; for (let t = 0; t < dur; t += dt) { dt = Math.max(.035, dt * .9); const b = mixb(click(amp * .6), drum(rr(140, 300), amp * .35, .06)), s = Math.floor(t * 48000); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j]; } return o; };
const stamp = (amp = 1) => mixb(thud(amp), drum(60, amp * .7, .3), click(amp * .8), noise(.06, { hp: 800, lp: 4000, e: env.pluck(60), amp: amp * .5 }));
const tick = (amp = 1) => mixb(tone(.05, 1100, { e: env.pluck(90), amp }), noise(.03, { hp: 1500, lp: 5000, e: env.pluck(150), amp: amp * .5 }));
const key = (amp = 1) => mixb(click(amp), noise(.025, { hp: 1200, lp: 6000, e: env.pluck(200), amp: amp * .6 }), drum(rr(500, 700), amp * .2, .03));
const sea = (dur, amp = 1) => noise(dur, { brown: true, lp: t => 500 + 300 * Math.sin(t * .9), hp: 60, e: (t, D) => Math.min(1, t / .3, (D - t) / .5) * (.6 + .4 * Math.sin(t * 1.1)), amp });
const march = (t0, t1, amp = 1) => { let i = 0; for (let t = t0; t < t1; t += .333, i++) { T.at(t, drum(i % 4 === 0 ? 52 : 66, amp * (i % 2 ? .6 : 1), .5), .1, 0); if (i % 2) T.at(t + .166, damru(260, amp * .35), .04, rr(-.4, .4)); } };
const coin = (amp = 1) => mixb(...[1, 2.76, 5.4].map((k, i) => tone(.5, 2600 * k * rr(.97, 1.03), { e: env.pluck(9 + i * 4), amp: amp * [.5, .25, .12][i] })));

// ================= the hook and the ident =================
T.at(0, sub(.9, 2.6), .14, 0);
T.at(0, sea(TL.ID0 + .2, 1), .1, 0);
T.at(0, wind(TL.ID0, 1, .6), .04, 0);
T.at(TL.STAND, mixb(templeBell(64, .8, 4), shimmer(1.4, [note(76), note(79), note(83)], .5, .05)), .08, 0);
T.at(TL.ID0 - .45, riser(.45, .8), .07, 0);
T.at(TL.ID0, mixb(sub(1, 2.4), drum(44, 1, 1.2)), .18, 0);
T.at(TL.ID0 + .05, conch(1.6, 311, .8), .07, 0);
// ================= the story =================
T.at(TL.S0, wind(TL.LK0 - TL.S0, 7, .5), .03, 0);
T.at(TL.S0, sea(TL.ST0 - TL.S0, .7), .05, 0);
for (let i = 0; i < 27; i++) { const t = TL.N27 - .4 + (TL.MOON + .7 - TL.N27) * i / 27; T.at(t, chime(note(84 + [0, 2, 4, 7, 9][i % 5] + (i % 10 >= 5 ? 12 : 0)), .35, 1.2), .022, i % 2 ? .45 : -.45); }
T.at(TL.ROHINI - .1, shimmer(2.2, [note(79), note(83), note(86), note(91)], .6, .07), .07, .2);
T.at(TL.CURSED - .05, mixb(braam(1, 3.2), sub(.8, 2.4)), .16, 0);
T.at(TL.CURSED, mixb(clang(note(73), .5), clang(note(74), .5)), .04, 0);
T.at(TL.WASTE, fall(1.6, 1), .08, 0);
T.at(TL.WASTE, drone(TL.PR0 - TL.WASTE + .4, note(31), .6), .06, 0);
T.at(TL.PR0, whoosh(1, 2600, 300, .5), .05, 0);
T.at(TL.CHANT - .1, om(TL.BOON0 - TL.CHANT + .3, 110, .9), .09, 0);
for (let t = TL.SIX - .2; t < TL.BOON0 - .1; t += .12) T.at(t, tick(.35), .02, rr(-.3, .3));
T.at(TL.BOON0 - .6, riser(.6, .9), .08, 0);
T.at(TL.BOON0 + .05, mixb(sub(1, 2.6), templeBell(62, 1, 6), shimmer(2.4, [note(74), note(79), note(83), note(86), note(91)], .8, .1)), .16, 0);
T.at(TL.BOON0 + .1, om(TL.ST0 - TL.BOON0 + .4, 98, .7), .06, 0);
T.at(TL.WANE, fall(1.4, .5), .04, -.3);
T.at(TL.GROW, riser(1.4, .5), .04, .3);
T.at(TL.ST0, whoosh(1, 300, 2400, .5), .05, 0);
T.at(TL.ST0 + .2, clacks(TL.SOMNATH - TL.ST0, .8), .06, 0);
T.at(TL.SOMNATH + .1, mixb(templeBell(67, 1, 5), thud(.7)), .12, 0);
// ================= the look =================
T.at(TL.LK0, mixb(wind(TL.RD0 - TL.LK0, 4, .5), sea(TL.RD0 - TL.LK0, .5)), .05, 0);
T.at(TL.MARU - .05, mixb(templeBell(71, .6, 3), click(.3)), .05, 0);
T.at(TL.MARU + .3, tick(.6), .04, .3); T.at(TL.MARU + 1.45, tick(.6), .04, -.2);
T.at(TL.ARROW - .1, whoosh(.9, 600, 3000, .7), .07, 0);
T.at(TL.ARROW + .5, stamp(.8), .1, .2);
// ================= the dark =================
T.at(TL.RD0 - .2, braam(1, 3.4), .12, 0);
march(TL.RD0 + .2, TL.NM0 + .4, 1);
T.at(TL.RD0, crackle(TL.BK0 - TL.RD0, .6), .04, -.3);
TL.YR.forEach((t, i) => { T.at(t - .05, crash(1 + i * .05), .2, [-.2, .2, -.1, .1, 0][i]); T.at(t + .25, stamp(.9), .12, 0); T.at(t + .1, fire(1.2, .7, .3), .05, 0); });
T.at(TL.NM0, fire(TL.BK0 - TL.NM0 + .4, 1, .6), .1, 0);
T.at(TL.NAMES - .05, mixb(sub(.9, 2.4), stamp(1.1)), .16, 0);
// ================= the light =================
T.at(TL.BK0, wind(TL.R[0] - TL.BK0, 2, .8), .05, 0);
T.at(TL.BK0 + .2, riser(TL.BACK - TL.BK0 - .2, .7), .06, 0);
T.at(TL.BACK - .05, mixb(templeBell(62, 1, 5), thud(.8)), .12, 0);
T.at(TL.BACK + .3, clacks(TL.R[0] - TL.BACK, .7), .04, 0);
TL.R.forEach((t, i) => { T.at(t, mixb(drum(48, 1, 1), thud(.7), shimmer(1.2, [note(67 + i * 2), note(74 + i * 2), note(79 + i * 2)], .5, .04)), .14, 0); T.at(t + .2, clacks(.9, .6), .04, i % 2 ? .3 : -.3); });
T.at(TL.AH0 + .2, clacks(TL.AHNAME + 1.2 - TL.AH0, .6), .05, -.2);
T.at(TL.AHNAME, templeBell(69, .7, 4), .06, 0);
T.at(TL.AH2, mixb(shimmer(2.6, [note(72), note(76), note(79), note(84)], .7, .06), templeBell(60, .6, 6)), .08, 0);
for (let i = 0; i < 19; i++) { const t = TL.AH3 + .3 + i * ((TL.RAMES - TL.AH3 - .6) / 19); T.at(t, chime(note(76 + [0, 3, 5, 7, 10][i % 5] + (i % 10 >= 5 ? 12 : 0)), .4, 1.4), .03, i % 2 ? .4 : -.4); }
T.at(TL.BADRI - .05, templeBell(72, .5, 3), .05, -.3); T.at(TL.RAMES - .05, templeBell(67, .5, 3), .05, .3);
T.at(TL.PT0, mixb(drum(44, 1, 1.2), sub(.6, 2)), .14, 0);
T.at(TL.PT0 + .1, mixb(click(.8), noise(.08, { hp: 1500, lp: 6000, e: env.pluck(40), amp: .5 })), .06, .2);
T.at(TL.PATEL - .05, shimmer(1.6, [note(67), note(74), note(79)], .5, .05), .06, 0);
T.at(TL.REBUILD - .05, mixb(stamp(1.2), drum(52, .9, .6)), .16, 0);
for (let i = 0; i < 70; i++) T.at(TL.PT2 + .3 + (TL.ONE - TL.PT2 - .5) * i / 70, tick(.3 + .3 * rnd()), .025, rr(-.5, .5));
T.at(TL.ONE - .05, mixb(sub(.9, 2.6), templeBell(62, .9, 5), shimmer(2, [note(67), note(71), note(74), note(79)], .7, .08)), .14, 0);
// ================= the government story =================
T.at(TL.GA0, wind(TL.LT0 - TL.GA0, 5, .5), .04, 0);
for (let i = 0; i < 26; i++) T.at(TL.PEOPLE - .4 + i * .09, coin(rr(.4, 1)), .03, rr(-.5, .5));
T.at(TL.LT0, whoosh(.6, 2000, 500, .5), .05, 0);
{ let n = 0; for (let t = TL.LT0 + .55; t < TL.LT0 + 2.35; t += rr(.05, .09), n++) T.at(t, key(rr(.5, 1)), .05, rr(-.2, .2)); T.at(TL.LT0 + 2.4, clang(note(96), .3), .02, .3); }
T.at(TL.PRASAD - .05, mixb(click(.8), noise(.08, { hp: 1500, lp: 6000, e: env.pluck(40), amp: .5 })), .06, .2);
T.at(TL.PRASAD - .05, mixb(drum(48, .9, 1), shimmer(1.4, [note(69), note(74), note(78)], .5, .05)), .12, 0);
T.at(TL.IN0 - .3, riser(.5, .6), .05, 0);
T.at(TL.LINGA - .1, mixb(sub(1, 3), templeBell(60, 1.1, 6), conch(2.2, 311, .7)), .14, 0);
// ================= the myth bust =================
T.at(TL.MY0 - .2, whoosh(.6, 500, 3000, .7), .07, 0);
T.at(TL.MY0 + .1, mixb(drum(44, 1, .8), thud(.8)), .14, 0);
T.at(TL.NO - .05, mixb(stamp(1.2), crunch(.5)), .16, 0);
T.at(TL.MY2, whoosh(.7, 2600, 400, .6), .06, 0);
T.at(TL.GHAZNI - .05, mixb(drum(44, .9, 1), braam(.6, 2.4)), .12, 0);
for (let i = 0; i < 17; i++) { const t = TL.M3 + .15 + i * ((TL.ONE1 - TL.M3 - .5) / 17); T.at(t, mixb(whoosh(.35, 600, 2400, .35), drum(70 + (i % 4) * 8, .4, .2)), .045, rr(-.4, .4)); }
T.at(TL.ONE1 - .05, mixb(stamp(1.1), sub(.7, 2)), .16, 0);
T.at(TL.M4, whoosh(.6, 500, 3000, .6), .06, 0);
T.at(TL.FIVE - .1, mixb(drum(48, 1, 1), sub(.6, 2)), .14, 0);
for (let i = 0; i < 5; i++) T.at(TL.FIVE + .3 + i * .1, drum(60 + i * 6, .8, .4), .08, -.4 + i * .2);
// ================= the ask, next, the card =================
T.at(TL.ASK, mixb(templeBell(64, .7, 5), sea(TL.CARD - TL.ASK, .6)), .06, 0);
T.at(TL.JAI - .05, shimmer(2, [note(72), note(76), note(79), note(84)], .6, .06), .06, 0);
T.at(TL.NX0, whoosh(.8, 400, 2600, .5), .05, 0);
T.at(TL.POLE - .4, whoosh(1.2, 300, 3000, .7), .06, 0);
T.at(TL.CARD - .3, whoosh(.7, 400, 3200), .08, 0);
T.at(TL.CARD + .35, mixb(...[62, 67, 71, 74].map((m) => bell(note(m), 2.6, { partials: [[1, 1], [2, .35], [3, .12]], k: 1.2, amp: .7 }))), .1, 0);

T.write('assets/som1_sfx.wav');
console.log('assets/som1_sfx.wav', END.toFixed(2), 's');

// ---------- 3. the mix (voice padded before the split, so the score stays up under the card) ----------
const D = END.toFixed(3), score = existsSync('assets/som1_score_cut.wav') && !args.noscore ? 'assets/som1_score_cut.wav' : null;
const inputs = ['-i', 'assets/som1_vo.wav', '-i', 'assets/som1_sfx.wav', ...(score ? ['-i', score] : [])];
const fc = score
  ? `[0:a]volume=1.15,apad=whole_dur=${D},asplit[v][vk];[1:a]volume=0.8[s];[2:a]volume='if(gte(t,${TL.CARD.toFixed(2)}),1.1,0.6)':eval=frame[m0];[m0][vk]sidechaincompress=threshold=0.04:ratio=3:attack=40:release=450:makeup=1[m];[v][s][m]amix=inputs=3:normalize=0:duration=longest,apad=whole_dur=${D},atrim=0:${D},loudnorm=I=-14:TP=-1.5:LRA=11[o]`
  : `[1:a]volume=0.95[s];[0:a]apad=whole_dur=${D}[v];[v][s]amix=inputs=2:normalize=0:duration=longest,apad=whole_dur=${D},atrim=0:${D},loudnorm=I=-14:TP=-1.5:LRA=11[o]`;
execFileSync('ffmpeg', ['-y', '-v', 'error', ...inputs, '-filter_complex', fc, '-map', '[o]', '-ar', '48000', '-ac', '2', 'assets/som1_mix.wav']);
console.log('assets/som1_mix.wav', score ? '(with the score)' : '(voice + SFX)');
