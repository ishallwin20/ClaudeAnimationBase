// snake_props.js: the sets and props for "Why would a god wear a deadly snake around his neck?" (src/scenes/snake.js).
// Loaded before it; everything here is a pure function of its arguments (and T for boil).
//
//   Copied from ad 3 (third_eye_kama_props.js): TK, tkTone, GROUND, tkSky, kailash, tkGround, stars, snowfall, cuBackdrop,
//     sparkStar, smoke, endCard
//   SN                                         the palette: poison, the milk sea, storm, Neelkanth blue, devas, asuras, rock
//   vasukiCU(x, y, s, o)                       a cobra face close-up (hood, eyes, tongue, open mouth with fangs)
//   milkOcean(t, S), mandara(x, y, t, turn), churnRope(ph, part, ends), tugger(...), tuggerHand(...)   the churning
//   poisonCloud(x, y, s, t, k, key), poisonFunnel(p0, p1, w, t, k)                                      Halahala
//   kaalRing(cx, cy, r, t, k, g), crescentBell(x, y, s, k, t, swing)                                    the ring of time, the bell
//   dustPuff, whipStreaks, sweatFly, ringIris                                                           small effects, the seams
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


// A four-point spark (a snap, a glint).
function sparkStar(x, y, r, key = 'spark', col = TK.goldLt) {
  if (r < 1) return;
  boilSeed(key);
  glow(x, y, r * 2.4, col, .8);
  paint(starPts(x, y, r, .22, 4), { wash: TK.cream, ink: null });
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

// ================= new for the snake reel =================
const SN = {
  pois: '#3E2650', poisG: '#6E8F3A', poisLt: '#A6C25A', poisDk: '#2A1838', venom: '#F5CE4A',
  milk: '#DCE9EC', milkDk: '#A9C6CF', foam: '#F4FAF8', storm: '#2E5866', stormLt: '#4E7F86',
  neel: '#3A5BD0', neelLt: '#9DB8FF', deva: '#E9B949', devaDk: '#B8862B', devaSkin: '#F0C9A0', asura: '#8E2D3A', asuraDk: '#5C1A26', asuraSkin: '#B24A52',
  rock: '#7A6A5A', rockDk: '#5A4C40', rockLt: '#9A8A76', gullet: '#2A0D1C', gulletLt: '#6E2438', fang: '#FFF8EC', red: '#E2453A', hook: '#1B1F4C',
};

// ---------- Vasuki, the cobra face (close-up) ----------
// (x, y) = the centre of the head, s = the unit (the hood is about 2s wide, 2.05s tall). Everything is in s.
//   hood 0..1 (flare), eyes 'open' | 'angry' | 'happy' | 'wink' | 'squeeze' | 'sleepy', look -1..1, tongue 0..1 (flicks),
//   mouth 0..1 (open: gullet and two fangs), tilt (radians about the neck), sq (squash), body (false: no neck below),
//   bsway (the neck's sway, in s), key (boil key), sweat (a drop on the brow, 0..1)
function vasukiCU(x, y, s, o = {}) {
  const rs = p => boilSeed(`vcu ${o.key ?? 'v'} ${p}`);
  const sw = clamp(s / 110, .4, 3), hood = clamp(o.hood || 0), mo = clamp(o.mouth || 0), tg = clamp(o.tongue || 0), ek = o.eyes || 'open', look = o.look || 0;
  const hw = 1 + .22 * hood, P = pts => pts.map(([a, b]) => [a * s, b * s]), INK = SHV.ink, DK2 = '#2C4E3F';
  push(); translate(x, y); scale(1 + (o.sq || 0) * .6, 1 - (o.sq || 0));
  translate(0, 1.5 * s); rotate(o.tilt || 0); translate(0, -1.5 * s);
  const bs = (o.bsway || 0);
  if (o.body !== false) {
    rs('body');
    const path = P([[0, .9], [bs * .4, 1.9], [bs, 2.9], [bs * .5, 4.2]]);
    paint(ribbon(path, 1.0 * s, 1.25 * s), { wash: SHV.snake, ink: INK, sw });
    const C = through(path), n = C.length;
    for (let i = 3; i < n - 1; i += 3) { const [ax, ay] = C[i], [bx, by] = C[i + 1], d = Math.hypot(bx - ax, by - ay) || 1, w = lerp(.5, .62, i / n) * s * .9; inkLine([[ax - (by - ay) / d * w, ay + (bx - ax) / d * w], [ax + (by - ay) / d * w, ay - (bx - ax) / d * w]], sw * .9, SHV.snakeDk, 'inkfine', 0); }
  }
  rs('hood');
  paint(P([[0, -.6], [.5 * hw, -.55], [.95 * hw, -.2], [1.02 * hw, .35], [.85 * hw, .9], [.5 * hw, 1.3], [0, 1.45], [-.5 * hw, 1.3], [-.85 * hw, .9], [-1.02 * hw, .35], [-.95 * hw, -.2], [-.5 * hw, -.55]]),
    { wash: SHV.snake, ink: INK, sw, curv: .5 });
  rs('hoodshade');   // flat shading, a spectacle mark on each wing and scale hatches
  for (const sd of [-1, 1]) {
    paint(ellPts(sd * .68 * hw * s, .5 * s, .2 * s, .6 * s, 14, s * .01, sd * .12), { wash: mixCol(SHV.snake, SHV.snakeDk, .4), ink: null });
    paint(ellPts(sd * .72 * hw * s, .5 * s, .12 * s, .17 * s, 14), { wash: DK2, washOp: 200, ink: null });
    for (let i = 0; i < 7; i++) { const hx = sd * (.5 + .32 * hash(i * 3.1 + 1)) * hw * s, hy = (.65 + .5 * hash(i * 5.7 + 2)) * s; inkLine([[hx - .05 * s, hy - .035 * s], [hx, hy + .035 * s], [hx + .05 * s, hy - .035 * s]], sw * .7, SHV.snakeDk, 'inkfine', .3); }
  }
  rs('belly');
  paint(ribbon(P([[0, .5], [0, .95], [0, 1.4]]), .6 * s, .4 * s), { wash: SHV.snakeLt, ink: null });
  for (const yy of [.62, .8, .98, 1.16]) inkLine(P([[-.26 + (yy - .6) * .15, yy - .02], [0, yy + .06], [.26 - (yy - .6) * .15, yy - .02]]), sw * .8, SHV.snakeDk, 'inkfine', .5);
  // head: a broad rounded arrowhead, with the jaw dropping when the mouth opens
  const upper = [[0, -.62], [.3, -.6], [.55, -.5], [.67, -.22], [.58, .05], [.5, .2], [.25, .24], [0, .25], [-.25, .24], [-.5, .2], [-.58, .05], [-.67, -.22], [-.55, -.5], [-.3, -.6]];
  if (mo < .05) {
    rs('head');
    paint(P([[0, -.62], [.3, -.6], [.55, -.5], [.67, -.22], [.58, .05], [.42, .3], [.24, .52], [0, .62], [-.24, .52], [-.42, .3], [-.58, .05], [-.67, -.22], [-.55, -.5], [-.3, -.6]]), { wash: SHV.snake, ink: INK, sw, curv: .5 });
    paint(ellPts(-.22 * s, -.45 * s, .26 * s, .09 * s, 10, 0, -.3), { wash: SHV.snakeLt, washOp: 100, ink: null });
    rs('mouthline');
    const sm = ek === 'happy' || ek === 'wink' ? .08 : ek === 'angry' ? -.09 : -.06;
    inkLine(P([[-.4, .3 - sm], [-.2, .3 + sm * .5], [.2, .3 + sm * .5], [.4, .3 - sm]]), sw * 1.3, INK, 'ink', .5);
  } else {
    const dm = .5 * mo;
    rs('jaw');
    paint(P([[-.5, .2 + dm], [-.42, .38 + dm], [-.22, .55 + dm], [0, .63 + dm], [.22, .55 + dm], [.42, .38 + dm], [.5, .2 + dm]]), { wash: SHV.snakeLt, ink: INK, sw, curv: .5 });
    rs('gullet');
    paint(ellPts(0, (.2 + dm / 2) * s, .52 * s, (dm / 2 + .05) * s, 18), { wash: SN.gullet, ink: INK, sw: sw * .7 });
    paint(ellPts(0, (.3 + dm * .72) * s, .3 * s, dm * .26 * s + 2, 12), { wash: SN.gulletLt, ink: null });
    rs('upper');
    paint(P(upper), { wash: SHV.snake, ink: INK, sw, curv: .5 });
    rs('fangs');
    for (const sd of [-1, 1]) paint(P([[sd * .27, .2], [sd * .15, .2], [sd * .21, .2 + .22 + .12 * mo]]), { wash: SN.fang, ink: INK, sw: sw * .7 });
  }
  rs('nose');
  for (const sd of [-1, 1]) paint(ellPts(sd * .1 * s, .02 * s, .035 * s, .025 * s, 6), { wash: SHV.snakeDk, ink: null });
  rs('eyes');
  for (const sd of [-1, 1]) {
    const ex = sd * .32 * s, ey = -.28 * s, rx = .15 * s, ry = ek === 'angry' ? .08 * s : .105 * s;
    const kind = ek === 'wink' ? (sd > 0 ? 'happy' : 'open') : ek;
    if (kind === 'open' || kind === 'angry' || kind === 'sleepy') {
      paint(ellPts(ex, ey, rx, ry, 14), { wash: kind === 'angry' ? '#F2A93B' : SN.venom, ink: INK, sw: sw * .7 });
      paint(ellPts(ex + look * .05 * s, ey, .035 * s, ry * .85, 8), { wash: INK, ink: null });
      if (kind === 'open') inkLine([[ex + sd * .2 * s, ey - .17 * s], [ex - sd * .17 * s, ey - .12 * s]], sw * 1.8, INK, 'ink', 0);
      if (kind === 'angry') inkLine([[ex + sd * .26 * s, ey - .2 * s], [ex - sd * .2 * s, ey - .01 * s]], sw * 2.4, INK, 'ink', 0);
      if (kind === 'sleepy') { paint(ellPts(ex, ey - ry * .5, rx * 1.1, ry * .62, 12), { wash: SHV.snake, ink: null }); inkLine([[ex - rx, ey], [ex, ey + .03 * s], [ex + rx, ey]], sw * 1.2, INK, 'ink', .5); }
    } else if (kind === 'happy') inkLine([[ex - .15 * s, ey + .05 * s], [ex, ey - .1 * s], [ex + .15 * s, ey + .05 * s]], sw * 1.8, INK, 'ink', .5);
    else if (kind === 'squeeze') inkLine([[ex - sd * .14 * s, ey - .1 * s], [ex + sd * .1 * s, ey], [ex - sd * .14 * s, ey + .1 * s]], sw * 1.8, INK, 'ink', 0);
  }
  if (tg > .05) {
    rs('tongue');
    const bx = 0, by = mo > .05 ? (.3 + .5 * mo * .72) * s : .3 * s, L = (.25 + .6 * tg) * s, wv = Math.sin(T * 38) * .1 * s * tg;
    paint(ribbon([[bx, by], [bx + wv * .5, by + L * .5], [bx + wv, by + L]], .11 * s, .07 * s), { wash: SHV.tongue, ink: null });
    for (const sd of [-1, 1]) paint(ribbon([[bx + wv, by + L * .92], [bx + wv + sd * .08 * s, by + L + .06 * s], [bx + wv + sd * .17 * s * tg, by + L + .14 * s * tg]], .07 * s, .02 * s), { wash: SHV.tongue, ink: null });
  }
  if (o.sweat) {
    rs('sweat');
    const k = clamp(o.sweat), dx = .62 * s, dy = (-.5 + .5 * k) * s;
    paint([[dx, dy - .16 * s], [dx + .09 * s, dy], [dx, dy + .08 * s], [dx - .09 * s, dy]], { wash: '#BFE3F5', ink: INK, sw: sw * .6, curv: .6 });
  }
  pop();
}

// ---------- the sea of milk, Mandara, the rope ----------
// The storm sky and the milk sea (horizon y 1180). S.poison 0..1 turns them sick violet and green.
const SEA_Y = 1180;
function milkOcean(t, S = {}) {
  const P = S.poison || 0, top = mixCol(SN.storm, '#34223F', P * .9), low = mixCol(SN.stormLt, '#5E6C38', P * .85);
  boilSeed('mo sky');
  paint(rectPts(-200, -3000, W + 400, 4300), { wash: top, ink: null });
  paint(ellPts(540, SEA_Y - 120, 1000, 380, 24), { wash: mixCol(top, low, .6), ink: null });
  paint(ellPts(540, SEA_Y - 20, 900, 160, 22), { wash: low, ink: null });
  boilSeed('mo clouds');
  for (let i = 0; i < 7; i++) {
    const x = ((hash(i * 3.1) * 1500 + t * (6 + 8 * hash(i))) % 1500) - 210, y = 100 + 760 * hash(i * 7.3), r = 150 + 130 * hash(i * 1.7);
    paint(ellPts(x, y, r * 1.6, r * .42, 16, 5), { wash: mixCol(top, '#14232B', .45), washOp: 120, ink: null });
  }
  // the sea: wavy bands, darker toward the viewer, each with its own swell
  const tint = c => mixCol(c, '#8FA05A', P * .5);
  const bands = [[SEA_Y, SN.milk], [SEA_Y + 110, '#CFE0E6'], [SEA_Y + 260, '#BDD3DB'], [SEA_Y + 450, '#A9C6CF'], [SEA_Y + 680, '#98B8C4']];
  bands.forEach(([y0, c], i) => {
    boilSeed('mo band' + i);
    const edge = []; for (let x = -200; x <= W + 200; x += 70) edge.push([x, y0 + (5 + 4 * i) * Math.sin(x * .016 + t * (1.1 + .2 * i) + i * 2)]);
    paint([...edge, [W + 200, H + 300], [-200, H + 300]], { wash: tint(c), ink: null });
    inkLine(edge.filter(p => p[0] > -60 && p[0] < W + 60), 1.1 + i * .25, mixCol(SN.storm, SN.rockDk, .3), 'ink', .4);
  });
  // wave crests: ink strokes with a foam cap, bigger toward the viewer
  boilSeed('mo crests');
  for (let i = 0; i < 26; i++) {
    const q = hash(i * 2.9), y = SEA_Y + 40 + 760 * q * q, sc = .5 + 1.5 * (y - SEA_Y) / 760, x = 40 + 1000 * hash(i * 5.1) + 22 * Math.sin(t * .8 + i), l = 55 * sc;
    const bob = 5 * sc * Math.sin(t * 1.3 + i * 1.7);
    inkLine([[x - l, y + bob + 6 * sc], [x - l * .4, y + bob - 7 * sc], [x + l * .2, y + bob - 9 * sc], [x + l, y + bob + 4 * sc]], 1.3 + sc * .4, mixCol(SN.milkDk, SN.storm, .35), 'ink', .6);
    paint(ellPts(x - l * .1, y + bob - 7 * sc, l * .42, 4.5 * sc, 8), { wash: SN.foam, ink: null });
  }
}
// The churning vortex: concentric foam arcs around the mountain's foot that turn with the churn (ph) and with time.
function seaVortex(cx, cy, t, ph) {
  for (let i = 0; i < 4; i++) {
    const rx = 180 + i * 85, ry = 30 + i * 17, a0 = t * (1.0 - .14 * i) + ph * 1.6 + i * 1.3;
    boilSeed('vortex' + i);
    for (let j = 0; j < 3; j++) {
      const A = a0 + j * TAU / 3, P = []; for (let k = 0; k <= 8; k++) { const a = A + k / 8 * 1.25; P.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); }
      paint(ribbon(P, 4 + i, 13 - i * 2), { wash: SN.foam, washOp: 240, ink: null });
      inkLine(P.map(([x, y]) => [x, y + 6 + i]), 1, SN.milkDk, 'inkfine', .4);
    }
  }
}
// Mandara, the churning mountain: (x, y) = its foot on the sea, h tall (700 at the model size). turn = how far its strata have scrolled (px).
function mandara(x, y, t, turn = 0, h = 700) {
  const ky = h / 700, kx = 1 + (ky - 1) * .7, X = a => x + a * kx, Y = b => y + b * ky;
  boilSeed('mandara');
  const sil = [[-125, 0], [-108, -150], [-112, -290], [-88, -420], [-96, -540], [-62, -640], [-30, -690], [10, -704], [34, -676], [62, -640], [84, -520], [100, -420], [96, -300], [116, -170], [130, 0]];
  paint(sil.map(([a, b]) => [X(a), Y(b)]), { wash: SN.rock, ink: null, curv: .12 });
  paint([[10, -704], [34, -676], [62, -640], [84, -520], [100, -420], [96, -300], [116, -170], [130, 0], [20, 0], [34, -300], [14, -500]].map(([a, b]) => [X(a), Y(b)]), { wash: SN.rockDk, washOp: 200, ink: null, curv: .12 });
  boilSeed('mandara strata');
  for (let i = 0; i < 9; i++) {
    const off = (i * 78 + turn) % 702, yy = -20 - (off < 0 ? off + 702 : off), w = lerp(122, 62, clamp(-yy / 700)) * kx;
    inkLine([[x - w, Y(yy) - 6], [x - w * .3, Y(yy) + 12], [x + w * .4, Y(yy) + 14], [x + w, Y(yy) - 4]], 1.4, SN.rockLt, 'dry', .5);
  }
  boilSeed('mandara outline');
  inkLine(sil.map(([a, b]) => [X(a), Y(b)]).slice(0, 8), 1.4, SHV.ink, 'ink', .2);
  inkLine(sil.map(([a, b]) => [X(a), Y(b)]).slice(7), 1.4, SHV.ink, 'ink', .2);
  boilSeed('mandara trees');
  for (const [a, b, r] of [[-70, -600, 26], [-40, -655, 22], [40, -660, 24], [60, -620, 20], [-96, -480, 24]]) paint(ellPts(X(a), Y(b), r, r * .7, 10, 2), { wash: '#5E9A6A', ink: SHV.ink, sw: .6 });
}
// The rope: Vasuki coiled 2.5 turns round Mandara (three passes in front). ph = how far the coils have slid round (radians,
// small), part 'back' (the passes behind the mountain: draw it before mandara()) or 'front' (the passes in front, the tail and
// the head's end). ends = { L: [hand points, nearest the mountain first], tip: [x, y], R: [hand points..., the neck of his head] }.
function churnRope(ph, part, ends) {
  const MX = 540, N = 40, pts = [];
  for (let i = 0; i <= 5 * N; i++) {
    const th = i / N * Math.PI, a = th + ph, hw = 112, y0 = 1150 + 80 * th / (5 * Math.PI);
    pts.push({ x: MX - (hw + 16) * Math.cos(a), y: y0 + 24 * Math.sin(a), front: Math.sin(a) > 0, th });
  }
  const runs = []; let cur = null;
  for (const p of pts) { if (!cur || cur.front !== p.front) { cur = { front: p.front, P: [] }; runs.push(cur); } cur.P.push([p.x, p.y]); }
  const ropeW = 32, drawRun = (P, w0, w1, key) => {
    if (P.length < 3) return;
    boilSeed('rope ' + key);
    const rb = ribbon(P, w0, w1);
    paint(rb, { wash: SHV.snake, fill: SHV.snakeDk, fillOp: 60, tex: .5, ink: SHV.ink, sw: .8 });
    const C = through(P), n = C.length;
    for (let i = 4; i < n - 2; i += 6) { const [ax, ay] = C[i], [bx, by] = C[i + 1], d = Math.hypot(bx - ax, by - ay) || 1, w = lerp(w0, w1, i / n) * .3; inkLine([[ax - (by - ay) / d * w, ay + (bx - ax) / d * w], [ax + (by - ay) / d * w, ay - (bx - ax) / d * w]], .8, SHV.snakeDk, 'inkfine', 0); }
  };
  runs.forEach((r, i) => { if ((part === 'front') === r.front) drawRun(r.P, ropeW, ropeW, 'r' + i); });
  if (part === 'front') {
    const p0 = pts[0], p1 = pts[pts.length - 1];
    drawRun([[p0.x, p0.y], ...ends.L, ends.tip], ropeW, 12, 'tail');
    drawRun([[p1.x, p1.y], ...ends.R], ropeW, ropeW * .9, 'head');
  }
}
// A churner up to his knees in the sea: (x, y) = his feet, s ≈ 1/8 of his height. kind 'deva' (faces right, toward the
// mountain) or 'asura' (faces left). pull 0..1 leans back on the rope; flee 0..1: panic, arms up, a running bob.
const tuggerRot = (kind, pull) => (kind === 'deva' ? -1 : 1) * .36 * pull;
const tuggerShift = (kind, pull) => (kind === 'deva' ? -1 : 1) * 14 * pull;
function tuggerHand(x, y, s, kind, pull = 0, flee = 0) {
  const dir = kind === 'deva' ? 1 : -1, r = tuggerRot(kind, pull), a = dir * 2.7 * s, b = -4.6 * s;
  return [x + tuggerShift(kind, pull) + a * Math.cos(r) - b * Math.sin(r), y + a * Math.sin(r) + b * Math.cos(r)];
}
function tugger(x, y, s, t, kind, pull = 0, flee = 0, key = '') {
  const rs = p => boilSeed(`tug ${key} ${p}`), dev = kind === 'deva', dir = dev ? 1 : -1, sw = clamp(s / 14, .5, 1.5), INK = SHV.ink;
  const col = dev ? SN.deva : SN.asuraDk, dk = dev ? SN.devaDk : '#3E1018', skin = dev ? SN.devaSkin : SN.asuraSkin, bob = flee > 0 ? -Math.abs(Math.sin(t * 17 + hash(key.length + 3) * 6)) * s * .9 : 0;
  push(); translate(x + tuggerShift(kind, pull), y + bob); rotate(tuggerRot(kind, pull) + (flee > 0 ? dir * .12 * flee : 0)); scale(dir, 1);
  const P = pts => pts.map(([a, b]) => [a * s, b * s]);
  rs('legs');
  const run = flee > 0 ? Math.sin(t * 17 + 1) : 0;
  for (const [fx, c] of [[-1.5 - 1.1 * pull + run, dk], [.9 + .5 * pull - run, col]]) {   // the back foot digs in and slides, the front foot braces
    paint(ribbon(P([[0, -2.8], [fx * .5, -1.4], [fx, 0]]), 1.1 * s, .9 * s), { wash: c, ink: INK, sw: sw * .8 });
    paint(ellPts((fx + .25) * s, -.1 * s, .75 * s, .35 * s, 8), { wash: c, ink: INK, sw: sw * .6 });
  }
  rs('body');
  paint(ellPts(0, -4.3 * s, 1.5 * s, 2.1 * s, 14), { wash: col, fill: dk, fillOp: 50, tex: .5, ink: INK, sw: sw * .9 });
  inkLine(P([[-1.4, -3.3], [0, -3.1], [1.4, -3.3]]), sw * 1.3, dev ? '#FFE08A' : '#C25A3A', 'ink', .4);
  rs('head');
  paint(ellPts(.3 * s, -7.8 * s, 1.95 * s, 1.85 * s, 18), { wash: skin, ink: INK, sw });
  if (dev) { paint(P([[-.9, -9.3], [-.9, -10.6], [-.3, -10], [.3, -11.1], [.9, -10], [1.5, -10.6], [1.5, -9.3]]), { wash: '#FFD65A', fill: SN.devaDk, fillOp: 60, ink: INK, sw: sw * .7, curv: .15 }); }
  else for (const [hx, tx] of [[-.5, -.9], [1.3, 1.9]]) paint(P([[hx - .5, -9.4], [tx, -11.6], [hx + .5, -9.4]]), { wash: '#E8D2B0', ink: INK, sw: sw * .7 });
  paint(P([[-1.5, -8.6], [-1.4, -9.7], [.3, -10], [1.8, -9.6], [1.9, -8.7], [.6, -9.2]]), { wash: dev ? '#4A3426' : '#241218', ink: null, curv: .4 });
  rs('face');
  const fx = flee > 0, ey = -7.9 * s;
  for (const ex of [.5, 1.55]) {
    if (fx) { paint(ellPts(ex * s, ey, .5 * s, .55 * s, 10), { wash: '#FFF8EC', ink: INK, sw: sw * .5 }); paint(ellPts((ex + .12) * s, ey, .2 * s, .22 * s, 8), { wash: INK, ink: null }); }
    else paint(ellPts((ex + .1) * s, ey, .22 * s, .3 * s, 8), { wash: INK, ink: null });
  }
  inkLine(P([[.1, -8.9 + (fx ? -.3 : .1)], [.9, -8.8 + (fx ? -.4 : -.2)]]), sw * .9, INK, 'ink', 0); inkLine(P([[1.2, -8.8 + (fx ? -.4 : -.2)], [2, -8.9 + (fx ? -.3 : .1)]]), sw * .9, INK, 'ink', 0);
  if (fx) paint(ellPts(1.1 * s, -6.6 * s, .38 * s, .5 * s, 8), { wash: SN.gullet, ink: INK, sw: sw * .5 });
  else inkLine(P([[.6, -6.6], [1.1, -6.4], [1.6, -6.7]]), sw * .9, INK, 'ink', .5);
  rs('arms');
  const tgt = fx ? [[1.2, -11.2], [-.2, -11.4]] : [[2.7, -4.6], [2.5, -4.9]];
  tgt.forEach(([hx, hy], i) => { paint(ribbon(P([[.6 - i * .3, -5.6], [(.6 + hx) / 2, (-5.6 + hy) / 2 + .5], [hx, hy]]), .95 * s, .8 * s), { wash: skin, ink: INK, sw: sw * .8 }); paint(ellPts(hx * s, hy * s, .55 * s, .5 * s, 8), { wash: skin, ink: INK, sw: sw * .6 }); });
  pop();
  rs('foam');
  paint(ellPts(x, y + s * .3, s * 3, s * .7, 14), { wash: SN.foam, washOp: 215, ink: null });
}
// Dust kicked up at (x, y): age in seconds (0..~.9), s = size.
function dustPuff(x, y, s, age) {
  if (age < 0 || age > .9) return;
  boilSeed('dust' + Math.round(x));
  const k = age / .9;
  for (let i = 0; i < 6; i++) {
    const d = s * (.25 + .9 * easeOut(k)) * (.6 + .5 * hash(i * 3)), a = (i / 6) * Math.PI - Math.PI, px = x + Math.cos(a) * d * 1.3, py = y + Math.sin(a) * d * .6 - k * s * .4, r = s * (.22 + .2 * hash(i)) * (1 + k * .6);
    paint(ellPts(px, py, r, r * .85, 10, 1), { wash: i % 2 ? '#EDE3D0' : '#CFC4B2', washOp: 235 * (1 - k * k), ink: null });
  }
}
// A few drops of sweat flung from (x, y): age in seconds.
function sweatFly(x, y, s, age, dir = 1) {
  if (age < 0 || age > .8) return;
  boilSeed('sweatfly' + Math.round(x));
  for (let i = 0; i < 3; i++) {
    const a = age - i * .05; if (a < 0) continue;
    const p = arcPt([x, y], [x + dir * s * (1.4 + i * .6), y + s * .5], s * (1 + i * .3), clamp(a / .7));
    paint([[p[0], p[1] - s * .22], [p[0] + s * .11, p[1]], [p[0], p[1] + s * .1], [p[0] - s * .11, p[1]]], { wash: '#BFE3F5', ink: SHV.ink, sw: .6, curv: .6 });
  }
}

// ---------- Halahala ----------
// A mass of poison cloud standing on (x, y), s tall at k = 1, wide widens it, a = opacity. Every puff is dark violet, overlapping into
// one continuous mass; green shows only as a thin rim light on each puff's upper-left edge and as a soft glow in the core.
function poisonCloud(x, y, s, t, k, key = 'pc', a = 1, wide = 1) {
  if (k <= .02 || a <= .02) return;
  const kk = Math.min(1, k * 2.2), op = 250 * a, n = 18, pf = [], kh = key.length * 3.3, V = ['#4A2A5E', '#44275A', '#3E2650', '#472B5C'];
  for (let i = 0; i < n; i++) {
    const q = Math.pow((i + .5) / n, .85), hgt = easeOut(clamp(k * 1.25 - q * .25)) * q * s * k, cw = s * wide * (.1 + .2 * Math.pow(q, .8)) * kk;
    const side = (hash(i * 4.1 + kh) - .5) * 2, rc = s * (.09 + .1 * Math.pow(q, .6)) * kk * (.8 + .45 * hash(i * 2.9 + kh)) * (1 + .08 * Math.sin(t * 2 + i * 1.7));
    pf.push({ px: x + Math.sin(t * 1.4 + i * 1.3) * s * .03 * (.4 + q) + side * cw, py: y - hgt - rc * .3, r: rc, i, outer: Math.abs(side) > .4 || i > n - 4 });
  }
  boilSeed(key + ' mass');
  for (const p of pf) paint(ellPts(p.px, p.py, p.r, p.r * .86, 24, p.r * .03), { wash: V[p.i % 4], washOp: op, ink: null });
  glow(x, y - s * k * .4, s * k * .7 * wide, SN.poisG, .38 * Math.min(1, k * 2) * a);   // the sickly green core, over the dark mass
  boilSeed(key + ' rim');
  for (const p of pf) if (p.outer || p.i % 3 === 0) {
    const P = []; for (let j = 0; j <= 8; j++) { const an = Math.PI * (1.05 + .6 * j / 8); P.push([p.px + Math.cos(an) * p.r * .97, p.py + Math.sin(an) * p.r * .84]); }
    inkLine(P, 1.7, SN.poisG, 'ink', .5);
    if (p.i % 2 === 0) inkLine(P.slice(2, 7), 1, SN.poisLt, 'inkfine', .5);
  }
  if (k > .5) {
    boilSeed(key + ' drips');
    for (const p of pf.slice(0, 5)) if (p.i % 2 === 0) { const L = s * (.05 + .03 * hash(p.i * 3)) * (1 + .15 * Math.sin(t * 3 + p.i)), x0 = p.px + p.r * .3, y0 = p.py + p.r * .7; paint(ribbon([[x0, y0], [x0 + 2, y0 + L * .5], [x0, y0 + L]], p.r * .12, p.r * .03), { wash: '#3E2650', washOp: op, ink: null }); paint(ellPts(x0, y0 + L + p.r * .05, p.r * .06, p.r * .08, 6), { wash: SN.poisG, washOp: op, ink: null }); }
  }
}
// The poison pouring from the sky: a thick corkscrew stream from p0 to p1, w wide at the top (about 1.1 w), with a green glow core;
// k = how much has arrived.
function poisonFunnel(p0, p1, w, t, k) {
  if (k <= .02) return;
  const dx = p1[0] - p0[0], dy = p1[1] - p0[1], d = Math.hypot(dx, dy) || 1, nx = -dy / d, ny = dx / d, N = 14;
  const path = off => { const P = []; for (let i = 0; i <= N * clamp(k); i++) { const q = i / N, bend = -Math.sin(q * Math.PI) * d * .1, sp = Math.sin(q * 7 - t * 8 + off) * w * .75 * (1 - q * .45); P.push([p0[0] + dx * q + nx * (bend + sp), p0[1] + dy * q + ny * (bend + sp)]); } return P; };
  const tip = path(0); if (tip.length < 3) return;
  for (let i = 1; i < tip.length; i += 2) glow(tip[i][0], tip[i][1], w * 1.4, SN.poisG, .45);
  boilSeed('funnel');
  paint(ribbon(tip, w * 1.0, w * .6), { wash: SN.pois, ink: null });
  paint(ribbon(path(2), w * .75, w * .45), { wash: SN.poisG, ink: null });
  paint(ribbon(path(4), w * .4, w * .22), { wash: SN.poisLt, washOp: 230, ink: null });
}

// ---------- the ring of time, the bell ----------
// A coiled serpent ring-halo centred on (cx, cy), radius r: it spins in as k goes 0 → 1, then turns slowly. g 0..1 = a gold glow.
function kaalRing(cx, cy, r, t, k, g = 0) {
  if (k <= .02) return;
  const q = backOut(clamp(k)), rr = r * q, a0 = (1 - ease(k)) * TAU * 1.5 + t * .22, w = rr * .17, N = 30, P = [];
  if (g > .02) glow(cx, cy, rr * 1.5, TK.gold, g);
  for (let i = 0; i <= N; i++) { const a = a0 + i / N * TAU * .94; P.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); }
  boilSeed('kaal');
  paint(ribbon(P, w * .35, w), { wash: TK.gold, fill: TK.goldDk, fillOp: 70, tex: .5, ink: SHV.ink, sw: 1.8 });
  const C = through(P), n = C.length;
  for (let i = 6; i < n - 4; i += 7) { const [ax, ay] = C[i], [bx, by] = C[i + 1], d = Math.hypot(bx - ax, by - ay) || 1, ww = lerp(w * .35, w, i / n) * .45; inkLine([[ax - (by - ay) / d * ww, ay + (bx - ax) / d * ww], [ax + (by - ay) / d * ww, ay - (bx - ax) / d * ww]], 1.4, TK.goldDk, 'inkfine', 0); }
  boilSeed('kaalhead');
  const [hx, hy] = P[N], [px, py] = P[N - 1], ang = Math.atan2(hy - py, hx - px);
  push(); translate(hx, hy); rotate(ang);
  paint(ellPts(w * .35, 0, w * .85, w * .62, 14), { wash: TK.gold, fill: TK.goldDk, fillOp: 70, ink: SHV.ink, sw: 1.8 });
  paint(ellPts(w * .55, -w * .18, w * .13, w * .13, 8), { wash: SHV.ink, ink: null });
  pop();
}
// Chandraghanta's bell: a gold half-moon with a clapper, hanging at (x, y); k 0..1 pops it on, s its size, swing in radians.
function crescentBell(x, y, s, k, t, swing = 0) {
  if (k <= .02) return;
  const q = backOut(clamp(k)), ang = swing + .1 * Math.sin(t * 5);
  glow(x, y + s * .3, s * 3.2 * q, TK.goldLt, .8 * clamp(k));
  boilSeed('bell');
  push(); translate(x, y); rotate(ang); scale(q);
  const out = [], inn = [];
  for (let i = 0; i <= 14; i++) { const a = i / 14 * Math.PI; out.push([Math.cos(a) * s, Math.sin(a) * s]); }
  for (let i = 14; i >= 0; i--) { const a = i / 14 * Math.PI; inn.push([Math.cos(a) * s * .74, Math.sin(a) * s * .6 - s * .12]); }
  paint(out.concat(inn), { wash: TK.gold, fill: TK.goldDk, fillOp: 40, tex: .5, ink: SHV.ink, sw: .6, curv: .2 });
  inkLine([[0, s * .3], [0, s * .5]], .8, SHV.ink, 'ink', 0);   // the loop it hangs from
  paint([[-.22 * s, .5 * s], [.22 * s, .5 * s], [.3 * s, .85 * s], [.44 * s, 1.08 * s], [-.44 * s, 1.08 * s], [-.3 * s, .85 * s]], { wash: TK.gold, fill: TK.goldDk, fillOp: 40, ink: SHV.ink, sw: .7, curv: .35 });   // a small bell (ghanta)
  inkLine([[-.3 * s, .78 * s], [.3 * s, .78 * s]], .7, TK.goldDk, 'inkfine', .2);
  paint(ellPts(0, 1.18 * s, s * .1, s * .1, 8), { wash: TK.goldLt, ink: SHV.ink, sw: .5 });   // the clapper
  pop();
}

// ---------- seams ----------
// Vertical speed streaks over the whole frame for a whip pan: k 0..1 how strong.
function whipStreaks(k, t = 0) {
  if (k <= .02) return;
  boilSeed('whip');
  for (let i = 0; i < 22; i++) {
    const x = 20 + hash(i * 2.7) * (W - 40), l = 700 + 1100 * hash(i * 5.3), y = ((hash(i * 9.1) * 2200 - 200 + t * 3400) % (H + l)) - l * .5, w = 5 + 16 * hash(i * 1.3);
    paint(ribbon([[x, y - l / 2], [x + 3, y], [x, y + l / 2]], w * .3, w), { wash: i % 3 ? TK.cream : TK.snowDk, washOp: 190 * clamp(k) * (.5 + .5 * hash(i)), ink: null });
  }
}
// The ring that opens onto the card: a peach disc of radius r with Vasuki's coil round its rim (a head biting his tail).
// ringHead() says where the head is, so the cobra can swim into it.
function ringHead(cx, cy, r, t) { const a = -1.2 + t * .5 + TAU * 1.04; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r, a + Math.PI / 2]; }
function ringIris(cx, cy, r, t) {
  if (r < 8) return;
  boilSeed('ringdisc');
  if (r > 1450) { paint(rectPts(-60, -60, W + 120, H + 120), { wash: TK.peach, ink: null }); return; }
  paint(ellPts(cx, cy, r, r, 44), { wash: TK.peach, ink: null });
  const w = clamp(r * .13, 40, 130), N = 30, P = [], a0 = -1.2 + t * .5;
  for (let i = 0; i <= N; i++) { const a = a0 + i / N * TAU * 1.04; P.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
  boilSeed('ringbody');
  paint(ribbon(P, w * .5, w), { wash: SHV.snake, ink: SHV.ink, sw: 1.6 });
  const C = through(P), n = C.length;
  for (let i = 5; i < n - 3; i += 6) { const [ax, ay] = C[i], [bx, by] = C[i + 1], d = Math.hypot(bx - ax, by - ay) || 1, ww = lerp(w * .5, w, i / n) * .42; inkLine([[ax - (by - ay) / d * ww, ay + (bx - ax) / d * ww], [ax + (by - ay) / d * ww, ay - (bx - ax) / d * ww]], 1.1, SHV.snakeDk, 'inkfine', 0); }
  boilSeed('ringhead');
  const [hx, hy] = P[N], [px, py] = P[N - 2], ang = Math.atan2(hy - py, hx - px);
  push(); translate(hx, hy); rotate(ang);
  paint(ellPts(w * .5, 0, w * .85, w * .66, 14), { wash: SHV.snake, ink: SHV.ink, sw: 1.6 });
  paint(ellPts(w * .7, -w * .2, w * .14, w * .14, 8), { wash: SN.venom, ink: SHV.ink, sw: .7 });
  pop();
}

// ---------- new in round 2 ----------
// A thin tendril of poison smoke curling up (screen space): k 0..1 how much has risen, dark violet and green.
function smokeTendrils(t, k, key = 'tend') {
  if (k <= .02) return;
  boilSeed(key);
  for (let i = 0; i < 9; i++) {
    const x0 = 60 + 120 * i + 30 * hash(i * 2.3), rise = (900 + 500 * hash(i * 4.1)) * easeOut(clamp(k * (.8 + .4 * hash(i)))), P = [];
    for (let j = 0; j <= 6; j++) { const q = j / 6; P.push([x0 + Math.sin(t * .9 + i * 1.7 + q * 5) * 46 * (.3 + q) + 30 * Math.sin(i + q * 2), 1560 - q * rise]); }
    paint(ribbon(P, 26 + 10 * hash(i), 3), { wash: i % 2 ? SN.pois : '#3F5628', washOp: 150 * (1 - .5 * k * 0), ink: null });
  }
}
// A wall of poison cloud filling the screen (screen space): w 1 = full cover, thinning as w falls. Used for the C → D dissolve.
function cloudWall(t, w) {
  if (w <= .01) return;
  boilSeed('cwall base');
  if (w > .8) paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#3E2650', washOp: 255 * clamp((w - .8) / .2), ink: null });
  const V = ['#4A2A5E', '#44275A', '#3E2650', '#523068'], rims = [];
  for (let L = 0; L < 3; L++) {
    boilSeed('cwall ' + L);
    for (let i = 0; i < 8; i++) {
      const id = i + L * 8, a = hash(id * 3.7) * TAU + t * (.5 + .3 * hash(id)) * (L % 2 ? -1 : 1), R = 100 + 520 * hash(id * 1.9), r0 = 300 + 220 * hash(id * 5.3), g = clamp((w - hash(id * 7.1) * .55) / .45);
      if (g <= 0) continue;
      const px = 540 + Math.cos(a) * R, py = 960 + Math.sin(a) * R * 1.5, r = r0 * (.35 + .65 * easeOut(g));
      paint(ellPts(px, py, r, r * .85, 26, r * .03), { wash: V[id % 4], washOp: 255 * clamp(g * 2), ink: null });
      rims.push([px, py, r, g, id]);
    }
  }
  boilSeed('cwall rim');
  for (const [px, py, r, g, id] of rims) { const P = []; for (let j = 0; j <= 8; j++) { const an = Math.PI * (1.05 + .6 * j / 8); P.push([px + Math.cos(an) * r * .97, py + Math.sin(an) * r * .82]); } inkLine(P, 2, SN.poisG, 'ink', .5); }
}
// Three sound-ring arcs spreading from (x, y): age in seconds.
function soundRings(x, y, age) {
  if (age < 0 || age > 1) return;
  boilSeed('rings');
  for (let j = 0; j < 3; j++) {
    const a = age - j * .13; if (a < 0 || a > .7) continue;
    const k = a / .7, r = 60 + 250 * easeOut(k);
    for (const [from, to] of [[-2.5, -.65], [-1.9, -1.25]].slice(0, 1)) {
      const P = []; for (let i = 0; i <= 10; i++) { const an = lerp(from, to, i / 10); P.push([x + Math.cos(an) * r, y + Math.sin(an) * r * .9]); }
      paint(ribbon(P, 5, 5), { wash: TK.core, washOp: 230 * (1 - k), ink: null });
    }
  }
}
// A splash of foam droplets thrown from (x, y): age in seconds, dir ±1 (which way it is kicked).
function splash(x, y, s, age, dir = 1, key = 0) {
  if (age < 0 || age > .55) return;
  boilSeed('splash' + key);
  const k = age / .55;
  for (let i = 0; i < 6; i++) {
    const p = arcPt([x, y], [x + dir * s * (.6 + .9 * hash(i * 3 + key)), y + s * .15], s * (.9 + .8 * hash(i * 7 + key)), k), r = s * (.1 + .08 * hash(i)) * (1 - k * .5);
    paint(ellPts(p[0], p[1], r, r * 1.2, 7), { wash: SN.foam, washOp: 255 * (1 - k * k), ink: SN.milkDk, sw: .4 });
  }
}
// Dawn Kailash for Chandraghanta (G): a peach-gold sky, a rising sun, a gold-lit mountain and warm snow.
function dawnSet(t) {
  boilSeed('dawn sky');
  paint(rectPts(-200, -200, W + 400, H + 400), { wash: '#F4B386', ink: null });
  paint(ellPts(560, 930, 1150, 560, 24), { wash: '#F9CE9A', ink: null });
  paint(ellPts(560, 1180, 980, 330, 22), { wash: '#FFE6B4', ink: null });
  glow(560, 1060, 1000, '#FFD27A', .75);
  boilSeed('dawn clouds');
  for (let i = 0; i < 6; i++) paint(ellPts(((hash(i * 3.3) * 1400 + t * (5 + 4 * hash(i))) % 1400) - 160, 220 + 560 * hash(i * 7.7), 190 + 120 * hash(i), 24 + 14 * hash(i * 2), 14, 4), { wash: i % 2 ? '#FBD6BC' : '#F2A58C', washOp: 150, ink: null });
  push(); translate(0, 115);
  boilSeed('dawn ridges');
  paint([[-200, 1340], [-120, 980], [60, 860], [200, 930], [330, 840], [420, 1000], [460, 1340]], { wash: '#D49C80', ink: null, curv: .1 });
  paint([[640, 1340], [700, 980], [820, 870], [940, 940], [1080, 820], [1260, 1000], [1300, 1340]], { wash: '#D49C80', ink: null, curv: .1 });
  boilSeed('dawn kailash');
  paint([[60, 1340], [260, 900], [430, 520], [560, 300], [700, 520], [870, 900], [1040, 1340]], { wash: '#C98B78', ink: null, curv: .05 });
  paint([[560, 300], [700, 520], [870, 900], [1040, 1340], [620, 1340], [600, 820]], { wash: '#A56C70', ink: null, curv: .05 });
  paint([[430, 520], [560, 300], [600, 380], [540, 560], [470, 880], [260, 900]], { wash: '#F0B890', washOp: 150, ink: null, curv: .05 });
  boilSeed('dawn snow');
  paint([[560, 300], [640, 420], [700, 520], [660, 560], [620, 520], [590, 600], [545, 540], [500, 610], [470, 540], [430, 520]], { wash: '#FFF0D4', ink: null, curv: .15 });
  inkLine([[430, 520], [500, 400], [560, 300], [630, 400], [700, 520]], 1.3, '#7A4A55', 'ink', .1);
  pop();
  boilSeed('dawn ground');
  const top = []; for (let x = -200; x <= W + 200; x += 70) top.push([x, GROUND + 8 * Math.sin(x * .009) + 6 * Math.sin(x * .023)]);
  paint([...top, [W + 200, H + 200], [-200, H + 200]], { wash: '#FBE3C8', ink: null });
  inkLine(top.filter(p => p[0] > -80 && p[0] < W + 80), 1.2, '#B9826A', 'ink', .3);
  for (let i = 0; i < 9; i++) { boilSeed('dawn dab' + i); paint(ellPts(60 + hash(i * 3.3) * 960, GROUND + 70 + 380 * hash(i * 7.1), 70 + 60 * hash(i), 9 + 6 * hash(i * 2), 12), { wash: '#EFC9A6', washOp: 170, ink: null }); }
}
