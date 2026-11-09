// lakh_props.js: the set and props for the 1 lakh thank-you reel (src/scenes/lakh.js). Loaded before it; everything
// here is a pure function of its arguments (and T for boil).
//
//   LK                                   the palette (brand peach, teal and orange, marigold, gold)
//   ST                                   the studio's layout: the floor line, the two risers, the front floor, the spot
//   studioSet(t, o)                      the photo studio (world): teal velvet backdrop, swags, risers, floor, lamps
//   riserFront(which)                    a riser's front face again (to tuck legs behind it)
//   spot(x, y, k, t)                     the rangoli in the front centre with one diya; k 0..1 lights it (the empty spot)
//   boxCamera(x, y, s, t, o)             an old wooden box camera on a tripod, side view; o.hood 0..1 (someone under the cloth)
//   confetti(cx, cy, age, key, n, spread) a burst of paper confetti that falls and spins
//   poof(x, y, s, age, key, cols)        a puff of powder (sindoor) or smoke
//   shaniShades(x, y, u, o, k)           Shani's borrowed sunglasses, on his eyes (k 0..1 pops them in)
//   butterPot(x, y, s, key, o)           a clay matki of white butter
//   lakhDiya(x, y, s, lit, key)          a brass-and-clay diya
//   speedLines(x, y, ang, len, k, key)   comet streaks behind a flier
//   photoBorder()                        the cream photo border (screen space)
//   lakhCard(t, C)                       the end card: the free wallpapers, the 1 lakh followers sale on both sets, follow
const LK = {
  peach: '#FBE0CF', peachDk: '#F2C6AC', teal: '#2E5F5A', tealDk: '#1F4541', tealLt: '#4E847C', tealHi: '#6FA49A',
  orange: '#F15A24', marigold: '#F2A23A', marigoldDk: '#D9771E', marigoldLt: '#FFC85A', gold: '#F5C542', goldDk: '#C8962A',
  wood: '#C98E58', woodDk: '#A86E3E', woodLt: '#DDA874', durrie: '#B8323A', durrieDk: '#8A2430', durrieLt: '#E9B04A',
  cream: '#FFF5E2', ink: '#3A2420', sindoor: '#F04A2A', butter: '#FFF6DC', clay: '#B5603A', clayDk: '#8A4426',
  brown: '#5A3520', grey: '#7A6A60', leaf: '#4E8A3E',
};
// the studio's layout (world px). The family stands on two risers and the floor: the back row's feet at T2, the middle
// row's at T1, the front row's at FL; the empty spot is the rangoli at SPOT.
const ST = { WALL: 1060, T2: 1130, T2F: 1226, T1: 1332, T1F: 1424, FL: 1562, SPOT: [588, 1594], X0: 20, X1: 1060 };

// a hanging swag of marigolds from p0 to p1, sagging by sag px (r: flower radius)
function lkSwag(p0, p1, sag, key, r = 13) {
  boilSeed(key);
  const n = Math.max(6, Math.round(Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) / (r * 1.5)));
  for (let i = 0; i <= n; i++) {
    const k = i / n, x = lerp(p0[0], p1[0], k), y = lerp(p0[1], p1[1], k) + sag * 4 * k * (1 - k);
    paint(ellPts(x, y, r, r, 9, .12), { wash: i % 3 === 1 ? LK.marigoldLt : i % 3 === 2 ? LK.marigoldDk : LK.marigold, ink: null });
  }
}
// a hanging string of marigolds straight down from (x, y), len px, ending in a leaf tassel
function lkString(x, y, len, key, r = 12) {
  boilSeed(key);
  const n = Math.round(len / (r * 1.6));
  for (let i = 0; i <= n; i++) paint(ellPts(x + Math.sin(i * 1.3 + T * .8) * 1.5, y + i * r * 1.6, r, r, 9, .12), { wash: i % 2 ? LK.marigold : LK.marigoldLt, ink: null });
  paint(ellPts(x, y + len + r * 1.4, r * .55, r * 1.2, 8, .1), { wash: LK.leaf, ink: null });
}

// a brass-and-clay diya: (x, y) the base, s its size (the bowl about 2s wide); lit 0..1
function lakhDiya(x, y, s, lit, key = 'diya') {
  boilSeed(key);
  if (lit > 0) glow(x, y - s * 1.3, s * 4.5 * (.85 + .15 * Math.sin(T * 9 + x)), '#FFC766', .55 * lit);
  paint([[x - s * 1.05, y - s * .55], [x + s * 1.05, y - s * .55], [x + s * .65, y], [x - s * .65, y]], { wash: LK.clay, ink: LK.ink, sw: .8, curv: .4 });
  paint(ellPts(x, y - s * .55, s * 1.05, s * .22, 12), { wash: LK.clayDk, ink: LK.ink, sw: .6 });
  if (lit > 0) {
    const f = lit * (1 + .12 * Math.sin(T * 13 + x));
    paint([[x + s * .5, y - s * .6], [x + s * .62 + Math.sin(T * 7) * s * .1, y - s * (.6 + 1.25 * f)], [x + s * .78, y - s * .6]], { wash: '#FFB63A', ink: null, curv: .6 });
    paint([[x + s * .56, y - s * .6], [x + s * .63, y - s * (.6 + .7 * f)], [x + s * .7, y - s * .6]], { wash: '#FFF2B0', ink: null, curv: .6 });
  }
}

// a tall brass lamp stand (samai) at (x, y) ground, h tall; lit 0..1
function samai(x, y, h, lit, key) {
  boilSeed(key);
  paint(ellPts(x, y - 6, h * .16, h * .04, 14), { wash: LK.goldDk, ink: LK.ink, sw: .8 });
  paint(rectPts(x - h * .025, y - h * .92, h * .05, h * .9), { wash: LK.gold, ink: LK.ink, sw: .8 });
  for (const k of [.3, .55]) paint(ellPts(x, y - h * k, h * .06, h * .025, 10), { wash: LK.goldDk, ink: LK.ink, sw: .6 });
  paint([[x - h * .17, y - h * .92], [x + h * .17, y - h * .92], [x + h * .1, y - h * .86], [x - h * .1, y - h * .86]], { wash: LK.gold, ink: LK.ink, sw: .8 });
  for (const s of [-1, 0, 1]) lakhDiya(x + s * h * .11, y - h * .93, h * .035, lit, key + s);
}

// the studio. o.light 0..1: Shiva's gold light from above
function studioSet(t, o = {}) {
  const { WALL, T2, T2F, T1, T1F, X0, X1 } = ST;
  boilSeed('st wall');
  paint(rectPts(-500, -600, 2080, 3400), { wash: LK.peach, ink: null });
  // the teal velvet backdrop with pleats
  boilSeed('st drape');
  paint(rectPts(-260, 300, 1600, WALL - 300 + 20), { wash: LK.teal, ink: null });
  for (let i = 0; i < 24; i++) {
    const x = -240 + i * 68 + Math.sin(i * 2.1) * 8;
    paint([[x - 16, 320], [x + 14, 320], [x + 10 + Math.sin(i) * 6, WALL], [x - 20 + Math.sin(i) * 6, WALL]], { wash: i % 2 ? LK.tealDk : LK.tealLt, washOp: 120, ink: null });
  }
  // the gold fringe valance across the top, scalloped
  boilSeed('st valance');
  paint(rectPts(-260, 250, 1600, 90), { wash: LK.durrie, ink: null });
  for (let i = 0; i < 18; i++) {
    const x = -260 + i * 92;
    paint([[x, 338], [x + 92, 338], [x + 70, 380], [x + 46, 392], [x + 22, 380]], { wash: LK.durrie, ink: LK.ink, sw: .7, curv: .5 });
    inkLine([[x + 6, 380], [x + 46, 400], [x + 86, 380]], 2.2, LK.gold, 'ink', .6);
  }
  inkLine([[-260, 338], [1340, 338]], 3, LK.gold, 'ink', 0);
  // marigold swags and strings
  for (let i = 0; i < 6; i++) lkSwag([-120 + i * 230, 345], [110 + i * 230, 345], 120, 'st swag' + i, 15);
  for (const [i, x] of [[0, -120], [1, 110], [2, 340], [3, 570], [4, 800], [5, 1030], [6, 1260]].map(([i, x]) => [i, x])) lkString(x, 350, 230 + (i % 2) * 60, 'st str' + i, 12);
  // the floor
  boilSeed('st floor');
  paint(rectPts(-500, WALL, 2080, 2000), { wash: LK.wood, ink: null });
  for (let i = 0; i < 9; i++) inkLine([[-500, WALL + 40 + i * i * 13], [1580, WALL + 40 + i * i * 13]], 1.1, LK.woodDk, 'inkfine', 0);
  inkLine([[-500, WALL], [1580, WALL]], 2.4, LK.tealDk, 'ink', 0);
  // the lamps at the sides
  samai(-30, ST.FL + 10, 430, 1, 'st samaiL');
  samai(1110, ST.FL + 10, 430, 1, 'st samaiR');
  // the risers: back (T2) then middle (T1)
  riser(X0, X1, T2 - 22, T2F, 'st r2');
  riser(X0 + 70, X1 - 70, T1 - 22, T1F, 'st r1');
  if (o.light > 0) { boilSeed('st light'); glow(540, 520, 700, '#FFE7A0', .5 * o.light); }
}
// one riser: the top face y0..y0+22, the durrie front face to y1
function riser(x0, x1, y0, y1, key) {
  boilSeed(key);
  paint(rectPts(x0, y0, x1 - x0, 24), { wash: LK.woodLt, ink: LK.ink, sw: .9 });
  paint(rectPts(x0, y0 + 24, x1 - x0, y1 - y0 - 24), { wash: LK.durrie, ink: LK.ink, sw: .9 });
  for (const [dy, c, w] of [[14, LK.durrieLt, 5], [26, LK.durrieDk, 3], [y1 - y0 - 40, LK.durrieDk, 3], [y1 - y0 - 28, LK.durrieLt, 5]]) inkLine([[x0 + 4, y0 + 24 + dy], [x1 - 4, y0 + 24 + dy]], w, c, 'ink', 0);
  for (let x = x0 + 40; x < x1 - 20; x += 80) paint(starPts(x, (y0 + y1) / 2 + 12, 9, .45, 4), { wash: LK.durrieLt, ink: null });
}

// the empty spot: a rangoli circle on the floor and one diya; k 0..1 lights it
function spot(x, y, k, t) {
  boilSeed('spot');
  if (k > 0) glow(x, y - 30, 220 * (.9 + .1 * Math.sin(t * 3)), '#FFD98A', .55 * k);
  paint(ellPts(x, y, 118, 36, 30), { wash: '#F6EBD6', ink: null });
  for (let i = 0; i < 12; i++) {
    const a = i / 12 * TAU, px = x + Math.cos(a) * 82, py = y + Math.sin(a) * 25;
    paint(ellPts(px, py, 20, 8, 10, .1, a), { wash: [LK.orange, LK.marigold, LK.teal][i % 3], ink: null });
  }
  paint(ellPts(x, y, 58, 18, 20), { wash: LK.marigoldLt, ink: null });
  paint(ellPts(x, y, 30, 9, 16), { wash: LK.orange, ink: null });
  lakhDiya(x, y - 4, 16, k, 'spot diya');
  if (k > .3) {   // a little gold sparkle ring
    boilSeed('spot spark');
    for (let i = 0; i < 6; i++) {
      const a = t * .8 + i / 6 * TAU, s = 9 * k * (.6 + .4 * Math.sin(t * 4 + i));
      paint(starPts(x + Math.cos(a) * 130, y - 60 + Math.sin(a) * 40, s, .3, 4), { wash: '#FFF2B0', ink: null });
    }
  }
}

// an old wooden box camera on a tripod, side view, the lens to screen right (flip: left). (x, y) the ground under the
// tripod, s the scale (s 1: the box about 120 px wide). o.hood 0..1: someone under the cloth (it bulges; feet show),
// o.flash 0..1: the flash pan fires, o.key
function boxCamera(x, y, s, t, o = {}) {
  const key = o.key || 'cam', F = o.flip ? -1 : 1, P = (px, py) => [x + px * s * F, y + py * s];
  boilSeed(key + ' legs');
  for (const [a, b] of [[-62, -4], [58, 0], [-6, 6]]) inkLine([P(0, -250), P(a, b)], 5 * s, LK.brown, 'ink', 0);
  boilSeed(key + ' box');
  // the bellows and lens
  paint([P(40, -330), P(100, -312), P(100, -258), P(40, -240)], { wash: '#3A3036', ink: LK.ink, sw: s });
  for (let i = 1; i < 4; i++) inkLine([P(40 + i * 15, -328 + i * 4.5), P(40 + i * 15, -242 - i * 4.5)], s, '#6A5A60', 'inkfine', 0);
  paint(rectPts(...P(100, -318).map((v, i) => i === 0 && F < 0 ? v - 22 * s : v), 22 * s, 66 * s), { wash: LK.gold, ink: LK.ink, sw: s });
  paint(ellPts(...P(124, -285), 8 * s, 22 * s, 14), { wash: '#2A2A3A', ink: LK.ink, sw: s });
  paint(ellPts(...P(125, -292), 3 * s, 7 * s, 8), { wash: '#B8C8E8', ink: null });
  // the box
  paint(rectPts(...P(F > 0 ? -70 : 40, -350), 110 * s, 120 * s), { wash: LK.woodDk, ink: LK.ink, sw: s * 1.1 });
  paint(rectPts(...P(F > 0 ? -62 : 32, -342), 94 * s, 104 * s), { wash: LK.wood, ink: null });
  for (const yy of [-330, -250]) inkLine([P(-66, yy), P(36, yy)], 2 * s, LK.gold, 'ink', 0);
  // the flash pan on its stick
  inkLine([P(-10, -350), P(-10, -420)], 3 * s, LK.brown, 'ink', 0);
  paint([P(-40, -420), P(20, -420), P(14, -432), P(-34, -432)], { wash: '#B0B0B8', ink: LK.ink, sw: s * .8 });
  if (o.flash > 0) { glow(...P(-10, -440), 260 * s, '#FFFFFF', o.flash); }
  // the black cloth over the back
  boilSeed(key + ' hood');
  const h = clamp(o.hood || 0), bulge = h * (14 + 4 * Math.sin(t * 9));
  paint([P(-66, -356), P(-30, -362), P(-70 - bulge * .4, -330), P(-96 - bulge, -290), P(-104 - bulge, -220 + h * 30), P(-74, -214 + h * 26), P(-60, -238)], { wash: '#2A2228', ink: LK.ink, sw: s, curv: .5 });
  if (h > .5) {   // Bal Bappa's blue shorts and feet under the cloth
    paint(rectPts(...P(F > 0 ? -108 : 66, -214), 44 * s, 46 * s), { wash: '#6E9CCB', ink: LK.ink, sw: s * .8 });
    for (const dx of [-98, -76]) inkLine([P(dx, -170), P(dx, -14)], 2.6 * s, '#F4876A', 'ink', 0);
    for (const dx of [-98, -76]) paint(ellPts(...P(dx + 3, -8), 11 * s, 7 * s, 10), { wash: '#F4876A', ink: LK.ink, sw: s * .7 });
  }
}

// paper confetti: a burst from (cx, cy) at age 0, falling and spinning; n pieces
function confetti(cx, cy, age, key = 'conf', n = 40, spread = 520) {
  if (age < 0) return;
  boilSeed(key);
  const cols = [LK.orange, LK.marigold, LK.teal, LK.gold, '#E86A9A', LK.tealHi];
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (hash(i * 3.1) - .5) * 2.6, v = (.55 + .6 * hash(i * 7.7)) * spread * 2.2;
    const tt = Math.min(age, 4);
    const x = cx + Math.cos(a) * v * (1 - Math.exp(-tt * 2.4)) / 1.2 + Math.sin(tt * 3 + i) * 18;
    const y = cy + Math.sin(a) * v * (1 - Math.exp(-tt * 2.4)) / 1.2 + 260 * tt * tt * .5 + 60 * tt;
    const r = 7 + 6 * hash(i), rot = tt * (3 + 5 * hash(i * 2)) + i;
    paint([[x + Math.cos(rot) * r, y + Math.sin(rot) * r * .5], [x - Math.sin(rot) * r * .5, y + Math.cos(rot) * r], [x - Math.cos(rot) * r, y - Math.sin(rot) * r * .5], [x + Math.sin(rot) * r * .5, y - Math.cos(rot) * r]], { wash: cols[i % cols.length], ink: null });
  }
}

// a puff of powder (default: sindoor) at (x, y), s its size, age in seconds (it lasts ~.9 s)
function poof(x, y, s, age, key = 'poof', cols = [LK.sindoor, '#FF8A5A', '#FFC09A']) {
  if (age < 0 || age > .95) return;
  boilSeed(key);
  const k = easeOut(clamp(age / .5)), fade = 1 - seg(age, .5, .95);
  for (let i = 0; i < 9; i++) {
    const a = i / 9 * TAU + hash(i) * .5, d = s * (.25 + .55 * k) * (.7 + .5 * hash(i * 3));
    const r = s * (.22 + .2 * k) * (.7 + .5 * hash(i * 5)) * (.4 + .6 * fade);
    paint(ellPts(x + Math.cos(a) * d, y + Math.sin(a) * d * .85, r, r, 12, .15), { wash: cols[i % cols.length], washOp: 230 * fade, ink: null });
  }
  if (age < .5) paint(ellPts(x, y, s * .45 * (1 - age), s * .45 * (1 - age), 14, .15), { wash: cols[0], ink: null });
}

// Shani's borrowed sunglasses (the owl's: gold rims, plum lenses) on his eyes; k 0..1 pops them in
function shaniShades(x, y, u, o, k, key = 'sshades') {
  if (k <= 0) return;
  boilSeed(key);
  const s = backOut(clamp(k)) * u, [lx, ly] = shaniEye(x, y, u, o, -1), [rx, ry] = shaniEye(x, y, u, o, 1);
  for (const [ex, ey] of [[lx, ly], [rx, ry]]) {
    paint([[ex - 1.25 * s, ey - .7 * s], [ex + 1.25 * s, ey - .7 * s], [ex + 1.05 * s, ey + .55 * s], [ex, ey + .8 * s], [ex - 1.05 * s, ey + .55 * s]], { wash: '#3A2244', ink: LK.goldDk, sw: .9 * s / u * Math.max(.6, u / 10), curv: .4 });
    paint([[ex - .7 * s, ey - .45 * s], [ex - .1 * s, ey - .45 * s], [ex - .75 * s, ey + .1 * s]], { wash: '#FFFFFF', washOp: 130, ink: null });
  }
  inkLine([[lx + 1.2 * s, ly - .45 * s], [(lx + rx) / 2, ly - .62 * s], [rx - 1.2 * s, ry - .45 * s]], 1.4 * s / u * Math.max(.6, u / 10), LK.gold, 'ink', .5);
}

// a clay matki of white butter: (x, y) its base, s its size (about 2s wide); o.dip 0..1 (a hand-shaped dent)
function butterPot(x, y, s, key = 'pot', o = {}) {
  boilSeed(key);
  paint(ellPts(x, y - s * .02, s * 1.0, s * .2, 14), { fill: LK.ink, fillOp: 70, bleed: .2, tex: .3, ink: null });
  paint([[x - s * .55, y], [x + s * .55, y], [x + s * .98, y - s * .55], [x + s * .9, y - s * 1.05], [x + s * .55, y - s * 1.25], [x - s * .55, y - s * 1.25], [x - s * .9, y - s * 1.05], [x - s * .98, y - s * .55]], { wash: LK.clay, ink: LK.ink, sw: .9, curv: .6 });
  inkLine([[x - s * .9, y - s * .7], [x + s * .9, y - s * .7]], s * .09, LK.durrieLt, 'ink', .3);
  paint(rectPts(x - s * .62, y - s * 1.42, s * 1.24, s * .2), { wash: LK.clayDk, ink: LK.ink, sw: .8 });
  paint([[x - s * .55, y - s * 1.42], [x - s * .3, y - s * 1.75], [x + s * .1, y - s * 1.82], [x + s * .45, y - s * 1.66], [x + s * .58, y - s * 1.42]], { wash: LK.butter, ink: LK.ink, sw: .7, curv: .7 });
  if (o.dip) paint(ellPts(x + s * .12, y - s * 1.6, s * .16, s * .09, 10), { wash: '#EADBB8', ink: null });
}

// streaks behind a flier: from (x, y) back along angle ang, len px; k 0..1 strength
function speedLines(x, y, ang, len, k, key = 'speed') {
  if (k <= 0) return;
  boilSeed(key);
  for (let i = 0; i < 5; i++) {
    const o = (i - 2) * 18, px = -Math.sin(ang) * o, py = Math.cos(ang) * o, l = len * (.6 + .4 * hash(i)) * k;
    inkLine([[x + px - Math.cos(ang) * 40, y + py - Math.sin(ang) * 40], [x + px - Math.cos(ang) * (40 + l), y + py - Math.sin(ang) * (40 + l)]], 3, i % 2 ? LK.cream : LK.marigoldLt, 'ink', 0);
  }
}

// the cream photo border, screen space (the photo shows through y 380..1560)
function photoBorder() {
  boilSeed('polaroid');
  const b = 40, top = 380, bot = 1560;
  paint(rectPts(-20, -20, W + 40, top + 20), { wash: LK.cream, ink: null });
  paint(rectPts(-20, bot, W + 40, H - bot + 20), { wash: LK.cream, ink: null });
  paint(rectPts(-20, -20, b + 20, H + 40), { wash: LK.cream, ink: null });
  paint(rectPts(W - b, -20, b + 20, H + 40), { wash: LK.cream, ink: null });
  inkLine([[b, top], [W - b, top], [W - b, bot], [b, bot], [b, top]], 1.5, LK.grey, 'inkfine', 0);
}

// ---------- the card: the free wallpapers, the 1 lakh followers sale on both sets (no price), follow ----------
// C: { cap, gift, phone, free, pill, grab, sale, covers, follow } (video times)
function lakhCard(t, C) {
  boilSeed('cardbg');
  paint(rectPts(-60, -60, W + 120, H + 120), { wash: LK.peach, ink: null });
  boilSeed('card glow'); glow(470, 860, 460, '#FFE7A8', .35);
  const X = 470, pk = t0 => Math.max(0, t - t0) * 5, br = Math.sin(t * 1.3) * .01;
  if (t > C.cap) picture(PICS.logo, X, 500, 110, 110, { pop: pk(C.cap) });
  if (t > C.gift) letter('Thank you for 1 lakh! Our gift to you:', X, 604, 46, LK.teal, { screen: true, font: '46px Marcellus', ink: false, pop: pk(C.gift), maxW: 860 });
  // two phones with the free wallpapers, tilted apart
  [[PICS.wallA, 205, -.1, 0], [PICS.wallB, 375, .07, .15]].forEach(([img, x, rot, d], j) => {
    if (t <= C.phone + d) return;
    const k = backOut(clamp(pk(C.phone + d))), bob = Math.sin(t * 2 + j * 1.7) * 6, y = 885 + bob + (j ? 18 : 0);
    boilSeed('phone' + j);
    push(); translate(x, y); rotate(rot); scale(k);
    paint(rrPts(-92, -182, 184, 364, 26), { wash: '#2A2430', ink: LK.ink, sw: 1.2 });
    pop();
    picture(img, x, y, 162, 340, { rot, pop: pk(C.phone + d), r: 18 });
  });
  if (t > C.free) {
    letter('FREE', 690, 800, 120, LK.orange, { screen: true, font: '700 120px Poppins', ink: false, pop: pk(C.free), rot: -.04 });
    letter('WALLPAPERS', 690, 880, 52, LK.brown, { screen: true, font: '700 52px Poppins', ink: false, pop: pk(C.free + .12), rot: -.04, maxW: 360 });
    letter('for your phone', 690, 940, 34, LK.grey, { screen: true, font: '500 34px Poppins', ink: false, pop: pk(C.free + .24), rot: -.04 });
  }
  if (t > C.pill) {
    const k = backOut(clamp(pk(C.pill))) * (1 + .03 * pulse(t, 4));
    boilSeed('pill');
    push(); translate(690, 1030); scale(k); paint(rrPts(-190, -40, 380, 80, 40), { wash: LK.orange, ink: null }); pop();
    letter('rishikatha.com', 690, 1032, 44, LK.cream, { screen: true, font: '700 44px Poppins', ink: false, pop: pk(C.pill) });
  }
  if (t > C.grab) letter('Grab yours at our site (link in bio)', X, 1122, 38, LK.brown, { screen: true, font: '500 38px Poppins', ink: false, maxW: 820, pop: pk(C.grab) });
  // the sale: both sets, six small covers
  if (t > C.sale) {
    boilSeed('card rule'); inkLine([[150, 1180], [790, 1180]], 1.2, LK.peachDk, 'ink', 0);
    letter('1 LAKH FOLLOWERS SALE on both book sets', X, 1232, 42, LK.teal, { screen: true, font: '700 42px Poppins', ink: false, maxW: 840, pop: pk(C.sale) });
  }
  [1, 2, 3, 4, 5, 6].forEach((b, j) => {
    const t0 = C.covers + j * .1; if (t < t0) return;
    const x = X + (j - 2.5) * 128 + (j > 2 ? 14 : -14), y = 1330 + (j % 2 ? -6 : 0);
    picture(PICS['book' + b], x, y, 118, 118, { rot: (j % 2 ? br : -br) + (j - 2.5) * .015, pop: pk(t0), r: 6, shadow: 10 });
  });
  if (t > C.covers + .6) letter('Books 1–3 & 4–6 · on our site & Amazon', X, 1420, 32, LK.grey, { screen: true, font: '500 32px Poppins', ink: false, maxW: 840, pop: pk(C.covers + .6) });
  if (t > C.follow) letter('Follow @therishikatha', X, 1482, 42, LK.brown, { screen: true, font: '700 42px Poppins', ink: false, maxW: 860, pop: pk(C.follow) });
}
