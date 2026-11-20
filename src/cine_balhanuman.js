// cine_balhanuman.js: Bal Hanuman for the Cinematic engine and the Inked comics (CHIRANJEEVI Issue 2). A newborn
// vanara, drawn to be adored: the head as big as the rest of him, golden fur "like ripe rice" (Uttara 7.35.21) with a
// soft fluffy edge, a peach heart-shaped face, huge glossy eyes, a button nose, a little curl on the crown, round
// cheeks, a round belly, short chubby limbs with real little hands and feet, and a long tail with a curl. No jewellery
// on the newborn (o.jewel adds kundals and a necklace for the older boy). Load after cine.js.
//
// Units: the head's centre at (0, 0), its radius ~100; the belly at about (0, 175); the soles at y ~330 standing.
//
//   balHead(c, o)   the head alone. o:
//     expr   'calm' | 'wonder' | 'wail' | 'grin' | 'giggle' | 'hungry' | 'fierce' | 'hurt' | 'sleep' | 'pout'
//     look   [x, y] the irises (-1..1); turn (-1..1) the head turned to screen left/right (the features slide, the far
//            eye narrows: a cheap three-quarter view); tilt (radians)
//     tears  0..1; drool 0..1; bruise 0..1 (the broken left jaw, on screen right: his left); red (0..1) the eyes
//            catching a red sun; spark (0..1) extra catch-lights; blood (0..1) a trickle from the mouth corner
//            on his left; pal (colours over BH: Anjana); curl (false: no crown curl); t
//   balHanuman(c, o)  the whole child. o: everything balHead takes, plus
//     pose   'sit' | 'wail' (sitting, fists up) | 'leap' (stretched up and to screen right, one hand reaching) |
//            'reach' (both arms up to us) | 'limp' (lying on his back, arms out: rotate it yourself) | 'curl' (curled
//            in someone's arms) | 'stand' | 'run' (o.step 0..1) | 'swing' (one arm up, holding on)
//     arms / legs  overrides: [[upper angle, bend], [upper angle, bend]] (far side first), radians, 0 = +x
//     tail   'stream' | 'curl' | 'up' | 'limp'; jewel (bool); flip (mirror)
const BH = {
  fur: '#EE9A2C', furSh: '#C06C16', furDk: '#86480E', furLt: '#FFCB6A',
  skin: '#F1BE8C', skinSh: '#D99863', skinDk: '#B87648', skinLt: '#FBDDBA',
  eye: '#3B2112', iris: '#8A4E1E', irisLt: '#C98A3A', eyeW: '#FFFDF6', lid: '#4A2414', brow: '#9A5A1C',
  nose: '#6A3420', mouth: '#9A2E2E', mouthDk: '#5A1414', tongue: '#F27C7A', teeth: '#FFFDF6', blush: '#F69284',
  tear: '#BFE6FF', tilak: '#E02A1E', langot: '#D8322E', langotSh: '#A21E1E', gold: '#F2BE3E', goldSh: '#B88420', goldLt: '#FFE69A',
  bruise: '#B65A6E',
};
const BH_EXPR = {
  // eyes: open 0..1.2 (or 'squeeze' | 'happy' | 'shut'), brow: +1 worried/raised .. -1 cross, mouth
  calm: { open: 1, brow: .2, mouth: 'smile' },
  wonder: { open: 1.15, brow: .9, mouth: 'o', spark: 1 },
  hungry: { open: 1.1, brow: .7, mouth: 'o', spark: 1, drool: .8 },
  wail: { open: 'squeeze', brow: 1, mouth: 'wail', tears: 1 },
  grin: { open: 1, brow: .4, mouth: 'grin' },
  giggle: { open: 'happy', brow: .5, mouth: 'grin' },
  fierce: { open: .95, brow: -.8, mouth: 'set' },
  hurt: { open: 'shut', brow: 1, mouth: 'frown' },
  sleep: { open: 'shut', brow: .1, mouth: 'small' },
  pout: { open: 1, brow: .8, mouth: 'pout', tears: .5 },
};

// a fluffy closed outline: a base ellipse whose edge bulges in n soft scallops (fur)
function bhFluff(cx, cy, rx, ry, n, amp, seed = 1, a0 = 0, a1 = TAU) {
  const P = new Path2D(), R = lcg(seed), full = a1 - a0 >= TAU - 1e-6;
  const pt = (a, k) => [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k];
  P.moveTo(...pt(a0, 1));
  for (let i = 0; i < n; i++) {
    const u0 = a0 + (a1 - a0) * i / n, u1 = a0 + (a1 - a0) * (i + 1) / n, um = (u0 + u1) / 2, k = 1 + amp * (.75 + R() * .5);
    const [mx, my] = pt(um, k), [ex, ey] = pt(u1, 1);
    P.quadraticCurveTo(mx, my, ex, ey);
  }
  if (full) P.closePath();
  return P;
}

function balHead(c, o = {}) {
  const S = o.pal ? { ...BH, ...o.pal } : BH, E = BH_EXPR[o.expr || 'calm'], t = o.t || 0, tn = clamp(o.turn || 0, -1, 1), lk = o.look || [0, 0];
  const sx = tn * 22;                                   // how far the face slides with the turn
  c.save(); c.rotate(o.tilt || 0);
  // ---- ears (the far one hides a little behind the head when turned)
  for (const s of [-1, 1]) {
    const k = 1 - Math.max(0, s * -tn) * .35, ex = s * 102 * (1 - Math.abs(tn) * .08) + sx * .3, ey = -6;
    const E1 = ellP(ex, ey, 30 * k, 33);
    fillPath(c, E1, S.fur); shade(c, E1, ex - s * 20, ey - 20, ex + s * 20, ey + 30, S.furSh, .7);
    const E2 = ellP(ex + s * 2, ey + 2, 18 * k, 21); fillPath(c, E2, S.skin); shade(c, E2, ex - s * 10, ey - 10, ex + s * 14, ey + 20, S.skinSh, .9);
    if (o.jewel) { c.strokeStyle = S.gold; c.lineWidth = 5; c.beginPath(); c.arc(ex + s * 4, ey + 34, 10, 0, TAU); c.stroke(); }
  }
  // ---- the head: round, a little wider at the cheeks, with a fluffy edge; tufts at the cheeks
  const HEAD = bhFluff(0, 0, 106, 100, 22, .045, 7);
  const CHK = new Path2D(); for (const s of [-1, 1]) CHK.addPath(bhFluff(s * 78 + sx * .4, 46, 40, 34, 7, .12, 3 + s, s > 0 ? -.6 : Math.PI - 1.2, s > 0 ? 1.2 : Math.PI + .6));
  fillPath(c, HEAD, S.fur);
  for (const s of [-1, 1]) fillPath(c, ellP(s * 82 + sx * .4, 48, 36, 30), S.fur);
  fillPath(c, CHK, S.fur);
  radialShade(c, HEAD, -30 + sx, -46, 40, 150, S.furSh, .75);
  ellipse(c, -34 + sx * .6, -62, 34, 16, rgba(S.furLt, .55), -.25);
  // fur texture: a few soft strands on the crown
  // ---- the curl on the crown
  if (o.curl !== false) {
    const bx = 4 + sx * .5;
    limb(c, [[bx - 8, -92], [bx - 10, -122], [bx + 6, -146], [bx + 30, -146], [bx + 38, -126], [bx + 24, -112], [bx + 12, -122]], [30, 26, 22, 18, 14, 10, 7], S.fur);
    limb(c, [[bx - 6, -100], [bx - 8, -124], [bx + 6, -142]], [9, 7, 5], rgba(S.furLt, .8));
  }
  // ---- the face: a heart of two eye lobes and a round muzzle
  const fx = sx, F = new Path2D();
  F.moveTo(fx, -40);
  F.bezierCurveTo(fx - 16, -66, fx - 70, -66, fx - 84 + tn * 8, -24);
  F.bezierCurveTo(fx - 94 + tn * 10, 8, fx - 80 + tn * 10, 52, fx - 54, 76);
  F.bezierCurveTo(fx - 30, 96, fx + 30, 96, fx + 54, 76);
  F.bezierCurveTo(fx + 80 + tn * 10, 52, fx + 94 + tn * 10, 8, fx + 84 + tn * 8, -24);
  F.bezierCurveTo(fx + 70, -66, fx + 16, -66, fx, -40);
  F.closePath();
  fillPath(c, F, S.skin);
  shade(c, F, fx + 10, -10, fx - 30, 96, S.skinSh, .55);
  c.save(); c.strokeStyle = S.furSh; c.lineWidth = 3.5; c.stroke(F); c.restore();
  // ---- the sindoor tilak, a small drop between the lobes
  fillPath(c, `M ${fx} -82 C ${fx + 6} -70 ${fx + 6} -58 ${fx} -50 C ${fx - 6} -58 ${fx - 6} -70 ${fx} -82 Z`, S.tilak);
  // ---- brows: little soft arcs high on the fur (worried up, cross down)
  const bw = E.brow;
  for (const s of [-1, 1]) {
    const x0 = fx + s * 20, x1 = fx + s * 60, yb = -62 - bw * 6, yin = yb + (bw > 0 ? -bw * 8 : -bw * 14), yout = yb + (bw > 0 ? bw * 6 : bw * 4);
    strokePath(c, `M ${x0} ${yin} Q ${(x0 + x1) / 2} ${yb - 8} ${x1} ${yout}`, S.lid, 5);
  }
  // ---- eyes
  const op = o.open ?? E.open, spark = o.spark ?? E.spark ?? 0, red = o.red || 0;
  for (const s of [-1, 1]) {
    const far = s * tn < 0 ? -s * tn : 0, ex = fx + s * 36 + tn * 6, ey = -4, kx = 1 - far * .3;
    if (op === 'squeeze') {           // >  < : screwed shut, crying
      strokePath(c, `M ${ex - s * 22 * kx} ${ey - 14} L ${ex + s * 14 * kx} ${ey} L ${ex - s * 22 * kx} ${ey + 12}`, S.lid, 7);
      continue;
    }
    if (op === 'happy') { strokePath(c, `M ${ex - 22 * kx} ${ey + 6} Q ${ex} ${ey - 22} ${ex + 22 * kx} ${ey + 6}`, S.lid, 7); continue; }
    if (op === 'shut') { strokePath(c, `M ${ex - 22 * kx} ${ey - 2} Q ${ex} ${ey + 14} ${ex + 22 * kx} ${ey - 2}`, S.lid, 6); strokePath(c, `M ${ex + s * 20 * kx} ${ey} l ${s * 8} 4`, S.lid, 3.5); continue; }
    const ry = 32 * op, rx = 27 * kx, EW = ellP(ex, ey, rx, ry);
    fillPath(c, EW, S.eyeW);
    inside(c, EW, () => {
      const ix = ex + lk[0] * 8 * kx, iy = ey + 4 + lk[1] * 7, ir = 22 * kx;
      const g = c.createLinearGradient(0, iy - 24, 0, iy + 24); g.addColorStop(0, S.eye); g.addColorStop(.55, mixCol(S.iris, '#D24A2A', red * .6)); g.addColorStop(1, mixCol(S.irisLt, '#FF7A3A', red));
      c.fillStyle = g; c.beginPath(); c.ellipse(ix, iy, ir, 25, 0, 0, TAU); c.fill();
      ellipse(c, ix, iy + 1, 11 * kx, 13, '#140804');
      if (red) { ellipse(c, ix + 2, iy + 3, 9 * kx, 9, rgba('#FF5A2A', red * .9)); ellipse(c, ix + 2, iy + 3, 5 * kx, 5, rgba('#FFD07A', red)); }
      ellipse(c, ix - 9 * kx, iy - 11, 9 * kx, 10, '#FFFFFF');
      ellipse(c, ix + 9 * kx, iy + 11, 4.2 * kx, 4.2, '#FFFFFF');
      if (spark) { ellipse(c, ix + 10 * kx, iy - 12, 3.4 * kx, 3.4, rgba('#FFFFFF', spark)); ellipse(c, ix - 12 * kx, iy + 8, 2.6 * kx, 2.6, rgba('#FFFFFF', spark)); }
      shade(c, EW, ex, ey + 10, ex, ey - ry, S.lid, .22);
    });
    // the upper lid: a thick soft line with a little flick at the outer corner (no frown tick)
    strokePath(c, `M ${ex - rx - 2} ${ey + 2} C ${ex - rx * .6} ${ey - ry - 6} ${ex + rx * .6} ${ey - ry - 6} ${ex + rx + 2} ${ey + 2}`, S.lid, 6.5);
    strokePath(c, `M ${ex + s * (rx - 2)} ${ey - ry * .45} q ${s * 9} -3 ${s * 13} -10`, S.lid, 4);
  }
  // ---- tears: two shining streams from the outer corners, a drop flying
  const tr = o.tears ?? E.tears ?? 0;
  if (tr > 0) for (const s of [-1, 1]) {
    const x = fx + s * 52, y = 12;
    const T = `M ${x} ${y} C ${x + s * 10} ${y + 30} ${x + s * 4} ${y + 60 * tr} ${x + s * 12} ${y + 80 * tr} C ${x + s * 20} ${y + 66 * tr} ${x + s * 20} ${y + 30} ${x + s * 8} ${y - 2} Z`;
    fillPath(c, T, rgba(S.tear, .92)); strokePath(c, T, rgba('#6AAED8', .8), 2);
    ellipse(c, x + s * 30, y + 6 + Math.sin(t * 3 + s) * 3, 7 * tr, 10 * tr, rgba(S.tear, .92));
  }
  // ---- cheeks
  for (const s of [-1, 1]) ellipse(c, fx + s * 64 + tn * 4, 40, 19, 12, rgba(S.blush, .55));
  // ---- the bruise on his left jaw (screen right): the vajra
  if (o.bruise) { const J = ellP(fx + 60, 64, 26 * o.bruise, 20 * o.bruise, -.4); fillPath(c, J, rgba(S.bruise, .75)); shade(c, J, fx + 50, 50, fx + 74, 84, '#7A2A40', .6); }
  // ---- nose: a soft rounded triangle and two nostrils
  fillPath(c, `M ${fx - 14 + tn * 4} 22 C ${fx - 14} 14 ${fx + 14} 14 ${fx + 14 + tn * 4} 22 C ${fx + 12} 32 ${fx + 4} 36 ${fx + tn * 2} 36 C ${fx - 4} 36 ${fx - 12} 32 ${fx - 14 + tn * 4} 22 Z`, S.nose);
  ellipse(c, fx - 4 + tn * 2, 20, 5, 3, rgba('#FFFFFF', .5));
  // ---- the mouth
  const mo = E.mouth, my = 54, mx = fx + tn * 6;
  if (mo === 'smile') strokePath(c, `M ${mx - 16} ${my - 2} Q ${mx - 8} ${my + 8} ${mx} ${my} Q ${mx + 8} ${my + 8} ${mx + 16} ${my - 2}`, S.mouthDk, 4.5);
  else if (mo === 'small') strokePath(c, `M ${mx - 8} ${my + 2} Q ${mx} ${my + 6} ${mx + 8} ${my + 2}`, S.mouthDk, 4);
  else if (mo === 'o') { const M = ellP(mx, my + 6, 13, 15); fillPath(c, M, S.mouthDk); inside(c, M, () => ellipse(c, mx, my + 18, 10, 7, S.tongue)); }
  else if (mo === 'pout') { strokePath(c, `M ${mx - 14} ${my + 8} Q ${mx} ${my - 4} ${mx + 14} ${my + 8}`, S.mouthDk, 5); }
  else if (mo === 'frown') strokePath(c, `M ${mx - 14} ${my + 8} Q ${mx} ${my - 2} ${mx + 14} ${my + 8}`, S.mouthDk, 4);
  else if (mo === 'set') { strokePath(c, `M ${mx - 16} ${my + 2} L ${mx + 16} ${my}`, S.mouthDk, 5); }
  else if (mo === 'grin') {
    const M = `M ${mx - 30} ${my - 6} C ${mx - 20} ${my + 30} ${mx + 20} ${my + 30} ${mx + 30} ${my - 6} C ${mx + 14} ${my} ${mx - 14} ${my} ${mx - 30} ${my - 6} Z`;
    fillPath(c, M, S.mouthDk); inside(c, M, () => { ellipse(c, mx, my + 22, 18, 11, S.tongue); });
  } else if (mo === 'wail') {
    const M = `M ${mx - 36} ${my - 4} C ${mx - 34} ${my + 46} ${mx + 34} ${my + 46} ${mx + 36} ${my - 4} C ${mx + 16} ${my + 4} ${mx - 16} ${my + 4} ${mx - 36} ${my - 4} Z`;
    fillPath(c, M, S.mouthDk); inside(c, M, () => { ellipse(c, mx, my + 34, 22, 14, S.tongue); });
  }
  // blood at the corner of the mouth, on his left (screen right): the vajra
  if (o.blood) { const x = mx + 20, y = my + 2, b = o.blood; fillPath(c, `M ${x - 3} ${y} C ${x + 2} ${y + 14 * b} ${x + 8} ${y + 26 * b} ${x + 6} ${y + 36 * b} C ${x + 10} ${y + 40 * b} ${x + 14} ${y + 34 * b} ${x + 11} ${y + 26 * b} C ${x + 8} ${y + 16 * b} ${x + 4} ${y + 6 * b} ${x + 3} ${y} Z`, '#B0141E'); }
  // drool, for the hungry look at the "fruit"
  const dr = o.drool ?? E.drool ?? 0;
  if (dr) { const x = mx + 9, y = my + 18; fillPath(c, `M ${x - 4} ${y} C ${x - 5} ${y + 16 * dr} ${x - 6} ${y + 22 * dr} ${x} ${y + 26 * dr} C ${x + 6} ${y + 22 * dr} ${x + 5} ${y + 16 * dr} ${x + 4} ${y} Z`, rgba(S.tear, .9)); }
  c.restore();
}

// ---------- the body ----------
const BH_POSE = {
  //        far arm            near arm           far leg            near leg           tail
  sit:   { arms: [[2.2, -.7], [.9, .7]], legs: [[2.5, -1.4], [.65, 1.4]], tail: 'curl', head: [0, 0] },
  wail:  { arms: [[-2.1, -1.5], [-1.0, 1.5]], legs: [[2.5, -1.4], [.65, 1.4]], tail: 'curl', head: [0, -.08] },
  leap:  { arms: [[-2.6, .3], [-.75, -.15]], legs: [[2.0, .6], [1.55, -.5]], tail: 'stream', head: [.3, .25] },
  reach: { arms: [[-2.3, .25], [-.85, -.25]], legs: [[1.9, .2], [1.25, -.2]], tail: 'up', head: [0, 0] },
  limp:  { arms: [[2.9, -.3], [.3, .4]], legs: [[2.0, -.3], [1.2, .4]], tail: 'limp', head: [0, .15] },
  curl:  { arms: [[1.3, -1.7], [1.7, 1.6]], legs: [[1.0, -1.6], [2.0, 1.5]], tail: 'curl', head: [0, .12] },
  stand: { arms: [[2.0, .3], [1.15, -.3]], legs: [[1.75, 0], [1.4, 0]], tail: 'up', head: [0, 0] },
  swing: { arms: [[-1.7, .1], [1.2, -.4]], legs: [[2.0, .5], [1.2, -.6]], tail: 'up', head: [0, -.1] },
};
function balHanuman(c, o = {}) {
  const S = BH, t = o.t || 0, P = BH_POSE[o.pose || 'sit'] || BH_POSE.sit;
  let arms = o.arms || P.arms, legs = o.legs || P.legs;
  if (o.pose === 'run') { const ph = (o.step || 0) * TAU; arms = [[1.6 + Math.sin(ph) * .7, -.9], [1.5 - Math.sin(ph) * .7, -.9]]; legs = [[1.6 - Math.sin(ph) * .6, .5], [1.6 + Math.sin(ph) * .6, .5]]; }
  c.save(); if (o.flip) c.scale(-1, 1);
  const by = 178;                                             // the belly's centre
  // ---- the tail, behind everything
  {
    const T0 = [-30, by + 70], w = Math.sin(t * 2) * 8, tl = o.tail || P.tail;
    const pts = tl === 'stream' ? [T0, [-80, by + 130], [-170, by + 170 + w], [-270, by + 160 + w], [-340, by + 110], [-350, by + 60], [-318, by + 40], [-300, by + 66]]
      : tl === 'up' ? [T0, [-100, by + 60], [-150, by - 20], [-150, by - 120 + w], [-120, by - 170], [-84, by - 160], [-86, by - 126]]
      : tl === 'limp' ? [T0, [-90, by + 120], [-180, by + 150], [-280, by + 150], [-350, by + 130], [-380, by + 100]]
      : [T0, [-110, by + 90], [-180, by + 30], [-180, by - 60 + w], [-140, by - 100], [-104, by - 84], [-112, by - 54]];
    limb(c, pts, [28, 26, 24, 22, 20, 18, 14, 11], S.fur);
    limb(c, pts.map(([x, y]) => [x + 3, y + 5]), [10, 10, 9, 8, 7, 6, 5, 4], rgba(S.furSh, .7));
    if (tl !== 'limp') { const e = pts[pts.length - 1]; ellipse(c, e[0], e[1], 9, 9, S.furLt); }
  }
  // limbs: a chubby two-bone chain; a hand or a foot at the end
  const lim = (sh, a, b, l1, l2, w, dark) => { const ch = chain(sh, a, l1, b, l2); limb(c, ch, w, dark ? S.furSh : S.fur); return ch; };
  const hand = (p, a, open) => {
    c.save(); c.translate(p[0], p[1]); c.rotate(a);
    const H = open ? ellP(18, 0, 26, 22) : ellP(14, 0, 22, 20);
    fillPath(c, H, S.skin); shade(c, H, 14, -18, 14, 22, S.skinSh, .5);
    fillPath(c, ellP(open ? 10 : 8, -18, 10, 8, -.5), S.skin);   // the thumb
    if (open) for (const k of [-10, 0, 10]) ellipse(c, 42, k, 7, 6, S.skin);
    c.restore();
  };
  const foot = (p, a) => {
    c.save(); c.translate(p[0], p[1]); c.rotate(a - Math.PI / 2);
    const F = 'M -22 -6 C -26 24 -20 46 0 50 C 20 46 26 24 22 -6 Z'; fillPath(c, F, S.skin); shade(c, F, 10, -6, -10, 50, S.skinSh, .8);
    for (const k of [-12, 0, 12]) ellipse(c, k, 48, 7, 7, S.skin);
    c.restore();
  };
  const hipX = 38, hipY = by + 52, shY = by - 50;
  // ---- far leg, far arm
  const lF = lim([-hipX, hipY], legs[0][0], legs[0][1], 54, 50, [52, 44, 36], 1); foot(lF[2], legs[0][0] + legs[0][1]);
  const aF = lim([-54, shY], arms[0][0], arms[0][1], 48, 44, [40, 34, 30], 1); hand(aF[2], arms[0][0] + arms[0][1], o.open);
  // ---- near leg: both legs come out from under the belly and the langot (never a leg in front of the cloth)
  const lN = lim([hipX, hipY], legs[1][0], legs[1][1], 54, 50, [54, 46, 38]); foot(lN[2], legs[1][0] + legs[1][1]);
  // ---- the torso: a round pear, the belly patch
  const TOR = `M 0 ${by - 92} C 52 ${by - 92} 82 ${by - 50} 86 ${by} C 90 ${by + 58} 66 ${by + 96} 0 ${by + 98} C -66 ${by + 96} -90 ${by + 58} -86 ${by} C -82 ${by - 50} -52 ${by - 92} 0 ${by - 92} Z`;
  fillPath(c, TOR, S.fur);
  const BEL = ellP(4, by + 18, 56, 62);
  inside(c, TOR, () => { fillPath(c, BEL, S.skin); shade(c, BEL, 30, by - 40, -40, by + 80, S.skinSh, .65); ellipse(c, 4, by + 26, 4, 5, rgba(S.skinDk, .8)); });
  shade(c, TOR, 50, by - 70, -80, by + 80, S.furSh, .6);
  // a red langot with a gold cord
  const LG = `M -72 ${by + 50} C -40 ${by + 64} 40 ${by + 64} 72 ${by + 50} C 66 ${by + 78} 46 ${by + 96} 18 ${by + 100} L 0 ${by + 104} L -18 ${by + 100} C -46 ${by + 96} -66 ${by + 78} -72 ${by + 50} Z`;
  fillPath(c, LG, S.langot); shade(c, LG, 20, by + 50, -40, by + 104, S.langotSh, .8);
  limb(c, [[-74, by + 50], [0, by + 64], [74, by + 50]], [9, 9, 9], S.gold, false);
  if (o.jewel) { strokePath(c, `M -40 ${by - 80} C -22 ${by - 58} 22 ${by - 58} 40 ${by - 80}`, S.gold, 6); ellipse(c, 0, by - 60, 8, 10, S.gold); ellipse(c, 0, by - 60, 4, 5, S.tilak); }
  // ---- the head, on top of the body (a little bob)
  c.save(); const hd = P.head; c.translate(0, by - 92); c.rotate(hd[1] * 0 + (o.headRot ?? 0)); c.translate(hd[0] * 30, -92 + hd[1] * 40);
  balHead(c, { ...o, tilt: (o.tilt ?? 0) + hd[1] * .5 });
  c.restore();
  // ---- near arm, last
  const aN = lim([54, shY], arms[1][0], arms[1][1], 48, 44, [42, 36, 31]); hand(aN[2], arms[1][0] + arms[1][1], o.open);
  c.restore();
}
