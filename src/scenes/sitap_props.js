// sitap_props.js: the sets and props of "Was RAM right to leave SITA?" in the Painted style (ad 67, the same voice, score
// and timeline as the Cinematic cut, sita.js): the painted map of India and the four poets standing on it where they
// wrote, the regional Ramayans, the Ganga at dusk and Lakshman's boat, Ayodhya at night and its gossips, the palace
// window, the yagna fire, the cracks, the throne on the nagas' hoods, the crowd, the TV, the books card.
// Load after ramayan_sets.js and sitap_map.js.
const SP = {
  ink: '#2B2233', cream: '#FFF5E2', gold: '#F5C542', goldDk: '#B88A1C', goldLt: '#FFE69A',
  sea: '#8EC2D2', seaDk: '#5E9AB4', land: '#F2D9A6', landDk: '#D2B07A', hill: '#C8A070', snow: '#F6F2EA', river: '#6AAED0',
  duskHi: '#2A2A5E', duskMid: '#7A5A8A', duskLo: '#E8A27A', dusk2: '#F2C49A', water: '#4A5E8E', waterLt: '#9AB0D8',
  nightHi: '#16163A', nightLo: '#2E2A5E', roof: '#3A2E5A', roofDk: '#261E40', lamp: '#FFC870', moon: '#F4F0E0',
  wall: '#24305E', wallDk: '#18204A', stone: '#C8B48E', stoneDk: '#9E8A66',
  fire: '#FFB43A', fireLt: '#FFE27A', fireDk: '#E2582A', brick: '#B8603A', brickDk: '#8A4226',
  naga: '#3E8A6A', nagaDk: '#25604A', nagaLt: '#8ACAA0', hood: '#F2D27A',
  peach: '#FBE0CF', teal: '#2E5F5A', rkOrange: '#F15A24', brown: '#3A2418', grey: '#6B5A50',
};
// Sita in the ascetic's ochre at the yagna (Valmiki 7.88.9), and the golden Sita (7.89.4) as a statue
const SITA_OCHRE = { ...SITA_PAL, saree: '#DE8E34', sareeDk: '#AE6420', sareeLt: '#F7BE6E', blouse: '#9A3A22', blouseDk: '#6E2416' };
const GOLD_SITA = { saree: '#E8B040', sareeDk: '#B8862A', sareeLt: '#FFE07A', blouse: '#D49A30', blouseDk: '#A87420', skin: '#F2C860', skinDk: '#C89A3A', skinLt: '#FFE69A',
  lip: '#B8862A', sindoor: '#C8902A', bangle: '#FFE07A', hair: '#B8862A', hairLt: '#E8B850', gold: '#FFE69A', goldDk: '#C8962A', goldLt: '#FFF4C8' };
const GOLD_SKIN = { col: GOLD_SITA.skin, dk: GOLD_SITA.skinDk, lt: GOLD_SITA.skinLt };
const sita = (x, y, u, o = {}) => parvati(x, y, u, { ...SITA_SKIN, ...o, pal: { ...SITA_PAL, ...(o.pal || {}) } });
// a point on Sita's face (parvati(): eyes at (±1.1, -20.1) after the head's 1.18× scale)
const sitaEye = (x, y, u, o = {}, s = 1) => [x + ((o.flip ? -1 : 1) * s * 1.3 + (o.hx || 0) * .6) * u + (o.lean || 0) * .6 * u, y + (o.dy || 0) * u - 20.0 * u];

// ---------- the painted map ----------
// world coords: India's middle (82.5° E, 22.5° N) at (540, 1130), 31 px a degree of latitude
const MAPK = 31, mapXY = (lon, lat) => [540 + (lon - 82.5) * MAPK * .93, 1130 - (lat - 22.5) * MAPK];
const POETS = {
  valmiki: { at: [80.27, 26.61], name: 'VALMIKI', sub: 'the first poet · by the Ganga', lab: [-118, -40] },
  kalidasa: { at: [75.78, 23.18], name: 'KALIDASA', sub: 'Ujjain · ~5th century', lab: [-112, -30] },
  bhava: { at: [78.6, 20.75], name: 'BHAVABHUTI', sub: 'Vidarbha · 8th century', lab: [150, 10] },
  tulsi: { at: [83.0, 25.32], name: 'TULSIDAS', sub: 'Ayodhya & Kashi · 1574', lab: [120, -50] },
};
const POET_KEYS = ['valmiki', 'kalidasa', 'bhava', 'tulsi'];
// the regional Ramayans for the ask: [lon, lat, title, language, label dx, dy] (STORYBOARD.md has the list)
const RAMAYANS2 = [
  [74.8, 34.0, 'Ramavatar Charit', 'Kashmiri', -10, -46],
  [82.2, 26.8, 'Ramcharitmanas', 'Awadhi', 20, -46],
  [72.6, 23.0, 'Giridhar Ramayan', 'Gujarati', -20, -46],
  [88.4, 23.2, 'Krittivasi', 'Bengali', 10, -46],
  [91.7, 26.15, 'Saptakanda', 'Assamese', -40, -46],
  [75.38, 19.48, 'Bhavartha', 'Marathi', -40, -44],
  [85.8, 20.3, 'Jagamohan', 'Odia', 20, -44],
  [79.8, 16.8, 'Ranganatha', 'Telugu', 30, -44],
  [75.9, 14.6, 'Torave', 'Kannada', -60, -40],
  [79.2, 11.2, 'Kamba Ramayanam', 'Tamil', 110, -10],
  [76.3, 10.0, 'Adhyatma Ramayanam', 'Malayalam', -150, -6],
];
// the Ganga from Haridwar to the sea (by the poets' pins: Valmiki's ashram, Kashi)
const GANGA = [[78.16, 29.95], [79.4, 28.3], [80.33, 26.45], [81.88, 25.43], [83.0, 25.32], [85.1, 25.6], [87.0, 25.2], [88.1, 24.3], [88.3, 22.6], [88.4, 21.7]];
function paintedMap(t, key = 'map', o = {}) {
  const dim = o.dim || 0, D = c => dim ? mixCol(c, '#4A3A5A', dim) : c;
  boilSeed(key + 'sea');
  paint(rectPts(-1400, -900, W + 2800, H + 1800), { wash: D(SP.sea), ink: null });
  paint(ellPts(540, 1130, 900, 1000, 30), { fill: D('#B4DCE6'), fillOp: 160, bleed: .3, tex: .5, border: .3, ink: null });
  boilSeed(key + 'waves');
  for (let i = 0; i < 26; i++) { const x = -200 + hash(i * 3.7) * 1500, y = 500 + hash(i * 9.1) * 1300, [lx, ly] = [(x - 540) / MAPK / .93 + 82.5, 22.5 - (y - 1130) / MAPK];
    if (lx > 69 && lx < 97 && ly > 8 && ly < 36 && !(ly < 22 && (lx < 73 + (22 - ly) * .2 || lx > 86 - (22 - ly) * .55))) continue;   // not on land
    const w = 18 + 10 * Math.sin(t * 1.2 + i); inkLine([[x - w, y], [x - w / 2, y - 6], [x, y], [x + w / 2, y - 6], [x + w, y]], 1.2, D(SP.seaDk), 'inkfine', .6); }
  const ring = MAP2.india.map(([a, b]) => mapXY(a, b)), lk = MAP2.lanka.map(([a, b]) => mapXY(a, b));
  boilSeed(key + 'land');
  paint(ring, { wash: D(SP.land), fill: D(SP.landDk), fillOp: 70, bleed: .12, tex: .6, border: .5, ink: null });
  paint(lk, { wash: D(SP.land), fill: D(SP.landDk), fillOp: 70, bleed: .12, tex: .6, ink: null });
  paint(ellPts(...mapXY(80, 20), 230, 300, 24), { fill: D('#FFF0C8'), fillOp: 90, bleed: .3, tex: .5, ink: null });
  // the outline in short runs (one long ink line under a zoomed camera loses its stroke)
  boilSeed(key + 'coast');
  const sw = (o.sw ?? 1.6);
  for (let i = 0; i < ring.length; i += 24) inkLine(ring.slice(i, i + 25).concat(i + 24 >= ring.length ? [ring[0]] : []), sw, D('#6A4A3A'), 'ink', .3);
  inkLine(lk.concat([lk[0]]), sw, D('#6A4A3A'), 'ink', .3);
  // the Himalaya: a row of little painted peaks with snow
  boilSeed(key + 'hima');
  for (let i = 0; i < 9; i++) { const [px, py] = mapXY(75.6 + i * 2.05 + (i > 4 ? (i - 4) * .4 : 0), 33.2 - i * .72 - (i > 5 ? (i - 5) * .5 : 0)), h = 34 + 14 * hash(i * 2.2);
    paint([[px - h * .8, py], [px, py - h], [px + h * .8, py]], { wash: D(SP.hill), ink: D('#6A4A3A'), sw: .8 });
    paint([[px - h * .28, py - h * .65], [px, py - h], [px + h * .28, py - h * .65], [px + h * .08, py - h * .58], [px - h * .08, py - h * .6]], { wash: D(SP.snow), ink: null }); }
  boilSeed(key + 'ganga');
  inkLine(GANGA.map(([a, b]) => mapXY(a, b)), 3.4, D(SP.river), 'ink', .6);
}
// one of the poets on Narad's rig (valmiki() has the palm-leaf manuscript): Kalidasa a court poet in indigo, Bhavabhuti
// a dark-bearded brahmin in saffron, Tulsidas in white with a saffron shawl
const POET_LOOK = {
  valmiki: {},
  kalidasa: { beard: false, pal: { hair: '#2A2030', hairLt: '#4E4058', skin: '#E8B48A', skinDk: '#C48A62', skinLt: '#FFD8B4', dhoti: '#3E5AA8', dhotiDk: '#2A3E7A', dhotiLt: '#7A94D2', border: '#F2C230', shawl: '#FFF0D8', shawlDk: '#E2CDA6' } },
  bhava: { beard: '#2A2030', beardLen: .5, pal: { hair: '#2A2030', hairLt: '#4E4058', skin: '#D9A27A', skinDk: '#B47A54', skinLt: '#F0C4A0', dhoti: '#E8862E', dhotiDk: '#B85E18', dhotiLt: '#FFB870', border: '#8A2A1E', shawl: '#F6EEDC', shawlDk: '#DCCDAE' } },
  tulsi: { beard: false, pal: { hair: '#3A3036', hairLt: '#5E525A', skin: '#D9A27A', skinDk: '#B47A54', skinLt: '#F0C4A0', dhoti: '#F6F0E4', dhotiDk: '#D8CEB8', dhotiLt: '#FFFFFF', border: '#D2702A', shawl: '#F29A38', shawlDk: '#C96E1E' } },
};
function poet(k, x, y, u, o = {}) {
  const L = POET_LOOK[k];
  return valmiki(x, y, u, { ...L, ...o, pal: { ...(L.pal || {}), ...(o.pal || {}) } });
}
// a poet's pin: a beam of light where he wrote and the poet standing in it, dropping in at `at`; o.act: his pose
function poetPin(k, t, at, u, o = {}) {
  if (t < at) return;
  const [x, y] = mapXY(...POETS[k].at), a = t - at, drop = 1 - easeOut(clamp(a / .35)), land = spring(t, at + .35, 6, 1.4) * .12;
  glow(x, y - 4 * u, 14 * u, '#FFE6A0', .5 * clamp(a * 3));
  boilSeed('beam' + k);
  paint([[x - 3.2 * u, y], [x - 2 * u, y - 60 * u], [x + 2 * u, y - 60 * u], [x + 3.2 * u, y]], { wash: '#FFF2C8', washOp: 70 * clamp(a * 3), ink: null });
  paint(ellPts(x, y, 4.6 * u, 1.3 * u, 18), { wash: SP.gold, ink: SP.ink, sw: .7 });
  poet(k, x, y, u, { boilKey: 'pin' + k, dy: -drop * 18, sq: drop > 0 ? -.12 * drop : land, noShadow: true, eyes: 'closed', mouth: 'smile', leaf: 1, ...(o.act || {}) });
}
// a poet's name by his pin, in screen space (a camera may be on); big: the zoomed-in title with its era
function poetLabel(k, t, at, o = {}) {
  if (t < at) return;
  const P = POETS[k], [wx, wy] = mapXY(...P.at), [sx, sy] = toScreen(wx, wy), pk = (t - at) * 5;
  if (o.big) {
    letter(P.name, 540, o.y ?? 1290, 92, SP.gold, { screen: true, stroke: SP.ink, sw: .2, ink: false, pop: pk, maxW: 860 });
    letter(P.sub, 540, (o.y ?? 1290) + 88, 44, SP.cream, { screen: true, font: '700 42px Poppins', stroke: SP.ink, sw: .22, ink: false, pop: pk - .5, maxW: 860 });
  } else letter(P.name, clamp(sx + P.lab[0], 130, 900), sy + P.lab[1], 40, SP.brown, { screen: true, font: '700 34px Poppins', stroke: SP.cream, sw: .3, ink: false, pop: pk, alpha: o.alpha ?? 1 });
}
// a palm-leaf book on the map (a Ramayan), popping in at `at`
function leafBook(x, y, s, t, at, key) {
  if (t < at) return;
  const k = backOut(clamp((t - at) * 4)) * s;
  glow(x, y, 50 * k, '#FFE6A0', .5);
  boilSeed('lb' + key);
  push(); translate(x, y); rotate(-.15); scale(k);
  for (let i = 0; i < 3; i++) paint(rrPts(-34, -9 - i * 6, 68, 14, 6), { wash: i === 2 ? '#F2DDA8' : '#E2C482', fill: '#B8944E', fillOp: 40, tex: .4, ink: SP.ink, sw: .6 });
  inkLine([[0, -26], [0, 6]], 1.2, '#7A4A22', 'ink', 0);
  pop();
}

// ---------- the Ganga at dusk (Valmiki 7.46–47: she is left on the far bank; Lakshman crosses back) ----------
function duskBank(t, key = 'db', o = {}) {
  const hy = o.hy ?? 1180;
  boilSeed(key + 'sky');
  paint(rectPts(-400, -400, W + 800, hy + 420), { wash: SP.duskHi, ink: null });
  paint(ellPts(540, hy - 80, 1100, 520, 30), { fill: SP.duskMid, fillOp: 230, bleed: .3, tex: .4, border: .2, ink: null });
  paint(ellPts(560, hy - 10, 900, 200, 26), { fill: SP.duskLo, fillOp: 230, bleed: .3, tex: .4, border: .2, ink: null });
  glow(800, 760, 160, '#C8D4F4', .45); paint(ellPts(800, 760, 38, 38, 18), { wash: SP.moon, ink: null });
  boilSeed(key + 'stars');
  for (let i = 0; i < 16; i++) { const x = hash(i * 4.1) * W, y = 300 + hash(i * 6.3) * (hy - 520), r = 3 + 2 * Math.sin(t * 2 + i * 1.7); paint(starPts(x, y, Math.max(1, r), .45, 4), { wash: '#FFF6DC', ink: null }); }
  boilSeed(key + 'far');
  paint([[-400, hy], [-100, hy - 60], [200, hy - 30], [520, hy - 70], [800, hy - 36], [1100, hy - 64], [1480, hy - 20], [1480, hy + 10], [-400, hy + 10]], { wash: '#3A2E5A', ink: null, curv: .6 });
  for (let i = 0; i < 9; i++) { const x = -80 + i * 160 + 40 * hash(i * 3.1), r = 40 + 30 * hash(i * 5.7); paint(ellPts(x, hy - 40 - r * .4, r, r * .8, 14, 2), { wash: '#2E2450', ink: null }); }
  boilSeed(key + 'water');
  paint(rectPts(-400, hy, W + 800, 520), { wash: SP.water, ink: null });
  paint(ellPts(800, hy + 160, 120, 300, 18), { fill: '#C8D4F4', fillOp: 60, bleed: .3, tex: .4, ink: null });
  boilSeed(key + 'ripples');
  for (let i = 0; i < 12; i++) { const y = hy + 20 + hash(i * 2.3) * 440, x = frac(hash(i * 7.7) + t * .02) * 1500 - 200; inkLine([[x, y], [x + 80, y]], 1.6, SP.waterLt, 'inkfine', 0); }
  if (o.boat != null) boat(o.boat, t);
  boilSeed(key + 'bank');
  paint([[-400, hy + 470], [200, hy + 430], [700, hy + 480], [1480, hy + 440], [1480, 2600], [-400, 2600]], { wash: '#5A6A4A', fill: '#3E4A34', fillOp: 70, tex: .5, ink: SP.ink, sw: .9, curv: .5 });
  boilSeed(key + 'reeds');
  for (let i = 0; i < 14; i++) { const x = -40 + i * 85 + 30 * hash(i * 1.7), h = 60 + 60 * hash(i * 4.1), s2 = Math.sin(t * 1.4 + i) * 8, yb = hy + 470; inkLine([[x, yb], [x + s2 * .5, yb - h * .6], [x + s2, yb - h]], 2, i % 2 ? '#6E7A50' : '#4E5A3A', 'ink', .5); }
}
// the boat going away over the river: k 0..1 (far = smaller, further right); the boatman poles, Lakshman stands looking back
function boat(k, t) {
  const x = lerp(640, 900, k), y = 1290 - k * 40, s = lerp(1, .55, k), bob = Math.sin(t * 1.6) * 3;
  push(); translate(x, y + bob); scale(s);
  lakshman(-10, -6, 5.2, { boilKey: 'blak', kodanda: true, eyes: 'sad', mouth: 'frown', hx: -.6, lookX: -1, noShadow: true, tint: SP.duskHi, tintK: .3 });
  narada(70, -6, 4.4, { boilKey: 'bman', veena: false, beard: false, handL: [-2.4, -16], handR: [2.6, -10], noShadow: true, eyes: 'normal', pal: { dhoti: '#8A6A4A', dhotiDk: '#634A30', shawl: '#C8B48E', shawlDk: '#9E8A66', skin: '#B8825A', skinDk: '#8A5E3E', skinLt: '#D8A07A' }, tint: SP.duskHi, tintK: .3 });
  boilSeed('bpole'); inkLine([[60, -90], [110, 60]], 2.4, '#5E3418', 'ink', 0);
  boilSeed('bhull');
  paint([[-100, -8], [120, -8], [96, 22], [-76, 22]], { wash: '#6E4228', fill: '#4A2A18', fillOp: 60, tex: .4, ink: SP.ink, sw: 1, curv: .3 });
  inkLine([[-90, 0], [110, 0]], 1, '#A0784A', 'inkfine', 0);
  pop();
  boilSeed('bwake'); for (let i = 0; i < 3; i++) inkLine([[x - 120 * s - i * 50, y + 30 * s + i * 6], [x - 70 * s - i * 50, y + 30 * s + i * 6]], 1.4, SP.waterLt, 'inkfine', 0);
}

// ---------- Ayodhya at night: rooftops, lit windows, the palace terrace on the right ----------
function ayodhyaNight(t, key = 'ay') {
  boilSeed(key + 'sky');
  paint(rectPts(-400, -400, W + 800, 1700), { wash: SP.nightHi, ink: null });
  paint(ellPts(540, 1000, 900, 600, 28), { fill: SP.nightLo, fillOp: 220, bleed: .3, tex: .4, ink: null });
  glow(240, 820, 150, '#C8D4F4', .4); paint(ellPts(240, 820, 40, 40, 18), { wash: SP.moon, ink: null });
  boilSeed(key + 'stars');
  for (let i = 0; i < 14; i++) { const x = hash(i * 4.7) * W, y = 300 + hash(i * 2.9) * 600, r = 3 + 2 * Math.sin(t * 2.2 + i); paint(starPts(x, y, Math.max(1, r), .45, 4), { wash: '#FFF6DC', ink: null }); }
  // the far roofs: domes and shikharas
  boilSeed(key + 'far');
  for (let i = 0; i < 7; i++) {
    const x = -60 + i * 190, w = 150 + 40 * hash(i * 1.3), h = 220 + 160 * hash(i * 2.7), y0 = 1240;
    paint(rectPts(x - w / 2, y0 - h, w, h + 40), { wash: SP.roofDk, ink: null });
    if (i % 2) paint(ellPts(x, y0 - h, w * .42, w * .42, 18).filter(p => p[1] <= y0 - h + 2), { wash: SP.roofDk, ink: null });
    else paint([[x - w * .4, y0 - h], [x, y0 - h - w * .7], [x + w * .4, y0 - h]], { wash: SP.roofDk, ink: null });
    for (let j = 0; j < 2; j++) { const wx = x - w * .2 + j * w * .4, wy = y0 - h * .55; glow(wx, wy, 30, SP.lamp, .4); paint(rrPts(wx - 9, wy - 16, 18, 30, 8), { wash: SP.lamp, ink: null }); }
  }
  // the palace on the right: a terrace with a parapet (Ram stands on it), a dome over it
  boilSeed(key + 'palace');
  paint([[640, 1300], [640, 940], [1200, 940], [1200, 1300]], { wash: SP.roof, fill: SP.roofDk, fillOp: 60, tex: .4, ink: SP.ink, sw: 1 });
  paint(ellPts(980, 700, 160, 150, 22).filter(p => p[1] <= 712), { wash: SP.roof, ink: SP.ink, sw: 1 });
  paint(rectPts(860, 700, 240, 100), { wash: SP.roof, ink: SP.ink, sw: .9 });
  for (const x of [700, 1140]) paint(rectPts(x - 18, 760, 36, 180), { wash: SP.roofDk, ink: SP.ink, sw: .8 });
  for (let i = 0; i < 9; i++) paint(rrPts(650 + i * 62, 930, 44, 24, 6), { wash: '#4A3E6E', ink: SP.ink, sw: .6 });
  glow(760, 1150, 50, SP.lamp, .5); paint(rrPts(745, 1110, 30, 70, 14), { wash: SP.lamp, ink: SP.ink, sw: .6 });
  // the lane: the street, a lamp post
  boilSeed(key + 'lane');
  paint([[-400, 1300], [1480, 1300], [1480, 2600], [-400, 2600]], { wash: '#3A3050', fill: '#2A2240', fillOp: 70, tex: .5, ink: SP.ink, sw: .9 });
  for (let i = 0; i < 6; i++) inkLine([[-100 + i * 260, 1300], [-400 + i * 380, 2000]], .8, '#2A2240', 'inkfine', 0);
  const fl = .85 + .15 * Math.sin(t * 11) * Math.sin(t * 6.7);
  glow(540, 1260, 240 * fl, SP.lamp, .5);
  boilSeed(key + 'post'); inkLine([[540, 1420], [540, 1290]], 5, '#1E1830', 'ink', 0); paint(ellPts(540, 1270, 18, 22, 12), { wash: SP.fireLt, ink: SP.ink, sw: .7 });
}
// whisper marks from a mouth toward dir (±1): three little curls, drifting
function whispers(x, y, dir, age, key) {
  boilSeed(key);
  for (let i = 0; i < 3; i++) {
    const k = frac(age * .8 + i / 3), px = x + dir * (20 + k * 70), py = y - 10 - k * 30 + Math.sin(k * 6 + i) * 6, a = 255 * Math.sin(k * Math.PI);
    if (a < 20) continue;
    inkLine([[px, py], [px + dir * 10, py - 8], [px + dir * 18, py], [px + dir * 26, py - 8]], 2, mixCol('#FFF5E2', '#2E2A5E', 1 - a / 255), 'ink', .6);
  }
}
// a thought bubble at (x, y) of radius (rx, ry), k 0..1 its pop, with three dots trailing to `from`
function bubble(x, y, rx, ry, k, from, key, col = '#FFF4D8') {
  if (k <= 0) return;
  boilSeed(key);
  for (let i = 0; i < 3; i++) { const p = (i + 1) / 4, r = (10 + i * 6) * k; paint(ellPts(lerp(from[0], x, p), lerp(from[1], y + ry * .8, p), r, r, 10), { wash: col, ink: SP.ink, sw: .8 }); }
  paint(ellPts(x, y, rx * k, ry * k, 26, 4), { wash: col, ink: SP.ink, sw: 1.2, curv: .8 });
}

// ---------- the palace window at night, the moon in it; frost (k) falling ----------
function palaceWindow(t, key = 'pw', o = {}) {
  const cold = o.cold || 0;
  boilSeed(key + 'wall');
  paint(rectPts(-400, -400, W + 800, H + 800), { wash: mixCol(SP.wall, '#2A3A6E', cold), ink: null });
  paint(ellPts(540, 1100, 800, 900, 26), { fill: SP.wallDk, fillOp: 160, bleed: .3, tex: .4, ink: null });
  // the arched window: night sky, the moon
  const wx = o.wx ?? 640, A = [[wx - 230, 1500], [wx - 230, 900], [wx - 170, 800], [wx, 740], [wx + 170, 800], [wx + 230, 900], [wx + 230, 1500]];
  boilSeed(key + 'win');
  paint(A, { wash: mixCol('#1E2650', '#2E3E7A', cold), ink: null, curv: .3 });
  glow(wx + 60, 930, 220, '#D8E4FF', .55 + .1 * cold); paint(ellPts(wx + 60, 930, 62, 62, 20), { wash: SP.moon, ink: null });
  boilSeed(key + 'winsky'); for (let i = 0; i < 6; i++) paint(starPts(wx - 180 + hash(i * 3.3) * 360, 860 + hash(i * 5.1) * 500, 4 + Math.sin(t * 2 + i) * 1.5, .45, 4), { wash: '#FFF6DC', ink: null });
  boilSeed(key + 'frame');
  inkLine(A, 14, SP.stone, 'ink', .3);
  inkLine(A.map(([x, y]) => [x + (x - wx) * .08, y - (y < 1400 ? 18 : 0)]), 3, SP.stoneDk, 'ink', .3);
  paint(rectPts(wx - 300, 1500, 600, 60), { wash: SP.stone, fill: SP.stoneDk, fillOp: 60, tex: .4, ink: SP.ink, sw: 1 });
  // the floor
  boilSeed(key + 'floor');
  paint(rectPts(-400, 1560, W + 800, 1000), { wash: '#2A2448', fill: '#1E1A38', fillOp: 70, tex: .5, ink: SP.ink, sw: .9 });
  if (cold > 0) frost(t, cold, key + 'frost');
}
function frost(t, k, key) {
  boilSeed(key);
  for (let i = 0; i < 40 * k; i++) { const x = hash(i * 3.3) * 1200 - 60 + Math.sin(t * .9 + i) * 30, y = frac(hash(i * 6.1) + t * (.05 + .03 * hash(i))) * 2100 - 100;
    paint(starPts(x, y, 5 + 3 * hash(i * 1.9), .4, 6, t + i), { wash: '#EAF2FF', washOp: 200, ink: null }); }
}

// ---------- the yagna: the fire in its brick kund ----------
function yagnaFire(x, y, s, t, key = 'yf', k = 1) {
  const fl = .85 + .15 * Math.sin(t * 13) * Math.sin(t * 7.1);
  glow(x, y - 90 * s, 360 * s * fl * k, '#FFB050', .55 * k);
  boilSeed(key + 'kund');
  paint([[x - 150 * s, y - 30 * s], [x + 150 * s, y - 30 * s], [x + 130 * s, y + 40 * s], [x - 130 * s, y + 40 * s]], { wash: SP.brick, fill: SP.brickDk, fillOp: 70, tex: .5, ink: SP.ink, sw: 1 });
  for (let i = 0; i < 4; i++) inkLine([[x - 140 * s + i * 2, y - 8 * s + i * 14 * s], [x + 140 * s - i * 2, y - 8 * s + i * 14 * s]], .7, SP.brickDk, 'inkfine', 0);
  paint(ellPts(x, y - 30 * s, 150 * s, 22 * s, 18), { wash: '#4A2A1E', ink: SP.ink, sw: .9 });
  if (k <= 0) return;
  boilSeed(key + 'fl');
  for (let i = 0; i < 5; i++) {
    const dx = (i - 2) * 46 * s, h = (150 + 70 * Math.sin(t * 9 + i * 1.7) + (i === 2 ? 90 : 0)) * s * k, w = (38 - Math.abs(i - 2) * 5) * s, sway = Math.sin(t * 6 + i) * 14 * s;
    paint([[x + dx - w, y - 30 * s], [x + dx - w * .6 + sway * .4, y - 30 * s - h * .5], [x + dx + sway, y - 30 * s - h], [x + dx + w * .6 + sway * .4, y - 30 * s - h * .5], [x + dx + w, y - 30 * s]], { wash: i % 2 ? SP.fireDk : SP.fire, ink: null, curv: .6 });
    paint([[x + dx - w * .5, y - 30 * s], [x + dx + sway * .6, y - 30 * s - h * .62], [x + dx + w * .5, y - 30 * s]], { wash: SP.fireLt, ink: null, curv: .6 });
  }
  boilSeed(key + 'sparks');
  for (let i = 0; i < 6; i++) { const a = frac(t * .7 + hash(i * 2.1)), sx = x + (hash(i * 5.3) - .5) * 220 * s + Math.sin(a * 9 + i) * 20, sy = y - 100 * s - a * 420 * s; paint(ellPts(sx, sy, 4, 4, 6), { wash: SP.fireLt, washOp: 255 * (1 - a), ink: null }); }
}

// ---------- the Earth opens (Valmiki 7.88.11–14) ----------
// gold light in cracks running out from (x, y), k 0..1 how far they've spread
function goldCracks(x, y, w, k, key = 'gc') {
  if (k <= 0) return;
  glow(x, y, w * .8 * k, '#FFD060', .7 * k);
  boilSeed(key);
  for (let i = 0; i < 7; i++) {
    const s = i % 2 ? 1 : -1, len = w * (.4 + .6 * hash(i * 3.1)) * k, a = (hash(i * 7.3) - .5) * .5;
    const P = [[x, y]]; for (let j = 1; j <= 4; j++) P.push([x + s * len * j / 4, y + Math.sin(j * 2.1 + i) * 14 + a * len * j / 4 * .3]);
    inkLine(P, 5 * k, '#FFE27A', 'ink', .2); inkLine(P, 1.6, '#3A2418', 'inkfine', .2);
  }
}
// the throne the Earth sends up on the heads of nagas: its seat top at (x, y), s its scale
function nagaThrone(x, y, s, t, key = 'nt') {
  // the bodies coil up from below; the gold seat rests on five spread hoods, drawn over its lower edge
  boilSeed(key + 'nagas');
  const hood = i => { const nx = x + (i - 2) * 82 * s, sway = Math.sin(t * 3 + i) * 5 * s; return [nx + sway, y + 64 * s]; };
  for (let i = 0; i < 5; i++) {
    const [hx, hy] = hood(i);
    paint(ribbon([[hx + (i - 2) * 16 * s, hy + 330 * s], [hx - 22 * s, hy + 240 * s], [hx + 22 * s, hy + 150 * s], [hx - 8 * s, hy + 70 * s], [hx, hy + 20 * s]], 34 * s, 24 * s), { wash: SP.naga, fill: SP.nagaDk, fillOp: 60, tex: .4, ink: SP.ink, sw: .9 });
    for (let j = 0; j < 4; j++) inkLine([[hx - 12 * s + Math.sin(j * 2 + i) * 14 * s, hy + (110 + j * 60) * s], [hx + 12 * s + Math.sin(j * 2 + i) * 14 * s, hy + (110 + j * 60) * s]], .8, SP.nagaLt, 'inkfine', .5);
  }
  glow(x, y, 220 * s, '#FFE080', .5);
  boilSeed(key + 'seat');
  paint(rrPts(x - 210 * s, y - 20 * s, 420 * s, 56 * s, 16 * s), { wash: SP.gold, fill: SP.goldDk, fillOp: 60, tex: .5, ink: SP.ink, sw: 1.1 });
  for (let i = 0; i < 6; i++) paint(ellPts(x - 165 * s + i * 66 * s, y + 8 * s, 8 * s, 8 * s, 8), { wash: '#D2283A', ink: SP.ink, sw: .5 });
  boilSeed(key + 'hoods');
  for (let i = 0; i < 5; i++) {
    const [hx, hy] = hood(i);
    // a cobra's spread hood: wide at the top, narrowing to the neck; the cream belly marks; the eyes, the flicking tongue
    paint([[hx, hy - 62 * s], [hx + 38 * s, hy - 46 * s], [hx + 44 * s, hy - 6 * s], [hx + 20 * s, hy + 36 * s], [hx, hy + 44 * s], [hx - 20 * s, hy + 36 * s], [hx - 44 * s, hy - 6 * s], [hx - 38 * s, hy - 46 * s]], { wash: SP.naga, fill: SP.nagaDk, fillOp: 50, tex: .4, ink: SP.ink, sw: 1, curv: .6 });
    paint([[hx, hy - 30 * s], [hx + 18 * s, hy - 10 * s], [hx + 10 * s, hy + 26 * s], [hx, hy + 32 * s], [hx - 10 * s, hy + 26 * s], [hx - 18 * s, hy - 10 * s]], { wash: SP.hood, ink: null, curv: .6 });
    paint(ellPts(hx, hy - 40 * s, 16 * s, 13 * s, 12), { wash: SP.nagaLt, ink: SP.ink, sw: .6 });
    for (const e of [-1, 1]) paint(ellPts(hx + e * 7 * s, hy - 43 * s, 3.4 * s, 3.4 * s, 8), { wash: SP.ink, ink: null });
    if (Math.sin(t * 7 + i * 2) > .3) inkLine([[hx, hy - 30 * s], [hx, hy - 20 * s], [hx - 4 * s, hy - 14 * s]], 1.2, '#D2283A', 'inkfine', 0);
  }
}
// flower petals falling over the frame (k 0..1 how many)
function petalRain(t, k = 1, key = 'pr', n = 36) {
  if (k <= 0) return;
  boilSeed(key);
  const cols = ['#F4A6B8', '#F39A2E', '#FFE27A', '#E2476E'];
  for (let i = 0; i < n * k; i++) {
    const x = hash(i * 3.1) * 1300 - 100 + Math.sin(t * 1.4 + i) * 40, y = frac(hash(i * 7.9) + t * (.12 + .08 * hash(i * 1.7))) * 2200 - 150;
    paint(ellPts(x, y, 13, 8, 8, 0, t * 2 + i), { wash: cols[i % 4], ink: SP.ink, sw: .4 });
  }
}

// ---------- the people of Ayodhya: men on Narad's rig, women on Parvati's in an odhni (i picks the colours) ----------
const FOLK_M = [['#3E7A9A', '#2A5A74'], ['#8A3A5A', '#6A2440'], ['#5A8A3E', '#3E6A2A'], ['#A8783A', '#7A5420'], ['#6A4A9A', '#4A2E78']];
const FOLK_F = [['#2E8A7A', '#1E6A5A', '#E8862E'], ['#C8463A', '#962A22', '#F2C230'], ['#7A3E9A', '#5A2A78', '#F39A3A'], ['#3E6AA8', '#2A4A7A', '#F4A6B8']];
function folk(x, y, u, i, o = {}) {
  if (i % 2) {
    const [s, d, v] = FOLK_F[(i >> 1) % 4];
    return parvati(x, y, u, { crown: false, veil: 1, ...o, pal: { saree: s, sareeDk: d, sareeLt: mixCol(s, '#FFFFFF', .35), veil: v, veilDk: mixCol(v, '#000000', .25), blouse: d, blouseDk: d, ...(o.pal || {}) } });
  }
  const [dh, dk] = FOLK_M[(i >> 1) % 5];
  return narada(x, y, u, { veena: false, beard: i % 4 === 0 ? '#3A3036' : false, beardLen: .5, ...o, pal: { dhoti: '#F2E6CC', dhotiDk: '#D2C2A0', dhotiLt: '#FFF8EC', border: dh, shawl: dh, shawlDk: dk, ...(o.pal || {}) } });
}

// ---------- a little old TV (the one on TV) ----------
function oldTV(x, y, s, t, key = 'tv') {
  boilSeed(key);
  inkLine([[x - 10 * s, y - 60 * s], [x - 40 * s, y - 110 * s]], 2, SP.ink, 'ink', 0); inkLine([[x + 10 * s, y - 60 * s], [x + 44 * s, y - 106 * s]], 2, SP.ink, 'ink', 0);
  paint(rrPts(x - 90 * s, y - 64 * s, 180 * s, 128 * s, 18 * s), { wash: '#8A5A34', fill: '#5E3A1E', fillOp: 60, tex: .5, ink: SP.ink, sw: 1 });
  glow(x - 16 * s, y, 70 * s, '#BFE6FF', .45);
  paint(rrPts(x - 76 * s, y - 50 * s, 118 * s, 100 * s, 16 * s), { wash: '#BCDCE8', fill: '#8AB8CC', fillOp: 50, tex: .4, ink: SP.ink, sw: .8 });
  for (const yy of [-20, 0, 20]) inkLine([[x - 66 * s, y + yy * s + Math.sin(t * 9 + yy) * 2], [x + 30 * s, y + yy * s + Math.sin(t * 9 + yy) * 2]], 1, '#FFFFFF', 'inkfine', 0);
  for (const yy of [-24, 4]) paint(ellPts(x + 64 * s, y + yy * s, 9 * s, 9 * s, 10), { wash: '#D8B07A', ink: SP.ink, sw: .6 });
  for (const xx of [-60, 60]) inkLine([[x + xx * s, y + 64 * s], [x + xx * 1.15 * s, y + 84 * s]], 2.4, SP.ink, 'ink', 0);
}

// ---------- the card: Books 1–3, set of 3 for ₹500 ----------
function booksCard(t, C) {
  boilSeed('cardbg');
  paint(rectPts(-60, -60, W + 120, H + 120), { wash: SP.peach, ink: null });
  glow(470, 900, 420, '#FFE7A8', .3);
  petalRain(t, .35, 'cardpetals', 30);
  const X = 470, pk = t0 => Math.max(0, t - t0) * 5, br = Math.sin(t * 1.3) * .01;
  if (t > C.logo) picture(PICS.logo, X, 530, 140, 140, { pop: pk(C.logo) });
  if (t > C.cap) letter('Picture books of our gods, for kids', X, 660, 46, SP.teal, { screen: true, font: '50px Marcellus', ink: false, pop: pk(C.cap), maxW: 860 });
  [1, 2, 3].forEach((b, j) => {
    const t0 = C.covers + j * .12; if (t < t0) return;
    picture(PICS['book' + b], X + (j - 1) * 290, 900 + (j === 1 ? -16 : 0), 276, 276, { rot: (j - 1) * .05 + (j % 2 ? br : -br), pop: pk(t0), r: 8, shadow: 18 });
  });
  if (t > C.price) {
    letter('Books 1–3 · OUT NOW', X, 1130, 46, SP.brown, { screen: true, font: '700 50px Poppins', ink: false, maxW: 860, pop: pk(C.price) });
    letter('Set of 3 for ₹500', X, 1196, 44, SP.rkOrange, { screen: true, font: '700 52px Poppins', ink: false, maxW: 860, pop: pk(C.price + .12) });
  }
  if (t > C.pill) {
    const k = backOut(clamp(pk(C.pill))) * (1 + .03 * pulse(t, 4));
    boilSeed('pill');
    push(); translate(X, 1295); scale(k); paint(rrPts(-220, -44, 440, 88, 44), { wash: SP.rkOrange, ink: null }); pop();
    letter('rishikatha.com', X, 1297, 50, SP.cream, { screen: true, font: '700 52px Poppins', ink: false, pop: pk(C.pill) });
  }
  if (t > C.follow) letter('Follow @therishikatha', X, 1395, 36, SP.grey, { screen: true, font: '500 38px Poppins', ink: false, maxW: 860, pop: pk(C.follow) });
}
