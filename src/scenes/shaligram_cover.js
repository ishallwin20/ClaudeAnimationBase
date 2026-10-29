// shaligram_cover.js: the Instagram cover for "This stone is 150 MILLION years old" (cover.html = studio.html + this).
// One still: the Shaligram in the gold studio, its spiral lit, the title inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/shaligram_out   (then rename t0_00.png to cover.png)
SHOTS.length = 0; CAPTIONS.length = 0; POST.length = 0;
SHOTS.push({ a: 0, b: 1, draw(c, u, t) {
  ST.look(0, 1.3); ST.SG.set(0, { split: 0, gold: 1 }); poseStone(ST.SG, { ry: -.2 });
  const F = frame3([0, 0, 0], 1.3, .12, .3, 960, 24);
  render3(c, ST.S, F.cam, { exposure: 1.08, fx: FX.gold(F.d, 9) });
  c.save(); const g = c.createLinearGradient(0, 220, 0, 660); g.addColorStop(0, 'rgba(6,3,4,.92)'); g.addColorStop(.65, 'rgba(6,3,4,.55)'); g.addColorStop(1, 'rgba(6,3,4,0)'); c.fillStyle = g; c.fillRect(0, 0, W, 660); c.restore();
  text(c, '150 MILLION', 540, 360, '700 112px Cinzel', '#F4C46A', { glow: ['rgba(244,170,60,.6)', 30], spacing: 2, maxW: 1000 });
  text(c, 'YEARS OLD', 540, 470, '700 76px Cinzel', '#FFF3DC', { glow: ['rgba(5,4,12,.9)', 24], spacing: 6, maxW: 1000 });
  c.save(); const h = c.createLinearGradient(0, 1280, 0, H); h.addColorStop(0, 'rgba(6,3,4,0)'); h.addColorStop(.35, 'rgba(6,3,4,.8)'); h.addColorStop(1, 'rgba(6,3,4,.92)'); c.fillStyle = h; c.fillRect(0, 1280, W, H - 1280); c.restore();
  text(c, '…and we worship it as', 540, 1470, '46px Marcellus', '#F4E6CC', { glow: ['rgba(6,3,4,.9)', 16] });
  text(c, 'VISHNU', 540, 1570, '700 96px Cinzel', '#FFE2A0', { glow: ['rgba(255,150,40,.7)', 30], spacing: 8 });
} });
