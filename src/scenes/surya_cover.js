// surya_cover.js: the Instagram cover for ad/16-book4-sun (cover.html = studio.html + this). Replaces the reel's shots
// with one still: the dead black sun over the frozen land, the title kept inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/surya_cover
SHOTS.length = 0; POST.length = 0; CAPTIONS.length = 0;
SHOTS.push({ a: 0, b: 100, draw(c, u, t) {
  t = 1.3;
  coldSky(c); stars(c, 120, 21, t, .6);
  sunDisc(c, 540, 900, 260, t, { life: .12 });
  ridge(c, 1330, 140, 41, '#0C1220'); haze(c, 1320, 200, '#3A4A68', .35); ridge(c, 1410, 70, 42, '#080C16');
  fillPath(c, 'M -200 1440 C 200 1410 800 1420 1280 1450 L 1280 2400 L -200 2400 Z', '#121A2A'); frost(c, 1440, .9, t); huts(c, 120, 980, 1452, .7, 0, '#070A12');
  motes(c, { n: 90, seed: 3, box: [-100, 0, W + 100, 1950], r: 3, col: '#DCE6FF', a: .5, vx: 50, vy: 90, t });
  for (const [y0, y1] of [[220, 560], [1400, 1720]]) { const g = c.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, 'rgba(2,3,8,0)'); g.addColorStop(.35, 'rgba(2,3,8,.75)'); g.addColorStop(.65, 'rgba(2,3,8,.75)'); g.addColorStop(1, 'rgba(2,3,8,0)'); c.fillStyle = g; c.fillRect(0, y0, W, y1 - y0); }
  text(c, 'THE DAY THE', 540, 330, '700 64px Cinzel', '#FFF3DC', { glow: ['rgba(0,0,0,.9)', 24], spacing: 3, maxW: 960 });
  text(c, 'SUN WENT OUT', 540, 450, '700 104px Cinzel', '#F4C46A', { glow: ['rgba(244,150,60,.6)', 30], spacing: 4, maxW: 980 });
  text(c, 'WHO SAVED', 540, 1500, '700 64px Cinzel', '#FFF3DC', { glow: ['rgba(0,0,0,.9)', 24], spacing: 3, maxW: 960 });
  text(c, 'THE WORLD?', 540, 1615, '700 110px Cinzel', '#F4C46A', { glow: ['rgba(255,170,60,.85)', 40], spacing: 5, maxW: 980 });
} });
