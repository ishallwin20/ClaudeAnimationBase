// cine_ganga.js: the descent of the Ganga (Valmiki Ramayana, Bala Kanda 38–44) for the cinematic engine (cine.js).
// Water: gangaFall() (the torrent from heaven), waterPath() (a stream along any path), gangaJet() (the little jet from
// Shiva's jata, Gangadhara); jataSpread() (Shiva's locks fanned out wide to catch her, in his head's units, drawn behind
// shiva() or shivaHead()); GANGA_PAL (the goddess, through deviHead's pal); horse() and chariot() (side views facing
// right); bhagiratha() (the king, a front-view silhouette: tapas on one toe, prayer); ghat() (steps down to the river,
// lamps, floating diyas).

// ---------- water ----------
const GANGA_WATER = { deep: '#2A5A8C', mid: '#7FB2E0', lit: '#D8ECFF', foam: '#F4FAFF' };

// The torrent: a column of water from (x, y0) down to y1, w wide at the top and w1 at the bottom (default w × 1.35),
// leaning `lean` px to the side at the bottom. o: t, k (0..1 how far down it has fallen yet), a (alpha), splash (0..1 the
// mist and spray where it lands), col (GANGA_WATER-like colours), glow.
function gangaFall(c, x, y0, y1, w, o = {}) {
  const t = o.t || 0, k = o.k ?? 1, a = o.a ?? 1, w1 = o.w1 ?? w * 1.35, lean = o.lean || 0, C = { ...GANGA_WATER, ...(o.col || {}) };
  if (k <= 0 || a <= 0) return;
  const yb = lerp(y0, y1, k), at = (y) => { const u = clamp((y - y0) / (y1 - y0)); return [x + lean * u * u, lerp(w, w1, u) / 2]; };
  c.save(); c.globalAlpha = a;
  if (o.glow !== false) glow(c, x + lean * .5, (y0 + yb) / 2, Math.max(w1, (yb - y0) * .45), C.mid, .35);
  // the body, brighter in the middle
  const body = new Path2D(); const N = 24;
  for (let i = 0; i <= N; i++) { const y = lerp(y0, yb, i / N), [cx, hw] = at(y), j = Math.sin(y * .02 - t * 9) * hw * .04; i ? body.lineTo(cx - hw + j, y) : body.moveTo(cx - hw + j, y); }
  for (let i = N; i >= 0; i--) { const y = lerp(y0, yb, i / N), [cx, hw] = at(y), j = Math.sin(y * .023 - t * 8 + 2) * hw * .04; body.lineTo(cx + hw + j, y); }
  body.closePath();
  const g = c.createLinearGradient(x - w1 / 2, 0, x + w1 / 2, 0);
  g.addColorStop(0, rgba(C.deep, .55)); g.addColorStop(.3, rgba(C.mid, .85)); g.addColorStop(.5, rgba(C.lit, .95)); g.addColorStop(.7, rgba(C.mid, .85)); g.addColorStop(1, rgba(C.deep, .55));
  c.fillStyle = g; c.fill(body);
  // streaks racing down
  c.save(); c.clip(body); c.lineCap = 'round';
  for (let i = 0; i < 46; i++) {
    const u = hash(i * 3.1) * 2 - 1, sp = 1500 + hash(i * 7.7) * 1300, len = 60 + hash(i * 1.9) * 220, gap = 80 + hash(i * 5.3) * 260;
    c.strokeStyle = rgba(i % 3 ? C.lit : C.foam, .25 + hash(i * 9.1) * .5); c.lineWidth = 2 + hash(i * 4.4) * (w * .05);
    c.setLineDash([len, gap]); c.lineDashOffset = -t * sp - hash(i) * 400;
    c.beginPath();
    for (let s = 0; s <= 12; s++) { const y = lerp(y0, yb, s / 12), [cx, hw] = at(y); s ? c.lineTo(cx + u * hw * .92, y) : c.moveTo(cx + u * hw * .92, y); }
    c.stroke();
  }
  c.setLineDash([]); c.restore();
  // foam along both edges
  for (let i = 0; i < 40; i++) {
    const s = (hash(i * 2.3) + t * (.9 + hash(i) * .6)) % 1, y = lerp(y0, yb, s), [cx, hw] = at(y), side = i % 2 ? 1 : -1;
    ellipse(c, cx + side * hw * (.94 + .08 * Math.sin(t * 7 + i)), y, 6 + hash(i * 5) * w * .03, 10 + hash(i * 6) * 18, rgba(C.foam, .5));
  }
  // where it lands: a burst of mist and spray
  const sp = o.splash ?? 0;
  if (sp > 0) {
    const [cx, hw] = at(yb);
    glow(c, cx, yb, hw * 3.2, C.lit, .55 * sp); glow(c, cx, yb, hw * 1.4, '#FFFFFF', .5 * sp);
    for (let i = 0; i < 70; i++) {
      const u = (hash(i * 1.3) + t * (.8 + hash(i * 2) * .9)) % 1, ang = -Math.PI / 2 + (hash(i * 4.1) - .5) * 2.9, r = u * hw * (2.5 + hash(i * 3) * 2.2);
      ellipse(c, cx + Math.cos(ang) * r, yb + Math.sin(ang) * r * .6 + u * u * 140, 3 + hash(i) * 6, 3 + hash(i) * 6, rgba(C.foam, (1 - u) * .7 * sp));
    }
  }
  c.restore();
}
// A stream along the points P (any number), widths Wd (one per point, or one number); o: t, a, speed (px/s along the
// stream), col, glow (0..1), dir (1 flows from P[0] to the end, -1 back).
function waterPath(c, P, Wd, o = {}) {
  const t = o.t || 0, a = o.a ?? 1, C = { ...GANGA_WATER, ...(o.col || {}) }, ws = typeof Wd === 'number' ? P.map(() => Wd) : Wd, sp = (o.speed ?? 600) * (o.dir ?? 1);
  if (a <= 0) return;
  c.save(); c.globalAlpha = a;
  const pts = through(P), wmax = Math.max(...ws);
  if (o.glow) for (let i = 0; i < pts.length; i += 6) glow(c, pts[i][0], pts[i][1], wmax * 2.2, C.mid, .12 * o.glow);
  limb(c, P, ws, rgba(C.mid, .8), false);
  limb(c, P, ws.map(v => v * .55), rgba(C.lit, .9), false);
  c.lineCap = 'round'; c.lineJoin = 'round';
  for (let i = 0; i < 7; i++) {
    const off = (hash(i * 3.3) - .5) * .7;
    c.strokeStyle = rgba(i % 2 ? C.foam : C.lit, .5 + hash(i) * .4); c.lineWidth = Math.max(1.5, wmax * (.06 + hash(i * 2.2) * .1));
    c.setLineDash([20 + hash(i * 5) * 60, 30 + hash(i * 7) * 90]); c.lineDashOffset = -t * sp * (.8 + hash(i * 9) * .5);
    c.beginPath();
    pts.forEach((p, j) => {
      const q = pts[Math.min(pts.length - 1, j + 1)], r = pts[Math.max(0, j - 1)], dx = q[0] - r[0], dy = q[1] - r[1], d = Math.hypot(dx, dy) || 1;
      const u = j / (pts.length - 1) * (ws.length - 1), k = Math.min(ws.length - 2, Math.floor(u)), w = ws.length > 1 ? lerp(ws[k], ws[k + 1], u - k) : ws[0];
      const x = p[0] - dy / d * w * off, y = p[1] + dx / d * w * off; j ? c.lineTo(x, y) : c.moveTo(x, y);
    });
    c.stroke();
  }
  c.setLineDash([]); c.restore();
}
// The little jet of Ganga rising from Shiva's jata and falling away (Gangadhara), from (x, y), k = scale (about 160 tall
// at 1), dir (+1 arcs to screen right). o: t, a.
function gangaJet(c, x, y, k, o = {}) {
  const t = o.t || 0, d = o.dir ?? 1, a = o.a ?? 1;
  const P = [[x, y], [x + d * 14 * k, y - 90 * k], [x + d * 60 * k, y - 150 * k], [x + d * 120 * k, y - 130 * k], [x + d * 160 * k, y - 60 * k], [x + d * 180 * k, y + 40 * k]];
  waterPath(c, P, [10 * k, 16 * k, 18 * k, 16 * k, 12 * k, 4 * k], { t, a, speed: 260 * k, glow: .8 });
  for (let i = 0; i < 12; i++) { const u = (hash(i * 2.7) + t * .7) % 1; ellipse(c, x + d * (170 + u * 40 + hash(i) * 30) * k, y + (20 + u * u * 160) * k, 2.4 * k, 2.4 * k, rgba(GANGA_WATER.foam, (1 - u) * .8 * a)); }
}

// ---------- Shiva's locks spread wide (the catch) ----------
// In shiva()/shivaHead() units (the face at about (0, -815), the jata knot's top -1004): long matted locks radiating
// from the crown in a fan. Draw before shiva() or shivaHead(). o: t, spread (0..1 how far they reach), wet (0..1 light
// running along them: the water inside), wind, col / colLt (the hair).
function jataSpread(c, o = {}) {
  const t = o.t || 0, sp = o.spread ?? 1, wet = o.wet || 0, col = o.col || '#17192B', lt = o.colLt || '#2C3050', g = o.wind ?? .2;
  if (sp <= 0) return;
  // each lock: a root round the crown, then out to the side and up, curling and drooping at the end like heavy rope
  const mk = (i, N, len0, seed) => {
    const u = N > 1 ? i / (N - 1) : .5, side = u < .5 ? -1 : 1, v = Math.abs(u - .5) * 2;   // v: 0 straight up .. 1 sideways
    const ang = -Math.PI / 2 + side * lerp(.25, 1.5, Math.pow(v, .8)) + (hash(i * 3.3 + seed) - .5) * .14;
    const L = len0 * (.55 + .45 * hash(i * 1.7 + seed)) * (.2 + .8 * sp), root = [side * v * 34 + (hash(i + seed) - .5) * 10, -930 - (1 - v) * 40];
    const P = [];
    for (let s = 0; s <= 6; s++) {
      const q = s / 6, r = q * L, curl = Math.sin(q * 4.4 + i * 1.9 + seed + t * 1.1) * L * .07 * q, droop = q * q * L * lerp(.6, .34, sp) * (.4 + .6 * v) + g * 20 * q * side;
      P.push([root[0] + Math.cos(ang) * r - Math.sin(ang) * curl, root[1] + Math.sin(ang) * r + Math.cos(ang) * curl + droop]);
    }
    return P;
  };
  const back = [], front = [];
  for (let i = 0; i < 18; i++) back.push(mk(i, 18, 760, 7));
  for (let i = 0; i < 14; i++) front.push(mk(i, 14, 620, 2));
  const WB = [30, 40, 38, 32, 24, 14, 3], WF = [26, 34, 32, 27, 20, 11, 2];
  back.forEach((P) => limb(c, P, WB, mixCol(col, '#000', .3), false));
  front.forEach((P, i) => {
    limb(c, P, WF, i % 2 ? col : mixCol(col, lt, .25), false);
    // a strand of light along each lock, and its tip curling
    limb(c, P.map(([x, y]) => [x + 4, y - 5]), [3, 5, 5, 4, 3, 2, 1], rgba(lt, .95), false);
  });
  if (wet > 0) {
    c.save(); c.globalCompositeOperation = 'lighter'; c.lineCap = 'round';
    front.concat(back).forEach((P, i) => {
      const pts = through(P);
      c.strokeStyle = rgba(GANGA_WATER.lit, .35 * wet); c.lineWidth = 4 + hash(i) * 4; c.setLineDash([90 + hash(i) * 120, 160 + hash(i * 2) * 200]); c.lineDashOffset = -t * (260 + hash(i * 3) * 160) - hash(i * 5) * 300;
      c.beginPath(); pts.forEach(([x, y], j) => j ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke();
      const e = P[6]; if (hash(i * 7) < .5) { const q = (t * .9 + hash(i)) % 1; ellipse(c, e[0], e[1] + q * q * 160, 4, 5, rgba(GANGA_WATER.foam, (1 - q) * .8 * wet)); }
    });
    c.setLineDash([]); c.restore();
    glow(c, 0, -980, 260, GANGA_WATER.mid, .25 * wet);
  }
}

// ---------- Ganga, the goddess (through deviHead's pal) ----------
const GANGA_PAL = {
  skin: '#D6A88A', skinSh: '#B07E66', skinDk: '#7E5444', palm: '#E6BCA0', lip: '#9A3A44', lipLo: '#B4505A',
  hair: '#10223A', hairLt: '#2C5480', sari: '#E8EEF6', sariSh: '#A9BBD2', sariLt: '#FFFFFF', border: '#3E7EC0', borderSh: '#2A5A8C',
  blouse: '#3E7EC0', gold: '#E9D9B0', goldSh: '#A6976E', goldLt: '#FFFFFF', ruby: '#3E9AD8', emerald: '#5FC6C0', pearl: '#FFFFFF', bindi: '#3E7EC0',
};

// ---------- the horse (side view, facing right) ----------
// Hooves at y 0, the withers about -300 high, the ears -445, from the tail (x -250) to the muzzle (+335). o: t, col,
// gallop (a phase in radians; omit to stand), decor (true: the Ashvamedha horse's cloth and plume), wind.
function horse(c, o = {}) {
  const col = o.col || '#0E0A10', t = o.t || 0, gal = o.gallop, run = gal != null, ph = gal || 0, bob = run ? Math.sin(ph * 2) * 8 : Math.sin(t * 1.2) * 1.5;
  const leg = (hx, hy, a1, a2, front) => {
    const l1 = front ? 105 : 115, l2 = 110, k = [hx + Math.sin(a1) * l1, hy + Math.cos(a1) * l1], f = [k[0] + Math.sin(a1 + a2) * l2, k[1] + Math.cos(a1 + a2) * l2];
    limb(c, [[hx, hy], k, f], front ? [60, 30, 20] : [80, 32, 20], col);
    fillPath(c, `M ${f[0] - 11} ${f[1] - 4} L ${f[0] + 13} ${f[1] - 4} L ${f[0] + 15} ${f[1] + 10} L ${f[0] - 11} ${f[1] + 10} Z`, col);
  };
  const L = run ? [[.55 * Math.sin(ph), -.9 * Math.max(0, Math.sin(ph + 1.2))], [.55 * Math.sin(ph + .5), -.9 * Math.max(0, Math.sin(ph + 1.7))], [.5 * Math.sin(ph + Math.PI), .2 + .6 * Math.max(0, Math.sin(ph + Math.PI + 1))], [.5 * Math.sin(ph + Math.PI + .5), .2 + .6 * Math.max(0, Math.sin(ph + Math.PI + 1.5))]]
    : [[.04, 0], [-.06, .02], [-.05, .08], [.06, .04]];
  c.save(); c.translate(0, bob);
  // far legs first (they share the colour; the silhouette needs them apart)
  leg(130, -180, L[1][0], L[1][1], true); leg(-140, -190, L[3][0], L[3][1], false);
  // the tail
  const tw = (o.wind ?? .3) * 30 + (run ? 30 : 0);
  limb(c, [[-172, -248], [-214, -236 + Math.sin(t * 3) * 6], [-246 - tw * .6, -190 + Math.sin(t * 3 + 1) * 10], [-262 - tw, -120 + Math.sin(t * 3 + 2) * 14]], [26, 30, 24, 6], col, false);
  // the barrel and the hindquarters
  fillPath(c, 'M -184 -232 C -178 -296 -104 -312 -20 -300 C 60 -292 126 -306 168 -272 C 198 -244 196 -180 168 -146 C 124 -116 40 -126 -40 -128 C -112 -130 -166 -136 -184 -176 C -192 -196 -190 -216 -184 -232 Z', col);
  // the neck and the head, angled down
  fillPath(c, 'M 80 -270 C 110 -340 160 -396 212 -418 C 226 -428 244 -432 256 -428 L 262 -452 L 274 -428 C 296 -404 322 -366 336 -336 C 342 -322 334 -310 318 -312 C 298 -316 280 -330 262 -346 C 246 -320 220 -270 196 -222 C 170 -196 110 -210 80 -270 Z', col);
  // the mane, lifting in the wind
  for (let i = 0; i < 6; i++) { const u = i / 5, x = lerp(240, 120, u), y = lerp(-428, -300, u), fl = Math.sin(t * 4 + i) * 6 + (run ? 12 : 4); limb(c, [[x, y], [x - 20 - fl, y + 6], [x - 40 - fl * 2, y + 18]], [16, 10, 3], col, false); }
  if (o.decor) {
    // the cloth over the back, with a fringe; a plume between the ears
    fillPath(c, 'M -110 -290 C -40 -300 40 -296 100 -284 L 112 -190 C 40 -176 -40 -176 -118 -186 Z', col);
    for (let i = 0; i < 12; i++) { const x = lerp(-114, 110, i / 11); fillPath(c, `M ${x - 5} -186 L ${x + 5} -186 L ${x} -168 Z`, col); }
    limb(c, [[258, -446], [250, -490], [232 + Math.sin(t * 3) * 6, -520]], [10, 12, 3], col, false);
  }
  // near legs
  leg(110, -176, L[0][0], L[0][1], true); leg(-120, -186, L[2][0], L[2][1], false);
  c.restore();
}
// A chariot (side view, facing right) with two horses ahead: the floor at (0, 0), the wheel's hub at (-30, -10), the
// horses' hooves at y +80, their muzzles about x +760. o: t, col, gallop (phase; omit to stand), flag (true).
// Draw the rider standing on the floor (at about x -40) after it: the rail is low.
function chariot(c, o = {}) {
  const col = o.col || '#0E0A10', t = o.t || 0, gal = o.gallop;
  for (const [dx, ph] of [[520, .7], [470, 0]]) { c.save(); c.translate(dx, 80); c.scale(.82, .82); horse(c, { col, t, gallop: gal == null ? null : gal + ph }); c.restore(); }
  strokePath(c, 'M 40 -30 C 200 -40 340 -90 470 -150', col, 12);   // the pole to the yoke
  // the car: a low box with a curved rail
  fillPath(c, 'M -150 -16 L 60 -16 L 70 -30 C 60 -90 30 -120 -10 -130 L -10 -110 C 20 -100 40 -80 44 -40 L -136 -40 L -150 -60 Z', col);
  // the wheel
  const sp = gal == null ? 0 : gal * 1.4;
  c.save(); c.translate(-30, -10);
  c.strokeStyle = col; c.lineWidth = 14; c.beginPath(); c.arc(0, 0, 88, 0, TAU); c.stroke();
  c.lineWidth = 6; for (let i = 0; i < 8; i++) { const a = sp + i * TAU / 8; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(a) * 86, Math.sin(a) * 86); c.stroke(); }
  ellipse(c, 0, 0, 16, 16, col); c.restore();
  if (o.flag !== false) { strokePath(c, 'M -140 -40 L -150 -330', col, 7); const f = Math.sin(t * 6) * 10; fillPath(c, `M -150 -330 C -110 ${-336 + f} -80 ${-318 - f} -40 ${-326 + f} L -60 -300 L -40 ${-276 + f} C -80 ${-268 - f} -110 ${-288 + f} -147 -280 Z`, col); }
}

// ---------- Bhagiratha (a front-view silhouette) ----------
// The feet at (0, 0), about 1000 tall to the kirita's tip (joined hands raised: -1100). o: t, col, arms ('up': raised
// overhead, palms joined (urdhvabahu) | 'namaste' at the chest | 'down'), toe (true: standing on the tip of one toe,
// the other foot drawn up against the knee), wind.
function bhagiratha(c, o = {}) {
  const col = o.col || '#0E0A10', t = o.t || 0, br = Math.sin(t * 1.4) * 1.5, arms = o.arms || 'up', wd = (o.wind ?? .3) * Math.sin(t * 1.7);
  // the hair falling behind the shoulders
  fillPath(c, 'M -46 -800 C -70 -760 -80 -700 -78 -650 L 78 -650 C 80 -700 70 -760 46 -800 Z', col);
  if (o.toe) {
    limb(c, [[12, -470], [14, -250], [14, -40]], [74, 54, 34], col);
    fillPath(c, 'M 2 -50 L 28 -50 L 22 0 L 8 0 Z', col);   // the foot, up on its toe
    limb(c, [[-26, -470], [-160, -330], [-6, -268]], [74, 54, 36], col);   // the other leg, the foot against the knee
  } else {
    limb(c, [[22, -470], [32, -250], [38, -40]], [74, 54, 36], col); limb(c, [[-22, -470], [-32, -250], [-38, -40]], [74, 54, 36], col);
    ellipse(c, 46, -16, 30, 16, col); ellipse(c, -46, -16, 30, 16, col);
  }
  // the dhoti at the hips, a pleat hanging down the middle
  fillPath(c, 'M -62 -540 C -76 -480 -84 -430 -80 -390 C -30 -380 30 -380 80 -390 C 84 -430 76 -480 62 -540 Z', col);
  fillPath(c, 'M -12 -420 L 12 -420 L 16 -300 L -14 -300 Z', col);
  // the torso, a V to a narrow waist
  fillPath(c, `M -52 -536 C -62 -600 -96 -650 -92 ${-700 + br} C -70 ${-728 + br} 70 ${-728 + br} 92 ${-700 + br} C 96 -650 62 -600 52 -536 Z`, col);
  for (const s of [-1, 1]) ellipse(c, s * 74, -694 + br, 34, 30, col);
  fillPath(c, 'M -18 -720 L -16 -752 L 16 -752 L 18 -720 Z', col);
  // the head, the earrings, the kirita
  ellipse(c, 0, -790, 36, 44, col);
  for (const s of [-1, 1]) ellipse(c, s * 38, -770, 7, 9, col);
  fillPath(c, 'M -38 -812 L -32 -880 C -24 -910 -10 -930 0 -960 C 10 -930 24 -910 32 -880 L 38 -812 Z', col);
  fillPath(c, 'M -4 -958 L 0 -990 L 4 -958 Z', col);
  if (arms === 'up') {
    for (const s of [-1, 1]) limb(c, [[s * 76, -690], [s * 96, -860], [s * 26, -1040]], [42, 32, 24], col);
    fillPath(c, 'M -22 -1030 C -18 -1070 -8 -1094 0 -1106 C 8 -1094 18 -1070 22 -1030 Z', col);
  } else if (arms === 'namaste') {
    for (const s of [-1, 1]) limb(c, [[s * 76, -690], [s * 70, -560], [s * 10, -610]], [42, 32, 24], col);
    fillPath(c, 'M -16 -600 C -14 -640 -6 -666 0 -676 C 6 -666 14 -640 16 -600 Z', col);
  } else for (const s of [-1, 1]) limb(c, [[s * 76, -690], [s * 92, -560], [s * 96, -420]], [42, 32, 24], col);
}

// ---------- the ghat ----------
// Stone steps rising from the river's edge at y (screen px) to y - 380, the skyline of shrines above, lamps on the steps
// and diyas floating on the water below. o: t, col (stone), lit (the lamp light), lamps (0..1 how many are lit), diyas
// (count), seed.
function ghat(c, y, o = {}) {
  const t = o.t || 0, stone = o.col || '#2A1A20', lit = o.lit || '#FFB45A', on = o.lamps ?? 1, seed = o.seed || 3;
  // the skyline: shrines and a chhatri, the far ones paler
  const sky = y - 380;
  for (let i = 0; i < 9; i++) {
    const x = -40 + i * 140 + (hash(seed + i) - .5) * 40, h = 120 + hash(seed + i * 2) * 220, w = 90 + hash(seed + i * 3) * 60, cc = mixCol(stone, '#000', .2);
    if (i % 3 === 1) { fillPath(c, `M ${x - w / 2} ${sky} L ${x - w / 2} ${sky - h * .5} L ${x + w / 2} ${sky - h * .5} L ${x + w / 2} ${sky} Z`, cc); fillPath(c, `M ${x - w * .6} ${sky - h * .5} C ${x - w * .5} ${sky - h * .9} ${x + w * .5} ${sky - h * .9} ${x + w * .6} ${sky - h * .5} Z`, cc); strokePath(c, `M ${x} ${sky - h * .78} L ${x} ${sky - h * .95}`, cc, 4); }
    else { fillPath(c, `M ${x - w / 2} ${sky} L ${x - w / 2} ${sky - h * .45} C ${x - w * .4} ${sky - h * .7} ${x - w * .12} ${sky - h * .9} ${x} ${sky - h} C ${x + w * .12} ${sky - h * .9} ${x + w * .4} ${sky - h * .7} ${x + w / 2} ${sky - h * .45} L ${x + w / 2} ${sky} Z`, cc); strokePath(c, `M ${x} ${sky - h} L ${x} ${sky - h - 30}`, cc, 3); fillPath(c, `M ${x} ${sky - h - 30} L ${x + 22} ${sky - h - 22} L ${x} ${sky - h - 16} Z`, '#C8502A'); }
  }
  // the steps: bands, each a little lighter at its edge
  const n = 11;
  for (let i = 0; i < n; i++) {
    const y0 = sky + i * 380 / n, y1 = y0 + 380 / n;
    fillPath(c, `M -100 ${y0} L ${W + 100} ${y0} L ${W + 100} ${y1} L -100 ${y1} Z`, mixCol(stone, '#000', .25 - i * .015));
    strokePath(c, `M -100 ${y0 + 1} L ${W + 100} ${y0 + 1}`, rgba(lit, .18 + i * .015), 2);
  }
  // the lamps on the steps
  for (let i = 0; i < 16; i++) {
    if (hash(seed + i * 7) > on) continue;
    const row = Math.floor(hash(seed + i * 5) * n), x = 40 + hash(seed + i * 11) * (W - 80), yy = sky + (row + 1) * 380 / n - 2;
    glow(c, x, yy - 10, 50, lit, .35); deepa(c, x, yy, .32, t, 1, i);
  }
  // the water and the floating diyas, each with its reflection
  fillPath(c, `M -100 ${y} L ${W + 100} ${y} L ${W + 100} ${H + 200} L -100 ${H + 200} Z`, mixCol('#0C1428', stone, .2));
  for (let i = 0; i < 30; i++) { const xx = hash(i * 3.3 + seed) * W, yy = y + 14 + hash(i * 5.1) * (H - y), w = 20 + hash(i) * 70; strokePath(c, `M ${xx + Math.sin(t + i) * 10} ${yy} l ${w} 0`, rgba(lit, .1), 2); }
  for (let i = 0; i < (o.diyas ?? 14); i++) {
    const u = hash(i * 2.1 + seed), depth = hash(i * 4.7 + seed), x = ((u * (W + 200) + t * (10 + depth * 18)) % (W + 200)) - 100, yy = y + 40 + depth * (H - y - 200), k = .5 + depth * .9, bob = Math.sin(t * 1.5 + i) * 2 * k;
    strokePath(c, `M ${x} ${yy + 10 * k} L ${x} ${yy + 70 * k}`, rgba(lit, .3), 6 * k);
    glow(c, x, yy - 8 * k + bob, 40 * k, lit, .4);
    fillPath(c, `M ${x - 16 * k} ${yy + bob} C ${x - 10 * k} ${yy + 8 * k + bob} ${x + 10 * k} ${yy + 8 * k + bob} ${x + 16 * k} ${yy + bob} Z`, '#3A2418');
    const fl = 1 + .15 * Math.sin(t * 9 + i * 3);
    fillPath(c, `M ${x} ${yy - 14 * k * fl + bob} C ${x + 4 * k} ${yy - 6 * k + bob} ${x + 4 * k} ${yy - 1 * k + bob} ${x} ${yy + bob} C ${x - 4 * k} ${yy - 1 * k + bob} ${x - 4 * k} ${yy - 6 * k + bob} ${x} ${yy - 14 * k * fl + bob} Z`, '#FFE0A0');
  }
}
