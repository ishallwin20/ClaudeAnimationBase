// hanu8_props.js: sets and props for hanu8.js (ad 96, Hanuman Part 8, "RAM gave everyone JEWELS. HANUMAN asked for
// this."). Loaded after src/scenes/hanu4_props.js (h4Bubble, h4Cross), hanu5_props.js (h5Lanka, h5Jewel), sanj_props.js
// (herbPeak), hanu6_props.js (H6) and hanu7_props.js (apsara, h7Flames). Pure functions of their arguments (and T for
// boil). Sets stay inside x -300..1380.
//   H8                                   the palette
//   h8Hall, h8Dusk                       Ayodhya's court by day with Ram's throne; the city at dusk (k 0..1: later, bluer)
//   h8Gem, h8Jewels                      one cut gem; a heap of gold and gems that twinkles
//   h8Neck, h8NeckLoop                   Ram's necklace, bright as the moon with a vaidurya at its centre (Uttara 40.23):
//                                        worn on a Narad-rig chest (Ram's, then Hanuman's), or as a loop in the hands
//   h8Pothi, h8Earth                     Ram's story as a palm-leaf book with राम on it; the earth as a small globe
//   h8Cloud                              a small grey cloud of longing
//   h8Banner                             a chariot's flagstaff with an ape on the banner (the next-part tease)
//   vibhishana, angad, h8Vanara, h8Citizen   the cast: Vibhishana (as in Ramayan Parts 10–11), Angad (Hanuman's rig, young,
//                                        in blue with a prince's mukut), a vanara of the army, a townsperson of Ayodhya
const H8 = {
  ink: '#2B2233', pearl: '#FFFDF4', pearlDk: '#CFC8E2', gold: '#F5C542', goldDk: '#C8922A', goldLt: '#FFE69A',
  ruby: '#D2283A', emerald: '#2F9C74', sapphire: '#3A6FD2', beryl: '#9EE0C8', berylDk: '#4EA890',
  duskHi: '#F2A070', duskLo: '#FFD9A0', lateHi: '#6A5A9E', lateLo: '#F2B48A', roof: '#8E4A52', roofLt: '#B86A6A', lamp: '#FFE08A',
  earth: '#C89A6A', earthDk: '#A0744A', leaf: '#F2DDA8', leafDk: '#B8944E', sea: '#4A9AD8', land: '#6EBE7A',
};

// ---------- sets ----------
// Ayodhya's court by day: the Ramayan series' court with the throne on a low dais at (tx, ty)
function h8Hall(t, key = 'hl', tx = 250, ty = 1650, ts = 340) {
  court(t, key);
  boilSeed(key + 'dais');
  paint(rrPts(tx - ts * .8, ty + ts * .18, ts * 1.6, 90, 14), { wash: '#B8203A', fill: '#861422', fillOp: 50, tex: .4, ink: H8.ink, sw: 1 });
  throne(tx, ty, ts, key + 'th');
}
// Ayodhya at dusk: a low sun, the city's roofs, bare earth from gy down
function h8Dusk(t, key = 'dk', gy = 1700, k = 0, sx = 760) {
  boilSeed(key + 'sky');
  paint(rectPts(-300, -600, W + 600, 2600), { wash: mixCol(H8.duskHi, H8.lateHi, k), ink: null });
  paint(ellPts(540, gy - 150, 1100, 620, 26), { fill: mixCol(H8.duskLo, H8.lateLo, k), fillOp: 220, bleed: .3, tex: .4, ink: null });
  glow(sx, gy - 250, 330, '#FFE2A0', .5); paint(ellPts(sx, gy - 240, 74, 74, 20), { wash: '#FFF0C8', ink: null });
  boilSeed(key + 'roofs');
  const R = [[-200, 60, 260, 120], [80, 30, 200, 200], [300, 70, 240, 110], [560, 0, 180, 260], [760, 60, 260, 130], [1020, 40, 300, 170]];
  for (const [x, dy, w, h] of R) {
    const y = gy - 220 + dy;
    paint(rectPts(x, y, w, 400), { wash: mixCol(H8.roof, '#4A3A6A', k), ink: null });
    paint([[x - 10, y], [x + w / 2, y - h * .35], [x + w + 10, y]], { wash: mixCol(H8.roofLt, '#6A5A8E', k), ink: null });
    for (let j = 0; j < 2; j++) paint(rectPts(x + w * (.25 + j * .35), y + 40, 22, 30), { wash: H8.lamp, ink: null });
  }
  boilSeed(key + 'gr');
  paint([[-300, gy + 12], [200, gy - 8], [640, gy + 6], [1380, gy - 8], [1380, 2700], [-300, 2700]], { wash: mixCol(H8.earth, '#8E7A8A', k), fill: H8.earthDk, fillOp: 60, tex: .5, ink: H8.ink, sw: .9, curv: .5 });
}

// ---------- jewels ----------
function h8Gem(x, y, s, col, key = 'gm', rot = 0) {
  boilSeed(key);
  push(); translate(x, y); rotate(rot);
  paint([[-s, -s * .25], [-s * .5, -s * .8], [s * .5, -s * .8], [s, -s * .25], [0, s]], { wash: col, ink: H8.ink, sw: clamp(s / 22, .4, 1.1) });
  paint([[-s * .45, -s * .7], [s * .1, -s * .7], [-s * .2, -s * .3], [-s * .75, -s * .3]], { wash: '#FFFFFF', washOp: 150, ink: null });
  pop();
}
// a heap of coins, a crown's worth of gems on top; s = its width
function h8Jewels(x, y, s, t, key = 'jw', n = 7) {
  boilSeed(key + 'heap');
  glow(x, y - s * .25, s * .8, H8.goldLt, .35);
  paint([[x - s * .5, y], [x - s * .36, y - s * .26], [x - s * .1, y - s * .44], [x + s * .14, y - s * .42], [x + s * .38, y - s * .24], [x + s * .5, y]], { wash: H8.gold, fill: H8.goldDk, fillOp: 60, tex: .5, ink: H8.ink, sw: 1, curv: .5 });
  for (let i = 0; i < 9; i++) { const a = hash(i * 3.7), b = hash(i * 7.1); paint(ellPts(x + (a - .5) * s * .76, y - b * s * .3 * (1 - Math.abs(a - .5) * 1.6) - s * .03, s * .06, s * .035, 10), { wash: H8.goldLt, ink: H8.goldDk, sw: .6 }); }
  const cols = [H8.ruby, H8.emerald, H8.sapphire, H8.pearl];
  for (let i = 0; i < n; i++) { const a = (i + .5) / n, gx = x + (a - .5) * s * .7, gy = y - s * (.16 + .26 * Math.sin(a * Math.PI)) + hash(i * 4.3) * s * .06; h8Gem(gx, gy, s * (.055 + .03 * hash(i * 2.9)), cols[i % 4], key + 'g' + i, (hash(i * 5.3) - .5) * .8); }
  for (let i = 0; i < 4; i++) { const q = frac(t * .7 + i / 4); paint(starPts(x + (hash(i * 6.1 + Math.floor(t * .7 + i / 4)) - .5) * s * .8, y - s * (.1 + .4 * hash(i * 2.2 + Math.floor(t * .7 + i / 4))), s * .07 * Math.sin(q * Math.PI), .3, 4), { wash: '#FFFFFF', ink: null }); }
}
// evenly spaced points along a polyline
function h8Along(P, n) {
  const L = [0]; for (let i = 1; i < P.length; i++) L.push(L[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
  const out = [], tot = L[L.length - 1];
  for (let k = 0; k < n; k++) { const d = tot * k / (n - 1); let i = 1; while (i < P.length - 1 && L[i] < d) i++; const q = (d - L[i - 1]) / ((L[i] - L[i - 1]) || 1); out.push([lerp(P[i - 1][0], P[i][0], q), lerp(P[i - 1][1], P[i][1], q)]); }
  return out;
}
function h8Beads(P, r, n, key, shine = 0) {
  boilSeed(key);
  const Q = h8Along(P, n), [mx, my] = Q[Math.floor(n / 2)];
  if (shine > 0) glow(mx, my, r * 9, '#FFFFFF', .5 * shine);
  Q.forEach(([x, y]) => { paint(ellPts(x, y, r, r, 10), { wash: H8.pearl, ink: H8.ink, sw: clamp(r / 9, .3, 1) }); paint(ellPts(x - r * .3, y - r * .3, r * .3, r * .26, 6), { wash: '#FFFFFF', ink: null }); });
  paint(ellPts(mx, my + r * 1.5, r * 1.5, r * 1.8, 12), { wash: H8.beryl, fill: H8.berylDk, fillOp: 50, ink: H8.ink, sw: clamp(r / 8, .35, 1) });
  paint(ellPts(mx - r * .4, my + r * 1.0, r * .4, r * .5, 6), { wash: '#FFFFFF', ink: null });
}
// the necklace on a Narad-rig chest (the same o as the figure was drawn with)
const H8_NECK = [[-2.15, -17.0], [-1.85, -15.6], [-1.0, -14.3], [0, -13.9], [1.0, -14.3], [1.85, -15.6], [2.15, -17.0]];
function h8Neck(x, y, u, o, key = 'nk', shine = 0) {
  h8Beads(through(H8_NECK.map(([px, py]) => naradaLocal(x, y, u, o, px, py))), u * .3, 15, key, shine);
}
// the necklace off the neck, hanging as a loop from two hands at (x ± w / 2, y)
function h8NeckLoop(x, y, w, key = 'nl', shine = 1) {
  const P = []; for (let i = 0; i <= 12; i++) { const a = i / 12; P.push([x - w / 2 + a * w, y + Math.sin(a * Math.PI) * w * .62]); }
  h8Beads(P, w * .045, 15, key, shine);
}

// ---------- the story, the earth ----------
// Ram's story: a palm-leaf pothi tied with a red cord, राम on its cover; s = its width
function h8Pothi(x, y, s, t, key = 'pt', glowK = 1) {
  boilSeed(key);
  if (glowK > 0) { glow(x, y, s * 1.1, H8.goldLt, .55 * glowK); for (let i = 0; i < 4; i++) { const q = frac(t * .5 + i / 4); paint(starPts(x + (hash(i * 3.3) - .5) * s * 1.5, y + s * .3 - q * s * .9, s * .07 * Math.sin(q * Math.PI) * glowK, .3, 4), { wash: '#FFFFFF', ink: null }); } }
  const h = s * .42;
  for (let i = 2; i >= 0; i--) paint(rrPts(x - s / 2 + i * s * .02, y - h / 2 + i * s * .05, s, h, s * .06), { wash: i ? H8.leafDk : H8.leaf, fill: H8.leafDk, fillOp: i ? 0 : 30, tex: .4, ink: H8.ink, sw: clamp(s / 150, .5, 1.2) });
  inkLine([[x - s * .3, y - h / 2], [x - s * .3, y + h / 2 + s * .1]], clamp(s / 60, 1, 3), H8.ruby, 'ink', 0);
  inkLine([[x + s * .3, y - h / 2], [x + s * .3, y + h / 2 + s * .1]], clamp(s / 60, 1, 3), H8.ruby, 'ink', 0);
  letter('राम', x, y + s * .02, s * .3, '#B8202E', { font: `${Math.round(s * .3)}px "Tiro Devanagari Sanskrit"`, ink: false, rot: 0 });
}
function h8Earth(x, y, r, t, key = 'er') {
  boilSeed(key);
  glow(x, y, r * 1.5, '#BCE0F4', .35);
  paint(ellPts(x, y, r, r, 26), { wash: H8.sea, fill: '#2E6EA8', fillOp: 50, tex: .4, ink: H8.ink, sw: clamp(r / 60, .6, 1.4) });
  paint([[x - r * .5, y - r * .5], [x - r * .1, y - r * .62], [x + r * .16, y - r * .3], [x + r * .02, y + r * .05], [x - r * .1, y + r * .46], [x - r * .3, y + r * .1], [x - r * .6, y - r * .12]], { wash: H8.land, ink: null, curv: .5 });
  paint([[x + r * .36, y - r * .1], [x + r * .7, y - r * .2], [x + r * .66, y + r * .3], [x + r * .4, y + r * .4]], { wash: H8.land, ink: null, curv: .5 });
  paint(ellPts(x - r * .36, y - r * .46, r * .3, r * .16, 10, 0, -.6), { wash: '#FFFFFF', washOp: 110, ink: null });
}
function h8Cloud(x, y, s, a = 255, key = 'cl') { cloudPuff(x, y, s, key, a, '#9E9AB4', '#7A7694'); }

// a flagstaff with an ape on its banner: the foot of the pole at (x, y), h tall; ape 0..1 shows him
function h8Banner(x, y, h, t, key = 'bn', ape = 1) {
  boilSeed(key);
  inkLine([[x, y], [x, y - h]], 5, '#8A5A32', 'ink', 0);
  const w = h * .62, fy = y - h, fl = Math.sin(t * 5) * h * .03;
  paint([[x, fy], [x + w * .5, fy + fl], [x + w, fy - fl], [x + w * .82, fy + h * .2], [x + w, fy + h * .4 + fl], [x + w * .5, fy + h * .4 - fl], [x, fy + h * .4]], { wash: '#E8862E', fill: '#B85E18', fillOp: 50, tex: .4, ink: H8.ink, sw: 1, curv: .3 });
  if (ape > 0) hanuman(x + w * .42, fy + h * .37, h * .0125, { boilKey: key + 'ape', seed: 60, crown: false, gada: 0, noShadow: true, tail: false, eyes: 'determined', mouth: 'open', handR: [4.6, -22], bendR: -1 });
  paint(ellPts(x, fy - 6, 9, 9, 10), { wash: H8.gold, ink: H8.ink, sw: .7 });
}

// ---------- the cast ----------
function vibhishana(x, y, u, o = {}) { asura(x, y, u, { kind: 'nishumbha', sword: false, shield: false, horns: 'none', stache: false, tusks: false, pal: { skin: '#7E9AC0', skinDk: '#5E789E', skinLt: '#A8C0DE', dhoti: '#E8A33A', dhotiDk: '#B67D1C', sash: '#F2E6C8', sashDk: '#C8B890' }, ...o }); }
const ANGAD_PAL = { skin: '#E0B070', skinDk: '#B48444', skinLt: '#F6D49A', fur: '#E0B070', furDk: '#B48444', furLt: '#F6D49A', dhoti: '#3A5A9A', dhotiDk: '#263E6E', dhotiLt: '#6A8AC8' };
function angad(x, y, u, o = {}) { return hanuman(x, y, u, { gada: 0, ...o, pal: { ...ANGAD_PAL, ...(o.pal || {}) } }); }
const H8_FURS = [['#B8864A', '#8A5E2E', '#D8A86A'], ['#9A8A7A', '#6E6050', '#BCAE9E'], ['#C87A3A', '#9A5420', '#E89E62'], ['#8A6A4A', '#5E4430', '#AA8A6A']];
function h8Vanara(x, y, u, i = 0, o = {}) { const [f, d, l] = H8_FURS[i % 4]; return hanuman(x, y, u, { gada: 0, crown: false, tail: 'curl', ...o, pal: { skin: f, skinDk: d, skinLt: l, fur: f, furDk: d, furLt: l, dhoti: ['#2E6A5A', '#7A3A8A', '#3A5A9A', '#8A3A2E'][i % 4], dhotiDk: '#1E2A3A', ...(o.pal || {}) } }); }
const H8_TOWN = [{ skin: '#D9A27A', skinDk: '#B47A54', skinLt: '#F0C4A0', dhoti: '#F4EEDC', dhotiDk: '#C8BEA0', dhotiLt: '#FFFFFF', border: '#B8202E' }, { skin: '#C48A62', skinDk: '#9E6640', skinLt: '#E2AE88', dhoti: '#8EB8D8', dhotiDk: '#5E88A8', dhotiLt: '#BCE0F4', border: '#F2C230' }];
function h8Citizen(x, y, u, i = 0, o = {}) {
  if (i % 3 === 2) return anjana(x, y, u, { tail: false, ...o, pal: { saree: '#C8527A', sareeDk: '#96345A', sareeLt: '#EE8AAE', blouse: '#3E7A6A', blouseDk: '#285A4C', veil: '#F2D27A', veilDk: '#C8A04A', ...(o.pal || {}) } });
  return ram(x, y, u, { crown: false, topknot: true, kodanda: false, shawl: false, ...o, pal: { ...VAN_PAL, ...H8_TOWN[i % 3], ...(o.pal || {}) } });
}
