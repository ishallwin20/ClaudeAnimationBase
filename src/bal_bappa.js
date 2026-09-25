// bal_bappa.js: Bal Bappa, a baby Ganesha in a blue turban and shawl, sitting cross-legged or (stand: 1) standing in
// blue shorts. Load after bappa.js:
// he reuses its U(), resample() and TRUNKS, and Clawd's eyes() / mouth() / emote(), so feel() and emotions() drive him too.
// (x, y) is the ground point under him; u is the size unit (sitting he's about 16u tall and 14u wide, shawl included;
// standing, about 18.5u tall and 10u wide).
//
// Body-local coordinates in u (y up is negative), sitting. Standing, everything from the belly up is the same, 2.6u higher,
// over shorts -5.3..-2.1, legs (±1.5) and feet (±1.6, -.55):
//   lap -2.9..0 · feet (±1, -1) · belly centre (0, -4.3) · shoulders (±2.85, -5.9) · head centre (0, -9.3), 3.2 × 2.8
//   eyes (±1.55, -9.2) · trunk root (0, -8.7) · turban -11..-16 · ears pivot (±3, -10) · shawl out to ±7
//
// Options (all optional), the same as bappa() where they overlap:
//   pose:   stand (0 sits, 1 stands), walk (phase: standing, the feet step and the shawl swings), dx, dy (in u), sq, rot,
//           flip, aL, aR (arm angle: 0 = straight out, + = up; up to .2 the hands rest on the lap and knee, or hang at
//           his sides when standing, and they lift fully by .6), cross 0..1 (arms folded over the belly), hx (-1..1: head turn), htilt
//   trunk:  trunk = 'rest' (his own, curled out to the right) | 'curl' | 'up' | 'palm' | 'down' | 'hold' | a point list
//           in bappa()'s coordinates; trunk2 + trunkK blend to a second pose; trunkSway (u), trunkTap 0..1
//   ears:   ear (0..1 flared out), earL / earR
//   face:   eyes, mouth, lookX / lookY, squint, blush, seed, tint + tintK. Plain 'normal' / 'look' eyes are his own
//           round glossy ones with brows; every other kind is Clawd's.
//   extras: emote + emoteK + emoteAge, armL(u, sw) / armR(u, sw) (hooks at the hand), crownTilt (tips the turban)
//   boil:   boilKey, noShadow
const BAL = {
  skin: '#F4876A', skinDk: '#DC5E43', skinLt: '#FFB59C', earIn: '#EE6A45', ink: '#5A3520',
  blue: '#6E9CCB', blueDk: '#43709F', blueLt: '#A9CBEA', shawl: '#A9CDEB', shawlDk: '#7AA6D2',
  orange: '#F29250', orangeDk: '#CF6630', cream: '#FCE6C8', tusk: '#FBEBD3', tilak: '#86BFE8', drop: '#D2452F',
  eye: '#2A1A12', brow: '#B5502E',
};
// his own resting trunk, short and fat; bappa()'s poses are moved onto his trunk root
const BAL_REST = [[0, -8.7], [.1, -7.7], [.4, -6.7], [1, -5.9], [1.9, -5.5], [2.8, -5.55], [3.5, -5.95], [3.8, -6.6]];
function balTrunk(p) {
  const src = Array.isArray(p) ? p : TRUNKS[p];
  return src ? src.map(([a, b]) => [a * 1.15, -8.7 + (b + 11.2) * 1.15]) : BAL_REST;
}

function balBappa(x, y, u, o = {}) {
  const id = o.boilKey ?? 'bb' + (++CLAWD_N), rs = p => boilSeed(`balbappa ${id} ${p}`);
  x += (o.dx || 0) * u;
  const dy = (o.dy || 0) * u, sq = (o.sq || 0) + (o.take || 0), sw = clamp(u / 20, .4, 2) * (o.swMul || 1), J = u * .05;
  const { col, dk, lt } = tintCols({ ...o, col: o.col || BAL.skin, dk: o.dk || BAL.skinDk, lt: o.lt || BAL.skinLt });
  const P = pts => U(pts, u), INK = BAL.ink;

  rs('shadow');
  const st = (o.stand || 0) > .5, HY = st ? 2.6 : 0, wk = o.walk;
  if (!o.noShadow) { const f = 1 - Math.min(.5, Math.abs(o.dy || 0) * .05); paint(ellPts(x, y + u * .1, u * (st ? 4.4 : 6.6) * f, u * .9 * f, 24), { fill: PAL.ink, fillOp: 80, bleed: .25, tex: .3, border: .1, ink: null }); }

  push();
  translate(x, y + dy);
  if (o.rot) rotate(o.rot);
  scale((o.flip ? -1 : 1) * (1 + sq * .6), 1 - sq);
  const hx = clamp(o.hx || 0, -1, 1);
  translate(0, -HY * u);   // standing: the whole upper body rides 2.6u higher; the legs below are drawn in ground coordinates
  const ground = f => { push(); translate(0, HY * u); f(); pop(); };

  // ---- shawl: hangs from behind the shoulders, pooling on the ground either side when he sits
  rs('shawl');
  if (st) ground(() => {   // standing, it hangs to his calves; walking swings the hem
    const sway = wk == null ? 0 : Math.sin(wk * TAU) * .35;
    const side = s => [[s * 2.3, -9.5], [s * 3.5, -8.7], [s * 4.1, -7], [s * 4.4 + sway * .3, -5], [s * 4.7 + sway * .7, -3.2], [s * 4.9 + sway, -2.2], [s * 4.3 + sway, -1.75], [s * 3.5 + sway * .8, -2], [s * 2.8, -2.6]];
    paint(P([...side(-1), ...side(1).reverse()]), { wash: BAL.shawl, fill: BAL.shawlDk, fillOp: 80, bleed: .06, tex: .6, border: .5, ink: INK, sw: sw * .85, curv: .5 });
    for (const s of [-1, 1]) inkLine(P([[s * 3.4, -8.2], [s * 3.9, -6], [s * 4.2 + sway * .6, -3.8], [s * 4.3 + sway, -2.3]]), sw * .5, BAL.shawlDk, 'inkfine', .5);
  });
  else {
  const side = s => [[s * 2.3, -6.9], [s * 3.7, -6.1], [s * 4.9, -4.4], [s * 5.8, -2.7], [s * 6.6, -1.2], [s * 6.9, -.3], [s * 6.3, .15], [s * 5.3, 0], [s * 4.5, -.4], [s * 3.4, -.6]];
  paint(P([...side(-1), ...side(1).reverse()]), { wash: BAL.shawl, fill: BAL.shawlDk, fillOp: 80, bleed: .06, tex: .6, border: .5, ink: INK, sw: sw * .85, curv: .5 });
  for (const s of [-1, 1]) {   // folds
    inkLine(P([[s * 3.2, -5.2], [s * 4.3, -3.3], [s * 5.4, -1.3], [s * 5.7, -.4]]), sw * .5, BAL.shawlDk, 'inkfine', .5);
    inkLine(P([[s * 4.1, -4.6], [s * 5.2, -2.9], [s * 6.2, -1.1]]), sw * .45, BAL.shawlDk, 'inkfine', .5);
  }
  }

  // ---- ears (behind the head): big droopy fans hinged at the temples; flare swings them out and up
  for (const s of [-1, 1]) {
    rs('ear' + s);
    const fl = clamp((o.ear || 0) + (s < 0 ? o.earL || 0 : o.earR || 0), -.3, 1.4);
    push(); translate((s * 3 + hx * .6) * u, -10 * u); rotate(s * (-.08 - fl * 1.1));
    paint(ellPts(s * 1.75 * u, 1.35 * u, 2.25 * u * (1 - .15 * fl), 3.05 * u, 28, J, s * .3), { wash: col, fill: dk, fillOp: 60, bleed: .05, tex: .5, border: .5, ink: INK, sw });
    paint(ellPts(s * 1.6 * u, 1.55 * u, 1.45 * u, 2.2 * u, 20, J * .6, s * .3), { wash: mixCol(BAL.earIn, col, .3), fill: BAL.earIn, fillOp: 80, bleed: .1, tex: .6, ink: null });
    inkLine(P([[s * 1.1, .3], [s * 1.6, 1.4], [s * 1.4, 2.6]]), sw * .45, BAL.skinDk, 'inkfine', .5);
    pop();
  }

  // ---- belly, then the lap (or shorts and legs) over its bottom, then the feet
  rs('belly');
  const belly = ellPts(0, -4.3 * u, 2.95 * u, 2.3 * u, 28, J);
  paint(belly, { wash: col, ink: null });
  paint(ellPts(-.9 * u, -5.1 * u, 1.5 * u, 1 * u, 16, J * 2, -.3), { fill: lt, fillOp: 130, bleed: .2, tex: .8, border: .8, ink: null });
  paint(ellPts(.3 * u, -2.6 * u, 2.6 * u, .8 * u, 16, J), { fill: dk, fillOp: 80, bleed: .08, tex: .6, border: .5, ink: null });
  paint(belly, { ink: INK, sw });
  inkLine(P([[.55, -3.25], [.8, -3.05], [1.05, -3.25]]), sw * .55, INK, 'inkfine', .6);   // navel
  if (st) ground(() => {
    rs('legs');
    for (const s of [-1, 1]) {
      const l = wk == null ? 0 : Math.max(0, Math.sin((wk + (s < 0 ? 0 : .5)) * TAU)) * .7, cx = s * 1.5;   // the stepping foot lifts
      paint(P([[cx - .95, -2.6], [cx + .95, -2.6], [cx + .9, -.75 - l], [cx - .9, -.75 - l]]), { wash: col, fill: dk, fillOp: 50, tex: .5, ink: INK, sw: sw * .85 });
      paint(ellPts((cx + s * .1) * u, (-.55 - l) * u, 1.2 * u, .62 * u, 16, J), { wash: col, fill: dk, fillOp: 40, tex: .5, ink: INK, sw: sw * .8 });
      for (const k of [-.45, 0, .45]) inkLine(P([[cx + s * .1 + k, -.35 - l], [cx + s * .1 + k * 1.05, -.05 - l]]), sw * .4, INK, 'inkfine', 0);   // toes
    }
    rs('shorts');
    paint(P([[-2.25, -5.3], [2.25, -5.3], [2.6, -3.7], [2.6, -2.1], [.3, -2.1], [0, -3], [-.3, -2.1], [-2.6, -2.1], [-2.6, -3.7]]),   // the waist hugs the belly, flaring a little to the hips
      { wash: BAL.blue, fill: BAL.blueDk, fillOp: 80, bleed: .06, tex: .7, border: .5, ink: INK, sw: sw * .9, curv: .25 });
    inkLine(P([[-2.3, -4.95], [0, -4.85], [2.3, -4.95]]), sw * .5, BAL.blueDk, 'inkfine', .4);   // waistband
    inkLine(P([[0, -4.75], [0, -3.3]]), sw * .5, BAL.blueDk, 'inkfine', 0);
    inkLine(P([[-2, -3.9], [-1.1, -3.3]]), sw * .45, BAL.blueDk, 'inkfine', .4);   // folds
    inkLine(P([[2.05, -3.8], [1.2, -3.1]]), sw * .45, BAL.blueDk, 'inkfine', .4);
  });
  else {
  rs('lap');
  paint(P([[-4.95, -1], [-4.85, -1.9], [-4.3, -2.6], [-3.3, -2.95], [-2, -2.85], [0, -2.45], [2, -2.85], [3.3, -2.95], [4.3, -2.6], [4.85, -1.9], [4.95, -1], [4.5, -.25], [3.3, 0], [0, .05], [-3.3, 0], [-4.5, -.25]]),
    { wash: BAL.blue, fill: BAL.blueDk, fillOp: 80, bleed: .06, tex: .7, border: .5, ink: INK, sw: sw * .9, curv: .5 });
  inkLine(P([[-3.9, -2.1], [-2.8, -1.6], [-2, -1.9]]), sw * .5, BAL.blueDk, 'inkfine', .5);   // folds at the knees
  inkLine(P([[3.9, -2.1], [2.8, -1.6], [2.1, -1.9]]), sw * .5, BAL.blueDk, 'inkfine', .5);
  rs('feet');
  for (const [fx, fy, r] of [[-.95, -.95, -.2], [1.05, -1.05, .2]]) {
    paint(ellPts(fx * u, fy * u, 1.2 * u, .82 * u, 16, J, r), { wash: col, fill: dk, fillOp: 50, tex: .5, ink: INK, sw: sw * .8 });
    const d = Math.sign(fx);
    for (const k of [0, 1, 2]) inkLine(P([[fx + d * (.35 + k * .28), fy + .3], [fx + d * (.45 + k * .28), fy + .62]]), sw * .4, INK, 'inkfine', 0);   // toes
  }
  }

  // ---- necklace: a U from shoulder to shoulder, mostly behind the trunk
  rs('necklace');
  paint(ribbon(P([[-2.3, -6.2], [-1.6, -4.8], [-.4, -4], [.9, -4], [1.9, -4.9], [2.4, -6.2]]), .5 * u, .5 * u),
    { wash: BAL.orange, fill: BAL.orangeDk, fillOp: 60, tex: .5, ink: INK, sw: sw * .6 });
  inkLine(P([[-2.1, -6], [-1.45, -4.85], [-.35, -4.2], [.85, -4.2], [1.75, -4.95], [2.2, -6]]), sw * .4, BAL.cream, 'inkfine', .5);

  // ---- arms: resting ones go under the head and trunk; raised or holding ones are drawn after, in front
  // emotions give arm angles for Clawd (about 0 at rest), so below .2 his hands stay in his lap (or hang at his sides),
  // and from .2 to .6 they lift to the angle given
  const armA = s => { const rest = st ? -1.3 : s < 0 ? -1.75 : -1.4, a = s < 0 ? o.aL : o.aR; return a == null ? rest : lerp(rest, a, clamp((a - .2) / .4)); };
  const front = s => armA(s) > -.5 || (s < 0 ? o.armL : o.armR);
  const drawArm = s => {
    rs('arm' + s);
    const a = armA(s), hook = s < 0 ? o.armL : o.armR, L = (st ? 3.3 : 3) * u, ex = s * Math.cos(a) * L, ey = -Math.sin(a) * L;
    push(); translate(s * (st ? 3.1 : 2.85) * u, -5.9 * u);
    const nx = -ey / L * .25 * u * s, ny = ex / L * .25 * u * s;   // a slight elbow bend, so the arm never reads as a stick
    paint(ribbon([[0, 0], [ex * .5 + nx, ey * .5 + ny], [ex, ey]], 1.3 * u, .95 * u), { wash: col, fill: dk, fillOp: 40, tex: .5, ink: INK, sw: sw * .85 });
    push(); translate(ex, ey);
    paint(ellPts(0, 0, .82 * u, .75 * u, 14, J), { wash: col, ink: INK, sw: sw * .8 });
    for (const k of [-.25, .15]) inkLine(P([[-.35, k], [.05, k + .1]]), sw * .4, INK, 'inkfine', 0);   // fingers
    if (hook) { if (s < 0) scale(-1, 1); hook(u, sw); }
    pop(); pop();
  };
  const cross = clamp(o.cross || 0);
  if (cross > .5) {   // folded arms: two fat ribbons across the belly, the right one on top
    rs('cross');
    paint(ribbon(P([[-2.7, -5.7], [-2, -4.3], [0, -3.9], [1.7, -4.2]]), 1.3 * u, 1.05 * u), { wash: col, fill: dk, fillOp: 50, tex: .5, ink: INK, sw: sw * .85 });
    paint(ribbon(P([[2.7, -5.7], [2.1, -4.9], [0, -4.8], [-1.8, -5.1]]), 1.3 * u, 1.05 * u), { wash: col, fill: dk, fillOp: 30, tex: .5, ink: INK, sw: sw * .85 });
    if (o.armR) { push(); translate(-2 * u, -5.2 * u); o.armR(u, sw); pop(); }
  } else for (const s of [-1, 1]) if (!front(s)) drawArm(s);

  // ---- head
  push(); translate(hx * .5 * u, 0);
  if (o.htilt) { translate(0, -7 * u); rotate(o.htilt); translate(0, 7 * u); }
  rs('head');
  const head = ellPts(0, -9.3 * u, 3.2 * u, 2.8 * u, 32, J);
  paint(head, { wash: col, ink: null });
  paint(ellPts((-1.2 + hx) * u, -10.3 * u, 1.8 * u, 1 * u, 16, J * 2, -.2), { fill: lt, fillOp: 130, bleed: .2, tex: .85, border: .8, ink: null });
  paint(ellPts(0, -7 * u, 2.6 * u, .9 * u, 16, J), { fill: dk, fillOp: 60, bleed: .1, tex: .6, border: .5, ink: null });
  paint(head, { ink: INK, sw });
  push(); translate(hx * .9 * u, 0);
  rs('tilak');   // two blue curls and a red drop
  for (const s of [-1, 1]) inkLine(P([[s * .75, -10.85], [s * .62, -10.45], [s * .3, -10.35], [s * .08, -10.55]]), sw * .9, BAL.tilak, 'ink', .5);
  paint(ellPts(0, -10.7 * u, .17 * u, .27 * u, 10), { wash: BAL.drop, ink: null });
  if (o.blush) for (const s of [-1, 1]) paint(ellPts(s * 2.2 * u, -8.1 * u, .85 * u, .45 * u, 14), { fill: PAL.rose, fillOp: 150 * clamp(o.blush), bleed: .2, tex: .4, ink: null });
  rs('eyes');
  const kinds = Array.isArray(o.eyes) ? o.eyes : [o.eyes || 'normal', o.eyes || 'normal'];
  if (kinds.every(k => k === 'normal' || k === 'look') && !o.squint) {
    const lx = (o.lookX || 0) * u * .25, ly = (o.lookY || 0) * u * .2;
    const blink = ((T * .9 + (o.seed || 0) * 1.7) % 3.3) < .12;
    for (const s of [-1, 1]) {
      const ex = s * 1.55 * u, ey = -9.2 * u;
      inkLine(P([[s * 1.1, -10], [s * 1.6, -10.2], [s * 2.1, -10.05]]), sw * .6, BAL.brow, 'inkfine', .5);   // brow
      if (blink) { inkLine([[ex - .45 * u, ey + .1 * u], [ex + .45 * u, ey + .1 * u]], sw * 1.1, BAL.eye, 'ink', .3); continue; }
      paint(ellPts(ex + lx, ey + ly, .42 * u, .55 * u, 16), { wash: BAL.eye, ink: null });
      paint(ellPts(ex + lx - .13 * u, ey + ly - .2 * u, .16 * u, .18 * u, 10), { wash: PAL.cream, washOp: 240, ink: null });
      paint(ellPts(ex + lx + .14 * u, ey + ly + .22 * u, .07 * u, .07 * u, 8), { wash: PAL.cream, washOp: 200, ink: null });
    }
  } else { push(); translate(0, -9.2 * u); scale(.62); translate(0, 6 * u); eyes(u, o, sw / .62 * .85, [-1, 1], 0); pop(); }
  rs('mouth');
  push(); translate(-.75 * u, -6.6 * u); scale(.5); translate(0, 4.3 * u); mouth(u, o.mouth, sw / .5 * .8); pop();
  rs('tusk');   // two stubby tusks either side of the trunk root
  for (const s of [-1, 1]) paint(ellPts(s * 1.45 * u, -7.3 * u, .42 * u, .55 * u, 14, 0, s * -.35), { wash: BAL.tusk, fill: BAL.cream, fillOp: 90, tex: .4, ink: INK, sw: sw * .6 });
  rs('trunk');
  let tp = balTrunk(o.trunk);
  if (o.trunk2 && o.trunkK > 0) { const a = resample(tp, 9), b = resample(balTrunk(o.trunk2), 9); tp = a.map((p, i) => [lerp(p[0], b[i][0], o.trunkK), lerp(p[1], b[i][1], o.trunkK)]); }
  const sway = o.trunkSway || 0, tap = o.trunkTap || 0, n = tp.length;
  tp = tp.map(([a, b], i) => { const k = i / (n - 1); return [a + sway * k * k, b - tap * .7 * k * k * k]; });
  const TP = P(tp);
  const [tx, ty] = TP[n - 1], [qx, qy] = TP[n - 2];
  paint(ellPts(tx, ty, .62 * u, .55 * u, 14, 0, Math.atan2(ty - qy, tx - qx)), { wash: col, ink: INK, sw: sw * .9 });   // a rounded tip
  paint(ribbon(TP, 2.4 * u, 1.2 * u), { wash: col, fill: dk, fillOp: 45, tex: .5, ink: INK, sw: sw * .9 });
  paint(ellPts(tx, ty, .5 * u, .44 * u, 12), { wash: col, ink: null });
  for (const k of [.1, .2, .3, .55, .68]) {   // trunk wrinkles
    const i = Math.min(n - 2, Math.floor(k * (n - 1))), f = k * (n - 1) - i, [ax, ay] = TP[i], [bx, by] = TP[i + 1];
    const cx = lerp(ax, bx, f), cy = lerp(ay, by, f), d = Math.hypot(bx - ax, by - ay) || 1, nx = -(by - ay) / d, ny = (bx - ax) / d, w = lerp(2.4, 1.2, k) * u * .3;
    inkLine([[cx - nx * w, cy - ny * w], [cx + nx * w, cy + ny * w]], sw * .45, BAL.skinDk, 'inkfine', 0);
  }
  pop();

  // ---- turban: a blue dome with a knot on top, an orange band over the brow and a teardrop jewel
  rs('turban');
  push(); translate(0, -12 * u); rotate(o.crownTilt || 0); translate(0, 12 * u);
  paint(ellPts(-.3 * u, -16.05 * u, .85 * u, .7 * u, 14, J), { wash: BAL.blue, fill: BAL.blueDk, fillOp: 60, tex: .6, ink: INK, sw: sw * .8 });
  paint(P([[-3.7, -10.9], [-4, -12.6], [-3.4, -14.4], [-1.9, -15.55], [0, -15.85], [1.9, -15.55], [3.4, -14.4], [4, -12.6], [3.7, -10.9], [0, -12.6]]),
    { wash: BAL.blue, fill: BAL.blueDk, fillOp: 80, bleed: .05, tex: .7, border: .5, ink: INK, sw: sw * .9, curv: .3 });
  paint(ellPts(-1.8 * u, -14.4 * u, 1.4 * u, .65 * u, 12, J * 2, -.4), { fill: BAL.blueLt, fillOp: 120, bleed: .2, tex: .8, border: .8, ink: null });
  inkLine(P([[-3.3, -12.7], [-2, -14.2], [-.4, -14.9]]), sw * .5, BAL.blueDk, 'inkfine', .5);   // wraps
  inkLine(P([[3.3, -12.7], [2.2, -14], [1.1, -14.6]]), sw * .5, BAL.blueDk, 'inkfine', .5);
  paint(P([[-3.75, -10.85], [-2.4, -12.4], [0, -12.95], [2.4, -12.4], [3.75, -10.85], [3.15, -10.3], [2.1, -11.45], [0, -11.95], [-2.1, -11.45], [-3.15, -10.3]]),
    { wash: BAL.orange, fill: BAL.orangeDk, fillOp: 70, tex: .6, ink: INK, sw: sw * .75, curv: .3 });
  inkLine(P([[-3.3, -10.75], [-2.2, -11.9], [0, -12.45], [2.2, -11.9], [3.3, -10.75]]), sw * .45, BAL.cream, 'inkfine', .5);
  const drop = (s, c, ink) => paint(P([[0, -12.1 + (1 - s) * .9], [.65 * s, -12.6 - (1 - s) * .4], [.55 * s, -13.6 + (1 - s) * .3], [0, -14.8 + (1 - s) * 1.4], [-.55 * s, -13.6 + (1 - s) * .3], [-.65 * s, -12.6 - (1 - s) * .4]]),
    { wash: c, ink, sw: sw * .7, curv: .45 });
  push(); translate(0, -13.3 * u); scale(1.3); translate(0, 13.3 * u);
  drop(1, BAL.orange, INK); drop(.72, BAL.cream, null); drop(.5, BAL.orangeDk, null);
  paint(ellPts(0, -13.05 * u, .24 * u, .2 * u, 10), { wash: BAL.tilak, ink: INK, sw: sw * .4 });
  pop();
  pop();
  pop();

  if (cross <= .5) for (const s of [-1, 1]) if (front(s)) drawArm(s);
  pop();

  rs('emote');
  if (o.emote) {
    const top = EMOTE_TOP.includes(o.emote), dir = o.flip ? -1 : 1;
    emote(o.emote, top ? x : x + dir * 6.2 * u, y + dy + ((top ? -18.5 : -13) - HY) * u * (1 - sq), u * 1.1, o.emoteK ?? 1, o.emoteAge ?? T);
  }
  rs('after');
}

// Model sheet: studio.html?loop=balbappa, or node render.mjs --loop=balbappa --sheet=0.5 --cols=1 --w=1080
(() => {
  LOOPS.balbappa = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: PAL.paper, ink: null });
    const cells = [
      ['neutral', {}], ['angry', { cross: 1 }], ['proud', { aR: .4, armR: (u) => modak(u * .4, u * .3, u * 1.3) }],
      ['sad', { trunk: 'down' }], ['furious', { ear: .9, trunk: 'up' }], ['idea', { aR: 1.3 }],
      ['relieved', { trunk: 'palm' }], ['smug', { hx: .6, trunk: 'hold' }], ['happy', { aL: .9, aR: .9 }],
    ];
    cells.forEach(([name, over], i) => {
      const cx = 180 + (i % 3) * 360, gy = 620 + Math.floor(i / 3) * 520;
      balBappa(cx, gy, 22, { ...feel(name, t + i * .3, { seed: i }), ...over });
    });
  };
  LOOPS.balbappa.len = 4;

  // standing: studio.html?loop=balstand (the happy one walks)
  LOOPS.balstand = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: PAL.paper, ink: null });
    const cells = [
      ['neutral', {}], ['angry', { cross: 1 }], ['proud', { aR: .4, armR: (u) => modak(u * .4, u * .3, u * 1.3) }],
      ['sad', { trunk: 'down' }], ['furious', { ear: .9, trunk: 'up' }], ['idea', { aR: 1.3 }],
      ['relieved', { trunk: 'palm' }], ['smug', { hx: .6, trunk: 'hold' }], ['happy', { aL: .9, aR: .9, walk: t * 1.5 }],
    ];
    cells.forEach(([name, over], i) => {
      const cx = 180 + (i % 3) * 360, gy = 640 + Math.floor(i / 3) * 540;
      balBappa(cx, gy, 21, { ...feel(name, t + i * .3, { seed: i }), stand: 1, ...over });
    });
  };
  LOOPS.balstand.len = 4;
})();
