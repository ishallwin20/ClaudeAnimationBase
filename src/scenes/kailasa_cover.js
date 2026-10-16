// kailasa_cover.js: the Instagram cover for the Kailasa reel (cover.html = studio.html + this). Replaces the reel's
// shots with one still: the temple in its pit at dawn, seen from above; the title kept inside the 3:4 grid crop
// (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/kailasa_out (then t0_00.png → cover.png)
SHOTS.length = 0; POST.length = 0; CAPTIONS.length = 0;
SHOTS.push({ a: 0, b: 100, draw(c, u, t) {
  t = 3;
  const cam = kcam({ cx: 540, cy: 1590, s: 14.2, th: .36, el: .52 });
  sky(c, [[0, DAWN_SKY[0]], [1920, DAWN_SKY[2]]]);
  ellora(c, { sky: (c, hy) => { horizonSky(c, hy, DAWN_SKY); glow(c, 800, hy, 300, '#FFE0A0', .6); }, cam, t, pal: TEMPLE_PAL.dawn, haze: '#F0A060' });
  people(c, cam, [[-6, 18], [-4.6, 18.6], [7, 31], [19.5, 47], [20.3, 47.6]]);
  motes(c, { n: 40, seed: 2, box: [-100, 300, W + 100, 1900], r: 2.5, col: '#FFE0A8', a: .4, vx: 14, vy: -18, t });
  for (const [y0, y1] of [[220, 640], [1360, 1760]]) { const g = c.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, 'rgba(14,6,12,0)'); g.addColorStop(.35, 'rgba(14,6,12,.78)'); g.addColorStop(.65, 'rgba(14,6,12,.78)'); g.addColorStop(1, 'rgba(14,6,12,0)'); c.fillStyle = g; c.fillRect(0, y0, W, y1 - y0); }
  text(c, 'THIS TEMPLE WAS', 540, 360, '700 62px Cinzel', '#FFF3DC', { glow: ['rgba(0,0,0,.9)', 22], spacing: 3, maxW: 960 });
  text(c, 'NEVER BUILT.', 540, 470, '700 92px Cinzel', '#F4C46A', { glow: ['rgba(255,180,90,.6)', 30], spacing: 4, maxW: 980 });
  text(c, 'IT WAS CARVED FROM', 540, 1480, '700 62px Cinzel', '#FFF3DC', { glow: ['rgba(0,0,0,.9)', 22], spacing: 3, maxW: 960 });
  text(c, 'ONE ROCK', 540, 1600, '700 120px Cinzel', '#F4C46A', { glow: ['rgba(255,180,90,.7)', 40], spacing: 6, maxW: 980 });
} });
