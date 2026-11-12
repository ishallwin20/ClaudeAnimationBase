// hanu2_props.js: sets and props for hanu2.js (ad 86, Hanuman Part 2, "The day baby HANUMAN got 8 SUPERPOWERS").
// Loaded after src/hanuman_series.js and src/ramayan_sets.js (P1, ashram, tree, bush). Pure functions of their
// arguments (and T for boil).
//   H2, BOON_COL                               the palette; the eight boons' colours (in the text's order)
//   h2Sky, h2Storm, h2Peak, h2Grey, h2CaveIn, h2Stage     sets
//   h2Sun, h2Bird, h2Leaf, h2Bolt, h2Wave, h2Pot, h2Ladle, h2Garland, h2Book, h2Blade, h2WindLines     props
//   boonIcon(i, x, y, s, grey)                 the eight icons: bolt, sun, drop, heart, mace, trident, lotus, hammer
//   boonSlots(t, st, a)                        the row of eight numbered slots, bottom of the safe band (screen space)
const H2 = {
  ink: '#2B2233', skyHi: '#8EC4EE', skyLo: '#FFE9BE', cloud: '#FFFDF6', cloudDk: '#DCE6F2',
  storm: '#3E4668', stormLo: '#7E86A6', stormCl: '#5A6284', stormClDk: '#3A4262',
  rock: '#9A8E84', rockDk: '#6E625C', rockLt: '#C2B6A8', peak: '#A8B4CC', peakDk: '#7E8AA6', cave: '#2A2030', moss: '#8CAA6E',
  grey: '#B4BAC4', greyLo: '#D8DBE0', greyCl: '#E6E9EE', greyClDk: '#B8BEC8',
  caveWall: '#3A2E3E', caveWallLt: '#5E4A52', caveWarm: '#C88A5A', caveGold: '#FFD98A',
  leaf: '#5EA85A', leafDk: '#3A7A3E', leafLt: '#9AD288',
  clay: '#C8703E', clayDk: '#96481E', clayLt: '#E8A070', ghee: '#F2D060', wood: '#A5764A', woodDk: '#74502E', woodLt: '#CDA071',
  sun: '#FFB52E', sunDk: '#F0801E', sunLt: '#FFE27A',
};
// Indra, Surya, Varuna, Yama, Kubera, Shiva, Brahma, Vishvakarma (Uttara 36.10–21)
const BOON_COL = ['#FFD24A', '#FF9A3A', '#5EB8F2', '#F2557A', '#E8A82A', '#A884F2', '#F28AC8', '#9AA6BC'];

// ---------- sets ----------
// the morning sky he flies up through: clouds stream down past him (speed px/s)
function h2Sky(t, speed = 900, key = 'sk') {
  boilSeed(key);
  paint(rectPts(-600, -600, W + 1200, H + 1200), { wash: H2.skyHi, ink: null });
  paint(ellPts(540, 1750, 1300, 800, 26), { fill: H2.skyLo, fillOp: 220, bleed: .3, tex: .4, ink: null });
  for (let i = 0; i < 6; i++) { const y = frac(hash(i * 5.3) + t * speed / 2600 * (.6 + hash(i) * .8)) * 2700 - 300; cloudPuff(60 + hash(i * 2.9) * 960, y, 110 + 90 * hash(i * 1.7), key + i, 235, H2.cloud, H2.cloudDk); }
}
// a storm sky (Indra comes); day 0..1 clears it
function h2Storm(t, day = 0, key = 'st') {
  boilSeed(key);
  paint(rectPts(-600, -600, W + 1200, H + 1200), { wash: mixCol(H2.storm, H2.skyHi, day), ink: null });
  paint(ellPts(540, 1650, 1300, 800, 26), { fill: mixCol(H2.stormLo, H2.skyLo, day), fillOp: 220, bleed: .3, tex: .4, ink: null });
  for (let i = 0; i < 5; i++) cloudPuff(-40 + i * 290 + 20 * Math.sin(t * .5 + i), 720 + 110 * hash(i * 3.1), 210, key + 'c' + i, 255, mixCol(H2.stormCl, H2.cloud, day), mixCol(H2.stormClDk, H2.cloudDk, day));
}
// the mountain where he fell: sky, far peaks, a rock face on the right with a cave mouth (centre about (800, 1500)),
// a ledge. grey 0..1 drains the colour (the wind has stopped); dark 0..1 fills the cave mouth
const H2_CAVE = [800, 1560];
function h2Peak(t, grey = 0, key = 'pk') {
  const g = c => mixCol(c, '#B8BCC4', grey * .75);
  boilSeed(key + 'sky');
  paint(rectPts(-600, -600, W + 1200, 2400), { wash: g(H2.skyHi), ink: null });
  paint(ellPts(540, 1500, 1300, 700, 26), { fill: g(H2.skyLo), fillOp: 230, bleed: .3, tex: .4, ink: null });
  for (let i = 0; i < 3; i++) cloudPuff(120 + i * 380 + (1 - grey) * 24 * Math.sin(t * .4 + i), 780 + 120 * hash(i * 3.3), 110, key + 'c' + i, 230, g(H2.cloud), g(H2.cloudDk));
  boilSeed(key + 'far');
  paint([[-300, 1560], [-40, 1340], [160, 1450], [360, 1260], [560, 1430], [800, 1300], [1380, 1420], [1380, 2300], [-300, 2300]], { wash: g(H2.peak), fill: g(H2.peakDk), fillOp: 50, tex: .5, ink: null, curv: .25 });
  boilSeed(key + 'face');
  paint([[520, 1760], [560, 1420], [650, 1210], [800, 1120], [960, 1150], [1380, 1080], [1380, 2300], [520, 2300]], { wash: g(H2.rock), fill: g(H2.rockDk), fillOp: 55, tex: .6, ink: H2.ink, sw: 1.3, curv: .3 });
  for (let i = 0; i < 4; i++) inkLine([[620 + i * 120, 1270 + (i % 2) * 50], [650 + i * 120, 1350 + (i % 2) * 40]], 1.1, g(H2.rockDk), 'inkfine', .3);
  boilSeed(key + 'mouth');
  paint([[660, 1760], [668, 1560], [720, 1420], [800, 1370], [880, 1420], [932, 1560], [940, 1760]], { wash: H2.cave, ink: H2.ink, sw: 1.6, curv: .5 });
  boilSeed(key + 'ledge');
  paint([[-300, 1760], [-40, 1722], [260, 1712], [560, 1716], [860, 1722], [1380, 1740], [1380, 2400], [-300, 2400]], { wash: g(H2.rockLt), fill: g(H2.rockDk), fillOp: 45, tex: .6, ink: H2.ink, sw: 1.2, curv: .3 });
  paint(ellPts(300, 1736, 300, 18, 14), { wash: g(H2.moss), washOp: 180, ink: null });
  for (let i = 0; i < 5; i++) inkLine([[60 + i * 230, 1820 + (i % 2) * 40], [110 + i * 230, 1900 + (i % 2) * 30]], 1.1, g(H2.rockDk), 'inkfine', .3);
}
// a still, colourless sky above the clouds: nothing moves
function h2Grey(t, key = 'gy') {
  boilSeed(key);
  paint(rectPts(-600, -600, W + 1200, H + 1200), { wash: H2.grey, ink: null });
  paint(ellPts(540, 1500, 1300, 800, 26), { fill: H2.greyLo, fillOp: 220, bleed: .3, tex: .4, ink: null });
  for (let i = 0; i < 4; i++) cloudPuff(60 + i * 320, 1760 + 50 * hash(i * 4.4), 260, key + 'f' + i, 255, H2.greyCl, H2.greyClDk);
  boilSeed(key + 'floor');
  paint(rectPts(-600, 1840, W + 1200, 900), { wash: H2.greyCl, ink: null });
}
// inside the cave: dark rock, stalactites, a floor; lit 0..1 fills it with Brahma's gold light from (lx, ly)
function h2CaveIn(t, lit = 0, lx = 760, ly = 1000, key = 'ci') {
  boilSeed(key + 'wall');
  paint(rectPts(-600, -600, W + 1200, H + 1200), { wash: mixCol(H2.caveWall, H2.caveWarm, lit * .7), ink: null });
  paint(ellPts(540, 1150, 620, 900, 30), { fill: mixCol(H2.caveWallLt, H2.caveGold, lit * .8), fillOp: 230, bleed: .3, tex: .5, ink: null });
  if (lit > 0) { glow(lx, ly, 700 * lit + 80, '#FFE2A0', .7 * lit); glow(lx, ly, 1200 * lit, '#FFC870', .25 * lit); }
  boilSeed(key + 'tites');
  for (const [x0, w, l] of [[90, 90, 330], [260, 60, 210], [420, 70, 150], [650, 60, 170], [830, 80, 250], [1000, 100, 360]]) paint([[x0 - w, 250], [x0 + w, 250], [x0 + w * .3, 250 + l * .7], [x0, 250 + l], [x0 - w * .3, 250 + l * .7]], { wash: mixCol('#241C2A', '#6A4A40', lit * .5), ink: H2.ink, sw: 1, curv: .2 });
  paint(rectPts(-600, -600, W + 1200, 870), { wash: mixCol('#241C2A', '#6A4A40', lit * .5), ink: null });
  boilSeed(key + 'floor');
  paint([[-300, 1700], [200, 1680], [540, 1672], [880, 1682], [1380, 1700], [1380, 2400], [-300, 2400]], { wash: mixCol('#2E2434', '#8A5E48', lit * .7), fill: '#1E1826', fillOp: 50, tex: .5, ink: H2.ink, sw: 1.1, curv: .3 });
  for (let i = 0; i < 4; i++) paint(ellPts(140 + i * 270, 1790 + (i % 2) * 50, 70, 16, 10), { wash: mixCol('#3E3246', '#B88A62', lit * .7), washOp: 160, ink: null });
}
// the boon stage: the cave filled with light, tinted by the god who is giving; a bank of cloud for a floor
function h2Stage(t, col = '#FFD98A', key = 'sg') {
  boilSeed(key + 'bg');
  paint(rectPts(-600, -600, W + 1200, H + 1200), { wash: mixCol('#F6D9A6', col, .28), ink: null });
  paint(ellPts(540, 1120, 780, 900, 30), { fill: mixCol('#FFF1CC', col, .14), fillOp: 225, bleed: .3, tex: .4, border: .3, ink: null });
  glow(540, 1100, 640, mixCol('#FFE2A0', col, .3), .4);
  boilSeed(key + 'sp');
  for (let i = 0; i < 12; i++) { const x = 60 + hash(i * 2.3) * 960, y = 700 + hash(i * 6.7) * 560, s = 5 + 8 * hash(i * 3.3) * (.5 + .5 * Math.sin(t * 2.4 + i * 1.7)); paint(starPts(x, y, s, .32, 4), { wash: '#FFFFFF', washOp: 210, ink: null }); }
  for (let i = 0; i < 5; i++) cloudPuff(-60 + i * 300 + 14 * Math.sin(t * .4 + i * 2), 1400 + 26 * hash(i * 4.4), 230, key + 'f' + i, 255, '#FFFDF6', mixCol('#F0DCC8', col, .25));
  boilSeed(key + 'floor');
  paint(rectPts(-600, 1450, W + 1200, 900), { wash: '#FFFDF6', ink: null });
}

// ---------- props ----------
// the rising Sun, as the hungry baby sees it: a ripe red-gold fruit with a face. o: eyes 'open' | 'wide', mouth 'smile' | 'O'
function h2Sun(x, y, R, t, o = {}) {
  boilSeed(o.key || 'sun');
  glow(x, y, R * 2.4, H2.sunLt, .7); glow(x, y, R * 1.5, H2.sun, .5);
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU + t * .4, c = Math.cos(a), s = Math.sin(a), r0 = R * 1.06, r1 = R * (1.34 + .06 * Math.sin(t * 5 + i)); paint([[x + Math.cos(a - .1) * r0, y + Math.sin(a - .1) * r0], [x + c * r1, y + s * r1], [x + Math.cos(a + .1) * r0, y + Math.sin(a + .1) * r0]], { wash: H2.sun, ink: H2.ink, sw: .8, curv: .2 }); }
  paint(ellPts(x, y, R, R, 30), { wash: H2.sun, fill: H2.sunDk, fillOp: 50, tex: .5, ink: H2.ink, sw: 1.4 });
  paint(ellPts(x - R * .32, y - R * .36, R * .34, R * .2, 12, 0, -.5), { wash: H2.sunLt, washOp: 200, ink: null });
  const wide = o.eyes === 'wide', ey = y - R * .08;
  for (const s of [-1, 1]) {
    paint(ellPts(x + s * R * .36, ey, R * (wide ? .15 : .11), R * (wide ? .19 : .15), 12), { wash: '#FFFFFF', ink: H2.ink, sw: .9 });
    paint(ellPts(x + s * R * .36 + (o.lookX || 0) * R * .05, ey + (o.lookY || 0) * R * .05, R * .07, R * .09, 10), { wash: H2.ink, ink: null });
    paint(ellPts(x + s * R * .58, y + R * .2, R * .13, R * .08, 10), { wash: '#F2645A', washOp: 150, ink: null });
  }
  if (o.mouth === 'O') paint(ellPts(x, y + R * .34, R * .1, R * .14, 10), { wash: '#8E3A26', ink: H2.ink, sw: .8 });
  else inkLine([[x - R * .16, y + R * .28], [x, y + R * .38], [x + R * .16, y + R * .28]], 2, H2.ink, 'ink', .6);
  if (o.sweat) paint([[x + R * .72, y - R * .5], [x + R * .82, y - R * .3], [x + R * .72, y - R * .22], [x + R * .62, y - R * .3]], { wash: '#BFE4FF', ink: H2.ink, sw: .7, curv: .5 });
}
// a little bird, side view facing left; flap: wing phase (0 = held still)
function h2Bird(x, y, s, flap = 0, key = 'bird', col = '#7E6A5A') {
  boilSeed(key);
  paint(ellPts(x, y, s, s * .62, 14), { wash: col, ink: H2.ink, sw: .9 });
  paint(ellPts(x - s * .75, y - s * .3, s * .46, s * .42, 12), { wash: col, ink: H2.ink, sw: .9 });
  paint([[x - s * 1.15, y - s * .36], [x - s * 1.6, y - s * .22], [x - s * 1.15, y - s * .12]], { wash: '#F2A23A', ink: H2.ink, sw: .7 });
  paint(ellPts(x - s * .84, y - s * .38, s * .1, s * .12, 8), { wash: '#FFFFFF', ink: H2.ink, sw: .5 }); paint(ellPts(x - s * .86, y - s * .37, s * .05, s * .06, 6), { wash: H2.ink, ink: null });
  const w = Math.sin(flap) * .9;
  paint([[x - s * .3, y - s * .2], [x + s * .3, y - s * .2 - s * (1.0 + w * .5)], [x + s * .8, y - s * .1 - s * w * .4], [x + s * .5, y + s * .1]], { wash: mixCol(col, '#000000', .2), ink: H2.ink, sw: .8, curv: .4 });
  paint([[x + s * .9, y], [x + s * 1.6, y - s * .2], [x + s * 1.5, y + s * .25]], { wash: col, ink: H2.ink, sw: .7 });
}
function h2Leaf(x, y, s, rot = 0, key = 'leaf', col = H2.leaf) {
  boilSeed(key);
  push(); translate(x, y); rotate(rot);
  paint([[-s, 0], [-s * .3, -s * .42], [s * .5, -s * .36], [s, 0], [s * .5, s * .36], [-s * .3, s * .42]], { wash: col, ink: H2.ink, sw: .8, curv: .5 });
  inkLine([[-s * .9, 0], [s * .9, 0]], .8, H2.leafDk, 'inkfine', 0);
  pop();
}
// a thunderbolt, s tall, pointing down
function h2Bolt(x, y, s, key = 'bolt', col = '#FFD24A') {
  boilSeed(key);
  paint([[.15, -.5], [-.3, .03], [-.04, .03], [-.18, .5], [.3, -.1], [.04, -.1], [.22, -.5]].map(([a, b]) => [x + a * s, y + b * s]), { wash: col, ink: H2.ink, sw: clamp(s / 60, .6, 1.6) });
}
// a wave rolling in from the left to (x, y): w wide, h tall, k 0..1 (rises, curls, falls away)
function h2Wave(x, y, w, h, k, t, key = 'wave') {
  if (k <= 0 || k >= 1) return;
  boilSeed(key);
  const up = Math.sin(k * Math.PI), P = [[x - w, y + 40]];
  const topAt = u => y + 30 - (h * up + 30) * Math.sin(u * Math.PI) ** .45 + h * .1 * Math.sin(u * 9 + t * 6) * up, top = topAt(.5);
  for (let i = 0; i <= 14; i++) { const u = i / 14; P.push([x - w + u * 2 * w, topAt(u)]); }
  P.push([x + w, y + 40]);
  paint(P, { wash: '#5EB8F2', fill: '#2E86C8', fillOp: 55, tex: .4, ink: H2.ink, sw: 1.1, curv: .5 });
  for (let i = 0; i < 6; i++) { const u = (i + .5) / 6; paint(ellPts(x - w + u * 2 * w, topAt(u) + 8, 30, 13, 10), { wash: '#F2FAFF', ink: null }); }
  for (let i = 0; i < 7; i++) { const a = hash(i * 3.1), px = x - w * .8 + a * 1.6 * w, py = top - 30 - 90 * hash(i * 1.7) * up; paint([[px, py - 12], [px + 8, py + 2], [px, py + 10], [px - 8, py + 2]], { wash: '#BFE4FF', ink: H2.ink, sw: .6, curv: .5 }); }
}
// a clay pot standing on (x, y), s tall; split 0..1 breaks it in two (ghee spills)
function h2Pot(x, y, s, split = 0, key = 'pot') {
  boilSeed(key);
  const cy = y - s * .44;
  if (split > 0) {
    paint(ellPts(x, y - 2, s * (.3 + .5 * split), s * .08, 16), { wash: H2.ghee, ink: H2.ink, sw: .6 });
    for (const side of [-1, 1]) {
      push(); translate(x + side * s * .14 * split, y); rotate(side * .5 * split); translate(-x, -y);
      const P = [];
      for (let i = 0; i <= 10; i++) { const a = Math.PI / 2 + side * (i / 10) * Math.PI; P.push([x + Math.cos(a) * s * .5, cy + Math.sin(a) * s * .44]); }
      P.push([x + side * s * .06, cy - s * .3], [x - side * s * .05, cy - s * .1], [x + side * s * .04, cy + s * .15]);
      paint(P, { wash: H2.clay, fill: H2.clayDk, fillOp: 50, tex: .5, ink: H2.ink, sw: 1 });
      pop();
    }
    return;
  }
  paint(ellPts(x, cy, s * .5, s * .44, 24), { wash: H2.clay, fill: H2.clayDk, fillOp: 50, tex: .5, ink: H2.ink, sw: 1.1 });
  paint(ellPts(x - s * .18, cy - s * .14, s * .14, s * .1, 12, 0, -.4), { wash: H2.clayLt, washOp: 200, ink: null });
  paint(rrPts(x - s * .2, cy - s * .58, s * .4, s * .16, s * .05), { wash: H2.clay, fill: H2.clayDk, fillOp: 40, tex: .4, ink: H2.ink, sw: 1 });
}
// a sruk (the long wooden yagna ladle) from (x, y) along angle a, len long; cut < 1 snaps it (only the handle end)
function h2Ladle(x, y, len, a, cut = 1, key = 'ladle') {
  boilSeed(key); push(); translate(x, y); rotate(a);
  const L = len * cut;
  paint(ribbon([[0, 0], [L * .5, -len * .005], [L * .97, 0]], len * .06, len * .05), { wash: H2.wood, fill: H2.woodDk, fillOp: 45, tex: .5, ink: H2.ink, sw: 1 });
  if (cut < 1) paint([[L * .97, -len * .03], [L * 1.04, -len * .02], [L, -len * .005], [L * 1.06, len * .01], [L * .99, len * .026], [L * .95, len * .026]], { wash: H2.woodLt, ink: H2.ink, sw: .7 });
  else { paint(ellPts(len * 1.07, 0, len * .13, len * .09, 16), { wash: H2.wood, fill: H2.woodDk, fillOp: 50, tex: .5, ink: H2.ink, sw: 1 }); paint(ellPts(len * 1.08, -len * .02, len * .09, len * .05, 12), { wash: H2.woodDk, ink: null }); }
  pop();
}
// Indra's garland of lotuses (36.10), hanging from (x, y): a loop r wide
function h2Garland(x, y, r, t, key = 'garland') {
  boilSeed(key);
  const P = []; for (let i = 0; i <= 12; i++) { const a = i / 12 * TAU - Math.PI / 2; P.push([x + Math.cos(a) * r * .62 + Math.sin(t * 3) * 4 * (1 + Math.sin(a)) , y + r + Math.sin(a) * r]); }
  inkLine(P, 2, '#6E9A50', 'ink', .6);
  for (let i = 0; i < 9; i++) { const a = i / 9 * TAU - Math.PI / 2 + .35, px = x + Math.cos(a) * r * .62 + Math.sin(t * 3) * 4 * (1 + Math.sin(a)), py = y + r + Math.sin(a) * r; paint(starPts(px, py, r * .26, .5, 6, i), { wash: i % 2 ? '#F28AB0' : '#FFC8DC', ink: H2.ink, sw: .6, curv: .3 }); paint(ellPts(px, py, r * .07, r * .07, 6), { wash: '#F5C542', ink: null }); }
}
// a little palm-leaf book (Surya will teach him)
function h2Book(x, y, s, rot = 0, key = 'book') {
  boilSeed(key); push(); translate(x, y); rotate(rot);
  paint(rrPts(-s, -s * .36, 2 * s, s * .72, s * .08), { wash: '#F2DCA6', fill: '#C8A866', fillOp: 50, tex: .4, ink: H2.ink, sw: 1 });
  for (let i = -1; i <= 1; i++) inkLine([[-s * .78, i * s * .16], [s * .78, i * s * .16]], .9, '#8A6A3A', 'inkfine', 0);
  paint(ellPts(0, 0, s * .09, s * .09, 8), { wash: '#C8362E', ink: null });
  pop();
}
// a weapon blade flying point first along +x from (x, y); bend 0..1 buckles it (it cannot hurt him)
function h2Blade(x, y, s, rot = 0, bend = 0, kind = 0, key = 'blade') {
  boilSeed(key); push(); translate(x, y); rotate(rot);
  const b = bend * s * .5, steel = '#C8D0DC';
  if (kind === 0) {   // a sword
    paint([[-s, -s * .08], [0, -s * .1 - b], [s * .8, -s * .07], [s, 0], [s * .8, s * .07], [0, s * .1 - b], [-s, s * .08]], { wash: steel, fill: '#8E98A8', fillOp: 50, ink: H2.ink, sw: .9, curv: bend ? .5 : .1 });
    paint(rrPts(-s * 1.05, -s * .22, s * .1, s * .44, 3), { wash: '#E8A82A', ink: H2.ink, sw: .7 }); paint(rrPts(-s * 1.4, -s * .06, s * .36, s * .12, 3), { wash: '#8A5A32', ink: H2.ink, sw: .7 });
  } else if (kind === 1) {   // an arrow
    inkLine([[-s * 1.2, 0], [0, -b], [s * .8, 0]], 3.2, '#8A5A32', 'ink', .5);
    paint([[s * .7, -s * .12], [s * 1.05, 0], [s * .7, s * .12]], { wash: steel, ink: H2.ink, sw: .8 });
    for (const k of [-1, 1]) paint([[-s * 1.2, 0], [-s * 1.4, k * s * .14], [-s * 1.05, k * s * .14], [-s * .95, 0]], { wash: '#F2645A', ink: H2.ink, sw: .6 });
  } else {   // a spear
    inkLine([[-s * 1.3, 0], [0, -b], [s * .7, 0]], 4.2, '#A5764A', 'ink', .5);
    paint([[s * .6, -s * .14], [s * .85, -s * .1], [s * 1.15, 0], [s * .85, s * .1], [s * .6, s * .14], [s * .7, 0]], { wash: steel, fill: '#8E98A8', fillOp: 50, ink: H2.ink, sw: .8 });
  }
  pop();
}
// the wind blowing again: pale streaks crossing left to right; k 0..1 its strength
function h2WindLines(t, k, y0 = 700, y1 = 1700, key = 'wl', n = 9) {
  if (k <= 0) return;
  boilSeed(key);
  for (let i = 0; i < n; i++) { const y = y0 + hash(i * 3.3) * (y1 - y0), x = frac(hash(i) + t * (.8 + .5 * hash(i * 2))) * 1700 - 300; inkLine([[x, y], [x + 150, y - 22], [x + 270, y + 6], [x + 360, y - 10]], 3.4 * k, '#FFFFFF', 'ink', .6); }
  for (let i = 0; i < 5; i++) { const x = frac(hash(i * 7.1) + t * .7) * 1500 - 200, y = y0 + hash(i * 5.3) * (y1 - y0) + 40 * Math.sin(t * 5 + i); h2Leaf(x, y, 18, t * 6 + i, key + 'l' + i, i % 2 ? H2.leaf : H2.leafLt); }
}

// ---------- the eight boons: icons and the row of slots ----------
function boonIcon(i, x, y, s, grey = 0) {
  const c = col => mixCol(col, '#A8A2AE', grey * .85), INK = mixCol(H2.ink, '#7E7886', grey * .6), sw = clamp(s / 34, .5, 1.5);
  boilSeed('bicon' + i);
  if (i === 0) paint([[.18, -1], [-.6, .1], [-.08, .1], [-.36, 1], [.6, -.24], [.08, -.24], [.44, -1]].map(([a, b]) => [x + a * s, y + b * s]), { wash: c('#FFD24A'), ink: INK, sw });
  else if (i === 1) {
    for (let k = 0; k < 8; k++) { const a = k / 8 * TAU; paint([[x + Math.cos(a - .2) * s * .62, y + Math.sin(a - .2) * s * .62], [x + Math.cos(a) * s * 1.05, y + Math.sin(a) * s * 1.05], [x + Math.cos(a + .2) * s * .62, y + Math.sin(a + .2) * s * .62]], { wash: c('#FF9A3A'), ink: INK, sw: sw * .7 }); }
    paint(ellPts(x, y, s * .58, s * .58, 16), { wash: c('#FFC83A'), ink: INK, sw });
  } else if (i === 2) {
    paint([[0, -1], [.66, .12], [.54, .66], [0, .95], [-.54, .66], [-.66, .12]].map(([a, b]) => [x + a * s, y + b * s]), { wash: c('#5EB8F2'), ink: INK, sw, curv: .5 });
    paint(ellPts(x - s * .22, y + s * .28, s * .12, s * .2, 8, 0, .3), { wash: '#FFFFFF', washOp: 200, ink: null });
  } else if (i === 3) paint(heartPts(x, y + s * .05, s * .92), { wash: c('#F2557A'), ink: INK, sw });
  else if (i === 4) {
    paint(ribbon([[x - s * .62, y + s * .92], [x + s * .1, y - s * .05]], s * .26, s * .22), { wash: c('#B88A1C'), ink: INK, sw: sw * .8 });
    paint(ellPts(x + s * .3, y - s * .38, s * .56, s * .56, 16), { wash: c('#F2C230'), ink: INK, sw });
    paint(ellPts(x + s * .14, y - s * .54, s * .16, s * .2, 8), { wash: '#FFFFFF', washOp: 170, ink: null });
  } else if (i === 5) {
    paint(ribbon([[x, y + s], [x, y - s * .2]], s * .2, s * .18), { wash: c('#B88A1C'), ink: INK, sw: sw * .8 });
    for (const k of [-1, 1]) paint(ribbon([[x, y - s * .15], [x + k * s * .5, y - s * .3], [x + k * s * .62, y - s * .95]], s * .22, s * .08), { wash: c('#A884F2'), ink: INK, sw: sw * .8 });
    paint([[x, y - s * .1], [x + s * .2, y - s * .5], [x, y - s * 1.1], [x - s * .2, y - s * .5]], { wash: c('#A884F2'), ink: INK, sw, curv: .3 });
  } else if (i === 6) {
    for (const a of [-1.0, -.5, .5, 1.0, 0]) { push(); translate(x, y + s * .6); rotate(a); paint([[0, 0], [s * .34, -s * .6], [0, -s * 1.35], [-s * .34, -s * .6]], { wash: c(a === 0 ? '#FFB0D4' : '#F28AC8'), ink: INK, sw: sw * .8, curv: .5 }); pop(); }
  } else {
    paint(ribbon([[x - s * .5, y + s * .95], [x + s * .12, y - s * .2]], s * .24, s * .2), { wash: c('#8A5A32'), ink: INK, sw: sw * .8 });
    push(); translate(x + s * .18, y - s * .42); rotate(.55); paint(rrPts(-s * .7, -s * .34, s * 1.4, s * .68, s * .12), { wash: c('#B8C0CC'), ink: INK, sw }); pop();
  }
}
// The row of eight slots (screen space: call it after camEnd()). st(i) → null (empty) or { k: 0..1 pop, grey: 0..1,
// hop: px up }; a fades the whole row in.
const SLOT_X = i => 108 + i * 108, SLOT_Y = 1400;
function boonSlots(t, st, a = 1) {
  if (a <= 0) return;
  for (let i = 0; i < 8; i++) {
    const x = SLOT_X(i), s = st(i), k = s ? backOut(clamp(s.k)) : 0, hop = s ? (s.hop || 0) : 0, grey = s ? (s.grey || 0) : 0;
    boilSeed('slot' + i);
    paint(ellPts(x, SLOT_Y - hop, 44, 44, 22), { wash: s ? mixCol('#FFF5E2', '#D2CCD6', grey * .7) : '#FFFFFF', washOp: (s ? 255 : 110) * a, ink: s ? H2.ink : null, sw: 1.2 });
    if (!s) inkLine([...ellPts(x, SLOT_Y, 44, 44, 22), ellPts(x, SLOT_Y, 44, 44, 22)[0]], 1.2, '#FFFFFF', 'inkfine', .5);
    if (s && k > 0) { push(); translate(x, SLOT_Y - hop); scale(k); translate(-x, -SLOT_Y + hop); boonIcon(i, x, SLOT_Y - hop, 27, grey); pop(); }
    letter(String(i + 1), x, SLOT_Y + 70, 34, s ? (grey > .5 ? '#D2CCD6' : '#F5C542') : '#FFFFFF', { screen: true, stroke: H2.ink, sw: .2, ink: false, rot: 0, alpha: a * (s ? 1 : .75) });
  }
}
