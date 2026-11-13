// palm_cover.js: the Instagram cover for "Your palm has FOUR holy places" (cover.html = studio.html + this).
// One still: the palm with its four tirthas lit and numbered, the fourth cold; the title inside the 3:4 grid crop
// (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/palm_out   (then rename t0_00.png to cover.png)
SHOTS.length = 0; CAPTIONS.length = 0; POST.length = 0;
SHOTS.push({ a: 0, b: 1, draw(c, u, t) {
  const ex = SET.set(1.3, { hand: REST, mk: { deva: 1, praja: 1, brahma: 1, pitri: [1.4, 'cold'] }, cold: .25 });
  cam3({ pos: [.018, .52, .17], at: [.018, 0, -.085], fov: 40 });
  render3(c, SET.S, CAM3, { exposure: ex, fx: lens(dist(W3([0, 0, -.03])), 3) });
  badges(c, 9, -1, { cols: [GOLD, GOLD, GOLD, COLD] });
  band(c, 250, 640, .7);
  text(c, 'YOUR PALM HAS', 540, 340, '700 76px Cinzel', CREAM, { spacing: 5, glow: ['rgba(6,5,10,.95)', 24] });
  text(c, '4 HOLY PLACES', 540, 450, '700 100px Cinzel', GOLD, { spacing: 4, glow: ['rgba(244,170,60,.4)', 30], maxW: 980 });
  text(c, 'one belongs to the dead', 540, 548, 'italic 54px Marcellus', COLD, { glow: ['rgba(6,5,10,.95)', 20] });
  band(c, 1430, 1690, .75);
  text(c, 'WHICH ONE DO YOU', 540, 1525, '700 54px Cinzel', CREAM, { spacing: 4, glow: ['rgba(6,5,10,.95)', 20], maxW: 980 });
  text(c, 'SIP FROM?', 540, 1610, '700 70px Cinzel', GOLD, { spacing: 4, glow: ['rgba(6,5,10,.95)', 20], maxW: 980 });
} });
