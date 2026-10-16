// kumbha_props.js: the sets and props of the Kumbhakarna reel (src/scenes/kumbha.js): skies, birds (flying, falling),
// rakshasa silhouettes (blowing conches, beating drums, carrying food), the mountain of meat, the five fires, the
// sleeping cave, Indra's garden, the stream of Saraswati's syllables, the gods kneeling, Indra on Airavata.

// ---------- skies ----------
const SKY = {
  storm: (c, fl = 0) => { sky(c, [[0, '#12040A'], [600, '#3A0A12'], [1250, '#8A1E16'], [1920, '#2A0A0C']]); if (fl) flash(c, fl * .3, '#FFB08A'); },
  night: (c) => sky(c, [[0, '#04060E'], [700, '#0E1830'], [1300, '#22304E'], [1920, '#0A0E1A']]),
  gold: (c) => sky(c, [[0, '#2A1A34'], [500, '#7A3E44'], [900, '#E09050'], [1300, '#FFD898'], [1920, '#4A2A22']]),
  heaven: (c) => sky(c, [[0, '#1E2A4A'], [600, '#5A6A9A'], [1100, '#E8C8A0'], [1500, '#FFE8C0'], [1920, '#6A5A50']]),
  fire: (c) => sky(c, [[0, '#120606'], [800, '#3A120A'], [1400, '#8A3A14'], [1920, '#1A0806']]),
  ice: (c) => sky(c, [[0, '#060A16'], [700, '#1A2A48'], [1300, '#4A6488'], [1920, '#101A2C']]),
  cave: (c) => sky(c, [[0, '#060406'], [800, '#140C0C'], [1500, '#24140E'], [1920, '#0A0606']]),
  hall: (c) => sky(c, [[0, '#0A0507'], [700, '#1C0C0B'], [1250, '#3A1A12'], [1920, '#120806']]),
};
const SIL = (col, edge, a = .9) => ({ tint: [col, a], edge: { col: edge, w: 2.4, a: .8 }, rim: { col: edge, dx: 0, dy: -5, a: .8, blur: 1 } });

// ---------- birds: small V shapes flapping across, or tumbling down (fall 0..1) ----------
function birds(c, t, o = {}) {
  const n = o.n ?? 24, col = o.col || '#0A0608', seed = o.seed || 1;
  for (let i = 0; i < n; i++) {
    const u = t * (o.speed ?? 1) + hash(i * 3.3 + seed) * 10, x = ((hash(i * 5.1 + seed) * 1400 + u * 90) % 1400) - 160, y0 = (o.y0 ?? 200) + hash(i * 7.7 + seed) * (o.h ?? 600);
    const f = o.fall ? Math.max(0, o.fall - hash(i * 2.1 + seed) * .4) / .6 : 0, y = y0 + f * f * 1400, k = (o.k ?? 1) * (.6 + hash(i) * .6), flap = f > 0 ? .2 : Math.sin(t * 12 + i * 2);
    c.save(); c.translate(x, y); c.rotate(f * (2 + hash(i) * 4)); c.scale(k, k);
    strokePath(c, `M -18 ${-6 * flap} Q -8 ${-10 * flap - 4} 0 0 Q 8 ${-10 * flap - 4} 18 ${-6 * flap}`, col, 3.4);
    c.restore();
  }
}

// ---------- a rakshasa in silhouette, front view: kind 'conch' (a conch to the lips), 'drum' (beating a big drum),
// 'carry' (a load on the head), 'club' (a club raised); feet at (0, 0), ~900 tall ----------
function rakshasaSil(c, o = {}) {
  const col = o.col || '#0A0608', t = o.t || 0, k = o.kind || 'conch', ph = (o.ph || 0) + t * 7;
  for (const s of [-1, 1]) limb(c, [[s * 34, -440], [s * 50, -230], [s * 58, -20]], [78, 60, 44], col);
  fillPath(c, 'M -110 -470 C -130 -400 -120 -300 -90 -250 L 90 -250 C 120 -300 130 -400 110 -470 Z', col);
  fillPath(c, 'M -100 -460 C -120 -560 -150 -680 -140 -730 C -80 -760 80 -760 140 -730 C 150 -680 120 -560 100 -460 Z', col);
  ellipse(c, 0, -810, 60, 66, col);
  for (const s of [-1, 1]) limb(c, [[s * 34, -860], [s * 60, -920], [s * 56, -960]], [20, 14, 3], col);   // horns
  for (let i = -3; i <= 3; i++) limb(c, [[i * 14, -860], [i * 22, -900 - Math.abs(i) * 4]], [14, 3], col);   // wild hair
  if (k === 'conch') {
    limb(c, [[-120, -720], [-90, -640], [-30, -800]], [40, 34, 28], col); limb(c, [[120, -720], [100, -640], [40, -790]], [40, 34, 28], col);
    fillPath(c, 'M -20 -800 C -40 -860 -10 -920 40 -910 C 80 -900 70 -840 30 -810 Z', o.conch || '#E8DCC8');
  } else if (k === 'drum') {
    const a = Math.sin(ph) * .5;
    limb(c, [[-120, -720], [-200, -620], [-150 + Math.sin(ph) * 30, -560 - Math.abs(Math.sin(ph)) * 80]], [40, 34, 28], col);
    limb(c, [[120, -720], [200, -620], [150 - Math.sin(ph + 1.6) * 30, -560 - Math.abs(Math.sin(ph + 1.6)) * 80]], [40, 34, 28], col);
    fillPath(c, 'M -150 -520 C -150 -580 150 -580 150 -520 L 140 -330 C 140 -290 -140 -290 -140 -330 Z', col);
    ellipse(c, 0, -540, 150, 30, mixCol(col, '#6A4A30', .5));
  } else if (k === 'carry') {
    limb(c, [[-120, -720], [-150, -860], [-80, -950]], [40, 34, 28], col); limb(c, [[120, -720], [150, -860], [80, -950]], [40, 34, 28], col);
    fillPath(c, 'M -150 -950 C -150 -1060 150 -1060 150 -950 Z', col);
  } else {
    limb(c, [[-120, -720], [-180, -600], [-200, -500]], [40, 34, 28], col);
    limb(c, [[120, -720], [200, -820 + Math.sin(ph) * 40], [220, -940 + Math.sin(ph) * 60]], [40, 34, 28], col);
    limb(c, [[220, -940 + Math.sin(ph) * 60], [260, -1180 + Math.sin(ph) * 80]], [30, 60], col);
  }
}

// ---------- the mountain of food piled by his head: a heap of brown lumps, steam rising ----------
function meatHeap(c, x, y, w, h, t, a = 1) {
  if (a <= 0) return;
  c.save(); c.globalAlpha = a;
  const D = `M ${x - w / 2} ${y} C ${x - w * .4} ${y - h * .5} ${x - w * .2} ${y - h} ${x} ${y - h} C ${x + w * .2} ${y - h} ${x + w * .4} ${y - h * .5} ${x + w / 2} ${y} Z`;
  fillPath(c, D, '#4A2418');
  inside(c, D, () => { for (let i = 0; i < 40; i++) { const px = x + (hash(i * 3.1) - .5) * w, py = y - hash(i * 5.7) * h, r = 20 + hash(i) * 40; ellipse(c, px, py, r, r * .7, hash(i * 9) > .5 ? '#6A3420' : '#3A1A10'); ellipse(c, px - r * .3, py - r * .3, r * .4, r * .25, rgba('#B0603A', .5)); } });
  c.restore();
  for (let i = 0; i < 6; i++) { const u = (t * .3 + i / 6) % 1, sx = x + (hash(i) - .5) * w * .5 + Math.sin(u * 6 + i) * 20; ellipse(c, sx, y - h - u * 260, 30 + u * 50, 20 + u * 30, rgba('#E8D8C8', .16 * (1 - u) * a)); }
}

// ---------- the five fires of his tapas (four round him, the sun the fifth) ----------
function fires(c, cx, y, t, k = 1, a = 1) {
  for (const [dx, dy, s] of [[-330, 0, 1], [330, 0, 1], [-190, -90, .7], [190, -90, .7]]) {
    const x = cx + dx * k, yy = y + dy * k;
    glow(c, x, yy - 40 * s * k, 220 * s * k, '#FF7A2A', .5 * a);
    yagna(c, x, yy, 140 * s * k, t + dx, a);
  }
}

// ---------- the sleeping cave: rough walls closing in, torches on them ----------
function cave(c, t, o = {}) {
  SKY.cave(c);
  glow(c, 540, 1300, 900, '#FF8A3A', .3 * (o.lit ?? 1));
  for (const s of [-1, 1]) {
    const pts = [[s < 0 ? -100 : W + 100, -100]];
    for (let i = 0; i <= 12; i++) { const y = -100 + i * 180, x = 540 + s * (430 + Math.sin(i * 1.3) * 60 + fbm(i * .7, s + 4) * 120 - (i > 7 ? (i - 7) * -20 : 0)); pts.push([x, y]); }
    pts.push([s < 0 ? -100 : W + 100, 2100]);
    poly(c, pts, '#0C0606');
  }
  fillPath(c, 'M -100 -100 L 1180 -100 L 1180 300 C 900 420 180 420 -100 300 Z', '#0A0505');
  for (const [x, y] of o.torches || [[150, 900], [930, 900]]) { const f = 1 + .1 * Math.sin(t * 11 + x); glow(c, x, y, 220 * f, '#FF9A3A', .55); ellipse(c, x, y, 10, 18 * f, '#FFE0A0'); limb(c, [[x, y + 10], [x + (x < 540 ? -20 : 20), y + 80]], [10, 8], '#1A0C08'); }
}

// ---------- Indra's garden (Nandana): golden trees in a glowing haze, flowers drifting ----------
function nandana(c, t, o = {}) {
  SKY.heaven(c);
  glow(c, 540, 1100, 900, '#FFE8B0', .4 * (o.lit ?? 1));
  for (const [x, y, k] of [[120, 1500, 1.1], [960, 1480, 1.2], [380, 1420, .8], [720, 1440, .9]]) forestTree(c, x, y, k, { col: '#8A6A44', t });
  fillPath(c, 'M -100 1500 C 300 1460 700 1480 1180 1460 L 1180 2100 L -100 2100 Z', '#6A5440');
  motes(c, { n: 50, seed: 41, box: [-100, 300, W + 100, 1900], r: 4, col: '#FFD0E0', a: .6, vx: 20, vy: 30, t });
}

// ---------- Saraswati's syllables: glowing Devanagari letters flowing along a path P (points), a: alpha, q: how far
// along the stream has come (0..1) ----------
const VARNA = ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ए', 'ऐ', 'ओ', 'औ', 'क', 'ख', 'ग', 'घ', 'च', 'ज', 'त', 'द', 'न', 'प', 'म', 'य', 'र', 'ल', 'व', 'स', 'ह'];
function syllables(c, P, t, o = {}) {
  const C = through(P, 10), n = o.n ?? 26, q = o.q ?? 1, a = o.a ?? 1;
  if (a <= 0) return;
  c.save(); c.font = `${o.size || 54}px "Tiro Devanagari Sanskrit"`; c.textAlign = 'center'; c.textBaseline = 'middle';
  for (let i = 0; i < n; i++) {
    const u = ((t * (o.speed ?? .35) + i / n) % 1); if (u > q) continue;
    const p = C[Math.min(C.length - 1, Math.floor(u * (C.length - 1)))], s = (.6 + .4 * Math.sin(u * Math.PI)) * (o.shrink ? 1 - u * .7 : 1);
    c.globalAlpha = a * Math.sin(u * Math.PI); c.shadowColor = '#FFD890'; c.shadowBlur = 18;
    c.save(); c.translate(p[0] + Math.sin(t * 3 + i) * 10, p[1]); c.scale(s, s); c.fillStyle = '#FFF0C8'; c.fillText(VARNA[i % VARNA.length], 0, 0); c.restore();
  }
  c.restore();
}

// ---------- the gods kneeling (crowned silhouettes, hands joined), a row across [x0, x1] at feet y ----------
function godsRow(c, x0, x1, y, n, k, t, col = '#0E0A10') {
  for (let i = 0; i < n; i++) { const x = lerp(x0, x1, (i + .5) / n), kk = k * (.85 + hash(i * 3.1) * .3); c.save(); c.translate(x, y + hash(i) * 30); c.scale(kk * (i % 2 ? 1 : -1), kk); bhagiratha(c, { t: t + i, col, arms: 'namaste' }); c.restore(); }
}

// ---------- Indra on Airavata: the four-tusked elephant with the king of the gods riding, the vajra raised ----------
// At (x, y) = the elephant's feet, k = scale, facing right. o: t, col, vajra (0..1 its glow), lost (the tusk torn out)
function indraOnAiravata(c, x, y, k, o = {}) {
  const col = o.col || '#0A0608';
  c.save(); c.translate(x, y); c.scale(k, k);
  elephantSide(c, { t: o.t, col, run: o.run ?? .3, tusks: 4, lost: o.lost, trunk: o.trunk ?? .3 });
  c.save(); c.translate(20, -340); c.scale(.34, .34); bhagiratha(c, { t: o.t, col, arms: 'up' }); c.restore();
  c.restore();
  if (o.vajra) { const vx = x + 20 * k, vy = y - 690 * k; glow(c, vx, vy, 160 * k * 2, '#BFD4FF', .7 * o.vajra); glow(c, vx, vy, 50 * k * 2, '#FFFFFF', .9 * o.vajra); }
}
