// prad_cover.js: the Instagram cover for "Why do Hindus walk around a temple CLOCKWISE?" (cover.html = studio.html +
// this). One still: the shrine at dusk from the south-east, gold footprints going round it, the title inside the 3:4
// grid crop (y 240–1680) with the tease.
//   node render.mjs --page=cover.html --stills=0 --out=out/prad_cover
SHOTS.length = 0; CAPTIONS.length = 0;
SHOTS.push({ a: 0, b: 1, draw(c, u, t) {
  reset(); const ex = W3.mood('dusk'); T3.set(2, ON);
  RING.forEach((f, i) => { f.visible = true; f.material.opacity = .95; });
  const a = .45;
  render3(c, SC, cam3({ pos: [Math.cos(a) * 18, 6.5, Math.sin(a) * 18], at: [0, 3.2, 0], fov: 46 }), { exposure: ex * 1.05 });
  c.save(); const g = c.createLinearGradient(0, 0, 0, 760); g.addColorStop(0, 'rgba(8,8,24,.8)'); g.addColorStop(.45, 'rgba(8,8,24,.6)'); g.addColorStop(1, 'rgba(8,8,24,0)'); c.fillStyle = g; c.fillRect(0, 0, W, 760); c.restore();
  text(c, 'WHY DO HINDUS', 540, 360, '700 72px Cinzel', '#FFF3DC', { glow: ['rgba(5,4,12,.9)', 24], spacing: 4 });
  text(c, 'WALK CLOCKWISE?', 540, 470, '700 100px Cinzel', '#F4C46A', { glow: ['rgba(244,170,60,.6)', 34], spacing: 2, maxW: 980 });
  c.save(); const h = c.createLinearGradient(0, 1250, 0, H); h.addColorStop(0, 'rgba(8,6,10,0)'); h.addColorStop(.6, 'rgba(8,6,10,.75)'); h.addColorStop(1, 'rgba(8,6,10,.85)'); c.fillStyle = h; c.fillRect(0, 1250, W, H - 1250); c.restore();
  text(c, '…and the ONE temple', 540, 1500, '700 62px Cinzel', '#FFF3DC', { glow: ['rgba(5,4,12,.9)', 20] });
  text(c, 'where you turn BACK', 540, 1590, '700 62px Cinzel', '#FF9A6A', { glow: ['rgba(5,4,12,.9)', 20] });
} });
