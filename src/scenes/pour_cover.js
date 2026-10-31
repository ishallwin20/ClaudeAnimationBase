// pour_cover.js: the Instagram cover for "What you POUR on SHIVA decides what you GET" (cover.html = studio.html + this).
// One still: milk running down the black linga from the lota, the title inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/pour_out   (then rename t0_00.png to cover.png)
SHOTS.length = 0; CAPTIONS.length = 0;
SHOTS.push({ a: 0, b: 1, draw(c, u, t) {
  S.reset(); S.set(2);
  pour(2, 'milk', -3, { wet: .62 });
  orbit(.3, 2.6, 1.5, [0, .74, -.08], 38);
  render3(c, SC, CAM3, { exposure: 1.12, fx: lens(dist([0, .8, 0]), 6) });
  c.save(); const gr = c.createLinearGradient(0, 200, 0, 700); gr.addColorStop(0, 'rgba(6,4,6,.9)'); gr.addColorStop(.7, 'rgba(6,4,6,.55)'); gr.addColorStop(1, 'rgba(6,4,6,0)'); c.fillStyle = gr; c.fillRect(0, 0, W, 700); c.restore();
  text(c, 'WHAT YOU POUR', 540, 360, '700 90px Cinzel', '#FFF3DC', { glow: ['rgba(5,4,12,.9)', 24], spacing: 3, maxW: 1000 });
  text(c, 'ON SHIVA', 540, 475, '700 110px Cinzel', '#FFD27A', { glow: ['rgba(240,180,80,.5)', 34], spacing: 3, maxW: 1000 });
  c.save(); const h = c.createLinearGradient(0, 1300, 0, H); h.addColorStop(0, 'rgba(6,4,6,0)'); h.addColorStop(.45, 'rgba(6,4,6,.82)'); h.addColorStop(1, 'rgba(6,4,6,.92)'); c.fillStyle = h; c.fillRect(0, 1300, W, H - 1300); c.restore();
  text(c, 'decides what you GET', 540, 1470, 'italic 64px Marcellus', '#FFE2A0', { glow: ['rgba(5,4,12,.9)', 20], maxW: 960 });
  text(c, 'SHIVA PURANA', 540, 1575, '700 46px Cinzel', '#F4C46A', { glow: ['rgba(5,4,12,.9)', 20], spacing: 3 });
} });
