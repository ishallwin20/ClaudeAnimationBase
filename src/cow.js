// cow.js: the cows and calves of Vraja, Krishna's herd (cow(), calf: 1 for a calf). Not Nandi's rig: a soft, round
// gentle cow in side view with her face turned three-quarters toward us: big glossy lashed eyes with a heavy kind lid,
// a pink-beige muzzle, rosy cheeks, ears that stick out sideways, short lyre horns painted with a coloured band and gold
// tips (as Vraja paints them for Gopashtami), a little hump and dewlap, a long tail with a dark tuft, slender legs, a
// red cord with a brass bell. The calf is short and leggy with a big head, knobbly knees, a fuzzy forelock, horn nubs.
// Load after bappa.js (U()) and clawd.js (tintCols(), emote()); bal_krishna.js too if you use o.feather.
// (x, y) is the ground under the middle of her body; u is the size unit. She faces screen-right; flip: true faces left.
//   cow:  about 14u nose to tail, 8.6u to the back, 13.5u to the horn tips
//   calf: about 11u nose to tail, 7u to the back, 11u to the forelock
//
// Body-local coordinates in u (y up is negative), cow (calf in COW_SHAPE.calf):
//   hooves at y 0 · belly -3 · back -8.6 · hump (3.4, -9.5) · neck root (4.9, -7.2) · head centre (7.4, -9.9)
//   head-local (origin the head centre, drawn ×hs): eyes (-.55, -.25) near / (1.15, -.35) far · muzzle (.45, 1.55) ·
//   horns from (∓.9, -1.8) · ears from (-1.6, -1.1) / (1.6, -1.3)
//
// Options (all optional):
//   pose:   walk (phase: legs step in diagonal pairs, the body bobs), graze 0..1 (the neck lowers, the muzzle to the
//           grass), lift (-1..1: the head raises, + up), hop 0..1 (a calf's frisky jump: up, hind legs kick), dx, dy, sq,
//           rot, flip
//   parts:  ear / earL / earR (radians, a flick), tail (-1..1; default a slow swish), tailSpeed, bell (radians, its
//           swing; default follows the walk), bellOn (false: no cord or bell), horns (false), hornBand (a colour)
//   face:   eyes ('normal' | 'happy' | 'closed' | 'wide' | 'heart' | 'sleepy'), lookX / lookY (-1..1), seed (blink timing),
//           mouth ('smile' | 'chew' | 'moo' | 'tongue' | 'flat'), mouthK (0..1, for moo), blush 0..1 (default .6)
//   look:   coat: a COWS key ('gauri' cream with caramel patches · 'kapila' golden tan · 'shyama' ash grey ·
//           'dhavala' pure white · 'krishna' dark brown with a white blaze), or pal (overrides COW_C), patches (false)
//   clues:  tilak 0..1 (a white Vaishnava U with a red line on the forehead), feather 0..1 (a peacock feather tucked
//           behind her near ear: needs bal_krishna.js)
//   extras: tint + tintK, emote + emoteK + emoteAge, boilKey, noShadow, swMul
// Helpers: cowHead / cowMuzzle / cowHoof(x, y, u, o[, i]) / cowBack → world points through the same pose.
const COW_C = {
  body: '#FBF1E1', shade: '#E2CDB6', far: '#E8D9C6', patch: '#D99A5B', patchDk: '#B9773D', ink: '#4A3230',
  muzzle: '#F2C3B0', muzzleDk: '#D99A8A', nostril: '#6A3A3A', cheek: '#F29AA0', ear: '#F2ADA6', hoof: '#5A4440',
  horn: '#F3E3C2', hornDk: '#CDB58A', band: '#D2452F', gold: '#EDB43C', goldDk: '#B67D1C', goldLt: '#FFE39A',
  cord: '#D2452F', cordDk: '#9E2E22', eye: '#2A1A1E', white: '#FFFDF6', tuft: '#6B4A3A', tongue: '#E8838E',
  tilak: '#FFF6E6', tilakRed: '#E2452B',
};
const COWS = {
  gauri: {},
  kapila: { body: '#E9B77A', shade: '#C9915A', far: '#D3A06A', patch: '#F7E3C4', patchDk: '#E2C29A', tuft: '#8A5A34' },
  shyama: { body: '#D8D6D2', shade: '#AFAAA6', far: '#BDB8B3', patch: '#9A948F', patchDk: '#7A746F', tuft: '#4A4440', muzzle: '#E3B7AE' },
  dhavala: { body: '#FFF8EC', shade: '#E5DCD0', far: '#ECE3D6', patch: '#FFF8EC', patchDk: '#E5DCD0', ear: '#F6BDB4' },
  krishna: { body: '#8A5A42', shade: '#6A4230', far: '#734A36', patch: '#FBF1E1', patchDk: '#E2CDB6', tuft: '#3A2620', muzzle: '#E0A898', ear: '#D88F86', horn: '#E8D6B4' },
};

// the two body plans: outline, legs ([hip x, walk phase, front]), neck, head, graze target, tail root, patches
const COW_SHAPE = {
  cow: {
    body: [[-4.4, -8.5], [-5.1, -7.9], [-5.45, -6.6], [-5.15, -5.0], [-4.2, -3.9], [-2.6, -3.25], [-.5, -2.95], [1.6, -3.0], [3.2, -3.4], [4.3, -4.4], [4.8, -5.8], [4.9, -7.2], [4.4, -8.4], [3.4, -9.2], [2.5, -9.5], [1.6, -9.1], [0, -8.6], [-2.2, -8.45], [-3.6, -8.6]],
    shadeBelly: [[-4.9, -4.8], [-4, -3.75], [-2, -3.15], [1, -3.1], [3.6, -3.7], [2.4, -4.4], [0, -4.1], [-3, -4.4]],
    haunch: [[-3.1, -7.7], [-2.35, -6], [-2.75, -4.3]], shoulder: [[2.7, -8.5], [3.05, -6.4], [2.6, -4.3]],
    legs: [[-3.4, .5, 0], [2.6, 0, 1], [-2.6, 0, 0], [3.4, .5, 1]], hipY: -4.7, legW: [1.55, .78],
    neck0: [3.4, -7.4], head: [6.1, -9.95], graze: [7.4, -2.65], hs: 1, neckW: [3.7, 2.5], tail0: [-5.1, -7.9], tailL: 1,
    patches: [[-3.9, -7.0, 1.15, 1.0, 1], [.2, -6.4, 1.45, 1.25, 2], [2.9, -8.2, .7, .55, 3]],
    hump: [[1.4, -9.05], [2.5, -9.5], [3.5, -9.15]], dewlap: true,
  },
  calf: {
    body: [[-3.0, -7.3], [-3.6, -6.8], [-3.8, -5.9], [-3.5, -4.9], [-2.6, -4.35], [-.8, -4.1], [1.0, -4.15], [2.4, -4.45], [3.2, -5.2], [3.5, -6.3], [3.2, -7.1], [2.3, -7.5], [.6, -7.25], [-1.6, -7.15], [-2.4, -7.3]],
    shadeBelly: [[-3.5, -5.0], [-2.6, -4.45], [-.8, -4.2], [1.0, -4.25], [2.6, -4.7], [1.6, -5.0], [0, -4.85], [-2.4, -5.0]],
    haunch: [[-2.3, -6.7], [-1.8, -5.6], [-2.1, -4.6]], shoulder: null,
    legs: [[-2.5, .5, 0], [2.0, 0, 1], [-1.9, 0, 0], [2.6, .5, 1]], hipY: -5.0, legW: [1.2, .62],
    neck0: [2.4, -6.7], head: [4.4, -9.0], graze: [5.5, -2.55], hs: 1, neckW: [2.7, 1.95], tail0: [-3.6, -6.9], tailL: .7,
    patches: [[-2.6, -6.2, .8, .7, 4], [.9, -5.9, .85, .8, 5]],
    hump: null, dewlap: false,
  },
};
// an organic coat patch: an irregular blob round (cx, cy), the same every frame
function cowPatch(cx, cy, rx, ry, k) {
  const n = 11, P = [];
  for (let i = 0; i < n; i++) { const a = i / n * TAU + hash(k * 3.1) * 2, r = .72 + .5 * hash(k * 7.3 + i * 1.7); P.push([cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r]); }
  return P;
}

function cowShape(o) { return o.calf ? COW_SHAPE.calf : COW_SHAPE.cow; }
// the body's bob, hop height and tilt (about the middle of the back)
function cowPose(o) {
  const hop = clamp(o.hop || 0), s = Math.sin(Math.PI * hop);
  const bob = o.walk == null ? 0 : -Math.abs(Math.sin(o.walk * TAU * 2)) * .1;
  return { bob: bob - s * 2.4, ang: hop > 0 ? -.12 * Math.cos(Math.PI * hop) * s * 1.6 : 0, hop, hs: s };
}
function cowLocal(o, lx, ly) {
  const { bob, ang } = cowPose(o), px = lx, py = ly + 5;
  return [px * Math.cos(ang) - py * Math.sin(ang), -5 + px * Math.sin(ang) + py * Math.cos(ang) + bob];
}
function cowOut(x, y, u, o, bx, by) {
  const sq = o.sq || 0, px = (o.flip ? -1 : 1) * (1 + sq * .6) * bx * u, py = (1 - sq) * by * u, r = o.rot || 0;
  return [x + (o.dx || 0) * u + px * Math.cos(r) - py * Math.sin(r), y + (o.dy || 0) * u + px * Math.sin(r) + py * Math.cos(r)];
}
// where the head centre sits (body-local, before the tilt) and its rotation: rest → graze, lift raises it
function cowHeadAt(o) {
  const S = cowShape(o), g = ease(clamp(o.graze || 0)), lf = clamp(o.lift || 0, -1, 1);
  const n = S.neck0, h0 = [S.head[0] - lf * .4, S.head[1] - lf * .7], h1 = S.graze;
  // an arc: out and down, not a straight slide
  const mid = [lerp(h0[0], h1[0], .5) + 1.0, lerp(h0[1], h1[1], .5) - .2];
  const a = lerp(h0[0], mid[0], g), b = lerp(mid[0], h1[0], g), c = lerp(h0[1], mid[1], g), d = lerp(mid[1], h1[1], g);
  return { c: [lerp(a, b, g), lerp(c, d, g)], rot: g * .38 - lf * .12, n };
}
function cowWorld(x, y, u, o, lx, ly) { const [bx, by] = cowLocal(o, lx, ly); return cowOut(x, y, u, o, bx, by); }
function cowHeadPt(x, y, u, o, hx, hy) {
  const H = cowHeadAt(o), hs = cowShape(o).hs, r = H.rot;
  return cowWorld(x, y, u, o, H.c[0] + (hx * Math.cos(r) - hy * Math.sin(r)) * hs, H.c[1] + (hx * Math.sin(r) + hy * Math.cos(r)) * hs);
}
const cowHead = (x, y, u, o = {}) => cowHeadPt(x, y, u, o, 0, 0);
const cowMuzzle = (x, y, u, o = {}) => cowHeadPt(x, y, u, o, .45, 1.6);
const cowBack = (x, y, u, o = {}) => cowWorld(x, y, u, o, o.calf ? -.5 : -1, o.calf ? -7.4 : -8.6);
function cowLeg(o, i) {
  const S = cowShape(o), [lx, ph, front] = S.legs[i], { bob, hop, hs } = cowPose(o);
  const hip = cowLocal(o, lx, S.hipY);
  let fx = lx, fy = 0;
  if (o.walk != null) { const a = (o.walk + ph) * TAU; fx += Math.sin(a) * (o.calf ? .8 : 1.0); fy = -Math.max(0, Math.cos(a)) * .5; }
  if (hop > 0) { fx += front ? hs * .9 : -hs * 1.6; fy = bob * (front ? .55 : .35) - hs * (front ? .6 : .9); }
  const L = Math.hypot(hip[0] - fx, hip[1] - fy);
  const kneeK = front ? .52 : .5, bend = front ? .18 : -.75;   // front knees forward a touch, hind hocks back
  const knee = [lerp(hip[0], fx, kneeK) + bend * (1 + (hop > 0 ? hs : 0)) * Math.min(1, 4.6 / L), lerp(hip[1], fy, kneeK)];
  return [hip, knee, [fx, fy]];
}
const cowHoof = (x, y, u, o = {}, i = 1) => { const [, , h] = cowLeg(o, i); return cowOut(x, y, u, o, h[0], h[1]); };
// the two side edges of a ribbon along P (for an outline without end caps)
function cowEdges(P, w0, w1) {
  const L = [], R = [];
  P.forEach((p, i) => {
    const a = P[Math.max(0, i - 1)], b = P[Math.min(P.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1;
    const w = lerp(w0, w1, i / (P.length - 1)) / 2;
    L.push([p[0] - dy / d * w, p[1] + dx / d * w]); R.push([p[0] + dy / d * w, p[1] - dx / d * w]);
  });
  return [L, R];
}

function cow(x, y, u, o = {}) {
  const id = o.boilKey ?? 'cow' + (++CLAWD_N), rs = p => boilSeed(`cow ${id} ${p}`);
  const C = { ...COW_C, ...(COWS[o.coat] || {}), ...(o.pal || {}) }, S = cowShape(o), calf = !!o.calf;
  const sq = o.sq || 0, sw = clamp(u / 20, .4, 2) * (o.swMul || 1), J = u * .025, INK = C.ink;
  const { col, dk } = tintCols({ tint: o.tint, tintK: o.tintK, col: C.body, dk: C.shade, lt: C.white });
  const far = o.tint ? mixCol(C.far, dk, .4) : C.far;
  const P = pts => U(pts, u), pose = cowPose(o), H = cowHeadAt(o), hs = S.hs;
  const walkSw = o.walk == null ? 0 : Math.sin(o.walk * TAU * 2) * .25;

  if (!o.noShadow) { rs('shadow'); const f = 1 - pose.hs * .35; paint(ellPts(x + (o.dx || 0) * u + u * .4 * (o.flip ? -1 : 1), y + u * .12, u * (calf ? 5.4 : 7.6) * f, u * .95 * f, 24), { fill: PAL.ink, fillOp: 70 * f, bleed: .2, tex: .3, border: .1, ink: null }); }
  push();
  translate(x + (o.dx || 0) * u, y + (o.dy || 0) * u);
  if (o.rot) rotate(o.rot);
  scale((o.flip ? -1 : 1) * (1 + sq * .6), 1 - sq);
  const tilt = f => { push(); translate(0, (-5 + pose.bob) * u); rotate(pose.ang); translate(0, 5 * u); f(); pop(); };
  const leg = (i, c) => {
    rs('leg' + i);
    const [hip, knee, hoof] = cowLeg(o, i), [w0, w1] = S.legW, top = [hoof[0], hoof[1] - .45];
    paint(ribbon(P([hip, knee, top]), w0 * u, w1 * u), { wash: c, ink: INK, sw: sw * .75, curv: .3 });
    const hw = w1 * .62;
    paint(P([[hoof[0] - hw, hoof[1] - .5], [hoof[0] + hw, hoof[1] - .5], [hoof[0] + hw + .12, hoof[1]], [hoof[0] - hw - .05, hoof[1]]]), { wash: C.hoof, ink: INK, sw: sw * .55 });
    inkLine(P([[hoof[0] + .1, hoof[1] - .25], [hoof[0] + .14, hoof[1]]]), sw * .4, C.white, 'inkfine', 0);   // the cleft
  };

  // ---- behind: the tail, the far legs
  tilt(() => {
    rs('tail');
    const ts = o.tail ?? Math.sin(T * (o.tailSpeed || 1.7) + (o.seed || 0)) * .6, L = S.tailL, t0 = S.tail0;
    const tail = [t0, [t0[0] - .7 * L, t0[1] + 1.4 * L], [t0[0] - .55 * L + ts * .6, t0[1] + 3.0 * L], [t0[0] - .3 * L + ts * 1.3, t0[1] + 4.3 * L]];
    paint(ribbon(P(through(tail, 4)), .42 * u, .22 * u), { wash: col, ink: INK, sw: sw * .6 });
    const tp = tail[3];
    paint(P([[tp[0] - .3, tp[1] - .3], [tp[0] + .3, tp[1] - .3], [tp[0] + .45 + ts * .2, tp[1] + .9], [tp[0] + ts * .3, tp[1] + 1.35], [tp[0] - .4 + ts * .2, tp[1] + .9]]), { wash: C.tuft, ink: INK, sw: sw * .45, curv: .6 });
  });
  leg(2, far); leg(3, far); leg(0, col); leg(1, col);   // all four under the body: it hides their tops

  // the head's world transform (body-local), for the neck and the head
  const headT = f => { push(); translate(H.c[0] * u, H.c[1] * u); rotate(H.rot); scale(hs); f(); pop(); };
  const Hp = (hx, hy) => [H.c[0] + (hx * Math.cos(H.rot) - hy * Math.sin(H.rot)) * hs, H.c[1] + (hx * Math.sin(H.rot) + hy * Math.cos(H.rot)) * hs];

  tilt(() => {
    // ---- the far horn and ear, behind everything on the head
    headT(() => {
      rs('farear');
      push(); translate(1.55 * u, -1.25 * u); rotate(-(o.earR ?? o.ear ?? 0) - Math.sin(T * 1.3 + (o.seed || 0)) * .04);
      const el = calf ? 1.2 : 1;
      paint(U([[0, -.35], [.9 * el, -.6], [1.6 * el, -.3], [1.75 * el, .05], [1.0 * el, .35], [0, .35]], u), { wash: far, ink: INK, sw: sw * .7, curv: .5 });
      paint(U([[.3, -.15], [1.0 * el, -.3], [1.45 * el, -.05], [.9 * el, .15]], u), { wash: C.ear, washOp: 200, ink: null, curv: .5 });
      pop();
      if (o.horns !== false && !calf) {
        rs('farhorn');
        const hp = [[.85, -1.75], [1.35, -2.6], [1.55, -3.25], [1.25, -3.75]];
        paint(ribbon(U(through(hp, 3), u), .55 * u, .16 * u), { wash: C.hornDk, ink: INK, sw: sw * .6 });
        paint(ribbon(U([[1.42, -2.85], [1.5, -3.15]], u), .44 * u, .4 * u), { wash: o.hornBand || C.band, washOp: 210, ink: null });
        paint(ellPts(1.25 * u, -3.75 * u, .14 * u, .14 * u, 7), { wash: C.goldDk, ink: INK, sw: sw * .35 });
      }
    });

    // ---- the body: one outline, its belly shade, the patches, the hump
    rs('body');
    const body = P(S.body);
    paint(body, { wash: col, ink: null, curv: .5 });
    if (o.patches !== false) for (const [k, pp] of S.patches.entries()) { rs('patch' + k); paint(P(cowPatch(...pp)), { wash: C.patch, fill: C.patchDk, fillOp: 40, tex: .5, ink: null, curv: .6 }); }
    rs('bodyshade');
    paint(P(S.shadeBelly), { fill: dk, fillOp: 110, bleed: .1, tex: .5, border: .4, ink: null, curv: .5 });
    paint(body, { ink: INK, sw, curv: .5 });
    if (S.hump) inkLine(P(S.hump), sw * .45, dk, 'inkfine', .5);
    inkLine(P(S.haunch), sw * .55, dk, 'inkfine', .5);   // the haunch over the hind leg
    if (S.shoulder) inkLine(P(S.shoulder), sw * .45, dk, 'inkfine', .5);

    // ---- the neck: a tapered ribbon from the shoulder to the head, outlined along its sides only
    rs('neck');
    const nTop = Hp(-.6, -.6), nBot = Hp(-.2, 1.0), n0 = S.neck0;
    const NP = through([n0, [lerp(n0[0], H.c[0], .5) + (o.graze ? .3 : -.1), lerp(n0[1], H.c[1], .5) - .1], [lerp(nTop[0], nBot[0], .5), lerp(nTop[1], nBot[1], .5)]], 4);
    paint(ribbon(P(NP), S.neckW[0] * u, S.neckW[1] * u), { wash: col, ink: null });
    const [eL, eR] = cowEdges(NP, S.neckW[0], S.neckW[1]);
    inkLine(P(eL.slice(1)), sw, INK, 'ink', .5); inkLine(P(eR.slice(1)), sw, INK, 'ink', .5);
    if (S.dewlap) {
      rs('dewlap');
      const a = eL[1], b = eL[Math.min(eL.length - 1, 3)], m = [(a[0] + b[0]) / 2 + .2, (a[1] + b[1]) / 2 + .7];
      paint(P([a, m, b, [b[0] - .1, b[1] - .2], [a[0] + .1, a[1] - .2]]), { wash: col, ink: null, curv: .6 });
      inkLine(P(through([a, m, b], 3)), sw * .7, INK, 'ink', .5);
      inkLine(P([[m[0] - .2, m[1] - .55], [m[0], m[1] - .15]]), sw * .4, dk, 'inkfine', 0);
    }

    // ---- the cord and bell round the neck
    if (o.bellOn !== false) {
      rs('cord');
      const k = 2, cp = NP[k], ca = eL[k], cb = eR[k];
      inkLine(P([ca, [cp[0] + .15, cp[1] + .1], cb]), sw * 2.2, C.cord, 'ink', .6);
      const bA = (o.bell ?? walkSw) + Math.sin(T * 2.1 + (o.seed || 0)) * .05, bp = ca;
      rs('bell');
      push(); translate(bp[0] * u, bp[1] * u); rotate(bA - H.rot * .5);
      const bs = calf ? .8 : 1;
      paint(U([[-.5, 1.0], [-.42, .25], [0, -.05], [.42, .25], [.5, 1.0]].map(([a, b]) => [a * bs, b * bs]), u), { wash: C.gold, fill: C.goldDk, fillOp: 60, tex: .4, ink: INK, sw: sw * .55, curv: .35 });
      paint(ellPts(0, 1.08 * bs * u, .16 * bs * u, .16 * bs * u, 8), { wash: C.goldDk, ink: INK, sw: sw * .35 });
      paint(ellPts(-.18 * bs * u, .45 * bs * u, .1 * bs * u, .22 * bs * u, 6), { wash: C.goldLt, washOp: 200, ink: null });
      pop();
    }
  });

  // ---- the head
  tilt(() => headT(() => {
    const Hd = pts => U(pts, u);
    // the near horn behind the head's top edge
    if (o.horns !== false && !calf) {
      rs('horn');
      const hp = [[-.9, -1.7], [-1.45, -2.55], [-1.65, -3.25], [-1.3, -3.8]];
      paint(ribbon(Hd(through(hp, 3)), .62 * u, .18 * u), { wash: C.horn, fill: C.hornDk, fillOp: 50, tex: .4, ink: INK, sw: sw * .65 });
      paint(ribbon(Hd([[-1.52, -2.85], [-1.6, -3.18]]), .5 * u, .44 * u), { wash: o.hornBand || C.band, ink: null });
      paint(ellPts(-1.3 * u, -3.8 * u, .16 * u, .16 * u, 7), { wash: C.gold, ink: INK, sw: sw * .35 });
    }
    if (calf) {   // horn nubs
      rs('nubs');
      for (const s of [-1, 1]) paint(ellPts(s * .85 * u + .1 * u, -1.85 * u, .28 * u, .22 * u, 8), { wash: C.horn, ink: INK, sw: sw * .45 });
    }
    rs('head');
    const head = Hd([[-1.5, -1.55], [-.5, -2.02], [.7, -2.02], [1.6, -1.55], [1.95, -.6], [1.85, .35], [2.05, 1.15], [1.75, 2.0], [.6, 2.45], [-.6, 2.25], [-1.15, 1.6], [-1.5, .65], [-1.8, -.4]]);
    paint(head, { wash: col, ink: null, curv: .55 });
    const coat = C.patch !== C.body && o.patches !== false;
    if (coat) { rs('headpatch'); paint(Hd([[-1.5, -1.5], [-.7, -1.95], [-.15, -1.75], [-.3, -1.25], [-.85, -1.05], [-1.35, -.95], [-1.75, -.55]]), { wash: C.patch, fill: C.patchDk, fillOp: 35, tex: .5, ink: null, curv: .6 }); }
    if (o.coat === 'krishna') { rs('blaze'); paint(Hd([[.1, -1.95], [.55, -1.95], [.6, -.6], [.5, .6], [.15, .7], [.1, -.6]]), { wash: C.patch, ink: null, curv: .6 }); }
    paint(Hd([[1.3, -1.2], [1.85, -.5], [1.8, .4], [1.4, .9], [1.45, -.2]]), { fill: dk, fillOp: 90, bleed: .1, tex: .4, ink: null, curv: .5 });   // the far cheek's shade
    paint(head, { ink: INK, sw: sw * .95, curv: .55 });
    // the forelock: a few curls between the horns (a fluffy tuft on a calf)
    rs('forelock');
    const fl = calf ? [[-.7, -1.7], [-.35, -2.55], [.1, -2.1], [.45, -2.65], [.75, -1.95], [1.0, -2.35], [1.0, -1.6], [.2, -1.5]] : [[-.45, -1.9], [-.15, -2.35], [.2, -2.05], [.5, -2.4], [.7, -1.9], [.1, -1.7]];
    paint(Hd(fl), { wash: coat ? C.patch : col, fill: dk, fillOp: 40, tex: .4, ink: INK, sw: sw * .55, curv: .6 });
    // the near ear, sticking out sideways, pink inside
    rs('ear');
    push(); translate(-1.6 * u, -1.1 * u); rotate((o.earL ?? o.ear ?? 0) + Math.sin(T * 1.1 + (o.seed || 0) * 2) * .05);
    const el = calf ? 1.25 : 1;
    paint(U([[0, -.4], [-.9 * el, -.75], [-1.75 * el, -.45], [-2.0 * el, 0], [-1.2 * el, .4], [0, .4]], u), { wash: col, ink: INK, sw: sw * .75, curv: .5 });
    paint(U([[-.3, -.2], [-1.0 * el, -.42], [-1.6 * el, -.15], [-1.05 * el, .18]], u), { wash: C.ear, ink: null, curv: .5 });
    pop();
    // the clue: a peacock feather tucked behind the near ear
    if (o.feather && typeof bkFeather === 'function') {
      rs('feather');
      push(); translate(-1.1 * u, -1.6 * u); rotate(-.75); scale(.55 * clamp(o.feather)); translate(-.2 * u, 4.95 * u);
      bkFeather(u, sw / .55, { ...BK, ink: INK }, T * .5 + (o.seed || 0));
      pop();
    }
    // the clue: a Vaishnava tilak on the forehead
    if (o.tilak) {
      rs('tilak');
      const k = clamp(o.tilak), tl = { wash: C.tilak, washOp: 255 * k, ink: null };
      paint(ribbon(Hd([[-.32, -1.75], [-.28, -1.15], [0, -.85]]), .17 * u, .12 * u), tl);
      paint(ribbon(Hd([[.72, -1.75], [.68, -1.15], [.4, -.85]]), .17 * u, .12 * u), tl);
      paint(ribbon(Hd([[.2, -1.7], [.2, -1.05]]), .13 * u, .09 * u), { wash: C.tilakRed, washOp: 255 * k, ink: null });
    }
    // cheeks
    const bl = o.blush ?? .6;
    if (bl > 0) { rs('cheeks'); paint(ellPts(-1.0 * u, .55 * u, .45 * u, .3 * u, 12), { fill: C.cheek, fillOp: 140 * bl, bleed: .25, ink: null }); paint(ellPts(1.55 * u, .45 * u, .28 * u, .26 * u, 10), { fill: C.cheek, fillOp: 120 * bl, bleed: .25, ink: null }); }
    // the muzzle, nostrils and mouth
    rs('muzzle');
    const mz = Hd([[-.85, 1.15], [-.2, .85], [.8, .82], [1.65, 1.0], [1.95, 1.55], [1.6, 2.15], [.6, 2.4], [-.5, 2.2], [-1.0, 1.7]]);
    paint(mz, { wash: C.muzzle, fill: C.muzzleDk, fillOp: 45, tex: .35, ink: INK, sw: sw * .65, curv: .55 });
    for (const [nx, ny, a] of [[-.08, 1.42, .5], [1.05, 1.38, -.4]]) {
      push(); translate(nx * u, ny * u); rotate(a);
      paint(ellPts(0, 0, .2 * u, .12 * u, 9), { wash: C.nostril, ink: null });
      pop();
    }
    const mk = o.mouth || 'smile', chew = mk === 'chew' ? Math.sin(T * 9 + (o.seed || 0)) : 0;
    if (mk === 'moo') {
      const k = .5 + .5 * clamp(o.mouthK ?? 1);
      paint(ellPts((.45 + 0) * u, 2.05 * u, .5 * k * u, .32 * k * u, 12), { wash: C.nostril, ink: INK, sw: sw * .5 });
      paint(ellPts(.5 * u, 2.2 * u, .3 * k * u, .12 * k * u, 10), { wash: C.tongue, ink: null });
    } else if (mk === 'flat') inkLine(Hd([[-.05, 1.98], [.95, 1.98]]), sw * .6, INK, 'inkfine', 0);
    else {
      inkLine(Hd([[-.1 + chew * .12, 1.86], [.45 + chew * .2, 2.04 + Math.abs(chew) * .05], [1.0 + chew * .12, 1.86]]), sw * .65, INK, 'inkfine', .5);
      if (mk === 'tongue') paint(Hd([[.3, 2.0], [.75, 1.98], [1.0, 1.55], [.95, 1.2], [.7, 1.35], [.6, 1.8]]), { wash: C.tongue, ink: INK, sw: sw * .45, curv: .5 });
    }
    // the eyes: big and glossy, a heavy kind lid, lashes
    rs('eyes');
    const kind = o.eyes || 'normal', blink = ((T * .7 + (o.seed || 0) * 1.37 + .5) % 4.1) < .13;
    for (const [ex, ey, rx, ry, s] of [[-.55, -.25, .62, .72, -1], [1.18, -.33, .44, .66, 1]]) {
      const X = ex * u, Y = ey * u;
      if (kind === 'happy' || kind === 'closed' || blink || kind === 'sleepy') {
        const c = kind === 'happy' ? -.32 : kind === 'sleepy' ? .05 : .22;
        inkLine([[X - rx * u, Y + .05 * u], [X, Y + c * u], [X + rx * u, Y + .05 * u]], sw * 1.1, C.eye, 'ink', .5);
        for (const k of [0, 1]) inkLine([[X + s * rx * (.55 + k * .35) * u, Y + (.02 + k * .03) * u], [X + s * rx * (.85 + k * .45) * u, Y - (.3 - k * .05) * u]], sw * .5, C.eye, 'inkfine', 0);
        continue;
      }
      const wide = kind === 'wide', R = wide ? 1.12 : 1;
      paint(ellPts(X, Y, rx * R * u, ry * R * u, 16), { wash: C.white, ink: C.eye, sw: sw * .55 });
      const lx = clamp(o.lookX ?? .15, -1, 1) * rx * .38 * u, ly = clamp(o.lookY ?? 0, -1, 1) * ry * .3 * u;
      if (kind === 'heart') paint(heartPts(X + lx, Y + ly + .05 * u, rx * .8 * u), { wash: C.band, ink: null });
      else {
        const pr = (wide ? .62 : .78);
        paint(ellPts(X + lx, Y + ly + .05 * u, rx * pr * u, ry * pr * u, 14), { wash: C.eye, ink: null });
        paint(ellPts(X + lx - rx * .28 * u, Y + ly - ry * .22 * u, rx * .27 * u, ry * .22 * u, 9), { wash: C.white, ink: null });
        paint(ellPts(X + lx + rx * .25 * u, Y + ly + ry * .3 * u, rx * .12 * u, ry * .1 * u, 7), { wash: C.white, washOp: 200, ink: null });
      }
      // the lid: a dome lower than the eye's top (a calm, kind half-lid on a cow; a calf's eyes are round and open)
      const lid = wide ? 1 : calf ? .9 : .66, dome = [];
      for (let i = 0; i <= 8; i++) { const a = Math.PI + i / 8 * Math.PI; dome.push([X + Math.cos(a) * rx * 1.03 * u, Y + Math.sin(a) * ry * lid * u]); }
      if (lid < 1) { const top = []; for (let i = 8; i >= 0; i--) { const a = Math.PI + i / 8 * Math.PI; top.push([X + Math.cos(a) * rx * 1.08 * u, Y + Math.sin(a) * ry * 1.1 * u]); } paint([...dome, ...top], { wash: col, ink: null }); }
      inkLine(dome, sw * 1.15, C.eye, 'ink', .6);
      for (const k of [0, 1, 2]) { const a = Math.PI * (s < 0 ? 1.12 + k * .12 : 1.88 - k * .12), bx = X + Math.cos(a) * rx * 1.03 * u, by = Y + Math.sin(a) * ry * lid * u; inkLine([[bx, by], [bx + s * (.3 + k * .05) * u, by - (.22 + k * .08) * u]], sw * .5, C.eye, 'inkfine', 0); }
    }
  }));
  pop();

  if (o.emote) {
    rs('emote');
    const [hx, hy] = cowHead(x, y, u, o);
    emote(o.emote, hx + (o.flip ? -1 : 1) * 1.6 * u, hy - 3.6 * u, u * 1.5, o.emoteK ?? 1, o.emoteAge ?? T);
  }
  rs('after');
}

// Model sheet: studio.html?loop=cow, or node render.mjs --loop=cow --sheet=0.5 --cols=1
(() => {
  LOOPS.cow = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: '#BFD8A8', ink: null });
    const vert = H > W, cw = vert ? W / 2 : W / 4, ch = vert ? H / 4 : H / 2;
    const cells = [
      { coat: 'gauri' }, { coat: 'kapila', walk: t * .9, eyes: 'happy' }, { coat: 'shyama', graze: .5 + .5 * Math.sin(t * 1.6), mouth: 'chew' },
      { coat: 'dhavala', mouth: 'moo', eyes: 'closed', lift: .8 }, { coat: 'krishna', tilak: 1, feather: 1, lookX: -.6 },
      { calf: 1, coat: 'gauri', hop: frac(t * .7) }, { calf: 1, coat: 'kapila', graze: 1, mouth: 'tongue' }, { calf: 1, coat: 'dhavala', walk: t * 1.2, eyes: 'heart' },
    ];
    cells.forEach((o, i) => {
      const cx = (i % (vert ? 2 : 4)) * cw + cw * .42, cy = Math.floor(i / (vert ? 2 : 4)) * ch + ch * .85;
      cow(cx, cy, (o.calf ? 1.15 : 1) * Math.min(cw / 17, ch / 15), { seed: i, boilKey: 'c' + i, ...o });
    });
  };
  LOOPS.cow.len = 4;
})();
