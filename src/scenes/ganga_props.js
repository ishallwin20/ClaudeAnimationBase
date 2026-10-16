// ganga_props.js: the sets and props of the Ganga reel (src/scenes/ganga.js): skies by mood, lights, Sagara's 60,000
// princes with their torches, the chasm they dig, the ash, Kapila's eye, the inside of Shiva's jata, the five fires,
// the rising souls.

// ---------- skies ----------
const SKY = {
  night: (c) => sky(c, [[0, '#04060E'], [700, '#0E1830'], [1300, '#22304E'], [1920, '#0A0E1A']]),
  storm: (c, fl = 0) => { sky(c, [[0, '#05070E'], [600, '#141E34'], [1200, '#30405E'], [1920, '#0C1220']]); if (fl) flash(c, fl * .3, '#C8DAFF'); },
  dusk: (c) => { sky(c, [[0, '#120818'], [600, '#3A1530'], [1150, '#93312A'], [1450, '#E0703A'], [1920, '#3A1418']]); },
  cave: (c) => sky(c, [[0, '#06040A'], [800, '#140C1E'], [1500, '#22142E'], [1920, '#0A060E']]),
  ash: (c) => sky(c, [[0, '#05070C'], [900, '#121824'], [1500, '#1E2632'], [1920, '#0A0C12']]),
  dawnGrey: (c) => sky(c, [[0, '#0C0E16'], [800, '#2A2C3A'], [1400, '#6A5E62'], [1920, '#1A161C']]),
  dawn: (c) => sky(c, [[0, '#120E26'], [600, '#3A2448'], [1100, '#A2503A'], [1400, '#FFB46A'], [1600, '#FFD89A'], [1920, '#2A1A26']]),
  gold: (c) => sky(c, [[0, '#1A1024'], [700, '#5A2E3E'], [1200, '#D0803E'], [1600, '#FFD48A'], [1920, '#3A2420']]),
  silver: (c) => sky(c, [[0, '#060A16'], [700, '#1A2A48'], [1300, '#4A6488'], [1920, '#101A2C']]),
};
const SIL = (col, edge, a = .9) => ({ tint: [col, a], edge: { col: edge, w: 2.4, a: .8 }, rim: { col: edge, dx: 0, dy: -5, a: .8, blur: 1 } });
const MOON_FX = { ...LIGHTS.moon, grade: null };
const DUSK_SIL = SIL('#140810', '#FFB07A');
const CAVE_SIL = SIL('#0C0812', '#B79AE8');
const DAWN_SIL = SIL('#120A14', '#FFD8A0');

// ---------- the princes: a crowd of small crowned silhouettes with torches ----------
// Across [x0, x1] at feet y, n of them at scale k (about 1000k tall). o: t, col, torch (true), fade (0..1 turned to ash:
// they sink and grey out), surge (px they lunge to screen right), seed, march (0..1 how many have arrived, from the
// edges inward).
function princes(c, x0, x1, y, n, k, o = {}) {
  const t = o.t || 0, col = o.col || '#0E0A10', fade = o.fade || 0, seed = o.seed || 1, march = o.march ?? 1;
  for (let i = 0; i < n; i++) {
    const u = (i + hash(i * 3.1 + seed) * .8) / n, d = hash(i * 7.7 + seed), kk = k * (.75 + d * .5), edge = Math.min(u, 1 - u) * 2;
    if (edge > march * 1.05) continue;
    const x = lerp(x0, x1, u) + (o.surge || 0) * (.6 + d * .6) + Math.sin(t * 2 + i) * 3, yy = y + d * 60 * k * 4 + Math.abs(Math.sin(t * 6 + i * 1.3)) * -6 * kk * 10;
    const a = 1 - fade;
    if (a <= .02) continue;
    c.save(); c.globalAlpha = a; c.translate(x, yy + fade * 40); c.scale(kk * (i % 2 ? 1 : -1), kk);
    bhagiratha(c, { t: t + i, col: fade > 0 ? mixCol(col, '#6A6E78', fade) : col, arms: 'down' });
    if (o.torch !== false && i % 2 === 0) { limb(c, [[70, -560], [90, -760], [96, -900]], [24, 20, 16], col); }
    c.restore();
    if (o.torch !== false && i % 2 === 0 && a > .3) { const fx = x + 96 * kk * (i % 2 ? 1 : -1), fy = yy - 940 * kk; glow(c, fx, fy, 70 * kk * 10, '#FF9A4A', .35 * a); ellipse(c, fx, fy, 9 * kk * 10, 15 * kk * 10 * (1 + .2 * Math.sin(t * 13 + i)), rgba('#FFD08A', a)); }
  }
}

// ---------- the chasm: two rock walls closing in below, lit by torches; torches stream down its paths ----------
// o: t, glow (the colour of the light from below), lit (0..1), torches (0..1 how many lights stream down), river (0..1
// a river of light pouring down its middle), seed.
function chasm(c, o = {}) {
  const t = o.t || 0, lit = o.lit ?? 1, seed = o.seed || 5, gl = o.glow || '#FF8A3A';
  glow(c, 540, 1900, 900, gl, .35 * lit);
  for (const s of [-1, 1]) {
    const pts = [[s < 0 ? -100 : W + 100, -100]];
    for (let i = 0; i <= 14; i++) { const y = -100 + i * 150, x = 540 + s * (520 - i * 26 + fbm(i * .7 + (s + 2) * 5, seed) * 160); pts.push([x, y]); }
    pts.push([s < 0 ? -100 : W + 100, 2100]);
    poly(c, pts, '#0A0608');
    // the lit edge of each ledge
    c.save(); c.globalCompositeOperation = 'lighter';
    for (let i = 1; i < pts.length - 2; i++) strokePath(c, `M ${pts[i][0]} ${pts[i][1]} L ${pts[i + 1][0]} ${pts[i + 1][1]}`, rgba(gl, .22 * lit * (i / 14)), 4);
    c.restore();
  }
  const tn = Math.round(40 * (o.torches || 0));
  for (let i = 0; i < tn; i++) {
    const s = i % 2 ? 1 : -1, q = (hash(i * 2.3 + seed) + t * (.12 + hash(i) * .06)) % 1, y = -50 + q * 1900, x = 540 + s * (460 - q * 330) * (.5 + .5 * hash(i * 5.5)) + Math.sin(q * 20 + i) * 20;
    glow(c, x, y, 40, '#FF9A4A', .5); ellipse(c, x, y, 4, 6, '#FFE0A0');
  }
  if (o.river) waterPath(c, o.riverPath || [[560, -60], [520, 400], [580, 900], [530, 1400], [560, 2000]], [60, 70, 80, 90, 120], { t, a: o.river, speed: 900, glow: 1 });
}

// ---------- Kapila's eye opening (on a profile silhouette's head, facing left) ----------
function kapilaEye(c, x, y, k, open, t) {
  if (open <= 0) return;
  glow(c, x, y, 80 * k * (1 + open), '#FFD27A', .7 * open);
  fillPath(c, `M ${x - 16 * k} ${y} Q ${x - 2 * k} ${y - 9 * k * open} ${x + 10 * k} ${y - 1 * k} Q ${x - 2 * k} ${y + 6 * k * open} ${x - 16 * k} ${y} Z`, mixCol('#FFB84A', '#FFFFFF', open));
}

// ---------- the ash: grey heaps across a floor at y, wisps rising ----------
function ashField(c, y, t, o = {}) {
  const col = o.col || '#3A3E48', n = o.n ?? 26;
  fillPath(c, `M -100 ${y} L ${W + 100} ${y} L ${W + 100} ${H + 100} L -100 ${H + 100} Z`, o.floor || '#121418');
  for (let i = 0; i < n; i++) {
    const x = hash(i * 3.7) * W, d = hash(i * 5.3), yy = y + 30 + d * (H - y), w = (40 + hash(i * 2.2) * 50) * (.6 + d), h = w * .35;
    fillPath(c, `M ${x - w} ${yy} C ${x - w * .5} ${yy - h} ${x + w * .5} ${yy - h} ${x + w} ${yy} Z`, mixCol(col, '#000', .4 - d * .4));
    if (o.glow) glow(c, x, yy - h * .4, w * 1.4, o.glow, .25 * (o.glowA ?? 1));
  }
}

// ---------- inside the jata: great dark coils filling the frame; a small lost stream of light wandering ----------
function jataMaze(c, t, o = {}) {
  sky(c, [[0, '#04050C'], [1920, '#0A0C18']]);
  for (let i = 0; i < 16; i++) {
    const y0 = -200 + hash(i * 3.3) * 2300, a = (hash(i * 7.1) - .5) * 1.2, P = [];
    for (let s = 0; s <= 6; s++) { const x = -300 + s * 280, wv = Math.sin(s * 1.1 + i * 2 + t * .3) * 160; P.push([x, y0 + Math.tan(a) * (x - 540) + wv]); }
    limb(c, P, [140, 170, 150, 170, 150, 170, 140].map(v => v * (.6 + hash(i) * .6)), mixCol('#141830', '#000', hash(i * 9) * .6), false);
    limb(c, P.map(([x, y]) => [x, y - 30]), [10, 14, 12, 14, 12, 14, 10], rgba('#2C3458', .5), false);
  }
  // the stream: a short glowing body crawling along a winding path (kept above the caption band)
  const path = (q) => [540 + Math.sin(q * 7.3) * 330 + Math.sin(q * 2.1) * 80, 820 + Math.sin(q * 5.1 + 1) * 280 + Math.cos(q * 3.3) * 80];
  const head = o.q ?? t * .12, P = []; for (let s = 0; s < 10; s++) P.push(path(head - s * .025));
  glow(c, P[0][0], P[0][1], 360, GANGA_WATER.mid, .6); glow(c, P[0][0], P[0][1], 120, '#FFFFFF', .4);
  waterPath(c, P.reverse(), [4, 14, 24, 32, 38, 40, 40, 38, 32, 26], { t, speed: 260, glow: 1 });
}

// ---------- the five fires (panchagni): four round him, the sun the fifth ----------
function fires(c, cx, y, t, k = 1, a = 1) {
  for (const [dx, dy, s] of [[-300, 0, 1], [300, 0, 1], [-170, -90, .7], [170, -90, .7]]) {
    const x = cx + dx * k, yy = y + dy * k;
    glow(c, x, yy - 40 * s * k, 200 * s * k, '#FF7A2A', .5 * a);
    yagna(c, x, yy, 130 * s * k, t + dx, a);
  }
}

// ---------- the souls rising: gold sparks climbing, each with a short trail ----------
function souls(c, t, t0, o = {}) {
  const n = o.n ?? 90, u0 = t - t0; if (u0 < 0) return;
  c.save(); c.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) {
    const st = hash(i * 1.9) * 2.4, u = u0 - st; if (u < 0) continue;
    const x = (o.x0 ?? 140) + hash(i * 3.7) * ((o.x1 ?? 940) - (o.x0 ?? 140)) + Math.sin(u * 2 + i) * 24, y = (o.y ?? 1750) - u * (220 + hash(i * 5.1) * 260);
    if (y < -60) continue;
    const r = 3 + hash(i * 2.5) * 5, a = Math.min(1, u * 2);
    for (let k = 0; k < 4; k++) ellipse(c, x - Math.sin(u * 2 + i) * k * 2, y + k * 14, r * (1 - k * .2), r * (1 - k * .2), rgba('#FFD890', a * (.8 - k * .18)));
    ellipse(c, x, y, r * 3.4, r * 3.4, rgba('#FFB84A', a * .14));
  }
  c.restore();
}
