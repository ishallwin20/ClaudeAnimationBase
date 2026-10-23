// kai_cover.js: the Instagram cover for "No human has EVER climbed this mountain." (cover.html = studio.html + this).
// One still: Kailash's south face in golden light, the gold kora round its foot, the title inside the 3:4 grid crop
// (y 240–1680) with the tease.
//   node render.mjs --page=cover.html --stills=0 --out=out/kai_cover
SHOTS.length = 0; CAPTIONS.length = 0;
SHOTS.push({ a: 0, b: 1, draw(c, u, t) {
  reset(); const ex = K3.mood('golden'); K3.set(3, { clouds: .3, plume: .9 }); RIB.set(1, .9);
  render3(c, KS, cam3({ pos: [6, 20, 92], at: [0, 11.5, 0], fov: 42 }), { exposure: ex * 1.05 });
  c.save(); const g = c.createLinearGradient(0, 0, 0, 780); g.addColorStop(0, 'rgba(8,10,28,.85)'); g.addColorStop(.5, 'rgba(8,10,28,.6)'); g.addColorStop(1, 'rgba(8,10,28,0)'); c.fillStyle = g; c.fillRect(0, 0, W, 780); c.restore();
  text(c, 'NO HUMAN HAS', 540, 360, '700 78px Cinzel', '#FFF3DC', { glow: ['rgba(5,4,12,.9)', 24], spacing: 4 });
  text(c, 'EVER CLIMBED IT', 540, 470, '700 96px Cinzel', '#F4C46A', { glow: ['rgba(244,170,60,.6)', 34], spacing: 2, maxW: 990 });
  c.save(); const h = c.createLinearGradient(0, 1250, 0, H); h.addColorStop(0, 'rgba(8,6,10,0)'); h.addColorStop(.6, 'rgba(8,6,10,.75)'); h.addColorStop(1, 'rgba(8,6,10,.85)'); c.fillStyle = h; c.fillRect(0, 1250, W, H - 1250); c.restore();
  text(c, 'MOUNT KAILASH', 540, 1500, '700 66px Cinzel', '#FFF3DC', { glow: ['rgba(5,4,12,.9)', 20], spacing: 3 });
  text(c, '…so pilgrims do THIS instead', 540, 1590, '700 54px Cinzel', '#FF9A6A', { glow: ['rgba(5,4,12,.9)', 20], maxW: 980 });
} });
