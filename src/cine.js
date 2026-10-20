// cine.js: the cinematic engine. Plain Canvas 2D, no p5: flat vector shapes lit like a film (gradient skies, drifting
// clouds, haze, god rays, rim light, bloom, vignette, film grain, lightning), shots that crossfade, and karaoke captions
// that light up word by word with the voice. A reel built on it defines SHOTS, CAPTIONS and (optionally) POST in its
// scene file. render.mjs drives it exactly like the p5 studio (window.ready, renderAt, renderSheet).
const W = PROJECT.w || 1080, H = PROJECT.h || 1920, DUR = PROJECT.duration, TAU = Math.PI * 2;

// ---------- math ----------
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, x) => a + (b - a) * x;
const ease = x => { x = clamp(x); return x * x * (3 - 2 * x); };
const easeOut = x => 1 - Math.pow(1 - clamp(x), 3);
const easeIn = x => Math.pow(clamp(x), 3);
const easeIO = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const seg = (t, a, b) => clamp((t - a) / (b - a));
const frac = x => x - Math.floor(x);
const hash = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const wob = (t, f = 1, ph = 0) => Math.sin((t * f + ph) * TAU);
// smooth 1D value noise in -1..1
const vnoise = (x, s = 0) => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return lerp(hash(i + s * 57.3), hash(i + 1 + s * 57.3), u) * 2 - 1; };
const fbm = (x, s = 0) => vnoise(x, s) * .6 + vnoise(x * 2.1, s + 3) * .28 + vnoise(x * 4.3, s + 7) * .12;
function kf(t, keys, e = ease) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t < keys[i][0]) {
    const [a, va] = keys[i - 1], [b, vb] = keys[i], k = e((t - a) / (b - a));
    return Array.isArray(va) ? va.map((v, j) => lerp(v, vb[j], k)) : lerp(va, vb, k);
  }
  return keys[keys.length - 1][1];
}
const rgbOf = h => { const n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
const rgba = (h, a = 1) => { const [r, g, b] = rgbOf(h); return `rgba(${r},${g},${b},${a})`; };
function mixCol(a, b, k) { const A = rgbOf(a), B = rgbOf(b); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], clamp(k))).toString(16).padStart(2, '0')).join(''); }
function lcg(seed) { let s = (seed * 9301 + 49297) % 233280 || 1; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

// ---------- canvases ----------
// scratch(i): a cleared full-frame canvas from a pool (index = nesting depth). layer(c, draw) draws into the next free
// one with c's current transform (so cameras carry through) and returns that canvas; consume it before the next call.
const POOL = []; let DEPTH = 0;
function scratch(i, w = W, h = H) {
  const key = i + ':' + w; if (!POOL[key]) { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; POOL[key] = cv; }
  const c = POOL[key].getContext('2d'); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; c.filter = 'none'; c.clearRect(0, 0, w, h);
  return c;
}
function blit(c, cv, alpha = 1, op = 'source-over', filter = 'none') {
  if (alpha <= 0) return;
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = alpha; c.globalCompositeOperation = op; c.filter = filter; c.drawImage(cv, 0, 0, c.canvas.width, c.canvas.height); c.restore();
}
// Draw at a fraction of the resolution and lay it back up-scaled: soft for free (haze, god rays, glows, blurred
// backgrounds). k = 4 means quarter size. blur adds a real blur at the small size.
function soft(c, k, draw, o = {}) {
  const d = DEPTH++, sc = scratch('soft' + d, Math.ceil(W / k), Math.ceil(H / k));
  sc.setTransform(new DOMMatrix().scale(1 / k).multiply(c.getTransform())); draw(sc);
  let cv = sc.canvas;
  if (o.blur) { const b = scratch('softb' + d, cv.width, cv.height); b.filter = `blur(${o.blur}px)`; b.drawImage(cv, 0, 0); cv = b.canvas; }
  blit(c, cv, o.alpha ?? 1, o.op || 'source-over');
  DEPTH--;
}
// Sprites: drawn once and cached (clouds, glow dots).
const SPR = new Map();
function sprite(key, w, h, draw) {
  let s = SPR.get(key); if (s) return s;
  s = document.createElement('canvas'); s.width = Math.ceil(w); s.height = Math.ceil(h); draw(s.getContext('2d'), w, h); SPR.set(key, s); return s;
}

// ---------- shapes ----------
const fillPath = (c, d, col) => { c.fillStyle = col; c.fill(typeof d === 'string' ? new Path2D(d) : d); };
function strokePath(c, d, col, w, cap = 'round') { c.strokeStyle = col; c.lineWidth = w; c.lineCap = cap; c.lineJoin = 'round'; c.stroke(typeof d === 'string' ? new Path2D(d) : d); }
function ellipse(c, x, y, rx, ry, col, rot = 0) { c.fillStyle = col; c.beginPath(); c.ellipse(x, y, Math.abs(rx), Math.abs(ry), rot, 0, TAU); c.fill(); }
function poly(c, pts, col) { c.fillStyle = col; c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); c.fill(); }
// Smooth curve through points (Catmull-Rom), n samples per span.
function through(P, n = 8) {
  if (P.length < 3) return P.slice();
  const out = [];
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
    for (let k = 0; k < n; k++) {
      const u = k / n, u2 = u * u, u3 = u2 * u;
      out.push([0, 1].map(d => .5 * (2 * p1[d] + (p2[d] - p0[d]) * u + (2 * p0[d] - 5 * p1[d] + 4 * p2[d] - p3[d]) * u2 + (3 * p1[d] - p0[d] - 3 * p2[d] + p3[d]) * u3)));
    }
  }
  out.push(P[P.length - 1]);
  return out;
}
// A tapered limb / lock / tail along points P with a width per point; round ends unless cap = false.
function limb(c, P, Wd, col, cap = true) {
  const C = through(P), n = C.length, L = [], R = [];
  for (let i = 0; i < n; i++) {
    const a = C[Math.max(0, i - 1)], b = C[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1;
    const u = i / (n - 1) * (Wd.length - 1), j = Math.min(Wd.length - 2, Math.floor(u)), w = lerp(Wd[j], Wd[j + 1], u - j) / 2;
    L.push([C[i][0] - dy / d * w, C[i][1] + dx / d * w]); R.push([C[i][0] + dy / d * w, C[i][1] - dx / d * w]);
  }
  c.fillStyle = col; c.beginPath(); L.concat(R.reverse()).forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); c.fill();
  if (cap) { c.beginPath(); c.arc(P[0][0], P[0][1], Wd[0] / 2, 0, TAU); c.arc(P[P.length - 1][0], P[P.length - 1][1], Wd[Wd.length - 1] / 2, 0, TAU); c.fill(); }
}
// Fill d with col, clipped to the region `clip` (a path string or Path2D): shading inside a shape.
function inside(c, clip, draw) { c.save(); c.clip(typeof clip === 'string' ? new Path2D(clip) : clip); draw(); c.restore(); }

// ---------- lighting a figure ----------
// figure(c, draw, o) draws a character (or any object) into its own layer, lights it, and lays it down.
//   o.grade: [[y0, col0], [y1, col1]] a vertical gradient (screen y) laid over it, source-atop: falloff, colour cast
//   o.tint:  [col, a] a flat colour cast over it (night blue, dawn gold; a near-black at high a makes a silhouette)
//   o.edge:  { col, w, a } a thin light line all round the shape (the motion-comic outline)
//   o.rim:   { col, dx, dy, a, blur } a light edge on the side facing the light, which sits at direction (dx, dy)
//   o.alpha, o.op: how it's laid down.
// Call figure() again inside draw for parts that overlap (an arm over the chest) so they get their own edges.
// a shape running off the frame would get its edge and rim traced along the frame border: clear a band there
function unborder(m, w) { const b = Math.ceil(w) + 2; m.globalCompositeOperation = 'source-over'; m.clearRect(0, 0, W, b); m.clearRect(0, H - b, W, b); m.clearRect(0, 0, b, H); m.clearRect(W - b, 0, b, H); }
function figure(c, draw, o = {}) {
  const d = DEPTH; DEPTH += 3;
  const lc = scratch('f' + d); lc.setTransform(c.getTransform()); draw(lc); lc.setTransform(1, 0, 0, 1, 0, 0);
  const L = lc.canvas;
  lc.globalCompositeOperation = 'source-atop';
  if (o.tint) { lc.fillStyle = rgba(o.tint[0], o.tint[1]); lc.fillRect(0, 0, W, H); }
  if (o.grade) { const g = lc.createLinearGradient(0, o.grade[0][0], 0, o.grade[1][0]); g.addColorStop(0, o.grade[0][1]); g.addColorStop(1, o.grade[1][1]); lc.fillStyle = g; lc.fillRect(0, 0, W, H); }
  if (o.edge) {
    const w = o.edge.w ?? 2.5, e = scratch('fe' + d), m = scratch('fm' + d);
    e.drawImage(L, 0, 0); e.globalCompositeOperation = 'destination-in';
    for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; e.drawImage(L, Math.cos(a) * w, Math.sin(a) * w); }
    m.drawImage(L, 0, 0); m.globalCompositeOperation = 'destination-out'; m.drawImage(e.canvas, 0, 0);
    m.globalCompositeOperation = 'source-in'; m.fillStyle = o.edge.col; m.fillRect(0, 0, W, H);
    unborder(m, w);
    lc.globalAlpha = o.edge.a ?? .6; lc.drawImage(m.canvas, 0, 0); lc.globalAlpha = 1;
  }
  if (o.rim && (o.rim.a ?? 1) > 0) {
    const r = o.rim, m = scratch('fm' + d);
    m.drawImage(L, 0, 0); m.globalCompositeOperation = 'destination-out'; m.drawImage(L, -r.dx, -r.dy);
    m.globalCompositeOperation = 'source-in'; m.fillStyle = r.col; m.fillRect(0, 0, W, H);
    unborder(m, Math.max(Math.abs(r.dx), Math.abs(r.dy)) + (r.blur || 0) * 2);
    if (r.blur) { const b = scratch('fe' + d); b.filter = `blur(${r.blur}px)`; b.drawImage(m.canvas, 0, 0); lc.globalAlpha = r.a ?? 1; lc.drawImage(b.canvas, 0, 0); }
    else { lc.globalAlpha = r.a ?? 1; lc.drawImage(m.canvas, 0, 0); }
    lc.globalAlpha = 1;
  }
  lc.globalCompositeOperation = 'source-over';
  blit(c, L, o.alpha ?? 1, o.op || 'source-over');
  DEPTH = d;
}

// Named lighting setups for figure(), from the Shiva/Sati reel. Use one as it is, or spread it and change a part:
//   figure(c, draw, { ...LIGHTS.moon, rim: { ...LIGHTS.moon.rim, a: .8 + flash } })
// rim dx/dy are screen pixels: about 6 for a figure ~1500 px tall, 3 for a small one, 9 for a face filling the frame.
//   moon            a coloured figure at night: cool cast, darker toward the feet, pale edge, moonlight rim from the right
//   moonSilhouette  a small far figure at night: nearly black, with a cool edge and rim
//   fire            lit by a fire in front of it (often from behind the figure): warm dark cast, orange edge and rim
//   dawnBack        backlit by the rising sun: dark warm cast that keeps a little colour, a strong gold edge all round
//   storm           a near-black silhouette against a red sky: hot orange edge, rim from above (add lightning to rim.a)
const LIGHTS = {
  moon: { tint: ['#16224A', .3], grade: [[600, 'rgba(0,0,0,0)'], [1900, 'rgba(4,7,18,.7)']], edge: { col: '#D4E0FA', w: 2.4, a: .55 }, rim: { col: '#EAF1FF', dx: 6, dy: -3, a: .8, blur: 1 } },
  moonSilhouette: { tint: ['#0A0F1C', .84], edge: { col: '#C9D7F5', w: 1.8, a: .55 }, rim: { col: '#E4EDFF', dx: 3, dy: -2, a: .9 } },
  fire: { tint: ['#1A0806', .5], edge: { col: '#FFB070', w: 2.5, a: .75 }, rim: { col: '#FFD08A', dx: 6, dy: -3, a: .9, blur: 1 } },
  dawnBack: { tint: ['#2A1018', .55], edge: { col: '#FFD9A0', w: 2.4, a: .85 }, rim: { col: '#FFF0C8', dx: 5, dy: -3, a: .9, blur: 1 } },
  storm: { tint: ['#140810', .88], edge: { col: '#FF9A6A', w: 2.5, a: .8 }, rim: { col: '#FFB08A', dx: 0, dy: -5, a: .8, blur: 1 } },
};

// ---------- camera ----------
// plane(c, cam, depth, draw): draw a layer of the set at a depth. cam = { x, y, z } pans (px) and zooms the stage plane
// (depth 1); depth 0 never moves (the sky), 0.3 moves a little (far mountains), >1 moves more (foreground rocks).
// Coordinates inside are screen pixels at the camera's rest position.
function plane(c, cam, depth, draw) {
  const z = 1 + ((cam.z ?? 1) - 1) * depth, fx = cam.fx ?? W / 2, fy = cam.fy ?? H / 2;
  c.save(); c.translate(fx, fy); c.scale(z, z); c.rotate((cam.r || 0) * depth); c.translate(-fx - (cam.x || 0) * depth, -fy - (cam.y || 0) * depth); draw(c); c.restore();
}

// ---------- the set ----------
function sky(c, stops) {   // stops: [[y, col], ...] in screen px
  const g = c.createLinearGradient(0, stops[0][0], 0, stops[stops.length - 1][0]);
  const y0 = stops[0][0], y1 = stops[stops.length - 1][0];
  stops.forEach(([y, col]) => g.addColorStop(clamp((y - y0) / (y1 - y0)), col));
  c.fillStyle = g; c.fillRect(-W, -H, W * 3, H * 3);
}
function glow(c, x, y, r, col, a = 1, op = 'lighter') {
  if (a <= 0 || r <= 0) return;
  const g = c.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, rgba(col, a)); g.addColorStop(.25, rgba(col, a * .55)); g.addColorStop(.6, rgba(col, a * .15)); g.addColorStop(1, rgba(col, 0));
  c.save(); c.globalCompositeOperation = op; c.fillStyle = g; c.fillRect(x - r, y - r, 2 * r, 2 * r); c.restore();
}
// A cloud: a cached sprite (lumpy body, darker underside, lit top, soft edge), drawn w wide centred on (x, y).
// cols = [under, body, lit]. flip mirrors it.
function cloud(c, x, y, w, seed, cols, a = 1, flip = false) {
  const SW = 640, SH = 300, key = `cl${seed}|${cols}`;
  const s = sprite(key, SW, SH, (g) => {
    const rnd = lcg(seed * 7 + 3), lumps = [];
    const n = 7 + Math.floor(rnd() * 4);
    for (let i = 0; i < n; i++) {
      const u = (i + .5) / n, r = (38 + rnd() * 52) * (1 - Math.abs(u - .5) * 1.1);
      lumps.push([60 + u * (SW - 120) + (rnd() - .5) * 30, 200 - r * .55 - rnd() * 40 * (1 - Math.abs(u - .5) * 1.6), r]);
    }
    for (let i = 0; i < 6; i++) lumps.push([90 + rnd() * (SW - 180), 205 + rnd() * 18, 30 + rnd() * 30]);
    const shape = (dy, sc = 1) => { g.beginPath(); for (const [lx, ly, r] of lumps) { g.moveTo(lx + r * sc, ly + dy); g.arc(lx, ly + dy, r * sc, 0, TAU); } };
    const body = document.createElement('canvas'); body.width = SW; body.height = SH; const b = body.getContext('2d');
    // body, then the lit part (the shape shifted up, so the underside keeps a band of the darker colour)
    const fillShape = (ctx, dy, col, sc = 1) => { ctx.fillStyle = col; ctx.beginPath(); for (const [lx, ly, r] of lumps) { ctx.moveTo(lx + r * sc, ly + dy); ctx.arc(lx, ly + dy, r * sc, 0, TAU); } ctx.fill(); };
    fillShape(b, 0, cols[0]); b.globalCompositeOperation = 'source-atop'; fillShape(b, -22, cols[1]); fillShape(b, -54, cols[2], .92);
    g.filter = 'blur(2.5px)'; g.drawImage(body, 0, 0);
  });
  const h = w * SH / SW;
  c.save(); c.globalAlpha *= a; c.translate(x, y); if (flip) c.scale(-1, 1); c.drawImage(s, -w / 2, -h * .62, w, h); c.restore();
}
// A mountain ridge from x0 to x1 at height y0 (screen px), amp tall bumps; filled down to the bottom.
function ridge(c, y0, amp, seed, col, o = {}) {
  const x0 = o.x0 ?? -200, x1 = o.x1 ?? W + 200, f = o.freq ?? .004, bottom = o.bottom ?? H + 400;
  c.fillStyle = col; c.beginPath(); c.moveTo(x0, bottom);
  for (let x = x0; x <= x1; x += 8) c.lineTo(x, y0 - amp * (fbm(x * f, seed) * .5 + .5) - (o.shape ? o.shape(x) : 0));
  c.lineTo(x1, bottom); c.closePath(); c.fill();
}
// Haze: a horizontal band of light/fog centred on y, h tall.
function haze(c, y, h, col, a = .5, op = 'source-over') {
  const g = c.createLinearGradient(0, y - h / 2, 0, y + h / 2);
  g.addColorStop(0, rgba(col, 0)); g.addColorStop(.5, rgba(col, a)); g.addColorStop(1, rgba(col, 0));
  c.save(); c.globalCompositeOperation = op; c.fillStyle = g; c.fillRect(-W, y - h / 2, W * 3, h); c.restore();
}
// God rays fanning out from (x, y). o: n, dir (radians, the fan's centre), spread, len, w (end width), col, a, t, seed.
function rays(c, x, y, o) {
  soft(c, 4, (s) => {
    s.globalCompositeOperation = 'lighter';
    for (let i = 0; i < o.n; i++) {
      const h1 = hash(i * 3.7 + (o.seed || 0)), h2 = hash(i * 9.1 + 5 + (o.seed || 0));
      const ang = o.dir + (h1 - .5) * o.spread + Math.sin((o.t || 0) * .25 + i * 1.7) * .015, len = o.len * (.6 + .4 * h2), w = o.w * (.3 + .7 * hash(i + 77));
      const ex = x + Math.cos(ang) * len, ey = y + Math.sin(ang) * len, nx = -Math.sin(ang), ny = Math.cos(ang);
      const a = o.a * (.45 + .55 * hash(i + 31)) * (.75 + .25 * Math.sin((o.t || 0) * .6 + i * 2.3));
      const g = s.createLinearGradient(x, y, ex, ey); g.addColorStop(0, rgba(o.col, a)); g.addColorStop(.5, rgba(o.col, a * .45)); g.addColorStop(1, rgba(o.col, 0));
      s.fillStyle = g; s.beginPath(); s.moveTo(x + nx * w * .08, y + ny * w * .08); s.lineTo(ex + nx * w / 2, ey + ny * w / 2); s.lineTo(ex - nx * w / 2, ey - ny * w / 2); s.lineTo(x - nx * w * .08, y - ny * w * .08); s.closePath(); s.fill();
    }
  }, { blur: o.blur ?? 3, op: o.op || 'screen' });
}
// Floating specks (dust, snow, embers): o: n, seed, box [x0, y0, x1, y1], r, col, a, vx, vy (px/s), t.
function motes(c, o) {
  const [x0, y0, x1, y1] = o.box, w = x1 - x0, h = y1 - y0, spr = sprite('mote' + o.col, 32, 32, (g) => { const gr = g.createRadialGradient(16, 16, 0, 16, 16, 16); gr.addColorStop(0, rgba(o.col, 1)); gr.addColorStop(.3, rgba(o.col, .6)); gr.addColorStop(1, rgba(o.col, 0)); g.fillStyle = gr; g.fillRect(0, 0, 32, 32); });
  c.save(); c.globalCompositeOperation = 'lighter';
  for (let i = 0; i < o.n; i++) {
    const s = i * 1.37 + (o.seed || 0), sp = .5 + hash(s + 2);
    const x = x0 + ((hash(s) * w + (o.vx || 0) * o.t * sp + Math.sin(o.t * .7 + s * 5) * 14) % w + w) % w;
    const y = y0 + ((hash(s + 1) * h + (o.vy || 0) * o.t * sp) % h + h) % h;
    const r = (o.r || 3) * (.4 + hash(s + 3)), a = (o.a ?? .8) * (.35 + .65 * (.5 + .5 * Math.sin(o.t * (1 + hash(s + 4) * 2) + s * 3)));
    c.globalAlpha = a; c.drawImage(spr, x - r * 2, y - r * 2, r * 4, r * 4);
  }
  c.restore();
}
// Lightning from (x0, y0) to (x1, y1): a jagged seeded bolt with branches, glow and a white-hot core. a = brightness.
function bolt(c, x0, y0, x1, y1, seed, a = 1, col = '#BFD4FF') {
  if (a <= 0) return;
  const rnd = lcg(seed), paths = [];
  const make = (p, q, disp, depth) => {
    let pts = [p, q];
    for (let k = 0; k < 6; k++) {
      const nx = []; for (let i = 0; i < pts.length - 1; i++) { const [ax, ay] = pts[i], [bx, by] = pts[i + 1], len = Math.hypot(bx - ax, by - ay); nx.push(pts[i], [(ax + bx) / 2 + (rnd() - .5) * len * disp, (ay + by) / 2 + (rnd() - .5) * len * disp * .3]); }
      nx.push(pts[pts.length - 1]); pts = nx;
    }
    paths.push([pts, depth]);
    if (depth < 2) for (let b = 0; b < 3 - depth; b++) {
      const i = Math.floor(pts.length * (.2 + rnd() * .5)), [sx, sy] = pts[i], ang = Math.atan2(q[1] - p[1], q[0] - p[0]) + (rnd() - .5) * 1.6, l = Math.hypot(q[0] - p[0], q[1] - p[1]) * (.2 + rnd() * .25) / (depth + 1);
      make([sx, sy], [sx + Math.cos(ang) * l, sy + Math.sin(ang) * l], disp, depth + 1);
    }
  };
  make([x0, y0], [x1, y1], .55, 0);
  const trace = (s, w, alpha, color) => { for (const [pts, dpt] of paths) { s.globalAlpha = alpha / (1 + dpt * .9); s.strokeStyle = color; s.lineWidth = w / (1 + dpt * .6); s.lineJoin = 'round'; s.lineCap = 'round'; s.beginPath(); pts.forEach(([x, y], i) => i ? s.lineTo(x, y) : s.moveTo(x, y)); s.stroke(); } };
  soft(c, 4, (s) => { s.globalCompositeOperation = 'lighter'; trace(s, 40, .5 * a, col); }, { blur: 4, op: 'lighter' });
  c.save(); c.globalCompositeOperation = 'lighter'; trace(c, 7, .7 * a, col); trace(c, 2.6, a, '#FFFFFF'); c.restore();
}
// A full-frame flash (lightning, cuts): op 'screen' brightens without washing out the darks completely.
function flash(c, a, col = '#E8F0FF', op = 'screen') { if (a <= .003) return; c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = op; c.fillStyle = rgba(col, clamp(a)); c.fillRect(0, 0, W, H); c.restore(); }
// lightning brightness over time: a double flicker at each time in ts
const strikes = (t, ts) => ts.reduce((s, t0) => { const u = t - t0; return u < 0 ? s : s + Math.exp(-u * 9) * (u < .07 ? 1 : u < .11 ? .25 : .85) + (u > .16 ? Math.exp(-(u - .16) * 12) * .6 : 0); }, 0);

// ---------- karaoke captions ----------
// say(a, b, text, o): a caption chunk on screen from a to b. Words light up one by one as they're spoken: from o.at
// (word start times, e.g. from TTS timestamps) or, without them, spread over [a + o.lead, b - o.tail] by length.
// Words wrapped in *stars* are names and land in gold; a lone | breaks the line. o.y = centre line (screen px), o.size.
// A caption of three lines or more needs at least 3.2 s on screen (the owner finds them fast otherwise).
const CAPTIONS = [];
const CAP = { font: 'Cinzel', weight: 700, size: 56, y: 960, x: 520, maxW: 820, lit: '#FFF3DC', gold: '#F4C46A', dim: .34 };
function say(a, b, text, o = {}) {
  const words = []; text.split(/\s+/).filter(Boolean).forEach(w => w === '|' ? (words.length && (words[words.length - 1].br = true)) : words.push({ txt: w.replace(/\*/g, ''), gold: /\*/.test(w) }));
  let at = o.at;
  if (!at) {
    // three lines or more: finish lighting by 70% of the window, so the whole caption sits lit for the last ~1 s
    const nl = words.filter(w => w.br).length + 1, tail = o.tail ?? (nl >= 3 ? Math.max(.45, (b - a) * .3) : .45);
    const s0 = a + (o.lead ?? .05), s1 = b - tail, lens = words.map(w => w.txt.length + 2), tot = lens.reduce((x, y) => x + y, 0);
    let acc = 0; at = lens.map(l => { const v = s0 + (s1 - s0) * acc / tot; acc += l; return v; });
  }
  words.forEach((w, i) => w.t = at[i]);
  CAPTIONS.push({ a, b, words, y: o.y ?? CAP.y, size: o.size ?? CAP.size });
}
function drawCaptions(c, t) {
  for (const k of CAPTIONS) {
    if (t < k.a || t > k.b) continue;
    const vis = Math.min(seg(t, k.a, k.a + .18), 1 - seg(t, k.b - .18, k.b)), size = k.size;
    if (vis <= 0) continue;
    c.save(); c.font = `${CAP.weight} ${size}px ${CAP.font}`; c.letterSpacing = (size * .03) + 'px'; c.textBaseline = 'middle';
    const sp = c.measureText(' ').width, lines = [[]]; let lw = 0;
    for (const w of k.words) { w.w = c.measureText(w.txt).width; if (lw + w.w > CAP.maxW && lines[lines.length - 1].length) { lines.push([]); lw = 0; } lines[lines.length - 1].push(w); lw += w.w + sp; if (w.br) { lines.push([]); lw = 0; } }
    const lh = size * 1.32, y0 = clamp(k.y, 420 + lh * lines.length / 2, 1500 - lh * lines.length / 2) - (lines.length - 1) * lh / 2 + (1 - vis) * 10;
    lines.forEach((ln, li) => {
      const tw = ln.reduce((s, w) => s + w.w, 0) + sp * (ln.length - 1); let x = CAP.x - tw / 2;
      for (const w of ln) {
        const lit = seg(t, w.t, w.t + .14), col = w.gold ? CAP.gold : CAP.lit;
        c.globalAlpha = vis * lerp(CAP.dim, 1, lit);
        c.shadowColor = 'rgba(5,4,12,.9)'; c.shadowBlur = size * .45; c.fillStyle = col; c.fillText(w.txt, x, y0 + li * lh);
        c.shadowBlur = 0; if (lit > 0 && w.gold) { c.globalAlpha = vis * lit * .35; c.shadowColor = col; c.shadowBlur = size * .5; c.fillText(w.txt, x, y0 + li * lh); c.shadowBlur = 0; }
        x += w.w + sp;
      }
    });
    c.restore();
  }
}

// ---------- pictures and plain lettering (end cards) ----------
// PICS.name = an Image from a data URI (src/scenes/rk_images.js fills in the book covers and the logo); setup waits for them.
// picture(c, img, x, y, w, h, o) centred on (x, y): o.rot, o.pop (seconds since it appeared: springs in), o.alpha,
// o.r (corner radius), o.shadow (soft shadow blur px), o.glow ([col, blur] a halo behind it).
// text(c, txt, x, y, font, col, o): centred lettering; o.pop, o.alpha, o.maxW, o.glow ([col, blur]), o.spacing (px).
const PICS = {};
const popK = s => s == null ? 1 : s <= 0 ? 0 : (x => 1 + 2.9 * Math.pow(x - 1, 3) + 1.9 * Math.pow(x - 1, 2))(clamp(s * 4));
function picture(c, img, x, y, w, h, o = {}) {
  const k = popK(o.pop); if (k <= .01 || !img || !img.naturalWidth) return;
  c.save(); c.translate(x, y); c.rotate(o.rot || 0); c.scale(k, k); c.globalAlpha *= (o.alpha ?? 1) * clamp(k);
  if (o.glow) { c.save(); c.shadowColor = o.glow[0]; c.shadowBlur = o.glow[1]; c.fillStyle = o.glow[0]; c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, o.r || 0); c.fill(); c.restore(); }
  if (o.shadow) { c.save(); c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = o.shadow; c.shadowOffsetY = o.shadow * .4; c.fillStyle = '#000'; c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, o.r || 0); c.fill(); c.restore(); }
  if (o.r) { c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, o.r); c.clip(); }
  c.drawImage(img, -w / 2, -h / 2, w, h); c.restore();
}
function text(c, txt, x, y, font, col, o = {}) {
  const k = popK(o.pop); if (k <= .01) return;
  c.save(); c.translate(x, y); c.scale(k, k); c.globalAlpha *= (o.alpha ?? 1) * clamp(k);
  c.font = font; c.letterSpacing = (o.spacing || 0) + 'px'; c.textAlign = 'center'; c.textBaseline = 'middle';
  if (o.maxW) { const w = c.measureText(txt).width; if (w > o.maxW) c.scale(o.maxW / w, o.maxW / w); }
  if (o.glow) { c.shadowColor = o.glow[0]; c.shadowBlur = o.glow[1]; }
  c.fillStyle = col; c.fillText(txt, 0, 0); c.restore();
}

// ---------- the frame ----------
// SHOTS: [{ a, b, xf, draw(c, u, t) }] in time order. A shot is on screen from a to b; with xf it fades in over its
// first xf seconds on top of the shot before (so overlap the shots by xf). u = time since the shot began.
// POST: [fn(c, t)] drawn over the shots, before bloom and grade (flashes, transitions).
const SHOTS = [], POST = [];
let T = 0, outC = null, outX = null, VIG = null, GRAIN = [];
const LOOK = { bloom: .32, vignette: .72, grain: .09 };
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; c.filter = 'none';
  c.fillStyle = '#000'; c.fillRect(0, 0, W, H);
  const live = SHOTS.filter(s => t >= s.a && t < s.b); let from = 0;
  live.forEach((s, i) => { if (!s.xf || t >= s.a + s.xf) from = i; });
  for (let i = from; i < live.length; i++) {
    const s = live[i], k = s.xf ? ease(seg(t, s.a, s.a + s.xf)) : 1;
    if (k >= 1 || i === from) { c.save(); s.draw(c, t - s.a, t); c.restore(); }
    else { const d = DEPTH++, l = scratch('shot' + d); s.draw(l, t - s.a, t); blit(c, l.canvas, k); DEPTH--; }
  }
  for (const p of POST) { c.save(); p(c, t); c.restore(); }
  // bloom: the frame, small, cubed (so only the bright parts survive), blurred, screened back on
  if (LOOK.bloom > 0) {
    const s = scratch('bloom', W / 6, H / 6); s.drawImage(c.canvas, 0, 0, W / 6, H / 6);
    s.globalCompositeOperation = 'multiply'; s.drawImage(s.canvas, 0, 0); s.drawImage(s.canvas, 0, 0);
    const b = scratch('bloomb', W / 6, H / 6); b.filter = 'blur(6px)'; b.drawImage(s.canvas, 0, 0);
    blit(c, b.canvas, LOOK.bloom * 2, 'screen');
  }
  blit(c, VIG, LOOK.vignette);
  c.save(); c.globalAlpha = LOOK.grain; c.globalCompositeOperation = 'overlay'; c.imageSmoothingEnabled = false;
  const gi = Math.floor(t * 12) % GRAIN.length, ox = Math.floor(hash(gi + Math.floor(t * 12)) * 200), oy = Math.floor(hash(gi * 7 + Math.floor(t * 12)) * 200);
  c.drawImage(GRAIN[gi], -ox, -oy, (W + 200) * 1, (H + 200) * 1); c.restore();
  drawCaptions(c, t);
}
function makeVignette() {
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d');
  c.translate(W / 2, H * .48); c.scale(1, H / W * .82);
  const g = c.createRadialGradient(0, 0, W * .32, 0, 0, W * .95); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(.6, 'rgba(0,0,0,.35)'); g.addColorStop(1, 'rgba(0,0,0,.92)');
  c.fillStyle = g; c.fillRect(-W, -W, W * 2, W * 2); return cv;
}
function makeGrain(seed) {
  const gw = Math.ceil((W + 200) / 1.5), gh = Math.ceil((H + 200) / 1.5), cv = document.createElement('canvas'); cv.width = gw; cv.height = gh;
  const c = cv.getContext('2d'), id = c.createImageData(gw, gh), d = id.data, rnd = lcg(seed);
  for (let i = 0; i < d.length; i += 4) { const v = 128 + (rnd() + rnd() + rnd() - 1.5) * 70; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; }
  c.putImageData(id, 0, 0);
  const big = document.createElement('canvas'); big.width = W + 200; big.height = H + 200; const b = big.getContext('2d'); b.drawImage(cv, 0, 0, W + 200, H + 200); return big;
}

// ---------- page hooks (same contract as core.js, so render.mjs works unchanged) ----------
const LOOPS = {};
async function cineSetup() {
  outC = document.getElementById('out'); outC.width = W; outC.height = H; outC.style.aspectRatio = W + ' / ' + H; outX = outC.getContext('2d');
  VIG = makeVignette(); GRAIN = [1, 2, 3, 4].map(makeGrain);
  await Promise.all([`${CAP.weight} ${CAP.size}px ${CAP.font}`, ...(PROJECT.fonts || [])].map(f => document.fonts.load(f)));
  await Promise.all(Object.values(PICS).map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; })));
  window.ready = true;
  if (!location.search.includes('render')) devUI();
}
window.renderAt = async (t, type = 'image/png', q = .92) => { T = t; frame(outX, t); return outC.toDataURL(type, q); };
window.renderSheet = async (times, cols = 3, w = 640, crop = null) => {
  const [cx, cy, cw, ch] = crop || [0, 0, W, H], h = Math.round(w * ch / cw), rows = Math.ceil(times.length / cols), sc = document.createElement('canvas');
  sc.width = cols * w; sc.height = rows * h; const c = sc.getContext('2d'), ms = [];
  for (let i = 0; i < times.length; i++) {
    const t0 = performance.now(); T = times[i]; frame(outX, times[i]); ms.push(Math.round(performance.now() - t0));
    const x = (i % cols) * w, y = Math.floor(i / cols) * h;
    c.drawImage(outC, cx, cy, cw, ch, x, y, w, h); c.fillStyle = 'rgba(0,0,0,.65)'; c.fillRect(x, y, 84, 24); c.fillStyle = '#fff'; c.font = '15px sans-serif'; c.fillText(times[i].toFixed(2) + 's', x + 6, y + 17);
  }
  return { url: sc.toDataURL('image/jpeg', .9), ms };
};
window.gpuInfo = () => 'canvas 2d';
function devUI() {
  const s = document.getElementById('scrub'), lab = document.getElementById('tt'); s.max = DUR;
  let busy = false, want = null;
  const go = async () => { if (busy) return; busy = true; while (want != null) { const t = want; want = null; const t0 = performance.now(); await window.renderAt(t); lab.textContent = `${t.toFixed(2)}s  ·  ${Math.round(performance.now() - t0)} ms/frame`; } busy = false; };
  s.addEventListener('input', () => { want = +s.value; go(); });
  want = +(new URLSearchParams(location.search).get('t') || 0); s.value = want; go();
}
window.addEventListener('load', cineSetup);
