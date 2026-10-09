// rakt_props.js: the sets and effects for "Why is Maa Kali's TONGUE out?" (src/scenes/rakt.js). Loaded before it;
// everything here is a pure function of its arguments (and T for boil).
//
//   TK, vanishPuff, sparkleBurst, whipH, veil, impact, zoomLines, dust, twinkle, ridge   copied from ad 11
//   RK                                       the palette of this reel
//   whipV(k, t)                              vertical streaks (the camera whips down after the drop)
//   nightSet(t, o)                           the moonlit battlefield (world); o.bounce shakes it for the dance
//   ripple(x, y, age, s), dropArc(...)       a drop landing; a ruby drop flying on an arc
//   CROWD, crowdAlive, drawCrowd(t, o)       the clone crowd: slots with birth (sprout) and death (pop) times
//   rbPhone(u, sw, flash), rbBand(o)         the selfie clone's phone; Sher's red headband on a clone
//   buriedClone(x, y, u, age, key)           a clone that sprouted upside down: legs kicking out of the ground
//   tongueCarpet(o)                          Kali's tongue unrolled along the ground like a red carpet
//   crack(x, y, age, s), streak(...)         the ground cracking at her landing; her streak out of Durga's forehead
//   rkCard(t, C)                             the end card: Book 7 coming soon, Books 1–3 out now
const TK = {
  ink: '#2B2233', cream: '#FFF5E2',
  petal: '#F4A6B8', petalDk: '#E0708C', marigold: '#F39A2E', yellow: '#FFD45A', leaf: '#5E9A6A',
  gold: '#EDB43C', goldLt: '#FFE39A', goldDk: '#B67D1C',
  rkOrange: '#F15A24', peach: '#FBE0CF', peachLt: '#FFF1E6', brown: '#3A2418', grey: '#6B5A50', teal: '#2E5F5A',
};
const RK = {
  ink: '#1E1A30',
  skyTop: '#0B1030', skyMid: '#1A2560', skyLow: '#3A3A7E', skyHz: '#5A4E92', moon: '#FFF2D2', moonDk: '#EAD7AE', star: '#FFF1C8',
  hillFar: '#26306A', hillNear: '#1A2252', ground: '#3C4A66', groundDk: '#2C3852', groundLt: '#56658A', stone: '#6A7898',
  plain: '#1A1F4A', plainLt: '#2C3370', crimson: '#C8233A', puff: ['#7A5A8E', '#B49AC8'],
};
const GY = 1640, HZ = 1180;   // the battlefield's ground line for the main characters, and the horizon

// ---------- copied from ad 11 ----------
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
}
function whipV(k, t = 0, cols = ['#C9CCF2', '#FF8A96']) {
  if (k <= .02) return;
  boilSeed('whipv');
  for (let i = 0; i < 16; i++) {
    const x = 60 + hash(i * 2.7) * (W - 120), l = 600 + 900 * hash(i * 5.3), y = ((hash(i * 9.1) * 3000 - t * 5200) % (H + l) + H + l) % (H + l) - l * .5, w = 5 + 14 * hash(i * 1.3);
    paint(ribbon([[x, y - l / 2], [x + 3, y], [x, y + l / 2]], w * .3, w), { wash: i % 4 ? cols[0] : cols[1], washOp: 190 * clamp(k) * (.5 + .5 * hash(i)), ink: null });
  }
}
function veil(col, a) {
  if (a <= .004) return;
  flushBrush(); const c = color(col);
  push(); resetMatrix(); translate(-W / 2, -H / 2); noStroke(); fill(red(c), green(c), blue(c), 255 * clamp(a)); rect(-4, -4, W + 8, H + 8); pop();
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
  inkLine([...e, e[0], e[1]], 10 * (1 - k) + 1, '#FFF4DC', 'ink', .5);
  for (let i = 0; i < 10; i++) { const a = i / 10 * TAU + hash(i * 2) * .5, d = s * (.4 + 1.5 * easeOut(k)) * (.6 + .5 * hash(i)); paint(starPts(x + Math.cos(a) * d, y + Math.sin(a) * d, s * .14 * (1 - k), .3, 4), { wash: i % 2 ? '#FFE08A' : '#FFF4DC', ink: null }); }
}
function zoomLines(cx, cy, k, t, col = '#FFF4DC') {
  if (k <= .02) return;
  boilSeed('zoom ' + Math.floor(t * 12));
  for (let i = 0; i < 40; i++) {
    const a = hash(i * 3.3 + Math.floor(t * 12)) * TAU, r0 = 420 + 200 * hash(i * 1.7), r1 = 1500, w = 3 + 9 * hash(i * 5.1);
    paint([[cx + Math.cos(a - .004 * w) * r1, cy + Math.sin(a - .004 * w) * r1], [cx + Math.cos(a) * r0, cy + Math.sin(a) * r0], [cx + Math.cos(a + .004 * w) * r1, cy + Math.sin(a + .004 * w) * r1]], { wash: col, washOp: 200 * clamp(k), ink: null });
  }
}
function dust(x, y, s, age, key = 'dust') { vanishPuff(x, y, s, age, key, ['#8A92B0', '#B8C0D8']); }
function twinkle(x, y, age, s = 40, key = 'twinkle') {
  if (age < 0 || age > .6) return;
  boilSeed(key);
  const k = Math.sin(age / .6 * Math.PI);
  glow(x, y, s * 2 * k, '#FFF4C8', .9 * k);
  paint(starPts(x, y, s * k, .25, 4, -Math.PI / 2 + age * 2), { wash: '#FFFDF2', ink: null });
}
function ridge(x0, x1, y, amp, sc, scroll, n = 40) {
  const P = [];
  for (let i = 0; i <= n; i++) { const x = lerp(x0, x1, i / n), q = (x + scroll) * sc; P.push([x, y - amp * (.55 + .3 * Math.sin(q) + .2 * Math.sin(q * 2.3 + 1.7) + .15 * Math.sin(q * 5.1 + .4))]); }
  return P;
}

// ---------- the set ----------
// The moonlit battlefield, world space (at zoom 1 the frame shows x 0..1080; it reaches far past for pull-backs).
// o: bounce 0..1 (the dance: hills and moon jump on each stomp, with o.beat the time since the last stomp),
//    moonX / moonY, stars (default 1)
function nightSet(t, o = {}) {
  const bo = o.bounce || 0, ba = o.beat ?? 9, hop = bo * Math.max(0, 1 - ba / .35) * Math.sin(Math.min(1, ba / .35) * Math.PI);
  boilSeed('nsky');
  paint(rectPts(-1600, -2600, 4300, 6800), { wash: RK.skyTop, ink: null });
  paint(rectPts(-1600, 300, 4300, 700), { fill: RK.skyMid, fillOp: 220, bleed: .25, tex: .3, ink: null });
  paint(rectPts(-1600, 820, 4300, 420), { fill: RK.skyLow, fillOp: 230, bleed: .25, tex: .3, ink: null });
  if ((o.stars ?? 1) > 0) {
    boilSeed('nstars');
    for (let i = 0; i < 70; i++) { const x = hash(i * 1.3) * 3600 - 1300, y = hash(i * 2.9) * 2300 - 1300, tw = .55 + .45 * Math.sin(t * 2.6 + i * 1.7); paint(starPts(x, y - hop * 30 * hash(i), (4 + 7 * hash(i * 4)) * tw, .35, 4), { wash: RK.star, ink: null }); }
  }
  const mx = o.moonX ?? 830, my = (o.moonY ?? 660) - hop * 60, mr = 220;
  glow(mx, my, mr * 2.6, '#BFC8FF', .5);
  boilSeed('nmoon');
  paint(ellPts(mx, my, mr, mr, 40), { wash: RK.moon, ink: null });
  for (const [cx, cy, r] of [[-70, -40, 46], [60, 50, 34], [20, -95, 22], [-40, 90, 26], [95, -30, 18]]) paint(ellPts(mx + cx, my + cy, r, r * .9, 14), { fill: RK.moonDk, fillOp: 140, bleed: .15, tex: .4, ink: null });
  glow(mx, my, mr * 1.3, '#FFF6DE', .35);
  boilSeed('nhillf');
  paint([...ridge(-1600, 2700, HZ - 50 - hop * 40, 280, .0035, 0), [2700, HZ + 80], [-1600, HZ + 80]], { wash: RK.hillFar, ink: null });
  boilSeed('nhilln');
  paint([...ridge(-1600, 2700, HZ + 10 - hop * 22, 150, .006, 300), [2700, HZ + 80], [-1600, HZ + 80]], { wash: RK.hillNear, ink: null });
  boilSeed('nground');
  paint(rectPts(-1600, HZ, 4300, 3400), { wash: RK.ground, fill: RK.groundDk, fillOp: 90, bleed: .1, tex: .6, ink: null });
  paint(rectPts(-1600, HZ, 4300, 160), { fill: RK.groundDk, fillOp: 120, bleed: .2, tex: .4, ink: null });
  inkLine([[-1600, HZ + 2], [500, HZ - 2], [2700, HZ + 3]], 2.2, RK.groundDk, 'dry', .3);
  boilSeed('nstones');
  for (let i = 0; i < 44; i++) {
    const y = HZ + 40 + Math.pow(i / 44, 1.3) * 1900, x = hash(i * 3.1) * 3200 - 1100, s = .5 + (y - HZ) / 900;
    if (i % 3 === 0) paint(ellPts(x, y, (10 + 8 * hash(i)) * s, (5 + 3 * hash(i * 2)) * s, 8, 1), { wash: RK.groundDk, ink: null });
    else inkLine([[x - (40 + 40 * hash(i * 5)) * s, y], [x + 50 * s, y + 2]], (1.5 + 2 * hash(i)) * s, RK.groundLt, 'dry', .2);
  }
}

// ---------- drops ----------
// a drop landing at (x, y): a little crown splash and a ripple ring (age 0..)
function ripple(x, y, age, s = 30, key = 'rip', col = RK.crimson) {
  if (age < 0 || age > .5) return;
  const k = age / .5; boilSeed(key);
  const e = ellPts(x, y, s * (.3 + 1.3 * easeOut(k)), s * (.12 + .45 * easeOut(k)), 24);
  inkLine([...e, e[0], e[1]], 3 * (1 - k) + .5, col, 'ink', .5);
  for (let i = 0; i < 5; i++) { const a = -Math.PI * (.15 + .7 * i / 4), d = s * (.3 + .9 * k); paint(ellPts(x + Math.cos(a) * d, y + Math.sin(a) * d * 1.4 + k * k * s, s * .1 * (1 - k), s * .12 * (1 - k), 6), { wash: col, ink: null }); }
}
// a ruby drop flying from p0 to p1 on an arc of height h, at progress k (0..1); r its size
function dropArc(p0, p1, h, k, key, r = 12, sw = 1.3) {
  if (k <= 0 || k >= 1) return;
  const p = arcPt(p0, p1, h, k), q = arcPt(p0, p1, h, Math.min(1, k + .03));
  bloodSeed(p[0], p[1], r, Math.atan2(q[1] - p[1], q[0] - p[0]) + Math.PI / 2 + Math.PI, key, sw);
}

// ---------- the crowd ----------
// Slots: { x, y, u, born (sprout time), dies (pop time), seed, kind }. Born in waves with the hits; they die in E as
// the tongue catches the drops, in a wave outward from Kali. The tongue's lane (y 1770..1910) stays empty.
const LANE = [1770, 1915];
const depthU = y => 20 * clamp(lerp(.3, 1, (y - HZ) / (GY - HZ)), .26, 1.7);
const CROWD = (() => {
  const S = [];
  // the first waves (explicit): after SLAP1 (3), after SLAP2 (5; the sixth sprouts on Sher's head, drawn by the scene)
  [[650, 1748, 16.55], [1010, 1700, 16.62], [860, 1540, 16.7],
   [1060, 1590, 18.2], [600, 1560, 18.26], [1180, 1740, 18.32], [940, 1440, 18.38], [740, 1460, 18.44]].forEach(([x, y, b], i) => S.push({ x, y, born: b, seed: i + 1, early: 1 }));
  let k = 0;
  while (S.length < 118 && k < 4000) {
    k++;
    const x = -520 + hash(k * 3.17) * 2160, y = HZ + 25 + Math.pow(hash(k * 7.31), .85) * 1650;
    if (y > LANE[0] - 25 && y < LANE[1] + 20) continue;
    if (x < 600 && y > 1480 && y < LANE[0]) continue;                  // Durga and Sher
    if (x > 380 && x < 1100 && y > LANE[1] && y < 2050) continue;     // the gag stage in front
    const du = depthU(y);
    if (S.some(s => Math.abs(s.x - x) < 6.2 * Math.min(du, depthU(s.y)) && Math.abs(s.y - y) < 2.2 * Math.min(du, depthU(s.y)))) continue;
    S.push({ x, y, seed: k + 20 });
  }
  // births: the chakra wave rolls outward from the fight (19.25 → 21.0), so the counter grows
  for (const s of S) if (!s.early) s.born = 19.25 + 1.75 * clamp(Math.hypot(s.x - 760, (s.y - 1620) * 1.6) / 1500);
  for (const s of S) { s.u = depthU(s.y); s.look = hash(s.seed * 1.91); }
  // deaths: a wave outward from Kali's tongue root (33.25 → 35.45)
  const order = [...S].sort((a, b) => Math.hypot(a.x - 300, (a.y - 1840) * 1.4) - Math.hypot(b.x - 300, (b.y - 1840) * 1.4));
  order.forEach((s, i) => { s.dies = 33.25 + 2.2 * i / (order.length - 1); });
  S.sort((a, b) => a.y - b.y);   // back to front
  return S;
})();
// the clone look for a slot at time t: laughing and showing off until GULP, then scared stiff
function slotOpts(s, t, gulp) {
  const lk = s.look, ph = s.seed * .7, b = bpOf(t);
  if (t > gulp) return { eyes: lk < .5 ? 'scared' : 'wide', mouth: lk < .3 ? 'O' : 'wobble', shake: .5, sweat: frac(t * .8 + lk), mace: lk > .5, brows: .8, seed: s.seed };
  const o = { seed: s.seed, eyes: lk < .35 ? 'happy' : lk < .7 ? 'normal' : 'side', mouth: lk < .5 ? 'open' : lk < .8 ? 'grin' : 'smirk', mouthK: .7 + .4 * Math.abs(Math.sin(t * 11 + ph)), lookX: lk > .7 ? -1 : 0, mace: lk > .25 };
  if (lk > .6) { o.handR = [4.6, -8.6 + .5 * Math.sin(t * 7 + ph)]; o.maceA = Math.sin(t * 7 + ph) * .4; }
  if (lk < .4) o.hop = Math.abs(Math.sin((b + lk) * Math.PI)) * 1.2;
  return o;
}
// Draw the crowd: o.gulp (time of the mass gulp), o.cull(s) → true to skip a slot, o.lodBelow (screen-u threshold
// under which a slot draws as a cheap silhouette), o.zoom (the camera's), o.over(s, t) → extra options for a slot
function drawCrowd(t, o = {}) {
  const z = o.zoom ?? 1, gulp = o.gulp ?? 1e9;
  for (const s of CROWD) {
    if (t < s.born || (o.cull && o.cull(s))) continue;
    const da = t - s.dies;
    if (da > 0) { vanishPuff(s.x, s.y - s.u * 5, s.u * 6, da, 'dp' + s.seed, RK.puff); continue; }
    const g = clamp((t - s.born) / .62), lod = s.u * z < (o.lodBelow ?? 9) ? 1 : 0;
    raktabija(s.x, s.y, s.u, { ...slotOpts(s, t, gulp), grow: g, lod, boilKey: 'c' + s.seed, swMul: lod ? 1 : .9, ...((o.over && o.over(s, t)) || {}) });
    if (g > .3 && g < 1) vanishPuff(s.x, s.y - s.u * 2, s.u * 3.2, (t - s.born) - .2, 'cp' + s.seed, ['#6A5070', '#9A86A8']);
  }
}
const crowdAlive = t => CROWD.filter(s => t >= s.born && t < s.dies).length;

// ---------- gag props ----------
// the selfie clone's phone, held at (0, 0) by its bottom edge, screen toward him (we see its back and the lens)
function rbPhone(u, sw, flash = 0) {
  paint(rrPts(-.55 * u, -1.9 * u, 1.1 * u, 1.85 * u, .18 * u), { wash: '#2A2838', ink: RKB.ink, sw: sw * .5 });
  paint(ellPts(-.22 * u, -1.6 * u, .16 * u, .16 * u, 8), { wash: '#6A7AA8', ink: null });
  paint(ellPts(.15 * u, -1.6 * u, .09 * u, .09 * u, 6), { wash: '#FFF4C8', ink: null });
  if (flash > .01) { glow(.15 * u, -1.6 * u, u * 5 * flash, '#FFFFFF', flash); paint(starPts(.15 * u, -1.6 * u, u * 1.6 * flash, .2, 4), { wash: '#FFFFFF', ink: null }); }
}
// Part 1's red union headband on a clone (raktabija's hat hook, body space)
function rbBand(o = {}) {
  return (u, sw) => {
    const fl = Math.sin(T * 9) * .25;
    paint(U([[-2.9, -9.15], [2.9, -9.15], [3.05, -8.45], [-3.05, -8.45]], u), { wash: '#D2352C', ink: RKB.ink, sw: sw * .7, curv: .3 });
    paint(U(ribbon([[2.9, -8.8], [3.9, -8.9 + fl * .3], [4.8, -8.3 + fl * .8]], .45, .2), u), { wash: '#D2352C', ink: RKB.ink, sw: sw * .6 });
    paint(U(ribbon([[2.9, -8.7], [3.6, -7.9 + fl * .2], [4.3, -7.1 + fl * .6]], .42, .18), u), { wash: '#9E2420', ink: RKB.ink, sw: sw * .6 });
  };
}
// a clone that sprouted upside down: shorts and legs kicking out of a mound; age since it sprouted
function buriedClone(x, y, u, age, key = 'buried') {
  if (age < 0) return;
  const k = backOut(clamp(age / .4)), sw = clamp(u / 20, .35, 2), kick = Math.sin(age * 13);
  boilSeed(key);
  paint(ellPts(x, y + u * .2, u * 4.2, u * .9, 18), { fill: PAL.ink, fillOp: 70, bleed: .2, tex: .3, ink: null });
  push(); translate(x, y); scale(k);
  for (const s of [-1, 1]) {
    const a = s * (.25 + .25 * (s < 0 ? kick : -kick)), lx = s * 1.2 * u, top = -4.4 * u;
    push(); translate(lx, -2.2 * u); rotate(a);
    paint(U([[-.7, 0], [.7, 0], [.6, -2.2], [-.6, -2.2]], u), { wash: RKB.skinDk, ink: RKB.ink, sw: sw * .7 });
    paint(ellPts(0, -2.4 * u, 1.15 * u, .55 * u, 14), { wash: RKB.skin, ink: RKB.ink, sw: sw * .8 });
    for (const q of [-.5, 0, .5]) inkLine(U([[q, -2.85], [q, -2.6]], u), sw * .45, RKB.skinDk, 'inkfine', 0);
    pop();
  }
  paint(U([[-3.2, 0], [-3.0, -1.6], [-2.0, -2.5], [0, -2.0], [2.0, -2.5], [3.0, -1.6], [3.2, 0]], u), { wash: RKB.shorts, fill: RKB.shortsDk, fillOp: 60, tex: .5, ink: RKB.ink, sw: sw * .8, curv: .3 });
  paint(ribbon(U([[-3.3, -.2], [0, -.35], [3.3, -.2]], u), .5 * u, .5 * u), { wash: RKB.gold, ink: RKB.ink, sw: sw * .5 });
  paint(U([[-4.2, .6], [-3.4, -.6], [-1.5, -.9], [0, -.5], [1.5, -.9], [3.4, -.6], [4.2, .6]], u), { wash: '#4E4A5E', fill: RK.groundDk, fillOp: 70, tex: .6, ink: RKB.ink, sw: sw * .8, curv: .4 });   // the mound
  pop();
}

// ---------- the tongue carpet ----------
// o: mouth [x, y], root [x, y] (where it meets the ground), front (x of the unrolled edge), y (the lane's centre line),
//    w (its width on the ground), u (Kali's u: the width at her mouth), bump { x, k } (it flicks up there), drops: list of
//    x positions with ages for the plip ripples, key
function tongueCarpet(o) {
  const [mx, my] = o.mouth, [rx, ry] = o.root, f = o.front, y = o.y, w = o.w, u = o.u;
  // the hanging part: from her mouth down to the ground, widening
  const P = [[mx, my], [mx + u * .5, lerp(my, ry, .45)], [lerp(mx, rx, .6), ry - w * .9], [rx, ry - w * .25]];
  kaliTongue(P, u * 1.05, { key: (o.key || 'tc') + 'v', tipK: (w * .6) / (u * 1.05), sw: 1.6 });
  if (f <= rx + 10) return;
  // the flat part along the ground (a ribbon with a groove and a sheen), and the roll at the front
  boilSeed((o.key || 'tc') + 'f');
  const n = 26, pts = [];
  for (let i = 0; i <= n; i++) {
    const x = lerp(rx, f, i / n), bk = o.bump ? o.bump.k * Math.exp(-(((x - o.bump.x) / 70) ** 2)) : 0;
    pts.push([x, y - bk * 150 + Math.sin(x * .02 + T * 3) * 2]);
  }
  paint(ribbon(pts, w, w * .94), { wash: KALI.tongue, fill: KALI.tongueDk, fillOp: 45, tex: .4, ink: SHL.ink, sw: 1.8 });
  inkLine(pts.slice(1, -1).map(([a, b]) => [a, b + 2]), 2.2, KALI.tongueDk, 'inkfine', .3);
  inkLine(pts.slice(2, Math.max(3, Math.floor(n * .7))).map(([a, b]) => [a, b - w * .26]), 3, KALI.tongueLt, 'inkfine', .3);
  for (const [dx, age] of o.drops || []) ripple(dx, y, age, w * .45, 'tdrop' + Math.round(dx), KALI.tongueDk);
  const r = o.roll ?? 0;
  if (r <= 4) {   // fully out: the rounded tip of the tongue
    boilSeed((o.key || 'tc') + 't');
    const e = pts[n];
    paint(ellPts(e[0], e[1], w * .55, w * .47, 18), { wash: KALI.tongue, ink: null });
    const arc = []; for (let i = 0; i <= 10; i++) { const b = -Math.PI / 2 + i / 10 * Math.PI; arc.push([e[0] + Math.cos(b) * w * .55, e[1] + Math.sin(b) * w * .47]); }
    inkLine(arc, 1.8, SHL.ink, 'ink', .5);
  }
  if (r > 4) {   // the roll: a red cylinder lying across the lane, its spiral end toward us
    boilSeed((o.key || 'tc') + 'r');
    const cx = f, cy = y - r * .55;
    paint(ellPts(cx, cy, r, r, 22), { wash: KALI.tongue, fill: KALI.tongueDk, fillOp: 60, tex: .4, ink: SHL.ink, sw: 1.8 });
    const sp = []; for (let i = 0; i < 26; i++) { const a = i * .55 - T * 14, rr = r * (.85 - i * .03); sp.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); }
    inkLine(sp, 2, KALI.tongueDk, 'inkfine', .5);
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

// ---------- the card ----------
function rkCard(t, C) {
  boilSeed('cardbg');
  paint(rectPts(-60, -60, W + 120, H + 120), { wash: TK.peach, ink: null });
  boilSeed('cardpetals');
  for (let i = 0; i < 9; i++) {
    const x = 60 + hash(i * 3.3) * 960 + 30 * Math.sin(t * .9 + i), y = frac(hash(i * 7.1) + t * (.035 + .02 * hash(i))) * (H + 80) - 40, r = t * .8 + i;
    paint([[x + Math.cos(r) * 15, y + Math.sin(r) * 15], [x + Math.cos(r + 1.6) * 7, y + Math.sin(r + 1.6) * 7], [x - Math.cos(r) * 15, y - Math.sin(r) * 15], [x + Math.cos(r - 1.6) * 7, y + Math.sin(r - 1.6) * 7]], { wash: i % 2 ? TK.marigold : TK.petal, washOp: 200, ink: null, curv: .5 });
  }
  const X = 470, pk = t0 => Math.max(0, t - t0) * 5, br = Math.sin(t * 1.3) * .008;
  if (t > C.cap) letter("Maa's 9 forms, as picture books", X, 650, 50, TK.teal, { screen: true, font: '50px Marcellus', ink: false, pop: pk(C.cap), maxW: 860 });
  if (t > C.cover) {
    picture(PICS.book7, X, 880, 330, 330, { rot: -.03 + br, pop: pk(C.cover), r: 10, shadow: 26 });
    if (t > C.cover + .25) {   // the COMING SOON ribbon across the top-right corner
      const k = backOut(clamp((t - C.cover - .25) * 4)), rx = X + 100, ry = 780;
      flushLetters(); boilSeed('ribbon');
      push(); translate(rx, ry); rotate(.62); scale(k);
      paint(rectPts(-150, -26, 300, 52), { wash: TK.rkOrange, ink: null });
      pop();
      letter('COMING SOON', rx, ry + 2, 28, TK.cream, { screen: true, font: '700 28px Poppins', ink: false, rot: .62, pop: pk(C.cover + .25) });
    }
    letter('Book 7 · Maa Kalaratri, her darkest form', X, 1080, 32, TK.brown, { screen: true, font: '500 34px Poppins', ink: false, maxW: 860, pop: pk(C.cover + .15) });
  }
  if (t > C.row) [['book1', -1], ['book2', 0], ['book3', 1]].forEach(([b, i], j) => {
    const a = Math.max(0, t - C.row - j * .1);
    if (a > 0) picture(PICS[b], X + i * 172, 1205, 140, 140, { rot: i * .06 - br, pop: a * 5, r: 6, shadow: 14 });
  });
  if (t > C.price) letter('OUT NOW: Books 1–3 · Set of 3 for ₹500', X, 1305, 36, TK.brown, { screen: true, font: '700 36px Poppins', ink: false, maxW: 880, pop: pk(C.price) });
  if (t > C.logo) picture(PICS.logo, X, 540, 140, 140, { pop: pk(C.logo) });
  if (t > C.pill) {
    const k = backOut(clamp(pk(C.pill))) * (1 + .03 * pulse(t, 4));
    boilSeed('pill');
    push(); translate(X, 1394); scale(k); paint(rrPts(-220, -44, 440, 88, 44), { wash: TK.rkOrange, ink: null }); pop();
    letter('rishikatha.com', X, 1396, 50, TK.cream, { screen: true, font: '700 52px Poppins', ink: false, pop: pk(C.pill) });
  }
  if (t > C.follow) letter('Follow @therishikatha for more Sher!', X, 1474, 34, TK.grey, { screen: true, font: '500 38px Poppins', ink: false, maxW: 860, pop: pk(C.follow) });
}
