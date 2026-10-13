// sarvam_tts.mjs: a reel's voiceover from Sarvam's text-to-speech (bulbul), and the caption timings that go with it.
// Needs SARVAM_API_KEY in .env. Sarvam returns no word timestamps, so word times are estimated: each line's speech span
// is found with ffmpeg silencedetect, its phrases (split at , . ? ! : … and at caption chunks) are matched to the
// speech segments between pauses, and the words inside a phrase are spread by letter count. Good to ~0.1–0.2 s.
//
//   Audition voices on one line (writes out/vo_audition/<n>-<speaker>.wav):
//     node tools/sarvam_tts.mjs --audition="No creature with two legs could kill him." --speakers=aditya,girish_en_documentary
//       [--model=bulbul:v3] [--lang=en-IN] [--pace=.9] [--fx=devi]
//     A speaker with an underscore (girish_en_documentary) is a bulbul:v4-flash persona; the model is picked from it.
//   Render a script:
//     node tools/sarvam_tts.mjs --script=tools/<name>_vo.json
//   The script: { name, dur, defaults: { speaker, model, lang, pace, temperature }, lines: [line, ...] }, a line being
//     { id, t (start in s; or gap: s after the previous line ends), caps: ['caption *chunk* | one', ...], tts (optional
//       spoken text, when it should differ from the captions), speaker, pace, fx ('devi' | 'asura' | 'none'), y, size }
//   It writes assets/<name>_vo.wav (the lines laid out at their times; raw takes cached in assets/vo/<name>/), and
//   src/scenes/<name>_vo.js: const VO = { lines: { id: { a, end } }, caps: [{ a, b, text, at, y, size }] }. The scene
//   draws the captions with VO.caps.forEach(k => say(k.a, k.b, k.text, { at: k.at, y: k.y, size: k.size })).
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, ...v] = a.replace(/^--/, '').split('='); return [k, v.length ? v.join('=') : true]; }));
const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n').filter(l => l.includes('=')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }));
const key = process.env.SARVAM_API_KEY || env.SARVAM_API_KEY;
if (!key) { console.error('SARVAM_API_KEY missing (.env)'); process.exit(1); }
const SR = 48000;
const ff = (a) => execFileSync('ffmpeg', ['-y', '-v', 'error', ...a], { stdio: ['ignore', 'pipe', 'pipe'] });
const dur = f => +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString().trim();

// one request → a mono 48 kHz WAV at `out`
async function tts(text, o, out) {
  const model = o.model || (o.speaker.includes('_') ? 'bulbul:v4-flash' : 'bulbul:v3');
  const body = { text, target_language_code: o.lang || 'en-IN', speaker: o.speaker, model, pace: o.pace ?? 1, speech_sample_rate: SR, output_audio_codec: 'wav' };
  if (o.temperature != null) body.temperature = o.temperature;
  const res = await fetch('https://api.sarvam.ai/text-to-speech', { method: 'POST', headers: { 'api-subscription-key': key, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const j = await res.json();
  if (!res.ok || !j.audios) throw new Error(`${res.status} ${JSON.stringify(j.error || j).slice(0, 300)}`);
  writeFileSync(out, Buffer.concat(j.audios.map(a => Buffer.from(a, 'base64'))));
}
// voice effects: the goddess (a big hall's reverb under an octave-down double) and the demon (pitched down, a short slap)
const FX = {
  none: 'anull',
  devi: 'asplit[a][b];[b]asetrate=48000*0.5,aresample=48000,atempo=2.0,volume=0.30[lo];[a][lo]amix=inputs=2:normalize=0,aecho=0.8:0.75:70|160|290:0.32|0.22|0.14,apad=pad_dur=1.2',
  asura: 'asetrate=48000*0.78,aresample=48000,atempo=1.282,lowshelf=g=4:f=180,aecho=0.8:0.6:45|110:0.25|0.15,apad=pad_dur=0.6',
};
const applyFx = (inp, fx, out) => ff(['-i', inp, '-filter_complex', `[0:a]${FX[fx || 'none'] || fx}[o]`, '-map', '[o]', '-ar', String(SR), '-ac', '1', out]);
// the speech segments [[s, e], ...] between pauses of at least 90 ms, from ffmpeg silencedetect
function speechSegs(f) {
  const D = dur(f), r = execFileSync('sh', ['-c', `ffmpeg -v info -i "${f}" -af silencedetect=noise=-38dB:d=0.09 -f null - 2>&1`]).toString();
  const sil = []; let s0 = null;
  for (const l of r.split('\n')) { const a = l.match(/silence_start: ([\d.]+)/), b = l.match(/silence_end: ([\d.]+)/); if (a) s0 = +a[1]; if (b) { sil.push([s0 ?? 0, +b[1]]); s0 = null; } }
  if (s0 != null) sil.push([s0, D]);
  const segs = []; let cur = 0;
  for (const [a, b] of sil) { if (a - cur > .04) segs.push([cur, a]); cur = b; }
  if (D - cur > .04) segs.push([cur, D]);
  return { D, segs };
}
const plain = s => s.replace(/\*/g, '').replace(/\s\|\s/g, ' ').replace(/\|/g, ' ').replace(/\s+/g, ' ').trim();
// what the voice reads: the captions' emphasis capitals lower-cased (a voice spells an all-caps word out: "BEE" → "B-E-E")
const spoken = s => s.split(/\s+/).filter(w => w && w !== '|').map(w => {
  const name = w.includes('*'); w = w.replace(/\*/g, '');
  return /[A-Z]{2}/.test(w) && w === w.toUpperCase() ? (name ? w[0] + w.slice(1).toLowerCase() : w.toLowerCase()) : w;
}).join(' ').replace(/(^|[.?!…]\s+|")([a-z])/g, (m, a, b) => a + b.toUpperCase());
const words = s => s.split(/\s+/).filter(w => w && w !== '|');

if (args.audition) {
  mkdirSync('out/vo_audition', { recursive: true });
  const speakers = String(args.speakers || 'aditya').split(',');
  for (const [i, sp] of speakers.entries()) {
    const raw = `out/vo_audition/${i + 1}-${sp}.raw.wav`, out = `out/vo_audition/${i + 1}-${sp}.wav`;
    try { await tts(spoken(String(args.audition)), { speaker: sp, model: args.model, lang: args.lang, pace: args.pace != null ? +args.pace : undefined, temperature: args.temperature != null ? +args.temperature : undefined }, raw); applyFx(raw, args.fx, out); console.log(`${out}  ${dur(out).toFixed(2)} s`); }
    catch (e) { console.error(`${sp}: ${e.message}`); }
  }
  process.exit(0);
}

if (!args.script) { console.error('usage: --audition="text" --speakers=a,b | --script=tools/<name>_vo.json'); process.exit(1); }
const S = JSON.parse(readFileSync(args.script, 'utf8')), name = S.name, D0 = S.defaults || {};
mkdirSync(`assets/vo/${name}`, { recursive: true });
const lines = {}, caps = [], placed = [];
let prevEnd = 0;
for (const L of S.lines) {
  const o = { ...D0, ...L }, text = L.tts || spoken(L.caps.join(' '));
  const h = createHash('sha1').update(JSON.stringify([text, o.speaker, o.model, o.lang, o.pace, o.temperature])).digest('hex').slice(0, 8);
  const raw = `assets/vo/${name}/${L.id}-${h}.raw.wav`, wav = `assets/vo/${name}/${L.id}.wav`;
  if (!existsSync(raw)) { process.stdout.write(`tts ${L.id}… `); await tts(text, o, raw); console.log('ok'); }
  applyFx(raw, o.fx, wav);
  // timing: the speech segments of the dry take (the fx tails would blur the pauses), placed at t
  const { segs } = speechSegs(raw), s0 = segs[0]?.[0] ?? 0, s1 = segs.at(-1)?.[1] ?? dur(raw);
  const t = L.t ?? (prevEnd + (L.gap ?? .25)) - s0;   // with gap, the gap is between the voices, not the files
  if (L.t != null && t + s0 < prevEnd - .05) console.warn(`! ${L.id} starts at ${(t + s0).toFixed(2)} but the previous line speaks until ${prevEnd.toFixed(2)}`);
  // phrases: the caption chunks split again at punctuation
  const chunkWords = L.caps.map(c => words(c));
  const flat = chunkWords.flatMap((ws, ci) => ws.map((w, wi) => ({ w, ci, last: wi === ws.length - 1 })));
  const phrases = []; let cur = [];
  flat.forEach((x, i) => { cur.push(i); if (/[,.?!:;…]["'”’)]*$/.test(x.w.replace(/\*/g, '')) || x.last) { phrases.push(cur); cur = []; } });
  if (cur.length) phrases.push(cur);
  // match the speech segments to phrases: merge the segments over the smallest pauses until the counts agree
  let sg = segs.map(s => [...s]);
  while (sg.length > phrases.length) { let k = 0, g = 1e9; for (let i = 0; i < sg.length - 1; i++) { const gap = sg[i + 1][0] - sg[i][1]; if (gap < g) { g = gap; k = i; } } sg.splice(k, 2, [sg[k][0], sg[k + 1][1]]); }
  const wlen = i => plain(flat[i].w).replace(/[^\p{L}\p{N}]/gu, '').length + 1.5;
  const at = new Array(flat.length);
  if (sg.length === phrases.length) phrases.forEach((p, pi) => { const [a, b] = sg[pi], tot = p.reduce((s, i) => s + wlen(i), 0); let acc = 0; for (const i of p) { at[i] = t + a + (b - a) * acc / tot; acc += wlen(i); } });
  else { const tot = flat.reduce((s, _, i) => s + wlen(i), 0); let acc = 0; flat.forEach((_, i) => { at[i] = t + s0 + (s1 - s0) * acc / tot; acc += wlen(i); }); console.warn(`  ${L.id}: ${segs.length} speech segments for ${phrases.length} phrases, spread evenly`); }
  // the end of each word = the next word's start, or its phrase's segment end
  const wEnd = flat.map((_, i) => { const pi = phrases.findIndex(p => p.includes(i)), p = phrases[pi]; return i === p.at(-1) ? t + (sg[pi]?.[1] ?? s1) : at[i + 1]; });
  L.caps.forEach((c, ci) => {
    const idx = flat.map((x, i) => x.ci === ci ? i : -1).filter(i => i >= 0);
    caps.push({ id: L.id, a: +(at[idx[0]] - .12).toFixed(3), end: +wEnd[idx.at(-1)].toFixed(3), text: c, at: idx.map(i => +at[i].toFixed(3)), y: L.y, size: L.size, hold: L.hold });
  });
  lines[L.id] = { a: +(t + s0).toFixed(3), end: +(t + s1).toFixed(3), file: +t.toFixed(3) };
  placed.push({ wav, t, gain: L.gain ?? 1 });
  prevEnd = t + s1;
  console.log(`${L.id.padEnd(10)} ${(t + s0).toFixed(2).padStart(6)} → ${(t + s1).toFixed(2).padStart(6)}  ${segs.length} seg / ${phrases.length} phr  "${text.slice(0, 60)}"`);
}
// a caption stays up until the next one comes (at most hold s after its last word; at least 1.1 s)
caps.forEach((k, i) => { const nx = caps[i + 1]; let b = Math.max(k.end + (k.hold ?? .45), k.a + 1.1); if (nx) b = Math.min(b, nx.a - .02); k.b = +b.toFixed(3); delete k.end; delete k.hold; if (k.y == null) delete k.y; if (k.size == null) delete k.size; });
const total = S.dur || Math.ceil(prevEnd + 2);
// lay the lines out: adelay each one, then mix
const inputs = placed.flatMap(p => ['-i', p.wav]);
const fc = placed.map((p, i) => `[${i}:a]adelay=${Math.max(0, Math.round(p.t * 1000))}|${Math.max(0, Math.round(p.t * 1000))},volume=${p.gain}[v${i}]`).join(';') +
  ';' + placed.map((_, i) => `[v${i}]`).join('') + `amix=inputs=${placed.length}:normalize=0:duration=longest,apad,atrim=0:${total},aformat=channel_layouts=stereo[o]`;
ff([...inputs, '-filter_complex', fc, '-map', '[o]', '-ar', String(SR), '-ac', '2', `assets/${name}_vo.wav`]);
writeFileSync(`src/scenes/${name}_vo.js`, `// ${name}_vo.js: written by tools/sarvam_tts.mjs from ${args.script}; don't edit (re-run the tool).\n// lines: when each line's voice starts and ends; caps: the karaoke captions, word start times from the voice.\nconst VO = ${JSON.stringify({ lines, caps })};\n`);
console.log(`wrote assets/${name}_vo.wav (${total} s) and src/scenes/${name}_vo.js: ${caps.length} captions; the last voice ends at ${prevEnd.toFixed(2)} s`);
