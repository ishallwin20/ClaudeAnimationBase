// bhima_cast.js: the designs for "Bhima couldn't lift an old monkey's tail" (Painterly; see PAINTERLY_GUIDE.md). Each
// function draws a DESIGN (clean shapes with gradients) that ptLayer() bakes into a painting.
//   The stage: one banana grove on the Gandhamadana, drawn in the 1080×1920 frame px of the wide shot. The path comes
//   down from the back to the foreground; a flat rock at the right holds Hanuman, lying along it, his head at BH_HH;
//   his tail runs down the rock and across the path in the foreground (BH_TAIL), its tip curling up at the left.
//   Bhima stands on the path behind the tail (feet at BH_BX, BH_BY), 3/4 view facing right.
//   Characters are drawn in their own space (Bhima: feet at 0,0, about 600 tall; heads: centred on 0,0), baked with
//   o.k as high as the closest camera needs, and placed with a transform.
const BH_SUN = [170, 260];                 // the light: low, upper left (rim light comes from there)
const BH_HH = [700, 1160];                 // Hanuman's head centre on the stage
const BH_BX = 260, BH_BY = 1490;           // Bhima's feet on the stage
const BH_SKIN = { base: '#D88A4E', dk: '#8C4E26', lt: '#F6C688' };          // Bhima: "of splendour like unto the hue of gold"
const HN_SKIN = { base: '#D4572B', dk: '#8F3016', lt: '#F28A4C', muz: '#F5B07A' };
const HN_MANE = ['#B8361A', '#D44A22', '#E8682C', '#9E2A14'];                 // "a heap of asoka flowers"
const GOLD = { base: '#E5AE34', dk: '#94631A', lt: '#FFE38C' };

// a smooth closed shape through points (Catmull-Rom), filled
function blob(c, P, col) {
  const n = P.length, C = [];
  for (let i = 0; i < n; i++) {
    const p0 = P[(i - 1 + n) % n], p1 = P[i], p2 = P[(i + 1) % n], p3 = P[(i + 2) % n];
    for (let k = 0; k < 8; k++) { const u = k / 8, u2 = u * u, u3 = u2 * u; C.push([0, 1].map(d => .5 * (2 * p1[d] + (p2[d] - p0[d]) * u + (2 * p0[d] - 5 * p1[d] + 4 * p2[d] - p3[d]) * u2 + (3 * p1[d] - p0[d] - 3 * p2[d] + p3[d]) * u3))); }
  }
  c.fillStyle = col; c.beginPath(); C.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); c.fill();
  return C;
}
const blobPath = P => { const p = new Path2D(), n = P.length; for (let i = 0; i < n; i++) { const p0 = P[(i - 1 + n) % n], p1 = P[i], p2 = P[(i + 1) % n], p3 = P[(i + 2) % n]; for (let k = 0; k < 8; k++) { const u = k / 8, u2 = u * u, u3 = u2 * u; const q = [0, 1].map(d => .5 * (2 * p1[d] + (p2[d] - p0[d]) * u + (2 * p0[d] - 5 * p1[d] + 4 * p2[d] - p3[d]) * u2 + (3 * p1[d] - p0[d] - 3 * p2[d] + p3[d]) * u3)); i || k ? p.lineTo(q[0], q[1]) : p.moveTo(q[0], q[1]); } } p.closePath(); return p; };
function line(c, P, col, w) { const C = through(P); c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); C.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke(); }
// grade a whole figure: warm light from the upper left, a little green bounce from below
function bhGrade(c, x0, y0, x1, y1, o = {}) {
  c.save(); c.globalCompositeOperation = 'source-atop';
  c.fillStyle = ptLin(c, x0, y0, x1 * .3 + x0 * .7, y1, [[0, `rgba(255,236,170,${o.top ?? .16})`], [.55, 'rgba(255,236,170,0)'], [.85, 'rgba(60,90,30,0)'], [1, `rgba(50,80,20,${o.bot ?? .16})`]]);
  c.fillRect(x0, y0, x1 - x0, y1 - y0); c.restore();
}

// ---------- a banana plant ----------
// leaf from (x, y) heading ang (radians, canvas), len long, wd wide, bending down by droop (radians over its length)
function bhLeaf(c, x, y, ang, len, wd, droop, cols, R, torn = .5) {
  const n = 14, mid = [[x, y]]; let a = ang, px = x, py = y;
  for (let i = 1; i <= n; i++) { a += droop / n * (Math.cos(ang) >= 0 ? 1 : -1); px += Math.cos(a) * len / n; py += Math.sin(a) * len / n; mid.push([px, py]); }
  const L = [], Rr = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n, w = wd * Math.pow(Math.sin(Math.PI * Math.min(1, u * 1.08)), .55) * (u < .06 ? u / .06 : 1);
    const p = mid[i], q = mid[Math.min(n, i + 1)], o = mid[Math.max(0, i - 1)], dx = q[0] - o[0], dy = q[1] - o[1], d = Math.hypot(dx, dy) || 1;
    L.push([p[0] - dy / d * w, p[1] + dx / d * w]); Rr.push([p[0] + dy / d * w * .9, p[1] - dx / d * w * .9]);
  }
  const g = ptLin(c, x, y, mid[n][0], mid[n][1], [[0, cols[1]], [.5, cols[0]], [1, cols[1]]]);
  c.fillStyle = g; c.beginPath(); [...L, ...Rr.reverse()].forEach(([X, Y], i) => i ? c.lineTo(X, Y) : c.moveTo(X, Y)); c.closePath(); c.fill();
  // the lit half (one side of the midrib)
  c.save(); c.globalAlpha = .55; c.fillStyle = cols[2]; c.beginPath(); [...mid, ...Rr].forEach(([X, Y], i) => i ? c.lineTo(X, Y) : c.moveTo(X, Y)); c.closePath(); c.fill(); c.restore();
  // veins slanting out from the midrib, and the midrib itself
  c.lineCap = 'round';
  for (let i = 2; i < n; i += 1) { if (R() < .3) continue; const p = mid[i], s = R() < .5 ? L[i] : Rr[n - i]; c.strokeStyle = rgba(cols[R() < .5 ? 1 : 2], .35); c.lineWidth = 1.5; c.beginPath(); c.moveTo(p[0], p[1]); c.lineTo(lerp(p[0], s[0], .95), lerp(p[1], s[1], .95) + 3); c.stroke(); }
  line(c, mid, cols[3] || cols[2], Math.max(1.5, wd * .08));
  // torn slits: thin gaps the colour of the dark leaf behind
  if (torn) for (let k = 0; k < 4; k++) { if (R() > torn) continue; const i = 3 + (R() * (n - 5) | 0), p = mid[i], s = R() < .5 ? L[i] : Rr[n - i]; c.strokeStyle = cols[4] || rgba('#1E3416', .7); c.lineWidth = 2; c.beginPath(); c.moveTo(lerp(p[0], s[0], .25), lerp(p[1], s[1], .25)); c.lineTo(s[0], s[1] + 6); c.stroke(); }
  return mid;
}
// a whole plant: the pseudo-stem from (x, y) up h, leaves fanning from the top. depth 0 (near, dark) … 1 (far, pale)
function bhBanana(c, x, y, h, R, o = {}) {
  const d = o.depth ?? .5, lean = o.lean ?? (R() - .5) * h * .12;
  const mix = (near, far) => mixCol(near, far, d);
  const top = [x + lean, y - h];
  const stemC = ptLin(c, x - h * .05, 0, x + h * .05, 0, [[0, mix('#3E5A22', '#B9C98C')], [.6, mix('#7E9A3C', '#D7E2A6')], [1, mix('#4A6626', '#BFCD92')]]);
  limb(c, [[x, y], [x + lean * .4, y - h * .5], top], [h * .1, h * .08, h * .06], stemC, false);
  c.save(); c.globalAlpha = .5; for (let k = 0; k < 5; k++) { const ox = (R() - .5) * h * .07; line(c, [[x + ox, y - R() * h * .1], [x + ox + lean * .4, y - h * .5], [top[0] + ox * .8, top[1] + h * .1]], R() < .5 ? mix('#5A3A1C', '#C9B98A') : mix('#9BB050', '#E2EAB6'), 2 + R() * 3); } c.restore();
  const cols = o.cols || [mix('#4E7A2A', '#C9DA9A'), mix('#2A4A1A', '#AFC487'), mix('#9CC050', '#E8F0BA'), mix('#C8DE80', '#F0F6CC'), mix('#14240E', '#9FB47A')];
  const n = o.leaves ?? 7;
  for (let i = 0; i < n; i++) {
    const side = i % 2 ? 1 : -1, k = i / (n - 1), up = k < .3;
    const ang = up ? -Math.PI / 2 + side * (.15 + R() * .3) : (side > 0 ? -.55 + R() * .5 : -Math.PI + .55 - R() * .5);
    const L = h * (o.leafLen ?? (.62 + R() * .25)), cl = R() < .25 && d < .8 ? [mixCol(cols[0], '#C9A848', .55), cols[1], mixCol(cols[2], '#F2D774', .5), cols[3], cols[4]] : cols;
    bhLeaf(c, top[0] + (R() - .5) * 8, top[1] + R() * 18, ang, L, L * .2, up ? .9 + R() * .6 : 1.3 + R() * .8, cl, R, d < .7 ? .6 : .2);
  }
  if (o.bunch) {   // a hanging bunch with its purple bud
    const bx = top[0] + 14, by = top[1] + 30;
    line(c, [[bx, by], [bx + 26, by + 60], [bx + 30, by + 150]], mix('#5E7A2A', '#C9D49A'), 7);
    for (let r = 0; r < 4; r++) for (let j = 0; j < 4; j++) ellipse(c, bx + 10 + j * 12 - r * 2, by + 56 + r * 22, 6, 16, mixCol('#8FAE3A', '#C9D45A', j / 4), -.5 + j * .3);
    blob(c, [[bx + 30, by + 140], [bx + 44, by + 170], [bx + 30, by + 215], [bx + 16, by + 170]], '#6A2A4A');
    ellipse(c, bx + 34, by + 165, 5, 16, 'rgba(200,120,170,.5)');
  }
  return top;
}

// ---------- the grove (the stage) ----------
// o.rock (true): the flat rock at the right with his shadow on it; o.top: extend upward (unused in the reel)
function bhGrove(c, o = {}) {
  const R = lcg(o.seed || 31), rock = o.rock !== false;
  // backlit depth: warm cream at the light, through yellow-green, to deep green
  let g = c.createRadialGradient(BH_SUN[0], BH_SUN[1], 20, BH_SUN[0] + 200, BH_SUN[1] + 500, 1500);
  [[0, '#FFF7D6'], [.12, '#F6EDB0'], [.28, '#D7DE8E'], [.48, '#99B65E'], [.72, '#56783A'], [1, '#253F1C']].forEach(([k, col]) => g.addColorStop(k, col));
  c.fillStyle = g; c.fillRect(0, 0, PT_W, PT_H);
  // far slopes of the mountain through the gap, blue in the haze
  ridge(c, 990, 160, 4, '#B9CDB0', { freq: .006, x0: 0, x1: PT_W, bottom: 1200 });
  ridge(c, 1040, 110, 9, '#A4BE98', { freq: .008, x0: 0, x1: PT_W, bottom: 1200 });
  haze(c, 1030, 220, '#F4F2D0', .45);
  // far banana plants, pale
  for (let i = 0; i < 26; i++) { const x = R() * PT_W, y = 1040 + R() * 60; bhBanana(c, x, y, 200 + R() * 160, R, { depth: .88 + R() * .1, leaves: 6 }); }
  haze(c, 1000, 320, '#F7F3CF', .28);
  // middle plants either side of the path
  const mids = [[60, 1210, 560], [210, 1170, 470], [330, 1120, 380], [690, 1120, 400], [820, 1160, 500], [980, 1200, 600], [460, 1090, 300], [600, 1080, 290]];
  mids.forEach(([x, y, h], i) => bhBanana(c, x + (R() - .5) * 30, y, h, R, { depth: .45 + (1200 - y) / 300 * .3, leaves: 8, bunch: i === 4 }));
  // a veil of light from the sun
  g = c.createRadialGradient(BH_SUN[0] + 80, BH_SUN[1] + 260, 0, BH_SUN[0] + 80, BH_SUN[1] + 260, 900);
  g.addColorStop(0, 'rgba(255,248,210,.55)'); g.addColorStop(.45, 'rgba(250,240,180,.18)'); g.addColorStop(1, 'rgba(250,240,180,0)');
  c.fillStyle = g; c.fillRect(0, 0, PT_W, PT_H);
  // the ground
  g = c.createLinearGradient(0, 1120, 0, PT_H); g.addColorStop(0, '#8BA850'); g.addColorStop(.3, '#6C8E3A'); g.addColorStop(1, '#2C4420');
  c.fillStyle = g; c.beginPath(); c.moveTo(0, 1180); c.bezierCurveTo(300, 1120, 760, 1110, PT_W, 1170); c.lineTo(PT_W, PT_H); c.lineTo(0, PT_H); c.fill();
  // the path: from the back (narrow, pale) to the foreground (wide, warm ochre), a gentle S
  const path = 'M 500 1110 C 470 1180 380 1260 360 1360 C 340 1460 300 1600 170 1920 L 980 1920 C 800 1700 640 1560 620 1400 C 600 1280 580 1180 560 1110 Z';
  ptShape(c, path, ptLin(c, 0, 1110, 0, 1920, [[0, '#E9D9A0'], [.3, '#D6B878'], [.7, '#B88E52'], [1, '#7A5A32']]));
  inside(c, path, () => {
    for (let i = 0; i < 160; i++) { const x = 160 + R() * 820, y = 1120 + Math.pow(R(), .8) * 800, s = 4 + (y - 1100) / 800 * 22; ellipse(c, x, y, s * (1 + R()), s * .45, R() < .5 ? 'rgba(120,84,44,.35)' : 'rgba(250,232,180,.4)', (R() - .5) * .4); }
    for (let i = 0; i < 26; i++) { const x = 200 + R() * 700, y = 1300 + R() * 600; ellipse(c, x, y, 30 + R() * 60, 10 + R() * 14, 'rgba(255,244,200,.35)'); }   // sun spots
    for (let i = 0; i < 40; i++) { const x = 180 + R() * 780, y = 1350 + R() * 560, s = 3 + R() * 9; ellipse(c, x, y, s, s * .7, ['#8E7A62', '#A8957A', '#6E5C48'][R() * 3 | 0]); ellipse(c, x - s * .3, y - s * .3, s * .4, s * .3, 'rgba(255,240,210,.6)'); }   // pebbles
  });
  if (rock) {
    // the flat rock at the right
    const top = [[560, 1300], [640, 1262], [780, 1250], [940, 1252], [1080, 1262], [1100, 1300], [1080, 1330], [900, 1342], [700, 1338], [590, 1326]];
    blob(c, [[560, 1300], [600, 1390], [700, 1470], [900, 1500], [1100, 1490], [1100, 1300]], '#4E4A3E');
    ptShape(c, 'M 570 1310 C 600 1400 700 1460 900 1488 L 1100 1480 L 1100 1330 Z', ptLin(c, 0, 1300, 0, 1500, [[0, '#6E6858'], [1, '#383428']]));
    blob(c, top, ptLin(c, 560, 1250, 1100, 1340, [[0, '#D6CCAE'], [.4, '#ABA088'], [1, '#7A7262']]));
    ptMottle(c, 560, 1240, 1100, 1500, 120, ['#8C846E', '#5E5848', '#C8BE9E', '#6E7A48', '#7E8C50'], R, 6, 26, .35);
    for (let i = 0; i < 40; i++) { const x = 580 + R() * 500, y = 1380 + R() * 110; ellipse(c, x, y, 10 + R() * 26, 6 + R() * 10, ['#55703A', '#6E8C44', '#3E5A2C'][R() * 3 | 0]); }   // moss on the face
    // his shadow on the rock top
    g = c.createRadialGradient(840, 1300, 0, 840, 1300, 300); g.addColorStop(0, 'rgba(50,40,20,.5)'); g.addColorStop(1, 'rgba(50,40,20,0)');
    c.save(); c.translate(840, 1300); c.scale(1, .14); c.translate(-840, -1300); c.fillStyle = g; c.fillRect(500, 900, 700, 800); c.restore();
    // the tail's shadow along the ground
    c.save(); c.filter = 'blur(10px)'; line(c, BH_TAIL.slice(4, 10).map(([x, y]) => [x + 10, y + 26]), 'rgba(50,36,16,.35)', 50); c.filter = 'none'; c.restore();
  }
  // near plants at the edges, dark, big, framing the top corners
  bhBanana(c, -30, 1500, 1050, R, { depth: .08, leaves: 9, lean: 60, leafLen: .7 });
  bhBanana(c, 1110, 1450, 1150, R, { depth: .05, leaves: 9, lean: -70, leafLen: .7 });
  // grass and ferns along the path's edges, small flowers
  c.lineCap = 'round';
  for (let i = 0; i < 1500; i++) {
    const y = 1160 + Math.pow(R(), .7) * 760, x = R() * PT_W, onPath = c.isPointInPath(new Path2D(path), x, y);
    if (onPath && R() < .9) continue;
    const len = 6 + (y - 1160) / 760 * 50 * (.5 + R()), lean = (R() - .5) * .9, lit = clamp(1 - (y - 1160) / 900 + (R() - .5) * .4 - Math.abs(x - 400) / 1600);
    c.strokeStyle = mixCol('#2E4A1E', '#D8E48E', lit); c.lineWidth = 1.5 + (y - 1160) / 760 * 3.5;
    c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + lean * len * .5, y - len * .6, x + lean * len, y - len); c.stroke();
  }
  for (let i = 0; i < 120; i++) { const x = R() * PT_W, y = 1200 + R() * 700; if (c.isPointInPath(new Path2D(path), x, y)) continue; ellipse(c, x, y, 3 + R() * 4, 2.5 + R() * 3, R() < .6 ? ['#F2E9C0', '#FFFFFF', '#F7D25A'][R() * 3 | 0] : ['#C2508A', '#E07AA8'][R() * 2 | 0]); }
}

// ---------- Hanuman's tail on the stage (fixed: it never moves) and its tip (which curls, ph 0..1) ----------
const BH_TAIL = [[960, 1290], [985, 1340], [975, 1410], [930, 1470], [850, 1530], [740, 1578], [640, 1602], [560, 1606], [512, 1590], [490, 1545], [484, 1480], [488, 1410], [496, 1340]];
// the end of the tail rises from the ground "like a banner" in front of Bhima and curls over; it sways a little
function bhTailPts(ph) {
  const s = Math.sin(ph * TAU), s2 = Math.sin(ph * TAU - .8);
  return [...BH_TAIL, [508 + s * 4, 1280], [534 + s2 * 8, 1238 - s * 3], [574 + s2 * 12, 1226 - s2 * 4], [602 + s2 * 14, 1248 - s2 * 4], [598 + s2 * 12, 1282], [574 + s2 * 9, 1292]];
}
function bhTail(ph) {
  return (c) => {
    const P = bhTailPts(ph), Wd = P.map((_, i) => Math.max(20, 46 - i * 1.3));
    limb(c, P, Wd, HN_SKIN.dk);
    limb(c, P.map(([x, y]) => [x - 1, y - 4]), Wd.map(v => v * .78), ptLin(c, 0, 1280, 0, 1640, [[0, HN_SKIN.base], [1, '#C24A22']]));
    c.save(); c.globalAlpha = .6; limb(c, P.map(([x, y]) => [x - 2, y - 9]), Wd.map(v => v * .3), HN_SKIN.lt); c.restore();
    // fur: tufts along its edges and streaks along it, so it reads as a furry tail, not a pipe
    const C = through(P, 6), R = lcg(5);
    for (let i = 1; i < C.length - 1; i++) {
      const [x, y] = C[i], [x2, y2] = C[i + 1], a = Math.atan2(y2 - y, x2 - x), w = Wd[Math.min(Wd.length - 1, Math.floor(i / 6))] / 2;
      if (i % 3 === 0) for (const s of [-1, 1]) { const ox = -Math.sin(a) * w * s, oy = Math.cos(a) * w * s; limb(c, [[x + ox * .8, y + oy * .8], [x + ox * 1.06 + Math.cos(a) * 8, y + oy * 1.06 + Math.sin(a) * 8]], [5, 1.5], s < 0 ? rgba(HN_SKIN.lt, .45) : rgba('#7A2410', .4)); }
      if (i % 2) { c.strokeStyle = rgba(R() < .5 ? '#F7A070' : '#A8361A', .55); c.lineWidth = 2.2; c.beginPath(); c.moveTo(x + (R() - .5) * w, y + (R() - .5) * w); c.lineTo(x + Math.cos(a) * 14 + (R() - .5) * w, y + Math.sin(a) * 14 + (R() - .5) * w); c.stroke(); }
    }
    // the tuft at the tip
    const [tx, ty] = P[P.length - 1], [qx, qy] = P[P.length - 2];
    const a = Math.atan2(ty - qy, tx - qx);
    for (let k = 0; k < 9; k++) { const aa = a + (k - 4) * .24; limb(c, [[tx - Math.cos(a) * 10, ty - Math.sin(a) * 10], [tx + Math.cos(aa) * 40, ty + Math.sin(aa) * 40]], [24, 5], ['#9E2A14', '#7A1E0E', '#C2401C'][k % 3]); }
  };
}
const BH_TAIL_BOX = [420, 1180, 610, 470];

// ---------- Hanuman lying on the rock (body; the head is its own layer at BH_HH) ----------
// o.arm: 'chin' (the top hand under his cheek, the default), o.scratch: the free hand on his belly
function bhHanumanLie(c, o = {}) {
  const R = lcg(41), [hx, hy] = BH_HH, S = HN_SKIN;
  const skin = { dk: S.dk, base: S.base, lt: S.lt };
  // the bottom leg lying straight along the rock, the top leg bent with its knee up
  ptForm(c, [[880, 1262], [980, 1282], [1060, 1290]], [86, 70, 56], skin, -.2, -1);
  ellipse(c, 1080, 1286, 34, 22, S.dk); ellipse(c, 1078, 1282, 30, 18, S.base);
  // the red dhoti round the hips and thighs
  blob(c, [[820, 1180], [900, 1170], [985, 1190], [1030, 1230], [1040, 1280], [960, 1300], [860, 1296], [800, 1270], [790, 1220]], ptLin(c, 0, 1170, 0, 1300, [[0, '#E04A2A'], [.6, '#B42A1A'], [1, '#7A1810']]));
  ptForm(c, [[900, 1220], [990, 1150], [1050, 1215]], [92, 78, 62], { dk: '#7A1810', base: '#C8341E', lt: '#F06A40' }, -.3, -1);   // the top thigh under the cloth, knee up
  ptForm(c, [[1050, 1215], [1065, 1250], [1070, 1282]], [60, 54, 48], skin, -.4, -.8);   // the shin
  ellipse(c, 1072, 1292, 38, 18, S.dk); ellipse(c, 1066, 1288, 34, 15, S.base); ellipse(c, 1060, 1284, 20, 7, S.muz);   // the foot
  limb(c, [[1046, 1262], [1092, 1258]], [14, 14], GOLD.base); limb(c, [[1046, 1258], [1092, 1254]], [4, 4], GOLD.lt);   // anklet
  // gold border of the dhoti, folds
  line(c, [[812, 1268], [880, 1294], [960, 1298], [1030, 1278]], GOLD.base, 9);
  for (let i = 0; i < 7; i++) { const x = 830 + i * 30; line(c, [[x, 1196 + R() * 10], [x + 20, 1240], [x + 10 + R() * 20, 1286]], R() < .5 ? 'rgba(120,24,12,.6)' : 'rgba(255,140,100,.45)', 4 + R() * 4); }
  // the torso, lying on its side, chest toward us
  const torso = [[742, 1120], [790, 1100], [860, 1118], [900, 1160], [890, 1230], [840, 1262], [770, 1268], [720, 1240], [708, 1180]];
  blob(c, torso, ptRad(c, 780, 1150, 10, 170, [[0, S.lt], [.55, S.base], [1, S.dk]], 800, 1190));
  inside(c, blobPath(torso), () => {
    ellipse(c, 770, 1160, 52, 40, 'rgba(250,150,90,.5)', -.3);        // chest
    ellipse(c, 815, 1218, 64, 30, 'rgba(252,182,120,.55)', -.2);      // the belly, lighter
    ellipse(c, 830, 1262, 90, 18, 'rgba(110,30,12,.5)');              // underside in shade
  });
  // the bottom arm: elbow on the rock, forearm up, the fist under his cheek
  ptForm(c, [[742, 1170], [700, 1255], [672, 1262]], [66, 58, 52], skin, .1, -1);
  ptForm(c, [[672, 1262], [664, 1215], [668, 1190]], [52, 46, 40], skin, .4, -.8);
  ellipse(c, 670, 1206, 30, 26, S.dk); ellipse(c, 672, 1202, 27, 23, S.base);
  for (let k = 0; k < 3; k++) ellipse(c, 690 + k * 3, 1190 + k * 11, 11, 7, S.lt, .3);
  limb(c, [[650, 1236], [690, 1236]], [16, 16], GOLD.base);
  // the top arm resting along his side, the hand on his belly
  ptForm(c, [[790, 1110], [840, 1150], [870, 1200]], [62, 54, 46], skin, -.1, -1);
  ptForm(c, [[870, 1200], [850, 1225], [820, 1232]], [46, 42, 38], skin, -.2, -1);
  ellipse(c, 808, 1232, 26, 18, S.dk); ellipse(c, 806, 1228, 24, 15, S.base);
  for (let k = 0; k < 4; k++) ellipse(c, 790 - k * 4, 1222 + k * 6, 10, 6, S.lt, -.4);
  limb(c, [[826, 1158], [852, 1140]], [18, 18], GOLD.base); ellipse(c, 840, 1150, 7, 7, '#B81E24');   // armband
  ptMottle(c, 640, 1090, 1100, 1310, 260, [S.dk, S.lt, '#E86A34', '#B8401E', '#F7B24A'], R, 5, 18, .16);
  // a necklace of rudraksha-brown beads and a gold one
  c.strokeStyle = GOLD.base; c.lineWidth = 6; c.beginPath(); c.ellipse(742, 1150, 34, 46, -.5, -.6, 1.9); c.stroke();
  bhGrade(c, 600, 1060, 1110, 1320);
}

// ---------- Hanuman's head (centred on 0,0; about 170 across with the mane) ----------
// e: { eyes: [l, r] 0 closed … 1 open, look: [dx, dy], brows: [l, r] raise (-1 frown … 1 up), mouth: 'smile' | 'talk' |
// 'grin' | 'yawn' | 'o' | 'smirk', tears, blush, sleep (closed eyes curve down, as asleep), happy (closed eyes curve up) }
function bhHanumanHead(e = {}) {
  return (c) => {
    const S = HN_SKIN, R = lcg(43);
    // the mane: tufts of red-orange fur all round
    for (let k = 0; k < 26; k++) { const a = -Math.PI * 1.1 + k / 25 * Math.PI * 1.2 + Math.PI * .05, r = 74 + R() * 12; limb(c, [[Math.cos(a) * 50, Math.sin(a) * 50 + 6], [Math.cos(a) * r, Math.sin(a) * r + 6]], [30, 6], HN_MANE[R() * 4 | 0]); }
    for (let k = 0; k < 10; k++) { const a = Math.PI * .15 + k / 9 * Math.PI * .7, r = 70 + R() * 10; limb(c, [[Math.cos(a) * 46, Math.sin(a) * 40 + 10], [Math.cos(a) * r, Math.sin(a) * r + 12]], [24, 5], HN_MANE[R() * 4 | 0]); }
    // ears, red, with gold kundals
    for (const s of [-1, 1]) {
      ellipse(c, s * 70, 0, 20, 25, '#B83A1C'); ellipse(c, s * 71, 2, 11, 15, '#E07A5A');
      ellipse(c, s * 72, 32, 9, 12, GOLD.base); ellipse(c, s * 71, 30, 4, 6, GOLD.lt); ellipse(c, s * 72, 46, 4.5, 4.5, '#B81E24');
    }
    // the head
    blob(c, [[-62, -30], [-40, -62], [0, -70], [40, -62], [62, -30], [64, 14], [46, 50], [0, 64], [-46, 50], [-64, 14]], ptRad(c, -14, -26, 6, 92, [[0, S.lt], [.55, S.base], [1, S.dk]]));
    // the face plate round the eyes (a heart shape) and the muzzle
    blob(c, [[-50, -18], [-30, -34], [0, -22], [30, -34], [50, -18], [48, 10], [26, 22], [0, 18], [-26, 22], [-48, 10]], '#F0A06A');
    blob(c, [[-34, 8], [0, 0], [34, 8], [42, 34], [24, 56], [0, 60], [-24, 56], [-42, 34]], ptRad(c, -6, 18, 4, 60, [[0, '#FFD2A6'], [.7, S.muz], [1, '#D88A58']]));
    ellipse(c, 0, 60, 26, 6, 'rgba(140,50,20,.35)');
    // eyes
    const [el, er] = e.eyes || [1, 1], [lx, ly] = e.look || [0, 0];
    for (const [s, op] of [[-1, el], [1, er]]) {
      const x = s * 22, y = -8;
      if (op > .15) {
        ellipse(c, x, y, 14, 16 * op, '#FFFDF6');
        ellipse(c, x + lx * 4, y + ly * 4 + (1 - op) * 4, 9.5, 10.5 * Math.min(1, op * 1.2), '#3A1A0C'); ellipse(c, x + lx * 4, y + ly * 4 + (1 - op) * 4, 5, 5.5 * Math.min(1, op * 1.2), '#120804');
        ellipse(c, x + lx * 4 - 3.5, y + ly * 4 - 4, 3.6, 3.6, '#FFFFFF'); ellipse(c, x + lx * 4 + 3, y + ly * 4 + 3, 1.6, 1.6, 'rgba(255,255,255,.8)');
        // the upper lid, heavy when half open
        c.fillStyle = '#D97A48'; c.beginPath(); c.ellipse(x, y - 16 * op - 2, 16, 16 * (1 - op) + 3, 0, 0, Math.PI); c.fill();
        line(c, [[x - 15, y - 2 - 14 * op], [x, y - 4 - 16 * op], [x + 15, y - 2 - 14 * op]], '#4A1A0C', 3.4);
      } else if (e.happy) line(c, [[x - 13, y + 2], [x, y - 8], [x + 13, y + 2]], '#3A140A', 4.2);
      else line(c, [[x - 13, y - 2], [x, y + 6], [x + 13, y - 2]], '#3A140A', 4.2);
      // brows
      const b = (e.brows || [0, 0])[s < 0 ? 0 : 1];
      line(c, [[x - 14, y - 26 - b * 6 + s * b * 2], [x, y - 30 - b * 8], [x + 14, y - 26 - b * 6 - s * b * 2]], '#7A2A10', 5);
    }
    if (e.blush) for (const s of [-1, 1]) ellipse(c, s * 36, 20, 12, 7, 'rgba(255,90,80,.35)');
    // the nose
    ellipse(c, 0, 14, 10, 6, '#8A3216'); ellipse(c, -4, 15, 2.6, 2, '#2A0E06'); ellipse(c, 4, 15, 2.6, 2, '#2A0E06'); ellipse(c, -2, 11, 3, 1.6, 'rgba(255,200,170,.6)');
    // the tilak
    line(c, [[0, -50], [0, -34]], '#E0141E', 5); ellipse(c, 0, -54, 4, 4, '#FFFFFF');
    // the mouth
    const m = e.mouth || 'smile';
    if (m === 'smile') line(c, [[-22, 36], [-8, 44], [8, 44], [22, 36]], '#6A200E', 3.4);
    else if (m === 'smirk') { line(c, [[-20, 40], [0, 43], [16, 38], [26, 30]], '#6A200E', 3.6); }
    else if (m === 'talk' || m === 'grin') {
      const h = m === 'talk' ? 14 : 18;
      blob(c, [[-22, 34], [0, 38], [22, 34], [14, 34 + h], [0, 38 + h], [-14, 34 + h]], '#5A140C');
      if (m === 'grin') blob(c, [[-18, 35], [0, 38], [18, 35], [14, 41], [-14, 41]], '#FFF8EE');
      ellipse(c, 0, 34 + h * .8, 9, 4, '#E0605A');
    } else if (m === 'yawn') {
      blob(c, [[-18, 26], [0, 22], [18, 26], [22, 50], [0, 66], [-22, 50]], '#4A100A');
      ellipse(c, 0, 56, 12, 6, '#E0605A');
      for (const s of [-1, 1]) poly(c, [[s * 14, 27], [s * 10, 36], [s * 8, 26]], '#FFF8EE');
    } else if (m === 'o') { ellipse(c, 0, 42, 10, 12, '#5A140C'); }
    if (e.tears) for (const s of [-1, 1]) { blob(c, [[s * 30, 2], [s * 35, 14], [s * 30, 20], [s * 25, 14]], 'rgba(200,236,255,.9)'); ellipse(c, s * 29, 12, 2, 3, '#FFFFFF'); }
    if (e.zz) { /* drawn live (z's), not baked */ }
    ptMottle(c, -80, -80, 80, 80, 40, [S.lt, S.dk, '#E86A34'], R, 3, 8, .12);
  };
}
const BH_HEAD_BOX = [-100, -100, 200, 190];
// the keep/fine discs that keep a head's features legible (head space)
const BH_HEAD_FINE = [[0, 10, 62]], BH_HEAD_KEEP = [[0, 8, 56, .6]];

// ---------- Bhima (feet at 0,0; about 600 tall; 3/4 view facing right; the head is its own layer) ----------
// P: { lean (radians, about the hips), legs: [[hipL, kneeL, footL], [hipR, kneeR, footR]] (points), arms: { back: [S, E,
//   W], front: [S, E, W] }, hands: { back, front } ('fist' | 'open' | 'heart' | 'grip' | 'hip' | 'join' | 'up'),
//   neck (the head's anchor, returned) }
const BH_POSE = {
  stand: { legs: [[[-50, -205], [-58, -105], [-62, -4]], [[48, -205], [58, -105], [66, -4]]], arms: { back: [[-118, -395], [-182, -322], [-100, -250]], front: [[118, -392], [190, -320], [106, -252]] }, hands: { back: 'hip', front: 'hip' } },
  shout: { legs: [[[-50, -205], [-70, -105], [-86, -4]], [[48, -205], [66, -105], [86, -4]]], arms: { back: [[-118, -395], [-175, -330], [-208, -260]], front: [[118, -392], [176, -330], [212, -262]] }, hands: { back: 'fist', front: 'fist' } },
  heart: { legs: [[[-50, -205], [-58, -105], [-62, -4]], [[48, -205], [58, -105], [66, -4]]], arms: { back: [[-118, -395], [-182, -322], [-100, -250]], front: [[118, -392], [130, -290], [40, -350]] }, hands: { back: 'hip', front: 'heart' } },
  flex: { legs: [[[-50, -205], [-66, -105], [-80, -4]], [[48, -205], [62, -105], [80, -4]]], arms: { back: [[-118, -395], [-205, -410], [-190, -505]], front: [[118, -392], [205, -405], [200, -505]] }, hands: { back: 'up', front: 'up' } },
  bow: { lean: .38, legs: [[[-50, -205], [-58, -105], [-62, -4]], [[48, -205], [58, -105], [66, -4]]], arms: { back: [[-110, -395], [-40, -300], [40, -330]], front: [[118, -392], [110, -290], [56, -330]] }, hands: { back: 'none', front: 'join' } },
  grip1: { lean: .3, legs: [[[-50, -205], [-66, -105], [-80, -4]], [[48, -205], [74, -105], [96, -4]]], arms: { back: [[-118, -395], [-182, -322], [-100, -250]], front: [[118, -392], [214, -262], [238, -150]] }, hands: { back: 'hip', front: 'grip' } },
  grip2: { lean: -.12, drop: 46, legs: [[[-50, -205], [-124, -96], [-146, -4]], [[48, -205], [124, -96], [150, -4]]], arms: { back: [[-118, -395], [90, -300], [236, -236]], front: [[118, -392], [250, -290], [256, -166]] }, hands: { back: 'grip', front: 'grip' } },
};
// a walk step (k 0..3): legs and arms swing, the body bobs
function bhWalkPose(k) {
  const s = [1, 0, -1, 0][k], b = [0, -8, 0, -8][k];
  return { bob: b, legs: [[[-50, -205], [-58 + s * 26, -112 + (s > 0 ? -18 : 0)], [-62 + s * 50, -4 - (s > 0 ? 28 : 0)]], [[48, -205], [58 - s * 26, -112 + (s < 0 ? -18 : 0)], [66 - s * 50, -4 - (s < 0 ? 28 : 0)]]],
    arms: { back: [[-118, -395], [-150 - s * 30, -300], [-140 - s * 50, -220]], front: [[118, -392], [160 + s * 30, -300], [150 + s * 56, -220]] }, hands: { back: 'fist', front: 'fist' } };
}
const BH_NECK = [12, -430];   // where the head sits (before lean)
function bhRot([x, y], a, [ox, oy] = [0, -215]) { const c0 = Math.cos(a), s0 = Math.sin(a); return [ox + (x - ox) * c0 - (y - oy) * s0, oy + (x - ox) * s0 + (y - oy) * c0]; }
function bhHand(c, kind, [x, y], dir, S) {
  const skin = { dk: S.dk, base: S.base, lt: S.lt };
  if (kind === 'none') return;
  if (kind === 'fist' || kind === 'hip' || kind === 'up' || kind === 'grip') {
    ellipse(c, x, y, 34, 30, S.dk, dir); ellipse(c, x - 2, y - 3, 31, 27, S.base, dir);
    for (let k = 0; k < 4; k++) { const a = dir + (k - 1.5) * .42; ellipse(c, x + Math.cos(a) * 22, y + Math.sin(a) * 22 - 2, 11, 9, S.lt, a); }
    ellipse(c, x - 10, y - 12, 12, 8, 'rgba(255,230,180,.5)', dir);
    return;
  }
  if (kind === 'open' || kind === 'heart') {
    ellipse(c, x, y, 32, 26, S.dk, dir); ellipse(c, x - 2, y - 2, 29, 23, S.base, dir);
    for (let k = 0; k < 4; k++) { const a = dir + (k - 1.5) * .28; ptForm(c, [[x + Math.cos(a) * 18, y + Math.sin(a) * 18], [x + Math.cos(a) * 44, y + Math.sin(a) * 44]], [15, 12], skin, 0, -1, .5); }
    ptForm(c, [[x - 6, y + 14], [x - 22, y + 30]], [15, 12], skin, 0, -1, .5);
    return;
  }
  if (kind === 'join') {   // palms together, fingers up (anjali)
    blob(c, [[x - 22, y + 30], [x - 24, y - 10], [x - 12, y - 52], [x, y - 60], [x + 12, y - 52], [x + 22, y - 10], [x + 20, y + 30]], S.dk);
    blob(c, [[x - 18, y + 26], [x - 20, y - 8], [x - 10, y - 48], [x, y - 55], [x + 6, y - 46], [x + 8, y + 26]], S.base);
    line(c, [[x + 2, y - 52], [x + 2, y + 24]], S.dk, 2.5);
    for (let k = 0; k < 3; k++) line(c, [[x - 16, y - 30 + k * 12], [x - 4, y - 34 + k * 12]], 'rgba(140,80,40,.5)', 2);
  }
}
const BH_LOOK = { skin: BH_SKIN, dhoti: ['#9A2A36', '#7A1E2A', '#56121C'], pleat: '#B23A44', knee: 'rgba(190,70,80,.45)', sash: true, bow: true };
const HN_LOOK = { skin: HN_SKIN, dhoti: ['#E04A2A', '#B42A1A', '#7A1810'], pleat: '#F06A40', knee: 'rgba(255,140,90,.4)', sash: false, bow: false, tail: true };
function bhimaBody(P, LK = BH_LOOK) {
  return (c) => {
    const S = LK.skin, skin = { dk: S.dk, base: S.base, lt: S.lt }, R = lcg(61), a = P.lean || 0, bob = P.bob || 0, drop = P.drop || 0;
    c.save(); c.translate(0, bob);
    const rot = p => { const q = bhRot(p, a); return [q[0], q[1] + drop]; };
    const [[hl, kl, fl], [hr, kr, fr]] = P.legs;
    if (LK.tail) {   // Hanuman's tail, rising behind him and curling over
      const tp = [[-30, -230], [-150, -260], [-220, -380], [-210, -520], [-150, -600], [-90, -590], [-80, -545], [-104, -530]];
      limb(c, tp, tp.map((_, i) => 40 - i * 3), S.dk); limb(c, tp.map(([x, y]) => [x + 3, y - 3]), tp.map((_, i) => 30 - i * 2.4), S.base); c.save(); c.globalAlpha = .5; limb(c, tp.map(([x, y]) => [x + 6, y - 6]), tp.map((_, i) => 10 - i * .8), S.lt); c.restore();
    }
    // the gold-backed bow slung across his back
    if (LK.bow) {   // its two ends show above the back shoulder and below the front hip
    const bw = [[-176, -560], [-196, -500], [-130, -400], [0, -300], [100, -224], [150, -200], [166, -170]].map(rot);
    line(c, [bw[0], bw[6]].map(([x, y]) => [x + 4, y + 2]), 'rgba(240,230,200,.85)', 3);
    line(c, bw, '#4A2A10', 20); line(c, bw.map(([x, y]) => [x - 2, y - 3]), GOLD.base, 9); line(c, bw.map(([x, y]) => [x - 3, y - 5]), GOLD.lt, 3);
    for (const p of [bw[0], bw[6]]) ellipse(c, p[0], p[1], 9, 9, GOLD.dk);
    }
    // the back arm
    // (P.across: it reaches across his front, so after the torso it is drawn again over the chest from mid upper arm on)
    const [bs, be, bwr] = P.arms.back.map(rot);
    const backArm = (from, lit) => {
      const sk = lit ? skin : { dk: mixCol(S.dk, '#000000', .1), base: mixCol(S.base, S.dk, .15), lt: mixCol(S.lt, S.base, .25) };
      ptForm(c, [from, be], [84, 70], sk, .3, -1, .45); ptForm(c, [be, bwr], [70, 58], sk, .3, -1, .45);
      limb(c, [lerp2(be, bwr, .82), lerp2(be, bwr, .92)], [62, 62], lit ? GOLD.base : GOLD.dk);
      bhHand(c, P.hands.back, bwr, Math.atan2(bwr[1] - be[1], bwr[0] - be[0]), lit ? S : { dk: mixCol(S.dk, '#000000', .12), base: mixCol(S.base, S.dk, .2), lt: mixCol(S.lt, S.base, .3) });
    };
    backArm(bs, false);
    // legs: thighs under the dhoti, shins and feet below it
    for (const [h, k, f] of [[hl, kl, fl], [hr, kr, fr]].map(l => l.map(p => p))) {
      ptForm(c, [k, f], [66, 52], skin, .25, -1, .45);
      ellipse(c, f[0] + 16, f[1] - 6, 40, 18, S.dk); ellipse(c, f[0] + 14, f[1] - 10, 36, 15, S.base); ellipse(c, f[0] + 6, f[1] - 14, 22, 7, S.lt);
      limb(c, [[f[0] - 24, f[1] - 30], [f[0] + 24, f[1] - 30]], [12, 12], GOLD.base);
    }
    // the dhoti: maroon, gold border, the pleated front
    const wl = rot([-92, -262]), wr = rot([96, -262]);
    blob(c, [wl, rot([-110, -200]), [kl[0] - 52, kl[1] + 4], [(kl[0] + kr[0]) / 2, (kl[1] + kr[1]) / 2 - 30], [kr[0] + 52, kr[1] + 4], rot([118, -200]), wr, rot([0, -270])], ptLin(c, 0, -270, 0, -100, [[0, LK.dhoti[0]], [.6, LK.dhoti[1]], [1, LK.dhoti[2]]]));
    for (const [k, s] of [[kl, -1], [kr, 1]]) ellipse(c, k[0] + s * 4, k[1] - 26, 44, 34, LK.knee);
    line(c, [[kl[0] - 50, kl[1] + 2], [(kl[0] + kr[0]) / 2, (kl[1] + kr[1]) / 2 - 26], [kr[0] + 50, kr[1] + 2]], GOLD.base, 10);
    const pl = rot([22, -255]);
    blob(c, [pl, [pl[0] + 26, pl[1] + 10], [(kl[0] + kr[0]) / 2 + 20, (kl[1] + kr[1]) / 2 - 10], [(kl[0] + kr[0]) / 2 - 10, (kl[1] + kr[1]) / 2 - 16]], LK.pleat);
    for (let i = 0; i < 6; i++) line(c, [rot([-70 + i * 28, -250]), rot([-80 + i * 34, -180]), [lerp(kl[0], kr[0], i / 5) + (R() - .5) * 20, lerp(kl[1], kr[1], i / 5) - 30]], R() < .5 ? 'rgba(60,10,16,.5)' : 'rgba(210,90,100,.4)', 3 + R() * 3);
    // the torso: broad chest, round belly, golden
    const tor = [rot([-96, -262]), rot([-120, -330]), rot([-128, -392]), rot([-80, -420]), rot([20, -432]), rot([110, -420]), rot([138, -380]), rot([124, -310]), rot([100, -262]), rot([10, -250])];
    const ctr = rot([20, -350]);
    blob(c, tor, ptRad(c, ctr[0] - 20, ctr[1] - 30, 10, 190, [[0, S.lt], [.55, S.base], [1, S.dk]], ctr[0], ctr[1]));
    inside(c, blobPath(tor), () => {
      for (const s of [-1, 1]) { const p = rot([24 + s * 52, -372]); ellipse(c, p[0], p[1], 54, 34, 'rgba(255,220,160,.45)', a + s * .15); const q = rot([24 + s * 52, -340]); ellipse(c, q[0], q[1], 50, 10, 'rgba(120,60,24,.4)', a); }
      const b = rot([30, -295]); ellipse(c, b[0], b[1], 74, 44, 'rgba(255,214,150,.4)', a);
      const f = rot([-118, -320]); ellipse(c, f[0], f[1], 34, 110, 'rgba(110,56,20,.45)', a);
      const n = rot([24, -268]); ellipse(c, n[0], n[1], 6, 7, 'rgba(110,56,20,.6)');
    });
    // the sash across his chest (teal) and the gold waistband
    const sh1 = rot([-100, -410]), sh2 = rot([90, -268]);
    if (LK.sash) limb(c, [sh1, rot([-10, -350]), sh2], [34, 30, 28], '#2E6F64', false), limb(c, [sh1, rot([-10, -350]), sh2].map(([x, y]) => [x + 2, y - 6]), [8, 7, 6], '#5FA696', false);
    limb(c, [rot([-96, -262]), rot([0, -256]), rot([100, -262])], [22, 24, 22], GOLD.base, false); limb(c, [rot([-96, -266]), rot([0, -260]), rot([100, -266])], [5, 5, 5], GOLD.lt, false);
    // neck and necklace
    const nk = rot(BH_NECK);
    limb(c, [rot([10, -405]), nk], [80, 70], S.dk); limb(c, [rot([12, -405]), [nk[0] + 2, nk[1]]], [66, 56], S.base);
    c.strokeStyle = GOLD.base; c.lineWidth = 7; c.beginPath(); const nc = rot([16, -414]); c.ellipse(nc[0], nc[1], 56, 30, a, .2, Math.PI - .2); c.stroke();
    ellipse(c, nc[0] + 2, nc[1] + 32, 9, 11, '#B81E24');
    if (P.across) backArm(lerp2(bs, be, .4), true);
    // the front arm
    const [fs, fe, fw] = P.arms.front.map(rot);
    ellipse(c, fs[0], fs[1], 54, 50, S.dk); ellipse(c, fs[0] - 2, fs[1] - 4, 48, 44, S.base); ellipse(c, fs[0] - 8, fs[1] - 18, 24, 16, 'rgba(255,220,160,.6)');
    ptForm(c, [fs, fe], [92, 76], skin, -.3, -1); ptForm(c, [fe, fw], [76, 62], skin, -.3, -1);
    limb(c, [lerp2(fs, fe, .55), lerp2(fs, fe, .65)], [80, 80], GOLD.base); ellipse(c, lerp(fs[0], fe[0], .6), lerp(fs[1], fe[1], .6), 9, 9, '#B81E24');
    limb(c, [lerp2(fe, fw, .82), lerp2(fe, fw, .92)], [66, 66], GOLD.base);
    bhHand(c, P.hands.front, fw, Math.atan2(fw[1] - fe[1], fw[0] - fe[0]), S);
    ptMottle(c, -260, -560, 300, 0, 320, [S.dk, S.lt, LK.tail ? '#E86A34' : '#E8A060', LK.tail ? '#B8401E' : '#B8702E', '#F4C880'], R, 5, 20, .16);
    bhGrade(c, -280, -560, 300, 10);
    c.restore();
  };
}
const lerp2 = (p, q, k) => [lerp(p[0], q[0], k), lerp(p[1], q[1], k)];
const BH_BODY_BOX = [-280, -620, 580, 640];
// the head's anchor for a pose (Bhima space)
const bhNeck = P => { const n = bhRot(BH_NECK, P.lean || 0); return [n[0], n[1] + (P.bob || 0) + (P.drop || 0)]; };

// Bhima's head (centred on 0,0; 3/4 facing right). e as for Hanuman's, plus mouth 'shout' | 'strain' | 'proud', sweat
function bhBhimaHead(e = {}) {
  return (c) => {
    const S = BH_SKIN, R = lcg(63);
    // the hair: a black mass behind, a top-knot with a gold ring
    blob(c, [[-70, -20], [-66, -64], [-20, -92], [40, -86], [72, -50], [70, -10], [30, -40], [-30, -40]], '#160E0A');
    blob(c, [[-30, -96], [-12, -124], [16, -126], [34, -100], [14, -84], [-14, -86]], '#1E1410');
    ellipse(c, 2, -92, 30, 10, GOLD.base); ellipse(c, 0, -95, 24, 5, GOLD.lt);
    for (let k = 0; k < 6; k++) line(c, [[-50 + k * 18, -70], [-40 + k * 18, -84], [-24 + k * 16, -88]], '#3A2A22', 3);
    // the ear (the near one only), with a gold ring
    ellipse(c, -52, 6, 16, 22, S.dk); ellipse(c, -51, 6, 9, 14, '#B86A3A');
    ellipse(c, -54, 36, 9, 11, GOLD.base); ellipse(c, -55, 34, 3.5, 5, GOLD.lt);
    // the face: round, the near cheek full
    blob(c, [[-56, -34], [-30, -62], [16, -66], [56, -44], [70, -6], [64, 34], [36, 62], [0, 70], [-36, 58], [-58, 26]], ptRad(c, -6, -20, 6, 100, [[0, S.lt], [.55, S.base], [1, S.dk]], 0, 6));
    blob(c, [[-62, -30], [-40, -66], [20, -70], [60, -46], [52, -56], [10, -60], [-34, -54]], '#160E0A');   // the hairline
    ellipse(c, 34, 30, 22, 14, 'rgba(255,150,110,.3)');
    const [el, er] = e.eyes || [1, 1], [lx, ly] = e.look || [.4, 0];
    for (const [x, op, sc, side] of [[-6, el, .92, 0], [44, er, .8, 1]]) {
      const y = -10;
      if (e.strain) {   // eyes rolled up, half shut, squeezed
        ellipse(c, x, y, 15 * sc, 9, '#FFFDF6'); ellipse(c, x + 2, y - 6, 7 * sc, 6, '#2A160C');
        line(c, [[x - 16 * sc, y - 4], [x, y - 12], [x + 16 * sc, y - 4]], '#2A160C', 4);
        line(c, [[x - 14 * sc, y + 8], [x, y + 11], [x + 14 * sc, y + 8]], '#5A2E14', 2.5);
      } else if (op > .15) {
        ellipse(c, x, y, 15 * sc, 18 * op, '#FFFDF6');
        ellipse(c, x + lx * 5, y + ly * 4, 10 * sc, 11 * Math.min(1, op * 1.2), '#2A160C'); ellipse(c, x + lx * 5, y + ly * 4, 5.5 * sc, 6 * Math.min(1, op * 1.2), '#0C0604');
        ellipse(c, x + lx * 5 - 4, y + ly * 4 - 4, 4, 4, '#FFFFFF'); ellipse(c, x + lx * 5 + 3, y + ly * 4 + 4, 1.7, 1.7, 'rgba(255,255,255,.8)');
        c.fillStyle = S.base; c.beginPath(); c.ellipse(x, y - 18 * op - 2, 17 * sc, 18 * (1 - op) + 3, 0, 0, Math.PI); c.fill();
        line(c, [[x - 16 * sc, y - 4 - 14 * op], [x, y - 6 - 17 * op], [x + 16 * sc, y - 4 - 14 * op]], '#1A0C06', 3.6);
      } else if (e.happy) line(c, [[x - 14 * sc, y + 2], [x, y - 9], [x + 14 * sc, y + 2]], '#1A0C06', 4.5);
      else line(c, [[x - 14 * sc, y - 2], [x, y + 6], [x + 14 * sc, y - 2]], '#1A0C06', 4.5);
      // brows: thick, black
      const b = (e.brows || [0, 0])[side], f = e.strain ? -1.2 : b;
      const inner = side ? -1 : 1;   // the inner end of each brow faces the nose (between the eyes)
      limb(c, [[x - 18 * sc, y - 30 - f * 5 + (f < 0 ? inner * f * -6 : 0)], [x, y - 36 - f * 7], [x + 18 * sc, y - 30 - f * 5 - (f < 0 ? inner * f * -6 : 0)]], [9, 11, 7], '#140A06');
    }
    if (e.strain) for (let k = 0; k < 3; k++) line(c, [[4 + k * 6, -52 + k * 2], [14 + k * 6, -46 + k * 2]], 'rgba(110,50,20,.6)', 2.5);   // the wrinkled brow
    // the nose (3/4: toward the right)
    blob(c, [[18, -8], [30, 12], [32, 24], [18, 26], [12, 18]], S.dk); ellipse(c, 24, 20, 9, 6, S.base); ellipse(c, 22, 16, 4, 3, S.lt);
    // the moustache: thick, black, curled up at the ends
    const m = e.mouth || 'smile';
    const ms = m === 'shout' || m === 'strain' ? 6 : 0;
    // the mouth (under the moustache)
    if (m === 'smile') line(c, [[0, 44], [18, 50], [36, 44]], '#5A1E0E', 3.4);
    else if (m === 'proud') { blob(c, [[-6, 40], [18, 44], [44, 38], [36, 56], [18, 62], [2, 56]], '#4A140C'); blob(c, [[-2, 41], [18, 45], [40, 40], [34, 47], [4, 47]], '#FFF8EE'); }
    else if (m === 'talk') { blob(c, [[2, 42], [20, 44], [38, 42], [32, 56], [20, 60], [8, 56]], '#4A140C'); ellipse(c, 20, 55, 8, 3.5, '#D8605A'); }
    else if (m === 'shout') { blob(c, [[-6, 40], [20, 42], [46, 38], [42, 70], [20, 80], [0, 70]], '#3A0E08'); blob(c, [[-2, 41], [20, 43], [42, 39], [38, 47], [2, 48]], '#FFF8EE'); ellipse(c, 20, 70, 12, 6, '#D8605A'); }
    else if (m === 'strain') { blob(c, [[-6, 40], [20, 42], [46, 38], [40, 58], [20, 60], [0, 58]], '#3A0E08'); blob(c, [[-4, 42], [20, 44], [44, 40], [40, 56], [20, 58], [0, 56]], '#FFF8EE'); for (let k = 0; k < 5; k++) line(c, [[2 + k * 9, 42], [2 + k * 9, 57]], 'rgba(120,90,70,.6)', 1.6); line(c, [[-2, 49], [42, 49]], 'rgba(120,90,70,.6)', 1.6); }
    else if (m === 'o') { ellipse(c, 20, 52, 9, 11, '#3A0E08'); }
    else if (m === 'joy') { blob(c, [[-6, 40], [20, 44], [46, 38], [38, 62], [20, 70], [2, 62]], '#4A140C'); ellipse(c, 20, 62, 10, 5, '#D8605A'); blob(c, [[-2, 41], [20, 45], [42, 40], [36, 47], [4, 47]], '#FFF8EE'); }
    else if (m === 'small') line(c, [[10, 48], [20, 46], [30, 48]], '#5A1E0E', 3.4);
    for (const s of [-1, 1]) {
      const x0 = 22, w = s < 0 ? 40 : 34;
      blob(c, [[x0, 30], [x0 + s * w * .5, 28 - ms * .2], [x0 + s * w, 36 + ms], [x0 + s * (w + 10), 26 + ms], [x0 + s * (w + 6), 44 + ms], [x0 + s * w * .5, 44], [x0, 40]], '#120A06');
    }
    if (e.blush) for (const [x, w] of [[-14, 14], [52, 11]]) ellipse(c, x, 26, w, 7, 'rgba(255,80,70,.4)');
    if (e.strain) { ellipse(c, -16, 26, 18, 10, 'rgba(230,40,30,.35)'); ellipse(c, 54, 24, 14, 9, 'rgba(230,40,30,.35)'); }
    if (e.sweat) for (const [x, y, s] of [[-62, -40, 1], [74, -30, .8], [66, 14, .7]]) { blob(c, [[x, y - 14 * s], [x + 8 * s, y + 2], [x, y + 9 * s], [x - 8 * s, y + 2]], 'rgba(190,230,255,.95)'); ellipse(c, x - 2 * s, y, 2.4 * s, 3 * s, '#FFFFFF'); }
    if (e.tears) for (const x of [-6, 44]) { blob(c, [[x + 8, 4], [x + 13, 16], [x + 8, 22], [x + 3, 16]], 'rgba(200,236,255,.9)'); ellipse(c, x + 7, 13, 2, 3, '#FFFFFF'); }
    ptMottle(c, -80, -80, 80, 80, 40, [S.lt, S.dk, '#E8A060'], R, 3, 8, .12);
  };
}
const BH_BHEAD_BOX = [-90, -135, 190, 225];

// more poses: the hug (Bhima's front arm goes round Hanuman's back; Hanuman, flipped, puts his front arm across
// Bhima's shoulders), Hanuman standing with his hands on his hips
BH_POSE.bow.across = true; BH_POSE.grip2.across = true;
BH_POSE.hugB = { legs: BH_POSE.stand.legs, arms: { back: [[-118, -395], [-182, -322], [-100, -250]], front: [[118, -392], [190, -330], [240, -300]] }, hands: { back: 'hip', front: 'none' } };
BH_POSE.hugH = { legs: BH_POSE.stand.legs, arms: { back: [[-118, -395], [-182, -322], [-100, -250]], front: [[118, -392], [250, -420], [372, -380]] }, hands: { back: 'hip', front: 'open' } };

// ---------- the golden lotus ("a celestial lotus of a thousand petals, effulgent as the sun"), centred on 0,0 ----------
function bhLotus(c) {
  const R = lcg(71);
  for (let ring = 0; ring < 5; ring++) {
    const n = 14 - ring * 2, r = 74 - ring * 13, w = 20 - ring * 2.4;
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + (i + ring * .5) / n * TAU, tip = [Math.cos(a) * r, Math.sin(a) * r * .62 - ring * 8];
      const nx = -Math.sin(a), ny = Math.cos(a) * .62, b = [0, -ring * 8 + 6];
      const col = ptLin(c, b[0], b[1], tip[0], tip[1], [[0, ['#FFB04A', '#FFC15A', '#FFD06A', '#FFE08A', '#FFF0B0'][ring]], [1, ['#F07A3A', '#F69A4A', '#FBB65A', '#FFD27A', '#FFF4C8'][ring]]]);
      c.fillStyle = col; c.beginPath(); c.moveTo(b[0], b[1]); c.quadraticCurveTo(b[0] + tip[0] * .55 + nx * w, b[1] + tip[1] * .55 + ny * w, tip[0], tip[1]); c.quadraticCurveTo(b[0] + tip[0] * .55 - nx * w, b[1] + tip[1] * .55 - ny * w, b[0], b[1]); c.fill();
      line(c, [b, [tip[0] * .85, tip[1] * .85]], 'rgba(255,250,220,.5)', 1.6);
    }
  }
  ellipse(c, 0, -40, 16, 10, '#FFE27A'); for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; ellipse(c, Math.cos(a) * 12, -40 + Math.sin(a) * 6, 2.6, 2.6, '#E8A030'); }
  line(c, [[0, 10], [6, 60], [-4, 110]], '#5E8A34', 8);
  ptMottle(c, -80, -90, 80, 60, 40, ['#FFF4C8', '#F08A40', '#FFD27A'], R, 3, 9, .2);
}
const BH_LOTUS_BOX = [-90, -100, 180, 220];

// ---------- the vista: the Gandhamadana at sunrise, the grove far below (frame px) ----------
function bhVista(c) {
  const R = lcg(73);
  sky(c, [[0, '#F7C98A'], [500, '#FBE2B0'], [900, '#FFF1CC'], [1300, '#E8EBC0'], [1920, '#9CB67A']]);
  glow(c, 760, 760, 700, '#FFF4C8', .8, 'source-over');
  // snow peaks, far and pale, then nearer forested slopes
  ridge(c, 1000, 520, 21, '#C9B8C8', { freq: .0035, x0: -100, x1: 1200, shape: x => Math.max(0, 260 - Math.abs(x - 380) * .8) });
  ridge(c, 1000, 520, 21, 'rgba(255,248,240,.55)', { freq: .0035, x0: -100, x1: 1200, bottom: 760, shape: x => Math.max(0, 260 - Math.abs(x - 380) * .8) });
  haze(c, 1000, 300, '#FFF4DA', .7);
  ridge(c, 1180, 260, 33, '#8E9E86', { freq: .005 });
  haze(c, 1180, 260, '#FBF0D0', .55);
  ridge(c, 1380, 220, 41, '#5E7A4C', { freq: .006 });
  for (let i = 0; i < 260; i++) { const x = R() * 1080, y = 1300 + R() * 620; ellipse(c, x, y, 16 + R() * 30, 10 + R() * 16, mixCol('#3C5E2A', '#B8CE86', clamp(1 - (y - 1300) / 600 + (R() - .5) * .4)), R() * 3); }
  haze(c, 1420, 200, '#F8EED0', .45);
  for (let i = 0; i < 9; i++) bhBanana(c, 60 + i * 125 + (R() - .5) * 40, 1980, 380 + R() * 120, R, { depth: .25 + R() * .2, leaves: 7 });
  for (const [x, y, w] of [[200, 640, 420], [860, 520, 360], [560, 880, 500]]) { c.save(); c.globalAlpha = .55; c.filter = 'blur(6px)'; ellipse(c, x, y, w / 2, w / 10, '#FFF8EA'); ellipse(c, x + w * .15, y - w * .05, w / 3, w / 12, '#FFFFFF'); c.filter = 'none'; c.restore(); }
}

// ---------- the giant's sky: clouds round him, the grove tops far below (frame px) ----------
function bhGiantSky(c) {
  const R = lcg(79);
  sky(c, [[0, '#7FA8D8'], [700, '#BFD6EC'], [1300, '#FBE7C0'], [1920, '#F6D29A']]);
  glow(c, 540, 1300, 900, '#FFF0C8', .6, 'source-over');
  for (let i = 0; i < 9; i++) { const x = R() * 1080, y = 200 + R() * 900, w = 300 + R() * 400; c.save(); c.filter = 'blur(4px)'; c.globalAlpha = .75; for (let k = 0; k < 6; k++) ellipse(c, x + (k - 2.5) * w * .14, y + Math.sin(k * 1.7) * 18, w * .16, w * .09, k % 2 ? '#FFFFFF' : '#F4EEE8'); c.filter = 'none'; c.restore(); }
  ridge(c, 1700, 140, 51, '#7E9A6A', { freq: .004 });
  haze(c, 1700, 200, '#FFF0D0', .6);
  for (let i = 0; i < 12; i++) bhBanana(c, i * 95 + (R() - .5) * 30, 2000, 260 + R() * 80, R, { depth: .3 + R() * .2, leaves: 7 });
}

// ---------- Kurukshetra at dawn: Arjuna's chariot canopy, its flagstaff, the army far off in the dust (frame px) ----------
function bhKuru(c) {
  const R = lcg(83);
  sky(c, [[0, '#3A2A4A'], [600, '#B8586A'], [1100, '#F2A060'], [1500, '#FFD89A'], [1920, '#C88A54']]);
  glow(c, 760, 1180, 620, '#FFE2A0', .9, 'source-over'); ellipse(c, 760, 1180, 90, 90, '#FFF2C8');
  haze(c, 1260, 260, '#F8C888', .7);
  // the far armies: spears and banners in silhouette
  for (let i = 0; i < 160; i++) { const x = R() * 1080, h = 30 + R() * 70, y = 1330 + R() * 30; c.strokeStyle = 'rgba(90,50,40,.55)'; c.lineWidth = 2; c.beginPath(); c.moveTo(x, y); c.lineTo(x + (R() - .5) * 6, y - h); c.stroke(); if (R() < .12) poly(c, [[x, y - h], [x + 18, y - h + 6], [x, y - h + 12]], 'rgba(120,50,40,.6)'); }
  ridge(c, 1350, 30, 7, '#8A5A44', { freq: .01 });
  haze(c, 1380, 200, '#F2B878', .6);
  // the chariot canopy (a gold dome) at the bottom, the flagstaff rising from it
  blob(c, [[180, 1920], [200, 1700], [340, 1600], [540, 1570], [740, 1600], [880, 1700], [900, 1920]], ptLin(c, 0, 1560, 0, 1920, [[0, '#F4C46A'], [.4, '#C88A2A'], [1, '#5A3A14']]));
  for (let i = 0; i < 7; i++) line(c, [[240 + i * 100, 1920], [300 + i * 60, 1700], [540, 1580]], 'rgba(120,70,20,.5)', 4);
  ellipse(c, 540, 1575, 40, 26, '#FFE08A');
  limb(c, [[540, 1580], [540, 600]], [26, 18], ptLin(c, 520, 0, 560, 0, [[0, '#6A3A14'], [.5, '#E8B050'], [1, '#6A3A14']]));
  ellipse(c, 540, 592, 18, 18, GOLD.lt);
}
// the banner: saffron, the vanara on it (Arjuna's kapidhvaja), fluttering (ph 0..1). Its staff edge at x 552, y 610–900.
function bhBanner(ph) {
  return (c) => {
    const pts = [], n = 16;
    for (let i = 0; i <= n; i++) { const u = i / n, wv = Math.sin(u * 5 - ph * TAU) * 34 * u; pts.push([552 + u * 420, 610 + u * 60 + wv, 900 - u * 60 + wv * .8]); }
    c.beginPath(); pts.forEach(([x, y0], i) => i ? c.lineTo(x, y0) : c.moveTo(x, y0)); for (let i = n; i >= 0; i--) c.lineTo(pts[i][0], pts[i][2]); c.closePath();
    c.fillStyle = ptLin(c, 552, 0, 972, 0, [[0, '#F47A1A'], [.5, '#FB9A2A'], [1, '#E0601A']]); c.fill();
    // light and shade across the ripples
    for (let i = 1; i < n; i++) { const s = Math.cos(i / n * 5 - ph * TAU); c.fillStyle = s > 0 ? `rgba(255,220,140,${s * .35})` : `rgba(120,30,10,${-s * .35})`; c.beginPath(); c.moveTo(pts[i][0], pts[i][1]); c.lineTo(pts[i + 1][0], pts[i + 1][1]); c.lineTo(pts[i + 1][0], pts[i + 1][2]); c.lineTo(pts[i][0], pts[i][2]); c.fill(); }
    // the vanara emblem: a roaring monkey in white and red, riding the ripple at the middle
    const m = pts[7], cx = m[0] + 10, cy = (m[1] + m[2]) / 2;
    c.save(); c.translate(cx, cy); c.rotate(Math.sin(7 / n * 5 - ph * TAU) * .12);
    blob(c, [[-50, 60], [-40, 10], [-20, -30], [10, -40], [40, -20], [46, 20], [30, 70]], '#FFF3DE');
    ellipse(c, 6, -62, 34, 32, '#FFF3DE'); ellipse(c, -6, -56, 18, 15, '#C8341E'); ellipse(c, -14, -52, 8, 9, '#5A140C');   // the face, mouth open
    ellipse(c, 10, -72, 4, 4, '#3A140A'); limb(c, [[40, 30], [80, -10], [70, -60], [44, -70]], [12, 10, 8, 6], '#FFF3DE');   // eye, tail
    limb(c, [[-30, -10], [-70, -50]], [16, 12], '#FFF3DE'); limb(c, [[30, -10], [60, -40]], [16, 12], '#FFF3DE');   // arms up
    c.restore();
    c.strokeStyle = '#A8380E'; c.lineWidth = 6; c.beginPath(); pts.forEach(([x, y0], i) => i ? c.lineTo(x, y0) : c.moveTo(x, y0)); c.stroke();
    c.beginPath(); pts.forEach(([x, , y1], i) => i ? c.lineTo(x, y1) : c.moveTo(x, y1)); c.stroke();
  };
}
const BH_BANNER_BOX = [540, 540, 480, 430];

// ---------- a banana plant on its own (base at 0,0), to knock over ----------
const bhFallPlant = seed => c => bhBanana(c, 0, 0, 560, lcg(seed), { depth: .3, leaves: 8, lean: 0, cols: ['#8DB848', '#4E7A28', '#C8E070', '#E8F4A0', '#1E3416'] });
const BH_FALL_BOX = [-420, -1000, 840, 1020];
// side by side, arm in arm: the inner (front) arm goes behind the other brother, so only its shoulder shows
BH_POSE.side = { legs: BH_POSE.stand.legs, arms: { back: [[-118, -395], [-182, -322], [-100, -250]], front: [[112, -396], [126, -350], [122, -330]] }, hands: { back: 'hip', front: 'none' } };
