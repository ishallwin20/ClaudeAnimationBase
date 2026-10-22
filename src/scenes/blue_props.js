// blue_props.js: sets, palettes and props for blue.js ("Why are Hindu gods BLUE?"). Loaded before it; everything here is
// a pure function of its arguments (and T for boil).
//   BG, TK                       palettes (TK: the card's brand colours, as in ads 21–29)
//   peachGround, monsoon, rain, pond, ocean, paperSheet, kailash, home    sets
//   rainCloud, cloudWipe, blueLotus, paintBowl, paintBrush, brushStroke, poisonBowl, drawingBoard, devoteeArm    props
//   dealCard, dealStrike         the 15K Family Deal card (Books 1–3, ₹350, till 25 Oct)
const BG = {
  ink: '#2B2233', cream: '#FFF5E2',
  peach: '#FBE0CF', peachDk: '#F2C2A6', peachLt: '#FFF1E6',
  // monsoon
  skyM: '#A9BCCF', skyMLt: '#C9D6E2', hillM: '#6E9A78', hillMDk: '#527E62', grass: '#86B46C', grassDk: '#5E9050', grassLt: '#A8CC88',
  cloud: '#5A80C2', cloudDk: '#3F62A2', cloudLt: '#88A9DE', drop: '#9CB8E4',
  // dusk pond
  duskHi: '#B79AC8', duskLo: '#F4C2A2', duskSun: '#FFD9A8', water: '#7C8FC0', waterDk: '#5C6FA4', waterLt: '#A6B4DA', pad: '#5E9A6A', padDk: '#3E7A50',
  bank: '#A0B87A', bankDk: '#7A9458', lotus: '#4F76CC', lotusDk: '#34539E', lotusLt: '#8EADEA', stem: '#4E8A50', seed: '#F2C94A',
  // ocean
  skyO: '#E6EEF6', skyOLo: '#FFF4E4', milk: '#F6EFDD', milkDk: '#DCCFB2', milkLt: '#FFFBF2',
  // paper
  bowl: '#B88A5E', bowlDk: '#8A623E', slate: '#3E4E70', wood: '#B8743E', woodDk: '#86502A', ferrule: '#C8C4CC',
  // Kailash
  nightHi: '#26305E', nightLo: '#4A4E8E', snow: '#C9CDE4', snowDk: '#9A9EC2', rock: '#5A5476', rockDk: '#3E3A5A',
  poison: '#4A2A5E', poisonDk: '#2A1638', fume: '#6E4A8A',
  // home
  wall: '#F6E2C4', wallDk: '#E2C49C', floor: '#C8945E', floorDk: '#A6764A', divan: '#B85A4A', divanDk: '#8E3E34', window: '#FFD9A0', board: '#FFF8EA',
  crayon: '#3E6CC8', skin: '#E0A678', skinDk: '#BE8052',
};
const TK = {
  ink: '#2B2233', cream: '#FFF5E2',
  petal: '#F4A6B8', petalDk: '#E0708C', marigold: '#F39A2E', yellow: '#FFD45A', leaf: '#5E9A6A',
  gold: '#EDB43C', goldLt: '#FFE39A', goldDk: '#B67D1C',
  rkOrange: '#F15A24', peach: '#FBE0CF', peachLt: '#FFF1E6', brown: '#3A2418', grey: '#6B5A50', teal: '#2E5F5A',
};

// ---------- sets ----------
function peachGround(t, key = 'peach') {
  boilSeed(key);
  paint(rectPts(-500, -500, W + 1000, H + 1500), { wash: BG.peach, ink: null });
  paint(ellPts(540, 1250, 760, 900, 30), { fill: BG.peachLt, fillOp: 150, bleed: .3, tex: .4, border: .2, ink: null });
  boilSeed(key + 'petals');
  for (let i = 0; i < 9; i++) {
    const x = -120 + hash(i * 3.3) * 1320 + 30 * Math.sin(t * .9 + i), y = frac(hash(i * 7.1) + t * (.035 + .02 * hash(i))) * (H + 600) - 200, r = t * .8 + i;
    paint([[x + Math.cos(r) * 15, y + Math.sin(r) * 15], [x + Math.cos(r + 1.6) * 7, y + Math.sin(r + 1.6) * 7], [x - Math.cos(r) * 15, y - Math.sin(r) * 15], [x + Math.cos(r - 1.6) * 7, y + Math.sin(r - 1.6) * 7]], { wash: i % 2 ? TK.marigold : TK.petal, washOp: 200, ink: null, curv: .5 });
  }
}
// a monsoon field: a soft slate sky, green hills, grass that leans in the wind
function monsoon(t, dark = 0) {
  boilSeed('msky');
  paint(rectPts(-300, -300, W + 600, 1500), { wash: mixCol(BG.skyM, '#7E92AC', dark * .6), ink: null });
  paint(ellPts(300, 900, 700, 360, 24), { fill: BG.skyMLt, fillOp: 110 * (1 - dark * .6), bleed: .3, tex: .4, border: .2, ink: null });
  boilSeed('mhills');
  paint([[-300, 1420], [-100, 1300], [180, 1340], [420, 1270], [700, 1330], [980, 1260], [1400, 1330], [1400, 1600], [-300, 1600]], { wash: BG.hillMDk, ink: BG.ink, sw: .8, curv: .6 });
  paint([[-300, 1480], [60, 1410], [380, 1450], [720, 1400], [1100, 1440], [1400, 1420], [1400, 1700], [-300, 1700]], { wash: BG.hillM, ink: BG.ink, sw: .8, curv: .6 });
  boilSeed('mgrass');
  paint(rectPts(-300, 1560, W + 600, 1200), { wash: BG.grass, ink: null });
  paint(ellPts(420, 1960, 760, 160, 24), { fill: BG.grassDk, fillOp: 70, bleed: .2, tex: .5, ink: null });
  inkLine([[-300, 1562], [1400, 1562]], 1, BG.grassDk, 'ink', 0);
  for (let i = 0; i < 26; i++) {   // tufts, leaning with the wind
    const x = -200 + hash(i * 4.1) * 1500, y = 1600 + hash(i * 2.9) * 560, h = 26 + 22 * hash(i * 7.7), lean = 10 + 8 * Math.sin(t * 2.3 + i);
    inkLine([[x, y], [x + lean * .4, y - h * .5], [x + lean, y - h]], 1.6, i % 3 ? BG.grassDk : BG.grassLt, 'ink', .5);
  }
}
// rain: slanted streaks falling from a band (screen or world), k 0..1 its strength
function rain(t, x0, x1, y0, y1, k, key = 'rain') {
  if (k <= 0) return;
  boilSeed(key);
  const n = Math.round(46 * k);
  for (let i = 0; i < n; i++) {
    const x = lerp(x0, x1, hash(i * 3.17)), sp = 900 + 300 * hash(i * 5.3), y = y0 + frac(hash(i * 1.7) + t * sp / (y1 - y0)) * (y1 - y0);
    inkLine([[x, y], [x - 9, y + 46]], 2.2, BG.drop, 'ink', 0);
  }
}
// a lotus pond at dusk: violet sky, a low sun, a far bank, water with reflections and lily pads
function pond(t) {
  boilSeed('psky');
  paint(rectPts(-300, -300, W + 600, 1500), { wash: BG.duskHi, ink: null });
  paint(ellPts(540, 1380, 1100, 520, 30), { fill: BG.duskLo, fillOp: 200, bleed: .25, tex: .4, border: .2, ink: null });
  glow(820, 1290, 260, '#FFC890', .7);
  paint(ellPts(820, 1290, 80, 80, 24), { wash: BG.duskSun, ink: null });
  boilSeed('pbank');
  paint([[-300, 1380], [100, 1340], [500, 1370], [900, 1330], [1400, 1360], [1400, 1420], [-300, 1420]], { wash: BG.bankDk, ink: BG.ink, sw: .8, curv: .5 });
  boilSeed('pwater');
  paint(rectPts(-300, 1410, W + 600, 1200), { wash: BG.water, ink: null });
  paint(ellPts(820, 1480, 90, 220, 16), { fill: BG.duskSun, fillOp: 90, bleed: .3, tex: .4, ink: null });   // the sun's reflection
  for (let i = 0; i < 7; i++) {
    const y = 1450 + i * 70, x = 200 + hash(i * 3.1) * 700 + 20 * Math.sin(t * 1.1 + i);
    inkLine([[x - 70, y], [x + 70, y]], 1.6, BG.waterLt, 'inkfine', 0);
  }
  boilSeed('ppads');
  for (const [px, py, r] of [[780, 1640, 70], [960, 1520, 52], [640, 1800, 84], [1000, 1880, 76], [180, 1520, 46]]) {
    paint([...ellPts(px, py, r, r * .38, 18).slice(0, 15), [px, py]], { wash: BG.pad, fill: BG.padDk, fillOp: 50, tex: .4, ink: BG.ink, sw: .8 });
  }
  // the near bank Ram stands on
  boilSeed('pnear');
  paint([[-300, 1760], [140, 1720], [520, 1760], [620, 1820], [560, 2100], [-300, 2100]], { wash: BG.bank, fill: BG.bankDk, fillOp: 50, tex: .4, ink: BG.ink, sw: 1, curv: .5 });
}
// floating blue lotuses on the pond
function pondLotuses(t) {
  for (const [i, [x, y, s]] of [[790, 1615, 15], [645, 1770, 17], [990, 1855, 16]].entries()) {
    boilSeed('pl' + i);
    push(); translate(x, y + 3 * Math.sin(t * 1.4 + i)); blueLotus(s, .9, 1, false); pop();
  }
}
// the milk ocean under a sky of clouds; cl 0..1 turns the cloud banks Vishnu's blue
function ocean(t, cl) {
  boilSeed('osky');
  paint(rectPts(-300, -300, W + 600, 1600), { wash: BG.skyO, ink: null });
  paint(ellPts(540, 1450, 1100, 380, 30), { fill: BG.skyOLo, fillOp: 200, bleed: .3, tex: .4, border: .2, ink: null });
  boilSeed('oclouds');
  const c = mixCol('#F2F4F8', VSN.skin, cl), cd = mixCol('#D6DCE6', VSN.skinDk, cl), clt = mixCol('#FFFFFF', VSN.skinLt, cl);
  for (const [i, [x, y, w]] of [[-60, 760, 360], [300, 690, 300], [700, 720, 380], [1100, 780, 320], [120, 1000, 280], [940, 1010, 300]].entries()) {
    const dx = 14 * Math.sin(t * .4 + i);
    paint(ellPts(x + dx, y, w, w * .4, 26, 6), { wash: c, fill: cd, fillOp: 60, tex: .5, ink: BG.ink, sw: .8 });
    for (let k = 0; k < 3; k++) paint(ellPts(x + dx + (k - 1) * w * .45, y - w * .22, w * .36, w * .3, 18, 4), { wash: c, ink: BG.ink, sw: .8 });
    paint(ellPts(x + dx - w * .3, y - w * .26, w * .22, w * .12, 12), { wash: clt, washOp: 200, ink: null });
  }
  boilSeed('osea');
  paint(rectPts(-300, 1560, W + 600, 1200), { wash: BG.milk, ink: null });
  for (let r = 0; r < 6; r++) for (let i = 0; i < 5; i++) {   // wave crests
    const y = 1600 + r * 90, x = -200 + i * 320 + (r % 2) * 160 + 30 * Math.sin(t * 1.2 + r + i);
    inkLine([[x - 70, y + 6], [x - 30, y - 8], [x + 10, y - 2], [x + 50, y - 12], [x + 90, y + 4]], 1.8, BG.milkDk, 'ink', .6);
  }
}
// clean paper (the canvas's own grain shows through): a sheet seen close, its edge and a shadow
function paperSheet(t) {
  boilSeed('desk');
  paint(rectPts(-300, -300, W + 600, H + 900), { wash: '#C9A27A', fill: '#A9825A', fillOp: 40, tex: .4, ink: null });
  boilSeed('sheet');
  paint(rectPts(70, 420, 940, 1360, 4), { fill: '#7A5A3E', fillOp: 70, bleed: .2, tex: .2, ink: null });   // its shadow
  paint(rectPts(50, 400, 940, 1360, 3), { wash: '#FBF4E6', ink: BG.ink, sw: .8 });
  paint(ellPts(520, 1060, 520, 640, 24), { fill: '#F2E6CE', fillOp: 70, bleed: .3, tex: .6, ink: null });
}
// Kailash at twilight: an indigo sky with stars, the white peak, a rock ledge
function kailash(t) {
  boilSeed('ksky');
  paint(rectPts(-400, -400, W + 800, 2000), { wash: BG.nightHi, ink: null });
  paint(ellPts(540, 1500, 1200, 700, 30), { fill: BG.nightLo, fillOp: 200, bleed: .3, tex: .4, border: .2, ink: null });
  boilSeed('kstars');
  for (let i = 0; i < 26; i++) {
    const x = -300 + hash(i * 2.3) * 1680, y = 300 + hash(i * 6.7) * 900, s = 3 + 5 * hash(i * 3.3) * (.6 + .4 * Math.sin(t * 2 + i));
    paint(starPts(x, y, s, .4, 4), { wash: '#FFF6DA', ink: null });
  }
  boilSeed('kpeak');
  paint([[-400, 1500], [-60, 1160], [120, 1000], [230, 900], [330, 960], [480, 1180], [560, 1250], [700, 1150], [860, 1020], [950, 1070], [1480, 1500]], { wash: BG.snow, fill: BG.snowDk, fillOp: 60, tex: .4, ink: BG.ink, sw: 1.2, curv: .2 });
  paint([[230, 900], [290, 1060], [250, 1200], [330, 1500], [-400, 1500], [-60, 1160], [120, 1000]], { wash: BG.snowDk, washOp: 200, ink: null, curv: .2 });
  paint([[860, 1020], [900, 1150], [870, 1300], [920, 1500], [1480, 1500], [950, 1070]], { wash: BG.snowDk, washOp: 200, ink: null, curv: .2 });
  boilSeed('kledge');
  paint([[-400, 1640], [160, 1600], [540, 1620], [920, 1590], [1480, 1640], [1480, 2600], [-400, 2600]], { wash: BG.rock, fill: BG.rockDk, fillOp: 60, tex: .5, ink: BG.ink, sw: 1.2, curv: .5 });
  paint(ellPts(540, 1700, 520, 70, 20), { wash: '#F0EEF4', washOp: 120, ink: null });   // snow on the ledge
}
// a room at home, evening: a warm wall, a window with lamp-light, a floor, a low divan
function home(t) {
  boilSeed('hwall');
  paint(rectPts(-300, -300, W + 600, 1900), { wash: BG.wall, ink: null });
  paint(ellPts(540, 1100, 800, 700, 26), { fill: BG.wallDk, fillOp: 60, bleed: .3, tex: .5, ink: null });
  boilSeed('hwin');
  paint(rectPts(700, 640, 330, 400, 3), { wash: BG.window, ink: BG.ink, sw: 1.4 });
  glow(865, 840, 260, '#FFC07A', .45);
  inkLine([[865, 640], [865, 1040]], 3, BG.ink, 'ink', 0); inkLine([[700, 840], [1030, 840]], 3, BG.ink, 'ink', 0);
  paint(rectPts(680, 1030, 370, 26, 2), { wash: BG.wallDk, ink: BG.ink, sw: 1 });
  boilSeed('hfloor');
  paint(rectPts(-300, 1580, W + 600, 1000), { wash: BG.floor, fill: BG.floorDk, fillOp: 50, tex: .4, ink: null });
  inkLine([[-300, 1582], [1400, 1582]], 1.2, BG.ink, 'ink', 0);
}

// ---------- props ----------
// a big monsoon cloud centred on (x, y), w wide, in Krishna's blue; k 0..1 grows it in
function rainCloud(x, y, w, k = 1, key = 'rcloud') {
  if (k <= 0) return;
  boilSeed(key);
  const s = w * k;
  for (const [dx, dy, r] of [[-.42, .05, .3], [.4, .06, .32], [-.12, -.18, .38], [.2, -.12, .34], [0, .12, .46]])
    paint(ellPts(x + dx * s, y + dy * s, r * s, r * s * .78, 18, s * .01), { wash: BG.cloud, fill: BG.cloudDk, fillOp: 60, tex: .5, ink: BG.ink, sw: 1 });
  paint(ellPts(x - .2 * s, y - .2 * s, .2 * s, .1 * s, 12), { wash: BG.cloudLt, washOp: 200, ink: null });
  paint(ellPts(x, y + .26 * s, .5 * s, .1 * s, 14), { fill: BG.cloudDk, fillOp: 90, bleed: .2, tex: .4, ink: null });
}
// a screen-space wipe of monsoon cloud: p 0 → .5 the cloud rolls in from the right and covers, .5 → 1 it rolls off left
function cloudWipe(p, key = 'cwipe') {
  if (p <= 0 || p >= 1) return;
  boilSeed(key);
  const off = lerp(1500, -1500, p);
  for (let i = 0; i < 16; i++) {
    const x = (i % 4) * 330 + hash(i * 2.1) * 120 + off - 60, y = Math.floor(i / 4) * 520 + hash(i * 3.9) * 140 + 80, r = 420 + 120 * hash(i * 5.5);
    paint(ellPts(x, y, r, r * .8, 20, 10), { wash: i % 3 ? BG.cloud : BG.cloudDk, ink: null });
  }
}
// a blue lotus (nilotpala) at (0, 0) on its stem, s its size: open 0..1, stem false for a floating flower
function blueLotus(s, sw, open = 1, stem = true) {
  if (stem) inkLine([[.1 * s, 2.6 * s], [-.1 * s, 1.1 * s], [0, -.6 * s]], sw * 1.6, BG.stem, 'ink', .5);
  const petal = (a, len, w, c) => { push(); translate(0, -.8 * s); rotate(a); paint([[0, 0], [w * s, -len * .45 * s], [0, -len * s], [-w * s, -len * .45 * s]], { wash: c, ink: BG.ink, sw: sw * .5, curv: .5 }); pop(); };
  const sp = lerp(.15, 1, clamp(open));
  for (const k of [-1.45, 1.45, -1.05, 1.05]) petal(k * sp, 1.9, .5, BG.lotusDk);
  for (const k of [-.55, .55]) petal(k * sp, 2.3, .55, BG.lotus);
  petal(0, 2.45, .55, BG.lotusLt);
  paint(ellPts(0, -.95 * s, .38 * s, .22 * s, 10), { wash: BG.seed, ink: BG.ink, sw: sw * .4 });
}
// a clay bowl of paint at (x, y), s wide, the paint's colour c
function paintBowl(x, y, s, c, key = 'pbowl') {
  boilSeed(key);
  paint([[x - s, y - s * .2], [x + s, y - s * .2], [x + s * .7, y + s * .45], [x - s * .7, y + s * .45]], { wash: BG.bowl, fill: BG.bowlDk, fillOp: 50, tex: .4, ink: BG.ink, sw: 1.2, curv: .5 });
  paint(ellPts(x, y - s * .2, s, s * .22, 18), { wash: BG.bowlDk, ink: BG.ink, sw: 1 });
  paint(ellPts(x, y - s * .18, s * .86, s * .16, 18), { wash: c, ink: null });
}
// a paintbrush whose tip is at (x, y), handle angled up-right by a (radians), loaded with c (null: dry)
function paintBrush(x, y, a, c, key = 'brush') {
  boilSeed(key);
  push(); translate(x, y); rotate(a);
  paint(ribbon([[0, 0], [26, 0], [60, 0]], 2, 26), { wash: c || '#E8D8B8', ink: BG.ink, sw: 1, curv: .5 });   // the bristles
  paint(rectPts(58, -14, 46, 28, 1), { wash: BG.ferrule, ink: BG.ink, sw: 1 });
  paint(ribbon([[102, 0], [300, 0], [520, 0]], 20, 13), { wash: BG.wood, fill: BG.woodDk, fillOp: 50, tex: .4, ink: BG.ink, sw: 1.1 });
  pop();
}
// a brush stroke along pts, drawn to k 0..1 of its length, w wide, colour c
function brushStroke(pts, k, w, c, key = 'stroke', op = 230) {
  if (k <= 0) return null;
  const P = through(pts), n = Math.max(2, Math.round(P.length * clamp(k)));
  boilSeed(key);
  const S = P.slice(0, n);
  if (S.length < 2) return null;
  const tw = S.map((p, i) => [p[0], p[1] + w * .08 * Math.sin(i * .7)]);
  paint(ribbon(tw, w * .35, w), { fill: c, fillOp: op, bleed: .12, tex: .7, border: .4, ink: null });
  paint(ribbon(tw, w * .25, w * .7), { fill: mixCol(c, BG.ink, .15), fillOp: 90, bleed: .15, tex: .8, border: .5, ink: null });
  return S[S.length - 1];
}
// a bowl of Halahala at (0, 0) (arm space, upright): dark violet poison and its fumes
function poisonBowl(u, sw, t, fume = 1) {
  paint([[-1.5 * u, -.5 * u], [1.5 * u, -.5 * u], [1.1 * u, .45 * u], [-1.1 * u, .45 * u]], { wash: '#8A8A9E', fill: '#5E5E74', fillOp: 60, tex: .4, ink: BG.ink, sw: sw * .7, curv: .5 });
  paint(ellPts(0, -.5 * u, 1.5 * u, .32 * u, 16), { wash: BG.poisonDk, ink: BG.ink, sw: sw * .6 });
  paint(ellPts(.2 * u, -.52 * u, .9 * u, .16 * u, 12), { wash: BG.poison, ink: null });
  if (fume > .02) for (let i = 0; i < 3; i++) {
    const ph = frac(t * .45 + i / 3), x = (i - 1) * .6 * u + .5 * u * Math.sin(t * 2 + i * 2), y = -.8 * u - ph * 3.4 * u;
    paint(ellPts(x, y, (.4 + .5 * ph) * u, (.3 + .35 * ph) * u, 12, .05 * u), { fill: BG.fume, fillOp: 150 * (1 - ph) * fume, bleed: .25, tex: .4, ink: null });
  }
}
// the child's drawing: a sheet in body space centred (cx, cy), w × h, a little Krishna on it coloured to k 0..1
function drawingBoard(cx, cy, w, h, k, sw) {
  paint(rectPts(cx - w / 2, cy - h / 2, w, h, 1), { wash: BG.board, ink: BG.ink, sw: sw * .9 });
  const s = h * .085, x = cx - w * .05, y = cy + h * .32;
  // pencil doodle: a head, a body, a feather, stick legs
  const blue = mixCol(BG.board, BG.crayon, k);
  paint(ellPts(x, y - 6.2 * s, 1.6 * s, 1.5 * s, 14), { wash: blue, ink: BG.ink, sw: sw * .5 });
  paint([[x - 1.3 * s, y - 4.6 * s], [x + 1.3 * s, y - 4.6 * s], [x + 1.6 * s, y - 1.6 * s], [x - 1.6 * s, y - 1.6 * s]], { wash: '#F7C948', ink: BG.ink, sw: sw * .5 });
  for (const q of [-1, 1]) inkLine([[x + q * .6 * s, y - 1.6 * s], [x + q * .7 * s, y]], sw * .6, k > .5 ? BG.crayon : BG.ink, 'ink', 0);
  for (const q of [-1, 1]) inkLine([[x + q * 1.3 * s, y - 4.2 * s], [x + q * 2.3 * s, y - 2.8 * s]], sw * .6, k > .7 ? BG.crayon : BG.ink, 'ink', 0);
  inkLine([[x + .6 * s, y - 7.4 * s], [x + 1.4 * s, y - 9.2 * s]], sw * 1.2, '#4FA25A', 'ink', 0);
  paint(ellPts(x + 1.45 * s, y - 9.3 * s, .4 * s, .5 * s, 8), { wash: '#2A6E40', ink: null });
  // crayon scribble marks past the lines (a child's colouring)
  if (k > .1) for (let i = 0; i < Math.round(6 * k); i++) inkLine([[x - 1.5 * s + i * .5 * s, y - 7.3 * s], [x - 1.1 * s + i * .45 * s, y - 5.1 * s]], sw * .6, BG.crayon, 'dry', 0);
}
// a devotee's forearm and hand from off-screen bottom-right to hp, with a red thread at the wrist
function devoteeArm(hp, from = [1180, 2100], key = 'darm') {
  boilSeed(key);
  paint(ribbon([from, [lerp(from[0], hp[0], .55) + 30, lerp(from[1], hp[1], .55) + 30], hp], 110, 80), { wash: BG.skin, fill: BG.skinDk, fillOp: 40, tex: .4, ink: BG.ink, sw: 1.2 });
  inkLine([[lerp(from[0], hp[0], .7) + 20, lerp(from[1], hp[1], .7) + 20], [lerp(from[0], hp[0], .7) + 50, lerp(from[1], hp[1], .7) - 20]], 5, '#D8283A', 'ink', 0);
  paint(ellPts(hp[0], hp[1], 34, 28, 12), { wash: BG.skin, ink: BG.ink, sw: 1 });
}

// ---------- the card: the 15K Family Deal (as ad 29) ----------
function dealCard(t, C) {
  boilSeed('cardbg');
  paint(rectPts(-60, -60, W + 120, H + 120), { wash: TK.peach, ink: null });
  boilSeed('cardpetals');
  for (let i = 0; i < 9; i++) {
    const x = 60 + hash(i * 3.3) * 960 + 30 * Math.sin(t * .9 + i), y = frac(hash(i * 7.1) + t * (.035 + .02 * hash(i))) * (H + 80) - 40, r = t * .8 + i;
    paint([[x + Math.cos(r) * 15, y + Math.sin(r) * 15], [x + Math.cos(r + 1.6) * 7, y + Math.sin(r + 1.6) * 7], [x - Math.cos(r) * 15, y - Math.sin(r) * 15], [x + Math.cos(r - 1.6) * 7, y + Math.sin(r - 1.6) * 7]], { wash: i % 2 ? TK.marigold : TK.petal, washOp: 200, ink: null, curv: .5 });
  }
  const X = 470, pk = t0 => Math.max(0, t - t0) * 5, br = Math.sin(t * 1.3) * .008;
  if (t > C.logo) picture(PICS.logo, X, 500, 118, 118, { pop: pk(C.logo) });
  if (t > C.cap) {
    letter('15K FAMILY DEAL', X, 618, 74, TK.teal, { screen: true, font: '74px Marcellus', ink: false, pop: pk(C.cap), maxW: 860 });
    letter('our thank-you to all of YOU', X, 688, 34, TK.grey, { screen: true, font: '500 34px Poppins', ink: false, pop: pk(C.cap + .15), maxW: 860 });
  }
  if (t > C.covers) [['book1', -1], ['book3', 1], ['book2', 0]].forEach(([b, i], j) => {
    const a = Math.max(0, t - C.covers - j * .12);
    if (a > 0) picture(PICS[b], X + i * 205, 905 + Math.abs(i) * 28, 250, 250, { rot: i * .1 + br, pop: a * 5, r: 10, shadow: 22 });
  });
  if (t > C.price) {
    letter('Books 1–3 · Set of 3', X, 1112, 40, TK.brown, { screen: true, font: '700 40px Poppins', ink: false, maxW: 880, pop: pk(C.price) });
    letter('₹500', X - 120, 1186, 56, TK.grey, { screen: true, font: '500 56px Poppins', ink: false, pop: pk(C.price) });
    const k = backOut(clamp(pk(C.strike - .1) * .7));
    if (t > C.strike) letter('₹350', X + 95, 1182, 88 * (1 + .04 * pulse(t, 4)), TK.rkOrange, { screen: true, font: `700 ${88 * k}px Poppins`, ink: false, pop: pk(C.strike) });
  }
  if (t > C.dead) letter('Only till 25 Oct, midnight', X, 1262, 40, TK.teal, { screen: true, font: '700 40px Poppins', ink: false, maxW: 860, pop: pk(C.dead) });
  if (t > C.pill) {
    const k = backOut(clamp(pk(C.pill))) * (1 + .03 * pulse(t, 4));
    boilSeed('pill');
    push(); translate(X, 1350); scale(k); paint(rrPts(-270, -48, 540, 96, 48), { wash: TK.rkOrange, ink: null }); pop();
    letter('Comment FAMILY', X, 1352, 54, TK.cream, { screen: true, font: '700 52px Poppins', ink: false, pop: pk(C.pill) });
  }
  if (t > C.sub) letter("we'll DM you the deal · or tap the link in bio", X, 1428, 31, TK.brown, { screen: true, font: '500 31px Poppins', ink: false, maxW: 860, pop: pk(C.sub) });
  if (t > C.follow) letter('Follow @therishikatha', X, 1478, 31, TK.grey, { screen: true, font: '700 31px Poppins', ink: false, maxW: 860, pop: pk(C.follow) });
}
function dealStrike(t, C) {
  if (t < C.strike) return;
  const k = easeOut(seg(t, C.strike, C.strike + .25));
  boilSeed('strike');
  inkLine([[470 - 185, 1196], [lerp(470 - 185, 470 - 55, k), lerp(1196, 1172, k)]], 6, TK.rkOrange, 'ink', 0);
}
