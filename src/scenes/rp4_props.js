// rp4_props.js: sets and props for rp4.js (Ramayan Part 4, "The Crow and the Grass"). Loaded after src/ramayan.js and
// src/ramayan_sets.js (P1, tree, bush, notes, tears, arrowAt). Pure functions of their arguments (and T for boil).
//   P4                                   the palette
//   chitrakoot, worlds, ashokaGrove, demonHorde    sets
//   mound, clod, drops, grassStar        props
const P4 = {
  ink: '#2B2233', cream: '#FFF5E2', gold: '#F5C542',
  skyHi: '#A8CDEA', skyLo: '#FCE8C8', hill: '#8AAE7A', hillDk: '#6A8E5E', peak: '#9A8AAE', peakDk: '#7A6A90', grass: '#8DB86A', grassDk: '#6E9A50', stream: '#8CC6DE', streamLt: '#C8E8F2',
  heavenHi: '#F6D88A', heavenLo: '#FFF2CC', cloud: '#FFFFFF', cloudDk: '#E8D8B8',
  grove: '#0E1830', groveLo: '#2A2A58', ashoka: '#E2453A', ashokaDk: '#A82E2A', blood: '#C8283A',
};

// ---------- sets ----------
// Chitrakoot: a blue sky, the hill with its peaks, a stream, flowering trees, the grassy bank
function chitrakoot(t, key = 'ck') {
  boilSeed(key + 'sky');
  paint(rectPts(-600, -600, W + 1200, 2200), { wash: P4.skyHi, ink: null });
  paint(ellPts(540, 1050, 1200, 420, 26), { fill: P4.skyLo, fillOp: 220, bleed: .3, tex: .4, ink: null });
  boilSeed(key + 'peaks');
  paint([[-600, 1250], [-200, 760], [60, 900], [360, 640], [680, 920], [900, 780], [1500, 1180], [1500, 1300], [-600, 1300]], { wash: P4.peak, fill: P4.peakDk, fillOp: 50, tex: .4, ink: P4.ink, sw: .9, curv: .15 });
  paint([[-600, 1300], [0, 1160], [500, 1220], [1000, 1150], [1500, 1220], [1500, 1400], [-600, 1400]], { wash: P4.hill, fill: P4.hillDk, fillOp: 50, tex: .4, ink: null, curv: .5 });
  boilSeed(key + 'stream');
  paint(rectPts(-600, 1380, W + 1200, 140), { wash: P4.stream, ink: null });
  for (let i = 0; i < 8; i++) { const y = 1400 + hash(i * 2.3) * 100, x = frac(hash(i * 7.7) + t * .05) * 1500 - 200; inkLine([[x, y], [x + 80, y]], 1.6, P4.streamLt, 'inkfine', 0); }
  boilSeed(key + 'bank');
  paint(rectPts(-600, 1510, W + 1200, 1100), { wash: P4.grass, ink: null });
  paint(ellPts(540, 1900, 900, 260, 22), { fill: P4.grassDk, fillOp: 80, bleed: .3, tex: .5, ink: null });
  inkLine([[-100, 1515], [400, 1505], [900, 1520], [1200, 1510]], .9, P4.ink, 'ink', .5);
  tree(-40, 1540, 560, key + 'ta', Math.sin(t * .9) * .25, ['#5E9A5A', '#3E7442', '#F2A8C0']);
  tree(1120, 1560, 640, key + 'tb', Math.sin(t * .8 + 1) * .25);
}
// the three worlds the crow flees through: k 0 the earth's sky .. 1 the gold of heaven, clouds streaming past
function worlds(t, k, key = 'wd') {
  boilSeed(key + 'sky');
  paint(rectPts(-600, -600, W + 1200, 3200), { wash: mixCol(P4.skyHi, P4.heavenHi, k), ink: null });
  paint(ellPts(540, 1100, 1000, 800, 26), { fill: mixCol(P4.skyLo, P4.heavenLo, k), fillOp: 220, bleed: .3, tex: .4, ink: null });
  if (k > .3) glow(540, 700, 600, '#FFE6A0', .5 * k);
  for (let i = 0; i < 8; i++) {
    const sp = 300 + 200 * hash(i * 3.1), x = 1500 - frac(hash(i * 7.3) + t * sp / 2000) * 2000, y = 300 + hash(i * 5.1) * 1600;
    cloudPuff(x, y, 110 + 90 * hash(i * 1.9), key + i, 230, P4.cloud, P4.cloudDk);
  }
}
// a soft cloud (as in ad 32): overlapping puffs
function cloudPuff(x, y, s, key, a = 255, col = P4.cloud, dk = P4.cloudDk) {
  boilSeed('cloud' + key);
  paint(ellPts(x, y + s * .18, s * 1.1, s * .32, 18), { wash: dk, washOp: a, ink: null });
  for (const [dx, dy, r] of [[-.6, 0, .42], [-.15, -.22, .55], [.4, -.08, .46], [.85, .06, .3]]) paint(ellPts(x + dx * s, y + dy * s, r * s, r * s * .85, 16), { wash: col, washOp: a, ink: null });
}
// the Ashoka grove in Lanka at night: dark sky, a moon, the ashoka tree with red blossoms
function ashokaGrove(t, key = 'ag') {
  boilSeed(key + 'sky');
  paint(rectPts(-600, -600, W + 1200, 2400), { wash: P4.grove, ink: null });
  paint(ellPts(540, 1150, 1000, 700, 26), { fill: P4.groveLo, fillOp: 200, bleed: .3, tex: .4, ink: null });
  glow(820, 520, 160, '#FFF4D2', .4); paint(ellPts(820, 520, 50, 50, 18), { wash: '#FFF4D2', ink: null });
  boilSeed(key + 'ground');
  paint(rectPts(-600, 1560, W + 1200, 1100), { wash: '#1E2A3A', ink: null });
  inkLine([[-100, 1560], [500, 1550], [1200, 1565]], .9, P4.ink, 'ink', .5);
  tree(300, 1580, 760, key + 'tr', Math.sin(t * .7) * .15, ['#2E4A3A', '#1E3428', P4.ashoka]);
  boilSeed(key + 'blooms');
  for (let i = 0; i < 16; i++) { const x = 300 - 300 + hash(i * 2.7) * 600, y = 840 + hash(i * 4.9) * 300; paint(ellPts(x, y, 14, 12, 8), { wash: i % 2 ? P4.ashoka : P4.ashokaDk, ink: null }); }
}
// a horde of demons in silhouette to the horizon (Raktabija's far-crowd LOD)
function demonHorde(t, key = 'dh', n = 40) {
  for (let i = 0; i < n; i++) {
    const row = Math.floor(i / 10), x = 520 + (i % 10) * 70 + (row % 2) * 35 + 10 * Math.sin(t * 2 + i), y = 1500 + row * 60, u = 4 + row * 1.2;
    raktabija(x, y, u, { boilKey: key + i, lod: 1, maceA: Math.sin(t * 3 + i) * .3 });
  }
}

// ---------- props ----------
// a grassy mound (it hides Sita's legs: she sits behind it), centred on (x, y), s wide
function mound(x, y, s, key = 'md') {
  boilSeed(key);
  paint([[x - s * .5, y], [x - s * .42, y - s * .16], [x - s * .2, y - s * .26], [x + s * .1, y - s * .27], [x + s * .38, y - s * .18], [x + s * .5, y]], { wash: P4.grassDk, fill: '#557A40', fillOp: 50, tex: .5, ink: P4.ink, sw: 1, curv: .5 });
  for (let i = 0; i < 9; i++) { const gx = x - s * .44 + i * s * .11, gy = y - s * (.1 + .12 * Math.sin(i / 8 * Math.PI)); inkLine([[gx, gy], [gx + 6, gy - 30]], 1.6, P4.grass, 'ink', .3); }
}
// a clod of earth (thrown), centred on (x, y)
function clod(x, y, r = 16, key = 'cl') { boilSeed(key); paint(ellPts(x, y, r, r * .85, 10, 2), { wash: '#8A6A44', ink: P4.ink, sw: .7 }); }
// a few drops of blood on the grass (kept small: the reel is for families)
function drops(x, y, k = 1, key = 'dr') { if (k <= 0) return; boilSeed(key); for (let i = 0; i < 3; i++) paint(ellPts(x + (i - 1) * 22, y + (i % 2) * 8, 6 * k, 4 * k, 8), { wash: P4.blood, ink: null }); }
// the blade of grass charged as the Brahmastra: a glowing blade with a comet tail along angle a (radians), len px
function grassStar(x, y, a, len = 90, key = 'gs', tail = 1) {
  const ca = Math.cos(a), sa = Math.sin(a);
  glow(x, y, 120, '#FFE070', .7);
  if (tail > 0) { boilSeed(key + 't'); for (let i = 0; i < 4; i++) inkLine([[x - ca * 20, y - sa * 20 + (i - 1.5) * 6], [x - ca * (180 + i * 50) * tail, y - sa * (180 + i * 50) * tail + (i - 1.5) * 14]], 3 - i * .5, i % 2 ? '#FFE6A0' : '#F5C542', 'ink', .3); }
  boilSeed(key);
  paint([[x + ca * len * .5, y + sa * len * .5], [x - sa * 6, y + ca * 6], [x - ca * len * .5, y - sa * len * .5], [x + sa * 6, y - ca * 6]], { wash: '#7CD25A', ink: P4.ink, sw: 1, curv: .4 });
}
