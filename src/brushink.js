// brushink.js: the Brush Ink look, a comic page inked like a graphic novel (tapered brush lines, spotted blacks, flat
// colour with one shadow tone, feathering, spatter). Unlike the Inked look's ink pass (edges found after the fact),
// every line here is drawn as a line: a filled polygon whose width swells and tapers like a loaded brush.
// All helpers live in BI so the file can load beside cine.js.
const BI = (() => {
  const TAU = Math.PI * 2;
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const hs = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const vn = (x, s = 0) => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return (hs(i + s * 57.3) * (1 - u) + hs(i + 1 + s * 57.3) * u) * 2 - 1; };
  const rnd = seed => { let s = (Math.floor(seed * 9301 + 49297) % 233280) || 1; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
  const ink = '#120D17';
  // BI.warp(x, y) → [x, y], when set, bends every vertex as it is drawn (a head turned on its neck); geometry is built
  // unwarped, so widths and offsets stay right
  const Wp = (x, y) => api.warp ? api.warp(x, y) : [x, y];

  // Catmull-Rom through the points, sampled every ~step units
  function curve(P, closed = false, step = 2) {
    const N = P.length; if (N < 2) return P.slice();
    const g = i => closed ? P[(i + N) % N] : P[cl(i, 0, N - 1)];
    const out = [], segs = closed ? N : N - 1;
    for (let i = 0; i < segs; i++) {
      const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
      const m = Math.max(2, Math.ceil(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / step));
      for (let j = 0; j < m; j++) {
        const t = j / m, t2 = t * t, t3 = t2 * t;
        const f = (a, b, c, d) => .5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
        out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
      }
    }
    if (!closed) out.push(P[N - 1].slice());
    return out;
  }
  function normals(S, closed) {
    const n = S.length;
    return S.map((p, i) => {
      const a = S[closed ? (i - 1 + n) % n : Math.max(0, i - 1)], b = S[closed ? (i + 1) % n : Math.min(n - 1, i + 1)];
      const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
      return [-dy / l, dx / l];
    });
  }
  const area = S => S.reduce((s, p, i) => { const q = S[(i + 1) % S.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0) / 2;
  function path(P, closed = true, step = 2) {
    const S = curve(P, closed, step), d = new Path2D();
    S.forEach(([x, y], i) => { [x, y] = Wp(x, y); i ? d.lineTo(x, y) : d.moveTo(x, y); }); if (closed) d.closePath();
    return d;
  }
  // straight polygon path (no smoothing)
  function pathL(P, closed = true) { const d = new Path2D(); P.forEach(([x, y], i) => { [x, y] = Wp(x, y); i ? d.lineTo(x, y) : d.moveTo(x, y); }); if (closed) d.closePath(); return d; }
  function fill(c, P, col, o = {}) { c.fillStyle = col; c.fill(o.straight ? pathL(P) : path(P, true, o.step || 2)); }
  function clip(c, P, draw, o = {}) { c.save(); c.clip(P instanceof Path2D ? P : o.straight ? pathL(P) : path(P)); draw(); c.restore(); }

  // a brush stroke along P: o.w (full width), o.a / o.b (taper fractions at the start / end), o.jit (pressure wobble),
  // o.wf(u, x, y, nx, ny) a width multiplier, o.col; o.closed for a loop (no tapers)
  function stroke(c, P, o = {}) {
    const closed = !!o.closed, S = curve(P, closed, o.step || 1.6), N = normals(S, closed);
    const L = [0]; for (let i = 1; i < S.length; i++) L.push(L[i - 1] + Math.hypot(S[i][0] - S[i - 1][0], S[i][1] - S[i - 1][1]));
    const tot = L[L.length - 1] || 1, w = o.w ?? 3, a = o.a ?? .25, b = o.b ?? .35, jit = o.jit ?? .12, sd = o.seed ?? 1, mn = o.min ?? 0;
    const lw = [], rw = [];
    S.forEach((p, i) => {
      const u = L[i] / tot;
      let k = 1;
      if (!closed) {
        if (a > 0 && u < a) k *= Math.pow(Math.sin(cl(u / a) * Math.PI / 2), o.pa ?? .7);
        if (b > 0 && u > 1 - b) k *= Math.pow(Math.sin(cl((1 - u) / b) * Math.PI / 2), o.pb ?? .7);
      }
      k *= 1 + jit * vn(L[i] / (o.jl || 14), sd) + (o.rough ?? .07) * vn(L[i] / 2.2, sd + 9);   // pressure, then the dry brush's tooth
      if (o.wf) k *= o.wf(u, p[0], p[1], N[i][0], N[i][1]);
      const hw = Math.max(mn / 2, w * k / 2), sk = o.skew ?? 0;   // skew: more ink on one side of the path
      lw.push([p[0] + N[i][0] * hw * (1 + sk), p[1] + N[i][1] * hw * (1 + sk)]);
      rw.push([p[0] - N[i][0] * hw * (1 - sk), p[1] - N[i][1] * hw * (1 - sk)]);
    });
    const d = new Path2D();
    if (closed) {
      lw.forEach(([x, y], i) => { [x, y] = Wp(x, y); i ? d.lineTo(x, y) : d.moveTo(x, y); }); d.closePath();
      rw.slice().reverse().forEach(([x, y], i) => { [x, y] = Wp(x, y); i ? d.lineTo(x, y) : d.moveTo(x, y); }); d.closePath();
      c.fillStyle = o.col || ink; c.fill(d, 'evenodd');
    } else {
      lw.forEach(([x, y], i) => { [x, y] = Wp(x, y); i ? d.lineTo(x, y) : d.moveTo(x, y); });
      for (let i = rw.length - 1; i >= 0; i--) d.lineTo(...Wp(rw[i][0], rw[i][1]));
      d.closePath(); c.fillStyle = o.col || ink; c.fill(d);
    }
  }
  // the ink outline of a closed shape: heavier where its outward normal faces away from the light (o.sh = shadow dir)
  function outline(c, P, o = {}) {
    const S = curve(P, true, 2), sgn = area(S) > 0 ? -1 : 1, sh = o.sh || [.75, .65], w = o.w ?? 3, h = o.heavy ?? 1.2;
    stroke(c, P, { ...o, closed: true, w, wf: (u, x, y, nx, ny) => .55 + h * Math.max(0, (nx * sh[0] + ny * sh[1]) * sgn) * (o.wfk ?? 1) });
  }
  // feathering: strokes from points on the curve P, along its normal (side ±1), tapering to a point
  function feather(c, P, o = {}) {
    const S = curve(P, false, 1.5), N = normals(S, false), r = rnd(o.seed || 7), n = o.n || 10;
    for (let i = 0; i < n; i++) {
      const u = cl((i + .5 + (r() - .5) * (o.uj ?? .6)) / n, 0, .999), j = Math.floor(u * (S.length - 1));
      const [x, y] = S[j], side = o.side ?? 1, ang = (o.tilt || 0) + (r() - .5) * (o.aj ?? .25);
      let nx = N[j][0] * side, ny = N[j][1] * side; const cs = Math.cos(ang), sn = Math.sin(ang); [nx, ny] = [nx * cs - ny * sn, nx * sn + ny * cs];
      const prof = o.prof ? o.prof(u) : 1, len = (o.len || 20) * prof * (.55 + r() * .45);
      if (len < 2) continue;
      const bend = (o.bend || 0) * len, mx = x + nx * len * .5 - ny * bend, my = y + ny * len * .5 + nx * bend;
      stroke(c, [[x, y], [mx, my], [x + nx * len, y + ny * len]], { w: (o.w || 2.2) * (.7 + .3 * prof), a: o.a ?? .05, b: o.b ?? .85, jit: 0, col: o.col, step: 1 });
    }
  }
  // parallel hatching inside a clip shape
  function hatch(c, clipP, o = {}) {
    const [x0, y0, x1, y1] = o.box, ang = o.ang ?? -.8, gap = o.gap || 7, r = rnd(o.seed || 3);
    const dx = Math.cos(ang), dy = Math.sin(ang), diag = Math.hypot(x1 - x0, y1 - y0), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    clip(c, clipP, () => {
      for (let s = -diag / 2; s < diag / 2; s += gap * (.8 + r() * .4)) {
        const px = cx - dy * s, py = cy + dx * s, h = diag / 2 * (o.lenk || 1);
        stroke(c, [[px - dx * h, py - dy * h], [px + dx * h, py + dy * h]], { w: o.w || 1.6, a: .3, b: .3, jit: .2, col: o.col, seed: s });
      }
    });
  }
  function spatter(c, x, y, R, n, o = {}) {
    const r = rnd(o.seed || 11); c.fillStyle = o.col || ink;
    for (let i = 0; i < n; i++) {
      const a = r() * TAU, d = Math.pow(r(), o.pow ?? .7) * R, s = (o.s || 3) * (.3 + Math.pow(r(), 2.2) * 1.4);
      c.beginPath(); c.ellipse(x + Math.cos(a) * d * (o.sx || 1), y + Math.sin(a) * d * (o.sy || 1), s, s * (.7 + r() * .3), r() * TAU, 0, TAU); c.fill();
    }
  }
  // spiral points (for curls, scrolls): centre, start radius, end radius, turns, start angle, direction ±1
  function spiral(cx, cy, r0, r1, turns, a0 = 0, dir = 1, n = 40) {
    const out = []; for (let i = 0; i <= n; i++) { const u = i / n, r = r0 + (r1 - r0) * u, a = a0 + dir * u * turns * TAU; out.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
    return out;
  }
  const rot = (P, a, cx = 0, cy = 0) => { const c = Math.cos(a), s = Math.sin(a); return P.map(([x, y]) => [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c]); };
  const mir = P => P.map(([x, y]) => [-x, y]);
  const tr = (P, dx, dy, k = 1) => P.map(([x, y]) => [x * k + dx, y * k + dy]);
  const circ = (x, y, rx, ry = rx, a = 0, n = 28) => { const P = []; for (let i = 0; i < n; i++) { const t = i / n * TAU, px = Math.cos(t) * rx, py = Math.sin(t) * ry; P.push([x + px * Math.cos(a) - py * Math.sin(a), y + px * Math.sin(a) + py * Math.cos(a)]); } return P; };
  function disc(c, x, y, r, col) { if (api.warp) { c.fillStyle = col; c.fill(pathL(circ(x, y, r))); return; } c.fillStyle = col; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); }
  function oval(c, x, y, rx, ry, col, a = 0) { if (api.warp) { c.fillStyle = col; c.fill(pathL(circ(x, y, rx, ry, a))); return; } c.fillStyle = col; c.beginPath(); c.ellipse(x, y, rx, ry, a, 0, TAU); c.fill(); }
  // a closed ink ring of an ellipse
  function ring(c, x, y, rx, ry, o = {}) { const P = []; for (let i = 0; i < 24; i++) { const a = i / 24 * TAU; P.push([x + Math.cos(a) * rx, y + Math.sin(a) * ry]); } outline(c, rot(P, o.rot || 0, x, y), o); }
  const api = { TAU, cl, hs, vn, rnd, ink, curve, normals, path, pathL, fill, clip, stroke, outline, feather, hatch, spatter, spiral, rot, mir, tr, disc, oval, ring, circ, warp: null };
  return api;
})();
