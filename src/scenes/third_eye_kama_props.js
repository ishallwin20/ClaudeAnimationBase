// third_eye_kama_props.js: the sets and props for "What happens if Shiva opens his third eye?"
// (src/scenes/third_eye_kama.js). Loaded before it; everything here is a pure function of its arguments (and T for boil).
//
//   TK                                       the palette: Kailash at night, Kama's false spring, the fire, the brand
//   S = { spring, fire, dawn }               the light, each 0..1. tkTone(c, S) tints a colour by it
//   tkSky(S), kailash(S), tkGround(S), stars(a, t), snowfall(t, n), cuBackdrop(t, red, gold)       the sets
//   springFlower, bee, petalDrift, feather, flowerPlate, petalPuff, sparkStar                      spring and props
//   fireBeam, flameTongue, flames, fireWall, ashPile, smoke, emberSparks                           the fire
//   lensPts, eyeIris(cx, cy, h, col), eyeFill(cx, cy, h, col)                                      the eye-shaped seams
//   endCard(t, C)                                                                                  the book card
const TK = {
  ink: '#2B2233', cream: '#FFF5E2',
  night: '#1C2150', nightLt: '#36407E', mtn: '#3E4A88', mtnDk: '#2C3466', snow: '#E4ECF8', snowDk: '#A9B8D8', rock: '#56618E',
  plum: '#24163A', plumLt: '#3E2558', red: '#7A1420', redLt: '#C2362E',
  spring: '#F7B9C4', springLt: '#FFE1B8', meadow: '#A8D38C', meadowDk: '#7FB06A',
  petal: '#F4A6B8', petalDk: '#E0708C', white: '#FFF5E2', marigold: '#F39A2E', yellow: '#FFD45A', leaf: '#5E9A6A',
  fire: '#FF6A3D', fireDk: '#D2352A', fireLt: '#FFB347', core: '#FFF1C0', ash: '#8E8890', ashDk: '#5E5862', ashLt: '#BDB7BE',
  smoke: '#6E6878', gold: '#EDB43C', goldLt: '#FFE39A', goldDk: '#B67D1C', thali: '#E8B23C',
  rkOrange: '#F15A24', peach: '#FBE0CF', peachLt: '#FFF1E6', brown: '#3A2418', grey: '#6B5A50', teal: '#2E5F5A',
};
const tkTone = (c, S = {}) => mixCol(mixCol(mixCol(c, '#F6A8A0', (S.spring || 0) * .55), '#B8322A', (S.fire || 0) * .5), '#F2C48A', (S.dawn || 0) * .3);
const GROUND = 1450;   // the snow line in the wide set

// ---------- the sets ----------
function tkSky(S = {}) {
  boilSeed('tksky');
  const top = mixCol(mixCol(TK.night, '#E89AAE', (S.spring || 0) * .85), '#5A1420', (S.fire || 0) * .8);
  const low = mixCol(mixCol(TK.nightLt, TK.springLt, (S.spring || 0) * .9), '#C2362E', (S.fire || 0) * .8);
  paint(rectPts(-200, -200, W + 400, H + 400), { wash: top, ink: null });
  paint(ellPts(540, 1150, 1100, 520, 22), { wash: mixCol(top, low, .55), ink: null });
  paint(ellPts(540, 1250, 900, 260, 20), { wash: low, ink: null });
}
// Kailash: one great snow pyramid behind the stage, summit at (560, 300), with two shoulders of ridge.
function kailash(S = {}) {
  push(); translate(0, 115);
  const m = tkTone(TK.mtn, S), md = tkTone(TK.mtnDk, S), sn = tkTone(TK.snow, S), sd = tkTone(TK.snowDk, S);
  boilSeed('ridges');
  paint([[-200, 1340], [-120, 980], [60, 860], [200, 930], [330, 840], [420, 1000], [460, 1340]], { wash: mixCol(m, TK.night, .25), ink: null, curv: .1 });
  paint([[640, 1340], [700, 980], [820, 870], [940, 940], [1080, 820], [1260, 1000], [1300, 1340]], { wash: mixCol(m, TK.night, .25), ink: null, curv: .1 });
  boilSeed('kailash');
  paint([[60, 1340], [260, 900], [430, 520], [560, 300], [700, 520], [870, 900], [1040, 1340]], { wash: m, ink: null, curv: .05 });
  paint([[560, 300], [700, 520], [870, 900], [1040, 1340], [620, 1340], [600, 820]], { wash: md, ink: null, curv: .05 });
  boilSeed('kailashsnow');
  paint([[560, 300], [640, 420], [700, 520], [660, 560], [620, 520], [590, 600], [545, 540], [500, 610], [470, 540], [430, 520]], { wash: sn, ink: null, curv: .15 });
  for (const yy of [700, 800, 900]) inkLine([[560 - (yy - 300) * .5, yy + 30], [560, yy], [560 + (yy - 300) * .55, yy + 34]], 1.1, sd, 'dry', .3);   // the famous bands of snow
  inkLine([[430, 520], [500, 400], [560, 300], [630, 400], [700, 520]], 1.3, tkTone(TK.ink, S), 'ink', .1);
  pop();
}
// The snow underfoot. S.spring greens it into a meadow.
function tkGround(S = {}) {
  const c = mixCol(tkTone(TK.snow, { ...S, spring: 0 }), TK.meadow, (S.spring || 0) * .9), cd = mixCol(tkTone(TK.snowDk, { ...S, spring: 0 }), TK.meadowDk, (S.spring || 0) * .9);
  boilSeed('tkground');
  const top = []; for (let x = -200; x <= W + 200; x += 70) top.push([x, GROUND + 8 * Math.sin(x * .009) + 6 * Math.sin(x * .023)]);
  paint([...top, [W + 200, H + 200], [-200, H + 200]], { wash: c, ink: null });
  inkLine(top.filter(p => p[0] > -80 && p[0] < W + 80), 1.2, tkTone(TK.rock, S), 'ink', .3);
  for (let i = 0; i < 9; i++) {
    boilSeed('tkdab' + i);
    paint(ellPts(60 + hash(i * 3.3) * 960, GROUND + 70 + 380 * hash(i * 7.1), 70 + 60 * hash(i), 9 + 6 * hash(i * 2), 12), { wash: cd, washOp: 170, ink: null });
  }
}
function stars(a, t, n = 18) {
  if (a <= .02) return;
  boilSeed('tkstars');
  for (let i = 0; i < n; i++) {
    const x = 40 + hash(i * 3.7) * (W - 80), y = 60 + hash(i * 9.1) * 760, tw = .6 + .4 * wob(t, .5 + hash(i), hash(i * 2));
    paint(starPts(x, y, (4 + 7 * hash(i * 5.3)) * tw, .35, 4), { wash: '#FFF1CF', washOp: 255 * a, ink: null });
  }
}
// Falling snow in screen space; a = opacity.
function snowfall(t, n = 14, a = 1) {
  if (a <= .02) return;
  boilSeed('tksnowfall');
  for (let i = 0; i < n; i++) {
    const x = W * frac(hash(i * 3.1) + .03 * Math.sin(t * .7 + i)), y = H * frac(hash(i * 7.7) + t * (.035 + .035 * hash(i * 1.3))), r = 3 + 4 * hash(i * 5.3);
    paint(ellPts(x, y, r, r, 8), { wash: TK.snow, washOp: 230 * a, ink: null });
  }
}
// The close-up's backdrop: deep plum night, warming to red (red 0..1) or to gold (gold 0..1), a halo behind the head.
function cuBackdrop(t, red = 0, gold = 0, hx = 540, hy = 1130) {
  boilSeed('cubg');
  const c = mixCol(mixCol(TK.plum, TK.red, red), '#3A2A5A', gold * .6);
  paint(rectPts(-200, -200, W + 400, H + 400), { wash: c, ink: null });
  paint(ellPts(hx, hy, 520, 520, 26), { wash: mixCol(c, mixCol(TK.plumLt, TK.redLt, red), .5 + .1 * Math.sin(t * 1.4)), washOp: 200, ink: null });
  stars(1 - red * .7, t, 22);
  if (gold > 0) glow(hx, hy - 90, 700 * gold, TK.goldLt, .5 * gold);
  if (red > 0) glow(hx, hy - 90, 600 * red, TK.fire, .35 * red);
}

// ---------- spring and props ----------
// A spring flower: (x, y) = where its stem leaves the ground; k = its pop 0..1; burn 0..1 chars and shrinks it.
function springFlower(x, y, s, k, kind = 0, key = '', burn = 0) {
  if (k <= .02 || burn >= 1) return;
  boilSeed('sf' + key);
  const q = backOut(clamp(k)) * (1 - easeIn(burn) * .8), h = s * 1.15 * q, ch = c => burn > 0 ? mixCol(c, '#2E2628', burn) : c;
  inkLine([[x, y], [x + s * .08, y - h * .5], [x, y - h]], 1.3, ch(TK.leaf), 'ink', .5);
  for (const d of [-1, 1]) paint([[x, y - h * .25], [x + d * s * .5 * q, y - h * .55], [x + d * s * .18 * q, y - h * .2]], { wash: ch(TK.leaf), ink: null, curv: .5 });
  const col = [TK.petal, TK.white, TK.marigold, TK.yellow][kind % 4];
  paint(starPts(x, y - h, s * .6 * q, .58, kind % 2 ? 5 : 6, hash(x) * 3), { wash: ch(col), ink: TK.ink, sw: .7, curv: .6 });
  paint(ellPts(x, y - h, s * .16 * q, s * .16 * q, 8), { wash: ch(kind === 2 ? TK.yellow : TK.marigold), ink: null });
}
// A bee: a striped yellow body with a blur of wings; (x, y) its centre, s its length.
function bee(x, y, s, t, key = '') {
  boilSeed('bee' + key);
  const fl = Math.sin(t * 60 + x) * .5;
  for (const d of [-1, 1]) paint(ellPts(x + d * s * .15, y - s * .45, s * .3, s * (.22 + .1 * fl), 8, 0, d * .5), { wash: TK.white, washOp: 190, ink: null });
  paint(ellPts(x, y, s * .5, s * .34, 10), { wash: TK.yellow, ink: TK.ink, sw: .6 });
  for (const k of [-.12, .15]) inkLine([[x + k * s, y - s * .3], [x + k * s, y + s * .3]], 1.4, TK.ink, 'inkfine', 0);
}
// A petal drifting on a sway; colour by index.
function petal(x, y, s, rot, i, a = 1) {
  paint([[x + Math.cos(rot) * s, y + Math.sin(rot) * s], [x + Math.cos(rot + 1.6) * s * .45, y + Math.sin(rot + 1.6) * s * .45], [x - Math.cos(rot) * s, y - Math.sin(rot) * s], [x + Math.cos(rot - 1.6) * s * .45, y + Math.sin(rot - 1.6) * s * .45]],
    { wash: [TK.petal, TK.white, TK.springLt, TK.petalDk][i % 4], washOp: 230 * a, ink: null, curv: .5 });
}
// Petals drifting across the frame (screen space), dens 0..1.
function petalDrift(t, dens, key = 'drift') {
  if (dens <= .02) return;
  boilSeed(key);
  for (let i = 0; i < 18; i++) {
    if (hash(i * 1.9) > dens) continue;
    const x = W * frac(hash(i * 3.3) - t * (.05 + .04 * hash(i))) , y = H * frac(hash(i * 5.7) + t * (.04 + .03 * hash(i * 2.2))) + 30 * Math.sin(t * 2 + i);
    petal(x, y, 16 + 10 * hash(i * 4.4), t * 2 + i, i);
  }
}
// A green feather: (x, y) its middle, s its length.
function feather(x, y, s, rot, key) {
  boilSeed('feather' + key);
  push(); translate(x, y); rotate(rot);
  paint(ribbon([[-s * .5, 0], [0, -s * .06], [s * .5, 0]], s * .05, s * .3), { wash: '#6DBE4E', fill: '#3F8A34', fillOp: 60, tex: .4, ink: TK.ink, sw: .6 });
  inkLine([[-s * .55, 0], [s * .45, -s * .02]], .8, '#3F8A34', 'inkfine', .3);
  pop();
}
// Parvati's offering: a gold thali heaped with flowers, centred on (x, y) (its rim), s ≈ its half-width.
function flowerPlate(x, y, s, rot = 0, spill = 0) {
  boilSeed('thali');
  push(); translate(x, y); rotate(rot);
  if (spill < .5) for (let i = 0; i < 6; i++) {
    const fx = (-.6 + i * .24) * s, fy = -(.18 + .22 * Math.sin(i * 2.1 + 1) ** 2) * s;
    paint(starPts(fx, fy, s * .26, .55, 5, i), { wash: [TK.marigold, TK.petal, TK.white, TK.marigold, TK.petalDk, TK.yellow][i], ink: TK.ink, sw: .5, curv: .5 });
  }
  paint(ellPts(0, 0, s, s * .28, 18), { wash: TK.thali, fill: TK.goldDk, fillOp: 60, tex: .4, ink: TK.ink, sw: .8 });
  inkLine([[-s * .7, -s * .05], [0, s * .06], [s * .7, -s * .05]], .7, TK.goldLt, 'inkfine', .5);
  paint(ellPts(s * .45, -s * .22, s * .1, s * .14, 8), { wash: TK.fire, ink: null });   // a little diya flame
  pop();
}
// Petals bursting out of (x, y): the flower arrow hits. age in seconds.
function petalPuff(x, y, s, age) {
  if (age < 0 || age > 1.1) return;
  boilSeed('puff');
  const k = age / 1.1;
  for (let i = 0; i < 14; i++) {
    const a = i / 14 * TAU + hash(i) * .5, d = s * (.2 + easeOut(k) * (1 + .6 * hash(i * 3))), p = [x + Math.cos(a) * d, y + Math.sin(a) * d * .8 + k * k * s * .6];
    petal(p[0], p[1], s * (.12 + .06 * hash(i * 5)) * (1 - k * .4), a + age * 6, i, 1 - k * k);
  }
}
// A four-point spark (a snap, a glint).
function sparkStar(x, y, r, key = 'spark', col = TK.goldLt) {
  if (r < 1) return;
  boilSeed(key);
  glow(x, y, r * 2.4, col, .8);
  paint(starPts(x, y, r, .22, 4), { wash: TK.cream, ink: null });
}

// ---------- the fire ----------
// The third eye's beam: from p0 (the eye) to p1, w px wide; a red rim, an orange body and a pale core, licking.
function fireBeam(p0, p1, w, t) {
  if (w < 2) return;
  const dx = p1[0] - p0[0], dy = p1[1] - p0[1], d = Math.hypot(dx, dy) || 1, nx = -dy / d, ny = dx / d;
  const path = k => { const P = []; for (let i = 0; i <= 8; i++) { const q = i / 8, wv = Math.sin(q * 9 - t * 30 + k) * w * .12 * q; P.push([p0[0] + dx * q + nx * wv, p0[1] + dy * q + ny * wv]); } return P; };
  for (let i = 0; i <= 4; i++) glow(lerp(p0[0], p1[0], i / 4), lerp(p0[1], p1[1], i / 4), w * 2.2, TK.fire, .6);
  boilSeed('beam');
  paint(ribbon(path(0), w * .25, w * 1.3), { wash: TK.fireDk, ink: null });
  paint(ribbon(path(1), w * .18, w * .95), { wash: TK.fire, ink: null });
  paint(ribbon(path(2), w * .1, w * .5), { wash: TK.fireLt, ink: null });
  paint(ribbon(path(3), w * .05, w * .2), { wash: TK.core, ink: null });
}
// One flame tongue standing on (x, y), h tall, flickering with t.
function flameTongue(x, y, h, t, i, col) {
  const f = Math.sin(t * (14 + 5 * hash(i)) + i * 2.3), w = h * .32, lean = .18 * f;
  paint([[x - w, y], [x - w * .8, y - h * .35], [x - w * .2 + lean * h * .5, y - h * .7], [x + lean * h, y - h * (1 + .1 * f)], [x + w * .45, y - h * .55], [x + w, y - h * .2], [x + w * .7, y]], { wash: col, ink: null, curv: .5 });
}
// A blaze centred on (x, y) (its base), s high, k 0..1 strength.
function flames(x, y, s, t, k, key = 'flames') {
  if (k <= .02) return;
  glow(x, y - s * .4, s * 1.6 * k, TK.fire, .9 * k);
  boilSeed(key);
  for (let i = 0; i < 7; i++) flameTongue(x + (i - 3) * s * .16 * (1 + .2 * hash(i)), y, s * k * (.55 + .45 * Math.sin(i / 6 * Math.PI)) * (.8 + .3 * hash(i * 3)), t, i, TK.fireDk);
  for (let i = 0; i < 5; i++) flameTongue(x + (i - 2) * s * .14, y, s * k * (.4 + .3 * Math.sin(i / 4 * Math.PI)), t + .2, i + 9, TK.fire);
  for (let i = 0; i < 3; i++) flameTongue(x + (i - 1) * s * .12, y, s * k * .3, t + .4, i + 19, TK.fireLt);
}
// The wave of fire racing out across the ground from cx: two low walls at cx ± r, k = strength.
function fireWall(cx, r, t, k) {
  if (k <= .02) return;
  for (const d of [-1, 1]) {
    const x = cx + d * r;
    if (x < -150 || x > W + 150) continue;
    for (let j = 0; j < 3; j++) flames(x - d * j * 55, GROUND + 30 + j * 70, (130 - j * 25) * k, t + j, 1, 'wall' + d + j);
  }
}
// What's left of Kama: a little grey mound with his crown on top, a curl of smoke. k = it settles in 0..1.
function ashPile(x, y, s, k, t, glowK = 0) {
  if (k <= .02) return;
  if (glowK > 0) glow(x, y - s * .3, s * 2.4 * glowK, '#FF9AB0', glowK);
  boilSeed('ash');
  const q = easeOut(k);
  paint([[x - s, y], [x - s * .7, y - s * .3 * q], [x - s * .2, y - s * .55 * q], [x + s * .3, y - s * .5 * q], [x + s * .8, y - s * .25 * q], [x + s * 1.05, y]], { wash: TK.ash, fill: TK.ashDk, fillOp: 70, tex: .7, ink: TK.ink, sw: 1, curv: .5 });
  for (let i = 0; i < 7; i++) paint(ellPts(x + (hash(i * 2.7) - .5) * s * 1.4, y - s * (.08 + .3 * hash(i * 4.1)) * q, 4, 3, 6), { wash: i % 2 ? TK.ashDk : TK.ashLt, ink: null });
  // the crown, sooty and askew
  boilSeed('ashcrown');
  push(); translate(x + s * .05, y - s * .52 * q); rotate(.28);
  const c = s * .42;
  paint([[-c, 0], [c, 0], [c * .9, -c * .45], [c * .6, -c * .38], [c * .4, -c * .75], [0, -c * .95], [-c * .4, -c * .75], [-c * .6, -c * .38], [-c * .9, -c * .45]], { wash: mixCol(TK.gold, TK.ashDk, .35), fill: TK.goldDk, fillOp: 60, tex: .5, ink: TK.ink, sw: .9, curv: .15 });
  paint(ellPts(0, -c * .45, c * .14, c * .16, 8), { wash: mixCol(TK.petalDk, TK.ashDk, .3), ink: null });
  pop();
}
// A curl of smoke rising from (x, y): age seconds, a opacity.
function smoke(x, y, s, t, a = 1, key = 'smoke') {
  if (a <= .02) return;
  boilSeed(key);
  for (let i = 0; i < 6; i++) {
    const k = frac(t * .45 + i / 6), px = x + Math.sin(k * 5 + i) * s * .35 * k, py = y - k * s * 2.6, r = s * (.18 + .35 * k);
    paint(ellPts(px, py, r, r * .85, 12, 2), { wash: TK.smoke, washOp: 170 * a * (1 - k), ink: null });
  }
}
// Embers floating up from (x, y).
function emberSparks(x, y, s, t, a = 1, key = 'embers') {
  if (a <= .02) return;
  boilSeed(key);
  for (let i = 0; i < 10; i++) {
    const k = frac(t * (.5 + .3 * hash(i)) + hash(i * 3)), px = x + (hash(i * 7) - .5) * s * 1.6 + Math.sin(t * 3 + i) * 12, py = y - k * s * 2;
    glow(px, py, 14, TK.fireLt, a * (1 - k));
    paint(ellPts(px, py, 3.5, 3.5, 6), { wash: TK.fireLt, washOp: 255 * a * (1 - k), ink: null });
  }
}

// ---------- the eye-shaped seams ----------
// A vertical almond (the third eye's shape), centred on (cx, cy), h tall, w = h * .44.
function lensPts(cx, cy, h, n = 16) {
  const p = [], w = h * .22;
  for (let i = 0; i <= n; i++) { const a = i / n; p.push([cx + Math.sin(Math.PI * a) * w * 2, cy - h / 2 + h * a]); }
  for (let i = n - 1; i > 0; i--) { const a = i / n; p.push([cx - Math.sin(Math.PI * a) * w * 2, cy - h / 2 + h * a]); }
  return p;
}
// Everything outside the almond painted col (the eye opening onto a new shot).
function eyeIris(cx, cy, h, col) { if (h < 6) paint(rectPts(-60, -60, W + 120, H + 120), { wash: col, ink: null }); else irisShape(lensPts(cx, cy, h), col); }
// The almond itself painted col (the eye's light growing out over the old shot).
function eyeFill(cx, cy, h, col, rim = null) {
  if (h < 4) return;
  boilSeed('eyefill');
  if (h > 5200) { paint(rectPts(-60, -60, W + 120, H + 120), { wash: col, ink: null }); return; }
  paint(lensPts(cx, cy, h), { wash: col, ink: rim, sw: 3 });
}

// ---------- the book card ----------
// The Rishi Katha end card (as in the Shailputri ad), with Book 2 in the centre: what Parvati did next.
// C = { book, fan, logo, series, sub, pill, follow } (times); centre / sides = PICS keys.
function endCard(t, C, centre = 'book2', sides = ['book1', 'book3']) {
  boilSeed('cardbg');
  paint(rectPts(-60, -60, W + 120, H + 120), { wash: TK.peach, ink: null });
  boilSeed('cardpetals');
  for (let i = 0; i < 9; i++) {
    const x = 60 + hash(i * 3.3) * 960 + 30 * Math.sin(t * .9 + i), y = frac(hash(i * 7.1) + t * (.035 + .02 * hash(i))) * (H + 80) - 40, r = t * .8 + i;
    paint([[x + Math.cos(r) * 15, y + Math.sin(r) * 15], [x + Math.cos(r + 1.6) * 7, y + Math.sin(r + 1.6) * 7], [x - Math.cos(r) * 15, y - Math.sin(r) * 15], [x + Math.cos(r - 1.6) * 7, y + Math.sin(r - 1.6) * 7]], { wash: i % 2 ? TK.marigold : TK.petal, washOp: 200, ink: null, curv: .5 });
  }
  const X = 508, BY = 872, fan = backOut(seg(t, C.fan, C.fan + .45)), br = Math.sin(t * 1.3) * .008;
  const pk = t0 => Math.max(0, t - t0) * 5;
  if (t > C.fan - .02) {
    picture(PICS[sides[0]], lerp(X, 300, fan), BY + 6, 400, 400, { rot: -.12 * fan + br, r: 10, shadow: 22 });
    picture(PICS[sides[1]], lerp(X, 716, fan), BY + 6, 400, 400, { rot: .12 * fan - br, r: 10, shadow: 22 });
  }
  if (t > C.book) picture(PICS[centre], X, BY, 470, 470, { rot: -br * .5, pop: pk(C.book), r: 10, shadow: 28 });
  if (t > C.logo) picture(PICS.logo, X, 512, 170, 170, { pop: pk(C.logo) });
  if (t > C.series) letter('The Navadurga Series', X, 1180, 78, TK.teal, { screen: true, font: '78px Marcellus', ink: false, pop: pk(C.series) });
  if (t > C.sub) letter('Picture books · Ages 4–8 · Set of 3 for ₹600', X, 1252, 38, TK.brown, { screen: true, font: '500 38px Poppins', ink: false, maxW: 820, pop: pk(C.sub) });
  if (t > C.pill) {
    const k = backOut(clamp(pk(C.pill))) * (1 + .03 * pulse(t, 4));
    boilSeed('pill');
    push(); translate(X, 1352); scale(k); paint(rrPts(-220, -46, 440, 92, 45), { wash: TK.rkOrange, ink: null }); pop();
    letter('rishikatha.com', X, 1354, 52, TK.cream, { screen: true, font: '700 52px Poppins', ink: false, pop: pk(C.pill) });
  }
  if (t > C.follow) letter("Follow @therishikatha for Parvati's story", X, 1444, 38, TK.grey, { screen: true, font: '500 38px Poppins', ink: false, maxW: 820, pop: pk(C.follow) });
}
