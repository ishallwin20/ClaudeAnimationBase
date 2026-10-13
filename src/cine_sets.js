// cine_sets.js: scenery and set pieces for the Cinematic style (src/cine.js). Shared: use them as they are, or copy
// one into a scene and change it. Coordinates are screen pixels at the camera's rest (1080 × 1920).
//   PALETTES                       cloud colour triples [underside, body, lit top] for clouds()
//   kailash(c, cx, top, w, k)      Mount Kailash: snow, a shaded face, terraces. k: rock, snow, snowSh, light (1 | -1)
//   ledge(c, x, y, col, lit)       a cliff coming in from the right, its edge at x; stand a figure on it
//   clouds(c, set, t, cols, a)     a drifting bank: set = [[x, y, w, seed, speed px/s, flip], ...]
//   fireRing(c, cx, cy, r, t, a)   Nataraja's ring of fire (the prabha), open at the bottom
//   hallSky(c), pillars(...)       a palace hall at night lit by a fire: carved pillars, scalloped arches, hanging lamps
//   embers(c, x, y, t, ...)        sparks rising from a fire at (x, y)
//   cracks(c, cx, cy, k, t, seed)  glowing cracks spreading through the ground (k = 0..1)
//   meteors(c, t, t0, n, seed)     shooting stars from t0 on (deterministic, so SFX can match them)
//   stars(c, n, seed, t, a)        a twinkling starfield in the top 1100 px
//   shrine(c, x, y, k, col)        a small temple silhouette with a red flag (Shakti Peethas, villages)
//   uprooted(c, cx, top, w, t, k)  Kailash torn out of the ground: kailash() over a jagged underside with hanging rocks
//   debris(c, box, t, t0, n, seed) rocks and snow falling from t0 (deterministic): box = [x0, y0, x1] where they start
//   shockRings(c, x, y, t, ts, col) rings of light racing out from (x, y) at each time in ts
//   lanka(c, y, t, burn, seed)     the golden city of Lanka at night: towers and domes, lit windows, fire as burn rises
//   stotram(c, lines, x, y, t, t0) lines of Devanagari rising and glowing (needs the Tiro Devanagari Sanskrit font)
//   rkCardCine(c, u, t, o)         the Rishi Katha end card in this style (see below)
const PALETTES = {
  night: ['#151B2E', '#2A3452', '#5A6788'], nightFar: ['#1A2238', '#27304B', '#3C4766'],
  red: ['#2A0A10', '#4A1218', '#7A2A22'], dawn: ['#5A2C46', '#9C4B55', '#E8A06C'],
};

function kailash(c, cx, top, w, k = {}) {
  const base = top + 700, rock = k.rock || '#1A2236', snow = k.snow || '#93A2C4', snowSh = k.snowSh || '#56637F', L = k.light ?? 1;
  const BODY = `M ${cx - w} ${base} C ${cx - w * .72} ${base - 140} ${cx - w * .36} ${top + 210} ${cx - w * .12} ${top + 34} Q ${cx} ${top - 16} ${cx + w * .12} ${top + 34} C ${cx + w * .36} ${top + 210} ${cx + w * .72} ${base - 140} ${cx + w} ${base} Z`;
  fillPath(c, BODY, rock);
  inside(c, BODY, () => {
    // snow on the upper slopes, with a ragged lower edge
    c.fillStyle = snow; c.beginPath(); c.moveTo(cx - w, top - 50);
    for (let x = cx - w; x <= cx + w; x += 10) { const d = Math.abs(x - cx) / w; c.lineTo(x, top + 420 - d * 120 + fbm(x * .012, 4) * 40); }
    c.lineTo(cx + w, top - 50); c.closePath(); c.fill();
    // the shaded face
    c.save(); c.translate(cx, 0); c.scale(L, 1);
    fillPath(c, `M 0 ${top - 20} C ${-w * .03} ${top + 200} ${-w * .1} ${top + 420} ${-w * .06} ${base} L ${-w * 1.2} ${base} L ${-w * 1.2} ${top - 20} Z`, rgba(snowSh, .85));
    c.restore();
    // the terraces: soft dark bands across the face
    for (let i = 0; i < 4; i++) {
      const y = top + 150 + i * 70, hw = w * (.2 + i * .1);
      c.fillStyle = rgba(rock, .28); c.beginPath(); c.moveTo(cx - hw, y + hw * .3);
      for (let x = cx - hw; x <= cx + hw; x += 12) c.lineTo(x, y + Math.abs(x - cx) * .3 + fbm(x * .02, i + 9) * 8);
      for (let x = cx + hw; x >= cx - hw; x -= 12) c.lineTo(x, y + 16 + Math.abs(x - cx) * .3 + fbm(x * .02, i + 19) * 8);
      c.closePath(); c.fill();
    }
  });
}
// A cliff coming in from the right, its edge at x; the top at y.
function ledge(c, x, y, col, lit, la = .5) {
  const d = `M ${x - 40} ${y + 30} C ${x - 30} ${y + 6} ${x} ${y - 2} ${x + 60} ${y} C ${x + 200} ${y + 4} ${x + 420} ${y - 18} ${W + 200} ${y - 30} L ${W + 200} ${H + 300} L ${x + 60} ${H + 300} C ${x + 20} ${y + 300} ${x - 60} ${y + 160} ${x - 40} ${y + 30} Z`;
  figure(c, (f) => fillPath(f, d, col), { edge: { col: lit, w: 2.5, a: la } });
}
function clouds(c, set, t, cols, a = 1) {
  for (const [x, y, w, seed, v, flip] of set) { const span = W + w; cloud(c, ((x + t * v) % span + span) % span - w / 2, y, w, seed, cols, a, flip); }
}
function fireRing(c, cx, cy, r, t, a = 1) {
  const g0 = Math.PI / 2 + .52, g1 = Math.PI / 2 - .52 + TAU;
  soft(c, 4, (s) => { s.globalCompositeOperation = 'lighter'; s.strokeStyle = rgba('#FF8A2A', .7 * a); s.lineWidth = 60; s.beginPath(); s.arc(cx, cy, r, g0, g1); s.stroke(); }, { blur: 5, op: 'lighter' });
  c.save(); c.globalCompositeOperation = 'lighter';
  c.strokeStyle = rgba('#FFB04A', .9 * a); c.lineWidth = 10; c.beginPath(); c.arc(cx, cy, r, g0, g1); c.stroke();
  const n = 44;
  for (let i = 0; i <= n; i++) {
    const ang = lerp(g0, g1, i / n), h = (46 + 26 * Math.sin(t * 8 + i * 1.9) + 14 * Math.sin(t * 13 + i * 3.1)) * a, w = 15;
    const bx = cx + Math.cos(ang) * (r + 4), by = cy + Math.sin(ang) * (r + 4), nx = Math.cos(ang), ny = Math.sin(ang), tx = -ny, ty = nx, lean = Math.sin(t * 5 + i) * 8;
    for (const [k, col] of [[1, '#FF6A1E'], [.65, '#FFB347'], [.32, '#FFF1C0']]) {
      c.fillStyle = rgba(col, .85); c.beginPath();
      c.moveTo(bx + tx * w * k, by + ty * w * k);
      c.quadraticCurveTo(bx + nx * h * k * .6 + tx * w * k, by + ny * h * k * .6 + ty * w * k, bx + nx * h * k + tx * lean * k, by + ny * h * k + ty * lean * k);
      c.quadraticCurveTo(bx + nx * h * k * .6 - tx * w * k, by + ny * h * k * .6 - ty * w * k, bx - tx * w * k, by - ty * w * k);
      c.closePath(); c.fill();
    }
  }
  c.restore();
}
// ---------- the yagna hall ----------
function hallSky(c) { sky(c, [[0, '#0A0507'], [700, '#1C0C0B'], [1250, '#3A1A12'], [1500, '#2A120C'], [1920, '#120806']]); }
// a row of carved pillars under a lintel hung with lamps; lit on the sides that face the fire at fx
function pillars(c, yTop, yBot, fx, col, t, n = 7, w = 44) {
  fillPath(c, `M -200 ${yTop - 60} L ${W + 200} ${yTop - 60} L ${W + 200} ${yTop} L -200 ${yTop} Z`, col);
  for (let i = 0; i < n; i++) {
    const x = lerp(-60, W + 60, i / (n - 1)), s = Math.sign(fx - x) || 1;
    fillPath(c, `M ${x - w / 2} ${yTop} L ${x + w / 2} ${yTop} L ${x + w / 2} ${yBot} L ${x - w / 2} ${yBot} Z`, col);
    for (const [y, ww] of [[yTop + 8, 1.6], [yTop + 26, 1.3], [yBot - 30, 1.4], [yBot - 10, 1.7]]) fillPath(c, `M ${x - w * ww / 2} ${y - 9} L ${x + w * ww / 2} ${y - 9} L ${x + w * ww / 2} ${y + 9} L ${x - w * ww / 2} ${y + 9} Z`, col);
    fillPath(c, `M ${x + s * w / 2 - s * 5} ${yTop + 40} L ${x + s * w / 2} ${yTop + 40} L ${x + s * w / 2} ${yBot - 40} L ${x + s * w / 2 - s * 5} ${yBot - 40} Z`, rgba('#FF9A4A', .45 * (1 - Math.abs(fx - x) / 900)));
    if (i < n - 1) {   // a scalloped arch to the next pillar, and a lamp hanging in it
      const x2 = lerp(-60, W + 60, (i + 1) / (n - 1)), m = (x + x2) / 2, hw = (x2 - x) / 2 - w / 2;
      fillPath(c, `M ${x + w / 2} ${yTop} L ${x2 - w / 2} ${yTop} L ${x2 - w / 2} ${yTop + 90} C ${m + hw * .6} ${yTop + 90} ${m + hw * .3} ${yTop + 30} ${m} ${yTop + 22} C ${m - hw * .3} ${yTop + 30} ${m - hw * .6} ${yTop + 90} ${x + w / 2} ${yTop + 90} Z`, col);
      strokePath(c, `M ${m} ${yTop + 22} L ${m} ${yTop + 70}`, col, 2); glow(c, m, yTop + 78, 40, '#FFB050', .5 + .1 * Math.sin(t * 7 + i)); ellipse(c, m, yTop + 78, 4, 6, '#FFE6A0');
    }
  }
  const fg = c.createLinearGradient(0, yBot, 0, yBot + 500); fg.addColorStop(0, '#24100B'); fg.addColorStop(1, '#0C0504'); c.fillStyle = fg; c.fillRect(-300, yBot, W + 600, 900);
}
const embers = (c, x, y, t, n = 40, seed = 5, w = 300, h = 900) => motes(c, { n, seed, box: [x - w / 2, y - h, x + w / 2, y], r: 3, col: '#FFB060', a: .9, vx: 12, vy: -120, t });
function cracks(c, cx, cy, k, t, seed) {   // glowing cracks in the ground spreading out from (cx, cy), k = 0..1 how far
  if (k <= 0) return;
  const rnd = lcg(seed), paths = [];
  for (let i = 0; i < 9; i++) { let x = cx, y = cy, a = Math.PI * (rnd() * .9 + .05) * (rnd() < .5 ? 1 : -1) * .5 + (i % 2 ? 0 : Math.PI); const P = [[x, y]]; for (let j = 0; j < 7; j++) { a += (rnd() - .5) * .9; x += Math.cos(a) * 70; y += Math.abs(Math.sin(a)) * 18 + 6; P.push([x, y]); } paths.push(P); }
  const draw = (s, w, col, al) => { s.strokeStyle = rgba(col, al); s.lineWidth = w; s.lineCap = 'round'; s.lineJoin = 'round'; for (const P of paths) { const n = Math.max(2, Math.ceil(P.length * k)); s.beginPath(); P.slice(0, n).forEach(([x, y], i) => i ? s.lineTo(x, y) : s.moveTo(x, y)); s.stroke(); } };
  soft(c, 4, (s) => { s.globalCompositeOperation = 'lighter'; draw(s, 26, '#FF5A1E', .7 + .2 * Math.sin(t * 8)); }, { blur: 3, op: 'lighter' });
  draw(c, 5, '#FFB060', .95);
}
function meteors(c, t, t0, n, seed) {
  for (let i = 0; i < n; i++) {
    const s0 = t0 + hash(i * 3.3 + seed) * 6, u = (t - s0) / .8; if (u < 0 || u > 1) continue;
    const x0 = 100 + hash(i * 5.1 + seed) * 1000, y0 = 80 + hash(i * 7.7 + seed) * 300, x = x0 - u * 420, y = y0 + u * 520;
    const g = c.createLinearGradient(x, y, x + 140, y - 170); g.addColorStop(0, rgba('#FFE0B0', .9 * Math.sin(u * Math.PI))); g.addColorStop(1, rgba('#FF7A3A', 0));
    c.save(); c.globalCompositeOperation = 'lighter'; c.strokeStyle = g; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(x, y); c.lineTo(x + 140, y - 170); c.stroke(); c.restore();
  }
}
function stars(c, n, seed, t, a = 1) { for (let i = 0; i < n; i++) { const x = hash(i * 1.7 + seed) * W, y = hash(i * 2.9 + seed) * 1100, r = .8 + hash(i * 4.1) * 1.8; ellipse(c, x, y, r, r, rgba('#E8ECFF', a * (.4 + .6 * (.5 + .5 * Math.sin(t * 2 + i))))); } }
function shrine(c, x, y, k, col) { fillPath(c, `M ${x - 18 * k} ${y} L ${x - 18 * k} ${y - 18 * k} C ${x - 14 * k} ${y - 40 * k} ${x - 4 * k} ${y - 54 * k} ${x} ${y - 62 * k} C ${x + 4 * k} ${y - 54 * k} ${x + 14 * k} ${y - 40 * k} ${x + 18 * k} ${y - 18 * k} L ${x + 18 * k} ${y} Z`, col); strokePath(c, `M ${x} ${y - 62 * k} L ${x} ${y - 80 * k}`, col, 2 * k); fillPath(c, `M ${x} ${y - 80 * k} L ${x + 14 * k} ${y - 74 * k} L ${x} ${y - 70 * k} Z`, '#E0402A'); }

// ---------- the Kailash story ----------
function uprooted(c, cx, top, w, t, k = {}) {
  const base = top + 700, rock = k.rock || '#1A2236', dark = k.under || '#0C0F18';
  c.fillStyle = dark; c.beginPath(); c.moveTo(cx - w, base - 10);
  for (let x = cx - w; x <= cx + w; x += 26) { const d = (x - cx) / w; c.lineTo(x, base + 30 + (1 - d * d) * (k.depth ?? 220) + fbm(x * .03, 5) * 50 + (hash(Math.floor(x / 26) + 3) > .7 ? 40 : 0)); }
  c.lineTo(cx + w, base - 10); c.closePath(); c.fill();
  // hanging rocks and roots at the underside, swinging a little
  for (let i = 0; i < 9; i++) { const x = cx + (hash(i * 4.3) - .5) * w * 1.6, d = (x - cx) / w, y = base + 20 + (1 - d * d) * (k.depth ?? 220) * .9, l = 30 + hash(i * 7.1) * 70, sw = Math.sin(t * 2 + i) * 4;
    limb(c, [[x, y], [x + sw, y + l * .5], [x + sw * 2, y + l]], [26, 16, 6], dark, false); }
  kailash(c, cx, top, w, k);
}
function debris(c, box, t, t0, n, seed, col = '#140E14', lit = '#FF9A6A') {
  const [x0, y0, x1] = box;
  for (let i = 0; i < n; i++) {
    const st = t0 + hash(i * 2.1 + seed) * 1.6, u = t - st; if (u < 0) continue;
    const x = lerp(x0, x1, hash(i * 3.7 + seed)) + (hash(i * 5.3 + seed) - .5) * 160 * u, y = y0 + 900 * u * u + 60 * u; if (y > 2200) continue;
    const r = 8 + hash(i * 9.1 + seed) * 26, rot = u * (hash(i + seed) - .5) * 8, pts = [];
    for (let j = 0; j < 6; j++) { const a = j / 6 * TAU + rot, rr = r * (.7 + hash(i * 11 + j) * .5); pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); }
    poly(c, pts, col); strokePath(c, `M ${pts[4][0]} ${pts[4][1]} L ${pts[5][0]} ${pts[5][1]} L ${pts[0][0]} ${pts[0][1]}`, rgba(lit, .7), 2.5);
  }
  motes(c, { n: n * 2, seed: seed + 50, box: [x0 - 100, y0, x1 + 100, y0 + 1600 * Math.min(1, Math.max(0, t - t0))], r: 4, col: '#E8ECF8', a: .5 * clamp(t - t0), vx: 30, vy: 400, t });
}
function shockRings(c, x, y, t, ts, col = '#FFE2B0') {
  for (const t0 of ts) {
    const u = t - t0; if (u < 0 || u > 1.4) continue;
    const r = 60 + 1500 * Math.pow(u / 1.4, .6), a = 1 - u / 1.4;
    soft(c, 4, (s) => { s.globalCompositeOperation = 'lighter'; s.strokeStyle = rgba(col, .6 * a); s.lineWidth = 70 * a + 10; s.beginPath(); s.ellipse(x, y, r, r * .55, 0, 0, TAU); s.stroke(); }, { blur: 4, op: 'lighter' });
    c.save(); c.globalCompositeOperation = 'lighter'; c.strokeStyle = rgba(col, .8 * a); c.lineWidth = 4; c.beginPath(); c.ellipse(x, y, r, r * .55, 0, 0, TAU); c.stroke(); c.restore();
  }
}
function lanka(c, y, t, burn = 0, seed = 7) {
  const rnd = lcg(seed), towers = [];
  for (let x = -60; x < W + 80; x += 70 + rnd() * 70) towers.push([x, 160 + rnd() * 420, 34 + rnd() * 40, rnd()]);
  glow(c, W / 2, y - 200, 900, '#FF6A1E', .35 * burn + .05);
  for (const [x, h, w, r] of towers) {
    const col = '#1A0C10', top = y - h;
    fillPath(c, `M ${x - w} ${y} L ${x - w} ${top + 40} L ${x + w} ${top + 40} L ${x + w} ${y} Z`, col);
    if (r < .5) { fillPath(c, `M ${x - w - 6} ${top + 44} C ${x - w} ${top - 10} ${x - 10} ${top - 40} ${x} ${top - 70} C ${x + 10} ${top - 40} ${x + w} ${top - 10} ${x + w + 6} ${top + 44} Z`, col); strokePath(c, `M ${x} ${top - 70} L ${x} ${top - 100}`, col, 4); }
    else { ellipse(c, x, top + 40, w + 4, w * .9, col); fillPath(c, `M ${x - 4} ${top + 40 - w * .9} L ${x + 4} ${top + 40 - w * .9} L ${x} ${top - w * 1.4} Z`, col); }
    for (let j = 0; j < 4; j++) { const wy = top + 80 + j * 70; if (wy > y - 30) break; ellipse(c, x + (j % 2 ? 10 : -10), wy, 5, 9, rgba('#FFB050', .7 + .3 * Math.sin(t * 5 + x))); }
    if (burn > 0 && hash(x * .13) < .8) {
      const fb = burn * (.6 + .6 * hash(x * .7)), base = r < .5 ? top + 20 : top + 30;
      glow(c, x, base - 60 * fb, 200 * fb, '#FF7A22', .55);
      c.save(); c.globalCompositeOperation = 'lighter';
      for (const [col2, sc] of [['#C8321A', 1], ['#FF7A22', .75], ['#FFC04A', .5], ['#FFF3C4', .25]]) for (let i = 0; i < 5; i++) {
        const u = (i + .5) / 5 - .5, bx = x + u * w * 2, hh = 220 * fb * sc * (.6 + .4 * Math.cos(u * Math.PI)) * (.75 + .25 * Math.sin(t * (7 + i) + x + sc * 9)), ww = w * .4 * sc + 6, lean = Math.sin(t * 3 + i + x) * 14;
        c.fillStyle = rgba(col2, .7); c.beginPath(); c.moveTo(bx - ww, base); c.quadraticCurveTo(bx - ww, base - hh * .5, bx + lean, base - hh); c.quadraticCurveTo(bx + ww, base - hh * .5, bx + ww, base); c.closePath(); c.fill();
      }
      c.restore();
    }
  }
  fillPath(c, `M -100 ${y - 4} L ${W + 100} ${y - 4} L ${W + 100} ${y + 600} L -100 ${y + 600} Z`, '#120709');
  if (burn > 0) motes(c, { n: 70, seed: seed + 3, box: [-50, y - 900, W + 50, y], r: 3.2, col: '#FFB060', a: .9 * burn, vx: 20, vy: -140, t });
}
function stotram(c, lines, x, y, t, t0, o = {}) {
  const size = o.size || 50, gap = o.gap || 1.1, rise = o.rise || 46;
  lines.forEach((ln, i) => {
    const u = t - t0 - i * gap; if (u < 0) return;
    const a = Math.min(1, u / .8) * (o.fade ? 1 - clamp((u - o.fade) / 1.2) : 1); if (a <= 0) return;
    text(c, ln, x, y + i * size * 1.5 - u * rise, `${size}px "Tiro Devanagari Sanskrit"`, '#FFE2A0', { alpha: a, glow: ['rgba(255,170,60,.9)', 24], maxW: o.maxW || 900 });
  });
}

// ---------- the Rishi Katha end card ----------
// Dark teal with gold dust: RK logo, a gold title, one line, the three covers fanned, the price, a note (the offer's
// deadline), the rishikatha.com pill and the Follow line, each springing in. u = seconds since the card's shot began.
// o: title, line, price, note, books (draw order, the last on top; default ['book1', 'book3', 'book2']).
// Needs src/scenes/rk_images.js (PICS) and the card fonts in PROJECT.fonts: '42px Marcellus', '700 54px Poppins',
// '500 36px Poppins'. End the reel on it without a fade, held at least 3 s after the last line lands.
function rkCardCine(c, u, t, o = {}) {
  sky(c, [[0, '#04100E'], [900, '#0F2A27'], [1920, '#050E0C']]);
  glow(c, 470, 950, 760, '#2E5F5A', .55, 'screen');
  motes(c, { n: 60, seed: 61, box: [-50, 300, W + 50, 1900], r: 3, col: '#F4C46A', a: .6, vx: 6, vy: -26, t });
  const X = 470, pk = d => u - d, br = Math.sin(t * 1.3) * .008, books = o.books || ['book1', 'book3', 'book2'];
  picture(c, PICS.logo, X, 505, 132, 132, { pop: pk(.2), r: 66 });
  if (o.title) text(c, o.title, X, 645, '700 66px Cinzel', '#F4C46A', { pop: pk(.35), glow: ['rgba(244,196,106,.55)', 26], spacing: 3, maxW: 860 });
  if (o.line) text(c, o.line, X, 718, '42px Marcellus', '#FBE0CF', { pop: pk(.55), maxW: 840 });
  books.forEach((b, j) => { const i = [-1, 1, 0][j] ?? 0; picture(c, PICS[b], X + i * 215, 975 + Math.abs(i) * 30, 270, 270, { rot: i * .1 + br, pop: pk(.7 + j * .12), r: 10, shadow: 26, glow: ['rgba(255,196,120,.28)', 40] }); });
  if (o.price) text(c, o.price, X, 1238, '700 54px Poppins', '#FFFFFF', { pop: pk(1.25), maxW: 860 });
  if (o.note) text(c, o.note, X, 1302, '500 34px Poppins', '#FF9A6A', { pop: pk(1.45), maxW: 860 });
  const k = popK(pk(1.65)) * (1 + .03 * Math.max(0, Math.sin(t * 5)));
  if (k > .01) { c.save(); c.translate(X, 1395); c.scale(k, k); c.fillStyle = '#F15A24'; c.shadowColor = 'rgba(241,90,36,.6)'; c.shadowBlur = 30; c.beginPath(); c.roundRect(-220, -44, 440, 88, 44); c.fill(); c.restore(); }
  text(c, 'rishikatha.com', X, 1398, '700 52px Poppins', '#FFFFFF', { pop: pk(1.65) });
  text(c, 'Follow @therishikatha for more!', X, 1482, '500 36px Poppins', '#CFE3DF', { pop: pk(1.95), maxW: 860 });
}

// ---------- the Nandi story: the temple, the field, the river, the gopuram ----------
// A Shiva linga on its yoni pedestal at (x, y) (the pedestal's foot), k = scale (about 240 wide at k 1), the spout to
// screen right; o: col (stone), lit (the lamp-lit edge colour), garland (true), glow (0..1 a light round it).
function linga(c, x, y, k, o = {}) {
  const col = o.col || '#151012', lit = o.lit || '#FFB060';
  if (o.glow) glow(c, x, y - 180 * k, 420 * k, '#FFC870', .6 * o.glow);
  c.save(); c.translate(x, y); c.scale(k, k);
  fillPath(c, 'M -90 0 L -80 -40 L 80 -40 L 90 0 Z', col);
  fillPath(c, 'M -120 -40 C -124 -60 -110 -76 -80 -80 L 80 -80 C 100 -80 120 -76 150 -70 L 190 -62 C 196 -56 192 -48 184 -48 L 120 -46 C 110 -40 100 -40 80 -40 L -80 -40 C -110 -40 -118 -32 -120 -40 Z', col);
  fillPath(c, 'M -56 -80 L -56 -200 C -56 -250 -30 -270 0 -270 C 30 -270 56 -250 56 -200 L 56 -80 Z', col);
  strokePath(c, 'M -46 -200 C -40 -250 -20 -262 0 -262', rgba(lit, .7), 4);
  for (let i = 0; i < 3; i++) strokePath(c, `M -44 ${-206 + i * 14} L 44 ${-206 + i * 14}`, rgba('#E8DCC4', .8), 4);   // the tripundra
  ellipse(c, 0, -192, 6, 6, '#C8202A');
  if (o.garland !== false) for (let i = 0; i < 11; i++) { const a = Math.PI * i / 10; ellipse(c, -Math.cos(a) * 56, -110 + Math.sin(a) * 26, 10, 10, i % 2 ? '#F0A030' : '#C8701E'); }
  strokePath(c, 'M -110 -56 L 140 -56', rgba(lit, .5), 3);
  c.restore();
}
// A brass oil lamp (deepa) at (x, y) (its foot), k scale; the flame flickers with t.
function deepa(c, x, y, k, t, a = 1, seed = 0) {
  const f = 1 + .12 * Math.sin(t * 11 + seed) + .08 * Math.sin(t * 17 + seed * 2);
  glow(c, x, y - 90 * k, 260 * k * f, '#FF9A3A', .55 * a); glow(c, x, y - 80 * k, 70 * k, '#FFE2A0', .7 * a);
  c.save(); c.translate(x, y); c.scale(k, k);
  fillPath(c, 'M -26 0 L 26 0 L 14 -10 L 6 -50 L -6 -50 L -14 -10 Z', '#8A5A1E');
  fillPath(c, 'M -40 -50 C -30 -66 30 -66 40 -50 C 30 -44 -30 -44 -40 -50 Z', '#C8902E');
  fillPath(c, `M -4 -58 C -10 -70 -6 ${-90 * f} 0 ${-104 * f} C 6 ${-90 * f} 10 -70 4 -58 Z`, '#FFB040');
  fillPath(c, `M -2 -60 C -5 -70 -3 ${-82 * f} 0 ${-90 * f} C 3 ${-82 * f} 5 -70 2 -60 Z`, '#FFF2C0');
  c.restore();
}
// The garbhagriha: a stone doorway (its sill centred at x, y; about 360 wide and 620 tall at k 1), dark inside, the
// linga within lit by its lamps; open (0..1) lights the inside up gold. col: the stone, lit: the edge facing the lamps.
function sanctum(c, x, y, k, t, o = {}) {
  const col = o.col || '#1E1412', open = o.open ?? .4;
  c.save(); c.translate(x, y); c.scale(k, k);
  const g = c.createLinearGradient(0, -560, 0, 0); g.addColorStop(0, '#070405'); g.addColorStop(1, mixCol('#1A0C08', '#6A3A14', open)); c.fillStyle = g; c.fillRect(-140, -560, 280, 560);
  glow(c, 0, -160, 380, '#FFB050', .25 + .5 * open);
  c.restore();
  linga(c, x, y - 4 * k, .62 * k, { glow: open, lit: '#FFC070' });
  deepa(c, x - 100 * k, y, .7 * k, t, 1, 1); deepa(c, x + 100 * k, y, .7 * k, t, 1, 2);
  c.save(); c.translate(x, y); c.scale(k, k);
  for (const s of [-1, 1]) { fillPath(c, `M ${s * 140} 0 L ${s * 140} -560 L ${s * 200} -580 L ${s * 200} 0 Z`, col); for (let i = 0; i < 6; i++) fillPath(c, `M ${s * 146} ${-60 - i * 90} L ${s * 194} ${-60 - i * 90} L ${s * 194} ${-70 - i * 90} L ${s * 146} ${-70 - i * 90} Z`, rgba('#FFB070', .14)); strokePath(c, `M ${s * 141} -10 L ${s * 141} -556`, rgba('#FFB070', .45), 3); }
  fillPath(c, 'M -230 -560 L 230 -560 L 230 -640 L -230 -640 Z', col);
  fillPath(c, 'M -170 -640 C -120 -720 120 -720 170 -640 Z', col);   // the arch over the lintel
  ellipse(c, 0, -690, 26, 26, rgba('#FFB070', .35));
  fillPath(c, 'M -260 0 L 260 0 L 250 -16 L -250 -16 Z', col);   // the sill
  c.restore();
}
// A ploughed field at dawn, furrows running from the horizon (y) toward the viewer; k = 0..1 a glow rising from vx.
function furrows(c, y, t, o = {}) {
  const g = c.createLinearGradient(0, y, 0, H); g.addColorStop(0, o.far || '#4A2A22'); g.addColorStop(1, o.near || '#140A08'); c.fillStyle = g; c.fillRect(-300, y, W + 600, H - y + 400);
  for (let i = -14; i <= 14; i++) { const x0 = 540 + i * 30, x1 = 540 + i * 220; strokePath(c, `M ${x0} ${y} L ${x1} ${H + 200}`, rgba(o.line || '#0A0504', .55), 3 + Math.abs(i) * .3); strokePath(c, `M ${x0 + 6} ${y} L ${x1 + 40} ${H + 200}`, rgba(o.lit || '#B0603A', .18), 2); }
}
// A river at night: a dark band from y to y + h with a moon's broken reflection at mx.
function river(c, y, h, t, mx = 540, col = '#0C1428') {
  fillPath(c, `M -200 ${y} L ${W + 200} ${y} L ${W + 200} ${y + h} L -200 ${y + h} Z`, col);
  for (let i = 0; i < 26; i++) { const yy = y + 10 + (i / 26) ** 1.4 * (h - 20), w = 30 + i * 9, x = mx + Math.sin(t * 1.2 + i * 1.7) * 14; strokePath(c, `M ${x - w / 2} ${yy} L ${x + w / 2} ${yy}`, rgba('#C8D6F5', .5 - i * .015), 2 + i * .15); }
  for (let i = 0; i < 40; i++) { const xx = hash(i * 3.3) * W, yy = y + hash(i * 5.1) * h, w = 20 + hash(i) * 60; strokePath(c, `M ${xx + Math.sin(t + i) * 10} ${yy} l ${w} 0`, rgba('#7A8CB8', .18), 2); }
}
// A south Indian gopuram (temple gate tower) silhouette, its foot centred at (x, y), k scale (about 520 wide and 900
// tall at k 1), with the gateway open at the bottom (door 0..1 how bright the inside is).
function gopuram(c, x, y, k, o = {}) {
  const col = o.col || '#140C0E', lit = o.lit || '#FFB070';
  c.save(); c.translate(x, y); c.scale(k, k);
  fillPath(c, 'M -260 0 L -260 -260 L 260 -260 L 260 0 Z', col);
  for (let i = 0; i < 6; i++) { const w = 240 - i * 30, y0 = -260 - i * 100; fillPath(c, `M ${-w} ${y0} L ${w} ${y0} L ${w - 22} ${y0 - 100} L ${-w + 22} ${y0 - 100} Z`, col);
    strokePath(c, `M ${-w} ${y0 - 2} L ${w} ${y0 - 2}`, rgba(lit, .35), 3);
    for (let j = 0; j < 5 - Math.floor(i / 2); j++) { const xx = lerp(-w + 40, w - 40, (j + .5) / (5 - Math.floor(i / 2))); fillPath(c, `M ${xx - 12} ${y0 - 20} L ${xx + 12} ${y0 - 20} L ${xx + 12} ${y0 - 70} C ${xx + 12} ${y0 - 84} ${xx - 12} ${y0 - 84} ${xx - 12} ${y0 - 70} Z`, rgba(lit, .12)); } }
  fillPath(c, 'M -110 -860 C -110 -930 110 -930 110 -860 Z', col);   // the barrel vault on top
  for (let i = 0; i < 5; i++) { const xx = -80 + i * 40; fillPath(c, `M ${xx - 8} -900 L ${xx + 8} -900 L ${xx} -950 Z`, col); }   // kalashas
  const d = o.door ?? 0, g = c.createLinearGradient(0, -230, 0, 0); g.addColorStop(0, mixCol('#08040A', '#C07A30', d * .6)); g.addColorStop(1, mixCol('#0A0606', '#FFC870', d)); c.fillStyle = g;
  c.beginPath(); c.moveTo(-80, 0); c.lineTo(-80, -170); c.quadraticCurveTo(0, -240, 80, -170); c.lineTo(80, 0); c.closePath(); c.fill();
  c.restore();
  if (o.door) glow(c, x, y - 100 * k, 300 * k, '#FFC870', .5 * o.door);
}
