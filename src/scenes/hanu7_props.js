// hanu7_props.js: sets and props for hanu7.js (ad 95, Hanuman Part 7, "BHARAT shot HANUMAN out of the sky").
// Loaded after src/scenes/hanu4_props.js (h4Bubble, h4Palace), hanu5_props.js (h5Lanka), hanu6_props.js (H6, h6Night,
// h6Impact, h6Dizzy) and sanj_props.js (ad 32: herbPeak, battlefield), all loaded from their branches. Pure functions
// of their arguments (and T for boil). Sets stay inside x -300..1380.
//   H7                                   the palette
//   h7Avadh                              Ayodhya at night with a ground to stand on (h6Night + a garden floor)
//   h7Ashram, h7Pond                     Kalanemi's false ashram at night (a hut, trees, a moon), his lake
//   h7Croc                               the crocodile (the cursed apsara), jaws opening
//   h7Bow, h7Blunt                       Bharat's bow as an armL hook with a tipless arrow; the tipless arrow in flight
//   h7Halo, h7Horns                      the false sage's too-perfect halo, and the horns that peek through his hair
//   h7Flames, h7Paduka                   small flames (Lanka burning in a bubble), Ram's sandals on a low gold seat
//   kalanemi, apsara, vaidya             the demon (the asura rig), the freed apsara (Parvati's rig), Sushena the healer
const H7 = {
  ink: '#2B2233', grass: '#27405A', grassDk: '#1A2C44', grassLt: '#3E5C7A', water: '#3E6E9E', waterDk: '#27507C', waterLt: '#BCE0F4',
  croc: '#5E9A5A', crocDk: '#3A6E3E', crocLt: '#A8CC8A', belly: '#E8E2B0', wood: '#8A5230', shaft: '#B88A52',
  halo: '#FFE9A0', gold: '#F5C542', goldDk: '#C8922A', seat: '#E8B43C',
};

// Ayodhya at night with a floor: h6Night's sky and roofs, then a dark garden ground from gy down
function h7Avadh(t, key = 'av', gy = 1700, mx = 770, my = 1010) {
  boilSeed(key + 'sky');
  paint(rectPts(-300, -600, W + 600, 2600), { wash: H6.night, ink: null });
  paint(ellPts(540, 1500, 1100, 700, 26), { fill: H6.nightLo, fillOp: 200, bleed: .3, tex: .4, ink: null });
  glow(mx, my, 190, '#FFF4D2', .45); paint(ellPts(mx, my, 62, 62, 18), { wash: '#FFF4D2', ink: null });
  boilSeed(key + 'st'); for (let i = 0; i < 22; i++) paint(starPts(-100 + hash(i * 2.3) * 1300, 380 + hash(i * 6.7) * 1100, 3 + 3 * hash(i * 3.3) * (.6 + .4 * Math.sin(t * 2 + i)), .4, 4), { wash: '#FFF6DA', ink: null });
  // the city's roofs, far off behind the garden
  boilSeed(key + 'roofs');
  const R = [[-200, 60, 260, 120], [80, 30, 200, 200], [300, 70, 240, 110], [560, 0, 180, 260], [760, 60, 260, 130], [1020, 40, 300, 170]];
  for (const [x, dy, w, h] of R) {
    const y = gy - 230 + dy;
    paint(rectPts(x, y, w, 400), { wash: H6.roof, ink: null });
    paint([[x - 10, y], [x + w / 2, y - h * .35], [x + w + 10, y]], { wash: H6.roofLt, ink: null });
    for (let j = 0; j < 2; j++) paint(rectPts(x + w * (.25 + j * .35), y + 40, 22, 30), { wash: H6.lamp, ink: null });
  }
  boilSeed(key + 'gr');
  paint([[-300, gy + 14], [200, gy - 8], [640, gy + 6], [1380, gy - 10], [1380, 2700], [-300, 2700]], { wash: H7.grass, fill: H7.grassDk, fillOp: 70, tex: .5, ink: H7.ink, sw: .9, curv: .5 });
  for (let i = 0; i < 9; i++) { const x = -200 + hash(i * 5.3) * 1500, y = gy + 40 + hash(i * 2.9) * 260; inkLine([[x - 14, y], [x - 6, y - 16], [x, y], [x + 8, y - 20], [x + 14, y]], 1, H7.grassLt, 'inkfine', .3); }
}

// the lake: a moonlit ellipse with ripples
function h7Pond(x, y, rx, ry, t, key = 'pd') {
  boilSeed(key);
  paint(ellPts(x, y, rx, ry, 30), { wash: H7.water, fill: H7.waterDk, fillOp: 70, tex: .3, ink: H7.ink, sw: 1 });
  for (let i = 0; i < 5; i++) { const q = frac(t * .25 + i / 5), w = rx * (.2 + .5 * hash(i * 3.3)), cx = x + (hash(i * 7.1) - .5) * rx * 1.2, cy = y + (hash(i * 4.7) - .5) * ry * 1.1; inkLine([[cx - w / 2, cy], [cx, cy - 3], [cx + w / 2, cy]], 1.2, mixCol(H7.waterLt, H7.water, q), 'inkfine', .5); }
}
// Kalanemi's ashram (Lanka 57.1: a lake, a temple, a fine garden), at night: a moon, a hut with a lamp, two trees, the
// lake at the front right
function h7Ashram(t, key = 'ah', pond = true) {
  boilSeed(key + 'sky');
  paint(rectPts(-300, -600, W + 600, 2600), { wash: H6.night, ink: null });
  paint(ellPts(540, 1450, 1100, 640, 26), { fill: H6.nightLo, fillOp: 200, bleed: .3, tex: .4, ink: null });
  glow(820, 800, 170, '#FFF4D2', .45); paint(ellPts(820, 800, 52, 52, 18), { wash: '#FFF4D2', ink: null });
  boilSeed(key + 'st'); for (let i = 0; i < 18; i++) paint(starPts(-100 + hash(i * 2.3) * 1300, 420 + hash(i * 6.7) * 900, 3 + 3 * hash(i * 3.3) * (.6 + .4 * Math.sin(t * 2 + i)), .4, 4), { wash: '#FFF6DA', ink: null });
  boilSeed(key + 'gr');
  paint([[-300, 1640], [260, 1600], [700, 1630], [1380, 1600], [1380, 2700], [-300, 2700]], { wash: H7.grass, fill: H7.grassDk, fillOp: 70, tex: .5, ink: H7.ink, sw: .9, curv: .5 });
  const NT = ['#2E5A52', '#1E4040', '#4E7E6E'];
  tree(40, 1650, 620, key + 't1', Math.sin(t * .8) * .2, NT); tree(1010, 1640, 520, key + 't2', Math.sin(t * .7 + 1) * .2, NT);
  hut(150, 1660, 330, key + 'hut');
  glow(150, 1590, 90, '#FFC870', .5 + .1 * Math.sin(t * 9));
  if (pond) h7Pond(830, 1800, 300, 80, t, key + 'pd');
}

// the crocodile: its jaw hinge at (x, y), s long, the snout pointing screen left (flip: right). o.open 0..1 opens the
// jaws, o.eyes 'normal' | 'swirl', o.key. Draw the water over its belly afterwards.
function h7Croc(x, y, s, o = {}) {
  const open = clamp(o.open ?? 0), d = o.flip ? -1 : 1, key = o.key || 'croc';
  const P = pts => pts.map(([a, b]) => [x + a * s * d, y + b * s]);
  const R = (pts, ang) => pts.map(([a, b]) => { const ca = Math.cos(ang), sa = Math.sin(ang); return [a * ca - b * sa, a * sa + b * ca]; });
  boilSeed(key);
  // the back and the tail
  paint(P([[-.02, .02], [.1, -.13], [.4, -.17], [.75, -.1], [1.05, -.02], [1.2, .04], [.6, .08], [0, .1]]), { wash: H7.croc, fill: H7.crocDk, fillOp: 60, tex: .5, ink: H7.ink, sw: 1.1, curv: .4 });
  for (let i = 0; i < 7; i++) { const a = .16 + i * .12, h = .05 * (1 - i * .09); paint(P([[a - .04, -.13 + i * .012], [a, -.13 + i * .012 - h], [a + .04, -.13 + i * .012]]), { wash: H7.crocDk, ink: H7.ink, sw: .6 }); }
  // the lower jaw
  const lo = R([[-.56, .03], [-.3, .005], [.02, -.01], [.06, .09], [-.3, .1], [-.53, .08]], open * .22);
  paint(P(lo), { wash: H7.belly, fill: '#C8C088', fillOp: 40, ink: H7.ink, sw: 1, curv: .25 });
  // the upper jaw and the head
  const up = R([[-.58, -.01], [-.55, -.07], [-.34, -.075], [-.14, -.1], [-.04, -.19], [.08, -.17], [.12, -.02], [-.3, 0]], -open * .55);
  paint(P(up), { wash: H7.croc, fill: H7.crocDk, fillOp: 45, tex: .4, ink: H7.ink, sw: 1.1, curv: .25 });
  // teeth along both jaws
  for (let i = 0; i < 6; i++) {
    const a = -.52 + i * .085;
    const [t1] = P(R([[a, 0]], -open * .55)), [t2] = P(R([[a + .03, .05 + .02 * open]], -open * .55)), [t3] = P(R([[a + .06, 0]], -open * .55));
    paint([t1, t2, t3], { wash: '#FFFFFF', ink: H7.ink, sw: .5 });
    const [b1] = P(R([[a + .03, .01]], open * .22)), [b2] = P(R([[a + .06, -.04 - .02 * open]], open * .22)), [b3] = P(R([[a + .09, .01]], open * .22));
    if (open > .15) paint([b1, b2, b3], { wash: '#FFFFFF', ink: H7.ink, sw: .5 });
  }
  // the eye, on its bump
  const [[ex, ey]] = P(R([[0, -.2]], -open * .55)), er = s * .055;
  paint(ellPts(ex, ey, er * 1.25, er * 1.15, 12), { wash: H7.crocLt, ink: H7.ink, sw: .9 });
  paint(ellPts(ex, ey, er * .85, er * .85, 12), { wash: '#FFFFFF', ink: H7.ink, sw: .6 });
  if (o.eyes === 'swirl') inkLine([[ex - er * .5, ey], [ex, ey - er * .5], [ex + er * .5, ey], [ex, ey + er * .4], [ex - er * .2, ey]], 1.2, H7.ink, 'inkfine', .8);
  else paint(ellPts(ex - er * .25 * d, ey, er * .4, er * .5, 8), { wash: H7.ink, ink: null });
}

// Bharat's bow (an armL hook, as heldBow in ramayan.js) with the arrow of Lanka 58: no head on it ("binu phar"), just
// a blunt, bound end. draw 0..1 pulls the string; arrow false once it has flown.
function h7Bow(draw = 0, arrow = true) {
  return (u, sw) => {
    const k = u / 1.7, pull = clamp(draw);
    push(); scale(1.7);
    inkLine(U([[.6, -4.5], [.6 + pull * 2.6, 0], [.6, 4.5]], k), sw * .45, '#F0E2C0', 'inkfine', 0);
    paint(ribbon(U([[.6, -4.6], [-.55, -2.8], [-.95, -.6], [-.95, .6], [-.55, 2.8], [.6, 4.6]], k), .24 * k, .24 * k), { wash: H7.wood, ink: NRD.ink, sw: sw * .5 });
    paint(U([[-1.15, -.6], [-.7, -.6], [-.7, .6], [-1.15, .6]], k), { wash: '#F2C230', ink: NRD.ink, sw: sw * .4 });
    if (arrow) {
      const ax = (.6 + pull * 2.6) * k;
      inkLine([[ax, 0], [-3.6 * k, 0]], sw * 1.1, H7.shaft, 'ink', 0);
      paint(ellPts(-3.75 * k, 0, .34 * k, .3 * k, 10), { wash: '#E8D6B0', ink: NRD.ink, sw: sw * .4 });
    }
    pop();
  };
}
// the tipless arrow in flight: its blunt end at (x, y), pointing along angle a, len px
function h7Blunt(x, y, a, len = 150, key = 'bl') {
  boilSeed(key);
  const ca = Math.cos(a), sa = Math.sin(a), tail = [x - ca * len, y - sa * len];
  inkLine([tail, [x, y]], 2.8, H7.shaft, 'ink', 0);
  paint(ellPts(x, y, len * .055, len * .05, 10), { wash: '#E8D6B0', ink: H7.ink, sw: .8 });
  for (const s of [-1, 1]) paint([[tail[0] + ca * 30, tail[1] + sa * 30], [tail[0] - sa * s * 12, tail[1] + ca * s * 12], [tail[0] - ca * 6 - sa * s * 12, tail[1] - sa * 6 + ca * s * 12], [tail[0], tail[1]]], { wash: '#E8D6B0', ink: H7.ink, sw: .5 });
}

// the false sage's halo: a ring of light that is a little too perfect (k pops it; tilt drops it sideways)
function h7Halo(x, y, r, t, k = 1, key = 'hl', tilt = 0) {
  if (k <= .02) return;
  boilSeed(key);
  glow(x, y, r * 2.2 * k, H7.halo, .45);
  push(); translate(x, y); rotate(tilt); scale(k);
  paint(ribbon(ellPts(0, 0, r, r * .3, 22).concat([[r, 0]]), r * .12, r * .12), { wash: H7.halo, ink: H7.goldDk, sw: .7 });
  paint(starPts(r * .8, -r * .3, r * (.22 + .08 * Math.sin(t * 9)), .3, 4), { wash: '#FFFFFF', ink: null });
  pop();
}
// two little horns through his hair: a hat hook for narada()'s rig (head space)
function h7Horns(u, sw) {
  boilSeed('h7horns');
  for (const s of [-1, 1]) paint(U([[s * 1.5, -22.6], [s * 2.5, -24.4], [s * 2.3, -22.3]], u), { wash: '#F4EBD8', fill: '#B8A888', fillOp: 50, ink: H7.ink, sw: sw * .5, curv: .3 });
}
// small flames along a base line (a burning city in a bubble)
function h7Flames(x, y, w, h, t, key = 'fl', n = 5) {
  boilSeed(key);
  glow(x, y - h * .5, w * .8, '#FF8A2A', .5);
  for (let i = 0; i < n; i++) {
    const fx = x - w / 2 + (i + .5) * w / n, fh = h * (.6 + .4 * Math.sin(t * 11 + i * 2.1)), fw = w / n * .6;
    paint([[fx - fw, y], [fx - fw * .6, y - fh * .5], [fx + Math.sin(t * 13 + i) * fw * .4, y - fh], [fx + fw * .6, y - fh * .5], [fx + fw, y]], { wash: '#FF8A2A', ink: null, curv: .6 });
    paint([[fx - fw * .5, y], [fx, y - fh * .55], [fx + fw * .5, y]], { wash: '#FFE08A', ink: null, curv: .6 });
  }
}
// Ram's sandals on a low gold seat (Bharat ruled in their name), the seat's foot centred at (x, y), s wide
function h7Paduka(x, y, s, key = 'pk') {
  boilSeed(key);
  glow(x, y - s * .5, s * 1.1, '#FFE08A', .4);
  for (const d of [-1, 1]) paint(rectPts(x + d * s * .36 - s * .05, y - s * .28, s * .1, s * .28), { wash: H7.goldDk, ink: H7.ink, sw: .7 });
  paint(rrPts(x - s * .5, y - s * .42, s, s * .18, s * .05), { wash: H7.seat, fill: H7.goldDk, fillOp: 50, tex: .3, ink: H7.ink, sw: 1 });
  paint(rrPts(x - s * .42, y - s * .5, s * .84, s * .1, s * .04), { wash: '#C8323A', ink: H7.ink, sw: .7 });
  for (const d of [-1, 1]) {
    const cx = x + d * s * .17, cy = y - s * .56;
    paint(ellPts(cx, cy, s * .12, s * .055, 12), { wash: '#A8703E', fill: '#7A4E26', fillOp: 50, ink: H7.ink, sw: .7 });
    inkLine([[cx - s * .05, cy], [cx - s * .05, cy - s * .09]], 2, '#7A4E26', 'ink', 0);
    paint(ellPts(cx - s * .05, cy - s * .1, s * .028, s * .028, 8), { wash: H7.gold, ink: H7.ink, sw: .5 });
  }
}

// ---------- the cast ----------
// Kalanemi (Lanka 56–58): the asura rig in a murky violet, crowned (a noble of Lanka)
function kalanemi(x, y, u, o = {}) { return asura(x, y, u, { kind: 'nishumbha', ...o, pal: { skin: '#7A6AA8', skinDk: '#55487E', skinLt: '#A496CC', dhoti: '#3E5A3A', dhotiDk: '#284026', ...(o.pal || {}) } }); }
// the apsara freed from the crocodile's body: Parvati's rig in moonlight colours, glowing
const APS_PAL = { saree: '#BFE6F2', sareeDk: '#86BCD2', sareeLt: '#F0FCFF', blouse: '#F2A6C8', blouseDk: '#C87AA0', bangle: '#F5C542', skin: '#FBD9C2', skinDk: '#E2AE92', skinLt: '#FFF0E2', lip: '#D2607A' };
function apsara(x, y, u, o = {}) { return parvati(x, y, u, { col: APS_PAL.skin, dk: APS_PAL.skinDk, lt: APS_PAL.skinLt, noShadow: true, ...o, pal: { ...APS_PAL, ...(o.pal || {}) } }); }
// Sushena, the physician who lived in Lanka (55.4): an old man on Valmiki's rig, in a healer's teal shawl
function vaidya(x, y, u, o = {}) { return rishi(x, y, u, 1, { ...o, pal: { shawl: '#5EA89A', shawlDk: '#3E7E72', dhoti: '#F4EEDC', dhotiDk: '#CFC6AC', dhotiLt: '#FFFFFF', border: '#3E7E72', ...(o.pal || {}) } }); }
