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
//   the Bhramari story: flyBee / beeCloud / beeStream (small bees flying, in a ball, along a path), swarm(c, t, o)
//     (thousands: 'stream', 'form' into shapePoints(), 'engulf'), bee(c, x, y, o) (the macro bee from above, six legs
//     that light up one by one), throne(c, o) (the demon's rock throne, front view), lotusLight() (Brahma's boon)
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
// o.hero (a PICS key, e.g. 'book4'): a new book's launch instead: its cover big in the middle with o.badge on its
// corner ('NEW · 16 OCT'), o.price under it, the books in o.books in a small row below, then o.note (use title, not line).
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
  if (o.hero) {
    // a new book: its cover big in the middle (with a badge on its corner), the books already out in a row under it
    glow(c, X, 900, 360, '#FFC870', .35 + .08 * Math.sin(t * 2));
    picture(c, PICS[o.hero], X, 900, 310, 310, { rot: br, pop: pk(.6), r: 12, shadow: 30, glow: ['rgba(255,200,120,.45)', 50] });
    if (o.badge) { const kb = popK(pk(1.0)); if (kb > .01) { c.save(); c.translate(X + 150, 1030); c.rotate(-.12); c.scale(kb, kb); c.fillStyle = '#F15A24'; c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 16; c.beginPath(); c.roundRect(-112, -30, 224, 60, 30); c.fill(); c.restore(); text(c, o.badge, X + 150, 1032, '700 30px Poppins', '#FFFFFF', { pop: pk(1.0) }); } }
    if (o.price) text(c, o.price, X, 1112, '700 44px Poppins', '#FFFFFF', { pop: pk(1.15), maxW: 860 });
    books.forEach((b, j) => picture(c, PICS[b], X + (j - 1) * 140, 1205, 120, 120, { rot: (j - 1) * .06, pop: pk(1.3 + j * .1), r: 6, shadow: 14 }));
    if (o.note) text(c, o.note, X, 1300, '500 34px Poppins', '#FF9A6A', { pop: pk(1.55), maxW: 860 });
  } else {
    books.forEach((b, j) => { const i = [-1, 1, 0][j] ?? 0; picture(c, PICS[b], X + i * 215, 975 + Math.abs(i) * 30, 270, 270, { rot: i * .1 + br, pop: pk(.7 + j * .12), r: 10, shadow: 26, glow: ['rgba(255,196,120,.28)', 40] }); });
    if (o.price) text(c, o.price, X, 1238, '700 54px Poppins', '#FFFFFF', { pop: pk(1.25), maxW: 860 });
    if (o.note) text(c, o.note, X, 1302, '500 34px Poppins', '#FF9A6A', { pop: pk(1.45), maxW: 860 });
  }
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

// ---------- the Bhramari story: bees, the swarm, the demon's throne, Brahma's lotus ----------
// A small flying bee as a cached sprite (side view, flying right): a black body with a gold band and fuzz, violet-blue
// wings. Two wing frames; gold (true) draws the divine bee, glowing gold. Drawn 32 px long at k 1.
function beeSprite(frame, gold) {
  return sprite(`bee${frame}${gold ? 'g' : ''}`, 64, 48, (g) => {
    g.translate(32, 26);
    const body = gold ? '#FFC64A' : '#121016', band = gold ? '#FFF2B0' : '#C8962E', wing = gold ? 'rgba(255,240,190,.75)' : 'rgba(170,175,255,.55)';
    if (gold) { const gr = g.createRadialGradient(0, 0, 0, 0, 0, 30); gr.addColorStop(0, 'rgba(255,200,90,.5)'); gr.addColorStop(1, 'rgba(255,200,90,0)'); g.fillStyle = gr; g.fillRect(-32, -26, 64, 48); }
    const wy = frame ? -4 : -14, wr = frame ? .2 : -.5;
    g.fillStyle = wing; g.beginPath(); g.ellipse(-2, wy, 13, 6, wr, 0, TAU); g.fill();
    g.beginPath(); g.ellipse(-8, wy + 3, 9, 4.5, wr - .3, 0, TAU); g.fill();
    g.fillStyle = body; g.beginPath(); g.ellipse(-8, 4, 12, 8, .15, 0, TAU); g.fill();       // the abdomen
    g.fillStyle = band; g.fillRect(-12, -3, 4, 14);
    g.fillStyle = body; g.beginPath(); g.ellipse(4, 1, 7.5, 7, 0, 0, TAU); g.fill();         // the thorax
    g.fillStyle = gold ? '#FFF6D0' : '#7A5A2A'; g.beginPath(); g.ellipse(4, -3, 6, 3.2, 0, 0, TAU); g.fill();   // fuzz
    g.fillStyle = body; g.beginPath(); g.ellipse(12, 3, 4.8, 4.8, 0, 0, TAU); g.fill();      // the head
    g.strokeStyle = body; g.lineWidth = 1.4; g.beginPath(); g.moveTo(14, 0); g.quadraticCurveTo(19, -6, 21, -5); g.stroke();
    for (const x of [0, 4, 8]) { g.beginPath(); g.moveTo(x, 6); g.lineTo(x - 3, 13); g.stroke(); }
  });
}
// One flying bee at (x, y): k size, dir (+1 right, -1 left), t (wing flaps), seed, gold, rot (radians), a (alpha)
function flyBee(c, x, y, k, dir, t, seed = 0, gold = false, rot = 0, a = 1) {
  const s = beeSprite(Math.floor(t * 38 + seed * 7) % 2, gold), w = 64 * k * .5, h = 48 * k * .5;
  c.save(); c.globalAlpha *= a; c.translate(x, y); if (rot) c.rotate(rot); c.scale(dir < 0 ? -1 : 1, 1); c.drawImage(s, -w / 2, -h / 2, w, h); c.restore();
}
// A ball of bees swirling round (x, y), radius r: each on its own tilted orbit. o: n, seed, k (bee size), gold (0..1
// the share of gold bees), speed
function beeCloud(c, x, y, r, t, o = {}) {
  const n = o.n ?? 40, seed = o.seed ?? 0, k = o.k ?? 1, sp = o.speed ?? 1, gold = o.gold ?? .35;
  for (let i = 0; i < n; i++) {
    const h = (j) => hash(i * 7.31 + seed * 1.7 + j), w = (2 + 3 * h(1)) * (h(2) < .5 ? -1 : 1) * sp, a = h(3) * TAU + t * w;
    const rr = r * (.35 + .65 * h(4)), tilt = (h(5) - .5) * 1.4, px = Math.cos(a) * rr, py = Math.sin(a) * rr * .45;
    const bx = x + px * Math.cos(tilt) - py * Math.sin(tilt), by = y + px * Math.sin(tilt) + py * Math.cos(tilt) + Math.sin(t * 5 + i) * 3;
    flyBee(c, bx, by, k * (.75 + .5 * (Math.sin(a) * .5 + .5)), -Math.sin(a) * w, t, i, h(6) < gold);
  }
}
// Bees streaming along the points P (Catmull-Rom through them), flowing from the first to the last and thinning out.
// o: n, seed, k, spread (px across the path), speed (path lengths a second), gold
function beeStream(c, P, t, o = {}) {
  const C = through(P, 10), n = o.n ?? 20, seed = o.seed ?? 0, k = o.k ?? 1, sp = o.speed ?? .45, spread = o.spread ?? 30, gold = o.gold ?? .3;
  for (let i = 0; i < n; i++) {
    const h = (j) => hash(i * 5.17 + seed * 3.3 + j), u = frac(h(1) + t * sp * (.7 + .6 * h(2))), f = u * (C.length - 1), j = Math.min(C.length - 2, Math.floor(f));
    const p = [lerp(C[j][0], C[j + 1][0], f - j), lerp(C[j][1], C[j + 1][1], f - j)], dx = C[j + 1][0] - C[j][0], dy = C[j + 1][1] - C[j][1], d = Math.hypot(dx, dy) || 1;
    const off = spread * (h(3) - .5) * 2 * (.4 + u) + vnoise(t * 1.3 + i, seed) * spread * .6;
    flyBee(c, p[0] - dy / d * off, p[1] + dx / d * off, k * (1 - u * .4), dx, t, i, h(4) < gold, 0, clamp(u * 8) * clamp((1 - u) * 4));
  }
}
// Points inside a shape: draw(ctx) is drawn once on a full-frame canvas and n opaque pixels are picked (cached by key).
const SHAPE_PTS = new Map();
function shapePoints(key, draw, n = 2000, seed = 1) {
  if (SHAPE_PTS.has(key)) return SHAPE_PTS.get(key);
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const g = cv.getContext('2d'); draw(g);
  const d = g.getImageData(0, 0, W, H).data, all = [];
  for (let y = 0; y < H; y += 3) for (let x = 0; x < W; x += 3) if (d[(y * W + x) * 4 + 3] > 128) all.push([x, y]);
  const rnd = lcg(seed), pts = [];
  for (let i = 0; i < n && all.length; i++) pts.push(all[Math.floor(rnd() * all.length)]);
  SHAPE_PTS.set(key, pts); return pts;
}
// The great swarm: n bees, a pure function of t. Modes (o.mode):
//   'stream': along o.path (points), o.spread px wide (a number, or [start, end]), flowing at o.speed
//   'form':   flying in from o.from ([x0, y0, x1, y1], a box) to o.pts (points, e.g. from shapePoints) as o.gather goes
//             0 → 1; formed bees keep buzzing in place (o.jit px)
//   'engulf': a dense churning cloud round (o.x, o.y), o.r wide (o.ry tall)
// o: seed, k (bee size), gold (0..1 the share of gold bees), a (alpha), dots (true: far bees as dots, cheaper)
function swarm(c, t, o) {
  const n = o.n ?? 1500, seed = o.seed ?? 0, k = o.k ?? .6, gold = o.gold ?? .15, mode = o.mode || 'stream';
  let C; if (mode === 'stream') C = through(o.path, 12);
  c.save(); c.globalAlpha *= o.a ?? 1;
  for (let i = 0; i < n; i++) {
    const h = (j) => hash(i * 3.71 + seed * 11.3 + j * 1.37);
    let x, y, dir = 1, kk = k * (.6 + .8 * h(9));
    if (mode === 'stream') {
      const u = frac(h(1) + t * (o.speed ?? .3) * (.75 + .5 * h(2))), f = u * (C.length - 1), j = Math.min(C.length - 2, Math.floor(f));
      const px = lerp(C[j][0], C[j + 1][0], f - j), py = lerp(C[j][1], C[j + 1][1], f - j), dx = C[j + 1][0] - C[j][0], dy = C[j + 1][1] - C[j][1], d = Math.hypot(dx, dy) || 1;
      const sp = Array.isArray(o.spread) ? lerp(o.spread[0], o.spread[1], u) : (o.spread ?? 120);
      const off = sp * ((h(3) - .5) * 2 * .7 + vnoise(t * .9 + i * .13, seed + 1) * .3), along = vnoise(t * 1.1 + i * .7, seed + 2) * sp * .25;
      x = px - dy / d * off + dx / d * along; y = py + dx / d * off + dy / d * along; dir = dx;
      if (o.fade !== false) c.globalAlpha = (o.a ?? 1) * clamp(u * 10) * clamp((1 - u) * 6);
    } else if (mode === 'form') {
      const [x0, y0, x1, y1] = o.from, P = o.pts[i % o.pts.length], d0 = h(4) * .45, kf = easeIO(seg(o.gather ?? 1, d0, d0 + .55));
      const sx = lerp(x0, x1, h(5)), sy = lerp(y0, y1, h(6)), jit = (o.jit ?? 4) + (1 - kf) * 60;
      const bend = Math.sin(kf * Math.PI) * (h(7) - .5) * 400;
      x = lerp(sx, P[0], kf) + bend + vnoise(t * 3 + i, seed) * jit; y = lerp(sy, P[1], kf) - Math.sin(kf * Math.PI) * 120 * h(8) + vnoise(t * 3 + i + 50, seed) * jit * .7;
      dir = P[0] - sx; kk *= lerp(1, o.kForm ?? .7, kf);
    } else {
      const a = h(1) * TAU + t * (1.5 + 3 * h(2)) * (h(3) < .5 ? -1 : 1), rr = Math.sqrt(h(4)) * o.r, ry = (o.ry ?? o.r) / o.r;
      x = o.x + Math.cos(a) * rr + vnoise(t * 2 + i, seed) * 30; y = o.y + Math.sin(a) * rr * ry + vnoise(t * 2 + i + 40, seed) * 30; dir = -Math.sin(a) * (h(3) < .5 ? -1 : 1);
    }
    if (o.dots && kk < .45) { c.fillStyle = h(10) < gold ? '#FFC64A' : '#0E0C12'; c.fillRect(x - kk * 5, y - kk * 3, kk * 10, kk * 6); }
    else flyBee(c, x, y, kk, dir, t, i, h(10) < gold);
  }
  c.restore();
}
// The macro bee, seen from above, head up, about 330 long at k 1, centred at (x, y): a black carpenter bee (the
// bhramara) with a gold-furred thorax and violet-blue wings. o: k, rot, t, lit (0..6: how many legs glow, counted
// left front, left middle, left hind, right front, right middle, right hind), wings (0 folded .. 1 buzzing), gold (0..1 glow)
function bee(c, x, y, o = {}) {
  const k = o.k ?? 1, t = o.t || 0, lit = o.lit ?? 0, wg = o.wings ?? 0, B = '#0E0C12', Bs = '#26222E', fur = '#B8862E', furLt = '#F2C25A';
  c.save(); c.translate(x, y); c.rotate(o.rot || 0); c.scale(k, k);
  if (o.gold) glow(c, 0, 0, 320, '#FFC860', .35 * o.gold);
  // six legs, three each side: coxa at the thorax, femur out, tibia and tarsus bending back to the ground
  const LEGS = [[-1, -62, [[-60, -90], [-104, -150]], 0], [-1, -40, [[-82, -36], [-140, -40]], 1], [-1, -20, [[-70, 30], [-120, 110]], 2],
                [1, -62, [[60, -90], [104, -150]], 3], [1, -40, [[82, -36], [140, -40]], 4], [1, -20, [[70, 30], [120, 110]], 5]];
  for (const [s, y0, [knee, foot], idx] of LEGS) {
    const on = lit > idx ? clamp(lit - idx) : 0, col = on ? mixCol(Bs, '#FFD27A', on) : Bs, tw = Math.sin(t * 9 + idx) * 1.5;
    if (on) { glow(c, (s * 18 + knee[0]) / 2, (y0 + knee[1]) / 2, 120, '#FFB43A', .5 * on); glow(c, foot[0], foot[1], 70, '#FFD27A', .6 * on); }
    limb(c, [[s * 18, y0], [knee[0], knee[1] + tw], [(knee[0] + foot[0]) / 2 + s * 4, (knee[1] + foot[1]) / 2], [foot[0], foot[1]]], [14, 10, 7, 4], col);
    for (let j = 0; j < 5; j++) { const u = .3 + j * .15, px = lerp(knee[0], foot[0], u), py = lerp(knee[1], foot[1], u); strokePath(c, `M ${px} ${py} l ${s * 6} -4`, col, 1.4); }   // the hairs
    ellipse(c, foot[0], foot[1], 5, 4, col);
  }
  // wings: folded back over the abdomen, or buzzing out to the sides (a blur of two positions)
  const wing = (s, ang, a) => { c.save(); c.translate(s * 16, -54); c.rotate(s * ang); c.globalAlpha *= a;
    fillPath(c, `M 0 0 C ${s * 30} -20 ${s * 120} -10 ${s * 150} 30 C ${s * 160} 60 ${s * 120} 80 ${s * 70} 70 C ${s * 40} 60 ${s * 10} 30 0 0 Z`, 'rgba(120,110,230,.42)');
    strokePath(c, `M 0 0 C ${s * 40} 4 ${s * 90} 20 ${s * 140} 40 M ${s * 30} 10 C ${s * 50} 40 ${s * 70} 60 ${s * 90} 70`, 'rgba(200,190,255,.45)', 1.6); c.restore(); };
  for (const s of [-1, 1]) {
    if (wg > .05) { const f = Math.sin(t * 80) * .5 + .5; wing(s, lerp(1.3, .5, f) * wg + (1 - wg) * 1.9, .55); wing(s, lerp(.5, 1.3, f) * wg + (1 - wg) * 1.9, .35); }
    else wing(s, 1.95, .8);
  }
  // abdomen: black, glossy, with a faint gold band
  const ABD = 'M 0 -8 C 50 -6 70 30 68 78 C 66 124 36 152 0 156 C -36 152 -66 124 -68 78 C -70 30 -50 -6 0 -8 Z';
  fillPath(c, ABD, B);
  inside(c, ABD, () => { for (let i = 0; i < 4; i++) strokePath(c, `M -70 ${28 + i * 30} Q 0 ${46 + i * 30} 70 ${28 + i * 30}`, rgba('#3A3448', .9), 3); strokePath(c, 'M -20 10 C -26 50 -24 100 -12 140', 'rgba(150,150,255,.35)', 8); });
  // thorax: round and furred gold
  ellipse(c, 0, -50, 44, 42, B);
  for (let i = 0; i < 70; i++) { const a = hash(i * 1.3) * TAU, r = Math.sqrt(hash(i * 2.1)) * 38; strokePath(c, `M ${Math.cos(a) * r} ${-50 + Math.sin(a) * r * .95} l ${Math.cos(a) * 6} ${Math.sin(a) * 6}`, hash(i * 3) < .5 ? fur : furLt, 2.2); }
  // head: black, two big eyes, antennae
  ellipse(c, 0, -112, 30, 26, B);
  for (const s of [-1, 1]) { ellipse(c, s * 18, -114, 11, 17, '#1C1828', s * .2); ellipse(c, s * 20, -120, 3.5, 5, 'rgba(210,210,255,.6)'); strokePath(c, `M ${s * 8} -134 C ${s * 14} -170 ${s * 34} -190 ${s * (52 + Math.sin(t * 3 + s) * 4)} -196`, B, 4); }
  c.restore();
}
// The demon's throne, front view, in the seated figure's units (the seat at -300, the back up to about -1060, the arms
// at -430); draw it with the figure's transform. o.layer 'back' (the back and seat) | 'front' (the armrests' fronts).
// col: the stone, lit: the edge colour.
function throne(c, o = {}) {
  const col = o.col || '#120E14', sh = o.sh || '#07060A', lit = o.lit || '#FF9A6A';
  if (o.layer !== 'front') {
    // the back: a tall slab with a pointed top and two horns curving out
    fillPath(c, 'M -200 -300 L -210 -840 C -212 -930 -120 -1010 0 -1060 C 120 -1010 212 -930 210 -840 L 200 -300 Z', col);
    for (const s of [-1, 1]) {
      fillPath(c, `M ${s * 150} -940 C ${s * 230} -980 ${s * 300} -1060 ${s * 300} -1180 C ${s * 270} -1090 ${s * 220} -1030 ${s * 168} -1000 Z`, col);
      strokePath(c, `M ${s * 160} -950 C ${s * 230} -990 ${s * 290} -1070 ${s * 300} -1180`, rgba(lit, .55), 3);
    }
    inside(c, 'M -200 -300 L -210 -840 C -212 -930 -120 -1010 0 -1060 C 120 -1010 212 -930 210 -840 L 200 -300 Z', () => {
      fillPath(c, 'M -150 -320 L -156 -820 C -150 -900 -80 -950 0 -980 C 80 -950 150 -900 156 -820 L 150 -320 Z', sh);
      for (let i = 0; i < 5; i++) strokePath(c, `M -150 ${-420 - i * 100} L 150 ${-420 - i * 100}`, rgba(lit, .08), 2);
    });
    strokePath(c, 'M -210 -840 C -212 -930 -120 -1010 0 -1060 C 120 -1010 212 -930 210 -840', rgba(lit, .6), 3);
    // a skull-and-horn crest on top
    ellipse(c, 0, -1000, 34, 30, sh); for (const s of [-1, 1]) ellipse(c, s * 12, -1002, 8, 9, rgba(lit, .55));
    // the seat block
    fillPath(c, 'M -230 -300 L 230 -300 L 240 -250 L -240 -250 Z', col); strokePath(c, 'M -230 -300 L 230 -300', rgba(lit, .6), 3);
    fillPath(c, 'M -240 -250 L 240 -250 L 250 0 L -250 0 Z', sh);
  }
  if (o.layer !== 'back') {
    for (const s of [-1, 1]) {
      fillPath(c, `M ${s * 170} -430 L ${s * 290} -440 C ${s * 320} -440 ${s * 330} -420 ${s * 326} -400 L ${s * 300} -380 L ${s * 300} 0 L ${s * 240} 0 L ${s * 240} -380 L ${s * 170} -390 Z`, col);
      strokePath(c, `M ${s * 170} -430 L ${s * 290} -440 C ${s * 320} -440 ${s * 330} -420 ${s * 326} -400`, rgba(lit, .7), 3);
      ellipse(c, s * 308, -420, 20, 20, sh); strokePath(c, `M ${s * 296} -428 a 12 12 0 0 1 22 6`, rgba(lit, .7), 2.4);   // a carved knob
    }
  }
}
// Brahma's boon: a golden lotus of light at (x, y), r wide, its petals opening (open 0..1), rays and a glow.
function lotusLight(c, x, y, r, t, open = 1) {
  glow(c, x, y, r * 4, '#FFC860', .55 * open); glow(c, x, y, r * 1.4, '#FFF2C8', .7 * open);
  rays(c, x, y, { n: 18, dir: -Math.PI / 2, spread: Math.PI * 2, len: r * 5 * open, w: r * .9, col: '#FFD890', a: .35 * open, t });
  c.save(); c.translate(x, y); c.globalCompositeOperation = 'lighter';
  for (const [ring, n, len, wid] of [[0, 8, 1, .32], [1, 8, .78, .3], [2, 6, .55, .28]]) for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (i + ring * .5) / n * TAU * .5 - Math.PI * .25 + Math.sin(t * .6 + i) * .02, sp = lerp(.15, 1, open);
    const ang = -Math.PI / 2 + (a + Math.PI / 2) * sp, L = r * len, w = r * wid;
    c.save(); c.rotate(ang + Math.PI / 2); fillPath(c, `M 0 0 C ${w} ${-L * .3} ${w * .8} ${-L * .8} 0 ${-L} C ${-w * .8} ${-L * .8} ${-w} ${-L * .3} 0 0 Z`, rgba(['#FF9A4A', '#FFC060', '#FFE6A0'][ring], .55)); c.restore();
  }
  c.restore();
}

// ---------- the sun story (ad 16): the sun, the trishul in flight, frost, Ganesha drawn in light ----------
// The sun as a disc of radius r at (x, y). o.life: 1 blazing (white-gold core, a turning corona of rays, a huge glow),
// 0 dead (a black disc with a thin cold corona, as in an eclipse); between, it flickers. o.crack (0..1): fissures of
// light across it; o.rays (0..1, default life) the length of the corona.
function sunDisc(c, x, y, r, t, o = {}) {
  const life = o.life ?? 1, crack = o.crack ?? 0, fl = life > 0 && life < 1 ? .85 + .15 * Math.sin(t * 37) * Math.sin(t * 13) : 1, L = life * fl, ry = o.rays ?? life;
  if (L > .01) { glow(c, x, y, r * 7, '#FF8A2A', .35 * L); glow(c, x, y, r * 3.4, '#FFB44A', .6 * L); glow(c, x, y, r * 1.8, '#FFE6A0', .8 * L); }
  // the corona: long thin rays turning slowly, warm when alive, cold white when dead
  c.save(); c.translate(x, y); c.rotate(t * .05); c.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 48; i++) { const a = i * TAU / 48 + Math.sin(i * 7.3) * .04, len = r * (.35 + .55 * hash(i * 3.1)) * (.3 + ry) * (1 + .1 * Math.sin(t * 2 + i)), w = r * (.018 + .02 * hash(i));
    const col = mixCol('#C8D4F0', '#FFD27A', life); c.fillStyle = rgba(col, .16 + .3 * Math.max(L, (1 - life) * .55));
    c.beginPath(); c.moveTo(Math.cos(a - w / r) * r, Math.sin(a - w / r) * r); c.lineTo(Math.cos(a) * (r + len), Math.sin(a) * (r + len)); c.lineTo(Math.cos(a + w / r) * r, Math.sin(a + w / r) * r); c.fill(); }
  c.restore();
  if (life < 1) { c.save(); c.globalCompositeOperation = 'lighter'; c.strokeStyle = rgba('#DCE6FF', .5 * (1 - life)); c.lineWidth = r * .04; c.shadowColor = '#DCE6FF'; c.shadowBlur = r * .25; c.beginPath(); c.arc(x, y, r * 1.01, 0, TAU); c.stroke(); c.restore(); }
  // the disc
  const g = c.createRadialGradient(x - r * .2, y - r * .2, r * .1, x, y, r);
  g.addColorStop(0, mixCol('#0A0A10', '#FFFBEA', L)); g.addColorStop(.7, mixCol('#06060A', '#FFE7A8', L)); g.addColorStop(1, mixCol('#020204', '#FFC25A', L));
  c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
  if (crack > .01) {
    const rnd = lcg(77); c.save(); c.globalCompositeOperation = 'lighter'; c.lineCap = 'round';
    for (let i = 0; i < 9; i++) { let a = rnd() * TAU, px = x + Math.cos(a) * r * .15 * rnd(), py = y + Math.sin(a) * r * .15 * rnd(); const n = Math.ceil(6 * crack);
      c.strokeStyle = rgba('#FFB04A', .9 * crack); c.lineWidth = r * .025; c.shadowColor = '#FF8A2A'; c.shadowBlur = r * .1; c.beginPath(); c.moveTo(px, py);
      for (let k = 0; k < n; k++) { a += (rnd() - .5) * 1.2; px += Math.cos(a) * r * .16; py += Math.sin(a) * r * .16; if (Math.hypot(px - x, py - y) > r * .98) break; c.lineTo(px, py); } c.stroke(); }
    c.restore();
  }
}
// Shiva's trishul alone, as a prop in flight: the junction of the prongs at (x, y), pointing along rot (0 = up),
// k scale (the prongs about 130 tall and the shaft 1100 long at k 1); o.glow (0..1) a hot white edge for a thrown one.
function trishulProp(c, x, y, k, rot, o = {}) {
  const S = SHV, X = 0, gl = o.glow ?? 0;
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(k, k); c.translate(0, 1138);
  if (gl > .01) { c.shadowColor = '#FFE6B0'; c.shadowBlur = 40 * gl; }
  fillPath(c, `M ${X - 6} 0 L ${X - 6} -1130 L ${X + 6} -1130 L ${X + 6} 0 Z`, S.steelSh);
  fillPath(c, `M ${X - 1} 0 L ${X - 1} -1130 L ${X + 5} -1130 L ${X + 5} 0 Z`, S.steel);
  fillPath(c, `M ${X - 46} -1138 C ${X - 52} -1170 ${X - 48} -1205 ${X - 34} -1228 C ${X - 38} -1200 ${X - 36} -1170 ${X - 22} -1146 Z M ${X + 46} -1138 C ${X + 52} -1170 ${X + 48} -1205 ${X + 34} -1228 C ${X + 38} -1200 ${X + 36} -1170 ${X + 22} -1146 Z`, S.steel);
  fillPath(c, `M ${X - 48} -1128 C ${X - 30} -1150 ${X + 30} -1150 ${X + 48} -1128 L ${X + 40} -1122 C ${X + 20} -1138 ${X - 20} -1138 ${X - 40} -1122 Z`, S.steelSh);
  fillPath(c, `M ${X} -1268 C ${X + 14} -1240 ${X + 12} -1180 ${X + 6} -1138 L ${X - 6} -1138 C ${X - 12} -1180 ${X - 14} -1240 ${X} -1268 Z`, S.steel);
  fillPath(c, `M ${X} -1268 C ${X + 14} -1240 ${X + 12} -1180 ${X + 6} -1138 L ${X} -1138 Z`, S.steelSh);
  c.shadowBlur = 0;
  if (gl > .01) { c.globalCompositeOperation = 'lighter'; strokePath(c, `M ${X} -1260 L ${X} -40`, rgba('#FFF4D8', .55 * gl), 5); }
  c.restore();
}
// Frost over the ground from y down: an icy crust (k 0..1 how far it has spread in from the edges) with branching
// crystals and glints.
function frost(c, y, k, t, o = {}) {
  if (k <= .01) return;
  const col = o.col || '#BFD6F2', g = c.createLinearGradient(0, y, 0, H + 200); g.addColorStop(0, rgba(col, .0)); g.addColorStop(.25, rgba(col, .22 * k)); g.addColorStop(1, rgba(col, .4 * k));
  c.fillStyle = g; c.fillRect(-300, y, W + 600, H - y + 400);
  const rnd = lcg(o.seed || 31); c.save(); c.lineCap = 'round';
  for (let i = 0; i < 26; i++) {
    const side = i % 2 ? 1 : -1, x0 = side > 0 ? W + 40 : -40, y0 = y + 30 + rnd() * (H - y), reach = (260 + rnd() * 520) * k;
    let a = side > 0 ? Math.PI + (rnd() - .5) * .8 : (rnd() - .5) * .8, px = x0, py = y0, len = 0;
    c.strokeStyle = rgba('#EAF4FF', .26); c.lineWidth = 1.2;
    while (len < reach) { const st = 26 + rnd() * 20, nx = px + Math.cos(a) * st, ny = py + Math.sin(a) * st * .6;
      c.beginPath(); c.moveTo(px, py); c.lineTo(nx, ny); c.stroke();
      for (const s of [-1, 1]) { const b = a + s * 1.1, bl = st * .18; c.beginPath(); c.moveTo(nx, ny); c.lineTo(nx + Math.cos(b) * bl, ny + Math.sin(b) * bl * .6); c.stroke(); }
      px = nx; py = ny; len += st; a += (rnd() - .5) * .5; }
  }
  for (let i = 0; i < 60; i++) { const x = hash(i * 7.7) * W, yy = y + 20 + hash(i * 3.9) * (H - y), tw = Math.max(0, Math.sin(t * 3 + i * 2.1)); if (hash(i * 1.3) < k) ellipse(c, x, yy, 2 + tw * 2, 2 + tw * 2, rgba('#FFFFFF', .7 * tw)); }
  c.restore();
}
// Ganesha's head from the front, drawn as lines of light: the tall mukut, the great ears, the trunk curling to his
// left, the long tusk and the broken one. At (x, y) (the forehead), k scale (about 700 wide and 950 tall at k 1).
// draw (0..1): how much of the line has been drawn; fill (0..1): the shape filled in behind the lines.
const GANESHA_LINES = [
  'M -110 -150 L -96 -300 L -60 -340 L -30 -420 L 0 -500 L 30 -420 L 60 -340 L 96 -300 L 110 -150 Z',
  'M -96 -300 L 96 -300 M -60 -340 L 60 -340 M -30 -420 L 30 -420',
  'M -110 -150 C -150 -110 -150 30 -110 110 C -90 150 -60 170 -38 186',
  'M 110 -150 C 150 -110 150 30 110 110 C 90 150 60 170 38 186',
  'M -128 -110 C -230 -180 -340 -120 -350 0 C -360 90 -320 170 -250 200 C -200 220 -150 190 -118 140',
  'M 128 -110 C 230 -180 340 -120 350 0 C 360 90 320 170 250 200 C 200 220 150 190 118 140',
  'M -38 186 C -48 280 -30 380 20 440 C 60 486 120 480 130 430 C 136 396 104 384 90 404',
  'M 38 186 C 34 260 44 330 76 372 C 92 392 104 390 110 380',
  'M -62 168 C -100 220 -120 270 -104 320',
  'M 62 168 C 74 186 80 200 76 212',
  'M -60 40 C -50 30 -36 30 -26 40 M 26 40 C 36 30 50 30 60 40',
  'M 0 -110 L 0 -60 M -40 -100 Q 0 -120 40 -100',
];
const GANESHA_FILL = 'M -110 -150 L -96 -300 L -60 -340 L -30 -420 L 0 -500 L 30 -420 L 60 -340 L 96 -300 L 110 -150 C 230 -180 340 -120 350 0 C 360 90 320 170 250 200 C 200 220 150 190 118 140 C 90 150 60 170 38 186 C 34 260 44 330 76 372 C 92 392 104 390 110 380 C 136 396 136 470 70 476 C 20 470 -40 380 -38 186 C -60 170 -90 150 -118 140 C -150 190 -200 220 -250 200 C -320 170 -360 90 -350 0 C -340 -120 -230 -180 -110 -150 Z';
function ganeshaLine(c, x, y, k, draw, o = {}) {
  const col = o.col || '#FFD27A', fill = o.fill ?? 0;
  c.save(); c.translate(x, y); c.scale(k, k);
  if (fill > .01) { fillPath(c, GANESHA_FILL, rgba(o.fillCol || '#2A1606', fill)); }
  c.lineCap = 'round'; c.lineJoin = 'round';
  const n = GANESHA_LINES.length;
  for (let pass = 0; pass < 2; pass++) {
    c.globalCompositeOperation = pass ? 'lighter' : 'source-over'; c.strokeStyle = pass ? rgba('#FFF4D8', .9) : col; c.lineWidth = (pass ? 3 : 9) / k; c.shadowColor = col; c.shadowBlur = pass ? 0 : 30;
    GANESHA_LINES.forEach((d, i) => { const u = clamp(draw * n * .55 - i * .45); if (u <= 0) return; const p = new Path2D(d); c.setLineDash([3000 * u, 4000]); c.stroke(p); });
  }
  c.setLineDash([]); c.restore();
}
