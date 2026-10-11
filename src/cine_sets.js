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
