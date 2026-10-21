// diwali_props.js: the set and props for "Maa Lakshmi's OWL just went ON STRIKE." (src/scenes/diwali.js), the Diwali
// Vahana Union. Loaded before it; everything here is a pure function of its arguments (and T for boil).
//
//   TK, DW                                     the palettes (TK as in ad 10)
//   sparkleBurst, vanishPuff, veil             copied from ad 10
//   diwaliSet(t, o)                            the moonless dharna under a Diwali shamiana (world space), its diyas
//   diya(x, y, s, lit, key)                    one clay lamp; lit 0..1 (+ flare above 1)
//   placard(x, y, w, h, o), megaphone(...)     from ad 10 (the placard letters in Bangers)
//   owlBand(o), sideBand(x, y, s, a, dir, key) the red union headband: a hat hook for owl(); one on a side-view head
//   broom(x, y, a, s, key)                     a phool jhadu, its bristles at (x, y), handle along angle a
//   laddoo(x, y, r, key), garlandAt(pts, key)  a besan laddoo; a marigold garland along a path
//   rocket(x, y, age, o)                       a rocket's trail and burst (world space)
//   rosterStrip(R), D_ICONS                    the five-day duty roster: the strip in the top band → the board
//   petalRain(t, t0, o)                        marigold petals falling (screen space)
//   diwaliCard(t, C)                           the end card: Books 1–3 as a Diwali gift
const TK = {
  ink: '#2B2233', cream: '#FFF5E2',
  petal: '#F4A6B8', petalDk: '#E0708C', marigold: '#F39A2E', yellow: '#FFD45A', leaf: '#5E9A6A',
  gold: '#EDB43C', goldLt: '#FFE39A', goldDk: '#B67D1C',
  rkOrange: '#F15A24', peach: '#FBE0CF', peachLt: '#FFF1E6', brown: '#3A2418', grey: '#6B5A50', teal: '#2E5F5A',
};
const DW = {
  ink: '#2E2030', sky: '#12153A', skyLt: '#1E2350', star: '#FFF1C8',
  cloth: '#2A7480', clothDk: '#1C5560', clothLt: '#3A8C98', zari: '#D9A83A',
  val: '#8E1E3A', valDk: '#6A1430', gold: '#E8B23C', goldDk: '#B67D1C', cream: '#F7E6C0',
  pole: '#B88A4A', poleDk: '#8A6230', floor: '#5A2E3A', floorDk: '#43202C', earth: '#3A2028',
  rang: ['#F25C8A', '#FFD34E', '#2FB5A0', '#FFF4E0', '#F28A2E', '#8E5BD6'],
  clay: '#B85A32', clayDk: '#86391E', clayLt: '#D9804E', flame: '#FFD45A', flameIn: '#FFF4C8', flameOut: '#FF8A2A',
  red: '#C8323A', redDk: '#962430', band: '#D2352C', bandDk: '#9E2420',
  card: '#F4E4C2', cardDk: '#D8C29A', cardJai: '#FFD45A', cardJaiDk: '#E0A62A', text: '#B5262E',
  mega: '#F6F0E2', megaDk: '#C9C0AE', megaBand: '#D2352C', grip: '#3A3440',
  bulb: ['#FFD45A', '#FF9A4A', '#FFE7A0', '#FF7A7A'],
  tile: '#FFF4DC', tileDk: '#E8CFA0', tileEdge: '#B67D1C', tileEmpty: '#F2E2C2',
  straw: '#E2C27A', strawDk: '#B8964E', laddoo: '#F2A93A', laddooDk: '#C77E1C',
};

// ---------- copied from ad 10 ----------
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
function veil(col, a) {
  if (a <= .004) return;
  flushBrush(); const c = color(col);
  push(); resetMatrix(); translate(-W / 2, -H / 2); noStroke(); fill(red(c), green(c), blue(c), 255 * clamp(a)); rect(-4, -4, W + 8, H + 8); pop();
}

// ---------- the set ----------
// One clay diya at (x, y) (the bowl's base), s = its half-width; lit 0..1 the flame (above 1: a dazzling flare)
function diya(x, y, s, lit, key) {
  boilSeed('diya ' + key);
  const fl = Math.min(lit, 1), flare = Math.max(0, lit - 1);
  if (lit > .02) glow(x + s * .55, y - s * 1.1, s * (3.2 + flare * 6), DW.flameOut, .5 * fl + flare * .5);
  paint([[x - s, y - s * .55], [x + s * .7, y - s * .55], [x + s * 1.25, y - s * .8], [x + s * .9, y - s * .3], [x + s * .5, y], [x - s * .6, y], [x - s * .95, y - s * .25]], { wash: DW.clay, fill: DW.clayDk, fillOp: 60, tex: .4, ink: DW.ink, sw: clamp(s / 14, .5, 1.6), curv: .4 });
  paint(ellPts(x - s * .1, y - s * .55, s * .85, s * .16, 10), { wash: DW.clayDk, ink: null });
  if (lit > .02) {
    const fx = x + s * .95, fy = y - s * .8, h = s * (1.2 + .25 * Math.sin(T * 17 + x) + flare * 1.6) * fl, w = s * .42 * (1 + flare * .6);
    paint([[fx - w, fy], [fx - w * .7, fy - h * .5], [fx + Math.sin(T * 11 + x) * w * .3, fy - h], [fx + w * .7, fy - h * .5], [fx + w, fy], [fx, fy + w * .4]], { wash: DW.flame, ink: null, curv: .6 });
    paint(ellPts(fx, fy - h * .3, w * .4, h * .3, 8), { wash: DW.flameIn, ink: null });
  }
}
// The diyas' positions (world): the rangoli ring round the owl, and the front edge of the floor
const DIYAS = (() => {
  const P = [];
  for (let i = 0; i < 9; i++) { const a = Math.PI * (-.08 + i / 8 * 1.16); P.push([540 + Math.cos(a) * 455, 1600 + Math.sin(a) * 165, 17]); }
  for (let i = 0; i < 10; i++) P.push([40 + i * 112, 1800 + (i % 2) * 14, 20]);
  return P;
})();
// The dharna under a Diwali shamiana, world space (1080 × 1920; the wide shot shows y 40..1960).
// o: lamps (0..1: how many diyas burn, in order) + flare (0..1: they all blaze), warm 0..1 (Lakshmi's gold light),
// dim 0..1 (the darkest night), banner (false hides it), bulbs (0..1, default 1)
function diwaliSet(t, o = {}) {
  const warm = clamp(o.warm || 0), dim = clamp(o.dim || 0);
  boilSeed('sky');
  paint(rectPts(-300, -300, W + 600, 940), { wash: mixCol(DW.sky, '#06071A', dim * .6), ink: null });
  for (let i = 0; i < 22; i++) { const x = hash(i * 3.1) * 1300 - 110, y = 200 + hash(i * 5.7) * 340, r = 2.5 + 3 * hash(i * 1.9) * (.7 + .3 * Math.sin(t * 2 + i)); paint(ellPts(x, y, r, r, 6), { wash: DW.star, ink: null }); }
  // the back cloth: indigo velvet, gold zari stripes, soft folds
  boilSeed('cloth');
  paint(rectPts(-300, 700, W + 600, 660), { wash: mixCol(DW.cloth, '#5A3A7A', warm * .5), fill: DW.clothDk, fillOp: 60, bleed: .05, tex: .6, border: .3, ink: null });
  for (let i = 0; i < 11; i++) { const x = -130 + i * 135 + 10 * Math.sin(t * .8 + i); inkLine([[x, 760], [x + 8, 1000], [x - 4, 1300]], 4, DW.clothDk, 'dry', .5); inkLine([[x + 60, 760], [x + 66, 1000], [x + 58, 1300]], 2.2, DW.zari, 'inkfine', .5); }
  paint(rectPts(-300, 1180, W + 600, 180), { fill: DW.clothDk, fillOp: 80, bleed: .2, tex: .5, border: .2, ink: null });
  // the floor: a maroon durrie with gold bands, and the rangoli in front
  boilSeed('floor');
  paint([[-300, 1300], [W + 300, 1300], [W + 300, 2500], [-300, 2500]], { wash: DW.earth, ink: null });
  paint([[-60, 1290], [W + 60, 1290], [W + 160, 1760], [-160, 1760]], { wash: DW.floor, fill: DW.floorDk, fillOp: 60, bleed: .05, tex: .6, border: .3, ink: DW.ink, sw: 2 });
  for (const [y, c, w] of [[1330, DW.gold, 10], [1352, DW.cream, 5], [1735, DW.gold, 10]]) { const k = (y - 1290) / 470; paint(rectPts(-60 - 100 * k, y, W + 120 + 200 * k, w), { wash: c, ink: null }); }
  boilSeed('rangoli');
  const RC = [540, 1590];
  paint(ellPts(RC[0], RC[1], 470, 165, 40), { wash: DW.rang[3], washOp: 70, ink: null });
  for (let i = 0; i < 16; i++) { const a = i / 16 * TAU; paint(ellPts(RC[0] + Math.cos(a) * 380, RC[1] + Math.sin(a) * 132, 46, 20, 10, 0, a * .3), { wash: DW.rang[i % 2 ? 0 : 4], ink: null }); }
  paint(ellPts(RC[0], RC[1], 330, 112, 36), { wash: DW.rang[1], washOp: 200, ink: null });
  paint(ellPts(RC[0], RC[1], 270, 92, 36), { wash: DW.rang[5], washOp: 200, ink: null });
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; paint(ellPts(RC[0] + Math.cos(a) * 200, RC[1] + Math.sin(a) * 68, 34, 14, 10, 0, a * .3), { wash: DW.rang[2], ink: null }); }
  paint(ellPts(RC[0], RC[1], 120, 40, 24), { wash: DW.rang[3], ink: null });
  // bamboo poles
  boilSeed('poles');
  for (const x of [26, 1054]) { paint(rectPts(x - 15, 700, 30, 800), { wash: DW.pole, ink: DW.ink, sw: 2 }); for (let y = 800; y < 1480; y += 170) inkLine([[x - 15, y], [x + 15, y + 4]], 3, DW.poleDk, 'ink', 0); }
  // fairy lights, swagged across
  boilSeed('bulbs');
  const bk = o.bulbs ?? 1, sag = x => 800 + 60 * Math.sin(Math.PI * clamp((x + 40) / 1160));
  inkLine(Array.from({ length: 12 }, (_, i) => { const x = -40 + i * 105; return [x, sag(x)]; }), 2, DW.ink, 'inkfine', .5);
  for (let i = 0; i < 15; i++) { const x = -20 + i * 80, y = sag(x) + 14, c = DW.bulb[i % 4], on = (.6 + .4 * Math.sin(t * 5 + i * 1.7)) * bk; if (on > .05) glow(x, y, 46, c, .5 * on); paint(ellPts(x, y, 9, 12, 8), { wash: on > .3 ? c : mixCol(c, DW.ink, .5), ink: DW.ink, sw: 1 }); }
  // marigold strings and mango-leaf torans hanging from the valance
  boilSeed('marigold');
  for (let j = 0; j < 7; j++) {
    const x = 70 + j * 157, n = 6 + (j % 2) * 2, sw = 4 * Math.sin(t * 1.3 + j);
    for (let i = 0; i < n; i++) { const y = 760 + i * 24; paint(ellPts(x + sw * i / n, y, 12, 11, 8, 1.5), { wash: i % 3 === 2 ? TK.yellow : TK.marigold, ink: null }); }
    paint(ellPts(x + sw, 760 + n * 24 - 4, 7, 10, 6), { wash: TK.leaf, ink: null });
  }
  // the valance: maroon and gold stripes, a scalloped hem, the banner on it
  boilSeed('valance');
  paint(rectPts(-300, 540, W + 600, 210), { wash: DW.gold, ink: null });
  for (let i = 0; i < 20; i++) paint(rectPts(-250 + i * 80, 540, 46, 210), { wash: DW.val, ink: null });
  for (let i = 0; i < 18; i++) { const x = -200 + i * 80; paint([[x, 745], [x + 80, 745], [x + 72, 770], [x + 40, 782], [x + 8, 770]], { wash: i % 2 ? DW.val : TK.marigold, ink: DW.ink, sw: 1.5, curv: .4 }); }
  inkLine([[-300, 748], [W + 300, 748]], 3, DW.ink, 'ink', 0);
  for (let i = 0; i < 14; i++) { const x = -10 + i * 80; paint([[x - 12, 752], [x + 12, 752], [x, 790 + 4 * Math.sin(t * 1.5 + i)]], { wash: i % 2 ? TK.leaf : '#4E8A58', ink: DW.ink, sw: 1, curv: .5 }); }   // the toran's mango leaves
  if (o.banner !== false) {
    boilSeed('banner');
    paint(rrPts(150, 600, 780, 120, 14), { wash: DW.cream, ink: DW.val, sw: 5 });
    letter('DIWALI VAHANA UNION', 540, 663, 56, DW.val, { font: '700 56px Poppins', ink: false, maxW: 740 });
  }
  // the diyas
  const lamps = clamp(o.lamps || 0), flare = clamp(o.flare || 0);
  DIYAS.forEach(([x, y, s], i) => diya(x, y, s, clamp(lamps * DIYAS.length - i) + flare * (1 + hash(i) * .5), 'd' + i));
  if (warm > 0) glow(300, 1250, 1000, '#FFD27A', .4 * warm);
  if (flare > 0) glow(540, 1500, 1300, '#FFE6A0', .55 * flare);
}

// ---------- props ----------
// A protest placard (from ad 10): board centred at (x, y), w × h, on a pole of length o.pole (0 for none). o: txt,
// back, flip 0..1, rot, size, hang ([x, y] the string's top), key, noText, gone, clip ([y0, y1]: no letters while the
// board's centre is in that screen band)
function placard(x, y, w, h, o = {}) {
  if (o.gone) return;
  const f = clamp(o.flip || 0), sx = Math.max(.04, Math.abs(Math.cos(f * Math.PI))), back = f > .5, r = o.rot || 0;
  boilSeed('placard ' + (o.key || ''));
  push(); translate(x, y); rotate(r);
  if (o.pole) paint(rectPts(-7, -10, 14, o.pole + 10), { wash: DW.pole, ink: DW.ink, sw: 1.6 });
  if (o.hang) { const [hx, hy] = o.hang; inkLine([[-w * .4 * sx, -h / 2 + 6], [hx - x, hy - y]], 2.4, DW.ink, 'inkfine', 0); inkLine([[w * .4 * sx, -h / 2 + 6], [hx - x, hy - y]], 2.4, DW.ink, 'inkfine', 0); }
  push(); scale(sx, 1);
  paint(rrPts(-w / 2, -h / 2, w, h, 8, 1.5), { wash: back ? DW.cardJai : DW.card, fill: back ? DW.cardJaiDk : DW.cardDk, fillOp: 60, bleed: .05, tex: .5, border: .5, ink: DW.ink, sw: 2.4 });
  pop(); pop();
  const txt = back ? o.back : o.txt;
  const hid = o.clip && CAM && (([, sy]) => sy > o.clip[0] && sy < o.clip[1])(toScreen(x, y));   // under the roster strip: letters sit above all paint
  if (txt && sx > .4 && !o.noText && !hid) { const sz = Math.round((o.size || h * .42) * (.5 + .5 * sx)); letter(txt, x, y + 2, sz, DW.text, { rot: r - .03, maxW: (w - 18) * sx, ink: false, font: `${sz}px Bangers` }); }
}
// A megaphone (from ad 10): the mouthpiece at (x, y), pointing along a, s = its length / 3. o.yell 0..1
function megaphone(x, y, a, s, o = {}) {
  boilSeed('mega ' + (o.key || ''));
  push(); translate(x, y); rotate(a); if (o.mirror) scale(1, -1);
  paint([[0, -.22 * s], [.45 * s, -.28 * s], [2.9 * s, -1.05 * s], [3.05 * s, 0], [2.9 * s, 1.05 * s], [.45 * s, .28 * s], [0, .22 * s]], { wash: DW.mega, fill: DW.megaDk, fillOp: 70, tex: .4, ink: DW.ink, sw: 2.4, curv: .1 });
  paint([[1.7 * s, -.72 * s], [2.05 * s, -.84 * s], [2.05 * s, .84 * s], [1.7 * s, .72 * s]], { wash: DW.megaBand, ink: null });
  paint(ellPts(2.98 * s, 0, .22 * s, 1.05 * s, 14), { wash: DW.megaDk, ink: DW.ink, sw: 2 });
  paint(rrPts(.8 * s, .25 * s, .38 * s, .9 * s, .1 * s), { wash: DW.grip, ink: DW.ink, sw: 1.6 });
  pop();
  const yell = clamp(o.yell || 0);
  if (yell > 0) {
    boilSeed('megarings ' + (o.key || ''));
    for (let i = 0; i < 3; i++) {
      const k = frac(T * 2.2 + i / 3), r = s * (1 + k * 2.2), cx = x + Math.cos(a) * s * (3.1 + k * 1.6), cy = y + Math.sin(a) * s * (3.1 + k * 1.6);
      inkLine([-.9, -.45, 0, .45, .9].map(d => [cx + Math.cos(a + d) * r * .35, cy + Math.sin(a + d) * r * .35]), 6 * (1 - k) * yell, DW.ink, 'ink', .6);
    }
  }
}
// The union headband for owl(): a hat hook in owl head space, the knot's tails fluttering off screen-left
function owlBand(o = {}) {
  return (u, sw) => {
    const P = pts => U(pts, u), fl = Math.sin(T * 9) * .25 + (o.wind || 0);
    paint(P([[-4.0, -12.0], [-2.2, -12.75], [0, -12.95], [2.2, -12.75], [4.0, -12.0], [4.05, -11.35], [2.2, -12.0], [0, -12.2], [-2.2, -12.0], [-4.05, -11.35]]), { wash: DW.band, ink: DW.ink, sw: sw * .7, curv: .4 });
    inkLine(P([[-3.0, -12.25], [-1.0, -12.65], [1.2, -12.65]]), sw * .45, DW.bandDk, 'inkfine', .5);
    paint(P(ribbon([[-4.05, -11.7], [-5.1, -12.1 + fl * .3], [-6.0, -11.5 + fl * .8]], .45, .2)), { wash: DW.band, ink: DW.ink, sw: sw * .6 });
    paint(P(ribbon([[-4.05, -11.6], [-5.0, -11.1 + fl * .2], [-5.7, -10.1 + fl * .6]], .42, .18)), { wash: DW.bandDk, ink: DW.ink, sw: sw * .6 });
    paint(ellPts(-4.05 * u, -11.7 * u, .32 * u, .32 * u, 8), { wash: DW.bandDk, ink: DW.ink, sw: sw * .5 });
  };
}
// A headband on a side-view head: centred at (x, y), s = the animal's u, a = the band's angle, dir = which way the
// tails stream (-1 left)
function sideBand(x, y, s, a, dir, key) {
  boilSeed('band ' + key);
  const fl = Math.sin(T * 9 + x) * .3;
  push(); translate(x, y); rotate(a);
  paint([[-1.1 * s, -.35 * s], [1.1 * s, -.3 * s], [1.1 * s, .3 * s], [-1.1 * s, .35 * s]], { wash: DW.band, ink: DW.ink, sw: 1.8, curv: .3 });
  const bx = dir * 1.1 * s;
  paint(ribbon([[bx, 0], [bx + dir * .9 * s, (-.2 + fl) * s], [bx + dir * 1.8 * s, (.1 + fl * 1.6) * s]], .32 * s, .14 * s), { wash: DW.band, ink: DW.ink, sw: 1.4 });
  paint(ribbon([[bx, .1 * s], [bx + dir * .8 * s, (.5 + fl * .5) * s], [bx + dir * 1.5 * s, (.9 + fl) * s]], .3 * s, .12 * s), { wash: DW.bandDk, ink: DW.ink, sw: 1.4 });
  pop();
}
// A phool jhadu (soft grass broom): the bristles' tip at (x, y), the handle running back along angle a; s = its size
// (about 9s long). sweep -1..1 bends the bristles
function broom(x, y, a, s, key, sweep = 0) {
  boilSeed('broom ' + key);
  push(); translate(x, y); rotate(a);
  const b = sweep * 1.1;   // the bristles bend away from the sweep
  paint([[4.2 * s, -.55 * s], [2.4 * s, -1.25 * s + b * .4 * s], [.2 * s, -1.9 * s + b * s], [-.1 * s, -.6 * s + b * s], [0, .8 * s + b * s], [.3 * s, 1.9 * s + b * s], [2.4 * s, 1.15 * s + b * .4 * s], [4.2 * s, .55 * s]], { wash: DW.straw, fill: DW.strawDk, fillOp: 70, tex: .6, ink: DW.ink, sw: 1.6, curv: .4 });
  for (let i = 0; i < 6; i++) { const k = (i - 2.5) / 2.5; inkLine([[4.0 * s, k * .4 * s], [2.2 * s, k * 1.0 * s + b * .4 * s], [.4 * s, k * 1.6 * s + b * s]], 1.4, DW.strawDk, 'inkfine', .5); }
  paint([[3.9 * s, -.7 * s], [5.0 * s, -.5 * s], [5.0 * s, .5 * s], [3.9 * s, .7 * s]], { wash: DW.red, ink: DW.ink, sw: 1.4 });
  paint([[5.0 * s, -.42 * s], [9.2 * s, -.3 * s], [9.4 * s, 0], [9.2 * s, .3 * s], [5.0 * s, .42 * s]], { wash: DW.strawDk, ink: DW.ink, sw: 1.6, curv: .2 });
  for (const k of [6.2, 7.4, 8.6]) inkLine([[k * s, -.36 * s], [k * s, .36 * s]], 2.5, DW.red, 'ink', 0);
  pop();
}
// Dust kicked up: light puffs, no glow (a glow of dusty colours muddies on the dark floor)
function dustPuff(x, y, s, age, key) {
  if (age < 0 || age > .7) return;
  const k = age / .7; boilSeed('dust ' + key);
  for (let i = 0; i < 7; i++) {
    const a = Math.PI + (i / 6 - .5) * 2.2, d = s * (.2 + .9 * easeOut(k)) * (.7 + .4 * hash(i * 3)), r = s * (.18 + .12 * hash(i * 1.7)) * (1 + .6 * k);
    paint(ellPts(x + Math.cos(a) * d, y + Math.sin(a) * d * .5 - k * s * .3, r, r * .85, 10, 1), { wash: '#EADCC4', washOp: 210 * (1 - k * k), ink: null });
  }
}
// A besan laddoo at (x, y), radius r
function laddoo(x, y, r, key) {
  boilSeed('laddoo ' + key);
  paint(ellPts(x, y, r, r * .95, 16, r * .04), { wash: DW.laddoo, fill: DW.laddooDk, fillOp: 70, tex: .7, ink: DW.ink, sw: clamp(r / 14, .5, 1.6) });
  for (let i = 0; i < 6; i++) paint(ellPts(x + (hash(i * 2.1) - .5) * r, y + (hash(i * 3.7) - .6) * r, r * .08, r * .08, 6), { wash: '#7A9A3A', ink: null });   // pistachio bits
  paint(ellPts(x - r * .35, y - r * .4, r * .25, r * .15, 8), { wash: '#FFD98A', ink: null });
}
// A marigold garland along a path (world points)
function garlandAt(pts, key, r = 11) {
  boilSeed('garland ' + key);
  const C = through(pts), n = Math.max(2, Math.round(C.length / 2));
  for (let i = 0; i <= n; i++) { const p = C[Math.min(C.length - 1, Math.round(i / n * (C.length - 1)))]; paint(ellPts(p[0], p[1], r, r * .92, 8, 1), { wash: i % 3 === 2 ? TK.yellow : TK.marigold, ink: DW.ink, sw: .8 }); }
}
// A rocket: up from (x, y) for .5 s, then a burst at its top (world space); o: h (rise), c (colours), key
function rocket(x, y, age, o = {}) {
  if (age < 0 || age > 1.6) return;
  const h = o.h || 700, cols = o.c || ['#FFE27A', '#FF7AA8', '#8AF0D0'], key = o.key || 'rk';
  boilSeed('rocket ' + key);
  const up = easeOut(clamp(age / .5)), top = [x + 40 * up, y - h * up];
  if (age < .55) { inkLine([[x, y], [lerp(x, top[0], .6), lerp(y, top[1], .6)], top], 4, '#FFD9A0', 'dry', .5); glow(top[0], top[1], 60, '#FFD27A', .8); return; }
  const k = (age - .5) / 1.1;
  glow(top[0], top[1], 260 * (1 - k * .5), cols[0], .8 * (1 - k));
  for (let i = 0; i < 16; i++) {
    const a = i / 16 * TAU + hash(i) * .2, d = 230 * easeOut(clamp(k * 1.4)) * (.8 + .3 * hash(i * 2)), dr = k * k * 60;
    const p0 = [top[0] + Math.cos(a) * d * .55, top[1] + Math.sin(a) * d * .55 + dr], p1 = [top[0] + Math.cos(a) * d, top[1] + Math.sin(a) * d + dr];
    inkLine([p0, p1], 6 * (1 - k), cols[i % cols.length], 'ink', 0);
    paint(starPts(p1[0], p1[1], 10 * (1 - k), .4, 4), { wash: cols[(i + 1) % cols.length], ink: null });
  }
}

// ---------- the roster ----------
// Painted heads for the tiles, centred at (x, y), radius r
const D_ICONS = {
  buffalo(x, y, r) {
    for (const s of [-1, 1]) paint(ribbon([[x + s * r * .45, y - r * .45], [x + s * r * 1.0, y - r * .55], [x + s * r * 1.05, y - r * .15]], r * .2, r * .05), { wash: YAMA_BUF.horn, ink: DW.ink, sw: r * .04 });
    for (const s of [-1, 1]) paint(ellPts(x + s * r * .72, y - r * .2, r * .26, r * .13, 10, 0, s * .3), { wash: YAMA_BUF.bfLt, ink: DW.ink, sw: r * .04 });
    paint([[x - r * .55, y - r * .55], [x + r * .55, y - r * .55], [x + r * .5, y + r * .35], [x, y + r * .7], [x - r * .5, y + r * .35]], { wash: YAMA_BUF.bf, ink: DW.ink, sw: r * .05, curv: .5 });
    paint(ellPts(x, y + r * .42, r * .38, r * .24, 12), { wash: YAMA_BUF.bfMuzzle, ink: DW.ink, sw: r * .04 });
    for (const s of [-1, 1]) { paint(ellPts(x + s * r * .26, y - r * .1, r * .1, r * .1, 8), { wash: '#FFF3E0', ink: null }); paint(ellPts(x + s * r * .26, y - r * .08, r * .05, r * .06, 6), { wash: DW.ink, ink: null }); }
  },
  garuda(x, y, r) {
    paint(ellPts(x, y, r * .72, r * .7, 18), { wash: GARUDA_PAL.head, ink: DW.ink, sw: r * .05 });
    paint([[x - r * .55, y - r * .55], [x - r * .6, y - r * .95], [x - r * .25, y - r * .75], [x, y - r * 1.05], [x + r * .25, y - r * .75], [x + r * .6, y - r * .95], [x + r * .55, y - r * .55]], { wash: TK.gold, ink: DW.ink, sw: r * .04, curv: .1 });
    paint([[x - r * .22, y + r * .02], [x + r * .22, y + r * .02], [x + r * .1, y + r * .55], [x, y + r * .62], [x - r * .1, y + r * .55]], { wash: GARUDA_PAL.beak, ink: DW.ink, sw: r * .04, curv: .4 });
    for (const s of [-1, 1]) { paint(ellPts(x + s * r * .32, y - r * .15, r * .12, r * .12, 8), { wash: '#FFFFFF', ink: DW.ink, sw: r * .02 }); paint(ellPts(x + s * r * .32, y - r * .14, r * .06, r * .07, 6), { wash: DW.ink, ink: null }); inkLine([[x + s * r * .15, y - r * .34], [x + s * r * .5, y - r * .28]], r * .07, DW.ink, 'ink', 0); }
  },
  owl(x, y, r) {
    paint(ellPts(x, y, r * .85, r * .78, 18), { wash: OWL.body, ink: DW.ink, sw: r * .05 });
    paint([[x, y - r * .5], [x + r * .35, y - r * .62], [x + r * .7, y - r * .3], [x + r * .62, y + r * .25], [x, y + r * .7], [x - r * .62, y + r * .25], [x - r * .7, y - r * .3], [x - r * .35, y - r * .62]], { wash: OWL.white, ink: OWL.rim, sw: r * .06, curv: .5 });
    for (const s of [-1, 1]) { paint(ellPts(x + s * r * .3, y - r * .08, r * .17, r * .19, 10), { wash: OWL.eye, ink: null }); paint(ellPts(x + s * r * .26, y - r * .14, r * .05, r * .05, 6), { wash: '#FFFFFF', ink: null }); }
    paint([[x - r * .08, y + r * .08], [x + r * .08, y + r * .08], [x, y + r * .32]], { wash: OWL.beak, ink: DW.ink, sw: r * .03 });
  },
  mouse(x, y, r) {
    for (const s of [-1, 1]) { paint(ellPts(x + s * r * .55, y - r * .55, r * .35, r * .35, 12), { wash: BAP.mouse, ink: DW.ink, sw: r * .04 }); paint(ellPts(x + s * r * .55, y - r * .55, r * .2, r * .2, 10), { wash: BAP.pink, ink: null }); }
    paint(ellPts(x, y, r * .62, r * .55, 16), { wash: BAP.mouse, ink: DW.ink, sw: r * .05 });
    for (const s of [-1, 1]) paint(ellPts(x + s * r * .24, y - r * .08, r * .08, r * .1, 8), { wash: DW.ink, ink: null });
    paint(ellPts(x, y + r * .22, r * .1, r * .08, 8), { wash: BAP.pink, ink: DW.ink, sw: r * .02 });
  },
  cow(x, y, r) {
    for (const s of [-1, 1]) paint(ribbon([[x + s * r * .35, y - r * .5], [x + s * r * .65, y - r * .85], [x + s * r * .5, y - r * 1.05]], r * .14, r * .05), { wash: COW_PAL.horn, ink: DW.ink, sw: r * .04 });
    for (const s of [-1, 1]) paint(ellPts(x + s * r * .72, y - r * .25, r * .3, r * .15, 10, 0, s * .3), { wash: COW_PAL.body, ink: DW.ink, sw: r * .04 });
    paint([[x - r * .55, y - r * .55], [x + r * .55, y - r * .55], [x + r * .45, y + r * .4], [x, y + r * .7], [x - r * .45, y + r * .4]], { wash: COW_PAL.body, ink: DW.ink, sw: r * .05, curv: .5 });
    paint(ellPts(x, y + r * .45, r * .38, r * .25, 12), { wash: '#E9B89A', ink: DW.ink, sw: r * .04 });
    for (const s of [-1, 1]) paint(ellPts(x + s * r * .26, y - r * .12, r * .08, r * .1, 8), { wash: DW.ink, ink: null });
    paint(ellPts(x, y - r * .4, r * .08, r * .1, 8), { wash: DW.red, ink: null });
    for (let i = 0; i < 5; i++) { const a = Math.PI * (.15 + i * .175); paint(ellPts(x + Math.cos(a) * r * .5, y + r * .55 + Math.sin(a) * r * .2, r * .1, r * .1, 6), { wash: TK.marigold, ink: null }); }
  },
};
// day, its name, its story, and the vahanas on duty
const ROSTER5 = [
  ['Day 1', 'Dhanteras', 'A lamp for Yama', ['buffalo']],
  ['Day 2', 'Choti Diwali', 'Krishna beats Narakasura', ['garuda']],
  ['Day 3', 'Lakshmi Puja', 'Lakshmi and Ganesha', ['mouse', 'owl']],
  ['Day 4', 'Govardhan Puja', 'The cows are worshipped', ['cow']],
  ['Day 5', 'Bhai Dooj', 'Yama visits his sister', ['buffalo']],
];
// One tile at (cx, cy), w × h, screen space. fills[j] = seconds since icon j stamped in (< 0 not yet); big 0..1 the
// board look (a wide row: icons left, the day and its story right); pulse 0..1 (empty and asked about)
function rosterTile(i, cx, cy, w, h, fills, big, pulse) {
  const R = ROSTER5[i], filled = fills.some(f => f >= 0);
  boilSeed('tile ' + i);
  if (pulse > 0) glow(cx, cy, w * .9, '#FFE08A', .7 * pulse);
  paint(rrPts(cx - w / 2, cy - h / 2, w, h, 12, 1), { wash: filled ? DW.tile : DW.tileEmpty, fill: DW.tileDk, fillOp: 40, tex: .4, ink: pulse > 0 ? '#E07A1A' : DW.tileEdge, sw: pulse > 0 ? 4 : 2.6 });
  const n = R[3].length, r = Math.min(lerp(w / (n === 2 ? 4.6 : 3.2), 52, big), h * .34);
  const ix0 = lerp(cx, cx - w / 2 + 70 + (n - 1) * 32, big), iy = lerp(cy + h * .08, cy, big);
  R[3].forEach((kind, j) => {
    const f = fills[j] ?? -1; if (f < 0) return;
    const k = backOut(clamp(f * 4)), ix = ix0 + (j - (n - 1) / 2) * r * lerp(2.1, 1.5, big);
    push(); translate(ix, iy); scale(k); D_ICONS[kind](0, 0, r); pop();
    if (f < .4) { const a = f / .4; inkLine(ellPts(ix, iy, r * (1.1 + a), r * (1.1 + a), 20), 5 * (1 - a), '#E07A1A', 'ink', .5); }
  });
  const ns = Math.round(lerp(22, 30, big));
  if (big < .5) letter(R[0].replace('Day ', ''), cx - w / 2 + 16, cy - h / 2 + 16, ns, DW.text, { screen: true, font: `700 ${ns}px Poppins`, ink: false });
  if (!filled && pulse > 0) letter('?', cx, cy + h * .08, 54, '#E07A1A', { screen: true, pop: pulse * 3, ink: false });
  if (big > .6) {
    const a = seg(big, .6, 1), tx = cx - w / 2 + 250 + 300;
    letter(`${R[0]} · ${R[1]}`, tx, cy - 20, 34, TK.brown, { screen: true, font: '700 34px Poppins', ink: false, maxW: 560, alpha: a });
    letter(R[2], tx, cy + 26, 28, TK.grey, { screen: true, font: '500 28px Poppins', ink: false, maxW: 560, alpha: a });
  }
}
// The strip (five tiles in the top band) → the board (five rows). R: fills[i] (arrays of stamp times, or null), t, drop
// (0..1 the strip slides in), board (0..1 the morph), pulse4 (0..1)
function rosterStrip(R) {
  const drop = clamp(R.drop ?? 1), bk = clamp(R.board || 0);
  if (drop <= 0) return;
  const dy = -(1 - easeOut(drop)) * 200;
  boilSeed('boardbg');
  paint(rrPts(lerp(48, 64, bk), lerp(426, 470, bk) + dy, lerp(884, 852, bk), lerp(132, 830, bk), lerp(16, 24, bk)), { wash: DW.cream, fill: DW.tileDk, fillOp: 50, tex: .4, ink: DW.val, sw: lerp(3, 5, bk) });
  if (bk > .5) letter('DIWALI DUTY ROSTER', 490, 532, 44, DW.val, { screen: true, font: '700 46px Poppins', ink: false, maxW: 780, pop: (bk - .5) * 6 });
  for (let i = 0; i < 5; i++) {
    const kb = ease(clamp(bk * 1.5 - i * .1));
    const sx = 146 + i * 172, sy = 492 + dy, gx = 490, gy = 640 + i * 142;
    const f = (R.fills[i] || []).map(v => v == null ? -1 : R.t - v);
    rosterTile(i, lerp(sx, gx, kb), lerp(sy, gy, kb), lerp(160, 800, kb), lerp(112, 128, kb), f, kb, i === 3 ? (R.pulse4 || 0) : 0);
  }
}
// Marigold petals falling from the top over age seconds (screen space), n of them
function petalRain(t, t0, o = {}) {
  const age = t - t0; if (age < 0) return;
  boilSeed('petalrain ' + (o.key || ''));
  const n = o.n || 26, x0 = o.x0 ?? 0, x1 = o.x1 ?? 1100;
  for (let i = 0; i < n; i++) {
    const st = hash(i * 1.7) * .6, a = age - st; if (a < 0) continue;
    const x = lerp(x0, x1, hash(i * 3.3)) + 40 * Math.sin(a * 2 + i), y = (o.y0 ?? -40) + a * (380 + 200 * hash(i * 5.1)), r = a * 3 + i;
    if (y > (o.y1 ?? H + 40)) continue;
    paint([[x + Math.cos(r) * 17, y + Math.sin(r) * 17], [x + Math.cos(r + 1.6) * 8, y + Math.sin(r + 1.6) * 8], [x - Math.cos(r) * 17, y - Math.sin(r) * 17], [x + Math.cos(r - 1.6) * 8, y + Math.sin(r - 1.6) * 8]], { wash: i % 3 ? TK.marigold : TK.yellow, ink: null, curv: .5 });
  }
}

// ---------- the card ----------
function diwaliCard(t, C) {
  boilSeed('cardbg');
  paint(rectPts(-60, -60, W + 120, H + 120), { wash: TK.peach, ink: null });
  boilSeed('cardpetals');
  for (let i = 0; i < 9; i++) {
    const x = 60 + hash(i * 3.3) * 960 + 30 * Math.sin(t * .9 + i), y = frac(hash(i * 7.1) + t * (.035 + .02 * hash(i))) * (H + 80) - 40, r = t * .8 + i;
    paint([[x + Math.cos(r) * 15, y + Math.sin(r) * 15], [x + Math.cos(r + 1.6) * 7, y + Math.sin(r + 1.6) * 7], [x - Math.cos(r) * 15, y - Math.sin(r) * 15], [x + Math.cos(r - 1.6) * 7, y + Math.sin(r - 1.6) * 7]], { wash: i % 2 ? TK.marigold : TK.petal, washOp: 200, ink: null, curv: .5 });
  }
  // a row of lit diyas along the foot of the card
  for (let i = 0; i < 7; i++) diya(110 + i * 125, 1490, 22, clamp((t - C.cap) * 4 - i * .4), 'card' + i);
  const X = 470, pk = t0 => Math.max(0, t - t0) * 5, br = Math.sin(t * 1.3) * .01;
  if (t > C.cap) letter('This Diwali, gift a STORY', X, 660, 54, TK.teal, { screen: true, font: '50px Marcellus', ink: false, pop: pk(C.cap), maxW: 860 });
  [1, 2, 3].forEach((b, j) => {
    const t0 = C.covers + j * .15; if (t < t0) return;
    const x = X + (j - 1) * 290, y = 900 + (j === 1 ? -16 : 0);
    picture(PICS['book' + b], x, y, 276, 276, { rot: (j - 1) * .05 + (j % 2 ? br : -br), pop: pk(t0), r: 8, shadow: 18 });
  });
  if (t > C.price) {
    letter('Books 1–3 · OUT NOW', X, 1130, 46, TK.brown, { screen: true, font: '700 50px Poppins', ink: false, maxW: 860, pop: pk(C.price) });
    letter(C.priceLine || 'Set of 3 for ₹500', X, 1196, 44, TK.rkOrange, { screen: true, font: '700 52px Poppins', ink: false, maxW: 860, pop: pk(C.price + .12) });
  }
  if (t > C.logo) picture(PICS.logo, X, 530, 140, 140, { pop: pk(C.logo) });
  if (t > C.pill) {
    const k = backOut(clamp(pk(C.pill))) * (1 + .03 * pulse(t, 4));
    boilSeed('pill');
    push(); translate(X, 1295); scale(k); paint(rrPts(-220, -44, 440, 88, 44), { wash: TK.rkOrange, ink: null }); pop();
    letter('rishikatha.com', X, 1297, 50, TK.cream, { screen: true, font: '700 52px Poppins', ink: false, pop: pk(C.pill) });
  }
  if (t > C.follow) letter('Follow @therishikatha', X, 1395, 36, TK.grey, { screen: true, font: '500 38px Poppins', ink: false, maxW: 860, pop: pk(C.follow) });
}
