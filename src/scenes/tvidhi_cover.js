// tvidhi_cover.js: the Instagram cover for "Tulsi Vivah, step by step" (cover.html = studio.html + this).
// One still: the finished wedding at dusk (the tulsi as a bride under her sugarcane mandap, the moon up), the title
// inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/tulsi_vidhi_out   (then rename t0_00.png to cover.png)
SHOTS.length = 0; CAPTIONS.length = 0; POST.length = 0;
SHOTS.push({ a: 0, b: 1, draw(c, u, t) {
  court(2.3, ST(DONE, { light: .7, door: .6 }));
  cam3({ pos: [0, .95, 3.2], at: [0, 1.02, 0], fov: 46 });
  shoot(c, [0, .9, 0], 2);
  band(c, 260, 720, .7);
  text(c, 'TULSI VIVAH', 540, 390, '700 120px Cinzel', GOLD, { spacing: 4, glow: ['rgba(244,170,60,.45)', 30], maxW: 980 });
  text(c, 'the whole vidhi, step by step', 540, 500, 'italic 54px Marcellus', CREAM, { glow: ['rgba(6,5,10,.95)', 18] });
  text(c, 'SAT 21 NOV · DWADASHI', 540, 610, '700 46px Cinzel', '#FFE2A0', { spacing: 6, glow: ['rgba(6,5,10,.95)', 16] });
  band(c, 1330, 1660, .78);
  text(c, '12 STEPS', 540, 1450, '700 120px Cinzel', GOLD, { spacing: 8, glow: ['rgba(244,170,60,.45)', 30] });
  text(c, 'save it for the wedding', 540, 1560, 'italic 50px Marcellus', CREAM, { glow: ['rgba(6,5,10,.95)', 18] });
} });
