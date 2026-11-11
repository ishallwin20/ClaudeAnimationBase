// hanu1_props.js: sets and props for hanu1.js (ad 85, Hanuman Part 1, "HANUMAN JI has THREE fathers"). Loaded after
// src/hanuman_series.js and src/ramayan_sets.js (P1, tree, bush). Pure functions of their arguments (and T for boil).
//   H1                                         the palette
//   apsara                                     Punjikasthala on Parvati's rig (rose and gold, a mukut, a halo)
//   heaven, fallSky, forestHill, hilltop, kailashNight, ridge, caveSet     sets
//   swirl, bigLeaf, curseMark                  props
const H1 = {
  ink: '#2B2233', hvHi: '#F7B7C9', hvLo: '#FFE9C2', hvCloud: '#FFF6EC', hvCloudDk: '#F2CFC8',
  rainHi: '#5E6A8E', rainLo: '#A9B6CE', rainCloud: '#4A5272', rainCloudLt: '#6E7898', peak: '#7E8AA6', peakDk: '#5A6684', rock: '#8E8478', rockDk: '#665C54', rockLt: '#B8AEA0', moss: '#7EA066',
  kNight: '#1A2050', kNightLo: '#3A4A8E', snow: '#EEF4FF', snowDk: '#A9BCE6', snowSh: '#6E86C6', moon: '#FFF4D2',
  dawnHi: '#7A6AAE', dawnMid: '#F2A07A', dawnLo: '#FFD9A0', ridge: '#5A4A6E', ridgeDk: '#3E3250', ridgeFar: '#9A86B0',
  cave: '#2A2030', caveRock: '#7A6A6E', caveRockDk: '#54485A', caveRockLt: '#A8949A', leaf: '#5EA85A', leafDk: '#3A7A3E', leafLt: '#9AD288',
};

// ---------- cast ----------
const APS_PAL = { saree: '#E86A9A', sareeDk: '#B8426E', sareeLt: '#FFA6C8', blouse: '#8A5AC8', blouseDk: '#5E3A96', bangle: '#F2C230', skin: '#F6CBA6', skinDk: '#DCA07A', skinLt: '#FFE6CE', lip: '#D0506E' };
function apsara(x, y, u, o = {}) {
  return parvati(x, y, u, { col: APS_PAL.skin, dk: APS_PAL.skinDk, lt: APS_PAL.skinLt, ...o, pal: { ...APS_PAL, ...(o.pal || {}) },
    behind: (uu, sw) => { glow(0, -20 * uu, 9 * uu, '#FFE9A0', .55); const P = ellPts(0, -20.4 * uu, 4.6 * uu, 4.6 * uu, 26); inkLine([...P, P[0]], sw * 1.6, '#FFD86A', 'ink', .5); } });
}

// ---------- sets ----------
// Indra's heaven: a rose-gold sky, banks of cloud, slow sparkles; dark 0..1 clouds it over (the curse)
function heaven(t, dark = 0, key = 'hv') {
  boilSeed(key + 'sky');
  paint(rectPts(-600, -600, W + 1200, H + 1400), { wash: mixCol(H1.hvHi, '#4A3A6E', dark * .75), ink: null });
  paint(ellPts(540, 1500, 1300, 800, 26), { fill: mixCol(H1.hvLo, '#7A5A8E', dark * .7), fillOp: 220, bleed: .3, tex: .4, ink: null });
  glow(540, 900, 800, '#FFF0C0', .4 * (1 - dark));
  boilSeed(key + 'stars');
  for (let i = 0; i < 16; i++) { const x = hash(i * 2.3) * 1080, y = 380 + hash(i * 6.7) * 900, s = 5 + 7 * hash(i * 3.3) * (.5 + .5 * Math.sin(t * 2.4 + i * 1.7)); paint(starPts(x, y, s, .32, 4), { wash: '#FFFDF0', washOp: 230 * (1 - dark * .6), ink: null }); }
  const cc = mixCol(H1.hvCloud, '#9A86B0', dark * .7), cd = mixCol(H1.hvCloudDk, '#6A5A86', dark * .7);
  for (let i = 0; i < 5; i++) cloudPuff(-60 + i * 290 + 24 * Math.sin(t * .35 + i), 1280 + 70 * hash(i * 3.1), 190, key + 'b' + i, 255, cd, cd);
  for (let i = 0; i < 5; i++) cloudPuff(80 + i * 270 + 18 * Math.sin(t * .4 + i * 2), 1660 + 60 * hash(i * 4.4), 250, key + 'f' + i, 255, cc, cd);
  boilSeed(key + 'floor');
  paint(rectPts(-600, 1740, W + 1200, 900), { wash: cc, ink: null });
}
// falling through the sky: day blue, clouds streaking upward; k 0..1 through the fall
function fallSky(t, k, key = 'fs') {
  boilSeed(key);
  paint(rectPts(-600, -600, W + 1200, H + 1200), { wash: mixCol('#C9A6D6', '#9CC3E6', clamp(k * 1.5)), ink: null });
  paint(ellPts(540, 1700, 1300, 700, 24), { fill: '#FCE3BE', fillOp: 180 * k, bleed: .3, tex: .4, ink: null });
  for (let i = 0; i < 7; i++) { const y = 2300 - frac(hash(i * 5.3) + t * (1.3 + hash(i) * .6)) * 2900; cloudPuff(60 + hash(i * 2.9) * 960, y, 120 + 90 * hash(i * 1.7), key + i, 230); }
}
// a forest hill by day (Anjana's home): sky, far hills, trees at the sides, a grassy rise
function forestHill(t, key = 'fh', warm = 0) {
  boilSeed(key + 'sky');
  paint(rectPts(-600, -600, W + 1200, 2200), { wash: mixCol(P1.skyHi, '#F2B98A', warm), ink: null });
  paint(ellPts(540, 1450, 1200, 520, 26), { fill: mixCol(P1.skyLo, '#FFE8C2', warm), fillOp: 230, bleed: .3, tex: .4, ink: null });
  for (let i = 0; i < 3; i++) cloudPuff(120 + i * 400 + 20 * Math.sin(t * .3 + i), 800 + 110 * hash(i * 3.3), 90, key + 'c' + i, 220);
  boilSeed(key + 'hills');
  paint([[-300, 1560], [0, 1440], [280, 1500], [560, 1400], [860, 1480], [1380, 1420], [1380, 2200], [-300, 2200]], { wash: P1.hill, fill: P1.hillDk, fillOp: 40, tex: .4, ink: null, curv: .6 });
  tree(-10, 1700, 560, key + 'a', Math.sin(t * .9) * .3);
  tree(1090, 1690, 620, key + 'b', Math.sin(t * .8 + 1) * .3);
  boilSeed(key + 'ground');
  paint(rectPts(-300, 1690, W + 600, 900), { wash: P1.grass, fill: P1.grassDk, fillOp: 40, tex: .5, ink: null });
  inkLine([[-200, 1695], [400, 1684], [1280, 1698]], .8, P1.ink, 'ink', .5);
  bush(90, 1740, 100, key + 'b1'); bush(1010, 1750, 120, key + 'b2');
  boilSeed(key + 'tufts');
  for (let i = 0; i < 9; i++) { const x = 60 + hash(i * 3.7) * 960, y = 1790 + hash(i * 1.3) * 110; inkLine([[x - 8, y], [x - 3, y - 16], [x + 2, y], [x + 8, y - 13], [x + 12, y]], 1, P1.grassDk, 'inkfine', 0); }
}
// a mountain top in the rains: a slate sky, heavy clouds, far peaks, the rocky summit she walks on
function hilltop(t, key = 'ht') {
  boilSeed(key + 'sky');
  paint(rectPts(-600, -600, W + 1200, 2300), { wash: H1.rainHi, ink: null });
  paint(ellPts(540, 1500, 1300, 700, 26), { fill: H1.rainLo, fillOp: 230, bleed: .3, tex: .4, ink: null });
  boilSeed(key + 'peaks');
  paint([[-300, 1600], [-60, 1380], [140, 1470], [330, 1300], [520, 1450], [760, 1330], [960, 1460], [1380, 1340], [1380, 2200], [-300, 2200]], { wash: H1.peak, fill: H1.peakDk, fillOp: 50, tex: .5, ink: null, curv: .25 });
  for (let i = 0; i < 5; i++) cloudPuff(-80 + i * 300 + 30 * Math.sin(t * .25 + i * 1.3), 760 + 90 * hash(i * 2.7), 230, key + 'c' + i, 255, i % 2 ? H1.rainCloudLt : H1.rainCloud, H1.rainCloud);
  boilSeed(key + 'rain');
  for (let i = 0; i < 22; i++) { const x = hash(i * 3.1) * 1200 - 60, y = 900 + frac(hash(i * 7.7) + t * 1.4) * 760; inkLine([[x, y], [x - 12, y + 42]], 1.1, '#DCE6F6', 'inkfine', 0); }
  boilSeed(key + 'top');
  paint([[-300, 1760], [-40, 1712], [260, 1700], [560, 1690], [860, 1702], [1140, 1716], [1380, 1770], [1380, 2400], [-300, 2400]], { wash: H1.rock, fill: H1.rockDk, fillOp: 50, tex: .6, ink: H1.ink, sw: 1.2, curv: .3 });
  paint(ellPts(520, 1716, 420, 22, 16), { wash: H1.moss, washOp: 190, ink: null });
  for (let i = 0; i < 5; i++) inkLine([[80 + i * 220, 1800 + (i % 2) * 40], [130 + i * 220, 1880 + (i % 2) * 30]], 1.1, H1.rockDk, 'inkfine', .3);
  paint(ellPts(300, 1790, 90, 20, 10), { wash: H1.rockLt, washOp: 140, ink: null });
}
// Kailash at night: indigo, stars, a crescent, the white peak behind him, a snow ledge
function kailashNight(t, key = 'kn') {
  boilSeed(key + 'sky');
  paint(rectPts(-600, -600, W + 1200, 2400), { wash: H1.kNight, ink: null });
  paint(ellPts(540, 1500, 1300, 800, 26), { fill: H1.kNightLo, fillOp: 220, bleed: .3, tex: .4, ink: null });
  boilSeed(key + 'stars');
  for (let i = 0; i < 26; i++) paint(starPts(hash(i * 2.3) * 1080, 360 + hash(i * 6.7) * 760, 3 + 5 * hash(i * 3.3) * (.6 + .4 * Math.sin(t * 2 + i)), .4, 4), { wash: '#FFF6DA', ink: null });
  boilSeed(key + 'peak');
  paint([[-300, 1560], [120, 1360], [330, 1180], [470, 930], [540, 840], [620, 940], [760, 1170], [960, 1350], [1380, 1540], [1380, 2400], [-300, 2400]], { wash: H1.snow, fill: H1.snowDk, fillOp: 60, tex: .5, ink: H1.ink, sw: 1.2, curv: .2 });
  paint([[540, 840], [620, 940], [760, 1170], [960, 1350], [1380, 1540], [1380, 1700], [700, 1500], [560, 1100]], { wash: H1.snowSh, washOp: 120, ink: null, curv: .2 });
  for (let i = 0; i < 4; i++) inkLine([[430 - i * 70, 1010 + i * 110], [520 + i * 30, 1060 + i * 120]], 1.2, H1.snowSh, 'inkfine', .2);
  boilSeed(key + 'ledge');
  paint([[-300, 1700], [100, 1660], [540, 1650], [980, 1664], [1380, 1700], [1380, 2400], [-300, 2400]], { wash: '#DCE6FA', fill: H1.snowDk, fillOp: 50, tex: .4, ink: H1.ink, sw: 1, curv: .3 });
  boilSeed(key + 'snowfall');
  for (let i = 0; i < 14; i++) { const x = hash(i * 3.3) * 1080 + 20 * Math.sin(t + i), y = 400 + frac(hash(i * 5.1) + t * .08) * 1300; paint(ellPts(x, y, 4, 4, 6), { wash: '#FFFFFF', washOp: 200, ink: null }); }
}
// a ridge at dawn (the sages' walk): the hills slide by scroll px
function ridge(t, scroll = 0, key = 'rg') {
  boilSeed(key + 'sky');
  paint(rectPts(-600, -600, W + 1200, 2400), { wash: H1.dawnHi, ink: null });
  paint(ellPts(540, 1450, 1300, 700, 26), { fill: H1.dawnMid, fillOp: 220, bleed: .3, tex: .4, ink: null });
  paint(ellPts(540, 1640, 1200, 380, 26), { fill: H1.dawnLo, fillOp: 220, bleed: .3, tex: .4, ink: null });
  glow(820, 1500, 420, '#FFE2A0', .5);
  boilSeed(key + 'far');
  const far = []; for (let i = 0; i <= 12; i++) far.push([-200 + i * 130, 1470 - 90 * Math.abs(Math.sin(i * 1.3 + scroll * .0016))]);
  paint([...far, [1400, 2300], [-200, 2300]], { wash: H1.ridgeFar, ink: null, curv: .5 });
  for (let i = 0; i < 4; i++) cloudPuff(1300 - frac(hash(i * 4.4) + scroll * .0003) * 1600, 700 + hash(i * 3.3) * 420, 80 + 50 * hash(i), key + 'c' + i, 190, '#FFE2CC', '#E8B8A8');
  boilSeed(key + 'near');
  paint([[-300, 1700], [0, 1672], [300, 1660], [600, 1668], [900, 1656], [1380, 1690], [1380, 2400], [-300, 2400]], { wash: H1.ridge, fill: H1.ridgeDk, fillOp: 50, tex: .5, ink: H1.ink, sw: 1.1, curv: .4 });
  for (let i = 0; i < 6; i++) { const x = 1300 - frac(hash(i * 2.2) + scroll * .0009) * 1500; bush(x, 1690 + 120 * hash(i * 6.1), 46 + 26 * hash(i), key + 'bush' + i, '#6E5A86', '#4E3E66'); }
}
// the cave in the hillside at night: glowK 0..1 fills its mouth with gold light
function caveSet(t, glowK = 0, key = 'cv') {
  boilSeed(key + 'sky');
  paint(rectPts(-600, -600, W + 1200, 2400), { wash: '#232A5E', ink: null });
  paint(ellPts(540, 1300, 1200, 700, 26), { fill: '#4A4E96', fillOp: 200, bleed: .3, tex: .4, ink: null });
  boilSeed(key + 'stars');
  for (let i = 0; i < 20; i++) paint(starPts(hash(i * 2.3) * 1080, 380 + hash(i * 6.7) * 520, 3 + 5 * hash(i * 3.3) * (.6 + .4 * Math.sin(t * 2 + i)), .4, 4), { wash: '#FFF6DA', ink: null });
  boilSeed(key + 'rock');
  paint([[-300, 1300], [60, 1010], [330, 900], [560, 860], [800, 910], [1040, 1030], [1380, 1320], [1380, 2400], [-300, 2400]], { wash: H1.caveRock, fill: H1.caveRockDk, fillOp: 55, tex: .6, ink: H1.ink, sw: 1.3, curv: .35 });
  for (let i = 0; i < 5; i++) inkLine([[120 + i * 200, 1120 + (i % 2) * 60], [170 + i * 200, 1230 + (i % 2) * 50]], 1.1, H1.caveRockDk, 'inkfine', .3);
  boilSeed(key + 'mouth');
  const M = [[250, 1700], [262, 1380], [360, 1170], [540, 1090], [720, 1170], [818, 1380], [830, 1700]];
  paint(M, { wash: mixCol(H1.cave, '#FFD070', glowK * .85), ink: H1.ink, sw: 1.6, curv: .5 });
  if (glowK > 0) { glow(540, 1450, 520 * glowK + 100, '#FFD070', .8 * glowK); glow(540, 1500, 900 * glowK, '#FFB040', .3 * glowK); }
  boilSeed(key + 'ground');
  paint([[-300, 1690], [200, 1700], [540, 1708], [880, 1700], [1380, 1690], [1380, 2400], [-300, 2400]], { wash: '#5E6A7E', fill: '#3E465E', fillOp: 50, tex: .5, ink: H1.ink, sw: 1, curv: .3 });
  if (glowK > 0) paint(ellPts(540, 1790, 420 * glowK + 60, 70, 20), { fill: '#FFD070', fillOp: 120 * glowK, bleed: .3, tex: .3, ink: null });
  bush(120, 1720, 90, key + 'b1', '#4E7A5E', '#365A46'); bush(980, 1730, 110, key + 'b2', '#4E7A5E', '#365A46');
}

// ---------- props ----------
// the wind as a swirl of pale ribbons and leaves circling (x, y), r wide, h tall; k 0..1 its strength
function swirl(x, y, r, h, t, k = 1, key = 'sw', n = 4) {
  if (k <= 0) return;
  boilSeed(key);
  for (let i = 0; i < n; i++) {
    const ph = t * 5 + i * TAU / n, yy = y - h * (i + .5) / n, P = [];
    for (let j = 0; j <= 8; j++) { const a = ph + j * .32; P.push([x + Math.cos(a) * r * (1 - .12 * i), yy + Math.sin(a) * r * .2 - j * 3]); }
    if (Math.sin(ph + 1.2) > -.3) inkLine(P, 5 * k, '#F2FAFF', 'ink', .6);
    else inkLine(P, 2.2 * k, '#CFE4F6', 'inkfine', .6);
  }
  for (let i = 0; i < 6; i++) {
    const a = t * 4.2 + i * 1.05, yy = y - h * hash(i * 3.3), px = x + Math.cos(a) * r * 1.05, py = yy + Math.sin(a) * r * .22;
    push(); translate(px, py); rotate(a * 2);
    paint([[-13, 0], [0, -7], [13, 0], [0, 7]], { wash: i % 2 ? H1.leaf : H1.leafLt, washOp: 255 * k, ink: H1.ink, sw: .6, curv: .5 });
    pop();
  }
}
// a long leaf from (x0, y0) to (x1, y1), sagging by sag at its middle: one green blade with a midrib
function bigLeaf(x0, y0, x1, y1, sag = 0, key = 'leaf', w = 54) {
  boilSeed(key);
  const mx = (x0 + x1) / 2, my = (y0 + y1) / 2 + sag;
  const dx = x1 - x0, dy = y1 - y0, d = Math.hypot(dx, dy) || 1, nx = -dy / d, ny = dx / d;
  const at = k => { const a = lerp(x0, mx, k * 2), b = lerp(y0, my, k * 2), c = lerp(mx, x1, k * 2 - 1), e = lerp(my, y1, k * 2 - 1); return k < .5 ? [a, b] : [c, e]; };
  const top = [], bot = [];
  for (let i = 0; i <= 10; i++) { const k = i / 10, p = at(k), ww = w * Math.sin(k * Math.PI) ** .6; top.push([p[0] + nx * ww * .5, p[1] + ny * ww * .5 - ww * .1]); bot.push([p[0] - nx * ww * .5, p[1] - ny * ww * .5]); }
  paint([...top, ...bot.reverse()], { wash: H1.leaf, fill: H1.leafDk, fillOp: 50, tex: .5, ink: H1.ink, sw: 1.1, curv: .3 });
  inkLine([at(.03), at(.25), at(.5), at(.75), at(.97)], 1.6, H1.leafLt, 'inkfine', .4);
  return at;
}
// the curse: a violet crackle round (x, y)
function curseMark(x, y, r, t, k, key = 'cm') {
  if (k <= 0) return;
  boilSeed(key);
  glow(x, y, r * 1.6, '#B070FF', .7 * k);
  for (let i = 0; i < 7; i++) {
    const a = i / 7 * TAU + t * 1.4, r0 = r * .75, r1 = r * (1.05 + .2 * hash(i));
    inkLine([[x + Math.cos(a) * r0, y + Math.sin(a) * r0], [x + Math.cos(a + .12) * (r0 + r1) / 2, y + Math.sin(a + .12) * (r0 + r1) / 2], [x + Math.cos(a - .05) * r1, y + Math.sin(a - .05) * r1]], 5 * k, '#D9B0FF', 'ink', 0);
  }
}
