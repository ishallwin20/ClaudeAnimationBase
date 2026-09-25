// bappa.js: Bappa (a chibi Ganesha) and Mooshak (his mouse), painted with the same tools and rules as Clawd.
// (x, y) is the ground point between the feet; u is the size unit.
//
// Bappa, front view, body-local coordinates in u (y up is negative):
//   feet 0 · dhoti -4.3..-.6 · belly centre (0, -5.6) · shoulders (±3.2, -7.6) · head centre (0, -11.6), 4.1 × 3.8
//   eyes (±1.75, -12) · trunk root (0, -11.2) · crown -14.6..-19 · ears pivot (±3.2, -12.2)
// Faces reuse Clawd's eyes() / mouth() / emote() and the EMO table, so feel() and emotions() drive Bappa too.
//
// Options (all optional):
//   pose:   dx, dy (in u), sq (squash; negative stretches), rot (pivots at the feet), flip, aL, aR (arm angle:
//           0 = straight out, + = up, - = down), cross 0..1 (arms folded over the belly), hx (-1..1: head turn)
//   trunk:  trunk = 'curl' | 'up' | 'palm' | 'down' | 'hold' or a point list in u; trunkSway (u), trunkTap 0..1
//   ears:   ear (0..1 flared out), earL / earR (per ear, added)
//   face:   eyes, mouth, lookX / lookY, squint, blush, seed, tint + tintK (from feel / emotions)
//   extras: emote + emoteK + emoteAge, armL(u, sw) / armR(u, sw) (hooks at the hand, like Clawd), crownTilt
//   boil:   boilKey
const BAP = {
  skin: '#F2A68C', skinDk: '#CF7760', skinLt: '#FFD6C2', earIn: '#E9868A',
  gold: '#EDB43C', goldDk: '#B67D1C', dhoti: '#F4C53F', dhotiDk: '#D6932A', sash: '#D2452F', sashDk: '#9E2E22',
  tusk: '#FFF3DC', tilak: '#D2452F', gem: '#2FA39B',
  mouse: '#A79FB0', mouseDk: '#7B7288', mouseLt: '#D9D3DE', pink: '#EE9AA8',
};
const U = (pts, u) => pts.map(([a, b]) => [a * u, b * u]);

const TRUNKS = {
  curl: [[0, -11.2], [.1, -10.1], [-.1, -9.1], [.15, -8.2], [.8, -7.7], [1.45, -8.1], [1.5, -8.7]],
  down: [[0, -11.2], [.05, -10], [0, -8.8], [-.05, -7.7], [.3, -7], [.8, -7.1]],
  up:   [[0, -11.2], [.5, -10.1], [1.7, -9.6], [3.1, -10], [4.3, -11.1], [4.9, -12.7]],   // raised and trumpeting
  palm: [[0, -11.2], [.3, -10.3], [.3, -9.5], [-.6, -9.6], [-1.5, -10.6], [-1.6, -11.8], [-.7, -12.5]],   // curled over the eyes
  hold: [[0, -11.2], [.4, -10.2], [1.2, -9.6], [2.3, -9.6], [3.3, -10.2], [4, -11]],                   // reaching out to the right
};

// n evenly spaced points along a polyline, so two trunk poses with different point counts can blend
function resample(P, n) {
  const d = [0]; for (let i = 1; i < P.length; i++) d.push(d[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
  const out = []; let j = 0;
  for (let k = 0; k < n; k++) {
    const s = d[d.length - 1] * k / (n - 1); while (j < P.length - 2 && d[j + 1] < s) j++;
    const f = (s - d[j]) / ((d[j + 1] - d[j]) || 1); out.push([lerp(P[j][0], P[j + 1][0], f), lerp(P[j][1], P[j + 1][1], f)]);
  }
  return out;
}
function bappa(x, y, u, o = {}) {
  const id = o.boilKey ?? 'b' + (++CLAWD_N), rs = p => boilSeed(`bappa ${id} ${p}`);
  x += (o.dx || 0) * u;
  const dy = (o.dy || 0) * u, sq = (o.sq || 0) + (o.take || 0), sw = clamp(u / 20, .4, 2) * (o.swMul || 1), J = u * .05;
  const { col, dk, lt } = tintCols({ ...o, col: o.col || BAP.skin, dk: o.dk || BAP.skinDk, lt: o.lt || BAP.skinLt });
  const P = pts => U(pts, u);

  rs('shadow');
  if (!o.noShadow) { const f = 1 - Math.min(.5, Math.abs(o.dy || 0) * .05); paint(ellPts(x, y + u * .15, u * 4.6 * f, u * .85 * f, 22), { fill: PAL.ink, fillOp: 80, bleed: .25, tex: .3, border: .1, ink: null }); }

  push();
  translate(x, y + dy);
  if (o.rot) rotate(o.rot);
  scale((o.flip ? -1 : 1) * (1 + sq * .6), 1 - sq);
  const hx = clamp(o.hx || 0, -1, 1);

  // ---- ears (behind the head): big fans hinged at the temples; flare swings them out and up
  for (const s of [-1, 1]) {
    rs('ear' + s);
    const fl = clamp((o.ear || 0) + (s < 0 ? o.earL || 0 : o.earR || 0), -.3, 1.4);
    push(); translate((s * 3.2 + hx * .6) * u, -12.2 * u); rotate(s * (-.08 - fl * 1.1));
    const ear = ellPts(s * 2.1 * u, .4 * u, 2.5 * u * (1 - .15 * fl), 3.3 * u, 26, J, s * .12);
    paint(ear, { wash: col, fill: dk, fillOp: 70, bleed: .05, tex: .5, border: .5, ink: PAL.ink, sw });
    paint(ellPts(s * 2 * u, .5 * u, 1.55 * u, 2.3 * u, 20, J * .6, s * .12), { wash: mixCol(BAP.earIn, col, .35), fill: BAP.earIn, fillOp: 70, bleed: .1, tex: .6, ink: null });
    pop();
  }

  // ---- feet, dhoti, belly, sash
  rs('legs');
  for (const s of [-1, 1]) paint(ellPts(s * 1.75 * u, -.5 * u, 1.35 * u, .6 * u, 16, J), { wash: col, ink: PAL.ink, sw: sw * .8 });
  rs('dhoti');
  paint(P([[-3.6, -4.6], [3.6, -4.6], [3.4, -2.2], [2.9, -.9], [.6, -1.1], [0, -2.1], [-.6, -1.1], [-2.9, -.9], [-3.4, -2.2]]),
    { wash: BAP.dhoti, fill: BAP.dhotiDk, fillOp: 90, bleed: .06, tex: .7, border: .5, ink: PAL.ink, sw: sw * .9, curv: .25 });
  inkLine(P([[-.3, -2.4], [-.9, -3.6], [-1.2, -4.3]]), sw * .5, BAP.dhotiDk, 'inkfine', .5);   // a fold
  inkLine(P([[.4, -2.4], [1.1, -3.4]]), sw * .5, BAP.dhotiDk, 'inkfine', .5);
  rs('belly');
  const belly = ellPts(0, -5.9 * u, 3.55 * u, 3.1 * u, 30, J);
  paint(belly, { wash: col, ink: null });
  paint(ellPts(-1 * u, -6.9 * u, 1.9 * u, 1.3 * u, 16, J * 2, -.3), { fill: lt, fillOp: 130, bleed: .2, tex: .8, border: .8, ink: null });
  paint(ellPts(.4 * u, -3.8 * u, 3 * u, .9 * u, 16, J), { fill: dk, fillOp: 90, bleed: .08, tex: .6, border: .5, ink: null });
  paint(belly, { ink: PAL.ink, sw });
  inkLine(P([[-.25, -4.9], [0, -4.6], [.25, -4.9]]), sw * .6, PAL.ink, 'inkfine', .6);   // navel
  inkLine(P([[-3.3, -3.3], [-1.5, -2.85], [0, -2.75], [1.5, -2.85], [3.3, -3.3]]), sw * 1.6, BAP.gold, 'ink', .5);   // waist cord
  rs('sash');
  paint(ribbon(P([[-2.9, -8.4], [-1.2, -7], [.6, -5.2], [2.2, -3.8], [3.2, -3.1]]), 1.1 * u, .8 * u), { wash: BAP.sash, fill: BAP.sashDk, fillOp: 60, tex: .5, ink: PAL.ink, sw: sw * .7 });
  inkLine(P([[-2.2, -8.35], [0, -7.55], [2.2, -8.35]]), sw * 1.8, BAP.gold, 'ink', .6);   // necklace
  paint(ellPts(0, -7.35 * u, .38 * u, .38 * u, 10), { wash: BAP.gem, ink: PAL.ink, sw: sw * .5 });

  // ---- arms: behind-the-head order doesn't matter; they're drawn after the head so held things sit in front
  const drawArm = s => {
    rs('arm' + s);
    const a = s < 0 ? (o.aL ?? -.6) : (o.aR ?? -.6), hook = s < 0 ? o.armL : o.armR, L = 3.5 * u;
    push(); translate(s * 3.1 * u, -7.6 * u); rotate(s < 0 ? a : -a);
    // a slight elbow bend, so the arm never reads as a stick
    const arm = ribbon([[0, 0], [s * L * .5, -.12 * u], [s * L, 0]], 1.35 * u, 1 * u);
    paint(arm, { wash: col, fill: dk, fillOp: 40, tex: .5, ink: PAL.ink, sw: sw * .85 });
    inkLine([[s * L * .78, -.5 * u], [s * L * .8, .5 * u]], sw * 1.5, BAP.gold, 'ink', 0);   // bangle
    push(); translate(s * L, 0);
    paint(ellPts(s * .35 * u, 0, .8 * u, .75 * u, 14, J), { wash: col, ink: PAL.ink, sw: sw * .8 });
    if (hook) { if (s < 0) scale(-1, 1); hook(u, sw); }
    pop(); pop();
  };
  const cross = clamp(o.cross || 0);
  const drawCross = () => {   // folded arms: two fat ribbons across the chest, the right one on top
    rs('cross');
    paint(ribbon(P([[-3.2, -7.6], [-2.2, -6.2], [0, -5.9], [1.9, -6.3]]), 1.35 * u, 1.1 * u), { wash: col, fill: dk, fillOp: 50, tex: .5, ink: PAL.ink, sw: sw * .85 });
    paint(ribbon(P([[3.2, -7.6], [2.4, -6.7], [0, -6.7], [-2.1, -7]]), 1.35 * u, 1.1 * u), { wash: col, fill: dk, fillOp: 30, tex: .5, ink: PAL.ink, sw: sw * .85 });
    for (const [bx, by] of [[1.3, -6.3], [-1.5, -6.95]]) inkLine(P([[bx, by - .55], [bx + .1, by + .55]]), sw * 1.5, BAP.gold, 'ink', 0);
    if (o.armR) { push(); translate(-2.3 * u, -7.1 * u); o.armR(u, sw); pop(); }
  };

  // ---- head
  push(); translate(hx * .5 * u, 0);
  if (o.htilt) { translate(0, -9 * u); rotate(o.htilt); translate(0, 9 * u); }
  rs('head');
  const head = ellPts(0, -11.6 * u, 4.15 * u, 3.85 * u, 32, J);
  paint(head, { wash: col, ink: null });
  paint(ellPts((-1.4 + hx) * u, -13 * u, 2.2 * u, 1.3 * u, 16, J * 2, -.2), { fill: lt, fillOp: 130, bleed: .2, tex: .85, border: .8, ink: null });
  paint(ellPts(0, -8.8 * u, 3.2 * u, 1.1 * u, 16, J), { fill: dk, fillOp: 70, bleed: .1, tex: .6, border: .5, ink: null });
  paint(head, { ink: PAL.ink, sw });
  push(); translate(hx * .9 * u, 0);
  rs('tilak');
  paint(P([[-.5, -14.4], [.5, -14.4], [.18, -13.1], [0, -12.95], [-.18, -13.1]]), { wash: BAP.tilak, ink: null, curv: .3 });
  if (o.blush) for (const s of [-1, 1]) paint(ellPts((s * 2.45) * u, -10.7 * u, .95 * u, .5 * u, 14), { fill: PAL.rose, fillOp: 150 * clamp(o.blush), bleed: .2, tex: .4, ink: null });
  rs('eyes');
  push(); translate(0, -12 * u); scale(.7); translate(0, 6 * u); eyes(u, o, sw / .7 * .85, [-1, 1], 0); pop();
  rs('mouth');
  push(); translate(-1.35 * u, -8.75 * u); scale(.6); translate(0, 4.3 * u); mouth(u, o.mouth, sw / .6 * .8); pop();
  rs('tusk');
  paint(ribbon(P([[1.05, -10.3], [1.5, -9.5], [2.15, -9.05]]), .6 * u, .1 * u), { wash: BAP.tusk, ink: PAL.ink, sw: sw * .6 });
  paint(ribbon(P([[-1.05, -10.3], [-1.35, -9.8]]), .6 * u, .5 * u), { wash: BAP.tusk, ink: PAL.ink, sw: sw * .6 });   // the broken tusk
  rs('trunk');
  let tp = Array.isArray(o.trunk) ? o.trunk : TRUNKS[o.trunk || 'curl'] || TRUNKS.curl;
  if (o.trunk2 && o.trunkK > 0) { const a = resample(tp, 9), b = resample(o.trunk2, 9); tp = a.map((p, i) => [lerp(p[0], b[i][0], o.trunkK), lerp(p[1], b[i][1], o.trunkK)]); }
  const sway = o.trunkSway || 0, tap = o.trunkTap || 0, n = tp.length;
  tp = tp.map(([a, b], i) => { const k = i / (n - 1); return [a + sway * k * k, b - tap * .7 * k * k * k]; });
  const TP = P(tp);
  paint(ribbon(TP, 1.75 * u, .7 * u), { wash: col, fill: dk, fillOp: 45, tex: .5, ink: PAL.ink, sw: sw * .9 });
  for (const k of [.45, .6, .74]) {   // trunk wrinkles
    const i = Math.min(n - 2, Math.floor(k * (n - 1))), f = k * (n - 1) - i, [ax, ay] = TP[i], [bx, by] = TP[i + 1];
    const cx = lerp(ax, bx, f), cy = lerp(ay, by, f), d = Math.hypot(bx - ax, by - ay) || 1, nx = -(by - ay) / d, ny = (bx - ax) / d, w = lerp(1.75, .7, k) * u * .32;
    inkLine([[cx - nx * w, cy - ny * w], [cx + nx * w, cy + ny * w]], sw * .45, PAL.ink, 'inkfine', 0);
  }
  pop();
  rs('crown');
  push(); translate(0, -14.7 * u); rotate(o.crownTilt || 0); translate(0, 14.7 * u);
  paint(P([[-3, -14.9], [3, -14.9], [2.5, -16.4], [1.4, -17.6], [0, -18.9], [-1.4, -17.6], [-2.5, -16.4]]), { wash: BAP.gold, fill: BAP.goldDk, fillOp: 70, bleed: .05, tex: .7, border: .5, ink: PAL.ink, sw: sw * .9, curv: .2 });
  paint(rrPts(-3.5 * u, -15.4 * u, 7 * u, 1.1 * u, .4 * u, J), { wash: BAP.goldDk, fill: BAP.gold, fillOp: 60, tex: .6, ink: PAL.ink, sw: sw * .8 });
  paint(ellPts(0, -16.4 * u, .55 * u, .7 * u, 12), { wash: BAP.sash, ink: PAL.ink, sw: sw * .6 });
  for (const s of [-1, 1]) paint(ellPts(s * 1.6 * u, -16 * u, .3 * u, .35 * u, 10), { wash: BAP.gem, ink: null });
  paint(ellPts(0, -19.3 * u, .5 * u, .5 * u, 12), { wash: BAP.gold, ink: PAL.ink, sw: sw * .7 });
  pop();
  pop();

  if (cross > .5) drawCross(); else { drawArm(-1); drawArm(1); }
  pop();

  rs('emote');
  if (o.emote) {
    const top = EMOTE_TOP.includes(o.emote), dir = o.flip ? -1 : 1;
    emote(o.emote, top ? x : x + dir * 5.6 * u, y + dy + (top ? -21 : -15.5) * u * (1 - sq), u * 1.1, o.emoteK ?? 1, o.emoteAge ?? T);
  }
  rs('after');
}

// A modak: the sweet dumpling Bappa loves. (x, y) = its base; s = size (its height is about 1.3 s).
function modak(x, y, s, bite = 0) {
  const pts = [[-.6, 0], [.6, 0], [.55, -.35], [.35, -.75], [.12, -1.1], [0, -1.3], [-.12, -1.1], [-.35, -.75], [-.55, -.35]].map(([a, b]) => [x + a * s, y + b * s]);
  paint(pts, { wash: '#F7E6C4', fill: '#E3C38E', fillOp: 90, tex: .6, ink: PAL.ink, sw: clamp(s / 30, .4, 1.4), curv: .4 });
  for (const k of [-.3, 0, .3]) inkLine([[x + k * s * .2, y - 1.2 * s], [x + k * s, y - .1 * s]], clamp(s / 45, .3, 1), '#C49A5E', 'inkfine', .4);
  if (bite > 0) paint(ellPts(x + .55 * s, y - .8 * s, .38 * s * bite, .38 * s * bite, 12), { wash: PAL.paper, ink: null });
}

// ---------- Mooshak ----------
// A small grey mouse. (x, y) = ground point; u = size unit (he's about 8u tall, ears included).
//   dx, dy, sq, rot, flip · eyes (any of Clawd's eye kinds), mouth, lookX, squint · cross 0..1 (arms folded)
//   nose 0..1 (both paws pinch the nose) · flat 0..1 (blown flat, leaning back) · tail (phase) · emote, emoteK, emoteAge
function mooshak(x, y, u, o = {}) {
  const id = o.boilKey ?? 'm' + (++CLAWD_N), rs = p => boilSeed(`mooshak ${id} ${p}`);
  x += (o.dx || 0) * u;
  const dy = (o.dy || 0) * u, sq = (o.sq || 0), fl = clamp(o.flat || 0), sw = clamp(u / 12, .45, 1.8), J = u * .05, P = pts => U(pts, u);
  rs('shadow');
  paint(ellPts(x, y + u * .1, u * 2.6, u * .5, 16), { fill: PAL.ink, fillOp: 80, bleed: .25, tex: .3, border: .1, ink: null });
  push(); translate(x, y + dy); rotate((o.rot || 0) - fl * 1.2);   // blown flat: tipped over backwards
  scale((o.flip ? -1 : 1) * (1 + sq * .6), (1 - sq) * (1 - fl * .12));
  rs('tail');
  const tph = o.tail ?? T * 1.5, tw = Math.sin(tph * TAU) * .6;
  const tail = fl > .3 ? [[1.4, -1], [3, -1.6], [4.6, -1.8], [6.2, -1.5 + tw * .3], [7.4, -1.9]] : [[1.4, -1], [3, -.6], [4, -1.8 + tw * .4], [4.2, -3.2], [3.7 + tw * .5, -4.2]];
  paint(ribbon(P(tail), .45 * u, .12 * u), { wash: BAP.pink, ink: PAL.ink, sw: sw * .6 });
  rs('body');
  for (const s of [-1, 1]) paint(ellPts(s * .9 * u, -.3 * u, .8 * u, .35 * u, 12), { wash: BAP.pink, ink: PAL.ink, sw: sw * .6 });
  const body = ellPts(0, -2 * u, 1.9 * u, 2 * u, 22, J);
  paint(body, { wash: BAP.mouse, fill: BAP.mouseDk, fillOp: 60, tex: .6, border: .5, ink: PAL.ink, sw });
  paint(ellPts(0, -1.8 * u, 1.1 * u, 1.3 * u, 16, J), { wash: BAP.mouseLt, ink: null });
  rs('head');
  for (const s of [-1, 1]) {
    paint(ellPts(s * 1.55 * u, -6.1 * u, 1.05 * u, 1.05 * u, 16, J), { wash: BAP.mouse, ink: PAL.ink, sw: sw * .8 });
    paint(ellPts(s * 1.55 * u, -6.05 * u, .62 * u, .62 * u, 12), { wash: BAP.pink, ink: null });
  }
  const head = ellPts(0, -4.5 * u, 1.75 * u, 1.55 * u, 22, J);
  paint(head, { wash: BAP.mouse, ink: PAL.ink, sw });
  rs('face');
  push(); translate(0, -4.8 * u); scale(.42); translate(0, 6 * u); eyes(u, o, sw / .42 * .8, [-1, 1], 0); pop();
  paint(ellPts(0, -3.75 * u, .36 * u, .28 * u, 10), { wash: BAP.pink, ink: PAL.ink, sw: sw * .5 });
  if (o.mouth) { push(); translate(0, -3.25 * u); scale(.3); translate(0, 4.3 * u); mouth(u, o.mouth, sw / .3 * .7); pop(); }
  for (const s of [-1, 1]) for (const k of [-.25, .2]) inkLine(P([[s * .5, -3.8 + k * .5], [s * 2.1, -3.95 + k * 1.3]]), sw * .35, PAL.ink, 'inkfine', 0);
  rs('arms');
  const nose = clamp(o.nose || 0), cr = clamp(o.cross || 0);
  const armCol = { wash: BAP.mouse, ink: PAL.ink, sw: sw * .6 };
  if (nose > .5) for (const s of [-1, 1]) paint(ribbon(P([[s * 1.5, -2.6], [s * 1.1, -3.4], [s * .3, -3.75]]), .5 * u, .38 * u), armCol);
  else if (cr > .5) {
    paint(ribbon(P([[-1.6, -2.8], [-.5, -2.1], [.9, -2.3]]), .55 * u, .45 * u), armCol);
    paint(ribbon(P([[1.6, -2.8], [.5, -2.5], [-.9, -2.6]]), .55 * u, .45 * u), armCol);
  } else for (const s of [-1, 1]) {
    const a = s < 0 ? (o.aL ?? -.7) : (o.aR ?? -.7);
    paint(ribbon(P([[s * 1.5, -2.7], [s * (1.5 + Math.cos(a) * 1.4), -2.7 - Math.sin(a) * 1.4]]), .5 * u, .38 * u), armCol);
  }
  pop();
  rs('emote');
  if (o.emote) emote(o.emote, x + (o.flip ? -1 : 1) * 2.8 * u, y + dy - 7.5 * u, u * .8, o.emoteK ?? 1, o.emoteAge ?? T);
  rs('after');
}

// Model sheet: studio.html?loop=bappa, or node render.mjs --loop=bappa --sheet=0.5 --cols=1 --w=1080
(() => {
  LOOPS.bappa = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: PAL.paper, ink: null });
    const cells = [
      ['neutral', {}], ['angry', { cross: 1 }], ['proud', { aR: .4, armR: (u) => modak(u * .4, u * .3, u * 1.3) }],
      ['sad', { trunk: 'down' }], ['furious', { ear: .9, trunk: 'up' }], ['idea', { aR: 1.3 }],
      ['relieved', { trunk: 'palm' }], ['smug', { hx: .6, trunk: 'hold' }], ['happy', { aL: .9, aR: .9 }],
    ];
    cells.forEach(([name, over], i) => {
      const cx = 180 + (i % 3) * 360, gy = 560 + Math.floor(i / 3) * 520;
      bappa(cx, gy, 20, { ...feel(name, t + i * .3, { seed: i }), ...over });
    });
    const my = 1780;
    mooshak(200, my, 22, { eyes: 'normal', mouth: 'smile' });
    mooshak(460, my, 22, { eyes: 'angry', cross: 1, emote: 'anger' });
    mooshak(720, my, 22, { eyes: 'squeeze', nose: 1, emote: 'sweat' });
    mooshak(960, my, 22, { eyes: 'x', flat: 1 });
    caption('Sample caption', 1500, t % 2.4, { life: 2.4 });   // shows caption() over the characters
  };
  LOOPS.bappa.len = 4;
})();
