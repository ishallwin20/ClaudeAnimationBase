// painterly.js: the Painterly style (experiment, branch style/painterly-test). A cinemagraph engine over cine.js: a
// still that looks like a digital painting, made only in code, with a few things moving on top of it.
//
// How a painting is made: the scene draws a DESIGN of each layer (clean canvas shapes with gradients, the way an artist
// blocks in colour), and ptPaint() repaints that design in brush strokes, coarse to fine (after Hertzmann, "Painterly
// rendering with curved brush strokes of multiple sizes", 1998): each brush size only paints where the canvas still
// differs from the design blurred to that size, and every stroke follows the forms (along the edges, across the
// gradient), so big flat areas get a few broad strokes and edges and faces get many small ones.
//
// The paintings are baked once, the first time a frame needs them (seeded, so every render worker paints the same
// picture), and cached. Moving parts (a tail, leaves) are painted as several poses and cycled.
//
//   ptLayer(key, box, design, o)   bake (or fetch) a painted layer. box = [x, y, w, h] in frame px; design(c) draws in
//                                  frame px (it is translated for you). Returns { cv, x, y, w, h, mask }.
//   ptDraw(c, L, alpha, op)        lay a baked layer down where it belongs
//   o: alpha (true: a cut-out; strokes stay inside the design's shape), brushes ([{ r, grid, thresh, len, a, jit }],
//      coarse to fine), fine ([[x, y, r]] frame-px discs that get one more, finer pass: faces, hands), keep
//      ([[x, y, r, a]] discs where the clean design shows back through at a: features that must read), flow (x, y) →
//      angle for strokes in flat areas, seed, rough (px: how far the paint edge of a cut-out wanders).

const PT = { layers: new Map(), ms: 0, raw: location.search.includes('design') };   // ?design: show the unpainted designs
const PT_BRUSHES = [
  { r: 22, grid: 1, thresh: 0, len: 9, a: .9, jit: 10 },
  { r: 11, grid: 1, thresh: 18, len: 10, a: .88, jit: 9 },
  { r: 5.5, grid: 1, thresh: 22, len: 12, a: .85, jit: 8 },
  { r: 2.8, grid: 1, thresh: 26, len: 12, a: .85, jit: 6 },
];

function ptCanvas(w, h) { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; return cv; }
const ptCtx = cv => cv.getContext('2d', { willReadFrequently: true });

function ptLayer(key, box, design, o = {}) {
  let L = PT.layers.get(key); if (L) return L;
  const t0 = performance.now(), [bx, by, bw, bh] = box.map(Math.round);
  const D = ptCanvas(bw, bh), dc = ptCtx(D); dc.translate(-bx, -by); design(dc); dc.setTransform(1, 0, 0, 1, 0, 0);
  const cv = PT.raw ? D : ptPaint(D, { ...o, ox: bx, oy: by });
  let mask = null;
  if (o.alpha) { mask = ptCanvas(bw, bh); mask.getContext('2d').drawImage(D, 0, 0); }
  L = { cv, x: bx, y: by, w: bw, h: bh, mask, design: D };
  PT.layers.set(key, L); PT.ms += performance.now() - t0;
  return L;
}
function ptDraw(c, L, alpha = 1, op = 'source-over') {
  if (alpha <= 0) return;
  c.save(); c.globalAlpha *= alpha; c.globalCompositeOperation = op; c.drawImage(L.cv, L.x, L.y); c.restore();
}

// The painter. D: the design canvas. Returns a new canvas the same size.
function ptPaint(D, o = {}) {
  const w = D.width, h = D.height, rnd = lcg(o.seed || 7), ox = o.ox || 0, oy = o.oy || 0;
  const brushes = o.brushes || PT_BRUSHES, cut = !!o.alpha;
  const out = ptCanvas(w, h), oc = ptCtx(out);
  // underpainting: the design, very blurred (no canvas shows through between the first strokes)
  oc.filter = `blur(${brushes[0].r * .8}px)`; oc.drawImage(D, 0, 0); oc.filter = 'none';
  if (cut) { oc.globalCompositeOperation = 'destination-in'; oc.drawImage(D, 0, 0); oc.globalCompositeOperation = 'source-over'; }
  const flow = o.flow || ((x, y) => Math.PI / 2 + vnoise(x * .004, 3) * 1.2 + vnoise(y * .004, 9) * .8);
  const inFine = (x, y) => (o.fine || []).some(([fx, fy, fr]) => Math.hypot(x + ox - fx, y + oy - fy) < fr);
  const layers = brushes.slice();
  if (o.fine && o.fine.length) layers.push({ r: 1.3, grid: 1, thresh: 16, len: 8, a: .8, jit: 4, only: inFine }, { r: .8, grid: 1, thresh: 14, len: 6, a: .75, jit: 3, only: inFine });

  for (const b of layers) {
    const R = b.r, ref = ptCanvas(w, h), rc = ptCtx(ref);
    rc.filter = `blur(${Math.max(.5, R * .5)}px)`; rc.drawImage(D, 0, 0);
    const Rd = rc.getImageData(0, 0, w, h).data, Pd = oc.getImageData(0, 0, w, h).data;
    const Lu = new Float32Array(w * h);
    for (let i = 0, j = 0; i < Lu.length; i++, j += 4) Lu[i] = Rd[j] * .3 + Rd[j + 1] * .59 + Rd[j + 2] * .11;
    const g = Math.max(1, Math.round(R * (b.grid ?? 1))), cells = [];
    for (let y = 0; y < h; y += g) for (let x = 0; x < w; x += g) cells.push(x, y);
    // shuffle cell order (pairs) so strokes overlap in no visible order
    for (let i = cells.length / 2 - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [cells[2 * i], cells[2 * j]] = [cells[2 * j], cells[2 * i]]; [cells[2 * i + 1], cells[2 * j + 1]] = [cells[2 * j + 1], cells[2 * i + 1]]; }
    const s = Math.max(1, Math.round(R * .5));
    const grad = (x, y) => {
      x = clamp(Math.round(x), s, w - 1 - s); y = clamp(Math.round(y), s, h - 1 - s); const i = y * w + x;
      return [Lu[i + s] - Lu[i - s], Lu[i + s * w] - Lu[i - s * w]];
    };
    const at = (x, y) => (clamp(Math.round(y), 0, h - 1) * w + clamp(Math.round(x), 0, w - 1)) * 4;
    const diff = (A, i, B, k) => Math.abs(A[i] - B[k]) + Math.abs(A[i + 1] - B[k + 1]) + Math.abs(A[i + 2] - B[k + 2]);
    const ns = Math.min(4, g), stepIn = g / ns;
    for (let ci = 0; ci < cells.length; ci += 2) {
      const cx = cells[ci], cy = cells[ci + 1];
      if (b.only && !b.only(cx, cy)) continue;
      // the cell's error and its worst point
      let err = 0, n = 0, best = -1, bx = cx, by = cy;
      for (let yy = 0; yy < ns; yy++) for (let xx = 0; xx < ns; xx++) {
        const px = Math.min(w - 1, cx + (xx + .5) * stepIn | 0), py = Math.min(h - 1, cy + (yy + .5) * stepIn | 0), i = (py * w + px) * 4;
        if (cut && Rd[i + 3] < 140) continue;
        const e = b.thresh === 0 ? 1 : diff(Pd, i, Rd, i) + (cut ? Math.abs(Pd[i + 3] - Rd[i + 3]) : 0);
        err += e; n++; if (e > best) { best = e; bx = px; by = py; }
      }
      if (!n || err / n < b.thresh) continue;
      // the stroke: start colour from the reference, walk along the forms
      const i0 = at(bx, by), j = (rnd() - .5) * b.jit, jr = (rnd() - .5) * b.jit * .35;
      const col = [Rd[i0] + j + jr, Rd[i0 + 1] + j, Rd[i0 + 2] + j - jr].map(v => clamp(Math.round(v), 0, 255));
      const pts = [[bx, by]]; let x = bx, y = by, ldx = 0, ldy = 0;
      for (let k = 1; k < b.len; k++) {
        const [gx, gy] = grad(x, y), mag = Math.hypot(gx, gy);
        let dx = -gy, dy = gx;
        const fa = flow(x + ox, y + oy), m0 = 6, wg = mag / (mag + m0);
        dx = (mag ? dx / mag : 0) * wg + Math.cos(fa) * (1 - wg); dy = (mag ? dy / mag : 0) * wg + Math.sin(fa) * (1 - wg);
        if (k > 1 && dx * ldx + dy * ldy < 0) { dx = -dx; dy = -dy; }
        if (k > 1) { dx = dx * .6 + ldx * .4; dy = dy * .6 + ldy * .4; }
        const dl = Math.hypot(dx, dy) || 1; dx /= dl; dy /= dl;
        x += dx * R * .9; y += dy * R * .9;
        if (x < 0 || y < 0 || x >= w || y >= h) break;
        const i = at(x, y);
        if (cut && Rd[i + 3] < 100) break;
        // stop where the design turns another colour than this stroke
        if (k > 2 && Math.abs(Rd[i] - col[0]) + Math.abs(Rd[i + 1] - col[1]) + Math.abs(Rd[i + 2] - col[2]) > (b.stop ?? 60)) break;
        pts.push([x, y]); ldx = dx; ldy = dy;
      }
      ptStroke(oc, pts, R * (.85 + rnd() * .35), col, b.a, rnd);
    }
  }
  oc.globalAlpha = 1;
  // features that must read: the clean design shows back through, softly, inside discs
  if (o.keep) for (const [kx, ky, kr, ka] of o.keep) {
    const tmp = ptCanvas(w, h), tc = tmp.getContext('2d');
    tc.drawImage(D, 0, 0); tc.globalCompositeOperation = 'destination-in';
    const gr = tc.createRadialGradient(kx - ox, ky - oy, 0, kx - ox, ky - oy, kr); gr.addColorStop(0, `rgba(0,0,0,${ka})`); gr.addColorStop(.6, `rgba(0,0,0,${ka * .7})`); gr.addColorStop(1, 'rgba(0,0,0,0)');
    tc.fillStyle = gr; tc.fillRect(0, 0, w, h); oc.drawImage(tmp, 0, 0);
  }
  // a cut-out keeps the design's shape, with a slightly ragged painted edge
  if (cut) {
    const m = ptCanvas(w, h), mc = m.getContext('2d'), r = o.rough ?? 1.2;
    mc.filter = `blur(${r}px)`; mc.drawImage(D, 0, 0); mc.filter = 'none';
    oc.globalCompositeOperation = 'destination-in'; oc.drawImage(m, 0, 0); oc.globalCompositeOperation = 'source-over';
  }
  return out;
}

// One brush stroke: a body, then a few bristle streaks lighter and darker along it (the dry edge of a real brush).
function ptStroke(c, pts, r, col, a, rnd) {
  const [R, G, B] = col;
  c.lineCap = 'round'; c.lineJoin = 'round';
  const path = () => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); if (pts.length === 1) c.lineTo(pts[0][0] + .1, pts[0][1] + .1); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); };
  c.globalAlpha = a; c.strokeStyle = `rgb(${R},${G},${B})`; c.lineWidth = r * 2; path(); c.stroke();
  if (r < 2.5) { c.globalAlpha = 1; return; }
  // bristles: thin streaks offset across the stroke
  const nb = 2 + (rnd() * 2 | 0);
  for (let k = 0; k < nb; k++) {
    const off = (rnd() - .5) * r * 1.3, d = (rnd() - .5) * 34, lw = r * (.18 + rnd() * .22);
    const q = pts.map((p, i) => { const a2 = pts[Math.max(0, i - 1)], b2 = pts[Math.min(pts.length - 1, i + 1)], dx = b2[0] - a2[0], dy = b2[1] - a2[1], l = Math.hypot(dx, dy) || 1; return [p[0] - dy / l * off, p[1] + dx / l * off]; });
    c.globalAlpha = a * .55; c.strokeStyle = `rgb(${clamp(R + d, 0, 255) | 0},${clamp(G + d, 0, 255) | 0},${clamp(B + d * .8, 0, 255) | 0})`; c.lineWidth = lw;
    c.beginPath(); c.moveTo(q[0][0], q[0][1]); if (q.length === 1) c.lineTo(q[0][0] + .1, q[0][1] + .1); for (let i = 1; i < q.length; i++) c.lineTo(q[i][0], q[i][1]); c.stroke();
  }
  c.globalAlpha = 1;
}

// ---------- light on a cut-out ----------
// ptRim(L, o): a rim-light canvas for a baked cut-out: the edges facing the light (direction dx, dy in px), coloured,
// softened. Lay it with 'screen' or 'lighter' and breathe its alpha. Also returns points along the rim (for sparkles).
function ptRim(L, o = {}) {
  const key = 'rim:' + (o.key || '') + L.x + ',' + L.y; let R = PT.layers.get(key); if (R) return R;
  const w = L.w, h = L.h, m = ptCanvas(w, h), mc = ptCtx(m), dx = o.dx ?? 0, dy = o.dy ?? -6;
  mc.drawImage(L.mask, 0, 0); mc.globalCompositeOperation = 'destination-out'; mc.drawImage(L.mask, -dx, -dy);
  mc.globalCompositeOperation = 'source-in'; mc.fillStyle = o.col || '#FFF1B0'; mc.fillRect(0, 0, w, h);
  const glow = ptCanvas(w, h), gc = glow.getContext('2d');
  gc.filter = `blur(${o.blur ?? 5}px)`; gc.drawImage(m, 0, 0); gc.filter = 'none'; gc.drawImage(m, 0, 0);
  // sparkle seats: rim pixels, thinned
  const d = mc.getImageData(0, 0, w, h).data, pts = [], rnd = lcg(o.seed || 3);
  for (let y = 0; y < h; y += 3) for (let x = 0; x < w; x += 3) if (d[(y * w + x) * 4 + 3] > 120 && rnd() < (o.density ?? .08)) pts.push([x + L.x, y + L.y]);
  R = { cv: glow, x: L.x, y: L.y, w, h, pts }; PT.layers.set(key, R); return R;
}

// A four-point twinkle at (x, y), size r, brightness a (0..1).
function twinkle(c, x, y, r, a, col = '#FFF8D8') {
  if (a <= .01) return;
  const spr = sprite('tw' + col, 64, 64, (g) => {
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, rgba(col, 1)); gr.addColorStop(.15, rgba(col, .7)); gr.addColorStop(.5, rgba(col, .12)); gr.addColorStop(1, rgba(col, 0));
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    g.fillStyle = rgba(col, .9); g.beginPath(); g.moveTo(32, 0); g.quadraticCurveTo(34, 30, 64, 32); g.quadraticCurveTo(34, 34, 32, 64); g.quadraticCurveTo(30, 34, 0, 32); g.quadraticCurveTo(30, 30, 32, 0); g.fill();
  });
  c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = clamp(a); c.drawImage(spr, x - r, y - r, r * 2, r * 2); c.restore();
}

// ---------- lettering ----------
// nameRing(c, cx, cy, rx, ry, a0, a1, word, o): a word repeated along an elliptical arc (radians, canvas angles: -PI/2 is
// up), each copy turned to the curve. o: size, font, col, a, spin (radians/s), t, shimmer (0..1), gap (px between copies).
function nameRing(c, cx, cy, rx, ry, a0, a1, word, o = {}) {
  const size = o.size || 26, font = `${size}px ${o.font || '"Tiro Devanagari Sanskrit"'}`;
  c.save(); c.font = font; c.textAlign = 'center'; c.textBaseline = 'middle';
  const ww = c.measureText(word).width + (o.gap ?? size * .9), circ = (a1 - a0) * (rx + ry) / 2, n = Math.max(1, Math.floor(circ / ww));
  const spin = (o.spin || 0) * (o.t || 0), step = (a1 - a0) / n;
  for (let i = 0; i < n + 1; i++) {
    let ang = a0 + ((i * step + spin) % (a1 - a0) + (a1 - a0)) % (a1 - a0);
    const edge = Math.min(seg(ang, a0, a0 + step * 1.5), 1 - seg(ang, a1 - step * 1.5, a1));
    const x = cx + Math.cos(ang) * rx, y = cy + Math.sin(ang) * ry, tang = Math.atan2(Math.cos(ang) * ry, -Math.sin(ang) * rx);
    const sh = 1 - (o.shimmer ?? .4) * (.5 + .5 * Math.sin((o.t || 0) * 2.1 + i * 1.9 + (o.seed || 0)));
    c.save(); c.translate(x, y); c.rotate(tang); c.globalAlpha = (o.a ?? .6) * sh * edge;
    c.shadowColor = o.glow || 'rgba(255,250,210,.8)'; c.shadowBlur = size * .4;
    c.fillStyle = o.col || '#FFFDF0'; c.fillText(word, 0, 0); c.restore();
  }
  c.restore();
}
