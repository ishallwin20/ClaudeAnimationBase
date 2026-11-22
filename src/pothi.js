// pothi.js: the Pothi style, a flat devotional illustration on laid paper (after the owner's Ekadashi reference, Nov 2026).
// Every part is one smooth silhouette with no outline; form comes from soft airbrushed shading inside the shape (a dark
// band along the edge away from the light, a pale one toward it), fine gold lines and dots for borders, beads and
// jewellery; muted pigments (a grey-lavender blue for Vishnu's skin, a brick maroon, an ochre silk, slate, cream); slender
// naturalistic figures in profile with understated faces; plain cream paper with laid fibres, a band of teal water,
// botanical sprigs. Needs cine.js (limb, ellipse, glow, rgba, lcg, through, lerp).
//   poPath(P, closed): a smooth path through points ([x, y] or [x, y, 1] for a corner).
//   poFill(c, P, col, o): fill a silhouette. o.sh / o.hi: [dx, dy, blur, col] soft inner shade / light along the edge that
//     faces (dx, dy) (arrays of these for several); o.wash: [[x0, y0, x1, y1], stops]; o.inside(): drawn clipped; o.alpha.
//   poLimb(C, W): a limb's outline (smooth sides, round ends) from a centre line and widths.
//   poLine(c, P, col, w): a fine open line.  poDots(c, P, r, gap, col): beads or gold dots along a curve.
//   poBorder(c, P, w): a gold border band (a darker edge, the gold, a fine light line).
//   poPaper(w, h, seed): the laid-paper sheet (a canvas), cached.  poGrain(w, h): its fibres alone, for an overlay.
//   PO: the palette.
const PO = {
  paper: '#F8F4ED', paperDk: '#E9E2D6',
  skin: { base: '#827F94', lt: '#A3A0B6', dk: '#5E5B74', far: '#6E6B84' },           // Vishnu's blue, as the reference
  maroon: { base: '#8F3B38', lt: '#AC544C', dk: '#62221F' },
  silk: { base: '#C49A52', lt: '#DDB874', dk: '#97702F' },
  gold: { base: '#CFA556', lt: '#EDD08A', dk: '#94702C' },
  slate: { base: '#464753', lt: '#6C6D7A', dk: '#2A2B35', deep: '#1E1F28' },
  cream: { base: '#D8BF9C', lt: '#EEDDC2', dk: '#A98E68' },
  coil: { base: '#323848', lt: '#5A627C', dk: '#1C1F2A' },
  water: { base: '#3A5A68', lt: '#5A7C88', dk: '#294452', foam: '#E8EEEA' },
  leaf: { base: '#5E7444', lt: '#86996A', dk: '#3E5230' },
  lotus: { base: '#A8344E', lt: '#D86A84', dk: '#6E1E36' },
  hair: '#1C1716', garland: '#7E9A68', red: '#B0242E'
};

function poPath(P, closed = true) {
  const p = new Path2D(), n = P.length, g = i => closed ? P[(i + n) % n] : P[Math.max(0, Math.min(n - 1, i))];
  p.moveTo(P[0][0], P[0][1]);
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2), k1 = p1[2] ? 0 : 1 / 6, k2 = p2[2] ? 0 : 1 / 6;
    p.bezierCurveTo(p1[0] + (p2[0] - p0[0]) * k1, p1[1] + (p2[1] - p0[1]) * k1, p2[0] - (p3[0] - p1[0]) * k2, p2[1] - (p3[1] - p1[1]) * k2, p2[0], p2[1]);
  }
  if (closed) p.closePath();
  return p;
}
// a soft band of col inside p along the edge facing (dx, dy): the shape, shifted back by (dx, dy), cut from a sheet, blurred
function poEdge(c, p, dx, dy, blur, col) {
  const k = c.getTransform(), s = Math.hypot(k.a, k.b) || 1;
  c.save(); c.clip(p);
  c.filter = `blur(${Math.max(.5, blur * s)}px)`; c.fillStyle = col;
  const q = new Path2D(); q.rect(-6000, -6000, 14000, 14000); q.addPath(p, new DOMMatrix().translate(-dx, -dy));
  c.fill(q, 'evenodd'); c.restore();
}
function poFill(c, P, col, o = {}) {
  const p = P instanceof Path2D ? P : typeof P === 'string' ? new Path2D(P) : poPath(P);
  c.save(); if (o.alpha != null) c.globalAlpha *= o.alpha;
  c.fillStyle = col; c.fill(p);
  if (o.wash) { const [[x0, y0, x1, y1], st] = o.wash; c.save(); c.clip(p); c.fillStyle = ptLin(c, x0, y0, x1, y1, st); c.fillRect(-6000, -6000, 14000, 14000); c.restore(); }
  const many = v => v ? (Array.isArray(v[0]) ? v : [v]) : [];
  for (const [dx, dy, b, sc] of many(o.sh)) poEdge(c, p, dx, dy, b, sc);
  for (const [dx, dy, b, sc] of many(o.hi)) poEdge(c, p, dx, dy, b, sc);
  if (o.inside) { c.save(); c.clip(p); o.inside(); c.restore(); }
  c.restore();
  return p;
}
function poLine(c, P, col, w, closed = false) { c.save(); c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.lineJoin = 'round'; c.stroke(poPath(P, closed)); c.restore(); }
function poLimb(C, W) {
  const L = [], R = [], n = C.length;
  const dir = i => { const a = C[Math.max(0, i - 1)], b = C[Math.min(n - 1, i + 1)], d = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [(b[0] - a[0]) / d, (b[1] - a[1]) / d]; };
  C.forEach(([x, y], i) => { const [dx, dy] = dir(i), w = W[i] / 2; L.push([x - dy * w, y + dx * w]); R.push([x + dy * w, y - dx * w]); });
  const [ax, ay] = dir(0), [bx, by] = dir(n - 1);
  return [...L, [C[n - 1][0] + bx * W[n - 1] * .42, C[n - 1][1] + by * W[n - 1] * .42], ...R.reverse(), [C[0][0] - ax * W[0] * .42, C[0][1] - ay * W[0] * .42]];
}
// points along a smooth curve, every gap px
function poAlong(P, gap) {
  const C = through(P, 24), out = []; let d = gap;
  for (let i = 0; i < C.length; i++) { if (i) d += Math.hypot(C[i][0] - C[i - 1][0], C[i][1] - C[i - 1][1]); if (d >= gap) { d = 0; out.push(C[i]); } }
  return out;
}
function poDots(c, P, r, gap, col = PO.gold.base, hl = true) {
  for (const [x, y] of poAlong(P, gap)) { ellipse(c, x, y, r, r, col); if (hl && r > 1.6) ellipse(c, x - r * .3, y - r * .3, r * .38, r * .38, 'rgba(255,248,220,.55)'); }
}
function poBorder(c, P, w, col = PO.gold) {
  poLine(c, P, col.dk, w); poLine(c, P, col.base, w * .7); poLine(c, P, rgba(col.lt, .8), Math.max(1, w * .18));
}

// ---------- paper ----------
const PO_PAPER = {};
function poPaper(w, h, seed = 3, base = PO.paper) {
  const key = w + 'x' + h + ':' + seed + base; if (PO_PAPER[key]) return PO_PAPER[key];
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const c = cv.getContext('2d');
  c.fillStyle = base; c.fillRect(0, 0, w, h);
  c.drawImage(poGrain(w, h, seed), 0, 0);
  return PO_PAPER[key] = cv;
}
// laid paper: long faint horizontal ribs, short fibres, a fine tooth; drawn on transparent (light and dark marks)
function poGrain(w, h, seed = 3, k = 1) {
  const key = 'g' + w + 'x' + h + ':' + seed + ':' + k; if (PO_PAPER[key]) return PO_PAPER[key];
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const c = cv.getContext('2d'), R = lcg(seed);
  // the ribs: wavering horizontal bands, a little darker and lighter in turn
  for (let y = 0; y < h; y += 3 + R() * 4) {
    const a = (.018 + R() * .03) * k, dark = R() < .55, ph = R() * 10, amp = 1 + R() * 2;
    c.strokeStyle = dark ? `rgba(120,100,80,${a})` : `rgba(255,255,255,${a * 2.2})`; c.lineWidth = 1 + R() * 2.2;
    c.beginPath(); for (let x = -20; x <= w + 20; x += 40) { const yy = y + Math.sin(x / 140 + ph) * amp; x < 0 ? c.moveTo(x, yy) : c.lineTo(x, yy); } c.stroke();
  }
  // short fibres
  for (let i = 0; i < w * h / 900; i++) {
    const x = R() * w, y = R() * h, l = 6 + R() * 26, a = (R() - .5) * .5, dark = R() < .6;
    c.strokeStyle = dark ? `rgba(110,90,70,${(.04 + R() * .05) * k})` : `rgba(255,255,255,${(.12 + R() * .12) * k})`; c.lineWidth = .8 + R();
    c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); c.stroke();
  }
  // tooth: tiny specks
  for (let i = 0; i < w * h / 160; i++) { c.fillStyle = R() < .5 ? `rgba(90,70,50,${.05 * k})` : `rgba(255,255,255,${.12 * k})`; c.fillRect(R() * w, R() * h, 1.4, 1.4); }
  return PO_PAPER[key] = cv;
}

// ---------- botanical sprigs, water, lotuses (shared props) ----------
// poSprig(c, x, y, len, ang, o): a hanging or rising sprig, a thin stem with paired leaves and, o.buds, small flowers.
//   ang: the stem's direction (radians from straight down), o.sway (radians at the tip), o.leaf, o.bud (colours), o.seed
function poSprig(c, x, y, len, ang = 0, o = {}) {
  const R = lcg(o.seed || 7), n = o.n || 12, sw = o.sway || 0, L = o.leaf || PO.leaf, P = [[x, y]];
  for (let i = 1; i <= n; i++) {
    const u = i / n, a = ang + sw * u * u + Math.sin(u * 5 + (o.seed || 0)) * .12;
    const [px, py] = P[i - 1]; P.push([px - Math.sin(a) * len / n, py + Math.cos(a) * len / n]);
  }
  poLine(c, P, o.stem || '#4A4632', o.w || 3);
  for (let i = 2; i < P.length; i++) {
    const u = i / n, [px, py] = P[i], [qx, qy] = P[i - 1], d = Math.atan2(py - qy, px - qx);
    for (const sd of [-1, 1]) {
      if (R() < .2) continue;
      const ll = (o.leafLen || 26) * (1 - u * .45) * (.8 + R() * .4), la = d + sd * (.7 + R() * .4);
      c.save(); c.translate(px, py); c.rotate(la);
      poFill(c, [[0, 0, 1], [ll * .35, -ll * .2], [ll, 0, 1], [ll * .35, ll * .2]], L.base, { sh: [0, ll * .1, 2, rgba(L.dk, .6)], hi: [0, -ll * .1, 2, rgba(L.lt, .6)] });
      c.restore();
      if (o.buds && R() < .5) { const bx = px + Math.cos(la) * ll * .5, by = py + Math.sin(la) * ll * .5; for (let k = 0; k < 3; k++) ellipse(c, bx + (R() - .5) * 8, by + (R() - .5) * 8, 3 + R() * 1.5, 2.6 + R(), o.bud || '#6A5A9A'); }
    }
  }
  return P;
}
// a lotus seen side on: crimson petals, a paler heart; open 0 (bud) .. 1
function poLotus(c, x, y, r, open = 1, col = PO.lotus) {
  c.save(); c.translate(x, y);
  const pet = (a, l, w, cl) => { c.save(); c.rotate(a); poFill(c, [[0, 0, 1], [-w, -l * .45], [0, -l, 1], [w, -l * .45]], cl.base, { sh: [w * .4, 0, w * .5, rgba(cl.dk, .7)], hi: [-w * .4, -l * .1, w * .4, rgba(cl.lt, .6)] }); c.restore(); };
  const o = .25 + .75 * open;
  for (const a of [-1.25, 1.25]) pet(a * o, r * .9, r * .28, col);
  for (const a of [-.8, .8]) pet(a * o, r * 1.0, r * .3, col);
  for (const a of [-.38, .38]) pet(a * o, r * 1.06, r * .3, col);
  if (open > .4) { ellipse(c, 0, -r * .18, r * .22, r * .1, PO.gold.base); for (let i = 0; i < 7; i++) ellipse(c, (i - 3) * r * .06, -r * .27, 1.6, 3.4, PO.gold.lt); }
  pet(0, r * 1.02, r * .3, col);
  c.restore();
}
// a lotus pad, side on: a flat ellipse with its notch and veins, darker beneath
function poPad(c, x, y, rx, ry, rot = 0) {
  c.save(); c.translate(x, y); c.rotate(rot);
  const P = []; for (let i = 0; i <= 30; i++) { const a = .12 + i / 30 * (TAU - .24); P.push([Math.cos(a) * rx, Math.sin(a) * ry]); } P.push([0, 0, 1]);
  poFill(c, P, PO.leaf.base, { sh: [0, ry * .5, ry * .4, rgba(PO.leaf.dk, .8)], hi: [0, -ry * .4, ry * .5, rgba(PO.leaf.lt, .6)],
    inside: () => { for (let k = 0; k < 9; k++) { const a = .5 + k / 8 * (TAU - 1); poLine(c, [[0, 0], [Math.cos(a) * rx * .9, Math.sin(a) * ry * .9]], rgba(PO.leaf.dk, .35), 1.4); } } });
  c.restore();
}

// poWater(c, y, t, o): a band of still teal water from y down: a gently wavy top edge, pale crest lines drifting, darker
//   with depth. o.len (the loop, for whole cycles), o.w (width), o.h (depth), o.alpha. Returns the top edge's y at x.
function poWater(c, y, t, o = {}) {
  const w = o.w || W, h = o.h || 600, L = o.len || 15, ph = t / L * TAU, Wc = PO.water;
  const edge = x => y + Math.sin(x / 90 + ph) * 3 + Math.sin(x / 37 - ph * 2) * 1.5;
  const P = []; for (let x = -20; x <= w + 20; x += 20) P.push([x, edge(x)]);
  P.push([w + 20, y + h, 1], [-20, y + h, 1]);
  c.save(); if (o.alpha != null) c.globalAlpha *= o.alpha;
  poFill(c, P, Wc.base, { wash: [[0, y, 0, y + h], [[0, rgba(Wc.lt, .9)], [.25, rgba(Wc.base, 0)], [1, rgba(Wc.dk, .9)]]],
    inside: () => {
      poLine(c, P.slice(0, -2).map(([x, yy]) => [x, yy + 4]), rgba(Wc.foam, .55), 3);
      // crest lines: short pale strokes in rows, drifting slowly sideways (two copies crossfaded over the loop)
      for (const [dt, k] of [[0, 1 - t / L], [-L, t / L]]) {
        const tt = t + dt, R = lcg(29);
        for (let i = 0; i < 44; i++) {
          const yy = y + 26 + Math.pow(R(), 1.2) * (h - 60), sp = 6 + R() * 10, len = 30 + R() * 70;
          const x = ((R() * (w + 200) + tt * sp) % (w + 200) + w + 200) % (w + 200) - 100;
          c.globalAlpha = (.18 + R() * .3) * k * (1 - (yy - y) / h * .6);
          poLine(c, [[x - len / 2, yy + 2], [x, yy - 2], [x + len / 2, yy + 2]], Wc.foam, 2.2);
        }
      }
      c.globalAlpha = 1;
    } });
  c.restore();
  return edge;
}
