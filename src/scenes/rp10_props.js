// rp10_props.js: sets, props and the extra cast for rp10.js (Ramayan Part 10, "Lanka Burns"). Loaded after
// src/ramayan.js and src/ramayan_sets.js (P1, tree, throne, notes, tears). Pure functions.
//   P10                                                     the palette
//   ashokaGrove, roofs, court, nightShore, dawnShore        sets
//   cloudPuff, poof, fallenTree, chudamani, ropes, tailFire, steam, flames   props
//   guard(x, y, u, o), akshaya, indrajit, vibhishana        the rakshasas (Mahishasura's rig, asuras.js presets)
const P10 = {
  ink: '#2B2233', cream: '#FFF5E2', gold: '#F5C542',
  grove: '#0E1830', groveLo: '#2A2A58', ashoka: '#E2453A', ashokaDk: '#A82E2A', moon: '#FFF4D2',
  night: '#141C44', nightLo: '#33366E', fireSky: '#8A2E2A', fireSkyLo: '#E2783A',
  wall: '#C89A4A', wallDk: '#8E6A30', roof: '#B8862E', roofDk: '#7E5A20', roofN: '#5A4A6A', roofNDk: '#3A2E4A',
  hall: '#3A1E3A', hallLo: '#6A2E4A', pillar: '#E8B84A', pillarDk: '#B8862E',
  sea: '#2E4A7A', seaLt: '#7EA8D8', dawnHi: '#F2A07A', dawnLo: '#FFE2B8', dawnSea: '#3E7AA8', sand: '#E8CC98', sandDk: '#C8A470',
  flame: '#FF8A2E', flameLt: '#FFE070', flameDk: '#D2401E', rope: '#FFD860',
};

// ---------- small props ----------
function cloudPuff(x, y, s, key, a = 255, col = '#FFF6EC', dk = '#E8D6CC') {
  boilSeed('cloud' + key);
  paint(ellPts(x, y + s * .18, s * 1.1, s * .32, 18), { wash: dk, washOp: a, ink: null });
  for (const [dx, dy, r] of [[-.6, 0, .42], [-.15, -.22, .55], [.4, -.08, .46], [.85, .06, .3]]) paint(ellPts(x + dx * s, y + dy * s, r * s, r * s * .85, 16), { wash: col, washOp: a, ink: null });
}
// a puff of smoke (age 0..1)
function poof(x, y, s, age, key = 'pf', cols = ['#FFF2C8', '#F2D890']) {
  if (age < 0 || age > 1) return;
  boilSeed(key);
  glow(x, y, s * 1.6 * (1 - age), '#FFE0A0', .5 * (1 - age));
  for (let i = 0; i < 8; i++) { const a = i / 8 * TAU, r = s * (.3 + age * .9); paint(ellPts(x + Math.cos(a) * r, y + Math.sin(a) * r * .7, s * .35 * (1 - age * .6), s * .3 * (1 - age * .6), 12), { wash: cols[i % 2], washOp: 255 * (1 - age), ink: null }); }
}
// a little fire: a cluster of flame tongues on (x, y), s tall, k 0..1 grows it
function flames(x, y, s, t, k = 1, key = 'fl') {
  if (k <= 0) return;
  boilSeed(key);
  const h = s * k;
  glow(x, y - h * .4, h * 1.4, '#FF8A2E', .5 * k);
  for (let i = 0; i < 5; i++) {
    const dx = (i - 2) * h * .16, f = h * (.55 + .45 * Math.sin(t * 9 + i * 1.7) ** 2) * (1 - Math.abs(i - 2) * .18);
    paint([[x + dx - h * .12, y], [x + dx - h * .05, y - f * .6], [x + dx + Math.sin(t * 7 + i) * h * .06, y - f], [x + dx + h * .05, y - f * .55], [x + dx + h * .12, y]], { wash: i % 2 ? P10.flame : P10.flameDk, ink: null, curv: .5 });
  }
  paint([[x - h * .14, y], [x - h * .04, y - h * .45], [x + h * .03, y - h * .3], [x + h * .12, y]], { wash: P10.flameLt, ink: null, curv: .5 });
}
// steam rising from (x, y), age 0..1
function steam(x, y, s, age, key = 'stm') {
  if (age < 0 || age > 1) return;
  boilSeed(key);
  for (let i = 0; i < 7; i++) { const q = clamp(age * 1.3 - i * .06), r = s * (.2 + q * .5); paint(ellPts(x + Math.sin(i * 2.3) * s * .4 * q, y - q * s * 1.6 - i * s * .08, r, r * .8, 14), { wash: '#E6ECF4', washOp: 230 * (1 - age), ink: null }); }
}
// a toppled tree lying on the ground (its roots at x, y), h long, falling 0..1 (0 upright .. 1 down), dir ±1
function fallenTree(x, y, h, fall, dir = 1, key = 'ft', t = T) {
  push(); translate(x, y); rotate(dir * fall * Math.PI * .48); translate(-x, -y);
  tree(x, y, h, key, 0, ['#2E4A3A', '#1E3428', P10.ashoka]);
  pop();
}
// Sita's chudamani: a gold hair jewel with a big red stone and pearls, centred at (x, y), s wide; sparkle 0..1
function chudamani(x, y, s, sparkle = 0, key = 'cm', t = T) {
  boilSeed(key);
  if (sparkle > 0) glow(x, y, s * 2, '#FFB0A0', .5 * sparkle);
  paint(ellPts(x, y, s * .5, s * .42, 18), { wash: P10.gold, fill: '#C8922A', fillOp: 40, tex: .3, ink: P10.ink, sw: .8 });
  paint(ellPts(x, y, s * .28, s * .24, 14), { wash: '#D2283A', ink: P10.ink, sw: .6 });
  paint(ellPts(x - s * .08, y - s * .08, s * .08, s * .06, 8), { wash: '#FF9AA8', ink: null });
  for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; paint(ellPts(x + Math.cos(a) * s * .5, y + Math.sin(a) * s * .42, s * .07, s * .07, 8), { wash: '#FFF6EA', ink: P10.ink, sw: .3 }); }
  if (sparkle > 0) for (let i = 0; i < 4; i++) { const q = frac(t * 1.2 + i / 4), a = i * 1.7; paint(starPts(x + Math.cos(a) * s * .8, y + Math.sin(a) * s * .6 - q * s * .5, s * .2 * Math.sin(q * Math.PI) * sparkle, .35, 4), { wash: '#FFFFFF', ink: null }); }
}
// the Brahmastra's hold: glowing gold rings round a figure standing at (x, y), u its unit, k 0..1 (how many rings are on)
function ropes(x, y, u, k, t, key = 'rp', glowK = 1) {
  if (k <= 0) return;
  boilSeed(key);
  glow(x, y - 12 * u, 12 * u, '#FFE070', .2 * glowK);
  const n = 4;
  for (let i = 0; i < n; i++) {
    const q = clamp(k * n - i); if (q <= 0) continue;
    const yy = y - (6 + i * 3.4) * u, w = (i >= 2 ? 6 : 4.2) * u * (1.6 - .6 * easeOut(q)), E = ellPts(x, yy, w, u * .7, 18, 0, -.08 + .04 * Math.sin(t * 3 + i));
    inkLine([...E, E[0]], Math.max(1.5, u * .16), P10.rope, 'ink', .4);
  }
}
// the tail on fire: flames along a hanuman() tail (same o as the figure), k 0..1 how far the fire has spread from the tip
function tailFire(x, y, u, o, t, k = 1, key = 'tf') {
  if (k <= 0) return;
  const P = _hnmTailPts(o), fx = o.flip ? -1 : 1, L = P.length;
  for (let i = L - 1; i >= 0; i--) {
    if ((L - 1 - i) / (L - 1) > k) continue;
    const [a, b] = P[i]; flames(x + (o.dx || 0) * u + fx * a * u, y + (o.dy || 0) * u + b * u + u * .9, u * (2.6 + 1.2 * (i === L - 1)), t + i * .7, 1, key + i);
  }
}

// ---------- sets ----------
// the Ashoka grove at night (as in Part 9): dark sky, a moon, Sita's tree (trunk at tx)
function ashokaGrove(t, key = 'ag', tx = 300, th = 820) {
  boilSeed(key + 'sky');
  paint(rectPts(-600, -600, W + 1200, 2400), { wash: P10.grove, ink: null });
  paint(ellPts(540, 1150, 1000, 700, 26), { fill: P10.groveLo, fillOp: 200, bleed: .3, tex: .4, ink: null });
  glow(840, 520, 160, '#FFF4D2', .4); paint(ellPts(840, 520, 50, 50, 18), { wash: P10.moon, ink: null });
  boilSeed(key + 'stars'); for (let i = 0; i < 14; i++) paint(starPts(-100 + hash(i * 2.3) * 1300, 300 + hash(i * 6.7) * 500, 3 + 3 * hash(i * 3.3) * (.6 + .4 * Math.sin(t * 2 + i)), .4, 4), { wash: '#FFF6DA', ink: null });
  boilSeed(key + 'ground');
  paint(rectPts(-600, 1640, W + 1200, 1100), { wash: '#1E2A3A', ink: null });
  inkLine([[-100, 1640], [500, 1630], [1200, 1645]], .9, P10.ink, 'ink', .5);
  if (tx != null) ashokaTree(tx, 1660, th, key + 'tr', t);
}
function ashokaTree(tx, y, th, key, t) {
  tree(tx, y, th, key, Math.sin(t * .7) * .15, ['#2E4A3A', '#1E3428', P10.ashoka]);
  boilSeed(key + 'blooms');
  for (let i = 0; i < 18; i++) { const x = tx - th * .4 + hash(i * 2.7) * th * .8, yy = y - th * .98 + hash(i * 4.9) * th * .4; paint(ellPts(x, yy, 14, 12, 8), { wash: i % 2 ? P10.ashoka : P10.ashokaDk, ink: null }); }
}
// Lanka's rooftops at night: domes and flat roofs in rows; burn 0..1 reddens the sky and lights fires along them
// (fires appear roof by roof from left to right as burn grows)
function roofs(t, burn = 0, key = 'rf') {
  boilSeed(key + 'sky');
  paint(rectPts(-600, -800, W + 1200, 3200), { wash: mixCol(P10.night, P10.fireSky, burn), ink: null });
  paint(ellPts(540, 1250, 1200, 520, 26), { fill: mixCol(P10.nightLo, P10.fireSkyLo, burn), fillOp: 220, bleed: .3, tex: .4, ink: null });
  if (burn < .6) { boilSeed(key + 'st'); for (let i = 0; i < 16; i++) paint(starPts(-100 + hash(i * 2.3) * 1300, 300 + hash(i * 6.7) * 500, 3 + 3 * hash(i * 3.3), .4, 4), { wash: '#FFF6DA', washOp: 255 * (1 - burn / .6), ink: null }); }
  // far towers, then near roofs
  for (const [row, y0, sc, n] of [[0, 1260, .6, 11], [1, 1500, 1, 7]]) {
    boilSeed(key + 'row' + row);
    const col = mixCol(row ? P10.roof : P10.roofN, P10.roofDk, row ? .1 : .3), dk = row ? P10.roofDk : P10.roofNDk;
    for (let i = 0; i < n; i++) {
      const w = 150 * sc, x = -60 + i * (1200 / (n - 1)) + (row ? 0 : 40), h = (160 + 120 * hash(i * 3.7 + row)) * sc, y = y0 + 20 * hash(i * 1.3 + row);
      paint(rectPts(x - w / 2, y - h, w, h + 900), { wash: col, fill: dk, fillOp: 50, tex: .4, ink: P10.ink, sw: .8 });
      if (hash(i * 5.1 + row) > .4) paint(ellPts(x, y - h, w * .42, w * .36, 16), { wash: mixCol(col, P10.gold, .3), ink: P10.ink, sw: .8 });
      else paint(rectPts(x - w * .56, y - h - 12 * sc, w * 1.12, 16 * sc), { wash: dk, ink: P10.ink, sw: .6 });
      for (let j = 0; j < 2; j++) paint(rectPts(x - w * .25 + j * w * .3, y - h * .55, w * .18, h * .22), { wash: burn > 0 ? '#FFB050' : '#FFE9A0', washOp: 230, ink: null });
      const on = clamp((burn * (n + 2) - i) * 1.5);
      if (on > 0) flames(x, y - h - (hash(i * 5.1 + row) > .4 ? w * .3 : 0), 150 * sc, t + i, on, key + 'f' + row + i);
    }
  }
}
// Ravana's court: a plum hall with gold pillars and a gold glow behind his throne
function court(t, key = 'ct') {
  boilSeed(key);
  paint(rectPts(-600, -600, W + 1200, 3200), { wash: P10.hall, ink: null });
  paint(ellPts(540, 1150, 720, 700, 26), { fill: P10.hallLo, fillOp: 200, bleed: .3, tex: .4, ink: null });
  glow(640, 1150, 520, '#FFB050', .35);
  for (const x of [40, 1040]) { paint(rectPts(x - 60, 250, 120, 1420), { wash: P10.pillar, fill: P10.pillarDk, fillOp: 50, tex: .4, ink: P10.ink, sw: 1 }); paint(rectPts(x - 80, 230, 160, 50), { wash: P10.pillarDk, ink: P10.ink, sw: .9 }); }
  boilSeed(key + 'fl');
  paint(rectPts(-600, 1680, W + 1200, 1200), { wash: '#2A142A', ink: null });
  inkLine([[-100, 1680], [1200, 1680]], .9, P10.ink, 'ink', 0);
}
// the shore under burning Lanka: a red night, the city ablaze on the horizon, the sea; Hanuman stands in the shallows
function nightShore(t, key = 'ns') {
  boilSeed(key + 'sky');
  paint(rectPts(-600, -800, W + 1200, 2300), { wash: P10.fireSky, ink: null });
  paint(ellPts(540, 1250, 1100, 380, 26), { fill: P10.fireSkyLo, fillOp: 220, bleed: .3, tex: .4, ink: null });
  boilSeed(key + 'city');
  for (let i = 0; i < 10; i++) { const x = 60 + i * 105, h = 80 + 140 * hash(i * 4.7); paint(rectPts(x - 34, 1300 - h, 68, h + 20), { wash: '#4A2030', ink: null }); if (i % 2 === 0) flames(x, 1300 - h, 90, t + i, 1, key + 'f' + i); }
  boilSeed(key + 'sea');
  paint(rectPts(-600, 1300, W + 1200, 1600), { wash: P10.sea, ink: null });
  paint(rectPts(-600, 1300, W + 1200, 30), { wash: '#E2783A', washOp: 120, ink: null });
  for (let i = 0; i < 12; i++) { const r = hash(i * 2.3), yy = 1330 + r * r * 700, x = 1500 - frac(hash(i * 7.7) + t * .02) * 2200; inkLine([[x, yy], [x + 40, yy - 8], [x + 80, yy]], 1.6, i % 3 ? P10.seaLt : '#F2A070', 'inkfine', .5); }
}
// the shore at dawn (the Part 11 tease): a peach sky, the sea, the sand
function dawnShore(t, key = 'ds') {
  boilSeed(key + 'sky');
  paint(rectPts(-600, -800, W + 1200, 2300), { wash: P10.dawnHi, ink: null });
  paint(ellPts(540, 1250, 1100, 420, 26), { fill: P10.dawnLo, fillOp: 230, bleed: .3, tex: .4, ink: null });
  glow(760, 1250, 300, '#FFD890', .5); paint(ellPts(760, 1260, 80, 80, 20), { wash: '#FFE6B0', ink: null });
  boilSeed(key + 'sea');
  paint(rectPts(-600, 1300, W + 1200, 400), { wash: P10.dawnSea, ink: null });
  for (let i = 0; i < 10; i++) { const r = hash(i * 2.3), yy = 1320 + r * 330, x = 1500 - frac(hash(i * 7.7) + t * .03) * 2200; inkLine([[x, yy], [x + 50, yy - 8], [x + 100, yy]], 1.6, '#BFE0F2', 'inkfine', .5); }
  boilSeed(key + 'sand');
  paint(rectPts(-600, 1640, W + 1200, 1200), { wash: P10.sand, fill: P10.sandDk, fillOp: 50, tex: .5, ink: null });
  inkLine([[-100, 1640], [500, 1634], [1200, 1646]], 1, P10.ink, 'ink', .5);
}

// ---------- the cast ----------
// a rakshasa guard: Chanda's or Munda's rig, small, with a spear-less khadga; o.kind picks
function guard(x, y, u, o = {}) { asura(x, y, u, { kind: 'chanda', shield: false, ...o }); }
// Akshaya, Ravana's young son: Nishumbha's teal with a little crown, no shield
function akshaya(x, y, u, o = {}) { asura(x, y, u, { kind: 'nishumbha', shield: false, horns: 'short', ...o }); }
// Indrajit (Meghanada), Ravana's eldest son: Shumbha's violet and tall crown, a bow in his left hand (heldBow)
function indrajit(x, y, u, o = {}) { asura(x, y, u, { kind: 'shumbha', sword: false, shield: false, horns: 'short', ...o }); }
// Vibhishana, Ravana's good brother: a gentle rakshasa (Dhumra's grey, kind eyes, no weapons), a small crown
function vibhishana(x, y, u, o = {}) { asura(x, y, u, { kind: 'nishumbha', sword: false, shield: false, horns: 'none', stache: false, tusks: false, pal: { skin: '#7E9AC0', skinDk: '#5E789E', skinLt: '#A8C0DE', dhoti: '#E8A33A', dhotiDk: '#B67D1C', sash: '#F2E6C8', sashDk: '#C8B890' }, ...o }); }
