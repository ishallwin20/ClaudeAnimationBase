// dhan_props.js: the smaller pieces of "DHANTERAS was never about GOLD" (ad 71): the lotus petal (ad 66's petal3), and
// the 2D layer: source tags, quote bands, titles pinned to the world, the screenshot board.

// petal3(L, Wd, o): a petal L long and Wd wide at its widest, growing up +y from its base and bending out toward +z
// (o.base: the lean at the base, o.bend: extra lean by the tip), cupped (o.cup), coloured from o.c0 (base) to o.c1
// (tip) and o.c2 (the edge) as vertex colours (from ad 66's never_props.js)
function petal3(L, Wd, o = {}) {
  const nu = o.nu || 18, nv = o.nv || 8, shape = o.shape || (u => Math.pow(Math.sin(Math.PI * Math.pow(u, .55)), .9));
  const c0 = new THREE.Color(o.c0 || '#FFFFFF'), c1 = new THREE.Color(o.c1 || o.c0 || '#FFFFFF'), c2 = o.c2 ? new THREE.Color(o.c2) : null;
  const pos = [], col = [], idx = [];
  let my = 0, mz = 0; const mid = [];
  for (let i = 0; i <= nu; i++) {
    const u = i / nu, th = (o.base || 0) + (o.bend || 0) * Math.pow(u, o.bendP || 1.4);
    if (i) { my += Math.cos(th) * L / nu; mz += Math.sin(th) * L / nu; }
    mid.push([my, mz, th]);
  }
  for (let i = 0; i <= nu; i++) {
    const u = i / nu, [y, z, th] = mid[i], w = Wd * shape(u) / 2;
    for (let j = 0; j <= nv; j++) {
      const v = j / nv * 2 - 1, x = v * w, cup = (o.cup || 0) * w * v * v;
      pos.push(x, y + Math.sin(th) * cup, z - Math.cos(th) * cup);
      const cc = c0.clone().lerp(c1, Math.pow(u, o.cP || 1)); if (c2) cc.lerp(c2, Math.pow(Math.abs(v), 3) * .6);
      col.push(cc.r, cc.g, cc.b);
    }
  }
  for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) { const a = i * (nv + 1) + j, b = a + nv + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx); g.computeVertexNormals(); return g;
}

// ---------- 2D ----------
// a dark band behind 2D lettering (y0..y1, fading at both ends)
function band(c, y0, y1, a = .6) {
  c.save(); const g = c.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, 'rgba(6,5,10,0)'); g.addColorStop(.25, `rgba(6,5,10,${a})`); g.addColorStop(.75, `rgba(6,5,10,${a})`); g.addColorStop(1, 'rgba(6,5,10,0)');
  c.fillStyle = g; c.fillRect(0, y0, W, y1 - y0); c.restore();
}
// a source tag: a dark pill with a gold edge, small capitals
function tag(c, txt, x, y, t, at, o = {}) {
  if (t < at) return;
  const k = popK(t - at), a = (o.alpha ?? 1) * (1 - seg(t, o.out ?? 1e9, (o.out ?? 1e9) + .3)), col = o.col || '#F4C46A', f = `700 ${o.size || 26}px Cinzel`;
  if (a <= 0) return;
  c.save(); c.font = f; c.letterSpacing = '2px'; const w = c.measureText(txt).width + 50, h = (o.size || 26) * 1.7;
  c.translate(x, y); c.scale(k, k); c.globalAlpha *= a;
  c.fillStyle = 'rgba(16,10,8,.82)'; c.strokeStyle = col; c.lineWidth = 3; c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, h / 2); c.fill(); c.stroke();
  c.restore();
  text(c, txt, x, y + 2, f, col, { alpha: a * Math.min(1, k), spacing: 2, maxW: 900 });
}
// a quote on a dark band: lines [[txt, font, col], ...] from y, dy apart
function verse(c, lines, y, t, at, o = {}) {
  const a = seg(t, at, at + .4) * (1 - seg(t, o.out ?? 1e9, (o.out ?? 1e9) + .4)) * (o.alpha ?? 1); if (a <= 0) return;
  band(c, y - 80, y + lines.length * (o.dy || 58) + 30, .72 * a);
  lines.forEach(([s, f, col], i) => text(c, s, 540, y + i * (o.dy || 58), f, col, { alpha: a, maxW: 900, glow: ['rgba(6,5,10,.9)', 14] }));
}
// a big gold title that pops in at `at` and fades at `out`
function title(c, txt, y, t, at, o = {}) {
  if (t < at) return;
  const a = 1 - seg(t, o.out ?? 1e9, (o.out ?? 1e9) + .35); if (a <= 0) return;
  text(c, txt, o.x ?? 540, y, `700 ${o.size || 96}px Cinzel`, o.col || '#FFE2A0', { pop: t - at, alpha: a, glow: [o.glowCol || 'rgba(10,6,4,.95)', 30], spacing: o.spacing ?? 4, maxW: o.maxW ?? 960 });
}
// a label pinned to a world point: a thin gold line up from it and the word above
function pinLabel(c, txt, p, t, at, o = {}) {
  if (t < at) return;
  const [x, y, z] = toScreen3(p); if (z > 1) return;
  const k = popK(t - at), a = (o.alpha ?? 1) * clamp((t - at) * 4) * (1 - seg(t, o.out ?? 1e9, (o.out ?? 1e9) + .3)); if (a <= 0) return;
  const up = o.up ?? 90, x1 = clamp(x, 160, 840);
  c.save(); c.globalAlpha *= a; c.strokeStyle = 'rgba(244,196,106,.8)'; c.lineWidth = 3; c.beginPath(); c.moveTo(x, y - 10); c.lineTo(x1, y - up + 20); c.stroke(); c.restore();
  text(c, txt, x1, y - up, `700 ${o.size || 40}px Cinzel`, o.col || '#FFF3DC', { pop: t - at, alpha: a, glow: ['rgba(8,6,12,.95)', 18], spacing: 2, maxW: 520 });
  if (o.sub) text(c, o.sub, x1, y - up + 40, 'italic 30px Marcellus', '#FFE2A0', { alpha: a * Math.min(1, k), glow: ['rgba(8,6,12,.95)', 14], maxW: 520 });
}
function seriesTag(c, txt, t, at, o = {}) {
  const k = popK(t - at), w = o.w || 500;
  c.save(); c.translate(540, o.y || 470); c.scale(k, k); c.fillStyle = 'rgba(20,12,8,.72)'; c.strokeStyle = 'rgba(244,196,106,.85)'; c.lineWidth = 3;
  c.beginPath(); c.roundRect(-w / 2, -38, w, 76, 38); c.fill(); c.stroke(); c.restore();
  text(c, txt, 540, (o.y || 470) + 2, '700 36px Cinzel', '#F4C46A', { spacing: 2, alpha: Math.min(1, k) });
}

// ---------- the screenshot board ----------
// icons: a lamp, the jug of amrit, a coin
function icon(c, id, x, y, s, a = 1) {
  c.save(); c.translate(x, y); c.globalAlpha *= a; const k = s / 100;
  if (id === 'lamp') {
    c.fillStyle = '#B4602E'; c.beginPath(); c.moveTo(-40 * k, 10 * k); c.quadraticCurveTo(0, 50 * k, 40 * k, 10 * k); c.lineTo(52 * k, 0); c.quadraticCurveTo(10 * k, 10 * k, -40 * k, 10 * k); c.fill();
    const g = c.createRadialGradient(44 * k, -22 * k, 0, 44 * k, -22 * k, 40 * k); g.addColorStop(0, 'rgba(255,220,140,.9)'); g.addColorStop(1, 'rgba(255,160,60,0)'); c.fillStyle = g; c.fillRect(0, -70 * k, 90 * k, 90 * k);
    c.fillStyle = '#FFE6A0'; c.beginPath(); c.moveTo(44 * k, -40 * k); c.quadraticCurveTo(56 * k, -14 * k, 44 * k, -4 * k); c.quadraticCurveTo(32 * k, -14 * k, 44 * k, -40 * k); c.fill();
  } else if (id === 'jug') {
    const g = c.createRadialGradient(0, -36 * k, 0, 0, -36 * k, 46 * k); g.addColorStop(0, 'rgba(255,210,120,.9)'); g.addColorStop(1, 'rgba(255,170,60,0)'); c.fillStyle = g; c.fillRect(-50 * k, -84 * k, 100 * k, 90 * k);
    c.fillStyle = '#C8923E'; c.beginPath(); c.moveTo(-14 * k, -30 * k); c.lineTo(14 * k, -30 * k); c.lineTo(10 * k, -20 * k); c.bezierCurveTo(48 * k, -10 * k, 48 * k, 40 * k, 0, 46 * k); c.bezierCurveTo(-48 * k, 40 * k, -48 * k, -10 * k, -10 * k, -20 * k); c.closePath(); c.fill();
    c.fillStyle = '#FFD070'; c.beginPath(); c.ellipse(0, -31 * k, 16 * k, 5 * k, 0, 0, TAU); c.fill();
  } else {
    c.fillStyle = '#E2B04E'; c.beginPath(); c.arc(0, 0, 38 * k, 0, TAU); c.fill(); c.strokeStyle = '#9C7224'; c.lineWidth = 5 * k; c.beginPath(); c.arc(0, 0, 29 * k, 0, TAU); c.stroke();
    c.fillStyle = '#F6D488'; c.beginPath(); c.arc(-10 * k, -10 * k, 8 * k, 0, TAU); c.fill();
  }
  c.restore();
}
const BOARD = [
  ['lamp', 'YAMA DIYA', 'outside your door, at dusk', 'Padma Purana', '#FFE2A0'],
  ['jug', 'DHANVANTARI', 'pray for health', 'Bhagavata 8.8', '#FFE2A0'],
  ['coin', 'GOLD', 'a custom, not the rule', 'your choice', '#E8D8B8'],
];
function board(c, t, t0, o = {}) {
  const a = seg(t, t0, t0 + .35) * (o.alpha ?? 1); if (a <= 0) return;
  const x0 = 50, x1 = 930, y0 = o.y0 ?? 500, rh = 150, hgt = 150 + rh * BOARD.length + 70;
  c.save(); c.globalAlpha *= a; c.fillStyle = 'rgba(12,8,10,.9)'; c.strokeStyle = 'rgba(244,196,106,.8)'; c.lineWidth = 3;
  c.beginPath(); c.roundRect(x0, y0 - 70, x1 - x0, hgt, 34); c.fill(); c.stroke(); c.restore();
  text(c, 'DHANTERAS', (x0 + x1) / 2, y0, '700 52px Cinzel', '#F4C46A', { alpha: a, spacing: 4 });
  text(c, 'Friday, 6 November', (x0 + x1) / 2, y0 + 54, 'italic 36px Marcellus', '#FFF3DC', { alpha: a });
  BOARD.forEach(([id, name, what, src, col], i) => {
    const y = y0 + 160 + i * rh, ai = a * seg(t, t0 + .2 + i * .15, t0 + .45 + i * .15);
    if (i) { c.save(); c.globalAlpha *= ai; c.strokeStyle = 'rgba(244,196,106,.22)'; c.lineWidth = 2; c.beginPath(); c.moveTo(x0 + 30, y - rh / 2); c.lineTo(x1 - 30, y - rh / 2); c.stroke(); c.restore(); }
    icon(c, id, x0 + 85, y + 8, 100, ai);
    c.save(); c.font = '700 44px Cinzel'; c.letterSpacing = '2px'; const nw = c.measureText(name).width; c.restore();
    text(c, name, x0 + 170 + nw / 2, y - 22, '700 44px Cinzel', col, { alpha: ai, spacing: 2 });
    c.save(); c.font = '36px Marcellus'; const ww = c.measureText(what).width; c.restore();
    text(c, what, x0 + 170 + ww / 2, y + 26, '36px Marcellus', '#FFF3DC', { alpha: ai });
    c.save(); c.font = 'italic 28px Marcellus'; const sw = c.measureText(src).width; c.restore();
    text(c, src, x0 + 170 + sw / 2, y + 66, 'italic 28px Marcellus', '#CFC2B0', { alpha: ai * .9 });
  });
}
