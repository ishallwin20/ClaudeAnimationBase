// owl.js: Uluka, Maa Lakshmi's owl: a chibi white barn owl standing and facing us (Bengal's lokkhi pencha): a
// heart-shaped white face with a buff rim, big dark eyes, a pale hooked beak, a golden-buff head, back and wings with
// grey mottling and dark specks, a white bib, feathered legs and grey toes with dark talons.
// Front view only. (x, y) is the ground under him; u is the size unit (about 13.4u to the top of the head, 7.6u
// across the head, 6.4u across the body).
// Load after bappa.js (U()) and clawd.js (eyes() / mouth() / emote(), so feel() and emotions() drive him too).
//
// Body-local coordinates in u (y up is negative):
//   toes (±1.0, 0) · body -8.2..-.4, widest ±3.2 at -3.6 · shoulders (±2.75, -6.9) · neck (0, -7.4) · head centre
//   (0, -10.3), 3.8 × 3.1 · eyes (±1.3, -10.4) · beak (0, -9.4) tip (0, -8.6) · head top -13.4 · tail tip (0, .1)
//   Head coordinates: the head is drawn about the neck, nodded by `nod` and tilted by `htilt`; owlHeadPt() converts.
//
// Options (all optional):
//   pose:   dx, dy (u), sq, rot (pivots at (x, y)), flip, nod (u: the head dips), htilt (radians), puff 0..1 (the
//           feathers fluff out: wider, rounder), lean (u: the body sways sideways)
//   head:   hturn (turns: 0 = facing us, .5 = the back of his head to us, 1 = all the way round; an owl turns about
//           .75 each way), hx (-1..1: a small turn), spin 0..1 (speed lines round the head while it spins)
//   wings:  wingL / wingR = [x, y] in u (2-bone, from the shoulder; default folded at his sides), bendL / bendR (1 the
//           elbow out, -1 in), wingShapeL / wingShapeR ('open' (the primaries fanned) | 'hold' (curled round a pole
//           or handle) | 'point' (one long feather) | 'fold' (default when no target)), wingAL / wingAR (the
//           hand's angle; default along the forearm)
//   face:   eyes, mouth, lookX / lookY, squint, blush, brows (-1 angry .. +1 raised), browL / browR, worry 0..1,
//           mouthK (how wide 'open' / 'talk' open), seed, tint + tintK. His own eyes: 'normal' / 'look' / 'wide' /
//           'happy' / 'closed' / 'squeeze' / 'sad' / 'angry' / 'tired' (heavy lids) / 'side' (a flat side-eye) /
//           'dazzle' (screwed shut with tears: too much light); every other kind is Clawd's. His beak: 'flat' (shut,
//           the default) / 'smile' / 'grin' / 'open' / 'talk' / 'O' / 'frown' / 'wobble' / 'smirk'.
//   shades: 0..1 (sunglasses slide down from his brow onto his eyes), shadesCol ([rim, lens]: default gold and plum)
//   hooks:  behind(u, sw) (drawn first), hat(u, sw) (head space), held(u, sw) (body space, over the body and head,
//           under the wings)
//   look:   pal (overrides the colours)
//   extras: emote + emoteK + emoteAge, boilKey, noShadow, swMul
// Helpers: owlWing(x, y, u, o, s), owlHead(x, y, u, o), owlBeak(x, y, u, o), owlChest(x, y, u, o) → world [x, y];
// owlWorld(x, y, u, o, px, py) maps any body point.
const OWL = {
  body: '#E7B064', dk: '#C2873E', lt: '#F5D193', grey: '#B4A9A6', greyDk: '#857A7A', speck: '#5E4436',
  white: '#FFF7EA', whiteDk: '#E9D9C2', rim: '#C4823E', rimDk: '#94582A', ink: '#3E2A26',
  eye: '#24161C', eyeLt: '#4A3238', beak: '#F4D6C6', beakDk: '#C9A08E', mouth: '#6A2A30', tongue: '#E07A80',
  toe: '#B9A09C', talon: '#2E2226', cheek: '#F2A0A0', tear: '#BFE6FF',
  shades: '#E2A92E', lens: '#3A2244',
};

const OWL_NECK = -7.4, OWL_HS = 1.16;   // the head is drawn 1.16× about the neck: a big chibi head
function owlHeadPt(o, px, py) {   // a head-space point → body u
  const a = o.htilt || 0, dx = px * OWL_HS, dy = (py - OWL_NECK) * OWL_HS, l = (o.lean || 0);
  return [l * .8 + dx * Math.cos(a) - dy * Math.sin(a), OWL_NECK + (o.nod || 0) + dx * Math.sin(a) + dy * Math.cos(a)];
}
function owlShoulder(o, s) { return [s * (2.75 + clamp(o.puff || 0) * .25) + (o.lean || 0) * .5, -6.9]; }
function owlArm(o, s) {
  const sh = owlShoulder(o, s), L1 = 2.7, L2 = 2.9;
  let h = (s < 0 ? o.wingL : o.wingR) || [s * 3.05 + (o.lean || 0) * .3, -2.0];
  let dx = h[0] - sh[0], dy = h[1] - sh[1], d = Math.hypot(dx, dy) || 1e-3;
  const reach = L1 + L2 - .05;
  if (d > reach) { h = [sh[0] + dx / d * reach, sh[1] + dy / d * reach]; dx = h[0] - sh[0]; dy = h[1] - sh[1]; d = reach; }
  d = Math.max(d, .8);
  const a = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1)), base = Math.atan2(dy, dx);
  const e1 = [sh[0] + Math.cos(base + a) * L1, sh[1] + Math.sin(base + a) * L1], e2 = [sh[0] + Math.cos(base - a) * L1, sh[1] + Math.sin(base - a) * L1];
  const out = (e1[0] - e2[0]) * s > 0 ? e1 : e2, inn = out === e1 ? e2 : e1;
  return [sh, ((s < 0 ? o.bendL : o.bendR) ?? 1) < 0 ? inn : out, h];
}
function owlWorld(x, y, u, o, px, py) {
  const sq = (o.sq || 0) + (o.take || 0), fx = o.flip ? -1 : 1, r = o.rot || 0, lx = fx * px * u * (1 + sq * .6), ly = py * u * (1 - sq);
  return [x + (o.dx || 0) * u + lx * Math.cos(r) - ly * Math.sin(r), y + (o.dy || 0) * u + lx * Math.sin(r) + ly * Math.cos(r)];
}
function owlFaceX(o) { const a = (o.hturn || 0) * TAU + clamp(o.hx || 0, -1, 1) * .55; return Math.sin(a) * 1.7; }
function owlWing(x, y, u, o, s) { const [, , h] = owlArm(o, s); return owlWorld(x, y, u, o, h[0], h[1]); }
function owlHead(x, y, u, o = {}) { return owlWorld(x, y, u, o, ...owlHeadPt(o, 0, -10.3)); }
function owlBeak(x, y, u, o = {}) { return owlWorld(x, y, u, o, ...owlHeadPt(o, owlFaceX(o), -8.45)); }
function owlChest(x, y, u, o = {}) { return owlWorld(x, y, u, o, (o.lean || 0) * .4, -4.5); }

// the wing's hand (the primaries) at the wrist, feathers along +x; s mirrors it
function owlWingHand(u, sw, shape, s, col, dk, C, INK) {
  const P = pts => U(pts, u);
  push(); scale(1, -s);
  if (shape === 'open') {   // fanned like fingers: four long primaries
    for (let i = 0; i < 4; i++) {
      const a = (-.55 + i * .36), L = 1.9 - Math.abs(i - 1.5) * .25;
      push(); rotate(a);
      paint(P([[-.1, -.32], [L * .6, -.36], [L, -.12], [L + .1, .05], [L * .6, .3], [-.1, .32]]), { wash: i % 2 ? col : C.lt, fill: dk, fillOp: 40, tex: .4, ink: INK, sw: sw * .6, curv: .5 });
      inkLine(P([[.2, 0], [L * .85, 0]]), sw * .35, dk, 'inkfine', 0);
      pop();
    }
  } else if (shape === 'hold') {   // curled round a handle: a round tuft, three feather tips folded over
    paint(P([[-.15, -.75], [.55, -.95], [1.2, -.7], [1.45, -.15], [1.4, .4], [1.0, .82], [.4, .9], [-.15, .75]]), { wash: col, fill: dk, fillOp: 40, tex: .4, ink: INK, sw: sw * .8, curv: .55 });
    for (const k of [-.42, 0, .42]) inkLine(P([[.95, k], [1.42, k * 1.05]]), sw * .5, INK, 'inkfine', 0);
  } else if (shape === 'point') {   // one long feather out, the rest tucked
    paint(P([[-.1, -.6], [.6, -.75], [1.0, -.4], [1.0, .5], [.4, .8], [-.1, .6]]), { wash: col, ink: INK, sw: sw * .75, curv: .5 });
    paint(P([[.7, -.42], [2.4, -.22], [2.65, 0], [2.4, .16], [.8, .2]]), { wash: C.lt, ink: INK, sw: sw * .6, curv: .5 });
  } else {   // folded: the wingtip, three feather points down
    paint(P([[-.2, -.75], [.7, -.85], [1.5, -.55], [1.9, 0], [1.5, .55], [.7, .8], [-.2, .7]]), { wash: col, fill: dk, fillOp: 40, tex: .4, ink: INK, sw: sw * .75, curv: .4 });
    for (const k of [-.35, .05, .45]) inkLine(P([[.8, k], [1.6, k * 1.1]]), sw * .45, dk, 'inkfine', 0);
  }
  pop();
}

function owl(x, y, u, o = {}) {
  const id = o.boilKey ?? 'ow' + (++CLAWD_N), rs = p => boilSeed(`owl ${id} ${p}`);
  const C = { ...OWL, ...(o.pal || {}) }, INK = C.ink;
  const sq = (o.sq || 0) + (o.take || 0), sw = clamp(u / 20, .4, 2) * (o.swMul || 1), J = u * .03;
  const { col, dk, lt } = tintCols({ tint: o.tint, tintK: o.tintK, col: C.body, dk: C.dk, lt: C.lt });
  const pf = clamp(o.puff || 0), lean = o.lean || 0;
  const LB = pts => U(pts.map(([a, b]) => [a + lean * clamp((-b - 1) / 7), b]), u);   // body points, swayed by lean

  if (!o.noShadow) { rs('shadow'); const f = 1 - Math.min(.5, Math.abs(o.dy || 0) * .05); paint(ellPts(x + (o.dx || 0) * u, y + u * .15, u * 4.2 * f, u * .8 * f, 20), { fill: PAL.ink, fillOp: 80, bleed: .25, tex: .3, border: .1, ink: null }); }
  push();
  translate(x + (o.dx || 0) * u, y + (o.dy || 0) * u);
  if (o.rot) rotate(o.rot);
  scale((o.flip ? -1 : 1) * (1 + sq * .6), 1 - sq);
  if (o.behind) { rs('behind'); o.behind(u, sw); }

  // ---------------- the tail, a short fan between the legs
  rs('tail');
  paint(LB([[-1.1, -1.2], [1.1, -1.2], [.9, .05], [.3, .25], [-.3, .25], [-.9, .05]]), { wash: dk, ink: INK, sw: sw * .7, curv: .4 });

  // ---------------- legs and feet: feathered white shins, grey toes, dark talons
  rs('feet');
  for (const s of [-1, 1]) {
    paint(ellPts(s * 1.15 * u, -1.0 * u, .72 * u, .95 * u, 12, J), { wash: C.white, fill: C.whiteDk, fillOp: 60, tex: .4, ink: INK, sw: sw * .6 });
    for (const k of [-.55, 0, .55]) {
      const tx = s * 1.05 + k * .62, ty = -.05;
      paint(ribbon(U([[s * 1.05 + k * .2, -.45], [tx, ty]], u), .34 * u, .26 * u), { wash: C.toe, ink: INK, sw: sw * .5 });
      paint(U([[tx - .16, ty - .02], [tx + .16, ty - .02], [tx + k * .2, ty + .28]], u), { wash: C.talon, ink: null });
    }
  }

  // ---------------- the body: an egg, buff at the sides, a white bib with dark specks down the front
  rs('body');
  const bw = 2.95 + pf * .45;
  const body = LB([[-2.2, -8.0], [2.2, -8.0], [bw * .92, -6.0], [bw, -3.6], [bw * .88, -1.6], [2.0, -.55], [0, -.35], [-2.0, -.55], [-bw * .88, -1.6], [-bw, -3.6], [-bw * .92, -6.0]]);
  paint(body, { wash: col, fill: dk, fillOp: 40, bleed: .06, tex: .5, border: .4, ink: null, curv: .5 });
  paint(LB([[-1.7, -7.8], [1.7, -7.8], [2.35 + pf * .3, -5.4], [2.3 + pf * .3, -2.8], [1.5, -1.0], [0, -.6], [-1.5, -1.0], [-2.3 - pf * .3, -2.8], [-2.35 - pf * .3, -5.4]]), { wash: C.white, fill: C.whiteDk, fillOp: 45, tex: .4, ink: null, curv: .5 });
  for (let i = 0; i < 14; i++) {   // the specks on the bib
    const sx = (hash(i * 3.7) - .5) * 3.2, sy = -1.6 - hash(i * 5.1) * 5.4;
    if (Math.abs(sx) > 2.0 - (sy < -6 ? .5 : 0)) continue;
    paint(ellPts((sx + lean * clamp((-sy - 1) / 7)) * u, sy * u, .09 * u, .12 * u, 6), { wash: C.speck, ink: null });
  }
  paint(body, { ink: INK, sw: sw * .9, curv: .5 });

  // ---------------- the head: a round buff dome, then the heart-shaped face that turns round it
  push();
  const [hpx, hpy] = owlHeadPt(o, 0, OWL_NECK);
  translate(hpx * u, hpy * u); if (o.htilt) rotate(o.htilt); scale(OWL_HS); translate(0, -OWL_NECK * u);
  rs('head');
  const turnA = (o.hturn || 0) * TAU + clamp(o.hx || 0, -1, 1) * .55, front = Math.cos(turnA), fx = Math.sin(turnA) * 1.7;
  const hw = 3.8 + pf * .2;
  const headPts = U([[-hw * .92, -12.2], [-hw * .55, -13.25], [0, -13.45], [hw * .55, -13.25], [hw * .92, -12.2], [hw, -10.3], [hw * .9, -8.4], [hw * .55, -7.3], [0, -7.0], [-hw * .55, -7.3], [-hw * .9, -8.4], [-hw, -10.3]], u);
  paint(headPts, { wash: col, fill: dk, fillOp: 35, bleed: .05, tex: .5, border: .4, ink: null, curv: .5 });
  paint(ellPts(-1.2 * u, -12.4 * u, 1.6 * u, .55 * u, 12, J, -.15), { fill: lt, fillOp: 120, bleed: .2, tex: .7, border: .6, ink: null });
  // the grey mottling and white dots on the crown, shifting with the turn
  for (let i = 0; i < 9; i++) {
    const a = hash(i * 2.3) * TAU, bx = Math.sin(a + turnA) * hw * .8, by = -12.0 - hash(i * 4.1) * 1.1 + (Math.cos(a + turnA) < 0 ? .0 : 0);
    if (Math.cos(a + turnA) < -.2 && front > 0) continue;
    paint(ellPts(bx * u, by * u, .16 * u, .1 * u, 6), { wash: i % 3 ? C.grey : C.white, ink: null });
  }
  if (front < .2) {   // the back of his head: a feather parting and speckled buff
    const k = clamp((.2 - front) / .5), bx = -fx * .9;
    inkLine(U([[bx, -13.2], [bx * .9, -10.5], [bx * .7, -7.6]], u), sw * .6 * k, dk, 'inkfine', .5);
    for (let i = 0; i < 10; i++) paint(ellPts((bx + (hash(i * 7.3) - .5) * 4.4) * u, (-12.4 + hash(i * 2.9) * 4.6) * u, .12 * u, .09 * u, 6), { wash: i % 2 ? C.speck : C.white, washOp: 255 * k, ink: null });
  }
  paint(headPts, { ink: INK, sw: sw * .95, curv: .5 });

  if (front > -.05) {
    // the face: squashed toward the side it turns to, so the turn reads as drawn views, not 3D
    const fk = clamp(front), sxk = lerp(.18, 1, fk);
    push(); translate(fx * u, 0); scale(sxk, 1); translate(0, -10.1 * u); scale(1.14); translate(0, 10.1 * u);   // the disc fills the front of the head
    rs('face');
    const ek = Array.isArray(o.eyes) ? o.eyes[0] : o.eyes;
    const bAng = clamp((o.brows ?? 0) - (['angry', 'determined', 'red'].includes(ek) ? .9 : 0), -1, 1), wy = clamp(o.worry || 0) + (['sad', 'scared'].includes(ek) ? .7 : 0);
    // the heart: two lobes up top meeting at a notch, down to a point under the beak; the notch dips when angry
    const nY = -11.95 + Math.min(0, bAng) * -.35 - Math.max(0, bAng) * .2;
    const lobeY = s => -12.75 - Math.max(0, bAng) * .25 - ((s < 0 ? o.browL : o.browR) ?? 0) * .3 + wy * .1;
    const heart = U([[0, nY], [.9, lobeY(1) - .05], [2.1, lobeY(1) + .2], [3.05, -11.1], [3.25, -9.8], [2.75, -8.5], [1.6, -7.65], [0, -7.25], [-1.6, -7.65], [-2.75, -8.5], [-3.25, -9.8], [-3.05, -11.1], [-2.1, lobeY(-1) + .2], [-.9, lobeY(-1) - .05]], u);
    paint(heart, { wash: C.rim, ink: null, curv: .45 });
    const inner = U([[0, nY + .4], [.85, lobeY(1) + .38], [1.95, lobeY(1) + .55], [2.7, -10.95], [2.85, -9.8], [2.4, -8.7], [1.45, -7.95], [0, -7.62], [-1.45, -7.95], [-2.4, -8.7], [-2.85, -9.8], [-2.7, -10.95], [-1.95, lobeY(-1) + .55], [-.85, lobeY(-1) + .38]], u);
    paint(inner, { wash: C.white, fill: C.whiteDk, fillOp: 40, tex: .3, ink: null, curv: .45 });
    inkLine(U([[0, nY + .45], [0, -9.9]], u), sw * .55, C.rim, 'inkfine', 0);   // the ridge down to the beak
    paint(heart, { ink: INK, sw: sw * .8, curv: .45 });
    // a soft warm shadow in front of each eye, as on a barn owl
    for (const s of [-1, 1]) paint(ellPts(s * .55 * u, -10.1 * u, .5 * u, .8 * u, 10), { fill: C.whiteDk, fillOp: 110, bleed: .2, tex: .4, ink: null });
    if (o.blush) for (const s of [-1, 1]) paint(ellPts(s * 2.0 * u, -8.95 * u, .6 * u, .32 * u, 12), { fill: C.cheek, fillOp: 170 * clamp(o.blush), bleed: .2, tex: .4, ink: null });

    // ---- eyes
    rs('eyes');
    const kinds = Array.isArray(o.eyes) ? o.eyes : o.eyes === 'wink' ? ['normal', 'happy'] : [o.eyes || 'normal', o.eyes || 'normal'];
    const own = k => ['normal', 'look', 'wide', 'happy', 'closed', 'squeeze', 'sad', 'angry', 'tired', 'side', 'dazzle'].includes(k);
    if (kinds.every(own)) {
      const blink = ((T * .8 + (o.seed || 0) * 1.7 + .4) % 4.1) < .11;
      [-1, 1].forEach((s, i) => {
        const k = (o.squint || 0) > .6 ? 'squeeze' : kinds[i], ex = s * 1.3, ey = -10.4;
        if (k === 'happy') { inkLine(U([[ex - .62, ey + .25], [ex, ey - .42], [ex + .62, ey + .25]], u), sw * 1.4, INK, 'ink', .6); return; }
        if (k === 'closed' || (blink && k !== 'wide' && k !== 'dazzle')) { inkLine(U([[ex - .62, ey - .05], [ex, ey + .34], [ex + .62, ey - .05]], u), sw * 1.3, INK, 'ink', .6); return; }
        if (k === 'squeeze' || k === 'dazzle') {
          inkLine(U([[ex - s * .62, ey - .46], [ex + s * .4, ey], [ex - s * .62, ey + .42]], u), sw * 1.4, INK, 'ink', .2);
          if (k === 'dazzle') {   // crow's-feet creases and a tear
            for (const a of [-.5, 0, .5]) inkLine(U([[ex + s * .65 + Math.cos(a) * s * .15, ey + Math.sin(a) * .15], [ex + s * 1.0 + Math.cos(a) * s * .25, ey + Math.sin(a) * .35]], u), sw * .5, C.rimDk, 'inkfine', 0);
            const tk = frac(T * 1.4 + s * .3), tyy = ey + .5 + tk * 1.4;
            paint(U([[ex - s * .1, tyy - .25], [ex - s * .1 + .15, tyy + .05], [ex - s * .1, tyy + .2], [ex - s * .1 - .15, tyy + .05]], u), { wash: C.tear, washOp: 255 * (1 - tk), ink: null, curv: .6 });
          }
          return;
        }
        const wide = k === 'wide', rx = wide ? .98 : .86, ry = wide ? 1.08 : .96;
        const lx = (o.lookX ?? (k === 'side' ? .9 : 0)) * .3, ly = (o.lookY || 0) * .26;
        paint(U(ellPts(ex, ey, rx, ry, 20), u), { wash: C.white, ink: INK, sw: sw * .55 });
        const ir = wide ? .5 : .62, cx = ex + lx * (wide ? 1.3 : 1), cy = ey + ly + (k === 'tired' || k === 'side' ? .14 : 0);
        paint(ellPts(cx * u, cy * u, ir * u, ir * 1.06 * u, 16), { wash: C.eye, ink: null });
        paint(ellPts((cx + .05) * u, (cy + .08) * u, ir * .7 * u, ir * .72 * u, 12), { wash: C.eyeLt, ink: null });
        paint(ellPts(cx * u, cy * u, ir * .5 * u, ir * .52 * u, 10), { wash: C.eye, ink: null });
        paint(ellPts((cx - .2) * u, (cy - .24) * u, .17 * u, .19 * u, 8), { wash: C.white, ink: null });
        paint(ellPts((cx + .2) * u, (cy + .2) * u, .07 * u, .07 * u, 6), { wash: C.white, ink: null });
        if (k === 'tired' || k === 'side' || k === 'angry' || k === 'sad') {   // a lid over the top: flat, slanting in (angry) or out (sad)
          const ang = k === 'angry' ? s * .6 : k === 'sad' ? -s * .45 : 0, top = ey - ry - .25;
          const mid = ey - (k === 'side' ? .12 : k === 'angry' ? .2 : k === 'sad' ? .35 : .0);
          paint(U([[ex - rx - .14, top], [ex + rx + .14, top], [ex + rx + .14, mid - ang * rx], [ex - rx - .14, mid + ang * rx]], u), { wash: C.white, ink: null });
          inkLine(U([[ex - rx - .1, mid + ang * rx], [ex + rx + .1, mid - ang * rx]], u), sw * 1.3, INK, 'ink', 0);
          if (k === 'tired') inkLine(U([[ex - .5, ey + ry + .14], [ex, ey + ry + .3], [ex + .5, ey + ry + .14]], u), sw * .5, C.rimDk, 'inkfine', .5);
        }
      });
    } else { push(); translate(0, -10.2 * u); scale(.55); translate(0, 6 * u); eyes(u, o, sw / .55 * .85, [-1, 1], 0); pop(); }
    // brows: short rim-coloured feather strokes over the eyes (lifted, angry or worried)
    rs('brows');
    if (bAng < -.2 || bAng > .2 || wy > .1 || o.browL || o.browR) for (const s of [-1, 1]) {
      const b = (s < 0 ? o.browL : o.browR) ?? 0, lift = Math.max(0, bAng) * .45 + b * .35;
      const inY = -11.5 - lift + Math.min(0, bAng) * -.45 - wy * .4, outY = -11.75 - lift - Math.min(0, bAng) * -.15 + wy * .15;
      paint(U(ribbon([[s * .45, inY], [s * 1.2, (inY + outY) / 2 - .16], [s * 2.05, outY]], .36, .16), u), { wash: C.rimDk, ink: null });
    }

    // ---- the beak: a pale hooked beak; it opens by dropping the lower half
    rs('beak');
    const m = o.mouth || 'flat', mk = clamp(o.mouthK ?? 1, 0, 1.4), by = -9.75;
    const open = m === 'open' || m === 'talk' ? .25 + .85 * mk : m === 'grin' ? .75 : m === 'O' ? .65 : 0;
    if (open > 0) {
      const w = m === 'O' ? .38 : .55 + .15 * mk;
      paint(U([[-w, by + .55], [w, by + .55], [w * .8, by + .7 + open * .7], [0, by + .85 + open], [-w * .8, by + .7 + open * .7]], u), { wash: C.mouth, ink: INK, sw: sw * .6, curv: .5 });
      if (open > .5 && m !== 'O') paint(U([[-w * .45, by + .7 + open * .75], [w * .45, by + .7 + open * .75], [0, by + .82 + open * .95]], u), { wash: C.tongue, ink: null, curv: .5 });
      paint(U([[-.3, by + .6 + open * .9], [.3, by + .6 + open * .9], [0, by + .95 + open]], u), { wash: C.beakDk, ink: INK, sw: sw * .5, curv: .3 });   // the lower bill
    }
    paint(U([[-.42, by - .05], [.42, by - .05], [.36, by + .5], [.12, by + 1.1], [0, by + 1.2], [-.12, by + 1.1], [-.36, by + .5]], u), { wash: C.beak, fill: C.beakDk, fillOp: 50, tex: .4, ink: INK, sw: sw * .6, curv: .45 });
    inkLine(U([[.12, by + .15], [.1, by + .75]], u), sw * .35, C.beakDk, 'inkfine', .3);
    // cheek lines beside the beak: the smile, grin, frown and smirk live here
    if (m === 'smile' || m === 'grin') for (const s of [-1, 1]) inkLine(U([[s * .5, by + .55], [s * .95, by + .82], [s * 1.35, by + .55]], u), sw * .8, INK, 'ink', .6);
    else if (m === 'frown') for (const s of [-1, 1]) inkLine(U([[s * .5, by + .95], [s * .9, by + .7], [s * 1.25, by + .95]], u), sw * .8, INK, 'ink', .6);
    else if (m === 'smirk') inkLine(U([[.45, by + .75], [.95, by + .7], [1.35, by + .35]], u), sw * .8, INK, 'ink', .6);
    else if (m === 'wobble') inkLine(U([[-1.2, by + 1.05], [-.7, by + .9], [-.35, by + 1.05], [.35, by + .9], [.7, by + 1.05], [1.2, by + .9]], u), sw * .7, INK, 'ink', .5);

    // ---- sunglasses, sliding down from the brow
    const sh = clamp(o.shades || 0);
    if (sh > 0) {
      rs('shades');
      const [rim, lens] = o.shadesCol || [C.shades, C.lens], dy2 = lerp(-3.0, 0, easeOut(sh));
      push(); translate(0, dy2 * u);
      inkLine(U([[-2.6, -10.75], [-3.4, -10.95]], u), sw * 1.3, rim, 'ink', 0); inkLine(U([[2.6, -10.75], [3.4, -10.95]], u), sw * 1.3, rim, 'ink', 0);
      for (const s of [-1, 1]) {
        const lp = U([[s * .35, -11.25], [s * 2.55, -11.3], [s * 2.5, -10.1], [s * 1.9, -9.45], [s * .9, -9.5], [s * .4, -10.1]], u);
        paint(lp, { wash: lens, ink: rim, sw: sw * 1.5, curv: .4 });
        paint(U([[s * 1.0, -11.0], [s * 1.6, -11.0], [s * .9, -10.2]], u), { wash: '#FFFFFF', washOp: 140, ink: null });   // a glint
      }
      inkLine(U([[-.4, -11.0], [0, -11.2], [.4, -11.0]], u), sw * 1.3, rim, 'ink', .5);
      pop();
    }
    pop();   // face
  }
  if (o.hat) { rs('hat'); o.hat(u, sw); }
  // speed lines round the head while it spins
  const spn = clamp(o.spin || 0);
  if (spn > .05) {
    rs('spin');
    for (let i = 0; i < 3; i++) { const a0 = T * 9 + i * 2.1; inkLine(Array.from({ length: 6 }, (_, j) => { const a = a0 + j * .22; return [Math.cos(a) * 4.7 * u, (-10.3 + Math.sin(a) * 3.9) * u]; }), sw * 1.3 * spn, INK, 'ink', .5); }
  }
  pop();   // head

  if (o.held) { rs('held'); o.held(u, sw); }

  // ---------------- wings: folded, a teardrop down each side; raised, shoulder → wrist, then the primaries
  for (const s of [-1, 1]) {
    rs('wing' + s);
    const raised = !!o[s < 0 ? 'wingL' : 'wingR'], wc = s < 0 ? col : lt, l = lean * .5;
    if (!raised) {
      const P = U([[s * 2.3 + l, -7.3], [s * 3.35 + l, -6.2], [s * 3.75 + l * .8, -4.2], [s * 3.5 + l * .5, -2.2], [s * 2.75 + l * .3, -.55], [s * 2.3 + l * .3, -1.2], [s * 2.05 + l * .4, -3.4], [s * 1.95 + l * .7, -5.8]], u);
      paint(P, { wash: wc, fill: dk, fillOp: s < 0 ? 45 : 25, tex: .45, ink: INK, sw: sw * .85, curv: .45 });
      for (const [a, b] of [[-5.6, 2.6], [-4.4, 2.9], [-3.2, 2.95]]) inkLine(U([[s * (b - .5) + l, a], [s * (b + .05) + l, a + .35], [s * (b + .5) + l, a + .1]], u), sw * .5, C.greyDk, 'inkfine', .5);   // covert scallops
      for (const k of [0, 1, 2]) inkLine(U([[s * (2.55 + k * .3) + l * .3, -2.2 + k * .15], [s * (2.6 + k * .25) + l * .3, -.9 - k * .1]], u), sw * .5, dk, 'inkfine', .3);   // the primaries' tips
      continue;
    }
    const [sh, el, ha] = owlArm(o, s), shape = (s < 0 ? o.wingShapeL : o.wingShapeR) || 'open';
    paint(U(ribbon([sh, el, ha], 2.3, 1.05), u), { wash: wc, fill: dk, fillOp: s < 0 ? 45 : 25, tex: .45, ink: INK, sw: sw * .85, curv: .35 });
    for (const k of [.25, .5, .75]) {   // covert scallops along the wing
      const a = k < .5 ? sh : el, b = k < .5 ? el : ha, f = k < .5 ? k * 2 : (k - .5) * 2, cx = lerp(a[0], b[0], f), cy = lerp(a[1], b[1], f);
      const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), nx = -Math.sin(ang) * .35, ny = Math.cos(ang) * .35, tx = Math.cos(ang) * .3, ty = Math.sin(ang) * .3;
      inkLine(U([[cx - nx - tx, cy - ny - ty], [cx + tx * .3, cy + ty * .3], [cx + nx - tx, cy + ny - ty]], u), sw * .5, C.greyDk, 'inkfine', .5);
    }
    push(); translate(ha[0] * u, ha[1] * u);
    rotate((s < 0 ? o.wingAL : o.wingAR) ?? Math.atan2(ha[1] - el[1], ha[0] - el[0]));
    translate(-.3 * u, 0);
    owlWingHand(u, sw, shape, s, wc, dk, C, INK);
    pop();
  }
  pop();

  if (o.emote) {
    rs('emote');
    const top = EMOTE_TOP.includes(o.emote), [hx, hy] = owlHeadPt(o, 0, -10.3);
    const [ex, ey] = owlWorld(x, y, u, o, top ? hx : (o.flip ? -1 : 1) * 4.6, top ? hy - 4.8 : hy - 3.4);
    emote(o.emote, ex, ey, u * 1.1, o.emoteK ?? 1, o.emoteAge ?? T);
  }
  rs('after');
}

// Model sheet: studio.html?loop=owl, or node render.mjs --loop=owl --sheet=0.5,1.5,2.5,3.5 --cols=4 --w=540
(() => {
  LOOPS.owl = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: '#E4DCEB', ink: null });
    const u = 30, cyc = t % 4;
    // 1 · an emotion timeline: neutral → angry → sad
    owl(270, 640, u, { ...emotions(t, [[0, 'neutral'], [1.3, 'angry'], [2.6, 'sad']]), boilKey: 'o1' });
    // 2 · the union leader: talking, one wing up open, the other holding a pole
    owl(800, 640, u, { eyes: 'angry', mouth: 'talk', mouthK: .6 + .5 * Math.abs(Math.sin(t * 7)), puff: .5, wingL: [-4.6, -10.5], wingShapeL: 'open', wingR: [3.4, -5.2], wingShapeR: 'hold', boilKey: 'o2' });
    // 3 · dazzled, then the head spins all the way round
    const sp = seg(cyc, 1.2, 2.4);
    owl(270, 1240, u, { eyes: cyc < 1.2 ? 'dazzle' : 'wide', mouth: cyc < 1.2 ? 'wobble' : 'O', hturn: ease(sp), spin: Math.sin(sp * Math.PI), boilKey: 'o3' });
    // 4 · cool: the sunglasses slide down, a grin, a wing pointing
    owl(800, 1240, u, { eyes: 'happy', mouth: 'grin', shades: seg(cyc, .3, .9), wingR: [5.2, -8.6], wingShapeR: 'point', blush: .4, boilKey: 'o4' });
    // 5 · small turns, side-eye and tired, the wing shapes
    owl(170, 1800, u * .7, { eyes: 'side', mouth: 'smirk', hx: .6, boilKey: 'o5' });
    owl(430, 1800, u * .7, { eyes: 'tired', mouth: 'frown', htilt: .2, boilKey: 'o6' });
    owl(690, 1800, u * .7, { eyes: 'closed', mouth: 'smile', hturn: .5, boilKey: 'o7' });
    owl(930, 1800, u * .7, { eyes: 'wide', mouth: 'open', mouthK: 1.2, wingL: [-4.4, -8], wingR: [4.4, -8], boilKey: 'o8' });
  };
  LOOPS.owl.len = 4;
})();
