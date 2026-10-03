// menavati.js: Queen Menavati (Mena), Parvati's mother and Himavan's queen: a deep plum saree with a wide gold border and
// a gold-bordered pallu over her left shoulder (screen-right), an ochre-gold blouse, a low bun with two silver-grey
// streaks from the temples, a wide queen's crown, jhumkas, a nath, a gold necklace, gold-and-red bangles, sindoor and a
// bindi. By default she holds a brass aarti thali (a lit diya, marigolds, a kumkum bowl) in both hands.
// Built on Parvati / Brahmacharini (same chibi proportions, arm solver, head scale). Load after bappa.js (U()), clawd.js
// (eyes() / mouth() / emote()), shiva.js (EMO.serene), parvati.js (PRV) and shailputri.js (SHL); feel() / emotions()
// drive her.
// (x, y) is the ground point under her, u the size unit (about 26u tall to the top of the crown).
//
// Body-local coordinates in u (y up is negative): hem -1.2..0 · waist -11.8 · shoulders (±2.6, -16.2) · head centre
// (0, -19.8) · eyes (±1.1, -19.7) · crown -25.2..-22.4 (the head is then scaled 1.18× about the neck at (0, -17.6)) ·
// the thali at (0, -12.7)
//
// Options (all optional):
//   pose:   walk (phase), dx, dy (in u), sq, rot, flip, hx (-1..1 head turn), htilt, lean (u),
//           faint 0..1 (stiff as a plank she tips over backward to screen-left, pivoting at the left of her hem;
//           1 = flat on the floor, ~.6 = propped up), crossed 0..1 (arms folded across the chest)
//   arms:   handL / handR = [x, y] in u, bendL / bendR, armL(u, sw) / armR(u, sw) (hooks at the hands)
//   props:  thali (default true: held in both hands) + flame 0..1 (the diya)
//   face:   eyes, mouth, lookX / lookY, squint, blush, seed, tint + tintK, brows (-1 angry .. +1 raised).
//           'normal' / 'look' / 'wide' / 'angry' / 'determined' are her own almond eyes with lashes, 'closed' / 'happy' /
//           'wink' her own lids; every other kind ('heart', 'swirl', 'x', …) is Clawd's. Mouths: smile (default), flat,
//           teeth, huff (pursed, a cheek puff) are her own; every other kind is Clawd's.
//   extras: emote + emoteK + emoteAge, boilKey, noShadow, swMul
// Helpers: menavatiHand(x, y, u, o, s), menavatiHead(x, y, u, o), menavatiThali(x, y, u, o) → world [x, y];
//          aartiThali(u, sw, flame) draws the thali on its own at (0, 0) (for when it flies).
const MNV = {
  saree: '#6B2F5E', sareeDk: '#4E2045', sareeLt: '#8E4A7E', blouse: '#D9A13A', blouseDk: '#A8761E',
  hair: '#2A2030', hairLt: '#4E4058', grey: '#C9C4CF', bangle: '#C8324A',
  brass: '#E0A93A', brassDk: '#A8741C', brassLt: '#FFE08A', clay: '#B5603A', clayDk: '#83401F', marigold: '#F39A2B', marigoldDk: '#D0701A', kumkum: '#D2283A',
};
const MNV_FAINT_PX = -3.5;   // the pivot of the faint (u, at the ground): the left of her hem

// The aarti thali at (0, 0), seen from a little above: a brass plate with a lit clay diya, marigolds and a kumkum bowl.
function aartiThali(u, sw, flame = 1, INK = SHL.ink) {
  paint(ellPts(0, .12 * u, 3.05 * u, 1 * u, 26), { wash: MNV.brassDk, ink: INK, sw: sw * .7 });   // the rim's depth
  paint(ellPts(0, 0, 3 * u, .9 * u, 26), { wash: MNV.brass, ink: INK, sw: sw * .7 });
  paint(ellPts(0, -.05 * u, 2.45 * u, .66 * u, 22), { fill: MNV.brassDk, fillOp: 70, bleed: .1, tex: .5, ink: null });
  paint(ellPts(-1.3 * u, -.25 * u, .7 * u, .14 * u, 10, 0, -.15), { wash: MNV.brassLt, washOp: 160, ink: null });
  for (const [mx, my] of [[1.55, .1], [1.9, -.25], [-1.75, .2]]) {   // marigold heads
    paint(ellPts(mx * u, my * u, .42 * u, .3 * u, 12, u * .03), { wash: MNV.marigold, ink: INK, sw: sw * .35 });
    paint(ellPts(mx * u, (my - .03) * u, .18 * u, .12 * u, 8), { wash: MNV.marigoldDk, ink: null });
  }
  paint(ellPts(.7 * u, .2 * u, .36 * u, .18 * u, 10), { wash: MNV.kumkum, ink: INK, sw: sw * .35 });   // kumkum bowl
  for (const [gx, gy] of [[-.9, .3], [-.7, .15], [-1.05, .05], [.2, .35]]) paint(ellPts(gx * u, gy * u, .07 * u, .05 * u, 6), { wash: '#FFF4D8', ink: null });   // rice
  // the diya: a clay lamp in the middle, its flame and a little light
  paint(U([[-.75, -.25], [.75, -.25], [.45, .15], [-.45, .15]], u), { wash: MNV.clay, ink: INK, sw: sw * .5, curv: .4 });
  paint(ellPts(0, -.28 * u, .72 * u, .16 * u, 10), { wash: MNV.clayDk, ink: null });
  const f = clamp(flame);
  if (f > .02) {
    const fl = 1 + Math.sin(T * 17) * .08 + Math.sin(T * 29) * .05;
    glow(0, -.9 * u, u * 2.2 * f, '#FFB040', .8 * f);
    paint(U([[0, -.3], [.28, -.6], [.05, -1.3 * fl], [-.24, -.62]], u).map(([a, b]) => [a * f, b * f]), { wash: '#FFC94A', ink: null, curv: .5 });
    paint(U([[0, -.35], [.13, -.55], [.02, -.95 * fl], [-.12, -.56]], u).map(([a, b]) => [a * f, b * f]), { wash: '#FFF2C0', ink: null, curv: .5 });
  }
}

function menavatiArm(o, s) {
  const sh = [s * 2.6, -16.2], cr = clamp(o.crossed || 0), th = o.thali !== false && cr < .3;
  let base = (s < 0 ? o.handL : o.handR) || (th ? [s * 2.75, -12.75] : [s * 3.3, -11.2]);
  base = [lerp(base[0], -s * 1.7, cr), lerp(base[1], s < 0 ? -14 : -13.4, cr)];
  const dx = base[0] - sh[0], dy = base[1] - sh[1], d = Math.hypot(dx, dy) || 1;
  let nx = -dy / d, ny = dx / d; if (nx * s < 0) { nx = -nx; ny = -ny; }
  const b = lerp((s < 0 ? o.bendL : o.bendR) ?? 1, 1.9, cr);
  return [sh, [(sh[0] + base[0]) / 2 + nx * b, (sh[1] + base[1]) / 2 + ny * b], base];
}
// A body-local point of her upper body (u) → world, through lean, squash, flip, rot and the faint.
function menavatiWorld(x, y, u, o, lx, ly) {
  const sq = (o.sq || 0) + (o.take || 0), fx = o.flip ? -1 : 1, l = o.lean || 0, r = l * .035;
  const px = lx + l * .6, py = ly + 11.8, hx = px * Math.cos(r) - py * Math.sin(r), hy = px * Math.sin(r) + py * Math.cos(r) - 11.8;
  let wx = fx * hx * u * (1 + sq * .6), wy = hy * u * (1 - sq);
  const fa = -clamp(o.faint || 0) * Math.PI / 2 * .985, pv = fx * MNV_FAINT_PX * u;   // the faint, about the hem's left edge
  if (fa) { const ax = wx - pv; [wx, wy] = [pv + ax * Math.cos(fa * fx) - wy * Math.sin(fa * fx), ax * Math.sin(fa * fx) + wy * Math.cos(fa * fx)]; }
  const a = o.rot || 0;
  return [x + (o.dx || 0) * u + wx * Math.cos(a) - wy * Math.sin(a), y + (o.dy || 0) * u + wx * Math.sin(a) + wy * Math.cos(a)];
}
function menavatiHand(x, y, u, o, s) { const [, , h] = menavatiArm(o, s); return menavatiWorld(x, y, u, o, h[0], h[1]); }
function menavatiHead(x, y, u, o = {}) { return menavatiWorld(x, y, u, o, clamp(o.hx || 0, -1, 1) * .45, -20.2); }
function menavatiThali(x, y, u, o = {}) { return menavatiWorld(x, y, u, o, 0, -12.7); }

function menavati(x, y, u, o = {}) {
  const id = o.boilKey ?? 'm' + (++CLAWD_N), rs = p => boilSeed(`menavati ${id} ${p}`);
  x += (o.dx || 0) * u;
  const dy = (o.dy || 0) * u, sq = (o.sq || 0) + (o.take || 0), sw = clamp(u / 20, .4, 2) * (o.swMul || 1), J = u * .04;
  const { col, dk, lt } = tintCols({ ...o, col: o.col || PRV.skin, dk: o.dk || PRV.skinDk, lt: o.lt || PRV.skinLt });
  const P = pts => U(pts, u), INK = SHL.ink, wk = o.walk, hx = clamp(o.hx || 0, -1, 1), lean = o.lean || 0;
  const hs = wk == null ? 0 : Math.sin(wk * TAU) * .35, sway = Math.sin(T * 1.6) * .2 + hs * .5;
  const fk = clamp(o.faint || 0), fa = -fk * Math.PI / 2 * .985, cr = clamp(o.crossed || 0), th = o.thali !== false && cr < .3;

  if (!o.noShadow) {
    rs('shadow');
    const sx = (o.flip ? -1 : 1) * lerp(0, -10.5, fk) * u;
    paint(ellPts(x + sx, y + u * .1, u * lerp(5, 12.5, fk) * (1 - Math.min(.5, Math.abs(o.dy || 0) * .05)), u * .95, 22), { fill: PAL.ink, fillOp: 80, bleed: .25, tex: .3, border: .1, ink: null });
  }
  push();
  translate(x, y + dy);
  if (o.rot) rotate(o.rot);
  scale((o.flip ? -1 : 1) * (1 + sq * .6), 1 - sq);
  if (fa) { translate(MNV_FAINT_PX * u, 0); rotate(fa); translate(-MNV_FAINT_PX * u, 0); }
  const headScale = () => { translate(0, -17.6 * u); scale(1.18); translate(0, 17.6 * u); };
  const upper = f => { push(); translate(0, -11.8 * u); rotate(lean * .035); translate(lean * .6 * u, 11.8 * u); f(); pop(); };

  // ---- behind: the bun, and the pallu hanging down her left shoulder (screen-right)
  upper(() => {
    rs('bun');
    push(); translate(hx * .3 * u, 0); headScale();
    paint(ellPts(0, -22.55 * u, 2.05 * u, 1.35 * u, 22, J), { wash: MNV.hair, ink: INK, sw: sw * .8 });
    inkLine(P([[-1.3, -22.9], [0, -23.5], [1.3, -22.9]]), sw * .45, MNV.hairLt, 'inkfine', .5);
    pop();
    rs('pallback');
    const ph = sway * .8;
    paint(ribbon(P([[2.6, -16.4], [3.5 + ph * .3, -14.2], [4 + ph * .7, -11.6], [4.3 + ph * 1.2, -9]]), 2 * u, 2.1 * u), { wash: MNV.saree, fill: MNV.sareeDk, fillOp: 90, tex: .5, ink: INK, sw: sw * .75 });
    inkLine(P([[3.3, -15.9], [4.2 + ph * .3, -13.8], [4.7 + ph * .7, -11.4], [5 + ph * 1.2, -9.1]]), sw * 2.2, PRV.gold, 'ink', .5);
  });

  // ---- feet under the hem, the skirt with its wide gold border
  rs('feet');
  for (const s of [-1, 1]) {
    const l = wk == null ? 0 : Math.max(0, Math.sin((wk + (s < 0 ? 0 : .5)) * TAU)) * .5;
    paint(ellPts((s * 1.1 + (wk == null ? 0 : s * l * .3)) * u, (-.25 - l) * u, .95 * u, .45 * u, 14, J), { wash: col, ink: INK, sw: sw * .7 });
    inkLine(P([[s * 1.1 - .6, -.45 - l], [s * 1.1 + .6, -.45 - l]]), sw * .9, PRV.gold, 'ink', 0);
  }
  rs('skirt');
  const skirt = P([[-2.3, -11.9], [2.3, -11.9], [3, -8.5], [3.8, -4.6], [4.4 + hs * .4, -1.5], [4.7 + hs, -.5], [2.6 + hs * .5, -.35], [0, -.3], [-2.6 + hs * .5, -.35], [-4.7 + hs, -.5], [-4.4 + hs * .4, -1.5], [-3.8, -4.6], [-3, -8.5]]);
  paint(skirt, { wash: MNV.saree, fill: MNV.sareeDk, fillOp: 80, bleed: .06, tex: .7, border: .5, ink: INK, sw: sw * .9, curv: .3 });
  paint(ribbon(P([[-4.6 + hs, -1.25], [-2.2 + hs * .5, -1.05], [0, -1], [2.2 + hs * .5, -1.05], [4.6 + hs, -1.25]]), 1.15 * u, 1.15 * u), { wash: PRV.gold, ink: null });
  inkLine(P([[-4.3 + hs, -1.95], [0, -1.7], [4.3 + hs, -1.95]]), sw * .5, PRV.goldDk, 'inkfine', .5);
  for (const k of [-.5, .1, .6]) inkLine(P([[k * .6, -10.5], [k * 1.2 + hs * .3, -5.5], [k * 1.8 + hs * .5, -2.2]]), sw * .5, MNV.sareeDk, 'inkfine', .5);
  for (let k = 0; k < 5; k++) { const bx = lerp(-3, 3.2, (k + .5) / 5) + hs * .5; paint(ellPts(bx * u, -5.6 * u, .2 * u, .2 * u, 8), { wash: PRV.gold, ink: null }); }   // gold buti

  upper(() => {
    // ---- torso: midriff, blouse, the pallu across the chest, necklace
    rs('torso');
    paint(P([[-2.4, -16.6], [2.4, -16.6], [2.5, -14], [2.2, -11.6], [-2.2, -11.6], [-2.5, -14]]), { wash: col, ink: INK, sw: sw * .8, curv: .3 });
    paint(P([[-2.65, -16.8], [2.65, -16.8], [2.6, -14.6], [1.95, -13.7], [-1.95, -13.7], [-2.6, -14.6]]), { wash: MNV.blouse, ink: INK, sw: sw * .8, curv: .3 });
    rs('pallu');
    paint(ribbon(P([[-2.4, -11.2], [-1.4, -12.8], [.2, -14.6], [1.8, -16.3], [2.7, -16.9]]), 2.4 * u, 1.8 * u), { wash: MNV.saree, fill: MNV.sareeDk, fillOp: 80, tex: .5, ink: INK, sw: sw * .8 });
    inkLine(P([[-2.4, -12.2], [-1, -13.7], [.5, -15.2], [1.7, -16.5]]), sw * 2.4, PRV.gold, 'ink', .5);   // the wide border
    inkLine(P([[-1.8, -11.6], [-.4, -13.1], [1, -14.6], [2.2, -15.9]]), sw * .5, MNV.sareeLt, 'inkfine', .5);
    for (const [bx, by] of [[-.9, -12.4], [.7, -14.2]]) paint(ellPts(bx * u, by * u, .2 * u, .2 * u, 8), { wash: PRV.gold, ink: null });
    rs('neck');
    paint(P([[-.75, -17.9], [.75, -17.9], [.8, -16.7], [-.8, -16.7]]), { wash: col, fill: dk, fillOp: 50, tex: .5, ink: INK, sw: sw * .6 });
    inkLine(P([[-1.6, -17], [-.75, -15.9], [0, -15.6], [.75, -15.9], [1.6, -17]]), sw * 2, PRV.gold, 'ink', .6);
    for (const k of [-.5, 0, .5]) paint(ellPts(k * 1.4 * u, (-15.75 + Math.abs(k) * .5) * u, .2 * u, .26 * u, 8), { wash: MNV.bangle, ink: INK, sw: sw * .3 });

    // ---- head
    push(); translate(hx * .45 * u, 0); headScale();
    if (o.htilt) { translate(0, -17.5 * u); rotate(o.htilt); translate(0, 17.5 * u); }
    rs('head');
    const head = ellPts(0, -19.75 * u, 2.9 * u, 2.75 * u, 30, J);
    paint(head, { wash: col, ink: null });
    paint(ellPts((-1 + hx) * u, -20.8 * u, 1.5 * u, .8 * u, 14, J * 2, -.2), { fill: lt, fillOp: 120, bleed: .2, tex: .85, border: .8, ink: null });
    paint(ellPts(0, -17.65 * u, 2.1 * u, .7 * u, 14, J), { fill: dk, fillOp: 60, bleed: .1, tex: .6, border: .5, ink: null });
    paint(head, { ink: INK, sw });
    rs('jhumka');
    for (const s of [-1, 1]) {
      push(); translate(s * 2.85 * u, -19 * u); rotate(Math.sin(T * 2.4 + s) * .12);
      inkLine([[0, 0], [0, .5 * u]], sw * .5, PRV.goldDk, 'inkfine', 0);
      paint(U([[-.55, 1.35], [0, .45], [.55, 1.35]], u), { wash: PRV.gold, fill: PRV.goldDk, fillOp: 50, ink: INK, sw: sw * .45, curv: .5 });
      for (const k of [-.35, 0, .35]) paint(ellPts(k * u, 1.5 * u, .11 * u, .11 * u, 6), { wash: MNV.bangle, ink: null });
      pop();
    }
    rs('hairfront');   // centre parting, combed smoothly back, two silver streaks from the temples
    paint(P([[-2.95, -19.2], [-3.1, -21], [-2.3, -22.35], [-.6, -22.8], [0, -22.35], [.6, -22.8], [2.3, -22.35], [3.1, -21], [2.95, -19.2], [2.45, -20.6], [1.35, -21.55], [.15, -21.6], [0, -21.95], [-.15, -21.6], [-1.35, -21.55], [-2.45, -20.6]]),
      { wash: MNV.hair, ink: INK, sw: sw * .85, curv: .4 });
    for (const s of [-1, 1]) inkLine(P([[s * 2.75, -20.2], [s * 2.6, -21.3], [s * 1.9, -22.1], [s * 1, -22.45]]), sw * 1.5, MNV.grey, 'ink', .5);
    inkLine(P([[0, -22.45], [0, -21.75]]), sw * 1.1, PRV.sindoor, 'ink', 0);   // sindoor in the parting
    rs('crown');   // a queen's crown: wider and taller than her daughter's
    paint(P([[-2.25, -22.45], [2.25, -22.45], [2.2, -23.6], [1.6, -23.3], [1.2, -24.3], [.6, -23.8], [0, -25.2], [-.6, -23.8], [-1.2, -24.3], [-1.6, -23.3], [-2.2, -23.6]]), { wash: PRV.gold, fill: PRV.goldDk, fillOp: 60, tex: .5, ink: INK, sw: sw * .6, curv: .1 });
    inkLine(P([[-2.15, -22.75], [2.15, -22.75]]), sw * .9, PRV.goldDk, 'inkfine', 0);
    paint(ellPts(0, -23.55 * u, .3 * u, .36 * u, 8), { wash: MNV.bangle, ink: INK, sw: sw * .35 });
    for (const s of [-1, 1]) paint(ellPts(s * 1.2 * u, -23.25 * u, .17 * u, .17 * u, 6), { wash: '#3E9E5A', ink: null });

    push(); translate(hx * .8 * u, 0);
    rs('bindi');
    paint(ellPts(0, -20.6 * u, .22 * u, .22 * u, 8), { wash: SHL.bindi, ink: null });
    if (o.blush) for (const s of [-1, 1]) paint(ellPts(s * 1.8 * u, -18.7 * u, .7 * u, .38 * u, 14), { fill: PAL.rose, fillOp: 160 * clamp(o.blush), bleed: .2, tex: .4, ink: null });
    rs('eyes');
    const kinds = Array.isArray(o.eyes) ? o.eyes : o.eyes === 'wink' ? ['normal', 'closed'] : [o.eyes || 'normal', o.eyes || 'normal'];
    const own = k => ['normal', 'look', 'wide', 'closed', 'happy', 'angry', 'determined'].includes(k);
    if (kinds.every(own)) {
      const lx = (o.lookX || 0) * u * .2, ly = (o.lookY || 0) * u * .15;
      const blink = ((T * .9 + (o.seed || 0) * 1.7 + .4) % 3.1) < .12;
      [-1, 1].forEach((s, i) => {
        const k0 = (o.squint || 0) > .5 ? 'closed' : kinds[i], k = k0 === 'angry' || k0 === 'determined' ? 'normal' : k0;
        const b = clamp(o.brows ?? (k0 === 'angry' ? -1 : k0 === 'determined' ? -.55 : k === 'wide' ? .8 : 0), -1, 1);
        const ex = s * 1.1 * u, ey = -19.7 * u, wide = k === 'wide', closed = k === 'closed' || k === 'happy' || blink;
        const bi = -20.6 - .38 * b, bo = -20.65 + (b < 0 ? .3 * b : -.25 * b);
        inkLine(P([[s * .5, bi], [s * 1.1, (bi + bo) / 2 - .12], [s * 1.75, bo]]), sw * (b < 0 ? .6 + .65 * -b : .6), MNV.hair, b < 0 ? 'ink' : 'inkfine', .5);
        if (closed) {
          const c = k === 'happy' ? -.25 : .2;
          inkLine([[ex - .55 * u, ey], [ex, ey + c * u], [ex + .55 * u, ey]], sw * 1.1, INK, 'ink', .5);
          inkLine([[ex + s * .5 * u, ey], [ex + s * .75 * u, ey - .15 * u]], sw * .6, INK, 'inkfine', 0);
          return;
        }
        const rx = (wide ? .64 : .55) * u, ry = (wide ? .62 : .4) * u;
        paint(ellPts(ex, ey, rx, ry, 16), { wash: SHL.white, ink: null });
        const pr = wide ? .24 : .3;
        paint(ellPts(ex + lx, ey + ly, pr * u, (pr + .06) * u, 12), { wash: SHL.eye, ink: null });
        paint(ellPts(ex + lx - .1 * u, ey + ly - .12 * u, .1 * u, .11 * u, 8), { wash: SHL.white, ink: null });
        const kA = clamp(-b);
        if (kA > .05) {
          const A = [ex - s * rx * 1.4, ey - ry * 1.6], Bp = [ex - s * rx * 1.4, ey - ry * (1 - 1.15 * kA)], C = [ex + s * rx * 1.4, ey - ry * (1 - .1 * kA)], D = [ex + s * rx * 1.4, ey - ry * 1.6];
          paint([A, Bp, C, D], { wash: col, ink: null });
          inkLine([[Bp[0], Bp[1] + ry * .05], [ex, (Bp[1] + C[1]) / 2], [C[0], C[1]]], sw * 1.5, INK, 'ink', .5);
          return;
        }
        inkLine([[ex - rx * 1.05, ey + ry * .1], [ex - rx * .3, ey - ry * 1.05], [ex + rx * .5, ey - ry * 1], [ex + rx * 1.15, ey - ry * .3], [ex + s * rx * 1.4, ey - ry * .8]].map(([a, bb]) => [s < 0 ? 2 * ex - a : a, bb]), sw * 1.2, INK, 'ink', .5);
      });
    } else { push(); translate(0, -19.7 * u); scale(.44); translate(0, 6 * u); eyes(u, o, sw / .44 * .85, [-1, 1], 0); pop(); }
    rs('nose');
    inkLine(P([[.02, -19.2], [-.08, -18.85], [.12, -18.75]]), sw * .5, PRV.skinDk, 'inkfine', .5);
    rs('nath');   // a small gold nose ring on her left nostril (screen-right), with a red bead
    inkLine(ellPts(.3 * u, -18.68 * u, .2 * u, .2 * u, 12).slice(1, 10), sw * .5, PRV.gold, 'inkfine', .5);
    paint(ellPts(.3 * u, -18.48 * u, .07 * u, .07 * u, 6), { wash: MNV.bangle, ink: null });
    rs('mouth');
    if (!o.mouth || o.mouth === 'smile') {
      paint(P([[-.5, -18.3], [0, -18.05], [.5, -18.3], [0, -18.18]]), { wash: SHL.lip, ink: null, curv: .5 });
      inkLine(P([[-.55, -18.32], [0, -18.02], [.55, -18.32]]), sw * .6, INK, 'inkfine', .6);
    } else if (o.mouth === 'flat') {
      inkLine(P([[-.5, -18.15], [0, -18.12], [.5, -18.15]]), sw * .7, INK, 'inkfine', .3);
    } else if (o.mouth === 'teeth') {
      paint(P([[-.7, -18.05], [-.55, -18.5], [0, -18.62], [.55, -18.5], [.7, -18.05], [0, -17.95]]), { wash: SHL.white, ink: INK, sw: sw * .7, curv: .3 });
      for (const tx of [-.3, 0, .3]) inkLine(P([[tx, -18.55], [tx, -18.03]]), sw * .35, PRV.skinDk, 'inkfine', 0);
    } else if (o.mouth === 'huff') {   // lips pursed to one side, a puffed cheek
      paint(ellPts(.35 * u, -18.2 * u, .22 * u, .18 * u, 8), { wash: SHL.lip, ink: INK, sw: sw * .5 });
      paint(ellPts(1.5 * u, -18.5 * u, .75 * u, .55 * u, 12), { fill: PAL.rose, fillOp: 90, bleed: .2, tex: .4, ink: null });
    } else { push(); translate(0, -18.3 * u); scale(.36); translate(0, 4.3 * u); mouth(u, o.mouth, sw / .36 * .8); pop(); }
    pop();
    pop();

    // ---- arms, then the thali, then the hands on its rim
    const arms = [-1, 1].map(s => menavatiArm(o, s));
    const drawArm = (s, [sh, el, ha]) => {
      rs('arm' + s);
      paint(ribbon(P([sh, el, ha]), 1.1 * u, .78 * u), { wash: col, fill: dk, fillOp: 40, tex: .5, ink: INK, sw: sw * .8 });
      const d = Math.hypot(ha[0] - el[0], ha[1] - el[1]) || 1, nx = -(ha[1] - el[1]) / d * .47, ny = (ha[0] - el[0]) / d * .47;
      for (const [k, c] of [[.64, MNV.bangle], [.72, PRV.gold], [.8, MNV.bangle], [.87, PRV.gold]]) { const bx = lerp(el[0], ha[0], k), by = lerp(el[1], ha[1], k); inkLine(P([[bx - nx, by - ny], [bx + nx, by + ny]]), sw * 1.1, c, 'ink', 0); }
    };
    const drawHand = (s, ha) => {
      rs('hand' + s);
      push(); translate(ha[0] * u, ha[1] * u);
      paint(ellPts(0, 0, .6 * u, .55 * u, 14, J), { wash: col, ink: INK, sw: sw * .7 });
      const hook = s < 0 ? o.armL : o.armR; if (hook) hook(u, sw);
      pop();
    };
    // crossed: the screen-right arm folds over the screen-left one
    const order = cr > .3 ? [1, -1] : [-1, 1];
    for (const s of order) { drawArm(s, arms[s < 0 ? 0 : 1]); if (!th) drawHand(s, arms[s < 0 ? 0 : 1][2]); }
    if (th) {
      rs('thali');
      push(); translate(0, -12.7 * u); aartiThali(u, sw, o.flame ?? 1); pop();
      for (const s of [-1, 1]) drawHand(s, arms[s < 0 ? 0 : 1][2]);
    }
  });
  pop();

  if (o.emote) {
    rs('emote');
    const top = EMOTE_TOP.includes(o.emote), dir = o.flip ? -1 : 1;
    if (fk > .2) { const [ex, ey] = menavatiHead(x - (o.dx || 0) * u, y, u, o); emote(o.emote, ex, ey - 5.5 * u, u * 1.1, o.emoteK ?? 1, o.emoteAge ?? T); }
    else emote(o.emote, top ? x : x + dir * 4.8 * u, y + dy + (top ? -28 : -22) * u * (1 - sq), u * 1.1, o.emoteK ?? 1, o.emoteAge ?? T);
  }
  rs('after');
}

// Model sheet: studio.html?loop=menavati, or node render.mjs --loop=menavati --sheet=0.5 --cols=1 --w=720
(() => {
  LOOPS.menavati = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: '#E9D3B8', ink: null });
    const CW = 540, CH = 640, cell = i => [(i % 2) * CW, Math.floor(i / 2) * CH];
    const bg = (i, c) => { const [cx, cy] = cell(i); paint(rectPts(cx, cy, CW, CH), { wash: c, ink: null }); };
    bg(1, '#4A3F78'); bg(4, '#4A3F78');
    const poses = [
      ['gentle', 21, {}],
      ['gentle', 21, { eyes: 'wide', mouth: 'O', take: .1 }],
      ['ko', 18, { faint: 1, eyes: 'swirl', mouth: 'wobble', thali: false, dx: 7 }],
      ['angry', 21, { crossed: 1, mouth: 'huff', hx: -.3, lookX: -1 }],
      ['love', 21, { eyes: 'heart', blush: 1, thali: false, faint: .55, dx: 6 }],
      ['gentle', 46, { hx: .15 }],
    ];
    poses.forEach(([name, u, over], i) => {
      const [cx, cy] = cell(i), gx = cx + CW / 2, gy = i === 5 ? 2500 : cy + CH - 60;
      menavati(gx, gy, u, { ...feel(name, t + i * .3, { seed: i }), ...PRV_SKIN, noShadow: i === 5, ...over });
    });
  };
  LOOPS.menavati.len = 4;
})();
