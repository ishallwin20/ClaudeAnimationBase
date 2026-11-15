// sanj_props.js: sets, palettes, props and the extra cast for sanj.js ("Why did Hanuman bring the WHOLE MOUNTAIN?").
// Loaded before it; everything here is a pure function of its arguments (and T for boil).
//   SJ, TK                       palettes (TK: the card's brand colours, as in ads 21–30)
//   flySky, battlefield, himalaya   sets
//   bellSpear, herb, herbPeak, mortar, thought    props
//   sushena()                    the vanara physician, on Hanuman's rig (grey fur, a white beard, no crown)
//   dealCard, dealStrike         the 15K Family Deal card (Books 1–3, ₹350, till 25 Oct)
const SJ = {
  ink: '#2B2233', cream: '#FFF5E2',
  // the flight
  skyHi: '#8FB4E0', skyLo: '#FCD9B8', cloud: '#FFF6EC', cloudDk: '#E8D2C4',
  // Lanka at dusk / night
  duskHi: '#E2865A', duskLo: '#F7C98E', nightHi: '#1E2452', nightLo: '#3A3C78', sun: '#FFD9A0',
  lanka: '#B8862E', lankaDk: '#7E5420', lankaN: '#2A2A50',
  earth: '#C9A06E', earthDk: '#A07848', earthN: '#4A4468', earthNDk: '#34304E',
  // the Himalaya at night
  hiSky: '#1C2350', hiSkyLo: '#3E4A86', snow: '#D6DCEE', snowDk: '#A4AED0', rock: '#6A6488', rockDk: '#4A4468', rockLt: '#8C86A8',
  moss: '#4E8A62', mossDk: '#3A6A4A', moon: '#FFF4D2',
  // props
  shaft: '#6A4A3A', shaftDk: '#4A2E22', blade: '#C8CCD8', bladeDk: '#8E94A8', bell: '#F2C230', bellDk: '#B88A1C',
  herbs: [['#F6D24A', '#FFF0A0'], ['#7CDC8A', '#C8FFD0'], ['#F27A8A', '#FFD0D8'], ['#7AB8F2', '#D0E8FF']],
  stone: '#9A92A6', stoneDk: '#6E6880', root: '#7A5232',
  sepia: '#C8A47A',
};
const TK = {
  ink: '#2B2233', cream: '#FFF5E2',
  petal: '#F4A6B8', petalDk: '#E0708C', marigold: '#F39A2E', yellow: '#FFD45A', leaf: '#5E9A6A',
  gold: '#EDB43C', goldLt: '#FFE39A', goldDk: '#B67D1C',
  rkOrange: '#F15A24', peach: '#FBE0CF', peachLt: '#FFF1E6', brown: '#3A2418', grey: '#6B5A50', teal: '#2E5F5A',
};

// ---------- sets ----------
// a soft cloud: overlapping puffs, one outline-free wash with a darker belly
function cloudPuff(x, y, s, key, a = 255, col = SJ.cloud, dk = SJ.cloudDk) {
  boilSeed('cloud' + key);
  paint(ellPts(x, y + s * .18, s * 1.1, s * .32, 18), { wash: dk, washOp: a, ink: null });
  for (const [dx, dy, r] of [[-.6, 0, .42], [-.15, -.22, .55], [.4, -.08, .46], [.85, .06, .3]]) paint(ellPts(x + dx * s, y + dy * s, r * s, r * s * .85, 16), { wash: col, washOp: a, ink: null });
}
// the sky Hanuman flies through: blue above, warm low, clouds streaming past (speed 0..1 adds streaks)
function flySky(t, speed = 1, key = 'fly') {
  boilSeed(key + 'sky');
  paint(rectPts(-400, -400, W + 800, 1300), { wash: SJ.skyHi, ink: null });
  paint(rectPts(-400, 900, W + 800, 1500), { wash: SJ.skyLo, ink: null });
  paint(ellPts(540, 950, 1100, 380, 26), { fill: mixCol(SJ.skyHi, SJ.skyLo, .5), fillOp: 200, bleed: .3, tex: .4, border: .2, ink: null });
  for (let i = 0; i < 7; i++) {
    const sp = 260 + 160 * hash(i * 3.1), x = 1400 - frac(hash(i * 7.3) + t * sp / 1900) * 1900, y = 300 + hash(i * 5.1) * 1500 + t * 30;
    cloudPuff(x, y % 1900, 90 + 90 * hash(i * 1.9), key + i, 230);
  }
  if (speed > 0) { boilSeed(key + 'streak'); for (let i = 0; i < 9; i++) { const y = 260 + hash(i * 2.2) * 1400, x = 1200 - frac(hash(i * 4.4) + t * 1.6) * 1700; inkLine([[x, y], [x + 220, y + 30]], 2.2, mixCol(SJ.cloud, SJ.skyHi, .3), 'inkfine', 0); } }
}
// Lanka's battlefield: a dusk (night 0) or night (1) sky, the golden city on its hill, the dusty field
function battlefield(t, night = 0, key = 'bf') {
  boilSeed(key + 'sky');
  paint(rectPts(-400, -400, W + 800, 1700), { wash: mixCol(SJ.duskHi, SJ.nightHi, night), ink: null });
  paint(ellPts(540, 1150, 1100, 420, 26), { fill: mixCol(SJ.duskLo, SJ.nightLo, night), fillOp: 220, bleed: .3, tex: .4, border: .2, ink: null });
  if (night < .5) { glow(780, 1050, 380, '#FFC070', .5 * (1 - night * 2)); paint(ellPts(780, 1060, 70, 70, 20), { wash: SJ.sun, washOp: 255 * (1 - night * 2), ink: null }); }
  else { boilSeed(key + 'stars'); for (let i = 0; i < 22; i++) paint(starPts(-200 + hash(i * 2.3) * 1500, 250 + hash(i * 6.7) * 800, 3 + 4 * hash(i * 3.3) * (.6 + .4 * Math.sin(t * 2 + i)), .4, 4), { wash: '#FFF6DA', washOp: 255 * (night * 2 - 1), ink: null }); }
  // Lanka: towers and domes on a hill, far off
  boilSeed(key + 'lanka');
  const city = mixCol(SJ.lanka, SJ.lankaN, night), cityDk = mixCol(SJ.lankaDk, SJ.lankaN, night);
  paint([[-400, 1330], [-120, 1180], [160, 1150], [420, 1220], [620, 1300], [-400, 1400]], { wash: cityDk, ink: null, curv: .6 });
  for (let i = 0; i < 7; i++) {
    const x = -60 + i * 80, h = 90 + 120 * hash(i * 4.7), y = 1210 - Math.sin(i * .5) * 30;
    paint([[x - 26, y], [x - 26, y - h], [x, y - h - 50], [x + 26, y - h], [x + 26, y]], { wash: city, ink: mixCol(SJ.ink, city, .5), sw: .7, curv: .1 });
    paint(ellPts(x, y - h - 4, 22, 22, 12), { wash: city, ink: null });
  }
  boilSeed(key + 'field');
  paint([[-400, 1400], [200, 1360], [700, 1390], [1480, 1350], [1480, 2600], [-400, 2600]], { wash: mixCol(SJ.earth, SJ.earthN, night), fill: mixCol(SJ.earthDk, SJ.earthNDk, night), fillOp: 70, tex: .5, ink: SJ.ink, sw: .9, curv: .5 });
  // arrows stuck in the ground
  boilSeed(key + 'arrows');
  for (let i = 0; i < 6; i++) { const x = -50 + hash(i * 9.1) * 1200, y = 1480 + hash(i * 3.7) * 300, a = -.4 + hash(i * 1.3) * .8; inkLine([[x, y], [x + Math.sin(a) * 70, y - Math.cos(a) * 70]], 2.2, mixCol(SJ.shaftDk, SJ.earthNDk, night), 'ink', 0); }
}
// the Himalaya at night: stars, the moon, snowy peaks behind; sepia 0..1 turns it into the old-photo flashback
function himalaya(t, sepia = 0, key = 'hi') {
  const S = c => sepia > 0 ? mixCol(c, mixCol(SJ.sepia, c, .25), sepia) : c;
  boilSeed(key + 'sky');
  paint(rectPts(-400, -400, W + 800, 1800), { wash: S(SJ.hiSky), ink: null });
  paint(ellPts(540, 1250, 1100, 500, 26), { fill: S(SJ.hiSkyLo), fillOp: 220, bleed: .3, tex: .4, border: .2, ink: null });
  boilSeed(key + 'stars');
  for (let i = 0; i < 26; i++) paint(starPts(-200 + hash(i * 2.3) * 1500, 220 + hash(i * 6.7) * 760, 3 + 5 * hash(i * 3.3) * (.6 + .4 * Math.sin(t * 2 + i)), .4, 4), { wash: S('#FFF6DA'), ink: null });
  glow(250, 520, 220, S('#FFF0C0'), .45); paint(ellPts(250, 520, 64, 64, 20), { wash: S(SJ.moon), ink: null });
  boilSeed(key + 'peaks');
  paint([[-400, 1400], [-80, 1050], [80, 1120], [300, 860], [520, 1080], [700, 980], [900, 1160], [1080, 940], [1480, 1300], [1480, 1500], [-400, 1500]], { wash: S(SJ.snowDk), fill: S(SJ.rockDk), fillOp: 40, tex: .4, ink: S(SJ.ink), sw: .9, curv: .2 });
  paint([[300, 860], [360, 980], [330, 1080], [250, 980]], { wash: S(SJ.snow), ink: null, curv: .3 });
  paint([[1080, 940], [1120, 1040], [1060, 1100], [1010, 1020]], { wash: S(SJ.snow), ink: null, curv: .3 });
}

// ---------- props ----------
// Ravana's spear (Yuddha 100.30: made by Maya, hung with eight loud bells): from (x, y) along angle a (radians, 0 =
// screen right), len px. o.ring (seconds since a shake: the bells swing), o.part 'all' | 'tail' | 'head' (the two
// halves after Ram breaks it), o.glow (0..1, Maya's magic).
function bellSpear(x, y, len, a, o = {}) {
  const ca = Math.cos(a), sa = Math.sin(a), P = (d, n = 0) => [x + ca * d - sa * n, y + sa * d + ca * n], k = len / 500, sw = 1.3 * k;
  const part = o.part || 'all', mid = len * .55;
  boilSeed('spear' + (o.key || ''));
  if (o.glow) glow(...P(len * .85), 140 * k, '#C8A0FF', .6 * o.glow);
  if (part !== 'head') paint(ribbon([P(0), P(part === 'tail' ? mid - 10 : len * .78)], 12 * k, 10 * k), { wash: SJ.shaft, fill: SJ.shaftDk, fillOp: 60, ink: SJ.ink, sw });
  if (part !== 'tail') {
    if (part === 'head') paint(ribbon([P(mid + 10), P(len * .78)], 11 * k, 10 * k), { wash: SJ.shaft, ink: SJ.ink, sw });
    paint([P(len * .76, -14 * k), P(len * .84, -26 * k), P(len, 0), P(len * .84, 26 * k), P(len * .76, 14 * k)], { wash: SJ.blade, fill: SJ.bladeDk, fillOp: 70, ink: SJ.ink, sw, curv: .3 });
    inkLine([P(len * .78), P(len * .97)], .8 * k, SJ.bladeDk, 'inkfine', 0);
    // the eight bells hang on cords from a collar below the blade, swinging (they always hang down)
    paint(ribbon([P(len * .58, -8 * k), P(len * .74, -8 * k)], 8 * k, 8 * k), { wash: SJ.bell, ink: SJ.ink, sw: sw * .7 });
    for (let i = 0; i < 8; i++) {
      const [ax, ay] = P(len * (.585 + i * .021), 0), sx = o.ring != null ? Math.sin(o.ring * 22 + i * 1.3) * Math.exp(-o.ring * 2.5) * .5 : Math.sin(T * 6 + i) * .08;
      const L = (16 + (i % 2) * 7) * k, bx = ax + Math.sin(sx) * L, by = ay + Math.cos(sx) * L, b = 7 * k;
      inkLine([[ax, ay], [bx, by]], .9 * k, SJ.ink, 'inkfine', 0);
      push(); translate(bx, by); rotate(-sx);
      paint([[-b * .45, 0], [b * .45, 0], [b * .7, b * 1.2], [b * 1.05, b * 1.55], [-b * 1.05, b * 1.55], [-b * .7, b * 1.2]], { wash: SJ.bell, fill: SJ.bellDk, fillOp: 60, ink: SJ.ink, sw: sw * .6, curv: .4 });
      paint(ellPts(0, b * 1.75, b * .3, b * .3, 8), { wash: SJ.bellDk, ink: null });
      pop();
    }
  }
}
// one herb: a tuft of leaves in kind's colours (0..3), glowing (glow 0..1); s = its height in px; hide 0..1 sinks it
// into the ground (the herbs hiding from Hanuman, Yuddha 74)
function herb(x, y, s, kind, t, o = {}) {
  const [c, lt] = SJ.herbs[kind % 4], hide = clamp(o.hide || 0), k = 1 - hide * .92;
  if (k < .1) return;
  const sw = Math.sin(t * 2.2 + x * .01) * .08;
  if (o.glow) glow(x, y - s * .5 * k, s * 1.4, lt, .55 * o.glow * k);
  boilSeed('herb' + (o.key ?? x));
  for (let j = 0; j < 5; j++) {
    const a = -Math.PI / 2 + (j - 2) * .45 + sw, h = s * k * (j === 2 ? 1 : .78);
    const tip = [x + Math.cos(a) * h, y + Math.sin(a) * h], m = [x + Math.cos(a) * h * .5, y + Math.sin(a) * h * .5], nx = -Math.sin(a) * s * .16 * k, ny = Math.cos(a) * s * .16 * k;
    paint([[x, y], [m[0] + nx, m[1] + ny], tip, [m[0] - nx, m[1] - ny]], { wash: j % 2 ? c : lt, ink: SJ.ink, sw: .5, curv: .6 });
  }
  if (o.eyes && k > .5) {   // a hiding herb peeks: two dots that look at Hanuman
    paint(ellPts(x - s * .1, y - s * .45 * k, s * .07, s * .09, 8), { wash: SJ.ink, ink: null }); paint(ellPts(x + s * .1, y - s * .45 * k, s * .07, s * .09, 8), { wash: SJ.ink, ink: null });
  }
}
// The herb mountain's peak, its foot centred on (x, y), s wide (about 1.25 s tall): rock, a snow cap, mossy slopes with
// pines and the glowing herbs. o.herbs (default 14: how many glowing herbs), o.hide 0..1 (they sink), o.root 0..1 (torn
// out: a ragged rocky underside with roots and falling crumbs), o.glow (the herbs' light), o.key, o.sepia.
function herbPeak(x, y, s, t, o = {}) {
  const S = c => o.sepia ? mixCol(c, mixCol(SJ.sepia, c, .25), o.sepia) : c, key = o.key || 'peak', h = s * 1.25, root = clamp(o.root || 0);
  const outline = [[-.5, 0], [-.42, -.22], [-.3, -.38], [-.2, -.62], [-.08, -.84], [0, -1], [.1, -.86], [.2, -.7], [.3, -.5], [.4, -.3], [.5, 0]].map(([a, b]) => [x + a * s, y + b * h]);
  if (o.glow) glow(x, y - h * .4, s * .9, S('#C8FFD0'), .35 * o.glow);
  boilSeed(key + 'rock');
  if (root > 0) {   // the torn underside: a ragged wedge of rock with roots
    const under = [[-.5, 0], [-.36, .12], [-.24, .2], [-.1, .3], [0, .34], [.12, .28], [.26, .18], [.4, .1], [.5, 0]].map(([a, b], i) => [x + a * s, y + b * h * root + (i % 2 ? 8 : -6) * root]);
    paint(under, { wash: S(SJ.rockDk), fill: S('#3A3450'), fillOp: 80, tex: .6, ink: S(SJ.ink), sw: 1, curv: .2 });
    for (let i = 0; i < 6; i++) { const rx = x + (-.35 + i * .14) * s, ry = y + (.06 + .1 * hash(i)) * h * root; inkLine([[rx, ry], [rx + 10 * Math.sin(i + t * 3), ry + 40 * root], [rx - 6, ry + 70 * root]], 2.2, S(SJ.root), 'ink', .5); }
  }
  paint(outline, { wash: S(SJ.rock), fill: S(SJ.rockDk), fillOp: 60, tex: .5, ink: S(SJ.ink), sw: 1.2, curv: .25 });
  paint([[x - .08 * s, y - .84 * h], [x, y - h], [x + .1 * s, y - .86 * h], [x + .14 * s, y - .76 * h], [x + .04 * s, y - .8 * h], [x - .04 * s, y - .72 * h], [x - .12 * s, y - .76 * h]], { wash: S(SJ.snow), ink: null, curv: .3 });
  boilSeed(key + 'moss');
  paint([[x - .44 * s, y - .02 * h], [x - .3 * s, y - .36 * h], [x - .05 * s, y - .5 * h], [x + .22 * s, y - .44 * h], [x + .42 * s, y - .1 * h], [x + .46 * s, y - .02 * h]], { wash: S(SJ.moss), fill: S(SJ.mossDk), fillOp: 60, tex: .5, ink: null, curv: .6 });
  for (let i = 0; i < 6; i++) {   // little pines
    const px = x + (-.36 + i * .14 + .04 * hash(i * 3.1)) * s, py = y - (.1 + .26 * hash(i * 5.3)) * h, ph = s * (.07 + .03 * hash(i));
    paint([[px, py - ph], [px + ph * .45, py], [px - ph * .45, py]], { wash: S(SJ.mossDk), ink: S(SJ.ink), sw: .5 });
  }
  const n = o.herbs ?? 14;
  for (let i = 0; i < n; i++) {
    const hx = x + (-.36 + .72 * hash(i * 2.7 + 1)) * s, hy = y - (.06 + .36 * hash(i * 4.1 + 2)) * h * (1 - Math.abs(hash(i * 2.7 + 1) - .5));
    const hide = o.hide == null ? 0 : typeof o.hide === 'function' ? o.hide(i) : o.hide;
    herb(hx, hy, s * .095, i % 4, t, { glow: o.glow ?? 1, hide, key: key + 'h' + i, eyes: o.eyes });
  }
}
// a stone mortar with a pestle grinding (grind: phase, 0 = still), at (x, y) its foot, s its width
function mortar(x, y, s, grind = 0, key = 'mortar') {
  boilSeed(key);
  paint([[x - s * .5, y - s * .5], [x + s * .5, y - s * .5], [x + s * .38, y - s * .08], [x + s * .3, y], [x - s * .3, y], [x - s * .38, y - s * .08]], { wash: SJ.stone, fill: SJ.stoneDk, fillOp: 60, tex: .4, ink: SJ.ink, sw: 1, curv: .4 });
  paint(ellPts(x, y - s * .5, s * .5, s * .1, 16), { wash: SJ.stoneDk, ink: SJ.ink, sw: .8 });
  paint(ellPts(x, y - s * .5, s * .4, s * .07, 14), { wash: SJ.herbs[1][0], ink: null });
  const a = -.5 + Math.sin(grind * TAU) * .35, px = x + Math.cos(grind * TAU) * s * .12;
  paint(ribbon([[px, y - s * .52], [px + Math.sin(a) * s * .8, y - s * .52 - Math.cos(a) * s * .8]], s * .14, s * .1), { wash: SJ.stone, ink: SJ.ink, sw: .8 });
}
// a thought bubble (screen or world), w × h around (x, y), trailing toward (tx, ty); pop = seconds since it appeared
function thought(x, y, w, h, tx, ty, pop, key = 'bub') {
  const k = backOut(clamp(pop * 3)); if (k < .02) return;
  boilSeed(key);
  for (let i = 0; i < 3; i++) { const q = (i + 1) / 4, r = 10 + i * 7; paint(ellPts(lerp(tx, x, q), lerp(ty, y + h * .4, q), r * k, r * k, 10), { wash: SJ.cream, ink: SJ.ink, sw: .8 }); }
  paint(ellPts(x, y, w * .5 * k, h * .5 * k, 22, 6), { wash: SJ.cream, ink: SJ.ink, sw: 1.2, curv: .8 });
}

// ---------- the cast ----------
// Sushena, the vanara vaidya (Tara's father): Hanuman's rig in grey fur with a white beard, no crown, a white dhoti
const SUSH_PAL = { skin: '#A8A4A0', skinDk: '#7E7A76', skinLt: '#CFCBC6', fur: '#A8A4A0', furDk: '#7E7A76', furLt: '#CFCBC6', mask: '#EAD8C6', maskDk: '#C8B29C',
  dhoti: '#F4ECDC', dhotiDk: '#D2C6AE', dhotiLt: '#FFFFFF', border: '#2E7A6A', tilak: '#F4ECDC' };
const sushBeard = (u, sw) => {
  const P = pts => U(pts, u);
  paint(P([[-1.9, -17.9], [-1.5, -16.6], [-.8, -15.4], [0, -14.7], [.8, -15.4], [1.5, -16.6], [1.9, -17.9], [1, -17.4], [0, -17.2], [-1, -17.4]]), { wash: '#F4F0EA', fill: '#D8D2CA', fillOp: 50, tex: .5, ink: SJ.ink, sw: sw * .7, curv: .45 });
  for (const k of [-.8, 0, .8]) inkLine(P([[k * .9, -16.9], [k, -16], [k * .7, -15.3]]), sw * .4, '#C8C2BA', 'inkfine', .5);
};
function sushena(x, y, u, o = {}) { return hanuman(x, y, u, { crown: false, gada: 0, tail: 'droop', hat: sushBeard, ...o, pal: { ...HNM, ...SUSH_PAL, ...(o.pal || {}) } }); }

// ---------- the card ----------
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

// ---------- a test sheet of the cast and props: ?loop=sanj ----------
LOOPS.sanj = t => {
  himalaya(t);
  herbPeak(300, 1700, 520, t, { key: 'tp' });
  herbPeak(820, 1500, 360, t, { key: 'tp2', root: 1 });
  sushena(220, 1150, 18, { boilKey: 'ts', eyes: 'squint', mouth: 'smile' });
  lakshman(700, 1050, 18, { boilKey: 'tl', rot: -Math.PI / 2, eyes: 'closed' });
  const fo = { boilKey: 'th', rot: 1.0, handR: [1.5, -29], bendR: .4, tail: 'curl' };
  hanuman(560, 820, 16, fo);
  bellSpear(80, 300, 520, -.2, { key: 'tsp' });
  mortar(900, 1850, 140, t);
  herb(150, 1880, 80, 0, t, { glow: 1 }); herb(300, 1880, 80, 1, t, { glow: 1, eyes: 1 }); herb(450, 1880, 80, 2, t, { hide: .5 });
};
LOOPS.sanj.len = 2;
