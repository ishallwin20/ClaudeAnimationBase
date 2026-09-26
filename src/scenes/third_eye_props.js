// third_eye_props.js: the set and props for "The Third Eye Alarm Clock" (src/scenes/third_eye.js). Loaded before it;
// everything here is a pure function of its arguments (and T for boil), shared by the shots.
//
//   STAGE                           where everyone stands, in world pixels
//   sky(S) / peaks(S) / ledge(S)    Kailash at dawn. S = { sun 0..1 (the sunrise, blue → gold), red 0..1 (the scare) }
//   sunrise(S, k)                   the sun rising behind the peak (and behind Shiva's head), k 0..1
//   boulder(x, y, s, S)             the rock the boys hide behind
//   trishul(x, y, s, S)             Shiva's trident, planted in the snow
//   damaru(x, y, s, o)              the rattle-drum: o.rot, o.shake (0..1: the beads fly), o.key
//   kulhad(x, y, s, key, o)         a clay cup of chai, (x, y) = the middle of the cup; o.tilt, o.level
//   steam(x, y, s, t, o)            steam rising from a cup; o.to = [x, y] curls it over to a nose, o.k how far it has got
//   clangRing, rattleMarks, rumbleMarks, heartPuff, sweatDrop   painted effect marks
//   eyeIris, whipSmear              transitions
const TE = {
  ink: '#2B2233', cream: '#FFF5E2',
  // sky: before sunrise · sunlit · the scare
  skyTop: ['#2E3770', '#F2B878', '#4A1426'], skyMid: ['#6C64A8', '#FFD69A', '#9A2A30'], skyLow: ['#E8A0A0', '#FFEDC4', '#E0553A'],
  far: ['#8F8CC6', '#E9B99C', '#8A3040'], farSnow: ['#D8D6F0', '#FFE9CF', '#E6A08E'],
  rock: ['#6E73A8', '#B98A7E', '#6A2A36'], snow: ['#E6ECF8', '#FFF4DE', '#F2B8A6'], snowDk: ['#A9B4D8', '#EBC9A4', '#B8606A'],
  ground: ['#DCE3F4', '#FFF1D8', '#EDB0A0'], groundDk: ['#A6B2D6', '#E6C29C', '#B05A64'], stone: ['#7D84B2', '#AE8A80', '#7A3440'],
  sun: '#FFE08A', sunDk: '#F7B545', warm: '#FFB45A',
  wood: '#8A5A3C', woodDk: '#5E3B27', steel: '#DCE3EA', steelDk: '#96A3B6', gold: '#EDB43C', goldDk: '#B67D1C',
  drum: '#C9824A', drumDk: '#8E5028', skin: '#F4E4C4', bead: '#6B3A26', ribbon: '#D2452F',
  clay: '#C8703E', clayDk: '#8E4424', clayLt: '#E39A66', chai: '#A8683A', chaiLt: '#D59A5E', steamC: '#FFF8EC',
};
// where things are (world px). Shiva sits in the middle; the boys come from the left, Parvati from the right.
const STAGE = {
  shX: 650, shY: 1400, shU: 30,
  // the boys, the boulder and the trishul stand nearer the camera than Shiva: lower on screen and bigger
  kX: 190, kY: 1658, kU: 20,     // Kartikeya's spot, in front of the boulder
  gX: 331, gY: 1672, gU: 20,     // Bal Bappa's spot, between his brother and the trishul
  bX: 150, bY: 1680, bS: 165,    // the boulder (bS = its scale: 2.5 bS wide, 1.2 bS tall)
  trX: 405, trY: 1615,           // the trishul
  pX: 905, pY: 1500, pU: 22,     // Parvati's spot
};
// Where Bal Bappa's hand is, in the coordinates he was drawn in (mirrors bal_bappa.js's arm math; ignores rot).
function balHand(x, y, u, o, s) {
  const st = (o.stand || 0) > .5, a0 = s < 0 ? o.aL : o.aR, rest = st ? -1.3 : s < 0 ? -1.75 : -1.4;
  const a = a0 == null ? rest : lerp(rest, a0, clamp((a0 - .2) / .4)), L = st ? 3.3 : 3, sq = (o.sq || 0) + (o.take || 0);
  const hx = s * ((st ? 3.1 : 2.85) + Math.cos(a) * L), hy = -(st ? 2.6 : 0) - 5.9 + -Math.sin(a) * L;
  return [x + ((o.dx || 0) + hx * (o.flip ? -1 : 1)) * u * (1 + sq * .6), y + (o.dy || 0) * u + hy * u * (1 - sq)];
}
// a colour from the three states: before sunrise, sunlit, scared
const tone = (c, S) => mixCol(mixCol(c[0], c[1], S.sun || 0), c[2], S.red || 0);

// Big shapes are unreliable in p5.brush under a zoomed camera (a shape much bigger than the canvas can vanish), so the
// sky's base colour is laid in screen space and the ground is painted in canvas-sized tiles.
function screenWash(col) { push(); resetMatrix(); translate(-W / 2, -H / 2); paint(rectPts(-60, -60, W + 120, H + 120), { wash: col, ink: null }); pop(); }
function sky(S) {
  boilSeed('sky');
  screenWash(tone(TE.skyTop, S));
  paint(rectPts(-500, 380, W + 1000, 900, 30), { fill: tone(TE.skyMid, S), fillOp: 200, bleed: .25, tex: .4, border: .2, ink: null });
  paint(rectPts(-500, 720, W + 1000, 700, 30), { fill: tone(TE.skyLow, S), fillOp: 220, bleed: .25, tex: .4, border: .2, ink: null });
  // a few soft clouds, drifting
  for (let i = 0; i < 4; i++) {
    boilSeed('cloud ' + i);
    const cx = -100 + ((hash(i * 3.3) * 1300 + T * (8 + 6 * i)) % 1400), cy = 180 + i * 150 + 60 * hash(i);
    paint(ellPts(cx, cy, 150 + 80 * hash(i + 4), 32 + 12 * hash(i + 9), 18, 6), { fill: mixCol(tone(TE.skyMid, S), '#FFFFFF', .35), fillOp: 120, bleed: .3, tex: .5, ink: null });
  }
}
function sunrise(S, k) {
  if (k <= 0) return;
  const cx = STAGE.shX, cy = lerp(900, 400, easeOut(k)), r = 110 + 20 * k;
  glow(cx, cy, 900 * k, TE.warm, .9 * k);
  glow(cx, cy, 380 * k, TE.sun, k);
  boilSeed('sun');
  paint(ellPts(cx, cy, r, r, 30, 2), { wash: TE.sun, fill: TE.sunDk, fillOp: 60, bleed: .1, tex: .4, ink: null });
  for (let i = 0; i < 14; i++) {   // rays, turning slowly
    const a = i / 14 * TAU + T * .15, r0 = r * 1.25, r1 = r * (1.9 + .35 * (i % 2)) * (.6 + .4 * k);
    inkLine([[cx + Math.cos(a) * r0, cy + Math.sin(a) * r0], [cx + Math.cos(a) * r1, cy + Math.sin(a) * r1]], 2.2, TE.sunDk, 'ink', 0);
  }
}
function peaks(S) {
  // the far range: pale, low
  boilSeed('far');
  const far = [[-400, 1150], [-200, 900], [0, 980], [150, 820], [330, 960], [480, 900], [900, 860], [1080, 780], [1250, 930], [1500, 880], [1500, 1440], [-400, 1440]];
  paint(far, { wash: tone(TE.far, S), fill: mixCol(tone(TE.far, S), TE.ink, .15), fillOp: 60, tex: .4, ink: null, curv: .2 });
  for (const [a, b] of [[[120, 850], [150, 820], [190, 850]], [[1040, 810], [1080, 780], [1125, 815]]]) paint([a, b, [b[0] + 8, b[1] + 50], [a[0] + 14, a[1] + 26]], { wash: tone(TE.farSnow, S), ink: null });
  // Kailash itself, right behind Shiva: a big snow pyramid with dark rock ridges
  boilSeed('kailash');
  const kx = STAGE.shX, ky = 540, base = 1440;
  const K = [[kx - 560, base], [kx - 330, 820], [kx - 150, 640], [kx, ky], [kx + 160, 650], [kx + 330, 800], [kx + 600, base]];
  paint(K, { wash: tone(TE.snow, S), fill: tone(TE.snowDk, S), fillOp: 90, bleed: .06, tex: .6, border: .5, ink: TE.ink, sw: .9, curv: .1 });
  paint([[kx, ky], [kx + 160, 650], [kx + 330, 800], [kx + 600, base], [kx + 60, base], [kx + 70, 900], [kx + 20, 700]], { fill: tone(TE.snowDk, S), fillOp: 120, bleed: .1, tex: .6, ink: null });   // the shaded face
  for (const [a, b] of [[[kx - 40, 640], [kx - 70, 700]], [[kx + 90, 660], [kx + 130, 720]], [[kx - 210, 760], [kx - 250, 800]], [[kx + 250, 780], [kx + 290, 830]]])
    inkLine([a, [lerp(a[0], b[0], .5) + 6, lerp(a[1], b[1], .5)], b], 1.1, tone(TE.rock, S), 'inkfine', .5);   // a few rock ticks near the top
}
const ledgeTop = x => 1362 + 22 * Math.sin(x * .006) + 14 * Math.sin(x * .013 + 1);
function ledge(S) {
  boilSeed('ledge');
  const xs = [-400, 150, 700, 1250, 1600], g = tone(TE.ground, S), gd = tone(TE.groundDk, S);
  for (let i = 0; i < xs.length - 1; i++) {
    const a = xs[i], b = xs[i + 1] + 8, top = [];
    for (let x = a; x <= b; x += 50) top.push([x, ledgeTop(x)]);
    top.push([b, ledgeTop(b)]);
    paint([...top, [b, 1860], [a, 1860]], { wash: g, ink: null });
    for (const [y0, y1] of [[1850, 2360], [2350, 2860]]) paint(rectPts(a, y0, b - a, y1 - y0), { wash: g, ink: null });
    paint([...top.map(([x, y]) => [x, y + 6]), [b, 1700], [a, 1700]], { fill: gd, fillOp: 50, bleed: .06, tex: .6, border: .5, ink: null });
    inkLine(top, 1, TE.ink, 'ink', .3);
  }
  paint(ellPts(560, 1780, 900, 170, 24, 6), { fill: tone(TE.groundDk, S), fillOp: 90, bleed: .2, tex: .6, ink: null });
  for (let i = 0; i < 9; i++) {   // stones poking through the snow
    boilSeed('stone ' + i);
    const sx = -100 + i * 160 + 60 * hash(i), sy = 1560 + 260 * hash(i * 7.1), r = 22 + 26 * hash(i * 2.3);
    paint(ellPts(sx, sy, r * 1.6, r * .7, 14, 2), { wash: tone(TE.stone, S), ink: TE.ink, sw: .6 });
    paint(ellPts(sx - r * .3, sy - r * .45, r * 1.1, r * .3, 10), { wash: tone(TE.snow, S), ink: null });
  }
}
function boulder(x, y, s, S) {
  boilSeed('boulder');
  const P = pts => pts.map(([a, b]) => [x + a * s, y + b * s]);
  paint(P([[-1.2, 0], [-1.25, -.5], [-1, -.95], [-.4, -1.2], [.3, -1.15], [.95, -.85], [1.25, -.35], [1.2, 0]]), { wash: tone(TE.stone, S), fill: mixCol(tone(TE.stone, S), TE.ink, .3), fillOp: 80, tex: .6, border: .5, ink: TE.ink, sw: 1, curv: .35 });
  paint(P([[-1.05, -.9], [-.4, -1.18], [.3, -1.13], [.85, -.9], [.3, -.95], [-.3, -.88]]), { wash: tone(TE.snow, S), ink: TE.ink, sw: .6, curv: .5 });
  inkLine(P([[.3, -.7], [.5, -.4], [.45, -.15]]), .7, mixCol(tone(TE.stone, S), TE.ink, .4), 'inkfine', .5);
}
// Shiva's trident: (x, y) = where it stands in the snow; s = its height
function trishul(x, y, s, S) {
  boilSeed('trishul');
  paint(ribbon([[x, y], [x, y - s * .78]], s * .025, s * .022), { wash: TE.wood, fill: TE.woodDk, fillOp: 60, tex: .5, ink: TE.ink, sw: .8 });
  const hy = y - s * .78, w = s * .12;
  paint([[x - w, hy - s * .02], [x + w, hy - s * .02], [x + w * .9, hy + s * .02], [x - w * .9, hy + s * .02]], { wash: TE.gold, ink: TE.ink, sw: .7 });
  paint([[x - s * .012, hy], [x + s * .012, hy], [x + s * .02, hy - s * .12], [x, hy - s * .22], [x - s * .02, hy - s * .12]], { wash: TE.steel, fill: TE.steelDk, fillOp: 60, ink: TE.ink, sw: .7 });   // middle prong
  for (const d of [-1, 1]) paint([[x + d * w * .85, hy], [x + d * w * .6, hy], [x + d * w * .7, hy - s * .07], [x + d * w * 1.05, hy - s * .16], [x + d * w * 1.25, hy - s * .1], [x + d * w * 1.1, hy - s * .05]], { wash: TE.steel, fill: TE.steelDk, fillOp: 60, ink: TE.ink, sw: .7, curv: .3 });
  paint(ellPts(x, y - s * .56, s * .03, s * .018, 10), { wash: TE.ribbon, ink: TE.ink, sw: .6 });   // the knot the damaru hangs from
}
// The damaru: two drumheads joined at the waist, beads on strings. (x, y) = its middle; s = its height.
function damaru(x, y, s, o = {}) {
  boilSeed('damaru ' + (o.key || ''));
  push(); translate(x, y); rotate(o.rot || 0);
  const w = s * .5, sh = clamp(o.shake || 0);
  for (const d of [-1, 1]) {   // the beads swing on their strings: behind the drum first
    const a = d * (.5 + sh * 1.3 * Math.sin(T * 38 + d)), L = s * .45;
    const bx = Math.cos(a) * L * d * (d < 0 ? -1 : 1), by = Math.sin(Math.abs(a)) * L * .5 + s * .1;
    inkLine([[0, 0], [d * Math.abs(bx), by]], 1, TE.ink, 'inkfine', 0);
    paint(ellPts(d * Math.abs(bx), by, s * .07, s * .07, 10), { wash: TE.bead, ink: TE.ink, sw: .6 });
  }
  paint([[-w, -s * .5], [w, -s * .5], [s * .07, 0], [-s * .07, 0]], { wash: TE.drum, fill: TE.drumDk, fillOp: 60, tex: .5, ink: TE.ink, sw: 1, curv: .1 });
  paint([[-w, s * .5], [w, s * .5], [s * .07, 0], [-s * .07, 0]], { wash: TE.drum, fill: TE.drumDk, fillOp: 60, tex: .5, ink: TE.ink, sw: 1, curv: .1 });
  for (const d of [-1, 1]) paint(ellPts(0, d * s * .5, w, s * .09, 18), { wash: TE.skin, ink: TE.ink, sw: .9 });   // drumheads
  for (const d of [-1, 1]) for (const k of [-.6, 0, .6]) inkLine([[k * w, d * s * .5], [k * s * .07, 0]], .6, TE.drumDk, 'inkfine', 0);   // lacing
  paint(ellPts(0, 0, s * .12, s * .06, 10), { wash: TE.ribbon, ink: TE.ink, sw: .7 });
  const rb = Math.sin(T * 5) * .2 + sh * Math.sin(T * 30) * .4;   // a ribbon tail from the waist
  paint(ribbon([[0, 0], [s * .1, s * .25], [s * (.05 + rb * .3), s * .55]], s * .08, s * .04), { wash: TE.ribbon, ink: TE.ink, sw: .6 });
  pop();
}
// A kulhad of chai: (x, y) = the middle of the cup; s = its height
function kulhad(x, y, s, key = '', o = {}) {
  boilSeed('kulhad ' + key);
  push(); translate(x, y); rotate(o.tilt || 0);
  const P = pts => pts.map(([a, b]) => [a * s, b * s]), sw = clamp(s / 40, .5, 1.3);
  paint(P([[-.48, -.5], [.48, -.5], [.4, .1], [.3, .5], [-.3, .5], [-.4, .1]]), { wash: TE.clay, fill: TE.clayDk, fillOp: 80, tex: .6, border: .5, ink: TE.ink, sw, curv: .3 });
  paint(P([[-.3, -.35], [-.18, -.35], [-.22, .35], [-.28, .35]]), { wash: TE.clayLt, washOp: 170, ink: null });   // a shine
  paint(ellPts(0, -.5 * s, .48 * s, .12 * s, 16), { wash: TE.clayDk, ink: TE.ink, sw: sw * .8 });
  const lv = o.level ?? 1;
  if (lv > .05) paint(ellPts(0, -.49 * s, .4 * s * lv, .08 * s * lv, 14), { wash: TE.chai, fill: TE.chaiLt, fillOp: 60, ink: null });
  pop();
}
// Steam rising from (x, y). o.to = [x, y]: the wisps curl over to that point (his nose) and the lead one ends in a
// beckoning hook; o.k = how far along they have got (0..1). s = scale (about the cup's height).
function steam(x, y, s, t, o = {}) {
  const k = o.k ?? 0, n = 3;
  for (let i = 0; i < n; i++) {
    boilSeed('steam ' + (o.key || '') + i);
    const pts = [], ph = t * .9 + i * .33;
    if (!o.to || k <= 0) {   // plain steam: three wisps wiggling up and fading
      const h = s * (1.6 + .4 * i);
      for (let j = 0; j <= 8; j++) { const a = j / 8; pts.push([x + (i - 1) * s * .18 + Math.sin((a * 1.6 - ph) * TAU) * s * .18 * a, y - a * h]); }
      paint(ribbon(pts, s * .16, s * .03), { wash: TE.steamC, washOp: 170 * (o.alpha ?? 1), ink: null });
      continue;
    }
    const [tx, ty] = o.to, kk = clamp(k * 1.3 - i * .15);
    for (let j = 0; j <= 12; j++) {
      const a = j / 12 * kk, px = lerp(x + (i - 1) * s * .15, tx, easeIn(a) * .85 + a * .15), py = lerp(y, ty + i * s * .15, easeOut(a)) - s * 1.4 * Math.sin(a * Math.PI) + Math.sin((a * 2.4 - ph) * TAU) * s * .12 * (1 - a);
      pts.push([px, py]);
    }
    if (i === 0 && kk > .6) {   // the beckoning finger: the lead wisp's tip curls
      const [ex, ey] = pts[pts.length - 1], c = clamp((kk - .6) / .4), crl = Math.sin(t * 9) * .5 + .5;
      for (let j = 1; j <= 4; j++) { const a = -Math.PI / 2 + j / 4 * Math.PI * (1 + .6 * crl) * c; pts.push([ex + Math.cos(a) * s * .22 * c + s * .1, ey + (Math.sin(a) + 1) * s * .22 * c]); }
    }
    paint(ribbon(pts, s * .2, s * .08), { wash: TE.steamC, washOp: 210, ink: null });
    inkLine(pts, .6, '#E8C98E', 'inkfine', .5);
  }
}
// ---------- marks ----------
function clangRing(x, y, r, age, key) {   // a clang: expanding jagged rings and spark lines, age since the hit
  if (age < 0 || age > .45) return;
  boilSeed('clang ' + key);
  const k = age / .45, rr = r * (.4 + 1.2 * easeOut(k)), a = 1 - k;
  const P = []; for (let i = 0; i < 16; i++) { const q = i / 16 * TAU, j = i % 2 ? .78 : 1; P.push([x + Math.cos(q) * rr * j, y + Math.sin(q) * rr * j]); }
  inkLine(P.concat([P[0]]), 3 * a + .5, TE.gold, 'ink', 0);
  for (let i = 0; i < 7; i++) { const q = hash(i * 5.1 + key.length) * TAU; inkLine([[x + Math.cos(q) * rr * .9, y + Math.sin(q) * rr * .9], [x + Math.cos(q) * rr * 1.5, y + Math.sin(q) * rr * 1.5]], 2.5 * a + .5, TE.ink, 'ink', 0); }
}
function rattleMarks(x, y, s, t, k, key) {   // little curved zigzags flying off a shaking thing
  if (k <= .02) return;
  for (let i = 0; i < 4; i++) {
    boilSeed('rattle ' + key + i);
    const ph = frac(t * 3 + i / 4), a = (i / 4) * TAU + .4, r = s * (.8 + ph * .9), w = (1 - ph) * 2.2 * k;
    const cx = x + Math.cos(a) * r, cy = y + Math.sin(a) * r * .8, nx = -Math.sin(a), ny = Math.cos(a);
    inkLine([[cx - nx * s * .25, cy - ny * s * .25], [cx + Math.cos(a) * s * .08, cy + Math.sin(a) * s * .08], [cx + nx * s * .25, cy + ny * s * .25]], w, TE.ink, 'ink', 0);
  }
}
function rumbleMarks(x, y, rx, ry, t, k, key) {   // shaking outlines round a thing: for the angry third eye
  if (k <= .02) return;
  for (let i = 0; i < 2; i++) {
    boilSeed('rumble ' + key + i);
    const ph = frac(t * 2.4 + i / 2), r = 1.05 + .6 * ph, w = (1 - ph) * 3 * k;
    for (const s of [-1, 1]) {
      const pts = []; for (let j = 0; j <= 6; j++) { const a = (j / 6 - .5) * 1.2; pts.push([x + s * Math.cos(a) * rx * r + s * 6 * Math.sin(j * 2.4 + t * 30), y + Math.sin(a) * ry * r]); }
      inkLine(pts, w, '#8E1E2A', 'ink', .4);
    }
  }
}
function popBurst(x, y, r, age, key) {   // the POP: gold strokes flying out from a point
  if (age < 0 || age > .5) return;
  boilSeed('pop ' + key);
  const k = easeOut(age / .5), a = 1 - age / .5;
  for (let i = 0; i < 12; i++) { const q = i / 12 * TAU + .2, r0 = r * (.5 + .9 * k), r1 = r0 + r * (.5 + .3 * (i % 2)) * a; inkLine([[x + Math.cos(q) * r0, y + Math.sin(q) * r0], [x + Math.cos(q) * r1, y + Math.sin(q) * r1]], 3.5 * a + .5, TE.sunDk, 'ink', 0); }
}
function heartPuff(x, y, s, age, key) {   // a heart that floats up and fades
  if (age < 0 || age > 1.6) return;
  boilSeed('heart ' + key);
  const k = age / 1.6, r = s * (.5 + .5 * backOut(seg(age, 0, .3))) * (1 - seg(k, .7, 1));
  if (r > 1) paint(heartPts(x + Math.sin(age * 5) * s * .3, y - age * s * 1.8, r), { wash: '#E2476E', ink: TE.ink, sw: .8 });
}

// ---------- transitions ----------
function whipSmear(k, dir = 1, cols = ['#6C64A8', '#DCE3F4', '#8F8CC6']) {
  if (k <= .01) return;
  boilSeed('smear');
  for (let i = 0; i < 16; i++) {
    const y = -40 + i * (H + 80) / 16, hh = (H + 80) / 16 + 30;
    paint(rectPts(-100, y, W + 200, hh, 10), { wash: cols[i % cols.length], washOp: 255 * clamp(k * 1.6 - hash(i) * .5), ink: null });
    if (k > .4) inkLine([[-50, y + hh * .5], [W + 50, y + hh * .5 + jit(10)]], 1.2, mixCol(cols[(i + 1) % cols.length], PAL.cream, .3), 'dry', 0);
  }
}
// Eye-shaped iris: everything outside a vertical almond at (cx, cy) of height h goes to ink. k = 1 open … 0 shut.
function eyeIris(cx, cy, h, k, col = TE.ink) {
  if (k <= .01) { paint(rectPts(-60, -60, W + 120, H + 120), { wash: col, ink: null }); return; }
  const hh = h * k, ww = hh * .36, pts = [];
  for (let i = 0; i <= 16; i++) { const a = i / 16; pts.push([cx + Math.sin(Math.PI * a) * ww, cy - hh / 2 + hh * a]); }
  for (let i = 15; i > 0; i--) { const a = i / 16; pts.push([cx - Math.sin(Math.PI * a) * ww, cy - hh / 2 + hh * a]); }
  irisShape(pts, col);
}

// Props sheet: studio.html?loop=thirdprops
(() => {
  LOOPS.thirdprops = t => {
    const S = { sun: clamp(Math.sin(t * .8) * .5 + .5), red: 0 };
    sky(S); sunrise(S, S.sun); peaks(S); ledge(S);
    boulder(STAGE.bX, STAGE.bY, STAGE.bS, S);
    trishul(STAGE.trX, STAGE.trY, 760, S);
    damaru(STAGE.trX + 6, STAGE.trY - 760 * .56 + 60, 100, { shake: t % 2 > 1 ? 1 : 0 });
    kulhad(900, 1600, 90, 'a');
    steam(900, 1555, 90, t, { to: [700, 1250], k: frac(t / 2) });
    kulhad(300, 1700, 90, 'b'); steam(300, 1655, 90, t, {});
    clangRing(200, 1150, 90, frac(t) * .45, 'x');
  };
  LOOPS.thirdprops.len = 4;
})();
