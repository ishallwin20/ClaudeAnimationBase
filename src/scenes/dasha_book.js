// dasha_book.js: the Dashavatar book's pages, one slot per spread (rendered at t = slot + .5 by tools/book.mjs
// --page=book_dasha_pages.html): slot 0 = the inside front cover | p. 1, slot n = pp. 2n | 2n + 1. A page is 6 × 9 in
// (152.4 × 228.6 mm; the spread 12 × 9 in, 3600 × 2700 px at 300 dpi), no bleed, no border: the picture stops 0.25 in
// (6.35 mm) inside the trim on the outer edges and runs on across the fold, where nothing important may sit (faces and
// eyes stay 12 mm or more off it). Drawn in the book's design space (DW × DH = half the canvas, under scale 2);
// positions are given in mm on the trim through XL / XR (the left and right pages) and Y. The words sit over the art as
// live text (books/dashavatar/book.js): every page leaves their zones quiet. Cast: src/po_dasha_gods.js,
// src/po_dasha_world.js; furniture: src/po_dasha_frame.js. The introduction (pp. 1–11) is books/dashavatar/INTRO.md.
(() => {
  const DW = W / 2, DH = H / 2, K = W / DW;
  PT.k = K;
  Object.assign(LOOK, { bloom: .04, vignette: 0, grain: .02 });
  const TW = 152.4, MM = DW / (2 * TW), PG = TW * MM, MG = 6.35 * MM;
  const Y = mm => mm * MM, XL = mm => mm * MM, XR = mm => PG + mm * MM;
  const PAPER = '#FFFFFF';
  // a spread's draw, in the design space; then the paper margin round the picture (o.blankL: the left page all paper)
  const spread = (fn, o = {}) => c => {
    c.save(); c.scale(K, K); fn(c);
    const p = new Path2D(); p.rect(-10, -10, DW + 20, DH + 20); p.rect(o.blankL ? PG : MG, MG, DW - MG - (o.blankL ? PG : MG), DH - 2 * MG);
    c.fillStyle = PAPER; c.fill(p, 'evenodd');
    if (o.blankL) c.fillRect(-10, -10, PG + 10, DH + 20);
    c.restore();
  };
  const front = (c, x, y, s, fn, o = {}) => { c.save(); c.translate(x, y); c.scale(s, s); c.translate(0, -PF_SOLE); fn(c, o); c.restore(); };
  const side = (c, x, y, s, fn, o = {}, flip = false) => { c.save(); c.translate(x, y); c.scale(flip ? -s : s, s); fn(c, o); c.restore(); };
  // clip to one page ('L', 'R'), never into the facing page, or to the whole spread ('S')
  function clipTo(c, w) {
    const p = new Path2D();
    if (w === 'L') p.rect(-60, -60, PG + 60, DH + 120); else if (w === 'R') p.rect(PG, -60, DW, DH + 120); else p.rect(-60, -60, DW + 120, DH + 120);
    c.clip(p);
  }
  const vsky = (c, x0, y0, x1, y1, stops) => { c.save(); c.fillStyle = ptLin(c, 0, y0, 0, y1, stops); c.fillRect(x0, y0, x1 - x0, y1 - y0); c.restore(); };
  const stars = (c, x0, y0, x1, y1, n, seed, a = 1) => { const R = lcg(seed); for (let i = 0; i < n; i++) { const x = lerp(x0, x1, R()), y = lerp(y0, y1, R() * R()), r = .8 + R() * 2.2; ellipse(c, x, y, r, r, rgba('#FFF4D8', (.35 + R() * .55) * a)); } };

  // ---------- small set pieces ----------
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
    const k = r / (21.5 * MM); c.save(); c.scale(k, k); draw(c, r * .9 / k); c.restore();   // the scenes are staged for r = 21.5 mm
    c.restore();
    c.save(); c.strokeStyle = G.base; c.lineWidth = r * .14; c.beginPath(); c.arc(0, 0, r * .97, 0, TAU); c.stroke(); c.restore();
    poDots(c, Array.from({ length: 37 }, (_, i) => [Math.cos(i / 36 * TAU) * r * .97, Math.sin(i / 36 * TAU) * r * .97]), r * .035, r * .16, PDX.pearl, false);
    c.restore();
  }

  // ---------- slot 0: the inside front cover (paper, for now: the back of the cover) | p. 1, the title ----------
  function title(c) {
    // p. 1: the night over the glowing ocean; the chakra rising like a sun behind the title; ten lights; the lotus
    c.save(); clipTo(c, 'R');
    const x0 = PG - 10, x1 = DW + 20, cx = XR(76.2), hz = Y(134);
    vsky(c, x0, -20, x1, hz, [[0, '#0A0E30'], [.55, '#1C2456'], [.88, '#3E427C'], [1, '#7C709E']]);
    stars(c, x0, -20, x1, hz, 150, 3);
    glow(c, cx, Y(50), 460, '#FFE2A0', .26, 'source-over');
    c.save(); c.globalAlpha = .4; pdChakra(c, cx, Y(50), 160); c.restore();
    pdMilkOcean(c, x0, hz, x1, DH + 20, {});
    glow(c, cx, hz + 6, 520, '#FFF2C8', .4, 'source-over');
    pdGoldenLotus(c, cx, Y(166), 150);
    for (let i = 0; i < 10; i++) {
      const a = Math.PI * (1.1 + i / 9 * .8), x = cx + Math.cos(a) * 330, y = Y(124) + Math.sin(a) * 150;
      glow(c, x, y, 44, '#FFE6A0', .9, 'source-over'); ellipse(c, x, y, 7, 7, '#FFF6DC');
    }
    c.restore();
  }
  SHOTS.push({ a: 0, b: 1, draw: spread(title, { blankL: true }) });

  // ---------- slot 1: pp. 2–3, the Silent Ocean (one picture across the spread) ----------
  function silentOcean(c) {
    const hz = Y(100);
    c.save(); clipTo(c, 'S');
    vsky(c, -40, -40, DW + 40, hz, [[0, '#0C1036'], [.55, '#1E285E'], [.86, '#3E4682'], [1, '#8A82B4']]);
    stars(c, -40, -40, DW + 40, hz, 300, 21);
    pdMilkOcean(c, -40, hz, DW + 40, DH + 40, { gx: XR(76) });
    // the light of the Lord on the water
    glow(c, XR(76), Y(150), 700, '#FFF0C8', .36, 'source-over');
    // a few lotuses and pads drifting
    for (const [x, y, s] of [[XL(142), Y(104), .7], [XR(14), Y(107), .6], [XR(132), Y(206), .8]]) { poPad(c, x, y + 10, 46 * s, 12 * s, 0); poLotus(c, x + 8, y + 4, 22 * s, .8); }
    // Vishnu on Shesha, Brahma large on the navel lotus
    const s = .78, ax = XR(80), ay = Y(150);
    c.save(); c.globalAlpha = .35; ellipse(c, ax - 20, ay + 250 * s, 560 * s, 40 * s, '#8A86B0'); c.restore();
    pdAnanta(c, ax, ay, s, { glow: 1, brahma: 1.9 });
    // the verse scroll on the left page's water
    pdBanner(c, XL(77), Y(153), 128 * MM, 86 * MM, { roll: 110 });
    c.restore();
  }
  SHOTS.push({ a: 1, b: 2, draw: spread(silentOcean) });

  // ---------- slot 2: p. 4, the One who is everywhere | p. 5, what is dharma? ----------
  function everywhere(c) {
    c.save(); clipTo(c, 'L');
    const x0 = -60, x1 = PG + 4, hz = Y(176);
    vsky(c, x0, -60, x1, hz, [[0, '#A6C6E4'], [.45, '#E4E2E6'], [.78, '#F6DCB6'], [1, '#F4C690']]);
    moon(c, XL(136), Y(18), 5 * MM);
    // the sun rising between the hills, a rain cloud over the far hills
    hills(c, x0, x1, Y(178), 16 * MM, 6, 5, { base: '#8EAE86', lt: '#B4CCA4', dk: '#5E8060' });
    pdHalo(c, XL(30), Y(174), 12 * MM, { a: 1, glow: '#FFE8B0' });
    pdCloud(c, XL(124), Y(164), 26 * MM, 6, 1, '#C8CEDC', 'rgba(100,110,140,.7)', 'rgba(240,244,252,.9)');
    for (let i = 0; i < 9; i++) { const x = XL(115) + i * 2 * MM; poLine(c, [[x, Y(166.5)], [x - 6, Y(173)]], 'rgba(110,140,190,.6)', 2.2); }
    hills(c, x0, x1, Y(182), 7 * MM, 7, 9, { base: '#5E8E5C', lt: '#86B07A', dk: '#3E6A44' });
    // the calm sea, Vishnu standing over it
    pdMilkOcean(c, x0, Y(180), x1, DH + 40, { stops: [[0, '#D6E6EA'], [.4, '#A8CAD6'], [1, '#6E9AB4']], glowCol: '#FFF4D8', glow: .5, gx: XL(77) });
    glow(c, XL(77), Y(132), 460, '#FFF6DA', .45, 'source-over');
    front(c, XL(77), Y(190), .45, pdVishnuStand, {});
    // his four treasures, each over its line
    const md = (x, y, ic) => pdMedallion(c, XL(x), Y(y), 7.4 * MM, ic, { field: '#6E1E2A', fieldGlow: '#A2364A' });
    md(30, 90, 'shankha'); md(30, 132, 'chakra'); md(124, 90, 'gada'); md(124, 132, 'padma');
    c.restore();
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
  // where p. 5's words end and the tree begins (book.js sets the text to fit above it)
  const D5 = { crown: 130, ground: 166, box: 176 };
  function dharma(c) {
    c.save(); clipTo(c, 'R');
    const x0 = PG - 4, x1 = DW + 60;
    vsky(c, x0, -60, x1, DH + 60, [[0, '#E6A49C'], [.35, '#F0BE92'], [.7, '#F8DCAE'], [1, '#F6E6C6']]);
    // the chakra behind the tree like a rising sun
    glow(c, XR(76), Y(D5.crown), 520, '#FFE6A8', .55, 'source-over');
    c.save(); c.globalAlpha = .26; pdChakra(c, XR(76), Y(D5.crown), 200); c.restore();
    hills(c, x0, x1, Y(D5.ground), 8 * MM, 5, 14, { base: '#C8B68A', lt: '#E0D2AA', dk: '#9A8A62' });
    // the tree: golden roots, a trunk, branches to the four scenes, a crown of leaves behind them
    const tx = XR(76), G = PFR.gold, gy = Y(D5.ground);
    for (const [ex, ey, w] of [[-50, 20, 6], [-24, 26, 5], [0, 28, 5], [24, 26, 5], [50, 20, 6]]) { const P = [[tx, gy - 4], [tx + ex * MM * .5, gy + ey * .2 * MM], [tx + ex * MM, gy + ey * .08 * MM]]; poLine(c, P, G.dk, w + 2); poLine(c, P, G.base, w); }
    const crown = { base: '#3E6E48', lt: '#5E9064', dk: '#244A2E' }, Rr = lcg(7), cy = Y(D5.crown - 6);
    for (let i = 0; i < 30; i++) { const a = Rr() * TAU, d = Math.sqrt(Rr()), cx = tx + Math.cos(a) * d * 50 * MM, y = cy + Math.sin(a) * d * 16 * MM, rr = (9 + Rr() * 6) * MM; poFill(c, Array.from({ length: 10 }, (_, j) => { const b = j / 10 * TAU, q = rr * (.88 + .12 * Math.sin(j * 2.1 + i)); return [cx + Math.cos(b) * q, y + Math.sin(b) * q * .84]; }), crown.base, { sh: [8, 10, 14, rgba(crown.dk, .8)], hi: [-6, -8, 8, rgba(crown.lt, .7)] }); }
    for (let i = 0; i < 70; i++) { const a = Rr() * TAU, d = Math.sqrt(Rr()), x = tx + Math.cos(a) * d * 56 * MM, y = cy + Math.sin(a) * d * 20 * MM; ellipse(c, x, y, 3, 3, rgba(G.lt, .8)); }
    poFill(c, poLimb([[tx, gy], [tx - 4, gy - 12 * MM], [tx + 3, gy - 24 * MM], [tx, cy]], [44, 34, 28, 24]), '#6A4A34', { sh: [10, 0, 14, 'rgba(50,30,20,.8)'], hi: [-8, 0, 8, 'rgba(160,120,90,.6)'] });
    const RC = [[25, D5.crown + 4], [59, D5.crown - 6], [93, D5.crown - 6], [127, D5.crown + 4]];
    for (const [x, y] of RC) poFill(c, poLimb([[tx, cy + 10], [lerp(tx, XR(x), .5), lerp(cy + 10, Y(y), .5) - 14], [XR(x), Y(y)]], [18, 12, 8]), '#6A4A34', { sh: [6, 0, 8, 'rgba(50,30,20,.8)'] });
    RC.forEach(([x, y], i) => roundel(c, XR(x), Y(y), 15.5 * MM, DHARMA[i]));
    // the Dharma Wisdom box among the roots
    pdWisdomBox(c, XR(76), Y(D5.box + 20), 130 * MM, 40 * MM);
    c.restore();
  }
  SHOTS.push({ a: 2, b: 3, draw: spread(c => { everywhere(c); dharma(c); }) });

  // ---------- slot 3: p. 6, the world grows heavy | p. 7, the Ocean of Milk ----------
  function heavy(c) {
    c.save(); clipTo(c, 'L');
    const x0 = -60, x1 = PG + 4, hz = Y(150);
    vsky(c, x0, -60, x1, Y(180), [[0, '#171A2E'], [.42, '#2E2C48'], [.7, '#544A68'], [.84, '#86768A'], [1, '#86768A']]);
    // a thin line of gold breaking through on the horizon
    glow(c, XL(124), hz - 4, 360, '#F2C46A', .5, 'source-over');
    c.save(); c.fillStyle = ptLin(c, XL(60), 0, XL(152), 0, [[0, 'rgba(242,196,106,0)'], [.6, 'rgba(255,214,130,.9)'], [1, 'rgba(255,224,150,.95)']]); c.fillRect(XL(60), hz - 6, XL(152) - XL(60) + 20, 7); c.restore();
    // storm clouds behind the words
    const SC = ['#2E3048', 'rgba(10,10,24,.7)', 'rgba(120,112,150,.45)'];
    for (const [x, y, w, sd] of [[24, 40, 90, 3], [110, 24, 100, 5], [64, 82, 110, 8], [136, 104, 70, 9], [16, 118, 76, 12]]) pdCloud(c, XL(x), Y(y), w * MM, sd, .95, ...SC);
    // a dry valley: far hills, wilting trees, worried villagers, cracked earth
    hills(c, x0, x1, Y(158), 12 * MM, 5, 21, { base: '#5A5244', lt: '#7A7058', dk: '#3A3428' });
    cracks(c, x0, Y(156), x1, DH + 60, 5);
    tree(c, XL(20), Y(172), .46, 2, { wilt: 1 });
    tree(c, XL(138), Y(166), .38, 9, { wilt: 1 });
    tree(c, XL(92), Y(158), .26, 13, { wilt: 1 });
    const v = { brow: -1, eye: 'wide', mouth: 'calm' };
    side(c, XL(60), Y(164), .12, pdPerson, { kind: 'man', ...v, near: [.3, 2.4, 'open'], far: [.2, 2.3, 'open'], tilt: -.2, pagri: PW.rust }, true);
    side(c, XL(68), Y(164), .12, pdPerson, { kind: 'woman', ...v, near: [.2, .3, 'open'], far: [.1, .2, 'open'], cloth: PW.leafCloth, top: PW.rust }, true);
    side(c, XL(74), Y(164), .12, pdPerson, { kind: 'girl', ...v, near: [.2, .3, 'open'], far: [.1, .2, 'open'] }, true);
    // the Earth as a cow, in tears, before Brahma, who bends to her
    glow(c, XL(52), Y(192), 300, '#FFE6B0', .35, 'source-over');
    side(c, XL(44), Y(212), .4, pdBhumiCow, { mood: 'sad', glow: 1 });
    front(c, XL(108), Y(214), .37, pdBrahma, { pose: 'bless' });
    c.restore();
  }
  function milkOcean(c) {
    c.save(); clipTo(c, 'R');
    const x0 = PG - 4, x1 = DW + 60, hz = Y(134);
    vsky(c, x0, -60, x1, hz, [[0, '#1C1E50'], [.5, '#4A4482'], [.84, '#A07A9C'], [1, '#EAB88C']]);
    stars(c, x0, -60, x1, hz * .7, 80, 31, .8);
    glow(c, XR(110), hz, 480, '#FFD890', .65, 'source-over');
    pdMilkOcean(c, x0, hz, x1, DH + 60, { stops: [[0, '#F6E4D0'], [.4, '#DCCADA'], [1, '#9C92BA']], glowCol: '#FFE2B0', glow: .8, gx: XR(110) });
    // a ripple of light crossing the water toward them
    const R = lcg(4);
    for (let i = 0; i < 50; i++) { const k = R(), y = lerp(hz + 6, Y(196), k * k), w = (6 + k * 34) * (.5 + R()), x = lerp(XR(110), XR(70), k) + (R() - .5) * (20 + k * 200); poLine(c, [[x - w, y], [x + w, y]], rgba('#FFE8A8', .85 - k * .4), 1.6 + k * 3); }
    // the shore
    poFill(c, [[x0, Y(198)], [XR(50), Y(196)], [XR(100), Y(200)], [x1, Y(196)], [x1, DH + 60, 1], [x0, DH + 60, 1]], '#D8C0A0', { sh: [0, 12, 14, 'rgba(140,110,90,.6)'], hi: [0, -4, 4, 'rgba(255,248,236,.9)'] });
    poLine(c, [[x0, Y(197.5)], [XR(50), Y(195.5)], [XR(100), Y(199.5)], [x1, Y(195.5)]], 'rgba(255,255,255,.85)', 3);
    // the gods on the shore, hands joined; Brahma listens with his eyes closed; the Earth beside them
    front(c, XR(28), Y(213), .3, pdShivaStand, {});
    front(c, XR(92), Y(213), .3, pdIndra, {});
    front(c, XR(60), Y(215), .32, pdBrahma, { pose: 'pray' });
    side(c, XR(127), Y(215), .27, pdBhumiCow, { mood: 'hope', glow: .6 }, true);
    c.restore();
  }
  SHOTS.push({ a: 3, b: 4, draw: spread(c => { heavy(c); milkOcean(c); }) });

  // ---------- slot 4: pp. 8–9, the Promise (one picture across the spread) ----------
  function promise(c) {
    c.save(); clipTo(c, 'S');
    const hz = Y(160), vx = XR(76), vy = Y(84);
    vsky(c, -60, -60, DW + 60, DH + 60, [[0, '#24205A'], [.5, '#6E528A'], [1, '#E6B48A']]);
    // the left: the storm still over the world, lifting toward the fold
    c.save(); c.fillStyle = ptLin(c, XL(0), 0, XR(24), 0, [[0, 'rgba(14,14,34,.92)'], [.55, 'rgba(20,18,44,.75)'], [1, 'rgba(20,18,44,0)']]); c.fillRect(-60, -60, XR(24) + 60, DH + 120); c.restore();
    const SC = ['#2C2C46', 'rgba(8,8,20,.7)', 'rgba(130,120,160,.4)'];
    for (const [x, y, w, sd] of [[22, 28, 90, 3], [100, 16, 90, 5], [56, 96, 100, 7], [120, 74, 46, 11]]) pdCloud(c, XL(x), Y(y), w * MM, sd, .9, ...SC);
    // the right: gold light bursting; the ten forms faint in an arc; Vishnu rising over the clouds
    glow(c, vx, vy, 760, '#FFD88A', .7, 'source-over');
    glow(c, vx, vy, 360, '#FFF2C8', .5, 'source-over');
    const rg = c.createRadialGradient(vx, vy, 120, vx, vy, 900); rg.addColorStop(0, 'rgba(255,240,192,.22)'); rg.addColorStop(.6, 'rgba(255,240,192,.08)'); rg.addColorStop(1, 'rgba(255,240,192,0)');
    for (let i = 0; i < 30; i++) { const a = -Math.PI * (.02 + i / 29 * .96), r0 = 140, r1 = 950; c.save(); c.fillStyle = rg; c.filter = 'blur(6px)'; c.beginPath(); c.moveTo(vx + Math.cos(a - .025) * r0, vy + Math.sin(a - .025) * r0); c.lineTo(vx + Math.cos(a - .05) * r1, vy + Math.sin(a - .05) * r1); c.lineTo(vx + Math.cos(a + .05) * r1, vy + Math.sin(a + .05) * r1); c.lineTo(vx + Math.cos(a + .025) * r0, vy + Math.sin(a + .025) * r0); c.fill(); c.restore(); }
    const icons = ['fish', 'tortoise', 'boar', 'lion', 'vamana', 'axe', 'bow', 'flute', 'buddha', 'horse'];
    icons.forEach((ic, i) => { const a = Math.PI * (1.04 + i / 9 * .92), x = vx + Math.cos(a) * 61 * MM, y = Y(104) + Math.sin(a) * 80 * MM; c.save(); c.globalAlpha = .6; c.translate(x, y); c.scale(.34, .34); glow(c, 0, 0, 120, '#FFF0C0', .7, 'source-over'); pdIcon(c, ic); c.restore(); });
    front(c, vx, Y(150) + 460, .9, pdVishnuStand, { bless: true, seat: false });
    // the left's dark water and shore, the gods looking on
    pdMilkOcean(c, -60, hz, XR(0), DH + 60, { stops: [[0, '#8C84A8'], [.5, '#6A6290'], [1, '#4A4470']], glowCol: '#E8D0B0', glow: .4, gx: XR(-10) });
    poFill(c, [[-60, Y(194)], [XL(50), Y(191)], [XL(100), Y(194)], [XR(0), Y(192)], [XR(0), DH + 60, 1], [-60, DH + 60, 1]], '#8A7A86', { sh: [0, 10, 12, 'rgba(40,30,50,.6)'], hi: [0, -3, 3, 'rgba(240,224,220,.6)'] });
    glow(c, XL(76), Y(186), 380, '#FFD890', .25, 'source-over');
    front(c, XL(24), Y(212), .26, pdShivaStand, { halo: .6 });
    front(c, XL(54), Y(213), .275, pdBrahma, { pose: 'pray', halo: .6 });
    front(c, XL(84), Y(212), .26, pdIndra, { halo: .6 });
    side(c, XL(112), Y(214), .23, pdBhumiCow, { mood: 'hope', glow: .8 });
    // the cloud bank Vishnu rises from; the meaning sits on it
    for (const [x, y, w, sd] of [[40, 214, 110, 4], [112, 216, 110, 7], [76, 188, 130, 9], [18, 200, 66, 12], [140, 196, 60, 15], [76, 208, 150, 17], [30, 228, 110, 19], [112, 230, 120, 21], [70, 236, 150, 23], [78, 222, 70, 25]]) pdCloud(c, XR(x), Y(y), w * MM, sd, 1, '#FAF0E8', 'rgba(170,130,150,.55)');
    c.restore();
  }
  SHOTS.push({ a: 4, b: 5, draw: spread(promise) });

  // ---------- slot 5: pp. 10–11, ten times he came ----------
  const TEN = ['fish', 'tortoise', 'boar', 'lion', 'vamana', 'axe', 'bow', 'flute', 'buddha', 'horse'];
  // the rows: [page, y of the row's middle] (book.js puts each line at the same y)
  const ROWS = [...[60, 95, 130, 165, 200].map(y => ['L', y]), ...[24, 57, 90, 123, 156].map(y => ['R', y])];
  function tenTimes(c) {
    c.save(); clipTo(c, 'S');
    const hz = Y(196);
    vsky(c, -60, -60, DW + 60, hz, [[0, '#12184A'], [.5, '#363276'], [.84, '#86689C'], [1, '#D6A68E']]);
    stars(c, -60, -60, DW + 60, hz, 240, 41);
    pdMilkOcean(c, -60, hz, DW + 60, DH + 60, { gx: XR(110) });
    // the ten, one under another down each page: a medallion and its line on a scroll
    ROWS.forEach(([pg, y], i) => {
      const L = pg === 'L', cy = Y(y);
      if (L) pdBanner(c, XL(87), cy, 108 * MM, 17 * MM, { roll: 60 }); else pdBanner(c, XR(65.4), cy, 108 * MM, 17 * MM, { roll: 60 });
      pdMedallion(c, L ? XL(22) : XR(130.4), cy, 8.6 * MM, TEN[i], { glow: .5 });
    });
    // the Silent Ocean again, small: Vishnu asleep on Shesha
    glow(c, XR(112), Y(196), 260, '#FFF0C8', .45, 'source-over');
    pdAnanta(c, XR(112), Y(202), .24, { glow: 1, brahma: 1.4 });
    c.restore();
  }
  SHOTS.push({ a: 5, b: 6, draw: spread(tenTimes) });
})();
