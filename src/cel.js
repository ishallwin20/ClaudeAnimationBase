// cel.js: the Cel style (CEL_GUIDE.md). A cel-animated character over a Painterly set, after an Instagram chibi Shiva
// Tandav: flat fills with a cel shade and a lit edge, a navy ink line that varies in weight and boils, drawn fresh every
// frame but HELD ON THREES (10 drawings a second at 30 fps), posed pose-to-pose by a rig with two-bone IK and timed to
// the beat. The set is a Painterly design baked by ptLayer and left unpainted (PT_RAW; see CEL_GUIDE.md on the AI label).
//
//   celShape(c, P, fill, o)    a closed shape through control points P: fill, cel shade, lit edge, ink. o: shade
//                              [col, dx, dy] (the shade band sits on the (dx, dy) side), lt [col, dx, dy] (a lit band on
//                              the side away from (dx, dy)), w (ink px), ink (false: none), dense (P is already a dense
//                              outline: celEll, celTube), n (smoothing samples), boil (0..), over(c) (drawn clipped inside)
//   celEll(x, y, rx, ry, rot)  a dense ellipse outline, for celShape(..., { dense: true }) (or use celOval)
//   celTube(P, Wd)             a dense outline of a tapered tube along P (limbs, a snake), widths Wd per point
//   celLine(c, P, w, o)        an open ink line through P that tapers at its ends. o: col, taper, under (a fill colour
//                              drawn on top, narrower, so the line is an outlined stripe: ash, a thread)
//   celIK(A, T, l1, l2, pref)  two-bone IK: [joint, end] from root A toward target T, the joint bent toward pref
//   celDance(t, keys, o)       the pose at t from a list of key poses, one landing every o.every beats (bpm, offset), held
//                              on threes, with an overshoot as it lands (o.tr: how long the move takes); .land (s since
//                              the last landing), .beatLand (s since the last beat), .lag (the pose a drawing late: hair,
//                              cloth), .prev / .next, .slot, .td (the held time)
//   celMirror(pose)            the pose mirrored left to right
//   celHold(t)                 t snapped to the drawing it falls in

const CEL = { ink: '#151432', w: 5.5, fps: 10, boil: 1, d: 0, n: 0 };
const celHold = (t, fps = CEL.fps) => Math.floor(t * fps + 1e-4) / fps;
// a character starts each frame with celBegin: the drawing index (the boil changes with it) and the part counter (each
// part gets the same seed every frame, so its wobble only changes when the drawing does)
function celBegin(t) { CEL.d = Math.floor(t * CEL.fps + 1e-4); CEL.n = 0; }
const backOut = (x, s = 1.6) => { x = clamp(x) - 1; return 1 + (s + 1) * x * x * x + s * x * x; };
const v2 = {
  add: (a, b) => [a[0] + b[0], a[1] + b[1]], sub: (a, b) => [a[0] - b[0], a[1] - b[1]], mul: (a, k) => [a[0] * k, a[1] * k],
  lerp: (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)], len: a => Math.hypot(a[0], a[1]),
  norm: a => { const l = Math.hypot(a[0], a[1]) || 1; return [a[0] / l, a[1] / l]; }, perp: a => [-a[1], a[0]],
};

// ---------- outlines ----------
function celSmooth(P, n = 6) {   // closed Catmull-Rom
  const m = P.length, out = [];
  for (let i = 0; i < m; i++) {
    const p0 = P[(i - 1 + m) % m], p1 = P[i], p2 = P[(i + 1) % m], p3 = P[(i + 2) % m];
    for (let k = 0; k < n; k++) {
      const u = k / n, u2 = u * u, u3 = u2 * u;
      out.push([0, 1].map(d => .5 * (2 * p1[d] + (p2[d] - p0[d]) * u + (2 * p0[d] - 5 * p1[d] + 4 * p2[d] - p3[d]) * u2 + (3 * p1[d] - p0[d] - 3 * p2[d] + p3[d]) * u3)));
    }
  }
  return out;
}
// the boil: every point drifts by low-frequency noise along the outline's length, re-rolled each drawing
function celWobble(C, seed, amp, closed) {
  if (!amp || C.length < 2) return C;
  const S = [0]; for (let i = 1; i < C.length; i++) S.push(S[i - 1] + Math.hypot(C[i][0] - C[i - 1][0], C[i][1] - C[i - 1][1]));
  const L = S[S.length - 1] + (closed ? Math.hypot(C[0][0] - C[C.length - 1][0], C[0][1] - C[C.length - 1][1]) : 0), base = seed * 7.13 + CEL.d * 3.71;
  const nz = (u, k) => closed ? lerp(vnoise(base + u / 70, k), vnoise(base + (u - L) / 70, k), u / L) : vnoise(base + u / 70, k);
  return C.map(([x, y], i) => [x + nz(S[i], 1) * amp, y + nz(S[i], 2) * amp]);
}
function celPath(C) { const p = new Path2D(); C.forEach(([x, y], i) => i ? p.lineTo(x, y) : p.moveTo(x, y)); p.closePath(); return p; }
// the ink: short segments, each its own weight (pressure), round caps
function celStroke(c, C, w, closed, seed, col = CEL.ink, taper = 0) {
  c.strokeStyle = col; c.lineCap = 'round'; c.lineJoin = 'round';
  const m = C.length, n = closed ? m : m - 1;
  for (let i = 0; i < n; i++) {
    const a = C[i], b = C[(i + 1) % m];
    let k = .78 + .42 * vnoise(i * .21 + seed * 3.3 + CEL.d * 1.9, 5);
    if (taper) k *= lerp(1, .25 + .75 * Math.sin(Math.PI * clamp((i + .5) / n)), taper);
    c.lineWidth = Math.max(.6, w * k); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke();
  }
}

function celShape(c, P, fill, o = {}) {
  const seed = CEL.n++, C0 = o.dense ? P : celSmooth(P, o.n ?? 6);
  const C = celWobble(C0, seed, (o.boil ?? 1) * CEL.boil * 2.2, true), path = celPath(C);
  c.fillStyle = fill; c.fill(path);
  if (o.shade || o.lt) {
    c.save(); c.clip(path);
    const v = o.shade ? [o.shade[1], o.shade[2]] : [0, 0];
    if (o.shade) { c.fillStyle = o.shade[0]; c.fill(path); }
    c.save(); c.translate(-v[0], -v[1]);
    if (o.lt) { c.fillStyle = o.lt[0]; c.fill(path); c.translate(o.lt[1], o.lt[2]); }
    c.fillStyle = fill; c.fill(path); c.restore();
    c.restore();
  }
  if (o.over) { c.save(); c.clip(path); o.over(c, path); c.restore(); }
  if (o.ink !== false) celStroke(c, C, o.w ?? CEL.w, true, seed);
  return C;
}
function celEll(x, y, rx, ry, rot = 0, n = 30) {
  const cs = Math.cos(rot), sn = Math.sin(rot), out = [];
  for (let i = 0; i < n; i++) { const a = i / n * TAU, px = Math.cos(a) * rx, py = Math.sin(a) * ry; out.push([x + px * cs - py * sn, y + px * sn + py * cs]); }
  return out;
}
const celOval = (c, x, y, rx, ry, fill, o = {}) => celShape(c, celEll(x, y, rx, ry, o.rot || 0), fill, { ...o, dense: true });
function celTube(P, Wd) {
  const C = through(P, 8), n = C.length, L = [], R = [];
  const wAt = i => { const u = i / (n - 1) * (Wd.length - 1), j = Math.min(Wd.length - 2, Math.floor(u)); return lerp(Wd[j], Wd[j + 1], u - j) / 2; };
  for (let i = 0; i < n; i++) {
    const a = C[Math.max(0, i - 1)], b = C[Math.min(n - 1, i + 1)], d = v2.norm(v2.sub(b, a)), w = wAt(i);
    L.push([C[i][0] - d[1] * w, C[i][1] + d[0] * w]); R.push([C[i][0] + d[1] * w, C[i][1] - d[0] * w]);
  }
  const cap = (p, from, w, k) => { const out = []; for (let j = 1; j < 6; j++) { const a = from + j / 6 * Math.PI * k; out.push([p[0] + Math.cos(a) * w, p[1] + Math.sin(a) * w]); } return out; };
  // round ends: from the left side round the tip to the right side, then from the right side round the root back
  const aE = Math.atan2(L[n - 1][1] - C[n - 1][1], L[n - 1][0] - C[n - 1][0]), aS = Math.atan2(R[0][1] - C[0][1], R[0][0] - C[0][0]);
  return [...L, ...cap(C[n - 1], aE, wAt(n - 1), -1), ...R.reverse(), ...cap(C[0], aS, wAt(0), -1)];
}
function celLine(c, P, w, o = {}) {
  const seed = CEL.n++, Q = P.length === 2 ? [0, .25, .5, .75, 1].map(k => v2.lerp(P[0], P[1], k)) : through(P, 6);
  const C = celWobble(Q, seed, (o.boil ?? 1) * CEL.boil * 1.4, false);
  celStroke(c, C, w, false, seed, o.col || CEL.ink, o.taper ?? .7);
  if (o.under) celStroke(c, C, w * .55, false, seed + 1, o.under, o.taper ?? .7);
}
// a band across a tube (arm bands, anklets): at fraction f from a to b, w wide, th thick
function celBand(c, a, b, f, w, th, col) {
  const p = v2.lerp(a, b, f), d = v2.norm(v2.sub(b, a)), q = v2.perp(d);
  celShape(c, celTube([v2.add(p, v2.mul(q, -w / 2)), v2.add(p, v2.mul(d, th * .25)), v2.add(p, v2.mul(q, w / 2))], [th, th, th]), col, { dense: true, w: CEL.w * .7 });
}

// ---------- rig ----------
function celIK(A, T, l1, l2, pref = [0, 1]) {
  const dx = T[0] - A[0], dy = T[1] - A[1], d = clamp(Math.hypot(dx, dy), Math.abs(l1 - l2) + 1, l1 + l2 - .5);
  const a = Math.atan2(dy, dx), b = Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1));
  const end = [A[0] + Math.cos(a) * d, A[1] + Math.sin(a) * d], mid = v2.lerp(A, end, .5);
  const j1 = [A[0] + Math.cos(a + b) * l1, A[1] + Math.sin(a + b) * l1], j2 = [A[0] + Math.cos(a - b) * l1, A[1] + Math.sin(a - b) * l1];
  const dot = j => (j[0] - mid[0]) * pref[0] + (j[1] - mid[1]) * pref[1];
  return [dot(j1) >= dot(j2) ? j1 : j2, end];
}
function celMix(A, B, e) {
  const o = {};
  for (const k in B) {
    const a = A[k] ?? B[k], b = B[k];
    o[k] = typeof b === 'number' ? lerp(a, b, e) : Array.isArray(b) && typeof b[0] === 'number' ? b.map((v, i) => lerp(a[i] ?? v, v, e)) : (e < .5 ? a : b);
  }
  return o;
}
function celDance(t, keys, o = {}) {
  const beat = 60 / (o.bpm || PROJECT.bpm), every = o.every || 1, step = beat * every, off = o.offset ?? PROJECT.offset ?? 0, tr = o.tr ?? .3, td = celHold(t, o.fps);
  const k = Math.floor((td - off + tr) / step), kb = off + k * step, n = keys.length, at = i => keys[((i % n) + n) % n];
  const P = celMix(at(k - 1), at(k), backOut(seg(td, kb - tr, kb + .08), o.over ?? 1.5));
  P.lag = celMix(at(k - 1), at(k), backOut(seg(td, kb - tr + .1, kb + .2), 2.2));
  // the beat between key poses: the time since the last beat (celShiva dips and squashes a little on it)
  const bl = td - off - Math.floor((td - off + 1e-4) / beat) * beat;
  return Object.assign(P, { prev: at(k - 1), next: at(k), land: td - kb, beatLand: bl, slot: k, td });
}
// a pose mirrored left to right (swaps the sides, flips x, the lean and the head's tilt)
function celMirror(p) {
  const fx = a => a && [-a[0], a[1]], q = { ...p };
  for (const [l, r] of [['hL', 'hR'], ['eL', 'eR'], ['fL', 'fR'], ['kL', 'kR'], ['handL', 'handR']]) { q[l] = p[r]; q[r] = p[l]; }
  for (const k of ['hip', 'hL', 'hR', 'eL', 'eR', 'fL', 'fR', 'kL', 'kR']) if (q[k]) q[k] = fx(q[k]);
  q.lean = -(p.lean || 0); q.head = -(p.head || 0); if (p.front) q.front = p.front === 'L' ? 'R' : 'L';
  return q;
}
