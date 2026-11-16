// hanu6_props.js: sets and props for hanu6.js (ad 94, Hanuman Part 6, "RAVANA could lift MOUNTAINS. He couldn't lift
// LAKSHMAN."). Loaded after src/scenes/hanu4_props.js (H4, h4Bubble), src/scenes/hanu5_props.js (H5, h5Field) and
// src/scenes/rp12_props.js (battlefield, warChariot, vanara: Ramayan Part 12's, loaded from those branches so this one
// stands alone). Pure functions of their arguments (and T for boil). Sets stay inside x -300..1380.
//   H6                                   the palette
//   h6Night                              a night sky over Ayodhya's roofs (the next-part tease)
//   h6Spear                              Brahma's spear, the shakti: blazing, trailing smoke and fire
//   h6Peak, h6Worlds                     a small mountain with its name, the three worlds as a stacked toy (bubbles)
//   h6Herbs                              the herb mountain, small (the tease)
//   h6Impact, h6Dizzy, h6Quake           a comic hit burst, stars circling a head, ground cracks
const H6 = {
  ink: '#2B2233', gold: '#F5C542', goldLt: '#FFE69A', fire: '#FF8A2A', fireLt: '#FFE08A', smoke: '#6E5A6A',
  snow: '#EEF2FA', snowDk: '#B8C2DA', rock: '#8A7A9A', rockDk: '#5E5272', moss: '#5E9A6A',
  night: '#1C2350', nightLo: '#3A3C78', roof: '#2A2648', roofLt: '#3E3A66', lamp: '#FFD27A',
  heaven: '#FFE6A0', earth: '#7EC08A', under: '#7A6AB8',
};

// a night sky over Ayodhya: deep blue, stars, a moon, rooftops along the bottom (y > 1720)
function h6Night(t, key = 'nt') {
  boilSeed(key + 'sky');
  paint(rectPts(-300, -600, W + 600, 2600), { wash: H6.night, ink: null });
  paint(ellPts(540, 1500, 1100, 700, 26), { fill: H6.nightLo, fillOp: 200, bleed: .3, tex: .4, ink: null });
  glow(860, 760, 170, '#FFF4D2', .45); paint(ellPts(860, 760, 56, 56, 18), { wash: '#FFF4D2', ink: null });
  boilSeed(key + 'st'); for (let i = 0; i < 22; i++) paint(starPts(-100 + hash(i * 2.3) * 1300, 380 + hash(i * 6.7) * 1100, 3 + 3 * hash(i * 3.3) * (.6 + .4 * Math.sin(t * 2 + i)), .4, 4), { wash: '#FFF6DA', ink: null });
  boilSeed(key + 'roofs');
  const R = [[-200, 1760, 260, 120], [80, 1730, 200, 200], [300, 1770, 240, 110], [560, 1700, 180, 260], [760, 1760, 260, 130], [1020, 1740, 300, 170]];
  for (const [x, y, w, h] of R) {
    paint(rectPts(x, y, w, 900), { wash: H6.roof, ink: null });
    paint([[x - 10, y], [x + w / 2, y - h * .35], [x + w + 10, y]], { wash: H6.roofLt, ink: null });
    for (let j = 0; j < 2; j++) paint(rectPts(x + w * (.25 + j * .35), y + 40, 22, 30), { wash: H6.lamp, ink: null });
  }
}

// Brahma's spear (Yuddha 59.107–108: blazing, smoky, like fire): its tip at (x, y), pointing along angle a (0 = screen
// right), len px long; flames trail behind the head, smoke behind that
function h6Spear(x, y, len, a, t, key = 'sp') {
  const ca = Math.cos(a), sa = Math.sin(a), P = (d, n = 0) => [x - ca * d - sa * n, y - sa * d + ca * n], k = len / 400;
  glow(x, y, 200 * k, H6.fire, .7); glow(x, y, 90 * k, '#FFFFFF', .6);
  boilSeed(key + 'smoke');
  for (let i = 0; i < 6; i++) { const q = frac(t * 2 + i / 6), [sx, sy] = P(len * (.5 + q * .9), Math.sin(i * 2.1 + t * 6) * 22 * k * q); paint(ellPts(sx, sy, 26 * k * (.5 + q), 22 * k * (.5 + q), 12), { wash: H6.smoke, washOp: 140 * (1 - q), ink: null }); }
  boilSeed(key + 'fire');
  for (let j = 3; j >= 0; j--) paint(ribbon([P(len * .12), P(len * (.35 + j * .1), Math.sin(t * 30 + j) * 8 * k), P(len * (.55 + j * .14), Math.sin(t * 40 + j) * 14 * k)], (34 - j * 6) * k, 2), { wash: ['#FFF6D0', H6.fireLt, H6.fire, '#E2452A'][j], washOp: 230, ink: null });
  boilSeed(key);
  paint(ribbon([P(len * .2), P(len)], 9 * k, 8 * k), { wash: '#C8922A', fill: '#8A5A1E', fillOp: 60, ink: H6.ink, sw: 1 });
  paint([P(0), P(len * .22, -24 * k), P(len * .16, 0), P(len * .22, 24 * k)], { wash: '#FFF2C0', fill: H6.fireLt, fillOp: 80, ink: H6.ink, sw: 1, curv: .2 });
}

// a small mountain, its foot centred at (x, y), s wide (s * .9 tall), snow-capped; name under it (a label for the bubble)
function h6Peak(x, y, s, name, key = 'pk', col = H6.rock) {
  boilSeed(key);
  const h = s * .9;
  paint([[x - s * .5, y], [x - s * .22, y - h * .6], [x - s * .05, y - h], [x + s * .14, y - h * .78], [x + s * .5, y]], { wash: col, fill: H6.rockDk, fillOp: 60, tex: .4, ink: H6.ink, sw: 1, curv: .2 });
  paint([[x - s * .17, y - h * .72], [x - s * .05, y - h], [x + s * .12, y - h * .8], [x + s * .04, y - h * .74], [x - s * .06, y - h * .8]], { wash: H6.snow, ink: null, curv: .3 });
  if (name) letter(name, x, y + s * .17, s * .25, '#FFFFFF', { stroke: H6.ink, sw: .2, ink: false, rot: 0 });
}
// the three worlds as one stacked toy: heaven (gold, with tiny devas' crowns), earth (green), the netherworld (violet);
// centred at (x, y), s across
function h6Worlds(x, y, s, t, key = 'wd') {
  boilSeed(key);
  const tier = (cy, w, col, dk) => paint(ellPts(x, y + cy * s, w * s, .17 * s, 22), { wash: col, fill: dk, fillOp: 50, tex: .3, ink: H6.ink, sw: .9 });
  tier(.3, .5, H6.under, '#4E3E8A');
  tier(0, .44, H6.earth, '#4E8A5A');
  tier(-.3, .38, H6.heaven, '#D2A84A');
  for (let i = 0; i < 4; i++) { const cx = x + (-.24 + i * .16) * s, cy = y - .38 * s; paint([[cx - .04 * s, cy], [cx - .05 * s, cy - .07 * s], [cx - .02 * s, cy - .04 * s], [cx, cy - .09 * s], [cx + .02 * s, cy - .04 * s], [cx + .05 * s, cy - .07 * s], [cx + .04 * s, cy]], { wash: H6.gold, ink: H6.ink, sw: .4 }); }
  for (let i = 0; i < 3; i++) { const cx = x + (-.2 + i * .2) * s; paint([[cx - .05 * s, y - .02 * s], [cx, y - .12 * s], [cx + .05 * s, y - .02 * s]], { wash: '#3E7A4A', ink: null }); }
}
// the herb mountain, small: a peak with glowing dots of herbs, a torn rocky underside; foot centred at (x, y), s wide
function h6Herbs(x, y, s, t, key = 'hb') {
  glow(x, y - s * .4, s * .9, '#C8FFD0', .35);
  boilSeed(key + 'u');
  paint([[x - s * .5, y], [x - s * .2, y + s * .2], [x + s * .1, y + s * .26], [x + s * .5, y]], { wash: H6.rockDk, ink: H6.ink, sw: .8, curv: .3 });
  h6Peak(x, y, s, null, key, H6.rock);
  boilSeed(key + 'moss');
  paint([[x - s * .44, y - 4], [x - s * .2, y - s * .4], [x + s * .1, y - s * .36], [x + s * .44, y - 4]], { wash: H6.moss, ink: null, curv: .5 });
  for (let i = 0; i < 9; i++) { const hx = x + (-.36 + .72 * hash(i * 2.7)) * s, hy = y - (.06 + .28 * hash(i * 4.1)) * s; glow(hx, hy, s * .08, ['#FFF0A0', '#C8FFD0', '#FFD0D8', '#D0E8FF'][i % 4], .8); paint(ellPts(hx, hy, s * .025, s * .025, 8), { wash: '#FFFFFF', ink: null }); }
}

// a comic hit: a jagged burst at (x, y), s across, age 0..1 (pops, then shrinks)
function h6Impact(x, y, s, age, key = 'im', col = '#FFF2A0') {
  if (age < 0 || age > 1) return;
  const k = backOut(clamp(age * 6)) * (1 - seg(age, .5, 1));
  if (k <= .01) return;
  boilSeed(key);
  glow(x, y, s * 1.4 * k, '#FFFFFF', .7 * k);
  paint(starPts(x, y, s * .5 * k, .5, 9, age * .5), { wash: col, ink: H6.ink, sw: 1.4 });
  paint(starPts(x, y, s * .26 * k, .5, 9, .3 + age * .5), { wash: '#FFFFFF', ink: null });
}
// dizzy stars circling over (x, y), r the orbit's half-width
function h6Dizzy(x, y, r, t, key = 'dz', n = 3) {
  boilSeed(key);
  for (let i = 0; i < n; i++) { const a = t * 5 + i / n * TAU; paint(starPts(x + Math.cos(a) * r, y + Math.sin(a) * r * .35, r * .22, .45, 5), { wash: H6.gold, ink: H6.ink, sw: .6 }); }
}
// cracks in the ground, spreading from (x, y) by k 0..1
function h6Quake(x, y, s, k, key = 'qk') {
  if (k <= 0) return;
  boilSeed(key);
  for (let i = 0; i < 5; i++) {
    const a = Math.PI + (i / 4) * Math.PI, L = s * k * (.6 + .4 * hash(i * 3.1));
    const P = [[x, y]]; for (let j = 1; j <= 3; j++) P.push([x + Math.cos(a) * L * j / 3 + (hash(i * 7 + j) - .5) * 20, y - Math.sin(a) * L * j / 3 * .25 + (hash(i * 5 + j) - .5) * 8]);
    inkLine(P, 2.2, H6.ink, 'ink', 0);
  }
}
