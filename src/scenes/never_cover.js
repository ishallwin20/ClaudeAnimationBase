// never_cover.js: the Instagram cover for "NEVER offer THIS flower to SHIVA" (cover.html = studio.html + this). One
// still: the ketaki on black in its warm light, a red ✗ stamped on it, the title inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/never_out   (then rename t0_00.png to cover.png)
SHOTS.length = 0; CAPTIONS.length = 0;
SHOTS.push({ a: 0, b: 1, draw(c, u, t) {
  STU.put(['ketaki']); STU.F.ketaki.position.set(0, 0, 0); STU.F.ketaki.scale.setScalar(1); STU.F.ketaki.rotation.set(0, .6, 0); stuLight(0);
  render3(c, STU.scene, stuCam(.35, 1.75, .4, [0, .2, 0]), { exposure: 1.1 });
  glow(c, 540, 900, 560, '#FFC890', .14);
  mark(c, false, 740, 1180, 180, 1, 0);
  c.save(); const gr = c.createLinearGradient(0, 200, 0, 720); gr.addColorStop(0, 'rgba(6,4,6,.9)'); gr.addColorStop(.7, 'rgba(6,4,6,.55)'); gr.addColorStop(1, 'rgba(6,4,6,0)'); c.fillStyle = gr; c.fillRect(0, 0, W, 720); c.restore();
  text(c, 'NEVER OFFER', 540, 370, '700 92px Cinzel', '#FFF3DC', { glow: ['rgba(5,4,12,.9)', 24], spacing: 3, maxW: 1000 });
  text(c, 'THIS TO SHIVA', 540, 490, '700 104px Cinzel', '#FF6A50', { glow: ['rgba(240,80,50,.55)', 34], spacing: 2, maxW: 1000 });
  c.save(); const h = c.createLinearGradient(0, 1350, 0, H); h.addColorStop(0, 'rgba(6,4,6,0)'); h.addColorStop(.5, 'rgba(6,4,6,.8)'); h.addColorStop(1, 'rgba(6,4,6,.9)'); c.fillStyle = h; c.fillRect(0, 1350, W, H - 1350); c.restore();
  text(c, 'It once told a LIE', 540, 1480, 'italic 56px Marcellus', '#FFE2A0', { glow: ['rgba(5,4,12,.9)', 20], maxW: 960 });
  text(c, 'SHIVA PURANA', 540, 1575, '700 46px Cinzel', '#F4C46A', { glow: ['rgba(5,4,12,.9)', 20], spacing: 3 });
} });
