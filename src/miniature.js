// miniature.js: the Miniature style, a Pahari (Kangra) miniature painting made in code, on top of cine.js (load it
// after cine.js). Flat opaque pigments (lapis, Indian yellow, vermilion, malachite, white lead) inside a fine sepia
// line, faces in profile with long eyes, trees built leaf by leaf, water as a woven pattern of little curls, streaky
// clouds with gold lightning, white pavilions with cusped arches; the painting sits in a folio (a speckled salmon
// margin, rules, a lapis band) on wasli paper, with the verse written on a yellow inscription band. The camera moves
// slowly over each painting; only small things move (eyes, a lamp, water, birds, cloth). See MINIATURE_GUIDE.md.
const MN = {
  win: { x0: 40, y0: 40, x1: 1040, y1: 1880 },            // the painting's window inside the folio
  ink: '#3B2116', lw: 2.2, paper: .55, mottle: .1,
  col: {
    lapis: '#1F3478', night: '#0E1638', indigo: '#26346B', sky: '#8FB2CF', dusk: '#E9A866', peach: '#F2C9A0',
    yellow: '#E8B83C', ochre: '#C98B2E', vermilion: '#C9372A', red: '#9E2A22', pink: '#E7A1A0', rose: '#C95B6B',
    green: '#4F7A3E', leaf: '#2E4A26', leafLt: '#7EA154', sage: '#A9B783', white: '#F4EEDF', ivory: '#EFE4C8',
    skin: '#F1CDB0', skinSh: '#DDA98A', black: '#1B1512', gold: '#D9A93A', goldLt: '#F2D27A', brown: '#7A4A2A',
    water: '#6F98AC', waterDk: '#2E5470', stone: '#E9E1CF', salmon: '#D8907A',
  },
  devFont: '"Tiro Devanagari Hindi"', enFont: '"Cormorant Garamond"',
};
LOOK.bloom = 0; LOOK.vignette = .18; LOOK.grain = .035;

// ---------- paths ----------
// mnPath(pts, closed): a smooth Path2D through points (Catmull-Rom); a point [x, y, 1] is a sharp corner.
function mnPts(P, closed = true, n = 10) {
  const N = P.length, out = [], get = i => closed ? P[(i + N) % N] : P[clamp(i, 0, N - 1)];
  const last = closed ? N : N - 1;
  for (let i = 0; i < last; i++) {
    const p1 = get(i), p2 = get(i + 1), p0 = p1[2] ? p1 : get(i - 1), p3 = p2[2] ? p2 : get(i + 2);
    for (let k = 0; k < n; k++) {
      const f = k / n, f2 = f * f, f3 = f2 * f;
      out.push([0, 1].map(d => .5 * (2 * p1[d] + (-p0[d] + p2[d]) * f + (2 * p0[d] - 5 * p1[d] + 4 * p2[d] - p3[d]) * f2 + (-p0[d] + 3 * p1[d] - 3 * p2[d] + p3[d]) * f3)));
    }
  }
  if (!closed) out.push(P[N - 1].slice(0, 2));
  return out;
}
function mnPath(P, closed = true) {
  const p = new Path2D(), Q = mnPts(P, closed);
  Q.forEach(([x, y], i) => i ? p.lineTo(x, y) : p.moveTo(x, y)); if (closed) p.closePath(); return p;
}
const mnLineCol = col => mixCol(col, '#2A140C', .55);
// mnFill(c, path, col, o): a flat pigment with the fine line round it. path: a Path2D, an SVG string, or points.
//   o.line (colour, or false), o.lw, o.shade: [col, x0, y0, x1, y1] a soft wash toward (x1, y1) inside the shape
//   (the pardaz modelling of cloth and faces), o.alpha, o.pattern(c) drawn clipped inside.
function mnFill(c, d, col, o = {}) {
  const p = d instanceof Path2D ? d : typeof d === 'string' ? new Path2D(d) : mnPath(d, true);
  c.save(); if (o.alpha != null) c.globalAlpha *= o.alpha;
  if (col) { c.fillStyle = col; c.fill(p); }
  if (o.shade || o.pattern) {
    c.save(); c.clip(p);
    if (o.shade) { const [sc, x0, y0, x1, y1] = o.shade, g = c.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, rgba(sc, 0)); g.addColorStop(1, rgba(sc, o.shadeA ?? .45)); c.fillStyle = g; c.fillRect(-4000, -4000, 8000, 8000); }
    if (o.pattern) o.pattern(c);
    c.restore();
  }
  if (o.line !== false) { c.strokeStyle = o.line || mnLineCol(col || '#888888'); c.lineWidth = o.lw ?? MN.lw; c.lineJoin = 'round'; c.lineCap = 'round'; c.stroke(p); }
  c.restore();
  return p;
}
// mnStroke(c, pts, col, w, o): a fine open line through points (folds, brows, a flute)
function mnStroke(c, P, col = MN.ink, w = MN.lw, o = {}) {
  c.save(); if (o.alpha != null) c.globalAlpha *= o.alpha; c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.lineJoin = 'round';
  c.stroke(mnPath(P, false)); c.restore();
}
// mnLimb(c, P, Wd, col, o): a tapered limb with its fine line (a dark limb a little wider, then the fill)
function mnLimb(c, P, Wd, col, o = {}) {
  const lw = o.lw ?? MN.lw; c.save(); if (o.alpha != null) c.globalAlpha *= o.alpha;
  if (o.line !== false) limb(c, P, Wd.map(w => w + lw * 2), o.line || mnLineCol(col));
  limb(c, P, Wd, col); c.restore();
}
function mnDot(c, x, y, r, col) { c.fillStyle = col; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); }
function mnEll(c, x, y, rx, ry, col, o = {}) { const p = new Path2D(); p.ellipse(x, y, Math.abs(rx), Math.abs(ry), o.rot || 0, 0, TAU); return mnFill(c, p, col, o); }

// mnLook(z, px, py, sy): a cine.js camera that puts the stage point (px, py) at screen (540, sy), zoomed z
const mnLook = (z, px, py, sy = 760) => ({ z, fx: W / 2, fy: sy, x: px - W / 2, y: py - sy });

// ---------- skies ----------
// mnSky(c, kind, o): flat painted skies with a band of colour at the horizon (o.hy, its y).
//   kinds: dusk, night, day, dawn, storm. o.k blends dusk → night (0..1) for a sky that darkens.
const MN_SKIES = {
  day: [['#7FA6C8', 0], ['#A9C6DB', .55], ['#E8E4D0', 1]],
  dusk: [['#1A2A63', 0], ['#3C5590', .45], ['#C98E86', .8], ['#F0BE77', 1]],
  night: [['#090F2C', 0], ['#14204D', .55], ['#2B3E73', .9], ['#41558A', 1]],
  dawn: [['#26346B', 0], ['#6E7EA8', .45], ['#E9B49A', .82], ['#F6DDA6', 1]],
  storm: [['#0B0F26', 0], ['#1D2850', .6], ['#3A4A72', 1]],
};
function mnSky(c, kind, o = {}) {
  const hy = o.hy ?? 1100, y0 = o.y0 ?? -200, g = c.createLinearGradient(0, y0, 0, hy);
  const A = MN_SKIES[kind], B = o.to ? MN_SKIES[o.to] : null, k = o.k || 0;
  A.forEach(([col, s], i) => g.addColorStop(s, B ? mixCol(col, B[Math.min(i, B.length - 1)][0], k) : col));
  c.fillStyle = g; c.fillRect(-W, y0 - 2000, W * 3, hy - y0 + 2000);
  c.fillStyle = o.below || (B ? mixCol(A[A.length - 1][0], B[B.length - 1][0], k) : A[A.length - 1][0]); c.fillRect(-W, hy, W * 3, H * 3);
}
// streaky clouds: long thin curling bands, outlined, lit on top (Mughal/Pahari cloud bands)
function mnCloudBand(c, x, y, len, o = {}) {
  const r = lcg(o.seed ?? 3), th = o.th ?? 26, col = o.col || '#E8D9C2', n = 7;
  const P = [], Q = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n, px = x + u * len, sw = Math.sin(u * Math.PI);
    const yy = y + Math.sin(u * 5 + (o.seed || 0)) * th * .5 + ((o.t || 0) ? 0 : 0);
    P.push([px, yy - th * sw * (.6 + r() * .5)]); Q.unshift([px, yy + th * sw * (.25 + r() * .2)]);
  }
  const pts = P.concat(Q);
  mnFill(c, pts, col, { line: o.line ?? mnLineCol(col), lw: o.lw ?? 1.6, alpha: o.alpha, shade: [o.under || '#7C8BB0', 0, y - th, 0, y + th], shadeA: .6 });
  // curls at the ends
  for (const [ex, s] of [[x, -1], [x + len, 1]]) { c.save(); if (o.alpha != null) c.globalAlpha *= o.alpha; c.strokeStyle = mnLineCol(col); c.lineWidth = o.lw ?? 1.6; c.beginPath(); c.arc(ex + s * 6, y, th * .28, 0, TAU * .8); c.stroke(); c.restore(); }
}
// gold lightning: a fine zigzag of gold with a soft glow (as Kangra painters drew it in monsoon nights)
function mnLightning(c, x0, y0, x1, y1, seed, a = 1) {
  if (a <= 0) return;
  const r = lcg(seed), n = 9, P = [];
  for (let i = 0; i <= n; i++) { const u = i / n; P.push([lerp(x0, x1, u) + (i && i < n ? (r() - .5) * 70 : 0), lerp(y0, y1, u) + (i && i < n ? (r() - .5) * 20 : 0)]); }
  c.save(); c.globalAlpha *= a; c.lineJoin = 'miter'; c.lineCap = 'round';
  c.shadowColor = 'rgba(255,214,120,.9)'; c.shadowBlur = 18; c.strokeStyle = MN.col.goldLt; c.lineWidth = 4;
  c.beginPath(); P.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke();
  c.shadowBlur = 0; c.strokeStyle = '#FFF4CF'; c.lineWidth = 1.5; c.stroke(); c.restore();
}
function mnStars(c, n, box, seed = 1, t = 0, a = 1) {
  const [x0, y0, x1, y1] = box;
  for (let i = 0; i < n; i++) {
    const x = lerp(x0, x1, hash(i * 3.1 + seed)), y = lerp(y0, y1, hash(i * 7.7 + seed)), tw = .55 + .45 * Math.sin(t * (1 + hash(i)) * 2 + i);
    c.globalAlpha = a * tw * (.5 + hash(i + 9) * .5); mnDot(c, x, y, 1.2 + hash(i + 5) * 1.8, '#F7EFD8');
  }
  c.globalAlpha = 1;
}
function mnMoon(c, x, y, r, o = {}) {
  glow(c, x, y, r * 5, '#C9D4F0', o.glow ?? .25, 'screen');
  c.save(); c.strokeStyle = 'rgba(244,238,223,.35)'; c.lineWidth = 1.5; c.beginPath(); c.arc(x, y, r * 1.6, 0, TAU); c.stroke(); c.restore();
  mnEll(c, x, y, r, r, '#F6F0DE', { line: '#B9A98A', lw: 1.4 });
}

// ---------- land and trees ----------
// mnHill(c, pts, col, o): a rounded hill with a pale rim along its top (Kangra hills), shrubs dotted on it (o.shrubs)
function mnHill(c, pts, col, o = {}) {
  const p = mnFill(c, pts, col, { line: o.line ?? mnLineCol(col), lw: o.lw ?? 1.8, shade: o.shade ?? ['#1E2A18', 0, o.top ?? 0, 0, o.bot ?? 2000], shadeA: o.shadeA ?? .4 });
  if (o.rim !== false) { c.save(); c.clip(p); c.strokeStyle = rgba(o.rim || '#E8E2B8', .55); c.lineWidth = o.rimW ?? 14; c.filter = 'blur(5px)'; c.stroke(mnPath(pts.slice(0, o.rimN ?? pts.length), false)); c.restore(); }
  return p;
}
// mnTree(c, x, y, h, kind, o): a tree standing at (x, y), h tall, cached as a sprite.
//   kinds: 'dome' (a round dark crown built leaf by leaf), 'cypress', 'plantain', 'blossom' (white flowers),
//   'mango', 'bare'. o.seed, o.season ('spring' blossom, 'monsoon' dark, 'autumn' rust, 'winter' bare), o.flip, o.sway
function mnTree(c, x, y, h, kind = 'dome', o = {}) {
  const seed = o.seed ?? 1, season = o.season || '', key = `mnt|${kind}|${seed}|${season}|${o.leaf || ''}`;
  const SW = 420, SH = 620;
  const s = sprite(key, SW, SH, (g) => mnTreeDraw(g, SW / 2, SH - 20, kind, seed, season, o));
  const k = h / (SH - 40);
  c.save(); c.translate(x, y); if (o.sway) c.rotate(o.sway); if (o.flip) c.scale(-1, 1); if (o.alpha != null) c.globalAlpha *= o.alpha;
  c.drawImage(s, -SW / 2 * k, -(SH - 20) * k, SW * k, SH * k); c.restore();
}
function mnTreeDraw(g, x, y, kind, seed, season, o) {
  const r = lcg(seed * 13 + 7), C = MN.col;
  let dark = o.leaf || C.leaf, lt = C.leafLt;
  if (season === 'monsoon') { dark = '#203A22'; lt = '#5E8A46'; }
  if (season === 'autumn') { dark = '#5A3A1C'; lt = '#C27A2E'; }
  if (season === 'spring') { lt = '#9DBE63'; }
  const trunk = (x0, y0, x1, y1, w) => { mnLimb(g, [[x0, y0], [lerp(x0, x1, .5) + (r() - .5) * 20, lerp(y0, y1, .5)], [x1, y1]], [w, w * .55], '#6B4A30', { lw: 1.4 }); };
  if (kind === 'cypress') {
    trunk(x, y, x, y - 60, 14);
    const P = [[x, y - 560], [x + 30, y - 470], [x + 52, y - 300], [x + 50, y - 140], [x + 22, y - 50], [x - 22, y - 50], [x - 50, y - 140], [x - 52, y - 300], [x - 30, y - 470]];
    mnFill(g, P, dark, { lw: 1.4 });
    g.strokeStyle = lt; g.lineWidth = 2;
    for (let yy = y - 520; yy < y - 70; yy += 16) { const hw = 46 * Math.sin(clamp((y - 50 - yy) / 510) * Math.PI * .92 + .2); g.beginPath(); g.moveTo(x - hw * .8, yy + 8); g.lineTo(x, yy); g.lineTo(x + hw * .8, yy + 8); g.stroke(); }
    return;
  }
  if (kind === 'plantain') {
    trunk(x, y, x + 6, y - 260, 30);
    for (let i = 0; i < 7; i++) {
      const a = -Math.PI / 2 + (i - 3) * .42 + (r() - .5) * .2, L = 170 + r() * 80, bx = x + 6, by = y - 250 - r() * 30;
      const ex = bx + Math.cos(a) * L, ey = by + Math.sin(a) * L * .8 + (Math.abs(i - 3) > 1 ? 70 : 0), nx = -Math.sin(a), ny = Math.cos(a), w = 34;
      const P = [[bx, by, 1], [lerp(bx, ex, .5) + nx * w, lerp(by, ey, .5) + ny * w - 20], [ex, ey, 1], [lerp(bx, ex, .5) - nx * w * .6, lerp(by, ey, .5) - ny * w * .6 - 10]];
      mnFill(g, P, i % 2 ? '#5E8F3E' : '#4C7A35', { lw: 1.3 });
      g.strokeStyle = 'rgba(230,240,190,.6)'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(bx, by); g.quadraticCurveTo(lerp(bx, ex, .5), lerp(by, ey, .5) - 18, ex, ey); g.stroke();
    }
    return;
  }
  // round crowns: dome, blossom, mango, bare
  const lean = (r() - .5) * 30;
  trunk(x, y, x + lean * .4, y - 230, 26);
  if (kind === 'bare' || season === 'winter') {
    g.strokeStyle = '#5B3F2A'; g.lineCap = 'round';
    const br = (bx, by, a, L, w, d) => { const ex = bx + Math.cos(a) * L, ey = by + Math.sin(a) * L; g.lineWidth = w; g.beginPath(); g.moveTo(bx, by); g.lineTo(ex, ey); g.stroke(); if (d < 4) { br(ex, ey, a - .45 - r() * .2, L * .72, w * .62, d + 1); br(ex, ey, a + .4 + r() * .2, L * .7, w * .62, d + 1); } };
    br(x + lean * .4, y - 220, -Math.PI / 2, 90, 14, 0);
    if (season === 'winter') { g.fillStyle = 'rgba(250,248,240,.85)'; for (let i = 0; i < 40; i++) mnDot(g, x + (r() - .5) * 300, y - 300 - r() * 250, 2 + r() * 2, '#FBF8EE'); }
    return;
  }
  const blobs = [], cx = x + lean * .4, cy = y - 380, R = 150;
  blobs.push([cx, cy, R * .82]);
  for (let i = 0; i < 9; i++) { const a = i / 9 * TAU + r() * .4, d = R * (.55 + r() * .2); blobs.push([cx + Math.cos(a) * d * 1.05, cy + Math.sin(a) * d * .82, R * (.32 + r() * .14)]); }
  const crown = new Path2D(); for (const [bx, by, br] of blobs) { crown.moveTo(bx + br, by); crown.arc(bx, by, br, 0, TAU); }
  // line, then fill (the union's outline only)
  g.save(); g.strokeStyle = mnLineCol(dark); g.lineWidth = 3.2; g.stroke(crown); g.fillStyle = dark; g.fill(crown); g.restore();
  // leaf by leaf: little clusters of pointed leaves in a lighter green, each with a dark vein
  g.save(); g.clip(crown);
  const leafN = kind === 'mango' ? 70 : 90;
  for (let i = 0; i < leafN; i++) {
    const a = r() * TAU, d = Math.sqrt(r()) * R * 1.05, lx = cx + Math.cos(a) * d * 1.05, ly = cy + Math.sin(a) * d * .85;
    const nL = 5 + (r() * 3 | 0), ll = kind === 'mango' ? 22 : 14;
    for (let j = 0; j < nL; j++) {
      const la = -Math.PI / 2 + (j - nL / 2) * .55 + (r() - .5) * .3;
      g.save(); g.translate(lx, ly); g.rotate(la + Math.PI / 2);
      g.fillStyle = mixCol(lt, dark, r() * .45); g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(ll * .32, -ll * .5, 0, -ll); g.quadraticCurveTo(-ll * .32, -ll * .5, 0, 0); g.fill();
      g.restore();
    }
  }
  // the crown shaded dark at its lower edge
  const sg = g.createLinearGradient(0, cy - R, 0, cy + R); sg.addColorStop(0, 'rgba(0,0,0,0)'); sg.addColorStop(1, 'rgba(10,25,8,.45)'); g.fillStyle = sg; g.fillRect(cx - 400, cy - 400, 800, 800);
  if (kind === 'blossom' || season === 'spring') for (let i = 0; i < 60; i++) { const a = r() * TAU, d = Math.sqrt(r()) * R; const fx = cx + Math.cos(a) * d, fy = cy + Math.sin(a) * d * .82; for (let q = 0; q < 5; q++) mnDot(g, fx + Math.cos(q * 1.26) * 3.2, fy + Math.sin(q * 1.26) * 3.2, 2.4, kind === 'blossom' ? '#FFF8EE' : '#F3B9C4'); mnDot(g, fx, fy, 1.6, '#E8B83C'); }
  if (kind === 'mango') for (let i = 0; i < 9; i++) { const a = r() * TAU, d = Math.sqrt(r()) * R * .8; mnEll(g, cx + Math.cos(a) * d, cy + Math.sin(a) * d * .8 + 10, 8, 12, '#E2B33A', { lw: 1 }); }
  g.restore();
}

// ---------- water ----------
// mnWater(c, path, t, o): water as Pahari painters drew it: a pale ground covered in rows of little curls, flowing.
//   o.col, o.line (the curls), o.flow ([vx, vy] px/s), o.scale (curl size), o.box [x0, y0, x1, y1] the area to fill
function mnWater(c, path, t, o = {}) {
  const p = path instanceof Path2D ? path : mnPath(path, true), col = o.col || MN.col.water, s = o.scale ?? 1;
  c.save(); if (o.alpha != null) c.globalAlpha *= o.alpha; c.fillStyle = col; c.fill(p); c.clip(p);
  const [x0, y0, x1, y1] = o.box || [-200, -200, W + 200, H + 200], dx = 26 * s, dy = 15 * s, [vx, vy] = o.flow || [12, 0];
  const ox = ((vx * t) % (dx * 2) + dx * 2) % (dx * 2), oy = ((vy * t) % (dy * 2) + dy * 2) % (dy * 2);
  c.strokeStyle = o.line || rgba('#F2F2E6', .6); c.lineWidth = (o.lw ?? 1.6) * s; c.lineCap = 'round';
  c.beginPath();
  for (let row = 0, y = y0 - dy * 2 + oy; y < y1 + dy; y += dy, row++) {
    for (let x = x0 - dx * 2 + ox + (row % 2) * dx / 2; x < x1 + dx; x += dx) {
      c.moveTo(x - dx * .32, y); c.quadraticCurveTo(x, y - dy * .55, x + dx * .32, y);
    }
  }
  c.stroke();
  if (o.edge !== false) { c.strokeStyle = rgba('#FFFFFF', .35); c.lineWidth = 10 * s; c.filter = 'blur(4px)'; c.stroke(p); }
  c.restore();
  c.save(); c.strokeStyle = mnLineCol(col); c.lineWidth = o.lwEdge ?? 1.8; c.stroke(p); c.restore();
}
function mnLotus(c, x, y, s = 1, col = '#F0B7C0') {
  c.save(); c.translate(x, y); c.scale(s, s);
  mnEll(c, 0, 6, 34, 9, '#5F8C4C', { lw: 1.2 });
  for (const [a, k] of [[-.9, .8], [.9, .8], [-.45, 1], [.45, 1], [0, 1.1]]) { c.save(); c.rotate(a * .7); mnFill(c, [[0, 0, 1], [9 * k, -14 * k], [0, -30 * k, 1], [-9 * k, -14 * k]], col, { lw: 1.1, shade: ['#C0506A', 0, -30, 0, 0] }); c.restore(); }
  c.restore();
}

// ---------- architecture ----------
// a cusped (multifoil) arch opening: w wide, h to its springing, at (x, y) = bottom centre; returns the path
function mnArchPath(x, y, w, h, lobes = 5) {
  const p = new Path2D(), hw = w / 2, rise = w * .55;
  p.moveTo(x - hw, y); p.lineTo(x - hw, y - h);
  for (let i = 0; i < lobes; i++) {
    const a0 = Math.PI + i / lobes * Math.PI, a1 = Math.PI + (i + 1) / lobes * Math.PI;
    const px0 = x + Math.cos(a0) * hw, py0 = y - h + Math.sin(a0) * rise, px1 = x + Math.cos(a1) * hw, py1 = y - h + Math.sin(a1) * rise;
    const mx = (px0 + px1) / 2, my = (py0 + py1) / 2, nx = mx - x, ny = my - (y - h), d = Math.hypot(nx, ny) || 1;
    p.quadraticCurveTo(mx - nx / d * w * .07, my - ny / d * w * .07 * .4 - (i === Math.floor(lobes / 2) ? w * .05 : 0), px1, py1);
  }
  p.lineTo(x + hw, y); p.closePath(); return p;
}
function mnRail(c, x0, x1, y, h, col = MN.col.white, o = {}) {
  mnFill(c, [[x0, y, 1], [x1, y, 1], [x1, y - h, 1], [x0, y - h, 1]], col, { lw: 1.6 });
  c.save(); c.strokeStyle = mnLineCol(col); c.lineWidth = 1.2;
  const n = Math.max(2, Math.round((x1 - x0) / (o.gap ?? 18)));
  for (let i = 1; i < n; i++) { const xx = lerp(x0, x1, i / n); c.beginPath(); c.moveTo(xx, y - h * .2); c.lineTo(xx, y - h * .8); c.stroke(); }
  c.restore();
}
// a small domed chhatri / pavilion top
function mnDome(c, x, y, w, col = MN.col.white) {
  mnFill(c, [[x - w / 2, y, 1], [x - w * .55, y - w * .2], [x - w * .3, y - w * .62], [x, y - w * .78], [x + w * .3, y - w * .62], [x + w * .55, y - w * .2], [x + w / 2, y, 1]], col, { lw: 1.6, shade: ['#8A8070', x - w / 2, 0, x + w / 2, 0], shadeA: .35 });
  mnStroke(c, [[x, y - w * .78], [x, y - w * 1.02]], MN.col.gold, 3);
  mnDot(c, x, y - w * 1.04, 4, MN.col.gold);
}

// ---------- birds ----------
function mnCrane(c, x, y, s, flap = 0, col = '#F4F1E6') {
  c.save(); c.translate(x, y); c.scale(s, s);
  const w = Math.sin(flap * TAU);
  mnFill(c, [[-34, 0, 1], [-10, -16 * w - 6], [6, -2, 1], [-8, 4]], col, { lw: 1 });
  mnFill(c, [[-28, 2], [0, -5], [26, -1], [40, -4, 1], [24, 4], [-2, 6]], col, { lw: 1 });
  mnStroke(c, [[38, -4], [50, -2]], '#C9372A', 1.6);
  mnFill(c, [[-6, 2, 1], [10, 14 * w + 8], [18, 2, 1]], mixCol(col, '#B8B0A0', .3), { lw: 1 });
  c.restore();
}

// ---------- the folio and the verse ----------
// The border is drawn in LOOK.finish over every shot: the speckled salmon margin, black-white-black rules, a lapis
// band with a gold vine, a red inner rule. The painting shows through MN.win.
let MN_PAPER = null, MN_MOTTLE = null, MN_FOLIO = null;
function mnMakePaper() {
  const w = 540, h = 960, cv = document.createElement('canvas'); cv.width = w; cv.height = h; const g = cv.getContext('2d'), r = lcg(77);
  g.fillStyle = '#F4EAD2'; g.fillRect(0, 0, w, h);
  const id = g.getImageData(0, 0, w, h), d = id.data;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = (y * w + x) * 4, n = (r() - .5) * 18 + fbm(x * .02 + y * .013, 4) * 16 + fbm(x * .004, 9) * 10;
    d[i] = clamp(d[i] + n, 0, 255); d[i + 1] = clamp(d[i + 1] + n * .95, 0, 255); d[i + 2] = clamp(d[i + 2] + n * .8, 0, 255);
  }
  g.putImageData(id, 0, 0);
  g.strokeStyle = 'rgba(120,90,50,.12)'; g.lineWidth = .6;
  for (let i = 0; i < 900; i++) { const x = r() * w, y = r() * h, a = r() * TAU, l = 3 + r() * 9; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); }
  for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(150,110,60,${.03 + r() * .05})`; g.beginPath(); g.arc(r() * w, r() * h, 6 + r() * 30, 0, TAU); g.fill(); }
  const big = document.createElement('canvas'); big.width = W; big.height = H; big.getContext('2d').drawImage(cv, 0, 0, W, H); return big;
}
function mnMakeMottle() {
  const w = 270, h = 480, cv = document.createElement('canvas'); cv.width = w; cv.height = h; const g = cv.getContext('2d'), id = g.createImageData(w, h), d = id.data, r = lcg(31);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = (y * w + x) * 4, v = 128 + fbm(x * .05, y * .7 + 3) * 50 + fbm(y * .06, x * .3 + 11) * 40 + (r() - .5) * 30; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; }
  g.putImageData(id, 0, 0);
  const big = document.createElement('canvas'); big.width = W; big.height = H; const b = big.getContext('2d'); b.filter = 'blur(1px)'; b.drawImage(cv, 0, 0, W, H); return big;
}
function mnMakeFolio() {
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const g = cv.getContext('2d'), r = lcg(5), { x0, y0, x1, y1 } = MN.win;
  g.fillStyle = MN.col.salmon; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 2600; i++) { g.fillStyle = r() < .7 ? 'rgba(150,50,40,.35)' : 'rgba(255,240,220,.4)'; g.beginPath(); g.arc(r() * W, r() * H, .6 + r() * 1.4, 0, TAU); g.fill(); }
  const rect = (m, col, lw) => { g.strokeStyle = col; g.lineWidth = lw; g.strokeRect(x0 - m, y0 - m, x1 - x0 + 2 * m, y1 - y0 + 2 * m); };
  // the lapis band with a gold vine
  g.fillStyle = MN.col.lapis; g.fillRect(x0 - 16, y0 - 16, x1 - x0 + 32, 16); g.fillRect(x0 - 16, y1, x1 - x0 + 32, 16); g.fillRect(x0 - 16, y0, 16, y1 - y0); g.fillRect(x1, y0, 16, y1 - y0);
  g.strokeStyle = MN.col.gold; g.lineWidth = 1.2;
  const vine = (ax, ay, bx, by) => { const L = Math.hypot(bx - ax, by - ay), n = Math.floor(L / 22), ux = (bx - ax) / L, uy = (by - ay) / L; g.beginPath(); for (let i = 0; i <= n * 4; i++) { const s = i / 4 * 22, o = Math.sin(i / 4 * Math.PI) * 3.5; const px = ax + ux * s - uy * o, py = ay + uy * s + ux * o; i ? g.lineTo(px, py) : g.moveTo(px, py); } g.stroke(); for (let i = 0; i < n; i++) { const s = i * 22 + 11, px = ax + ux * s, py = ay + uy * s; g.fillStyle = MN.col.gold; g.beginPath(); g.arc(px - uy * 3.5 * (i % 2 ? 1 : -1), py + ux * 3.5 * (i % 2 ? 1 : -1), 1.8, 0, TAU); g.fill(); } };
  vine(x0 - 8, y0 - 8, x1 + 8, y0 - 8); vine(x0 - 8, y1 + 8, x1 + 8, y1 + 8); vine(x0 - 8, y0 - 8, x0 - 8, y1 + 8); vine(x1 + 8, y0 - 8, x1 + 8, y1 + 8);
  rect(17, '#141010', 1.6); rect(19.5, '#F6F0E0', 2.4); rect(22, '#141010', 1.4);
  rect(1, MN.col.red, 2.2);
  g.clearRect(x0, y0, x1 - x0, y1 - y0);
  return cv;
}

// The verse: MN.verse = [{ a, b, hi, en, k }]: on the inscription band from a to b. hi is written in by the brush
// across [a, a + (b - a) * k] (k .55); en fades in under it. A line with | breaks there. o: the band's y range.
MN.verse = []; MN.band = { y0: 1258, y1: 1488, fill: '#E9BE47', show: true };
function mnVerseAlpha(t) { let a = 0; for (const v of MN.verse) a = Math.max(a, Math.min(seg(t, v.a - .25, v.a + .2), 1 - seg(t, v.b - .2, v.b + .25))); return a; }
function mnBand(c, t, a = 1) {
  const { y0, y1, fill } = MN.band, { x0, x1 } = MN.win; if (a <= 0) return;
  c.save(); c.globalAlpha = a;
  c.fillStyle = fill; c.fillRect(x0, y0, x1 - x0, y1 - y0);
  const g = c.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, 'rgba(255,240,190,.25)'); g.addColorStop(1, 'rgba(150,90,20,.18)'); c.fillStyle = g; c.fillRect(x0, y0, x1 - x0, y1 - y0);
  c.strokeStyle = '#141010'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y0); c.moveTo(x0, y1); c.lineTo(x1, y1); c.stroke();
  c.strokeStyle = MN.col.red; c.lineWidth = 3; c.beginPath(); c.moveTo(x0, y0 + 5); c.lineTo(x1, y0 + 5); c.moveTo(x0, y1 - 5); c.lineTo(x1, y1 - 5); c.stroke();
  c.restore();
}
function mnVerse(c, t) {
  const live = MN.verse.filter(v => t > v.a - .3 && t < v.b + .3);
  const a = mnVerseAlpha(t);
  if (MN.band.show) mnBand(c, t, Math.max(a, MN.band.hold ? 1 - seg(t, MN.band.hideAfter ?? 1e9, (MN.band.hideAfter ?? 1e9) + .6) : 0));
  for (const v of live) {
    const vis = Math.min(seg(t, v.a - .25, v.a + .2), 1 - seg(t, v.b - .2, v.b + .25)); if (vis <= 0) continue;
    const cx = (MN.win.x0 + MN.win.x1) / 2, { y0, y1 } = MN.band, hiL = v.hi.split('|').map(s => s.trim()), enL = (v.en || '').split('|').map(s => s.trim()).filter(Boolean);
    const hs = v.hs ?? (hiL.length > 1 ? 50 : 56), es = v.es ?? 37, gap = 10;
    const tot = hiL.length * hs * 1.18 + gap + enL.length * es * 1.15, ty = (y0 + y1) / 2 - tot / 2;
    const k = v.k ?? .55, wr = v.instant ? 1 : seg(t, v.a, v.a + (v.b - v.a) * k);
    c.save(); c.globalAlpha = vis; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.font = `${hs}px ${MN.devFont}`;
    const widths = hiL.map(s => c.measureText(s).width), totW = widths.reduce((x, y) => x + y, 0);
    let acc = 0;
    hiL.forEach((s, i) => {
      const y = ty + (i + .5) * hs * 1.18, w = widths[i], from = acc / totW, to = (acc + w) / totW; acc += w;
      const lk = clamp((wr - from) / (to - from || 1));
      if (lk <= 0) return;
      c.save(); c.beginPath(); c.rect(cx - w / 2 - 10, y - hs, (w + 20) * lk, hs * 2); c.clip();
      c.fillStyle = '#5A1410'; c.fillText(s, cx, y + 1.5); c.fillStyle = v.col || '#8E1F18'; c.fillText(s, cx, y);
      c.restore();
    });
    c.font = `italic 600 ${es}px ${MN.enFont}`; c.fillStyle = '#18224A'; c.globalAlpha = v.instant ? vis : vis * seg(t, v.a + (v.b - v.a) * k * .5, v.a + (v.b - v.a) * k * .5 + .6);
    enL.forEach((s, i) => { c.fillText(s, cx, ty + hiL.length * hs * 1.18 + gap + (i + .5) * es * 1.15); });
    c.restore();
  }
}

LOOK.finish = (c, t) => {
  if (!MN_PAPER) { MN_PAPER = mnMakePaper(); MN_MOTTLE = mnMakeMottle(); MN_FOLIO = mnMakeFolio(); }
  const { x0, y0, x1, y1 } = MN.win;
  // gouache: the flat pigment isn't quite flat
  c.save(); c.beginPath(); c.rect(x0, y0, x1 - x0, y1 - y0); c.clip();
  blit(c, MN_MOTTLE, MN.mottle, 'overlay');
  c.restore();
  if (!MN.noFolio) c.drawImage(MN_FOLIO, 0, 0);
  if (MN.before) MN.before(c, t);
  mnVerse(c, t);
  if (MN.after) MN.after(c, t);
  blit(c, MN_PAPER, MN.paper, 'multiply');
};
