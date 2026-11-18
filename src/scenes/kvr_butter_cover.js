// kvr_butter_cover.js: the cover of "Kanha vs Radha" #1 (cover.html): the title inside the grid's 3:4 crop (y 240–1680),
// Kanha bragging with butter all over his face, Radha pointing at it.
SHOTS.length = 0;
SHOTS.push({ a: 0, b: 1, draw(c) {
  c.fillStyle = '#FFF8EE'; c.fillRect(0, 0, W, H);
  let g = c.createRadialGradient(540, 1150, 0, 540, 1150, 760); g.addColorStop(0, 'rgba(255,206,218,.55)'); g.addColorStop(1, 'rgba(255,206,218,0)'); c.fillStyle = g; c.fillRect(0, 0, W, H);
  const K = celKeys(.5, KANHA), R = celKeys(4.9, RADHA);
  K.td = R.td = 0; K.land = R.land = 9; K.talk = R.talk = 0; R.mouth = 'flat';
  shadow(c, 300, 1624, 190); shadow(c, 780, 1624, 180);
  const S = 1.22;
  celKanha(c, 300, 1620, S, K); celRadha(c, 790, 1620, S, R);
  for (const [x, y, r, rot] of [[150, 760, 30, .2], [930, 800, 24, -.3], [860, 640, 18, .4]]) celSparkle(c, x, y, r, { rot });
  celHeart(c, 210, 640, 26, { rot: -.25 });
  const title = (txt, x, y, col, size, halo = true) => { c.save(); c.font = `700 ${size}px Kalam`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round'; c.strokeStyle = '#FFF8EE'; c.lineWidth = 22; if (halo) c.strokeText(txt, x, y); c.fillStyle = col; c.fillText(txt, x, y); c.restore(); };
  title('Kanha', 268, 360, INK.k, 124); title('vs', 540, 372, '#3A2E4A', 80); title('Radha', 806, 360, INK.r, 124);
  c.save(); c.fillStyle = '#3A2E4A'; c.beginPath(); c.roundRect(290, 456, 500, 84, 42); c.fill(); c.restore();
  title('#1  The butter thief', 540, 500, '#FFF8EE', 52, false);
} });
