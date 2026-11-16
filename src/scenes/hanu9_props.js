// hanu9_props.js: sets, props and the extra cast for hanu9.js (Hanuman series Part 9, "The moment HANUMAN left, ARJUNA's
// chariot turned to ASH"). Loaded after src/hanuman_series.js, src/dashavatar.js (arjuna()), src/surya.js (the chariot
// and horses) and hanu7_props.js (h7Flames, h7Bow). Pure functions of their arguments (and T, the boil clock).
//   H9                                   the palette
//   h9Field(t, key, o)                   Kurukshetra: a dusty plain, far armies with spears and pennants, o.mode 'day' |
//                                        'dusk' | 'night', o.tents (the camp)
//   h9Grove(t, key, gy)                  the plantain grove on Gandhamadana (the recap)
//   h9Banner(x, y, h, t, key, o)         a pole with a crossbar and a hanging cloth; the gold ape badge (o.badge 0..1) or
//                                        Karna's elephant rope (o.kind 'rope'); returns the perch on top of the crossbar
//   h9Chariot(x, y, s, t, o)             Arjuna's chariot: white horses (o.horses false: out of frame), the banner at the
//                                        back, o.riders(seat, cu), o.cracks 0..1 (burnt from inside, still standing)
//   h9Perch(x, y, s, o)                  where the ape sits on that chariot's banner
//   h9Ash(x, y, w, t, key, k)            a heap of ash, smoke and embers
//   h9Rings(x, y, r, age, key, n)        a roar: rings of sound
//   h9Arrow(x, y, a, len, key, blaze)    an arrow in flight, its head at (x, y); blaze 0..1 a burning astra
//   bhima(), karna(), drona(), h9Soldier()   the cast, on Ram's and the rishi's rigs
const H9 = {
  ink: '#2B2233', gold: '#F5C542', goldDk: '#B88A1C', goldLt: '#FFE69A', cream: '#FFF5E2',
  dayHi: '#EBA868', day: '#F9DDA8', dusk: '#C8644A', duskLo: '#F2B078', night: '#2E2748', nightLo: '#6A4E7A',
  earth: '#C9A06E', earthDk: '#A07848', flag: '#E8862E', flagDk: '#B85E18', wood: '#8A5A32',
  ash: '#6E6A7A', ashDk: '#4A4658', ashLt: '#A6A2B2', leaf: '#5E9A5A', leafDk: '#3E7444', leafLt: '#8EC47A',
  hill: '#9CC4A4', hillDk: '#6E9E82', armyA: '#8A4A44', armyB: '#4A5A80', fire: '#FF8A2A', fireLt: '#FFE08A',
};

// ---------- sets ----------
function h9Field(t, key = 'kf', o = {}) {
  const hy = o.hy ?? 1420, m = o.mode || 'day';
  const [hi, lo, sun] = m === 'dusk' ? [H9.dusk, H9.duskLo, '#FFD9A0'] : m === 'night' ? [H9.night, H9.nightLo, '#FFE9C0'] : [H9.dayHi, H9.day, '#FFF6D8'];
  const dim = m === 'night' ? .5 : m === 'dusk' ? .15 : 0;
  boilSeed(key + 'sky');
  paint(rectPts(-300, -800, W + 600, hy + 900), { wash: hi, ink: null });
  paint(ellPts(540, hy - 160, 1000, 440, 26), { fill: lo, fillOp: 220, bleed: .3, tex: .4, ink: null });
  if (o.sun !== false) { const sx = o.sx ?? 800, sy = o.sy ?? hy - 200; glow(sx, sy, 300, sun, .4); paint(ellPts(sx, sy, 66, 66, 20), { wash: sun, ink: null }); }
  if (m === 'night') { boilSeed(key + 'st'); for (let i = 0; i < 18; i++) paint(starPts(-100 + hash(i * 2.3) * 1300, hy - 1100 + hash(i * 6.7) * 800, 3 + 3 * hash(i * 3.3) * (.6 + .4 * Math.sin(t * 2 + i)), .4, 4), { wash: '#FFF6DA', ink: null }); }
  if (o.army !== 0) for (const side of [-1, 1]) {
    boilSeed(key + 'army' + side);
    const col = mixCol(side < 0 ? H9.armyA : H9.armyB, hi, .4), x0 = side < 0 ? -260 : 780, x1 = side < 0 ? 300 : 1340;
    paint([[x0, hy + 10], [x0, hy - 44], [lerp(x0, x1, .25), hy - 58], [lerp(x0, x1, .5), hy - 50], [lerp(x0, x1, .75), hy - 60], [x1, hy - 40], [x1, hy + 10]], { wash: col, ink: null, curv: .4 });
    for (let i = 0; i < 14; i++) {
      const x = lerp(x0 + 20, x1 - 20, i / 13), h = 60 + 50 * hash(i * 3.7 + side);
      inkLine([[x, hy - 40], [x - side * 6, hy - 40 - h]], 1.6, col, 'ink', 0);
      if (i % 4 === 1) paint([[x - side * 6, hy - 40 - h], [x - side * 40, hy - 30 - h], [x - side * 6, hy - 18 - h]], { wash: side < 0 ? '#C8463A' : '#3E6AB8', ink: null });
    }
  }
  if (o.tents) {
    boilSeed(key + 'tents');
    for (const [x, s] of o.tents) {
      paint([[x - s, hy + 6], [x, hy - s * 1.1], [x + s, hy + 6]], { wash: mixCol('#F2E2C4', hi, dim + .15), fill: mixCol('#C8B08A', hi, dim), fillOp: 60, tex: .4, ink: H9.ink, sw: .8, curv: .08 });
      paint([[x - s * .16, hy + 6], [x, hy - s * .5], [x + s * .16, hy + 6]], { wash: mixCol('#6A4A3A', hi, dim), ink: null });
      inkLine([[x, hy - s * 1.1], [x, hy - s * 1.45]], 1.6, H9.wood, 'ink', 0);
      paint([[x, hy - s * 1.45], [x + s * .3, hy - s * 1.37], [x, hy - s * 1.29]], { wash: '#3E6AB8', ink: null });
    }
  }
  boilSeed(key + 'field');
  paint(rectPts(-300, hy, W + 600, 1600), { wash: mixCol(H9.earth, H9.night, dim), fill: mixCol(H9.earthDk, H9.night, dim), fillOp: 60, tex: .5, ink: null });
  inkLine([[-200, hy + 2], [600, hy - 6], [1300, hy + 6]], 1, H9.ink, 'ink', .4);
  boilSeed(key + 'tufts');
  for (let i = 0; i < 8; i++) { const x = -40 + hash(i * 9.1) * 1160, y = hy + 90 + hash(i * 3.7) * 500; inkLine([[x - 16, y], [x, y - 4], [x + 18, y]], 1.2, mixCol(H9.earthDk, H9.ink, .3), 'inkfine', .5); }
}

function h9Plantain(x, y, s, t, key = 'pl') {
  boilSeed(key);
  paint(ribbon([[x, y], [x + s * .03, y - s * .5], [x, y - s]], s * .12, s * .07), { wash: '#B8C87A', fill: '#8EA052', fillOp: 50, tex: .3, ink: H9.ink, sw: .8 });
  for (let i = 0; i < 5; i++) {
    const a = -1.3 + i * .65 + .04 * Math.sin(t * 1.5 + i);
    push(); translate(x, y - s); rotate(a);
    paint(ellPts(0, -s * .36, s * .12, s * .38, 14), { wash: i % 2 ? H9.leaf : H9.leafLt, fill: H9.leafDk, fillOp: 40, tex: .3, ink: H9.ink, sw: .7 });
    inkLine([[0, 0], [0, -s * .7]], 1, H9.leafDk, 'inkfine', 0);
    pop();
  }
}
function h9Grove(t, key = 'gv', gy = 1700) {
  boilSeed(key + 'sky');
  paint(rectPts(-300, -800, W + 600, gy + 900), { wash: '#FBE3B8', ink: null });
  paint(ellPts(540, gy - 520, 900, 520, 24), { fill: '#FFF6DC', fillOp: 210, bleed: .3, ink: null });
  boilSeed(key + 'hill');
  paint([[-300, gy - 200], [0, gy - 480], [260, gy - 640], [520, gy - 520], [800, gy - 700], [1100, gy - 480], [1380, gy - 300], [1380, gy + 10], [-300, gy + 10]], { wash: H9.hill, fill: H9.hillDk, fillOp: 50, tex: .4, ink: null, curv: .4 });
  h9Plantain(60, gy - 40, 520, t, key + 'p0'); h9Plantain(1010, gy - 50, 560, t, key + 'p1'); h9Plantain(420, gy - 70, 360, t, key + 'p2'); h9Plantain(760, gy - 70, 330, t, key + 'p3');
  boilSeed(key + 'gr');
  paint(rectPts(-300, gy - 70, W + 600, 1400), { wash: '#B4D084', fill: '#86AE5E', fillOp: 60, tex: .5, ink: null });
  inkLine([[-200, gy - 68], [540, gy - 76], [1300, gy - 66]], 1, H9.ink, 'ink', .4);
  // the narrow path
  paint([[-300, gy + 20], [400, gy - 10], [1380, gy + 30], [1380, gy + 190], [400, gy + 150], [-300, gy + 200]], { wash: '#E2C89A', fill: '#C4A474', fillOp: 50, tex: .5, ink: null, curv: .3 });
}

// ---------- props ----------
function h9Banner(x, y, h, t, key = 'bn', o = {}) {
  const w = o.w ?? h * .25, ch = o.ch ?? h * .34, ty = y - h, sway = (o.still ? 0 : 1) * Math.sin(t * 4 + (o.ph || 0)) * w * .12;
  const col = o.col || H9.flag, dk = o.dk || H9.flagDk, pw = Math.max(3, w * .09);
  boilSeed(key + 'pole');
  paint(rectPts(x - pw / 2, ty, pw, h), { wash: H9.wood, fill: '#5E3A1C', fillOp: 50, tex: .4, ink: H9.ink, sw: clamp(pw / 14, .5, 1.2) });
  paint(rrPts(x - w * .64, ty - pw * .45, w * 1.28, pw * .9, pw * .4), { wash: H9.wood, fill: '#5E3A1C', fillOp: 50, ink: H9.ink, sw: clamp(pw / 14, .5, 1.2) });
  for (const s of [-1, 1]) paint(ellPts(x + s * w * .64, ty, pw * .9, pw * .9, 10), { wash: H9.gold, ink: H9.ink, sw: .6 });
  boilSeed(key + 'cloth');
  paint([[x - w * .55, ty + pw * .4], [x + w * .55, ty + pw * .4], [x + w * .55 + sway, ty + ch * .8], [x + sway * 1.4, ty + ch], [x - w * .55 + sway, ty + ch * .8]], { wash: col, fill: dk, fillOp: 50, tex: .4, ink: H9.ink, sw: 1, curv: .12 });
  const bk = clamp(o.badge ?? 1), bx = x + sway * .6, by = ty + ch * .42, r = w * .3;
  if (bk > .02) {
    boilSeed(key + 'badge');
    if (o.kind === 'rope') {   // the hastikakshya, an elephant's girth rope, jewelled, with little bells
      for (let i = 0; i < 3; i++) paint(ellPts(bx, by - r * .5 + i * r * .5, r * (1 - i * .14), r * .3, 14), { wash: i % 2 ? '#E2452B' : H9.gold, washOp: 255 * bk, ink: H9.ink, sw: .6 });
      for (const s of [-1, 1]) paint(ellPts(bx + s * r * .7, by + r * .8, r * .14, r * .16, 8), { wash: H9.goldLt, ink: H9.ink, sw: .4 });
    } else {                   // the ape: a gold disc with his face
      paint(ellPts(bx, by, r, r, 16), { wash: H9.gold, washOp: 255 * bk, ink: bk > .6 ? H9.ink : null, sw: .7 });
      if (bk > .6) {
        for (const s of [-1, 1]) paint(ellPts(bx + s * r * .62, by - r * .1, r * .22, r * .26, 10), { wash: '#D9762E', ink: H9.ink, sw: .5 });
        paint(ellPts(bx, by, r * .56, r * .6, 14), { wash: '#D9762E', ink: H9.ink, sw: .5 });
        paint(ellPts(bx, by + r * .12, r * .4, r * .36, 12), { wash: '#F6CFA0', ink: null });
        for (const s of [-1, 1]) paint(ellPts(bx + s * r * .2, by - r * .08, r * .07, r * .09, 8), { wash: H9.ink, ink: null });
        inkLine([[bx - r * .14, by + r * .26], [bx, by + r * .33], [bx + r * .14, by + r * .26]], .9, H9.ink, 'inkfine', .5);
      }
    }
  }
  return [x, ty - pw * .5];
}
// Arjuna's chariot, facing screen right: (x, y) the ground under the wheel, s about its length. cu = s / 10 is the car's
// unit: the banner pole stands at the back (-5.6 cu), its crossbar 20 cu above the ground, so the cloth clears the riders
const h9Pole = 12;
function h9Perch(x, y, s, o = {}) { const cu = s / 10; return [x - 5.6 * cu, y - 8 * cu - (o.pole ?? h9Pole) * cu - cu * .14]; }
function h9Chariot(x, y, s, t, o = {}) {
  const u = s / 14, cu = s / 10, gal = (o.run ?? 0) * t * 1.6, key = o.key || 'h9c';
  if (o.horses !== false) for (const [dx, dy, k] of [[11.5, -1, 'a'], [14.5, .6, 'b']])
    suryaHorse(x + dx * u, y - 6 * u + dy * u, u * .75, { boilKey: key + 'h' + k, gallop: frac(gal + (k === 'b' ? .3 : 0)), coat: '#FBF9FF', coatDk: '#CFD0E2', mane: '#E6E2F0' });
  if (o.banner !== false) h9Banner(x - 5.6 * cu, y - 8 * cu, (o.pole ?? h9Pole) * cu, t, key + 'bn', { w: 3 * cu, ch: 4 * cu, badge: o.badge ?? 1, kind: o.kind, col: o.col, dk: o.dk, still: o.still });
  boilSeed(key + 'backwall');
  paint([[-6.4, -7.6], [5.6, -7.6], [6.2, -12.4], [-6, -13.4]].map(([a, b]) => [x + a * cu, y + b * cu]), { wash: SUR.goldDk, fill: mixCol(SUR.goldDk, PAL.ink, .3), fillOp: 60, tex: .6, ink: SUR.ink, sw: clamp(cu / 20, .4, 2) * .8, curv: .2 });
  if (o.riders) o.riders(suryaChariotSeat(x, y, cu), cu);
  suryaChariot(x, y, cu, { part: 'front', boilKey: key + 'c', spin: gal * 3, pole: o.horses !== false ? [x + 11 * u, y - 4 * u] : [x + 16 * cu, y - 5 * cu] });
  const ck = clamp(o.cracks ?? 0);
  if (ck > .02) {   // burnt from within: the gold goes dark, cracks glow
    boilSeed(key + 'char');
    paint([[-6.6, -7.4], [6.2, -7.4], [7.8, -11.8], [5.6, -12.2], [4.4, -10.4], [-4.8, -10.6], [-6.2, -12.6], [-7.2, -12]].map(([a, b]) => [x + a * cu, y + b * cu]), { wash: '#2A1E24', washOp: 150 * ck, ink: null, curv: .3 });
    const fl = .7 + .3 * Math.sin(t * 9);
    for (const L of [[[-5.4, -11.6], [-4.2, -9.8], [-4.8, -8.6], [-3.4, -7.6]], [[-1.2, -10.4], [-.2, -9.2], [-1, -8.4], [.4, -7.5]], [[3.4, -10.4], [2.6, -9.4], [3.6, -8.6], [3, -7.6]], [[5.8, -11.8], [5.2, -10.2], [6, -9]]])
      inkLine(L.map(([a, b]) => [x + a * cu, y + b * cu]), 2.6 * ck * fl, H9.fire, 'ink', 0);
    glow(x, y - 9.4 * cu, 5 * cu, H9.fire, .3 * ck * fl);
  }
}
function h9Ash(x, y, w, t, key = 'as', k = 1) {
  if (k <= .02) return;
  boilSeed(key);
  const h = w * .3 * k;
  paint([[x - w * .5, y + 6], [x - w * .3, y - h * .6], [x - w * .05, y - h], [x + w * .22, y - h * .7], [x + w * .5, y + 6]], { wash: H9.ash, fill: H9.ashDk, fillOp: 70, tex: .6, ink: H9.ink, sw: 1, curv: .5 });
  paint([[x - w * .2, y - h * .5], [x - w * .02, y - h * .86], [x + w * .12, y - h * .56]], { wash: H9.ashLt, washOp: 160, ink: null, curv: .5 });
  // one wheel rim left in the heap
  inkLine(ellPts(x + w * .3, y - h * .2, w * .1, w * .035, 14).slice(0, 9), 3, H9.ashDk, 'ink', .4);
  for (let i = 0; i < 4; i++) { const q = frac(t * .45 + i / 4); paint(ellPts(x - w * .3 + i * w * .2 + Math.sin(q * 6 + i) * 20, y - h - q * w * .5, w * .05 * (1 - q) + 8, w * .04 * (1 - q) + 6, 10), { wash: '#8E8A9A', washOp: 150 * (1 - q) * k, ink: null }); }
  for (let i = 0; i < 6; i++) { const q = frac(t * .7 + i / 6 + hash(i) * .3); paint(starPts(x - w * .4 + hash(i * 2.7) * w * .8 + Math.sin(q * 5 + i) * 10, y - h * .6 - q * w * .45, 5 * (1 - q) + 1, .5, 4), { wash: i % 2 ? H9.fire : H9.fireLt, ink: null }); }
}
function h9Rings(x, y, r, age, key = 'rg', n = 3, col = '#FFF6D8') {
  if (age < 0) return;
  boilSeed(key);
  for (let i = 0; i < n; i++) { const a = age - i * .16; if (a < 0 || a > .9) continue; const q = a / .9, E = ellPts(x, y, r * (.25 + q), r * (.25 + q) * .8, 26); E.push(E[0], E[1]); paint(ribbon(E, (9 * (1 - q) + 2) * clamp(r / 300, .25, 1.6)), { wash: col, washOp: 235 * (1 - q * .6), ink: null }); }
}
function h9Arrow(x, y, a, len = 150, key = 'ar', blaze = 0) {
  boilSeed(key);
  const ca = Math.cos(a), sa = Math.sin(a), tail = [x - ca * len, y - sa * len];
  if (blaze > 0) { glow(x, y, len * .6 * blaze, H9.fire, .6); for (let i = 0; i < 4; i++) { const d = len * (.2 + i * .28), r = len * .16 * (1 - i * .18); paint(ellPts(x - ca * d, y - sa * d, r * 1.3, r, 10), { wash: i < 2 ? H9.fireLt : H9.fire, washOp: 230 - i * 40, ink: null }); } }
  inkLine([tail, [x, y]], 2.8, '#6A4A2A', 'ink', 0);
  paint([[x, y], [x - ca * 22 - sa * 9, y - sa * 22 + ca * 9], [x - ca * 22 + sa * 9, y - sa * 22 - ca * 9]], { wash: blaze > 0 ? '#FFFFFF' : '#C9CCD8', ink: H9.ink, sw: .6 });
  for (const s of [-1, 1]) paint([[tail[0] + ca * 30, tail[1] + sa * 30], [tail[0] - sa * s * 11, tail[1] + ca * s * 11], [tail[0], tail[1]]], { wash: '#E8D6B0', ink: H9.ink, sw: .5 });
}

// ---------- the cast ----------
// Bhima in exile: a big, broad Pandava, no crown, a red dhoti
const BHIMA_PAL = { skin: '#EDB98A', skinDk: '#C68E60', skinLt: '#FFDAB2', dhoti: '#B8402E', dhotiDk: '#8A2A1E', dhotiLt: '#E0705A', border: '#F2C230', bead: '#7A4426', beadDk: '#52290F', tulsi: '#A86A3A' };
function bhima(x, y, u, o = {}) { return ram(x, y, u, { crown: false, topknot: true, shawl: false, kodanda: false, brawn: 1, ...o, pal: { ...BHIMA_PAL, ...(o.pal || {}) } }); }
// Karna: gold and red, his earrings bright
const KARNA_PAL = { skin: '#E2A674', skinDk: '#BA7C4C', skinLt: '#F8CC9E', dhoti: '#C8322E', dhotiDk: '#8E1E1E', dhotiLt: '#F06A5A', border: '#F2C230', shawl: '#F2B02E', shawlDk: '#C0801A' };
function karna(x, y, u, o = {}) { return ram(x, y, u, { crown: 'small', ...o, pal: { ...KARNA_PAL, ...(o.pal || {}) } }); }
// Drona: the old teacher, white beard, white cloth
function drona(x, y, u, o = {}) { return rishi(x, y, u, 0, { ...o, pal: { dhoti: '#F4EEDC', dhotiDk: '#CFC6AC', dhotiLt: '#FFFFFF', border: '#8A5A32', shawl: '#F4EEDC', shawlDk: '#CFC6AC', ...(o.pal || {}) } }); }
// a foot soldier: a helmet, a spear in his right hand (i picks his colours)
const H9_ARMY = [{ skin: '#D9A27A', skinDk: '#B47A54', skinLt: '#F0C4A0', dhoti: '#8A3A3A', dhotiDk: '#5E2424', dhotiLt: '#B86A62', border: '#F2C230' }, { skin: '#C48A62', skinDk: '#9C6642', skinLt: '#E2B08A', dhoti: '#5A4A7A', dhotiDk: '#3A2E56', dhotiLt: '#8A7AAA', border: '#F2C230' }, { skin: '#E6B48A', skinDk: '#C28C62', skinLt: '#F8D2B0', dhoti: '#7A5A2E', dhotiDk: '#54401E', dhotiLt: '#AA8A5A', border: '#C8463A' }];
function h9Soldier(x, y, u, i = 0, o = {}) {
  const helmet = (uu, sw) => { boilSeed('helm' + i); paint(U([[-3.4, -21.3], [-3.1, -23.6], [-1.6, -24.9], [0, -25.3], [1.6, -24.9], [3.1, -23.6], [3.4, -21.3]], uu), { wash: '#A8AEC0', fill: '#7A8096', fillOp: 60, tex: .3, ink: H9.ink, sw: sw * .7, curv: .4 }); paint(U([[-.5, -25.2], [0, -27], [.5, -25.2]], uu), { wash: H9.gold, ink: H9.ink, sw: sw * .4 }); };
  const spear = (uu, sw) => { inkLine([[0, 6 * uu], [0, -13 * uu]], sw * 1.6, H9.wood, 'ink', 0); paint([[-.6 * uu, -13 * uu], [0, -15.6 * uu], [.6 * uu, -13 * uu]], { wash: '#C9CCD8', ink: H9.ink, sw: sw * .5 }); };
  return ram(x, y, u, { crown: false, kodanda: false, shawl: false, mala: false, tilak: false, hat: helmet, armR: o.spear === false ? undefined : spear, handR: [4.4, -13.5], bendR: -1, ...o, pal: { ...H9_ARMY[i % 3], ...(o.pal || {}) } });
}
