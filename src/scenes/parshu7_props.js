// parshu7_props.js: sets and props for "PARSHURAMA broke GANESHA'S TUSK" (ad 76, Parshurama series Part 7): Shiva's
// palace door on Kailash, the worlds Ganesha carries him through (the heavens, Vaikuntha, Goloka, the underworlds, the
// waters), a splash, Radha on Parvati's rig, and a trunk that reaches to any point. Load after parshu1–6_props.js.
const P7 = {
  ink: '#2B2233', cream: '#FFF5E2', gold: '#F5C542', goldDk: '#C8922A', goldLt: '#FFE69A', red: '#FF5A3C',
  // the palace: white stone, gold trim, a carved wooden door, marigolds
  stone: '#F4EEE6', stoneDk: '#D2C8D2', stoneSh: '#B0A6BC', wood: '#8A5230', woodDk: '#5E3418', woodLt: '#B87A48',
  mari: '#F39A2B', mariDk: '#D2701A', mango: '#4E9A4A', inside: '#3A2440', insideLt: '#FFD27A',
  // the worlds
  heavHi: '#FFE2A0', heavLo: '#FFF6DA', vaiHi: '#1C2E6E', vaiMid: '#3E6AB8', milk: '#EAF4FF',
  golSky: '#CFEAF6', golHill: '#8CC46A', golHillDk: '#6AA24E', golLt: '#C8E8A0',
  patHi: '#140A26', patMid: '#3A1E5A', patGem: '#FF6ACF', patGem2: '#6AE8FF', naga: '#1E0E30',
  seaHi: '#0E3A5A', sea: '#1E6A8E', seaLt: '#5EB0CE', foam: '#F2FAFF',
  // Radha
  void: '#6A3A1A',
};

// Radha, on Parvati's rig: a rose-pink lehenga, a saffron-gold blouse, a peacock-blue odhni over her head
const RADHA_PAL = { skin: '#F4C6A0', skinDk: '#D69A74', skinLt: '#FFE4CC', saree: '#EE5C86', sareeDk: '#B83A62', sareeLt: '#FF9AB8',
  blouse: '#F2B035', blouseDk: '#C8861A', bangle: '#2F7FB8', veil: '#2F86C0', veilDk: '#1E5E90', lip: '#C8505E' };
function radha7(x, y, u, o = {}) { return parvati(x, y, u, { boilKey: 'radha7', seed: 23, pal: RADHA_PAL, col: RADHA_PAL.skin, dk: RADHA_PAL.skinDk, lt: RADHA_PAL.skinLt, veil: 1, ...o }); }

// ---------- the trunk ----------
// a trunk point list (in bappa()'s coordinates, for balBappa({ trunk })) that reaches from his trunk root to the world
// point (wx, wy), bulging up by `bulge` u; for a standing balBappa at (x, y), size u, unflipped, head straight
function trunkTo(x, y, u, wx, wy, bulge = 2, o = {}) {
  const HY = (o.stand ?? 1) > .5 ? 2.6 : 0, r = [(o.hx || 0) * 1.4, -8.7];
  const tx = (wx - x) / u, ty = (wy - y) / u + HY, P = [];
  for (let i = 0; i <= 8; i++) {
    const k = i / 8, bx = lerp(r[0], tx, k), by = lerp(r[1], ty, k) - Math.sin(k * Math.PI) * bulge + (k < .25 ? (.25 - k) * 2 : 0);
    P.push([(bx - r[0]) / 1.15, (by + 8.7) / 1.15 - 11.2]);
  }
  return P;
}
// the wrap of the trunk round something held at (x, y): a fat band, w wide
function trunkWrap(x, y, w, key = 'wrap') {
  boilSeed(key);
  paint(ribbon([[x - w * .55, y - w * .12], [x - w * .2, y + w * .16], [x + w * .25, y + w * .14], [x + w * .55, y - w * .18]], w * .3, w * .24),
    { wash: BAL.skin, fill: BAL.skinDk, fillOp: 50, tex: .5, ink: BAL.ink, sw: 1.1 });
  for (const k of [-.25, .1, .38]) inkLine([[x + k * w, y + w * .02], [x + k * w + 3, y + w * .2]], .6, BAL.skinDk, 'inkfine', 0);
}

// ---------- Kailash: Shiva's palace door ----------
// a white-stone palace front with a carved wooden door (centre x 540, threshold y 1640), marigold torans, snow steps,
// the Kailash sky behind; o.red 0..1 turns the sky to an angry dusk, o.open 0..1 swings the doors in (a warm light inside)
function palaceDoor(t, o = {}) {
  const red = clamp(o.red || 0), op = clamp(o.open || 0), key = o.key || 'pd';
  boilSeed(key + ' sky');
  paint(rectPts(-300, -300, W + 600, 2400), { wash: mixCol(P2.kHi, '#5A2A3E', red), ink: null });
  paint(ellPts(540, 1100, 1200, 700, 30), { wash: mixCol(P2.kMid, '#B8503E', red), washOp: 220, ink: null });
  paint(ellPts(540, 1200, 900, 380, 30), { wash: mixCol(P2.kLo, '#F2A070', red), washOp: 220, ink: null });
  for (let i = 0; i < 3; i++) cloudPuff(frac(hash(i * 5.1) + t * .006) * 1500 - 220, 560 + i * 120, 70 + 40 * hash(i * 2.2), key + 'c' + i, 210, mixCol('#FFF6EC', '#E8A08A', red), mixCol('#E8D6CC', '#B8706A', red));
  boilSeed(key + ' peaks');   // far snow peaks either side
  for (const [px, py, w] of [[-60, 980, 360], [1130, 940, 380], [880, 1010, 260]]) {
    paint([[px - w, 1300], [px, py], [px + w, 1300]], { wash: mixCol(P2.snow, '#E8C2C8', red * .6), fill: P2.snowDk, fillOp: 60, tex: .4, ink: P2.ink, sw: .8, curv: .1 });
    paint([[px, py], [px + w, 1300], [px + w * .2, 1300]], { wash: mixCol(P2.snowDk, '#A88094', red * .6), washOp: 190, ink: null });
  }
  // the palace wall, the cornice, the pillars
  boilSeed(key + ' wall');
  paint(rectPts(-300, 860, W + 600, 820), { wash: P7.stone, fill: P7.stoneDk, fillOp: 60, tex: .5, ink: null });
  for (let i = 0; i < 9; i++) inkLine([[-300, 960 + i * 80], [1380, 960 + i * 80]], .7, P7.stoneSh, 'inkfine', 0);   // stone courses
  inkLine([[-300, 860], [1380, 860]], 1.4, P7.ink, 'ink', 0);
  paint(rectPts(-300, 820, W + 600, 60), { wash: P7.gold, fill: P7.goldDk, fillOp: 60, tex: .4, ink: P7.ink, sw: 1 });   // the gold cornice
  for (let i = 0; i < 16; i++) paint(ellPts(-260 + i * 110, 820, 40, 26, 12), { wash: P7.gold, ink: P7.ink, sw: .8 });   // its scallops
  boilSeed(key + ' door');
  const dl = 390, dr = 690, dt = 1060, db = 1640;   // the doorway
  paint([[dl - 40, db], [dl - 40, dt + 10], [540, dt - 130], [dr + 40, dt + 10], [dr + 40, db]], { wash: P7.gold, fill: P7.goldDk, fillOp: 60, tex: .4, ink: P7.ink, sw: 1.4, curv: .25 });   // the gold frame
  paint([[dl, db], [dl, dt + 20], [540, dt - 80], [dr, dt + 20], [dr, db]], { wash: op > 0 ? P7.inside : P7.wood, ink: P7.ink, sw: 1.2, curv: .25 });
  if (op > 0) glow(540, 1350, 330, P7.insideLt, .6 * op);
  for (const s of [-1, 1]) {   // two door leaves; they swing in (narrow toward the jamb)
    const w = 150 * (1 - .8 * op), x0 = s < 0 ? dl : dr, x1 = x0 - s * w;
    paint([[x0, db], [x0, dt + 20], [x1, dt - 70 + 90 * op], [x1, db]], { wash: P7.wood, fill: P7.woodDk, fillOp: 60, tex: .5, ink: P7.ink, sw: 1, curv: .1 });
    for (let r = 0; r < 4; r++) for (let c = 0; c < 2; c++) paint(ellPts(lerp(x0, x1, .3 + c * .4), 1180 + r * 120, 9 * (1 - .6 * op), 9, 8), { wash: P7.gold, ink: P7.ink, sw: .5 });   // gold studs
  }
  inkLine([[540, dt - 70], [540, db]], op > .1 ? 0 : 1.4, P7.woodDk, 'ink', 0);
  // the torans: marigold strings and mango leaves across the top of the doorway
  boilSeed(key + ' toran');
  for (let i = 0; i < 11; i++) { const x = dl - 30 + i * 33, y = dt - 40 + Math.sin(i / 10 * Math.PI) * 50; paint(ellPts(x, y, 15, 14, 10), { wash: i % 2 ? P7.mari : '#F7C23A', ink: P7.ink, sw: .6 }); }
  for (let i = 0; i < 6; i++) { const x = dl + 10 + i * 55, y = dt - 20 + Math.sin((i + .5) / 6 * Math.PI) * 50; paint([[x - 10, y], [x, y + 46], [x + 10, y]], { wash: P7.mango, ink: P7.ink, sw: .6, curv: .5 }); }
  for (const px of [dl - 110, dr + 110]) {   // pillars
    paint(rectPts(px - 36, 900, 72, 740), { wash: P7.stone, fill: P7.stoneDk, fillOp: 80, tex: .5, ink: P7.ink, sw: 1 });
    paint(rectPts(px - 50, 880, 100, 40), { wash: P7.gold, ink: P7.ink, sw: .9 });
    paint(rectPts(px - 50, 1610, 100, 34), { wash: P7.gold, ink: P7.ink, sw: .9 });
    for (const yy of [1000, 1200, 1400]) inkLine([[px - 30, yy], [px + 30, yy]], .8, P7.stoneSh, 'inkfine', 0);
  }
  // the steps and the snow ledge
  boilSeed(key + ' steps');
  paint(rectPts(-300, 1640, W + 600, 50), { wash: P7.stone, fill: P7.stoneSh, fillOp: 60, tex: .4, ink: P7.ink, sw: 1 });
  paint([[-300, 1700], [1380, 1700], [1380, 2600], [-300, 2600]], { wash: P2.snow, fill: P2.snowDk, fillOp: 50, tex: .4, ink: P7.ink, sw: 1 });
  for (let i = 0; i < 5; i++) inkLine([[hash(i * 3.1) * 1080 - 60, 1780 + i * 60], [hash(i * 3.1) * 1080 + 80, 1770 + i * 60]], 1.6, P2.snowSh, 'inkfine', .5);
  if (red > 0) grade('dusk', red * .35);
}
// Kailash for the climb: kailashDay with Shiva's palace on the summit, a gold light round it
function kailashClimb(t, o = {}) {
  kailashDay(t, { ledgeY: o.ledgeY ?? 1700 });
  boilSeed('kc palace');
  glow(540, 650, 300, '#FFE6A0', .55);
  paint(rectPts(470, 640, 140, 70), { wash: P7.stone, ink: P7.ink, sw: .9 });
  paint([[455, 642], [540, 560], [625, 642]], { wash: P7.gold, fill: P7.goldDk, fillOp: 60, ink: P7.ink, sw: .9, curv: .3 });
  paint(rectPts(522, 668, 36, 42), { wash: P7.wood, ink: P7.ink, sw: .6 });
  inkLine([[540, 560], [540, 530]], 1, P7.ink, 'inkfine', 0); paint([[540, 530], [566, 540], [540, 550]], { wash: P7.red, ink: null });   // a flag
}

// ---------- the worlds (full-frame plates; sc scrolls them vertically, + moves the scenery down = flying up) ----------
function worldPlate(kind, t, sc = 0, key = 'wp') {
  boilSeed(key + kind);
  const Y = y => y + sc;
  if (kind === 'heaven') {   // the upper worlds: gold sky, cloud isles with pavilions
    paint(rectPts(-300, -300, W + 600, 2600), { wash: P7.heavHi, ink: null });
    glow(540, 700, 900, '#FFF2C8', .5);
    for (let i = 0; i < 7; i++) cloudPuff(hash(i * 3.7) * 1300 - 100, frac(hash(i * 1.9) + sc / 2600) * 2600 - 400, 110 + 60 * hash(i), key + 'hc' + i, 240);
    lokaIsle(260, Y(560) % 2400, 300, t, { key: key + 'i1' }); lokaIsle(820, Y(1260) % 2400, 340, t, { key: key + 'i2' });
  } else if (kind === 'vaikuntha') {   // Vishnu's world: deep blue, a milk ocean, gold isles, a lotus of light
    paint(rectPts(-300, -300, W + 600, 2600), { wash: P7.vaiHi, ink: null });
    paint(ellPts(540, 1000, 1000, 900, 30), { fill: P7.vaiMid, fillOp: 200, bleed: .3, tex: .4, ink: null });
    glow(540, Y(1500) % 2600, 600, P7.milk, .5);
    paint(ellPts(540, Y(1650) % 2600, 900, 160, 30), { wash: P7.milk, washOp: 230, ink: null });
    for (let i = 0; i < 14; i++) paint(starPts(hash(i * 2.3) * 1080, frac(hash(i * 6.7) + sc / 2400) * 2000, 6 + 6 * hash(i * 3.3), .4, 4), { wash: '#FFF6DA', ink: null });
    lokaIsle(300, Y(700) % 2400, 280, t, { key: key + 'vi' });
  } else if (kind === 'goloka') {   // Krishna's world: green pastures, a pale sky, cows
    paint(rectPts(-300, -300, W + 600, 2600), { wash: P7.golSky, ink: null });
    glow(800, 600, 500, '#FFF6DA', .4);
    for (const [cy, c, d] of [[1150, P7.golLt, P7.golHill], [1420, P7.golHill, P7.golHillDk], [1700, P7.golHillDk, P7.golHillDk]])
      paint(ellPts(540, Y(cy) + 500, 1300, 560, 30), { wash: c, fill: d, fillOp: 70, tex: .4, ink: P7.ink, sw: .8 });
    cow(250, Y(1300), 11, { boilKey: key + 'cw1', graze: .8, coat: 'dhavala' });
    cow(820, Y(1380), 12, { boilKey: key + 'cw2', flip: true, coat: 'kapila', eyes: 'happy' });
    cow(560, Y(1640), 9, { boilKey: key + 'cw3', calf: 1, hop: (Math.sin(t * 6) + 1) * .4 });
  } else if (kind === 'patala') {   // the underworlds: violet dark, glowing gems, naga hoods
    paint(rectPts(-300, -300, W + 600, 2600), { wash: P7.patHi, ink: null });
    paint(ellPts(540, 1100, 900, 1000, 30), { fill: P7.patMid, fillOp: 200, bleed: .3, tex: .4, ink: null });
    for (let i = 0; i < 18; i++) { const x = hash(i * 4.1) * 1080, y = frac(hash(i * 2.9) - sc / 2400) * 2000, c = i % 2 ? P7.patGem : P7.patGem2; glow(x, y, 40, c, .5); paint(starPts(x, y, 9, .5, 4), { wash: c, ink: null }); }
    for (let i = 0; i < 4; i++) {   // naga hoods rising from below
      const x = 120 + i * 280, y = frac(hash(i * 7.7) - sc / 2000) * 1800 + 300;
      paint([[x - 18, y + 300], [x - 22, y + 60], [x - 70, y + 10], [x - 60, y - 60], [x, y - 90], [x + 60, y - 60], [x + 70, y + 10], [x + 22, y + 60], [x + 18, y + 300]], { wash: P7.naga, ink: null, curv: .4 });
      for (const s of [-1, 1]) paint(ellPts(x + s * 22, y - 30, 7, 5, 8), { wash: P7.patGem2, ink: null });
    }
  } else if (kind === 'sea') {   // the waters: a dark sky, a heaving sea from y 1100
    paint(rectPts(-300, -300, W + 600, 2600), { wash: '#1A2440', ink: null });
    paint(rectPts(-300, Y(1100), W + 600, 2000), { wash: P7.sea, fill: P7.seaHi, fillOp: 90, tex: .4, ink: null });
    for (let i = 0; i < 7; i++) { const y = Y(1120 + i * 90), ph = t * 2 + i; inkLine(Array.from({ length: 12 }, (_, j) => [-100 + j * 110, y + Math.sin(ph + j * .9) * 14]), 2.4, i ? P7.seaLt : P7.foam, 'ink', .6); }
  }
}
// vertical speed lines over a plate (screen space), dir -1 up, 1 down, k 0..1
function speedLines(k, dir = -1, key = 'spd', col = '#FFFFFF') {
  if (k <= 0) return;
  boilSeed(key);
  for (let i = 0; i < 14; i++) { const x = hash(i * 2.7) * 1080, y = frac(hash(i * 5.1) - dir * T * 3) * 2200 - 140, l = 140 + 200 * hash(i * 1.3); inkLine([[x, y], [x, y + l]], 3 + 4 * hash(i), col, 'inkfine', 0); }
}
// a splash at (x, y) (the water line), s wide, age 0..1
function splash(x, y, s, age, key = 'splash') {
  if (age < 0 || age > 1.2) return;
  boilSeed(key);
  const k = clamp(age), up = Math.sin(Math.min(1, k * 1.6) * Math.PI), fade = 1 - clamp((age - .7) / .5);
  for (const sd of [-1, 1]) paint([[x + sd * s * .1, y], [x + sd * s * (.3 + .2 * k), y - s * .9 * up], [x + sd * s * (.5 + .2 * k), y - s * .5 * up], [x + sd * s * .45, y]],
    { wash: P7.foam, washOp: 230 * fade, fill: P7.seaLt, fillOp: 80, ink: P7.ink, sw: .8, curv: .5 });
  for (let i = 0; i < 9; i++) { const a = -Math.PI * (.15 + .7 * hash(i * 3.3)), r = s * (.3 + 1.1 * k) * (.6 + .4 * hash(i)), dy = 400 * k * k;
    paint(ellPts(x + Math.cos(a) * r, y + Math.sin(a) * r + dy, 9 + 6 * hash(i * 2), 11 + 7 * hash(i * 2), 8), { wash: P7.foam, washOp: 230 * fade, ink: null }); }
}
// kicked-up snow: soft white puffs that swell and fade (no outline), age 0..1
function snowPuff(x, y, s, age, key = 'sp') {
  if (age < 0 || age > 1) return;
  boilSeed(key);
  const k = easeOut(age), a = 230 * (1 - age);
  for (let i = 0; i < 4; i++) { const dx = (i - 1.5) * s * .45 * (1 + k), dy = -s * .25 * k * (1 + hash(i)); paint(ellPts(x + dx, y + dy, s * (.35 + .35 * k), s * (.28 + .25 * k), 14), { wash: i % 2 ? '#FFFFFF' : '#E4E8F4', washOp: a, ink: null }); }
}
// gold slow-motion air: a warm void with soft rays
function goldVoid(t, cx = 540, cy = 1000) {
  sunburst(t, cx, cy, ['#5A3A1A', '#C8862E', '#FFD27A']);
}
// the tusk tumbling: balTusk at (x, y), size u (≈ its length / 1.1), turned a
function tuskAt(x, y, u, a, key = 'tusk') {
  boilSeed(key); push(); translate(x, y); rotate(a); balTusk(u, clamp(u / 20, .4, 2)); pop();
}
