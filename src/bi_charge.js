// bi_charge.js: Krishna charging with a chariot wheel raised (the Brush Ink look's action test). A wide lunge on a
// smoking field under a red sky, the wheel swung up in his right hand, his left hand thrown out at a toppled chariot.
// Design units (1080 x 1350); the head is the bust's head, turned and fierce.
const BC = {
  skyR: '#C64638', skyG: '#7C6A6C', smoke: '#8C7C78', smokeS: '#6A5A58', smokeD: '#3F312F', dust: '#9A8A82',
  wood: '#5C3427', woodS: '#3B1F19', woodH: '#8E5B45', iron: '#2A2226',
  dhoti: '#F3A23A', dhotiS: '#CA701F', dhotiD: '#8A4012', dhotiH: '#FFD27A',
  ground: '#3E2C28', groundL: '#6A5550',
};

// two-bone IK: the middle joint for a limb from A to C with bone lengths a, b; side ±1 picks the bend
function biIK(A, C, a, b, side) {
  const dx = C[0] - A[0], dy = C[1] - A[1], d = Math.min(Math.hypot(dx, dy), a + b - .01), ang = Math.atan2(dy, dx);
  const t = Math.acos(Math.max(-1, Math.min(1, (a * a + d * d - b * b) / (2 * a * d))));
  return [A[0] + Math.cos(ang + side * t) * a, A[1] + Math.sin(ang + side * t) * a];
}

// a limb: a ribbon down the joints P with widths W (one per point), shaded on its lower-right, inked with a brush
function biLimb(c, P, W, o = {}) {
  const B = BI, K = Object.assign({}, BK, o.pal || {}), S = [], WS = [];
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)], m = Math.max(4, Math.ceil(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / 3));
    for (let j = 0; j < m; j++) {
      const t = j / m, t2 = t * t, t3 = t2 * t, f = (a, b, cc, d) => .5 * (2 * b + (-a + cc) * t + (2 * a - 5 * b + 4 * cc - d) * t2 + (-a + 3 * b - 3 * cc + d) * t3);
      S.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]); const u = t * t * (3 - 2 * t); WS.push(W[i] + (W[i + 1] - W[i]) * u);
    }
  }
  S.push(P[P.length - 1]); WS.push(W[W.length - 1]);
  const N = B.normals(S, false), L = S.map((p, i) => [p[0] + N[i][0] * WS[i] / 2, p[1] + N[i][1] * WS[i] / 2]), R = S.map((p, i) => [p[0] - N[i][0] * WS[i] / 2, p[1] - N[i][1] * WS[i] / 2]);
  // round ends (a shoulder, an elbow): half-discs round the end of the spine
  const tan = i => { const a = S[Math.max(0, i - 1)], b = S[Math.min(S.length - 1, i + 1)], l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [(b[0] - a[0]) / l, (b[1] - a[1]) / l]; };
  const capEnd = () => { const i = S.length - 1, n = N[i], d = tan(i), w = WS[i] / 2, out = []; for (let k = 1; k < 12; k++) { const a = Math.PI * k / 12; out.push([S[i][0] + (n[0] * Math.cos(a) + d[0] * Math.sin(a)) * w, S[i][1] + (n[1] * Math.cos(a) + d[1] * Math.sin(a)) * w]); } return out; };
  const capStart = () => { const n = N[0], d = tan(0), w = WS[0] / 2, out = []; for (let k = 1; k < 12; k++) { const a = Math.PI * k / 12; out.push([S[0][0] + (-n[0] * Math.cos(a) - d[0] * Math.sin(a)) * w, S[0][1] + (-n[1] * Math.cos(a) - d[1] * Math.sin(a)) * w]); } return out; };
  const poly = L.concat(o.capEnd ? capEnd() : [], R.reverse(), o.capStart ? capStart() : []);
  const mw = WS.reduce((a, b) => a + b, 0) / WS.length, sh = o.shade ?? .34;
  B.fill(c, poly, o.col || K.skin, { straight: true });
  B.clip(c, poly, () => {
    B.fill(c, poly, o.colS || K.skinS, { straight: true });
    B.fill(c, poly.map(([x, y]) => [x - mw * sh, y - mw * sh * .7]), o.col || K.skin, { straight: true });
    if (o.inside) o.inside(S, N, WS);
  });
  if (o.ink !== false) B.outline(c, poly, { w: o.lw || 3.6, heavy: 1.3, seed: o.seed || 1 });
  return { S, N, WS, poly };
}

function biChargePanel(c, R, t) {
  const B = BI, K = BK, C = BC, ink = B.ink, Sk = (P, w, e = {}) => B.stroke(c, P, { w, ...e });
  c.save(); c.beginPath(); c.rect(R.x, R.y, R.w, R.h); c.clip();
  // ---- the sky: red behind him, smoke-grey to the left ----
  const g = c.createLinearGradient(R.x, 0, R.x + R.w, 0); g.addColorStop(0, C.skyG); g.addColorStop(.55, C.skyR); g.addColorStop(1, '#B0392F');
  c.fillStyle = g; c.fillRect(R.x, R.y, R.w, R.h);
  const gl = c.createRadialGradient(660, 520, 40, 660, 520, 520); gl.addColorStop(0, 'rgba(255,150,110,.55)'); gl.addColorStop(1, 'rgba(255,120,90,0)');
  c.fillStyle = gl; c.fillRect(R.x, R.y, R.w, R.h);
  const gv = c.createLinearGradient(0, R.y, 0, R.y + R.h); gv.addColorStop(0, 'rgba(40,20,20,.35)'); gv.addColorStop(.4, 'rgba(40,20,20,0)'); gv.addColorStop(1, 'rgba(30,15,15,.25)');
  c.fillStyle = gv; c.fillRect(R.x, R.y, R.w, R.h);

  // ---- smoke behind ----
  biSmoke(c, [[620, 240], [700, 170], [820, 150], [900, 90], [1040, 110], [1080, 260], [1080, 560], [960, 600], [860, 520], [760, 470], [690, 380]], { seed: 3, col: C.smoke, colS: C.smokeS });
  biSmoke(c, [[-20, 820], [80, 760], [200, 790], [300, 760], [420, 820], [480, 900], [480, 1100], [-20, 1100]], { seed: 5, col: C.smokeS, colS: C.smokeD });
  biSmoke(c, [[820, 700], [900, 640], [1000, 650], [1080, 620], [1080, 1000], [860, 1000]], { seed: 7, col: C.smokeS, colS: C.smokeD });

  // ---- speed lines from the left: the swing ----
  const r = B.rnd(9);
  for (let i = 0; i < 26; i++) {
    const y = 40 + i * 30 + r() * 20, x0 = -20, len = 160 + r() * 280, ang = .12 + r() * .08;
    Sk([[x0, y], [x0 + len * .5, y + len * .5 * ang], [x0 + len, y + len * ang]], 2 + r() * 3.4, { a: .05, b: .8, col: i % 4 ? ink : '#2A1D1F' });
  }

  // ---- the pose ----
  const HR = [500, 922], HL = [598, 916];
  const AR = [196, 1196], KR = biIK(HR, AR, 220, 210, -1);
  const AL = [812, 1192], KL = biIK(HL, AL, 225, 215, -1);
  const RS = [532, 618], LS = [698, 646];
  const RW = [376, 330], RE = biIK(RS, RW, 170, 160, 1);
  const LW = [930, 760], LE = biIK(LS, LW, 160, 150, 1);
  const rdir = [(RW[0] - RE[0]) / 160, (RW[1] - RE[1]) / 160], grip = [RW[0] + rdir[0] * 66, RW[1] + rdir[1] * 66];
  const wh = { rx: 200, ry: 160, rot: -.5, al: .5 };
  const rimPt = [(wh.rx - 15) * Math.cos(wh.al), (wh.ry - 13) * Math.sin(wh.al)], cr = Math.cos(wh.rot), sr = Math.sin(wh.rot);
  wh.x = grip[0] - (rimPt[0] * cr - rimPt[1] * sr); wh.y = grip[1] - (rimPt[0] * sr + rimPt[1] * cr);

  biWreck(c);
  biGround(c);
  BI.oval(c, 500, 1226, 360, 22, 'rgba(18,10,14,.55)');
  biWheel(c, wh);

  // ---- the head's frame: turned, tilted; the hair streams back behind everything ----
  const H = [650, 488], hk = .38, tilt = .14, turn = .42;
  const headWarp = (x, y) => {
    const Rr = 140; let z = Math.sqrt(Math.max(0, Rr * Rr - x * x));
    const sm = v => Math.max(0, Math.min(1, v));
    z += 36 * Math.exp(-Math.pow(x / 18, 2)) * sm((y + 20) / 100) * (y < 112 ? 1 : Math.exp(-Math.pow((y - 112) / 8, 2)));
    z += 10 * Math.exp(-Math.pow(x / 40, 2)) * Math.exp(-Math.pow((y - 145) / 25, 2));
    return [x * Math.cos(turn) + z * Math.sin(turn), y];
  };
  const inHead = f => { c.save(); c.translate(H[0], H[1]); c.rotate(tilt); c.scale(hk, hk); f(); c.restore(); };
  inHead(() => {
    B.fill(c, [[-60, -176], [-200, -190], [-300, -120], [-300, 40], [-220, 160], [-120, 200], [-100, 0]], BK.hair);
    const spines = [
      [[-90, -168], [-240, -200], [-400, -170], [-540, -120], [-660, -90], [-760, -110]],
      [[-110, -120], [-260, -110], [-420, -60], [-560, 0], [-680, 20]],
      [[-120, -60], [-260, 0], [-400, 60], [-520, 120], [-620, 150]],
      [[-120, 20], [-230, 100], [-330, 170], [-420, 240], [-480, 300]],
      [[-100, 90], [-170, 190], [-230, 280], [-270, 360]],
    ];
    spines.forEach((sp, i) => biLock(c, sp, { w: 110 - i * 8, amp: 10, per: 96 + i * 8, seed: i + 70, ph: i * 1.1, dim: i % 2 === 1, rim: i < 3 ? '#F29A7C' : null }));
  });

  // ---- the legs and the dhoti ----
  biLeg(c, HR, KR, AR, -1);
  biLeg(c, HL, KL, AL, 1);
  biDhoti(c, { HR, HL, KR, KL, AR, AL });

  // ---- the torso, three-quarter, twisting into the throw ----
  const T = [[594, 594], [560, 598], [532, 608], [512, 636], [504, 690], [500, 760], [502, 830], [508, 892], [546, 906], [620, 904], [644, 888], [654, 838], [670, 780], [690, 722], [702, 674], [706, 648], [678, 620], [640, 600]];
  B.fill(c, T, K.skin);
  B.clip(c, T, () => {
    B.fill(c, [[650, 600], [706, 648], [702, 674], [690, 722], [670, 780], [654, 838], [644, 888], [624, 904], [628, 840], [646, 780], [664, 720], [670, 664], [660, 624]], K.skinS);
    B.fill(c, [[504, 640], [526, 650], [530, 720], [512, 780], [500, 780]], K.skinS);
    B.fill(c, [[522, 708], [566, 732], [610, 722], [606, 738], [560, 748], [520, 728]], K.skinS);
    B.fill(c, [[616, 722], [656, 732], [690, 706], [688, 728], [654, 750], [614, 742]], K.skinD);
    B.fill(c, [[690, 660], [706, 650], [702, 674], [690, 722], [670, 780], [654, 838], [644, 888], [634, 900], [644, 840], [662, 780], [680, 720]], BI.ink);
    B.feather(c, [[680, 660], [684, 720], [666, 780], [648, 840]], { n: 14, len: 22, side: -1, w: 2.2, seed: 18 });
    B.feather(c, [[660, 624], [670, 664], [664, 720], [646, 780], [628, 840]], { n: 16, len: 18, side: 1, w: 1.8, seed: 8 });
    B.hatch(c, [[616, 740], [690, 716], [680, 760], [620, 770]], { box: [610, 710, 700, 775], ang: -.5, gap: 6, w: 1.4, seed: 4 });
    Sk([[522, 706], [564, 730], [610, 720]], 3.4, { a: .3, b: .4 }); Sk([[616, 720], [656, 730], [692, 704]], 3.4, { a: .3, b: .4 });
    Sk([[606, 640], [610, 714]], 2.2, { a: .4, b: .4 });
    Sk([[602, 752], [604, 848]], 2.4, { a: .3, b: .3 });
    for (const y of [776, 812]) { Sk([[572, y], [600, y + 6]], 2, { a: .3, b: .3 }); Sk([[610, y + 6], [638, y]], 2, { a: .3, b: .3 }); }
    Sk([[530, 770], [540, 840], [556, 890]], 2.2, { a: .4, b: .4 }); Sk([[662, 770], [648, 840], [634, 884]], 2.2, { a: .4, b: .4 });
    B.oval(c, 598, 866, 5, 7, K.skinD);
    Sk([[540, 640], [580, 628], [620, 636]], 5, { col: K.skinH, a: .3, b: .5 });
  });
  B.outline(c, T, { w: 4.2, heavy: 1.3 });
  // the sacred thread, and gold cords crossed over the chest with a jewel where they meet
  Sk([[684, 636], [650, 700], [600, 780], [548, 850], [516, 894]], 3, { col: '#F6F0E2', a: .05, b: .05 }); Sk([[684, 636], [650, 700], [600, 780], [548, 850], [516, 894]].map(([x, y]) => [x + 2, y + 2]), 1, { a: .05, b: .05 });
  for (const P of [[[528, 626], [566, 684], [606, 728], [646, 800], [640, 900]], [[690, 640], [650, 684], [606, 728], [560, 800], [524, 896]]]) {
    Sk(P, 9, { col: BK.gold, a: .02, b: .02, jit: .05 }); Sk(P.map(([x, y]) => [x + 2, y + 2.5]), 3, { col: BK.goldS, a: .02, b: .02 });
    Sk(P.map(([x, y]) => [x - 4, y - 2]), 1.6, { a: .02, b: .02 }); Sk(P.map(([x, y]) => [x + 4.5, y + 3]), 1.8, { a: .02, b: .02 });
  }
  B.disc(c, 606, 728, 15, BK.gold); B.disc(c, 610, 732, 11, BK.goldS); B.ring(c, 606, 728, 15, 15, { w: 2.6 }); B.disc(c, 605, 727, 7, BK.red); B.disc(c, 603, 724, 2.4, BK.redH);
  biWaist(c);

  // ---- the neck and the head ----
  const neck = [[584, 540], [636, 540], [646, 612], [590, 618]];
  B.fill(c, neck, K.skin); B.clip(c, neck, () => { B.fill(c, [[616, 540], [646, 540], [650, 614], [620, 614]], K.skinS); B.fill(c, [[584, 540], [646, 540], [646, 566], [584, 560]], K.skinD); });
  Sk([[586, 548], [590, 614]], 3.4, { a: .1, b: .1 }); Sk([[638, 548], [646, 610]], 4.4, { a: .1, b: .1 });
  inHead(() => { B.warp = headWarp; biKrishna(c, { head: true, mood: 'fierce', gaze: [18, 6], feather: false }); B.warp = null; });

  // ---- the arms ----
  biArm(c, RS, RE, RW, { up: true });
  biHandRig(c, { x: RW[0], y: RW[1], ang: Math.atan2(rdir[0], -rdir[1]), k: 1.45, view: 'palm', flip: true, pal: K,
    f: { t: [30, 40, 46, 24], i: [4, 62, 76, 40], m: [0, 64, 78, 40], r: [4, 66, 78, 40], p: [8, 68, 78, 40] }, rings: { i: 1, m: 1 },
    afterPalm: () => biWheelRimFront(c, wh) });
  biArm(c, LS, LE, LW, {});
  const ldir = [(LW[0] - LE[0]) / 150, (LW[1] - LE[1]) / 150];
  biHandRig(c, { x: LW[0], y: LW[1], ang: Math.atan2(ldir[0], -ldir[1]) - .3, k: 1.8, view: 'back', flip: true, pal: K,
    f: { t: [52, 6, 8, 4], i: [14, 6, 10, 6], m: [3, 8, 12, 8], r: [9, 10, 14, 8], p: [18, 12, 16, 10] } });

  biDust(c);
  for (const [x, y, s] of [[770, 300, 14], [810, 266, 8], [740, 246, 6], [890, 420, 10], [716, 410, 5], [966, 330, 7]]) {
    B.fill(c, [[x - s, y], [x - s * .2, y - s * .9], [x + s, y - s * .3], [x + s * .6, y + s * .8], [x - s * .5, y + s * .7]], ink);
  }
  B.spatter(c, 780, 340, 120, 40, { s: 2.6, seed: 12, sx: 1.4, sy: .6 });
  c.restore();
}

function biSmoke(c, P, o) {
  // a smoke mass: a lumpy silhouette (an ink rim round every lump) with curls of darker smoke inside
  const B = BI, S = B.curve(P, true, 3), r = B.rnd(o.seed || 1), lumps = [];
  for (let i = 0; i < S.length; i += 6) { const [x, y] = S[i]; lumps.push([x + (r() - .5) * 10, y + (r() - .5) * 10, 18 + r() * 26]); }
  lumps.forEach(([x, y, rr]) => B.disc(c, x, y, rr + 3, B.ink));
  B.fill(c, P, B.ink);
  lumps.forEach(([x, y, rr]) => B.disc(c, x, y, rr, o.col));
  B.fill(c, B.tr(P, 0, 0), o.col);
  B.clip(c, P, () => {
    for (let i = 0; i < 10; i++) {
      const [x, y] = S[Math.floor(r() * S.length)], cx = x + (r() - .5) * 120, cy = y + 30 + r() * 80;
      B.disc(c, cx + 18, cy + 22, 34 + r() * 30, o.colS);
      B.feather(c, [[cx - 30, cy + 40], [cx + 10, cy + 54], [cx + 50, cy + 44]], { n: 6, len: 16, side: -1, w: 1.6, seed: i + 30 });
      B.stroke(c, B.spiral(cx, cy, 26 + r() * 12, 12, .55, r() * 6, r() < .5 ? 1 : -1, 24), { w: 2.6, a: .1, b: .7, jit: .2 });
    }
  });
  lumps.forEach(([x, y, rr], k) => { if (k % 2) { const Q = []; for (let j = 0; j <= 10; j++) { const a = Math.PI * (1.05 + j / 10 * .55); Q.push([x + Math.cos(a) * rr * .7, y + Math.sin(a) * rr * .7]); } B.stroke(c, Q, { w: 2.4, col: 'rgba(255,230,220,.35)', a: .3, b: .4 }); } });
}

function biWheel(c, w) {
  // a chariot wheel tilted in space: the rim's far side for depth, twelve spokes, an iron-bound hub, studs on the tyre
  const B = BI, C = BC, cr = Math.cos(w.rot), sr = Math.sin(w.rot);
  const E = (rx, ry, a, dx = 0, dy = 0) => { const x = rx * Math.cos(a), y = ry * Math.sin(a); return [w.x + dx + x * cr - y * sr, w.y + dy + x * sr + y * cr]; };
  const ring = (rx, ry, dx = 0, dy = 0) => { const P = []; for (let i = 0; i < 64; i++) P.push(E(rx, ry, i / 64 * B.TAU, dx, dy)); return P; };
  const t = 30, dd = [16, 14];
  // speed arcs trailing the rim
  for (let k = 0; k < 5; k++) { const P = []; for (let i = 0; i <= 16; i++) P.push(E(w.rx + 22 + k * 14, w.ry + 18 + k * 12, Math.PI * (.7 + i / 16 * .55))); B.stroke(c, P, { w: 3.4 - k * .5, a: .4, b: .3 }); }
  // the far side of the rim
  const outB = ring(w.rx, w.ry, ...dd), inB = ring(w.rx - t, w.ry - t * .85, ...dd);
  B.fill(c, outB.concat(inB.slice().reverse()), C.woodS, { straight: true }); B.stroke(c, outB, { closed: true, w: 4 });
  // spokes
  for (let i = 0; i < 12; i++) {
    const a = i / 12 * B.TAU + .1, a0 = E(30, 26, a), a1 = E(w.rx - t + 4, w.ry - t * .85 + 4, a);
    const n = [-(a1[1] - a0[1]), a1[0] - a0[0]], l = Math.hypot(...n), nx = n[0] / l, ny = n[1] / l;
    const sp = [[a0[0] + nx * 8, a0[1] + ny * 8], [a1[0] + nx * 5, a1[1] + ny * 5], [a1[0] - nx * 5, a1[1] - ny * 5], [a0[0] - nx * 8, a0[1] - ny * 8]];
    B.fill(c, sp, C.wood, { straight: true }); B.clip(c, sp, () => B.fill(c, sp.map(([x, y]) => [x + nx * 6, y + ny * 6]), C.woodS, { straight: true }));
    B.stroke(c, sp, { closed: true, w: 2.6, jit: .2 });
  }
  // the tyre, the hub
  const out = ring(w.rx, w.ry), inn = ring(w.rx - t, w.ry - t * .85), tyre = out.concat(inn.slice().reverse());
  B.fill(c, tyre, C.wood, { straight: true });
  B.clip(c, tyre, () => {
    B.fill(c, ring(w.rx, w.ry, 12, 10), C.woodS, { straight: true });
    B.fill(c, ring(w.rx - t + 2, w.ry - t * .85 + 2, -4, -4), C.wood, { straight: true });
    for (let k = 0; k < 3; k++) { const P = []; for (let i = 0; i <= 40; i++) P.push(E(w.rx - 8 - k * 8, w.ry - 7 - k * 7, Math.PI * (1.1 + i / 40 * .9) + k)); B.stroke(c, P, { w: 1.4, a: .3, b: .3, jit: .3 }); }
    const P = []; for (let i = 0; i <= 30; i++) P.push(E(w.rx - 6, w.ry - 5, Math.PI * (1.05 + i / 30 * .5))); B.stroke(c, P, { w: 4, col: C.woodH, a: .3, b: .4 });
  });
  B.stroke(c, out, { closed: true, w: 4.6, jit: .15 }); B.stroke(c, inn, { closed: true, w: 3, jit: .15 });
  for (let i = 0; i < 16; i++) { const p = E(w.rx - t / 2, w.ry - t * .42, i / 16 * B.TAU); B.disc(c, p[0], p[1], 4, C.iron); B.disc(c, p[0] - 1, p[1] - 1, 1.4, '#8A7A80'); }
  B.oval(c, w.x, w.y, 38, 32, C.woodS, w.rot); B.oval(c, w.x - 3, w.y - 3, 30, 25, C.wood, w.rot); B.ring(c, w.x, w.y, 38, 32, { w: 3.6, rot: w.rot });
  B.oval(c, w.x, w.y, 14, 12, C.iron, w.rot); B.ring(c, w.x, w.y, 14, 12, { w: 2.4, rot: w.rot });
  B.ring(c, w.x, w.y, 26, 22, { w: 2, rot: w.rot, heavy: .4 });
}
function biWheelRimFront(c, w) {
  // the bit of tyre that passes in front of his fingers, so the hand closes round it
  const B = BI, C = BC, cr = Math.cos(w.rot), sr = Math.sin(w.rot), t = 30;
  const E = (rx, ry, a) => { const x = rx * Math.cos(a), y = ry * Math.sin(a); return [w.x + x * cr - y * sr, w.y + x * sr + y * cr]; };
  const a0 = w.al - .2, a1 = w.al + .2, o = [], i = [];
  for (let k = 0; k <= 8; k++) { const a = a0 + (a1 - a0) * k / 8; o.push(E(w.rx, w.ry, a)); i.push(E(w.rx - t, w.ry - t * .85, a)); }
  const P = o.concat(i.reverse());
  B.fill(c, P, C.wood, { straight: true }); B.clip(c, P, () => B.fill(c, P.map(([x, y]) => [x + 8, y + 6]), C.woodS, { straight: true }));
  B.stroke(c, o, { w: 4.4, a: .1, b: .1 }); B.stroke(c, i, { w: 3, a: .1, b: .1 });
}

function biArm(c, S, E, Wr, o) {
  const B = BI, K = BK;
  // upper arm (deltoid, biceps) and forearm, with an armlet and a bangle
  const fa0 = null; const ua = biLimb(c, [S, [(S[0] * 2 + E[0]) / 3, (S[1] * 2 + E[1]) / 3], E], [70, 62, 46], { seed: 3, capStart: true, capEnd: true, inside: (P, N, W) => {
    const m = P[Math.floor(P.length * .55)], n = N[Math.floor(P.length * .55)];
    B.stroke(c, [[m[0] - n[0] * 10, m[1] - n[1] * 10], [m[0] + (P[P.length - 1][0] - m[0]) * .5, m[1] + (P[P.length - 1][1] - m[1]) * .5]], { w: 2.2, a: .4, b: .4 });
  } });
  const fa = biLimb(c, [E, [(E[0] * 3 + Wr[0] * 2) / 5, (E[1] * 3 + Wr[1] * 2) / 5], Wr], [46, 50, 32], { seed: 4, capStart: true });
  // the armlet (keyura) and the bangle
  const band = (P, N, Wd, u, h, col) => {
    const i = Math.floor((P.length - 1) * u), j = Math.min(P.length - 1, i + Math.max(2, Math.round(h / 3)));
    const Q = [[P[i][0] + N[i][0] * Wd[i] * .55, P[i][1] + N[i][1] * Wd[i] * .55], [P[j][0] + N[j][0] * Wd[j] * .55, P[j][1] + N[j][1] * Wd[j] * .55], [P[j][0] - N[j][0] * Wd[j] * .55, P[j][1] - N[j][1] * Wd[j] * .55], [P[i][0] - N[i][0] * Wd[i] * .55, P[i][1] - N[i][1] * Wd[i] * .55]];
    B.fill(c, Q, K.gold); B.clip(c, Q, () => { B.fill(c, Q.map(([x, y]) => [x + 6, y + 5]), K.goldS); B.disc(c, (P[i][0] + P[j][0]) / 2, (P[i][1] + P[j][1]) / 2, 3.4, K.red); });
    B.outline(c, Q, { w: 2.6, heavy: 1 });
  };
  band(ua.S, ua.N, ua.WS, .38, 14);
  band(fa.S, fa.N, fa.WS, .86, 12);
}

function biLeg(c, H, Kn, A, side) {
  // the shin below the dhoti: dark with the shadow of the cloth, an anklet, a bare foot gripping the ground
  const B = BI, K = BK, ink = B.ink;
  const mid = [(Kn[0] + A[0]) / 2, (Kn[1] + A[1]) / 2];
  biLimb(c, [Kn, mid, A], [70, 74, 40], { seed: 7 + side, shade: .5, capEnd: true, inside: (P, N, W) => {
    // the cloth's shadow falls over the top of the shin: black, broken into the light
    const top = P.slice(0, Math.floor(P.length * .45)).map((p, i) => [p[0] + N[i][0] * W[i] * .6, p[1] + N[i][1] * W[i] * .6]);
    const bot = P.slice(0, Math.floor(P.length * .45)).map((p, i) => [p[0] - N[i][0] * W[i] * .6, p[1] - N[i][1] * W[i] * .6]);
    B.fill(c, top.concat(bot.reverse()), ink, { straight: true });
    B.feather(c, P.slice(Math.floor(P.length * .4), Math.floor(P.length * .62)), { n: 8, len: 30, side: 1, w: 2.6, seed: 3 });
    // the calf in shadow down its back edge
    const bk = P.map((p, i) => [p[0] - N[i][0] * W[i] * .5 * side, p[1] - N[i][1] * W[i] * .5 * side]), bk2 = P.map((p, i) => [p[0] - N[i][0] * W[i] * .18 * side, p[1] - N[i][1] * W[i] * .18 * side]);
    B.fill(c, bk.concat(bk2.reverse()), K.skinD, { straight: true });
    B.stroke(c, P.slice(Math.floor(P.length * .55)).map((p, i, A2) => [p[0] + N[0][0] * 10, p[1] + N[0][1] * 10]), { w: 2, col: K.skinH, a: .4, b: .4 });
  } });
  // the foot
  const F = side < 0
    ? [[A[0] + 24, A[1] - 12], [A[0] + 30, A[1] + 22], [A[0] - 10, A[1] + 34], [A[0] - 64, A[1] + 38], [A[0] - 76, A[1] + 30], [A[0] - 60, A[1] + 18], [A[0] - 24, A[1] + 6], [A[0] - 18, A[1] - 14]]
    : [[A[0] - 24, A[1] - 12], [A[0] - 30, A[1] + 30], [A[0] + 20, A[1] + 38], [A[0] + 84, A[1] + 40], [A[0] + 96, A[1] + 30], [A[0] + 70, A[1] + 14], [A[0] + 30, A[1] + 4], [A[0] + 22, A[1] - 14]];
  B.fill(c, F, K.skin); B.clip(c, F, () => B.fill(c, F.map(([x, y]) => [x + 8 * side, y + 12]), K.skinS));
  B.outline(c, F, { w: 3.4, heavy: 1.2 });
  for (let k = 0; k < 4; k++) { const x = A[0] + side * (52 + k * 9), y = A[1] + 36 - k; B.stroke(c, [[x, y - 8], [x + side * 2, y]], { w: 1.6, a: .2, b: .3 }); }
  // the anklet
  const an = [[A[0] - 22, A[1] - 18], [A[0] + 22, A[1] - 18], [A[0] + 22, A[1] - 4], [A[0] - 22, A[1] - 4]];
  B.fill(c, an, K.gold); B.clip(c, an, () => B.fill(c, an.map(([x, y]) => [x + 14, y + 4]), K.goldS)); B.outline(c, an, { w: 2.6, heavy: 1 });
  for (let k = 0; k < 5; k++) B.disc(c, A[0] - 18 + k * 9, A[1] - 1, 2.8, K.gold);
}

function biDhoti(c, J) {
  // the dhoti, saffron: it billows round each thigh, folds over the knee and is caught below it; the sash end flies back
  const B = BI, C = BC, Sk = (P, w, e = {}) => B.stroke(c, P, { w, ...e });
  const lerp2 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  // the sash end flying back with the charge
  const tail = [[508, 884], [446, 870], [386, 884], [326, 866], [268, 882], [216, 866]];
  B.stroke(c, tail, { w: 40, col: C.dhotiS, a: .05, b: .6, jit: .3 });
  B.stroke(c, tail.map(([x, y]) => [x, y - 6]), { w: 26, col: C.dhoti, a: .05, b: .6, jit: .3 });
  B.stroke(c, tail.map(([x, y]) => [x, y - 22]), { w: 3, a: .1, b: .6 }); B.stroke(c, tail.map(([x, y]) => [x, y + 18]), { w: 3.6, a: .1, b: .5 });
  for (const [H, K, A, side] of [[J.HR, J.KR, J.AR, -1], [J.HL, J.KL, J.AL, 1]]) {
    const P = [[548, 880], lerp2(H, K, .5), K, lerp2(K, A, .46)];
    const L = biLimb(c, P, [150, 128, 104, 64], { col: C.dhoti, colS: C.dhotiS, shade: .3, lw: 4.2, seed: side + 5, capStart: true, inside: (S, N, W) => {
      // folds: pulled from the crotch to the knee, then hanging over the shin
      const at = (u, f) => { const i = Math.min(S.length - 1, Math.floor(u * (S.length - 1))); return [S[i][0] + N[i][0] * W[i] * f, S[i][1] + N[i][1] * W[i] * f]; };
      for (const [f0, f1, u0, u1] of [[-.3, -.1, .05, .55], [.05, .25, .1, .62], [.3, .2, .2, .7], [-.15, .1, .5, .95], [.2, -.1, .6, .98]]) {
        const pts = []; for (let k = 0; k <= 8; k++) { const u = u0 + (u1 - u0) * k / 8; pts.push(at(u, f0 + (f1 - f0) * k / 8)); }
        const sh = pts.map(([x, y], k) => [x + 9 + 6 * Math.sin(k / 8 * Math.PI), y + 9 + 5 * Math.sin(k / 8 * Math.PI)]);
        B.fill(c, pts.concat(sh.slice().reverse()), C.dhotiS, { straight: true });
        Sk(pts, 3, { a: .2, b: .3 });
        Sk(pts.map(([x, y]) => [x - 7, y - 8]), 2.4, { col: C.dhotiH, a: .4, b: .4 });
      }
      // fine fold lines along the drape
      for (let q = 0; q < 7; q++) { const f = -.45 + q * .15, u0 = .1 + (q % 3) * .08, u1 = .5 + (q % 4) * .1, pts = []; for (let k = 0; k <= 10; k++) pts.push(at(u0 + (u1 - u0) * k / 10, f + Math.sin(k * .6 + q) * .04)); Sk(pts, 1.3, { a: .3, b: .4, jit: .3, col: q % 2 ? BI.ink : C.dhotiD }); }
      B.fill(c, [at(.0, .5), at(.18, .5), at(.3, .42), at(.12, .2)], BI.ink, { straight: true });
      // the knee pushes through: a black crease under it
      const kc = at(.74, .3); B.fill(c, [[kc[0] - 24, kc[1] - 4], [kc[0] + 24, kc[1] - 10], [kc[0] + 10, kc[1] + 6]], C.dhotiD);
      // the weave's scrolls
      [[.3, -.1, 14, 1], [.45, .25, 12, -1], [.8, 0, 10, 1]].forEach(([u, f, rr, d], i) => { const [x, y] = at(u, f); Sk(B.spiral(x, y, rr, 3, 1.1, i, d, 30), 1.8, { col: C.dhotiD, a: .05, b: .6 }); });
      // gathered at the calf: a black band of shadow under the hem
      const h = at(.97, 0); B.fill(c, [at(.92, -.6), at(.92, .6), at(1, .6), at(1, -.6)], C.dhotiD, { straight: true });
    } });
    // the hem's ruffle
    const S = L.S, N = L.N, W = L.WS, i = S.length - 1, hx = S[i][0], hy = S[i][1], nx = N[i][0], ny = N[i][1];
    const rf = []; for (let k = 0; k <= 6; k++) { const f = -.62 + k / 6 * 1.24; rf.push([hx + nx * W[i] * f + (k % 2 ? 8 : 0) * -ny, hy + ny * W[i] * f + (k % 2 ? 8 : 0) * nx]); }
    Sk(rf, 3.2, { a: .1, b: .1 });
  }
  // the pleats falling in front
  const pl = [[536, 904], [576, 904], [588, 960], [590, 1020], [576, 1040], [556, 1046], [538, 1036], [526, 980]];
  B.fill(c, pl, C.dhoti);
  B.clip(c, pl, () => { for (const [x0, x1] of [[544, 540], [558, 560], [572, 580]]) { B.fill(c, [[x0, 904], [x1, 1046], [x1 + 8, 1046], [x0 + 6, 904]], C.dhotiS); Sk([[x0, 904], [x1, 1046]], 2.4, { a: .2, b: .2 }); } });
  B.outline(c, pl, { w: 3.6, heavy: 1.2 });
  Sk([[536, 1034], [548, 1044], [560, 1038], [574, 1048], [588, 1036]], 3, { a: .1, b: .1 });
}

function biWaist(c) {
  // a twisted sash at the waist, knotted on his right hip
  const B = BI, C = BC, Sk = (P, w, e = {}) => B.stroke(c, P, { w, ...e });
  const w = [[498, 868], [560, 878], [640, 874], [650, 904], [560, 916], [500, 904]];
  B.fill(c, w, C.dhotiS); B.clip(c, w, () => { for (let k = 0; k < 9; k++) Sk([[504 + k * 17, 866], [516 + k * 17, 914]], 3, { col: C.dhotiD, a: .2, b: .2 }); Sk([[502, 878], [570, 888], [644, 884]], 4, { col: C.dhoti, a: .2, b: .4 }); });
  B.outline(c, w, { w: 3.6, heavy: 1.2 });
  B.oval(c, 516, 892, 16, 13, C.dhoti); B.ring(c, 516, 892, 16, 13, { w: 3 }); Sk(B.spiral(516, 892, 10, 2, .9, 0, 1, 20), 2, { a: .1, b: .5 });
}

function biWreck(c) {
  // a chariot on its side, its carved body split, a wheel up in the air, the pole snapped
  const B = BI, C = BC, Sk = (P, w, e = {}) => B.stroke(c, P, { w, ...e });
  const body = [[900, 560], [990, 520], [1080, 520], [1080, 1080], [1000, 1100], [930, 1060], [880, 980], [860, 880], [870, 760]];
  B.fill(c, body, C.wood);
  B.clip(c, body, () => {
    B.fill(c, body.map(([x, y]) => [x + 40, y + 20]), C.woodS);
    for (let k = 0; k < 4; k++) Sk([[900 + k * 30, 600], [880 + k * 34, 760], [890 + k * 36, 920], [940 + k * 34, 1060]], 2, { a: .2, b: .2, jit: .3 });
    // carved scrolls
    for (const [x, y, rr, d] of [[960, 680, 30, 1], [1000, 820, 36, -1], [960, 960, 28, 1], [1040, 640, 24, -1]]) { Sk(B.spiral(x, y, rr, 4, 1.3, 0, d, 40), 3, { a: .05, b: .6 }); Sk(B.spiral(x + 4, y + 4, rr * .8, 3, 1.1, 0, d, 30), 2, { col: C.woodH, a: .05, b: .6 }); }
    B.fill(c, [[870, 760], [900, 760], [890, 880], [866, 880]], B.ink);
  });
  B.outline(c, body, { w: 5, heavy: 1.3 });
  // the snapped pole jutting left
  const pole = [[880, 890], [700, 932], [694, 916], [880, 870]];
  B.fill(c, pole, C.woodS); B.outline(c, pole, { w: 3.4 });
  B.fill(c, [[700, 932], [688, 940], [682, 920], [694, 916], [690, 926]], B.ink);
  // a wheel up in the air, half seen
  const P = [], Q = []; for (let i = 0; i <= 40; i++) { const a = Math.PI * (.55 + i / 40 * 1); P.push([1080 + Math.cos(a) * 150, 470 + Math.sin(a) * 180]); Q.push([1080 + Math.cos(a) * 124, 470 + Math.sin(a) * 152]); }
  B.fill(c, P.concat(Q.slice().reverse()), C.wood, { straight: true }); Sk(P, 4); Sk(Q, 3);
  for (let i = 0; i < 4; i++) { const a = Math.PI * (.7 + i * .2); Sk([[1080, 470], [1080 + Math.cos(a) * 128, 470 + Math.sin(a) * 156]], 9, { col: C.woodS, a: 0, b: 0 }); }
}

function biGround(c) {
  // the trampled field: dark earth, dust breaking round the feet like surf, arrows stuck at every angle
  const B = BI, C = BC, ink = B.ink, Sk = (P, w, e = {}) => B.stroke(c, P, { w, ...e }), r = B.rnd(21);
  const G = [[-20, 1190], [120, 1178], [260, 1196], [420, 1180], [600, 1196], [760, 1184], [920, 1196], [1100, 1180], [1100, 1400], [-20, 1400]];
  B.fill(c, G, C.ground);
  B.clip(c, G, () => {
    for (let i = 0; i < 40; i++) { const x = r() * 1080, y = 1200 + r() * 140, s = 6 + r() * 16; B.fill(c, [[x - s, y], [x, y - s * .6], [x + s, y], [x, y + s * .4]], ink); }
    for (let i = 0; i < 8; i++) { const y = 1230 + i * 14; Sk([[0, y], [300, y + 4], [700, y - 4], [1080, y + 2]], 1.4, { col: C.groundL, a: .3, b: .3, jit: .4 }); }
  });
  B.spatter(c, 540, 1290, 500, 70, { s: 2.6, seed: 4, sy: .1, col: ink });
}
function biDust(c) {
  const B = BI, C = BC, Sk = (P, w, e = {}) => B.stroke(c, P, { w, ...e }), ink = B.ink;
  // the dust thrown up round each foot
  for (const [x0, dir] of [[190, -1], [800, 1]]) {
    for (let k = 0; k < 4; k++) {
      const P = []; for (let i = 0; i <= 12; i++) { const u = i / 12; P.push([x0 + dir * (u * 220 + k * 30) - dir * 60, 1236 - Math.sin(u * Math.PI) * (30 + k * 6) - k * 8 + Math.sin(u * 18) * 3]); }
      B.stroke(c, P, { w: 16 - k * 3, col: C.dust, a: .2, b: .5, jit: .3 }); B.stroke(c, P.map(([x, y]) => [x, y - 7]), { w: 2.4, a: .2, b: .6 });
    }
  }
  // arrows in the ground
  for (const [x, y, a, l] of [[60, 1250, -1.1, 130], [110, 1262, -1.35, 100], [300, 1262, -1.9, 120], [930, 1250, -1.25, 140], [990, 1262, -1.6, 120], [1040, 1254, -2.0, 110], [660, 1270, -1.0, 90]]) {
    const tx = x + Math.cos(a) * l, ty = y + Math.sin(a) * l;
    Sk([[x, y], [tx, ty]], 3, { col: '#CFC4BC', a: 0, b: 0 }); Sk([[x + 1.5, y + 1], [tx + 1.5, ty + 1]], 1.2, { a: 0, b: 0 });
    const nx = -Math.sin(a), ny = Math.cos(a);
    for (const s of [1, -1]) B.fill(c, [[tx, ty], [tx - Math.cos(a) * 24 + nx * 9 * s, ty - Math.sin(a) * 24 + ny * 9 * s], [tx - Math.cos(a) * 30, ty - Math.sin(a) * 30]], '#E8E0D8');
    Sk([[tx, ty], [tx - Math.cos(a) * 30, ty - Math.sin(a) * 30]], 1.6, { a: 0, b: 0 });
  }
}
