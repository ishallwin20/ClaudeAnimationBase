// trailer_caps.mjs: the Ramayan trailer's captions as a transparent PNG sequence (out/trailer/caps/%04d.png, 24 fps),
// drawn in headless Chrome exactly like the engine's caption(): Bangers, a dark round stroke, the pop (backOut over .2 s),
// a -.025 rad tilt, centred at x 507 from y 480 down, a .18 s fade at the end. The picture is clips from the parts'
// branches (tools/trailer_clips.mjs), so their own captions are off and these go over the top in tools/trailer_build.mjs.
// Times come from the voice (src/scenes/trailer_vo.js); the three montage punch words sit on the drum hits.
//   node tools/trailer_caps.mjs
import puppeteer from 'puppeteer-core';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const VO = runInNewContext(readFileSync('src/scenes/trailer_vo.js', 'utf8') + '\n;VO');
const cap = id => VO.caps.filter(c => c.id === id);
// [first line's time, gone by, ...lines]; *gold*, ^ huge gold (as the series' TL.CAPS)
const CAPS = [
  [-1, 3.5, 'It began with', '*A SINGLE VERSE.*'],
  [cap('prince')[0].a, 8.7, 'A prince, sent to the forest', '*FOR FOURTEEN YEARS.*'],
  [cap('deer')[0].a, 11.1, '*A GOLDEN DEER.*'],
  [cap('ravana')[0].a, 16.2, 'A demon king with ten heads,', '*WHO TOOK SITA AWAY.*'],
  [cap('hanuman')[0].a, 18.1, 'Then came', '^HANUMAN!'],
  [cap('leap')[0].a, 24.6, 'He leapt across the ocean,', '*AND SET LANKA ON FIRE.*'],
  [24.85, 26.5, '^A BLADE OF GRASS…'],
  [26.65, 28.3, '^14,000 DEMONS…'],
  [28.45, 29.9, '^ONE ARROW…'],
  [cap('bridge')[0].a, 32.7, 'A bridge', '*ACROSS THE SEA.*'],
  [cap('heads')[0].a, 35.7, 'Heads that kept', '*GROWING BACK…*'],
  [cap('arrow')[0].a, 39.5, '…and', '^ONE LAST ARROW.'],
];
const DUR = 48, FPS = 24;
const CHROME = ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', process.env.CHROME_PATH].find(p => p && existsSync(p));
mkdirSync('out/trailer/caps', { recursive: true });
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
const page = await browser.newPage();
await page.setContent(`<html><head><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bangers&display=block"></head>
<body style="margin:0;background:transparent"><canvas id="c" width="1080" height="1920"></canvas></body></html>`, { waitUntil: 'networkidle0' });
await page.evaluate(() => document.fonts.load('80px Bangers'));
await page.evaluate(CAPS => {
  const c = document.getElementById('c').getContext('2d');
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const backOut = x => { const s = 1.70158; x -= 1; return 1 + (s + 1) * x * x * x + s * x * x; };
  function letter(txt, x, y, size, color, pop, alpha) {
    const k = backOut(clamp(pop)); if (k <= .01) return;
    c.save(); c.translate(x, y); c.rotate(-.025); c.scale(k, k); c.globalAlpha = alpha;
    c.font = `${size}px Bangers`; c.textAlign = 'center'; c.textBaseline = 'middle';
    const w = c.measureText(txt).width; if (w > 800) c.scale(800 / w, 800 / w);
    c.lineJoin = 'round'; c.lineWidth = size * .22; c.strokeStyle = '#2B2233'; c.strokeText(txt, 0, 0);
    c.fillStyle = color; c.fillText(txt, 0, 0); c.restore();
  }
  window.drawAt = t => {
    c.clearRect(0, 0, 1080, 1920);
    for (const [a, b, ...lines] of CAPS) {
      if (t < a || t > b) continue;
      let y = 480, prev = 0;
      lines.forEach((l, i) => {
        const huge = l[0] === '^', gold = huge || l.includes('*'), size = huge ? 118 : gold ? 92 : 76, age = a < 0 ? t - a : t - a - i * .35;
        if (i) y += (prev + size) * .56; prev = size;
        const life = b - a - (a < 0 ? 0 : i * .35), fade = clamp((age - (life - .18)) / .18);
        if (age >= 0 && age <= life) letter(l.replace(/[*^]/g, '').toUpperCase(), 507, y, size, gold ? '#F5C542' : '#FFF5E2', age * 5, 1 - fade);
      });
    }
    return document.getElementById('c').toDataURL('image/png');
  };
}, CAPS);
for (let f = 0; f < DUR * FPS; f++) {
  const url = await page.evaluate(t => window.drawAt(t), f / FPS);
  writeFileSync(`out/trailer/caps/${String(f).padStart(4, '0')}.png`, Buffer.from(url.split(',')[1], 'base64'));
}
await browser.close();
console.log('wrote out/trailer/caps/0000.png …', DUR * FPS, 'frames');
