// savitri_props.js: sets, palettes and props for savitri.js (ad 24, "She OUTSMARTED YAMRAJ with ONE wish."). Loaded
// before it; everything here is a pure function of its arguments (and T for boil).
//   SV, TK                      palettes (TK: the card's brand colours, as in ads 21–23)
//   SAV, SAV_SKIN, SATYA, ...   the cast's palettes on the shared rigs
//   skyBands, forestSet, southRoad, redGround, banyan    sets
//   axe, lapMound, soul, bubble, crownHat, bunHat, babies, sparkleBurst, goldTrail    props
//   dealCard                    the 15K Family Deal card (Books 1–3, ₹350, till 25 Oct)
const SV = {
  ink: '#2B2233', cream: '#FFF5E2',
  skyDay: '#BFE0E8', skyDayLo: '#EAF2DA', leaf: '#5E9A5A', leafDk: '#3E7244', leafLt: '#8CC27A', far: '#9CC4A0', farDk: '#7AA88A',
  bark: '#7A5236', barkDk: '#553620', ground: '#A9C27A', groundDk: '#86A45E', path: '#D8C49A',
  goldSky: '#F6C27A', goldSkyLo: '#F9DFA8', goldLeaf: '#8E9A4A', goldLeafDk: '#6A7436', goldFar: '#C9A86A', goldGround: '#C4AE6A',
  red: '#7E1E2E', redDk: '#4E1220', redLt: '#B8404A', ember: '#FF6A3A',
  duskTop: '#3E2A5E', duskMid: '#8E3E6A', duskLo: '#E8785A', sun: '#E2402E', hill: '#4A2E5A', hillDk: '#2E1E40', road: '#7A4E5A', roadLt: '#9E6A6E',
  thatch: '#C9A05A', thatchDk: '#9A7436', mud: '#B88A5E',
  rope: '#C9A04A', gold: '#F5C542', goldLt: '#FFE39A', soul: '#FFE08A', water: '#BFE6F2',
  thread: '#D8283A', threadW: '#FFF3E0', diya: '#C9783A',
};
const TK = {
  ink: '#2B2233', cream: '#FFF5E2',
  petal: '#F4A6B8', petalDk: '#E0708C', marigold: '#F39A2E', yellow: '#FFD45A', leaf: '#5E9A6A',
  gold: '#EDB43C', goldLt: '#FFE39A', goldDk: '#B67D1C',
  rkOrange: '#F15A24', peach: '#FBE0CF', peachLt: '#FFF1E6', brown: '#3A2418', grey: '#6B5A50', teal: '#2E5F5A',
};
// Savitri: a saffron saree, a green blouse (parvati() recoloured)
const SAV = { saree: '#E8932E', sareeDk: '#B8661A', sareeLt: '#FFC27A', blouse: '#2E7A5A', blouseDk: '#1E5A40', bangle: '#2E9E5A', skin: '#EDB892', skinDk: '#CC9068', skinLt: '#FFDCC0' };
const SAV_SKIN = { col: SAV.skin, dk: SAV.skinDk, lt: SAV.skinLt };
// Satyavan: bark-brown dhoti with a leaf-green border, a pale ochre uttariya (narada() recoloured)
const SATYA = { skin: '#E0A678', skinDk: '#BE8052', skinLt: '#F6CBA2', dhoti: '#9A6A3E', dhotiDk: '#6E4826', dhotiLt: '#C49466', border: '#5E8A3A', shawl: '#E8D4A8', shawlDk: '#C8B080', bead: '#8A5A2E', beadDk: '#5E3A1A' };
const SATYA_SKIN = { col: SATYA.skin, dk: SATYA.skinDk, lt: SATYA.skinLt };
// the soul: Satyavan again, in gold light
const SOUL = { ...SATYA, skin: '#FFE7A0', skinDk: '#F2C25A', skinLt: '#FFF6D6', dhoti: '#FFD05A', dhotiDk: '#E8A82E', dhotiLt: '#FFF0B0', border: '#FFFFFF', shawl: '#FFF6D6', shawlDk: '#FFE08A', hair: '#E8A82E', hairLt: '#FFE08A', ink: '#B87A1A' };
// the two kings in the bubbles
const DYU = { ...NRD_SAGE, dhoti: '#5E4E9E', dhotiDk: '#3E327A', border: '#EDB43C' };   // Dyumatsena, white-haired, blind
const ASV = { skin: '#E8B48A', skinDk: '#C68A60', skinLt: '#FAD2AE', dhoti: '#B8324A', dhotiDk: '#86203A', border: '#EDB43C', hair: '#4A3E4E', hairLt: '#6E6276', shawl: '#F2C230', shawlDk: '#C89A1E' };   // Ashvapati

// ---------------- sets ----------------
function skyBands(cols, y0 = -80, y1 = H + 80, key = 'sky') {
  boilSeed(key);
  const n = cols.length, h = (y1 - y0) / n;
  for (let i = 0; i < n; i++) paint(rectPts(-200, y0 + i * h - 2, W + 400, h + 4), { wash: cols[i], ink: null });
}
const mixN = (a, b, n) => Array.from({ length: n }, (_, i) => mixCol(a, b, i / (n - 1)));

// the hermitage forest; k 0 = morning green, 1 = late gold light. o: pan (px), hut, ground (y)
function forestSet(t, k = 0, o = {}) {
  const G = o.ground ?? 1480, pan = o.pan || 0, c = (a, b) => mixCol(a, b, k);
  skyBands(mixN(c(SV.skyDay, SV.goldSky), c(SV.skyDayLo, SV.goldSkyLo), 7), -200, G - 200, 'fsky');
  if (k > .3) glow(820, 520, 520, '#FFD27A', .35 * k);
  boilSeed('ffar');   // the far tree line, soft
  for (let i = 0; i < 9; i++) { const x = -200 + i * 190 + pan * .2 + hash(i) * 60, r = 150 + hash(i * 3) * 90; paint(ellPts(x, G - 330 - hash(i * 7) * 80, r, r * .8, 16, 4), { wash: c(SV.far, SV.goldFar), ink: null }); }
  boilSeed('fground');
  paint(rectPts(-200, G - 300, W + 400, H - G + 600), { wash: c(SV.ground, SV.goldGround), ink: null });
  paint(ellPts(540 + pan * .5, G + 40, 900, 120, 24, 4), { fill: c(SV.groundDk, SV.goldLeafDk), fillOp: 70, bleed: .2, tex: .4, ink: null });
  if (o.hut) hut(o.hut[0] + pan * .6, o.hut[1]);
  // three big trees, two at the edges, one behind
  const tree = (x, y, s, i) => {
    boilSeed('tree' + i);
    paint(ribbon([[x, y], [x - 6 * s, y - 220 * s], [x + 8 * s, y - 420 * s]], 60 * s, 34 * s), { wash: SV.bark, ink: SV.ink, sw: 1.1 });
    inkLine([[x - 10 * s, y - 40 * s], [x - 14 * s, y - 200 * s]], .8, SV.barkDk, 'inkfine', .5);
    for (let j = 0; j < 4; j++) {
      const a = j / 4 * TAU + .4, cx = x + Math.cos(a) * 120 * s + Math.sin(T * .8 + j + i) * 4, cy = y - 480 * s + Math.sin(a) * 80 * s;
      paint(ellPts(cx, cy, 150 * s, 120 * s, 18, 5), { wash: j % 2 ? c(SV.leafDk, SV.goldLeafDk) : c(SV.leaf, SV.goldLeaf), ink: SV.ink, sw: 1 });
    }
    paint(ellPts(x - 30 * s, y - 520 * s, 90 * s, 60 * s, 14, 4), { wash: c(SV.leafLt, SV.goldLeaf), washOp: 200, ink: null });
  };
  tree(-60 + pan * .9, G - 40, 1.25, 0);
  tree(1120 + pan * .9, G - 20, 1.15, 1);
  if (o.mid !== false) tree(760 + pan * .7, G - 260, .7, 2);
  boilSeed('fgrass');
  for (let i = 0; i < 16; i++) { const x = hash(i * 5.1) * 1180 - 50 + pan, y = G - 60 + hash(i * 2.3) * 300, sw2 = Math.sin(T * 1.6 + i) * 4; inkLine([[x, y], [x + 4 + sw2, y - 28], [x + 10 + sw2, y - 40]], 1.2, c(SV.groundDk, SV.goldLeafDk), 'ink', .5); }
}
function hut(x, y) {
  boilSeed('hut');
  paint(rectPts(x - 110, y - 150, 220, 150), { wash: SV.mud, ink: SV.ink, sw: 1 });
  paint(rrPts(x - 30, y - 100, 60, 100, 26), { wash: SV.barkDk, ink: SV.ink, sw: .8 });
  paint([[x - 150, y - 140], [x, y - 270], [x + 150, y - 140]], { wash: SV.thatch, ink: SV.ink, sw: 1.1 });
  for (let i = 0; i < 6; i++) inkLine([[x - 120 + i * 48, y - 145], [x - 50 + i * 20, y - 240]], .7, SV.thatchDk, 'inkfine', 0);
}

// the road south at dusk: o.pan (px: things drift right as we walk left), o.ground
function southRoad(t, o = {}) {
  const G = o.ground ?? 1480, pan = o.pan || 0;
  skyBands([SV.duskTop, mixCol(SV.duskTop, SV.duskMid, .5), SV.duskMid, mixCol(SV.duskMid, SV.duskLo, .5), SV.duskLo, mixCol(SV.duskLo, '#F6A47A', .5)], -200, G - 330, 'rsky');
  boilSeed('rsun');
  glow(210, G - 420, 300, '#FF6A3A', .55);
  paint(ellPts(210, G - 400, 92, 92, 24, 2), { wash: SV.sun, ink: null });
  boilSeed('rhills');
  paint([[-200, G - 300], [80, G - 420], [360, G - 340], [640, G - 450], [980, G - 360], [1300, G - 430], [1300, G + 100], [-200, G + 100]], { wash: SV.hill, ink: null, curv: .5 });
  paint(rectPts(-200, G - 320, W + 400, H - G + 640), { wash: SV.hillDk, ink: null });
  boilSeed('rroad');
  paint([[-200, G - 300], [-200, G - 280], [700, G + 40], [1300, G + 400], [1300, H + 200], [-200, H + 200], [-200, G + 400], [200, G + 60]], { wash: SV.road, ink: null, curv: .3 });
  paint(ellPts(560, G + 120, 820, 90, 20, 4), { wash: SV.roadLt, washOp: 120, ink: null });
  // bare trees passing
  for (let i = 0; i < 5; i++) {
    boilSeed('rtree' + i);
    const x = ((i * 330 + pan * (.6 + hash(i) * .3)) % 1650 + 1650) % 1650 - 300, y = G - 250 - hash(i * 3) * 60, s = .7 + hash(i * 5) * .4;
    inkLine([[x, y], [x - 6 * s, y - 220 * s], [x + 10 * s, y - 360 * s]], 9 * s, SV.hillDk, 'ink', .4);
    inkLine([[x - 4 * s, y - 180 * s], [x - 70 * s, y - 270 * s], [x - 90 * s, y - 320 * s]], 5 * s, SV.hillDk, 'ink', .5);
    inkLine([[x + 4 * s, y - 250 * s], [x + 80 * s, y - 320 * s]], 4 * s, SV.hillDk, 'ink', .5);
  }
  boilSeed('rmist');
  for (let i = 0; i < 3; i++) paint(ellPts(((i * 520 + pan * .4) % 1500 + 1500) % 1500 - 200, G - 260 + i * 30, 380, 40, 14, 4), { wash: '#C88AA0', washOp: 90, ink: null });
}

// Yama's plain ground: dusk red with a halo behind his head
function redGround(t, hx = 540, hy = 1000, k = 1) {
  skyBands(mixN(SV.redDk, SV.red, 6), -200, H + 200, 'rg');
  if (k > 0) glow(hx, hy, 620, '#FF5A3A', .3 * k + .05 * Math.sin(t * 2));
  boilSeed('rgring');
  const ring = ellPts(hx, hy, 470, 470, 40, 3);
  inkLine([...ring, ring[0], ring[1]], 2.2, SV.redLt, 'inkfine', .5);
}

// a banyan wound with red and white threads, a diya at its foot
function banyan(t, x = 560, G = 1480, wind = 1) {
  boilSeed('bsky'); skyBands(mixN('#F7D79A', '#FBE9C6', 5), -200, G - 200, 'bsky');
  boilSeed('bground'); paint(rectPts(-200, G - 220, W + 400, H), { wash: '#C9B27A', ink: null });
  boilSeed('btrunk');
  paint([[x - 170, G], [x - 120, G - 300], [x - 110, G - 620], [x + 110, G - 620], [x + 120, G - 300], [x + 170, G]], { wash: SV.bark, ink: SV.ink, sw: 1.2, curv: .3 });
  for (const s of [-1, 1]) paint([[x + s * 120, G - 160], [x + s * 250, G + 6], [x + s * 140, G + 4]], { wash: SV.bark, ink: SV.ink, sw: 1, curv: .4 });   // root flares
  for (const dx of [-60, 20, 80]) inkLine([[x + dx, G - 20], [x + dx - 8, G - 300], [x + dx + 6, G - 600]], .8, SV.barkDk, 'inkfine', .5);
  boilSeed('bcanopy');
  for (let j = 0; j < 6; j++) { const a = j / 6 * Math.PI, cx = x + Math.cos(a) * 380, cy = G - 760 - Math.sin(a) * 160; paint(ellPts(cx, cy, 230, 150, 18, 5), { wash: j % 2 ? SV.leafDk : SV.leaf, ink: SV.ink, sw: 1 }); }
  boilSeed('broots');
  for (let i = 0; i < 9; i++) { const rx = x - 420 + i * 105 + (i > 3 && i < 6 ? 400 : 0) * 0, sway = Math.sin(T * 1.2 + i) * 6; if (Math.abs(rx - x) < 190) continue; inkLine([[rx, G - 700], [rx + sway, G - 400], [rx + sway * 1.5, G - 120 - hash(i) * 120]], 2.4, SV.barkDk, 'ink', .4); }
  // the threads, wound round the trunk; the top turns are still being wound (wind 0..1)
  boilSeed('bthreads');
  const turns = 7;
  for (let i = 0; i < turns; i++) {
    if (i / turns > wind) break;
    const y = G - 180 - i * 34;
    inkLine(through([[x - 130, y + 6], [x, y + 18], [x + 130, y + 4]]), 2.4, i % 2 ? SV.threadW : SV.thread, 'ink', .5);
  }
  boilSeed('bdiya');
  const dx = x + 260;
  glow(dx, G - 70, 120, '#FFC766', .6 + .1 * Math.sin(t * 7));
  paint([[dx - 50, G - 50], [dx + 50, G - 50], [dx + 30, G - 20], [dx - 30, G - 20]], { wash: SV.diya, ink: SV.ink, sw: .9, curv: .4 });
  paint([[dx, G - 105 - Math.sin(t * 9) * 4], [dx + 10, G - 70], [dx, G - 58], [dx - 10, G - 70]], { wash: '#FFD45A', ink: null, curv: .6 });
}

// ---------------- props ----------------
// an axe, in an upright hand space: the head points along a (0 = up, + turns clockwise), the blade on its clockwise side
function axe(u, sw, a = 0, INK = SV.ink) {
  push(); rotate(a);
  paint(ribbon(U([[0, 2.2], [0, -5.4]], u), .42 * u, .36 * u), { wash: '#A8743E', ink: INK, sw: sw * .6 });
  paint(U([[.2, -4.6], [2.4, -5.6], [2.6, -3.4], [.2, -3.9]], u), { wash: '#B8BCC8', ink: INK, sw: sw * .7, curv: .2 });   // the blade on the clockwise side: a = 0 faces right, a ~ 2.4 chops down
  inkLine(U([[2.3, -5.4], [2.5, -3.6]], u), sw * .8, '#E8ECF4', 'inkfine', .3);
  pop();
}
// Savitri's lap: her saree spread on the ground as she sits (parvati() sunk into it)
function lapMound(x, y, u, P = SAV) {
  boilSeed('lap');
  paint(ellPts(x, y - u * 1.2, u * 6.6, u * 2.6, 22, u * .05), { wash: P.saree, fill: P.sareeDk, fillOp: 60, tex: .5, ink: SV.ink, sw: clamp(u / 20, .4, 2) * .9 });
  inkLine([[x - u * 6.2, y - u * .2], [x, y + u * .6], [x + u * 6.2, y - u * .2]], clamp(u / 20, .4, 2) * 1.6, PRV.gold, 'ink', .5);
}
// the soul: Satyavan, thumb-sized, gold and glowing; (x, y) is its middle
function soul(x, y, s, o = {}) {
  glow(x, y, s * 26, '#FFE08A', .75);
  narada(x, y + s * 13, s, { pal: SOUL, col: SOUL.skin, dk: SOUL.skinDk, lt: SOUL.skinLt, veena: false, topknot: false, hat: bunHat, noShadow: true, boilKey: o.boilKey || 'soul', seed: 9,
    eyes: o.eyes || 'closed', mouth: o.mouth || 'smile', pray: o.pray ?? 0, rot: o.rot || 0, handL: o.handL, handR: o.handR });
}
// Satyavan's hair: a plain bun with a leaf band (narada()'s hat hook, head space, topknot: false)
function bunHat(u, sw) {
  boilSeed('bun');
  paint(ellPts(0, -24.3 * u, 1.35 * u, 1.1 * u, 14, u * .03), { wash: NRD.hair, ink: NRD.ink, sw: sw * .7 });
  inkLine(U([[-1.2, -23.6], [0, -23.35], [1.2, -23.6]], u), sw * 1.4, '#5E8A3A', 'ink', .5);
}
// a king's crown, for narada()-rig kings (hat hook, head space, topknot: false)
function crownHat(u, sw) {
  boilSeed('crownhat');
  paint(U([[-3.0, -22.5], [-3.1, -24.4], [-2.2, -23.8], [-1.5, -25.4], [-.7, -24.2], [0, -26.0], [.7, -24.2], [1.5, -25.4], [2.2, -23.8], [3.1, -24.4], [3.0, -22.5], [0, -22.9]], u),
    { wash: '#EDB43C', fill: '#B67D1C', fillOp: 50, tex: .4, ink: NRD.ink, sw: sw * .8, curv: .1 });
  paint(ellPts(0, -23.6 * u, .38 * u, .44 * u, 10), { wash: '#D8283A', ink: NRD.ink, sw: sw * .4 });
}
// a thought bubble: a cream disc (r) with three small circles trailing to (tx, ty); k 0..1 pops it; inner() draws the
// vignette (keep it inside r)
function bubble(x, y, r, k, inner, tx, ty, key = 'bub') {
  if (k <= 0) return;
  const s = backOut(clamp(k));
  boilSeed(key + 'tail');
  for (let i = 0; i < 3; i++) { const q = (i + 1) / 4, rr = (12 + i * 8) * s; paint(ellPts(lerp(tx, x, q * .8), lerp(ty, y + r * .8, q * .8), rr, rr, 10), { wash: SV.cream, ink: SV.ink, sw: 1 }); }
  boilSeed(key);
  push(); translate(x, y); scale(s); translate(-x, -y);
  paint(ellPts(x, y, r * 1.05, r, 32, 2), { wash: SV.cream, ink: SV.ink, sw: 1.6 });
  if (inner) inner();
  pop();
}
// babies popping up around a point: n tiny round baby heads with a curl, a little body; k 0..1 is how many are out
function babies(cx, cy, s, t, k, key = 'babies') {
  boilSeed(key);
  const n = 14;
  for (let i = 0; i < n; i++) {
    const kk = clamp(k * n - i); if (kk <= 0) continue;
    const a = hash(i * 2.7) * TAU, d = (.5 + hash(i * 1.9) * .5) * s * 7, p = backOut(clamp(kk * 2));
    const x = cx + Math.cos(a) * d * 1.3, y = cy + Math.sin(a) * d * .7 - Math.abs(Math.sin(t * 6 + i)) * s * .5;
    const r = s * (.95 + hash(i) * .3) * p;
    paint(ellPts(x, y + r * 1.2, r * .9, r * .8, 10), { wash: '#FFF3E0', ink: SV.ink, sw: .7 });   // the swaddle
    paint(ellPts(x, y, r, r, 12), { wash: '#F2C29A', ink: SV.ink, sw: .8 });
    inkLine([[x - r * .2, y - r * .9], [x + r * .1, y - r * 1.25], [x + r * .3, y - r * .95]], .9, '#3A2A2E', 'ink', .5);
    if (r > 4) { paint(ellPts(x - r * .35, y, r * .1, r * .14, 6), { wash: SV.ink, ink: null }); paint(ellPts(x + r * .35, y, r * .1, r * .14, 6), { wash: SV.ink, ink: null }); inkLine([[x - r * .2, y + r * .4], [x, y + r * .5], [x + r * .2, y + r * .4]], .7, SV.ink, 'inkfine', .5); }
  }
}
function sparkleBurst(x, y, s, age, key = 'burst', n = 8, cols = [SV.cream, SV.goldLt]) {
  if (age < 0 || age > .8) return;
  boilSeed(key);
  const k = easeOut(clamp(age / .8));
  for (let i = 0; i < n; i++) { const a = i / n * TAU + .3, d = s * (.4 + k * 1.2), r = s * .18 * (1 - k); if (r > .5) paint(starPts(x + Math.cos(a) * d, y + Math.sin(a) * d, r, .45, 4, a), { wash: cols[i % 2], ink: null }); }
}
// a trail of gold sparks along a path, the head at k
function goldTrail(pts, k, key = 'trail') {
  boilSeed(key);
  const P = through(pts), n = P.length, h = Math.floor(clamp(k) * (n - 1));
  for (let i = Math.max(0, h - 14); i <= h; i++) { const q = (i - (h - 14)) / 14, [x, y] = P[i]; paint(starPts(x, y, 4 + q * 9, .45, 4, i), { wash: i % 2 ? SV.goldLt : SV.soul, washOp: 120 + 135 * q, ink: null }); }
}

// ---------------- the card: 15K Family Deal (ads 22–23's card, the date moved to 25 Oct) ----------------
function dealCard(t, C) {
  boilSeed('cardbg');
  paint(rectPts(-60, -60, W + 120, H + 120), { wash: TK.peach, ink: null });
  boilSeed('cardpetals');
  for (let i = 0; i < 9; i++) {
    const x = 60 + hash(i * 3.3) * 960 + 30 * Math.sin(t * .9 + i), y = frac(hash(i * 7.1) + t * (.035 + .02 * hash(i))) * (H + 80) - 40, r = t * .8 + i;
    paint([[x + Math.cos(r) * 15, y + Math.sin(r) * 15], [x + Math.cos(r + 1.6) * 7, y + Math.sin(r + 1.6) * 7], [x - Math.cos(r) * 15, y - Math.sin(r) * 15], [x + Math.cos(r - 1.6) * 7, y + Math.sin(r - 1.6) * 7]], { wash: i % 2 ? TK.marigold : TK.petal, washOp: 200, ink: null, curv: .5 });
  }
  const X = 470, pk = t0 => Math.max(0, t - t0) * 5, br = Math.sin(t * 1.3) * .008;
  if (t > C.logo) picture(PICS.logo, X, 500, 118, 118, { pop: pk(C.logo) });
  if (t > C.cap) {
    letter('15K FAMILY DEAL', X, 618, 74, TK.teal, { screen: true, font: '74px Marcellus', ink: false, pop: pk(C.cap), maxW: 860 });
    letter('our thank-you to all of YOU', X, 688, 34, TK.grey, { screen: true, font: '500 34px Poppins', ink: false, pop: pk(C.cap + .15), maxW: 860 });
  }
  if (t > C.covers) [['book1', -1], ['book3', 1], ['book2', 0]].forEach(([b, i], j) => {
    const a = Math.max(0, t - C.covers - j * .12);
    if (a > 0) picture(PICS[b], X + i * 205, 905 + Math.abs(i) * 28, 250, 250, { rot: i * .1 + br, pop: a * 5, r: 10, shadow: 22 });
  });
  if (t > C.price) {
    letter('Books 1–3 · Set of 3', X, 1112, 40, TK.brown, { screen: true, font: '700 40px Poppins', ink: false, maxW: 880, pop: pk(C.price) });
    letter('₹500', X - 120, 1186, 56, TK.grey, { screen: true, font: '500 56px Poppins', ink: false, pop: pk(C.price) });
    const k = backOut(clamp(pk(C.strike - .1) * .7));
    if (t > C.strike) letter('₹350', X + 95, 1182, 88 * (1 + .04 * pulse(t, 4)), TK.rkOrange, { screen: true, font: `700 ${88 * k}px Poppins`, ink: false, pop: pk(C.strike) });
  }
  if (t > C.dead) letter('Extended till 25 Oct, midnight', X, 1262, 40, TK.teal, { screen: true, font: '700 40px Poppins', ink: false, maxW: 860, pop: pk(C.dead) });
  if (t > C.pill) {
    const k = backOut(clamp(pk(C.pill))) * (1 + .03 * pulse(t, 4));
    boilSeed('pill');
    push(); translate(X, 1350); scale(k); paint(rrPts(-270, -48, 540, 96, 48), { wash: TK.rkOrange, ink: null }); pop();
    letter('Comment FAMILY', X, 1352, 54, TK.cream, { screen: true, font: '700 52px Poppins', ink: false, pop: pk(C.pill) });
  }
  if (t > C.sub) letter("we'll DM you the deal · or tap the link in bio", X, 1428, 31, TK.brown, { screen: true, font: '500 31px Poppins', ink: false, maxW: 860, pop: pk(C.sub) });
  if (t > C.follow) letter('Follow @therishikatha', X, 1478, 31, TK.grey, { screen: true, font: '700 31px Poppins', ink: false, maxW: 860, pop: pk(C.follow) });
}
function dealStrike(t, C) {
  if (t < C.strike) return;
  const k = easeOut(seg(t, C.strike, C.strike + .25));
  boilSeed('strike');
  inkLine([[470 - 185, 1196], [lerp(470 - 185, 470 - 55, k), lerp(1196, 1172, k)]], 6, TK.rkOrange, 'ink', 0);
}

// model sheet of the cast: studio.html?loop=savitricast
(() => {
  LOOPS.savitricast = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: PAL.paper, ink: null });
    parvati(200, 800, 20, { pal: SAV, ...SAV_SKIN, boilKey: 'sv1', mouth: 'smile' });
    parvati(520, 800, 20, { pal: SAV, ...SAV_SKIN, crown: false, boilKey: 'sv2', eyes: 'wide', mouth: 'O', walk: t });
    narada(860, 800, 18, { pal: SATYA, ...SATYA_SKIN, veena: false, topknot: false, hat: bunHat, boilKey: 'sy', armR: (u, sw) => axe(u, sw, .2), handR: [4.4, -12], mouth: 'smile' });
    narada(200, 1400, 16, { pal: DYU, col: DYU.skin, dk: DYU.skinDk, lt: DYU.skinLt, beard: '#EDE6DC', veena: false, topknot: false, hat: crownHat, eyes: 'closed', boilKey: 'dy' });
    narada(480, 1400, 16, { pal: ASV, col: ASV.skin, dk: ASV.skinDk, lt: ASV.skinLt, beard: '#4A3E4E', veena: false, topknot: false, hat: crownHat, eyes: 'happy', mouth: 'grin', boilKey: 'as' });
    soul(760, 1250, 5, {});
    babies(900, 1300, 10, t, frac(t / 3) * 1.2);
    // lying Satyavan in the lap
    parvati(260, 1850 + 10.8 * 20, 20, { pal: SAV, ...SAV_SKIN, crown: false, boilKey: 'svl', noShadow: true, eyes: 'normal', lookY: .8, handL: [1.5, -13.5], handR: [3.5, -12.5] });
    paint(rectPts(-40, 1856, W + 80, 100), { wash: PAL.paper, ink: null });
    lapMound(260, 1850, 20);
    narada(900, 1850 - 3 * 18, 18, { pal: SATYA, ...SATYA_SKIN, veena: false, topknot: false, hat: bunHat, boilKey: 'syl', rot: -Math.PI / 2 + .06, eyes: 'closed', mouth: 'flat', noShadow: true });
  };
  LOOPS.savitricast.len = 4;
})();
