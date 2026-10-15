// durgama_cover.js: the Instagram cover for ad 19 (cover.html = studio.html + this). Replaces the reel's shots with one
// still: Durga in the storm, eyes burning, and the title kept inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/durgama_cover
SHOTS.length = 0; POST.length = 0; CAPTIONS.length = 0;
SHOTS.push({ a: 0, b: 100, draw(c, u, t) {
  t = 1.25;
  plane(c, { z: 1 }, 0, (c) => { STORM(c); glow(c, 540, 1500, 1000, '#FF5A1E', .45); });
  plane(c, { z: 1 }, .1, (c) => clouds(c, [[0, 300, 900, 11, 30], [600, 560, 760, 12, 45, true], [200, 860, 800, 13, 22]], t, PALETTES.red, .85));
  bolt(c, 120, -40, 260, 700, 3, .5, '#FFD0B0');
  ridge(c, 1640, 120, 21, '#1A060A', { freq: .004 }); haze(c, 1620, 200, '#D0461E', .4);
  glow(c, 540, 1050, 620, '#FFC860', .22); durgaFig(c, 540, 1900, 1.3, t, { fire: .9 }, LIT_RED(.3)); embers(c, 540, 1950, t, 60, 4, 1200, 1500);
  for (const [y0, y1] of [[180, 480], [1360, 1720]]) { const g = c.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, 'rgba(8,2,4,0)'); g.addColorStop(.35, 'rgba(8,2,4,.75)'); g.addColorStop(.65, 'rgba(8,2,4,.75)'); g.addColorStop(1, 'rgba(8,2,4,0)'); c.fillStyle = g; c.fillRect(0, y0, W, y1 - y0); }
  text(c, "MAA DURGA'S NAME", 540, 300, '700 78px Cinzel', '#FFF3DC', { glow: ['rgba(0,0,0,.9)', 24], spacing: 3, maxW: 960 });
  text(c, 'CAME FROM A DEMON', 540, 395, '700 70px Cinzel', '#F4C46A', { glow: ['rgba(244,150,60,.6)', 26], spacing: 3, maxW: 960 });
  text(c, 'SHE EARNED IT WITH', 540, 1460, '700 62px Cinzel', '#FFF3DC', { glow: ['rgba(0,0,0,.9)', 24], spacing: 3, maxW: 960 });
  text(c, '15 ARROWS', 540, 1580, '700 140px Cinzel', '#F4C46A', { glow: ['rgba(255,170,60,.85)', 40], spacing: 6, maxW: 980 });
} });
