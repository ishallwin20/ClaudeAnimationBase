// bhima_cover.js: the reel's cover (cover.html loads it after bhima.js): Bhima straining at the tail while Hanuman
// yawns, the title inside the 3:4 grid crop (y 240–1680). Render: node render.mjs --page=cover.html --stills=0
SHOTS.length = 0; CAPTIONS.length = 0; POST.length = 0;
SHOTS.push({ a: 0, b: 1, draw(c, u, t) {
  c.save(); cam(c, 470, 1250, 1.38, 540, 1180);
  stage(c, 0, { tailK: 0 });
  hanuman(c, 'yawn');
  bhima(c, BH_BX + 10, BH_BY, 1, 'grip2', 'strain');
  sweat(c, BH_BX + 40, BH_BY - 600, .3);
  c.restore();
  air(c, 0, .6);
  c.save(); c.translate(540, 470); c.scale(1, .42); const g = c.createRadialGradient(0, 0, 0, 0, 0, 560); g.addColorStop(0, 'rgba(20,22,10,.6)'); g.addColorStop(1, 'rgba(20,22,10,0)'); c.fillStyle = g; c.fillRect(-560, -560, 1120, 1120); c.restore();
  const sh = { glow: ['rgba(5,4,12,.9)', 24] };
  text(c, 'BHIMA', 540, 380, '700 120px Cinzel', '#F4C46A', { glow: ['rgba(60,30,0,.9)', 30], spacing: 6 });
  text(c, "couldn't lift", 540, 478, '700 64px Cinzel', '#FFF3DC', sh);
  text(c, "this monkey's TAIL", 540, 560, '700 64px Cinzel', '#FFF3DC', sh);
} });
