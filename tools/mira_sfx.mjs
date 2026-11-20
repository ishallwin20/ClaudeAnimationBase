// mira_sfx.mjs: the sound of "Saanwaro nahi aayo" (src/scenes/mira.js). Shivangi Singh sings alone (her reverb take,
// assets/vo/mira/shivangi_1_reverb.mp3, kept out of git); under her: a tanpura on her Sa (about 250 Hz, B a little
// sharp, measured from her phrase endings) and a bansuri in Kafi (komal ga and ni, as she sings) that answers each line
// in the pauses, as if from far away: his flute, heard but never seen. On "Mohan roop" the bahroopiya's flute plays
// under her and stops dead when he lowers it. Ambience per painting: dusk birds, a parrot's wings, her ektara, the
// anklets on her steps, crickets and far thunder, the river, rain, the sea, water lapping at the lamp.
// Writes assets/mira_music.wav (tanpura, flute, ektara), assets/mira_sfx.wav, then the mix assets/mira_mix.wav.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync, spawnSync } from 'node:child_process';
import { SR, track, tone, noise, bell, mixb, env, chime, chirp, thunder, wind, seed, rnd, clamp, lerp } from './sfx.mjs';

const src = readFileSync('src/scenes/mira.js', 'utf8'), TL = runInNewContext(src.match(/const TL = \{[\s\S]*?\};/)[0] + '\n;TL');
const OFF = TL.OFF, END = 127.5 + OFF, SA = 250;   // OFF: the music's intro before she sings (her take and the ambience are delayed by it)
seed(17);

// ---------- instruments ----------
// tanpura: a rich plucked string whose bright band sweeps up the harmonics as it rings (the jawari buzz)
function tanpuraPluck(f, dur = 5) {
  const N = Math.round(dur * SR), b = new Float32Array(N), H = 14, ph = Array.from({ length: H }, () => rnd() * Math.PI * 2);
  for (let i = 0; i < N; i++) {
    const t = i / SR, e = Math.exp(-t * .55) * clamp(t * 60) * clamp((dur - t) / .4), centre = 2 + 9 * clamp(t / 3.2);
    let v = 0;
    for (let n = 1; n <= H; n++) { const a = Math.pow(n, -.85) * (.35 + .65 * Math.exp(-((n - centre) ** 2) / 5)); v += a * Math.sin(2 * Math.PI * f * n * (1 + .0004 * n) * t + ph[n - 1]); }
    b[i] = v * e * .3;
  }
  return b;
}
// bansuri: a breathy sine with a little second harmonic, vibrato on held notes, glides between notes
const KAFI = { 'P.': 3 / 4, 'n.': 9 / 10, S: 1, R: 9 / 8, g: 6 / 5, M: 4 / 3, P: 3 / 2, D: 5 / 3, n: 9 / 5, "S'": 2 };
function flute(phrase, sa = SA * 2) {
  const notes = phrase.map(([n, d]) => [sa * KAFI[n], d]), dur = notes.reduce((s, [, d]) => s + d, 0) + .35;
  const starts = []; let acc = 0; for (const [, d] of notes) { starts.push(acc); acc += d; }
  const fAt = t => {
    let i = 0; while (i < notes.length - 1 && t >= starts[i + 1]) i++;
    const prev = notes[Math.max(0, i - 1)][0], cur = notes[i][0], g = clamp((t - starts[i]) / .07);
    const into = t - starts[i], vib = .006 * clamp((into - .25) / .3) * Math.sin(t * 2 * Math.PI * 5.2);
    return lerp(prev, cur, i ? g : 1) * (1 + vib);
  };
  const e = (t) => clamp(t / .09) * clamp((dur - .1 - t) / .3);
  const body = tone(dur, fAt, { e, amp: 1 }), h2 = tone(dur, t => fAt(t) * 2, { e, amp: .14 }), h3 = tone(dur, t => fAt(t) * 3, { e, amp: .04 });
  const breath = noise(dur, { lp: t => fAt(t) * 2.2, hp: t => fAt(t) * .7, e, amp: .9 });
  // tongued note starts: a little lift on each attack
  const out = mixb(body, h2, h3, breath);
  for (const s of starts) { const j0 = Math.round(s * SR); for (let j = 0; j < .08 * SR && j0 + j < out.length; j++) out[j0 + j] *= .75 + .25 * (j / (.08 * SR)); }
  return out;
}
// ektara: one string on Sa, plucked; a quick bend from the bamboo neck
const ektara = (amp = 1) => mixb(tone(1.6, t => SA * (1 + .012 * Math.exp(-t * 14)), { type: 'tri', e: env.pluck(3.2), amp }), tone(1.2, SA * 2, { e: env.pluck(5), amp: amp * .35 }), tone(.8, SA * 3, { e: env.pluck(8), amp: amp * .15 }));
// harmonium: two brass reeds a few cents apart (the beating), a reedy stack of harmonics, the bellows' slow swell;
// notes glide a little into each other, the way a player slurs a phrase. hold: a drone of Sa and Pa under it.
function harmonium(phrase, { sa = SA, hold = 0, att = .12, amp = 1 } = {}) {
  const notes = phrase.map(([n, d]) => [sa * KAFI[n], d]), dur = notes.reduce((s, [, d]) => s + d, 0) + .5;
  const starts = []; let acc = 0; for (const [, d] of notes) { starts.push(acc); acc += d; }
  const N = Math.round(dur * SR), out = new Float32Array(N), H = 14, amps = Array.from({ length: H }, (_, n) => Math.pow(n + 1, -.75) * (n < 5 ? 1 : Math.exp(-(n - 4) * .22)));
  const ph = [0, 0, 0, 0]; let i0 = 0;
  for (let i = 0; i < N; i++) {
    const t = i / SR; while (i0 < notes.length - 1 && t >= starts[i0 + 1]) i0++;
    const prev = notes[Math.max(0, i0 - 1)][0], f = lerp(prev, notes[i0][0], i0 ? clamp((t - starts[i0]) / .04) : 1);
    const e = clamp(t / att) * clamp((dur - t) / .45) * (1 + .04 * Math.sin(t * 2 * Math.PI * .6));
    ph[0] += f / SR; ph[1] += f * 1.0035 / SR; ph[2] += sa / 2 / SR; ph[3] += sa * .75 / SR;
    let v = 0;
    for (let n = 1; n <= H; n++) v += amps[n - 1] * (Math.sin(2 * Math.PI * n * ph[0]) + .8 * Math.sin(2 * Math.PI * n * ph[1]));
    if (hold) for (let n = 1; n <= 8; n++) v += hold * amps[n - 1] * (Math.sin(2 * Math.PI * n * ph[2]) + .7 * Math.sin(2 * Math.PI * n * ph[3]));
    out[i] = v * e * amp * .12;
  }
  return out;
}
// ghungroo: a fistful of little brass bells
const ghungroo = (amp = 1) => { const o = []; for (let i = 0; i < 7; i++) o.push(bell(3200 + rnd() * 2600, .35, { partials: [[1, 1], [1.5, .5], [2.3, .3]], k: 14, amp: amp * (.4 + rnd() * .6) })); const pad = o.map((b, i) => { const s = Math.round(rnd() * .03 * SR), x = new Float32Array(b.length + s); x.set(b, s); return x; }); return mixb(...pad, noise(.12, { hp: 4000, lp: 11000, e: env.pluck(30), amp: amp * .4 })); };
const water = (dur, amp = 1, lp = 700) => noise(dur, { lp: t => lp + 250 * Math.sin(t * .9) + 120 * Math.sin(t * 2.3), hp: 140, e: env.swell(1.2, 1.2), amp });
const rain = (dur, amp = 1) => noise(dur, { hp: 1800, lp: 9000, e: env.swell(.6, .8), amp });
const sea = (dur, amp = 1) => noise(dur, { brown: true, lp: t => 420 + 380 * Math.abs(Math.sin(t * .55)), hp: 40, e: env.swell(1, 1), amp });
const wings = (dur, amp = 1) => { const b = noise(dur, { hp: 500, lp: 3000, e: env.swell(.02, .1), amp }); for (let i = 0; i < b.length; i++) b[i] *= .3 + .7 * Math.max(0, Math.sin(i / SR * Math.PI * 2 * 11)); return b; };

// ---------- music: tanpura all through, the flute in the pauses ----------
const M = track(END), TP = track(END);   // M: harmonium, flute, ektara; TP: the tanpura (its own stem, set by level)
for (let t0 = .0; t0 < END - 2; t0 += 4.2) {
  const fade = clamp((END - 1 - t0) / 5);
  [[SA * .75, 0], [SA, 1.05], [SA, 1.6], [SA / 2, 2.5]].forEach(([f, d], i) => TP.at(t0 + d, tanpuraPluck(f, 5), .11 * fade, [-.35, -.1, .1, .3][i]));
}
// the intro: the harmonium swells in on Sa and Pa, then a short Kafi phrase settles on Sa as she begins
M.at(.2, harmonium([['S', 1.1], ['R', .45], ['g', .7], ['R', .35], ['S', .55], ['n.', .4], ['S', 1.2]], { hold: .5, att: .6 }), .6, -.1);
// in every pause between her lines the harmonium answers (it holds Sa and Pa under its phrase), the fill she asked for
const fills = [
  [9.85, [['g', .3], ['R', .3], ['S', .75]]],
  [19.25, [['P', .32], ['M', .3], ['g', .3], ['R', .55]]],
  [34.25, [['S', .3], ['R', .3], ['g', .38], ['M', .6]]],
  [43.95, [['n.', .32], ['S', .3], ['R', .4], ['S', .7]]],
  [54.15, [['M', .3], ['P', .3], ['n', .4], ['P', .7]]],
  [74.6, [['P', .32], ['n', .34], ["S'", .7]]],
  [85.1, [["S'", .3], ['n', .28], ['D', .3], ['P', .55]]],
  [94.9, [['M', .32], ['g', .32], ['R', .34], ['S', .7]]],
  [109.95, [['g', .35], ['R', .3], ['S', .5]]],
];
for (const [t0, ph] of fills) M.at(t0 + OFF - .15, harmonium(ph, { hold: .45 }), .75, -.1);
// the card: the flute's last phrase over the harmonium's Sa
M.at(121.0 + OFF, flute([['S', .55], ['R', .4], ['g', .9], ['M', .45], ['P', 1.1], ['g', .55], ['R', .5], ['S', 2.2]]), .056, .25);
M.at(121.0 + OFF, harmonium([['S', 6.2]], { hold: .4, att: .8 }), .45, -.1);
// his flute under "Mohan roop", as he shows her his form in the temple; it fades as she grows up
const mohan = flute([['S', .5], ['R', .4], ['g', .7], ['R', .35], ['S', .5], ['n.', .4], ['S', .9], ['R', .45], ['g', .45], ['M', .8], ['g', .5], ['R', .55], ['S', .9], ['g', .6], ['R', .6]]);
{ const n = Math.round((TL.L4 + 1.6 - TL.L3) * SR), cut = mohan.subarray(0, n), fd = Math.round(2.4 * SR); for (let i = 0; i < fd; i++) cut[n - 1 - i] *= i / fd; M.at(TL.L3 + OFF, cut, .03, .5); }
// her ektara in the shrine
for (let t = TL.L6 + .2; t < TL.L7 - 1.2; t += .76) M.at(t + OFF, ektara(1), .03, -.2);
M.write('assets/mira_music.wav', { peak: .5 });
TP.write('assets/mira_tanpura.wav', { peak: .5 });

// ---------- ambience ----------
const S0 = track(END), S = { at: (t, ...r) => S0.at(t + OFF, ...r) };   // S.at: in her recording's time
// before she sings: the dusk birds over the intro
for (let t = .4; t < OFF + .5; t += .7 + rnd() * 1.2) S0.at(t, chirp(.6), .02, rnd() - .5);
S0.at(0, wind(OFF + .6, 0, .8), .012, 0);
// 1–2: dusk: birds, a soft breeze
S.at(0, wind(20.5, 0, 1.5), .012, 0);
for (let t = .6; t < 10; t += .7 + rnd() * 1.3) S.at(t, chirp(.6), .02, rnd() - .5);
// 3: the temple: its bell as we come in, a soft one as he shows his form; 4: the parrot takes off from her hand to the sill
S.at(20.3, chime(SA * 2.5, .9, 4), .03, -.3); S.at(25.4, chime(SA * 4, .5, 3), .02, .1);
S.at(42.4, wings(1.2, 1), .04, .3); S.at(43.3, chirp(.8), .012, .4);
// 6: anklets on her steps (wide), then on each lifted foot (close)
for (let t = TL.L7 - .1; t < 60.6; t += .42 + rnd() * .08) S.at(t, ghungroo(.8), .05, rnd() * .4 - .2);
for (let n = 0; ; n++) { const t = 60.6 + ((n + .5) / 2.6 - (60.6 * 2.6 % 1) / 2.6); if (t > 64.8) break; if (t > 60.6) S.at(t - .05, ghungroo(1), .09, n % 2 ? -.15 : .15); }
// 7: night: crickets, far thunder after each flash
for (let t = 64.6; t < 76; t += .25 + rnd() * .45) S.at(t, chirp(.5), .005, rnd() - .5);
S.at(66.9, thunder(3, .35), .05, .3); S.at(71.5, thunder(3, .3), .045, -.3);
// 8: the river; rain in the monsoon, thunder; wind in autumn and winter
S.at(75.6, water(20.8, 1), .25, 0);
S.at(88.4, rain(2.6, 1), .03, 0); S.at(89.6, thunder(2.6, .3), .04, .2);
S.at(90.9, wind(4.8, 2, 1), .02, 0);
// 9: the sea
S.at(95.8, sea(10.4, 1), .035, 0);
// 10: the last night: water lapping, crickets; a soft chime as the lamp touches the water
S.at(105.6, water(16, 1, 500), .2, 0);
for (let t = 105.8; t < 121.5; t += .3 + rnd() * .5) S.at(t, chirp(.5), .0045, rnd() - .5);
S.at(108.0, chime(SA * 4, .6, 3), .02, .2);
// the card
S.at(121.4, chime(SA * 4 * 1.5, .5, 3), .015, 0);
S0.write('assets/mira_sfx.wav', { peak: .5 });

// ---------- the mix ----------
// Levels are set by measurement (the poet, 20 Nov: "increase the tanpura/harmonium in the silences between lines as
// fillers, and bring my voice down a little to match the tanpura"): the tanpura sits DB_T under her sung voice and is
// ducked a little under it, so it swells in her pauses; the harmonium's fills (in the pauses) sit DB_H under her voice.
// Then one linear gain to -14 LUFS (no dynamic loudnorm: it would pump the pauses).
const D = END.toFixed(3), ms = Math.round(OFF * 1000), DB_T = +(process.env.DB_T ?? 12), DB_H = +(process.env.DB_H ?? 5);
const pcm = (args) => { const b = execFileSync('ffmpeg', ['-v', 'error', ...args, '-ac', '1', '-ar', '16000', '-f', 'f32le', '-'], { maxBuffer: 1e9 }); return new Float32Array(b.buffer, b.byteOffset, b.length / 4); };
const dbIn = (x, wins) => { let s = 0, n = 0; for (const [a, b] of wins) for (let i = Math.floor(a * 16000); i < Math.min(x.length, b * 16000); i++) { s += x[i] * x[i]; n++; } return 10 * Math.log10(s / n + 1e-12); };
const voice = pcm(['-i', 'assets/vo/mira/shivangi_1_reverb.mp3']), music = pcm(['-i', 'assets/mira_music.wav']), tanp = pcm(['-i', 'assets/mira_tanpura.wav']);
const LINES = [[TL.L1, TL.L2 - 1.2], [TL.L5, TL.L6 - 1.4], [TL.L6, TL.L7 - 1.4], [TL.L10, TL.L11 - 1.2], [TL.L12, TL.L13 - 1]];
const vDb = dbIn(voice, LINES) + 20 * Math.log10(+(process.env.VOICE ?? .8));
const tGain = vDb - DB_T - dbIn(tanp, [[OFF + 10, END - 10]]), hGain = vDb - DB_H - dbIn(music, fills.map(([t0]) => [t0 + OFF, t0 + OFF + 1.1]));
console.log(`voice ${vDb.toFixed(1)} dB; tanpura gain ${tGain.toFixed(1)} dB, harmonium gain ${hGain.toFixed(1)} dB`);
const fc = (tail) => `[0:a]aresample=48000,volume=${process.env.VOICE ?? .8},adelay=${ms}|${ms},apad=whole_dur=${D},asplit=3[v][k1][k2];` +
  `[1:a]volume=${hGain.toFixed(2)}dB,aecho=1:0.85:70|190:0.25|0.15[m0];[m0][k1]sidechaincompress=threshold=0.06:ratio=2.5:attack=30:release=250[m];` +
  `[3:a]volume=${tGain.toFixed(2)}dB,aecho=1:0.9:90:0.2[t0];[t0][k2]sidechaincompress=threshold=0.03:ratio=1.8:attack=150:release=900[t];` +
  `[2:a]volume=${process.env.AMB ?? .55}[s];` +
  `[v][m][t][s]amix=inputs=4:normalize=0:duration=longest,atrim=0:${D},afade=t=out:st=${(END - 1.2).toFixed(2)}:d=1.2${tail}[o]`;
const ins = ['-i', 'assets/vo/mira/shivangi_1_reverb.mp3', '-i', 'assets/mira_music.wav', '-i', 'assets/mira_sfx.wav', '-i', 'assets/mira_tanpura.wav'];
const meas = spawnSync('ffmpeg', ['-hide_banner', '-nostats', ...ins, '-filter_complex', fc(',loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json'), '-map', '[o]', '-f', 'null', '-'], { maxBuffer: 1e8 }).stderr.toString();
const J = JSON.parse(meas.slice(meas.lastIndexOf('{'), meas.lastIndexOf('}') + 1));
execFileSync('ffmpeg', ['-y', '-v', 'error', ...ins, '-filter_complex', fc(`,loudnorm=I=-14:TP=-1.5:LRA=11:linear=true:measured_I=${J.input_i}:measured_TP=${J.input_tp}:measured_LRA=${J.input_lra}:measured_thresh=${J.input_thresh}:offset=${J.target_offset}`), '-map', '[o]', '-ar', '48000', '-ac', '2', 'assets/mira_mix.wav']);
console.log('wrote assets/mira_mix.wav');
