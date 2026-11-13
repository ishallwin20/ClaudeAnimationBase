// tridevi_cover.js: the Instagram cover for "Lakshmi was born as BRAHMA'S sister" (cover.html = studio.html + this).
// One still: the three goddesses side by side on the stage, the mothers behind; the title inside the 3:4 grid crop
// (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/tridevi_out   (then rename t0_00.png to cover.png)
SHOTS.length = 0; CAPTIONS.length = 0; POST.length = 0;
SHOTS.push({ a: 0, b: 1, draw(c, u, t) {
  ST.set(1.3, WED({ row: { L: 1, SA: 1, G: 1 }, wed: {}, dauGlow: { L: .25, SA: .25, G: .25 }, momLit: { M: .45, K: .45, S: .45 }, stLit: { M: .2, K: .2, S: .2 } }));
  cam3({ pos: [0, .82, 4.5], at: [0, .22, 1.2], fov: 50 });
  render3(c, ST.S, CAM3, { exposure: 1.0, fx: lens(dist([0, .4, 1.25]), 3) });
  band(c, 250, 700, .76);
  text(c, 'LAKSHMI', 540, 380, '700 130px Cinzel', GOLD, { spacing: 6, glow: ['rgba(244,170,60,.4)', 30] });
  text(c, 'was born as', 540, 478, 'italic 46px Marcellus', CREAM, { glow: ['rgba(6,5,10,.95)', 18] });
  text(c, "BRAHMA'S SISTER?", 540, 590, '700 92px Cinzel', '#FFB868', { spacing: 4, glow: ['rgba(6,5,10,.95)', 30], maxW: 980 });
  band(c, 1440, 1690, .78);
  text(c, 'THE DEVI MAHATMYA’S', 540, 1530, '700 50px Cinzel', GOLD, { spacing: 4, glow: ['rgba(6,5,10,.95)', 20], maxW: 980 });
  text(c, 'secret chapter', 540, 1605, 'italic 58px Marcellus', CREAM, { glow: ['rgba(6,5,10,.95)', 18] });
} });
