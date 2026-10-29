// kerala_cover.js: the Instagram cover for "Kerala was pulled out of the SEA" (cover.html = studio.html + this).
// One still: Parshurama on the headland at sunset, the axe raised and glowing, the title inside the 3:4 grid crop
// (y 240–1680).   node render.mjs --page=cover.html --stills=0 --out=out/kerala_out   (then rename t0_00.png to cover.png)
SHOTS.length = 0; CAPTIONS.length = 0; POST.length = 0;
SHOTS.push({ a: 0, b: 1, draw(c, u, t) {
  hero(c, 1.2, { cam: { z: 1.04, fx: 700, fy: 1200 }, arm: -1.42 });
  c.save(); const g = c.createLinearGradient(0, 200, 0, 700); g.addColorStop(0, 'rgba(10,6,20,.92)'); g.addColorStop(.6, 'rgba(10,6,20,.55)'); g.addColorStop(1, 'rgba(10,6,20,0)'); c.fillStyle = g; c.fillRect(0, 0, W, 700); c.restore();
  text(c, 'KERALA', 540, 380, '700 150px Cinzel', '#F4C46A', { glow: ['rgba(244,150,50,.65)', 34], spacing: 6, maxW: 1000 });
  text(c, 'rose out of the SEA', 540, 490, '700 64px Cinzel', '#FFF3DC', { glow: ['rgba(5,4,12,.9)', 22], spacing: 2, maxW: 1000 });
  c.save(); const h = c.createLinearGradient(0, 1300, 0, H); h.addColorStop(0, 'rgba(6,4,10,0)'); h.addColorStop(.4, 'rgba(6,4,10,.75)'); h.addColorStop(1, 'rgba(6,4,10,.92)'); c.fillStyle = h; c.fillRect(0, 1300, W, H - 1300); c.restore();
  text(c, '…with ONE throw of an', 540, 1500, '48px Marcellus', '#F4E6CC', { glow: ['rgba(6,3,4,.9)', 16] });
  text(c, 'AXE', 540, 1610, '700 120px Cinzel', '#FFE2A0', { glow: ['rgba(255,150,40,.75)', 34], spacing: 14 });
} });
