// dasha_book_po.js: Dashavatar book test, Vamana pp. 2–5 in the Pothi style (src/pothi.js, cast in src/po_dashavatar.js).
// Slot 0 is the cast sheet, slot 1 the spread "Three steps" (pp. 2–3), slot 2 "He grew and grew" (pp. 4–5); each is
// rendered at t = slot + .5. Drawn in the book's design space (DW × DH = half the 300 dpi canvas, under scale 2): 1 mm ≈
// 5.9 units, the trim 3 mm in, the fold at x = DW / 2. The words are set over it by tools/book.mjs from
// books/dashavatar/book.js (variant 'pothi').
(() => {
  const DW = W / 2, DH = H / 2, MM = DW / 438, K = W / DW;
  const X = (mm, side = 'L') => (3 + (side === 'R' ? 216 : 0) + mm) * MM, Y = mm => (3 + mm) * MM;
  PT.k = K;
  Object.assign(LOOK, { bloom: .05, vignette: 0, grain: .02 });
  // a figure at (x, y) (its feet), scale s, facing right (or left with flip)
  const fig = (c, x, y, s, fn, o = {}, flip = false) => { c.save(); c.translate(x, y); c.scale(flip ? -s : s, s); fn(c, o); c.restore(); };
  const shadow = (c, x, y, rx, ry, a = .25, col = '90,60,40') => { c.save(); c.translate(x, y); c.scale(1, ry / rx); c.fillStyle = ptRad(c, 0, 0, 0, rx, [[0, `rgba(${col},${a})`], [1, `rgba(${col},0)`]]); c.fillRect(-rx, -rx, rx * 2, rx * 2); c.restore(); };
  const paper = (c, seed, tint) => {
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.drawImage(poPaper(W, H, seed), 0, 0); c.restore();
  };
  const grain = (c, seed, a) => { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = a; c.drawImage(poGrain(W, H, seed, 1.4), 0, 0); c.restore(); };
  // a Pothi cloud: round lobes on a flat base, cream, lavender under, light on top
  function pdCloud(c, x, y, w, seed = 1, a = 1, col = '#F7F1E6', shc = 'rgba(150,140,172,.6)') {
    const R = lcg(seed), n = Math.max(3, Math.round(w / 60)), C = [];
    for (let i = 0; i < n; i++) { const u = (i + .5) / n, r = (22 + R() * 22) * (.55 + .45 * Math.sin(Math.PI * u)) * w / 300 + 14; C.push([x - w / 2 + u * w, y - r * .35, r]); }
    const P = [[x + w / 2 + 6, y, 1], [x - w / 2 - 6, y, 1]];
    for (let px = x - w / 2; px <= x + w / 2; px += 5) { let top = y; for (const [cx, cy, r] of C) { const d = px - cx; if (Math.abs(d) < r) top = Math.min(top, cy - Math.sqrt(r * r - d * d)); } P.push([px, Math.min(top, y - 4)]); }
    c.save(); c.globalAlpha *= a; poFill(c, P, col, { sh: [0, 14, 10, shc], hi: [0, -8, 6, 'rgba(255,255,252,.95)'] }); c.restore();
  }
  const sparkle = (c, x, y, r, col = '#FFF4D8', a = 1) => { c.save(); c.globalAlpha *= a; poFill(c, [[x, y - r, 1], [x + r * .2, y - r * .2], [x + r, y, 1], [x + r * .2, y + r * .2], [x, y + r, 1], [x - r * .2, y + r * .2], [x - r, y, 1], [x - r * .2, y - r * .2]], col); c.restore(); };

  // ---- slot 0: the cast sheet
  function sheet(c) {
    paper(c, 3);
    c.save(); c.scale(K, K);
    const gy = 1180;
    fig(c, 220, gy, .9, pdShukra, {}); fig(c, 520, gy, .9, pdShukra, { pose: 'shock' });
    fig(c, 860, gy, .9, pdBali, {}); fig(c, 1220, gy, .9, pdBali, { pose: 'kneel' });
    fig(c, 1600, gy, 1.1, pdVamana, {}, true);
    fig(c, 2050, gy, .9, pdTrivikrama, {}, true);
    pdKund(c, 2420, gy, { s: .7 });
    c.restore();
  }

  // ---- spread 1, "Three steps": golden hour on the Narmada
  const S1 = { horizon: Y(140), bank: Y(162), sun: [X(158, 'R'), Y(116)] };
  const P1 = { shukra: [X(44), Y(197), .74], bali: [X(100), Y(199), .88], kund: [X(170), Y(201), .62], vamana: [X(98, 'R'), Y(200), .8] };
  function spread1(c) {
    paper(c, 5);
    c.save(); c.scale(K, K);
    // the evening wash from the top, warm
    c.fillStyle = ptLin(c, 0, 0, 0, S1.horizon, [[0, 'rgba(206,128,84,.5)'], [.55, 'rgba(232,176,120,.28)'], [1, 'rgba(246,214,170,.05)']]); c.fillRect(0, 0, DW, S1.horizon);
    // the sun low over the far bank, behind the boy
    const [sx, sy] = S1.sun; glow(c, sx, sy, 300, '#FFB060', .3, 'source-over');
    ellipse(c, sx, sy, 84, 84, '#F6D488'); ellipse(c, sx, sy, 70, 70, '#FBE4A8');
    // birds going home
    for (const [bx, by, s] of [[X(120, 'R'), Y(88), 1], [X(132, 'R'), Y(80), .8], [X(110, 'R'), Y(78), .7]]) poLine(c, [[bx - 14 * s, by - 6 * s], [bx - 5 * s, by - 1], [bx, by + 2], [bx + 5 * s, by - 1], [bx + 14 * s, by - 6 * s]], '#5A4040', 2.4 * s);
    // the far bank: low lavender hills, a few trees
    c.save(); c.globalAlpha = .55;
    const hill = x => S1.horizon - 22 - 18 * Math.sin(x / 300) - 10 * Math.sin(x / 97);
    const fb = [[-20, S1.horizon + 8, 1], [-20, hill(-20), 1]]; for (let x = 0; x <= DW; x += 80) fb.push([x, hill(x)]); fb.push([DW + 40, hill(DW + 40), 1], [DW + 40, S1.horizon + 8, 1]);
    const bank = poPath(fb), tr = lcg(8);
    for (let i = 0; i < 22; i++) { const x = tr() * DW, r = 12 + tr() * 14, y = hill(x) - r * .55; const e = new Path2D(); e.ellipse(x, y, r * 1.2, r, 0, 0, TAU); bank.addPath(e); }
    poFill(c, bank, '#9C94AC');
    c.restore();
    // the Narmada
    poWater(c, S1.horizon, 3, { w: DW, h: S1.bank - S1.horizon + 30, len: 15 });
    // the near bank: pale sand, its edge in a soft shade, tufts of grass
    const sand = x => S1.bank + 8 * Math.sin(x / 260 + 1) + 4 * Math.sin(x / 71);
    const nb = [[-20, DH + 20, 1], [-20, sand(-20), 1]]; for (let x = 0; x <= DW; x += 60) nb.push([x, sand(x)]); nb.push([DW + 40, sand(DW + 40), 1], [DW + 40, DH + 20, 1]);
    poFill(c, nb, '#E4D2AE', { sh: [0, -18, 16, 'rgba(176,150,110,.5)'], hi: [0, 10, 10, 'rgba(250,240,220,.6)'], wash: [[0, S1.bank, 0, DH], [[0, 'rgba(228,210,174,0)'], [1, 'rgba(206,182,140,.5)']]] });
    const gr = lcg(12); for (let i = 0; i < 26; i++) { const x = gr() * DW, y = S1.bank + 20 + gr() * (DH - S1.bank - 40); if (Math.abs(x - DW / 2) < 60) continue; for (let k = -2; k <= 2; k++) poLine(c, [[x + k * 4, y], [x + k * 9, y - 18 - gr() * 12]], rgba(PO.leaf.base, .6), 2); }
    // the toran on its posts over the king's yagna
    pdPost(c, X(140), Y(84), Y(192)); pdPost(c, X(200), Y(84), Y(192));
    pdToran(c, X(140), X(200), Y(88), 40);
    shadow(c, X(140), Y(192), 40, 8); shadow(c, X(200), Y(192), 40, 8);
    // the yagna
    const [kx, ky, ks] = P1.kund; shadow(c, kx, ky, 160, 18, .3);
    pdKund(c, kx, ky, { s: ks, ph: 1.3 });
    // the guru and the king, facing the boy; their shadows
    for (const [x, y, s] of [P1.shukra, P1.bali, P1.vamana]) shadow(c, x, y, 110 * s, 16 * s, .3);
    fig(c, ...P1.shukra, pdShukra, {});
    fig(c, ...P1.bali, pdBali, {});
    // the boy walking in from the sunset
    const [vx, vy, vs] = P1.vamana;
    fig(c, vx, vy, vs, pdVamana, { step: .7 }, true);
    // sprigs in the bottom corners
    poSprig(c, X(-3), Y(219), 260, Math.PI * .82, { seed: 3, sway: .4, n: 12, leafLen: 30, buds: 1, bud: '#E0901C' });
    poSprig(c, X(219, 'R'), Y(219), 220, -Math.PI * .8, { seed: 5, sway: -.4, n: 11, leafLen: 28 });
    c.restore();
    grain(c, 9, .28);
  }

  // ---- spread 2, "He grew and grew": the night sky over the curve of the earth
  const ER = 3000, EC = [X(200), Y(190) + 3000];
  const groundY = x => EC[1] - Math.sqrt(ER * ER - (x - EC[0]) ** 2);
  const P2 = { trivi: [X(36, 'R'), 1.0], shukra: [X(74), .3], bali: [X(112), .36] };
  function spread2(c) {
    paper(c, 7);
    c.save(); c.scale(K, K);
    c.fillStyle = ptLin(c, 0, 0, 0, DH, [[0, '#34355A'], [.42, '#544C76'], [.72, '#A2809A'], [1, '#E2BCA4']]); c.fillRect(0, 0, DW, DH);
    // stars: fine dots, a few four-point sparkles
    // (kept out of the text blocks: p4 x 8–160, p5 x 104–212, down to 66 mm)
    const inText = (x, y) => y < Y(66) && ((x > X(8) && x < X(160)) || (x > X(104, 'R') && x < X(212, 'R')));
    const r = lcg(21); for (let i = 0; i < 260; i++) { const x = r() * DW, y = r() * DH * .8, a = (1 - y / (DH * .8)) * .9, rr = 1.6 + r() * 2.2, k = .4 + r() * .6; if (!inText(x, y)) ellipse(c, x, y, rr, rr, `rgba(255,246,226,${a * k})`); }
    for (let i = 0; i < 26; i++) { const x = r() * DW, y = r() * DH * .62, rr = 9 + r() * 12, k = .5 + r() * .5; if (!inText(x, y)) sparkle(c, x, y, rr, '#FFF4D8', k); }
    // the sun the raised foot strides past, the moon, two planets
    const [sx, sy] = [X(168), Y(110)];
    glow(c, sx, sy, 360, '#FFC070', .5, 'source-over'); ellipse(c, sx, sy, 92, 92, '#F6CE78'); ellipse(c, sx, sy, 76, 76, '#FBE2A0');
    const [mx, my] = [X(184, 'R'), Y(92)]; glow(c, mx, my, 160, '#E8E4F4', .25, 'source-over');
    poFill(c, poPath(Array.from({ length: 24 }, (_, i) => { const a = i / 24 * TAU; return [mx + Math.cos(a) * 46, my + Math.sin(a) * 46]; })), '#EEE8DA', { sh: [-10, 6, 10, 'rgba(160,150,180,.6)'] });
    ellipse(c, mx + 20, my - 12, 40, 40, '#4C4670');
    const [px, py] = [X(92), Y(78)]; ellipse(c, px, py, 30, 30, '#D8B888'); c.save(); c.translate(px, py); c.rotate(-.3); c.strokeStyle = 'rgba(232,214,180,.9)'; c.lineWidth = 5; c.beginPath(); c.ellipse(0, 0, 58, 14, 0, 0, TAU); c.stroke(); c.restore();
    ellipse(c, X(150, 'R'), Y(126), 16, 16, '#B8584A');
    // the earth: a great curve of ocean and land, a pale rim of air
    c.save();
    glow(c, EC[0], Y(190), 1600, '#F4D4B8', .25, 'source-over');
    const ep = new Path2D(); ep.arc(EC[0], EC[1], ER, 0, TAU);
    poFill(c, ep, '#3E6470', { sh: [0, -60, 60, 'rgba(240,226,214,.55)'], hi: [0, 40, 50, 'rgba(30,50,60,.5)'], inside: () => {
      const L = PO.leaf, lr = lcg(5);
      for (const [lx, w, h] of [[X(20), 700, 150], [X(150), 520, 120], [X(60, 'R'), 900, 140], [X(170, 'R'), 600, 110]]) {
        const ly = groundY(lx) + h * .35, P = []; for (let i = 0; i < 16; i++) { const a = i / 16 * TAU; P.push([lx + Math.cos(a) * w / 2 * (.8 + lr() * .3), ly + Math.sin(a) * h / 2 * (.7 + lr() * .4)]); }
        poFill(c, P, L.base, { sh: [0, 14, 14, rgba(L.dk, .7)], hi: [0, -10, 10, rgba(L.lt, .6)] });
      }
    } });
    c.restore();
    // clouds about his shin: he stands taller than the clouds
    const [tx, ts] = P2.trivi, ty = groundY(tx);
    pdCloud(c, tx + 170, ty - 120, 520, 4, .95, '#F2E6E2', 'rgba(150,120,160,.6)');
    // Trivikrama, facing left over Bali, the sole of his raised foot past the sun
    glow(c, tx - 60, ty - 620 * ts, 900, '#FFE6B0', .22, 'source-over');
    fig(c, tx, ty, ts, pdTrivikrama, {}, true);
    pdCloud(c, tx - 40, ty - 30, 640, 7, 1, '#F4EAE4', 'rgba(150,120,160,.6)');
    pdCloud(c, X(150, 'R'), groundY(X(150, 'R')) - 40, 380, 11, .9, '#F2E6E2', 'rgba(150,120,160,.6)');
    // on the earth below the foot: Shukracharya aghast, Bali kneeling
    for (const [x, s] of [P2.shukra, P2.bali]) { const y = groundY(x); shadow(c, x, y, 110 * s * 1.4, 14, .35, '20,30,40'); }
    fig(c, P2.shukra[0], groundY(P2.shukra[0]), P2.shukra[1], pdShukra, { pose: 'shock' });
    fig(c, P2.bali[0], groundY(P2.bali[0]), P2.bali[1], pdBali, { pose: 'kneel' });
    c.restore();
    grain(c, 11, .22);
  }

  SHOTS.push({ a: 0, b: 1, draw: sheet });
  SHOTS.push({ a: 1, b: 2, draw: spread1 });
  SHOTS.push({ a: 2, b: 3, draw: spread2 });
})();
