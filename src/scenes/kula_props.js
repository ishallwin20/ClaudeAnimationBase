// kula_props.js: the 2D layer of ad 115, from ad 114's onemoon_props.js (ad 110's deepam_props.js): bands behind captions, big
// titles, tags pinned to the 3D world, flashes and shakes; plus glyph tags in the region's scripts.
const GOLD = '#F4C46A', CREAM = '#FFF3DC', EMBER = '#FF9A4A', BLUEL = '#9AD0FF', TAMIL = '"Noto Serif Tamil"';
const at3 = (k, a, b) => a.map((v, i) => lerp(v, b[i], k));
const R_ = (t, a, b) => easeIO(seg(t, a, b));
const bump01 = (x, a, b) => { const m = (a + b) / 2, h = (b - a) / 2; return Math.max(0, 1 - Math.pow((x - m) / h, 2)); };
// a soft dark band behind text (y0..y1), fading at its edges
function band(c, y0, y1, a = .5) {
  if (a <= 0) return; c.save(); const g = c.createLinearGradient(0, y0, 0, y1);
  g.addColorStop(0, 'rgba(4,3,10,0)'); g.addColorStop(.25, `rgba(4,3,10,${a})`); g.addColorStop(.75, `rgba(4,3,10,${a})`); g.addColorStop(1, 'rgba(4,3,10,0)');
  c.fillStyle = g; c.fillRect(0, y0, W, y1 - y0); c.restore();
}
const flashK = (c, t, at, col = '255,236,200', k = .4, rate = 5) => { const f = t > at ? Math.exp(-(t - at) * rate) : 0; if (f > .01) { c.save(); c.fillStyle = `rgba(${col},${k * f})`; c.fillRect(0, 0, W, H); c.restore(); } };
const fadeK = (c, a, col = '0,0,0') => { if (a > .002) { c.save(); c.fillStyle = `rgba(${col},${clamp(a)})`; c.fillRect(0, 0, W, H); c.restore(); } };
// a camera shake after a hit: [dx, dy, roll] in world-ish units scaled by k
const shakeAt = (t, at, k = 1) => { const f = t > at ? Math.exp(-(t - at) * 5) * k : 0; return [f * Math.sin(t * 61), f * Math.cos(t * 47), f * .012 * Math.sin(t * 37)]; };
// a big title over the top band: big words, a small line under them
function topTitle(c, t, at, out, big, small, o = {}) {
  const a = seg(t, at, at + .3) * (1 - seg(t, out, out + .3)); if (a <= 0) return;
  const y = o.y ?? 520;
  band(c, y - 140, y + (small ? 150 : 110), (o.bandA ?? .5) * a);
  text(c, big, 540, y, o.font || '700 96px Cinzel', o.col || GOLD, { pop: t - at, alpha: a, spacing: o.spacing ?? 6, glow: [o.glowCol || 'rgba(255,150,60,.45)', 30], maxW: 980 });
  if (small) text(c, small, 540, y + (o.dy ?? 86), o.sfont || 'italic 42px Marcellus', o.scol || CREAM, { pop: t - at - .15, alpha: a, glow: ['rgba(6,5,10,.95)', 16], maxW: 960 });
}
// a label pinned to a world point (with a short leader line down to it)
function pin2(c, txt, p, t, at, out, o = {}) {
  const a = seg(t, at, at + .25) * (1 - seg(t, out, out + .3)); if (a <= 0) return;
  const [x, y, z] = toScreen3(p); if (z > 1) return;
  const lx = clamp(x + (o.dx ?? 0), 180, 900), ly = y + (o.dy ?? -90);
  c.save(); c.globalAlpha = a; c.strokeStyle = o.col || GOLD; c.lineWidth = 2.5; c.beginPath(); c.moveTo(x + (o.dx ? Math.sign(o.dx) * -22 : 0), y + (o.dx ? 0 : o.dy < 0 ? -18 : 18)); c.lineTo(lx + (o.dx ? Math.sign(o.dx) * -110 : 0), ly + (o.dx ? 0 : o.dy < 0 ? 26 : -26)); c.stroke(); c.restore();
  text(c, txt, lx, ly, o.font || '700 50px Cinzel', o.col || GOLD, { pop: t - at, alpha: a, spacing: 4, glow: ['rgba(6,5,10,.95)', 18] });
  if (o.sub) text(c, o.sub, lx, ly + (o.dy < 0 ? -48 : 48), 'italic 32px Marcellus', CREAM, { alpha: a, glow: ['rgba(6,5,10,.95)', 14] });
}
// a ring on the ground through world points, drawn on (k 0..1), with a glow
function ring2(c, pts, k, a, col = '255,200,110') {
  if (k <= 0 || a <= 0) return; const n = Math.floor(pts.length * clamp(k)); if (n < 2) return;
  c.save(); c.lineCap = 'round'; c.lineJoin = 'round';
  for (const [w, al] of [[16, .12], [7, .3], [3, 1]]) {
    c.strokeStyle = `rgba(${col},${al * a})`; c.lineWidth = w; c.beginPath(); let on = false;
    for (let i = 0; i < n; i++) { const [x, y, z] = toScreen3(pts[i]); if (z > 1) { on = false; continue; } if (!on) { c.moveTo(x, y); on = true; } else c.lineTo(x, y); }
    c.stroke();
  }
  c.restore();
}
// lightning between two screen points (a jagged bolt, re-drawn every few frames)
function bolt2(c, a, b, t, k, col = '200,220,255') {
  if (k <= 0) return; const r = lcg(Math.floor(t * 14) + 3), n = 14;
  c.save(); c.globalCompositeOperation = 'lighter'; c.lineCap = 'round'; c.lineJoin = 'round';
  for (const [w, al] of [[14, .12], [5, .35], [2, 1]]) {
    const rr = lcg(Math.floor(t * 14) + 3); c.strokeStyle = `rgba(${col},${al * k})`; c.lineWidth = w; c.beginPath(); c.moveTo(a[0], a[1]); let off = 0;
    for (let i = 1; i < 40; i++) { const u = i / 40; off += (rr() - .5) * 46; off *= .9; c.lineTo(lerp(a[0], b[0], u) + (rr() - .5) * 8, lerp(a[1], b[1], u) + off * Math.sin(u * Math.PI)); }
    c.lineTo(b[0], b[1]); c.stroke();
  }
  c.restore(); r();
}
// a small source line (the reel's citations)
function source2(c, t, at, out, txt, y = 1580) {
  const a = seg(t, at, at + .3) * (1 - seg(t, out, out + .3)); if (a <= 0) return;
  text(c, txt, 540, y, 'italic 34px Marcellus', 'rgba(255,236,205,.92)', { alpha: a, glow: ['rgba(6,5,10,.95)', 14] });
}
// dark edges (a vignette that can be pushed)
function edge2(c, k) { if (k <= 0) return; c.save(); const g = c.createRadialGradient(540, 900, 300, 540, 960, 1200); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${.7 * k})`); c.fillStyle = g; c.fillRect(0, 0, W, H); c.restore(); }
// speed streaks: thin lines rushing past (dir 1 = the world moves up, the camera falls; -1 = it moves down)
function streaks2(c, t, dir, col) {
  const r = lcg(7); c.save(); c.globalCompositeOperation = 'lighter'; c.lineCap = 'round';
  for (let i = 0; i < 46; i++) {
    const x = r() * W, sp = 1400 + r() * 2200, len = 80 + r() * 260, y0 = ((r() * H * 2 + dir * t * sp) % (H * 2) + H * 2) % (H * 2) - H * .5;
    const a = .08 + r() * .22; c.strokeStyle = `rgba(${col},${a})`; c.lineWidth = 1 + r() * 2.5; c.beginPath(); c.moveTo(x, y0); c.lineTo(x, y0 + len * dir); c.stroke();
  }
  c.restore();
}
const THAI = '"Noto Serif Thai"', KHMER = '"Noto Serif Khmer"', GRANTHA = '"Noto Sans Grantha"', DEVA = '"Tiro Devanagari Sanskrit"', ODIA = '"Noto Sans Oriya"';
// a glyph standing over a world point: a big letter in its script, a small name under it
function glyph2(c, ch, font, name, p, t, at, out, o = {}) {
  const a = seg(t, at, at + .3) * (1 - seg(t, out, out + .3)); if (a <= 0) return;
  const [x, y, z] = toScreen3(p); if (z > 1) return;
  const gx = clamp(x + (o.dx ?? 0), 150, 930), gy = y + (o.dy ?? -150);
  c.save(); c.globalAlpha = a * .8; c.strokeStyle = GOLD; c.lineWidth = 2; c.beginPath(); c.moveTo(x, y - 12); c.lineTo(gx, gy + 70); c.stroke(); c.restore();
  text(c, ch, gx, gy, font, o.col || GOLD, { pop: t - at, alpha: a, glow: ['rgba(255,150,60,.55)', 30] });
  text(c, name, gx, gy + 100, '700 36px Cinzel', CREAM, { alpha: a, spacing: 4, glow: ['rgba(6,5,10,.95)', 14] });
}
// a site marker on the map: a bright dot and a ring that pulses
function dot2(c, p, t, at, out, col = '255,210,120') {
  const a = seg(t, at, at + .25) * (1 - seg(t, out, out + .3)); if (a <= 0) return;
  const [x, y, z] = toScreen3(p); if (z > 1) return;
  c.save(); c.globalCompositeOperation = 'lighter';
  const r = 10 + 26 * ((t - at) * .8 % 1), g = c.createRadialGradient(x, y, 0, x, y, 26); g.addColorStop(0, `rgba(${col},${a})`); g.addColorStop(1, `rgba(${col},0)`);
  c.fillStyle = g; c.beginPath(); c.arc(x, y, 26, 0, TAU); c.fill();
  c.strokeStyle = `rgba(${col},${a * (1 - ((t - at) * .8 % 1))})`; c.lineWidth = 3; c.beginPath(); c.arc(x, y, r, 0, TAU); c.stroke();
  c.restore();
}
// ---------- ad 115 ----------
// a big number over the top band (3,500 KG), popping in, with a small line under it
function bigNum(c, t, at, out, big, small, o = {}) {
  const a = seg(t, at, at + .25) * (1 - seg(t, out, out + .3)); if (a <= 0) return;
  const y = o.y ?? 480; band(c, y - 150, y + 150, .5 * a);
  text(c, big, 540, y, o.font || '700 130px Cinzel', GOLD, { pop: t - at, alpha: a, spacing: 6, glow: ['rgba(255,150,60,.5)', 32], maxW: 980 });
  if (small) text(c, small, 540, y + 96, 'italic 46px Marcellus', CREAM, { pop: t - at - .12, alpha: a, glow: ['rgba(6,5,10,.95)', 16] });
}
// a dashed measuring line between two screen points
function dashed2(c, A, B, a) { c.save(); c.globalAlpha = a; c.strokeStyle = GOLD; c.lineWidth = 3.5; c.setLineDash([16, 12]); c.lineCap = 'round'; c.shadowColor = 'rgba(6,5,10,.9)'; c.shadowBlur = 8; c.beginPath(); c.moveTo(A[0], A[1]); c.lineTo(B[0], B[1]); c.stroke(); c.restore(); }
// a measurement tag: a big gold figure, a small name under it
function tag2(c, big, x, y, a, small, align = 'center') {
  const dx = align === 'left' ? 1 : 0, w = 0;
  text(c, big, x + (dx ? 110 : 0), y, '700 64px Cinzel', GOLD, { alpha: a, spacing: 4, glow: ['rgba(6,5,10,.95)', 18] });
  if (small) text(c, small, x + (dx ? 110 : 0), y + 50, 'italic 36px Marcellus', CREAM, { alpha: a, glow: ['rgba(6,5,10,.95)', 14] });
}
// a height ruler (a vertical line with end ticks) at screen x from y0 (foot) to y1 (top)
function ruler2(c, x, y0, y1, a) {
  const yy = lerp(y0, y1, easeOut(clamp(a * 1.4))); c.save(); c.globalAlpha = a; c.strokeStyle = GOLD; c.lineWidth = 3.5; c.lineCap = 'round'; c.shadowColor = 'rgba(6,5,10,.9)'; c.shadowBlur = 8;
  c.beginPath(); c.moveTo(x, y0); c.lineTo(x, yy); c.moveTo(x - 16, y0); c.lineTo(x + 16, y0); c.moveTo(x - 16, yy); c.lineTo(x + 16, yy); c.stroke(); c.restore();
}
