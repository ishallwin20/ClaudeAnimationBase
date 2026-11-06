// lokas_props.js: the 2D layer of "7 worlds below your feet" (ad 79): bands, source tags, titles, labels pinned to the
// world (from ad 78's orn_props.js), each world's title card, the depth ruler, the screenshot board.

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

// ---------- Shiva in the sky, drinking the poison ----------
// his colours for this shot: camphor-white (karpura gauram), so the blue of the throat is the only blue on him
const SHV_WHITE = { skin: '#E6DFD4', skinSh: '#BDB3A6', skinDk: '#8A8076', throat: '#C9C0B4', palm: '#EEE8DE', lip: '#9A6E66', lipLo: '#B8887E', ash: '#FFFFFF' };
// o: x, y (where the head is drawn), k (scale), a (alpha), eyes, blue (0..1 the throat turning blue), R (the mask's

// a world's title: "1 / 7 · 10,000 YOJANAS DOWN", its name big in its colour, its Devanagari under it
const lighten = (hex, k) => { const c = new THREE.Color(hex).lerp(new THREE.Color('#FFFFFF'), k); return '#' + c.getHexString(); };
function worldTitle(c, i, t, at, out) {
  if (t < at - .2) return;
  const w = WORLDS[i], a = seg(t, at - .2, at + .1) * (1 - seg(t, out, out + .4)); if (a <= 0) return;
  band(c, 410, 720, .55 * a);
  text(c, `${i + 1} / 7  ·  ${((i + 1) * 10000).toLocaleString('en-IN')} YOJANAS DOWN`, 540, 468, '700 30px Cinzel', '#E8DCC4', { alpha: a, spacing: 3, glow: ['rgba(6,5,10,.9)', 12] });
  text(c, w.name, 540, 560, '700 120px Cinzel', lighten(w.col, .35), { pop: t - at, alpha: a, spacing: 8, glow: [rgba(w.col, .55), 34] });
  text(c, w.dev, 540, 662, '60px "Tiro Devanagari Sanskrit"', '#FFF3DC', { pop: t - at - .15, alpha: a, glow: ['rgba(6,5,10,.95)', 16] });
}
// a world's name at the side of the column, pinned to its cavern (the map shots): name left, depth right
function sideNames(c, t, at, o = {}) {
  const a0 = o.alpha ?? 1;
  WORLDS.forEach((w, i) => {
    const t0 = at + i * (o.step ?? .12), a = a0 * seg(t, t0, t0 + .3); if (a <= 0) return;
    const [xl, y] = toScreen3([-LK.R * .72, LK.mid(i), LK.R * .72]), [xr] = toScreen3([LK.R * .72, LK.mid(i), LK.R * .72]);
    if (o.names !== false) { c.save(); c.font = '700 40px Cinzel'; c.letterSpacing = '3px'; const ww = c.measureText(w.name).width; c.restore();
      const x = Math.max(40 + ww / 2, xl - 30 - ww / 2); text(c, w.name, x, y + 2, '700 40px Cinzel', lighten(w.col, .3), { alpha: a, spacing: 3, glow: ['rgba(4,4,10,.95)', 16], pop: t - t0 }); }
    if (o.depth) { const s = ((i + 1) * 10000).toLocaleString('en-IN'); c.save(); c.font = '700 36px Cinzel'; const ww = c.measureText(s).width; c.restore();
      const x = Math.min(925 - ww / 2, xr + 34 + ww / 2);
      c.save(); c.globalAlpha *= a; c.strokeStyle = 'rgba(244,196,106,.75)'; c.lineWidth = 3; c.beginPath(); c.moveTo(xr + 6, y); c.lineTo(x - ww / 2 - 10, y); c.stroke(); c.restore();
      text(c, s, x, y + 2, '700 36px Cinzel', '#FFE2A0', { alpha: a, glow: ['rgba(4,4,10,.95)', 14] }); }
  });
}

// ---------- the screenshot board ----------
const BOARD = [
  ['ATAL', 'Bala’s 96 kinds of magic'],
  ['VITAL', 'Shiva, the lord of gold'],
  ['SUTAL', 'King Bali; Vishnu guards his door'],
  ['TALATAL', 'Maya, the demon architect'],
  ['MAHATAL', 'serpents with many hoods'],
  ['RASATAL', 'demons, enemies of the gods'],
  ['PATAL', 'Vasuki and the Nagas'],
];
function board(c, t, t0, o = {}) {
  const a = seg(t, t0, t0 + .35) * (o.alpha ?? 1); if (a <= 0) return;
  const x0 = 50, x1 = 930, y0 = o.y0 ?? 470, rh = 82, hgt = 120 + rh * BOARD.length + 96;
  c.save(); c.globalAlpha *= a; c.fillStyle = 'rgba(10,8,14,.9)'; c.strokeStyle = 'rgba(244,196,106,.8)'; c.lineWidth = 3;
  c.beginPath(); c.roundRect(x0, y0 - 62, x1 - x0, hgt, 34); c.fill(); c.stroke(); c.restore();
  text(c, 'THE 7 WORLDS BELOW', (x0 + x1) / 2, y0, '700 48px Cinzel', '#F4C46A', { alpha: a, spacing: 4 });
  text(c, 'Bhagavata Purana 5.24–25', (x0 + x1) / 2, y0 + 48, 'italic 32px Marcellus', '#FFF3DC', { alpha: a });
  BOARD.forEach(([name, what], i) => {
    const y = y0 + 122 + i * rh, ai = a * seg(t, t0 + .15 + i * .1, t0 + .4 + i * .1), col = WORLDS[i].col;
    if (i) { c.save(); c.globalAlpha *= ai; c.strokeStyle = 'rgba(244,196,106,.2)'; c.lineWidth = 2; c.beginPath(); c.moveTo(x0 + 30, y - rh / 2); c.lineTo(x1 - 30, y - rh / 2); c.stroke(); c.restore(); }
    c.save(); c.globalAlpha *= ai; c.fillStyle = rgba(col, .22); c.strokeStyle = col; c.lineWidth = 2.5; c.beginPath(); c.arc(x0 + 62, y, 25, 0, TAU); c.fill(); c.stroke(); c.restore();
    text(c, String(i + 1), x0 + 62, y + 2, '700 30px Cinzel', lighten(col, .4), { alpha: ai });
    const L = (s, f, xx, yy, cl, al = ai) => { c.save(); c.font = f; c.letterSpacing = f.includes('Cinzel') ? '2px' : '0px'; const w = c.measureText(s).width; c.restore(); text(c, s, xx + w / 2, yy, f, cl, { alpha: al, spacing: f.includes('Cinzel') ? 2 : 0 }); };
    L(name, '700 38px Cinzel', x0 + 110, y - 17, lighten(col, .45));
    L(what, '31px Marcellus', x0 + 110, y + 22, '#FFF3DC');
  });
  const yf = y0 + 122 + BOARD.length * rh + 6, af = a * seg(t, t0 + .9, t0 + 1.2);
  text(c, 'and below them all:  ANANTA SHESHA', (x0 + x1) / 2, yf, '700 34px Cinzel', '#F4C46A', { alpha: af, spacing: 2 });
}
