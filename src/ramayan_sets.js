// ramayan_sets.js: the Ramayan series' shared sets and props (Painted), first made for Part 1 ("The world's first poem
// was a curse"). Load after ramayan.js; each part's own props file comes after it. Pure functions of their arguments
// (and T for boil).
//   P1                                   the palette
//   warmBack, ashram, riverBank, heavenSky, court, chamber    sets
//   tree, bush, hut, throne, kidVeena, notes, tears, arrowFly  props
//   lavKush(x, y, u, o)                  one of Ram's sons on Kartikeya's rig, singing with a little veena
const P1 = {
  ink: '#2B2233', cream: '#FFF5E2', gold: '#F5C542',
  // the ashram by day
  skyHi: '#9CC3E6', skyLo: '#FCE3BE', hill: '#9DB88A', hillDk: '#7E9E70', grass: '#8DB86A', grassDk: '#6E9A50', earth: '#D8B488', earthDk: '#B8926A',
  leaf: '#5E9A5A', leafDk: '#3E7442', leafLt: '#8CC27A', bark: '#7A5232', barkDk: '#55361E', thatch: '#D2A658', thatchDk: '#A87C36', mud: '#C89A6A', mudDk: '#9E7448',
  // the river at morning
  water: '#7FB8D2', waterDk: '#5A94B4', waterLt: '#BCE0EE', reed: '#9AB86A', reedDk: '#6E8E48', mornHi: '#F2B98A', mornLo: '#FFE8C2',
  // the court
  hall: '#7A2236', hallDk: '#561626', pillar: '#E8C46A', pillarDk: '#B8903A', floor: '#C8945A', floorDk: '#A0703E', curtain: '#C8323A',
  // the night chamber
  nightHi: '#1E1838', nightLo: '#3A2A5A', lamp: '#FFC870',
};

// ---------- sets ----------
// a plain warm wash with a soft light behind the subject (the hook)
function warmBack(t, key = 'wb', cx = 540, cy = 1100) {
  boilSeed(key);
  paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#F2C48E', ink: null });
  paint(ellPts(cx, cy, 760, 900, 30), { fill: '#FFE2B0', fillOp: 220, bleed: .3, tex: .4, border: .3, ink: null });
  glow(cx, cy, 620, '#FFD080', .45);
}
// a leafy tree: trunk from (x, y) up h; canopy of puffs
function tree(x, y, h, key, sway = 0, cols = [P1.leaf, P1.leafDk, P1.leafLt]) {
  boilSeed('tree' + key);
  paint(ribbon([[x, y], [x + 6 + sway * 5, y - h * .5], [x + sway * 12, y - h * .8]], h * .09, h * .05), { wash: P1.bark, fill: P1.barkDk, fillOp: 50, tex: .5, ink: P1.ink, sw: .9 });
  const cy = y - h * .9;
  paint(ellPts(x + sway * 14, cy + h * .08, h * .5, h * .28, 22, 4), { wash: cols[1], ink: P1.ink, sw: .8 });
  for (const [dx, dy, r] of [[-.3, 0, .26], [.05, -.16, .3], [.32, -.02, .24], [-.05, .06, .26]]) paint(ellPts(x + sway * 14 + dx * h, cy + dy * h, r * h, r * h * .8, 18, 3), { wash: cols[0], ink: null });
  paint(ellPts(x + sway * 14 - h * .12, cy - h * .12, h * .16, h * .1, 14), { wash: cols[2], washOp: 200, ink: null });
}
function bush(x, y, s, key, col = P1.leaf, dk = P1.leafDk) {
  boilSeed('bush' + key);
  paint([[x - s, y], [x - s * .9, y - s * .5], [x - s * .5, y - s * .9], [x, y - s], [x + s * .5, y - s * .85], [x + s * .9, y - s * .45], [x + s, y]], { wash: dk, ink: P1.ink, sw: .9, curv: .6 });
  for (const [dx, dy, r] of [[-.45, -.45, .42], [.1, -.62, .45], [.55, -.38, .38]]) paint(ellPts(x + dx * s, y + dy * s, r * s, r * s * .8, 14, 2), { wash: col, ink: null });
}
// a thatched hut, its door at (x, y), s wide
function hut(x, y, s, key = 'hut') {
  boilSeed(key);
  paint([[x - s * .42, y], [x - s * .42, y - s * .45], [x + s * .42, y - s * .45], [x + s * .42, y]], { wash: P1.mud, fill: P1.mudDk, fillOp: 60, tex: .5, ink: P1.ink, sw: 1 });
  paint([[x - s * .12, y], [x - s * .12, y - s * .3], [x, y - s * .34], [x + s * .12, y - s * .3], [x + s * .12, y]], { wash: '#5A3A28', ink: P1.ink, sw: .8, curv: .3 });
  paint([[x - s * .56, y - s * .4], [x, y - s * .85], [x + s * .56, y - s * .4], [x + s * .5, y - s * .34], [x - s * .5, y - s * .34]], { wash: P1.thatch, fill: P1.thatchDk, fillOp: 60, tex: .6, ink: P1.ink, sw: 1, curv: .15 });
  for (let i = 0; i < 6; i++) inkLine([[x - s * .5 + i * s * .2, y - s * .37], [x - s * .2 + i * s * .08, y - s * .7]], .6, P1.thatchDk, 'inkfine', .3);
}
// the ashram in the forest by day: sky, far hills, trees, the hut, the clearing
function ashram(t, key = 'as') {
  boilSeed(key + 'sky');
  paint(rectPts(-900, -600, W + 1800, 2000), { wash: P1.skyHi, ink: null });
  paint(rectPts(-900, 800, W + 1800, 700), { wash: P1.skyLo, ink: null });
  paint(ellPts(540, 950, 1000, 300, 26), { fill: mixCol(P1.skyHi, P1.skyLo, .5), fillOp: 200, bleed: .3, tex: .4, border: .2, ink: null });
  boilSeed(key + 'hills');
  paint([[-900, 1200], [-300, 1150], [0, 1080], [300, 1140], [620, 1020], [900, 1110], [1380, 1000], [1980, 1100], [1980, 1400], [-900, 1400]], { wash: P1.hill, fill: P1.hillDk, fillOp: 40, tex: .4, ink: null, curv: .6 });
  tree(-60, 1400, 520, key + 'a', Math.sin(t * .9) * .3);
  tree(1130, 1380, 600, key + 'b', Math.sin(t * .8 + 1) * .3);
  hut(860, 1380, 380, key + 'hut');
  boilSeed(key + 'ground');
  paint(rectPts(-900, 1335, W + 1800, 1500), { wash: P1.earth, ink: null });
  paint(ellPts(540, 1700, 1000, 300, 24), { fill: P1.earthDk, fillOp: 60, bleed: .3, tex: .5, ink: null });
  inkLine([[-200, 1340], [300, 1310], [800, 1350], [1300, 1320]], .8, P1.ink, 'ink', .5);
  paint(ellPts(540, 1900, 900, 300, 24), { fill: P1.grass, fillOp: 120, bleed: .3, tex: .5, ink: null });
  bush(80, 1420, 110, key + 'b1'); bush(1040, 1440, 130, key + 'b2');
}
// the Tamasa at morning: a warm sky, the far bank's trees, the river, the near bank with reeds
function riverBank(t, key = 'rv', o = {}) {
  const dim = o.dim || 0, D = c => dim ? mixCol(c, '#6A5A7A', dim) : c;
  boilSeed(key + 'sky');
  paint(rectPts(-300, -300, W + 600, 1300), { wash: D(P1.mornHi), ink: null });
  paint(ellPts(700, 1000, 1000, 380, 26), { fill: D(P1.mornLo), fillOp: 230, bleed: .3, tex: .4, border: .2, ink: null });
  glow(760, 930, 300, '#FFD8A0', .5 * (1 - dim)); paint(ellPts(760, 940, 80, 80, 20), { wash: D('#FFE6B8'), ink: null });
  boilSeed(key + 'far');
  paint([[-300, 1130], [100, 1060], [400, 1090], [800, 1040], [1380, 1080], [1380, 1200], [-300, 1200]], { wash: D(P1.leafDk), ink: null, curv: .6 });
  for (let i = 0; i < 8; i++) { const x = -100 + i * 180 + 40 * hash(i * 3.1), r = 60 + 40 * hash(i * 5.7); paint(ellPts(x, 1090 - r * .4, r, r * .8, 14, 2), { wash: D(i % 2 ? P1.leaf : P1.leafDk), ink: null }); }
  boilSeed(key + 'water');
  paint(rectPts(-300, 1150, W + 600, 340), { wash: D(P1.water), ink: null });
  paint(ellPts(540, 1330, 900, 120, 22), { fill: D(P1.waterDk), fillOp: 90, bleed: .3, tex: .4, ink: null });
  boilSeed(key + 'ripples');
  for (let i = 0; i < 10; i++) { const y = 1190 + hash(i * 2.3) * 270, x = frac(hash(i * 7.7) + t * .03) * 1500 - 200; inkLine([[x, y], [x + 90, y]], 1.6, D(P1.waterLt), 'inkfine', 0); }
  boilSeed(key + 'bank');
  paint([[-300, 1470], [200, 1440], [700, 1475], [1380, 1445], [1380, 2400], [-300, 2400]], { wash: D(P1.grass), fill: D(P1.grassDk), fillOp: 60, tex: .5, ink: P1.ink, sw: .9, curv: .5 });
  boilSeed(key + 'reeds');
  for (let i = 0; i < 14; i++) { const x = -40 + i * 85 + 30 * hash(i * 1.7), h = 70 + 60 * hash(i * 4.1), sw2 = Math.sin(t * 1.5 + i) * 8; inkLine([[x, 1480], [x + sw2 * .5, 1480 - h * .6], [x + sw2, 1480 - h]], 2, D(i % 2 ? P1.reed : P1.reedDk), 'ink', .5); }
}
// a golden opening in the sky (Brahma comes): over the ashram's light
function heavenSky(t, k, key = 'hv') {
  if (k <= 0) return;
  glow(540, 520, 700 * k, '#FFE2A0', .6 * k);
  boilSeed(key + 'rays');
  for (let i = 0; i < 12; i++) { const a = Math.PI * (.15 + .7 * i / 11), r = 1400 * k; paint([[540, 300], [540 + Math.cos(a - .04) * r, 300 + Math.sin(a - .04) * r], [540 + Math.cos(a + .04) * r, 300 + Math.sin(a + .04) * r]], { wash: '#FFF0C0', washOp: 60 * k, ink: null }); }
}
// Ayodhya's court: a crimson hall, gold pillars, the floor
function court(t, key = 'ct') {
  boilSeed(key + 'wall');
  paint(rectPts(-300, -300, W + 600, 1800), { wash: P1.hall, ink: null });
  paint(ellPts(540, 1000, 700, 700, 26), { fill: '#A8344A', fillOp: 160, bleed: .3, tex: .4, ink: null });
  glow(540, 950, 500, '#FFC080', .35);
  boilSeed(key + 'pillars');
  for (const x of [60, 1020]) {
    paint(rectPts(x - 60, 300, 120, 1300), { wash: P1.pillar, fill: P1.pillarDk, fillOp: 50, tex: .4, ink: P1.ink, sw: 1 });
    for (const y of [420, 1500]) paint(rectPts(x - 85, y - 30, 170, 60), { wash: P1.pillarDk, ink: P1.ink, sw: .9 });
  }
  boilSeed(key + 'curtain');
  for (const s of [-1, 1]) paint([[540 + s * 600, 200], [540 + s * 300, 200], [540 + s * 380, 500], [540 + s * 520, 700], [540 + s * 640, 720]], { wash: P1.curtain, fill: '#962338', fillOp: 60, tex: .5, ink: P1.ink, sw: .9, curv: .5 });
  boilSeed(key + 'floor');
  paint([[-300, 1560], [1380, 1560], [1380, 2400], [-300, 2400]], { wash: P1.floor, fill: P1.floorDk, fillOp: 50, tex: .5, ink: P1.ink, sw: .9 });
  for (let i = 0; i < 7; i++) inkLine([[540 + (i - 3) * 120, 1560], [540 + (i - 3) * 340, 2000]], .8, P1.floorDk, 'inkfine', 0);
}
// a dark palace chamber at night, one oil lamp (lit 0..1)
function chamber(t, lit = 1, key = 'ch') {
  boilSeed(key);
  paint(rectPts(-300, -300, W + 600, H + 600), { wash: P1.nightHi, ink: null });
  paint(ellPts(540, 1300, 800, 700, 26), { fill: P1.nightLo, fillOp: 200, bleed: .3, tex: .4, ink: null });
  boilSeed(key + 'arch');
  for (const s of [-1, 1]) paint([[540 + s * 700, 200], [540 + s * 420, 200], [540 + s * 420, 1600], [540 + s * 700, 1600]], { wash: '#140F28', ink: null });
  paint(rectPts(-300, 1600, W + 600, 900), { wash: '#140F28', ink: null });
  paint([[120, 1650], [960, 1650], [960, 2400], [120, 2400]], { wash: '#2A2044', ink: null });
}
// a gold throne behind a seated figure: its seat centred at (x, y), s wide
function throne(x, y, s, key = 'th') {
  boilSeed(key);
  paint([[x - s * .5, y], [x - s * .55, y - s * .9], [x - s * .35, y - s * 1.2], [x, y - s * 1.32], [x + s * .35, y - s * 1.2], [x + s * .55, y - s * .9], [x + s * .5, y]], { wash: P1.pillar, fill: P1.pillarDk, fillOp: 60, tex: .5, ink: P1.ink, sw: 1.2, curv: .4 });
  paint([[x - s * .4, y - s * .1], [x - s * .42, y - s * .8], [x, y - s * 1.08], [x + s * .42, y - s * .8], [x + s * .4, y - s * .1]], { wash: '#B8203A', fill: '#861422', fillOp: 50, tex: .5, ink: P1.ink, sw: .9, curv: .4 });
  paint(rrPts(x - s * .62, y - s * .08, s * 1.24, s * .3, s * .06), { wash: P1.pillar, fill: P1.pillarDk, fillOp: 60, ink: P1.ink, sw: 1 });
  for (const s2 of [-1, 1]) paint(ellPts(x + s2 * s * .6, y - s * .14, s * .09, s * .09, 12), { wash: '#D2283A', ink: P1.ink, sw: .7 });
  paint(rectPts(x - s * .55, y + s * .22, s * 1.1, s * .3), { wash: P1.pillarDk, ink: P1.ink, sw: 1 });
}

// ---------- props ----------
// musical notes rising from (x, y): age drives them
function notes(x, y, age, key = 'nt', col = P1.gold, n = 3) {
  boilSeed(key);
  for (let i = 0; i < n; i++) {
    const k = frac(age * .6 + i / n), nx = x + Math.sin(k * 5 + i) * 30 + i * 20, ny = y - k * 220, a = 255 * Math.sin(k * Math.PI);
    paint(ellPts(nx, ny, 13, 10, 10, 0, -.3), { wash: col, washOp: a, ink: P1.ink, sw: .6 });
    inkLine([[nx + 12, ny - 2], [nx + 12, ny - 44]], 1.6, P1.ink, 'ink', 0);
    if (i % 2) inkLine([[nx + 12, ny - 44], [nx + 30, ny - 34]], 1.6, P1.ink, 'ink', 0);
  }
}
// tear drops falling from (x, y)
function tears(x, y, age, key = 'tr', s = 1) {
  boilSeed(key);
  for (let i = 0; i < 3; i++) {
    const k = frac(age * .9 + i / 3), tx = x + (i - 1) * 12 * s, ty = y + k * 90 * s;
    paint([[tx, ty - 12 * s], [tx + 7 * s, ty], [tx, ty + 6 * s], [tx - 7 * s, ty]], { wash: '#9ED0F0', washOp: 255 * (1 - k), ink: P1.ink, sw: .5, curv: .6 });
  }
}
// an arrow in flight (or stuck): its tip at (x, y), pointing along angle a, len px
function arrowAt(x, y, a, len = 150, key = 'ar') {
  boilSeed(key);
  const ca = Math.cos(a), sa = Math.sin(a), tail = [x - ca * len, y - sa * len];
  inkLine([tail, [x - ca * 14, y - sa * 14]], 2.4, '#A0784A', 'ink', 0);
  paint([[x, y], [x - ca * 22 - sa * 8, y - sa * 22 + ca * 8], [x - ca * 22 + sa * 8, y - sa * 22 - ca * 8]], { wash: '#C8CCD8', ink: P1.ink, sw: .7 });
  for (const s of [-1, 1]) paint([[tail[0] + ca * 30, tail[1] + sa * 30], [tail[0] - sa * s * 12, tail[1] + ca * s * 12], [tail[0] - ca * 6 - sa * s * 12, tail[1] - sa * 6 + ca * s * 12], [tail[0], tail[1]]], { wash: '#E8D6B0', ink: P1.ink, sw: .5 });
}
// a small veena, held at the hand (arm space, upright): gourd below, the neck up to the left
function kidVeena(u, sw, strum = 0) {
  const INK = KAR.ink;
  push(); rotate(-.5);
  paint(ribbon(U([[0, 3], [0, -6]], u), .5 * u, .35 * u), { wash: '#A0602E', ink: INK, sw: sw * .6 });
  paint(ellPts(0, 3.2 * u, 1.6 * u, 1.5 * u, 16), { wash: '#E8B860', fill: '#B8862E', fillOp: 60, tex: .5, ink: INK, sw: sw * .7 });
  paint(ellPts(0, -6.2 * u, .8 * u, .75 * u, 12), { wash: '#E8B860', ink: INK, sw: sw * .6 });
  for (const j of [-.15, .15]) inkLine(U([[j + Math.sin(T * 40) * .05 * strum, 2.4], [j, -5.8]], u), sw * .3, '#FFF0C8', 'inkfine', 0);
  pop();
}
// Lav or Kush: a boy on Kartikeya's rig in saffron with a topknot, singing with a little veena
const LK_PAL = { teal: '#E8862E', tealDk: '#B85E18', tealLt: '#FFB870', sash: '#F2C230', sashDk: '#B88A1C' };
function lavKush(x, y, u, o = {}) {
  return kartikeya(x, y, u, { feather: false, spear: false, shield: false, tilak: true, aL: -.3, armL: (uu, sw) => kidVeena(uu, sw, 1), ...o, pal: { ...LK_PAL, ...(o.pal || {}) } });
}

// ---------- a test sheet: ?loop=ramayansets ----------
LOOPS.ramayansets = t => {
  riverBank(t);
  krauncha(300, 1700, 200, { key: 'a', wings: .8, neck: .3 });
  krauncha(560, 1700, 190, { key: 'b', flip: true, neck: .4 });
  throne(800, 1000, 260);
  ram(800, 1030, 14, { sit: 1, kodanda: false });
  lavKush(200, 1300, 18, { mouth: 'open' });
  lavKush(420, 1300, 18, { mouth: 'O', seed: 3 });
  arrowAt(700, 400, -.2);
  notes(300, 900, t);
};
LOOPS.ramayansets.len = 2;
