// kailasa_props.js: the sets and props of the Kailasa reel (src/scenes/kailasa.js): skies, the "no bricks, no blocks,
// no mortar" line icons, the Ravana relief, Nandi in his pavilion, the architect from behind, a height marker, the
// gods' sky-chariots.

// ---------- skies ----------
const SKY = {
  dawn: (c) => sky(c, [[0, '#1A1030'], [380, '#4A2442'], [700, '#A84A3A'], [950, '#F09A56'], [1200, '#FFD08A'], [1920, '#3A2420']]),
  gold: (c) => sky(c, [[0, '#2A1A34'], [500, '#7A3E44'], [900, '#E09050'], [1300, '#FFD898'], [1920, '#4A2A22']]),
  dusk: (c) => sky(c, [[0, '#120818'], [600, '#3A1530'], [1100, '#93312A'], [1400, '#E0703A'], [1920, '#3A1418']]),
  night: (c) => sky(c, [[0, '#04060E'], [700, '#0E1830'], [1300, '#22304E'], [1920, '#0A0E1A']]),
  rock: (c) => sky(c, [[0, '#0C0808'], [900, '#1C1414'], [1920, '#0A0606']]),
};

// ---------- "No bricks. No blocks. No mortar.": three line drawings, each struck through ----------
// kind: 'brick' (a wall in running bond), 'block' (a dressed stone block), 'mortar' (a trowel and a dab); at (x, y),
// ~240 wide. a: how much of it is drawn (0..1), x: how far the strike has gone (0..1).
function lineIcon(c, kind, x, y, a, sx, col = '#F4C46A') {
  if (a <= 0) return;
  c.save(); c.translate(x, y); c.globalAlpha = Math.min(1, a * 1.5); c.lineJoin = 'round'; c.lineCap = 'round';
  c.shadowColor = rgba(col, .8); c.shadowBlur = 16; c.strokeStyle = col; c.lineWidth = 6;
  const L = (d) => { c.stroke(new Path2D(d)); };
  if (kind === 'brick') {
    for (let r = 0; r < 4; r++) for (let i = -1; i < 3; i++) { const o = r % 2 ? 0 : 50, x0 = -110 + i * 100 + o, x1 = x0 + 92; if (x1 < -110 || x0 > 110) continue; c.strokeRect(Math.max(-110, x0), -90 + r * 46, Math.min(110, x1) - Math.max(-110, x0), 38); }
  } else if (kind === 'block') {
    L('M -90 -30 L 10 -80 L 110 -40 L 10 10 Z M -90 -30 L -90 70 L 10 120 L 10 10 M 10 120 L 110 80 L 110 -40');
    L('M -60 10 L -20 30 M 40 20 L 80 4');
  } else {
    L('M -100 60 L 40 -60 L 90 -20 L -40 90 Z M 60 -40 L 110 -90 M 110 -90 L 126 -76 L 128 -112 L 96 -104 Z');
    L('M -60 100 C -20 70 40 110 80 90');
  }
  c.restore();
  if (sx > 0) { c.save(); c.translate(x, y); c.shadowColor = 'rgba(255,90,60,.9)'; c.shadowBlur = 18; strokePath(c, `M -130 110 L ${-130 + 260 * sx} ${110 - 220 * sx}`, '#FF6A4A', 10); c.restore(); }
}

// ---------- the Ravana relief: Ravana under Kailash, Shiva and Parvati seated on top, all one stone, in a niche ----------
// At (x, y) = the relief's floor centre, k = scale; o: t, strain, torch (0..1 the warm light flickering from the left)
// The mountain is a mass of carved rock lumps over a cave whose arch his twenty palms hold (ravanaArch, at his scale .62).
function reliefMountain(c, x, y, k, t) {
  const A = ravanaArch({ pose: 'lift', reach: 1 }), R = .62 * k, acx = x, acy = y + A.cy * R, arx = A.rx * R + 10 * k, ary = A.ry * R + 10 * k;
  let d = `M ${x - 520 * k} ${acy}`;
  const pk = [[-520, -660], [-470, -820], [-380, -960], [-260, -1080], [-120, -1170], [0, -1210], [120, -1170], [260, -1080], [380, -960], [470, -820], [520, -660]];
  for (let i = 1; i < pk.length; i++) { const [x0, y0] = pk[i - 1], [x1, y1] = pk[i], mx = (x0 + x1) / 2, my = (y0 + y1) / 2 - 46; d += ` Q ${x + mx * k} ${y + my * k} ${x + x1 * k} ${y + y1 * k}`; }
  d += ` L ${acx + arx} ${acy} A ${arx} ${ary} 0 0 0 ${acx - arx} ${acy} Z`;
  fillPath(c, d, '#3E3230');
  inside(c, d, () => {
    for (let i = 0; i < 70; i++) {
      const lx = x + (hash(i * 3.7) - .5) * 1040 * k, ly = y - (640 + hash(i * 5.9) * 600) * k, r = (50 + hash(i * 1.3) * 70) * k;
      ellipse(c, lx + r * .12, ly + r * .14, r, r * .78, '#241A1A');
      ellipse(c, lx, ly, r, r * .76, '#4E403C');
      ellipse(c, lx - r * .3, ly - r * .3, r * .5, r * .34, rgba('#7A6458', .35));
    }
    // the cave's shadow under its arch
    glow(c, acx, acy, arx * 1.2, '#000000', .5, 'source-over');
  });
  // the god and goddess on the summit
  const sy = y - 1150 * k;
  fillPath(c, `M ${x - 190 * k} ${sy + 30 * k} L ${x + 190 * k} ${sy + 30 * k} L ${x + 170 * k} ${sy - 10 * k} L ${x - 170 * k} ${sy - 10 * k} Z`, '#4A3C38');
  c.save(); c.translate(x - 60 * k, sy); c.scale(k * .42, k * .42); shivaSeated(c, { t, col: '#5A4A44' }); c.restore();
  c.save(); c.translate(x + 95 * k, sy); c.scale(k * .34, k * .34); seatedDevi(c, '#544440'); c.restore();
}
// a seated goddess (Parvati) in profile-free front view: feet tucked, a hand on the knee, the hair in a bun; feet at (0, 0)
function seatedDevi(c, col) {
  fillPath(c, 'M -150 0 C -150 -50 -90 -80 0 -78 C 90 -80 150 -50 150 0 Z', col);
  fillPath(c, 'M -62 -70 C -70 -150 -86 -220 -96 -268 C -66 -288 -34 -294 0 -296 C 34 -294 66 -288 96 -268 C 86 -220 70 -150 62 -70 Z', col);
  for (const s of [-1, 1]) { limb(c, [[s * 92, -258], [s * 118, -170], [s * 104, -84]], [34, 28, 22], col); }
  fillPath(c, 'M -16 -290 L -16 -318 L 16 -318 L 16 -290 Z', col);
  ellipse(c, 0, -348, 30, 37, col); ellipse(c, 0, -394, 22, 18, col);
}
function ravanaRelief(c, x, y, k, o = {}) {
  const t = o.t || 0, fl = .85 + .15 * Math.sin(t * 11) * Math.sin(t * 7.3), stone = '#4A3E3A';
  // the niche: a deep arched recess in the wall
  const N = `M ${x - 560 * k} ${y + 60 * k} L ${x - 560 * k} ${y - 1250 * k} C ${x - 560 * k} ${y - 1520 * k} ${x + 560 * k} ${y - 1520 * k} ${x + 560 * k} ${y - 1250 * k} L ${x + 560 * k} ${y + 60 * k} Z`;
  fillPath(c, N, '#140E0E');
  inside(c, N, () => { glow(c, x - 300 * k, y - 400 * k, 1100 * k, '#FF9A50', .22 * fl); });
  const ST = { tint: [stone, .9], edge: { col: '#FFC890', w: 2.2, a: .55 * fl }, rim: { col: '#FFD8A8', dx: -5, dy: -4, a: .7 * fl, blur: 1 } };
  figure(c, (f) => reliefMountain(f, x, y, k, t), { edge: ST.edge, rim: ST.rim });
  // Ravana holding it up, his twenty arms round the cave's arch
  figure(c, (f) => { f.translate(x, y); f.scale(k * .62, k * .62); ravana(f, { t, pose: 'lift', expr: 'grit', strain: o.strain ?? .6 }); }, ST);
  // the stone's grain and wear over everything
  inside(c, N, () => { for (let i = 0; i < 40; i++) { const px = x + (hash(i * 3.3) - .5) * 1000 * k, py = y - hash(i * 5.1) * 1400 * k; ellipse(c, px, py, (20 + hash(i) * 60) * k, (8 + hash(i * 2) * 20) * k, rgba('#000', .1)); } });
}

// ---------- Nandi in his pavilion: lamp-lit, framed by two carved pillars and a lintel ----------
function nandiPavilion(c, t, o = {}) {
  sky(c, [[0, '#0A0606'], [900, '#22140E'], [1500, '#3A2216'], [1920, '#0C0806']]);
  glow(c, 540, 1180, 700, '#FFA050', .35);
  // the back wall, the floor
  fillPath(c, 'M -100 1380 L 1180 1380 L 1180 2100 L -100 2100 Z', '#1A100C');
  // Nandi, black stone, lying
  figure(c, (f) => { f.translate(560, 1390); f.scale(-.95, .95); nandiLying(f, { t, stone: true, look: .1 }); },
    { tint: ['#1A100C', .35], edge: { col: '#FFC890', w: 2.2, a: .6 }, rim: { col: '#FFD8A8', dx: 5, dy: -4, a: .8, blur: 1 } });
  // lamps on the floor
  deepa(c, 250, 1440, 1.1, t); deepa(c, 860, 1440, 1.1, t + 1);
  // the pillars and lintel in the foreground, dark
  for (const s of [-1, 1]) {
    const px = 540 + s * 470;
    fillPath(c, `M ${px - 90} 2100 L ${px - 90} 300 L ${px + 90} 300 L ${px + 90} 2100 Z`, '#0C0706');
    for (let j = 0; j < 6; j++) { const y = 420 + j * 260; fillPath(c, `M ${px - 96} ${y} L ${px + 96} ${y} L ${px + 80} ${y + 36} L ${px - 80} ${y + 36} Z`, '#1A100C'); }
    strokePath(c, `M ${px - s * 90} 300 L ${px - s * 90} 2100`, rgba('#FFB070', .35), 3);
  }
  fillPath(c, 'M -100 160 L 1180 160 L 1180 330 L -100 330 Z', '#0C0706');
  for (let i = 0; i < 9; i++) fillPath(c, `M ${i * 130 - 10} 330 C ${i * 130 + 30} 390 ${i * 130 + 90} 390 ${i * 130 + 130} 330 Z`, '#0C0706');
  strokePath(c, 'M -100 330 L 1180 330', rgba('#FFB070', .3), 3);
}

// ---------- the architect, from behind, looking up: a standing man in a dhoti, an angavastram over one shoulder, a
// turban; feet at (0, 0), ~880 tall. o: col, awe (0..1 his hands lift open at his sides), look (0..1 head tipped up) ----------
function sthapati(c, o = {}) {
  const col = o.col || '#0A0608', aw = o.awe ?? 0, lk = o.look ?? .6;
  for (const s of [-1, 1]) { limb(c, [[s * 38, -440], [s * 46, -230], [s * 52, -16]], [62, 48, 36], col); ellipse(c, s * 56, -8, 34, 12, col); }
  fillPath(c, 'M -92 -480 C -104 -400 -116 -300 -112 -228 C -60 -214 60 -214 112 -228 C 116 -300 104 -400 92 -480 Z', col);   // the dhoti
  fillPath(c, 'M -82 -470 C -98 -560 -132 -650 -126 -728 C -64 -760 64 -760 126 -728 C 132 -650 98 -560 82 -470 Z', col);       // the back
  fillPath(c, 'M -26 -748 L -26 -790 L 26 -790 L 26 -748 Z', col);
  const hy = -832 - lk * 4;
  ellipse(c, 0, hy, 42, 50, col);
  fillPath(c, `M -48 ${hy - 6} C -56 ${hy - 70} 56 ${hy - 70} 48 ${hy - 6} C 26 ${hy - 22} -26 ${hy - 22} -48 ${hy - 6} Z`, col);   // the turban
  for (const s of [-1, 1]) {
    const ex = s * lerp(146, 182, aw), ey = lerp(-570, -600, aw), hx = s * lerp(140, 236, aw), hy2 = lerp(-424, -520, aw);
    limb(c, [[s * 116, -716], [ex, ey], [hx, hy2]], [40, 32, 25], col); ellipse(c, hx + s * 4, hy2 + 12, 18, 24, col);
  }
  fillPath(c, 'M -126 -728 C -60 -700 50 -580 104 -486 L 92 -470 C 40 -560 -60 -672 -132 -700 Z', mixCol(col, '#3A2A20', .35));   // the angavastram
}

// ---------- a height marker beside a building: a vertical line with end ticks and a label ----------
function heightMark(c, x, y0, y1, label, a, col = '#F4C46A') {
  if (a <= 0) return;
  const y = lerp(y0, y1, easeOut(Math.min(1, a * 1.4)));
  c.save(); c.globalAlpha = Math.min(1, a * 2); c.shadowColor = rgba(col, .8); c.shadowBlur = 12;
  strokePath(c, `M ${x} ${y0} L ${x} ${y} M ${x - 22} ${y0} L ${x + 22} ${y0}`, col, 7);
  if (a > .7) strokePath(c, `M ${x - 22} ${y1} L ${x + 22} ${y1}`, col, 7);
  c.restore();
  if (a > .7) text(c, label, x + 120, (y0 + y1) / 2, '700 64px Cinzel', '#FFF3DC', { pop: (a - .7) * 3, glow: ['rgba(0,0,0,.9)', 18] });
}
