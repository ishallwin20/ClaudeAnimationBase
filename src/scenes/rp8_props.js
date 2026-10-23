// rp8_props.js: sets, props and the extra cast for rp8.js (Ramayan Part 8, "The Arrow from Behind a Tree"). Loaded after
// src/ramayan.js and src/ramayan_sets.js (P1, ashram, tree, bush, notes, tears, arrowAt). Pure functions.
//   P8                                   the palette
//   pampa, kishkindha, oceanCliff        sets
//   bundle8, anklet, garland, scales     props
//   vanaraKing(x, y, u, o)               Vali or Sugriva (alike: the same gold fur and crown; o.garland 0..1 marks Sugriva)
//   angad(x, y, u, o)                    Vali's young son
const P8 = {
  ink: '#2B2233', cream: '#FFF5E2', gold: '#F5C542',
  lake: '#6FB2D2', lakeLt: '#B8E0EE', lotus: '#F4A6B8', rock: '#A8907A', rockDk: '#7E6A58', dust: '#D8BC94',
  sea: '#2E6A98', seaLt: '#7EB4DA', cliff: '#8A7A6A', cliffDk: '#5E5048',
};

// lake Pampa: a blue lake with lotuses, hills and trees beyond, a grassy bank
function pampa(t, key = 'pp') {
  boilSeed(key + 'sky');
  paint(rectPts(-600, -600, W + 1200, 3200), { wash: P1.skyHi, ink: null });
  paint(ellPts(540, 1050, 1100, 380, 26), { fill: P1.skyLo, fillOp: 220, bleed: .3, tex: .4, ink: null });
  paint([[-600, 1200], [-200, 960], [200, 1080], [600, 900], [1000, 1060], [1500, 960], [1500, 1260], [-600, 1260]], { wash: P1.hill, fill: P1.hillDk, fillOp: 40, tex: .4, ink: null, curv: .5 });
  boilSeed(key + 'lake');
  paint(rectPts(-600, 1240, W + 1200, 300), { wash: P8.lake, ink: null });
  for (let i = 0; i < 8; i++) { const x = frac(hash(i * 7.7) + t * .03) * 1500 - 200, y = 1270 + hash(i * 2.3) * 240; inkLine([[x, y], [x + 70, y]], 1.4, P8.lakeLt, 'inkfine', 0); }
  for (let i = 0; i < 6; i++) { const x = 60 + i * 190, y = 1300 + hash(i * 3.3) * 180; paint(ellPts(x, y, 30, 10, 10), { wash: '#5E9A5A', ink: null }); paint([[x - 12, y - 4], [x, y - 26], [x + 12, y - 4]], { wash: P8.lotus, ink: P8.ink, sw: .5, curv: .4 }); }
  boilSeed(key + 'bank');
  paint(rectPts(-600, 1530, W + 1200, 1200), { wash: P1.grass, ink: null });
  paint(ellPts(540, 1850, 900, 260, 22), { fill: P1.grassDk, fillOp: 70, bleed: .3, tex: .5, ink: null });
  inkLine([[-100, 1532], [500, 1522], [1200, 1536]], .9, P8.ink, 'ink', .5);
  tree(-40, 1560, 640, key + 'ta', Math.sin(t * .8) * .2);
}
// the rocky ground before Kishkindha's caves: dusty, with boulders; the big tree Ram hides behind is drawn by the shot
function kishkindha(t, key = 'kk') {
  boilSeed(key + 'sky');
  paint(rectPts(-600, -600, W + 1200, 3200), { wash: '#E8A870', ink: null });
  paint(ellPts(540, 1100, 1100, 420, 26), { fill: '#FCE0B0', fillOp: 220, bleed: .3, tex: .4, ink: null });
  paint([[-600, 1300], [-300, 900], [0, 1000], [250, 820], [520, 1040], [800, 880], [1100, 1020], [1500, 900], [1500, 1400], [-600, 1400]], { wash: P8.rock, fill: P8.rockDk, fillOp: 50, tex: .5, ink: P8.ink, sw: .9, curv: .2 });
  paint([[420, 1400], [440, 1220], [520, 1170], [600, 1220], [620, 1400]], { wash: '#3A2A22', ink: P8.ink, sw: 1, curv: .4 });   // the cave mouth
  boilSeed(key + 'gr');
  paint(rectPts(-600, 1380, W + 1200, 1300), { wash: P8.dust, ink: null });
  paint(ellPts(540, 1800, 900, 260, 22), { fill: '#B89A70', fillOp: 70, bleed: .3, tex: .5, ink: null });
  inkLine([[-100, 1382], [600, 1376], [1200, 1386]], .9, P8.ink, 'ink', .5);
}
// a sea cliff at dusk (Hanuman's leap, the tease): the ocean to the horizon, a rocky edge on the left
function oceanCliff(t, key = 'oc') {
  boilSeed(key + 'sky');
  paint(rectPts(-600, -600, W + 1200, 3200), { wash: '#E2865A', ink: null });
  paint(ellPts(700, 1150, 1000, 400, 26), { fill: '#F7C98E', fillOp: 220, bleed: .3, tex: .4, ink: null });
  boilSeed(key + 'sea');
  paint(rectPts(-600, 1250, W + 1200, 1500), { wash: P8.sea, ink: null });
  for (let i = 0; i < 12; i++) { const x = frac(hash(i * 7.7) + t * .04) * 1500 - 200, y = 1280 + hash(i * 2.3) * 600; inkLine([[x, y], [x + 40, y - 10], [x + 80, y]], 1.6, P8.seaLt, 'inkfine', .5); }
  boilSeed(key + 'cliff');
  paint([[-600, 2600], [-600, 1500], [100, 1480], [420, 1540], [520, 1700], [560, 2600]], { wash: P8.cliff, fill: P8.cliffDk, fillOp: 60, tex: .5, ink: P8.ink, sw: 1, curv: .3 });
}

// ---------- props ----------
// Sita's jewels in her yellow scarf (as in Part 7), open 0..1 shows them
function bundle8(x, y, s, open = 0, key = 'bd') {
  boilSeed(key);
  paint(ellPts(x, y, s * .5, s * .38, 14, 2), { wash: '#F2C83A', fill: '#C89A22', fillOp: 50, tex: .4, ink: P8.ink, sw: .9 });
  if (open > 0) for (let i = 0; i < 5; i++) { const a = -Math.PI * (.1 + .8 * i / 4); glow(x + Math.cos(a) * s * .5 * open, y + Math.sin(a) * s * .4 * open, s * .2, '#FFF2C0', .5 * open); paint(ellPts(x + Math.cos(a) * s * .5 * open, y + Math.sin(a) * s * .4 * open, s * .08, s * .08, 8), { wash: i % 2 ? '#D2283A' : '#3EB8E8', ink: P8.ink, sw: .5 }); }
}
// a silver anklet with little bells, centred on (x, y), s wide
function anklet(x, y, s, key = 'ak') {
  boilSeed(key);
  glow(x, y, s * .9, '#FFFFFF', .35);
  inkLine(ellPts(x, y, s * .5, s * .22, 20), 5, '#D8DCE8', 'ink', .5);
  for (let i = 0; i < 7; i++) { const a = Math.PI * (.1 + .8 * i / 6), bx = x + Math.cos(a) * s * .5, by = y + Math.sin(a) * s * .22; paint(ellPts(bx, by + s * .06, s * .04, s * .045, 8), { wash: '#F2D27A', ink: P8.ink, sw: .4 }); }
}
// a flower garland across the chest (body space on narada()'s rig)
function garlandChest(u, sw) {
  const P = through(U([[-2.9, -16.8], [-2.2, -14.6], [-1, -13], [0, -12.6], [1, -13], [2.2, -14.6], [2.9, -16.8]], u));
  P.forEach((p, i) => { if (i % 2 === 0) paint(ellPts(p[0], p[1], .42 * u, .42 * u, 8), { wash: i % 4 ? '#F2A23A' : '#FFFFFF', ink: P8.ink, sw: sw * .3 }); });
}
// a balance scale (the "fair?" question): its post at (x, y), s tall, tilt -1..1
function scales(x, y, s, tilt = 0, key = 'sc') {
  boilSeed(key);
  inkLine([[x, y], [x, y - s]], 4, '#8A6A3A', 'ink', 0);
  paint(ellPts(x, y, s * .2, s * .05, 12), { wash: '#B8862E', ink: P8.ink, sw: .8 });
  const a = tilt * .3, L = s * .55, lx = x - Math.cos(a) * L, ly = y - s - Math.sin(a) * L, rx = x + Math.cos(a) * L, ry = y - s + Math.sin(a) * L;
  inkLine([[lx, ly], [rx, ry]], 4, '#B8862E', 'ink', 0);
  for (const [px, py] of [[lx, ly], [rx, ry]]) { inkLine([[px, py], [px - s * .14, py + s * .3]], 1.4, '#8A6A3A', 'inkfine', 0); inkLine([[px, py], [px + s * .14, py + s * .3]], 1.4, '#8A6A3A', 'inkfine', 0); paint([[px - s * .18, py + s * .3], [px + s * .18, py + s * .3], [px + s * .1, py + s * .38], [px - s * .1, py + s * .38]], { wash: '#E8B84A', ink: P8.ink, sw: .8 }); }
}

// ---------- the cast ----------
// Vali and Sugriva: both on Hanuman's rig with a king's mukut; Sugriva wears the flower garland (garland 0..1)
const VK_FUR = { skin: '#C89A4A', skinDk: '#9A702A', skinLt: '#E8BC6A', fur: '#C89A4A', furDk: '#9A702A', furLt: '#E8BC6A', dhoti: '#2E6A5A', dhotiDk: '#1E4A3E', dhotiLt: '#4E8A7A' };
function vanaraKing(x, y, u, o = {}) {
  const chest = o.chest, g = o.garland;
  return hanuman(x, y, u, { gada: 0, tail: 'curl', ...o, pal: { ...HNM, ...VK_FUR, ...(o.pal || {}) }, chest: (uu, sw) => { if (g) garlandChest(uu, sw); if (chest) chest(uu, sw); } });
}
function angad(x, y, u, o = {}) { return hanuman(x, y, u, { gada: 0, tail: 'droop', crown: false, ...o, pal: { ...HNM, ...VK_FUR, skin: '#B8864A', skinDk: '#8A5E2E', skinLt: '#D8A86A', fur: '#B8864A', furDk: '#8A5E2E', furLt: '#D8A86A', dhoti: '#B8202E', dhotiDk: '#861422', ...(o.pal || {}) } }); }
