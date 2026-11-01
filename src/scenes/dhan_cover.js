// dhan_cover.js: the Instagram cover for "DHANTERAS was never about GOLD" (cover.html = studio.html + this).
// One still: the gold coin standing on red puja cloth, the jug of amrit glowing behind it; the title inside the 3:4 grid
// crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/dhan_out   (then rename t0_00.png to cover.png)
SHOTS.length = 0; CAPTIONS.length = 0;
SHOTS.push({ a: 0, b: 1, draw(c, u, t) {
  clip(.05, 80); ST.set(2); ST.coin.group.visible = true;
  coinPose(ST.coin, -.3, .3, .42, 0);
  const K = ST.K; K.visible = true; K.position.set(.5, 0, -.45); K.set(2, 1);
  cam3({ pos: [.1, 1.15, 6.2], at: [.08, .5, 0], fov: 30 });
  render3(c, ST.S, CAM3, { exposure: 1.08, fx: lens(dist([-.3, .5, .3]), 8) });
  c.save(); const gr = c.createLinearGradient(0, 200, 0, 760); gr.addColorStop(0, 'rgba(6,4,6,.92)'); gr.addColorStop(.7, 'rgba(6,4,6,.6)'); gr.addColorStop(1, 'rgba(6,4,6,0)'); c.fillStyle = gr; c.fillRect(0, 0, W, 760); c.restore();
  text(c, 'DHANTERAS', 540, 370, '700 110px Cinzel', '#FFF3DC', { glow: ['rgba(5,4,12,.9)', 24], spacing: 4, maxW: 1000 });
  text(c, 'was never about', 540, 475, 'italic 64px Marcellus', '#FFE2A0', { glow: ['rgba(5,4,12,.9)', 20], maxW: 960 });
  c.save(); const h = c.createLinearGradient(0, 1250, 0, H); h.addColorStop(0, 'rgba(6,4,6,0)'); h.addColorStop(.4, 'rgba(6,4,6,.85)'); h.addColorStop(1, 'rgba(6,4,6,.94)'); c.fillStyle = h; c.fillRect(0, 1250, W, H - 1250); c.restore();
  text(c, 'GOLD', 540, 1440, '700 150px Cinzel', '#FFD27A', { glow: ['rgba(240,180,80,.5)', 34], spacing: 6 });
  text(c, 'BHAGAVATA · PADMA PURANA', 540, 1580, '700 40px Cinzel', '#F4C46A', { glow: ['rgba(5,4,12,.9)', 20], spacing: 3 });
} });
