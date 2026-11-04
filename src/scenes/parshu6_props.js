// parshu6_props.js: sets, props and the cast for parshu6.js (ad 75, "PARSHURAMA challenged RAM", Parshurama series
// Part 6). Loaded after parshu1–5_props.js (PK, CP, cloudPuff, smokePuff, sparkleBurst, petals, P2, stormSky, halo,
// lightBeam, navCard, P3, grade, eyeBlaze, P4, sunburst, P5, ancestor, ghostPal) and the shared rigs (parshurama.js,
// ram.js: ram(), SITA_PAL; ramayan.js: valmiki(), dasharatha(), brahma(), goldenDeer(); ramayan_sets.js: tree(), bush();
// surya.js: suryaHorse(), suryaChariot()). Pure functions of their arguments (and T).
//   P6                                                     the palette
//   vasishtha, sage6, sita6                                the cast
//   roadSet, dustSwirl, heavenGlow                         sets
//   vishnuBow (an armL hook), divineBow, astraStreak, lokaIsle, royalChariot, crowBirds, chital, flowerMala   props
const P6 = {
  ink: '#2B2233', cream: '#FFF5E2', gold: '#F5C542', red: '#FF5A3C',
  // the bows: Vishnu's (gold, a blue-white light) and Shiva's (ash-blue, a silver light)
  vGold: '#F2C24A', vGoldDk: '#B8861C', vGoldLt: '#FFE69A', vGlow: '#BFE6FF', vHot: '#F4FBFF',
  sAsh: '#8EA2C2', sAshDk: '#5A6A8E', sAshLt: '#D2DCEE', sGlow: '#DDE6FF',
  // the road: day, then the storm
  skyHi: '#8FBCE6', skyLo: '#FCE6C2', hill: '#A2BC8A', hillDk: '#7E9E70', road: '#D8B488', roadDk: '#B8926A', grass: '#8DB86A', grassDk: '#6E9A50',
  stormHi: '#2A1A2E', stormMid: '#5A3A3E', stormLo: '#8A6A5A', ash: '#B8A8A0', ashDk: '#7A6A66', ashLt: '#E2D6CE',
  // the flashback
  fbHi: '#3A2416', fbMid: '#8A5A2A', fbLo: '#E8B060',
  // heaven
  isle: '#FFF2DA', isleDk: '#E8CFA8', pav: '#F2C24A', pavDk: '#B8861C', pavLt: '#FFE69A', pavRoof: '#E8742A',
  deer: '#C8864A', deerDk: '#9A5E2E', deerLt: '#E8AE72', crow: '#1E1A26', crowLt: '#3E3646',
  mala: '#F39A2E', mala2: '#F7C23A', rose: '#E2405E',
};

// ---------- the cast ----------
// Vasishtha, the Ikshvakus' family priest, who reads the omens (Valmiki Bala 74.11-13): Valmiki's rig, a long white
// beard, a saffron dhoti, a cream shawl
const VAS_PAL = { hair: '#F2ECE2', hairLt: '#FFFFFF', dhoti: '#E8862E', dhotiDk: '#B85E18', dhotiLt: '#FFB870', border: '#7A1E26',
  shawl: '#FFF6E6', shawlDk: '#E2D2B2', skin: '#E0A880', skinDk: '#B87E58', skinLt: '#F4CCA6' };
function vasishtha(x, y, u, o = {}) { return valmiki(x, y, u, { boilKey: 'vas', seed: 31, beardLen: 1, ...o, pal: { ...VAS_PAL, ...(o.pal || {}) } }); }
// another rishi of the party (Bala 74.20-22: "the sages murmured among themselves"): grey beard, a russet dhoti
const SAGE6_PAL = { hair: '#8A8288', hairLt: '#B8B0B8', dhoti: '#A8503A', dhotiDk: '#7A3426', dhotiLt: '#D27A62', border: '#F2C230',
  shawl: '#F6EEDC', shawlDk: '#DCCDAE', skin: '#D49A72', skinDk: '#AE744C', skinLt: '#EEC09A' };
function sage6(x, y, u, o = {}) { return valmiki(x, y, u, { boilKey: 'sg6', seed: 37, beard: '#9A929A', beardLen: .8, ...o, pal: { ...SAGE6_PAL, ...(o.pal || {}) } }); }
// Sita, just married (Parvati's rig in her colours, ram.js)
function sita6(x, y, u, o = {}) { return parvati(x, y, u, { boilKey: 'sita6', seed: 41, pal: SITA_PAL, ...SITA_SKIN, ...o }); }
// a bridal mala of marigolds and roses for narada()'s chest hook (body space: shoulders (±3, -16.3))
function flowerMala(u, sw) {
  const G = [[-2.3, -16.6], [-2.2, -15.2], [-1.7, -13.9], [-.9, -13.1], [0, -12.85], [.9, -13.1], [1.7, -13.9], [2.2, -15.2], [2.3, -16.6]];
  through(U(G, u)).forEach((p, i) => paint(ellPts(p[0], p[1], .36 * u, .34 * u, 10), { wash: i % 3 === 1 ? P6.rose : (i % 2 ? P6.mala : P6.mala2), ink: P6.ink, sw: sw * .35 }));
  paint(ellPts(0, -12.1 * u, .42 * u, .5 * u, 10), { wash: P6.rose, ink: P6.ink, sw: sw * .4 });   // the tassel
}

// ---------- the bows ----------
// Vishnu's bow as an armL hook for narada()'s rig, at the hand, upright (as heldBow() in ramayan.js): gold with blue
// gems, the string pulled back by draw 0..1, an arrow nocked while arrow and draw > .05; strung false hangs the string
// loose from the top tip (Bala 76.5: Ram strings it); g 0..1 a blue-white light on the bow and the arrowhead
function vishnuBow(draw = 0, arrow = true, g = 0, strung = true) {
  return (u, sw) => {
    const k = u / 1.7, pull = clamp(draw);
    push(); scale(1.7);
    if (g > 0) { glow(-.4 * k, 0, 7 * k * (.9 + .1 * Math.sin(T * 7)), P6.vGlow, .45 * g); }
    const tipT = [.6, -4.7], tipB = [.6, 4.7];
    if (strung) inkLine(U([tipT, [.6 + pull * 2.6, 0], tipB], k), sw * .5, '#FFF4D8', 'inkfine', 0);
    else inkLine(U([tipT, [1.0, -2.4], [1.3, 0], [1.2, 1.4]], k), sw * .45, '#FFF4D8', 'inkfine', .4);
    const limb = U([[.6, -4.8], [-.4, -3.4], [-.95, -1.2], [-1.0, 0], [-.95, 1.2], [-.4, 3.4], [.6, 4.8]], k);
    paint(ribbon(limb, .3 * k, .26 * k), { wash: P6.vGold, fill: P6.vGoldDk, fillOp: 50, tex: .4, ink: P6.ink, sw: sw * .55 });
    inkLine(U([[-.55, -3.0], [-.92, -1.2]], k), sw * .4, P6.vGoldLt, 'inkfine', .3);
    for (const p of [tipT, tipB]) paint(ellPts(p[0] * k, p[1] * k, .26 * k, .26 * k, 8), { wash: '#3E8EC8', ink: P6.ink, sw: sw * .35 });
    paint(U([[-1.25, -.7], [-.7, -.7], [-.7, .7], [-1.25, .7]], k), { wash: '#3E8EC8', ink: P6.ink, sw: sw * .4 });   // the grip
    if (arrow && pull > .05) {
      const ax = (.6 + pull * 2.6) * k;
      inkLine([[ax, 0], [-3.4 * k, 0]], sw * 1.2, P6.vGoldDk, 'ink', 0);
      if (g > 0) glow(-3.9 * k, 0, 2.6 * k * (.85 + .15 * Math.sin(T * 9)), P6.vHot, .7 * g);
      paint([[-3.4 * k, -.38 * k], [-4.5 * k, 0], [-3.4 * k, .38 * k]], { wash: g > .3 ? P6.vHot : '#C8CCD8', ink: P6.ink, sw: sw * .4 });
      for (const s of [-1, 1]) paint([[ax - .1 * k, 0], [ax + .5 * k, s * .4 * k], [ax + .9 * k, s * .38 * k], [ax + .4 * k, 0]], { wash: P6.cream, ink: P6.ink, sw: sw * .3 });
    }
    pop();
  };
}
// a great bow floating in the flashback, centred at (x, y), s long, turned rot; kind 'vishnu' (gold) | 'shiva' (ash-blue
// with a crescent at the grip); snap 0..1 breaks it at the grip, the halves tipping apart and falling; g its light
function divineBow(x, y, s, rot, kind = 'vishnu', o = {}) {
  const V = kind === 'vishnu', col = V ? P6.vGold : P6.sAsh, dk = V ? P6.vGoldDk : P6.sAshDk, lt = V ? P6.vGoldLt : P6.sAshLt, gl = V ? P6.vGlow : P6.sGlow;
  const sn = clamp(o.snap || 0), g = (o.glow ?? 1) * (1 - sn * .8), key = o.key || ('dbow' + kind), u = s / 10;
  if (g > 0) glow(x, y, s * .8 * (.92 + .08 * Math.sin(T * 4)), gl, .5 * g);
  push(); translate(x, y); rotate(rot);
  for (const h of sn > 0 ? [-1, 1] : [0]) {
    push();
    if (h) { const f = easeIn(sn); translate(h * f * 1.2 * u, f * f * 9 * u); rotate(h * f * 1.1); }
    boilSeed(key + h);
    const pts = [[1.2, -5], [-.6, -3.6], [-1.5, -1.3], [-1.65, 0], [-1.5, 1.3], [-.6, 3.6], [1.2, 5]];
    const half = h < 0 ? pts.slice(0, 4) : h > 0 ? pts.slice(3) : pts;
    if (!h) inkLine(U([[1.2, -5], [1.2, 5]], u), 2.2, '#FFF6E0', 'inkfine', 0);
    else inkLine(U(h < 0 ? [[1.2, -5], [1.6, -2.2]] : [[1.2, 5], [1.6, 2.2]], u), 1.8, '#FFF6E0', 'inkfine', .3);
    paint(ribbon(U(half, u), .5 * u, .4 * u), { wash: col, fill: dk, fillOp: 55, tex: .4, ink: P6.ink, sw: 2 });
    inkLine(U(half.slice(0, 3).map(([a, b]) => [a + .25, b]), u), 1.6, lt, 'inkfine', .4);
    for (const p of [half[0], half[half.length - 1]]) if (Math.abs(p[1]) > 4) paint(ellPts(p[0] * u, p[1] * u, .35 * u, .35 * u, 10), { wash: V ? '#3E8EC8' : '#F4F6FF', ink: P6.ink, sw: 1.2 });
    if (!h) {
      paint(rrPts(-2.0 * u, -.75 * u, .9 * u, 1.5 * u, .2 * u), { wash: V ? '#3E8EC8' : P6.sAshDk, ink: P6.ink, sw: 1.2 });
      if (!V) paint(U([[-2.6, -.9], [-2.15, -.4], [-2.1, .2], [-2.4, .8], [-1.95, .3], [-1.9, -.4]], u), { wash: '#F4F6FF', ink: P6.ink, sw: 1, curv: .4 });   // the crescent
    }
    pop();
  }
  if (sn > 0 && sn < .6) sparkleBurst(0, 0, s * .35, sn / .6, key + 'sp', 10, ['#FFFFFF', lt]);
  pop();
}
// the loosed astra: a white-hot streak from (x0, y0) to (x1, y1), its head at p 0..1, a fading trail
function astraStreak(x0, y0, x1, y1, p, key = 'astra') {
  if (p <= 0 || p > 1.05) return;
  const q = clamp(p), hx = lerp(x0, x1, q), hy = lerp(y0, y1, q), tq = clamp(q - .35), tx = lerp(x0, x1, tq), ty = lerp(y0, y1, tq);
  boilSeed(key);
  glow(hx, hy, 90, P6.vGlow, .6);
  inkLine([[tx, ty], [hx, hy]], 14, P6.vGlow, 'ink', 0);
  inkLine([[lerp(tx, hx, .4), lerp(ty, hy, .4)], [hx, hy]], 5, P6.vHot, 'ink', 0);
  glow(hx, hy, 60, '#FFFFFF', .9);
}

// ---------- sets ----------
// the royal road home from Mithila (Bala 74): a sky, far hills, trees by the road, the road running into the distance;
// dark 0..1 brings the storm (Bala 74.13-16: a gale that shook the earth and felled trees, darkness over the sun, dust
// and ash): the sky goes bruise-dark and the trees bend away to screen left
function roadSet(t, dark = 0, key = 'road') {
  const d = clamp(dark);
  boilSeed(key + 'sky');
  paint(rectPts(-300, -300, W + 600, 2400), { wash: mixCol(P6.skyHi, P6.stormHi, d), ink: null });
  paint(ellPts(540, 1250, 1300, 520, 30), { wash: mixCol(P6.skyLo, P6.stormMid, d), washOp: 230, ink: null });
  if (d > .05) { boilSeed(key + 'rolls'); for (let i = 0; i < 6; i++) { const x = frac(hash(i * 3.3) + t * .05) * 1800 - 360, y = 560 + i * 120; paint(ellPts(x, y, 280, 50, 16), { wash: P6.stormMid, washOp: 200 * d, ink: null }); } }
  boilSeed(key + 'hills');
  paint([[-300, 1330], [0, 1240], [320, 1290], [620, 1200], [900, 1270], [1380, 1180], [1380, 1500], [-300, 1500]], { wash: mixCol(P6.hill, '#4A3A44', d * .8), fill: P6.hillDk, fillOp: 40, tex: .4, ink: null, curv: .6 });
  boilSeed(key + 'ground');
  paint([[-300, 1400], [1380, 1380], [1380, 2600], [-300, 2600]], { wash: mixCol(P6.grass, '#3E3A3A', d * .75), fill: P6.grassDk, fillOp: 50, tex: .5, ink: null });
  paint([[480, 1400], [620, 1400], [1180, 2600], [-60, 2600]], { wash: mixCol(P6.road, P6.ashDk, d * .7), fill: P6.roadDk, fillOp: 50, tex: .5, ink: null, curv: .1 });
  const sway = Math.sin(t * 1.1) * .25 * (1 - d) - d * (1.6 + .4 * Math.sin(t * 9));
  const leaf = [mixCol(P1.leaf, '#3A3A3A', d * .6), mixCol(P1.leafDk, '#2A2A2E', d * .6), mixCol(P1.leafLt, '#5A5A5A', d * .6)];
  tree(60, 1480, 560, key + 'ta', sway, leaf);
  tree(1040, 1460, 620, key + 'tb', sway * 1.1, leaf);
  tree(860, 1400, 300, key + 'tc', sway * .8, leaf);
  bush(240, 1520, 90, key + 'ba', leaf[0], leaf[1]);
}
// dust and ash blowing across the frame (Bala 74.15-16); k 0..1 how thick
function dustSwirl(t, k, key = 'swirl') {
  if (k <= .02) return;
  boilSeed(key);
  for (let i = 0; i < 18; i++) {
    const y = 300 + hash(i * 5.1) * 1600, sp = .3 + hash(i * 2.7) * .5, x = frac(hash(i * 1.9) - t * sp) * 1900 - 400, w = 220 + 260 * hash(i * 3.1);
    paint(ellPts(x, y, w, 26 + 30 * hash(i * 7.3), 14, 0, -.08), { wash: i % 3 ? P6.ash : P6.ashLt, washOp: 120 * k, ink: null });
  }
}
// heaven opening: a gold wash with rays from (cx, cy), k 0..1
function heavenGlow(t, cx, cy, k, key = 'hg') {
  if (k <= .02) return;
  boilSeed(key);
  paint(ellPts(cx, cy, 900, 700, 30), { fill: '#FFE6A8', fillOp: 180 * k, bleed: .35, tex: .4, border: .2, ink: null });
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU + t * .05, r = 1300; paint([[cx, cy], [cx + Math.cos(a - .05) * r, cy + Math.sin(a - .05) * r], [cx + Math.cos(a + .05) * r, cy + Math.sin(a + .05) * r]], { wash: '#FFF2C8', washOp: 50 * k, ink: null }); }
  glow(cx, cy, 600, '#FFE6A0', .45 * k);
}

// ---------- props ----------
// one of the worlds Parshurama won by tapas (Bala 76.7, 76.21-22): a floating isle of cloud with a gold pavilion on it,
// (x, y) the isle's centre, s its width; burst 0..1 blows it apart (shards, a flash, a puff), gone after .5
function lokaIsle(x, y, s, t, o = {}) {
  const b = clamp(o.burst || 0), key = o.key || 'loka', bob = Math.sin(t * 1.4 + x * .01) * s * .02;
  if (b < .35) {
    const a = 1 - b / .35;
    glow(x, y - s * .3 + bob, s * .8, '#FFE6A0', .4 * a);
    for (let i = 0; i < 4; i++) cloudPuff(x - s * .38 + i * s * .25, y + bob + (i % 2) * s * .04, s * .26, key + 'c' + i, 255 * a, P6.isle, P6.isleDk);
    boilSeed(key + 'pav');
    const px = x, py = y - s * .08 + bob, w = s * .42, h = s * .32;
    paint(rectPts(px - w * .5, py - h * .55, w, h * .55), { wash: P6.pav, fill: P6.pavDk, fillOp: 50, tex: .4, ink: P6.ink, sw: 1, washOp: 255 * a });
    for (let j = 0; j < 4; j++) inkLine([[px - w * .4 + j * w * .27, py - h * .5], [px - w * .4 + j * w * .27, py]], 2, P6.pavDk, 'inkfine', 0);
    paint([[px - w * .62, py - h * .52], [px, py - h * 1.15], [px + w * .62, py - h * .52]], { wash: P6.pavRoof, ink: P6.ink, sw: 1, curv: .3, washOp: 255 * a });
    paint(ellPts(px, py - h * 1.2, s * .03, s * .03, 8), { wash: P6.pavLt, ink: P6.ink, sw: .8 });
  }
  if (b > 0) {
    const f = easeOut(b);
    if (b < .25) glow(x, y - s * .2, s * (1 + b * 3), '#FFFFFF', .9 * (1 - b / .25));
    for (let i = 0; i < 10; i++) {
      const a = hash(i * 3.7 + x) * TAU, r = f * s * (.5 + hash(i * 1.3) * .7), sx = x + Math.cos(a) * r, sy = y - s * .15 + Math.sin(a) * r + f * f * s * .4;
      boilSeed(key + 'sh' + i);
      push(); translate(sx, sy); rotate(a + f * 6 * (hash(i) - .5)); paint([[-s * .03, -s * .02], [s * .04, -s * .03], [s * .02, s * .03]], { wash: i % 2 ? P6.pav : P6.isle, ink: P6.ink, sw: .8, washOp: 255 * (1 - b) }); pop();
    }
    smokePuff(x, y, s * .6, b, key + 'pf', [0, -.3], '#FFF2DA');
  }
}
// Dasharatha's chariot on the road home: Surya's chariot body (surya.js) with two white horses, facing screen right
// (flip: left); riders(seat) draws whoever stands in it; run 0..1 sets the horses going
function royalChariot(x, y, s, t, o = {}) {
  const u = s / 14, f = o.flip ? -1 : 1, gal = (o.run ?? 0) * t * 1.2, key = o.key || 'rc';
  for (const [dx, dy, k] of [[11.5, -1, 'a'], [14.5, .6, 'b']]) suryaHorse(x + f * dx * u, y - 6 * u + dy * u, u * .75, { boilKey: key + 'h' + k, gallop: frac(gal + (k === 'b' ? .3 : 0)), flip: o.flip, mane: '#F2C24A' });
  suryaChariot(x, y, u * 1.4, { part: 'back', boilKey: key + 'c', flip: o.flip });
  if (o.riders) o.riders(suryaChariotSeat(x, y, u * 1.4, { flip: o.flip }));
  suryaChariot(x, y, u * 1.4, { part: 'front', boilKey: key + 'c', spin: gal * 3, flip: o.flip, pole: [x + f * 11 * u, y - 4 * u] });
}
// the omen birds (Bala 74.8-9: "birds shrieked harshly"): dark silhouettes wheeling round (cx, cy), r wide
function crowBirds(t, cx, cy, r, n = 7, key = 'crows', sz = 1) {
  for (let i = 0; i < n; i++) {
    const a = t * (.9 + .15 * (i % 3)) + i / n * TAU, x = cx + Math.cos(a) * r * (1 + .2 * hash(i)), y = cy + Math.sin(a) * r * .35 + hash(i * 2) * 60, s = (26 + 14 * hash(i * 3)) * sz, fl = Math.sin(t * 14 + i * 1.7);
    boilSeed(key + i);
    paint([[x - s, y - fl * s * .5], [x - s * .4, y - s * .1], [x, y + s * .15], [x + s * .4, y - s * .1], [x + s, y - fl * s * .5], [x + s * .3, y + s * .2], [x, y + s * .35], [x - s * .3, y + s * .2]], { wash: P6.crow, ink: null, curv: .3 });
  }
}
// a spotted chital (goldenDeer's rig in a plain coat): the animals that went round the party clockwise (Bala 74.9)
function chital(x, y, s, o = {}) {
  return goldenDeer(x, y, s, { key: 'chital', ...o, col: { coat: P6.deer, coatDk: P6.deerDk, coatLt: P6.deerLt, spot: '#FFF4E0', belly: '#F6E2C2', antler: '#8A6A4A', gem: '#8A6A4A', gem2: '#8A6A4A', ...(o.col || {}) } });
}
