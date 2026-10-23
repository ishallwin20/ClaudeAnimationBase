// rp6_props.js: sets, props and the extra cast for rp6.js (Ramayan Part 6, "The Golden Deer"). Loaded after
// src/ramayan.js and src/ramayan_sets.js (P1, ashram, hut, tree, bush, throne, notes, tears, arrowAt). Pure functions.
//   P6                                          the palette
//   lankaHall, seaShore, nightForest            sets
//   poof, tenHeadShadow, holyShadow, crossLine  props
//   maricha(x, y, u, o), boyRam(x, y, u, o)     the cast
const P6 = {
  ink: '#2B2233', cream: '#FFF5E2', gold: '#F5C542',
  hall: '#3A1E3A', hallLo: '#6A2E4A', gold2: '#E8B84A', sea: '#3E7AA8', seaDk: '#2A5A88', seaLt: '#8EC0E2', sand: '#E2C894', sandDk: '#C2A470',
  nf: '#14281E', nfLo: '#2E4A34', sepia: '#C8A47A',
};
const sep6 = (c, k = 1) => mixCol(c, mixCol(P6.sepia, c, .2), k);

// Ravana's hall in Lanka: a dark plum room with gold pillars and a gold glow behind the throne
function lankaHall(t, key = 'lh') {
  boilSeed(key);
  paint(rectPts(-600, -600, W + 1200, 3200), { wash: P6.hall, ink: null });
  paint(ellPts(540, 1100, 700, 700, 26), { fill: P6.hallLo, fillOp: 200, bleed: .3, tex: .4, ink: null });
  glow(540, 1050, 520, '#FFB050', .35);
  for (const x of [60, 1020]) { paint(rectPts(x - 60, 250, 120, 1400), { wash: P6.gold2, fill: '#B8862E', fillOp: 50, tex: .4, ink: P6.ink, sw: 1 }); }
  paint(rectPts(-600, 1580, W + 1200, 1200), { wash: '#2A142A', ink: null });
  inkLine([[-100, 1580], [1200, 1580]], .9, P6.ink, 'ink', 0);
}
// the shore by Maricha's hermitage (sepia 0..1 for the flashback): sky, sea with waves, sand
function seaShore(t, key = 'ss', sepia = 0) {
  const S = c => sepia ? sep6(c, sepia) : c;
  boilSeed(key + 'sky');
  paint(rectPts(-600, -600, W + 1200, 3200), { wash: S('#9CC3E6'), ink: null });
  paint(ellPts(540, 1050, 1100, 380, 26), { fill: S('#FCE3BE'), fillOp: 220, bleed: .3, tex: .4, ink: null });
  boilSeed(key + 'sea');
  paint(rectPts(-600, 1150, W + 1200, 380), { wash: S(P6.sea), ink: null });
  for (let i = 0; i < 12; i++) { const y = 1180 + hash(i * 2.3) * 320, x = frac(hash(i * 7.7) + t * .04) * 1500 - 200; inkLine([[x, y], [x + 40, y - 12], [x + 80, y]], 1.6, S(P6.seaLt), 'inkfine', .5); }
  boilSeed(key + 'sand');
  paint(rectPts(-600, 1520, W + 1200, 1200), { wash: S(P6.sand), ink: null });
  paint(ellPts(540, 1800, 900, 240, 22), { fill: S(P6.sandDk), fillOp: 60, bleed: .3, tex: .5, ink: null });
  inkLine([[-100, 1525], [400, 1515], [900, 1530], [1200, 1520]], .9, P6.ink, 'ink', .5);
}
// a deep forest (night 0..1 darkens it)
function nightForest(t, key = 'nf', night = 0) {
  boilSeed(key + 'sky');
  paint(rectPts(-600, -600, W + 1200, 3200), { wash: mixCol('#3E6A48', P6.nf, night), ink: null });
  paint(ellPts(540, 1150, 900, 700, 24), { fill: mixCol('#6A9A6A', P6.nfLo, night), fillOp: 200, bleed: .3, tex: .4, ink: null });
  for (const [x, h, k] of [[-20, 1000, 'a'], [300, 760, 'b'], [760, 820, 'c'], [1100, 1050, 'd']]) tree(x, 1620, h, key + k, Math.sin(t * .7 + x) * .15, [mixCol('#4E8A52', '#1E3A2A', night), mixCol('#3E7442', '#142A1E', night), mixCol('#7CB46A', '#2E4E3A', night)]);
  boilSeed(key + 'gr');
  paint(rectPts(-600, 1600, W + 1200, 1200), { wash: mixCol('#5E8A4A', '#1E3A28', night), ink: null });
  inkLine([[-100, 1600], [600, 1595], [1200, 1605]], .9, P6.ink, 'ink', .5);
}

// ---------- props ----------
// a puff of magic smoke (age 0..1)
function poof(x, y, s, age, key = 'pf') {
  if (age < 0 || age > 1) return;
  boilSeed(key);
  glow(x, y, s * 1.6 * (1 - age), '#C8A0FF', .6 * (1 - age));
  for (let i = 0; i < 8; i++) { const a = i / 8 * TAU, r = s * (.3 + age * .9); paint(ellPts(x + Math.cos(a) * r, y + Math.sin(a) * r * .7, s * .35 * (1 - age * .6), s * .3 * (1 - age * .6), 12), { wash: i % 2 ? '#E2D4F2' : '#C8B4E8', washOp: 255 * (1 - age), ink: null }); }
}
// a shadow with ten crowned heads, cast on a wall (the holy man's true shape), (x, y) its feet, s its height
function tenHeadShadow(x, y, s, k = 1, key = 'ths') {
  if (k <= .01) return;
  boilSeed(key);
  const col = '#140A1E';
  paint([[x - s * .16, y], [x - s * .2, y - s * .5], [x - s * .3, y - s * .62], [x + s * .3, y - s * .62], [x + s * .2, y - s * .5], [x + s * .16, y]], { wash: col, washOp: 220 * k, ink: null, curv: .3 });
  for (let i = 0; i < 10; i++) {
    const a = Math.PI * (1.08 + i / 9 * .84), hx = x + Math.cos(a) * s * .36, hy = y - s * .66 + Math.sin(a) * s * .2 - s * .05;
    paint(ellPts(hx, hy, s * .065, s * .07, 12), { wash: col, washOp: 220 * k, ink: null });
    paint([[hx - s * .05, hy - s * .05], [hx - s * .03, hy - s * .12], [hx, hy - s * .08], [hx + s * .03, hy - s * .12], [hx + s * .05, hy - s * .05]], { wash: col, washOp: 220 * k, ink: null });
  }
}
// a dark holy man in the doorway: a staff, a pot, a robe (a silhouette with a little rim light)
function holyShadow(x, y, s, key = 'hs') {
  boilSeed(key);
  const col = '#1E1428';
  inkLine([[x + s * .2, y], [x + s * .24, y - s * 1.05]], 4, col, 'ink', 0);
  paint([[x - s * .2, y], [x - s * .16, y - s * .6], [x - s * .12, y - s * .72], [x + s * .12, y - s * .72], [x + s * .16, y - s * .6], [x + s * .2, y]], { wash: col, ink: null, curv: .3 });
  paint(ellPts(x, y - s * .82, s * .1, s * .11, 14), { wash: col, ink: null });
  paint(ellPts(x, y - s * .96, s * .07, s * .06, 10), { wash: col, ink: null });   // the topknot
  inkLine([[x - s * .1, y - s * .9], [x - s * .12, y - s * .7]], 1.6, '#FFC870', 'inkfine', .3);   // rim light
}
// the deer's long shadow on the ground, shaped like a horned demon (k 0..1 grows it), from its feet at (x, y)
function demonShadow(x, y, s, k = 1, key = 'dsh') {
  if (k <= .01) return;
  boilSeed(key);
  const col = '#06040A', a = 150 * k;
  push(); translate(x, y); scale(k, k);
  paint([[-s * .18, 0], [-s * .22, -s * .5], [-s * .32, -s * .62], [s * .32, -s * .62], [s * .22, -s * .5], [s * .18, 0]], { wash: col, washOp: a, ink: null, curv: .3 });
  paint(ellPts(0, -s * .74, s * .14, s * .14, 14), { wash: col, washOp: a, ink: null });
  for (const d of [-1, 1]) paint([[d * s * .08, -s * .82], [d * s * .2, -s * 1.02], [d * s * .14, -s * .8]], { wash: col, washOp: a, ink: null });
  for (const d of [-1, 1]) paint(ribbon([[d * s * .3, -s * .58], [d * s * .46, -s * .36], [d * s * .4, -s * .14]], s * .07, s * .05), { wash: col, washOp: a, ink: null });
  pop();
}
// the myth-buster: a line scratched on the ground, then a big red cross over it (k: 0..1 the line, x: 0..1 the cross)
function crossLine(x, y, w, k, xk, key = 'xl') {
  boilSeed(key);
  if (k > 0) { const n = Math.floor(12 * k); for (let i = 0; i < n; i++) inkLine([[x - w / 2 + i * w / 12, y + Math.sin(i) * 6], [x - w / 2 + (i + .6) * w / 12, y + Math.sin(i + .6) * 6]], 4, '#F2E2B8', 'ink', 0); }
  if (xk > 0) { const r = 160 * backOut(clamp(xk)); inkLine([[x - r, y - r * .6], [x + r, y + r * .6]], 12, '#E2283A', 'ink', 0); inkLine([[x - r, y + r * .6], [x + r, y - r * .6]], 12, '#E2283A', 'ink', 0); }
}

// ---------- the cast ----------
// Maricha: a rakshasa ascetic on Mahishasura's rig (Munda's shaved head and topknot), dusky brown
function maricha(x, y, u, o = {}) { return asura(x, y, u, { kind: 'munda', ...o, pal: { skin: '#8A5A3E', skinDk: '#64402A', skinLt: '#A8785A', ...(o.pal || {}) } }); }
// Ram as a boy (Vishwamitra's yagna): Kartikeya's rig in blue with a little crown and a bow
function boyRam(x, y, u, o = {}) {
  return kartikeya(x, y, u, { feather: false, spear: false, shield: false, crown: 1, aL: .2, armL: (uu, sw) => dhanush(uu * 1.4, sw, 0), ...o,
    pal: { skin: VSN.skin, skinDk: VSN.skinDk, skinLt: VSN.skinLt, teal: BK.pit, tealDk: BK.pitDk, tealLt: BK.pitLt, sash: '#9E2A44', sashDk: '#6E1A30', ...(o.pal || {}) } });
}
