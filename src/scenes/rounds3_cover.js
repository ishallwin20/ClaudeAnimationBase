// rounds3_cover.js: the Instagram cover for "How many times should you walk around HANUMAN?" (cover.html = studio.html
// + this). One still: Hanuman's shrine at dusk, his rounds in gold and vermilion footprints, the gada in light, the
// title inside the 3:4 grid crop (y 240–1680), the series tag under it.
//   node render.mjs --page=cover.html --stills=0 --out=out/rounds3_out   (then rename t0_00.png to cover.png)
SHOTS.length = 0; CAPTIONS.length = 0;
SHOTS.push({ a: 0, b: 1, draw(c, u, t) {
  reset(); const ex = W3.mood('dusk'); lit(2);
  const g = god('hanuman'); g.rings.forEach((r, i) => trailSet(r, .95));
  render3(c, SC, orbit(g, 0, 15.5, 11, 1.9, 1.9, { atY: 5.2 }), { exposure: ex * 1.1 });
  const e = emblemAt('hanuman'); emblem(c, 'hanuman', e.x, e.y, Math.min(e.s, 190), 2, 1);
  c.save(); const gr = c.createLinearGradient(0, 200, 0, 700); gr.addColorStop(0, 'rgba(8,8,24,.85)'); gr.addColorStop(.6, 'rgba(8,8,24,.6)'); gr.addColorStop(1, 'rgba(8,8,24,0)'); c.fillStyle = gr; c.fillRect(0, 0, W, 700); c.restore();
  text(c, 'HOW MANY ROUNDS', 540, 360, '700 80px Cinzel', '#FFF3DC', { glow: ['rgba(5,4,12,.9)', 24], spacing: 3, maxW: 1000 });
  text(c, 'FOR HANUMAN?', 540, 470, '700 104px Cinzel', '#FF9A6A', { glow: ['rgba(244,120,60,.6)', 34], spacing: 2, maxW: 1000 });
  c.save(); const h = c.createLinearGradient(0, 1350, 0, H); h.addColorStop(0, 'rgba(8,6,10,0)'); h.addColorStop(.5, 'rgba(8,6,10,.75)'); h.addColorStop(1, 'rgba(8,6,10,.85)'); c.fillStyle = h; c.fillRect(0, 1350, W, H - 1350); c.restore();
  text(c, 'KRISHNA · MURUGAN · NAVAGRAHA', 540, 1480, '700 40px Cinzel', '#FFE2A0', { glow: ['rgba(5,4,12,.9)', 20], spacing: 2, maxW: 960 });
  text(c, 'PRADAKSHINA · PART 3', 540, 1570, '700 56px Cinzel', '#F4C46A', { glow: ['rgba(5,4,12,.9)', 20], spacing: 2 });
} });
