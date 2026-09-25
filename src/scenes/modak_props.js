// modak_props.js: sets and props for "2 AM Modak Run" (src/scenes/modak_2am.js). Loaded before it; everything here is
// a pure function of its arguments (and T for boil), shared by the shots.
//
//   roomBack(t, o) / roomFront(t, o)  Bappa's room on Kailash: wall, arched window (moon, peak), curtains, shelf + lota,
//                                     rug and Mooshak's cushion; then the low desk and the diya in front of him
//   corridor(t, o) / kitchenDoor(...)  the night corridor to the kitchen, and its door with warm light leaking out
//   padlock(x, y, s, o)               Parvati's padlock, with a vertical third eye
//   phone(x, y, w, screen, o)         the celestial phone: 'splash', 'order', 'stars'
//   paperBag(x, y, s, o)              the Swarga-Mart bag
//   cosmos(t, o), meteor(...), kailash(...)
//   palmLeaf(...), balHand(...)       the manuscript leaf, and where Bal Bappa's hand is (for props he holds)
//   whipSmear(k, dir, cols), windSwirl(p), eyeIris(cx, cy, h, k)   transitions
const MK = {
  wall: '#353B74', wallDk: '#262B5A', wallLt: '#4B5293', floor: '#4B3960', floorDk: '#35284A',
  wood: '#8A5A3C', woodDk: '#5E3B27', woodLt: '#B37D52',
  sky: '#1E2452', skyLt: '#35417F', moon: '#FFF1CF', snow: '#E6EEF8', snowDk: '#A9BCD8', rock: '#6C7AA6',
  curtain: '#B2507A', curtainDk: '#83335A',
  leaf: '#EBCD8E', leafDk: '#C39B56', script: '#7A4E2A',
  clay: '#C8703E', clayDk: '#8E4424', flame: '#FFE9A8', flameDk: '#FFAA45', warm: '#FFB45A',
  brass: '#DDA83C', brassDk: '#9C6E1F', rug: '#A8455E', rugDk: '#7C2E46', rugLt: '#E3A24A',
  gold: '#E9B640', goldDk: '#A67820', goldLt: '#FFE39A', violet: '#8B5CC8', violetLt: '#D3B8F5', violetDk: '#553388',
  space: '#1F173D', space2: '#35285F', nebula: '#5C3F90', nebula2: '#8C4F8E', meteor: '#6E5A7E', meteorDk: '#463A57', fire: '#FF9A4A',
  phone: '#2E2658', phoneLt: '#4A3F86', screen: '#FFF4E0', bag: '#C99A62', bagDk: '#9C7040', bagLt: '#E2BD86', steam: '#FFF6E6',
  cream: '#FCEBD2', ink: '#2B2233',
};
const ROOM = { winX: 90, winY: 330, winW: 440, winH: 560, floorY: 1262, bapX: 660, bapY: 1300, bapU: 34, mooX: 300, mooY: 1470, mooU: 16, shelfX: 780, shelfY: 690, diyaX: 452, diyaY: 1206 };

// Where Bal Bappa's hand is, in the coordinates he was drawn in (mirrors bal_bappa.js's arm math; ignores rot).
function balHand(x, y, u, o, s) {
  const st = (o.stand || 0) > .5, a0 = s < 0 ? o.aL : o.aR, rest = st ? -1.3 : s < 0 ? -1.75 : -1.4;
  const a = a0 == null ? rest : lerp(rest, a0, clamp((a0 - .2) / .4)), L = st ? 3.3 : 3, sq = (o.sq || 0) + (o.take || 0);
  const hx = s * ((st ? 3.1 : 2.85) + Math.cos(a) * L), hy = -(st ? 2.6 : 0) - 5.9 + -Math.sin(a) * L;
  return [x + ((o.dx || 0) + hx * (o.flip ? -1 : 1)) * u * (1 + sq * .6), y + (o.dy || 0) * u + hy * u * (1 - sq)];
}

// ---------- the room ----------
function archPts(x, y, w, h, n = 10) {   // a rectangle with a round arch on top; (x, y) = top-left of the bounding box
  const r = w / 2, pts = [[x, y + h], [x, y + r]];
  for (let i = 1; i < n; i++) { const a = Math.PI + i / n * Math.PI; pts.push([x + r + Math.cos(a) * r, y + r + Math.sin(a) * r]); }
  pts.push([x + w, y + r], [x + w, y + h]);
  return pts;
}
function kailash(cx, by, s, o = {}) {   // a snowy peak whose base centre is (cx, by); s = half its width
  boilSeed('kailash ' + (o.key || ''));
  const P = pts => pts.map(([a, b]) => [cx + a * s, by + b * s]);
  paint(P([[-1.2, 0], [-.75, -.55], [-.5, -.6], [-.2, -1.05], [0, -1.15], [.25, -1.02], [.55, -.62], [.8, -.5], [1.2, 0]]), { wash: o.rock || MK.rock, fill: MK.wallDk, fillOp: 60, tex: .5, ink: o.ink === null ? null : MK.ink, sw: o.sw || .8, curv: .15 });
  paint(P([[-.33, -.83], [-.2, -1.05], [0, -1.15], [.25, -1.02], [.4, -.82], [.26, -.74], [.12, -.86], [-.02, -.72], [-.16, -.86]]), { wash: MK.snow, fill: MK.snowDk, fillOp: 50, tex: .4, ink: null, curv: .1 });
  if (o.window) {   // a little palace on the shoulder, with one warm window
    paint(P([[.28, -.66], [.52, -.66], [.52, -.5], [.28, -.5]]), { wash: MK.snow, ink: MK.ink, sw: (o.sw || .8) * .6 });
    paint(P([[.26, -.66], [.4, -.76], [.54, -.66]]), { wash: MK.gold, ink: MK.ink, sw: (o.sw || .8) * .6 });
    glow(cx + .4 * s, by - .58 * s, s * .22 * (1 + .1 * o.window), MK.warm, clamp(o.window));
    paint(P([[.36, -.62], [.44, -.62], [.44, -.53], [.36, -.53]]), { wash: MK.goldLt, ink: null });
  }
}
function curtain(x, y, w, h, side, gust, t, key) {   // hangs from (x, y); side -1 = left of the window, 1 = right; gust blows it right, into the room
  boilSeed('curtain ' + key);
  const g = gust, fl = wob(t, 2.6, side * .3) * g, n = 7, L = [], R = [];
  for (let i = 0; i <= n; i++) {
    const k = i / n, bx = x + (side < 0 ? 0 : w) * 0, sway = Math.sin(t * .9 + k * 2 + side) * 6 * k;
    const push_ = g * (240 * k * k + 60 * k) + fl * 40 * k, lift = g * 330 * k * k;
    const cx = x + sway + push_, cy = y + h * k - lift, ww = w * (.8 + .35 * k) * (1 - g * .25);
    L.push([cx - ww / 2 + w / 2, cy]); R.push([cx + ww / 2 + w / 2, cy + g * 30 * k]);
  }
  paint([...L, ...R.reverse()], { wash: MK.curtain, fill: MK.curtainDk, fillOp: 80, bleed: .06, tex: .6, border: .5, ink: MK.ink, sw: .9, curv: .5 });
  for (const f of [.3, .62]) inkLine(L.map((p, i) => [lerp(p[0], R[n - i][0], f), lerp(p[1], R[n - i][1], f)]).slice(1), .6, MK.curtainDk, 'inkfine', .5);
}
function roomBack(t, o = {}) {
  const R = ROOM, g = o.gust || 0;
  boilSeed('room wall');
  paint(rectPts(-300, -300, W + 600, R.floorY + 300), { wash: MK.wall, ink: null });
  paint(rectPts(-300, -300, W + 600, 380, 20), { fill: MK.wallDk, fillOp: 110, bleed: .2, tex: .6, border: .6, ink: null });
  for (let i = 0; i < 9; i++) {   // a stencilled border of little lotus-arches along the wall
    const x = -40 + i * 150, y = 1120;
    inkLine([[x, y], [x + 38, y - 40], [x + 75, y - 55], [x + 112, y - 40], [x + 150, y]], .9, MK.wallLt, 'inkfine', .6);
  }
  inkLine([[-200, 1150], [W + 200, 1150]], 1.2, MK.wallLt, 'inkfine', 0);
  // the window: night sky, stars, moon, the peak, then the arched frame over the edges
  boilSeed('room window');
  const { winX: x, winY: y, winW: w, winH: h } = R;
  paint(archPts(x, y, w, h), { wash: MK.sky, fill: MK.skyLt, fillOp: 90, bleed: .1, tex: .5, ink: null });
  for (let i = 0; i < 14; i++) {
    const sx = x + 40 + hash(i * 3.7) * (w - 80), sy = y + 60 + hash(i * 9.1) * (h * .5), tw = .6 + .4 * wob(t, .5 + hash(i), hash(i * 2));
    paint(starPts(sx, sy, 5 + 7 * hash(i * 5.3) * tw, .35, 4), { wash: MK.moon, ink: null });
  }
  glow(x + w * .7, y + 160, 150, '#BFD3FF', .55);
  paint(ellPts(x + w * .7, y + 160, 58, 58, 24), { wash: MK.moon, ink: null });
  paint(ellPts(x + w * .7 + 26, y + 140, 50, 52, 24), { wash: MK.sky, ink: null });   // bites the moon into a crescent
  kailash(x + w * .45, y + h, w * .55, { key: 'win', sw: .7 });
  paint(ribbon(archPts(x - 6, y - 6, w + 12, h + 6, 12).slice(0, -1).concat([]), 34, 34), { wash: MK.wood, fill: MK.woodDk, fillOp: 70, tex: .6, ink: MK.ink, sw: 1 });
  paint(rectPts(x - 50, y + h - 10, w + 100, 46, 3), { wash: MK.woodLt, fill: MK.wood, fillOp: 80, tex: .5, ink: MK.ink, sw: 1 });   // sill
  // curtains on a rod
  inkLine([[x - 90, y - 40], [x + w + 90, y - 40]], 3, MK.woodDk, 'ink', 0);
  curtain(x - 80, y - 40, 130, h + 40, -1, g, t, 'L');
  curtain(x + w - 40, y - 40, 130, h + 40, 1, g * .8, t + .4, 'R');
  // shelf with the lota (it can fall: o.lotaT = when it tips)
  boilSeed('room shelf');
  paint(rectPts(R.shelfX, R.shelfY, 250, 26, 2), { wash: MK.woodLt, fill: MK.wood, fillOp: 70, tex: .5, ink: MK.ink, sw: 1 });
  for (const bx of [R.shelfX + 30, R.shelfX + 210]) inkLine([[bx, R.shelfY + 26], [bx + 8, R.shelfY + 70], [bx + 30, R.shelfY + 26]], 1, MK.woodDk, 'ink', .4);
  paint(rrPts(R.shelfX + 30, R.shelfY - 120, 60, 120, 14, 2), { wash: MK.clay, fill: MK.clayDk, fillOp: 60, tex: .5, ink: MK.ink, sw: .9 });   // a clay jar
  paint(ellPts(R.shelfX + 60, R.shelfY - 122, 34, 10, 14), { wash: MK.clayDk, ink: MK.ink, sw: .7 });
  lota(t, o.lotaT, o.shake);
  // floor, rug, Mooshak's cushion
  boilSeed('room floor');
  paint(rectPts(-300, R.floorY, W + 600, H - R.floorY + 300), { wash: MK.floor, fill: MK.floorDk, fillOp: 90, bleed: .1, tex: .6, border: .5, ink: null });
  inkLine([[-200, R.floorY], [W + 200, R.floorY]], 1.4, MK.ink, 'ink', 0);
  paint(rrPts(290, 1290, 780, 150, 30, 4), { wash: MK.rug, fill: MK.rugDk, fillOp: 70, tex: .6, border: .5, ink: MK.ink, sw: 1 });
  inkLine([[320, 1315], [1040, 1315]], .9, MK.rugLt, 'inkfine', 0); inkLine([[320, 1415], [1040, 1415]], .9, MK.rugLt, 'inkfine', 0);
  for (let i = 0; i < 12; i++) paint(starPts(345 + i * 62, 1365, 11, .45, 4, 0), { wash: MK.rugLt, ink: null });
  paint(ellPts(R.mooX, R.mooY - 10, 120, 40, 20, 3), { wash: '#C9577A', fill: '#94385A', fillOp: 80, tex: .6, ink: MK.ink, sw: 1 });
  for (const s of [-1, 1]) paint(ellPts(R.mooX + s * 118, R.mooY - 12, 14, 12, 8), { wash: MK.gold, ink: MK.ink, sw: .6 });
  // the diya's warm light, on the wall behind Bappa
  diyaLight(t, o.flame ?? 1);
}
function diyaLight(t, k) {
  const R = ROOM, f = .85 + .15 * wob(t, 3.1) * wob(t, 1.7, .3);
  glow(R.diyaX, R.diyaY - 50, 560 * f * (.4 + .6 * k), MK.warm, .75 * k);
  glow(R.diyaX, R.diyaY - 50, 180 * f, '#FFD27A', .8 * k);
}
function lota(t, t0, shake) {   // the brass pot on the shelf; from t0 it tips, falls and bounces on the floor
  const R = ROOM, x0 = R.shelfX + 170, y0 = R.shelfY;
  let x = x0, y = y0, r = 0;
  if (t0 != null && t > t0) {
    const a = t - t0, land = .42;
    if (a < .1) { r = .35 * a / .1; x += 10 * a / .1; }
    else if (a < land) { const k = (a - .1) / (land - .1); x = x0 + 10 + 60 * k; y = y0 + (R.floorY + 90 - y0) * k * k; r = .35 + 2.6 * k; }
    else { const b = a - land; x = x0 + 70 + 40 * (1 - Math.exp(-4 * b)); y = R.floorY + 90 - 40 * Math.abs(Math.sin(b * 9)) * Math.exp(-5 * b); r = 1.57 + .3 * Math.exp(-5 * b) * Math.sin(b * 14); }
  } else if (shake) x += shake * wob(t, 11);
  boilSeed('lota');
  push(); translate(x, y); rotate(r);
  paint([[-30, 0], [-40, -30], [-34, -58], [-16, -70], [-20, -86], [20, -86], [16, -70], [34, -58], [40, -30], [30, 0]], { wash: MK.brass, fill: MK.brassDk, fillOp: 70, tex: .5, ink: MK.ink, sw: .9, curv: .5 });
  paint(ellPts(-12, -44, 8, 16, 10), { wash: MK.goldLt, washOp: 200, ink: null });
  pop();
}
function palmLeaf(x0, y0, x1, y1, th, key) {   // a long palm-leaf page between two points, with squiggle "script" lines (not letters)
  boilSeed('leaf ' + key);
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
  const P = (a, b) => [x0 + dx * a + nx * b * th, y0 + dy * a + ny * b * th];
  paint([P(0, -.5), P(.5, -.55), P(1, -.5), P(1.02, 0), P(1, .5), P(.5, .55), P(0, .5), P(-.02, 0)], { wash: MK.leaf, fill: MK.leafDk, fillOp: 60, tex: .6, ink: MK.ink, sw: .8, curv: .3 });
  for (const b of [-.22, 0, .22]) {
    const pts = []; for (let i = 0; i <= 10; i++) { const a = .1 + i * .08; pts.push(P(a, b + .05 * Math.sin(i * 2.3 + b * 9))); }
    inkLine(pts, .6, MK.script, 'inkfine', .6);
  }
  paint(ellPts(...P(.5, 0), th * .09, th * .09, 8), { wash: MK.ink, ink: null });
}
function roomFront(t, o = {}) {
  const R = ROOM, sh = o.shake || 0;
  // the low desk
  boilSeed('desk');
  const dj = sh ? wob(t, 13) * sh : 0;
  paint(rectPts(360, 1196 + dj, 600, 26, 2), { wash: MK.woodLt, fill: MK.wood, fillOp: 60, tex: .5, ink: MK.ink, sw: 1.1 });
  paint(rectPts(380, 1222 + dj, 560, 78, 2), { wash: MK.wood, fill: MK.woodDk, fillOp: 80, tex: .6, border: .5, ink: MK.ink, sw: 1.1 });
  paint(rectPts(560, 1238 + dj, 200, 46, 2), { wash: MK.woodDk, ink: MK.ink, sw: .7 });   // a carved panel
  inkLine([[600, 1261 + dj], [630, 1248 + dj], [660, 1261 + dj], [690, 1248 + dj], [720, 1261 + dj]], .7, MK.woodLt, 'inkfine', .5);
  for (const lx of [392, 900]) paint(rectPts(lx, 1300 + dj, 28, 24, 1), { wash: MK.woodDk, ink: MK.ink, sw: .9 });
  // the stack of leaves at the right end (o.leafJump makes them hop)
  const lj = o.leafJump || 0;
  for (let i = 0; i < 4; i++) palmLeaf(800 + i * 3, 1188 - i * 12 - lj * (8 + 10 * hash(i + BOILN)), 940 - i * 2, 1190 - i * 12 - lj * (6 + 12 * hash(i * 3 + BOILN)), 16, 'stack' + i);
  // the diya: a clay lamp with a flame that bends with o.gust and gutters with o.gutter
  diya(t, o.flame ?? 1, o.gust || 0, o.gutter || 0);
}
function diya(t, k, gust = 0, gutter = 0) {
  const R = ROOM, x = R.diyaX, y = R.diyaY;
  boilSeed('diya');
  paint([[x - 46, y - 12], [x + 46, y - 12], [x + 60, y - 20], [x + 30, y + 8], [x - 30, y + 8]], { wash: MK.clay, fill: MK.clayDk, fillOp: 70, tex: .5, ink: MK.ink, sw: 1, curv: .4 });
  inkLine([[x - 40, y - 5], [x + 40, y - 5]], .6, MK.clayDk, 'inkfine', .3);
  if (k <= .02) return;
  const fl = .9 + .1 * wob(t, 7.3) + .08 * jit(1), bend = gust * 34 + gutter * 14 * wob(t, 9), hgt = 58 * k * fl * (1 - .45 * gutter);
  const f = [[x + 44, y - 20], [x + 58, y - 22 - hgt * .35], [x + 50 + bend * .6, y - 22 - hgt * .8], [x + 48 + bend, y - 22 - hgt], [x + 40 + bend * .5, y - 22 - hgt * .7], [x + 36, y - 22 - hgt * .3]];
  paint(f, { wash: MK.flameDk, ink: null, curv: .6 });
  paint(f.map(([a, b]) => [lerp(x + 47, a, .55), lerp(y - 28, b, .6)]), { wash: MK.flame, ink: null, curv: .6 });
}
function sleepMooshak(t, x, y, u, o = {}) {   // Mooshak curled up asleep: closed eyes, breathing
  mooshak(x, y, u, { eyes: 'closed', sq: .1 + .04 * Math.sin(t * TAU * .35), emote: 'zzz', emoteK: 1, emoteAge: t, boilKey: 'moo', ...o });
}

// ---------- corridor and kitchen door ----------
const HALL = { floorY: 1450, doorX: 2380, doorW: 560, doorTop: 470, lockY: 960 };
function corridor(t, o = {}) {
  boilSeed('hall wall');
  paint(rectPts(-400, -300, 3600, HALL.floorY + 300), { wash: MK.wall, ink: null });
  paint(rectPts(-400, -300, 3600, 420, 20), { fill: MK.wallDk, fillOp: 110, bleed: .2, tex: .6, border: .6, ink: null });
  for (let i = 0; i < 5; i++) {   // arched niches with little lamps, and pillars between them (the last one is a window)
    const x = -250 + i * 520;
    boilSeed('hall niche ' + i);
    if (i === 4) hallWindow(t, x + 120, 620, 220, 420, o.gust || 0, o.winFlare || 0);
    else paint(archPts(x + 120, 620, 220, 420), { wash: MK.wallDk, fill: MK.sky, fillOp: 60, tex: .5, ink: MK.ink, sw: .9 });
    if (i !== 4) {
      const fl = 1 - .7 * (o.gust || 0) * (.5 + .5 * wob(t, 9, i));
      paint(rectPts(x + 110, 1040, 240, 22, 2), { wash: MK.woodLt, ink: MK.ink, sw: .9 });
      paint([[x + 210, 1034], [x + 250, 1034], [x + 262, 1026], [x + 240, 1042], [x + 220, 1042]], { wash: MK.clay, ink: MK.ink, sw: .7, curv: .3 });
      glow(x + 256, 1000, 190 * fl, MK.warm, .5); glow(x + 256, 1010, 60, '#FFD27A', .7 * fl);
      paint([[x + 250, 1026], [x + 262 + 20 * (o.gust || 0), 1000 - 6 * wob(t, 6, i)], [x + 264, 1026]], { wash: MK.flame, ink: null, curv: .5 });
    }
    paint(rectPts(x + 420, 380, 70, HALL.floorY - 380, 3), { wash: MK.wallLt, fill: MK.wall, fillOp: 70, tex: .5, ink: MK.ink, sw: 1 });
    paint(rectPts(x + 405, 360, 100, 40, 2), { wash: MK.woodLt, ink: MK.ink, sw: .9 });
    paint(rectPts(x + 405, HALL.floorY - 40, 100, 40, 2), { wash: MK.woodLt, ink: MK.ink, sw: .9 });
  }
  boilSeed('hall floor');
  paint(rectPts(-400, HALL.floorY, 3600, 800), { wash: MK.floor, fill: MK.floorDk, fillOp: 90, bleed: .1, tex: .6, border: .5, ink: null });
  inkLine([[-300, HALL.floorY], [1300, HALL.floorY]], 1.4, MK.ink, 'ink', 0); inkLine([[1300, HALL.floorY], [3100, HALL.floorY]], 1.4, MK.ink, 'ink', 0);
  paint(rectPts(-300, HALL.floorY + 60, 3400, 90, 4), { wash: MK.rug, fill: MK.rugDk, fillOp: 60, tex: .5, ink: MK.ink, sw: .9 });   // a runner
  inkLine([[-280, HALL.floorY + 105], [1400, HALL.floorY + 105]], .8, MK.rugLt, 'inkfine', 0); inkLine([[1400, HALL.floorY + 105], [3080, HALL.floorY + 105]], .8, MK.rugLt, 'inkfine', 0);
  kitchenDoor(t, o);
}
function hallWindow(t, x, y, w, h, g, flare) {   // the corridor window Vayu comes in by: sky, moon, stars, curtains
  paint(archPts(x, y, w, h), { wash: MK.sky, fill: MK.skyLt, fillOp: 90, bleed: .1, tex: .5, ink: null });
  for (let i = 0; i < 6; i++) paint(starPts(x + 30 + hash(i * 5.1) * (w - 60), y + 40 + hash(i * 2.9) * h * .6, 5 + 5 * hash(i), .35, 4), { wash: MK.moon, ink: null });
  paint(ellPts(x + w * .66, y + 120, 34, 34, 18), { wash: MK.moon, ink: null });
  paint(ellPts(x + w * .66 + 15, y + 108, 30, 31, 18), { wash: MK.sky, ink: null });
  if (flare > 0) glow(x + w / 2, y + h * .5, 400 * flare, '#CFE6FF', flare);
  paint(ribbon(archPts(x - 6, y - 6, w + 12, h + 6, 12).slice(0, -1), 26, 26), { wash: MK.wood, fill: MK.woodDk, fillOp: 70, tex: .6, ink: MK.ink, sw: 1 });
  paint(rectPts(x - 30, y + h - 8, w + 60, 32, 3), { wash: MK.woodLt, fill: MK.wood, fillOp: 80, tex: .5, ink: MK.ink, sw: 1 });
  inkLine([[x - 60, y - 30], [x + w + 60, y - 30]], 2.5, MK.woodDk, 'ink', 0);
  curtain(x - 55, y - 30, 90, h + 30, -1, g, t, 'hL');
  curtain(x + w - 35, y - 30, 90, h + 30, 1, g * .85, t + .4, 'hR');
}
function kitchenDoor(t, o = {}) {
  const { doorX: x, doorW: w, doorTop: y, floorY: fy } = HALL, h = fy - y, lk = o.leak ?? 1;
  boilSeed('door');
  paint(ribbon(archPts(x - 30, y - 30, w + 60, h + 30, 12).slice(0, -1), 60, 60), { wash: MK.woodDk, fill: MK.ink, fillOp: 40, tex: .6, ink: MK.ink, sw: 1.2 });
  glow(x + w / 2, fy - 10, 420 * lk, MK.warm, .7 * lk);   // warm kitchen light leaking out under the door
  paint(archPts(x, y, w, h - 14), { wash: MK.wood, fill: MK.woodDk, fillOp: 70, bleed: .05, tex: .6, border: .5, ink: MK.ink, sw: 1.1 });
  for (const s of [0, 1]) for (const k of [.36, .66]) paint(rectPts(x + s * w / 2 + 40, y + h * k, w / 2 - 80, 170, 2), { wash: MK.woodLt, fill: MK.wood, fillOp: 60, tex: .5, ink: MK.ink, sw: .9 });   // panels
  for (const s of [0, 1]) inkLine([[x + s * w / 2 + 60, y + h * .12], [x + s * w / 2 + w / 4, y + h * .07], [x + s * w / 2 + w / 2 - 60, y + h * .12]], .8, MK.woodLt, 'inkfine', .5);
  inkLine([[x + w / 2, y + 12], [x + w / 2, fy - 14]], 1.2, MK.ink, 'ink', 0);
  paint(rectPts(x + 10, fy - 16, w - 20, 16, 1), { wash: MK.goldLt, ink: null });   // the glowing gap
  for (const s of [-1, 1]) {   // ring handles, which the padlock's shackle runs through
    paint(ellPts(x + w / 2 + s * 34, HALL.lockY - 170, 16, 16, 12), { wash: MK.brassDk, ink: MK.ink, sw: .8 });
    paint(ribbon(ellPts(x + w / 2 + s * 34, HALL.lockY - 120, 30, 42, 16).concat([]), 10, 10), { wash: MK.brass, ink: MK.ink, sw: .7 });
  }
}
// Smell wisps: cream ribbons that crawl out under the door and curl toward (tx, ty). k 0..1 = how far they've got.
function smellWisps(t, k, tx, ty) {
  const { doorX: x, doorW: w, floorY: fy } = HALL;
  for (let i = 0; i < 3; i++) {
    boilSeed('wisp ' + i);
    const kk = clamp(k * 1.25 - i * .12); if (kk < .03) continue;
    const x0 = x + w * (.3 + .2 * i), y0 = fy - 10, pts = [];
    for (let j = 0; j <= 9; j++) {
      const a = j / 9 * kk, px = lerp(x0, tx, a), py = lerp(y0, ty - 30 * i, easeOut(a)) - 90 * Math.sin(a * Math.PI) + 26 * Math.sin((a * 3 + t * .8 + i) * TAU);
      pts.push([px, py]);
    }
    paint(ribbon(pts, 26, 6), { wash: MK.steam, washOp: 210, ink: null });
    inkLine(pts, .6, '#E8C98E', 'inkfine', .5);
  }
}

// ---------- Parvati's padlock ----------
// (x, y) = the centre of its body; s = body width. o: eye 0..1 (open), lookX -1..1, narrow 0..1, glare 0..1 (violet glow),
// rattle (px of shake), key (boil)
function padlock(x, y, s, o = {}) {
  boilSeed('padlock ' + (o.key || ''));
  x += (o.rattle || 0) * wob(T, 13);
  const P = pts => pts.map(([a, b]) => [x + a * s, y + b * s]), sw = clamp(s / 110, .6, 2.2);
  if (o.glare) glow(x, y - .1 * s, s * 1.5, MK.violet, o.glare);
  paint(ribbon(P([[-.3, -.4], [-.34, -.8], [-.2, -1.05], [0, -1.12], [.2, -1.05], [.34, -.8], [.3, -.4]]), .15 * s, .15 * s), { wash: '#B9B2C9', fill: '#7C7394', fillOp: 70, tex: .5, ink: MK.ink, sw: sw * .9 });
  const body = P([[-.5, -.42], [.5, -.42], [.56, -.1], [.52, .32], [.36, .5], [0, .55], [-.36, .5], [-.52, .32], [-.56, -.1]]);
  paint(body, { wash: MK.gold, fill: MK.goldDk, fillOp: 90, bleed: .05, tex: .7, border: .5, ink: MK.ink, sw, curv: .35 });
  paint(P([[-.4, -.3], [-.1, -.34], [-.3, -.1]]), { fill: MK.goldLt, fillOp: 140, bleed: .15, tex: .6, ink: null });
  inkLine(P([[-.44, -.3], [.44, -.3]]), sw * .5, MK.goldDk, 'inkfine', 0);
  for (const a of [-1, -.5, 0, .5, 1]) inkLine(P([[0, .44], [a * .18, .32], [a * .08, .24]]), sw * .45, MK.goldDk, 'inkfine', .6);   // an engraved lotus
  paint(P([[-.05, .36], [.05, .36], [.04, .46], [-.04, .46]]), { wash: MK.ink, ink: null });   // keyhole
  paint(ellPts(x, y + .33 * s, .05 * s, .05 * s, 10), { wash: MK.ink, ink: null });
  // the third eye: a vertical almond; closed, a seam with lashes
  const e = clamp(o.eye || 0), nar = clamp(o.narrow || 0), op = e * (1 - .6 * nar), eh = .56, ew = .19, ey = -.02;
  if (op < .06) {
    inkLine(P([[0, ey - eh / 2], [.03, ey], [0, ey + eh / 2]]), sw * 1.1, MK.ink, 'ink', .5);
    for (const k of [-.15, 0, .15]) inkLine(P([[.03, ey + k], [.11, ey + k + .03]]), sw * .6, MK.ink, 'inkfine', 0);
  } else {
    const al = []; for (let i = 0; i <= 12; i++) { const k = i / 12; al.push([Math.sin(Math.PI * k) * ew * op, ey - eh / 2 + eh * k]); }
    const pts = al.concat(al.slice(1, -1).reverse().map(([a, b]) => [-a, b]));
    paint(P(pts), { wash: MK.cream, ink: MK.ink, sw: sw * 1.1, curv: .3 });
    const lx = clamp(o.lookX || 0, -1, 1) * ew * op * .45, ir = Math.min(.13, ew * op * .8);
    paint(ellPts(x + lx * s, y + ey * s, ir * s, .13 * s, 16), { wash: MK.violet, fill: MK.violetDk, fillOp: 90, tex: .4, ink: MK.ink, sw: sw * .6 });
    paint(ellPts(x + lx * s, y + ey * s, ir * .45 * s, .07 * s, 12), { wash: MK.ink, ink: null });
    paint(ellPts(x + (lx - ir * .35) * s, y + (ey - .05) * s, .025 * s, .03 * s, 8), { wash: MK.cream, ink: null });
    if (nar > .05) for (const d of [-1, 1]) inkLine(P([[d * .1, ey - eh / 2 - .03 - .06 * nar], [d * .25, ey - eh / 2 + .02 + .05 * nar]]), sw * 1.2 * nar, MK.ink, 'ink', 0);   // the frown
  }
}
function zapBolt(x0, y0, x1, y1, k, key) {   // a jagged violet-white bolt; re-jags on every boil
  boilSeed('zap ' + key);
  const pts = [], n = 8;
  for (let i = 0; i <= n; i++) { const a = i / n, off = i === 0 || i === n ? 0 : jit(40); pts.push([lerp(x0, x1, a) + off, lerp(y0, y1, a) + jit(22)]); }
  glow((x0 + x1) / 2, (y0 + y1) / 2, Math.hypot(x1 - x0, y1 - y0) * .7, MK.violet, k);
  inkLine(pts, 7 * k, MK.violetLt, 'ink', 0); inkLine(pts, 2.5 * k, MK.cream, 'inkfine', 0);
}

// ---------- the phone ----------
// (x, y) = centre; w = width (it's about 2w tall). screen: 'splash' | 'order' | 'stars' | 'dark'. o: pop (splash reveal
// 0..1), count, countPop (age since the count changed), plusK (the + key pressed 0..1), btnK (order key pressed),
// bolt (0..1, the order bolt shooting up the screen), stars (0..5, may be fractional: the next one popping), glowK
function phone(x, y, w, screen, o = {}) {
  boilSeed('phone');
  const h = w * 2.02, sw = clamp(w / 280, .6, 2.2), sx = x - w * .44, sy = y - h * .44, sW = w * .88, sH = h * .88;
  if (o.glowK) glow(x, y, w * 1.2, '#FFE2A8', o.glowK);
  paint(rrPts(x - w / 2, y - h / 2, w, h, w * .14, 1), { wash: MK.phone, fill: MK.phoneLt, fillOp: 70, tex: .5, ink: MK.ink, sw: sw * 1.2 });
  inkLine(rrPts(x - w / 2 + w * .025, y - h / 2 + w * .025, w * .95, h - w * .05, w * .12).concat([[x - w / 2 + w * .025 + w * .12, y - h / 2 + w * .025]]), sw * .8, MK.gold, 'inkfine', 0);
  const bg = screen === 'splash' ? VAY.saff : screen === 'dark' ? '#1C1838' : MK.screen;
  paint(rrPts(sx, sy, sW, sH, w * .08, 0), { wash: bg, ink: MK.ink, sw: sw * .7 });
  paint(rrPts(x - w * .12, sy + w * .03, w * .24, w * .05, w * .025), { wash: MK.phone, ink: null });   // the notch
  const cx = x, L = (txt, yy, size, col, lo = {}) => letter(txt, cx + (lo.dx || 0), yy, size, col, { ink: false, ...lo });
  if (screen === 'splash') {
    const p = clamp(o.pop ?? 1);
    boilSeed('phone splash');
    for (let i = 0; i < 6; i++) { const yy = sy + sH * (.2 + i * .12), ln = sW * (.3 + .4 * hash(i)) * p; inkLine([[sx + sW - 20, yy], [sx + sW - 20 - ln, yy]], sw * .7, VAY.saffLt, 'inkfine', 0); }
    push(); translate(cx, y - h * .06); scale(backOut(p)); swargaMark(0, 0, w * .27, sw * 1.4); pop();
    if (p > .3) L('Swarga-Mart', y + h * .16, w * .15, MK.cream, { pop: (p - .3) * 2.2, stroke: MK.ink, sw: .16, rot: -.04 });
  } else if (screen === 'order') {
    boilSeed('phone order');
    paint(rrPts(sx, sy, sW, sH * .11, w * .08, 0), { wash: VAY.saff, ink: null });
    swargaMark(sx + sW * .13, sy + sH * .062, w * .065, sw);
    L('Swarga-Mart', sy + sH * .066, w * .075, MK.cream, { dx: w * .08, stroke: MK.ink, sw: .14 });
    paint(rrPts(sx + sW * .08, sy + sH * .15, sW * .84, sH * .42, w * .06, 1), { wash: '#FFE7C2', fill: '#F3C98B', fillOp: 60, tex: .5, ink: MK.ink, sw: sw * .7 });
    glow(cx, sy + sH * .4, w * .3, '#FFD48A', .5);
    mkModak(cx, sy + sH * .52, w * .3, 0, 'phone');
    for (const d of [-1, 0, 1]) { const bx = cx + d * w * .12, by0 = sy + sH * .27; inkLine([[bx, by0], [bx + 10 * wob(T, .8, d), by0 - w * .05], [bx - 8, by0 - w * .1]], sw * .8, '#E8B97A', 'inkfine', .6); }
    // the counter: [ - ]  N  [ + ]
    const ry = sy + sH * .66;
    paint(ellPts(cx - w * .27, ry, w * .075, w * .075, 16), { wash: '#EAD9C0', ink: MK.ink, sw: sw * .7 });
    inkLine([[cx - w * .3, ry], [cx - w * .24, ry]], sw * 1.1, MK.ink, 'ink', 0);
    const pk = clamp(o.plusK || 0), pr = w * .075 * (1 - .15 * pk);
    paint(ellPts(cx + w * .27, ry, pr, pr, 16), { wash: mixCol(VAY.saff, VAY.saffDk, pk), ink: MK.ink, sw: sw * .7 });
    inkLine([[cx + w * .24, ry], [cx + w * .3, ry]], sw * 1.1, MK.cream, 'ink', 0); inkLine([[cx + w * .27, ry - w * .03], [cx + w * .27, ry + w * .03]], sw * 1.1, MK.cream, 'ink', 0);
    const cp = o.countPop ?? 9, big = (o.count || 0) >= 21 ? 1 + .35 * Math.exp(-cp * 5) * Math.cos(cp * 18) : 1 + .25 * Math.exp(-cp * 14);
    L(String(o.count ?? 1), ry, w * .15 * big, (o.count || 0) >= 21 ? VAY.saffDk : MK.ink, { rot: (o.count || 0) >= 21 ? -.06 : 0 });
    // the order key: a saffron pill with a lightning bolt
    const bk = clamp(o.btnK || 0), bw = sW * .7 * (1 - .06 * bk), bh = sH * .1 * (1 - .06 * bk), by = sy + sH * .83;
    if (bk > 0) glow(cx, by, w * .5, '#FFE08A', bk);
    paint(rrPts(cx - bw / 2, by - bh / 2, bw, bh, bh / 2, 1), { wash: mixCol(VAY.saff, '#FFD27A', bk), fill: VAY.saffDk, fillOp: 50, tex: .4, ink: MK.ink, sw: sw * .8 });
    const Bs = bh * .36;
    paint([[.12, -.95], [-.38, .1], [-.02, .1], [-.22, .95], [.42, -.2], [.06, -.2], [.28, -.95]].map(([a, b]) => [cx + a * Bs, by + b * Bs]), { wash: MK.cream, ink: MK.ink, sw: sw * .6 });
    if (o.bolt > 0) {   // the order goes out: a bolt shoots up the screen
      const b = clamp(o.bolt), top = lerp(by, sy - h * .3, easeIn(b));
      glow(cx, top, w * .5, '#FFE08A', 1);
      zapBolt(cx, by, cx + 20, top, 1.2, 'order');
    }
  } else if (screen === 'stars') {
    boilSeed('phone stars');
    paint(rrPts(sx, sy, sW, sH * .11, w * .08, 0), { wash: VAY.saff, ink: null });
    swargaMark(sx + sW * .13, sy + sH * .062, w * .065, sw);
    L('Swarga-Mart', sy + sH * .066, w * .075, MK.cream, { dx: w * .08, stroke: MK.ink, sw: .14 });
    paint(ellPts(cx, sy + sH * .3, w * .2, w * .2, 24), { wash: VAY.skinLt, ink: MK.ink, sw: sw * .8 });
    vayuFace(cx, sy + sH * .31, w * .15, sw);
    const n = o.stars || 0;
    for (let i = 0; i < 5; i++) {
      const sx_ = cx + (i - 2) * w * .16, sy_ = sy + sH * .6, age = n - i, k = clamp(age * 3), pop = age > 0 ? 1 + .45 * Math.exp(-age * 5) * Math.cos(age * 16) : 1;
      if (k > 0) glow(sx_, sy_, w * .14 * k, '#FFD86A', .7 * k);
      paint(starPts(sx_, sy_, w * .07 * pop, .45, 5), { wash: k > 0 ? mixCol('#EAD9C0', MK.gold, k) : '#EAD9C0', ink: MK.ink, sw: sw * .7 });
    }
  }
}
// Vayu's face for the courier avatar: (x, y) = centre, r = head radius
function vayuFace(x, y, r, sw) {
  const P = pts => pts.map(([a, b]) => [x + a * r, y + b * r]);
  for (const k of [0, 1]) paint(ribbon(P([[-.8, -.2 - k * .4], [-1.3, -.4 - k * .4], [-1.7, -.1 - k * .5]]), r * .5, r * .08), { wash: VAY.hair, ink: MK.ink, sw: sw * .5 });
  paint(ellPts(x, y, r, r * .92, 22), { wash: VAY.skin, ink: MK.ink, sw: sw * .8 });
  for (const s of [-1, 1]) inkLine(P([[s * .55, -.05], [s * .38, -.22], [s * .2, -.05]]), sw * .9, MK.ink, 'ink', .5);
  for (const s of [-1, 1]) paint(ribbon(P([[s * .02, .3], [s * .3, .26], [s * .52, .36], [s * .6, .22]]), r * .2, r * .05), { wash: VAY.hair, ink: MK.ink, sw: sw * .4 });
  inkLine(P([[-.2, .5], [0, .6], [.2, .5]]), sw * .7, MK.ink, 'ink', .5);
  paint(P([[-1, -.35], [-.9, -.8], [-.4, -1.05], [.2, -1.08], [.75, -.85], [1, -.4]]), { wash: VAY.saff, ink: MK.ink, sw: sw * .7, curv: .4 });
  paint(P([[.5, -.45], [1.4, -.4], [1.35, -.28], [.5, -.3]]), { wash: VAY.saffDk, ink: MK.ink, sw: sw * .6 });
}
// Bappa's trunk tip reaching in from off-frame to tap a point: (x0, y0) = where it enters, (tx, ty) = the tip.
function trunkTip(x0, y0, tx, ty, u, press = 0) {
  boilSeed('trunktip');
  const mx = lerp(x0, tx, .55) - u * 1.2, my = lerp(y0, ty, .5) + u * .8;
  const pts = [[x0, y0], [mx, my], [tx - u * .5, ty + u * .9], [tx, ty + u * .15 * press]];
  paint(ellPts(tx, ty + u * .15 * press, .62 * u, .55 * u * (1 - .2 * press), 14), { wash: BAL.skin, ink: BAL.ink, sw: 1.4 });
  paint(ribbon(pts, 2.6 * u, 1.2 * u), { wash: BAL.skin, fill: BAL.skinDk, fillOp: 45, tex: .5, ink: BAL.ink, sw: 1.4 });
  paint(ellPts(tx, ty + u * .15 * press, .5 * u, .44 * u, 12), { wash: BAL.skin, ink: null });
  const C = through(pts);
  for (const k of [.35, .5, .65, .8]) {
    const i = Math.floor(k * (C.length - 1)), [ax, ay] = C[i], [bx, by] = C[i + 1], d = Math.hypot(bx - ax, by - ay) || 1, nx = -(by - ay) / d, ny = (bx - ax) / d, ww = lerp(2.6, 1.2, k) * u * .3;
    inkLine([[ax - nx * ww, ay - ny * ww], [ax + nx * ww, ay + ny * ww]], .9, BAL.skinDk, 'inkfine', 0);
  }
}

// A plump, pleated modak (rounder than bappa.js's), for close-ups. (x, y) = base centre, s = size (height ~1.35 s).
// bite 0..1 takes a real bite out of its upper right, showing the jaggery-coconut filling.
function mkModak(x, y, s, bite = 0, key = '') {
  boilSeed('modak ' + key);
  const base = [[-.5, .02], [.5, .02], [.7, -.2], [.66, -.5], [.44, -.82], [.2, -1.1], [0, -1.35], [-.2, -1.1], [-.44, -.82], [-.66, -.5], [-.7, -.2]];
  let pts = through(base.concat([base[0]]), 5).map(([a, b]) => [x + a * s, y + b * s]);
  let arc = null;
  if (bite > .02) {
    const c = [x + .52 * s, y - .78 * s], R = s * .42 * Math.sqrt(bite), inside = p => Math.hypot(p[0] - c[0], p[1] - c[1]) < R;
    const i0 = pts.findIndex((p, i) => !inside(p) && inside(pts[(i + 1) % pts.length]));
    if (i0 >= 0) {
      let j = (i0 + 1) % pts.length; while (inside(pts[(j + 1) % pts.length]) && j !== i0) j = (j + 1) % pts.length;
      const a0 = Math.atan2(pts[(i0 + 1) % pts.length][1] - c[1], pts[(i0 + 1) % pts.length][0] - c[0]), a1 = Math.atan2(pts[j][1] - c[1], pts[j][0] - c[0]);
      let da = a1 - a0; const mid = a => [c[0] + Math.cos(a) * R, c[1] + Math.sin(a) * R], cx = x, cy = y - .6 * s;
      if (da > Math.PI) da -= TAU; if (da < -Math.PI) da += TAU;
      const m1 = mid(a0 + da / 2), m2 = mid(a0 + da / 2 + Math.PI);   // go round the side that faces the modak's middle
      if (Math.hypot(m2[0] - cx, m2[1] - cy) < Math.hypot(m1[0] - cx, m1[1] - cy)) da = da > 0 ? da - TAU : da + TAU;
      arc = []; for (let k = 0; k <= 10; k++) { const a = a0 + da * k / 10, sc = 1 + .06 * Math.sin(k * 2.2); arc.push([c[0] + Math.cos(a) * R * sc, c[1] + Math.sin(a) * R * sc]); }
      const out = []; for (let k = 0; k < pts.length; k++) { const idx = (j + 1 + k) % pts.length; out.push(pts[idx]); if (idx === i0) break; }
      pts = out.concat(arc);
    }
  }
  const sw = clamp(s / 45, .5, 1.8);
  paint(pts, { wash: '#FBEFD6', fill: '#E7C893', fillOp: 90, tex: .6, border: .5, ink: PAL.ink, sw });
  paint(ellPts(x - .25 * s, y - .5 * s, .16 * s, .3 * s, 10, 0, .3), { fill: '#FFFFFF', fillOp: 90, bleed: .2, tex: .5, ink: null });
  for (const k of [-.55, -.28, 0, .28, .55]) {   // pleats, from the pinched tip down the sides
    const q = [[x + k * .05 * s, y - 1.25 * s], [x + k * .55 * s, y - .7 * s], [x + k * 1.05 * s, y - .12 * s]];
    if (arc && k > .1) continue;
    inkLine(q, sw * .6, '#C49A5E', 'inkfine', .6);
  }
  if (arc) {   // the filling in the bite
    const cx = x + .2 * s, cy = y - .55 * s, inner = arc.slice(1, -1).map(([a, b]) => [lerp(a, cx, .09), lerp(b, cy, .09)]);
    inkLine(inner, sw * 1.8, '#C98A45', 'ink', .5);
    for (let k = 1; k < inner.length - 1; k += 2) paint(ellPts(inner[k][0], inner[k][1], s * .018, s * .018, 6), { wash: '#FFF3DC', ink: null });
  }
}

// ---------- the bag ----------
// (x, y) = the bottom centre; s = width. o: open 0..1 (the rolled top unrolls, gold light and steam come out), key, rot
function paperBag(x, y, s, o = {}) {
  boilSeed('bag ' + (o.key || ''));
  const op = clamp(o.open || 0), h = s * 1.15, sw = clamp(s / 120, .6, 1.8);
  push(); translate(x, y); if (o.rot) rotate(o.rot);
  if (op > .2) glow(0, -h, s * 1.3 * op, '#FFCF6A', op);
  paint([[-s * .5, 0], [s * .5, 0], [s * .47, -h], [-s * .47, -h]], { wash: MK.bag, fill: MK.bagDk, fillOp: 70, tex: .7, border: .5, ink: MK.ink, sw });
  inkLine([[-s * .22, -h * .05], [-s * .25, -h * .95]], sw * .5, MK.bagDk, 'inkfine', .3);
  if (op < .5) {   // the rolled top
    paint(rrPts(-s * .5, -h - s * .16 * (1 - op), s, s * .2, s * .08), { wash: MK.bagLt, fill: MK.bag, fillOp: 60, tex: .5, ink: MK.ink, sw: sw * .9 });
  } else {   // open: modaks peeking out, steam curling up
    for (const [dx, sz, i] of [[-.22, .28, 0], [.24, .24, 1], [.02, .32, 2]]) mkModak(s * dx, -h + s * .14, s * sz, 0, 'bag' + i);
    for (let i = 0; i < 3; i++) {
      const sx = (i - 1) * s * .22, pts = []; for (let j = 0; j <= 6; j++) { const a = j / 6; pts.push([sx + s * .08 * Math.sin((a * 1.6 + T * .9 + i * .3) * TAU), -h - s * .1 - a * s * .9 * op]); }
      paint(ribbon(pts, s * .1, s * .02), { wash: MK.steam, washOp: 200, ink: null });
    }
  }
  swargaMark(0, -h * .45, s * .22, sw);
  pop();
}

// ---------- cosmos ----------
function cosmos(t, o = {}) {   // screen-space: a violet night full of stars; o.scroll (px) slides it up as the camera dives
  const sc = o.scroll || 0;
  boilSeed('cosmos');
  paint(rectPts(-60, -60, W + 120, H + 120), { wash: MK.space, ink: null });
  for (let i = 0; i < 3; i++) {
    const cy = ((200 + i * 700 - sc * .35) % 2200 + 2200) % 2200 - 150;
    paint(ellPts(200 + i * 330, cy, 520, 260, 20, 30, .4 + i), { fill: i % 2 ? MK.nebula2 : MK.nebula, fillOp: 120, bleed: .3, tex: .7, border: .7, ink: null });
  }
  for (let i = 0; i < 46; i++) {
    const layer = 1 + (i % 3), x = hash(i * 4.1) * W, y = ((hash(i * 7.3) * 2400 - sc * layer * .25) % 2400 + 2400) % 2400 - 240;
    const r = (3 + 5 * hash(i * 2.2)) * layer * .6 * (.7 + .3 * wob(t, .7 + hash(i), hash(i * 3)));
    if (i % 7 === 0) paint(starPts(x, y, r * 2.4, .3, 4), { wash: MK.moon, ink: null });
    else paint(ellPts(x, y, r * .6, r * .6, 6), { wash: MK.moon, washOp: 220, ink: null });
  }
}
// A meteor at (x, y), radius r, flying toward angle ang (radians): a rocky ball with a fiery tail behind it.
function meteor(x, y, r, ang, key, tailK = 1) {
  boilSeed('meteor ' + key);
  const bx = -Math.cos(ang), by = -Math.sin(ang), nx = -by, ny = bx, L = r * 7 * tailK;
  glow(x + bx * r * 1.5, y + by * r * 1.5, r * 3.5, MK.fire, .6);
  const tail = [];
  for (let i = 0; i <= 6; i++) { const a = i / 6; tail.push([x + bx * L * a + nx * r * .25 * Math.sin(a * 5 + T * 14), y + by * L * a + ny * r * .25 * Math.sin(a * 5 + T * 14)]); }
  paint(ribbon(tail, r * 2.1, r * .2), { wash: MK.fire, fill: '#FFD27A', fillOp: 90, bleed: .12, tex: .5, ink: null });
  paint(ribbon(tail.slice(0, 5), r * 1.2, r * .1), { wash: '#FFE9A8', ink: null });
  paint(ellPts(x, y, r, r * .92, 18, r * .05, ang), { wash: MK.meteor, fill: MK.meteorDk, fillOp: 90, tex: .6, ink: MK.ink, sw: clamp(r / 50, .6, 1.6) });
  for (const [dx, dy, rr] of [[-.3, -.2, .22], [.25, .25, .16], [.2, -.35, .12]]) paint(ellPts(x + dx * r, y + dy * r, rr * r, rr * r, 10), { wash: MK.meteorDk, ink: MK.ink, sw: .5 });
}

// ---------- transitions ----------
// Whip-pan smear: long horizontal streaks in the scene's colours, over the frame. k 0..1 (strength), dir ±1.
function whipSmear(k, dir = 1, cols = [MK.wall, MK.wallLt, MK.floor]) {
  if (k <= .01) return;
  boilSeed('smear');
  for (let i = 0; i < 16; i++) {
    const y = -40 + i * (H + 80) / 16, hh = (H + 80) / 16 + 30;
    paint(rectPts(-100, y, W + 200, hh, 10), { wash: cols[i % cols.length], washOp: 255 * clamp(k * 1.6 - hash(i) * .5), ink: null });
    if (k > .4) inkLine([[-50, y + hh * .5], [W + 50, y + hh * .5 + jit(10)]], 1.2, mixCol(cols[(i + 1) % cols.length], PAL.cream, .3), 'dry', 0);
  }
}
// A gust of wind wiping the frame: curly cloud-white strokes sweep in from the left (p 0 → .5) and off to the right (.5 → 1).
function windSwirl(p) {
  if (p <= 0 || p >= 1) return;
  const n = 6, bh = (H + 300) / n + 60;
  for (let i = 0; i < n; i++) {
    boilSeed('swirl ' + i);
    const y0 = -150 + i * (H + 300) / n, d = [0, .12, .05, .16, .08, .14][i];
    const q = p < .5 ? easeOut(clamp((p * 2 - d) / (1 - d))) : ease(clamp(((p - .5) * 2 - d) / (1 - d)));
    const x0 = p < .5 ? -300 : lerp(-300, W + 500, q), x1 = p < .5 ? lerp(-300, W + 500, q) : W + 500;
    if (x1 - x0 < 30) continue;
    const top = [], bot = [];
    for (let k = 0; k <= 10; k++) { const x = lerp(x0, x1, k / 10); top.push([x, y0 + Math.sin(k * .8 + i * 1.7) * 40]); bot.push([x, y0 + bh + Math.sin(k * .8 + i * 1.7 + .6) * 40]); }
    const c1 = i % 2 ? VAY.cloud : VAY.cloudDk, c2 = i % 2 ? VAY.cloudDk : '#8FB8DE', tail = [];
    if (p >= .5) for (let k = 1; k < 6; k++) tail.push([x0 - 60 - 70 * Math.sin(k / 6 * Math.PI) * (.6 + .4 * hash(i * 9 + k)), lerp(y0 + bh, y0, k / 6)]);   // a billowing trailing edge
    paint([...top, ...bot.reverse(), ...tail], { wash: c1, fill: c2, fillOp: 70, bleed: .05, tex: .7, border: .6, ink: null });
    const cx = x1 - 60, cy = y0 + bh / 2, cr = bh * .35;   // a curl at the leading edge
    const curl = []; for (let k = 0; k <= 14; k++) { const a = k / 14 * TAU * 1.1, rr = cr * (1 - k / 18); curl.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); }
    inkLine(curl, 2, '#6E93BD', 'ink', .6);
  }
}
// Eye-shaped iris: everything outside a vertical almond at (cx, cy) of height h goes to ink. k = 1 open … 0 shut.
function eyeIris(cx, cy, h, k, col = MK.ink) {
  if (k <= .01) { paint(rectPts(-60, -60, W + 120, H + 120), { wash: col, ink: null }); return; }
  const hh = h * k, ww = hh * .36, pts = [];
  for (let i = 0; i <= 16; i++) { const a = i / 16; pts.push([cx + Math.sin(Math.PI * a) * ww, cy - hh / 2 + hh * a]); }
  for (let i = 15; i > 0; i--) { const a = i / 16; pts.push([cx - Math.sin(Math.PI * a) * ww, cy - hh / 2 + hh * a]); }
  irisShape(pts, col);
}

// Props sheet: studio.html?loop=modakprops
(() => {
  LOOPS.modakprops = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: MK.wall, ink: null });
    padlock(260, 330, 280, { eye: clamp(t / 2), narrow: clamp(t - 2.5), glare: .6, lookX: Math.sin(t) });
    paperBag(760, 520, 240, { open: t > 2 ? 1 : 0 });
    phone(250, 1150, 380, 'order', { count: 21, countPop: t % 1, btnK: t > 3 ? 1 : 0 });
    phone(780, 1150, 380, t < 2 ? 'splash' : 'stars', { pop: clamp(t), stars: (t * 2) % 6, glowK: .5 });
    meteor(300, 1750, 60, .9, 'a');
    for (let i = 0; i < 3; i++) mkModak(560 + i * 180, 1860, 120, i / 2, 'sheet' + i);
    trunkTip(1150, 1500, 1000, 1350, 30, 0);
  };
  LOOPS.modakprops.len = 4;
})();
