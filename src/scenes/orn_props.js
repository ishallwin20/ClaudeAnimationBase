// orn_props.js: the 2D layer of "Why does SHIVA wear such SCARY ornaments?" (ad 78): bands, source tags, titles, a
// label pinned to the world, a verse band (from ad 71's dhan_props), Shiva in the sky drinking the halahal (ad 56's
// vision, recoloured camphor-white so the throat's blue reads), the poison rising to him, and the screenshot board.

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
// radius). The head is the cine_shiva.js head (same units: the throat's middle at -726, the mouth at -770).
function shivaVision(c, t, o) {
  const l = scratch('vision'), { x, y, k } = o, keep = {};
  for (const n in SHV_WHITE) { keep[n] = SHV[n]; SHV[n] = SHV_WHITE[n]; }
  if (o.moon != null && o.moon < 1) { keep.moon = SHV.moon; SHV.moon = rgba(SHV.moon, o.moon); }   // the crescent in his locks: hidden until it comes
  l.save(); l.translate(x, y); l.scale(k, k); l.translate(0, 815);
  shivaHead(l, { t, eyes: o.eyes ?? 0, light: -1, wind: .2 });
  // the blue: the throat darkening from its middle, a deep sapphire band, a little glow of its own
  const b = o.blue ?? 0;
  if (b > 0) inside(l, SHV_NECK, () => {
    // a soft band across the throat, deepest in the middle
    const g = l.createLinearGradient(0, -752, 0, -704); g.addColorStop(0, rgba('#3A6AD0', 0)); g.addColorStop(.35, rgba('#2456C0', .85 * b)); g.addColorStop(.6, rgba('#1E4AB0', .9 * b)); g.addColorStop(1, rgba('#3A6AD0', 0));
    l.fillStyle = g; l.fillRect(-50, -760, 100, 60);
    const h = l.createRadialGradient(0, -728, 0, 0, -728, 22); h.addColorStop(0, rgba('#5A8CF0', .5 * b)); h.addColorStop(1, rgba('#5A8CF0', 0)); l.fillStyle = h; l.fillRect(-40, -760, 80, 60);
  });
  l.restore();
  for (const n in keep) SHV[n] = keep[n];
  l.globalCompositeOperation = 'destination-in';
  const g = l.createRadialGradient(x, y + 30, 0, x, y + 30, o.R || 640); g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(.55, 'rgba(0,0,0,.9)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  l.fillStyle = g; l.fillRect(0, 0, W, H);
  // the neck fades away below the throat
  const ty = y + (-726 + 815) * k, f = l.createLinearGradient(0, ty + 8 * k, 0, ty + 30 * k); f.addColorStop(0, 'rgba(0,0,0,1)'); f.addColorStop(1, 'rgba(0,0,0,0)');
  l.fillStyle = f; l.fillRect(0, 0, W, H);   // the whole canvas: destination-in clears whatever a fill doesn't cover l.globalCompositeOperation = 'source-over';
  blit(c, l.canvas, o.a * .8);
  blit(c, l.canvas, o.a * .4, 'screen', 'blur(22px)');
  if (b > 0) glow(c, x, y + (-726 + 815) * k, 34 * k * b, '#3A7AFF', .22 * b * o.a);
}
// the poison rising from the sea to his mouth: dark violet strands, twisting, a sick glow at their edges.
// from [x, y] (the sea) to [x, y] (the mouth); k 0..1 how far the front has risen, gone 0..1 the tail drawn in after it
function poisonRise(c, t, from, to, k, gone = 0) {
  if (k <= 0 || gone >= 1) return;
  const N = 60, pt = (u, s, ph) => {
    const y = lerp(from[1], to[1], u), w = (1 - u) * 90 + 10, x = lerp(from[0], to[0], u) + Math.sin(u * 9 + t * 3 + ph) * w * .5 * s;
    return [x, y];
  };
  for (const [ph, s, lw, col, a] of [[0, 1, 26, '#140A1E', .9], [2.1, .8, 18, '#24103A', .85], [4.2, 1.2, 12, '#3A1A50', .8], [1.3, .6, 6, '#6A3A8A', .7]]) {
    c.save(); c.lineCap = 'round'; c.strokeStyle = col; c.globalAlpha = a; c.shadowColor = 'rgba(140,80,200,.6)'; c.shadowBlur = 24;
    c.beginPath(); let first = true;
    for (let i = 0; i <= N; i++) {
      const u = i / N; if (u > k || u < gone) continue;
      const [x, y] = pt(u, s, ph); c.lineWidth = lw * (1 - u * .6);
      if (first) { c.moveTo(x, y); first = false; } else c.lineTo(x, y);
    }
    c.stroke(); c.restore();
  }
  const [fx, fy] = pt(Math.min(k, 1), 1, 0);
  if (k < 1) glow(c, fx, fy, 70, '#8A4AC8', .5);
}

// ---------- the screenshot board ----------
const BOARD = [
  ['SERPENT KING', 'his necklace', 'Panchakshara Stotram'],
  ['BLUE THROAT', 'the halahal he drank', 'Bhagavata 8.7'],
  ['MOON', 'relief from that poison', 'Skanda Purana'],
  ['BOAR TUSK', 'Varaha’s, that killed Hiranyaksha', 'Linga Purana 1.94'],
  ['ELEPHANT HIDE', 'Gajasura’s last wish', 'Shiva Purana'],
  ['GANGA', 'held in his jata', 'Valmiki Ramayana 1.43'],
  ['SKULLS', 'of past Brahmas and Vishnus', 'Skanda Purana'],
  ['RUDRAKSHA', 'his own tears', 'Shiva Purana'],
];
function board(c, t, t0, o = {}) {
  const a = seg(t, t0, t0 + .35) * (o.alpha ?? 1); if (a <= 0) return;
  const x0 = 50, x1 = 930, y0 = o.y0 ?? 480, rh = 80, hgt = 132 + rh * BOARD.length + 18;
  c.save(); c.globalAlpha *= a; c.fillStyle = 'rgba(12,8,10,.9)'; c.strokeStyle = 'rgba(244,196,106,.8)'; c.lineWidth = 3;
  c.beginPath(); c.roundRect(x0, y0 - 62, x1 - x0, hgt, 34); c.fill(); c.stroke(); c.restore();
  text(c, 'SHIVA’S ORNAMENTS', (x0 + x1) / 2, y0, '700 50px Cinzel', '#F4C46A', { alpha: a, spacing: 4 });
  text(c, 'and where each one comes from', (x0 + x1) / 2, y0 + 50, 'italic 34px Marcellus', '#FFF3DC', { alpha: a });
  BOARD.forEach(([name, what, src], i) => {
    const y = y0 + 126 + i * rh, ai = a * seg(t, t0 + .15 + i * .1, t0 + .4 + i * .1);
    if (i) { c.save(); c.globalAlpha *= ai; c.strokeStyle = 'rgba(244,196,106,.2)'; c.lineWidth = 2; c.beginPath(); c.moveTo(x0 + 30, y - rh / 2); c.lineTo(x1 - 30, y - rh / 2); c.stroke(); c.restore(); }
    c.save(); c.globalAlpha *= ai; c.fillStyle = 'rgba(244,196,106,.16)'; c.strokeStyle = 'rgba(244,196,106,.8)'; c.lineWidth = 2; c.beginPath(); c.arc(x0 + 62, y, 25, 0, TAU); c.fill(); c.stroke(); c.restore();
    text(c, String(i + 1), x0 + 62, y + 2, '700 30px Cinzel', '#F4C46A', { alpha: ai });
    const L = (s, f, yy, col, al = ai) => { c.save(); c.font = f; c.letterSpacing = f.includes('Cinzel') ? '2px' : '0px'; const w = c.measureText(s).width; c.restore(); text(c, s, x0 + 110 + w / 2, yy, f, col, { alpha: al, spacing: f.includes('Cinzel') ? 2 : 0 }); };
    L(name, '700 38px Cinzel', y - 18, '#FFE2A0');
    L(what, '32px Marcellus', y + 22, '#FFF3DC');
    c.save(); c.font = 'italic 26px Marcellus'; const sw = c.measureText(src).width; c.restore();
    text(c, src, x1 - 30 - sw / 2, y - 18, 'italic 26px Marcellus', '#CFC2B0', { alpha: ai * .9 });
  });
}
