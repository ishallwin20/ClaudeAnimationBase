// detox_props.js: the set and props for "Bappa's Post-Visarjan Detox" (src/scenes/detox.js). Loaded before it;
// everything here is a pure function of its arguments (and T for boil), shared by the shots.
//
//   GYM                                where things are, in world pixels
//   gym(S)                             Swarga Gym: sky, clouds, Kailash, pillars, the marigold toran, the marble floor.
//                                      S = { red, blue, gold } 0..1: the strain, Shiva's pass, the pride
//   weighScale(x, y, o)                the heavenly scale: a lotus platform and a round display on a gold column.
//                                      o.press (the platform sinks), o.flash 0..1 (a beep), o.big (the modak swells), o.alarm
//   scaleDisplay(x, y, r, o)           just the display (its centre), for the close-ups and the iris
//   dumbbell(x, y, o)                  the divine dumbbell, (x, y) = the middle of the bar (it's 680 s long). o.light 0..1 (lighter than
//                                      air: pale gold and glowing), o.s (scale), o.rot, o.key
//   mirror(x, y, inside)               the gold-framed mirror, (x, y) = its feet; inside() draws the reflection
//   trishul(x, y, s, o)                Shiva's trident, (x, y) = the butt of the staff; o.rot
//   sweatband(u, sw, k, tails)         in bappa()'s head hook: the band wraps (k 0..1); tails = the tie
//   laddoo(x, y, r, o)                 a laddoo; o.bite
//   coachCap / whistle                 Mooshak's coaching kit
//   sparkle, goldRing, sweatDrops, strainMarks, beepMarks, whistleMarks, crumbs, speedLines, heartPuff   effect marks
//   modakIris, whipSmear               transitions
const DX = {
  ink: '#2E2438', cream: '#FFF6E6', white: '#FFF9F0',
  // sky: morning · the strain · Shiva's pass · the pride
  skyTop: ['#A99BD6', '#D98A8A', '#8DB0E6', '#F2C27A'], skyMid: ['#E6BFD8', '#F2AE9A', '#C2D6F2', '#FFD9A0'], skyLow: ['#FFE0C4', '#FFD0B0', '#EAF0FA', '#FFEBC4'],
  cloud: '#FFF4EE', cloudDk: '#D9C8E6', peak: '#B9AEDD', peakSnow: '#F4EEFA',
  marble: '#F4ECE0', marbleDk: '#D8C8D6', vein: '#C3AFCC', edge: '#B8A2C4',
  pillar: '#F6E9D2', pillarDk: '#D9C2A4', gold: '#EDB43C', goldDk: '#B67D1C', goldLt: '#FFE39A',
  marigold: '#F59A23', marigoldDk: '#D0661A', leaf: '#5E9E5A',
  stone: '#5E5877', stoneDk: '#3F3A56', stoneLt: '#8C85A8', steel: '#D7DCE6', steelDk: '#8E97AC',
  screen: '#FFF3DA', alarm: '#F5A6A0', lamp: '#E2453A', wing: '#FFFFFF',
  glass: '#DCE4F4', glassDk: '#B9C6E2',
  band: '#D8343A', bandDk: '#9E2228', bandLt: '#FFE9E2',
  laddoo: '#F4A53A', laddooDk: '#C9741C', laddooLt: '#FFD27A',
  cap: '#2FA39B', capDk: '#1E756F', whistle: '#D7DCE6', cord: '#E2453A',
  wood: '#8A5A3C', woodDk: '#5E3B27', ribbon: '#D2452F',
};
const GYM = {
  FY: 1450,                                 // the floor line (feet)
  scX: 300, scY: 1450, dX: 505, dY: 905, dR: 86,   // the scale: platform centre and the display's centre and radius
  plY: 1392,                                // the platform's top (where Bappa stands on it)
  bandX: 700,                               // where he ties the sweatband
  dbX: 1150, dbY: 1352, dbS: .8,            // the middle of the dumbbell's bar at rest, and its scale
  mrX: 1710, mrY: 1446,                     // the mirror's feet
  pillars: [-40, 900, 1470, 2200],
  bU: 24,                                   // Bappa's size
};
// A modak with its pleats, as a point list: (cx, base) = the middle of its flat bottom, s = size (it's 1.32 s tall).
function modakPts(cx, base, s) {
  return [[-.62, 0], [-.68, -.2], [-.62, -.44], [-.47, -.7], [-.28, -.94], [-.12, -1.14], [0, -1.32], [.12, -1.14], [.28, -.94], [.47, -.7], [.62, -.44], [.68, -.2], [.62, 0], [.3, .06], [0, .07], [-.3, .06]]
    .map(([a, b]) => [cx + a * s, base + b * s]);
}
// The hero modak: a white ukadiche modak, pleats curving up to a pinched tip. For the scale's display and the stamps.
function bigModak(cx, base, s, o = {}) {
  const sw = o.sw ?? clamp(s / 40, .5, 2), key = o.key || '';
  boilSeed('bigmodak ' + key);
  paint(modakPts(cx, base, s), { wash: o.col || '#FFF3DC', fill: o.shade || '#E3C392', fillOp: 110, tex: .6, border: .6, ink: DX.ink, sw, curv: .55 });
  paint(ellPts(cx + .2 * s, base - .35 * s, .32 * s, .28 * s, 12), { fill: o.shade || '#E3C392', fillOp: 90, bleed: .2, tex: .6, ink: null });
  for (const k of [-.46, -.23, 0, .23, .46]) inkLine([[cx + k * s * 1.05, base - .03 * s], [cx + k * s * 1.2, base - .45 * s], [cx + k * s * .55, base - .95 * s], [cx, base - 1.26 * s]], sw * .6, o.pleat || '#C49A5E', 'inkfine', .6);
  paint(ellPts(cx, base - 1.3 * s, .07 * s, .09 * s, 8), { wash: o.col || '#FFF3DC', ink: DX.ink, sw: sw * .6 });
}
// a colour from the four states
const dxTone = (c, S) => { let k = mixCol(c[0], c[1], S.red || 0); k = mixCol(k, c[2], S.blue || 0); return mixCol(k, c[3], S.gold || 0); };

// Big shapes are unreliable in p5.brush under a zoomed camera, so the sky's base colour is laid in screen space.
function dxScreenWash(col) { push(); resetMatrix(); translate(-W / 2, -H / 2); paint(rectPts(-60, -60, W + 120, H + 120), { wash: col, ink: null }); pop(); }

function gym(S) {
  boilSeed('gym sky');
  dxScreenWash(dxTone(DX.skyTop, S));
  for (const x0 of [-700, 700]) {
    paint(rectPts(x0, 300, 1450, 700, 30), { fill: dxTone(DX.skyMid, S), fillOp: 200, bleed: .25, tex: .4, border: .2, ink: null });
    paint(rectPts(x0, 760, 1450, 800, 30), { fill: dxTone(DX.skyLow, S), fillOp: 220, bleed: .25, tex: .4, border: .2, ink: null });
  }
  // Kailash, far off, behind the gym
  boilSeed('gym peak');
  const pk = mixCol(DX.peak, dxTone(DX.skyMid, S), .3), px0 = 1090;
  paint([[px0 - 560, 1330], [px0 - 250, 930], [px0 - 90, 770], [px0, 690], [px0 + 90, 780], [px0 + 260, 930], [px0 + 560, 1330]], { wash: pk, fill: mixCol(pk, DX.ink, .15), fillOp: 60, tex: .5, border: .4, ink: null, curv: .2 });
  paint([[px0 - 90, 770], [px0, 690], [px0 + 90, 780], [px0 + 62, 800], [px0 + 40, 784], [px0 + 18, 822], [px0 - 8, 790], [px0 - 32, 812], [px0 - 58, 796]], { wash: DX.peakSnow, washOp: 240, ink: null, curv: 0 });
  // slow clouds
  for (let i = 0; i < 6; i++) {
    boilSeed('gym cloud ' + i);
    const cx = -300 + ((hash(i * 3.3) * 2200 + T * (6 + 4 * i)) % 2300), cy = 250 + i * 150 + 70 * hash(i);
    paint(ellPts(cx, cy, 170 + 90 * hash(i + 4), 36 + 14 * hash(i + 9), 18, 6), { fill: mixCol(DX.cloud, dxTone(DX.skyMid, S), .3), fillOp: 130, bleed: .3, tex: .5, ink: null });
  }
  // a bank of cloud the gym floats on
  for (let i = 0; i < 9; i++) {
    boilSeed('gym bank ' + i);
    const cx = -500 + i * 330, cy = 1375 + 20 * Math.sin(i * 1.7);
    paint(ellPts(cx, cy, 230, 80 + 20 * hash(i + 2), 20, 8), { wash: mixCol(DX.cloud, dxTone(DX.skyLow, S), .25), fill: DX.cloudDk, fillOp: 60, tex: .5, border: .4, ink: null });
  }
  // pillars with gold capitals, and the marigold toran sagging between them (left over from the festival)
  for (const [i, px] of GYM.pillars.entries()) {
    boilSeed('gym pillar ' + i);
    paint(rectPts(px - 46, 330, 92, 1060, 3), { wash: DX.pillar, fill: DX.pillarDk, fillOp: 70, tex: .5, border: .6, ink: DX.ink, sw: 1.1 });
    for (const k of [-24, 0, 24]) inkLine([[px + k, 380], [px + k, 1370]], .6, DX.pillarDk, 'inkfine', 0);   // flutes
    paint(rrPts(px - 70, 300, 140, 50, 14, 2), { wash: DX.gold, fill: DX.goldDk, fillOp: 60, tex: .5, ink: DX.ink, sw: 1.1 });
    paint(rrPts(px - 62, 1360, 124, 40, 10, 2), { wash: DX.gold, fill: DX.goldDk, fillOp: 60, tex: .5, ink: DX.ink, sw: 1.1 });
  }
  for (let j = 0; j + 1 < GYM.pillars.length; j++) {
    const a = GYM.pillars[j], b = GYM.pillars[j + 1];
    boilSeed('toran ' + a);
    const n = Math.round((b - a) / 34), sag = (b - a) * .16;
    const pt = k => [lerp(a, b, k), 355 + sag * 4 * k * (1 - k) + 3 * Math.sin(T * 1.3 + k * 9)];
    inkLine([pt(0), pt(.25), pt(.5), pt(.75), pt(1)], 1.2, DX.leaf, 'ink', .6);
    for (let j = 1; j < n; j++) {
      const [fx, fy] = pt(j / n);
      paint(ellPts(fx, fy + 6, 16, 16, 10, 2), { wash: j % 3 ? DX.marigold : DX.marigoldDk, fill: DX.marigoldDk, fillOp: 60, tex: .6, ink: null });
      if (j % 4 === 0) paint(ribbon([[fx, fy + 18], [fx + 3, fy + 42], [fx - 2, fy + 60]], 10, 4), { wash: DX.leaf, ink: null });   // a mango leaf
    }
  }
  // the marble floor, in tiles
  for (let i = 0; i < 4; i++) {
    boilSeed('floor ' + i);
    const x0 = -600 + i * 800;
    paint(rectPts(x0, 1390, 820, 900, 4), { wash: DX.marble, fill: DX.marbleDk, fillOp: 50, tex: .5, border: .3, ink: null });
    for (let v = 0; v < 3; v++) { const vy = 1480 + v * 150 + 40 * hash(i * 7 + v); inkLine([[x0 + 60, vy], [x0 + 300, vy + 30 * hash(v + i)], [x0 + 560, vy - 20], [x0 + 780, vy + 10]], .8, DX.vein, 'inkfine', .6); }
  }
  boilSeed('floor edge');
  for (let i = 0; i < 4; i++) inkLine([[-600 + i * 800, 1390], [200 + i * 800, 1390]], 1.4, DX.edge, 'ink', 0);
}

// ---------- the scale ----------
function weighScale(x, y, o = {}) {
  const press = o.press || 0, top = y - 58 + 12 * press;
  boilSeed('scale column');
  const dx = GYM.dX, dy = GYM.dY;
  paint(ribbon([[x + 145, top + 8], [dx, dy + GYM.dR + 10]], 18, 14), { wash: DX.gold, fill: DX.goldDk, fillOp: 70, tex: .5, ink: DX.ink, sw: 1 });
  paint(ellPts(lerp(x + 145, dx, .5), lerp(top, dy + GYM.dR, .5), 16, 22, 12), { wash: DX.goldLt, ink: DX.ink, sw: .8 });
  boilSeed('scale platform');
  paint(ellPts(x, y + 4, 175, 22, 20), { fill: PAL.ink, fillOp: 70, bleed: .25, tex: .3, ink: null });   // its shadow
  paint(rrPts(x - 150, top, 300, y - top - 6, 16, 2), { wash: DX.gold, fill: DX.goldDk, fillOp: 70, tex: .6, border: .5, ink: DX.ink, sw: 1.2 });
  paint(ellPts(x, top, 150, 22, 24, 2), { wash: DX.cream, fill: DX.marbleDk, fillOp: 50, tex: .4, ink: DX.ink, sw: 1.1 });
  for (let i = 0; i < 9; i++) {   // lotus petals round the base
    const px = x + (i - 4) * 34, ph = 30 - 3 * Math.abs(i - 4);
    paint([[px - 20, y + 2], [px - 14, y - ph * .6], [px, y - ph], [px + 14, y - ph * .6], [px + 20, y + 2]], { wash: i % 2 ? '#F4B9C8' : '#FBD9E1', fill: '#E08AA0', fillOp: 60, tex: .4, ink: DX.ink, sw: .8, curv: .5 });
  }
  scaleDisplay(dx, dy, GYM.dR, o);
}
function scaleDisplay(x, y, r, o = {}) {
  const fl = clamp(o.flash || 0), al = clamp(o.alarm || 0), big = o.big ?? 1, sw = clamp(r / 60, .6, 2);
  boilSeed('scale wings');
  for (const s of [-1, 1]) {   // little wings: it's a heavenly scale
    const wf = .08 * Math.sin(T * 5 + s);
    push(); translate(x + s * r * .9, y - r * .1); rotate(s * (.25 + wf));
    for (const k of [0, 1, 2]) paint(ellPts(s * r * (.35 + .28 * k), -r * (.1 + .12 * k), r * .42, r * .16, 12, 0, s * -.5), { wash: DX.wing, fill: DX.glass, fillOp: 60, tex: .3, ink: DX.ink, sw: sw * .6 });
    pop();
  }
  boilSeed('scale dial');
  if (fl > .02) glow(x, y, r * (1.6 + .8 * fl), '#FF9A7A', .55 * fl);
  paint(ellPts(x, y, r, r, 30, 1), { wash: DX.gold, fill: DX.goldDk, fillOp: 70, tex: .6, border: .5, ink: DX.ink, sw });
  paint(ellPts(x, y, r * .8, r * .8, 28), { wash: mixCol(DX.screen, DX.alarm, clamp(al * .5 + fl * .7)), ink: DX.ink, sw: sw * .8 });
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; inkLine([[x + Math.cos(a) * r * .86, y + Math.sin(a) * r * .86], [x + Math.cos(a) * r * .95, y + Math.sin(a) * r * .95]], sw * .7, DX.goldDk, 'inkfine', 0); }
  paint(ellPts(x, y - r * 1.02, r * .13, r * .13, 10), { wash: fl > .3 ? DX.lamp : '#9E5A58', ink: DX.ink, sw: sw * .6 });   // the lamp on top
  if (fl > .3) glow(x, y - r * 1.02, r * .5, DX.lamp, fl);
  boilSeed('scale modak');
  const ms = r * .8 * big * (1 + .12 * fl) * (o.idle ? .9 : 1);
  bigModak(x, y + ms * .6, ms, { key: 'display', col: fl > .3 ? '#FFFBF2' : '#FFF3DC' });
  paint([[x - r * .55, y - r * .35], [x - r * .3, y - r * .62], [x - r * .2, y - r * .55], [x - r * .45, y - r * .28]], { wash: DX.white, washOp: 170, ink: null });   // glass shine
}
// Beep marks: arcs springing off the display on each beep. age since the beep.
function beepMarks(x, y, r, age, key) {
  if (age < 0 || age > .45) return;
  boilSeed('beep ' + key);
  const k = easeOut(age / .45), a = 1 - age / .45;
  for (const s of [-1, 1]) for (let j = 0; j < 3; j++) {
    const rr = r * (1.05 + .25 * j + .45 * k), P = [];
    for (let i = 0; i <= 6; i++) { const q = (i / 6 - .5) * .9; P.push([x + s * Math.cos(q) * rr, y + Math.sin(q) * rr]); }
    inkLine(P, (3 - j * .6) * a + .4, DX.lamp, 'ink', .5);
  }
}

// ---------- the dumbbell ----------
function dumbbell(x, y, o = {}) {
  const s = o.s ?? 1, L = clamp(o.light || 0), key = o.key || 'db', sw = clamp(1.3 * s, .5, 2);
  const plate = mixCol(DX.stone, '#F6E3A6', L), plateDk = mixCol(DX.stoneDk, DX.goldLt, L), plateLt = mixCol(DX.stoneLt, DX.white, L);
  if (L > .02) glow(x, y, 360 * s, '#FFE7A0', .55 * L);
  push(); translate(x, y); if (o.rot) rotate(o.rot); scale(s);
  boilSeed(key + ' bar');
  paint(rrPts(-340, -12, 680, 24, 10, 1), { wash: DX.steel, fill: DX.steelDk, fillOp: 60, tex: .4, ink: DX.ink, sw });
  for (const sd of [-1, 1]) paint(rrPts(sd * 340 - 9, -16, 18, 32, 6, 1), { wash: DX.gold, ink: DX.ink, sw });   // end caps
  for (let i = -3; i <= 3; i++) inkLine([[i * 18, -10], [i * 18 + 6, 10]], .6, DX.steelDk, 'inkfine', 0);   // grip knurl
  for (const sd of [-1, 1]) {
    boilSeed(key + ' plates ' + sd);
    paint(rrPts(sd * 172 - 11, -26, 22, 52, 6, 1), { wash: DX.gold, fill: DX.goldDk, fillOp: 60, tex: .5, ink: DX.ink, sw });   // collar
    paint(ellPts(sd * 258, 0, 46, 92, 22, 2), { wash: plateDk, fill: plate, fillOp: 60, tex: .6, border: .5, ink: DX.ink, sw });   // outer plate
    paint(ellPts(sd * 205, 0, 64, 118, 26, 2), { wash: plate, fill: plateDk, fillOp: 70, tex: .7, border: .5, ink: DX.ink, sw: sw * 1.1 });   // big plate
    inkLine(ellPts(sd * 205, 0, 52, 102, 22).concat([[sd * 205 + 52, 0]]), sw * 1.6, L > .5 ? DX.white : DX.gold, 'ink', .5);   // gold rim
    paint(ellPts(sd * 205 - 18, -52, 16, 26, 10, 0, -.3), { fill: plateLt, fillOp: 140, bleed: .2, tex: .6, ink: null });
    push(); translate(sd * 205, 0); scale(.62, 1); bigModak(0, 34, 52, { key: key + sd, col: L > .5 ? '#FFFBF2' : '#E9D9B8', shade: '#B89A66' }); pop();   // the modak stamp
  }
  pop();
  if (L > .3) for (let i = 0; i < 5; i++) {   // lighter than air: little sparkles orbit it
    const q = T * 1.6 + i / 5 * TAU;
    sparkle(x + Math.cos(q) * 300 * s, y + Math.sin(q) * 90 * s, 16 * s * L, .15, key + 'orbit' + i);
  }
}

// ---------- the mirror ----------
function mirror(x, y, inside) {
  const w = 520, h = 740, top = y - 40 - h, cy = top + w / 2;
  const arch = [];
  for (let i = 0; i <= 16; i++) { const a = Math.PI + i / 16 * Math.PI; arch.push([x + Math.cos(a) * w / 2, cy + Math.sin(a) * w / 2]); }
  const frame = arch.concat([[x + w / 2, y - 40], [x - w / 2, y - 40]]);
  const inner = frame.map(([px, py]) => [x + (px - x) * .88, (py - (y - 40)) * .92 + (y - 52)]);
  boilSeed('mirror frame');
  paint(ellPts(x, y + 2, 290, 26, 20), { fill: PAL.ink, fillOp: 60, bleed: .25, tex: .3, ink: null });
  for (const s of [-1, 1]) paint(ellPts(x + s * 200, y - 20, 30, 26, 12), { wash: DX.gold, ink: DX.ink, sw: 1 });   // feet
  paint(frame, { wash: DX.gold, fill: DX.goldDk, fillOp: 70, tex: .6, border: .5, ink: DX.ink, sw: 1.6, curv: .3 });
  paint(inner, { wash: DX.glass, fill: DX.glassDk, fillOp: 60, tex: .4, border: .6, ink: DX.ink, sw: 1, curv: .3 });
  if (inside) inside();
  boilSeed('mirror shine');
  for (const [a, b, k] of [[-.32, -.05, 1], [-.12, .1, .6]]) paint(ribbon([[x + a * w, cy + h * .45], [x + b * w, cy - w * .2]], 26 * k, 18 * k), { wash: DX.white, washOp: 90, ink: null });
  boilSeed('mirror crest');
  paint(starPts(x, top - 6, 44, .45, 6), { wash: DX.gold, fill: DX.goldDk, fillOp: 60, tex: .5, ink: DX.ink, sw: 1.2 });
  paint(ellPts(x, top - 6, 14, 14, 10), { wash: DX.lamp, ink: DX.ink, sw: .8 });
}

// ---------- Shiva's trishul ----------
// (x, y) = the butt of the staff; s = its length; o.rot tilts it about the butt.
function trishul(x, y, s, o = {}) {
  boilSeed('trishul ' + (o.key || ''));
  push(); translate(x, y); if (o.rot) rotate(o.rot);
  const sw = clamp(s / 380, .5, 1.4);
  paint(ribbon([[0, 0], [0, -s * .8]], s * .028, s * .024), { wash: DX.wood, fill: DX.woodDk, fillOp: 60, tex: .5, ink: DX.ink, sw });
  const hy = -s * .8, w = s * .12;
  paint([[-w, hy - s * .02], [w, hy - s * .02], [w * .9, hy + s * .02], [-w * .9, hy + s * .02]], { wash: DX.gold, ink: DX.ink, sw });
  paint([[-s * .012, hy], [s * .012, hy], [s * .02, hy - s * .12], [0, hy - s * .22], [-s * .02, hy - s * .12]], { wash: DX.steel, fill: DX.steelDk, fillOp: 60, ink: DX.ink, sw });
  for (const d of [-1, 1]) paint([[d * w * .85, hy], [d * w * .6, hy], [d * w * .7, hy - s * .07], [d * w * 1.05, hy - s * .16], [d * w * 1.25, hy - s * .1], [d * w * 1.1, hy - s * .05]], { wash: DX.steel, fill: DX.steelDk, fillOp: 60, ink: DX.ink, sw, curv: .3 });
  paint(ellPts(0, -s * .56, s * .032, s * .02, 10), { wash: DX.ribbon, ink: DX.ink, sw: sw * .8 });
  pop();
}

// ---------- the sweatband, drawn in bappa()'s head hook (head space, u) ----------
// k 0..1: how much of the band is round his forehead (it wraps from his left temple to his right).
// tails: { held: [[x, y], [x, y]] } (both ends in his fists, head space u) or { fly: age } (knotted at his right
// temple, the two tails streaming and fluttering; age since the knot)
function sweatband(u, sw, k, tails) {
  if (k <= .01) return;
  const P = pts => U(pts, u), band = [];
  const n = 10, m = Math.max(1, Math.round(n * k));
  for (let i = 0; i <= m; i++) { const f = i / n, a = lerp(-1, 1, f); band.push([a * 3.55, -13.75 - .55 * (1 - a * a)]); }
  paint(ribbon(P(band), .95 * u, .95 * u), { wash: DX.band, fill: DX.bandDk, fillOp: 50, tex: .5, ink: PAL.ink, sw: sw * .8 });
  inkLine(P(band.map(([a, b]) => [a, b])), sw * 1.6, DX.bandLt, 'ink', .5);   // the white stripe
  if (!tails) return;
  const knot = [3.55, -13.75];
  if (tails.held) {
    for (const [hx, hy] of tails.held) {
      const from = hx < 0 ? [-3.55, -13.75] : knot;
      paint(ribbon(P([from, [lerp(from[0], hx, .5) + (hx < 0 ? -.4 : .4), lerp(from[1], hy, .5)], [hx, hy]]), .7 * u, .55 * u), { wash: DX.band, fill: DX.bandDk, fillOp: 50, tex: .5, ink: PAL.ink, sw: sw * .7 });
    }
  } else {
    const age = tails.fly ?? 9, whip = Math.exp(-age * 3);
    for (const [j, len] of [[0, 3.4], [1, 2.7]]) {
      const pts = [];
      for (let i = 0; i <= 5; i++) {
        const f = i / 5, wv = Math.sin(T * 9 - f * 4 + j * 1.3) * .35 * f + whip * Math.sin(age * 30 - f * 3) * .9 * f;
        pts.push([knot[0] + .3 + f * len * (1 - .1 * j), knot[1] + .2 + f * (.5 + j * .9) + wv]);
      }
      paint(ribbon(P(pts), .62 * u, .3 * u), { wash: DX.band, fill: DX.bandDk, fillOp: 50, tex: .5, ink: PAL.ink, sw: sw * .7 });
    }
    paint(ellPts((knot[0] + .15) * u, knot[1] * u, .5 * u, .45 * u, 12), { wash: DX.bandDk, ink: PAL.ink, sw: sw * .7 });   // the knot
  }
}

// ---------- a laddoo ----------
function laddoo(x, y, r, o = {}) {
  boilSeed('laddoo ' + (o.key || ''));
  const sw = clamp(r / 30, .4, 1.3);
  paint(ellPts(x, y, r, r * .96, 20, r * .04), { wash: DX.laddoo, fill: DX.laddooDk, fillOp: 70, tex: .8, border: .5, ink: PAL.ink, sw });
  paint(ellPts(x - r * .3, y - r * .35, r * .35, r * .25, 10, 0, -.4), { fill: DX.laddooLt, fillOp: 160, bleed: .2, tex: .7, ink: null });
  for (let i = 0; i < 9; i++) { const a = hash(i * 3.1) * TAU, d = r * .7 * Math.sqrt(hash(i * 7.7)); paint(ellPts(x + Math.cos(a) * d, y + Math.sin(a) * d, r * .07, r * .07, 6), { wash: DX.laddooDk, ink: null }); }
  if (o.bite > 0) paint(ellPts(x + r * .75, y - r * .35, r * .5 * o.bite, r * .45 * o.bite, 12), { wash: o.bg || DX.skyLow[3], ink: null });
}

// ---------- Mooshak's coaching kit ----------
// (x, y) = the top of his head between the ears; s = his u
function coachCap(x, y, s, o = {}) {
  boilSeed('coachcap ' + (o.key || ''));
  push(); translate(x, y); if (o.rot) rotate(o.rot); if (o.flip) scale(-1, 1);
  paint([[-1.25 * s, .35 * s], [-1.1 * s, -.6 * s], [-.4 * s, -1.05 * s], [.5 * s, -1 * s], [1.15 * s, -.45 * s], [1.25 * s, .35 * s]], { wash: DX.cap, fill: DX.capDk, fillOp: 60, tex: .5, ink: PAL.ink, sw: .9, curv: .5 });
  paint(ribbon([[.9 * s, .25 * s], [1.9 * s, .35 * s], [2.4 * s, .55 * s]], .42 * s, .25 * s), { wash: DX.capDk, ink: PAL.ink, sw: .8 });   // the bill
  paint(ellPts(0, -1.02 * s, .18 * s, .12 * s, 8), { wash: DX.capDk, ink: null });
  pop();
}
function whistle(x, y, s, o = {}) {
  boilSeed('whistle ' + (o.key || ''));
  push(); translate(x, y); if (o.rot) rotate(o.rot); if (o.flip) scale(-1, 1);
  paint(rrPts(0, -.3 * s, 1.2 * s, .6 * s, .25 * s), { wash: DX.whistle, fill: DX.steelDk, fillOp: 60, tex: .4, ink: PAL.ink, sw: .8 });
  paint(ellPts(1.1 * s, .15 * s, .45 * s, .45 * s, 10), { wash: DX.whistle, ink: PAL.ink, sw: .8 });
  pop();
}

// ---------- marks ----------
function sparkle(x, y, r, age, key) {   // a four-point sparkle that pops and fades (age since it appeared; loops if < 0 means none)
  if (age < 0 || age > .6 || r < 1) return;
  boilSeed('sparkle ' + key);
  const k = backOut(seg(age, 0, .18)) * (1 - seg(age, .4, .6));
  if (k > .02) paint(starPts(x, y, r * k, .28, 4), { wash: DX.goldLt, ink: DX.goldDk, sw: .8 });
}
function goldRing(x, y, r, age, key) {   // the TING: an expanding gold ring with spark lines
  if (age < 0 || age > .6) return;
  boilSeed('ring ' + key);
  const k = easeOut(age / .6), a = 1 - age / .6, rr = r * (.3 + 1.5 * k);
  inkLine(ellPts(x, y, rr, rr * .7, 24).concat([[x + rr, y]]), 4 * a + .5, DX.gold, 'ink', .6);
  for (let i = 0; i < 8; i++) { const q = i / 8 * TAU + .3; inkLine([[x + Math.cos(q) * rr * 1.1, y + Math.sin(q) * rr * .77], [x + Math.cos(q) * rr * 1.45, y + Math.sin(q) * rr]], 3 * a + .4, DX.goldDk, 'ink', 0); }
}
function sweatDrops(x, y, s, age, key, dir = 1) {   // three drops flung off a straining head
  if (age < 0 || age > .6) return;
  for (let i = 0; i < 3; i++) {
    boilSeed('sweat ' + key + i);
    const q = -1.9 + i * .55, v = s * (2.2 + hash(i + key.length)), f = age / .6;
    const px = x + dir * Math.cos(q) * v * f * -1, py = y + Math.sin(q) * v * f + s * 3 * f * f, r = s * .28 * (1 - f * .5);
    paint([[px, py - r * 1.8], [px + r, py], [px, py + r], [px - r, py]], { wash: '#BFE3F7', ink: DX.ink, sw: .7, curv: .6 });
  }
}
function strainMarks(x, y, rx, ry, t, k, key) {   // shaking outlines round a thing that's being pulled hard
  if (k <= .02) return;
  for (let i = 0; i < 2; i++) {
    boilSeed('strain ' + key + i);
    const ph = frac(t * 2.6 + i / 2), r = 1.05 + .5 * ph, w = (1 - ph) * 2.6 * k;
    for (const s of [-1, 1]) {
      const pts = []; for (let j = 0; j <= 6; j++) { const a = (j / 6 - .5) * 1.1; pts.push([x + s * Math.cos(a) * rx * r + s * 5 * Math.sin(j * 2.4 + t * 30), y + Math.sin(a) * ry * r]); }
      inkLine(pts, w, DX.ink, 'ink', .4);
    }
  }
}
function whistleMarks(x, y, s, age, key) {   // TWEET: three short lines fanning out of the whistle
  if (age < 0 || age > .5) return;
  boilSeed('tweet ' + key);
  const k = easeOut(age / .5), a = 1 - age / .5;
  for (const q of [-.5, 0, .5]) inkLine([[x + Math.cos(q) * s * (.4 + k), y + Math.sin(q) * s * (.4 + k)], [x + Math.cos(q) * s * (1 + 1.3 * k), y + Math.sin(q) * s * (1 + 1.3 * k)]], 3 * a + .4, DX.ink, 'ink', 0);
}
function crumbs(x, y, s, age, key) {   // laddoo crumbs, flying and falling
  if (age < 0 || age > .8) return;
  for (let i = 0; i < 7; i++) {
    boilSeed('crumb ' + key + i);
    const q = -Math.PI * (.15 + .7 * hash(i * 2.3)), v = s * (1.5 + 2 * hash(i + 4)), f = age;
    const px = x + Math.cos(q) * v * f * 1.6, py = y + Math.sin(q) * v * f * 1.6 + s * 9 * f * f, r = s * .12 * (1 - f * .6);
    paint(ellPts(px, py, r, r, 6), { wash: i % 2 ? DX.laddoo : DX.laddooDk, ink: null });
  }
}
function speedLines(x, y, len, k, key) {   // vertical streaks under something that shot up
  if (k <= .02) return;
  boilSeed('speed ' + key);
  for (let i = 0; i < 5; i++) { const dx = (i - 2) * 60 + jit(6); inkLine([[x + dx, y + 20 + 30 * hash(i)], [x + dx, y + 20 + len * k * (.6 + .4 * hash(i + 3))]], 1.3 * k + .3, mixCol(DX.ink, DX.skyMid[0], .45), 'inkfine', 0); }
}
function heartPuff(x, y, s, age, key) {   // a heart that floats up and fades
  if (age < 0 || age > 1.6) return;
  boilSeed('heart ' + key);
  const k = age / 1.6, r = s * (.5 + .5 * backOut(seg(age, 0, .3))) * (1 - seg(k, .7, 1));
  if (r > 1) paint(heartPts(x + Math.sin(age * 5) * s * .3, y - age * s * 1.8, r), { wash: '#E2476E', ink: DX.ink, sw: .8 });
}

// ---------- transitions ----------
// A modak-shaped iris: everything outside a modak h pixels tall, centred at (cx, cy), goes to ink.
function modakIris(cx, cy, h, col = DX.ink) {
  if (h >= 5000) return;
  if (h <= 4) { paint(rectPts(-60, -60, W + 120, H + 120), { wash: col, ink: null }); return; }
  const s = h / 1.3, pts = modakPts(cx, cy + s * .6, s);
  irisShape(through(pts.concat([pts[0]]), 3), col);
}
function whipSmear(k, dir = 1, cols = ['#A99BD6', '#FFF1E2', '#E6BFD8']) {
  if (k <= .01) return;
  boilSeed('smear');
  for (let i = 0; i < 16; i++) {
    const y = -40 + i * (H + 80) / 16, hh = (H + 80) / 16 + 30;
    paint(rectPts(-100, y, W + 200, hh, 10), { wash: cols[i % cols.length], washOp: 255 * clamp(k * 1.6 - hash(i) * .5), ink: null });
    if (k > .4) inkLine([[-50, y + hh * .5], [W + 50, y + hh * .5 + jit(10)]], 1.2, mixCol(cols[(i + 1) % cols.length], PAL.cream, .3), 'dry', 0);
  }
}

// Props sheet: studio.html?loop=detoxprops
(() => {
  LOOPS.detoxprops = t => {
    const S = { red: 0, blue: 0, gold: clamp(Math.sin(t * .8) * .5 + .5) };
    camBegin(760, 1000, .75);
    gym(S);
    weighScale(GYM.scX, GYM.scY, { flash: pulse(t, 5), press: .3 });
    dumbbell(GYM.dbX, GYM.dbY, { light: t % 4 > 2 ? 1 : 0 });
    mirror(GYM.mrX, GYM.mrY);
    trishul(1300, 1300, 380, { rot: .2 });
    laddoo(200, 1600, 40);
    coachCap(560, 1600, 30); whistle(640, 1640, 30);
    goldRing(760, 1332, 120, frac(t / 1.2) * .6, 'x');
    camEnd();
  };
  LOOPS.detoxprops.len = 4;
})();
