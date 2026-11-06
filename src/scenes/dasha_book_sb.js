// dasha_book_sb.js: Dashavatar book test, Vamana pp. 2–5 in the Storybook style. Slot 0 is the character sheet, slot 1
// the spread "Three steps" (pp. 2–3), slot 2 "He grew and grew" (pp. 4–5); each is rendered at t = slot + .5.
// Drawn in the book's design space (DW × DH = half the 300 dpi canvas, under scale 2): 1 mm ≈ 5.9 units, the trim 3 mm
// in, the fold at x = DW / 2. The words are set over it by tools/book.mjs from books/dashavatar/book.js.
(() => {
  const DW = W / 2, DH = H / 2, MM = DW / 438, K = W / DW;
  const X = (mm, side = 'L') => (3 + (side === 'R' ? 216 : 0) + mm) * MM, Y = mm => (3 + mm) * MM;
  SB.boil = 0;
  // the paper grain at print scale: the 512 px tile doubled with the design space, so it reads as paper, not noise
  LOOK.finish = (c) => {
    SB_PAPER = SB_PAPER || sbPaper();
    const p = c.createPattern(SB_PAPER, 'repeat'); p.setTransform(new DOMMatrix().scale(K, K));
    c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = SB.paper; c.globalCompositeOperation = 'multiply'; c.fillStyle = p; c.fillRect(0, 0, W, H);
  };
  const wall = (c, col) => { c.fillStyle = col; c.fillRect(0, 0, DW, DH); };
  const specks = (c, n, col, y0, y1, seed) => { const r = lcg(seed); for (let i = 0; i < n; i++) sbDot(c, r() * DW, y0 + r() * (y1 - y0), 2 + r() * 3, col); };

  function sheet(c, u, t) {
    c.save(); c.scale(K, K);
    wall(c, '#9FD3C4');
    sbShukra(c, 300, 1150, .8, { t, pose: 'wary' });
    sbShukra(c, 640, 1150, .8, { t, pose: 'shock' });
    sbBali(c, 1000, 1150, .75, { t, pose: 'give' });
    sbBali(c, 1460, 1150, .75, { t, pose: 'kneel' });
    sbVamana(c, 1860, 1150, .8, { t, look: [-1, 0] });
    sbYagna(c, 2250, 1150, 1, { t });
    sbTrivikrama(c, 2380, 640, .32, { t });
    c.restore();
  }

  // ---- spread 1, "Three steps": Bali's yagna by the Narmada; the little boy walks in
  function spread1(c, u, t) {
    c.save(); c.scale(K, K);
    wall(c, '#86C5B6');
    specks(c, 60, 'rgba(60,120,105,.35)', Y(60), Y(150), 3);
    // the Narmada behind, on the right page, and the sandy bank across both pages
    sbShape(c, sbPoly([[X(150), Y(156)], [X(60, 'R'), Y(148)], [DW + 40, Y(146)], [DW + 40, Y(172)], [X(150), Y(172)]], { n: 8, jit: 2 }), '#5FA7D6', { tex: false });
    for (const [a, b, l] of [[30, 154, 30], [80, 158, 40], [140, 152, 34], [180, 160, 26]]) sbDry(c, [[X(a, 'R'), Y(b)], [X(a + l, 'R'), Y(b + 1)]], 8, '#FFFFFF', .7, 3, { n: 8 });
    sbShape(c, sbPoly([[-40, Y(166)], [X(120), Y(160)], [X(40, 'R'), Y(166)], [DW + 40, Y(162)], [DW + 40, DH + 40], [-40, DH + 40]], { n: 8, jit: 2 }), '#EBCB98', { shade: ['rgba(150,90,30,.15)', 1.5] });
    specks(c, 50, 'rgba(170,120,60,.45)', Y(172), Y(214), 8);
    // a mango-leaf toran on the yagna's two posts, left page
    for (const px of [X(12), X(200)]) sbLine(c, [[px, Y(182)], [px, Y(78)]], 16, '#A8653A', { taper: .05, trem: .4 });
    for (let i = 0; i <= 18; i++) { const f = i / 18, x = lerp(X(12), X(200), f), y = Y(80) + Math.sin(f * Math.PI) * 50;
      c.save(); c.translate(x, y); c.rotate(Math.sin(i * 1.7) * .15); sbShape(c, sbPoly([[-9, 0], [9, 0], [0, 46]], { n: 4, jit: .6 }), i % 2 ? '#4E9A5A' : '#6CB86A', { tex: false }); c.restore();
      if (i % 3 === 0) sbDot(c, x, y + 4, 9, '#F7891B'); }
    sbLine(c, [[X(12), Y(80)], [X(106), Y(80) + 50], [X(200), Y(80)]], 5, '#C8643A', { taper: .1 });
    sbCloud(c, X(36, 'R'), Y(108), 200, '#FFFFFF', .7); sbCloud(c, X(176, 'R'), Y(92), 240, '#FFFFFF', .7);
    // Shukracharya, wary, behind the king; Bali holding out the water pot; the fire between them and the boy
    sbShukra(c, X(42), Y(186), .5, { t, pose: 'wary', look: [1, 0] });
    sbYagna(c, X(176), Y(190), .6, { t });
    sbBali(c, X(104), Y(192), .62, { t, pose: 'give', look: [1, .2] });
    sbVamana(c, X(88, 'R'), Y(196), .44, { t, look: [-1, 0] });
    c.restore();
  }

  // ---- spread 2, "He grew and grew": Trivikrama fills the sky; on the earth, Bali kneels
  function spread2(c, u, t) {
    c.save(); c.scale(K, K);
    wall(c, '#F2A086');
    // the sun, the moon, the stars and the planets the second step strides past
    const sx = X(42), sy = Y(96);
    for (let i = 0; i < 14; i++) { const a = i / 14 * TAU; sbDry(c, [[sx + Math.cos(a) * 70, sy + Math.sin(a) * 70], [sx + Math.cos(a) * 104, sy + Math.sin(a) * 104]], 12, '#FFD24A', .9, 4, { n: 6 }); }
    sbEll(c, sx, sy, 58, 58, '#FFD24A', { tex: false, spot: [sx - 16, sy - 16, 30, 'rgba(255,255,255,.35)'] });
    sbEll(c, X(188, 'R'), Y(78), 40, 40, '#FFF6D8', { tex: false }); sbEll(c, X(188, 'R') + 18, Y(78) - 10, 36, 36, '#F2A086', { tex: false });
    sbEll(c, X(196), Y(132), 26, 26, '#9FC7F2', { tex: false }); sbEll(c, X(196), Y(132), 46, 10, 'rgba(255,255,255,.7)', { tex: false, rot: -.3 });
    sbEll(c, X(150, 'R'), Y(118), 20, 20, '#F7DD8A', { tex: false });
    const r = lcg(12);
    for (let i = 0; i < 46; i++) { const x = r() * DW, y = Y(4) + r() * Y(150); if (Math.hypot(x - sx, y - sy) < 140) continue; sbStar(c, x, y, 6 + r() * 12, r() < .25 ? '#FFE680' : '#FFFDF4'); }
    // clouds round the giant's knees: he stands higher than the clouds
    for (const [a, b, w] of [[6, 150, 300], [70, 158, 340], [150, 146, 260], [-30, 162, 220]]) sbCloud(c, X(a, 'R'), Y(b), w, '#FFFFFF', .85);
    // the earth: a great curve across both pages, land and sea, tiny trees
    const ecx = DW / 2, ecy = Y(186) + 2600, R = 2600;
    sbEll(c, ecx, ecy, R + 22, R + 22, '#FFFFFF', { tex: false, alpha: .35, n: 360, wob: .002 });
    sbEll(c, ecx, ecy, R, R, '#5AA6D8', { tex: false, n: 360, wob: .002 });
    c.save(); c.beginPath(); c.arc(ecx, ecy, R, 0, TAU); c.clip();
    for (const [a, w, h, d] of [[-.5, 260, 90, 30], [-.36, 200, 70, 10], [-.2, 340, 110, 40], [-.02, 220, 80, 0], [.14, 380, 120, 50], [.3, 240, 80, 20], [.44, 300, 100, 40]]) {
      const an = -Math.PI / 2 + a, rr = R - d; sbEll(c, ecx + Math.cos(an) * rr, ecy + Math.sin(an) * rr, w, h, '#7DBA6A', { wob: .09, rot: a, shade: ['rgba(30,80,30,.2)', 1.6] }); }
    c.save(); c.globalCompositeOperation = 'source-atop'; const g = c.createRadialGradient(ecx, ecy, R - 200, ecx, ecy, R); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(255,255,255,.28)'); c.fillStyle = g; c.fillRect(0, 0, DW, DH); c.restore();
    c.restore();
    const rt = lcg(5); for (let i = 0; i < 26; i++) { const a = -Math.PI / 2 + (rt() - .5) * 1, x = ecx + Math.cos(a) * R, y = ecy + Math.sin(a) * R; if (Math.abs(x - X(40, 'R')) < 120) continue; sbEll(c, x, y - 14, 10, 16, '#3E8A4E', { tex: false }); }
    // Trivikrama, his right foot on the earth, his left raised through the sky
    sbTrivikrama(c, X(44, 'R'), Y(184), .78, { t, look: [-.6, .5] });
    sbCloud(c, X(52, 'R'), Y(160), 300, '#FFFFFF', .92);   // a cloud drifting past his shin
    // on the earth below the raised foot: Shukracharya aghast, Bali kneeling to offer his head
    sbShukra(c, X(64), Y(188), .26, { t, pose: 'shock' });
    sbBali(c, X(118), Y(190), .32, { t, pose: 'kneel' });
    c.restore();
  }

  SHOTS.push({ a: 0, b: 1, draw: sheet });
  SHOTS.push({ a: 1, b: 2, draw: spread1 });
  SHOTS.push({ a: 2, b: 3, draw: spread2 });
})();
