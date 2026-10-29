// curse_props.js: sets, props and the extra cast for curse.js (ad 60, "Baby HANUMAN was SO naughty, the rishis CURSED
// him!"). Loaded after src/ramayan.js and src/ramayan_sets.js (P1, ashram, tree, bush, hut) and src/jambavan.js. Pure
// functions of their arguments (and T for boil).
//   CP                                          the palette
//   rishi, anjana, kesari                       the extra cast (the rishis in bark cloth on Valmiki's rig, Hanuman's parents)
//   ladle, ladleBroken, clayPot, kamandalu, kamandaluAt, boulder, barkStrip, dryingLine, yagnaKund, smokePuff, boonLight,
//   flowerProp, pebble, waterDrop, sootHat, shockRing, cloudPuff, poof                                      props
//   shore, skyLapse, sunDisc                    sets
//   (from ad 59) PR, TK, peachGround, sparkleBurst, diya, templeBell, pcCard      the Books 1–3 card
const CP = {
  ink: '#2B2233', cream: '#FFF5E2', gold: '#F5C542', goldLt: '#FFE69A', goldDk: '#C8922A',
  bark: '#A5764A', barkDk: '#74502E', barkLt: '#CDA071', rope: '#C8A26A', ropeDk: '#8E6E3E',
  wood: '#B57E46', woodDk: '#7A4E26', woodLt: '#DDA86A',
  clay: '#C86A3E', clayDk: '#94462A', clayLt: '#EA9A6C', ghee: '#F7CF5A',
  brass: '#E2A838', brassDk: '#A8761E', brassLt: '#FFD77A',
  rock: '#A99E90', rockDk: '#7E7266', rockLt: '#D2C9BC',
  brick: '#C8704A', brickDk: '#94482E', fire: '#FF9A2E', fireIn: '#FFE08A', fireOut: '#F2622A',
  smoke: '#5E5866', smokeLt: '#8E8896', soot: '#3A3238',
  water: '#8FD2F0', waterLt: '#E2F6FF',
  // the shore at dusk
  duskHi: '#6E5A9A', duskMid: '#E2866A', duskLo: '#FFC98E', sea: '#3E6E9E', seaDk: '#26476E', seaLt: '#F2B890',
  sand: '#D8A878', sandDk: '#AE7E52', cliff: '#7A6A6E', cliffDk: '#54485A', cliffLt: '#A8949A',
  lanka: '#F2C24A', night: '#1C2148', nightLo: '#3A3A72', moon: '#FFF4D2',
};

// ---------- the extra cast ----------
// the rishis wear bark cloth (valkala); k picks one of three: 0 a white-bearded elder, 1 grey, 2 a younger dark-grey one
const RISHI_PAL = [
  { skin: '#D9A27A', skinDk: '#B47A54', skinLt: '#F0C4A0', hair: '#F2ECE2', hairLt: '#FFFFFF', shawl: '#EADBB8', shawlDk: '#C9B58E' },
  { skin: '#E8B48A', skinDk: '#C68A60', skinLt: '#FAD2AE', hair: '#C9C2BC', hairLt: '#E6E0DA', shawl: '#E2CFA2', shawlDk: '#BCA676' },
  { skin: '#C48A62', skinDk: '#9E6640', skinLt: '#E2AE88', hair: '#7E747E', hairLt: '#A49AA4', shawl: '#EEDCB4', shawlDk: '#C8B48A' },
];
const RISHI_BEARD = ['#F4F0E8', '#D2CCC6', '#8E848E'];
const BARK_DHOTI = { dhoti: CP.bark, dhotiDk: CP.barkDk, dhotiLt: CP.barkLt, border: '#5A3A20' };
function rishi(x, y, u, k = 0, o = {}) {
  return valmiki(x, y, u, { beard: RISHI_BEARD[k], ...o, pal: { ...BARK_DHOTI, ...RISHI_PAL[k], ...(o.pal || {}) } });
}
// Maa Anjana on Parvati's rig: a forest-green saree, a saffron odhni, no crown
const ANJ_PAL = { saree: '#3E8E5A', sareeDk: '#2A6A40', sareeLt: '#6EB884', blouse: '#D9762E', blouseDk: '#A8541A',
  veil: '#F2A23A', veilDk: '#C8781E', bangle: '#D2283A', skin: '#EDB48A', skinDk: '#CC8A5F', skinLt: '#FFD9B8', lip: '#C0505E' };
function anjana(x, y, u, o = {}) {
  return parvati(x, y, u, { crown: false, veil: 1, col: ANJ_PAL.skin, dk: ANJ_PAL.skinDk, lt: ANJ_PAL.skinLt, ...o, pal: { ...ANJ_PAL, ...(o.pal || {}) } });
}
// Papa Kesari, a vanara king: Hanuman's rig in a deeper bronze, a teal dhoti, a plain gold band for a crown
const KES_PAL = { skin: '#B8743A', skinDk: '#8A5022', skinLt: '#D8985A', fur: '#B8743A', furDk: '#8A5022', furLt: '#D8985A',
  mask: '#F2CFA8', maskDk: '#D6A47A', dhoti: '#2E7A6A', dhotiDk: '#1E5A4C', dhotiLt: '#5EA894' };
function kesari(x, y, u, o = {}) {
  const prev = o.hat;
  return hanuman(x, y, u, { crown: false, gada: 0, ...o, pal: { ...KES_PAL, ...(o.pal || {}) },
    hat: (uu, sw) => {
      boilSeed('kesari band');
      paint(U([[-3.1, -22.9], [-1.5, -23.7], [0, -23.9], [1.5, -23.7], [3.1, -22.9], [3, -22.2], [1.5, -22.95], [0, -23.15], [-1.5, -22.95], [-3, -22.2]], uu), { wash: CP.gold, fill: CP.goldDk, fillOp: 40, tex: .4, ink: CP.ink, sw: sw * .6, curv: .4 });
      paint(ellPts(0, -23.55 * uu, .42 * uu, .42 * uu, 10), { wash: '#D2283A', ink: CP.ink, sw: sw * .4 });
      if (prev) prev(uu, sw);
    } });
}

// ---------- props ----------
// a sruk, the long wooden yagna ladle: handle from (0, 0) along +x for len, the bowl at the far end (local space; place
// it with ladle(x, y, len, a))
function ladleShape(len, sw = 1, cut = 1) {
  const L = len * cut;
  paint(ribbon([[0, 0], [L * .5, -len * .005], [L * .97, 0]], len * .055, len * .045), { wash: CP.wood, fill: CP.woodDk, fillOp: 45, tex: .5, ink: CP.ink, sw: sw * .8 });
  inkLine([[len * .05, -len * .012], [L * .9, -len * .014]], sw * .5, CP.woodLt, 'inkfine', .2);
  if (cut < 1) {   // the snapped end: a jagged splinter
    paint([[L * .97, -len * .028], [L * 1.03, -len * .02], [L, -len * .005], [L * 1.05, len * .008], [L * .99, len * .024], [L * .95, len * .024]], { wash: CP.woodLt, ink: CP.ink, sw: sw * .6 });
    return;
  }
  paint(ellPts(len * 1.07, 0, len * .13, len * .09, 16), { wash: CP.wood, fill: CP.woodDk, fillOp: 50, tex: .5, ink: CP.ink, sw: sw * .9 });
  paint(ellPts(len * 1.08, -len * .02, len * .09, len * .05, 12), { wash: CP.woodDk, ink: null });
}
function ladle(x, y, len, a, key = 'ladle', sw = 1.4) { boilSeed(key); push(); translate(x, y); rotate(a); ladleShape(len, sw); pop(); }
// the two halves of a snapped ladle: the handle end in the hand at (x, y), the bowl end flying off by its own pose
function ladleBroken(x, y, len, a, key = 'lb', sw = 1.4) { boilSeed(key); push(); translate(x, y); rotate(a); ladleShape(len, sw, .55); pop(); }
function ladleHead(x, y, len, a, key = 'lh', sw = 1.4) {   // the bowl end on its own, (x, y) = its broken end
  boilSeed(key); push(); translate(x, y); rotate(a); translate(-len * .55, 0);
  paint(ribbon([[len * .55, 0], [len * .97, 0]], len * .05, len * .045), { wash: CP.wood, fill: CP.woodDk, fillOp: 45, tex: .5, ink: CP.ink, sw: sw * .8 });
  paint(ellPts(len * 1.07, 0, len * .13, len * .09, 16), { wash: CP.wood, fill: CP.woodDk, fillOp: 50, tex: .5, ink: CP.ink, sw: sw * .9 });
  paint(ellPts(len * 1.08, -len * .02, len * .09, len * .05, 12), { wash: CP.woodDk, ink: null });
  pop();
}
// a round clay pot standing on (x, y), s tall; crack 0..1 runs a crack up it, split 0..1 breaks it in two (ghee spills)
function clayPot(x, y, s, crack = 0, split = 0, key = 'pot', squash = 0) {
  boilSeed(key);
  const sy = 1 - squash * .2, sx = 1 + squash * .15, cy = y - s * .44 * sy;
  if (split > 0) {   // two halves leaning apart, a gold puddle between them
    paint(ellPts(x, y - 2, s * (.3 + .5 * split), s * .08, 16), { wash: CP.ghee, ink: CP.ink, sw: .6 });
    for (const side of [-1, 1]) {
      push(); translate(x + side * s * .12 * split, y); rotate(side * .45 * split); translate(-x, -y);
      const P = [];
      for (let i = 0; i <= 10; i++) { const a = Math.PI / 2 + side * (i / 10) * Math.PI; P.push([x + Math.cos(a) * s * .5 * sx, cy + Math.sin(a) * s * .44 * sy]); }
      P.push([x + side * s * .06, cy - s * .3], [x - side * s * .05, cy - s * .1], [x + side * s * .04, cy + s * .15]);
      paint(P.map(([a, b]) => [a + side * 0, b]), { wash: CP.clay, fill: CP.clayDk, fillOp: 50, tex: .5, ink: CP.ink, sw: 1 });
      pop();
    }
    return;
  }
  paint(ellPts(x, cy, s * .5 * sx, s * .44 * sy, 24), { wash: CP.clay, fill: CP.clayDk, fillOp: 50, tex: .5, ink: CP.ink, sw: 1.1 });
  paint(ellPts(x - s * .18, cy - s * .14, s * .14, s * .1, 12, 0, -.4), { wash: CP.clayLt, washOp: 200, ink: null });
  paint(rrPts(x - s * .2 * sx, cy - s * .58 * sy, s * .4 * sx, s * .16, s * .05), { wash: CP.clay, fill: CP.clayDk, fillOp: 40, tex: .4, ink: CP.ink, sw: 1 });
  inkLine([[x - s * .42 * sx, cy - s * .06], [x + s * .42 * sx, cy - s * .06]], 1, CP.clayDk, 'inkfine', .3);
  if (crack > 0) {
    const n = Math.max(2, Math.round(6 * crack));
    const C = [[x + s * .02, y - s * .02]]; for (let i = 1; i < n; i++) C.push([x + (i % 2 ? -1 : 1) * s * .06, y - s * .02 - i * s * .8 / 6]);
    inkLine(C, 1.6, CP.ink, 'ink', 0);
  }
}
// a brass kamandalu (water pot with a spout and a loop handle), in arm space hanging from the hand at (0, 0)
function kamandalu(u, sw, s = 1, tilt = 0) {
  push(); rotate(tilt); scale(s);
  inkLine([[-.55 * u, .1 * u], [-.6 * u, -.5 * u], [0, -.85 * u], [.6 * u, -.5 * u], [.55 * u, .1 * u]], sw * 1.4, CP.brassDk, 'ink', .6);   // the handle
  paint(ellPts(0, 1.15 * u, 1.05 * u, .9 * u, 20), { wash: CP.brass, fill: CP.brassDk, fillOp: 50, tex: .4, ink: CP.ink, sw: sw * .8 });
  paint(ribbon([[.8 * u, 1.0 * u], [1.45 * u, .6 * u], [1.85 * u, .15 * u]], .38 * u, .16 * u), { wash: CP.brass, ink: CP.ink, sw: sw * .6 });   // the spout
  paint(rrPts(-.5 * u, .1 * u, 1 * u, .35 * u, .12 * u), { wash: CP.brass, fill: CP.brassDk, fillOp: 40, tex: .3, ink: CP.ink, sw: sw * .6 });
  paint(ellPts(-.35 * u, .9 * u, .25 * u, .18 * u, 10, 0, -.4), { wash: CP.brassLt, washOp: 220, ink: null });
  pop();
}
function kamandaluAt(x, y, s, key = 'kmd', tilt = 0) { boilSeed(key); push(); translate(x, y); kamandalu(s, Math.max(.6, s / 20), 1, tilt); pop(); }
// a boulder on (x, y), s wide; split 0..1 cracks it and the halves fall apart
function boulder(x, y, s, split = 0, key = 'boulder') {
  boilSeed(key);
  paint(ellPts(x, y + 4, s * .55, s * .08, 16), { fill: CP.ink, fillOp: 70, bleed: .2, tex: .3, ink: null });
  const halves = split > 0 ? [-1, 1] : [0];
  for (const side of halves) {
    push();
    if (side) { translate(x + side * s * .5, y); rotate(side * .5 * easeOut(split)); translate(-x - side * s * .5, -y); translate(side * s * .12 * split, 0); }
    const P = [];
    for (let i = 0; i <= 20; i++) {
      const a = Math.PI + i / 20 * Math.PI, r = 1 + .06 * Math.sin(i * 2.7);
      P.push([x + Math.cos(a) * s * .5 * r, y + Math.sin(a) * s * .55 * r]);
    }
    let Q = P;
    if (side) {
      Q = P.filter(([px]) => side < 0 ? px <= x + 4 : px >= x - 4);
      const J = [[x + 4 * side, y], [x - 10 * side, y - s * .14], [x + 12 * side, y - s * .3], [x - 6 * side, y - s * .45], [x + 4 * side, y - s * .56]];
      Q = side < 0 ? [...Q, ...J.reverse()] : [...J, ...Q];
    }
    paint(Q, { wash: CP.rock, fill: CP.rockDk, fillOp: 55, tex: .6, ink: CP.ink, sw: 1.4, curv: .2 });
    if (!side || side < 0) paint(ellPts(x - s * .2, y - s * .36, s * .12, s * .07, 12, 0, -.3), { wash: CP.rockLt, washOp: 200, ink: null });
    pop();
  }
  if (split > 0 && split < .35) for (let i = 0; i < 6; i++) {   // chips flying
    const a = -Math.PI * (.15 + .7 * hash(i * 3.1)), d = s * (.2 + 2.2 * split);
    paint(ellPts(x + Math.cos(a) * d, y - s * .3 + Math.sin(a) * d, 7, 6, 6), { wash: CP.rockDk, ink: null });
  }
}
// one piece of bark cloth, hanging from (x, y) (its top), w wide, h long; torn 0..1 rips it (a ragged hem, a slit)
function barkStrip(x, y, w, h, rot = 0, torn = 0, key = 'strip') {
  boilSeed(key);
  push(); translate(x, y); rotate(rot);
  const hh = h * (1 - .45 * torn), R = [];
  for (let i = 0; i <= 6; i++) R.push([w * .5 - i * w / 6, hh + (torn ? (i % 2 ? -1 : 1) * h * .08 : 0)]);
  paint([[-w * .5, 0], [w * .5, 0], ...R], { wash: CP.bark, fill: CP.barkDk, fillOp: 55, tex: .7, ink: CP.ink, sw: 1, curv: .1 });
  for (let i = 1; i < 4; i++) inkLine([[-w * .5 + i * w / 4, h * .05], [-w * .5 + i * w / 4 + 3, hh * .9]], .7, CP.barkDk, 'inkfine', .3);
  if (torn > .3) inkLine([[w * .1, hh], [-w * .05, hh * .55], [w * .08, hh * .3]], 1.2, CP.ink, 'ink', 0);
  pop();
}
// a drying line between posts at x0 and x1 at height y, sagging by sag (px); strips: [[k 0..1 along the line, torn,
// dropped 0..1]]; returns the line's point at k
function dryingLine(x0, x1, y, sag, strips = [], key = 'line', grab = null) {
  const at = k => {
    if (grab) {   // the line pulled down to a grip point grab = [k, x, y]
      const [gk, gx, gy] = grab;
      return k < gk ? [lerp(x0, gx, k / gk), lerp(y, gy, k / gk) + Math.sin(k / gk * Math.PI) * sag * .2] : [lerp(gx, x1, (k - gk) / (1 - gk)), lerp(gy, y, (k - gk) / (1 - gk)) + Math.sin((k - gk) / (1 - gk) * Math.PI) * sag * .2];
    }
    return [lerp(x0, x1, k), y + Math.sin(k * Math.PI) * sag];
  };
  boilSeed(key + 'posts');
  for (const px of [x0, x1]) paint(ribbon([[px, y - 20], [px + 3, y + 300], [px - 2, y + 620]], 22, 26), { wash: CP.wood, fill: CP.woodDk, fillOp: 50, tex: .5, ink: CP.ink, sw: 1 });
  boilSeed(key + 'rope');
  const L = []; for (let i = 0; i <= 16; i++) L.push(at(i / 16));
  inkLine(L, 3, CP.ropeDk, 'ink', .4);
  strips.forEach(([k, torn, drop], i) => {
    if (drop >= 1) return;
    const p = at(k), d = easeIn(clamp(drop));
    barkStrip(p[0] + d * 60 * (i % 2 ? 1 : -1), p[1] + d * 600, 86, 170, Math.sin(T * 1.6 + i) * .04 + d * (i % 2 ? 1.2 : -1.2), torn, key + 's' + i);
  });
  return at;
}
// the yagna: a square brick fire pit seen from the front, flames on top; flare 0..1 a big burst
function yagnaKund(x, y, s, t, flare = 0, key = 'kund') {
  boilSeed(key + 'pit');
  paint([[x - s * .5, y], [x + s * .5, y], [x + s * .44, y - s * .26], [x - s * .44, y - s * .26]], { wash: CP.brick, fill: CP.brickDk, fillOp: 55, tex: .5, ink: CP.ink, sw: 1.2 });
  for (let r = 1; r < 3; r++) inkLine([[x - s * .5 + r * s * .02, y - r * s * .087], [x + s * .5 - r * s * .02, y - r * s * .087]], .8, CP.brickDk, 'inkfine', 0);
  for (let i = 1; i < 5; i++) inkLine([[x - s * .5 + i * s * .2, y], [x - s * .5 + i * s * .2 - (i - 2.5) * s * .02, y - s * .087]], .7, CP.brickDk, 'inkfine', 0);
  const fh = s * (.42 + .35 * flare), cx = x, by = y - s * .24;
  glow(cx, by - fh * .4, s * (1 + flare), '#FFB050', .5 + .3 * flare);
  boilSeed(key + 'fire');
  const n = 5;
  for (let i = 0; i < n; i++) {
    const fx = cx + (i - 2) * s * .14, h = fh * (.6 + .4 * Math.sin(i * 1.7 + 1)) * (1 + .12 * Math.sin(t * 13 + i * 2)), w = s * .1;
    paint([[fx - w, by], [fx - w * .6, by - h * .5], [fx + Math.sin(t * 9 + i) * w * .5, by - h], [fx + w * .6, by - h * .5], [fx + w, by]], { wash: i % 2 ? CP.fire : CP.fireOut, ink: null, curv: .6 });
  }
  for (let i = 0; i < 3; i++) { const fx = cx + (i - 1) * s * .16, h = fh * .5 * (1 + .15 * Math.sin(t * 15 + i)); paint([[fx - s * .05, by], [fx, by - h], [fx + s * .05, by]], { wash: CP.fireIn, ink: null, curv: .6 }); }
}
// a puff of smoke (age 0..1), s across, drifting toward dir
function smokePuff(x, y, s, age, key = 'smoke', dir = [0, -1], col = CP.smoke) {
  if (age < 0 || age > 1) return;
  boilSeed(key);
  for (let i = 0; i < 9; i++) {
    const a = i / 9 * TAU + hash(i) * .6, r = s * (.15 + .6 * easeOut(age)) * (.7 + .5 * hash(i * 2.2));
    const px = x + Math.cos(a) * r + dir[0] * age * s * .8, py = y + Math.sin(a) * r * .8 + dir[1] * age * s * .8, rr = s * (.22 + .14 * hash(i * 4.1)) * (1 - age * .3);
    paint(ellPts(px, py, rr, rr * .85, 12), { wash: i % 3 ? col : CP.smokeLt, washOp: 230 * (1 - age * age), ink: null });
  }
}
// a boon: a little glowing orb of colour with a twinkle, at (x, y)
function boonLight(x, y, s, col, t, key = 'boon') {
  boilSeed(key);
  glow(x, y, s * 3, col, .7);
  paint(ellPts(x, y, s * .55, s * .55, 14), { wash: mixCol(col, '#FFFFFF', .5), ink: null });
  paint(starPts(x, y, s * (1 + .2 * Math.sin(t * 14)), .25, 4, t * 2), { wash: '#FFFFFF', washOp: 220, ink: null });
}
// a pink hibiscus, 5 petals, centred at (x, y)
function flowerProp(x, y, s, key = 'flower', rot = 0) {
  boilSeed(key);
  for (let i = 0; i < 5; i++) { const a = rot + i / 5 * TAU; paint(ellPts(x + Math.cos(a) * s * .55, y + Math.sin(a) * s * .55, s * .48, s * .38, 12, 0, a), { wash: '#F2557A', fill: '#C83458', fillOp: 40, tex: .4, ink: CP.ink, sw: .8 }); }
  paint(ellPts(x, y, s * .22, s * .22, 10), { wash: CP.gold, ink: CP.ink, sw: .6 });
}
function pebble(x, y, s, key = 'pebble', rot = 0) {
  boilSeed(key);
  paint(ellPts(x, y - s * .38, s * .5, s * .38, 14, 0, rot), { wash: CP.rock, fill: CP.rockDk, fillOp: 50, tex: .5, ink: CP.ink, sw: 1 });
  paint(ellPts(x - s * .15, y - s * .5, s * .14, s * .08, 8), { wash: CP.rockLt, ink: null });
}
function waterDrop(x, y, s, key = 'drop', a = 255) {
  boilSeed(key);
  paint([[x, y - s * 1.4], [x + s * .7, y - s * .1], [x + s * .5, y + s * .55], [x, y + s * .75], [x - s * .5, y + s * .55], [x - s * .7, y - s * .1]], { wash: CP.water, washOp: a, ink: CP.ink, sw: .6, curv: .5 });
  paint(ellPts(x - s * .2, y, s * .16, s * .24, 8), { wash: CP.waterLt, washOp: a, ink: null });
}
// soot on a rishi's face (narada's hat hook, head space): k 0..1
const sootHat = k => (u, sw) => {
  if (k <= 0) return;
  boilSeed('soot');
  paint(ellPts(0, -20.4 * u, 3.0 * u, 2.6 * u, 22), { wash: CP.soot, washOp: 200 * k, ink: null });
  for (let i = 0; i < 5; i++) paint(ellPts((-2 + i) * u, (-22.6 + .5 * Math.sin(i * 2)) * u, .7 * u, .5 * u, 10), { wash: CP.soot, washOp: 220 * k, ink: null });
};
// a ring of force, radius r, at (x, y); a fades it
function shockRing(x, y, r, a = 1, key = 'ring', col = '#FFF2C0', flat = .35) {
  if (a <= 0) return;
  boilSeed(key);
  const P = ellPts(x, y, r, r * flat, 40);
  inkLine([...P, P[0]], 10 * a, col, 'ink', .5);
  inkLine([...P, P[0]], 3 * a, '#FFFFFF', 'inkfine', .5);
}
// a soft cloud (from Part 9)
function cloudPuff(x, y, s, key, a = 255, col = '#FFF6EC', dk = '#E8D6CC') {
  boilSeed('cloud' + key);
  paint(ellPts(x, y + s * .18, s * 1.1, s * .32, 18), { wash: dk, washOp: a, ink: null });
  for (const [dx, dy, r] of [[-.6, 0, .42], [-.15, -.22, .55], [.4, -.08, .46], [.85, .06, .3]]) paint(ellPts(x + dx * s, y + dy * s, r * s, r * s * .85, 16), { wash: col, washOp: a, ink: null });
}
// a puff of magic smoke (age 0..1) (from Part 9)
function poof(x, y, s, age, key = 'pf', cols = ['#FFF2C8', '#F2D890']) {
  if (age < 0 || age > 1) return;
  boilSeed(key);
  glow(x, y, s * 1.6 * (1 - age), '#FFE0A0', .6 * (1 - age));
  for (let i = 0; i < 8; i++) { const a = i / 8 * TAU, r = s * (.3 + age * .9); paint(ellPts(x + Math.cos(a) * r, y + Math.sin(a) * r * .7, s * .35 * (1 - age * .6), s * .3 * (1 - age * .6), 12), { wash: cols[i % 2], washOp: 255 * (1 - age), ink: null }); }
}
// the sun as a friendly disc (for the memory and the time-lapse)
function sunDisc(x, y, r, key = 'sun', face = false) {
  boilSeed(key);
  glow(x, y, r * 3.2, '#FFC860', .7);
  paint(ellPts(x, y, r, r, 30), { wash: '#FFB43A', fill: '#F2862A', fillOp: 50, tex: .4, ink: CP.ink, sw: 1.2 });
  paint(ellPts(x - r * .3, y - r * .3, r * .35, r * .22, 14, 0, -.4), { wash: '#FFE08A', washOp: 220, ink: null });
  if (face) {
    for (const s of [-1, 1]) inkLine([[x + s * r * .35 - r * .12, y - r * .08], [x + s * r * .35, y - r * .18], [x + s * r * .35 + r * .12, y - r * .08]], 2.4, CP.ink, 'ink', .5);
    inkLine([[x - r * .25, y + r * .25], [x, y + r * .38], [x + r * .25, y + r * .25]], 2.4, CP.ink, 'ink', .5);
  }
}

// ---------- sets ----------
// the ocean shore at dusk: the sky, Lanka a gold speck far out, the sea from hy down, a dark cliff of rock on the right
// (its top at rock = [x, y]), sand in front; dusk 0..1 deepens to the first stars
function shore(t, o = {}) {
  const hy = o.hy ?? 1150, key = o.key || 'sh', dk = o.dusk ?? 0;
  boilSeed(key + 'sky');
  paint(rectPts(-1800, -2400, W + 3600, hy + 2500), { wash: mixCol(CP.duskHi, CP.night, dk * .6), ink: null });
  for (let i = 0; i < 6; i++) {   // soft bands: violet → rose → peach toward the horizon
    const k = (i + 1) / 6, c = k < .5 ? mixCol(CP.duskHi, CP.duskMid, k * 2) : mixCol(CP.duskMid, CP.duskLo, (k - .5) * 2);
    paint(ellPts(540, hy + 40, 1500 - i * 40, 1100 - i * 165, 30), { fill: mixCol(c, CP.night, dk * .4), fillOp: 210, bleed: .25, tex: .3, ink: null });
  }
  if (dk > .2) { boilSeed(key + 'stars'); for (let i = 0; i < 16; i++) paint(starPts(-150 + hash(i * 2.3) * 1400, 120 + hash(i * 6.7) * (hy - 700), 3 + 4 * hash(i * 3.3) * (.6 + .4 * Math.sin(t * 2 + i)), .4, 4), { wash: '#FFF6DA', washOp: 255 * clamp((dk - .2) * 2), ink: null }); }
  for (let i = 0; i < 4; i++) cloudPuff(-200 + frac(hash(i * 7.3) + t * .006) * 1500, 380 + hash(i * 5.1) * (hy - 760), 60 + 50 * hash(i * 1.9), key + 'c' + i, 160, '#F6C8B0', '#D89A9A');
  // Lanka: a tiny gold glint on the horizon
  boilSeed(key + 'lanka');
  const lx = o.lankaX ?? 300;
  glow(lx, hy - 8, 60, '#FFD070', .5 + .15 * Math.sin(t * 2));
  paint([[lx - 46, hy], [lx - 30, hy - 14], [lx - 14, hy - 26], [lx, hy - 34], [lx + 16, hy - 24], [lx + 34, hy - 12], [lx + 50, hy]], { wash: '#6A4A5A', ink: null, curv: .4 });
  for (let i = 0; i < 4; i++) paint(rectPts(lx - 20 + i * 12, hy - 30 - 10 * Math.sin(i), 6, 14 + 6 * Math.sin(i)), { wash: CP.lanka, ink: null });
  // the sea
  boilSeed(key + 'sea');
  paint(rectPts(-900, hy, W + 1800, 1600), { wash: mixCol(CP.sea, CP.seaDk, dk * .6), ink: null });
  paint(rectPts(-900, hy, W + 1800, 18), { wash: CP.seaLt, washOp: 150, ink: null });
  paint(ellPts(540, hy + 60, 700, 50, 20), { fill: CP.seaLt, fillOp: 90, bleed: .3, tex: .3, ink: null });
  for (let i = 0; i < 16; i++) {
    const r = hash(i * 2.3), yy = hy + 30 + r * r * 760, x = 1400 - frac(hash(i * 7.7) + t * (.01 + .015 * r)) * 1900, w = 40 + r * 80;
    inkLine([[x, yy], [x + w * .5, yy - 8 - r * 6], [x + w, yy]], 1.2 + r * 1.6, mixCol(CP.seaLt, '#9EC8E8', .4), 'inkfine', .5);
  }
}
// the foreground: a dark cliff of rock (its flat top at [rx, ry], running off the right edge) with foam at its foot
function shoreRock(t, rx, ry, w = 520, key = 'rock') {
  boilSeed(key);
  const x0 = rx - w * .55;
  paint(rectPts(x0, ry, W + 900 - x0, 1300), { wash: CP.cliff, fill: CP.cliffDk, fillOp: 45, tex: .6, ink: null });   // the body (a plain rect keeps its fill)
  paint([[x0 - 10, ry + 30], [x0 + w * .06, ry - 12], [rx - w * .1, ry - 18], [rx + w * .3, ry - 14], [rx + w * .7, ry - 26], [rx + w * .7, ry + 60], [x0 + 20, ry + 70]], { wash: CP.cliff, ink: null, curv: .2 });
  inkLine([[x0 - 10, ry + 30], [x0 + w * .06, ry - 12], [rx - w * .1, ry - 18], [rx + w * .3, ry - 14], [rx + w * .7, ry - 26], [Math.min(rx + w * 1.4, W + 400), ry - 30]], 1.4, CP.ink, 'ink', .3);
  inkLine([[x0 - 10, ry + 30], [x0 - 30, ry + 300], [x0 - 10, ry + 700]], 1.4, CP.ink, 'ink', .3);
  paint(ellPts(rx - w * .1, ry + 26, w * .36, 22, 16), { wash: CP.cliffLt, washOp: 170, ink: null });
  for (let i = 0; i < 4; i++) inkLine([[x0 + 40 + i * w * .25, ry + 80 + i * 40], [x0 + 70 + i * w * .25, ry + 220 + i * 30]], 1, CP.cliffDk, 'inkfine', .4);
  boilSeed(key + 'foam');
  for (let i = 0; i < 6; i++) { const fx = x0 - 30 + i * 46, k = .5 + .5 * Math.sin(t * 2.2 + i); paint(ellPts(fx, ry + 640 + Math.sin(i) * 20, 34 + 14 * k, 12, 10), { wash: '#F2F6FA', washOp: 160 + 80 * k, ink: null }); }
}
// a sky time-lapse: k counts days (fractional), suns and moons arcing over, the sky cycling day → night
function skyLapse(t, k, key = 'lapse') {
  const ph = frac(k), day = Math.sin(ph * Math.PI) ** .6;   // 0..1 within each day; night between
  boilSeed(key + 'sky');
  paint(rectPts(-900, -900, W + 1800, H + 1800), { wash: mixCol(CP.night, '#8FC0EA', day), ink: null });
  paint(ellPts(540, 1500, 1300, 700, 26), { fill: mixCol(CP.nightLo, '#FCE3C4', day), fillOp: 200, bleed: .3, tex: .4, ink: null });
  if (day < .6) { boilSeed(key + 'st'); for (let i = 0; i < 18; i++) paint(starPts(hash(i * 2.3) * 1080, 200 + hash(i * 6.7) * 1100, 3 + 4 * hash(i * 3.3), .4, 4), { wash: '#FFF6DA', washOp: 255 * (1 - day / .6), ink: null }); }
  const a = Math.PI * (1 - ph);   // the sun by day, the moon by night (half a turn later)
  const sx = 540 + Math.cos(a) * 620, sy = 1300 - Math.sin(a) * 900;
  sunDisc(sx, sy, 70, key + 'sun');
  const a2 = Math.PI * (1 - frac(ph + .5)), mx = 540 + Math.cos(a2) * 620, my = 1300 - Math.sin(a2) * 900;
  boilSeed(key + 'moon'); glow(mx, my, 160, '#FFF4D2', .4); paint(ellPts(mx, my, 52, 52, 20), { wash: CP.moon, ink: CP.ink, sw: 1 });
  for (let i = 0; i < 5; i++) cloudPuff(1300 - frac(hash(i * 4.4) + k * 1.3) * 1900, 400 + hash(i * 3.3) * 900, 70 + 50 * hash(i), key + 'c' + i, 210);
}

// ---------- from ad 59 (pearls_props.js): the palette bits, the peach ground, sparkles, diyas and the Books 1–3 card ----------
const PR = {
  ink: '#2B2233', cream: '#FFF5E2',
  peach: '#FBE0CF', peachDk: '#F2C2A6', peachLt: '#FFF1E6', ray: '#FFE9D2',
  stone: '#F0C8A8', stoneDk: '#D6A282', stoneLt: '#FBE2CC', pillar: '#FFF0DC', pillarDk: '#E6CDA8', marble: '#F6EADA', marbleDk: '#E2D0B8',
  gold: '#F2C230', goldDk: '#B88A1C', goldLt: '#FFE69A', red: '#B8202E', velvet: '#8E1E3A',
  pearl: '#FBF6EE', pearlDk: '#D9CFE6', pearlLt: '#FFFFFF', pearlIn: '#EFE6DA',
  dusk: '#5A3A4E', duskDk: '#3A2436', duskLt: '#7E5466', wall: '#E8B98E', wallDk: '#C9946A', wallLt: '#F6D3AE',
  lamp: '#FFC24A', flame: '#FFE08A', flameIn: '#FFF4C8', flameOut: '#FF8A2A', clay: '#B85A32', clayDk: '#86391E',
  marigold: '#F39A2E', marigoldDk: '#D0701A', leaf: '#5E9A5A',
  heart: '#FFE7A6', heartLt: '#FFF6D8', heartDk: '#F7C66A', heartRim: '#E89A2A',
};
const TK = {
  ink: '#2B2233', cream: '#FFF5E2', marigold: '#F39A2E', petal: '#F4A6B8', gold: '#EDB43C', goldLt: '#FFE39A',
  rkOrange: '#F15A24', peach: '#FBE0CF', brown: '#3A2418', grey: '#6B5A50', teal: '#2E5F5A',
};
// peach with soft turning rays and drifting petals (the hook, the bridge, the ask)
function peachGround(t, cx = 540, cy = 1000) {
  boilSeed('peach');
  paint(rectPts(-200, -300, W + 400, H + 600), { wash: PR.peach, ink: null });
  boilSeed('peachrays');
  for (let i = 0; i < 12; i++) {
    const a = i / 12 * TAU + t * .05, w = .11;
    paint([[cx, cy], [cx + Math.cos(a - w) * 1700, cy + Math.sin(a - w) * 1700], [cx + Math.cos(a + w) * 1700, cy + Math.sin(a + w) * 1700]], { fill: PR.ray, fillOp: 110, bleed: .15, tex: .3, ink: null });
  }
  paint(ellPts(cx, cy, 560, 600, 30), { fill: PR.peachLt, fillOp: 150, bleed: .3, tex: .4, border: .2, ink: null });
  boilSeed('peachpetals');
  for (let i = 0; i < 8; i++) {
    const x = 60 + hash(i * 3.3) * 960 + 30 * Math.sin(t * .9 + i), y = frac(hash(i * 7.1) + t * (.035 + .02 * hash(i))) * (H + 80) - 40, r = t * .8 + i;
    paint([[x + Math.cos(r) * 15, y + Math.sin(r) * 15], [x + Math.cos(r + 1.6) * 7, y + Math.sin(r + 1.6) * 7], [x - Math.cos(r) * 15, y - Math.sin(r) * 15], [x + Math.cos(r - 1.6) * 7, y + Math.sin(r - 1.6) * 7]], { wash: i % 2 ? TK.marigold : TK.petal, washOp: 200, ink: null, curv: .5 });
  }
}
// a little 'awww' heart-sparkle for reactions
function sparkleBurst(x, y, s, age, key = 'burst', n = 8, cols = [TK.cream, TK.goldLt]) {
  if (age < 0 || age > .8) return;
  const k = age / .8; boilSeed(key);
  glow(x, y, s * (1 + k), cols[1], .6 * (1 - k));
  for (let i = 0; i < n; i++) { const a = i / n * TAU + hash(i) * .5, d = s * (.3 + 1.1 * easeOut(k)) * (.7 + .5 * hash(i * 2.1)); paint(starPts(x + Math.cos(a) * d, y + Math.sin(a) * d - k * s * .2, s * .22 * (1 - k * .8) * (.6 + hash(i * 5)), .3, 4), { wash: cols[i % 2], ink: null }); }
}
function diya(x, y, s, lit, key) {
  boilSeed('diya ' + key);
  const fl = Math.min(lit, 1);
  if (lit > .02) glow(x + s * .55, y - s * 1.1, s * 3.2, PR.flameOut, .5 * fl);
  paint([[x - s, y - s * .55], [x + s * .7, y - s * .55], [x + s * 1.25, y - s * .8], [x + s * .9, y - s * .3], [x + s * .5, y], [x - s * .6, y], [x - s * .95, y - s * .25]], { wash: PR.clay, fill: PR.clayDk, fillOp: 60, tex: .4, ink: PR.ink, sw: clamp(s / 14, .5, 1.6), curv: .4 });
  paint(ellPts(x - s * .1, y - s * .55, s * .85, s * .16, 10), { wash: PR.clayDk, ink: null });
  if (lit > .02) {
    const fx = x + s * .95, fy = y - s * .8, h = s * (1.2 + .25 * Math.sin(T * 17 + x)) * fl, w = s * .42;
    paint([[fx - w, fy], [fx - w * .7, fy - h * .5], [fx + Math.sin(T * 11 + x) * w * .3, fy - h], [fx + w * .7, fy - h * .5], [fx + w, fy], [fx, fy + w * .4]], { wash: PR.flame, ink: null, curv: .6 });
    paint(ellPts(fx, fy - h * .3, w * .4, h * .3, 8), { wash: PR.flameIn, ink: null });
  }
}
function templeBell(x, y, s, swing, key = 'bell') {
  boilSeed(key);
  inkLine([[x, y - 500], [x + Math.sin(swing) * 6, y - s]], 1.2, PR.goldDk, 'ink', 0);
  push(); translate(x, y - s); rotate(swing * .3);
  paint([[-s * .55, s * 1.1], [-s * .45, s * .3], [-s * .2, 0], [s * .2, 0], [s * .45, s * .3], [s * .55, s * 1.1]], { wash: PR.gold, fill: PR.goldDk, fillOp: 60, tex: .4, ink: PR.ink, sw: 1, curv: .4 });
  paint(ellPts(0, s * 1.2, s * .15, s * .15, 8), { wash: PR.goldDk, ink: PR.ink, sw: .6 });
  pop();
}
// ---------------- the card ----------------
function pcCard(t, C) {
  boilSeed('cardbg');
  paint(rectPts(-60, -60, W + 120, H + 120), { wash: TK.peach, ink: null });
  boilSeed('card glow'); glow(470, 900, 420, '#FFE7A8', .3);
  for (let i = 0; i < 7; i++) diya(110 + i * 125, 1490, 22, clamp((t - C.cap) * 4 - i * .4), 'card' + i);
  const X = 470, pk = t0 => Math.max(0, t - t0) * 5, br = Math.sin(t * 1.3) * .01;
  if (t > C.cap) letter('Stories of SHAKTI, for little ones', X, 660, 46, TK.teal, { screen: true, font: '50px Marcellus', ink: false, pop: pk(C.cap), maxW: 860 });
  [1, 2, 3].forEach((b, j) => {
    const t0 = C.covers + j * .15; if (t < t0) return;
    const x = X + (j - 1) * 290, y = 900 + (j === 1 ? -16 : 0);
    picture(PICS['book' + b], x, y, 276, 276, { rot: (j - 1) * .05 + (j % 2 ? br : -br), pop: pk(t0), r: 8, shadow: 18 });
  });
  if (t > C.price) {
    letter('Books 1–3 · OUT NOW', X, 1130, 46, TK.brown, { screen: true, font: '700 50px Poppins', ink: false, maxW: 860, pop: pk(C.price) });
    letter('Set of 3 for ₹500', X, 1196, 44, TK.rkOrange, { screen: true, font: '700 52px Poppins', ink: false, maxW: 860, pop: pk(C.price + .12) });
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
// two vanaras' colours (from ad 59)
const VAN1 = { skin: '#B07A46', skinDk: '#80522C', skinLt: '#D09A66', fur: '#B07A46', furDk: '#80522C', furLt: '#D09A66', mask: '#F2D2AE', maskDk: '#D6A880',
  dhoti: '#2E7A6A', dhotiDk: '#1E5A4C', dhotiLt: '#5AA08E', border: '#F2C230', bead: '#C9A46A', beadDk: '#8E6E3E' };
const VAN2 = { skin: '#A39C94', skinDk: '#746C64', skinLt: '#C8C0B6', fur: '#A39C94', furDk: '#746C64', furLt: '#C8C0B6', mask: '#F4DCC8', maskDk: '#D8B49A',
  dhoti: '#6E4EA8', dhotiDk: '#4E3480', dhotiLt: '#9A7ACC', border: '#F2C230', bead: '#C9A46A', beadDk: '#8E6E3E' };
