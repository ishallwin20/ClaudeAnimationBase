// surya_book.js: the art of Navagraha Book 1, Surya (books/surya/STORY.md). Each slot is one spread, drawn at t = slot +
// .5: slot 0 is the inside front cover | p1, slots 1–7 the story spreads (p2–3 … p14–15), slot 8 p16 | the inside back
// cover, slot 9 the outside cover (back | front). No text is painted here: tools/book.mjs sets the words over these
// pictures from books/surya/book.js, so they stay live in the PDF and the EPUB.
//
// Every spread is drawn in a design space of DW × DH (half the 300 dpi canvas) under camBegin(…, 2): 1 mm ≈ 5.9 units.
// The canvas includes 3 mm of bleed all round (BL); the fold is at x = DW / 2. Keep faces 12 mm (GUT) off the fold and
// everything that matters 6 mm inside the trim; leave the text zones of book.js quiet.
(() => {
  const DW = W / 2, DH = H / 2, MM = DW / 286, BL = 3 * MM, GUT = 12 * MM, FOLD = DW / 2;
  const INK = '#3A1F22';
  const spread = f => (t, lt) => { camBegin(DW / 2, DH / 2, W / DW); f(t, lt); camEnd(); };

  // ---- shared painted pieces ----
  // a sky in soft horizontal bands, top colour → bottom colour through the list
  function sky(cols, y0 = -40, y1 = DH + 40, key = 'sky') {
    boilSeed(key);
    paint(rectPts(-40, y0, DW + 80, y1 - y0), { wash: cols[0], ink: null });
    const n = cols.length;
    for (let i = 1; i < n; i++) {
      const y = lerp(y0, y1, i / n), h = (y1 - y0) / n * 1.6;
      paint(rectPts(-60, y - h * .3, DW + 120, h, 6), { fill: cols[i], fillOp: 200, bleed: .25, tex: .35, border: .25, ink: null });
    }
  }
  // a soft cloud: overlapping lobes in one fill, optionally with a light top
  function cloud(x, y, w, h, col, op = 220, key = 'cl' + x) {
    boilSeed(key);
    const n = Math.max(3, Math.round(w / h * 1.6)), pts = [];
    for (let i = 0; i <= n; i++) { const k = i / n, a = Math.PI + k * Math.PI; pts.push([x + Math.cos(a) * w / 2, y + Math.sin(a) * h * (.7 + .5 * hash(i + x))]); }
    pts.push([x + w / 2, y + h * .25], [x - w / 2, y + h * .25]);
    paint(pts, { fill: col, fillOp: op, bleed: .12, tex: .3, border: .4, ink: null, curv: .6 });
  }
  // a little hut with a thatched roof
  function hut(x, y, s, wall = '#E8C9A0', roof = '#B5713E') {
    boilSeed('hut' + x);
    paint([[x - 2 * s, y], [x + 2 * s, y], [x + 2 * s, y - 2.4 * s], [x - 2 * s, y - 2.4 * s]], { wash: wall, ink: INK, sw: .7 });
    paint([[x - 2.6 * s, y - 2.2 * s], [x + 2.6 * s, y - 2.2 * s], [x + .3 * s, y - 4.6 * s], [x - .3 * s, y - 4.6 * s]], { wash: roof, fill: mixCol(roof, INK, .3), fillOp: 60, tex: .5, ink: INK, sw: .7 });
    paint([[x - .5 * s, y], [x + .5 * s, y], [x + .5 * s, y - 1.4 * s], [x - .5 * s, y - 1.4 * s]], { wash: '#6A3E2A', ink: null });
  }
  function tree(x, y, s, col = '#6E9F58') {
    boilSeed('tree' + x);
    inkLine([[x, y], [x + s * .1, y - s * 2]], s * .12, '#6A4A30', 'ink', 0);
    paint(ellPts(x, y - s * 2.6, s * 1.2, s * 1, 14, s * .08), { wash: col, fill: mixCol(col, INK, .3), fillOp: 70, tex: .5, ink: INK, sw: .6 });
  }

  // ---- slot 3: p6–7, the chariot of the Sun ----
  function chariotSpread(t) {
    sky(['#EBC6DA', '#F2C9C4', '#F7D2B2', '#FAD9A2', '#FBE3AE']);
    // the sun's light spreads from Surya: one big warm glow, then the clouds lit pink-gold
    glow(520, 560, 900, '#FFB648', .55);
    cloud(260, 150, 520, 120, '#FFF3E6', 230, 'tz1');          // the quiet pale clouds under the page text
    cloud(1240, 150, 560, 120, '#FFF3E6', 230, 'tz2');
    cloud(1500, 420, 300, 70, '#F9DCCB', 200, 'c3');
    cloud(120, 640, 260, 60, '#F9DCCB', 200, 'c4');
    // the earth far below, waking: hills, a river, a village
    boilSeed('hills');
    paint([[-40, 1210], [200, 1150], [460, 1185], [760, 1140], [1060, 1175], [1360, 1130], [1730, 1170], [1730, 1380], [-40, 1380]], { fill: '#B7A2C8', fillOp: 220, bleed: .1, tex: .4, ink: null, curv: .5 });
    paint([[-40, 1250], [300, 1225], [640, 1245], [980, 1215], [1300, 1240], [1730, 1220], [1730, 1380], [-40, 1380]], { wash: '#9DBF7E', fill: '#7FA563', fillOp: 120, tex: .4, ink: INK, sw: .7, curv: .5 });
    boilSeed('river');
    paint([[560, 1380], [640, 1300], [760, 1262], [900, 1250], [860, 1270], [740, 1300], [700, 1380]], { wash: '#BFE0EE', ink: INK, sw: .6, curv: .5 });
    for (const [x, s] of [[1080, 13], [1150, 11], [1230, 14], [1420, 12]]) hut(x, 1262, s);
    for (const [x, s] of [[1010, 26], [1310, 30], [1520, 24], [260, 28], [420, 22]]) tree(x, 1258, s);
    // a rooster on the tallest roof, crowing at the sunrise (the gag for small readers)
    boilSeed('rooster');
    { const rx = 1232, ry = 1196;
      paint(ellPts(rx, ry, 13, 10, 14), { wash: '#FFF3E6', ink: INK, sw: .6 });
      paint([[rx + 8, ry - 6], [rx + 14, ry - 20], [rx + 20, ry - 10]], { wash: '#FFF3E6', ink: INK, sw: .6, curv: .4 });
      paint([[rx + 14, ry - 21], [rx + 17, ry - 28], [rx + 20, ry - 21]], { wash: '#D2402E', ink: null });
      paint([[rx + 20, ry - 17], [rx + 28, ry - 18], [rx + 20, ry - 13]], { wash: '#F2BE3E', ink: INK, sw: .5 });
      paint([[rx - 12, ry - 2], [rx - 24, ry - 16], [rx - 20, ry + 2]], { wash: '#3A9C98', ink: INK, sw: .5 });
      for (const k of [0, 1, 2]) inkLine([[rx + 32 + k * 6, ry - 22 - k * 4], [rx + 36 + k * 7, ry - 26 - k * 5]], .8, INK, 'inkfine', 0); }
    // the road of cloud the chariot runs on
    cloud(820, 1110, 1400, 120, '#FFF0E2', 240, 'road');
    cloud(560, 1135, 700, 80, '#F8D9C8', 200, 'road2');

    // ---- the seven horses, back row first (smaller, paler), fanned so every head shows
    const HX = [[1100, 770, 16, '#7B5CA8'], [1300, 745, 16, '#3A6FB0'], [1470, 790, 15.5, '#3A9C98'],
      [1180, 885, 18, '#6E9F58'], [1410, 900, 18, '#E8AA38'], [1050, 1010, 20, '#F07A22'], [1320, 1030, 20, '#E84A6A']];
    const bits = [];
    HX.forEach(([x, y, u, mane], i) => {
      const o = { gallop: .15 + i * .23, mane, rot: -.06, boilKey: 'horse' + i, coat: i < 3 ? '#F6EADF' : '#FFF6EA', eyes: i === 6 ? 'happy' : 'normal' };
      suryaHorse(x, y, u, o);
      bits.push(suryaHorseBit(x, y, u, o));
    });

    // ---- the chariot, Surya in it, Aruna at the front with the reins
    const cx = 430, cy = 1180, cu = 28, ou = { boilKey: 'chariot' }, su = 28;
    suryaChariot(cx, cy, cu, { ...ou, part: 'back' });
    surya(cx - 30, 880 + 12 * su, su, { eyes: 'happy', mouth: 'grin', hx: .35, lookX: .5, noShadow: true, legs: false, boilKey: 'surya', handR: [6.2, -20.6], bendR: .6, handL: [-5.2, -15.4] });
    const au = 19, ax = cx + 6.2 * cu, ay = 885 + 12 * au;
    surya(ax, ay, au, { pal: ARUNA_PAL, crown: 'band', halo: 0, haloGlow: 0, reins: 1, legs: false, noShadow: true, eyes: 'normal', lookX: .8, mouth: 'smile', boilKey: 'aruna', kavacha: false });
    suryaChariot(cx, cy, cu, { ...ou, part: 'front', pole: [1140, 950], spin: .3 });
    // the reins: from Aruna's fists to every horse's bridle
    const [h1x, h1y] = suryaHand(ax, ay, au, { reins: 1 }, 1), [h2x, h2y] = suryaHand(ax, ay, au, { reins: 1 }, -1);
    bits.forEach(([bx, by], i) => { boilSeed('rein' + i); const [hx, hy] = i % 2 ? [h1x, h1y] : [h2x, h2y]; inkLine([[hx, hy], [lerp(hx, bx, .5), lerp(hy, by, .5) + 30], [bx, by]], .9, '#8E3A36', 'inkfine', .5); });
    // re-draw Aruna's near fist over the reins
    boilSeed('fist'); paint(ellPts(h1x, h1y, .72 * au, .66 * au, 14), { wash: ARUNA_PAL.skin, ink: INK, sw: .75 });
  }

  // a blank slot (still to paint)
  const todo = () => { paint(rectPts(-40, -40, DW + 80, DH + 80), { wash: PAL.paper, ink: null }); };

  shots([[0, spread(todo)], [1, spread(todo)], [2, spread(todo)], [3, spread(chariotSpread)], [4, spread(todo)], [5, spread(todo)],
    [6, spread(todo)], [7, spread(todo)], [8, spread(todo)], [9, spread(todo)]]);
})();
