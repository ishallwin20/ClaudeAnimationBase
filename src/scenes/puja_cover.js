// puja_cover.js: the Instagram cover for "Lakshmi Puja, step by step" (cover.html = studio.html + this).
// One still: the finished puja (the three brass murtis, lamps lit), the title inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/puja_vidhi_out   (then rename t0_00.png to cover.png)
SHOTS.length = 0; CAPTIONS.length = 0; POST.length = 0;
SHOTS.push({ a: 0, b: 1, draw(c, u, t) {
  mandir(2.3, DONE);
  cam3({ pos: [0, .95, 2.05], at: [0, .52, 0], fov: 46 });
  shoot(c, [0, .55, MZ], 2);
  band(c, 260, 720, .74);
  text(c, 'LAKSHMI PUJA', 540, 390, '700 110px Cinzel', GOLD, { spacing: 4, glow: ['rgba(244,170,60,.45)', 30], maxW: 980 });
  text(c, 'the whole vidhi, step by step', 540, 500, 'italic 54px Marcellus', CREAM, { glow: ['rgba(6,5,10,.95)', 18] });
  text(c, 'DIWALI · SUN 8 NOV', 540, 610, '700 46px Cinzel', '#FFE2A0', { spacing: 6, glow: ['rgba(6,5,10,.95)', 16] });
  band(c, 1330, 1660, .78);
  text(c, '14 STEPS', 540, 1450, '700 120px Cinzel', GOLD, { spacing: 8, glow: ['rgba(244,170,60,.45)', 30] });
  text(c, 'save it for Diwali night', 540, 1560, 'italic 50px Marcellus', CREAM, { glow: ['rgba(6,5,10,.95)', 18] });
} });
