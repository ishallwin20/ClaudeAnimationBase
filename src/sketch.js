// sketch.js: the Sketch style, a loose digital sketch painted over (from the owner's IG reference, Nov 2026): a warm
// paper ground, flat colour with soft shading pulled in from the shadow side, dry streaks along cloth and metal, then a
// loose ink line on top: angular, broken into pieces that overshoot their corners, sometimes doubled; white rim light
// outside the lit edge, flicks of red, a smeared ground with long speed lines. Builds on brushink.js (BI.stroke).
// Every call takes the context first; shapes are point lists in design units. o.u (0..1) draws only part of a line
// (the self-drawing reveal); o.seed + SK.boil vary the line per held frame.
// SK.L is the direction toward the key light (upper left).
const SK = (() => {
  const { cl, rnd, vn, curve } = BI;
  const api = { boil: 0, S: 1 };
  // straight segments resampled every `step` (so BI's Catmull-Rom keeps the corners)
  function lin(P, step = 4, closed = false) {
    const out = [], Q = closed ? [...P, P[0]] : P;
    for (let i = 0; i < Q.length - 1; i++) {
      const [x0, y0] = Q[i], [x1, y1] = Q[i + 1], n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / step));
      for (let j = 0; j < n; j++) out.push([x0 + (x1 - x0) * j / n, y0 + (y1 - y0) * j / n]);
    }
    out.push(Q[Q.length - 1].slice());
    return out;
  }
  // a dense polyline of P: smooth (Catmull-Rom) or angular (o.ang)
  const dense = (P, o = {}) => o.ang ? lin(P, 3, o.closed) : curve(P, !!o.closed, 3).concat(o.closed ? [curve(P, true, 3)[0]] : []);
  function measure(S) { const L = [0]; for (let i = 1; i < S.length; i++) L.push(L[i - 1] + Math.hypot(S[i][0] - S[i - 1][0], S[i][1] - S[i - 1][1])); return L; }
  function sub(S, L, a, b) {   // the stretch of S between arc lengths a and b
    const out = []; for (let i = 0; i < S.length; i++) if (L[i] >= a && L[i] <= b) out.push(S[i]);
    return out;
  }
  // a loose ink line along P, in pieces: o.w width, o.col, o.piece [min,max] length, o.ov overshoot, o.jit lateral
  // wobble, o.dbl the chance a piece is doubled, o.gap the chance of a gap; o.u draws the first fraction only
  function line(c, P, o = {}) {
    const S = dense(P, o), L = measure(S), tot = L[L.length - 1]; if (tot < 2) return;
    const r = rnd((o.seed || 1) * 13.7 + api.boil * 101.3), pc = o.piece || [70, 190], w = (o.w ?? 2.4) * (api.lw ?? .8), col = o.col || '#1A1210';
    const lim = tot * (o.u ?? 1);
    let a = 0;
    while (a < lim) {
      const len = pc[0] + r() * (pc[1] - pc[0]), b = Math.min(lim, a + len);
      let Q = sub(S, L, a, b); a = b >= lim ? lim : b - (r() < .5 ? 4 : -2);   // pieces overlap or leave a hair of a gap
      if (Q.length < 2 || r() < (o.gap ?? 0)) continue;
      const ov = (o.ov ?? 7) * (.4 + r()), j = (o.jit ?? 1.2);
      const e0 = Q[0], e1 = Q[1], z0 = Q[Q.length - 1], z1 = Q[Q.length - 2];
      const t0 = norm(e0[0] - e1[0], e0[1] - e1[1]), t1 = norm(z0[0] - z1[0], z0[1] - z1[1]);
      const off = [(r() - .5) * j * 2, (r() - .5) * j * 2];
      Q = [[e0[0] + t0[0] * ov, e0[1] + t0[1] * ov], ...Q, [z0[0] + t1[0] * ov * (b < lim ? .3 : 1), z0[1] + t1[1] * ov * (b < lim ? .3 : 1)]].map(([x, y]) => [x + off[0], y + off[1]]);
      BI.stroke(c, Q, { w: w * (.7 + r() * .6), a: .18, b: .28, jit: .25, col, seed: r() * 99, step: 1.5 });
      if (r() < (o.stray ?? .14)) {   // a stray construction line run on past the form
        const e = r() < .5 ? [Q[0], t0] : [Q[Q.length - 1], t1], sl = 20 + r() * 70;
        BI.stroke(c, [e[0], [e[0][0] + e[1][0] * sl + (r() - .5) * 8, e[0][1] + e[1][1] * sl + (r() - .5) * 8]], { w: w * .4, a: .05, b: .9, jit: .2, col, seed: r() * 99 });
      }
      if (r() < (o.dbl ?? .3)) BI.stroke(c, Q.map(([x, y]) => [x + (r() - .5) * 5, y + (r() - .5) * 5]), { w: w * .45, a: .3, b: .4, jit: .3, col, seed: r() * 99, step: 1.5 });
    }
  }
  const norm = (x, y) => { const l = Math.hypot(x, y) || 1; return [x / l, y / l]; };
  const tr = (P, dx, dy) => P.map(([x, y]) => [x + dx, y + dy]);
  const pathOf = (P, ang) => ang ? BI.pathL(P) : BI.path(P);
  // flat colour, then the light: a broad soft shade and a crisper shadow plane pulled in from the side away from the
  // light (o.sh; o.d how deep, o.blur), hatching along that plane (o.hatch, 0 for none), warm reflected light just
  // inside the far edge (o.rf), a highlight on the lit side (o.hi); o.inner(c) draws more inside the clip
  function paint(c, P, col, o = {}) {
    const p = pathOf(P, o.ang), Lx = (o.L || api.L)[0], Ly = (o.L || api.L)[1], d = o.d ?? 18, bl = (o.blur ?? 6) * api.S;
    const [x0, y0, x1, y1] = bbox(P), m = d * 1.6 + (o.blur ?? 6) * 4 + 6;
    const band = (dx, dy) => { const q = new Path2D(); q.rect(x0 - m, y0 - m, x1 - x0 + 2 * m, y1 - y0 + 2 * m); q.addPath(pathOf(tr(P, dx, dy), o.ang)); return q; };
    c.save(); c.clip(p); c.fillStyle = col; c.fill(p);
    const edge = (colr, dx, dy, a, b2) => {
      if (!colr) return;
      c.globalAlpha = a; c.filter = b2 > .5 ? `blur(${b2}px)` : 'none'; c.fillStyle = colr; c.fill(band(dx, dy), 'evenodd'); c.filter = 'none'; c.globalAlpha = 1;
    };
    edge(o.sh, Lx * d * 1.7, Ly * d * 1.7, (o.sha ?? .85) * .45, bl * 2.2);   // the broad turn of the form
    edge(o.sh, Lx * d, Ly * d, o.sha ?? .85, bl * .45);                          // the shadow plane, nearly hard
    if (o.sh && (o.hatch ?? 1)) {                                                // hatching in the shadow plane
      c.save(); c.clip(band(Lx * d * 1.3, Ly * d * 1.3), 'evenodd');
      const r = rnd(o.seed || 9), n = Math.round((o.hatch ?? 1) * Math.min(60, (x1 - x0 + y1 - y0) / 7)), ang = Math.atan2(Ly, Lx) + 1.1;
      for (let i = 0; i < n; i++) {
        const cx = x0 + r() * (x1 - x0), cy = y0 + r() * (y1 - y0), h = 8 + r() * 16, dx = Math.cos(ang + (r() - .5) * .3) * h, dy = Math.sin(ang + (r() - .5) * .3) * h;
        BI.stroke(c, [[cx - dx, cy - dy], [cx + dx, cy + dy]], { w: .9 + r() * .8, a: .3, b: .5, jit: .2, col: o.hcol || 'rgba(20,14,26,.45)', seed: i });
      }
      c.restore();
    }
    edge(o.rf, Lx * d * .22, Ly * d * .22, o.rfa ?? .55, bl * .5);
    edge(o.hi, -Lx * d * (o.hk ?? .5), -Ly * d * (o.hk ?? .5), o.hia ?? .75, bl * .5);
    if (o.inner) o.inner(c);
    c.restore();
  }
  // a ribbon of cloth along the centreline P, width w(u) (u 0..1 along it) → its outline
  function ribbon(P, w) {
    const S = curve(P, false, 4), n = S.length, L = [], R = [];
    S.forEach((p, i) => { const a = S[Math.max(0, i - 1)], b = S[Math.min(n - 1, i + 1)], [nx, ny] = norm(-(b[1] - a[1]), b[0] - a[0]), h = w(i / (n - 1)) / 2;
      L.push([p[0] + nx * h, p[1] + ny * h]); R.push([p[0] - nx * h, p[1] - ny * h]); });
    return [...L, ...R.reverse()];
  }
  // dry streaks inside a shape: o.dir [dx,dy] (or o.along: a curve the streaks follow, offset across), colours o.cols
  function streaks(c, P, o = {}) {
    const r = rnd(o.seed || 5), n = o.n || 14, cols = o.cols || ['rgba(255,255,255,.35)'];
    c.save(); c.clip(pathOf(P, o.ang));
    const box = o.box || bbox(P), [x0, y0, x1, y1] = box;
    for (let i = 0; i < n; i++) {
      const col = cols[Math.floor(r() * cols.length)], w = (o.w || 2) * (.5 + r());
      let Q;
      if (o.fan) {   // streaks fanning from a point o.fan toward the far edge o.to (pleats)
        const [fx, fy] = o.fan, u = r(), tx = o.to[0][0] + (o.to[1][0] - o.to[0][0]) * u, ty = o.to[0][1] + (o.to[1][1] - o.to[0][1]) * u;
        const s = .1 + r() * .3, e = .65 + r() * .35, bend = (r() - .5) * (o.bend ?? 20);
        const p0 = [fx + (tx - fx) * s, fy + (ty - fy) * s], p2 = [fx + (tx - fx) * e, fy + (ty - fy) * e];
        const m = [(p0[0] + p2[0]) / 2 + bend, (p0[1] + p2[1]) / 2];
        Q = [p0, m, p2];
      } else {
        const [dx, dy] = norm(...(o.dir || [0, 1])), cx = x0 + r() * (x1 - x0), cy = y0 + r() * (y1 - y0), h = (o.len || 80) * (.5 + r());
        Q = [[cx - dx * h, cy - dy * h], [cx + (r() - .5) * 6, cy + (r() - .5) * 6], [cx + dx * h, cy + dy * h]];
      }
      BI.stroke(c, Q, { w, a: .3, b: .4, jit: .3, col, seed: r() * 99, rough: .2 });
    }
    c.restore();
  }
  const bbox = P => { let a = 1e9, b = 1e9, cc = -1e9, d = -1e9; for (const [x, y] of P) { a = Math.min(a, x); b = Math.min(b, y); cc = Math.max(cc, x); d = Math.max(d, y); } return [a, b, cc, d]; };
  // white rim light: a broken white line just outside part of an edge (P an open curve on the lit side)
  function rim(c, P, o = {}) { line(c, P, { w: o.w ?? 7, col: o.col || 'rgba(252,250,244,.95)', piece: [40, 140], ov: 4, jit: 2.5, dbl: .15, gap: .2, seed: (o.seed || 3) + 50, ang: o.ang, u: o.u }); }
  // a red flick: a fast tapered curve, thick at the start; o.drops a few spots at its end
  function flick(c, P, o = {}) {
    const col = o.col || '#A3161A';
    BI.stroke(c, P, { w: o.w ?? 5, a: .05, b: .8, pb: 1.4, jit: .15, col, seed: o.seed || 1, step: 1.2 });
    if (o.drops) { const e = P[P.length - 1]; BI.spatter(c, e[0], e[1], o.drops, 4, { col, s: 2.2, seed: o.seed || 1 }); }
  }
  // the paper: warm ground, a faint tooth and a soft darker edge
  function paper(c, W, H, o = {}) {
    c.fillStyle = o.col || '#E3D4C0'; c.fillRect(0, 0, W, H);
    const g = c.createRadialGradient(W / 2, H * .45, H * .2, W / 2, H * .5, H * .75);
    g.addColorStop(0, 'rgba(255,248,236,.25)'); g.addColorStop(1, 'rgba(120,90,60,.16)'); c.fillStyle = g; c.fillRect(0, 0, W, H);
    const r = rnd(7); c.fillStyle = 'rgba(90,70,50,.035)';
    for (let i = 0; i < 2600; i++) c.fillRect(r() * W, r() * H, 1 + r() * 2, 1);
  }
  // the ground: a smeared wash under the feet (o.x, o.y, o.w), then long ink speed lines
  function ground(c, o) {
    const { x, y, w } = o, r = rnd(o.seed || 21);
    c.save(); c.filter = `blur(${10 * api.S}px)`;
    for (let i = 0; i < 9; i++) {
      c.globalAlpha = .18 + r() * .2; c.fillStyle = ['#B99363', '#A07A4C', '#8E6A40', '#C9A878'][i % 4];
      c.beginPath(); c.ellipse(x + (r() - .5) * w * .5, y + (r() - .3) * 40, w * (.25 + r() * .3), 10 + r() * 22, (r() - .5) * .06, 0, 7); c.fill();
    }
    c.restore(); c.globalAlpha = 1;
    for (let i = 0; i < 9; i++) {
      const yy = y - 10 + r() * 90, x0 = x - w * (.3 + r() * .6), x1 = x + w * (.2 + r() * .6), sag = (r() - .3) * 14;
      BI.stroke(c, [[x0, yy + (r() - .5) * 30], [(x0 + x1) / 2, yy + sag], [x1, yy - 8 - r() * 30]], { w: 1.2 + r() * 2.2, a: .1, b: .6, jit: .3, col: i % 3 ? '#2A1E16' : '#7A5A3A', seed: i, rough: .15 });
    }
    for (let i = 0; i < 7; i++) {   // light dry streaks in the wash
      const yy = y + r() * 60, x0 = x - w * .5 * r(), x1 = x0 + 80 + r() * 260;
      BI.stroke(c, [[x0, yy], [(x0 + x1) / 2, yy - 3], [x1, yy - 6]], { w: 2 + r() * 3, a: .2, b: .5, col: 'rgba(240,226,200,.7)', seed: i + 40, rough: .3 });
    }
  }
  Object.assign(api, { ribbon, lin, dense, line, paint, streaks, rim, flick, paper, ground, bbox, tr, L: [-.7, -.7] });
  return api;
})();
