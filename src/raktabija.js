// raktabija.js: Raktabija, the demon whose every drop of blood that touched the ground became another him (Devi
// Mahatmya, ch. 8). His name means "blood-SEED", so he is drawn as one: a round, bean-shaped cherry-red asura with a
// little green SPROUT on his head (his sign: every clone has it), two stubby horns, pointy ears with gold hoops, big
// round eyes under one thick unibrow, a wide grin with ONE snaggle fang, a pink belly, purple shorts with a gold belt
// and a ruby-drop buckle, noodle arms with gold armlets, stubby feet, and a little spiked mace.
// Front view only. Load after bappa.js (U()) and clawd.js (eyes() / mouth() / emote() / tintCols()).
//
// raktabija(x, y, u, o): (x, y) is the ground under him; u is the size unit (about 10u to the horn tips, 12.3u to the
// leaves of the sprout, 7.4u across the body).
// Body-local coordinates in u (y up is negative): feet (±1.5, -.4) · shorts -2.9..-1 · belly centre (0, -3.7) · body
// centre (0, -5.2), 3.7 × 4.4 · shoulders (±3.1, -5.0) · eyes (±1.15, -6.7) · unibrow -8.0 · nose (0, -5.9) · mouth
// (0, -5.0) · horn tips (±2.1, -10.5) · sprout leaves about (±1.4, -12)
// Options (all optional):
//   pose:   dx, dy (u), sq (squash; negative stretches), sx / sy (extra scale), rot (pivots at the ground point), flip,
//           lean (-1..1: the top of the bean leans), hop (u: the feet leave the ground), walk (phase), shake 0..1
//   grow:   grow 0..1: he sprouts out of the ground (the sprout first, then POP, the bean on an overshoot)
//   arms:   handL / handR = [x, y] in u (default hanging at his sides), bendL / bendR (u of elbow bow), handShapeL /
//           handShapeR ('fist' | 'open' | 'point' | 'thumb' | 'hold'), armL(u, sw) / armR(u, sw) (hooks at the hands,
//           drawn upright), mace (default true, in the right hand, screen-right) + maceA (radians)
//   face:   eyes ('normal' | 'wide' | 'happy' | 'angry' | 'scared' | 'swirl' | 'closed' | 'side' | 'squeeze'),
//           lookX / lookY, mouth ('grin' (default) | 'smirk' | 'open' (a laugh) | 'O' | 'frown' | 'wobble' | 'flat' |
//           'teeth'), mouthK (how wide 'open' opens), brows (-1 angry .. +1 raised), sweat 0..1, blush 0..1, seed;
//           other eye and mouth kinds are Clawd's
//   look:   pal (colour overrides), tint / tintK (Clawd's tints), leaf (-1..1: the sprout bends), lod 1 (far crowd: a
//           cheap silhouette with eyes, horns and the sprout), noShadow, swMul, boilKey
//   hooks:  hat(u, sw) (body space, drawn over the head), held(u, sw) (body space, over the body, under the arms)
//   extras: emote + emoteK + emoteAge
// Helpers: rbHand(x, y, u, o, s), rbHead / rbMouth / rbTop / rbBelly(x, y, u, o) → world [x, y]; rbMace(u, sw, a) draws
// the mace on its own; bloodSeed(x, y, r, a, key) draws one ruby drop (pointing up the way it travels at a = 0).
const RKB = {
  skin: '#D9443E', skinDk: '#A62C32', skinLt: '#F2785E', belly: '#F7A487', bellyDk: '#E57F6A', ink: '#3A1A24',
  horn: '#F4E6C8', hornDk: '#BBA27E', eye: '#FFF8EC', pupil: '#2A1420', brow: '#3A1A24',
  shorts: '#4A3486', shortsDk: '#33225E', gold: '#EDB43C', goldDk: '#B67D1C', ruby: '#E8233F', rubyLt: '#FF8A96',
  leaf: '#6CC05A', leafDk: '#3E8A3A', stem: '#5AA84C', mouth: '#5A1426', tongue: '#F08A8A', fang: '#FFF6E6',
  steel: '#8E8A9E', steelDk: '#5E5A70', wood: '#7A4A2A',
};

// the body outline: a bean, a little wider at the bottom (lean bends the top over)
function rbBodyPts(u, lean = 0, kx = 1, ky = 1, n = 30) {
  const P = [];
  for (let i = 0; i < n; i++) {
    const a = i / n * TAU, c = Math.cos(a), s = Math.sin(a), y = -5.2 + s * 4.35 * ky;
    const w = 3.65 * kx * (1 + .1 * clamp((y + 5.2) / 4.3, -1, 1)), top = clamp((-y - 5.2) / 4.3, 0, 1);
    P.push([(c * w + lean * top * top * 1.2) * u, y * u]);
  }
  return P;
}
function rbArm(o, s) {
  const sh = [s * 3.1 + (o.lean || 0) * .25, -5.0];
  const ha = (s < 0 ? o.handL : o.handR) || [s * 4.0, -2.6];
  const dx = ha[0] - sh[0], dy = ha[1] - sh[1], d = Math.hypot(dx, dy) || 1;
  let nx = -dy / d, ny = dx / d; if (nx * s < 0) { nx = -nx; ny = -ny; }   // the elbow bows outward
  const b = (s < 0 ? o.bendL : o.bendR) ?? .6;
  return [sh, [(sh[0] + ha[0]) / 2 + nx * b, (sh[1] + ha[1]) / 2 + ny * b], ha];
}
function rbScale(o) {
  const g = clamp(o.grow ?? 1), sq = (o.sq || 0);
  const gx = g >= 1 ? 1 : seg(g, .35, 1) > 0 ? backOut(seg(g, .35, 1)) : 0, gy = g >= 1 ? 1 : seg(g, .35, 1) > 0 ? lerp(.3, 1, backOut(seg(g, .35, .9))) : 0;
  return [(o.flip ? -1 : 1) * (1 + sq * .6) * (o.sx ?? 1) * gx, (1 - sq) * (o.sy ?? 1) * gy];
}
function rbWorld(x, y, u, o, px, py) {
  const [sx, sy] = rbScale(o), r = o.rot || 0, lx = px * u * sx, ly = py * u * sy;
  return [x + (o.dx || 0) * u + lx * Math.cos(r) - ly * Math.sin(r), y + ((o.dy || 0) - (o.hop || 0)) * u + lx * Math.sin(r) + ly * Math.cos(r)];
}
function rbHand(x, y, u, o, s) { const [, , h] = rbArm(o, s); return rbWorld(x, y, u, o, h[0], h[1]); }
function rbHead(x, y, u, o = {}) { return rbWorld(x, y, u, o, (o.lean || 0) * .3, -6.5); }
function rbMouth(x, y, u, o = {}) { return rbWorld(x, y, u, o, (o.lean || 0) * .25, -5.0); }
function rbTop(x, y, u, o = {}) { return rbWorld(x, y, u, o, (o.lean || 0) * 1.2, -11.6); }
function rbBelly(x, y, u, o = {}) { return rbWorld(x, y, u, o, 0, -3.7); }

// one ruby drop of his blood, its round end at (x, y), radius r, pointing along angle a (0 = its tip points up)
function bloodSeed(x, y, r, a = 0, key = 'seed', sw = 1.4) {
  boilSeed(key);
  push(); translate(x, y); rotate(a);
  glow(0, 0, r * 2.4, '#FF5A6A', .35);
  paint([[0, -r * 2.1], [r * .55, -r * 1.05], [r, -r * .1], [r * .8, r * .6], [0, r], [-r * .8, r * .6], [-r, -r * .1], [-r * .55, -r * 1.05]], { wash: RKB.ruby, ink: RKB.ink, sw, curv: .5 });
  paint(ellPts(-r * .35, -r * .25, r * .22, r * .38, 8, 0, -.3), { wash: RKB.rubyLt, ink: null });
  pop();
}
// his little spiked mace, held at (0, 0) by the grip, pointing up (rotate by a)
function rbMace(u, sw, a = 0, INK = RKB.ink) {
  push(); rotate(a);
  paint(ribbon(U([[0, .9], [0, -2.6]], u), .42 * u, .34 * u), { wash: RKB.wood, ink: INK, sw: sw * .5 });
  inkLine(U([[-.22, -.2], [.22, -.3]], u), sw * .9, RKB.gold, 'ink', 0);
  const cy = -3.5;
  for (let i = 0; i < 7; i++) { const a2 = i / 7 * TAU + .2; paint(U([[Math.cos(a2 - .28) * .85, cy + Math.sin(a2 - .28) * .85], [Math.cos(a2) * 1.55, cy + Math.sin(a2) * 1.55], [Math.cos(a2 + .28) * .85, cy + Math.sin(a2 + .28) * .85]], u), { wash: RKB.horn, ink: INK, sw: sw * .4 }); }
  paint(ellPts(0, cy * u, 1.0 * u, 1.0 * u, 18), { wash: RKB.steel, fill: RKB.steelDk, fillOp: 60, tex: .5, ink: INK, sw: sw * .6 });
  paint(ellPts(-.35 * u, (cy - .35) * u, .3 * u, .22 * u, 8, 0, -.5), { wash: '#C8C6D6', ink: null });
  pop();
}
// a hand at (0, 0): a round mitt; shapes add a pointing finger, a thumb up, or curl round a grip
function rbHandShape(u, sw, shape, s, col, dk, INK) {
  const P = pts => U(pts, u);
  if (shape === 'point') paint(ribbon(P([[0, 0], [s * .55, -.55], [s * 1.25, -1.2]]), .42 * u, .3 * u), { wash: col, ink: INK, sw: sw * .5 });
  if (shape === 'thumb') paint(ribbon(P([[0, -.2], [0, -.9], [.05, -1.4]]), .42 * u, .34 * u), { wash: col, ink: INK, sw: sw * .5 });
  if (shape === 'open') for (const k of [-1, 0, 1]) paint(ribbon(P([[k * .3, -.2], [k * .45, -.85]]), .32 * u, .26 * u), { wash: col, ink: INK, sw: sw * .4 });
  paint(ellPts(0, 0, .7 * u, .64 * u, 14, u * .03), { wash: col, ink: INK, sw: sw * .6 });
  if (shape === 'fist' || shape === 'hold') for (const k of [-.25, .1, .42]) inkLine(P([[k, -.45], [k + .04, -.15]]), sw * .45, dk, 'inkfine', 0);
}

function raktabija(x, y, u, o = {}) {
  const id = o.boilKey ?? 'rb' + (++CLAWD_N), rs = p => boilSeed(`rakta ${id} ${p}`);
  const C = { ...RKB, ...(o.pal || {}) }, INK = C.ink;
  const g = clamp(o.grow ?? 1), sk = (o.shake || 0) * Math.sin(T * 60) * .12;
  const sw = clamp(u / 20, .35, 2) * (o.swMul || 1), J = u * .04, P = pts => U(pts, u);
  const { col, dk, lt } = tintCols({ tint: o.tint, tintK: o.tintK, col: C.skin, dk: C.skinDk, lt: C.skinLt });
  const lean = o.lean || 0, hop = o.hop || 0, wk = o.walk, lod = o.lod || 0;
  const lf = (o.leaf || 0) + Math.sin(T * 2.2 + (o.seed || 0)) * .12;

  // ---- the sprout comes first: a seedling pokes out of the ground, then the bean POPS up under it
  if (g < .35) {
    const k = backOut(seg(g, 0, .3)), s = u * .9;
    if (k > .02) {
      rs('seedling');
      inkLine([[x, y], [x + s * .1, y - s * 1.2 * k], [x + s * .2, y - s * 2 * k]], sw * 2.2, C.stem, 'ink', .5);
      for (const d of [-1, 1]) paint(ellPts(x + s * .2 + d * s * .7 * k, y - s * 2.1 * k, s * .75 * k, s * .38 * k, 12, 0, d * -.4), { wash: C.leaf, ink: INK, sw: sw * .6 });
      paint(ellPts(x, y + s * .1, s * 1.1, s * .3, 12), { wash: '#4A3A3E', ink: null });   // the little mound of earth
    }
    rs('after');
    return;
  }
  const [SX, SY] = rbScale(o);
  if (!o.noShadow) { rs('shadow'); const f = 1 - Math.min(.6, hop * .08); paint(ellPts(x + (o.dx || 0) * u, y + u * .1, u * 4.0 * f * Math.abs(SX), u * .75 * f, 20), { fill: PAL.ink, fillOp: 80, bleed: .25, tex: .3, border: .1, ink: null }); }
  push();
  translate(x + ((o.dx || 0) + sk) * u, y + ((o.dy || 0) - hop) * u);
  if (o.rot) rotate(o.rot);
  scale(SX, SY);

  if (lod) {   // ---- the far crowd: one bean, belly, eyes, horns, sprout
    rs('far');
    for (const s of [-1, 1]) paint(P([[s * 1.2, -9.0], [s * 2.1, -10.4], [s * 1.9, -8.8]]), { wash: C.horn, ink: null });
    inkLine(P([[0, -9.4], [lf * .4, -11.2]]), sw * 2, C.stem, 'ink', .4);
    for (const d of [-1, 1]) paint(ellPts((lf * .4 + d * .8) * u, -11.5 * u, .8 * u, .4 * u, 10, 0, d * -.4), { wash: C.leaf, ink: null });
    paint(rbBodyPts(u, lean, 1, 1, 18), { wash: col, ink: INK, sw: sw * 1.2 });
    paint(ellPts(0, -3.4 * u, 2.3 * u, 2.0 * u, 12), { wash: C.belly, ink: null });
    paint(P([[-3.6, -2.6], [3.6, -2.6], [3.2, -1.2], [0, -1.0], [-3.2, -1.2]]), { wash: C.shorts, ink: null });
    const ek = o.eyes || 'normal';
    for (const s of [-1, 1]) {
      if (ek === 'happy' || ek === 'closed' || ek === 'squeeze') { inkLine(P([[s * 1.15 - .6, -6.6], [s * 1.15, -7.1], [s * 1.15 + .6, -6.6]]), sw * 2.2, INK, 'ink', .5); continue; }
      paint(ellPts(s * 1.15 * u, -6.7 * u, .85 * u, .95 * u, 10), { wash: C.eye, ink: null });
      paint(ellPts((s * 1.15 + (o.lookX || 0) * .3) * u, (-6.6 + (o.lookY || 0) * .25) * u, (ek === 'scared' ? .25 : .45) * u, (ek === 'scared' ? .3 : .55) * u, 8), { wash: C.pupil, ink: null });
    }
    inkLine(P([[-2.1, -7.9], [0, -8.2], [2.1, -7.9]]), sw * 3, INK, 'ink', .5);
    const m = o.mouth || 'grin';
    if (m === 'O' || m === 'open') paint(ellPts(0, -4.9 * u, .7 * u, .8 * u, 10), { wash: C.mouth, ink: null });
    else inkLine(P([[-1.4, -5.2], [0, -4.5], [1.4, -5.2]]), sw * 2, INK, 'ink', .5);
    pop(); rs('after');
    return;
  }

  // ---- behind: the far arm's mace when it's lowered sits behind; the legs and feet
  rs('feet');
  for (const s of [-1, 1]) {
    const l = wk == null ? 0 : Math.max(0, Math.sin((wk + (s < 0 ? 0 : .5)) * TAU)) * .7;
    paint(P([[s * .7, -1.8], [s * 2.2, -1.8], [s * 2.1, -.6 - l], [s * .9, -.6 - l]]), { wash: dk, ink: INK, sw: sw * .7 });
    paint(ellPts((s * 1.6) * u, (-.42 - l) * u, 1.2 * u, .52 * u, 14, J), { wash: col, ink: INK, sw: sw * .8 });
    for (const k of [1.0, 1.55, 2.1]) inkLine(P([[s * k, -.1 - l], [s * k, -.35 - l]]), sw * .45, dk, 'inkfine', 0);
  }
  // ---- the horns and the sprout, behind the head
  rs('horns');
  for (const s of [-1, 1]) {
    const hb = [s * 1.2 + lean * .9, -8.85], hp = [hb, [s * 1.85 + lean * 1.0, -9.6], [s * 2.15 + lean * 1.1, -10.5]];
    paint(U(ribbon(hp, 1.0, .1), u), { wash: C.horn, fill: C.hornDk, fillOp: 50, tex: .4, ink: INK, sw: sw * .7, curv: .5 });
    inkLine(P([[s * 1.55 + lean, -9.4], [s * 1.9 + lean, -9.25]]), sw * .5, C.hornDk, 'inkfine', 0);
  }
  rs('sprout');
  const top = [lean * 1.2, -9.35], tip = [lean * 1.25 + lf * .5, -11.3];
  inkLine(P([top, [lerp(top[0], tip[0], .5) + .15, -10.3], tip]), sw * 2.4, C.stem, 'ink', .5);
  for (const d of [-1, 1]) {
    const a = d * (-.45 + lf * .3), lx = tip[0] + d * .75, ly = tip[1] - .45 - d * lf * .1;
    paint(ellPts(lx * u, ly * u, .85 * u, .42 * u, 14, 0, a), { wash: C.leaf, fill: C.leafDk, fillOp: 40, tex: .4, ink: INK, sw: sw * .55 });
    inkLine(P([[tip[0], tip[1]], [lx + d * .5, ly - d * .05 * Math.sign(a)]]), sw * .45, C.leafDk, 'inkfine', .3);
  }
  // ---- the ears with gold hoops
  rs('ears');
  for (const s of [-1, 1]) {
    paint(P([[s * 3.3 + lean * .5, -7.6], [s * 4.5 + lean * .5, -8.4], [s * 4.0 + lean * .5, -6.6], [s * 3.4 + lean * .5, -6.2]]), { wash: col, ink: INK, sw: sw * .7, curv: .3 });
    const hr = ellPts((s * 3.85 + lean * .5) * u, -5.85 * u, .32 * u, .38 * u, 12); inkLine([...hr, hr[0], hr[1]], sw * 1.3, C.gold, 'ink', .5);
  }
  // ---- the body: the bean, the belly, the shorts and belt
  rs('body');
  const body = rbBodyPts(u, lean);
  paint(body, { wash: col, ink: null, curv: .4 });
  paint(ellPts((-1.4 + lean * .4) * u, -7.6 * u, 1.5 * u, .8 * u, 14, J * 2, -.3), { fill: lt, fillOp: 120, bleed: .2, tex: .85, border: .8, ink: null });
  paint(ellPts(0, -3.6 * u, 2.5 * u, 2.2 * u, 20, J), { wash: C.belly, fill: C.bellyDk, fillOp: 40, tex: .4, ink: null });
  paint(ellPts(0, -1.6 * u, 3.4 * u, .9 * u, 16, J), { fill: dk, fillOp: 70, bleed: .1, tex: .6, border: .5, ink: null });
  paint(body, { ink: INK, sw: sw * 1.05, curv: .4 });
  paint(ellPts(0, -3.15 * u, .17 * u, .2 * u, 8), { wash: C.bellyDk, ink: null });   // navel
  rs('shorts');
  paint(P([[-3.75, -2.75], [3.75, -2.75], [3.55, -1.7], [2.6, -1.05], [1.0, -1.25], [0, -1.7], [-1.0, -1.25], [-2.6, -1.05], [-3.55, -1.7]]), { wash: C.shorts, fill: C.shortsDk, fillOp: 60, tex: .5, ink: INK, sw: sw * .8, curv: .3 });
  paint(ribbon(P([[-3.75, -2.75], [0, -2.95], [3.75, -2.75]]), .55 * u, .55 * u), { wash: C.gold, fill: C.goldDk, fillOp: 50, tex: .4, ink: INK, sw: sw * .55 });
  rs('buckle');
  paint(P([[0, -3.55], [.38, -2.95], [0, -2.45], [-.38, -2.95]]), { wash: C.ruby, ink: INK, sw: sw * .45, curv: .4 });
  if (o.held) { rs('held'); o.held(u, sw); }

  // ---- the face
  push(); translate(lean * .3 * u, 0);
  rs('brows');
  const ek = Array.isArray(o.eyes) ? o.eyes[0] : o.eyes || 'normal';
  const b = clamp(o.brows ?? (ek === 'angry' ? -1 : ek === 'scared' || ek === 'wide' ? .7 : 0), -1, 1);
  {   // ONE thick unibrow: it dips in the middle when angry, arches when scared
    const yE = -7.95 - Math.max(0, b) * .35, yM = -8.05 + b * .55 + Math.max(0, b) * .1;
    paint(ribbon(P([[-2.2, yE + (b < 0 ? .35 * b : 0)], [-1.1, yE - .2], [0, yM], [1.1, yE - .2], [2.2, yE + (b < 0 ? .35 * b : 0)]]), .5 * u, .5 * u), { wash: C.brow, ink: null });
  }
  rs('eyes');
  const own = ['normal', 'wide', 'happy', 'angry', 'scared', 'swirl', 'closed', 'side', 'squeeze'];
  if (own.includes(ek)) {
    const blink = ((T * .9 + (o.seed || 0) * 1.37 + .5) % 3.4) < .1;
    for (const s of [-1, 1]) {
      const ex = s * 1.15, ey = -6.7;
      if (ek === 'happy') { inkLine(P([[ex - .65, ey + .25], [ex, ey - .4], [ex + .65, ey + .25]]), sw * 1.4, INK, 'ink', .6); continue; }
      if (ek === 'squeeze') { inkLine(P([[ex - s * .6, ey - .4], [ex + s * .5, ey], [ex - s * .6, ey + .4]]), sw * 1.4, INK, 'ink', .2); continue; }
      if (ek === 'closed' || (blink && ['normal', 'angry', 'side'].includes(ek))) { inkLine(P([[ex - .6, ey], [ex, ey + .3], [ex + .6, ey]]), sw * 1.3, INK, 'ink', .6); continue; }
      const wide = ek === 'wide' || ek === 'scared', rx = wide ? .95 : .82, ry = wide ? 1.05 : .9;
      paint(ellPts(ex * u, ey * u, rx * u, ry * u, 16), { wash: C.eye, ink: INK, sw: sw * .6 });
      if (ek === 'swirl') { const sp = []; for (let i = 0; i < 18; i++) { const a = i * .7 + T * 8 * s, r = .05 + i * .04; sp.push([(ex + Math.cos(a) * r) * u, (ey + Math.sin(a) * r) * u]); } inkLine(sp, sw * .7, INK, 'inkfine', .5); continue; }
      const pr = ek === 'scared' ? .22 : .42, lx = (ek === 'side' ? .45 * Math.sign(o.lookX || 1) : (o.lookX || 0) * .35), ly = (o.lookY || 0) * .3;
      paint(ellPts((ex + lx) * u, (ey + ly + .05) * u, pr * u, (pr + .1) * u, 10), { wash: C.pupil, ink: null });
      paint(ellPts((ex + lx - pr * .35) * u, (ey + ly - pr * .4) * u, pr * .3 * u, pr * .3 * u, 6), { wash: '#FFFFFF', ink: null });
      if (ek === 'side') { paint(P([[ex - rx - .1, ey - ry - .2], [ex + rx + .1, ey - ry - .2], [ex + rx + .1, ey - .1], [ex - rx - .1, ey - .1]]), { wash: col, ink: null }); inkLine(P([[ex - rx, ey - .1], [ex + rx, ey - .1]]), sw * 1.2, INK, 'ink', 0); }
      if (ek === 'angry') { paint(P([[ex - rx - .1, ey - ry - .25], [ex + rx + .1, ey - ry - .25], [ex + rx + .1, ey - .25 - s * .35 * rx], [ex - rx - .1, ey - .25 + s * .35 * rx]]), { wash: col, ink: null }); inkLine(P([[ex - rx - .05, ey - .25 + s * .35 * rx], [ex + rx + .05, ey - .25 - s * .35 * rx]]), sw * 1.2, INK, 'ink', 0); }
    }
  } else { push(); translate(0, -6.6 * u); scale(.55); translate(0, 6 * u); eyes(u, o, sw / .55 * .85, [-1, 1], 0); pop(); }
  if (o.sweat) { rs('sweat'); const k = clamp(o.sweat); paint(P([[2.7, -8.6 + k * .7], [3.0, -8.0 + k * .7], [2.7, -7.6 + k * .7], [2.4, -8.0 + k * .7]]), { wash: '#BFE0F4', ink: INK, sw: sw * .4, curv: .5 }); }
  if (o.blush) for (const s of [-1, 1]) paint(ellPts(s * 2.2 * u, -5.4 * u, .7 * u, .35 * u, 12), { fill: PAL.rose, fillOp: 160 * clamp(o.blush), bleed: .2, tex: .4, ink: null });
  rs('nose');
  paint(ellPts(0, -5.85 * u, .42 * u, .32 * u, 10), { wash: dk, ink: INK, sw: sw * .45 });
  rs('mouth');
  const m = o.mouth || 'grin', mk = clamp(o.mouthK ?? 1, 0, 1.4), my = -5.0;
  if (m === 'grin' || m === 'teeth') {
    paint(P([[-1.7, my - .25], [-.9, my - .05], [0, my], [.9, my - .05], [1.7, my - .25], [1.2, my + .55], [0, my + .85], [-1.2, my + .55]]), { wash: C.mouth, ink: INK, sw: sw * .7, curv: .4 });
    paint(P([[-1.45, my - .15], [1.45, my - .15], [1.2, my + .2], [-1.2, my + .2]]), { wash: C.fang, ink: null, curv: .3 });
    for (const k of [-.75, 0, .75]) inkLine(P([[k, my - .12], [k, my + .15]]), sw * .4, C.hornDk, 'inkfine', 0);
    paint(P([[.55, my + .15], [1.0, my + .15], [.8, my + .75]]), { wash: C.fang, ink: INK, sw: sw * .4 });   // THE fang
  } else if (m === 'open' || m === 'O') {
    const w = m === 'O' ? .55 : .95 + .4 * mk, d = m === 'O' ? .9 : .7 + .9 * mk;
    paint(P([[-w, my - .3], [w, my - .3], [w * .8, my - .3 + d * .7], [0, my - .3 + d], [-w * .8, my - .3 + d * .7]]), { wash: C.mouth, ink: INK, sw: sw * .75, curv: .45 });
    if (m !== 'O') { paint(P([[-w * .5, my - .3 + d * .72], [w * .5, my - .3 + d * .72], [0, my - .3 + d * .95]]), { wash: C.tongue, ink: null, curv: .5 }); paint(P([[.35, my - .28], [.75, my - .28], [.55, my + .25]]), { wash: C.fang, ink: INK, sw: sw * .4 }); }
  } else if (m === 'smirk') { inkLine(P([[-1.3, my + .1], [.3, my + .25], [1.4, my - .35]]), sw * 1.1, INK, 'ink', .6); paint(P([[.75, my + .12], [1.1, my + .02], [.95, my + .55]]), { wash: C.fang, ink: INK, sw: sw * .4 }); }
  else if (m === 'frown') inkLine(P([[-1.2, my + .4], [0, my - .1], [1.2, my + .4]]), sw * 1.1, INK, 'ink', .5);
  else if (m === 'flat') inkLine(P([[-1, my + .1], [1, my + .1]]), sw * 1.1, INK, 'ink', 0);
  else if (m === 'wobble') inkLine(P([[-1.2, my + .15], [-.6, my - .1], [0, my + .15], [.6, my - .1], [1.2, my + .15]]), sw * 1.0, INK, 'ink', .5);
  else { push(); translate(0, my * u); scale(.5); translate(0, 4.3 * u); mouth(u, m, sw / .5 * .8); pop(); }
  pop();
  if (o.hat) { rs('hat'); o.hat(u, sw); }

  // ---- arms: noodles with gold armlets; hands; the mace in the right hand
  for (const s of [-1, 1]) {
    rs('arm' + s);
    const [sh, el, ha] = rbArm(o, s), hook = s < 0 ? o.armL : o.armR, shape = (s < 0 ? o.handShapeL : o.handShapeR) || (s > 0 && o.mace !== false ? 'hold' : 'fist');
    if (s > 0 && o.mace !== false) { push(); translate(ha[0] * u, ha[1] * u); rbMace(u, sw, o.maceA ?? .35, INK); pop(); }
    paint(ribbon(P([sh, el, ha]), .95 * u, .75 * u), { wash: col, fill: dk, fillOp: 40, tex: .4, ink: INK, sw: sw * .75 });
    const dd = Math.hypot(el[0] - sh[0], el[1] - sh[1]) || 1, nx = -(el[1] - sh[1]) / dd * .5, ny = (el[0] - sh[0]) / dd * .5, bx = lerp(sh[0], el[0], .55), by = lerp(sh[1], el[1], .55);
    inkLine(P([[bx - nx, by - ny], [bx + nx, by + ny]]), sw * 1.8, C.gold, 'ink', 0);
    push(); translate(ha[0] * u, ha[1] * u);
    rbHandShape(u, sw, shape, s, col, dk, INK);
    if (hook) hook(u, sw);
    pop();
  }
  pop();

  if (o.emote) {
    rs('emote');
    const [ex, ey] = rbWorld(x, y, u, o, (o.flip ? -1 : 1) * 4.5, -11);
    emote(o.emote, ex, ey, u * 1.1, o.emoteK ?? 1, o.emoteAge ?? T);
  }
  rs('after');
}

// Model sheet: studio.html?loop=raktabija, or node render.mjs --loop=raktabija --sheet=0.5 --cols=1 --w=720
(() => {
  LOOPS.raktabija = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: '#1E2246', ink: null });
    const looks = [
      { eyes: 'normal', mouth: 'grin' },
      { eyes: 'happy', mouth: 'open', mouthK: .8 + .3 * Math.sin(t * 14), handR: [5.4, -8.6], handShapeL: 'point', handL: [-5.2, -6.4] },
      { eyes: 'angry', mouth: 'teeth', maceA: -.3, handR: [4.6, -7.8] },
      { eyes: 'scared', mouth: 'wobble', sweat: frac(t), shake: 1, mace: false, handShapeR: 'open', handShapeL: 'open', handL: [-3.6, -6.6], handR: [3.6, -6.6] },
      { eyes: 'side', mouth: 'smirk', lookX: -1, mace: false, handShapeR: 'thumb', handR: [4.2, -6.4] },
      { eyes: 'swirl', mouth: 'O', grow: Math.min(1, frac(t / 2) * 1.6), mace: false },
    ];
    looks.forEach((o, i) => raktabija(180 + (i % 3) * 360, 600 + Math.floor(i / 3) * 620, 34, { seed: i, ...o }));
    for (let i = 0; i < 8; i++) raktabija(80 + i * 130, 1620, 9, { lod: 1, seed: i, eyes: i % 3 ? 'normal' : 'happy' });
    raktabija(540, 1850, 14, { seed: 9 });
    bloodSeed(960, 1500, 22, 0, 'seedA');
    bloodSeed(980, 1700, 16, Math.PI, 'seedB');
  };
  LOOPS.raktabija.len = 4;
})();
