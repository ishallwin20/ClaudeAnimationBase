// k15_props.js: the set and props for "We hit 15,000. So the cast threw a PARTY." (src/scenes/k15.js). Loaded before
// it; everything here is a pure function of its arguments (and T for boil).
//
//   TK, vanishPuff, sparkleBurst, whipH, whipV, impact, bubble      copied from ad 18
//   KP                                       the palette of this reel (the brand peach and teal, marigold)
//   HALL                                     the hall's layout: the table, the cake spot, the lamp, the floor
//   hallSet(t, o)                            the party hall (world): walls, dado, swags, bunting, string lights, door
//   veil(k, col, key)                        a full-frame wash (the dark; the red glare), world space under a camera
//   lantern(x, y, r, t, o)                   the big round paper lamp (o.on 0..1, o.s scale, o.cord)
//   table(x, y, w, o)                        the long party table, top centre at (x, y); o.rot, o.h (cloth drop)
//   cake(x, y, s, t, o)                      the three-tier cake on its tray; o.cut 0..1 (sliced), o.splat 0..1,
//                                            o.topper, o.candles, o.cut 0..1 (sliced)
//   topper15K(x, y, s, rot, key)             the gold "15K" cake topper, painted strokes (bottom centre at (x, y))
//   splat(x, y, r, key, col)                 a frosting splat with drips
//   goat(x, y, u, o)                         a goat (the donkey rig in white, with horns and a goatee) in Nandi's cloth
//   shivaFoot(x, y, s, o)                    Shiva's big blue foot coming down from above, big toe at (x, y)
//   ringBox(x, y, s, open, key)              a red ring box; giftBox(x, y, s, open, t, key) the teal gift
//   selfCam(x, y, s, t, o)                   the self-timer camera on its tripod
//   k15Card(t, C)                            the end card: the 15K Family Deal
const TK = {
  ink: '#2B2233', cream: '#FFF5E2',
  petal: '#F4A6B8', petalDk: '#E0708C', marigold: '#F39A2E', yellow: '#FFD45A', leaf: '#5E9A6A',
  gold: '#EDB43C', goldLt: '#FFE39A', goldDk: '#B67D1C',
  rkOrange: '#F15A24', peach: '#FBE0CF', peachLt: '#FFF1E6', brown: '#3A2418', grey: '#6B5A50', teal: '#2E5F5A',
};
const KP = {
  ink: '#2E2226', tag: '#FFF5E2',
  wall: '#FBE0CF', wallLt: '#FFF0E4', wallDk: '#F2C9B0', dado: '#2E5F5A', dadoLt: '#4A8079', dadoDk: '#1F4540',
  floor: '#D9A26A', floorDk: '#B8804A', floorLt: '#E8BC88', door: '#8A5A3A', doorDk: '#5E3A22', doorIn: '#3A2A3A',
  marigold: '#F39A2E', marigoldDk: '#D4701A', orange: '#F15A24', leaf: '#5E9A6A', bulb: '#FFE6A0',
  paper: '#FFB648', paperDk: '#E0862A', paperLt: '#FFE0A0',
  cloth: '#2E5F5A', clothDk: '#1F4540', clothLt: '#4A8079', border: '#EDB43C',
  sponge: '#E8B87A', spongeDk: '#C8925A', icing: '#FFF3F0', icingDk: '#F2D2D2', pink: '#F4A6B8', pinkDk: '#E0708C',
  tray: '#E0A53A', trayDk: '#A87420', candle: '#7EC8E8', candle2: '#F4A6B8', flame: '#FFB23A', flameLt: '#FFF0B0',
  gold: '#F5C542', goldDk: '#B67D1C', goldLt: '#FFE8A0',
  dark: '#141026', red: '#C8263A',
  goat: '#F2EEE6', goatDk: '#CFC6B8', horn: '#8A7A66',
  box: '#2E8A80', boxDk: '#1F5E58', ribbon: '#F15A24', ribbonDk: '#B8401A', velvet: '#C8263A', velvetDk: '#8A1428',
  cam: '#3A3440', camLt: '#5E5866', lens: '#7EC8E8',
};
const HALL = { TX: 470, TY: 1250, TW: 520, FY: 1500, CX: 430, LAMP: [470, 600] };

// ---------- copied from ad 18 ----------
function vanishPuff(x, y, s, age, key = 'puff', cols = ['#FFF3D6', '#FFE08A']) {
  if (age < 0 || age > .6) return;
  const k = age / .6; boilSeed(key);
  glow(x, y, s * 1.7 * (1 - k * .4), cols[1], .75 * (1 - k));
  for (let i = 0; i < 9; i++) {
    const a = i / 9 * TAU + hash(i) * .6, d = s * (.15 + .8 * easeOut(k)) * (.7 + .4 * hash(i * 3)), r = s * (.2 + .15 * hash(i * 1.7)) * (1 + .5 * k);
    paint(ellPts(x + Math.cos(a) * d, y + Math.sin(a) * d * .8 - k * s * .35, r, r * .9, 10, 1), { wash: cols[i % 2], washOp: 235 * (1 - k * k), ink: null });
  }
}
function sparkleBurst(x, y, s, age, key = 'burst', n = 8, cols = [TK.cream, TK.goldLt]) {
  if (age < 0 || age > .8) return;
  const k = age / .8; boilSeed(key);
  glow(x, y, s * (1 + k), cols[1], .6 * (1 - k));
  for (let i = 0; i < n; i++) { const a = i / n * TAU + hash(i) * .5, d = s * (.3 + 1.1 * easeOut(k)) * (.7 + .5 * hash(i * 2.1)); paint(starPts(x + Math.cos(a) * d, y + Math.sin(a) * d - k * s * .2, s * .22 * (1 - k * .8) * (.6 + hash(i * 5)), .3, 4), { wash: cols[i % 2], ink: null }); }
}
function whipH(k, dir = 1, t = 0, cols = [TK.cream, '#C9CCF2']) {
  if (k <= .02) return;
  boilSeed('whiph');
  for (let i = 0; i < 18; i++) {
    const y = 240 + hash(i * 2.7) * (H - 480), l = 500 + 900 * hash(i * 5.3), x = ((hash(i * 9.1) * 2400 - 300 + dir * t * 3800) % (W + l)) - l * .5, w = 5 + 16 * hash(i * 1.3);
    paint(ribbon([[x - l / 2, y], [x, y + 3], [x + l / 2, y]], w * .3, w), { wash: i % 3 ? cols[0] : cols[1], washOp: 190 * clamp(k) * (.5 + .5 * hash(i)), ink: null });
  }
  if (k > .6) paint(rectPts(-60, -60, W + 120, H + 120), { wash: cols[0], washOp: 255 * seg(k, .6, 1), ink: null });
}
function whipV(k, dir = -1, t = 0, cols = [TK.cream, '#C9CCF2']) {
  if (k <= .02) return;
  boilSeed('whipv');
  for (let i = 0; i < 16; i++) {
    const x = 60 + hash(i * 2.7) * (W - 120), l = 700 + 1100 * hash(i * 5.3), y = ((hash(i * 9.1) * 3200 + dir * t * 5200) % (H + l) + (H + l)) % (H + l) - l * .5, w = 6 + 18 * hash(i * 1.3);
    paint(ribbon([[x, y - l / 2], [x + 3, y], [x, y + l / 2]], w * .3, w), { wash: i % 3 ? cols[0] : cols[1], washOp: 200 * clamp(k) * (.5 + .5 * hash(i)), ink: null });
  }
  if (k > .6) paint(rectPts(-60, -60, W + 120, H + 120), { wash: cols[0], washOp: 255 * seg(k, .6, 1), ink: null });
}
function impact(x, y, age, s, key = 'imp') {
  if (age < 0 || age > .5) return;
  boilSeed(key);
  if (age < .085) {
    paint(rectPts(-3000, -3000, 8000, 8000), { wash: age < .042 ? '#FFF4DC' : '#1A1430', ink: null });
    for (let i = 0; i < 16; i++) { const a = i / 16 * TAU + hash(i) * .3, r0 = s * .25, r1 = s * (1.6 + 1.2 * hash(i * 3)); paint([[x + Math.cos(a - .05) * r0, y + Math.sin(a - .05) * r0], [x + Math.cos(a) * r1, y + Math.sin(a) * r1], [x + Math.cos(a + .05) * r0, y + Math.sin(a + .05) * r0]], { wash: age < .042 ? '#1A1430' : '#FFF4DC', ink: null }); }
    return;
  }
  const k = (age - .085) / .415;
  glow(x, y, s * (1.2 + k), '#FFD27A', .9 * (1 - k));
  const R = s * (.3 + 1.6 * easeOut(k)), e = ellPts(x, y, R, R * .8, 36, 2);
  inkLine([...e, e[0], e[1]], 14 * (1 - k) + 1, '#F5B83A', 'ink', .5);
  for (let i = 0; i < 10; i++) { const a = i / 10 * TAU + hash(i * 2) * .5, d = s * (.4 + 1.5 * easeOut(k)) * (.6 + .5 * hash(i)); paint(starPts(x + Math.cos(a) * d, y + Math.sin(a) * d, s * .14 * (1 - k), .3, 4), { wash: i % 2 ? '#FFE08A' : '#FFF4DC', ink: null }); }
}
// a speech bubble with a word, world px; o: tail [x, y], col, life
function bubble(txt, x, y, size, age, o = {}) {
  if (age < 0 || age > (o.life ?? 9)) return;
  const k = backOut(clamp(age * 5)), w = Math.max(size * 1.6, txt.length * size * .62) + size * .6, h = size * 1.5, a = 1 - seg(age, (o.life ?? 9) - .2, o.life ?? 9);
  if (a <= 0) return;
  boilSeed('bub ' + txt + x);
  push(); translate(x, y); scale(k);
  if (o.tail) paint([[-size * .3, h * .3], [size * .3, h * .3], [o.tail[0] - x, o.tail[1] - y]], { wash: o.col || KP.tag, ink: KP.ink, sw: .9 });
  paint(rrPts(-w / 2, -h / 2, w, h, h / 2), { wash: o.col || KP.tag, ink: KP.ink, sw: 1.1 });
  pop();
  letter(txt, x, y + size * .05, size * k, o.ink || KP.ink, { font: `700 ${size * k}px Poppins`, ink: false, alpha: a, rot: o.rot ?? 0 });
}

// ---------- the hall ----------
// a hanging swag of marigolds from p0 to p1, sagging by sag px
function swag(p0, p1, sag, key, r = 13) {
  boilSeed('swag ' + key);
  const n = Math.max(6, Math.round(Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) / (r * 1.5)));
  for (let i = 0; i <= n; i++) {
    const k = i / n, x = lerp(p0[0], p1[0], k), y = lerp(p0[1], p1[1], k) + sag * 4 * k * (1 - k);
    paint(ellPts(x, y, r, r * .92, 9, 1), { wash: i % 4 === 2 ? KP.orange : KP.marigold, ink: KP.ink, sw: .45 });
  }
  for (const p of [p0, p1]) for (let j = 0; j < 4; j++) paint(ellPts(p[0], p[1] + r * 1.6 * (j + 1), r * .85, r * .8, 9, 1), { wash: j % 2 ? KP.orange : KP.marigold, ink: KP.ink, sw: .45 });
}
function hallSet(t, o = {}) {
  boilSeed('wall');
  paint(rectPts(-600, -400, 2280, 1660), { wash: KP.wall, fill: KP.wallDk, fillOp: 50, bleed: .2, tex: .5, ink: null });
  // a soft paisley-dot wallpaper
  boilSeed('dots');
  for (let i = 0; i < 46; i++) { const x = -500 + (i % 9) * 240 + (Math.floor(i / 9) % 2) * 120, y = 160 + Math.floor(i / 9) * 210; paint(ellPts(x, y, 9, 9, 8), { wash: KP.wallDk, ink: null }); }
  // the dado and its rail
  boilSeed('dado');
  paint(rectPts(-600, 1180, 2280, 330), { wash: KP.dado, fill: KP.dadoDk, fillOp: 70, tex: .5, ink: null });
  paint(rectPts(-600, 1168, 2280, 22), { wash: KP.border, ink: null });
  for (let i = 0; i < 12; i++) paint(rrPts(-560 + i * 200, 1230, 150, 220, 12), { wash: KP.dadoLt, washOp: 120, ink: null });
  // the door (stage left)
  boilSeed('door');
  paint(rrPts(-330, 760, 300, 740, 140), { wash: KP.doorIn, ink: KP.ink, sw: 1.2 });
  inkLine([[-345, 1500], [-345, 900], [-180, 745], [-15, 900], [-15, 1500]], 3, KP.marigold, 'ink', .6);
  // the floor
  boilSeed('floor');
  paint(rectPts(-600, 1500, 2280, 700), { wash: KP.floor, fill: KP.floorDk, fillOp: 70, tex: .6, ink: null });
  inkLine([[-600, 1500], [1680, 1500]], 2.5, KP.floorDk, 'ink', 0);
  for (let i = 0; i < 9; i++) inkLine([[-600, 1560 + i * 70], [1680, 1560 + i * 70]], 1, KP.floorDk, 'inkfine', 0);
  // string lights
  boilSeed('lights');
  const LP = [];
  for (let i = 0; i <= 26; i++) { const k = i / 26, x = lerp(-560, 1640, k); LP.push([x, 330 + 120 * Math.abs(Math.sin(k * Math.PI * 3))]); }
  inkLine(LP, 1.4, KP.ink, 'inkfine', .5);
  // marigold swags and bunting
  swag([-560, 260], [60, 260], 170, 'a'); swag([60, 260], [880, 260], 200, 'b'); swag([880, 260], [1640, 260], 170, 'c');
  boilSeed('bunting');
  const BC = [KP.orange, KP.dado, KP.tag, KP.marigold];
  for (let i = 0; i < 22; i++) { const x = -540 + i * 104, y = 440 + 50 * Math.sin(i * .9); paint([[x - 42, y], [x + 42, y + 6], [x + 2, y + 78]], { wash: BC[i % 4], ink: KP.ink, sw: .6 }); }
  if (!o.dark) for (let i = 0; i < LP.length; i += 2) glow(LP[i][0], LP[i][1] + 10, 46, KP.bulb, .45 + .25 * Math.sin(t * 3 + i));
  boilSeed('bulbs');
  for (let i = 0; i < LP.length; i += 2) paint(ellPts(LP[i][0], LP[i][1] + 10, 9, 12, 8), { wash: o.dark ? '#6A5A4A' : KP.bulb, ink: KP.ink, sw: .5 });
}
// a full-frame wash (world space: a big rect around the camera's view); col, k 0..1
function veil(k, col = KP.dark, key = 'veil', op = 225) {
  if (k <= 0) return;
  boilSeed(key);
  paint(rectPts(-900, -600, 2900, 3200), { wash: col, washOp: op * clamp(k), ink: null });
}

// the big round paper lamp: (x, y) its centre, r its radius; o.on 0..1 (lit), o.cord (draw the hanging cord), o.rot
function lantern(x, y, r, t, o = {}) {
  const on = o.on ?? 1;
  if (o.cord !== false) { boilSeed('lampcord'); inkLine([[x, -200], [x, y - r]], 2, KP.ink, 'ink', 0); }
  if (on > 0) { glow(x, y, r * 3.2, KP.paperLt, .55 * on); glow(x, y, r * 1.6, '#FFF6D6', .5 * on); }
  boilSeed('lamp');
  push(); translate(x, y); rotate(o.rot || 0);
  paint(ellPts(0, 0, r, r * .92, 30), { wash: on > .5 ? KP.paperLt : KP.paper, fill: KP.paperDk, fillOp: 60 * (1 - on * .6), tex: .4, ink: KP.ink, sw: 1.2 });
  for (const k of [-.66, -.33, 0, .33, .66]) inkLine(Array.from({ length: 9 }, (_, i) => { const a = -Math.PI / 2 + i / 8 * Math.PI; return [k * r * Math.cos(a) * 1.0 + 0, r * .92 * Math.sin(a)]; }).map(([a, b]) => [a + 0, b]), .9, KP.paperDk, 'inkfine', .5);
  paint(rrPts(-r * .3, -r * 1.02, r * .6, r * .16, 4), { wash: KP.dado, ink: KP.ink, sw: .8 });
  paint(rrPts(-r * .3, r * .86, r * .6, r * .16, 4), { wash: KP.dado, ink: KP.ink, sw: .8 });
  pop();
}

// the long party table: top centre (x, y), width w; o.rot (radians, about the top centre), o.h (cloth drop, default to
// the floor), o.key
function table(x, y, w, o = {}) {
  const h = o.h ?? (HALL.FY - y), key = o.key || 'table';
  push(); translate(x, y); rotate(o.rot || 0);
  boilSeed(key + 'legs');
  if (o.legs) for (const s of [-1, 1]) paint(rectPts(s * w * .42 - 9, 0, 18, h), { wash: KP.door, ink: KP.ink, sw: .8 });
  boilSeed(key);
  const ch = o.legs ? h * .45 : h;
  paint([[-w / 2 - 14, -6], [w / 2 + 14, -6], [w / 2 + 22, ch], [-w / 2 - 22, ch]], { wash: KP.cloth, fill: KP.clothDk, fillOp: 70, tex: .5, ink: KP.ink, sw: 1.1 });
  paint([[-w / 2 - 20, ch - 34], [w / 2 + 20, ch - 34], [w / 2 + 22, ch], [-w / 2 - 22, ch]], { wash: KP.border, ink: KP.ink, sw: .8 });
  for (let i = 0; i < 7; i++) inkLine([[-w / 2 + (i + .5) * w / 7, 10], [-w / 2 + (i + .5) * w / 7 + (i - 3) * 2, ch - 40]], 1, KP.clothDk, 'inkfine', .3);
  paint(rrPts(-w / 2 - 16, -14, w + 32, 22, 8), { wash: KP.clothLt, ink: KP.ink, sw: 1 });
  pop();
}

// the gold "15K" topper, painted ribbons: bottom centre (x, y), s = letter height in px
function topper15K(x, y, s, rot = 0, key = 'topper') {
  boilSeed(key);
  push(); translate(x, y); rotate(rot);
  const w = s * .5, gap = s * .18, xs = [-w * 1.5 - gap, -w * .5, w * .5 + gap], sw = clamp(s / 60, .5, 1.4);
  for (const px of [-w * .8, w * .8]) paint(rectPts(px - s * .025, -s * .05, s * .05, s * .5), { wash: KP.goldDk, ink: KP.ink, sw: sw * .5 });
  const G = [
    [[xs[0] + w * .05, -s * .72], [xs[0] + w * .5, -s * .98], [xs[0] + w * .5, -s * .02]],
    [[xs[1] + w * .95, -s * .98], [xs[1] + w * .15, -s * .98], [xs[1] + w * .1, -s * .55], [xs[1] + w * .65, -s * .62], [xs[1] + w * 1.0, -s * .3], [xs[1] + w * .6, -s * .02], [xs[1] + w * .02, -s * .1]],
    [[xs[2] + w * .15, -s * .98], [xs[2] + w * .15, -s * .02]],
    [[xs[2] + w * .98, -s * .98], [xs[2] + w * .25, -s * .48], [xs[2] + w * .98, -s * .02]],
  ];
  for (const P of G) paint(ribbon(P.length > 3 ? through(P) : P, s * .2, s * .2), { wash: KP.gold, fill: KP.goldDk, fillOp: 40, tex: .3, ink: KP.ink, sw, curv: .2 });
  paint(starPts(xs[2] + w * 1.15, -s * 1.05, s * .14, .35, 4), { wash: KP.goldLt, ink: null });
  pop();
}

// a frosting splat: (x, y) its centre, r its size; drips down
function splat(x, y, r, key = 'splat', col = KP.pink, k = 1) {
  if (k <= 0) return;
  boilSeed('splat ' + key);
  const R = r * easeOut(clamp(k)), P = [];
  for (let i = 0; i < 14; i++) { const a = i / 14 * TAU, d = R * (.7 + .5 * hash(i * 3.3 + r)); P.push([x + Math.cos(a) * d, y + Math.sin(a) * d * .8]); }
  paint(P, { wash: col, ink: KP.ink, sw: .7, curv: .6 });
  for (let i = 0; i < 2; i++) { const dx = (hash(i * 7 + r) - .5) * R, L = R * (.5 + .7 * hash(i * 5 + r)) * clamp(k * 1.5 - .3); if (L > 2) paint(ribbon([[x + dx, y], [x + dx, y + R * .5 + L]], R * .22, R * .16), { wash: col, ink: KP.ink, sw: .5 }); }
  paint(ellPts(x - R * .25, y - R * .25, R * .18, R * .12, 8), { wash: '#FFFFFF', washOp: 200, ink: null });
}

// the three-tier cake: (x, y) the bottom centre (on the tray), s scale (s 1: the bottom tier is 240 px wide, the cake
// 230 px tall); o.cut 0..1 (Kali's one swing: clean cuts through every tier, the slices ease apart), o.splat 0..1 (flattened),
// o.topper (default true), o.candles (default true), o.candleGlow 0..1, o.noTray
function cake(x, y, s, t, o = {}) {
  const sp = clamp(o.splat || 0), key = o.key || 'cake';
  const tiers = [[240, 92, KP.icing, KP.pink], [180, 78, KP.pink, KP.icing], [124, 66, KP.icing, KP.pink]];
  if (!o.noTray) { boilSeed(key + 'tray'); paint(ellPts(x, y + 4 * s, 150 * s * (1 + sp * .6), 16 * s, 24), { wash: KP.tray, fill: KP.trayDk, fillOp: 60, tex: .4, ink: KP.ink, sw: 1 }); }
  let top = y;
  tiers.forEach(([w, h, col, drip], i) => {
    const W2 = w * s * (1 + sp * (.9 - i * .15)) / 2, Hh = h * s * (1 - sp * .78), y0 = top;
    boilSeed(key + 'tier' + i);
    paint([[x - W2, y0], [x + W2, y0], [x + W2, y0 - Hh], [x - W2, y0 - Hh]], { wash: col, fill: KP.icingDk, fillOp: 40, tex: .3, ink: KP.ink, sw: 1.1 });
    // the drips round the top edge
    const P = [[x - W2, y0 - Hh]];
    for (let k = 0; k <= 8; k++) { const xx = x - W2 + k / 8 * 2 * W2, d = (k % 2 ? .5 : .22 + .2 * hash(k + i * 9)) * Hh; P.push([xx, y0 - Hh + d]); }
    P.push([x + W2, y0 - Hh - 6 * s]); P.push([x - W2, y0 - Hh - 6 * s]);
    paint(P, { wash: drip, ink: KP.ink, sw: .8, curv: .5 });
    // little piped dots along the base
    for (let k = 0; k < 7; k++) paint(ellPts(x - W2 + (k + .5) / 7 * 2 * W2, y0 - 6 * s, 7 * s, 6 * s, 8), { wash: KP.tag, ink: KP.ink, sw: .4 });
    if (o.cut > 0 && sp < .5) {   // the cuts: thin sponge-coloured gaps that open as the slices ease apart
      const g = 1 + 3 * clamp(o.cut) * s;
      for (const cx of [-.55, -.18, .2, .58]) {
        const xx = x + cx * W2;
        paint([[xx - g, y0], [xx + g, y0], [xx + g * .6, y0 - Hh - 4 * s], [xx - g * .6, y0 - Hh - 4 * s]], { wash: KP.sponge, ink: KP.spongeDk, sw: .5 });
      }
    }
    top = y0 - Hh;
  });
  if (o.candles !== false && sp < .5) {
    boilSeed(key + 'candles');
    for (let k = 0; k < 5; k++) {
      const cx = x + (k - 2) * 22 * s, ch = 34 * s;
      paint(rectPts(cx - 4 * s, top - ch, 8 * s, ch), { wash: k % 2 ? KP.candle2 : KP.candle, ink: KP.ink, sw: .5 });
      const fl = Math.sin(t * 13 + k * 2) * 2 * s;
      if (o.candleGlow > 0) glow(cx, top - ch - 10 * s, 40 * s, KP.flame, .55 * o.candleGlow);
      paint([[cx, top - ch - 18 * s - fl], [cx + 5 * s, top - ch - 6 * s], [cx, top - ch - 1 * s], [cx - 5 * s, top - ch - 6 * s]], { wash: KP.flame, ink: null, curv: .6 });
      paint([[cx, top - ch - 12 * s - fl], [cx + 2.5 * s, top - ch - 5 * s], [cx, top - ch - 2 * s], [cx - 2.5 * s, top - ch - 5 * s]], { wash: KP.flameLt, ink: null, curv: .6 });
    }
  }
  if (o.topper !== false) topper15K(x + (o.topDx || 0), top - 40 * s + (o.topDy || 0), 62 * s, o.topRot || 0, key + 'top');
  return top;
}

// a goat in side view (facing right; flip faces left), Nandi's red cloth and garland on it: (x, y) the ground under its
// middle, u its size unit (about 12u nose to tail, 10u to the horn tips). o: walk (phase), nod (radians, + head down),
// rot (spins it about its middle, for flying), eyes ('normal' | 'happy' | 'wide'), grin, chinUp, boilKey
function goat(x, y, u, o = {}) {
  const key = o.boilKey || 'goat', f = o.flip ? -1 : 1, wk = o.walk ?? null, C = KP;
  boilSeed(key + 'sh'); if (!o.rot) paint(ellPts(x, y + 2, 5 * u, .7 * u, 16), { wash: '#B8804A', washOp: 110, ink: null });
  push(); translate(x, y - 5 * u); rotate((o.rot || 0) * f); scale(f, 1); translate(0, 5 * u);
  const bob = wk != null ? Math.abs(Math.sin(wk)) * -.3 * u : 0;
  translate(0, bob);
  // legs: thin, with dark hooves; diagonal pairs swing
  boilSeed(key + 'legs');
  [[-3.2, 0, 1], [2.6, Math.PI, 1], [-2.6, Math.PI, 0], [3.2, 0, 0]].forEach(([lx, ph, near]) => {
    const sw = wk != null ? Math.sin(wk + ph) * .9 : 0;
    const top = [lx * u, -4 * u], foot = [(lx + sw) * u, -.1 * u];
    paint(ribbon([top, [lerp(top[0], foot[0], .5) + .2 * u, -2 * u], foot], .55 * u, .4 * u), { wash: near ? C.goat : C.goatDk, ink: C.ink, sw: .8 });
    paint(ellPts(foot[0], foot[1], .32 * u, .22 * u, 8), { wash: '#4A3A3A', ink: C.ink, sw: .5 });
  });
  // the body, with a little up-flicked tail
  boilSeed(key + 'body');
  paint([[3.8 * u, -6.4 * u], [-3.4 * u, -6.8 * u], [-4.6 * u, -5.6 * u], [-4.2 * u, -3.6 * u], [-2 * u, -3.0 * u], [2.4 * u, -3.0 * u], [4.4 * u, -3.8 * u], [4.6 * u, -5.6 * u]], { wash: C.goat, fill: C.goatDk, fillOp: 50, tex: .4, ink: C.ink, sw: 1, curv: .6 });
  paint([[-4.2 * u, -6.3 * u], [-5.4 * u, -7.6 * u + Math.sin(T * 9) * .2 * u], [-4.8 * u, -6.0 * u]], { wash: C.goat, ink: C.ink, sw: .7, curv: .3 });
  // Nandi's red saddle cloth with a gold border
  paint([[-2.4 * u, -6.9 * u], [1.8 * u, -6.7 * u], [2.0 * u, -4.2 * u], [-2.6 * u, -4.4 * u]], { wash: '#C8263A', ink: C.ink, sw: .8, curv: .2 });
  inkLine([[-2.6 * u, -4.5 * u], [2.0 * u, -4.3 * u]], 1.6, C.gold, 'ink', .2);
  paint(starPts(-.3 * u, -5.6 * u, .55 * u, .45, 4), { wash: C.gold, ink: null });
  // the head: on a neck, nodding about the neck
  push(); translate(3.9 * u, -6.0 * u); rotate((o.nod || 0) - (o.chinUp ? .25 : 0));
  boilSeed(key + 'head');
  paint([[-.6 * u, .2 * u], [.6 * u, -2.0 * u], [1.8 * u, -2.4 * u], [3.0 * u, -1.6 * u], [3.3 * u, -.8 * u], [2.6 * u, -.2 * u], [1.3 * u, .2 * u], [.6 * u, 1.4 * u]], { wash: C.goat, fill: C.goatDk, fillOp: 40, tex: .3, ink: C.ink, sw: 1, curv: .5 });
  // horns curving back, a floppy ear, the goatee
  paint(ribbon([[1.0 * u, -2.2 * u], [.5 * u, -3.6 * u], [-.6 * u, -4.1 * u]], .55 * u, .12 * u), { wash: C.horn, ink: C.ink, sw: .8 });
  paint(ribbon([[1.4 * u, -2.3 * u], [1.1 * u, -3.5 * u], [.2 * u, -3.9 * u]], .5 * u, .1 * u), { wash: C.horn, ink: C.ink, sw: .7 });
  paint([[.8 * u, -1.6 * u], [-.4 * u, -1.0 * u + Math.sin(T * 5) * .15 * u], [-.6 * u, -.6 * u], [.6 * u, -1.0 * u]], { wash: C.goatDk, ink: C.ink, sw: .7, curv: .5 });
  paint([[2.3 * u, -.3 * u], [3.0 * u, -.4 * u], [2.6 * u, 1.3 * u + Math.sin(T * 6) * .1 * u]], { wash: C.goatDk, ink: C.ink, sw: .7, curv: .3 });
  // eye, nostril, mouth
  const ey = [1.85 * u, -1.6 * u];
  if (o.eyes === 'happy') inkLine([[ey[0] - .3 * u, ey[1] + .05 * u], [ey[0], ey[1] - .2 * u], [ey[0] + .3 * u, ey[1] + .05 * u]], 1.2, C.ink, 'ink', .5);
  else { const r = o.eyes === 'wide' ? .42 : .3; paint(ellPts(ey[0], ey[1], r * u, r * u, 10), { wash: '#FFFDF6', ink: C.ink, sw: .7 }); paint([[ey[0] - .25 * u, ey[1]], [ey[0] + .25 * u, ey[1]], [ey[0] + .25 * u, ey[1] + .12 * u], [ey[0] - .25 * u, ey[1] + .12 * u]], { wash: C.ink, ink: null }); }
  paint(ellPts(3.0 * u, -1.1 * u, .1 * u, .14 * u, 6), { wash: C.ink, ink: null });
  inkLine([[2.6 * u, -.45 * u], [2.95 * u, -.55 * u + (o.grin || 0) * -.15 * u], [3.2 * u, -.75 * u]], .9, C.ink, 'inkfine', .5);
  pop();
  // the marigold garland round the neck
  boilSeed(key + 'garland');
  for (let k = 0; k < 7; k++) { const a = k / 6; paint(ellPts((3.4 + Math.sin(a * Math.PI) * .8) * u, (-7.0 + a * 2.8) * u, .38 * u, .36 * u, 8), { wash: k % 2 ? C.orange : C.marigold, ink: C.ink, sw: .4 }); }
  pop();
}
// the goat's head, world point (for a bubble)
function goatHead(x, y, u, o = {}) { return [x + (o.flip ? -1 : 1) * 6 * u, y - 7.5 * u]; }

// Shiva's foot from above: the big toe at (x, y), s its size (the sole about 2.6s long), the shin up out of frame; an
// anklet of rudraksha and a silver bell
function shivaFoot(x, y, s, o = {}) {
  boilSeed('sfoot');
  const C = SHV;
  paint(ribbon([[x - .5 * s, y - 1.1 * s], [x - .6 * s, y - 6 * s], [x - .55 * s, y - 14 * s]], 1.15 * s, 1.35 * s), { wash: C.skin, fill: C.skinDk, fillOp: 50, tex: .3, ink: C.ink, sw: 1.4 });
  // the foot: heel to screen-left, toes down to the right
  paint([[x - 1.6 * s, y - 1.6 * s], [x - 1.7 * s, y - .5 * s], [x - 1.2 * s, y + .05 * s], [x + .2 * s, y + .1 * s], [x + .55 * s, y - .2 * s], [x + .45 * s, y - .8 * s], [x - .2 * s, y - 1.4 * s], [x - .6 * s, y - 1.9 * s]], { wash: C.skin, fill: C.skinDk, fillOp: 50, tex: .3, ink: C.ink, sw: 1.4, curv: .5 });
  for (let k = 0; k < 4; k++) paint(ellPts(x + (.25 - k * .3) * s, y - .05 * s + k * .02 * s, .2 * s, .16 * s, 10), { wash: C.skin, ink: C.ink, sw: .8 });
  paint(ellPts(x + .32 * s, y - .02 * s, .26 * s, .2 * s, 10), { wash: C.skinLt, ink: C.ink, sw: .9 });   // the big toe
  inkLine([[x + .22 * s, y - .05 * s], [x + .42 * s, y - .05 * s]], .8, C.ink, 'inkfine', .3);
  // the anklet
  for (let k = 0; k < 7; k++) paint(ellPts(x - (1.55 - k * .17) * s, y - (1.9 + Math.sin(k / 6 * Math.PI) * .12) * s, .13 * s, .13 * s, 8), { wash: C.bead, ink: C.ink, sw: .5 });
  paint(ellPts(x - .9 * s, y - 1.6 * s, .17 * s, .19 * s, 10), { wash: '#E8E4F0', ink: C.ink, sw: .6 });
  if (o.ash) for (let k = 0; k < 3; k++) inkLine([[x - .85 * s, y - (4 + k * .35) * s], [x - .25 * s, y - (4 + k * .35) * s]], 2, C.ash, 'ink', 0);
}

// a red ring box, (x, y) its bottom centre, s its width; open 0..1 (the lid swings up, the ring sparkles)
function ringBox(x, y, s, open, key = 'ring') {
  boilSeed(key);
  paint(rrPts(x - s / 2, y - s * .55, s, s * .55, s * .1), { wash: KP.velvet, fill: KP.velvetDk, fillOp: 70, tex: .4, ink: KP.ink, sw: .9 });
  const a = -2.0 * clamp(open);
  push(); translate(x - s / 2, y - s * .55); rotate(a);
  paint(rrPts(0, -s * .3, s, s * .3, s * .1), { wash: KP.velvet, ink: KP.ink, sw: .9 });
  pop();
  if (open > .3) {
    paint(ellPts(x, y - s * .7, s * .24, s * .2, 14), { wash: null, ink: KP.gold, sw: 3 });
    inkLine(ellPts(x, y - s * .7, s * .24, s * .2, 14).concat([[x + s * .24, y - s * .7]]), 3, KP.gold, 'ink', .5);
    paint(starPts(x, y - s * .92, s * .14, .35, 4), { wash: '#EAF6FF', ink: KP.ink, sw: .5 });
    glow(x, y - s * .9, s * .8, '#FFFFFF', .5 * clamp(open));
  }
}

// the teal gift box: (x, y) its bottom centre, s its width; open 0..1 (the lid pops off up and to the left)
function giftBox(x, y, s, open, t, key = 'gift') {
  const o = clamp(open);
  if (o > 0) glow(x, y - s * .9, s * (1 + o), KP.goldLt, .7 * o);
  boilSeed(key);
  paint(rrPts(x - s / 2, y - s * .8, s, s * .8, 8), { wash: KP.box, fill: KP.boxDk, fillOp: 60, tex: .4, ink: KP.ink, sw: 1.1 });
  paint(rectPts(x - s * .08, y - s * .8, s * .16, s * .8), { wash: KP.ribbon, ink: KP.ink, sw: .7 });
  const lx = x - o * s * .9, ly = y - s * .8 - o * s * 1.1, rot = -o * .9;
  push(); translate(lx, ly); rotate(rot);
  paint(rrPts(-s * .56, -s * .2, s * 1.12, s * .22, 8), { wash: KP.box, ink: KP.ink, sw: 1.1 });
  paint(rectPts(-s * .08, -s * .2, s * .16, s * .22), { wash: KP.ribbon, ink: KP.ink, sw: .7 });
  for (const d of [-1, 1]) paint([[0, -s * .2], [d * s * .34, -s * .46], [d * s * .4, -s * .26], [d * s * .1, -s * .16]], { wash: KP.ribbon, ink: KP.ink, sw: .8, curv: .4 });
  paint(ellPts(0, -s * .22, s * .08, s * .07, 8), { wash: KP.ribbonDk, ink: KP.ink, sw: .6 });
  pop();
}

// the self-timer camera on a tripod: (x, y) the tripod's feet, s its size; o.blink (the red light), o.flash 0..1
function selfCam(x, y, s, t, o = {}) {
  boilSeed('cam');
  for (const d of [-1, 0, 1]) inkLine([[x, y - s * 1.6], [x + d * s * .7, y]], 3, KP.cam, 'ink', 0);
  paint(rrPts(x - s * .6, y - s * 2.2, s * 1.2, s * .7, 8), { wash: KP.cam, ink: KP.ink, sw: 1 });
  paint(rrPts(x - s * .25, y - s * 2.36, s * .4, s * .18, 4), { wash: KP.camLt, ink: KP.ink, sw: .7 });
  paint(ellPts(x + s * .05, y - s * 1.85, s * .25, s * .25, 14), { wash: KP.camLt, ink: KP.ink, sw: .9 });
  paint(ellPts(x + s * .05, y - s * 1.85, s * .15, s * .15, 12), { wash: KP.lens, ink: KP.ink, sw: .6 });
  const b = o.blink ?? 0;
  if (b > 0) glow(x + s * .45, y - s * 2.05, s * .5, '#FF4A3A', .8 * b);
  paint(ellPts(x + s * .45, y - s * 2.05, s * .07, s * .07, 8), { wash: b > .5 ? '#FF6A5A' : '#8A2A2A', ink: null });
}

// ---------- the card ----------
function k15Card(t, C) {
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
  if (t > C.dead) letter('Only till 21 Oct, midnight', X, 1262, 40, TK.teal, { screen: true, font: '700 40px Poppins', ink: false, maxW: 860, pop: pk(C.dead) });
  if (t > C.pill) {
    const k = backOut(clamp(pk(C.pill))) * (1 + .03 * pulse(t, 4));
    boilSeed('pill');
    push(); translate(X, 1350); scale(k); paint(rrPts(-270, -48, 540, 96, 48), { wash: TK.rkOrange, ink: null }); pop();
    letter('Comment FAMILY', X, 1352, 54, TK.cream, { screen: true, font: '700 52px Poppins', ink: false, pop: pk(C.pill) });
  }
  if (t > C.sub) letter("we'll DM you the deal · or tap the link in bio", X, 1428, 31, TK.brown, { screen: true, font: '500 31px Poppins', ink: false, maxW: 860, pop: pk(C.sub) });
  if (t > C.follow) letter('rishikatha.com · Follow @therishikatha', X, 1478, 31, TK.grey, { screen: true, font: '500 31px Poppins', ink: false, maxW: 860, pop: pk(C.follow) });
}
// the strike through ₹500 (screen space; call after flushLetters())
function k15Strike(t, C) {
  if (t < C.strike) return;
  const k = easeOut(seg(t, C.strike, C.strike + .25));
  boilSeed('strike');
  inkLine([[470 - 185, 1196], [lerp(470 - 185, 470 - 55, k), lerp(1196, 1172, k)]], 6, TK.rkOrange, 'ink', 0);
}

// Sher's red union headband (from ad 10): a hat hook for lion()
function lionBand(o = {}) {
  return (u, sw) => {
    const P = pts => U(pts, u), fl = Math.sin(T * 9) * .25 + (o.wind || 0), band = '#D93A3A', dk = '#A82424';
    paint(P([[-2.55, -13.85], [-1.2, -14.4], [1.2, -14.4], [2.55, -13.85], [2.68, -13.35], [1.2, -13.88], [-1.2, -13.88], [-2.68, -13.35]]), { wash: band, ink: KP.ink, sw: sw * .7, curv: .4 });
    inkLine(P([[-2.1, -13.9], [-.6, -14.22], [.8, -14.2]]), sw * .45, dk, 'inkfine', .5);
    paint(P(ribbon([[-2.65, -13.6], [-3.6, -13.9 + fl * .3], [-4.5, -13.3 + fl * .8]], .42, .2)), { wash: band, ink: KP.ink, sw: sw * .6 });
    paint(P(ribbon([[-2.65, -13.5], [-3.5, -13.0 + fl * .2], [-4.2, -12.0 + fl * .6]], .4, .18)), { wash: dk, ink: KP.ink, sw: sw * .6 });
    paint(ellPts(-2.66 * u, -13.6 * u, .3 * u, .3 * u, 8), { wash: dk, ink: KP.ink, sw: sw * .5 });
  };
}
// the candle flames again, bright, over the dark veil: x the cake's centre, top its top tier's top, s its scale
function candleFlames(x, top, s, t, k = 1) {
  boilSeed('flames');
  for (let i = 0; i < 5; i++) {
    const cx = x + (i - 2) * 22 * s, ch = 34 * s, fl = Math.sin(t * 13 + i * 2) * 2 * s;
    glow(cx, top - ch - 10 * s, 70 * s, KP.flame, .7 * k);
    paint([[cx, top - ch - 18 * s - fl], [cx + 5 * s, top - ch - 6 * s], [cx, top - ch - 1 * s], [cx - 5 * s, top - ch - 6 * s]], { wash: KP.flame, ink: null, curv: .6 });
    paint([[cx, top - ch - 12 * s - fl], [cx + 2.5 * s, top - ch - 5 * s], [cx, top - ch - 2 * s], [cx - 2.5 * s, top - ch - 5 * s]], { wash: KP.flameLt, ink: null, curv: .6 });
  }
}
// the khadga's gleam: a bright crescent swept along an arc through P (a point list, world), k 0..1 its progress; it
// fades over age (s since the swing ended)
function slashGleam(P, k, age, key = 'slash') {
  if (k <= 0 || age > .45) return;
  const a = age > 0 ? 1 - age / .45 : 1, n = P.length, j = Math.max(2, Math.round(clamp(k) * n));
  const Q = through(P.slice(0, j));
  glow(Q[Q.length - 1][0], Q[Q.length - 1][1], 120, '#FFF6D6', .8 * a);
  boilSeed(key);
  paint(ribbon(Q, 3, 26), { wash: '#FFF6D6', washOp: 240 * a, ink: null });
  paint(ribbon(Q, 1, 10), { wash: '#FFFFFF', washOp: 255 * a, ink: null });
}
