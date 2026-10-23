// rp2_props.js: sets and props for rp2.js (Ramayan Part 2, "The Two Boons"). Loaded after src/ramayan_sets.js (P1, tree,
// court, chamber, throne, notes, tears, arrowAt). Pure functions of their arguments (and T for boil).
//   P2                                   the palette
//   ayodhyaNight, terrace, queenRoom, warField, angerRoom    sets
//   necklace, boonLight, petals, miniCrown                   props
const P2 = {
  ink: '#2B2233', cream: '#FFF5E2', gold: '#F5C542',
  nightHi: '#1C2252', nightLo: '#3E3A7A', city: '#E8B868', cityDk: '#B88A3E', cityN: '#5A4A7A', lamp: '#FFC870', flag: '#E8742A',
  rose: '#E8A0A8', roseDk: '#C2707E', roseLt: '#F8CCD0', silk: '#F2D27A', carpet: '#9E2A44', carpetDk: '#6E1A30', arch: '#F6E2C8',
  sepia: '#C8A47A', sepiaDk: '#8E6E48', sepiaLt: '#E8D2B0', dust: '#D8BC94',
  dawnHi: '#F6B88A', dawnLo: '#FFE6C0',
};
const sep = (c, k) => k > 0 ? mixCol(c, mixCol(P2.sepia, c, .2), k) : c;

// Ayodhya at night, lit for the crowning: towers and domes with lamps in every window, flags, lamps along the walls
function ayodhyaNight(t, key = 'an') {
  boilSeed(key + 'sky');
  paint(rectPts(-500, -500, W + 1000, 2000), { wash: P2.nightHi, ink: null });
  paint(ellPts(540, 1250, 1200, 600, 26), { fill: P2.nightLo, fillOp: 220, bleed: .3, tex: .4, ink: null });
  boilSeed(key + 'stars');
  for (let i = 0; i < 24; i++) paint(starPts(-200 + hash(i * 2.3) * 1500, 200 + hash(i * 6.7) * 700, 3 + 4 * hash(i * 3.3) * (.6 + .4 * Math.sin(t * 2 + i)), .4, 4), { wash: '#FFF6DA', ink: null });
  glow(860, 420, 160, '#FFF4D2', .4); paint(ellPts(860, 420, 54, 54, 18), { wash: '#FFF4D2', ink: null });
  boilSeed(key + 'city');
  const base = 1420;
  for (let i = 0; i < 9; i++) {
    const x = -120 + i * 160 + 30 * hash(i * 1.3), h = 220 + 300 * hash(i * 4.7), w = 110 + 40 * hash(i * 2.1);
    paint([[x - w / 2, base], [x - w / 2, base - h], [x - w * .3, base - h - 40], [x, base - h - 90], [x + w * .3, base - h - 40], [x + w / 2, base - h], [x + w / 2, base]], { wash: P2.cityN, fill: '#463A66', fillOp: 50, tex: .4, ink: P2.ink, sw: .8, curv: .2 });
    inkLine([[x, base - h - 90], [x, base - h - 150]], 1.4, P2.ink, 'inkfine', 0);
    paint([[x, base - h - 150], [x + 46 + Math.sin(t * 3 + i) * 6, base - h - 138], [x, base - h - 124]], { wash: P2.flag, ink: P2.ink, sw: .6, curv: .3 });
    for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) { const wx = x - w * .22 + c * w * .44, wy = base - h * (.25 + r * .25); glow(wx, wy, 40, P2.lamp, .35 + .1 * Math.sin(t * 5 + i + r)); paint(rrPts(wx - 9, wy - 14, 18, 28, 8), { wash: '#FFD890', ink: null }); }
  }
  boilSeed(key + 'wall');
  paint([[-500, base - 20], [W + 500, base - 20], [W + 500, 2400], [-500, 2400]], { wash: '#2E2850', ink: P2.ink, sw: .9 });
  for (let i = 0; i < 16; i++) { const lx = -60 + i * 80, f = .8 + .2 * Math.sin(t * 11 + i * 2.7); glow(lx, base - 34, 46 * f, P2.lamp, .5); paint([[lx, base - 50 - 6 * f], [lx + 6, base - 36], [lx, base - 32], [lx - 6, base - 36]], { wash: '#FFE0A0', ink: null, curv: .6 }); }
}
// a palace terrace railing in the foreground (Manthara watches from here)
function terrace(x, y, w, key = 'te') {
  boilSeed(key);
  paint(rectPts(x - w / 2, y, w, 40), { wash: '#C8A06A', fill: '#9E7848', fillOp: 50, tex: .4, ink: P2.ink, sw: 1 });
  for (let i = 0; i <= 8; i++) { const bx = x - w / 2 + 30 + i * (w - 60) / 8; paint(rrPts(bx - 14, y + 40, 28, 170, 10), { wash: '#B8905A', ink: P2.ink, sw: .8 }); }
  paint(rectPts(x - w / 2, y + 210, w, 600), { wash: '#A07848', ink: P2.ink, sw: 1 });
}
// Kaikeyi's chamber: rose walls, arched windows on the lit city, a carpet; mood 0 warm evening .. 1 dark
function queenRoom(t, key = 'qr', dark = 0) {
  const D = c => mixCol(c, '#2A2040', dark);
  boilSeed(key + 'wall');
  paint(rectPts(-500, -500, W + 1000, 2200), { wash: D(P2.rose), ink: null });
  paint(ellPts(540, 1050, 800, 700, 26), { fill: D(P2.roseLt), fillOp: 140, bleed: .3, tex: .4, ink: null });
  boilSeed(key + 'arches');
  for (const ax of [200, 880]) {
    paint([[ax - 130, 1300], [ax - 130, 720], [ax - 90, 600], [ax, 540], [ax + 90, 600], [ax + 130, 720], [ax + 130, 1300]], { wash: D(P2.nightHi), ink: P2.ink, sw: 1.2, curv: .35 });
    for (let i = 0; i < 4; i++) { const lx = ax - 80 + i * 55; glow(lx, 1180 - i * 20, 30, P2.lamp, .4 * (1 - dark)); paint(ellPts(lx, 1180 - i * 20, 7, 10, 8), { wash: '#FFD890', ink: null }); }
    inkLine([[ax - 130, 720], [ax - 90, 600], [ax, 540], [ax + 90, 600], [ax + 130, 720]], 6, D(P2.silk), 'ink', .35);
  }
  boilSeed(key + 'drape');
  for (const s of [-1, 1]) paint([[540 + s * 640, 300], [540 + s * 320, 300], [540 + s * 380, 560], [540 + s * 540, 700], [540 + s * 660, 720]], { wash: D(P2.silk), fill: D('#C8A040'), fillOp: 50, tex: .4, ink: P2.ink, sw: .9, curv: .5 });
  boilSeed(key + 'floor');
  paint([[-500, 1520], [W + 500, 1520], [W + 500, 2400], [-500, 2400]], { wash: D('#C8946A'), ink: P2.ink, sw: .9 });
  paint(ellPts(540, 1780, 620, 170, 24), { wash: D(P2.carpet), fill: D(P2.carpetDk), fillOp: 50, tex: .5, ink: P2.ink, sw: 1 });
  inkLine(ellPts(540, 1780, 560, 140, 24), 2.4, D(P2.silk), 'ink', .5);
}
// the war (sepia): a dusty sky, a burning horizon, arrows raining
function warField(t, key = 'wf') {
  boilSeed(key + 'sky');
  paint(rectPts(-500, -500, W + 1000, 2200), { wash: sep('#E2865A', .8), ink: null });
  paint(ellPts(540, 1150, 1100, 500, 26), { fill: sep('#F7C98E', .8), fillOp: 220, bleed: .3, tex: .4, ink: null });
  boilSeed(key + 'smoke');
  for (let i = 0; i < 6; i++) { const x = -100 + i * 230, y = 1150 - 80 * hash(i); paint(ellPts(x + Math.sin(t * .5 + i) * 20, y, 180, 90, 16, 4), { wash: P2.sepiaDk, washOp: 120, ink: null }); }
  boilSeed(key + 'ground');
  paint([[-500, 1360], [300, 1330], [800, 1370], [W + 500, 1340], [W + 500, 2400], [-500, 2400]], { wash: sep('#C9A06E', .8), fill: P2.sepiaDk, fillOp: 50, tex: .5, ink: P2.ink, sw: .9, curv: .5 });
  boilSeed(key + 'rain');
  for (let i = 0; i < 9; i++) { const k = frac(hash(i * 3.3) + t * .9), x = 1300 - k * 1500 + hash(i * 7.1) * 300, y = 300 + k * 900 + hash(i * 5.5) * 300; arrowAt(x, y, Math.PI * .75, 90, key + 'ar' + i); }
}
// the room of anger: dark, bare, one lamp; lit 0..1 (Dasharatha's lamp), dawn 0..1 (morning through the window)
function angerRoom(t, key = 'ar', o = {}) {
  const dawn = o.dawn || 0;
  boilSeed(key + 'wall');
  paint(rectPts(-500, -500, W + 1000, 2200), { wash: mixCol('#231C3A', '#B88A7A', dawn), ink: null });
  paint(ellPts(540, 1250, 800, 650, 26), { fill: mixCol('#3A2E58', '#F0C8A0', dawn), fillOp: 200, bleed: .3, tex: .4, ink: null });
  boilSeed(key + 'win');
  const wx = 820;
  paint([[wx - 120, 1150], [wx - 120, 720], [wx, 620], [wx + 120, 720], [wx + 120, 1150]], { wash: mixCol(P2.nightHi, P2.dawnHi, dawn), ink: P2.ink, sw: 1.2, curv: .3 });
  if (dawn > 0) glow(wx, 900, 380 * dawn, '#FFD8A0', .6 * dawn);
  else { boilSeed(key + 'wstars'); const sh = (o.night || 0) * 120; for (let i = 0; i < 6; i++) paint(starPts(wx - 90 + hash(i * 2.1) * 180, 700 + ((hash(i * 4.3) * 400 + sh) % 420), 4, .4, 4), { wash: '#FFF6DA', ink: null }); }
  boilSeed(key + 'floor');
  paint([[-500, 1540], [W + 500, 1540], [W + 500, 2400], [-500, 2400]], { wash: mixCol('#2E2448', '#C8946A', dawn), ink: P2.ink, sw: .9 });
  if (dawn > 0) paint([[wx - 120, 1540], [wx + 120, 1540], [wx + 300, 2000], [wx - 260, 2000]], { wash: '#FFE2B0', washOp: 90 * dawn, ink: null });
}

// ---------- props ----------
// a gold necklace with a red pendant, centred on (x, y), s wide (rot radians)
function necklace(x, y, s, rot = 0, key = 'nk') {
  boilSeed(key);
  push(); translate(x, y); rotate(rot);
  const P = through([[-s * .5, -s * .3], [-s * .35, s * .05], [0, s * .22], [s * .35, s * .05], [s * .5, -s * .3]]);
  P.forEach((p, i) => { if (i % 2 === 0) paint(ellPts(p[0], p[1], s * .045, s * .045, 8), { wash: P2.gold, ink: P2.ink, sw: .5 }); });
  paint([[0, s * .2], [s * .1, s * .32], [0, s * .48], [-s * .1, s * .32]], { wash: '#D2283A', ink: P2.ink, sw: .7, curv: .3 });
  pop();
}
// a boon: a small golden sun-ball with rays (k 0..1 its pop)
function boonLight(x, y, r, k = 1, key = 'bl') {
  if (k <= .01) return;
  glow(x, y, r * 3 * k, '#FFD870', .6 * k);
  boilSeed(key);
  for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + T * .8; inkLine([[x + Math.cos(a) * r * 1.3 * k, y + Math.sin(a) * r * 1.3 * k], [x + Math.cos(a) * r * 1.8 * k, y + Math.sin(a) * r * 1.8 * k]], 2, P2.gold, 'ink', 0); }
  paint(ellPts(x, y, r * k, r * k, 16), { wash: '#FFE6A0', ink: P2.ink, sw: .8 });
}
// marigold petals falling over the court
function petals(t, key = 'pt', n = 12) {
  boilSeed(key);
  for (let i = 0; i < n; i++) {
    const x = 60 + hash(i * 3.3) * 960 + 30 * Math.sin(t * .9 + i), y = frac(hash(i * 7.1) + t * (.05 + .03 * hash(i))) * 2100 - 100, r = t * .8 + i;
    paint([[x + Math.cos(r) * 14, y + Math.sin(r) * 14], [x + Math.cos(r + 1.6) * 7, y + Math.sin(r + 1.6) * 7], [x - Math.cos(r) * 14, y - Math.sin(r) * 14], [x + Math.cos(r - 1.6) * 7, y + Math.sin(r - 1.6) * 7]], { wash: i % 2 ? '#F39A2E' : '#FFD45A', washOp: 230, ink: null, curv: .5 });
  }
}
// a little gold crown icon (Bharat's), centred on (x, y), s wide
function miniCrown(x, y, s, key = 'mc') {
  boilSeed(key);
  paint([[x - s * .5, y + s * .3], [x - s * .5, y - s * .1], [x - s * .25, y + s * .08], [x, y - s * .35], [x + s * .25, y + s * .08], [x + s * .5, y - s * .1], [x + s * .5, y + s * .3]], { wash: P2.gold, fill: '#B88A1C', fillOp: 50, ink: P2.ink, sw: 1 });
  paint(ellPts(x, y + s * .14, s * .08, s * .08, 8), { wash: '#D2283A', ink: null });
}
