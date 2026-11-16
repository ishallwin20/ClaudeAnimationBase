// hanu10_props.js: sets, props and the extra cast for hanu10.js (Hanuman series Part 10, the finale: "HANUMAN is still
// alive. This is what he does ALL DAY."). Loaded after src/hanuman_series.js, src/ramayan_sets.js (tree(), notes()),
// src/narada.js, src/parvati.js and hanu9_props.js (H9, the plantain grove). Pure functions of their arguments (and T).
//   H10                                  the palette
//   gandharva(x, y, u, k, o)             a heavenly singer on Narad's rig with his veena (k 0..2 picks the colours)
//   dadi(x, y, u, o)                     a grandmother on Parvati's rig: grey hair, a cream cotton saree, her pallu up
//   h10Varsha(t, key, gy)                Kimpurusha-varsha: a golden meadow and flowering trees beyond the snow range
//   h10Slab(x, y, w, key)                the broad stone slab he sleeps on (Vana 146.64)
//   h10Bananas(x, y, s, key, rot)        a hand of bananas
//   h10Song(x, y, rx, ry, k, key)        the song: a soft gold-rimmed cloud the singers' story shows in
//   h10Note(x, y, s, key, col, a, flag)  one musical note; h10Stream(...) a line of them drifting from A to B
//   h10Room(t, key, gy), h10Bed(x, y, w, key), h10Book(x, y, s, key)   a child's bedroom at night
//   h10Phone(x, y, w, h, key)            a phone, its top edge centred at (x, y); the scene paints the screen
const H10 = {
  ink: '#2B2233', gold: '#F5C542', goldLt: '#FFE69A', cream: '#FFF5E2',
  sky: '#8FD2CC', skyLo: '#FFE9B8', snow: '#E4EEF6', snowDk: '#B4CADC', hill: '#B9D28A', hillDk: '#8FB262',
  meadow: '#EBD680', meadowDk: '#C6AA52', stone: '#B9B4AC', stoneDk: '#8A847C',
  wall: '#3A3462', wallLo: '#7A5E8E', floor: '#6A4A52', floorDk: '#4E343E', wood: '#7A4A2E', woodDk: '#56301C',
  bed: '#D2685A', bedDk: '#A0463C', sheet: '#F6EAD6', sheetDk: '#D6C6AC', phone: '#2A2438', screen: '#FFF1DC',
  banana: '#F7D548', bananaDk: '#C9A21E',
};

// ---------- the cast ----------
const GAN_PAL = [
  { skin: '#F9D9A8', skinDk: '#DDAE74', skinLt: '#FFEFD0', dhoti: '#4E8EDC', dhotiDk: '#2E64AC', dhotiLt: '#8EBEF4', border: '#F2C230', shawl: '#F6E9FF', shawlDk: '#CDB6E6', hair: '#3A2A52', hairLt: '#5E4C7A' },
  { skin: '#F4CFA0', skinDk: '#D6A26C', skinLt: '#FFE8C8', dhoti: '#9A62D0', dhotiDk: '#6E3EA4', dhotiLt: '#C49AEC', border: '#F2C230', shawl: '#FFF1C8', shawlDk: '#E2C87A', hair: '#2E2440', hairLt: '#54466A' },
  { skin: '#FBDDB4', skinDk: '#E0B480', skinLt: '#FFF0D8', dhoti: '#3EA88E', dhotiDk: '#24806A', dhotiLt: '#7ED2BA', border: '#F2C230', shawl: '#FFE9EE', shawlDk: '#E6B4C2', hair: '#33264A', hairLt: '#584A72' },
];
function gandharva(x, y, u, k = 0, o = {}) { return narada(x, y, u, { blush: .3, ...o, pal: { ...GAN_PAL[k % 3], ...(o.pal || {}) } }); }
const DADI_PAL = { saree: '#F4EBDD', sareeDk: '#CFC0A8', sareeLt: '#FFFFFF', blouse: '#8E3A4A', blouseDk: '#6A2434', hair: '#D2CED8', hairLt: '#F2F0F4',
  veil: '#F4EBDD', veilDk: '#C8B89E', bangle: '#C8922A', skin: '#E2A87E', skinDk: '#BE8258', skinLt: '#F6CBA6', lip: '#B4605E', gold: '#B8323A', goldDk: '#8E2030', goldLt: '#D8606A' };
function dadi(x, y, u, o = {}) { return parvati(x, y, u, { crown: false, veil: 1, col: DADI_PAL.skin, dk: DADI_PAL.skinDk, lt: DADI_PAL.skinLt, ...o, pal: { ...DADI_PAL, ...(o.pal || {}) } }); }

// ---------- sets ----------
// Kimpurusha-varsha (Bhagavata 5.16.9 puts it just beyond the Himalaya): the snow range behind, a golden meadow
function h10Varsha(t, key = 'kv', gy = 1700) {
  boilSeed(key + 'sky');
  paint(rectPts(-300, -800, W + 600, gy + 900), { wash: H10.sky, ink: null });
  paint(ellPts(540, gy - 420, 1000, 520, 26), { fill: H10.skyLo, fillOp: 220, bleed: .3, tex: .4, ink: null });
  glow(540, gy - 520, 460, '#FFF2C0', .45);
  boilSeed(key + 'snow');
  paint([[-300, gy - 330], [-80, gy - 560], [120, gy - 470], [330, gy - 700], [520, gy - 520], [700, gy - 760], [900, gy - 540], [1100, gy - 640], [1380, gy - 380], [1380, gy - 100], [-300, gy - 100]], { wash: H10.snow, fill: H10.snowDk, fillOp: 50, tex: .4, ink: null, curv: .12 });
  for (const [px, py, s] of [[330, gy - 700, 84], [700, gy - 760, 96], [1100, gy - 640, 76], [-80, gy - 560, 66]]) paint([[px - s, py + s * 1.15], [px, py], [px + s, py + s * 1.15], [px + s * .4, py + s * .85], [px, py + s * 1.25], [px - s * .4, py + s * .9]], { wash: '#FFFFFF', ink: null, curv: .12 });
  boilSeed(key + 'hill');
  paint([[-300, gy - 230], [100, gy - 330], [420, gy - 250], [760, gy - 350], [1100, gy - 260], [1380, gy - 320], [1380, gy + 10], [-300, gy + 10]], { wash: H10.hill, fill: H10.hillDk, fillOp: 50, tex: .4, ink: null, curv: .5 });
  tree(70, gy - 60, 430, key + 't0', .2 * Math.sin(t * 1.2), ['#F4A6C0', '#D97A9E', '#FFD0E0']);
  tree(1010, gy - 70, 470, key + 't1', .2 * Math.sin(t * 1.2 + 1), ['#F7C65A', '#D99A2E', '#FFE39A']);
  boilSeed(key + 'gr');
  paint(rectPts(-300, gy - 80, W + 600, 1400), { wash: H10.meadow, fill: H10.meadowDk, fillOp: 50, tex: .5, ink: null });
  inkLine([[-200, gy - 78], [540, gy - 86], [1300, gy - 76]], 1, H10.ink, 'ink', .4);
  for (let i = 0; i < 10; i++) { const fx = -40 + hash(i * 3.1) * 1160, fy = gy - 30 + hash(i * 7.7) * 200; paint(starPts(fx, fy, 9, .5, 5, i), { wash: i % 2 ? '#FFFFFF' : '#F4A6C0', ink: null }); }
}
// a child's bedroom at night: a violet wall, a window with the moon, a wooden floor from gy down
function h10Room(t, key = 'rm', gy = 1760) {
  boilSeed(key + 'wall');
  paint(rectPts(-300, -600, W + 600, gy + 700), { wash: H10.wall, ink: null });
  paint(ellPts(430, gy - 330, 620, 520, 24), { fill: H10.wallLo, fillOp: 190, bleed: .3, tex: .4, ink: null });
  boilSeed(key + 'win');
  const wx = 860, wy = gy - 640;
  paint(rrPts(wx - 110, wy - 140, 220, 280, 16), { wash: '#1E1B40', ink: H10.wood, sw: 5 });
  glow(wx + 26, wy - 44, 130, '#FFF6DA', .6);
  paint(ellPts(wx + 26, wy - 44, 40, 40, 18), { wash: '#FFF6DA', ink: null });
  for (let i = 0; i < 5; i++) paint(starPts(wx - 80 + hash(i * 2.9) * 160, wy - 110 + hash(i * 5.3) * 220, 3 + 2 * Math.sin(t * 2 + i), .4, 4), { wash: '#FFF6DA', ink: null });
  inkLine([[wx, wy - 140], [wx, wy + 140]], 3, H10.wood, 'ink', 0); inkLine([[wx - 110, wy], [wx + 110, wy]], 3, H10.wood, 'ink', 0);
  boilSeed(key + 'fl');
  paint(rectPts(-300, gy - 40, W + 600, 900), { wash: H10.floor, fill: H10.floorDk, fillOp: 50, tex: .5, ink: null });
  inkLine([[-200, gy - 40], [540, gy - 44], [1300, gy - 38]], 1.2, H10.ink, 'ink', .3);
}
// a bed seen from its side; (x, y) is the middle of the mattress's front top edge (where a child sits), w its width
function h10Bed(x, y, w, key = 'bd') {
  boilSeed(key);
  paint(rrPts(x + w * .34, y - w * .5, w * .2, w * .78, 14), { wash: H10.wood, fill: H10.woodDk, fillOp: 50, tex: .4, ink: H10.ink, sw: 1.2 });   // the headboard
  paint(rrPts(x - w / 2, y - 18, w, w * .34, 22), { wash: H10.sheet, fill: H10.sheetDk, fillOp: 40, tex: .3, ink: H10.ink, sw: 1.2 });
  paint(rrPts(x + w * .16, y - 62, w * .28, 70, 26), { wash: '#FFFFFF', fill: H10.sheetDk, fillOp: 40, ink: H10.ink, sw: 1 });   // the pillow
  paint(rrPts(x - w / 2 - 6, y + w * .1, w * .62, w * .26, 18), { wash: H10.bed, fill: H10.bedDk, fillOp: 50, tex: .4, ink: H10.ink, sw: 1.2 });   // the blanket, folded back
  for (const sx of [-.44, .44]) paint(rectPts(x + sx * w - 12, y + w * .32, 24, 44), { wash: H10.wood, ink: H10.ink, sw: 1 });
}

// ---------- props ----------
function h10Slab(x, y, w, key = 'sl') {
  boilSeed(key);
  paint([[x - w / 2, y], [x - w * .46, y - w * .15], [x - w * .2, y - w * .2], [x + w * .3, y - w * .19], [x + w * .5, y - w * .1], [x + w * .48, y], [x, y + w * .04]], { wash: H10.stone, fill: H10.stoneDk, fillOp: 55, tex: .6, ink: H10.ink, sw: 1, curv: .3 });
  inkLine([[x - w * .3, y - w * .13], [x + w * .22, y - w * .14]], 1, '#E6E2DC', 'inkfine', .3);
}
function h10Bananas(x, y, s, key = 'bn', rot = 0) {
  boilSeed(key);
  push(); translate(x, y); rotate(rot);
  for (let i = 0; i < 4; i++) { const a = -.55 + i * .37; paint(ribbon([[0, -s * .5], [Math.sin(a) * s * .5, -s * .08], [Math.sin(a) * s * .78, s * .46]], s * .24, s * .13), { wash: H10.banana, fill: H10.bananaDk, fillOp: 30, ink: H10.ink, sw: .45 }); }
  paint(ellPts(0, -s * .53, s * .11, s * .08, 8), { wash: '#7A5A2E', ink: H10.ink, sw: .5 });
  pop();
}
function h10Song(x, y, rx, ry, k = 1, key = 'sg') {
  if (k <= 0) return;
  boilSeed(key);
  push(); translate(x, y); scale(k); translate(-x, -y);
  glow(x, y, rx * 1.35, '#FFE9A8', .5);
  const n = 16;
  for (let i = 0; i < n; i++) { const a = i / n * TAU; paint(ellPts(x + Math.cos(a) * rx * .9, y + Math.sin(a) * ry * .88, rx * .2, ry * .27, 12), { wash: '#FFF9E8', ink: H10.gold, sw: 1.8 }); }
  paint(ellPts(x, y, rx * .97, ry * .95, 30), { wash: '#FFF9E8', ink: null });
  pop();
}
function h10Note(x, y, s, key, col = H10.gold, a = 255, flag = 1) {
  if (s < 1) return;
  boilSeed(key);
  paint(ellPts(x, y, s, s * .78, 10, 0, -.3), { wash: col, washOp: a, ink: H10.ink, sw: .6 });
  inkLine([[x + s * .9, y - 2], [x + s * .9, y - s * 3.3]], 1.6, H10.ink, 'ink', 0);
  if (flag) inkLine([[x + s * .9, y - s * 3.3], [x + s * 2.3, y - s * 2.5]], 1.6, H10.ink, 'ink', 0);
}
// notes drifting from (x0, y0) to (x1, y1), from time t0 on: they swell in the middle of the way and fade at the ends
function h10Stream(x0, y0, x1, y1, t, t0, key, n = 4, per = .5, s = 13) {
  if (t < t0) return;
  for (let i = 0; i < n; i++) {
    const q = frac((t - t0) / (n * per) + i / n); if (t - t0 < q * n * per) continue;   // not sent yet
    h10Note(lerp(x0, x1, q), lerp(y0, y1, q) + Math.sin(q * 9 + i) * 26, s * Math.sin(q * Math.PI) + 2, key + i, i % 2 ? '#FFFFFF' : H10.gold, 255, i % 2);
  }
}
// an open book held up, its spine at (x, y), s half its width
function h10Book(x, y, s, key = 'bk') {
  boilSeed(key);
  paint([[x - s, y - s * .1], [x - s * .5, y - s * .24], [x, y - s * .12], [x + s * .5, y - s * .24], [x + s, y - s * .1], [x + s, y + s * .52], [x + s * .5, y + s * .38], [x, y + s * .5], [x - s * .5, y + s * .38], [x - s, y + s * .52]], { wash: '#B8323A', ink: H10.ink, sw: .9, curv: .15 });
  paint([[x - s * .9, y - s * .16], [x - s * .5, y - s * .28], [x, y - s * .16], [x + s * .5, y - s * .28], [x + s * .9, y - s * .16], [x + s * .9, y + s * .4], [x + s * .5, y + s * .28], [x, y + s * .4], [x - s * .5, y + s * .28], [x - s * .9, y + s * .4]], { wash: '#FFF6E2', ink: H10.ink, sw: .6, curv: .15 });
  inkLine([[x, y - s * .16], [x, y + s * .4]], 1, H10.ink, 'inkfine', 0);
}
function h10Phone(x, y, w, h, key = 'ph') {
  boilSeed(key);
  paint(rrPts(x - w / 2, y, w, h, w * .12), { wash: H10.phone, ink: H10.ink, sw: 1.6 });
  paint(rrPts(x - w / 2 + w * .05, y + w * .08, w * .9, h - w * .16, w * .08), { wash: H10.screen, ink: null });
  paint(rrPts(x - w * .1, y + w * .025, w * .2, w * .03, w * .015), { wash: '#55506A', ink: null });
}
