// comic.js: comic pages on the Cinematic engine (cine.js). A page is a 4:5 "swipe page" (1080 × 1350 design units,
// rendered at PROJECT.w × PROJECT.h, normally 2160 × 2700). The words are NOT drawn here: tools/comic.mjs letters the
// pages as live text (balloons, caption boxes, sound effects) over the art this page renders.
//
// The data: COMIC (comics/<slug>/comic.js): { slug, pages: { <n>: { bg, panels: [{ r: [x, y, w, h], art, ...words }] } } }.
// The art: ART[name] = (c, P) => { ... } draws one panel in panel units: (0, 0) is the panel's top-left, P.w × P.h its
// size, P.t the time (pages are stills: P.t is the page number + .5), P.ink true in the Inked look.
// Page n is rendered at t = n + .5 (render.mjs --stills=11.5,12.5 → out/<dir>/t11_50.png), as tools/book.mjs does.
//
// Two looks (window.COMIC_LOOK, set by the studio page before this file):
//   'cine' (A) the Cinematic style as it is: film light, soft gradients, bloom, a vignette per panel, grain.
//   'ink'  (B) Inked: the same drawings with ink outlines (figure edges in ink, plus edges found in the picture),
//          flat cel bands instead of gradients, halftone dots in the shadows, no bloom or grain; night is lifted
//          (gamma) first, since flat bands crush dark gradients to black.
const CK = {
  look: window.COMIC_LOOK || 'cine', DW: 1080, DH: 1350,
  bg: '#060509', ink: '#0B0810', paper: '#F1E7D2',
};
CK.ink_ = CK.look === 'ink';
CK.s = W / CK.DW;                               // device px per design unit
const ART = {};

// Lighting presets in device pixels (figure() works in device px): scale a LIGHTS entry for the page resolution, and
// in the Inked look turn its light edge into an ink outline.
function lit(L, o = {}) {
  const k = CK.s * (o.k ?? 1), r = L.rim ? { ...L.rim, dx: L.rim.dx * k, dy: L.rim.dy * k, blur: (L.rim.blur || 0) * k } : undefined;
  const e = L.edge ? { ...L.edge, w: L.edge.w * k } : undefined;
  if (CK.ink_) return { ...L, rim: r, edge: { col: CK.ink, w: (o.inkW ?? 2.6) * k, a: .95 } };
  return { ...L, rim: r, edge: e };
}

// ---------- the Inked pass ----------
// inkPass(c, x, y, w, h): on the device pixels of one panel: edges found on a half-size, blurred luminance (Sobel) laid
// down as ink; the luminance quantised into flat bands (hue kept); halftone dots in the shadows.
function inkPass(c, x, y, w, h, o = {}) {
  x = Math.round(x); y = Math.round(y); w = Math.round(w); h = Math.round(h);
  const id = c.getImageData(x, y, w, h), d = id.data, n = w * h;
  const hw = w >> 1, hh = h >> 1, Lh = new Float32Array(hw * hh), Lb = new Float32Array(hw * hh), E = new Float32Array(hw * hh);
  const lum = i => (d[i] * .299 + d[i + 1] * .587 + d[i + 2] * .114) / 255;
  for (let j = 0; j < hh; j++) for (let i = 0; i < hw; i++) {
    const p = ((j * 2) * w + i * 2) * 4;
    Lh[j * hw + i] = (lum(p) + lum(p + 4) + lum(p + w * 4) + lum(p + w * 4 + 4)) / 4;
  }
  for (let j = 1; j < hh - 1; j++) for (let i = 1; i < hw - 1; i++) {   // 3×3 box blur
    let s = 0; for (let b = -1; b <= 1; b++) for (let a = -1; a <= 1; a++) s += Lh[(j + b) * hw + i + a]; Lb[j * hw + i] = s / 9;
  }
  const t0 = o.edge0 ?? .08, t1 = o.edge1 ?? .2;
  for (let j = 1; j < hh - 1; j++) for (let i = 1; i < hw - 1; i++) {
    const L = (a, b) => Lb[(j + b) * hw + i + a];
    const gx = -L(-1, -1) - 2 * L(-1, 0) - L(-1, 1) + L(1, -1) + 2 * L(1, 0) + L(1, 1);
    const gy = -L(-1, -1) - 2 * L(0, -1) - L(1, -1) + L(-1, 1) + 2 * L(0, 1) + L(1, 1);
    const m = Math.hypot(gx, gy) / (.5 + Lb[j * hw + i]);   // relative contrast: edges read in the darks too
    E[j * hw + i] = clamp((m - t0) / (t1 - t0));
  }
  const [ir, ig, ib] = rgbOf(CK.ink), gam = o.gamma ?? .72, bands = o.bands ?? 5, P = (o.dot ?? 7) * CK.s / 2, ht = o.halftone ?? .26, sat = o.sat ?? 1.18;
  const ca = Math.cos(Math.PI / 4), sa = Math.sin(Math.PI / 4);
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const p = (j * w + i) * 4; let r = d[p], g = d[p + 1], b = d[p + 2];
    const L0 = (r * .299 + g * .587 + b * .114) / 255, L = Math.pow(L0, gam), lift = L0 > .002 ? L / L0 : 0;
    r *= lift; g *= lift; b *= lift;
    // flat bands: the luminance stepped, the hue kept
    const f = L * bands, k0 = Math.floor(f), fr = f - k0, step = (k0 + clamp((fr - .44) / .12)) / bands, q = Math.max(step, .035), m = L > .004 ? q / L : 0;
    r *= m; g *= m; b *= m;
    const gr = (r + g + b) / 3; r = gr + (r - gr) * sat; g = gr + (g - gr) * sat; b = gr + (b - gr) * sat;
    // halftone in the shadows: dots on a 45° grid, bigger as it darkens
    if (L < ht && L > .02) {
      const u = (i * ca + j * sa) / P, v = (-i * sa + j * ca) / P, du = u - Math.round(u), dv = v - Math.round(v);
      const rad = .5 * Math.sqrt(1 - L / ht) * 1.1;
      if (du * du + dv * dv < rad * rad) { r = lerp(r, ir, .7); g = lerp(g, ig, .7); b = lerp(b, ib, .7); }
    }
    // ink (bilinear from the half-size edge map)
    const ex = Math.min(hw - 2, i / 2), ey = Math.min(hh - 2, j / 2), xi = ex | 0, yi = ey | 0, fx = ex - xi, fy = ey - yi;
    const e = lerp(lerp(E[yi * hw + xi], E[yi * hw + xi + 1], fx), lerp(E[(yi + 1) * hw + xi], E[(yi + 1) * hw + xi + 1], fx), fy);
    if (e > 0) { const a = Math.min(1, e * 1.25); r = lerp(r, ir, a); g = lerp(g, ig, a); b = lerp(b, ib, a); }
    d[p] = r; d[p + 1] = g; d[p + 2] = b;
  }
  c.putImageData(id, x, y);
}

// ---------- a page ----------
function panelVignette(c, w, h, a) {
  const g = c.createRadialGradient(w / 2, h / 2, Math.min(w, h) * .3, w / 2, h / 2, Math.hypot(w, h) * .62);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${a})`); c.fillStyle = g; c.fillRect(0, 0, w, h);
}
function drawPage(c, n, t) {
  const pg = COMIC.pages[n]; if (!pg) return;
  c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = pg.bg || CK.bg; c.fillRect(0, 0, W, H);
  for (const pn of pg.panels) {
    const [x, y, w, h] = pn.r, draw = ART[pn.art];
    c.save(); c.setTransform(CK.s, 0, 0, CK.s, x * CK.s, y * CK.s);
    c.beginPath(); c.rect(0, 0, w, h); c.clip();
    c.fillStyle = '#000'; c.fillRect(0, 0, w, h);
    if (draw) { c.save(); draw(c, { w, h, t, ink: CK.ink_, n, ...(pn.o || {}) }); c.restore(); }
    else { c.fillStyle = '#222'; c.fillRect(0, 0, w, h); c.fillStyle = '#888'; c.font = '28px sans-serif'; c.fillText(pn.art || '?', 20, 40); }
    if (!CK.ink_ && pn.vig !== 0) panelVignette(c, w, h, pn.vig ?? .55);
    c.restore();
    if (CK.ink_ && pn.inkPass !== false) inkPass(c, x * CK.s, y * CK.s, w * CK.s, h * CK.s, pn.ink || {});
    if (CK.ink_) { c.save(); c.setTransform(CK.s, 0, 0, CK.s, 0, 0); c.strokeStyle = CK.ink; c.lineWidth = 4; c.strokeRect(x, y, w, h); c.restore(); }
  }
}
// one SHOT per page, from n to n + 1
function comicSetup() {
  if (CK.ink_) { LOOK.bloom = 0; LOOK.grain = 0; }
  else { LOOK.bloom = .26; LOOK.grain = .06; }
  LOOK.vignette = 0;
  for (const k of Object.keys(COMIC.pages)) { const n = +k; SHOTS.push({ a: n, b: n + 1, draw: (c, u, t) => drawPage(c, n, t) }); }
}
