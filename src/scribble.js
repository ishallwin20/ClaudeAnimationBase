// scribble.js: the Scribble style's engine, over cine.js (see SCRIBBLE_GUIDE.md). A character is drawn as a clean,
// shaded DESIGN (canvas shapes and gradients), then redrawn as hundreds of thin hair-strokes: each takes its colour from
// the design under it and runs along the form (the contour near an edge, a flow angle inside), with a soft underpaint
// beneath, loose hairs fraying the edges and a few dark ink loops wandering round the outline. Crisp features (closed
// eyes, nostrils, a tilak) are inked last with a jittered double line. Every part is baked in SC.variants versions with
// different seeds and stepped SC.boil times a second, so the lines boil like a hand-drawn loop. The parts are sprites:
// a scene moves, scales and turns them every frame (the breath) while the drawing boils.
//
//   scPart(key, box, layers, o) → part; part.at(t) → { cv, x, y } (the variant for time t, at design px x, y)
//   scDraw(c, part, t, o)        lays a part down; o: { ax, ay (pivot, design px), sx, sy, rot, dx, dy, alpha }
//   layer = { draw(c), len, w, dens, flow, follow, soft, under, jit, lt, dk, hair, outline, inkCol, ink(c, rnd), seed }
//   scInk(c, pts, w, col, rnd, o) a hand-inked line through pts (two jittered passes); scDot(c, x, y, r, col, rnd)
//
// window.SC_RAW = 1 (or ?design) shows the clean designs.
const SC = { boil: 12, variants: 4, raw: !!window.SC_RAW || location.search.includes('design') };
const scCanvas = (w, h) => { const cv = document.createElement('canvas'); cv.width = Math.ceil(w); cv.height = Math.ceil(h); return cv; };
// a seeded 0..1 random
function scRnd(seed) { let s = (Math.abs(Math.floor(seed * 2654435761)) % 2147483646) + 1; return () => (s = (s * 48271) % 2147483647) / 2147483647; }

const SC_PARTS = new Map();
function scPart(key, box, layers, o = {}) {
  let P = SC_PARTS.get(key);
  if (P) return P;
  const pad = o.pad ?? 40, [bx, by, bw, bh] = box, w = Math.ceil(bw + 2 * pad), h = Math.ceil(bh + 2 * pad);
  P = { key, box, pad, w, h, x: bx - pad, y: by - pad, vars: [], designs: null };
  P.bake = v => {
    if (!P.designs) P.designs = layers.map(L => scDesign(L, P));
    const cv = scCanvas(w, h), c = cv.getContext('2d');
    if (SC.raw) { P.designs.forEach(D => c.drawImage(D.cv, 0, 0)); layers.forEach(L => L.ink && (c.save(), c.translate(-P.x, -P.y), L.ink(c, scRnd(1)), c.restore())); return cv; }
    layers.forEach((L, i) => scScribble(c, L, P.designs[i], P, (o.seed ?? 1) * 1000 + i * 97 + v * 7919));
    return cv;
  };
  P.at = t => {
    const v = SC.raw ? 0 : ((Math.floor(t * SC.boil + 1e-6) % SC.variants) + SC.variants) % SC.variants;
    return { cv: P.vars[v] || (P.vars[v] = P.bake(v)), x: P.x, y: P.y };
  };
  SC_PARTS.set(key, P);
  return P;
}

// the design, its pixels, a blurred alpha (the contour field) and its edge pixels
function scDesign(L, P) {
  const { w, h } = P, cv = scCanvas(w, h), c = cv.getContext('2d', { willReadFrequently: true });
  c.translate(-P.x, -P.y); L.draw(c); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1;
  const D = c.getImageData(0, 0, w, h).data;
  const bcv = scCanvas(w, h), bc = bcv.getContext('2d', { willReadFrequently: true });
  bc.filter = `blur(${L.soft ?? 9}px)`; bc.drawImage(cv, 0, 0);
  const Bd = bc.getImageData(0, 0, w, h).data, B = new Float32Array(w * h), A = new Uint8Array(w * h);
  let area = 0; const edge = [];
  for (let i = 0; i < w * h; i++) { B[i] = Bd[i * 4 + 3] / 255; A[i] = D[i * 4 + 3]; if (A[i] > 128) area++; }
  for (let y = 1; y < h - 1; y += 2) for (let x = 1; x < w - 1; x += 2) {
    const i = y * w + x; if (A[i] > 128 && (A[i - 1] <= 128 || A[i + 1] <= 128 || A[i - w] <= 128 || A[i + w] <= 128)) edge.push(i);
  }
  return { cv, D, B, A, area, edge };
}

// the field at pixel (x, y): the contour's normal (pointing inward) and how strongly the edge is felt
function scField(Dz, w, h, x, y) {
  x = clamp(Math.round(x), 2, w - 3); y = clamp(Math.round(y), 2, h - 3);
  const B = Dz.B, i = y * w + x, gx = (B[i + 2] - B[i - 2]) / 4, gy = (B[i + 2 * w] - B[i - 2 * w]) / 4, m = Math.hypot(gx, gy);
  return { gx, gy, m, a: B[i] };
}

function scScribble(c, L, Dz, P, seed) {
  const { w, h } = P, rnd = scRnd(seed), D = Dz.D;
  const len = L.len ?? 60, lw = L.w ?? 1.6, jit = L.jit ?? .28, curl = L.curl ?? .5, follow = L.follow ?? 1, lt = L.lt ?? .14, dk = L.dk ?? .14;
  // the underpaint: the design, softened, so the strokes have a body to sit in
  c.save(); c.globalAlpha = L.under ?? .5; c.filter = `blur(${L.underBlur ?? 4}px)`; c.drawImage(Dz.cv, 0, 0); c.restore();
  const angleAt = (x, y) => {
    const f = scField(Dz, w, h, x, y), fl = typeof L.flow === 'function' ? L.flow(x + P.x, y + P.y) : (L.flow ?? Math.PI / 2);
    const tan = Math.atan2(f.gx, -f.gy), k = clamp(f.m * 28 * follow);   // near an edge the contour wins
    const vx = (1 - k) * Math.cos(2 * fl) + k * Math.cos(2 * tan), vy = (1 - k) * Math.sin(2 * fl) + k * Math.sin(2 * tan);
    return Math.atan2(vy, vx) / 2;
  };
  const colAt = (x, y, kk = 1) => {
    const i = (clamp(Math.round(y), 0, h - 1) * w + clamp(Math.round(x), 0, w - 1)) * 4;
    let r = D[i], g = D[i + 1], b = D[i + 2];
    const u = rnd(), s = (1 + (rnd() - .5) * jit) * kk;
    r *= s; g *= s; b *= s;
    if (u < lt) { const m = .35 + rnd() * .25; r += (255 - r) * m; g += (250 - g) * m; b += (225 - b) * m; }
    else if (u < lt + dk) { const m = .55 + rnd() * .2; r *= m; g *= m; b *= m * .95; }
    return [r + (rnd() - .5) * 14, g + (rnd() - .5) * 14, b + (rnd() - .5) * 10].map(v => clamp(Math.round(v), 0, 255));
  };
  const stroke = (x, y, ang, L0, wd, col, a) => {
    const dx = Math.cos(ang) * L0 / 2, dy = Math.sin(ang) * L0 / 2, bend = (rnd() - .5) * L0 * curl, nx = -Math.sin(ang) * bend, ny = Math.cos(ang) * bend;
    c.strokeStyle = `rgba(${col[0]},${col[1]},${col[2]},${a})`; c.lineWidth = wd;
    c.beginPath(); c.moveTo(x - dx, y - dy);
    if (rnd() < .35) { c.bezierCurveTo(x - dx * .3 + nx, y - dy * .3 + ny, x + dx * .3 - nx, y + dy * .3 - ny, x + dx, y + dy); }
    else c.quadraticCurveTo(x + nx, y + ny, x + dx, y + dy);
    c.stroke();
  };
  c.save(); c.lineCap = 'round'; c.lineJoin = 'round';
  // the body of strokes
  const n = Math.round(Dz.area * (L.dens ?? 1) / 110);
  for (let k = 0, tries = 0; k < n && tries < n * 30; tries++) {
    const x = rnd() * w, y = rnd() * h, i = Math.floor(y) * w + Math.floor(x);
    if (Dz.A[i] <= 128) continue;
    k++;
    const ang = angleAt(x, y) + (rnd() - .5) * .45, L0 = len * (.45 + rnd() * 1.1);
    stroke(x, y, ang, L0, lw * (.55 + rnd() * .8), colAt(x, y), .5 + rnd() * .45);
  }
  // loose hairs fraying the edge
  const nh = Math.round(Dz.edge.length * (L.hair ?? .5));
  for (let k = 0; k < nh; k++) {
    const i = Dz.edge[Math.floor(rnd() * Dz.edge.length)], x = i % w, y = Math.floor(i / w), f = scField(Dz, w, h, x, y);
    const tan = Math.atan2(f.gx, -f.gy), out = Math.atan2(-f.gy, -f.gx), ang = tan + (rnd() - .5) * .9;
    const L0 = len * (.4 + rnd() * .7), ox = Math.cos(out) * L0 * .18, oy = Math.sin(out) * L0 * .18;
    stroke(x + ox, y + oy, ang, L0, lw * (.45 + rnd() * .5), colAt(x - Math.cos(out) * 4, y - Math.sin(out) * 4), .35 + rnd() * .45);
  }
  // dark ink loops wandering round the outline
  const no = L.outline ?? 6, ink = L.inkCol || '#2B2A22';
  c.strokeStyle = ink;
  for (let k = 0; k < no && Dz.edge.length; k++) {
    const i = Dz.edge[Math.floor(rnd() * Dz.edge.length)];
    let x = i % w, y = Math.floor(i / w), dir = rnd() < .5 ? 1 : -1;
    const steps = 30 + Math.floor(rnd() * 70), drift = (rnd() - .5) * 6;
    c.globalAlpha = .28 + rnd() * .35; c.lineWidth = .8 + rnd() * .9;
    c.beginPath(); c.moveTo(x, y);
    for (let s = 0; s < steps; s++) {
      const f = scField(Dz, w, h, x, y); if (f.m < 1e-4) break;
      const nx = f.gx / f.m, ny = f.gy / f.m;   // inward normal
      x += -ny * dir * 4 + nx * (f.a - .5 + drift * .02) * -10 + (rnd() - .5) * 1.6;
      y += nx * dir * 4 + ny * (f.a - .5 + drift * .02) * -10 + (rnd() - .5) * 1.6;
      c.lineTo(x, y);
    }
    c.stroke();
  }
  c.restore();
  if (L.ink) { c.save(); c.translate(-P.x, -P.y); L.ink(c, rnd); c.restore(); }
}

function scDraw(c, part, t, o = {}) {
  const { cv, x, y } = part.at(t), ax = o.ax ?? x + cv.width / 2, ay = o.ay ?? y + cv.height / 2;
  c.save(); c.globalAlpha *= o.alpha ?? 1;
  c.translate(ax + (o.dx || 0), ay + (o.dy || 0)); if (o.rot) c.rotate(o.rot); c.scale(o.sx ?? 1, o.sy ?? o.sx ?? 1);
  c.drawImage(cv, x - ax, y - ay); c.restore();
}

// a hand-inked line through pts: two passes, each point nudged, slightly different widths
function scInk(c, pts, w, col, rnd, o = {}) {
  const passes = o.passes ?? 2, j = o.jit ?? 1.6;
  c.save(); c.strokeStyle = col; c.lineCap = 'round'; c.lineJoin = 'round';
  for (let p = 0; p < passes; p++) {
    const q = pts.map(([x, y]) => [x + (rnd() - .5) * j * 2, y + (rnd() - .5) * j * 2]);
    c.globalAlpha = (o.alpha ?? .9) * (p ? .75 : 1); c.lineWidth = w * (p ? .6 + rnd() * .3 : 1);
    c.beginPath(); c.moveTo(q[0][0], q[0][1]);
    for (let i = 1; i < q.length - 1; i++) c.quadraticCurveTo(q[i][0], q[i][1], (q[i][0] + q[i + 1][0]) / 2, (q[i][1] + q[i + 1][1]) / 2);
    c.lineTo(q[q.length - 1][0], q[q.length - 1][1]); c.stroke();
  }
  c.restore();
}
// a scribbled dot: a few tiny loops
function scDot(c, x, y, r, col, rnd) {
  c.save(); c.fillStyle = col; c.strokeStyle = col; c.lineWidth = 1.2; c.globalAlpha = .92;
  c.beginPath(); c.ellipse(x + (rnd() - .5), y + (rnd() - .5), r * (.85 + rnd() * .3), r * (1 + rnd() * .35), (rnd() - .5) * .8, 0, TAU); c.fill();
  c.globalAlpha = .5; c.beginPath(); c.ellipse(x + (rnd() - .5) * 1.5, y, r * 1.2, r * 1.3, rnd() * 3, 0, TAU); c.stroke(); c.restore();
}

// a breath word: Kalam, white, a soft dark glow, centred on (x, y). o: { weight, col, glow: [col, blur], alpha,
// wave (px: each letter bobs on its own phase), t, font }
function scWord(c, txt, x, y, size, o = {}) {
  if ((o.alpha ?? 1) <= .005) return;
  c.save(); c.globalAlpha *= o.alpha ?? 1;
  c.font = `${o.weight || 400} ${Math.round(size)}px ${o.font || 'Kalam'}`; c.textAlign = 'left'; c.textBaseline = 'middle';
  const g = o.glow || ['rgba(30,60,80,.35)', 18]; c.shadowColor = g[0]; c.shadowBlur = g[1]; c.fillStyle = o.col || '#FFFFFF';
  if (!o.wave) { c.textAlign = 'center'; c.fillText(txt, x, y); c.restore(); return; }
  const chars = [...txt], ws = chars.map(ch => c.measureText(ch).width), tw = ws.reduce((a, b) => a + b, 0);
  let cx = x - tw / 2;
  chars.forEach((ch, i) => { c.fillText(ch, cx, y + o.wave * Math.sin((o.t || 0) * TAU * 2.2 - i * .7)); cx += ws[i]; });
  c.restore();
}
// anything that drifts (motes), made seamless over a loop of len s: draw(t, w) at t and at t - len, crossfaded
function scLooped(t, len, draw) { const m = ((t % len) + len) % len, u = m / len; draw(m, 1 - u); draw(m - len, u); }
// fireflies on closed paths (whole cycles per loop), blinking: o: { n, seed, box: [x0, y0, x1, y1], r, col, a, len }
function scFireflies(c, t, o) {
  const [x0, y0, x1, y1] = o.box, L = o.len;
  for (let i = 0; i < o.n; i++) {
    const s = i * 7.3 + (o.seed || 0), n1 = 1 + Math.floor(hash(s) * 3), n2 = 1 + Math.floor(hash(s + 1) * 3), nb = 3 + Math.floor(hash(s + 2) * 5);
    const x = lerp(x0, x1, .5 + .45 * Math.sin(TAU * n1 * t / L + hash(s + 3) * TAU)), y = lerp(y0, y1, .5 + .45 * Math.sin(TAU * n2 * t / L + hash(s + 4) * TAU));
    const on = Math.pow(Math.max(0, Math.sin(TAU * nb * t / L + hash(s + 5) * TAU)), 3);
    glow(c, x, y, (o.r || 14) * 2.6, o.col || '#E8FF9A', (o.a ?? .9) * (.15 + .85 * on), 'screen');
    glow(c, x, y, (o.r || 14) * .5, '#FFFFF0', (o.a ?? .9) * on, 'screen');
  }
}
