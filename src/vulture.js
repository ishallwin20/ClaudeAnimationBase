// vulture.js: Jatayu and Sampati, the vulture brothers of the Ramayan (Valmiki: gṛdhra = VULTURE, never an eagle), as
// chibi birds standing (or flying) and facing us: a bare, peach-cream head with big glossy eyes and a hooked gold beak
// with a dark tip, a fluffy white ruff round the neck, a brown feathered body with a buff belly, feathered "trousers",
// grey feet with dark talons, and long wings that end in the vulture's fingered primaries.
// Front view; the face slides toward a side with hx (drawn views, not 3D). (x, y) is the ground under him (or, flying,
// the point 3.6u under his belly); u is the size unit (about 14u to the top of the head; the head is ~6.6u across).
// Load after bappa.js (U()) and clawd.js (eyes() / emote() / tintCols(), so feel() and emotions() drive him too).
//
// Body-local coordinates in u (y up is negative):
//   toes (±1.0, 0) · body -7.2..-.4, widest ±3.1 at -3.4 · ruff (0, -6.9) · shoulders (±2.6, -6.3) · neck (0, -7.6)
//   head centre (0, -10.6) · eyes (fx ± 1.25, -10.8) · beak tip (fx, -8.4) · head top -13.4
//
// Options (all optional):
//   who:    'sampati' (dark chocolate, a swept-back three-feather crest) | 'jatayu' (caramel, a single curl of down);
//           pal overrides any colour
//   age:    0 (young: a bigger head, fluffy) .. 1 (old: white bushy brows, heavy lids, forehead wrinkles, a stoop,
//           greyed feathers)
//   bald:   0..1 Sampati after the Sun: no feathers (Kishkindha 60.18): pink-grey skin, bare stubby wings with a few
//           singed quills, the ruff thinned to wisps
//   regrow: 0..1 the new wings (Kishkindha 63.9: red feathers) grow back from the shoulders out; the body re-feathers
//   burn:   0..1 the wings char from the tips in (draw flames yourself at vultureWingTip()); smoke 0..1 wisps rise
//   pose:   dx, dy (u), sq, rot (pivots at (x, y)), flip, nod (u: the head dips), htilt, lean (u), puff 0..1 (chest out,
//           pride), fly 0..1 (the feet tuck up under the belly), stoop (u: the old forward hunch, added to age's)
//   head:   hx (-1..1: the face slides to that side; + = screen right)
//   wings:  wingL / wingR = [x, y] targets in u (2-bone from the shoulder; default folded at the sides), bendL / bendR
//           (1 elbow out, -1 in), wingShapeL / wingShapeR: 'spread' (six fingered primaries: flight) | 'open' (a
//           gesture) | 'point' | 'hug' (curled round something) | 'fold'; wingAL / wingAR (the hand's angle).
//           vultureFlap(phase, amp, y0) gives flapping targets for both.
//   face:   eyes, mouth, lookX / lookY, squint, blush, brows (-1 angry .. +1 raised), browL / browR, worry 0..1, mouthK,
//           seed, tears 0..1 (streams down the cheeks), sweat 0..1 (drops fly off the head), tint + tintK.
//           His own eyes: 'normal' / 'look' / 'wide' / 'happy' / 'closed' / 'squeeze' / 'sad' / 'angry' / 'tired' /
//           'side' / 'sparkle' (stars in big eyes) / 'swirl' (dizzy); any other kind is Clawd's.
//           His beak: 'flat' (shut) / 'smile' / 'grin' / 'open' / 'talk' / 'O' / 'frown' / 'wobble' / 'smirk' /
//           'tongue' (open, tongue out: the cheeky "neener") / 'grit' (clamped shut, strain lines)
//   hooks:  behind(u, sw) (drawn first), hat(u, sw) (head space), held(u, sw) (body space, over the body, under the
//           wings); part: 'body' (no wings) | 'wings' (only the wings: draw a brother between the two)
//   extras: emote + emoteK + emoteAge, boilKey, noShadow, swMul
// Helpers: vultureWing(x, y, u, o, s) (the wrist), vultureWingTip(x, y, u, o, s) (the longest primary's tip),
// vultureHead(), vultureBeak(), vultureEye(x, y, u, o, s), vultureChest() → world [x, y]; vultureWorld() maps any point.
const VULT = {
  ink: '#33232A', white: '#FFF8EE', whiteDk: '#E8D8C6', ruff: '#FFF6EA', ruffDk: '#DCCAB6',
  skin: '#F6D4BE', skinDk: '#DDA88E', skinLt: '#FFE8D8', bare: '#E9B4A6', bareDk: '#C98A80',
  beak: '#F2C24A', beakDk: '#C48A26', beakTip: '#5A4038', mouth: '#7A2E36', tongue: '#E8808A',
  eye: '#24161C', eyeLt: '#4A3238', foot: '#9C928E', footDk: '#6E6460', talon: '#2E2226',
  cheek: '#F29A9A', tear: '#BFE6FF', sweat: '#A8DAF4', red: '#D2412E', redDk: '#9A2A20', redLt: '#F27A52',
  char: '#3A2A26', smoke: '#8A8090', brow: '#4A3228', browOld: '#FFF6EA',
};
const VULT_WHO = {
  sampati: { body: '#6E4A32', dk: '#4E3222', lt: '#9A7050', belly: '#C9A27A', bellyDk: '#A67E58', crest: 'crest' },
  jatayu: { body: '#A8743E', dk: '#7A5028', lt: '#CC9860', belly: '#E8C796', bellyDk: '#C9A070', crest: 'curl' },
};

const VULT_NECK = -7.6;
function vultHS(o) { return 1.18 - .14 * clamp(o.age || 0); }   // the head is drawn bigger than life: chibi
function vultStoop(o) { return clamp(o.age || 0) * .9 + (o.stoop || 0); }
function vultHeadPt(o, px, py) {   // a head-space point → body u
  const a = (o.htilt || 0), HS = vultHS(o), dx = px * HS, dy = (py - VULT_NECK) * HS, l = (o.lean || 0), st = vultStoop(o);
  return [l * .8 + dx * Math.cos(a) - dy * Math.sin(a), VULT_NECK + (o.nod || 0) + st * .55 + dx * Math.sin(a) + dy * Math.cos(a)];
}
function vultShoulder(o, s) { return [s * (2.55 + clamp(o.puff || 0) * .3) + (o.lean || 0) * .5, -6.2]; }
function vultArm(o, s) {
  const sh = vultShoulder(o, s), L1 = 3.4, L2 = 3.8;
  let h = (s < 0 ? o.wingL : o.wingR) || [s * 3.1 + (o.lean || 0) * .3, -1.6];
  let dx = h[0] - sh[0], dy = h[1] - sh[1], d = Math.hypot(dx, dy) || 1e-3;
  const reach = L1 + L2 - .05;
  if (d > reach) { h = [sh[0] + dx / d * reach, sh[1] + dy / d * reach]; dx = h[0] - sh[0]; dy = h[1] - sh[1]; d = reach; }
  d = Math.max(d, .8);
  const a = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1)), base = Math.atan2(dy, dx);
  const e1 = [sh[0] + Math.cos(base + a) * L1, sh[1] + Math.sin(base + a) * L1], e2 = [sh[0] + Math.cos(base - a) * L1, sh[1] + Math.sin(base - a) * L1];
  // bend 1: the elbow out to the side (default); -1: in; 2: the elbow up (a flying wing arcs over)
  const b = (s < 0 ? o.bendL : o.bendR) ?? 1;
  if (b === 2) return [sh, e1[1] < e2[1] ? e1 : e2, h];
  const out = (e1[0] - e2[0]) * s > 0 ? e1 : e2, inn = out === e1 ? e2 : e1;
  return [sh, b < 0 ? inn : out, h];
}
function vultureWorld(x, y, u, o, px, py) {
  const sq = (o.sq || 0) + (o.take || 0), fx = o.flip ? -1 : 1, r = o.rot || 0, lx = fx * px * u * (1 + sq * .6), ly = py * u * (1 - sq);
  return [x + (o.dx || 0) * u + lx * Math.cos(r) - ly * Math.sin(r), y + (o.dy || 0) * u + lx * Math.sin(r) + ly * Math.cos(r)];
}
function vultFaceX(o) { return Math.sin(clamp(o.hx || 0, -1, 1) * .6) * 1.55; }
function vultureElbow(x, y, u, o, s) { const [, e] = vultArm(o, s); return vultureWorld(x, y, u, o, e[0], e[1]); }
function vultureWing(x, y, u, o, s) { const [, , h] = vultArm(o, s); return vultureWorld(x, y, u, o, h[0], h[1]); }
function vultureWingTip(x, y, u, o, s) {
  const [, el, h] = vultArm(o, s), raised = !!o[s < 0 ? 'wingL' : 'wingR'];
  if (!raised) return vultureWorld(x, y, u, o, s * 3.0, .2);
  const a = (s < 0 ? o.wingAL : o.wingAR) ?? Math.atan2(h[1] - el[1], h[0] - el[0]), L = 3.4 * vultFull(o);
  return vultureWorld(x, y, u, o, h[0] + Math.cos(a) * L, h[1] + Math.sin(a) * L);
}
function vultureHead(x, y, u, o = {}) { return vultureWorld(x, y, u, o, ...vultHeadPt(o, 0, -10.6)); }
function vultureBeak(x, y, u, o = {}) { return vultureWorld(x, y, u, o, ...vultHeadPt(o, vultFaceX(o), -8.6)); }
function vultureEye(x, y, u, o = {}, s = 1) { return vultureWorld(x, y, u, o, ...vultHeadPt(o, vultFaceX(o) + s * 1.25, -10.8)); }
function vultureChest(x, y, u, o = {}) { return vultureWorld(x, y, u, o, (o.lean || 0) * .4, -4.4); }
// feather fullness: 1 feathered, 0 bald (Sampati after the Sun), back to 1 as the new wings grow
function vultFull(o) { return clamp(1 - clamp(o.bald || 0) + clamp(o.regrow || 0)); }
// flapping targets: phase in cycles, amp 0..1; y0 shifts the stroke (u)
function vultureFlap(phase, amp = 1, y0 = 0) {
  const p = Math.sin(phase * TAU), k = amp;
  const tip = (s) => [s * (8.9 - Math.abs(p) * 1.2 * k), -6.8 + y0 - p * 4.6 * k];
  const ang = s => s > 0 ? -p * .45 * k : Math.PI + p * .45 * k;
  return { wingL: tip(-1), wingR: tip(1), wingShapeL: 'spread', wingShapeR: 'spread', wingAL: ang(-1), wingAR: ang(1), bendL: 2, bendR: 2 };
}

// one wing's hand (the primaries) at the wrist, feathers along +x; s mirrors it; f = fullness; fc = feather colours
function vultWingHand(u, sw, shape, s, f, fc, C, INK, burn) {
  const P = pts => U(pts, u);
  push(); scale(1, -s);
  const col = fc.col, dk = fc.dk, lt = fc.lt;
  if (f < .15) {   // bald: a bare knobby wrist with two singed quills
    paint(ellPts(.25 * u, 0, .5 * u, .38 * u, 10), { wash: fc.skin, fill: fc.skinDk, fillOp: 50, ink: INK, sw: sw * .6 });
    for (const [a, L] of [[-.3, .8], [.25, .6]]) inkLine(P([[.5, a * .5], [.5 + L, a * 1.2]]), sw * .6, C.char, 'ink', .2);
    pop(); return;
  }
  const tipCol = i => burn > 0 && i >= 6 - Math.round(burn * 6) ? mixCol(col, C.char, .4 + .5 * burn) : (i % 2 ? col : lt);
  if (shape === 'spread') {   // six long fingered primaries, the vulture's wingtip
    for (let i = 0; i < 6; i++) {
      const a = -.7 + i * .22, L = (2.9 + (i < 3 ? i * .4 : (5 - i) * .3 + 1.0)) * f;
      push(); rotate(a);
      paint(P([[-.2, -.3], [L * .55, -.3], [L, -.1], [L + .12, .04], [L * .55, .26], [-.2, .28]]), { wash: tipCol(i), fill: dk, fillOp: 45, tex: .4, ink: INK, sw: sw * .55, curv: .5 });
      inkLine(P([[.1, 0], [L * .85, 0]]), sw * .3, dk, 'inkfine', 0);
      pop();
    }
  } else if (shape === 'open') {
    for (let i = 0; i < 4; i++) {
      const a = (-.5 + i * .34), L = (1.9 - Math.abs(i - 1.5) * .25) * f;
      push(); rotate(a);
      paint(P([[-.1, -.32], [L * .6, -.36], [L, -.12], [L + .1, .05], [L * .6, .3], [-.1, .32]]), { wash: tipCol(i + 2), fill: dk, fillOp: 40, tex: .4, ink: INK, sw: sw * .6, curv: .5 });
      pop();
    }
  } else if (shape === 'hug') {   // curled round: a rounded mitt of feathers
    paint(P([[-.2, -.9], [.7, -1.1], [1.5, -.8], [1.85, -.1], [1.7, .6], [1.1, 1.0], [.3, 1.0], [-.2, .8]]), { wash: col, fill: dk, fillOp: 40, tex: .4, ink: INK, sw: sw * .75, curv: .55 });
    for (const k of [-.5, 0, .5]) inkLine(P([[1.2, k], [1.8, k * 1.05]]), sw * .5, INK, 'inkfine', 0);
  } else if (shape === 'point') {
    paint(P([[-.1, -.6], [.6, -.75], [1.0, -.4], [1.0, .5], [.4, .8], [-.1, .6]]), { wash: col, ink: INK, sw: sw * .75, curv: .5 });
    paint(P([[.7, -.42], [2.6 * f, -.22], [2.85 * f, 0], [2.6 * f, .16], [.8, .2]]), { wash: lt, ink: INK, sw: sw * .6, curv: .5 });
  } else {   // fold
    paint(P([[-.2, -.75], [.8, -.85], [1.8, -.55], [2.3 * f, 0], [1.8, .55], [.8, .8], [-.2, .7]]), { wash: col, fill: dk, fillOp: 40, tex: .4, ink: INK, sw: sw * .75, curv: .4 });
    for (const k of [-.35, .05, .45]) inkLine(P([[.9, k], [1.9 * f, k * 1.1]]), sw * .45, dk, 'inkfine', 0);
  }
  pop();
}

function vulture(x, y, u, o = {}) {
  const id = o.boilKey ?? 'vu' + (++CLAWD_N), rs = p => boilSeed(`vult ${id} ${p}`);
  const W0 = VULT_WHO[o.who || 'jatayu'] || VULT_WHO.jatayu, C = { ...VULT, ...W0, ...(o.pal || {}) }, INK = C.ink;
  const sq = (o.sq || 0) + (o.take || 0), sw = clamp(u / 20, .4, 2) * (o.swMul || 1), J = u * .03;
  const age = clamp(o.age || 0), bald = clamp(o.bald || 0), rg = clamp(o.regrow || 0), full = vultFull(o);
  const greyK = age * .35;
  const base = tintCols({ tint: o.tint, tintK: o.tintK, col: mixCol(C.body, '#8E8A88', greyK), dk: mixCol(C.dk, '#5E5A5A', greyK), lt: mixCol(C.lt, '#BEB8B4', greyK) });
  // the body: feathers ↔ bare skin
  const featherK = clamp(1 - bald + rg * .9);
  const col = mixCol(C.bare, base.col, featherK), dk = mixCol(C.bareDk, base.dk, featherK), lt = mixCol(C.skinLt, base.lt, featherK);
  // the wing feathers: their own colours, red when regrown (Kishkindha 63.9)
  const wingCols = { col: rg > 0 ? mixCol(base.col, C.red, clamp(rg * 1.4)) : base.col, dk: rg > 0 ? mixCol(base.dk, C.redDk, clamp(rg * 1.4)) : base.dk,
    lt: rg > 0 ? mixCol(base.lt, C.redLt, clamp(rg * 1.4)) : base.lt, skin: C.bare, skinDk: C.bareDk };
  const pf = clamp(o.puff || 0), lean = o.lean || 0, fly = clamp(o.fly || 0), part = o.part;
  const LB = pts => U(pts.map(([a, b]) => [a + lean * clamp((-b - 1) / 7), b]), u);
  const burn = clamp(o.burn || 0);

  if (!o.noShadow && fly < .5 && part !== 'wings') { rs('shadow'); const f = 1 - Math.min(.5, Math.abs(o.dy || 0) * .05); paint(ellPts(x + (o.dx || 0) * u, y + u * .15, u * 4.0 * f, u * .75 * f, 20), { fill: PAL.ink, fillOp: 80, bleed: .25, tex: .3, border: .1, ink: null }); }
  push();
  translate(x + (o.dx || 0) * u, y + (o.dy || 0) * u);
  if (o.rot) rotate(o.rot);
  scale((o.flip ? -1 : 1) * (1 + sq * .6), 1 - sq);
  if (o.behind && part !== 'wings') { rs('behind'); o.behind(u, sw); }

  if (part !== 'wings') {
    // ---------------- tail: a short dark fan below the body
    rs('tail');
    if (full > .2) paint(LB([[-1.3, -1.6], [1.3, -1.6], [1.5, .2 - fly * .4], [.6, .55 - fly * .3], [-.6, .55 - fly * .3], [-1.5, .2 - fly * .4]]), { wash: wingCols.dk, ink: INK, sw: sw * .7, curv: .4 });
    else for (const k of [-.5, 0, .5]) inkLine(LB([[k * .8, -1.2], [k * 1.4, .2]]), sw * .8, C.char, 'ink', .3);
    // ---------------- legs and feet: feathered trousers, grey toes, dark talons; tucked up when flying
    rs('feet');
    const fy = -fly * 1.6;
    for (const s of [-1, 1]) {
      paint(ellPts(s * 1.15 * u, (-1.05 + fy * .6) * u, .78 * u, (.95 - fly * .2) * u, 12, J), { wash: mixCol(C.bare, C.belly, featherK), fill: mixCol(C.bareDk, C.bellyDk, featherK), fillOp: 60, tex: .4, ink: INK, sw: sw * .6 });
      for (const k of [-.55, 0, .55]) {
        const tx = s * 1.05 + k * (.62 - fly * .3), ty = -.05 + fy;
        paint(ribbon(U([[s * 1.05 + k * .2, -.45 + fy], [tx, ty]], u), .34 * u, .26 * u), { wash: C.foot, ink: INK, sw: sw * .5 });
        paint(U([[tx - .16, ty - .02], [tx + .16, ty - .02], [tx + k * .2, ty + .28]], u), { wash: C.talon, ink: null });
      }
    }
    // ---------------- the body: an egg, the buff belly down the front
    rs('body');
    const bw = 3.25 + pf * .45, st = vultStoop(o) * .25;
    const body = LB([[-2.1, -7.4 + st], [2.1, -7.4 + st], [bw * .93, -5.9], [bw, -3.4], [bw * .9, -1.5], [2.0, -.45], [0, -.3], [-2.0, -.45], [-bw * .9, -1.5], [-bw, -3.4], [-bw * .93, -5.9]]);
    paint(body, { wash: col, fill: dk, fillOp: 40, bleed: .06, tex: .5, border: .4, ink: null, curv: .5 });
    paint(LB([[-1.6, -6.6], [1.6, -6.6], [2.25 + pf * .3, -4.8], [2.2 + pf * .3, -2.5], [1.45, -.9], [0, -.55], [-1.45, -.9], [-2.2 - pf * .3, -2.5], [-2.25 - pf * .3, -4.8]]),
      { wash: mixCol(C.skinLt, C.belly, featherK), fill: mixCol(C.bareDk, C.bellyDk, featherK), fillOp: 45, tex: .4, ink: null, curv: .5 });
    if (featherK > .3) for (let i = 0; i < 9; i++) {   // feather scallops on the belly
      const sx = (hash(i * 3.7) - .5) * 3.0, sy = -1.6 - hash(i * 5.1) * 4.4;
      inkLine(U([[sx - .3 + lean * clamp((-sy - 1) / 7), sy], [sx + lean * clamp((-sy - 1) / 7), sy + .22], [sx + .3 + lean * clamp((-sy - 1) / 7), sy]], u), sw * .45, mixCol(C.bellyDk, INK, .2), 'inkfine', .5);
    }
    if (featherK < .7) for (let i = 0; i < 5; i++) {   // bare skin: wrinkles and goosebumps
      const sx = (hash(i * 2.9) - .5) * 4.0, sy = -1.8 - hash(i * 6.3) * 4.4;
      inkLine(U([[sx - .4, sy], [sx, sy + .16], [sx + .4, sy]], u), sw * .45 * (1 - featherK), C.bareDk, 'inkfine', .5);
    }
    paint(body, { ink: INK, sw: sw * .9, curv: .5 });
    // ---------------- the neck (bare skin, mostly hidden), then the ruff: a fluffy white collar (wisps when bald)
    rs('neck');
    { const [n1x, n1y] = vultHeadPt(o, 0, -8.3); paint(LB([[-1.0, -6.4 + st], [1.0, -6.4 + st], [n1x + 1.0, n1y], [n1x - 1.0, n1y]]), { wash: C.skin, fill: C.skinDk, fillOp: 40, ink: INK, sw: sw * .6 }); }
    rs('ruff');
    const rk = clamp(1 - bald * .85 + rg);
    if (rk > .2) {
      const R = [], n = 14, ry0 = -6.75 + st, rx = 3.35 * (.7 + .3 * rk) + pf * .25;
      for (let i = 0; i <= n; i++) { const a = Math.PI + i / n * Math.PI, bump = i % 2 ? 1 : .72; R.push([Math.cos(a) * rx * (i % 2 ? 1.04 : .96), ry0 + Math.sin(a) * 1.35 * bump * rk]); }
      for (let i = n; i >= 0; i--) { const a = Math.PI + i / n * Math.PI; R.push([Math.cos(a) * rx * .92, ry0 + 1.7 * (i % 2 ? 1 : .78) - Math.abs(Math.cos(a)) * .6]); }
      paint(LB(R), { wash: C.ruff, fill: C.ruffDk, fillOp: 50, tex: .4, ink: INK, sw: sw * .7, curv: .55 });
      for (let i = 0; i < 6; i++) { const a = Math.PI * (1.12 + i * .15); inkLine(LB([[Math.cos(a) * rx * .5, ry0 + .3], [Math.cos(a) * rx * .78, ry0 + Math.sin(a) * .5 + .2]]), sw * .4, C.ruffDk, 'inkfine', .4); }
    } else for (let i = 0; i < 4; i++) {   // wisps
      const wx = (i - 1.5) * 1.1; inkLine(LB([[wx, -6.7 + st], [wx + .3, -7.4 + st], [wx + .1, -7.8 + st]]), sw * .7, C.ruff, 'ink', .5);
    }

    // ---------------- the head: bare skin, a big chibi dome, the crest, the face that slides with hx
    push();
    const [hpx, hpy] = vultHeadPt(o, 0, VULT_NECK);
    translate(hpx * u, hpy * u); if (o.htilt) rotate(o.htilt); scale(vultHS(o)); translate(0, -VULT_NECK * u);
    rs('head');
    const fx = vultFaceX(o), hw = 3.05;
    const headPts = U([[-hw * .92, -12.3], [-hw * .55, -13.3], [0, -13.5], [hw * .55, -13.3], [hw * .92, -12.3], [hw, -10.5], [hw * .9, -8.8], [hw * .55, -7.8], [0, -7.5], [-hw * .55, -7.8], [-hw * .9, -8.8], [-hw, -10.5]], u);
    paint(headPts, { wash: mixCol(C.skin, C.bare, bald * .4), fill: C.skinDk, fillOp: 35, bleed: .05, tex: .5, border: .4, ink: null, curv: .5 });
    paint(ellPts((fx * .5 - 1.0) * u, -12.4 * u, 1.3 * u, .5 * u, 12, J, -.15), { fill: C.skinLt, fillOp: 140, bleed: .2, tex: .7, border: .6, ink: null });
    // a soft shadow on the far side of the dome (the face slid toward us)
    if (Math.abs(fx) > .2) paint(ellPts(-Math.sign(fx) * 2.2 * u, -10.4 * u, .8 * u, 2.0 * u, 12), { fill: C.skinDk, fillOp: 70 * clamp(Math.abs(fx)), bleed: .25, tex: .4, ink: null });
    paint(headPts, { ink: INK, sw: sw * .95, curv: .5 });
    // the crest: Sampati's three swept-back feathers, Jatayu's single curl of down (wisps when bald)
    rs('crest');
    const cr = C.crest, ck = clamp(1 - bald + rg);
    if (cr === 'crest') {
      for (const [dx, a, L] of [[-.5, -.5, 1.9], [.15, -.25, 2.2], [.8, -.05, 1.7]]) {
        const bx = dx - fx * .2, by = -13.25;
        paint(ribbon(U([[bx, by], [bx - Math.sin(-a) * L * .5 - .3, by - L * .55], [bx - Math.sin(-a) * L - .7, by - L * .85]], u), .5 * u * ck + .12 * u, .08 * u), { wash: ck > .3 ? mixCol(C.dk, C.redDk, rg) : C.ruff, ink: INK, sw: sw * .55 });
      }
    } else {
      const bx = .2 - fx * .2, by = -13.35;
      paint(ribbon(U([[bx, by], [bx + .4, by - 1.1], [bx + 1.2, by - 1.35], [bx + 1.5, by - .9], [bx + 1.05, by - .7]], u), .55 * u * ck + .1 * u, .12 * u), { wash: ck > .3 ? C.lt : C.ruff, ink: INK, sw: sw * .55 });
    }
    // forehead wrinkles (age)
    if (age > .3) for (const k of [0, 1]) inkLine(U([[fx - .8, -12.55 - k * .32], [fx, -12.7 - k * .32], [fx + .8, -12.55 - k * .32]], u), sw * .5 * age, C.skinDk, 'inkfine', .5);

    // ---- the face
    push(); translate(fx * u, 0);
    if (o.blush) for (const s of [-1, 1]) paint(ellPts(s * 2.0 * u, -9.35 * u, .62 * u, .34 * u, 12), { fill: C.cheek, fillOp: 170 * clamp(o.blush), bleed: .2, tex: .4, ink: null });
    rs('eyes');
    const ek0 = Array.isArray(o.eyes) ? o.eyes[0] : o.eyes;
    const bAng = clamp((o.brows ?? 0) - (['angry', 'determined', 'red'].includes(ek0) ? .9 : 0), -1, 1), wy = clamp(o.worry || 0) + (['sad', 'scared'].includes(ek0) ? .7 : 0);
    const kinds = Array.isArray(o.eyes) ? o.eyes : o.eyes === 'wink' ? ['normal', 'happy'] : [o.eyes || (age > .6 ? 'tired' : 'normal'), o.eyes || (age > .6 ? 'tired' : 'normal')];
    const own = k => ['normal', 'look', 'wide', 'happy', 'closed', 'squeeze', 'sad', 'angry', 'tired', 'side', 'sparkle', 'swirl', 'focus'].includes(k);
    const sxk = 1 - Math.abs(fx) * .12;
    if (kinds.every(own)) {
      const blink = ((T * .8 + (o.seed || 0) * 1.7 + .4) % 4.1) < .11;
      [-1, 1].forEach((s, i) => {
        const k = (o.squint || 0) > .6 ? 'squeeze' : kinds[i], far = s * Math.sign(fx || 1) < 0 && Math.abs(fx) > .3;
        const ex = s * 1.25, ey = -10.8, ew = far ? .82 : 1;
        if (k === 'happy') { inkLine(U([[ex - .62 * ew, ey + .25], [ex, ey - .42], [ex + .62 * ew, ey + .25]], u), sw * 1.4, INK, 'ink', .6); return; }
        if (k === 'closed' || (blink && k !== 'wide' && k !== 'swirl')) { inkLine(U([[ex - .62 * ew, ey - .05], [ex, ey + .34], [ex + .62 * ew, ey - .05]], u), sw * 1.3, INK, 'ink', .6); return; }
        if (k === 'squeeze') { inkLine(U([[ex - s * .62, ey - .46], [ex + s * .4, ey], [ex - s * .62, ey + .42]], u), sw * 1.4, INK, 'ink', .2); return; }
        const wide = k === 'wide' || k === 'sparkle', rx = (wide ? 1.0 : .86) * ew * sxk, ry = wide ? 1.1 : .97;
        const lx = (o.lookX ?? (k === 'side' ? .9 : 0)) * .3, ly = (o.lookY || 0) * .26;
        paint(U(ellPts(ex, ey, rx, ry, 20), u), { wash: C.white, ink: INK, sw: sw * .55 });
        if (k === 'swirl') { inkLine(Array.from({ length: 14 }, (_, j) => { const a = j * .75 + T * 6 * s, r = .08 + j * .05; return [(ex + Math.cos(a) * r) * u, (ey + Math.sin(a) * r) * u]; }), sw * .9, INK, 'ink', .5); return; }
        const ir = (wide ? .6 : .62) * ew, cx = ex + lx, cy = ey + ly + (k === 'tired' || k === 'side' ? .14 : 0);
        paint(ellPts(cx * u, cy * u, ir * u, ir * 1.08 * u, 16), { wash: C.eye, ink: null });
        paint(ellPts((cx + .05) * u, (cy + .1) * u, ir * .7 * u, ir * .72 * u, 12), { wash: C.eyeLt, ink: null });
        paint(ellPts(cx * u, cy * u, ir * .5 * u, ir * .52 * u, 10), { wash: C.eye, ink: null });
        if (k === 'sparkle') {
          paint(starPts((cx - .12) * u, (cy - .15) * u, .34 * u, .4, 4), { wash: C.white, ink: null });
          paint(starPts((cx + .24) * u, (cy + .24) * u, .16 * u, .4, 4), { wash: C.white, ink: null });
        } else {
          paint(ellPts((cx - .2) * u, (cy - .26) * u, .19 * u, .21 * u, 8), { wash: C.white, ink: null });
          paint(ellPts((cx + .2) * u, (cy + .22) * u, .08 * u, .08 * u, 6), { wash: C.white, ink: null });
        }
        if (k === 'focus') {   // narrowed to see far: flat lids top and bottom
          paint(U([[ex - rx - .14, ey - ry - .25], [ex + rx + .14, ey - ry - .25], [ex + rx + .14, ey - .32], [ex - rx - .14, ey - .32]], u), { wash: mixCol(C.skin, C.skinDk, .25), ink: null });
          paint(U([[ex - rx - .14, ey + ry + .25], [ex + rx + .14, ey + ry + .25], [ex + rx + .14, ey + .42], [ex - rx - .14, ey + .42]], u), { wash: mixCol(C.skin, C.skinDk, .25), ink: null });
          inkLine(U([[ex - rx - .1, ey - .32], [ex + rx + .1, ey - .32]], u), sw * 1.3, INK, 'ink', 0); inkLine(U([[ex - rx * .8, ey + .42], [ex + rx * .8, ey + .42]], u), sw * .9, INK, 'ink', 0);
        }
        if (k === 'tired' || k === 'side' || k === 'angry' || k === 'sad') {   // a lid over the top
          const ang = k === 'angry' ? s * .6 : k === 'sad' ? -s * .45 : 0, top = ey - ry - .25;
          const mid = ey - (k === 'side' ? .12 : k === 'angry' ? .2 : k === 'sad' ? .35 : .05);
          paint(U([[ex - rx - .14, top], [ex + rx + .14, top], [ex + rx + .14, mid - ang * rx], [ex - rx - .14, mid + ang * rx]], u), { wash: mixCol(C.skin, C.skinDk, .25), ink: null });
          inkLine(U([[ex - rx - .1, mid + ang * rx], [ex + rx + .1, mid - ang * rx]], u), sw * 1.3, INK, 'ink', 0);
          if (k === 'tired') inkLine(U([[ex - .5, ey + ry + .14], [ex, ey + ry + .3], [ex + .5, ey + ry + .14]], u), sw * .5, C.skinDk, 'inkfine', .5);
        }
      });
    } else { push(); translate(0, -10.6 * u); scale(.55); translate(0, 6 * u); eyes(u, o, sw / .55 * .85, [-1, 1], 0); pop(); }
    // tears: two streams down the cheeks, drops falling off
    const tr = clamp(o.tears || 0);
    if (tr > 0) {
      rs('tears');
      for (const s of [-1, 1]) {
        const ex = s * 1.35, ey = -9.9;
        paint(ribbon(U([[ex, ey], [ex + s * .12, ey + .9], [ex + s * .05, ey + 1.9 * tr]], u), .26 * u * tr, .2 * u * tr), { wash: C.tear, washOp: 230, ink: null });
        for (let i = 0; i < 2; i++) { const k = frac(T * 1.3 + i * .5 + s * .2), dy = ey + 2.0 + k * 2.2; paint(U([[ex + s * .1, dy - .28], [ex + s * .1 + .17, dy + .05], [ex + s * .1, dy + .22], [ex + s * .1 - .17, dy + .05]], u), { wash: C.tear, washOp: 255 * (1 - k) * tr, ink: null, curv: .6 }); }
      }
    }
    // brows: young, short dark strokes; old, white bushy tufts
    rs('brows');
    const showB = age > .3 || bAng < -.2 || bAng > .2 || wy > .1 || o.browL || o.browR;
    if (showB) for (const s of [-1, 1]) {
      const b = (s < 0 ? o.browL : o.browR) ?? 0, lift = Math.max(0, bAng) * .45 + b * .35;
      const inY = -12.05 - lift + Math.min(0, bAng) * -.5 - wy * .45, outY = -12.3 - lift - Math.min(0, bAng) * -.15 + wy * .2;
      const bc = age > .3 ? C.browOld : C.brow, bw2 = age > .3 ? .5 + age * .2 : .3;
      paint(U(ribbon([[s * .4, inY], [s * 1.2, (inY + outY) / 2 - .16], [s * 2.1, outY + (age > .3 ? .25 : 0)]], bw2, bw2 * .45), u), { wash: bc, ink: age > .3 ? INK : null, sw: sw * .4 });
    }

    // ---- the beak: a hooked gold beak with a dark tip, seen from the front; it opens by dropping the lower bill
    rs('beak');
    const m = o.mouth || 'flat', mk = clamp(o.mouthK ?? 1, 0, 1.4), by = -10.0;
    const open = m === 'open' || m === 'talk' ? .3 + .8 * mk : m === 'grin' ? .75 : m === 'O' ? .65 : m === 'tongue' ? .7 : 0;
    if (open > 0) {
      const w = m === 'O' ? .4 : .58 + .12 * mk;
      paint(U([[-w, by + .9], [w, by + .9], [w * .8, by + 1.05 + open * .7], [0, by + 1.2 + open], [-w * .8, by + 1.05 + open * .7]], u), { wash: C.mouth, ink: INK, sw: sw * .6, curv: .5 });
      if (m === 'tongue') paint(U([[-.32, by + 1.25], [.32, by + 1.25], [.36, by + 2.2], [0, by + 2.5], [-.36, by + 2.2]], u), { wash: C.tongue, ink: INK, sw: sw * .5, curv: .6 });
      else if (open > .5 && m !== 'O') paint(U([[-w * .45, by + 1.05 + open * .75], [w * .45, by + 1.05 + open * .75], [0, by + 1.15 + open * .95]], u), { wash: C.tongue, ink: null, curv: .5 });
      paint(U([[-.34, by + .95 + open * .9], [.34, by + .95 + open * .9], [0, by + 1.3 + open]], u), { wash: C.beakDk, ink: INK, sw: sw * .5, curv: .3 });   // the lower bill
    }
    push(); translate(0, by * u); scale(1.25); translate(0, -by * u);
    const upper = U([[-.62, by - .25], [.62, by - .25], [.6, by + .5], [.36, by + 1.2], [.12, by + 1.55], [0, by + 1.68], [-.12, by + 1.55], [-.36, by + 1.2], [-.6, by + .5]], u);
    paint(upper, { wash: C.beak, fill: C.beakDk, fillOp: 50, tex: .4, ink: null, curv: .45 });
    paint(U([[-.3, by + 1.15], [.3, by + 1.15], [.12, by + 1.55], [0, by + 1.68], [-.12, by + 1.55]], u), { wash: C.beakTip, ink: null, curv: .4 });   // the dark hooked tip
    paint(upper, { ink: INK, sw: sw * .6, curv: .45 });
    for (const s of [-1, 1]) paint(ellPts(s * .26 * u, (by + .05) * u, .07 * u, .05 * u, 6), { wash: C.beakDk, ink: null });   // nostrils
    pop();
    if (m === 'smile' || m === 'grin') for (const s of [-1, 1]) inkLine(U([[s * .62, by + .75], [s * 1.05, by + 1.02], [s * 1.45, by + .75]], u), sw * .8, INK, 'ink', .6);
    else if (m === 'frown') for (const s of [-1, 1]) inkLine(U([[s * .62, by + 1.15], [s * 1.0, by + .9], [s * 1.35, by + 1.15]], u), sw * .8, INK, 'ink', .6);
    else if (m === 'smirk') inkLine(U([[.6, by + .95], [1.05, by + .9], [1.45, by + .55]], u), sw * .8, INK, 'ink', .6);
    else if (m === 'wobble') inkLine(U([[-1.3, by + 1.35], [-.8, by + 1.2], [-.6, by + 1.3], [.6, by + 1.2], [.8, by + 1.35], [1.3, by + 1.2]], u), sw * .7, INK, 'ink', .5);
    else if (m === 'grit') { for (const s of [-1, 1]) { inkLine(U([[s * .65, by + .7], [s * 1.25, by + .62]], u), sw * .8, INK, 'ink', 0); inkLine(U([[s * .7, by + .95], [s * 1.2, by + 1.1]], u), sw * .6, INK, 'ink', 0); } }
    pop();   // face
    if (o.hat) { rs('hat'); o.hat(u, sw); }
    // sweat drops flying off the head
    const swt = clamp(o.sweat || 0);
    if (swt > 0) {
      rs('sweat');
      for (let i = 0; i < 3; i++) { const k = frac(T * 1.6 + i / 3), s = i % 2 ? 1 : -1, a = -1.2 + i * .5, r = 3.3 + k * 2.4, sx = Math.cos(a) * r * s, sy = -10.6 - Math.sin(-a) * r * .6 - k * 1.2;
        paint(U([[sx, sy - .4], [sx + .26, sy + .05], [sx, sy + .3], [sx - .26, sy + .05]], u), { wash: C.sweat, washOp: 255 * (1 - k) * swt, ink: INK, sw: sw * .4 * (1 - k), curv: .6 }); }
    }
    pop();   // head

    if (o.held) { rs('held'); o.held(u, sw); }
  }

  // ---------------- wings: folded, a long teardrop down each side; raised, shoulder → wrist, then the primaries
  if (part !== 'body') for (const s of [-1, 1]) {
    rs('wing' + s);
    const raised = !!o[s < 0 ? 'wingL' : 'wingR'], l = lean * .5, f = full;
    const wc = s < 0 ? wingCols.col : mixCol(wingCols.col, wingCols.lt, .35);
    const cols = { ...wingCols, col: f > .15 ? wc : wingCols.skin };
    if (!raised) {
      if (f < .15) {   // bald: a thin bare stub hanging at the side
        paint(U(ribbon([[s * 2.5 + l, -6.1], [s * 3.1 + l * .7, -4.3], [s * 2.9 + l * .4, -2.6]], .8, .45), u), { wash: C.bare, fill: C.bareDk, fillOp: 50, ink: INK, sw: sw * .8 });
        for (const [a, b] of [[-4.6, 3.2], [-3.4, 3.15]]) inkLine(U([[s * b + l, a], [s * (b + .7) + l, a + .4]], u), sw * .6, C.char, 'ink', .2);
        continue;
      }
      const P = U([[s * 2.2 + l, -6.9], [s * 3.3 + l, -5.9], [s * 3.75 + l * .8, -3.8], [s * 3.5 + l * .5, -1.6], [s * (2.9 + .3 * f) + l * .3, .35 * f], [s * 2.35 + l * .3, -.8], [s * 2.05 + l * .4, -3.2], [s * 1.95 + l * .7, -5.6]], u);
      paint(P, { wash: cols.col, fill: wingCols.dk, fillOp: s < 0 ? 45 : 25, tex: .45, ink: INK, sw: sw * .85, curv: .45 });
      for (const [a, b] of [[-5.4, 2.6], [-4.2, 2.9], [-3.0, 2.95]]) inkLine(U([[s * (b - .5) + l, a], [s * (b + .05) + l, a + .35], [s * (b + .5) + l, a + .1]], u), sw * .5, wingCols.dk, 'inkfine', .5);
      for (const k of [0, 1, 2]) inkLine(U([[s * (2.55 + k * .3) + l * .3, -1.8 + k * .15], [s * (2.65 + k * .25) + l * .3, -.2 * f - k * .1]], u), sw * .5, wingCols.dk, 'inkfine', .3);
      continue;
    }
    const [sh, el, ha] = vultArm(o, s), shape = (s < 0 ? o.wingShapeL : o.wingShapeR) || 'spread';
    if (f > .15) {
      // a broad wing: the leading edge over the bones, the secondaries hanging in a scalloped trailing edge back to the flank
      const bone = k => { const a = k < .5 ? sh : el, b = k < .5 ? el : ha, kk = k < .5 ? k * 2 : (k - .5) * 2; return [lerp(a[0], b[0], kk), lerp(a[1], b[1], kk)]; };
      const nrm = k => { const a = k < .5 ? sh : el, b = k < .5 ? el : ha; let dx = b[0] - a[0], dy = b[1] - a[1]; const d = Math.hypot(dx, dy) || 1; dx /= d; dy /= d;
        let nx = dy, ny = -dx; if (ny > .15 || (Math.abs(ny) <= .15 && nx * s < 0)) { nx = -nx; ny = -ny; } return [nx, ny]; };   // the 'up' side
      const lead = [], trail = [];
      for (let i = 0; i <= 8; i++) { const k = i / 8, [bx, by] = bone(k), [nx, ny] = nrm(k), w = lerp(.55, .35, k); lead.push([bx + nx * w, by + ny * w]); }
      for (let i = 8; i >= 0; i--) { const k = i / 8, [bx, by] = bone(k), [nx, ny] = nrm(k), d = f * (i % 2 ? 1.22 : 1.0) * (shape === 'spread' ? .8 + 2.5 * Math.sin(Math.PI * clamp(k * .95 + .05)) : shape === 'hug' ? .5 + 1.3 * Math.sin(Math.PI * clamp(k * .95 + .05)) : .3 + .7 * Math.sin(Math.PI * clamp(k * .95 + .05))) * (k > .9 ? .5 : 1); trail.push([bx - nx * d, by - ny * d]); }
      trail.push([s * 2.1 + l * .4, -3.0]);
      const wingPts = U([...lead, ...trail], u);
      paint(wingPts, { wash: cols.col, fill: wingCols.dk, fillOp: s < 0 ? 45 : 25, tex: .45, ink: INK, sw: sw * .85, curv: .3 });
      // the coverts: a lighter band along the leading edge, scallop rows below it
      const cov = []; for (let i = 0; i <= 6; i++) { const k = i / 6 * .9, [bx, by] = bone(k), [nx, ny] = nrm(k); cov.push([bx + nx * .35, by + ny * .35]); }
      for (let i = 6; i >= 0; i--) { const k = i / 6 * .9, [bx, by] = bone(k), [nx, ny] = nrm(k), d = .5 + .5 * Math.sin(Math.PI * k); cov.push([bx - nx * d, by - ny * d]); }
      paint(U(cov, u), { wash: wingCols.lt, washOp: 150, ink: null, curv: .4 });
      for (const k of [.15, .35, .55, .75]) for (const row of [1.0, 1.7]) {
        const [bx, by] = bone(k), [nx, ny] = nrm(k), d = row * (.6 + .9 * Math.sin(Math.PI * k)) * f, cx = bx - nx * d, cy = by - ny * d, tx = -ny * .28, ty = nx * .28;
        inkLine(U([[cx - tx - nx * .2, cy - ty - ny * .2], [cx - nx * .05, cy - ny * .05], [cx + tx - nx * .2, cy + ty - ny * .2]], u), sw * .45, wingCols.dk, 'inkfine', .5);
      }
    } else {
      paint(U(ribbon([sh, el, ha], .8, .45), u), { wash: C.bare, fill: C.bareDk, fillOp: 50, ink: INK, sw: sw * .85, curv: .35 });
      for (const k of [.3, .6]) {   // bare: singed quills along the arm
        const a = k < .5 ? sh : el, b = k < .5 ? el : ha, ff = k < .5 ? k * 2 : (k - .5) * 2, cx = lerp(a[0], b[0], ff), cy = lerp(a[1], b[1], ff);
        inkLine(U([[cx, cy], [cx + s * .3, cy + .7]], u), sw * .6, C.char, 'ink', .2);
      }
    }
    // regrowing: red feathers bud along the bare arm (the front of the growth glows)
    if (rg > 0 && rg < 1 && bald > .5) {
      rs('regrow' + s);
      for (let i = 0; i < 7; i++) {
        const k = i / 6; if (k > rg * 1.15) continue;
        const a = k < .5 ? sh : el, b = k < .5 ? el : ha, ff = k < .5 ? k * 2 : (k - .5) * 2, cx = lerp(a[0], b[0], ff), cy = lerp(a[1], b[1], ff), r = .3 + .25 * clamp((rg * 1.15 - k) * 3);
        paint(ellPts(cx * u, (cy + .4) * u, r * u, r * 1.4 * u, 8, 0, s * .4), { wash: C.redLt, ink: INK, sw: sw * .4 });
      }
    }
    push(); translate(ha[0] * u, ha[1] * u);
    rotate((s < 0 ? o.wingAL : o.wingAR) ?? Math.atan2(ha[1] - el[1], ha[0] - el[0]));
    translate(-.3 * u, 0);
    vultWingHand(u, sw, shape, s, f, cols, C, INK, burn);
    pop();
    if (burn > .05 && f > .15) {   // charred tips: dark smudges on the hand
      rs('char' + s);
      paint(ellPts(ha[0] * u, ha[1] * u, .9 * u * burn, .7 * u * burn, 10), { fill: C.char, fillOp: 140 * burn, bleed: .2, tex: .5, ink: null });
    }
  }
  pop();

  // smoke wisps rising off him (world space, so they always rise up)
  const smk = clamp(o.smoke || 0);
  if (smk > 0 && part !== 'body') {
    rs('smoke');
    for (let i = 0; i < 6; i++) {
      const k = frac(T * .7 + i / 6), s = i % 2 ? 1 : -1, [wx, wy] = vultureWorld(x, y, u, o, s * (3.6 + hash(i) * 1.6), -4 - hash(i * 3) * 2.5);
      paint(ellPts(wx + Math.sin(k * 4 + i) * u * .8 + s * k * u * 1.2, wy - k * u * 6, u * (.6 + k * 1.4), u * (.5 + k * 1.1), 14), { fill: C.smoke, fillOp: 150 * (1 - k) * smk, bleed: .3, tex: .3, ink: null });
    }
  }
  if (o.emote && part !== 'wings') {
    rs('emote');
    const top = EMOTE_TOP.includes(o.emote), [hx, hy] = vultHeadPt(o, 0, -10.6);
    const [ex, ey] = vultureWorld(x, y, u, o, top ? hx : (o.flip ? -1 : 1) * 4.4, top ? hy - 4.8 : hy - 3.4);
    emote(o.emote, ex, ey, u * 1.1, o.emoteK ?? 1, o.emoteAge ?? T);
  }
  rs('after');
}

// Model sheet: studio.html?loop=vulture, or node render.mjs --loop=vulture --sheet=0.5,1.5,2.5,3.5 --cols=4 --w=540
(() => {
  LOOPS.vulture = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: '#BFE0F2', ink: null });
    const u = 26, cyc = t % 4;
    // 1 · young Sampati, proud; 2 · little Jatayu, cheeky tongue
    vulture(280, 640, u * 1.1, { who: 'sampati', boilKey: 'v1', puff: .6, eyes: 'happy', mouth: 'smirk', hx: .5, wingL: [-4.2, -9.5], wingShapeL: 'open' });
    vulture(800, 640, u * .95, { who: 'jatayu', boilKey: 'v2', eyes: ['happy', 'normal'], mouth: 'tongue', hx: -.4, blush: .5 });
    // 3 · flying: both flapping
    vulture(280, 1200, u, { who: 'sampati', boilKey: 'v3', fly: 1, ...vultureFlap(t * 1.2), eyes: 'determined', mouth: 'grit', rot: -.12 });
    vulture(800, 1200, u * .9, { who: 'jatayu', boilKey: 'v4', fly: 1, ...vultureFlap(t * 1.4 + .3, .6), eyes: 'swirl', mouth: 'wobble', sweat: 1, smoke: .8, burn: .6 });
    // 4 · old Sampati, bald, crying; the new red wings growing
    vulture(170, 1800, u * .8, { who: 'sampati', boilKey: 'v5', age: 1, bald: 1, eyes: 'sad', mouth: 'wobble', tears: 1 });
    vulture(450, 1800, u * .8, { who: 'sampati', boilKey: 'v6', age: 1, bald: 1, regrow: cyc / 4, eyes: 'wide', mouth: 'O', wingL: [-5, -8], wingR: [5, -8] });
    vulture(760, 1800, u * .8, { who: 'sampati', boilKey: 'v7', age: 1, bald: 1, regrow: 1, eyes: 'happy', mouth: 'grin', ...vultureFlap(t, .5) });
    vulture(990, 1800, u * .6, { who: 'jatayu', boilKey: 'v8', age: 1, eyes: 'angry', mouth: 'open', wingL: [-5.5, -9], wingR: [5.5, -9] });
  };
  LOOPS.vulture.len = 4;
})();
