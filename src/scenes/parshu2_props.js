// parshu2_props.js: sets, props and the cast for parshu2.js (ad 68, "PARSHURAMA fought a DEMON ARMY with NO WEAPONS",
// Parshurama series Part 2). Loaded after src/scenes/parshu1_props.js (PK, CP, PR, TK, peachGround, shockRing, cloudPuff,
// poof, sunDisc, sparkleBurst, diya) and the shared rigs (parshurama.js, shiva.js, parvati.js, mahishasura.js,
// narada.js). Pure functions of their arguments (and T for boil).
//   P2                                                       the palette
//   tapasSet, kailashDay, stormSky, dustPlain                 sets
//   SKY_DAWN, SKY_NOON, SKY_GOLD, lapseSky                     the rock's skies
//   astra, celestialWeapons, axeOutline, lightBeam, halo, snowOn, bruises, brawlCloud, club      props
//   danava, deva                                              the cast (on Mahishasura's and Narad's rigs)
//   navCard                                                   the Navadurga card (no price)
const P2 = {
  ink: '#2B2233', cream: '#FFF5E2', gold: '#F5C542', goldLt: '#FFE69A', goldDk: '#C8922A',
  snow: '#F6F4FA', snowDk: '#C6C8E0', snowSh: '#9EA2C6',
  rock: '#7A6E80', rockDk: '#544A5E', rockLt: '#A498A8',
  pine: '#3E5E5C', pineDk: '#2A4442', flower: '#F48AA8', flowerC: '#FFD86A', leaf: '#6E9E5A',
  // the storm
  stormHi: '#3A1E2A', stormMid: '#7A3A2E', stormLo: '#C2683E', cloudR: '#A85A4A', cloudRDk: '#7A3A36', cloudRLt: '#D88A6A',
  // the dusk plain
  plainHi: '#4E3A6E', plainMid: '#D86E54', plainLo: '#F6B070', dust: '#C89A6A', dustDk: '#9A6E48', dustLt: '#E8C49A',
  earth: '#9A6A48', earthDk: '#6E4A32', mesa: '#7A4A5E', mesaDk: '#5A3248',
  // Kailash by day
  kHi: '#6FAEE6', kMid: '#A8D4F2', kLo: '#E4F2FA',
  // the weapons
  hot: '#FFFDF6', hotRim: '#9FE4FF', hotGlow: '#BFEFFF', calm: '#FFE39A', calmRim: '#D9982A', calmGlow: '#FFD27A',
  bruise: '#8E3A5E', scratch: '#C8323A',
};
const SKY_DAWN = { hi: '#6E7EB8', mid: '#E8A2AE', lo: '#FFD7AE' };
const SKY_NOON = { hi: '#6FAEE6', mid: '#B4DCF4', lo: '#F2F4EE' };
const SKY_GOLD = { hi: '#C9785A', mid: '#F2B27A', lo: '#FFE2A8' };
// the time-lapse: k counts days; day 0..1 within each, the sky from night to noon
function lapseSky(k) {
  const day = Math.sin(frac(k) * Math.PI) ** .6;
  return { day, hi: mixCol('#1E2350', SKY_NOON.hi, day), mid: mixCol('#34346E', SKY_NOON.mid, day), lo: mixCol('#3C3C78', SKY_NOON.lo, day) };
}

// ---------- sets ----------
// A Himalayan height: a sky (o.sky = {hi, mid, lo}), far snow peaks, a pine ridge, and a flat-topped rock whose top is
// at y = o.rockY (default 1590) round x 540. o.skyFx() draws in the sky (sun, moon, stars) before the peaks;
// o.flowers 0..1 opens flowers at the rock's foot; o.snow 0..1 whitens the rock and the ground.
function tapasSet(t, o = {}) {
  const S = o.sky || SKY_DAWN, ry = o.rockY ?? 1590, sn = clamp(o.snow || 0), tint = c => mixCol(c, S.mid, .25);
  boilSeed('ts sky');
  paint(rectPts(-300, -300, W + 600, 2400), { wash: S.hi, ink: null });
  paint(ellPts(540, 1380, 1250, 800, 30), { wash: mixCol(S.hi, S.mid, .6), washOp: 230, ink: null });
  paint(ellPts(540, 1420, 980, 520, 30), { wash: S.mid, washOp: 230, ink: null });
  paint(ellPts(540, 1440, 700, 260, 30), { wash: S.lo, washOp: 230, ink: null });
  if (o.skyFx) o.skyFx();
  boilSeed('ts peaks');
  paint([[-300, 1330], [-120, 1130], [60, 1190], [260, 900], [420, 1070], [560, 1000], [760, 1160], [930, 940], [1120, 1140], [1380, 1060], [1380, 1520], [-300, 1520]],
    { wash: tint(P2.snowDk), fill: tint(P2.snowSh), fillOp: 50, tex: .4, ink: P2.ink, sw: .7, curv: .15 });
  for (const [px, py, w] of [[260, 900, 1], [930, 940, .9], [560, 1000, .6], [-120, 1130, .7]])
    paint([[px, py], [px + 70 * w, py + 90 * w], [px + 30 * w, py + 110 * w], [px - 10 * w, py + 80 * w], [px - 50 * w, py + 115 * w], [px - 80 * w, py + 85 * w]], { wash: tint(P2.snow), ink: null, curv: .3 });
  boilSeed('ts ridge');
  paint([[-300, 1470], [80, 1420], [380, 1460], [700, 1410], [1000, 1450], [1380, 1420], [1380, 1640], [-300, 1640]], { wash: mixCol(P2.pineDk, S.mid, .3), ink: null, curv: .4 });
  for (let i = 0; i < 16; i++) {   // pines along the ridge
    const x = -260 + i * 104 + hash(i * 3.1) * 40, y = 1450 + hash(i * 1.7) * 30, h = 70 + 50 * hash(i * 5.3);
    paint([[x, y - h], [x + h * .3, y], [x - h * .3, y]], { wash: mixCol(P2.pine, S.mid, .2), ink: null });
  }
  boilSeed('ts rock');
  paint([[60, ry + 60], [180, ry + 4], [360, ry - 22], [540, ry - 30], [740, ry - 22], [900, ry + 2], [1010, ry + 70], [1120, ry + 330], [1380, 2600], [-300, 2600], [-40, ry + 320]],
    { wash: mixCol(P2.rock, P2.snow, sn * .5), fill: P2.rockDk, fillOp: 70, tex: .5, ink: P2.ink, sw: 1.2, curv: .35 });
  paint([[120, ry + 40], [360, ry - 6], [540, ry - 14], [760, ry - 6], [950, ry + 40], [760, ry + 30], [540, ry + 24], [320, ry + 30]], { wash: mixCol(P2.rockLt, P2.snow, .4 + sn * .6), washOp: 220, ink: null, curv: .5 });
  paint([[-40, ry + 330], [200, ry + 200], [380, ry + 380], [120, ry + 520]], { fill: P2.rockDk, fillOp: 90, bleed: .2, tex: .5, ink: null });
  paint([[1120, ry + 330], [880, ry + 220], [760, ry + 420], [1000, ry + 560]], { fill: P2.rockDk, fillOp: 90, bleed: .2, tex: .5, ink: null });
  if (o.flowers) {
    boilSeed('ts flowers');
    for (let i = 0; i < 9; i++) {
      const x = 140 + i * 100 + hash(i * 7.7) * 40, y = ry + 120 + hash(i * 2.9) * 160, k = clamp(o.flowers * 1.4 - hash(i) * .4), r = 9 + 6 * hash(i * 4.1);
      inkLine([[x, y], [x + 4, y + 50]], 1.6, P2.leaf, 'inkfine', 0);
      if (k > .05) { paint(starPts(x, y, r * k, .45, 5, i), { wash: P2.flower, ink: P2.ink, sw: .5 }); paint(ellPts(x, y, r * .3 * k, r * .3 * k, 8), { wash: P2.flowerC, ink: null }); }
      else paint(ellPts(x, y, 4, 7, 8), { wash: P2.leaf, ink: null });
    }
  }
}
// Kailash by day: a clear sky, small clouds, the snow pyramid behind, a snowy ledge whose top is y = o.ledgeY (1600)
function kailashDay(t, o = {}) {
  const ly = o.ledgeY ?? 1600;
  boilSeed('kd sky');
  paint(rectPts(-300, -300, W + 600, 2400), { wash: P2.kHi, ink: null });
  paint(ellPts(540, 1400, 1200, 760, 30), { wash: P2.kMid, washOp: 220, ink: null });
  paint(ellPts(540, 1460, 900, 420, 30), { wash: P2.kLo, washOp: 220, ink: null });
  glow(880, 560, 360, '#FFF2C8', .5);
  for (let i = 0; i < 4; i++) cloudPuff(frac(hash(i * 5.1) + t * .006) * 1500 - 220, 640 + i * 150, 70 + 40 * hash(i * 2.2), 'kd' + i, 230);
  boilSeed('kd peak');   // the four-faced pyramid, snow banded
  paint([[-300, 1420], [120, 1170], [380, 830], [540, 700], [700, 830], [960, 1170], [1380, 1420], [1380, 1700], [-300, 1700]], { wash: P2.snow, fill: P2.snowDk, fillOp: 50, tex: .4, ink: P2.ink, sw: 1, curv: .15 });
  paint([[540, 700], [700, 830], [960, 1170], [1380, 1420], [1380, 1700], [560, 1700], [600, 1200]], { wash: P2.snowDk, washOp: 210, ink: null, curv: .2 });
  for (let i = 0; i < 4; i++) { const y = 860 + i * 120, w = 90 + i * 90; inkLine([[540 - w, y + 40], [540 - w * .3, y + 10], [540, y + 30]], 2.2, P2.snowSh, 'inkfine', .5); }
  boilSeed('kd ledge');
  paint([[-300, ly + 30], [120, ly - 10], [540, ly - 24], [960, ly - 10], [1380, ly + 30], [1380, 2600], [-300, 2600]], { wash: P2.rock, fill: P2.rockDk, fillOp: 60, tex: .5, ink: P2.ink, sw: 1.2, curv: .5 });
  paint(ellPts(540, ly + 10, 640, 60, 24), { wash: P2.snow, washOp: 230, ink: null });
}
// the storm: a red-brown sky, rolling clouds, a cloud floor at y = o.floorY (1560); o.bolt 0..1 a lightning flash
function stormSky(t, o = {}) {
  const fy = o.floorY ?? 1560, b = clamp(o.bolt || 0);
  boilSeed('st sky');
  paint(rectPts(-300, -300, W + 600, 2400), { wash: mixCol(P2.stormHi, '#E8C8D8', b * .5), ink: null });
  paint(ellPts(540, 1400, 1250, 760, 30), { wash: mixCol(P2.stormMid, '#F2D8C8', b * .5), washOp: 230, ink: null });
  paint(ellPts(540, 1500, 900, 360, 30), { wash: P2.stormLo, washOp: 220, ink: null });
  boilSeed('st rolls');
  for (let i = 0; i < 6; i++) {
    const x = frac(hash(i * 3.3) - t * .02) * 1700 - 300, y = 640 + i * 130;
    paint(ellPts(x, y, 260, 46, 16), { wash: mixCol(P2.cloudRDk, P2.stormHi, .4), washOp: 220, ink: null });
  }
  if (b > .05) {
    boilSeed('st bolt');
    const P = [[820, 400], [760, 620], [840, 640], [740, 900], [800, 910], [700, 1180]];
    glow(760, 800, 420, '#FFE8F0', .7 * b);
    inkLine(P, 10 * b, '#FFF4FA', 'ink', 0); inkLine(P, 3, '#FFFFFF', 'inkfine', 0);
  }
  boilSeed('st floor');
  for (let i = 0; i < 9; i++) cloudPuff(-260 + i * 190, fy + 30 + (i % 2) * 20, 150, 'stf' + i, 255, P2.cloudRLt, P2.cloudR);
  paint(rectPts(-300, fy + 60, W + 600, 900), { wash: P2.cloudR, ink: null });
}
// the dusk plain: a violet-to-orange sky, mesas, dusty ground from y = o.groundY (1520)
function dustPlain(t, o = {}) {
  const gy = o.groundY ?? 1520;
  boilSeed('dp sky');
  paint(rectPts(-300, -300, W + 600, 2400), { wash: P2.plainHi, ink: null });
  paint(ellPts(540, 1420, 1250, 780, 30), { wash: mixCol(P2.plainHi, P2.plainMid, .6), washOp: 230, ink: null });
  paint(ellPts(540, 1460, 940, 420, 30), { wash: P2.plainMid, washOp: 230, ink: null });
  paint(ellPts(540, 1480, 620, 200, 30), { wash: P2.plainLo, washOp: 230, ink: null });
  glow(540, 1430, 420, '#FFB060', .5);
  boilSeed('dp mesas');
  paint([[-300, gy - 40], [-220, gy - 170], [40, gy - 180], [90, gy - 60], [300, gy - 50], [380, gy - 120], [560, gy - 125], [600, gy - 40], [880, gy - 50], [930, gy - 210], [1200, gy - 220], [1260, gy - 60], [1380, gy - 50], [1380, gy + 40], [-300, gy + 40]],
    { wash: P2.mesa, fill: P2.mesaDk, fillOp: 60, tex: .4, ink: null, curv: .1 });
  boilSeed('dp ground');
  paint([[-300, gy], [300, gy - 14], [800, gy + 6], [1380, gy - 10], [1380, 2600], [-300, 2600]], { wash: P2.earth, fill: P2.earthDk, fillOp: 60, tex: .5, ink: P2.ink, sw: 1, curv: .5 });
  for (let i = 0; i < 10; i++) {   // stones and dry tufts
    const x = -200 + hash(i * 4.3) * 1400, y = gy + 60 + hash(i * 2.1) * 360;
    if (i % 2) paint(ellPts(x, y, 26 + 20 * hash(i), 12 + 8 * hash(i * 3), 10), { wash: P2.dustDk, ink: P2.ink, sw: .6 });
    else for (let j = -2; j <= 2; j++) inkLine([[x, y], [x + j * 9, y - 30 - 8 * hash(i + j)]], 1.4, P2.dustLt, 'inkfine', 0);
  }
}

// ---------- props ----------
// one celestial weapon in local u, upright, centred on (0, 0); C = { fill, rim } (the light's colours)
function astra(kind, u, sw, C) {
  const P = pts => U(pts, u), L = { wash: C.fill, ink: C.rim, sw: sw * 1.2 };
  if (kind === 'bow') {
    paint(ribbon(P([[-.4, -6], [.9, -3.5], [1.5, 0], [.9, 3.5], [-.4, 6]]), .55 * u, .55 * u), { ...L, curv: .6 });
    inkLine(P([[-.4, -6], [-.4, 6]]), sw * .9, C.rim, 'inkfine', 0);
  } else if (kind === 'sword') {
    paint(P([[0, -6.4], [.55, -5.2], [.5, 2], [-.5, 2], [-.55, -5.2]]), L);
    paint(P([[-1.7, 2], [1.7, 2], [1.5, 2.6], [-1.5, 2.6]]), L);
    paint(ribbon(P([[0, 2.6], [0, 4.6]]), .45 * u, .4 * u), L);
  } else if (kind === 'discus') {
    paint(starPts(0, 0, 3 * u, .72, 12), L);
    paint(ellPts(0, 0, 1.4 * u, 1.4 * u, 18), { wash: C.rim, washOp: 120, ink: C.rim, sw });
    paint(ellPts(0, 0, .5 * u, .5 * u, 10), L);
  } else if (kind === 'spear') {
    paint(ribbon(P([[0, 5.6], [0, -3.4]]), .3 * u, .26 * u), L);
    paint(P([[0, -7], [.8, -4.6], [0, -3.2], [-.8, -4.6]]), { ...L, curv: .3 });
  } else if (kind === 'mace') {
    paint(ribbon(P([[0, 5.4], [0, -2.4]]), .36 * u, .3 * u), L);
    paint(ellPts(0, -3.8 * u, 1.7 * u, 1.9 * u, 16), L);
    for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; paint(ellPts(Math.cos(a) * 1.6 * u, -3.8 * u + Math.sin(a) * 1.8 * u, .35 * u, .35 * u, 8), L); }
  }
}
const ASTRAS = ['bow', 'spear', 'discus', 'sword', 'mace'];
// the weapons as a fan of light round (cx, cy), s px per u. o.heat 0..1: white-hot (shimmer, sparks) .. calm gold;
// o.k 0..1 fans them in; o.at(i) → [x, y, scale 0..1] overrides each one's place (the gifts flying into him)
function celestialWeapons(cx, cy, s, t, o = {}) {
  const heat = clamp(o.heat ?? 0), k = clamp(o.k ?? 1), key = o.key || 'cw';
  const C = { fill: mixCol(P2.calm, P2.hot, heat), rim: mixCol(P2.calmRim, P2.hotRim, heat) }, G = mixCol(P2.calmGlow, P2.hotGlow, heat);
  ASTRAS.forEach((kind, i) => {
    const a = (i - 2) * .5, bob = Math.sin(t * 2.2 + i * 1.3) * s * .25;
    let x = cx + Math.sin(a) * s * 7.5 * k, y = cy - Math.cos(a) * s * 3.2 * k + s * 3.2 + bob, sc = backOut(clamp(k * 1.4 - i * .1));
    if (o.at) { const p = o.at(i); if (!p) return; [x, y, sc] = p; }
    if (sc <= .02) return;
    boilSeed(key + i);
    glow(x, y, s * 5 * sc, G, .55 + .25 * heat);
    push(); translate(x, y); rotate(a * .55 + Math.sin(t * 1.7 + i) * .05); astra(kind, s * sc, 1.2, C); pop();
    if (heat > .3) {   // the air ripples over each, and sparks spit off
      for (let j = 0; j < 2; j++) {
        const yy = y - s * (6 + j * 2.2) - frac(t * .9 + j * .5) * s * 3;
        inkLine([[x - s * 1.4, yy], [x - s * .7, yy - s * .3], [x, yy], [x + s * .7, yy - s * .3], [x + s * 1.4, yy]], 1.4 * heat, P2.hotRim, 'inkfine', .5);
      }
      for (let j = 0; j < 3; j++) {
        const ph = frac(t * 1.6 + hash(i * 9 + j)), ang = hash(i * 5 + j * 3) * TAU, r = s * (2 + ph * 6);
        if (ph < .8) paint(starPts(x + Math.cos(ang) * r, y + Math.sin(ang) * r, s * .6 * (1 - ph), .35, 4), { wash: '#FFFFFF', washOp: 255 * heat, ink: null });
      }
    }
  });
}
// the axe that isn't there: a dashed outline of the parashu (same shape as parashu() in parshurama.js) with its grip
// at (x, y), u its unit, a its turn; k 0..1 fades it in
function axeOutline(x, y, u, a, k = 1, col = P2.cream, key = 'ghost') {
  if (k <= .02) return;
  boilSeed(key);
  const ca = Math.cos(a), sa = Math.sin(a), Q = ([px, py]) => [x + (px * ca - py * sa) * u, y + (px * sa + py * ca) * u];
  const blade = [[-.35, -7.6], [.6, -7.75], [1.6, -8.5], [2.55, -9.2], [3.2, -8.5], [3.45, -6.9], [3.2, -5.2], [2.6, -4.3], [1.7, -4.95], [.6, -5.55], [-.35, -5.45]];
  const paths = [[...blade, blade[0]], [[-.25, 4.3], [-.25, -5.4]], [[.25, 4.3], [.25, -5.4]], [[-.25, 4.3], [.25, 4.3]]];
  glow(...Q([1.4, -5]), 4.4 * u, '#FFF2D8', .3 * k);
  paint(blade.map(Q), { wash: '#FFFFFF', washOp: 70 * k, ink: null, curv: .35 });   // a ghost of the blade
  paint([Q([-.25, 4.3]), Q([.25, 4.3]), Q([.25, -5.4]), Q([-.25, -5.4])], { wash: '#FFFFFF', washOp: 50 * k, ink: null });
  // the dashes run along the whole outline at an even pitch (dash 1u, gap .6u)
  for (const path of paths) {
    const L = []; let tot = 0;
    for (let i = 0; i < path.length - 1; i++) { const d = Math.hypot(path[i + 1][0] - path[i][0], path[i + 1][1] - path[i][1]); L.push(d); tot += d; }
    const at = s0 => { let r = s0; for (let i = 0; i < L.length; i++) { if (r <= L[i]) { const f = r / L[i]; return [lerp(path[i][0], path[i + 1][0], f), lerp(path[i][1], path[i + 1][1], f)]; } r -= L[i]; } return path[path.length - 1]; };
    for (let s0 = 0; s0 < tot; s0 += 1.6) { const pts = []; for (let q = 0; q <= 4; q++) pts.push(Q(at(Math.min(tot, s0 + q * .25)))); inkLine(pts, 2.4 * k, col, 'inkfine', .3); }
  }
}
// a column of light from the top of the frame down to (x, y), w wide at the bottom; k 0..1
function lightBeam(x, y, w, k, key = 'beam', col = '#FFF0C8') {
  if (k <= .02) return;
  boilSeed(key);
  paint([[x - w * .25, -400], [x + w * .25, -400], [x + w * .5, y], [x - w * .5, y]], { fill: col, fillOp: 150 * k, bleed: .2, tex: .3, ink: null });
  glow(x, y, w * 1.2, col, .6 * k);
}
// a deity's halo: a soft disc and a ring of light behind (x, y)
function halo(x, y, r, k = 1, key = 'halo', col = '#FFE6A0') {
  if (k <= .02) return;
  boilSeed(key);
  glow(x, y, r * 2.2, col, .55 * k);
  paint(ellPts(x, y, r, r, 30), { wash: '#FFF6DA', washOp: 120 * k, ink: null });
  const P = ellPts(x, y, r, r, 40); inkLine([...P, P[0]], 3.2 * k, col, 'ink', .5);
}
// snow resting on a seated narada-rig figure's shoulders and jata; k 0..1
function snowOn(x, y, u, o, k, key = 'snowon') {
  if (k <= .02) return;
  boilSeed(key);
  for (const s of [-1, 1]) { const [px, py] = naradaLocal(x, y, u, o, s * 3.1, -16.6); paint(ellPts(px, py, 1.7 * u * k, .55 * u * k, 12), { wash: P2.snow, ink: P2.ink, sw: .5 }); }
  const [hx, hy] = naradaLocal(x, y, u, o, 0, -27.4); paint(ellPts(hx, hy, 1.6 * u * k, .5 * u * k, 12), { wash: P2.snow, ink: P2.ink, sw: .5 });
  for (const [lx, ly] of [[-2.2, -9.8], [2.2, -9.8]]) { const [px, py] = naradaLocal(x, y, u, o, lx, ly); paint(ellPts(px, py, 1.4 * u * k, .4 * u * k, 10), { wash: P2.snow, ink: null }); }
}
// scratches and bruises on a narada-rig figure (Rama after the fight); k 0..1 (they fade as he heals)
function bruises(x, y, u, o, k, key = 'bruise') {
  if (k <= .02) return;
  boilSeed(key);
  const spots = [[-1.3, -22.3, 0], [1.6, -19.8, 1], [-4.6, -13.2, 0], [4.7, -12.4, 1], [1.2, -14.4, 0], [-1.4, -10.2, 1]];
  spots.forEach(([lx, ly, kind], i) => {
    const [px, py] = naradaLocal(x, y, u, o, lx, ly);
    if (kind) paint(ellPts(px, py, .6 * u, .45 * u, 10, 0, .4), { wash: P2.bruise, washOp: 150 * k, ink: null });
    for (let j = 0; j < 2; j++) inkLine([[px - .5 * u, py - .4 * u + j * .3 * u], [px + .5 * u, py + .1 * u + j * .3 * u]], 1.6 * k, P2.scratch, 'inkfine', 0);
  });
}
// a cartoon brawl: a rolling ball of dust with fists, feet, stars and a club flying out; k 0..1 (in, out)
function brawlCloud(x, y, s, t, k, key = 'brawl') {
  if (k <= .02) return;
  boilSeed(key);
  const r = s * backOut(clamp(k)), spin = t * 5;
  for (let i = 0; i < 9; i++) {
    const a = i / 9 * TAU + spin * .2, d = r * (.45 + .15 * Math.sin(t * 9 + i));
    paint(ellPts(x + Math.cos(a) * d, y + Math.sin(a) * d * .75, r * .5, r * .42, 14), { wash: i % 2 ? P2.dust : P2.dustLt, fill: P2.dustDk, fillOp: 40, tex: .4, ink: P2.ink, sw: 1 });
  }
  paint(ellPts(x, y, r * .7, r * .6, 18), { wash: P2.dustLt, ink: null });
  for (let i = 0; i < 4; i++) {   // swirls of dust
    const a0 = i * 1.6 + spin * .5, rr = r * (.25 + .1 * i);
    inkLine(Array.from({ length: 7 }, (_, j) => [x + Math.cos(a0 + j * .45) * rr, y + Math.sin(a0 + j * .45) * rr * .7]), 2, P2.dustDk, 'inkfine', .6);
  }
  // limbs poking out: Rama's fists (wheat), Danava fists and feet (teal, rust)
  const skins = ['#E0A576', '#5E8E8A', '#B8563A', '#E0A576', '#C8A23A', '#E0A576'];
  for (let i = 0; i < 6; i++) {
    const ph = frac(t * 2.2 + hash(i * 3.7)); if (ph > .6) continue;
    const a = hash(i * 7.3) * TAU + Math.floor(t * 2.2 + hash(i * 3.7)) * 2.1, out = Math.sin(ph / .6 * Math.PI);
    const px = x + Math.cos(a) * r * (.8 + .5 * out), py = y + Math.sin(a) * r * .7 * (1 + .45 * out);
    const isFoot = i % 3 === 2, c = skins[i];
    const ax = Math.cos(a), ay = Math.sin(a), q = (d, n = 0) => [px + ax * d - ay * n, py + ay * d + ax * n];
    paint(ribbon([q(-r * .45), q(0)], s * .14, s * .12), { wash: c, ink: P2.ink, sw: 1 });
    if (isFoot) paint(ellPts(...q(s * .08), s * .16, s * .09, 10, 0, a), { wash: c, ink: P2.ink, sw: 1 });
    else paint(ellPts(...q(s * .06), s * .13, s * .13, 10), { wash: c, ink: P2.ink, sw: 1 });
  }
  for (let i = 0; i < 5; i++) {   // stars and impact bursts
    const ph = frac(t * 3 + hash(i * 1.9)), a = hash(i * 4.4 + Math.floor(t * 3 + hash(i * 1.9))) * TAU, d = r * (.6 + .5 * ph);
    if (i % 2) paint(starPts(x + Math.cos(a) * d, y + Math.sin(a) * d * .7, s * .2 * (1 - ph), .4, 5), { wash: '#FFE36A', ink: P2.ink, sw: .8 });
    else paint(starPts(x + Math.cos(a) * d * .7, y + Math.sin(a) * d * .5, s * .2 * (1 - ph), .3, 9), { wash: '#FFF6DA', washOp: 230, ink: null });
  }
}
// a knobbly club, upright in a hand hook (u, sw)
function club(u, sw) {
  paint(ribbon(U([[0, 1.2], [0, -2], [0, -6.2]], u), .45 * u, .9 * u), { wash: '#7A4A2A', fill: '#4E2E18', fillOp: 60, tex: .4, ink: P2.ink, sw: sw * .7 });
  for (const [kx, ky] of [[-.55, -4.2], [.6, -5.2], [-.4, -5.9], [.5, -3.2]]) paint(ellPts(kx * u, ky * u, .22 * u, .22 * u, 8), { wash: '#5E3A20', ink: P2.ink, sw: sw * .4 });
}

// ---------- the cast ----------
// the Danavas: Mahishasura's rig recoloured (no nose ring, so none reads as him), clubs instead of swords
const DANAVA = [
  { pal: { skin: '#5E8E8A', skinDk: '#3E6A66', skinLt: '#86B4AE', sash: '#C8723A', sashDk: '#8E4A1E', dhoti: '#6A2E4A', dhotiDk: '#4A1E34', ink: '#22262A' }, horns: 'short', stache: 'thin' },
  { pal: { skin: '#B8563A', skinDk: '#8A3A24', skinLt: '#D8805E', sash: '#2E5A6A', sashDk: '#1E3E4A', dhoti: '#3A3A5A', dhotiDk: '#26263E', ink: '#2A1A1A' }, horns: 'one', hair: 'mane' },
  { pal: { skin: '#C8A23A', skinDk: '#9A7A22', skinLt: '#E6C66A', sash: '#7A2E5A', sashDk: '#561E3E', dhoti: '#2E4A3A', dhotiDk: '#1E3426', ink: '#2A2218' }, horns: 'none', hair: 'topknot', stache: 'curl' },
  { pal: { skin: '#6A6A8A', skinDk: '#4A4A66', skinLt: '#9292B0', sash: '#C83A3A', sashDk: '#8E2424', dhoti: '#5A3A1E', dhotiDk: '#3E2612', ink: '#22222E' }, horns: 'short', hair: 'bald' },
];
function danava(x, y, u, o = {}) {
  const v = DANAVA[(o.v ?? 0) % DANAVA.length];
  return mahishasura(x, y, u, { ring: false, sword: false, shield: false, armR: club, ...v, ...o, pal: { ...v.pal, ...(o.pal || {}) } });
}
// a fleeing deva: Narad's rig in white and gold with a little crown, running
const DEVA_PAL = { dhoti: '#F2D27A', dhotiDk: '#C8A040', dhotiLt: '#FFF0B0', border: '#C8323A', shawl: '#FFF8EC', shawlDk: '#E6D8C0', skin: '#F6CDA2', skinDk: '#DAA070', skinLt: '#FFE6CA' };
function deva(x, y, u, o = {}) {
  return narada(x, y, u, { veena: false, topknot: false, tilak: false, ...o, pal: { ...DEVA_PAL, ...(o.pal || {}) },
    hat: (uu, sw) => paint(U([[-2.2, -22.6], [-1.6, -25.2], [-.6, -23.8], [0, -25.8], [.6, -23.8], [1.6, -25.2], [2.2, -22.6]], uu), { wash: P2.gold, fill: P2.goldDk, fillOp: 50, ink: P2.ink, sw: sw * .7 }) });
}

// ---------- the card: the Navadurga set, no price (owner, 31 Oct 2026) ----------
function navCard(t, C) {
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
  if (t > C.line) {
    letter('The Navadurga Set', X, 1130, 48, TK.brown, { screen: true, font: '700 50px Poppins', ink: false, maxW: 860, pop: pk(C.line) });
    letter('OUT NOW', X, 1196, 46, TK.rkOrange, { screen: true, font: '700 52px Poppins', ink: false, maxW: 860, pop: pk(C.line + .12) });
  }
  if (t > C.logo) picture(PICS.logo, X, 530, 140, 140, { pop: pk(C.logo) });
  if (t > C.pill) {
    const k = backOut(clamp(pk(C.pill))) * (1 + .03 * pulse(t, 4));
    boilSeed('pill');
    push(); translate(X, 1295); scale(k); paint(rrPts(-220, -44, 440, 88, 44), { wash: TK.rkOrange, ink: null }); pop();
    letter('rishikatha.com', X, 1297, 50, TK.cream, { screen: true, font: '700 52px Poppins', ink: false, pop: pk(C.pill) });
  }
  if (t > C.bio) letter('Check the link in bio', X, 1385, 38, TK.brown, { screen: true, font: '500 38px Poppins', ink: false, maxW: 860, pop: pk(C.bio) });
  if (t > C.follow) letter('Follow @therishikatha', X, 1445, 36, TK.grey, { screen: true, font: '500 38px Poppins', ink: false, maxW: 860, pop: pk(C.follow) });
}
