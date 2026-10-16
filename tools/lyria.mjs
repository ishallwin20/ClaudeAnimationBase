// lyria.mjs: one music generation with Google's Lyria 3 Pro on OpenRouter (about $0.08 a song), for a Cinematic reel's
// score. The prompt is a timestamped section list matching the scene's TL (see CINEMATIC_GUIDE.md, Sound). It streams
// back an MP3 as base64 chunks; this writes them to --out and prints the length. Needs OPEN_ROUTER_KEY in .env.
//   node tools/lyria.mjs --prompt=tools/<name>_score.txt --out=assets/<name>_score.mp3
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
if (!args.prompt || !args.out) { console.error('usage: node tools/lyria.mjs --prompt=<file> --out=<file.mp3>'); process.exit(1); }
const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n').filter(l => l.includes('=')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }));
const key = process.env.OPEN_ROUTER_KEY || env.OPEN_ROUTER_KEY;
if (!key) { console.error('OPEN_ROUTER_KEY missing (.env)'); process.exit(1); }

const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ model: args.model || 'google/lyria-3-pro-preview', stream: true, modalities: ['audio', 'text'],
    messages: [{ role: 'user', content: readFileSync(args.prompt, 'utf8') }] }),
});
if (!res.ok) { console.error(res.status, await res.text()); process.exit(1); }
// read the whole stream, then parse it (the audio arrives as one very long data: line)
const raw = await res.text(), chunks = []; let txt = '';
for (const line of raw.split('\n')) {
  if (!line.startsWith('data:') || line.includes('[DONE]')) continue;
  try { const d = JSON.parse(line.slice(5)).choices?.[0]?.delta || {}; if (d.audio?.data) chunks.push(d.audio.data); if (d.content) txt += d.content; } catch {}
}
if (!chunks.length) { writeFileSync(args.out + '.raw.txt', raw); console.error(`no audio came back; the raw stream is in ${args.out}.raw.txt`); process.exit(1); }
writeFileSync(args.out, Buffer.from(chunks.join(''), 'base64'));
const dur = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', args.out]).toString().trim();
console.log(`wrote ${args.out} (${(+dur).toFixed(1)} s)`); if (txt) console.log(txt.slice(0, 600));
