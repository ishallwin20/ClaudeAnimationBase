// dasha_book.js: the Dashavatar book's pages, one slot per spread (rendered at t = slot + .5 by tools/book.mjs
// --page=book_dasha_pages.html): slot 0 = the inside front cover | p. 1, slot n = pp. 2n | 2n + 1. Drawn in the book's
// design space (DW × DH = half the 300 dpi spread canvas, under scale 2); positions are given in mm on the trim through
// XL / XR (the left and right pages) and Y. The words sit over the art as live text (books/dashavatar/book.js): every
// page leaves their zones quiet. Cast: src/po_dasha_gods.js, src/po_dasha_world.js; furniture: src/po_dasha_frame.js.
// The introduction (pp. 1–11) is books/dashavatar/INTRO.md.
(() => {
  const DW = W / 2, DH = H / 2, K = W / DW;
  PT.k = K;
  Object.assign(LOOK, { bloom: .04, vignette: 0, grain: .02 });
  const TW = 216, MM = DW / (2 * TW + 6), BL = 3 * MM, PG = TW * MM;
  const Y = mm => BL + mm * MM, XL = mm => BL + mm * MM, XR = mm => BL + PG + mm * MM;
  const ACC = '#C9A24A';
  // a spread's draw, in the design space
  const spread = fn => c => { c.save(); c.scale(K, K); fn(c); c.restore(); };   // the introduction's accent: gold (each avatar chapter gets its own)
  const front = (c, x, y, s, fn, o = {}) => { c.save(); c.translate(x, y); c.scale(s, s); c.translate(0, -PF_SOLE); fn(c, o); c.restore(); };
  const side = (c, x, y, s, fn, o = {}, flip = false) => { c.save(); c.translate(x, y); c.scale(flip ? -s : s, s); fn(c, o); c.restore(); };
  // clip to one page with its outer bleed ('L', 'R'), never into the facing page, or to the whole spread ('S')
  function clipTo(c, w) {
    const p = new Path2D();
    if (w === 'L') p.rect(-60, -60, BL + PG + 60, DH + 120); else if (w === 'R') p.rect(BL + PG, -60, DW, DH + 120); else p.rect(-60, -60, DW + 120, DH + 120);
    c.clip(p);
  }
  // the border: round one page, or round the whole spread (o.split: the left half wilted, the right in bloom)
  function frame(c, w, o = {}) {
    const x0 = w === 'R' ? BL + PG : BL, x1 = w === 'L' ? BL + PG : BL + 2 * PG, base = { bw: 64, bleed: 40, accent: ACC, seed: 1 };
    if (o.split) {
      for (const [h, oo] of [['L', o.left], ['R', o.right]]) { c.save(); clipTo(c, h); pdPageFrame(c, x0, BL, x1, BL + PG, { ...base, ...o, ...oo }); c.restore(); }
      return;
    }
    c.save(); clipTo(c, w); pdPageFrame(c, x0, BL, x1, BL + PG, { ...base, ...o }); c.restore();
  }
  const vsky = (c, x0, y0, x1, y1, stops) => { c.save(); c.fillStyle = ptLin(c, 0, y0, 0, y1, stops); c.fillRect(x0, y0, x1 - x0, y1 - y0); c.restore(); };
  const stars = (c, x0, y0, x1, y1, n, seed, a = 1) => { const R = lcg(seed); for (let i = 0; i < n; i++) { const x = lerp(x0, x1, R()), y = lerp(y0, y1, R() * R()), r = .8 + R() * 2.2; ellipse(c, x, y, r, r, rgba('#FFF4D8', (.35 + R() * .55) * a)); } };

  // ---------- small set pieces ----------
  // a gold lotus rosette seen from above (the endpaper, the frame's corners)
  function rosette(c, x, y, r, a = 1) {
    const G = PFR.gold, L = PFR.lotus;
    c.save(); c.translate(x, y); c.globalAlpha *= a;
    for (let k = 0; k < 8; k++) { c.save(); c.rotate(k / 8 * TAU + Math.PI / 8); poFill(c, [[0, 0, 1], [-r * .26, -r * .5], [0, -r, 1], [r * .26, -r * .5]], G.base, { sh: [r * .06, 0, r * .08, rgba(G.dk, .85)], hi: [-r * .04, -r * .06, r * .06, rgba(G.lt, .9)] }); c.restore(); }
    for (let k = 0; k < 8; k++) { c.save(); c.rotate(k / 8 * TAU); poFill(c, [[0, 0, 1], [-r * .2, -r * .36], [0, -r * .68, 1], [r * .2, -r * .36]], L.base, { sh: [r * .05, 0, r * .06, rgba(L.dk, .8)] }); c.restore(); }
    ellipse(c, 0, 0, r * .26, r * .26, G.base); pdGem(c, 0, 0, r * .14, PDX.ruby);
    c.restore();
  }
  // a crescent moon
  function moon(c, x, y, r, col = '#FFF4D6') {
    glow(c, x, y, r * 4, '#FFF4D6', .35, 'source-over');
    c.save(); const cp = new Path2D(); cp.arc(x, y, r, 0, TAU); c.clip(cp);
    const p = new Path2D(); p.arc(x, y, r, 0, TAU); p.arc(x + r * .5, y - r * .28, r * .9, 0, TAU);
    c.fillStyle = col; c.fill(p, 'evenodd'); c.restore();
  }
  // a row of rounded hills, its foot at yb
  function hills(c, x0, x1, yb, h, n, seed, pal) {
    const R = lcg(seed), P = [[x0 - 40, yb + 400, 1], [x0 - 40, yb - h * .5]];
    for (let i = 0; i <= n; i++) P.push([lerp(x0, x1, i / n) + (R() - .5) * 30, yb - h * (.35 + R() * .65)]);
    P.push([x1 + 40, yb - h * .5], [x1 + 40, yb + 400, 1]);
    poFill(c, P, pal.base, { sh: [0, 18, 22, rgba(pal.dk, .7)], hi: [0, -6, 8, rgba(pal.lt, .8)] });
  }
  // a tree with its crown of leaf clumps (o.wilt: the crown thin and brown, the branches drooping, leaves falling)
  function tree(c, x, y, s, seed, o = {}) {
    const R = lcg(seed), wilt = o.wilt || 0, bark = { base: '#6A4A34', lt: '#8E6A4E', dk: '#3E2A1C' };
    const leaf = pfMixPal({ base: '#4E7A4A', lt: '#76A06A', dk: '#2E5030' }, { base: '#7A6C46', lt: '#988A5E', dk: '#4E4428' }, wilt);
    c.save(); c.translate(x, y); c.scale(s, s);
    poFill(c, poLimb([[0, 0], [-4, -90], [4, -190], [0, -250]], [26, 18, 13, 9]), bark.base, { sh: [6, 0, 8, rgba(bark.dk, .8)], hi: [-4, 0, 4, rgba(bark.lt, .7)] });
    const tips = [];
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + (i - 2) * .55, len = 110 + R() * 50, bx = Math.cos(a) * len, by = -200 + Math.sin(a) * len * .6;
      const P = [[0, -170 - i * 8], [bx * .5, by - 20 + wilt * 20], [bx, by + wilt * 90]];
      poFill(c, poLimb(P, [9, 6, 3]), bark.base, { sh: [3, 0, 4, rgba(bark.dk, .7)] });
      tips.push(P[2], P[1]);
    }
    for (const [tx, ty] of tips) {
      const n = wilt ? 3 : 4;
      for (let k = 0; k < n; k++) { const rx = wilt ? 8 + R() * 10 : 46 + R() * 20, cx = tx + (R() - .5) * 60, cy = ty - 10 + (R() - .5) * 40 + wilt * 20; poFill(c, Array.from({ length: 9 }, (_, j) => { const a = j / 9 * TAU, rr = rx * (.86 + .14 * Math.sin(j * 2.3 + k)); return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * .8]; }), leaf.base, { sh: [6, 8, 10, rgba(leaf.dk, .8)], hi: [-5, -6, 6, rgba(leaf.lt, .7)] }); }
    }
    if (wilt) for (let i = 0; i < 8; i++) { const lx = (R() - .5) * 360, ly = -40 + R() * 60; c.save(); c.translate(lx, ly); c.rotate(R() * 3); poFill(c, [[0, 0, 1], [-6, -6], [0, -16, 1], [6, -6]], leaf.base, { alpha: .85 }); c.restore(); }
    c.restore();
  }
  // cracked dry earth between y0 and y1
  function cracks(c, x0, y0, x1, y1, seed) {
    const R = lcg(seed);
    vsky(c, x0, y0, x1, y1, [[0, '#7E6A4E'], [.4, '#6A5640'], [1, '#4A3C2E']]);
    for (let i = 0; i < 46; i++) {
      const k = R(), x = lerp(x0, x1, R()), y = lerp(y0, y1, k * k), len = 20 + k * 70, P = [[x, y]];
      for (let j = 0; j < 4; j++) { const [px, py] = P[P.length - 1]; P.push([px + (R() - .3) * len, py + (R() - .5) * len * .25]); }
      poLine(c, P, rgba('#2E241A', .55 + k * .3), 1 + k * 2.4);
      if (R() < .5) { const [px, py] = P[2]; poLine(c, [[px, py], [px + (R() - .5) * len * .6, py + R() * len * .3]], rgba('#2E241A', .5), 1 + k * 1.4); }
    }
  }
  // a gold roundel with a little scene inside (the dharma tree's fruit)
  function roundel(c, x, y, r, draw, field = [[0, '#FBEFD6'], [.62, '#F4DDB4'], [.64, '#A8BC82'], [1, '#8EA86C']]) {
    const G = PFR.gold;
    c.save(); c.translate(x, y);
    glow(c, 0, 0, r * 1.5, '#FFE6A0', .45, 'source-over');
    ellipse(c, 0, 0, r * 1.04, r * 1.04, G.dk);
    c.save(); const cp = new Path2D(); cp.arc(0, 0, r * .9, 0, TAU); c.clip(cp);
    c.fillStyle = ptLin(c, 0, -r, 0, r, field); c.fillRect(-r, -r, r * 2, r * 2);
    draw(c, r * .9);
    c.restore();
    c.save(); c.strokeStyle = G.base; c.lineWidth = r * .14; c.beginPath(); c.arc(0, 0, r * .97, 0, TAU); c.stroke(); c.restore();
    poDots(c, Array.from({ length: 37 }, (_, i) => [Math.cos(i / 36 * TAU) * r * .97, Math.sin(i / 36 * TAU) * r * .97]), r * .035, r * .16, PDX.pearl, false);
    c.restore();
  }

  // ---------- slot 0: the endpaper | p. 1, the title ----------
  function title(c) {
    // the inside front cover: indigo with a lattice of gold lotus rosettes
    c.save(); clipTo(c, 'L');
    c.fillStyle = PFR.indigo; c.fillRect(-60, -60, BL + PG + 60, DH + 120);
    const R = lcg(11); for (let i = 0; i < 70; i++) glow(c, R() * (BL + PG), R() * DH, 70 + R() * 90, PFR.indigoLt, .2, 'source-over');
    const gp = 27 * MM, pts = [];
    for (let r = -1; r * gp / 2 < DH + gp; r++) for (let k = -1; k * gp < BL + PG + gp; k++) pts.push([k * gp + (r & 1) * gp / 2, r * gp / 2]);
    c.save(); c.strokeStyle = rgba(PFR.gold.base, .32); c.lineWidth = 2;
    for (const [x, y] of pts) { c.beginPath(); c.moveTo(x, y); c.lineTo(x + gp / 2, y + gp / 2); c.moveTo(x, y); c.lineTo(x - gp / 2, y + gp / 2); c.stroke(); }
    c.restore();
    for (const [x, y] of pts) rosette(c, x, y, gp * .16, .9);
    for (const [x, y] of pts) poDots(c, [[x + gp / 4, y + gp / 4], [x - gp / 4, y + gp / 4]], 2.6, 10, PFR.gold.base);
    c.restore();
    // p. 1: the night over the glowing ocean; the chakra rising like a sun behind the title; ten lights; the lotus
    c.save(); clipTo(c, 'R');
    const x0 = BL + PG - 10, x1 = DW + 20, cx = XR(108), hz = Y(126);
    vsky(c, x0, -20, x1, hz, [[0, '#0A0E30'], [.55, '#1C2456'], [.88, '#3E427C'], [1, '#7C709E']]);
    stars(c, x0, -20, x1, hz, 170, 3);
    glow(c, cx, Y(45), 520, '#FFE2A0', .26, 'source-over');
    c.save(); c.globalAlpha = .4; pdChakra(c, cx, Y(45), 168); c.restore();
    pdMilkOcean(c, x0, hz, x1, DH + 20, {});
    glow(c, cx, hz + 6, 620, '#FFF2C8', .4, 'source-over');
    pdGoldenLotus(c, cx, Y(152), 160);
    for (let i = 0; i < 10; i++) {
      const a = Math.PI * (1.1 + i / 9 * .8), x = cx + Math.cos(a) * 470, y = Y(114) + Math.sin(a) * 175;
      glow(c, x, y, 46, '#FFE6A0', .9, 'source-over'); ellipse(c, x, y, 7.5, 7.5, '#FFF6DC');
    }
    c.restore();
    frame(c, 'R', { seed: 1 });
  }
  SHOTS.push({ a: 0, b: 1, draw: spread(title) });

  // ---------- slot 1: pp. 2–3, the Silent Ocean (one picture across the spread) ----------
  function silentOcean(c) {
    const hz = Y(98);
    c.save(); clipTo(c, 'S');
    vsky(c, -40, -40, DW + 40, hz, [[0, '#0C1036'], [.55, '#1E285E'], [.86, '#3E4682'], [1, '#8A82B4']]);
    stars(c, -40, -40, DW + 40, hz, 300, 21);
    pdMilkOcean(c, -40, hz, DW + 40, DH + 40, { gx: XR(96) });
    // the light of the Lord on the water
    glow(c, XR(96), Y(150), 760, '#FFF0C8', .36, 'source-over');
    // a few lotuses and pads drifting near the fold
    for (const [x, y, s] of [[XL(204), Y(104), .8], [XR(12), Y(108), .6], [XR(196), Y(110), .7]]) { poPad(c, x, y + 10, 46 * s, 12 * s, 0); poLotus(c, x + 8, y + 4, 22 * s, .8); }
    // Vishnu on Shesha with Brahma on the navel lotus; Lakshmi at his feet on a lotus
    const s = .8, ax = XR(85), ay = Y(156), k = s / .78;
    c.save(); c.globalAlpha = .35; ellipse(c, ax - 20, ay + 250 * s, 560 * s, 40 * s, '#8A86B0'); c.restore();
    pdAnanta(c, ax, ay, s, { glow: 1 });
    const lx = ax + 545 * k, ly = ay + 130 * k;
    pdLotusSeat(c, lx - 10 * k, ly - 6 * k, 250 * k, { back: true });
    side(c, lx, ly, .62 * k, pdLakshmi, { pose: 'serve' }, true);
    pdLotusSeat(c, lx - 10 * k, ly - 6 * k, 250 * k);
    // the verse scroll on the left page's water
    pdBanner(c, XL(108), Y(156), 166 * MM, 92 * MM, { roll: 120 });
    c.restore();
    frame(c, 'S', { seed: 2 });
  }
  SHOTS.push({ a: 1, b: 2, draw: spread(silentOcean) });

  // ---------- slot 2: p. 4, the One who is everywhere | p. 5, what is dharma? ----------
  function everywhere(c) {
    c.save(); clipTo(c, 'L');
    const x0 = -60, x1 = BL + PG + 4, hz = Y(150);
    vsky(c, x0, -60, x1, hz, [[0, '#A6C6E4'], [.45, '#E4E2E6'], [.78, '#F6DCB6'], [1, '#F4C690']]);
    moon(c, XL(194), Y(25), 6 * MM);
    // the sun rising behind the hills, a rain cloud over the far hills, the hills green
    hills(c, x0, x1, Y(152), 20 * MM, 7, 5, { base: '#8EAE86', lt: '#B4CCA4', dk: '#5E8060' });
    pdHalo(c, XL(42), Y(147), 15 * MM, { a: 1, glow: '#FFE8B0' });
    pdCloud(c, XL(170), Y(137), 34 * MM, 6, 1, '#C8CEDC', 'rgba(100,110,140,.7)', 'rgba(240,244,252,.9)');
    for (let i = 0; i < 12; i++) { const x = XL(158) + i * 2 * MM; poLine(c, [[x, Y(139.5)], [x - 6, Y(147)]], 'rgba(110,140,190,.6)', 2.2); }
    hills(c, x0, x1, Y(156), 9 * MM, 9, 9, { base: '#5E8E5C', lt: '#86B07A', dk: '#3E6A44' });
    // the calm sea, Vishnu on his lotus above it
    pdMilkOcean(c, x0, Y(154), x1, DH + 40, { stops: [[0, '#D6E6EA'], [.4, '#A8CAD6'], [1, '#6E9AB4']], glowCol: '#FFF4D8', glow: .5, gx: XL(108) });
    glow(c, XL(108), Y(120), 520, '#FFF6DA', .4, 'source-over');
    front(c, XL(108), Y(168), .46, pdVishnuStand, {});
    // his four treasures
    const md = (x, y, ic) => pdMedallion(c, XL(x), Y(y), 8.4 * MM, ic, { field: '#6E1E2A', fieldGlow: '#A2364A' });
    md(25, 82, 'shankha'); md(25, 120, 'chakra'); md(191, 82, 'gada'); md(191, 120, 'padma');
    c.restore();
    frame(c, 'L', { seed: 3 });
  }
  // the four scenes of dharma, in each roundel's frame (r: the field's radius; feet on y = .56 r)
  const DHARMA = [
    // a child helping an elder along the path, hand in hand
    (c, r) => { const s = .2, g = r * .58, H = [92, -400]; side(c, -60, g, s, pdPerson, { kind: 'elder', legs: 'walk', near: { to: H, hand: 'grip' }, far: { to: [118, -430], hand: 'grip' }, prop: { far: 'stick' }, eye: 'low' }); side(c, -60 + 230 * s, g, s, pdPerson, { kind: 'boy', legs: 'walk', far: { to: [H[0] - 230, H[1] + 6], hand: 'grip' }, near: [.1, .15, 'open'], tilt: -.12, top: PW.leafCloth }); },
    // a farmer sharing grain
    (c, r) => { const s = .19, g = r * .58, d = 410 * s; side(c, -d / 2 - 20, g, s, pdPerson, { kind: 'man', near: { to: [150, -520], hand: 'grip' }, far: { to: [130, -545], hand: 'grip' }, prop: { near: 'basket', far: 'grain' }, tilt: .1, lean: .06 }); side(c, d / 2 - 20, g, s, pdPerson, { kind: 'woman', near: { to: [150, -470], hand: 'up' }, far: [.05, .1, 'open'], prop: { near: 'bowl' }, tilt: .1 }, true); },
    // a teacher with two students
    (c, r) => { const s = .2, g = r * .5; tree(c, -r * .62, g, .32, 4); side(c, -70, g, s, pdPerson, { kind: 'sage', legs: 'sit', near: [.5, 1.6, 'open'], far: [.4, 1.2, 'up'], prop: { far: 'leaf' } }); side(c, -70 + 333 * s, g, s, pdPerson, { kind: 'girl', legs: 'sit', near: [.3, 1.1, 'grip'], far: [.3, 1, 'up'], prop: { near: 'leaf' }, tilt: -.1 }, true); side(c, -70 + 513 * s, g, s, pdPerson, { kind: 'boy', legs: 'sit', near: [.3, 1.2, 'join'], far: [.3, 1.2, 'join'], tilt: -.1 }, true); },
    // a boy returning a lost purse
    (c, r) => { const s = .2, g = r * .58, d = 295 * s; side(c, -d / 2 - 14, g, s, pdPerson, { kind: 'boy', near: { to: [150, -440], hand: 'grip' }, far: [.1, .2, 'open'], prop: { near: 'purse' }, top: PW.rust }); side(c, d / 2 - 14, g, s, pdPerson, { kind: 'man', near: { to: [99, -400], hand: 'up' }, far: [.05, .1, 'open'], lean: .12, tilt: .2, eye: 'wide', brow: 1, mouth: 'smile', pagri: PW.rust }, true); },
  ];
  function dharma(c) {
    c.save(); clipTo(c, 'R');
    const x0 = BL + PG - 4, x1 = DW + 60;
    vsky(c, x0, -60, x1, DH + 60, [[0, '#E6A49C'], [.35, '#F0BE92'], [.7, '#F8DCAE'], [1, '#F6E6C6']]);
    // the chakra behind the tree like a rising sun
    glow(c, XR(152), Y(80), 640, '#FFE6A8', .55, 'source-over');
    c.save(); c.globalAlpha = .3; pdChakra(c, XR(152), Y(80), 250); c.restore();
    hills(c, x0, x1, Y(166), 12 * MM, 6, 14, { base: '#C8B68A', lt: '#E0D2AA', dk: '#9A8A62' });
    // the tree: golden roots, a trunk, branches to the four scenes, a crown of leaves behind them
    const tx = XR(153), G = PFR.gold;
    for (const [ex, ey, w] of [[-70, 30, 7], [-34, 40, 6], [0, 42, 6], [36, 40, 6], [72, 28, 7], [-100, 8, 5], [100, 6, 5]]) poLine(c, [[tx, Y(156)], [tx + ex * MM * .5, Y(160) + ey * .3 * MM], [tx + ex * MM, Y(160) + ey * .1 * MM]], G.dk, w + 2), poLine(c, [[tx, Y(156)], [tx + ex * MM * .5, Y(160) + ey * .3 * MM], [tx + ex * MM, Y(160) + ey * .1 * MM]], G.base, w);
    const crown = { base: '#3E6E48', lt: '#5E9064', dk: '#244A2E' }, Rr = lcg(7);
    for (let i = 0; i < 34; i++) { const a = Rr() * TAU, d = Math.sqrt(Rr()), cx = XR(153) + Math.cos(a) * d * 46 * MM, cy = Y(72) + Math.sin(a) * d * 52 * MM, rr = (12 + Rr() * 8) * MM; poFill(c, Array.from({ length: 10 }, (_, j) => { const b = j / 10 * TAU, q = rr * (.88 + .12 * Math.sin(j * 2.1 + i)); return [cx + Math.cos(b) * q, cy + Math.sin(b) * q * .84]; }), crown.base, { sh: [8, 10, 14, rgba(crown.dk, .8)], hi: [-6, -8, 8, rgba(crown.lt, .7)] }); }
    for (let i = 0; i < 90; i++) { const a = Rr() * TAU, d = Math.sqrt(Rr()), x = XR(153) + Math.cos(a) * d * 50 * MM, y = Y(72) + Math.sin(a) * d * 56 * MM; ellipse(c, x, y, 3.2, 3.2, rgba(G.lt, .8)); }
    poFill(c, poLimb([[tx, Y(158)], [tx - 6, Y(140)], [tx + 4, Y(118)], [tx, Y(96)]], [56, 40, 34, 28]), '#6A4A34', { sh: [10, 0, 14, 'rgba(50,30,20,.8)'], hi: [-8, 0, 8, 'rgba(160,120,90,.6)'] });
    const RC = [[134, 44], [180, 44], [134, 96], [180, 96]];
    for (const [x, y] of RC) poFill(c, poLimb([[tx, Y(110)], [lerp(tx, XR(x), .5), lerp(Y(110), Y(y), .6) - 20], [XR(x), Y(y)]], [22, 14, 10]), '#6A4A34', { sh: [6, 0, 8, 'rgba(50,30,20,.8)'] });
    RC.forEach(([x, y], i) => roundel(c, XR(x), Y(y), 21.5 * MM, DHARMA[i]));
    // the Dharma Wisdom box among the roots
    pdWisdomBox(c, XR(108), Y(182.5), 186 * MM, 39 * MM);
    c.restore();
    frame(c, 'R', { seed: 4 });
  }
  SHOTS.push({ a: 2, b: 3, draw: spread(c => { everywhere(c); dharma(c); }) });

  // ---------- slot 3: p. 6, the world grows heavy | p. 7, the Ocean of Milk ----------
  function heavy(c) {
    c.save(); clipTo(c, 'L');
    const x0 = -60, x1 = BL + PG + 4, hz = Y(142);
    vsky(c, x0, -60, x1, Y(170), [[0, '#171A2E'], [.42, '#2E2C48'], [.7, '#544A68'], [.82, '#86768A'], [1, '#86768A']]);
    // a thin line of gold breaking through on the horizon
    glow(c, XL(176), hz - 4, 420, '#F2C46A', .5, 'source-over');
    c.save(); c.fillStyle = ptLin(c, XL(100), 0, XL(216), 0, [[0, 'rgba(242,196,106,0)'], [.6, 'rgba(255,214,130,.9)'], [1, 'rgba(255,224,150,.95)']]); c.fillRect(XL(100), hz - 6, XL(216) - XL(100) + 20, 7); c.restore();
    // storm clouds behind the words
    const SC = ['#2E3048', 'rgba(10,10,24,.7)', 'rgba(120,112,150,.45)'];
    for (const [x, y, w, sd] of [[30, 40, 120, 3], [150, 22, 140, 5], [90, 78, 150, 8], [196, 96, 110, 9], [20, 112, 100, 12]]) pdCloud(c, XL(x), Y(y), w * MM, sd, .95, ...SC);
    // a dry valley: far hills, wilting trees, worried villagers, cracked earth
    hills(c, x0, x1, Y(150), 14 * MM, 6, 21, { base: '#5A5244', lt: '#7A7058', dk: '#3A3428' });
    cracks(c, x0, Y(148), x1, DH + 60, 5);
    tree(c, XL(28), Y(162), .5, 2, { wilt: 1 });
    tree(c, XL(200), Y(156), .42, 9, { wilt: 1 });
    tree(c, XL(112), Y(150), .28, 13, { wilt: 1 });
    const v = { brow: -1, eye: 'wide', mouth: 'calm' };
    side(c, XL(96), Y(156), .12, pdPerson, { kind: 'man', ...v, near: [.3, 2.4, 'open'], far: [.2, 2.3, 'open'], tilt: -.2, pagri: PW.rust }, true);
    side(c, XL(104), Y(156), .12, pdPerson, { kind: 'woman', ...v, near: [.2, .3, 'open'], far: [.1, .2, 'open'], cloth: PW.leafCloth, top: PW.rust }, true);
    side(c, XL(110), Y(156), .12, pdPerson, { kind: 'girl', ...v, near: [.2, .3, 'open'], far: [.1, .2, 'open'] }, true);
    // the Earth as a cow, in tears, before Brahma, who bends to her
    glow(c, XL(90), Y(180), 320, '#FFE6B0', .35, 'source-over');
    side(c, XL(84), Y(199), .44, pdBhumiCow, { mood: 'sad', glow: 1 });
    front(c, XL(148), Y(201), .39, pdBrahma, { pose: 'bless' });
    c.restore();
    frame(c, 'L', { wilt: 1, seed: 5 });
  }
  function milkOcean(c) {
    c.save(); clipTo(c, 'R');
    const x0 = BL + PG - 4, x1 = DW + 60, hz = Y(122);
    vsky(c, x0, -60, x1, hz, [[0, '#1C1E50'], [.5, '#4A4482'], [.84, '#A07A9C'], [1, '#EAB88C']]);
    stars(c, x0, -60, x1, hz * .7, 90, 31, .8);
    glow(c, XR(150), hz, 560, '#FFD890', .65, 'source-over');
    pdMilkOcean(c, x0, hz, x1, DH + 60, { stops: [[0, '#F6E4D0'], [.4, '#DCCADA'], [1, '#9C92BA']], glowCol: '#FFE2B0', glow: .8, gx: XR(150) });
    // a ripple of light crossing the water toward them
    const R = lcg(4);
    for (let i = 0; i < 60; i++) { const k = R(), y = lerp(hz + 6, Y(186), k * k), w = (6 + k * 40) * (.5 + R()), x = lerp(XR(150), XR(96), k) + (R() - .5) * (20 + k * 260); poLine(c, [[x - w, y], [x + w, y]], rgba('#FFE8A8', .85 - k * .4), 1.6 + k * 3); }
    // the shore
    poFill(c, [[x0, Y(186)], [XR(60), Y(184)], [XR(140), Y(188)], [x1, Y(184)], [x1, DH + 60, 1], [x0, DH + 60, 1]], '#D8C0A0', { sh: [0, 12, 14, 'rgba(140,110,90,.6)'], hi: [0, -4, 4, 'rgba(255,248,236,.9)'] });
    poLine(c, [[x0, Y(185.5)], [XR(60), Y(183.5)], [XR(140), Y(187.5)], [x1, Y(183.5)]], 'rgba(255,255,255,.85)', 3);
    // the gods on the shore, hands joined; Brahma listens with his eyes closed; the Earth beside them
    front(c, XR(40), Y(201), .33, pdShivaStand, {});
    front(c, XR(148), Y(201), .33, pdIndra, {});
    front(c, XR(94), Y(203), .35, pdBrahma, { pose: 'pray' });
    side(c, XR(188), Y(204), .3, pdBhumiCow, { mood: 'hope', glow: .6 }, true);
    c.restore();
    frame(c, 'R', { wilt: .4, seed: 6 });
  }
  SHOTS.push({ a: 3, b: 4, draw: spread(c => { heavy(c); milkOcean(c); }) });

  // ---------- slot 4: pp. 8–9, the Promise (one picture across the spread) ----------
  function promise(c) {
    c.save(); clipTo(c, 'S');
    const hz = Y(170);
    vsky(c, -60, -60, DW + 60, DH + 60, [[0, '#24205A'], [.5, '#6E528A'], [1, '#E6B48A']]);
    // the left: the storm still over the world, lifting toward the fold
    c.save(); c.fillStyle = ptLin(c, XL(0), 0, XR(30), 0, [[0, 'rgba(14,14,34,.92)'], [.55, 'rgba(20,18,44,.75)'], [1, 'rgba(20,18,44,0)']]); c.fillRect(-60, -60, XR(30) + 60, DH + 120); c.restore();
    const SC = ['#2C2C46', 'rgba(8,8,20,.7)', 'rgba(130,120,160,.4)'];
    for (const [x, y, w, sd] of [[24, 30, 120, 3], [140, 18, 120, 5], [70, 90, 140, 7], [168, 70, 70, 11]]) pdCloud(c, XL(x), Y(y), w * MM, sd, .9, ...SC);
    // the right: gold light bursting; the ten forms faint in an arc; Vishnu rising over the clouds
    glow(c, XR(108), Y(92), 900, '#FFD88A', .7, 'source-over');
    glow(c, XR(108), Y(92), 420, '#FFF2C8', .5, 'source-over');
    const rg = c.createRadialGradient(XR(108), Y(92), 120, XR(108), Y(92), 1000); rg.addColorStop(0, 'rgba(255,240,192,.22)'); rg.addColorStop(.6, 'rgba(255,240,192,.08)'); rg.addColorStop(1, 'rgba(255,240,192,0)');
    for (let i = 0; i < 36; i++) { const a = -Math.PI * (.02 + i / 35 * .96), r0 = 160, r1 = 1100; c.save(); c.fillStyle = rg; c.filter = 'blur(6px)'; c.beginPath(); c.moveTo(XR(108) + Math.cos(a - .025) * r0, Y(92) + Math.sin(a - .025) * r0); c.lineTo(XR(108) + Math.cos(a - .05) * r1, Y(92) + Math.sin(a - .05) * r1); c.lineTo(XR(108) + Math.cos(a + .05) * r1, Y(92) + Math.sin(a + .05) * r1); c.lineTo(XR(108) + Math.cos(a + .025) * r0, Y(92) + Math.sin(a + .025) * r0); c.fill(); c.restore(); }
    const icons = ['fish', 'tortoise', 'boar', 'lion', 'vamana', 'axe', 'bow', 'flute', 'buddha', 'horse'];
    icons.forEach((ic, i) => { const a = Math.PI * (1.06 + i / 9 * .88), x = XR(108) + Math.cos(a) * 86 * MM, y = Y(116) + Math.sin(a) * 82 * MM; c.save(); c.globalAlpha = .6; c.translate(x, y); c.scale(.4, .4); glow(c, 0, 0, 120, '#FFF0C0', .7, 'source-over'); pdIcon(c, ic); c.restore(); });
    front(c, XR(108), Y(150) + 512 * 1.0, 1.0, pdVishnuStand, { bless: true, seat: false });
    // the left's dark water and shore, the gods small, looking on
    pdMilkOcean(c, -60, hz, XR(0), DH + 60, { stops: [[0, '#8C84A8'], [.5, '#6A6290'], [1, '#4A4470']], glowCol: '#E8D0B0', glow: .4, gx: XR(-10) });
    poFill(c, [[-60, Y(196)], [XL(60), Y(193)], [XL(140), Y(196)], [XR(0), Y(194)], [XR(0), DH + 60, 1], [-60, DH + 60, 1]], '#8A7A86', { sh: [0, 10, 12, 'rgba(40,30,50,.6)'], hi: [0, -3, 3, 'rgba(240,224,220,.6)'] });
    glow(c, XL(120), Y(184), 380, '#FFD890', .25, 'source-over');
    front(c, XL(70), Y(201), .15, pdShivaStand, { halo: .6 });
    front(c, XL(110), Y(202), .16, pdBrahma, { pose: 'pray', halo: .6 });
    front(c, XL(150), Y(201), .15, pdIndra, { halo: .6 });
    side(c, XL(186), Y(203), .14, pdBhumiCow, { mood: 'hope', glow: .8 });
    // the cloud bank Vishnu rises from; the meaning sits on it
    for (const [x, y, w, sd] of [[60, 212, 150, 4], [160, 214, 150, 7], [108, 184, 170, 9], [26, 196, 90, 12], [196, 192, 80, 15], [108, 206, 196, 17]]) pdCloud(c, XR(x), Y(y), w * MM, sd, 1, '#FAF0E8', 'rgba(170,130,150,.55)');
    c.restore();
    frame(c, 'S', { split: true, left: { wilt: 1 }, right: { bloom: 1 }, seed: 7 });
  }
  SHOTS.push({ a: 4, b: 5, draw: spread(promise) });

  // ---------- slot 5: pp. 10–11, ten times he came ----------
  const TEN = ['fish', 'tortoise', 'boar', 'lion', 'vamana', 'axe', 'bow', 'flute', 'buddha', 'horse'];
  function tenTimes(c) {
    c.save(); clipTo(c, 'S');
    const hz = Y(186);
    vsky(c, -60, -60, DW + 60, hz, [[0, '#12184A'], [.5, '#363276'], [.84, '#86689C'], [1, '#D6A68E']]);
    stars(c, -60, -60, DW + 60, hz, 260, 41);
    pdMilkOcean(c, -60, hz, DW + 60, DH + 60, { gx: XR(150) });
    pdGoldenLotus(c, XL(64), Y(200), 44);
    // the ten, petal by petal down each page: a medallion and its line on a scroll
    const bulge = i => 1 - ((i - 2) / 2) ** 2;
    for (let i = 0; i < 10; i++) {
      const L = i < 5, j = i % 5, cy = L ? Y(55 + j * 26) : Y(30 + j * 25);
      if (L) pdBanner(c, XL(119), cy, 152 * MM, 15 * MM, { roll: 66 }); else pdBanner(c, XR(97), cy, 154 * MM, 15 * MM, { roll: 66 });
      const mx = L ? XL(29 - 4 * bulge(j)) : XR(187 + 4 * bulge(j));
      pdMedallion(c, mx, cy, 8.6 * MM, TEN[i], { glow: .5 });
    }
    // the Silent Ocean again, small: Vishnu asleep on Shesha
    glow(c, XR(168), Y(186), 300, '#FFF0C8', .45, 'source-over');
    pdAnanta(c, XR(168), Y(191), .27, { glow: 1 });
    c.restore();
    frame(c, 'S', { bloom: .5, seed: 8 });
  }
  SHOTS.push({ a: 5, b: 6, draw: spread(tenTimes) });
})();
