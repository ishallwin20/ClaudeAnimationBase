// kamadeva.js: Kamadeva, the god of love, as a cocky young archer: honey-gold skin, long black curls, a gold mukut with
// a pink lotus, makara earrings, a marigold garland, a rose dhoti, a leaf-green scarf that floats behind him, a quiver of
// five flower arrows on his back, and his sugarcane bow strung with a line of bees. Plus his mount, a big rose-ringed
// parrot (kamaParrot). Built on Kartikeya's proportions, a head taller in the hair. Load after bappa.js (U()) and clawd.js
// (eyes() / mouth() / emote(), so feel() and emotions() drive him too).
// (x, y) is the ground point between his feet (with sit: 1, the point he sits on); u is the size unit (about 18.5u tall
// to the top of the lotus, 7u wide).
//
// Body-local coordinates in u (y up is negative):
//   feet (±1.3, -.5) · legs -2.9..-.7 · dhoti -6.3..-2.3 · chest centre (0, -7.7) · shoulders (±2.6, -8.7)
//   head centre (0, -12.4), 3 × 2.85 · eyes (±1.2, -12.2) · mouth (0, -10.8) · mukut -14.6..-16.8, lotus top -18.4
//   aiming: the bow hand (8.4, -9.4), the string hand at the nock, (lerp(7.8, 1.4, draw), -9.4)
//
// Options (all optional):
//   pose:   walk (phase), dx, dy (in u), sq, take, rot, flip, hx (-1..1 head turn), htilt, sit (1: sitting, legs
//           folded, (x, y) = the seat), scarf (-1..1: + streams the scarf out behind, to screen-left)
//   arms:   handL / handR = [x, y] in u (default hanging relaxed), bendL / bendR, armL(u, sw) / armR(u, sw) (hooks)
//   bow:    bow (default true, in his right hand: screen right), bowA (radians, tilt), aim 0..1 (raises the bow arm
//           level and brings the other hand to the string), draw 0..1 (pulls the string back to the chest),
//           arrow (default true while aiming: a flower arrow on the string), twang (seconds since the release: the
//           string shivers)
//   face:   eyes, mouth, lookX / lookY, squint, blush, seed, tint + tintK. 'normal' / 'look' / 'wide' are his own
//           glossy eyes, 'closed' / 'happy' his own lids, 'wink' = ['normal', 'happy']; every other kind
//           is Clawd's.
//   burn:   0..1 chars every colour toward charcoal (the third eye's fire)
//   extras: emote + emoteK + emoteAge, boilKey, noShadow, swMul
const KMD = {
  skin: '#F2C07C', skinDk: '#D6974E', skinLt: '#FFE0AE', ink: '#4A2530',
  hair: '#2A1E2E', hairLt: '#55405A', dhoti: '#E8698A', dhotiDk: '#B94566', dhotiLt: '#F7A5BA',
  scarf: '#7DBB5E', scarfDk: '#4E8A40', gold: '#EDB43C', goldDk: '#B67D1C', goldLt: '#FFE39A',
  lotus: '#F4A6B8', lotusDk: '#E0708C', lotusLt: '#FFDDE4', marigold: '#F39A2E', marigoldDk: '#D0701E',
  cane: '#B9CC63', caneDk: '#7E9636', caneLt: '#E2EDA0', leaf: '#5E9A6A', bee: '#F2C33C', beeDk: '#3A2A20',
  eye: '#2A1A1E', white: '#FFF8EC', lip: '#C8505E', quiver: '#9A5A3A', quiverDk: '#6E3C24', char: '#3B3035',
  parrot: '#6DBE4E', parrotDk: '#3F8A34', parrotLt: '#B6E08C', beak: '#E2453A', beakDk: '#A82E25', tail: '#3A9C98',
  tailDk: '#26706E', ring: '#E8698A', ringDk: '#2B2233', claw: '#8E9BB0',
};
const KMD_SKIN = { col: KMD.skin, dk: KMD.skinDk, lt: KMD.skinLt };
const KAMA_SEAT = 2.3;   // sitting: local y = -2.3 sits on (x, y)

// Shoulder, elbow and hand of one arm (s = -1 screen left, 1 screen right, before flip), in body-local u.
function kamaArm(o, s) {
  const sh = [s * 2.6, -8.7], aim = clamp(o.aim || 0), dr = clamp(o.draw || 0);
  let ha = (s < 0 ? o.handL : o.handR) || [s * 3.5, -5.9];
  if (aim > 0 && !(s < 0 ? o.handL : o.handR)) {
    const tgt = s > 0 ? [8.4, -9.4] : [lerp(7.8, 1.4, dr), -9.4];
    ha = [lerp(ha[0], tgt[0], aim), lerp(ha[1], tgt[1], aim)];
  }
  const dx = ha[0] - sh[0], dy = ha[1] - sh[1], d = Math.hypot(dx, dy) || 1;
  let nx = -dy / d, ny = dx / d; if (ny > 0) { nx = -nx; ny = -ny; }   // elbows bend up and out
  const b = (s < 0 ? o.bendL : o.bendR) ?? (s < 0 ? .9 * aim + .5 * (1 - aim) : .5);
  return [sh, [(sh[0] + ha[0]) / 2 + nx * b, (sh[1] + ha[1]) / 2 + ny * b], ha];
}
// body-local → screen (ignores rot)
function kamaLocal(x, y, u, o, p) {
  const sq = (o.sq || 0) + (o.take || 0), fx = o.flip ? -1 : 1, sy = o.sit ? KAMA_SEAT : 0;
  return [x + ((o.dx || 0) + fx * p[0] * (1 + sq * .6)) * u, y + (o.dy || 0) * u + (p[1] + sy) * u * (1 - sq)];
}
function kamaHand(x, y, u, o, s) { return kamaLocal(x, y, u, o, kamaArm(o, s)[2]); }
// The flower tip of the arrow on the string (where a flying arrow starts), and the nock.
function kamaArrowTip(x, y, u, o) { const n = kamaArm(o, -1)[2]; return kamaLocal(x, y, u, o, [n[0] + 6.9, n[1]]); }
function kamaArrowNock(x, y, u, o) { return kamaLocal(x, y, u, o, kamaArm(o, -1)[2]); }
function kamaFace(x, y, u, o, part = 'eye') { return kamaLocal(x, y, u, o, { eye: [(o.hx || 0) * 1.3, -12.2], top: [0, -18.4], chest: [0, -7.7], crown: [0, -16] }[part]); }

// A flower arrow along +x from (0, 0) (the nock) to the blossom at 6.9u. Draw it in any frame: rotate first to aim it.
function kamaFlowerArrow(u, sw, C = c => c, INK = KMD.ink) {
  paint(ribbon(U([[0, 0], [6.1, 0]], u), .2 * u, .2 * u), { wash: C(KMD.cane), ink: INK, sw: sw * .4 });
  for (const s of [-1, 1]) paint(U([[.1, 0], [.9, s * .5], [1.3, s * .45], [.7, 0]], u), { wash: C(KMD.lotusDk), ink: INK, sw: sw * .35 });   // fletching
  for (let k = 0; k < 5; k++) {   // five petals round a gold heart
    const a = k / 5 * TAU + .3, px = 6.9 + Math.cos(a) * .55, py = Math.sin(a) * .55;
    paint(ellPts(px * u, py * u, .5 * u, .36 * u, 10, 0, a), { wash: C(KMD.lotus), fill: C(KMD.lotusDk), fillOp: 50, tex: .4, ink: INK, sw: sw * .35 });
  }
  paint(ellPts(6.9 * u, 0, .3 * u, .3 * u, 8), { wash: C(KMD.gold), ink: INK, sw: sw * .3 });
}
// The sugarcane bow, held at (0, 0): the stave bulges to +x, its tips up and down; nockX (u, from the hand) is where
// the string is pulled to (-.6 = slack). The string is a line of little bees.
function kamaBow(u, sw, nockX, shiver, C, INK) {
  const st = [[-.6, -4.6], [.25, -3.4], [.6, -1.6], [.7, 0], [.6, 1.6], [.25, 3.4], [-.6, 4.6]];
  const bees = []; for (const [a, b, n] of [[[-.6, -4.6], [nockX, 0], 5], [[nockX, 0], [-.6, 4.6], 5]]) for (let k = 1; k < n; k++) {
    const q = k / n, wv = Math.sin(q * Math.PI) * shiver; bees.push([lerp(a[0], b[0], q) + wv, lerp(a[1], b[1], q)]);
  }
  inkLine(U([[-.6, -4.6], [nockX + shiver * .3, 0], [-.6, 4.6]], u), sw * .5, INK, 'inkfine', 0);   // the string
  for (const [bx, by] of bees) {
    paint(ellPts(bx * u, by * u, .2 * u, .14 * u, 8), { wash: C(KMD.bee), ink: null });
    inkLine([[bx * u - .05 * u, by * u - .13 * u], [bx * u - .05 * u, by * u + .13 * u]], sw * .4, C(KMD.beeDk), 'inkfine', 0);
    paint(ellPts(bx * u - .02 * u, by * u - .2 * u, .13 * u, .09 * u, 6), { wash: C(KMD.white), washOp: 200, ink: null });   // a wing
  }
  paint(ribbon(U(st, u), .55 * u, .55 * u), { wash: C(KMD.cane), fill: C(KMD.caneDk), fillOp: 60, tex: .5, ink: INK, sw: sw * .7 });
  const S = through(U(st, u));
  for (let k = 3; k < S.length - 2; k += 4) {   // cane joints
    const [ax, ay] = S[k - 1], [bx, by] = S[k + 1], d = Math.hypot(bx - ax, by - ay) || 1, w = .3 * u;
    inkLine([[S[k][0] - (by - ay) / d * w, S[k][1] + (bx - ax) / d * w], [S[k][0] + (by - ay) / d * w, S[k][1] - (bx - ax) / d * w]], sw * .5, C(KMD.caneDk), 'inkfine', 0);
  }
  for (const s of [-1, 1]) paint(ribbon(U([[-.6, s * 4.6], [-.2, s * 5.4], [.6, s * 5.9]], u), .35 * u, .05 * u), { wash: C(KMD.leaf), ink: INK, sw: sw * .4 });   // leaf tips
  paint(rrPts(-.45 * u, -.55 * u, 1.3 * u, 1.1 * u, .3 * u), { wash: C(KMD.gold), ink: INK, sw: sw * .45 });   // the grip
}

function kamadeva(x, y, u, o = {}) {
  const id = o.boilKey ?? 'km' + (++CLAWD_N), rs = p => boilSeed(`kama ${id} ${p}`);
  x += (o.dx || 0) * u;
  const dy = (o.dy || 0) * u, sq = (o.sq || 0) + (o.take || 0), sw = clamp(u / 20, .4, 2) * (o.swMul || 1), J = u * .045;
  const bn = clamp(o.burn || 0), C = c => bn > 0 ? mixCol(c, KMD.char, bn * .92) : c;
  const tc = tintCols({ ...o, col: o.col || KMD.skin, dk: o.dk || KMD.skinDk, lt: o.lt || KMD.skinLt }), col = C(tc.col), dk = C(tc.dk), lt = C(tc.lt);
  const P = pts => U(pts, u), INK = KMD.ink, wk = o.walk, hx = clamp(o.hx || 0, -1, 1), aim = clamp(o.aim || 0), sit = !!o.sit;
  const sc = (o.scarf ?? .3) + Math.sin(T * 2.4) * .12;

  if (!o.noShadow && !sit) { rs('shadow'); const f = 1 - Math.min(.5, Math.abs(o.dy || 0) * .05); paint(ellPts(x, y + u * .1, u * 4 * f, u * .85 * f, 22), { fill: PAL.ink, fillOp: 80, bleed: .25, tex: .3, border: .1, ink: null }); }
  push();
  translate(x, y + dy);
  if (o.rot) rotate(o.rot);
  scale((o.flip ? -1 : 1) * (1 + sq * .6), 1 - sq);
  if (sit) translate(0, KAMA_SEAT * u);

  // ---- behind: the quiver with five flower arrows, the scarf's ends, the back curls
  rs('quiver');
  push(); translate(-1.6 * u, -9.2 * u); rotate(-.45);
  for (let k = 0; k < 5; k++) {
    const ax = (k - 2) * .38, ay = -3.6 - .25 * Math.abs(k - 2);
    inkLine(P([[ax, -1], [ax, ay + .4]]), sw * .6, C(KMD.caneDk), 'inkfine', 0);
    paint(ellPts(ax * u, ay * u, .42 * u, .38 * u, 10, J), { wash: C([KMD.lotus, KMD.marigold, KMD.white, KMD.lotusDk, KMD.goldLt][k]), ink: INK, sw: sw * .4 });
  }
  paint(rrPts(-.85 * u, -1.6 * u, 1.7 * u, 4.6 * u, .5 * u, J), { wash: C(KMD.quiver), fill: C(KMD.quiverDk), fillOp: 60, tex: .5, ink: INK, sw: sw * .7 });
  inkLine(P([[-.85, -.9], [.85, -.9]]), sw * 1.1, C(KMD.gold), 'ink', 0);
  pop();
  rs('scarfback');
  for (const s of [-1, 1]) {
    const tip = [s * 3.4 - sc * 3.2, -5.4 + s * .4 - Math.abs(sc) * 1.2];
    paint(ribbon(P([[s * 2.4, -8.9], [s * 3.2 - sc * 1.2, -7.6], [tip[0], tip[1]]]), .9 * u, .55 * u), { wash: C(KMD.scarf), fill: C(KMD.scarfDk), fillOp: 70, tex: .5, ink: INK, sw: sw * .6 });
  }
  rs('backhair');
  push(); translate(hx * .4 * u, 0);
  paint(P([[-3.2, -13.4], [-3.6, -11.6], [-3.55, -10.3], [-3, -9.75], [-2.55, -10.4], [-2.2, -11], [2.2, -11], [2.55, -10.4], [3, -9.75], [3.55, -10.3], [3.6, -11.6], [3.2, -13.4], [0, -15.4]]),
    { wash: C(KMD.hair), ink: INK, sw: sw * .8, curv: .5 });
  for (const s of [-1, 1]) inkLine(P([[s * 3.25, -12.2], [s * 3.45, -11], [s * 3.05, -10.2]]), sw * .45, C(KMD.hairLt), 'inkfine', .6);
  pop();

  // ---- legs (or folded, sitting), the dhoti, the chest with the garland and the scarf across it
  rs('legs');
  if (sit) {
    for (const s of [-1, 1]) {
      paint(ellPts(s * 2.1 * u, -2.6 * u, 1.9 * u, .85 * u, 16, J, s * .1), { wash: C(KMD.dhoti), fill: C(KMD.dhotiDk), fillOp: 60, tex: .6, ink: INK, sw: sw * .8 });
      paint(ellPts(s * 3.9 * u, -2.2 * u, .95 * u, .5 * u, 12, J), { wash: col, fill: dk, fillOp: 40, tex: .5, ink: INK, sw: sw * .7 });
      inkLine(P([[s * 3.3, -2.6], [s * 3.3, -1.8]]), sw * 1, C(KMD.gold), 'ink', 0);   // anklet
    }
  } else {
    for (const s of [-1, 1]) {
      const l = wk == null ? 0 : Math.max(0, Math.sin((wk + (s < 0 ? 0 : .5)) * TAU)) * .7, cx = s * 1.3;
      paint(P([[cx - .85, -2.9], [cx + .85, -2.9], [cx + .8, -.75 - l], [cx - .8, -.75 - l]]), { wash: col, fill: dk, fillOp: 50, tex: .5, ink: INK, sw: sw * .85 });
      inkLine(P([[cx - .8, -1.55 - l], [cx + .8, -1.55 - l]]), sw * 1.1, C(KMD.gold), 'ink', 0);
      paint(ellPts((cx + s * .1) * u, (-.5 - l) * u, 1.1 * u, .55 * u, 16, J), { wash: col, fill: dk, fillOp: 40, tex: .5, ink: INK, sw: sw * .8 });
    }
  }
  rs('dhoti');
  const dh = sit ? -3.1 : -2.3;
  paint(P([[-2.4, -6.3], [2.4, -6.3], [2.8, -4.3], [3.1, dh - .2], [.4, dh], [0, dh - 1], [-.4, dh], [-3.1, dh - .2], [-2.8, -4.3]]),
    { wash: C(KMD.dhoti), fill: C(KMD.dhotiDk), fillOp: 80, bleed: .06, tex: .7, border: .5, ink: INK, sw: sw * .9, curv: .25 });
  for (const s of [-1, 1]) inkLine(P([[s * .45, dh - .25], [s * 1.7, dh - .3], [s * 2.95, dh - .45]]), sw * 1.3, C(KMD.gold), 'ink', .4);
  inkLine(P([[.1, -5.8], [-.15, -4.4], [.05, -3.4]]), sw * .5, C(KMD.dhotiDk), 'inkfine', .5);
  for (const [bx, by] of [[-1.6, -4.4], [1.5, -3.6], [-.9, -3.1], [1.9, -5.3]]) paint(ellPts(bx * u, by * u, .16 * u, .16 * u, 8), { wash: C(KMD.goldLt), ink: null });   // butis
  rs('chest');
  const chest = ellPts(0, -7.7 * u, 2.55 * u, 2.1 * u, 26, J);
  paint(chest, { wash: col, ink: null });
  paint(ellPts(-.8 * u, -8.3 * u, 1.3 * u, .8 * u, 14, J * 2, -.3), { fill: lt, fillOp: 130, bleed: .2, tex: .8, border: .8, ink: null });
  paint(chest, { ink: INK, sw });
  paint(rrPts(-2.5 * u, -6.65 * u, 5 * u, .75 * u, .3 * u, J), { wash: C(KMD.gold), fill: C(KMD.goldDk), fillOp: 60, tex: .5, ink: INK, sw: sw * .7 });
  rs('scarf');
  paint(ribbon(P([[-2.6, -9.3], [-1, -9.55], [1, -9.55], [2.6, -9.3]]), .8 * u, .8 * u), { wash: C(KMD.scarf), fill: C(KMD.scarfDk), fillOp: 60, tex: .5, ink: INK, sw: sw * .6 });
  rs('garland');
  for (let k = 0; k <= 10; k++) {
    const gx = lerp(-1.9, 1.9, k / 10), gy = -9.1 + 2.3 * (1 - (gx / 1.9) ** 2);
    paint(ellPts(gx * u, gy * u, .34 * u, .32 * u, 9, J), { wash: C(k % 2 ? KMD.marigold : KMD.lotus), fill: C(k % 2 ? KMD.marigoldDk : KMD.lotusDk), fillOp: 50, tex: .4, ink: INK, sw: sw * .35 });
  }

  // ---- arms: the string arm first (it crosses the chest when he aims), the bow arm last
  const drawArm = s => {
    rs('arm' + s);
    const [sh, el, ha] = kamaArm(o, s), hook = s < 0 ? o.armL : o.armR;
    paint(ribbon(P([sh, el, ha]), 1.15 * u, .85 * u), { wash: col, fill: dk, fillOp: 40, tex: .5, ink: INK, sw: sw * .85 });
    const at = k => [lerp(el[0], ha[0], k), lerp(el[1], ha[1], k)], d = Math.hypot(ha[0] - el[0], ha[1] - el[1]) || 1, nx = -(ha[1] - el[1]) / d * .42, ny = (ha[0] - el[0]) / d * .42;
    for (const k of [.68, .8]) { const b = at(k); inkLine(P([[b[0] - nx, b[1] - ny], [b[0] + nx, b[1] + ny]]), sw * 1.1, C(KMD.gold), 'ink', 0); }   // bangles
    const m = [lerp(sh[0], el[0], .55), lerp(sh[1], el[1], .55)], d2 = Math.hypot(el[0] - sh[0], el[1] - sh[1]) || 1;
    inkLine(P([[m[0] + (el[1] - sh[1]) / d2 * .5, m[1] - (el[0] - sh[0]) / d2 * .5], [m[0] - (el[1] - sh[1]) / d2 * .5, m[1] + (el[0] - sh[0]) / d2 * .5]]), sw * 1.3, C(KMD.gold), 'ink', 0);   // armlet
    push(); translate(ha[0] * u, ha[1] * u);
    if (s > 0 && o.bow !== false) {
      rs('bow');
      const nock = kamaArm(o, -1)[2], nx_ = aim > .5 ? Math.min(-.6, nock[0] - ha[0]) : -.6, tw = o.twang != null && o.twang >= 0 ? Math.sin(o.twang * 70) * Math.exp(-o.twang * 9) * .7 : 0;
      push(); rotate(o.bowA ?? lerp(.12, 0, aim)); kamaBow(u, sw, nx_, tw, C, INK);
      if (aim > .5 && o.arrow !== false) { rs('arrow'); push(); translate(nx_ * u, 0); kamaFlowerArrow(u, sw, C, INK); pop(); }
      pop();
    }
    paint(ellPts(0, 0, .7 * u, .62 * u, 14, J), { wash: col, ink: INK, sw: sw * .8 });
    if (hook) hook(u, sw);
    pop();
  };
  drawArm(-1);

  // ---- head
  push(); translate(hx * .5 * u, 0);
  if (o.htilt) { translate(0, -10 * u); rotate(o.htilt); translate(0, 10 * u); }
  rs('ears');
  for (const s of [-1, 1]) {
    paint(ellPts(s * 2.95 * u, -12.2 * u, .6 * u, .85 * u, 12, J), { wash: col, fill: dk, fillOp: 60, tex: .5, ink: INK, sw: sw * .7 });
    push(); translate(s * 3 * u, -11.2 * u); rotate(Math.sin(T * 2.3 + s) * .15);   // makara kundal
    paint(ellPts(0, .55 * u, .42 * u, .5 * u, 10), { wash: C(KMD.gold), fill: C(KMD.goldDk), fillOp: 50, tex: .4, ink: INK, sw: sw * .45 });
    paint(ellPts(0, .55 * u, .16 * u, .16 * u, 8), { wash: C(KMD.lotusDk), ink: null });
    pop();
  }
  rs('head');
  const head = ellPts(0, -12.4 * u, 3 * u, 2.85 * u, 30, J);
  paint(head, { wash: col, ink: null });
  paint(ellPts((-1.1 + hx) * u, -13.5 * u, 1.6 * u, .9 * u, 16, J * 2, -.2), { fill: lt, fillOp: 130, bleed: .2, tex: .85, border: .8, ink: null });
  paint(ellPts(0, -10.2 * u, 2.3 * u, .8 * u, 16, J), { fill: dk, fillOp: 60, bleed: .1, tex: .6, border: .5, ink: null });
  paint(head, { ink: INK, sw });
  rs('hair');   // a fringe of curls swept to one side
  paint(P([[-3.05, -11.6], [-3.3, -13.6], [-2.5, -15], [-1, -15.6], [.8, -15.5], [2.5, -15], [3.3, -13.6], [3.05, -11.6], [2.6, -12.8], [2.1, -13.5], [1.3, -13.4], [.6, -14], [-.3, -13.5], [-1.1, -14.1], [-1.9, -13.6], [-2.6, -12.8]]),
    { wash: C(KMD.hair), ink: INK, sw: sw * .85, curv: .45 });
  for (const [a, b] of [[[-2.4, -14.4], [-1.4, -14.9]], [[.2, -14.9], [1.4, -14.8]]]) inkLine(P([a, b]), sw * .45, C(KMD.hairLt), 'inkfine', .5);
  rs('mukut');
  paint(P([[-2.3, -14.6], [2.3, -14.6], [2.1, -15.6], [1.4, -15.4], [.9, -16.3], [0, -16.8], [-.9, -16.3], [-1.4, -15.4], [-2.1, -15.6]]), { wash: C(KMD.gold), fill: C(KMD.goldDk), fillOp: 60, tex: .5, ink: INK, sw: sw * .6, curv: .15 });
  for (const s of [-1, 0, 1]) paint(ellPts(s * 1.3 * u, (-15 - (s ? 0 : .5)) * u, .2 * u, .22 * u, 8), { wash: C(KMD.lotusDk), ink: null });
  for (const k of [0, 4, 1, 3, 2]) {   // the lotus on top: pointed petals fanning out of the crown
    const a = lerp(-1.1, 1.1, k / 4), L = 1.7 - .2 * Math.abs(k - 2), pts = [];
    for (let i = 0; i <= 8; i++) { const q = i / 8; pts.push([Math.sin(Math.PI * q) * .42, -q * L]); }
    for (let i = 7; i > 0; i--) { const q = i / 8; pts.push([-Math.sin(Math.PI * q) * .42, -q * L]); }
    push(); translate(0, -16.3 * u); rotate(a * .8);
    paint(U(pts, u), { wash: C(k % 2 ? KMD.lotusLt : KMD.lotus), fill: C(KMD.lotusDk), fillOp: 40, tex: .4, ink: INK, sw: sw * .4 });
    pop();
  }

  push(); translate(hx * .9 * u, 0);
  rs('tilak');
  paint(ellPts(0, -13.55 * u, .17 * u, .2 * u, 8), { wash: C(KMD.lotusDk), ink: null });
  if (o.blush) for (const s of [-1, 1]) paint(ellPts(s * 1.9 * u, -11.2 * u, .7 * u, .38 * u, 14), { fill: PAL.rose, fillOp: 150 * clamp(o.blush), bleed: .2, tex: .4, ink: null });
  rs('eyes');
  const kinds = Array.isArray(o.eyes) ? o.eyes : o.eyes === 'wink' ? ['normal', 'happy'] : [o.eyes || 'normal', o.eyes || 'normal'];
  if (kinds.every(k => ['normal', 'look', 'wide', 'closed', 'happy'].includes(k))) {
    const lx = (o.lookX || 0) * u * .22, ly = (o.lookY || 0) * u * .18, blink = ((T * .9 + (o.seed || 0) * 1.7 + 2.1) % 3.3) < .12;
    [-1, 1].forEach((s, i) => {
      const k = (o.squint || 0) > .5 ? 'closed' : kinds[i], wide = k === 'wide', ex = s * 1.2 * u, ey = -12.2 * u;
      inkLine(P([[s * .65, -13.05 - (wide ? .35 : 0)], [s * 1.2, -13.3 - (wide ? .35 : 0)], [s * 1.8, -13.1 - (wide ? .3 : 0)]]), sw * 1.15, C(KMD.hair), 'ink', .5);   // brow
      if (k === 'closed' || k === 'happy' || (blink && !wide)) {
        const c = k === 'happy' ? -.28 : .2;
        inkLine([[ex - .45 * u, ey], [ex, ey + c * u], [ex + .45 * u, ey]], sw * 1.1, INK, 'ink', .5);
        return;
      }
      if (wide) paint(ellPts(ex, ey, .6 * u, .72 * u, 16), { wash: PAL.cream, ink: INK, sw: sw * .5 });
      paint(ellPts(ex + lx, ey + ly, (wide ? .32 : .38) * u, (wide ? .4 : .5) * u, 16), { wash: KMD.eye, ink: null });
      paint(ellPts(ex + lx - .12 * u, ey + ly - .18 * u, .14 * u, .16 * u, 10), { wash: PAL.cream, washOp: 240, ink: null });
      paint(ellPts(ex + lx + .12 * u, ey + ly + .2 * u, .06 * u, .06 * u, 8), { wash: PAL.cream, washOp: 200, ink: null });
    });
  } else { push(); translate(0, -12.2 * u); scale(.52); translate(0, 6 * u); eyes(u, o, sw / .52 * .85, [-1, 1], 0); pop(); }
  rs('nose');
  inkLine(P([[-.05, -11.55], [.12, -11.3], [-.05, -11.2]]), sw * .5, dk, 'inkfine', .5);
  rs('mouth');
  if (!o.mouth || o.mouth === 'smirk0') {   // his own lopsided smirk
    inkLine(P([[-.55, -10.75], [.05, -10.6], [.6, -10.95]]), sw * .7, INK, 'inkfine', .6);
    inkLine(P([[.5, -10.85], [.68, -11.05]]), sw * .5, INK, 'inkfine', 0);
  } else { push(); translate(0, -10.75 * u); scale(.42); translate(0, 4.3 * u); mouth(u, o.mouth, sw / .42 * .8); pop(); }
  pop();
  pop();

  drawArm(1);
  pop();

  if (o.emote) {
    rs('emote');
    const top = EMOTE_TOP.includes(o.emote), dir = o.flip ? -1 : 1, sy = sit ? KAMA_SEAT * u : 0;
    emote(o.emote, top ? x : x + dir * 5 * u, y + dy + sy + (top ? -20 : -16) * u * (1 - sq), u * 1.05, o.emoteK ?? 1, o.emoteAge ?? T);
  }
  rs('after');
}

// ---------------- the parrot ----------------
// kamaParrot(x, y, s, o): Kama's mount, a big rose-ringed parakeet in side view facing screen right (flip: left).
// (x, y) is the middle of its body; s is its size unit (the body is 8.4s long; with s ≈ 1.6u it carries Kama).
// o: flip, flap (-1..1: the wings, + up), squawk 0..1 (the beak opens), eyes 'normal' | 'wide' | 'closed',
//    look (-1..1), fly (true: feet tucked), tail (-1..1: the tail swishes), rot, only ('body' | 'wing': draw the
//    near wing separately, over a rider), boilKey
function parrotSeat(x, y, s, o = {}) { return [x + (o.flip ? 1 : -1) * .5 * s, y - 2.25 * s]; }
function kamaParrot(x, y, s, o = {}) {
  const id = o.boilKey ?? 'pt' + (++CLAWD_N), rs = p => boilSeed(`parrot ${id} ${p}`), P = pts => U(pts, s), sw = clamp(s / 20, .4, 2), INK = KMD.ink;
  const fl = clamp(o.flap ?? 0, -1.2, 1.2), only = o.only, tl = (o.tail || 0) + Math.sin(T * 2.2) * .08;
  push(); translate(x, y); if (o.rot) rotate(o.rot); scale(o.flip ? -1 : 1, 1);
  const wing = (dark, key) => {
    rs(key);
    push(); translate(.4 * s, -1.1 * s); rotate(-.35 - fl * .9);
    const c = dark ? KMD.parrotDk : KMD.parrot;
    paint(P([[.6, -.2], [-1.6, -1.1], [-4.2, -1.2], [-6.4, -.6], [-5.4, 0], [-6.1, .5], [-4.6, .7], [-5.1, 1.2], [-3.2, 1.1], [-1.2, .9], [.5, .6]]), { wash: c, fill: KMD.parrotDk, fillOp: 70, tex: .5, ink: INK, sw: sw * .7, curv: .3 });
    for (const k of [-3.6, -4.8]) inkLine(P([[k + 1.2, -.6], [k, .5]]), sw * .45, KMD.tailDk, 'inkfine', .4);
    paint(ribbon(P([[-3.8, .55], [-5.4, .55]]), .5 * s, .2 * s), { wash: dark ? KMD.tailDk : KMD.tail, ink: null });   // blue flight feathers
    pop();
  };
  if (only !== 'wing') {
    rs('tail');
    for (const [k, c] of [[0, KMD.tailDk], [1, KMD.tail]]) paint(ribbon(P([[-3.4, .4 + k * .3], [-6.5, 1.2 + tl + k * .5], [-10.2, 1.8 + tl * 2 + k * .9]]), 1.2 * s, .2 * s), { wash: c, fill: KMD.tailDk, fillOp: 50, tex: .4, ink: INK, sw: sw * .6 });
    if (fl > -.2) wing(true, 'farwing');
    if (!o.fly) {
      rs('feet');
      for (const k of [-.5, .5]) { inkLine(P([[k, 2.2], [k + .1, 3.1]]), sw * 1.4, KMD.claw, 'ink', 0); inkLine(P([[k - .5, 3.2], [k + .7, 3.2]]), sw * 1.4, KMD.claw, 'ink', 0); }
    }
    rs('body');
    const body = P([[-3.8, .6], [-3, -1.6], [-.8, -2.6], [1.8, -2.5], [3.4, -1.5], [4, .2], [3.2, 1.8], [.8, 2.5], [-1.8, 2]]);
    paint(body, { wash: KMD.parrot, fill: KMD.parrotDk, fillOp: 60, bleed: .06, tex: .6, border: .5, ink: INK, sw: sw * .9, curv: .5 });
    paint(ellPts(1.6 * s, .9 * s, 2 * s, 1.3 * s, 16, 0, -.3), { fill: KMD.parrotLt, fillOp: 140, bleed: .2, tex: .6, border: .6, ink: null });   // belly
    rs('head');
    const hy = -2.2, hx = 3.5;
    paint(ellPts(hx * s, hy * s, 1.95 * s, 1.85 * s, 22), { wash: KMD.parrot, fill: KMD.parrotDk, fillOp: 40, tex: .5, ink: INK, sw: sw * .85 });
    inkLine(P([[hx - 1.7, hy + 1], [hx - .4, hy + 1.85], [hx + 1.1, hy + 1.6]]), sw * 1.8, KMD.ringDk, 'ink', .5);   // the neck ring
    inkLine(P([[hx - 1.8, hy + .7], [hx - .6, hy + 1.5], [hx + .9, hy + 1.3]]), sw * 1.5, KMD.ring, 'ink', .5);
    const sqk = clamp(o.squawk || 0), bx = hx + 1.6, by = hy + .1;
    paint(P([[bx - .3, by + .5], [bx + .6, by + .9 + sqk * .7], [bx + 1.2, by + 1.1 + sqk * .9], [bx + .4, by + 1.3 + sqk * .5]]), { wash: KMD.beakDk, ink: INK, sw: sw * .6, curv: .4 });   // lower
    paint(P([[bx - .4, by - .9], [bx + .7, by - .9], [bx + 1.6, by], [bx + 1.5, by + 1.3], [bx + .9, by + .5], [bx - .3, by + .55]]), { wash: KMD.beak, fill: KMD.beakDk, fillOp: 50, tex: .4, ink: INK, sw: sw * .7, curv: .5 });
    rs('eye');
    const ek = o.eyes || 'normal', ex = hx + .3, ey = hy - .45, lk = (o.look || 0) * .15;
    if (ek === 'closed') inkLine(P([[ex - .45, ey], [ex, ey + .25], [ex + .45, ey]]), sw * .9, INK, 'ink', .5);
    else {
      const r = ek === 'wide' ? .62 : .48;
      paint(ellPts(ex * s, ey * s, r * s, r * s, 12), { wash: KMD.white, ink: INK, sw: sw * .6 });
      paint(ellPts((ex + lk + .08) * s, ey * s, r * .5 * s, r * .55 * s, 10), { wash: PAL.ink, ink: null });
      paint(ellPts((ex + lk) * s, (ey - .12) * s, .1 * s, .1 * s, 6), { wash: KMD.white, ink: null });
    }
  }
  if (only !== 'body') wing(false, 'nearwing');
  pop();
  boilSeed(`parrot ${id} after`);
}

// Model sheet: studio.html?loop=kamadeva, or node render.mjs --loop=kamadeva --sheet=0.5 --cols=1 --w=1080
(() => {
  LOOPS.kamadeva = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: PAL.paper, ink: null });
    const S = KMD_SKIN, dr = .5 + .5 * Math.sin(t * 3);
    kamadeva(220, 640, 22, { ...feel('smug', t), ...S });
    kamadeva(560, 640, 22, { ...feel('mischief', t + .5), ...S, eyes: 'wink', mouth: null, scarf: .8 });
    kamadeva(820, 640, 22, { ...S, eyes: 'normal', mouth: null, aim: 1, draw: dr, lookX: 1, hx: .4 });
    kamadeva(200, 1240, 20, { ...feel('surprised', t), ...S, burn: .5 + .5 * Math.sin(t * 2), aim: .4 });
    const fly = { flap: Math.sin(t * 9), fly: true }, seat = parrotSeat(640, 1150, 30, fly);
    kamaParrot(640, 1150, 30, { ...fly, only: 'body' });
    kamadeva(seat[0], seat[1], 18, { ...feel('cool', t), ...S, sit: 1, scarf: 1, mouth: null });
    kamaParrot(640, 1150, 30, { ...fly, only: 'wing' });
    kamaParrot(500, 1660, 16, { squawk: .5 + .5 * Math.sin(t * 8), eyes: 'wide', flap: .3 + .3 * Math.sin(t * 12) });
    kamaParrot(860, 1660, 14, { flip: true, eyes: 'closed' });
  };
  LOOPS.kamadeva.len = 4;
})();
