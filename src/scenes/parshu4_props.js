// parshu4_props.js: sets, props and the cast for parshu4.js (ad 72, "PARSHURAMA vs the KING with 1000 ARMS", Parshurama
// series Part 4). Loaded after parshu1_props.js (PK, shockRing, smokePuff, sparkleBurst, crownProp, sunsetRidge, poof),
// parshu2_props.js (P2, dustPlain, brawlCloud, lightBeam, halo, navCard), parshu3_props.js (P3, jamadagni, ashramSet,
// grade, riverSet, eyeBlaze, drips, nameTag, bloodGround, whipStreaks) and the shared rigs (parshurama.js, ram.js,
// ramayan.js: dasharatha(), kaikeyi(); ravana.js; cow.js; narada.js; chandraghanta.js: dhanush(), baan()).
// Pure functions of their arguments (and T for boil).
//   P4                                                  the palette
//   kartavirya, armFan, queen4, soldier, ravanaTied, kamadhenu   the cast
//   sunburst, campSet                                   sets
//   waterWall, floodWave, tent, leafPlate, hillProp, arrow, arrowVolley, stake, podium, rope   props
const P4 = {
  ink: '#2B2233', cream: '#FFF5E2', gold: '#F5C542', goldDk: '#C8922A', red: '#FF5A3C',
  burstA: '#7A1A3A', burstB: '#C8452E', burstC: '#F2A03A', ray: '#FFD27A',
  rope: '#C8A06A', ropeDk: '#8A6A3E', rock: '#8A6E5E', rockDk: '#5E4A40', rockLt: '#B89A86',
  tent: '#8E2F3E', tentLt: '#E8B048', leaf: '#4E9A4A', leafDk: '#2E6E34', rice: '#FFF8EC', laddoo: '#F2A02E', kheer: '#F6E6C8',
  water: '#5EA8C8', waterDk: '#3A7EA0', waterLt: '#BFE6F2', foam: '#F2FAFF',
  step: '#F6E2C8', stepDk: '#D2B48E', stepSide: '#B8956A',
};

// ---------- the cast ----------
// Kartavirya Arjuna, king of the Haihayas at Mahishmati (Bhagavata 9.15.17-22): Dasharatha's rig, young, a short black
// beard, the tall gold kirita, a crimson dhoti and a gold uttariya; his thousand arms are a fan behind him (armFan)
const KART_PAL = { skin: '#D9A070', skinDk: '#B07848', skinLt: '#F0C49A', hair: '#1E1820', hairLt: '#40343E', dhoti: '#A81E34', dhotiDk: '#741226', dhotiLt: '#D84A5E',
  border: '#F2C230', shawl: '#F2C230', shawlDk: '#B88A1C', ink: '#2A1A22' };
// the fan's rings, back to front: n arms, from r0 to r1 (u) out of the shoulders' centre, w thick
const KART_RINGS = [{ n: 30, r0: 8.5, r1: 17.5, w: .8 }, { n: 22, r0: 6, r1: 14, w: .9 }, { n: 14, r0: 3.6, r1: 10.4, w: 1.0 }];
const KART_N = KART_RINGS.reduce((s, R) => s + R.n, 0);
// arm i of ring ri: [base, elbow, hand, angle] in body u, o as kartavirya()'s
function fanArm(o, ri, i) {
  const R = KART_RINGS[ri], [a0, a1] = o.fanRange || [-.32, Math.PI + .32], cy = -15.2;
  const order = ri === 2 ? i : ri === 1 ? 14 + i : 36 + i, k = o.fan ?? 1;
  const s = k >= 1 ? 1 : backOut(clamp((k * (KART_N + 8) - order) / 8));
  const wave = (o.fanWave ?? 1) * .035 * Math.sin(T * 2.2 + i * .7 + ri * 1.3);
  const th = lerp(a0, a1, (i + (ri % 2 ? .5 : 0)) / (R.n - (ri % 2 ? .5 : 1))) + wave;
  const dx = Math.cos(th), dy = -Math.sin(th), r1 = R.r0 + (R.r1 - R.r0) * s;
  const base = [dx * R.r0, cy + dy * R.r0], hand = [dx * r1, cy + dy * r1];
  const bend = (ri % 2 ? .7 : -.7) * s, elbow = [(base[0] + hand[0]) / 2 - dy * bend, (base[1] + hand[1]) / 2 + dx * bend];
  return { base, elbow, hand, th, s, R };
}
// the thousand arms behind him, in body space: o.fan 0..1 (they sprout, inner ring first), o.fanRange [a0, a1] (rad:
// 0 screen right, π/2 up), o.fanWave (default 1), o.fanHeld 'bow' (a bow in every hand of the two back rings) | 'grip'
// (open hands reaching up: the hill), o.fanSil (a colour: all one dark, for a silhouette)
function armFan(u, sw, o, C) {
  const INK = C.ink;
  for (let ri = 0; ri < 3; ri++) {
    const R = KART_RINGS[ri];
    for (let i = 0; i < R.n; i++) {
      const A = fanArm(o, ri, i); if (A.s <= .02) continue;
      boilSeed(`kart ${o.boilKey ?? ''} arm ${ri} ${i}`);
      const col = o.fanSil || mixCol(C.skin, C.skinDk, .45 - ri * .2);
      paint(U(ribbon([A.base, A.elbow, A.hand], R.w, R.w * .75), u), { wash: col, ink: o.fanSil ? null : INK, sw: sw * .45, curv: .4 });
      const ca = Math.cos(A.th), sa = -Math.sin(A.th), bx = lerp(A.elbow[0], A.hand[0], .7), by = lerp(A.elbow[1], A.hand[1], .7), h = R.w * .55;
      if (!o.fanSil) inkLine(U([[bx - sa * h, by + ca * h], [bx + sa * h, by - ca * h]], u), sw * 1.2, C.gold, 'ink', 0);   // a bangle
      if (o.fanHeld === 'bow' && ri < 2) {   // a bow across the hand, its belly outward, the string toward him
        const L = 1.7 * u; push(); translate(A.hand[0] * u, A.hand[1] * u); rotate(-A.th);
        inkLine([[-L * .12, -L], [-L * .12, L]], sw * .5, '#FFF0C8', 'inkfine', 0);
        paint(ribbon([[-L * .12, -L], [L * .3, -L * .5], [L * .42, 0], [L * .3, L * .5], [-L * .12, L]], .32 * u, .32 * u), { wash: '#8A5230', ink: INK, sw: sw * .5 });
        pop();
      }
      const hr = R.w * (o.fanHeld === 'grip' ? .62 : .55);
      paint(ellPts(A.hand[0] * u, A.hand[1] * u, hr * u, hr * .9 * u, 9), { wash: o.fanSil || C.skin, ink: o.fanSil ? null : INK, sw: sw * .4 });
    }
  }
}
// one long arm reaching out of the fan from his right shoulder to a fist at (tx, ty) (holding Ravana up), world space
function kartReach(x, y, u, tx, ty, key = 'reach') {
  const sx = x + 3.2 * u, sy = y - 16 * u, mx = (sx + tx) / 2 + (ty - sy) * .12, my = (sy + ty) / 2 - (tx - sx) * .12;
  boilSeed(key);
  paint(ribbon([[sx, sy], [mx, my], [tx, ty + .6 * u]], 1.25 * u, 1.0 * u), { wash: KART_PAL.skin, fill: KART_PAL.skinDk, fillOp: 30, tex: .3, ink: KART_PAL.ink, sw: 1.1, curv: .4 });
  const bx = lerp(mx, tx, .7), by = lerp(my, ty, .7), a = Math.atan2(ty - my, tx - mx), ca = Math.cos(a), sa = Math.sin(a);
  inkLine([[bx + sa * .7 * u, by - ca * .7 * u], [bx - sa * .7 * u, by + ca * .7 * u]], 2.6, '#F2C230', 'ink', 0);
  paint(ellPts(tx, ty, .95 * u, .85 * u, 10), { wash: KART_PAL.skin, ink: KART_PAL.ink, sw: 1 });
}
// the world point of fan arm (ri, i)'s hand
function kartFanHand(x, y, u, o, ri, i) { const A = fanArm(o, ri, i), fx = o.flip ? -1 : 1; return [x + fx * A.hand[0] * u, y + A.hand[1] * u]; }
function kartavirya(x, y, u, o = {}) {
  const C = { ...RAM, ...DASH_PAL, ...KART_PAL, ...(o.pal || {}) }, beh = o.behind;
  if (o.aura) glow(x, y - 16 * u, 20 * u, '#FFD27A', .35 * o.aura);
  return dasharatha(x, y, u, { beard: KART_PAL.hair, beardLen: .45, boilKey: 'kart', seed: 41, ...o, pal: { ...KART_PAL, ...(o.pal || {}) },
    behind: (uu, sw) => { if (o.fan !== 0) armFan(uu, sw, o, C); if (beh) beh(uu, sw); } });
}
// his queens (unnamed; Bhagavata 9.15.20 "with women", 9.15.22 "before the women"): Kaikeyi's rig in two colours
const QUEENS4 = [{ saree: '#E8508A', sareeDk: '#B8306A', sareeLt: '#F88AB4', blouse: '#F2C230', blouseDk: '#B88A1C', bangle: '#F2C230' },
  { saree: '#3E9ED2', sareeDk: '#2A74A2', sareeLt: '#7AC4EA', blouse: '#E8506A', blouseDk: '#B83450', bangle: '#F2C230' }];
function queen4(i, x, y, u, o = {}) { return kaikeyi(x, y, u, { boilKey: 'q4' + i, seed: 50 + i, ...o, pal: { ...QUEENS4[i % 2], ...(o.pal || {}) } }); }
// a Haihaya soldier: Narad's rig in a rust tunic, a round iron helmet with a spike, a spear (v: 0..2, the skin)
const SOLD_SKIN = [['#D8A070', '#B47A4C', '#F0C49A'], ['#B8805A', '#946040', '#D8A47E'], ['#E6B48A', '#C28C62', '#F8D2B0']];
function soldier(x, y, u, o = {}) {
  const [sk, skD, skL] = SOLD_SKIN[(o.v ?? 0) % 3];
  const pal = { skin: sk, skinDk: skD, skinLt: skL, dhoti: '#8E3A2A', dhotiDk: '#62261A', dhotiLt: '#B8624A', border: '#2A2430', hair: '#1E1820', hairLt: '#3E3440', ...(o.pal || {}) };
  const spear = o.spear !== false, hat = (uu, sw) => {
    paint(U([[-3.1, -21.4], [-3.0, -23.4], [-2, -24.9], [0, -25.5], [2, -24.9], [3.0, -23.4], [3.1, -21.4]], uu), { wash: '#7C8896', fill: '#4E5866', fillOp: 60, tex: .4, ink: P4.ink, sw: sw * .7, curv: .5 });
    paint(rrPts(-3.3 * uu, -22 * uu, 6.6 * uu, .9 * uu, .4 * uu), { wash: '#A8323A', ink: P4.ink, sw: sw * .5 });
    paint(U([[-.35, -25.3], [0, -27], [.35, -25.3]], uu), { wash: '#C9D3DC', ink: P4.ink, sw: sw * .5 });
  };
  const sp = (uu, sw) => { inkLine(U([[0, 6], [0, -10]], uu), sw * 1.6, '#7A4A2A', 'ink', 0); paint(U([[0, -12.6], [.6, -10.4], [0, -9.8], [-.6, -10.4]], uu), { wash: '#C9D3DC', ink: P4.ink, sw: sw * .5 }); };
  return narada(x, y, u, { veena: false, topknot: false, tilak: false, shawl: false, mala: false, beard: '#1E1820', beardLen: .3, boilKey: 'sold' + (o.boilKey ?? ''), ...o, pal, hat,
    armR: spear ? (o.armR || sp) : o.armR });
}
// Ravana tied up (Bhagavata 9.15.22, "seized, held at Mahishmati, let go like a monkey"): his fan arms folded away,
// the front pair bound to his sides, rope round his chest and his dhoti; every ravana() option works
function ravanaTied(x, y, u, o = {}) {
  ravana(x, y, u, { ...o, arm: (a, s, k, d) => k === 9 ? { hand: [s * 4.1, -10.6], bend: .3 } : { hand: [s * 2.4, -12.6 + k * .1], bend: .1 } });
  const P = pts => pts.map(([a, b]) => [x + (o.dx || 0) * u + a * u, y + (o.dy || 0) * u + b * u]);
  for (const [yy, w] of [[-13.2, 4.5], [-11.0, 4.6], [-6.6, 3.9]]) {
    boilSeed('rvrope' + yy);
    paint(ribbon(P([[-w, yy - .2], [0, yy + .35], [w, yy - .2]]), .55 * u, .55 * u), { wash: P4.rope, fill: P4.ropeDk, fillOp: 50, tex: .5, ink: P4.ink, sw: .8 });
    for (let j = -3; j <= 3; j++) inkLine(P([[j * w / 4 - .2, yy - .1], [j * w / 4 + .2, yy + .5]]), .9, P4.ropeDk, 'inkfine', 0);
  }
}
// Kamadhenu, the sage's wish-fulfilling cow (9.15.24): cow.js in pure white with a soft gold light; o.glowK 0..1
function kamadhenu(x, y, u, o = {}) {
  const k = o.glowK ?? 1;
  if (k > 0) { const [hx, hy] = cowBack(x, y, u, o); glow(hx, hy + 2 * u, 12 * u, '#FFE6A0', .45 * k); }
  cow(x, y, u, { coat: 'dhavala', hornBand: '#E2452B', boilKey: 'kd', seed: 3, ...o });
  if (k > 0) { boilSeed('kdsp'); for (let i = 0; i < 6; i++) { const a = T * .9 + i * TAU / 6, px = x + Math.cos(a) * 9 * u, py = y - 6 * u + Math.sin(a) * 3 * u; paint(starPts(px, py, u * (.5 + .3 * Math.sin(T * 4 + i)), .35, 4), { wash: '#FFF2C0', washOp: 220 * k, ink: null }); } }
}

// ---------- sets ----------
// a royal sunburst: crimson to saffron with turning gold rays (the hook, the ask)
function sunburst(t, cx = 540, cy = 1150, cols = [P4.burstA, P4.burstB, P4.burstC]) {
  boilSeed('sb4');
  paint(rectPts(-200, -300, W + 400, H + 600), { wash: cols[0], ink: null });
  paint(ellPts(cx, cy, 760, 900, 30), { fill: cols[1], fillOp: 200, bleed: .35, tex: .4, border: .2, ink: null });
  boilSeed('sb4 rays');
  for (let i = 0; i < 16; i++) { const a = i / 16 * TAU + t * .05, r = 1500; paint([[cx, cy], [cx + Math.cos(a - .06) * r, cy + Math.sin(a - .06) * r], [cx + Math.cos(a + .06) * r, cy + Math.sin(a + .06) * r]], { wash: P4.ray, washOp: 40, ink: null }); }
  paint(ellPts(cx, cy - 40, 400, 470, 26), { fill: cols[2], fillOp: 110, bleed: .35, tex: .4, border: .2, ink: null });
  glow(cx, cy - 60, 520, '#FFC870', .35);
}
// Ravana's camp downstream on the Narmada: the river bank (riverBank from the Ramayan kit), his striped tent
function campSet(t, key = 'camp') {
  riverBank(t, key);
  tent(250, 1470, 330, key + 'tent');
}

// ---------- props ----------
// the river heaped up behind his arms: a wall of water across the frame, its foot at y, its top at y - h (k 0..1)
function waterWall(y, h, k, t, key = 'wwall') {
  if (k <= 0) return;
  const top = y - h * easeOut(k); boilSeed(key);
  const pts = [[-300, y + 20]];
  for (let i = 0; i <= 10; i++) { const x = -200 + i * 148, bump = Math.sin(i * 1.3 + t * 2.4) * 14 + Math.sin(i * .7 - t * 1.6) * 10, hh = h * easeOut(k) * (.3 + .7 * Math.sin(i / 10 * Math.PI) ** 1.5); pts.push([x, y - hh + bump]); }
  pts.push([1380, y + 20]);
  paint(pts, { wash: P4.waterDk, fill: '#2A5E80', fillOp: 70, tex: .5, ink: P4.ink, sw: 1.2, curv: .5 });
  boilSeed(key + 'f');
  for (let i = 0; i < 9; i++) { const x = -120 + i * 160 + 30 * Math.sin(t * 2 + i), q = clamp((x + 200) / 1480), ty = y - h * easeOut(k) * (.3 + .7 * Math.sin(q * Math.PI) ** 1.5); inkLine([[x, ty + 24 + 14 * Math.sin(t * 3 + i)], [x + 90, ty + 34 + 14 * Math.sin(t * 3 + i + 1)]], 3, P4.foam, 'ink', .5); }
  for (let i = 0; i < 6; i++) { const q = frac(t * .6 + i / 6); inkLine([[-100 + i * 230, lerp(top + 60, y - 20, q)], [-20 + i * 230, lerp(top + 60, y - 20, q) + 4]], 2, P4.waterLt, 'inkfine', 0); }
}
// a flood rushing in from screen left: its front at x (it sweeps right), the water's surface at y, a curling crest
function floodWave(x, y, t, key = 'flood') {
  boilSeed(key);
  const body = [[-300, 2400], [-300, y - 120], [x - 380, y - 140], [x - 160, y - 260], [x - 20, y - 300], [x + 90, y - 250], [x + 120, y - 160], [x + 60, y - 130], [x + 150, y - 40], [x + 220, y + 30], [x + 220, 2400]];
  paint(body, { wash: P4.water, fill: P4.waterDk, fillOp: 70, tex: .5, ink: P4.ink, sw: 1.4, curv: .5 });
  paint([[x - 200, y - 250], [x - 30, y - 320], [x + 110, y - 260], [x + 140, y - 170], [x + 70, y - 200], [x - 10, y - 250], [x - 120, y - 230]], { wash: P4.foam, fill: P4.waterLt, fillOp: 50, ink: P4.ink, sw: 1, curv: .6 });
  boilSeed(key + 'sp');
  for (let i = 0; i < 12; i++) { const q = frac(t * 1.5 + i / 12), a = -Math.PI * (.15 + .7 * hash(i * 2.3)); paint(ellPts(x + 60 + Math.cos(a) * 200 * q, y - 260 + Math.sin(a) * 180 * q + 300 * q * q, 12 * (1 - q) + 4, 12 * (1 - q) + 4, 8), { wash: P4.foam, washOp: 230, ink: null }); }
}
// a striped royal tent: its base centred at (x, y), s wide; a pennant on top
function tent(x, y, s, key = 'tent') {
  boilSeed(key);
  const h = s * .9, P = pts => pts.map(([a, b]) => [x + a * s, y + b * s]);
  paint(P([[-.55, 0], [-.42, -.42], [0, -.9], [.42, -.42], [.55, 0]]), { wash: P4.tent, fill: '#66202C', fillOp: 50, tex: .4, ink: P4.ink, sw: 1.2, curv: .2 });
  for (const d of [-.3, -.1, .1, .3]) paint(P([[d - .05, 0], [d * .25 - .02, -.84], [d * .25 + .02, -.84], [d + .05, 0]]), { wash: P4.tentLt, ink: null });
  paint(P([[-.14, 0], [0, -.42], [.14, 0]]), { wash: '#2A1420', ink: P4.ink, sw: 1 });   // the door
  inkLine(P([[0, -.9], [0, -1.12]]), 2, P4.ink, 'ink', 0);
  paint(P([[0, -1.12], [.2, -1.06], [0, -1.0]]), { wash: '#E2452B', ink: P4.ink, sw: .8 });
}
// a banana-leaf plate of food seen from the front and a little above: (x, y) the centre, s wide; full 0..1 (the food
// appears, served from the wish-cow)
function leafPlate(x, y, s, full, key = 'plate') {
  boilSeed(key);
  paint(ellPts(x, y, s * .5, s * .2, 18, 0, -.06), { wash: P4.leaf, fill: P4.leafDk, fillOp: 50, tex: .4, ink: P4.ink, sw: .9 });
  inkLine([[x - s * .45, y + s * .02], [x + s * .45, y - s * .04]], 1, P4.leafDk, 'inkfine', 0);
  const k = backOut(clamp(full)); if (k <= .02) return;
  paint(ellPts(x - s * .12, y - s * .06 * k, s * .17 * k, s * .1 * k, 14), { wash: P4.rice, ink: P4.ink, sw: .7 });
  for (const [dx, dy] of [[.16, -.04], [.27, .02], [.21, -.11]]) paint(ellPts(x + dx * s, y + dy * s * k, s * .06 * k, s * .06 * k, 10), { wash: P4.laddoo, ink: P4.ink, sw: .6 });
  paint(ellPts(x - s * .33, y + s * .03, s * .07 * k, s * .045 * k, 10), { wash: P4.kheer, ink: P4.ink, sw: .6 });
}
// a hill torn up with its trees (9.15.34), held at its foot (x, y), s wide; tilt (rad)
function hillProp(x, y, s, tilt = 0, key = 'hill') {
  push(); translate(x, y); rotate(tilt);
  boilSeed(key);
  paint([[-s * .5, 0], [-s * .42, -s * .22], [-s * .2, -s * .38], [s * .05, -s * .44], [s * .3, -s * .34], [s * .48, -s * .16], [s * .5, 0], [s * .3, s * .12], [-s * .3, s * .12]], { wash: P4.rock, fill: P4.rockDk, fillOp: 60, tex: .5, ink: P4.ink, sw: 1.4, curv: .4 });
  paint([[-s * .3, -s * .3], [-s * .1, -s * .38], [s * .15, -s * .3], [-s * .05, -s * .24]], { wash: P4.rockLt, washOp: 160, ink: null, curv: .5 });
  for (let i = 0; i < 6; i++) { const ax = -s * .35 + i * s * .13, ay = s * .1; inkLine([[ax, ay], [ax + 8 * Math.sin(i), ay + s * .08]], 2, '#6A4A2A', 'ink', .5); }   // dangling roots
  pop();
  tree(x + Math.cos(tilt) * (-s * .2) - Math.sin(tilt) * (-s * .34), y + Math.sin(tilt) * (-s * .2) + Math.cos(tilt) * (-s * .34), s * .5, key + 't1', tilt * 2);
  tree(x + Math.cos(tilt) * (s * .2) - Math.sin(tilt) * (-s * .36), y + Math.sin(tilt) * (s * .2) + Math.cos(tilt) * (-s * .36), s * .42, key + 't2', tilt * 2);
}
// an arrow in flight at (x, y) pointing along a (rad), len px long
function arrow(x, y, a, len, key = 'ar', col = '#7A4A2A') {
  const ca = Math.cos(a), sa = Math.sin(a), q = (d, n = 0) => [x + ca * d - sa * n, y + sa * d + ca * n];
  inkLine([q(-len * .5), q(len * .38)], 2.6, col, 'ink', 0);
  paint([q(len * .5), q(len * .36, len * .06), q(len * .38), q(len * .36, -len * .06)], { wash: '#C9D3DC', ink: P4.ink, sw: .6 });
  paint([q(-len * .5), q(-len * .38, len * .07), q(-len * .32), q(-len * .38, -len * .07)], { wash: '#F2E6CC', ink: null });
}
// a volley: n arrows flying from around (x0, y0) toward (x1, y1), p 0..1 (their travel), staggered; a cut 0..1 at which
// they break (sparks, the halves tumbling)
function arrowVolley(x0, y0, x1, y1, n, p, key = 'vol', cut = 2, spread = 260) {
  const a = Math.atan2(y1 - y0, x1 - x0);
  for (let i = 0; i < n; i++) {
    const q = clamp(p * 1.3 - hash(i * 3.1) * .3), off = (hash(i * 7.7) - .5) * spread, ox = -Math.sin(a) * off, oy = Math.cos(a) * off;
    if (q <= 0) continue;
    const x = lerp(x0, x1, Math.min(q, cut)) + ox, y = lerp(y0, y1, Math.min(q, cut)) + oy;
    boilSeed(key + i);
    if (q < cut) arrow(x, y, a, 120, key + i);
    else {
      const d = q - cut, g = d * d * 900;
      if (d < .08) paint(starPts(x, y, 40 * (1 - d / .08), .35, 6), { wash: '#FFF2B0', ink: null });
      arrow(x - 30, y + g, a + d * 9, 60, key + i + 'a'); arrow(x + 30, y + g * 1.2, a - d * 11, 60, key + i + 'b');
    }
  }
}
// the empty post where the cow was tied: a stake, a snapped rope on the ground; (x, y) the ground
function stake(x, y, s, key = 'stake') {
  boilSeed(key);
  paint(rrPts(x - s * .06, y - s, s * .12, s, s * .03), { wash: '#8A5A32', fill: '#5E3418', fillOp: 50, tex: .5, ink: P4.ink, sw: 1 });
  paint(ellPts(x, y - s * .7, s * .09, s * .04, 10), { wash: P4.rope, ink: P4.ink, sw: .8 });
  inkLine([[x + s * .06, y - s * .7], [x + s * .3, y - s * .4], [x + s * .38, y - s * .05], [x + s * .6, y]], 3, P4.rope, 'ink', .5);
  inkLine([[x + s * .6, y], [x + s * .66, y - s * .04], [x + s * .7, y + s * .01]], 2, P4.ropeDk, 'inkfine', .5);   // frayed end
}
// a rope between two points sagging by sag px
function rope(a, b, sag = 30, key = 'rope') {
  boilSeed(key);
  inkLine([a, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + sag], b], 3.4, P4.rope, 'ink', .5);
}
// a podium step: its top-left at (x, y), w × h, a lit top face
function podium(x, y, w, h, key = 'pod') {
  boilSeed(key);
  paint(rectPts(x, y, w, h), { wash: P4.step, fill: P4.stepDk, fillOp: 60, tex: .4, ink: P4.ink, sw: 1.2 });
  paint(rectPts(x, y, w, 18), { wash: '#FFF4E2', ink: null });
  inkLine([[x, y + 18], [x + w, y + 18]], 1, P4.stepSide, 'inkfine', 0);
}
