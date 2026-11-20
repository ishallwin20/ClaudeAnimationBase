// kvr_universe_cover.js: the cover of "Kanha vs Radha" #2 (cover.html): the title inside the grid's 3:4 crop (y 240–1680),
// deep space, Kanha with his mouth wide open and the universe in it, mud on his face, Radha starry-eyed.
SHOTS.length = 0;
SHOTS.push({ a: 0, b: 1, draw(c) {
  celSpace(c, 3);
  celGalaxy(c, 900, 170, 200, -.35); celGalaxy(c, 200, 1560, 160, .5, .8);
  celSun(c, 150, 760, 58, 2); celMoon(c, 950, 760, 44);
  celPlanet(c, 960, 1420, 44, { col: '#C9A6FF', sh: '#9C74E4', lt: '#E8D8FF', ring: '#FFD36A', face: 'happy', rot: -.25 });
  celPlanet(c, 100, 1460, 34, { col: '#FF8A6E', sh: '#E0583E', lt: '#FFC0A8', band: 'rgba(200,70,50,.35)', face: 'open' });
  const E = celEarth(c, 560, 760, 70, 2);
  CEL.inkK = 2.2; celRadha(c, E[0], E[1] + 6, .23, { ...R0, td: 0, eyes: 'happy', mouth: 'open', lid: 0, brow: .2, browR: .2, look: [0, 0], blush: .5, hR: [190, -232], eR: [1, .6], handR: 'open', land: 9 }, { seed: 777 }); CEL.inkK = 1;
  celClod(c, 450, 900, 40, -.3);
  const K = celKeys(6, KANHA), R = celKeys(6.5, RADHA);
  K.td = R.td = 0; K.land = R.land = 9; K.talk = R.talk = 0; R.mouth = 'open'; K.hop = 30; R.hop = 24;
  const S = 1.2, AK = celKanha(c, 300, 1630, S, K); celRadha(c, 790, 1630, S, R);
  glow(c, AK.mouth[0], AK.mouth[1] + 16, 120, '#B48CFF', .55);
  for (const [x, y, r, rot] of [[180, 1000, 26, .2], [930, 1050, 22, -.3], [880, 900, 16, .4], [640, 560, 18, .1]]) celSparkle(c, x, y, r, { rot });
  const title = (txt, x, y, col, size, halo = true) => { c.save(); c.font = `700 ${size}px Kalam`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round'; c.strokeStyle = '#FFF8EE'; c.lineWidth = 22; if (halo) c.strokeText(txt, x, y); c.fillStyle = col; c.fillText(txt, x, y); c.restore(); };
  title('Kanha', 268, 360, INK.k, 124); title('vs', 540, 372, '#3A2E4A', 80); title('Radha', 806, 360, INK.r, 124);
  c.save(); c.fillStyle = '#FFF8EE'; c.beginPath(); c.roundRect(170, 456, 740, 84, 42); c.fill(); c.restore();
  title('#2  The universe in his mouth', 540, 500, '#3A2E4A', 50, false);
} });
