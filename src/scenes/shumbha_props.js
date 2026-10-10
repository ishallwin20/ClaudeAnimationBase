// shumbha_props.js: the sets and effects for "A DEMON KING proposed to MAA DURGA" (src/scenes/shumbha.js). Loaded
// before it; everything here is a pure function of its arguments (and T for boil).
//
//   TK, MH, vanishPuff, sparkleBurst, whipH, veil, petalRain     copied from ad 11
//   battleSet(t, o), heavenSet(t), throne(x, y, s), himalayaSet(t, gold)   the sets (world), from ad 11
//   impact, zoomLines, dust, slashArc, twinkle                   fight effects, from ad 11
//   whipV, crack, streak                                         from ad 12 (Kali's arrival)
//   SB                                                           the palette of this reel
//   roseSet(t)                                                   the hook's plain rose backdrop (screen)
//   garlandPath(p0, p1, h), varmala(P, r, key)                   the marigold varmala along any path
//   propScroll(p0, p1, w, k, key)                                the proposal scroll unrolling from p0 toward p1
//   army(t, o)                                                   60,000 demons: horned silhouettes to the horizon
//   ashPile(x, y, s, age, key), humWave(x, y, age, s, key)       Dhumralochana's ash; the "HUM" shockwave
//   SHAKTI, shaktiOrb(x, y, r, col, k, key)                      the seven shaktis as lights
//   boulder(x, y, w, h, key)                                     the spies' rock
//   rkCard3(t, C)                                                the end card: Books 1–3, set of 3 for ₹500 (ad 13)

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

// ---------- copied from ad 11 (from ad 10) ----------
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

// ---------- this reel ----------
const SB = {
  ink: '#2E1E2A', rose: '#F4C4C0', roseLt: '#FBE2DC', roseDk: '#E59A9C',
  mari: '#F39A2E', mariDk: '#C46A12', mariLt: '#FFC45A', yel: '#FFD45A', yelDk: '#D9A21E', leaf: '#4E9A4A', leafDk: '#2E6A30',
  paper: '#F6E6C4', paperDk: '#D9BF8E', roller: '#B67D1C',
  ash: '#8A8694', ashDk: '#5E5A6A', ashLt: '#B4B0BE',
  rock: '#7E6A86', rockDk: '#5A4A64', rockLt: '#A894A8', snow: '#FFF4D8',
  soldier: '#3A1E3A',
};
// the hook's backdrop: plain rose, a soft light, a few pale hearts drifting up (screen space)
function roseSet(t) {
  boilSeed('rosebg');
  paint(rectPts(-60, -60, W + 120, H + 120), { wash: SB.rose, ink: null });
  glow(540, 1050, 820, '#FFE4DC', .5);
  boilSeed('rosehearts');
  for (let i = 0; i < 7; i++) {
    const a = frac(t * .12 + hash(i * 3.1)), x = 90 + hash(i * 7.7) * 900 + 30 * Math.sin(t + i), y = 1700 - a * 1500, r = 26 + 22 * hash(i);
    paint(heartPts(x, y, r), { wash: SB.roseLt, washOp: 200 * Math.sin(a * Math.PI), ink: null });
  }
}
// a garland's path: from p0 to p1, sagging h px (a U), n points
function garlandPath(p0, p1, h, n = 12) {
  const P = []; for (let i = 0; i < n; i++) { const k = i / (n - 1); P.push([lerp(p0[0], p1[0], k), lerp(p0[1], p1[1], k) + h * 4 * k * (1 - k)]); } return P;
}
// The marigold varmala along path P: orange and yellow flower balls of radius r, a pair of leaves every few, a tassel of
// flowers hanging from the lowest point
function varmala(P, r, key = 'varmala') {
  if (P.length < 2) return;
  boilSeed(key);
  const C = through(P, 6), L = [0];
  for (let i = 1; i < C.length; i++) L.push(L[i - 1] + Math.hypot(C[i][0] - C[i - 1][0], C[i][1] - C[i - 1][1]));
  const tot = L[L.length - 1], n = Math.max(2, Math.floor(tot / (r * 1.45))), at = d => { let i = 1; while (i < L.length - 1 && L[i] < d) i++; const k = (d - L[i - 1]) / ((L[i] - L[i - 1]) || 1); return [lerp(C[i - 1][0], C[i][0], k), lerp(C[i - 1][1], C[i][1], k)]; };
  inkLine(C, Math.max(1, r * .12), SB.leafDk, 'inkfine', .5);
  let low = C[0]; for (const q of C) if (q[1] > low[1]) low = q;
  for (let i = 0; i <= n; i++) {
    const [x, y] = at(i / n * tot), orange = i % 2 === 0;
    if (i % 4 === 2) for (const s of [-1, 1]) paint(ellPts(x + s * r * .9, y + r * .35, r * .55, r * .25, 8, 0, s * .6), { wash: SB.leaf, ink: SB.leafDk, sw: .5 });
    paint(ellPts(x, y, r, r * .92, 12, r * .07), { wash: orange ? SB.mari : SB.yel, fill: orange ? SB.mariDk : SB.yelDk, fillOp: 70, tex: .6, ink: orange ? SB.mariDk : SB.yelDk, sw: .7 });
    inkLine([[x - r * .45, y - r * .1], [x - r * .1, y + r * .25]], .6, orange ? SB.mariDk : SB.yelDk, 'inkfine', 0);
    inkLine([[x + r * .4, y - r * .3], [x + r * .1, y + r * .1]], .6, orange ? SB.mariDk : SB.yelDk, 'inkfine', 0);
  }
  for (let j = 1; j <= 2; j++) paint(ellPts(low[0], low[1] + j * r * 1.3, r * (1 - j * .15), r * .9 * (1 - j * .15), 12, r * .07), { wash: j % 2 ? SB.yel : SB.mari, ink: j % 2 ? SB.yelDk : SB.mariDk, sw: .7 });
}
// The proposal scroll: a gold roller at p0 (where it's held), the paper unrolled toward p1 by k (0..1), w px wide.
// Doodles of everything Shumbha owns (a crown, the elephant, gems, a heart) and wavy "writing" between them.
function propScroll(p0, p1, w, k, key = 'scroll') {
  if (k <= .005) return;
  const dx = p1[0] - p0[0], dy = p1[1] - p0[1], Ltot = Math.hypot(dx, dy), len = Ltot * clamp(k), a = Math.atan2(dy, dx) - Math.PI / 2, s = w / 10;
  boilSeed(key);
  push(); translate(p0[0], p0[1]); rotate(a);
  paint([[-w / 2, 0], [w / 2, 0], [w / 2, len], [-w / 2, len]], { wash: SB.paper, fill: SB.paperDk, fillOp: 60, tex: .5, ink: SB.ink, sw: 1.4 });
  boilSeed(key + 'doodle');
  const marks = [[.1, 'crown'], [.26, 'ele'], [.42, 'gem'], [.58, 'crown'], [.74, 'gem'], [.9, 'heart']];
  for (let i = 0; i < 60; i++) {
    const y = (i + .5) * s * 1.6; if (y > len - s) break;
    if (marks.some(([f]) => Math.abs(y - f * Ltot) < s * 2.6)) continue;
    const x0 = -w * .36 + hash(i) * w * .08, x1 = w * (.2 + .16 * hash(i * 3)), P = [];
    for (let j = 0; j <= 8; j++) P.push([lerp(x0, x1, j / 8), y + Math.sin(j * 2.2 + i) * s * .18]);
    inkLine(P, .9, '#6A4A3A', 'inkfine', .5);
  }
  for (const [f, kind] of marks) {
    const y = f * Ltot; if (y > len - s * 2) continue;
    if (kind === 'crown') paint([[-2 * s, y + 1.2 * s], [-2.2 * s, y - 1 * s], [-1 * s, y], [0, y - 1.5 * s], [1 * s, y], [2.2 * s, y - 1 * s], [2 * s, y + 1.2 * s]], { wash: TK.gold, ink: SB.ink, sw: .9 });
    if (kind === 'gem') { paint([[0, y - 1.5 * s], [1.4 * s, y - .3 * s], [0, y + 1.5 * s], [-1.4 * s, y - .3 * s]], { wash: '#4AA6E0', ink: SB.ink, sw: .9 }); paint([[3 * s, y - .8 * s], [3.8 * s, y], [3 * s, y + .8 * s], [2.2 * s, y]], { wash: '#E2303E', ink: SB.ink, sw: .7 }); }
    if (kind === 'heart') paint(heartPts(0, y, 1.6 * s), { wash: '#E2303E', ink: SB.ink, sw: .9 });
    if (kind === 'ele') {
      paint(ellPts(0, y, 2.2 * s, 1.5 * s, 16), { wash: '#EEF0F4', ink: SB.ink, sw: .9 });
      paint(ellPts(1.8 * s, y - 1 * s, 1.1 * s, 1 * s, 12), { wash: '#EEF0F4', ink: SB.ink, sw: .9 });
      paint(ribbon([[2.6 * s, y - .6 * s], [3.2 * s, y + .6 * s], [3.0 * s, y + 1.6 * s]], .6 * s, .35 * s), { wash: '#EEF0F4', ink: SB.ink, sw: .8 });
      for (const lx of [-1.3, -.4, .5, 1.3]) inkLine([[lx * s, y + 1.2 * s], [lx * s, y + 2.2 * s]], 1.6, SB.ink, 'ink', 0);
    }
  }
  boilSeed(key + 'roll');
  // the roller where it's held, and the rolled end
  paint(rrPts(-w / 2 - s * 1.4, -s * .8, w + s * 2.8, s * 1.6, s * .8), { wash: SB.roller, fill: TK.goldDk, fillOp: 60, ink: SB.ink, sw: 1.4 });
  if (k < .995) paint(rrPts(-w / 2 - s * .4, len - s * 1.1, w + s * .8, s * 2.2, s * 1.1), { wash: SB.paper, fill: SB.paperDk, fillOp: 90, ink: SB.ink, sw: 1.4 });
  pop();
}
// 60,000 demons: rows of horned silhouettes on the plain toward the horizon (world; battleSet's horizon is y 1190).
// o: flee 0..1 (they turn tail and run off to the right, tumbling), x0 / x1 (the span), laugh (they bounce)
function army(t, o = {}) {
  const rows = [[1212, 9, 16], [1240, 8, 24], [1282, 7, 34], [1334, 6, 46]], fl = clamp(o.flee || 0), x0 = o.x0 ?? 380, x1 = o.x1 ?? 1250;
  rows.forEach(([y, n, s], r) => {
    const col = mixCol(SB.soldier, '#A8344A', .45 - r * .12);
    for (let i = 0; i < n; i++) {
      const id = r * 20 + i, hx = hash(id * 1.3), x = lerp(x0, x1, (i + .5 * hx) / n) + (r % 2) * s * .8, b = -Math.abs(Math.sin(t * (o.laugh ? 12 : 6) + id)) * s * .14;
      const run = fl * (900 + 500 * hash(id * 2.1)) * (.6 + r * .2), px = x + run, py = y + b - Math.sin(fl * Math.PI) * s * .8 * hash(id), rot = fl * (hash(id * 4) - .5) * 2.4;
      if (px > 1500) continue;
      boilSeed('army' + id);
      push(); translate(px, py); rotate(rot);
      inkLine([[s * .5, -s * 2.4], [s * .62, s * .1]], Math.max(1, s * .09), col, 'ink', 0);   // the spear
      paint([[s * .5, -s * 2.4], [s * .62, -s * 2.95], [s * .74, -s * 2.4]], { wash: '#C9D3DF', ink: null });
      paint(rrPts(-s * .55, -s * 1.15, s * 1.1, s * 1.15, s * .35), { wash: col, ink: null });
      paint(ellPts(0, -s * 1.45, s * .46, s * .44, 10), { wash: col, ink: null });
      for (const k of [-1, 1]) paint([[k * s * .25, -s * 1.75], [k * s * .62, -s * 2.15], [k * s * .45, -s * 1.6]], { wash: '#E6D8C0', ink: null });
      if (s > 30) for (const k of [-1, 1]) paint(ellPts(k * s * .17, -s * 1.48, s * .08, s * .07, 6), { wash: '#FFD84A', ink: null });
      pop();
    }
  });
}
// Dhumralochana's ash: a grey mound with two blinking eyes in it and a wisp of smoke (age 0..; s the mound's half-width)
function ashPile(x, y, s, age, key = 'ash') {
  if (age < 0) return;
  const k = backOut(clamp(age / .3)), P = [];
  for (let i = 0; i <= 14; i++) { const a = Math.PI + i / 14 * Math.PI; P.push([x + Math.cos(a) * s, y + Math.sin(a) * s * .55 * k]); }
  boilSeed(key);
  paint(ellPts(x, y + 6, s * 1.15, s * .18, 18), { fill: PAL.ink, fillOp: 70, bleed: .2, ink: null });
  paint(P, { wash: SB.ash, fill: SB.ashDk, fillOp: 70, tex: .7, ink: SB.ashDk, sw: 1.4, curv: .4 });
  for (let i = 0; i < 9; i++) paint(ellPts(x + (hash(i) - .5) * s * 1.4, y - hash(i * 3) * s * .4 * k, 4, 3, 6), { wash: i % 2 ? SB.ashLt : SB.ashDk, ink: null });
  if (age > .5) {
    const bl = frac(age * .45) < .06, ey = y - s * .28 * k;
    for (const sx of [-1, 1]) {
      if (bl) inkLine([[x + sx * s * .2 - 9, ey], [x + sx * s * .2 + 9, ey]], 2, SB.ink, 'ink', 0);
      else { paint(ellPts(x + sx * s * .2, ey, 10, 12, 10), { wash: '#FFF8EC', ink: SB.ink, sw: .8 }); paint(ellPts(x + sx * s * .2 + Math.sin(age * 2) * 3, ey + 2, 4.5, 5.5, 8), { wash: SB.ink, ink: null }); }
    }
  }
  boilSeed(key + 'smoke');
  for (let i = 0; i < 4; i++) { const a = frac(age * .5 + i / 4), r = s * (.1 + .2 * a); paint(ellPts(x + Math.sin(a * 5 + i) * s * .2, y - s * .5 - a * s * 1.6, r, r * .85, 10), { wash: SB.ashLt, washOp: 200 * (1 - a), ink: null }); }
}
// the "HUM" shockwave: three gold rings out of (x, y) (age 0..)
function humWave(x, y, age, s, key = 'hum') {
  if (age < 0 || age > 1) return;
  boilSeed(key);
  glow(x, y, s * (1 + age * 2), '#FFD27A', .9 * (1 - age));
  for (let j = 0; j < 3; j++) {
    const a = age - j * .12; if (a <= 0) continue;
    const R = s * (1.6 + 3 * easeOut(a)), e = ellPts(x, y, R, R * .9, 40, 2), f = clamp(1 - a / .85);
    inkLine([...e, e[0], e[1]], (7 - j * 2) * f + 1, j ? '#FFE8A0' : '#FFF6DC', 'ink', .5);
  }
}
// The seven shaktis (Brahmani, Maheshvari, Kaumari, Vaishnavi, Varahi, Narasimhi, Aindri) as lights
const SHAKTI = ['#F2C230', '#9CC8F6', '#F47A24', '#4A72D8', '#9A7AD8', '#E2303E', '#52C8C0'];
function shaktiOrb(x, y, r, col, k = 1, key = 'shakti') {
  if (k <= .02) return;
  boilSeed(key);
  glow(x, y, r * 2.6 * k, col, .85);
  glow(x, y, r * 1.1 * k, '#FFFFFF', .5);
  paint(ellPts(x, y, r * k, r * k, 22), { wash: mixCol(col, '#FFFFFF', .5), washOp: 235, ink: mixCol(col, SB.ink, .45), sw: 1.8 });
  paint(starPts(x, y, r * .6 * k, .3, 4, -Math.PI / 2 + T * 1.5), { wash: '#FFFDF2', ink: null });
}
// a boulder with a lit snow cap: (x, y) the middle of its base, w × h
function boulder(x, y, w, h, key = 'rock') {
  boilSeed(key);
  const P = [[x - w / 2, y], [x - w * .46, y - h * .55], [x - w * .3, y - h * .92], [x - w * .05, y - h], [x + w * .25, y - h * .9], [x + w * .45, y - h * .6], [x + w / 2, y]];
  paint(P, { wash: SB.rock, fill: SB.rockDk, fillOp: 80, tex: .6, ink: SB.ink, sw: 2, curv: .3 });
  paint([[x - w * .4, y - h * .62], [x - w * .28, y - h * .9], [x - w * .05, y - h * .98], [x + w * .22, y - h * .88], [x + w * .38, y - h * .66], [x + w * .1, y - h * .74], [x - w * .15, y - h * .68]], { wash: SB.snow, ink: null, curv: .3 });
  inkLine([[x - w * .1, y - h * .5], [x + w * .05, y - h * .3], [x - w * .02, y - h * .1]], 1.4, SB.rockDk, 'inkfine', .4);
}

// ---------- copied from ad 12 ----------
function whipV(k, t = 0, cols = ['#C9CCF2', '#FF8A96']) {
  if (k <= .02) return;
  boilSeed('whipv');
  for (let i = 0; i < 16; i++) {
    const x = 60 + hash(i * 2.7) * (W - 120), l = 600 + 900 * hash(i * 5.3), y = ((hash(i * 9.1) * 3000 - t * 5200) % (H + l) + H + l) % (H + l) - l * .5, w = 5 + 14 * hash(i * 1.3);
    paint(ribbon([[x, y - l / 2], [x + 3, y], [x, y + l / 2]], w * .3, w), { wash: i % 4 ? cols[0] : cols[1], washOp: 190 * clamp(k) * (.5 + .5 * hash(i)), ink: null });
  }
}
// ---------- Kali's arrival ----------
// cracks spreading from (x, y) on the ground, age 0..
function crack(x, y, age, s = 300, key = 'crack') {
  if (age < 0) return;
  const k = easeOut(clamp(age / .25)), fade = 1 - seg(age, 2.5, 3.2);
  if (fade <= 0) return;
  boilSeed(key);
  for (let i = 0; i < 7; i++) {
    const a = Math.PI * (i / 6) * (hash(i) > .5 ? 1 : -1) + hash(i * 3) * .3, L = s * (.5 + .6 * hash(i * 5)) * k, P = [[x, y]];
    for (let j = 1; j <= 4; j++) P.push([x + Math.cos(a) * L * j / 4 + (hash(i * 7 + j) - .5) * 24, y + Math.sin(a) * L * j / 4 * .35 + (hash(i * 11 + j) - .5) * 10]);
    inkLine(P, 3.2 * fade, '#1A1430', 'ink', .1);
  }
  glow(x, y, s * .8, '#7A86FF', .5 * (1 - clamp(age / .6)));
}
// her streak: a night-blue bolt from p0 that runs off toward p1, k 0..1 the head of it (screen or world)
function streak(p0, p1, k, t, key = 'streak') {
  if (k <= 0) return;
  boilSeed(key + Math.floor(t * 24));
  const P = [];
  for (let i = 0; i <= 12; i++) { const q = i / 12 * k, d = Math.sin(q * 20 + t * 40) * 26 * (1 - q * .5); P.push([lerp(p0[0], p1[0], q) + d, lerp(p0[1], p1[1], q)]); }
  glow(P[12][0], P[12][1], 260, '#5A6CFF', .9);
  paint(ribbon(P, 8, 70), { wash: '#2D4C9E', ink: null });
  inkLine(P, 9, '#A9BCFF', 'ink', .1);
  inkLine(P, 3, '#FFFFFF', 'ink', .1);
}

// ---------- the card (copied from ad 13) ----------
function rkCard3(t, C) {
  boilSeed('cardbg');
  paint(rectPts(-60, -60, W + 120, H + 120), { wash: TK.peach, ink: null });
  boilSeed('cardpetals');
  for (let i = 0; i < 9; i++) {
    const x = 60 + hash(i * 3.3) * 960 + 30 * Math.sin(t * .9 + i), y = frac(hash(i * 7.1) + t * (.035 + .02 * hash(i))) * (H + 80) - 40, r = t * .8 + i;
    paint([[x + Math.cos(r) * 15, y + Math.sin(r) * 15], [x + Math.cos(r + 1.6) * 7, y + Math.sin(r + 1.6) * 7], [x - Math.cos(r) * 15, y - Math.sin(r) * 15], [x + Math.cos(r - 1.6) * 7, y + Math.sin(r - 1.6) * 7]], { wash: i % 2 ? TK.marigold : TK.petal, washOp: 200, ink: null, curv: .5 });
  }
  const X = 470, pk = t0 => Math.max(0, t - t0) * 5, br = Math.sin(t * 1.3) * .008;
  if (t > C.logo) picture(PICS.logo, X, 545, 140, 140, { pop: pk(C.logo) });
  if (t > C.cap) letter("Maa's 9 forms, as picture books", X, 665, 50, TK.teal, { screen: true, font: '50px Marcellus', ink: false, pop: pk(C.cap), maxW: 860 });
  // the three covers fanned, the middle one on top
  if (t > C.covers) [['book1', -1], ['book3', 1], ['book2', 0]].forEach(([b, i], j) => {
    const a = Math.max(0, t - C.covers - j * .12);
    if (a > 0) picture(PICS[b], X + i * 215, 960 + Math.abs(i) * 30, 270, 270, { rot: i * .1 + br, pop: a * 5, r: 10, shadow: 22 });
  });
  if (t > C.price) letter('Books 1–3 · Set of 3 for ₹500', X, 1225, 40, TK.brown, { screen: true, font: '700 40px Poppins', ink: false, maxW: 880, pop: pk(C.price) });
  if (t > C.pill) {
    const k = backOut(clamp(pk(C.pill))) * (1 + .03 * pulse(t, 4));
    boilSeed('pill');
    push(); translate(X, 1340); scale(k); paint(rrPts(-220, -44, 440, 88, 44), { wash: TK.rkOrange, ink: null }); pop();
    letter('rishikatha.com', X, 1342, 50, TK.cream, { screen: true, font: '700 52px Poppins', ink: false, pop: pk(C.pill) });
  }
  if (t > C.follow) letter('Follow @therishikatha for more!', X, 1440, 36, TK.grey, { screen: true, font: '500 38px Poppins', ink: false, maxW: 860, pop: pk(C.follow) });
}
