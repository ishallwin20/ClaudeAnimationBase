// jtrail_sfx.mjs: the sound of ad 119, the 12 JYOTIRLINGAS trailer (src/scenes/jtrail.js). Times from the voice
// (src/scenes/jtrail_vo.js, loaded with vm), in step with the scene's TL.
//   1. the score: a Lyria take (assets/jtrail_score_<n>.mp3, --take=n) trimmed to the reel, its own ending under the card
//      → assets/jtrail_score_cut.wav
//   2. the SFX → assets/jtrail_sfx.wav: the sea under the hook; stone blown apart on each AGAIN (sub, crash, debris);
//      the rubble rising back with clacks and a bell on FAILED; an om under the pillar of light; a chime as each of the
//      twelve rises; marching drums, torches and fire for the raiders; a crash on BROKE, a roar on BURNED; a stamp on
//      each redacted name; a bell and a drum on each rebuilder; a clock under the questions; a conch and a boom on the
//      title; a stamp on TONIGHT; bells under the card.
//   3. the mix: the voice over the SFX and the score (ducked under the voice, up under the card), -14 LUFS
//      → assets/jtrail_mix.wav
import { readFileSync, existsSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import { track, tone, noise, bell, mixb, env, whoosh, shimmer, note, seed, chime, thud, rnd, drum, om, wind, drone, crunch, crackle, fire, conch, click, clang, damru } from './sfx.mjs';

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const VO = runInNewContext(readFileSync('src/scenes/jtrail_vo.js', 'utf8') + '\n;VO');
const TAU = Math.PI * 2, rr = (a, b) => a + (b - a) * rnd();
const LN = VO.lines;
const Wd = (id, word, n = 0) => { const hits = []; VO.caps.filter(c => c.id === id).forEach(c => c.text.split(/\s+/).filter(w => w && w !== '|').forEach((w, i) => { if (w.replace(/[*“”"'’.,:?!…]/g, '').toLowerCase() === word.toLowerCase()) hits.push(c.at[i]); })); return hits[n]; };
const TL = {
  AGAIN1: Wd('again', 'again'), AGAIN2: Wd('again', 'again', 1), FAILED: Wd('failed', 'failed'), L0: LN.light.a - .25, LIGHT: Wd('light', 'light'),
  M0: LN.twelve.a - .15, KEDAR: Wd('twelve', 'kedarnath'), RAMES: Wd('twelve', 'rameswaram'), D0: LN.dark.a - .2, LOOTED: Wd('dark', 'looted'), BROKE: Wd('dark', 'broke'), BURNED: Wd('dark', 'burned'),
  N0: LN.names.a - .15, NOT: Wd('names', 'not'), K0: LN.kings.a - .15, REBUILT: Wd('kings', 'rebuilt'),
  R: VO.caps.filter(c => c.id === 'roll').map(c => c.at[0] - .05), S0: LN.stone.a - .1, STONE2: Wd('stone', 'stone'), F0: LN.faq.a - .15, Q1: LN.q1.a - .15, Q2: LN.q2.a - .15, Q3: LN.q3.a - .15,
  T0: LN.title.a - .15, ASK: LN.ask.a - .15, CARD: LN.ask.end + .7,
};
TL.END = 58.5;

// ---------- 1. the score ----------
// Lyria take 2 (81 s; the brief asked for 58.7) cut by loudness to the picture: its opening (the hits, the swell, the
// awe) under the hook and the twelve; its dark march under the raiders; its heroic theme under the rebuilders; a calmer
// stretch, lower, under the questions; its last statement and final chord under the title, the ask and the card.
const take = args.take || 2, SRC = `assets/jtrail_score_${take}.mp3`;
if (existsSync(SRC)) {
  // [picture start, picture end, take start, fade in, fade out, volume]
  const SEG = [[0, TL.D0 + .25, 0, 0, .5, 1], [TL.D0, TL.K0 + .3, 22.3, .3, .5, 1], [TL.K0, TL.F0 + .3, 36, .4, .5, 1],
    [TL.F0, TL.T0 + .2, 49.5, .4, .3, .55], [TL.T0 - .1, TL.END, 64.7, .05, 1.2, 1]];
  const parts = SEG.map(([a, b, st, fi, fo, v], i) => { const d = b - a; return `[0:a]atrim=${st}:${(st + d).toFixed(3)},asetpts=PTS-STARTPTS,volume=${v},afade=t=in:d=${fi || .01},afade=t=out:st=${(d - fo).toFixed(3)}:d=${fo},adelay=${Math.round(a * 1000)}|${Math.round(a * 1000)}[p${i}]`; });
  const fc = parts.join(';') + ';' + SEG.map((_, i) => `[p${i}]`).join('') + `amix=inputs=${SEG.length}:normalize=0:duration=longest,apad=whole_dur=${TL.END.toFixed(3)},atrim=0:${TL.END.toFixed(3)}[o]`;
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', SRC, '-filter_complex', fc, '-map', '[o]', '-ar', '48000', '-ac', '2', 'assets/jtrail_score_cut.wav']);
  console.log('assets/jtrail_score_cut.wav from', SRC);
}

// ---------- 2. the SFX ----------
const T = track(TL.END);
seed(119);
const lp1 = (b, fc) => { const a = 1 - Math.exp(-TAU * fc / 48000); let l = 0; for (let i = 0; i < b.length; i++) { l += a * (b[i] - l); b[i] = l; } return b; };
const sub = (amp = 1, dur = 3) => mixb(tone(dur, t => 26 + 36 * Math.exp(-t * 2.2), { e: (t, D) => Math.min(1, t / .006) * Math.exp(-t * 1.5), amp }), thud(amp * .9), lp1(noise(dur * .7, { e: env.pluck(2.2), amp: amp * .5 }), 260));
const braam = (amp = 1, dur = 3.4) => lp1(mixb(...[note(31), note(38), note(43), note(31) * 1.004].map((f, i) => tone(dur, t => f * (1 + .002 * Math.sin(t * 5 + i)), { type: 'saw', e: (t, D) => Math.min(1, t / .07) * Math.exp(-t * 1.1), amp: amp * (i === 2 ? .5 : .8) }))), 420);
const riser = (dur, amp = 1) => mixb(noise(dur, { hp: 300, lp: t => 500 + 9000 * (t / dur) ** 2.2, e: (t, D) => (t / D) ** 2.6, amp }), tone(dur, t => 140 * Math.pow(9, t / dur), { type: 'tri', e: (t, D) => (t / D) ** 3, amp: amp * .35 }));
const templeBell = (f = 76, amp = 1, dur = 4) => bell(note(f), dur, { partials: [[1, 1], [2.02, .6], [2.76, .45], [4.1, .3], [5.4, .18]], k: 1.1, amp });
// stone: a crash of many blocks (a low boom, cracks, then debris pattering down)
const debris = (dur, amp = 1) => { const o = new Float32Array(Math.floor(dur * 48000)); for (let t = 0; t < dur; t += rr(.015, .08)) { const k = Math.exp(-t * 1.6), b = mixb(click(amp * k * rr(.3, 1)), drum(rr(90, 260), amp * k * rr(.1, .4), .08)), s = Math.floor(t * 48000); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j]; } return o; };
const crash = (amp = 1) => mixb(sub(amp, 3), crunch(amp), lp1(noise(1.6, { hp: 80, lp: 3000, e: env.pluck(2.5), amp: amp * .7 }), 2400), debris(2.4, amp * .6));
// stones flying back: clacks landing faster and faster
const clacks = (dur, amp = 1) => { const o = new Float32Array(Math.floor(dur * 48000)); let dt = .22; for (let t = 0; t < dur; t += dt) { dt = Math.max(.035, dt * .9); const b = mixb(click(amp * .6), drum(rr(140, 300), amp * .35, .06)), s = Math.floor(t * 48000); for (let j = 0; j < b.length && s + j < o.length; j++) o[s + j] += b[j]; } return o; };
const stamp = (amp = 1) => mixb(thud(amp), drum(60, amp * .7, .3), click(amp * .8), noise(.06, { hp: 800, lp: 4000, e: env.pluck(60), amp: amp * .5 }));
const tick = (amp = 1) => mixb(tone(.05, 1100, { e: env.pluck(90), amp }), noise(.03, { hp: 1500, lp: 5000, e: env.pluck(150), amp: amp * .5 }));
const sea = (dur, amp = 1) => noise(dur, { brown: true, lp: t => 500 + 300 * Math.sin(t * .9), hp: 60, e: (t, D) => Math.min(1, t / .3, (D - t) / .5) * (.6 + .4 * Math.sin(t * 1.1)), amp });
const march = (t0, t1, amp = 1) => { let i = 0; for (let t = t0; t < t1; t += .333, i++) { T.at(t, drum(i % 4 === 0 ? 52 : 66, amp * (i % 2 ? .6 : 1), .5), .1, 0); if (i % 2) T.at(t + .166, damru(260, amp * .35), .04, rr(-.4, .4)); } };

// ================= 1 · the hook =================
T.at(0, sub(.9, 2.6), .14, 0);
T.at(0, sea(TL.AGAIN1 + .2, 1), .1, 0);
T.at(0, wind(TL.AGAIN1, 1, .6), .04, 0);
T.at(TL.AGAIN1 - .5, riser(.5, .8), .06, 0);
// ================= 2–3 · AGAIN, AGAIN =================
T.at(TL.AGAIN1, crash(1), .2, -.15);
T.at(TL.AGAIN1 + .1, fire(1.3, .8, .3), .05, 0);
T.at(TL.AGAIN2, crash(1.05), .2, .15);
T.at(TL.AGAIN2 + .1, fire(1, .8, .3), .05, 0);
// ================= 4 · they FAILED: the stones fly back =================
T.at(LN.failed.a - .05, whoosh(1.2, 3000, 300, .7), .06, 0);
T.at(LN.failed.a + .1, riser(TL.FAILED - LN.failed.a - .05, .8), .07, 0);
T.at(LN.failed.a + .2, clacks(TL.FAILED - LN.failed.a - .2, 1), .07, 0);
T.at(TL.FAILED, mixb(thud(1), templeBell(64, 1, 5), shimmer(1.5, [note(76), note(79), note(83), note(88)], .5, .06)), .14, 0);
// ================= 5 · the endless pillar of light =================
T.at(TL.L0 - .2, whoosh(1.2, 300, 2600, .6), .06, 0);
T.at(TL.L0, om(TL.M0 - TL.L0 + .5, 110, .9), .1, 0);
T.at(TL.L0 + .2, fire(TL.M0 - TL.L0, .4, .6), .03, 0);
T.at(TL.LIGHT - .05, shimmer(2, [note(74), note(79), note(83), note(86)], .6, .08), .06, 0);
// ================= 6 · twelve pillars on India =================
for (let i = 0; i < 12; i++) T.at(TL.M0 + .2 + i * .1, chime(note(72 + [0, 2, 4, 7, 9, 12][i % 6] + (i >= 6 ? 12 : 0)), .5, 1.6), .035, i % 2 ? .4 : -.4);
T.at(TL.KEDAR - .3, wind(1.8, 3, .8), .06, -.3);
T.at(TL.RAMES - .3, sea(1.4, 1), .08, .3);
// ================= 7–9 · the raiders =================
T.at(TL.D0 - .2, braam(1, 3.6), .12, 0);
march(TL.D0 + .2, TL.BROKE - .2, 1);
T.at(TL.D0, crackle(TL.BROKE - TL.D0, .6), .04, -.3);
T.at(TL.D0, fire(TL.BROKE - TL.D0, .4, .7), .05, .3);
T.at(TL.LOOTED - .05, mixb(clang(note(84), .7), clang(note(88), .5)), .06, .3);
T.at(TL.BROKE - .02, crash(1.1), .22, 0);
T.at(TL.BURNED - .1, mixb(fire(TL.N0 - TL.BURNED + 1.2, 1, .7), sub(.6, 2)), .14, 0);
// ================= 10 · we will NOT say their names =================
T.at(TL.N0, braam(.8, 3.8), .1, 0);
T.at(TL.N0, fire(TL.K0 - TL.N0, .4, .2), .04, 0);
[.15, .55, .95].forEach(d => T.at(TL.N0 + d + .18, stamp(1), .16, 0));
T.at(TL.NOT - .05, sub(.8, 2.4), .12, 0);
// ================= 11 · the ones who REBUILT them =================
T.at(TL.K0, wind(TL.R[0] - TL.K0, 2, .8), .05, 0);
T.at(TL.K0 + .3, riser(TL.REBUILT - TL.K0 - .3, .7), .06, 0);
T.at(TL.REBUILT - .05, mixb(templeBell(62, 1, 5), thud(.8)), .12, 0);
T.at(TL.REBUILT + .3, clacks(TL.R[0] - TL.REBUILT, .7), .04, 0);
// ================= 12 · the roll =================
TL.R.forEach((t, i) => { T.at(t, mixb(drum(48, 1, 1), thud(.7), shimmer(1.2, [note(67 + i * 2), note(74 + i * 2), note(79 + i * 2)], .5, .04)), .14, 0); T.at(t + .2, clacks(.8, .6), .04, i % 2 ? .3 : -.3); });
// ================= 13 · stone by STONE =================
T.at(TL.S0, clacks(TL.STONE2 - TL.S0, .9), .07, 0);
T.at(TL.STONE2 + .1, mixb(thud(1), templeBell(67, .9, 4)), .12, 0);
T.at(TL.STONE2 + .3, wind(1.6, 4, .8), .05, 0);
// ================= 14–17 · the questions =================
for (let t = TL.F0; t < TL.T0 - .4; t += .5) T.at(t, tick(.8), .045, .1);
T.at(TL.F0, drone(TL.T0 - TL.F0, note(38), .6), .04, 0);
[TL.Q1, TL.Q2, TL.Q3].forEach(t => T.at(t - .3, whoosh(.8, 400, 2600, .5), .05, 0));
T.at(TL.Q1, sea(TL.Q2 - TL.Q1 + .3, .9), .08, 0);
for (let i = 0; i < 3; i++) T.at(TL.Q2 + .3 + i * .35, chime(note(79 + i * 3), .6, 1.6), .05, [-.4, .4, 0][i]);
T.at(TL.Q3 + .3, mixb(sub(.7, 2.2), crunch(.5)), .1, 0);
T.at(TL.Q3 + .3, wind(TL.T0 - TL.Q3, 5, .6), .05, 0);
// ================= 18 · the title =================
T.at(TL.T0 - .9, riser(.9, 1), .1, 0);
T.at(TL.T0 + .05, mixb(sub(1.1, 3.4), drum(40, 1, 1.6)), .2, 0);
T.at(TL.T0 + .1, conch(2.6, 311, .9), .1, 0);
T.at(TL.T0 + 1.4, mixb(drum(52, .8, .8), click(.5)), .1, 0);
T.at(TL.T0 + 2.4, stamp(1.1), .16, 0);
// ================= 19 · the ask =================
T.at(TL.ASK, templeBell(64, .7, 5), .06, -.3);
T.at(TL.ASK + .6, chime(note(79), .5, 2.5), .04, .3);
// ================= the card =================
T.at(TL.CARD - .3, whoosh(.7, 400, 3200), .08, 0);
T.at(TL.CARD + .35, mixb(...[62, 67, 71, 74].map((m) => bell(note(m), 2.6, { partials: [[1, 1], [2, .35], [3, .12]], k: 1.2, amp: .7 }))), .1, 0);

T.write('assets/jtrail_sfx.wav');
console.log('assets/jtrail_sfx.wav', TL.END.toFixed(2), 's');

// ---------- 3. the mix (voice padded before the split, so the score stays up under the card) ----------
const D = TL.END.toFixed(3), score = existsSync('assets/jtrail_score_cut.wav') ? 'assets/jtrail_score_cut.wav' : null;
const inputs = ['-i', 'assets/jtrail_vo.wav', '-i', 'assets/jtrail_sfx.wav', ...(score ? ['-i', score] : [])];
const fc = score
  ? `[0:a]volume=1.15,apad=whole_dur=${D},asplit[v][vk];[1:a]volume=0.8[s];[2:a]volume='if(gte(t,${TL.CARD.toFixed(2)}),1.1,0.6)':eval=frame[m0];[m0][vk]sidechaincompress=threshold=0.04:ratio=3:attack=40:release=450:makeup=1[m];[v][s][m]amix=inputs=3:normalize=0:duration=longest,apad=whole_dur=${D},atrim=0:${D},loudnorm=I=-14:TP=-1.5:LRA=11[o]`
  : `[1:a]volume=0.95[s];[0:a]apad=whole_dur=${D}[v];[v][s]amix=inputs=2:normalize=0:duration=longest,apad=whole_dur=${D},atrim=0:${D},loudnorm=I=-14:TP=-1.5:LRA=11[o]`;
execFileSync('ffmpeg', ['-y', '-v', 'error', ...inputs, '-filter_complex', fc, '-map', '[o]', '-ar', '48000', '-ac', '2', 'assets/jtrail_mix.wav']);
console.log('assets/jtrail_mix.wav', score ? '(with the score)' : '(voice + SFX)');
