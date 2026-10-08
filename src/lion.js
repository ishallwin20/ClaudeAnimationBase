// lion.js: Sher, Maa Durga's lion: a chibi golden lion sitting up on his haunches and facing us (the temple-lion sit),
// with a big rust mane, amber eyes, a cream muzzle and soft paws with pink toe beans. The same rig draws Maa
// Chandraghanta's tigress (kind: 'tiger': orange with ink stripes, a white cheek ruff, no mane, lashes).
// Front view only. (x, y) is the ground under the middle of him; u is the size unit (about 16.6u to the top of the
// mane, 10u wide across the mane, 9.6u across the haunches).
// Load after bappa.js (U()) and clawd.js (eyes() / mouth() / emote(), so feel() and emotions() drive him too).
//
// Body-local coordinates in u (y up is negative):
//   front paws (±1.05, -.55) · hind paws (±3.55, -.45) · haunches (±2.7, -2.15) · chest -8.2..-1 · shoulders (±1.45, -7.0)
//   front paws (as above) · mane centre (0, -11.4), 5.0 × 4.7 · head centre (0, -11.6) · eyes (±1.2, -12.35) · nose
//   (0, -11.1) · mouth (0, -10.1) · ears (±2.3, -13.85) · tail tip about (5.6, -4.6). Head and mane coordinates are as
//   drawn: the head is scaled 1.15× about the neck (0, -9) and dropped .45u, so on screen the mane tops out near -16.9
//   (lionHeadPt(o, x, y) converts). The hat hook draws in these head coordinates.
//
// Options (all optional):
//   pose:   dx, dy (u), sq, rot (pivots at (x, y)), flip, hx (-1..1 head turn), htilt (radians), nod (u: the head dips),
//           lean (u: the upper body shifts sideways), slump 0..1 (shoulders and head sag, the mane droops),
//           inhale 0..1 (a big breath: chest out, head up, mane bristles), tail (-1..1; default a slow swish)
//   paws:   pawL / pawR = [x, y] in u (2-bone forelegs; out-of-reach targets are pulled in; default resting on the
//           ground), bendL / bendR (1 elbows out, -1 in), pawShapeL / pawShapeR ('rest' | 'pad' (palm to us, the four
//           toe beans) | 'hold' (curled round a pole)), pawAL / pawAR (angle, default along the foreleg),
//           beans (0..4: how many toe beans of a 'pad' paw light up gold, for counting)
//   face:   eyes, mouth, lookX / lookY, squint, blush, brows (-1 angry .. +1 raised), browL / browR, worry 0..1,
//           mouthK (how wide 'open' / 'roar' / 'talk' open), seed, tint + tintK. His own eyes: 'normal' / 'look' /
//           'wide' / 'happy' / 'closed' / 'squeeze' / 'sad' / 'angry' / 'tired' (heavy lids) / 'side' (a flat
//           side-eye); every other kind is Clawd's. His own mouths: 'smile' / 'grin' / 'open' / 'talk' / 'roar' / 'O' /
//           'frown' / 'flat' / 'wobble' / 'smirk'; every other kind is Clawd's.
//   look:   kind 'lion' (default) | 'tiger', pal (overrides the colours), mane 0..1 puff, maneDroop 0..1, wind (-1..1)
//   hooks:  behind(u, sw) (drawn first), hat(u, sw) (head space: body coordinates that turn, tilt and nod with the head),
//           held(u, sw) (body space, over the head and body, under the forelegs and paws)
//   extras: emote + emoteK + emoteAge, boilKey, noShadow, swMul
// Helpers: lionPaw(x, y, u, o, s), lionHead(x, y, u, o), lionMouth(x, y, u, o), lionChest(x, y, u, o) → world [x, y].
const LIO = {
  body: '#E9AE52', dk: '#C68838', lt: '#F7CF86', cream: '#FBEBC9', creamDk: '#EBCF9E',
  mane: '#B8612C', maneDk: '#8C4322', maneLt: '#D9843E', ink: '#4A2A1E', nose: '#8E4A48', pad: '#C9776C', padLt: '#E9A698',
  eye: '#2A160E', iris: '#D08A2A', white: '#FFF8EC', mouth: '#5A2026', tongue: '#E07A72', cheek: '#E58A5A', stripe: null,
};
const TGR = { body: '#EE8A32', dk: '#C4661E', lt: '#F8AC62', cream: '#FFF4E2', creamDk: '#EBDCC6', stripe: '#3A2420', iris: '#8CA83A' };

// the upper body's offsets for a point at body y: slump sags it, inhale lifts it, lean shifts it
function lionUpper(o, py) {
  const k = clamp((-py - 2) / 7), sl = clamp(o.slump || 0), inh = clamp(o.inhale || 0);
  return [(o.lean || 0) * k, (sl * .9 - inh * .45) * k];
}
// the head and mane are drawn 1.15× about the neck (0, -9) and sit .45u lower than their drawn coordinates
const LIO_HS = 1.15, LIO_NECK = -9, LIO_DROP = .45;
function lionHeadOff(o) {
  const [lx, ly] = lionUpper(o, -11);
  return [lx + clamp(o.hx || 0, -1, 1) * .3, ly + (o.nod || 0) + clamp(o.slump || 0) * .5 - clamp(o.inhale || 0) * .2];
}
// a head-space point (as drawn) → body u
function lionHeadPt(o, px, py) { const [hx, hy] = lionHeadOff(o); return [hx + px * LIO_HS, hy + LIO_DROP + LIO_NECK + (py - LIO_NECK) * LIO_HS]; }
function lionShoulder(o, s) { const [lx, ly] = lionUpper(o, -7.0); return [s * (1.45 + clamp(o.inhale || 0) * .15) + lx, -7.0 + ly]; }
function lionArm(o, s) {
  const sh = lionShoulder(o, s), L1 = 3.35, L2 = 3.3;
  let h = (s < 0 ? o.pawL : o.pawR) || [s * 1.05, -.55];
  let dx = h[0] - sh[0], dy = h[1] - sh[1], d = Math.hypot(dx, dy) || 1e-3;
  const reach = L1 + L2 - .05;
  if (d > reach) { h = [sh[0] + dx / d * reach, sh[1] + dy / d * reach]; dx = h[0] - sh[0]; dy = h[1] - sh[1]; d = reach; }
  d = Math.max(d, .8);
  const a = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1)), base = Math.atan2(dy, dx);
  const e1 = [sh[0] + Math.cos(base + a) * L1, sh[1] + Math.sin(base + a) * L1], e2 = [sh[0] + Math.cos(base - a) * L1, sh[1] + Math.sin(base - a) * L1];
  const out = (e1[0] - e2[0]) * s > 0 ? e1 : e2, inn = out === e1 ? e2 : e1;
  return [sh, ((s < 0 ? o.bendL : o.bendR) ?? 1) < 0 ? inn : out, h];
}
function lionWorld(x, y, u, o, px, py) {
  const sq = o.sq || 0, fx = o.flip ? -1 : 1, r = o.rot || 0, lx = fx * px * u * (1 + sq * .6), ly = py * u * (1 - sq);
  return [x + (o.dx || 0) * u + lx * Math.cos(r) - ly * Math.sin(r), y + (o.dy || 0) * u + lx * Math.sin(r) + ly * Math.cos(r)];
}
function lionPaw(x, y, u, o, s) { const [, , h] = lionArm(o, s); return lionWorld(x, y, u, o, h[0], h[1]); }
function lionHead(x, y, u, o = {}) { const [px, py] = lionHeadPt(o, 0, -11.6); return lionWorld(x, y, u, o, px, py); }
function lionMouth(x, y, u, o = {}) { const [px, py] = lionHeadPt(o, clamp(o.hx || 0, -1, 1) * .5, -10.1); return lionWorld(x, y, u, o, px, py); }
function lionChest(x, y, u, o = {}) { const [lx, ly] = lionUpper(o, -6); return lionWorld(x, y, u, o, lx, -6 + ly); }

// a lobed ring of fur: n lobes round (cx, cy), radii rx × ry, lobes depth deep (0..1), turned by ph
function lionLobes(cx, cy, rx, ry, n, deep, ph, droop = 0, wind = 0) {
  const P = [];
  for (let i = 0; i < n * 2; i++) {
    const a = i / (n * 2) * TAU + ph, r = i % 2 ? 1 : 1 - deep, sa = Math.sin(a);
    P.push([cx + Math.cos(a) * rx * r * (1 - droop * .12) + wind * (1 + sa) * .5 * rx * .18, cy + sa * ry * r * (1 + droop * .1) + droop * (1 - Math.abs(Math.cos(a))) * .6 * (sa > 0 ? 1 : .4)]);
  }
  return P;
}

// a paw at the wrist, toes along +x; s mirrors it
function lionPawShape(u, sw, shape, s, col, dk, C, INK, beans = 0) {
  const P = pts => U(pts, u);
  push(); scale(1, -s);
  if (shape === 'pad') {   // the palm toward us: a round paw, the heart pad and four toe beans
    paint(P([[-.1, -.85], [.6, -1.15], [1.35, -1.05], [1.9, -.55], [2.0, 0], [1.9, .55], [1.35, 1.05], [.6, 1.15], [-.1, .85]]), { wash: col, ink: INK, sw: sw * .85, curv: .55 });
    paint(P([[.35, -.5], [.9, -.62], [1.15, -.3], [1.0, 0], [1.15, .3], [.9, .62], [.35, .5], [.2, 0]]), { wash: C.pad, ink: null, curv: .6 });
    [[1.45, -.72], [1.72, -.26], [1.72, .26], [1.45, .72]].forEach(([bx, by], i) => {
      const lit = beans > i + .01, k = clamp(beans - i);
      paint(ellPts(bx * u, by * u, .25 * u * (1 + k * .25), .22 * u * (1 + k * .25), 10), { wash: lit ? mixCol(C.pad, '#FFD24A', k) : C.pad, ink: lit ? INK : null, sw: sw * .4 });
    });
  } else if (shape === 'hold') {   // curled round a pole: a round fist, the toes as three creases
    paint(P([[-.1, -.8], [.55, -.95], [1.15, -.75], [1.4, -.25], [1.4, .3], [1.1, .78], [.5, .9], [-.1, .8]]), { wash: col, ink: INK, sw: sw * .85, curv: .55 });
    for (const k of [-.42, 0, .42]) inkLine(P([[1.0, k], [1.38, k * 1.05]]), sw * .5, INK, 'inkfine', 0);
  } else {   // rest, seen from the front: a soft round paw with three toe lines (not rotated)
    paint(P([[-.95, -.5], [-.55, -.75], [.55, -.75], [.95, -.5], [1.05, .1], [.75, .5], [-.75, .5], [-1.05, .1]]), { wash: col, ink: INK, sw: sw * .85, curv: .55 });
    for (const k of [-.38, 0, .38]) inkLine(P([[k, .48], [k, .18]]), sw * .5, dk, 'inkfine', 0);
  }
  pop();
}

function lion(x, y, u, o = {}) {
  const id = o.boilKey ?? 'l' + (++CLAWD_N), rs = p => boilSeed(`lion ${id} ${p}`);
  const tiger = o.kind === 'tiger', C = { ...LIO, ...(tiger ? TGR : {}), ...(o.pal || {}) };
  const sq = (o.sq || 0) + (o.take || 0), sw = clamp(u / 20, .4, 2) * (o.swMul || 1), J = u * .035, INK = C.ink;
  const { col, dk, lt } = tintCols({ tint: o.tint, tintK: o.tintK, col: C.body, dk: C.dk, lt: C.lt });
  const inh = clamp(o.inhale || 0), sl = clamp(o.slump || 0), hx = clamp(o.hx || 0, -1, 1);
  const UB = pts => U(pts.map(([a, b]) => { const [lx, ly] = lionUpper(o, b); return [a + lx, b + ly]; }), u);
  const stripe = (pts, w0, w1) => C.stripe && paint(U(ribbon(pts, w0, w1), u), { wash: C.stripe, ink: null, curv: .4 });

  if (!o.noShadow) { rs('shadow'); const f = 1 - Math.min(.5, Math.abs(o.dy || 0) * .05); paint(ellPts(x + (o.dx || 0) * u, y + u * .15, u * 5.4 * f, u * .95 * f, 22), { fill: PAL.ink, fillOp: 80, bleed: .25, tex: .3, border: .1, ink: null }); }
  push();
  translate(x + (o.dx || 0) * u, y + (o.dy || 0) * u);
  if (o.rot) rotate(o.rot);
  scale((o.flip ? -1 : 1) * (1 + sq * .6), 1 - sq);

  // ---------------- the tail, behind him: out past his right haunch (screen-right), curling up
  rs('tail');
  const tw = o.tail ?? Math.sin(T * 1.7 + (o.seed || 0)) * .35;
  const tp = [[2.3, -.7], [4.4, -.9], [5.5, -2.3 - tw * .3], [5.5 + tw * .9, -4.2], [5.0 + tw * 1.4, -5.0]];
  paint(U(ribbon(tp, .62, .3), u), { wash: col, ink: INK, sw: sw * .75, curv: .5 });
  if (tiger) for (const k of [.35, .55, .75, .92]) { const i = Math.floor(k * 4), f = k * 4 - i, a = tp[i], b = tp[Math.min(4, i + 1)], cx = lerp(a[0], b[0], f), cy = lerp(a[1], b[1], f); paint(ellPts(cx * u, cy * u, .32 * u, .14 * u, 8, 0, Math.atan2(b[1] - a[1], b[0] - a[0]) + Math.PI / 2), { wash: C.stripe, ink: null }); }
  else paint(lionLobes(tp[4][0] * u, (tp[4][1] - .15) * u, .62 * u, .72 * u, 5, .3, tw), { wash: C.maneDk, ink: INK, sw: sw * .65, curv: .5 });
  if (o.behind) { rs('behind'); o.behind(u, sw); }

  // ---------------- the body: a pear from the haunches up to the chest, then the haunches and hind paws over its sides
  rs('torso');
  paint(UB([[-2.2, -8.2], [2.2, -8.2], [2.8 + inh * .2, -6.2], [3.1, -3.5], [3.0, -1.0], [2.0, -.2], [-2.0, -.2], [-3.0, -1.0], [-3.1, -3.5], [-2.8 - inh * .2, -6.2]]), { wash: col, fill: dk, fillOp: 35, bleed: .06, tex: .5, border: .4, ink: INK, sw: sw * .9, curv: .5 });
  paint(UB([[-1.35, -7.7], [1.35, -7.7], [1.7 + inh * .2, -5.4], [1.35, -2.0], [0, -1.1], [-1.35, -2.0], [-1.7 - inh * .2, -5.4]]), { wash: C.cream, ink: null, curv: .5 });
  if (tiger) for (const s of [-1, 1]) for (const yy of [-6.0, -4.4, -2.9]) stripe([[s * 3.05, yy], [s * 2.55, yy + .15], [s * 2.15, yy + .45]], .32, .05);
  rs('haunch');
  for (const s of [-1, 1]) {
    paint(ellPts(s * 2.7 * u, -2.15 * u, 2.15 * u, 2.05 * u, 22, J), { wash: s < 0 ? col : lt, fill: dk, fillOp: s < 0 ? 45 : 20, tex: .4, ink: INK, sw: sw * .85 });
    inkLine(U([[s * 1.2, -3.0], [s * 1.0, -1.6], [s * 1.25, -.4]], u), sw * .5, dk, 'inkfine', .5);   // where the thigh meets the belly
    if (tiger) for (const a of [-.9, -.3, .3]) stripe([[s * (2.7 + Math.cos(a) * 2.1), -2.15 + Math.sin(a) * 2.0], [s * (2.7 + Math.cos(a) * 1.4), -2.15 + Math.sin(a) * 1.4]], .3, .05);
    // the hind paw, toes forward at the front of the haunch
    paint(ellPts(s * 3.55 * u, -.42 * u, 1.08 * u, .55 * u, 14, J), { wash: s < 0 ? col : lt, ink: INK, sw: sw * .8 });
    for (const k of [-.35, .05, .45]) inkLine(U([[s * 3.55 + k * s, -.02], [s * 3.55 + k * s, -.28]], u), sw * .45, dk, 'inkfine', 0);
  }

  // ---------------- the mane (the lion) or the cheek ruff (the tiger), then the head
  const [hox, hoy] = lionHeadOff(o);
  push();
  translate(hox * u, (hoy + LIO_DROP) * u);
  translate(0, LIO_NECK * u); if (o.htilt) rotate(o.htilt); scale(LIO_HS); translate(0, -LIO_NECK * u);
  const puff = clamp((o.mane ?? 0) + inh * .5), droop = Math.max(sl, clamp(o.maneDroop || 0)), wind = o.wind || 0;
  if (!tiger) {
    rs('mane');
    const R = 1 + puff * .08, bri = .16 + puff * .1;
    paint(lionLobes(0, -11.4 * u + droop * .5 * u, 5.0 * u * R, 4.7 * u * R, 13, bri, .1 + wind * .1, droop, wind), { wash: C.maneDk, ink: INK, sw: sw * .9, curv: .45 });
    paint(lionLobes(0, -11.6 * u + droop * .45 * u, 4.35 * u * R, 4.05 * u * R, 12, bri * .9, .35 + wind * .1, droop, wind), { wash: C.mane, fill: C.maneDk, fillOp: 30, tex: .5, ink: null, curv: .45 });
    for (let i = 0; i < 10; i++) {   // strands
      const a = i / 10 * TAU + .2, r0 = 3.3, r1 = 4.2 * R;
      inkLine([[Math.cos(a) * r0 * u, (-11.6 + Math.sin(a) * r0 * .94 + droop * .45) * u], [Math.cos(a + .08) * r1 * u, (-11.6 + Math.sin(a + .08) * r1 * .94 + droop * .5) * u]], sw * .45, C.maneLt, 'inkfine', .3);
    }
  } else {
    rs('ruff');
    for (const s of [-1, 1]) paint(U([[s * 2.4, -12.4], [s * 3.15, -12.0], [s * 3.0, -11.5], [s * 3.6, -11.1], [s * 3.1, -10.7], [s * 3.4, -10.0], [s * 2.7, -9.85], [s * 2.8, -9.2], [s * 2.0, -9.4]], u), { wash: C.cream, ink: INK, sw: sw * .75, curv: .2 });
  }
  rs('ears');
  for (const s of [-1, 1]) {
    paint(ellPts(s * 2.3 * u, -13.85 * u, .98 * u, .95 * u, 14, J), { wash: tiger ? (C.stripe || col) : col, ink: INK, sw: sw * .75 });
    paint(ellPts(s * 2.25 * u, -13.7 * u, .55 * u, .55 * u, 12), { wash: tiger ? C.cream : C.padLt, ink: null });
  }
  rs('head');
  push(); translate(hx * .25 * u, 0);
  const head = U([[-2.9, -11.6], [-2.75, -13.1], [-2.0, -14.1], [0, -14.45], [2.0, -14.1], [2.75, -13.1], [2.9, -11.6], [2.6, -10.1], [1.7, -9.15], [0, -8.85], [-1.7, -9.15], [-2.6, -10.1]], u);
  paint(head, { wash: col, ink: null, curv: .5 });
  paint(ellPts(-1.0 * u, -13.2 * u, 1.5 * u, .75 * u, 14, J * 2, -.2), { fill: lt, fillOp: 120, bleed: .2, tex: .8, border: .8, ink: null });
  if (tiger) {   // forehead marks and cheek stripes
    stripe([[0, -14.35], [0, -13.55]], .3, .08); stripe([[-.7, -14.2], [-.55, -13.6]], .24, .06); stripe([[.7, -14.2], [.55, -13.6]], .24, .06);
    for (const s of [-1, 1]) { stripe([[s * 2.88, -12.0], [s * 2.35, -11.85], [s * 2.0, -11.95]], .28, .04); stripe([[s * 2.75, -11.0], [s * 2.3, -10.85]], .24, .04); }
  }
  paint(head, { ink: INK, sw, curv: .5 });
  pop();

  push(); translate(hx * .5 * u, 0);
  // ---- brows: fur tufts; brows -1 (angry) .. +1 (raised), worry tilts the inner ends up
  rs('brows');
  const ek = Array.isArray(o.eyes) ? o.eyes[0] : o.eyes;
  const bAng = clamp((o.brows ?? 0) - (['angry', 'determined', 'red'].includes(ek) ? .9 : 0), -1, 1), wy = clamp(o.worry || 0) + (['sad', 'scared'].includes(ek) ? .7 : 0);
  for (const s of [-1, 1]) {
    const b = (s < 0 ? o.browL : o.browR) ?? 0, lift = Math.max(0, bAng) * .4 + b * .35;
    const inY = -13.25 - lift + Math.min(0, bAng) * -.38 - wy * .35, outY = -13.35 - lift - Math.min(0, bAng) * -.12 + wy * .12;
    paint(U(ribbon([[s * .45, inY], [s * 1.15, (inY + outY) / 2 - .14], [s * 1.95, outY]], .42, .2), u), { wash: tiger ? C.stripe : C.maneDk, ink: null });
  }
  // ---- eyes
  rs('eyes');
  const kinds = Array.isArray(o.eyes) ? o.eyes : o.eyes === 'wink' ? ['normal', 'happy'] : [o.eyes || 'normal', o.eyes || 'normal'];
  const own = k => ['normal', 'look', 'wide', 'happy', 'closed', 'squeeze', 'sad', 'angry', 'tired', 'side'].includes(k);
  if (kinds.every(own)) {
    const blink = ((T * .85 + (o.seed || 0) * 1.7 + .9) % 3.8) < .11;
    [-1, 1].forEach((s, i) => {
      const k = (o.squint || 0) > .6 ? 'squeeze' : kinds[i], ex = s * 1.2, ey = -12.35;
      if (k === 'happy') { inkLine(U([[ex - .6, ey + .2], [ex, ey - .4], [ex + .6, ey + .2]], u), sw * 1.3, INK, 'ink', .6); return; }
      if (k === 'closed' || (blink && k !== 'wide')) { inkLine(U([[ex - .6, ey - .05], [ex, ey + .32], [ex + .6, ey - .05]], u), sw * 1.2, INK, 'ink', .6); return; }
      if (k === 'squeeze') { inkLine(U([[ex - s * .6, ey - .42], [ex + s * .38, ey], [ex - s * .6, ey + .38]], u), sw * 1.3, INK, 'ink', .2); return; }
      const wide = k === 'wide', rx = wide ? .74 : .64, ry = wide ? .86 : .74;
      const lx = (o.lookX ?? (k === 'side' ? .9 : 0)) * .24, ly = (o.lookY || 0) * .2;
      paint(U(ellPts(ex, ey, rx, ry, 18), u), { wash: C.white, ink: null });
      const ir = wide ? .34 : .46, cx = ex + lx * (wide ? 1.3 : 1), cy = ey + ly + (k === 'tired' || k === 'side' ? .12 : 0);
      paint(ellPts(cx * u, cy * u, ir * u, ir * 1.12 * u, 14), { wash: C.iris, ink: null });
      paint(ellPts(cx * u, cy * u, ir * .52 * u, ir * .62 * u, 10), { wash: C.eye, ink: null });
      paint(ellPts((cx - .15) * u, (cy - .2) * u, .13 * u, .15 * u, 8), { wash: C.white, ink: null });
      if (k === 'tired' || k === 'side' || k === 'angry') {   // a heavy lid over the top: flat, or slanting in for angry
        const ang = k === 'angry' ? s * .62 : 0, top = ey - ry - .2, mid = ey - (k === 'side' ? .12 : k === 'angry' ? .12 : .02);
        paint(U([[ex - rx - .12, top], [ex + rx + .12, top], [ex + rx + .12, mid - ang * rx], [ex - rx - .12, mid + ang * rx]], u), { wash: col, ink: null });
        inkLine(U([[ex - rx - .1, mid + ang * rx], [ex + rx + .1, mid - ang * rx]], u), sw * 1.25, INK, 'ink', 0);
        if (k === 'tired') inkLine(U([[ex - .45, ey + ry + .12], [ex, ey + ry + .26], [ex + .45, ey + ry + .12]], u), sw * .5, dk, 'inkfine', .5);   // bags
      } else inkLine(U([[ex - rx * 1.05, ey + .05], [ex - rx * .5, ey - ry * .97], [ex + rx * .5, ey - ry * .97], [ex + rx * 1.05, ey + .05]], u), sw * 1.25, INK, 'ink', .5);
      if (tiger) for (const l of [0, 1]) inkLine(U([[ex + s * rx * (.75 + l * .2), ey - ry * (.75 - l * .35)], [ex + s * (rx + .38), ey - ry * (1.0 - l * .45)]], u), sw * .6, INK, 'inkfine', .3);   // lashes
      if (k === 'sad') inkLine(U([[ex - .5, ey + ry * .75], [ex + .5, ey + ry * .75]], u), sw * .5, dk, 'inkfine', .5);
    });
  } else { push(); translate(0, -12.1 * u); scale(.5); translate(0, 6 * u); eyes(u, o, sw / .5 * .85, [-1, 1], 0); pop(); }

  // ---- the muzzle: two cream cheeks and a chin, whisker dots, the nose, the mouth
  rs('muzzle');
  if (o.blush) for (const s of [-1, 1]) paint(ellPts(s * 2.05 * u, -11.0 * u, .72 * u, .4 * u, 14), { fill: C.cheek, fillOp: 170 * clamp(o.blush), bleed: .2, tex: .4, ink: null });
  const m = o.mouth || 'smile', mk = clamp(o.mouthK ?? 1, 0, 1.4), big = m === 'roar' ? mk : 0;
  paint(ellPts(0, (-9.45 + big * .5) * u, (.68 + big * .25) * u, (.45 + big * .45) * u, 14, J), { wash: C.creamDk, ink: INK, sw: sw * .6 });   // chin
  for (const s of [-1, 1]) {
    paint(ellPts(s * (.78 + big * .2) * u, (-10.25 - big * .25) * u, 1.0 * u, .78 * u, 16, J), { wash: C.cream, ink: INK, sw: sw * .65 });
    for (const [wx, wy] of [[.5, -10.45], [.85, -10.15], [1.2, -10.4]]) paint(ellPts(s * (wx + big * .2) * u, (wy - big * .25) * u, .07 * u, .07 * u, 6), { wash: dk, ink: null });
  }
  rs('mouth');
  const my = -10.1, dark = C.mouth;
  if (m === 'roar') {   // wide open between the lifted cheeks: top teeth, four fangs, a tongue
    const w = .75 + .6 * mk, d = .7 + 1.25 * mk, t0 = my - .45 * mk;
    paint(U([[-w, t0], [w, t0], [w * .9, t0 + d * .55], [w * .45, t0 + d], [-w * .45, t0 + d], [-w * .9, t0 + d * .55]], u), { wash: dark, ink: INK, sw: sw * .9, curv: .45 });
    paint(U([[-w * .55, t0 + d * .7], [w * .55, t0 + d * .7], [w * .35, t0 + d * .96], [-w * .35, t0 + d * .96]], u), { wash: C.tongue, ink: null, curv: .5 });
    for (const s of [-1, 1]) {
      paint(U([[s * w * .78, t0 + .06], [s * w * .5, t0 + .06], [s * w * .64, t0 + .55 * mk + .1]], u), { wash: C.white, ink: INK, sw: sw * .4 });
      paint(U([[s * w * .5, t0 + d * .92], [s * w * .25, t0 + d * .92], [s * w * .38, t0 + d * .62]], u), { wash: C.white, ink: INK, sw: sw * .4 });
    }
  } else if (m === 'open' || m === 'talk') {
    const d = .3 + .75 * mk, w = .55 + .2 * mk;
    paint(U([[-w, my - .25], [w, my - .25], [w * .7, my - .25 + d], [0, my - .15 + d * 1.05], [-w * .7, my - .25 + d]], u), { wash: dark, ink: INK, sw: sw * .75, curv: .5 });
    if (d > .5) paint(U([[-w * .5, my - .3 + d * .8], [w * .5, my - .3 + d * .8], [0, my - .18 + d]], u), { wash: C.tongue, ink: null, curv: .5 });
  } else if (m === 'grin') {
    paint(U([[-1.15, my - .3], [1.15, my - .3], [.8, my + .45], [0, my + .7], [-.8, my + .45]], u), { wash: dark, ink: INK, sw: sw * .8, curv: .45 });
    paint(U([[-.5, my + .38], [.5, my + .38], [0, my + .65]], u), { wash: C.tongue, ink: null, curv: .5 });
    paint(U([[-1.0, my - .27], [1.0, my - .27], [.8, my - .02], [-.8, my - .02]], u), { wash: C.white, ink: null, curv: .3 });
  } else if (m === 'O') paint(U(ellPts(0, my + .05, .36, .46, 12), u), { wash: dark, ink: INK, sw: sw * .7 });
  else if (m === 'frown') inkLine(U([[-.85, my + .25], [-.4, my - .08], [0, my - .25], [.4, my - .08], [.85, my + .25]], u), sw * .9, INK, 'ink', .5);
  else if (m === 'flat') inkLine(U([[-.65, my], [.65, my]], u), sw * .85, INK, 'ink', 0);
  else if (m === 'wobble') inkLine(U([[-.75, my + .05], [-.37, my - .1], [0, my + .05], [.37, my - .1], [.75, my + .05]], u), sw * .85, INK, 'ink', .5);
  else if (m === 'smirk') inkLine(U([[-.7, my + .02], [.1, my + .05], [.8, my - .32]], u), sw * .9, INK, 'ink', .6);
  else if (m === 'smile') {
    inkLine(U([[0, -10.78], [0, -10.35]], u), sw * .7, INK, 'inkfine', 0);
    for (const s of [-1, 1]) inkLine(U([[0, -10.35], [s * .42, -10.05], [s * .85, -10.2]], u), sw * .85, INK, 'ink', .6);
  } else { push(); translate(0, my * u); scale(.42); translate(0, 4.3 * u); mouth(u, m, sw / .42 * .8); pop(); }
  rs('nose');
  paint(U([[-.66, -11.38], [.66, -11.38], [.38, -10.98], [0, -10.76], [-.38, -10.98]], u), { wash: C.nose, ink: INK, sw: sw * .6, curv: .45 });
  paint(ellPts(-.22 * u, -11.22 * u, .17 * u, .08 * u, 8), { wash: C.padLt, ink: null });
  pop();   // face offset
  if (o.hat) { rs('hat'); o.hat(u, sw); }
  pop();   // head

  if (o.held) { rs('held'); o.held(u, sw); }

  // ---------------- forelegs: from the shoulder (under the mane) to the paw
  for (const s of [-1, 1]) {
    rs('leg' + s);
    const [sh, el, ha] = lionArm(o, s), sk = s < 0 ? col : lt, shape = o[s < 0 ? 'pawL' : 'pawR'] ? (s < 0 ? o.pawShapeL : o.pawShapeR) || 'pad' : 'rest';
    paint(U(ribbon([sh, el, ha], 1.55, 1.25), u), { wash: sk, fill: dk, fillOp: s < 0 ? 40 : 15, tex: .4, ink: INK, sw: sw * .85, curv: .35 });
    if (tiger) for (const k of [.3, .55, .78]) {
      const a = k < .5 ? sh : el, b = k < .5 ? el : ha, f = k < .5 ? k * 2 : (k - .5) * 2, cx = lerp(a[0], b[0], f), cy = lerp(a[1], b[1], f);
      const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
      stripe([[cx + nx * .7, cy + ny * .7], [cx + nx * .15, cy + ny * .15 + .1]], .26, .04);
    }
    push(); translate(ha[0] * u, ha[1] * u);
    if (shape === 'rest') { translate(0, -.08 * u); lionPawShape(u, sw, 'rest', s, sk, dk, C, INK); }
    else { rotate((s < 0 ? o.pawAL : o.pawAR) ?? Math.atan2(ha[1] - el[1], ha[0] - el[0])); translate(-.35 * u, 0); lionPawShape(u, sw, shape, s, sk, dk, C, INK, s < 0 ? (o.beansL ?? o.beans ?? 0) : (o.beansR ?? 0)); }
    pop();
  }
  pop();

  if (o.emote) {
    rs('emote');
    const [ex, ey] = lionWorld(x, y, u, o, (o.flip ? -1 : 1) * 5.2, lionHeadPt(o, 0, -15.0)[1]);
    const top = EMOTE_TOP.includes(o.emote);
    emote(o.emote, top ? lionHead(x, y, u, o)[0] : ex, top ? lionWorld(x, y, u, o, 0, lionHeadPt(o, 0, -17.2)[1])[1] : ey, u * 1.1, o.emoteK ?? 1, o.emoteAge ?? T);
  }
  rs('after');
}

// Model sheet: studio.html?loop=lion, or node render.mjs --loop=lion --sheet=0.5,1.5,2.5,3.5 --cols=4 --w=540
(() => {
  LOOPS.lion = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: '#EDE3D2', ink: null });
    const u = 26, cyc = t % 4;
    // 1 · an emotion timeline: neutral → angry → tired
    lion(270, 720, u, { ...emotions(t, [[0, 'neutral'], [1.3, 'angry'], [2.6, 'sad']]), boilKey: 'm1' });
    // 2 · the union leader: a megaphone at the mouth, yelling (talk), the other paw up counting four beans
    const yell = .6 + .5 * Math.abs(Math.sin(t * 7));
    lion(800, 720, u, { eyes: 'angry', mouth: 'talk', mouthK: yell, inhale: .4, pawL: [-4.4, -12.6], pawShapeL: 'pad', beans: Math.min(4, cyc * 1.4),
      pawR: [2.4, -9.9], pawShapeR: 'hold', bendR: 1, boilKey: 'm2',
      hat: (u, sw) => { paint(U([[-2.75, -13.6], [-1.2, -14.05], [1.2, -14.05], [2.75, -13.6], [2.8, -13.0], [1.2, -13.45], [-1.2, -13.45], [-2.8, -13.0]], u), { wash: '#D2352C', ink: LIO.ink, sw: sw * .7, curv: .4 }); },
      held: (u, sw) => paint(U([[2.0, -10.6], [5.2, -12.4], [5.6, -8.6], [2.0, -9.6]], u), { wash: '#F4E6C8', ink: LIO.ink, sw }) });
    // 3 · the tigress: tired, side-eye
    lion(270, 1480, u * .92, { kind: 'tiger', eyes: cyc < 2 ? 'side' : 'tired', mouth: cyc < 2 ? 'flat' : 'frown', slump: cyc < 2 ? 0 : .8, boilKey: 'm3', seed: 2 });
    // 4 · the ROAR: inhale, then roar with the mane flaring; then proud
    const inh = cyc < 1.3 ? ease(cyc / 1.3) : 0, roaring = cyc >= 1.3 && cyc < 2.6;
    lion(800, 1480, u, { inhale: inh, mane: roaring ? .8 : 0, eyes: roaring ? 'squeeze' : cyc >= 2.6 ? 'happy' : 'normal', mouth: roaring ? 'roar' : cyc >= 2.6 ? 'grin' : 'smile',
      mouthK: roaring ? 1.2 : 1, wind: roaring ? Math.sin(t * 30) * .3 : 0, pawR: roaring ? [4.6, -6.5] : undefined, pawShapeR: 'pad', boilKey: 'm4', blush: cyc >= 2.6 ? .6 : 0 });
    // 5 · the paw shapes, big
    ['rest', 'pad', 'hold'].forEach((sh, i) => { push(); translate(240 + i * 300, 1820); rotate(sh === 'rest' ? 0 : -Math.PI / 2); lionPawShape(40, 1.5, sh, 1, LIO.body, LIO.dk, LIO, LIO.ink, sh === 'pad' ? 2 : 0); pop(); });
  };
  LOOPS.lion.len = 4;
})();

// ======================================================================================================================
// lionRun(): Sher in SIDE VIEW, running, leaping and pouncing (facing screen-right; flip: true faces left), with a 3/4
// head so both eyes and the mouth still act. A rider sits on his back through the rider(u, sw) hook (drawn last, in
// world space), at lionRunSeat(...); Durga at about .6× his u.
// (x, y) is the ground under the middle of him; u is the size unit (about 17u from tail root to nose, 14u to the top of
// the mane standing).
//
// Body-local coordinates in u (y up is negative): hips (-3.3, -5.6) · shoulders (2.7, -6.1) · back -8.4 · belly -3.6 ·
// seat (-1.5, -8.2) · head centre (6.5, -11.0), drawn 1.3× (nose about (11, -10.9)) · tail root (-4.9, -6.9)
//
// Options (all optional):
//   pose:   run (phase: a gallop; the legs cycle, the body rocks and bobs), stride 0..1 (default 1), leap 0..1 (the
//           stretched flight pose: forelegs reach, hind legs kick back), crouch 0..1 (low, legs gathered, before a
//           pounce), land 0..1 (a squash on the landing), pitch (radians, + noses up), dx, dy (u), sq, rot, flip
//   head:   nod (radians: + dips the head), hx (-1..1: turns the face toward us), wind (-1..1: the mane streams back;
//           default from run)
//   paws:   raise 0..1 (the near forepaw comes up by his cheek: a wind-up), reach 0..1 (it swipes forward: the paw SLAP)
//   face:   eyes ('normal' | 'wide' | 'angry' | 'happy' | 'closed' | 'squeeze' | 'side'), mouth ('smile' | 'grin' |
//           'talk' | 'open' | 'roar' | 'flat' | 'frown' | 'O' | 'smirk') + mouthK, lookX / lookY, blush, seed, brows
//   look:   pal (overrides the colours), tail (-1..1)
//   hooks:  rider(u, sw) (WORLD space, drawn last, over the back of his mane: draw the rider at lionRunSeat(...)),
//           hat(u, sw) (head space: head-local
//           coordinates, centre (0, 0)), behind(u, sw)
//   extras: emote + emoteK + emoteAge, boilKey, noShadow, swMul
// Helpers: lionRunSeat / lionRunHead / lionRunMouth / lionRunPaw(x, y, u, o) → world [x, y].
const LRN_HEAD = [6.5, -11.0], LRN_HS = 1.3;   // the head and mane are drawn 1.3× about the head centre
function lionRunPose(o) {
  const run = o.run, lp = clamp(o.leap || 0), cr = clamp(o.crouch || 0), ld = clamp(o.land || 0);
  const ph = run == null ? 0 : run * TAU, st = run == null ? 0 : (o.stride ?? 1);
  const pitch = (o.pitch || 0) + Math.sin(ph) * .07 * st + lp * .06 - cr * .05;
  const bob = (run == null ? 0 : -Math.abs(Math.sin(ph)) * .55 * st) - lp * .4 + cr * 1.5 + ld * .9;
  return { ph, st, pitch, bob, lp, cr, ld };
}
// a body-local point → its posed position: pitched about the middle of the back, bobbed
function lionRunLocal(o, px, py) {
  const { pitch, bob } = lionRunPose(o), cx = 0, cy = -6, a = -pitch;
  const dx = px - cx, dy = py - cy;
  return [cx + dx * Math.cos(a) - dy * Math.sin(a), cy + dx * Math.sin(a) + dy * Math.cos(a) + bob];
}
function lionRunWorld(x, y, u, o, px, py) {
  const sq = (o.sq || 0), fx = o.flip ? -1 : 1, r = o.rot || 0, lx = fx * px * u * (1 + sq * .6), ly = py * u * (1 - sq);
  return [x + (o.dx || 0) * u + lx * Math.cos(r) - ly * Math.sin(r), y + (o.dy || 0) * u + lx * Math.sin(r) + ly * Math.cos(r)];
}
function lionRunSeat(x, y, u, o = {}) { const [px, py] = lionRunLocal(o, -1.5, -8.2); return lionRunWorld(x, y, u, o, px, py); }
function lionRunHead(x, y, u, o = {}) { const [px, py] = lionRunLocal(o, ...LRN_HEAD); return lionRunWorld(x, y, u, o, px, py); }
function lionRunMouth(x, y, u, o = {}) { const [px, py] = lionRunLocal(o, LRN_HEAD[0] + 2.4 * LRN_HS, LRN_HEAD[1] + 1.4 * LRN_HS); return lionRunWorld(x, y, u, o, px, py); }
// leg i: 0 near hind, 1 far hind, 2 near fore, 3 far fore → [root, joint, foot] in body-local u (posed)
function lionRunLeg(o, i) {
  const { ph, st, lp, cr, ld } = lionRunPose(o), hind = i < 2, far = i % 2 === 1;
  const root0 = hind ? [far ? -2.7 : -3.3, -5.6] : [far ? 3.2 : 2.7, -6.1];
  const root = lionRunLocal(o, ...root0);
  const L1 = hind ? 3.0 : 2.9, L2 = hind ? 3.0 : 3.0;
  // the foot target: under the root at rest; on a gallop, an ellipse (forward on the ground, up and back in the air)
  const off = [0, .12, .5, .62][i], th = ph + off * TAU;
  let fx = root0[0] + (hind ? -.2 : .3), fy = -.05;
  if (o.run != null) { fx += Math.cos(th) * 2.6 * st; fy = -Math.max(0, Math.sin(th)) * 2.2 * st - .05; }
  // crouch: feet tuck under; leap: forelegs reach, hind legs kick back; reach (near fore only): the slap
  fx = lerp(fx, root0[0] + (hind ? .9 : -.6), cr * .6);
  fx = lerp(fx, hind ? root0[0] - 4.6 : root0[0] + 4.6, lp); fy = lerp(fy, hind ? -3.6 : -4.6, lp);
  if (i === 2 && o.raise) { const rk = clamp(o.raise); fx = lerp(fx, root0[0] + .6, rk); fy = lerp(fy, -11.4, rk); }   // the wind-up: paw up by his cheek
  if (i === 2 && o.reach) { const rk = clamp(o.reach); fx = lerp(fx, root0[0] + 6.5, rk); fy = lerp(fy, -9.6, rk); }
  // feet on the ground stay on the ground through the bob (the body comes down, the knees bend)
  const [gx, gy] = lionRunLocal(o, fx, fy), foot = [fx, lp > .5 || (i === 2 && ((o.reach || 0) > .3 || (o.raise || 0) > .3)) ? gy : Math.min(gy, fy + ld * .0)];
  foot[0] = gx;
  let dx = foot[0] - root[0], dy = foot[1] - root[1], d = Math.hypot(dx, dy) || 1e-3;
  const reachMax = L1 + L2 - .05;
  if (d > reachMax) { foot[0] = root[0] + dx / d * reachMax; foot[1] = root[1] + dy / d * reachMax; dx = foot[0] - root[0]; dy = foot[1] - root[1]; d = reachMax; }
  d = Math.max(d, .8);
  const a = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1)), base = Math.atan2(dy, dx);
  const j1 = [root[0] + Math.cos(base + a) * L1, root[1] + Math.sin(base + a) * L1], j2 = [root[0] + Math.cos(base - a) * L1, root[1] + Math.sin(base - a) * L1];
  // hind: the hock points back; fore: the elbow points back too, the wrist folds when the paw lifts
  const joint = (hind ? j1[0] < j2[0] : j1[0] < j2[0]) ? j1 : j2;
  return [root, joint, foot];
}
function lionRunPaw(x, y, u, o = {}, i = 2) { const [, , f] = lionRunLeg(o, i); return lionRunWorld(x, y, u, o, f[0], f[1]); }

function lionRun(x, y, u, o = {}) {
  const id = o.boilKey ?? 'lr' + (++CLAWD_N), rs = p => boilSeed(`lionrun ${id} ${p}`);
  const C = { ...LIO, ...(o.pal || {}) }, INK = C.ink;
  const sq = (o.sq || 0) + (o.take || 0) + clamp(o.land || 0) * .12 - clamp(o.leap || 0) * .06, sw = clamp(u / 20, .4, 2) * (o.swMul || 1), J = u * .035;
  const { col, dk, lt } = tintCols({ tint: o.tint, tintK: o.tintK, col: C.body, dk: C.dk, lt: C.lt });
  const pose = lionRunPose(o), L = (px, py) => lionRunLocal(o, px, py), LP = pts => U(pts.map(([a, b]) => L(a, b)), u);
  const wind = o.wind ?? (o.run != null ? .8 * (o.stride ?? 1) : 0) + pose.lp * .8;

  if (!o.noShadow) { rs('shadow'); const f = 1 - Math.min(.6, Math.abs(o.dy || 0) * .04 + pose.lp * .3); paint(ellPts(x + (o.dx || 0) * u, y + u * .15, u * 7.5 * f, u * 1.0 * f, 22), { fill: PAL.ink, fillOp: 80 * f, bleed: .25, tex: .3, border: .1, ink: null }); }
  push();
  translate(x + (o.dx || 0) * u, y + (o.dy || 0) * u);
  if (o.rot) rotate(o.rot);
  scale((o.flip ? -1 : 1) * (1 + sq * .6), 1 - sq);
  if (o.behind) { rs('behind'); o.behind(u, sw); }

  const leg = (i, c) => {
    const [r, j, f] = lionRunLeg(o, i), hind = i < 2;
    paint(U(ribbon([r, j, f], hind ? 2.5 : 2.0, 1.35), u), { wash: c, fill: dk, fillOp: i % 2 ? 50 : 25, tex: .4, ink: INK, sw: sw * .8, curv: .35 });
    const a = Math.atan2(f[1] - j[1], f[0] - j[0]), lifted = f[1] < -.5;
    push(); translate(f[0] * u, f[1] * u); rotate(lifted ? a - Math.PI / 2 : 0); scale(i === 2 && (o.reach || o.raise) ? 1.25 + .35 * clamp(Math.max(o.reach || 0, o.raise || 0)) : 1.25);
    paint(U([[-.75, -.35], [.2, -.55], [1.05, -.35], [1.25, .05], [1.0, .32], [-.7, .32], [-.95, 0]], u), { wash: c, ink: INK, sw: sw * .75, curv: .5 });
    for (const k of [.35, .7]) inkLine(U([[k, .3], [k - .05, .02]], u), sw * .45, dk, 'inkfine', 0);
    pop();
  };
  // ---- far legs (darker), the tail
  rs('far'); leg(1, mixCol(col, dk, .55)); leg(3, mixCol(col, dk, .55));
  rs('tail');
  const tw = o.tail ?? Math.sin(T * 2.3 + (o.seed || 0)) * .4, ts = clamp(wind) * 1.4;
  const tp = [L(-4.9, -6.9), L(-6.3, -7.9 + ts * .3), L(-7.0 - ts * .8, -9.6 + tw * .6 + ts * .6), L(-6.6 - ts * 1.6 + tw * .5, -11.3 + tw * .4 + ts * 1.2)];
  paint(U(ribbon(tp, .7, .35), u), { wash: col, ink: INK, sw: sw * .7, curv: .5 });
  paint(lionLobes(tp[3][0] * u, tp[3][1] * u, .7 * u, .62 * u, 5, .3, tw), { wash: C.maneDk, ink: INK, sw: sw * .6, curv: .5 });
  // ---- the body: one bean from the haunch to the chest
  rs('body');
  const body = LP([[-5.4, -6.4], [-4.8, -8.0], [-3.0, -8.6], [-.5, -8.3], [2.0, -8.4], [4.0, -8.0], [4.6, -6.4], [4.0, -4.6], [2.4, -3.9], [0, -3.7], [-2.6, -3.7], [-4.7, -4.4]]);
  paint(body, { wash: col, fill: dk, fillOp: 35, bleed: .06, tex: .5, border: .4, ink: INK, sw: sw * .9, curv: .5 });
  paint(LP([[-3.4, -4.1], [0, -3.9], [2.6, -4.2], [1.8, -4.7], [-1.4, -4.6]]), { wash: C.cream, ink: null, curv: .5 });   // the pale belly
  paint(U(ellPts(...L(-3.6, -6.0), 2.1, 2.0, 18), 1).map(([a, b]) => [a * u, b * u]), { wash: lt, fill: dk, fillOp: 20, tex: .4, ink: INK, sw: sw * .7 });   // the haunch
  // ---- near legs
  const slapping = (o.reach || 0) > .05 || (o.raise || 0) > .05;   // a raised paw is drawn over his mane
  rs('near'); leg(0, col); if (!slapping) leg(2, lt);

  // ---- the mane and the 3/4 head, about the neck (nods)
  const [hcx, hcy] = L(...LRN_HEAD), a = -(pose.pitch) * .5 + (o.nod || 0);
  push(); translate(hcx * u, hcy * u); rotate(a); scale(LRN_HS);
  rs('mane');
  const wb = clamp(wind, -1, 1.5), R = 1 + clamp(o.mane || 0) * .08;
  const lobes = (cx, cy, rx, ry, n, dp, phs) => { const P = []; for (let i = 0; i < n * 2; i++) { const t = i / (n * 2) * TAU + phs, r = i % 2 ? 1 : 1 - dp, ca = Math.cos(t); P.push([(cx + ca * rx * r - wb * (1 - ca) * .5 * rx * .22) * u, (cy + Math.sin(t) * ry * r) * u]); } return P; };
  paint(lobes(-.9, .1, 4.1 * R, 4.4 * R, 13, .17, .2 + Math.sin(T * 4) * .03 * wb), { wash: C.maneDk, ink: INK, sw: sw * .9, curv: .45 });
  paint(lobes(-.6, .0, 3.45 * R, 3.75 * R, 12, .15, .45), { wash: C.mane, fill: C.maneDk, fillOp: 30, tex: .5, ink: null, curv: .45 });
  for (let i = 0; i < 8; i++) { const t = i / 8 * TAU + .3; inkLine([[(-.6 + Math.cos(t) * 2.7) * u, Math.sin(t) * 2.9 * u], [(-.6 + Math.cos(t + .1) * 3.5 - wb * .5) * u, Math.sin(t + .1) * 3.7 * u]], sw * .45, C.maneLt, 'inkfine', .3); }
  if (o.hat) { /* drawn after the face */ }
  rs('ears');
  paint(ellPts(.9 * u, -2.75 * u, .8 * u, .85 * u, 12, J), { wash: mixCol(col, dk, .4), ink: INK, sw: sw * .7 });   // far ear
  paint(ellPts(-1.0 * u, -2.75 * u, .95 * u, .95 * u, 12, J), { wash: col, ink: INK, sw: sw * .75 });
  paint(ellPts(-.95 * u, -2.6 * u, .5 * u, .5 * u, 10), { wash: C.padLt, ink: null });
  rs('head');
  const hx = clamp(o.hx || 0, -1, 1) * .4;
  const head = U([[-2.3, -.6], [-2.1, -1.9], [-1.0, -2.75], [.6, -2.9], [1.9, -2.4], [2.5, -1.5], [2.9, -.6], [3.3, .3], [3.1, 1.3], [2.1, 2.1], [.4, 2.4], [-1.3, 2.0], [-2.2, 1.0]], u);
  paint(head, { wash: col, ink: null, curv: .5 });
  paint(ellPts(-.4 * u, -1.6 * u, 1.4 * u, .7 * u, 14, J * 2, -.15), { fill: lt, fillOp: 110, bleed: .2, tex: .8, border: .8, ink: null });
  paint(head, { ink: INK, sw, curv: .5 });
  // brows, eyes (near one bigger), the muzzle pushed toward the nose
  rs('face');
  const ek = Array.isArray(o.eyes) ? o.eyes[0] : o.eyes || 'normal', ang = ek === 'angry' ? -1 : clamp(o.brows || 0, -1, 1);
  const m = o.mouth || 'smile', mk = clamp(o.mouthK ?? 1, 0, 1.4), big = m === 'roar' ? mk : m === 'open' || m === 'talk' ? mk * .5 : 0;
  for (const [ex, ey, sc] of [[.25 + hx, -.75, 1], [1.95 + hx, -.85, .78]]) {
    const blink = ((T * .85 + (o.seed || 0) * 1.7 + .4) % 3.9) < .11;
    const by = ey - .95 * sc - Math.max(0, ang) * .3;
    paint(U(ribbon([[ex - .7 * sc, by + (ang < 0 ? -.25 : 0)], [ex, by - .12], [ex + .6 * sc, by + (ang < 0 ? .3 : 0)]], .36 * sc, .16), u), { wash: C.maneDk, ink: null });
    if (ek === 'happy') { inkLine(U([[ex - .5 * sc, ey + .15], [ex, ey - .35 * sc], [ex + .5 * sc, ey + .15]], u), sw * 1.2, INK, 'ink', .6); continue; }
    if (ek === 'closed' || (blink && ek !== 'wide')) { inkLine(U([[ex - .5 * sc, ey], [ex, ey + .3 * sc], [ex + .5 * sc, ey]], u), sw * 1.1, INK, 'ink', .6); continue; }
    if (ek === 'squeeze') { inkLine(U([[ex - .5 * sc, ey - .35 * sc], [ex + .3 * sc, ey], [ex - .5 * sc, ey + .32 * sc]], u), sw * 1.2, INK, 'ink', .2); continue; }
    const wide = ek === 'wide', rx = (wide ? .62 : .52) * sc, ry = (wide ? .74 : .62) * sc;
    paint(U(ellPts(ex, ey, rx, ry, 16), u), { wash: C.white, ink: null });
    const lx = ((o.lookX ?? .5) * .2 + (ek === 'side' ? .15 : 0)) * sc, ly = (o.lookY || 0) * .18 * sc, ir = (wide ? .3 : .4) * sc;
    paint(ellPts((ex + lx) * u, (ey + ly) * u, ir * u, ir * 1.12 * u, 12), { wash: C.iris, ink: null });
    paint(ellPts((ex + lx) * u, (ey + ly) * u, ir * .52 * u, ir * .62 * u, 10), { wash: C.eye, ink: null });
    paint(ellPts((ex + lx - .12) * u, (ey + ly - .16) * u, .11 * u, .13 * u, 8), { wash: C.white, ink: null });
    if (ek === 'angry' || ek === 'side') {   // a lid over the top of the eye only (it follows the eye's outline, no box)
      const sl = ek === 'angry' ? .45 : 0, mid = ey - .1, L0 = [ex - rx - .06, mid - sl * rx], R0 = [ex + rx + .06, mid + sl * rx], lid = [L0];
      for (let k = 1; k < 10; k++) { const a = Math.PI + k / 10 * Math.PI; lid.push([ex + Math.cos(a) * (rx + .08), ey + Math.sin(a) * (ry + .08)]); }
      lid.push(R0);
      paint(U(lid, u), { wash: col, ink: null });
      inkLine(U([L0, R0], u), sw * 1.2, INK, 'ink', 0);
    } else inkLine(U([[ex - rx * 1.05, ey + .05], [ex - rx * .5, ey - ry * .97], [ex + rx * .5, ey - ry * .97], [ex + rx * 1.05, ey + .05]], u), sw * 1.15, INK, 'ink', .5);
  }
  rs('muzzle');
  if (o.blush) paint(ellPts(.2 * u, .75 * u, .7 * u, .38 * u, 12), { fill: C.cheek, fillOp: 170 * clamp(o.blush), bleed: .2, tex: .4, ink: null });
  const jaw = big * 1.3;
  paint(ellPts(2.3 * u, (1.85 + jaw * .8) * u, .75 * u, (.45 + jaw * .25) * u, 12, J), { wash: C.creamDk, ink: INK, sw: sw * .6 });   // chin / lower jaw
  if (big > .05) {   // the open mouth between the cheeks and the dropped jaw: teeth, fangs, a tongue
    const t0 = 1.0, d = .4 + jaw;
    paint(U([[1.2, t0], [3.25, t0 - .1], [3.0, t0 + d * .6], [2.4, t0 + d], [1.5, t0 + d * .8]], u), { wash: C.mouth, ink: INK, sw: sw * .8, curv: .45 });
    paint(U([[1.7, t0 + d * .75], [2.8, t0 + d * .55], [2.4, t0 + d * .92]], u), { wash: C.tongue, ink: null, curv: .5 });
    for (const fx of [2.95, 1.75]) { paint(U([[fx - .18, t0 - .05], [fx + .18, t0 - .05], [fx, t0 + .3 + .25 * mk]], u), { wash: C.white, ink: INK, sw: sw * .35 }); paint(U([[fx - .2, t0 + d * .85], [fx + .15, t0 + d * .85], [fx - .05, t0 + d * .6]], u), { wash: C.white, ink: INK, sw: sw * .35 }); }
  }
  paint(ellPts(1.65 * u, .55 * u, 1.05 * u, .75 * u, 14, J), { wash: C.cream, ink: INK, sw: sw * .6 });   // near cheek
  paint(ellPts(2.85 * u, .5 * u, .75 * u, .62 * u, 12, J), { wash: C.cream, ink: INK, sw: sw * .55 });   // far cheek, at the nose
  for (const [wx, wy] of [[1.4, .55], [1.8, .3], [2.1, .65]]) paint(ellPts(wx * u, wy * u, .07 * u, .07 * u, 6), { wash: dk, ink: null });
  if (big <= .05) {
    if (m === 'grin') { paint(U([[1.1, 1.05], [3.1, .95], [2.7, 1.55], [1.6, 1.6]], u), { wash: C.mouth, ink: INK, sw: sw * .7, curv: .45 }); paint(U([[1.25, 1.07], [3.0, .98], [2.8, 1.2], [1.4, 1.25]], u), { wash: C.white, ink: null, curv: .3 }); }
    else if (m === 'frown') inkLine(U([[1.2, 1.4], [2.0, 1.1], [2.9, 1.35]], u), sw * .85, INK, 'ink', .5);
    else if (m === 'flat') inkLine(U([[1.3, 1.2], [2.9, 1.15]], u), sw * .85, INK, 'ink', 0);
    else if (m === 'O') paint(U(ellPts(2.2, 1.35, .3, .38, 10), u), { wash: C.mouth, ink: INK, sw: sw * .6 });
    else if (m === 'smirk') inkLine(U([[1.3, 1.15], [2.2, 1.2], [3.0, .85]], u), sw * .85, INK, 'ink', .6);
    else { inkLine(U([[2.75, .95], [2.75, 1.25]], u), sw * .6, INK, 'inkfine', 0); inkLine(U([[1.6, 1.15], [2.2, 1.4], [2.75, 1.25], [3.15, 1.35]], u), sw * .8, INK, 'ink', .6); }
  }
  rs('nose');
  paint(U([[2.75, -.15], [3.55, -.2], [3.45, .25], [3.15, .5], [2.85, .3]], u), { wash: C.nose, ink: INK, sw: sw * .55, curv: .45 });
  if (o.hat) { rs('hat'); o.hat(u, sw); }
  pop();
  if (slapping) { rs('slap'); leg(2, lt); }
  pop();
  if (o.rider) { rs('rider'); o.rider(u, sw); }   // last, in world space: she sits in front of the back of his mane

  if (o.emote) {
    rs('emote');
    const [ex, ey] = lionRunWorld(x, y, u, o, ...L(LRN_HEAD[0] + 1, LRN_HEAD[1] - 5.6));
    emote(o.emote, ex, ey, u * 1.1, o.emoteK ?? 1, o.emoteAge ?? T);
  }
  rs('after');
}

// Model sheet: studio.html?loop=lionrun, or node render.mjs --loop=lionrun --sheet=0.1,0.2,0.3,0.4 --cols=4 --w=540
(() => {
  LOOPS.lionrun = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: '#EDE3D2', ink: null });
    const u = 17;
    // 1 · the gallop, roaring
    lionRun(540, 430, u, { run: t * 1.6, eyes: 'angry', mouth: 'roar', mouthK: .8, boilKey: 'r1' });
    // 2 · a leap with Durga riding (she sits at the seat and rocks with him)
    const o2 = { run: t * 1.6, leap: Math.max(0, Math.sin(t * 1.6)), eyes: 'angry', mouth: 'roar', boilKey: 'r2' };
    lionRun(540, 1000, u, { ...o2, rider: () => { if (typeof durga !== 'function') return; const [sx, sy] = lionRunSeat(540, 1000, u, o2);
      durga(sx, sy, u * .6, { ...DRG_SKIN, sit: 1, eyes: 'determined', hair: .8, wild: .5, boilKey: 'rd', handL: [-5.6, -18.5], trishulA: .9, noShadow: true }); } });
    // 3 · crouch before a pounce · 4 · the paw SLAP · 5 · standing, happy
    lionRun(300, 1450, u * .8, { crouch: 1, eyes: 'angry', mouth: 'frown', boilKey: 'r4' });
    lionRun(780, 1450, u * .8, { reach: .5 + .5 * Math.sin(t * 3), eyes: 'squeeze', mouth: 'open', boilKey: 'r5', blush: .3 });
    lionRun(540, 1880, u * .8, { eyes: 'happy', mouth: 'smile', boilKey: 'r6', nod: .1 });
  };
  LOOPS.lionrun.len = 4;
})();
