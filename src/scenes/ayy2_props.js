// ayy2_props.js: sets, props and the extra cast for Ayyappa Part 2 (ad 103, "He went for TIGER'S MILK"). Scene-local.
//   a2Forest       the forest by the Pampa at midday (the hunt): green hills, the river, ferns, a teak and a palm
//   a2Hall         Pandalam's palace hall, Kerala style: dark teak pillars, a red laterite floor, a tiled roof's eave
//                  through the window, brass nilavilakku lamps
//   a2Room         the minister's room at night, one lamp (scheming)
//   a2Street       Pandalam's street at the palace gate (a padippura gatehouse, a tiled roof, coconut palms)
//   a2Palm, a2Lamp (a nilavilakku), a2Leaf (a banana leaf with rice), a2Bundle (the bundle with the three-eyed
//   coconut), a2Mat, a2Stick, a2Crown (a small gold crown, for the tiger and the cubs), a2Bubble, a2MilkPot
//   king(x, y, u, o)       King Rajasekhara of Pandalam: Dasharatha's rig in Kerala white and gold (kasavu), a low crown
//   queen(x, y, u, o)      the queen: Kaikeyi's rig in a cream kasavu saree with a red blouse
//   minister(x, y, u, o)   the minister: Narad's rig, a green court robe, a turban, a black beard trimmed short
//   vaidya(x, y, u, o)     the minister's vaidya: a rishi with a herb pouch
//   lady(x, y, u, k, o)    a palace woman (Parvati's rig; k picks her colours)
//   townsman(x, y, u, k, o) a man of Pandalam (Narad's rig in a plain mundu)
const A2 = {
  ink: '#2B2233', cream: '#FFF5E2', gold: '#F5C542', goldLt: '#FFE69A', goldDk: '#C8922A',
  sky: '#CDE8E0', skyLo: '#F2EED2', hill: '#7FB07A', hillDk: '#5A8C5E', leaf: '#4E9A5A', leafDk: '#2E6A40', leafLt: '#8CC26E',
  river: '#5E9EC2', riverDk: '#3E7AA0', riverLt: '#A8D4EC', bank: '#9CCB6A', bankDk: '#6FA24A', earth: '#B8794A', earthDk: '#8A5432',
  wall: '#F3DFC0', wallDk: '#D9BC92', teak: '#6E3E22', teakDk: '#4A2614', teakLt: '#9A6038', laterite: '#B8553A', lateriteDk: '#8A3A26',
  tile: '#B8482E', tileDk: '#86301E', brass: '#E2A93A', brassDk: '#A8741E', brassLt: '#FFD98A',
  night: '#2A2140', nightLo: '#3E3058', street: '#E8C89A', streetDk: '#C8A070', banana: '#5EAA4A', bananaDk: '#3E7E32', rice: '#FFFBF2',
  coconut: '#7A4E2E', coconutDk: '#52321C', cloth: '#E8D6B0', clothDk: '#BFA680', palm: '#4E8E4A', palmDk: '#2E6232', trunk: '#8A6A4A',
};

const a2bg = (key, col) => { boilSeed(key + ' bg'); paint(rectPts(-300, -300, 1680, 2600), { wash: col, ink: null }); };

// a coconut palm: a curved trunk and a crown of fronds (s = height)
function a2Palm(x, y, s, t, key, lean = .12) {
  boilSeed(key + 'trunk');
  const top = [x + lean * s, y - s];
  paint(ribbon([[x, y], [x + lean * s * .3, y - s * .5], top], s * .045, s * .03), { wash: A2.trunk, fill: '#5E4430', fillOp: 50, tex: .5, ink: A2.ink, sw: 1, curv: .3 });
  for (let i = 0; i < 6; i++) { const k = (i + 1) / 7; inkLine([[x + lean * s * k * k - s * .02, y - s * k], [x + lean * s * k * k + s * .02, y - s * k - 4]], .8, '#5E4430', 'inkfine', 0); }
  for (let i = 0; i < 7; i++) {
    boilSeed(key + 'frond' + i);
    const a = -Math.PI / 2 + (i - 3) * .5 + Math.sin(t * 1.1 + i) * .04, L = s * (.32 + .05 * (i % 2));
    const mid = [top[0] + Math.cos(a) * L * .55, top[1] + Math.sin(a) * L * .55 - s * .05], end = [top[0] + Math.cos(a) * L, top[1] + Math.sin(a) * L + L * .45 * Math.abs(Math.cos(a))];
    paint(ribbon([top, mid, end], s * .05, s * .005), { wash: i % 2 ? A2.palm : A2.palmDk, ink: A2.ink, sw: .7, curv: .4 });
  }
  boilSeed(key + 'nuts'); for (let i = 0; i < 3; i++) paint(ellPts(top[0] - s * .03 + i * s * .03, top[1] + s * .03, s * .022, s * .024, 8), { wash: '#C8A040', ink: A2.ink, sw: .5 });
}

// the forest by the Pampa at midday
function a2Forest(t, key = 'fo', o = {}) {
  a2bg(key, A2.sky);
  boilSeed(key + 'lo'); paint(rectPts(-300, 900, 1680, 700), { fill: A2.skyLo, fillOp: 200, bleed: .3, tex: .3, ink: null });
  boilSeed(key + 'hills');
  paint([[-300, 1240], [0, 1080], [260, 1150], [520, 1020], [820, 1120], [1100, 1040], [1380, 1110], [1380, 1500], [-300, 1500]], { wash: A2.hill, fill: A2.hillDk, fillOp: 40, tex: .3, ink: null, curv: .4 });
  for (let i = 0; i < 9; i++) { boilSeed(key + 'ft' + i); const x = -120 + i * 170 + 40 * hash(i * 2.7), r = 70 + 40 * hash(i * 4.3); paint(ellPts(x, 1240 - r * .3, r, r * .75, 14, 2), { wash: i % 2 ? A2.leaf : A2.leafDk, ink: null }); }
  if (o.river !== false) {
    boilSeed(key + 'river');
    paint([[-300, 1330], [400, 1300], [1380, 1340], [1380, 1520], [600, 1490], [-300, 1530]], { wash: A2.river, fill: A2.riverDk, fillOp: 40, tex: .3, ink: null, curv: .5 });
    for (let i = 0; i < 8; i++) { const y = 1340 + hash(i * 2.3) * 150, x = frac(hash(i * 7.7) + t * .04) * 1600 - 260; inkLine([[x, y], [x + 80, y]], 1.4, A2.riverLt, 'inkfine', 0); }
  }
  a2Palm(1040, 1560, 760, t, key + 'p1', -.1);
  boilSeed(key + 'bank');
  paint([[-300, 1500], [300, 1480], [800, 1510], [1380, 1490], [1380, 2400], [-300, 2400]], { wash: A2.bank, fill: A2.bankDk, fillOp: 55, tex: .5, ink: A2.ink, sw: 1, curv: .5 });
  // ferns in front
  for (let i = 0; i < 7; i++) {
    boilSeed(key + 'fern' + i);
    const fx = -60 + i * 190 + 30 * hash(i * 5.1), fy = 1990 + (i % 2) * 40, sw = Math.sin(t * 1.3 + i) * .05;
    for (let j = 0; j < 5; j++) { const a = -Math.PI / 2 + (j - 2) * .45 + sw; paint(ribbon([[fx, fy], [fx + Math.cos(a) * 60, fy + Math.sin(a) * 90], [fx + Math.cos(a) * 110, fy + Math.sin(a) * 140 + 30]], 18, 3), { wash: j % 2 ? A2.leaf : A2.leafLt, ink: A2.ink, sw: .6, curv: .4 }); }
  }
}

// a bush the king parts (k 0..1: the two halves swing apart)
function a2Bush(x, y, s, k, key) {
  for (const sd of [-1, 1]) {
    boilSeed(key + sd);
    const dx = sd * k * s * .7;
    for (let i = 0; i < 4; i++) paint(ellPts(x + dx + sd * (s * .15 + i * s * .12), y - s * (.25 + .18 * (i % 2)), s * .32, s * .26, 12, 2), { wash: i % 2 ? A2.leaf : A2.leafDk, fill: A2.leafDk, fillOp: 40, tex: .4, ink: A2.ink, sw: .9 });
  }
}

// Pandalam's palace hall (Kerala): a cream wall, dark teak pillars and beams, a red floor, a window with the eave
function a2Hall(t, key = 'hl', o = {}) {
  a2bg(key, A2.wall);
  boilSeed(key + 'glow'); glow(540, 1100, 620, '#FFE8B8', .45);
  // a window: the courtyard's light and the tiled eave
  boilSeed(key + 'win');
  paint(rectPts(330, 220, 420, 520), { wash: '#BFE2D6', ink: A2.ink, sw: 1.2 });
  paint(rectPts(330, 220, 420, 200), { fill: '#E8F4E6', fillOp: 200, bleed: .2, tex: .3, ink: null });
  a2Palm(640, 760, 420, t, key + 'wp', -.05);
  paint([[300, 220], [780, 220], [820, 300], [260, 300]], { wash: A2.tile, fill: A2.tileDk, fillOp: 60, tex: .5, ink: A2.ink, sw: 1 });
  for (let i = 0; i < 9; i++) inkLine([[290 + i * 60, 230], [270 + i * 62, 295]], .8, A2.tileDk, 'inkfine', 0);
  for (let i = 0; i < 5; i++) paint(rectPts(345 + i * 90, 300, 14, 440), { wash: A2.teak, ink: A2.ink, sw: .6 });   // the wooden bars
  paint(rectPts(310, 740, 460, 34), { wash: A2.teak, ink: A2.ink, sw: 1 });
  // the beam and the pillars
  boilSeed(key + 'beam'); paint(rectPts(-300, 120, 1680, 90), { wash: A2.teak, fill: A2.teakDk, fillOp: 50, tex: .5, ink: A2.ink, sw: 1.2 });
  for (let i = 0; i < 12; i++) inkLine([[-200 + i * 130, 135], [-200 + i * 130, 195]], .8, A2.teakLt, 'inkfine', 0);
  for (const x of [70, 1010]) {
    boilSeed(key + 'pil' + x);
    paint(rectPts(x - 50, 200, 100, 1460), { wash: A2.teak, fill: A2.teakDk, fillOp: 55, tex: .5, ink: A2.ink, sw: 1.2 });
    paint(rectPts(x - 72, 200, 144, 50), { wash: A2.teakDk, ink: A2.ink, sw: 1 });
    paint(rectPts(x - 72, 1610, 144, 60), { wash: A2.teakDk, ink: A2.ink, sw: 1 });
    inkLine([[x - 20, 260], [x - 20, 1600]], 1, A2.teakLt, 'inkfine', 0);
  }
  // the floor
  boilSeed(key + 'floor');
  paint([[-300, 1640], [1380, 1640], [1380, 2400], [-300, 2400]], { wash: A2.laterite, fill: A2.lateriteDk, fillOp: 45, tex: .5, ink: A2.ink, sw: 1 });
  paint(ellPts(540, 1720, 700, 80, 20), { fill: '#D8775A', fillOp: 120, bleed: .3, tex: .3, ink: null });   // the polish
  if (o.lamps !== false) { a2Lamp(190, 1700, 120, 1, key + 'l1'); a2Lamp(890, 1700, 120, 1, key + 'l2'); }
}

// a brass nilavilakku: a round foot, a tall stem, a dish with wicks (s = height)
function a2Lamp(x, y, s, lit, key) {
  boilSeed(key + 'lamp');
  if (lit > 0) glow(x, y - s, s * 1.4, '#FFD27A', .45 * lit);
  paint(ellPts(x, y - s * .05, s * .28, s * .07, 14), { wash: A2.brass, fill: A2.brassDk, fillOp: 50, ink: A2.ink, sw: .9 });
  paint([[x - s * .05, y - s * .08], [x - s * .04, y - s * .85], [x + s * .04, y - s * .85], [x + s * .05, y - s * .08]], { wash: A2.brass, fill: A2.brassDk, fillOp: 50, ink: A2.ink, sw: .8 });
  for (const k of [.35, .6]) paint(ellPts(x, y - s * k, s * .09, s * .04, 10), { wash: A2.brassLt, ink: A2.ink, sw: .6 });
  paint([[x - s * .3, y - s * .9], [x + s * .3, y - s * .9], [x + s * .18, y - s * .8], [x - s * .18, y - s * .8]], { wash: A2.brass, fill: A2.brassDk, fillOp: 50, ink: A2.ink, sw: .8, curv: .3 });
  paint([[x - s * .06, y - s * .9], [x, y - s * 1.12], [x + s * .06, y - s * .9]], { wash: A2.brass, ink: A2.ink, sw: .6 });
  if (lit > 0) for (const dx of [-.22, 0, .22]) {
    const fx = x + dx * s, fy = y - s * (.93 + (dx === 0 ? .2 : 0)), h = s * .16 * (1 + .15 * Math.sin(T * 15 + dx * 9)) * lit;
    paint([[fx - s * .035, fy], [fx + Math.sin(T * 9 + dx) * s * .01, fy - h], [fx + s * .035, fy]], { wash: '#FFE08A', ink: null, curv: .5 });
    paint(ellPts(fx, fy - h * .3, s * .012, h * .25, 6), { wash: '#FFF8D8', ink: null });
  }
}

// the minister's room at night: dark walls, one lamp, a carved chest
function a2Room(t, key = 'rm') {
  a2bg(key, A2.night);
  boilSeed(key + 'glow'); glow(760, 1450, 520, '#FFB860', .35);
  boilSeed(key + 'wall'); paint(ellPts(700, 1300, 700, 600, 24), { fill: A2.nightLo, fillOp: 200, bleed: .3, tex: .4, ink: null });
  boilSeed(key + 'beam'); paint(rectPts(-300, 520, 1680, 70), { wash: '#1E1630', ink: null });
  for (const x of [60, 1020]) { boilSeed(key + 'pil' + x); paint(rectPts(x - 45, 590, 90, 1100), { wash: '#24193A', ink: A2.ink, sw: .8 }); }
  boilSeed(key + 'floor'); paint([[-300, 1680], [1380, 1680], [1380, 2400], [-300, 2400]], { wash: '#3A2A38', fill: '#24182A', fillOp: 50, tex: .5, ink: A2.ink, sw: .8 });
  a2Lamp(880, 1760, 110, 1, key + 'l');
}

// Pandalam's street at the palace gate: a padippura (gatehouse) with a tiled roof, a white wall, palms, a dusty road
function a2Street(t, key = 'st', o = {}) {
  a2bg(key, '#BFE0EA');
  boilSeed(key + 'lo'); paint(rectPts(-300, 900, 1680, 600), { fill: '#F4ECD0', fillOp: 220, bleed: .3, tex: .3, ink: null });
  boilSeed(key + 'hills'); paint([[-300, 1250], [200, 1150], [600, 1210], [1000, 1130], [1380, 1180], [1380, 1400], [-300, 1400]], { wash: A2.hill, ink: null, curv: .4 });
  a2Palm(120, 1420, 640, t, key + 'p0', .14); a2Palm(1000, 1420, 700, t, key + 'p1', -.12);
  // the wall and the gatehouse
  boilSeed(key + 'wall'); paint(rectPts(-300, 1180, 1680, 250), { wash: '#F6F0E2', fill: '#DCD2BE', fillOp: 40, tex: .4, ink: A2.ink, sw: 1 });
  paint(rectPts(-300, 1160, 1680, 30), { wash: A2.tile, ink: A2.ink, sw: .8 });
  const gx = o.gateX ?? 540;
  boilSeed(key + 'gate');
  paint(rectPts(gx - 190, 1000, 380, 430), { wash: '#F6F0E2', fill: '#DCD2BE', fillOp: 40, tex: .4, ink: A2.ink, sw: 1.2 });
  paint(rectPts(gx - 110, 1130, 220, 300), { wash: A2.teak, fill: A2.teakDk, fillOp: 50, tex: .5, ink: A2.ink, sw: 1 });
  inkLine([[gx, 1130], [gx, 1430]], 1.2, A2.teakDk, 'ink', 0);
  for (let i = 0; i < 3; i++) for (const sd of [-1, 1]) paint(ellPts(gx + sd * 55, 1190 + i * 85, 8, 8, 8), { wash: A2.brass, ink: null });
  paint([[gx - 280, 1010], [gx, 860], [gx + 280, 1010], [gx + 230, 1030], [gx - 230, 1030]], { wash: A2.tile, fill: A2.tileDk, fillOp: 60, tex: .5, ink: A2.ink, sw: 1.2, curv: .1 });
  for (let i = 0; i < 9; i++) inkLine([[gx - 220 + i * 55, 1020], [gx - 120 + i * 30, 950]], .8, A2.tileDk, 'inkfine', 0);
  // the road
  boilSeed(key + 'road');
  paint([[-300, 1420], [1380, 1420], [1380, 2400], [-300, 2400]], { wash: A2.street, fill: A2.streetDk, fillOp: 45, tex: .5, ink: A2.ink, sw: 1 });
  for (let i = 0; i < 6; i++) inkLine([[-100 + i * 260, 1600 + (i % 2) * 120], [-40 + i * 260, 1600 + (i % 2) * 120]], 1, A2.streetDk, 'inkfine', 0);
}

// a banana leaf with rice and a few curries (the meal), x, y its middle, s its length
function a2Leaf(x, y, s, key, sparkle = 0) {
  boilSeed(key + 'leaf');
  paint([[x - s * .5, y], [x - s * .35, y - s * .14], [x + s * .3, y - s * .17], [x + s * .52, y - s * .06], [x + s * .5, y + s * .06], [x + s * .3, y + s * .15], [x - s * .35, y + s * .12]], { wash: A2.banana, fill: A2.bananaDk, fillOp: 50, tex: .4, ink: A2.ink, sw: 1, curv: .4 });
  inkLine([[x - s * .48, y], [x + s * .5, y - s * .01]], .9, A2.bananaDk, 'inkfine', 0);
  for (let i = 0; i < 6; i++) inkLine([[x - s * .3 + i * s * .14, y], [x - s * .25 + i * s * .14, y - s * .13]], .6, A2.bananaDk, 'inkfine', 0);
  boilSeed(key + 'food');
  paint(ellPts(x + s * .05, y + s * .02, s * .16, s * .07, 14), { wash: A2.rice, fill: '#EDE4D0', fillOp: 50, ink: A2.ink, sw: .7 });
  for (const [dx, c] of [[-.25, '#E8A23A'], [-.33, '#7AA83A'], [.3, '#D2452F'], [.38, '#F2D45A']]) paint(ellPts(x + dx * s, y - s * .05, s * .045, s * .03, 10), { wash: c, ink: A2.ink, sw: .5 });
  if (sparkle > 0) { glow(x, y - s * .05, s * .5, '#FFF0B0', .5 * sparkle); }
}

// the bundle on his head, with the three-eyed coconut showing at the knot (s = width)
function a2Bundle(x, y, s, key) {
  boilSeed(key + 'bundle');
  paint([[x - s * .5, y], [x - s * .42, y - s * .3], [x, y - s * .38], [x + s * .42, y - s * .3], [x + s * .5, y], [x, y + s * .06]], { wash: A2.cloth, fill: A2.clothDk, fillOp: 50, tex: .4, ink: A2.ink, sw: .9, curv: .4 });
  for (const sd of [-1, 1]) paint(ribbon([[x + sd * s * .05, y - s * .3], [x + sd * s * .2, y - s * .5], [x + sd * s * .28, y - s * .44]], s * .08, s * .03), { wash: A2.cloth, ink: A2.ink, sw: .6 });
  paint(ellPts(x, y - s * .3, s * .17, s * .15, 14), { wash: A2.coconut, fill: A2.coconutDk, fillOp: 50, tex: .5, ink: A2.ink, sw: .7 });
  for (const [dx, dy] of [[-.05, -.33], [.05, -.33], [0, -.26]]) paint(ellPts(x + dx * s, y + dy * s, s * .025, s * .025, 6), { wash: '#2A1A10', ink: null });   // its three eyes
}

// a mat to lie on, a walking stick, a small gold crown
function a2Mat(x, y, w, key) { boilSeed(key + 'mat'); paint(rrPts(x - w / 2, y - w * .06, w, w * .14, 8), { wash: '#D9B87A', fill: '#B8944E', fillOp: 50, tex: .5, ink: A2.ink, sw: .8 }); for (let i = 0; i < 8; i++) inkLine([[x - w / 2 + 20 + i * (w - 40) / 7, y - w * .05], [x - w / 2 + 20 + i * (w - 40) / 7, y + w * .07]], .6, '#B8944E', 'inkfine', 0); }
function a2Stick(x0, y0, x1, y1, key) { boilSeed(key + 'stick'); paint(ribbon([[x0, y0], [(x0 + x1) / 2 + 4, (y0 + y1) / 2], [x1, y1]], 9, 7), { wash: '#8A5A32', ink: A2.ink, sw: .7 }); }
function a2Crown(x, y, s, key, rot = 0) {
  boilSeed(key + 'crown');
  push(); translate(x, y); rotate(rot);
  paint([[-s * .5, 0], [-s * .55, -s * .55], [-s * .25, -s * .3], [0, -s * .75], [s * .25, -s * .3], [s * .55, -s * .55], [s * .5, 0]], { wash: A2.gold, fill: A2.goldDk, fillOp: 50, ink: A2.ink, sw: Math.max(.5, s / 50), curv: .1 });
  paint(ellPts(0, -s * .2, s * .1, s * .1, 8), { wash: '#D2283A', ink: null });
  pop();
}
// a thought bubble with a pointer at (px, py)
function a2Bubble(x, y, w, h, k, key, px, py) {
  if (k <= 0) return;
  boilSeed(key);
  push(); translate(x, y); scale(k); translate(-x, -y);
  for (const [f, r] of [[.25, 12], [.5, 18]]) paint(ellPts(lerp(px, x, f), lerp(py, y, f), r, r, 10), { wash: '#FFFFFF', ink: A2.ink, sw: 1 });
  paint(ellPts(x, y, w / 2, h / 2, 28), { wash: '#FFFFFF', ink: A2.ink, sw: 1.4 });
  pop();
}
function a2MilkPot(x, y, s, key) {
  boilSeed(key + 'pot');
  paint([[x - s * .3, y - s * .9], [x + s * .3, y - s * .9], [x + s * .22, y - s * .75], [x + s * .45, y - s * .45], [x + s * .4, y - s * .1], [x, y], [x - s * .4, y - s * .1], [x - s * .45, y - s * .45], [x - s * .22, y - s * .75]], { wash: A2.brass, fill: A2.brassDk, fillOp: 50, ink: A2.ink, sw: .9, curv: .4 });
  paint(ellPts(x, y - s * .9, s * .28, s * .07, 10), { wash: '#FFFBF2', ink: A2.ink, sw: .6 });
}

// ---------- the extra cast ----------
const KING_PAL = { dhoti: '#FFF6E6', dhotiDk: '#E2D6BE', dhotiLt: '#FFFFFF', border: '#E2A93A', shawl: '#F2C230', shawlDk: '#B88A1C', skin: '#E8B48A', skinDk: '#C88A62', skinLt: '#FAD2B0' };
function king(x, y, u, o = {}) { return dasharatha(x, y, u, { crown: 'small', ...o, pal: { ...KING_PAL, ...(o.pal || {}) } }); }
const QUEEN_PAL = { saree: '#FFF4DE', sareeDk: '#E6D2AE', sareeLt: '#FFFFFF', blouse: '#C22A3A', blouseDk: '#8A1A28', bangle: '#F2C230', skin: '#E8B08A', skinDk: '#C88862', skinLt: '#FAD0AE', lip: '#B8404E' };
function queen(x, y, u, o = {}) { return kaikeyi(x, y, u, { ...o, pal: { ...QUEEN_PAL, ...(o.pal || {}) } }); }
const MIN_PAL = { skin: '#DCA27A', skinDk: '#B87A54', skinLt: '#F0C29E', dhoti: '#2E6A5A', dhotiDk: '#1E4A3E', dhotiLt: '#5E9A88', border: '#E2A93A',
  shawl: '#6E2E5A', shawlDk: '#4A1E3E', hair: '#1E1820', hairLt: '#3E3440', tilak: '#E2452B', red: '#E2452B' };
function minister(x, y, u, o = {}) {
  const prevHat = o.hat;
  return narada(x, y, u, { veena: false, topknot: false, mala: false, beard: '#1E1820', beardLen: .45, ...o, pal: { ...MIN_PAL, ...(o.pal || {}) },
    hat: (uu, sw) => {   // a court turban, wound round with a gold band and a jewel
      boilSeed('min turban ' + (o.boilKey || ''));
      paint(U([[-3.4, -21.4], [-3.6, -23.2], [-2.6, -24.8], [0, -25.5], [2.6, -24.8], [3.6, -23.2], [3.4, -21.4], [0, -22.2]], uu), { wash: '#6E2E5A', fill: '#4A1E3E', fillOp: 50, tex: .5, ink: NRD.ink, sw: sw * .8, curv: .4 });
      for (const k of [-23.0, -24.1]) inkLine(U([[-3.2, k + .6], [0, k], [3.2, k + .6]], uu), sw * .5, '#4A1E3E', 'inkfine', .3);
      paint(U([[-3.5, -21.9], [3.5, -21.9], [3.4, -21.3], [-3.4, -21.3]], uu), { wash: A2.gold, ink: NRD.ink, sw: sw * .5 });
      paint(ellPts(0, -23.4 * uu, .45 * uu, .55 * uu, 10), { wash: '#2FA88A', ink: NRD.ink, sw: sw * .4 });
      if (prevHat) prevHat(uu, sw);
    } });
}
function vaidya(x, y, u, o = {}) {
  const prev = o.armR;
  return rishi(x, y, u, 1, { ...o, armR: (uu, sw) => {   // a herb pouch
    boilSeed('vdy pouch'); paint(ellPts(0, .9 * uu, .9 * uu, 1.1 * uu, 12), { wash: '#8A6A3A', fill: '#6A4A22', fillOp: 50, ink: NRD.ink, sw: sw * .5 });
    inkLine(U([[-.3, -.1], [0, -.6], [.3, -.1]], uu), sw * .5, '#4A3018', 'inkfine', 0);
    if (prev) prev(uu, sw); } });
}
const LADY_PALS = [
  { saree: '#F7C64A', sareeDk: '#D49A1A', sareeLt: '#FFE38A', blouse: '#2E8A5A', blouseDk: '#1E5E3E', bangle: '#2E8A5A', skin: '#EDB48A', skinDk: '#CC8A5F', skinLt: '#FFD9B8', lip: '#C0505E' },
  { saree: '#F2557A', sareeDk: '#C83458', sareeLt: '#FF9AB4', blouse: '#3E6CB8', blouseDk: '#2A4E8E', bangle: '#F2C230', skin: '#D9A27A', skinDk: '#B47A54', skinLt: '#F0C4A0', lip: '#B8404E' },
  { saree: '#9A6AC8', sareeDk: '#6E3E9E', sareeLt: '#C8A6EA', blouse: '#F08A2E', blouseDk: '#C4621A', bangle: '#F2C230', skin: '#F2C29E', skinDk: '#D69A74', skinLt: '#FFE2CC', lip: '#B8404E' },
];
function lady(x, y, u, k = 0, o = {}) { const p = LADY_PALS[k % 3]; return parvati(x, y, u, { crown: false, col: p.skin, dk: p.skinDk, lt: p.skinLt, ...o, pal: { ...p, ...(o.pal || {}) } }); }
const TOWN_PALS = [
  { dhoti: '#FFF6E6', dhotiDk: '#E2D6BE', dhotiLt: '#FFFFFF', border: '#2E6A5A', skin: '#C88A5A', skinDk: '#A06A3E', skinLt: '#E2AA7E', shawl: '#FFF6E6', shawlDk: '#E2D6BE' },
  { dhoti: '#F2D9A0', dhotiDk: '#D2B47A', dhotiLt: '#FFF0C8', border: '#B8202E', skin: '#B8784A', skinDk: '#8E5A32', skinLt: '#D8986A', shawl: '#F2D9A0', shawlDk: '#D2B47A' },
];
function townsman(x, y, u, k = 0, o = {}) { return narada(x, y, u, { veena: false, mala: false, tilak: false, ...o, pal: { ...TOWN_PALS[k % 2], ...(o.pal || {}) } }); }
// Rajarajan, the queen's own baby (Bal Krishna's rig, fair, no feather or flute)
function babyPrince(x, y, u, o = {}) { return balKrishna(x, y, u, { feather: false, flute: false, pearls: false, pendant: false, tilak: false, ...o, pal: { skin: '#F2C49A', skinDk: '#D69A6E', skinLt: '#FFE2C4', sole: '#FFD8C0', cheek: '#F28A8A', pit: '#FFF6E6', pitDk: '#E2D6BE', pitLt: '#FFFFFF', border: '#E2A93A', ...(o.pal || {}) } }); }
