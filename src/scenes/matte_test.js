// matte_test.js: the Matte style's first test. Maa Kushmanda on her lion walks right through a misty forest of bare
// trunks; the camera tracks her, the trunks slide past at three depths, and the grey mist warms into golden god-rays.

// The camera's pan: the plate sits at depth .5, so its floor slides at SPEED / 2 = 75 px/s, the speed her planted paws
// push back at (a 255 px leg × 2A over the stance of .6 STEP, at scale .6): the paws don't skate.
const SPEED = 150, STEP = 1.15;   // camera px/s at the stage plane; seconds per stride
const GOLD = t => ease(seg(t, 2.6, 6));

SHOTS.push({ a: 0, b: 8, draw(c, u, t) {
  const camX = SPEED * t, g = GOLD(t), PH = 1700;   // the plate's drawn height: its floor lands at y ~1410
  // the far forest: the grey plate, the gold one fading in over it
  c.fillStyle = mixCol('#1A171D', '#1C130C', g); c.fillRect(0, 0, W, H);
  platePan(c, PICS.plateGrey, camX, .5, { h: PH, x0: -300 });
  c.globalAlpha = g; platePan(c, PICS.plateGold, camX, .5, { h: PH, x0: -300 }); c.globalAlpha = 1;
  // the floor below the plate runs on into near-black
  const fl = c.createLinearGradient(0, PH - 120, 0, H); fl.addColorStop(0, 'rgba(0,0,0,0)'); fl.addColorStop(.35, mixCol('#16131A', '#1A120B', g)); fl.addColorStop(1, '#0B0A0C');
  c.fillStyle = fl; c.fillRect(0, PH - 120, W, H - PH + 120);
  // drifting mist behind her
  soft(c, 6, (s) => { for (let i = 0; i < 7; i++) { const x = ((hash(i) * 1600 - camX * .6 - t * 25 * (1 + hash(i + 3))) % 1700 + 1700) % 1700 - 300, y = 1050 + hash(i + 9) * 380; ellipse(s, x, y, 380 + hash(i + 4) * 260, 90 + hash(i + 5) * 60, rgba(mixCol('#C9C6D4', '#F2C98A', g), .22)); } }, { blur: 6 });
  // Kushmanda: walking on the spot while the world slides by, sat in the haze by a tint and a warm rim once the sun is up
  const ph = t / STEP, pose = quadWalk(ph, { legs: KUSH_LEGS, A: .17, lift: 30, bob: 6, tail: 'tail' }); pose.debug = window.DEBUG_RIG;
  const rig = cutRig(KUSH);
  figure(c, (l) => { l.filter = 'blur(.8px)'; drawRig(l, rig, 520, 1452, .6, pose); l.filter = 'none'; }, {
    tint: [mixCol('#9C9AAD', '#C9935A', g), lerp(.36, .2, g)],
    grade: [[700, 'rgba(0,0,0,0)'], [1460, rgba(mixCol('#2A2733', '#3A2410', g), .35)]],
    rim: { col: '#FFE2A6', dx: 4, dy: -3, a: .85 * g, blur: 1 },
  });
  // ground mist over her paws, and the near floor, dark and out of focus, running past
  haze(c, 1440, 120, mixCol('#BDB9C8', '#E8B878', g), .28);
  soft(c, 4, (s) => { s.fillStyle = '#0D0B0E'; const gr = s.createLinearGradient(0, 1480, 0, 1640); gr.addColorStop(0, 'rgba(13,11,14,0)'); gr.addColorStop(1, '#0D0B0E'); s.fillStyle = gr; s.fillRect(0, 1480, W, 160); s.fillStyle = '#0D0B0E'; s.fillRect(0, 1640, W, 300); for (let i = 0; i < 14; i++) { const x = ((hash(i + 40) * 2400 - camX * 2) % 2400 + 2400) % 2400 - 400; ellipse(s, x, 1570 + hash(i) * 40, 160 + hash(i + 2) * 200, 30, '#0D0B0E'); } }, { blur: 5 });
  // god rays once the sun breaks through, from the upper right
  rays(c, 1300, -200, { n: 9, dir: 2.3, spread: .5, len: 2600, w: 260, col: '#FFD58A', a: .22 * g, t, seed: 3 });
  // the near trunks, ahead of the camera, soft and dark
  // the near trunks, ahead of the camera, soft, dark and lit like the forest; frame 0 keeps them off her
  figure(c, (l) => { l.filter = 'blur(3px)'; platePan(l, PICS.trunks, camX, 1.6, { h: 2050, y: -60, x0: 900, gap: 2600 }); l.filter = 'none'; }, {
    tint: [mixCol('#26232C', '#24160C', g), .55], rim: { col: '#FFD58A', dx: 5, dy: 0, a: .7 * g, blur: 2 },
  });
}});
say(.8, 4.4, 'The fourth form | of the Devi', { y: 520 });
say(4.6, 7.8, 'Maa *Kushmanda*', { y: 520, size: 72 });
