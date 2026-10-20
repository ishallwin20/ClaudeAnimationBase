// markandeya_cover.js: the Instagram cover for the Markandeya reel (cover.html = studio.html + this). Replaces the
// reel's shots with one still: Yama's face in red, his eyes burning, Shiva's light breaking in behind him; the title
// kept inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/markandeya_out (then t0_00.png → cover.png)
SHOTS.length = 0; POST.length = 0; CAPTIONS.length = 0;
SHOTS.push({ a: 0, b: 100, draw(c, u, t) {
  t = 2;
  SKY.blood(c); glow(c, 540, 1000, 800, '#FF3A1A', .35);
  rays(c, 940, 260, { n: 18, dir: 2.3, spread: 1.6, len: 1500, w: 220, col: '#FFE6B0', a: .45, t, seed: 3 }); glow(c, 940, 260, 420, '#FFF0C0', .5);
  figure(c, (f) => { atFace(f, 540, 760, 3.7); yamaC(f, { t, eyes: 1.0, fierce: .8 }); }, { ...FX.red, grade: [[1040, 'rgba(0,0,0,0)'], [1260, 'rgba(8,2,4,.94)']] });
  c.save(); atFace(c, 540, 760, 3.7); yamaEyeGlow(c, 1, { r: .6 }); c.restore();
  const g = c.createLinearGradient(0, 1100, 0, 1300); g.addColorStop(0, 'rgba(10,3,4,0)'); g.addColorStop(1, 'rgba(10,3,4,.9)'); c.fillStyle = g; c.fillRect(0, 1100, W, 820);
  text(c, 'THE DAY', 540, 1300, '700 76px Cinzel', '#FFF3DC', { glow: ['rgba(0,0,0,.9)', 22], spacing: 4, maxW: 960 });
  text(c, 'YAMRAJ', 540, 1430, '700 136px Cinzel', '#F4C46A', { glow: ['rgba(255,170,90,.6)', 30], spacing: 6, maxW: 980 });
  text(c, 'DIED.', 540, 1585, '700 120px Cinzel', '#FFF3DC', { glow: ['rgba(255,90,40,.7)', 40], spacing: 8, maxW: 980 });
} });
