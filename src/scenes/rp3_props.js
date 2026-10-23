// rp3_props.js: sets, props and the extra cast for rp3.js (Ramayan Part 3, "The King's Curse"). Loaded after
// src/ramayan.js and src/ramayan_sets.js (P1, tree, bush, hut, chamber, notes, tears, arrowAt). Pure functions of their
// arguments (and T for boil).
//   P3                                   the palette
//   ayodhyaGate, rainNight, rain, bedroom    sets
//   pot, cradle                          props
//   youngKing, sumantra, ascetic, blindFather, blindMother, kausalya     the cast
const P3 = {
  ink: '#2B2233', cream: '#FFF5E2', gold: '#F5C542',
  dayHi: '#9CC3E6', dayLo: '#FCE3BE', wall: '#E8C890', wallDk: '#B8945A', road: '#D8B488', roadDk: '#B8926A', duskHi: '#E2865A', duskLo: '#F7C98E',
  nHi: '#0E1A2E', nLo: '#22344E', nLeaf: '#16302A', nLeafDk: '#0E221E', nWater: '#1E4258', nWaterLt: '#4E7E98', rainC: '#8EB4D0',
  bed: '#8A2A44', bedDk: '#5E1A30', lamp: '#FFC870',
};

// ---------- sets ----------
// Ayodhya's gate by day (dusk 0..1 warms and dims it): the city wall with its arch, the road out to the right
function ayodhyaGate(t, key = 'ag', dusk = 0) {
  const D = (a, b) => mixCol(a, b, dusk);
  boilSeed(key + 'sky');
  paint(rectPts(-600, -600, W + 1200, 2200), { wash: D(P3.dayHi, P3.duskHi), ink: null });
  paint(ellPts(540, 1050, 1200, 420, 26), { fill: D(P3.dayLo, P3.duskLo), fillOp: 220, bleed: .3, tex: .4, ink: null });
  boilSeed(key + 'wall');
  paint([[-600, 1400], [-600, 820], [420, 820], [420, 1400]], { wash: D(P3.wall, '#C8946A'), fill: P3.wallDk, fillOp: 50, tex: .5, ink: P3.ink, sw: 1 });
  for (let i = 0; i < 9; i++) paint(rectPts(-560 + i * 110, 770, 60, 60), { wash: D(P3.wall, '#C8946A'), ink: P3.ink, sw: .8 });
  paint([[40, 1400], [40, 1060], [160, 940], [280, 1060], [280, 1400]], { wash: '#5A3A28', ink: P3.ink, sw: 1, curv: .35 });   // the arch
  paint([[-80, 820], [-80, 520], [0, 440], [80, 520], [80, 820]], { wash: D('#F2D29A', '#D8A87A'), fill: P3.wallDk, fillOp: 40, ink: P3.ink, sw: 1, curv: .2 });
  inkLine([[0, 440], [0, 360]], 1.6, P3.ink, 'inkfine', 0); paint([[0, 360], [70 + Math.sin(t * 3) * 8, 378], [0, 396]], { wash: '#E8742A', ink: P3.ink, sw: .6, curv: .3 });
  boilSeed(key + 'road');
  paint([[-600, 1380], [W + 600, 1360], [W + 600, 2600], [-600, 2600]], { wash: D(P3.road, '#B88A62'), fill: P3.roadDk, fillOp: 50, tex: .5, ink: P3.ink, sw: .9 });
  tree(1180, 1400, 620, key + 't', Math.sin(t * .8) * .2);
}
// a rainy night by the Sarayu: dark forest, the river, reeds; the rain on top (call rain() last)
function rainNight(t, key = 'rn', o = {}) {
  boilSeed(key + 'sky');
  paint(rectPts(-600, -600, W + 1200, 2200), { wash: P3.nHi, ink: null });
  paint(ellPts(540, 1100, 1000, 500, 24), { fill: P3.nLo, fillOp: 200, bleed: .3, tex: .4, ink: null });
  boilSeed(key + 'far');
  for (let i = 0; i < 9; i++) { const x = -200 + i * 180 + 50 * hash(i * 3.1), r = 120 + 60 * hash(i * 5.7); paint(ellPts(x, 1180 - r * .4, r, r * .9, 16, 3), { wash: i % 2 ? P3.nLeaf : P3.nLeafDk, ink: null }); }
  boilSeed(key + 'water');
  paint(rectPts(-600, 1250, W + 1200, 300), { wash: P3.nWater, ink: null });
  for (let i = 0; i < 10; i++) { const y = 1280 + hash(i * 2.3) * 240, x = frac(hash(i * 7.7) + t * .03) * 1500 - 200; inkLine([[x, y], [x + 80, y]], 1.4, P3.nWaterLt, 'inkfine', 0); }
  boilSeed(key + 'bank');
  paint(rectPts(-600, 1530, W + 1200, 1100), { wash: '#1E3A2E', ink: null });
  paint(ellPts(540, 1800, 900, 200, 22), { fill: '#142A20', fillOp: 90, bleed: .3, tex: .5, ink: null });
  inkLine([[-100, 1530], [300, 1515], [800, 1540], [1200, 1520]], .9, P3.ink, 'ink', .5);
  boilSeed(key + 'reeds');
  for (let i = 0; i < 16; i++) { const x = -60 + i * 80 + 30 * hash(i * 1.7), h = 90 + 80 * hash(i * 4.1), s = Math.sin(t * 1.5 + i) * 8; inkLine([[x, 1545], [x + s * .5, 1545 - h * .6], [x + s, 1545 - h]], 2, i % 2 ? '#3E6A48' : '#2A5038', 'ink', .5); }
}
function rain(t, key = 'rr', k = 1) {
  boilSeed(key);
  for (let i = 0; i < 44; i++) { const x = hash(i * 3.7) * 1400 - 160, y = frac(hash(i * 5.1) + t * 1.6) * 2300 - 200; inkLine([[x, y], [x - 14, y + 70]], 1.2, P3.rainC, 'inkfine', 0); }
}
// the king's bedroom at night: dark walls, a bed (its head on the left), one lamp (flame 0..1: out at 0)
function bedroom(t, key = 'bd', flame = 1) {
  chamber(t, flame, key);
  boilSeed(key + 'bed');
  paint(rrPts(60, 1560, 960, 120, 30), { wash: P3.bed, fill: P3.bedDk, fillOp: 50, tex: .5, ink: P3.ink, sw: 1 });
  paint(rrPts(40, 1430, 60, 300, 20), { wash: '#C8A040', ink: P3.ink, sw: 1 });
  paint(rrPts(980, 1500, 60, 230, 20), { wash: '#C8A040', ink: P3.ink, sw: 1 });
  paint(ellPts(220, 1550, 120, 40, 16), { wash: '#F2E2C8', ink: P3.ink, sw: .8 });
  const lx = 150, ly = 1380;
  boilSeed(key + 'lamp');
  paint(rectPts(lx - 10, ly, 20, 140), { wash: '#B8862E', ink: P3.ink, sw: .7 });
  paint(ellPts(lx, ly, 50, 18, 14), { wash: '#B8862E', ink: P3.ink, sw: .8 });
  if (flame > .02) { const f = (.85 + .15 * Math.sin(t * 13) * Math.sin(t * 7.3)) * flame; glow(lx, ly - 30, 420 * f, P3.lamp, .5 * flame); paint([[lx, ly - 70 * f], [lx + 13 * f, ly - 14], [lx, ly - 4], [lx - 13 * f, ly - 14]], { wash: '#FFD27A', ink: null, curv: .6 }); }
  else { boilSeed(key + 'smoke'); for (let i = 0; i < 3; i++) { const k = frac(t * .4 + i / 3); inkLine([[lx + Math.sin(k * 6 + i) * 14, ly - 10 - k * 200], [lx + Math.sin(k * 6 + i + 1) * 18, ly - 40 - k * 200]], 2, '#8A84A0', 'inkfine', .5); } }
}

// ---------- props ----------
// a clay water pot, centred at (x, y), s wide; tilt (radians); water 0..1 (spilling from the mouth)
function pot(x, y, s, tilt = 0, key = 'pot', water = 0) {
  boilSeed(key);
  push(); translate(x, y); rotate(tilt);
  paint(ellPts(0, 0, s * .5, s * .45, 18), { wash: '#B8643A', fill: '#8A4422', fillOp: 60, tex: .5, ink: P3.ink, sw: 1 });
  paint(rrPts(-s * .2, -s * .62, s * .4, s * .22, s * .08), { wash: '#A0542E', ink: P3.ink, sw: .9 });
  inkLine([[-s * .42, -s * .05], [s * .42, -s * .05]], 1.2, '#E8A060', 'inkfine', .3);
  if (water > 0) for (let i = 0; i < 3; i++) inkLine([[-s * .1 + i * s * .1, -s * .6], [-s * .3 + i * s * .1, -s * .9 - water * s * .2]], 2, '#9ED0F0', 'ink', .5);
  pop();
}
// an empty cradle on its stand (the twist: he had no son), centred on (x, y), s wide
function cradle(x, y, s, key = 'cr') {
  boilSeed(key);
  inkLine([[x - s * .5, y], [x - s * .5, y - s * .9], [x + s * .5, y - s * .9], [x + s * .5, y]], 2.4, '#8A5230', 'ink', 0);
  const sw = Math.sin(T * 1.4) * .12;
  push(); translate(x, y - s * .9); rotate(sw);
  inkLine([[-s * .3, 0], [-s * .3, s * .45]], 1.2, '#8A5230', 'inkfine', 0); inkLine([[s * .3, 0], [s * .3, s * .45]], 1.2, '#8A5230', 'inkfine', 0);
  paint([[-s * .42, s * .45], [s * .42, s * .45], [s * .3, s * .7], [-s * .3, s * .7]], { wash: '#F2C27A', fill: '#C8964E', fillOp: 50, ink: P3.ink, sw: .9, curv: .4 });
  pop();
}

// ---------- the cast ----------
// young Dasharatha, a prince: black hair, no beard, the small crown, a dark hunting dhoti
function youngKing(x, y, u, o = {}) { return dasharatha(x, y, u, { crown: 'small', beard: false, ...o, pal: { hair: '#1E1B2E', hairLt: '#46426A', dhoti: '#3E5A7A', dhotiDk: '#2A3E58', dhotiLt: '#6A8AAA', shawl: '#C8A040', ...(o.pal || {}) } }); }
// Sumantra, the charioteer and minister: a white turban, a white dhoti, a grey beard
const sumantraTurban = (u, sw) => { paint(U([[-3.3, -21.6], [-3.5, -23.6], [-2.4, -25.4], [0, -26], [2.4, -25.4], [3.5, -23.6], [3.3, -21.6], [0, -22.2]], u), { wash: '#F4ECDC', fill: '#D2C6AE', fillOp: 50, tex: .4, ink: NRD.ink, sw: sw * .8, curv: .4 }); paint(ellPts(0, -23.4 * u, .4 * u, .4 * u, 10), { wash: '#C8323A', ink: null }); };
function sumantra(x, y, u, o = {}) { return narada(x, y, u, { veena: false, topknot: false, hat: sumantraTurban, beard: '#C8C2BC', ...o, pal: { skin: '#E8B48A', skinDk: '#C68A60', skinLt: '#FAD2AE', dhoti: '#F4ECDC', dhotiDk: '#D2C6AE', dhotiLt: '#FFFFFF', border: '#C8323A', hair: '#9A949A', shawl: '#C8323A', shawlDk: '#962338', ...(o.pal || {}) } }); }
// the young ascetic (the boy at the river): Kartikeya's rig, a matted topknot, a bark-brown dhoti, ash on his forehead
const ASC_PAL = { skin: '#D8A07A', skinDk: '#B47A54', skinLt: '#F0C4A0', hair: '#3A2A1E', hairLt: '#5A4632', teal: '#8A6A44', tealDk: '#634A2E', tealLt: '#B08E62', sash: '#C8A86A', sashDk: '#8A7448', gold: '#8A6A44', goldDk: '#5A4428', dot: '#F4ECDC' };
function ascetic(x, y, u, o = {}) { return kartikeya(x, y, u, { feather: false, spear: false, shield: false, ...o, pal: { ...ASC_PAL, ...(o.pal || {}) } }); }
// his blind parents: an old sage (Valmiki's rig, eyes always closed) and an old woman in an ochre saree
function blindFather(x, y, u, o = {}) { return valmiki(x, y, u, { eyes: 'closed', ...o, pal: { dhoti: '#C8A070', dhotiDk: '#9E7848', dhotiLt: '#E2C49A', border: '#6E4A2A', ...(o.pal || {}) } }); }
function blindMother(x, y, u, o = {}) {
  return parvati(x, y, u, { crown: false, veil: 1, eyes: 'closed', ...o, col: '#D8A27A', dk: '#B07A54', lt: '#EEC09C',
    pal: { saree: '#C8964E', sareeDk: '#9E7034', sareeLt: '#E2B878', blouse: '#8A6A44', blouseDk: '#634A2E', hair: '#E8E2DA', hairLt: '#FFFFFF', gold: '#C8A86A', goldDk: '#8A7448', goldLt: '#E8D2A8', bangle: '#C8A86A', veil: '#E8D6B0', veilDk: '#C2AE88', skin: '#D8A27A', skinDk: '#B07A54', skinLt: '#EEC09C', sindoor: '#C8964E', lip: '#A86A5A', ...(o.pal || {}) } });
}
// Queen Kausalya, Ram's mother: a cream saree with a red border, her mukut
function kausalya(x, y, u, o = {}) { return parvati(x, y, u, { ...o, pal: { saree: '#F2E2C2', sareeDk: '#D2BE96', sareeLt: '#FFF4DC', blouse: '#B8202E', blouseDk: '#861422', ...(o.pal || {}) } }); }
