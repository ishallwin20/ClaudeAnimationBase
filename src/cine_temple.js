// cine_temple.js: temple architecture for the Cinematic style (src/cine.js): a small axonometric renderer for stone
// solids (boxes, frusta, octagons, sun-lit, with cast shadows on the ground, carved niches and galleries), and the
// Kailasa temple at Ellora (Cave 16) as a model that can be dug and carved from the top down; plus close props.
//   isoCam(o)                     a camera: o = { cx, cy (screen point of the world origin), s (px per metre), th (turn
//                                 about the vertical, rad), el (elevation: how far it looks down, rad) }
//   box / frustum / oct           solids in metres (x across, y into the hill, z up); o = { col, deco, hill, lamp }
//   isoDraw(c, cam, solids, o)    draws them back to front, lit by o.sun (a world direction), o.pal colours, shadows on
//                                 the ground (o.shadow), a lit top edge, niches and galleries (deco), shrubs on hill tops
//   kailasaSolids(o)              the Ellora pit and the temple: o.dig (0..1 how deep the three trenches are), o.cut (the
//                                 level in metres down to which the island has been carved; 33 = not yet, 0 = finished),
//                                 o.galleries (0..1 the arcades in the pit walls), o.front (the front screen wall)
//   ellora(c, o)                  the whole set: the valley floor, the model, shadows, carvers and dust on the cut,
//                                 lamps at night (o.lamps); o = { cam, dig, cut, pal, sun, carvers, t, lamps }
//   TEMPLE_PAL                    palettes: dawn, day, dusk, night, moon
//   elephantFront(c, o)           a stone elephant seen from the front (the plinth's elephants), feet at (0, 0), ~300 tall
//   copperPlate(c, o)             a copper-plate grant: plates on a ring with a seal, engraved lines that catch the light
//   carver(c, o)                  a stone carver in silhouette, side view facing right, kneeling with a mallet and
//                                 chisel (o.swing 0..1), feet at (0, 0), ~420 tall kneeling
//   chiselClose(c, o)             a hand's chisel and mallet on a rock face, close (o.swing, o.chip: 0..1 a chip flying)

// ---------- the camera and the solids ----------
function isoCam(o = {}) {
  const th = o.th ?? .5, el = o.el ?? .62, s = o.s ?? 9, cx = o.cx ?? 540, cy = o.cy ?? 1100;
  const ct = Math.cos(th), st = Math.sin(th), ce = Math.cos(el), se = Math.sin(el);
  const P = (x, y, z) => { const u = x * ct - y * st, d = x * st + y * ct; return [cx + s * u, cy - s * (d * se + z * ce)]; };
  return { P, s, th, el, toCam: [-ce * st, -ce * ct, se] };
}
const rectFp = (x0, x1, y0, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];   // counter-clockwise from above
function mkSolid(b, t, z0, z1, o = {}) {
  const xs = b.concat(t).map(p => p[0]), ys = b.concat(t).map(p => p[1]);
  return { b, t, z0, z1, bb: [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys), z0, z1], ...o };
}
function box(x0, x1, y0, y1, z0, z1, o) { const f = rectFp(x0, x1, y0, y1); return mkSolid(f, f, z0, z1, o); }
function frustum(cx, cy, hx0, hy0, hx1, hy1, z0, z1, o) { return mkSolid(rectFp(cx - hx0, cx + hx0, cy - hy0, cy + hy0), rectFp(cx - hx1, cx + hx1, cy - hy1, cy + hy1), z0, z1, o); }
function oct(cx, cy, r0, r1, z0, z1, o) {
  const fp = (r) => Array.from({ length: 8 }, (_, i) => { const a = (i + .5) / 8 * TAU; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; });
  return mkSolid(fp(r0), fp(r1), z0, z1, o);
}
// the part of a solid between two levels (null if none)
function clipSolid(S, lo, hi) {
  const z0 = Math.max(S.z0, lo), z1 = Math.min(S.z1, hi);
  if (z1 - z0 < 1e-3) return null;
  if (z0 === S.z0 && z1 === S.z1) return S;
  const at = (z) => { const k = (z - S.z0) / (S.z1 - S.z0); return S.b.map((p, i) => [lerp(p[0], S.t[i][0], k), lerp(p[1], S.t[i][1], k)]); };
  return { ...S, b: at(z0), t: at(z1), z0, z1, bb: [S.bb[0], S.bb[1], S.bb[2], S.bb[3], z0, z1] };
}

const TEMPLE_PAL = {
  dawn: { lit: '#FFC688', rock: '#8E6450', dark: '#24161F', top: '#6E5244', ground: '#2E2024', shadow: 'rgba(24,6,20,.55)', edge: '#FFE0B0', shrub: '#2A2018', haze: '#C07850', amb: .16 },
  day: { lit: '#D8B898', rock: '#A08670', dark: '#3A3036', top: '#8A7A5E', ground: '#5A4A40', shadow: 'rgba(20,14,20,.45)', edge: '#FFF0DA', shrub: '#3A3A26', haze: '#C8C0B8', amb: .25 },
  dusk: { lit: '#E8946A', rock: '#9A5A44', dark: '#1E1020', top: '#6A3A34', ground: '#2A1620', shadow: 'rgba(12,4,14,.55)', edge: '#FFC08A', shrub: '#1E1418', haze: '#8A3A3A', amb: .14 },
  night: { lit: '#7A74A0', rock: '#4A4866', dark: '#0C0C18', top: '#2E2E44', ground: '#10101C', shadow: 'rgba(2,2,8,.5)', edge: '#B8C4F0', shrub: '#0C0E16', haze: '#1C1C30', amb: .22 },
  moon: { lit: '#9AAAD0', rock: '#5A6888', dark: '#0E1222', top: '#3A4662', ground: '#141A2A', shadow: 'rgba(2,4,12,.55)', edge: '#DCE6FF', shrub: '#101420', haze: '#26304C', amb: .18 },
};

// draw solids back to front
function isoDraw(c, cam, solids, o = {}) {
  const pal = o.pal || TEMPLE_PAL.dawn, L = norm3(o.sun || [.55, -.4, .73]), tc = cam.toCam, P = cam.P;
  solids = solids.filter(Boolean);
  // shadows on the ground (z = 0): each solid's footprints pushed along the sun, hulled
  if (o.shadow !== false) {
    c.fillStyle = pal.shadow;
    for (const S of solids) {
      if (S.noShadow) continue;
      const pts = [];
      for (const [fp, z] of [[S.b, S.z0], [S.t, S.z1]]) for (const [x, y] of fp) { const k = z / L[2]; pts.push(P(x - L[0] * k, y - L[1] * k, 0)); }
      const h = hull2(pts); c.beginPath(); h.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); c.fill();
    }
  }
  // order: a solid separated from another along an axis is behind it if the camera is on the other's side
  const n = solids.length, before = Array.from({ length: n }, () => []), sr = solids.map(S => screenBox(S, P));
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    const A = sr[i], B = sr[j]; if (A[0] > B[1] || B[0] > A[1] || A[2] > B[3] || B[2] > A[3]) continue;
    const a = solids[i].bb, b = solids[j].bb, e = 1e-3;
    let r = 0;
    for (let k = 0; k < 3 && !r; k++) {
      if (a[2 * k + 1] <= b[2 * k] + e) r = tc[k] > 0 ? 1 : -1;        // a below b on axis k: camera on b's side → a first
      else if (b[2 * k + 1] <= a[2 * k] + e) r = tc[k] > 0 ? -1 : 1;
    }
    if (r === 1) before[j].push(i); else if (r === -1) before[i].push(j);
  }
  const done = new Uint8Array(n), order = [];
  const visit = (i) => { if (done[i]) return; done[i] = 1; for (const j of before[i]) visit(j); order.push(i); };
  for (let i = 0; i < n; i++) visit(i);
  for (const i of order) drawSolid(c, cam, solids[i], pal, L, o);
}
function norm3(v) { const l = Math.hypot(...v) || 1; return v.map(x => x / l); }
function screenBox(S, P) {
  let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
  for (const [fp, z] of [[S.b, S.z0], [S.t, S.z1]]) for (const [x, y] of fp) { const p = P(x, y, z); x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); }
  return [x0, x1, y0, y1];
}
function hull2(pts) {
  pts = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]), lo = [], up = [];
  for (const p of pts) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
  for (const p of pts.reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
  return lo.slice(0, -1).concat(up.slice(0, -1));
}
const shadeCol = (pal, k, col) => mixCol(col?.dark || pal.dark, col?.lit || pal.lit, k);
const rockCol = (pal) => ({ lit: pal.rock, dark: pal.dark });
function drawSolid(c, cam, S, pal, L, o) {
  const P = cam.P, tc = cam.toCam, n = S.b.length, dz = S.z1 - S.z0, col = S.col || (S.hill ? rockCol(pal) : null), amb = pal.amb;
  const night = o.night || 0;
  for (let i = 0; i < n; i++) {
    const b0 = S.b[i], b1 = S.b[(i + 1) % n], t0 = S.t[i], t1 = S.t[(i + 1) % n];
    const ex = b1[0] - b0[0], ey = b1[1] - b0[1], vx = t0[0] - b0[0], vy = t0[1] - b0[1];
    const N = norm3([ey * dz, -ex * dz, ex * vy - ey * vx]);
    if (N[0] * tc[0] + N[1] * tc[1] + N[2] * tc[2] <= 0) continue;
    const k = amb + (1 - amb) * Math.max(0, N[0] * L[0] + N[1] * L[1] + N[2] * L[2]), fc = shadeCol(pal, k, col);
    const q = [P(b0[0], b0[1], S.z0), P(b1[0], b1[1], S.z0), P(t1[0], t1[1], S.z1), P(t0[0], t0[1], S.z1)];
    poly(c, q, fc);
    if (S.deco) for (const d of S.deco) if (!d.n || d.n[0] * N[0] + d.n[1] * N[1] > .6) faceDeco(c, q, Math.hypot(ex, ey), S.z0, S.z1, d, fc, pal, k);
    // the light catching the top edge
    if (k > .45 && o.edges !== false) { c.save(); c.globalAlpha = .35 * (k - .45) / .55; strokePath(c, `M ${q[3][0]} ${q[3][1]} L ${q[2][0]} ${q[2][1]}`, pal.edge, 1.4); c.restore(); }
  }
  // the top
  const kt = amb + (1 - amb) * Math.max(0, L[2]), topCol = S.hill ? mixCol(pal.dark, pal.top, kt * .95) : shadeCol(pal, kt, col);
  const tp = S.t.map(([x, y]) => P(x, y, S.z1));
  poly(c, tp, topCol);
  if (S.hill) shrubs(c, cam, S, pal);
  if (S.work) workFloor(c, cam, S, pal, o);
}
// niches, galleries and bands on a face quad q = [bottom-left, bottom-right, top-right, top-left] (screen), the face
// len metres wide and z0..z1 high. d = { cw, ch (cell size m), inset (0..1 margin), z0, z1 (the part of the wall),
// col (a mix toward dark), arch (rounded tops), band (lines only) }
function faceDeco(c, q, len, z0, z1, d, fc, pal, k) {
  const lo = Math.max(z0, d.z0 ?? z0), hi = Math.min(z1, d.z1 ?? z1); if (hi - lo < .3) return;
  const B = (a, b) => { const x0 = lerp(q[0][0], q[1][0], a), y0 = lerp(q[0][1], q[1][1], a), x1 = lerp(q[3][0], q[2][0], a), y1 = lerp(q[3][1], q[2][1], a); return [lerp(x0, x1, b), lerp(y0, y1, b)]; };
  const zb = (z) => (z - z0) / (z1 - z0);
  const nx = Math.max(1, Math.round(len / (d.cw || 3))), ny = Math.max(1, Math.round((hi - lo) / (d.ch || 3))), m = d.inset ?? .2;
  const dark = mixCol(fc, pal.dark, d.col ?? .55), mx = (d.mx ?? 0) / len;
  if (d.band) { c.save(); c.globalAlpha = .5; for (let j = 0; j <= ny; j++) { const b = zb(lerp(lo, hi, j / ny)), p = B(0, b), r = B(1, b); strokePath(c, `M ${p[0]} ${p[1]} L ${r[0]} ${r[1]}`, dark, 1.4); } c.restore(); return; }
  for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
    const a0 = lerp(mx, 1 - mx, (i + m) / nx), a1 = lerp(mx, 1 - mx, (i + 1 - m) / nx), b0 = zb(lerp(lo, hi, (j + m * .6) / ny)), b1 = zb(lerp(lo, hi, (j + 1 - m) / ny));
    const p = [B(a0, b0), B(a1, b0), B(a1, b1), B(a0, b1)];
    if (d.arch) {
      const top = B((a0 + a1) / 2, b1 + (b1 - b0) * .25);
      c.fillStyle = dark; c.beginPath(); c.moveTo(...p[0]); c.lineTo(...p[1]); c.lineTo(...p[2]); c.quadraticCurveTo(top[0], top[1], ...p[3]); c.closePath(); c.fill();
    } else poly(c, p, dark);
    if (d.fig && (i + j) % 2 === 0) { const f0 = B((a0 + a1) / 2, b0), f1 = B((a0 + a1) / 2, lerp(b0, b1, .72)); limb(c, [f0, [lerp(f0[0], f1[0], .5), lerp(f0[1], f1[1], .5)], f1], [Math.abs(p[1][0] - p[0][0]) * .32, Math.abs(p[1][0] - p[0][0]) * .26, Math.abs(p[1][0] - p[0][0]) * .2], mixCol(fc, pal.lit, .15)); }
  }
}
// scrub on the hill tops: dark blobs scattered over the top face
function shrubs(c, cam, S, pal) {
  const [x0, x1, y0, y1] = S.bb, n = Math.min(500, Math.round((x1 - x0) * (y1 - y0) / 110)), seed = x0 * 1.3 + y0 * .7;
  for (let i = 0; i < n; i++) {
    const x = lerp(x0 + 1, x1 - 1, hash(i * 3.1 + seed)), y = lerp(y0 + 1, y1 - 1, hash(i * 7.3 + seed)), r = (.5 + hash(i * 1.7 + seed) * 1.2) * cam.s, [px, py] = cam.P(x, y, S.z1);
    if (px < -40 || px > W + 40 || py < -40 || py > H + 40) continue;
    ellipse(c, px, py, r, r * .55, rgba(pal.shrub, .18 + hash(i * 9.1 + seed) * .25));
  }
}
// the working floor of the island while it is carved: chips, dust and small carvers (o.carvers, o.t)
function workFloor(c, cam, S, pal, o) {
  if (!o.carvers) return;
  const [x0, x1, y0, y1] = S.bb, t = o.t || 0, n = Math.round(o.carvers * (x1 - x0) * (y1 - y0) / 30);
  for (let i = 0; i < n; i++) {
    const x = lerp(x0 + .8, x1 - .8, hash(i * 2.9 + 4)), y = lerp(y0 + .8, y1 - .8, hash(i * 5.7 + 9)), [px, py] = cam.P(x, y, S.z1), h = 1.7 * cam.s * Math.cos(cam.el);
    const sw = Math.max(0, Math.sin(t * 7 + i * 1.7));
    limb(c, [[px, py], [px + sw * h * .1, py - h * .55], [px + sw * h * .2, py - h * .8]], [h * .2, h * .22, h * .16], '#120A10');
    ellipse(c, px + sw * h * .22, py - h * .95, h * .13, h * .13, '#120A10');
    if (sw > .92) glow(c, px + h * .3, py - h * .1, h * 1.2, '#FFD08A', .7);
  }
}

// ---------- the Kailasa temple at Ellora ----------
// metres: the pit (courtyard) 46 wide (x ±23) and 76 deep (y 6..82) cut 33 down into a hill; the island 32 wide (x ±16),
// y 6..68, carved into the gateway and screen wall, two elephants, two flag pillars, the Nandi mandapa, the bridge,
// the plinth on elephants, the porch, the hall, the side porches, four corner shrines and the Dravidian vimana (32.4 m).
const KH = 33;
function kailasaSolids(o = {}) {
  const dg = Array.isArray(o.dig) ? o.dig : [o.dig ?? 1, o.dig ?? 1, o.dig ?? 1], cut = o.cut ?? 0, gal = o.galleries ?? (cut < KH ? 1 : 0), out = [], bk = o.back ?? 140, om = new Set(o.omit || []);
  const stone = null, warm = { lit: '#F6BE80', dark: '#2C1C26' };
  const wallDeco = gal > .01 ? [{ cw: 4.2, ch: 5, inset: .18, z0: .5, z1: 15.5, arch: true, col: .5 * gal, n: [0, 0] }] : null;
  // the hill round the pit (the deco filter n is set per side so only the faces looking into the pit get galleries)
  if (!om.has('hillL')) out.push(box(-260, -23, 0, bk, 0, KH, { hill: true, deco: wallDeco && [{ ...wallDeco[0], n: [1, 0] }] }));
  if (!om.has('hillR')) out.push(box(23, 260, 0, bk, 0, KH, { hill: true, deco: wallDeco && [{ ...wallDeco[0], n: [-1, 0] }] }));
  if (!om.has('hillB')) out.push(box(-23, 23, 82, bk, 0, KH, { hill: true, deco: wallDeco && [{ ...wallDeco[0], n: [0, -1] }] }));
  // the three trenches, dug down from the top (what is left of the rock in them)
  const tz = dg.map(d => KH * (1 - d));
  const tr = (i) => ({ hill: tz[i] > KH - .01, work: tz[i] <= KH - .01 && dg[i] < .999, col: tz[i] > KH - .01 ? null : { lit: '#C88A5A', dark: '#2A1A20' } });
  if (tz[0] > .01) out.push(box(-23, -16, 6, 82, 0, tz[0], tr(0)));
  if (tz[1] > .01) out.push(box(16, 23, 6, 82, 0, tz[1], tr(1)));
  if (tz[2] > .01) out.push(box(-16, 16, 68, 82, 0, tz[2], tr(2)));
  // the island: raw rock below the cut, the carved temple above it
  if (cut > .01) {
    out.push(box(-16, 16, 6, 68, 0, cut, { work: cut < KH - .01, hill: cut >= KH - .01 }));
    if (!om.has('front')) out.push(box(-23, 23, 0, 6, 0, Math.min(cut, KH), { hill: cut >= KH - .01 }));
  }
  const T = [];
  const fr = { deco: [{ cw: 3.2, ch: 4, inset: .22, arch: true, col: .5 }] };
  // the screen wall and the gateway
  if (!om.has('front')) T.push(box(-23, -7, 0, 6, 0, 9.5, { deco: [{ cw: 3.2, ch: 8, inset: .2, z0: .5, z1: 8.5, arch: true, col: .5, fig: true, n: [0, -1] }] }));
  if (!om.has('front')) T.push(box(7, 23, 0, 6, 0, 9.5, { deco: [{ cw: 3.2, ch: 8, inset: .2, z0: .5, z1: 8.5, arch: true, col: .5, fig: true, n: [0, -1] }] }));
  T.push(box(-7, 7, -1, 7, 0, 12.5, { deco: [{ cw: 4.6, ch: 12.5, inset: .3, z0: 0, z1: 8.5, arch: true, col: .85, n: [0, -1] }, { cw: 2.3, ch: 2, inset: .25, z0: 9, z1: 12.3, col: .45 }] }));
  T.push(frustum(0, 3, 6.4, 3.6, 5.2, 2.6, 12.5, 14.6, fr));
  T.push(box(-4.2, 4.2, 1.2, 4.8, 14.6, 16.4, {}));
  // the courtyard: two elephants, two flag pillars
  for (const s of [-1, 1]) {
    const ex = s * 11, ey = 16;
    T.push(box(ex - 1.1, ex + 1.1, ey - 2, ey + 2, 1.3, 3.8, { col: warm })); for (const [lx, ly] of [[-.75, -1.5], [.75, -1.5], [-.75, 1.5], [.75, 1.5]]) T.push(box(ex + lx - .35, ex + lx + .35, ey + ly - .35, ey + ly + .35, 0, 1.3, { col: warm, noShadow: true }));
    T.push(box(ex - .9, ex + .9, ey - 3.2, ey - 2, 2.2, 4.1, { col: warm })); T.push(box(ex - .25, ex + .25, ey - 3.6, ey - 3.1, .2, 2.4, { col: warm, noShadow: true }));
    const px = s * 11.5, py = 26.6;
    T.push(box(px - .7, px + .7, py - .7, py + .7, 0, 15.2, { deco: [{ cw: 1.4, ch: 3, inset: .15, band: true }] }));
    T.push(frustum(px, py, .8, .8, 1.2, 1.2, 15.2, 16, {})); T.push(box(px - .45, px + .45, py - .45, py + .45, 16, 17.2, {}));
  }
  // the Nandi mandapa on its solid lower storey, the bridge
  T.push(box(-5, 5, 21, 30, 0, 7, { deco: [{ cw: 2.5, ch: 3.5, inset: .25, col: .5, fig: true }] }));
  T.push(box(-5, 5, 21, 30, 7, 12.4, { deco: [{ cw: 2.2, ch: 5.4, inset: .2, col: .7 }] }));
  T.push(frustum(0, 25.5, 5.4, 4.9, 3, 2.6, 12.4, 14.8, fr)); T.push(oct(0, 25.5, 1.4, .3, 14.8, 16, {}));
  T.push(box(-1.8, 1.8, 30, 34, 6.8, 8.2, { noShadow: false }));
  // the plinth (its faces carved with elephants holding it up), porch, hall, side porches
  T.push(box(-14, 14, 34, 68, 0, 8, { deco: [{ cw: 2.6, ch: 3.4, inset: .14, z0: .3, z1: 3.9, arch: true, col: .6, fig: true }, { cw: 3, ch: 4, inset: .2, z0: 4.4, z1: 7.6, col: .45 }] }));
  T.push(box(-5, 5, 33.5, 37, 8, 14, { deco: [{ cw: 2.4, ch: 6, inset: .22, col: .75 }] }));
  T.push(box(-12, 12, 37, 51, 8, 15.4, { deco: [{ cw: 2.8, ch: 7.4, inset: .2, col: .6 }] }));
  T.push(box(-12.4, 12.4, 36.6, 51.4, 15.4, 16.2, {}));
  for (const s of [-1, 1]) T.push(box(s > 0 ? 12 : -14.6, s > 0 ? 14.6 : -12, 41, 47, 8, 13.4, { deco: [{ cw: 2.2, ch: 5.4, inset: .2, col: .7 }] }));
  // four corner shrines on the terrace round the vimana
  for (const [sx, sy] of [[-12, 54], [12, 54], [-12, 65], [12, 65]]) { T.push(box(sx - 1.6, sx + 1.6, sy - 1.6, sy + 1.6, 8, 12, { deco: [{ cw: 1.6, ch: 4, inset: .25, col: .6 }] })); T.push(frustum(sx, sy, 1.8, 1.8, 1, 1, 12, 13.6, {})); T.push(oct(sx, sy, 1.1, .2, 13.6, 14.8, {})); }
  // the vimana: its walls, three tiers of shrines, the neck, the octagonal dome and the finial
  const vy = 59.5;
  T.push(box(-9, 9, 51, 68, 8, 17, { deco: [{ cw: 3, ch: 9, inset: .2, col: .6, fig: true }] }));
  T.push(frustum(0, vy, 8.6, 8.1, 7.8, 7.3, 17, 20, { deco: [{ cw: 2.2, ch: 3, inset: .2, arch: true, col: .55 }] }));
  T.push(frustum(0, vy, 7.2, 6.8, 6.3, 5.9, 20, 23, { deco: [{ cw: 2, ch: 3, inset: .2, arch: true, col: .55 }] }));
  T.push(frustum(0, vy, 5.8, 5.4, 4.8, 4.4, 23, 25.5, { deco: [{ cw: 1.8, ch: 2.5, inset: .2, arch: true, col: .55 }] }));
  T.push(oct(0, vy, 3.4, 3.2, 25.5, 26.8, {}));
  T.push(oct(0, vy, 4.4, 4.7, 26.8, 28.4, { deco: [{ cw: 1.3, ch: 1.6, inset: .2, arch: true, col: .5 }] }));
  T.push(oct(0, vy, 4.7, 3.3, 28.4, 29.8, {}));
  T.push(oct(0, vy, 3.3, 1.2, 29.8, 30.7, {}));
  T.push(oct(0, vy, .9, .7, 30.7, 31.5, { col: { lit: '#FFD890', dark: '#3A2418' } }));
  T.push(oct(0, vy, .7, .08, 31.5, 32.4, { col: { lit: '#FFD890', dark: '#3A2418' } }));
  for (const S of T) { const s = clipSolid(S, cut, 99); if (s) out.push(s); }
  return out;
}
// the valley floor, the model, lamps and dust. o = { cam, dig, cut, galleries, pal, sun, carvers, t, lamps (0..1),
// dust (0..1 a haze of rock dust rising from the cut) }
function ellora(c, o = {}) {
  const cam = o.cam || isoCam(), pal = o.pal || TEMPLE_PAL.dawn, P = cam.P;
  // the valley and the plateau: one big ground plane
  poly(c, [P(-400, -300, 0), P(400, -300, 0), P(400, 400, 0), P(-400, 400, 0)], pal.ground);
  isoDraw(c, cam, kailasaSolids(o), { pal, sun: o.sun, carvers: o.carvers, t: o.t, night: o.night, shadow: o.shadow });
  if (o.lamps) {
    const pts = [[0, -1.2, 2], [-3, -1.2, 1], [3, -1.2, 1], [0, 21, 3], [0, 33.4, 9.5], [-12, 44, 9], [12, 44, 9], [0, 51, 12], [-11.5, 26.6, 17.6], [11.5, 26.6, 17.6], [-9, 34, 1], [9, 34, 1], [-20, 40, 1], [20, 40, 1], [-20, 70, 1], [20, 70, 1], [0, 81.5, 3]];
    pts.forEach(([x, y, z], i) => { const [px, py] = P(x, y, z), f = .8 + .2 * Math.sin((o.t || 0) * 9 + i * 2.1); glow(c, px, py, 26 * cam.s / 9 * f, '#FFB060', .55 * o.lamps); ellipse(c, px, py, 2.4 * cam.s / 9, 3.4 * cam.s / 9, rgba('#FFE8B0', o.lamps)); });
  }
  // the sky over the horizon (the hill's back edge at the centre line): o.sky(c, hy)
  const [, hy0] = P(0, o.back ?? 140, KH);
  if (o.sky) { c.save(); c.beginPath(); c.rect(-W, -H, W * 3, hy0 + H); c.clip(); o.sky(c, hy0); c.restore(); }
  // the far plateau melting into the sky
  if (o.horizon !== false) { const [, hy] = P(0, o.back ?? 140, KH), hl = o.hazeLen ?? 260, hz = o.haze || pal.haze, g = c.createLinearGradient(0, hy - 2, 0, hy + hl); g.addColorStop(0, rgba(hz, o.hazeA ?? .85)); g.addColorStop(1, rgba(hz, 0)); c.fillStyle = g; c.fillRect(-W, hy - 2, W * 3, hl + 2); }
  if (o.dust) { const [px, py] = P(0, 37, o.cut ?? 0); glow(c, px, py - 120, 700 * cam.s / 9, '#E8C098', .22 * o.dust); }
}

// ---------- close props ----------
// A stone elephant from the front: feet at (0, 0), ~300 tall. o: col (stone), lit, k (light 0..1 from the right)
function elephantFront(c, o = {}) {
  const col = o.col || '#5A4640', sh = mixCol(col, '#000', .45), hi = mixCol(col, o.lit || '#FFD0A0', .3);
  // legs (the front pair) and the back pair peeking
  for (const s of [-1, 1]) {
    fillPath(c, `M ${s * 50} 0 L ${s * 50} -110 L ${s * 108} -120 L ${s * 112} 0 Z`, sh);
    fillPath(c, `M ${s * 30} 0 L ${s * 28} -120 L ${s * 92} -126 L ${s * 96} 0 Z`, col);
    ellipse(c, s * 62, -4, 34, 10, sh);
  }
  // body and head
  fillPath(c, 'M -130 -110 C -140 -200 -100 -250 0 -255 C 100 -250 140 -200 130 -110 Z', sh);
  // ears: big fans either side
  for (const s of [-1, 1]) fillPath(c, `M ${s * 50} -250 C ${s * 140} -290 ${s * 175} -220 ${s * 160} -150 C ${s * 150} -110 ${s * 100} -110 ${s * 62} -150 Z`, s > 0 ? col : sh);
  fillPath(c, 'M -62 -150 C -78 -230 -50 -290 0 -292 C 50 -290 78 -230 62 -150 C 50 -120 -50 -120 -62 -150 Z', col);
  inside(c, 'M -62 -150 C -78 -230 -50 -290 0 -292 C 50 -290 78 -230 62 -150 C 50 -120 -50 -120 -62 -150 Z', () => fillPath(c, 'M -80 -300 L -6 -300 C -20 -240 -26 -180 -30 -110 L -80 -110 Z', rgba(sh, .7)));
  // the trunk curling down, the tusks, the eyes, a forehead band
  limb(c, [[0, -170], [4, -110], [-2, -50], [8, -10], [24, -6]], [44, 36, 28, 22, 14], col);
  strokePath(c, 'M -16 -120 L 16 -120 M -14 -90 L 14 -90 M -12 -60 L 12 -60', rgba(sh, .6), 3);
  for (const s of [-1, 1]) { limb(c, [[s * 30, -150], [s * 44, -112], [s * 40, -82]], [16, 12, 5], '#E8D6B8'); ellipse(c, s * 32, -208, 7, 5, '#1A1010'); }
  strokePath(c, 'M -52 -252 Q 0 -270 52 -252', rgba(hi, .8), 6);
}
// A copper-plate grant: two plates on a ring with a round seal, engraved lines. Centre at (0, 0), ~700 wide.
// o: t, shine (0..1 a light sweeping across), lines (how many engraved lines show, 0..1)
function copperPlate(c, o = {}) {
  const t = o.t || 0, sh = o.shine ?? 0;
  for (const [dx, dy, r] of [[34, 30, .05], [0, 0, -.03]]) {
    c.save(); c.translate(dx, dy); c.rotate(r);
    const D = 'M -340 -200 C -346 -150 -348 150 -340 200 C -200 210 200 210 340 200 C 348 150 346 -150 340 -200 C 200 -210 -200 -210 -340 -200 Z';
    const g = c.createLinearGradient(-340, -200, 340, 200); g.addColorStop(0, '#5A2A16'); g.addColorStop(.5, '#A0582E'); g.addColorStop(1, '#4A2212');
    c.fillStyle = g; c.fill(new Path2D(D));
    inside(c, D, () => {
      // patina and wear
      for (let i = 0; i < 26; i++) ellipse(c, -340 + hash(i * 3.1) * 680, -200 + hash(i * 5.3) * 400, 20 + hash(i) * 60, 10 + hash(i * 2) * 30, rgba(hash(i * 7) > .5 ? '#2E5A4A' : '#3A1A0C', .16));
      // engraved lines of script: rows of short marks with a headline over each
      const rows = 9, lit = o.lines ?? 1;
      for (let j = 0; j < rows; j++) {
        const y = -160 + j * 38, w = 560 * Math.min(1, Math.max(0, lit * rows - j));
        if (w <= 0) continue;
        strokePath(c, `M -280 ${y - 12} L ${-280 + w} ${y - 12}`, 'rgba(30,10,4,.75)', 2.5);
        for (let x = -280; x < -280 + w; x += 14 + hash(x + j * 31) * 10) { const h = 10 + hash(x * 1.3 + j) * 10; strokePath(c, `M ${x} ${y - 12} L ${x + (hash(x + j) - .5) * 8} ${y - 12 + h}`, 'rgba(30,10,4,.7)', 2.2); if (hash(x * 2.1 + j) > .6) strokePath(c, `M ${x - 4} ${y - 2} q 6 6 12 0`, 'rgba(30,10,4,.6)', 2); }
      }
      // the light sweeping across
      if (sh > 0) { const x = lerp(-600, 600, sh), g2 = c.createLinearGradient(x - 160, -200, x + 160, 200); g2.addColorStop(0, 'rgba(255,200,140,0)'); g2.addColorStop(.5, 'rgba(255,214,160,.45)'); g2.addColorStop(1, 'rgba(255,200,140,0)'); c.fillStyle = g2; c.fillRect(-360, -220, 720, 440); }
    });
    // the ring hole
    ellipse(c, 0, -176, 14, 14, '#1A0C06');
    c.restore();
  }
  // the ring and the seal (a round seal with a seated figure, worn)
  strokePath(c, 'M -10 -176 C -40 -260 40 -260 10 -176', '#7A4020', 12);
  ellipse(c, 0, -262, 58, 54, '#6A3418'); ellipse(c, 0, -262, 46, 42, '#8A4A24');
  limb(c, [[0, -236], [0, -262], [0, -282]], [26, 22, 14], '#5A2A14'); ellipse(c, 0, -292, 10, 10, '#5A2A14');
  limb(c, [[-22, -258], [0, -270], [22, -258]], [8, 10, 8], '#5A2A14');
  glow(c, 0, -262, 90, '#FFB070', .12 + .2 * sh);
}
// A stone carver, kneeling, side view facing right, in silhouette: feet at (0, 0). o: col, swing (0..1, 1 = the mallet
// up), lean
function carver(c, o = {}) {
  const col = o.col || '#0C0608', sw = o.swing ?? 0;
  // the kneeling legs, the torso leaning in, the head with a cloth tied round it
  limb(c, [[-110, 0], [-30, -10], [40, -6]], [44, 46, 30], col);                 // the shin on the ground
  limb(c, [[-110, -10], [-80, -120], [-30, -160]], [56, 64, 70], col);           // the thigh, back to the hip
  limb(c, [[-60, -150], [-20, -260], [20, -330]], [80, 84, 66], col);            // the torso
  ellipse(c, 44, -372, 40, 44, col); fillPath(c, 'M 6 -392 C 20 -428 70 -428 84 -392 C 70 -404 20 -404 6 -392 Z', col); limb(c, [[10, -392], [-30, -380], [-50, -350]], [20, 14, 8], col);
  // the chisel arm (left, reaching down to the rock) and the mallet arm swinging
  limb(c, [[20, -300], [90, -230], [150, -170]], [34, 28, 24], col); ellipse(c, 158, -164, 20, 18, col);
  limb(c, [[150, -164], [200, -120]], [10, 8], '#2A1A14');
  const a = lerp(.3, -1.5, sw), ex = 10 + Math.cos(a - .6) * 110, ey = -310 + Math.sin(a - .6) * 110, hx = ex + Math.cos(a + .5) * 100, hy = ey + Math.sin(a + .5) * 100;
  limb(c, [[0, -310], [ex, ey], [hx, hy]], [34, 28, 22], col);
  const mx = hx + Math.cos(a + 1.6) * 60, my = hy + Math.sin(a + 1.6) * 60;
  limb(c, [[hx, hy], [mx, my]], [10, 10], col); ellipse(c, mx, my, 26, 20, col, a + 1.6);
}
// A chisel and mallet on a rock face, close (the hand's grip in silhouette), the chisel tip at (0, 0) pointing left.
// o: swing (0 = struck, 1 = raised), chip (0..1 a chip breaking off and falling), col, lit
function chiselClose(c, o = {}) {
  const sw = o.swing ?? 0, col = o.col || '#0E080A', lit = o.lit || '#FFB070';
  // the chisel: an iron bar from the tip back up to the fist
  const D = 'M 0 -6 L 26 -16 L 420 -40 L 430 -8 L 34 10 L 0 6 Z';
  fillPath(c, D, '#2A2A30'); strokePath(c, 'M 30 -12 L 420 -36', rgba(lit, .5), 3);
  // the fist round it
  fillPath(c, 'M 300 -90 C 360 -110 440 -90 450 -30 C 460 30 420 70 360 64 C 310 60 280 30 284 -20 C 286 -60 290 -80 300 -90 Z', col);
  for (let i = 0; i < 4; i++) strokePath(c, `M ${306 + i * 30} -84 C ${300 + i * 30} -40 ${300 + i * 30} 10 ${312 + i * 30} 50`, rgba(lit, .18), 2);
  limb(c, [[440, -10], [560, 40], [700, 80]], [110, 120, 130], col);
  // the mallet coming down on the chisel's head
  const a = lerp(0, -1.1, sw), hx = 440 + Math.cos(a - 1.4) * 10, hy = -40;
  c.save(); c.translate(hx, hy); c.rotate(a);
  fillPath(c, 'M -60 -140 L 60 -140 L 64 -20 L -64 -20 Z', '#3A2418'); strokePath(c, 'M -58 -136 L 58 -136', rgba(lit, .45), 3);
  limb(c, [[0, -140], [40, -330], [80, -520]], [26, 24, 22], '#2A180E');
  c.restore();
  // the chip
  const k = o.chip ?? 0;
  if (k > 0) { const x = -40 - k * 120, y = 10 + k * k * 900; c.save(); c.translate(x, y); c.rotate(k * 6); fillPath(c, 'M -30 -20 L 22 -26 L 34 10 L -6 28 L -34 8 Z', '#3A2A2A'); strokePath(c, 'M -30 -20 L 22 -26', rgba(lit, .5), 2); c.restore(); }
}
