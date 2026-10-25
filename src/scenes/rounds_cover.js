// rounds_cover.js: the Instagram cover for "How many times should you walk around EACH god?" (cover.html = studio.html
// + this). One still: the courtyard at dusk from the south, every god's rounds in gold footprints, the emblems and
// their counts, the title inside the 3:4 grid crop (y 240–1680), the series tag under it.
//   node render.mjs --page=cover.html --stills=0 --out=out/rounds_out   (then rename t0_00.png to cover.png)
SHOTS.length = 0; CAPTIONS.length = 0;
SHOTS.push({ a: 0, b: 1, draw(c, u, t) {
  reset(); const ex = W3.mood('dusk'); SC.fog.near = 40; SC.fog.far = 130; lit(2); showAll(.95);
  const a = 1.5;
  render3(c, SC, cam3({ pos: [Math.cos(a) * 38, 33, Math.sin(a) * 38], at: [0, 0, -3.5], fov: 54 }), { exposure: ex * 1.15 });
  emblems(c, 2, { a: 1, max: 90 });
  allCounts(c, 9, 0, { size: 70 });
  c.save(); const g = c.createLinearGradient(0, 200, 0, 700); g.addColorStop(0, 'rgba(8,8,24,.85)'); g.addColorStop(.6, 'rgba(8,8,24,.6)'); g.addColorStop(1, 'rgba(8,8,24,0)'); c.fillStyle = g; c.fillRect(0, 0, W, 700); c.restore();
  text(c, 'HOW MANY ROUNDS', 540, 360, '700 80px Cinzel', '#FFF3DC', { glow: ['rgba(5,4,12,.9)', 24], spacing: 3, maxW: 1000 });
  text(c, 'FOR EACH GOD?', 540, 470, '700 100px Cinzel', '#F4C46A', { glow: ['rgba(244,170,60,.6)', 34], spacing: 2, maxW: 1000 });
  c.save(); const h = c.createLinearGradient(0, 1350, 0, H); h.addColorStop(0, 'rgba(8,6,10,0)'); h.addColorStop(.5, 'rgba(8,6,10,.75)'); h.addColorStop(1, 'rgba(8,6,10,.85)'); c.fillStyle = h; c.fillRect(0, 1350, W, H - 1350); c.restore();
  text(c, 'PRADAKSHINA · PART 2', 540, 1560, '700 56px Cinzel', '#FF9A6A', { glow: ['rgba(5,4,12,.9)', 20], spacing: 2 });
} });
