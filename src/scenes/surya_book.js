// surya_book.js: the art of Navagraha Book 1, Surya (books/surya/STORY.md). Each slot is one spread, drawn at t = slot +
// .5: slot 0 is the inside front cover | p1, slots 1–7 the story spreads (p2–3 … p14–15), slot 8 p16 | the inside back
// cover, slot 9 the outside cover (back | front). No text is painted here: tools/book.mjs sets the words over these
// pictures from books/surya/book.js, so they stay live in the PDF and the EPUB.
//
// Every spread is drawn in a design space of DW × DH (half the 300 dpi canvas) under camBegin(…, 2): 1 mm ≈ 5.9 units.
// The canvas includes 3 mm of bleed all round; the fold is at x = DW / 2. Keep faces 12 mm off the fold and everything
// that matters 6 mm inside the trim. Leave the text zones of book.js quiet: the story text at the top of each page
// (to about 48 mm), the "Did you know?" / "Can you find?" boxes at the bottom (from about 186 mm).
// Every spread hides small things to spot (book.js asks for them): keep each one big enough to find (≥ 8 mm).
(() => {
  const DW = W / 2, DH = H / 2, MM = DW / 286;
  const INK = '#3A1F22';
  const X = (mm, side = 'L') => (3 + (side === 'R' ? 140 : 0) + mm) * MM, Y = mm => (3 + mm) * MM;   // page mm → design units
  const spread = f => (t, lt) => { camBegin(DW / 2, DH / 2, W / DW); f(t, lt); camEnd(); };

  // ---------------- shared painted pieces ----------------
  // a sky in soft horizontal bands, top colour → bottom colour through the list
  function sky(cols, y0 = -40, y1 = DH + 40, key = 'sky', x0 = -40, x1 = DW + 40) {
    boilSeed(key);
    paint(rectPts(x0, y0, x1 - x0, y1 - y0), { wash: cols[0], ink: null });
    const n = cols.length;
    for (let i = 1; i < n; i++) {
      const y = lerp(y0, y1, i / n), h = (y1 - y0) / n * 1.6;
      paint(rectPts(x0 - 20, y - h * .3, x1 - x0 + 40, h, 6), { fill: cols[i], fillOp: 200, bleed: .25, tex: .35, border: .25, ink: null });
    }
  }
  // a soft cloud: overlapping lobes in one fill
  function cloud(x, y, w, h, col, op = 220, key = 'cl' + x + ',' + y) {
    boilSeed(key);
    const n = Math.max(3, Math.round(w / h * 1.6)), pts = [];
    for (let i = 0; i <= n; i++) { const k = i / n, a = Math.PI + k * Math.PI; pts.push([x + Math.cos(a) * w / 2, y + Math.sin(a) * h * (.7 + .5 * hash(i + x))]); }
    pts.push([x + w / 2, y + h * .25], [x - w / 2, y + h * .25]);
    paint(pts, { fill: col, fillOp: op, bleed: .12, tex: .3, border: .4, ink: null, curv: .6 });
  }
  // a puffy cartoon cloud with an ink outline, to sit on
  function seatCloud(x, y, s, col = '#F4EEF8', key = 'sc' + x) {
    boilSeed(key);
    const L = [[-4.4, .4, 1.7], [-2.4, -.5, 2.1], [0, -.9, 2.4], [2.5, -.4, 2.1], [4.5, .4, 1.6]];
    for (const [cx, cy, r] of L) paint(ellPts(x + cx * s, y + cy * s, r * s, r * .72 * s, 16, s * .05), { wash: col, ink: INK, sw: .55 });
    paint(ellPts(x, y + .3 * s, 4.9 * s, 1.2 * s, 20), { wash: col, ink: null });
  }
  function hut(x, y, s, wall = '#E8C9A0', roof = '#B5713E') {
    boilSeed('hut' + x);
    paint([[x - 2 * s, y], [x + 2 * s, y], [x + 2 * s, y - 2.4 * s], [x - 2 * s, y - 2.4 * s]], { wash: wall, ink: INK, sw: .7 });
    paint([[x - 2.6 * s, y - 2.2 * s], [x + 2.6 * s, y - 2.2 * s], [x + .3 * s, y - 4.6 * s], [x - .3 * s, y - 4.6 * s]], { wash: roof, fill: mixCol(roof, INK, .3), fillOp: 60, tex: .5, ink: INK, sw: .7 });
    paint([[x - .5 * s, y], [x + .5 * s, y], [x + .5 * s, y - 1.4 * s], [x - .5 * s, y - 1.4 * s]], { wash: '#6A3E2A', ink: null });
  }
  function tree(x, y, s, col = '#6E9F58', bare = false) {
    boilSeed('tree' + x + ',' + y);
    inkLine([[x, y], [x + s * .1, y - s * 2]], s * .14, '#6A4A30', 'ink', 0);
    if (bare) { for (const [a, l] of [[-.9, 1.1], [-.3, 1.3], [.5, 1.2], [1, .9]]) inkLine([[x + s * .05, y - s * 1.6], [x + Math.sin(a) * s * l, y - s * 1.6 - Math.cos(a) * s * l]], s * .07, '#4A3428', 'ink', .3); return; }
    paint(ellPts(x, y - s * 2.6, s * 1.2, s * 1, 14, s * .08), { wash: col, fill: mixCol(col, INK, .3), fillOp: 70, tex: .5, ink: INK, sw: .6 });
  }
  function stars(n, x0, x1, y0, y1, key = 'stars', col = '#FFF1C8') {
    boilSeed(key);
    for (let i = 0; i < n; i++) {
      const x = lerp(x0, x1, hash(i * 3.1 + 1)), y = lerp(y0, y1, hash(i * 5.7 + 2)), r = 2 + hash(i * 7.3) * 4;
      paint(starPts(x, y, r, .38, 4, hash(i) * .5), { wash: col, ink: null });
    }
  }
  function sparkle(x, y, r, col = '#FFE27A', key = 'sp' + x) {
    boilSeed(key);
    glow(x, y, r * 2.2, '#FFC766', .5);
    paint(starPts(x, y, r, .3, 4), { wash: col, ink: INK, sw: .5 });
  }
  // a clay lamp with its flame
  function diya(x, y, s, key = 'diya' + x) {
    boilSeed(key);
    glow(x, y - 2.2 * s, s * 7, '#FFB648', .9);
    paint([[x - 2 * s, y - 1 * s], [x + 2 * s, y - 1 * s], [x + 1.3 * s, y], [x - 1.3 * s, y]], { wash: '#C8743E', fill: '#9A5228', fillOp: 60, tex: .5, ink: INK, sw: .6, curv: .3 });
    paint([[x, y - 3.6 * s], [x + .7 * s, y - 1.9 * s], [x, y - 1.1 * s], [x - .7 * s, y - 1.9 * s]], { wash: '#FFD45A', ink: INK, sw: .4, curv: .6 });
    paint([[x, y - 2.8 * s], [x + .3 * s, y - 1.8 * s], [x, y - 1.4 * s], [x - .3 * s, y - 1.8 * s]], { wash: '#FFF6E0', ink: null, curv: .6 });
  }
  // a lotus on the water: a pad, and a flower open (1) or still a bud (0)
  function waterLotus(x, y, s, open = 1, key = 'wl' + x) {
    boilSeed(key);
    paint(ellPts(x - s * 1.2, y + s * .4, s * 2.2, s * .7, 16, s * .05), { wash: '#6E9F58', fill: '#4E7E40', fillOp: 70, tex: .5, ink: INK, sw: .5 });
    push(); translate(x, y); scale(s / 6); lotus(6, .7, open, INK); pop();
  }
  function bird(x, y, s, flap = 0, key = 'bd' + x) {
    boilSeed(key);
    const f = Math.sin(flap * TAU) * .6;
    inkLine([[x - 1.6 * s, y - (.6 + f) * s], [x - .7 * s, y - .1 * s], [x, y + .25 * s], [x + .7 * s, y - .1 * s], [x + 1.6 * s, y - (.6 + f) * s]], .9, INK, 'ink', .6);
  }
  // the rooster on a rooftop, crowing; s ≈ 1 is about 50 units tall
  function rooster(x, y, s = 1, key = 'rooster') {
    boilSeed(key);
    const P = pts => pts.map(([a, b]) => [x + a * s, y + b * s]);
    paint(P([[-24, -10], [-36, -38], [-26, -30], [-28, -46], [-18, -26], [-12, -8]]), { wash: '#2E7E78', fill: '#1E5E58', fillOp: 60, ink: INK, sw: .7, curv: .4 });   // tail
    paint(P([[-18, -6], [-12, -20], [4, -22], [14, -16], [14, -2], [2, 6], [-12, 4]]), { wash: '#FFF3E6', fill: '#E8D2BC', fillOp: 60, tex: .5, ink: INK, sw: .8, curv: .5 });   // body
    paint(P([[-8, -10], [2, -14], [8, -6], [-4, -2]]), { wash: '#C8743E', ink: INK, sw: .5, curv: .5 });   // wing
    paint(P([[6, -18], [10, -40], [22, -42], [26, -30], [20, -18]]), { wash: '#FFF3E6', ink: INK, sw: .8, curv: .4 });   // neck and head
    paint(P([[10, -42], [12, -52], [16, -46], [19, -54], [22, -45], [26, -48], [25, -38]]), { wash: '#D2402E', ink: INK, sw: .5, curv: .3 });   // comb
    paint(P([[25, -36], [36, -40], [26, -31]]), { wash: '#F2BE3E', ink: INK, sw: .6 });   // beak, open
    paint(P([[25, -33], [34, -30], [25, -29]]), { wash: '#F2BE3E', ink: INK, sw: .5 });
    paint(P([[22, -30], [25, -24], [20, -24]]), { wash: '#D2402E', ink: null });   // wattle
    paint(ellPts(x + 19 * s, y - 36 * s, 2 * s, 2 * s, 8), { wash: INK, ink: null });
    for (const k of [-4, 4]) inkLine(P([[k, 4], [k, 14], [k + 4, 14]]), .9, '#C8743E', 'ink', 0);
    for (const k of [0, 1, 2]) inkLine(P([[42 + k * 7, -46 - k * 6], [48 + k * 8, -52 - k * 7]]), 1, INK, 'ink', 0);   // the crow, as marks
  }
  // a villager standing in the river, offering water to the rising Sun (Surya arghya)
  function arghya(x, y, u, key = 'arghya') {
    const pal = { dhoti: '#FFF6EA', dhotiDk: '#E2CFA8', dhotiLt: '#FFFFFF', border: '#D2402E', shawl: '#F2BE3E', shawlDk: '#D18A1C' };
    narada(x, y, u, { pal, veena: false, noShadow: true, handL: [-1.4, -24], handR: [1.4, -24], bendL: .4, bendR: .4, eyes: 'closed', mouth: 'smile', boilKey: key, hx: .2 });
    const [hx, hy] = naradaHand(x, y, u, { handR: [1.4, -24] }, 1), [lx] = naradaHand(x, y, u, { handL: [-1.4, -24] }, -1);
    boilSeed(key + ' lota');
    const cx = (hx + lx) / 2, cy = hy - u * .8;
    paint(ellPts(cx, cy, u * 1.2, u * 1, 12), { wash: '#C8963E', fill: '#9A6A22', fillOp: 60, ink: INK, sw: .5 });
    inkLine([[cx + u, cy + u * .3], [cx + u * 1.6, cy + u * 3], [cx + u * 1.4, cy + u * 9]], u * .25, '#BFE0EE', 'ink', .6);   // the stream of water
    boilSeed(key + ' water');
    paint(ellPts(x, y - u * 2, u * 5, u * 1.1, 16), { wash: '#BFE0EE', fill: '#9CCBE0', fillOp: 60, tex: .4, ink: INK, sw: .5 });   // ripples round his shins
  }
  // the earth far below at sunrise: hills, a river, a village; lotus and arghya details
  function village(y0, key, o = {}) {
    boilSeed(key + 'hills');
    paint([[-40, y0 + 60], [200, y0], [460, y0 + 35], [760, y0 - 10], [1060, y0 + 25], [1360, y0 - 20], [1730, y0 + 20], [1730, DH + 50], [-40, DH + 50]], { fill: o.hill || '#B7A2C8', fillOp: 220, bleed: .1, tex: .4, ink: null, curv: .5 });
    paint([[-40, y0 + 100], [300, y0 + 75], [640, y0 + 95], [980, y0 + 65], [1300, y0 + 90], [1730, y0 + 70], [1730, DH + 50], [-40, DH + 50]], { wash: o.grass || '#9DBF7E', fill: '#7FA563', fillOp: 120, tex: .4, ink: INK, sw: .7, curv: .5 });
  }

  // ---------------- slot 0: inside front cover | p1 (title page) ----------------
  function titleSlot() {
    sky(['#FFF6E6', '#FFF1DC', '#FDEBD2'], -40, DH + 40, 'tsky');
    // ifc: "This book belongs to" inside a ring of sun rays
    boilSeed('ifc rays');
    push(); translate(X(70), Y(108)); glow(0, 0, 420, '#FFC766', .45); suryaRays(30, 1.4, 24, 1.15); pop();
    boilSeed('ifc disc'); paint(ellPts(X(70), Y(108), 6.4 * 30, 6.4 * 30, 40), { wash: '#FFF8EC', ink: INK, sw: 1 });
    for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + .2; boilSeed('ifl' + i); push(); translate(X(70) + Math.cos(a) * 330, Y(108) + Math.sin(a) * 330 + 30); lotus(28, 1.1, 1, INK); pop(); }
    // p1: Surya rising out of the clouds above the title
    glow(X(70, 'R'), 440, 560, '#FFC766', .7);
    surya(X(70, 'R'), 866, 20, { eyes: 'happy', mouth: 'grin', legs: false, noShadow: true, boilKey: 'tsurya' });
    for (const [dx, dy, r] of [[-170, 650, 80], [-80, 630, 95], [30, 640, 100], [140, 628, 90], [220, 655, 70], [-240, 670, 60]]) { boilSeed('tcl' + dx); paint(ellPts(X(70, 'R') + dx, dy, r, r * .62, 18, 2), { wash: '#FFF8EC', ink: INK, sw: .7 }); }
    boilSeed('tclb'); paint(ellPts(X(70, 'R'), 690, 300, 50, 22), { wash: '#FFF8EC', ink: null });
    for (const [x, y, s] of [[X(18, 'R'), Y(40), 9], [X(30, 'R'), Y(30), 7], [X(118, 'R'), Y(36), 8]]) bird(x, y, s, .3, 'tb' + x);
  }

  // ---------------- slot 1: p2–3, the world without light ----------------
  function darkSpread() {
    sky(['#141838', '#1B2048', '#232A5A', '#2C3466', '#343C70'], -40, DH + 40, 'dsky');
    stars(70, 0, DW, 0, 700, 'dstars', '#C9C4E8');
    // far right: the first gold light, low on the horizon (the Light has heard her)
    glow(X(130, 'R'), Y(150), 420, '#FFB648', .7);
    glow(X(130, 'R'), Y(150), 180, '#FFE09A', .6);
    // the asuras, gleeful, sitting on the devas' clouds
    seatCloud(X(40), Y(102), 40, '#C8C2E2', 'ac1');
    seatCloud(X(100), Y(88), 32, '#C8C2E2', 'ac2');
    asura(X(28), Y(100), 12.5, { kind: 'shumbha', eyes: 'happy', mouth: 'laugh', sword: false, shield: false, handL: [-4.5, -19], handR: [4.5, -19], boilKey: 'as1' });
    asura(X(56), Y(101), 11, { kind: 'chanda', eyes: 'happy', mouth: 'grin', sword: false, shield: false, boilKey: 'as2' });
    asura(X(100), Y(86), 11.5, { kind: 'nishumbha', eyes: 'happy', mouth: 'smirk', sword: false, shield: false, flip: true, handR: [4, -15], boilKey: 'as3' });
    // the devas, chased off, tumbling away down on a little cloud (bottom left)
    seatCloud(X(36), Y(172), 28, '#E8E4F6', 'dc');
    indra(X(26), Y(167), 17, { eyes: 'wide', mouth: 'O', sweat: 1, vajra: 0, boilKey: 'dev1' });
    indra(X(48), Y(168), 14, { eyes: 'sad', mouth: 'frown', vajra: 0, boilKey: 'dev2', tint: '#7FA8D8', tintK: .4 });
    // a deva peeking from behind a cloud (spot it)
    indra(X(122), Y(128), 12, { eyes: 'wide', mouth: 'flat', vajra: 0, lookX: -1, boilKey: 'peek' });
    seatCloud(X(122), Y(133), 26, '#C8C2E2', 'pc');
    // right page: the hill, Aditi praying, her lamp
    boilSeed('dhill');
    paint([[-40, Y(230)], [-40, Y(192)], [X(60), Y(186)], [X(150), Y(196)], [DW + 40, Y(200)], [DW + 40, Y(230)]], { wash: '#232848', fill: '#1A1E3C', fillOp: 90, tex: .5, ink: INK, sw: .8, curv: .5 });
    paint([[X(-10, 'R'), Y(230)], [X(-10, 'R'), Y(186)], [X(20, 'R'), Y(166)], [X(55, 'R'), Y(158)], [X(90, 'R'), Y(166)], [X(150, 'R'), Y(178)], [X(150, 'R'), Y(230)]], { wash: '#2A3058', fill: '#1E2346', fillOp: 90, tex: .5, ink: INK, sw: .8, curv: .5 });
    diya(X(72, 'R'), Y(161), 10, 'adiya');
    parvati(X(48, 'R'), Y(162), 19, { pal: { saree: '#E8862E', sareeDk: '#B85E18', sareeLt: '#FFB060', blouse: '#C8324A', blouseDk: '#962338' }, pray: 1, eyes: 'closed', boilKey: 'aditi', hx: .1 });
    // the owl who loves the dark, in a bare tree on the far right (spot it)
    boilSeed('otree'); { const tx = X(118, 'R'), ty = Y(178);
      paint([[tx - 14, ty], [tx + 14, ty], [tx + 9, ty - 260], [tx - 9, ty - 260]], { wash: '#3A2E3A', ink: INK, sw: .8 });
      for (const [a, l, y] of [[-1, 120, 230], [-.5, 100, 180], [.7, 130, 210], [1.1, 90, 150]]) inkLine([[tx, ty - y], [tx + Math.sin(a) * l, ty - y - Math.cos(a) * l * .6]], 7, '#3A2E3A', 'ink', .3);
      inkLine([[tx - 70, ty - 168], [tx + 80, ty - 172]], 8, '#3A2E3A', 'ink', .2); }
    boilSeed('owl');
    { const ox = X(112, 'R'), oy = Y(178) - 172 - 30; push(); translate(ox, oy); scale(2.2); translate(-ox, -oy);
      paint(ellPts(ox, oy, 16, 20, 16), { wash: '#8A6A4E', fill: '#6A4E36', fillOp: 60, tex: .5, ink: INK, sw: .7 });
      paint(ellPts(ox, oy + 6, 10, 11, 12), { wash: '#C8A884', ink: null });
      for (const s of [-1, 1]) { paint(ellPts(ox + s * 6, oy - 7, 6, 6, 12), { wash: '#FFE27A', ink: INK, sw: .5 }); paint(ellPts(ox + s * 6, oy - 7, 2.6, 2.6, 8), { wash: INK, ink: null }); paint([[ox + s * 4, oy - 18], [ox + s * 12, oy - 26], [ox + s * 12, oy - 16]], { wash: '#8A6A4E', ink: INK, sw: .5 }); }
      paint([[ox - 2, oy - 2], [ox + 2, oy - 2], [ox, oy + 3]], { wash: '#F2BE3E', ink: null }); pop(); }
  }

  // ---------------- slot 2: p4–5, the egg they thought was lost ----------------
  function eggSpread() {
    sky(['#3A2E66', '#4C3A74', '#6A4A80', '#8E5A86', '#B06E86'], -40, DH + 40, 'esky');
    stars(30, 0, X(130), 0, 500, 'estars', '#E8DCF6');
    // left page: a hermitage floor, Kashyapa worried, Aditi calm with the glowing egg
    boilSeed('efloor');
    paint([[-40, Y(176)], [X(70), Y(172)], [X(150), Y(178)], [X(60, 'R'), Y(186)], [DW + 40, Y(184)], [DW + 40, DH + 40], [-40, DH + 40]], { wash: '#6A5A7A', fill: '#4E4060', fillOp: 70, tex: .5, ink: INK, sw: .8, curv: .4 });
    for (const [x, s] of [[X(10), 40], [X(124), 36]]) tree(x, Y(178), s, '#4E6E5A');
    narada(X(36), Y(180), 17, { pal: NRD_SAGE, beard: '#EDE6DC', veena: false, eyes: 'wide', mouth: 'open', brow: 1, handL: [-5, -22], handR: [5, -22], bendL: -.6, bendR: -.6, sweat: 1, boilKey: 'kashyapa', hx: .3, lookX: .8 });
    const AO = { handL: [-1.5, -14.4], handR: [1.5, -14.4] }, [ex, ey0] = parvatiHand(X(94), Y(180), 19, AO, 1), ey = ey0 - 30, ex2 = ex - 1.5 * 19 * 1.0;
    glow(ex2, ey, 360, '#FFB648', .9);
    parvati(X(94), Y(180), 19, { pal: { saree: '#E8862E', sareeDk: '#B85E18', sareeLt: '#FFB060', blouse: '#C8324A', blouseDk: '#962338' }, eyes: 'closed', ...AO, boilKey: 'aditi2', hx: -.2 });
    boilSeed('egg');
    paint(ellPts(ex2, ey, 30, 38, 20), { wash: '#FFD45A', fill: '#F2A830', fillOp: 70, tex: .4, ink: INK, sw: .9 });
    paint(ellPts(ex2 - 9, ey - 12, 8, 11, 10), { wash: '#FFF2B0', ink: null });
    // re-draw her hands over the egg
    boilSeed('ehands'); for (const s of [-1, 1]) { const [hx, hy] = parvatiHand(X(94), Y(180), 19, AO, s); paint(ellPts(hx, hy, 11.4, 10.4, 14), { wash: PRV.skin, ink: INK, sw: .7 }); }
    // right page: WHOOSH! the egg bursts; baby Martanda in the light; the asuras run off the page
    const bx = X(55, 'R'), by = Y(118);
    boilSeed('burst');
    for (let i = 0; i < 18; i++) { const a = i / 18 * TAU, r0 = 120, r1 = 900; paint([[bx + Math.cos(a - .05) * r0, by + Math.sin(a - .05) * r0], [bx + Math.cos(a) * r1, by + Math.sin(a) * r1], [bx + Math.cos(a + .09) * r1, by + Math.sin(a + .09) * r1], [bx + Math.cos(a + .05) * r0, by + Math.sin(a + .05) * r0]], { fill: i % 2 ? '#FFD45A' : '#FFB648', fillOp: 150, bleed: .1, tex: .3, ink: null }); }
    glow(bx, by, 560, '#FFC766', 1); glow(bx, by, 260, '#FFF0C0', .9);
    surya(bx, by + 21 * 12, 12, { eyes: 'happy', mouth: 'grin', crown: 'band', legs: false, noShadow: true, handL: [-5, -21], handR: [5, -21], lotus: false, boilKey: 'baby' });
    // the broken eggshell, five pieces flying (count them)
    [[-150, 120, .4], [150, 140, -.6], [-120, -150, 2.2], [170, -90, -2.4], [20, 210, 3.1]].forEach(([dx, dy, a], i) => {
      boilSeed('shell' + i); push(); translate(bx + dx * 1.3, by + dy * 1.2); rotate(a); scale(1.9);
      paint([[-22, 0], [-16, -14], [0, -20], [14, -14], [22, 0], [12, -4], [4, 4], [-6, -4]], { wash: '#FFD45A', fill: '#E8962A', fillOp: 60, ink: INK, sw: .7 });
      pop(); });
    boilSeed('speed'); for (let i = 0; i < 5; i++) inkLine([[X(78, 'R'), Y(150 + i * 9)], [X(90, 'R'), Y(150 + i * 9)]], 1.1, '#FFF6EA', 'ink', 0);
    // the asuras running off the right edge, eyes screwed shut against the light
    asura(X(124, 'R'), Y(190), 10.5, { kind: 'chanda', eyes: 'scared', mouth: 'wobble', walk: .3, sword: false, shield: false, flip: false, handL: [-4, -20], handR: [4, -20], boilKey: 'run1', sweat: 1 });
    asura(X(100, 'R'), Y(194), 9.5, { kind: 'munda', eyes: 'swirl', mouth: 'O', walk: .7, sword: false, shield: false, handL: [-3.5, -19], handR: [3.5, -19], boilKey: 'run2' });
  }

  // ---------------- slot 3: p6–7, the chariot of the Sun ----------------
  function chariotSpread() {
    sky(['#EBC6DA', '#F2C9C4', '#F7D2B2', '#FAD9A2', '#FBE3AE']);
    glow(520, 560, 900, '#FFB648', .55);
    cloud(260, 150, 520, 120, '#FFF3E6', 230, 'tz1');
    cloud(1240, 150, 560, 120, '#FFF3E6', 230, 'tz2');
    cloud(1500, 420, 300, 70, '#F9DCCB', 200, 'c3');
    cloud(120, 640, 260, 60, '#F9DCCB', 200, 'c4');
    // a flock of birds waking up
    [[1080, 420, 10], [1120, 450, 8], [1150, 410, 9], [1190, 440, 7], [1040, 455, 7]].forEach(([x, y, s], i) => bird(x, y, s, i * .2, 'fb' + i));
    // the earth far below, waking
    village(1150, 'v');
    boilSeed('river');
    paint([[520, 1380], [600, 1290], [760, 1252], [960, 1240], [920, 1268], [770, 1300], [680, 1380]], { wash: '#BFE0EE', ink: INK, sw: .6, curv: .5 });
    for (const [x, s] of [[1060, 14], [1140, 12], [1230, 15], [1420, 13]]) hut(x, 1262, s);
    for (const [x, s] of [[1000, 26], [1320, 30], [1530, 24], [250, 28], [420, 22]]) tree(x, 1258, s);
    rooster(1232, 1193, 1.25);
    // lotuses opening for the Sun on the river (spot them), and someone saying hello to him
    waterLotus(630, 1318, 9, 1, 'wl1'); waterLotus(735, 1294, 7.5, .7, 'wl2'); waterLotus(880, 1262, 6, .3, 'wl3');
    arghya(812, 1296, 5.2);
    cloud(820, 1110, 1400, 120, '#FFF0E2', 240, 'road');
    cloud(560, 1135, 700, 80, '#F8D9C8', 200, 'road2');

    // the seven horses, back row first
    const HX = [[1100, 770, 16, '#7B5CA8'], [1300, 745, 16, '#3A6FB0'], [1470, 790, 15.5, '#3A9C98'],
      [1180, 885, 18, '#6E9F58'], [1410, 900, 18, '#E8AA38'], [1050, 1010, 20, '#F07A22'], [1320, 1030, 20, '#E84A6A']];
    const bits = [];
    HX.forEach(([x, y, u, mane], i) => {
      const o = { gallop: .15 + i * .23, mane, rot: -.06, boilKey: 'horse' + i, coat: i < 3 ? '#F6EADF' : '#FFF6EA', eyes: i === 6 ? 'happy' : 'normal' };
      suryaHorse(x, y, u, o);
      bits.push(suryaHorseBit(x, y, u, o));
    });
    const cx = 430, cy = 1180, cu = 28, ou = { boilKey: 'chariot' }, su = 28;
    suryaChariot(cx, cy, cu, { ...ou, part: 'back' });
    surya(cx - 30, 880 + 12 * su, su, { eyes: 'happy', mouth: 'grin', hx: .35, lookX: .5, noShadow: true, legs: false, boilKey: 'surya', handR: [6.2, -20.6], bendR: .6, handL: [-5.2, -15.4] });
    const au = 19, ax = cx + 6.2 * cu, ay = 885 + 12 * au;
    surya(ax, ay, au, { pal: ARUNA_PAL, crown: 'band', halo: 0, haloGlow: 0, reins: 1, legs: false, noShadow: true, eyes: 'normal', lookX: .8, mouth: 'smile', boilKey: 'aruna', kavacha: false });
    suryaChariot(cx, cy, cu, { ...ou, part: 'front', pole: [1140, 950], spin: .3 });
    const [h1x, h1y] = suryaHand(ax, ay, au, { reins: 1 }, 1), [h2x, h2y] = suryaHand(ax, ay, au, { reins: 1 }, -1);
    bits.forEach(([bx, by], i) => { boilSeed('rein' + i); const [hx, hy] = i % 2 ? [h1x, h1y] : [h2x, h2y]; inkLine([[hx, hy], [lerp(hx, bx, .5), lerp(hy, by, .5) + 30], [bx, by]], .9, '#8E3A36', 'inkfine', .5); });
    boilSeed('fist'); paint(ellPts(h1x, h1y, .72 * au, .66 * au, 14), { wash: ARUNA_PAL.skin, ink: INK, sw: .75 });
  }

  // ---------------- slot 4: p8–9, a little less shine ----------------
  function shineSpread() {
    sky(['#FBE7B8', '#FBDDA0', '#F8D08E', '#F4C27E'], -40, DH + 40, 'ssky');
    // Vishwakarma's workshop: a stone floor, an awning, tools on the wall
    boilSeed('sfloor');
    paint([[-40, Y(176)], [DW + 40, Y(172)], [DW + 40, DH + 40], [-40, DH + 40]], { wash: '#D8B48A', fill: '#B8906A', fillOp: 70, tex: .6, ink: INK, sw: .8, curv: .2 });
    for (let i = 0; i < 9; i++) inkLine([[i * 200 - 60, Y(178)], [i * 200 - 160, DH + 40]], .6, '#A8805A', 'inkfine', 0);
    for (const x of [X(4), X(136, 'R')]) { boilSeed('pillar' + x); paint([[x - 34, Y(176)], [x + 34, Y(176)], [x + 26, -40], [x - 26, -40]], { wash: '#E8C9A0', fill: '#C8A47A', fillOp: 70, tex: .6, ink: INK, sw: .9 }); paint([[x - 46, Y(176)], [x + 46, Y(176)], [x + 46, Y(168)], [x - 46, Y(168)]], { wash: '#C8A47A', ink: INK, sw: .8 }); }
    // left: Sanjna, shading her eyes from the glare
    parvati(X(24), Y(184), 20, { pal: { saree: '#3A9C98', sareeDk: '#2A7470', sareeLt: '#6AC4BE', blouse: '#F2BE3E', blouseDk: '#B97F1C' }, eyes: ['closed', 'closed'], mouth: 'O', handR: [1.6, -21.4], bendR: -1, hx: .3, boilKey: 'sanjna', lean: -.6 });
    // centre: Surya on Vishwakarma's turning lathe, letting him trim a little of his shine
    const sx = X(84), sy = Y(170);
    boilSeed('lathe');
    paint(ellPts(sx, sy + 8, 150, 34, 30), { wash: '#B97F1C', fill: '#8A5A12', fillOp: 70, tex: .5, ink: INK, sw: .9 });
    paint(ellPts(sx, sy, 140, 28, 30), { wash: '#F2BE3E', fill: '#D49A2A', fillOp: 60, tex: .5, ink: INK, sw: .9 });
    for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI + .3; inkLine([[sx + Math.cos(a) * 60, sy + Math.sin(a) * 12], [sx + Math.cos(a) * 125, sy + Math.sin(a) * 25]], .7, '#B97F1C', 'inkfine', 0); }
    for (const s of [-1, 1]) inkLine([[sx + s * 90, sy - 20], [sx + s * 120, sy - 40], [sx + s * 150, sy - 20]], 1.2, '#FFF6EA', 'ink', .6);   // it's turning
    glow(sx, sy - 330, 700, '#FFC766', .85);
    surya(sx, sy, 20, { eyes: 'happy', mouth: 'smile', hx: .3, boilKey: 'ssurya', haloGlow: 1, noShadow: true });
    // right: Vishwakarma at work, a chisel to the glow; the shavings fly up and become the chakra and the trishul
    narada(X(124), Y(184), 18, { pal: { ...NRD_SAGE, dhoti: '#7A8A9E', dhotiDk: '#5A6A7E', dhotiLt: '#A8B8CA', border: '#B97F1C', shawl: '#E8D2AE', hair: '#9A9AA4', hairLt: '#C8C8D0' }, beard: '#B0B0BA', veena: false, flip: true, handR: [5.5, -21], handL: [3.4, -15], eyes: 'happy', mouth: 'smile', boilKey: 'vkarma',
      armR: (u, sw) => { paint(U([[-.25, -.4], [.25, -.4], [.3, -3.6], [-.3, -3.6]], u), { wash: '#C8C8D0', ink: INK, sw: sw * .5 }); paint(U([[-.45, .4], [.45, .4], [.45, -.6], [-.45, -.6]], u), { wash: '#8A5A2E', ink: INK, sw: sw * .5 }); } });
    // the sparkly shavings, in a stream from Surya's halo to the weapons (count them)
    const S = [[X(104), Y(62)], [X(120), Y(54)], [X(136), Y(52)], [X(10, 'R'), Y(54)], [X(24, 'R'), Y(60)], [X(38, 'R'), Y(68)], [X(50, 'R'), Y(78)]];
    S.forEach(([x, y], i) => sparkle(x, y, 26 - i, '#FFE27A', 'shv' + i));
    boilSeed('wchakra'); push(); translate(X(70, 'R'), Y(104)); glow(0, 0, 260, '#FFC766', .9); chakra(40, 2, .4); pop();
    boilSeed('wtrishul'); push(); translate(X(108, 'R'), Y(132)); glow(0, -120, 260, '#FFC766', .9); trishul(34, 2, .2, INK); pop();
    // Vishwakarma's tools on the floor (spot the hammer)
    boilSeed('tools');
    { const hx = X(104, 'R'), hy = Y(176); push(); translate(hx, hy); scale(2.2); translate(-hx, -hy);
      paint([[hx - 40, hy - 3], [hx + 20, hy - 3], [hx + 20, hy + 3], [hx - 40, hy + 3]], { wash: '#8A5A2E', ink: INK, sw: .7 });
      paint([[hx + 14, hy - 14], [hx + 34, hy - 14], [hx + 34, hy + 14], [hx + 14, hy + 14]], { wash: '#8A8A96', fill: '#6A6A76', fillOp: 60, ink: INK, sw: .8 });
      paint([[hx - 120, hy + 6], [hx - 70, hy - 30], [hx - 64, hy - 24], [hx - 112, hy + 12]], { wash: '#C8C8D0', ink: INK, sw: .6 }); pop(); }
  }

  // ---------------- slot 5: p10–11, the fruit in the sky ----------------
  function fruitSpread() {
    sky(['#F7C6A0', '#F8D2A8', '#FBE0B8', '#CFE6EE', '#B8DDEA'], -40, DH + 40, 'fsky');
    cloud(X(60), Y(26), 700, 120, '#FFF6EA', 220, 'ftz1'); cloud(X(70, 'R'), Y(26), 760, 120, '#FFF6EA', 220, 'ftz2');
    // the red rising Sun (Surya himself, smiling: he won't burn a child)
    const rx = X(108), ry = Y(78);
    glow(rx, ry, 420, '#FF8A3A', .8);
    boilSeed('rsun'); push(); translate(rx, ry); suryaRays(22, 1.2, 16, 1, INK, { ...SUR, ray: '#F06A2A', rayDk: '#D2402E', rayLt: '#FF9A50' }); pop();
    boilSeed('rface'); for (const s of [-1, 1]) inkLine([[rx + s * 30 - 14, ry - 10], [rx + s * 30, ry - 20], [rx + s * 30 + 14, ry - 10]], 1.8, INK, 'ink', .5);
    inkLine([[rx - 30, ry + 22], [rx, ry + 40], [rx + 30, ry + 22]], 1.8, INK, 'ink', .6);
    // a forest below, and the tree he leapt from
    boilSeed('forest');
    paint([[-40, Y(170)], [X(40), Y(160)], [X(100), Y(168)], [X(60, 'R'), Y(162)], [DW + 40, Y(168)], [DW + 40, DH + 40], [-40, DH + 40]], { wash: '#6E9F58', fill: '#4E7E40', fillOp: 80, tex: .5, ink: INK, sw: .8, curv: .5 });
    for (let i = 0; i < 9; i++) tree(X(4 + i * 15), Y(176 + (i % 2) * 6), 34 + (i % 3) * 6, i % 2 ? '#5E8E4A' : '#7AAE60');
    tree(X(16), Y(160), 70, '#7AAE60');
    // Bal Hanuman in mid-leap, mouth wide for the "fruit"
    balHanuman(X(64), Y(108), 18, { pose: 'fly', rot: .85, eyes: 'sparkle', mouth: 'aam', mouthK: .8, tail: 'stream', handL: [-3, -14], handR: [3.4, -14.5], kick: .2, boilKey: 'bh1' });
    // right page: Indra on Airavata, the vajra flying back to him; Hanuman tumbling down, dizzy, his chin swollen
    seatCloud(X(96, 'R'), Y(186), 40, '#F4EEF8', 'aircloud');
    airavata(X(96, 'R'), Y(182), 16, { trunk: 'up', ear: .3, eyes: 'wide', indra: { eyes: 'angry', mouth: 'shout', handR: [3, -7], vajra: 0, brows: -1 }, boilKey: 'airavata' });
    boilSeed('vajra'); push(); translate(X(72, 'R'), Y(92)); rotate(-.6); indraVajra(26, 1.6); pop();
    for (let i = 0; i < 4; i++) inkLine([[X(78 + i * 2, 'R'), Y(98 + i * 3)], [X(92 + i * 2, 'R'), Y(112 + i * 3)]], .9, '#FFF6EA', 'ink', 0);
    balHanuman(X(38, 'R'), Y(122), 16, { pose: 'fly', rot: 2.4, eyes: 'swirl', mouth: 'wail', jaw: 1, tail: 'stream', handL: [-4, -16], handR: [4, -16], boilKey: 'bh2', emote: 'stars', emoteK: 1 });
    // Surya leans out of the sky with his gift: a glowing ball of his own shine
    surya(X(112, 'R'), Y(94), 12, { eyes: 'happy', mouth: 'smile', legs: false, noShadow: true, hx: -.4, handL: [-6, -15], boilKey: 'fsurya', lotus: false });
    cloud(X(112, 'R'), Y(90), 320, 50, '#FFF6EA', 255, 'fsc');
    sparkle(X(92, 'R'), Y(78), 30, '#FFE27A', 'gift');
  }

  // ---------------- slot 6: p12–13, learning on the move ----------------
  function learnSpread() {
    sky(['#9ED0EE', '#B4DCF0', '#CBE6F2', '#E2EFEE', '#F6EED8'], -40, DH + 40, 'lsky');
    cloud(X(60), Y(26), 700, 120, '#FFFFFF', 200, 'ltz1'); cloud(X(70, 'R'), Y(26), 760, 120, '#FFFFFF', 200, 'ltz2');
    // the eastern hills (left) and the western hills (right), and the Sun's path between them, dotted
    boilSeed('lhills');
    paint([[-40, Y(200)], [-40, Y(150)], [X(20), Y(132)], [X(52), Y(150)], [X(80), Y(170)], [X(140), Y(182)], [X(10, 'R'), Y(182)], [X(70, 'R'), Y(170)], [X(100, 'R'), Y(150)], [X(126, 'R'), Y(130)], [DW + 40, Y(150)], [DW + 40, Y(200)]], { wash: '#9DBF7E', fill: '#7FA563', fillOp: 90, tex: .5, ink: INK, sw: .8, curv: .5 });
    paint([[-40, DH + 40], [-40, Y(186)], [X(70), Y(194)], [X(140), Y(190)], [X(70, 'R'), Y(196)], [DW + 40, Y(186)], [DW + 40, DH + 40]], { wash: '#7FA563', ink: INK, sw: .7, curv: .5 });
    boilSeed('lpath');
    for (let i = 0; i <= 26; i++) { const k = i / 26, x = lerp(X(16), X(126, 'R'), k), y = Y(132) - Math.sin(k * Math.PI) * 360; paint(ellPts(x, y, 3.4, 3.4, 8), { wash: '#F2BE3E', ink: null }); }
    // a little rising sun on the eastern hill, a setting one on the western hill
    for (const [x, y, c] of [[X(20), Y(128), '#FFB648'], [X(126, 'R'), Y(126), '#F06A2A']]) { boilSeed('ls' + x); paint(ellPts(x, y, 26, 26, 20), { wash: c, ink: INK, sw: .7 }); glow(x, y, 80, c, .6); }
    // Surya riding his chariot along the path, left to right; Hanuman flying ahead of him, facing him, a palm-leaf book in hand
    const cx = X(66), cy = Y(138), cu = 19;
    suryaChariot(cx, cy, cu, { part: 'back', boilKey: 'lch' });
    surya(cx - 20, cy - 10.4 * cu + 12 * 19 + 4, 19, { eyes: 'normal', mouth: 'open', hx: .5, lookX: 1, noShadow: true, legs: false, boilKey: 'lsurya', handR: [6.4, -18], bendR: .4 });
    suryaChariot(cx, cy, cu, { part: 'front', boilKey: 'lch', spin: 1.1 });
    cloud(cx, cy + 20, 420, 50, '#FFFFFF', 220, 'lcl');
    const hx = X(8, 'R'), hy = Y(108);
    balHanuman(hx, hy, 21, { pose: 'fly', rot: -.25, flip: true, eyes: 'normal', lookX: -1, mouth: 'smile', tail: 'stream', handL: [-4.2, -9.4], handR: [3, -8], boilKey: 'lbh',
      held: (u, sw) => { push(); translate(-4.4 * u, -9.2 * u); rotate(-.3); for (let i = 0; i < 4; i++) paint(U([[-2.2, -.4 + i * .32], [2.2, -.4 + i * .32], [2.2, -.12 + i * .32], [-2.2, -.12 + i * .32]], u), { wash: i % 2 ? '#E8C890' : '#F2D8A8', ink: INK, sw: sw * .35 }); inkLine(U([[-1.2, -.6], [-1.2, 1.1]], u), sw * .5, '#8E3A36', 'inkfine', 0); pop(); } });
    // the parrot in a tree on the western hill, learning too (spot it)
    tree(X(96, 'R'), Y(160), 44, '#6E9F58');
    kamaParrot(X(100, 'R'), Y(122), 9, { flip: true, look: -1, eyes: 'normal', boilKey: 'lparrot' });
    tree(X(32), Y(150), 36, '#6E9F58');
    // flowers in the foreground meadow
    for (let i = 0; i < 14; i++) { const x = X(8 + i * 19.5), y = Y(204 + (i % 3) * 4); boilSeed('fl' + i); inkLine([[x, y], [x, y - 22]], 1.2, '#4E7E40', 'ink', 0); paint(starPts(x, y - 26, 11, .5, 5, i), { wash: ['#F2BE3E', '#E84A6A', '#FFF6EA', '#7B5CA8'][i % 4], ink: INK, sw: .5 }); paint(ellPts(x, y - 26, 3.5, 3.5, 8), { wash: '#F07A22', ink: null }); }
  }

  // ---------------- slot 7: p14–15, turn to the light ----------------
  function lightSpread() {
    sky(['#C8B8E0', '#E2C2D6', '#F4CDB8', '#FBDDA8', '#FDE9B8'], -40, DH + 40, 'rsky');
    cloud(X(60), Y(26), 700, 120, '#FFF6EA', 210, 'rtz1'); cloud(X(70, 'R'), Y(26), 760, 120, '#FFF6EA', 210, 'rtz2');
    // the Sun rising on the right page; Ravana tiny on the far hill (count his heads)
    const sx = X(84, 'R'), sy = Y(104);
    glow(sx, sy, 640, '#FFB648', .9); glow(sx, sy, 260, '#FFE6A0', .8);
    boilSeed('lsun'); push(); translate(sx, sy); suryaRays(20, 1.1, 16, 1); pop();
    boilSeed('lsunf'); for (const s of [-1, 1]) inkLine([[sx + s * 26 - 12, sy - 6], [sx + s * 26, sy - 14], [sx + s * 26 + 12, sy - 6]], 1.6, INK, 'ink', .5);
    inkLine([[sx - 24, sy + 18], [sx, sy + 32], [sx + 24, sy + 18]], 1.6, INK, 'ink', .6);
    boilSeed('lfar');
    paint([[X(20, 'R'), Y(172)], [X(60, 'R'), Y(150)], [X(100, 'R'), Y(146)], [DW + 40, Y(156)], [DW + 40, Y(200)], [X(20, 'R'), Y(200)]], { fill: '#A890B8', fillOp: 200, bleed: .1, tex: .4, ink: null, curv: .5 });
    ravana(X(116, 'R'), Y(152), 5.5, { boilKey: 'farRavana' });
    // the camp: the ground, a few tents and flags
    boilSeed('lground');
    paint([[-40, Y(168)], [X(80), Y(160)], [X(150), Y(166)], [X(60, 'R'), Y(174)], [DW + 40, Y(170)], [DW + 40, DH + 40], [-40, DH + 40]], { wash: '#C8B488', fill: '#A8946A', fillOp: 70, tex: .5, ink: INK, sw: .8, curv: .5 });
    for (const [x, c] of [[X(10), '#E84A6A'], [X(124), '#F2BE3E'], [X(30, 'R'), '#3A9C98']]) { boilSeed('tent' + x); paint([[x - 40, Y(168)], [x, Y(150)], [x + 40, Y(168)]], { wash: '#F4E8D0', ink: INK, sw: .7 }); inkLine([[x, Y(150)], [x, Y(138)]], .8, INK, 'ink', 0); paint([[x, Y(138)], [x + 16, Y(141)], [x, Y(144)]], { wash: c, ink: null }); }
    // Agastya behind Rama, pointing him to the rising Sun; Rama's bow against a rock
    boilSeed('rock');
    paint([[X(84) - 90, Y(192)], [X(84) - 70, Y(170)], [X(84) - 10, Y(164)], [X(84) + 70, Y(170)], [X(84) + 90, Y(192)]], { wash: '#9A8A80', fill: '#7A6A62', fillOp: 70, tex: .6, ink: INK, sw: .9, curv: .4 });
    boilSeed('bow'); push(); translate(X(84) + 40, Y(160)); dhanush(26, 1.6, .25); pop();
    glow(X(60), Y(120), 380, '#FFC766', .75);
    // Rama standing, tired, then praying to the Sun: Narada's rig in Rama's colours, a kirita over the topknot
    const RAMA = { skin: '#5A7AC8', skinDk: '#3E5AA0', skinLt: '#8AA4E0', dhoti: '#F2C23E', dhotiDk: '#C8962A', dhotiLt: '#FFE08A', border: '#C8324A', shawl: '#F07A22', shawlDk: '#C85A18', hair: '#1F1A2E', hairLt: '#3A3450' };
    const kirita = (u, sw) => { paint(U([[-2.4, -23.2], [2.4, -23.2], [2.2, -24.8], [1.6, -26.4], [.8, -27.8], [0, -28.8], [-.8, -27.8], [-1.6, -26.4], [-2.2, -24.8]], u), { wash: '#F2BE3E', fill: '#B97F1C', fillOp: 50, tex: .5, ink: INK, sw: sw * .8, curv: .15 });
      paint(ribbon(U([[-2.5, -23.4], [0, -23.8], [2.5, -23.4]], u), .6 * u, .6 * u), { wash: '#FFE6A0', ink: INK, sw: sw * .5 });
      paint(U([[0, -24.4], [.5, -25.2], [0, -26.1], [-.5, -25.2]], u), { wash: '#D42A3A', ink: INK, sw: sw * .5 }); };
    narada(X(60), Y(190), 19, { pal: RAMA, veena: false, pray: 1, eyes: 'closed', mouth: 'smile', hx: .25, hat: kirita, boilKey: 'rama' });
    narada(X(26), Y(192), 16, { pal: NRD_SAGE, beard: '#EDE6DC', veena: false, handR: [6.5, -22], bendR: -.4, eyes: 'happy', mouth: 'smile', hx: .4, boilKey: 'agastya' });
    // a little vanara peeking from behind the rock (spot him)
    balHanuman(X(116), Y(178), 10, { pose: 'stand', eyes: 'normal', lookX: -1, mouth: 'smile', handL: [-3, -10], boilKey: 'peekh' });
    boilSeed('rock2'); paint([[X(116) - 80, Y(198)], [X(116) - 64, Y(170)], [X(116) + 10, Y(164)], [X(116) + 70, Y(198)]], { wash: '#9A8A80', fill: '#7A6A62', fillOp: 70, tex: .6, ink: INK, sw: .9, curv: .4 });
  }

  // ---------------- slot 8: p16 (Meet Surya) | inside back cover (the series) ----------------
  function meetSlot() {
    sky(['#FFF4E0', '#FDEED6', '#FBE6C8'], -40, DH + 40, 'msky', -40, X(140) + 4);
    sky(['#EEF2F8', '#E8EEF6', '#E2E8F2'], -40, DH + 40, 'isky', X(140), DW + 40);
    // p16: Surya, with his chariot wheel and a lotus pond
    glow(X(98), Y(150), 380, '#FFC766', .6);
    surya(X(100), Y(204), 13, { eyes: 'happy', mouth: 'smile', boilKey: 'msurya' });
    boilSeed('mpond'); paint(ellPts(X(36), Y(200), 200, 42, 24), { wash: '#BFE0EE', fill: '#9CCBE0', fillOp: 60, tex: .4, ink: INK, sw: .7 });
    waterLotus(X(22), Y(196), 9, 1, 'ml1'); waterLotus(X(50), Y(201), 7, .6, 'ml2');
    // ibc: the nine grahas as little planets beside their names (the list is set in book.js from y 36 mm, 8.1 mm a line)
    const G = [['sun'], ['moon'], ['mars'], ['merc'], ['jup'], ['ven'], ['sat'], ['rahu']];
    G.forEach(([k], i) => {
      const x = X(38, 'R'), y = Y(39.2 + i * 8.12);
      boilSeed('g' + k);
      if (k === 'sun') { glow(x, y, 40, '#FFC766', .6); push(); translate(x, y); suryaRays(2.6, .7, 12, 1); pop(); }
      else if (k === 'moon') { paint(ellPts(x, y, 15, 15, 20), { wash: '#F4F0E0', ink: INK, sw: .6 }); paint(ellPts(x + 7, y - 3, 12, 12, 18), { wash: '#E8EEF6', ink: null }); }
      else if (k === 'sat') { paint(ellPts(x, y, 13, 13, 18), { wash: '#4E5A96', ink: INK, sw: .6 }); inkLine([[x - 24, y + 4], [x, y - 3], [x + 24, y - 8]], 1.3, '#B98CFF', 'ink', .4); }
      else if (k === 'rahu') { paint(ellPts(x - 8, y, 11, 11, 16), { wash: '#4A4458', ink: INK, sw: .6 }); paint(ellPts(x + 14, y, 9, 9, 14), { wash: '#8A6A9E', ink: INK, sw: .6 }); }
      else paint(ellPts(x, y, 14, 14, 18), { wash: { mars: '#D2402E', merc: '#5AAE6A', jup: '#F2C45A', ven: '#FFF6EA' }[k], ink: INK, sw: .6 });
    });
  }

  // ---------------- slot 9: the outside cover, back | front ----------------
  function coverSlot() {
    sky(['#F2C8D8', '#F7D2C0', '#FAD9A8', '#FBE3B0', '#FCEBC0']);
    glow(X(70, 'R'), Y(110), 700, '#FFB648', .6);
    cloud(X(70, 'R'), Y(30), 760, 170, '#FFF6EA', 230, 'ctz'); cloud(X(70), Y(50), 760, 220, '#FFF6EA', 230, 'cbz');
    village(Y(176), 'cv');
    // back: a village saying good morning: the rooster, lotuses, the arghya at the river
    boilSeed('criver'); paint([[X(30), DH + 40], [X(44), Y(206)], [X(80), Y(196)], [X(124), Y(190)], [X(116), Y(198)], [X(76), Y(208)], [X(64), DH + 40]], { wash: '#BFE0EE', ink: INK, sw: .6, curv: .5 });
    for (const [x, s] of [[X(20), 18], [X(104), 16], [X(122), 14]]) hut(x, Y(190), s);
    for (const [x, s] of [[X(8), 30], [X(130), 26]]) tree(x, Y(190), s);
    rooster(X(104), Y(190) - 4.6 * 16 + 4, 2, 'crooster');
    waterLotus(X(52), Y(206), 7, 1, 'cl1'); waterLotus(X(70), Y(201), 5, .7, 'cl2');
    arghya(X(58), Y(212), 7, 'carghya');
    [[X(40), Y(120), 10], [X(52), Y(112), 8], [X(64), Y(124), 9]].forEach(([x, y, s], i) => bird(x, y, s, i * .3, 'cb' + i));
    // front: Surya in his chariot, the horses' heads leading off the right edge
    cloud(X(70, 'R'), Y(178), 1000, 120, '#FFF0E2', 240, 'croad');
    [[X(122, 'R'), Y(118), 15, '#3A9C98'], [X(128, 'R'), Y(136), 16, '#E8AA38'], [X(132, 'R'), Y(156), 18, '#E84A6A']].forEach(([x, y, u, mane], i) => suryaHorse(x, y, u, { gallop: .3 + i * .4, mane, rot: -.06, boilKey: 'ch' + i }));
    const cx = X(58, 'R'), cy = Y(196), cu = 28;
    boilSeed('crays'); push(); translate(cx - 20, Y(96)); glow(0, 0, 520, '#FFC766', .8); for (let i = 0; i < 20; i++) { const a = i / 20 * TAU; paint([[Math.cos(a - .06) * 220, Math.sin(a - .06) * 220], [Math.cos(a) * 520, Math.sin(a) * 520], [Math.cos(a + .1) * 520, Math.sin(a + .1) * 520], [Math.cos(a + .06) * 220, Math.sin(a + .06) * 220]], { fill: i % 2 ? '#FFD45A' : '#FFB648', fillOp: 130, bleed: .1, tex: .3, ink: null }); } pop();
    suryaChariot(cx, cy, cu, { part: 'back', boilKey: 'cch' });
    surya(cx - 20, cy - 10.4 * cu + 12 * 28 + 4, 28, { eyes: 'happy', mouth: 'grin', hx: .25, lookX: .3, noShadow: true, legs: false, boilKey: 'csurya' });
    suryaChariot(cx, cy, cu, { part: 'front', boilKey: 'cch', pole: [X(118, 'R'), Y(150)], spin: .5 });
  }

  shots([[0, spread(titleSlot)], [1, spread(darkSpread)], [2, spread(eggSpread)], [3, spread(chariotSpread)], [4, spread(shineSpread)],
    [5, spread(fruitSpread)], [6, spread(learnSpread)], [7, spread(lightSpread)], [8, spread(meetSlot)], [9, spread(coverSlot)]]);
})();
