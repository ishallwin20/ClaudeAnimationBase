// heads_props.js: the sets and effects for "Imagine waking up as RAVANA" (src/scenes/heads.js). Loaded before it;
// everything here is a pure function of its arguments (and T for boil).
//
//   TK, vanishPuff, sparkleBurst, whipH, veil, impact, twinkle      copied from ad 12
//   LK                                       the palette of this reel (golden Lanka, a lilac dawn)
//   bedSet(t, o), quilt(t, o), alarmClock(x, y, s, o), clockBits(x, y, age)   the bedroom
//   mirrorBack(t), mirrorFrame(t, o), toothbrush(p0, p1, u, sw), foam(x, y, s, k, key)   the bathroom mirror
//   dineSet(t), dineTable(t), laddoo(x, y, r, key), laddooPile(x, y, n, r)   breakfast
//   doorRoom(t), doorWall(t), bubble(txt, x, y, size, age, o)        the doorway; a speech bubble
//   penanceSet(t, o), firePit(x, y, t, flare), brahma(x, y, s, o)   long ago: the sacred fire, Brahma
//   sunriseSet(t), rama(x, y, s, o), grassBlade(x, y, s, rot)       the sunrise, Rama's silhouette
//   dussehraSet(t), bamboo(x, y, u), crowd(t, cheer), firework(x, y, age, s, col, key), fountain(x, y, t, k, key)
//   tagPill(txt, x, y, age, o)               a word tag over a head
//   rkCard3(t, C)                            the end card: Books 1–3, set of 3 for ₹500
const TK = {
  ink: '#2B2233', cream: '#FFF5E2',
  petal: '#F4A6B8', petalDk: '#E0708C', marigold: '#F39A2E', yellow: '#FFD45A', leaf: '#5E9A6A',
  gold: '#EDB43C', goldLt: '#FFE39A', goldDk: '#B67D1C',
  rkOrange: '#F15A24', peach: '#FBE0CF', peachLt: '#FFF1E6', brown: '#3A2418', grey: '#6B5A50', teal: '#2E5F5A',
};
const LK = {
  ink: '#2E2226',
  wall: '#D7C4E6', wallDk: '#B49DD0', wallLt: '#E9DDF3', sun: '#FFD27A', sunLt: '#FFF0C0',
  quilt: '#E8833A', quiltDk: '#C2622A', quiltLt: '#F6B26B', pillow: '#FFF5E2', pillowDk: '#E6D3B8', wood: '#8A4E2E', woodDk: '#5E3220',
  tile: '#5FA8A0', tileDk: '#3E8078', tileLt: '#8CCBC2', glass: '#DCEFF0', glassDk: '#B4D8DA',
  peach: '#F6D2B4', peachDk: '#E2AE86', arch: '#F2C76A', archDk: '#C9962E', laddoo: '#F2A93B', laddooDk: '#C97A1C', laddooLt: '#FFD27A',
  thali: '#E8C25A', thaliDk: '#B88A2A', table: '#9A5A34', tableDk: '#6E3A1E',
  palace: '#F2C76A', palaceDk: '#C9962E', palaceLt: '#FFE39A', room: '#CDB8E2', roomDk: '#A891C6', floor: '#E8B26A', floorDk: '#C48A44',
  sepia: '#3A3050', sepiaLt: '#5C4A6E', tree: '#2A2440', fire: '#FF8A2A', fireLt: '#FFD45A', fireDk: '#E0502A', brick: '#B5643E', brickDk: '#7E3E22',
  lotus: '#F4A6B8', lotusDk: '#E0708C', brahma: '#F2B48A', brahmaDk: '#D08A60', beard: '#FBF5EA', robe: '#E0573A', robeDk: '#A83A26',
  dawnTop: '#F6A06A', dawnLow: '#FFD8A0', hill: '#5E8A5A', hillDk: '#3E6A4A', ramaSil: '#24305A', ramaRim: '#FFD27A',
  night: '#0E1236', nightMid: '#1C2460', nightLow: '#3A3470', field: '#2A2440', crowdA: '#141028', crowdB: '#221A3A',
  spark: ['#FFE39A', '#FF8A5A', '#9AE0FF', '#FF9AD0', '#B8FF9A'], foam: '#FFFFFF', foamDk: '#CFE6F2', tag: '#FFF5E2',
};

// ---------- copied from ad 12 ----------
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
// a small bonk: stars and a ring, no full-frame flash
function bonk(x, y, age, s, key = 'bonk') {
  if (age < 0 || age > .45) return;
  const k = age / .45; boilSeed(key);
  glow(x, y, s * (1 + k), '#FFD27A', .7 * (1 - k));
  for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + hash(i * 4) * .4, d = s * (.3 + 1.1 * easeOut(k)); paint(starPts(x + Math.cos(a) * d, y + Math.sin(a) * d, s * .3 * (1 - k * .7), .35, 4, a), { wash: i % 2 ? '#FFE08A' : '#FFF4DC', ink: LK.ink, sw: .6 }); }
}
function twinkle(x, y, age, s = 40, key = 'twinkle') {
  if (age < 0 || age > .6) return;
  boilSeed(key);
  const k = Math.sin(age / .6 * Math.PI);
  glow(x, y, s * 2 * k, '#FFF4C8', .9 * k);
  paint(starPts(x, y, s * k, .25, 4, -Math.PI / 2 + age * 2), { wash: '#FFFDF2', ink: null });
}

// ---------- the bedroom (world = screen at zoom 1) ----------
// o: morning 0..1 (warmer light for the ask)
function bedSet(t, o = {}) {
  boilSeed('bedwall');
  paint(rectPts(-400, -400, W + 800, H + 800), { wash: LK.wall, ink: null });
  paint(rectPts(-400, 200, W + 800, 900), { fill: LK.wallLt, fillOp: 120, bleed: .25, tex: .4, ink: null });
  glow(820, 560, 520, LK.sun, .35 + .25 * (o.morning || 0));
  // a gold arched window, top right, the sunrise in it
  boilSeed('bedwin');
  const wx = 880, wy = 420, ww = 130, wh = 200;
  const arch = []; for (let i = 0; i <= 16; i++) { const a = Math.PI + i / 16 * Math.PI; arch.push([wx + Math.cos(a) * ww, wy - wh + Math.sin(a) * ww]); }
  const win = [[wx - ww, wy + wh * .3], ...arch, [wx + ww, wy + wh * .3]];
  paint(win, { wash: LK.sunLt, fill: LK.sun, fillOp: 120, bleed: .1, tex: .4, ink: LK.ink, sw: 1.2 });
  paint(ellPts(wx, wy - 40, 70, 70, 24), { wash: LK.sun, ink: null });
  inkLine([[wx, wy - wh - ww + 10], [wx, wy + wh * .3]], 3, LK.archDk, 'ink', 0);
  inkLine([[wx - ww, wy - 60], [wx + ww, wy - 60]], 3, LK.archDk, 'ink', 0);
  inkLine([...win, win[0]], 6, LK.arch, 'ink', .2);
  // the headboard: a long carved gold board behind him
  boilSeed('bedhead');
  paint([[-80, 1420], [-80, 1080], [120, 1000], [320, 960], [540, 900], [760, 960], [960, 1000], [1160, 1080], [1160, 1420]], { wash: LK.arch, fill: LK.archDk, fillOp: 60, tex: .5, ink: LK.ink, sw: 1.4, curv: .4 });
  for (let i = 0; i < 9; i++) paint(ellPts(40 + i * 125, 1100 - 90 * Math.sin(i / 8 * Math.PI), 16, 16, 10), { wash: LK.quiltDk, ink: LK.ink, sw: .6 });
  // the ONE very long pillow behind the heads
  boilSeed('bedpillow');
  paint(rrPts(-60, 1150, W + 120, 170, 80), { wash: LK.pillow, fill: LK.pillowDk, fillOp: 70, tex: .5, ink: LK.ink, sw: 1.2 });
  for (let i = 0; i < 6; i++) inkLine([[60 + i * 190, 1175], [90 + i * 190, 1215]], 1, LK.pillowDk, 'inkfine', .5);
}
function quilt(t, o = {}) {
  const top = o.top ?? 1290, br = Math.sin(t * 1.6) * 6 * (o.breathe ?? 1);
  boilSeed('quilt');
  paint([[-80, top + 40], [120, top - 10 - br], [330, top + 15], [540, top - 15 - br], [760, top + 10], [960, top - 20 - br], [1160, top + 30], [1160, H + 80], [-80, H + 80]], { wash: LK.quilt, fill: LK.quiltDk, fillOp: 60, bleed: .05, tex: .6, ink: LK.ink, sw: 1.5, curv: .5 });
  boilSeed('quiltpat');
  for (let r = 0; r < 4; r++) for (let i = 0; i < 7; i++) {
    const x = 80 + i * 160 + (r % 2) * 80, y = top + 110 + r * 150;
    paint(starPts(x, y, 26, .45, 6, t * .0), { wash: LK.quiltLt, ink: null });
  }
  inkLine([[-80, top + 70], [540, top + 40 - br], [1160, top + 60]], 6, LK.arch, 'ink', .5);
}
// the alarm clock (s = radius px); o: ring 0..1 (shakes), smashed 0..1 (flattened), age (for the ring lines)
function alarmClock(x, y, s, o = {}) {
  const r = o.ring || 0, sm = clamp(o.smashed || 0), j = r ? Math.sin(T * 70) * s * .08 : 0, a = r ? Math.sin(T * 55) * .12 : 0;
  boilSeed('clock');
  push(); translate(x + j, y); rotate(a); scale(1 + sm * .5, 1 - sm * .65);
  for (const sd of [-1, 1]) paint(ellPts(sd * s * .62, -s * .95, s * .36, s * .3, 12, 0, sd * .4), { wash: LK.arch, fill: LK.archDk, fillOp: 60, ink: LK.ink, sw: 1 });
  inkLine([[-s * .3, -s * 1.2], [s * .3, -s * 1.2]], 3, LK.ink, 'ink', 0);
  for (const sd of [-1, 1]) inkLine([[sd * s * .5, s * .8], [sd * s * .7, s * 1.15]], 4, LK.ink, 'ink', 0);
  paint(ellPts(0, 0, s, s, 26), { wash: '#E2574A', fill: '#B93C34', fillOp: 60, tex: .4, ink: LK.ink, sw: 1.3 });
  paint(ellPts(0, 0, s * .78, s * .78, 24), { wash: LK.pillow, ink: LK.ink, sw: .8 });
  for (let i = 0; i < 12; i++) { const q = i / 12 * TAU; inkLine([[Math.cos(q) * s * .62, Math.sin(q) * s * .62], [Math.cos(q) * s * .7, Math.sin(q) * s * .7]], 1.5, LK.ink, 'inkfine', 0); }
  inkLine([[0, 0], [0, -s * .5]], 3, LK.ink, 'ink', 0); inkLine([[0, 0], [s * .38, s * .12]], 3, LK.ink, 'ink', 0);
  pop();
  if (r > .05) {   // ring marks: little arcs either side
    boilSeed('clockring');
    for (const sd of [-1, 1]) for (let k = 0; k < 3; k++) {
      const rr = s * (1.3 + k * .38 + .15 * Math.sin(T * 30 + k)), P = [];
      for (let i = 0; i <= 6; i++) { const q = (sd < 0 ? Math.PI : 0) + (-.45 + i / 6 * .9) * sd; P.push([x + Math.cos(q) * rr, y - s * .3 + Math.sin(q) * rr]); }
      inkLine(P, 3.2 - k * .6, LK.ink, 'ink', .5);
    }
  }
}
// the clock's bits flying out at the smash (age 0..)
function clockBits(x, y, age) {
  if (age < 0 || age > 1.1) return;
  boilSeed('clockbits');
  for (let i = 0; i < 7; i++) {
    const vx = (hash(i * 3.1) - .5) * 900, vy = -500 - 500 * hash(i * 1.7), px = x + vx * age, py = y + vy * age + 1500 * age * age, r = 9 + 8 * hash(i);
    if (i % 3 === 0) { const P = []; for (let k = 0; k < 14; k++) { const q = k * .9 + age * 12; P.push([px + Math.cos(q) * (3 + k * 1.2), py + Math.sin(q) * (3 + k * 1.2)]); } inkLine(P, 2, LK.ink, 'inkfine', .5); }
    else paint(starPts(px, py, r, .55, 8, age * 9 + i), { wash: i % 2 ? LK.arch : '#E2574A', ink: LK.ink, sw: .7 });
  }
}

// ---------- the bathroom: we ARE the mirror ----------
const MIR = { x: 540, y: 1060, r: 470 };
function mirrorBack(t) {
  boilSeed('mirback');
  paint(rectPts(-400, -400, W + 800, H + 800), { wash: LK.glass, ink: null });
  for (let r = 0; r < 12; r++) for (let c = 0; c < 8; c++) {
    const x = -60 + c * 170 + (r % 2) * 85, y = 300 + r * 130;
    paint(rrPts(x, y, 160, 120, 10), { wash: (r + c) % 3 ? LK.glass : LK.glassDk, ink: null });
  }
  glow(400, 700, 400, '#FFFFFF', .3);
}
// the tiles around the mirror and its gold frame (screen space: call outside the camera); o.fog 0..1
function mirrorFrame(t, o = {}) {
  const { x, y, r } = MIR, ring = (r0, a0, a1, n = 24) => { const P = []; for (let i = 0; i <= n; i++) { const q = lerp(a0, a1, i / n); P.push([x + Math.cos(q) * r0, y + Math.sin(q) * r0]); } return P; };
  boilSeed('mirtiles');
  // two half-rings: the tiled wall outside the glass, top half and bottom half
  paint([[-200, y], [-200, -200], [W + 200, -200], [W + 200, y], ...ring(r, 0, -Math.PI)], { wash: LK.tile, ink: null });
  paint([[W + 200, y], [W + 200, H + 200], [-200, H + 200], [-200, y], ...ring(r, Math.PI, 0)], { wash: LK.tile, ink: null });
  boilSeed('mirgrout');
  for (let i = 0; i < 9; i++) { const gx = i * 135; inkLine([[gx, -50], [gx, y - Math.sqrt(Math.max(0, r * r - (gx - x) * (gx - x))) - 10]], 2, LK.tileDk, 'inkfine', 0); inkLine([[gx, y + Math.sqrt(Math.max(0, r * r - (gx - x) * (gx - x))) + 10], [gx, H + 50]], 2, LK.tileDk, 'inkfine', 0); }
  for (let j = 0; j < 15; j++) { const gy = j * 135; const dx = Math.abs(gy - y) < r ? Math.sqrt(r * r - (gy - y) * (gy - y)) + 10 : -1; if (dx < 0) inkLine([[-50, gy], [W + 50, gy]], 2, LK.tileDk, 'inkfine', 0); else { inkLine([[-50, gy], [x - dx, gy]], 2, LK.tileDk, 'inkfine', 0); inkLine([[x + dx, gy], [W + 50, gy]], 2, LK.tileDk, 'inkfine', 0); } }
  if (o.fog) { boilSeed('mirfog'); for (let i = 0; i < 7; i++) paint(ellPts(x + (hash(i) - .5) * r * 1.4, y + (hash(i * 3) - .5) * r * 1.4, r * .4, r * .3, 14), { wash: '#FFFFFF', washOp: 120 * clamp(o.fog), ink: null }); }
  boilSeed('mirframe');
  for (const [a0, a1] of [[0, -Math.PI], [Math.PI, 0]]) paint([...ring(r + 58, a0, a1), ...ring(r - 4, a1, a0)], { wash: LK.arch, fill: LK.archDk, fillOp: 50, tex: .5, ink: null });
  inkLine(ring(r - 2, 0, TAU + .05, 60), 3, LK.archDk, 'ink', .5);
  inkLine(ring(r + 56, 0, TAU + .05, 60), 3, LK.archDk, 'ink', .5);
  for (let i = 0; i < 16; i++) { const q = i / 16 * TAU; paint(ellPts(x + Math.cos(q) * (r + 28), y + Math.sin(q) * (r + 28), 9, 9, 8), { wash: i % 2 ? '#D2304A' : '#2E9E8A', ink: LK.ink, sw: .5 }); }
  // the crest on top, the sink ledge at the bottom
  paint([[x - 90, y - r - 50], [x - 40, y - r - 110], [x, y - r - 150], [x + 40, y - r - 110], [x + 90, y - r - 50]], { wash: LK.arch, fill: LK.archDk, fillOp: 60, ink: LK.ink, sw: 1, curv: .4 });
  paint(ellPts(x, y - r - 95, 16, 16, 10), { wash: '#D2304A', ink: LK.ink, sw: .6 });
  boilSeed('mirsink');
  paint(rrPts(-60, 1590, W + 120, 70, 20), { wash: '#F4EBDD', fill: '#D8CCB8', fillOp: 80, ink: LK.ink, sw: 1.2 });
  paint(rectPts(-60, 1650, W + 120, 400), { wash: LK.tileDk, ink: null });
}
// a toothbrush from the hand (p0) to the mouth (p1), world px
function toothbrush(p0, p1, sw = 1, dry = false) {
  const dx = p1[0] - p0[0], dy = p1[1] - p0[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
  const tip = [p1[0] - ux * 6, p1[1] - uy * 6];
  paint(ribbon([p0, tip], 11, 9), { wash: '#5EC3E8', ink: LK.ink, sw: sw * .6 });
  paint(ribbon([[tip[0] - ux * 26, tip[1] - uy * 26], tip], 15, 15), { wash: '#FFFFFF', ink: LK.ink, sw: sw * .5 });
  if (dry) for (let i = 0; i < 4; i++) inkLine([[tip[0] - ux * (5 + i * 6), tip[1] - uy * (5 + i * 6)], [tip[0] - ux * (5 + i * 6) - uy * 12, tip[1] - uy * (5 + i * 6) + ux * 12]], 1.6, '#9AA6B4', 'inkfine', 0);
}
// foam at a mouth: k 0..1 how much
function foam(x, y, s, k, key = 'foam') {
  if (k <= .02) return;
  boilSeed(key);
  for (let i = 0; i < 7; i++) { const a = i / 7 * TAU + hash(i * 2) * .8, d = s * (.3 + .5 * hash(i * 3)) * k, r = s * (.18 + .12 * hash(i)) * (.5 + .5 * k) * (1 + .1 * Math.sin(T * 9 + i)); paint(ellPts(x + Math.cos(a) * d, y + Math.sin(a) * d * .6 + s * .1, r, r * .9, 10, 1), { wash: i % 3 ? LK.foam : LK.foamDk, ink: LK.ink, sw: .45 }); }
}

// ---------- breakfast ----------
function dineSet(t) {
  boilSeed('dinewall');
  paint(rectPts(-400, -400, W + 800, H + 800), { wash: LK.peach, ink: null });
  for (let i = 0; i < 4; i++) {   // three gold arches across the back wall
    const cx = -60 + i * 400, P = []; for (let k = 0; k <= 14; k++) { const a = Math.PI + k / 14 * Math.PI; P.push([cx + Math.cos(a) * 150, 760 + Math.sin(a) * 150]); }
    paint([[cx - 150, 1400], ...P, [cx + 150, 1400]], { wash: LK.peachDk, fill: LK.archDk, fillOp: 30, bleed: .1, tex: .5, ink: LK.arch, sw: 4 });
  }
  glow(540, 700, 600, LK.sun, .3);
}
function dineTable(t, top = 1490) {
  boilSeed('dinetable');
  paint([[-80, top], [1160, top], [1160, H + 80], [-80, H + 80]], { wash: LK.table, fill: LK.tableDk, fillOp: 60, tex: .5, ink: LK.ink, sw: 1.4 });
  paint(rectPts(-80, top - 15, 1240, 40), { wash: LK.arch, fill: LK.archDk, fillOp: 60, ink: LK.ink, sw: 1.2 });
  for (let i = 0; i < 7; i++) paint(ellPts(30 + i * 170, top + 110, 22, 22, 10), { wash: LK.arch, ink: LK.ink, sw: .7 });
}
function laddoo(x, y, r, key = 'ld') {
  paint(ellPts(x, y, r, r * .95, 14, r * .03), { wash: LK.laddoo, fill: LK.laddooDk, fillOp: 70, tex: .7, ink: LK.ink, sw: .8 });
  for (let i = 0; i < 4; i++) paint(ellPts(x + (hash(i + r) - .5) * r, y + (hash(i * 3 + r) - .5) * r, r * .1, r * .1, 6), { wash: LK.laddooLt, ink: null });
}
// a pyramid of n laddoos (rows of 7, 6, …; the top ones go first) on a gold thali at (x, y)
function laddooPile(x, y, n, r = 24) {
  boilSeed('thali');
  paint(ellPts(x, y + 8, 240, 46, 30), { wash: LK.thali, fill: LK.thaliDk, fillOp: 60, tex: .4, ink: LK.ink, sw: 1.2 });
  paint(ellPts(x, y + 2, 205, 34, 30), { wash: mixCol(LK.thali, '#FFFFFF', .2), ink: null });
  boilSeed('pile');
  let k = 0;
  for (let row = 0; row < 7; row++) for (let c = 0; c < 7 - row; c++) {
    if (k++ >= n) return;
    laddoo(x + (c - (6 - row) / 2) * r * 1.9, y - 6 - row * r * 1.55, r, 'ld' + k);
  }
}
const PILE_N = 28;

// ---------- the doorway ----------
const DOORWAY = { x0: 250, x1: 830, top: 760, floor: 1640 };
function doorRoom(t) {
  boilSeed('droom');
  paint(rectPts(-400, -400, W + 800, H + 800), { wash: LK.room, ink: null });
  paint(rectPts(-400, 1380, W + 800, 900), { wash: LK.floor, fill: LK.floorDk, fillOp: 60, bleed: .1, tex: .5, ink: null });
  inkLine([[-400, 1380], [W + 400, 1380]], 2, LK.floorDk, 'ink', 0);
  for (let i = 0; i < 6; i++) paint(ellPts(120 + i * 180, 900, 26, 60, 12), { wash: LK.roomDk, ink: null });
  glow(540, 1000, 500, LK.sun, .25);
}
// the foreground wall with the arched opening (world px)
function doorWall(t) {
  const { x0, x1, top, floor } = DOORWAY, cx = (x0 + x1) / 2, rw = (x1 - x0) / 2, arc = [];
  for (let i = 0; i <= 20; i++) { const a = -i / 20 * Math.PI; arc.push([cx + Math.cos(a) * rw, top + Math.sin(a) * rw * .9]); }
  boilSeed('dwall');
  const o = { wash: LK.palace, fill: LK.palaceDk, fillOp: 50, bleed: .06, tex: .5, ink: null };
  paint([[-400, -400], [x0, -400], [x0, floor + 400], [-400, floor + 400]], o);
  paint([[x1, -400], [W + 400, -400], [W + 400, floor + 400], [x1, floor + 400]], o);
  paint([[x0 - 2, -400], [x1 + 2, -400], [x1 + 2, top], ...arc, [x0 - 2, top]], o);
  paint(rectPts(-400, floor, W + 800, 400), { wash: LK.palaceDk, ink: null });
  boilSeed('dtrim');
  inkLine([[x0, floor], [x0, top], ...arc, [x1, top], [x1, floor]], 22, LK.arch, 'ink', .3);
  inkLine([[x0 - 14, floor], [x0 - 14, top], ...arc.map(([a, b]) => [cx + (a - cx) * 1.05, top + (b - top) * 1.05]), [x1 + 14, top], [x1 + 14, floor]], 3, LK.archDk, 'ink', .3);
  for (const sx of [x0 - 120, x1 + 120]) { paint(rrPts(sx - 40, 900, 80, 520, 30), { wash: LK.palaceLt, ink: LK.archDk, sw: 2 }); paint(ellPts(sx, 1160, 22, 22, 10), { wash: '#D2304A', ink: LK.ink, sw: .6 }); }
}
// a speech bubble with a word, world px; o: tail [x, y], col
function bubble(txt, x, y, size, age, o = {}) {
  if (age < 0 || age > (o.life ?? 9)) return;
  const k = backOut(clamp(age * 5)), w = Math.max(size * 1.6, txt.length * size * .62) + size * .6, h = size * 1.5, a = 1 - seg(age, (o.life ?? 9) - .2, o.life ?? 9);
  if (a <= 0) return;
  boilSeed('bub ' + txt + x);
  push(); translate(x, y); scale(k);
  if (o.tail) paint([[-size * .3, h * .3], [size * .3, h * .3], [o.tail[0] - x, o.tail[1] - y]], { wash: o.col || LK.tag, ink: LK.ink, sw: .9 });
  paint(rrPts(-w / 2, -h / 2, w, h, h / 2), { wash: o.col || LK.tag, ink: LK.ink, sw: 1.1 });
  pop();
  letter(txt, x, y + size * .05, size * k, o.ink || LK.ink, { font: `700 ${size * k}px Poppins`, ink: false, alpha: a, rot: o.rot ?? 0 });
}

// ---------- long ago: the sacred fire ----------
// o: lapse 0..1 (the time-lapse: day and night flicker), lapseT (its clock)
function penanceSet(t, o = {}) {
  const lp = o.lapse || 0, day = lp > 0 ? .5 + .5 * Math.sin((o.lapseT || 0) * 9) : 0;
  boilSeed('pensky');
  paint(rectPts(-400, -400, W + 800, H + 800), { wash: mixCol(LK.sepia, '#E8A060', day * .55), ink: null });
  paint(rectPts(-400, 900, W + 800, 500), { fill: mixCol(LK.sepiaLt, '#F6C080', day * .5), fillOp: 160, bleed: .25, tex: .3, ink: null });
  boilSeed('penstars');
  for (let i = 0; i < 30; i++) { const tw = (.55 + .45 * Math.sin(t * 2.4 + i)) * (1 - day); if (tw > .05) paint(starPts(hash(i * 1.3) * W, 300 + hash(i * 2.9) * 700, (3 + 6 * hash(i * 4)) * tw, .35, 4), { wash: '#FFF1C8', ink: null }); }
  if (lp > 0) {   // the sun and the moon racing over
    const ph = (o.lapseT || 0) * 9 / TAU, a = frac(ph) * Math.PI, cx = 540 - Math.cos(a) * 620, cy = 1150 - Math.sin(a) * 600;
    boilSeed('penlapse');
    const sunUp = Math.floor(ph) % 2 === 0;
    glow(cx, cy, 160, sunUp ? '#FFD27A' : '#C8D0FF', .6 * lp);
    paint(ellPts(cx, cy, 50, 50, 20), { wash: sunUp ? '#FFD27A' : '#FFF2D2', ink: null });
  }
  boilSeed('pentrees');
  for (let i = 0; i < 9; i++) { const x = -60 + i * 150 + hash(i) * 40, h = 380 + 220 * hash(i * 2); paint([[x - 70, 1330], [x - 20, 1330 - h * .55], [x - 50, 1330 - h * .5], [x, 1330 - h], [x + 50, 1330 - h * .5], [x + 20, 1330 - h * .55], [x + 70, 1330]], { wash: LK.tree, ink: null, curv: .2 }); }
  boilSeed('penground');
  paint(rectPts(-400, 1320, W + 800, 900), { wash: '#2C2238', fill: '#1E1828', fillOp: 80, tex: .5, ink: null });
}
// the sacred fire in its brick pit (x, y = the pit's top centre); flare 0..1 a burst
function firePit(x, y, t, flare = 0) {
  glow(x, y - 90, 260 + 160 * flare, '#FF9A3A', .75 + .25 * flare);
  boilSeed('fire');
  for (let i = 0; i < 7; i++) {
    const ph = t * (5 + i * .7) + i * 1.3, hgt = (120 + 70 * Math.sin(ph) + 50 * hash(i)) * (1 + flare * 1.2), bx = x + (i - 3) * 30, sway = Math.sin(ph * .7) * 20;
    paint([[bx - 34, y], [bx - 16 + sway * .3, y - hgt * .5], [bx + sway, y - hgt], [bx + 16 + sway * .3, y - hgt * .5], [bx + 34, y]], { wash: i % 2 ? LK.fire : LK.fireDk, ink: null, curv: .6 });
  }
  for (let i = 0; i < 4; i++) { const ph = t * 7 + i * 2, hgt = (70 + 30 * Math.sin(ph)) * (1 + flare); paint([[x - 50 + i * 33, y], [x - 38 + i * 33 + Math.sin(ph) * 8, y - hgt], [x - 26 + i * 33, y]], { wash: LK.fireLt, ink: null, curv: .6 }); }
  boilSeed('pit');
  paint([[x - 170, y - 10], [x + 170, y - 10], [x + 150, y + 80], [x - 150, y + 80]], { wash: LK.brick, fill: LK.brickDk, fillOp: 60, tex: .5, ink: LK.ink, sw: 1.2 });
  for (let r = 0; r < 2; r++) for (let c = 0; c < 6; c++) inkLine([[x - 150 + c * 58 + (r % 2) * 29, y + 10 + r * 34], [x - 150 + c * 58 + (r % 2) * 29, y + 40 + r * 34]], 1.5, LK.brickDk, 'inkfine', 0);
  inkLine([[x - 165, y + 26], [x + 160, y + 26]], 1.5, LK.brickDk, 'inkfine', 0);
}
// Brahma on a lotus: four heads (three seen), white beards, four arms (a book, a kamandalu, a mala, blessing);
// (x, y) the base of the lotus, s the size (about 1 = 300 px tall); o: glow 0..1, eyes, mouth, brows, look
function brahma(x, y, s, o = {}) {
  const u = 30 * s, P = pts => pts.map(([a, b]) => [x + a * u, y + b * u]), INK = LK.ink, sw = clamp(u / 25, .5, 1.6);
  glow(x, y - 5 * u, 7 * u, '#FFE08A', .8 * (o.glow ?? 1));
  boilSeed('brlotus');
  for (let i = 0; i < 7; i++) { const a = lerp(-2.6, -.54, i / 6), L = 2.6 + .4 * (i % 2); paint(P([[0, -.2], [Math.cos(a - .25) * L * .6, Math.sin(a - .25) * L * .5 - .2], [Math.cos(a) * L, Math.sin(a) * L * .55 - .2], [Math.cos(a + .25) * L * .6, Math.sin(a + .25) * L * .5 - .2]]), { wash: i % 2 ? LK.lotus : '#F8C4D0', ink: INK, sw: sw * .6, curv: .5 }); }
  paint(P([[-3.2, -.4], [3.2, -.4], [2.6, .3], [-2.6, .3]]), { wash: LK.lotusDk, ink: INK, sw: sw * .6, curv: .5 });
  boilSeed('brbody');
  // the back arms: mala (left), kamandalu (right)
  for (const sd of [-1, 1]) {
    paint(P(ribbon([[sd * 1.3, -5.6], [sd * 2.6, -6.6], [sd * 3.0, -7.8]], .55, .45)), { wash: LK.brahma, ink: INK, sw: sw * .6 });
  }
  paint(ellPts(x - 3.0 * u, y - 7.9 * u, .38 * u, .34 * u, 10), { wash: LK.brahma, ink: INK, sw: sw * .5 });
  paint(ellPts(x + 3.0 * u, y - 7.9 * u, .38 * u, .34 * u, 10), { wash: LK.brahma, ink: INK, sw: sw * .5 });
  { const m = []; for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; m.push([x + (-3.0 + Math.cos(a) * .6) * u, y + (-7.3 + Math.sin(a) * .6) * u]); } for (const p of m) paint(ellPts(p[0], p[1], .12 * u, .12 * u, 6), { wash: '#8A4E2E', ink: null }); }
  paint(P([[2.7, -8.2], [3.4, -8.2], [3.6, -9.0], [3.3, -9.5], [2.9, -9.5], [2.6, -9.0]]), { wash: LK.thali, ink: INK, sw: sw * .5, curv: .4 });
  // seated body: robe, lap
  paint(P([[-2.6, -.4], [-2.9, -1.4], [-1.6, -2.0], [0, -1.8], [1.6, -2.0], [2.9, -1.4], [2.6, -.4]]), { wash: LK.robe, fill: LK.robeDk, fillOp: 50, ink: INK, sw: sw * .7, curv: .4 });
  paint(P([[-1.5, -6.0], [1.5, -6.0], [1.9, -4.2], [1.7, -1.8], [-1.7, -1.8], [-1.9, -4.2]]), { wash: LK.brahma, fill: LK.brahmaDk, fillOp: 40, ink: INK, sw: sw * .7, curv: .4 });
  paint(P(ribbon([[-1.5, -5.7], [0, -4.0], [1.6, -2.4]], .7, .7)), { wash: LK.robe, ink: INK, sw: sw * .5 });
  // the front arms: a book (left), blessing (right)
  paint(P(ribbon([[-1.5, -5.4], [-2.3, -4.0], [-1.4, -3.0]], .6, .5)), { wash: LK.brahma, ink: INK, sw: sw * .6 });
  paint(P([[-2.2, -3.4], [-.6, -3.4], [-.6, -2.4], [-2.2, -2.4]]), { wash: '#B5643E', ink: INK, sw: sw * .6 });
  inkLine(P([[-1.4, -3.4], [-1.4, -2.4]]), sw * .6, INK, 'inkfine', 0);
  const bl = o.bless ?? 0;
  paint(P(ribbon([[1.5, -5.4], [2.4, -4.6], [2.2, -5.6 - bl * .4]], .6, .5)), { wash: LK.brahma, ink: INK, sw: sw * .6 });
  paint(P([[1.85, -5.5 - bl * .4], [2.55, -5.5 - bl * .4], [2.6, -6.4 - bl * .4], [1.8, -6.4 - bl * .4]]), { wash: LK.brahma, ink: INK, sw: sw * .5, curv: .5 });
  if (bl > .05) glow(x + 2.2 * u, y - 6 * u, 1.6 * u * bl, '#FFF0B0', .9 * bl);
  // the heads: two side faces in profile behind, the front face
  boilSeed('brheads');
  const face = (cx, cy, sc, side) => {
    const Q = pts => pts.map(([a, b]) => [x + (cx + a * sc * (side || 1)) * u, y + (cy + b * sc) * u]);
    paint(Q([[-.9, -.2], [-.85, -.9], [0, -1.15], [.85, -.9], [.9, -.2], [.6, .5], [0, .65], [-.6, .5]]), { wash: LK.brahma, ink: INK, sw: sw * .6, curv: .5 });
    paint(Q([[-.85, .0], [-.3, .25], [0, .2], [.3, .25], [.85, .0], [.6, .9], [0, 1.4], [-.6, .9]]), { wash: LK.beard, ink: INK, sw: sw * .5, curv: .5 });
    paint(Q([[-.75, -.8], [-.6, -1.6], [-.3, -1.35], [0, -1.9], [.3, -1.35], [.6, -1.6], [.75, -.8]]), { wash: LK.arch, fill: LK.archDk, fillOp: 50, ink: INK, sw: sw * .5, curv: .1 });
    const ek = o.eyes || 'closed', lx = (o.lookX || 0) * .08;
    for (const e of side ? [.3] : [-.32, .32]) {
      const ex = cx + e * sc * (side || 1), ey = cy - .25 * sc;
      if (ek === 'closed') inkLine([[x + (ex - .14 * sc) * u, y + ey * u], [x + ex * u, y + (ey + .08 * sc) * u], [x + (ex + .14 * sc) * u, y + ey * u]], sw, INK, 'ink', .5);
      else { paint(ellPts(x + ex * u, y + ey * u, .14 * sc * u, .16 * sc * u, 10), { wash: '#FFF8EC', ink: INK, sw: sw * .4 }); paint(ellPts(x + (ex + lx) * u, y + ey * u, .07 * sc * u, .09 * sc * u, 8), { wash: INK, ink: null }); }
      inkLine([[x + (ex - .16 * sc) * u, y + (ey - .22 * sc - (o.brows || 0) * .1) * u], [x + (ex + .16 * sc) * u, y + (ey - .25 * sc - (o.brows || 0) * .12) * u]], sw * 1.1, '#E8E0D0', 'ink', 0);
    }
    inkLine(Q([[-.2, .3], [0, .38], [.2, .3]]), sw * .8, INK, 'ink', .5);
  };
  face(-1.15, -6.9, .78, -1); face(1.15, -6.9, .78, 1); face(0, -7.2, 1, 0);
}

// ---------- the sunrise, Rama ----------
function sunriseSet(t) {
  boilSeed('dawn');
  paint(rectPts(-400, -400, W + 800, H + 800), { wash: LK.dawnTop, ink: null });
  paint(rectPts(-400, 800, W + 800, 600), { fill: LK.dawnLow, fillOp: 220, bleed: .25, tex: .3, ink: null });
  glow(540, 1180, 520, '#FFE08A', .8);
  boilSeed('dawnsun');
  paint(ellPts(540, 1180, 230, 230, 40), { wash: '#FFE6A0', ink: null });
  boilSeed('dawnhill');
  paint([[-400, 1240], [100, 1200], [400, 1225], [540, 1250], [700, 1225], [1000, 1195], [1480, 1240], [1480, H + 400], [-400, H + 400]], { wash: LK.hill, fill: LK.hillDk, fillOp: 70, tex: .5, ink: null, curv: .5 });
  paint([[-400, 1380], [300, 1330], [540, 1310], [800, 1330], [1480, 1380], [1480, H + 400], [-400, H + 400]], { wash: LK.hillDk, ink: null, curv: .5 });
}
// Rama as a silhouette against the sun: (x, y) the ground under him, s the height in px; o.rim 0..1, o.glint 0..1
function rama(x, y, s, o = {}) {
  const u = s / 10, P = pts => pts.map(([a, b]) => [x + a * u, y + b * u]), C = LK.ramaSil;
  boilSeed('rama');
  // legs, dhoti, torso, arms, head with the mukut; the bow in his left hand (screen left), the quiver on his back
  paint(P([[-.9, 0], [-.55, -3.2], [.55, -3.2], [.9, 0], [.4, 0], [0, -2.4], [-.4, 0]]), { wash: C, ink: null });
  paint(P([[-1.1, -3.0], [-.8, -4.4], [.8, -4.4], [1.1, -3.0]]), { wash: C, ink: null });
  paint(P([[-1.0, -4.3], [-1.15, -6.2], [-.7, -6.8], [.7, -6.8], [1.15, -6.2], [1.0, -4.3]]), { wash: C, ink: null, curv: .3 });
  paint(P([[.9, -6.6], [1.7, -7.6], [2.0, -7.4], [1.2, -6.2]]), { wash: C, ink: null });   // the quiver
  for (let i = 0; i < 3; i++) inkLine(P([[1.6 + i * .12, -7.5], [1.75 + i * .12, -8.2]]), 2, C, 'ink', 0);
  paint(P(ribbon([[-1.0, -6.5], [-1.9, -5.2], [-2.3, -4.5]], .45, .35)), { wash: C, ink: null });
  paint(P(ribbon([[1.0, -6.5], [1.5, -5.4], [1.2, -4.4]], .45, .35)), { wash: C, ink: null });
  paint(ellPts(x, y - 7.6 * u, .85 * u, .95 * u, 18), { wash: C, ink: null });
  paint(P([[-.62, -8.2], [-.5, -9.6], [-.25, -10.3], [0, -10.9], [.25, -10.3], [.5, -9.6], [.62, -8.2]]), { wash: C, ink: null, curv: .3 });
  const bow = []; for (let i = 0; i <= 14; i++) { const a = lerp(-1.2, 1.2, i / 14); bow.push([x + (-2.6 - Math.cos(a) * .9) * u, y + (-4.6 + Math.sin(a) * 3.6) * u]); }
  paint(ribbon(bow, u * .16, u * .16), { wash: C, ink: null });
  inkLine([bow[0], bow[bow.length - 1]], 1.4, C, 'inkfine', 0);
  if (o.rim) { boilSeed('ramarim'); inkLine(P([[-1.15, -6.2], [-.7, -6.8], [-.3, -7.0]]), 3 * o.rim, LK.ramaRim, 'ink', .5); inkLine(bow.slice(0, 8), 2.5 * o.rim, LK.ramaRim, 'ink', .5); }
  if (o.glint) twinkle(bow[0][0], bow[0][1], o.glintAge ?? .3, 34 * o.glint, 'ramaglint');
}
function grassBlade(x, y, s, rot = 0) {
  push(); translate(x, y); rotate(rot);
  paint([[-s * .08, s * .5], [s * .06, -s * .1], [s * .02, -s * .5], [s * .1, s * .5]], { wash: '#7CC05A', ink: LK.ink, sw: .8, curv: .5 });
  pop();
}

// ---------- Dussehra night ----------
function dussehraSet(t, o = {}) {
  boilSeed('dsky');
  paint(rectPts(-400, -400, W + 800, H + 800), { wash: LK.night, ink: null });
  paint(rectPts(-400, 700, W + 800, 700), { fill: LK.nightMid, fillOp: 200, bleed: .25, tex: .3, ink: null });
  paint(rectPts(-400, 1150, W + 800, 400), { fill: LK.nightLow, fillOp: 200, bleed: .25, tex: .3, ink: null });
  boilSeed('dstars');
  for (let i = 0; i < 40; i++) { const tw = .55 + .45 * Math.sin(t * 2.6 + i * 1.7); paint(starPts(hash(i * 1.3) * W, 300 + hash(i * 2.9) * 800, (3 + 6 * hash(i * 4)) * tw, .35, 4), { wash: '#FFF1C8', ink: null }); }
  boilSeed('dfield');
  paint(rectPts(-400, 1440, W + 800, 900), { wash: LK.field, ink: null });
  // string lights across the top
  boilSeed('dlights');
  for (const [y0, sag] of [[470, 80], [520, 60]]) {
    const P = []; for (let i = 0; i <= 20; i++) { const x = -40 + i * 58; P.push([x, y0 + sag * Math.sin(i / 20 * Math.PI)]); }
    inkLine(P, 1.5, '#5A5070', 'inkfine', .5);
    P.forEach(([x, y], i) => { const on = .6 + .4 * Math.sin(t * 4 + i * 1.3); glow(x, y + 8, 18, LK.spark[i % 5], .5 * on); paint(ellPts(x, y + 8, 6, 7, 8), { wash: LK.spark[i % 5], ink: null }); });
  }
}
// the bamboo frame behind the effigy: (x, y) his ground point, u his unit
function bamboo(x, y, u) {
  boilSeed('bamboo');
  const pole = (x0, y0, x1, y1) => { inkLine([[x0, y0], [x1, y1]], u * .5, '#C9A25A', 'ink', 0); const n = 6; for (let i = 1; i < n; i++) { const k = i / n; inkLine([[lerp(x0, x1, k) - u * .25, lerp(y0, y1, k)], [lerp(x0, x1, k) + u * .25, lerp(y0, y1, k)]], 1.4, '#8A6A2E', 'inkfine', 0); } };
  pole(x - 5 * u, y + u, x - 5 * u, y - 23 * u); pole(x + 5 * u, y + u, x + 5 * u, y - 23 * u);
  pole(x - 15 * u, y - 18.5 * u, x + 18 * u, y - 18.5 * u);
}
function crowd(t, cheer = 0) {
  boilSeed('dcrowd');
  for (const [row, y0, col, n] of [[0, 1560, LK.crowdB, 9], [1, 1660, LK.crowdA, 8]]) {
    for (let i = 0; i < n; i++) {
      const x = (i + .5) * (W / n) + (row ? 40 : 0) + (hash(i + row * 9) - .5) * 30, hop = cheer * Math.abs(Math.sin(t * 7 + i * 1.7)) * 16, y = y0 - hop, r = 44 + 10 * hash(i * 3);
      paint(ellPts(x, y - r * 1.9, r * .55, r * .62, 14), { wash: col, ink: null });
      paint([[x - r * .95, y + 200], [x - r * .85, y - r * 1.1], [x, y - r * 1.4], [x + r * .85, y - r * 1.1], [x + r * .95, y + 200]], { wash: col, ink: null, curv: .4 });
      if (cheer > .1 && (i + row) % 2 === 0) for (const sd of [-1, 1]) paint(ribbon([[x + sd * r * .7, y - r * 1.1], [x + sd * r * 1.0, y - r * 1.9 - hop], [x + sd * r * 1.1, y - r * 2.5 - hop]], 18, 14), { wash: col, ink: null });
    }
  }
}
function firework(x, y, age, s, col, key = 'fw') {
  if (age < 0 || age > 1.4) return;
  boilSeed(key);
  if (age < .35) { const k = age / .35; paint(ellPts(x, lerp(y + 700, y, easeOut(k)), 6, 10, 8), { wash: '#FFF4DC', ink: null }); glow(x, lerp(y + 700, y, easeOut(k)), 30, col, .6); return; }
  const k = (age - .35) / 1.05;
  glow(x, y, s * (1.2 + k), col, .8 * (1 - k));
  for (let i = 0; i < 16; i++) { const a = i / 16 * TAU + hash(i) * .2, d = s * easeOut(k) * (.8 + .3 * hash(i * 3)), dr = d + 60 * k * k; paint(ribbon([[x + Math.cos(a) * d * .7, y + Math.sin(a) * d * .7 + 40 * k * k], [x + Math.cos(a) * dr, y + Math.sin(a) * dr + 60 * k * k]], 1, 7 * (1 - k)), { wash: i % 3 ? col : '#FFF4DC', washOp: 255 * (1 - k * .6), ink: null }); }
}
function fountain(x, y, t, k, key = 'fount') {
  if (k <= .02) return;
  glow(x, y - 120 * k, 160 * k, '#FFC766', .9 * k);
  boilSeed(key + Math.floor(t * 12));
  for (let i = 0; i < 26; i++) { const ph = frac(hash(i * 1.7) + t * 1.6), a = -Math.PI / 2 + (hash(i * 3.1) - .5) * .9, v = 380 * k * (.7 + .4 * hash(i)); const px = x + Math.cos(a) * v * ph, py = y + Math.sin(a) * v * ph + 300 * ph * ph; paint(starPts(px, py, 6 * (1 - ph) + 2, .4, 4), { wash: i % 2 ? '#FFE39A' : '#FFF4DC', ink: null }); }
}
// a word tag (a cream pill, ink letters) over a head, world px; o: lead [x, y] (a little line down to the head)
function tagPill(txt, x, y, age, o = {}) {
  if (age < 0) return;
  const size = o.size ?? 26, k = backOut(clamp(age * 5)), w = txt.length * size * .66 + size * 1.0, h = size * 1.55;
  boilSeed('tag ' + txt);
  if (o.lead) inkLine([[x, y + h / 2], o.lead], 2, LK.tag, 'inkfine', 0);
  push(); translate(x, y); scale(k); rotate(o.rot ?? 0);
  paint(rrPts(-w / 2, -h / 2, w, h, h / 2), { wash: o.col || LK.tag, ink: LK.ink, sw: 1 });
  pop();
  letter(txt, x, y + size * .05, size * k, o.ink || '#B8322A', { font: `700 ${size * k}px Poppins`, ink: false, rot: o.rot ?? 0 });
}

// ---------- the card ----------
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
