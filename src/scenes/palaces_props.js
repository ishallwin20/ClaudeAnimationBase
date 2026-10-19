// palaces_props.js: sets and props of "Krishna had 16,108 queens" (palaces.js), Little Kanha Part 3.
//   dwarkaSet(t, o)            Dwarka on the sea, in world space (x -600..1700): sky, the sea, rows of gold palaces
//   palaceRoom(t, o)           a palace room of 10.69.9–12 (world x -300..1400, floor at y FLOOR): sapphire walls (o.wall),
//                              coral pillars, pearl festoons, jewelled lamps, a window on the sea, a polished floor
//   gaddi(x, y, w, o)          a royal couch with bolsters · chamara(u, sw, a) a yak-tail fan, for a parvati() hand hook
//   kalash(x, y, r, tilt)      a gold water jar · diceTable(x, y, w, t, o) the chaupar table with long dice
//   havanKund(x, y, r, t)      the sacred fire in its brick pit · lota(u, sw, a) a brass pot (hand hook)
//   roundShield(u, sw)         a hand hook · windowWall(t, o) a wall of arched windows, each with a mini scene
//   followCard(t, C)           the follow card (as Part 1's)
const PS = {
  ink: '#2A2238', cream: '#FFF5E2',
  sky: '#BFE0F2', skyTop: '#8EC6EA', skyLow: '#FCEBCB', sea: '#2E8CB8', seaDk: '#1E6A96', seaLt: '#7EC6E2', foam: '#F4FBFF',
  dusk: '#F6B67A', duskTop: '#E8887A',
  gold: '#EDB43C', goldDk: '#B67D1C', goldLt: '#FFE39A', white: '#FFF8EC', stone: '#F3E3C8', stoneDk: '#D9C29E',
  sapphire: '#2E4FA0', sapphireDk: '#1E3676', sapphireLt: '#5E7ECC', coral: '#E2674E', coralDk: '#B04432', coralLt: '#F49A80',
  vaid: '#9CC25A', pearl: '#FFF6E8', gem: '#D2283A', gem2: '#2F9C94', floor: '#F4E6CE', floorDk: '#DCC6A2', inlay: '#2F9C94',
  silk: '#D9467C', silkDk: '#A82E5C', bolster: '#F2C230', wood: '#8A5A3A', woodDk: '#5E3A24',
  copper: '#C8743A', copperDk: '#8E4A22', copperLt: '#F0A86A', brick: '#B8603A', brickDk: '#8A4024', fire: '#FFB43A', fireDk: '#F26A2A', fireLt: '#FFE68A', smoke: '#EDE6F0', water: '#9ED0F0',
  rkOrange: '#F15A24', rkPeach: '#FBE0CF', teal: '#2E5F5A', saffron: '#F39A2E', pink: '#F4A6B8',
};
const FLOOR = 1560;

const pGrad = (cols, x0, y0, x1, y1, key) => {   // soft horizontal bands, top to bottom
  boilSeed(key);
  const n = cols.length;
  paint(rectPts(x0, y0, x1 - x0, y1 - y0), { wash: cols[n - 1], ink: null });
  for (let i = n - 2; i >= 0; i--) { const yb = lerp(y0, y1, (i + 1) / n); paint([[x0, y0], [x1, y0], [x1, yb + 40], [(x0 + x1) / 2, yb + 70], [x0, yb + 40]], { fill: cols[i], fillOp: 230, bleed: .12, tex: .3, border: .2, ink: null }); }
};

// one palace: a gold block with an onion dome and a pennant (x, y = the base centre; s = scale)
function palaceBlock(x, y, s, t, k, C, key) {
  boilSeed(key);
  const w = 120 * s, h = (110 + hash(k * 3.1) * 70) * s, top = y - h;
  paint(rectPts(x - w / 2, top, w, h), { wash: C(k % 3 ? PS.gold : PS.white), ink: PS.ink, sw: .9 * s });
  for (let i = 0; i < 3; i++) paint(rrPts(x - w / 2 + w * (.14 + i * .3), top + h * .3, w * .14, h * .32, w * .07), { wash: C(PS.sapphireDk), ink: null });
  paint(rectPts(x - w / 2 - 6 * s, top - 10 * s, w + 12 * s, 12 * s), { wash: C(PS.goldDk), ink: PS.ink, sw: .7 * s });
  const dw = w * (.36 + hash(k * 5.7) * .12);
  paint([[x - dw, top - 10 * s], [x - dw * 1.05, top - 10 * s - dw * .7], [x - dw * .5, top - 10 * s - dw * 1.35], [x, top - 10 * s - dw * 1.9], [x + dw * .5, top - 10 * s - dw * 1.35], [x + dw * 1.05, top - 10 * s - dw * .7], [x + dw, top - 10 * s]], { wash: C(k % 2 ? PS.goldLt : PS.gold), ink: PS.ink, sw: .8 * s, curv: .5 });
  const fy = top - 10 * s - dw * 1.9, fl = Math.sin(t * 4 + k) * 6 * s;
  inkLine([[x, fy], [x, fy - 34 * s]], 1.1 * s, PS.ink, 'inkfine', 0);
  paint([[x, fy - 34 * s], [x + 28 * s, fy - 27 * s + fl], [x, fy - 20 * s]], { wash: C(k % 2 ? PS.saffron : PS.gem), ink: null });
}

// ---------- Dwarka on the sea ----------
// o: pan (px, the far rows move less), dusk 0..1 (golden evening)
function dwarkaSet(t, o = {}) {
  const dk = clamp(o.dusk || 0), pan = o.pan || 0;
  const C = c => mixCol(c, '#F2A06A', dk * .3);
  pGrad([mixCol(PS.skyTop, PS.duskTop, dk), mixCol(PS.sky, PS.dusk, dk), mixCol(PS.skyLow, '#FCE0B0', dk)], -900, -900, 2000, 1150, 'dsky');
  boilSeed('dclouds');
  for (let i = 0; i < 6; i++) { const x = -500 + i * 420 + hash(i * 2.2) * 160 + t * 6, y = 160 + hash(i * 4.4) * 420; paint(ellPts(x, y, 150, 44, 16, 6), { wash: '#FFFFFF', washOp: 170, ink: null }); }
  if (dk > 0) glow(880, 900, 380, '#FFC766', .6 * dk);
  // the sea, round the island
  boilSeed('dsea');
  paint(rectPts(-700, 1050, 2500, 1100), { wash: C(PS.sea), fill: C(PS.seaDk), fillOp: 70, tex: .4, ink: null });
  for (let i = 0; i < 18; i++) { const x = -650 + hash(i * 3.3) * 2400 + Math.sin(t * 1.2 + i) * 20, y = 1080 + hash(i * 1.7) * 900; inkLine([[x, y], [x + 40, y - 8], [x + 80, y]], 2, C(PS.seaLt), 'inkfine', .5); }
  // three rows of palaces: far, middle, near (the near row stands on the shore wall)
  const rows = [[880, .8, .25, 10, 0], [990, 1.1, .55, 8, 60], [1120, 1.45, 1, 6, 0]];
  rows.forEach(([y, s, par, n, off], r) => {
    for (let i = 0; i < n; i++) palaceBlock(-520 + off + i * (2300 / n) + pan * par, y, s, t, i + r * 13, C, 'pal' + r + i);
    if (r === 2) { boilSeed('dshore'); paint(rectPts(-900 + pan, y, 2900, 70), { wash: C(PS.stone), fill: C(PS.stoneDk), fillOp: 60, tex: .5, ink: PS.ink, sw: 1 }); }
  });
}

// ---------- a palace room ----------
// o: wall (hex), window (default true: an arched window on the sea), lamps (default true)
function palaceRoom(t, o = {}) {
  const wall = o.wall || PS.sapphire, wallDk = mixCol(wall, '#101030', .35), wallLt = mixCol(wall, '#FFFFFF', .25);
  boilSeed('rwall');
  paint(rectPts(-400, -300, 1900, FLOOR + 320), { wash: wall, ink: null });
  for (let i = 0; i < 7; i++) paint(rectPts(-300 + i * 260, -300, 70, FLOOR + 300), { fill: i % 2 ? wallLt : wallDk, fillOp: 60, bleed: .2, tex: .4, border: .3, ink: null });
  // a gold dado rail with a jewel line, and the arched window on the sea
  boilSeed('rrail');
  paint(rectPts(-400, 1130, 1900, 26), { wash: PS.gold, ink: PS.ink, sw: 1 });
  for (let i = 0; i < 24; i++) paint(ellPts(-380 + i * 80, 1143, 7, 7, 8), { wash: i % 2 ? PS.gem : PS.gem2, ink: null });
  if (o.window !== false) {
    boilSeed('rwindow');
    const wx = 540, wy = 760, ww = 300, wh = 360;
    const arch = [[wx - ww / 2, wy + wh / 2], [wx - ww / 2, wy - wh * .1], [wx - ww * .35, wy - wh * .38], [wx, wy - wh / 2 - 30], [wx + ww * .35, wy - wh * .38], [wx + ww / 2, wy - wh * .1], [wx + ww / 2, wy + wh / 2]];
    paint(arch.map(([a, b]) => [wx + (a - wx) * 1.14, wy + (b - wy) * 1.1]), { wash: PS.gold, ink: PS.ink, sw: 1.4, curv: .4 });
    paint(arch, { wash: PS.sky, ink: PS.ink, sw: 1.1, curv: .4 });
    paint(rectPts(wx - ww / 2 + 4, wy + 30, ww - 8, wh / 2 - 34), { wash: PS.sea, ink: null });
    for (let i = 0; i < 4; i++) inkLine([[wx - 110 + i * 60, wy + 70 + (i % 2) * 30], [wx - 80 + i * 60, wy + 62 + (i % 2) * 30]], 2, PS.seaLt, 'inkfine', .5);
    paint(ellPts(wx + 80, wy - 70, 34, 34, 14), { wash: '#FFF3C2', ink: null });
    inkLine([[wx, wy - wh / 2 - 26], [wx, wy + wh / 2]], 3, PS.goldDk, 'ink', 0);   // the jaali mullion
    inkLine([[wx - ww / 2, wy + 30], [wx + ww / 2, wy + 30]], 3, PS.goldDk, 'ink', 0);
  }
  // pearl festoons across the top
  boilSeed('rpearls');
  for (let f = 0; f < 4; f++) {
    const x0 = -140 + f * 340, x1 = x0 + 340, sw2 = Math.sin(t * 1.3 + f) * 4;
    for (let i = 0; i <= 14; i++) { const q = i / 14, x = lerp(x0, x1, q), y = 330 + Math.sin(q * Math.PI) * 70 + sw2 * Math.sin(q * Math.PI); paint(ellPts(x, y, 7, 7, 8), { wash: PS.pearl, ink: PS.ink, sw: .5 }); }
    paint(ellPts(x1, 330, 14, 14, 10), { wash: PS.gem, ink: PS.ink, sw: .7 });
  }
  // the floor: polished stone with teal inlay diamonds
  boilSeed('rfloor');
  paint(rectPts(-400, FLOOR - 160, 1900, 700), { wash: PS.floor, fill: PS.floorDk, fillOp: 50, tex: .4, ink: null });
  inkLine([[-400, FLOOR - 160], [1500, FLOOR - 160]], 2, PS.ink, 'ink', 0);
  for (let i = 0; i < 9; i++) { const x = -260 + i * 210; paint([[x, FLOOR + 40], [x + 40, FLOOR + 10], [x + 80, FLOOR + 40], [x + 40, FLOOR + 70]], { wash: PS.inlay, washOp: 160, ink: null }); }
  // coral pillars with gold capitals and vaidurya bands, and a jewelled lamp on each
  for (const px of o.pillars || [40, 1040]) {
    boilSeed('rpil' + px);
    paint(rectPts(px - 52, 380, 104, FLOOR - 380), { wash: PS.coral, fill: PS.coralDk, fillOp: 60, tex: .5, ink: PS.ink, sw: 1.3 });
    paint(rectPts(px - 30, 400, 22, FLOOR - 430), { fill: PS.coralLt, fillOp: 110, bleed: .2, tex: .4, ink: null });
    for (const by of [620, 980, 1300]) paint(rectPts(px - 56, by, 112, 22), { wash: PS.vaid, ink: PS.ink, sw: .8 });
    paint([[px - 84, 380], [px + 84, 380], [px + 60, 420], [px - 60, 420]], { wash: PS.gold, ink: PS.ink, sw: 1.1 });
    paint(rectPts(px - 74, FLOOR - 70, 148, 70), { wash: PS.gold, fill: PS.goldDk, fillOp: 50, tex: .4, ink: PS.ink, sw: 1.1 });
    if (o.lamps !== false) {
      const ly = 820, fl = 1 + .1 * Math.sin(t * 11 + px);
      glow(px, ly - 30, 110, '#FFC766', .45);
      paint([[px - 30, ly], [px + 30, ly], [px + 16, ly + 20], [px - 16, ly + 20]], { wash: PS.gold, ink: PS.ink, sw: .8 });
      paint([[px - 7, ly], [px, ly - 34 * fl], [px + 7, ly]], { wash: PS.fire, ink: null, curv: .5 });
    }
  }
}

// the floor again over x0..x1 from just above FLOOR down (hides whatever was drawn below a table's foot)
function floorPatch(x0, x1) {
  boilSeed('rfloor');
  paint(rectPts(x0, FLOOR - 30, x1 - x0, 600), { wash: PS.floor, ink: null });
  for (let i = 0; i < 9; i++) { const x = -260 + i * 210; if (x + 80 > x0 && x < x1) paint([[x, FLOOR + 40], [x + 40, FLOOR + 10], [x + 80, FLOOR + 40], [x + 40, FLOOR + 70]], { wash: PS.inlay, washOp: 160, ink: null }); }
}

// a royal couch (gaddi): a low gold-legged seat, a silk mattress, a bolster at each end. (x, y) is the seat's top centre.
function gaddi(x, y, w, o = {}) {
  boilSeed(o.key || 'gaddi');
  paint(rectPts(x - w / 2, y, w, 70), { wash: PS.gold, fill: PS.goldDk, fillOp: 50, tex: .4, ink: PS.ink, sw: 1.2 });
  for (const s of [-1, 1]) paint(rectPts(x + s * (w / 2 - 30) - 14, y + 70, 28, FLOOR - y - 70), { wash: PS.goldDk, ink: PS.ink, sw: 1 });
  paint(rrPts(x - w / 2 - 6, y - 34, w + 12, 44, 20), { wash: o.silk || PS.silk, fill: o.silkDk || PS.silkDk, fillOp: 50, tex: .4, ink: PS.ink, sw: 1.1 });
  for (const s of [-1, 1]) paint(rrPts(x + s * (w / 2 - 20) - 34, y - 96, 68, 70, 30), { wash: PS.bolster, fill: PS.goldDk, fillOp: 40, tex: .4, ink: PS.ink, sw: 1 });
}

// a chamara (yak-tail fan), upright at a hand: a gold handle, a white plume; a = its swing (radians)
function chamara(u, sw, a = 0) {
  push(); rotate(a); scale(1.5); sw /= 1.5;
  paint(ribbon(U([[0, 1.2], [0, -2.2]], u), .32 * u, .28 * u), { wash: PS.gold, ink: PS.ink, sw: sw * .5 });
  paint(U([[-.3, -2.1], [-1.1, -3.4], [-1.2, -5.2], [-.6, -6.6], [0, -7.0], [.6, -6.6], [1.2, -5.2], [1.1, -3.4], [.3, -2.1]], u), { wash: PS.white, fill: '#E6DDCC', fillOp: 60, tex: .5, ink: PS.ink, sw: sw * .5, curv: .5 });
  for (const k of [-.5, 0, .5]) inkLine(U([[k * .4, -2.6], [k, -4.6], [k * .8, -6.3]], u), sw * .35, '#D6CCB8', 'inkfine', .5);
  pop();
}

// a gold water jar (kalash) at (x, y) (its base), radius r, tipped by tilt (radians, + pours to the right)
function kalash(x, y, r, tilt = 0, key = 'kalash') {
  boilSeed(key);
  push(); translate(x, y); rotate(tilt);
  paint(ellPts(0, -r, r, r * .9, 16), { wash: PS.copper, fill: PS.copperDk, fillOp: 50, tex: .4, ink: PS.ink, sw: 1.2 });
  paint(rectPts(-r * .4, -r * 2.1, r * .8, r * .4), { wash: PS.copperDk, ink: PS.ink, sw: 1 });
  paint(ellPts(0, -r * 2.15, r * .6, r * .18, 12), { wash: PS.copper, ink: PS.ink, sw: .9 });
  paint(ellPts(-r * .35, -r * 1.25, r * .25, r * .2, 8), { wash: PS.copperLt, washOp: 200, ink: null });
  inkLine([[-r * .9, -r * .7], [r * .9, -r * .7]], 1.4, PS.gold, 'ink', .3);
  pop();
}

// a stream of water from (x0, y0) falling to (x1, y1), with a splash; k 0..1 (how much)
function waterPour(x0, y0, x1, y1, k, t, key = 'pour') {
  if (k <= .02) return;
  boilSeed(key);
  const mx = lerp(x0, x1, .5) + 20, my = lerp(y0, y1, .3);
  paint(ribbon(through([[x0, y0], [mx, my], [x1, y1]], 8), 9 * k, 6 * k), { wash: PS.water, washOp: 220, ink: PS.ink, sw: .5 });
  for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * .45, r = (18 + 14 * frac(t * 3 + i * .37)) * k; paint(ellPts(x1 + Math.cos(a) * r, y1 + Math.sin(a) * r * .6, 5 * k, 6 * k, 8), { wash: PS.water, ink: PS.ink, sw: .4 }); }
}

// the chaupar table: a low gold table with the cross-shaped cloth board and long dice. (x, y) = the table top centre.
function diceTable(x, y, w, t, o = {}) {
  boilSeed('dtable');
  paint([[x - w / 2, y], [x + w / 2, y], [x + w / 2 - 20, y + 30], [x - w / 2 + 20, y + 30]], { wash: PS.wood, ink: PS.ink, sw: 1.1 });
  paint(rectPts(x - w / 2 + 20, y + 30, w - 40, FLOOR - y - 30 - 20), { wash: PS.gold, fill: PS.goldDk, fillOp: 55, tex: .4, ink: PS.ink, sw: 1.2 });
  for (let i = 0; i < 4; i++) paint(ellPts(x - w / 2 + 70 + i * (w - 140) / 3, y + 110, 20, 20, 10), { wash: i % 2 ? PS.gem : PS.gem2, ink: PS.ink, sw: .6 });
  // the cloth board on top, in perspective: a cross of red and saffron
  boilSeed('dboard');
  const bw = w * .36, bh = 14;
  paint([[x - bw, y - 2], [x + bw, y - 2], [x + bw * .8, y - bh], [x - bw * .8, y - bh]], { wash: PS.gem, ink: PS.ink, sw: .8 });
  paint([[x - bw * .25, y - 2], [x + bw * .25, y - 2], [x + bw * .2, y - bh - 10], [x - bw * .2, y - bh - 10]], { wash: PS.saffron, ink: PS.ink, sw: .7 });
  // the dice (pasa): two long bars, rolling if o.roll (seconds since the throw)
  const r = o.roll;
  for (const s of [-1, 1]) {
    const k = r == null ? 1 : clamp(r / .5), dx = s * 34 + (1 - k) * 80 * s, dy = -24 - Math.sin(k * Math.PI) * 40;
    push(); translate(x + dx, y + dy); rotate((1 - k) * 6 * s + s * .2);
    paint(rrPts(-22, -7, 44, 14, 4), { wash: PS.white, ink: PS.ink, sw: .8 });
    for (const p of [-12, 0, 12]) paint(ellPts(p, 0, 2.6, 2.6, 6), { wash: PS.ink, ink: null });
    pop();
  }
}

// the sacred fire: a square brick kund (front face) with flames; (x, y) its base centre, r its half-width
function havanKund(x, y, r, t, key = 'kund') {
  boilSeed(key);
  glow(x, y - r * 1.1, r * 2.6, '#FFB43A', .55);
  for (let i = 0; i < 3; i++) paint(rectPts(x - r + i * 10, y - r * .55 * (i + 1) / 1.6 - 6, (r - i * 10) * 2, r * .32), { wash: i % 2 ? PS.brickDk : PS.brick, ink: PS.ink, sw: .9 });
  boilSeed(key + 'f');
  for (let i = 0; i < 5; i++) {
    const fx = x + (i - 2) * r * .3, h = r * (1.1 + .5 * Math.sin(t * 9 + i * 1.7)) * (i % 2 ? .8 : 1.1), top = y - r * 1.1;
    paint([[fx - r * .22, top], [fx - r * .1, top - h * .6], [fx + Math.sin(t * 7 + i) * r * .12, top - h], [fx + r * .14, top - h * .55], [fx + r * .22, top]], { wash: i % 2 ? PS.fireDk : PS.fire, ink: null, curv: .5 });
  }
  for (let i = 0; i < 3; i++) { const fx = x + (i - 1) * r * .3, top = y - r * 1.1; paint([[fx - r * .1, top], [fx, top - r * (.6 + .2 * Math.sin(t * 11 + i))], [fx + r * .1, top]], { wash: PS.fireLt, ink: null, curv: .5 }); }
}

// a brass lota (hand hook, upright at the hand): tipped by a (radians)
function lota(u, sw, a = 0) {
  push(); rotate(a);
  paint(ellPts(0, -1.3 * u, 1.5 * u, 1.3 * u, 16), { wash: PS.copper, fill: PS.copperDk, fillOp: 50, tex: .4, ink: PS.ink, sw: sw * .7 });
  paint(ellPts(-.5 * u, -1.7 * u, .4 * u, .3 * u, 8), { wash: PS.copperLt, washOp: 200, ink: null });
  paint(ellPts(0, -2.7 * u, .85 * u, .28 * u, 10), { wash: PS.copperDk, ink: PS.ink, sw: sw * .6 });
  pop();
}

// a round shield with a gold boss (hand hook)
function roundShield(u, sw) {
  paint(ellPts(0, 0, 2.1 * u, 2.1 * u, 20), { wash: PS.coralDk, fill: '#7A2A20', fillOp: 50, tex: .4, ink: PS.ink, sw: sw * .7 });
  paint(ellPts(0, 0, 1.6 * u, 1.6 * u, 18), { ink: PS.goldDk, sw: sw * .5 });
  for (let i = 0; i < 4; i++) { const a = i / 4 * TAU + .8; paint(ellPts(Math.cos(a) * 1.0 * u, Math.sin(a) * 1.0 * u, .2 * u, .2 * u, 8), { wash: PS.gold, ink: PS.ink, sw: sw * .3 }); }
  paint(ellPts(0, 0, .55 * u, .55 * u, 12), { wash: PS.gold, ink: PS.ink, sw: sw * .4 });
}

// a wall of arched windows in screen space; o: cols, rows, k (0..1: how many are lit, in reading order), cell(i, cx, cy, s)
// draws inside each window (s = the window's scale), wall (hex)
function windowWall(t, o = {}) {
  const cols = o.cols || 3, rows = o.rows || 4, x0 = o.x0 ?? 60, y0 = o.y0 ?? 300, w = o.w ?? 960, h = o.h ?? 1320;
  boilSeed('wwall');
  paint(rectPts(-60, -60, W + 120, H + 120), { wash: o.wall || PS.gold, fill: PS.goldDk, fillOp: 50, tex: .4, ink: null });
  const cw = w / cols, ch = h / rows, n = cols * rows;
  for (let i = 0; i < n; i++) {
    const c = i % cols, r = Math.floor(i / cols), cx = x0 + cw * (c + .5), cy = y0 + ch * (r + .5), s = Math.min(cw, ch) / 300;
    const ww = cw * .78, wh = ch * .8;
    const arch = [[cx - ww / 2, cy + wh / 2], [cx - ww / 2, cy - wh * .15], [cx - ww * .3, cy - wh * .4], [cx, cy - wh / 2], [cx + ww * .3, cy - wh * .4], [cx + ww / 2, cy - wh * .15], [cx + ww / 2, cy + wh / 2]];
    boilSeed('wwin' + i);
    const lit = (o.k ?? 1) * n > i;
    paint(arch.map(([a, b]) => [cx + (a - cx) * 1.12, cy + (b - cy) * 1.08]), { wash: PS.white, ink: PS.ink, sw: 1.2, curv: .4 });
    paint(arch, { wash: lit ? (o.inside ? o.inside(i) : PS.sapphire) : PS.sapphireDk, ink: PS.ink, sw: 1, curv: .4 });
    if (lit && o.cell) { push(); o.cell(i, cx, cy + wh / 2 - 4, s); pop(); }
    paint(rectPts(cx - ww / 2 - 8, cy + wh / 2 - 4, ww + 16, 16), { wash: PS.goldDk, ink: PS.ink, sw: .9 });
  }
}

// ---------- the follow card (Part 1's, with this reel's colours) ----------
function followCard(t, C) {
  boilSeed('cardbg');
  paint(rectPts(-60, -60, W + 120, H + 120), { wash: PS.rkPeach, ink: null });
  boilSeed('cardpetals');
  for (let i = 0; i < 9; i++) {
    const x = 60 + hash(i * 3.3) * 960 + 30 * Math.sin(t * .9 + i), y = frac(hash(i * 7.1) + t * (.035 + .02 * hash(i))) * (H + 80) - 40, r = t * .8 + i;
    paint([[x + Math.cos(r) * 15, y + Math.sin(r) * 15], [x + Math.cos(r + 1.6) * 7, y + Math.sin(r + 1.6) * 7], [x - Math.cos(r) * 15, y - Math.sin(r) * 15], [x + Math.cos(r - 1.6) * 7, y + Math.sin(r - 1.6) * 7]], { wash: i % 2 ? PS.saffron : PS.pink, washOp: 200, ink: null, curv: .5 });
  }
  const X = 470, pk = t0 => Math.max(0, t - t0) * 5;
  if (PICS.logo) picture(PICS.logo, X, 500, 160, 160, { pop: pk(C.card) });
  letter('Stories of our gods,', X, 640, 60, PS.teal, { screen: true, font: '64px Marcellus', ink: false, pop: pk(C.card + .1), maxW: 860 });
  letter('for little ones', X, 708, 60, PS.teal, { screen: true, font: '64px Marcellus', ink: false, pop: pk(C.card + .2), maxW: 860 });
  if (C.baby) C.baby();
  if (C.next && t > C.card + .5) { letter(C.next[0], X, 1170, 46, PS.rkOrange, { screen: true, font: '700 46px Poppins', ink: false, maxW: 860, pop: pk(C.card + .5) }); letter(C.next[1], X, 1226, 46, PS.teal, { screen: true, font: '700 46px Poppins', ink: false, maxW: 860, pop: pk(C.card + .6) }); }
  if (t > C.follow) letter('Follow @therishikatha', X, 1330, 64, PS.rkOrange, { screen: true, font: '700 64px Poppins', ink: false, maxW: 880, pop: pk(C.follow) });
  if (t > C.pill) {
    const k = backOut(clamp(pk(C.pill))) * (1 + .03 * pulse(t, 4));
    boilSeed('pill');
    push(); translate(X, 1435); scale(k); paint(rrPts(-230, -46, 460, 92, 46), { wash: PS.teal, ink: null }); pop();
    letter('rishikatha.com', X, 1437, 50, PS.cream, { screen: true, font: '700 52px Poppins', ink: false, pop: pk(C.pill) });
  }
}
