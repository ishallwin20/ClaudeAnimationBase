// mahish_props.js: the sets and effects for "Mahishasura turned into a LION. In front of HER lion." (src/scenes/mahish.js).
// Loaded before it; everything here is a pure function of its arguments (and T for boil).
//
//   TK, vanishPuff, sparkleBurst, whipH, veil, petalRain   copied from ad 10
//   MH                                     the palette of this reel
//   battleSet(t, o)                        the battlefield at dusk (or dawn: o.dawn 0..1), scrolling with o.scroll (world)
//   heavenSet(t), throne(x, y, s)          heaven: golden clouds and Indra's throne (world)
//   himalayaSet(t, gold)                   the night sky over the Himalaya, turning gold (world)
//   godOrb(x, y, r, i, o)                  a god's light: a glowing orb holding his weapon, with a little face
//   comet(p0, p1, h, k, col, s, draw, key) a weapon flying on an arc with a light trail
//   impact(x, y, age, s), shockRing(...)   impact frames, a shockwave
//   zoomLines(cx, cy, k, t), dust(...)     speed lines toward a point; a dust puff
//   slashArc(cx, cy, r, a0, a1, k, age)    the khadga's gold crescent
//   demonElephant(x, y, u, o)              Mahishasura's elephant form, side view
//   DEMON_PAL, demonLionHat(o)             his lion form: Sher's rig in purple, horns and the gold nose ring
//   sherBandSide(o), heldBand(x, y, s, a)  Part 1's red union headband: on his side-view head; in his paw
//   diyaRow(t, lit), rewindMark(k)         nine diyas for nine nights; a ◀◀ mark
//   mahishCard(t, C)                       the end card: Books 1–3
const TK = {
  ink: '#2B2233', cream: '#FFF5E2',
  petal: '#F4A6B8', petalDk: '#E0708C', marigold: '#F39A2E', yellow: '#FFD45A', leaf: '#5E9A6A',
  gold: '#EDB43C', goldLt: '#FFE39A', goldDk: '#B67D1C',
  rkOrange: '#F15A24', peach: '#FBE0CF', peachLt: '#FFF1E6', brown: '#3A2418', grey: '#6B5A50', teal: '#2E5F5A',
};
const MH = {
  ink: '#2E1E2A',
  skyTop: '#3A1E4A', skyMid: '#A8344A', skyLow: '#EE7A3A', skyHz: '#FFC46A', sun: '#FFE2A0',
  hillFar: '#6A3050', hillNear: '#43203E', ground: '#7E4A3A', groundDk: '#5E3430', groundLt: '#9A6248', ember: '#FFB04A',
  dawnTop: '#F6C08A', dawnMid: '#FFD9A0', dawnLow: '#FFE8BE', dawnHillFar: '#D9967A', dawnHillNear: '#B87462', dawnGround: '#D9A070', dawnGroundDk: '#B98058',
  heaven: '#FFE6B4', heavenLt: '#FFF4DA', cloud: '#FFF8EC', cloudDk: '#EED6B4', pillar: '#F6E2B8', pillarDk: '#DDBF8A',
  night: '#141A44', nightLt: '#26306A', snow: '#E8EEFA', snowDk: '#9AA8D0', rock: '#3A3E6A', star: '#FFF1C8',
  red: '#D2352C', redDk: '#9E2420',
};
const GODS = [   // the gods whose light makes Durga, and their gifts: [name, colour, gift]
  ['Shiva', '#7FB6F0', 'trishul'], ['Vishnu', '#9C8CF0', 'chakra'], ['Indra', '#F5C542', 'vajra'], ['Varuna', '#52C8C0', 'shankh'], ['Vayu', '#C8ECF6', 'dhanush'],
];

// ---------- copied from ad 10 ----------
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
function whipH(k, dir = 1, t = 0, cols = [TK.cream, '#FFD9A0']) {
  if (k <= .02) return;
  boilSeed('whiph');
  for (let i = 0; i < 18; i++) {
    const y = 240 + hash(i * 2.7) * (H - 480), l = 500 + 900 * hash(i * 5.3), x = ((hash(i * 9.1) * 2400 - 300 + dir * t * 3800) % (W + l)) - l * .5, w = 5 + 16 * hash(i * 1.3);
    paint(ribbon([[x - l / 2, y], [x, y + 3], [x + l / 2, y]], w * .3, w), { wash: i % 3 ? cols[0] : cols[1], washOp: 190 * clamp(k) * (.5 + .5 * hash(i)), ink: null });
  }
}
function veil(col, a) {
  if (a <= .004) return;
  flushBrush(); const c = color(col);
  push(); resetMatrix(); translate(-W / 2, -H / 2); noStroke(); fill(red(c), green(c), blue(c), 255 * clamp(a)); rect(-4, -4, W + 8, H + 8); pop();
}
function petalRain(t, t0, o = {}) {
  const age = t - t0; if (age < 0) return;
  boilSeed('petalrain');
  const n = o.n || 26;
  for (let i = 0; i < n; i++) {
    const st = hash(i * 1.7) * .6, a = age - st; if (a < 0) continue;
    const x = hash(i * 3.3) * 1100 + 40 * Math.sin(a * 2 + i), y = -40 + a * (380 + 200 * hash(i * 5.1)), r = a * 3 + i;
    if (y > H + 40) continue;
    paint([[x + Math.cos(r) * 17, y + Math.sin(r) * 17], [x + Math.cos(r + 1.6) * 8, y + Math.sin(r + 1.6) * 8], [x - Math.cos(r) * 17, y - Math.sin(r) * 17], [x + Math.cos(r - 1.6) * 8, y + Math.sin(r - 1.6) * 8]], { wash: i % 3 ? TK.marigold : TK.yellow, ink: null, curv: .5 });
  }
}

// ---------- the sets ----------
// A ridge line across [x0, x1] at base y: bumps from a few sines, offset by scroll (parallax)
function ridge(x0, x1, y, amp, sc, scroll, n = 40) {
  const P = [];
  for (let i = 0; i <= n; i++) { const x = lerp(x0, x1, i / n), q = (x + scroll) * sc; P.push([x, y - amp * (.55 + .3 * Math.sin(q) + .2 * Math.sin(q * 2.3 + 1.7) + .15 * Math.sin(q * 5.1 + .4))]); }
  return P;
}
// The battlefield, world space (the frame shows x 0..1080, y 0..1920 at zoom 1; it reaches past for the camera's moves).
// o: scroll (px, the ground moves left as they run right), dawn 0..1 (dusk → golden dawn), embers (default 1)
function battleSet(t, o = {}) {
  const sc = o.scroll || 0, d = clamp(o.dawn || 0), C = (a, b) => mixCol(a, b, d), HZ = 1190;
  boilSeed('bsky');
  paint(rectPts(-900, -900, 2900, 3800), { wash: C(MH.skyTop, MH.dawnTop), ink: null });
  paint(rectPts(-900, 300, 2900, 700), { fill: C(MH.skyMid, MH.dawnMid), fillOp: 220, bleed: .25, tex: .3, ink: null });
  paint(rectPts(-900, 750, 2900, 500), { fill: C(MH.skyLow, MH.dawnLow), fillOp: 235, bleed: .25, tex: .3, ink: null });
  glow(760, 1080, 520, C('#FF9A4A', '#FFE7A8'), .55 + .25 * d);
  boilSeed('bsun');
  paint(ellPts(760, 1060 - d * 160, 150, 150, 32), { wash: C(MH.sun, '#FFF4D6'), ink: null });
  glow(760, 1060 - d * 160, 260, '#FFF0B8', .5);
  boilSeed('bhillf');
  paint([...ridge(-900, 2000, HZ - 40, 260, .004, sc * .15), [2000, HZ + 60], [-900, HZ + 60]], { wash: C(MH.hillFar, MH.dawnHillFar), ink: null });
  boilSeed('bhilln');
  paint([...ridge(-900, 2000, HZ + 10, 150, .007, sc * .4 + 300), [2000, HZ + 80], [-900, HZ + 80]], { wash: C(MH.hillNear, MH.dawnHillNear), ink: null });
  boilSeed('bground');
  paint(rectPts(-900, HZ, 2900, 2600), { wash: C(MH.ground, MH.dawnGround), fill: C(MH.groundDk, MH.dawnGroundDk), fillOp: 90, bleed: .1, tex: .6, ink: null });
  inkLine([[-900, HZ + 2], [500, HZ - 2], [2000, HZ + 3]], 2.2, C(MH.groundDk, MH.dawnGroundDk), 'dry', .3);
  // streaks and stones that slide past at ground speed
  boilSeed('bstones');
  for (let i = 0; i < 26; i++) {
    const y = HZ + 40 + (i / 26) * 760, sp = .4 + .6 * ((y - HZ) / 760), per = 1600, x = ((hash(i * 3.1) * per - sc * sp) % per + per) % per - 260;
    if (i % 3 === 0) paint(ellPts(x, y, 14 + 10 * hash(i), 7 + 4 * hash(i * 2), 8, 1), { wash: C(MH.groundDk, MH.dawnGroundDk), ink: null });
    else inkLine([[x - 60 - 50 * hash(i * 5), y], [x + 60, y + 2]], 2 + 2 * hash(i), C(MH.groundLt, '#E8B888'), 'dry', .2);
  }
  if ((o.embers ?? 1) > 0) {
    boilSeed('bembers');
    for (let i = 0; i < 22; i++) {
      const per = 4 + 3 * hash(i), a = frac((t + hash(i * 7) * per) / per), x = hash(i * 3.7) * 1300 - 110 + Math.sin(t * 1.3 + i) * 30 - sc * .25 % 1300, y = 1500 - a * 1300;
      const r = 3 + 4 * hash(i * 1.9);
      glow(((x % 1300) + 1300) % 1300 - 110, y, r * 4, C(MH.ember, '#FFF0B0'), .5 * Math.sin(a * Math.PI) * (o.embers ?? 1));
    }
  }
}
// Heaven: pale gold sky, sun rays, clouds below, two pillars (world space, the frame 0..1080 × 0..1920)
function heavenSet(t) {
  boilSeed('hsky');
  paint(rectPts(-400, -400, 1900, 2800), { wash: MH.heaven, ink: null });
  glow(540, 700, 900, '#FFF4C8', .7);
  boilSeed('hrays');
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU + t * .05; paint([[540, 700], [540 + Math.cos(a - .06) * 1500, 700 + Math.sin(a - .06) * 1500], [540 + Math.cos(a + .06) * 1500, 700 + Math.sin(a + .06) * 1500]], { wash: MH.heavenLt, washOp: 120, ink: null }); }
  boilSeed('hpillars');
  for (const x of [120, 960]) {
    paint(rectPts(x - 55, 420, 110, 1200), { wash: MH.pillar, fill: MH.pillarDk, fillOp: 60, tex: .4, ink: MH.ink, sw: 1.6 });
    paint(rectPts(x - 80, 400, 160, 50), { wash: TK.gold, ink: MH.ink, sw: 1.6 });
    for (const k of [-25, 0, 25]) inkLine([[x + k, 470], [x + k, 1600]], 1.2, MH.pillarDk, 'inkfine', 0);
  }
  boilSeed('hclouds');
  for (let i = 0; i < 9; i++) {
    const x = -100 + i * 160 + 30 * Math.sin(t * .4 + i), y = 1640 + 40 * hash(i * 3), r = 150 + 60 * hash(i);
    paint(ellPts(x, y, r, r * .55, 22, 3), { wash: i % 2 ? MH.cloud : MH.cloudDk, ink: null });
  }
  paint(rectPts(-400, 1700, 1900, 900), { wash: MH.cloud, ink: null });
}
// Indra's golden throne, seat centre (x, y), s px per unit
function throne(x, y, s) {
  boilSeed('throne');
  paint([[x - 3.2 * s, y + 3.5 * s], [x + 3.2 * s, y + 3.5 * s], [x + 3.0 * s, y - .2 * s], [x - 3.0 * s, y - .2 * s]], { wash: TK.gold, fill: TK.goldDk, fillOp: 60, tex: .4, ink: MH.ink, sw: 2 });
  paint([[x - 2.6 * s, y - .2 * s], [x - 2.8 * s, y - 5.2 * s], [x - 1.6 * s, y - 6.6 * s], [0 + x, y - 7.3 * s], [x + 1.6 * s, y - 6.6 * s], [x + 2.8 * s, y - 5.2 * s], [x + 2.6 * s, y - .2 * s]], { wash: TK.gold, fill: TK.goldDk, fillOp: 50, tex: .4, ink: MH.ink, sw: 2, curv: .3 });
  paint([[x - 2.0 * s, y - .5 * s], [x - 2.1 * s, y - 4.6 * s], [x, y - 5.8 * s], [x + 2.1 * s, y - 4.6 * s], [x + 2.0 * s, y - .5 * s]], { wash: MH.red, fill: MH.redDk, fillOp: 50, tex: .5, ink: MH.ink, sw: 1.6, curv: .3 });
  paint(rrPts(x - 3.0 * s, y - .9 * s, 6 * s, 1.3 * s, .6 * s), { wash: MH.red, ink: MH.ink, sw: 1.6 });
  paint(ellPts(x, y - 6.2 * s, .45 * s, .55 * s, 10), { wash: '#4AA6E0', ink: MH.ink, sw: 1.2 });
}
// The Himalaya at night, turning gold with gold 0..1 (world space)
function himalayaSet(t, gold = 0) {
  const g = clamp(gold), C = (a, b) => mixCol(a, b, g);
  boilSeed('msky');
  paint(rectPts(-600, -600, 2300, 3200), { wash: C(MH.night, '#F6C470'), ink: null });
  paint(rectPts(-600, 700, 2300, 900), { fill: C(MH.nightLt, '#FFE0A0'), fillOp: 200, bleed: .3, tex: .3, ink: null });
  boilSeed('mstars');
  for (let i = 0; i < 40; i++) { const x = hash(i * 1.3) * 1300 - 110, y = hash(i * 2.9) * 1100 - 100, tw = .5 + .5 * Math.sin(t * 3 + i); paint(starPts(x, y, (4 + 6 * hash(i * 4)) * tw * (1 - g), .35, 4), { wash: MH.star, ink: null }); }
  boilSeed('mpeaks');
  const peaks = [[-200, 1500], [80, 1050], [300, 1300], [560, 880], [820, 1240], [1050, 980], [1300, 1500]];
  paint([...peaks, [1300, 2600], [-200, 2600]], { wash: C(MH.rock, '#B87A5A'), ink: MH.ink, sw: 2, curv: .05 });
  for (const [px, py] of peaks.slice(1, -1)) paint([[px - 70, py + 120], [px, py], [px + 75, py + 115], [px + 30, py + 95], [px, py + 135], [px - 30, py + 92]], { wash: C(MH.snow, '#FFF4D8'), ink: null, curv: .1 });
  boilSeed('mfront');
  paint([[-200, 1700], [200, 1560], [540, 1640], [900, 1540], [1300, 1680], [1300, 2600], [-200, 2600]], { wash: C('#2A2E58', '#9A5E4A'), ink: MH.ink, sw: 2, curv: .3 });
}

// ---------- the god-lights and the gifts ----------
// A god's light at (x, y), radius r: a glowing orb holding his gift's silhouette, with a little face.
// o: face ('calm' | 'shock' | 'angry'), k (0..1 size), spin
function godOrb(x, y, r, i, o = {}) {
  const [, col, gift] = GODS[i], k = o.k ?? 1;
  if (k < .02) return;
  boilSeed('orb' + i);
  glow(x, y, r * 2.6 * k, col, .8);
  glow(x, y, r * 1.3 * k, '#FFFFFF', .45);
  paint(ellPts(x, y, r * k, r * k, 24), { wash: mixCol(col, '#FFFFFF', .55), washOp: 230, ink: mixCol(col, MH.ink, .5), sw: 2.2 });
  push(); translate(x, y + r * .05 * k); rotate(o.spin || 0); const s = r * k / 5.2;
  if (gift === 'trishul') trishul(s * .45, 1, 0); else if (gift === 'chakra') { translate(0, 1.9 * s * .9); chakra(s * .9, 1, (o.spin || 0) * 3); }
  else if (gift === 'vajra') vajra(s * .75, 1, .5); else if (gift === 'shankh') shankh(s * .8, 1, .3); else dhanush(s * .7, 1, 0);
  pop();
  const f = o.face || 'calm', ey = y - r * .1 * k, ex = r * .28 * k;   // the little face, under the gift
  boilSeed('orbface' + i);
  for (const s of [-1, 1]) {
    if (f === 'shock') paint(ellPts(x + s * ex, ey + r * .3 * k, r * .1 * k, r * .13 * k, 8), { wash: MH.ink, ink: null });
    else paint(ellPts(x + s * ex, ey + r * .3 * k, r * .07 * k, r * .09 * k, 8), { wash: MH.ink, ink: null });
    if (f === 'angry') inkLine([[x + s * ex * 1.6, ey + r * .1 * k], [x + s * ex * .4, ey + r * .2 * k]], 2.6, MH.ink, 'ink', 0);
  }
  if (f === 'shock') paint(ellPts(x, ey + r * .62 * k, r * .1 * k, r * .14 * k, 8), { wash: MH.ink, ink: null });
  else inkLine([[x - r * .12 * k, ey + r * .6 * k], [x, ey + r * (f === 'angry' ? .55 : .66) * k], [x + r * .12 * k, ey + r * .6 * k]], 2, MH.ink, 'inkfine', .5);
}
// A gift flying from p0 to p1 on an arc (height h) at progress k, with a light trail of colour col; draw(sz) draws it at
// (0, 0) along its motion
function comet(p0, p1, h, k, col, sz, draw, key) {
  if (k <= 0 || k >= 1) return;
  boilSeed('comet ' + key);
  const tr = [];
  for (let j = 0; j <= 10; j++) tr.push(arcPt(p0, p1, h, Math.max(0, k - .3 + j * .03)));
  paint(ribbon(tr, 2, sz * .5), { wash: mixCol(col, '#FFFFFF', .5), washOp: 200, ink: null });
  const [x, y] = arcPt(p0, p1, h, k), [x2, y2] = arcPt(p0, p1, h, Math.min(1, k + .02));
  glow(x, y, sz * 2.2, col, .9);
  push(); translate(x, y); rotate(Math.atan2(y2 - y, x2 - x) + Math.PI / 2 + k * 6); draw(sz); pop();
}

// A gold name tag that pops in at (x, y) (screen space) for a gift's giver
function giftTag(x, y, txt, age, o = {}) {
  if (age < 0) return;
  const k = backOut(clamp(age * 4)), w = o.w || 190;
  boilSeed('gtag ' + txt);
  push(); translate(x, y); scale(k); rotate(o.rot || -.04);
  glow(0, 0, w * .6, '#FFE08A', .45);
  paint([[-w / 2, -27], [w / 2, -27], [w / 2 + 18, 0], [w / 2, 27], [-w / 2, 27], [-w / 2 - 18, 0]], { wash: TK.gold, fill: TK.goldDk, fillOp: 60, tex: .4, ink: MH.ink, sw: 2.4 });
  pop();
  if (k > .3) letter(txt, x, y + 2, 36 * k, TK.brown, { font: `700 ${Math.round(36 * k)}px Poppins`, ink: false, rot: o.rot || -.04, maxW: w });
}

// ---------- fight effects ----------
// Impact frames at (x, y), screen or world: age 0..; s the size. The first two frames flash the whole frame cream with
// dark spikes, then a ring and sparks.
function impact(x, y, age, s, key = 'imp') {
  if (age < 0 || age > .5) return;
  boilSeed(key);
  if (age < .085) {
    paint(rectPts(-2000, -2000, 6000, 6000), { wash: age < .042 ? '#FFF4DC' : '#2A1630', ink: null });
    for (let i = 0; i < 16; i++) { const a = i / 16 * TAU + hash(i) * .3, r0 = s * .25, r1 = s * (1.6 + 1.2 * hash(i * 3)); paint([[x + Math.cos(a - .05) * r0, y + Math.sin(a - .05) * r0], [x + Math.cos(a) * r1, y + Math.sin(a) * r1], [x + Math.cos(a + .05) * r0, y + Math.sin(a + .05) * r0]], { wash: age < .042 ? '#2A1630' : '#FFF4DC', ink: null }); }
    return;
  }
  const k = (age - .085) / .415;
  glow(x, y, s * (1.2 + k), '#FFD27A', .9 * (1 - k));
  const R = s * (.3 + 1.6 * easeOut(k)), e = ellPts(x, y, R, R * .8, 36, 2);
  inkLine([...e, e[0], e[1]], 10 * (1 - k) + 1, '#FFF4DC', 'ink', .5);
  for (let i = 0; i < 10; i++) { const a = i / 10 * TAU + hash(i * 2) * .5, d = s * (.4 + 1.5 * easeOut(k)) * (.6 + .5 * hash(i)); paint(starPts(x + Math.cos(a) * d, y + Math.sin(a) * d, s * .14 * (1 - k), .3, 4), { wash: i % 2 ? '#FFE08A' : '#FFF4DC', ink: null }); }
}
// Anime speed lines converging on (cx, cy) from the frame's edge (screen space), k strength
function zoomLines(cx, cy, k, t) {
  if (k <= .02) return;
  boilSeed('zoom ' + Math.floor(t * 12));
  for (let i = 0; i < 40; i++) {
    const a = hash(i * 3.3 + Math.floor(t * 12)) * TAU, r0 = 420 + 200 * hash(i * 1.7), r1 = 1500, w = 3 + 9 * hash(i * 5.1);
    paint([[cx + Math.cos(a - .004 * w) * r1, cy + Math.sin(a - .004 * w) * r1], [cx + Math.cos(a) * r0, cy + Math.sin(a) * r0], [cx + Math.cos(a + .004 * w) * r1, cy + Math.sin(a + .004 * w) * r1]], { wash: '#FFF4DC', washOp: 200 * clamp(k), ink: null });
  }
}
function dust(x, y, s, age, key = 'dust') { vanishPuff(x, y, s, age, key, ['#C99A78', '#E8C4A0']); }
// The khadga's crescent: a gold arc swept round (cx, cy) from a0 to a1 by k (0..1), fading after
function slashArc(cx, cy, r, a0, a1, k, age = 0, key = 'slash') {
  if (k <= 0 || age > .45) return;
  boilSeed(key);
  const fade = 1 - clamp(age / .45), end = lerp(a0, a1, easeOut(k)), st = lerp(a0, end, .25 + .6 * clamp(age / .45)), P = [];
  for (let i = 0; i <= 20; i++) { const a = lerp(st, end, i / 20); P.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
  glow((P[0][0] + P[20][0]) / 2, (P[0][1] + P[20][1]) / 2, r * .9, '#FFD27A', .8 * fade);
  paint(ribbon(P, 2, r * .16), { wash: '#FFE8A0', washOp: 255 * fade, ink: null });
  paint(ribbon(P, 1, r * .07), { wash: '#FFFFFF', washOp: 255 * fade, ink: null });
}
// A tiny star that twinkles once where something vanished into the sky (a "ding")
function twinkle(x, y, age, s = 40, key = 'twinkle') {
  if (age < 0 || age > .6) return;
  boilSeed(key);
  const k = Math.sin(age / .6 * Math.PI);
  glow(x, y, s * 2 * k, '#FFF4C8', .9 * k);
  paint(starPts(x, y, s * k, .25, 4, -Math.PI / 2 + age * 2), { wash: '#FFFDF2', ink: null });
}

// ---------- his elephant form ----------
// Side view, facing screen-right (flip: true faces left). (x, y) the ground under him; u the size unit (about 16u long,
// 16u to the top of the head). o: rear 0..1 (rears up, trunk raised, trumpeting), eyes ('angry' | 'swirl'), flip, sq,
// rot, boilKey
const DEM = { body: '#6A5E86', dk: '#4A4064', lt: '#8A7EA8', ear: '#8C6E9A', tusk: '#FBF3E2', eye: '#FF5A3A' };
function demonElephant(x, y, u, o = {}) {
  const id = o.boilKey ?? 'ele', rs = p => boilSeed(`ele ${id} ${p}`), INK = MH.ink, sw = clamp(u / 20, .4, 2), rr = clamp(o.rear || 0);
  rs('shadow'); paint(ellPts(x, y + u * .2, u * 8, u * 1.1, 22), { fill: PAL.ink, fillOp: 90, bleed: .25, tex: .3, ink: null });
  push(); translate(x, y); scale((o.flip ? -1 : 1) * (1 + (o.sq || 0) * .6), 1 - (o.sq || 0)); if (o.rot) rotate(o.rot);
  translate(-4.5 * u, 0); rotate(-rr * .42); translate(4.5 * u, 0);   // rears about the hind feet
  const P = pts => U(pts, u), C = DEM;
  const leg = (lx, far, lift = 0) => { paint(P([[lx - 1.2, -6], [lx + 1.2, -6], [lx + 1.15 + lift * .8, -.4 - lift * 2], [lx - 1.15 + lift * .8, -.4 - lift * 2]]), { wash: far ? C.dk : C.body, ink: INK, sw: sw * .8 }); paint(P([[lx - 1.2 + lift * .8, -.6 - lift * 2], [lx + 1.2 + lift * .8, -.6 - lift * 2], [lx + 1.25 + lift * .8, 0 - lift * 2], [lx - 1.25 + lift * .8, 0 - lift * 2]]), { wash: C.lt, ink: INK, sw: sw * .6 }); };
  rs('far'); leg(-3.3, true); leg(3.6, true, rr);
  rs('tail'); paint(ribbon(P([[-6.6, -9], [-7.4, -7.5], [-7.5, -5.6]]), .35 * u, .2 * u), { wash: C.body, ink: INK, sw: sw * .6 });
  rs('body');
  paint(P([[-6.8, -8.5], [-5.8, -11.6], [-2.5, -12.8], [1.5, -12.6], [4.5, -11.2], [5.6, -8.5], [5.0, -5.6], [2.0, -4.9], [-3.0, -5.0], [-6.2, -6.0]]), { wash: C.body, fill: C.dk, fillOp: 50, tex: .6, ink: INK, sw: sw, curv: .45 });
  paint(P([[-5, -11.6], [-1.5, -12.3], [2.5, -12.1], [0, -11.2], [-3.5, -11]]), { wash: C.lt, ink: null, curv: .5 });
  rs('near'); leg(-2.6, false); leg(4.2, false, rr * 1.1);
  rs('head');
  paint(P([[3.8, -11.5], [5.6, -14.6], [8.0, -15.2], [9.6, -13.6], [9.8, -11.0], [9.0, -9.0], [7.0, -8.6], [5.0, -9.2]]), { wash: C.body, fill: C.dk, fillOp: 40, tex: .5, ink: INK, sw: sw, curv: .45 });
  paint(P([[4.6, -13.4], [3.0, -12.6], [2.6, -9.8], [3.6, -7.8], [5.4, -8.8], [5.8, -11.6]]), { wash: C.ear, fill: C.dk, fillOp: 40, tex: .5, ink: INK, sw: sw * .8, curv: .5 });   // the ear
  // the trunk: down and curled at rest; up and trumpeting when he rears
  const tr = rr > .3 ? [[9.4, -11.6], [11.0, -13.6], [11.6, -16.4], [10.9, -18.6], [10.0, -19.4]] : [[9.4, -11.6], [10.4, -9.6], [10.6, -7.0], [10.2, -5.0], [11.0, -4.2]];
  paint(ribbon(P(tr), 1.5 * u, .7 * u), { wash: C.body, ink: INK, sw: sw * .9 });
  for (let k = 1; k < 4; k++) { const a = tr[k]; inkLine(P([[a[0] - .5, a[1]], [a[0] + .5, a[1] + .1]]), sw * .5, C.dk, 'inkfine', 0); }
  if (rr > .3) { const m = tr[4]; paint(ellPts(m[0] * u, m[1] * u, .55 * u, .45 * u, 10), { wash: '#5A1E2A', ink: INK, sw: sw * .5 }); }
  const ring = ellPts(10.35 * u, (rr > .3 ? -13.2 : -9.9) * u, .55 * u, .45 * u, 14); inkLine([...ring, ring[0], ring[1]], sw * 1.6, TK.gold, 'ink', .5);   // the nose ring
  rs('tusk'); paint(ribbon(P([[8.6, -9.4], [9.8, -8.4], [11.4, -8.6], [12.0, -9.6]]), .5 * u, .1 * u), { wash: C.tusk, ink: INK, sw: sw * .6 });
  rs('eye');
  if (o.eyes === 'swirl') { const sp = []; for (let i = 0; i < 14; i++) { const a = i * .8 + T * 9, r = .05 + i * .03; sp.push([(7.9 + Math.cos(a) * r) * u, (-12.6 + Math.sin(a) * r) * u]); } inkLine(sp, sw * .6, INK, 'inkfine', .5); }
  else { glow(7.9 * u, -12.6 * u, u * 1.4, C.eye, .7); paint(ellPts(7.9 * u, -12.6 * u, .5 * u, .4 * u, 10), { wash: C.eye, ink: INK, sw: sw * .5 }); inkLine(P([[7.1, -13.5], [8.6, -12.9]]), sw * 1.6, INK, 'ink', 0); }
  pop();
}

// ---------- his lion form, and Part 1's headband ----------
const DEMON_PAL = { body: '#9A86BE', dk: '#715E98', lt: '#BCAEDA', mane: '#4E3C78', maneDk: '#382A5C', maneLt: '#7462A2', iris: '#E8423A',
  cream: '#DCD2EE', creamDk: '#C2B4DE', nose: '#4A2E5E', padLt: '#C6A6D8', ink: '#2A1E36' };
// a hat for lionRun(): buffalo horns behind the ears and the gold nose ring (head-local coordinates)
function demonLionHat(o = {}) {
  return (u, sw) => {
    for (const [bx, by, tx, ty, w] of [[1.2, -2.5, .8, -5.6, .9], [-.6, -2.6, -2.6, -5.2, 1.05]]) {
      paint(U(ribbon([[bx, by], [lerp(bx, tx, .4) + (tx < bx ? -.6 : .6), lerp(by, ty, .5)], [tx, ty]], w, .08), u), { wash: MHS.horn, fill: MHS.hornDk, fillOp: 50, tex: .4, ink: DEMON_PAL.ink, sw: sw * .7, curv: .5 });
    }
    const r = ellPts(3.1 * u, .72 * u, .3 * u, .27 * u, 14); inkLine([...r, r[0], r[1]], sw * 1.4, TK.gold, 'ink', .5);
  };
}
// Part 1's red union headband on lionRun's head (head-local)
function sherBandSide(o = {}) {
  return (u, sw) => {
    const fl = Math.sin(T * 9) * .25 + (o.wind || 0);
    paint(U([[-2.2, -1.75], [2.4, -2.3], [2.55, -1.65], [-2.15, -1.05]], u), { wash: MH.red, ink: MH.ink, sw: sw * .7, curv: .3 });
    paint(U(ribbon([[-2.2, -1.4], [-3.2, -1.6 + fl * .3], [-4.2, -1.0 + fl * .8]], .42, .2), u), { wash: MH.red, ink: MH.ink, sw: sw * .6 });
    paint(U(ribbon([[-2.2, -1.3], [-3.0, -.6 + fl * .2], [-3.8, .3 + fl * .6]], .4, .18), u), { wash: MH.redDk, ink: MH.ink, sw: sw * .6 });
  };
}
// the headband loose in a paw: a red loop with two tails, centred (x, y), s px per unit, a its angle
function heldBand(x, y, s, a, key = 'hband') {
  boilSeed(key);
  push(); translate(x, y); rotate(a);
  const e = ellPts(0, 0, 2.2 * s, .9 * s, 22); paint(ribbon([...e.slice(0, 12)], .55 * s, .55 * s), { wash: MH.red, ink: MH.ink, sw: 1.6 });
  paint(ribbon([...e.slice(11), e[0]], .5 * s, .5 * s), { wash: MH.redDk, ink: MH.ink, sw: 1.6 });
  const fl = Math.sin(T * 8) * .3;
  paint(ribbon([[2.1 * s, .2 * s], [3.0 * s, (.9 + fl) * s], [3.6 * s, (1.8 + fl) * s]], .45 * s, .2 * s), { wash: MH.red, ink: MH.ink, sw: 1.4 });
  pop();
}

// ---------- nine diyas, the rewind mark ----------
// Nine clay lamps across the screen at y (screen space); lit[i] = age since lamp i lit (or null)
function diyaRow(t, lit, y = 590) {
  boilSeed('diyas');
  for (let i = 0; i < 9; i++) {
    const x = 105 + i * 90, a = lit[i];
    push(); translate(x, y); scale(1.3); translate(-x, -y);
    if (a != null && a >= 0) { const k = backOut(clamp(a * 4)); glow(x, y - 30, 70 * k, '#FFB04A', .9); paint([[x, y - 58 * k - 6 * Math.sin(t * 9 + i)], [x + 11 * k, y - 22], [x, y - 12], [x - 11 * k, y - 22]], { wash: '#FFD45A', ink: null, curv: .5 }); paint([[x, y - 42 * k], [x + 5 * k, y - 22], [x, y - 16], [x - 5 * k, y - 22]], { wash: '#FFF6D0', ink: null, curv: .5 }); }
    paint([[x - 34, y - 14], [x + 34, y - 14], [x + 24, y + 10], [x - 24, y + 10]], { wash: '#C8643A', fill: '#9A4424', fillOp: 60, tex: .4, ink: MH.ink, sw: 2, curv: .4 });
    inkLine([[x - 30, y - 8], [x + 30, y - 8]], 2, '#F2B45E', 'inkfine', .3);
    pop();
  }
}
function rewindMark(k, x = 540, y = 960) {
  if (k <= .02) return;
  boilSeed('rewind');
  glow(x, y, 220, '#FFF4DC', .5 * k);
  for (const dx of [-70, 50]) paint([[x + dx + 60, y - 70], [x + dx - 40, y], [x + dx + 60, y + 70]], { wash: '#FFF4DC', washOp: 255 * k, ink: MH.ink, sw: 3 });
}

// ---------- the card ----------
function mahishCard(t, C) {
  boilSeed('cardbg');
  paint(rectPts(-60, -60, W + 120, H + 120), { wash: TK.peach, ink: null });
  boilSeed('cardpetals');
  for (let i = 0; i < 9; i++) {
    const x = 60 + hash(i * 3.3) * 960 + 30 * Math.sin(t * .9 + i), y = frac(hash(i * 7.1) + t * (.035 + .02 * hash(i))) * (H + 80) - 40, r = t * .8 + i;
    paint([[x + Math.cos(r) * 15, y + Math.sin(r) * 15], [x + Math.cos(r + 1.6) * 7, y + Math.sin(r + 1.6) * 7], [x - Math.cos(r) * 15, y - Math.sin(r) * 15], [x + Math.cos(r - 1.6) * 7, y + Math.sin(r - 1.6) * 7]], { wash: i % 2 ? TK.marigold : TK.petal, washOp: 200, ink: null, curv: .5 });
  }
  const X = 470, pk = t0 => Math.max(0, t - t0) * 5, br = Math.sin(t * 1.3) * .01;
  if (t > C.cap) letter("Maa's 9 forms, as picture books", X, 660, 52, TK.teal, { screen: true, font: '50px Marcellus', ink: false, pop: pk(C.cap), maxW: 860 });
  [1, 2, 3].forEach((b, j) => {
    const t0 = C.covers + j * .15; if (t < t0) return;
    const x = X + (j - 1) * 290, y = 900 + (j === 1 ? -16 : 0);
    picture(PICS['book' + b], x, y, 276, 276, { rot: (j - 1) * .05 + (j % 2 ? br : -br), pop: pk(t0), r: 8, shadow: 18 });
    letter('Night ' + b, x, y + 170, 34, TK.rkOrange, { screen: true, font: '700 32px Poppins', ink: false, pop: pk(t0 + .1) });
  });
  if (t > C.price) {
    letter('Books 1–3 · OUT NOW', X, 1160, 46, TK.brown, { screen: true, font: '700 50px Poppins', ink: false, maxW: 860, pop: pk(C.price) });
    letter('Set of 3 for ₹500', X, 1226, 44, TK.rkOrange, { screen: true, font: '700 52px Poppins', ink: false, maxW: 860, pop: pk(C.price + .12) });
  }
  if (t > C.logo) picture(PICS.logo, X, 530, 140, 140, { pop: pk(C.logo) });
  if (t > C.pill) {
    const k = backOut(clamp(pk(C.pill))) * (1 + .03 * pulse(t, 4));
    boilSeed('pill');
    push(); translate(X, 1325); scale(k); paint(rrPts(-220, -44, 440, 88, 44), { wash: TK.rkOrange, ink: null }); pop();
    letter('rishikatha.com', X, 1327, 50, TK.cream, { screen: true, font: '700 52px Poppins', ink: false, pop: pk(C.pill) });
  }
  if (t > C.follow) letter('Follow @therishikatha for more Sher!', X, 1430, 36, TK.grey, { screen: true, font: '500 38px Poppins', ink: false, maxW: 860, pop: pk(C.follow) });
}
