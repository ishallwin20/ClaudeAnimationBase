// bi_hand.js: a hand for the Brush Ink look. A palm and five fingers, each finger three bones that bend in 3D (spread in
// the palm's plane, then curl toward the palm) and are seen in a slight perspective: a finger curled toward us shortens
// and folds down across the palm, as in a drawn hand. Every finger is its own shape with its own ink, a shadow side,
// creases or knuckles, a nail when its back turns to us, and rings that wrap round it.
//
// biHandRig(c, o): o.x, o.y the wrist (caller units); o.ang the hand's axis (0 = fingers up, + clockwise); o.k the scale
// (the hand is ~100 units from the wrist to the middle fingertip); o.flip mirrors it (thumb to the left);
// o.view 'palm' (palm to us) or 'back'; o.f = { t, i, m, r, p }: [spread°, curl1°, curl2°, curl3°] per finger;
// o.rings = { i: 0, m: 0 } (the bone a ring sits on); o.pal = { skin, skinS, skinD, skinH, nail }.
const BH = (() => {
  const deg = Math.PI / 180;
  const BASE = {   // knuckle (x, y), bone lengths, widths at knuckle / joint / joint / tip: long, slim, tapering
    i: { at: [12, -48], len: [25, 15, 12], w: [9, 8.2, 7.3, 6.2] },
    m: { at: [3, -50], len: [28, 17, 13], w: [9.4, 8.6, 7.7, 6.4] },
    r: { at: [-6, -48], len: [26, 16, 12], w: [8.8, 8, 7.2, 6.1] },
    p: { at: [-14, -43], len: [20, 12, 10], w: [7.8, 7.1, 6.4, 5.4] },
    t: { at: [11, -12], len: [18, 15, 12], w: [12.5, 10.5, 9.2, 7.8] },
  };
  const PALM = [[-12, 2], [12, 2], [17, -10], [19, -26], [17, -42], [12, -49], [3, -52], [-6, -50], [-14, -45], [-17, -36], [-17, -16]];
  const DEF = { t: [48, 10, 10, 5], i: [4, 5, 5, 5], m: [0, 5, 5, 5], r: [4, 5, 5, 5], p: [9, 5, 5, 5] };
  return { BASE, PALM, DEF, deg };
})();

// a finger: a capsule from its base to a rounded tip, widths w0 → w1
function biCaps(P0, P1, w0, w1, n = 10) {
  const dx = P1[0] - P0[0], dy = P1[1] - P0[1], l = Math.hypot(dx, dy), ux = dx / l, uy = dy / l, nx = -uy, ny = ux, out = [];
  out.push([P0[0] + nx * w0 / 2, P0[1] + ny * w0 / 2], [P1[0] + nx * w1 / 2 - ux * w1 * .2, P1[1] + ny * w1 / 2 - uy * w1 * .2]);
  for (let i = 1; i < n; i++) { const a = Math.PI * i / n; out.push([P1[0] - ux * w1 * .2 + (nx * Math.cos(a) + ux * Math.sin(a)) * w1 / 2, P1[1] - uy * w1 * .2 + (ny * Math.cos(a) + uy * Math.sin(a)) * w1 / 2]); }
  out.push([P1[0] - nx * w1 / 2 - ux * w1 * .2, P1[1] - ny * w1 / 2 - uy * w1 * .2], [P0[0] - nx * w0 / 2, P0[1] - ny * w0 / 2]);
  return out;
}

function biHandRig(c, o) {
  const B = BI, K = Object.assign({ skin: '#8F8DE2', skinS: '#625AB8', skinD: '#3D3288', skinH: '#B7B9F4', nail: '#C9C7F6', gold: '#E3AF4C', goldS: '#A8661F', goldH: '#FFE7A3', red: '#C7302B' }, o.pal || {});
  const { BASE, PALM, DEF, deg } = BH, k = o.k || 1, fl = o.flip ? -1 : 1, ca = Math.cos(o.ang || 0), sa = Math.sin(o.ang || 0);
  const view = o.view || 'palm', nz = view === 'palm' ? 1 : -1, lw = (o.lw ?? 1.5) * k;
  // hand space (x, y, z) → caller units
  const P = ([x, y, z = 0]) => { const px = (x + z * .12) * fl * k, py = (y + z * .42) * k; return [o.x + px * ca - py * sa, o.y + px * sa + py * ca]; };
  const F = Object.assign({}, DEF, o.f || {});
  // the bones of each finger, in 3D
  const bones = {};
  for (const key of ['t', 'i', 'm', 'r', 'p']) {
    const b = BASE[key], [sp, ...cu] = F[key], s = sp * deg * (key === 't' ? 1 : 1);
    const d0 = [(key === 't' ? 1 : -1) * Math.sin(s), -Math.cos(s), 0];   // spread: + is away from the middle finger (the thumb: out)
    // fingers curl toward the palm; the thumb curls across it
    const m = key === 't' ? (() => { const v = [-.8, 0, .6 * nz]; const l = Math.hypot(...v); return v.map(x => x / l); })() : [0, 0, nz];
    let j = [b.at[0], b.at[1], 0], th = 0; const out = [];
    for (let q = 0; q < 3; q++) {
      th += cu[q] * deg;
      const d = d0.map((v, a) => v * Math.cos(th) + m[a] * Math.sin(th));
      const e = j.map((v, a) => v + d[a] * b.len[q]);
      const back = d0.map((v, a) => -(m[a] * Math.cos(th) - v * Math.sin(th)));   // the finger's back (nail side)
      out.push({ a: j, b: e, w0: b.w[q], w1: b.w[q + 1], th, d, backZ: back[2] });
      j = e;
    }
    bones[key] = out;
  }
  if (o.dry) return { tip: key => P(bones[key][2].b), P };
  const caps = (bn, grow = 0, dx = 0, dy = 0) => biCaps(P(bn.a).map((v, a) => v + (a ? dy : dx)), P(bn.b).map((v, a) => v + (a ? dy : dx)), bn.w0 * k + grow, bn.w1 * k + grow);
  const palmPts = PALM.map(p => P(p));
  const shift = [lw * .45 * (o.flip ? -1 : 1) * 0 + lw * .45, lw * .35];   // ink falls heavier on the lower right
  const drawFinger = key => {
    const bs = bones[key];
    // cast shadow on the palm from a finger curled over it
    if (view === 'palm' && key !== 't' && bs[0].th > 40 * deg) B.clip(c, palmPts, () => bs.forEach(bn => B.fill(c, caps(bn, 0, 5 * k * .35, 7 * k * .35), K.skinD, { straight: true })));
    bs.forEach(bn => B.fill(c, caps(bn, lw * 2, shift[0], shift[1]), B.ink, { straight: true }));
    bs.forEach(bn => B.fill(c, caps(bn, lw * .2), K.skin, { straight: true }));
    // shade the finger as one form: its union, the darker bones, then a shadow down the lower-right side
    const U = new Path2D(); bs.forEach(bn => U.addPath(B.pathL(caps(bn))));
    const isDark = bn => view === 'palm' ? bn.th > 100 * deg : bn.th > 70 * deg;
    B.clip(c, U, () => {
      bs.forEach(bn => { if (isDark(bn)) B.fill(c, caps(bn, 1), K.skinS, { straight: true }); });
      bs.forEach(bn => B.fill(c, caps(bn, 0, bn.w0 * k * .42, bn.w0 * k * .3), isDark(bn) ? K.skinD : K.skinS, { straight: true }));
      const lit = bs.filter(bn => !isDark(bn));
      if (lit.length) { const pts = [P(lit[0].a), ...lit.map(bn => P(bn.b))].map(([x, y], q) => [x - lit[0].w0 * k * .24, y - lit[0].w0 * k * .1]); B.stroke(c, pts, { w: 1.4 * k, col: K.skinH, a: .25, b: .45 }); }
    });
    bs.forEach((bn, q) => {
      // the joint: a crease on the palm side, wrinkles on the back
      if (q > 0) {
        const a = P(bn.a), prev = bs[q - 1], dA = P(prev.a), dir = [a[0] - dA[0], a[1] - dA[1]], l = Math.hypot(...dir) || 1, nx = -dir[1] / l, ny = dir[0] / l, w = bn.w0 * k * .3;
        if (l > bn.w0 * k * .45) B.stroke(c, [[a[0] - nx * w, a[1] - ny * w], [a[0] + nx * w, a[1] + ny * w]], { w: .9 * k, a: .3, b: .3, jit: 0 });
        if (view === 'back' && l > bn.w0 * k * .45) B.stroke(c, [[a[0] - nx * w * .6 + dir[0] / l * 2 * k, a[1] - ny * w * .6 + dir[1] / l * 2 * k], [a[0] + nx * w * .6 + dir[0] / l * 2 * k, a[1] + ny * w * .6 + dir[1] / l * 2 * k]], { w: .7 * k, a: .3, b: .3, jit: 0 });
      }
    });
    // the nail, when the fingertip's back turns to us
    const tip = bs[2];
    if (tip.backZ > .2) {
      const a = P(tip.a), b = P(tip.b), dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy);
      if (l > tip.w1 * k * .35) {
        const ux = dx / l, uy = dy / l, cx = b[0] - ux * Math.min(l * .45, tip.w1 * k * .55), cy = b[1] - uy * Math.min(l * .45, tip.w1 * k * .55);
        const hw = tip.w1 * k * .3, hl = Math.min(l * .35, tip.w1 * k * .5);
        const N = [[cx - uy * hw - ux * hl, cy + ux * hw - uy * hl], [cx - uy * hw + ux * hl * .8, cy + ux * hw + uy * hl * .8], [cx + ux * hl * 1.1, cy + uy * hl * 1.1], [cx + uy * hw + ux * hl * .8, cy - ux * hw + uy * hl * .8], [cx + uy * hw - ux * hl, cy - ux * hw - uy * hl]];
        B.fill(c, N, K.nail); B.stroke(c, N, { closed: true, w: .8 * k, jit: 0 });
        B.stroke(c, [[cx - uy * hw * .4 - ux * hl * .4, cy + ux * hw * .4 - uy * hl * .4], [cx - uy * hw * .4 + ux * hl * .3, cy + ux * hw * .4 + uy * hl * .3]], { w: .8 * k, col: '#FFFFFF', a: .3, b: .3 });
      }
    }
    // rings wrap round their bone
    if (o.rings && o.rings[key] != null) {
      const bn = bs[o.rings[key]], C = caps(bn), a = P(bn.a), b = P(bn.b), mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
      const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, ux = dx / l, uy = dy / l, w = bn.w0 * k * .75;
      const band = t => [[mx - uy * w + ux * t, my + ux * w + uy * t], [mx + ux * (t - 1.2 * k), my + uy * (t - 1.2 * k)], [mx + uy * w + ux * t, my - ux * w + uy * t]];
      B.clip(c, C, () => {
        B.stroke(c, band(0), { w: 4.6 * k, col: K.gold, a: 0, b: 0, jit: 0 });
        B.stroke(c, band(0).map(([x, y]) => [x + 1.2 * k, y + 1 * k]), { w: 1.4 * k, col: K.goldS, a: 0, b: 0, jit: 0 });
        B.stroke(c, band(-1.8 * k), { w: .8 * k, a: 0, b: 0, jit: 0 }); B.stroke(c, band(1.8 * k), { w: .8 * k, a: 0, b: 0, jit: 0 });
        B.stroke(c, band(-.6 * k).slice(0, 2), { w: .9 * k, col: K.goldH, a: .2, b: .4 });
      });
    }
  };
  const drawPalm = () => {
    B.fill(c, palmPts.map(([x, y]) => [x + shift[0], y + shift[1]]), B.ink);
    B.stroke(c, palmPts, { closed: true, w: lw * 2.2, jit: .15 });
    B.fill(c, palmPts, K.skin);
    B.clip(c, palmPts, () => {
      if (view === 'palm') {
        // the heel of the hand and the mound under the thumb take the shade; the palm's lines
        B.fill(c, [[-19, -24], [-8, -14], [-6, 4], [-20, 4]].map(p => P(p)), K.skinS);
        B.stroke(c, [[16, -40], [4, -30], [-2, -16], [0, 0]].map(p => P(p)), { w: .9 * k, a: .3, b: .3 });
        B.stroke(c, [[-18, -38], [-4, -40], [10, -44]].map(p => P(p)), { w: .8 * k, a: .3, b: .4 });
      } else {
        B.fill(c, [[-19, -46], [-8, -40], [-10, 0], [-20, 0]].map(p => P(p)), K.skinS);
        for (const key of ['i', 'm', 'r', 'p']) { const a = BASE[key].at; B.stroke(c, [[a[0] * .4, -8], [a[0] * .8, -30], [a[0], a[1] + 4]].map(p => P(p)), { w: .9 * k, col: K.skinS, a: .3, b: .4 }); }
        B.stroke(c, [[16, -30], [8, -36], [2, -38]].map(p => P(p)), { w: 1.4 * k, col: K.skinH, a: .3, b: .4 });
      }
    });
  };
  const order = view === 'palm' ? ['palm', 'p', 'r', 'm', 'i', 't'] : ['t', 'palm', 'p', 'r', 'm', 'i'];
  // in the back view, a finger curled away from us goes behind the palm
  if (view === 'back') for (const key of ['p', 'r', 'm', 'i']) if (bones[key][0].th > 60 * deg) { order.splice(order.indexOf(key), 1); order.unshift(key); }
  order.forEach(kk => { if (kk === 'palm') { drawPalm(); if (o.afterPalm) o.afterPalm(); } else drawFinger(kk); });
  return { tip: key => P(bones[key][2].b), P };
}

// the rig's poses on one page, to check them
function biHandSheet(c, R) {
  c.fillStyle = '#EDE6F7'; c.fillRect(R.x, R.y, R.w, R.h);
  const poses = [
    { view: 'palm', f: {} },
    { view: 'palm', ang: .35, f: { t: [38, 18, 22, 18], i: [4, 12, 34, 22], m: [0, 48, 62, 36], r: [4, 58, 66, 36], p: [9, 66, 66, 34] }, rings: { i: 0, m: 0, r: 0 } },
    { view: 'palm', f: { t: [62, 0, -10, -15], i: [12, -8, -10, -6], m: [2, -10, -12, -6], r: [8, -8, -10, -6], p: [18, -6, -8, -6] } },
    { view: 'back', f: { t: [30, 40, 40, 20], i: [3, 72, 76, 38], m: [0, 74, 80, 40], r: [3, 76, 80, 40], p: [7, 78, 80, 40] }, rings: { m: 0 } },
    { view: 'back', ang: -.3, f: { t: [52, 8, 10, 8], i: [10, 10, 15, 10], m: [1, 12, 16, 10], r: [7, 14, 18, 10], p: [15, 18, 20, 12] } },
    { view: 'palm', flip: true, ang: -.4, f: { t: [38, 18, 22, 18], i: [4, 12, 34, 22], m: [0, 48, 62, 36], r: [4, 58, 66, 36], p: [9, 66, 66, 34] } },
  ];
  poses.forEach((p, n) => biHandRig(c, { x: R.x + 180 + (n % 3) * 330, y: R.y + 420 + Math.floor(n / 3) * 520, k: 2.8, ang: 0, ...p }));
}
