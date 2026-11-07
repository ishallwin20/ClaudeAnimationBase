// toran_cover.js: the Instagram cover for "Why mango leaves over the door?" (cover.html = studio.html + this).
// One still: the mango toran over the door in morning sun, the title inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/toran_out   (then rename t0_00.png to cover.png)
SHOTS.length = 0; CAPTIONS.length = 0; POST.length = 0;
SHOTS.push({ a: 0, b: 1, draw(c, u, t) {
  homeDay(1.3, { wind: .7 });
  cam3({ pos: [.75, 2.2, 2.9], at: [-.05, 2.3, 0], fov: 50 });
  render3(c, H_.S, CAM3, { exposure: 1.0, fx: lens(dist([-.1, TY - .1, .22]), 3, { temp: .06 }) });
  band(c, 250, 700, .72);
  text(c, 'WHY', 540, 330, '700 64px Cinzel', CREAM, { spacing: 12, glow: ['rgba(6,5,10,.95)', 18] });
  text(c, 'MANGO LEAVES', 540, 450, '700 110px Cinzel', '#B8E08A', { spacing: 4, glow: ['rgba(6,5,10,.95)', 30], maxW: 980 });
  text(c, 'over the door?', 540, 570, 'italic 66px Marcellus', CREAM, { glow: ['rgba(6,5,10,.95)', 20] });
  band(c, 1300, 1660, .78);
  text(c, 'Your grandmother', 540, 1420, 'italic 58px Marcellus', CREAM, { glow: ['rgba(6,5,10,.95)', 18] });
  text(c, 'WASN’T DECORATING', 540, 1530, '700 76px Cinzel', GOLD, { spacing: 4, glow: ['rgba(244,170,60,.4)', 26], maxW: 980 });
} });
