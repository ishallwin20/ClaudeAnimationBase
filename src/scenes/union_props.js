// union_props.js: the set and props for "Maa Durga's LION just went ON STRIKE." (src/scenes/union.js). Loaded before
// it; everything here is a pure function of its arguments (and T for boil).
//
//   TK, sparkleBurst, vanishPuff, whipH       copied from ad 8 / ad 9
//   UN                                         the palette of this reel
//   unionSet(t, o)                             the night dharna under a striped Navratri shamiana (world space)
//   placard(x, y, w, h, o)                     a protest placard on a pole; flips to its back side
//   megaphone(x, y, a, s, o)                   a megaphone, mouthpiece at (x, y), pointing along a
//   lionBand(o), sideBand(x, y, s, a, o)       the red union headband: a hat hook for lion(); one on a side-view head
//   ICONS, rosterStrip(t, R), rosterBoard(...) the nine-night duty roster: the strip in the top band and the 3×3 board
//   virtueTag(x, y, txt, age, o)               a gold ribbon label that pops over a vahana
//   petalRain(t, t0, o)                        marigold petals falling (screen space)
//   unionCard(t, C)                            the end card: Books 1–3 as Nights 1–3
const TK = {
  ink: '#2B2233', cream: '#FFF5E2',
  petal: '#F4A6B8', petalDk: '#E0708C', marigold: '#F39A2E', yellow: '#FFD45A', leaf: '#5E9A6A',
  gold: '#EDB43C', goldLt: '#FFE39A', goldDk: '#B67D1C',
  rkOrange: '#F15A24', peach: '#FBE0CF', peachLt: '#FFF1E6', brown: '#3A2418', grey: '#6B5A50', teal: '#2E5F5A',
};
const UN = {
  ink: '#3A2420', night: '#1E2150', nightLt: '#2C3068', star: '#FFF1C8',
  cloth: '#F2B45E', clothDk: '#D9903A', clothLt: '#F9CD84', red: '#C8323A', redDk: '#962430', cream: '#F7E6C0', yellow: '#F7C341',
  pole: '#B88A4A', poleDk: '#8A6230', rug: '#9A2E3A', rugDk: '#74202C', rugBand: '#F0D9A8', rugBlue: '#2E4A7A', earth: '#4A3028',
  card: '#F4E4C2', cardDk: '#D8C29A', cardJai: '#FFD45A', cardJaiDk: '#E0A62A', text: '#B5262E', textJai: '#B5262E',
  mega: '#F6F0E2', megaDk: '#C9C0AE', megaBand: '#D2352C', grip: '#3A3440',
  band: '#D2352C', bandDk: '#9E2420', bulb: ['#FFD45A', '#FF8A5A', '#8AE0C0', '#FFB0D0'],
  tile: '#FFF4DC', tileDk: '#E8CFA0', tileEdge: '#B67D1C', tileEmpty: '#F2E2C2',
};

// ---------- copied from ad 8 / ad 9 ----------
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
// Horizontal speed streaks for a whip pan: k 0..1 strength, dir ±1.
function whipH(k, dir = 1, t = 0, cols = [TK.cream, '#FFD9A0']) {
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

// ---------- the set ----------
// The dharna under a shamiana, in world space (1080 × 1920, the wide shot shows y 40..1960). o: warm 0..1 (golden light,
// for Brahmacharini), banner (false hides it)
function unionSet(t, o = {}) {
  const warm = clamp(o.warm || 0);
  boilSeed('sky');
  paint(rectPts(-300, -300, W + 600, 940), { wash: UN.night, ink: null });
  for (let i = 0; i < 16; i++) { const x = hash(i * 3.1) * 1300 - 110, y = 240 + hash(i * 5.7) * 300, r = 2.5 + 3 * hash(i * 1.9) * (.7 + .3 * Math.sin(t * 2 + i)); paint(ellPts(x, y, r, r, 6), { wash: UN.star, ink: null }); }
  // the back cloth: saffron panels with soft folds
  boilSeed('cloth');
  paint(rectPts(-300, 700, W + 600, 660), { wash: mixCol(UN.cloth, '#FFC870', warm * .4), fill: UN.clothDk, fillOp: 50, bleed: .05, tex: .6, border: .3, ink: null });
  for (let i = 0; i < 11; i++) { const x = -130 + i * 135 + 10 * Math.sin(t * .8 + i); inkLine([[x, 760], [x + 8, 1000], [x - 4, 1300]], 3, UN.clothDk, 'dry', .5); }
  paint(rectPts(-300, 1180, W + 600, 180), { fill: UN.clothDk, fillOp: 70, bleed: .2, tex: .5, border: .2, ink: null });   // shade at the foot
  // the durrie: deep red with cream and indigo bands, then the earth
  boilSeed('rug');
  paint([[-300, 1300], [W + 300, 1300], [W + 300, 2000], [-300, 2000]], { wash: UN.earth, ink: null });
  paint([[-60, 1290], [W + 60, 1290], [W + 160, 1720], [-160, 1720]], { wash: UN.rug, fill: UN.rugDk, fillOp: 60, bleed: .05, tex: .6, border: .3, ink: UN.ink, sw: 2 });
  for (const [y, c, w] of [[1330, UN.rugBand, 12], [1352, UN.rugBlue, 7], [1520, UN.rugBand, 14], [1545, UN.rugBlue, 8], [1690, UN.rugBand, 12]]) {
    const k = (y - 1290) / 430;
    paint(rectPts(-60 - 100 * k, y, W + 120 + 200 * k, w), { wash: c, ink: null });
  }
  // bamboo poles
  boilSeed('poles');
  for (const x of [26, 1054]) { paint(rectPts(x - 15, 700, 30, 800), { wash: UN.pole, ink: UN.ink, sw: 2 }); for (let y = 800; y < 1480; y += 170) inkLine([[x - 15, y], [x + 15, y + 4]], 3, UN.poleDk, 'ink', 0); }
  // fairy lights, swagged across
  boilSeed('bulbs');
  const sag = x => 800 + 60 * Math.sin(Math.PI * clamp((x + 40) / 1160));
  inkLine(Array.from({ length: 12 }, (_, i) => { const x = -40 + i * 105; return [x, sag(x)]; }), 2, UN.ink, 'inkfine', .5);
  for (let i = 0; i < 15; i++) { const x = -20 + i * 80, y = sag(x) + 14, c = UN.bulb[i % 4], on = .6 + .4 * Math.sin(t * 5 + i * 1.7); glow(x, y, 46, c, .5 * on); paint(ellPts(x, y, 9, 12, 8), { wash: c, ink: UN.ink, sw: 1 }); }
  // marigold strings hanging from the valance
  boilSeed('marigold');
  for (let j = 0; j < 7; j++) {
    const x = 70 + j * 157, n = 6 + (j % 2) * 2, sw = 4 * Math.sin(t * 1.3 + j);
    for (let i = 0; i < n; i++) { const y = 760 + i * 24; paint(ellPts(x + sw * i / n, y, 12, 11, 8, 1.5), { wash: i % 3 === 2 ? UN.yellow : TK.marigold, ink: null }); }
    paint(ellPts(x + sw, 760 + n * 24 - 4, 7, 10, 6), { wash: TK.leaf, ink: null });
  }
  // the valance: red and cream stripes with a scalloped hem, the banner on it
  boilSeed('valance');
  paint(rectPts(-300, 540, W + 600, 210), { wash: UN.cream, ink: null });
  for (let i = 0; i < 20; i++) paint(rectPts(-250 + i * 80, 540, 40, 210), { wash: UN.red, ink: null });
  for (let i = 0; i < 18; i++) { const x = -200 + i * 80; paint([[x, 745], [x + 80, 745], [x + 72, 770], [x + 40, 782], [x + 8, 770]], { wash: i % 2 ? UN.red : UN.yellow, ink: UN.ink, sw: 1.5, curv: .4 }); }
  inkLine([[-300, 748], [W + 300, 748]], 3, UN.ink, 'ink', 0);
  if (o.banner !== false) {
    boilSeed('banner');
    paint(rrPts(150, 600, 780, 120, 14), { wash: UN.cream, ink: UN.red, sw: 5 });
    letter('NAVRATRI VAHANA UNION', 540, 663, 56, UN.red, { font: '700 56px Poppins', ink: false, maxW: 740 });
  }
  if (warm > 0) glow(300, 1150, 900, '#FFD27A', .35 * warm);
}

// ---------- props ----------
// A protest placard: board centred at (x, y), w × h, on a pole of length o.pole hanging below (0 for none). o: txt, back
// (the other side's text), flip 0..1 (squashes across and turns it over at .5), rot (about the board's centre), size
// (letter px), hang (true: hung on a string from its top corners instead of a pole: the string's top at o.hangAt), key, gone
function placard(x, y, w, h, o = {}) {
  if (o.gone) return;
  const f = clamp(o.flip || 0), sx = Math.max(.04, Math.abs(Math.cos(f * Math.PI))), back = f > .5, r = o.rot || 0;
  boilSeed('placard ' + (o.key || ''));
  push(); translate(x, y); rotate(r);
  if (o.pole) { paint(rectPts(-7, -10, 14, o.pole + 10), { wash: UN.pole, ink: UN.ink, sw: 1.6 }); }
  if (o.hang) { const [hx, hy] = o.hang; inkLine([[-w * .4 * sx, -h / 2 + 6], [hx - x, hy - y]], 2.4, UN.ink, 'inkfine', 0); inkLine([[w * .4 * sx, -h / 2 + 6], [hx - x, hy - y]], 2.4, UN.ink, 'inkfine', 0); }
  push(); scale(sx, 1);
  paint(rrPts(-w / 2, -h / 2, w, h, 8, 1.5), { wash: back ? UN.cardJai : UN.card, fill: back ? UN.cardJaiDk : UN.cardDk, fillOp: 60, bleed: .05, tex: .5, border: .5, ink: UN.ink, sw: 2.4 });
  pop(); pop();
  const txt = back ? o.back : o.txt;
  if (txt && sx > .4 && !o.noText) letter(txt, x, y + 2, (o.size || h * .42) * (.5 + .5 * sx), back ? UN.textJai : UN.text, { rot: r - .03, maxW: (w - 18) * sx, ink: false, font: `${Math.round((o.size || h * .42) * (.5 + .5 * sx))}px "Permanent Marker"` });
}
// A megaphone: the mouthpiece at (x, y), pointing along angle a, s = its length / 3. o.yell 0..1 (rings at the bell)
function megaphone(x, y, a, s, o = {}) {
  boilSeed('mega ' + (o.key || ''));
  push(); translate(x, y); rotate(a); if (o.mirror) scale(1, -1);
  paint([[0, -.22 * s], [.45 * s, -.28 * s], [2.9 * s, -1.05 * s], [3.05 * s, 0], [2.9 * s, 1.05 * s], [.45 * s, .28 * s], [0, .22 * s]], { wash: UN.mega, fill: UN.megaDk, fillOp: 70, tex: .4, ink: UN.ink, sw: 2.4, curv: .1 });
  paint([[1.7 * s, -.72 * s], [2.05 * s, -.84 * s], [2.05 * s, .84 * s], [1.7 * s, .72 * s]], { wash: UN.megaBand, ink: null });
  paint(ellPts(2.98 * s, 0, .22 * s, 1.05 * s, 14), { wash: UN.megaDk, ink: UN.ink, sw: 2 });
  paint(rrPts(.8 * s, .25 * s, .38 * s, .9 * s, .1 * s), { wash: UN.grip, ink: UN.ink, sw: 1.6 });   // the grip, under it
  pop();
  const yell = clamp(o.yell || 0);
  if (yell > 0) {
    boilSeed('megarings ' + (o.key || ''));
    for (let i = 0; i < 3; i++) {
      const k = frac(T * 2.2 + i / 3), r = s * (1 + k * 2.2), cx = x + Math.cos(a) * s * (3.1 + k * 1.6), cy = y + Math.sin(a) * s * (3.1 + k * 1.6);
      const P = [-.9, -.45, 0, .45, .9].map(d => [cx + Math.cos(a + d) * r * .35, cy + Math.sin(a + d) * r * .35]);
      inkLine(P, 6 * (1 - k) * yell, UN.ink, 'ink', .6);
    }
  }
}
// The union headband for lion(): a hat hook (head coordinates), knot tails fluttering off his right (screen-left)
function lionBand(o = {}) {
  return (u, sw) => {
    const P = pts => U(pts, u), fl = Math.sin(T * 9) * .25 + (o.wind || 0);
    paint(P([[-2.55, -13.85], [-1.2, -14.4], [1.2, -14.4], [2.55, -13.85], [2.68, -13.35], [1.2, -13.88], [-1.2, -13.88], [-2.68, -13.35]]), { wash: UN.band, ink: UN.ink, sw: sw * .7, curv: .4 });
    inkLine(P([[-2.1, -13.9], [-.6, -14.22], [.8, -14.2]]), sw * .45, UN.bandDk, 'inkfine', .5);
    paint(P(ribbon([[-2.65, -13.6], [-3.6, -13.9 + fl * .3], [-4.5, -13.3 + fl * .8]], .42, .2)), { wash: UN.band, ink: UN.ink, sw: sw * .6 });
    paint(P(ribbon([[-2.65, -13.5], [-3.5, -13.0 + fl * .2], [-4.2, -12.0 + fl * .6]], .4, .18)), { wash: UN.bandDk, ink: UN.ink, sw: sw * .6 });
    paint(ellPts(-2.66 * u, -13.6 * u, .3 * u, .3 * u, 8), { wash: UN.bandDk, ink: UN.ink, sw: sw * .5 });
  };
}
// A headband on a side-view head: centred at (x, y), s = the animal's u, a = the band's angle, dir = which way the
// tails stream (-1 left)
function sideBand(x, y, s, a, dir, key) {
  boilSeed('band ' + key);
  const fl = Math.sin(T * 9 + x) * .3;
  push(); translate(x, y); rotate(a);
  paint([[-1.1 * s, -.35 * s], [1.1 * s, -.3 * s], [1.1 * s, .3 * s], [-1.1 * s, .35 * s]], { wash: UN.band, ink: UN.ink, sw: 1.8, curv: .3 });
  const bx = dir * 1.1 * s;
  paint(ribbon([[bx, 0], [bx + dir * .9 * s, (-.2 + fl) * s], [bx + dir * 1.8 * s, (.1 + fl * 1.6) * s]], .32 * s, .14 * s), { wash: UN.band, ink: UN.ink, sw: 1.4 });
  paint(ribbon([[bx, .1 * s], [bx + dir * .8 * s, (.5 + fl * .5) * s], [bx + dir * 1.5 * s, (.9 + fl) * s]], .3 * s, .12 * s), { wash: UN.bandDk, ink: UN.ink, sw: 1.4 });
  pop();
}

// ---------- the roster ----------
// Painted heads for the tiles, centred at (x, y), radius r
const ICONS = {
  lion(x, y, r) {
    paint(lionLobes(x, y, r * 1.05, r, 11, .2, .2), { wash: LIO.maneDk, ink: UN.ink, sw: r * .05, curv: .45 });
    paint(lionLobes(x, y - r * .03, r * .9, r * .85, 10, .16, .5), { wash: LIO.mane, ink: null, curv: .45 });
    paint(ellPts(x, y + r * .02, r * .6, r * .56, 16), { wash: LIO.body, ink: UN.ink, sw: r * .045 });
    ICONS._face(x, y, r, LIO.cream, LIO.nose);
  },
  tiger(x, y, r) {
    for (const s of [-1, 1]) paint(ellPts(x + s * r * .58, y - r * .55, r * .25, r * .25, 10), { wash: TGR.stripe, ink: UN.ink, sw: r * .04 });
    paint(ellPts(x, y, r * .82, r * .72, 18), { wash: TGR.body, ink: UN.ink, sw: r * .05 });
    for (const s of [-1, 1]) { paint(ribbon([[x + s * r * .82, y - r * .1], [x + s * r * .5, y - r * .05]], r * .12, r * .02), { wash: TGR.stripe, ink: null }); paint(ribbon([[x + s * r * .78, y + r * .18], [x + s * r * .5, y + r * .2]], r * .1, r * .02), { wash: TGR.stripe, ink: null }); }
    paint(ribbon([[x, y - r * .7], [x, y - r * .42]], r * .12, r * .03), { wash: TGR.stripe, ink: null });
    ICONS._face(x, y, r, TGR.cream, LIO.nose);
  },
  bull(x, y, r) {
    for (const s of [-1, 1]) paint(ribbon([[x + s * r * .35, y - r * .5], [x + s * r * .75, y - r * .75], [x + s * r * .7, y - r * 1.05]], r * .16, r * .05), { wash: NAN.horn, ink: UN.ink, sw: r * .04 });
    for (const s of [-1, 1]) paint(ellPts(x + s * r * .72, y - r * .25, r * .3, r * .15, 10, 0, s * .3), { wash: NAN.body, ink: UN.ink, sw: r * .04 });
    paint([[x - r * .55, y - r * .55], [x + r * .55, y - r * .55], [x + r * .45, y + r * .4], [x, y + r * .7], [x - r * .45, y + r * .4]], { wash: NAN.body, ink: UN.ink, sw: r * .05, curv: .5 });
    paint(ellPts(x, y + r * .45, r * .38, r * .25, 12), { wash: '#C9B8B4', ink: UN.ink, sw: r * .04 });
    for (const s of [-1, 1]) paint(ellPts(x + s * r * .26, y - r * .12, r * .08, r * .1, 8), { wash: UN.ink, ink: null });
    paint(ellPts(x, y - r * .4, r * .07, r * .1, 8), { wash: UN.red, ink: null });
  },
  donkey(x, y, r) {
    for (const s of [-1, 1]) paint(ellPts(x + s * r * .38, y - r * .75, r * .18, r * .5, 12, 0, s * .25), { wash: DNK.body, ink: UN.ink, sw: r * .04 });
    paint([[x - r * .5, y - r * .45], [x + r * .5, y - r * .45], [x + r * .42, y + r * .35], [x, y + r * .62], [x - r * .42, y + r * .35]], { wash: DNK.body, ink: UN.ink, sw: r * .05, curv: .5 });
    paint(ellPts(x, y + r * .38, r * .36, r * .26, 12), { wash: DNK.cream, ink: UN.ink, sw: r * .04 });
    for (const s of [-1, 1]) paint(ellPts(x + s * r * .24, y - r * .12, r * .08, r * .1, 8), { wash: UN.ink, ink: null });
    paint(ribbon([[x - r * .15, y - r * .52], [x + r * .1, y - r * .62], [x + r * .2, y - r * .45]], r * .12, r * .04), { wash: '#4A4048', ink: null });
  },
  feet(x, y, r) {
    for (const s of [-1, 1]) {
      const fx = x + s * r * .3, fy = y + s * r * .12;
      paint([[fx - r * .17, fy - r * .25], [fx + r * .17, fy - r * .25], [fx + r * .2, fy + r * .2], [fx, fy + r * .42], [fx - r * .2, fy + r * .2]], { wash: PRV.skin, ink: UN.ink, sw: r * .04, curv: .6 });
      for (let i = 0; i < 5; i++) paint(ellPts(fx - r * .2 + i * r * .1, fy - r * (.36 + (i === 0 ? .04 : 0)) + Math.abs(i - 1) * r * .02, r * (i === 0 ? .07 : .05), r * (i === 0 ? .07 : .05), 6), { wash: PRV.skin, ink: UN.ink, sw: r * .025 });
    }
  },
  _face(x, y, r, cream, nose) {
    for (const s of [-1, 1]) { paint(ellPts(x + s * r * .2, y + r * .25, r * .24, r * .18, 10), { wash: cream, ink: null }); paint(ellPts(x + s * r * .26, y - r * .12, r * .08, r * .1, 8), { wash: UN.ink, ink: null }); }
    paint([[x - r * .12, y + r * .08], [x + r * .12, y + r * .08], [x, y + r * .2]], { wash: nose, ink: null });
  },
};
const ROSTER = [
  ['bull', 'Shailputri', 'Bull'], ['feet', 'Brahmacharini', 'Walks barefoot'], ['tiger', 'Chandraghanta', 'Tigress'],
  ['lion', 'Kushmanda', 'Lion'], ['lion', 'Skandamata', 'Lion'], ['lion', 'Katyayani', 'Lion'],
  ['donkey', 'Kalaratri', 'Donkey'], ['bull', 'Mahagauri', 'Bull'], ['lion', 'Siddhidatri', 'Lion'],
];
// One tile at (cx, cy), w × h, in screen space. fill = seconds since its icon stamped in (< 0 empty); big 0..1 the board
// look (name and vahana under the icon); pulse 0..1 (empty and asked about: it glows)
function rosterTile(i, cx, cy, w, h, fill, big, pulse) {
  const k = fill >= 0 ? backOut(clamp(fill * 4)) : 0, filled = fill >= 0;
  boilSeed('tile ' + i);
  if (pulse > 0) glow(cx, cy, w * 1.1, '#FFE08A', .7 * pulse);
  paint(rrPts(cx - w / 2, cy - h / 2, w, h, 12, 1), { wash: filled ? UN.tile : UN.tileEmpty, fill: UN.tileDk, fillOp: 40, tex: .4, ink: pulse > 0 ? '#E07A1A' : UN.tileEdge, sw: pulse > 0 ? 4 : 2.6 });
  const iy = cy - h * .5 + h * lerp(.55, .36, big), r = Math.min(w, h) * lerp(.3, .24, big);
  if (k > .02) { push(); translate(cx, iy); scale(k); ICONS[ROSTER[i][0]](0, 0, r); pop(); }
  if (fill >= 0 && fill < .4) { const a = fill / .4; inkLine(ellPts(cx, iy, r * (1.1 + a), r * (1.1 + a), 20), 5 * (1 - a), '#E07A1A', 'ink', .5); }
  const ns = big > 0 ? 26 : 22;
  letter(String(i + 1), cx - w / 2 + (big > 0 ? 22 : 15), cy - h / 2 + (big > 0 ? 20 : 15), ns, UN.red, { screen: true, font: `700 ${ns}px Poppins`, ink: false });
  if (fill < 0 && pulse > 0) letter('?', cx, iy, 54, '#E07A1A', { screen: true, pop: pulse * 3, ink: false });
  if (big > .6 && filled) {
    const a = seg(big, .6, 1);
    letter(ROSTER[i][1], cx, cy + h * .22, 30, TK.brown, { screen: true, font: '700 30px Poppins', ink: false, maxW: w - 16, alpha: a });
    letter(ROSTER[i][2], cx, cy + h * .38, 24, TK.grey, { screen: true, font: '500 24px Poppins', ink: false, maxW: w - 16, alpha: a });
  }
}
// The strip (nine tiles in the top band) → the 3×3 board. R: fills[i] (stamp times, or null), t, drop (0..1 the strip
// slides in), board (0..1 the morph), pulse2 (0..1)
function rosterStrip(R) {
  const drop = clamp(R.drop ?? 1), bk = clamp(R.board || 0);
  if (drop <= 0) return;
  boilSeed('boardbg');
  push(); translate(0, -(1 - easeOut(drop)) * 200);
  paint(rrPts(lerp(42, 70, bk), lerp(432, 520, bk), lerp(898, 840, bk), lerp(120, 712, bk), lerp(16, 24, bk)), { wash: UN.cream, fill: UN.tileDk, fillOp: 50, tex: .4, ink: UN.red, sw: lerp(3, 5, bk) });
  pop();
  if (bk > 0) {
    if (bk > .5) letter('NAVRATRI DUTY ROSTER', 490, 568, 44, UN.red, { screen: true, font: '700 46px Poppins', ink: false, maxW: 780, pop: (bk - .5) * 6 });
  }
  for (let i = 0; i < 9; i++) {
    const kb = ease(clamp(bk * 1.6 - (i % 3) * .1 - Math.floor(i / 3) * .08));
    const sx = 103 + i * 97, sy = 492 - (1 - easeOut(drop)) * 200, gx = 210 + (i % 3) * 280, gy = 700 + Math.floor(i / 3) * 205;
    const f = R.fills[i] == null ? -1 : R.t - R.fills[i];
    rosterTile(i, lerp(sx, gx, kb), lerp(sy, gy, kb), lerp(88, 262, kb), lerp(100, 190, kb), f, kb, i === 1 ? (R.pulse2 || 0) : 0);
  }
}
// A gold ribbon label popping over a vahana (world space; letters follow the camera)
function virtueTag(x, y, txt, age, o = {}) {
  if (age < 0) return;
  const k = backOut(clamp(age * 4)), w = o.w || 240;
  boilSeed('tag ' + txt);
  push(); translate(x, y); scale(k); rotate(o.rot || -.04);
  glow(0, 0, w * .7, '#FFE08A', .5);
  paint([[-w / 2, -30], [w / 2, -30], [w / 2 + 22, 0], [w / 2, 30], [-w / 2, 30], [-w / 2 - 22, 0]], { wash: TK.gold, fill: TK.goldDk, fillOp: 60, tex: .4, ink: UN.ink, sw: 2.6 });
  pop();
  if (k > .3) letter(txt, x, y + 2, 40 * k, TK.brown, { font: `700 ${Math.round(40 * k)}px Poppins`, ink: false, rot: o.rot || -.04, maxW: w });
}
// Marigold petals falling from the top over age seconds (screen space), n of them
function petalRain(t, t0, o = {}) {
  const age = t - t0; if (age < 0) return;
  boilSeed('petalrain');
  const n = o.n || 26;
  for (let i = 0; i < n; i++) {
    const st = hash(i * 1.7) * .6, a = age - st; if (a < 0) continue;
    const x = hash(i * 3.3) * 1100 + 40 * Math.sin(a * 2 + i), y = -40 + a * (380 + 200 * hash(i * 5.1)), r = a * 3 + i;
    if (y > H + 40) continue;
    paint([[x + Math.cos(r) * 17, y + Math.sin(r) * 17], [x + Math.cos(r + 1.6) * 8, y + Math.sin(r + 1.6) * 8], [x - Math.cos(r) * 17, y - Math.sin(r) * 17], [x + Math.cos(r - 1.6) * 8, y + Math.sin(r - 1.6) * 8]], { wash: i % 3 ? TK.marigold : UN.yellow, ink: null, curv: .5 });
  }
}

// ---------- the card ----------
function unionCard(t, C) {
  boilSeed('cardbg');
  paint(rectPts(-60, -60, W + 120, H + 120), { wash: TK.peach, ink: null });
  boilSeed('cardpetals');
  for (let i = 0; i < 9; i++) {
    const x = 60 + hash(i * 3.3) * 960 + 30 * Math.sin(t * .9 + i), y = frac(hash(i * 7.1) + t * (.035 + .02 * hash(i))) * (H + 80) - 40, r = t * .8 + i;
    paint([[x + Math.cos(r) * 15, y + Math.sin(r) * 15], [x + Math.cos(r + 1.6) * 7, y + Math.sin(r + 1.6) * 7], [x - Math.cos(r) * 15, y - Math.sin(r) * 15], [x + Math.cos(r - 1.6) * 7, y + Math.sin(r - 1.6) * 7]], { wash: i % 2 ? TK.marigold : TK.petal, washOp: 200, ink: null, curv: .5 });
  }
  const X = 470, pk = t0 => Math.max(0, t - t0) * 5, br = Math.sin(t * 1.3) * .01;
  if (t > C.cap) letter('Nights 1–3, as picture books', X, 660, 56, TK.teal, { screen: true, font: '50px Marcellus', ink: false, pop: pk(C.cap), maxW: 860 });
  [1, 2, 3].forEach((b, j) => {
    const t0 = C.covers + j * .15; if (t < t0) return;
    const x = X + (j - 1) * 290, y = 900 + (j === 1 ? -16 : 0);
    picture(PICS['book' + b], x, y, 276, 276, { rot: (j - 1) * .05 + (j % 2 ? br : -br), pop: pk(t0), r: 8, shadow: 18 });
    letter('Night ' + b, x, y + 170, 34, TK.rkOrange, { screen: true, font: '700 32px Poppins', ink: false, pop: pk(t0 + .1) });
  });
  if (t > C.price) {
    letter('Books 1–3 · OUT NOW', X, 1160, 46, TK.brown, { screen: true, font: '700 50px Poppins', ink: false, maxW: 860, pop: pk(C.price) });
    letter('Set of 3 for ₹500', X, 1226, 44, TK.rkOrange, { screen: true, font: '700 52px Poppins', ink: false, maxW: 860, pop: pk(C.price + .12) });
  }
  if (t > C.logo) picture(PICS.logo, X, 530, 140, 140, { pop: pk(C.logo) });
  if (t > C.pill) {
    const k = backOut(clamp(pk(C.pill))) * (1 + .03 * pulse(t, 4));
    boilSeed('pill');
    push(); translate(X, 1325); scale(k); paint(rrPts(-220, -44, 440, 88, 44), { wash: TK.rkOrange, ink: null }); pop();
    letter('rishikatha.com', X, 1327, 50, TK.cream, { screen: true, font: '700 52px Poppins', ink: false, pop: pk(C.pill) });
  }
  if (t > C.follow) letter('Follow @therishikatha for all 9 nights', X, 1430, 34, TK.grey, { screen: true, font: '500 38px Poppins', ink: false, maxW: 860, pop: pk(C.follow) });
}
