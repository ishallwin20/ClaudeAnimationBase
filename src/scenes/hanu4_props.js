// hanu4_props.js: sets and props for hanu4.js (ad 89, Hanuman Part 4, "The night HANUMAN almost GAVE UP"). Loaded
// after src/hanuman_series.js and src/ramayan_sets.js (P1, warmBack, tree, bush, notes, tears). Pure functions of their
// arguments (and T for boil). Sets stay inside x -300..1380. The palace, the couch, the queen and the Ashoka grove are
// Ramayan Part 9's (ad 44, rp9_props.js), copied here so this branch stands alone.
//   H4                                             the palette
//   h4Wall, h4Palace, h4Lane, h4Grove, h4Home      sets: Lanka's wall at night over the sea (the hook and the despair),
//                                                  Ravana's palace, a lane of houses, the Ashoka grove, the hill at home
//   h4Couch, h4Queen, h4Bed, h4Well, h4Pot, h4Trap, h4Tile, h4Bubble    props
const H4 = {
  ink: '#2B2233', cream: '#FFF5E2', gold: '#F5C542',
  night: '#141C44', nightLo: '#33366E', moon: '#FFF4D2', sea: '#22305E', seaLt: '#5A6EA8',
  wall: '#B8904A', wallDk: '#6A4A3A', wallLt: '#D8B470', city: '#C89A4A', cityDk: '#6A4A3A', win: '#FFE9A0',
  hall: '#3A1E3A', hallLo: '#6A2E4A', pillar: '#E8B84A', pillarDk: '#B8862E', couch: '#B8304A', couchDk: '#86203A',
  lane: '#8A6A54', laneDk: '#5A4234', house: '#C8A060', houseDk: '#8A6A3A', roof: '#7A2E3A', roofDk: '#521E28', door: '#1A1022',
  grove: '#0E1830', groveLo: '#2A2A58', ashoka: '#E2453A', ashokaDk: '#A82E2A',
  homeHi: '#F6B98A', homeLo: '#FFE6B8', hill: '#A8B87A', hillDk: '#7E9460', grass: '#9CBC6A', grassDk: '#78984E',
};
const MANDO_PAL = { saree: '#E8A23A', sareeDk: '#B8761E', sareeLt: '#FFCF7A' };

// ---------- sets ----------
// the night sky with a moon (mx, my) and stars
function h4Sky(t, key, mx = 820, my = 760) {
  boilSeed(key + 'sky');
  paint(rectPts(-300, -600, W + 600, 3200), { wash: H4.night, ink: null });
  paint(ellPts(540, 1300, 1000, 700, 26), { fill: H4.nightLo, fillOp: 210, bleed: .3, tex: .4, ink: null });
  glow(mx, my, 260, H4.moon, .4); paint(ellPts(mx, my, 70, 70, 24), { wash: H4.moon, ink: null });
  paint(ellPts(mx - 22, my - 14, 16, 12, 10), { wash: '#E6D8A8', washOp: 150, ink: null });
  boilSeed(key + 'st');
  for (let i = 0; i < 16; i++) { const x = -40 + hash(i * 2.3) * 1120, y = 640 + hash(i * 6.7) * 640, s = 4 + 7 * hash(i * 3.3) * (.5 + .5 * Math.sin(t * 2.4 + i * 1.7)); paint(starPts(x, y, s, .32, 4), { wash: '#FFFFFF', washOp: 210, ink: null }); }
}
// on Lanka's wall at night: the sea far off, the lit city below, the wall's crenellated top (the ground runs y 1640)
function h4Wall(t, key = 'wl') {
  h4Sky(t, key);
  boilSeed(key + 'sea');
  paint(rectPts(-300, 1300, W + 600, 300), { wash: H4.sea, ink: null });
  for (let i = 0; i < 7; i++) { const y = 1320 + i * 22, w = 60 + i * 26; inkLine([[820 - w / 2 + 14 * Math.sin(t + i), y], [820 + w / 2 + 14 * Math.sin(t + i), y]], 1.6, H4.moon, 'inkfine', 0); }
  boilSeed(key + 'city');
  glow(540, 1520, 520, '#FFB050', .25);
  for (let i = 0; i < 8; i++) {
    const x = -40 + i * 160, h = 120 + 120 * hash(i * 4.7), y = 1600;
    paint([[x - 44, y], [x - 44, y - h], [x, y - h - 70], [x + 44, y - h], [x + 44, y]], { wash: i % 2 ? H4.city : mixCol(H4.city, H4.cityDk, .4), fill: H4.cityDk, fillOp: 50, tex: .3, ink: H4.ink, sw: .7, curv: .1 });
    for (let j = 0; j < 2; j++) paint(rectPts(x - 9, y - h * (.3 + j * .35), 18, 24), { wash: H4.win, washOp: 230, ink: null });
  }
  h4WallTop(key);
}
function h4WallTop(key = 'wl') {
  boilSeed(key + 'top');
  for (let i = 0; i < 9; i++) paint(rectPts(-260 + i * 190, 1586, 110, 64), { wash: H4.wall, fill: H4.wallDk, fillOp: 40, tex: .4, ink: H4.ink, sw: 1 });
  paint(rectPts(-300, 1640, W + 600, 900), { wash: H4.wall, fill: H4.wallDk, fillOp: 70, tex: .5, ink: H4.ink, sw: 1.1 });
  for (let i = 0; i < 6; i++) { const y = 1720 + i * 70; inkLine([[-300, y], [1380, y]], .9, H4.wallDk, 'inkfine', 0); for (let j = 0; j < 8; j++) { const x = -260 + j * 200 + (i % 2) * 100; inkLine([[x, y], [x, y + 70]], .9, H4.wallDk, 'inkfine', 0); } }
}
// Ravana's palace at night (rp9): a dark plum room with gold pillars (x 70 and 1010) and two oil lamps; floor y 1660
function h4Palace(t, key = 'pl') {
  boilSeed(key);
  paint(rectPts(-600, -600, W + 1200, 3200), { wash: H4.hall, ink: null });
  paint(ellPts(540, 1250, 720, 640, 26), { fill: H4.hallLo, fillOp: 200, bleed: .3, tex: .4, ink: null });
  glow(560, 1350, 460, '#FFB050', .3);
  for (const x of [70, 1010]) { paint(rectPts(x - 60, 250, 120, 1420), { wash: H4.pillar, fill: H4.pillarDk, fillOp: 50, tex: .4, ink: H4.ink, sw: 1 }); paint(rectPts(x - 80, 230, 160, 50), { wash: H4.pillarDk, ink: H4.ink, sw: .9 }); }
  boilSeed(key + 'fl');
  paint(rectPts(-600, 1660, W + 1200, 1200), { wash: '#2A142A', ink: null });
  inkLine([[-100, 1660], [1200, 1660]], .9, H4.ink, 'ink', 0);
  for (const [x, s] of [[930, 1], [-200, -1]]) { inkLine([[x, 1660], [x, 1420]], 3, H4.pillarDk, 'ink', 0); paint(ellPts(x, 1418, 30, 10, 12), { wash: H4.pillar, ink: H4.ink, sw: .7 }); const f = 1 + .12 * Math.sin(t * 9 + s); glow(x, 1395, 120, '#FFB050', .45); paint([[x - 9, 1414], [x, 1414 - 34 * f], [x + 9, 1414]], { wash: '#FFD070', ink: null, curv: .6 }); }
}
// a lane in Lanka at night: houses with doors (x 200, 540, 880; 150 × 250, the sill at y 1700); open[i] 0..1
function h4Lane(t, open = [0, 0, 0], key = 'ln') {
  h4Sky(t, key, 880, 700);
  boilSeed(key + 'h');
  for (let i = 0; i < 3; i++) {
    const x = 200 + i * 340;
    paint(rectPts(x - 160, 1260, 320, 440), { wash: i % 2 ? H4.house : mixCol(H4.house, H4.houseDk, .3), fill: H4.houseDk, fillOp: 50, tex: .5, ink: H4.ink, sw: 1.1 });
    paint([[x - 190, 1270], [x, 1120], [x + 190, 1270]], { wash: H4.roof, fill: H4.roofDk, fillOp: 50, tex: .4, ink: H4.ink, sw: 1.1, curv: .15 });
    paint(rectPts(x + 70, 1320, 50, 60), { wash: H4.win, washOp: 220, ink: H4.ink, sw: .7 });
    paint(rrPts(x - 75, 1450, 150, 250, 60), { wash: H4.door, ink: H4.ink, sw: 1 });
    const k = clamp(open[i] || 0);   // the door swings in: its leaf narrows to the left
    if (k < 1) paint(rrPts(x - 75, 1450, 150 * (1 - k * .85), 250, 60 * (1 - k)), { wash: '#7A4A2A', fill: '#4A2A18', fillOp: 50, tex: .4, ink: H4.ink, sw: 1 });
  }
  boilSeed(key + 'st');
  paint(rectPts(-300, 1700, W + 600, 900), { wash: H4.lane, fill: H4.laneDk, fillOp: 60, tex: .5, ink: H4.ink, sw: 1 });
  for (let i = 0; i < 5; i++) inkLine([[-300, 1760 + i * 60], [1380, 1760 + i * 60]], .8, H4.laneDk, 'inkfine', 0);
}
// the Ashoka grove at night (rp9): the tree's trunk at tx, th tall, red blossoms
function h4Grove(t, key = 'ag', tx = 300, th = 820) {
  boilSeed(key + 'sky');
  paint(rectPts(-600, -600, W + 1200, 2400), { wash: H4.grove, ink: null });
  paint(ellPts(540, 1150, 1000, 700, 26), { fill: H4.groveLo, fillOp: 200, bleed: .3, tex: .4, ink: null });
  glow(840, 520, 160, H4.moon, .4); paint(ellPts(840, 520, 50, 50, 18), { wash: H4.moon, ink: null });
  boilSeed(key + 'stars'); for (let i = 0; i < 14; i++) paint(starPts(-100 + hash(i * 2.3) * 1300, 300 + hash(i * 6.7) * 500, 3 + 3 * hash(i * 3.3) * (.6 + .4 * Math.sin(t * 2 + i)), .4, 4), { wash: '#FFF6DA', ink: null });
  boilSeed(key + 'ground');
  paint(rectPts(-600, 1640, W + 1200, 1100), { wash: '#1E2A3A', ink: null });
  inkLine([[-100, 1640], [500, 1630], [1200, 1645]], .9, H4.ink, 'ink', .5);
  tree(tx, 1660, th, key + 'tr', Math.sin(t * .7) * .15, ['#2E4A3A', '#1E3428', H4.ashoka]);
  boilSeed(key + 'blooms');
  for (let i = 0; i < 18; i++) { const x = tx - 330 + hash(i * 2.7) * 660, y = 1660 - th * .98 + hash(i * 4.9) * th * .4; paint(ellPts(x, y, 14, 12, 8), { wash: i % 2 ? H4.ashoka : H4.ashokaDk, ink: null }); }
}
// home: the green hill at Kishkindha, a warm evening (the ground runs y 1700)
function h4Home(t, key = 'hm') {
  boilSeed(key + 'sky');
  paint(rectPts(-300, -600, W + 600, 2400), { wash: H4.homeHi, ink: null });
  paint(ellPts(540, 1150, 1000, 640, 26), { fill: H4.homeLo, fillOp: 230, bleed: .3, tex: .4, ink: null });
  glow(540, 1150, 520, '#FFE2A0', .4);
  for (let i = 0; i < 3; i++) cloudPuff(140 + i * 400 + 16 * Math.sin(t * .4 + i), 780 + 70 * hash(i * 3.1), 100, key + 'c' + i, 225, '#FFF2DC', '#F2C8A8');
  boilSeed(key + 'hills');
  paint([[-300, 1420], [-40, 1300], [260, 1380], [600, 1260], [940, 1360], [1380, 1290], [1380, 1720], [-300, 1720]], { wash: H4.hill, fill: H4.hillDk, fillOp: 40, tex: .4, ink: null, curv: .5 });
  boilSeed(key + 'gr');
  paint(rectPts(-300, 1700, W + 600, 900), { wash: H4.grass, ink: null });
  paint(ellPts(540, 1880, 900, 220, 22), { fill: H4.grassDk, fillOp: 60, bleed: .3, tex: .5, ink: null });
  inkLine([[-100, 1702], [500, 1694], [1200, 1704]], .9, H4.ink, 'ink', .5);
  tree(-60, 1720, 700, key + 'ta', Math.sin(t * .8) * .2); tree(1120, 1720, 600, key + 'tb', Math.sin(t * .7 + 2) * .2);
  bush(960, 1716, 56, key + 'ba'); bush(120, 1716, 48, key + 'bb');
}

// ---------- props ----------
// a gold-legged red couch, its seat centred at (x, y), s wide (rp9)
function h4Couch(x, y, s, key = 'co') {
  boilSeed(key);
  for (const d of [-.42, .42]) paint(rectPts(x + d * s - s * .03, y, s * .06, s * .14), { wash: H4.pillar, ink: H4.ink, sw: .8 });
  paint(rrPts(x - s * .5, y - s * .1, s, s * .14, s * .05), { wash: H4.couch, fill: H4.couchDk, fillOp: 60, tex: .4, ink: H4.ink, sw: 1 });
  paint(rrPts(x - s * .56, y - s * .3, s * .12, s * .34, s * .05), { wash: H4.couch, ink: H4.ink, sw: 1 });
  inkLine([[x - s * .48, y - s * .02], [x + s * .48, y - s * .02]], 2, H4.pillar, 'ink', 0);
}
// Mandodari asleep on her couch (Parvati's rig, lying down; rp9's queenAsleep): the couch seat at (x, y)
function h4Queen(x, y, u, o = {}) {
  const key = o.key || 'qa';
  glow(x + u * 6, y - u * 6, u * 22, '#FFD27A', .35);
  h4Couch(x, y, u * 30, key);
  parvati(x + u * 13, y - u * 2.6, u, { boilKey: key + 'p', rot: -Math.PI / 2, eyes: 'closed', mouth: 'smile', noShadow: true, pal: MANDO_PAL, ...o });
  boilSeed(key + 'bl');
  paint(rrPts(x - u * 4, y - u * 4.4, u * 18.5, u * 4.2, u * 2), { wash: '#6A3A8A', fill: '#4A2A6A', fillOp: 50, tex: .4, ink: H4.ink, sw: 1 });
  inkLine([[x - u * 3.4, y - u * 3.2], [x + u * 13.8, y - u * 3.3]], 1.6, H4.pillar, 'ink', .2);
}
// Ravana's great gold bed behind him (he sits up on it, asleep): centred at x, the floor at y, s wide
function h4Bed(x, y, s, key = 'bd') {
  boilSeed(key);
  paint([[x - s * .5, y - s * .16], [x - s * .5, y - s * .62], [x - s * .3, y - s * .74], [x, y - s * .8], [x + s * .3, y - s * .74], [x + s * .5, y - s * .62], [x + s * .5, y - s * .16]], { wash: H4.pillar, fill: H4.pillarDk, fillOp: 60, tex: .5, ink: H4.ink, sw: 1.2, curv: .35 });
  paint([[x - s * .42, y - s * .18], [x - s * .42, y - s * .56], [x, y - s * .7], [x + s * .42, y - s * .56], [x + s * .42, y - s * .18]], { wash: H4.couch, fill: H4.couchDk, fillOp: 50, tex: .5, ink: H4.ink, sw: .9, curv: .35 });
  paint(rrPts(x - s * .56, y - s * .2, s * 1.12, s * .14, s * .04), { wash: H4.pillar, fill: H4.pillarDk, fillOp: 50, ink: H4.ink, sw: 1 });
  for (const d of [-.48, .48]) paint(rectPts(x + d * s - s * .03, y - s * .07, s * .06, s * .07), { wash: H4.pillarDk, ink: H4.ink, sw: .8 });
}
// a stone well, its rim centred at (x, y), s wide; front 1 draws only the front half of the rim (over a diver)
function h4Well(x, y, s, front = 0, key = 'wl', depth = .5) {
  boilSeed(key + (front ? 'f' : 'b'));
  if (!front) { paint(ellPts(x, y, s * .5, s * .14, 20), { wash: '#1A1022', ink: H4.ink, sw: 1 }); return; }
  const arc = []; for (let i = 0; i <= 12; i++) { const a = i / 12 * Math.PI; arc.push([x + Math.cos(a) * s * .5, y + Math.sin(a) * s * .14]); }
  paint([[x + s * .5, y], ...arc, [x - s * .5, y], [x - s * .5, y + s * depth], [x + s * .5, y + s * depth]], { wash: '#8A8090', fill: '#5A5064', fillOp: 60, tex: .5, ink: H4.ink, sw: 1.1 });
  inkLine(arc, s * .03, '#B8B0C0', 'ink', .4);
  for (let i = 0; i < Math.floor(depth / .14); i++) inkLine([[x - s * .5, y + s * (.28 + i * .14)], [x + s * .5, y + s * (.28 + i * .14)]], .8, '#5A5064', 'inkfine', 0);
}
// a big clay pot, its base at (x, y), s tall; lid 0..1 pops the lid up and away
function h4Pot(x, y, s, lid = 0, key = 'pt', mouth = true) {
  boilSeed(key);
  paint(ellPts(x, y - s * .45, s * .48, s * .45, 24), { wash: '#C86A3A', fill: '#8E3E1E', fillOp: 60, tex: .5, ink: H4.ink, sw: 1.1 });
  if (mouth) paint(ellPts(x, y - s * .88, s * .24, s * .07, 14), { wash: '#1A1022', ink: H4.ink, sw: .9 });
  inkLine([[x - s * .4, y - s * .5], [x + s * .4, y - s * .5]], 1.4, '#F2C24A', 'ink', .3);
  const lx = x + lid * s * .9, ly = y - s * .92 - Math.sin(lid * Math.PI) * s * .6;
  push(); translate(lx, ly); rotate(lid * 2.4); paint(ellPts(0, 0, s * .28, s * .09, 14), { wash: '#B85A2E', ink: H4.ink, sw: .9 }); paint(ellPts(0, -s * .08, s * .06, s * .05, 8), { wash: '#B85A2E', ink: H4.ink, sw: .7 }); pop();
}
// a trapdoor in the street, its hinge edge at (x, y), s wide; open 0..1 swings it up
function h4Trap(x, y, s, open = 0, key = 'td') {
  boilSeed(key);
  paint(ellPts(x, y, s * .5, s * .12, 16), { wash: '#1A1022', ink: H4.ink, sw: .9 });
  const h = s * .24 * (1 - open) + s * .7 * open;
  paint([[x - s * .5, y], [x + s * .5, y], [x + s * .46, y - h], [x - s * .46, y - h]], { wash: '#7A4A2A', fill: '#4A2A18', fillOp: 50, tex: .4, ink: H4.ink, sw: .9 });
}
// one domino tile with a little face: its pivot (bottom right corner) at (x, y), w × h, tipped ang (radians, + falls
// right). C = { skin, band, mark } (the face, the hair or crown band, an optional bindi / tilak colour); sad 0..1
function h4Tile(x, y, w, h, ang, C, key, sad = 1, eyesShut = 0) {
  boilSeed(key);
  push(); translate(x, y); rotate(ang);
  paint(rrPts(-w + 5, -h + 7, w, h, w * .18), { wash: '#000000', washOp: 70, ink: null });
  paint(rrPts(-w, -h, w, h, w * .18), { wash: C.skin, fill: mixCol(C.skin, '#000000', .25), fillOp: 50, tex: .4, ink: H4.ink, sw: 1.1 });
  paint([[-w, -h * .7], [-w, -h + w * .18], [-w + w * .18, -h], [-w * .18, -h], [0, -h + w * .18], [0, -h * .7]], { wash: C.band, ink: H4.ink, sw: .9, curv: .3 });
  const cx = -w / 2, ey = -h * .5;
  if (C.mark) paint(ellPts(cx, -h * .62, w * .06, w * .06, 8), { wash: C.mark, ink: null });
  for (const s of [-1, 1]) {
    if (eyesShut > .5) inkLine([[cx + s * w * .2 - w * .07, ey], [cx + s * w * .2, ey + w * .04], [cx + s * w * .2 + w * .07, ey]], 1.4, H4.ink, 'ink', .5);
    else { paint(ellPts(cx + s * w * .2, ey, w * .07, w * .09, 8), { wash: H4.ink, ink: null }); paint(ellPts(cx + s * w * .2 - w * .02, ey - w * .03, w * .025, w * .025, 6), { wash: '#FFFFFF', ink: null }); }
    inkLine([[cx + s * w * .1, ey - w * .16], [cx + s * w * .3, ey - w * .16 - s * 0 - w * .07 * sad]], 1.2, H4.ink, 'ink', 0);
  }
  inkLine([[cx - w * .14, -h * .3 + w * .03 * sad], [cx, -h * .3 - w * .04 * sad], [cx + w * .14, -h * .3 + w * .03 * sad]], 1.4, H4.ink, 'ink', .5);
  pop();
}
// a thought bubble: a cream cloud of rx × ry at (x, y), its tail of dots toward (tx, ty); k pops it
function h4Bubble(x, y, rx, ry, tx, ty, k = 1, key = 'bb', col = '#FFFDF6') {
  if (k <= 0) return;
  boilSeed(key);
  push(); translate(x, y); scale(k); translate(-x, -y);
  for (const [f, r] of [[.94, 13], [.8, 20]]) paint(ellPts(lerp(x, tx, f), lerp(y, ty, f), r, r, 12), { wash: col, ink: H4.ink, sw: 1 });
  paint(ellPts(x, y, rx, ry, 30), { wash: col, ink: H4.ink, sw: 1.5 });
  pop();
}
// a red painted cross (not here!), centred at (x, y), s wide; k pops it
function h4Cross(x, y, s, k = 1, key = 'x') {
  if (k <= 0) return;
  boilSeed(key);
  push(); translate(x, y); scale(backOut(k)); rotate(-.1);
  for (const a of [Math.PI / 4, -Math.PI / 4]) { push(); rotate(a); paint(rrPts(-s * .5, -s * .1, s, s * .2, s * .08), { wash: '#E2453A', ink: H4.ink, sw: 1 }); pop(); }
  pop();
}
