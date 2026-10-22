// sindoor_props.js: sets, palettes and props for sindoor.js (ad 29, "Why is HANUMAN JI covered in SINDOOR?"). Loaded
// before it; everything here is a pure function of its arguments (and T for boil).
//   SD, TK                       palettes (TK: the card's brand colours, as in ads 21–24)
//   COURT1, COURT2               the courtiers' colours on narada()'s rig
//   tealGround, chamber, peachGround, storeroom, court, mandir    sets
//   mirror, sindoorBox, matka, powder, powderCover, footprint, throne, diya, templeBell, garland, katori    props
//   dealCard, dealStrike         the 15K Family Deal card (Books 1–3, ₹350, till 25 Oct)
const SD = {
  ink: '#2B2233', cream: '#FFF5E2',
  teal: '#2E5F5A', tealDk: '#1E4440', tealLt: '#4E847C',
  sin: '#EE5A24', sinDk: '#BC3812', sinLt: '#FF8E4E', sinPale: '#FFB98A',
  lilac: '#E6D2E6', lilacDk: '#C7AECB', lilacLt: '#F4EAF2', sill: '#F2E2C8', sky: '#CFE6F0', skyLo: '#FFF0D6', curtain: '#E79AB0', curtainDk: '#C2708C',
  peach: '#FBE0CF', peachDk: '#F2C2A6', peachLt: '#FFF1E6',
  ochre: '#E8B86A', ochreDk: '#C8924A', ochreLt: '#F6D498', clay: '#B8643A', clayDk: '#8A4426', clayLt: '#D88A5A', floor: '#D8A870', floorDk: '#B8864E',
  stone: '#F0C8A8', stoneDk: '#D6A282', stoneLt: '#FBE2CC', pillar: '#FFF0DC', pillarDk: '#E6CDA8', marble: '#F6EADA', marbleDk: '#E2D0B8',
  gold: '#F2C230', goldDk: '#B88A1C', goldLt: '#FFE69A', red: '#B8202E', redDk: '#861422', velvet: '#8E1E3A',
  dusk: '#5A3A4E', duskDk: '#3A2436', duskLt: '#7E5466', niche: '#2A1A26', nicheLt: '#4A2E3A', lamp: '#FFC24A', flame: '#FFE08A',
  marigold: '#F39A2E', marigoldDk: '#D0701A', leaf: '#5E9A5A', silver: '#DCDCE4', silverDk: '#A6A6B4',
};
const TK = {
  ink: '#2B2233', cream: '#FFF5E2',
  petal: '#F4A6B8', petalDk: '#E0708C', marigold: '#F39A2E', yellow: '#FFD45A', leaf: '#5E9A6A',
  gold: '#EDB43C', goldLt: '#FFE39A', goldDk: '#B67D1C',
  rkOrange: '#F15A24', peach: '#FBE0CF', peachLt: '#FFF1E6', brown: '#3A2418', grey: '#6B5A50', teal: '#2E5F5A',
};
// two courtiers: an elder minister and a younger one
const COURT1 = { ...NRD_SAGE, dhoti: '#5E4E9E', dhotiDk: '#3E327A', border: '#EDB43C', shawl: '#F2E3C0' };
const COURT2 = { skin: '#E8B48A', skinDk: '#C68A60', skinLt: '#FAD2AE', dhoti: '#2E7A6A', dhotiDk: '#1E5A4C', border: '#EDB43C', hair: '#3A2E3E', hairLt: '#5E5266', shawl: '#F2C230', shawlDk: '#C89A1E' };
// a minister's turban (hat hook, head space, topknot: false)
function turbanHat(u, sw) {
  boilSeed('turban');
  paint(U([[-3.1, -21.6], [-3.3, -23.4], [-2.4, -24.9], [0, -25.6], [2.4, -24.9], [3.3, -23.4], [3.1, -21.6], [0, -22.3]], u), { wash: '#F2E3C0', fill: '#D8C08A', fillOp: 50, tex: .4, ink: NRD.ink, sw: sw * .8, curv: .4 });
  for (const k of [-.5, .3]) inkLine(U([[-2.9, -22.7 + k], [0, -24 + k], [2.9, -22.7 + k]], u), sw * .5, '#C8A86A', 'inkfine', .5);
  paint(ellPts(0, -23.2 * u, .36 * u, .42 * u, 10), { wash: '#D8283A', ink: NRD.ink, sw: sw * .4 });
}
function crownHat(u, sw) {
  boilSeed('crownhat');
  paint(U([[-3.0, -22.5], [-3.1, -24.4], [-2.2, -23.8], [-1.5, -25.4], [-.7, -24.2], [0, -26.0], [.7, -24.2], [1.5, -25.4], [2.2, -23.8], [3.1, -24.4], [3.0, -22.5], [0, -22.9]], u),
    { wash: '#EDB43C', fill: '#B67D1C', fillOp: 50, tex: .4, ink: NRD.ink, sw: sw * .8, curv: .1 });
  paint(ellPts(0, -23.6 * u, .38 * u, .44 * u, 10), { wash: '#D8283A', ink: NRD.ink, sw: sw * .4 });
}

// ---------------- sets ----------------
function flatGround(c, cDk, key, t) {
  boilSeed(key);
  paint(rectPts(-80, -80, W + 160, H + 160), { wash: c, ink: null });
  paint(ellPts(W / 2, H * .55, W * .9, H * .55, 30), { fill: cDk, fillOp: 60, bleed: .3, tex: .4, border: .2, ink: null });
}
function tealGround(t) {
  boilSeed('teal');
  paint(rectPts(-80, -200, W + 160, H + 500), { wash: SD.teal, ink: null });
  paint(ellPts(540, 1150, 700, 900, 30), { fill: SD.tealLt, fillOp: 90, bleed: .3, tex: .4, border: .2, ink: null });
  boilSeed('tealmotes');
  for (let i = 0; i < 14; i++) {   // drifting motes of sindoor
    const x = 60 + hash(i * 2.7) * 960 + 20 * Math.sin(t * .7 + i), y = 1700 - frac(hash(i * 5.3) + t * (.03 + .015 * hash(i))) * 1500;
    paint(ellPts(x, y, 5 + 4 * hash(i * 9), 5 + 4 * hash(i * 9), 8), { wash: SD.sinLt, washOp: 150, ink: null });
  }
}
function peachGround(t) {
  boilSeed('peach');
  paint(rectPts(-80, -200, W + 160, H + 500), { wash: SD.peach, ink: null });
  paint(ellPts(540, 1100, 650, 800, 30), { fill: SD.peachLt, fillOp: 150, bleed: .3, tex: .4, border: .2, ink: null });
  boilSeed('peachpetals');
  for (let i = 0; i < 8; i++) {
    const x = 60 + hash(i * 3.3) * 960 + 30 * Math.sin(t * .9 + i), y = frac(hash(i * 7.1) + t * (.035 + .02 * hash(i))) * (H + 80) - 40, r = t * .8 + i;
    paint([[x + Math.cos(r) * 15, y + Math.sin(r) * 15], [x + Math.cos(r + 1.6) * 7, y + Math.sin(r + 1.6) * 7], [x - Math.cos(r) * 15, y - Math.sin(r) * 15], [x + Math.cos(r - 1.6) * 7, y + Math.sin(r - 1.6) * 7]], { wash: i % 2 ? TK.marigold : TK.petal, washOp: 200, ink: null, curv: .5 });
  }
}
// Sita's chamber, morning: a lilac wall, a tall window with light, a curtain, a doorway on the right, a floor
function chamber(t) {
  boilSeed('chwall');
  paint(rectPts(-80, -80, W + 160, 1560), { wash: SD.lilac, ink: null });
  paint(ellPts(300, 900, 520, 700, 26), { fill: SD.lilacLt, fillOp: 140, bleed: .3, tex: .5, border: .3, ink: null });
  boilSeed('chwindow');   // the window, top left
  paint(rrPts(90, 430, 300, 520, 150), { wash: SD.sky, ink: SD.ink, sw: 1.4 });
  paint(rrPts(110, 450, 260, 480, 130), { fill: SD.skyLo, fillOp: 160, bleed: .2, tex: .4, ink: null });
  for (const x of [190, 290]) inkLine([[x, 445], [x, 945]], 1.6, SD.pillarDk, 'ink', 0);
  paint(rectPts(70, 940, 340, 30), { wash: SD.sill, ink: SD.ink, sw: 1.1 });
  glow(240, 690, 260, '#FFE9B0', 45);
  boilSeed('chcurtain');
  const cs = Math.sin(t * .8) * 8;
  paint([[60, 410], [140, 410], [120 + cs, 700], [150 + cs, 1000], [60, 1010]], { wash: SD.curtain, fill: SD.curtainDk, fillOp: 60, tex: .5, ink: SD.ink, sw: 1, curv: .4 });
  boilSeed('chdoor');   // the doorway, right edge
  paint([[800, 1560], [800, 760], [830, 690], [900, 650], [970, 690], [1000, 760], [1000, 1560]], { wash: SD.lilacDk, ink: null, curv: .2 });
  paint([[830, 1560], [830, 780], [855, 725], [900, 700], [945, 725], [970, 780], [970, 1560]], { wash: '#B898BC', fill: '#9A7AA0', fillOp: 80, tex: .4, ink: SD.ink, sw: 1.2, curv: .2 });
  boilSeed('chfloor');
  paint(rectPts(-80, 1540, W + 160, 500), { wash: SD.marble, ink: null });
  inkLine([[-40, 1545], [1120, 1545]], 1.6, SD.ink, 'ink', 0);
  paint(ellPts(500, 1700, 600, 120, 24), { fill: SD.marbleDk, fillOp: 80, bleed: .3, tex: .4, ink: null });
}
// the doorway's near jamb, drawn over Hanuman as he peeks
function chamberJamb() {
  boilSeed('chjamb');
  paint([[800, 1560], [800, 760], [830, 690], [842, 700], [830, 780], [830, 1560]], { wash: SD.lilacDk, ink: SD.ink, sw: 1.2, curv: .2 });
}
// the storeroom: an ochre wall with niches, a beam, a clay floor
function storeroom(t) {
  boilSeed('stwall');
  paint(rectPts(-80, -80, W + 160, 1580), { wash: SD.ochre, ink: null });
  paint(ellPts(540, 950, 620, 700, 26), { fill: SD.ochreLt, fillOp: 130, bleed: .3, tex: .5, border: .3, ink: null });
  boilSeed('stniche');
  for (const x of [170, 910]) { paint(rrPts(x - 90, 560, 180, 300, 90), { wash: SD.ochreDk, ink: SD.ink, sw: 1.1 }); }
  boilSeed('stbeam');
  paint(rectPts(-80, 420, W + 160, 46), { wash: SD.clayDk, ink: SD.ink, sw: 1.2 });
  boilSeed('stfloor');
  paint(rectPts(-80, 1560, W + 160, 500), { wash: SD.floor, ink: null });
  inkLine([[-40, 1565], [1120, 1565]], 1.6, SD.ink, 'ink', 0);
  paint(ellPts(540, 1720, 620, 120, 24), { fill: SD.floorDk, fillOp: 80, bleed: .3, tex: .4, ink: null });
  // the sindoor dusted on the floor, growing as he pours
}
function floorDust(k, key = 'dust') {
  if (k <= 0) return;
  boilSeed(key);
  paint(ellPts(540, 1610, 330 * k, 46 * k, 22, 6), { wash: SD.sin, washOp: 200, ink: null });
  for (let i = 0; i < 7; i++) paint(ellPts(540 + (hash(i * 4.1) - .5) * 700 * k, 1600 + hash(i * 2.2) * 60, 30 * k, 10 * k, 10), { wash: SD.sinLt, washOp: 180, ink: null });
}
// Ram's court: sandstone wall, scalloped arches, pillars, a raised dais, a cream floor
function court(t) {
  boilSeed('ctwall');
  paint(rectPts(-80, -300, W + 160, 1640), { wash: SD.stone, ink: null });
  paint(ellPts(540, 900, 600, 600, 26), { fill: SD.stoneLt, fillOp: 140, bleed: .3, tex: .5, border: .3, ink: null });
  boilSeed('ctarch');   // a big scalloped arch behind the throne
  const arch = [];
  for (let i = 0; i <= 24; i++) { const a = Math.PI + i / 24 * Math.PI; arch.push([540 + Math.cos(a) * 340, 900 + Math.sin(a) * 380]); }
  paint([[200, 1330], ...arch, [880, 1330]], { wash: SD.stoneDk, ink: null, curv: .3 });
  inkLine([[200, 1330], ...arch, [880, 1330]], 2, SD.ink, 'ink', .3);
  boilSeed('ctpillars');
  for (const x of [60, 1020]) {
    paint(rectPts(x - 55, 380, 110, 950), { wash: SD.pillar, fill: SD.pillarDk, fillOp: 80, tex: .5, ink: SD.ink, sw: 1.3 });
    for (const y of [430, 1300]) paint(rectPts(x - 70, y - 20, 140, 40), { wash: SD.gold, ink: SD.ink, sw: 1.1 });
  }
  boilSeed('ctgarland');   // a marigold toran across the top
  for (let i = 0; i < 12; i++) { const x = 30 + i * 92, y = 470 + 40 * Math.sin(i / 11 * Math.PI); paint(ellPts(x, y, 20, 20, 10), { wash: i % 2 ? SD.marigold : SD.gold, ink: SD.ink, sw: .6 }); }
  boilSeed('ctfloor');
  paint(rectPts(-80, 1320, W + 160, 1000), { wash: SD.marble, ink: null });
  inkLine([[-40, 1322], [1120, 1322]], 1.6, SD.ink, 'ink', 0);
  for (let i = 0; i < 6; i++) inkLine([[540 + (i - 2.5) * 140, 1330], [540 + (i - 2.5) * 360, 2000]], .8, SD.marbleDk, 'inkfine', 0);   // floor seams
  for (const y of [1460, 1660, 1900]) inkLine([[-40, y], [1120, y]], .8, SD.marbleDk, 'inkfine', 0);
}
// the dais and the gold throne, centred on x; y is the seat (Ram sits on it)
function throne(x, y, t) {
  boilSeed('dais');
  paint(rectPts(x - 260, y + 30, 520, 80), { wash: SD.stoneDk, ink: SD.ink, sw: 1.2 });
  paint(rectPts(x - 300, y + 105, 600, 70), { wash: SD.stone, ink: SD.ink, sw: 1.2 });
  boilSeed('throneback');
  paint([[x - 170, y + 30], [x - 180, y - 250], [x - 120, y - 380], [x, y - 430], [x + 120, y - 380], [x + 180, y - 250], [x + 170, y + 30]], { wash: SD.gold, fill: SD.goldDk, fillOp: 70, tex: .5, ink: SD.ink, sw: 1.4, curv: .4 });
  paint([[x - 130, y + 20], [x - 140, y - 230], [x - 90, y - 330], [x, y - 365], [x + 90, y - 330], [x + 140, y - 230], [x + 130, y + 20]], { wash: SD.velvet, ink: SD.ink, sw: 1, curv: .4 });
  paint(ellPts(x, y - 395, 22, 26, 10), { wash: '#D8283A', ink: SD.ink, sw: .8 });
  boilSeed('throneseat');
  paint(rrPts(x - 200, y - 10, 400, 50, 18), { wash: SD.gold, fill: SD.goldDk, fillOp: 60, tex: .5, ink: SD.ink, sw: 1.3 });
  for (const s of [-1, 1]) paint(ellPts(x + s * 205, y - 30, 30, 34, 12), { wash: SD.gold, ink: SD.ink, sw: 1.1 });   // arm lions' heads, simplified
}
// the mandir at dusk: dark stone, a lit niche, a ledge, bells
function mandir(t) {
  boilSeed('mdwall');
  paint(rectPts(-80, -80, W + 160, H + 160), { wash: SD.dusk, ink: null });
  paint(ellPts(540, 1050, 640, 760, 26), { fill: SD.duskLt, fillOp: 120, bleed: .3, tex: .5, border: .3, ink: null });
  boilSeed('mdniche');
  paint([[190, 1500], [190, 900], [230, 760], [330, 650], [440, 590], [540, 570], [640, 590], [750, 650], [850, 760], [890, 900], [890, 1500]], { wash: SD.niche, fill: SD.nicheLt, fillOp: 90, tex: .4, ink: SD.ink, sw: 1.6, curv: .4 });
  inkLine([[170, 1500], [170, 890], [215, 740], [320, 625], [435, 565], [540, 545], [645, 565], [760, 625], [865, 740], [910, 890], [910, 1500]], 6, SD.gold, 'ink', .4);
  glow(540, 1080, 420, '#FFB050', 70);
}
function mandirLedge(t) {
  boilSeed('mdledge');
  paint(rectPts(-80, 1480, W + 160, 60), { wash: SD.stoneDk, ink: SD.ink, sw: 1.3 });
  paint(rectPts(-80, 1535, W + 160, 600), { wash: SD.duskDk, ink: null });
}

// ---------------- props ----------------
// a stand mirror: an oval gold frame on a post, (x, y) the floor under it
function mirror(x, y, t) {
  boilSeed('mirror');
  paint(rectPts(x - 10, y - 520, 20, 520), { wash: SD.goldDk, ink: SD.ink, sw: 1 });
  paint(ellPts(x, y - 8, 90, 18, 14), { wash: SD.goldDk, ink: SD.ink, sw: 1 });
  paint(ellPts(x, y - 640, 120, 160, 26), { wash: SD.gold, fill: SD.goldDk, fillOp: 60, tex: .4, ink: SD.ink, sw: 1.3 });
  paint(ellPts(x, y - 640, 98, 138, 24), { wash: '#DCEAF2', ink: SD.ink, sw: .9 });
  paint([[x - 60, y - 720], [x - 20, y - 760], [x + 30, y - 600], [x - 10, y - 560]], { wash: '#FFFFFF', washOp: 120, ink: null });
}
// the little silver sindoor box, open, red powder inside; held at (0, 0) in a hand hook
function sindoorBox(u, sw) {
  paint(ellPts(0, .3 * u, .95 * u, .7 * u, 14), { wash: SD.silver, fill: SD.silverDk, fillOp: 60, tex: .4, ink: SD.ink, sw: sw * .6 });
  paint(ellPts(0, -.05 * u, .75 * u, .32 * u, 12), { wash: SD.sin, ink: SD.ink, sw: sw * .4 });
  paint(U([[-.9, -.1], [-1.3, -1.2], [-.4, -1.0]], u), { wash: SD.silver, ink: SD.ink, sw: sw * .5, curv: .3 });   // the lid
}
// a clay matka heaped with sindoor; (x, y) the floor under it, s its size; tip radians tilts it (about its centre)
function matka(x, y, s, tip = 0, heap = 1, key = 'matka') {
  boilSeed(key);
  push(); translate(x, y - s * .9); rotate(tip);
  paint(ellPts(0, 0, s, s * .88, 24), { wash: SD.clay, fill: SD.clayDk, fillOp: 70, tex: .5, ink: SD.ink, sw: 1.2 });
  paint(ellPts(-s * .35, -s * .3, s * .3, s * .22, 10, 0, -.4), { wash: SD.clayLt, washOp: 160, ink: null });
  paint(rrPts(-s * .55, -s * 1.02, s * 1.1, s * .26, s * .1), { wash: SD.clayDk, ink: SD.ink, sw: 1.1 });
  inkLine([[-s * .95, s * .05], [0, s * .15], [s * .95, s * .05]], 1.1, SD.goldDk, 'ink', .5);
  if (heap > 0) paint([[-s * .5, -s * .98], [-s * .3, -s * (1.0 + .4 * heap)], [0, -s * (1.0 + .55 * heap)], [s * .3, -s * (1.0 + .4 * heap)], [s * .5, -s * .98]], { wash: SD.sin, fill: SD.sinDk, fillOp: 40, tex: .4, ink: SD.ink, sw: 1, curv: .5 });
  pop();
}
// a cloud of sindoor powder at (x, y) of radius r: soft blobs that billow out with age and thin away by life
function powder(x, y, r, age, key = 'powder', life = 1.6, n = 12) {
  if (age < 0 || age > life) return;
  const k = easeOut(clamp(age / (life * .5))), fade = 1 - seg(age, life * .45, life);
  boilSeed(key);
  for (let i = 0; i < n; i++) {
    const a = hash(i * 3.7) * TAU, d = r * (.2 + .8 * hash(i * 1.9)) * k, rr = r * (.25 + .3 * hash(i * 5.1)) * (.5 + .7 * k);
    paint(ellPts(x + Math.cos(a) * d, y + Math.sin(a) * d * .8 - age * 30, rr, rr * .85, 14, rr * .08), { fill: i % 3 ? SD.sin : SD.sinLt, fillOp: 190 * fade, bleed: .2, tex: .5, border: .3, ink: null });
  }
}
// a full-frame cover of sindoor (screen space): k 0..1 grows the blobs until they cover everything
function powderCover(k, key = 'cover') {
  if (k <= 0) return;
  boilSeed(key);
  for (let i = 0; i < 22; i++) {
    const x = (i % 5) * 270 + hash(i * 2.3) * 120 - 30, y = Math.floor(i / 5) * 420 + hash(i * 4.4) * 160 + 40, r = 380 * clamp(k * (1 + .6 * hash(i * 6.1)));
    paint(ellPts(x, y, r, r * .9, 18, r * .05), { wash: i % 4 ? SD.sin : SD.sinLt, ink: null });
  }
}
// an orange footprint on the floor at (x, y), s its length
function footprint(x, y, s, flip = 1, a = 1) {
  paint(ellPts(x, y, s * .32, s * .5, 12, 0, flip * .1), { wash: SD.sin, washOp: 210 * a, ink: null });
  for (let i = 0; i < 4; i++) paint(ellPts(x + (i - 1.5) * s * .18, y - s * .62, s * .09, s * .09, 6), { wash: SD.sin, washOp: 210 * a, ink: null });
}
function diya(x, y, s, t, key = 'diya') {
  boilSeed(key);
  glow(x, y - s * 1.2, s * 4, '#FFB050', 90);
  paint([[x - s, y - s * .35], [x + s, y - s * .35], [x + s * .65, y + s * .3], [x - s * .65, y + s * .3]], { wash: SD.clay, ink: SD.ink, sw: .9, curv: .5 });
  const f = 1 + .12 * Math.sin(t * 13 + x);
  paint([[x, y - s * (1.5 * f + .3)], [x + s * .28, y - s * .55], [x, y - s * .35], [x - s * .28, y - s * .55]], { wash: SD.flame, ink: null, curv: .6 });
  paint(ellPts(x, y - s * .65, s * .12, s * .22, 6), { wash: '#FFFFFF', ink: null });
}
function templeBell(x, y, s, sw, key = 'bell') {
  boilSeed(key);
  inkLine([[x, y - 400], [x + Math.sin(sw) * 6, y - s]], 1.2, SD.goldDk, 'ink', 0);
  push(); translate(x, y - s); rotate(sw * .3);
  paint([[-s * .55, s * 1.1], [-s * .45, s * .3], [-s * .2, 0], [s * .2, 0], [s * .45, s * .3], [s * .55, s * 1.1]], { wash: SD.gold, fill: SD.goldDk, fillOp: 60, tex: .4, ink: SD.ink, sw: 1, curv: .4 });
  paint(ellPts(0, s * 1.2, s * .15, s * .15, 8), { wash: SD.goldDk, ink: SD.ink, sw: .6 });
  pop();
}
// a marigold garland as beads along a path (world points)
function garland(pts, r, key = 'garland') {
  boilSeed(key);
  through(pts).forEach((p, i) => { if (i % 2 === 0) paint(ellPts(p[0], p[1], r, r, 10, r * .1), { wash: i % 4 ? SD.marigold : SD.marigoldDk, ink: SD.ink, sw: .6 }); });
}
// the katori of chola (sindoor in chameli oil): a brass bowl on the ledge
function katori(x, y, s, key = 'katori') {
  boilSeed(key);
  paint([[x - s, y - s * .3], [x + s, y - s * .3], [x + s * .7, y + s * .35], [x - s * .7, y + s * .35]], { wash: SD.gold, fill: SD.goldDk, fillOp: 60, ink: SD.ink, sw: 1, curv: .5 });
  paint(ellPts(x, y - s * .3, s * .92, s * .22, 14), { wash: SD.sinDk, ink: SD.ink, sw: .7 });
  paint(ellPts(x - s * .3, y - s * .36, s * .25, s * .07, 8), { wash: SD.sinPale, washOp: 200, ink: null });
}

// ---------------- the card ----------------
function dealCard(t, C) {
  boilSeed('cardbg');
  paint(rectPts(-60, -60, W + 120, H + 120), { wash: TK.peach, ink: null });
  boilSeed('cardpetals');
  for (let i = 0; i < 9; i++) {
    const x = 60 + hash(i * 3.3) * 960 + 30 * Math.sin(t * .9 + i), y = frac(hash(i * 7.1) + t * (.035 + .02 * hash(i))) * (H + 80) - 40, r = t * .8 + i;
    paint([[x + Math.cos(r) * 15, y + Math.sin(r) * 15], [x + Math.cos(r + 1.6) * 7, y + Math.sin(r + 1.6) * 7], [x - Math.cos(r) * 15, y - Math.sin(r) * 15], [x + Math.cos(r - 1.6) * 7, y + Math.sin(r - 1.6) * 7]], { wash: i % 2 ? TK.marigold : TK.petal, washOp: 200, ink: null, curv: .5 });
  }
  const X = 470, pk = t0 => Math.max(0, t - t0) * 5, br = Math.sin(t * 1.3) * .008;
  if (t > C.logo) picture(PICS.logo, X, 500, 118, 118, { pop: pk(C.logo) });
  if (t > C.cap) {
    letter('15K FAMILY DEAL', X, 618, 74, TK.teal, { screen: true, font: '74px Marcellus', ink: false, pop: pk(C.cap), maxW: 860 });
    letter('our thank-you to all of YOU', X, 688, 34, TK.grey, { screen: true, font: '500 34px Poppins', ink: false, pop: pk(C.cap + .15), maxW: 860 });
  }
  if (t > C.covers) [['book1', -1], ['book3', 1], ['book2', 0]].forEach(([b, i], j) => {
    const a = Math.max(0, t - C.covers - j * .12);
    if (a > 0) picture(PICS[b], X + i * 205, 905 + Math.abs(i) * 28, 250, 250, { rot: i * .1 + br, pop: a * 5, r: 10, shadow: 22 });
  });
  if (t > C.price) {
    letter('Books 1–3 · Set of 3', X, 1112, 40, TK.brown, { screen: true, font: '700 40px Poppins', ink: false, maxW: 880, pop: pk(C.price) });
    letter('₹500', X - 120, 1186, 56, TK.grey, { screen: true, font: '500 56px Poppins', ink: false, pop: pk(C.price) });
    const k = backOut(clamp(pk(C.strike - .1) * .7));
    if (t > C.strike) letter('₹350', X + 95, 1182, 88 * (1 + .04 * pulse(t, 4)), TK.rkOrange, { screen: true, font: `700 ${88 * k}px Poppins`, ink: false, pop: pk(C.strike) });
  }
  if (t > C.dead) letter('Only till 25 Oct, midnight', X, 1262, 40, TK.teal, { screen: true, font: '700 40px Poppins', ink: false, maxW: 860, pop: pk(C.dead) });
  if (t > C.pill) {
    const k = backOut(clamp(pk(C.pill))) * (1 + .03 * pulse(t, 4));
    boilSeed('pill');
    push(); translate(X, 1350); scale(k); paint(rrPts(-270, -48, 540, 96, 48), { wash: TK.rkOrange, ink: null }); pop();
    letter('Comment FAMILY', X, 1352, 54, TK.cream, { screen: true, font: '700 52px Poppins', ink: false, pop: pk(C.pill) });
  }
  if (t > C.sub) letter("we'll DM you the deal · or tap the link in bio", X, 1428, 31, TK.brown, { screen: true, font: '500 31px Poppins', ink: false, maxW: 860, pop: pk(C.sub) });
  if (t > C.follow) letter('Follow @therishikatha', X, 1478, 31, TK.grey, { screen: true, font: '700 31px Poppins', ink: false, maxW: 860, pop: pk(C.follow) });
}
function dealStrike(t, C) {
  if (t < C.strike) return;
  const k = easeOut(seg(t, C.strike, C.strike + .25));
  boilSeed('strike');
  inkLine([[470 - 185, 1196], [lerp(470 - 185, 470 - 55, k), lerp(1196, 1172, k)]], 6, TK.rkOrange, 'ink', 0);
}
