// dasha_props.js: sets and props for "VISHNU has come 9 times" (ad 77, Dashavatar): the cosmic ocean, the descending light,
// the numbered badge, Manu's river and his cupped hands, the flood and the boat, the milk ocean and Mandara, the depths,
// Hiranyakashipu's hall and the pillar, Bali's sacrifice, the starry sky of the steps, the Yamuna, the bodhi tree and a
// goat, Kalki's storm and the ring of medallions. Load after parshu1–7_props.js and dashavatar.js.
const DP = {
  ink: '#1E2A4A', cream: '#FFF5E2', gold: '#F5C542', goldDk: '#C8922A', goldLt: '#FFE69A',
  // the cosmic ocean
  nightHi: '#0A1030', nightMid: '#16245A', nightLo: '#2A3E86', sea: '#16306E', seaDk: '#0C1E4A', seaLt: '#4E7AC8', foam: '#BFD8FF',
  // Manu's river at dawn
  dawnHi: '#F6C49A', dawnLo: '#FFE6C2', river: '#5EA8C8', riverDk: '#3E80A6', riverLt: '#A8DCEC', bank: '#C8A06A', bankDk: '#9E7A48', reed: '#6A9A4A',
  hand: '#E6B48A', handDk: '#C28C62', handLt: '#F8D2B0',
  // the flood
  stormHi: '#14303A', stormMid: '#21505A', stormLo: '#2E6A70', wave: '#1E5A66', waveDk: '#123E48', waveLt: '#5EA0A6', rain: '#A8D0D6',
  boat: '#8A5230', boatDk: '#5E3418', boatLt: '#B87A48', thatch: '#D9A54A', thatchDk: '#A8782A',
  // the milk ocean
  milkHi: '#FCE6EE', milkMid: '#FFF4E8', milk: '#FFFBF2', milkDk: '#E8DCCC', rock: '#8A8CA0', rockDk: '#5E6078', rockLt: '#B8BACC', tree: '#5E9A5A', treeDk: '#3E7040',
  vasuki: '#3E8A6A', vasukiDk: '#2A6048', vasukiLt: '#7AC8A0',
  // the depths and the dawn
  deepHi: '#05101E', deep: '#0C2238', deepLt: '#1E4A6A', surf: '#7ABCD8', dawnSky: '#FFC89A', dawnSky2: '#FFE8C8',
  // Hiranyakashipu's hall at dusk
  hall: '#5A2E3A', hallDk: '#3A1A26', hallLt: '#8A4A52', duskHi: '#F2804A', duskLo: '#FFC870', stone: '#E8D2B8', stoneDk: '#B89A80', stoneLt: '#FFF0DC',
  // the yagna ground
  ygSky: '#FFE2A8', ygSky2: '#FFF2D6', ygGround: '#D9A86A', ygGroundDk: '#B07E48', canopy: '#D2452F', canopyDk: '#9E2E22',
  // the warm bank and the cool grove
  warmHi: '#FFD49A', warmLo: '#F2A86A', yamuna: '#3E6AB8', yamunaLt: '#7AA8E2', field: '#C8B05A', fieldDk: '#9E8A3A',
  coolHi: '#BFE0D8', coolLo: '#8EC2B8', grove: '#4E8A6A', groveDk: '#2E5E48', leaf: '#5EA85A', leafDk: '#3E7A40', bark: '#7A5A3A', barkDk: '#4E3620',
  goat: '#F6F0E6', goatDk: '#D2C8B8',
  // Kalki's storm
  kHi: '#0A0A1A', kMid: '#1A1A3A', kLo: '#2E2A56', bolt: '#F2F6FF',
};

// ---------- the cosmic ocean (frame 0, the ask) ----------
function cosmicOcean(t, o = {}) {
  const sy = o.seaY ?? 1560;
  boilSeed('co sky');
  paint(rectPts(-300, -300, W + 600, 2600), { wash: DP.nightHi, ink: null });
  paint(ellPts(540, sy - 200, 1300, 900, 30), { fill: DP.nightMid, fillOp: 230, bleed: .3, tex: .4, border: .2, ink: null });
  paint(ellPts(540, sy - 120, 900, 420, 30), { fill: DP.nightLo, fillOp: 160, bleed: .35, tex: .4, border: .2, ink: null });
  boilSeed('co stars');
  for (let i = 0; i < 60; i++) {
    const x = hash(i * 2.7) * 1180 - 50, y = hash(i * 5.1) * (sy - 80) - 50, tw = .5 + .5 * Math.sin(t * (1.5 + hash(i)) + i);
    paint(starPts(x, y, 3 + 4 * hash(i * 3) * tw + 1, .45, 4), { wash: i % 7 ? DP.cream : DP.goldLt, washOp: 120 + 120 * tw, ink: null });
  }
  glow(540, sy - 300, 600, '#4E7AC8', .35);
  boilSeed('co sea');
  paint(rectPts(-300, sy, W + 600, 1400), { wash: DP.sea, fill: DP.seaDk, fillOp: 70, tex: .4, ink: null });
  for (let r = 0; r < 6; r++) {
    boilSeed('co wave' + r);
    const y = sy + 30 + r * r * 22, ph = t * (.5 + r * .1) + r;
    inkLine(Array.from({ length: 13 }, (_, j) => [-150 + j * 115, y + Math.sin(ph + j * .9) * (6 + r * 2)]), 1.2 + r * .4, r % 2 ? DP.seaLt : DP.foam, 'ink', .6);
  }
}

// ---------- lightning ----------
function bolt(pts, k, key = 'bolt', w = 12) {
  if (k <= .02) return;
  boilSeed(key);
  const mid = pts[Math.floor(pts.length / 2)];
  glow(mid[0], mid[1], 520, '#DCE8FF', .8 * k);
  inkLine(pts, w * k, DP.bolt, 'ink', 0); inkLine(pts, 3, '#FFFFFF', 'inkfine', 0);
}
function boltPts(x0, y0, x1, y1, n, seed) {
  return Array.from({ length: n + 1 }, (_, i) => { const k = i / n; return [lerp(x0, x1, k) + (i && i < n ? (hash(seed + i * 3.7) - .5) * 140 : 0), lerp(y0, y1, k)]; });
}

// ---------- the descent: the light that falls to become each form (k 0..1: from the top to (x, y)) ----------
function descentBeam(x, y, k, key = 'desc', col = '#BFE0FF') {
  if (k <= 0 || k >= 1.3) return;
  const p = easeIn(clamp(k)), hy = lerp(-200, y, p), tail = 520 * (1 - Math.max(0, k - 1) / .3);
  boilSeed(key);
  glow(x, hy, 220, col, .7);
  glow(x, hy, 90, '#FFFFFF', .7);
  paint([[x - 26, hy], [x, hy - tail], [x + 26, hy]], { wash: '#FFFFFF', washOp: 200, ink: null });
  paint(ellPts(x, hy, 30, 30, 12), { wash: '#FFFFFF', ink: null });
  if (k > 1) shockRing(x, y, 60 + (k - 1) * 900, 1 - (k - 1) / .3, key + 'r', '#FFFFFF', .35);
}

// ---------- the numbered badge: a gold disc with the number, the name beside it (screen space) ----------
function badge(n, name, age, life, y = 462) {
  if (age < 0 || age > life) return;
  const size = 70, nameW = name.length * size * .44, disc = 50, gap = 22, tot = disc * 2 + gap + nameW, x0 = 540 - tot / 2;
  const k = backOut(clamp(age * 3.5)), fade = 1 - seg(age, life - .2, life);
  if (fade <= 0) return;
  boilSeed('badge' + n);
  push(); translate(x0 + disc, y); scale(k);
  paint(ellPts(0, 0, disc + 6, disc + 6, 24), { wash: DP.ink, washOp: 255 * fade, ink: null });
  paint(ellPts(0, 0, disc, disc, 24), { wash: DP.gold, washOp: 255 * fade, fill: DP.goldDk, fillOp: 60 * fade, tex: .3, ink: null });
  pop();
  letter(String(n), x0 + disc, y + 4, 72, DP.ink, { screen: true, pop: age * 4, alpha: fade, ink: false, rot: 0 });
  letter(name, x0 + disc * 2 + gap + nameW / 2, y, size, DP.gold, { screen: true, pop: age * 4 - .3, alpha: fade, stroke: DP.ink, sw: .22, ink: false, rot: -.02, maxW: 760 });
}

// ---------- 1 · Manu's river, his cupped hands; the flood and the boat ----------
function riverDawn(t, o = {}) {
  boilSeed('rd sky');
  paint(rectPts(-300, -300, W + 600, 2600), { wash: DP.dawnHi, ink: null });
  paint(ellPts(540, 1100, 1100, 700, 30), { fill: DP.dawnLo, fillOp: 230, bleed: .3, tex: .4, border: .2, ink: null });
  glow(760, 980, 380, '#FFE2A0', .6);
  boilSeed('rd river');
  paint(rectPts(-300, 1180, W + 600, 1600), { wash: DP.river, fill: DP.riverDk, fillOp: 60, tex: .4, ink: null });
  for (let r = 0; r < 7; r++) { boilSeed('rd rip' + r); const y = 1220 + r * r * 16; inkLine(Array.from({ length: 10 }, (_, j) => [-120 + j * 150, y + Math.sin(t * 1.4 + j + r) * 5]), 1.4, DP.riverLt, 'inkfine', .6); }
  boilSeed('rd reeds');
  for (let i = 0; i < 9; i++) { const x = -40 + i * 40 + (i > 4 ? 860 : 0), h = 120 + hash(i * 3.1) * 140; inkLine([[x, 1240], [x + 10 + Math.sin(t + i) * 8, 1240 - h]], 3, DP.reed, 'ink', .4); }
}
// two palms cupped together, seen from in front: part 'back' (the palms, the water) before the fish, 'front' (the
// fingers' rims and thumbs) after it. (x, y) is the middle of the bowl's rim; s its half-width
function cuppedHands(x, y, s, part, t, key = 'hands') {
  boilSeed(key + part);
  if (part === 'back') {
    for (const sd of [-1, 1]) paint([[x + sd * s * .05, y + s * .55], [x + sd * s * 1.05, y - s * .05], [x + sd * s * 1.1, y + s * .2], [x + sd * s * .7, y + s * .75], [x + sd * s * .45, y + s * 1.6], [x + sd * s * .1, y + s * 1.6]],
      { wash: DP.hand, fill: DP.handDk, fillOp: 45, tex: .4, ink: DP.ink, sw: 1.6, curv: .5 });
    paint(ellPts(x, y + s * .12, s * .98, s * .36, 24), { wash: DP.handDk, ink: DP.ink, sw: 1.2 });   // the hollow
    paint(ellPts(x, y + s * .14, s * .86, s * .26, 24), { wash: DP.river, fill: DP.riverDk, fillOp: 40, tex: .3, ink: null });
    inkLine([[x - s * .5, y + s * .1 + Math.sin(t * 3) * 3], [x + s * .4, y + s * .12]], 1.4, DP.riverLt, 'inkfine', .4);
  } else {
    paint([[x - s * 1.0, y + s * .05], [x - s * .3, y + s * .38], [x + s * .3, y + s * .38], [x + s * 1.0, y + s * .05], [x + s * .95, y + s * .4], [x + s * .3, y + s * .7], [x - s * .3, y + s * .7], [x - s * .95, y + s * .4]],
      { wash: DP.hand, fill: DP.handDk, fillOp: 40, tex: .4, ink: DP.ink, sw: 1.6, curv: .5 });
    for (let i = 0; i < 4; i++) for (const sd of [-1, 1]) { const fx = x + sd * s * (.2 + i * .2); inkLine([[fx, y + s * (.42 + i * .02)], [fx + sd * s * .03, y + s * .66]], 1, DP.handDk, 'inkfine', .3); }
    paint(ellPts(x - s * .35, y + s * .5, s * .18, s * .08, 10), { wash: DP.handLt, washOp: 160, ink: null });
  }
}
function stormSea(t, o = {}) {
  const b = clamp(o.bolt || 0), sy = o.seaY ?? 1200;
  boilSeed('ss sky');
  paint(rectPts(-300, -300, W + 600, 2600), { wash: mixCol(DP.stormHi, '#C8E0E8', b * .5), ink: null });
  paint(ellPts(540, sy - 200, 1200, 600, 30), { fill: mixCol(DP.stormMid, '#E0F0F2', b * .4), fillOp: 220, bleed: .3, tex: .5, border: .2, ink: null });
  boilSeed('ss clouds');
  for (let i = 0; i < 7; i++) { const x = frac(hash(i * 3.3) - t * .03) * 1600 - 260, y = 420 + i * 90; paint(ellPts(x, y, 280, 60, 16), { wash: DP.stormHi, washOp: 200, ink: null }); }
  if (o.boltPts) bolt(o.boltPts, b, 'ss bolt');
  boilSeed('ss rain');
  for (let i = 0; i < 40; i++) { const x = frac(hash(i * 7.7) + t * .35) * 1400 - 200, y = frac(hash(i * 3.1) + t * 1.6) * 2100 - 200; inkLine([[x, y], [x - 30, y + 90]], 1.4, DP.rain, 'inkfine', 0); }
}
// the rolling waves: back rows behind the boat and the fish, a front row over their bottoms (part 'back' | 'front')
function floodWaves(t, sy, part, key = 'fw') {
  const rows = part === 'back' ? [0, 1, 2] : [3];
  for (const r of rows) {
    boilSeed(key + r);
    const y = sy + r * 120, amp = 40 + r * 18, ph = t * (1.6 + r * .2) + r * 1.3, col = r === 3 ? DP.wave : mixCol(DP.waveDk, DP.wave, r / 3);
    const top = Array.from({ length: 15 }, (_, j) => [-200 + j * 110, y + Math.sin(ph + j * .8) * amp - (j % 3 === 1 ? amp * .5 : 0)]);
    paint([...top, [1340, 2600], [-200, 2600]], { wash: col, fill: DP.waveDk, fillOp: 50, tex: .5, ink: DP.ink, sw: 1.2, curv: .5 });
    inkLine(top.map(([a, b]) => [a, b + 10]), 3, DP.waveLt, 'ink', .5);
    for (let j = 1; j < 14; j += 3) { const [fx, fy] = top[j]; paint(ellPts(fx, fy - 6, 34, 12, 10), { wash: DP.foam, washOp: 220, ink: null }); }
  }
}
function boat(x, y, s, rock = 0, key = 'boat') {
  boilSeed(key);
  push(); translate(x, y); rotate(rock);
  paint([[-1.3 * s, -.35 * s], [-1.6 * s, -.75 * s], [-1.1 * s, -.45 * s], [-.1 * s, -1.3 * s], [.7 * s, -1.3 * s], [.7 * s, -.45 * s]], { wash: DP.thatch, fill: DP.thatchDk, fillOp: 50, tex: .5, ink: DP.ink, sw: 1.4, curv: .1 });   // the hut's roof
  paint([[-.95 * s, -.45 * s], [.6 * s, -.45 * s], [.6 * s, -.05 * s], [-.95 * s, -.05 * s]], { wash: DP.boatDk, ink: DP.ink, sw: 1.2 });
  paint([[-1.7 * s, -.2 * s], [1.75 * s, -.25 * s], [1.3 * s, .35 * s], [-1.25 * s, .38 * s]], { wash: DP.boat, fill: DP.boatDk, fillOp: 50, tex: .5, ink: DP.ink, sw: 1.6, curv: .35 });
  inkLine([[-1.55 * s, -.05 * s], [1.6 * s, -.08 * s]], 2, DP.boatLt, 'ink', .4);
  pop();
}
function boatBow(x, y, s, rock = 0) { return [x + Math.cos(rock) * 1.7 * s + Math.sin(rock) * .25 * s, y + Math.sin(rock) * 1.7 * s - .25 * s]; }

// ---------- 2 · the milk ocean, Mandara and Vasuki ----------
function milkOcean(t, o = {}) {
  const sy = o.seaY ?? 1300;
  boilSeed('mo sky');
  paint(rectPts(-300, -300, W + 600, 2600), { wash: DP.milkHi, ink: null });
  paint(ellPts(540, sy - 150, 1100, 600, 30), { fill: DP.milkMid, fillOp: 220, bleed: .3, tex: .4, border: .2, ink: null });
  glow(540, sy - 300, 500, '#FFF0D0', .4);
  boilSeed('mo sea');
  paint(rectPts(-300, sy, W + 600, 1400), { wash: DP.milk, fill: DP.milkDk, fillOp: 60, tex: .4, ink: DP.ink, sw: .8 });
  for (let r = 0; r < 6; r++) { boilSeed('mo rip' + r); const y = sy + 30 + r * r * 24; inkLine(Array.from({ length: 12 }, (_, j) => [-150 + j * 130, y + Math.sin(t * 2 + j + r) * 6]), 1.4, DP.milkDk, 'inkfine', .6); }
}
// Mandara as the churning rod: a tall mountain, a little forest on top, Vasuki wound round it; (x, y) the waterline at
// its foot, s ≈ its half-width there; tilt (radians), spin (phase: the coils slide round), sink (px it has sunk)
function mandara(x, y, s, o = {}) {
  const key = o.key || 'mdr', tilt = o.tilt || 0, spin = o.spin || 0, h = s * 3.2;
  push(); translate(x, y); rotate(tilt);
  boilSeed(key + 'rock');   // a forested peak: broad foot, three summits
  const M = [[-s * 1.25, 60], [-s * 1.05, -h * .25], [-s * .8, -h * .5], [-s * .62, -h * .62], [-s * .45, -h * .8], [-s * .3, -h * .74], [-s * .12, -h], [s * .06, -h * .93], [s * .22, -h * .97], [s * .42, -h * .76], [s * .6, -h * .82], [s * .8, -h * .55], [s * 1.05, -h * .28], [s * 1.25, 60]];
  paint(M, { wash: DP.rock, fill: DP.rockDk, fillOp: 50, tex: .55, ink: DP.ink, sw: 1.6, curv: .25 });
  paint([[-s * .12, -h], [s * .06, -h * .93], [s * .22, -h * .97], [s * .42, -h * .76], [s * .1, -h * .55], [-s * .4, -h * .62]], { fill: DP.rockLt, fillOp: 150, bleed: .2, tex: .6, ink: null, curv: .3 });
  for (let i = 0; i < 4; i++) { boilSeed(key + 'crag' + i); const cx = (-.7 + i * .45) * s, cy = -h * (.35 + .1 * (i % 2)); inkLine([[cx, cy], [cx + s * .12, cy - s * .25], [cx + s * .2, cy - s * .1]], 1.4, DP.rockDk, 'inkfine', .3); }
  for (let i = 0; i < 7; i++) { boilSeed(key + 'tree' + i); const tx = (-.5 + i * .17) * s, ty = -h * (.78 + .12 * Math.sin(i * 1.9)) + 20; paint(ellPts(tx, ty, s * .1, s * .15, 10, 3), { wash: DP.tree, fill: DP.treeDk, fillOp: 50, ink: DP.ink, sw: 1 }); }
  // Vasuki wound round it: the front of each turn bulges down, sliding up the mountain with spin
  for (let i = 0; i < 4; i++) {
    boilSeed(key + 'coil' + i);
    const k = (i + frac(spin)) / 4, yy = -h * (.12 + k * .52), w = s * (1.2 - k * .75);
    if (k > .99) continue;
    const arc = [[-w, yy - 18], [-w * .5, yy + 26], [0, yy + 40], [w * .5, yy + 26], [w, yy - 18]];
    paint(ribbon(through(arc), 40, 40), { wash: DP.vasuki, fill: DP.vasukiDk, fillOp: 45, tex: .4, ink: DP.ink, sw: 1.2 });
    inkLine(through(arc.map(([a, b]) => [a * .92, b - 6])), 2.4, DP.vasukiLt, 'ink', .5);
    for (let j = 1; j < 5; j++) { const [px, py] = through(arc)[Math.floor(j / 5 * (through(arc).length - 1))]; paint(ellPts(px, py + 4, 7, 5, 8), { wash: DP.vasukiDk, ink: null }); }
  }
  pop();
}
// one end of Vasuki, stretched from the mountain to a puller off to one side
function vasukiRope(a, b, key = 'vr', head = false) {
  boilSeed(key);
  const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 30];
  paint(ribbon(through([a, mid, b]), 30, 26), { wash: DP.vasuki, fill: DP.vasukiDk, fillOp: 45, tex: .4, ink: DP.ink, sw: 1.2 });
  if (head) { paint(ellPts(b[0], b[1], 44, 30, 14), { wash: DP.vasuki, ink: DP.ink, sw: 1.2 }); for (const s of [-1, 1]) paint(ellPts(b[0] + 12, b[1] + s * 10, 5, 5, 6), { wash: '#F2C230', ink: null }); }
}

// ---------- 3 · the depths and the dawn ----------
function depthSet(t, k = 0, sy = 1100) {
  boilSeed('ds deep');
  paint(rectPts(-300, -300, W + 600, 2600), { wash: DP.deepHi, ink: null });
  paint(ellPts(540, 700, 900, 1000, 30), { fill: DP.deep, fillOp: 200, bleed: .3, tex: .5, border: .2, ink: null });
  boilSeed('ds motes');
  for (let i = 0; i < 26; i++) { const x = hash(i * 4.1) * 1100, y = 2000 - frac(hash(i * 2.3) + t * .06) * 2200; paint(ellPts(x, y, 4 + 5 * hash(i), 4 + 5 * hash(i), 8), { wash: DP.deepLt, washOp: 160, ink: null }); }
}
function dawnSea(t, sy = 1250) {
  boilSeed('dw sky');
  paint(rectPts(-300, -300, W + 600, 2600), { wash: DP.dawnSky, ink: null });
  paint(ellPts(540, sy - 120, 1200, 600, 30), { fill: DP.dawnSky2, fillOp: 230, bleed: .3, tex: .4, border: .2, ink: null });
  sunDisc(540, sy - 40, 170, 'dw sun');
  glow(540, sy - 80, 600, '#FFD8A0', .55);
  boilSeed('dw sea');
  paint(rectPts(-300, sy, W + 600, 1400), { wash: DP.surf, fill: DP.riverDk, fillOp: 70, tex: .4, ink: DP.ink, sw: .8 });
  for (let r = 0; r < 6; r++) { boilSeed('dw rip' + r); const y = sy + 30 + r * r * 22; inkLine(Array.from({ length: 12 }, (_, j) => [-150 + j * 130, y + Math.sin(t * 2 + j + r) * 6]), 1.6, '#FFE6C8', 'inkfine', .6); }
}

// ---------- 4 · Hiranyakashipu's hall at dusk, the pillar ----------
function hallDusk(t, o = {}) {
  const fy = o.floorY ?? 1620, door = o.door ?? 760;
  boilSeed('hd wall');
  paint(rectPts(-300, -300, W + 600, 2600), { wash: DP.hall, fill: DP.hallDk, fillOp: 60, tex: .5, ink: null });
  // the doorway onto the dusk sky
  boilSeed('hd door');
  paint([[door - 190, fy], [door - 190, 980], [door, 840], [door + 190, 980], [door + 190, fy]], { wash: DP.duskHi, ink: DP.ink, sw: 2, curv: .3 });
  paint(ellPts(door, fy - 330, 200, 200, 20), { fill: DP.duskLo, fillOp: 200, bleed: .3, tex: .4, ink: null });
  sunDisc(door, fy - 330, 70, 'hd sun');
  glow(door, fy - 200, 420, '#FFB060', .5);
  boilSeed('hd floor');
  paint(rectPts(-300, fy, W + 600, 900), { wash: DP.stone, fill: DP.stoneDk, fillOp: 50, tex: .4, ink: DP.ink, sw: 1.2 });
  paint(rectPts(door - 230, fy - 6, 460, 40), { wash: DP.stoneLt, ink: DP.ink, sw: 1.4 });   // the threshold
  for (const px of [-60, 1140]) { boilSeed('hd col' + px); paint(rectPts(px - 70, 300, 140, fy - 300), { wash: DP.hallLt, fill: DP.hallDk, fillOp: 40, tex: .5, ink: DP.ink, sw: 1.4 }); }
}
// the pillar: (x, y) its foot, w wide, h tall; crack 0..1 (cracks run up it), burst 0..1 (it blows apart)
function pillar(x, y, w, h, crack = 0, burst = 0, t = 0, key = 'pil') {
  if (burst > .02) {
    const k = easeOut(clamp(burst));
    glow(x, y - h * .5, 500 + 600 * k, '#FFD27A', .9 * (1 - k * .5));
    for (let i = 0; i < 14; i++) {
      boilSeed(key + 'chunk' + i);
      const a = -Math.PI / 2 + (hash(i * 3.1) - .5) * 2.6, d = k * (300 + 500 * hash(i * 1.7)), cx = x + Math.cos(a) * d, cy = y - h * hash(i * 2.9) + Math.sin(a) * d + k * k * 400;
      push(); translate(cx, cy); rotate(k * 6 * (hash(i) - .5));
      paint(rectPts(-w * .18, -w * .14, w * .36, w * .28, 4), { wash: DP.stone, fill: DP.stoneDk, fillOp: 50, ink: DP.ink, sw: 1.2 });
      pop();
    }
    return;
  }
  boilSeed(key);
  paint(rectPts(x - w / 2, y - h, w, h), { wash: DP.stone, fill: DP.stoneDk, fillOp: 45, tex: .5, ink: DP.ink, sw: 1.6 });
  paint(rectPts(x - w * .65, y - h - 40, w * 1.3, 44), { wash: DP.stoneLt, ink: DP.ink, sw: 1.4 });
  paint(rectPts(x - w * .65, y - 40, w * 1.3, 40), { wash: DP.stoneLt, ink: DP.ink, sw: 1.4 });
  for (const k of [-.25, .25]) inkLine([[x + k * w, y - h + 10], [x + k * w, y - 50]], 1.4, DP.stoneDk, 'inkfine', 0);
  if (crack > .02) {
    boilSeed(key + 'crack');
    const n = 7, pts = Array.from({ length: n }, (_, i) => [x + (hash(i * 5.3) - .5) * w * .6, y - 60 - i * (h - 120) / (n - 1) * clamp(crack)]);
    glow(x, y - h * .5, 200 + 200 * crack, '#FFD27A', .6 * crack);
    inkLine(pts, 3 + 3 * crack, '#FFE6A0', 'ink', 0);
    for (let i = 1; i < n; i += 2) inkLine([pts[i], [pts[i][0] + (i % 4 ? 1 : -1) * w * .3, pts[i][1] - 30]], 2, '#FFE6A0', 'inkfine', 0);
  }
}

// ---------- 5 · Bali's sacrifice; the sky of the steps ----------
function yagnaSet(t, o = {}) {
  const gy = o.groundY ?? 1600;
  boilSeed('yg sky');
  paint(rectPts(-300, -300, W + 600, 2600), { wash: DP.ygSky, ink: null });
  paint(ellPts(540, gy - 300, 1100, 600, 30), { fill: DP.ygSky2, fillOp: 220, bleed: .3, tex: .4, border: .2, ink: null });
  boilSeed('yg canopy');   // a red canopy on four poles
  for (const px of [120, 960]) paint(rectPts(px - 12, 820, 24, gy - 820), { wash: DP.goldDk, ink: DP.ink, sw: 1.2 });
  paint([[40, 830], [540, 700], [1040, 830], [1000, 880], [900, 850], [800, 890], [700, 850], [600, 890], [500, 850], [400, 890], [300, 850], [200, 890], [80, 860]], { wash: DP.canopy, fill: DP.canopyDk, fillOp: 50, tex: .5, ink: DP.ink, sw: 1.6, curv: .1 });
  boilSeed('yg ground');
  paint(rectPts(-300, gy, W + 600, 900), { wash: DP.ygGround, fill: DP.ygGroundDk, fillOp: 50, tex: .5, ink: DP.ink, sw: 1.2 });
}
function starSky(t, o = {}) {
  boilSeed('sk sky');
  paint(rectPts(-300, -300, W + 600, 2600), { wash: DP.nightHi, ink: null });
  paint(ellPts(540, 1100, 1100, 1000, 30), { fill: DP.nightMid, fillOp: 220, bleed: .3, tex: .4, border: .2, ink: null });
  boilSeed('sk stars');
  for (let i = 0; i < 70; i++) { const x = hash(i * 2.3) * 1200 - 60, y = hash(i * 6.7) * 2000 - 40, tw = .5 + .5 * Math.sin(t * 2 + i); paint(starPts(x, y, 3 + 5 * hash(i * 1.3) * tw + 1, .45, 4), { wash: i % 5 ? DP.cream : DP.goldLt, washOp: 120 + 130 * tw, ink: null }); }
  for (let i = 0; i < 3; i++) { boilSeed('sk planet' + i); const [px, py, r, c] = [[180, 520, 30, '#E2A06A'], [900, 760, 22, '#BFD8FF'], [760, 1700, 40, '#F2C28A']][i]; paint(ellPts(px, py, r, r, 16), { wash: c, ink: DP.ink, sw: 1 }); }
}

// ---------- 9 · the warm bank and the Yamuna; the cool grove, the bodhi tree, the goat ----------
function warmBank(t, bend = 0, o = {}) {
  const gy = o.groundY ?? 1640;
  boilSeed('wb sky');
  paint(rectPts(-300, -300, W + 600, 2600), { wash: DP.warmHi, ink: null });
  paint(ellPts(540, gy - 200, 1100, 500, 30), { fill: DP.warmLo, fillOp: 160, bleed: .3, tex: .4, border: .2, ink: null });
  boilSeed('wb field');
  paint(rectPts(-300, gy - 260, W + 600, 1200), { wash: DP.field, fill: DP.fieldDk, fillOp: 50, tex: .5, ink: null });
  // the Yamuna: a band across the field that bends toward the plough (bend 0..1, toward bendTo)
  boilSeed('wb river');
  const bx = o.bendTo || [360, gy - 40], N = 12, top = [], bot = [];
  for (let i = 0; i <= N; i++) {
    const k = i / N, x = lerp(-250, 1330, k), base = gy - 170 + Math.sin(k * 3) * 30, pull = Math.exp(-Math.pow((x - bx[0]) / 260, 2)) * bend;
    const yc = lerp(base, bx[1], pull);
    top.push([x, yc - 46]); bot.push([x, yc + 46]);
  }
  paint([...top, ...bot.reverse()], { wash: DP.yamuna, fill: '#2A4E90', fillOp: 50, tex: .4, ink: DP.ink, sw: 1.2, curv: .5 });
  inkLine(top.map(([a, b]) => [a, b + 18]), 2, DP.yamunaLt, 'inkfine', .5);
}
function bodhiTree(x, y, s, t, key = 'bodhi') {
  boilSeed(key + 'trunk');
  paint([[x - s * .3, y], [x - s * .18, y - s * 1.6], [x - s * .6, y - s * 2.3], [x - s * .45, y - s * 2.4], [x, y - s * 1.9], [x + s * .4, y - s * 2.5], [x + s * .55, y - s * 2.4], [x + s * .2, y - s * 1.6], [x + s * .3, y]],
    { wash: DP.bark, fill: DP.barkDk, fillOp: 50, tex: .5, ink: DP.ink, sw: 1.4, curv: .3 });
  for (let i = 0; i < 9; i++) {
    boilSeed(key + 'can' + i);
    const a = Math.PI + (i + .5) / 9 * Math.PI, cx = x + Math.cos(a) * s * 1.5, cy = y - s * 2.6 + Math.sin(a) * s * .9;
    paint(ellPts(cx, cy, s * .62, s * .5, 14, 4), { wash: i % 2 ? DP.leaf : DP.grove, fill: DP.leafDk, fillOp: 50, tex: .5, ink: DP.ink, sw: 1 });
  }
  boilSeed(key + 'leaves');   // heart-shaped leaves fluttering at the rim
  for (let i = 0; i < 10; i++) { const a = Math.PI + hash(i * 3.3) * Math.PI, r = s * (1.7 + .3 * hash(i)), lx = x + Math.cos(a) * r, ly = y - s * 2.6 + Math.sin(a) * r * .6; push(); translate(lx, ly); rotate(Math.sin(t * 2 + i) * .3 + a); paint(heartPts(0, 0, s * .12), { wash: DP.leaf, ink: DP.ink, sw: .8 }); pop(); }
}
function coolGrove(t, o = {}) {
  const gy = o.groundY ?? 1640;
  boilSeed('cg sky');
  paint(rectPts(-300, -300, W + 600, 2600), { wash: DP.coolHi, ink: null });
  paint(ellPts(540, gy - 200, 1100, 500, 30), { fill: DP.coolLo, fillOp: 160, bleed: .3, tex: .4, border: .2, ink: null });
  boilSeed('cg ground');
  paint(rectPts(-300, gy - 40, W + 600, 1200), { wash: DP.grove, fill: DP.groveDk, fillOp: 50, tex: .5, ink: null });
}
// a little white goat in side view facing right; (x, y) the ground under its middle; walk (phase), sit 0..1 (lies down)
function goat(x, y, s, o = {}) {
  const key = o.key || 'goat', P = pts => U(pts, s), sit = clamp(o.sit || 0), INK = DP.ink;
  push(); translate(x, y); if (o.flip) scale(-1, 1);
  boilSeed(key + 'legs');
  if (sit < .9) for (const [lx, ph] of [[-1.5, .5], [1.3, 0], [-1.1, 0], [1.6, .5]]) { const a = o.walk != null ? Math.sin((o.walk + ph) * TAU) * .4 : 0; push(); translate(lx * s, -1.6 * s); rotate(a); inkLine(P([[0, 0], [0, 1.6 * (1 - sit)]]), s * .32, DP.goatDk, 'ink', 0); pop(); }
  translate(0, sit * 1.2 * s);
  boilSeed(key + 'body');
  paint(ellPts(0, -2.4 * s, 2.3 * s, 1.15 * s, 18, s * .05), { wash: DP.goat, fill: DP.goatDk, fillOp: 50, tex: .4, ink: INK, sw: 1.2 });
  inkLine(P([[-2.2, -2.8], [-2.6, -3.3]]), 2, DP.goatDk, 'ink', .4);   // the tail
  boilSeed(key + 'head');
  paint(P([[1.6, -3.0], [2.6, -4.4], [3.4, -4.2], [3.6, -3.4], [2.9, -3.0], [2.0, -2.4]]), { wash: DP.goat, ink: INK, sw: 1.2, curv: .5 });
  paint(P([[2.4, -4.3], [2.0, -5.0], [2.6, -4.5]]), { wash: '#C8A27A', ink: INK, sw: .8 });   // a little horn
  paint(P([[2.6, -4.1], [1.8, -3.9], [2.4, -3.8]]), { wash: DP.goatDk, ink: INK, sw: .8 });   // the ear
  paint(ellPts(3.0 * s, -3.95 * s, .16 * s, .16 * s, 8), { wash: INK, ink: null });
  inkLine(P([[3.2, -3.2], [3.3, -2.7]]), 1.4, DP.goatDk, 'inkfine', .3);   // the beard
  pop();
}

// ---------- 10 · Kalki's storm ----------
function kalkiStorm(t, o = {}) {
  const b = clamp(o.bolt || 0), fy = o.floorY ?? 1640;
  boilSeed('ks sky');
  paint(rectPts(-300, -300, W + 600, 2600), { wash: mixCol(DP.kHi, '#8A8AC8', b * .6), ink: null });
  paint(ellPts(540, fy - 300, 1300, 700, 30), { fill: mixCol(DP.kMid, '#C8C8F0', b * .5), fillOp: 220, bleed: .3, tex: .5, border: .2, ink: null });
  boilSeed('ks clouds');
  for (let i = 0; i < 8; i++) { const x = frac(hash(i * 2.9) - t * .04) * 1700 - 300, y = 380 + i * 110; paint(ellPts(x, y, 300, 70, 16), { wash: mixCol(DP.kMid, '#6E6EA8', b * .5), washOp: 210, ink: null }); }
  if (o.boltPts) bolt(o.boltPts, b, 'ks bolt', 14);
  boilSeed('ks ground');
  paint([[-300, fy], [400, fy - 20], [1380, fy + 10], [1380, 2600], [-300, 2600]], { wash: mixCol('#141226', '#4A4A7A', b * .5), ink: DP.ink, sw: 1, curv: .4 });
  boilSeed('ks rain');
  for (let i = 0; i < 46; i++) { const x = frac(hash(i * 5.7) + t * .3) * 1400 - 200, y = frac(hash(i * 1.9) + t * 1.8) * 2100 - 200; inkLine([[x, y], [x - 26, y + 100]], 1.3, '#8A9AC8', 'inkfine', 0); }
}

// ---------- the ask: a ring of medallions round Vishnu, one icon per form ----------
function medallion(i, x, y, r, t, k, o = {}) {
  if (k <= .01) return;
  const p = backOut(clamp(k)), key = 'med' + i;
  boilSeed(key);
  push(); translate(x, y); scale(p);
  const dark = i === 9;
  paint(ellPts(0, 0, r + 7, r + 7, 22), { wash: DP.goldDk, ink: DP.ink, sw: 1.4 });
  paint(ellPts(0, 0, r, r, 22), { wash: dark ? '#1A1A3A' : DP.cream, fill: dark ? '#0A0A1A' : '#F2E2C8', fillOp: 60, tex: .3, ink: null });
  const s = r / 50;
  if (i === 0) matsya(0, 4 * s, 6.5 * s, { boilKey: key + 'f', horn: 1, eyes: 'happy', swim: t });
  if (i === 1) kurma(0, 22 * s, 9 * s, { boilKey: key + 't', eyes: 'happy', neck: .7, noShadow: true });
  if (i === 2) pmHead('varaha', 0, 2 * s, 15 * s, { eyes: 'happy', mouth: 'smile', boilKey: key + 'v' });
  if (i === 3) pmHead('narasimha', 0, 4 * s, 13 * s, { eyes: 'angry', mouth: 'roar', boilKey: key + 'n' });
  if (i === 4) { push(); translate(0, 36 * s); chhatra(7.6 * s, .8, 1); pop(); }
  if (i === 5) { push(); translate(-8 * s, 30 * s); rotate(-.45); parashu(5.4 * s, .8, { glow: .3 }); pop(); }
  if (i === 6) {   // the Kodanda: a bow, its string and an arrow
    boilSeed(key + 'bow');
    const arc = Array.from({ length: 9 }, (_, j) => { const a = -1.15 + j / 8 * 2.3; return [-18 * s + Math.cos(a) * 30 * s, Math.sin(a) * 36 * s]; });
    inkLine([arc[0], arc[8]], 1.2, '#3A2A20', 'inkfine', 0);
    inkLine([[-22 * s, 0], [26 * s, 0]], 2.2, '#5E3418', 'ink', 0);
    paint([[26 * s, -5 * s], [34 * s, 0], [26 * s, 5 * s]], { wash: '#8E96A6', ink: DP.ink, sw: .6 });
    inkLine(arc, 3.4 * s, '#8A5230', 'ink', .2);
  }
  if (i === 7) {   // the flute and a peacock feather
    boilSeed(key + 'flute'); push(); rotate(-.55); paint(rrPts(-36 * s, 6 * s, 72 * s, 8 * s, 4 * s), { wash: '#C8862E', ink: DP.ink, sw: .8 }); for (let j = 0; j < 4; j++) paint(ellPts((-10 + j * 9) * s, 10 * s, 2 * s, 2 * s, 6), { wash: '#5E3418', ink: null }); pop();
    boilSeed(key + 'feather'); push(); translate(10 * s, -14 * s); rotate(.5);
    inkLine([[0, 30 * s], [0, -10 * s]], 1.2, '#3E7A40', 'inkfine', 0);
    paint(ellPts(0, -18 * s, 11 * s, 16 * s, 14), { wash: '#3EA86A', ink: DP.ink, sw: .6 });
    paint(ellPts(0, -16 * s, 6.5 * s, 9 * s, 12), { wash: '#2F7FB8', ink: null });
    paint(ellPts(0, -15 * s, 3.2 * s, 4.4 * s, 10), { wash: '#1E2A4A', ink: null });
    pop();
  }
  if (i === 8) {
    const flip = Math.cos(t * 2.4), w = Math.abs(flip);
    push(); scale(w, 1);
    if (flip > 0) { push(); rotate(.4); translate(-4 * s, -34 * s); hala(5.6 * s, .8, 0); pop(); }
    else { boilSeed(key + 'leaf'); paint(heartPts(0, 4 * s, 30 * s), { wash: DP.leaf, fill: DP.leafDk, fillOp: 50, ink: DP.ink, sw: 1 }); inkLine([[0, 34 * s], [0, -20 * s]], 1.2, DP.leafDk, 'inkfine', 0); }
    pop();
  }
  if (i === 9) { letter('?', x, y + 4, r * 1.3, DP.goldLt, { ink: false, rot: 0, pop: k * 3 }); }
  pop();
}
