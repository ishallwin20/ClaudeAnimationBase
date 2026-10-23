// jyoti_cover.js: the Instagram cover for "Shiva appeared as LIGHT in 12 places in India." (cover.html = studio.html +
// this). One still: India at dusk with the twelve pillars of light, the title inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/jyoti_cover
SHOTS.length = 0; CAPTIONS.length = 0;
SHOTS.push({ a: 0, b: 1, draw(c, u, t) {
  reset(); const ex = duskIndia(); I3.border.set(1, 2.4, .6); allOn(3, 1);
  CAM3.near = 4; const C = I3.at(82, 21);
  render3(c, I3.scene, cam3({ pos: [C[0], 600, C[2] + 330 + 40], at: [C[0], 0, C[2] + 40], fov: 44 }), { exposure: ex });
  c.save(); const g = c.createLinearGradient(0, 0, 0, 640); g.addColorStop(0, 'rgba(4,4,12,.9)'); g.addColorStop(.6, 'rgba(4,4,12,.55)'); g.addColorStop(1, 'rgba(4,4,12,0)'); c.fillStyle = g; c.fillRect(0, 0, W, 640); c.restore();
  text(c, '12 JYOTIRLINGAS', 540, 330, '700 84px Cinzel', '#F4C46A', { glow: ['rgba(244,170,60,.6)', 34], spacing: 3, maxW: 1000 });
  text(c, 'where Shiva appeared as light', 540, 420, 'italic 54px Marcellus', '#FFF3DC', { glow: ['rgba(5,4,12,.9)', 20], maxW: 980 });
  c.save(); const h = c.createLinearGradient(0, 1300, 0, H); h.addColorStop(0, 'rgba(4,4,12,0)'); h.addColorStop(.5, 'rgba(4,4,12,.8)'); h.addColorStop(1, 'rgba(4,4,12,.9)'); c.fillStyle = h; c.fillRect(0, 1300, W, H - 1300); c.restore();
  text(c, 'How many have YOU seen?', 540, 1560, '700 62px Cinzel', '#FF9A6A', { glow: ['rgba(5,4,12,.9)', 20], maxW: 1000 });
} });
