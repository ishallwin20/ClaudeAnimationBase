// wifi_props.js: the set and props for "The Cosmic Wi-Fi Battle" (src/scenes/wifi_battle.js). Loaded before it;
// everything here is a pure function of its arguments (and T for boil), shared by the shots.
//
//   STAGE                              where everyone and everything stands, in world pixels
//   room(t, S)                         the cave-room on Kailash: wall, arched window, split rug (teal | saffron),
//                                      the cable run on the wall, the socket, the diya. S = { dark 0..1 }
//   router(x, y, s, o)                 the divine router: (x, y) = the middle of its base; o.power, o.heat, o.tipL /
//                                      o.tipR (world points the antenna tips are pulled to), o.shake
//   wifiArcs(x, y, s, o)               the Wi-Fi fan over it: o.bars 0..3, o.lean (radians), o.spin, o.col
//   hologram(x, y, w, h, t, o)         Kartikeya's VR game, projected: o.on, o.frozen, o.gameT, o.aim
//   tv(x, y, w, h, t, o)               Bappa's 4K modak tutorial on the wall: o.frozen, o.gameT
//   spinner(x, y, r, a)                the buffering ring (always in phase with T, so every screen spins together)
//   cord(pts, o), plug(...), socket(...), vrHeadset(u, sw, o), modakPlate(...), diya(...), stool(...)
//   dataFlow, glareBolt, sparks, dust, speedLines, gulpLump    painted marks
//   fanIris, whipSmear, crtOff         transitions
const WB = {
  ink: '#2B2233', cream: '#FFF5E2',
  wall: '#2E3168', wallDk: '#20234F', wallLt: '#4A4F92', stone: '#3B3F7C',
  floor: '#43365E', floorDk: '#2F2548', board: '#5A4A7A',
  sky: '#1B2150', skyLt: '#33407E', moon: '#FFF1CF', snow: '#E6EEF8', snowDk: '#A9BCD8', rock: '#6C7AA6',
  wood: '#8A5A3C', woodDk: '#5E3B27', woodLt: '#B37D52',
  teal: '#2FA39B', tealDk: '#1C6B6B', tealLt: '#8FE3D8', tealGlow: '#3FE0D0',
  saff: '#F29A3A', saffDk: '#C26A22', saffLt: '#FFD08A', saffGlow: '#FFA640',
  gold: '#EDB43C', goldDk: '#B67D1C', goldLt: '#FFE39A', hot: '#FFF3D6',
  panel: '#12304A', panelDk: '#0B1E33', space: '#161A40', asura: '#8B4FB8', asuraDk: '#5A2E80',
  screen: '#FFE9C6', screenDk: '#E9C08A', counter: '#B9774A',
  plastic: '#EDE4D3', plasticDk: '#B9AE9A', cable: '#2A2536', cableLt: '#5B5470',
  clay: '#C8703E', clayDk: '#8E4424', flame: '#FFE9A8', flameDk: '#FFAA45', warm: '#FFB45A',
  brass: '#DDA83C', brassDk: '#9C6E1F', dark: '#0F1230',
};
const STAGE = {
  floorY: 1290,                                   // where the wall meets the floor
  kX: 320, kY: 1480, kU: 19,                      // Kartikeya, gaming on the left
  gX: 775, gY: 1480, gU: 21,                      // Bal Bappa, sitting on the right
  rX: 540, rY: 1395, rS: 150,                     // the router on its stool: (rX, rY) = the middle of its base
  holoX: 318, holoY: 850, holoW: 330, holoH: 240, // the hologram over Kartikeya's head
  tvX: 772, tvY: 850, tvW: 330, tvH: 220,         // the TV on the wall over Bappa
  plateX: 895, plateY: 1548,                      // Bappa's plate of modaks
  runY: 1062, clips: [612, 1000, 1180, 1330],     // the cable run along the wall, and its clips
  sockX: 1440, sockY: 1196,                       // the wall socket
  shX: 1790, shY: 1445, shU: 24,                  // Shiva, meditating in the next alcove
  diyaX: 2010, diyaY: 1470,
};

// ---------- helpers ----------
// A body-local point (in u) → world, through a character's transform (translate to the feet, rot, squash, flip).
// Works for kartikeya() and balBappa() (pass a standing Bappa's y already lifted by 2.6u).
function bodyWorld(x, y, u, o, lx, ly) {
  const sq = (o.sq || 0) + (o.take || 0), px = (o.flip ? -1 : 1) * (1 + sq * .6) * lx * u, py = (1 - sq) * ly * u, r = o.rot || 0;
  return [x + (o.dx || 0) * u + px * Math.cos(r) - py * Math.sin(r), y + (o.dy || 0) * u + px * Math.sin(r) + py * Math.cos(r)];
}
// Where Kartikeya's vel hooks things (a little below the blade's tip), with rot.
function kartiHook(x, y, u, o, reach = 8.1) {
  const [hx, hy] = kartiHandLocal(o, 1), a = o.spearA || 0;
  return bodyWorld(x, y, u, o, hx + Math.sin(a) * reach, hy - Math.cos(a) * reach);
}
// Kartikeya's hand, with rot (s = -1 his shield hand, on screen left)
function kartiHandW(x, y, u, o, s) { const [hx, hy] = kartiHandLocal(o, s); return bodyWorld(x, y, u, o, hx, hy); }
// The tip of Bal Bappa's trunk (mirrors bal_bappa.js: pose, blend, sway, tap, head turn; not htilt)
function balTrunkTip(x, y, u, o) {
  let tp = balTrunk(o.trunk);
  if (o.trunk2 && o.trunkK > 0) { const a = resample(tp, 9), b = resample(balTrunk(o.trunk2), 9); tp = a.map((p, i) => [lerp(p[0], b[i][0], o.trunkK), lerp(p[1], b[i][1], o.trunkK)]); }
  const [lx, ly] = tp[tp.length - 1], hx = clamp(o.hx || 0, -1, 1), HY = (o.stand || 0) > .5 ? 2.6 : 0;
  return bodyWorld(x, y, u, o, lx + (o.trunkSway || 0) + hx * 1.4, ly - (o.trunkTap || 0) * .7 - HY);
}
// Bal Bappa's hand (mirrors bal_bappa.js's arm math), with rot
function balHandW(x, y, u, o, s) {
  const st = (o.stand || 0) > .5, a0 = s < 0 ? o.aL : o.aR, rest = st ? -1.3 : s < 0 ? -1.75 : -1.4;
  const a = a0 == null ? rest : lerp(rest, a0, clamp((a0 - .2) / .4)), L = st ? 3.3 : 3;
  return bodyWorld(x, y, u, o, s * ((st ? 3.1 : 2.85) + Math.cos(a) * L), -(st ? 2.6 : 0) - 5.9 - Math.sin(a) * L);
}
// Vasuki's mouth in world space (mirrors shiva.js's snakeHead: up, look, sway; the lean; ignores rot)
function vasukiMouth(x, y, u, o) {
  const up = clamp(o.snakeUp || 0), lk = o.snakeLook ?? -1, sway = Math.sin(T * 2.3) * .25 * up, sq = o.sq || 0;
  const hd = [lerp(-5.1, -5.4 + lk * .6 + sway, up) + (o.lean || 0), lerp(-10.3, -14.4, up)];
  const r = lerp(.35, 0, up) + lk * .15 * up, mx = lk * .5, my = .45;
  const lx = hd[0] + mx * Math.cos(r) - my * Math.sin(r), ly = hd[1] + mx * Math.sin(r) + my * Math.cos(r);
  return [x + (o.dx || 0) * u + (o.flip ? -1 : 1) * lx * u * (1 + sq * .6), y + ((o.dy || 0) - (o.float || 0)) * u + ly * u * (1 - sq)];
}
// n evenly spaced points along a polyline (world px)
function along(P, n) { return resample(P, n); }

// Big shapes are unreliable in p5.brush under a zoomed camera, so the wall's base colour is laid in screen space and
// the floor is painted in canvas-sized tiles.
function screenWash(col) { push(); resetMatrix(); translate(-W / 2, -H / 2); paint(rectPts(-60, -60, W + 120, H + 120), { wash: col, ink: null }); pop(); }
function archPts(x, y, w, h, n = 10) {   // a rectangle with a round arch on top; (x, y) = top-left of the bounding box
  const r = w / 2, pts = [[x, y + h], [x, y + r]];
  for (let i = 1; i < n; i++) { const a = Math.PI + i / n * Math.PI; pts.push([x + r + Math.cos(a) * r, y + r + Math.sin(a) * r]); }
  pts.push([x + w, y + r], [x + w, y + h]);
  return pts;
}

// ---------- the room ----------
const XS = [-500, 100, 700, 1300, 1900, 2500];   // tile edges
function room(t, S = {}) {
  const F = STAGE.floorY;
  boilSeed('wall');
  screenWash(WB.wall);
  for (let i = 0; i < XS.length - 1; i++) paint(rectPts(XS[i], 300, XS[i + 1] - XS[i] + 8, F - 300), { wash: WB.wall, ink: null });
  for (let i = 0; i < XS.length - 1; i++) paint(rectPts(XS[i], 240, XS[i + 1] - XS[i] + 8, 260, 20), { fill: WB.wallDk, fillOp: 110, bleed: .2, tex: .6, border: .6, ink: null });
  // the cave wall: a few big stones, stable (hash), and a stencilled border
  boilSeed('stones');
  for (let i = 0; i < 16; i++) {
    const sx = -300 + i * 160 + 70 * hash(i * 1.3), sy = 520 + 560 * hash(i * 4.7), rx = 60 + 40 * hash(i * 2.1), ry = 30 + 18 * hash(i * 8.3);
    paint(ellPts(sx, sy, rx, ry, 12, 3), { fill: i % 2 ? WB.stone : WB.wallDk, fillOp: 70, bleed: .15, tex: .5, border: .4, ink: null });
  }
  for (let i = 0; i < 18; i++) {
    const x = -300 + i * 150, y = 1230;
    inkLine([[x, y], [x + 38, y - 36], [x + 75, y - 50], [x + 112, y - 36], [x + 150, y]], .9, WB.wallLt, 'inkfine', .6);
  }
  // the window, high in the middle: night sky, stars, moon, Kailash
  boilSeed('window');
  const wx = 380, wy = 360, ww = 320, wh = 330;
  paint(archPts(wx, wy, ww, wh), { wash: WB.sky, fill: WB.skyLt, fillOp: 90, bleed: .1, tex: .5, ink: null });
  for (let i = 0; i < 10; i++) {
    const sx = wx + 30 + hash(i * 3.7) * (ww - 60), sy = wy + 50 + hash(i * 9.1) * (wh * .45), tw = .6 + .4 * wob(t, .5 + hash(i), hash(i * 2));
    paint(starPts(sx, sy, 4 + 6 * hash(i * 5.3) * tw, .35, 4), { wash: WB.moon, ink: null });
  }
  glow(wx + ww * .72, wy + 120, 110, '#BFD3FF', .5 * (1 - (S.dark || 0) * .3));
  paint(ellPts(wx + ww * .72, wy + 120, 40, 40, 20), { wash: WB.moon, ink: null });
  paint(ellPts(wx + ww * .72 + 18, wy + 106, 35, 36, 20), { wash: WB.sky, ink: null });
  boilSeed('peak');
  const P = pts => pts.map(([a, b]) => [wx + ww * .45 + a * 180, wy + wh + b * 180]);
  paint(P([[-1.2, 0], [-.75, -.55], [-.5, -.6], [-.2, -1.05], [0, -1.15], [.25, -1.02], [.55, -.62], [.8, -.5], [1.2, 0]]), { wash: WB.rock, fill: WB.wallDk, fillOp: 60, tex: .5, ink: WB.ink, sw: .7, curv: .15 });
  paint(P([[-.33, -.83], [-.2, -1.05], [0, -1.15], [.25, -1.02], [.4, -.82], [.26, -.74], [.12, -.86], [-.02, -.72], [-.16, -.86]]), { wash: WB.snow, fill: WB.snowDk, fillOp: 50, tex: .4, ink: null, curv: .1 });
  boilSeed('frame');
  paint(ribbon(archPts(wx - 6, wy - 6, ww + 12, wh + 6, 12), 28, 28), { wash: WB.wood, fill: WB.woodDk, fillOp: 70, tex: .6, ink: WB.ink, sw: 1 });
  paint(rectPts(wx - 40, wy + wh - 10, ww + 80, 38, 3), { wash: WB.woodLt, fill: WB.wood, fillOp: 80, tex: .5, ink: WB.ink, sw: 1 });
  // a rock pillar between the kids' room and Shiva's alcove
  boilSeed('pillar');
  paint([[1120, F + 10], [1110, 700], [1150, 380], [1230, 300], [1290, 380], [1300, 700], [1290, F + 10]], { wash: WB.stone, fill: WB.wallDk, fillOp: 80, tex: .6, border: .5, ink: WB.ink, sw: .9, curv: .3 });
  // floor tiles and the baseboard line
  boilSeed('floor');
  for (let i = 0; i < XS.length - 1; i++) {
    paint(rectPts(XS[i], F, XS[i + 1] - XS[i] + 8, 360), { wash: WB.floor, fill: WB.floorDk, fillOp: 70, bleed: .08, tex: .6, border: .5, ink: null });
    paint(rectPts(XS[i], F + 350, XS[i + 1] - XS[i] + 8, 500), { wash: WB.floor, ink: null });
    inkLine([[XS[i], F], [XS[i + 1] + 8, F]], 1.3, WB.ink, 'ink', 0);
  }
  if (S.dark) darken(S.dark);
  // the split rug: Kartikeya's teal half and Bappa's saffron half, the seam under the router (dimmed, not washed over, in the dark)
  boilSeed('rug');
  const dim = c => mixCol(c, '#2A2450', .6 * (S.dark || 0));
  paint(rrPts(80, 1400, STAGE.rX - 80 + 4, 190, 24, 3), { wash: dim(WB.teal), fill: dim(WB.tealDk), fillOp: 70, tex: .6, border: .5, ink: WB.ink, sw: .9 });
  paint(rrPts(STAGE.rX - 4, 1400, 1000 - STAGE.rX, 190, 24, 3), { wash: dim(WB.saff), fill: dim(WB.saffDk), fillOp: 70, tex: .6, border: .5, ink: WB.ink, sw: .9 });
  inkLine([[STAGE.rX, 1404], [STAGE.rX + 6, 1495], [STAGE.rX, 1586]], 1.2, WB.ink, 'inkfine', .3);
  for (let i = 0; i < 6; i++) paint(starPts(130 + i * 68, 1495, 10, .45, 4, 0), { wash: WB.tealLt, ink: null });
  for (let i = 0; i < 6; i++) paint(starPts(STAGE.rX + 60 + i * 68, 1495, 10, .45, 4, 0), { wash: WB.saffLt, ink: null });
  // Shiva's alcove: a tiger-striped mat under him is his own; here a low stone step and the diya
  socket(STAGE.sockX, STAGE.sockY, 92, S);
  diya(STAGE.diyaX, STAGE.diyaY, 60, t);
}
// the blackout: a dark, cool wash over the set (characters are drawn after it)
function darken(k) { push(); resetMatrix(); translate(-W / 2, -H / 2); boilSeed('dark'); paint(rectPts(-60, -60, W + 120, H + 120), { wash: WB.dark, washOp: 140 * clamp(k), ink: null }); pop(); }

// a stone stool with a red cloth, for the router
function stool(x, y, s) {
  boilSeed('stool');
  paint([[x - s * .55, y + s * .62], [x - s * .5, y], [x + s * .5, y], [x + s * .55, y + s * .62]], { wash: WB.stone, fill: WB.wallDk, fillOp: 80, tex: .6, ink: WB.ink, sw: .9, curv: .1 });
  paint([[x - s * .62, y - 2], [x + s * .62, y - 2], [x + s * .56, y + s * .16], [x + s * .2, y + s * .24], [x - s * .2, y + s * .24], [x - s * .56, y + s * .16]], { wash: '#C0413A', fill: '#8E2A2A', fillOp: 60, tex: .5, ink: WB.ink, sw: .8, curv: .3 });
  for (let i = 0; i < 5; i++) inkLine([[x - s * .5 + i * s * .25, y + s * .2], [x - s * .5 + i * s * .25, y + s * .3]], .8, WB.goldDk, 'inkfine', 0);   // tassels
}

// ---------- the router ----------
// The antenna bases, in world space
function routerBases(x, y, s) { return [[x - .3 * s, y - .38 * s], [x + .3 * s, y - .38 * s]]; }
function routerRestTip(x, y, s, side) { const [b] = routerBases(x, y, s).slice(side < 0 ? 0 : 1); return [b[0] + side * .16 * s, b[1] - .72 * s]; }
function router(x, y, s, o = {}) {
  const pw = clamp(o.power ?? 1), heat = clamp(o.heat || 0), sw = clamp(s / 150, .5, 1.4);
  const B = routerBases(x, y, s);
  // antennas: bendy rods from the bases to wherever they're being pulled
  for (const side of [-1, 1]) {
    boilSeed('antenna ' + side);
    const b = B[side < 0 ? 0 : 1], tip = (side < 0 ? o.tipL : o.tipR) || routerRestTip(x, y, s, side);
    const dx = tip[0] - b[0], dy = tip[1] - b[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
    const bend = (o.bend || 0) * side * L * .12 + (side < 0 ? o.boingL || 0 : o.boingR || 0) * L * .25;
    const stretch = clamp((L - .75 * s) / (.9 * s)), w = .13 * s * (1 - .45 * stretch);
    const pts = [b, [b[0] + dx * .5 + nx * bend, b[1] + dy * .5 + ny * bend], tip];
    paint(ribbon(pts, w, w * .55), { wash: mixCol(WB.brass, WB.hot, heat * .7), fill: WB.brassDk, fillOp: 70, tex: .4, ink: WB.ink, sw: sw * .8 });
    if (stretch > .05) for (const f of [.3, .5, .7]) {   // taffy stretch marks
      const c = [lerp(b[0], tip[0], f) + nx * bend * Math.sin(f * Math.PI), lerp(b[1], tip[1], f) + ny * bend * Math.sin(f * Math.PI)];
      inkLine([[c[0] - nx * w * .35, c[1] - ny * w * .35], [c[0] + nx * w * .35, c[1] + ny * w * .35]], sw * .5, WB.brassDk, 'inkfine', 0);
    }
    paint(ellPts(tip[0], tip[1], .1 * s, .1 * s, 12), { wash: mixCol(WB.gold, WB.hot, heat), ink: WB.ink, sw: sw * .7 });
  }
  boilSeed('router');
  push(); translate(x + (o.shake ? o.shake * Math.sin(T * 70) : 0), y);
  const body = rrPts(-.5 * s, -.42 * s, s, .42 * s, .1 * s, s * .006);
  const c = mixCol(WB.gold, WB.hot, heat * .8), cd = mixCol(WB.goldDk, WB.saff, heat * .6);
  paint(body, { wash: c, fill: cd, fillOp: 70, tex: .5, border: .5, ink: WB.ink, sw });
  paint(rrPts(-.44 * s, -.4 * s, .88 * s, .08 * s, .03 * s), { wash: mixCol(WB.goldLt, WB.hot, heat), ink: null });   // the top's shine
  // a little trishul stamped on the front: it's Dad's router
  inkLine([[0, -.08 * s], [0, -.3 * s]], sw * .9, WB.goldDk, 'inkfine', 0);
  inkLine([[-.06 * s, -.3 * s], [-.07 * s, -.22 * s], [0, -.19 * s], [.07 * s, -.22 * s], [.06 * s, -.3 * s]], sw * .8, WB.goldDk, 'inkfine', .5);
  // LEDs: power, then three blinking data lights
  for (let i = 0; i < 4; i++) {
    const lx = (-.38 + i * .1) * s, ly = -.12 * s, on = pw * (i === 0 ? 1 : .5 + .5 * Math.sign(Math.sin(T * (9 + i * 3.1) + i)));
    paint(ellPts(lx, ly, .025 * s, .025 * s, 8), { wash: on > .5 ? (i === 0 ? '#9CF0A0' : WB.tealLt) : '#4A4458', ink: null });
    if (on > .5) glow(lx, ly, .07 * s, i === 0 ? '#9CF0A0' : WB.tealGlow, .8 * pw);
  }
  // the cord port on its right side
  paint(rrPts(.46 * s, -.22 * s, .08 * s, .1 * s, .02 * s), { wash: WB.cable, ink: WB.ink, sw: sw * .6 });
  pop();
}
// the cord's end at the router
function routerPort(x, y, s) { return [x + .54 * s, y - .17 * s]; }
// the power LED (for the transitions)
function routerLED(x, y, s) { return [x - .38 * s, y - .12 * s]; }

// The Wi-Fi fan: a dot and three arcs over (x, y). bars 0..3 (fractional: the last arc fades), lean tips the fan
// (radians, + = toward screen right), spin sends the arcs round like a siren.
function wifiArcs(x, y, s, o = {}) {
  const bars = o.bars ?? 3, col = o.col || WB.goldLt, lean = o.lean || 0, spin = o.spin || 0, a = o.alpha ?? 1;
  if (bars <= .02 || a <= .02) return;
  glow(x, y - .5 * s, 1.1 * s * clamp(bars / 3), o.glowCol || WB.gold, .55 * a * clamp(bars / 3));
  boilSeed('wifi');
  paint(ellPts(x, y, .07 * s, .07 * s, 10), { wash: col, ink: WB.ink, sw: .8 });
  for (let i = 0; i < 3; i++) {
    const k = clamp(bars - i); if (k <= .02) continue;
    const r = (.32 + i * .26) * s, c = -Math.PI / 2 + lean + spin * (i % 2 ? -1 : 1) * (1 + i * .4), half = .62 - i * .05, pts = [];
    for (let j = 0; j <= 10; j++) { const q = c - half + j / 10 * 2 * half; pts.push([x + Math.cos(q) * r, y + Math.sin(q) * r]); }
    inkLine(pts, (4.2 - i * .6) * k * a, col, 'ink', .5);
  }
}

// ---------- screens ----------
// The buffering ring: 9 dots, one bright, the tail fading. In phase with T, so every screen spins together.
function spinner(x, y, r, a = 1, col = WB.cream) {
  boilSeed('spinner');
  const n = 9, head = Math.floor(T * 14);
  for (let i = 0; i < n; i++) {
    const age = ((head - i) % n + n) % n, q = i / n * TAU - Math.PI / 2, k = Math.max(0, 1 - age / 6);
    paint(ellPts(x + Math.cos(q) * r, y + Math.sin(q) * r, r * .17 * (.6 + .4 * k), r * .17 * (.6 + .4 * k), 8), { wash: col, washOp: (60 + 195 * k) * a, ink: null });
  }
}
// Kartikeya's game, a panel of light over his head: space, an asura ship, his peacock fighter (aim tips it),
// lasers and pops. o.on 0..1 (the projection), o.frozen 0..1 (dims under the spinner), o.gameT (the game's own clock)
function hologram(x, y, w, h, t, o = {}) {
  const on = clamp(o.on ?? 1); if (on <= .02) return;
  const g = o.gameT ?? t, fr = clamp(o.frozen || 0), a = on * (1 - .25 * fr);
  glow(x, y, w * .9, WB.tealGlow, .45 * a * (1 - .5 * fr));
  boilSeed('holo');
  paint(rrPts(x - w / 2, y - h / 2, w, h, 16, 2), { wash: WB.panel, washOp: 215 * on, ink: WB.tealLt, sw: 1.1 });
  for (let i = 0; i < 12; i++) {   // stars streaming down
    const sx = x - w / 2 + 18 + hash(i * 3.3) * (w - 36), sy = y - h / 2 + 12 + frac(hash(i * 7.7) + g * (.25 + .3 * hash(i))) * (h - 24);
    paint(ellPts(sx, sy, 2.2, 3.5 + 3 * hash(i), 6), { wash: WB.tealLt, washOp: 200 * a, ink: null });
  }
  boilSeed('holo asura');
  const ax = x + w * .22 * Math.sin(g * 1.7), ay = y - h * .22 + 6 * Math.sin(g * 5);
  paint(ellPts(ax, ay, 34, 22, 14), { wash: WB.asura, fill: WB.asuraDk, fillOp: 60, washOp: 255 * a, ink: WB.ink, sw: .8 });
  for (const s of [-1, 1]) paint([[ax + s * 14, ay - 14], [ax + s * 30, ay - 36], [ax + s * 24, ay - 10]], { wash: WB.cream, washOp: 255 * a, ink: WB.ink, sw: .6 });   // horns
  for (const s of [-1, 1]) paint(ellPts(ax + s * 10, ay - 2, 5, 6, 8), { wash: '#FFE36A', ink: null });
  boilSeed('holo ship');
  const aim = o.aim || 0, sx = x + aim * w * .28, sy = y + h * .3;
  push(); translate(sx, sy); rotate(aim * .4);
  paint([[0, -26], [18, 14], [0, 6], [-18, 14]], { wash: WB.tealLt, fill: WB.teal, fillOp: 60, washOp: 255 * a, ink: WB.ink, sw: .7 });
  for (const s of [-1, 1]) paint(ellPts(s * 20, 14, 7, 10, 8), { wash: '#5BAA4E', ink: null });   // peacock-eye wingtips
  pop();
  if (!fr) for (let i = 0; i < 2; i++) {   // lasers up toward the asura, two shots a beat
    const f = frac(g * 2 + i * .5), lx = sx + aim * 8, ly = lerp(sy - 30, ay + 30, f);
    inkLine([[lx, ly], [lx, ly - 22]], 3, '#FFE36A', 'ink', 0);
  }
  if (!fr) { const pf = frac(g * 1.3); if (pf < .25) paint(starPts(ax + 16, ay - 4, 14 + 40 * pf, .45, 7, g), { wash: '#FFE36A', washOp: 255 * (1 - pf * 4), ink: null }); }
  if (fr > .02) { paint(rrPts(x - w / 2 + 4, y - h / 2 + 4, w - 8, h - 8, 14), { wash: WB.panelDk, washOp: 150 * fr, ink: null }); spinner(x, y, 44, fr); }
  // the edge flickers like a projection
  inkLine([[x - w / 2, y - h / 2 + 6 + 4 * Math.sin(T * 20)], [x + w / 2, y - h / 2 + 6 + 4 * Math.sin(T * 20)]], .8, WB.tealLt, 'inkfine', 0);
}
// the projector beam from the headset up to the panel
function holoBeam(from, x, y, w, h, k) {
  if (k <= .02) return;
  boilSeed('beam');
  paint([from, [x - w / 2 + 20, y + h / 2], [x + w / 2 - 20, y + h / 2]], { wash: WB.tealGlow, washOp: 55 * k, ink: null });
  glow(from[0], from[1], 50, WB.tealGlow, .8 * k);
}
// Bappa's TV on the wall: a 4K kitchen, the modak mountain growing row by row. o.frozen dims it under the spinner.
function tv(x, y, w, h, t, o = {}) {
  const g = o.gameT ?? t, fr = clamp(o.frozen || 0), dark = clamp(o.off || 0);
  if (dark < .98) glow(x, y + h * .2, w * .95, WB.saffGlow, .55 * (1 - dark) * (1 - .45 * fr));
  boilSeed('tv');
  paint(rrPts(x - w / 2 - 14, y - h / 2 - 14, w + 28, h + 28, 14, 2), { wash: '#2A2438', ink: WB.ink, sw: 1.1 });   // bezel
  paint(rrPts(x - w / 2, y - h / 2, w, h, 6), { wash: dark > .5 ? '#1B1826' : WB.screen, fill: WB.screenDk, fillOp: dark > .5 ? 0 : 60, tex: .4, ink: null });
  if (dark > .5) { inkLine([[x - w * .35, y - h * .3], [x - w * .15, y - h * .1]], 1, '#3A3450', 'inkfine', 0); return; }
  boilSeed('tv kitchen');
  paint(rectPts(x - w / 2, y + h * .22, w, h * .28), { wash: WB.counter, fill: WB.woodDk, fillOp: 50, tex: .5, ink: null });   // the counter
  // the mountain: rows grow with g
  const rows = Math.min(5, 1 + Math.floor(g * .9)), ms = 30, bx = x - w * .08, by = y + h * .24;
  for (let r = 0; r < rows; r++) for (let i = 0; i <= rows - 1 - r; i++) {
    boilSeed('tvmodak ' + r + ' ' + i);
    modak(bx + (i - (rows - 1 - r) / 2) * ms * 1.15, by - r * ms * 1.05, ms);
  }
  boilSeed('tv steamer');
  const px = x + w * .32, py = y + h * .24;   // a steaming pot on the counter
  paint([[px - 36, py - 46], [px + 36, py - 46], [px + 30, py], [px - 30, py]], { wash: WB.brass, fill: WB.brassDk, fillOp: 60, tex: .5, ink: WB.ink, sw: .7 });
  if (!fr) for (let i = 0; i < 2; i++) { const f = frac(g * .8 + i * .5); paint(ellPts(px - 10 + i * 20, py - 56 - f * 50, 9 + f * 8, 7 + f * 5, 10), { wash: '#FFFFFF', washOp: 170 * (1 - f), ink: null }); }
  // a red play badge in the corner: it's a video site
  paint(rrPts(x - w / 2 + 12, y - h / 2 + 12, 50, 34, 9), { wash: '#E0453A', ink: WB.ink, sw: .7 });
  paint([[x - w / 2 + 31, y - h / 2 + 20], [x - w / 2 + 31, y - h / 2 + 38], [x - w / 2 + 46, y - h / 2 + 29]], { wash: WB.cream, ink: null });
  // the progress bar: the tutorial's scrubber
  inkLine([[x - w * .42, y + h * .42], [x + w * .42, y + h * .42]], 2, '#8A6A58', 'inkfine', 0);
  inkLine([[x - w * .42, y + h * .42], [x - w * .42 + w * .84 * frac(g * .03 + .2), y + h * .42]], 2.4, '#E0453A', 'inkfine', 0);
  if (fr > .02) { paint(rrPts(x - w / 2, y - h / 2, w, h, 6), { wash: '#2A2438', washOp: 160 * fr, ink: null }); spinner(x, y - 6, 44, fr); }
}

// ---------- the cord, the socket, the plug ----------
// the cable as a thick ink line along world points, with clips where it's stapled to the wall
function cord(pts, o = {}) {
  boilSeed('cord');
  const P = through(pts);
  inkLine(P, o.w || 3.6, WB.cable, 'ink', 0);
  inkLine(P.map(([x, y]) => [x - .8, y - 1.6]), (o.w || 3.6) * .3, WB.cableLt, 'inkfine', 0);
  for (const c of o.clips || []) {   // little cream saddles over the cable
    paint([[c[0] - 9, c[1] + 5], [c[0] - 7, c[1] - 6], [c[0], c[1] - 9], [c[0] + 7, c[1] - 6], [c[0] + 9, c[1] + 5]], { wash: WB.plastic, ink: WB.ink, sw: .6, curv: .5 });
  }
}
// an Indian socket on the wall, with its switch; its three holes are a little face (it looks shocked when empty).
// S.plugged: the plug is in it
function socket(x, y, s, S = {}) {
  boilSeed('socket');
  paint(rrPts(x - s * .55, y - s * .6, s * 1.6, s * 1.2, s * .14, 1), { wash: WB.plastic, fill: WB.plasticDk, fillOp: 60, tex: .4, ink: WB.ink, sw: .9 });
  paint(rrPts(x + s * .62, y - s * .32, s * .3, s * .56, s * .06), { wash: WB.plasticDk, ink: WB.ink, sw: .7 });   // the switch
  paint(rrPts(x + s * .66, y - s * .28 + (S.switchOff ? s * .26 : 0), s * .22, s * .22, s * .04), { wash: S.switchOff ? WB.plastic : '#D2452F', ink: WB.ink, sw: .5 });
  for (const s_ of [-1, 1]) paint(ellPts(x + s_ * s * .18, y - s * .2, s * .07, s * .08, 8), { wash: WB.ink, ink: null });   // "eyes"
  paint(ellPts(x, y + s * .2, s * .12, s * .15, 10), { wash: WB.ink, ink: null });   // "mouth"
}
// a three-pin plug. (x, y) = where the cord enters its top; it hangs down from there, turned by rot
function plug(x, y, s, rot = 0) {
  boilSeed('plug');
  push(); translate(x, y); rotate(rot);
  for (const [px, pw, pl] of [[-.2, .07, .35], [.2, .07, .35], [0, .11, .42]]) paint(rectPts((px - pw / 2) * s, .95 * s, pw * s, pl * s), { wash: '#C9CED6', ink: WB.ink, sw: .5 });
  paint([[-.12 * s, 0], [.12 * s, 0], [.36 * s, .45 * s], [.34 * s, 1 * s], [-.34 * s, 1 * s], [-.36 * s, .45 * s]], { wash: WB.plastic, fill: WB.plasticDk, fillOp: 60, tex: .4, ink: WB.ink, sw: .8, curv: .2 });
  for (const k of [.55, .7]) inkLine([[-.24 * s, k * s], [.24 * s, k * s]], .6, WB.plasticDk, 'inkfine', 0);
  pop();
}

// ---------- Kartikeya's headset (a head hook: kartikeya(..., { head: (u, sw) => vrHeadset(u, sw, o) })) ----------
// o.up 0..1 pushes it up onto his forehead; o.lit 0..1 lights the visor; o.frozen shows a tiny spinner on it
function vrHeadset(u, sw, o = {}) {
  const up = clamp(o.up || 0), lit = clamp(o.lit ?? 1), P = pts => U(pts, u);
  push(); translate(0, lerp(-12.2, -14.7, up) * u); rotate(-.1 * up); scale(1, 1 - .3 * up);
  paint(ribbon(P([[-3.1, -.2], [-2.2, -1.2], [0, -1.55], [2.2, -1.2], [3.1, -.2]]), .45 * u, .45 * u), { wash: '#1E2B40', ink: KAR.ink, sw: sw * .5 });   // strap
  paint(rrPts(-3.15 * u, -1.05 * u, 6.3 * u, 2.1 * u, .9 * u, u * .02), { wash: '#26344E', fill: '#15203A', fillOp: 60, tex: .4, ink: KAR.ink, sw: sw * .9 });
  paint(rrPts(-2.7 * u, -.55 * u, 5.4 * u, 1.05 * u, .5 * u), { wash: lit > .3 ? WB.tealLt : '#3B4A66', ink: null });   // the visor strip
  if (lit > .05) glow(0, 0, 3.4 * u, WB.tealGlow, .7 * lit);
  paint(rrPts(-2.4 * u, -.45 * u, 1.3 * u, .3 * u, .15 * u), { wash: '#FFFFFF', washOp: 170, ink: null });   // a shine
  if (o.frozen) spinner(0, 0, .38 * u, 1, WB.panelDk);
  pop();
}

// ---------- small props ----------
function modakPlate(x, y, s, n = 5) {
  boilSeed('plate');
  paint(ellPts(x, y, s, s * .26, 20), { wash: WB.brass, fill: WB.brassDk, fillOp: 60, tex: .5, ink: WB.ink, sw: .8 });
  paint(ellPts(x, y - s * .05, s * .8, s * .17, 18), { wash: '#F0C865', ink: null });
  const spots = [[-.45, 0], [.05, .02], [.5, 0], [-.2, -.25], [.28, -.25], [.02, -.5]];
  for (let i = 0; i < Math.min(n, spots.length); i++) { boilSeed('plate modak ' + i); modak(x + spots[i][0] * s, y + spots[i][1] * s * .9, s * .34); }
}
function diya(x, y, s, t) {
  const f = .85 + .15 * wob(t, 3.1) * wob(t, 1.7, .3);
  glow(x, y - s * .6, s * 7 * f, WB.warm, .7);
  glow(x, y - s * .6, s * 2.2 * f, '#FFD27A', .8);
  boilSeed('diya');
  paint([[x - s * .6, y - s * .3], [x + s * .7, y - s * .35], [x + s * .4, y], [x - s * .4, y]], { wash: WB.clay, fill: WB.clayDk, fillOp: 60, tex: .5, ink: WB.ink, sw: .8, curv: .4 });
  const fl = Math.sin(t * 7) * .06;
  paint([[x + s * .5, y - s * .35], [x + s * (.52 + fl), y - s * 1.1], [x + s * .7, y - s * .45]], { wash: WB.flame, fill: WB.flameDk, fillOp: 70, ink: null, curv: .6 });
}

// ---------- marks ----------
// data packets flying from the router to a screen: dashes along an arc
function dataFlow(p0, p1, t, col, k = 1, key = '') {
  if (k <= .02) return;
  boilSeed('data ' + key);
  const mid = [(p0[0] + p1[0]) / 2, Math.min(p0[1], p1[1]) - 120];
  const at = f => { const a = lerp(p0[0], mid[0], f), b = lerp(mid[0], p1[0], f), c = lerp(p0[1], mid[1], f), d = lerp(mid[1], p1[1], f); return [lerp(a, b, f), lerp(c, d, f)]; };
  for (let i = 0; i < 5; i++) {
    const f = frac(t * 1.1 + i / 5), p = at(f), q = at(Math.min(1, f + .04));
    inkLine([p, q], 5 * k * Math.sin(f * Math.PI), col, 'ink', 0);
  }
}
// the glare: a zigzag of lightning between two faces
function glareBolt(a, b, k, key = '') {
  if (k <= .02) return;
  boilSeed('glare ' + key);
  const n = 9, pts = [];
  for (let i = 0; i <= n; i++) {
    const f = i / n, g = clamp(k * 1.4 - (Math.abs(f - .5) * 2) * .4);
    pts.push([lerp(a[0], b[0], f), lerp(a[1], b[1], f) + (i % 2 ? -1 : 1) * 16 * g * (i > 0 && i < n)]);
  }
  const c = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  glow(c[0], c[1], 120 * k, '#FFE36A', .7 * k);
  inkLine(pts, 6 * k, '#FFE36A', 'ink', 0);
  inkLine(pts, 1.6 * k, WB.ink, 'inkfine', 0);
}
// sparks spitting from a hot thing: new ones every boil frame
function sparks(x, y, r, k, key = '') {
  if (k <= .02) return;
  boilSeed('sparks ' + key);
  const n = Math.round(4 + 6 * k);
  for (let i = 0; i < n; i++) {
    const q = random() * TAU, r0 = r * (.6 + random() * .3), r1 = r0 + r * (.3 + random() * .6) * k;
    inkLine([[x + Math.cos(q) * r0, y + Math.sin(q) * r0], [x + Math.cos(q) * r1, y + Math.sin(q) * r1]], 2.6, i % 2 ? '#FFE36A' : WB.hot, 'ink', 0);
  }
}
// dust puffs kicked up behind skidding feet
function dust(x, y, s, age, key = '') {
  if (age < 0 || age > .6) return;
  boilSeed('dust ' + key);
  const k = age / .6;
  for (let i = 0; i < 3; i++) paint(ellPts(x - i * s * .7 - k * s, y - k * s * .6 - i * 4, s * (.4 + k * .5), s * (.3 + k * .3), 10), { wash: WB.board, washOp: 200 * (1 - k), ink: null });
}
// horizontal speed lines behind something moving fast (dir = -1: it's moving right, lines trail left)
function speedLines(x, y, h, len, k, key = '') {
  if (k <= .02) return;
  boilSeed('speed ' + key);
  for (let i = 0; i < 5; i++) { const yy = y - h / 2 + (i + .5) * h / 5 + jit(4), l = len * (.5 + .5 * hash(i + key.length)); inkLine([[x - l, yy], [x, yy]], 2 * k, WB.cream, 'dry', 0); }
}
// a heart that floats up and fades
function heartPuff(x, y, s, age, key) {
  if (age < 0 || age > 1.6) return;
  boilSeed('heart ' + key);
  const k = age / 1.6, r = s * (.5 + .5 * backOut(seg(age, 0, .3))) * (1 - seg(k, .7, 1));
  if (r > 1) paint(heartPts(x + Math.sin(age * 5) * s * .3, y - age * s * 1.8, r), { wash: '#E2476E', ink: WB.ink, sw: .8 });
}

// ---------- transitions ----------
// Everything outside a star-shaped hole around (cx, cy) goes to col (irisShape measures from the points' centroid;
// this one from a given centre, so a fan can grow out of its own tip).
function holeAround(pts, cx, cy, col, far = 4000) {
  const n = pts.length, out = p => { const dx = p[0] - cx, dy = p[1] - cy, d = Math.hypot(dx, dy) || 1; return [cx + dx / d * far, cy + dy / d * far]; };
  for (let i = 0; i < n; i++) {
    const a = pts[i], b = pts[(i + 1) % n], ex = (b[0] - a[0]) * .06, ey = (b[1] - a[1]) * .06;
    const a2 = [a[0] - ex, a[1] - ey], b2 = [b[0] + ex, b[1] + ey];
    paint([a2, b2, out(b2), out(a2)], { wash: col, washOp: 255, ink: null });
  }
}
// The Wi-Fi-fan iris: a dot at (cx, cy) grows into a fan pointing up (half-angle ang), which opens out into a full
// circle as it grows. r = its radius; ang from ~.6 (a Wi-Fi fan) to PI (a disc).
function fanIris(cx, cy, r, ang, col = WB.ink) {
  if (r < 3) { paint(rectPts(-60, -60, W + 120, H + 120), { wash: col, ink: null }); return; }
  const pts = [], n = 28, dotR = Math.min(r, 26);
  for (let i = 0; i <= n; i++) { const q = -Math.PI / 2 - ang + i / n * 2 * ang; pts.push([cx + Math.cos(q) * r, cy + Math.sin(q) * r]); }   // the fan, opening upward
  if (ang < Math.PI - .01) {   // round its tip off with the dot, going on round the bottom
    for (let i = 1; i < 8; i++) { const q = -Math.PI / 2 + ang + i / 8 * (TAU - 2 * ang); pts.push([cx + Math.cos(q) * dotR, cy + Math.sin(q) * dotR]); }
  }
  holeAround(pts, cx, cy, col);
}
function whipSmear(k, dir = 1, cols = ['#2E3168', '#4A4F92', '#43365E']) {
  if (k <= .01) return;
  boilSeed('smear');
  for (let i = 0; i < 16; i++) {
    const y = -40 + i * (H + 80) / 16, hh = (H + 80) / 16 + 30;
    paint(rectPts(-100, y, W + 200, hh, 10), { wash: cols[i % cols.length], washOp: 255 * clamp(k * 1.6 - hash(i) * .5), ink: null });
    if (k > .4) inkLine([[-50, y + hh * .5], [W + 50, y + hh * .5 + jit(10)]], 1.2, mixCol(cols[(i + 1) % cols.length], PAL.cream, .3), 'dry', 0);
  }
}
// An old TV switching off: the picture squeezes to a bright line at y, the line to a dot at (x, y), the dot fades.
// k 0..1. The same dot opens the film, so it loops.
function crtOff(k, x, y) {
  if (k <= 0) return;
  const bandH = H * (1 - easeIn(clamp(k / .45))), lineW = W * (1 - ease(clamp((k - .45) / .3))) + 14, dotA = 1 - clamp((k - .8) / .2);
  boilSeed('crt');
  const top = y - bandH / 2, bot = y + bandH / 2;
  paint(rectPts(-60, -60, W + 120, top + 60), { wash: WB.ink, ink: null });
  paint(rectPts(-60, bot, W + 120, H - bot + 60), { wash: WB.ink, ink: null });
  if (k > .45) {
    paint(rectPts(-60, top - 2, x - lineW / 2 + 60, bandH + 4), { wash: WB.ink, ink: null });
    paint(rectPts(x + lineW / 2, top - 2, W - x - lineW / 2 + 60, bandH + 4), { wash: WB.ink, ink: null });
  }
  if (bandH < 60) {
    const w = Math.max(10, lineW), h = Math.max(8, bandH);
    glow(x, y, 60 + w * .15, '#9CF0A0', .9 * dotA);
    paint(ellPts(x, y, w / 2, h / 2 + 2, 20), { wash: '#DFFFE0', washOp: 255 * dotA, ink: null });
  }
}

// Props sheet: studio.html?loop=wifiprops
(() => {
  LOOPS.wifiprops = t => {
    camBegin(LOOPS.wifiprops.cx || W / 2, 1100, LOOPS.wifiprops.z || 1);
    room(t, {});
    stool(STAGE.rX, STAGE.rY, 150);
    const pulled = t % 2 > 1;
    router(STAGE.rX, STAGE.rY, STAGE.rS, { heat: frac(t / 2), tipL: pulled ? [380, 1150] : null, tipR: pulled ? [720, 1180] : null });
    wifiArcs(STAGE.rX, STAGE.rY - 130, 150, { bars: 3 * frac(t / 2) + .2, lean: .5 * Math.sin(t * 2) });
    hologram(STAGE.holoX, STAGE.holoY, STAGE.holoW, STAGE.holoH, t, { frozen: t % 4 > 2 ? 1 : 0, aim: Math.sin(t * 2) });
    tv(STAGE.tvX, STAGE.tvY, STAGE.tvW, STAGE.tvH, t, { frozen: t % 4 > 2 ? 1 : 0 });
    const cp = [routerPort(STAGE.rX, STAGE.rY, STAGE.rS), [620, 1250], [612, STAGE.runY], [1330, STAGE.runY], [1400, 1120], [STAGE.sockX, STAGE.sockY - 20]];
    cord(cp, { clips: STAGE.clips.map(x => [x, STAGE.runY]) });
    plug(1600, 1250, 50, .2 * Math.sin(t * 3));
    modakPlate(STAGE.plateX, STAGE.plateY, 70, 5);
    kartikeya(STAGE.kX, STAGE.kY, STAGE.kU, { ...feel('excited', t), ...KAR_SKIN, head: (u, sw) => vrHeadset(u, sw, { up: t % 4 > 2 ? 1 : 0, frozen: t % 4 > 1 }) });
    glareBolt([200, 1250], [800, 1250], frac(t));
    sparks(STAGE.rX, STAGE.rY - 60, 90, 1, 'x');
    camEnd();
  };
  LOOPS.wifiprops.len = 4;
})();
