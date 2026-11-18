// phere_cover.js: the Instagram cover for "Saat phere were never seven rounds" (cover.html = studio.html + this).
// One still: the fire with its three rings of gold and the seven steps going north; the title inside the 3:4 grid crop
// (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/phere_out   (then rename t0_00.png to cover.png)
SHOTS.length = 0; CAPTIONS.length = 0; POST.length = 0;
SHOTS.push({ a: 0, b: 1, draw(c, u, t) {
  cam3({ pos: [0, 9.5, .6], at: [0, 0, -2.6], fov: 50 });
  const ex = SET.set(1.3, { rounds: ALL3, trail: .5, ringK: 1, stone: 9, steps: 7, stepGlow: Array(7).fill(.7), seventh: .4 });
  R3(c, { exposure: ex, fx: lens(dist([0, 0, -2]), 1.5) });
  const WD = ['FOOD', 'STRENGTH', 'WEALTH', 'JOY', 'CATTLE', 'SEASONS', 'FRIEND'];
  for (let i = 0; i < 7; i++) {
    const [x, y] = toScreen3(SET.STEP(i));
    disc2(c, i + 1, x - 150, y, 9, -1, { r: 28, col: i === 6 ? '#FFE9A8' : GOLD });
    text(c, WD[i], x + 150, y + 3, `700 ${i === 6 ? 44 : 34}px Cinzel`, i === 6 ? '#FFE9A8' : CREAM, { spacing: 2, glow: ['rgba(6,5,10,.95)', 16] });
  }
  band(c, 240, 560, .78);
  text(c, 'SAAT PHERE?', 540, 335, '700 112px Cinzel', GOLD, { spacing: 5, glow: ['rgba(244,170,60,.4)', 30], maxW: 980 });
  text(c, 'The 7 were never rounds.', 540, 430, 'italic 54px Marcellus', CREAM, { glow: ['rgba(6,5,10,.95)', 20], maxW: 980 });
  text(c, 'They were STEPS.', 540, 510, '700 58px Cinzel', '#FFE9A8', { spacing: 3, glow: ['rgba(6,5,10,.95)', 20], maxW: 980 });
  band(c, 1530, 1690, .7);
  text(c, '3 ROUNDS', 540, 1610, '700 60px Cinzel', GOLD, { spacing: 4, glow: ['rgba(6,5,10,.95)', 22] });
} });
