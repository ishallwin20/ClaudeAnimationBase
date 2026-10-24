// rp9_props.js: sets, props and the extra cast for rp9.js (Ramayan Part 9, "Hanuman's Leap"). Loaded after
// src/ramayan.js and src/ramayan_sets.js (P1, tree, bush, notes, tears). Pure functions.
//   P9                                              the palette
//   openSea, frontSea, mahendra, lankaView, palace, ashokaGrove   sets
//   cloudPuff, poof, waterShadow, splash, mound, ramRing, couch    props
//   mainaka(x, y, s, o)       the golden mountain, with a face, rising out of the sea
//   surasa(x, y, s, o)        the mother of snakes in her monster form: a huge green serpent head, a mouth that opens wide
//   simhika(x, y, s, o), simhikaHand(x, y, s, grab, o)   the sea demoness who grabs shadows
//   queenAsleep(x, y, u, o)   Mandodari asleep on a couch (Parvati's rig, lying down)
const P9 = {
  ink: '#2B2233', cream: '#FFF5E2', gold: '#F5C542',
  skyHi: '#8FC0EA', skyLo: '#FCE3C4', sea: '#3E86B8', seaDk: '#2A6494', seaLt: '#9ED0EE', foam: '#EAF6FC',
  duskHi: '#D9785A', duskLo: '#F7C08E', nightHi: '#141C44', nightLo: '#33366E', moon: '#FFF4D2',
  mount: '#8EAE72', mountDk: '#6A8E56', rock: '#A0927E', rockDk: '#7A6C5A',
  mgold: '#F2C24A', mgoldDk: '#C8922A', mgoldLt: '#FFE38A',
  snake: '#5EB86A', snakeDk: '#3A8A4A', snakeLt: '#9EDC8A', belly: '#E8E29A', mouth: '#7A1E36', tongue: '#E2506A',
  simh: '#7A4A9A', simhDk: '#523270', simhLt: '#A87AC8', simhHair: '#24183A',
  lanka: '#E2A83A', lankaDk: '#A8701E', lankaN: '#C89A4A', lankaNDk: '#6A4A3A',
  hall: '#3A1E3A', hallLo: '#6A2E4A', pillar: '#E8B84A', pillarDk: '#B8862E', couch: '#B8304A', couchDk: '#86203A',
  grove: '#0E1830', groveLo: '#2A2A58', ashoka: '#E2453A', ashokaDk: '#A82E2A', grass: '#3E5A3A', grassDk: '#2A4228',
};

// ---------- small props ----------
// a soft cloud: overlapping puffs, one outline-free wash with a darker belly
function cloudPuff(x, y, s, key, a = 255, col = '#FFF6EC', dk = '#E8D6CC') {
  boilSeed('cloud' + key);
  paint(ellPts(x, y + s * .18, s * 1.1, s * .32, 18), { wash: dk, washOp: a, ink: null });
  for (const [dx, dy, r] of [[-.6, 0, .42], [-.15, -.22, .55], [.4, -.08, .46], [.85, .06, .3]]) paint(ellPts(x + dx * s, y + dy * s, r * s, r * s * .85, 16), { wash: col, washOp: a, ink: null });
}
// a puff of magic smoke (age 0..1)
function poof(x, y, s, age, key = 'pf', cols = ['#FFF2C8', '#F2D890']) {
  if (age < 0 || age > 1) return;
  boilSeed(key);
  glow(x, y, s * 1.6 * (1 - age), '#FFE0A0', .6 * (1 - age));
  for (let i = 0; i < 8; i++) { const a = i / 8 * TAU, r = s * (.3 + age * .9); paint(ellPts(x + Math.cos(a) * r, y + Math.sin(a) * r * .7, s * .35 * (1 - age * .6), s * .3 * (1 - age * .6), 12), { wash: cols[i % 2], washOp: 255 * (1 - age), ink: null }); }
}
// a flying thing's shadow on the water: a dark ellipse at (x, y), w wide
function waterShadow(x, y, w, key = 'ws', a = 120) { boilSeed(key); paint(ellPts(x, y, w * .5, w * .1, 16), { wash: '#16304E', washOp: a, ink: null }); }
// a splash ring and droplets at (x, y), s wide, age 0..1
function splash(x, y, s, age, key = 'sp') {
  if (age < 0 || age > 1) return;
  boilSeed(key);
  const k = easeOut(age), f = 1 - age;
  for (let i = 0; i < 9; i++) {
    const a = -Math.PI * (.08 + .84 * i / 8), r = s * (.2 + .6 * k), h = Math.sin(age * Math.PI) * s * (.5 + .4 * hash(i * 3.3));
    paint(ellPts(x + Math.cos(a) * r, y - h * (.5 + .5 * -Math.sin(a)), s * .05 * f + 2, s * .06 * f + 2, 8), { wash: P9.foam, washOp: 255 * f, ink: null });
  }
  paint(ellPts(x, y, s * (.3 + .4 * k), s * .07 * (1 + k), 18), { wash: P9.foam, washOp: 200 * f, ink: null });
}
// a grassy mound (it hides Sita's legs: she sits behind it), centred on (x, y), s wide
function mound(x, y, s, key = 'md') {
  boilSeed(key);
  paint([[x - s * .5, y], [x - s * .42, y - s * .16], [x - s * .2, y - s * .26], [x + s * .1, y - s * .27], [x + s * .38, y - s * .18], [x + s * .5, y]], { wash: P9.grass, fill: P9.grassDk, fillOp: 50, tex: .5, ink: P9.ink, sw: 1, curv: .5 });
  for (let i = 0; i < 9; i++) { const gx = x - s * .44 + i * s * .11, gy = y - s * (.1 + .12 * Math.sin(i / 8 * Math.PI)); inkLine([[gx, gy], [gx + 6, gy - 30]], 1.6, '#5E8A4E', 'ink', .3); }
}
// Ram's ring: a gold band with a blue stone (his name is cut in it: too small to show), centred at (x, y), s wide;
// sparkle 0..1 adds its light and twinkles
function ramRing(x, y, s, sparkle = 0, key = 'rr', t = T) {
  boilSeed(key);
  if (sparkle > 0) glow(x, y, s * 2, '#FFE8A0', .55 * sparkle);
  inkLine([...ellPts(x, y + s * .1, s * .42, s * .3, 18), ellPts(x, y + s * .1, s * .42, s * .3, 18)[0]], Math.max(1.5, s * .045), P9.mgold, 'ink', .5);
  inkLine([...ellPts(x, y + s * .1, s * .34, s * .23, 18), ellPts(x, y + s * .1, s * .34, s * .23, 18)[0]], Math.max(.5, s * .012), P9.mgoldDk, 'inkfine', .5);
  paint(ellPts(x, y - s * .22, s * .16, s * .13, 10), { wash: '#3E7ED8', ink: P9.ink, sw: .5 });
  paint(ellPts(x - s * .05, y - s * .25, s * .05, s * .04, 6), { wash: '#BFE0FF', ink: null });
  if (sparkle > 0) for (let i = 0; i < 4; i++) { const q = frac(t * 1.2 + i / 4), a = i * 1.7; paint(starPts(x + Math.cos(a) * s * .8, y + Math.sin(a) * s * .6 - q * s * .5, s * .18 * Math.sin(q * Math.PI) * sparkle, .35, 4), { wash: '#FFFFFF', ink: null }); }
}
// a gold-legged red couch, its seat centred at (x, y), s wide
function couch(x, y, s, key = 'co') {
  boilSeed(key);
  for (const d of [-.42, .42]) paint(rectPts(x + d * s - s * .03, y, s * .06, s * .14), { wash: P9.pillar, ink: P9.ink, sw: .8 });
  paint(rrPts(x - s * .5, y - s * .1, s, s * .14, s * .05), { wash: P9.couch, fill: P9.couchDk, fillOp: 60, tex: .4, ink: P9.ink, sw: 1 });
  paint(rrPts(x - s * .56, y - s * .3, s * .12, s * .34, s * .05), { wash: P9.couch, ink: P9.ink, sw: 1 });   // the head end
  inkLine([[x - s * .48, y - s * .02], [x + s * .48, y - s * .02]], 2, P9.pillar, 'ink', 0);
}

// ---------- sets ----------
// the open sea by day: sky, far clouds, the sea from the horizon (o.hy) down; o.dist (px flown so far) scrolls the waves
// and clouds left (pass speed × t for a steady flight; hold it to stop dead), o.dusk 0..1
function openSea(t, key = 'os', o = {}) {
  const hy = o.hy ?? 1300, dist = o.dist ?? 0, dusk = o.dusk || 0;
  boilSeed(key + 'sky');
  paint(rectPts(-600, -800, W + 1200, hy + 900), { wash: mixCol(P9.skyHi, P9.duskHi, dusk), ink: null });
  paint(ellPts(540, hy - 200, 1200, 420, 26), { fill: mixCol(P9.skyLo, P9.duskLo, dusk), fillOp: 220, bleed: .3, tex: .4, ink: null });
  for (let i = 0; i < 5; i++) { const x = 1500 - frac(hash(i * 7.3) + (dist * .15 + t * 8) / 1900) * 2100, y = 380 + hash(i * 5.1) * (hy - 600); cloudPuff(x, y, 70 + 70 * hash(i * 1.9), key + i, 220); }
  frontSea(t, hy, key + 'sea', dist, dusk);
}
// the sea surface from y down (drawn again in front of things that rise out of it), waves scrolling left by dist
function frontSea(t, y, key = 'fs', dist = 0, dusk = 0) {
  boilSeed(key);
  paint(rectPts(-600, y, W + 1200, 2200), { wash: mixCol(P9.sea, '#2E4A7A', dusk), ink: null });
  paint(rectPts(-600, y, W + 1200, 26), { wash: mixCol(P9.seaLt, '#E8A880', dusk), washOp: 140, ink: null });
  for (let i = 0; i < 14; i++) {
    const r = hash(i * 2.3), yy = y + 30 + r * r * 900, x = 1500 - frac(hash(i * 7.7) + (dist * (.4 + r) + t * 20) / 2000) * 2200, w = 50 + r * 70;
    inkLine([[x, yy], [x + w * .5, yy - 10 - r * 6], [x + w, yy]], 1.4 + r * 1.4, mixCol(P9.seaLt, '#F2B890', dusk), 'inkfine', .5);
  }
}
// Mount Mahendra by the sea: a green dome with rocks and trees, its top at (x, y), s wide; press 0..1 squashes it
// (springs squirt from its sides, see the shot); the sea behind
function mahendra(t, x, y, s, press = 0, key = 'mh') {
  openSea(t, key + 'bg', { hy: y + s * .08 });
  const sy = 1 - .14 * press, sx = 1 + .06 * press, top = y + s * .14 * press;
  boilSeed(key + 'mt');
  paint(ellPts(x, top + s * .62 * sy, s * .5 * sx, s * .62 * sy, 34, 2), { wash: P9.mount, fill: P9.mountDk, fillOp: 60, tex: .5, ink: P9.ink, sw: 1.2 });
  paint(ellPts(x - s * .18 * sx, top + s * .5 * sy, s * .12, s * .08, 14, 2), { wash: P9.rock, fill: P9.rockDk, fillOp: 50, tex: .4, ink: P9.ink, sw: .9 });
  paint(ellPts(x + s * .26 * sx, top + s * .34 * sy, s * .08, s * .06, 12, 2), { wash: P9.rock, fill: P9.rockDk, fillOp: 50, tex: .4, ink: P9.ink, sw: .9 });
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI * (.2 + .6 * hash(i * 4.1)), r = .55 + .3 * hash(i * 2.9), tx = x + Math.cos(a) * s * .5 * sx * r * 1.4, ty = top + s * .62 * sy + Math.sin(a) * s * .62 * sy * r;
    tree(tx, ty, s * .14, key + 'tr' + i, Math.sin(t * .8 + i) * .2 + press * Math.sin(t * 30 + i) * .3);
  }
}
// across the water: Lanka, a city of gold on its hill (Trikuta), at dusk (night 0) or night (1); the hill Hanuman lands
// on is drawn by the shot
function lankaView(t, night = 0, key = 'lv') {
  boilSeed(key + 'sky');
  paint(rectPts(-600, -800, W + 1200, 2300), { wash: mixCol(P9.duskHi, P9.nightHi, night), ink: null });
  paint(ellPts(540, 1150, 1200, 460, 26), { fill: mixCol(P9.duskLo, P9.nightLo, night), fillOp: 220, bleed: .3, tex: .4, ink: null });
  if (night > .3) { const k = clamp((night - .3) / .5); glow(860, 560, 160, '#FFF4D2', .4 * k); paint(ellPts(860, 560, 46, 46, 18), { wash: P9.moon, washOp: 255 * k, ink: null });
    boilSeed(key + 'st'); for (let i = 0; i < 18; i++) paint(starPts(-100 + hash(i * 2.3) * 1300, 300 + hash(i * 6.7) * 600, 3 + 4 * hash(i * 3.3) * (.6 + .4 * Math.sin(t * 2 + i)), .4, 4), { wash: '#FFF6DA', washOp: 255 * k, ink: null }); }
  frontSea(t, 1240, key + 'sea', 0, .5 + night * .5);
  // the hill and the city: towers with domes, lit windows at night
  boilSeed(key + 'hill');
  paint(ellPts(560, 1260, 560, 120, 26), { wash: mixCol('#6A5A4A', '#2A2440', night), ink: null });
  const city = mixCol(P9.lanka, P9.lankaN, night * .6), cityDk = mixCol(P9.lankaDk, P9.lankaNDk, night);
  boilSeed(key + 'city');
  glow(560, 1060, 420, '#FFC060', .3 + .2 * night);
  for (let i = 0; i < 9; i++) {
    const x = 200 + i * 90, h = 110 + 170 * Math.sin(i / 8 * Math.PI) + 40 * hash(i * 4.7), y = 1210 - Math.sin(i / 8 * Math.PI) * 40;
    paint([[x - 30, y], [x - 30, y - h], [x, y - h - 60], [x + 30, y - h], [x + 30, y]], { wash: i % 2 ? city : mixCol(city, cityDk, .3), fill: cityDk, fillOp: 40, tex: .3, ink: P9.ink, sw: .7, curv: .1 });
    paint(ellPts(x, y - h - 6, 24, 24, 12), { wash: city, ink: P9.ink, sw: .6 });
    if (night > .4) for (let j = 0; j < 2; j++) paint(rectPts(x - 8, y - h * (.3 + j * .35), 16, 20), { wash: '#FFE9A0', washOp: 255 * clamp((night - .4) * 3), ink: null });
  }
}
// Ravana's palace at night: a dark plum room with gold pillars and a low gold glow
function palace(t, key = 'pl') {
  boilSeed(key);
  paint(rectPts(-600, -600, W + 1200, 3200), { wash: P9.hall, ink: null });
  paint(ellPts(540, 1250, 720, 640, 26), { fill: P9.hallLo, fillOp: 200, bleed: .3, tex: .4, ink: null });
  glow(560, 1350, 460, '#FFB050', .3);
  for (const x of [70, 1010]) { paint(rectPts(x - 60, 250, 120, 1420), { wash: P9.pillar, fill: P9.pillarDk, fillOp: 50, tex: .4, ink: P9.ink, sw: 1 }); paint(rectPts(x - 80, 230, 160, 50), { wash: P9.pillarDk, ink: P9.ink, sw: .9 }); }
  boilSeed(key + 'fl');
  paint(rectPts(-600, 1660, W + 1200, 1200), { wash: '#2A142A', ink: null });
  inkLine([[-100, 1660], [1200, 1660]], .9, P9.ink, 'ink', 0);
  // two oil lamps on stands
  for (const [x, s] of [[450, 1], [1060, -1]]) { inkLine([[x, 1660], [x, 1420]], 3, P9.pillarDk, 'ink', 0); paint(ellPts(x, 1418, 30, 10, 12), { wash: P9.pillar, ink: P9.ink, sw: .7 }); const f = 1 + .12 * Math.sin(t * 9 + s); glow(x, 1395, 120, '#FFB050', .45); paint([[x - 9, 1414], [x, 1414 - 34 * f], [x + 9, 1414]], { wash: '#FFD070', ink: null, curv: .6 }); }
}
// the Ashoka grove in Lanka at night: dark sky, a moon, the tree (its trunk at tx) with red blossoms
function ashokaGrove(t, key = 'ag', tx = 300, th = 820) {
  boilSeed(key + 'sky');
  paint(rectPts(-600, -600, W + 1200, 2400), { wash: P9.grove, ink: null });
  paint(ellPts(540, 1150, 1000, 700, 26), { fill: P9.groveLo, fillOp: 200, bleed: .3, tex: .4, ink: null });
  glow(840, 520, 160, '#FFF4D2', .4); paint(ellPts(840, 520, 50, 50, 18), { wash: P9.moon, ink: null });
  boilSeed(key + 'stars'); for (let i = 0; i < 14; i++) paint(starPts(-100 + hash(i * 2.3) * 1300, 300 + hash(i * 6.7) * 500, 3 + 3 * hash(i * 3.3) * (.6 + .4 * Math.sin(t * 2 + i)), .4, 4), { wash: '#FFF6DA', ink: null });
  boilSeed(key + 'ground');
  paint(rectPts(-600, 1640, W + 1200, 1100), { wash: '#1E2A3A', ink: null });
  inkLine([[-100, 1640], [500, 1630], [1200, 1645]], .9, P9.ink, 'ink', .5);
  tree(tx, 1660, th, key + 'tr', Math.sin(t * .7) * .15, ['#2E4A3A', '#1E3428', P9.ashoka]);
  boilSeed(key + 'blooms');
  for (let i = 0; i < 18; i++) { const x = tx - 330 + hash(i * 2.7) * 660, y = 1660 - th * .98 + hash(i * 4.9) * th * .4; paint(ellPts(x, y, 14, 12, 8), { wash: i % 2 ? P9.ashoka : P9.ashokaDk, ink: null }); }
}

// ---------- the cast ----------
// Mainaka: a golden mountain with a sweet face, rising out of the sea. (x, y) is the middle of its base at the water
// line, s its height; rise 0..1 lifts it out of the water (the shot draws frontSea() over its foot); o.mouth 'smile' /
// 'open' / 'grin', o.eyes 'happy' / 'normal' / 'closed', o.blush
function mainaka(x, y, s, rise = 1, o = {}) {
  const key = o.key || 'mk', by = y + (1 - rise) * s * 1.05, w = s * .9;
  boilSeed(key);
  glow(x, by - s * .5, s * .9, '#FFD870', .35 * rise);
  // three peaks: the small ones behind, the big smiling one in front
  paint([[x - w * 1.0, by], [x - w * .62, by - s * .62], [x - w * .45, by - s * .55], [x - w * .2, by]], { wash: P9.mgoldDk, fill: '#A87A1E', fillOp: 40, tex: .4, ink: P9.ink, sw: 1, curv: .25 });
  paint([[x + w * .2, by], [x + w * .55, by - s * .7], [x + w * .7, by - s * .62], [x + w * 1.0, by]], { wash: P9.mgoldDk, fill: '#A87A1E', fillOp: 40, tex: .4, ink: P9.ink, sw: 1, curv: .25 });
  paint([[x - w * .62, by], [x - w * .12, by - s * .96], [x + w * .1, by - s], [x + w * .62, by]], { wash: P9.mgold, fill: P9.mgoldDk, fillOp: 50, tex: .4, ink: P9.ink, sw: 1.2, curv: .3 });
  paint([[x - w * .12, by - s * .96], [x + w * .1, by - s], [x + w * .2, by - s * .82], [x + w * .02, by - s * .86], [x - w * .1, by - s * .8], [x - w * .22, by - s * .84]], { wash: P9.mgoldLt, ink: null, curv: .3 });   // the shine on top
  boilSeed(key + 'face');
  const fy = by - s * .5, fs = s * .09;
  for (const d of [-1, 1]) {
    const ex = x + d * fs * 1.7;
    if (o.eyes === 'normal') { paint(ellPts(ex, fy, fs * .5, fs * .62, 12), { wash: '#3A2418', ink: null }); paint(ellPts(ex - fs * .15, fy - fs * .25, fs * .17, fs * .17, 8), { wash: '#FFFFFF', ink: null }); }
    else if (o.eyes === 'closed') inkLine([[ex - fs * .5, fy], [ex, fy + fs * .25], [ex + fs * .5, fy]], 3, '#3A2418', 'ink', .5);
    else inkLine([[ex - fs * .55, fy + fs * .15], [ex, fy - fs * .35], [ex + fs * .55, fy + fs * .15]], 3, '#3A2418', 'ink', .5);
    if (o.blush !== 0) paint(ellPts(ex + d * fs * .5, fy + fs * 1.1, fs * .55, fs * .3, 10), { wash: '#F2907A', washOp: 150, ink: null });
  }
  const my = fy + fs * 1.3;
  if (o.mouth === 'open') paint(ellPts(x, my + fs * .3, fs * .7, fs * .55, 12), { wash: '#7A2A22', ink: '#3A2418', sw: .8 });
  else inkLine([[x - fs * .9, my], [x, my + fs * (o.mouth === 'grin' ? .9 : .6)], [x + fs * .9, my]], 3, '#3A2418', 'ink', .6);
}

// Surasa in her monster form: a huge green serpent rising from the sea, a gold crown, big lashed eyes. (x, y) is the
// centre of her head, s its width. o.open 0..1.6 opens her mouth (0: a smile; it can open wider than her head),
// o.eyes 'normal' / 'wide' / 'happy' / 'closed' / 'angry', o.look -1..1, o.blush, o.neck (how far her body runs down,
// default to the bottom of the frame), o.sway (phase)
function surasa(x, y, s, o = {}) {
  const key = o.key || 'su', op = o.open || 0, look = o.look || 0, sway = o.sway || 0;
  // the body: a fat ribbon curving down to the water, banded belly
  boilSeed(key + 'body');
  const B = through([[x, y + s * .2], [x + s * .3 + Math.sin(sway) * 20, y + s * 1.0], [x - s * .1 + Math.sin(sway + 1) * 30, y + s * 1.8], [x + s * .2, y + s * 2.8]]);
  paint(ribbon(B, s * .5, s * .7), { wash: P9.snake, fill: P9.snakeDk, fillOp: 60, tex: .4, ink: P9.ink, sw: 1.2 });
  for (let i = 2; i < B.length - 1; i += 2) { const [bx, by] = B[i]; paint(ellPts(bx - s * .04, by, s * .14, s * .05, 10), { wash: P9.belly, ink: P9.ink, sw: .5 }); }
  // the mouth below the eyes: a jaw that drops and widens; the dark inside, a pink tongue, two little fangs
  boilSeed(key + 'jaw');
  const mw = s * (.34 + .42 * op), mh = s * (.04 + .36 * op), my = y + s * .2 + mh * .55;
  if (op > .05) {
    paint(ellPts(x, my + mh * .1, mw * 1.08 + s * .05, mh + s * .1, 24), { wash: P9.snakeLt, ink: P9.ink, sw: 1.2 });   // the jaw
    paint(ellPts(x, my, mw, mh, 24), { wash: P9.mouth, ink: P9.ink, sw: 1 });
    paint(ellPts(x, my + mh * .55, mw * .5, mh * .32, 16), { wash: P9.tongue, ink: null });
    for (const d of [-1, 1]) paint([[x + d * mw * .45 - s * .03, my - mh * .82], [x + d * mw * .45, my - mh * .82 + s * .1 * Math.min(1, op + .3)], [x + d * mw * .45 + s * .03, my - mh * .82]], { wash: '#FFF8EC', ink: P9.ink, sw: .5 });
  }
  // the head: a broad rounded top with brow ridges, drawn over the top of the mouth
  boilSeed(key + 'head');
  paint(ellPts(x, y - s * .05, s * .5, s * .32, 28), { wash: P9.snake, fill: P9.snakeDk, fillOp: 40, tex: .3, ink: P9.ink, sw: 1.3 });
  paint(ellPts(x, y + s * .02, s * .34, s * .14, 18), { wash: P9.snakeLt, ink: null });   // the snout
  for (const d of [-1, 1]) paint(ellPts(x + d * s * .07, y + s * .05, s * .02, s * .012, 6), { wash: P9.snakeDk, ink: null });   // nostrils
  if (op <= .05) {
    inkLine([[x - s * .22, y + s * .14], [x, y + s * (.2 + .03)], [x + s * .22, y + s * .14]], 2.4, P9.ink, 'ink', .6);
    const fl = Math.max(0, Math.sin((o.flick ?? T) * 5)) * s * .14;   // the forked tongue flicks out
    if (fl > 2) { const ty = y + s * .23; inkLine([[x, ty], [x, ty + fl]], 3, P9.tongue, 'ink', 0); inkLine([[x, ty + fl], [x - s * .025, ty + fl + s * .04]], 2.2, P9.tongue, 'ink', 0); inkLine([[x, ty + fl], [x + s * .025, ty + fl + s * .04]], 2.2, P9.tongue, 'ink', 0); }
  }
  for (let i = 0; i < 5; i++) paint(ellPts(x + (i - 2) * s * .14, y - s * .26 + Math.abs(i - 2) * s * .04, s * .03, s * .02, 8), { wash: P9.snakeDk, ink: null });   // spots
  // the crown and a red bindi
  boilSeed(key + 'crown');
  paint([[x - s * .2, y - s * .3], [x - s * .22, y - s * .46], [x - s * .1, y - s * .38], [x, y - s * .54], [x + s * .1, y - s * .38], [x + s * .22, y - s * .46], [x + s * .2, y - s * .3]], { wash: P9.gold, fill: '#C8922A', fillOp: 40, tex: .3, ink: P9.ink, sw: 1 });
  paint(ellPts(x, y - s * .4, s * .025, s * .025, 8), { wash: '#D2283A', ink: null });
  paint(ellPts(x, y - s * .25, s * .018, s * .024, 8), { wash: '#D2283A', ink: null });
  // the eyes
  boilSeed(key + 'eyes');
  const e = o.eyes || 'normal';
  for (const d of [-1, 1]) {
    const ex = x + d * s * .2, ey = y - s * .14, r = s * (e === 'wide' ? .1 : .085);
    if (e === 'happy') inkLine([[ex - r, ey + r * .3], [ex, ey - r * .5], [ex + r, ey + r * .3]], 3, P9.ink, 'ink', .5);
    else if (e === 'closed') inkLine([[ex - r, ey], [ex, ey + r * .4], [ex + r, ey]], 3, P9.ink, 'ink', .5);
    else {
      paint(ellPts(ex, ey, r, r * 1.1, 16), { wash: '#FFF8E0', ink: P9.ink, sw: 1 });
      paint(ellPts(ex + look * r * .35, ey + r * .1, r * .55, r * .7, 12), { wash: '#C89A1E', ink: null });
      paint(ellPts(ex + look * r * .35, ey + r * .1, r * .14, r * .55, 10), { wash: '#1E1424', ink: null });   // a slit pupil
      paint(ellPts(ex + look * r * .35 - r * .2, ey - r * .3, r * .14, r * .14, 8), { wash: '#FFFFFF', ink: null });
      if (e === 'angry') inkLine([[ex - d * r * 1.1, ey - r * 1.5], [ex + d * r * .9, ey - r * .9]], 4, P9.ink, 'ink', 0);
    }
    for (let k = 0; k < 3; k++) inkLine([[ex + d * r * (.4 + k * .3), ey - r * .95 + k * r * .15], [ex + d * r * (.6 + k * .4), ey - r * 1.35 + k * r * .1]], 2, P9.ink, 'inkfine', 0);   // lashes
    if (o.blush) paint(ellPts(ex + d * s * .06, ey + s * .13, s * .07, s * .035, 10), { wash: '#F27A8A', washOp: 180 * o.blush, ink: null });
  }
}

// Simhika, the sea demoness who catches flyers by their shadows: a purple head with wild hair and horns rising out of
// the water. (x, y) her head's centre, s its width; o.open 0..1 (her mouth), o.eyes 'angry' / 'wide' / 'swirl' /
// 'cross', o.sink 0..1 (the shot draws frontSea() over her)
function simhika(x, y, s, o = {}) {
  const key = o.key || 'sh', op = o.open || 0, yy = y + (o.sink || 0) * s * 1.6;
  boilSeed(key + 'hair');
  for (let i = 0; i < 9; i++) { const a = -Math.PI * (.05 + .9 * i / 8), r = s * (.62 + .1 * Math.sin(i * 2.1 + T * 3)); paint(ribbon([[x + Math.cos(a) * s * .3, yy + Math.sin(a) * s * .3], [x + Math.cos(a) * r, yy + Math.sin(a) * r * .9], [x + Math.cos(a + .2) * r * 1.2, yy + Math.sin(a + .2) * r]], s * .14, 2), { wash: P9.simhHair, ink: null }); }
  boilSeed(key + 'head');
  for (const d of [-1, 1]) paint([[x + d * s * .18, yy - s * .36], [x + d * s * .3, yy - s * .66], [x + d * s * .3, yy - s * .34]], { wash: '#E8DCC8', ink: P9.ink, sw: .8, curv: .3 });   // horns
  paint(ellPts(x, yy, s * .5, s * .46, 26), { wash: P9.simh, fill: P9.simhDk, fillOp: 50, tex: .4, ink: P9.ink, sw: 1.3 });
  for (const d of [-1, 1]) paint(ellPts(x + d * s * .5, yy - s * .02, s * .08, s * .14, 10), { wash: P9.simh, ink: P9.ink, sw: .8 });   // ears
  const e = o.eyes || 'angry';
  for (const d of [-1, 1]) {
    const ex = x + d * s * .18, ey = yy - s * .12, r = s * .09;
    if (e === 'swirl') { inkLine(Array.from({ length: 14 }, (_, k) => { const a = k * .9 + T * 8 * d, rr = r * k / 13; return [ex + Math.cos(a) * rr, ey + Math.sin(a) * rr]; }), 2.2, P9.ink, 'ink', .4); continue; }
    paint(ellPts(ex, ey, r, r * 1.05, 14), { wash: '#FFF0B0', ink: P9.ink, sw: 1 });
    const px = e === 'cross' ? -d * r * .45 : 0;
    paint(ellPts(ex + px, ey + r * .1, r * (e === 'wide' ? .3 : .45), r * (e === 'wide' ? .3 : .45), 10), { wash: '#C8283A', ink: null });
    if (e === 'angry') inkLine([[ex - d * r * 1.3, ey - r * 1.6], [ex + d * r * .9, ey - r * .8]], 4, P9.ink, 'ink', 0);
  }
  // the mouth: a wide grin of little fangs, or wide open
  boilSeed(key + 'mouth');
  const my = yy + s * .2;
  if (op > .05) { paint(ellPts(x, my + s * .05 * op, s * (.18 + .14 * op), s * (.03 + .2 * op), 20), { wash: '#3A0E22', ink: P9.ink, sw: 1 }); for (let i = -2; i <= 2; i++) paint([[x + i * s * .06 - s * .02, my - s * .02], [x + i * s * .06, my + s * .05], [x + i * s * .06 + s * .02, my - s * .02]], { wash: '#FFF8EC', ink: null }); }
  else { inkLine([[x - s * .2, my - s * .02], [x, my + s * .06], [x + s * .2, my - s * .02]], 3, P9.ink, 'ink', .6); for (const d of [-1, 1]) paint([[x + d * s * .12 - s * .02, my + s * .01], [x + d * s * .12, my + s * .08], [x + d * s * .12 + s * .02, my + s * .02]], { wash: '#FFF8EC', ink: P9.ink, sw: .4 }); }
}
// her arm rising out of the water, a clawed purple hand: (x, y) where it breaks the surface, s the hand's size,
// grab 0..1 closes the fingers, o.reach (how far up the hand is, in s)
function simhikaHand(x, y, s, grab = 0, o = {}) {
  const key = o.key || 'shh', hy = y - s * (o.reach ?? 1.6);
  boilSeed(key);
  paint(ribbon([[x, y + s * .3], [x + s * .1, y - s * .6], [x, hy + s * .3]], s * .5, s * .38), { wash: P9.simh, fill: P9.simhDk, fillOp: 50, tex: .4, ink: P9.ink, sw: 1.1 });
  paint(ellPts(x, hy + s * .1, s * .32, s * .28, 16), { wash: P9.simh, ink: P9.ink, sw: 1.1 });
  for (let i = 0; i < 4; i++) {
    const a0 = -Math.PI / 2 + (i - 1.5) * .32, side = i < 2 ? 1 : -1, c = grab * 1.1 * side;   // curl towards the middle
    const p0 = [x + Math.cos(a0) * s * .26, hy + s * .1 + Math.sin(a0) * s * .22], p1 = [p0[0] + Math.cos(a0 + c * .5) * s * .28, p0[1] + Math.sin(a0 + c * .5) * s * .28], p2 = [p1[0] + Math.cos(a0 + c * 1.4) * s * .22, p1[1] + Math.sin(a0 + c * 1.4) * s * .22];
    paint(ribbon([p0, p1, p2], s * .13, s * .08), { wash: P9.simh, ink: P9.ink, sw: .9 });
    paint(ellPts(p2[0], p2[1], s * .035, s * .035, 6), { wash: '#E8DCC8', ink: null });   // a claw
  }
}

// Mandodari asleep on a couch: Parvati's rig lying down (head to the left), a blanket over her; (x, y) is the couch
// seat's centre, u the rig's unit
const MANDO_PAL = { saree: '#E8A23A', sareeDk: '#B8761E', sareeLt: '#FFCF7A' };
function queenAsleep(x, y, u, o = {}) {
  couch(x, y, u * 30, o.key || 'qa');
  parvati(x + u * 13, y - u * 2.6, u, { boilKey: (o.key || 'qa') + 'p', rot: -Math.PI / 2, eyes: 'closed', mouth: 'smile', noShadow: true, pal: MANDO_PAL, ...o });
  boilSeed((o.key || 'qa') + 'bl');
  paint(rrPts(x - u * 4, y - u * 4.4, u * 18.5, u * 4.2, u * 2), { wash: '#6A3A8A', fill: '#4A2A6A', fillOp: 50, tex: .4, ink: P9.ink, sw: 1 });   // the blanket
  inkLine([[x - u * 3.4, y - u * 3.2], [x + u * 13.8, y - u * 3.3]], 1.6, P9.pillar, 'ink', .2);
}

// ---------- the model sheet: ?loop=rp9 ----------
LOOPS.rp9 = t => {
  camBegin(540, 960, 1);
  paint(rectPts(-40, -40, W + 80, H + 80), { wash: PAL.paper, ink: null });
  mainaka(240, 640, 380, 1, { key: 'm1', mouth: 'open' });
  surasa(760, 420, 380, { key: 's1', open: 0, eyes: 'happy', blush: 1, neck: 1 });
  surasa(300, 1150, 300, { key: 's2', open: 1.3, eyes: 'wide' });
  simhika(800, 1080, 300, { key: 'h1', open: .8 });
  simhikaHand(820, 1500, 160, frac(t / 2), { key: 'hh' });
  queenAsleep(300, 1700, 12, { key: 'qa' });
  ramRing(800, 1750, 120, 1, 'rr', t);
  hanuman(620, 1880, 7, { boilKey: 'hc', crown: false, gada: 0, eyes: 'wide', mouth: 'O' });
  camEnd();
};
LOOPS.rp9.len = 2;
