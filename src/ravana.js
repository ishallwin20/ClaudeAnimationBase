// ravana.js: Ravana, Dashanan, the ten-headed king of Lanka, as a chibi villain kids can laugh at: caramel skin, TEN
// heads in a shallow arc on one gold-trimmed plum mantle (the BOSS head, #4, biggest, in a tall gold mukut; the
// others in little gold crowns), a black handlebar moustache on every head, gold kundal hoops, a plum vest with a gold
// placket, a red sash, a maroon dhoti with a gold border, curled gold juttis, and TWENTY arms fanned behind him like a
// peacock's tail (the front pair at his sides).
// Every head is a personality, the same in every shot (RV_HEADS below): 0 SLEEPY (nightcap), 1 HUNGRY (puffed cheeks,
// crumbs), 2 SHOW-OFF (lashes, a kiss curl, a sparkle), 3 ANGRY (red), 4 BOSS (mukut, smirk), 5 SIDE-EYE (green,
// jealous), 6 MINE! (a gold tooth), 7 FIBBER (shifty eyes, sweat), 8 STUBBORN (eyes shut, chin up), 9 PRANKSTER (sly).
// Front view only. Load after bappa.js (U()) and clawd.js (eyes() / mouth() / emote() / tintCols()).
//
// ravana(x, y, u, o): (x, y) is the ground under him; u is the size unit (about 26.5u to the mukut tip; the head row
// spans about x -14.4..17.3, the fan of arms about ±9.5).
// Body-local coordinates in u (y up is negative): feet 0 · dhoti -9.3..-3.6 · sash -9.4 · chest -15.6..-8.8 ·
// shoulders (±3.1, -14.6) · mantle about -17..-14.5 · head centres from rvHeadPos(o, i) (the boss at (0, -20.9),
// r 2.55; the others r about 2, from x -12.35 (#0) to 15.3 (#9), lower toward the ends).
// Options (all optional):
//   pose:   dx, dy (u), sq, rot, flip, shake 0..1 (trembling), sit (cross-legged), still (no idle head bob)
//   heads:  all = {…} (fields for every head), heads[i] = {…} (fields for head i, over all and the head's own
//           defaults); spread 0..1 (1: the row as drawn; less squeezes the heads together, the door gag)
//           Head fields: eyes ('normal' | 'wide' | 'angry' | 'happy' | 'closed' | 'sleepy' | 'side' | 'shifty' |
//           'shut' | 'lash' | 'sly' | 'squeeze' | 'x' | 'swirl', or a pair; other kinds are Clawd's), lookX / lookY,
//           brows (-1 angry .. +1 raised), browL / browR, mouth ('smile' | 'grin' | 'smirk' | 'frown' | 'flat' |
//           'pout' | 'open' | 'O' | 'teeth' | 'chew' | 'wobble' | 'yawn' | 'sick'; others are Clawd's) + mouthK,
//           hat ('crown' | 'mukut' | 'cap' | 'none'), dx / dy (u), tilt (radians), s (scale), sq, tint / tintK,
//           blush, sweat, puff 0..1 (cheeks), bubble 0..1 (a snore bubble), drool, crumbs, sparkle, curl, goldTooth,
//           chinUp, hide (don't draw it: the scene draws it elsewhere with ravanaLoneHead()), emote + emoteK + emoteAge
//   arms:   arms 0..19 (0..9 screen-left, 10..19 screen-right; k = a % 10, k = 9 is the front arm at his side, 0..8
//           fan from up-and-out to down). handL / handR = [x, y] in u (the front arms). arm(a, s, k, def) → an object
//           over the default {hand: [x, y] (u), shape ('open' | 'fist' | 'point' | 'hold'), front (draw over the
//           heads), bend (u of elbow bow), held(u, sw, a) (drawn at the hand, upright)}, or null
//   look:   effigy (the Dussehra effigy: bright paper colours, no blink, painted seams), young (the young ascetic: a
//           saffron dhoti and shawl, a sacred thread, no vest, no crowns), pal, tint / tintK (the body), noShadow,
//           swMul, boilKey
//   hooks:  held(u, sw) (body space, over the vest, under the front arms)
// Helpers: rvHeadPos(o, i) → [x, y, r] in u; ravanaHead(x, y, u, o, i) / ravanaMouth(x, y, u, o, i) / ravanaHand(x, y, u,
// o, a) / ravanaChest(x, y, u, o) → world [x, y]; ravanaLoneHead(x, y, R, i, h) draws one head anywhere (R = its radius
// in px), rvHat(kind, R, sw) draws a hat at the head centre (for a flying crown).
const RVN = {
  skin: '#C98A5E', skinDk: '#A0663F', skinLt: '#E8B48C', ink: '#2E2226',
  hair: '#2A2230', hairLt: '#4C4258', eye: '#FFF8EC', pupil: '#2A1A1E', lip: '#B85A50',
  vest: '#6B3A7A', vestDk: '#4C2758', dhoti: '#8E2F3E', dhotiDk: '#66202C', sash: '#E0573A', sashDk: '#A83A26',
  gold: '#EDB43C', goldDk: '#B67D1C', goldLt: '#FFE39A', gem: '#2E9E8A', ruby: '#D2304A',
  mouth: '#5A1E2A', tongue: '#E07A72', teeth: '#FFF8EC',
  cap: '#5E86C8', capDk: '#3E62A0', pom: '#FFF3D6', bubble: '#CDEBFA', sweat: '#BFE0F4', crumb: '#E9A63A',
  angry: '#E0503A', jealous: '#7FBF6A', sick: '#8FC46A', thread: '#FFF3D6',
};
const RV_EFFIGY = { skin: '#E6A46A', skinDk: '#C27C44', skinLt: '#F6CB98', vest: '#3F6FB8', vestDk: '#2C4F8A', dhoti: '#E0503A', dhotiDk: '#A8382A', hair: '#33283A' };
const RV_YOUNG = { vest: '#F0923A', vestDk: '#C66A1E', dhoti: '#F0923A', dhotiDk: '#C66A1E', sash: '#F7C04A', sashDk: '#C9902A' };
const RV_N = 10, RV_BOSS = 4;
// each head's own face (its personality); a scene's heads[i] / all go over these
const RV_HEADS = [
  { eyes: 'sleepy', mouth: 'flat', hat: 'cap' },                                                   // 0 SLEEPY
  { eyes: 'happy', mouth: 'smile', puff: .7, crumbs: 1 },                                           // 1 HUNGRY
  { eyes: 'lash', mouth: 'pout', curl: 1, sparkle: 1 },                                             // 2 SHOW-OFF
  { eyes: 'angry', mouth: 'teeth', tint: RVN.angry, tintK: .5 },                                    // 3 ANGRY
  { eyes: 'normal', mouth: 'smirk', hat: 'mukut', brows: .25 },                                     // 4 BOSS
  { eyes: 'side', mouth: 'frown', tint: RVN.jealous, tintK: .4, lookX: -1 },                        // 5 SIDE-EYE
  { eyes: 'normal', mouth: 'grin', goldTooth: 1, brows: -.45, lookX: .4 },                          // 6 MINE!
  { eyes: 'shifty', mouth: 'wobble', sweat: 1 },                                                    // 7 FIBBER
  { eyes: 'shut', mouth: 'pout', chinUp: 1 },                                                       // 8 STUBBORN
  { eyes: 'sly', mouth: 'smirk', browL: .8, browR: -.6 },                                           // 9 PRANKSTER
];
const RV_NAMES = ['SLEEPY', 'HUNGRY', 'SHOW-OFF', 'ANGRY', 'BOSS', 'SIDE-EYE', 'MINE', 'FIBBER', 'STUBBORN', 'PRANKSTER'];

function rvHeadOpts(o, i) { return { ...RV_HEADS[i], ...(o.all || {}), ...((o.heads && o.heads[i]) || {}) }; }
// [x, y, r] in u: head i's centre and radius, with spread, its own dx / dy and the idle bob
function rvHeadPos(o, i) {
  const n = i - RV_BOSS, boss = n === 0, sp = o.spread ?? 1, h = (o.heads && o.heads[i]) || {}, a = o.all || {};
  const x = (n * 3.25 + Math.sign(n) * .6) * sp;
  const y = boss ? -21.2 : -19.9 + Math.pow(Math.abs(n), 1.5) * .17;
  const r = boss ? 2.95 : 2.4 - Math.abs(n) * .03;
  const bob = o.still || o.effigy ? 0 : Math.sin(T * 2.1 + i * .9) * .1;
  return [x + (h.dx ?? a.dx ?? 0), y + (h.dy ?? a.dy ?? 0) + bob, r * (h.s ?? a.s ?? 1)];
}
function rvWorld(x, y, u, o, px, py) {
  const sq = o.sq || 0, fx = o.flip ? -1 : 1, r = o.rot || 0, lx = fx * px * u * (1 + sq * .6), ly = py * u * (1 - sq);
  return [x + (o.dx || 0) * u + lx * Math.cos(r) - ly * Math.sin(r), y + (o.dy || 0) * u + lx * Math.sin(r) + ly * Math.cos(r)];
}
function ravanaHead(x, y, u, o = {}, i = RV_BOSS) { const [hx, hy] = rvHeadPos(o, i); return rvWorld(x, y, u, o, hx, hy); }
function ravanaMouth(x, y, u, o = {}, i = RV_BOSS) { const [hx, hy, r] = rvHeadPos(o, i); return rvWorld(x, y, u, o, hx, hy + r * .55); }
function ravanaChest(x, y, u, o = {}) { return rvWorld(x, y, u, o, 0, -12.5); }

// arm a → {root, mid, hand, shape, front, held, s, k} in u
function rvArm(o, a) {
  const s = a < 10 ? -1 : 1, k = a % 10, root = [s * (3.0 - k * .03), -14.7 + k * .14];
  let d;
  if (k === 9) d = { hand: (s < 0 ? o.handL : o.handR) || [s * 4.9, -10.0], shape: 'fist', front: true, bend: .7 };
  else {
    const still = o.still || o.effigy ? 0 : 1, ph = lerp(.45, -1.25, k / 8) + still * .05 * Math.sin(T * 1.7 + k * .8 + (s > 0 ? 1.3 : 0)), L = 6.9 - (k % 2) * 1.1;
    d = { hand: [root[0] + s * Math.cos(ph) * L, root[1] - Math.sin(ph) * L], shape: 'open', front: false, bend: .6 };
  }
  if (o.arm) { const r = o.arm(a, s, k, d); if (r) d = { ...d, ...r }; }
  const hand = d.hand, dx = hand[0] - root[0], dy = hand[1] - root[1], len = Math.hypot(dx, dy) || 1e-3;
  let px = -dy / len, py = dx / len; if (py < 0) { px = -px; py = -py; }
  const b = d.bend ?? .6, mid = [lerp(root[0], hand[0], .5) + px * b, lerp(root[1], hand[1], .5) + py * b];
  return { ...d, root, mid, hand, s, k };
}
function ravanaHand(x, y, u, o = {}, a = 19) { const { hand } = rvArm(o, a); return rvWorld(x, y, u, o, hand[0], hand[1]); }

function rvDrawArm(A, u, sw, C, col, dk, INK, rs) {
  rs('arm' + (A.s < 0 ? 0 : 10) + A.k);
  const c = A.front ? col : mixCol(col, dk, .25 + (8 - A.k) * .02);
  paint(U(ribbon([A.root, A.mid, A.hand], A.front ? 1.6 : 1.3, A.front ? 1.25 : 1.0), u), { wash: c, fill: dk, fillOp: 30, tex: .3, ink: INK, sw: sw * .75, curv: .4 });
  const [hx, hy] = A.hand, [mx, my] = A.mid, ang = Math.atan2(hy - my, hx - mx), ca = Math.cos(ang), sa = Math.sin(ang);
  const wx = lerp(mx, hx, .8), wy = lerp(my, hy, .8);
  inkLine(U([[wx + sa * .62, wy - ca * .62], [wx - sa * .62, wy + ca * .62]], u), sw * 1.7, C.gold, 'ink', 0);   // bangle
  push(); translate(hx * u, hy * u); rotate(ang);
  const sh = A.shape || 'fist';
  if (sh === 'open') {
    for (const [fy, fl] of [[-.42, .55], [-.14, .7], [.14, .68], [.4, .5]]) paint(U(ribbon([[.35, fy], [.35 + fl, fy * 1.25]], .3, .22), u), { wash: c, ink: INK, sw: sw * .5, curv: .5 });
    paint(U(ribbon([[0, -.45], [.2, -.85]], .3, .22), u), { wash: c, ink: INK, sw: sw * .5 });   // thumb
  }
  if (sh === 'point') paint(U(ribbon([[.35, -.15], [1.25, -.2]], .32, .24), u), { wash: c, ink: INK, sw: sw * .55 });
  paint(ellPts(.1 * u, 0, .72 * u, .62 * u, 14), { wash: c, ink: INK, sw: sw * .7 });
  if (sh === 'fist' || sh === 'hold' || sh === 'point') for (const k of [-.3, .05, .38]) inkLine(U([[.45, k], [.7, k]], u), sw * .45, dk, 'inkfine', 0);
  pop();
  if (A.held) { push(); translate(hx * u, hy * u); A.held(u, sw, A.s < 0 ? A.k : 10 + A.k); pop(); }
}

// ---- hats, at the head centre (R = head radius in px)
function rvHat(kind, R, sw, C = RVN, INK = RVN.ink) {
  const Q = pts => pts.map(([a, b]) => [a * R, b * R]);
  if (kind === 'crown') {
    paint(Q([[-.66, -.66], [.66, -.66], [.7, -.95], [.42, -.86], [.3, -1.22], [.12, -.92], [0, -1.32], [-.12, -.92], [-.3, -1.22], [-.42, -.86], [-.7, -.95]]), { wash: C.gold, fill: C.goldDk, fillOp: 45, tex: .4, ink: INK, sw: sw * .6, curv: .1 });
    inkLine(Q([[-.64, -.74], [.64, -.74]]), sw * 1.2, C.goldDk, 'ink', 0);
    paint(ellPts(0, -.86 * R, .1 * R, .09 * R, 8), { wash: C.ruby, ink: INK, sw: sw * .35 });
  } else if (kind === 'mukut') {
    paint(Q([[-.78, -.62], [.78, -.62], [.84, -1.05], [.62, -1.0], [.66, -1.5], [.36, -1.42], [.3, -1.95], [.12, -1.7], [0, -2.35], [-.12, -1.7], [-.3, -1.95], [-.36, -1.42], [-.66, -1.5], [-.62, -1.0], [-.84, -1.05]]),
      { wash: C.gold, fill: C.goldDk, fillOp: 50, tex: .5, ink: INK, sw: sw * .7, curv: .12 });
    inkLine(Q([[-.78, -.72], [.78, -.72]]), sw * 1.6, C.goldDk, 'ink', 0);
    inkLine(Q([[-.7, -1.02], [0, -1.14], [.7, -1.02]]), sw * .8, C.goldDk, 'ink', .5);
    paint(ellPts(0, -.9 * R, .16 * R, .14 * R, 10), { wash: C.ruby, ink: INK, sw: sw * .4 });
    for (const s of [-1, 1]) paint(ellPts(s * .44 * R, -.88 * R, .08 * R, .08 * R, 8), { wash: C.gem, ink: INK, sw: sw * .3 });
    paint(ellPts(0, -2.38 * R, .1 * R, .1 * R, 8), { wash: C.goldLt, ink: INK, sw: sw * .35 });
  } else if (kind === 'cap') {
    const sway = Math.sin(T * 1.6) * .08;
    paint(Q([[-1.0, -.45], [-.9, -.95], [-.5, -1.35], [.1, -1.75], [.2, -2.05], [-.25, -2.1 + sway], [-.85, -1.85 + sway], [-1.35, -1.35 + sway], [-1.5, -1.0 + sway], [-1.3, -1.1 + sway], [-.85, -1.45], [-.35, -1.25], [.4, -1.2], [.9, -.95], [1.0, -.5], [0, -.62]]), { wash: C.cap, fill: C.capDk, fillOp: 50, tex: .4, ink: INK, sw: sw * .6, curv: .45 });
    paint(Q([[-1.04, -.46], [0, -.68], [1.02, -.5], [1.0, -.3], [0, -.46], [-1.02, -.26]]), { wash: C.pom, ink: INK, sw: sw * .5, curv: .4 });
    paint(ellPts(-1.5 * R, (-.88 + sway) * R, .22 * R, .22 * R, 12), { wash: C.pom, ink: INK, sw: sw * .5 });
  }
}

// ---- one head, at (px, py) in the current space, R its radius in px; h its fields; i its index (for its seed)
function rvHeadAt(px, py, R, h, C, key, i = 0, noBlink = false) {
  const rs = p => boilSeed(`rvh ${key} ${p}`);
  const sw = clamp(R / 42, .35, 2) * (h.swMul || 1), INK = C.ink, J = R * .015;
  const { col, dk, lt } = tintCols({ tint: h.tint, tintK: h.tintK, col: C.skin, dk: C.skinDk, lt: C.skinLt });
  const Q = pts => pts.map(([a, b]) => [a * R, b * R]);
  const puff = clamp(h.puff || 0), fy = h.chinUp ? -.1 : 0, sq = h.sq || 0, sc = h.s ?? 1;
  push(); translate(px, py); if (h.tilt) rotate(h.tilt); scale(1 + sq * .5, 1 - sq);
  rs('hair');   // the hair behind, a little longer at the nape
  paint(Q([[-1.0, .1], [-1.08, -.45], [-.85, -.92], [0, -1.1], [.85, -.92], [1.08, -.45], [1.0, .1], [.82, .3], [-.82, .3]]), { wash: C.hair, ink: INK, sw: sw * .6, curv: .5 });
  rs('ears');
  for (const s of [-1, 1]) {
    paint(ellPts(s * 1.0 * R, .02 * R, .2 * R, .27 * R, 10, J), { wash: col, ink: INK, sw: sw * .55 });
    const ring = ellPts(s * 1.04 * R, .42 * R, .13 * R, .15 * R, 12); inkLine([...ring, ring[0], ring[1]], sw * 1.3, C.gold, 'ink', .5);
  }
  rs('face');
  const face = []; for (let k = 0; k < 30; k++) { const a = k / 30 * TAU, sn = Math.sin(a); face.push([Math.cos(a) * .96 * (1 + puff * .2 * Math.max(0, sn + .2)) * R, sn * (sn > 0 ? 1 + puff * .05 : .98) * R]); }
  paint(face, { wash: col, ink: null });
  paint(ellPts(-.32 * R, -.45 * R, .5 * R, .28 * R, 12, J, -.2), { fill: lt, fillOp: 110, bleed: .2, tex: .8, border: .8, ink: null });
  if (puff > .05) for (const s of [-1, 1]) paint(ellPts(s * .55 * R, .38 * R, .3 * R * puff, .22 * R * puff, 12), { fill: C.lip, fillOp: 70 * puff, bleed: .2, tex: .4, ink: null });
  paint(face, { ink: INK, sw });
  rs('fringe');
  paint(Q([[-.97, -.3], [-.8, -.78], [-.3, -1.0], [.3, -1.0], [.8, -.78], [.97, -.3], [.74, -.48], [.42, -.5], [.15, -.6], [-.2, -.52], [-.55, -.56], [-.78, -.44]]), { wash: C.hair, ink: INK, sw: sw * .5, curv: .3 });
  if (h.curl) inkLine(Q([[.05, -.58], [.18, -.4], [.08, -.3], [-.02, -.38]]), sw * 1.4, C.hair, 'ink', .6);

  push(); translate(0, fy * R);
  // brows
  rs('brows');
  const kinds = Array.isArray(h.eyes) ? h.eyes : [h.eyes || 'normal', h.eyes || 'normal'];
  for (const s of [-1, 1]) {
    const ek = kinds[s < 0 ? 0 : 1];
    const b = clamp((s < 0 ? h.browL : h.browR) ?? h.brows ?? (ek === 'angry' ? -1 : ek === 'wide' ? .8 : ek === 'sleepy' ? -.2 : ek === 'side' ? -.3 : 0), -1, 1);
    const up = Math.max(0, b), dn = Math.max(0, -b);
    paint(Q(ribbon([[s * .14, -.42 - up * .12 + dn * .16], [s * .38, -.5 - up * .15], [s * .62, -.45 - up * .1 - dn * .05]], .15, .08)), { wash: C.hair, ink: null });
  }
  // eyes
  rs('eyes');
  const blink = !noBlink && ((T * .85 + i * .53 + (h.seed || 0) * 1.7 + .3) % 3.7) < .11;
  for (const s of [-1, 1]) {
    const ek = kinds[s < 0 ? 0 : 1], ex = s * .38, ey = -.12, rx = .19, ry = .23;
    const arc = (dir, w = 1) => inkLine(Q([[ex - rx * w, ey], [ex, ey + dir * .12], [ex + rx * w, ey]]), sw * 1.2, INK, 'ink', .6);
    if (ek === 'happy') { arc(-1); continue; }
    if (ek === 'closed' || (blink && ['normal', 'wide', 'angry', 'lash', 'sly', 'side', 'shifty'].includes(ek))) { arc(1); continue; }
    if (ek === 'shut') { inkLine(Q([[ex - rx, ey - .02], [ex + rx, ey + .03 * s]]), sw * 1.3, INK, 'ink', 0); continue; }
    if (ek === 'squeeze') { inkLine(Q([[ex - s * rx, ey - .13], [ex + s * rx * .9, ey], [ex - s * rx, ey + .13]]), sw * 1.3, INK, 'ink', 0); continue; }
    if (ek === 'x') { inkLine(Q([[ex - .14, ey - .14], [ex + .14, ey + .14]]), sw * 1.2, INK, 'ink', 0); inkLine(Q([[ex + .14, ey - .14], [ex - .14, ey + .14]]), sw * 1.2, INK, 'ink', 0); continue; }
    const own = ['normal', 'wide', 'angry', 'sleepy', 'side', 'shifty', 'lash', 'sly', 'swirl'];
    if (!own.includes(ek)) { push(); const k = .38 / 2.5; translate(0, ey * R); scale(k * R / 1); translate(0, 6); eyes(1, { ...h, eyes: ek }, sw / (k * R) * .9, [s], 0); pop(); continue; }
    const wide = ek === 'wide', erx = wide ? rx * 1.18 : rx, ery = wide ? ry * 1.15 : ry;
    paint(ellPts(ex * R, ey * R, erx * R, ery * R, 16), { wash: C.eye, ink: INK, sw: sw * .55 });
    if (ek === 'swirl') { const sp = []; for (let k = 0; k < 16; k++) { const a = k * .75 + T * 8 * s, r = .02 + k * .011; sp.push([(ex + Math.cos(a) * r) * R, (ey + Math.sin(a) * r) * R]); } inkLine(sp, sw * .7, INK, 'inkfine', .5); continue; }
    let lx = (h.lookX || 0), ly = (h.lookY || 0);
    if (ek === 'side') lx = h.lookX ?? -1;
    if (ek === 'shifty') lx = Math.sin(T * 3.2 + i) > 0 ? 1 : -1;
    if (ek === 'sleepy') ly = .7;
    const pr = wide ? .07 : .09;
    paint(ellPts((ex + lx * .085) * R, (ey + ly * .1) * R, pr * R, (pr + .03) * R, 10), { wash: C.pupil, ink: null });
    // lids: the top of the eye in skin, over the white
    const lid = ek === 'sleepy' ? .55 : ek === 'side' || ek === 'shifty' ? .38 : ek === 'sly' ? .5 : ek === 'lash' ? .3 : 0;
    if (lid > 0) {
      const ly0 = ey - ery + lid * 2 * ery;
      paint(Q([[ex - erx - .03, ey - ery - .05], [ex + erx + .03, ey - ery - .05], [ex + erx + .03, ly0], [ex - erx - .03, ly0]]), { wash: col, ink: null });
      inkLine(Q([[ex - erx - .02, ly0], [ex + erx + .02, ly0]]), sw * 1.1, INK, 'ink', 0);
    }
    if (ek === 'angry') {
      paint(Q([[ex - erx - .03, ey - ery - .05], [ex + erx + .03, ey - ery - .05], [ex + erx + .03, ey - .02 - s * .3 * erx], [ex - erx - .03, ey - .02 + s * .3 * erx]]), { wash: col, ink: null });
      inkLine(Q([[ex - erx - .03, ey - .02 + s * .3 * erx], [ex + erx + .03, ey - .02 - s * .3 * erx]]), sw * 1.2, INK, 'ink', 0);
    }
    if (ek === 'lash') for (const k of [-.6, 0, .6]) { const lx0 = ex + s * erx * (.4 + k * .5), ly0 = ey - ery + lid * 2 * ery; inkLine(Q([[lx0, ly0], [lx0 + s * .07, ly0 - .1]]), sw * .9, INK, 'inkfine', 0); }
  }
  // nose
  rs('nose');
  paint(Q([[-.13, .08], [0, -.05], [.13, .08], [.1, .2], [-.1, .2]]), { wash: dk, ink: INK, sw: sw * .45, curv: .5 });
  // mouth
  rs('mouth');
  const m = h.mouth || 'smirk', my = .56;
  let mk = clamp(h.mouthK ?? 1, 0, 1.5), open = false;
  if (m === 'chew') mk = .25 + .55 * Math.abs(Math.sin(T * 11 + i));
  if (m === 'open' || m === 'yawn' || m === 'chew' || m === 'O') {
    open = true;
    const w = m === 'O' ? .13 : m === 'yawn' ? .2 : m === 'chew' ? .14 + .06 * mk : .24 + .1 * mk, d = m === 'O' ? .22 : m === 'yawn' ? .26 + .2 * mk : m === 'chew' ? .06 + .14 * mk : .14 + .26 * mk;
    paint(Q([[-w, my - .04], [-w * .55, my - .08], [w * .55, my - .08], [w, my - .04], [w * .75, my + d * .7], [0, my + d], [-w * .75, my + d * .7]]), { wash: C.mouth, ink: INK, sw: sw * .7, curv: .5 });
    if (m !== 'O' && d > .16) paint(Q([[-w * .5, my + d * .62], [w * .5, my + d * .62], [0, my + d * .92]]), { wash: C.tongue, ink: null, curv: .5 });
  } else if (m === 'grin') {
    paint(Q([[-.34, my - .06], [.34, my - .06], [.2, my + .17], [-.2, my + .17]]), { wash: C.teeth, ink: INK, sw: sw * .6, curv: .35 });
    for (const k of [-.12, .12]) inkLine(Q([[k, my - .05], [k, my + .14]]), sw * .4, C.skinDk, 'inkfine', 0);
    if (h.goldTooth) paint(Q([[.12, my - .05], [.25, my - .05], [.2, my + .1], [.12, my + .1]]), { wash: C.gold, ink: INK, sw: sw * .3 });
  } else if (m === 'teeth') {
    paint(Q([[-.3, my - .07], [.3, my - .07], [.3, my + .1], [-.3, my + .1]]), { wash: C.teeth, ink: INK, sw: sw * .6, curv: .2 });
    inkLine(Q([[-.3, my + .015], [.3, my + .015]]), sw * .5, INK, 'inkfine', 0);
    for (const k of [-.15, 0, .15]) inkLine(Q([[k, my - .06], [k, my + .09]]), sw * .4, INK, 'inkfine', 0);
  } else if (m === 'smile') inkLine(Q([[-.28, my - .04], [0, my + .09], [.28, my - .04]]), sw * 1.0, INK, 'ink', .6);
  else if (m === 'frown') inkLine(Q([[-.24, my + .08], [0, my - .02], [.24, my + .08]]), sw * 1.0, INK, 'ink', .6);
  else if (m === 'flat') inkLine(Q([[-.2, my + .03], [.2, my + .03]]), sw * 1.0, INK, 'ink', 0);
  else if (m === 'smirk') inkLine(Q([[-.24, my + .04], [.04, my + .07], [.28, my - .08]]), sw * 1.0, INK, 'ink', .6);
  else if (m === 'wobble' || m === 'sick') inkLine(Q([[-.26, my + .04], [-.13, my - .02], [0, my + .04], [.13, my - .02], [.26, my + .04]]), sw * .95, INK, 'ink', .5);
  else if (m === 'pout') { paint(ellPts(0, (my + .04) * R, .12 * R, .09 * R, 10), { wash: C.lip, ink: INK, sw: sw * .5 }); inkLine(Q([[-.07, my + .04], [.07, my + .04]]), sw * .5, INK, 'inkfine', 0); }
  else { push(); translate(0, my * R); const k = .09; scale(k * R); translate(0, 4.3); mouth(1, m, sw / (k * R) * .8); pop(); }
  if (h.drool) paint(Q([[.22, my + .04], [.27, my + .16], [.22, my + .24], [.18, my + .16]]), { wash: C.bubble, ink: INK, sw: sw * .35, curv: .5 });
  // the handlebar moustache (lifts when the mouth opens)
  rs('stache');
  const ml = open ? -.05 : 0;
  for (const s of [-1, 1]) paint(Q(ribbon([[s * .04, .3 + ml], [s * .3, .29 + ml], [s * .55, .36 + ml], [s * .74, .28 + ml], [s * .76, .12 + ml], [s * .66, .08 + ml]], .17, .04)), { wash: C.hair, ink: INK, sw: sw * .45, curv: .5 });
  if (h.crumbs) for (let k = 0; k < 5; k++) paint(ellPts((-.4 + k * .2 + hash(k + i) * .08) * R, (.42 + hash(k * 3) * .12 + ml) * R, .035 * R, .03 * R, 6), { wash: C.crumb, ink: null });
  pop();   // fy

  if (h.blush) for (const s of [-1, 1]) paint(ellPts(s * .58 * R, .3 * R, .2 * R, .1 * R, 12), { fill: PAL.rose, fillOp: 150 * clamp(h.blush), bleed: .2, tex: .4, ink: null });
  if (h.sweat) { rs('sweat'); const k = frac(T * .7 + i * .3) * clamp(h.sweat); paint(Q([[.86, -.62 + k * .5], [.95, -.45 + k * .5], [.86, -.36 + k * .5], [.77, -.45 + k * .5]]), { wash: C.sweat, ink: INK, sw: sw * .4, curv: .5 }); }
  if (h.bubble) { rs('bubble'); const k = clamp(h.bubble); paint(ellPts(.32 * R, (.35 - k * .12) * R, (.05 + k * .3) * R, (.05 + k * .28) * R, 16), { wash: C.bubble, washOp: 190, ink: INK, sw: sw * .35 }); paint(ellPts((.24 + k * .05) * R, (.25 - k * .2) * R, .04 * R * k, .03 * R * k, 6), { wash: '#FFFFFF', ink: null }); }
  rs('hat');
  rvHat(h.hat ?? 'crown', R, sw, C, INK);
  if (h.sparkle) { rs('sparkle'); const k = .7 + .3 * Math.sin(T * 6 + i); paint(starPts(-1.2 * R, -1.05 * R, .26 * R * k, .3, 4, T * .5), { wash: C.goldLt, ink: INK, sw: sw * .35 }); }
  pop();
}
// one head on its own (a floating head, a head held up close): (x, y) its centre, R its radius in px
function ravanaLoneHead(x, y, R, i, h = {}, o = {}) {
  const C = { ...RVN, ...(o.effigy ? RV_EFFIGY : {}), ...(o.pal || {}) };
  rvHeadAt(x, y, R, { ...RV_HEADS[i], ...h }, C, (o.boilKey || 'lone') + i, i, !!o.effigy);
  boilSeed('lone after ' + (o.boilKey || '') + i);
}

function ravana(x, y, u, o = {}) {
  const id = o.boilKey ?? 'rv' + (++CLAWD_N), rs = p => boilSeed(`ravana ${id} ${p}`);
  const C = { ...RVN, ...(o.effigy ? RV_EFFIGY : {}), ...(o.young ? RV_YOUNG : {}), ...(o.pal || {}) }, INK = C.ink;
  const sk = (o.shake || 0) * Math.sin(T * 60) * .12;
  const sq = o.sq || 0, sw = clamp(u / 20, .4, 2) * (o.swMul || 1), J = u * .04;
  const { col, dk, lt } = tintCols({ tint: o.tint, tintK: o.tintK, col: C.skin, dk: C.skinDk, lt: C.skinLt });
  const P = pts => U(pts, u);
  const arms = []; for (let a = 0; a < 20; a++) arms.push(rvArm(o, a));

  if (!o.noShadow) { rs('shadow'); paint(ellPts(x + (o.dx || 0) * u, y + u * .1, u * (o.sit ? 6.4 : 5.4), u * .95, 22), { fill: PAL.ink, fillOp: 80, bleed: .25, tex: .3, border: .1, ink: null }); }
  push();
  translate(x + (o.dx || 0) * u + sk * u, y + (o.dy || 0) * u);
  if (o.rot) rotate(o.rot);
  scale((o.flip ? -1 : 1) * (1 + sq * .6), 1 - sq);

  // ---- the fan of arms behind him
  for (const A of arms) if (!A.front) rvDrawArm(A, u, sw, C, col, dk, INK, rs);

  // ---- legs (standing, in curled gold juttis) or crossed legs; the dhoti
  if (o.sit) {
    rs('lap');
    paint(P([[-6.0, -1.2], [-5.2, -3.4], [-2.6, -4.4], [0, -4.0], [2.6, -4.4], [5.2, -3.4], [6.0, -1.2], [4.6, -.1], [0, -.5], [-4.6, -.1]]), { wash: C.dhoti, fill: C.dhotiDk, fillOp: 60, tex: .5, ink: INK, sw: sw * .9, curv: .45 });
    for (const s of [-1, 1]) { paint(ellPts(s * 2.6 * u, -2.5 * u, 1.2 * u, .6 * u, 12, J, s * .25), { wash: col, ink: INK, sw: sw * .7 }); paint(ellPts(s * 2.75 * u, -2.45 * u, .7 * u, .34 * u, 10, 0, s * .25), { wash: C.lip, washOp: 120, ink: null }); }
    inkLine(P([[-5.6, -1.6], [-3, -.9], [0, -1.2], [3, -.9], [5.6, -1.6]]), sw * 1.6, C.gold, 'ink', .5);
  } else {
    rs('legs');
    for (const s of [-1, 1]) {
      paint(P([[s * .7, -4.2], [s * 2.5, -4.2], [s * 2.4, -1.0], [s * 1.0, -1.0]]), { wash: col, fill: dk, fillOp: 40, tex: .4, ink: INK, sw: sw * .8, curv: .3 });
      paint(P([[s * .7, -1.3], [s * 2.6, -1.3], [s * 3.3, -.6], [s * 3.9, -1.1], [s * 4.0, -.5], [s * 3.4, 0], [s * .8, 0]]), { wash: C.gold, fill: C.goldDk, fillOp: 50, tex: .4, ink: INK, sw: sw * .7, curv: .35 });
      inkLine(P([[s * 1.0, -1.25], [s * 2.5, -1.25]]), sw * .9, C.ruby, 'ink', 0);
    }
  }
  rs('dhoti');
  paint(P([[-3.6, -9.3], [3.6, -9.3], [4.3, -7.2], [3.9, -4.6], [2.8, -3.6], [1.2, -4.4], [0, -5.4], [-1.2, -4.4], [-2.8, -3.6], [-3.9, -4.6], [-4.3, -7.2]]), { wash: C.dhoti, fill: C.dhotiDk, fillOp: 70, tex: .6, ink: INK, sw: sw * .9, curv: .3 });
  inkLine(P([[-3.9, -4.5], [-2.8, -3.75], [-1.3, -4.5], [0, -5.5], [1.3, -4.5], [2.8, -3.75], [3.9, -4.5]]), sw * 1.8, C.gold, 'ink', .4);
  for (const k of [-2.2, -.6, 1, 2.4]) inkLine(P([[k * .9, -8.8], [k * 1.05, -5.8]]), sw * .5, C.dhotiDk, 'inkfine', .5);

  // ---- the torso: a round royal belly in a plum vest with a gold placket (young: bare, a sacred thread)
  rs('torso');
  const tor = P([[-3.0, -15.6], [3.0, -15.6], [3.9, -14.2], [4.4, -11.8], [4.1, -9.6], [2.6, -8.7], [-2.6, -8.7], [-4.1, -9.6], [-4.4, -11.8], [-3.9, -14.2]]);
  paint(tor, { wash: o.young ? col : C.vest, fill: o.young ? dk : C.vestDk, fillOp: 50, bleed: .06, tex: .5, border: .4, ink: INK, sw: sw * .9, curv: .4 });
  if (o.young) {
    paint(P([[-2.6, -12.4], [0, -11.8], [2.6, -12.4], [2.3, -9.4], [0, -9.0], [-2.3, -9.4]]), { wash: lt, ink: null, curv: .5 });
    inkLine(P([[-2.6, -15.2], [-.8, -12.6], [1.2, -10.4], [3.0, -9.2]]), sw * 1.1, C.thread, 'ink', .5);
  } else {
    paint(P([[-.75, -15.4], [.75, -15.4], [.6, -9.0], [-.6, -9.0]]), { wash: C.gold, fill: C.goldDk, fillOp: 40, tex: .4, ink: INK, sw: sw * .5 });
    for (const k of [-14.2, -12.6, -11.0]) paint(ellPts(0, k * u, .26 * u, .26 * u, 10), { wash: C.ruby, ink: INK, sw: sw * .4 });
    inkLine(P([[-3.6, -13.6], [-2.4, -12.2], [-2.6, -10.2]]), sw * .6, C.vestDk, 'inkfine', .5);
    inkLine(P([[3.6, -13.6], [2.4, -12.2], [2.6, -10.2]]), sw * .6, C.vestDk, 'inkfine', .5);
  }
  if (o.effigy) for (const k of [-2.4, 2.4]) inkLine(P([[k, -15.2], [k * 1.1, -9.2]]), sw * .5, mixCol(C.vest, '#FFFFFF', .3), 'inkfine', 0);   // paper seams
  paint(ribbon(P([[-4.1, -9.6], [0, -9.25], [4.1, -9.6]]), 1.1 * u, 1.1 * u), { wash: C.sash, fill: C.sashDk, fillOp: 60, tex: .5, ink: INK, sw: sw * .7 });
  paint(ellPts(0, -9.4 * u, .6 * u, .55 * u, 12), { wash: C.gold, ink: INK, sw: sw * .5 });
  if (o.held) { rs('held'); o.held(u, sw); }

  // ---- the mantle every head sits on: plum (young: a saffron shawl), gold trim, a gold drop under each chin
  const HP = []; for (let i = 0; i < RV_N; i++) HP.push(rvHeadPos(o, i));
  const byX = HP.map((p, i) => [...p, i]).sort((a, b) => a[0] - b[0]);
  rs('mantle');
  {
    const top = byX.map(([hx, hy, r]) => [hx, hy + r * .55]);
    const L0 = byX[0], R0 = byX[byX.length - 1];
    const bot = byX.slice().reverse().map(([hx, hy, r]) => [hx, Math.abs(hx) < 4.2 ? -15.0 : hy + r * .55 + 1.7]);
    const M = [[L0[0] - L0[2] * .7, L0[1] + L0[2] * .9], ...top, [R0[0] + R0[2] * .7, R0[1] + R0[2] * .9], ...bot];
    paint(U(M, u), { wash: C.vest, fill: C.vestDk, fillOp: 55, tex: .5, ink: INK, sw: sw * .8, curv: .45 });
    inkLine(U(bot.slice().reverse().map(([a, b]) => [a, b - .2]), u), sw * 1.8, C.gold, 'ink', .5);
    if (!o.young) for (const [hx, hy, r] of byX) paint(U([[hx - .28, hy + r * .55 + .9], [hx + .28, hy + r * .55 + .9], [hx, hy + r * .55 + 1.6]], u), { wash: C.gold, ink: INK, sw: sw * .4 });
  }

  // ---- the heads: the outside ones first, the boss last (on top)
  const order = [...Array(RV_N).keys()].sort((a, b) => Math.abs(b - RV_BOSS) - Math.abs(a - RV_BOSS) || b - a);
  for (const i of order) {
    const h = rvHeadOpts(o, i);
    if (h.hide) continue;
    const [hx, hy, r] = HP[i];
    if (o.young && h.hat !== 'cap') h.hat = 'none';
    rvHeadAt(hx * u, hy * u, r * u, h, C, id + ' ' + i, i, !!o.effigy);
  }

  // ---- the front arms (and any arm brought in front)
  for (const A of arms) if (A.front) rvDrawArm(A, u, sw, C, col, dk, INK, rs);
  pop();

  for (let i = 0; i < RV_N; i++) {
    const h = rvHeadOpts(o, i);
    if (!h.emote || h.hide) continue;
    rs('emote' + i);
    const [hx, hy, r] = HP[i], [ex, ey] = rvWorld(x, y, u, o, (o.flip ? -1 : 1) * (hx + r * .9), hy - r * 1.2);
    emote(h.emote, ex, ey, u * .75, h.emoteK ?? 1, h.emoteAge ?? T);
  }
  rs('after');
}

// Model sheet: studio.html?loop=ravana, or node render.mjs --loop=ravana --sheet=0.5,2.5 --cols=2 --w=540
(() => {
  LOOPS.ravana = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: '#E9DFD0', ink: null });
    const u = 16.5;
    ravana(540, 700, u, { boilKey: 'r1' });
    // everyone yells; twenty hands reach for one point
    ravana(540, 1240, u * .8, { boilKey: 'r2', all: { eyes: 'wide', mouth: 'open' }, arm: (a, s, k) => ({ hand: [1.5 + Math.sin(a * 2.3) * 1.6, -24 + Math.cos(a * 1.7) * 1.4], front: true, shape: 'open' }) });
    // the young ascetic, sitting, eyes shut; the effigy
    ravana(290, 1800, u * .55, { boilKey: 'r3', young: true, sit: true, all: { eyes: 'closed', mouth: 'smile', tint: null, sweat: 0 }, handL: [-2.6, -4.6], handR: [2.6, -4.6] });
    ravana(800, 1800, u * .55, { boilKey: 'r4', effigy: true, spread: .5 + .5 * Math.abs(Math.sin(t)) });
  };
  LOOPS.ravana.len = 4;
})();
