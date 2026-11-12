// jata_props.js: the 2D layer of "Why do some sadhus keep JATA and some SHAVE?" (ad 87), from ad 81: bands, source tags,
// quotes, titles, labels pinned to the world.

// a dark band behind 2D lettering (y0..y1, fading at both ends)
function band(c, y0, y1, a = .6) {
  c.save(); const g = c.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, 'rgba(6,5,10,0)'); g.addColorStop(.25, `rgba(6,5,10,${a})`); g.addColorStop(.75, `rgba(6,5,10,${a})`); g.addColorStop(1, 'rgba(6,5,10,0)');
  c.fillStyle = g; c.fillRect(0, y0, W, y1 - y0); c.restore();
}
// a source tag: a dark pill with a gold edge, small capitals
function tag(c, txt, x, y, t, at, o = {}) {
  if (t < at) return;
  const k = popK(t - at), a = (o.alpha ?? 1) * (1 - seg(t, o.out ?? 1e9, (o.out ?? 1e9) + .3)), col = o.col || '#F4C46A', f = `700 ${o.size || 24}px Cinzel`;
  if (a <= 0) return;
  c.save(); c.font = f; c.letterSpacing = '2px'; const w = Math.min(c.measureText(txt).width + 50, 900), h = (o.size || 24) * 1.7;
  c.translate(x, y); c.scale(k, k); c.globalAlpha *= a;
  c.fillStyle = 'rgba(16,10,8,.82)'; c.strokeStyle = col; c.lineWidth = 3; c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, h / 2); c.fill(); c.stroke();
  c.restore();
  text(c, txt, x, y + 2, f, col, { alpha: a * Math.min(1, k), spacing: 2, maxW: 860 });
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
  const a = (o.alpha ?? 1) * (1 - seg(t, o.out ?? 1e9, (o.out ?? 1e9) + .35)); if (a <= 0) return;
  text(c, txt, o.x ?? 540, y, `700 ${o.size || 96}px Cinzel`, o.col || '#FFE2A0', { pop: t - at, alpha: a, glow: [o.glowCol || 'rgba(10,6,4,.95)', 30], spacing: o.spacing ?? 4, maxW: o.maxW ?? 940 });
  if (o.sub) text(c, o.sub, o.x ?? 540, y + (o.size || 96) * .72, 'italic 40px Marcellus', '#FFF3DC', { pop: t - at - .25, alpha: a, glow: ['rgba(10,6,4,.95)', 16], maxW: 900 });
}
// a label pinned to a world point: a thin gold line up from it and the word above
function pinLabel(c, txt, p, t, at, o = {}) {
  if (t < at) return;
  const [x, y, z] = toScreen3(p); if (z > 1) return;
  const k = popK(t - at), a = (o.alpha ?? 1) * clamp((t - at) * 4) * (1 - seg(t, o.out ?? 1e9, (o.out ?? 1e9) + .3)); if (a <= 0) return;
  const up = o.up ?? 90, x1 = clamp(x + (o.dx || 0), 180, 820);
  c.save(); c.globalAlpha *= a; c.strokeStyle = 'rgba(244,196,106,.8)'; c.lineWidth = 3; c.beginPath(); c.moveTo(x, y - 8); c.lineTo(x1, y - up + 22); c.stroke(); c.restore();
  text(c, txt, x1, y - up, `700 ${o.size || 40}px Cinzel`, o.col || '#FFF3DC', { pop: t - at, alpha: a, glow: ['rgba(8,6,12,.95)', 18], spacing: 2, maxW: 520 });
  if (o.sub) text(c, o.sub, x1, y - up + 40, 'italic 30px Marcellus', '#FFE2A0', { alpha: a * Math.min(1, k), glow: ['rgba(8,6,12,.95)', 14], maxW: 520 });
}

const lighten = (hex, k) => { const c = new THREE.Color(hex).lerp(new THREE.Color('#FFFFFF'), k); return '#' + c.getHexString(); };
