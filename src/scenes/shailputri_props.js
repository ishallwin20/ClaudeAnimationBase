// shailputri_props.js: the sets and props for "Why does Shailputri ride a bull?" (src/scenes/shailputri_bull.js).
// Loaded before it; everything here is a pure function of its arguments (and T for boil), shared by the shots.
//
//   SP                                  the palette (from the cover of Book 1, plus the Rishi Katha brand colours)
//   S = { warm, night, dusk }           the light, each 0..1: golden morning, night, festive teal dusk. spTone(c, S)
//   sky(S, wide), bigPeak(S), ridge(scroll, o), snowGround(scroll, S, yFn, x0, x1, bottom)      the mountain sets
//   snowfall, gust, pine, flags, cloud, hoofPrints, sunDisc, moonDisc, stars                    weather and dressing
//   boulder, shards, dustPuff, snowBurst, bird, flower, petalSwirl                              props and marks
//   archPts, niche, diya, deviSil(i, cx, cy, s, k)                                              the wall of nine niches
//   endCard(t, lt, C)                                                                          the book card (picture())
const SP = {
  ink: '#2B2233', cream: '#FFF5E2',
  sky: '#9CC8E8', skyLt: '#CFE6F3', skyWarm: '#F6D9A8', skyNight: '#1F2550', mtn: '#6E93CC', mtnDk: '#4C6CA8', mtnFar: '#A9C4E4',
  snow: '#FFF8EC', snowDk: '#C9D8EC', rock: '#8E9BB8', rockDk: '#5F6C8C', pine: '#3F7A5E', pineDk: '#2C5A46', wood: '#8A5A3C',
  marigold: '#F39A2E', flowerW: '#FFF5E2', flowerO: '#E8793A', leaf: '#5E9A6A', sun: '#FFE39A', moon: '#FFF1CF',
  teal: '#2E5F5A', tealDk: '#1F4541', tealLt: '#4C8A82', gold: '#EDB43C', goldLt: '#FFE39A', sil: '#2A2450', silLt: '#4A4280',
  clay: '#C8703E', clayDk: '#8E4424', flame: '#FFE9A8', flameDk: '#FFAA45', warm: '#FFB45A',
  rkOrange: '#F15A24', peach: '#FBE0CF', peachLt: '#FFF1E6', brown: '#3A2418', grey: '#6B5A50',
  petal: '#F4A6B8', birdBack: '#3A9C98', birdBreast: '#F39A2E',
};
const spTone = (c, S = {}) => mixCol(mixCol(mixCol(c, '#F2C48A', (S.warm || 0) * .2), SP.skyNight, (S.night || 0) * .6), SP.teal, (S.dusk || 0) * .6);

// ---------- the mountain sets ----------
// The sky: a flat wash, with one lighter band low. wide = also cover what the camera sees when it pulls back to .56.
function sky(S = {}, wide = false) {
  boilSeed('sky');
  const c = mixCol(mixCol(mixCol(SP.sky, '#FBDDAE', S.warm || 0), SP.skyNight, S.night || 0), SP.tealLt, S.dusk || 0);
  if (wide) for (const x of [-520, 530]) for (const y of [-1260, 520]) paint(rectPts(x, y, 1070, 1800), { wash: c, ink: null });
  else paint(rectPts(-60, -60, W + 120, H + 120), { wash: c, ink: null });
  if (!wide) paint(ellPts(540, 1150, 900, 330, 20), { wash: mixCol(c, SP.cream, .3 * (1 - (S.night || 0) * .7)), ink: null });
}
// The mountain she is the daughter of: summit (540, -420), a blue body so the white bull reads against it, snow on top.
function bigPeak(S = {}) {
  boilSeed('peak');
  const m = spTone(SP.mtn, S), md = spTone(SP.mtnDk, S), sn = spTone(SP.snow, S);
  paint([[-620, 1360], [-380, 900], [-150, 560], [60, 180], [300, -150], [540, -420], [760, -170], [1000, 200], [1230, 600], [1460, 930], [1700, 1360]], { wash: m, ink: null, curv: .08 });
  paint([[540, -420], [760, -170], [1000, 200], [1230, 600], [1460, 930], [1700, 1360], [1180, 1360], [1130, 700], [900, 60]], { wash: mixCol(m, md, .55), ink: null, curv: .08 });
  boilSeed('peaksnow');
  paint([[540, -420], [760, -170], [900, 40], [800, 10], [720, 150], [640, -20], [560, 130], [470, -40], [380, 110], [300, -60], [200, 30], [300, -150]], { wash: sn, ink: null, curv: .12 });
  for (const [a, b, c] of [[[-330, 1010], [-210, 820], [-150, 1040]], [[1290, 900], [1390, 760], [1450, 960]], [[-60, 480], [30, 350], [80, 520]], [[1100, 470], [1170, 360], [1240, 540]]])
    paint([a, b, c, [lerp(a[0], c[0], .5), lerp(a[1], c[1], .5) - 40]], { wash: sn, ink: null, curv: .2 });
  inkLine([[300, -150], [420, -290], [540, -420], [650, -300], [760, -170]], 1.4, spTone(SP.ink, S), 'ink', .1);
}
// A scrolling row of peaks: o = { y (their base), h, period, seed, col, snow (colour or null), x0, x1 }.
function ridge(scroll, o) {
  const P = o.period, x0 = o.x0 ?? -80, x1 = o.x1 ?? W + 80;
  for (let i = Math.floor((x0 + scroll) / P) - 1; i <= Math.floor((x1 + scroll) / P) + 1; i++) {
    boilSeed('ridge' + o.seed + ' ' + i);
    const cx = i * P - scroll + P * .25 * hash(i * o.seed), hh = o.h * (.55 + .45 * hash(i * o.seed + 1.7)), y = o.y;
    paint([[cx - P * .8, y + 6], [cx - P * .34, y - hh * .58], [cx - P * .1, y - hh * .9], [cx, y - hh], [cx + P * .12, y - hh * .86], [cx + P * .4, y - hh * .5], [cx + P * .8, y + 6]], { wash: o.col, ink: null, curv: .1 });
    if (o.snow) paint([[cx - P * .13, y - hh * .82], [cx, y - hh], [cx + P * .15, y - hh * .8], [cx + P * .07, y - hh * .72], [cx, y - hh * .8], [cx - P * .06, y - hh * .7]], { wash: o.snow, ink: null, curv: .1 });
  }
  boilSeed('ridgebase' + o.seed);
  paint(rectPts(x0, o.y, x1 - x0, o.depth ?? 260), { wash: o.col, ink: null });
}
// The snow underfoot: from the ground line yFn(x) down to `bottom`, an inked top edge, blue shadow dabs that scroll.
function snowGround(scroll = 0, S = {}, yFn = () => 1420, x0 = -80, x1 = W + 80, bottom = H + 80) {
  const c = spTone(SP.snow, S), cd = spTone(SP.snowDk, S), yy = x => yFn(x) + 5 * Math.sin((x + scroll) * .011);
  for (let a = x0; a < x1; a += 1040) {
    boilSeed('ground' + a);
    const b = Math.min(x1, a + 1040), top = [];
    for (let x = a; x <= b; x += 65) top.push([x, yy(x)]);
    top.push([b + 4, yy(b)]);
    for (let y = Math.min(...top.map(p => p[1])) + 200; y < bottom; y += 900) paint(rectPts(a, y, b - a + 6, Math.min(910, bottom - y)), { wash: c, ink: null });
    paint([...top, [b + 4, yy(b) + 260], [a, yy(a) + 260]], { wash: c, ink: null });
    inkLine(top, 1.2, spTone(SP.rockDk, S), 'ink', .3);
  }
  for (let i = Math.floor((x0 + scroll) / 270) - 1; i <= Math.floor((x1 + scroll) / 270) + 1; i++) {
    boilSeed('dab' + i);
    const x = i * 270 - scroll + 90 * hash(i * 3.3), y = yFn(x) + 46 + 140 * hash(i * 7.1);
    paint(ellPts(x, y, 70 + 50 * hash(i), 9 + 6 * hash(i * 2), 12), { wash: cd, washOp: 170, ink: null });
  }
}

// ---------- weather and dressing ----------
// Falling snow, in screen space: n flakes; wind 0..1 blows them to the left as streaks; skip = [y0, y1] keeps a band clear.
function snowfall(t, n = 10, wind = 0, skip = null) {
  boilSeed('snowfall');
  for (let i = 0; i < n; i++) {
    const x = W * frac(hash(i * 3.1) - t * (.012 + wind * (.7 + .5 * hash(i * 1.9)))), y = H * frac(hash(i * 7.7) + t * (.05 + .05 * hash(i * 1.3)) + wind * t * .15), r = 3 + 4 * hash(i * 5.3);
    if (skip && y > skip[0] && y < skip[1]) continue;
    if (wind > .15) inkLine([[x, y], [x + 50 * wind + 40 * wind * hash(i), y - 8 * wind]], 1.2, SP.snow, 'ink', 0);
    else paint(ellPts(x, y, r, r, 8), { wash: SP.snow, ink: null });
  }
}
// A gale from the right: dry-brush streaks racing to the left, in screen space.
function gust(t, k) {
  if (k <= .02) return;
  boilSeed('gust');
  for (let i = 0; i < 9; i++) {
    const y = H * (.3 + .5 * hash(i * 2.3)), x = W * (1.25 - frac(hash(i * 5.1) + t * (1.1 + .5 * hash(i))) * 1.9), w = 300 + 260 * hash(i * 3);
    inkLine([[x, y], [x + w * .5, y - 10 + 6 * Math.sin(t * 9 + i)], [x + w, y + 4]], 1.6 * k, SP.snow, 'dry', .5);
  }
}
function pine(x, y, s, lean = 0, S = {}) {
  boilSeed('pine' + x);
  push(); translate(x, y); rotate(lean);
  paint([[-s * .06, 0], [-s * .05, -s * .4], [s * .05, -s * .4], [s * .06, 0]], { wash: spTone(SP.wood, S), ink: SP.ink, sw: .7 });
  for (let k = 0; k < 3; k++) {
    const w = s * (.34 - k * .08), y0 = -s * (.2 + k * .26), y1 = y0 - s * .38;
    paint([[-w, y0], [-w * .4, y0 - s * .16], [0, y1], [w * .4, y0 - s * .16], [w, y0], [0, y0 - s * .04]], { wash: spTone(SP.pine, S), ink: SP.ink, sw: .8, curv: .15 });
    paint([[-w * .42, y0 - s * .17], [0, y1], [w * .42, y0 - s * .17], [w * .15, y0 - s * .2], [0, y0 - s * .15], [-w * .18, y0 - s * .21]], { wash: spTone(SP.snow, S), ink: null, curv: .2 });
  }
  pop();
}
// A pole and a string of prayer flags from its top to (x1, y1); wind 0..1 snaps them out to the left.
function flags(x0, y0, x1, y1, t, wind = 0, S = {}, h = 520) {
  boilSeed('flagpole');
  paint([[x0 - 7, y0 + h], [x0 - 5, y0], [x0 + 5, y0], [x0 + 7, y0 + h]], { wash: spTone(SP.wood, S), ink: SP.ink, sw: .8 });
  const at = k => [lerp(x0, x1, k), lerp(y0, y1, k) + 70 * Math.sin(k * Math.PI) * (1 - wind * .5)];
  const str = []; for (let k = 0; k <= 8; k++) str.push(at(k / 8));
  inkLine(str, .9, SP.ink, 'inkfine', .5);
  const cols = ['#4C7CC8', '#FFF8EC', '#E2574A', '#5E9A6A', '#F2C044'];
  for (let i = 0; i < 7; i++) {
    boilSeed('flag' + i);
    const a = at((i + .6) / 8.2), b = at((i + 1.25) / 8.2), fl = Math.sin(t * (5 + wind * 16) + i * 1.3) * (.12 + wind * .2);
    const dx = -wind * 58 + fl * 30, dy = 62 * (1 - wind * .75) + fl * 14 * wind;
    paint([a, b, [b[0] + dx, b[1] + dy], [a[0] + dx, a[1] + dy + fl * 10]], { wash: spTone(cols[i % 5], S), ink: SP.ink, sw: .6 });
  }
}
function cloud(x, y, s, S = {}, a = 1) {
  if (a <= .02) return;
  boilSeed('cloud' + Math.round(s));
  paint(through([[x - s, y], [x - s * .62, y - s * .3], [x - s * .2, y - s * .26], [x + s * .1, y - s * .5], [x + s * .5, y - s * .3], [x + s, y - s * .04], [x + s * .5, y + s * .12], [x - s * .4, y + s * .14], [x - s, y]], 4),
    { wash: spTone(SP.snow, S), washOp: 255 * a, ink: null });
}
// Hoof prints trailing down-left from (x, y): n pairs of small blue dabs.
function hoofPrints(x, y, n, a = 1) {
  if (a <= .02) return;
  boilSeed('prints');
  for (let i = 0; i < n; i++) for (const s of [-1, 1])
    paint(ellPts(x - i * 95 - (s > 0 ? 40 : 0), y + i * 62 + s * 16, 17, 9, 8, 0, -.5), { wash: SP.snowDk, washOp: 230 * a, ink: null });
}
function sunDisc(x, y, r, a = 1) {
  if (a <= .02) return;
  glow(x, y, r * 4.5, '#FFD27A', .8 * a);
  boilSeed('sun'); paint(ellPts(x, y, r, r, 24, 1.5), { wash: SP.sun, washOp: 255 * a, ink: null });
}
function moonDisc(x, y, r, a = 1) {
  if (a <= .02) return;
  glow(x, y, r * 3.5, '#BFD3FF', .6 * a);
  boilSeed('moon'); paint(crescentPts(x, y, r, -.9, 12), { wash: SP.moon, washOp: 255 * a, ink: null });
}
function stars(a, t) {
  if (a <= .02) return;
  boilSeed('stars');
  for (let i = 0; i < 16; i++) {
    const x = 60 + hash(i * 3.7) * (W - 120), y = 120 + hash(i * 9.1) * 700, tw = .6 + .4 * wob(t, .5 + hash(i), hash(i * 2));
    paint(starPts(x, y, (5 + 7 * hash(i * 5.3)) * tw, .35, 4), { wash: SP.moon, washOp: 255 * a, ink: null });
  }
}

// ---------- props and marks ----------
const boulderR = (i, r) => r * (.84 + .16 * hash(i * 4.7 + 2));
function boulder(x, y, r, rot = 0, crack = 0) {
  boilSeed('boulder');
  const pts = []; for (let i = 0; i < 11; i++) { const a = rot + i / 11 * TAU; pts.push([x + Math.cos(a) * boulderR(i, r), y + Math.sin(a) * boulderR(i, r)]); }
  paint(pts, { wash: SP.rock, fill: SP.rockDk, fillOp: 70, bleed: .05, tex: .6, border: .4, ink: SP.ink, sw: 1.6, curv: .12 });
  const P = (a, k) => [x + Math.cos(rot + a) * r * k, y + Math.sin(rot + a) * r * k];
  inkLine([P(.4, .75), P(.9, .4), P(1.6, .62)], 1.1, SP.rockDk, 'inkfine', .3);
  inkLine([P(3.3, .7), P(3.9, .35), P(4.6, .6)], 1.1, SP.rockDk, 'inkfine', .3);
  if (crack > 0) {
    const c = [[-.95, -.1], [-.55, .12], [-.3, -.12], [0, .1], [.3, -.1], [.6, .14], [.95, -.05]].slice(0, 2 + Math.round(5 * clamp(crack)));
    inkLine(c.map(([a, b]) => [x + a * r, y + b * r]), 2.2, SP.ink, 'ink', 0);
    inkLine(c.slice(0, 4).map(([a, b]) => [x + a * r * .5 + r * .1, y - r * .5 + b * r + a * r * .4]), 1.6, SP.ink, 'ink', 0);
  }
}
// The boulder bursts: 9 pieces fly out on arcs from (x, y); three land as pebbles and stay, the rest tumble away.
function shards(x, y, r, age, gy) {
  if (age < 0) return;
  for (let i = 0; i < 9; i++) {
    boilSeed('shard' + i);
    const stay = i < 3, a = i / 9 * TAU + .3, k = clamp(age / (.55 + .25 * hash(i * 2.1)));
    const p0 = [x + Math.cos(a) * r * .45, y + Math.sin(a) * r * .45];
    const p1 = stay ? [x - 40 + i * 120, gy - 14] : [x + Math.cos(a) * 700 + 160, gy + 300];
    const p = arcPt(p0, p1, stay ? 170 + 60 * i : 330 + 200 * hash(i * 3.3), k), s = stay ? lerp(r * .3, 26 - i * 4, k) : r * (.2 + .16 * hash(i * 5.5));
    if (!stay && k >= 1) continue;
    const rot = age * (4 + 5 * hash(i)) * (stay ? 1 - k : 1), pts = [];
    for (let j = 0; j < 6; j++) { const b = rot + j / 6 * TAU, q = s * (.7 + .3 * hash(i * 9 + j)); pts.push([p[0] + Math.cos(b) * q, p[1] + Math.sin(b) * q]); }
    paint(pts, { wash: i % 2 ? SP.rock : SP.rockDk, ink: SP.ink, sw: 1.1 });
  }
}
function dustPuff(x, y, s, age, col = SP.snow) {
  if (age < 0 || age > .9) return;
  boilSeed('dust' + Math.round(x));
  const k = age / .9;
  for (let i = 0; i < 6; i++) {
    const a = -Math.PI * (i + .5) / 6, d = s * (.3 + easeOut(k) * (.9 + .4 * hash(i))), r = s * (.22 + .2 * hash(i * 3)) * (1 - k * .3);
    paint(ellPts(x + Math.cos(a) * d * 1.3, y + Math.sin(a) * d * .55, r, r * .8, 10, 2), { wash: mixCol(col, SP.snowDk, .3), washOp: 235 * (1 - k * k), ink: null });
  }
}
// Snow flying off a big shake: chunks on arcs out of (x, y), falling and fading.
function snowBurst(x, y, s, age) {
  if (age < 0 || age > 1.1) return;
  boilSeed('snowburst');
  for (let i = 0; i < 16; i++) {
    const a = -Math.PI * (.05 + .9 * (i + hash(i) * .6) / 16), k = clamp(age / (.7 + .4 * hash(i * 2))), d = s * (1.6 + 1.6 * hash(i * 4.1));
    const p = arcPt([x + Math.cos(a) * s * .5, y + Math.sin(a) * s * .3], [x + Math.cos(a) * d, y + s * .9], s * (.9 + hash(i * 6)), k), r = s * (.1 + .1 * hash(i * 8)) * (1 - k * .4);
    paint(ellPts(p[0], p[1], r, r * .85, 8, 1.5), { wash: SP.snow, washOp: 255 * (1 - k * k * k), ink: null });
  }
}
// A round little finch: (x, y) = its feet. o: flap (wing angle), rot, sleep, flip, chirp.
function bird(x, y, s, o = {}) {
  boilSeed('bird');
  push(); translate(x, y); rotate(o.rot || 0); scale(o.flip ? -1 : 1, 1);
  paint([[-s * .5, -s * .5], [-s * 1.15, -s * .75], [-s * 1.1, -s * .4]], { wash: SP.birdBack, ink: SP.ink, sw: .7 });   // tail
  paint(ellPts(0, -s * .55, s * .62, s * .55, 14), { wash: SP.birdBreast, ink: SP.ink, sw: .9 });
  paint([[-s * .6, -s * .6], [-s * .3, -s * 1.08], [s * .3, -s * 1.05], [s * .45, -s * .7], [0, -s * .5]], { wash: SP.birdBack, ink: null, curv: .5 });
  push(); translate(-s * .05, -s * .62); rotate(o.flap || 0);
  paint([[s * .1, 0], [-s * .25, -s * .22], [-s * .75, s * .05], [-s * .3, s * .28]], { wash: SP.birdBack, ink: SP.ink, sw: .7, curv: .4 });
  pop();
  paint([[s * .55, -s * .78], [s * .92, -s * .68 - (o.chirp || 0) * s * .12], [s * .55, -s * .6]], { wash: SP.marigold, ink: SP.ink, sw: .6 });
  if (o.chirp) paint([[s * .55, -s * .62], [s * .9, -s * .56 + o.chirp * s * .14], [s * .52, -s * .5]], { wash: SP.marigold, ink: SP.ink, sw: .6 });
  if (o.sleep) inkLine([[s * .18, -s * .82], [s * .3, -s * .76], [s * .42, -s * .82]], .9, SP.ink, 'inkfine', .5);
  else paint(ellPts(s * .3, -s * .82, s * .09, s * .1, 6), { wash: SP.ink, ink: null });
  pop();
}
// A flower in the snow: (x, y) = where its stem leaves the ground; k = its pop; kind 0 white, 1 orange.
function flower(x, y, s, k, kind = 0, key = '') {
  if (k <= .02) return;
  boilSeed('flower' + key);
  const q = backOut(clamp(k)), h = s * 1.2 * q;
  inkLine([[x, y], [x + s * .08, y - h * .5], [x, y - h]], 1.4, SP.leaf, 'ink', .5);
  for (const d of [-1, 1]) paint([[x, y - h * .25], [x + d * s * .55 * q, y - h * .55], [x + d * s * .2 * q, y - h * .2]], { wash: SP.leaf, ink: null, curv: .5 });
  paint(starPts(x, y - h, s * .62 * q, .6, 6, hash(x) * 3), { wash: kind ? SP.flowerO : SP.flowerW, ink: SP.ink, sw: .7, curv: .6 });
  paint(ellPts(x, y - h, s * .17 * q, s * .17 * q, 8), { wash: kind ? SP.goldLt : SP.marigold, ink: null });
}
// A swirl of petals round (cx, cy): they spiral out from k 0, are thickest at .5, and clear by 1. Pair it with flash().
function petalSwirl(cx, cy, k) {
  if (k <= 0 || k >= 1) return;
  boilSeed('petals');
  const dens = Math.sin(k * Math.PI);
  for (let i = 0; i < 46; i++) {
    if (hash(i * 1.7) > dens * 1.25) continue;
    const a = i * 2.4 + k * (5 + 3 * hash(i)), r = (90 + 520 * hash(i * 3.1)) * (.35 + k * 1.1), x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r * 1.15 - k * 120;
    const rot = a * 1.7 + k * 9, s = 26 + 22 * hash(i * 5.9);
    paint([[x + Math.cos(rot) * s, y + Math.sin(rot) * s], [x + Math.cos(rot + 1.6) * s * .45, y + Math.sin(rot + 1.6) * s * .45], [x - Math.cos(rot) * s, y - Math.sin(rot) * s], [x + Math.cos(rot - 1.6) * s * .45, y + Math.sin(rot - 1.6) * s * .45]],
      { wash: [SP.petal, SP.goldLt, SP.flowerW, SP.marigold][i % 4], ink: SP.ink, sw: .6, curv: .5 });
  }
}

// ---------- the wall of nine niches ----------
// An arch: a rectangle w × h from (x, y) (its top-left) with a round top.
function archPts(x, y, w, h, n = 12) {
  const r = w / 2, p = [[x, y + h]];
  for (let i = 0; i <= n; i++) { const a = Math.PI + i / n * Math.PI; p.push([x + r + Math.cos(a) * r, y + r + Math.sin(a) * r]); }
  p.push([x + w, y + h]);
  return p;
}
function diya(x, y, s, t, lit = 1, key = '') {
  const f = .85 + .15 * wob(t, 3.1, hash(x)) * wob(t, 1.7, .3);
  if (lit > .02) { glow(x, y - s * .6, s * 5 * f * lit, SP.warm, .6 * lit); glow(x, y - s * .6, s * 1.8 * f, '#FFD27A', .8 * lit); }
  boilSeed('diya' + key);
  paint([[x - s * .6, y - s * .3], [x + s * .7, y - s * .35], [x + s * .4, y], [x - s * .4, y]], { wash: SP.clay, ink: SP.ink, sw: .6, curv: .4 });
  if (lit > .02) { const fl = Math.sin(t * 7 + x) * .06; paint([[x + s * .42, y - s * .35], [x + s * (.52 + fl), y - s * (.35 + .85 * lit)], [x + s * .68, y - s * .4]], { wash: SP.flame, ink: null, curv: .6 }); }
}
// One lamp niche, centred on (cx, cy), w × h: lit 0..1 warms it and lights the diya on its sill.
function niche(i, cx, cy, w, h, lit, t) {
  boilSeed('niche' + i);
  const a = archPts(cx - w / 2, cy - h / 2, w, h);
  paint(a, { wash: mixCol(SP.tealDk, '#7A5A2E', lit * .4), ink: null });
  inkLine(a, 1.6, mixCol(SP.tealLt, SP.gold, .25 + .75 * lit), 'ink', 0);
  paint(rectPts(cx - w / 2 - 8, cy + h / 2 - 4, w + 16, 12), { wash: mixCol(SP.tealLt, SP.gold, lit * .6), ink: SP.ink, sw: .6 });
}
// The eight other forms as silhouettes with gold marks. k = pop. Units: s ≈ the niche's height.
const DEVI = {
  2: { arms: 2, mount: null, stand: true, mark: 'mala' }, 3: { arms: 10, mount: 'tiger', mark: 'crescent' }, 4: { arms: 8, mount: 'lion', mark: 'rays' },
  5: { arms: 4, mount: 'lion', mark: 'child' }, 6: { arms: 4, mount: 'lion', mark: 'sword' }, 7: { arms: 4, mount: 'donkey', mark: 'wild' },
  8: { arms: 4, mount: 'bull', mark: 'trishul' }, 9: { arms: 4, mount: 'lotus', mark: 'chakra' },
};
function deviSil(i, cx, cy, s, k = 1) {
  const D = DEVI[i]; if (!D || k <= .02) return;
  boilSeed('devi' + i);
  push(); translate(cx, cy); scale(backOut(clamp(k)));
  const C = SP.sil, G = SP.gold, Q = pts => pts.map(([a, b]) => [a * s, b * s]), gl = (pts, w = .9, cv = .4) => inkLine(Q(pts), w, G, 'inkfine', cv);
  const up = D.stand ? .05 : 0, hy = -.3 + up;   // head height
  // the mount, in side view, under her
  if (D.mount === 'lotus') {
    for (const a of [-1.1, -.55, 0, .55, 1.1]) { push(); translate(0, .25 * s); rotate(a); paint(Q([[0, 0], [.05, -.08], [0, -.17], [-.05, -.08]]), { wash: C, ink: G, sw: .5, curv: .5 }); pop(); }
  } else if (D.mount) {
    for (const lx of [-.13, -.07, .08, .14]) paint(Q([[lx - .02, .16], [lx + .02, .16], [lx + .02, .3], [lx - .02, .3]]), { wash: C, ink: null });
    paint(ellPts(0, .15 * s, .19 * s, .075 * s, 16), { wash: C, ink: G, sw: .5 });
    if (D.mount === 'lion') paint(starPts(.2 * s, .08 * s, .1 * s, .78, 9), { wash: C, ink: G, sw: .5 });
    paint(ellPts(.21 * s, .09 * s, .06 * s, .055 * s, 12), { wash: C, ink: G, sw: .5 });
    inkLine(Q([[-.18, .13], [-.25, .1], [-.27, .18]]), 1.6, C, 'ink', .6);   // tail
    if (D.mount === 'tiger') { for (const tx of [-.1, -.03, .04]) gl([[tx, .09], [tx + .02, .15], [tx, .2]], .8); for (const e of [.18, .25]) paint(Q([[e - .02, .05], [e, .01], [e + .02, .05]]), { wash: C, ink: G, sw: .4 }); }
    if (D.mount === 'donkey') for (const e of [.19, .24]) paint(Q([[e - .015, .05], [e + .01, -.06], [e + .03, .05]]), { wash: C, ink: G, sw: .4 });
    if (D.mount === 'bull') { paint(ellPts(.06 * s, .085 * s, .06 * s, .035 * s, 10), { wash: C, ink: null }); for (const e of [.19, .25]) gl([[e, .05], [e + .005, 0], [e - .015, -.03]], 1.1); }
    if (D.mount === 'lion') for (const e of [.17, .25]) paint(ellPts(e * s, .03 * s, .02 * s, .02 * s, 6), { wash: C, ink: G, sw: .4 });
  }
  // wild hair or a halo behind the head
  if (D.mark === 'wild') paint(starPts(0, hy * s, .15 * s, .55, 11, .2), { wash: C, ink: G, sw: .5 });
  else { inkLine(ellPts(0, hy * s, .125 * s, .125 * s, 20).concat([[.125 * s, hy * s]]), .8, G, 'inkfine', .5); }
  if (D.mark === 'rays') for (let j = 0; j < 12; j++) { const a = j / 12 * TAU; gl([[Math.cos(a) * .14, hy + Math.sin(a) * .14], [Math.cos(a) * .18, hy + Math.sin(a) * .18]], .9, 0); }
  // arms, fanned
  const n = D.arms / 2, tips = [];
  for (const sd of [-1, 1]) for (let j = 0; j < n; j++) {
    const a = n === 1 ? .9 : lerp(-1.15, .75, j / (n - 1)), len = .17 - .012 * Math.abs(j - (n - 1) / 2);
    const tip = [sd * (.07 + Math.cos(a) * len), -.17 + up + Math.sin(a) * len];
    paint(ribbon(Q([[sd * .06, -.17 + up], [sd * (.07 + Math.cos(a) * len * .55), -.17 + up + Math.sin(a) * len * .55 + .015], tip]), .03 * s, .02 * s), { wash: C, ink: G, sw: .4 });
    tips.push(tip);
  }
  // body
  if (D.stand) paint(Q([[-.07, -.2 + up], [.07, -.2 + up], [.09, -.02], [.13, .3], [-.13, .3], [-.09, -.02]]), { wash: C, ink: G, sw: .5, curv: .2 });
  else { paint(Q([[-.07, -.2], [.07, -.2], [.09, -.03], [-.09, -.03]]), { wash: C, ink: G, sw: .5, curv: .2 }); paint(ellPts(0, .02 * s, .17 * s, .07 * s, 16), { wash: C, ink: G, sw: .5 }); }
  paint(ellPts(0, hy * s, .075 * s, .075 * s, 14), { wash: C, ink: G, sw: .5 });
  if (D.mark !== 'wild') paint(Q([[-.06, hy - .06], [-.035, hy - .1], [0, hy - .15], [.035, hy - .1], [.06, hy - .06]]), { wash: G, ink: null });
  // the mark that tells her apart
  const L = tips[0], R = tips[n];   // her top hands, screen-left and screen-right
  if (D.mark === 'crescent') paint(crescentPts(0, (hy - .2) * s, .05 * s, 0, 8), { wash: G, ink: null });
  if (D.mark === 'child') { paint(ellPts(-.03 * s, -.07 * s, .035 * s, .035 * s, 10), { wash: SP.silLt, ink: G, sw: .5 }); paint(ellPts(-.03 * s, -.015 * s, .04 * s, .035 * s, 10), { wash: SP.silLt, ink: G, sw: .5 }); }
  if (D.mark === 'sword') gl([[R[0], R[1]], [R[0] + .03, R[1] - .16]], 2.2, 0);
  if (D.mark === 'trishul') { gl([[L[0], L[1] + .1], [L[0], L[1] - .15]], 1.4, 0); gl([[L[0] - .035, L[1] - .17], [L[0] - .03, L[1] - .12], [L[0] + .03, L[1] - .12], [L[0] + .035, L[1] - .17]], 1.2, .2); }
  if (D.mark === 'chakra') inkLine(ellPts(R[0] * s, (R[1] - .05) * s, .04 * s, .04 * s, 12).concat([[(R[0] + .04) * s, (R[1] - .05) * s]]), 1.4, G, 'inkfine', .5);
  if (D.mark === 'mala') {
    const r = tips[1], l = tips[0];
    for (let j = 0; j < 8; j++) { const a = j / 8 * TAU; paint(ellPts((r[0] + Math.cos(a) * .035) * s, (r[1] + .04 + Math.sin(a) * .045) * s, .009 * s, .009 * s, 5), { wash: G, ink: null }); }
    paint(Q([[l[0] - .035, l[1] + .02], [l[0] + .035, l[1] + .02], [l[0] + .045, l[1] + .08], [l[0], l[1] + .1], [l[0] - .045, l[1] + .08]]), { wash: G, ink: null, curv: .4 });
  }
  pop();
}

// ---------- the end card ----------
// The Navadurga Series: three real covers fanned, the logo, the price line, the site. C = the times each part pops.
// Laid out inside Instagram's safe band, centred on x = 508 (see assets/last_slide_sample.png for the look).
function endCard(t, C) {
  boilSeed('cardbg');
  paint(rectPts(-60, -60, W + 120, H + 120), { wash: SP.peach, ink: null });
  // a few marigold petals drifting down
  boilSeed('cardpetals');
  for (let i = 0; i < 9; i++) {
    const x = 60 + hash(i * 3.3) * 960 + 30 * Math.sin(t * .9 + i), y = frac(hash(i * 7.1) + t * (.035 + .02 * hash(i))) * (H + 80) - 40, r = t * .8 + i;
    paint([[x + Math.cos(r) * 15, y + Math.sin(r) * 15], [x + Math.cos(r + 1.6) * 7, y + Math.sin(r + 1.6) * 7], [x - Math.cos(r) * 15, y - Math.sin(r) * 15], [x + Math.cos(r - 1.6) * 7, y + Math.sin(r - 1.6) * 7]], { wash: i % 2 ? SP.marigold : SP.petal, washOp: 200, ink: null, curv: .5 });
  }
  const X = 508, BY = 872, fan = backOut(seg(t, C.fan, C.fan + .45)) , br = Math.sin(t * 1.3) * .008;
  const pk = t0 => Math.max(0, t - t0) * 5;
  if (t > C.fan - .02) {
    picture(PICS.book2, lerp(X, 300, fan), BY + 6, 400, 400, { rot: -.12 * fan + br, r: 10, shadow: 22 });
    picture(PICS.book3, lerp(X, 716, fan), BY + 6, 400, 400, { rot: .12 * fan - br, r: 10, shadow: 22 });
  }
  if (t > C.book) picture(PICS.book1, X, BY, 470, 470, { rot: -br * .5, pop: pk(C.book), r: 10, shadow: 28 });
  if (t > C.logo) picture(PICS.logo, X, 512, 170, 170, { pop: pk(C.logo) });
  if (t > C.series) letter('The Navadurga Series', X, 1180, 78, SP.teal, { screen: true, font: '78px Marcellus', ink: false, pop: pk(C.series) });
  if (t > C.sub) letter('Picture books · Ages 4–8 · Set of 3 for ₹600', X, 1252, 38, SP.brown, { screen: true, font: '500 38px Poppins', ink: false, maxW: 820, pop: pk(C.sub) });
  if (t > C.pill) {
    const k = backOut(clamp(pk(C.pill))) * (1 + .03 * pulse(t, 4));
    boilSeed('pill');
    push(); translate(X, 1352); scale(k); paint(rrPts(-220, -46, 440, 92, 45), { wash: SP.rkOrange, ink: null }); pop();
    letter('rishikatha.com', X, 1354, 52, SP.cream, { screen: true, font: '700 52px Poppins', ink: false, pop: pk(C.pill) });
  }
  if (t > C.follow) letter('Follow @therishikatha for more stories', X, 1444, 38, SP.grey, { screen: true, font: '500 38px Poppins', ink: false, maxW: 800, pop: pk(C.follow) });
}
