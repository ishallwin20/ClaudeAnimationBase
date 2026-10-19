// kanha_props.js: sets and props of "Every mom says OPEN YOUR MOUTH" (kanha.js), Little Kanha Part 1.
//   courtyardSet(t, o)        the courtyard at Gokul, in world space (x -800..1900): sky, trees, the mud wall with a
//                             thatch eave and a doorway, hanging matkis, the tulsi chaura, the earth floor, a mud patch
//   cosmosSet(t, o)           the universe inside his mouth, in screen space: nebulae, stars, a spiral galaxy
//   sunDisc / moonDisc / planet(x, y, r, o) · earthGlobe(x, y, R, o) · gokulSet(t, o) (world space: Yamuna, huts, cows)
//   mayaDust(t, x0, y0, x1, y1, k, key)   pink-gold sparkles drifting along a path (his maya of a mother's love)
//   wagFinger(u, sw, a, col)  a pointing finger, upright at a parvati() hand hook, wagging by a
//   followCard(t, C)          the follow card
const KS = {
  ink: '#3A2A30', cream: '#FFF5E2',
  sky: '#F7D9A6', skyTop: '#F2C48A', skyLow: '#FBEACB',
  leaf: '#6E9E58', leafDk: '#4E7E46', leafLt: '#9CC27A', trunk: '#7A5238',
  wall: '#D9A26C', wallDk: '#B8804E', wallLt: '#ECC290', eave: '#C9A24E', eaveDk: '#9C7A30', eaveLt: '#E2C26E',
  door: '#4A2E26', wood: '#8A5A3A', woodDk: '#5E3A24', toran: '#5E9A4E', floor: '#D3A577', floorDk: '#B58556', floorLt: '#E6C196',
  mud: '#7A4E30', mudDk: '#5E3A22', mudLt: '#9A6A44', pot: '#B8603A', potDk: '#8A4024', potLt: '#D88A5A', rope: '#8A6A3A',
  chaura: '#F2E2C6', chauraDk: '#D6BE98', chauraRed: '#C8453A', chauraOchre: '#E0A23A', tulsi: '#4F9A4A', tulsiDk: '#3A7A3A',
  rice: '#FFF6E6',
  space: '#0E0C2E', space2: '#1E1650', nebV: '#6A3E9E', nebT: '#2E7E9E', nebP: '#B04E8E', star: '#FFF4C8',
  sun: '#FFC23A', sunDk: '#F28A2A', moon: '#EEF0FF', moonDk: '#B8BCD8',
  ocean: '#2F7EC4', oceanDk: '#1E5A9A', land: '#6FAE5A', landDk: '#4E8E46', desert: '#D8B46A', snow: '#F6F8FF', cloud: '#FFFFFF',
  yamuna: '#3E5AA8', yamunaLt: '#6E8ED0', hut: '#D29A62', thatch: '#C7A04C', thatchDk: '#9A7A34', cow: '#F6EEE2', cowDk: '#C9BCA8',
  gold: '#EDB43C', goldDk: '#B67D1C', saffron: '#F39A2E', rkOrange: '#F15A24', rkPeach: '#FBE0CF', teal: '#2E5F5A', pink: '#F4A6C8',
};

const kGrad = (cols, x0, y0, x1, y1, key) => {   // soft horizontal bands, top to bottom (world or screen space)
  boilSeed(key);
  const n = cols.length;
  paint(rectPts(x0, y0, x1 - x0, y1 - y0), { wash: cols[n - 1], ink: null });
  for (let i = n - 2; i >= 0; i--) { const yb = lerp(y0, y1, (i + 1) / n); paint([[x0, y0], [x1, y0], [x1, yb + 40], [(x0 + x1) / 2, yb + 70], [x0, yb + 40]], { fill: cols[i], fillOp: 230, bleed: .12, tex: .3, border: .2, ink: null }); }
};

// ---------- the courtyard ----------
// o: dusk 0..1 (golden dusk), tint (a hex to wash everything toward, e.g. starlight violet) + tintK
function courtyardSet(t, o = {}) {
  const dk = clamp(o.dusk || 0), tk = clamp(o.tintK || 0), tc = o.tint || KS.nebV;
  const C = c => mixCol(mixCol(c, '#F2A06A', dk * .35), tc, tk);
  // sky and the far trees over the wall
  kGrad([C(KS.skyTop), C(KS.sky), C(KS.skyLow)], -900, -600, 2000, 760, 'csky');
  boilSeed('ctrees');
  for (let i = 0; i < 9; i++) {
    const x = -760 + i * 320 + hash(i * 3.1) * 90, y = 640 - hash(i * 5.3) * 140, r = 150 + hash(i * 7.7) * 80, sw = Math.sin(t * .8 + i) * 6;
    paint(ellPts(x + sw, y, r, r * .8, 18, 8), { fill: C(i % 2 ? KS.leafDk : KS.leaf), fillOp: 230, bleed: .1, tex: .5, ink: null });
    paint(ellPts(x - r * .3 + sw, y - r * .3, r * .5, r * .4, 14, 6), { fill: C(KS.leafLt), fillOp: 150, bleed: .15, tex: .5, ink: null });
  }
  // the wall
  boilSeed('cwall');
  paint(rectPts(-900, 690, 2900, 680), { wash: C(KS.wall), fill: C(KS.wallDk), fillOp: 70, tex: .6, ink: null });
  for (let i = 0; i < 14; i++) { const x = -800 + hash(i * 2.9) * 2600, y = 780 + hash(i * 4.1) * 480; paint(ellPts(x, y, 90 + hash(i) * 60, 30 + hash(i * 2) * 20, 12, 6), { fill: C(i % 2 ? KS.wallLt : KS.wallDk), fillOp: 90, bleed: .25, tex: .5, ink: null }); }
  // white mandana motifs along the foot of the wall
  boilSeed('cmandana');
  for (let i = 0; i < 26; i++) { const x = -780 + i * 104; paint([[x, 1300], [x + 30, 1250], [x + 60, 1300]], { wash: C(KS.rice), washOp: 200, ink: null }); paint(ellPts(x + 30, 1225, 7, 7, 6), { wash: C(KS.rice), washOp: 200, ink: null }); }
  inkLine([[-900, 1318], [700, 1318]], 2.2, C(KS.wallDk), 'ink', 0); inkLine([[700, 1318], [2000, 1318]], 2.2, C(KS.wallDk), 'ink', 0);
  // the thatch eave
  boilSeed('ceave');
  for (const [a, b] of [[-900, 300], [300, 1300], [1300, 2000]]) {
    paint([[a, 600], [b, 600], [b + 20, 720], [a - 20, 720]], { wash: C(KS.eave), fill: C(KS.eaveDk), fillOp: 60, tex: .6, ink: KS.ink, sw: 1.2 });
    for (let x = a + 15; x < b; x += 34) inkLine([[x, 610], [x + 6, 712]], .9, C(KS.eaveDk), 'inkfine', .2);
  }
  inkLine([[-900, 718], [700, 718]], 1.6, KS.ink, 'ink', 0); inkLine([[700, 718], [2000, 718]], 1.6, KS.ink, 'ink', 0);
  // the doorway, with a toran of mango leaves
  boilSeed('cdoor');
  paint(rectPts(1160, 860, 280, 470), { wash: C(KS.wood), ink: KS.ink, sw: 1.4 });
  paint(rectPts(1190, 890, 220, 440), { wash: C(KS.door), ink: null });
  paint(rectPts(1140, 840, 320, 40), { wash: C(KS.woodDk), ink: KS.ink, sw: 1.2 });
  for (let i = 0; i < 9; i++) { const x = 1170 + i * 33, a = Math.sin(t * 1.5 + i) * .08; push(); translate(x, 885); rotate(a); paint([[0, 0], [10, 22], [0, 46], [-10, 22]], { wash: C(KS.toran), ink: KS.ink, sw: .6, curv: .5 }); pop(); }
  // the hanging matkis (a chheenka from the eave)
  boilSeed('cmatki');
  for (const [mx, my, ph] of [[860, 960, 0], [-420, 920, 1.3]]) {
    const sw2 = Math.sin(t * 1.1 + ph) * 8;
    for (const s of [-1, 1]) inkLine([[mx + s * 18, 720], [mx + sw2 + s * 46, my - 20]], 1.3, C(KS.rope), 'ink', 0);
    paint(ellPts(mx + sw2, my, 70, 58, 18, 3), { wash: C(KS.pot), fill: C(KS.potDk), fillOp: 70, tex: .5, ink: KS.ink, sw: 1.2 });
    paint(ellPts(mx + sw2, my - 58, 34, 12, 12), { wash: C(KS.potDk), ink: KS.ink, sw: .9 });
    paint(ellPts(mx + sw2 - 22, my - 16, 18, 12, 10), { wash: C(KS.potLt), washOp: 150, ink: null });
    inkLine([[mx + sw2 - 60, my + 8], [mx + sw2 + 60, my + 8]], 1.2, C(KS.cream), 'inkfine', .5);
  }
  // the floor
  boilSeed('cfloor');
  paint(rectPts(-900, 1325, 2900, 1300), { wash: C(KS.floor), fill: C(KS.floorDk), fillOp: 60, tex: .5, ink: null });
  for (let i = 0; i < 16; i++) { const x = -800 + hash(i * 6.1) * 2600, y = 1400 + hash(i * 1.9) * 700; paint(ellPts(x, y, 110 + hash(i) * 90, 24 + hash(i * 3) * 14, 12, 6), { fill: C(i % 3 ? KS.floorDk : KS.floorLt), fillOp: 80, bleed: .25, tex: .5, ink: null }); }
  // the mud patch, where he dug
  if (o.patch !== false) {
    boilSeed('cpatch');
    paint(ellPts(150, 1640, 170, 52, 18, 10), { wash: C(KS.mud), fill: C(KS.mudDk), fillOp: 80, tex: .6, ink: null });
    for (let i = 0; i < 5; i++) paint(ellPts(60 + i * 45, 1630 + Math.sin(i * 2) * 14, 16, 9, 8), { wash: C(KS.mudLt), washOp: 180, ink: null });
  }
  // the tulsi chaura
  boilSeed('cchaura');
  const cx = -150, cy = 1480;
  paint([[cx - 120, cy], [cx + 120, cy], [cx + 105, cy - 230], [cx - 105, cy - 230]], { wash: C(KS.chaura), fill: C(KS.chauraDk), fillOp: 50, tex: .5, ink: KS.ink, sw: 1.3 });
  paint(rectPts(cx - 130, cy - 268, 260, 42), { wash: C(KS.chaura), ink: KS.ink, sw: 1.2 });
  inkLine([[cx - 100, cy - 196], [cx + 100, cy - 196]], 3, C(KS.chauraRed), 'ink', 0);
  for (let i = 0; i < 5; i++) paint(ellPts(cx - 72 + i * 36, cy - 120, 12, 12, 8), { wash: C(i % 2 ? KS.chauraOchre : KS.chauraRed), ink: null });
  paint(starPts(cx, cy - 120, 44, .45, 8), { wash: C(KS.chauraOchre), washOp: 120, ink: null });
  boilSeed('ctulsi');
  for (let i = 0; i < 11; i++) {
    const a = -Math.PI / 2 + (i - 5) * .22, l = 120 + hash(i * 3.3) * 70, sw2 = Math.sin(t * 1.4 + i * .7) * 5;
    const tip = [cx + Math.cos(a) * l * .8 + sw2, cy - 268 + Math.sin(a) * l];
    inkLine([[cx, cy - 262], tip], 1.4, C(KS.tulsiDk), 'inkfine', .3);
    paint(ellPts(tip[0], tip[1], 26, 18, 10, 3, a), { wash: C(i % 2 ? KS.tulsi : KS.tulsiDk), ink: KS.ink, sw: .6 });
  }
  // clay pots stacked by the door
  boilSeed('cpots');
  for (const [px, py, r] of [[1560, 1440, 70], [1660, 1450, 58], [1610, 1350, 52]]) {
    paint(ellPts(px, py, r, r * .85, 16, 3), { wash: C(KS.pot), fill: C(KS.potDk), fillOp: 70, tex: .5, ink: KS.ink, sw: 1.1 });
    paint(ellPts(px, py - r * .82, r * .45, r * .16, 12), { wash: C(KS.potDk), ink: KS.ink, sw: .8 });
  }
}

// ---------- the universe ----------
// o: k (0..1 how far in: the stars brighten and stream), drift (px of parallax), tintTop (a sky colour to blend toward)
function cosmosSet(t, o = {}) {
  const k = clamp(o.k ?? 1), dr = o.drift || 0;
  kGrad([KS.space, KS.space2, '#2A1A5E', KS.space2], -100, -100, W + 100, H + 100, 'cos_bg');
  boilSeed('cos_neb');
  for (const [x, y, r, c, a] of [[200, 520, 420, KS.nebV, 120], [880, 900, 380, KS.nebT, 100], [420, 1400, 460, KS.nebP, 90], [900, 1650, 300, KS.nebV, 90], [120, 1050, 260, KS.nebT, 70]])
    paint(ellPts(x + dr * .2, y, r, r * .7, 20, 30), { fill: c, fillOp: a * k, bleed: .3, tex: .7, border: .5, ink: null });
  boilSeed('cos_stars');
  for (let i = 0; i < 90; i++) {
    const depth = .3 + hash(i * 1.37) * .7, x = frac(hash(i * 2.71) + dr * depth / 1400) * (W + 80) - 40, y = hash(i * 4.13) * H, tw = .55 + .45 * Math.sin(t * (2 + hash(i) * 4) + i);
    const r = (2 + depth * 6) * tw * (.4 + .6 * k);
    paint(starPts(x, y, r * 2.4, .32, 4), { wash: KS.star, washOp: 255 * k, ink: null });
  }
  for (let i = 0; i < 6; i++) { const x = frac(hash(i * 9.1) + dr / 900) * W, y = hash(i * 6.7) * H; glow(x, y, 26, '#FFF4C8', .5 * k); }
}
function galaxy(x, y, R, rot, key = 'gal') {
  boilSeed(key);
  glow(x, y, R * 1.5, '#9A7AF0', .55);
  glow(x, y, R * .45, '#FFE6B0', .9);
  for (let arm = 0; arm < 3; arm++) {
    const P = []; for (let j = 0; j < 24; j++) { const a = rot + arm * TAU / 3 + j * .26, r = R * (.08 + j * .04); P.push([x + Math.cos(a) * r, y + Math.sin(a) * r * .55]); }
    inkLine(P, 3.2, '#D8C8FF', 'dry', .6);
    for (let j = 2; j < 24; j += 3) paint(starPts(P[j][0], P[j][1], 6 + hash(j + arm * 30) * 5, .35, 4), { wash: KS.star, ink: null });
  }
  paint(ellPts(x, y, R * .14, R * .09, 12), { wash: '#FFF2D0', ink: null });
}
function sunDisc(x, y, r, o = {}) {
  boilSeed(o.key || 'csun');
  glow(x, y, r * 3, '#FFB84A', .9); glow(x, y, r * 1.6, '#FFE6A0', .8);
  for (let i = 0; i < 16; i++) { const a = (o.rot ?? T * .2) + i / 16 * TAU, L = r * (i % 2 ? 1.35 : 1.6); paint([[x + Math.cos(a - .12) * r * .95, y + Math.sin(a - .12) * r * .95], [x + Math.cos(a) * L, y + Math.sin(a) * L], [x + Math.cos(a + .12) * r * .95, y + Math.sin(a + .12) * r * .95]], { wash: i % 2 ? KS.sunDk : KS.sun, ink: KS.ink, sw: .8 }); }
  paint(ellPts(x, y, r, r, 24, 2), { wash: KS.sun, fill: KS.sunDk, fillOp: 60, tex: .5, ink: KS.ink, sw: 1.2 });
  paint(ellPts(x - r * .3, y - r * .3, r * .4, r * .28, 14), { wash: '#FFE6A0', washOp: 170, ink: null });
}
function moonDisc(x, y, r, o = {}) {
  boilSeed(o.key || 'cmoon');
  glow(x, y, r * 2.2, '#C8D0FF', .45);
  paint(ellPts(x, y, r, r, 24, 2), { wash: KS.moon, fill: KS.moonDk, fillOp: 50, tex: .5, ink: KS.ink, sw: 1.1 });
  for (const [a, b, c] of [[-.3, -.2, .18], [.25, .3, .12], [.35, -.35, .09]]) paint(ellPts(x + a * r, y + b * r, c * r, c * r, 10), { wash: KS.moonDk, washOp: 150, ink: null });
}
// a planet: col, ring (Saturn), bands (Jupiter)
function planet(x, y, r, o = {}) {
  boilSeed(o.key || 'pl' + Math.round(x));
  if (o.ring) paint(ellPts(x, y, r * 2.0, r * .45, 24, 0, -.25), { wash: '#E8D2A0', washOp: 200, ink: KS.ink, sw: .8 });
  paint(ellPts(x, y, r, r, 20, 1), { wash: o.col, fill: o.dk || o.col, fillOp: 80, tex: .5, ink: KS.ink, sw: 1 });
  if (o.bands) for (const b of [-.4, 0, .35]) inkLine([[x - r * .9, y + b * r], [x + r * .9, y + b * r + 4]], r * .12, o.dk, 'ink', .4);
  paint(ellPts(x - r * .35, y - r * .35, r * .3, r * .22, 10), { wash: '#FFFFFF', washOp: 110, ink: null });
  if (o.ring) paint([[x - r * 2.0, y + r * .5], [x - r * .95, y + r * .1], [x + r * .95, y - .1 * r], [x + r * 2.0, y - r * .5], [x + r * 1.9, y - r * .3], [x, y + r * .2], [x - r * 1.9, y + r * .7]], { wash: '#E8D2A0', washOp: 230, ink: null });
}
// the earth: oceans, green and ochre lands, white clouds, a blue haze
function earthGlobe(x, y, R, o = {}) {
  boilSeed(o.key || 'earth');
  glow(x, y, R * 1.35, '#6EB8FF', .6);
  paint(ellPts(x, y, R, R, 40, 2), { wash: KS.ocean, fill: KS.oceanDk, fillOp: 90, tex: .5, ink: KS.ink, sw: 1.6 });
  const spin = o.spin ?? T * .05;
  boilSeed((o.key || 'earth') + 'land');
  for (const [a, b, rx, ry, c] of [[-.35, -.25, .38, .3, KS.land], [.3, .1, .45, .32, KS.landDk], [-.05, .5, .3, .2, KS.desert], [.45, -.5, .22, .15, KS.land], [-.6, .35, .2, .25, KS.landDk]]) {
    const ax = a + Math.sin(spin) * .08; if (Math.hypot(ax, b) > .82) continue;
    paint(ellPts(x + ax * R, y + b * R, rx * R, ry * R, 16, R * .04), { wash: c, fill: KS.landDk, fillOp: 50, tex: .5, ink: null });
  }
  for (const [a, b] of [[-.25, -.3], [.35, .05], [.0, .45]]) for (let i = 0; i < 3; i++) paint([[x + (a - .05 + i * .05) * R, y + (b + .04) * R], [x + (a + i * .05) * R, y + (b - .06) * R], [x + (a + .05 + i * .05) * R, y + (b + .04) * R]], { wash: KS.snow, ink: KS.ink, sw: .5 });   // little mountains
  boilSeed((o.key || 'earth') + 'cl');
  for (let i = 0; i < 6; i++) { const a = hash(i * 3.3) * 1.4 - .7, b = hash(i * 7.1) * 1.4 - .7; if (Math.hypot(a, b) > .8) continue; paint(ellPts(x + a * R + Math.sin(T * .3 + i) * 8, y + b * R, R * .2, R * .06, 12), { wash: KS.cloud, washOp: 190, ink: null }); }
  paint(ellPts(x - R * .35, y - R * .4, R * .35, R * .2, 16, 0, -.5), { wash: '#FFFFFF', washOp: 60, ink: null });
}

// ---------- Gokul by the Yamuna (world space, x -200..1300, y 300..2200) ----------
function gokulSet(t, o = {}) {
  kGrad(['#F2C48A', '#F7D9A6', '#FBEACB'], -900, -1400, 2000, 900, 'gsky');
  boilSeed('gfar');
  paint([[-900, 900], [-400, 800], [100, 760], [380, 840], [700, 720], [1050, 830], [1500, 760], [2000, 840], [2000, 1100], [-900, 1100]], { fill: '#A8B87A', fillOp: 220, bleed: .1, tex: .4, ink: null, curv: .3 });
  paint(rectPts(-900, 880, 2900, 2600), { wash: '#9CC27A', fill: '#7EA85E', fillOp: 60, tex: .5, ink: null });
  boilSeed('gyamuna');
  const R = []; for (let i = 0; i <= 10; i++) { const k = i / 10; R.push([lerp(-900, 2000, k), 1700 + Math.sin(k * 5 + .5) * 90]); }
  paint(ribbon(R, 210, 260), { wash: KS.yamuna, fill: '#2A3E80', fillOp: 70, tex: .5, ink: KS.ink, sw: 1.2 });
  for (let i = 0; i < 9; i++) { const x = -300 + i * 200 + Math.sin(t + i) * 20, y = 1700 + Math.sin(i * 1.7) * 60; inkLine([[x, y], [x + 70, y - 6]], 2, KS.yamunaLt, 'inkfine', .3); }
  // trees
  boilSeed('gtrees');
  for (let i = 0; i < 8; i++) { const x = -300 + i * 230 + hash(i * 2.2) * 80, y = 980 + hash(i * 3.3) * 120; inkLine([[x, y], [x, y + 90]], 6, KS.trunk, 'ink', 0); paint(ellPts(x, y - 30, 80, 66, 16, 6), { wash: i % 2 ? KS.leaf : KS.leafDk, fill: KS.leafDk, fillOp: 60, tex: .5, ink: KS.ink, sw: .8 }); }
  // huts: mud walls, conical thatch; the middle one is theirs
  boilSeed('ghuts');
  for (let i = 0; i < 7; i++) {
    const x = -200 + i * 240 + (i % 2) * 40, y = 1300 + (i % 3) * 70, s = i === 3 ? 1.25 : .9 + hash(i) * .2;
    paint(rectPts(x - 80 * s, y - 90 * s, 160 * s, 90 * s), { wash: KS.hut, fill: KS.wallDk, fillOp: 60, tex: .5, ink: KS.ink, sw: 1 });
    paint([[x - 110 * s, y - 80 * s], [x, y - 200 * s], [x + 110 * s, y - 80 * s]], { wash: KS.thatch, fill: KS.thatchDk, fillOp: 60, tex: .6, ink: KS.ink, sw: 1 });
    paint(rectPts(x - 20 * s, y - 55 * s, 40 * s, 55 * s), { wash: KS.door, ink: null });
  }
  // cows grazing
  boilSeed('gcows');
  for (const [x, y, f] of [[80, 1520, 1], [820, 1500, -1], [1120, 1560, 1]]) {
    const b = Math.sin(t * 2 + x) * 4;
    paint(ellPts(x, y, 48, 26, 14), { wash: KS.cow, fill: KS.cowDk, fillOp: 50, ink: KS.ink, sw: .9 });
    paint(ellPts(x + f * 52, y - 10 + b, 20, 16, 10), { wash: KS.cow, ink: KS.ink, sw: .9 });
    for (const l of [-30, -14, 14, 30]) inkLine([[x + l, y + 20], [x + l, y + 46]], 4, KS.cowDk, 'ink', 0);
  }
}

// ---------- maya: pink-gold sparkles drifting along a curve from (x0, y0) to (x1, y1), k 0..1 ----------
function mayaDust(t, x0, y0, x1, y1, k, key = 'maya') {
  if (k <= 0 || k >= 1) return;
  boilSeed(key);
  for (let i = 0; i < 26; i++) {
    const q = clamp(k * 1.6 - hash(i * 2.3) * .6), x = lerp(x0, x1, q) + Math.sin(q * 9 + i) * 50, y = lerp(y0, y1, q) - Math.sin(q * Math.PI) * 160 + Math.cos(q * 7 + i) * 30;
    if (q <= 0 || q >= 1) continue;
    const a = Math.sin(q * Math.PI), r = (6 + hash(i * 5.5) * 9) * a;
    glow(x, y, r * 4, i % 2 ? '#FFC8E8' : '#FFE6A0', .5 * a);
    paint(i % 3 ? starPts(x, y, r * 1.8, .35, 4) : heartPts(x, y, r * 1.2), { wash: i % 2 ? KS.pink : '#FFE6A0', ink: null });
  }
}

// a finger pointing up from a parvati() hand (the hook is upright at the hand), wagging by a (radians)
function wagFinger(u, sw, a, col) {
  push(); rotate(a);
  paint(U([[-.22, -.2], [-.2, -1.3], [0, -1.5], [.2, -1.3], [.22, -.2]], u), { wash: col, ink: '#4A2530', sw: sw * .6, curv: .5 });
  pop();
}

// ---------- the follow card ----------
function followCard(t, C) {
  boilSeed('cardbg');
  paint(rectPts(-60, -60, W + 120, H + 120), { wash: KS.rkPeach, ink: null });
  boilSeed('cardpetals');
  for (let i = 0; i < 9; i++) {
    const x = 60 + hash(i * 3.3) * 960 + 30 * Math.sin(t * .9 + i), y = frac(hash(i * 7.1) + t * (.035 + .02 * hash(i))) * (H + 80) - 40, r = t * .8 + i;
    paint([[x + Math.cos(r) * 15, y + Math.sin(r) * 15], [x + Math.cos(r + 1.6) * 7, y + Math.sin(r + 1.6) * 7], [x - Math.cos(r) * 15, y - Math.sin(r) * 15], [x + Math.cos(r - 1.6) * 7, y + Math.sin(r - 1.6) * 7]], { wash: i % 2 ? KS.saffron : '#F4A6B8', washOp: 200, ink: null, curv: .5 });
  }
  const X = 470, pk = t0 => Math.max(0, t - t0) * 5;
  if (PICS.logo) picture(PICS.logo, X, 500, 160, 160, { pop: pk(C.card) });
  letter('Stories of our gods,', X, 640, 60, KS.teal, { screen: true, font: '64px Marcellus', ink: false, pop: pk(C.card + .1), maxW: 860 });
  letter('for little ones', X, 708, 60, KS.teal, { screen: true, font: '64px Marcellus', ink: false, pop: pk(C.card + .2), maxW: 860 });
  if (C.baby) C.baby();
  if (C.next && t > C.card + .5) { letter(C.next[0], X, 1170, 46, KS.rkOrange, { screen: true, font: '700 46px Poppins', ink: false, maxW: 860, pop: pk(C.card + .5) }); letter(C.next[1], X, 1226, 46, KS.teal, { screen: true, font: '700 46px Poppins', ink: false, maxW: 860, pop: pk(C.card + .6) }); }
  if (t > C.follow) letter('Follow @therishikatha', X, 1330, 64, KS.rkOrange, { screen: true, font: '700 64px Poppins', ink: false, maxW: 880, pop: pk(C.follow) });
  if (t > C.pill) {
    const k = backOut(clamp(pk(C.pill))) * (1 + .03 * pulse(t, 4));
    boilSeed('pill');
    push(); translate(X, 1435); scale(k); paint(rrPts(-230, -46, 460, 92, 46), { wash: KS.teal, ink: null }); pop();
    letter('rishikatha.com', X, 1437, 50, KS.cream, { screen: true, font: '700 52px Poppins', ink: false, pop: pk(C.pill) });
  }
}
