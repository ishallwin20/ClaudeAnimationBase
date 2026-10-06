// aarav.js: Aarav, a seven-year-old Indian boy, the kid of Rishi Katha's "book doorway" reels: a messy black mop with a
// cowlick, big glossy eyes, a turquoise tee with orange cuffs and collar and a little orange star (the brand's colours),
// navy shorts, bare feet. Front view only, in three poses, each drawn for itself (nothing is rotated into place):
//   pose 'stand'  (x, y) is the ground between his feet. About 20.5u tall to the cowlick, 6u wide.
//   pose 'sit'    sitting on a ledge (a bed edge) facing us: (x, y) is the ledge's front edge under his seat. The thighs
//                 come toward us and the shins hang down to about +4.8u. back 0..1 topples him backwards (the upper
//                 body tips away and drops, the legs fly up, soles to us).
//   pose 'sleep'  lying in bed seen from its foot: the upper body only (the scene paints the pillow behind and the blanket
//                 over him). (x, y) as for 'sit'; tilt the head with htilt.
// Load after bappa.js (U()) and clawd.js (eyes() / mouth() / emote(), so feel() and emotions() drive him too).
//
// Body-local coordinates in u (y up is negative), for 'stand' (sit and sleep move the whole upper body down by 5.8u):
//   feet (±1.45, -.4) · knees (±1.2, -3.0) · shorts -8.1..-4.8 · tee -12.6..-7.4 · shoulders (±2.35, -11.7)
//   head centre (0, -16.0), 3.2 × 3.0 · eyes (±1.2, -15.75) · nose (0, -15.0) · mouth (0, -14.3) · cowlick tip (1.6, -20.9)
//
// Options (all optional):
//   pose:   pose, dx, dy (u), sq, rot (pivots at (x, y)), flip, hx (-1..1 head turn), htilt (radians), nod (u, the head
//           dips), walk (phase, stand), inhale 0..1 (a big breath: chest swells, shoulders and head rise), tremble 0..1,
//           kick (-1..1, sit: the shins swing), back 0..1 (sit: the topple)
//   arms:   handL / handR = [x, y] in body u (2-bone arms; out-of-reach targets are pulled in), bendL / bendR (1 elbows
//           out, -1 in), handShapeL / handShapeR ('open' | 'fist' | 'claw' | 'point' | 'hold'), handAL / handAR (the
//           hand's angle in radians, default along the forearm). Without hand targets, aL / aR (feel()'s arm angles) swing
//           the arms; resting they hang.
//   face:   eyes, mouth, lookX / lookY, squint, blush, brows (-1 angry .. +1 raised), worry 0..1, mouthK (roar size),
//           seed, tint + tintK. His own eyes: 'normal' / 'look' / 'wide' / 'happy' / 'closed' / 'squeeze' / 'sad'; every
//           other kind is Clawd's. His own mouths: 'smile' / 'grin' / 'O' / 'mew' / 'roar' / 'wobble' / 'flat' /
//           'frown' / 'smirk' / 'puff' / 'open'; every other kind is Clawd's.
//   hooks:  behind(u, sw) (body space, drawn first: a mane, a tail), hat(u, sw) (head space, over the hair: horns),
//           held(u, sw) (body space, over the torso and arms, under the hands)
//   look:   pal (overrides AAR colours, e.g. another kid), hair 'mop' (default) | 'neat' (a side parting), star (false
//           hides the tee's star)
//   extras: emote + emoteK + emoteAge, boilKey, noShadow, legs (false: no legs), swMul
// Helpers: aaravHand(x, y, u, o, s), aaravHead(x, y, u, o), aaravMouth(x, y, u, o), aaravChest(x, y, u, o) → world [x, y].
const AAR = {
  skin: '#C98B5F', skinDk: '#A0663F', skinLt: '#E6B088', ink: '#3A2418', lip: '#8E4A3A', mouth: '#5A2026', tongue: '#E07A72',
  hair: '#231A1E', hairLt: '#4A3A40', eye: '#2A1A12', white: '#FFF8EC', cheek: '#E58A72',
  tee: '#2FA7A0', teeDk: '#1F7A75', teeLt: '#78D0C6', cuff: '#F15A24', cuffDk: '#C4441A', star: '#F7A23A',
  shorts: '#2E3F66', shortsDk: '#1F2C4A', sole: '#D9A07A',
};

const AAR_UP = { stand: 0, sit: 5.8, sleep: 5.8 };
function aaravShoulder(o, s) { return [s * 2.35, -11.7 - clamp(o.inhale || 0) * .45]; }
// Hand target for one side, in body u, with the upper-body offset already applied
function aaravArm(o, s) {
  const up = AAR_UP[o.pose || 'stand'] ?? 0, sh0 = aaravShoulder(o, s), sh = [sh0[0], sh0[1] + up], L1 = 2.45, L2 = 2.35;
  let h = s < 0 ? o.handL : o.handR;
  if (h) h = [h[0], h[1] + up];
  else { const a = (s < 0 ? o.aL : o.aR) ?? -1.3, ang = -1.3 + (clamp(a, -1.5, 1.6) + 1.3) * .55; h = [sh[0] + s * Math.cos(ang) * 4.3, sh[1] - Math.sin(ang) * 4.3]; }
  let dx = h[0] - sh[0], dy = h[1] - sh[1], d = Math.hypot(dx, dy) || 1e-3;
  const reach = L1 + L2 - .05;
  if (d > reach) { h = [sh[0] + dx / d * reach, sh[1] + dy / d * reach]; dx = h[0] - sh[0]; dy = h[1] - sh[1]; d = reach; }
  d = Math.max(d, .6);
  const a = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1)), base = Math.atan2(dy, dx);
  // the two elbow solutions; pick the one on the outside (away from the body's midline), or inside when bend < 0
  const e1 = [sh[0] + Math.cos(base + a) * L1, sh[1] + Math.sin(base + a) * L1], e2 = [sh[0] + Math.cos(base - a) * L1, sh[1] + Math.sin(base - a) * L1];
  const out = (e1[0] - e2[0]) * s > 0 ? e1 : e2, inn = out === e1 ? e2 : e1;
  const bend = (s < 0 ? o.bendL : o.bendR) ?? 1;
  return [sh, bend < 0 ? inn : out, h];
}
function aaravWorld(x, y, u, o, px, py) {
  const sq = o.sq || 0, fx = o.flip ? -1 : 1, r = o.rot || 0;
  const lx = fx * px * u * (1 + sq * .6), ly = py * u * (1 - sq);
  const tr = (o.tremble ? Math.sin(T * 70) * .12 * o.tremble : 0);
  return [x + ((o.dx || 0) + tr) * u + lx * Math.cos(r) - ly * Math.sin(r), y + (o.dy || 0) * u + lx * Math.sin(r) + ly * Math.cos(r)];
}
function aaravHeadLocal(o) {
  const up = AAR_UP[o.pose || 'stand'] ?? 0, back = o.pose === 'sit' ? clamp(o.back || 0) : 0;
  const hy = -16.0 - clamp(o.inhale || 0) * .55 + (o.nod || 0) + up;
  return [clamp(o.hx || 0, -1, 1) * .45, hy + back * aaravBackDrop(hy, o)];
}
function aaravHand(x, y, u, o, s) { const [, , h] = aaravArm(o, s); return aaravWorld(x, y, u, o, h[0], h[1] + aaravTopple(o) * aaravBackDrop(h[1], o)); }
function aaravHead(x, y, u, o = {}) { const h = aaravHeadLocal(o); return aaravWorld(x, y, u, o, h[0], h[1]); }
function aaravMouth(x, y, u, o = {}) { const h = aaravHeadLocal(o); return aaravWorld(x, y, u, o, h[0] + clamp(o.hx || 0, -1, 1) * .5, h[1] + 1.75); }
function aaravChest(x, y, u, o = {}) { const up = AAR_UP[o.pose || 'stand'] ?? 0; return aaravWorld(x, y, u, o, 0, -10 + up + aaravTopple(o) * aaravBackDrop(-10 + up, o)); }
function aaravTopple(o) { return o.pose === 'sit' ? clamp(o.back || 0) : 0; }
// sit + back: the upper body tips away from us, so it foreshortens toward the seat (y 0); returns how far a point at
// local y drops per unit of back
function aaravBackDrop(py, o) { return py < 0 ? -py * .45 : 0; }

// ---- a hand, drawn at the wrist, fingers along +x, palm toward us; s mirrors it so the thumb is on the inside
function aaravHandShape(u, sw, shape, s, col, dk, INK) {
  const P = pts => U(pts, u);
  push(); scale(1, -s);
  const thumb = [[.95, .42], [1.12, .72], [1.0, 1.0], [.7, .98], [.42, .62]];
  if (shape === 'fist' || shape === 'point') {
    paint(P([[0, -.5], [.55, -.62], [1.0, -.55], [1.22, -.2], [1.18, .25], [.95, .5], [.5, .58], [0, .5]]), { wash: col, ink: INK, sw: sw * .8, curv: .5 });
    for (const k of [-.28, .02, .3]) inkLine(P([[1.0, k - .02], [1.18, k]]), sw * .5, dk, 'inkfine', 0);   // knuckle creases
    inkLine(P([[.45, .5], [.75, .2], [1.0, .1]]), sw * .6, INK, 'inkfine', .5);                        // the thumb folded across
    if (shape === 'point') paint(P([[1.05, -.5], [1.9, -.48], [2.15, -.36], [2.1, -.18], [1.85, -.1], [1.1, -.12]]), { wash: col, ink: INK, sw: sw * .75, curv: .5 });
  } else if (shape === 'claw') {
    // the palm open, the four fingers bent at the middle knuckle: a bumpy top edge with a little hook on each
    paint(P([[0, -.52], [.6, -.66], [1.05, -.62], [1.35, -.45], [1.42, -.18], [1.42, .1], [1.3, .36], [1.0, .42], ...thumb, [0, .52]]), { wash: col, ink: INK, sw: sw * .8, curv: .45 });
    for (const k of [-.4, -.14, .12]) {
      inkLine(P([[1.0, k], [1.32, k - .04], [1.5, k + .08]]), sw * .55, INK, 'inkfine', .5);
      paint(P([[1.42, k + .02], [1.62, k + .1], [1.45, k + .17]]), { wash: AAR.white, ink: INK, sw: sw * .35 });   // a play claw
    }
  } else if (shape === 'hold') {   // fingers curled over an edge, seen from the front: short, with the knuckle lines
    paint(P([[0, -.5], [.6, -.6], [1.1, -.55], [1.3, -.2], [1.28, .25], [1.05, .5], [.5, .56], [0, .5]]), { wash: col, ink: INK, sw: sw * .8, curv: .5 });
    for (const k of [-.3, 0, .28]) inkLine(P([[.75, k], [1.25, k + .02]]), sw * .5, dk, 'inkfine', 0);
  } else {   // open
    paint(P([[0, -.5], [.6, -.62], [1.3, -.55], [1.6, -.22], [1.62, .12], [1.42, .4], [1.05, .45], ...thumb, [0, .52]]), { wash: col, ink: INK, sw: sw * .8, curv: .45 });
    for (const k of [-.24, .06]) inkLine(P([[1.12, k], [1.58, k - .01]]), sw * .5, dk, 'inkfine', 0);
  }
  pop();
}

function aarav(x, y, u, o = {}) {
  const id = o.boilKey ?? 'a' + (++CLAWD_N), rs = p => boilSeed(`aarav ${id} ${p}`);
  const C = { ...AAR, ...(o.pal || {}) };
  const pose = o.pose || 'stand', up = AAR_UP[pose] ?? 0, back = pose === 'sit' ? clamp(o.back || 0) : 0;
  const sq = (o.sq || 0) + (o.take || 0), sw = clamp(u / 20, .4, 2) * (o.swMul || 1), J = u * .035;
  // his own skin always; feel()'s tint shifts it (emotions() hands over Clawd-based col / dk / lt mid-change: ignored)
  const { col, dk, lt } = tintCols({ tint: o.tint, tintK: o.tintK, col: C.skin, dk: C.skinDk, lt: C.skinLt });
  const INK = C.ink, inh = clamp(o.inhale || 0), hx = clamp(o.hx || 0, -1, 1), wk = pose === 'stand' ? o.walk : null;
  // every upper-body point goes through B(): the sit / sleep offset, and the topple's foreshortening
  const by = py => py + up + back * aaravBackDrop(py + up, o);
  const B = pts => U(pts.map(([a, b]) => [a, by(b)]), u);
  const tr = o.tremble ? Math.sin(T * 70) * .12 * o.tremble : 0;

  if (!o.noShadow && pose === 'stand') { rs('shadow'); const f = 1 - Math.min(.5, Math.abs(o.dy || 0) * .05); paint(ellPts(x + (o.dx || 0) * u, y + u * .1, u * 3.6 * f, u * .8 * f, 22), { fill: PAL.ink, fillOp: 80, bleed: .25, tex: .3, border: .1, ink: null }); }
  push();
  translate(x + ((o.dx || 0) + tr) * u, y + (o.dy || 0) * u);
  if (o.rot) rotate(o.rot);
  scale((o.flip ? -1 : 1) * (1 + sq * .6), 1 - sq);

  if (o.behind) { rs('behind'); o.behind(u, sw); }

  // ---------------- legs
  if (o.legs !== false && pose === 'stand') {
    rs('legs');
    for (const s of [-1, 1]) {
      const l = wk == null ? 0 : Math.max(0, Math.sin((wk + (s < 0 ? 0 : .5)) * TAU)) * .9;
      const hip = [s * 1.15, -5.6], knee = [s * 1.22, -3.0 - l * .35], ank = [s * 1.3, -.8 - l];
      paint(U(ribbon([hip, knee, ank], 1.4, 1.1), u), { wash: s < 0 ? col : lt, fill: dk, fillOp: s < 0 ? 40 : 15, tex: .4, ink: INK, sw: sw * .85, curv: .3 });
      inkLine(U([[knee[0] - .35, knee[1] + .05], [knee[0], knee[1] - .12], [knee[0] + .35, knee[1] + .05]], u), sw * .45, dk, 'inkfine', .5);   // knee
      // the foot: toes forward and a little out, one shape with three toe bumps on the front edge
      const fx = s * 1.48, fy = -.42 - l;
      paint(U([[fx - .95, fy + .1], [fx - .9, fy - .35], [fx - .2, fy - .55], [fx + .55, fy - .45], [fx + s * .2 + .9, fy - .1], [fx + .85, fy + .3], [fx + .3, fy + .45], [fx - .5, fy + .45]], u), { wash: s < 0 ? col : lt, ink: INK, sw: sw * .8, curv: .5 });
      for (const k of [-.45, -.1, .25]) inkLine(U([[fx + k * s, fy + .42], [fx + k * s + .05 * s, fy + .2]], u), sw * .45, dk, 'inkfine', 0);
    }
  }
  const sitLegs = () => {
    rs('legs');
    const kick = clamp(o.kick || 0, -1, 1);
    for (const s of [-1, 1]) {
      // the shins hang from the knees; kick swings them toward us (they shorten); the topple throws them up
      const knee = [s * (1.75 + back * .9), .95 - back * 2.6], sl = 3.3 * (1 - .35 * Math.abs(kick)) * (1 - back * .2);
      const ank = [s * (1.45 + back * 3.4), knee[1] + sl * (1 - back * 2.7)];
      const sole = back > .35 || kick > .5;
      paint(U(ribbon([knee, [lerp(knee[0], ank[0], .5), lerp(knee[1], ank[1], .5)], ank], 1.3, 1.05), u), { wash: s < 0 ? col : lt, fill: dk, fillOp: s < 0 ? 40 : 15, tex: .4, ink: INK, sw: sw * .85, curv: .3 });
      const fy = ank[1] + (back > .35 ? -.55 : .45), fx = ank[0] + s * .05;
      if (sole) {   // seen from below: the sole, round, with the toes along the top
        paint(ellPts(fx * u, fy * u, .78 * u, 1.05 * u, 16, J), { wash: C.sole, ink: INK, sw: sw * .8 });
        for (let k = 0; k < 4; k++) paint(ellPts((fx - .45 + k * .3) * u, (fy - .95 + Math.abs(k - 1.5) * .08) * u, .17 * u, .19 * u, 8), { wash: C.sole, ink: INK, sw: sw * .4 });
      } else {      // seen from the front, toes toward us: a wide rounded wedge with toe bumps
        paint(U([[fx - .85, fy - .3], [fx + .85, fy - .3], [fx + .95, fy + .2], [fx + .6, fy + .5], [fx - .6, fy + .5], [fx - .95, fy + .2]], u), { wash: s < 0 ? col : lt, ink: INK, sw: sw * .8, curv: .5 });
        for (const k of [-.45, -.12, .2, .5]) inkLine(U([[fx + k, fy + .48], [fx + k, fy + .28]], u), sw * .45, dk, 'inkfine', 0);
      }
      paint(ellPts(knee[0] * u, (knee[1] - .1) * u, .92 * u, .72 * u, 16, J), { wash: s < 0 ? col : lt, ink: INK, sw: sw * .8 });   // the knee, toward us
    }
  };
  if (o.legs !== false && pose === 'sit' && back <= .35) sitLegs();

  // ---------------- shorts
  if (pose !== 'sleep') {
    rs('shorts');
    if (pose === 'stand') {
      paint(B([[-2.55, -8.1], [2.55, -8.1], [2.75, -6.4], [2.9, -4.9], [.25, -4.75], [0, -5.7], [-.25, -4.75], [-2.9, -4.9], [-2.75, -6.4]]), { wash: C.shorts, fill: C.shortsDk, fillOp: 70, bleed: .06, tex: .6, border: .4, ink: INK, sw: sw * .85, curv: .2 });
      inkLine(B([[-2.6, -7.6], [0, -7.5], [2.6, -7.6]]), sw * .5, C.shortsDk, 'inkfine', .3);   // waistband
      for (const s of [-1, 1]) inkLine(B([[s * 2.7, -5.1], [s * 1.6, -5.0], [s * .4, -4.95]]), sw * .5, C.shortsDk, 'inkfine', .3);
    } else {   // the lap: the thighs come toward us, the shorts' hems round the knees
      const ky = .95 - back * 1.6;
      paint(U([[-2.6, -2.3 + back * 1.4], [2.6, -2.3 + back * 1.4], [3.05, -.8], [2.95, ky + .05], [1.75, ky + .3], [.55, ky - .05], [0, -.1], [-.55, ky - .05], [-1.75, ky + .3], [-2.95, ky + .05], [-3.05, -.8]], u), { wash: C.shorts, fill: C.shortsDk, fillOp: 70, bleed: .06, tex: .6, border: .4, ink: INK, sw: sw * .85, curv: .3 });
      for (const s of [-1, 1]) inkLine(U([[s * .6, ky - .3], [s * 1.75, ky + .02], [s * 2.85, ky - .2]], u), sw * .5, C.shortsDk, 'inkfine', .5);
    }
  }

  // ---------------- torso: the tee
  rs('tee');
  const shY = -12.35 - inh * .45, tw = 1 + inh * .07;
  const tee = [[-2.3, shY], [-1.0, shY - .25], [1.0, shY - .25], [2.3, shY], [2.7, -11.4 - inh * .3], [2.78 * tw, -9.5], [2.85, -7.6], [1.4, -7.35], [0, -7.3], [-1.4, -7.35], [-2.85, -7.6], [-2.78 * tw, -9.5], [-2.7, -11.4 - inh * .3]];
  paint(B(tee), { wash: C.tee, fill: C.teeDk, fillOp: 50, bleed: .08, tex: .5, border: .4, ink: INK, sw: sw * .9, curv: .35 });
  paint(B([[-2.6, -11.2], [-2.0, -11.5], [-1.7, -9.5], [-1.95, -7.6], [-2.7, -7.7], [-2.7, -9.5]]), { wash: C.teeDk, washOp: 110, ink: null, curv: .4 });   // shade on his right
  inkLine(B([[-1.2, -8.6], [-.4, -8.25], [.5, -8.5]]), sw * .45, C.teeDk, 'inkfine', .5);   // a fold
  if (o.star !== false) { rs('star'); paint(starPts(1.25 * u, by(-10.1) * u, .62 * u, .45, 5, -Math.PI / 2), { wash: C.star, ink: INK, sw: sw * .45 }); }
  rs('collar');
  paint(B([[-1.15, shY - .2], [0, shY + .6], [1.15, shY - .2], [.9, shY + .15], [0, shY + 1.0], [-.9, shY + .15]]), { wash: C.cuff, ink: INK, sw: sw * .6, curv: .5 });

  // ---------------- arms: upper arm in a sleeve, the forearm bare; the hands come after the held prop
  const arms = [-1, 1].map(s => {
    const [sh, el, ha] = aaravArm(o, s), sk = s < 0 ? col : lt;
    const T3 = p => [p[0], p[1] - up];   // aaravArm already added `up`; B() adds it again
    rs('arm' + s);
    paint(B(ribbon([T3(sh), T3(el), T3(ha)], 1.08, .9)), { wash: sk, fill: dk, fillOp: s < 0 ? 40 : 15, tex: .4, ink: INK, sw: sw * .8, curv: .3 });
    // the sleeve: a short tube from the shoulder 45% of the way to the elbow, flaring a little, with an orange cuff
    const ux = el[0] - sh[0], uy = el[1] - sh[1], ul = Math.hypot(ux, uy) || 1, nx = -uy / ul, ny = ux / ul;
    const se = [sh[0] + ux * .5, sh[1] + uy * .5], w0 = .95, w1 = .82;
    const sl = [[sh[0] + nx * w0 - ux / ul * .4, sh[1] + ny * w0 - uy / ul * .4], [se[0] + nx * w1, se[1] + ny * w1], [se[0] - nx * w1, se[1] - ny * w1], [sh[0] - nx * w0 - ux / ul * .4, sh[1] - ny * w0 - uy / ul * .4]];
    paint(B(sl.map(T3)), { wash: C.tee, fill: C.teeDk, fillOp: s < 0 ? 80 : 30, tex: .5, ink: INK, sw: sw * .8, curv: .25 });
    const c0 = [se[0] - ux / ul * .32, se[1] - uy / ul * .32];
    paint(B([[c0[0] + nx * w1, c0[1] + ny * w1], [se[0] + nx * w1, se[1] + ny * w1], [se[0] - nx * w1, se[1] - ny * w1], [c0[0] - nx * w1, c0[1] - ny * w1]].map(T3)), { wash: C.cuff, ink: INK, sw: sw * .6 });
    return { s, el: T3(el), ha: T3(ha), sk };
  });

  // ---------------- head
  const hl = aaravHeadLocal({ ...o, pose: 'stand', back: 0 });   // in stand space; B() places it
  push();
  translate(hx * .45 * u, (by(hl[1]) - hl[1]) * u);
  if (o.htilt) { translate(0, -13 * u); rotate(o.htilt); translate(0, 13 * u); }
  const hy = -16.0 - inh * .55 + (o.nod || 0), H = pts => U(pts.map(([a, b]) => [a, b + hy + 16]), u);
  rs('neck');
  paint(H([[-.75, -13.6], [.75, -13.6], [.8, -12.4], [-.8, -12.4]]), { wash: dk, ink: INK, sw: sw * .6 });
  const neat = o.hair === 'neat';
  rs('backhair');
  paint(H([[-3.45, -15.4], [-3.65, -17.4], [-3.0, -19.1], [-1.6, -19.95], [.3, -20.15], [2.1, -19.7], [3.3, -18.5], [3.65, -16.8], [3.45, -15.4], [0, -15.0]]), { wash: C.hair, ink: INK, sw: sw * .8, curv: .4 });
  rs('ears');
  for (const s of [-1, 1]) {
    paint(ellPts(s * 3.2 * u, (hy + .25) * u, .62 * u, .88 * u, 14, J), { wash: col, fill: dk, fillOp: 60, tex: .5, ink: INK, sw: sw * .7 });
    inkLine(H([[s * 3.25, -16.2], [s * 3.42, -15.75], [s * 3.22, -15.3]]), sw * .45, dk, 'inkfine', .5);
  }
  rs('face');
  push(); translate(hx * .5 * u, 0);
  const face = H([[-3.2, -16.6], [-3.05, -15.0], [-2.55, -13.85], [-1.4, -13.05], [0, -12.85], [1.4, -13.05], [2.55, -13.85], [3.05, -15.0], [3.2, -16.6], [2.7, -18.2], [0, -18.9], [-2.7, -18.2]]);
  paint(face, { wash: col, ink: null, curv: .5 });
  paint(ellPts((-1.1 + hx * .3) * u, (hy - 1.4) * u, 1.5 * u, .8 * u, 14, J * 2, -.2), { fill: lt, fillOp: 120, bleed: .2, tex: .8, border: .8, ink: null });
  paint(ellPts(0, (hy + 2.6) * u, 2.1 * u, .6 * u, 14, J), { fill: dk, fillOp: 50, bleed: .1, tex: .6, border: .5, ink: null });
  paint(face, { ink: INK, sw, curv: .5 });
  pop();
  rs('hairfront');
  if (neat) {
    paint(H([[-3.35, -15.6], [-3.5, -17.6], [-2.6, -19.4], [-.6, -20.1], [1.6, -19.9], [3.2, -18.8], [3.5, -16.8], [3.3, -15.6], [3.0, -16.9], [2.2, -17.9], [.9, -18.25], [-.4, -18.0], [-1.0, -18.6], [-1.6, -17.9], [-2.6, -17.3], [-3.1, -16.4]]), { wash: C.hair, ink: INK, sw: sw * .85, curv: .45 });
    inkLine(H([[-1.0, -18.55], [-.4, -19.6], [.6, -20.0]]), sw * .5, C.hairLt, 'inkfine', .5);   // the parting
  } else {
    // the mop: a cap over the top, the fringe in uneven spikes over the forehead, a cowlick sticking up
    paint(H([[-3.35, -15.5], [-3.55, -17.5], [-3.05, -19.0], [-1.9, -19.85], [-.4, -20.15], [1.2, -20.0], [2.6, -19.35], [3.45, -18.1], [3.5, -16.3], [3.2, -15.4],
      [2.95, -16.6], [2.55, -17.35], [2.15, -16.95], [1.75, -17.75], [1.2, -17.25], [.6, -17.95], [.05, -17.35], [-.55, -17.95], [-1.15, -17.35], [-1.75, -17.85], [-2.3, -17.2], [-2.85, -17.45], [-3.1, -16.5]]),
      { wash: C.hair, ink: INK, sw: sw * .85, curv: .3 });
    paint(H(ribbon([[.35, -19.95], [.6, -20.75], [1.15, -21.15], [1.65, -20.95]], .62, .1)), { wash: C.hair, ink: INK, sw: sw * .7 });   // the cowlick
    for (const [a, b] of [[[-2.4, -19.2], [-1.6, -18.3]], [[-.6, -19.7], [-.3, -18.5]], [[1.3, -19.6], [1.0, -18.5]], [[2.6, -18.9], [2.3, -18.0]]])
      inkLine(H([a, [(a[0] + b[0]) / 2 + .12, (a[1] + b[1]) / 2], b]), sw * .45, C.hairLt, 'inkfine', .5);
  }

  push(); translate(hx * .8 * u, 0);
  // ---- brows: brows -1 (angry) .. +1 (raised), worry tilts the inner ends up; angry / determined eyes lower them
  rs('brows');
  const ek = Array.isArray(o.eyes) ? o.eyes[0] : o.eyes;
  const bAng = clamp((o.brows ?? 0) - (['angry', 'determined', 'red'].includes(ek) ? .8 : 0), -1, 1), wy = clamp(o.worry || 0) + (ek === 'sad' || ek === 'scared' ? .7 : 0);
  for (const s of [-1, 1]) {
    const b = (s < 0 ? o.browL : o.browR) ?? 0, lift = Math.max(0, bAng) * .35 + b * .3;
    const inY = -17.0 - lift + Math.min(0, bAng) * -.3 - wy * .35, outY = -17.05 - lift - Math.min(0, bAng) * -.1 + wy * .12;
    paint(H(ribbon([[s * .55, inY], [s * 1.2, (inY + outY) / 2 - .12], [s * 1.9, outY]], .32, .18)), { wash: C.hair, ink: null });
  }
  // ---- eyes
  rs('eyes');
  const kinds = Array.isArray(o.eyes) ? o.eyes : o.eyes === 'wink' ? ['normal', 'happy'] : [o.eyes || 'normal', o.eyes || 'normal'];
  const own = k => ['normal', 'look', 'wide', 'happy', 'closed', 'squeeze', 'sad'].includes(k);
  if (kinds.every(own)) {
    const lx = (o.lookX || 0) * .22, ly = (o.lookY || 0) * .18;
    const blink = ((T * .9 + (o.seed || 0) * 1.7 + .4) % 3.6) < .11;
    [-1, 1].forEach((s, i) => {
      const k = (o.squint || 0) > .6 ? 'squeeze' : kinds[i], ex = s * 1.2, ey = -15.75;
      if (k === 'happy') { inkLine(H([[ex - .55, ey + .15], [ex, ey - .4], [ex + .55, ey + .15]]), sw * 1.25, INK, 'ink', .6); return; }
      if (k === 'closed' || blink) { inkLine(H([[ex - .55, ey - .05], [ex, ey + .3], [ex + .55, ey - .05]]), sw * 1.15, INK, 'ink', .6); return; }
      if (k === 'squeeze') { inkLine(H([[ex - s * .55, ey - .4], [ex + s * .35, ey], [ex - s * .55, ey + .35]]), sw * 1.25, INK, 'ink', .2); return; }
      const wide = k === 'wide', rx = wide ? .7 : .6, ry = wide ? .82 : .72;
      paint(H(ellPts(ex, ey, rx, ry, 18)), { wash: C.white, ink: null });
      const pr = wide ? .26 : .42;
      paint(ellPts((ex + lx * (wide ? 1.4 : 1)) * u, (hy + 16 + ey + ly) * u, pr * u, pr * 1.22 * u, 14), { wash: C.eye, ink: null });
      paint(ellPts((ex + lx - .14) * u, (hy + 16 + ey + ly - .2) * u, .14 * u, .16 * u, 8), { wash: C.white, ink: null });
      paint(ellPts((ex + lx + .14) * u, (hy + 16 + ey + ly + .22) * u, .06 * u, .06 * u, 6), { wash: C.white, washOp: 210, ink: null });
      inkLine(H([[ex - rx * 1.05, ey + .05], [ex - rx * .5, ey - ry * .95], [ex + rx * .5, ey - ry * .95], [ex + rx * 1.05, ey + .05]]), sw * 1.2, INK, 'ink', .5);   // the upper lid
      if (k === 'sad') inkLine(H([[ex - .5, ey + ry * .7], [ex + .5, ey + ry * .7]]), sw * .5, dk, 'inkfine', .5);
    });
  } else { push(); translate(0, (hy + .25) * u); scale(.48); translate(0, 6 * u); eyes(u, o, sw / .48 * .85, [-1, 1], 0); pop(); }
  // ---- cheeks, nose, mouth
  rs('cheeks');
  const puff = o.mouth === 'puff';
  if (o.blush || puff) for (const s of [-1, 1]) paint(ellPts(s * (puff ? 1.85 : 2.05) * u, (hy + 1.3) * u, (puff ? .85 : .7) * u, (puff ? .6 : .38) * u, 14), { fill: C.cheek, fillOp: 160 * clamp(Math.max(o.blush || 0, puff ? .7 : 0)), bleed: .2, tex: .4, ink: null });
  rs('nose');
  inkLine(H([[.05, -15.25], [-.12, -14.95], [.12, -14.85]]), sw * .55, dk, 'inkfine', .5);
  rs('mouth');
  const m = o.mouth || 'smile', my = -14.3, mk = clamp(o.mouthK ?? 1, 0, 1.3);
  const dark = C.mouth;
  if (m === 'smile') inkLine(H([[-.75, my - .15], [0, my + .25], [.75, my - .15]]), sw * .85, INK, 'ink', .6);
  else if (m === 'grin') {
    paint(H([[-1.05, my - .3], [1.05, my - .3], [.8, my + .45], [0, my + .75], [-.8, my + .45]]), { wash: dark, ink: INK, sw: sw * .75, curv: .45 });
    paint(H([[-.5, my + .4], [.5, my + .4], [0, my + .7]]), { wash: C.tongue, ink: null, curv: .5 });
    paint(H([[-.92, my - .27], [.92, my - .27], [.75, my], [-.75, my]]), { wash: C.white, ink: null, curv: .3 });
  } else if (m === 'O') paint(H(ellPts(0, my + .15, .42, .52, 12)), { wash: dark, ink: INK, sw: sw * .7 });
  else if (m === 'mew') {   // the tiniest round mouth
    paint(ellPts(0, (hy + 16 + my + .1) * u, .2 * u, .24 * u, 10), { wash: dark, ink: INK, sw: sw * .55 });
  } else if (m === 'roar') {   // wide open: top teeth with two little fangs, a tongue
    const w = .7 + .65 * mk, d = .5 + 1.15 * mk, t0 = my - .55 * mk;
    paint(H([[-w, t0], [w, t0], [w * .85, t0 + d * .55], [w * .45, t0 + d], [-w * .45, t0 + d], [-w * .85, t0 + d * .55]]), { wash: dark, ink: INK, sw: sw * .85, curv: .45 });
    paint(H([[-w * .55, t0 + d * .72], [w * .55, t0 + d * .72], [w * .35, t0 + d * .97], [-w * .35, t0 + d * .97]]), { wash: C.tongue, ink: null, curv: .5 });
    paint(H([[-w * .9, t0 + .05], [w * .9, t0 + .05], [w * .78, t0 + .28], [-w * .78, t0 + .28]]), { wash: C.white, ink: null, curv: .2 });
    for (const s of [-1, 1]) paint(H([[s * w * .62, t0 + .2], [s * w * .42, t0 + .2], [s * w * .52, t0 + .55]]), { wash: C.white, ink: null });   // fangs
  } else if (m === 'wobble') inkLine(H([[-.7, my + .1], [-.35, my - .08], [0, my + .1], [.35, my - .08], [.7, my + .1]]), sw * .8, INK, 'ink', .5);
  else if (m === 'flat') inkLine(H([[-.55, my], [.55, my]]), sw * .8, INK, 'ink', 0);
  else if (m === 'frown') inkLine(H([[-.7, my + .25], [0, my - .12], [.7, my + .25]]), sw * .85, INK, 'ink', .6);
  else if (m === 'smirk') inkLine(H([[-.6, my + .1], [.2, my + .05], [.75, my - .3]]), sw * .85, INK, 'ink', .6);
  else if (m === 'puff') inkLine(H([[-.3, my], [.3, my]]), sw * .9, INK, 'ink', 0);
  else if (m === 'open') {
    paint(H([[-.75, my - .2], [.75, my - .2], [.5, my + .5], [-.5, my + .5]]), { wash: dark, ink: INK, sw: sw * .7, curv: .5 });
    paint(H([[-.35, my + .3], [.35, my + .3], [0, my + .5]]), { wash: C.tongue, ink: null, curv: .5 });
  } else { push(); translate(0, (hy + 16 + my) * u); scale(.4); translate(0, 4.3 * u); mouth(u, m, sw / .4 * .8); pop(); }
  pop();   // face offset
  if (o.hat) { rs('hat'); push(); translate(0, (hy + 16) * u); o.hat(u, sw); pop(); }
  pop();   // head

  if (o.legs !== false && pose === 'sit' && back > .35) sitLegs();

  // ---------------- what he holds, then the hands over it
  if (o.held) { rs('held'); o.held(u, sw); }
  for (const A of arms) {
    rs('hand' + A.s);
    const shape = (A.s < 0 ? o.handShapeL : o.handShapeR) || 'open';
    const a = (A.s < 0 ? o.handAL : o.handAR) ?? Math.atan2(A.ha[1] - A.el[1], A.ha[0] - A.el[0]);
    push(); translate(A.ha[0] * u, by(A.ha[1]) * u); rotate(a);
    translate(-.25 * u, 0);   // the wrist sits a little inside the forearm's end
    scale(1.2); aaravHandShape(u, sw / 1.2, shape, A.s, A.sk, dk, INK);
    pop();
  }
  pop();

  if (o.emote) {
    rs('emote');
    const [ex, ey] = aaravWorld(x, y, u, o, (o.flip ? -1 : 1) * 3.8, by(-19.5));
    const top = EMOTE_TOP.includes(o.emote);
    emote(o.emote, top ? aaravHead(x, y, u, o)[0] : ex, top ? aaravWorld(x, y, u, o, 0, by(-22.2))[1] : ey, u * 1.0, o.emoteK ?? 1, o.emoteAge ?? T);
  }
  rs('after');
}

// Model sheet: studio.html?loop=aarav, or node render.mjs --loop=aarav --sheet=0.5,1.5,2.5,3.5 --cols=4 --w=540
(() => {
  LOOPS.aarav = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: '#EDE3D2', ink: null });
    const u = 24, cyc = t % 4;
    // 1 · standing, waving: an emotion timeline
    const e1 = emotions(t, [[0, 'neutral'], [1, 'happy'], [2.5, 'surprised']]);
    aarav(200, 820, u, { ...e1, handR: [5.2, -16.5 + Math.sin(t * 9) * .6], handShapeR: 'open', boilKey: 'm1', seed: 1 });
    // 2 · the lion: wind-up (inhale, claws up), then mew, then ROAR
    const inh = cyc < 1.2 ? ease(cyc / 1.2) : cyc < 1.5 ? 1 - seg(cyc, 1.2, 1.4) : cyc < 2.6 ? ease(seg(cyc, 1.8, 2.6)) : 1 - seg(cyc, 2.6, 2.9);
    const mewing = cyc >= 1.2 && cyc < 1.8, roaring = cyc >= 2.6 && cyc < 3.6;
    aarav(540, 820, u, { inhale: inh, eyes: roaring ? 'squeeze' : mewing ? 'wide' : 'normal', mouth: roaring ? 'roar' : mewing ? 'mew' : 'puff', mouthK: roaring ? 1.2 : 1,
      blush: mewing ? .8 : 0, brows: roaring ? -.6 : mewing ? .8 : 0, handL: [-4.2, -14 - inh * 1.5], handR: [4.2, -14 - inh * 1.5], handShapeL: 'claw', handShapeR: 'claw', boilKey: 'm2' });
    // 3 · demon kid: another palette and neat hair, smirking, pointing
    aarav(880, 820, u * .92, { eyes: 'narrow', mouth: 'smirk', hair: 'neat', star: false, pal: { tee: '#7A4AA8', teeDk: '#5A3080', cuff: '#2E2436', shorts: '#3A3A3A', shortsDk: '#262626', skin: '#B97A55', skinDk: '#94593A', skinLt: '#D69B72' },
      handR: [5.6, -11.5], handShapeR: 'point', handL: [-2.6, -8.5], handShapeL: 'fist', bendL: 1, boilKey: 'm3',
      hat: (u, sw) => { for (const s of [-1, 1]) paint(U([[s * 2.4, -19.0], [s * 3.6, -20.0], [s * 4.6, -21.6], [s * 4.2, -19.4], [s * 3.0, -18.4]], u), { wash: '#F2E6D0', ink: AAR.ink, sw: sw * .7, curv: .5 }); inkLine(U([[-2.6, -18.8], [0, -19.6], [2.6, -18.8]], u), sw * 1.6, '#6A4A30', 'ink', .5); } });
    // 4 · sitting on a ledge, holding a book up; then the topple
    paint(rectPts(60, 1340, 420, 70), { wash: '#B78860', ink: AAR.ink, sw: 1 });
    const back = cyc > 2.4 ? backOut(seg(cyc, 2.4, 2.75)) * (1 - seg(cyc, 3.5, 3.9)) : 0;
    aarav(270, 1342, u, { pose: 'sit', back, kick: Math.sin(t * 4) * .4, eyes: back > .3 ? 'wide' : 'normal', mouth: back > .3 ? 'O' : 'smile', lookY: .5,
      ...(back > .2 ? { handL: [-3.6, -13.5], handR: [3.6, -13.5], handShapeL: 'open', handShapeR: 'open' } :
        { handL: [-2.7, -5.6], handR: [2.7, -5.6], handShapeL: 'hold', handShapeR: 'hold', handAL: -Math.PI / 2, handAR: -Math.PI / 2,
          held: (u, sw) => paint(rrPts(-3.0 * u, -2.6 * u, 6 * u, 4.2 * u, .3 * u), { wash: '#E8C98A', ink: AAR.ink, sw }) }), boilKey: 'm4' });
    // 5 · asleep, hugging the book, head tilted on a pillow
    paint(ellPts(800, 1170, 230, 120, 24), { wash: '#F3EBDD', ink: AAR.ink, sw: 1 });
    aarav(800, 1440, u, { pose: 'sleep', eyes: 'closed', mouth: 'smile', htilt: -.3, blush: .4, handL: [-1.4, -8.6], handR: [1.6, -8.2], handShapeL: 'hold', handShapeR: 'hold', bendL: 1, bendR: 1, boilKey: 'm5',
      held: (u, sw) => paint(rrPts(-2.2 * u, -4.6 * u, 4.4 * u, 3.4 * u, .3 * u), { wash: '#D9643A', ink: AAR.ink, sw }) });
    paint(rectPts(560, 1450, 480, 300), { wash: '#6A8AC0', ink: AAR.ink, sw: 1 });   // the blanket
    // 6 · the hand shapes, big
    ['open', 'fist', 'claw', 'point', 'hold'].forEach((sh, i) => {
      for (const s of [-1, 1]) { push(); translate(130 + i * 190 + s * 45, 1700); rotate(-Math.PI / 2); aaravHandShape(36, 1.4, sh, s, AAR.skin, AAR.skinDk, AAR.ink); pop(); }
    });
  };
  LOOPS.aarav.len = 4;
})();
