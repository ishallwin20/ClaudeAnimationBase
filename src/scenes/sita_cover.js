// sita_cover.js: the Instagram cover for "Was RAM right to leave SITA?" (cover.html = studio.html + this).
// One still: Sita alone on the Ganga's bank at dusk, the boat going away, the question in the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/sita_out   (then rename t0_00.png to cover.png)
SHOTS.length = 0; CAPTIONS.length = 0; POST.length = 0;
SHOTS.push({ a: 0, b: 1, draw(c, u, t) {
  const cam = { z: 1.02, fx: 470, fy: 900 };
  duskRiver(c, cam, 1.2, { boat: .25 });
  plane(c, cam, 1, (c) => figure(c, (f) => { f.translate(560, 2200); f.scale(1.3, 1.3); sita(f, { t: 1.2, eyes: .4, wind: .55, tears: .6 }); }, { ...LIGHTS.moon, rim: { ...LIGHTS.moon.rim, dx: 8, a: .9 } }));
  c.save(); const g = c.createLinearGradient(0, 240, 0, 860); g.addColorStop(0, 'rgba(6,4,12,.85)'); g.addColorStop(.7, 'rgba(6,4,12,.55)'); g.addColorStop(1, 'rgba(6,4,12,0)'); c.fillStyle = g; c.fillRect(0, 0, W, 860); c.restore();
  text(c, 'Was', 540, 360, 'italic 64px Marcellus', '#FFE8C0', { glow: ['rgba(5,4,12,.9)', 20] });
  text(c, 'RAM RIGHT', 540, 470, '700 112px Cinzel', '#F4C46A', { glow: ['rgba(244,170,60,.55)', 28], spacing: 4, maxW: 1000 });
  text(c, 'to leave', 540, 560, 'italic 64px Marcellus', '#FFE8C0', { glow: ['rgba(5,4,12,.9)', 20] });
  text(c, 'SITA?', 540, 680, '700 120px Cinzel', '#F4C46A', { glow: ['rgba(244,170,60,.55)', 28], spacing: 6 });
  c.save(); const h = c.createLinearGradient(0, 1300, 0, H); h.addColorStop(0, 'rgba(6,4,8,0)'); h.addColorStop(.35, 'rgba(6,4,8,.8)'); h.addColorStop(1, 'rgba(6,4,8,.92)'); c.fillStyle = h; c.fillRect(0, 1300, W, H - 1300); c.restore();
  text(c, '4 POETS · 2,000 YEARS', 540, 1500, '700 54px Cinzel', '#FFE2A0', { glow: ['rgba(255,150,40,.5)', 22], spacing: 3 });
  text(c, 'Valmiki · Kalidasa · Bhavabhuti · Tulsidas', 540, 1580, '40px Marcellus', '#F4E6CC', { glow: ['rgba(6,3,4,.9)', 16] });
} });
