// aarti_cover.js: the Instagram cover for "You've been doing AARTI wrong" (cover.html = studio.html + this). One still:
// the murti in the sanctum with every circle of the lamp in gold and the counts beside them, the title inside the 3:4
// grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/aarti_out   (then rename t0_00.png to cover.png)
SHOTS.length = 0; CAPTIONS.length = 0; POST.length = 0;
SHOTS.push({ a: 0, b: 1, draw(c, u, t) {
  SCR.set(0); const ex = night(); SAN.set(2); LAMP.place(circleAt('face', 0, .3), 2); MUR.chakra.rotation.x = 1;
  showRings(2, { full: true, a: .95 });
  render3(c, SC, cam3({ pos: [4.4, 1.55, -.3], at: [0, PED + .86, 0], fov: 50 }), { exposure: ex * 1.05 });
  for (const [id, n, lab, , side] of SUMMARY) partCount(c, id, n, 9, 0, { size: 92, label: lab, side, gap: side < 0 ? 10 : 40, noPop: true });
  c.save(); const g = c.createLinearGradient(0, 200, 0, 700); g.addColorStop(0, 'rgba(8,6,10,.9)'); g.addColorStop(.6, 'rgba(8,6,10,.65)'); g.addColorStop(1, 'rgba(8,6,10,0)'); c.fillStyle = g; c.fillRect(0, 0, W, 700); c.restore();
  text(c, "YOU'VE BEEN DOING", 540, 330, '700 76px Cinzel', '#FFF3DC', { glow: ['rgba(5,4,12,.9)', 24], spacing: 3, maxW: 1000 });
  text(c, 'AARTI WRONG', 540, 440, '700 112px Cinzel', '#F4C46A', { glow: ['rgba(244,170,60,.6)', 34], spacing: 2, maxW: 1000 });
  c.save(); const h = c.createLinearGradient(0, 1380, 0, H); h.addColorStop(0, 'rgba(8,6,10,0)'); h.addColorStop(.4, 'rgba(8,6,10,.8)'); h.addColorStop(1, 'rgba(8,6,10,.9)'); c.fillStyle = h; c.fillRect(0, 1380, W, H - 1380); c.restore();
  text(c, '4 · 2 · 3 · 7', 540, 1560, '700 84px Cinzel', '#FFE2A0', { glow: ['rgba(255,150,40,.6)', 26], spacing: 4 });
} });
