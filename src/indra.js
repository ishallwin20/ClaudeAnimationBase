// indra.js: Indra, king of the devas, riding Airavata, his white elephant with four tusks. Front view.
//   airavata(x, y, u, o)   (x, y) is the ground (or cloud) between his front feet; about 14u tall to the top of his head,
//                          16u wide with the ears out. Indra rides on top when o.indra is set (his own options).
//   indra(x, y, u, o)      Indra alone, sitting: (x, y) is his seat. About 9.5u tall to the crown's tip.
// Load after bappa.js (U()) and clawd.js.
//
// Airavata, body-local u (y up is negative): feet (±2.3, 0) · head centre (0, -9.3), 3.6 × 3.5 · eyes (±1.55, -10.0)
//   ears pivot (±3.2, -9.6), out to ±7.6 · trunk root (0, -7.6) · tusks from (±1.0..1.5, -7.4) · rider seat (0, -12.6)
//   options: dx, dy (u), sq, rot, flip, ear (flap phase), earOut 0..1 (flared in alarm), trunk 'down' | 'curl' | 'up'
//            (trumpet / panic) | 'limp', trunkSway, eyes 'normal' | 'wide' | 'closed' | 'happy' | 'sad', lookX, puff
//            0..1 (holding his breath: cheeks out), tint (any hex) + tintK (e.g. blue when he can't breathe), sweat,
//            indra (Indra's options: he's drawn on the seat), boilKey
// Indra, seat-local u: waist 0 · shoulders (±1.9, -3.1) · head centre (0, -5.2), 1.8 × 1.9 · crown to -9.5
//   options: handL / handR (2-bone arm targets in seat u; default: the vajra hand raised at his side, the other on his
//            knee), vajra 0..1 (he holds it in handR), vajraA (its angle), eyes 'normal' | 'wide' | 'angry' | 'closed' |
//            'happy' | 'sad', lookX, mouth 'smile' | 'flat' | 'open' | 'O' | 'frown' | 'shout' | 'sheepish', brows
//            (-1 angry .. +1 raised), puff 0..1 (holding his breath), tint + tintK, sweat, bow 0..1 (leans forward:
//            sorry), lean (radians), boilKey
// Helpers: airavataSeat(x, y, u, o), airavataTrunkTip(x, y, u, o), indraHand(x, y, u, o, s) → world [x, y].
const IND = {
  ink: '#2A2238', skin: '#F2C38E', skinDk: '#D69A62', skinLt: '#FFE0B8', gold: '#F2C230', goldDk: '#B88A1C', goldLt: '#FFE69A',
  robe: '#3E63B8', robeDk: '#28468A', dhoti: '#F3B53A', dhotiDk: '#C98A1C', hair: '#2A1E2A', white: '#FFF8EC', mouth: '#6E2A26',
  ele: '#EEF0F4', eleDk: '#C3C9D6', eleLt: '#FFFFFF', eleIn: '#F2C6CC', tusk: '#FFF6E0', cap: '#D8352A', capDk: '#A4231C', jewel: '#3FB6A8',
  vajra: '#F2C230', vajraDk: '#B88A1C',
};

function _ik(sh, h, L1, L2, s, bend = 1) {
  let dx = h[0] - sh[0], dy = h[1] - sh[1], d = Math.hypot(dx, dy) || 1e-3;
  const reach = L1 + L2 - .05;
  if (d > reach) { h = [sh[0] + dx / d * reach, sh[1] + dy / d * reach]; dx = h[0] - sh[0]; dy = h[1] - sh[1]; d = reach; }
  d = Math.max(d, .5);
  const a = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1)), base = Math.atan2(dy, dx);
  const e1 = [sh[0] + Math.cos(base + a) * L1, sh[1] + Math.sin(base + a) * L1], e2 = [sh[0] + Math.cos(base - a) * L1, sh[1] + Math.sin(base - a) * L1];
  const out = (e1[0] - e2[0]) * s > 0 ? e1 : e2;
  return [sh, bend < 0 ? (out === e1 ? e2 : e1) : out, h];
}
function indraArm(o, s) {
  const h = (s < 0 ? o.handL : o.handR) || (s > 0 ? [3.0, -5.0] : [-1.6, -.4]);
  return _ik([s * 1.9, -3.0], h, 1.75, 1.7, s, (s < 0 ? o.bendL : o.bendR) ?? 1);
}
function indraWorld(x, y, u, o, px, py) { const r = (o.lean || 0) + (o.bow || 0) * .35, c = Math.cos(r), sn = Math.sin(r); return [x + (px * c - py * sn) * u * (o.flip ? -1 : 1), y + (px * sn + py * c) * u]; }
function indraHand(x, y, u, o, s) { return indraWorld(x, y, u, o, ...indraArm(o, s)[2]); }

// the vajra: two five-pronged heads on a grip (drawn around (0, 0), along y)
function indraVajra(u, sw, INK = IND.ink) {
  paint(U(ribbon([[0, -1.0], [0, 1.0]], .42, .42), u), { wash: IND.vajraDk, ink: INK, sw: sw * .5 });
  for (const e of [-1, 1]) {
    paint(ellPts(0, e * 1.0 * u, .45 * u, .3 * u, 12), { wash: IND.vajra, ink: INK, sw: sw * .5 });
    for (const k of [-1, -.5, 0, .5, 1]) {
      const tip = [k * .75, e * (2.5 - Math.abs(k) * .35)], mid = [k * 1.05, e * 1.75];
      paint(U(ribbon([[k * .2, e * 1.1], mid, tip], k === 0 ? .4 : .3, .08), u), { wash: IND.vajra, ink: INK, sw: sw * .4 });
    }
  }
}

function indra(x, y, u, o = {}) {
  const id = o.boilKey ?? 'in' + (++CLAWD_N), rs = p => boilSeed(`indra ${id} ${p}`), INK = IND.ink, sw = clamp(u / 20, .4, 2);
  const { col, dk, lt } = tintCols({ tint: o.tint, tintK: o.tintK, col: IND.skin, dk: IND.skinDk, lt: IND.skinLt });
  const P = pts => U(pts, u);
  push(); translate(x, y); if (o.flip) scale(-1, 1); rotate((o.lean || 0) + (o.bow || 0) * .35);
  rs('body');
  paint(P([[-2.6, .2], [-2.9, -.7], [-1.6, -1.2], [0, -1.0], [1.6, -1.2], [2.9, -.7], [2.6, .2]]), { wash: IND.dhoti, fill: IND.dhotiDk, fillOp: 50, ink: INK, sw: sw * .7, curv: .4 });
  paint(P([[-1.75, -3.4], [1.75, -3.4], [2.05, -1.9], [1.85, -.6], [-1.85, -.6], [-2.05, -1.9]]), { wash: col, fill: dk, fillOp: 35, ink: INK, sw: sw * .8, curv: .4 });
  paint(P(ribbon([[-1.75, -3.2], [0, -1.8], [1.9, -.9]], .8, .8)), { wash: IND.robe, fill: IND.robeDk, fillOp: 50, ink: INK, sw: sw * .55 });   // a sash
  paint(P(ribbon([[-1.6, -3.35], [0, -2.65], [1.6, -3.35]], .55, .55)), { wash: IND.gold, ink: INK, sw: sw * .5 });   // a gold collar
  for (const k of [-1, -.5, 0, .5, 1]) paint(ellPts(k * 1.0 * u, (-2.7 + Math.abs(k) * -.25) * u, .16 * u, .16 * u, 8), { wash: IND.jewel, ink: null });
  const arms = [-1, 1].map(s => {
    const [sh, el, ha] = indraArm(o, s);
    rs('arm' + s);
    paint(P(ribbon([sh, el, ha], .95, .8)), { wash: s < 0 ? col : lt, fill: dk, fillOp: 30, ink: INK, sw: sw * .7, curv: .3 });
    paint(P(ribbon([[lerp(el[0], ha[0], .6), lerp(el[1], ha[1], .6)], [lerp(el[0], ha[0], .75), lerp(el[1], ha[1], .75)]], .95, .95)), { wash: IND.gold, ink: INK, sw: sw * .4 });
    return { s, el, ha };
  });
  // head
  rs('head');
  const hy = -5.25, hx = (o.lookX || 0) * .1;
  paint(P([[-.55, -3.6], [.55, -3.6], [.6, -3.0], [-.6, -3.0]]), { wash: dk, ink: INK, sw: sw * .5 });
  paint(P([[-1.95, -5.8], [-1.6, -7.0], [0, -7.4], [1.6, -7.0], [1.95, -5.8], [1.85, -4.6], [1.3, -3.7], [0, -3.35], [-1.3, -3.7], [-1.85, -4.6]]), { wash: col, fill: dk, fillOp: 25, ink: INK, sw: sw * .85, curv: .5 });
  for (const s of [-1, 1]) {
    paint(ellPts(s * 1.95 * u, -5.3 * u, .38 * u, .52 * u, 10), { wash: col, ink: INK, sw: sw * .5 });
    paint(ellPts(s * 2.05 * u, -4.55 * u, .22 * u, .26 * u, 8), { wash: IND.gold, ink: INK, sw: sw * .3 });
  }
  const pf = clamp(o.puff || 0);
  if (pf > 0) for (const s of [-1, 1]) paint(ellPts(s * (1.2 + pf * .35) * u, -4.4 * u, (.55 + pf * .45) * u, (.45 + pf * .3) * u, 12), { wash: mixCol(col, '#FFFFFF', .15), ink: null });
  // the crown: a tall gold kirita with three points and a jewel
  rs('crown');
  paint(P([[-1.75, -6.4], [-1.85, -7.6], [-1.15, -8.2], [-.75, -9.0], [0, -9.9], [.75, -9.0], [1.15, -8.2], [1.85, -7.6], [1.75, -6.4]]), { wash: IND.gold, fill: IND.goldDk, fillOp: 40, ink: INK, sw: sw * .7, curv: .2 });
  paint(P(ribbon([[-1.85, -6.55], [0, -6.8], [1.85, -6.55]], .45, .45)), { wash: IND.goldLt, ink: INK, sw: sw * .4 });
  paint(ellPts(0, -7.7 * u, .32 * u, .4 * u, 10), { wash: IND.jewel, ink: INK, sw: sw * .4 });
  paint(ellPts(0, -10.05 * u, .2 * u, .2 * u, 8), { wash: IND.jewel, ink: INK, sw: sw * .3 });
  // face
  rs('face');
  push(); translate(hx * u, 0);
  const ek = o.eyes || 'normal', br = clamp((o.brows ?? 0) - (ek === 'angry' ? .9 : 0), -1, 1);
  for (const s of [-1, 1]) {
    const ex = s * .72, ey = -5.45;
    inkLine(P([[s * .35, ey - .55 - Math.max(0, br) * .2 + Math.min(0, br) * -.25], [s * 1.15, ey - .62 - Math.max(0, br) * .25 - Math.min(0, br) * -.05]]), sw * 1.1, IND.hair, 'ink', 0);
    if (ek === 'closed' || ek === 'happy') { inkLine(P(ek === 'happy' ? [[ex - .3, ey + .1], [ex, ey - .18], [ex + .3, ey + .1]] : [[ex - .3, ey], [ex, ey + .15], [ex + .3, ey]]), sw * 1.1, INK, 'ink', .6); continue; }
    const r = ek === 'wide' ? .38 : .3;
    paint(ellPts(ex * u, ey * u, r * u, (r + .06) * u, 12), { wash: IND.white, ink: INK, sw: sw * .45 });
    paint(ellPts((ex + (o.lookX || 0) * .1) * u, (ey + .03) * u, (ek === 'wide' ? .13 : .17) * u, (ek === 'wide' ? .15 : .2) * u, 10), { wash: INK, ink: null });
    if (ek === 'angry') paint(P([[ex - .35, ey - .32 + s * .08], [ex + .35, ey - .32 - s * .08], [ex + .35, ey - .45], [ex - .35, ey - .45]]), { wash: col, ink: null });
    if (ek === 'sad') inkLine(P([[ex - .3, ey + .35], [ex + .3, ey + .35]]), sw * .4, dk, 'inkfine', 0);
  }
  inkLine(P([[0, -5.0], [-.12, -4.6], [.1, -4.5]]), sw * .5, dk, 'inkfine', .5);
  // a curling moustache
  for (const s of [-1, 1]) paint(P(ribbon([[s * .05, -4.3], [s * .55, -4.38], [s * .95, -4.15], [s * 1.05, -4.4]], .32, .08)), { wash: IND.hair, ink: null });
  const m = o.mouth || 'smile', my = -3.95;
  if (m === 'smile') inkLine(P([[-.45, my], [0, my + .2], [.45, my]]), sw * .8, INK, 'ink', .6);
  else if (m === 'sheepish') inkLine(P([[-.45, my + .05], [-.1, my + .15], [.2, my + .05], [.45, my - .1]]), sw * .8, INK, 'ink', .6);
  else if (m === 'flat') inkLine(P([[-.4, my + .08], [.4, my + .08]]), sw * .8, INK, 'ink', 0);
  else if (m === 'frown') inkLine(P([[-.45, my + .2], [0, my], [.45, my + .2]]), sw * .8, INK, 'ink', .6);
  else if (m === 'O') paint(ellPts(0, (my + .15) * u, .2 * u, .26 * u, 10), { wash: IND.mouth, ink: INK, sw: sw * .5 });
  else if (m === 'puff') paint(ellPts(0, (my + .1) * u, .16 * u, .1 * u, 8), { wash: dk, ink: INK, sw: sw * .5 });
  else if (m === 'open' || m === 'shout') { const w = m === 'shout' ? .6 : .42, d = m === 'shout' ? .75 : .45; paint(P([[-w, my - .05], [w, my - .05], [w * .7, my + d * .7], [0, my + d], [-w * .7, my + d * .7]]), { wash: IND.mouth, ink: INK, sw: sw * .6, curv: .5 }); }
  pop();
  if (o.sweat) { rs('sweat'); paint(P([[2.2, -7.0], [2.55, -6.2], [2.2, -5.9], [1.9, -6.2]]), { wash: '#9ED0F0', ink: INK, sw: sw * .4, curv: .6 }); }
  // the vajra in his right hand, then the hands
  for (const A of arms) {
    rs('hand' + A.s);
    if (A.s > 0 && (o.vajra ?? 1) > .01) {
      push(); translate(A.ha[0] * u, A.ha[1] * u); rotate(o.vajraA ?? -.3); scale(clamp(o.vajra ?? 1)); indraVajra(u * .95, sw); pop();
    }
    paint(ellPts(A.ha[0] * u, A.ha[1] * u, .5 * u, .48 * u, 12), { wash: A.s < 0 ? col : lt, ink: INK, sw: sw * .55 });
  }
  pop();
}

function airavataSeat(x, y, u, o = {}) { return [x + (o.dx || 0) * u, y + ((o.dy || 0) - 12.6 * (1 - (o.sq || 0))) * u]; }
function airavataTrunkTip(x, y, u, o = {}) { const P = airavataTrunk(o); const e = P[P.length - 1]; return [x + ((o.dx || 0) + e[0] * (o.flip ? -1 : 1)) * u, y + ((o.dy || 0) + e[1] * (1 - (o.sq || 0))) * u]; }
function airavataTrunk(o) {
  const k = o.trunk || 'down', sw = Math.sin((o.trunkSway ?? T * .8) * TAU) * .35;
  if (k === 'up') return [[0, -7.6], [.1, -6.2], [.9, -5.4 + sw * .2], [2.2, -6.0], [3.0, -7.6], [3.2, -9.6 + sw * .4], [3.0, -11.0]];
  if (k === 'curl') return [[0, -7.6], [0, -6.0], [.2, -4.5], [.9, -3.6], [1.6, -3.9], [1.7, -4.7], [1.2, -5.0]];
  if (k === 'limp') return [[0, -7.6], [0, -5.6], [.05, -3.6], [.1, -1.8], [.3, -1.2]];
  return [[0, -7.6], [sw * .2, -6.0], [sw * .6, -4.4], [sw * .9 + .2, -3.0], [sw + .8, -2.3], [sw + 1.4, -2.6]];
}

function airavata(x, y, u, o = {}) {
  const id = o.boilKey ?? 'ai' + (++CLAWD_N), rs = p => boilSeed(`airavata ${id} ${p}`), INK = IND.ink, sw = clamp(u / 20, .4, 2), J = u * .03;
  const tk = clamp(o.tintK ?? 1), tc = o.tint;
  const col = tc ? mixCol(IND.ele, tc, .5 * tk) : IND.ele, dk = tc ? mixCol(IND.eleDk, tc, .5 * tk) : IND.eleDk, lt = tc ? mixCol(IND.eleLt, tc, .3 * tk) : IND.eleLt;
  const P = pts => U(pts, u), sq = o.sq || 0, ear = Math.sin((o.ear ?? T * 1.4) * TAU), eo = clamp(o.earOut || 0), pf = clamp(o.puff || 0);
  push(); translate(x + (o.dx || 0) * u, y + (o.dy || 0) * u); if (o.rot) rotate(o.rot); scale((o.flip ? -1 : 1) * (1 + sq * .5), 1 - sq);
  // legs and body behind the head
  rs('body');
  paint(P([[-5.0, -10.5], [-3.0, -12.0], [3.0, -12.0], [5.0, -10.5], [5.3, -6.5], [4.6, -4.2], [-4.6, -4.2], [-5.3, -6.5]]), { wash: dk, fill: dk, fillOp: 40, ink: INK, sw: sw * .8, curv: .4 });
  for (const s of [-1, 1]) {
    rs('leg' + s);
    paint(P([[s * 1.2, -6.0], [s * 3.4, -6.0], [s * 3.5, -.3], [s * 3.3, 0], [s * 1.3, 0], [s * 1.1, -.3]]), { wash: s < 0 ? col : lt, fill: dk, fillOp: 30, ink: INK, sw: sw * .8, curv: .45 });
    for (let k = 0; k < 3; k++) paint(ellPts(s * (1.7 + k * .7) * u, -.35 * u, .3 * u, .22 * u, 8), { wash: IND.tusk, ink: INK, sw: sw * .35 });   // toenails
    paint(P(ribbon([[s * 1.2, -1.6], [s * 3.45, -1.6]], .45, .45)), { wash: IND.gold, ink: INK, sw: sw * .4 });   // an anklet
  }
  // the ears: big flaps that wave (and flare in alarm)
  for (const s of [-1, 1]) {
    rs('ear' + s);
    const f = .15 * ear * s + eo * .5, ox = 3.0;
    push(); translate(s * ox * u, -9.6 * u); rotate(s * f * .25); scale(1 + eo * .15 + Math.abs(ear) * .04, 1);
    const E = [[0, -2.4], [s * 2.2, -3.4], [s * 4.2, -2.6], [s * 4.8, -.4], [s * 4.2, 2.0], [s * 2.8, 3.3], [s * 1.2, 3.0], [0, 1.6]];
    paint(P(E), { wash: col, fill: dk, fillOp: 40, ink: INK, sw: sw * .85, curv: .5 });
    paint(P(E.map(([a, b]) => [a * .7 + s * .4, b * .72])), { wash: IND.eleIn, washOp: 170, ink: null, curv: .5 });
    pop();
  }
  // the head
  rs('head');
  const head = [[-3.4, -11.6], [-1.6, -13.2], [0, -13.5], [1.6, -13.2], [3.4, -11.6], [3.75 + pf * .5, -9.0], [3.4 + pf * .5, -7.2], [2.3, -6.3], [0, -6.0], [-2.3, -6.3], [-3.4 - pf * .5, -7.2], [-3.75 - pf * .5, -9.0]];
  paint(P(head), { wash: col, fill: dk, fillOp: 25, bleed: .1, tex: .4, ink: INK, sw: sw * .9, curv: .5 });
  paint(P([[-1.0, -13.1], [-.5, -13.5], [0, -13.3], [.5, -13.5], [1.0, -13.1], [0, -12.5]]), { wash: dk, washOp: 90, ink: null, curv: .5 });   // the forehead bumps
  // the caparison: a red cloth with a gold border and a jewel over his forehead
  rs('cap');
  paint(P([[-2.2, -12.6], [2.2, -12.6], [2.0, -10.8], [1.0, -10.0], [0, -9.4], [-1.0, -10.0], [-2.0, -10.8]]), { wash: IND.cap, fill: IND.capDk, fillOp: 60, tex: .5, ink: INK, sw: sw * .65, curv: .3 });
  inkLine(P([[-2.05, -12.35], [2.05, -12.35]]), sw * 1.4, IND.gold, 'ink', 0);
  inkLine(P([[-1.85, -10.85], [-.95, -10.15], [0, -9.65], [.95, -10.15], [1.85, -10.85]]), sw * 1.3, IND.gold, 'ink', .3);
  paint(ellPts(0, -11.3 * u, .42 * u, .5 * u, 12), { wash: IND.jewel, ink: INK, sw: sw * .45 });
  for (const k of [-1.2, 0, 1.2]) paint(ellPts(k * u, (-9.6 - Math.abs(k) * .45) * u, .14 * u, .2 * u, 8), { wash: IND.gold, ink: INK, sw: sw * .3 });   // tassels
  if (pf > 0) for (const s of [-1, 1]) paint(ellPts(s * (2.3 + pf * .5) * u, -7.6 * u, (.8 + pf * .6) * u, (.6 + pf * .4) * u, 12), { wash: mixCol(col, '#FFFFFF', .2), ink: null });
  // eyes: small and kind
  rs('eyes');
  const ek = o.eyes || 'normal';
  for (const s of [-1, 1]) {
    const ex = s * 1.6, ey = -8.75;
    if (ek === 'closed' || ek === 'happy') { inkLine(P(ek === 'happy' ? [[ex - .35, ey + .12], [ex, ey - .2], [ex + .35, ey + .12]] : [[ex - .35, ey], [ex, ey + .18], [ex + .35, ey]]), sw * 1.1, INK, 'ink', .6); continue; }
    const r = ek === 'wide' ? .48 : .32;
    paint(ellPts(ex * u, ey * u, r * u, (r + .08) * u, 12), { wash: IND.white, ink: INK, sw: sw * .5 });
    paint(ellPts((ex + (o.lookX || 0) * .12) * u, (ey + .05) * u, (ek === 'wide' ? .15 : .2) * u, (ek === 'wide' ? .18 : .24) * u, 10), { wash: INK, ink: null });
    paint(ellPts((ex - .08) * u, (ey - .08) * u, .07 * u, .07 * u, 6), { wash: IND.white, ink: null });
    if (ek === 'sad') inkLine(P([[ex - .4, ey - .55 + s * .1], [ex + .4, ey - .55 - s * .1]]), sw * .6, INK, 'ink', 0);
  }
  // four tusks: two each side, curving out and up
  rs('tusks');
  for (const s of [-1, 1]) for (const [r0, len, w] of [[1.55, 1.0, .55], [.95, .8, .45]]) {
    const b = [s * r0, -7.2], m = [s * (r0 + .9 * len), -5.8 + (1 - len) * .4], e = [s * (r0 + 1.75 * len), -6.4 - len * .4];
    paint(P(ribbon([b, m, e], w, .1)), { wash: IND.tusk, ink: INK, sw: sw * .55 });
    paint(P(ribbon([[s * r0, -7.25], [s * (r0 + .25), -6.95]], w + .2, w + .2)), { wash: IND.gold, ink: INK, sw: sw * .35 });   // gold caps
  }
  // the trunk: one tapered ribbon with ring creases
  rs('trunk');
  const TP = airavataTrunk(o);
  paint(P(ribbon(TP, 2.0, .95)), { wash: col, fill: dk, fillOp: 25, ink: INK, sw: sw * .85, curv: .3 });
  const C = through(TP);
  for (let i = 3; i < C.length - 2; i += 3) {
    const a = C[i - 1], b = C[i + 1], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1, w = lerp(1.6, .75, i / C.length) * .35;
    inkLine(P([[C[i][0] - dy / d * w, C[i][1] + dx / d * w], [C[i][0] + dy / d * w, C[i][1] - dx / d * w]]), sw * .4, dk, 'inkfine', .3);
  }
  if (o.sweat) { rs('sweat'); paint(P([[4.0, -12.4], [4.4, -11.5], [4.0, -11.1], [3.6, -11.5]]), { wash: '#9ED0F0', ink: INK, sw: sw * .4, curv: .6 }); }
  pop();
  if (o.indra) { const [sx, sy] = airavataSeat(x, y, u, o); indra(sx, sy, u * .95, { boilKey: id + 'r', ...o.indra }); }
}

// Model sheet: studio.html?loop=indra
(() => {
  LOOPS.indra = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: '#BFD3EA', ink: null });
    const c = t % 4, thr = c > 2 ? seg(c, 2, 2.3) : 0;
    airavata(300, 900, 30, { trunk: c < 2 ? 'down' : 'up', earOut: c < 2 ? 0 : 1, eyes: c < 2 ? 'normal' : 'wide', sweat: c > 2,
      indra: { eyes: c < 2 ? 'normal' : 'angry', mouth: c < 2 ? 'smile' : 'shout', handR: thr > 0 ? [lerp(3.0, 3.6, thr), lerp(-7.5, -3.0, thr)] : [2.6, -7.2], vajraA: lerp(-.3, 1.4, thr), vajra: c > 2.3 ? 0 : 1 } });
    airavata(800, 900, 24, { trunk: 'limp', eyes: 'closed', puff: 1, tint: '#7A9AE0', tintK: .7, indra: { eyes: 'closed', mouth: 'puff', puff: 1, tint: '#7A9AE0', tintK: .6, vajra: 0, handR: [1.4, -1], handL: [-1.4, -1] } });
    indra(300, 1500, 40, { bow: .6, mouth: 'sheepish', eyes: 'sad', vajra: 0, handR: [1.0, -3.6], handL: [-1.0, -3.6], sweat: 1 });
    indra(800, 1500, 40, { eyes: 'angry', mouth: 'shout', handR: [2.8, -8.2], vajraA: -.4 });
  };
  LOOPS.indra.len = 4;
})();
