// setu_cover.js: the Instagram cover for "This bridge across the SEA was built in FIVE DAYS." (cover.html = studio.html +
// this). One still: the finished bridge running to the horizon in golden light, the title inside the 3:4 grid crop
// (y 240–1680) with the tease.
//   node render.mjs --page=cover.html --stills=0 --out=out/setu_cover
SHOTS.length = 0; CAPTIONS.length = 0;
SHOTS.push({ a: 0, b: 1, draw(c, u, t) {
  reset(); const ex = S3.mood('golden', { at: [0, 0, 0], shadow: 260 }); S3.set(3, { ripple: .15 }); S3.bridge.set(1);
  const d = [B.x - A.x, B.z - A.z], l = Math.hypot(...d), dx = d[0] / l, dz = d[1] / l;
  render3(c, S3.scene, cam3({ pos: [A.x - dx * 95 + dz * 18, 48, A.z - dz * 95 - dx * 18], at: [lerp(A.x, B.x, .62), 0, lerp(A.z, B.z, .62)], fov: 50 }), { exposure: ex * 1.05 });
  c.save(); const g = c.createLinearGradient(0, 0, 0, 820); g.addColorStop(0, 'rgba(10,8,24,.85)'); g.addColorStop(.55, 'rgba(10,8,24,.55)'); g.addColorStop(1, 'rgba(10,8,24,0)'); c.fillStyle = g; c.fillRect(0, 0, W, 820); c.restore();
  text(c, 'BUILT IN', 540, 370, '700 82px Cinzel', '#FFF3DC', { glow: ['rgba(5,4,12,.9)', 24], spacing: 6 });
  text(c, '5 DAYS', 540, 500, '700 150px Cinzel', '#F4C46A', { glow: ['rgba(244,170,60,.6)', 36], spacing: 6 });
  c.save(); const h = c.createLinearGradient(0, 1240, 0, H); h.addColorStop(0, 'rgba(8,6,10,0)'); h.addColorStop(.55, 'rgba(8,6,10,.75)'); h.addColorStop(1, 'rgba(8,6,10,.85)'); c.fillStyle = h; c.fillRect(0, 1240, W, H - 1240); c.restore();
  text(c, 'RAM SETU', 540, 1490, '700 76px Cinzel', '#FFF3DC', { glow: ['rgba(5,4,12,.9)', 20], spacing: 5 });
  text(c, '…and Ram didn’t build it', 540, 1585, '700 52px Cinzel', '#FF9A6A', { glow: ['rgba(5,4,12,.9)', 20], maxW: 980 });
} });
