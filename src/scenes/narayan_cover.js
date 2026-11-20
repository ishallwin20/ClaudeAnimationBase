// narayan_cover.js: the Instagram cover for the Narayanastra reel (cover.html = studio.html + this). One still: Krishna
// holding the army back under the burning mandala and the rain of weapons; the title inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/narayan_out   (then rename t0_00.png to cover.png)
SHOTS.length = 0; CAPTIONS.length = 0; POST.length = 0;
SHOTS.push({ a: 0, b: 1, draw(c, u, t) {
  const T0 = 36.6;
  W3(c, T0, { sky: { fire: .8 }, mandala: 1.2, swarm: { fill: .85, size: 1.2, glow: 1.1 }, pand: { a: 1 }, pandC: { a: 1 }, kaur: { a: 1 }, embers: .8, fog: ['#2A1418', 40, 260], light: { key: 2.2 } },
    { pos: [0, 1.7, 32], at: [0, 10, -40], fov: 52 }, lens(30, 4, { bloom: .1, thresh: 1.3 }));
  stand(c, (g) => mbhFigure(g, { ...CAST.krishna, t: T0, arms: KR_WIDE, mouth: .4, fierce: .4 }), 540, 1900, 1.0, { ...BLUE_L, rim: { col: '#FFC890', dx: 0, dy: -7, a: .9, blur: 2 } });
  band(c, 250, 600, .72);
  text(c, 'THE ONLY WEAPON', 540, 340, '700 66px Cinzel', CREAM, { spacing: 4, glow: ['rgba(6,5,10,.95)', 20], maxW: 980 });
  text(c, 'you beat by', 540, 418, 'italic 52px Marcellus', CREAM, { glow: ['rgba(6,5,10,.95)', 18] });
  text(c, 'DROPPING YOURS', 540, 510, '700 86px Cinzel', GOLD, { spacing: 3, glow: ['rgba(10,6,4,.95)', 26], maxW: 1000 });
  band(c, 1440, 1700, .8);
  text(c, 'नारायणास्त्र', 540, 1530, `76px ${DEVA}`, '#FFE9C0', { glow: ['rgba(244,120,40,.55)', 24] });
  text(c, 'NARAYANASTRA', 540, 1630, '700 92px Cinzel', GOLD, { spacing: 4, glow: ['rgba(10,6,4,.95)', 26], maxW: 1000 });
} });
