// brahmacharini.js: Maa Brahmacharini, the second Navadurga and the tapasvini Aparna: a plain saffron cotton saree with only
// a thin darker edge, the pallu over her left shoulder (screen-right), a deeper saffron blouse, NO jewellery: a long
// rudraksha mala round her neck, rudraksha bead earrings, a rudraksha string wound round her high topknot, a red bindi,
// barefoot. A japa mala hangs from her right hand (screen-left) and a kamandalu from her left (screen-right).
// Built on Parvati and Shailputri (same chibi proportions, arm solver, head scale). Load after bappa.js (U()), clawd.js
// (eyes() / mouth() / emote()), shiva.js (EMO.serene), parvati.js and shailputri.js (SHL, PRV); feel() / emotions() drive her.
// (x, y) is the ground point under her, u the size unit (about 26u tall standing, ~25u to the top of the topknot).
//
// Body-local coordinates in u (y up is negative): hem -1.2..0 · waist -11.8 · shoulders (±2.6, -16.2) · head centre
// (0, -19.8) · eyes (±1.1, -19.7) · topknot -24.1..-22.3 (the head is then scaled 1.18× about the neck at (0, -17.6))
//
// Options (all optional):
//   pose:   walk (phase), dx, dy (in u), sq, rot, flip, hx (-1..1 head turn), htilt, lean (u),
//           oneFoot 0..1 (tree pose: stands on one foot, the drape kinks out at a bent knee toward screen-right)
//   arms:   handL / handR = [x, y] in u, bendL / bendR, armL(u, sw) / armR(u, sw) (upright hooks),
//           pray 0..1 (both palms joined above the head; the props shrink away by pray .5)
//   props:  mala (default true, in handL) + malaSwing (-1..1), pot (default true, in handR)
//   aura:   0..1 a warm gold light behind her (glows, plus a painted ring behind the head from .3). Draw is automatic and
//           comes first, so call brahmacharini() BEFORE anything that should sit in front of the light.
//   face:   eyes, mouth, lookX / lookY, squint, blush, seed, tint + tintK, brows (-1 angry, down-in .. +1 raised).
//           'normal' / 'look' / 'wide' / 'angry' / 'determined' are her own almond eyes with lashes (angry and determined
//           set the brows), 'closed' / 'happy' / 'wink' her own lids; every other kind is Clawd's. Mouths: smile (default),
//           flat, teeth (her own); every other kind is Clawd's.
//   extras: emote + emoteK + emoteAge, boilKey, noShadow, swMul
// Helpers: brahmachariniHand(x, y, u, o, s) (s = -1 left / +1 right) and brahmachariniHead(x, y, u, o) → world [x, y].
const BRC = {
  saree: '#E8873A', sareeDk: '#C5652A', sareeLt: '#F4A866', blouse: '#D9702A', blouseDk: '#B4521C',
  rud: '#7A4A2E', rudDk: '#5A3420', rudLt: '#A87650', copper: '#C9783A', copperLt: '#E8A55A', copperDk: '#8E4E22',
};

// His own calm moods are shared (EMO.gentle / delight / serene); nothing new is needed for her.

// Rudraksha beads strung along a path (px points): a thin string and n alternately brown beads.
function rudBeads(path, n, r, sw, INK, string = true) {
  const C = through(path), L = [0];
  for (let i = 1; i < C.length; i++) L.push(L[i - 1] + Math.hypot(C[i][0] - C[i - 1][0], C[i][1] - C[i - 1][1]));
  const tot = L[L.length - 1] || 1;
  if (string) inkLine(C, sw * .45, BRC.rudDk, 'inkfine', .3);
  let j = 0;
  for (let i = 0; i < n; i++) {
    const d = (i + .5) / n * tot; while (j < L.length - 2 && L[j + 1] < d) j++;
    const k = clamp((d - L[j]) / ((L[j + 1] - L[j]) || 1)), bx = lerp(C[j][0], C[j + 1][0], k), by = lerp(C[j][1], C[j + 1][1], k);
    paint(ellPts(bx, by, r, r * 1.05, 8), { wash: i % 2 ? BRC.rudDk : BRC.rud, ink: INK, sw });
  }
}
// The japa mala, hanging from the fingers at (0, 0): a loop of beads that ends in a tassel, swinging by `a`.
function japaMala(u, sw, a = 0, INK = SHL.ink) {
  push(); rotate(a);
  const loop = []; for (let i = 0; i <= 14; i++) { const t = i / 14 * TAU - Math.PI / 2; loop.push([Math.cos(t) * .8 * u, (2.15 + Math.sin(t) * 2.05) * u]); }
  rudBeads(loop, 14, .27 * u, sw * .35, INK, false);
  inkLine(loop, sw * .35, BRC.rudDk, 'inkfine', .3);
  for (const s of [-1, 0, 1]) inkLine(U([[s * .08, 4.2], [s * .3, 5.2]], u), sw * .5, BRC.sareeDk, 'inkfine', 0);   // tassel strands
  paint(ellPts(0, 4.35 * u, .3 * u, .36 * u, 8), { wash: BRC.sareeDk, ink: INK, sw: sw * .4 });
  paint(ellPts(0, 4.05 * u, .34 * u, .34 * u, 8), { wash: BRC.rud, ink: INK, sw: sw * .35 });   // the guru bead
  pop();
}
// The kamandalu, held by its loop handle at (0, 0): a round copper-brass pot with a short spout.
function kamandalu(u, sw, a = 0, INK = SHL.ink) {
  push(); rotate(a);
  inkLine(U([[-.55, 1.7], [-.5, .75], [0, .15], [.5, .75], [.55, 1.7]], u), sw * 2.3, BRC.copperDk, 'ink', .5);   // the loop handle
  paint(ribbon(U([[.9, 2.5], [1.55, 1.95], [2.1, 1.35]], u), .6 * u, .38 * u), { wash: BRC.copper, ink: INK, sw: sw * .6 });   // spout
  paint(ellPts(2.12 * u, 1.3 * u, .22 * u, .12 * u, 8), { wash: BRC.copperDk, ink: INK, sw: sw * .3 });
  paint(U([[-.7, 1.55], [.7, 1.55], [.55, 2], [-.55, 2]], u), { wash: BRC.copperDk, ink: INK, sw: sw * .6, curv: .3 });   // collar
  paint(ellPts(0, 3 * u, 1.45 * u, 1.3 * u, 22), { wash: BRC.copper, ink: INK, sw: sw * .85 });   // the belly
  paint(ellPts(.35 * u, 3.5 * u, 1.15 * u, .7 * u, 14), { fill: BRC.copperDk, fillOp: 90, bleed: .1, tex: .6, border: .5, ink: null });   // shade below
  paint(ellPts(-.55 * u, 2.45 * u, .38 * u, .55 * u, 10, 0, .5), { wash: BRC.copperLt, ink: null });   // highlight
  inkLine(U([[-1.35, 3.1], [-.6, 3.5], [.6, 3.5], [1.35, 3.1]], u), sw * .6, BRC.copperDk, 'inkfine', .5);   // a band round the belly
  paint(ellPts(0, 4.2 * u, .75 * u, .22 * u, 10), { wash: BRC.copperDk, ink: INK, sw: sw * .4 });   // the foot
  pop();
}

function brahmachariniArm(o, s) {
  const sh = [s * 2.6, -16.2], pr = clamp(o.pray || 0);
  const base = (s < 0 ? o.handL : o.handR) || (s < 0 ? [-4.2, -14.2] : [4.3, -14.2]);
  const ha = [lerp(base[0], s * .3, pr), lerp(base[1], -28.2, pr)];
  const dx = ha[0] - sh[0], dy = ha[1] - sh[1], d = Math.hypot(dx, dy) || 1;
  let nx = -dy / d, ny = dx / d; if (nx * s < 0) { nx = -nx; ny = -ny; }
  const b = lerp((s < 0 ? o.bendL : o.bendR) ?? 1, 2.7, pr);
  return [sh, [(sh[0] + ha[0]) / 2 + nx * b, (sh[1] + ha[1]) / 2 + ny * b], ha];
}
// A body-local point of her upper body (u) → world, through lean, squash, flip and rot.
function brahmachariniWorld(x, y, u, o, lx, ly) {
  const sq = (o.sq || 0) + (o.take || 0), fx = o.flip ? -1 : 1, l = o.lean || 0, r = l * .035;
  const px = lx + l * .6, py = ly + 11.8, hx = px * Math.cos(r) - py * Math.sin(r), hy = px * Math.sin(r) + py * Math.cos(r) - 11.8;
  const wx = fx * hx * u * (1 + sq * .6), wy = hy * u * (1 - sq), a = o.rot || 0;
  return [x + (o.dx || 0) * u + wx * Math.cos(a) - wy * Math.sin(a), y + (o.dy || 0) * u + wx * Math.sin(a) + wy * Math.cos(a)];
}
function brahmachariniHand(x, y, u, o, s) { const [, , h] = brahmachariniArm(o, s); return brahmachariniWorld(x, y, u, o, h[0], h[1]); }
// the head centre (the scaled head sits at about y -20.2)
function brahmachariniHead(x, y, u, o = {}) { return brahmachariniWorld(x, y, u, o, clamp(o.hx || 0, -1, 1) * .45, -20.2); }

function brahmacharini(x, y, u, o = {}) {
  const id = o.boilKey ?? 'b' + (++CLAWD_N), rs = p => boilSeed(`brahmacharini ${id} ${p}`);
  const ox = x, oy = y;   // the ground point before dx / dy
  x += (o.dx || 0) * u;
  const dy = (o.dy || 0) * u, sq = (o.sq || 0) + (o.take || 0), sw = clamp(u / 20, .4, 2) * (o.swMul || 1), J = u * .04;
  const { col, dk } = tintCols({ ...o, col: o.col || SHL.skin, dk: o.dk || SHL.skinDk, lt: o.lt || SHL.skinLt });
  const P = pts => U(pts, u), INK = SHL.ink, wk = o.walk, hx = clamp(o.hx || 0, -1, 1), lean = o.lean || 0;
  const hs = wk == null ? 0 : Math.sin(wk * TAU) * .35;   // hem swing
  const of = clamp(o.oneFoot || 0), pray = clamp(o.pray || 0), sway = Math.sin(T * 1.6) * .22 + hs * .5;
  const wo = { ...o, dx: 0, dy: 0 };

  // ---- the aura first: warm light behind her, and a painted ring round the head from .3
  const au = clamp(o.aura || 0);
  if (au > .01) {
    rs('aura');
    const [bx, by] = brahmachariniWorld(x, y + dy, u, { ...wo, dy: 0 }, 0, -14), [hx0, hy0] = brahmachariniHead(x, y + dy, u, { ...wo, dy: 0 });
    glow(bx, by, u * (13 + 17 * au), '#FFAE45', au * .85);
    glow(bx, by, u * (8 + 9 * au), '#FFD27A', au);
    glow(hx0, hy0, u * (5.5 + 5 * au), '#FFF0B8', au * .95);
    const k = clamp((au - .3) / .7);
    if (k > .01) {
      const R = u * 5.4;
      paint(ellPts(hx0, hy0, R, R, 30), { fill: '#FFE9A8', fillOp: 70 * k, bleed: .3, tex: .3, ink: null });
      for (const [j, c, w] of [[0, '#F3B93E', 3.2], [.2, '#FFE39A', 2.2], [.42, '#FFF4CF', 1.2]])
        { const rr = R + j * u * .3 - u * .2, e = ellPts(hx0, hy0, rr, rr, 34, J); inkLine([...e, e[0], e[1]], sw * w * k, c, 'ink', .5); }
    }
  }

  if (!o.noShadow) { rs('shadow'); paint(ellPts(x, y + u * .1, u * 5 * (1 - Math.min(.5, Math.abs(o.dy || 0) * .05)), u * .95, 22), { fill: PAL.ink, fillOp: 80, bleed: .25, tex: .3, border: .1, ink: null }); }
  push();
  translate(x, y + dy);
  if (o.rot) rotate(o.rot);
  scale((o.flip ? -1 : 1) * (1 + sq * .6), 1 - sq);
  const headScale = () => { translate(0, -17.6 * u); scale(1.18); translate(0, 17.6 * u); };
  const upper = f => { push(); translate(0, -11.8 * u); rotate(lean * .035); translate(lean * .6 * u, 11.8 * u); f(); pop(); };

  // ---- behind: the pallu hanging down her left shoulder (screen-right)
  upper(() => {
    rs('pallback');
    const ph = sway * .8;
    paint(ribbon(P([[2.6, -16.4], [3.5 + ph * .3, -14.2], [4 + ph * .7, -11.6], [4.3 + ph * 1.2, -9]]), 2 * u, 2.1 * u), { wash: BRC.saree, fill: BRC.sareeDk, fillOp: 90, tex: .5, ink: INK, sw: sw * .75 });
    inkLine(P([[3.2, -15.8], [4.1 + ph * .3, -13.8], [4.55 + ph * .7, -11.4], [4.85 + ph * 1.2, -9.1]]), sw * 1.1, BRC.sareeDk, 'ink', .5);
  });

  // ---- barefoot, and the plain saree skirt
  rs('feet');
  for (const s of [-1, 1]) {
    const l = wk == null ? 0 : Math.max(0, Math.sin((wk + (s < 0 ? 0 : .5)) * TAU)) * .5;
    const fx = lerp(s * 1.1 + (wk == null ? 0 : s * l * .3), s < 0 ? -.1 : 1.5, of), fy = -.25 - l - (s > 0 ? of * 7 : 0);
    paint(ellPts(fx * u, fy * u, .95 * u, .45 * u, 14, J), { wash: col, ink: INK, sw: sw * .7 });
    inkLine(P([[fx - .55, fy - .12], [fx + .55, fy - .12]]), sw * .45, dk, 'inkfine', 0);   // the toes
  }
  rs('skirt');
  const N = [[-2.2, -11.9], [2.2, -11.9], [2.55, -10.2], [2.9, -8.5], [3.3, -6.5], [3.7, -4.6], [4.3 + hs * .4, -1.5], [4.6 + hs, -.5], [2.6 + hs * .5, -.35], [0, -.3], [-2.6 + hs * .5, -.35], [-4.6 + hs, -.5], [-4.3 + hs * .4, -1.5], [-3.7, -4.6], [-3.3, -6.5], [-2.9, -8.5], [-2.55, -10.2]];
  const Ot = [[-2.2, -11.9], [2.2, -11.9], [3.6, -10.3], [5, -8.4], [5.5, -6.9], [4.5, -5.4], [3.2, -3], [2.7, -.6], [1.6, -.35], [-.1, -.3], [-1.7, -.35], [-2.6, -.5], [-2.9, -1.5], [-3.1, -4.6], [-3, -6.5], [-2.8, -8.5], [-2.4, -10.2]];
  const S = N.map((p, i) => [lerp(p[0], Ot[i][0], of), lerp(p[1], Ot[i][1], of)]);
  paint(P(S), { wash: BRC.saree, fill: BRC.sareeDk, fillOp: 90, bleed: .06, tex: .7, border: .5, ink: INK, sw: sw * .9, curv: .3 });
  inkLine(P([S[11], S[10], S[9], S[8], S[7]].map(p => [p[0], p[1] - .3])), sw * 1.2, BRC.sareeDk, 'ink', .4);   // the thin darker edge
  for (const k of [-.5, .1, .6]) inkLine(P([[k * .6, -10.5], [k * 1.2 + hs * .3, -5.5], [k * 1.8 + hs * .5, -1.5]]), sw * .5, BRC.sareeDk, 'inkfine', .5);
  inkLine(P([[-.9, -10.8], [-1.6 + hs * .3, -6], [-1.9 + hs * .4, -2.2]]), sw * .5, BRC.sareeLt, 'inkfine', .5);
  if (of > .3) {   // the knee fold of the raised leg
    inkLine(P([[2.2, -9.4], [3.6, -8.6], [4.9, -7.4]]), sw * .6 * of, BRC.sareeDk, 'inkfine', .5);
    inkLine(P([[2.5, -5.8], [3.6, -6.2], [4.4, -6.1]]), sw * .5 * of, BRC.sareeDk, 'inkfine', .5);
    inkLine(P([[2.3, -9.2], [2.6, -6.5], [2.7, -3.4]]), sw * .5 * of, BRC.sareeLt, 'inkfine', .5);
  }

  upper(() => {
    // ---- torso: midriff, deeper saffron blouse, the pallu across the chest, the long mala
    rs('torso');
    paint(P([[-2.3, -16.6], [2.3, -16.6], [2.4, -14], [2.1, -11.6], [-2.1, -11.6], [-2.4, -14]]), { wash: col, ink: INK, sw: sw * .8, curv: .3 });
    paint(P([[-2.6, -16.8], [2.6, -16.8], [2.55, -14.6], [1.9, -13.7], [-1.9, -13.7], [-2.55, -14.6]]), { wash: BRC.blouse, ink: INK, sw: sw * .8, curv: .3 });
    inkLine(P([[-1.9, -13.95], [0, -13.8], [1.9, -13.95]]), sw * .5, BRC.blouseDk, 'inkfine', .5);
    rs('pallu');
    paint(ribbon(P([[-2.3, -11.2], [-1.4, -12.8], [.2, -14.6], [1.8, -16.3], [2.7, -16.9]]), 2.3 * u, 1.7 * u), { wash: BRC.saree, fill: BRC.sareeDk, fillOp: 80, tex: .5, ink: INK, sw: sw * .8 });
    inkLine(P([[-2.2, -12.4], [-.8, -13.9], [.6, -15.4], [1.8, -16.6]]), sw * 1.1, BRC.sareeDk, 'ink', .5);   // its thin edge
    inkLine(P([[-1.8, -11.9], [-.5, -13.2], [.9, -14.7]]), sw * .6, BRC.sareeLt, 'inkfine', .5);
    rs('neck');
    paint(P([[-.75, -17.9], [.75, -17.9], [.8, -16.7], [-.8, -16.7]]), { wash: col, ink: INK, sw: sw * .6 });
    rs('mala');
    const m = Math.sin(T * 1.7) * .12;
    rudBeads(P([[-1.4, -17], [-1.85, -15.4], [-1.45, -13.4], [-.5 + m * .3, -12.1], [.3 + m, -11.95], [1.3 + m * .5, -13.2], [1.8, -15.3], [1.4, -17]]), 19, .3 * u, sw * .35, INK);
    paint(ellPts((.3 + m) * u, -11.55 * u, .22 * u, .3 * u, 8), { wash: BRC.sareeDk, ink: INK, sw: sw * .3 });

    // ---- head
    push(); translate(hx * .45 * u, 0); headScale();
    if (o.htilt) { translate(0, -17.5 * u); rotate(o.htilt); translate(0, 17.5 * u); }
    rs('head');
    const head = ellPts(0, -19.8 * u, 2.8 * u, 2.75 * u, 30, J);
    paint(head, { wash: col, ink: null });
    paint(ellPts(0, -17.7 * u, 2 * u, .7 * u, 14, J), { fill: dk, fillOp: 60, bleed: .1, tex: .6, border: .5, ink: null });
    paint(head, { ink: INK, sw });
    rs('earring');   // small rudraksha beads on the lobes
    for (const s of [-1, 1]) {
      push(); translate(s * 2.75 * u, -19 * u); rotate(Math.sin(T * 2.4 + s) * .12);
      inkLine([[0, 0], [0, .35 * u]], sw * .45, BRC.rudDk, 'inkfine', 0);
      paint(ellPts(0, .75 * u, .34 * u, .36 * u, 8), { wash: BRC.rud, ink: INK, sw: sw * .4 });
      paint(ellPts(-.1 * u, .65 * u, .1 * u, .1 * u, 6), { wash: BRC.rudLt, ink: null });
      pop();
    }
    rs('hairfront');   // hair pulled smoothly back from the forehead
    paint(P([[-2.85, -18.6], [-3.15, -20.4], [-2.9, -21.7], [-2.1, -22.55], [0, -22.95], [2.1, -22.55], [2.9, -21.7], [3.15, -20.4], [2.85, -18.6], [2.5, -20.3], [1.7, -21.4], [0, -21.8], [-1.7, -21.4], [-2.5, -20.3]]),
      { wash: SHL.hair, ink: INK, sw: sw * .85, curv: .4 });
    inkLine(P([[-2.2, -21.7], [-1.2, -22.3], [-.2, -22.5]]), sw * .45, SHL.hairLt, 'inkfine', .5);
    rs('strands');   // a couple of loose strands by the ears
    const st = Math.sin(T * 1.9) * .12;
    paint(ribbon(P([[-2.55, -21.1], [-3.05 + st, -19.7], [-2.95 + st * 1.5, -18.1], [-2.55 + st * 2, -16.9]]), .5 * u, .1 * u), { wash: SHL.hair, ink: INK, sw: sw * .35 });
    paint(ribbon(P([[2.55, -21.1], [3.05 - st, -19.8], [3, -18.4], [2.7 - st, -17.4]]), .45 * u, .1 * u), { wash: SHL.hair, ink: INK, sw: sw * .35 });
    rs('topknot');   // the jata-style bun on top, bound with a rudraksha string
    push(); translate(hx * .25 * u, 0);
    paint(P([[-.95, -22.7], [.95, -22.7], [.8, -23.1], [-.8, -23.1]]), { wash: SHL.hair, ink: null });
    paint(ellPts(0, -23.5 * u, 1.28 * u, 1.05 * u, 20, J), { wash: SHL.hair, ink: INK, sw: sw * .85 });
    paint(ellPts(.05 * u, -24 * u, .55 * u, .4 * u, 10, 0, -.3), { wash: SHL.hairLt, washOp: 150, ink: null });
    for (const [a, b, c, d] of [[-.95, -23.7, -.2, -24.4], [.8, -23.8, .15, -24.5], [-.5, -22.9, .6, -24.1]]) inkLine(P([[a, b], [(a + c) / 2 + .2, (b + d) / 2 - .05], [c, d]]), sw * .45, SHL.hairLt, 'inkfine', .5);
    rudBeads(P([[-1.2, -23.15], [-.4, -22.85], [.5, -22.85], [1.2, -23.15]]), 5, .19 * u, sw * .3, INK);
    rudBeads(P([[-1.15, -24.05], [-.4, -23.75], [.5, -23.75], [1.15, -24.05]]), 5, .19 * u, sw * .3, INK);
    pop();

    push(); translate(hx * .8 * u, 0);
    rs('bindi');
    paint(ellPts(0, -20.6 * u, .2 * u, .2 * u, 8), { wash: SHL.bindi, ink: null });
    if (o.blush) for (const s of [-1, 1]) paint(ellPts(s * 1.75 * u, -18.7 * u, .65 * u, .35 * u, 14), { fill: PAL.rose, fillOp: 150 * clamp(o.blush), bleed: .2, tex: .4, ink: null });
    rs('eyes');
    const kinds = Array.isArray(o.eyes) ? o.eyes : o.eyes === 'wink' ? ['normal', 'closed'] : [o.eyes || 'normal', o.eyes || 'normal'];
    const own = k => ['normal', 'look', 'wide', 'closed', 'happy', 'angry', 'determined'].includes(k);
    if (kinds.every(own)) {
      const lx = (o.lookX || 0) * u * .2, ly = (o.lookY || 0) * u * .15;
      const blink = ((T * .9 + (o.seed || 0) * 1.7 + 1.6) % 3.3) < .12;
      [-1, 1].forEach((s, i) => {
        const k0 = (o.squint || 0) > .5 ? 'closed' : kinds[i], k = k0 === 'angry' || k0 === 'determined' ? 'normal' : k0;
        const b = clamp(o.brows ?? (k0 === 'angry' ? -1 : k0 === 'determined' ? -.55 : 0), -1, 1);
        const ex = s * 1.1 * u, ey = -19.7 * u, wide = k === 'wide', closed = k === 'closed' || k === 'happy' || blink;
        const bi = -20.6 - .38 * b, bo = -20.65 + (b < 0 ? .3 * b : -.25 * b);   // brow: inner and outer ends
        inkLine(P([[s * .5, bi], [s * 1.1, (bi + bo) / 2 - .12], [s * 1.75, bo]]), sw * (b < 0 ? .55 + .65 * -b : .55), SHL.hair, b < 0 ? 'ink' : 'inkfine', .5);
        if (closed) {
          const c = k === 'happy' ? -.25 : .2;
          inkLine([[ex - .55 * u, ey], [ex, ey + c * u], [ex + .55 * u, ey]], sw * 1.1, INK, 'ink', .5);
          inkLine([[ex + s * .5 * u, ey], [ex + s * .75 * u, ey - .15 * u]], sw * .6, INK, 'inkfine', 0);
          return;
        }
        const rx = (wide ? .62 : .55) * u, ry = (wide ? .58 : .4) * u;
        paint(ellPts(ex, ey, rx, ry, 16), { wash: SHL.white, ink: null });
        paint(ellPts(ex + lx, ey + ly, .3 * u, .36 * u, 12), { wash: SHL.eye, ink: null });
        paint(ellPts(ex + lx - .1 * u, ey + ly - .12 * u, .1 * u, .11 * u, 8), { wash: SHL.white, ink: null });
        const kA = clamp(-b);
        if (kA > .05) {   // angry: the lid slants down toward the nose
          const A = [ex - s * rx * 1.4, ey - ry * 1.6], Bp = [ex - s * rx * 1.4, ey - ry * (1 - 1.15 * kA)], C = [ex + s * rx * 1.4, ey - ry * (1 - .1 * kA)], D = [ex + s * rx * 1.4, ey - ry * 1.6];
          paint([A, Bp, C, D], { wash: col, ink: null });
          inkLine([[Bp[0], Bp[1] + ry * .05], [ex, (Bp[1] + C[1]) / 2], [C[0], C[1]]], sw * 1.5, INK, 'ink', .5);
          return;
        }
        inkLine([[ex - rx * 1.05, ey + ry * .1], [ex - rx * .3, ey - ry * 1.05], [ex + rx * .5, ey - ry * 1], [ex + rx * 1.15, ey - ry * .3], [ex + s * rx * 1.4, ey - ry * .8]].map(([a, bb]) => [s < 0 ? 2 * ex - a : a, bb]), sw * 1.2, INK, 'ink', .5);
      });
    } else { push(); translate(0, -19.7 * u); scale(.44); translate(0, 6 * u); eyes(u, o, sw / .44 * .85, [-1, 1], 0); pop(); }
    rs('nose');
    inkLine(P([[.02, -19.2], [-.08, -18.85], [.12, -18.75]]), sw * .5, SHL.skinDk, 'inkfine', .5);
    rs('mouth');
    if (!o.mouth || o.mouth === 'smile') {
      paint(P([[-.5, -18.3], [0, -18.05], [.5, -18.3], [0, -18.18]]), { wash: SHL.lip, ink: null, curv: .5 });
      inkLine(P([[-.55, -18.32], [0, -18.02], [.55, -18.32]]), sw * .6, INK, 'inkfine', .6);
    } else if (o.mouth === 'flat') {
      inkLine(P([[-.5, -18.15], [0, -18.12], [.5, -18.15]]), sw * .7, INK, 'inkfine', .3);
    } else if (o.mouth === 'teeth') {   // gritted teeth
      paint(P([[-.7, -18.05], [-.55, -18.5], [0, -18.62], [.55, -18.5], [.7, -18.05], [0, -17.95]]), { wash: SHL.white, ink: INK, sw: sw * .7, curv: .3 });
      for (const tx of [-.3, 0, .3]) inkLine(P([[tx, -18.55], [tx, -18.03]]), sw * .35, SHL.skinDk, 'inkfine', 0);
    } else { push(); translate(0, -18.3 * u); scale(.36); translate(0, 4.3 * u); mouth(u, o.mouth, sw / .36 * .8); pop(); }
    pop();
    pop();

    // ---- arms, last: the prop goes under the hand that holds it. Plain arms, no bangles.
    for (const s of [-1, 1]) {
      rs('arm' + s);
      const [sh, el, ha] = brahmachariniArm(o, s), hook = s < 0 ? o.armL : o.armR;
      paint(ribbon(P([sh, el, ha]), 1.05 * u, .75 * u), { wash: col, ink: INK, sw: sw * .8 });
      push(); translate(ha[0] * u, ha[1] * u);
      rs('prop' + s);
      const pk = clamp((.5 - pray) / .3);
      if (pk > .02) {
        if (pk < 1) scale(pk);
        if (s < 0 && o.mala !== false) japaMala(u, sw, (o.malaSwing || 0) * .5 + Math.sin(T * 1.6) * .05);
        if (s > 0 && o.pot !== false) kamandalu(u, sw, Math.sin(T * 1.3 + 1) * .04);
        if (pk < 1) scale(1 / pk);
      }
      rs('hand' + s);
      paint(ellPts(0, 0, .6 * u, .55 * u, 14, J), { wash: col, ink: INK, sw: sw * .7 });
      if (s < 0 && o.mala !== false && pk > .02) paint(ellPts(.12 * u * pk, .28 * u * pk, .2 * u, .3 * u, 8, 0, .3), { wash: col, ink: INK, sw: sw * .35 });   // a thumb over the strand
      if (hook) hook(u, sw);
      pop();
    }
    if (pray > .6) {   // the joined palms, fingers pointing up
      rs('palms');
      const [, , h] = brahmachariniArm(o, 1), k = clamp((pray - .6) / .3);
      push(); translate(0, h[1] * u);
      paint(P([[0, -1.7 * k], [.62, -.55], [.45, .7], [-.45, .7], [-.62, -.55]]), { wash: col, ink: INK, sw: sw * .7, curv: .4 });
      inkLine(P([[0, -1.4 * k], [0, .6]]), sw * .45, SHL.skinDk, 'inkfine', 0);
      pop();
    }
  });
  pop();

  if (o.emote) {
    rs('emote');
    const top = EMOTE_TOP.includes(o.emote), dir = o.flip ? -1 : 1;
    emote(o.emote, top ? x : x + dir * 4.6 * u, y + dy + (top ? -27.5 : -22) * u * (1 - sq), u * 1.1, o.emoteK ?? 1, o.emoteAge ?? T);
  }
  rs('after');
}

// Model sheet: studio.html?loop=brahmacharini, or node render.mjs --loop=brahmacharini --sheet=0.5 --cols=1 --w=720
(() => {
  LOOPS.brahmacharini = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: '#C9DDD2', ink: null });
    const CW = 540, CH = 640, cell = i => [(i % 2) * CW, Math.floor(i / 2) * CH];
    const bg = (i, c) => { const [cx, cy] = cell(i); paint(rectPts(cx, cy, CW, CH), { wash: c, ink: null }); };
    bg(2, '#1B1F4B'); bg(5, '#E9D3B8');
    const poses = [
      ['serene', 22, { aura: .5 }],
      ['gentle', 22, { walk: t * 1.2, hx: .3 }],
      ['serene', 21, { pray: 1, oneFoot: 1, aura: 1 }],
      ['angry', 22, { brows: -1, handR: [4.4, -21.5], pot: false }],
      ['delight', 22, { blush: .8 }],
      ['gentle', 48, { pot: false, hx: .15 }],
    ];
    poses.forEach(([name, u, over], i) => {
      const [cx, cy] = cell(i), gx = cx + CW / 2, gy = i === 5 ? 2530 : cy + CH - 60;
      brahmacharini(gx, gy, u, { ...feel(name, t + i * .3, { seed: i }), ...SHL_SKIN, noShadow: i === 5, ...over });
    });
  };
  LOOPS.brahmacharini.len = 4;
})();
