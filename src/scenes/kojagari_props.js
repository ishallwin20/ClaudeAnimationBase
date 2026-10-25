// kojagari_props.js: the sets and props for "Tonight at MIDNIGHT, Maa Lakshmi asks ONE question" (src/scenes/kojagari.js),
// ad 51, Sharad Purnima / Kojagari. Loaded before it; everything here is a pure function of its arguments (and T for boil).
//
//   KJ, TK                                   the palettes (TK: the brand card colours, as in ad 26)
//   sparkleBurst, veil, diya                 copied from ad 26
//   kjSky(t, o)                              the indigo night, hashed stars, drifting cloud wisps (world space)
//   kjMoon(x, y, r, t, o)                    the full moon of Sharad Purnima; o.kalas 0..16 lights the ring of 16 kalas,
//                                            o.flare 0..1 the midnight flare
//   moonBeam(x0, y0, x1, y1, w, k, key)      a soft beam of moonlight from the moon to a roof
//   moonDust(t, t0, from, to, n, key)        motes of moonlight drifting down into a bowl
//   kheerBowl(x, y, s, key, o)               a brass bowl of kheer (saffron strands, almond slivers), o.shine
//   rooftops(t, o)                           the town's flat roofs under the moon: the back row, the front row, the
//                                            near terrace (its parapet is drawn by nearParapet() over whoever stands on it)
//   houseFront(t, o)                         one long moonlit house wall with two arched windows, their rooms painted by
//                                            o.room1 / o.room2 (window-local), the sills, the street
//   familyBed(x, y, s, t, key)               window 1's room: the whole family asleep under one razai
//   phone(u, sw, on, key)                    a phone held in Aarav's hands (aarav held-hook space)
//   kjCard(t, C)                             the end card: Books 1–3, set of 3 for ₹500
const KJ = {
  ink: '#22203A', sky: '#141B46', skyLt: '#22306E', skyLow: '#2C3C7E', star: '#FFF4D8', cloud: '#3A4A8C',
  moon: '#F6F1DE', moonDk: '#DCD6C0', moonLt: '#FFFBEE', moonGlow: '#BFD0FF', kala: '#FFF0B8',
  wall: '#4E5C94', wallDk: '#3A4678', wallLt: '#6676AE', roof: '#3A4676', roofDk: '#2A345E', roofFar: '#2E3A6A', roofFarDk: '#24305A',
  lime: '#8C9AC8', limeDk: '#6E7CB0', street: '#2A2E52', streetDk: '#20243F',
  room: '#1E1A34', roomLt: '#2C2648', wood: '#7A4A2E', woodDk: '#55301C', woodLt: '#9A6440',
  brass: '#D9A441', brassDk: '#A8741E', brassLt: '#F2CD72', kheer: '#F7EED6', kheerDk: '#E4D2A8', saffron: '#E8902A', almond: '#EADBBE',
  blanket: '#B8475A', blanketDk: '#8E3346', blanket2: '#E0A43C', blanket3: '#3F8A86', pillow: '#E9E2D2', pillowDk: '#C8BFAE',
  hair: '#231A1E', grey: '#B9B4BC', phone: '#2A2A38', screen: '#9FE0FF',
  flame: '#FFD45A', flameIn: '#FFF4C8', flameOut: '#FF8A2A', clay: '#B85A32', clayDk: '#86391E',
  warm: '#FFD27A',
};
const TK = {
  ink: '#2B2233', cream: '#FFF5E2', marigold: '#F39A2E', petal: '#F4A6B8', gold: '#EDB43C', goldLt: '#FFE39A',
  rkOrange: '#F15A24', peach: '#FBE0CF', brown: '#3A2418', grey: '#6B5A50', teal: '#2E5F5A',
};

// ---------- copied from ad 26 ----------
function sparkleBurst(x, y, s, age, key = 'burst', n = 8, cols = [TK.cream, TK.goldLt]) {
  if (age < 0 || age > .8) return;
  const k = age / .8; boilSeed(key);
  glow(x, y, s * (1 + k), cols[1], .6 * (1 - k));
  for (let i = 0; i < n; i++) { const a = i / n * TAU + hash(i) * .5, d = s * (.3 + 1.1 * easeOut(k)) * (.7 + .5 * hash(i * 2.1)); paint(starPts(x + Math.cos(a) * d, y + Math.sin(a) * d - k * s * .2, s * .22 * (1 - k * .8) * (.6 + hash(i * 5)), .3, 4), { wash: cols[i % 2], ink: null }); }
}
function veil(col, a) {
  if (a <= .004) return;
  flushBrush(); const c = color(col);
  push(); resetMatrix(); translate(-W / 2, -H / 2); noStroke(); fill(red(c), green(c), blue(c), 255 * clamp(a)); rect(-4, -4, W + 8, H + 8); pop();
}
// one clay diya at (x, y) (the bowl's base), s = its half-width; lit 0..1
function diya(x, y, s, lit, key) {
  boilSeed('diya ' + key);
  const fl = Math.min(lit, 1);
  if (lit > .02) glow(x + s * .55, y - s * 1.1, s * 3.2, KJ.flameOut, .5 * fl);
  paint([[x - s, y - s * .55], [x + s * .7, y - s * .55], [x + s * 1.25, y - s * .8], [x + s * .9, y - s * .3], [x + s * .5, y], [x - s * .6, y], [x - s * .95, y - s * .25]], { wash: KJ.clay, fill: KJ.clayDk, fillOp: 60, tex: .4, ink: KJ.ink, sw: clamp(s / 14, .5, 1.6), curv: .4 });
  paint(ellPts(x - s * .1, y - s * .55, s * .85, s * .16, 10), { wash: KJ.clayDk, ink: null });
  if (lit > .02) {
    const fx = x + s * .95, fy = y - s * .8, h = s * (1.2 + .25 * Math.sin(T * 17 + x)) * fl, w = s * .42;
    paint([[fx - w, fy], [fx - w * .7, fy - h * .5], [fx + Math.sin(T * 11 + x) * w * .3, fy - h], [fx + w * .7, fy - h * .5], [fx + w, fy], [fx, fy + w * .4]], { wash: KJ.flame, ink: null, curv: .6 });
    paint(ellPts(fx, fy - h * .3, w * .4, h * .3, 8), { wash: KJ.flameIn, ink: null });
  }
}

// ---------- the night ----------
// the sky over world rect [x0, y0, x1, y1]; o.stars (count), o.clouds
function kjSky(t, o = {}) {
  const [x0, y0, x1, y1] = o.rect || [-400, -900, 1500, 2300];
  boilSeed('kj sky');
  paint(rectPts(x0, y0, x1 - x0, y1 - y0), { wash: KJ.sky, ink: null });
  paint(rectPts(x0, lerp(y0, y1, .55), x1 - x0, (y1 - y0) * .45), { fill: KJ.skyLow, fillOp: 120, bleed: .25, tex: .3, ink: null });
  boilSeed('kj stars');
  const n = o.stars ?? 40;
  for (let i = 0; i < n; i++) {
    const x = lerp(x0, x1, hash(i * 3.7)), y = lerp(y0, lerp(y0, y1, .6), hash(i * 5.1)), tw = .55 + .45 * Math.sin(t * (1.5 + hash(i) * 2) + i);
    const r = (3 + 4 * hash(i * 9.3)) * tw;
    if (o.avoid && Math.hypot(x - o.avoid[0], y - o.avoid[1]) < o.avoid[2]) continue;
    paint(starPts(x, y, r, .35, 4), { wash: KJ.star, washOp: 150 + 100 * tw, ink: null });
  }
  if (o.clouds !== false) {
    boilSeed('kj clouds');
    for (let i = 0; i < 4; i++) {
      const cx = lerp(x0 + 100, x1 - 100, hash(i * 2.3)) + ((t * (10 + 6 * hash(i)) + i * 400) % 900) - 450, cy = lerp(y0 + 300, lerp(y0, y1, .45), hash(i * 6.7));
      paint(ellPts(cx, cy, 190 + 90 * hash(i), 26 + 12 * hash(i * 4), 18, 4), { fill: KJ.cloud, fillOp: 110, bleed: .3, tex: .3, ink: null });
    }
  }
}
// the full moon: (x, y) its centre, r its radius. o.kalas 0..16 (the ring of sixteen glints, lit one by one),
// o.flare 0..1 (midnight: it swells with light), o.key
function kjMoon(x, y, r, t, o = {}) {
  const key = o.key || 'm', fl = clamp(o.flare || 0);
  boilSeed('moon glow ' + key);
  glow(x, y, r * (2.6 + fl * 2.2), KJ.moonGlow, .32 + fl * .4);
  glow(x, y, r * (1.5 + fl), KJ.moonLt, .25 + fl * .5);
  boilSeed('moon ' + key);
  paint(ellPts(x, y, r, r, 40, 1.2), { wash: KJ.moon, ink: KJ.moonDk, sw: clamp(r / 90, .6, 2.2) });
  // soft maria (the "hare" in the moon), as watercolour blotches
  for (const [dx, dy, rx, ry, a] of [[-.28, -.18, .3, .22, .4], [.18, -.3, .22, .16, -.3], [.1, .12, .34, .2, .2], [-.22, .32, .2, .14, .5], [.38, .1, .12, .18, 0]])
    paint(ellPts(x + dx * r, y + dy * r, rx * r, ry * r, 16, 2, a), { fill: KJ.moonDk, fillOp: 70, bleed: .2, tex: .5, ink: null });
  paint(ellPts(x - r * .35, y - r * .42, r * .22, r * .12, 12, 0, -.6), { wash: KJ.moonLt, washOp: 200, ink: null });
  const kl = clamp(o.kalas || 0, 0, 16);
  if (kl > 0) {
    boilSeed('kalas ' + key);
    for (let i = 0; i < 16; i++) {
      const k = clamp(kl - i); if (k <= 0) continue;
      const a = -Math.PI / 2 + i / 16 * TAU, rr = r * 1.28, px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr, s = r * .085 * backOut(k) * (1 + .15 * Math.sin(t * 5 + i));
      glow(px, py, s * 3.2, KJ.kala, .35 * k);
      paint(starPts(px, py, s * 1.25, .32, 4, a), { wash: KJ.kala, ink: null });
    }
  }
  if (fl > 0) { boilSeed('moon flare ' + key); paint(ellPts(x, y, r * .98, r * .98, 32), { wash: KJ.moonLt, washOp: 160 * fl, ink: null }); }
}
// a soft beam of moonlight, k 0..1 grows it from the moon down to the roof
function moonBeam(x0, y0, x1, y1, w, k, key = 'beam') {
  if (k <= 0) return;
  const xe = lerp(x0, x1, k), ye = lerp(y0, y1, k), w0 = w * .35, w1 = w;
  boilSeed(key);
  paint([[x0 - w0, y0], [x0 + w0, y0], [xe + w1, ye], [xe - w1, ye]], { fill: KJ.moonGlow, fillOp: 70 * Math.min(1, k * 2), bleed: .15, tex: .2, ink: null });
  for (let i = 0; i < 5; i++) { const q = i / 4; glow(lerp(x0, xe, q), lerp(y0, ye, q), lerp(w0, w1, q) * 1.4, KJ.moonLt, .12); }
}
// motes of moonlight drifting down from `from` into `to` (world points), from t0
function moonDust(t, t0, from, to, n = 10, key = 'dust') {
  const age = t - t0; if (age < 0) return;
  boilSeed(key);
  for (let i = 0; i < n; i++) {
    const ph = frac(age * .45 + hash(i * 3.1)), x = lerp(from[0] + (hash(i * 7.7) - .5) * 220, to[0] + (hash(i * 2.9) - .5) * 60, ph) + 18 * Math.sin(age * 2 + i);
    const y = lerp(from[1], to[1], ph), a = Math.sin(ph * Math.PI) * clamp(age * 2);
    glow(x, y, 26, KJ.kala, .35 * a);
    paint(starPts(x, y, 9 * a + 2, .3, 4, age + i), { wash: KJ.kala, washOp: 255 * a, ink: null });
  }
}

// ---------- kheer ----------
// a brass bowl of kheer, (x, y) the middle of the rim, s its half-width; o.shine 0..1 (moonlight on the kheer)
function kheerBowl(x, y, s, key, o = {}) {
  boilSeed('kheer ' + key);
  const sw = clamp(s / 30, .45, 1.6), sh = clamp(o.shine || 0);
  if (sh > 0) glow(x, y - s * .1, s * 2.4, KJ.kala, .3 * sh);
  paint([[x - s, y], [x + s, y], [x + s * .9, y + s * .35], [x + s * .62, y + s * .62], [x + s * .3, y + s * .7], [x - s * .3, y + s * .7], [x - s * .62, y + s * .62], [x - s * .9, y + s * .35]], { wash: KJ.brass, fill: KJ.brassDk, fillOp: 70, tex: .4, ink: KJ.ink, sw, curv: .35 });
  paint(rectPts(x - s * .28, y + s * .66, s * .56, s * .14), { wash: KJ.brassDk, ink: KJ.ink, sw: sw * .7 });
  paint(ellPts(x, y, s, s * .26, 22), { wash: KJ.kheer, fill: KJ.kheerDk, fillOp: 50, tex: .3, ink: KJ.ink, sw: sw * .8 });
  for (let i = 0; i < 7; i++) {   // saffron strands and almond slivers
    const a = hash(i * 4.1) * TAU, d = Math.sqrt(hash(i * 2.3)) * .72, px = x + Math.cos(a) * d * s, py = y + Math.sin(a) * d * s * .24;
    if (i % 2) inkLine([[px - s * .08, py], [px + s * .08, py + s * .02]], sw * 1.1, KJ.saffron, 'ink', 0);
    else paint(ellPts(px, py, s * .07, s * .028, 6, 0, hash(i)), { wash: KJ.almond, ink: null });
  }
  paint(ellPts(x - s * .55, y + s * .3, s * .14, s * .06, 8, 0, -.4), { wash: KJ.brassLt, ink: null });   // the brass shine
  if (sh > 0) paint(ellPts(x - s * .2, y - s * .04, s * .45 * sh, s * .08 * sh, 12), { wash: KJ.moonLt, washOp: 200 * sh, ink: null });
}

// ---------- the town's roofs ----------
// world: back roofs ~1000–1100, front roofs ~1230–1330, the near terrace's parapet top at o.py (1620).
function rooftops(t, o = {}) {
  boilSeed('kj far roofs');
  const far = [[-260, 1020, 330], [70, 1080, 300], [350, 990, 260], [600, 1060, 320], [900, 1000, 340], [1220, 1070, 300]];
  for (const [x, y, w] of far) {
    paint(rectPts(x, y, w, 1300), { wash: KJ.roofFar, ink: KJ.ink, sw: .5 });
    paint(rectPts(x - 6, y - 14, w + 12, 18), { wash: KJ.roofFarDk, ink: null });
  }
  for (let i = 0; i < far.length; i++) {   // a few lit windows far off
    const [x, y, w] = far[i];
    for (let j = 0; j < 2; j++) if (hash(i * 3 + j) > .45) { const wx = x + 50 + j * (w - 140), wy = y + 70; paint(rectPts(wx, wy, 40, 54), { wash: '#E8B24C', washOp: 200, ink: null }); glow(wx + 20, wy + 27, 50, KJ.flameOut, .15); }
  }
  boilSeed('kj front roofs');
  const front = [[-200, 1300, 420], [250, 1240, 380], [660, 1310, 450], [1130, 1250, 360]];
  for (const [x, y, w] of front) {
    paint(rectPts(x, y, w, 1000), { wash: KJ.roof, fill: KJ.roofDk, fillOp: 60, tex: .4, ink: KJ.ink, sw: .8 });
    paint(rectPts(x - 8, y - 22, w + 16, 26), { wash: KJ.lime, ink: KJ.ink, sw: .7 });
    for (let k = 0; k < 3; k++) diya(x + 50 + k * (w - 100) / 2, y - 22, 13, 1, `fr ${x} ${k}`);
  }
  // small bowls of kheer on the front roofs
  kheerBowl(400, 1218, 26, 'f1', { shine: o.shine }); kheerBowl(830, 1288, 26, 'f2', { shine: o.shine });
  // the near terrace floor (behind its parapet)
  boilSeed('kj terrace');
  paint(rectPts(-300, (o.py ?? 1620) - 120, 1700, 160), { wash: KJ.roofDk, ink: null });
}
// the near terrace's parapet, drawn over the people standing on it: top at py; bowls and diyas on it
function nearParapet(t, o = {}) {
  const py = o.py ?? 1620;
  boilSeed('kj parapet');
  paint(rectPts(-300, py, 1700, 700), { wash: KJ.wall, fill: KJ.wallDk, fillOp: 70, tex: .45, ink: null });
  inkLine([[-300, py], [1400, py]], 1.6, KJ.ink, 'ink', 0);
  paint(rectPts(-300, py - 26, 1700, 30), { wash: KJ.lime, fill: KJ.limeDk, fillOp: 50, tex: .3, ink: null });
  inkLine([[-300, py - 26], [1400, py - 26]], 1.2, KJ.ink, 'ink', 0);
  for (let i = 0; i < 6; i++) paint(rectPts(-200 + i * 300, py + 60, 120, 60), { fill: KJ.wallDk, fillOp: 90, bleed: .2, tex: .4, ink: null });   // jaali shadows
  for (const [x, k] of [[60, 'p1'], [610, 'p2'], [960, 'p3']]) diya(x, py - 26, 20, 1, k);
  kheerBowl(o.bowlX ?? 330, py - 30, o.bowlS ?? 90, 'hero', { shine: o.shine });
  kheerBowl(500, py - 30, 50, 'b2', { shine: o.shine });
}

// ---------- the house (shot D) ----------
// one long wall: windows centred at x 540 and 1560, the openings 470 wide, y 700..1300 (arched tops); the sills at 1300;
// the street at 1760. o.room1(x0, y0, w, h) / o.room2(...) paint each room inside its opening (world space).
const KJW = { y0: 700, y1: 1300, w: 470, sill: 1300, street: 1760, xs: [540, 1560] };
function archPts(cx, y0, y1, w) {
  const P = [[cx - w / 2, y1], [cx - w / 2, y0 + w * .32]];
  for (let i = 0; i <= 12; i++) { const a = Math.PI + i / 12 * Math.PI; P.push([cx + Math.cos(a) * w / 2, y0 + w * .32 + Math.sin(a) * w * .32]); }
  P.push([cx + w / 2, y0 + w * .32], [cx + w / 2, y1]);
  return P;
}
function houseFront(t, o = {}) {
  boilSeed('kj wall');
  paint(rectPts(-300, 200, 2900, 1600), { wash: KJ.wall, fill: KJ.wallDk, fillOp: 60, tex: .5, ink: null });
  for (let i = 0; i < 10; i++) paint(ellPts(-200 + hash(i * 3.3) * 2700, 450 + hash(i * 7.7) * 1200, 120 + 80 * hash(i), 60, 14, 6), { fill: KJ.wallLt, fillOp: 50, bleed: .3, tex: .5, ink: null });   // lime patches
  // the roof edge above, with the moon's light on it
  paint(rectPts(-300, 160, 2900, 70), { wash: KJ.lime, fill: KJ.limeDk, fillOp: 60, tex: .3, ink: null });
  inkLine([[-300, 230], [1100, 230]], 1.4, KJ.ink, 'ink', 0); inkLine([[1100, 230], [2600, 230]], 1.4, KJ.ink, 'ink', 0);
  // the street and the plinth
  boilSeed('kj street');
  paint(rectPts(-300, KJW.street - 60, 2900, 60), { wash: KJ.lime, fill: KJ.limeDk, fillOp: 60, tex: .3, ink: null });
  inkLine([[-300, KJW.street - 60], [1100, KJW.street - 60]], 1.2, KJ.ink, 'ink', 0); inkLine([[1100, KJW.street - 60], [2600, KJW.street - 60]], 1.2, KJ.ink, 'ink', 0);
  paint(rectPts(-300, KJW.street, 2900, 500), { wash: KJ.street, fill: KJ.streetDk, fillOp: 80, tex: .5, ink: null });
  // the plinth's dressing: a tulsi planter between the windows, diyas along the plinth, a rangoli on the street
  boilSeed('kj tulsi');
  const tx = 1050, ty = KJW.street - 60;
  paint([[tx - 70, ty], [tx + 70, ty], [tx + 56, ty - 150], [tx - 56, ty - 150]], { wash: '#C0703E', fill: '#8A4A28', fillOp: 60, tex: .4, ink: KJ.ink, sw: 1.2 });
  paint(rectPts(tx - 66, ty - 172, 132, 26), { wash: '#D88A50', ink: KJ.ink, sw: 1 });
  for (let i = 0; i < 9; i++) { const a = -Math.PI / 2 + (i - 4) * .3, l = 120 + 40 * hash(i); inkLine([[tx, ty - 170], [tx + Math.cos(a) * l * .5, ty - 170 + Math.sin(a) * l * .6], [tx + Math.cos(a) * l, ty - 170 + Math.sin(a) * l]], 3, '#3E7A4A', 'ink', .5); paint(ellPts(tx + Math.cos(a) * l, ty - 170 + Math.sin(a) * l, 14, 9, 8, 0, a), { wash: '#5E9A6A', ink: null }); }
  for (const x of [-60, 300, 800, 1300, 1900, 2300]) diya(x, KJW.street - 60, 20, 1, 'pl' + x);
  boilSeed('kj rangoli');
  for (const [rx, rr] of [[540, 150], [1560, 150]]) {
    paint(ellPts(rx, KJW.street + 90, rr, rr * .3, 24), { wash: '#F4EEE0', washOp: 200, ink: null });
    paint(ellPts(rx, KJW.street + 90, rr * .72, rr * .21, 20), { wash: '#E8902A', washOp: 220, ink: null });
    paint(ellPts(rx, KJW.street + 90, rr * .42, rr * .12, 16), { wash: '#C8324A', washOp: 220, ink: null });
  }
  KJW.xs.forEach((cx, i) => {
    const P = archPts(cx, KJW.y0, KJW.y1, KJW.w);
    boilSeed('kj room ' + i);
    paint(P, { wash: KJ.room, fill: KJ.roomLt, fillOp: 70, tex: .4, ink: null });
    const room = i ? o.room2 : o.room1;
    if (room) room(cx - KJW.w / 2, KJW.y0, KJW.w, KJW.y1 - KJW.y0);
    boilSeed('kj frame ' + i);
    // the open shutters, flat against the wall
    for (const s of [-1, 1]) {
      const x = cx + s * (KJW.w / 2 + 18) + (s < 0 ? -150 : 0);
      paint(rrPts(x, KJW.y0 + 110, 150, KJW.y1 - KJW.y0 - 110, 8), { wash: KJ.wood, fill: KJ.woodDk, fillOp: 70, tex: .5, ink: KJ.ink, sw: 1.2 });
      for (let k = 0; k < 3; k++) paint(rrPts(x + 22, KJW.y0 + 140 + k * 150, 106, 120, 6), { wash: KJ.woodDk, ink: null });
    }
    inkLine(P, 16, KJ.wood, 'ink', .2);
    inkLine(P, 2, KJ.ink, 'ink', .2);
    paint(rectPts(cx - KJW.w / 2 - 40, KJW.sill, KJW.w + 80, 40), { wash: KJ.lime, fill: KJ.limeDk, fillOp: 60, tex: .3, ink: KJ.ink, sw: 1.2 });
    // a diya on each sill
    diya(cx + (i ? 170 : 180), KJW.sill, 18, 1, 'sill' + i);
    kheerBowl(cx + (i ? 85 : 95), KJW.sill - 4, 34, 'sill' + i, { shine: .6 });
    if (o.light && o.light[i] > 0) glow(cx, KJW.y0 + 330, 420, KJ.warm, .3 * o.light[i]);
  });
}
// window 1's room: three family members asleep under one patchwork razai (world: x0..x0+w across, the bed at y)
function familyBed(x0, w, y, t, snores, yb = KJW.y1 + 10) {
  boilSeed('fam pillows');
  for (let i = 0; i < 3; i++) paint(rrPts(x0 + 30 + i * (w - 60) / 3, y - 90, (w - 60) / 3 - 10, 84, 30), { wash: KJ.pillow, fill: KJ.pillowDk, fillOp: 50, tex: .3, ink: KJ.ink, sw: .9 });
  // heads poking out: dad (black hair), grandma (a grey bun), a little one (a tuft)
  const heads = [[x0 + 100, KJ.hair, 'dad'], [x0 + w / 2, KJ.grey, 'nani'], [x0 + w - 100, KJ.hair, 'kid']];
  heads.forEach(([hx, hc, k], i) => {
    const br = Math.sin(t * 2.2 + i * 2) * 4;
    boilSeed('fam head ' + k);
    paint(ellPts(hx, y - 44 + br * .3, 66, 46, 16), { wash: hc, ink: KJ.ink, sw: .9 });
    if (k === 'nani') paint(ellPts(hx + 38, y - 80, 26, 22, 10), { wash: hc, ink: KJ.ink, sw: .8 });
    if (k === 'kid') inkLine([[hx - 6, y - 86], [hx + 4, y - 114], [hx + 20, y - 100]], 4, hc, 'ink', .6);
  });
  // the razai, rising and falling with three different breaths; one foot sticking out
  boilSeed('fam razai');
  const P = [[x0 - 10, yb], [x0 - 10, y - 10]];
  for (let i = 0; i <= 18; i++) { const q = i / 18, bump = Math.sin(q * Math.PI * 3) * 22 * (1 + .4 * Math.sin(t * 2.2 + Math.floor(q * 3) * 2)); P.push([x0 + q * w, y - 16 - Math.max(0, bump)]); }
  P.push([x0 + w + 10, yb]);
  paint(P, { wash: KJ.blanket, fill: KJ.blanketDk, fillOp: 60, tex: .5, ink: KJ.ink, sw: 1.2, curv: .3 });
  for (let i = 0; i < 5; i++) paint(rrPts(x0 + 20 + i * (w - 40) / 5, y + 30 + (i % 2) * 50, (w - 40) / 5 - 20, 50, 8), { wash: i % 2 ? KJ.blanket2 : KJ.blanket3, washOp: 210, ink: null });
  paint(ellPts(x0 + w - 30, y + 90, 24, 36, 10, 1, .4), { wash: AAR.skin, ink: KJ.ink, sw: .9 });   // the foot
  // snores: zzz rising from each head, out of step
  if (snores) heads.forEach(([hx], i) => emote('zzz', hx + 40, y - 120, 30, 1, t + i * .7));
}
// a phone in Aarav's hands (held-hook space, body u); on 0..1 lights its screen side toward him
function phone(u, sw, on = 1) {
  paint(rrPts(-1.05 * u, -12.9 * u, 2.1 * u, 3.4 * u, .35 * u), { wash: KJ.phone, ink: KJ.ink, sw: sw * .8 });
  paint(ellPts(-.55 * u, -12.35 * u, .22 * u, .22 * u, 8), { wash: '#4A4A5A', ink: null });
  if (on > 0) glow(0, -14.4 * u, 3.6 * u, KJ.screen, .45 * on);
}

// ---------- the card ----------
function kjCard(t, C) {
  boilSeed('cardbg');
  paint(rectPts(-60, -60, W + 120, H + 120), { wash: TK.peach, ink: null });
  // a little full moon over the covers, and lamps along the foot
  boilSeed('card moon'); glow(470, 380, 140, '#FFE7A8', .35);
  for (let i = 0; i < 7; i++) diya(110 + i * 125, 1490, 22, clamp((t - C.cap) * 4 - i * .4), 'card' + i);
  const X = 470, pk = t0 => Math.max(0, t - t0) * 5, br = Math.sin(t * 1.3) * .01;
  if (t > C.cap) letter('Stay up tonight with a STORY', X, 660, 50, TK.teal, { screen: true, font: '50px Marcellus', ink: false, pop: pk(C.cap), maxW: 860 });
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
