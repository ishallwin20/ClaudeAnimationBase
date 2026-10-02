// aparna_props.js: the sets and props for "Bappa can't wait 3 seconds for a modak. His mother waited 3,000 years."
// (src/scenes/aparna.js). Loaded before it; everything here is a pure function of its arguments (and T for boil).
//
//   Copied from ad 4 (snake_props.js): TK, tkTone, GROUND, tkSky, kailash, tkGround, stars, snowfall, sparkStar, smoke, endCard
//   AP                                          the palette of this reel
//   cloudPts(cx, cy, rx, ry)                    a thought-cloud outline (a scalloped ellipse)
//   garland(a, b, sag, key)                     a marigold garland between two hands (b = null: hanging from one hand)
//   snowPeaks(S), seatRock(x, y, w, h, key)     Kailash for the princess scene; a flat rock
//   leafPlate(x, y, w, key)                     the round patravali on its rock; foodItem(kind, x, y, s, key)
//   bilvaLeaf(x, y, s, rot, o)                  a three-lobed bilva leaf (dry or green)
//   vanishPuff(x, y, s, age)                    the puff where an item leaves the plate
//   SEA, seasonAt(name | [a, b, k])             the clearing's season states; clearing(t, S) / clearingFx(t, S) paint them
//   lingam(x, y, s, snow)                       a small stone Shiva lingam; snowCaps(x, y, u, k) snow on shoulders
//   stranger(x, y, u, o)                        the hooded stranger (clues: tail, glint); ashPoof(x, y, s, age); shawlFly(...)
//   parvatiStripped(x, y, u, o, hide)           parvati() with her mukut / jhumkas / nath / bangles left off
//   jewel helpers                               mukutAt, jhumkaAt, bangleAt
//   fallingPetals, whipH, sparkleBurst, cloudBurst
const TK = {
  ink: '#2B2233', cream: '#FFF5E2',
  night: '#1C2150', nightLt: '#36407E', mtn: '#3E4A88', mtnDk: '#2C3466', snow: '#E4ECF8', snowDk: '#A9B8D8', rock: '#56618E',
  plum: '#24163A', plumLt: '#3E2558', red: '#7A1420', redLt: '#C2362E',
  spring: '#F7B9C4', springLt: '#FFE1B8', meadow: '#A8D38C', meadowDk: '#7FB06A',
  petal: '#F4A6B8', petalDk: '#E0708C', white: '#FFF5E2', marigold: '#F39A2E', yellow: '#FFD45A', leaf: '#5E9A6A',
  fire: '#FF6A3D', fireDk: '#D2352A', fireLt: '#FFB347', core: '#FFF1C0', ash: '#8E8890', ashDk: '#5E5862', ashLt: '#BDB7BE',
  smoke: '#6E6878', gold: '#EDB43C', goldLt: '#FFE39A', goldDk: '#B67D1C', thali: '#E8B23C',
  rkOrange: '#F15A24', peach: '#FBE0CF', peachLt: '#FFF1E6', brown: '#3A2418', grey: '#6B5A50', teal: '#2E5F5A',
};
const tkTone = (c, S = {}) => mixCol(mixCol(mixCol(c, '#F6A8A0', (S.spring || 0) * .55), '#B8322A', (S.fire || 0) * .5), '#F2C48A', (S.dawn || 0) * .3);
const GROUND = 1450;   // the snow line in the wide set

// ---------- the sets ----------
function tkSky(S = {}) {
  boilSeed('tksky');
  const top = mixCol(mixCol(TK.night, '#E89AAE', (S.spring || 0) * .85), '#5A1420', (S.fire || 0) * .8);
  const low = mixCol(mixCol(TK.nightLt, TK.springLt, (S.spring || 0) * .9), '#C2362E', (S.fire || 0) * .8);
  paint(rectPts(-200, -200, W + 400, H + 400), { wash: top, ink: null });
  paint(ellPts(540, 1150, 1100, 520, 22), { wash: mixCol(top, low, .55), ink: null });
  paint(ellPts(540, 1250, 900, 260, 20), { wash: low, ink: null });
}
// Kailash: one great snow pyramid behind the stage, summit at (560, 300), with two shoulders of ridge.
function kailash(S = {}) {
  push(); translate(0, 115);
  const m = tkTone(TK.mtn, S), md = tkTone(TK.mtnDk, S), sn = tkTone(TK.snow, S), sd = tkTone(TK.snowDk, S);
  boilSeed('ridges');
  paint([[-200, 1340], [-120, 980], [60, 860], [200, 930], [330, 840], [420, 1000], [460, 1340]], { wash: mixCol(m, TK.night, .25), ink: null, curv: .1 });
  paint([[640, 1340], [700, 980], [820, 870], [940, 940], [1080, 820], [1260, 1000], [1300, 1340]], { wash: mixCol(m, TK.night, .25), ink: null, curv: .1 });
  boilSeed('kailash');
  paint([[60, 1340], [260, 900], [430, 520], [560, 300], [700, 520], [870, 900], [1040, 1340]], { wash: m, ink: null, curv: .05 });
  paint([[560, 300], [700, 520], [870, 900], [1040, 1340], [620, 1340], [600, 820]], { wash: md, ink: null, curv: .05 });
  boilSeed('kailashsnow');
  paint([[560, 300], [640, 420], [700, 520], [660, 560], [620, 520], [590, 600], [545, 540], [500, 610], [470, 540], [430, 520]], { wash: sn, ink: null, curv: .15 });
  inkLine([[430, 520], [500, 400], [560, 300], [630, 400], [700, 520]], 1.3, tkTone(TK.ink, S), 'ink', .1);
  pop();
}
// The snow underfoot. S.spring greens it into a meadow.
function tkGround(S = {}) {
  const c = mixCol(tkTone(TK.snow, { ...S, spring: 0 }), TK.meadow, (S.spring || 0) * .9), cd = mixCol(tkTone(TK.snowDk, { ...S, spring: 0 }), TK.meadowDk, (S.spring || 0) * .9);
  boilSeed('tkground');
  const top = []; for (let x = -200; x <= W + 200; x += 70) top.push([x, GROUND + 8 * Math.sin(x * .009) + 6 * Math.sin(x * .023)]);
  paint([...top, [W + 200, H + 200], [-200, H + 200]], { wash: c, ink: null });
  inkLine(top.filter(p => p[0] > -80 && p[0] < W + 80), 1.2, tkTone(TK.rock, S), 'ink', .3);
  for (let i = 0; i < 9; i++) {
    boilSeed('tkdab' + i);
    paint(ellPts(60 + hash(i * 3.3) * 960, GROUND + 70 + 380 * hash(i * 7.1), 70 + 60 * hash(i), 9 + 6 * hash(i * 2), 12), { wash: cd, washOp: 170, ink: null });
  }
}
function stars(a, t, n = 18) {
  if (a <= .02) return;
  boilSeed('tkstars');
  for (let i = 0; i < n; i++) {
    const x = 40 + hash(i * 3.7) * (W - 80), y = 60 + hash(i * 9.1) * 760, tw = .6 + .4 * wob(t, .5 + hash(i), hash(i * 2));
    paint(starPts(x, y, (4 + 7 * hash(i * 5.3)) * tw, .35, 4), { wash: '#FFF1CF', washOp: 255 * a, ink: null });
  }
}
// Falling snow in screen space; a = opacity.
function snowfall(t, n = 14, a = 1) {
  if (a <= .02) return;
  boilSeed('tksnowfall');
  for (let i = 0; i < n; i++) {
    const x = W * frac(hash(i * 3.1) + .03 * Math.sin(t * .7 + i)), y = H * frac(hash(i * 7.7) + t * (.035 + .035 * hash(i * 1.3))), r = 3 + 4 * hash(i * 5.3);
    paint(ellPts(x, y, r, r, 8), { wash: TK.snow, washOp: 230 * a, ink: null });
  }
}
// The close-up's backdrop: deep plum night, warming to red (red 0..1) or to gold (gold 0..1), a halo behind the head.

// A four-point spark (a snap, a glint).
function sparkStar(x, y, r, key = 'spark', col = TK.goldLt) {
  if (r < 1) return;
  boilSeed(key);
  glow(x, y, r * 2.4, col, .8);
  paint(starPts(x, y, r, .22, 4), { wash: TK.cream, ink: null });
}

// A curl of smoke rising from (x, y): age seconds, a opacity.
function smoke(x, y, s, t, a = 1, key = 'smoke') {
  if (a <= .02) return;
  boilSeed(key);
  for (let i = 0; i < 6; i++) {
    const k = frac(t * .45 + i / 6), px = x + Math.sin(k * 5 + i) * s * .35 * k, py = y - k * s * 2.6, r = s * (.18 + .35 * k);
    paint(ellPts(px, py, r, r * .85, 12, 2), { wash: TK.smoke, washOp: 170 * a * (1 - k), ink: null });
  }
}
// Embers floating up from (x, y).


// ---------- the book card ----------
// The Rishi Katha end card (as in the Shailputri ad), with Book 2 in the centre: what Parvati did next.
// C = { book, fan, logo, series, sub, pill, follow } (times); centre / sides = PICS keys.
function endCard(t, C, centre = 'book2', sides = ['book1', 'book3']) {
  boilSeed('cardbg');
  paint(rectPts(-60, -60, W + 120, H + 120), { wash: TK.peach, ink: null });
  boilSeed('cardpetals');
  for (let i = 0; i < 9; i++) {
    const x = 60 + hash(i * 3.3) * 960 + 30 * Math.sin(t * .9 + i), y = frac(hash(i * 7.1) + t * (.035 + .02 * hash(i))) * (H + 80) - 40, r = t * .8 + i;
    paint([[x + Math.cos(r) * 15, y + Math.sin(r) * 15], [x + Math.cos(r + 1.6) * 7, y + Math.sin(r + 1.6) * 7], [x - Math.cos(r) * 15, y - Math.sin(r) * 15], [x + Math.cos(r - 1.6) * 7, y + Math.sin(r - 1.6) * 7]], { wash: i % 2 ? TK.marigold : TK.petal, washOp: 200, ink: null, curv: .5 });
  }
  const X = 508, BY = 872, fan = backOut(seg(t, C.fan, C.fan + .45)), br = Math.sin(t * 1.3) * .008;
  const pk = t0 => Math.max(0, t - t0) * 5;
  if (t > C.fan - .02) {
    picture(PICS[sides[0]], lerp(X, 300, fan), BY + 6, 400, 400, { rot: -.12 * fan + br, r: 10, shadow: 22 });
    picture(PICS[sides[1]], lerp(X, 716, fan), BY + 6, 400, 400, { rot: .12 * fan - br, r: 10, shadow: 22 });
  }
  if (t > C.book) picture(PICS[centre], X, BY, 470, 470, { rot: -br * .5, pop: pk(C.book), r: 10, shadow: 28 });
  if (t > C.logo) picture(PICS.logo, X, 512, 170, 170, { pop: pk(C.logo) });
  if (t > C.series) letter('The Navadurga Series', X, 1180, 78, TK.teal, { screen: true, font: '78px Marcellus', ink: false, pop: pk(C.series) });
  if (t > C.sub) letter('Picture books · Ages 4–8 · Set of 3 for ₹600', X, 1252, 38, TK.brown, { screen: true, font: '500 38px Poppins', ink: false, maxW: 820, pop: pk(C.sub) });
  if (t > C.pill) {
    const k = backOut(clamp(pk(C.pill))) * (1 + .03 * pulse(t, 4));
    boilSeed('pill');
    push(); translate(X, 1352); scale(k); paint(rrPts(-220, -46, 440, 92, 45), { wash: TK.rkOrange, ink: null }); pop();
    letter('rishikatha.com', X, 1354, 52, TK.cream, { screen: true, font: '700 52px Poppins', ink: false, pop: pk(C.pill) });
  }
  if (t > C.follow) letter("Follow @therishikatha for more Navratri stories", X, 1444, 38, TK.grey, { screen: true, font: '500 38px Poppins', ink: false, maxW: 820, pop: pk(C.follow) });
}


// ================= new for the Aparna reel =================
const AP = {
  ink: '#4A2530', peach: '#F6D8C0', peachLt: '#FFEBD9', peachDk: '#E4B896',
  snowSky: '#CFE1F2', snowSkyLt: '#EEF5FB', peak: '#BACBE3', peakDk: '#9DB2D3', snowW: '#F6FAFD', snowLine: '#8FA5C6',
  rockC: '#9A97B0', rockDk: '#6F6C8A', rockLt: '#C0BED2',
  gold: '#EDB43C', goldLt: '#FFE39A', goldDk: '#B67D1C', leafGold: '#B9C46A', marigold: '#F39A2E', marigoldDk: '#E26B1F',
  leaf: '#5E9A4A', leafDk: '#3E6E38', leafLt: '#8DBB5A', saffron: '#E8873A', saffronDk: '#C5652A',
  dry: '#B98A3E', dryDk: '#8A5E26', dryLt: '#D8B466',
  shawl: '#C2A25E', shawlDk: '#8A6C32', shawlLt: '#DCC384', bamboo: '#B3A55A', bambooDk: '#80733A',
  snake: '#6DB08F', snakeDk: '#437E66', ash: '#8E8890', ashLt: '#C9C3CA', ashDk: '#6E6878',
};

// A thought-cloud outline: a scalloped ellipse (8 lobes).
function cloudPts(cx, cy, rx, ry, n = 96, lobes = 8) {
  const p = []; for (let i = 0; i < n; i++) { const a = i / n * TAU, r = .8 + .24 * Math.abs(Math.sin(a * lobes / 2)); p.push([cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r]); } return p;
}
// A pointed leaf outline centred at (cx, cy), len along its axis, wid across, rot in radians.
function leafPts(cx, cy, len, wid, rot = 0, curl = 0) {
  const top = [], bot = [], c = Math.cos(rot), s = Math.sin(rot);
  for (let k = 0; k <= 7; k++) { const q = -1 + 2 * k / 7, w = wid / 2 * Math.pow(Math.max(0, 1 - q * q), .75), b = curl * len * .12 * (1 - q * q); top.push([q * len / 2, -w + b]); bot.unshift([q * len / 2, w + b]); }
  return [...top, ...bot].map(([a, b]) => [cx + a * c - b * s, cy + a * s + b * c]);
}

// ---------- marigold garland ----------
// Between two hands a and b (world points) it sags by `sag` px; with b = null it hangs from a as a drooping loop of
// height `sag`. Flowers are small outlined blobs on a thread.
function garland(a, b, sag, key = 'garl', fr = 15) {
  const pts = [];
  if (b) for (let i = 0; i <= 20; i++) { const k = i / 20; pts.push([lerp(a[0], b[0], k), lerp(a[1], b[1], k) + sag * 4 * k * (1 - k)]); }
  else for (let i = 0; i <= 24; i++) { const th = -Math.PI / 2 + i / 24 * TAU; pts.push([a[0] + Math.cos(th) * sag * .24, a[1] + sag * .5 + Math.sin(th) * sag * .5]); }
  boilSeed(key + 'thread');
  inkLine(pts, 1.6, '#6E7B3A', 'ink', .3);
  let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  const n = b ? Math.max(7, Math.round(L / (fr * 1.6))) : 15;
  for (let i = 0; i < n; i++) {
    const p = pts[Math.round((b ? (i + .5) / n : (i + .5) / n) * (pts.length - 1))];
    boilSeed(key + 'f' + i);
    paint(starPts(p[0], p[1], fr * (.9 + .15 * hash(i * 2.3)), .8, 9, hash(i) * 3), { wash: i % 2 ? AP.marigold : '#F7B845', fill: AP.marigoldDk, fillOp: 70, tex: .4, ink: AP.ink, sw: .6, curv: .5 });
    paint(ellPts(p[0], p[1], fr * .32, fr * .32, 8), { wash: AP.marigoldDk, ink: null });
  }
}

// ---------- Kailash for the princess scene: pale snow-blue, a few soft peaks low behind ----------
function snowPeaks(t = 0) {
  boilSeed('kbsky');
  paint(rectPts(-200, -200, W + 400, H + 400), { wash: AP.snowSky, ink: null });
  paint(ellPts(540, 1250, 1300, 640, 26), { wash: AP.snowSkyLt, ink: null });
  boilSeed('kbfar');
  paint([[-200, 1300], [-120, 1040], [90, 920], [250, 1030], [380, 960], [520, 1130], [560, 1300]], { wash: AP.peak, ink: null, curv: .12 });
  paint([[640, 1300], [760, 1010], [900, 880], [1010, 960], [1130, 900], [1280, 1060], [1300, 1300]], { wash: AP.peak, ink: null, curv: .12 });
  boilSeed('kbnear');
  paint([[160, 1330], [400, 1070], [640, 800], [780, 1000], [920, 1330]], { wash: AP.peakDk, ink: null, curv: .1 });
  paint([[640, 800], [780, 1000], [920, 1330], [700, 1330], [660, 1060]], { wash: mixCol(AP.peakDk, '#7C93BC', .5), ink: null, curv: .1 });
  boilSeed('kbcap');
  paint([[640, 800], [700, 880], [740, 940], [700, 960], [660, 925], [630, 985], [590, 930], [545, 975], [520, 930], [575, 870]], { wash: AP.snowW, ink: null, curv: .2 });
  paint([[880, 905], [932, 940], [1000, 965], [950, 985], [900, 960], [860, 990], [840, 940]], { wash: AP.snowW, ink: null, curv: .2 });
  paint([[120, 925], [90, 940], [60, 1010], [110, 995], [160, 1015], [170, 960]], { wash: AP.snowW, ink: null, curv: .2 });
  boilSeed('kbgnd');
  const top = []; for (let x = -200; x <= W + 200; x += 70) top.push([x, 1450 + 7 * Math.sin(x * .009) + 5 * Math.sin(x * .023)]);
  paint([...top, [W + 200, H + 200], [-200, H + 200]], { wash: '#EAF1F8', fill: '#C7D6EA', fillOp: 60, bleed: .1, tex: .5, ink: null });
  inkLine(top.filter(p => p[0] > -80 && p[0] < W + 80), 1.1, AP.snowLine, 'ink', .3);
  for (let i = 0; i < 8; i++) { boilSeed('kbdab' + i); paint(ellPts(60 + hash(i * 3.3) * 960, 1520 + 330 * hash(i * 7.1), 70 + 60 * hash(i), 9 + 6 * hash(i * 2), 12), { wash: '#C3D3E8', washOp: 150, ink: null }); }
}
// A flat rock: (x, y) is the centre of its top face, w wide, h tall. snow 0..1 dusts the top.
function seatRock(x, y, w, h, key = 'rock', snow = 0, topRy = h * .2) {
  boilSeed(key + 'sh'); paint(ellPts(x + 6, y + h * .98, w * .58, h * .16, 18), { fill: AP.ink, fillOp: 70, bleed: .25, tex: .3, border: .1, ink: null });
  boilSeed(key + 'body');
  paint([[x - w * .5, y + h * .05], [x - w * .47, y + h * .6], [x - w * .32, y + h * .96], [x + w * .3, y + h], [x + w * .47, y + h * .62], [x + w * .5, y + h * .05]],
    { wash: AP.rockC, fill: AP.rockDk, fillOp: 90, bleed: .08, tex: .7, border: .5, ink: AP.ink, sw: 1.1, curv: .3 });
  boilSeed(key + 'top');
  paint(ellPts(x, y + h * .04, w * .5, topRy, 24, 1), { wash: AP.rockLt, fill: AP.rockC, fillOp: 70, tex: .5, ink: AP.ink, sw: 1 });
  if (snow > .02) paint(ellPts(x, y, w * .44 * snow, topRy * .75 * snow, 20, 1), { wash: AP.snowW, ink: AP.snowLine, sw: .7 });
}

// ---------- the leaf plate and its food ----------
// A round patravali (stitched leaves) seen from a little above; (x, y) is its centre, w its width.
function leafPlate(x, y, w, key = 'plate') {
  const h = w * .36, TAN = '#C9AE72', TANLT = '#D9C28C', TANDK = '#9C8048';   // a dry sal-leaf patravali
  boilSeed(key + 'sh'); paint(ellPts(x + 8, y + h * .5, w * .53, h * .56, 22), { fill: AP.ink, fillOp: 70, bleed: .25, tex: .3, border: .1, ink: null });
  boilSeed(key + 'rimA');
  for (let i = 0; i < 18; i++) {
    const a = i / 18 * TAU + .1, px = x + Math.cos(a) * w * .47, py = y + Math.sin(a) * h * .47, rot = Math.atan2(Math.sin(a) * h, Math.cos(a) * w * .98);
    paint(leafPts(px, py, w * .2, w * .105, rot), { wash: i % 2 ? TAN : TANLT, fill: TANDK, fillOp: 70, tex: .5, ink: AP.ink, sw: .8 });
  }
  boilSeed(key + 'disc');
  paint(ellPts(x, y, w * .43, h * .43, 28, 1), { wash: TAN, fill: TANDK, fillOp: 60, bleed: .12, tex: .6, ink: AP.ink, sw: .9 });
  boilSeed(key + 'stitch');
  for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI; inkLine([[x - Math.cos(a) * w * .36, y - Math.sin(a) * h * .36], [x + Math.cos(a) * w * .36, y + Math.sin(a) * h * .36]], 1, TANDK, 'inkfine', 0); }
}
// A three-lobed bilva leaf: a big middle leaflet and two side ones, a short stem. s is the middle leaflet's length;
// dry = 1 for the brown-gold fallen leaf, 0 for a fresh green one. (x, y) is the junction of the three.
function bilvaLeaf(x, y, s, rot = 0, o = {}) {
  const dry = o.dry ?? 1, c = mixCol('#6BA450', AP.dry, dry), cd = mixCol('#3E7036', AP.dryDk, dry), cl = mixCol('#9CCB70', AP.dryLt, dry), key = o.key || 'bilva', sw = clamp(s / 55, .5, 1.9);
  push(); translate(x, y); rotate(rot);
  boilSeed(key + 'stem'); inkLine([[0, s * .5], [0, s * .08]], sw * 1.6, cd, 'ink', .2);
  const leaflet = (ang, len, wid, k) => {
    const dx = Math.sin(ang) * len * .5, dy = -Math.cos(ang) * len * .5;
    boilSeed(key + 'l' + k);
    paint(leafPts(dx, dy, len, wid, ang - Math.PI / 2, dry * .6), { wash: c, fill: cd, fillOp: 70, tex: .6, ink: AP.ink, sw });
    inkLine([[0, 0], [dx * 1.85, dy * 1.85]], sw * .55, cd, 'inkfine', 0);
    for (const f of [.4, .65]) { const mx = dx * 2 * f, my = dy * 2 * f; for (const sd of [-1, 1]) inkLine([[mx, my], [mx + Math.cos(ang) * sd * wid * .28 + Math.sin(ang) * len * .1, my + Math.sin(ang) * sd * wid * .28 - Math.cos(ang) * len * .1]], sw * .35, cd, 'inkfine', 0); }
    paint(ellPts(dx * .8, dy * .8 - len * .05, len * .12, wid * .1, 8, 0, ang - Math.PI / 2), { wash: cl, washOp: 120, ink: null });
  };
  leaflet(-1.1, s * .74, s * .31, 'a'); leaflet(1.1, s * .74, s * .31, 'b'); leaflet(0, s, s * .4, 'c');
  pop();
}
// One item for the plate: mango, banana, pomegranate, marigold, green0..2 (amaranth, spinach, a pale green), bilva (dry).
// (x, y) its centre, s about its diameter.
function foodItem(kind, x, y, s, key = 'food', rot = 0) {
  boilSeed(key + kind);
  const sw = clamp(s / 60, .45, 1.2);
  push(); translate(x, y); rotate(rot);
  switch (kind) {
    case 'mango':
      paint(leafPts(-.32 * s, -.46 * s, .5 * s, .22 * s, -.5), { wash: AP.leaf, ink: AP.ink, sw: sw * .8 });
      inkLine([[-.05 * s, -.34 * s], [-.12 * s, -.5 * s]], sw * 1.2, AP.dryDk, 'ink', 0);
      paint(ellPts(0, 0, .52 * s, .4 * s, 22, 1, -.4), { wash: '#F4B63C', fill: '#E8663A', fillOp: 110, bleed: .15, tex: .6, border: .6, ink: AP.ink, sw });
      paint(ellPts(-.16 * s, -.1 * s, .14 * s, .08 * s, 10, 0, -.6), { wash: '#FFE59A', washOp: 190, ink: null });
      break;
    case 'banana': {
      const arc = []; for (let i = 0; i <= 8; i++) { const a = Math.PI * (.12 + .76 * i / 8); arc.push([Math.cos(a) * .55 * s, -Math.sin(a) * .2 * s + .06 * s]); }
      paint(ribbon(arc.map(p => [p[0], -p[1] + .04 * s]), .26 * s, .12 * s), { wash: '#F7D54F', fill: '#E3A82A', fillOp: 90, tex: .5, ink: AP.ink, sw });
      paint(ellPts(arc[0][0] - .02 * s, -arc[0][1] + .04 * s, .05 * s, .05 * s, 8), { wash: AP.dryDk, ink: null });
      paint(ellPts(arc[8][0] + .02 * s, -arc[8][1] + .04 * s, .05 * s, .05 * s, 8), { wash: AP.dryDk, ink: null });
      inkLine(arc.slice(1, 8).map(p => [p[0], -p[1] + .06 * s]), sw * .5, '#C8921F', 'inkfine', .5);
      break; }
    case 'pomegranate':
      paint(ellPts(0, 0, .42 * s, .4 * s, 24, 1), { wash: '#C7303E', fill: '#8E1E2E', fillOp: 90, bleed: .12, tex: .6, border: .6, ink: AP.ink, sw });
      paint([[-.14 * s, -.36 * s], [-.1 * s, -.52 * s], [-.03 * s, -.42 * s], [0, -.56 * s], [.04 * s, -.42 * s], [.1 * s, -.52 * s], [.14 * s, -.36 * s]], { wash: '#A82A36', ink: AP.ink, sw: sw * .7, curv: .2 });
      paint(ellPts(-.16 * s, -.12 * s, .1 * s, .07 * s, 10, 0, -.7), { wash: '#F08A8A', washOp: 170, ink: null });
      break;
    case 'marigold':
      paint(starPts(0, 0, .46 * s, .74, 14, .2), { wash: '#F5A02A', fill: AP.marigoldDk, fillOp: 70, tex: .5, ink: AP.ink, sw, curv: .5 });
      paint(starPts(0, 0, .3 * s, .78, 11, .5), { wash: '#F7B845', ink: null, curv: .5 });
      paint(ellPts(0, 0, .13 * s, .13 * s, 10), { wash: AP.marigoldDk, ink: null });
      break;
    case 'green0': case 'green1': case 'green2': {
      const g = { green0: ['#5E9A4A', '#B2476A'], green1: ['#4E8C47', '#2E5E32'], green2: ['#86B85A', '#4E8C47'] }[kind];
      paint(leafPts(0, 0, .95 * s, .6 * s, -.3, .3), { wash: g[0], fill: g[1], fillOp: kind === 'green0' ? 110 : 70, tex: .6, ink: AP.ink, sw });
      inkLine([[-.46 * s, .06 * s], [.4 * s, -.1 * s]], sw * .7, g[1], 'inkfine', .3);
      for (const f of [-.2, .05, .28]) for (const sd of [-1, 1]) inkLine([[f * s, -.02 * s], [(f + .12) * s, sd * .15 * s - .03 * s]], sw * .4, g[1], 'inkfine', 0);
      break; }
    case 'bilva': pop(); bilvaLeaf(x, y, s * .7, rot, { dry: 1, key: key + 'b' }); return;
  }
  pop();
}
// The puff where a food item leaves the plate: age in seconds, 0..0.6.
function vanishPuff(x, y, s, age, key = 'puff') {
  if (age < 0 || age > .6) return;
  const k = age / .6; boilSeed(key);
  glow(x, y, s * 1.7 * (1 - k * .4), '#FFE39A', .75 * (1 - k));
  for (let i = 0; i < 9; i++) {
    const a = i / 9 * TAU + hash(i) * .6, d = s * (.15 + .8 * easeOut(k)) * (.7 + .4 * hash(i * 3)), r = s * (.2 + .15 * hash(i * 1.7)) * (1 + .5 * k);
    paint(ellPts(x + Math.cos(a) * d, y + Math.sin(a) * d * .8 - k * s * .35, r, r * .9, 10, 1), { wash: i % 2 ? '#FFF3D6' : '#FFE08A', washOp: 235 * (1 - k * k), ink: null });
  }
  for (let i = 0; i < 4; i++) { const a = i / 4 * TAU + .6, d = s * (.5 + .9 * easeOut(k)); paint(starPts(x + Math.cos(a) * d, y + Math.sin(a) * d * .8 - k * s * .3, s * .15 * (1 - k), .3, 4), { wash: TK.cream, washOp: 255 * (1 - k), ink: null }); }
}
// A burst of sparkles round (x, y): age in seconds, life ~.7.
function sparkleBurst(x, y, s, age, key = 'burst', n = 8) {
  if (age < 0 || age > .8) return;
  const k = age / .8; boilSeed(key);
  glow(x, y, s * (1 + k), '#FFE39A', .6 * (1 - k));
  for (let i = 0; i < n; i++) { const a = i / n * TAU + hash(i) * .5, d = s * (.3 + 1.1 * easeOut(k)) * (.7 + .5 * hash(i * 2.1)); paint(starPts(x + Math.cos(a) * d, y + Math.sin(a) * d - k * s * .2, s * .22 * (1 - k * .8) * (.6 + hash(i * 5)), .3, 4), { wash: i % 2 ? TK.cream : TK.goldLt, ink: null }); }
}

// ---------- the clearing, in seasons ----------
const SEA = {
  summer: { top: '#F2C25E', low: '#FFE9A8', hill: '#C8B25C', gnd: '#D2BC72', gndDk: '#B89E55', tree: '#97A04E', treeDk: '#727C38', trunk: '#8A5E34', sun: 1, sunX: 820, sunY: 650, shim: 1, rain: 0, snow: 0, stars: 0, petals: 0, aura: '#FFD27A' },
  rains: { top: '#5F7E86', low: '#9DB8B8', hill: '#52736F', gnd: '#69957A', gndDk: '#4C775E', tree: '#3E6B58', treeDk: '#2C5244', trunk: '#4E4A3E', sun: 0, sunX: 820, sunY: 650, shim: 0, rain: 1, snow: 0, stars: 0, petals: 0, aura: '#FFD27A' },
  winter: { top: '#B9D3EC', low: '#E7F2FB', hill: '#95AECB', gnd: '#E9F0F8', gndDk: '#C3D3E6', tree: '#7E98B8', treeDk: '#667FA3', trunk: '#6A6270', sun: 0, sunX: 820, sunY: 650, shim: 0, rain: 0, snow: 1, stars: 0, petals: 0, aura: '#FFD27A' },
  night: { top: '#12163E', low: '#283270', hill: '#1B2354', gnd: '#222C62', gndDk: '#181F4C', tree: '#141A44', treeDk: '#0E1236', trunk: '#0E1230', sun: 0, sunX: 820, sunY: 650, shim: 0, rain: 0, snow: 0, stars: 1, petals: 0, aura: '#FFD27A' },
  dawn: { top: '#F5B968', low: '#FFE7A6', hill: '#D9A85A', gnd: '#E6C77E', gndDk: '#C9A55C', tree: '#A8A34E', treeDk: '#7F8438', trunk: '#8A5E34', sun: .9, sunX: 540, sunY: 1010, shim: 0, rain: 0, snow: 0, stars: 0, petals: 0, aura: '#FFD27A' },
  dusk: { top: '#6F5F9E', low: '#E0B8D6', hill: '#6A5A92', gnd: '#8E7DB0', gndDk: '#71609A', tree: '#54467F', treeDk: '#41356A', trunk: '#3A2E58', sun: 0, sunX: 820, sunY: 650, shim: 0, rain: 0, snow: 0, stars: 0, petals: 0, aura: '#FFD27A' },
  rose: { top: '#F2A0A6', low: '#FFE2BC', hill: '#D88F9A', gnd: '#E9B8A0', gndDk: '#CF9A88', tree: '#C88F90', treeDk: '#A87078', trunk: '#8A5E5A', sun: .5, sunX: 280, sunY: 800, shim: 0, rain: 0, snow: 0, stars: 0, petals: 1, aura: '#FFD27A' },
};
// A season state: a preset name (or a state), optionally cross-faded to another by k 0..1.
function seasonAt(a, b, k = 0) {
  const A = typeof a === 'string' ? SEA[a] : a, B = b == null ? A : typeof b === 'string' ? SEA[b] : b, S = {};
  for (const f in A) S[f] = typeof A[f] === 'string' ? mixCol(A[f], B[f], k) : lerp(A[f], B[f], k);
  return S;
}
// The clearing behind the characters (world space).
function clearing(t, S) {
  boilSeed('clsky');
  paint(rectPts(-300, -300, W + 600, H + 600), { wash: S.top, ink: null });
  paint(ellPts(540, 1000, 1300, 760, 28), { wash: mixCol(S.top, S.low, .5), ink: null });
  paint(ellPts(540, 1090, 1100, 400, 26), { wash: S.low, ink: null });
  if (S.sun > .02) {
    glow(S.sunX, S.sunY, 640 * S.sun, '#FFD680', .85 * S.sun);
    boilSeed('clsun'); paint(ellPts(S.sunX, S.sunY, 120 * S.sun + 20, 120 * S.sun + 20, 28), { wash: '#FFF1C2', washOp: 255, ink: null });
  }
  if (S.stars > .02) stars(S.stars, t, 28);
  boilSeed('clfar');
  for (let i = -1; i < 8; i++) { const x = i * 150 + 60 * hash(i * 3.1), h = 110 + 80 * hash(i * 1.7); paint(ellPts(x, 1090 - h * .25, 125 + 40 * hash(i), h, 14), { wash: S.hill, ink: null }); }
  paint(rectPts(-100, 1050, W + 200, 200), { wash: S.hill, ink: null });
  boilSeed('cltrees');
  for (let i = 0; i < 9; i++) {
    const x = 30 + i * 128 + 50 * hash(i * 7.3), h = 130 + 90 * hash(i * 2.9), y = 1110 - 20 * hash(i * 4.1);
    paint(rectPts(x - 7, y - 10, 14, 80), { wash: S.trunk, ink: null });
    paint(ellPts(x, y - h * .45, 95 + 30 * hash(i * 1.3), h * .62, 16, 2), { wash: i % 2 ? S.tree : S.treeDk, ink: null });
    if (S.snow > .05) paint(ellPts(x, y - h * .78, 70 + 22 * hash(i * 1.3), h * .24, 14, 1), { wash: AP.snowW, washOp: 255 * S.snow, ink: null });
  }
  boilSeed('clground');
  const top = []; for (let x = -200; x <= W + 200; x += 70) top.push([x, 1125 + 10 * Math.sin(x * .007 + 1) + 7 * Math.sin(x * .02)]);
  paint([...top, [W + 200, H + 300], [-200, H + 300]], { wash: S.gnd, fill: S.gndDk, fillOp: 60, bleed: .1, tex: .5, ink: null });
  for (let i = 0; i < 10; i++) { boilSeed('cldab' + i); paint(ellPts(60 + hash(i * 3.3) * 960, 1190 + 560 * hash(i * 7.1), 80 + 70 * hash(i), 10 + 8 * hash(i * 2), 12), { wash: S.gndDk, washOp: 120, ink: null }); }
  boilSeed('cltufts');
  for (let i = 0; i < 16; i++) {
    const x = 30 + hash(i * 5.1) * 1020, y = 1170 + 600 * hash(i * 9.7);
    for (let b = -1; b <= 1; b++) inkLine([[x + b * 7, y], [x + b * 12 + 2 * Math.sin(t * 1.3 + i), y - 18 - 8 * hash(i + b)]], 1.3, S.treeDk, 'inkfine', .4);
  }
  if (S.rain > .02) for (let i = 0; i < 3; i++) {
    boilSeed('clpud' + i); const px = 190 + i * 330, py = 1560 + i * 90 * (i % 2 ? 1 : -.4) + 40;
    paint(ellPts(px, py, 150, 26, 20, 1), { wash: mixCol(S.low, '#FFFFFF', .25), washOp: 190 * S.rain, ink: null });
    for (let r = 0; r < 2; r++) { const f = frac(t * 1.1 + i * .37 + r * .5); inkLine(ellPts(px, py, 20 + 110 * f, 3 + 18 * f, 14), 1.2, S.hill, 'inkfine', .5); }
  }
  if (S.shim > .02) {
    boilSeed('clshim');
    for (let i = 0; i < 6; i++) { const P = []; for (let x = -60; x <= W + 60; x += 60) P.push([x, 1190 + i * 80 + Math.sin(x * .02 + t * 2.2 + i * 1.7) * 10]); paint(ribbon(P, 6, 6), { wash: '#FFF4CE', washOp: 95 * S.shim, ink: null }); }
  }
}
// Weather in front of the characters (screen space): rain streaks, falling snow, petals.
function clearingFx(t, S) {
  if (S.rain > .02) {
    boilSeed('clrain');
    for (let i = 0; i < 46; i++) { const x = (W + 300) * frac(hash(i * 2.3) + t * .18 * (1 + .3 * hash(i))) - 150, y = H * frac(hash(i * 6.1) + t * (1.1 + .5 * hash(i * 1.7))) - 60, l = 60 + 60 * hash(i * 3.3); inkLine([[x, y], [x - l * .25, y + l]], 1.6, '#DCEBEA', 'inkfine', 0); }
  }
  if (S.snow > .02) {
    boilSeed('clsnow');
    for (let i = 0; i < 30; i++) { const x = W * frac(hash(i * 3.1) + .03 * Math.sin(t * .7 + i)), y = H * frac(hash(i * 7.7) + t * (.05 + .05 * hash(i * 1.3))), r = 4 + 5 * hash(i * 5.3); paint(ellPts(x, y, r, r, 8), { wash: '#FFFFFF', washOp: 245 * S.snow, ink: AP.snowLine, sw: .4 }); }
  }
  if (S.petals > .02) fallingPetals(t, S.petals);
}
function fallingPetals(t, a = 1, n = 26) {
  if (a <= .02) return;
  boilSeed('petals');
  for (let i = 0; i < n; i++) {
    const x = W * frac(hash(i * 3.3) + .05 * Math.sin(t * .8 + i * 1.3)), y = (H + 100) * frac(hash(i * 7.1) + t * (.09 + .05 * hash(i * 1.9))) - 50, r = t * 1.6 + i, s = 12 + 9 * hash(i * 2.2);
    paint([[x + Math.cos(r) * s, y + Math.sin(r) * s], [x + Math.cos(r + 1.6) * s * .5, y + Math.sin(r + 1.6) * s * .5], [x - Math.cos(r) * s, y - Math.sin(r) * s], [x + Math.cos(r - 1.6) * s * .5, y + Math.sin(r - 1.6) * s * .5]], { wash: i % 3 === 0 ? '#FFD27A' : i % 3 === 1 ? TK.petal : TK.petalDk, washOp: 235 * a, ink: null, curv: .5 });
  }
}
// Horizontal speed streaks for a whip pan: k 0..1 strength, dir ±1.
function whipH(k, dir = 1, t = 0) {
  if (k <= .02) return;
  boilSeed('whiph');
  for (let i = 0; i < 20; i++) {
    const y = 240 + hash(i * 2.7) * (H - 480), l = 500 + 900 * hash(i * 5.3), x = ((hash(i * 9.1) * 2400 - 300 + dir * t * 3800) % (W + l)) - l * .5, w = 5 + 16 * hash(i * 1.3);
    paint(ribbon([[x - l / 2, y], [x, y + 3], [x + l / 2, y]], w * .3, w), { wash: i % 3 ? TK.cream : '#F2D9B8', washOp: 200 * clamp(k) * (.5 + .5 * hash(i)), ink: null });
  }
}
// A small stone Shiva lingam on its base; (x, y) is the ground under it, s its height. snow 0..1 settles on top.
function lingam(x, y, s, snow = 0, key = 'lingam', t = 0) {
  boilSeed(key + 'sh'); paint(ellPts(x + 4, y + s * .06, s * .75, s * .12, 18), { fill: AP.ink, fillOp: 70, bleed: .25, tex: .3, border: .1, ink: null });
  boilSeed(key + 'base');
  paint(ellPts(x, y - s * .1, s * .68, s * .17, 22, 1), { wash: '#9A96AC', fill: AP.rockDk, fillOp: 80, tex: .5, ink: AP.ink, sw: 1 });
  paint([[x - s * .64, y - s * .1], [x - s * .6, y], [x + s * .6, y], [x + s * .64, y - s * .1]], { wash: '#8A86A0', ink: AP.ink, sw: 1, curv: .1 });
  boilSeed(key + 'shaft');
  const q = [[-.28, -.08], [-.29, -.6], [-.21, -.88], [0, -1], [.21, -.88], [.29, -.6], [.28, -.08]].map(([a, b]) => [x + a * s, y + b * s]);
  paint(q, { wash: '#4C4862', fill: '#2E2A44', fillOp: 90, tex: .6, ink: AP.ink, sw: 1.1, curv: .3 });
  paint(rrPts(x - .22 * s, y - .86 * s, .06 * s, .62 * s, .03 * s), { wash: '#7B7794', washOp: 200, ink: null });
  for (let i = 0; i < 3; i++) inkLine([[x - .27 * s, y - (.46 + i * .08) * s], [x, y - (.41 + i * .08) * s], [x + .27 * s, y - (.46 + i * .08) * s]], 1.8, '#F4EEE2', 'ink', .5);
  if (snow > .02) { paint(ellPts(x, y - .93 * s, .2 * s * snow, .08 * s * snow, 14, 1), { wash: AP.snowW, ink: AP.snowLine, sw: .6 }); paint(ellPts(x, y - .1 * s, .62 * s * snow, .1 * s * snow, 16, 1), { wash: AP.snowW, washOp: 240, ink: null }); }
}
// Snow resting on a figure's shoulders and topknot (k 0..1), for a character of unit u at (x, y).
function snowCaps(x, y, u, k, key = 'caps') {
  if (k <= .02) return;
  boilSeed(key);
  for (const s of [-1, 1]) paint(ellPts(x + s * 2.7 * u, y - 16.5 * u, 1.15 * u * k, .5 * u * k, 14, 1), { wash: AP.snowW, ink: AP.snowLine, sw: .6 });
  paint(ellPts(x, y - 24.1 * u, .9 * u * k, .38 * u * k, 12, 1), { wash: AP.snowW, ink: AP.snowLine, sw: .6 });
}

// ---------- the stranger ----------
// A young wandering brahmachari in a dusty ash-ochre shawl, hood up, a bamboo staff with a little bundle. Side view,
// facing screen-left (flip mirrors). (x, y) is the ground under him; about 25u tall. Options:
//   walk (phase), plant 0..1 (staff planted), dx, dy, sq, rot, flip, eyes / mouth / lookX / lookY / squint (Clawd's faces),
//   brow (-1..1: + raises one brow smugly), thumb 0..1 (jabs a thumb back over his shoulder), laugh 0..1 (shakes),
//   tail 0..1 (the tip of a teal snake tail curls out under the hem and wiggles), glint 0..1 (a crescent glints under the hood),
//   noShadow, boilKey
function stranger(x, y, u, o = {}) {
  const id = o.boilKey ?? 'str', rs = p => boilSeed(`stranger ${id} ${p}`);
  const wk = o.walk, hs = wk == null ? 0 : Math.sin(wk * TAU) * .35, sw = clamp(u / 20, .4, 2) * (o.swMul || 1), J = u * .04, P = pts => pts.map(([a, b]) => [a * u, b * u]);
  const laugh = clamp(o.laugh || 0), sq = (o.sq || 0), thumb = clamp(o.thumb || 0), plant = o.plant ?? (wk == null ? 1 : 0), gest = clamp(o.gest || 0);
  const dy = (o.dy || 0) * u - laugh * Math.abs(Math.sin(T * TAU * 4.5)) * .35 * u, sk = laugh * .05 * Math.sin(T * TAU * 9);
  const SK = PRV.skin, SKD = PRV.skinDk, HAIRK = '#3A2C20';
  if (!o.noShadow) { rs('shadow'); paint(ellPts(x + (o.dx || 0) * u, y + u * .1, u * 5 * (o.flip ? 1 : 1), u * .9, 22), { fill: PAL.ink, fillOp: 80, bleed: .25, tex: .3, border: .1, ink: null }); }
  push(); translate(x + (o.dx || 0) * u, y + dy); if (o.rot) rotate(o.rot); scale((o.flip ? -1 : 1) * (1 + sq * .6 + sk), 1 - sq);
  // the tail: behind the hem, curls out and flicks
  const tk = clamp(o.tail || 0);
  if (tk > .02) {
    rs('tail');
    const base = [[3.0, -1.4], [3.6, 0], [4.8, .3], [6.0, -.2], [6.6, -1.6], [6.0, -2.8]], e = easeOut(tk);
    const tp = base.map(([a, b], i) => { const f = i / 5; return [lerp(3.0, a, e) + Math.sin(T * 14 + i * 1.1) * .25 * f * tk, lerp(-1.4, b, e) + Math.cos(T * 11 + i) * .3 * f * tk]; });
    paint(ribbon(P(tp), .8 * u, .18 * u), { wash: AP.snake, fill: AP.snakeDk, fillOp: 80, tex: .5, ink: PAL.ink, sw: sw * .8 });
    paint(ellPts(tp[5][0] * u, tp[5][1] * u, .18 * u, .18 * u, 8), { wash: '#C3E6CA', ink: null });
  }
  // bare feet
  rs('feet');
  for (const s of [-1, 1]) {
    const l = wk == null ? 0 : Math.max(0, Math.sin((wk + (s < 0 ? 0 : .5)) * TAU)) * .5, fx = (s < 0 ? -2.1 : 1.3) * u + (wk == null ? 0 : -s * l * .3 * u), fy = (-.28 - l) * u;
    paint(ellPts(fx, fy, 1.15 * u, .5 * u, 14, J), { wash: SK, fill: SKD, fillOp: 50, ink: PAL.ink, sw: sw * .7 });
    for (const k of [-.55, -.2, .15]) inkLine([[fx - 1.0 * u, fy + k * .5 * u], [fx - 1.2 * u, fy + k * .5 * u + .05 * u]], sw * .4, PAL.ink, 'inkfine', 0);
  }
  // the shawl: a cloak to the ankles
  rs('shawl');
  const cloak = P([[-4.4 + hs, -.6], [-4.1, -4], [-3.9, -9], [-3.6, -13], [-3.4, -15.8], [-2.2, -17.2], [0, -17.9], [2.2, -17.2], [3.6, -15.8], [4.0, -12], [4.4, -7], [4.6, -3], [4.7 + hs * .5, -.6],
    [2.8 + hs * .5, -.3], [.6, -.75], [-1.4 + hs * .5, -.35], [-3, -.55]]);
  paint(cloak, { wash: AP.shawl, fill: AP.shawlDk, fillOp: 100, bleed: .08, tex: .7, border: .5, ink: PAL.ink, sw: sw * .95, curv: .25 });
  for (const [a, b, c, d] of [[-1.6, -4, -1.2, -12], [1.0, -2.5, 1.4, -11], [3.0, -3.5, 3.4, -12], [.2, -16.6, -.4, -7]]) inkLine(P([[a, b], [(a + c) / 2 + .3, (b + d) / 2], [c, d]]), sw * .6, AP.shawlDk, 'inkfine', .5);   // folds
  paint(ribbon(P([[-3.8, -11.9], [-1, -11.2], [1.8, -12.0], [4.2, -11.4]]), .55 * u, .5 * u), { wash: AP.shawlLt, washOp: 170, ink: PAL.ink, sw: sw * .4 });   // a rope belt
  // the staff and bundle, in his front hand
  rs('staff');
  const lift = (1 - plant) * Math.max(0, Math.sin((wk ?? 0) * TAU + .4)) * .9, sx = -5.3 + (1 - plant) * .5 * Math.sin((wk ?? 0) * TAU + 1.2);
  const stf = [[sx + lift * .1, -lift], [sx - .05, -12], [sx - .1, -25.4]];
  paint(ribbon(P(stf), .42 * u, .34 * u), { wash: AP.bamboo, fill: AP.bambooDk, fillOp: 70, tex: .5, ink: PAL.ink, sw: sw * .7 });
  for (const ny of [-6, -13, -20]) inkLine(P([[sx - .28, ny], [sx + .25, ny]]), sw * .7, AP.bambooDk, 'ink', 0);
  rs('bundle');
  inkLine(P([[sx - .1, -25.2], [sx - .7, -24.4], [sx - 1.2, -23.6]]), sw * .6, AP.bambooDk, 'ink', .4);
  paint(ellPts((sx - 1.4) * u, -22.8 * u, 1.0 * u, .95 * u, 14, J), { wash: '#B5533C', fill: '#8A3A2A', fillOp: 70, tex: .5, ink: PAL.ink, sw: sw * .8 });
  inkLine(P([[sx - 2.2, -22.8], [sx - .6, -22.8]]), sw * .5, '#8A3A2A', 'inkfine', 0);
  rs('arm');
  const hand = [sx - .05, -11.5];
  paint(ribbon(P([[-3.0, -16.2], [-4.6, -14.3], hand]), 1.35 * u, 1.0 * u), { wash: AP.shawl, fill: AP.shawlDk, fillOp: 70, tex: .5, ink: PAL.ink, sw: sw * .8 });
  paint(ellPts(hand[0] * u, hand[1] * u, .66 * u, .62 * u, 12, J), { wash: SK, ink: PAL.ink, sw: sw * .7 });
  // the free arm: rests on his belt, gestures while he talks (gest), laughs
  rs('arm2');
  const gw = Math.sin(T * TAU * 2.2), gv = Math.cos(T * TAU * 2.2);
  const rest = [2.4 + gest * (1.6 + .5 * gw), -11.4 - gest * (1.4 + .5 * gv)], e = ease(thumb);
  const hnd = [lerp(rest[0], 5.5, e), lerp(rest[1], -17.6, e)], elb = [lerp(4.2 + gest * .8, 5.6, e), lerp(-13.4 - gest * .6, -14.6, e)];
  const free = () => {
    paint(ribbon(P([[3.0, -16.2], elb, hnd]), 1.3 * u, 1.0 * u), { wash: AP.shawl, fill: AP.shawlDk, fillOp: 70, tex: .5, ink: PAL.ink, sw: sw * .8 });
    if (thumb > .03) paint(ribbon(P([hnd, [hnd[0] + .4, hnd[1] - .7], [hnd[0] + .9 * e, hnd[1] - 1.7 * e]]), .5 * u, .36 * u), { wash: SK, ink: PAL.ink, sw: sw * .6 });
    paint(ellPts(hnd[0] * u, hnd[1] * u, .66 * u, .6 * u, 12, J), { wash: SK, ink: PAL.ink, sw: sw * .7 });
  };
  if (thumb <= .03) free();
  // ---- the head: Parvati's big chibi head (1.18 about the neck), the hood a soft frame round a fully visible face turned 3/4 to screen-left
  push(); translate(0, -17.6 * u); scale(1.18); translate(0, 17.6 * u);
  if (laugh > .05) { translate(0, -17.5 * u); rotate(-.1 * laugh * Math.sin(T * TAU * 4.5)); translate(0, 17.5 * u); }
  const FX = -.45;
  rs('hood');
  paint(P([[-3.3, -20.4], [-3.2, -22.6], [-1.6, -24.0], [.6, -24.3], [2.6, -23.4], [3.9, -21.2], [4.1, -19], [3.7, -17], [2.6, -16.3], [-1.0, -16.5], [-3.0, -17.6], [-3.6, -19]]), { wash: AP.shawl, fill: AP.shawlDk, fillOp: 100, tex: .6, ink: PAL.ink, sw: sw * .95, curv: .3 });
  paint(ellPts((FX + .15) * u, -19.9 * u, 3.1 * u, 3.05 * u, 24, J), { wash: '#4E4130', ink: null });
  rs('face');
  const face = ellPts(FX * u, -19.8 * u, 2.8 * u, 2.75 * u, 28, J);
  paint(face, { wash: SK, ink: null });
  paint(ellPts((FX - .9) * u, -20.8 * u, 1.4 * u, .75 * u, 14, J * 2, -.2), { fill: PRV.skinLt, fillOp: 120, bleed: .2, tex: .8, border: .8, ink: null });
  paint(ellPts((FX + .3) * u, -17.7 * u, 2 * u, .7 * u, 14, J), { fill: SKD, fillOp: 60, bleed: .1, tex: .6, border: .5, ink: null });
  paint(face, { ink: PAL.ink, sw });
  paint(ellPts((FX - 2.95) * u, -19.25 * u, .5 * u, .42 * u, 10), { wash: SK, ink: PAL.ink, sw: sw * .6 });   // the nose, in profile-ish 3/4
  for (const [cx, k] of [[FX - 1.9, .8], [FX + 1.3, .5]]) paint(ellPts(cx * u, -18.5 * u, .7 * u * k + .2 * u, .4 * u, 12), { fill: PAL.rose, fillOp: 110, bleed: .2, tex: .4, ink: null });
  rs('eyes');
  const fo = { eyes: o.eyes || 'narrow', lookX: o.lookX ?? -.9, lookY: o.lookY || 0, squint: o.squint || 0 };
  push(); translate((FX - .55) * u, -19.8 * u); scale(.46); translate(0, 6 * u); eyes(u, fo, sw / .46 * .8, [-1, 1], 0); pop();
  rs('mouth');
  push(); translate((FX - .6) * u, -18.3 * u); scale(.54); translate(0, 4.3 * u); mouth(u, o.mouth || 'grin', sw / .54 * .8); pop();
  rs('brows');   // bushy, sly: the near brow cocked high, the far one low and slanted
  const br = clamp(o.brow ?? .5, -1, 1);
  paint(ribbon(P([[-3.3, -21.1 + br * .15], [-2.5, -21.4 - br * .3], [-1.4, -21.35 - br * .15]]), .78 * u, .6 * u), { wash: HAIRK, ink: null });
  paint(ribbon(P([[-.4, -21.2 + br * .1], [.5, -21.75 - br * .3], [1.4, -21.3 - br * .05]]), .72 * u, .5 * u), { wash: HAIRK, ink: null });
  for (const bx of [-2.9, -2.0, -1.0, .1, 1.0]) inkLine(P([[bx, -21.25], [bx + .2, -21.7 - (bx > -.5 ? br * .2 : 0)]]), sw * .5, HAIRK, 'inkfine', 0);
  // the hood's front rim over the forehead, and the moon glint under it
  rs('rim');
  paint(ribbon(P([[-3.5, -20.3], [-3.0, -22.1], [-1.2, -23.0], [.9, -22.8], [2.7, -21.4], [3.2, -19.8]]), .85 * u, .95 * u), { wash: AP.shawlDk, fill: AP.shawl, fillOp: 50, tex: .5, ink: PAL.ink, sw: sw * .8 });
  const gl = clamp(o.glint || 0);
  if (gl > .02) {
    glow(-2.0 * u, -22.3 * u, u * 3.0 * gl, '#FFF1C0', .95 * gl);
    rs('glint'); paint(crescentPts(-2.0 * u, -22.3 * u, .6 * u * (.5 + .5 * gl), -.5), { wash: '#FFF6D0', ink: null, curv: .3 });
  }
  pop();
  if (thumb > .03) free();   // the thumb jab goes over the hood
  pop();
}
// A modak for this reel, bigger and richer than bappa.js's: golden-cream with an ink outline, pleats from a little tip, a flat base.
// (x, y) = middle of the base; s = size (height 1.45 s, width 1.6 s). half = -1 / 1 draws only that half with a crumbly cut edge.
function apModak(x, y, s, half = 0) {
  if (s < 1) return;
  const R = [[0, -1.45], [.16, -1.3], [.34, -1.05], [.56, -.75], [.74, -.42], [.8, -.16], [.68, 0]];
  const side = d => R.map(([a, b]) => [x + d * a * s, y + b * s]);
  const sw = clamp(s / 22, .8, 2.6);
  let pts;
  if (!half) pts = [...side(1), [x + .3 * s, y + .06 * s], [x - .3 * s, y + .06 * s], ...side(-1).reverse()];
  else {
    const cut = []; for (let i = 0; i < 6; i++) cut.push([x + (i % 2 ? .06 : -.04) * s * half, y - (1.4 - i * .28) * s]);
    pts = [...side(half), [x + half * .3 * s, y + .06 * s], [x, y + .04 * s], ...cut.reverse()].filter(Boolean);
  }
  paint(pts, { wash: '#F4D58C', fill: '#D9A441', fillOp: 110, bleed: .12, tex: .6, border: .5, ink: PAL.ink, sw, curv: .3 });
  paint(ellPts(x, y + .02 * s, .66 * s, .12 * s, 14), { wash: '#E0B25C', washOp: 160, ink: null });   // the flat base
  for (const k of [-.55, -.28, 0, .28, .55]) {
    if (half && k * half < -.01) continue;
    inkLine([[x + k * .1 * s, y - 1.38 * s], [x + k * 1.25 * s, y - .72 * s], [x + k * 1.18 * s, y - .06 * s]], clamp(s / 40, .5, 1.5), '#B07A2A', 'inkfine', .5);   // pleats
  }
  paint(ellPts(x + (half || -1) * .3 * s, y - .85 * s, .12 * s, .3 * s, 10, 0, .3), { wash: '#FFF4CF', washOp: 190, ink: null });   // highlight
  paint(ellPts(x + half * .02 * s, y - 1.5 * s, .1 * s, .09 * s, 10), { wash: '#F4D58C', ink: PAL.ink, sw: sw * .6 });   // the tip
}
// A flat native fill of a polygon in screen space, for shapes too big for the brush (it drops polygons wider than ~2 screens).
function solidShape(pts, col, line = null, lw = 3) {
  flushBrush(); const c = color(col);
  push(); resetMatrix(); translate(-W / 2, -H / 2); fill(red(c), green(c), blue(c)); if (line) { const l = color(line); stroke(red(l), green(l), blue(l)); strokeWeight(lw); strokeJoin(ROUND); } else noStroke();
  beginShape(); for (const [x, y] of pts) vertex(x, y); endShape(CLOSE); pop();
}
// A uniform veil over the whole frame (a native fill, not a paint wash): a = 0..1.
function veil(col, a) {
  if (a <= .004) return;
  flushBrush(); const c = color(col);
  push(); resetMatrix(); translate(-W / 2, -H / 2); noStroke(); fill(red(c), green(c), blue(c), 255 * clamp(a)); rect(-4, -4, W + 8, H + 8); pop();
}
// The ash burst: a puff of grey smoke from (x, y), s its size, age in seconds (0..1).
function ashPoof(x, y, s, age, key = 'ash') {
  if (age < 0 || age > 1) return;
  const k = age, fade = 1 - seg(age, .45, 1); boilSeed(key);
  for (let i = 0; i < 16; i++) {
    const a = i / 16 * TAU + hash(i) * .5, d = s * (.1 + .85 * easeOut(Math.min(1, k * 2.4))) * (.55 + .5 * hash(i * 3.3)), r = s * (.32 + .22 * hash(i * 1.7)) * (.5 + k);
    paint(ellPts(x + Math.cos(a) * d * .9, y + Math.sin(a) * d * 1.15 - k * s * .25, r, r * .9, 12, 2), { wash: [AP.ash, AP.ashLt, AP.ashDk][i % 3], washOp: 235 * fade, ink: null });
  }
  paint(ellPts(x, y, s * .55 * (.3 + Math.min(1, k * 3)), s * .7 * (.3 + Math.min(1, k * 3)), 18, 2), { wash: AP.ashLt, washOp: 235 * fade, ink: null });
}
// The shawl, flung up and out of frame: age in seconds from the poof. One cloth outline that flaps, with folds and a hem band.
function shawlFly(x, y, u, age) {
  if (age < 0 || age > 1.2) return;
  const k = age / 1.2, cx = x + 150 * k + 55 * Math.sin(age * 6), cy = y - 12 * u - 1950 * easeIn(k * .95), rot = -.25 + .5 * Math.sin(age * 5) + .6 * k;
  const ph = age * 17, W2 = 5.4, H2 = 6.2, N = 7, pts = [];
  const top = i => [lerp(-W2, W2, i / N), -H2 + .7 * Math.sin(ph + i * .95) + .5 * Math.abs(i / N - .5) * 2];
  for (let i = 0; i <= N; i++) pts.push(top(i));
  for (let j = 1; j <= 5; j++) pts.push([W2 + .5 * Math.sin(ph * .9 + j * 1.3) + (j > 3 ? .6 : 0), lerp(-H2, H2, j / 6) + .3 * Math.sin(ph + j)]);
  for (let i = N; i >= 0; i--) { const f = i / N; pts.push([lerp(-W2, W2, f) * (1 - .06 * Math.sin(ph + i)) + .4 * Math.sin(ph * 1.1 + i), H2 + .9 * Math.sin(ph * 1.2 + i * 1.7) * (.5 + .5 * Math.abs(f - .5) * 2) + (i % 2 ? .45 : -.2)]); }
  for (let j = 5; j >= 1; j--) pts.push([-W2 + .5 * Math.sin(ph * .8 + j * 1.9), lerp(-H2, H2, j / 6)]);
  boilSeed('shawlfly');
  push(); translate(cx, cy); rotate(rot);
  paint(P3(pts, u), { wash: AP.shawl, fill: AP.shawlDk, fillOp: 90, tex: .6, ink: PAL.ink, sw: 1.6, curv: .3 });
  for (const [i, f] of [[0, -3.0], [1, -.6], [2, 2.0], [3, 4.0]]) {   // folds, following the flutter
    const fp = []; for (let m = 0; m <= 4; m++) fp.push([f + .5 * Math.sin(ph * .8 + i * 2 + m * .9) + m * .12 * (f > 0 ? 1 : -1), lerp(-H2 + .8, H2 - .5, m / 4)]);
    inkLine(P3(fp, u), 1.6, AP.shawlDk, 'inkfine', .5);
  }
  paint(ribbon(P3([[-W2 + .6, H2 - 1.0], [0, H2 - .5 + .4 * Math.sin(ph)], [W2 - .6, H2 - 1.0]], u), .9 * u, .9 * u), { wash: AP.shawlLt, washOp: 190, ink: null });   // a lighter hem band
  paint(ellPts(-1.8 * u, -2.6 * u, 1.6 * u, 1.0 * u, 12, 0, -.4), { wash: AP.shawlLt, washOp: 140, ink: null });   // a fold catching the light
  pop();
}
const P3 = (pts, u) => pts.map(([a, b]) => [a * u, b * u]);

// ---------- Parvati's jewels ----------
// parvati() with parts left off. hide = { mukut, jhumka, nath, bangles }. It watches boilSeed's hashes to know which part
// of parvati() is being drawn, and drops that part's paint calls.
function parvatiStripped(x, y, u, o = {}, hide = {}) {
  const id = o.boilKey ?? 'ps', hashOf = k => { let h = 2166136261; for (const c of k) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; };
  const names = ['shadow', 'backhair', 'pallback', 'feet', 'skirt', 'torso', 'pallu', 'neck', 'head', 'jhumka', 'hairfront', 'mukut', 'bindi', 'eyes', 'nose', 'mouth', 'arm-1', 'arm1', 'emote', 'after'];
  const map = new Map(names.map(n => [hashOf(`parvati ${id} ${n}|${BOILN}`), n]));
  const _rs = window.randomSeed, _paint = window.paint, _ink = window.inkLine; let cur = null;
  Object.defineProperty(window, 'randomSeed', { value: h => { const n = map.get(h >>> 0); if (n) cur = n; return _rs(h); }, writable: true, configurable: true });
  window.paint = (pts, op) => { if ((cur === 'jhumka' && hide.jhumka) || (cur === 'mukut' && hide.mukut)) return; return _paint(pts, op); };
  window.inkLine = (pts, sw, col, br, cv) => {
    if ((cur === 'jhumka' && hide.jhumka) || (cur === 'mukut' && hide.mukut)) return;
    if (cur === 'nose' && hide.nath && col === PRV.gold) return;
    if ((cur === 'arm-1' || cur === 'arm1') && hide.bangles && (col === PRV.gold || col === PRV.bangle)) return;
    return _ink(pts, sw, col, br, cv);
  };
  try { parvati(x, y, u, { ...o, boilKey: id }); } finally { Object.defineProperty(window, 'randomSeed', { value: _rs, writable: false, configurable: true }); window.paint = _paint; window.inkLine = _ink; }
}
// Where a point of her head (body-local u, as in parvati.js) lands in the world: the head is 1.18× about the neck.
function parvatiHeadPt(x, y, u, o, lx, ly) {
  const hx = clamp(o.hx || 0, -1, 1), fx = o.flip ? -1 : 1, sq = o.sq || 0;
  return [x + (o.dx || 0) * u + fx * (hx * .45 + 1.18 * lx) * u * (1 + sq * .6), y + (o.dy || 0) * u + (1.18 * (ly + 17.6) - 17.6) * u * (1 - sq)];
}
// The mukut, off her head: (cx, cy) its base centre, size u, rotation rot.
function mukutAt(cx, cy, u, rot = 0, key = 'mukut') {
  boilSeed(key); const s = u * 1.18, P = pts => pts.map(([a, b]) => [a * s, b * s]);
  push(); translate(cx, cy); rotate(rot);
  paint(P([[-1.7, 0], [1.7, 0], [1.3, -.9], [.7, -.8], [0, -1.7], [-.7, -.8], [-1.3, -.9]]), { wash: PRV.gold, fill: PRV.goldDk, fillOp: 60, tex: .5, ink: PRV.ink, sw: clamp(u / 25, .4, 1.4), curv: .15 });
  paint(ellPts(0, -.6 * s, .25 * s, .3 * s, 8), { wash: PRV.saree, ink: PRV.ink, sw: .5 });
  paint(ellPts(-.9 * s, -.35 * s, .12 * s, .12 * s, 6), { wash: PRV.goldLt, ink: null }); paint(ellPts(.9 * s, -.35 * s, .12 * s, .12 * s, 6), { wash: PRV.goldLt, ink: null });
  pop();
}
function jhumkaAt(cx, cy, u, rot = 0, key = 'jhumka') {
  boilSeed(key); const s = u * 1.18;
  push(); translate(cx, cy); rotate(rot);
  inkLine([[0, 0], [0, .5 * s]], .8, PRV.goldDk, 'inkfine', 0);
  paint(P3([[-.45, 1.2], [0, .45], [.45, 1.2]], s), { wash: PRV.gold, fill: PRV.goldDk, fillOp: 50, ink: PRV.ink, sw: .6, curv: .5 });
  for (const k of [-.3, 0, .3]) paint(ellPts(k * s, 1.35 * s, .1 * s, .1 * s, 6), { wash: PRV.goldLt, ink: null });
  pop();
}
function nathAt(cx, cy, u, rot = 0, key = 'nath') {
  boilSeed(key); const s = u * 1.18;
  push(); translate(cx, cy); rotate(rot); inkLine(ellPts(0, 0, .26 * s, .26 * s, 12).concat([[.26 * s, 0]]), 1.4, PRV.gold, 'ink', .5); pop();
}
// A bangle as a band across a forearm: (cx, cy), nx/ny = a unit step along the band.
function bangleAt(cx, cy, u, ang = 0, col = PRV.bangle, key = 'bangle') {
  boilSeed(key); const l = .5 * u;
  inkLine([[cx - Math.cos(ang) * l, cy - Math.sin(ang) * l], [cx + Math.cos(ang) * l, cy + Math.sin(ang) * l]], 2.2, col, 'ink', 0);
}
