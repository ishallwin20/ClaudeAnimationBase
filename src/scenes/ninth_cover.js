// ninth_cover.js: the Instagram cover for "The 9th avatar" (cover.html = studio.html + this).
// One still: the plough and the Buddha over seat 9, the title inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/ninth_out   (then rename t0_00.png to cover.png)
SHOTS.length = 0; CAPTIONS.length = 0; POST.length = 0;
SHOTS.push({ a: 0, b: 1, draw(c, u, t) {
  ENV();
  const lit = {}; for (let i = 1; i <= 10; i++) lit[i] = i === 9 ? 1 : 0;
  const rise = {}; for (const i of EIGHT) rise[i] = 0;
  HALL.set(1.2, { lit, rise });
  const n = [Math.sin(.314), 0, -Math.cos(.314)], P = HALL.seatPos(9), d = 4.1;
  cam3({ pos: [P[0] - n[0] * d, 1.98, P[2] - n[2] * d], at: [P[0], 1.86, P[2]], fov: 44 });
  candidates(1.2);
  render3(c, S, CAM3, { exposure: 1.2, fx: lens(dist(ABOVE9), 4) });
  band(c, 230, 640, .75);
  text(c, 'VISHNU’S', 540, 330, '700 54px Cinzel', '#FFF3DC', { spacing: 10, glow: ['rgba(6,5,10,.95)', 18] });
  text(c, '9th AVATAR', 540, 440, '700 130px Cinzel', '#F4C46A', { spacing: 4, glow: ['rgba(244,170,60,.45)', 34] });
  text(c, 'which list is right?', 540, 548, 'italic 46px Marcellus', '#FFF3DC', { glow: ['rgba(6,5,10,.95)', 16] });
  band(c, 1240, 1700, .8);
  text(c, 'BALARAM', 540, 1360, '700 96px Cinzel', BAL_C, { spacing: 4, glow: ['rgba(6,5,10,.95)', 22] });
  text(c, 'or', 540, 1450, 'italic 50px Marcellus', '#FFF3DC', { glow: ['rgba(6,5,10,.95)', 16] });
  text(c, 'BUDDHA?', 540, 1550, '700 96px Cinzel', BUD_C, { spacing: 4, glow: ['rgba(6,5,10,.95)', 22] });
} });
