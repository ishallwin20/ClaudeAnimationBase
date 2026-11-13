// hanu5_props.js: sets and props for hanu5.js (ad 93, Hanuman Part 5, "HANUMAN offered to carry SITA home. She said
// NO."). Loaded after src/scenes/hanu4_props.js (Part 4's palette H4, h4Grove, h4Bubble, h4Sky; loaded from that
// branch so this one stands alone), src/hanuman_series.js and src/ramayan_sets.js. Pure functions of their arguments
// (and T for boil). Sets stay inside x -300..1380. Ram's ring is Ramayan Part 9's (rp9_props.js), the hair jewel
// Ramayan Part 10's (rp10_props.js), copied here.
//   H5                                   the palette
//   h5Rise                               the low rise of ground in front of Sita in the grove (she sits behind it)
//   h5Field                              a battlefield at dusk (the next-part tease)
//   h5Ring, h5Jewel, h5Lanka, h5Sea, h5Fish, h5Badge, h5Moon, guard     props
const H5 = {
  ink: '#2B2233', gold: '#F5C542', mgold: '#F2C230', mgoldDk: '#B88A1C', ruby: '#D2283A',
  rise: '#1E2A3A', riseDk: '#162030', grass: '#3E6A4A', sea: '#2E6AA8', seaDk: '#1E4A80', seaLt: '#9ED0F0',
  rock: '#7A5A4A', rockDk: '#4A342A', tower: '#E8B84A', towerDk: '#B8862E', dome: '#E2453A',
  dusk: '#E8794A', duskHi: '#F2B26A', duskLo: '#8A3A4A', field: '#7A4A3A', fieldDk: '#4A2A28', sun: '#FFE2A0',
};

// the Ashoka grove at night (Part 4's h4Grove, with a green crown: its red ashoka blossoms are dots)
function h5Grove(t, key = 'ag', tx = 930, th = 900) {
  boilSeed(key + 'sky');
  paint(rectPts(-600, -600, W + 1200, 2400), { wash: H4.grove, ink: null });
  paint(ellPts(540, 1150, 1000, 700, 26), { fill: H4.groveLo, fillOp: 200, bleed: .3, tex: .4, ink: null });
  glow(840, 520, 160, H4.moon, .4); paint(ellPts(840, 520, 50, 50, 18), { wash: H4.moon, ink: null });
  boilSeed(key + 'stars'); for (let i = 0; i < 14; i++) paint(starPts(-100 + hash(i * 2.3) * 1300, 300 + hash(i * 6.7) * 500, 3 + 3 * hash(i * 3.3) * (.6 + .4 * Math.sin(t * 2 + i)), .4, 4), { wash: '#FFF6DA', ink: null });
  boilSeed(key + 'ground');
  paint(rectPts(-600, 1640, W + 1200, 1100), { wash: '#1E2A3A', ink: null });
  inkLine([[-100, 1640], [500, 1630], [1200, 1645]], .9, H4.ink, 'ink', .5);
  tree(tx, 1660, th, key + 'tr', Math.sin(t * .7) * .15, ['#2E4A3A', '#1E3428', '#4A6E50']);
  boilSeed(key + 'blooms');
  for (let i = 0; i < 26; i++) { const x = tx - 330 + hash(i * 2.7) * 660, y = 1660 - th * .98 + hash(i * 4.9) * th * .42; paint(ellPts(x, y, 13, 11, 8), { wash: i % 2 ? H4.ashoka : H4.ashokaDk, ink: null }); }
}
// the low rise of ground in the grove: Sita sits behind it (her lower half hidden), Hanuman stands on it; its top
// runs about y 1745 from x 200 to 1300
function h5Rise(key = 'rs') {
  boilSeed(key);
  paint([[-300, 2400], [-300, 1800], [200, 1765], [420, 1745], [700, 1730], [980, 1748], [1380, 1790], [1380, 2400]], { wash: H5.rise, fill: H5.riseDk, fillOp: 50, tex: .4, ink: null, curv: .4 });
  inkLine([[100, 1772], [330, 1756], [560, 1736], [820, 1736], [1060, 1756]], 1.1, H5.grass, 'ink', .5);
  for (let i = 0; i < 9; i++) inkLine([[160 + i * 110, 1760 - 10 * Math.sin(i)], [152 + i * 110, 1722 - 10 * Math.sin(i)]], 1.6, H5.grass, 'inkfine', .4);
}
// a battlefield at dusk: a red-gold sky, a low sun, flat dusty ground from y 1700
function h5Field(t, key = 'fd') {
  boilSeed(key + 'sky');
  paint(rectPts(-300, -600, W + 600, 2400), { wash: H5.dusk, ink: null });
  paint(ellPts(540, 1300, 1000, 640, 26), { fill: H5.duskHi, fillOp: 220, bleed: .3, tex: .4, ink: null });
  glow(800, 1500, 360, H5.sun, .5); paint(ellPts(800, 1560, 110, 110, 24), { wash: H5.sun, ink: null });
  for (let i = 0; i < 3; i++) cloudPuff(160 + i * 380 + 14 * Math.sin(t * .4 + i), 820 + 80 * hash(i * 3.1), 90, key + 'c' + i, 200, '#F6C49A', '#D88A6A');
  boilSeed(key + 'gr');
  paint(rectPts(-300, 1700, W + 600, 900), { wash: H5.field, fill: H5.fieldDk, fillOp: 60, tex: .5, ink: null });
  inkLine([[-100, 1702], [500, 1694], [1200, 1704]], .9, H5.ink, 'ink', .5);
  for (let i = 0; i < 6; i++) { const x = -40 + i * 230, y = 1690; inkLine([[x, y], [x + 30, y - 120]], 2.4, H5.fieldDk, 'ink', .1); paint(starPts(x + 32, y - 128, 12, .3, 3), { wash: '#B8B0A0', ink: H5.ink, sw: .5 }); }   // spears stuck in the ground
}

// Ram's ring (rp9): a gold band with a blue stone (his name is cut in it: too small to show), centred at (x, y), s wide;
// sparkle 0..1 adds its light and twinkles
function h5Ring(x, y, s, sparkle = 0, key = 'rr', t = T) {
  boilSeed(key);
  if (sparkle > 0) glow(x, y, s * 2, '#FFE8A0', .55 * sparkle);
  const band = (r, ry) => { const P = ellPts(x, y + s * .1, s * r, s * ry, 18); return [...P, P[0]]; };
  inkLine(band(.42, .3), Math.max(1.5, s * .045), H5.mgold, 'ink', .5);
  inkLine(band(.34, .23), Math.max(.5, s * .012), H5.mgoldDk, 'inkfine', .5);
  paint(ellPts(x, y - s * .22, s * .16, s * .13, 10), { wash: '#3E7ED8', ink: H5.ink, sw: .5 });
  paint(ellPts(x - s * .05, y - s * .25, s * .05, s * .04, 6), { wash: '#BFE0FF', ink: null });
  if (sparkle > 0) for (let i = 0; i < 4; i++) { const q = frac(t * 1.2 + i / 4), a = i * 1.7; paint(starPts(x + Math.cos(a) * s * .8, y + Math.sin(a) * s * .6 - q * s * .5, s * .18 * Math.sin(q * Math.PI) * sparkle, .35, 4), { wash: '#FFFFFF', ink: null }); }
}
// Sita's hair jewel, the chudamani (rp10): a gold rosette with a ruby and pearls, centred at (x, y), s wide
function h5Jewel(x, y, s, sparkle = 0, key = 'cm', t = T) {
  boilSeed(key);
  if (sparkle > 0) glow(x, y, s * 2, '#FFB0A0', .5 * sparkle);
  paint(ellPts(x, y, s * .5, s * .42, 18), { wash: H5.gold, fill: '#C8922A', fillOp: 40, tex: .3, ink: H5.ink, sw: .8 });
  paint(ellPts(x, y, s * .28, s * .24, 14), { wash: H5.ruby, ink: H5.ink, sw: .6 });
  paint(ellPts(x - s * .08, y - s * .08, s * .08, s * .06, 8), { wash: '#FF9AA8', ink: null });
  for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; paint(ellPts(x + Math.cos(a) * s * .5, y + Math.sin(a) * s * .42, s * .07, s * .07, 8), { wash: '#FFF6EA', ink: H5.ink, sw: .3 }); }
  if (sparkle > 0) for (let i = 0; i < 4; i++) { const q = frac(t * 1.2 + i / 4), a = i * 1.7; paint(starPts(x + Math.cos(a) * s * .8, y + Math.sin(a) * s * .6 - q * s * .5, s * .2 * Math.sin(q * Math.PI) * sparkle, .35, 4), { wash: '#FFFFFF', ink: null }); }
}
// all of Lanka on its rock, as a toy: its base centred at (x, y), s wide (gold towers, red domes, a flag)
function h5Lanka(x, y, s, key = 'lk') {
  boilSeed(key);
  paint([[x - s * .5, y - s * .1], [x - s * .36, y + s * .12], [x, y + s * .2], [x + s * .36, y + s * .12], [x + s * .5, y - s * .1]], { wash: H5.rock, fill: H5.rockDk, fillOp: 60, tex: .5, ink: H5.ink, sw: .9, curv: .4 });
  const TW = [[-.36, .26], [-.18, .4], [0, .56], [.18, .36], [.36, .24]];
  for (const [d, h] of TW) {
    const tx = x + d * s, w = s * .13;
    paint(rectPts(tx - w / 2, y - s * .1 - s * h, w, s * h), { wash: H5.tower, fill: H5.towerDk, fillOp: 50, tex: .3, ink: H5.ink, sw: .7 });
    paint(ellPts(tx, y - s * .1 - s * h, w * .62, w * .5, 12), { wash: H5.dome, ink: H5.ink, sw: .6 });
    paint(rectPts(tx - w * .15, y - s * .1 - s * h * .5, w * .3, w * .4), { wash: '#FFE9A0', ink: null });
  }
  inkLine([[x, y - s * .66 - s * .06], [x, y - s * .84]], 1.2, H5.ink, 'ink', 0);
  paint([[x, y - s * .84], [x + s * .12, y - s * .8], [x, y - s * .76]], { wash: H5.ruby, ink: null });
}
// the sea inside a thought bubble: the part of the ellipse (x, y, rx, ry) below cutY, with moving wave lines
function h5Sea(x, y, rx, ry, cutY, t, key = 'bs') {
  boilSeed(key);
  const P = []; for (let i = 0; i <= 30; i++) { const a = i / 30 * Math.PI; const py = y + Math.sin(a) * ry * .97; if (py >= cutY) P.push([x + Math.cos(a) * rx * .97, py]); }
  const w = Math.sqrt(Math.max(0, 1 - Math.pow((cutY - y) / ry, 2))) * rx * .97;
  paint([[x + w, cutY], ...P, [x - w, cutY]], { wash: H5.sea, fill: H5.seaDk, fillOp: 60, tex: .3, ink: null });
  for (let i = 0; i < 5; i++) { const yy = cutY + 16 + i * 18, hw = w * (1 - i * .16) * .7, ox = 30 * Math.sin(t * 1.6 + i); inkLine([[x - hw + ox, yy], [x - hw * .3 + ox, yy - 6], [x + hw * .4 + ox, yy]], 1.3, H5.seaLt, 'inkfine', .5); }
}
// a fish's head out of the water at (x, y), s wide, facing dir (1 right), its mouth open by open 0..1
function h5Fish(x, y, s, open = 1, dir = 1, key = 'fs') {
  boilSeed(key);
  push(); translate(x, y); scale(dir, 1);
  paint([[-s * .5, s * .3], [-s * .45, -s * .2], [-s * .1, -s * .45], [s * .35, -s * .35], [s * .5, -s * .05 - s * .12 * open], [s * .2, -s * .02], [s * .5, s * .05 + s * .12 * open], [s * .3, s * .3]], { wash: '#F28A3A', fill: '#C8601E', fillOp: 50, tex: .3, ink: H5.ink, sw: .7, curv: .4 });
  paint(ellPts(s * .12, -s * .2, s * .1, s * .11, 10), { wash: '#FFFFFF', ink: H5.ink, sw: .5 });
  paint(ellPts(s * .15, -s * .2, s * .05, s * .06, 8), { wash: H5.ink, ink: null });
  pop();
}
// a numbered badge: a gold disc with a dark numeral, centred at (x, y), s across; k pops it
function h5Badge(x, y, s, n, k = 1, key = 'bg') {
  if (k <= 0) return;
  boilSeed(key);
  const p = backOut(k);
  paint(ellPts(x, y, s * .5 * p, s * .5 * p, 22), { wash: H5.gold, fill: '#C8922A', fillOp: 40, tex: .3, ink: H5.ink, sw: 1.4 });
  letter(String(n), x, y + s * .04, s * .78 * p, H5.ink, { rot: -.06 });
}
// a crescent moon centred at (x, y), s across, with its glow
function h5Moon(x, y, s, key = 'mn') {
  boilSeed(key);
  glow(x, y, s * 2.2, '#FFF4D2', .45);
  const P = []; for (let i = 0; i <= 16; i++) { const a = -Math.PI / 2 + i / 16 * Math.PI; P.push([x + Math.cos(a) * s * .5, y + Math.sin(a) * s * .5]); }
  for (let i = 16; i >= 0; i--) { const a = -Math.PI / 2 + i / 16 * Math.PI; P.push([x + Math.cos(a) * s * .18, y + Math.sin(a) * s * .44]); }
  paint(P, { wash: '#FFF4D2', ink: H5.ink, sw: .7 });
}
// a rakshasa guard (Ramayan Part 10): Chanda's rig, with a sword
function guard(x, y, u, o = {}) { asura(x, y, u, { kind: 'chanda', shield: false, ...o }); }
