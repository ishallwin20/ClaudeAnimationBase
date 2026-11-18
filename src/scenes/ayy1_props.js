// ayy1_props.js: sets and props for Ayyappa Part 1 (ad 101, "His father is SHIVA. His mother is VISHNU."). Scene-local.
//   a1Peak         the Vindhya at dusk: Mahishi's tapas (a peak, the sun she stares at)
//   a1Heaven       Amaravati: gold clouds, Indra's throne
//   a1Shore        the milk ocean's shore (the churning, Mohini)
//   a1Vaikuntha    a blue sky of clouds (Shiva asks Vishnu)
//   a1Garden       the garden Vishnu makes: grass, flowers, and a champak tree (a1Champak) on screen right
//   a1Light        the birth: white-gold light with rays
//   a1Kailash      a cool sky and a snow peak (Shiva ties the bell)
//   a1Pampa        the Pampa at night: forest, the river, fireflies
//   a1Pot, a1Ball, a1Throne, a1Bowl, a1Bubble, a1Badge, a1Milk     props
const A1 = {
  ink: '#2B2233', cream: '#FFF5E2', gold: '#F5C542', goldLt: '#FFE69A', goldDk: '#C8922A',
  duskHi: '#F6B074', duskLo: '#E8806A', duskSky: '#B85A7A', rock: '#7A5A6A', rockDk: '#5A3E52', rockLt: '#A07E8C',
  heaven: '#FCE7B4', heavenLo: '#F6D08A', cloud: '#FFF8EA', cloudDk: '#EAD6B4',
  seaSky: '#CFE9F2', sea: '#F4F8FA', seaDk: '#D6E6EE', sand: '#F2DCB0', sandDk: '#D8BA84',
  vk: '#9CC8EE', vkLo: '#D8ECFA', grass: '#9CCB6A', grassDk: '#6FA24A', gardenSky: '#E8F4D8', gardenLo: '#F8F0D0',
  night: '#1E2448', nightLo: '#2E3A66', forest: '#18304A', forestLt: '#24445E', river: '#3E6E9A', riverLt: '#8EC0E6', firefly: '#FFF2A0',
  snow: '#F6F8FC', snowDk: '#C8D4E6', kSky: '#BFD8F2', kSkyLo: '#E6F0FA',
};

const a1bg = (key, col) => { boilSeed(key + ' bg'); paint(rectPts(-300, -300, 1680, 2600), { wash: col, ink: null }); };
const a1band = (key, y, h, col, op = 255) => { boilSeed(key); paint(rectPts(-300, y, 1680, h), { fill: col, fillOp: op, bleed: .2, tex: .3, ink: null }); };

function a1Peak(t, key = 'pk') {
  a1bg(key, A1.duskSky);
  a1band(key + 'b1', 700, 700, A1.duskLo, 200); a1band(key + 'b2', 1100, 900, A1.duskHi, 220);
  boilSeed(key + 'sun'); glow(540, 1180, 520, '#FFD27A', .55); paint(ellPts(540, 1180, 190, 190, 40), { wash: '#FFE6A0', ink: null }); glow(540, 1180, 260, '#FFFFFF', .25);
  boilSeed(key + 'far');
  paint([[-300, 1560], [-60, 1420], [150, 1500], [330, 1380], [520, 1470], [760, 1360], [980, 1460], [1380, 1400], [1380, 2400], [-300, 2400]], { wash: '#9A6A80', ink: null, curv: .2 });
  boilSeed(key + 'peak');
  paint([[-300, 2400], [-300, 1980], [200, 1860], [420, 1760], [500, 1700], [580, 1702], [660, 1770], [880, 1880], [1380, 1960], [1380, 2400]], { wash: A1.rock, fill: A1.rockDk, fillOp: 60, tex: .5, ink: A1.ink, sw: 1.4, curv: .15 });
  paint([[470, 1716], [500, 1700], [580, 1702], [620, 1730], [560, 1760], [500, 1756]], { wash: A1.rockLt, ink: null, curv: .3 });
  for (let i = 0; i < 6; i++) inkLine([[300 + i * 90, 1830 + (i % 2) * 30], [330 + i * 90, 1880 + (i % 2) * 30]], 1, A1.rockDk, 'inkfine', 0);
}

function a1Heaven(t, key = 'hv') {
  a1bg(key, A1.heaven); a1band(key + 'lo', 1200, 1200, A1.heavenLo, 200);
  boilSeed(key + 'rays'); glow(540, 900, 700, '#FFF2C8', .45);
  for (let i = 0; i < 4; i++) cloudPuff(120 + i * 290, 760 + (i % 2) * 90 + Math.sin(t * .6 + i) * 6, 120, key + 'c' + i, 255, A1.cloud, A1.cloudDk);
  boilSeed(key + 'floor'); paint(ellPts(540, 1820, 900, 220, 40), { wash: A1.cloud, fill: A1.cloudDk, fillOp: 40, tex: .3, ink: null });
  for (let i = 0; i < 5; i++) cloudPuff(-60 + i * 300, 1800 + (i % 2) * 40, 150, key + 'f' + i, 255, A1.cloud, A1.cloudDk);
}

function a1Shore(t, key = 'sh') {
  a1bg(key, A1.seaSky);
  boilSeed(key + 'glow'); glow(540, 1050, 600, '#FFFFFF', .35);
  boilSeed(key + 'sea'); paint(rectPts(-300, 1180, 1680, 520), { wash: A1.sea, fill: A1.seaDk, fillOp: 40, tex: .3, ink: null });
  for (let i = 0; i < 7; i++) { const y = 1240 + i * 62, x0 = -100 + ((i * 173) % 300) + Math.sin(t * 1.4 + i) * 20; inkLine([[x0, y], [x0 + 60, y - 8], [x0 + 120, y]], 1.2, '#B8D2E2', 'inkfine', .5); inkLine([[x0 + 520, y + 20], [x0 + 580, y + 12], [x0 + 640, y + 20]], 1.2, '#B8D2E2', 'inkfine', .5); }
  boilSeed(key + 'sand'); paint([[-300, 1650], [200, 1620], [600, 1640], [1000, 1610], [1380, 1630], [1380, 2400], [-300, 2400]], { wash: A1.sand, fill: A1.sandDk, fillOp: 40, tex: .4, ink: A1.ink, sw: 1, curv: .3 });
}

function a1Vaikuntha(t, key = 'vk') {
  a1bg(key, A1.vk); a1band(key + 'lo', 1100, 1300, A1.vkLo, 220);
  boilSeed(key + 'glow'); glow(760, 1200, 500, '#FFF6D8', .45);
  for (let i = 0; i < 4; i++) cloudPuff(80 + i * 300, 820 + (i % 2) * 120 + Math.sin(t * .5 + i) * 6, 110, key + 'c' + i, 255, '#FFFFFF', '#D6E2F2');
  boilSeed(key + 'floor'); paint(ellPts(540, 1860, 1000, 240, 40), { wash: '#FFFFFF', fill: '#D6E2F2', fillOp: 50, tex: .3, ink: null });
  for (let i = 0; i < 5; i++) cloudPuff(-60 + i * 300, 1820 + (i % 2) * 50, 160, key + 'f' + i, 255, '#FFFFFF', '#D6E2F2');
}

// a champak (champaka) tree: a dark trunk, rounded leaf clumps, yellow-gold flowers
function a1Champak(x, y, s, t, key) {
  boilSeed(key + 'trunk');
  paint([[x - .12 * s, y], [x - .08 * s, y - .5 * s], [x - .18 * s, y - .85 * s], [x - .05 * s, y - .9 * s], [x + .02 * s, y - .6 * s], [x + .1 * s, y - .92 * s], [x + .2 * s, y - .86 * s], [x + .08 * s, y - .5 * s], [x + .14 * s, y]], { wash: '#6E4A32', fill: '#4A2E1E', fillOp: 60, tex: .5, ink: A1.ink, sw: 1.4, curv: .3 });
  const cl = [[-.42, -1.02, .34], [0, -1.2, .4], [.4, -1.0, .34], [-.2, -.82, .3], [.24, -.8, .28]];
  cl.forEach(([dx, dy, r], i) => { boilSeed(key + 'cl' + i); paint(ellPts(x + dx * s, y + dy * s + Math.sin(t * 1.2 + i) * 3, r * s, r * s * .78, 22), { wash: i % 2 ? A1.grassDk : '#4E9A5A', fill: '#2E6A40', fillOp: 45, tex: .5, ink: A1.ink, sw: 1.1 }); });
  for (let i = 0; i < 16; i++) {
    boilSeed(key + 'fl' + i);
    const fx = x + (hash(i * 3.1) - .5) * 1.0 * s, fy = y - (.75 + hash(i * 5.7) * .55) * s;
    for (let p = 0; p < 5; p++) { const a = p / 5 * TAU + hash(i) * 2; paint(ellPts(fx + Math.cos(a) * s * .028, fy + Math.sin(a) * s * .028, s * .03, s * .014, 6, 0, a), { wash: '#F7C64A', ink: null }); }
    paint(ellPts(fx, fy, s * .012, s * .012, 6), { wash: '#E8902A', ink: null });
  }
}
function a1Garden(t, key = 'gd', treeX = 860) {
  a1bg(key, A1.gardenSky); a1band(key + 'lo', 1100, 1300, A1.gardenLo, 200);
  boilSeed(key + 'glow'); glow(540, 1000, 600, '#FFFFFF', .35);
  boilSeed(key + 'hills'); paint([[-300, 1500], [100, 1420], [500, 1480], [900, 1400], [1380, 1460], [1380, 2400], [-300, 2400]], { wash: '#B8D88A', ink: null, curv: .3 });
  a1Champak(treeX, 1700, 820, t, key + 'tr');
  boilSeed(key + 'grass'); paint([[-300, 1640], [300, 1610], [800, 1630], [1380, 1600], [1380, 2400], [-300, 2400]], { wash: A1.grass, fill: A1.grassDk, fillOp: 45, tex: .4, ink: A1.ink, sw: 1, curv: .3 });
  for (let i = 0; i < 9; i++) flowerProp(-40 + i * 150 + (i % 2) * 40, 1820 + (i % 3) * 50, 15, key + 'fw' + i, i * .7, i % 3 ? '#F2557A' : '#F7C64A', i % 3 ? '#C83458' : '#D99A22');
  for (let i = 0; i < 4; i++) { const q = frac(t * .25 + i / 4); boilSeed(key + 'petal' + i); paint(ellPts(treeX - 300 + i * 120 + Math.sin(q * 7 + i) * 40, 1000 + q * 700, 7, 4, 6, 0, q * 6), { wash: '#F7C64A', washOp: 255 * Math.sin(q * Math.PI), ink: null }); }
}

function a1Light(t, key = 'lt', k = 1, cx = 540, cy = 1300) {
  a1bg(key, '#FFF4DA');
  boilSeed(key + 'rays');
  for (let i = 0; i < 14; i++) { const a = i / 14 * TAU + t * .08; paint([[cx, cy], [cx + Math.cos(a - .07) * 1600, cy + Math.sin(a - .07) * 1600], [cx + Math.cos(a + .07) * 1600, cy + Math.sin(a + .07) * 1600]], { fill: '#FFE6A0', fillOp: 70 * k, bleed: .1, ink: null }); }
  glow(cx, cy, 700 * k, '#FFF2C0', .6 * k);
}

function a1Kailash(t, key = 'ks') {
  a1bg(key, A1.kSky); a1band(key + 'lo', 1100, 1300, A1.kSkyLo, 220);
  boilSeed(key + 'peak');
  paint([[-300, 1700], [80, 1360], [330, 1120], [460, 1020], [560, 1060], [760, 1240], [1000, 1380], [1380, 1520], [1380, 2400], [-300, 2400]], { wash: A1.snow, fill: A1.snowDk, fillOp: 50, tex: .4, ink: A1.ink, sw: 1.2, curv: .1 });
  paint([[460, 1020], [520, 1140], [480, 1260], [560, 1360], [500, 1480], [600, 1560], [760, 1240], [560, 1060]], { fill: A1.snowDk, fillOp: 70, bleed: .2, ink: null, curv: .2 });
  boilSeed(key + 'floor'); paint([[-300, 1700], [300, 1660], [800, 1690], [1380, 1650], [1380, 2400], [-300, 2400]], { wash: '#E8EEF6', fill: '#C8D4E6', fillOp: 50, tex: .3, ink: A1.ink, sw: 1, curv: .3 });
}

function a1Pampa(t, key = 'pm') {
  a1bg(key, A1.night); a1band(key + 'lo', 900, 1500, A1.nightLo, 200);
  for (let i = 0; i < 28; i++) { boilSeed(key + 'st' + i); const tw = .5 + .5 * Math.sin(t * 3 + i * 1.7); paint(starPts(hash(i * 2.3) * 1080, 460 + hash(i * 4.1) * 600, 3 + 4 * tw, .4, 4), { wash: '#FFF6D8', washOp: 160 + 90 * tw, ink: null }); }
  boilSeed(key + 'moon'); glow(840, 640, 160, '#FFF6D8', .35); paint(ellPts(840, 640, 50, 50, 24), { wash: '#FFF6D8', ink: null });
  boilSeed(key + 'hills'); paint([[-300, 1380], [0, 1250], [260, 1330], [520, 1220], [800, 1310], [1100, 1230], [1380, 1300], [1380, 2400], [-300, 2400]], { wash: A1.forestLt, ink: null, curv: .25 });
  for (let i = 0; i < 9; i++) { boilSeed(key + 'tr' + i); const x = -40 + i * 140, h = 260 + hash(i * 3) * 160; paint([[x - 70, 1500], [x - 50, 1500 - h * .5], [x, 1500 - h], [x + 50, 1500 - h * .5], [x + 70, 1500]], { wash: A1.forest, ink: null, curv: .4 }); }
  boilSeed(key + 'river'); paint([[-300, 1560], [200, 1540], [600, 1570], [1000, 1540], [1380, 1560], [1380, 1760], [900, 1740], [400, 1770], [-300, 1750]], { wash: A1.river, fill: '#2A5480', fillOp: 50, tex: .3, ink: null, curv: .3 });
  for (let i = 0; i < 8; i++) { const x = ((i * 157 + t * 40) % 1400) - 160, y = 1580 + (i % 4) * 42; inkLine([[x, y], [x + 50, y - 4], [x + 100, y]], 1.4, A1.riverLt, 'inkfine', .5); }
  boilSeed(key + 'bank'); paint([[-300, 1740], [300, 1720], [800, 1750], [1380, 1720], [1380, 2400], [-300, 2400]], { wash: '#2E5A3A', fill: '#1E3E28', fillOp: 50, tex: .4, ink: A1.ink, sw: 1, curv: .3 });
  for (let i = 0; i < 7; i++) { const q = t * .4 + i * 1.3, fx = 100 + hash(i * 7) * 880 + Math.sin(q * 1.3) * 40, fy = 1250 + hash(i * 9) * 400 + Math.cos(q) * 30, k = .5 + .5 * Math.sin(q * 3); boilSeed(key + 'ff' + i); glow(fx, fy, 30, A1.firefly, .5 * k); paint(ellPts(fx, fy, 4, 4, 8), { wash: A1.firefly, washOp: 120 + 130 * k, ink: null }); }
}

// ---------- props ----------
function a1Pot(x, y, s, key = 'pot', glowK = .6) {   // the amrit kalash, (x, y) its base
  boilSeed('pot ' + key);
  if (glowK) glow(x, y - s * .9, s * 1.4, '#FFF2B0', glowK);
  paint([[x - s * .3, y - s * .9], [x - s * .5, y - s * .55], [x - s * .45, y - s * .12], [x - s * .2, y], [x + s * .2, y], [x + s * .45, y - s * .12], [x + s * .5, y - s * .55], [x + s * .3, y - s * .9]], { wash: A1.gold, fill: A1.goldDk, fillOp: 50, tex: .4, ink: A1.ink, sw: Math.max(.6, s / 60), curv: .5 });
  paint(rrPts(x - s * .34, y - s * 1.02, s * .68, s * .16, s * .05), { wash: A1.goldLt, ink: A1.ink, sw: Math.max(.5, s / 70) });
  paint(ellPts(x, y - s * 1.06, s * .26, s * .07, 12), { wash: '#FFFFFF', ink: null });
  paint(ellPts(x - s * .18, y - s * .55, s * .07, s * .2, 8), { wash: '#FFF6D0', washOp: 200, ink: null });
}
function a1Ball(x, y, r, key = 'ball', spin = 0) {   // the ruby ball
  boilSeed('ball ' + key);
  glow(x, y, r * 2.4, '#FF8A98', .35);
  paint(ellPts(x, y, r, r, 20), { wash: '#D2283A', fill: '#96182A', fillOp: 50, tex: .3, ink: A1.ink, sw: Math.max(.6, r / 20) });
  for (let i = 0; i < 3; i++) { const a = spin + i * TAU / 3; inkLine([[x + Math.cos(a) * r * .9, y + Math.sin(a) * r * .9], [x + Math.cos(a + .6) * r * .5, y + Math.sin(a + .6) * r * .5]], Math.max(.5, r / 26), '#FF8A98', 'inkfine', .5); }
  paint(ellPts(x - r * .35, y - r * .35, r * .25, r * .18, 10), { wash: '#FFFFFF', washOp: 220, ink: null });
}
function a1Throne(x, y, s, key = 'thr') {   // Indra's throne, (x, y) the ground under its seat
  boilSeed('throne ' + key);
  paint([[x - s * .55, y], [x - s * .55, y - s * .4], [x - s * .48, y - s * 1.15], [x - s * .3, y - s * 1.35], [x, y - s * 1.42], [x + s * .3, y - s * 1.35], [x + s * .48, y - s * 1.15], [x + s * .55, y - s * .4], [x + s * .55, y]], { wash: A1.gold, fill: A1.goldDk, fillOp: 50, tex: .4, ink: A1.ink, sw: 1.4, curv: .4 });
  paint(rrPts(x - s * .38, y - s * 1.12, s * .76, s * .78, s * .12), { wash: '#C8324A', fill: '#962338', fillOp: 40, ink: A1.ink, sw: 1 });
  paint(ellPts(x, y - s * 1.3, s * .08, s * .08, 10), { wash: '#3FB6A8', ink: A1.ink, sw: .8 });
}
function a1Bowl(x, y, s, key = 'bowl', milk = 1) {   // a small silver bowl of milk, (x, y) its rim centre
  boilSeed('bowl ' + key);
  paint([[x - s, y], [x - s * .8, y + s * .55], [x, y + s * .75], [x + s * .8, y + s * .55], [x + s, y]], { wash: A1.cream, fill: '#98A2B0', fillOp: 60, tex: .3, ink: A1.ink, sw: Math.max(.5, s / 30), curv: .5 });
  paint(ellPts(x, y, s, s * .22, 16), { wash: '#C8D0DA', ink: A1.ink, sw: Math.max(.5, s / 30) });
  if (milk > 0) paint(ellPts(x, y + s * .04, s * .85 * milk, s * .16 * milk, 14), { wash: '#FFFDF6', ink: null });
}
function a1Milk(x, y, s, key = 'mk') {   // a milk moustache
  boilSeed('milkm ' + key);
  paint([[x - s, y], [x - s * .5, y - s * .3], [x, y - s * .15], [x + s * .5, y - s * .3], [x + s, y], [x + s * .4, y + s * .2], [x, y + s * .05], [x - s * .4, y + s * .2]], { wash: '#FFFDF6', ink: A1.ink, sw: .6, curv: .5 });
}
// a thought bubble at (x, y), w × h; tail dots toward (tx, ty); k 0..1 pops it
function a1Bubble(x, y, w, h, k, key, tx, ty) {
  if (k <= .01) return;
  boilSeed('bub ' + key);
  for (let i = 0; i < 3; i++) { const q = (i + 1) / 4, r = 8 + i * 6; paint(ellPts(lerp(tx, x, q), lerp(ty, y + h * .45, q), r * k, r * k, 12), { wash: '#FFFFFF', ink: A1.ink, sw: 1 }); }
  const P = [];
  for (let i = 0; i < 28; i++) { const a = i / 28 * TAU, bump = 1 + .07 * Math.cos(a * 7); P.push([x + Math.cos(a) * w * .5 * k * bump, y + Math.sin(a) * h * .5 * k * bump]); }
  paint(P, { wash: '#FFFFFF', ink: A1.ink, sw: 1.4, curv: .6 });
}
// a name badge (world space)
function a1Badge(txt, x, y, size, k, col = HSK.orange, key = txt) {
  if (k <= .01) return;
  boilSeed('badge ' + key);
  const w = txt.length * size * .5 + size * 1.2;
  push(); translate(x, y); scale(backOut(clamp(k))); paint(rrPts(-w / 2, -size * .7, w, size * 1.4, size * .7), { wash: col, ink: A1.ink, sw: 1.2 }); pop();
  letter(txt, x, y + size * .05, size, HSK.cream, { ink: false, rot: 0, pop: k * 5, stroke: A1.ink, sw: .15 });
}
// a crescent moon and a chakra: Shiva and Vishnu as signs (Mahishi's bubble)
function a1Moon(x, y, s, key = 'moon') {
  boilSeed('mn ' + key);
  paint([[x - s * .2, y - s], [x + s * .5, y - s * .8], [x + s * .95, y - s * .1], [x + s * .7, y + s * .7], [x - s * .1, y + s], [x + s * .3, y + s * .3], [x + s * .4, y - s * .3]], { wash: '#FFF2B8', fill: '#E8C870', fillOp: 40, ink: A1.ink, sw: 1, curv: .5 });
}
function a1Chakra(x, y, s, t, key = 'ck') {
  boilSeed('ckr ' + key);
  push(); translate(x, y); rotate(t * 2);
  paint(starPts(0, 0, s, .78, 12), { wash: A1.gold, ink: A1.ink, sw: 1 });
  paint(ellPts(0, 0, s * .62, s * .62, 18), { wash: '#FFE69A', ink: A1.ink, sw: .8 });
  for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; inkLine([[0, 0], [Math.cos(a) * s * .6, Math.sin(a) * s * .6]], .8, A1.goldDk, 'inkfine', 0); }
  paint(ellPts(0, 0, s * .15, s * .15, 10), { wash: '#D2283A', ink: null });
  pop();
}
