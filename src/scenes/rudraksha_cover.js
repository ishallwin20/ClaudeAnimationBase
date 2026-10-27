// rudraksha_cover.js: the Instagram cover for "Count the lines on your RUDRAKSHA" (cover.html = studio.html + this). One
// still: a five-line bead from above on the velvet, its lines lit, the gold halo, the title inside the 3:4 grid crop
// (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/rudraksha_out   (then rename t0_00.png to cover.png)
SHOTS.length = 0; CAPTIONS.length = 0; POST.length = 0;
SHOTS.push({ a: 0, b: 1, draw(c, u, t) {
  const ex = studio({ bead: 1, key: [2, 8, 4] });
  B.setN(5); B.spin.rotation.y = 2.2; B.lines(1, 1);
  const az = .5, o = orbit(14.2, 1.15, az, [Math.sin(az) * .2, -.2, Math.cos(az) * .2]);
  EMB.place('kalagni', 5, .55, o.pos, [0, 0, 0], 1.8, 4.6);
  render3(c, ST.S, o.cam, { exposure: ex * 1.05 });
  c.save(); const g = c.createLinearGradient(0, 200, 0, 640); g.addColorStop(0, 'rgba(8,4,6,.92)'); g.addColorStop(.65, 'rgba(8,4,6,.6)'); g.addColorStop(1, 'rgba(8,4,6,0)'); c.fillStyle = g; c.fillRect(0, 0, W, 640); c.restore();
  text(c, 'COUNT THE LINES', 540, 330, '700 92px Cinzel', '#F4C46A', { glow: ['rgba(244,170,60,.6)', 30], spacing: 2, maxW: 1000 });
  text(c, 'ON YOUR RUDRAKSHA', 540, 430, '700 64px Cinzel', '#FFF3DC', { glow: ['rgba(5,4,12,.9)', 24], spacing: 3, maxW: 1000 });
  c.save(); const h = c.createLinearGradient(0, 1300, 0, H); h.addColorStop(0, 'rgba(8,4,6,0)'); h.addColorStop(.35, 'rgba(8,4,6,.82)'); h.addColorStop(1, 'rgba(8,4,6,.92)'); c.fillStyle = h; c.fillRect(0, 1300, W, H - 1300); c.restore();
  text(c, 'EACH NUMBER IS A GOD', 540, 1500, '700 62px Cinzel', '#FFE2A0', { glow: ['rgba(255,150,40,.6)', 24], spacing: 3, maxW: 980 });
  text(c, '1 · 4 · 6 · 9 · 10 · 12 · 14', 540, 1590, '700 44px Cinzel', '#F4C46A', { glow: ['rgba(10,6,4,.9)', 16], spacing: 3 });
} });
