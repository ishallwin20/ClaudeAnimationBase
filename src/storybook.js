// storybook.js: the Storybook style, a flat picture-book look on top of cine.js (load it after cine.js). Flat shapes
// with no outlines and gently uneven edges, soft brush mottling inside them, dry-brush marks (fur, feathers,
// whiskers, swooshes), dot eyes with a glint, rosy cheeks, bouncy brush lettering, paper grain over everything, and
// a boil: every edge is re-wobbled SB.boil times a second, like a hand-drawn animation. The shots, crossfades,
// pictures, page hooks and render.mjs contract are cine.js's; bloom, vignette and film grain are off.
// See STORYBOOK_GUIDE.md.
const SB = { boil: 10, paper: 1, font: 'Caveat Brush', ink: '#26232B', white: '#FFFDF8' };
LOOK.bloom = 0; LOOK.vignette = 0; LOOK.grain = 0;

// ---------- randomness that boils ----------
// sbRng(key): a random stream for one shape, fixed between boil ticks (SB.boil per second; 0 = no boil). Shapes take
// their key from their own geometry, so a character drawn in local units under a transform keeps its wobble while it
// moves, and only re-wobbles on the tick.
const sbTick = () => SB.boil ? Math.floor(T * SB.boil + 1e-6) : 0;
function sbRng(key) { let s = Math.floor(hash(key * .0137 + sbTick() * 7.31) * 2147483646) + 1; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
const sbKey = (...v) => v.reduce((a, x, i) => a + x * (i * 17.3 + 3.1), 0);

// ---------- shapes ----------
// sbBlob(x, y, rx, ry, o) → points of a closed, gently uneven outline. o: rot, wob (edge wobble, .025), pear (wider
// toward the bottom: .2), top (flatter toward the top: .2), n (points), seed.
function sbBlob(x, y, rx, ry, o = {}) {
  const r = sbRng(o.seed ?? sbKey(x, y, rx, ry, o.rot || 0)), n = o.n || 96, ph = [r() * TAU, r() * TAU, r() * TAU];
  const wb = o.wob ?? .025, rot = o.rot || 0, pear = o.pear || 0, top = o.top || 0, cr = Math.cos(rot), sr = Math.sin(rot), pts = [];
  for (let i = 0; i < n; i++) {
    const a = i / n * TAU, s = Math.sin(a);
    const w = 1 + wb * (Math.sin(a * 2 + ph[0]) * .6 + Math.sin(a * 3 + ph[1]) * .3 + Math.sin(a * 7 + ph[2]) * .15) + (r() - .5) * .006;
    const px = rx * Math.cos(a) * (1 + pear * s) * w, py = ry * s * w * (s < 0 ? 1 - top : 1);
    pts.push([x + px * cr - py * sr, y + px * sr + py * cr]);
  }
  return pts;
}
// sbPoly(pts, o): any closed outline from a few control points (a smooth curve through them), made uneven like a blob
function sbPoly(P, o = {}) {
  const r = sbRng(o.seed ?? sbKey(...P.flat())), out = [], n = o.n || 10, j = o.jit ?? 1.6;
  for (let i = 0; i < P.length; i++) {
    const p0 = P[(i - 1 + P.length) % P.length], p1 = P[i], p2 = P[(i + 1) % P.length], p3 = P[(i + 2) % P.length];
    for (let k = 0; k < n; k++) { const f = k / n; out.push([0, 1].map(d => .5 * (2 * p1[d] + (-p0[d] + p2[d]) * f + (2 * p0[d] - 5 * p1[d] + 4 * p2[d] - p3[d]) * f * f + (-p0[d] + 3 * p1[d] - 3 * p2[d] + p3[d]) * f * f * f) + (r() - .5) * j)); }
  }
  return out;
}
function sbPath(c, pts) { c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); }
// sbShape(c, pts, col, o): a flat fill with a ragged edge and soft brush mottling clipped inside. o: tex (false: none),
// ang (stroke direction of the mottling), shade ([col, angle, from]: a soft second layer toward one side, e.g.
// ['rgba(40,30,60,.2)', .6] darkens toward the lower right), spot ([x, y, r, col]: a soft round patch, a blush or a
// highlight), alpha.
function sbShape(c, pts, col, o = {}) {
  const r = sbRng(o.seed ?? sbKey(pts[0][0], pts[0][1], pts[7 % pts.length][0], pts.length));
  c.save(); if (o.alpha != null) c.globalAlpha *= o.alpha;
  c.fillStyle = col; sbPath(c, pts); c.fill();
  c.globalAlpha *= .45; sbPath(c, pts.map(([x, y]) => [x + (r() - .5) * 5, y + (r() - .5) * 5])); c.fill();
  c.restore();
  if (o.tex === false && !o.shade && !o.spot) return;
  let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; for (const [x, y] of pts) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  c.save(); if (o.alpha != null) c.globalAlpha *= o.alpha; sbPath(c, pts); c.clip();
  if (o.shade) {
    const [sc, ang = .6, from = .5] = o.shade, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, R = Math.hypot(x1 - x0, y1 - y0) / 2, dx = Math.cos(ang) * R, dy = Math.sin(ang) * R;
    const g = c.createLinearGradient(cx - dx, cy - dy, cx + dx, cy + dy); g.addColorStop(0, rgba('#000000', 0)); g.addColorStop(from, rgba('#000000', 0)); g.addColorStop(1, sc);
    c.fillStyle = g; c.fillRect(x0 - 2, y0 - 2, x1 - x0 + 4, y1 - y0 + 4);
  }
  if (o.spot) { const [sx, sy, sr, sc] = o.spot, g = c.createRadialGradient(sx, sy, 0, sx, sy, sr); g.addColorStop(0, sc); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(sx - sr, sy - sr, sr * 2, sr * 2); }
  if (o.tex !== false) {
    const n = Math.min(400, Math.max(12, (x1 - x0) * (y1 - y0) / 900 | 0)), ang = o.ang ?? -.5, ca = Math.cos(ang), sa = Math.sin(ang), k = Math.max(.35, Math.min(1, Math.sqrt((x1 - x0) * (y1 - y0)) / 300));
    c.lineCap = 'round';
    for (let i = 0; i < n; i++) {
      const x = lerp(x0, x1, r()), y = lerp(y0, y1, r()), l = (30 + r() * 70) * k, b = (r() - .5) * 30 * k;
      c.strokeStyle = r() < .5 ? 'rgba(0,0,0,.028)' : 'rgba(255,255,255,.035)'; c.lineWidth = (10 + r() * 22) * k;
      c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + ca * l / 2 - sa * b, y + sa * l / 2 + ca * b, x + ca * l, y + sa * l); c.stroke();
    }
  }
  c.restore();
}
// shorthand: an uneven ellipse, filled
const sbEll = (c, x, y, rx, ry, col, o = {}) => sbShape(c, sbBlob(x, y, rx, ry, o), col, o);
function sbDot(c, x, y, r, col) { c.fillStyle = col; sbPath(c, sbBlob(x, y, r, r, { wob: .08, n: 28 })); c.fill(); }

// ---------- lines and dry brush ----------
// sbCurve(points, n): a smooth line through the points (catmull-rom) with a slight hand tremor, sampled n times
function sbCurve(P, n = 24, trem = 1.5) {
  const r = sbRng(sbKey(...P.flat(), n)), Q = [P[0], ...P, P[P.length - 1]], out = [];
  for (let i = 0; i <= n; i++) {
    const k = i / n * (P.length - 1), j = Math.min(P.length - 2, k | 0), f = k - j, [p0, p1, p2, p3] = [Q[j], Q[j + 1], Q[j + 2], Q[j + 3]];
    const cr = d => .5 * (2 * p1[d] + (-p0[d] + p2[d]) * f + (2 * p0[d] - 5 * p1[d] + 4 * p2[d] - p3[d]) * f * f + (-p0[d] + 3 * p1[d] - 3 * p2[d] + p3[d]) * f * f * f);
    out.push([cr(0) + (r() - .5) * trem, cr(1) + (r() - .5) * trem]);
  }
  return out;
}
// sbLine(c, points, w, col, o): an ink line through the points, tapered at both ends (o.taper 0..1), o.alpha
function sbLine(c, P, w, col, o = {}) {
  const L = sbCurve(P, o.n || Math.max(8, P.length * 8), o.trem ?? 1), tp = o.taper ?? .6;
  c.save(); c.strokeStyle = col; c.lineCap = 'round'; c.lineJoin = 'round'; if (o.alpha != null) c.globalAlpha *= o.alpha;
  for (let i = 1; i < L.length; i++) { const f = i / (L.length - 1), k = 1 - tp * Math.pow(Math.abs(f * 2 - 1), 2); c.lineWidth = w * k; c.beginPath(); c.moveTo(...L[i - 1]); c.lineTo(...L[i]); c.stroke(); }
  c.restore();
}
// sbDry(c, points, w, col, a, bristles): a dry-brush stroke: bristles side by side along the line, with gaps where the
// paint runs out toward the end (white fur and feather marks, whiskers, a tail, the swoosh behind a flier)
function sbDry(c, P, w, col, a = 1, bristles = 9, o = {}) {
  // each bristle is one continuous line, broken where it runs dry, in runs of a few segments so it can fade out
  const L = sbCurve(P, o.n || 24), r = sbRng(sbKey(...P.flat(), w, bristles)), N = L.length - 1, run = o.run || 5;
  const nrm = L.map((p, i) => { const q = L[Math.min(N, i + 1)], m = L[Math.max(0, i - 1)], dx = q[0] - m[0], dy = q[1] - m[1], d = Math.hypot(dx, dy) || 1; return [-dy / d, dx / d]; });
  c.save(); c.strokeStyle = col; c.lineCap = 'butt'; c.lineJoin = 'round';
  for (let b = 0; b < bristles; b++) {
    const off = bristles > 1 ? (b / (bristles - 1) - .5) * w : 0, fade = .55 + r() * .45; c.lineWidth = w / bristles * (1 + r());
    const tip = o.taper ? 1 : 0;
    for (let i0 = 0; i0 < N; i0 += run) {
      const i1 = Math.min(N, i0 + run); c.globalAlpha = a * fade * (1 - (o.fade ?? .5) * i0 / N);
      c.beginPath(); let pen = false;
      for (let i = i0; i <= i1; i++) {
        if (i > i0 && r() < (o.dry ?? .12) * (i / N)) { pen = false; continue; }
        const k = tip ? Math.sin(Math.PI * clamp(i / N * .9 + .05)) : 1, x = L[i][0] + nrm[i][0] * off * k, y = L[i][1] + nrm[i][1] * off * k;
        if (pen) c.lineTo(x, y); else { c.moveTo(x, y); pen = true; }
      }
      c.stroke();
    }
  }
  c.restore();
}
// sbChevrons(c, x, y, n, o): a column of little dry "v" marks (a chicken's chest, a mouse's belly, an owl's breast)
function sbChevrons(c, pts, w, col, a = .85) { for (const [x, y, s = 1] of pts) sbDry(c, [[x - 22 * s, y - 8 * s], [x, y + 8 * s], [x + 22 * s, y - 8 * s]], 11 * s, col, a, 6, { n: 8 }); }

// ---------- faces ----------
// sbEye(c, x, y, r, o): a black dot with a white glint. o: blink (0 open … 1 shut: a closed arc), happy (a ∩ smile
// arc instead), look ([dx, dy] in r units), white (a white ring round the dot, the chicken's eye), col
function sbEye(c, x, y, r, o = {}) {
  const ink = o.col || SB.ink, bl = clamp(o.blink || 0);
  if (o.happy) { sbLine(c, [[x - r * 1.1, y + r * .35], [x, y - r * .55], [x + r * 1.1, y + r * .35]], r * .42, ink, { taper: .3 }); return; }
  if (bl > .6) { sbLine(c, [[x - r * 1.1, y - r * .1], [x, y + r * .45], [x + r * 1.1, y - r * .1]], r * .42, ink, { taper: .3 }); return; }
  const [lx, ly] = o.look || [0, 0];
  if (o.white) sbDot(c, x, y, r * 1.55, SB.white);
  c.save(); c.translate(x + lx * r * .35, y + ly * r * .35); c.scale(1, 1 - bl);
  sbDot(c, 0, 0, r, ink); sbDot(c, -r * .32, -r * .36, r * .3, '#FFFFFF'); c.restore();
}
// sbCheek(c, x, y, r, col): a soft round blush
function sbCheek(c, x, y, r, col = '#F07C86', a = .85) {
  c.save(); const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(col, a)); g.addColorStop(.6, rgba(col, a * .45)); g.addColorStop(1, rgba(col, 0));
  c.fillStyle = g; sbPath(c, sbBlob(x, y, r, r * .85, { wob: .06, n: 32 })); c.fill(); c.restore();
}
// sbMouth(c, x, y, w, kind): 'smile' (a small curve), 'grin' (open, with a pink tongue), 'o' (surprised), 'flat'
function sbMouth(c, x, y, w, kind = 'smile', o = {}) {
  const ink = o.col || SB.ink;
  if (kind === 'smile') sbLine(c, [[x - w / 2, y - w * .12], [x, y + w * .2], [x + w / 2, y - w * .12]], Math.max(3, w * .11), ink, { taper: .5 });
  else if (kind === 'flat') sbLine(c, [[x - w / 2, y], [x + w / 2, y + w * .04]], Math.max(3, w * .1), ink, { taper: .5 });
  else if (kind === 'o') { sbEll(c, x, y, w * .2, w * .26, ink, { tex: false }); }
  else if (kind === 'grin') {
    const P = [[x - w / 2, y - w * .1], [x, y - w * .02], [x + w / 2, y - w * .1], [x + w * .2, y + w * .32], [x - w * .2, y + w * .32]];
    sbShape(c, sbPoly(P, { n: 6, jit: .8 }), ink, { tex: false });
    c.save(); sbPath(c, sbPoly(P, { n: 6, jit: 0 })); c.clip(); sbEll(c, x, y + w * .36, w * .3, w * .18, '#E86A78', { tex: false }); c.restore();
  }
}

// ---------- backgrounds ----------
// sbBg(c, col, o): a flat colour wall; o.speck [n, col] scatters little paint specks, o.seed
function sbBg(c, col, o = {}) {
  c.fillStyle = col; c.fillRect(0, 0, W, H);
  if (o.speck) { const [n, sc] = o.speck, r = lcg(o.seed || 5); for (let i = 0; i < n; i++) sbDot(c, r() * W, (o.y0 ?? 300) + r() * ((o.y1 ?? 1700) - (o.y0 ?? 300)), 2 + r() * 3, sc); }
}
// sbCloud(c, x, y, w, col, a): a soft cloud: overlapping bumps, flat, with a dry white lower edge
function sbCloud(c, x, y, w, col = '#FFFFFF', a = .9) {
  c.save(); c.globalAlpha *= a;
  for (const [dx, dy, r] of [[-.32, .06, .26], [-.08, -.1, .34], [.22, -.02, .3], [.4, .1, .2], [0, .12, .3]]) sbEll(c, x + dx * w, y + dy * w, r * w, r * w * .9, col, { tex: false, wob: .04 });
  c.restore();
}
// sbSwoosh(c, points, w, col, a): a wide dry-brush trail (the nun's flight in the reference): many thin bristles
function sbSwoosh(c, P, w, col = '#FFFFFF', a = .55) { sbDry(c, P, w, col, a, Math.max(10, w / 6 | 0), { n: 40, dry: .2, fade: .6 }); }
// sbGround(c, x0, x1, y, col): a scrubbed patch of ground with specks, under a standing character
function sbGround(c, x0, x1, y, col, o = {}) {
  sbDry(c, [[x0, y], [(x0 + x1) / 2, y + 12], [x1, y - 4]], o.w || 26, col, o.a ?? .7, 12);
  const r = lcg(o.seed || 3); for (let i = 0; i < (o.n ?? 22); i++) sbDot(c, x0 + r() * (x1 - x0), y - 20 + r() * 50, 2 + r() * 3.5, o.speck || col);
}

// ---------- lettering ----------
// sbSay(c, text, x, y, size, o): bouncy brush lettering, centred on (x, y). A | breaks the line; *word* takes o.hi
// (the contrast colour). Each letter gets its own size, case (o.caps: how often a word's first letter is a capital, .45; o.caps2 inside a word, 0: mid-word capitals read badly),
// tilt and baseline, from o.seed, so the same line always looks the same; the boil adds a slight tremble.
// o.age: seconds since it appeared (each word springs in, o.stagger apart); o.col, o.hi, o.lh (line height),
// o.font, o.maxW (each line scaled down to fit), o.shadow (a soft drop shadow colour, for busy backgrounds).
function sbSay(c, txt, x, y, size, o = {}) {
  const lines = txt.split('|').map(l => l.trim()), lh = (o.lh || 1.05) * size, font = o.font || SB.font, rs = lcg(o.seed || 11), rb = sbRng(sbKey(x, y, size));
  let wi = 0;
  c.save(); c.textAlign = 'center'; c.textBaseline = 'alphabetic';
  lines.forEach((ln, li) => {
    const gl = []; let inHi = false;
    for (const w of ln.split(/\s+/)) {
      if (w.startsWith('*')) inHi = true;
      const h = inHi; if (w.endsWith('*')) inHi = false;
      const word = w.replace(/\*/g, ''), wd = { i: wi++, g: [] };
      for (const [ci, ch] of [...word].entries()) {
        const big = /[a-z]/i.test(ch) && rs() < (ci === 0 ? (o.caps ?? .45) : (o.caps2 ?? 0)), s = size * (big ? 1.16 : .93 + rs() * .1), C = big ? ch.toUpperCase() : ch;
        c.font = `${s}px "${font}"`; wd.g.push({ ch: C, s, w: c.measureText(C).width * .95, rot: (rs() - .5) * .13, dy: (rs() - .5) * size * .1, hi: h });
      }
      gl.push(wd);
    }
    c.font = `${size}px "${font}"`; const sp = c.measureText(' ').width * .9;
    let tw = gl.reduce((a, wd) => a + wd.g.reduce((b, q) => b + q.w, 0), 0) + sp * (gl.length - 1);
    const fit = o.maxW && tw > o.maxW ? o.maxW / tw : 1;
    let cx = x - tw * fit / 2; const by = y + (li - (lines.length - 1) / 2) * lh + size * .33;
    for (const wd of gl) {
      const age = o.age == null ? 9 : o.age - wd.i * (o.stagger ?? .07), k = popK(age);
      const ww = wd.g.reduce((b, q) => b + q.w, 0) * fit;
      if (k > .01) {
        c.save(); c.translate(cx + ww / 2, by - size * .3); c.scale(k * fit, k * fit); c.translate(-ww / fit / 2, 0); c.globalAlpha *= clamp(k);
        let gx = 0;
        for (const q of wd.g) {
          c.save(); c.translate(gx + q.w / 2, size * .3 + q.dy); c.rotate(q.rot + (rb() - .5) * .025); c.font = `${q.s}px "${font}"`;
          if (o.shadow) { c.shadowColor = o.shadow; c.shadowBlur = size * .25; c.shadowOffsetY = size * .05; }
          c.fillStyle = q.hi ? (o.hi || SB.ink) : (o.col || SB.white); c.fillText(q.ch, 0, 0); c.restore(); gx += q.w;
        }
        c.restore();
      }
      cx += ww + sp * fit;
    }
  });
  c.restore();
}

// ---------- the end card ----------
// sbCard(c, u, t, o): the Rishi Katha call-to-action card in this style: a peach page, the logo, a lettered title, the
// three covers, the price line, the rishikatha.com pill, "Follow @therishikatha". o: title, line, price, note, books,
// bg, deco(c, u, t) to draw a character on the card.
function sbCard(c, u, t, o = {}) {
  sbBg(c, o.bg || '#FBE0CF', { speck: [30, 'rgba(241,90,36,.25)'], seed: 9 });
  sbCloud(c, 120, 330, 330, '#FFFFFF', .55); sbCloud(c, 980, 1640, 380, '#FFFFFF', .55);
  const X = 470, pk = d => u - d, br = Math.sin(t * 1.3) * .008, books = o.books || ['book1', 'book3', 'book2'];
  picture(c, PICS.logo, X, 500, 128, 128, { pop: pk(.15), r: 64 });
  if (o.title) sbSay(c, o.title, X, 640, 92, { col: '#2E5F5A', hi: '#F15A24', age: pk(.3), seed: 21, maxW: 860 });
  if (o.line) text(c, o.line, X, 735, '500 38px Poppins', '#2E5F5A', { pop: pk(.55), maxW: 840 });
  books.forEach((b, j) => { const i = [-1, 1, 0][j] ?? 0; picture(c, PICS[b], X + i * 215, 975 + Math.abs(i) * 30, 270, 270, { rot: i * .1 + br, pop: pk(.7 + j * .12), r: 10, shadow: 22 }); });
  if (o.price) text(c, o.price, X, 1238, '700 54px Poppins', '#2E5F5A', { pop: pk(1.25), maxW: 860 });
  if (o.note) text(c, o.note, X, 1302, '500 34px Poppins', '#F15A24', { pop: pk(1.45), maxW: 860 });
  const k = popK(pk(1.65)) * (1 + .03 * Math.max(0, Math.sin(t * 5)));
  if (k > .01) { c.save(); c.translate(X, 1395); c.scale(k, k); sbShape(c, sbPoly([[-220, -44], [220, -44], [226, 44], [-224, 42]].map(([x, y]) => [x, y]), { n: 8, jit: 1 }), '#F15A24', { tex: false }); c.restore(); }
  text(c, 'rishikatha.com', X, 1398, '700 52px Poppins', '#FFFFFF', { pop: pk(1.65) });
  text(c, 'Follow @therishikatha for more!', X, 1482, '500 36px Poppins', '#2E5F5A', { pop: pk(1.95), maxW: 860 });
  if (o.deco) { c.save(); o.deco(c, u, t); c.restore(); }
}

// ---------- the finish: paper grain over everything ----------
let SB_PAPER = null;
function sbPaper() {
  const cv = document.createElement('canvas'); cv.width = cv.height = 512; const q = cv.getContext('2d'), im = q.createImageData(512, 512), r = lcg(7);
  for (let i = 0; i < im.data.length; i += 4) { const v = 228 + r() * 27; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
  q.putImageData(im, 0, 0); return cv;
}
LOOK.finish = (c, t) => {
  if (!SB.paper) return;
  SB_PAPER = SB_PAPER || sbPaper();
  c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = SB.paper; c.globalCompositeOperation = 'multiply';
  c.fillStyle = c.createPattern(SB_PAPER, 'repeat'); c.fillRect(0, 0, W, H);
};
