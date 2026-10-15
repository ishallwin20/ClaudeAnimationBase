// angad_props.js: set pieces for ad 20 (src/scenes/angad.js), Angad in Ravana's court. Screen pixels at the camera's rest.
//   courtFloor(c, y, t)            Lanka's floor: polished black stone with gold inlay lines running to a vanishing point
//   court(c, cam, t, o)            the whole fire-lit hall behind a shot: sky, fire glow, pillars, the floor (o.fx, o.top, o.floor)
//   grabHand(c, S, T, k, t, o)     a rakshasa's (or Ravana's) arm reaching from S to grip at T: forearm, bracelet, gripping fist
//   warrior(c, x, y, k, t, o)      a rakshasa warrior silhouette in side view, pulling to screen left (o.pull 0..1 lean,
//                                  o.fall 0..1 toppling back, o.crown: Meghnad's crown, o.flip)
//   sahasrabahu(c, x, y, k, t)     the thousand-armed king, a silhouette with arms fanned, a chain to a bound Ravana
//   crownMeteor(c, x, y, k, t, a)  one of Ravana's crowns blazing through the sky, with a trail behind (a = heading)
//   sea(c, y, t, glint)            a night sea from y down, with a glitter path under the city lights
//   camp(c, y, t)                  the vanara army on Suvela: a ridge of small silhouettes with tails and spears
//   memory(c, t, a)                the sepia wash and vignette of a remembered story (Angad's roast)

function courtFloor(c, y, t) {
  const g = c.createLinearGradient(0, y, 0, H + 200); g.addColorStop(0, '#2A120A'); g.addColorStop(.25, '#120806'); g.addColorStop(1, '#060303');
  c.fillStyle = g; c.fillRect(-400, y, W + 800, H + 600 - y);
  c.save(); c.globalCompositeOperation = 'lighter';
  for (let i = -8; i <= 8; i++) strokePath(c, `M ${540 + i * 40} ${y} L ${540 + i * 420} ${y + 1400}`, rgba('#C8912E', .08), 2.5);
  for (let j = 1; j < 9; j++) { const yy = y + Math.pow(j / 8, 1.8) * 1100; strokePath(c, `M -400 ${yy} L ${W + 400} ${yy}`, rgba('#C8912E', .05 + j * .006), 2); }
  c.restore();
  glow(c, 540, y + 60, 700, '#FF7A26', .12, 'lighter');
}
function court(c, cam, t, o = {}) {
  const fx = o.fx ?? 540, top = o.top ?? 420, floor = o.floor ?? 1500;
  plane(c, cam, 0, (c) => { hallSky(c); glow(c, fx, floor - 200, 800, '#FF7A26', .4); });
  plane(c, cam, .5, (c) => { pillars(c, top, floor, fx, '#120806', t, o.n || 7, 50); });
  plane(c, cam, .8, (c) => courtFloor(c, floor, t));
}

// an arm reaching in from S (off screen) to grip at T; k scale; o.col skin, o.band bracelet, o.shake
function grabHand(c, S0, T, k, t, o = {}) {
  const col = o.col || '#463A40', band = o.band || '#5A5A66', sh = (o.shake || 0) * Math.sin(t * 47 + (o.seed || 0)) * 3;
  const E = [lerp(S0[0], T[0], .55) + (o.bend || 0) * k, lerp(S0[1], T[1], .55) - 40 * k], Tt = [T[0] + sh, T[1] + sh * .5];
  limb(c, [S0, E, Tt], [84 * k, 70 * k, 54 * k], col);
  const a = Math.atan2(Tt[1] - E[1], Tt[0] - E[0]), dk = mixCol(col, '#000000', .35);
  ellipse(c, lerp(E[0], Tt[0], .72), lerp(E[1], Tt[1], .72), 34 * k, 12 * k, band, a + Math.PI / 2);
  // the hand gripping: the back of the hand, four fingers curled round toward us, the thumb under
  c.save(); c.translate(Tt[0], Tt[1]); c.rotate(a);
  ellipse(c, 22 * k, 0, 38 * k, 32 * k, col);
  for (let i = 0; i < 4; i++) {
    const y = (-22 + i * 14.5) * k, P = [[44 * k, y], [66 * k, y + 3 * k], [62 * k, y + 15 * k]];
    limb(c, P.map(([x, yy]) => [x + 1.5 * k, yy + 1.5 * k]), [15 * k, 14 * k, 12 * k], dk); limb(c, P, [13 * k, 12 * k, 10 * k], col);
  }
  limb(c, [[10 * k, 22 * k], [32 * k, 36 * k], [50 * k, 30 * k]], [16 * k, 13 * k, 10 * k], mixCol(col, '#000000', .12));
  strokePath(c, `M ${2 * k} ${-24 * k} C ${16 * k} ${-30 * k} ${30 * k} ${-30 * k} ${40 * k} ${-24 * k}`, rgba(dk, .6), 2 * k);
  c.restore();
}

// a rakshasa warrior in side view, facing screen right, leaning back to pull what his hands grip at (o.hx, o.hy) (his
// local units, feet at (0, 0), about 1000 tall); o.pull 0..1 the lean, o.fall 0..1 toppling back, o.sit (0..1 sitting
// back down, head hung), o.crown (Meghnad's), o.flip
function warrior(c, x, y, k, t, o = {}) {
  const col = o.col || '#0E0608', pull = o.pull ?? 1, fall = o.fall || 0, sit = o.sit || 0, j = Math.sin(t * 31 + (o.seed || 0)) * 3 * pull * (1 - fall) * (1 - sit);
  c.save(); c.translate(x, y); if (o.flip) c.scale(-1, 1); c.scale(k, k);
  c.rotate(-fall * 1.2);
  const lean = lerp(-.36 * pull, .5, sit), hip = [0, lerp(-430, -200, sit)];
  if (sit) { limb(c, [hip, [140, -210], [180, -20]], [86, 70, 50], col); fillPath(c, 'M 150 -30 L 230 -26 L 236 0 L 146 0 Z', col); fillPath(c, 'M -90 -200 L 100 -200 L 110 -150 L -100 -150 Z', col); }
  else {
    limb(c, [hip, [-60, -230], [-30, -20]], [86, 70, 50], col); fillPath(c, 'M -70 -30 L 20 -30 L 40 0 L -80 0 Z', col);   // the back leg, braced
    limb(c, [hip, [70, -250], [130, -30]], [86, 70, 50], col); fillPath(c, 'M 100 -30 L 180 -26 L 186 0 L 96 0 Z', col);   // the front leg, dug in
  }
  const R = (x, y) => [hip[0] + x * Math.cos(lean) - y * Math.sin(lean), hip[1] + x * Math.sin(lean) + y * Math.cos(lean)];
  c.save(); c.translate(hip[0], hip[1]); c.rotate(lean);
  fillPath(c, 'M -70 0 C -84 -100 -90 -200 -70 -300 C -30 -320 40 -320 70 -300 C 86 -200 80 -100 60 0 Z', col);   // the torso, armoured
  fillPath(c, 'M -90 -300 L -50 -340 L 60 -340 L 100 -300 L 70 -270 L -60 -270 Z', col);   // the pauldrons
  ellipse(c, 20, -390, 46, 54, col); fillPath(c, 'M 56 -400 L 84 -380 L 58 -366 Z', col);   // the head and nose
  fillPath(c, 'M 30 -360 L 40 -330 L 50 -360 Z', col);   // a tusk
  if (o.crown) fillPath(c, 'M -26 -430 L -20 -480 L -4 -460 L 12 -506 L 28 -460 L 44 -480 L 52 -430 Z', col);   // Meghnad's crown
  else { fillPath(c, 'M -30 -420 C -30 -460 70 -460 70 -420 Z', col); fillPath(c, 'M -20 -440 C -60 -470 -70 -500 -60 -530 C -40 -500 -20 -480 0 -456 Z', col); }   // a horned helmet
  c.restore();
  // the arms, from the shoulders out to the grip (or hanging, sitting)
  const H1 = sit ? R(60, -60) : [(o.hx ?? 300) + j, (o.hy ?? -200) + j * .5], H2 = sit ? R(20, -50) : [(o.hx ?? 300) - 14 + j, (o.hy ?? -200) + 26 + j * .5];
  for (const [S0, Hh] of [[R(40, -290), H1], [R(10, -270), H2]]) {
    const E = [lerp(S0[0], Hh[0], .5), lerp(S0[1], Hh[1], .5) + (sit ? 0 : 30)];
    limb(c, [S0, E, Hh], [52, 42, 34], col); ellipse(c, Hh[0] + 8, Hh[1], 26, 24, col);
  }
  c.restore();
}

// the thousand-armed king (Sahasrabahu Arjuna), a silhouette: arms fanned in rings behind him, one hand holding a chain
// that runs down to a small Ravana kneeling bound (his ten heads in a row). (x, y) his feet, k scale.
function sahasrabahu(c, x, y, k, t, col = '#140A06') {
  c.save(); c.translate(x, y); c.scale(k, k);
  for (let r = 0; r < 2; r++) for (let i = 0; i < 11; i++) {
    const a = Math.PI * (.02 + .96 * i / 10) + r * .045, R = 330 + r * 110, sw = Math.sin(t * 2 + i + r) * .03;
    const S0 = [Math.cos(a) * -90, -690], E = [S0[0] - Math.cos(a + sw) * R * .5, -690 - Math.sin(a + sw) * R * .5 + 30], T = [-Math.cos(a + sw) * R, -690 - Math.sin(a + sw) * R];
    limb(c, [S0, E, T], [46, 38, 28], col);
    c.save(); c.translate(T[0], T[1]); c.rotate(Math.atan2(T[1] + 690, T[0]) + Math.PI / 2);
    ellipse(c, 0, -14, 20, 24, col); for (let f = -1.5; f <= 1.5; f++) limb(c, [[f * 8, -24], [f * 11, -46]], [8, 6], col);
    c.restore();
  }
  limb(c, [[-50, -470], [-60, -240], [-70, 0]], [80, 64, 44], col); limb(c, [[50, -470], [60, -240], [70, 0]], [80, 64, 44], col);
  fillPath(c, 'M -100 -480 C -110 -580 -150 -680 -160 -720 C -100 -746 100 -746 160 -720 C 150 -680 110 -580 100 -480 Z', col);
  fillPath(c, 'M -110 -500 L 110 -500 L 140 -300 L -140 -300 Z', col);
  ellipse(c, 0, -800, 52, 62, col); fillPath(c, 'M -50 -850 L -40 -940 L -16 -900 L 0 -960 L 16 -900 L 40 -940 L 50 -850 Z', col);
  limb(c, [[140, -700], [220, -560], [260, -430]], [44, 36, 30], col); ellipse(c, 266, -414, 24, 26, col);
  // the chain, down to the bound Ravana
  for (let i = 0; i < 14; i++) { const u = i / 13, cx = lerp(270, 600, u), cy = lerp(-400, -200, u) + Math.sin(u * Math.PI) * 60; c.strokeStyle = col; c.lineWidth = 7; c.beginPath(); c.ellipse(cx, cy, 13, 8, i % 2 ? .4 : -.4, 0, TAU); c.stroke(); }
  c.save(); c.translate(600, 0); c.scale(.6, .6);
  fillPath(c, 'M -170 0 C -180 -60 -150 -120 -110 -150 L -120 -300 C -130 -380 -150 -440 -170 -480 C -100 -510 100 -510 170 -480 C 150 -440 130 -380 120 -300 L 110 -150 C 150 -120 180 -60 170 0 Z', col);   // kneeling, bound
  for (let i = 0; i < 10; i++) { const p = rvHeadPos(i); ellipse(c, p.x * .9, -560 + p.y, 40 * p.s, 48 * p.s, col); fillPath(c, `M ${p.x * .9 - 30 * p.s} ${-600 + p.y} L ${p.x * .9} ${-660 + p.y} L ${p.x * .9 + 30 * p.s} ${-600 + p.y} Z`, col); }
  for (let i = 0; i < 4; i++) { c.strokeStyle = col; c.lineWidth = 9; c.beginPath(); c.ellipse(0, -300 + i * 50, 160, 30, 0, 0, TAU); c.stroke(); }
  c.restore();
  c.restore();
}

// one of Ravana's crowns as a blazing meteor heading at angle a (radians), with a fire trail behind
function crownMeteor(c, x, y, k, t, a) {
  c.save(); c.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 18; i++) { const u = i / 18, d = 30 + u * 520 * k; glow(c, x - Math.cos(a) * d, y - Math.sin(a) * d, (70 - u * 50) * k, i % 3 ? '#FF8A2A' : '#FFD060', .5 * (1 - u)); }
  c.restore();
  glow(c, x, y, 140 * k, '#FFD890', .7); glow(c, x, y, 50 * k, '#FFFFFF', .6);
  c.save(); c.translate(x, y); c.rotate(a + Math.PI / 2 + Math.sin(t * 9) * .2); c.scale(k * 1.1, k * 1.1); rvCrown(c, { kind: 'crown' }); c.restore();
}

function sea(c, y, t, glint = 1) {
  const g = c.createLinearGradient(0, y, 0, H); g.addColorStop(0, '#1A1530'); g.addColorStop(.4, '#0C0A1A'); g.addColorStop(1, '#05040C'); c.fillStyle = g; c.fillRect(-300, y, W + 600, H - y + 400);
  c.save(); c.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 60; i++) { const yy = y + 10 + Math.pow(i / 60, 1.6) * (H - y), w = 20 + i * 3, x = 760 + Math.sin(i * 2.3 + t * 1.2) * (20 + i * 2); c.fillStyle = rgba('#FFB050', .25 * glint * (1 - i / 70) * (.5 + .5 * Math.sin(t * 3 + i))); c.fillRect(x - w / 2, yy, w, 2 + i * .05); }
  c.restore();
}
function camp(c, y, t, col = '#08060E') {
  fillPath(c, `M -200 ${y + 80} C 100 ${y - 40} 400 ${y - 60} 700 ${y + 10} C 900 ${y + 60} 1100 ${y + 60} 1300 ${y + 90} L 1300 ${H + 300} L -200 ${H + 300} Z`, col);
  for (let i = 0; i < 18; i++) {
    const x = -40 + i * 46 + hash(i) * 20, yy = y - 30 + Math.abs(x - 300) * .06 + hash(i * 3) * 10, s = .5 + hash(i * 7) * .25;
    c.save(); c.translate(x, yy); c.scale(s, s);
    ellipse(c, 0, -60, 24, 40, col); ellipse(c, 0, -112, 18, 18, col); ellipse(c, 10, -108, 10, 8, col);
    limb(c, [[-14, -40], [-50, -60 + Math.sin(t * 2 + i) * 6], [-44, -110 + Math.sin(t * 2 + i) * 6]], [8, 6, 4], col);   // the tail
    if (i % 3 === 0) strokePath(c, 'M 20 -20 L 30 -200', col, 4);   // a spear
    c.restore();
  }
}
function memory(c, t, a) {
  if (a <= 0) return;
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
  c.globalCompositeOperation = 'color'; c.fillStyle = rgba('#B07830', .55 * a); c.fillRect(0, 0, W, H);
  c.globalCompositeOperation = 'source-over';
  const g = c.createRadialGradient(540, 960, 300, 540, 960, 1100); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, rgba('#0A0402', .85 * a)); c.fillStyle = g; c.fillRect(0, 0, W, H);
  c.restore();
}
