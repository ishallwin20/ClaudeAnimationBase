// shani_props.js: the sets and props for "Shani Dev LOOKED at baby Ganesha" (src/scenes/shani.js, Shani series
// Part 1). Loaded before it; everything here is a pure function of its arguments (and T for boil).
//
//   TK, vanishPuff, sparkleBurst, whipH, whipV, impact     copied from the 15K reel (and ad 18)
//   SP                                  this reel's palette
//   nightSet(t)                         the hook's night-indigo sky with a few stars (world, around the camera)
//   pavilion(t, o)                      Kailash: a pale sky, snow peaks, two carved pillars, marigold swags, a red rug
//   cradle(x, y, s, o)                  the baby's wooden cradle on rockers, (x, y) on the floor; o.part 'back' | 'front';
//                                       cradleBaby(x, y, s) is where a sitting baby's ground point goes (the rim at his chin)
//   paperStudio(t)                      a warm/cool paper backdrop for the aside
//   ashram(t)                           the flashback: a violet dusk, hills, a tree, a stone ledge
//   forest(t, scroll)                   a green forest path that scrolls (scroll px)
//   skySet(t, scroll)                   open sky, clouds and peaks below (scroll px: clouds stream past)
//   snowSlope(t)                        the snow slope at dusk
//   bolt(p0, p1, k, col, key)           a jagged curse bolt from p0 to p1, k 0..1 (grows, flashes, fades)
//   lotusPot(x, y, s, wilt)             a lotus in a little clay pot; wilt 0..1 droops it grey
//   krishnaThought(x, y, s, k)          a thought cloud with a flute and a peacock feather, k 0..1
//   shaniCard(t, C), shaniStrike(t, C)  the end card: the 15K Family Deal (from the 15K reel), follow for Part 2
const TK = {
  ink: '#2B2233', cream: '#FFF5E2',
  petal: '#F4A6B8', petalDk: '#E0708C', marigold: '#F39A2E', yellow: '#FFD45A', leaf: '#5E9A6A',
  gold: '#EDB43C', goldLt: '#FFE39A', goldDk: '#B67D1C',
  rkOrange: '#F15A24', peach: '#FBE0CF', peachLt: '#FFF1E6', brown: '#3A2418', grey: '#6B5A50', teal: '#2E5F5A',
};
const SP = {
  ink: '#2B2233',
  night: '#1E1A3C', nightDk: '#120F28', nightLt: '#3A3368', star: '#FFF1C8',
  sky: '#CFE3F2', skyLt: '#EEF5FA', skyDk: '#A9C6E2', snow: '#F6F8FC', snowDk: '#C9D3E6', rock: '#8C8FB0', rockDk: '#6A6C90',
  pillar: '#E9C08A', pillarDk: '#C08F5A', pillarLt: '#FFE2B8', rug: '#C8324A', rugDk: '#962338', rugGold: '#EDB43C',
  floor: '#F0D9B8', floorDk: '#D9B88E', marigold: '#F39A2E', orange: '#F15A24',
  wood: '#B86E3C', woodDk: '#8A4A24', woodLt: '#E09A5E', quilt: '#F4C53F', quiltDk: '#D6932A',
  warm: '#FBE3C9', cool: '#DCE3F4',
  dusk: '#6E5AA6', duskDk: '#4A3C80', duskLt: '#B29AD6', duskPink: '#E8A0B8', hill: '#3E3470', hillDk: '#2C2458',
  grass: '#4E7A5E', grassDk: '#355A44', bark: '#5E4234', barkDk: '#3E2A20', leaf: '#3F7A52', leafLt: '#6AA474', leafDk: '#2C5A3C',
  forest: '#9CC8A0', forestDk: '#6EA078', path: '#D8B884', pathDk: '#B89460',
  cloud: '#FFFFFF', cloudDk: '#D6E2F2',
  eve: '#F2A86E', eveDk: '#C67A5A', evePurple: '#7A5A9A',
  curse: '#B98CFF', curseRed: '#FF5A4A', pot: '#C8743E', potDk: '#954E26', lotus: '#F4A6B8', lotusDk: '#E0708C', stem: '#5E9A6A',
  grey: '#9A9488', flute: '#9A5A3A', feather: '#2FA39B', featherEye: '#3767B8',
};
const SH = { CX: 540, FY: 1460 };   // the pavilion's centre line and floor

// ---------- copied from the 15K reel ----------
function vanishPuff(x, y, s, age, key = 'puff', cols = ['#FFF3D6', '#FFE08A']) {
  if (age < 0 || age > .6) return;
  const k = age / .6; boilSeed(key);
  glow(x, y, s * 1.7 * (1 - k * .4), cols[1], .75 * (1 - k));
  for (let i = 0; i < 9; i++) {
    const a = i / 9 * TAU + hash(i) * .6, d = s * (.15 + .8 * easeOut(k)) * (.7 + .4 * hash(i * 3)), r = s * (.2 + .15 * hash(i * 1.7)) * (1 + .5 * k);
    paint(ellPts(x + Math.cos(a) * d, y + Math.sin(a) * d * .8 - k * s * .35, r, r * .9, 10, 1), { wash: cols[i % 2], washOp: 235 * (1 - k * k), ink: null });
  }
}
function sparkleBurst(x, y, s, age, key = 'burst', n = 8, cols = [TK.cream, TK.goldLt]) {
  if (age < 0 || age > .8) return;
  const k = age / .8; boilSeed(key);
  glow(x, y, s * (1 + k), cols[1], .6 * (1 - k));
  for (let i = 0; i < n; i++) { const a = i / n * TAU + hash(i) * .5, d = s * (.3 + 1.1 * easeOut(k)) * (.7 + .5 * hash(i * 2.1)); paint(starPts(x + Math.cos(a) * d, y + Math.sin(a) * d - k * s * .2, s * .22 * (1 - k * .8) * (.6 + hash(i * 5)), .3, 4), { wash: cols[i % 2], ink: null }); }
}
function whipH(k, dir = 1, t = 0, cols = [TK.cream, '#C9CCF2']) {
  if (k <= .02) return;
  boilSeed('whiph');
  for (let i = 0; i < 18; i++) {
    const y = 240 + hash(i * 2.7) * (H - 480), l = 500 + 900 * hash(i * 5.3), x = ((hash(i * 9.1) * 2400 - 300 + dir * t * 3800) % (W + l)) - l * .5, w = 5 + 16 * hash(i * 1.3);
    paint(ribbon([[x - l / 2, y], [x, y + 3], [x + l / 2, y]], w * .3, w), { wash: i % 3 ? cols[0] : cols[1], washOp: 190 * clamp(k) * (.5 + .5 * hash(i)), ink: null });
  }
  if (k > .6) paint(rectPts(-60, -60, W + 120, H + 120), { wash: cols[0], washOp: 255 * seg(k, .6, 1), ink: null });
}
function whipV(k, dir = -1, t = 0, cols = [TK.cream, '#C9CCF2']) {
  if (k <= .02) return;
  boilSeed('whipv');
  for (let i = 0; i < 16; i++) {
    const x = 60 + hash(i * 2.7) * (W - 120), l = 700 + 1100 * hash(i * 5.3), y = ((hash(i * 9.1) * 3200 + dir * t * 5200) % (H + l) + (H + l)) % (H + l) - l * .5, w = 6 + 18 * hash(i * 1.3);
    paint(ribbon([[x, y - l / 2], [x + 3, y], [x, y + l / 2]], w * .3, w), { wash: i % 3 ? cols[0] : cols[1], washOp: 200 * clamp(k) * (.5 + .5 * hash(i)), ink: null });
  }
  if (k > .6) paint(rectPts(-60, -60, W + 120, H + 120), { wash: cols[0], washOp: 255 * seg(k, .6, 1), ink: null });
}
function impact(x, y, age, s, key = 'imp') {
  if (age < 0 || age > .5) return;
  boilSeed(key);
  const k = age / .5;
  glow(x, y, s * (1.2 + k), '#FFD27A', .9 * (1 - k));
  const R = s * (.3 + 1.6 * easeOut(k)), e = ellPts(x, y, R, R * .8, 36, 2);
  inkLine([...e, e[0], e[1]], 14 * (1 - k) + 1, '#F5B83A', 'ink', .5);
  for (let i = 0; i < 10; i++) { const a = i / 10 * TAU + hash(i * 2) * .5, d = s * (.4 + 1.5 * easeOut(k)) * (.6 + .5 * hash(i)); paint(starPts(x + Math.cos(a) * d, y + Math.sin(a) * d, s * .14 * (1 - k), .3, 4), { wash: i % 2 ? '#FFE08A' : '#FFF4DC', ink: null }); }
}

// ---------- sets ----------
function nightSet(t) {
  boilSeed('night');
  paint(rectPts(-800, -800, 2700, 3600), { wash: SP.night, ink: null });
  paint(ellPts(540, 900, 900, 700, 30, 4), { fill: SP.nightLt, fillOp: 90, bleed: .3, tex: .4, border: .6, ink: null });
  boilSeed('stars');
  for (let i = 0; i < 34; i++) {
    const x = -300 + hash(i * 3.1) * 1700, y = -200 + hash(i * 7.7) * 2300, r = 4 + 7 * hash(i * 1.9), tw = .6 + .4 * Math.sin(t * (1.5 + hash(i)) + i);
    paint(starPts(x, y, r * tw, .35, 4), { wash: SP.star, washOp: 200, ink: null });
  }
}
function pavilion(t, o = {}) {
  const { CX, FY } = SH;
  boilSeed('pv sky');
  paint(rectPts(-700, -600, 2500, 1900), { wash: SP.sky, fill: SP.skyDk, fillOp: 60, bleed: .2, tex: .4, ink: null });
  paint(ellPts(540, 300, 900, 380, 24, 4), { fill: SP.skyLt, fillOp: 140, bleed: .3, tex: .5, border: .6, ink: null });
  boilSeed('pv peaks');   // Kailash and its range behind the pavilion
  paint([[-700, 1150], [-260, 700], [40, 920], [330, 560], [540, 380], [760, 600], [980, 820], [1260, 640], [1800, 1150]], { wash: SP.rock, fill: SP.rockDk, fillOp: 60, tex: .5, ink: SP.ink, sw: .8 });
  paint([[300, 600], [540, 380], [780, 620], [690, 640], [610, 560], [540, 650], [450, 580], [380, 650]], { wash: SP.snow, ink: null });
  paint([[-330, 760], [-260, 700], [-190, 770], [-250, 790]], { wash: SP.snow, ink: null });
  paint([[1190, 700], [1260, 640], [1330, 700], [1270, 720]], { wash: SP.snow, ink: null });
  boilSeed('pv floor');
  paint(rectPts(-700, FY - 120, 2500, 1300), { wash: SP.floor, fill: SP.floorDk, fillOp: 60, tex: .5, ink: null });
  inkLine([[-700, FY - 120], [1800, FY - 120]], 2, SP.floorDk, 'ink', 0);
  paint([[CX - 520, FY - 60], [CX + 520, FY - 60], [CX + 700, FY + 520], [CX - 700, FY + 520]], { wash: SP.rug, fill: SP.rugDk, fillOp: 70, tex: .6, ink: SP.ink, sw: 1 });   // the rug
  inkLine([[CX - 480, FY - 30], [CX + 480, FY - 30]], 5, SP.rugGold, 'ink', 0);
  inkLine([[CX - 520, FY + 30], [CX + 520, FY + 30]], 2, SP.rugGold, 'inkfine', 0);
  // two carved pillars and a marigold swag between them
  for (const px of [o.pillarL ?? -60, o.pillarR ?? 1140]) {
    boilSeed('pv pillar ' + px);
    paint(rectPts(px - 55, -200, 110, FY - 80), { wash: SP.pillar, fill: SP.pillarDk, fillOp: 60, tex: .5, ink: SP.ink, sw: 1 });
    paint(rectPts(px - 30, -200, 18, FY - 80), { wash: SP.pillarLt, washOp: 170, ink: null });
    for (const yy of [200, 620, 1040]) paint(rrPts(px - 75, yy, 150, 48, 14), { wash: SP.rugGold, ink: SP.ink, sw: .8 });
    paint(rrPts(px - 85, FY - 180, 170, 100, 16), { wash: SP.pillarDk, ink: SP.ink, sw: .9 });
  }
  boilSeed('pv swag');
  const L = o.pillarL ?? -60, R = o.pillarR ?? 1140, n = 26;
  for (let i = 0; i <= n; i++) { const k = i / n, x = lerp(L, R, k), y = 150 + 200 * 4 * k * (1 - k); paint(ellPts(x, y, 15, 14, 9, 1), { wash: i % 4 === 2 ? SP.orange : SP.marigold, ink: SP.ink, sw: .45 }); }
  for (const p of [L, R]) for (let j = 0; j < 5; j++) paint(ellPts(p, 150 + 26 * (j + 1), 13, 12, 9, 1), { wash: j % 2 ? SP.orange : SP.marigold, ink: SP.ink, sw: .45 });
}
// the cradle: the back panel ('back') goes behind the baby, the front ('front') over him; s scales it (1 ≈ 360 px wide)
function cradleRim(x, y, s) { return y - 205 * s; }
function cradleBaby(x, y, s, u) { return [x, cradleRim(x, y, s) + 6.7 * u]; }
function cradle(x, y, s, o = {}) {
  const rock = o.rock || 0, part = o.part || 'front', P = pts => pts.map(([a, b]) => [x + a * s, y + b * s]);
  push(); translate(x, y - 40 * s); rotate(rock); translate(-x, -(y - 40 * s));
  if (part === 'back') {
    boilSeed('cradle back');
    paint(P([[-170, -330], [170, -330], [178, -205], [-178, -205]]), { wash: SP.woodDk, ink: SP.ink, sw: 1 });   // the headboard
    paint(P([[-140, -360], [0, -400], [140, -360], [150, -320], [-150, -320]]), { wash: SP.wood, ink: SP.ink, sw: 1, curv: .3 });
    paint(ellPts(x, y - 360 * s, 26 * s, 26 * s, 12), { wash: SP.rugGold, ink: SP.ink, sw: .8 });
  } else {
    boilSeed('cradle front');
    paint(P([[-185, -210], [185, -210], [165, -55], [-165, -55]]), { wash: SP.wood, fill: SP.woodDk, fillOp: 60, tex: .5, ink: SP.ink, sw: 1.2 });
    paint(P([[-200, -228], [200, -228], [200, -198], [-200, -198]]), { wash: SP.woodLt, ink: SP.ink, sw: 1 });   // the rim
    paint(P([[-150, -175], [150, -175], [138, -88], [-138, -88]]), { wash: SP.quilt, fill: SP.quiltDk, fillOp: 50, tex: .4, ink: SP.ink, sw: .8 });   // a painted panel
    for (let i = 0; i < 5; i++) paint(ellPts(x + (-100 + i * 50) * s, y - 132 * s, 13 * s, 13 * s, 10), { wash: i % 2 ? SP.rug : SP.marigold, ink: null });
    inkLine(P([[-240, -10], [-120, 20], [0, 28], [120, 20], [240, -10]]), 9 * s + 1, SP.woodDk, 'ink', .5);   // the rocker
    for (const k of [-110, 110]) inkLine(P([[k, -60], [k * 1.05, 20]]), 7 * s + 1, SP.woodDk, 'ink', 0);
  }
  pop();
}
function paperStudio(t) {
  boilSeed('studio');
  paint(rectPts(-700, -600, 1240, 3200), { wash: SP.warm, fill: '#F2C9B0', fillOp: 50, bleed: .2, tex: .5, ink: null });
  paint(rectPts(540, -600, 1300, 3200), { wash: SP.cool, fill: '#B9C4E4', fillOp: 50, bleed: .2, tex: .5, ink: null });
  boilSeed('studio floor');
  paint(ellPts(270, 1540, 380, 70, 22, 3), { fill: '#C8925A', fillOp: 70, bleed: .2, tex: .4, ink: null });
  paint(ellPts(810, 1540, 330, 66, 22, 3), { fill: '#6A6C90', fillOp: 70, bleed: .2, tex: .4, ink: null });
}
function ashram(t) {
  boilSeed('ash sky');
  paint(rectPts(-700, -600, 2500, 2000), { wash: SP.dusk, fill: SP.duskDk, fillOp: 60, bleed: .2, tex: .5, ink: null });
  paint(ellPts(560, 1050, 900, 300, 24, 4), { fill: SP.duskPink, fillOp: 150, bleed: .3, tex: .5, border: .6, ink: null });
  glow(560, 1080, 520, '#FFB0C8', .25);
  boilSeed('ash stars');
  for (let i = 0; i < 18; i++) paint(starPts(-200 + hash(i * 5.1) * 1500, -100 + hash(i * 2.3) * 800, 4 + 4 * hash(i), .35, 4), { wash: SP.star, washOp: 170, ink: null });
  boilSeed('ash hills');
  paint([[-700, 1240], [-300, 1020], [100, 1160], [460, 990], [820, 1130], [1180, 1000], [1800, 1240], [1800, 1500], [-700, 1500]], { wash: SP.hill, fill: SP.hillDk, fillOp: 60, tex: .5, ink: null });
  boilSeed('ash ground');
  paint(rectPts(-700, 1360, 2500, 1300), { wash: SP.grass, fill: SP.grassDk, fillOp: 60, tex: .6, ink: null });
  inkLine([[-700, 1360], [1800, 1360]], 2, SP.grassDk, 'ink', 0);
  boilSeed('ash tree');   // a big tree on the left
  paint([[-80, 1400], [-20, 900], [-60, 620], [20, 600], [60, 900], [70, 1400]], { wash: SP.bark, fill: SP.barkDk, fillOp: 60, tex: .5, ink: SP.ink, sw: 1 });
  for (const [cx, cy, r] of [[-120, 520, 230], [130, 470, 210], [0, 330, 240], [-260, 380, 150]]) paint(ellPts(cx, cy, r, r * .8, 22, 6), { wash: SP.leafDk, fill: SP.leaf, fillOp: 70, tex: .6, ink: SP.ink, sw: .8 });
  boilSeed('ash ledge');
  paint(ellPts(540, 1478, 330, 46, 22, 3), { wash: '#8A84A8', fill: '#6A6488', fillOp: 60, tex: .5, ink: SP.ink, sw: .9 });
}
function forest(t, scroll = 0) {
  boilSeed('fo sky');
  paint(rectPts(-700, -600, 2500, 2000), { wash: SP.forest, fill: SP.forestDk, fillOp: 50, bleed: .2, tex: .5, ink: null });
  for (let layer = 0; layer < 2; layer++) {
    const par = layer ? 1 : .5, col = layer ? SP.leaf : SP.forestDk, y0 = layer ? 1420 : 1300;
    for (let i = -2; i < 10; i++) {
      const x = ((i * 360 + 140 * layer - scroll * par) % 3240 + 3240) % 3240 - 900;
      boilSeed('fo tree ' + layer + ' ' + i);
      if (layer) paint(rectPts(x - 30, y0 - 520, 60, 520), { wash: SP.bark, fill: SP.barkDk, fillOp: 50, tex: .4, ink: SP.ink, sw: .8 });
      paint(ellPts(x, y0 - 560 - 60 * hash(i), 170 + 40 * hash(i * 3), 220, 18, 6), { wash: col, fill: SP.leafDk, fillOp: 50, tex: .5, ink: layer ? SP.ink : null, sw: .7 });
    }
  }
  boilSeed('fo path');
  paint(rectPts(-700, 1420, 2500, 1200), { wash: SP.grass, fill: SP.grassDk, fillOp: 50, tex: .5, ink: null });
  paint([[-700, 1460], [1800, 1460], [1800, 1640], [-700, 1640]], { wash: SP.path, fill: SP.pathDk, fillOp: 50, tex: .5, ink: null });
}
function skySet(t, scroll = 0) {
  boilSeed('sk sky');
  paint(rectPts(-800, -800, 2700, 3600), { wash: SP.sky, fill: SP.skyDk, fillOp: 80, bleed: .2, tex: .4, ink: null });
  for (let i = 0; i < 9; i++) {
    const x = ((hash(i * 4.4) * 2400 - scroll * (.6 + .6 * hash(i))) % 2400 + 2400) % 2400 - 700, y = -100 + hash(i * 6.1) * 1900, r = 120 + 120 * hash(i * 2.2);
    boilSeed('sk cloud ' + i);
    for (let j = 0; j < 4; j++) paint(ellPts(x + (j - 1.5) * r * .6, y - (j % 2) * r * .25, r * .6, r * .4, 16, 3), { wash: SP.cloud, fill: SP.cloudDk, fillOp: 40, tex: .3, ink: null });
  }
  boilSeed('sk peaks');
  paint([[-800, 2000], [-300, 1560], [60, 1720], [420, 1480], [760, 1700], [1160, 1520], [1900, 2000]], { wash: SP.rock, fill: SP.rockDk, fillOp: 60, tex: .5, ink: SP.ink, sw: .8 });
  paint([[340, 1540], [420, 1480], [500, 1550], [440, 1570]], { wash: SP.snow, ink: null });
  paint([[1090, 1570], [1160, 1520], [1230, 1580], [1160, 1590]], { wash: SP.snow, ink: null });
}
function snowSlope(t) {
  boilSeed('sn sky');
  paint(rectPts(-700, -600, 2500, 2400), { wash: SP.evePurple, fill: SP.duskDk, fillOp: 50, bleed: .2, tex: .5, ink: null });
  paint(ellPts(700, 1150, 900, 420, 24, 4), { fill: SP.eve, fillOp: 170, bleed: .3, tex: .5, border: .6, ink: null });
  glow(760, 1150, 520, '#FFC890', .35);
  boilSeed('sn peaks');
  paint([[-700, 1300], [-200, 820], [200, 1080], [620, 760], [1000, 1060], [1800, 1300]], { wash: SP.rockDk, fill: SP.hill, fillOp: 50, tex: .5, ink: null });
  boilSeed('sn slope');
  paint([[-700, 1280], [1800, 1480], [1800, 2600], [-700, 2600]], { wash: SP.snow, fill: SP.snowDk, fillOp: 60, tex: .5, ink: SP.ink, sw: .8 });
  boilSeed('sn flakes');
  for (let i = 0; i < 26; i++) { const x = frac(hash(i * 2.1) + Math.sin(t * .5 + i) * .01) * 1200 - 60, y = frac(hash(i * 5.3) + t * (.04 + .03 * hash(i))) * 2000 - 40; paint(ellPts(x, y, 5 + 4 * hash(i), 5 + 4 * hash(i), 6), { wash: '#FFFFFF', washOp: 210, ink: null }); }
}

// ---------- props and effects ----------
function bolt(p0, p1, k, col = SP.curse, key = 'bolt') {
  if (k <= 0 || k >= 1) return;
  const grow = clamp(k / .35), fade = 1 - seg(k, .6, 1), L = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]), n = Math.max(4, Math.min(9, Math.round(L / 60))), amp = Math.min(70, L * .14), P = [];
  boilSeed(key);
  for (let i = 0; i <= n; i++) {
    const f = i / n * grow, nx = -(p1[1] - p0[1]), ny = p1[0] - p0[0], d = Math.hypot(nx, ny) || 1, j = (i && i < n) ? (hash(i * 3.7 + Math.floor(T * 12)) - .5) * amp : 0;
    P.push([lerp(p0[0], p1[0], f) + nx / d * j, lerp(p0[1], p1[1], f) + ny / d * j]);
  }
  for (let i = 0; i < P.length; i += 2) glow(P[i][0], P[i][1], 90 * fade, col, .4 * fade);
  inkLine(P, 9 * fade + 2, col, 'ink', 0);
  inkLine(P, 3 * fade + 1, '#FFFFFF', 'inkfine', 0);
}
function lotusPot(x, y, s, wilt = 0) {
  boilSeed('lotuspot');
  const w = clamp(wilt), c = k => mixCol(k, SP.grey, w * .85);
  const tip = [x + 70 * s * w, y - 230 * s + 150 * s * w];
  inkLine([[x, y - 70 * s], [x + 10 * s * w, y - 150 * s + 20 * s * w], tip], 7 * s + 1, c(SP.stem), 'ink', .6);
  for (const [a, l, col] of [[-1, 70, SP.lotusDk], [1, 70, SP.lotusDk], [-.45, 85, SP.lotus], [.45, 85, SP.lotus], [0, 92, '#FFDDE4']]) {
    push(); translate(...tip); rotate(a * (.55 - w * .25) + w * 2.2);
    paint([[0, 0], [24 * s, -l * .45 * s], [0, -l * s], [-24 * s, -l * .45 * s]], { wash: c(col), ink: SP.ink, sw: .7, curv: .5 });
    pop();
  }
  paint([[x - 60 * s, y - 80 * s], [x + 60 * s, y - 80 * s], [x + 45 * s, y], [x - 45 * s, y]], { wash: SP.pot, fill: SP.potDk, fillOp: 60, tex: .5, ink: SP.ink, sw: 1 });
  paint(rrPts(x - 68 * s, y - 92 * s, 136 * s, 22 * s, 8 * s), { wash: SP.potDk, ink: SP.ink, sw: .8 });
}
function krishnaThought(x, y, s, k, dir = 1) {
  if (k <= .01) return;
  const p = backOut(clamp(k));
  boilSeed('thought');
  for (const [dx, dy, r] of [[120, 210, 14], [80, 160, 22]]) paint(ellPts(x + dir * dx * s, y + dy * s, r * s * p, r * s * p, 10), { wash: '#FFF8EC', ink: SP.ink, sw: .7 });
  glow(x, y, 220 * s * p, '#FFE9A8', .35);
  for (const [dx, dy, r] of [[-90, 20, 80], [0, -30, 100], [95, 15, 85], [0, 60, 90]]) paint(ellPts(x + dx * s * p, y + dy * s * p, r * s * p, r * .8 * s * p, 16, 2), { wash: '#FFF8EC', ink: null });
  paint(ellPts(x, y + 10 * s * p, 190 * s * p, 120 * s * p, 24, 2), { ink: SP.ink, sw: .8 });
  push(); translate(x, y + 10 * s * p); scale(p); rotate(-.35);
  inkLine([[-110 * s, 0], [110 * s, 0]], 14 * s, SP.flute, 'ink', 0);   // the flute
  for (let i = 0; i < 5; i++) paint(ellPts((-40 + i * 25) * s, 0, 4 * s, 4 * s, 6), { wash: SP.ink, ink: null });
  pop();
  push(); translate(x + 40 * s * p, y - 30 * s * p); scale(p); rotate(.5);   // the peacock feather
  inkLine([[0, 60 * s], [0, -40 * s]], 3 * s, SP.ink, 'inkfine', .4);
  paint(ellPts(0, -40 * s, 26 * s, 38 * s, 14), { wash: SP.feather, ink: SP.ink, sw: .6 });
  paint(ellPts(0, -36 * s, 13 * s, 18 * s, 10), { wash: SP.featherEye, ink: null });
  pop();
}

// ---------- the end card (from the 15K reel) ----------
function shaniCard(t, C) {
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
  if (t > C.dead) letter('Only till 21 Oct, midnight', X, 1262, 40, TK.teal, { screen: true, font: '700 40px Poppins', ink: false, maxW: 860, pop: pk(C.dead) });
  if (t > C.pill) {
    const k = backOut(clamp(pk(C.pill))) * (1 + .03 * pulse(t, 4));
    boilSeed('pill');
    push(); translate(X, 1350); scale(k); paint(rrPts(-270, -48, 540, 96, 48), { wash: TK.rkOrange, ink: null }); pop();
    letter('Comment FAMILY', X, 1352, 54, TK.cream, { screen: true, font: '700 52px Poppins', ink: false, pop: pk(C.pill) });
  }
  if (t > C.sub) letter("we'll DM you the deal · or tap the link in bio", X, 1428, 31, TK.brown, { screen: true, font: '500 31px Poppins', ink: false, maxW: 860, pop: pk(C.sub) });
  if (t > C.follow) letter('Follow @therishikatha for PART 2', X, 1478, 31, TK.grey, { screen: true, font: '700 31px Poppins', ink: false, maxW: 860, pop: pk(C.follow) });
}
function shaniStrike(t, C) {
  if (t < C.strike) return;
  const k = easeOut(seg(t, C.strike, C.strike + .25));
  boilSeed('strike');
  inkLine([[470 - 185, 1196], [lerp(470 - 185, 470 - 55, k), lerp(1196, 1172, k)]], 6, TK.rkOrange, 'ink', 0);
}
