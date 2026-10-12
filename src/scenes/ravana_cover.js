// ravana_cover.js: the Instagram cover for ad 15 (cover.html = studio.html + this). Replaces the reel's shots with one
// still: the hook image (Ravana holding Kailash on twenty arms) and a big title kept inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/ravana_cover
SHOTS.length = 0; POST.length = 0; CAPTIONS.length = 0;
SHOTS.push({ a: 0, b: 100, draw(c, u, t) {
  liftSet(c, { z: .97, fx: 540, fy: 900, y: -70 }, 1.3, { reach: 1, fl: .35, hole: 1, debris: -1.2, bolts: [[160, -40, 300, 640, 3], [960, -40, 820, 520, 9]], strain: 1 });
  // a dark band behind each block of lettering
  for (const [y0, y1] of [[200, 500], [1370, 1720]]) { const g = c.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, 'rgba(8,2,4,0)'); g.addColorStop(.35, 'rgba(8,2,4,.72)'); g.addColorStop(.65, 'rgba(8,2,4,.72)'); g.addColorStop(1, 'rgba(8,2,4,0)'); c.fillStyle = g; c.fillRect(0, y0, W, y1 - y0); }
  text(c, 'RAVANA LIFTED', 540, 312, '700 84px Cinzel', '#FFF3DC', { glow: ['rgba(0,0,0,.9)', 24], spacing: 3, maxW: 960 });
  text(c, "SHIVA'S MOUNTAIN", 540, 408, '700 74px Cinzel', '#F4C46A', { glow: ['rgba(244,150,60,.6)', 26], spacing: 3, maxW: 960 });
  text(c, 'SHIVA USED', 540, 1468, '700 70px Cinzel', '#FFF3DC', { glow: ['rgba(0,0,0,.9)', 24], spacing: 4, maxW: 960 });
  text(c, 'ONE TOE', 540, 1585, '700 150px Cinzel', '#F4C46A', { glow: ['rgba(255,170,60,.85)', 40], spacing: 6, maxW: 980 });
} });
