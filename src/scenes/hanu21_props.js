// hanu21_props.js: sets and props for hanu21.js (ad 90, Hanuman Part 2.1, "8 BOONS. 8 SIDDHIS. 9 NIDHIS."). Loaded
// after src/hanuman_series.js, src/ramayan_sets.js, hanu2_props.js (H2, BOON_COL, boonIcon, h2Stage, h2Sky, h2Bolt,
// h2Blade, h2WindLines) and hanu4_props.js (H4, h4Sky, h4Wall, h4Grove), which are Parts 2 and 4's, copied onto this
// branch. Pure functions of their arguments (and T for boil). Sets stay inside x -300..1380.
//   H21, SID_COL, NID_COL                       the palette; the siddhis' violet, the nidhis' greens
//   siddhiIcon(i, …), nidhiIcon(i, …)           the eight siddhi icons, the nine nidhi icons
//   slotRow(n, y, iconFn, st, a, o)             a row of n numbered slots (screen space), like Part 2's boonSlots
//   h21Sea, h21Mount                             sets: the open sea by day (Surasa), Mount Arishta over the sea
//   h21Surasa, h21Cat, h21Feather, h21Laddoo, h21Badge, h21Shield     props
const H21 = {
  ink: '#2B2233', cream: '#FFF5E2', gold: '#F5C542', violet: '#8E6AE0', violetLt: '#C8B4FF', violetDk: '#5A3EA8',
  green: '#3FB67A', greenLt: '#A8F0C8', greenDk: '#1E7A4E',
  skyHi: '#7EC0EE', skyLo: '#FFE6BA', sea: '#2E86C8', seaDk: '#1E5A94', seaLt: '#8ED0F6', foam: '#F2FAFF',
  naga: '#4E9A5A', nagaDk: '#2E6A3A', nagaLt: '#8CCB7A', belly: '#E8D890', mouth: '#7A1E2E', mouthDk: '#4A0E1A', fang: '#FFFDF2',
  rock: '#A89482', rockDk: '#74624E', rockLt: '#CDBBA4', grass: '#7EA85A', grassDk: '#5A8040',
};
const SID_COL = ['#F28AC8', '#FF9A3A', '#7E8AA6', '#9ED8F2', '#FFD24A', '#F2557A', '#F5C542', '#8E6AE0'];
const NID_COL = ['#F28AB0', '#E2457A', '#FFF3E0', '#3FB6A8', '#5EA85A', '#A884F2', '#FFFFFF', '#3E6AE0', '#F5C542'];

// ---------- icons ----------
// the eight siddhis (popular order): anima (tiny: arrows in), mahima (huge: arrows out), garima (a weight), laghima
// (a feather), prapti (a hand reaching a star), prakamya (a wish star), ishitva (a crown), vashitva (a magnet)
function siddhiIcon(i, x, y, s, grey = 0) {
  const c = col => mixCol(col, '#A8A2AE', grey * .85), INK = mixCol(H21.ink, '#7E7886', grey * .6), sw = clamp(s / 34, .5, 1.5);
  boilSeed('sicon' + i);
  const arrow = (a, r0, r1, col) => { const ca = Math.cos(a), sa = Math.sin(a), px = -sa, py = ca, tip = [x + ca * r1 * s, y + sa * r1 * s], b = [x + ca * (r1 - (r1 > r0 ? .32 : -.32)) * s, y + sa * (r1 - (r1 > r0 ? .32 : -.32)) * s];
    inkLine([[x + ca * r0 * s, y + sa * r0 * s], b], sw * 2.4, c(col), 'ink', 0);
    paint([tip, [b[0] + px * .2 * s, b[1] + py * .2 * s], [b[0] - px * .2 * s, b[1] - py * .2 * s]], { wash: c(col), ink: INK, sw: sw * .6 }); };
  if (i === 0) { for (let k = 0; k < 4; k++) arrow(k * Math.PI / 2 + Math.PI / 4, 1.0, .42, SID_COL[0]); paint(ellPts(x, y, s * .16, s * .16, 10), { wash: c(SID_COL[0]), ink: INK, sw }); }
  else if (i === 1) { paint(ellPts(x, y, s * .42, s * .42, 14), { wash: c(SID_COL[1]), ink: INK, sw }); for (let k = 0; k < 4; k++) arrow(k * Math.PI / 2 + Math.PI / 4, .5, 1.05, SID_COL[1]); }
  else if (i === 2) {
    paint([[x - s * .78, y + s * .78], [x + s * .78, y + s * .78], [x + s * .52, y - s * .3], [x - s * .52, y - s * .3]], { wash: c('#7E8AA6'), fill: c('#4E5A76'), fillOp: 50, ink: INK, sw, curv: .1 });
    inkLine([[x - s * .3, y - s * .3], [x - s * .26, y - s * .8], [x + s * .26, y - s * .8], [x + s * .3, y - s * .3]], sw * 2.6, c('#4E5A76'), 'ink', .5);
    paint(rectPts(x - s * .4, y + s * .2, s * .8, s * .12), { wash: c('#B8C0CC'), ink: null });
  } else if (i === 3) h21Feather(x, y, s * 1.05, -.6, 'sif', c('#9ED8F2'), INK);
  else if (i === 4) {
    paint(starPts(x + s * .32, y - s * .5, s * .44, .42, 5), { wash: c('#FFD24A'), ink: INK, sw });
    paint(ribbon([[x - s * .6, y + s * 1.0], [x - s * .22, y + s * .2]], s * .32, s * .3), { wash: c('#E8A86A'), ink: INK, sw: sw * .8 });
    paint(ellPts(x - s * .14, y + s * .06, s * .3, s * .26, 12), { wash: c('#E8A86A'), ink: INK, sw: sw * .8 });
    for (let k = 0; k < 3; k++) paint(ellPts(x - s * .05 + k * s * .12, y - s * .2 + k * s * .04, s * .07, s * .16, 8, 0, .5), { wash: c('#E8A86A'), ink: INK, sw: sw * .5 });
  } else if (i === 5) {
    for (let k = 0; k < 3; k++) inkLine([[x - s * .9 + k * s * .1, y + s * .7 - k * s * .26], [x - s * .2, y + s * .1 - k * s * .1]], sw * 2, c('#FFE69A'), 'inkfine', 0);
    paint(starPts(x + s * .22, y - s * .22, s * .66, .45, 5), { wash: c('#F2557A'), ink: INK, sw });
    paint(ellPts(x + s * .1, y - s * .36, s * .1, s * .08, 8), { wash: '#FFFFFF', washOp: 200 * (1 - grey), ink: null });
  } else if (i === 6) {
    paint([[x - s * .8, y + s * .5], [x - s * .8, y - s * .3], [x - s * .4, y + s * .05], [x, y - s * .7], [x + s * .4, y + s * .05], [x + s * .8, y - s * .3], [x + s * .8, y + s * .5]], { wash: c('#F5C542'), fill: c('#C8922A'), fillOp: 40, ink: INK, sw });
    paint(ellPts(x, y + s * .2, s * .14, s * .14, 8), { wash: c('#D2283A'), ink: INK, sw: sw * .6 });
  } else {
    const P = []; for (let k = 0; k <= 12; k++) { const a = Math.PI + k / 12 * Math.PI; P.push([x + Math.cos(a) * s * .7, y + Math.sin(a) * s * .7]); }
    inkLine(P, s * .42, c('#E2453A'), 'ink', 0);
    for (const d of [-1, 1]) { paint(rectPts(x + d * s * .7 - s * .21, y - s * .05, s * .42, s * .3), { wash: c('#E2453A'), ink: INK, sw: sw * .6 }); paint(rectPts(x + d * s * .7 - s * .21, y + s * .25, s * .42, s * .3), { wash: c('#E8ECF2'), ink: INK, sw: sw * .6 }); }
    for (let k = 0; k < 3; k++) inkLine([[x - s * .5 + k * s * .5, y + s * .72], [x - s * .5 + k * s * .5, y + s * 1.0]], sw * 1.4, c(SID_COL[7]), 'inkfine', 0);
  }
}
// the nine nidhis (Amarakosha's order): Mahapadma, Padma, Shankha, Makara, Kachchhapa, Mukunda, Kunda, Nila, Kharva
function nidhiIcon(i, x, y, s, grey = 0) {
  const c = col => mixCol(col, '#A8A2AE', grey * .85), INK = mixCol(H21.ink, '#7E7886', grey * .6), sw = clamp(s / 34, .5, 1.5);
  boilSeed('nicon' + i);
  const lotus = (big, col, dk) => { const n = big ? 7 : 5, sp = big ? 1.25 : 1.0; for (let k = 0; k < n; k++) { const a = -Math.PI / 2 + (k - (n - 1) / 2) * .42; push(); translate(x, y + s * .55); rotate(a + Math.PI / 2); paint([[0, 0], [s * .3 * sp, -s * .55 * sp], [0, -s * 1.2 * sp], [-s * .3 * sp, -s * .55 * sp]], { wash: c(k === (n - 1) / 2 ? col : dk), ink: INK, sw: sw * .7, curv: .5 }); pop(); }
    if (big) paint(ellPts(x, y + s * .5, s * .22, s * .1, 8), { wash: c('#F5C542'), ink: INK, sw: sw * .5 }); };
  const gem = (col) => { paint([[x - s * .7, y - s * .2], [x - s * .35, y - s * .65], [x + s * .35, y - s * .65], [x + s * .7, y - s * .2], [x, y + s * .8]], { wash: c(col), fill: c(mixCol(col, '#000000', .3)), fillOp: 50, ink: INK, sw });
    inkLine([[x - s * .7, y - s * .2], [x + s * .7, y - s * .2]], sw, INK, 'inkfine', 0); inkLine([[x - s * .3, y - s * .2], [x, y + s * .8], [x + s * .3, y - s * .2]], sw * .7, INK, 'inkfine', 0);
    paint(ellPts(x - s * .3, y - s * .4, s * .12, s * .08, 8), { wash: '#FFFFFF', washOp: 200 * (1 - grey), ink: null }); };
  if (i === 0) lotus(true, '#F28AB0', '#E2457A');
  else if (i === 1) lotus(false, '#FFC8DC', '#F28AB0');
  else if (i === 2) {
    paint([[x - s * .8, y + s * .1], [x - s * .4, y - s * .62], [x + s * .3, y - s * .7], [x + s * .85, y - s * .2], [x + s * .6, y + s * .5], [x - s * .1, y + s * .72]], { wash: c('#FFF3E0'), fill: c('#E8CDA8'), fillOp: 50, ink: INK, sw, curv: .5 });
    inkLine([[x - s * .5, y + s * .1], [x, y - s * .3], [x + s * .5, y - s * .1]], sw * 1.1, c('#C8A070'), 'inkfine', .5);
    paint(ellPts(x - s * .78, y + s * .1, s * .14, s * .2, 8), { wash: c('#F2A0A0'), ink: INK, sw: sw * .6 });
  } else if (i === 3) {
    paint([[x - s * .9, y], [x - s * .4, y - s * .45], [x + s * .4, y - s * .38], [x + s * .7, y], [x + s * .4, y + s * .38], [x - s * .4, y + s * .4]], { wash: c('#3FB6A8'), fill: c('#1E7A70'), fillOp: 50, ink: INK, sw, curv: .4 });
    paint([[x + s * .62, y], [x + s * 1.0, y - s * .45], [x + s * .9, y], [x + s * 1.0, y + s * .45]], { wash: c('#3FB6A8'), ink: INK, sw: sw * .8 });
    paint([[x - s * .9, y], [x - s * 1.1, y - s * .5], [x - s * .62, y - s * .32]], { wash: c('#1E7A70'), ink: INK, sw: sw * .7 });
    paint(ellPts(x - s * .5, y - s * .12, s * .09, s * .09, 8), { wash: c(H21.ink), ink: null });
  } else if (i === 4) {
    for (const [dx, dy] of [[-.6, .45], [.6, .45], [-.45, -.35], [.45, -.35]]) paint(ellPts(x + dx * s, y + dy * s, s * .2, s * .16, 8), { wash: c('#8CC870'), ink: INK, sw: sw * .6 });
    paint(ellPts(x + s * .92, y, s * .24, s * .2, 10), { wash: c('#8CC870'), ink: INK, sw: sw * .7 });
    paint(ellPts(x, y, s * .74, s * .56, 16), { wash: c('#5EA85A'), fill: c('#3A7A3E'), fillOp: 50, ink: INK, sw });
    for (let k = -1; k <= 1; k++) paint(ellPts(x + k * s * .34, y - s * .05, s * .16, s * .2, 6), { wash: c('#9AD288'), washOp: 200, ink: null });
  } else if (i === 5) gem('#A884F2');
  else if (i === 6) { for (let k = 0; k < 6; k++) { const a = k / 6 * TAU; paint(ellPts(x + Math.cos(a) * s * .45, y + Math.sin(a) * s * .45, s * .34, s * .2, 10, 0, a), { wash: c('#FFFFFF'), ink: INK, sw: sw * .6 }); } paint(ellPts(x, y, s * .2, s * .2, 8), { wash: c('#F5C542'), ink: INK, sw: sw * .5 }); }
  else if (i === 7) gem('#3E6AE0');
  else gem('#F5C542');
}
// A row of n numbered slots (screen space: call it after camEnd()). st(i) → null (empty) or { k: 0..1 pop, grey,
// hop }. o: { r (radius), x0, dx, col (the number colour when lit), ring (the slot's fill) }
function slotRow(n, y, iconFn, st, a = 1, o = {}) {
  if (a <= 0) return;
  const r = o.r ?? 44, dx = o.dx ?? 108, x0 = o.x0 ?? 108, col = o.col ?? H21.gold, ring = o.ring ?? '#FFF5E2';
  for (let i = 0; i < n; i++) {
    const x = x0 + i * dx, s = st(i), k = s ? backOut(clamp(s.k)) : 0, hop = s ? (s.hop || 0) : 0, grey = s ? (s.grey || 0) : 0;
    boilSeed('srow' + n + i);
    paint(ellPts(x, y - hop, r, r, 22), { wash: s ? mixCol(ring, '#D2CCD6', grey * .7) : '#FFFFFF', washOp: (s ? 255 : 110) * a, ink: s ? H21.ink : null, sw: 1.2 });
    if (!s) inkLine([...ellPts(x, y, r, r, 22), ellPts(x, y, r, r, 22)[0]], 1.2, '#FFFFFF', 'inkfine', .5);
    if (s && k > 0) { push(); translate(x, y - hop); scale(k); translate(-x, -y + hop); iconFn(i, x, y - hop, r * .6, grey); pop(); }
    letter(String(i + 1), x, y + r + 26, r * .76, s ? col : '#FFFFFF', { screen: true, stroke: H21.ink, sw: .2, ink: false, rot: 0, alpha: a * (s ? 1 : .75) });
  }
}

// ---------- sets ----------
// the open sea by day, the horizon at hy; the swell rolls
function h21Sea(t, key = 'sea', hy = 1500) {
  boilSeed(key + 'sky');
  paint(rectPts(-300, -600, W + 600, hy + 700), { wash: H21.skyHi, ink: null });
  paint(ellPts(540, hy - 200, 1100, 600, 26), { fill: H21.skyLo, fillOp: 220, bleed: .3, tex: .4, ink: null });
  for (let i = 0; i < 3; i++) cloudPuff(100 + i * 420 + 20 * Math.sin(t * .4 + i), 820 + 120 * hash(i * 3.3), 120, key + 'c' + i, 235, '#FFFDF6', '#DCE6F2');
  boilSeed(key + 'sea');
  paint(rectPts(-300, hy, W + 600, 1200), { wash: H21.sea, fill: H21.seaDk, fillOp: 50, tex: .4, ink: null });
  inkLine([[-300, hy], [1380, hy]], 1.2, H21.seaLt, 'ink', 0);
  for (let i = 0; i < 9; i++) { const y = hy + 60 + i * 50, x = frac(hash(i * 2.7) + t * (.03 + .02 * hash(i))) * 1500 - 200; inkLine([[x, y], [x + 60, y - 10], [x + 120, y]], 2, H21.seaLt, 'inkfine', .5); }
}
// Mount Arishta over the sea (5.56): the peak's top at (px, py) before it sinks; sink 0..1 lowers it into the ground
// (it ends level with the earth, 56.33); the ground line runs y 1720
function h21Mount(t, sink = 0, key = 'mt', px = 540, py = 1080) {
  boilSeed(key + 'sky');
  paint(rectPts(-300, -600, W + 600, 2400), { wash: H21.skyHi, ink: null });
  paint(ellPts(540, 1400, 1100, 700, 26), { fill: H21.skyLo, fillOp: 220, bleed: .3, tex: .4, ink: null });
  for (let i = 0; i < 3; i++) cloudPuff(140 + i * 380 + 16 * Math.sin(t * .4 + i), 760 + 110 * hash(i * 2.2), 110, key + 'c' + i, 235, '#FFFDF6', '#DCE6F2');
  boilSeed(key + 'sea');
  paint(rectPts(-300, 1500, W + 600, 400), { wash: H21.sea, ink: null });
  for (let i = 0; i < 5; i++) inkLine([[-200 + i * 300, 1540 + (i % 2) * 40], [-120 + i * 300, 1530 + (i % 2) * 40]], 2, H21.seaLt, 'inkfine', .4);
  // the mountain, pushed down by sink
  const dy = (1720 - py - 60) * ease(sink) + (sink > 0 && sink < 1 ? 6 * Math.sin(t * 60) : 0);
  boilSeed(key + 'peak');
  paint([[px - 520, 1760 + dy], [px - 300, 1380 + dy], [px - 120, py + 90 + dy], [px, py + dy], [px + 140, py + 110 + dy], [px + 320, 1360 + dy], [px + 540, 1760 + dy]], { wash: H21.rock, fill: H21.rockDk, fillOp: 55, tex: .6, ink: H21.ink, sw: 1.3, curv: .25 });
  paint([[px - 140, py + 120 + dy], [px, py + dy], [px + 150, py + 125 + dy], [px + 60, py + 150 + dy], [px - 40, py + 135 + dy]], { wash: H21.grass, ink: null, curv: .3 });
  for (let i = 0; i < 5; i++) inkLine([[px - 200 + i * 100, py + 260 + (i % 2) * 70 + dy], [px - 180 + i * 100, py + 340 + (i % 2) * 60 + dy]], 1.1, H21.rockDk, 'inkfine', .3);
  // the ground in front, over the sunk part
  boilSeed(key + 'gr');
  paint([[-300, 1720], [200, 1712], [540, 1716], [900, 1710], [1380, 1722], [1380, 2400], [-300, 2400]], { wash: H21.grass, fill: H21.grassDk, fillOp: 50, tex: .5, ink: H21.ink, sw: 1.1, curv: .3 });
  for (let i = 0; i < 6; i++) inkLine([[60 + i * 190, 1780 + (i % 2) * 40], [80 + i * 190, 1740 + (i % 2) * 40]], 1.4, H21.grassDk, 'inkfine', .3);
}

// ---------- props ----------
// Surasa, mother of the nagas (5.1.145): a giant serpent head rising from the sea, its neck from (x, y) up to the head
// at about (x, y - s * 2.2); open 0..1 opens the jaw (the mouth widens as it grows, 1.160–166); o: { smile, look,
// blink, key }
function h21Surasa(x, y, s, open, t, o = {}) {
  const key = o.key || 'sur';
  boilSeed(key + 'neck');
  const sw = Math.sin(t * 1.4) * s * .06, hx = x + sw, hy = y - s * 2.2;
  paint(ribbon([[x + s * .2, y + s * .3], [x + s * .1 + sw * .5, y - s * .9], [hx, hy + s * .4]], s * 1.15, s * .8), { wash: H21.naga, fill: H21.nagaDk, fillOp: 50, tex: .5, ink: H21.ink, sw: 1.4 });
  paint(ribbon([[x - s * .15, y + s * .3], [x - s * .2 + sw * .5, y - s * .9], [hx - s * .3, hy + s * .4]], s * .45, s * .3), { wash: H21.belly, ink: null });
  for (let i = 0; i < 6; i++) inkLine([[x - s * .48 + sw * i * .1, y - i * s * .36], [x + .08 * s + sw * i * .1, y - i * s * .36 - s * .05]], 1.1, '#B8A860', 'inkfine', .3);
  // the hood behind the head
  boilSeed(key + 'hood');
  paint(ellPts(hx, hy - s * .1, s * 1.35, s * 1.15, 26), { wash: H21.naga, fill: H21.nagaDk, fillOp: 60, tex: .5, ink: H21.ink, sw: 1.3 });
  for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i - 2) * .55; paint(ellPts(hx + Math.cos(a) * s * .95, hy - s * .1 + Math.sin(a) * s * .8, s * .14, s * .1, 8), { wash: H21.nagaLt, ink: null }); }
  // the jaws: the upper head tilts up, the lower jaw drops, by open
  const jo = clamp(open), m = s * (.15 + 1.1 * jo), wJ = s * (.95 + .35 * jo);
  boilSeed(key + 'mouth');
  if (jo > .02) paint(ellPts(hx, hy + s * .2 + m * .2, wJ * .92, m * .6 + s * .05, 22), { wash: H21.mouth, fill: H21.mouthDk, fillOp: 60, ink: H21.ink, sw: 1.1 });
  if (jo > .02) { for (let i = 0; i < 2; i++) { const fx = hx + (i ? 1 : -1) * wJ * .45; paint([[fx - s * .1, hy - s * .02], [fx + s * .1, hy - s * .02], [fx, hy + s * .1 + m * .25]], { wash: H21.fang, ink: H21.ink, sw: .8 }); }
    paint(ribbon([[hx, hy + s * .2 + m * .5], [hx + s * .1, hy + s * .1 + m * .35], [hx - s * .05, hy + m * .25]], s * .14, s * .05), { wash: '#E2557A', ink: H21.ink, sw: .7 }); }
  // the lower jaw
  boilSeed(key + 'low');
  paint([[hx - wJ, hy + s * .1], [hx - wJ * .6, hy + s * .2 + m * .85], [hx, hy + s * .3 + m], [hx + wJ * .6, hy + s * .2 + m * .85], [hx + wJ, hy + s * .1], [hx + wJ * .8, hy + s * .2 + m * .6], [hx, hy + s * .2 + m * .75], [hx - wJ * .8, hy + s * .2 + m * .6]], { wash: H21.belly, fill: '#C8B860', fillOp: 40, ink: H21.ink, sw: 1.1, curv: .4 });
  // the upper head
  boilSeed(key + 'head');
  paint([[hx - wJ * 1.04, hy + s * .12], [hx - s * .9, hy - s * .6], [hx, hy - s * .95], [hx + s * .9, hy - s * .6], [hx + wJ * 1.04, hy + s * .12], [hx + wJ * .5, hy + s * .02 + (jo < .05 ? s * .12 : 0)], [hx, hy + (jo < .05 ? s * .16 : 0)], [hx - wJ * .5, hy + s * .02 + (jo < .05 ? s * .12 : 0)]], { wash: H21.naga, fill: H21.nagaDk, fillOp: 45, tex: .5, ink: H21.ink, sw: 1.3, curv: .45 });
  paint(ellPts(hx - s * .2, hy - s * .7, s * .3, s * .1, 10, 0, -.2), { wash: H21.nagaLt, washOp: 180, ink: null });
  if (o.smile && jo < .05) inkLine([[hx - wJ * .6, hy + s * .05], [hx, hy + s * .2], [hx + wJ * .6, hy + s * .05]], 2.4, H21.ink, 'ink', .6);
  // the eyes
  for (const d of [-1, 1]) {
    const ex = hx + d * s * .48, ey = hy - s * .45;
    if (o.blink || o.happy) inkLine([[ex - s * .14, ey + (o.happy ? s * .03 : 0)], [ex, ey - (o.happy ? s * .08 : 0)], [ex + s * .14, ey + (o.happy ? s * .03 : 0)]], 2.6, H21.ink, 'ink', .5);
    else { paint(ellPts(ex, ey, s * .17, s * .2, 12), { wash: '#FFE24A', ink: H21.ink, sw: 1 }); paint(ellPts(ex + (o.look || 0) * s * .05, ey, s * .05, s * .15, 8), { wash: H21.ink, ink: null }); }
  }
}
// a sitting cat, side view facing left, its feet at (x, y), s tall; look -1..1 turns its head; o.q pops a "?"
function h21Cat(x, y, s, t, key = 'cat', look = 0) {
  boilSeed(key);
  const C = '#F2A24A', D = '#C8762A';
  paint(ribbon([[x + s * .3, y - s * .05], [x + s * .7, y - s * .1], [x + s * .78, y - s * .45 + .05 * s * Math.sin(t * 3)], [x + s * .62, y - s * .62]], s * .12, s * .08), { wash: C, ink: H21.ink, sw: .8 });
  paint(ellPts(x + s * .1, y - s * .32, s * .34, s * .34, 18), { wash: C, fill: D, fillOp: 40, tex: .4, ink: H21.ink, sw: 1 });
  paint(ellPts(x - s * .1, y - s * .05, s * .14, s * .06, 8), { wash: C, ink: H21.ink, sw: .7 });
  const hx = x - s * .12 + look * s * .05, hy = y - s * .72;
  for (const d of [-1, 1]) paint([[hx + d * s * .26, hy - s * .1], [hx + d * s * .2, hy - s * .38], [hx + d * s * .02, hy - s * .18]], { wash: C, ink: H21.ink, sw: .8 });
  paint(ellPts(hx, hy, s * .28, s * .24, 16), { wash: C, ink: H21.ink, sw: 1 });
  for (let i = 0; i < 3; i++) inkLine([[hx - s * .1 + i * s * .08, hy - s * .22], [hx - s * .1 + i * s * .08, hy - s * .14]], .8, D, 'inkfine', 0);
  for (const d of [-1, 1]) { paint(ellPts(hx + d * s * .1 + look * s * .03, hy, s * .055, s * .075, 8), { wash: H21.ink, ink: null }); paint(ellPts(hx + d * s * .1 + look * s * .03 - s * .015, hy - s * .025, s * .02, s * .02, 6), { wash: '#FFFFFF', ink: null }); }
  paint([[hx - s * .03 + look * s * .03, hy + s * .07], [hx + s * .03 + look * s * .03, hy + s * .07], [hx + look * s * .03, hy + s * .11]], { wash: '#F28A9A', ink: null });
  for (const d of [-1, 1]) inkLine([[hx + d * s * .12, hy + s * .1], [hx + d * s * .34, hy + s * .06]], .7, H21.ink, 'inkfine', 0);
}
// a white feather, centred at (x, y), s long, rotated rot
function h21Feather(x, y, s, rot = 0, key = 'fe', col = '#FFFFFF', ink = H21.ink) {
  boilSeed(key); push(); translate(x, y); rotate(rot);
  paint([[-s, 0], [-s * .6, -s * .26], [s * .2, -s * .32], [s * .9, -s * .08], [s, 0], [s * .9, s * .08], [s * .2, s * .3], [-s * .6, s * .24]], { wash: col, fill: mixCol(col, '#8EA8C8', .4), fillOp: 40, tex: .3, ink, sw: clamp(s / 40, .5, 1.2), curv: .5 });
  inkLine([[-s * 1.25, 0], [s * .92, 0]], clamp(s / 30, .6, 2.2), mixCol(col, '#5A6A84', .6), 'ink', 0);
  for (let i = 0; i < 4; i++) inkLine([[-s * .4 + i * s * .3, 0], [-s * .25 + i * s * .3, (i % 2 ? 1 : -1) * s * .22]], clamp(s / 60, .4, 1), mixCol(col, '#8EA8C8', .6), 'inkfine', 0);
  pop();
}
// a boondi laddoo, centred at (x, y), radius s
function h21Laddoo(x, y, s, key = 'ld') {
  boilSeed(key);
  paint(ellPts(x, y, s, s * .94, 18), { wash: '#F5A52E', fill: '#D27A18', fillOp: 50, tex: .7, ink: H21.ink, sw: 1 });
  for (let i = 0; i < 10; i++) { const a = hash(i * 2.1) * TAU, r = s * .7 * Math.sqrt(hash(i * 3.7)); paint(ellPts(x + Math.cos(a) * r, y + Math.sin(a) * r, s * .12, s * .12, 6), { wash: '#FFC85A', ink: null }); }
}
// a summary badge: a disc with an icon and a big number under it; kind 0 boons (gold), 1 siddhis (violet), 2 nidhis (green)
function h21Badge(x, y, r, kind, k, t, key = 'bg') {
  if (k <= 0) return;
  const cols = [[H21.gold, '#C8922A'], [H21.violet, H21.violetDk], [H21.green, H21.greenDk]][kind];
  push(); translate(x, y); scale(backOut(clamp(k))); translate(-x, -y);
  glow(x, y, r * 2.2, cols[0], .5);
  boilSeed(key);
  paint(ellPts(x, y, r, r, 26), { wash: cols[0], fill: cols[1], fillOp: 40, tex: .4, ink: H21.ink, sw: 1.6 });
  paint(ellPts(x, y, r * .78, r * .78, 24), { wash: '#FFF5E2', ink: H21.ink, sw: 1 });
  if (kind === 0) h21Shield(x, y - r * .05, r * .5, 1, t, key + 's', true);
  else if (kind === 1) siddhiIcon(1, x, y, r * .45);
  else nidhiIcon(0, x, y - r * .1, r * .5);
  letter(kind === 2 ? '9' : '8', x + r * .78, y + r * .62, r * .9, '#FFFFFF', { stroke: H21.ink, sw: .25, ink: false, rot: -.06 });
  pop();
}
// a shield: as a badge icon (icon = true) a gold heater shield; otherwise a gold bubble of light round (x, y), r wide
function h21Shield(x, y, r, k, t, key = 'sh', icon = false) {
  boilSeed(key);
  if (icon) {
    paint([[x - r * .85, y - r * .8], [x + r * .85, y - r * .8], [x + r * .8, y + r * .1], [x, y + r], [x - r * .8, y + r * .1]], { wash: H21.gold, fill: '#C8922A', fillOp: 45, ink: H21.ink, sw: 1.2, curv: .35 });
    paint(starPts(x, y - r * .05, r * .38, .45, 5), { wash: '#FFFFFF', washOp: 230, ink: null });
    return;
  }
  if (k <= 0) return;
  glow(x, y, r * 1.2, '#FFE08A', .35 * k);
  paint(ellPts(x, y, r, r * .96, 30), { wash: '#FFF2B8', washOp: 70 * k, ink: null });
  inkLine([...ellPts(x, y, r, r * .96, 30), ellPts(x, y, r, r * .96, 30)[0]], 3, '#FFD24A', 'ink', .2);
  paint(ellPts(x - r * .45, y - r * .5, r * .22, r * .1, 12, 0, -.7), { wash: '#FFFFFF', washOp: 170 * k, ink: null });
}
