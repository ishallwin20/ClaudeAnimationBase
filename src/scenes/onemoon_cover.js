// onemoon_cover.js: the Instagram cover for "One moon" (cover.html = studio.html + this). One still: the Thai river
// under the full moon, a krathong, the prang, lanterns; the title inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/onemoon_out   (then rename t0_00.png to cover.png)
SHOTS.length = 0; CAPTIONS.length = 0; POST.length = 0;
SHOTS.push({ a: 0, b: 1, draw(c, u, t) {
  const pos = [.2, .5, .9];
  cam({ pos, at: aimAE(pos, -1, -3.2), fov: 50 });
  river(c, 8, { place: 'thai', moonAz: TM[0], moonEl: TM[1] }, lens(dist(HERO), 2.4, { max: 8 }));
  band(c, 1180, 1690, .62);
  text(c, 'THAILAND FLOATS', 540, 1290, '700 84px Cinzel', CREAM, { spacing: 4, glow: ['rgba(6,5,10,.95)', 24], maxW: 1000 });
  text(c, 'LAMPS FOR', 540, 1390, '700 84px Cinzel', CREAM, { spacing: 4, glow: ['rgba(6,5,10,.95)', 24], maxW: 1000 });
  text(c, 'GANGA', 540, 1530, '700 150px Cinzel', GOLD, { spacing: 8, glow: ['rgba(255,140,50,.55)', 36], maxW: 1000 });
  text(c, 'Loy Krathong · Dev Deepawali · Karthigai Deepam', 540, 1630, 'italic 38px Marcellus', CREAM, { glow: ['rgba(6,5,10,.95)', 16] });
} });
