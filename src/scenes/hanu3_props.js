// hanu3_props.js: sets and props for hanu3.js (ad 88, Hanuman Part 3, "HANUMAN met RAM in DISGUISE"). Loaded after
// src/hanuman_series.js and src/ramayan_sets.js (P1, warmBack, tree, bush, notes). Pure functions of their arguments
// (and T for boil). Sets stay inside x -300..1380.
//   H3                                         the palette
//   h3Hill, h3Pampa, h3Dusk, h3Night           sets: Rishyamuka's ledge over the valley, lake Pampa's bank, the dusk
//                                              sky they cross, the night over Lanka (the tease)
//   h3Rock, h3Bubble, h3Veda, h3Eleph, h3Lotus, h3Sword, h3Crown, h3Halo, h3Leaf, h3Lines     props
const H3 = {
  ink: '#2B2233', skyHi: '#9CC3E6', skyLo: '#FCE3BE', hill: '#9DB88A', hillDk: '#7E9E70', far: '#B4C8B0',
  rock: '#C2A688', rockDk: '#8E745C', rockLt: '#E2CCAE', boulder: '#A8907A', boulderDk: '#7A6652',
  lake: '#6FB2D2', lakeLt: '#B8E0EE', lotus: '#F4A6B8', lotusDk: '#D9668A', pad: '#5E9A5A',
  grass: '#8DB86A', grassDk: '#6E9A50',
  duskHi: '#EE8A5E', duskLo: '#FFD9A0', duskCl: '#FFE9CC', duskClDk: '#F2B890', duskHill: '#8A5A6A', duskHillDk: '#6A4258',
  night: '#1E1838', nightLo: '#3A2A5A', moon: '#FFF2C8', palm: '#E6C88A', palmDk: '#B8945A',
};

// ---------- sets ----------
// Rishyamuka: a rocky ledge (the ground runs about y 1790 for x > 450) over a green valley with lake Pampa far below
// on the left (its near bank about y 1470, where the two strangers walk)
function h3Hill(t, key = 'hl') {
  boilSeed(key + 'sky');
  paint(rectPts(-300, -600, W + 600, 2400), { wash: H3.skyHi, ink: null });
  paint(ellPts(540, 1250, 1100, 420, 26), { fill: H3.skyLo, fillOp: 225, bleed: .3, tex: .4, ink: null });
  for (let i = 0; i < 3; i++) cloudPuff(160 + i * 360 + 20 * Math.sin(t * .4 + i), 820 + 90 * hash(i * 3.3), 110, key + 'c' + i, 235);
  boilSeed(key + 'far');
  paint([[-300, 1330], [-60, 1180], [180, 1270], [420, 1130], [640, 1260], [900, 1160], [1380, 1280], [1380, 1500], [-300, 1500]], { wash: H3.far, fill: H3.hillDk, fillOp: 30, tex: .4, ink: null, curv: .4 });
  boilSeed(key + 'valley');
  paint(rectPts(-300, 1380, W + 600, 700), { wash: H3.hill, ink: null });
  paint(ellPts(300, 1600, 700, 160, 22), { fill: H3.hillDk, fillOp: 60, bleed: .3, tex: .5, ink: null });
  paint(ellPts(210, 1415, 330, 40, 20), { wash: H3.lake, ink: null });
  for (let i = 0; i < 4; i++) { const x = frac(hash(i * 7.7) + t * .03) * 520 - 60, y = 1400 + hash(i * 2.3) * 30; inkLine([[x, y], [x + 40, y]], 1.1, H3.lakeLt, 'inkfine', 0); }
  tree(-10, 1420, 150, key + 'ta', Math.sin(t * .8) * .2); tree(470, 1400, 120, key + 'tb', Math.sin(t * .7 + 1) * .2);
  bush(120, 1560, 46, key + 'ba'); bush(420, 1600, 40, key + 'bb');
  boilSeed(key + 'wall');
  paint([[870, 1800], [900, 1420], [990, 1150], [1130, 1010], [1380, 960], [1380, 1900]], { wash: H3.rock, fill: H3.rockDk, fillOp: 60, tex: .6, ink: H3.ink, sw: 1.2, curv: .25 });
  for (let i = 0; i < 4; i++) inkLine([[960 + i * 90, 1260 + (i % 2) * 70], [990 + i * 90, 1350 + (i % 2) * 60]], 1.1, H3.rockDk, 'inkfine', .3);
  boilSeed(key + 'ledge');
  paint([[-300, 2500], [-300, 1990], [100, 1930], [330, 1820], [560, 1770], [900, 1760], [1380, 1772], [1380, 2500]], { wash: H3.rockLt, fill: H3.rockDk, fillOp: 45, tex: .6, ink: H3.ink, sw: 1.3, curv: .3 });
  for (let i = 0; i < 5; i++) inkLine([[380 + i * 190, 1900 + (i % 2) * 50], [430 + i * 190, 1980 + (i % 2) * 40]], 1.1, H3.rockDk, 'inkfine', .3);
  bush(1010, 1776, 70, key + 'bc');
}
// a boulder, its base centred on (x, y), s wide
function h3Rock(x, y, s, key = 'rk') {
  boilSeed(key);
  paint([[x - s * .5, y], [x - s * .46, y - s * .42], [x - s * .2, y - s * .74], [x + s * .16, y - s * .8], [x + s * .44, y - s * .5], [x + s * .5, y]], { wash: H3.boulder, fill: H3.boulderDk, fillOp: 55, tex: .6, ink: H3.ink, sw: 1.3, curv: .35 });
  paint(ellPts(x - s * .12, y - s * .56, s * .16, s * .07, 10, 0, -.3), { wash: '#FFFFFF', washOp: 70, ink: null });
  inkLine([[x + s * .1, y - s * .5], [x + s * .2, y - s * .28]], 1, H3.boulderDk, 'inkfine', .3);
}
// lake Pampa: a blue lake with lotuses, hills and trees beyond, a grassy bank (the ground runs about y 1840)
function h3Pampa(t, key = 'pp') {
  boilSeed(key + 'sky');
  paint(rectPts(-300, -600, W + 600, 2400), { wash: H3.skyHi, ink: null });
  paint(ellPts(540, 1050, 1100, 380, 26), { fill: H3.skyLo, fillOp: 220, bleed: .3, tex: .4, ink: null });
  for (let i = 0; i < 2; i++) cloudPuff(240 + i * 520 + 20 * Math.sin(t * .4 + i), 800 + 60 * i, 120, key + 'c' + i, 235);
  paint([[-300, 1200], [-100, 980], [200, 1080], [600, 900], [1000, 1060], [1380, 960], [1380, 1260], [-300, 1260]], { wash: H3.hill, fill: H3.hillDk, fillOp: 40, tex: .4, ink: null, curv: .5 });
  boilSeed(key + 'lake');
  paint(rectPts(-300, 1240, W + 600, 300), { wash: H3.lake, ink: null });
  for (let i = 0; i < 8; i++) { const x = frac(hash(i * 7.7) + t * .03) * 1500 - 200, y = 1270 + hash(i * 2.3) * 240; inkLine([[x, y], [x + 70, y]], 1.4, H3.lakeLt, 'inkfine', 0); }
  for (let i = 0; i < 6; i++) h3Lotus(80 + i * 185, 1300 + hash(i * 3.3) * 180, 30, key + 'lo' + i, 1);
  boilSeed(key + 'bank');
  paint(rectPts(-300, 1530, W + 600, 1100), { wash: H3.grass, ink: null });
  paint(ellPts(540, 1850, 900, 260, 22), { fill: H3.grassDk, fillOp: 70, bleed: .3, tex: .5, ink: null });
  inkLine([[-100, 1532], [500, 1522], [1200, 1536]], .9, H3.ink, 'ink', .5);
  tree(-40, 1560, 640, key + 'ta', Math.sin(t * .8) * .2);
  tree(1090, 1570, 520, key + 'tb', Math.sin(t * .7 + 2) * .2);
  bush(980, 1600, 60, key + 'ba');
}
// the dusk sky they cross: clouds and far hills stream by (dir: +1 they stream to the right)
function h3Dusk(t, dir = 1, key = 'dk') {
  boilSeed(key);
  paint(rectPts(-300, -600, W + 600, 3200), { wash: H3.duskHi, ink: null });
  paint(ellPts(540, 1500, 1200, 760, 26), { fill: H3.duskLo, fillOp: 230, bleed: .3, tex: .4, ink: null });
  glow(300, 1560, 420, '#FFF2C0', .6);
  paint(ellPts(300, 1560, 120, 120, 26), { wash: '#FFF4D2', ink: null });
  for (let i = 0; i < 6; i++) { const x = frac(hash(i * 5.3) + dir * t * .09 * (.6 + hash(i) * .8)) * 1700 - 300; cloudPuff(x, 760 + hash(i * 2.9) * 900, 110 + 90 * hash(i * 1.7), key + i, 235, H3.duskCl, H3.duskClDk); }
  boilSeed(key + 'hills');
  const off = frac(dir * t * .05) * 520;
  const P = [[-300, 2500], [-300, 1900]]; for (let i = -1; i < 5; i++) { const x = -300 + i * 520 + off; P.push([x + 130, 1800], [x + 260, 1700 + 40 * (i % 2)], [x + 390, 1830]); }
  P.push([1380, 1900], [1380, 2500]);
  paint(P.filter(p => p[0] >= -300 && p[0] <= 1380), { wash: H3.duskHill, fill: H3.duskHillDk, fillOp: 50, tex: .5, ink: null, curv: .4 });
}
// night (the tease): a deep sky, a moon, stars, a dark ground
function h3Night(t, key = 'nt') {
  boilSeed(key);
  paint(rectPts(-300, -600, W + 600, 3200), { wash: H3.night, ink: null });
  paint(ellPts(540, 1300, 1000, 700, 26), { fill: H3.nightLo, fillOp: 220, bleed: .3, tex: .4, ink: null });
  glow(800, 900, 300, H3.moon, .45); paint(ellPts(800, 900, 84, 84, 24), { wash: H3.moon, ink: null });
  paint(ellPts(770, 880, 22, 16, 10), { wash: '#E6D8A8', washOp: 160, ink: null });
  boilSeed(key + 'st');
  for (let i = 0; i < 14; i++) { const x = 40 + hash(i * 2.3) * 1000, y = 720 + hash(i * 6.7) * 520, s = 4 + 7 * hash(i * 3.3) * (.5 + .5 * Math.sin(t * 2.4 + i * 1.7)); paint(starPts(x, y, s, .32, 4), { wash: '#FFFFFF', washOp: 210, ink: null }); }
  boilSeed(key + 'gr');
  paint([[-300, 1600], [200, 1570], [540, 1560], [880, 1572], [1380, 1600], [1380, 2500], [-300, 2500]], { wash: '#2E2850', fill: '#1A1634', fillOp: 60, tex: .5, ink: H3.ink, sw: 1.1, curv: .3 });
}

// ---------- props ----------
// a lotus on its pad; open 0..1
function h3Lotus(x, y, s, key = 'lo', open = 1) {
  boilSeed(key);
  paint(ellPts(x, y, s, s * .34, 10), { wash: H3.pad, ink: null });
  for (const a of [-.9, -.45, 0, .45, .9]) { const c = Math.sin(a * open), d = Math.cos(a * open); paint([[x - s * .22, y - s * .1], [x + c * s * .9, y - s * .1 - d * s * .95], [x + s * .22, y - s * .1]], { wash: a ? H3.lotus : '#FFD2DE', ink: H3.ink, sw: clamp(s / 50, .4, 1), curv: .5 }); }
}
// a thought / speech bubble: a white cloud of rx × ry at (x, y), its little tail of dots toward (tx, ty); k pops it
function h3Bubble(x, y, rx, ry, tx, ty, k = 1, key = 'bb') {
  if (k <= 0) return;
  boilSeed(key);
  push(); translate(x, y); scale(k); translate(-x, -y);
  for (const [f, r] of [[.94, 13], [.8, 20]]) paint(ellPts(lerp(x, tx, f), lerp(y, ty, f), r, r, 12), { wash: '#FFFDF6', ink: H3.ink, sw: 1 });
  paint(ellPts(x, y, rx, ry, 30), { wash: '#FFFDF6', ink: H3.ink, sw: 1.5 });
  pop();
}
// a Veda: a palm-leaf manuscript tied with a red cord, s wide
function h3Veda(x, y, s, key = 'vd') {
  boilSeed(key);
  glow(x, y, s * 1.1, '#FFE9A0', .6);
  for (let i = 2; i >= 0; i--) paint(rrPts(x - s * .5, y - s * .16 - i * s * .09, s, s * .3, s * .05), { wash: i ? H3.palmDk : H3.palm, ink: H3.ink, sw: .9 });
  for (const d of [-.26, .26]) { inkLine([[x + d * s, y - s * .36], [x + d * s, y + s * .15]], 2.4, '#C8322E', 'ink', 0); paint(ellPts(x + d * s, y - s * .1, s * .035, s * .035, 8), { wash: '#7A2A22', ink: null }); }
  for (let i = 0; i < 3; i++) inkLine([[x - s * .16, y - s * .2 + i * s * .07], [x + s * .16, y - s * .2 + i * s * .07]], .7, H3.palmDk, 'inkfine', 0);
}
// a little elephant's face, trunk up (arms "like elephants' trunks")
function h3Eleph(x, y, s, key = 'el') {
  boilSeed(key);
  const C = '#A9B4C6', D = '#7E8AA0';
  for (const d of [-1, 1]) paint(ellPts(x + d * s * .62, y - s * .1, s * .42, s * .5, 14), { wash: C, fill: '#F2B8C0', fillOp: 90, ink: H3.ink, sw: 1 });
  paint(ribbon([[x, y + s * .1], [x + s * .1, y + s * .55], [x + s * .5, y + s * .62], [x + s * .62, y + s * .2]], s * .34, s * .2), { wash: C, fill: D, fillOp: 40, ink: H3.ink, sw: 1 });
  paint(ellPts(x, y - s * .08, s * .56, s * .54, 18), { wash: C, fill: D, fillOp: 30, tex: .4, ink: H3.ink, sw: 1.1 });
  for (const d of [-1, 1]) { paint(ellPts(x + d * s * .22, y - s * .14, s * .09, s * .11, 8), { wash: H3.ink, ink: null }); paint(ellPts(x + d * s * .2, y - s * .18, s * .03, s * .03, 6), { wash: '#FFFFFF', ink: null }); paint(ellPts(x + d * s * .36, y + s * .08, s * .1, s * .06, 8), { wash: '#F2889A', washOp: 150, ink: null }); }
}
// a sword, hilt at (x, y), s long, pointing up; droop 0..1 lets the blade go soft and flop over
function h3Sword(x, y, s, droop = 0, key = 'sd') {
  boilSeed(key);
  const P = []; for (let i = 0; i <= 6; i++) { const k = i / 6, a = droop * k * k * 2.6; P.push([x + Math.sin(a) * s * k * .75, y - s * k * (1 - droop * k * .75)]); }
  paint(ribbon(P, s * .16, s * .05), { wash: '#DCE2EC', fill: '#9AA6BC', fillOp: 50, ink: H3.ink, sw: 1 });
  paint(rrPts(x - s * .2, y - s * .02, s * .4, s * .08, s * .03), { wash: '#E8B84A', ink: H3.ink, sw: .9 });
  paint(rrPts(x - s * .05, y + s * .05, s * .1, s * .22, s * .04), { wash: '#8A5230', ink: H3.ink, sw: .9 });
}
// an imagined crown and an imagined halo ("you look like kings… or gods"), drawn pale over a head at (x, y)
function h3Crown(x, y, s, k = 1, key = 'cr') {
  if (k <= 0) return; boilSeed(key);
  push(); translate(x, y); scale(k);
  paint([[-s * .5, 0], [-s * .56, -s * .5], [-s * .26, -s * .26], [0, -s * .7], [s * .26, -s * .26], [s * .56, -s * .5], [s * .5, 0]], { wash: '#FFE27A', washOp: 215, ink: H3.ink, sw: 1, curv: .1 });
  paint(ellPts(0, -s * .22, s * .08, s * .1, 8), { wash: '#E2452B', ink: null });
  pop();
}
function h3Halo(x, y, s, k = 1, key = 'ha') {
  if (k <= 0) return; boilSeed(key);
  glow(x, y, s * 1.5 * k, '#FFF2B0', .7);
  inkLine(ellPts(x, y, s * .6 * k, s * .2 * k, 20), 5, '#FFE27A', 'ink', .5);
}
function h3Leaf(x, y, s, rot = 0, key = 'lf', col = '#5EA85A') {
  boilSeed(key);
  push(); translate(x, y); rotate(rot);
  paint([[-s, 0], [-s * .3, -s * .42], [s * .5, -s * .36], [s, 0], [s * .5, s * .36], [-s * .3, s * .42]], { wash: col, ink: H3.ink, sw: .8, curv: .5 });
  inkLine([[-s * .9, 0], [s * .9, 0]], .8, '#3A7A3E', 'inkfine', 0);
  pop();
}
// speed lines streaming from (x, y) at angle a
function h3Lines(x, y, a, len, n, key = 'ln', col = '#FFFFFF') {
  boilSeed(key);
  const c = Math.cos(a), s = Math.sin(a);
  for (let i = 0; i < n; i++) { const o = (hash(i * 3.1) - .5) * 520, d = 80 + hash(i * 5.7) * 160, l = len * (.5 + hash(i * 2.3)); const px = x + c * d - s * o, py = y + s * d + c * o; inkLine([[px, py], [px + c * l, py + s * l]], 2.6, col, 'inkfine', 0); }
}
