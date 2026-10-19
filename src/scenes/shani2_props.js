// shani2_props.js: the cast palettes, sets and props for "Shani Dev's MOTHER was a SHADOW" (src/scenes/shani2.js, Shani
// series Part 2). Loaded before it; everything here is a pure function of its arguments (and T for boil).
//
//   TK, vanishPuff, sparkleBurst, whipH, bolt        copied from Part 1 (ad 21)
//   SP2                                              this reel's palette
//   SANJNA, CHHAYA, SHADOW                           pals for parvati(): Sanjna, Chhaya (her violet double), a flat shadow
//   KID                                              pals + options for kartikeya(): Surya's six children
//   shadowWoman(x, y, u, o)                          Chhaya as a flat shadow on a wall (o.bundle: cradling a baby, o.babyEyes)
//   goldWall(t, eve)                                 the plain sunlit wall of the hook (eve 0..1: evening light, the rhyme)
//   palace(t)                                        Surya's hall: gold pillars, a sunburst, a warm floor
//   chamber(t, lampX)                                Sanjna's room at dusk, an oil lamp on a stand at lampX
//   courtyard(t)                                     a sunny courtyard with a tulsi pot, leafPlate(x, y, s, n) with n laddoos
//   forge(t)                                         Vishvakarma's workshop: a dark warm wall, tools, an anvil; lathe(x, y, s, spin)
//   doorway(t)                                       a house wall at dusk with a doorway, the sky to the right
//   starSky(t)                                       the night sky and a path of stars; saturn(x, y, r, a), orbit(...)
//   rivers(t)                                        peach banks with two winding rivers
//   kidChakra / kidTrishul                           the tiny weapons in the forge sparks
//   shani2Card(t, C), shani2Strike(t, C)             the end card: the 15K Family Deal, follow for Part 3
const TK = {
  ink: '#2B2233', cream: '#FFF5E2',
  petal: '#F4A6B8', petalDk: '#E0708C', marigold: '#F39A2E', yellow: '#FFD45A', leaf: '#5E9A6A',
  gold: '#EDB43C', goldLt: '#FFE39A', goldDk: '#B67D1C',
  rkOrange: '#F15A24', peach: '#FBE0CF', peachLt: '#FFF1E6', brown: '#3A2418', grey: '#6B5A50', teal: '#2E5F5A',
};
const SP2 = {
  ink: '#2B2233',
  wall: '#F2C46A', wallDk: '#D99A3E', wallLt: '#FFE2A0', wallEve: '#E8875A', wallEveDk: '#B85E4A',
  shadow: '#5A4A82', shadowDk: '#43376A', shadowEye: '#EDE4FF', curse: '#B98CFF', curseRed: '#FF5A4A',
  hall: '#FFD27A', hallDk: '#E8A440', hallLt: '#FFF0C0', pillar: '#F5B83A', pillarDk: '#C8861E', floor: '#F0C890', floorDk: '#D49A5A',
  dusk: '#7A5A8A', duskDk: '#4E3A66', duskLt: '#B48AA8', rose: '#E8A0A0', lamp: '#FFC860', brass: '#D9A23A', brassDk: '#9E6E1E',
  court: '#F6DDAE', courtDk: '#E0B87A', sky: '#BFE0F2', skyDk: '#8EC3E6', tulsi: '#5E9A6A', pot: '#C8743E', potDk: '#954E26',
  leafPlate: '#6EA05A', leafPlateDk: '#4E7A3E', laddoo: '#F5A623', laddooDk: '#D07E10',
  forge: '#4A3040', forgeDk: '#2E1E2A', forgeGlow: '#FF9A3A', iron: '#6A6478', ironDk: '#47425A', wood: '#B86E3C', woodDk: '#8A4A24',
  eve: '#F2A86E', eveDk: '#C67A5A', evePurple: '#7A5A9A', house: '#E8C8A0', houseDk: '#C49A6E', door: '#3A2A40',
  night: '#1E1A3C', nightDk: '#120F28', nightLt: '#3A3368', star: '#FFF1C8',
  saturn: '#E8C27A', saturnDk: '#B88A46', ring: '#F2DDB0', ringDk: '#C8A870',
  river: '#5FA8D8', riverDk: '#3A80B8', riverLt: '#A8D8F2', bank: '#BFD9A0', bankDk: '#94B878',
};

// ---------- the cast's palettes ----------
const SANJNA = { saree: '#F29250', sareeDk: '#CF6630', sareeLt: '#FFC27A', blouse: '#C8324A', blouseDk: '#962338', bangle: '#C8324A' };
const CHHAYA = {
  skin: '#A99AC9', skinDk: '#7E6FA6', skinLt: '#CFC4E6', ink: '#2A2040',
  saree: '#6A5A9A', sareeDk: '#4A3C78', sareeLt: '#9A8AC4', blouse: '#3E3470', blouseDk: '#2C2458',
  gold: '#CFC4EC', goldDk: '#8E84B8', goldLt: '#F0EAFF', hair: '#2A2040', hairLt: '#4A3E66',
  sindoor: '#8A4A9A', lip: '#7A4A80', bangle: '#9A8AC4', eye: '#2A1A40',
};
const SHADOW = (() => {   // every colour the shadow; only the eyes (when open) differ
  const s = SP2.shadow, d = SP2.shadowDk, o = { eye: '#2A1A40', white: SP2.shadowEye };
  for (const k of ['skin', 'skinLt', 'ink', 'saree', 'sareeLt', 'gold', 'goldLt', 'blouse', 'hair', 'hairLt', 'sindoor', 'lip', 'bangle']) o[k] = s;
  for (const k of ['skinDk', 'sareeDk', 'goldDk', 'blouseDk']) o[k] = d;   // a darker shade, so the texture never lets the wall through
  return o;
})();
const kidPal = (skin, skinDk, skinLt, dhoti, dhotiDk, dhotiLt, sash, sashDk, more = {}) => ({ skin, skinDk, skinLt, teal: dhoti, tealDk: dhotiDk, tealLt: dhotiLt, sash, sashDk, ...more });
const KID = {
  shani: { crown: 1, pal: kidPal('#4E5A96', '#353E70', '#7C88C4', '#34303F', '#211E2B', '#55506A', '#5B4A9E', '#3E3175', { gem: '#3F6FE0', hair: '#1C1826', ink: '#1F1A2E', dot: '#B98CFF', brow: '#1C1826', eye: '#1A1428' }) },
  savarni: { topknot: true, feather: false, pal: kidPal('#E8A47A', '#C47E58', '#FFC8A4', '#8A7AB8', '#62558E', '#B4A8DA', '#F29250', '#CF6630') },
  tapati: { girl: 1, pal: kidPal('#E8A47A', '#C47E58', '#FFC8A4', '#F07A22', '#C25A12', '#FFAE6A', '#2FA39B', '#1E716C', { dot: '#C8324A' }) },
  manu: { feather: false, pal: kidPal('#F2BE98', '#D69470', '#FFE0C8', '#F6E6C4', '#D6BE92', '#FFF6E2', '#F29250', '#CF6630') },
  yama: { crown: 1, pal: kidPal('#6E9C78', '#4E7A5A', '#9CC8A4', '#C8324A', '#962338', '#E8697A', '#EDB43C', '#B67D1C', { gem: '#D42A3A', hair: '#1E2A22' }) },
  yami: { girl: 1, pal: kidPal('#B8806A', '#94604E', '#DCA894', '#3767B8', '#244C8E', '#7FA8E0', '#F4A6B8', '#E0708C', { dot: '#C8324A' }) },
};
// a child of Surya: kartikeya() with no vel or shield, his pal and options
function kid(name, x, y, u, o = {}) { return kartikeya(x, y, u, { spear: false, shield: false, ...KID[name], ...o }); }
function kidHand(name, x, y, u, o, s) { return kartiHand(x, y, u, { ...KID[name], ...o }, s); }

// ---------- copied from Part 1 ----------
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
function bolt(p0, p1, k, col = SP2.curse, key = 'bolt') {
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

// ---------- the shadow ----------
// Chhaya as a flat shadow on a wall: parvati() in one colour; o.bundle cradles a swaddled baby (o.babyEyes 0..1 opens
// two violet glints in it); o.eyes opens her own pale eyes; every other parvati() option passes through
function shadowWoman(x, y, u, o = {}) {
  const b = o.bundle ? 1 : 0, po = { boilKey: o.boilKey || 'shadow', noShadow: true, pal: SHADOW, eyes: o.eyes || 'closed', mouth: 'flat', swMul: .6, ...o };
  if (b) { po.handL = po.handL || [-.4, -13.2]; po.handR = po.handR || [3.9, -14.9]; po.bendL = 1.4; po.bendR = 1.4; }
  delete po.bundle; delete po.babyEyes;
  parvati(x, y, u, po);
  if (b) {
    boilSeed((o.boilKey || 'shadow') + ' bundle');
    const fx = o.flip ? -1 : 1, bx = x + fx * 1.9 * u, by = y - 14.1 * u;
    paint(ellPts(bx, by, 3.1 * u, 1.55 * u, 22, u * .04, -.18 * fx), { wash: SP2.shadow, ink: null });
    paint(ellPts(bx + fx * 2.6 * u, by - 1.3 * u, 1.4 * u, 1.3 * u, 18, u * .03), { wash: SP2.shadow, ink: null });
    paint(ellPts(bx + fx * 2.9 * u, by - 2.75 * u, .45 * u, .4 * u, 10), { wash: SP2.shadow, ink: null });   // a baby's topknot
    const be = clamp(o.babyEyes || 0);
    if (be > .02) for (const s of [-1, 1]) {
      const ex = bx + fx * (2.6 + s * .45) * u, ey = by - 1.25 * u;
      glow(ex, ey, u * 1.1 * be, SP2.curse, .5 * be);
      paint(ellPts(ex, ey, .2 * u, .2 * u * be, 10), { wash: '#D9C4FF', ink: null });
    }
  }
}

// ---------- sets ----------
function goldWall(t, eve = 0) {
  boilSeed('wall');
  const c = mixCol(SP2.wall, SP2.wallEve, eve), cd = mixCol(SP2.wallDk, SP2.wallEveDk, eve);
  paint(rectPts(-700, -800, 2500, 3600), { wash: c, fill: cd, fillOp: 50, bleed: .2, tex: .6, ink: null });
  paint(ellPts(380 + 120 * eve, 760, 700, 900, 26, 6), { fill: mixCol(SP2.wallLt, '#FFD0A0', eve), fillOp: 120, bleed: .3, tex: .5, border: .6, ink: null });
  glow(300 + 140 * eve, 700, 700, mixCol('#FFE6A0', '#FFB070', eve), .3);
  boilSeed('wall floor');
  paint(rectPts(-700, 1600, 2500, 1200), { wash: mixCol(SP2.floor, SP2.eveDk, eve * .6), fill: cd, fillOp: 50, tex: .5, ink: null });
  inkLine([[-700, 1600], [1800, 1600]], 2, cd, 'ink', 0);
}
function palace(t) {
  boilSeed('pal bg');
  paint(rectPts(-700, -800, 2500, 3600), { wash: SP2.hall, fill: SP2.hallDk, fillOp: 50, bleed: .2, tex: .5, ink: null });
  // a sunburst on the back wall
  boilSeed('pal burst');
  for (let i = 0; i < 18; i++) {
    const a = i / 18 * TAU + t * .05, r0 = 120, r1 = 1300;
    paint([[540 + Math.cos(a) * r0, 820 + Math.sin(a) * r0], [540 + Math.cos(a + .08) * r1, 820 + Math.sin(a + .08) * r1], [540 + Math.cos(a - .08) * r1, 820 + Math.sin(a - .08) * r1]], { wash: SP2.hallLt, washOp: i % 2 ? 110 : 60, ink: null });
  }
  glow(540, 820, 520, '#FFE9A8', .35);
  boilSeed('pal floor');
  paint(rectPts(-700, 1480, 2500, 1400), { wash: SP2.floor, fill: SP2.floorDk, fillOp: 60, tex: .5, ink: null });
  inkLine([[-700, 1480], [1800, 1480]], 2, SP2.floorDk, 'ink', 0);
  for (const px of [-40, 1120]) {
    boilSeed('pal pillar ' + px);
    paint(rectPts(px - 60, -300, 120, 1800), { wash: SP2.pillar, fill: SP2.pillarDk, fillOp: 60, tex: .5, ink: SP2.ink, sw: 1 });
    paint(rectPts(px - 32, -300, 18, 1800), { wash: SP2.hallLt, washOp: 150, ink: null });
    for (const yy of [260, 700, 1140]) paint(rrPts(px - 80, yy, 160, 46, 14), { wash: TK.goldDk, ink: SP2.ink, sw: .8 });
    paint(rrPts(px - 90, 1380, 180, 110, 16), { wash: SP2.pillarDk, ink: SP2.ink, sw: .9 });
  }
}
function chamber(t, lampX = 960) {
  boilSeed('ch wall');
  paint(rectPts(-700, -800, 2500, 3600), { wash: SP2.dusk, fill: SP2.duskDk, fillOp: 60, bleed: .2, tex: .6, ink: null });
  paint(ellPts(lampX - 120, 980, 800, 900, 26, 6), { fill: SP2.duskLt, fillOp: 110, bleed: .3, tex: .5, border: .6, ink: null });
  boilSeed('ch window');   // a little arched window with the last of the sun
  const wx = 300;
  paint([[wx - 90, 900], [wx - 90, 700], [wx - 60, 640], [wx, 610], [wx + 60, 640], [wx + 90, 700], [wx + 90, 900]], { wash: '#F8B888', ink: SP2.ink, sw: .9, curv: .2 });
  paint(ellPts(wx, 830, 50, 50, 16), { wash: '#FFE0A0', ink: null });
  inkLine([[wx, 610], [wx, 900]], 3, SP2.duskDk, 'ink', 0);
  boilSeed('ch floor');
  paint(rectPts(-700, 1560, 2500, 1300), { wash: '#9A6A7A', fill: '#6E4A5E', fillOp: 60, tex: .5, ink: null });
  inkLine([[-700, 1560], [1800, 1560]], 2, '#5A3A4E', 'ink', 0);
  lamp(lampX, 1560, 1, t);
}
function lamp(x, y, s, t) {
  boilSeed('lamp');
  glow(x, y - 560 * s, 520 * s, SP2.lamp, .45 + .05 * Math.sin(t * 9));
  inkLine([[x, y], [x, y - 520 * s]], 12 * s, SP2.brassDk, 'ink', 0);
  paint(ellPts(x, y - 8 * s, 70 * s, 18 * s, 14), { wash: SP2.brass, ink: SP2.ink, sw: .8 });
  paint([[x - 60 * s, y - 520 * s], [x + 60 * s, y - 520 * s], [x + 36 * s, y - 490 * s], [x - 36 * s, y - 490 * s]], { wash: SP2.brass, ink: SP2.ink, sw: .8 });
  const fl = 1 + .12 * Math.sin(t * 11) + .06 * Math.sin(t * 23);
  paint([[x - 13 * s, y - 525 * s], [x, y - (525 + 58 * fl) * s], [x + 13 * s, y - 525 * s]], { wash: '#FFE08A', ink: null, curv: .6 });
  paint([[x - 6 * s, y - 525 * s], [x, y - (525 + 30 * fl) * s], [x + 6 * s, y - 525 * s]], { wash: '#FFFFFF', ink: null, curv: .6 });
}
function courtyard(t) {
  boilSeed('co sky');
  paint(rectPts(-700, -800, 2500, 1600), { wash: SP2.sky, fill: SP2.skyDk, fillOp: 50, bleed: .2, tex: .4, ink: null });
  boilSeed('co wall');
  paint(rectPts(-700, 700, 2500, 700), { wash: SP2.house, fill: SP2.houseDk, fillOp: 50, tex: .5, ink: null });
  for (let i = 0; i < 6; i++) paint(rrPts(-60 + i * 220, 820, 120, 260, 60), { wash: SP2.houseDk, ink: SP2.ink, sw: .7 });   // arches
  boilSeed('co floor');
  paint(rectPts(-700, 1360, 2500, 1500), { wash: SP2.court, fill: SP2.courtDk, fillOp: 60, tex: .5, ink: null });
  inkLine([[-700, 1360], [1800, 1360]], 2, SP2.courtDk, 'ink', 0);
  for (let i = 0; i < 8; i++) inkLine([[-100 + i * 180, 1360], [-400 + i * 260, 2000]], 1.5, SP2.courtDk, 'inkfine', 0);
}
function leafPlate(x, y, s, n = 0, key = 'plate') {
  boilSeed(key);
  paint(ellPts(x, y, 80 * s, 26 * s, 18, 1.5), { wash: SP2.leafPlate, fill: SP2.leafPlateDk, fillOp: 60, tex: .5, ink: SP2.ink, sw: .7 });
  inkLine([[x - 70 * s, y], [x + 70 * s, y]], 1.2, SP2.leafPlateDk, 'inkfine', 0);
  const P = [[-30, -12], [0, -14], [30, -12], [-15, -38], [15, -38], [0, -62]];
  for (let i = 0; i < Math.min(n, P.length); i++) laddoo(x + P[i][0] * s, y + P[i][1] * s, 18 * s);
}
function laddoo(x, y, r) {
  paint(ellPts(x, y, r, r * .95, 14, r * .06), { wash: SP2.laddoo, fill: SP2.laddooDk, fillOp: 60, tex: .7, ink: SP2.ink, sw: .6 });
  paint(ellPts(x - r * .3, y - r * .35, r * .3, r * .22, 8), { wash: '#FFD27A', washOp: 200, ink: null });
}
function forge(t) {
  boilSeed('fo wall');
  paint(rectPts(-700, -800, 2500, 3600), { wash: SP2.forge, fill: SP2.forgeDk, fillOp: 60, bleed: .2, tex: .6, ink: null });
  glow(540, 1200, 700, SP2.forgeGlow, .3 + .05 * Math.sin(t * 7));
  boilSeed('fo tools');   // tools hanging on the wall: tongs, a hammer, a saw
  inkLine([[100, 560], [940, 560]], 6, SP2.woodDk, 'ink', 0);
  for (const [x, l, k] of [[170, 220, 0], [300, 170, 1], [770, 200, 2], [880, 150, 0]]) {
    inkLine([[x, 560], [x, 560 + l]], 6, SP2.iron, 'ink', 0);
    if (k === 1) paint(rrPts(x - 40, 560 + l, 80, 36, 8), { wash: SP2.iron, ink: SP2.ink, sw: .7 });
    if (k === 2) paint([[x - 10, 560 + l], [x + 60, 560 + l - 20], [x + 60, 560 + l + 20]], { wash: SP2.ironDk, ink: SP2.ink, sw: .7 });
  }
  boilSeed('fo floor');
  paint(rectPts(-700, 1520, 2500, 1300), { wash: '#5A3A3A', fill: '#3A2626', fillOp: 60, tex: .5, ink: null });
  inkLine([[-700, 1520], [1800, 1520]], 2, '#2A1A1A', 'ink', 0);
}
// the lathe: a big round stone turntable on an iron stand, (x, y) the floor under it; spin turns its marks
function lathe(x, y, s, spin) {
  boilSeed('lathe');
  paint([[x - 150 * s, y], [x - 110 * s, y - 120 * s], [x + 110 * s, y - 120 * s], [x + 150 * s, y]], { wash: SP2.ironDk, ink: SP2.ink, sw: 1 });
  paint(ellPts(x, y - 140 * s, 260 * s, 50 * s, 30), { wash: SP2.iron, fill: SP2.ironDk, fillOp: 50, tex: .5, ink: SP2.ink, sw: 1 });
  for (let i = 0; i < 8; i++) {   // the marks round its rim, sliding to show it spinning
    const a = (i / 8 + spin) * TAU, c = Math.cos(a), sn = Math.sin(a);
    if (sn < 0) continue;
    inkLine([[x + c * 240 * s, y - 140 * s + sn * 44 * s], [x + c * 240 * s, y - 140 * s + sn * 44 * s + 16 * s]], 4, SP2.ink, 'ink', 0);
  }
}
function kidChakra(x, y, r, a) {   // a tiny spinning Sudarshana chakra (a spark)
  push(); translate(x, y); rotate(a);
  paint(ellPts(0, 0, r, r, 16), { wash: '#FFE08A', ink: SP2.ink, sw: .5 });
  for (let i = 0; i < 8; i++) { const q = i / 8 * TAU; paint(starPts(Math.cos(q) * r * 1.15, Math.sin(q) * r * 1.15, r * .35, .4, 3, q), { wash: '#FFE08A', ink: null }); }
  paint(ellPts(0, 0, r * .35, r * .35, 8), { wash: '#F5A623', ink: null });
  pop();
}
function kidTrishul(x, y, s, a) {   // a tiny trishul (a spark)
  push(); translate(x, y); rotate(a);
  inkLine([[0, 30 * s], [0, -18 * s]], 3 * s, '#FFE08A', 'ink', 0);
  for (const k of [-1, 0, 1]) inkLine([[k * 9 * s, -8 * s], [k * 11 * s, -22 * s - (k ? 0 : 6 * s)]], 3 * s, '#FFE08A', 'ink', .5);
  inkLine([[-10 * s, -8 * s], [10 * s, -8 * s]], 3 * s, '#FFE08A', 'ink', 0);
  pop();
}
function doorway(t) {
  boilSeed('do sky');
  paint(rectPts(-700, -800, 2500, 2400), { wash: SP2.evePurple, fill: SP2.duskDk, fillOp: 50, bleed: .2, tex: .5, ink: null });
  paint(ellPts(760, 1150, 900, 420, 24, 4), { fill: SP2.eve, fillOp: 170, bleed: .3, tex: .5, border: .6, ink: null });
  glow(820, 1150, 520, '#FFC890', .3);
  boilSeed('do house');   // the house on the left, with its doorway
  paint(rectPts(-700, 500, 1100, 1100), { wash: SP2.house, fill: SP2.houseDk, fillOp: 60, tex: .5, ink: SP2.ink, sw: 1 });
  paint([[-700, 500], [420, 500], [480, 440], [-700, 440]], { wash: SP2.houseDk, ink: SP2.ink, sw: 1 });
  paint([[90, 1600], [90, 900], [140, 820], [220, 790], [300, 820], [350, 900], [350, 1600]], { wash: SP2.door, ink: SP2.ink, sw: 1.1, curv: .15 });
  glow(220, 1250, 260, SP2.lamp, .2);
  boilSeed('do ground');
  paint(rectPts(-700, 1600, 2500, 1200), { wash: '#8A6A5A', fill: '#5E4436', fillOp: 60, tex: .5, ink: null });
  inkLine([[-700, 1600], [1800, 1600]], 2, '#4E3426', 'ink', 0);
}
function starSky(t, path = true) {
  boilSeed('ss sky');
  paint(rectPts(-800, -2200, 2700, 5000), { wash: SP2.night, ink: null });
  paint(ellPts(540, 900, 900, 700, 30, 4), { fill: SP2.nightLt, fillOp: 90, bleed: .3, tex: .4, border: .6, ink: null });
  boilSeed('ss stars');
  for (let i = 0; i < 60; i++) {
    const x = -300 + hash(i * 3.1) * 1700, y = -1900 + hash(i * 7.7) * 4000, r = 4 + 7 * hash(i * 1.9), tw = .6 + .4 * Math.sin(t * (1.5 + hash(i)) + i);
    paint(starPts(x, y, r * tw, .35, 4), { wash: SP2.star, washOp: 200, ink: null });
  }
  if (path) {   // a path of stars he walks on
    boilSeed('ss path');
    for (let i = 0; i < 26; i++) {
      const x = -200 + i * 60, y = 1560 + 14 * Math.sin(i * .9), r = 9 + 5 * hash(i * 4.4);
      glow(x, y, 40, '#FFE9A8', .15);
      paint(starPts(x, y, r, .4, 5, hash(i)), { wash: i % 3 ? SP2.star : '#FFE08A', ink: null });
    }
  }
}
// Saturn with its rings: the back of the ring, the planet, then the front; a tilts the ring
function saturn(x, y, r, a = -.35) {
  boilSeed('saturn back');
  push(); translate(x, y); rotate(a);
  const ring = (front, k) => {
    const P = [];
    for (let i = 0; i <= 24; i++) { const q = (front ? 0 : Math.PI) + i / 24 * Math.PI; P.push([Math.cos(q) * r * 2.1 * k, Math.sin(q) * r * .5 * k]); }
    return P;
  };
  paint(ribbon(ring(false, .92), r * .3, r * .3), { wash: SP2.ringDk, ink: SP2.ink, sw: .7 });
  boilSeed('saturn ball');
  paint(ellPts(0, 0, r, r, 28, r * .02), { wash: SP2.saturn, fill: SP2.saturnDk, fillOp: 60, tex: .5, ink: SP2.ink, sw: 1 });
  for (const yy of [-.45, -.1, .3]) inkLine([[-r * Math.sqrt(1 - yy * yy) * .95, yy * r], [r * Math.sqrt(1 - yy * yy) * .95, yy * r]], r * .08, SP2.saturnDk, 'inkfine', .3);
  boilSeed('saturn front');
  paint(ribbon(ring(true, .92), r * .3, r * .3), { wash: SP2.ring, ink: SP2.ink, sw: .7 });
  inkLine(ring(true, .92), r * .05, SP2.ringDk, 'inkfine', .5);
  pop();
}
// the orbit diagram: a little Sun at (x, y), Saturn's circle of radius R, the 12 signs (signs 0..1 draws the ticks),
// lit: [k0, k1, k2] 0..1 for the three slices of Sade Sati (centred on the slice at angle a0), moon 0..1 marks it
function orbit(x, y, R, t, o = {}) {
  boilSeed('orbit sun');
  glow(x, y, 160, '#FFC860', .6);
  paint(ellPts(x, y, 46, 46, 20), { wash: '#FFC860', ink: SP2.ink, sw: .8 });
  for (let i = 0; i < 12; i++) { const q = i / 12 * TAU + t * .3; inkLine([[x + Math.cos(q) * 56, y + Math.sin(q) * 56], [x + Math.cos(q) * 76, y + Math.sin(q) * 76]], 5, '#FFC860', 'ink', 0); }
  const sg = clamp(o.signs || 0), a0 = o.a0 ?? -Math.PI / 2, w = TAU / 12;
  if (o.lit) o.lit.forEach((k, j) => {
    if (k <= .01) return;
    boilSeed('orbit lit ' + j);
    const c = a0 + (j - 1) * w, P = [[x, y]];
    for (let i = 0; i <= 8; i++) { const q = c - w / 2 + i / 8 * w; P.push([x + Math.cos(q) * (R + 70), y + Math.sin(q) * (R + 70)]); }
    paint(P, { wash: '#FFD45A', washOp: 120 * k, ink: null });
  });
  boilSeed('orbit ring');
  const P = []; for (let i = 0; i <= 60; i++) { const q = i / 60 * TAU; P.push([x + Math.cos(q) * R, y + Math.sin(q) * R]); }
  for (let i = 0; i < 60; i += 2) inkLine([P[i], P[i + 1]], 4, '#CFC4E6', 'ink', 0);   // a dotted circle
  if (sg > .01) {
    boilSeed('orbit signs');
    for (let i = 0; i < 12; i++) { const q = a0 + w / 2 + i * w, k = clamp(sg * 12 - i); if (k > 0) inkLine([[x + Math.cos(q) * (R - 60 * k), y + Math.sin(q) * (R - 60 * k)], [x + Math.cos(q) * (R + 70 * k), y + Math.sin(q) * (R + 70 * k)]], 3, '#CFC4E6', 'inkfine', 0); }
  }
  if ((o.moon || 0) > .01) {   // the natal Moon: a little crescent in the middle slice
    boilSeed('orbit moon');
    const mx = x + Math.cos(a0) * (R - 90), my = y + Math.sin(a0) * (R - 90), r = 26 * backOut(clamp(o.moon));
    glow(mx, my, 80, '#FFF4D0', .5);
    paint(ellPts(mx, my, r, r, 16), { wash: '#FFF4D0', fill: '#E8DDB8', fillOp: 60, tex: .4, ink: SP2.ink, sw: .6 });
  }
  if (o.sat != null) saturn(x + Math.cos(o.sat) * R, y + Math.sin(o.sat) * R, 30);
}
function rivers(t) {
  boilSeed('rv bg');
  paint(rectPts(-200, -200, W + 400, H + 400), { wash: TK.peach, fill: '#F2C9B0', fillOp: 50, bleed: .2, tex: .5, ink: null });
  boilSeed('rv banks');
  paint(ellPts(540, 1450, 760, 260, 26, 6), { wash: SP2.bank, fill: SP2.bankDk, fillOp: 50, tex: .5, ink: null });
  for (const [x0, dir, key] of [[230, 1, 'tapti'], [850, -1, 'yamuna']]) {
    boilSeed('rv ' + key);
    const P = []; for (let i = 0; i <= 10; i++) { const k = i / 10; P.push([x0 + dir * (60 * Math.sin(k * 5 + 1) + 40 * k), 700 + k * 1100]); }
    paint(ribbon(P, 90, 170), { wash: SP2.river, fill: SP2.riverDk, fillOp: 50, tex: .5, ink: SP2.ink, sw: .8 });
    for (let j = 0; j < 4; j++) { const k = frac(t * .25 + j * .25), i = Math.floor(k * 10), q = P[i], r = P[i + 1] || q; inkLine([[q[0] - 20, q[1] + 8], [lerp(q[0], r[0], .4) + 20, lerp(q[1], r[1], .4)]], 4, SP2.riverLt, 'ink', .5); }
  }
}

// ---------- the end card (from Part 1), follow for Part 3 ----------
function shani2Card(t, C) {
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
  if (t > C.follow) letter('Follow @therishikatha for PART 3', X, 1478, 31, TK.grey, { screen: true, font: '700 31px Poppins', ink: false, maxW: 860, pop: pk(C.follow) });
}
function shani2Strike(t, C) {
  if (t < C.strike) return;
  const k = easeOut(seg(t, C.strike, C.strike + .25));
  boilSeed('strike');
  inkLine([[470 - 185, 1196], [lerp(470 - 185, 470 - 55, k), lerp(1196, 1172, k)]], 6, TK.rkOrange, 'ink', 0);
}

// model sheet of the new cast: studio.html?loop=shani2cast
(() => {
  LOOPS.shani2cast = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: PAL.paper, ink: null });
    ['savarni', 'shani', 'tapati', 'manu', 'yama', 'yami'].forEach((n, i) => {
      kid(n, 180 + (i % 3) * 360, 560 + Math.floor(i / 3) * 420, 17, { ...feel(i === 4 ? 'angry' : 'happy', t + i * .3, { seed: i }), boilKey: 'k' + n, kick: i === 4 ? .5 + .5 * Math.sin(t * 3) : 0 });
    });
    parvati(200, 1750, 17, { boilKey: 'sanjna', pal: SANJNA });
    parvati(540, 1750, 17, { boilKey: 'chhaya', pal: CHHAYA });
    shadowWoman(880, 1750, 17, { bundle: 1, babyEyes: 1, eyes: 'normal', boilKey: 'sh' });
  };
  LOOPS.shani2cast.len = 4;
})();
