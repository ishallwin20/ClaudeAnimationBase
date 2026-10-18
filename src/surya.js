// surya.js: Surya, the Sun god, standing, as the shastras paint him: a red-gold body (raktavarna), two hands raising two
// lotuses at his shoulders, a tall gold kirita set with a ruby (manikya, his gem), gold kundals, a gold kavacha over his
// chest, a red dhoti with a gold border and a saffron uttariya, and a halo of rays behind his head. pal recolours him into
// Aruna, his charioteer (ARUNA_PAL), or anyone else on the same body. Plus his chariot (suryaChariot: one wheel, Vishnu
// Purana 2.8) and its horses (suryaHorse, a side-view gallop). Load after bappa.js (U()), clawd.js (eyes() / mouth() /
// emote()) and shailputri.js (lotus()).
// (x, y) is the ground point under him; u is the size unit (about 28u tall to the kirita's tip, the halo spans 13u).
//
// Body-local coordinates in u (y up is negative), as on shani.js:
//   feet (±1.3, -.5) · dhoti -12..-3 · chest centre (0, -14.6) · shoulders (±3, -16.3) · head centre (0, -20.6)
//   (the head is drawn 1.16× about the neck at (0, -18)) · halo centre (0, -21.2)
//
// Options (all optional):
//   pose:   dx, dy (in u), sq, rot, flip, hx (-1..1 head turn), htilt, lean (u), legs (false: from the waist up, for a
//           chariot box in front of him)
//   arms:   handL / handR = [x, y] in u (default: raised at the shoulders, holding the lotuses), bendL / bendR,
//           lotus (false: empty hands), lotusOpen 0..1, pray 0..1 (palms joined at the chest), reins 0..1 (both hands
//           forward at the chest, fists, for the charioteer), armL(u, sw) / armR(u, sw) hooks at the hands
//   head:   crown ('kirita' | 'band' | 'none'), halo 0..1 (the ring of rays; default 1), rays (count, default 16),
//           haloGlow 0..1 (a light behind it, default .7)
//   face:   eyes ('normal' | 'look' | 'wide' | 'closed' | 'happy' are his own; any other kind is Clawd's), lookX / lookY,
//           brow (-1 stern .. 1 raised), mouth ('smile' | 'grin' | 'open' | 'O' | 'flat' are his own, else Clawd's),
//           blush, squint, seed
//   look:   pal (a palette like SUR: ARUNA_PAL for Aruna), tint + tintK, swMul, boilKey, noShadow, emote + emoteK + emoteAge
// Helpers: suryaHand(x, y, u, o, s), suryaHead(x, y, u, o), suryaHaloC(x, y, u, o) → world points.
const SUR = {
  skin: '#EE9A5C', skinDk: '#C66E3A', skinLt: '#FFC48E', ink: '#3A1F22',
  dhoti: '#D2402E', dhotiDk: '#9E2A22', dhotiLt: '#EE6A50', sash: '#F7B733', sashDk: '#D18A1C',
  gold: '#F2BE3E', goldDk: '#B97F1C', goldLt: '#FFE6A0', gem: '#D42A3A', gemLt: '#FF9AA2',
  hair: '#2A1A20', hairLt: '#4A3036', white: '#FFF6EA', iris: '#2A1418', lip: '#8E3A36',
  ray: '#FFB72E', rayDk: '#F07A22', rayLt: '#FFE27A', glow: '#FFB648',
};
// Aruna, the dawn: a rosy youth with a gold band instead of the kirita, a rose dhoti, no halo of his own
const ARUNA_PAL = {
  skin: '#F2A08C', skinDk: '#CF7462', skinLt: '#FFC8B6', dhoti: '#E0566E', dhotiDk: '#B23A52', dhotiLt: '#F58A9A',
  sash: '#FFD08A', sashDk: '#E0A050', gem: '#E84A6A',
};
const SUR_HS = 1.16;

function suryaArm(o, s) {
  const sh = [s * 3, -16.3];
  let ha = (s < 0 ? o.handL : o.handR) || [s * 5.2, -15.4];
  const pr = clamp(o.pray || 0), rn = clamp(o.reins || 0);
  if (pr > 0) ha = [lerp(ha[0], s * .42, pr), lerp(ha[1], -14.3, pr)];
  if (rn > 0) ha = [lerp(ha[0], 3.6 + s * .7, rn), lerp(ha[1], -13.4 - s * .3, rn)];
  const dx = ha[0] - sh[0], dy = ha[1] - sh[1], d = Math.hypot(dx, dy) || 1;
  let nx = -dy / d, ny = dx / d; if (ny < 0) { nx = -nx; ny = -ny; }   // elbows hang down
  const b = (s < 0 ? o.bendL : o.bendR) ?? 1.4;
  return [sh, [(sh[0] + ha[0]) / 2 + nx * b, (sh[1] + ha[1]) / 2 + ny * b], ha];
}
function suryaLocal(x, y, u, o, px, py) {
  const sq = o.sq || 0, fx = o.flip ? -1 : 1, l = o.lean || 0, r = l * .035;
  const qx = px + l * .6, qy = py + 12, hx = qx * Math.cos(r) - qy * Math.sin(r), hy = qx * Math.sin(r) + qy * Math.cos(r) - 12;
  const wx = fx * hx * u * (1 + sq * .6), wy = hy * u * (1 - sq), a = o.rot || 0;
  return [x + (o.dx || 0) * u + wx * Math.cos(a) - wy * Math.sin(a), y + (o.dy || 0) * u + wx * Math.sin(a) + wy * Math.cos(a)];
}
const _surH = v => -18 + (v + 18) * SUR_HS;
function suryaHand(x, y, u, o, s) { const [, , h] = suryaArm(o, s); return suryaLocal(x, y, u, o, h[0], h[1]); }
function suryaHead(x, y, u, o = {}) { return suryaLocal(x, y, u, o, clamp(o.hx || 0, -1, 1) * .5, _surH(-20.6)); }
function suryaHaloC(x, y, u, o = {}) { return suryaLocal(x, y, u, o, clamp(o.hx || 0, -1, 1) * .5, _surH(-21.2)); }

// The ring of rays behind his head, at (0, 0): alternating long and short flame-shaped rays round a gold disc.
function suryaRays(u, sw, n = 16, k = 1, INK = SUR.ink, C = SUR) {
  if (k <= 0) return;
  const R0 = 4.3 * k, spin = T * .05;
  for (let i = 0; i < n; i++) {
    const a = spin + i / n * TAU, long = i % 2 === 0, L = (long ? 3.1 : 2.1) * k, w = (long ? .62 : .5) * k;
    const c = Math.cos(a), s = Math.sin(a), px = -s, py = c;
    const pts = [[c * R0 + px * w, s * R0 + py * w], [c * (R0 + L * .55) + px * w * .55, s * (R0 + L * .55) + py * w * .55],
      [c * (R0 + L), s * (R0 + L)], [c * (R0 + L * .55) - px * w * .55, s * (R0 + L * .55) - py * w * .55], [c * R0 - px * w, s * R0 - py * w]];
    paint(U(pts, u), { wash: long ? C.ray : C.rayDk, ink: INK, sw: sw * .55, curv: .3 });
  }
  paint(ellPts(0, 0, (R0 + .5) * u, (R0 + .5) * u, 36), { wash: C.ray, fill: C.rayDk, fillOp: 50, tex: .5, border: .6, ink: INK, sw: sw * .7 });
  paint(ellPts(0, 0, (R0 - .2) * u, (R0 - .2) * u, 32), { wash: C.rayLt, fill: C.ray, fillOp: 60, bleed: .15, tex: .6, border: .7, ink: null });
}

function surya(x, y, u, o = {}) {
  const id = o.boilKey ?? 'su' + (++CLAWD_N), rs = p => boilSeed(`surya ${id} ${p}`);
  const C = { ...SUR, ...(o.pal || {}) };
  x += (o.dx || 0) * u;
  const dy = (o.dy || 0) * u, sq = o.sq || 0, sw = clamp(u / 20, .4, 2) * (o.swMul || 1), J = u * .04;
  const { col, dk, lt } = tintCols({ ...o, col: C.skin, dk: C.skinDk, lt: C.skinLt });
  const P = pts => U(pts, u), INK = C.ink, hx = clamp(o.hx || 0, -1, 1), lean = o.lean || 0;
  const crown = o.crown || 'kirita', halo = o.halo ?? 1;

  if (!o.noShadow && o.legs !== false) { rs('shadow'); paint(ellPts(x, y + u * .1, u * 4.6, u * .9, 22), { fill: PAL.ink, fillOp: 70, bleed: .25, tex: .3, border: .1, ink: null }); }
  if (halo > 0 && (o.haloGlow ?? .7) > 0) { const [gx, gy] = suryaHaloC(x - (o.dx || 0) * u, y + dy, u, o); glow(gx, gy, u * 12 * halo, C.glow, o.haloGlow ?? .7); }
  push();
  translate(x, y + dy);
  if (o.rot) rotate(o.rot);
  scale((o.flip ? -1 : 1) * (1 + sq * .6), 1 - sq);
  const upper = f => { push(); translate(0, -12 * u); rotate(lean * .035); translate(lean * .6 * u, 12 * u); f(); pop(); };
  const headT = () => { translate(hx * .5 * u, 0); translate(0, -18 * u); if (o.htilt) rotate(o.htilt); scale(SUR_HS); translate(0, 18 * u); };

  // ---- behind: the halo of rays, then the hair down his back
  upper(() => {
    push(); headT();
    if (halo > 0) { rs('halo'); push(); translate(0, -21.2 * u); suryaRays(u, sw, o.rays || 16, halo, INK, C); pop(); }
    rs('backhair');
    paint(P([[-3.2, -21.5], [-3.6, -19], [-3.6, -16.8], [-2.9, -15.6], [-1.4, -16.2], [0, -16.4], [1.4, -16.2], [2.9, -15.6], [3.6, -16.8], [3.6, -19], [3.2, -21.5], [0, -23.2]]),
      { wash: C.hair, ink: INK, sw: sw * .8, curv: .4 });
    pop();
  });

  if (o.legs !== false) {
    rs('legs');
    for (const s of [-1, 1]) {
      const cx = s * 1.35;
      paint(P([[cx - .9, -3.6], [cx + .9, -3.6], [cx + .85, -.75], [cx - .85, -.75]]), { wash: col, fill: dk, fillOp: 50, tex: .5, ink: INK, sw: sw * .85 });
      inkLine(P([[cx - .85, -1.5], [cx + .85, -1.5]]), sw * 1.1, C.gold, 'ink', 0);
      paint(ellPts((cx + s * .15) * u, -.5 * u, 1.15 * u, .55 * u, 16, J), { wash: col, fill: dk, fillOp: 40, tex: .5, ink: INK, sw: sw * .8 });
    }
    // ---- the dhoti: red with a gold border
    rs('dhoti');
    paint(P([[-2.9, -12.2], [2.9, -12.2], [3.4, -9], [3.8, -5.5], [4, -3.2], [1.4, -3], [.3, -3.6], [-.3, -3.6], [-1.4, -3], [-4, -3.2], [-3.8, -5.5], [-3.4, -9]]),
      { wash: C.dhoti, fill: C.dhotiDk, fillOp: 70, bleed: .06, tex: .7, border: .5, ink: INK, sw: sw * .9, curv: .25 });
    for (const s of [-1, 1]) inkLine(P([[s * .35, -3.55], [s * 1.4, -3.15], [s * 3.9, -3.35]]), sw * 1.5, C.gold, 'ink', .4);
    inkLine(P([[0, -11.6], [-.25, -8], [0, -4]]), sw * 1.3, C.gold, 'ink', .4);
    for (const k of [-1.6, 1.5]) inkLine(P([[k * .7, -11.2], [k, -7.5], [k * 1.2, -4]]), sw * .5, C.dhotiLt, 'inkfine', .5);
  }

  upper(() => {
    // ---- torso, the gold kavacha, the uttariya
    rs('torso');
    const chest = P([[-3, -16.9], [3, -16.9], [3.25, -14.6], [2.7, -12], [-2.7, -12], [-3.25, -14.6]]);
    paint(chest, { wash: col, ink: null, curv: .35 });
    paint(ellPts(-1.1 * u, -15.6 * u, 1.5 * u, .9 * u, 14, J * 2, -.3), { fill: lt, fillOp: 120, bleed: .2, tex: .8, border: .8, ink: null });
    paint(chest, { ink: INK, sw: sw * .9, curv: .35 });
    if (o.kavacha !== false) {   // armour from the chest down: a gold plate with a scale pattern
      paint(P([[-2.75, -15], [2.75, -15], [2.6, -12.4], [-2.6, -12.4]]), { wash: C.gold, fill: C.goldDk, fillOp: 60, tex: .6, ink: INK, sw: sw * .7, curv: .2 });
      for (const r of [-14.3, -13.3]) for (let i = -2; i <= 2; i++) inkLine(P([[i * 1.05 - .45, r], [i * 1.05, r + .4], [i * 1.05 + .45, r]]), sw * .45, C.goldDk, 'inkfine', .6);
    }
    paint(rrPts(-2.95 * u, -12.7 * u, 5.9 * u, .8 * u, .3 * u, J), { wash: C.gold, fill: C.goldDk, fillOp: 60, tex: .5, ink: INK, sw: sw * .7 });
    rs('sash');
    paint(ribbon(P([[-2.6, -17.1], [-3.5, -15.6], [-4.3, -13.2], [-4.6, -10.6], [-5.2, -9.4]]), .8 * u, .5 * u), { wash: C.sash, fill: C.sashDk, fillOp: 60, tex: .5, ink: INK, sw: sw * .6 });
    paint(ribbon(P([[2.6, -17.1], [3.5, -15.6], [4.3, -13.2], [4.6, -10.6], [5.2, -9.4]]), .8 * u, .5 * u), { wash: C.sash, fill: C.sashDk, fillOp: 60, tex: .5, ink: INK, sw: sw * .6 });
  rs('neck');
    paint(P([[-.85, -18.4], [.85, -18.4], [.9, -16.8], [-.9, -16.8]]), { wash: col, fill: dk, fillOp: 60, tex: .5, ink: INK, sw: sw * .6 });
    paint(ribbon(P([[-2.4, -17], [-1.2, -15.8], [0, -15.5], [1.2, -15.8], [2.4, -17]]), .55 * u, .55 * u), { wash: C.gold, ink: INK, sw: sw * .5 });
    paint(ellPts(0, -15.4 * u, .38 * u, .38 * u, 10), { wash: C.gem, ink: INK, sw: sw * .45 });

    // ---- head
    push(); headT();
    rs('ears');
    for (const s of [-1, 1]) {
      paint(ellPts(s * 3.25 * u, -20.3 * u, .55 * u, .85 * u, 12, J), { wash: col, fill: dk, fillOp: 60, tex: .5, ink: INK, sw: sw * .7 });
      push(); translate(s * 3.3 * u, -19.5 * u); rotate(Math.sin(T * 2.2 + s) * .1);
      paint(ellPts(0, .6 * u, .5 * u, .5 * u, 12), { wash: C.gold, fill: C.goldDk, fillOp: 50, ink: INK, sw: sw * .45 });   // kundal: a little sun
      paint(ellPts(0, .6 * u, .2 * u, .2 * u, 6), { wash: C.gem, ink: null });
      pop();
    }
    rs('head');
    const head = ellPts(0, -20.6 * u, 3.3 * u, 3.15 * u, 30, J);
    paint(head, { wash: col, ink: null });
    paint(ellPts((-1.2 + hx) * u, -21.8 * u, 1.7 * u, .9 * u, 14, J * 2, -.2), { fill: lt, fillOp: 120, bleed: .2, tex: .85, border: .8, ink: null });
    paint(ellPts(0, -18.2 * u, 2.3 * u, .75 * u, 14, J), { fill: dk, fillOp: 50, bleed: .1, tex: .6, border: .5, ink: null });
    paint(head, { ink: INK, sw });
    rs('hairfront');
    paint(P([[-3.3, -20.3], [-3.4, -22.2], [-2.6, -23.5], [-1, -24], [0, -23.7], [1, -24], [2.6, -23.5], [3.4, -22.2], [3.3, -20.3], [2.85, -21.6], [1.6, -22.5], [0, -22.6], [-1.6, -22.5], [-2.85, -21.6]]),
      { wash: C.hair, ink: INK, sw: sw * .85, curv: .4 });
    if (crown === 'kirita') {   // tall gold, three tiers, a ruby
      rs('kirita');
      paint(P([[-2.8, -22.9], [2.8, -22.9], [2.6, -24.3], [2, -25.3], [1.4, -26.3], [.7, -27.1], [0, -27.8], [-.7, -27.1], [-1.4, -26.3], [-2, -25.3], [-2.6, -24.3]]),
        { wash: C.gold, fill: C.goldDk, fillOp: 50, tex: .5, ink: INK, sw: sw * .8, curv: .15 });
      paint(ribbon(P([[-2.85, -23.1], [0, -23.45], [2.85, -23.1]]), .65 * u, .65 * u), { wash: C.goldLt, ink: INK, sw: sw * .5 });
      for (const yy of [-25.2, -26.5]) inkLine(P([[-(27.9 + yy) * 1.1 - .4, yy], [0, yy - .25], [(27.9 + yy) * 1.1 + .4, yy]]), sw * .5, C.goldDk, 'inkfine', .5);
      paint(P([[0, -23.9], [.6, -24.8], [0, -25.8], [-.6, -24.8]]), { wash: C.gem, ink: INK, sw: sw * .5 });
      paint(ellPts(-.13 * u, -25 * u, .14 * u, .17 * u, 6), { wash: C.gemLt, ink: null });
      paint(ellPts(0, -27.9 * u, .32 * u, .32 * u, 8), { wash: C.gem, ink: INK, sw: sw * .4 });
    } else if (crown === 'band') {
      rs('band');
      paint(ribbon(P([[-3.1, -22.2], [0, -22.85], [3.1, -22.2]]), .7 * u, .7 * u), { wash: C.gold, ink: INK, sw: sw * .5 });
      paint(ellPts(0, -22.85 * u, .34 * u, .34 * u, 8), { wash: C.gem, ink: INK, sw: sw * .4 });
    }

    push(); translate(hx * .8 * u, 0);
    rs('tilak');   // a red tilak
    paint(P([[0, -22.3], [.2, -21.7], [0, -21.3], [-.2, -21.7]]), { wash: C.gem, ink: null });
    if (o.blush) for (const s of [-1, 1]) paint(ellPts(s * 2.05 * u, -19.2 * u, .7 * u, .36 * u, 14), { fill: PAL.rose, fillOp: 150 * clamp(o.blush), bleed: .2, tex: .4, ink: null });
    rs('eyes');
    const kinds = Array.isArray(o.eyes) ? o.eyes : [o.eyes || 'normal', o.eyes || 'normal'];
    const br = clamp(o.brow || 0, -1, 1), own = k => ['normal', 'look', 'wide', 'closed', 'happy'].includes(k);
    if (kinds.every(own)) {
      const lx = (o.lookX || 0) * u * .2, ly = clamp(o.lookY || 0, -1, 1) * u * .2;
      [-1, 1].forEach((s, i) => {
        const k = (o.squint || 0) > .5 ? 'closed' : kinds[i], ex = s * 1.25 * u, ey = -20.4 * u, wide = k === 'wide';
        const by = -21.4 - (wide ? .35 : 0) - Math.max(0, br) * .3, bi = Math.min(0, br) * .35;
        inkLine(P([[s * .55, by + .1 - bi], [s * 1.25, by - .15], [s * 1.95, by + .05]]), sw * 1.1, C.hair, 'ink', .4);
        if (k === 'closed') { inkLine([[ex - .6 * u, ey], [ex, ey + .22 * u], [ex + .6 * u, ey]], sw * 1.15, INK, 'ink', .5); return; }
        if (k === 'happy') { inkLine([[ex - .6 * u, ey + .12 * u], [ex, ey - .26 * u], [ex + .6 * u, ey + .12 * u]], sw * 1.2, INK, 'ink', .5); return; }
        const rx = (wide ? .7 : .6) * u, ry = (wide ? .66 : .55) * u;
        paint(ellPts(ex, ey, rx, ry, 16), { wash: C.white, ink: null });
        paint(ellPts(ex + lx, ey + ly, .34 * u, .4 * u, 12), { wash: C.iris, ink: null });
        paint(ellPts(ex + lx - .1 * u, ey + ly - .14 * u, .11 * u, .12 * u, 8), { wash: C.white, ink: null });
        inkLine([[ex - rx * 1.05, ey - ry * .1], [ex - rx * .3, ey - ry * 1.02], [ex + rx * .4, ey - ry * 1.02], [ex + rx * 1.1, ey - ry * .2]], sw * 1.25, INK, 'ink', .5);
      });
    } else { push(); translate(0, -20.4 * u); scale(.5); translate(0, 6 * u); eyes(u, o, sw / .5 * .85, [-1, 1], 0); pop(); }
    rs('nose');
    inkLine(P([[.02, -19.9], [-.12, -19.35], [.15, -19.25]]), sw * .55, C.skinDk, 'inkfine', .5);
    rs('mouth');
    const m = o.mouth || 'smile', my = -18.5;
    if (m === 'smile') inkLine(P([[-.6, my], [0, my + .28], [.6, my]]), sw * .85, INK, 'ink', .6);
    else if (m === 'grin') paint(P([[-.75, my - .05], [.75, my - .05], [.45, my + .45], [0, my + .6], [-.45, my + .45]]), { wash: C.lip, ink: INK, sw: sw * .6, curv: .5 });
    else if (m === 'flat') inkLine(P([[-.42, my + .08], [.42, my + .08]]), sw * .8, INK, 'ink', 0);
    else if (m === 'O') paint(ellPts(0, (my + .2) * u, .24 * u, .3 * u, 10), { wash: C.lip, ink: INK, sw: sw * .5 });
    else if (m === 'open') paint(P([[-.55, my - .02], [.55, my - .02], [.4, my + .45], [0, my + .62], [-.4, my + .45]]), { wash: C.lip, ink: INK, sw: sw * .6, curv: .5 });
    else { push(); translate(0, my * u); scale(.4); translate(0, 4.3 * u); mouth(u, m, sw / .4 * .8); pop(); }
    pop();
    pop();

    // ---- arms, last: lotuses at the shoulders (or reins, or joined palms)
    const pr = clamp(o.pray || 0), rn = clamp(o.reins || 0), lo = o.lotus !== false && pr < .5 && rn < .5;
    for (const s of [-1, 1]) {
      rs('arm' + s);
      const [sh, el, ha] = suryaArm(o, s), hook = s < 0 ? o.armL : o.armR;
      paint(ribbon(P([sh, el, ha]), 1.25 * u, .85 * u), { wash: col, fill: dk, fillOp: 40, tex: .5, ink: INK, sw: sw * .85 });
      const d = Math.hypot(el[0] - sh[0], el[1] - sh[1]) || 1, nx = -(el[1] - sh[1]) / d * .6, ny = (el[0] - sh[0]) / d * .6, bx = lerp(sh[0], el[0], .5), by = lerp(sh[1], el[1], .5);
      inkLine(P([[bx - nx, by - ny], [bx + nx, by + ny]]), sw * 1.3, C.gold, 'ink', 0);
      if (pr > .5 && s > 0) {
        paint(P([[-.55, -13.6], [-.5, -15], [0, -16.1], [.5, -15], [.55, -13.6], [0, -13.3]]), { wash: col, ink: INK, sw: sw * .7, curv: .4 });
        inkLine(P([[0, -15.9], [0, -13.5]]), sw * .5, INK, 'inkfine', 0);
        continue;
      }
      if (pr > .5) continue;
      push(); translate(ha[0] * u, ha[1] * u);
      if (lo) { push(); translate(0, -.3 * u); scale(1.25); lotus(u, sw / 1.25, o.lotusOpen ?? 1, INK); pop(); }
      paint(ellPts(0, 0, .72 * u, .66 * u, 14, J), { wash: col, ink: INK, sw: sw * .75 });
      if (lo) inkLine(P([[-.55, -.15], [.55, -.15]]), sw * .5, C.skinDk, 'inkfine', 0);   // the fist closed round the stem
      if (hook) hook(u, sw);
      pop();
    }
  });
  pop();
  if (o.emote) {
    rs('emote');
    const top = EMOTE_TOP.includes(o.emote), dir = o.flip ? -1 : 1;
    emote(o.emote, top ? x : x + dir * 5.4 * u, y + dy + (top ? -31 : -25) * u * (1 - sq), u * 1.15, o.emoteK ?? 1, o.emoteAge ?? T);
  }
  rs('after');
}

// ---------------- the horses ----------------
// suryaHorse(x, y, u, o): a horse in side view, galloping across the sky, facing screen right (flip: left). (x, y) is
// the middle of the belly line; u is the size unit (about 13u from tail to muzzle, 9u from hoof to ear).
// o: gallop (phase 0..1: the legs cycle), mane (a colour), coat / coatDk, rot, flip, eyes ('normal' | 'happy'),
// harness (false: no gold harness), boilKey.
const HORSE = { coat: '#FFF4E4', coatDk: '#E2CDB2', hoof: '#B98C5A', ink: '#3A1F22', eye: '#2A1418', gold: '#F2BE3E', goldDk: '#B97F1C', red: '#D2402E' };
function suryaHorseBit(x, y, u, o = {}) { return [x + (o.flip ? -1 : 1) * 6.7 * u, y - 5.9 * u]; }   // where the reins meet the bridle
function suryaHorse(x, y, u, o = {}) {
  const id = o.boilKey ?? 'ho' + (++CLAWD_N), rs = p => boilSeed(`horse ${id} ${p}`), P = pts => U(pts, u);
  const sw = clamp(u / 16, .35, 1.8), INK = HORSE.ink, coat = o.coat || HORSE.coat, cdk = o.coatDk || HORSE.coatDk, mane = o.mane || '#F07A22';
  const g = (o.gallop ?? 0) * TAU, bob = Math.sin(g * 2) * .25;
  push(); translate(x, y + bob * u); if (o.rot) rotate(o.rot); scale(o.flip ? -1 : 1, 1);
  // legs: a 2-bone ribbon from hip to hoof, swung by the gallop phase
  const leg = (hx, hy, ph, front, far) => {
    const a = Math.sin(g + ph), knee = front ? [hx + .3 + a * 1.3, hy + 2.6] : [hx - .5 + a * 1.1, hy + 2.6];
    const hoof = front ? [knee[0] + .2 + a * 1.4, knee[1] + 1.9 - Math.max(0, a) * .8] : [knee[0] - .7 + a * 1.3, knee[1] + 1.9 - Math.max(0, -a) * .8];
    paint(ribbon(P([[hx, hy], knee, hoof]), 1.5 * u, .6 * u), { wash: far ? cdk : coat, fill: cdk, fillOp: far ? 20 : 40, tex: .5, ink: INK, sw: sw * .8 });
    paint(ellPts(hoof[0] * u, (hoof[1] + .25) * u, .42 * u, .3 * u, 10), { wash: HORSE.hoof, ink: INK, sw: sw * .6 });
  };
  rs('farlegs'); leg(-3.3, -2, Math.PI * .5, false, true); leg(3.2, -2, Math.PI * 1.4, true, true);
  rs('nearlegs'); leg(-3.7, -1.8, 0, false, false); leg(2.8, -1.8, Math.PI, true, false);
  rs('tail');
  const tw = Math.sin(g + 1) * .5;
  paint(ribbon(P([[-4.6, -2.4], [-6.2, -2.6 + tw], [-7.4, -1.8 + tw * 1.5], [-8.2, -.6 + tw * 2]]), 1.3 * u, .3 * u), { wash: mane, fill: mixCol(mane, PAL.ink, .3), fillOp: 50, tex: .6, ink: INK, sw: sw * .7 });
  rs('body');
  const body = P([[-5.6, -2.6], [-5.1, -4.3], [-3.6, -5], [-1.6, -4.5], [.2, -4.1], [2, -4.5], [3.4, -5], [4.9, -4.3], [5.5, -2.8], [4.8, -1.2], [3.2, -.5], [.6, -.2], [-2, -.5], [-4, -.6], [-5.3, -1.4]]);
  paint(body, { wash: coat, ink: null, curv: .6 });
  paint(P([[-4.8, -1.6], [-2, -1.2], [1, -1], [3.8, -1.5], [3.2, -.5], [.6, -.2], [-2, -.5], [-4, -.6]]), { fill: cdk, fillOp: 150, bleed: .2, tex: .6, border: .6, ink: null, curv: .5 });   // belly shade
  paint(ellPts(-4.1 * u, -3.4 * u, 1.3 * u, 1.1 * u, 14), { fill: cdk, fillOp: 90, bleed: .25, tex: .6, border: .7, ink: null });   // the round of the rump
  paint(body, { ink: INK, sw: sw * .9, curv: .6 });
  if (o.harness !== false) {
    paint(ribbon(P([[3.6, -4.7], [3.2, -2.5], [3.5, -.4]]), .55 * u, .55 * u), { wash: HORSE.gold, ink: INK, sw: sw * .5 });
    paint(ribbon(P([[-1.2, -4.5], [-1.1, -2], [-1.3, .1]]), .7 * u, .7 * u), { wash: HORSE.red, fill: mixCol(HORSE.red, PAL.ink, .3), fillOp: 50, tex: .5, ink: INK, sw: sw * .5 });
  }
  rs('mane');
  { const top = [], bot = [];
    for (let i = 0; i <= 6; i++) { const k = i / 6, bx = lerp(5.4, 2.2, k), by = lerp(-8.6, -4.7, k), fl = Math.sin(g * 2 + i * 1.3) * .35;
      bot.push([bx + .9, by + .7]); top.push([bx - .9 - k * .5 + fl * .4, by - .6 + fl + (i % 2 ? .4 : 0)]); }
    paint(P(top.concat(bot.reverse())), { wash: mane, fill: mixCol(mane, PAL.ink, .25), fillOp: 60, tex: .5, ink: INK, sw: sw * .6, curv: .5 }); }
  rs('neck');
  paint(P([[2.3, -4.5], [3.6, -6.6], [5, -8.3], [6.1, -8.5], [7.3, -7.2], [8.3, -5.9], [8.1, -5.2], [7.3, -5], [6.4, -5.5], [5.6, -5], [4.9, -3.8], [3.6, -3.6]]),
    { wash: coat, fill: cdk, fillOp: 50, tex: .6, ink: INK, sw: sw * .9, curv: .5 });
  paint(P([[5.3, -8.2], [5.7, -9.6], [6.3, -8.4]]), { wash: coat, ink: INK, sw: sw * .6 });   // ear
  rs('forelock'); paint(P([[5.4, -8.6], [6.4, -8], [5.9, -7.2], [5.1, -7.8]]), { wash: mane, ink: INK, sw: sw * .5, curv: .5 });
  if (o.harness !== false) { rs('bridle'); inkLine(P([[5.8, -7.8], [6.7, -6.1], [7.9, -5.4]]), sw * 1.2, HORSE.gold, 'ink', .4); paint(ellPts(5.6 * u, -8.8 * u, .32 * u, .32 * u, 8), { wash: HORSE.red, ink: INK, sw: sw * .4 }); }
  rs('eye');
  if (o.eyes === 'happy') inkLine(P([[6.05, -6.95], [6.35, -7.3], [6.7, -6.95]]), sw * .9, INK, 'ink', .5);
  else { paint(ellPts(6.5 * u, -7.1 * u, .32 * u, .34 * u, 10), { wash: HORSE.eye, ink: null }); paint(ellPts(6.42 * u, -7.2 * u, .1 * u, .1 * u, 6), { wash: '#FFF6EA', ink: null }); }
  paint(ellPts(8 * u, -5.7 * u, .12 * u, .1 * u, 6), { wash: INK, ink: null });   // nostril
  pop();
  boilSeed(`horse ${id} after`);
}

// ---------------- the chariot ----------------
// suryaChariot(x, y, u, o): the Sun's golden chariot in side view, facing screen right (flip: left), with its ONE wheel
// (five spokes, Vishnu Purana 2.8). (x, y) is the ground point under the wheel; u as for surya() (the box is 12u long).
// Draw it in two calls round the riders: o.part 'back' (the back wall, the canopy pole and flag) before them and
// 'front' (the front wall, the wheel and the pole to the horses) after. o.spin turns the wheel (radians), o.pole = the
// world point the pole reaches (the horses' harness), boilKey.
const suryaChariotSeat = (x, y, u, o = {}) => [x + (o.flip ? -1 : 1) * -.5 * u, y - 7.4 * u];   // where a rider's feet stand
function suryaChariot(x, y, u, o = {}) {
  const id = o.boilKey ?? 'ch', rs = p => boilSeed(`chariot ${id} ${o.part} ${p}`), P = pts => U(pts, u), INK = SUR.ink;
  const sw = clamp(u / 20, .4, 2), fx = o.flip ? -1 : 1;
  push(); translate(x, y); scale(fx, 1);
  if (o.part === 'back') {
    rs('pole');
    inkLine(P([[-5.6, -8], [-5.6, -24]]), sw * 2.2, SUR.goldDk, 'ink', 0);
    const fl = Math.sin(T * 3) * .4;
    paint(P([[-5.5, -24], [-1.8, -23 + fl], [-2.6, -22 + fl * .5], [-1.6, -21 + fl], [-5.5, -21.6]]), { wash: SUR.dhoti, fill: SUR.dhotiDk, fillOp: 60, tex: .5, ink: INK, sw: sw * .6, curv: .3 });
    paint(ellPts(-3.6 * u, -22.4 * u, .55 * u, .55 * u, 12), { wash: SUR.gold, ink: INK, sw: sw * .4 });   // a sun on the flag
    rs('backwall');
    paint(P([[-6.4, -7.6], [5.6, -7.6], [6.2, -12.4], [-6, -13.4]]), { wash: SUR.goldDk, fill: mixCol(SUR.goldDk, PAL.ink, .3), fillOp: 60, tex: .6, ink: INK, sw: sw * .8, curv: .2 });
  } else {
    rs('front');
    const box = P([[-6.6, -7.4], [6.2, -7.4], [7.8, -11.8], [5.6, -12.2], [4.4, -10.4], [-4.8, -10.6], [-6.2, -12.6], [-7.2, -12]]);
    paint(box, { wash: SUR.gold, fill: SUR.goldDk, fillOp: 60, bleed: .06, tex: .6, border: .5, ink: INK, sw: sw * .9, curv: .3 });
    for (let i = 0; i < 6; i++) { const cx = lerp(-4.8, 4.6, i / 5); paint(ellPts(cx * u, -9 * u, .5 * u, .5 * u, 10), { wash: SUR.gem, ink: INK, sw: sw * .4 }); }
    inkLine(P([[-6.4, -8.1], [6.2, -8.1]]), sw * .8, SUR.goldDk, 'inkfine', 0);
    inkLine(P([[-5, -10.1], [4.6, -10]]), sw * .8, SUR.goldLt, 'inkfine', 0);
    // the pole to the horses
    if (o.pole) {
      rs('yoke');
      const [px, py] = o.pole, lx = (px - x) * fx / u, ly = (py - y) / u;
      paint(ribbon(P([[6.6, -8.6], [lerp(6.6, lx, .5), lerp(-8.6, ly, .5) + .6], [lx, ly]]), .7 * u, .5 * u), { wash: SUR.goldDk, ink: INK, sw: sw * .6 });
    }
    // the one wheel
    rs('wheel');
    const R = 4.4, cy = -4.4, sp = o.spin || 0;
    paint(ellPts(0, cy * u, R * u, R * u, 36), { wash: SUR.gold, fill: SUR.goldDk, fillOp: 60, tex: .5, ink: INK, sw: sw * 1 });
    paint(ellPts(0, cy * u, (R - .9) * u, (R - .9) * u, 32), { wash: SUR.rayLt, fill: SUR.ray, fillOp: 50, bleed: .15, tex: .5, border: .6, ink: INK, sw: sw * .6 });
    for (let i = 0; i < 5; i++) { const a = sp + i / 5 * TAU; paint(ribbon(P([[0, cy], [Math.cos(a) * (R - .9), cy + Math.sin(a) * (R - .9)]]), .7 * u, .45 * u), { wash: SUR.goldDk, ink: INK, sw: sw * .5 }); }
    paint(ellPts(0, cy * u, 1 * u, 1 * u, 14), { wash: SUR.gold, ink: INK, sw: sw * .7 });
    paint(ellPts(0, cy * u, .4 * u, .4 * u, 8), { wash: SUR.gem, ink: null });
  }
  pop();
}

// Model sheet: studio.html?loop=surya, or node render.mjs --loop=surya --sheet=0.5 --cols=1 --w=1080
(() => {
  LOOPS.surya = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: PAL.paper, ink: null });
    surya(260, 860, 24, {});
    surya(800, 860, 24, { eyes: 'happy', mouth: 'grin', hx: .4, lookX: .6 });
    surya(260, 1700, 22, { pal: ARUNA_PAL, crown: 'band', halo: 0, reins: 1, mouth: 'smile' });
    suryaHorse(780, 1500, 26, { gallop: t * 1.4, mane: '#E84A6A' });
    suryaHorse(760, 1780, 20, { gallop: t * 1.4 + .3, mane: '#3A9C98', eyes: 'happy' });
  };
  LOOPS.surya.len = 2;
})();
