// dasha_book_pt.js: Dashavatar book test, Vamana pp. 2–5 in the Painterly style. Slot 0 is the character sheet (the
// designs painted), slot 1 the spread "Three steps" (pp. 2–3), slot 2 "He grew and grew" (pp. 4–5); each is rendered
// at t = slot + .5. Drawn in the book's design space (DW × DH = half the 300 dpi canvas, under scale 2; PT.k = 2 so the
// paint is made at print resolution): 1 mm ≈ 5.9 units, the trim 3 mm in, the fold at x = DW / 2. The words are set
// over it by tools/book.mjs from books/dashavatar/book.js (variant 'painterly').
(() => {
  const DW = W / 2, DH = H / 2, MM = DW / 438, K = W / DW;
  const X = (mm, side = 'L') => (3 + (side === 'R' ? 216 : 0) + mm) * MM, Y = mm => (3 + mm) * MM;
  PT.k = K;
  Object.assign(LOOK, { bloom: .12, vignette: 0, grain: .02 });
  // a character as a painted cut-out: drawn at (x, y) scale s, its local bounds b = [x0, y0, x1, y1]
  const cut = (key, x, y, s, b, draw, o = {}) => ptLayer(key, [x + b[0] * s, y + b[1] * s, (b[2] - b[0]) * s, (b[3] - b[1]) * s],
    (dc) => ptdAt(dc, x, y, s, draw, o.flip), { alpha: true, seed: o.seed || 17, brushes: o.brushes || PT_BRUSHES.slice(1), fine: o.fine, keep: o.keep, rough: 1.4 });
  // a face to keep legible: local head centre (hx, hy) and radius r → fine and keep discs in design px
  const face = (x, y, s, hx, hy, r) => ({ fine: [[x + hx * s, y + hy * s, r * s * 1.3]], keep: [[x + hx * s, y + hy * s, r * s * 1.05, .5]] });
  const B = { vamana: [-450, -1020, 210, 20], bali: [-270, -1220, 480, 20], baliK: [-260, -900, 260, 20], shukra: [-270, -920, 270, 20], trivi: [-920, -1500, 540, 20], fire: [-210, -340, 210, 50] };
  const shadow = (c, x, y, rx, ry, a = .35) => { c.save(); c.translate(x, y); c.scale(1, ry / rx); c.fillStyle = ptRad(c, 0, 0, 0, rx, [[0, `rgba(60,30,10,${a})`], [1, 'rgba(60,30,10,0)']]); c.fillRect(-rx, -rx, rx * 2, rx * 2); c.restore(); };

  function sheet(c, u, t) {
    c.save(); c.scale(K, K);
    c.fillStyle = ptLin(c, 0, 0, 0, DH, [[0, '#E8E0D0'], [1, '#C8B8A0']]); c.fillRect(0, 0, DW, DH);
    const row = [['sh_shukra', 260, 1180, .9, B.shukra, ptdShukra, {}, [0, -730, 84]], ['sh_shukra2', 620, 1180, .9, B.shukra, ptdShukra, { pose: 'shock' }, [0, -730, 84]],
      ['sh_bali', 1000, 1180, .85, B.bali, ptdBali, {}, [0, -950, 92]], ['sh_baliK', 1460, 1180, .85, B.baliK, ptdBali, { pose: 'kneel' }, [0, -590, 92]],
      ['sh_vamana', 1900, 1180, .9, B.vamana, ptdVamana, {}, [0, -545, 100]], ['sh_trivi', 2380, 700, .4, B.trivi, ptdTrivikrama, {}, [0, -1170, 100]]];
    for (const [key, x, y, s, b, fn, o, [hx, hy, r]] of row) ptDraw(c, cut(key, x, y, s, b, (dc) => fn(dc, o), face(x, y, s, hx, hy, r)));
    c.restore();
  }

  // ---- spread 1, "Three steps"
  const S1 = { DW, DH, sun: [X(186, 'R'), Y(104)], horizon: Y(140), bank: Y(166), posts: [X(14), X(198)], toranY: Y(68), fire: [X(176), Y(190)] };
  const P1 = { shukra: [X(44), Y(192), .44], bali: [X(106), Y(196), .58], vamana: [X(90, 'R'), Y(198), .62] };
  function spread1(c, u, t) {
    c.save(); c.scale(K, K);
    ptDraw(c, ptLayer('s1set', [0, 0, DW, DH], (dc) => {
      ptdRiverSet(dc, S1);
      for (const [x, y, s] of [P1.shukra, P1.bali, P1.vamana]) shadow(dc, x, y, 240 * s, 40 * s, .4);
    }, { seed: 5 }));
    rays(c, S1.sun[0], S1.sun[1], { n: 22, dir: Math.PI * .8, spread: Math.PI * 1.2, len: 1500, w: 200, col: '#FFF0C0', a: .16, t: 0, seed: 3 });
    glow(c, S1.sun[0], S1.sun[1], 380, '#FFF2C0', .5, 'screen');
    // the fire and its light on everyone near it
    const [fx, fy] = S1.fire;
    glow(c, fx, fy - 140, 520, '#FFB050', .35, 'screen');
    ptDraw(c, cut('s1fire', fx, fy, .62, B.fire, ptdFire, { brushes: PT_BRUSHES.slice(2), seed: 23 }));
    for (const [key, p, fn, o, hd] of [['s1shukra', P1.shukra, ptdShukra, { look: [1, 0] }, [0, -730, 84]], ['s1bali', P1.bali, ptdBali, { look: [1, .1] }, [0, -950, 92]]]) {
      const [x, y, s] = p, L = cut(key, x, y, s, key === 's1bali' ? B.bali : B.shukra, (dc) => fn(dc, o), face(x, y, s, ...hd));
      ptDraw(c, L); ptDraw(c, ptRim(L, { dx: 5, dy: -2, col: '#FFC870', blur: 5, key }), .55, 'screen');
    }
    // the boy, the sun behind him: a halo, a rim of gold
    const [vx, vy, vs] = P1.vamana;
    glow(c, vx, vy - 545 * vs, 260, '#FFF4C8', .45, 'screen');
    const V = cut('s1vamana', vx, vy, vs, B.vamana, (dc) => ptdVamana(dc, { look: [-1, 0] }), face(vx, vy, vs, 0, -545, 100));
    ptDraw(c, V); const vr = ptRim(V, { dx: 5, dy: -5, col: '#FFF0A8', blur: 6, key: 'v' }); ptDraw(c, vr, .7, 'screen');
    vr.pts.forEach(([x, y], i) => { if (hash(i + 4) < .25) twinkle(c, x, y, 8 + hash(i + 3) * 10, .6 * hash(i + 7)); });
    motes(c, { n: 90, seed: 4, box: [0, Y(40), DW, Y(200)], r: 3.4, col: '#FFF0C0', a: .55, t: 0 });
    c.restore();
  }

  // ---- spread 2, "He grew and grew"
  const S2 = { DW, DH, horizon: DH, earth: Y(184), sun: [X(44), Y(102)], moon: [X(188, 'R'), Y(80)], planet: [X(116), Y(76)], mars: [X(150, 'R'), Y(126)],
    clouds: [[X(-8, 'R'), Y(160), 560, 3], [X(70, 'R'), Y(168), 640, 6], [X(170, 'R'), Y(150), 520, 9], [X(30), Y(160), 440, 12], [X(150), Y(172), 380, 14]] };
  const P2 = { trivi: [X(46, 'R'), Y(185), .74], shukra: [X(70), Y(187), .22], bali: [X(118), Y(189), .27] };
  function spread2(c, u, t) {
    c.save(); c.scale(K, K);
    ptDraw(c, ptLayer('s2set', [0, 0, DW, DH], (dc) => ptdCosmos(dc, S2), { seed: 7 }));
    // a few stars that sparkle
    const r = lcg(33); for (let i = 0; i < 26; i++) { const x = r() * DW, y = r() * Y(110); twinkle(c, x, y, 10 + r() * 16, .5 + r() * .4, '#FFF8E0'); }
    // Vishnu's light: an aura behind him, a rim, the chakra blazing
    const [tx, ty, ts] = P2.trivi;
    glow(c, tx, ty - 900 * ts, 1100, '#FFE6A8', .35, 'screen');
    glow(c, tx, ty - 1170 * ts, 420, '#FFF4D0', .4, 'screen');
    const T = cut('s2trivi', tx, ty, ts, B.trivi, ptdTrivikrama, face(tx, ty, ts, 0, -1170, 100));
    ptDraw(c, T); const tr = ptRim(T, { dx: 0, dy: -6, col: '#FFF0B8', blur: 8, key: 't' }); ptDraw(c, tr, .6, 'screen');
    glow(c, tx + 360 * ts, ty - 1340 * ts, 260, '#FFE080', .7, 'screen');
    // a cloud drifting past his shin: he stands taller than the clouds
    ptDraw(c, ptLayer('s2cloudF', [tx - 460, ty - 500, 920, 460], (dc) => cloud(dc, tx + 30, ty - 210, 760, 17, ['#B0607A', '#F2A68A', '#FFE2C0'], 1), { alpha: true, seed: 29, brushes: PT_BRUSHES.slice(1) }), .95);
    tr.pts.forEach(([x, y], i) => { if (hash(i + 4) < .18) twinkle(c, x, y, 9 + hash(i + 3) * 12, .7 * hash(i + 7)); });
    // on the earth below the raised foot: Shukracharya aghast, Bali kneeling
    for (const [key, p, fn, o, b, hd] of [['s2shukra', P2.shukra, ptdShukra, { pose: 'shock' }, B.shukra, [0, -730, 84]], ['s2bali', P2.bali, ptdBali, { pose: 'kneel' }, B.baliK, [0, -590, 92]]]) {
      const [x, y, s] = p; glow(c, x, y - 300 * s, 160, '#FFE6B0', .3, 'screen');
      const L = cut(key, x, y, s, b, (dc) => fn(dc, o), { ...face(x, y, s, ...hd), brushes: PT_BRUSHES.slice(2) });
      ptDraw(c, L); ptDraw(c, ptRim(L, { dx: 3, dy: -4, col: '#FFE6B0', blur: 3, key }), .6, 'screen');
    }
    motes(c, { n: 60, seed: 9, box: [0, Y(20), DW, Y(180)], r: 3, col: '#FFF0D0', a: .5, t: 0 });
    c.restore();
  }

  SHOTS.push({ a: 0, b: 1, draw: sheet });
  SHOTS.push({ a: 1, b: 2, draw: spread1 });
  SHOTS.push({ a: 2, b: 3, draw: spread2 });
})();
