// panch_props.js: the sets and props for "HANUMAN JI has 5 FACES" (src/scenes/panch.js), ad 55, Panchmukhi Hanuman.
// Loaded before it; everything here is a pure function of its arguments (and T for boil).
//
//   PC, TK                                  the palettes (TK: the brand card colours, as in ad 51)
//   sparkleBurst, veil, diya                copied from ad 51
//   halo(t, o)                              the saffron halo: rays, a ring of petals (the hook, the slate, the ask)
//   camp(t, o)                              the war camp at night (o.dawn 0..1 turns it to dawn): sky, stars, the moon,
//                                           far hills with the army's tents, the grass; the hut is hut()
//   hut(x, y, s, t, o)                      a thatched parnakuti, open at the front; o.inside(x0, y0) paints the inside
//   portal(x, y, r, k, t, key)              Ahiravana's purple swirl on the ground (k 0..1 size); k < 0: a smoking hole
//   bubble(x, y, r, t, key)                 a violet magic bubble (draw what's in it first)
//   strata(y0, y1, t)                       the earth on the way down: soil, roots, rocks, a sleepy worm, crystals
//   gate(t, o)                              the gate of Patala: a cave, a carved arch, green-flame torches
//   hall(t, o)                              the hall of the five lamps: back wall, pillars, the altar, o.dark
//   lamp(x, y, s, lit, t, key, o)           a brass lamp on a stand (o.hang: hanging on chains; o.niche: in a wall
//                                           niche); lit 0..1; out > 0: a curl of smoke
//   ropes(x, y, u, key)                     rope coils round a sitting narada-rig figure's chest
//   fightCloud(x, y, r, t, key)             the cartoon fight cloud: dust lobes, stars, a tail and a fin poking out
//   thought(x, y, w, h, k, t)               a thought cloud with the sweat-drop story inside (k 0..1 its time)
//   pcCard(t, C)                            the end card: Books 1–3, set of 3 for ₹500
const PC = {
  ink: '#22203A', sky: '#17204A', skyLt: '#26346E', skyLow: '#33427E', star: '#FFF4D8', moon: '#F6F1DE',
  dawnSky: '#F4A97A', dawnLt: '#FFD9A0', dawnLow: '#F7C8A0', sun: '#FFE7A0',
  hill: '#22305A', hillDk: '#1A2448', grass: '#2E4A3A', grassDk: '#22382C', grassLt: '#4A6A50',
  dawnHill: '#B87A78', dawnGrass: '#7A9A60', dawnGrassDk: '#5E7E4A',
  thatch: '#C99A4A', thatchDk: '#9A7030', thatchLt: '#E8C070', bamboo: '#B88A4A', bambooDk: '#86602E', hutIn: '#2A1A22', hutInLt: '#4A2E30',
  fire: '#FF9A3A', fireIn: '#FFE08A',
  vio: '#7A3EC8', vioDk: '#4A2280', vioLt: '#B48AF0', vioGlow: '#C9A0FF',
  soil: '#7A5236', soilDk: '#5A3A24', rock: '#8A8070', rockDk: '#5E574C', rockLt: '#B0A794', root: '#5A3A22', deep: '#3A2A3E', deepDk: '#241A2C',
  crystal: '#9C7CF0', crystalLt: '#D6C6FF', worm: '#F2A0A8',
  cave: '#1E1A36', caveLt: '#2C2850', caveDk: '#141228', stone: '#5A6478', stoneDk: '#3E4658', stoneLt: '#7E8AA0', moss: '#3E7A6A',
  green: '#7CF0A8', greenIn: '#E2FFE8',
  wall: '#3A2A5A', wallDk: '#281C44', wallLt: '#4E3A74', floor: '#2C2244', floorLt: '#3E3060', pillar: '#5A4A7E', pillarDk: '#40345E', pillarLt: '#7A68A0',
  brass: '#D9A441', brassDk: '#A8741E', brassLt: '#F2CD72', flame: '#FFD45A', flameIn: '#FFF4C8', flameOut: '#FF8A2A',
  rope: '#C9A46A', ropeDk: '#8E6E3E', smoke: '#B9B0C8',
  saffron: '#F7B85A', saffronLt: '#FFDCA0', saffronDk: '#E8923A', petal: '#F48A3A', petalLt: '#FFC27A', cream: '#FFF5E2',
  sea: '#4AA0D0', seaLt: '#8ACCF0', fish: '#F29A4A', fishDk: '#C46E28', drop: '#BFE8FF',
  dust: '#C8B49A', dustDk: '#9A8670', clay: '#B85A32', clayDk: '#86391E',
};
const TK = {
  ink: '#2B2233', cream: '#FFF5E2', marigold: '#F39A2E', petal: '#F4A6B8', gold: '#EDB43C', goldLt: '#FFE39A',
  rkOrange: '#F15A24', peach: '#FBE0CF', brown: '#3A2418', grey: '#6B5A50', teal: '#2E5F5A',
};

// ---------- copied from ad 51 ----------
function sparkleBurst(x, y, s, age, key = 'burst', n = 8, cols = [TK.cream, TK.goldLt]) {
  if (age < 0 || age > .8) return;
  const k = age / .8; boilSeed(key);
  glow(x, y, s * (1 + k), cols[1], .6 * (1 - k));
  for (let i = 0; i < n; i++) { const a = i / n * TAU + hash(i) * .5, d = s * (.3 + 1.1 * easeOut(k)) * (.7 + .5 * hash(i * 2.1)); paint(starPts(x + Math.cos(a) * d, y + Math.sin(a) * d - k * s * .2, s * .22 * (1 - k * .8) * (.6 + hash(i * 5)), .3, 4), { wash: cols[i % 2], ink: null }); }
}
function veil(col, a) {
  if (a <= .004) return;
  flushBrush(); const c = color(col);
  push(); resetMatrix(); translate(-W / 2, -H / 2); noStroke(); fill(red(c), green(c), blue(c), 255 * clamp(a)); rect(-4, -4, W + 8, H + 8); pop();
}
function diya(x, y, s, lit, key) {
  boilSeed('diya ' + key);
  const fl = Math.min(lit, 1);
  if (lit > .02) glow(x + s * .55, y - s * 1.1, s * 3.2, PC.flameOut, .5 * fl);
  paint([[x - s, y - s * .55], [x + s * .7, y - s * .55], [x + s * 1.25, y - s * .8], [x + s * .9, y - s * .3], [x + s * .5, y], [x - s * .6, y], [x - s * .95, y - s * .25]], { wash: PC.clay, fill: PC.clayDk, fillOp: 60, tex: .4, ink: PC.ink, sw: clamp(s / 14, .5, 1.6), curv: .4 });
  paint(ellPts(x - s * .1, y - s * .55, s * .85, s * .16, 10), { wash: PC.clayDk, ink: null });
  if (lit > .02) {
    const fx = x + s * .95, fy = y - s * .8, h = s * (1.2 + .25 * Math.sin(T * 17 + x)) * fl, w = s * .42;
    paint([[fx - w, fy], [fx - w * .7, fy - h * .5], [fx + Math.sin(T * 11 + x) * w * .3, fy - h], [fx + w * .7, fy - h * .5], [fx + w, fy], [fx, fy + w * .4]], { wash: PC.flame, ink: null, curv: .6 });
    paint(ellPts(fx, fy - h * .3, w * .4, h * .3, 8), { wash: PC.flameIn, ink: null });
  }
}

// ---------- the saffron halo ----------
// o.cx, o.cy: the halo's centre; o.rect world rect; o.spin
function halo(t, o = {}) {
  const [x0, y0, w, h] = o.rect || [-200, -200, 1480, 2320], cx = o.cx ?? 540, cy = o.cy ?? 900;
  boilSeed('halo bg');
  paint(rectPts(x0, y0, w, h), { wash: PC.saffron, ink: null });
  paint(ellPts(cx, cy, 760, 760, 40), { fill: PC.saffronLt, fillOp: 150, bleed: .3, tex: .3, ink: null });
  glow(cx, cy, 700, '#FFE9B8', .35);
  boilSeed('halo rays');
  const sp = (o.spin ?? 1) * t * .05;
  for (let i = 0; i < 24; i++) {
    const a = i / 24 * TAU + sp, r0 = 520, r1 = 1300;
    paint([[cx + Math.cos(a - .035) * r0, cy + Math.sin(a - .035) * r0], [cx + Math.cos(a - .05) * r1, cy + Math.sin(a - .05) * r1], [cx + Math.cos(a + .05) * r1, cy + Math.sin(a + .05) * r1], [cx + Math.cos(a + .035) * r0, cy + Math.sin(a + .035) * r0]], { fill: PC.saffronLt, fillOp: 90, bleed: .1, tex: .2, ink: null });
  }
  boilSeed('halo petals');   // a ring of lotus petals
  for (let i = 0; i < 16; i++) {
    const a = i / 16 * TAU - sp * .5, r = 470, px = cx + Math.cos(a) * r, py = cy + Math.sin(a) * r;
    push(); translate(px, py); rotate(a + Math.PI / 2);
    paint([[0, 26], [-26, -6], [0, -52], [26, -6]], { wash: i % 2 ? PC.petal : PC.petalLt, ink: PC.saffronDk, sw: 1, curv: .5 });
    pop();
  }
  inkLine(ellPts(cx, cy, 430, 430, 60), 3, PC.saffronDk, 'ink', .5);
}

// ---------- the war camp ----------
function camp(t, o = {}) {
  const d = clamp(o.dawn || 0), mc = (a, b) => mixCol(a, b, d), gy = o.gy ?? 1380;
  boilSeed('camp sky');
  paint(rectPts(-300, -400, 1680, gy + 500), { wash: mc(PC.sky, PC.dawnSky), ink: null });
  paint(rectPts(-300, gy - 700, 1680, 700), { fill: mc(PC.skyLow, PC.dawnLow), fillOp: 140, bleed: .25, tex: .3, ink: null });
  if (d > .05) { boilSeed('camp sun'); glow(820, gy - 260, 520, PC.sun, .5 * d); paint(ellPts(820, gy - 200, 120, 120, 24), { wash: mixCol(PC.dawnLow, PC.sun, d), washOp: 255 * d, ink: null }); }
  if (d < .95) {
    boilSeed('camp stars');
    for (let i = 0; i < 36; i++) {
      const x = -100 + hash(i * 3.7) * 1280, y = -200 + hash(i * 5.1) * (gy - 500), tw = .55 + .45 * Math.sin(t * (1.5 + hash(i) * 2) + i);
      paint(starPts(x, y, (3 + 4 * hash(i * 9.3)) * tw * (1 - d), .4, 4), { wash: PC.star, washOp: 255 * (1 - d), ink: null });
    }
    boilSeed('camp moon');   // a crescent
    glow(230, 330, 180, '#BFD0FF', .3 * (1 - d));
    paint(ellPts(230, 330, 70, 70, 24), { wash: PC.moon, washOp: 255 * (1 - d), ink: null });
    paint(ellPts(262, 312, 62, 62, 24), { wash: mc(PC.sky, PC.dawnSky), ink: null });
  }
  boilSeed('camp hills');   // far hills with the army's tents and banners
  paint([[-300, gy], [-300, gy - 170], [60, gy - 250], [380, gy - 190], [700, gy - 280], [1000, gy - 200], [1380, gy - 260], [1380, gy]], { wash: mc(PC.hill, PC.dawnHill), ink: null, curv: .4 });
  for (let i = 0; i < 7; i++) {
    const x = -60 + i * 190 + hash(i) * 60, y = gy - 150 - hash(i * 2) * 50, s = 26 + hash(i * 3) * 10;
    paint([[x - s, y + s * .6], [x, y - s * .6], [x + s, y + s * .6]], { wash: mc(PC.hillDk, '#9A5E5E'), ink: null });
    inkLine([[x, y - s * .6], [x, y - s * 1.5]], 2, mc(PC.hillDk, '#9A5E5E'), 'ink', 0);
    paint([[x, y - s * 1.5], [x + s * .7 + Math.sin(t * 4 + i) * 4, y - s * 1.3], [x, y - s * 1.1]], { wash: mc('#8A4A3A', '#E26A3A'), ink: null });
  }
  boilSeed('camp grass');
  paint(rectPts(-300, gy - 20, 1680, 900), { wash: mc(PC.grass, PC.dawnGrass), ink: null });
  paint(rectPts(-300, gy + 160, 1680, 700), { fill: mc(PC.grassDk, PC.dawnGrassDk), fillOp: 120, bleed: .2, tex: .4, ink: null });
  inkLine([[-300, gy - 20], [1380, gy - 20]], 1.5, mc(PC.grassDk, PC.dawnGrassDk), 'ink', 0);
  for (let i = 0; i < 26; i++) {
    const x = -80 + hash(i * 7.1) * 1240, y = gy + 40 + hash(i * 2.3) * 480, s = 12 + hash(i) * 10, sw = Math.sin(t * 2 + i) * 3;
    inkLine([[x - s * .5, y], [x - s * .3 + sw, y - s]], 1.6, mc(PC.grassLt, '#9ABA70'), 'ink', .3);
    inkLine([[x, y], [x + sw, y - s * 1.3]], 1.6, mc(PC.grassLt, '#9ABA70'), 'ink', .3);
    inkLine([[x + s * .5, y], [x + s * .3 + sw, y - s]], 1.6, mc(PC.grassLt, '#9ABA70'), 'ink', .3);
  }
}
// a thatched hut, open at the front; (x, y) the middle of its floor line; s its half-width
function hut(x, y, s, t, o = {}) {
  const d = clamp(o.dawn || 0);
  boilSeed('hut walls');
  const H = s * 1.05;
  paint(rectPts(x - s, y - H, s * 2, H), { wash: PC.bamboo, fill: PC.bambooDk, fillOp: 60, tex: .5, ink: PC.ink, sw: 1.4 });
  for (let i = 1; i < 9; i++) inkLine([[x - s + i * s / 4.5, y - H], [x - s + i * s / 4.5, y]], 1, PC.bambooDk, 'inkfine', 0);
  // the open front
  const dw = s * .78, dh = H * .88;
  paint([[x - dw, y], [x - dw, y - dh * .75], [x - dw * .6, y - dh], [x + dw * .6, y - dh], [x + dw, y - dh * .75], [x + dw, y]], { wash: mixCol(PC.hutIn, '#6A4A40', d * .6), ink: PC.ink, sw: 1.4, curv: .3 });
  paint(ellPts(x, y - dh * .3, dw * .8, dh * .4, 16), { fill: mixCol(PC.hutInLt, '#8A6A58', d * .6), fillOp: 120, bleed: .2, tex: .3, ink: null });
  if (o.inside) { flushBrush(); o.inside(x, y); }
  boilSeed('hut roof');
  paint([[x - s * 1.35, y - H + 10], [x, y - H - s * 1.05], [x + s * 1.35, y - H + 10], [x + s * 1.15, y - H + 34], [x - s * 1.15, y - H + 34]], { wash: PC.thatch, fill: PC.thatchDk, fillOp: 60, tex: .6, ink: PC.ink, sw: 1.5, curv: .1 });
  for (let i = 0; i < 12; i++) { const k = (i + .5) / 12, xx = lerp(x - s * 1.25, x + s * 1.25, k); inkLine([[xx, y - H + 24], [lerp(xx, x, .45), lerp(y - H + 24, y - H - s * 1.0, .45)]], 1, PC.thatchLt, 'inkfine', .2); }
  inkLine([[x - s * 1.3, y - H + 26], [x + s * 1.3, y - H + 26]], 2, PC.thatchDk, 'ink', .2);
}
// the purple swirl on the ground; k 0..1 (opens); k < 0: closed, a smoking hole
function portal(x, y, r, k, t, key = 'portal') {
  boilSeed('portal ' + key);
  if (k < 0) {
    paint(ellPts(x, y, r * .45, r * .14, 18), { wash: '#1A1222', ink: PC.ink, sw: 1.2 });
    for (let i = 0; i < 3; i++) {
      const a = frac(t * .6 + i / 3), yy = y - a * 150, xx = x + Math.sin(a * 6 + i) * 20;
      paint(ellPts(xx, yy, 14 + a * 20, 10 + a * 14, 10), { fill: PC.vioLt, fillOp: 120 * (1 - a), bleed: .2, tex: .2, ink: null });
    }
    return;
  }
  if (k <= .01) return;
  glow(x, y - 20, r * 2.2 * k, PC.vioGlow, .55 * k);
  paint(ellPts(x, y, r * k, r * .3 * k, 28), { wash: PC.vioDk, ink: PC.ink, sw: 1.4 });
  for (let j = 0; j < 3; j++) {   // spiral arms
    const P = [];
    for (let i = 0; i <= 18; i++) { const q = i / 18, a = q * 4 + j * TAU / 3 + t * 5, rr = r * k * (1 - q * .9); P.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr * .3]); }
    inkLine(P, 3, PC.vioLt, 'ink', .6);
  }
  paint(ellPts(x, y, r * .25 * k, r * .08 * k, 12), { wash: '#120A1E', ink: null });
}
// a violet bubble round whatever was drawn at (x, y)
function bubble(x, y, r, t, key = 'bubble') {
  boilSeed('bubble ' + key);
  const w = 1 + .03 * Math.sin(t * 5);
  paint(ellPts(x, y, r * w, r / w, 30), { wash: PC.vioLt, washOp: 70, ink: PC.vioDk, sw: 2.2 });
  paint(ellPts(x - r * .38, y - r * .45, r * .26, r * .12, 12, 0, -.6), { wash: '#FFFFFF', washOp: 160, ink: null });
  paint(ellPts(x + r * .5, y + r * .4, r * .08, r * .05, 8, 0, -.6), { wash: '#FFFFFF', washOp: 120, ink: null });
  for (let i = 0; i < 5; i++) { const a = t * 2 + i * 1.3, rr = r * 1.08; paint(starPts(x + Math.cos(a) * rr, y + Math.sin(a) * rr, 8, .35, 4), { wash: PC.vioLt, ink: null }); }
}

// ---------- down through the earth (world y0..y1, x 0..1080) ----------
function strata(y0, y1, t) {
  const L = [[PC.soil, PC.soilDk], [PC.rock, PC.rockDk], [PC.soilDk, PC.deep], [PC.deep, PC.deepDk]], n = L.length, hh = (y1 - y0) / n;
  for (let i = 0; i < n; i++) {
    boilSeed('strata ' + i);
    const top = y0 + i * hh;
    paint(rectPts(-200, top - 10, 1480, hh + 20), { wash: L[i][0], fill: L[i][1], fillOp: 70, tex: .6, ink: null });
    inkLine(Array.from({ length: 9 }, (_, j) => [-200 + j * 185, top + Math.sin(j * 1.7 + i) * 16]), 2, L[i][1], 'ink', .5);
  }
  boilSeed('strata roots');
  for (let i = 0; i < 6; i++) { const x = 80 + i * 190, P = []; for (let j = 0; j < 6; j++) P.push([x + Math.sin(j * 1.3 + i) * 30, y0 + j * 70]); inkLine(P, 3, PC.root, 'ink', .6); }
  boilSeed('strata rocks');
  for (let i = 0; i < 14; i++) {
    const x = hash(i * 3.3) * 1080, y = y0 + hh * .6 + hash(i * 7.7) * hh * 2, r = 20 + hash(i) * 40;
    paint(ellPts(x, y, r, r * .7, 12, 3), { wash: PC.rockLt, fill: PC.rockDk, fillOp: 70, tex: .4, ink: PC.ink, sw: 1.2 });
  }
  boilSeed('strata worm');   // a sleepy worm in its tunnel
  const wx = 830, wy = y0 + hh * .45;
  paint(ellPts(wx, wy, 90, 34, 18), { wash: PC.soilDk, ink: null });
  paint(ribbon([[wx - 60, wy + 6], [wx - 20, wy - 8 + Math.sin(t * 3) * 3], [wx + 20, wy + 4], [wx + 55, wy - 6]], 18, 14), { wash: PC.worm, ink: PC.ink, sw: 1.2, curv: .5 });
  inkLine([[wx + 46, wy - 8], [wx + 54, wy - 6]], 1.5, PC.ink, 'ink', 0);
  boilSeed('strata crystals');
  for (let i = 0; i < 9; i++) {
    const x = 60 + hash(i * 5.1) * 960, y = y0 + hh * 2.6 + hash(i * 2.9) * hh * 1.2, s = 22 + hash(i) * 26;
    glow(x, y - s, s * 2.5, PC.vioGlow, .35);
    paint([[x - s * .5, y], [x - s * .35, y - s * 1.6], [x, y - s * 2.2], [x + s * .35, y - s * 1.6], [x + s * .5, y]], { wash: PC.crystal, fill: PC.crystalLt, fillOp: 90, tex: .3, ink: PC.ink, sw: 1.1 });
  }
}

// ---------- the gate of Patala ----------
function gate(t, o = {}) {
  const gy = o.gy ?? 1500;
  boilSeed('gate cave');
  paint(rectPts(-300, -400, 1680, 2800), { wash: PC.cave, ink: null });
  paint(ellPts(540, 900, 900, 700, 30), { fill: PC.caveLt, fillOp: 120, bleed: .3, tex: .3, ink: null });
  for (let i = 0; i < 9; i++) {   // stalactites
    const x = -40 + i * 145 + hash(i) * 40, h = 90 + hash(i * 3) * 120;
    paint([[x - 34, 250], [x, 250 + h], [x + 34, 250]], { wash: PC.caveDk, ink: null, curv: .2 });
  }
  boilSeed('gate arch');
  const ax = 540, aw = 330, top = 640;
  paint([[ax - aw - 90, gy], [ax - aw - 90, top + 120], [ax - aw + 20, top - 30], [ax, top - 120], [ax + aw - 20, top - 30], [ax + aw + 90, top + 120], [ax + aw + 90, gy]], { wash: PC.stone, fill: PC.stoneDk, fillOp: 70, tex: .6, ink: PC.ink, sw: 2, curv: .25 });
  paint([[ax - aw + 30, gy], [ax - aw + 30, top + 200], [ax - aw * .5, top + 70], [ax, top + 30], [ax + aw * .5, top + 70], [ax + aw - 30, top + 200], [ax + aw - 30, gy]], { wash: '#0C0A18', ink: PC.ink, sw: 2, curv: .35 });
  glow(ax, gy - 260, 260, PC.vioGlow, .25);
  for (let i = 0; i < 7; i++) { const a = -Math.PI + (i + .5) / 7 * Math.PI, r = aw + 40; paint(rrPts(ax + Math.cos(a) * r - 26, top + 220 + Math.sin(a) * (r * .9) - 18, 52, 36, 8), { wash: PC.stoneLt, ink: PC.ink, sw: 1 }); }
  for (const s of [-1, 1]) inkLine([[ax + s * (aw + 60), gy - 40], [ax + s * (aw + 40), top + 260]], 4, PC.moss, 'ink', .4);
  // green-flame torches either side
  for (const s of [-1, 1]) {
    const tx = ax + s * (aw + 150), ty = gy - 420;
    boilSeed('torch ' + s);
    paint(rectPts(tx - 12, ty, 24, 150), { wash: PC.stoneDk, ink: PC.ink, sw: 1.2 });
    paint([[tx - 40, ty], [tx + 40, ty], [tx + 26, ty + 30], [tx - 26, ty + 30]], { wash: PC.brass, ink: PC.ink, sw: 1.2 });
    glow(tx, ty - 50, 220, PC.green, .5);
    const h = 90 + 14 * Math.sin(t * 13 + s);
    paint([[tx - 30, ty], [tx - 22, ty - h * .5], [tx + Math.sin(t * 9 + s) * 10, ty - h], [tx + 22, ty - h * .5], [tx + 30, ty]], { wash: PC.green, ink: null, curv: .6 });
    paint(ellPts(tx, ty - h * .3, 12, h * .25, 8), { wash: PC.greenIn, ink: null });
  }
  boilSeed('gate floor');
  paint(rectPts(-300, gy - 10, 1680, 900), { wash: PC.caveDk, fill: PC.caveLt, fillOp: 60, tex: .5, ink: null });
  inkLine([[-300, gy - 10], [1380, gy - 10]], 2, PC.ink, 'ink', 0);
}

// ---------- the hall of the five lamps ----------
function hall(t, o = {}) {
  const gy = o.gy ?? 1560;
  boilSeed('hall wall');
  paint(rectPts(-300, -400, 1680, gy + 420), { wash: PC.wall, ink: null });
  paint(ellPts(540, 950, 700, 600, 30), { fill: PC.wallLt, fillOp: 90, bleed: .3, tex: .3, ink: null });
  for (let r = 0; r < 9; r++) inkLine([[-300, 380 + r * 130], [1380, 380 + r * 130]], 1, PC.wallDk, 'inkfine', 0);
  for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) inkLine([[(c + (r % 2) * .5) * 160 - 160, 380 + r * 130], [(c + (r % 2) * .5) * 160 - 160, 510 + r * 130]], 1, PC.wallDk, 'inkfine', 0);
  boilSeed('hall altar');   // the altar at the back
  paint(rectPts(330, gy - 300, 420, 120), { wash: PC.pillar, fill: PC.pillarDk, fillOp: 70, tex: .5, ink: PC.ink, sw: 1.6 });
  paint(rectPts(300, gy - 320, 480, 30), { wash: PC.pillarLt, ink: PC.ink, sw: 1.4 });
  for (let i = 0; i < 6; i++) paint(ellPts(370 + i * 68, gy - 240, 14, 14, 10), { wash: '#C0405A', ink: PC.ink, sw: .8 });
  boilSeed('hall pillars');
  for (const px of o.pillars || [60, 1020]) {
    paint(rectPts(px - 60, 200, 120, gy - 200), { wash: PC.pillar, fill: PC.pillarDk, fillOp: 70, tex: .5, ink: PC.ink, sw: 1.8 });
    paint(rectPts(px - 80, 180, 160, 50), { wash: PC.pillarLt, ink: PC.ink, sw: 1.4 });
    paint(rectPts(px - 80, gy - 60, 160, 60), { wash: PC.pillarLt, ink: PC.ink, sw: 1.4 });
    for (let k = 0; k < 4; k++) inkLine([[px - 60 + k * 40, 240], [px - 60 + k * 40, gy - 70]], 1, PC.pillarDk, 'inkfine', 0);
  }
  boilSeed('hall floor');
  paint(rectPts(-300, gy - 10, 1680, 900), { wash: PC.floor, ink: null });
  for (let i = 0; i < 12; i++) inkLine([[540 + (i - 6) * 70, gy - 10], [540 + (i - 6) * 260, gy + 700]], 1, PC.floorLt, 'inkfine', 0);
  inkLine([[-300, gy - 10], [1380, gy - 10]], 2, PC.ink, 'ink', 0);
}
// a brass lamp: (x, y) the base; s its scale; lit 0..1; o.out (s since it went out: smoke); o.hang (a hanging lamp,
// (x, y) the bowl); o.niche (a wall niche behind it)
function lamp(x, y, s, lit, t, key, o = {}) {
  boilSeed('lamp ' + key);
  const sw = clamp(s / 30, .6, 2);
  if (o.niche) { paint([[x - 70 * s / 40, y + 10], [x - 70 * s / 40, y - 110 * s / 40], [x, y - 160 * s / 40], [x + 70 * s / 40, y - 110 * s / 40], [x + 70 * s / 40, y + 10]], { wash: PC.wallDk, ink: PC.ink, sw, curv: .3 }); }
  let by = y;
  if (o.hang) {
    for (const d of [-1, 0, 1]) inkLine([[x + d * s * .9, y - s * .3], [x, y - s * 4.5 - (o.chain || 400)]], sw * 1.2, PC.brassDk, 'ink', 0);
  } else {
    paint([[x - s * .55, y], [x + s * .55, y], [x + s * .2, y - s * .4], [x + s * .14, y - s * 1.8], [x - s * .14, y - s * 1.8], [x - s * .2, y - s * .4]], { wash: PC.brass, fill: PC.brassDk, fillOp: 50, tex: .4, ink: PC.ink, sw });
    by = y - s * 1.8;
  }
  const fl = clamp(lit);
  if (fl > .02) glow(x, by - s * 1.1, s * 5.5 * (o.big || 1), PC.flameOut, .6 * fl);
  paint([[x - s * .95, by - s * .35], [x + s * .95, by - s * .35], [x + s * .6, by + s * .15], [x - s * .6, by + s * .15]], { wash: PC.brass, fill: PC.brassDk, fillOp: 50, tex: .4, ink: PC.ink, sw, curv: .4 });
  if (fl > .02) {
    const h = s * (1.35 + .25 * Math.sin(T * 17 + x)) * fl, w = s * .42, fy = by - s * .35;
    paint([[x - w, fy], [x - w * .7, fy - h * .5], [x + Math.sin(T * 11 + x) * w * .3, fy - h], [x + w * .7, fy - h * .5], [x + w, fy], [x, fy + w * .4]], { wash: PC.flame, ink: null, curv: .6 });
    paint(ellPts(x, fy - h * .3, w * .4, h * .3, 8), { wash: PC.flameIn, ink: null });
  }
  if (o.out != null && o.out > 0 && o.out < 2.5) {   // a curl of smoke
    const a = o.out / 2.5;
    for (let i = 0; i < 3; i++) { const q = clamp(a * 1.4 - i * .15); if (q <= 0) continue; paint(ellPts(x + Math.sin(q * 6 + i) * s * .5, by - s * .6 - q * s * 4, s * (.25 + q * .4), s * (.2 + q * .3), 10), { fill: PC.smoke, fillOp: 150 * (1 - a), bleed: .2, tex: .2, ink: null }); }
  }
}
// rope coils round a sitting narada-rig figure (x, y as passed to it, u its unit)
function ropes(x, y, u, key) {
  boilSeed('ropes ' + key);
  for (let i = 0; i < 3; i++) {
    const yy = y - (13.4 - 8.6 + i * 1.15) * u;   // the chest, in sit pose
    paint(ribbon([[x - 3.6 * u, yy + .3 * u], [x, yy + .7 * u], [x + 3.6 * u, yy + .3 * u]], .55 * u, .55 * u), { wash: PC.rope, fill: PC.ropeDk, fillOp: 50, tex: .4, ink: PC.ink, sw: clamp(u / 20, .4, 2) * .7, curv: .4 });
  }
}
// the cartoon fight cloud
function fightCloud(x, y, r, t, key = 'fight') {
  boilSeed('fight ' + key + ' ' + Math.floor(t * 12));
  for (let i = 0; i < 9; i++) { const a = i / 9 * TAU + t * 3, rr = r * (.55 + .2 * Math.sin(t * 20 + i)); paint(ellPts(x + Math.cos(a) * rr, y + Math.sin(a) * rr * .8, r * .55, r * .48, 14, 4), { wash: PC.dust, fill: PC.dustDk, fillOp: 60, tex: .4, ink: PC.ink, sw: 1.6 }); }
  paint(ellPts(x, y, r * .8, r * .7, 18, 4), { wash: PC.dust, ink: null });
  const pokes = [['tail', .3], ['fin', 2.2], ['hand', 4.0], ['foot', 5.3]];
  for (const [k, a0] of pokes) {
    const a = a0 + Math.sin(t * 9 + a0) * .5, px = x + Math.cos(a) * r * 1.05, py = y + Math.sin(a) * r * .9;
    push(); translate(px, py); rotate(a);
    if (k === 'tail') paint(ribbon([[0, 0], [r * .25, -r * .1], [r * .38, r * .05]], r * .1, r * .06), { wash: PMK.monkey, ink: PC.ink, sw: 1.4 });
    else if (k === 'fin') paint([[0, 0], [r * .3, -r * .18], [r * .22, 0], [r * .3, r * .18]], { wash: '#F2A340', ink: PC.ink, sw: 1.4 });
    else paint(ellPts(r * .15, 0, r * .14, r * .11, 10), { wash: k === 'hand' ? PMK.monkey : '#D4893A', ink: PC.ink, sw: 1.4 });
    pop();
  }
  for (let i = 0; i < 4; i++) { const a = t * 7 + i * 1.6; paint(starPts(x + Math.cos(a) * r * 1.2, y + Math.sin(a) * r, 22, .4, 5, a), { wash: '#FFE27A', ink: PC.ink, sw: 1 }); }
}
// a thought cloud with the story of the sweat drop; k 0..1 its own time
function thought(x, y, w, h, k, t) {
  if (k <= 0) return;
  const g = backOut(clamp(k * 5)), sw = 2;
  boilSeed('thought cloud');
  push(); translate(x, y); scale(g);
  for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; paint(ellPts(Math.cos(a) * w * .45, Math.sin(a) * h * .42, w * .2, h * .2, 14), { wash: '#FFFDF6', ink: PC.ink, sw }); }
  paint(ellPts(0, 0, w * .48, h * .45, 30), { wash: '#FFFDF6', ink: null });
  // the sea
  paint([[-w * .42, h * .05], [-w * .2, -h * .02], [0, h * .05], [w * .2, -h * .02], [w * .42, h * .05], [w * .38, h * .3], [-w * .38, h * .3]], { wash: PC.sea, fill: PC.seaLt, fillOp: 70, tex: .3, ink: PC.ink, sw: sw * .7, curv: .5 });
  // little Hanuman in the sea, mopping his brow; the drop falls; the fish gulps
  const hx = -w * .18, hy = -h * .02;
  pmHead('hanuman', hx, hy - h * .08, w * .045, { eyes: k < .5 ? 'happy' : 'normal', mouth: 'smile', boilKey: 'thought hn', lookX: k > .5 ? 1 : 0 });
  const dk = clamp((k - .2) / .35), dx = lerp(hx + w * .06, w * .12, dk), dy = lerp(hy - h * .08, h * .12, dk * dk);
  if (k < .62) { boilSeed('thought drop'); paint([[dx, dy - 14], [dx + 8, dy], [dx, dy + 8], [dx - 8, dy]], { wash: PC.drop, ink: PC.ink, sw: 1.2, curv: .6 }); }
  const fk = clamp((k - .45) / .2), gulp = k > .58 && k < .75;
  boilSeed('thought fish');
  push(); translate(w * .17, h * .17 - fk * h * .1); rotate(-.3 * fk);
  paint(ellPts(0, 0, w * .1, h * .06, 16), { wash: PC.fish, fill: PC.fishDk, fillOp: 50, ink: PC.ink, sw: 1.4 });
  paint([[w * .08, 0], [w * .16, -h * .05], [w * .16, h * .05]], { wash: PC.fishDk, ink: PC.ink, sw: 1.2 });
  paint(ellPts(-w * .05, -h * .015, 5, 5, 8), { wash: PC.ink, ink: null });
  paint(ellPts(-w * .095, h * .005, gulp ? 9 : 4, gulp ? 9 : 3, 8), { wash: PMK.mouth, ink: null });
  pop();
  if (k > .7) sparkleBurst(w * .17, h * .05, 40, (k - .7) * 3, 'thought heart', 6, ['#FFC0D0', '#FFE39A']);
  pop();
}

// ---------- the card ----------
function pcCard(t, C) {
  boilSeed('cardbg');
  paint(rectPts(-60, -60, W + 120, H + 120), { wash: TK.peach, ink: null });
  boilSeed('card glow'); glow(470, 900, 420, '#FFE7A8', .3);
  for (let i = 0; i < 7; i++) diya(110 + i * 125, 1490, 22, clamp((t - C.cap) * 4 - i * .4), 'card' + i);
  const X = 470, pk = t0 => Math.max(0, t - t0) * 5, br = Math.sin(t * 1.3) * .01;
  if (t > C.cap) letter('Stories of SHAKTI, for little ones', X, 660, 46, TK.teal, { screen: true, font: '50px Marcellus', ink: false, pop: pk(C.cap), maxW: 860 });
  [1, 2, 3].forEach((b, j) => {
    const t0 = C.covers + j * .15; if (t < t0) return;
    const x = X + (j - 1) * 290, y = 900 + (j === 1 ? -16 : 0);
    picture(PICS['book' + b], x, y, 276, 276, { rot: (j - 1) * .05 + (j % 2 ? br : -br), pop: pk(t0), r: 8, shadow: 18 });
  });
  if (t > C.price) {
    letter('Books 1–3 · OUT NOW', X, 1130, 46, TK.brown, { screen: true, font: '700 50px Poppins', ink: false, maxW: 860, pop: pk(C.price) });
    letter('Set of 3 for ₹500', X, 1196, 44, TK.rkOrange, { screen: true, font: '700 52px Poppins', ink: false, maxW: 860, pop: pk(C.price + .12) });
  }
  if (t > C.logo) picture(PICS.logo, X, 530, 140, 140, { pop: pk(C.logo) });
  if (t > C.pill) {
    const k = backOut(clamp(pk(C.pill))) * (1 + .03 * pulse(t, 4));
    boilSeed('pill');
    push(); translate(X, 1295); scale(k); paint(rrPts(-220, -44, 440, 88, 44), { wash: TK.rkOrange, ink: null }); pop();
    letter('rishikatha.com', X, 1297, 50, TK.cream, { screen: true, font: '700 52px Poppins', ink: false, pop: pk(C.pill) });
  }
  if (t > C.follow) letter('Follow @therishikatha', X, 1395, 36, TK.grey, { screen: true, font: '500 38px Poppins', ink: false, maxW: 860, pop: pk(C.follow) });
}
