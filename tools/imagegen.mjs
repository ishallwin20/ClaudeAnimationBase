// imagegen.mjs: one image from an image model on OpenRouter (default Gemini 3 Pro Image, "Nano Banana Pro"), for the
// Matte style's painted plates and cutouts. The prompt is a text file (or --text=...); --ref=a.png,b.png passes reference
// images (the style to match, an earlier character to keep consistent). Writes a PNG to --out. Needs OPEN_ROUTER_KEY in .env.
//   node tools/imagegen.mjs --prompt=art/<name>/kushmanda.txt --out=art/<name>/kushmanda.png [--aspect=16:9] [--size=2K]
//        [--ref=art/<name>/style.png] [--model=google/gemini-3.1-flash-image]
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, ...v] = a.replace(/^--/, '').split('='); return [k, v.length ? v.join('=') : true]; }));
if (!(args.prompt || args.text) || !args.out) { console.error('usage: node tools/imagegen.mjs --prompt=<file> | --text=<prompt>  --out=<file.png> [--ref=a.png,b.png] [--aspect=16:9] [--size=2K]'); process.exit(1); }
const env = existsSync('.env') ? Object.fromEntries(readFileSync('.env', 'utf8').split('\n').filter(l => l.includes('=')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })) : {};
const key = process.env.OPEN_ROUTER_KEY || env.OPEN_ROUTER_KEY;
if (!key) { console.error('OPEN_ROUTER_KEY missing (.env)'); process.exit(1); }

const prompt = args.prompt ? readFileSync(args.prompt, 'utf8') : args.text;
const refs = args.ref ? String(args.ref).split(',').map(p => ({ type: 'image_url', image_url: { url: `data:image/${p.endsWith('.jpg') ? 'jpeg' : 'png'};base64,${readFileSync(p).toString('base64')}` } })) : [];
const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ model: args.model || 'google/gemini-3-pro-image', modalities: ['image', 'text'],
    image_config: { aspect_ratio: args.aspect || '16:9', image_size: args.size || '2K' },
    messages: [{ role: 'user', content: [{ type: 'text', text: prompt }, ...refs] }] }),
});
if (!res.ok) { console.error(res.status, await res.text()); process.exit(1); }
const json = await res.json(), msg = json.choices?.[0]?.message || {}, url = msg.images?.[0]?.image_url?.url;
if (!url) { writeFileSync(args.out + '.raw.json', JSON.stringify(json, null, 1)); console.error(`no image came back; the response is in ${args.out}.raw.json`); process.exit(1); }
writeFileSync(args.out, Buffer.from(url.slice(url.indexOf(',') + 1), 'base64'));
const dim = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', args.out]).toString().trim();
console.log(`wrote ${args.out} (${dim})${json.usage?.cost ? `, $${(+json.usage.cost).toFixed(3)}` : ''}`); if (msg.content) console.log(String(msg.content).slice(0, 400));
