// jata_cover.js: the Instagram cover for "Why do some sadhus keep JATA and some SHAVE?" (cover.html = studio.html + this).
// One still: the two sadhus at dawn, the title inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/jata_out   (then rename t0_00.png to cover.png)
SHOTS.length = 0; CAPTIONS.length = 0; POST.length = 0;
SHOTS.push({ a: 0, b: 1, draw(c, u, t) {
  dawn(1.3, { hairJ: 1, hairM: 0 });
  cam3({ pos: [-.02, 1.3, 3.25], at: [.03, 1.05, -.9], fov: 40 });
  render3(c, G_.S, CAM3, { exposure: 1.0, fx: lens(dist(JH), 3, { temp: .06 }) });
  band(c, 250, 640, .74);
  text(c, 'JATA', 250, 400, '700 120px Cinzel', GOLD, { spacing: 4, glow: ['rgba(6,5,10,.95)', 30] });
  text(c, 'or', 492, 410, 'italic 66px Marcellus', CREAM, { glow: ['rgba(6,5,10,.95)', 20] });
  text(c, 'SHAVEN', 790, 400, '700 96px Cinzel', '#FFB868', { spacing: 4, glow: ['rgba(6,5,10,.95)', 30] });
  text(c, 'Why are there two kinds of sadhu?', 540, 530, 'italic 46px Marcellus', CREAM, { glow: ['rgba(6,5,10,.95)', 18], maxW: 960 });
  band(c, 1420, 1680, .78);
  text(c, 'THE TEXTS ANSWER', 540, 1550, '700 70px Cinzel', GOLD, { spacing: 4, glow: ['rgba(244,170,60,.4)', 26], maxW: 980 });
} });
