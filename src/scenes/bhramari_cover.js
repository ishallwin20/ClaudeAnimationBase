// bhramari_cover.js: the Instagram cover for reel/bhramari-bees (cover.html = studio.html + this). Replaces the reel's
// shots with one still: Arunasura laughing on his throne in the storm, the gold bee on the throne's arm with its six legs lit,
// and the title kept inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/bhramari_cover
SHOTS.length = 0; POST.length = 0; CAPTIONS.length = 0;
SHOTS.push({ a: 0, b: 100, draw(c, u, t) {
  t = 1.3;
  redSky(c);
  clouds(c, [[100, 520, 820, 31, 22], [820, 640, 760, 32, 30, true]], t, PALETTES.red, .85);
  bolt(c, 150, 200, 300, 900, 7, .7); bolt(c, 960, 200, 800, 860, 11, .55);
  ridge(c, 1700, 80, 31, '#12050A'); haze(c, 1680, 260, '#8A2A1A', .45);
  onThrone(c, 500, 1690, 1.0, { t, expr: 'laugh', lean: -.05, look: [.8, .8] }, { ...STORM, rim: { ...STORM.rim, a: 1.2 } });
  motes(c, { n: 40, seed: 5, box: [-100, 300, W + 100, 1900], r: 3, col: '#FFB060', a: .6, vx: 40, vy: -60, t });
  // the bee, glowing gold, its six legs lit
  glow(c, 800, 1150, 420, '#FFC860', .5);
  bee(c, 800, 1150, { k: .78, t, rot: -.35, lit: 6, gold: 1, wings: 0 });
  // a dark band behind each block of lettering
  for (const [y0, y1] of [[200, 520], [1360, 1720]]) { const g = c.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, 'rgba(8,2,4,0)'); g.addColorStop(.35, 'rgba(8,2,4,.75)'); g.addColorStop(.65, 'rgba(8,2,4,.75)'); g.addColorStop(1, 'rgba(8,2,4,0)'); c.fillStyle = g; c.fillRect(0, y0, W, y1 - y0); }
  text(c, 'NOTHING WITH 2 OR 4 LEGS', 540, 318, '700 62px Cinzel', '#FFF3DC', { glow: ['rgba(0,0,0,.9)', 24], spacing: 2, maxW: 960 });
  text(c, 'COULD KILL HIM', 540, 414, '700 84px Cinzel', '#F4C46A', { glow: ['rgba(244,150,60,.6)', 26], spacing: 3, maxW: 960 });
  text(c, 'MAA DURGA CAME WITH', 540, 1462, '700 62px Cinzel', '#FFF3DC', { glow: ['rgba(0,0,0,.9)', 24], spacing: 3, maxW: 960 });
  text(c, 'SIX LEGS', 540, 1585, '700 150px Cinzel', '#F4C46A', { glow: ['rgba(255,170,60,.85)', 40], spacing: 6, maxW: 980 });
} });
