// po_dashavatar.js: the Dashavatar book's Vamana cast in the Pothi style (needs pothi.js; POTHI_GUIDE.md). Every figure
// is drawn side on, facing +x, its feet on y = 0 (flip it with scale(-1, 1) to face left); an adult stands about 810 units
// to the top of the head (head ≈ 104 tall at s 1, waist at y -470, shoulders -655). Light comes from the top left.
//   pdHead(c, o): a profile head about (0, 0). o.face 'man' | 'boy', o.eye 'open' | 'low' | 'wide' | 'narrow',
//     o.mouth 'calm' | 'smile' | 'open', o.brow (-1 frown .. 1 raised), o.hair 'kirita' | 'crown' | 'jata' | 'tuft',
//     o.beard 'bali' | 'sage', o.tilak 'u' | 'tri', o.sk the skin palette
//   pdVamana(c, o): the boy brahmachari with his umbrella (chhatra) and water pot (kamandalu), deerskin, munja belt
//   pdBali(c, o): the asura king; o.pose 'give' (holding out the gold water pot) | 'kneel' (bowed, hands joined)
//   pdShukra(c, o): Shukracharya, the old guru; o.pose 'wary' (staff, a hand at his beard) | 'shock' (hands on his head)
//   pdTrivikrama(c, o): Vishnu grown to fill the sky, four arms (chakra, shankha, gada, the open hand), one leg raised
//   pdKund(c, o): the brick yagna altar and its fire;  pdToran(c, x0, x1, y, sag): mango leaves on a string
const PD = {
  vishnu: PO.skin,
  bali: { base: '#A0623E', lt: '#C2845C', dk: '#6E3E24', far: '#82502F' },
  shukra: { base: '#BE8C6A', lt: '#DAAC8A', dk: '#8C6046', far: '#A2744F' },
  plum: { base: '#5C3654', lt: '#7E5674', dk: '#3A1E34' },
  saffron: { base: '#C4743C', lt: '#DE965E', dk: '#8C4C22' },
  white: { base: '#E8E2D6', lt: '#FBF8F0', dk: '#ADA59A' },
  cotton: { base: '#E9E0CC', lt: '#F9F3E6', dk: '#B6AA92' },
  deer: { base: '#B08A5A', lt: '#CCA878', dk: '#7E5E38' },
  wood: { base: '#7A5638', lt: '#9C7650', dk: '#4E3420' },
  brick: { base: '#A65A40', lt: '#C4785C', dk: '#6E3426' },
  munja: { base: '#C8B07A', lt: '#E4D2A0', dk: '#8E7A48' },
};
const pdK = c => { const k = c.getTransform(); return Math.hypot(k.a, k.b) || 1; };
// a soft fold inside the current clip, its blur scaled with the drawing
function pdFold(c, P, w, col, blur = 4) { c.save(); c.filter = `blur(${Math.max(.5, blur * pdK(c))}px)`; poLine(c, P, col, w); c.restore(); }
// shading for a part about w units across: dark along the lower right, light along the upper left
const pdL = (pal, w = 40, o = {}) => ({ sh: [w * .14, w * .1, w * .16, rgba(pal.dk, o.sa ?? .85)], hi: [-w * .1, -w * .08, w * .12, rgba(pal.lt, o.ha ?? .7)], ...o });
function pdGem(c, x, y, r, col = PO.red) {
  ellipse(c, x, y, r + 2.2, r + 2.2, PO.gold.dk); ellipse(c, x, y, r + 1.1, r + 1.1, PO.gold.base);
  ellipse(c, x, y, r, r, col); ellipse(c, x - r * .3, y - r * .35, r * .35, r * .25, 'rgba(255,255,255,.7)');
}
function pdLimb(c, C, Wd, pal, o = {}) { return poFill(c, poLimb(C, Wd), o.col || pal.base, pdL(pal, Math.max(...Wd), o)); }
// a foot side on, toes toward +x: the ankle at (x, y), the sole 28 below it; alta along the sole
function pdFoot(c, x, y, pal, o = {}) {
  const s = o.s || 1, col = o.col || pal.base;
  c.save(); c.translate(x, y); c.rotate(o.a || 0); c.scale(s, s);
  poFill(c, [[-12, -12], [11, -12], [18, 3], [36, 10], [54, 16], [62, 22], [58, 28, 1], [-14, 28, 1], [-22, 18], [-20, 0]], col,
    { ...pdL(pal, 30), inside: () => { if (o.alta !== false) poLine(c, [[-16, 27], [58, 27]], 'rgba(176,40,48,.8)', 4); } });
  if (o.anklet !== false) poBorder(c, [[-16, -2], [0, 2], [16, 0]], 5);
  c.restore();
}
// a hand, the wrist at (x, y), pointing along a: 'grip' (a fist round something across it), 'open' (flat, fingers
// together), 'up' (palm up, cupped), 'join' (two palms together, seen side on)
function pdHand(c, x, y, a, pal, kind = 'open', o = {}) {
  const s = o.s || 1, col = o.col || pal.base;
  c.save(); c.translate(x, y); c.rotate(a); c.scale(s, o.flipY ? -s : s);
  if (kind === 'grip') {
    poFill(c, [[-4, -15], [16, -18], [32, -14], [38, -2], [36, 10], [24, 17], [6, 17], [-4, 14]], col, { ...pdL(pal, 30),
      inside: () => { for (const xx of [16, 24, 31]) poLine(c, [[xx, 4], [xx + 2, 16]], rgba(pal.dk, .5), 1.2); } });
    poFill(c, [[14, -16], [30, -20], [36, -12], [24, -8]], col, pdL(pal, 12));   // the thumb over the fingers
  } else if (kind === 'up') {
    poFill(c, [[-4, -12], [20, -12], [44, -10], [62, -14], [68, -10], [60, -2], [40, 6], [16, 12], [-4, 12]], col, { ...pdL(pal, 24),
      inside: () => poLine(c, [[20, -10], [56, -12]], rgba(pal.dk, .4), 1.2) });
  } else if (kind === 'join') {
    poFill(c, [[-6, -14], [18, -16], [42, -14], [64, -8], [72, -2, 1], [62, 4], [40, 10], [18, 14], [-6, 13]], col, { ...pdL(pal, 26),
      inside: () => { poLine(c, [[0, 0], [68, -2]], rgba(pal.dk, .55), 1.4); for (const yy of [-9, -4]) poLine(c, [[34, yy], [66, yy + 3]], rgba(pal.dk, .35), 1); } });
  } else {
    poFill(c, [[-4, -12], [20, -15], [44, -14], [66, -11], [74, -6, 1], [66, -1], [44, 2], [30, 6], [40, 12], [42, 17], [30, 18], [12, 13], [-4, 12]], col,
      { ...pdL(pal, 26), inside: () => { for (const yy of [-9, -4]) poLine(c, [[30, yy], [68, yy + 1]], rgba(pal.dk, .45), 1.2); } });
  }
  if (o.bangle !== false) poBorder(c, [[-2, -13], [0, 0], [-2, 13]], 6);
  c.restore();
}

// ---------- the head ----------
const PD_FACE = {
  man: [[22, -50], [32, -34], [38, -18], [37, -10], [44, 3], [50, 12, 1], [44, 16], [45, 19.5], [42, 22.5, 1], [44.5, 26], [39.5, 30.5], [41.5, 37], [35, 45], [18, 48], [-4, 42], [-18, 28], [-40, 6], [-44, -20], [-34, -46], [-6, -56]],
  woman: [[22, -50], [32, -34], [37, -18], [36, -10], [42, 2], [46.5, 10.5, 1], [41.5, 14.5], [43, 18.5], [40.5, 21.5, 1], [43, 25], [38.5, 29.5], [39.5, 35], [33, 43], [17, 46], [-4, 41], [-18, 28], [-40, 6], [-44, -20], [-34, -46], [-6, -56]],
  boy: [[24, -50], [35, -34], [40, -18], [39, -8], [44, 1], [47, 7, 1], [42, 11], [43.5, 15.5], [40.5, 18.5, 1], [42.5, 22], [37.5, 27], [38, 32], [31, 40], [16, 44], [-4, 40], [-22, 28], [-46, 6], [-52, -22], [-42, -50], [-10, -62]],
};
PD_FACE.girl = PD_FACE.boy;
function pdHead(c, o = {}) {
  const sk = o.sk || PO.skin, G = PO.gold, boy = o.face === 'boy' || o.face === 'girl', ink = 'rgba(28,22,30,.9)';
  const hairBack = o.hair === 'jata' ? PD.white.base : PO.hair;
  // hair falling behind the shoulders (drawn first, under the head)
  if (o.hair === 'crown' || o.hair === 'kirita') poFill(c, [[-20, -40], [-46, -20], [-54, 20], [-50, 64], [-34, 78], [-22, 50], [-14, 20]], PO.hair, { hi: [-3, -3, 4, 'rgba(110,100,110,.35)'] });
  if (o.hair === 'jata') poFill(c, [[-20, -44], [-48, -20], [-58, 24], [-56, 74], [-40, 92], [-28, 60], [-16, 20]], PD.white.base, { sh: [6, 6, 8, rgba(PD.white.dk, .8)] });
  if (typeof pdHairBack === 'function') pdHairBack(c, o);
  // the face
  const F = PD_FACE[o.face] || PD_FACE.man, fem = o.face === 'woman' || o.face === 'girl';
  poFill(c, F, sk.base, { sh: [[-14, 6, 14, rgba(sk.dk, .65)], [0, 10, 6, rgba(sk.dk, .35)]], hi: [6, -4, 6, rgba(sk.lt, .7)] });
  if (boy || o.blush) ellipse(c, 24, 18, 10, 7, 'rgba(206,110,120,.22)');                                   // a child's cheek
  // the ear and a kundala
  poFill(c, [[-12, -12], [-4, -6], [-4, 8], [-10, 14], [-18, 6], [-18, -6]], sk.base, { sh: [-3, 3, 3, rgba(sk.dk, .7)] });
  if (fem) { poFill(c, [[-14, 12], [-2, 12], [2, 26], [-8, 40], [-20, 26]], PO.gold.base, { sh: [3, 2, 3, rgba(PO.gold.dk, .8)], hi: [-2, -2, 2, rgba(PO.gold.lt, .8)] }); poDots(c, [[-18, 38], [-8, 44], [2, 38]], 2, 4.4, '#F2EEE2', false); }
  else if (o.hair === 'pagri' || o.hair === 'bald' || o.hair === 'veil') { }
  else if (o.hair !== 'jata') { poFill(c, [[-12, 14], [-3, 18], [0, 28], [-6, 38], [-15, 36], [-11, 28], [-16, 22]], G.base, { sh: [3, 2, 3, rgba(G.dk, .8)], hi: [-2, -2, 2, rgba(G.lt, .8)] }); ellipse(c, -6, 28, 2.4, 2.4, PO.red); }
  else { for (let i = 0; i < 3; i++) ellipse(c, -9, 18 + i * 7, 3.2, 3.2, '#5A2E24'); }        // a rudraksha in his ear
  // the eye
  const e = o.eye || 'open', bx = boy ? 1.12 : 1, ex = boy ? 2 : 0;
  c.save(); c.translate(25 + ex, -7); c.scale(bx, bx); c.translate(-25, 7);
  if (e === 'low') {
    poLine(c, [[35, -6.5], [27, -3.8], [19, -4.4], [13, -7.5]], ink, 1.8);
  } else {
    const h = e === 'wide' ? 1.5 : e === 'narrow' ? .55 : 1;
    const top = -6.8 - 2.8 * h, bot = -6.8 + 2.5 * h;
    const eye = poPath([[35, -6.8], [29, top], [21, top], [16, -6.8], [21, bot], [29, bot]]);
    c.save(); c.fillStyle = '#F1E8D8'; c.fill(eye); c.clip(eye); ellipse(c, 28.5, -6.8 + (e === 'narrow' ? 1 : 0), e === 'wide' ? 3.3 : 2.7, e === 'wide' ? 3.3 : 2.7, '#221A1E'); c.restore();
    poLine(c, [[36, -6.8], [29, top - .9], [21, top - .9], [14, -6.6]], ink, 2);
    if (e === 'wide') poLine(c, [[33, bot + .8], [25, bot + 1.4], [18, bot]], 'rgba(28,22,30,.35)', 1);
  }
  // the brow: raised (surprise) or drawn down at the front (a frown)
  const br = o.brow || 0, bu = Math.max(0, br) * 5, bd = Math.max(0, -br) * 4;
  poLine(c, [[37.5, -17 - bu + bd], [29, -19.6 - bu], [19, -19 - bu * .8], [11, -16.4 - bu * .5]], o.hair === 'jata' ? 'rgba(220,214,204,.95)' : 'rgba(28,22,30,.6)', o.hair === 'jata' ? 3 : 1.7);
  if (o.age) for (const yy of [-28, -33]) poLine(c, [[34, yy], [26, yy - 1.5], [18, yy - 1]], rgba(sk.dk, .45), 1);
  c.restore();
  // the mouth
  const m = o.mouth || 'calm';
  if (m === 'open') { poFill(c, [[44, 20], [39, 19], [36, 24], [38, 30], [43, 30], [45, 25]], '#4A2430'); }
  else {
    c.save(); if (boy) c.translate(-2.6, -3.4);
    poFill(c, [[45, 19.5], [41, 18.8], [38.5, 21.8], [42.2, 22.4]], boy ? '#8E5466' : '#6E4A5E');
    poFill(c, [[42.2, 22.6], [38.5, 22], [40, 26], [44.4, 25.6]], boy ? '#9E6274' : '#7E5468');
    if (m === 'smile') poLine(c, [[39, 22.4], [35.5, 20.6]], 'rgba(60,30,40,.6)', 1.2);
    c.restore();
  }
  // beards
  if (o.beard === 'bali') {
    poFill(c, [[-4, -2], [6, 16], [22, 30], [34, 34], [40, 42], [34, 52], [18, 56], [-2, 48], [-16, 32], [-16, 8]], PO.hair, { hi: [3, -3, 4, 'rgba(120,100,100,.35)'] });
    poFill(c, [[44, 16.5], [36, 17.5], [26, 20], [16, 19], [10, 12], [15, 11], [22, 15], [33, 14]], PO.hair);
  } else if (o.beard === 'sage') {
    const W = PD.white;
    poFill(c, [[-6, -6], [6, 10], [22, 16], [34, 20], [40, 28], [42, 44], [38, 70], [30, 100], [20, 124, 1], [6, 98], [-8, 70], [-16, 40], [-18, 10]], W.base,
      { sh: [6, 8, 8, rgba(W.dk, .8)], hi: [-4, -4, 6, rgba(W.lt, .9)], inside: () => { for (const xx of [4, 14, 24, 32]) pdFold(c, [[xx, 30], [xx - 2, 70], [xx - 6, 110]], 2, rgba(W.dk, .6), 1.5); } });
    if (m === 'open') poFill(c, [[43, 22], [38, 21], [35, 27], [38, 34], [43, 33]], '#4A2430');
    poFill(c, [[46, 16], [38, 16.5], [28, 19], [18, 26], [12, 34], [22, 30], [32, 25], [42, 22]], W.base, { sh: [0, 3, 3, rgba(W.dk, .7)] });
  }
  // tilak
  if (o.tilak === 'u') { poLine(c, [[35, -24], [31, -40]], 'rgba(246,238,220,.9)', boy ? 3 : 2.6); poLine(c, [[34.2, -25], [30.8, -38]], PO.red, 1.1); }
  if (o.tilak === 'tri') for (const yy of [-27, -32, -37]) poLine(c, [[36.5, yy + 1], [30, yy], [22, yy - 1]], 'rgba(246,240,226,.95)', 2.2);
  // the hair or headdress
  if (o.hair === 'tuft') {
    poFill(c, [[30, -42], [14, -58], [-14, -64], [-42, -52], [-54, -24], [-50, 6], [-38, 14], [-30, -4], [-18, -20], [0, -32], [22, -36]], PO.hair, { hi: [0, -4, 5, 'rgba(110,100,110,.4)'] });
    ellipse(c, -30, -66, 12, 10, PO.hair); ellipse(c, -33, -69, 5, 4, 'rgba(110,100,110,.45)');   // the shikha, knotted
    poBorder(c, [[-40, -60], [-30, -56], [-20, -58]], 3);
  } else if (o.hair === 'jata') {
    const W = PD.white;
    poFill(c, [[28, -42], [10, -56], [-24, -56], [-44, -36], [-50, -6], [-42, 16], [-30, 8], [-22, -16], [-4, -32], [18, -36]], W.base, { sh: [4, 6, 6, rgba(W.dk, .7)], hi: [-2, -4, 4, rgba(W.lt, .9)],
      inside: () => { for (const k of [0, 1, 2]) pdFold(c, [[16 - k * 14, -40], [-10 - k * 12, -46], [-36 - k * 4, -20]], 1.6, rgba(W.dk, .5), 1); } });
    // the coiled jata on top, tied with rudraksha
    poFill(c, [[18, -50], [14, -70], [-2, -86], [-24, -88], [-40, -76], [-42, -56], [-30, -46]], W.base, { sh: [6, 4, 6, rgba(W.dk, .8)], hi: [-3, -4, 4, rgba(W.lt, .95)],
      inside: () => { for (const yy of [-56, -66, -76]) pdFold(c, [[12, yy + 4], [-12, yy - 4], [-38, yy + 2]], 1.8, rgba(W.dk, .55), 1); } });
    for (const [x, y] of poAlong([[12, -54], [-12, -58], [-38, -52]], 6)) ellipse(c, x, y, 2.6, 2.6, '#5A2E24');
  } else if (o.hair === 'kirita') pdKirita(c);
  else if (o.hair === 'crown') pdCrown(c);
  if (typeof pdHairFront === 'function') pdHairFront(c, o);
}
// Vishnu's kirita: a tall gold crown, lotus-petal points, a tier, a finial; a spiked fan at the back
function pdKirita(c) {
  const G = PO.gold;
  poFill(c, [[28, -40], [10, -54], [-24, -54], [-44, -34], [-48, -4], [-40, 16], [-30, 8], [-22, -16], [-6, -30], [16, -34]], PO.hair);
  c.save(); c.translate(-48, -34); c.rotate(-.15);
  for (let k = 0; k < 9; k++) { const a = -1.9 + k * .2; poLine(c, [[0, 0], [Math.cos(a) * 30, Math.sin(a) * 30]], G.base, 3); }
  c.restore();
  poFill(c, [[36, -32, 1], [33, -52, 1], [26, -96], [12, -118], [-12, -124], [-32, -112], [-44, -84], [-46, -38, 1], [-44, -24, 1]], G.base, { sh: [-10, 0, 10, rgba(G.dk, .8)], hi: [8, -4, 8, rgba(G.lt, .8)],
    inside: () => { for (const yy of [-70, -92]) poBorder(c, [[30, yy + 8], [-8, yy], [-44, yy + 6]], 4); } });
  [[30, -50], [12, -54], [-8, -54], [-28, -50], [-42, -44]].forEach(([px, py], k) => {
    const h = 34 - Math.abs(k - 1.5) * 4, P = [[px - 9, py + 4], [px - 7, py - h * .5], [px, py - h, 1], [px + 7, py - h * .5], [px + 9, py + 4]];
    poFill(c, P, G.base, { sh: [-4, 0, 4, rgba(G.dk, .7)], hi: [3, -3, 3, rgba(G.lt, .8)] });
    poLine(c, [[px - 5, py], [px - 4, py - h * .45], [px, py - h * .8], [px + 4, py - h * .45], [px + 5, py]], rgba(G.dk, .6), 1.2);
  });
  poFill(c, [[-1, -122], [8, -132], [0, -152, 1], [-10, -132]], G.base, { sh: [-3, 0, 3, rgba(G.dk, .8)] });
  ellipse(c, -1, -128, 3, 3, PO.red);
  poBorder(c, [[34, -34], [-6, -40], [-44, -30]], 7);
  pdGem(c, 10, -44, 3.6);
  pdGem(c, -8, -96, 3.2, '#2E6A5A');
}
// Bali's crown: broader and lower than Vishnu's, three great points, rubies and an emerald
function pdCrown(c) {
  const G = PO.gold;
  poFill(c, [[28, -40], [10, -54], [-24, -54], [-44, -34], [-48, -4], [-40, 16], [-30, 8], [-22, -16], [-6, -30], [16, -34]], PO.hair);
  poFill(c, [[38, -32, 1], [38, -56], [30, -70], [-40, -70], [-48, -54], [-48, -30, 1]], G.base, { sh: [-8, 0, 8, rgba(G.dk, .8)], hi: [6, -4, 6, rgba(G.lt, .8)] });
  [[30, -66, 30], [4, -68, 46], [-26, -66, 34]].forEach(([px, py, h]) => {
    const P = [[px - 14, py + 4], [px - 10, py - h * .5], [px, py - h, 1], [px + 10, py - h * .5], [px + 14, py + 4]];
    poFill(c, P, G.base, { sh: [-5, 0, 5, rgba(G.dk, .75)], hi: [4, -3, 4, rgba(G.lt, .8)] });
    pdGem(c, px, py - h * .35, 3.2, h > 40 ? '#2E6A5A' : PO.red);
  });
  poBorder(c, [[38, -34], [-4, -40], [-48, -32]], 7);
  poBorder(c, [[36, -60], [-4, -66], [-46, -60]], 4);
  pdGem(c, 14, -48, 4);
  pdGem(c, -18, -48, 3.4);
}

// ---------- Vamana: the boy brahmachari ----------
// about 560 tall (the umbrella to ~-960); feet at 0, facing +x. o.look: head tilt; o.step: 0..1 a walking stride
function pdVamana(c, o = {}) {
  const sk = PO.skin, Ct = PD.cotton, Dr = PD.deer, Wd = PD.wood, G = PO.gold, st = o.step ?? .6;
  // the umbrella's staff, held by the far hand in front of his chest, leaning back over his shoulder
  const top = [-30, -900];
  poLine(c, [[86, -300], top], Wd.dk, 12); poLine(c, [[86, -300], top], Wd.base, 8); poLine(c, [[84, -304], [top[0] + 2, top[1]]], rgba(Wd.lt, .7), 2);
  pdChhatra(c, top[0], top[1], -.1);
  // the far leg, a step behind
  pdLimb(c, [[-12, -230], [-24 - 18 * st, -120], [-34 - 30 * st, -26]], [50, 40, 30], sk, { col: sk.far });
  pdFoot(c, -34 - 30 * st, -26, sk, { col: sk.far, a: .12 * st, s: .9 });
  // the far arm, bent, the hand round the staff in front of his chest
  pdLimb(c, [[-6, -400], [22, -330], [70, -330]], [36, 30, 26], sk, { col: sk.far });
  // the deerskin down his back, its spots and ragged hem
  const ds = [[-30, -424], [-6, -432], [6, -410], [-14, -360], [-34, -300], [-46, -236], [-54, -222], [-62, -232], [-72, -216], [-80, -230], [-78, -290], [-64, -370]];
  poFill(c, ds, Dr.base, { ...pdL(Dr, 50), inside: () => { const R = lcg(4); for (let i = 0; i < 16; i++) ellipse(c, -74 + R() * 70, -420 + R() * 190, 3 + R() * 3, 2 + R() * 3, rgba(Dr.dk, .6)); } });
  // the near leg, forward
  pdLimb(c, [[12, -230], [20 + 12 * st, -120], [26 + 22 * st, -26]], [54, 42, 32], sk);
  pdFoot(c, 26 + 22 * st, -26, sk, { a: -.06 * st, s: .9 });
  // the dhoti: cream cotton wrapped to above the knee, its pleats tucked in front; the munja belt
  const dh = [[-44, -306], [44, -308], [54, -276], [62, -222], [60, -196, 1], [34, -200], [12, -214], [-12, -206], [-40, -196], [-56, -200, 1], [-58, -250], [-52, -286]];
  poFill(c, dh, Ct.base, { ...pdL(Ct, 70), inside: () => { for (const [a, b] of [[[-30, -300], [-40, -202]], [[-6, -300], [-8, -210]], [[18, -300], [28, -208]]]) pdFold(c, [a, b], 3, rgba(Ct.dk, .55), 3); } });
  poFill(c, [[30, -306], [46, -306], [52, -260], [58, -200, 1], [42, -202, 1], [38, -260]], Ct.base, { ...pdL(Ct, 20, { sa: .5 }), inside: () => { for (const x of [36, 44, 50]) pdFold(c, [[x, -300], [x + 6, -206]], 1.6, rgba(Ct.dk, .6), 1.5); } });
  poBorder(c, [[60, -196], [34, -200], [12, -214], [-12, -206], [-40, -196], [-56, -200]], 4, PO.maroon);
  // the torso: a child's, a round little belly
  poFill(c, [[-38, -300], [44, -302], [56, -324], [58, -352], [50, -384], [40, -412], [20, -430], [-6, -436], [-30, -428], [-42, -404], [-46, -360], [-42, -322]], sk.base, { ...pdL(sk, 90),
    inside: () => { pdFold(c, [[54, -330], [40, -304]], 6, rgba(sk.dk, .4), 5); ellipse(c, 50, -326, 2.2, 3, rgba(sk.dk, .7)); } });
  poLine(c, [[-48, -300], [0, -308], [50, -304]], PD.munja.dk, 9); poLine(c, [[-48, -301], [0, -309], [50, -305]], PD.munja.base, 6);
  for (const [x, y] of poAlong([[-48, -301], [0, -309], [50, -305]], 8)) poLine(c, [[x - 2, y - 3], [x + 2, y + 3]], rgba(PD.munja.dk, .8), 1.4);
  // the sacred thread, from the far shoulder across his chest to his near hip
  poLine(c, [[34, -420], [14, -380], [-10, -340], [-28, -306]], 'rgba(246,240,224,.9)', 2.4);
  // the deerskin's fold over his near shoulder
  poFill(c, [[-34, -428], [-8, -440], [18, -428], [20, -408], [-6, -402], [-30, -396]], Dr.base, { ...pdL(Dr, 30), inside: () => { ellipse(c, -6, -422, 3, 2.4, rgba(Dr.dk, .6)); ellipse(c, 8, -414, 2.4, 2, rgba(Dr.dk, .6)); } });
  // the near arm swinging back a little, the kamandalu hanging from his hand by its handle
  pdKamandalu(c, -40, -226, .62);
  pdLimb(c, [[-6, -414], [-18, -356], [-36, -304]], [38, 32, 28], sk);
  pdHand(c, -36, -304, 1.75, sk, 'grip', { s: .85 });
  // the far hand on the staff, in front
  pdHand(c, 68, -330, -.25, sk, 'grip', { s: .9, col: sk.far });
  // the neck and the head, large, tilted a little up to the king
  poFill(c, [[-14, -430], [16, -432], [18, -456], [-10, -460]], sk.base, { sh: [6, 4, 6, rgba(sk.dk, .7)] });
  c.save(); c.translate(6, -510); c.rotate(o.look ?? -.08); c.scale(1.36, 1.36);
  pdHead(c, { face: 'boy', sk, hair: 'tuft', tilak: 'u', eye: 'open', mouth: o.mouth || 'smile' });
  c.restore();
}
// the chhatra: a palm-leaf parasol, seen a little from below; (x, y) the top of the staff
function pdChhatra(c, x, y, a = 0) {
  const P = PD.munja, R = 150;
  c.save(); c.translate(x, y); c.rotate(a);
  poFill(c, [[-R, 34], [-R * .8, 4], [-R * .4, -18], [0, -26], [R * .4, -18], [R * .8, 4], [R, 34], [R * .6, 26], [R * .2, 30], [-R * .2, 30], [-R * .6, 26]], P.base,
    { sh: [0, 10, 12, rgba(P.dk, .8)], hi: [0, -8, 10, rgba(P.lt, .9)], inside: () => { for (let k = -4; k <= 4; k++) pdFold(c, [[0, -22], [k * R * .24, 30]], 2.4, rgba(P.dk, .6), 1.5); } });
  poBorder(c, [[-R, 34], [-R * .6, 26], [-R * .2, 30], [R * .2, 30], [R * .6, 26], [R, 34]], 6, PO.maroon);
  for (let k = -5; k <= 5; k++) { const tx = k * R * .19, ty = 32 + Math.abs(k) * .4; poLine(c, [[tx, ty], [tx, ty + 14]], PO.maroon.base, 2); ellipse(c, tx, ty + 16, 3, 3, PO.gold.base); }
  poFill(c, [[-6, -24], [-4, -40], [0, -50, 1], [4, -40], [6, -24]], PO.gold.base, { sh: [-2, 0, 2, rgba(PO.gold.dk, .8)] });
  c.restore();
}
// the kamandalu: a dark round water pot with a spout and an arched handle; (x, y) its centre
function pdKamandalu(c, x, y, s = 1) {
  const K = { base: '#6A4632', lt: '#8E6A50', dk: '#3E2618' };
  c.save(); c.translate(x, y); c.scale(s, s);
  poLine(c, [[-26, -40], [-20, -86], [0, -98], [20, -86], [26, -40]], K.dk, 6);                 // the handle
  poFill(c, poLimb([[30, -6], [52, -24], [66, -50]], [16, 12, 9]), K.base, pdL(K, 16));           // the spout
  poFill(c, [[-38, -36], [38, -36], [48, -4], [40, 28], [16, 42], [-16, 42], [-40, 28], [-48, -4]], K.base, { ...pdL(K, 80), inside: () => poBorder(c, [[-42, -18], [0, -12], [42, -18]], 4) });
  poFill(c, [[-22, -50], [22, -50], [26, -36], [-26, -36]], K.base, pdL(K, 20));
  c.restore();
}

// ---------- Bali ----------
const PD_TORSO = [[-56, -470], [54, -470], [60, -520], [68, -572], [74, -612], [66, -650], [40, -682], [16, -696], [-22, -698], [-50, -676], [-64, -630], [-66, -560], [-62, -510]];
function pdBaliUpper(c, o) {
  const sk = PD.bali, M = PO.maroon, G = PO.gold;
  // the torso, the shawl band over his shoulders, jewels
  poFill(c, PD_TORSO, sk.base, { ...pdL(sk, 120),
    inside: () => { pdFold(c, [[70, -600], [48, -576], [14, -578]], 6, rgba(sk.dk, .45), 6); pdFold(c, [[60, -520], [50, -490]], 5, rgba(sk.dk, .35), 5); ellipse(c, 56, -508, 2.4, 3.4, rgba(sk.dk, .7)); } });
  poFill(c, [[-58, -676], [-24, -706], [20, -702], [48, -680], [30, -664], [-6, -676], [-40, -660]], M.base, pdL(M, 30));
  poDots(c, [[36, -686], [52, -660], [62, -632]], 3.2, 8);
  poDots(c, [[30, -686], [46, -640], [58, -590], [62, -560]], 2.6, 7);
  pdGem(c, 62, -556, 5);
  // the neck and the head
  poFill(c, [[-20, -690], [22, -690], [26, -722], [-12, -728]], sk.base, { sh: [6, 4, 6, rgba(sk.dk, .7)] });
  c.save(); c.translate(8, -752); c.rotate(o.tilt || 0); c.scale(1.12, 1.12);
  pdHead(c, { sk, hair: 'crown', beard: 'bali', eye: o.eye || 'open', mouth: o.mouth || 'smile', brow: o.brow || 0 });
  c.restore();
}
function pdBali(c, o = {}) {
  const sk = PD.bali, P = PD.plum, M = PO.maroon, G = PO.gold;
  if (o.pose === 'kneel') return pdBaliKneel(c, o);
  // the shawl's end down his back
  pdLimb(c, [[-56, -672], [-72, -600], [-80, -500], [-84, -400], [-80, -320]], [30, 38, 42, 40, 30], M);
  // the far arm (behind): elbow hidden, the forearm out, palm up under the pot
  pdLimb(c, [[-4, -650], [26, -540], [118, -496]], [52, 44, 34], sk, { col: sk.far });
  pdHand(c, 120, -490, -.05, sk, 'up', { col: sk.far });
  // the legs below the dhoti, the far one a step behind
  pdLimb(c, [[-30, -210], [-28, -110], [-26, -28]], [50, 42, 30], sk, { col: sk.far }); pdFoot(c, -26, -28, sk, { col: sk.far });
  pdLimb(c, [[16, -210], [18, -110], [22, -28]], [54, 44, 32], sk); pdFoot(c, 22, -28, sk);
  // the dhoti: plum silk to the shin, a pleated fall at the front, gold borders
  const dh = [[-58, -472], [56, -474], [64, -420], [66, -330], [74, -250], [82, -180, 1], [40, -188], [0, -184], [-40, -194], [-72, -198, 1], [-74, -280], [-80, -380], [-74, -440]];
  poFill(c, dh, P.base, { ...pdL(P, 140), inside: () => {
    for (const [a, b] of [[[-40, -440], [-50, -200]], [[-10, -430], [-14, -190]], [[20, -420], [24, -190]]]) pdFold(c, [a, b], 5, rgba(P.dk, .6), 5);
    for (const [x, y] of [[-30, -400], [0, -330], [-40, -280], [10, -250], [-20, -220], [30, -380]]) ellipse(c, x, y, 3, 4, G.base);
  } });
  poBorder(c, [[82, -180], [40, -188], [0, -184], [-40, -194], [-72, -198]], 7);
  const fall = [[34, -470], [60, -470], [66, -400], [72, -300], [80, -180, 1], [54, -186, 1], [48, -300], [40, -400]];
  poFill(c, fall, P.base, { ...pdL(P, 30, { sa: .6 }), inside: () => { for (const x of [44, 56, 66]) pdFold(c, [[x, -460], [x + 6, -320], [x + 10, -186]], 2.2, rgba(P.dk, .6), 2); } });
  poBorder(c, [[60, -470], [68, -380], [74, -280], [80, -184]], 6);
  // the waist sash and its knot
  poFill(c, [[-60, -496], [56, -500], [58, -466], [-58, -462]], M.base, pdL(M, 30));
  poBorder(c, [[-60, -466], [0, -464], [58, -468]], 4);
  pdBaliUpper(c, o);
  // the near arm: down to the elbow, then forward, the fist round the pot's neck
  pdLimb(c, [[8, -656], [36, -580], [52, -524]], [60, 52, 44], sk);
  poBorder(c, [[20, -604], [36, -600], [50, -604]], 8);
  pdLimb(c, [[52, -524], [100, -546], [150, -566]], [44, 38, 30], sk);
  pdJhari(c, 172, -530);
  pdHand(c, 146, -574, -.2, sk, 'grip');
}
// a lota: a round gold water pot with a short neck and a flared lip, for pouring water over a gift; (x, y) its body's centre
function pdJhari(c, x, y) {
  const G = PO.gold;
  c.save(); c.translate(x, y);
  poFill(c, [[-14, -34], [-12, -48], [-24, -60, 1], [24, -60, 1], [12, -48], [14, -34]], G.base, pdL(G, 24));
  poFill(c, [[-30, -30], [-12, -38], [12, -38], [30, -30], [42, -6], [40, 16], [26, 34], [0, 40], [-26, 34], [-40, 16], [-42, -6]], G.base, { ...pdL(G, 80), inside: () => { poBorder(c, [[-40, -10], [0, -4], [40, -10]], 3); poDots(c, [[-28, 10], [0, 18], [28, 10]], 2, 9, G.lt, false); } });
  poBorder(c, [[-24, -60], [0, -62], [24, -60]], 5);
  c.restore();
}
function pdBaliKneel(c, o) {
  const sk = PD.bali, P = PD.plum, M = PO.maroon, G = PO.gold;
  // kneeling on both knees, the toes tucked under, bowed forward, palms joined: the far leg first
  pdLimb(c, [[-24, -26], [-90, -24], [-140, -26]], [44, 40, 30], sk, { col: sk.far });
  pdLimb(c, [[-14, -200], [10, -110], [26, -32]], [74, 62, 48], P, { col: P.dk });
  // the near shin along the ground, the foot's toes tucked
  pdLimb(c, [[40, -26], [-40, -22], [-120, -24]], [48, 42, 32], sk);
  c.save(); c.translate(-126, -24); c.rotate(-1.5);
  poFill(c, [[-12, -12], [11, -12], [18, 3], [36, 10], [50, 14], [54, 22, 1], [-14, 26, 1], [-22, 18], [-20, 0]], sk.base, pdL(sk, 30));
  c.restore();
  // the near thigh in the dhoti, from the hip down to the knee
  const th = [[-60, -250], [20, -256], [44, -200], [64, -110], [72, -40, 1], [24, -10, 1], [4, -80], [-30, -160], [-64, -200]];
  poFill(c, th, P.base, { ...pdL(P, 90), inside: () => { for (const [a, b] of [[[-30, -230], [30, -40]], [[0, -240], [50, -60]]]) pdFold(c, [a, b], 5, rgba(P.dk, .6), 5); for (const [x, y] of [[-10, -200], [20, -140], [40, -80]]) ellipse(c, x, y, 3, 4, G.base); } });
  poBorder(c, [[72, -40], [48, -26], [24, -10]], 6);
  // the upper body, bowed about the hip
  c.save(); c.translate(-10, -250); c.rotate(.62); c.translate(0, 470);
  pdLimb(c, [[-56, -672], [-70, -610], [-78, -540]], [30, 34, 30], M);
  pdLimb(c, [[-4, -650], [40, -560], [96, -600]], [52, 44, 34], sk, { col: sk.far });
  poFill(c, [[-60, -496], [56, -500], [58, -466], [-58, -462]], M.base, pdL(M, 30));
  pdBaliUpper(c, { ...o, eye: 'low', mouth: 'calm', tilt: .25 });
  // the near arm, the forearm up, the palms together before his face
  pdLimb(c, [[8, -656], [40, -580], [60, -540]], [60, 52, 44], sk);
  poBorder(c, [[22, -604], [38, -600], [52, -604]], 8);
  pdLimb(c, [[60, -540], [86, -590], [104, -632]], [44, 38, 30], sk);
  pdHand(c, 102, -630, -1.2, sk, 'join');
  c.restore();
}

// ---------- Shukracharya ----------
function pdShukra(c, o = {}) {
  const sk = PD.shukra, S = PD.saffron, W = PD.wood, shock = o.pose === 'shock';
  // the staff (wary): taller than him, in his near hand
  if (!shock) { poLine(c, [[118, 0], [104, -940]], W.dk, 14); poLine(c, [[118, 0], [104, -940]], W.base, 10); poLine(c, [[114, -20], [101, -930]], rgba(W.lt, .6), 2.4); ellipse(c, 104, -944, 10, 8, W.dk); }
  // the far arm
  if (shock) {
    pdLimb(c, [[-6, -650], [-50, -740], [-30, -812]], [46, 40, 32], sk, { col: sk.far });
    pdHand(c, -30, -812, -.5, sk, 'open', { col: sk.far });
  } else {
    pdLimb(c, [[-4, -650], [24, -560], [64, -642]], [46, 40, 32], sk, { col: sk.far });
  }
  // the legs, thin, under a long robe to the ankle
  pdLimb(c, [[-26, -120], [-26, -60], [-24, -28]], [40, 34, 28], sk, { col: sk.far }); pdFoot(c, -24, -28, sk, { col: sk.far, alta: false, anklet: false });
  pdLimb(c, [[14, -120], [16, -60], [18, -28]], [42, 36, 30], sk); pdFoot(c, 18, -28, sk, { alta: false, anklet: false });
  // the robe: saffron to the shins
  const rb = [[-54, -472], [52, -474], [60, -400], [66, -280], [74, -96, 1], [30, -104], [-10, -98], [-58, -106, 1], [-66, -220], [-72, -360], [-66, -430]];
  poFill(c, rb, S.base, { ...pdL(S, 140), inside: () => { for (const [a, b] of [[[-36, -450], [-44, -110]], [[-6, -440], [-8, -100]], [[24, -430], [34, -104]], [[48, -400], [62, -110]]]) pdFold(c, [a, b], 5, rgba(S.dk, .55), 5); } });
  poBorder(c, [[74, -96], [30, -104], [-10, -98], [-58, -106]], 5, { base: '#B05A28', lt: '#E0A070', dk: '#7A3A18' });
  // the torso, lean, a little stooped: the shoulders forward
  c.save(); c.translate(0, -470); c.rotate(.08); c.translate(0, 470);
  poFill(c, [[-52, -470], [50, -470], [54, -520], [58, -572], [62, -612], [56, -650], [36, -680], [14, -694], [-22, -696], [-48, -674], [-60, -630], [-60, -560], [-58, -510]], sk.base, { ...pdL(sk, 110),
    inside: () => { for (const yy of [-600, -585, -570]) pdFold(c, [[58, yy], [36, yy + 6]], 2.4, rgba(sk.dk, .4), 2); } });
  // the uttariya over his near shoulder, across the chest; the sacred thread; a rudraksha mala
  poFill(c, [[-56, -660], [-20, -698], [20, -692], [52, -560], [56, -480], [20, -474], [24, -560], [-6, -650], [-40, -630]], S.base, { ...pdL(S, 50), inside: () => pdFold(c, [[0, -680], [30, -580], [40, -490]], 4, rgba(S.dk, .5), 4) });
  poLine(c, [[-6, -694], [20, -620], [44, -540], [52, -478]], 'rgba(246,240,224,.9)', 2.4);
  for (const [x, y] of poAlong([[30, -690], [50, -650], [58, -600], [54, -560]], 9)) ellipse(c, x, y, 4, 4, '#5A2E24');
  poFill(c, [[-20, -690], [22, -690], [26, -722], [-12, -728]], sk.base, { sh: [6, 4, 6, rgba(sk.dk, .7)] });
  c.save(); c.translate(10, -752); c.rotate(shock ? -.1 : .06); c.scale(1.12, 1.12);
  pdHead(c, { sk, hair: 'jata', beard: 'sage', tilak: 'tri', age: 1, eye: shock ? 'wide' : 'narrow', mouth: shock ? 'open' : 'calm', brow: shock ? 1 : -1 });
  c.restore();
  // the near arm
  if (shock) {
    pdLimb(c, [[8, -656], [74, -740], [52, -820]], [50, 44, 34], sk);
    pdHand(c, 52, -820, -2.3, sk, 'open');
  } else {
    pdLimb(c, [[8, -656], [40, -580], [100, -600]], [50, 44, 34], sk);
    pdHand(c, 96, -600, -.2, sk, 'grip');
  }
  c.restore();
  // the far hand stroking his beard (wary), over it
  if (!shock) pdHand(c, 64, -646, -1.1, sk, 'open', { col: sk.far, s: .9 });
}

// ---------- Trivikrama ----------
// facing +x, the planted foot at (0, 0), the raised foot forward and up (PD_TRIVI.foot); ~1000 to the crown's tip
const PD_TRIVI = { hip: [0, -440], knee: [176, -546], ankle: [350, -656], chakra: [170, -930], head: [20, -800] };
function pdTrivikrama(c, o = {}) {
  const sk = PO.skin, Y = PO.silk, M = PO.maroon, G = PO.gold, T = PD_TRIVI;
  // the uttariya streaming back behind him in the wind of his stride
  pdLimb(c, [[-30, -690], [-120, -660], [-210, -700], [-300, -680], [-380, -720]], [30, 40, 44, 38, 14], M);
  // far upper arm, raised behind, the conch
  pdLimb(c, [[-10, -660], [-92, -740], [-112, -846]], [52, 44, 34], sk, { col: sk.far });
  pdShankha(c, -116, -900, -.3);
  pdHand(c, -112, -846, -1.75, sk, 'grip', { col: sk.far });
  poBorder(c, [[-66, -746], [-56, -728], [-44, -712]], 8);
  // far lower arm, the hand on the gada's head, the gada standing on the ground
  pdGada(c, -126, -440, -120, 0);
  pdLimb(c, [[-10, -650], [-66, -560], [-112, -488]], [52, 44, 34], sk, { col: sk.far });
  pdHand(c, -112, -488, 1.2, sk, 'grip', { col: sk.far });
  // the planted leg (behind the raised one), the foot on the earth
  pdLimb(c, [[-6, -440], [-14, -240], [-18, -120], [-18, -28]], [104, 74, 60, 40], sk, { col: sk.far });
  pdFoot(c, -18, -28, sk, { col: sk.far, s: 1.2 });
  // the raised leg: thigh and shin forward and up; the sole turned to the sky
  const [ax, ay] = T.ankle;
  pdLimb(c, [T.hip, [96, -500], T.knee, [262, -600], [ax, ay]], [108, 92, 74, 58, 42], sk);
  pdFoot(c, ax + 4, ay - 4, sk, { a: -1.45, s: 1.25 });
  // the pitambar: the hips, the raised thigh to the knee, folds hanging from it; a pleated fall between the legs
  const dh = [[-60, -500], [58, -500], [80, -480], [130, -540], [182, -586], [196, -540, 1], [150, -470], [110, -400], [70, -330], [30, -300], [14, -240, 1], [-50, -230, 1], [-70, -320], [-72, -420]];
  poFill(c, dh, Y.base, { ...pdL(Y, 160), inside: () => {
    for (const [a, b] of [[[60, -460], [40, -320]], [[100, -470], [60, -360]], [[140, -520], [100, -420]], [[-30, -470], [-40, -250]]]) pdFold(c, [a, b], 6, rgba(Y.dk, .55), 6);
    for (const [x, y] of [[-20, -420], [20, -380], [-40, -330], [80, -440], [120, -500], [0, -300]]) ellipse(c, x, y, 3.4, 4.4, M.base);
  } });
  poBorder(c, [[196, -540], [150, -470], [110, -400], [70, -330], [30, -300], [14, -240]], 8);
  poBorder(c, [[14, -240], [-20, -236], [-50, -230]], 8);
  poFill(c, poLimb([[20, -480], [26, -380], [20, -280], [26, -190]], [24, 28, 26, 10]), Y.base, pdL(Y, 26, { sa: .6 }));   // the front end, hanging
  // the torso, upright; the sash; the sacred thread; the necklaces and kaustubha
  poFill(c, [[-60, -520], [-52, -486], [58, -490], [60, -520]], M.base, pdL(M, 30));
  poFill(c, PD_TORSO.map(([x, y]) => [x, y - 30]), sk.base, { ...pdL(sk, 120),
    inside: () => { pdFold(c, [[70, -630], [48, -606], [14, -608]], 6, rgba(sk.dk, .45), 6); ellipse(c, 56, -538, 2.4, 3.4, rgba(sk.dk, .7)); } });
  poBorder(c, [[-60, -500], [0, -496], [60, -500]], 6);
  poLine(c, [[-14, -724], [20, -650], [44, -580], [58, -510]], 'rgba(246,240,224,.9)', 2.6);
  poDots(c, [[36, -716], [52, -690], [62, -660]], 3.4, 8);
  pdGem(c, 68, -640, 7, PO.red);
  // the vanamala, from his neck down the front, swinging back over the raised thigh
  const vm = [[30, -712], [62, -640], [72, -560], [86, -470], [80, -400], [40, -390], [-20, -420], [-50, -470], [-56, -560], [-48, -660]];
  limb(c, vm, vm.map(() => 12), '#5A7650', false);
  for (const [x, y] of poAlong(vm, 6)) ellipse(c, x, y - 1, 4, 4, '#7E9C6A');
  poAlong(vm, 46).forEach(([x, y], i) => { ellipse(c, x, y, 5.5, 5.5, i % 2 ? '#EDE6D4' : '#B0303A'); ellipse(c, x, y, 2, 2, G.lt); });
  // the neck, the head bowed a little toward Bali
  poFill(c, [[-20, -720], [22, -720], [26, -752], [-12, -758]], sk.base, { sh: [6, 4, 6, rgba(sk.dk, .7)] });
  c.save(); c.translate(T.head[0], T.head[1]); c.rotate(o.tilt ?? .14); c.scale(1.18, 1.18);
  pdHead(c, { sk, hair: 'kirita', tilak: 'u', eye: 'low', mouth: 'smile' });
  c.restore();
  // near lower arm: forward and down, the hand open to Bali (varada)
  pdLimb(c, [[6, -684], [44, -590], [120, -560]], [60, 52, 40], sk);
  poBorder(c, [[18, -630], [34, -626], [48, -630]], 9);
  pdHand(c, 120, -560, .5, sk, 'open');
  // near upper arm: raised forward, the chakra spinning on his finger
  pdLimb(c, [[6, -690], [90, -756], [146, -840]], [58, 50, 40], sk);
  poBorder(c, [[64, -770], [76, -752], [88, -736]], 9);
  pdChakra(c, T.chakra[0], T.chakra[1], 64);
  pdHand(c, 146, -840, -1.25, sk, 'open');
}
function pdChakra(c, x, y, r) {
  const G = PO.gold;
  c.save(); c.translate(x, y);
  glow(c, 0, 0, r * 2.2, '#FFE6A0', .45, 'source-over');
  for (let i = 0; i < 16; i++) { c.save(); c.rotate(i / 16 * TAU); poFill(c, [[r * .9, -9], [r * 1.24, 0, 1], [r * .9, 9]], G.base, { sh: [0, 4, 3, rgba(G.dk, .7)] }); c.restore(); }
  ellipse(c, 0, 0, r, r, G.dk); ellipse(c, 0, 0, r * .9, r * .9, G.base); ellipse(c, 0, 0, r * .72, r * .72, '#F6E2A8');
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; poLine(c, [[Math.cos(a) * r * .18, Math.sin(a) * r * .18], [Math.cos(a) * r * .7, Math.sin(a) * r * .7]], G.dk, 4); }
  ellipse(c, 0, 0, r * .22, r * .22, G.base); ellipse(c, 0, 0, r * .1, r * .1, PO.red);
  c.restore();
}
function pdShankha(c, x, y, a) {
  const W = PD.white;
  c.save(); c.translate(x, y); c.rotate(a);
  poFill(c, [[0, 50], [-22, 36], [-30, 6], [-24, -24], [-10, -46], [6, -52], [16, -40], [26, -20], [30, 6], [24, 30], [12, 44]], W.base,
    { ...pdL(W, 60), inside: () => { for (const yy of [-26, -6, 14]) pdFold(c, [[-26, yy], [0, yy + 8], [28, yy]], 2.4, rgba(W.dk, .6), 2); } });
  poFill(c, [[6, -52], [14, -64], [20, -60], [16, -40]], W.base, pdL(W, 10));
  c.restore();
}
function pdGada(c, x, y, gx, gy) {
  const G = PO.gold;
  poLine(c, [[x, y], [gx, gy]], G.dk, 16); poLine(c, [[x, y], [gx, gy]], G.base, 11); poLine(c, [[x + 3, y], [gx + 3, gy]], rgba(G.lt, .8), 2.4);
  c.save(); c.translate(x, y - 30);
  poFill(c, [[-48, 0], [-40, -30], [-14, -46], [14, -46], [40, -30], [48, 0], [40, 30], [14, 44], [-14, 44], [-40, 30]], G.base, { sh: [6, 12, 12, rgba(G.dk, .9)], hi: [-6, -10, 10, rgba(G.lt, .9)],
    inside: () => { for (const xx of [-28, -8, 12, 32]) pdFold(c, [[xx, -44], [xx + 3, 0], [xx, 44]], 3, rgba(G.dk, .55), 2); poBorder(c, [[-50, 0], [50, 0]], 5); } });
  c.restore();
}

// ---------- the yagna ----------
// the brick altar side on, three steps up, the fire in it; (x, y) the base's centre on the ground; o.ph flicker phase
function pdKund(c, x, y, o = {}) {
  const B = PD.brick, s = o.s || 1, ph = o.ph || 0;
  c.save(); c.translate(x, y); c.scale(s, s);
  // the fire behind the front wall: flames as soft tongues, dark orange to pale gold
  glow(c, 0, -150, 260, '#FFB060', .35, 'source-over');
  const tongue = (cx, h, w, col, lean, k) => poFill(c, [[cx - w, -88], [cx - w * .9, -88 - h * .35], [cx - w * .4 + lean * .4, -88 - h * .7], [cx + lean, -88 - h, 1], [cx + w * .5 + lean * .3, -88 - h * .6], [cx + w * .9, -88 - h * .3], [cx + w, -88]], col, { alpha: k });
  const L = [[-46, 190, 40, -10], [40, 170, 40, 14], [0, 260, 54, 6]];
  for (const [cx, h, w, l] of L) tongue(cx, h * (1 + .06 * Math.sin(ph + cx)), w, '#C8502A', l, .95);
  for (const [cx, h, w, l] of L) tongue(cx, h * .78, w * .72, '#E58A34', l * .8, .95);
  for (const [cx, h, w, l] of L) tongue(cx, h * .52, w * .46, '#F4C460', l * .6, .95);
  tongue(0, 110, 22, '#FCEBB4', 4, .9);
  // sparks
  const R = lcg(11); for (let i = 0; i < 9; i++) ellipse(c, (R() - .5) * 140, -260 - R() * 160, 2.4, 2.4, rgba('#F8D080', .5 + R() * .4));
  // the steps of brick
  const tiers = [[180, 0, 34], [150, -34, 30], [120, -64, 28]];
  for (const [hw, ty, th] of tiers) {
    poFill(c, [[-hw, ty, 1], [-hw, ty - th, 1], [hw, ty - th, 1], [hw, ty, 1]], B.base, { sh: [0, th * .4, 8, rgba(B.dk, .8)], hi: [0, -th * .3, 6, rgba(B.lt, .8)],
      inside: () => { for (let r = 0; r < 2; r++) { const yy = ty - th * (r + 1) / 2; poLine(c, [[-hw, yy], [hw, yy]], rgba(B.dk, .5), 1.6); for (let bx = -hw + (r ? 20 : 0); bx < hw; bx += 40) poLine(c, [[bx, yy], [bx, yy + th / 2]], rgba(B.dk, .5), 1.6); } } });
  }
  // a rim of sandal paste and a row of flowers on the top step
  poLine(c, [[-120, -92], [120, -92]], 'rgba(240,226,196,.9)', 4);
  for (let i = -5; i <= 5; i++) ellipse(c, i * 22, -96, 6, 5, i % 2 ? '#E0901C' : '#C8402C');
  c.restore();
}
// mango leaves and marigolds on a string between two posts, sagging to y + sag at the middle
function pdToran(c, x0, x1, y, sag = 40) {
  const L = PO.leaf, n = Math.round((x1 - x0) / 46), at = u => [lerp(x0, x1, u), y + Math.sin(u * Math.PI) * sag];
  poLine(c, Array.from({ length: 21 }, (_, i) => at(i / 20)), '#6A5A3A', 3);
  for (let i = 1; i < n; i++) {
    const [lx, ly] = at(i / n);
    if (i % 2) { c.save(); c.translate(lx, ly); c.rotate(.06 * Math.sin(i * 1.7));
      poFill(c, [[0, 0, 1], [-14, 26], [-12, 62], [0, 92, 1], [12, 62], [14, 26]], L.base, { sh: [6, 0, 6, rgba(L.dk, .8)], hi: [-5, 0, 5, rgba(L.lt, .7)], inside: () => poLine(c, [[0, 4], [0, 88]], rgba(L.lt, .6), 1.4) });
      c.restore(); }
    else { ellipse(c, lx, ly + 10, 11, 10, '#E0901C'); ellipse(c, lx - 3, ly + 7, 4, 3.5, '#F4BE5A'); }
  }
}
function pdPost(c, x, y0, y1) {
  const Wd = PD.wood;
  poFill(c, [[x - 10, y1, 1], [x - 10, y0, 1], [x + 10, y0, 1], [x + 10, y1, 1]], Wd.base, { sh: [6, 0, 6, rgba(Wd.dk, .8)], hi: [-5, 0, 5, rgba(Wd.lt, .7)] });
  poFill(c, [[x - 14, y0 + 6], [x, y0 - 22, 1], [x + 14, y0 + 6]], PO.gold.base, { sh: [4, 0, 4, rgba(PO.gold.dk, .8)] });
}
