// pearls_props.js: sets, palettes and props for pearls.js (ad 59, "Why did HANUMAN JI bite Maa Sita's PEARLS?").
// Loaded before it; everything here is a pure function of its arguments (and T for boil).
//   PR, TK                      palettes (TK: the brand card colours)
//   COURT1, COURT2, VAN1, VAN2  the courtiers' colours on narada()'s rig; two vanara friends on hanuman()'s
//   turbanHat, turbanFly        a courtier's turban (a hat hook), and one flying off
//   peachGround, court, throne, mandirWall    sets
//   pearl, pearlHalf, pearlsAlong, necklaceOn, sitaLocal, heartReveal, cheeks, pearlPile, diya, templeBell, garland,
//   picture frame (heartPicture)   props
//   pcCard                       the end card: Books 1–3, set of 3 for ₹500
const PR = {
  ink: '#2B2233', cream: '#FFF5E2',
  peach: '#FBE0CF', peachDk: '#F2C2A6', peachLt: '#FFF1E6', ray: '#FFE9D2',
  stone: '#F0C8A8', stoneDk: '#D6A282', stoneLt: '#FBE2CC', pillar: '#FFF0DC', pillarDk: '#E6CDA8', marble: '#F6EADA', marbleDk: '#E2D0B8',
  gold: '#F2C230', goldDk: '#B88A1C', goldLt: '#FFE69A', red: '#B8202E', velvet: '#8E1E3A',
  pearl: '#FBF6EE', pearlDk: '#D9CFE6', pearlLt: '#FFFFFF', pearlIn: '#EFE6DA',
  dusk: '#5A3A4E', duskDk: '#3A2436', duskLt: '#7E5466', wall: '#E8B98E', wallDk: '#C9946A', wallLt: '#F6D3AE',
  lamp: '#FFC24A', flame: '#FFE08A', flameIn: '#FFF4C8', flameOut: '#FF8A2A', clay: '#B85A32', clayDk: '#86391E',
  marigold: '#F39A2E', marigoldDk: '#D0701A', leaf: '#5E9A5A',
  heart: '#FFE7A6', heartLt: '#FFF6D8', heartDk: '#F7C66A', heartRim: '#E89A2A',
};
const TK = {
  ink: '#2B2233', cream: '#FFF5E2', marigold: '#F39A2E', petal: '#F4A6B8', gold: '#EDB43C', goldLt: '#FFE39A',
  rkOrange: '#F15A24', peach: '#FBE0CF', brown: '#3A2418', grey: '#6B5A50', teal: '#2E5F5A',
};
// the courtiers: an elder minister (the one who objects) and a younger one
const COURT1 = { ...NRD_SAGE, dhoti: '#5E4E9E', dhotiDk: '#3E327A', border: '#EDB43C', shawl: '#F2E3C0' };
const COURT2 = { skin: '#E8B48A', skinDk: '#C68A60', skinLt: '#FAD2AE', dhoti: '#2E7A6A', dhotiDk: '#1E5A4C', border: '#EDB43C', hair: '#3A2E3E', hairLt: '#5E5266', shawl: '#F2C230', shawlDk: '#C89A1E' };
// two vanara friends (no crowns): a brown one and a silver-grey one
const VAN1 = { skin: '#B07A46', skinDk: '#80522C', skinLt: '#D09A66', fur: '#B07A46', furDk: '#80522C', furLt: '#D09A66', mask: '#F2D2AE', maskDk: '#D6A880',
  dhoti: '#2E7A6A', dhotiDk: '#1E5A4C', dhotiLt: '#5AA08E', border: '#F2C230', bead: '#C9A46A', beadDk: '#8E6E3E' };
const VAN2 = { skin: '#A39C94', skinDk: '#746C64', skinLt: '#C8C0B6', fur: '#A39C94', furDk: '#746C64', furLt: '#C8C0B6', mask: '#F4DCC8', maskDk: '#D8B49A',
  dhoti: '#6E4EA8', dhotiDk: '#4E3480', dhotiLt: '#9A7ACC', border: '#F2C230', bead: '#C9A46A', beadDk: '#8E6E3E' };

// a minister's turban (hat hook, head space, topknot: false)
function turbanHat(u, sw) {
  boilSeed('turban');
  turbanShape(0, 0, u, sw, 0);
}
function turbanShape(x, y, u, sw, rot) {
  push(); translate(x, y); rotate(rot);
  paint(U([[-3.1, -21.6], [-3.3, -23.4], [-2.4, -24.9], [0, -25.6], [2.4, -24.9], [3.3, -23.4], [3.1, -21.6], [0, -22.3]], u), { wash: '#F2E3C0', fill: '#D8C08A', fillOp: 50, tex: .4, ink: NRD.ink, sw: sw * .8, curv: .4 });
  for (const k of [-.5, .3]) inkLine(U([[-2.9, -22.7 + k], [0, -24 + k], [2.9, -22.7 + k]], u), sw * .5, '#C8A86A', 'inkfine', .5);
  paint(ellPts(0, -23.2 * u, .36 * u, .42 * u, 10), { wash: '#D8283A', ink: NRD.ink, sw: sw * .4 });
  pop();
}
// the turban flying off: (x, y) where its centre (head space -23.5) is now, spinning
function turbanFly(x, y, u, rot) {
  boilSeed('turbanfly');
  turbanShape(x, y + 23.5 * u, u, clamp(u / 20, .4, 2), rot);
}

// ---------------- sets ----------------
// peach with soft turning rays and drifting petals (the hook, the bridge, the ask)
function peachGround(t, cx = 540, cy = 1000) {
  boilSeed('peach');
  paint(rectPts(-200, -300, W + 400, H + 600), { wash: PR.peach, ink: null });
  boilSeed('peachrays');
  for (let i = 0; i < 12; i++) {
    const a = i / 12 * TAU + t * .05, w = .11;
    paint([[cx, cy], [cx + Math.cos(a - w) * 1700, cy + Math.sin(a - w) * 1700], [cx + Math.cos(a + w) * 1700, cy + Math.sin(a + w) * 1700]], { fill: PR.ray, fillOp: 110, bleed: .15, tex: .3, ink: null });
  }
  paint(ellPts(cx, cy, 560, 600, 30), { fill: PR.peachLt, fillOp: 150, bleed: .3, tex: .4, border: .2, ink: null });
  boilSeed('peachpetals');
  for (let i = 0; i < 8; i++) {
    const x = 60 + hash(i * 3.3) * 960 + 30 * Math.sin(t * .9 + i), y = frac(hash(i * 7.1) + t * (.035 + .02 * hash(i))) * (H + 80) - 40, r = t * .8 + i;
    paint([[x + Math.cos(r) * 15, y + Math.sin(r) * 15], [x + Math.cos(r + 1.6) * 7, y + Math.sin(r + 1.6) * 7], [x - Math.cos(r) * 15, y - Math.sin(r) * 15], [x + Math.cos(r - 1.6) * 7, y + Math.sin(r - 1.6) * 7]], { wash: i % 2 ? TK.marigold : TK.petal, washOp: 200, ink: null, curv: .5 });
  }
}
// Ram's court: sandstone wall, a scalloped arch, pillars, a marigold toran, a cream floor (as in ad 29)
function court(t) {
  boilSeed('ctwall');
  paint(rectPts(-200, -300, W + 400, 1640), { wash: PR.stone, ink: null });
  paint(ellPts(540, 900, 600, 600, 26), { fill: PR.stoneLt, fillOp: 140, bleed: .3, tex: .5, border: .3, ink: null });
  boilSeed('ctarch');
  const arch = [];
  for (let i = 0; i <= 24; i++) { const a = Math.PI + i / 24 * Math.PI; arch.push([540 + Math.cos(a) * 340, 900 + Math.sin(a) * 380]); }
  paint([[200, 1330], ...arch, [880, 1330]], { wash: PR.stoneDk, ink: null, curv: .3 });
  inkLine([[200, 1330], ...arch, [880, 1330]], 2, PR.ink, 'ink', .3);
  boilSeed('ctpillars');
  for (const x of [60, 1020]) {
    paint(rectPts(x - 55, 380, 110, 950), { wash: PR.pillar, fill: PR.pillarDk, fillOp: 80, tex: .5, ink: PR.ink, sw: 1.3 });
    for (const y of [430, 1300]) paint(rectPts(x - 70, y - 20, 140, 40), { wash: PR.gold, ink: PR.ink, sw: 1.1 });
  }
  boilSeed('ctgarland');
  for (let i = 0; i < 12; i++) { const x = 30 + i * 92, y = 470 + 40 * Math.sin(i / 11 * Math.PI); paint(ellPts(x, y, 20, 20, 10), { wash: i % 2 ? PR.marigold : PR.gold, ink: PR.ink, sw: .6 }); }
  boilSeed('ctfloor');
  paint(rectPts(-200, 1320, W + 400, 1000), { wash: PR.marble, ink: null });
  inkLine([[-40, 1322], [1120, 1322]], 1.6, PR.ink, 'ink', 0);
  for (let i = 0; i < 6; i++) inkLine([[540 + (i - 2.5) * 140, 1330], [540 + (i - 2.5) * 360, 2000]], .8, PR.marbleDk, 'inkfine', 0);
  for (const y of [1460, 1660, 1900]) inkLine([[-40, y], [1120, y]], .8, PR.marbleDk, 'inkfine', 0);
}
// the dais and the gold throne, centred on x; y is the seat (Ram sits on it)
function throne(x, y, t) {
  boilSeed('dais');
  paint(rectPts(x - 260, y + 30, 520, 80), { wash: PR.stoneDk, ink: PR.ink, sw: 1.2 });
  paint(rectPts(x - 300, y + 105, 600, 70), { wash: PR.stone, ink: PR.ink, sw: 1.2 });
  boilSeed('throneback');
  paint([[x - 170, y + 30], [x - 180, y - 250], [x - 120, y - 380], [x, y - 430], [x + 120, y - 380], [x + 180, y - 250], [x + 170, y + 30]], { wash: PR.gold, fill: PR.goldDk, fillOp: 70, tex: .5, ink: PR.ink, sw: 1.4, curv: .4 });
  paint([[x - 130, y + 20], [x - 140, y - 230], [x - 90, y - 330], [x, y - 365], [x + 90, y - 330], [x + 140, y - 230], [x + 130, y + 20]], { wash: PR.velvet, ink: PR.ink, sw: 1, curv: .4 });
  paint(ellPts(x, y - 395, 22, 26, 10), { wash: '#D8283A', ink: PR.ink, sw: .8 });
  boilSeed('throneseat');
  paint(rrPts(x - 200, y - 10, 400, 50, 18), { wash: PR.gold, fill: PR.goldDk, fillOp: 60, tex: .5, ink: PR.ink, sw: 1.3 });
  for (const s of [-1, 1]) paint(ellPts(x + s * 205, y - 30, 30, 34, 12), { wash: PR.gold, ink: PR.ink, sw: 1.1 });
}
// a home mandir corner at dusk: a warm wall, a shelf, the picture hangs on it
function mandirWall(t) {
  boilSeed('mwall');
  paint(rectPts(-200, -300, W + 400, H + 600), { wash: PR.wallDk, ink: null });
  paint(ellPts(540, 1000, 620, 760, 28), { fill: PR.wall, fillOp: 200, bleed: .3, tex: .5, border: .3, ink: null });
  paint(ellPts(540, 1050, 380, 460, 24), { fill: PR.wallLt, fillOp: 120, bleed: .3, tex: .5, border: .3, ink: null });
  glow(540, 1280, 520, '#FFB050', .55);
  boilSeed('mshelf');
  paint(rectPts(-80, 1500, W + 160, 46), { wash: '#8A5A3A', fill: '#6A4026', fillOp: 60, tex: .5, ink: PR.ink, sw: 1.3 });
  paint(rectPts(-80, 1544, W + 160, 700), { wash: PR.duskDk, ink: null });
}

// ---------------- pearls ----------------
// one pearl at (x, y), radius r (seed it yourself)
function pearl(x, y, r, a = 1) {
  const sw = clamp(r / 9, .35, 1.2);
  paint(ellPts(x, y, r, r, 12), { wash: PR.pearl, washOp: 255 * a, ink: PR.ink, sw });
  paint(ellPts(x + r * .25, y + r * .28, r * .62, r * .5, 10, 0, .5), { fill: PR.pearlDk, fillOp: 150 * a, bleed: .15, tex: .3, ink: null });
  paint(ellPts(x - r * .32, y - r * .34, r * .26, r * .22, 8, 0, -.4), { wash: PR.pearlLt, washOp: 255 * a, ink: null });
}
// half a bitten pearl: s = -1 (left half) / 1 (right half), rot its tilt
function pearlHalf(x, y, r, s, rot = 0) {
  push(); translate(x, y); rotate(rot);
  const P = [];
  for (let i = 0; i <= 10; i++) { const a = -Math.PI / 2 + i / 10 * Math.PI; P.push([s * Math.cos(a) * r, Math.sin(a) * r]); }
  for (let i = 0; i < 5; i++) P.push([s * (i % 2 ? .22 : -.05) * r, r - (i + 1) / 5 * 2 * r]);   // the bitten edge, jagged
  paint(P, { wash: PR.pearl, ink: PR.ink, sw: clamp(r / 9, .35, 1.2) });
  paint(ellPts(s * r * .2, 0, r * .3, r * .55, 8), { fill: PR.pearlIn, fillOp: 200, bleed: .1, tex: .3, ink: null });
  pop();
}
// n evenly spaced points along a polyline (smoothed)
function pearlsAlong(P, n) {
  const C = through(P), L = [0];
  for (let i = 1; i < C.length; i++) L.push(L[i - 1] + Math.hypot(C[i][0] - C[i - 1][0], C[i][1] - C[i - 1][1]));
  const out = [], tot = L[L.length - 1];
  for (let k = 0; k < n; k++) {
    const d = n === 1 ? tot / 2 : tot * k / (n - 1);
    let i = 1; while (i < C.length - 1 && L[i] < d) i++;
    const q = (d - L[i - 1]) / ((L[i] - L[i - 1]) || 1);
    out.push([lerp(C[i - 1][0], C[i][0], q), lerp(C[i - 1][1], C[i][1], q)]);
  }
  return out;
}
// a pearl necklace along world points P: n pearls of radius r, a gold drop with a ruby at the middle
function necklaceOn(P, r, n, key = 'neck', pendant = true) {
  boilSeed(key);
  const Q = pearlsAlong(P, n);
  inkLine(through(P), Math.max(.5, r * .12), PR.goldDk, 'inkfine', .5);
  Q.forEach(([x, y]) => pearl(x, y, r));
  if (pendant) {
    const [x, y] = Q[Math.floor(n / 2)];
    paint([[x - r * 1.1, y + r * .6], [x + r * 1.1, y + r * .6], [x, y + r * 3.1]], { wash: PR.gold, ink: PR.ink, sw: clamp(r / 9, .35, 1.2), curv: .4 });
    paint(ellPts(x, y + r * 1.4, r * .5, r * .6, 8), { wash: '#D2283A', ink: null });
    pearl(x, y + r * 3.4, r * .8);
  }
}
// a point on Sita's upper body (parvati() body u, before the head), in world space
function sitaLocal(x, y, u, o, px, py) {
  const sq = o.sq || 0, fx = o.flip ? -1 : 1, l = o.lean || 0, r = l * .035;
  const qx = px + l * .6, qy = py + 11.8, hx = qx * Math.cos(r) - qy * Math.sin(r), hy = qx * Math.sin(r) + qy * Math.cos(r) - 11.8;
  return [x + (o.dx || 0) * u + fx * hx * u * (1 + sq * .6), y + (o.dy || 0) * u + hy * u * (1 - sq)];
}
// the necklace's path on a narada-rig chest (body u), for Hanuman wearing it
const HN_NECK = [[-2.15, -17.0], [-1.75, -15.4], [-.9, -14.2], [0, -13.85], [.9, -14.2], [1.75, -15.4], [2.15, -17.0]];
// pearls scattered and piled on the floor: n of them (stable, from hash) round (x, y)
function pearlPile(x, y, n, w, key = 'pile', r = 9) {
  boilSeed(key);
  for (let i = 0; i < n; i++) {
    const px = x + (hash(i * 3.1 + 7) - .5) * w, py = y + (hash(i * 5.7 + 1) - .5) * w * .22;
    if (i % 3) pearlHalf(px, py, r, i % 2 ? 1 : -1, hash(i) * 2 - 1); else pearl(px, py, r);
  }
}
// puffed cheeks (hat hook of a narada-rig monkey face, head space): k 0..1, chew 0..1 (bobs them)
function cheeks(u, sw, k, o, chew = 0) {
  if (k <= 0) return;
  const hx = clamp(o.hx || 0, -1, 1), b = Math.sin(chew * TAU) * .12;
  for (const s of [-1, 1]) {
    const cx = (hx * .8 + s * 1.7) * u, cy = (-18.5 + (s > 0 ? b : -b)) * u, r = (.62 + .38 * k) * u;
    paint(ellPts(cx, cy, r, r * (.92 - b * .3), 16), { wash: NRD.mask, ink: NRD.ink, sw: sw * .55 });
    paint(ellPts(cx - .2 * u * s, cy - .3 * u, .3 * u, .2 * u, 8), { wash: '#FFF2E0', washOp: 160, ink: null });
    paint(ellPts(cx + s * .15 * u, cy + .25 * u, .42 * u, .2 * u, 10), { fill: PAL.rose, fillOp: 120, bleed: .2, tex: .4, ink: null });
  }
}

// ---------------- the heart ----------------
// Hanuman's chest opened like two little doors, gold light inside and tiny Ram and Sita sitting in it. Body space of a
// narada-rig figure (call from the chest hook, so the arms draw over it). k 0..1 opens it; o.wave 0..1 (they wave),
// o.t (time), o.key
const HEART_C = [0, -15.4], HEART_R = 2.55;
function heartReveal(u, sw, k, o = {}) {
  if (k <= 0) return;
  const t = o.t ?? T, key = o.key || 'heart', [cx, cy] = HEART_C, r = HEART_R * u, X = cx * u, Y = cy * u;
  const ko = easeOut(clamp(k));
  boilSeed(key + ' in');
  const H = heartPts(X, Y, r, 28);
  paint(H, { wash: PR.heart, ink: null });
  paint(heartPts(X, Y + r * .1, r * .72, 24), { fill: PR.heartLt, fillOp: 200, bleed: .25, tex: .4, ink: null });
  glow(X, Y + r * .2, r * 1.6, '#FFD27A', .8 * ko);
  // the light's rays inside
  for (let i = 0; i < 8; i++) {
    const a = i / 8 * TAU + t * .4, rr = r * .95;
    paint([[X, Y + r * .2], [X + Math.cos(a - .12) * rr, Y + r * .2 + Math.sin(a - .12) * rr], [X + Math.cos(a + .12) * rr, Y + r * .2 + Math.sin(a + .12) * rr]], { fill: '#FFFBEA', fillOp: 90 * ko, bleed: .15, tex: .3, ink: null });
  }
  if (ko > .35) {   // tiny Ram (sitting) and Sita, inside
    const s = clamp((ko - .35) / .5), w = clamp(o.wave || 0), ws = Math.sin(t * 9) * .5;
    push(); translate(X, Y + r * .62); scale(.6 + .4 * backOut(s)); translate(-X, -(Y + r * .62));
    const ru = u * .105, sx = X + .25 * r, rx = X - .38 * r, base = Y + r * .62;
    parvati(sx, base, ru * .92, { pal: SITA_PAL, ...SITA_SKIN, boilKey: key + ' sita', seed: 31, noShadow: true, hx: -.3, lookX: -.4, eyes: 'normal', mouth: 'smile', blush: .4,
      handR: w > 0 ? [lerp(3.3, 4.6, w) + ws * w, lerp(-11.2, -21.5, w)] : undefined, bendR: 1.2 });
    ram(rx, base, ru, { boilKey: key + ' ram', seed: 32, sit: 1, kodanda: false, noShadow: true, hx: .25, lookX: .3, eyes: 'happy', mouth: 'smile',
      handR: w > 0 ? [lerp(3.9, 5.2, w) - ws * w, lerp(-10.6, -21.5, w)] : [3.9, -10.6], handL: [-3.9, -10.6], bendR: 1.2 });
    pop();
  }
  boilSeed(key + ' rim');
  inkLine([...H, H[0]], sw * 1.6, PR.heartRim, 'ink', .3);
  // the doors: each half of the heart, hinged at its outer edge, swinging open (squashed toward the hinge)
  const d = 1 - .86 * ko;
  for (const s of [-1, 1]) {
    paint(heartHalf(X, Y, r, s, d), { wash: NRD.skin, fill: NRD.skinDk, fillOp: 60, tex: .5, ink: NRD.ink, sw: sw * .8, curv: .3 });
    if (d > .2) for (let j = 0; j < 3; j++) { const fy = Y + (j - .6) * r * .45, fx = X + s * (r - r * d * (.4 + .2 * j)); inkLine([[fx, fy], [fx + s * r * d * .18, fy + r * .12]], sw * .4, NRD.skinDk, 'inkfine', .4); }
  }
}
// one half of the heart (s = -1 left, 1 right) squashed toward its outer hinge by d (1 = closed, 0 = flat open)
function heartHalf(X, Y, r, s, d) {
  const P = [];
  for (let i = 0; i <= 14; i++) {
    const a = i / 14 * Math.PI, px = 16 * Math.pow(Math.sin(a), 3) / 16, py = -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) / 16;
    P.push([s * px, py]);
  }
  // the hinge edge is the outer side (|x| = 1 at a = π/2); squash x toward s·1
  return P.map(([px, py]) => [X + (s - (s - px) * d) * r, Y + py * r]);
}

// a little 'awww' heart-sparkle for reactions
function sparkleBurst(x, y, s, age, key = 'burst', n = 8, cols = [TK.cream, TK.goldLt]) {
  if (age < 0 || age > .8) return;
  const k = age / .8; boilSeed(key);
  glow(x, y, s * (1 + k), cols[1], .6 * (1 - k));
  for (let i = 0; i < n; i++) { const a = i / n * TAU + hash(i) * .5, d = s * (.3 + 1.1 * easeOut(k)) * (.7 + .5 * hash(i * 2.1)); paint(starPts(x + Math.cos(a) * d, y + Math.sin(a) * d - k * s * .2, s * .22 * (1 - k * .8) * (.6 + hash(i * 5)), .3, 4), { wash: cols[i % 2], ink: null }); }
}
function diya(x, y, s, lit, key) {
  boilSeed('diya ' + key);
  const fl = Math.min(lit, 1);
  if (lit > .02) glow(x + s * .55, y - s * 1.1, s * 3.2, PR.flameOut, .5 * fl);
  paint([[x - s, y - s * .55], [x + s * .7, y - s * .55], [x + s * 1.25, y - s * .8], [x + s * .9, y - s * .3], [x + s * .5, y], [x - s * .6, y], [x - s * .95, y - s * .25]], { wash: PR.clay, fill: PR.clayDk, fillOp: 60, tex: .4, ink: PR.ink, sw: clamp(s / 14, .5, 1.6), curv: .4 });
  paint(ellPts(x - s * .1, y - s * .55, s * .85, s * .16, 10), { wash: PR.clayDk, ink: null });
  if (lit > .02) {
    const fx = x + s * .95, fy = y - s * .8, h = s * (1.2 + .25 * Math.sin(T * 17 + x)) * fl, w = s * .42;
    paint([[fx - w, fy], [fx - w * .7, fy - h * .5], [fx + Math.sin(T * 11 + x) * w * .3, fy - h], [fx + w * .7, fy - h * .5], [fx + w, fy], [fx, fy + w * .4]], { wash: PR.flame, ink: null, curv: .6 });
    paint(ellPts(fx, fy - h * .3, w * .4, h * .3, 8), { wash: PR.flameIn, ink: null });
  }
}
function templeBell(x, y, s, swing, key = 'bell') {
  boilSeed(key);
  inkLine([[x, y - 500], [x + Math.sin(swing) * 6, y - s]], 1.2, PR.goldDk, 'ink', 0);
  push(); translate(x, y - s); rotate(swing * .3);
  paint([[-s * .55, s * 1.1], [-s * .45, s * .3], [-s * .2, 0], [s * .2, 0], [s * .45, s * .3], [s * .55, s * 1.1]], { wash: PR.gold, fill: PR.goldDk, fillOp: 60, tex: .4, ink: PR.ink, sw: 1, curv: .4 });
  paint(ellPts(0, s * 1.2, s * .15, s * .15, 8), { wash: PR.goldDk, ink: PR.ink, sw: .6 });
  pop();
}
function garland(pts, r, key = 'garland') {
  boilSeed(key);
  through(pts).forEach((p, i) => { if (i % 2 === 0) paint(ellPts(p[0], p[1], r, r, 10, r * .1), { wash: i % 4 ? PR.marigold : PR.marigoldDk, ink: PR.ink, sw: .6 }); });
}
// the famous picture: a gold frame (x, y its centre; w × h) with a peach ground, painted inside by inner()
function frame(x, y, w, h, key, inner) {
  boilSeed(key + ' frame');
  paint(rrPts(x - w / 2 - 34, y - h / 2 - 34, w + 68, h + 68, 14), { wash: PR.gold, fill: PR.goldDk, fillOp: 70, tex: .5, ink: PR.ink, sw: 1.6 });
  paint(rrPts(x - w / 2 - 10, y - h / 2 - 10, w + 20, h + 20, 6), { wash: PR.goldDk, ink: PR.ink, sw: 1 });
  boilSeed(key + ' canvas');
  paint(rectPts(x - w / 2, y - h / 2, w, h), { wash: '#F7D7B8', ink: null });
  for (let i = 0; i < 10; i++) {
    const a = i / 10 * TAU, cx = x, cy = y - h * .12;
    paint([[cx, cy], [cx + Math.cos(a - .14) * w, cy + Math.sin(a - .14) * w], [cx + Math.cos(a + .14) * w, cy + Math.sin(a + .14) * w]].map(([a2, b2]) => [clamp(a2, x - w / 2, x + w / 2), clamp(b2, y - h / 2, y + h / 2)]), { fill: '#FFE9C8', fillOp: 120, bleed: .1, tex: .3, ink: null });
  }
  inner();
  boilSeed(key + ' glass');
  paint([[x - w / 2 + 20, y - h / 2 + 30], [x - w / 2 + 70, y - h / 2 + 30], [x - w / 2 + 20, y - h / 2 + 140]], { wash: '#FFFFFF', washOp: 60, ink: null });
}

// ---------------- the card ----------------
function pcCard(t, C) {
  boilSeed('cardbg');
  paint(rectPts(-60, -60, W + 120, H + 120), { wash: TK.peach, ink: null });
  boilSeed('card glow'); glow(470, 900, 420, '#FFE7A8', .3);
  for (let i = 0; i < 7; i++) diya(110 + i * 125, 1490, 22, clamp((t - C.cap) * 4 - i * .4), 'card' + i);
  const X = 470, pk = t0 => Math.max(0, t - t0) * 5, br = Math.sin(t * 1.3) * .01;
  if (t > C.cap) letter('Stories of SHAKTI, for little ones', X, 660, 46, TK.teal, { screen: true, font: '50px Marcellus', ink: false, pop: pk(C.cap), maxW: 860 });
  [1, 2, 3].forEach((b, j) => {
    const t0 = C.covers + j * .15; if (t < t0) return;
    const x = X + (j - 1) * 290, y = 900 + (j === 1 ? -16 : 0);
    picture(PICS['book' + b], x, y, 276, 276, { rot: (j - 1) * .05 + (j % 2 ? br : -br), pop: pk(t0), r: 8, shadow: 18 });
  });
  if (t > C.price) {
    letter('Books 1–3 · OUT NOW', X, 1130, 46, TK.brown, { screen: true, font: '700 50px Poppins', ink: false, maxW: 860, pop: pk(C.price) });
    letter('Set of 3 for ₹500', X, 1196, 44, TK.rkOrange, { screen: true, font: '700 52px Poppins', ink: false, maxW: 860, pop: pk(C.price + .12) });
  }
  if (t > C.logo) picture(PICS.logo, X, 530, 140, 140, { pop: pk(C.logo) });
  if (t > C.pill) {
    const k = backOut(clamp(pk(C.pill))) * (1 + .03 * pulse(t, 4));
    boilSeed('pill');
    push(); translate(X, 1295); scale(k); paint(rrPts(-220, -44, 440, 88, 44), { wash: TK.rkOrange, ink: null }); pop();
    letter('rishikatha.com', X, 1297, 50, TK.cream, { screen: true, font: '700 52px Poppins', ink: false, pop: pk(C.pill) });
  }
  if (t > C.follow) letter('Follow @therishikatha', X, 1395, 36, TK.grey, { screen: true, font: '500 38px Poppins', ink: false, maxW: 860, pop: pk(C.follow) });
}
