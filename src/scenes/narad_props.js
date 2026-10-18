// narad_props.js: the sets and props for "Narad Muni thought he looked like VISHNU" (src/scenes/narad.js, ad 22).
// Loaded before it; everything here is a pure function of its arguments (and T for boil).
//
//   TK, vanishPuff, sparkleBurst, whipH, whipV, bolt      copied from the Shani reel (ad 21)
//   NP                                  this reel's palette
//   roseSet(t)                          the hook's plain rose ground
//   visionSet(t, k), visions(t, ts, cx, cy, s)   the red-gold vision disc and its silhouettes (the prince with the bow,
//                                       the golden deer, the vanaras), each popping in at ts[i]
//   caveSet(t, bloom)                   the Himalayan cave by the Ganga; bloom 0..1 brings spring
//   kailashSet(t)                       Shiva's snow ledge under Kailash
//   oceanSet(t)                         the milk ocean (Kshirasagara)
//   citySet(t, rise)                    hills and the gold city rising behind them (rise 0..1)
//   palaceSet(t)                        the rose palace inside, for the palm
//   hallSet(t), kingRow(t, y, s)        the swayamvara hall and its row of seated kings
//   gardenSet(t), pondWater(t, o)       the garden with its pond; the water seen from above (the reflection shot)
//   roadSet(t, maya)                    the road at dusk (maya 1: the illusion's gold glow; 0: plain)
//   peachSet(t)                         the ask
//   sapling(u, sw, grow, wilt)          the tree of pride on Narada's topknot (his hat hook)
//   ganaBrahmin(x, y, u, o)             one of Shiva's ganas in brahmin disguise (o.demon 0..1: the curse's rakshasa)
//   palmClose(x, y, s, lines)           the princess's palm, its lines glowing
//   narCard(t, C), narStrike(t, C)      the end card (the 15K Family Deal)
const TK = {
  ink: '#2B2233', cream: '#FFF5E2',
  petal: '#F4A6B8', petalDk: '#E0708C', marigold: '#F39A2E', yellow: '#FFD45A', leaf: '#5E9A6A',
  gold: '#EDB43C', goldLt: '#FFE39A', goldDk: '#B67D1C',
  rkOrange: '#F15A24', peach: '#FBE0CF', peachLt: '#FFF1E6', brown: '#3A2418', grey: '#6B5A50', teal: '#2E5F5A',
};
const NP = {
  ink: '#2B2233',
  rose: '#F2B8C0', roseDk: '#D98A98', roseLt: '#FBDDE0',
  vis: '#5A1E3A', visDk: '#3A1028', visGold: '#FFC65A', visGoldLt: '#FFE9A8', sil: '#3A1A24',
  sky: '#CFE3F2', skyLt: '#EEF5FA', skyDk: '#A9C6E2', snow: '#F6F8FC', snowDk: '#C9D3E6', rock: '#8C8FB0', rockDk: '#6A6C90',
  cave: '#7A6A82', caveDk: '#4A3E58', caveIn: '#2E2438', river: '#9ED4EE', riverDk: '#5FA6D6', riverLt: '#DDF2FB',
  grass: '#7DB86A', grassDk: '#4E8A4E', bush: '#5E9A5A', bushDk: '#3E7A44', bloom1: '#F4A6B8', bloom2: '#FFD45A', bloom3: '#FFFFFF',
  milk: '#F6F2E8', milkDk: '#DCD6C8', milkLt: '#FFFFFF', oceanSky: '#DCEAF6',
  hill: '#A8C98A', hillDk: '#7FA866', city: '#F2C230', cityDk: '#C8922A', cityLt: '#FFE69A', dome: '#F6D36A', flag: '#D9302E', wall: '#F4DDB0', wallDk: '#D8B88A',
  palace: '#F6C8C8', palaceDk: '#D99A9E', arch: '#E8A0A8', lamp: '#FFD27A',
  hall: '#C8324A', hallDk: '#8E1E32', hallLt: '#E8697A', pillar: '#F2C88A', pillarDk: '#C8945A', carpet: '#9A2438', carpetGold: '#EDB43C', floor: '#F0D2A8',
  king: '#7A4A6A', kingDk: '#5A3050', kingGold: '#E8B84A',
  garden: '#9CCB7A', gardenDk: '#6EA05A', water: '#7EC4E0', waterDk: '#4E98C0', waterLt: '#C6E8F4', lily: '#5E9A5A', lilyDk: '#3E7A44',
  dusk: '#7A5AA6', duskDk: '#4A3C80', duskLt: '#C2A0D8', duskPink: '#F2A0B0', path: '#C8A07A', pathDk: '#9A7458', maya: '#FFD98A',
  gold2: '#FFF0C4', goldSky: '#F8D890',
  curse: '#FF6A4A', curseCore: '#FFF4DC', blue: '#7FB6FF', blueLt: '#CFE4FF',
  ganaSkin: '#E8B88A', ganaSkinDk: '#C89068', ganaDhoti: '#FFF4E2', ganaDhotiDk: '#E2D2B6',
  demon: '#D9483E', demonDk: '#9E2A26', demonLt: '#F07A6A', horn: '#F4E8D0', hornDk: '#B8A688',
  palm: '#F7D2B4', palmDk: '#D9A684', palmLine: '#E8A07A',
  sap: '#6AAE5A', sapDk: '#3E7A40', sapWilt: '#A89A6A', bark: '#8A5A3A',
};

// ---------- copied from the Shani reel ----------
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
function bolt(p0, p1, k, col = NP.curse, key = 'bolt') {
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

// ---------- sets ----------
function roseSet(t) {
  boilSeed('rose');
  paint(rectPts(-800, -800, 2700, 3600), { wash: NP.rose, fill: NP.roseDk, fillOp: 50, bleed: .2, tex: .4, ink: null });
  paint(ellPts(540, 900, 820, 900, 30, 4), { fill: NP.roseLt, fillOp: 140, bleed: .3, tex: .4, border: .6, ink: null });
  boilSeed('rose sparks');
  for (let i = 0; i < 14; i++) { const x = hash(i * 3.1) * 1080, y = 200 + hash(i * 7.7) * 1500, r = 6 + 9 * hash(i) * (.6 + .4 * Math.sin(t * 2 + i)); paint(starPts(x, y, r, .3, 4), { wash: '#FFFFFF', washOp: 170, ink: null }); }
}
function visionSet(t, k = 1) {
  boilSeed('vis bg');
  paint(rectPts(-800, -800, 2700, 3600), { wash: NP.vis, fill: NP.visDk, fillOp: 80, bleed: .2, tex: .5, ink: null });
  glow(540, 1000, 760 * k, '#FF9A4A', .55 * k);
  boilSeed('vis disc');
  paint(ellPts(540, 1000, 470 * k, 470 * k, 40, 3), { wash: NP.visGold, fill: '#F2A040', fillOp: 70, bleed: .2, tex: .5, ink: null });
  paint(ellPts(540, 1000, 330 * k, 330 * k, 36, 3), { fill: NP.visGoldLt, fillOp: 140, bleed: .3, tex: .4, border: .6, ink: null });
  boilSeed('vis rays');
  for (let i = 0; i < 16; i++) { const a = i / 16 * TAU + t * .15, r0 = 500 * k, r1 = (640 + 60 * Math.sin(t * 3 + i)) * k; paint([[540 + Math.cos(a - .04) * r0, 1000 + Math.sin(a - .04) * r0], [540 + Math.cos(a) * r1, 1000 + Math.sin(a) * r1], [540 + Math.cos(a + .04) * r0, 1000 + Math.sin(a + .04) * r0]], { wash: NP.visGold, washOp: 160, ink: null }); }
}
// the silhouettes of the vision: s scales them (1 ≈ a 300 px tall prince)
function ramSil(x, y, s, k = 1) {
  if (k <= .01) return;
  const P = pts => pts.map(([a, b]) => [x + a * s * k, y + b * s * k]), C = NP.sil;
  boilSeed('ramsil');
  paint(P([[-34, 0], [-22, -120], [-30, -170], [-40, -235], [-24, -262], [0, -270], [24, -262], [40, -235], [30, -170], [22, -120], [34, 0], [12, 0], [0, -100], [-12, 0]]), { wash: C, ink: null, curv: .2 });
  paint(ellPts(x, y - 300 * s * k, 30 * s * k, 34 * s * k, 16), { wash: C, ink: null });
  paint(P([[-24, -322], [24, -322], [14, -360], [0, -372], [-14, -360]]), { wash: C, ink: null });   // the mukut
  inkLine(P([[60, -330], [92, -230], [96, -150], [86, -60]]), 6 * s * k, C, 'ink', .6);   // the bow
  inkLine(P([[60, -330], [86, -60]]), 1.5 * s * k, C, 'inkfine', 0);
  inkLine(P([[34, -230], [80, -200]]), 14 * s * k, C, 'ink', 0);   // the arm to the bow
  paint(P([[-40, -250], [-60, -300], [-50, -310], [-30, -255]]), { wash: C, ink: null });   // the quiver's arrows
}
function deerSil(x, y, s, k = 1, ph = 0) {
  if (k <= .01) return;
  const P = pts => pts.map(([a, b]) => [x + a * s * k, y + b * s * k]), lg = Math.sin(ph) * 14;
  boilSeed('deersil');
  paint(P([[-90, -110], [-40, -125], [40, -125], [80, -140], [96, -190], [118, -196], [124, -176], [104, -150], [96, -105], [60, -80], [-60, -80], [-100, -95]]), { wash: '#F2B23A', ink: NP.sil, sw: 2 * s * k, curv: .3 });
  for (const [a, b] of [[-60, lg], [-40, -lg], [50, -lg], [70, lg]]) inkLine(P([[a, -85], [a + b, 0]]), 8 * s * k, '#C8862A', 'ink', 0);
  for (const sx of [-1, 1]) inkLine(P([[104, -194], [104 + sx * 16, -230], [104 + sx * 26, -250]]), 4 * s * k, '#C8862A', 'ink', .4);
  for (let i = 0; i < 6; i++) paint(ellPts(x + (-60 + i * 22) * s * k, y + (-108 + (i % 2) * 8) * s * k, 6 * s * k, 6 * s * k, 8), { wash: '#FFF0B0', ink: null });   // the golden spots
}
function vanaraSil(x, y, s, k = 1, ph = 0) {
  if (k <= .01) return;
  const P = pts => pts.map(([a, b]) => [x + a * s * k, y + b * s * k]), C = NP.sil, j = Math.sin(ph) * 10;
  boilSeed('vansil' + Math.round(x));
  paint(P([[-30, 0 + j], [-26, -60], [-36, -110], [-20, -150], [20, -150], [36, -110], [26, -60], [30, 0 - j], [10, -40], [-10, -40]]), { wash: C, ink: null, curv: .3 });
  paint(ellPts(x, y - 180 * s * k, 32 * s * k, 30 * s * k, 16), { wash: C, ink: null });
  for (const sx of [-1, 1]) paint(ellPts(x + sx * 32 * s * k, y - 182 * s * k, 11 * s * k, 11 * s * k, 10), { wash: C, ink: null });
  inkLine(P([[-36, -128], [-70, -170 + j], [-80, -210]]), 12 * s * k, C, 'ink', .5);   // an arm raised
  inkLine(P([[0, -40], [60, -20], [90, -70], [70, -110]]), 9 * s * k, C, 'ink', .6);   // the tail
}
function visions(t, ts, cx, cy, s) {
  const pk = t0 => backOut(clamp((t - t0) / .35));
  ramSil(cx - 170 * s, cy + 200 * s, .95 * s, pk(ts[0]));
  deerSil(cx + 150 * s, cy + 40 * s, .95 * s, pk(ts[1]), t * 8);
  for (let i = 0; i < 4; i++) vanaraSil(cx - 240 * s + i * 160 * s, cy + 430 * s + (i % 2) * 20 * s, .62 * s, pk(ts[2] + i * .1), t * 9 + i);
}
function snowPeaks(y0, key) {
  boilSeed(key);
  paint([[-700, y0 + 450], [-260, y0], [40, y0 + 220], [330, y0 - 140], [540, y0 - 320], [760, y0 - 100], [980, y0 + 120], [1260, y0 - 60], [1800, y0 + 450]], { wash: NP.rock, fill: NP.rockDk, fillOp: 60, tex: .5, ink: NP.ink, sw: .8 });
  paint([[300, y0 - 100], [540, y0 - 320], [780, y0 - 80], [690, y0 - 60], [610, y0 - 140], [540, y0 - 50], [450, y0 - 120], [380, y0 - 50]], { wash: NP.snow, ink: null });
  paint([[-330, y0 + 60], [-260, y0], [-190, y0 + 70], [-250, y0 + 90]], { wash: NP.snow, ink: null });
}
function caveSet(t, bloom = 0) {
  boilSeed('cv sky');
  paint(rectPts(-700, -600, 2500, 2000), { wash: NP.sky, fill: NP.skyDk, fillOp: 60, bleed: .2, tex: .4, ink: null });
  snowPeaks(820, 'cv peaks');
  boilSeed('cv meadow');
  paint([[-700, 1150], [300, 1080], [1800, 1180], [1800, 2600], [-700, 2600]], { wash: mixCol('#B8C8A8', NP.grass, bloom), fill: NP.grassDk, fillOp: 50, tex: .5, ink: null });
  boilSeed('cv river');   // the Ganga, down the right side
  paint([[620, 1120], [760, 1110], [1300, 1500], [1300, 2000], [980, 2000], [820, 1500]], { wash: NP.river, fill: NP.riverDk, fillOp: 60, tex: .5, ink: NP.ink, sw: .7, curv: .3 });
  for (let i = 0; i < 7; i++) { const k = frac(hash(i * 2.2) + t * .25), y = lerp(1130, 1950, k), x = lerp(700, 1080, k) + 40 * Math.sin(i * 3); inkLine([[x - 30, y], [x, y - 6], [x + 30, y]], 3, NP.riverLt, 'inkfine', .5); }
  boilSeed('cv rock');   // the cave: a rock arch, a dark mouth, a ledge
  paint([[-260, 1700], [-240, 1000], [-120, 760], [120, 640], [400, 650], [640, 820], [720, 1100], [700, 1700]], { wash: NP.cave, fill: NP.caveDk, fillOp: 60, tex: .6, ink: NP.ink, sw: 1, curv: .3 });
  paint([[-60, 1660], [-40, 1150], [60, 930], [240, 860], [420, 930], [520, 1150], [540, 1660]], { wash: NP.caveIn, fill: '#1E1828', fillOp: 70, tex: .5, ink: null, curv: .4 });
  paint(ellPts(240, 1600, 330, 60, 22, 3), { wash: '#8A7A92', fill: NP.caveDk, fillOp: 50, tex: .5, ink: NP.ink, sw: .8 });
  boilSeed('cv meadow flowers');   // spring carpets the meadow in front
  for (let i = 0; i < 28; i++) {
    const x = -100 + hash(i * 3.3) * 1300, y = 1720 + hash(i * 5.9) * 420, k = backOut(clamp(bloom * 6 - hash(i * 1.7) * 4));
    paint(ellPts(x, y + 10, 26, 10, 10), { wash: NP.grassDk, washOp: 160, ink: null });
    if (k > .02) paint(starPts(x, y, 20 * k, .45, 5, t * .2 + i), { wash: [NP.bloom1, NP.bloom2, NP.bloom3, '#B98CFF'][i % 4], ink: NP.ink, sw: .4 });
  }
  boilSeed('cv bushes');
  for (const [x, y, r] of [[-140, 1640, 150], [680, 1620, 140], [880, 1240, 90], [-120, 1180, 80], [560, 820, 70]]) {
    paint(ellPts(x, y, r, r * .7, 18, 4), { wash: mixCol('#8A9A7A', NP.bush, bloom), fill: NP.bushDk, fillOp: 60, tex: .6, ink: NP.ink, sw: .7 });
    for (let i = 0; i < 7; i++) {   // spring: flowers pop open one after another
      const k = backOut(clamp(bloom * 8 - i - hash(x + i) * 1.5)), a = hash(x * .1 + i) * TAU, d = r * .55 * hash(i * 3 + x);
      if (k > .02) paint(starPts(x + Math.cos(a) * d, y + Math.sin(a) * d * .6, 16 * k, .45, 5, t * .3), { wash: [NP.bloom1, NP.bloom2, NP.bloom3][i % 3], ink: NP.ink, sw: .35 });
    }
  }
}
function kailashSet(t) {
  boilSeed('kl sky');
  paint(rectPts(-700, -600, 2500, 2400), { wash: NP.sky, fill: NP.skyDk, fillOp: 70, bleed: .2, tex: .4, ink: null });
  paint(ellPts(540, 500, 800, 340, 24, 4), { fill: NP.skyLt, fillOp: 130, bleed: .3, tex: .5, border: .6, ink: null });
  boilSeed('kl peak');   // Kailash: the four-faced peak
  paint([[-700, 1300], [-100, 900], [200, 760], [420, 460], [560, 420], [700, 480], [900, 760], [1200, 900], [1800, 1300]], { wash: NP.rock, fill: NP.rockDk, fillOp: 60, tex: .5, ink: NP.ink, sw: .8 });
  paint([[340, 600], [420, 460], [560, 420], [700, 480], [790, 620], [700, 600], [620, 660], [540, 590], [460, 650]], { wash: NP.snow, ink: null });
  boilSeed('kl ledge');
  paint([[-700, 1420], [-200, 1330], [500, 1360], [1100, 1300], [1800, 1380], [1800, 2600], [-700, 2600]], { wash: NP.snow, fill: NP.snowDk, fillOp: 70, tex: .5, ink: NP.ink, sw: .8 });
  boilSeed('kl front');   // foreground: snowy boulders and two little pines
  for (const [x, y, r] of [[-60, 2080, 240], [1100, 2060, 220], [520, 2200, 260]]) { paint(ellPts(x, y, r, r * .55, 20, 4), { wash: NP.rock, fill: NP.rockDk, fillOp: 60, tex: .5, ink: NP.ink, sw: .9 }); paint(ellPts(x - r * .1, y - r * .35, r * .75, r * .25, 16, 3), { wash: NP.snow, ink: null }); }
  for (const [x, y, h] of [[150, 1900, 300], [920, 1880, 260]]) { paint(rectPts(x - 10, y - 30, 20, 60), { wash: '#6E4A32', ink: NP.ink, sw: .5 }); for (let j = 0; j < 3; j++) paint([[x - h * (.32 - j * .07), y - 30 - j * h * .28], [x, y - 30 - h * (.45 + j * .28)], [x + h * (.32 - j * .07), y - 30 - j * h * .28]], { wash: '#3E7A54', fill: '#2C5A3C', fillOp: 50, ink: NP.ink, sw: .6 }); }
  boilSeed('kl flakes');
  for (let i = 0; i < 18; i++) { const x = frac(hash(i * 2.1) + Math.sin(t * .5 + i) * .01) * 1200 - 60, y = frac(hash(i * 5.3) + t * (.04 + .03 * hash(i))) * 2000 - 40; paint(ellPts(x, y, 4 + 4 * hash(i), 4 + 4 * hash(i), 6), { wash: '#FFFFFF', washOp: 200, ink: null }); }
}
function oceanSet(t) {
  boilSeed('oc sky');
  paint(rectPts(-700, -600, 2500, 1800), { wash: NP.oceanSky, fill: NP.skyDk, fillOp: 40, bleed: .2, tex: .4, ink: null });
  glow(540, 700, 600, '#FFF2C8', .4);
  boilSeed('oc sea');
  paint(rectPts(-700, 1150, 2500, 1500), { wash: NP.milk, fill: NP.milkDk, fillOp: 50, tex: .5, ink: null });
  inkLine([[-700, 1150], [1800, 1150]], 2, NP.milkDk, 'ink', 0);
  for (let r = 0; r < 7; r++) {   // rolling milk waves, each row drifting
    boilSeed('oc wave' + r);
    const y = 1200 + r * 110, ph = t * (.6 + r * .1) + r;
    const P = []; for (let i = 0; i <= 14; i++) { const x = -200 + i * 110; P.push([x, y + 14 * Math.sin(i * 1.1 + ph * 2)]); }
    inkLine(P, 3 + r * .6, r % 2 ? NP.milkDk : '#FFFFFF', 'ink', .6);
  }
  boilSeed('oc lotus');   // lotuses drifting on the milk in front
  for (const [x, y, r] of [[160, 1850, 1], [950, 1790, .8], [560, 2000, 1.2]]) {
    const yy = y + 8 * Math.sin(t * 1.5 + x);
    paint(ellPts(x, yy + 20 * r, 110 * r, 30 * r, 16), { wash: '#6AA45A', fill: '#4A8040', fillOp: 50, ink: NP.ink, sw: .6 });
    push(); translate(x, yy); lotus(42 * r, .9, 1, NP.ink); pop();
  }
}
function citySet(t, rise = 1) {
  boilSeed('ct sky');
  paint(rectPts(-700, -600, 2500, 2400), { wash: '#F8E6C8', fill: '#EFC9A0', fillOp: 60, bleed: .2, tex: .4, ink: null });
  glow(540, 900, 640, '#FFE0A0', .35 + .3 * rise);
  // the city, rising from behind the hills
  push(); translate(0, (1 - easeOut(rise)) * 700);
  boilSeed('ct city');
  for (const [x, w, h, d] of [[140, 170, 420, 1], [330, 150, 560, 1], [540, 220, 720, 2], [760, 150, 540, 1], [930, 170, 400, 1]]) {
    const top = 1250 - h;
    paint(rectPts(x - w / 2, top, w, h + 200), { wash: NP.wall, fill: NP.wallDk, fillOp: 60, tex: .5, ink: NP.ink, sw: .8 });
    for (let j = 0; j < 3; j++) paint(rrPts(x - 18, top + 70 + j * 120, 36, 70, 18), { wash: NP.cityDk, ink: NP.ink, sw: .5 });
    paint([[x - w / 2 - 6, top], [x - w * .42, top - 70 * d], [x - w * .2, top - 130 * d], [x, top - 170 * d], [x + w * .2, top - 130 * d], [x + w * .42, top - 70 * d], [x + w / 2 + 6, top]], { wash: NP.dome, fill: NP.cityDk, fillOp: 50, tex: .5, ink: NP.ink, sw: .8, curv: .5 });
    inkLine([[x, top - 170 * d], [x, top - 240 * d]], 3, NP.ink, 'inkfine', 0);
    paint([[x, top - 240 * d], [x + 50, top - 225 * d + 8 * Math.sin(t * 6 + x)], [x, top - 205 * d]], { wash: NP.flag, ink: NP.ink, sw: .4 });
  }
  pop();
  if (rise > 0 && rise < 1) for (let i = 0; i < 5; i++) sparkleBurst(140 + i * 200, 1200 - 300 * hash(i), 60, (rise - i * .1) * 1.2, 'cityspark' + i);
  boilSeed('ct hills');
  paint([[-700, 1300], [-200, 1180], [300, 1260], [700, 1170], [1200, 1250], [1800, 1200], [1800, 2600], [-700, 2600]], { wash: NP.hill, fill: NP.hillDk, fillOp: 60, tex: .5, ink: NP.ink, sw: .8 });
  boilSeed('ct road');
  paint([[-700, 1520], [1800, 1460], [1800, 1700], [-700, 1760]], { wash: '#E8CFA0', fill: '#C8A878', fillOp: 50, tex: .5, ink: null });
}
function palaceSet(t) {
  boilSeed('pl wall');
  paint(rectPts(-700, -600, 2500, 3200), { wash: NP.palace, fill: NP.palaceDk, fillOp: 50, bleed: .2, tex: .5, ink: null });
  boilSeed('pl arches');
  for (const x of [80, 540, 1000]) {
    paint([[x - 170, 1500], [x - 170, 700], [x - 120, 560], [x, 470], [x + 120, 560], [x + 170, 700], [x + 170, 1500]], { wash: NP.arch, fill: NP.palaceDk, fillOp: 50, tex: .4, ink: NP.ink, sw: .7, curv: .4 });
    glow(x, 360, 90, NP.lamp, .5 + .1 * Math.sin(t * 5 + x));
    inkLine([[x, 200], [x, 330]], 2, NP.ink, 'inkfine', 0);
    paint(ellPts(x, 360, 26, 32, 10), { wash: NP.lamp, ink: NP.ink, sw: .5 });
  }
}
function kingRow(t, y, s, n = 6, x0 = -60, dx = 230, key = 'kings') {
  for (let i = 0; i < n; i++) {
    const x = x0 + i * dx, b = Math.sin(t * 1.6 + i * 1.3) * 4 * s, P = pts => pts.map(([a, c]) => [x + a * s, y + c * s + b]);
    boilSeed(key + i);
    paint(P([[-70, 0], [-60, -120], [-40, -150], [40, -150], [60, -120], [70, 0]]), { wash: i % 2 ? NP.king : NP.kingDk, ink: NP.ink, sw: .6 * s, curv: .3 });
    paint(ellPts(x, y - 195 * s + b, 46 * s, 48 * s, 16), { wash: '#E6B48A', ink: NP.ink, sw: .6 * s });
    paint(P([[-40, -228], [-46, -275], [-22, -255], [0, -290], [22, -255], [46, -275], [40, -228]]), { wash: NP.kingGold, ink: NP.ink, sw: .5 * s });
    for (const sx of [-1, 1]) inkLine([[x + sx * 16 * s, y - 198 * s + b], [x + sx * 16 * s, y - 192 * s + b]], 3 * s, NP.ink, 'ink', 0);
    inkLine(P([[-26, -168], [-10, -176], [10, -176], [26, -168]]), 3 * s, '#3A2418', 'ink', .5);   // a moustache
  }
}
function hallSet(t) {
  boilSeed('hl wall');
  paint(rectPts(-700, -600, 2500, 2200), { wash: NP.hall, fill: NP.hallDk, fillOp: 60, bleed: .2, tex: .5, ink: null });
  for (const x of [-40, 380, 800, 1220]) {
    boilSeed('hl pillar' + x);
    paint(rectPts(x - 50, -200, 100, 1450), { wash: NP.pillar, fill: NP.pillarDk, fillOp: 60, tex: .5, ink: NP.ink, sw: .9 });
    for (const yy of [240, 700]) paint(rrPts(x - 70, yy, 140, 44, 14), { wash: TK.gold, ink: NP.ink, sw: .7 });
  }
  boilSeed('hl swag');
  for (let i = 0; i <= 40; i++) { const k = i / 40, x = lerp(-300, 1500, k), y = 150 + 120 * Math.abs(Math.sin(k * Math.PI * 3)); paint(ellPts(x, y, 15, 14, 9, 1), { wash: i % 4 === 2 ? TK.rkOrange : TK.marigold, ink: NP.ink, sw: .45 }); }
  boilSeed('hl floor');
  paint(rectPts(-700, 1230, 2500, 1400), { wash: NP.floor, fill: '#D8B48A', fillOp: 50, tex: .5, ink: null });
  inkLine([[-700, 1230], [1800, 1230]], 2, '#B8946A', 'ink', 0);
  kingRow(t, 1250, .85, 7, -140, 220, 'hkings');
  boilSeed('hl carpet');
  paint([[200, 1330], [900, 1330], [1300, 2400], [-200, 2400]], { wash: NP.carpet, fill: NP.hallDk, fillOp: 60, tex: .6, ink: NP.ink, sw: .8 });
  inkLine([[230, 1360], [-140, 2400]], 6, NP.carpetGold, 'ink', 0); inkLine([[870, 1360], [1240, 2400]], 6, NP.carpetGold, 'ink', 0);
}
function gardenSet(t) {
  boilSeed('gd sky');
  paint(rectPts(-700, -600, 2500, 1900), { wash: NP.sky, fill: NP.skyDk, fillOp: 50, bleed: .2, tex: .4, ink: null });
  boilSeed('gd palace');   // the palace far behind
  paint([[100, 1050], [100, 760], [200, 700], [300, 760], [300, 1050]], { wash: NP.wall, ink: NP.ink, sw: .6 });
  paint([[160, 700], [200, 600], [240, 700]], { wash: NP.dome, ink: NP.ink, sw: .5, curv: .4 });
  boilSeed('gd lawn');
  paint([[-700, 1100], [1800, 1060], [1800, 2600], [-700, 2600]], { wash: NP.garden, fill: NP.gardenDk, fillOp: 50, tex: .5, ink: null });
  boilSeed('gd trees');
  for (const [x, y, r] of [[-60, 900, 220], [1080, 880, 240], [760, 980, 140]]) { paint(rectPts(x - 22, y, 44, 220), { wash: NP.bark, ink: NP.ink, sw: .6 }); paint(ellPts(x, y - 40, r, r * .8, 20, 5), { wash: NP.bush, fill: NP.bushDk, fillOp: 60, tex: .6, ink: NP.ink, sw: .7 }); }
  boilSeed('gd pond');
  paint(ellPts(560, 1560, 420, 130, 30, 3), { wash: NP.water, fill: NP.waterDk, fillOp: 60, tex: .5, ink: NP.ink, sw: 1 });
  for (let i = 0; i < 3; i++) { const k = frac(t * .4 + i / 3), r = 60 + 300 * k; inkLine(ellPts(600, 1560, r, r * .3, 24), 2, NP.waterLt, 'inkfine', .5); }
  for (const [x, y] of [[300, 1540], [820, 1590], [700, 1500]]) { paint(ellPts(x, y, 40, 14, 12), { wash: NP.lily, ink: NP.ink, sw: .5 }); }
}
// the pond seen from above: water, the sky in it, ripples; draw the reflection between pondWater(…, 'under') and
// pondWater(…, 'over') (the 'over' layer tints it and adds ripples and lily pads)
function pondWater(t, part, ripple = 0) {
  if (part === 'under') {
    boilSeed('pw water');
    paint(rectPts(-700, -600, 2500, 3200), { wash: NP.water, fill: NP.waterDk, fillOp: 50, tex: .5, ink: null });
    for (let i = 0; i < 4; i++) { boilSeed('pw cloud' + i); paint(ellPts(150 + i * 300, 500 + hash(i) * 1100, 200, 90, 18, 4), { wash: NP.waterLt, washOp: 160, ink: null }); }
    return;
  }
  boilSeed('pw tint');
  paint(rectPts(-700, -600, 2500, 3200), { wash: NP.water, washOp: 70, ink: null });
  boilSeed('pw ripples');
  for (let i = 0; i < 4; i++) { const k = frac(t * .5 + i / 4), r = 80 + 700 * k; inkLine(ellPts(540, 980, r, r * .55, 36), 3 + ripple * 4, NP.waterLt, 'inkfine', .5); }
  for (const [x, y, r] of [[120, 1500, 90], [930, 520, 70], [880, 1640, 110], [140, 420, 60]]) { boilSeed('pw lily' + x); paint(ellPts(x, y, r, r * .8, 16), { wash: NP.lily, fill: NP.lilyDk, fillOp: 60, tex: .4, ink: NP.ink, sw: .7 }); }
}
function roadSet(t, maya = 1) {
  boilSeed('rd sky');
  paint(rectPts(-700, -600, 2500, 2200), { wash: NP.dusk, fill: NP.duskDk, fillOp: 60, bleed: .2, tex: .5, ink: null });
  paint(ellPts(560, 1050, 900, 360, 24, 4), { fill: NP.duskPink, fillOp: 150, bleed: .3, tex: .5, border: .6, ink: null });
  if (maya > .01) {   // the illusion's city on the horizon, glowing gold until it goes
    boilSeed('rd maya');
    glow(820, 1020, 320, NP.maya, .45 * maya);
    for (const [x, h] of [[700, 160], [790, 240], [880, 190], [960, 140]]) paint([[x - 40, 1120], [x - 40, 1120 - h], [x, 1120 - h - 60], [x + 40, 1120 - h], [x + 40, 1120]], { wash: NP.maya, washOp: 220 * maya, ink: null, curv: .2 });
  }
  boilSeed('rd hills');
  paint([[-700, 1240], [-300, 1080], [100, 1160], [460, 1060], [820, 1140], [1180, 1050], [1800, 1240], [1800, 1500], [-700, 1500]], { wash: '#4A3C70', fill: '#2E2458', fillOp: 60, tex: .5, ink: null });
  boilSeed('rd ground');
  paint(rectPts(-700, 1360, 2500, 1300), { wash: '#6A8A5E', fill: '#4A6A44', fillOp: 60, tex: .6, ink: null });
  paint([[300, 1360], [760, 1360], [1200, 2400], [-160, 2400]], { wash: NP.path, fill: NP.pathDk, fillOp: 50, tex: .5, ink: null });
}
function goldSet(t) {
  boilSeed('gs sky');
  paint(rectPts(-700, -600, 2500, 3200), { wash: NP.goldSky, fill: '#F0B870', fillOp: 50, bleed: .2, tex: .4, ink: null });
  glow(540, 800, 700, '#FFF0C0', .5);
  boilSeed('gs clouds');
  for (let i = 0; i < 6; i++) { const x = ((hash(i * 4.4) * 1600 + t * 30 * (1 + hash(i))) % 1800) - 300, y = 300 + hash(i * 6.1) * 1500, r = 150 + 90 * hash(i); for (let j = 0; j < 3; j++) paint(ellPts(x + (j - 1) * r * .6, y - (j % 2) * r * .25, r * .6, r * .4, 14, 3), { wash: NP.gold2, washOp: 220, ink: null }); }
}
function peachSet(t) {
  boilSeed('pc');
  paint(rectPts(-200, -200, W + 400, H + 400), { wash: TK.peach, fill: '#F2C9B0', fillOp: 50, bleed: .2, tex: .5, ink: null });
}

// ---------- props ----------
// the tree of pride, in Narada's head space (his hat hook): it sprouts from the topknot. grow 0..1 (sapling → a little
// tree with three leaves and a bud), wilt 0..1 (droops brown), fall (u: drops it off his head, rotating)
function sapling(grow, wilt = 0, fall = 0) {
  return (u, sw) => {
    if (grow <= .01) return;
    const g = easeOut(clamp(grow)), w = clamp(wilt), c = k => mixCol(k, NP.sapWilt, w), P = pts => U(pts, u);
    push(); translate(.4 * u, (-27 + fall * 6) * u); rotate(fall * 1.4 + w * .35); scale(1.7);
    const tip = [0 + w * 1.2, -4.2 * g + w * 1.4];
    inkLine(P([[0, 0], [.25 * g, -2 * g], tip]), sw * (1.4 + 1.6 * g), c(NP.bark), 'ink', .6);
    for (const [k, s, l] of [[.45, -1, 1.6], [.7, 1, 1.9], [.95, -1, 1.4], [1, 1, 1.2]]) {
      const kk = clamp(grow * 1.6 - k * .6); if (kk < .05) continue;
      const bx = lerp(0, tip[0], k), by = lerp(0, tip[1], k);
      push(); translate(bx * u, by * u); rotate(s * (.9 + w * .8)); scale(kk);
      paint(P([[0, 0], [.55 * l, -.45 * l], [1.1 * l, 0], [.55 * l, .35 * l]]), { wash: c(NP.sap), fill: c(NP.sapDk), fillOp: 50, ink: NP.ink, sw: sw * .5, curv: .5 });
      pop();
    }
    pop();
  };
}
function ganaBrahmin(x, y, u, o = {}) {
  const d = clamp(o.demon || 0), dm = d > .5;
  const pal = dm ? { skin: NP.demon, skinDk: NP.demonDk, skinLt: NP.demonLt, hair: '#2A1A1A', dhoti: '#3A2A4A', dhotiDk: '#2A1E36', sash: '#2A2A2A', sashDk: '#1A1A1A', ink: '#2A1414' }
    : { skin: NP.ganaSkin, skinDk: NP.ganaSkinDk, skinLt: '#F8D4AE', hair: '#2A2220', dhoti: NP.ganaDhoti, dhotiDk: NP.ganaDhotiDk, sash: '#F2C230', sashDk: '#B88A1C', ink: '#3A2420' };
  mahishasura(x, y, u, { pal, horns: dm ? 'buffalo' : 'short', hair: dm ? 'mane' : 'topknot', stache: dm ? 'curl' : 'none', ring: false, tusks: dm, sword: false, shield: false, ...o, demon: undefined });
}
function palmClose(x, y, s, lines = 0, t = 0) {
  const P = pts => pts.map(([a, b]) => [x + a * s, y + b * s]);
  boilSeed('palm');
  paint(P([[-150, 120], [-170, -20], [-150, -120], [-120, -160], [-60, -170], [0, -175], [60, -170], [120, -150], [160, -60], [170, 60], [140, 140], [0, 170]]), { wash: NP.palm, fill: NP.palmDk, fillOp: 40, tex: .4, ink: NP.ink, sw: 1.2 * s, curv: .4 });
  for (const [fx, fl] of [[-110, 150], [-45, 190], [20, 195], [85, 160]]) paint(rrPts(x + (fx - 28) * s, y + (-170 - fl) * s, 56 * s, (fl + 30) * s, 28 * s), { wash: NP.palm, fill: NP.palmDk, fillOp: 40, tex: .4, ink: NP.ink, sw: 1.1 * s });
  paint(P([[140, 40], [230, -40], [270, -10], [190, 100]]), { wash: NP.palm, ink: NP.ink, sw: 1.1 * s, curv: .5 });   // the thumb
  const L = [[[-150, -60], [-40, -90], [90, -70], [150, -110]], [[-150, 0], [-40, -10], [60, 30], [130, 60]], [[60, -150], [20, -40], [-10, 60], [-40, 150]]];
  boilSeed('palm lines');
  const k = clamp(lines);
  for (let i = 0; i < L.length; i++) {
    inkLine(P(L[i]), 4 * s, NP.palmLine, 'ink', .6);
    const kk = clamp(k * 3 - i); if (kk <= 0) continue;
    const pts = through(P(L[i])), n = Math.max(2, Math.round(pts.length * kk));
    for (let j = 0; j < n; j += 2) glow(pts[j][0], pts[j][1], 50 * s, '#FFE08A', .35);
    inkLine(pts.slice(0, n), 6 * s, '#FFD45A', 'ink', 0);
  }
  if (k > .9) sparkleBurst(x + 20 * s, y - 20 * s, 90 * s, (t % 1.2), 'palmspark', 7);
}

// ---------- the end card (the 15K Family Deal, as ad 21) ----------
function narCard(t, C) {
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
  if (t > C.follow) letter('Follow @therishikatha for more stories', X, 1478, 31, TK.grey, { screen: true, font: '700 31px Poppins', ink: false, maxW: 860, pop: pk(C.follow) });
}
function narStrike(t, C) {
  if (t < C.strike) return;
  const k = easeOut(seg(t, C.strike, C.strike + .25));
  boilSeed('strike');
  inkLine([[470 - 185, 1196], [lerp(470 - 185, 470 - 55, k), lerp(1196, 1172, k)]], 6, TK.rkOrange, 'ink', 0);
}
