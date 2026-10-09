// shiva.js: Shiva, sitting in lotus pose: blue skin, a jata bun with the crescent moon and a little Ganga fountain,
// the tripundra (three ash lines) with the third eye on it, a rudraksha mala, a tiger-skin wrap, and Vasuki the snake
// round his neck. Load after bappa.js (he reuses U()) and clawd.js (eyes() / mouth() / emote(), so feel() and
// emotions() drive him too).
// (x, y) is the ground point under his crossed legs; u is the size unit (about 23u tall to the top of the bun and 13u
// wide across the knees).
//
// Body-local coordinates in u (y up is negative):
//   lap -3.6..0, out to ±6.3 · feet on the thighs (±2.4, -3.2) · torso -9.8..-2.9 · shoulders (±4, -8.4)
//   head centre (0, -13), 3.65 × 3.45 · eyes (±1.45, -12.4) · nose (0, -11.6) · mouth (0, -10.4)
//   tripundra -14.9..-14 · third eye (0, -14.45) · bun centre (0, -18.6), top knot -21.5 · moon (-2.1, -18.4)
//   Vasuki: body over the collarbones, head resting on his left shoulder (screen left, -5, -10.2), raised to (-5.6, -14.4)
//
// Options (all optional):
//   pose:   dx, dy (in u), sq, rot (pivots at the ground point), flip, hx (-1..1 head turn), htilt, lean (u: the upper
//           body leans sideways), float (u: rises off the tiger skin, legs and all)
//   arms:   handL / handR = [x, y] in u (default: resting on the knees in chin mudra), bendL / bendR (elbow bend, u),
//           armL(u, sw) / armR(u, sw) (hooks at the hand, drawn upright), mudra (default true: the resting hands)
//   face:   eyes, mouth, lookX / lookY, squint, blush, seed, tint + tintK (from feel / emotions). 'closed' is his own
//           serene meditating eyes; 'normal' / 'look' / 'wide' are his own almond eyes; every other kind is Clawd's.
//           A pair like ['closed', 'normal'] opens one eye (a peek or a wink).
//           sniff 0..1 (the nose lifts and flares), brow (-1..1: + raises)
//   third:  third 0..1 (the third eye opens), thirdGlow 0..1 (a red ember leaks from it), thirdShake (u of tremble),
//           thirdCol (hex: the iris, the ember and the glow in another colour, e.g. gold for a blessing)
//   hair:   moonWob (radians), ganga 0..2 (the fountain; 1 = its idle trickle, 2 = a spurt)
//   Vasuki: snakeUp 0..1 (rises off the shoulder), snakeEyes 'closed' | 'open' | 'angry' | 'happy', snakeTongue 0..1,
//           snakeLook -1..1 (+ = toward screen right)
//   dress:  ash 0..1 (pale ash smeared on his chest, arms and jata), groom 0..1 (from .5: the jewelled groom, Chandrashekhara:
//           a gold crown round the bun, a jewelled collar, a marigold-and-rose garland, gold armlets, a yellow silk shawl)
//   lap:    noLap (no crossed legs and tiger-skin lap: shivaLie() draws its own legs)
//   draw:   only = 'body' (everything but the arms) | 'arms' (just the arms): draw something between his body and his
//           arms (a hug) by calling him twice with the same boilKey. emote + emoteK + emoteAge, boilKey, noShadow
const SHV = {
  skin: '#86AEDD', skinDk: '#5B84BC', skinLt: '#BCD6F2', ink: '#243052',
  hair: '#3B2F52', hairDk: '#231B36', hairLt: '#5C4C79',
  tiger: '#EAA24A', tigerDk: '#C4762B', stripe: '#5A3320', ash: '#F7F0E4',
  moon: '#FFF0C0', moonDk: '#E6C874', ganga: '#A6DBF5', gangaDk: '#5FA6D6',
  gold: '#EDB43C', goldDk: '#B67D1C', bead: '#8A4E2E', beadDk: '#5E3220',
  eye3: '#E2453A', eye3Dk: '#9E2320', ember: '#FF6A3D', white: '#FFF8EC', iris: '#2A2340',
  silk: '#F4C430', silkDk: '#D49A1A', rose: '#E8576E', marigold: '#F39A2B', gem: '#C8324A', gem2: '#3E9E5A',
  snake: '#6DB08F', snakeDk: '#437E66', snakeLt: '#C3E6CA', tongue: '#D2452F', sole: '#EB9CAB',
};
const SHV_SKIN = { col: SHV.skin, dk: SHV.skinDk, lt: SHV.skinLt };

// Shoulder, elbow and hand of one arm (s = -1 his left, on screen left; 1 his right), in body-local u.
function shivaArm(o, s) {
  const sh = [s * 4, -8.4], lean = o.lean || 0;
  sh[0] += lean * .6;
  const ha = (s < 0 ? o.handL : o.handR) || [s * 5.6, -3.55];
  const dx = ha[0] - sh[0], dy = ha[1] - sh[1], d = Math.hypot(dx, dy) || 1;
  let nx = -dy / d, ny = dx / d; if (nx * s < 0) { nx = -nx; ny = -ny; }   // bend the elbow outward, away from the body
  const b = (s < 0 ? o.bendL : o.bendR) ?? 1.2;
  return [sh, [(sh[0] + ha[0]) / 2 + nx * b, (sh[1] + ha[1]) / 2 + ny * b], ha];
}
// Where his hand is on screen (for props he holds and things he touches). Ignores rot.
function shivaHand(x, y, u, o, s) {
  const [, , h] = shivaArm({ ...o, lean: 0 }, s), sq = o.sq || 0, fx = o.flip ? -1 : 1;
  return [x + (o.dx || 0) * u + fx * (h[0] + (o.lean || 0) * .5) * u * (1 + sq * .6), y + ((o.dy || 0) - (o.float || 0)) * u + h[1] * u * (1 - sq)];
}
// A point on his face in screen space: 'nose', 'mouth', 'third', 'eye' (for props at his nose, the iris, glows).
function shivaFace(x, y, u, o, part = 'nose') {
  const p = { nose: [.1, -11.5], mouth: [0, -10.4], third: [0, -14.45], eye: [0, -12.4], top: [0, -21.5] }[part];
  const hx = clamp(o.hx || 0, -1, 1), sq = o.sq || 0, fx = o.flip ? -1 : 1, lean = o.lean || 0;
  return [x + (o.dx || 0) * u + fx * (p[0] + hx * .5 + (part === 'top' ? 0 : hx * .9) + lean) * u * (1 + sq * .6), y + ((o.dy || 0) - (o.float || 0)) * u + p[1] * u * (1 - sq)];
}

// His own moods, for feel() / emotions(): serene (meditating: eyes shut, a faint smile, slow breathing) and bliss (the
// first sip of chai: eyes shut, blushing, swaying, hearts).
EMO.serene = { eyes: 'closed', mouth: 'smile', take: .2, body: t => { const br = Math.sin(t * TAU * .22); return { sq: .012 * br, dy: -.06 * br, aL: 0, aR: 0 }; } };
EMO.bliss = { eyes: 'closed', mouth: 'cat', blush: .7, emote: 'hearts', take: .4, body: t => { const w = Math.sin(t * TAU * .45); return { rot: .03 * w, dy: -.12 * Math.abs(w), sq: .02, aL: 0, aR: 0 }; } };

function shiva(x, y, u, o = {}) {
  const id = o.boilKey ?? 'sh' + (++CLAWD_N), rs = p => boilSeed(`shiva ${id} ${p}`);
  x += (o.dx || 0) * u;
  const fl = o.float || 0, dy = ((o.dy || 0) - fl) * u, sq = o.sq || 0, sw = clamp(u / 20, .4, 2.2) * (o.swMul || 1), J = u * .04;
  const { col: col0, dk, lt } = tintCols({ ...o, col: o.col || SHV.skin, dk: o.dk || SHV.skinDk, lt: o.lt || SHV.skinLt });
  const P = pts => U(pts, u), INK = SHV.ink, only = o.only, hx = clamp(o.hx || 0, -1, 1), lean = o.lean || 0;
  const ash = clamp(o.ash || 0), groom = (o.groom || 0) > .5;
  const col = mixCol(col0, '#C3CCD8', .4 * ash);   // ash greys his blue

  if (!o.noShadow && only !== 'arms') {
    rs('shadow');
    const f = 1 - Math.min(.5, fl * .06);
    paint(ellPts(x, y + u * .1, u * 7.6 * f, u * 1.15 * f, 24), { fill: PAL.ink, fillOp: 80, bleed: .25, tex: .3, border: .1, ink: null });
  }
  push();
  translate(x, y + dy);
  if (o.rot) rotate(o.rot);
  scale((o.flip ? -1 : 1) * (1 + sq * .6), 1 - sq);

  if (only !== 'arms') {
    // ---- back hair: long locks behind the head, falling past the shoulders
    rs('hairback');
    push(); translate(lean * .8 * u, 0);
    for (const s of [-1, 1]) {
      const sway = Math.sin(T * 1.3 + s) * .12;
      paint(P([[s * 2.6, -16.4], [s * 4.3, -14.8], [s * 5, -12.6], [s * 5.1 + sway, -10.4], [s * 5.5 + sway, -8.6], [s * 5.9 + sway, -7.2], [s * 5.1 + sway, -7.6], [s * 4.8 + sway, -6.7], [s * 4.3, -7.9], [s * 3.9, -9.6], [s * 3.2, -12]]),
        { wash: SHV.hair, fill: SHV.hairDk, fillOp: 70, tex: .6, border: .5, ink: INK, sw: sw * .85, curv: .45 });
      inkLine(P([[s * 3.9, -14.2], [s * 4.5, -11.8], [s * 4.8 + sway, -9.2]]), sw * .45, SHV.hairLt, 'inkfine', .5);
    }
    pop();

    if (groom) {   // the yellow silk shawl, over both shoulders and down behind the arms
      rs('shawl');
      for (const s of [-1, 1]) {
        const sway = Math.sin(T * 1.4 + s) * .1;
        paint(ribbon(P([[s * 2.6, -9.9], [s * 4.3, -9.1], [s * 5.3 + sway, -6.8], [s * 5.8 + sway, -3.6]]), 1.9 * u, 1.5 * u), { wash: SHV.silk, fill: SHV.silkDk, fillOp: 80, tex: .5, ink: INK, sw: sw * .8 });
        inkLine(P([[s * 3.4, -9.9], [s * 5, -8.9], [s * 6, -6.7], [s * 6.5 + sway, -3.7]]), sw * 1.3, SHV.gem, 'ink', .5);
      }
    }
    // ---- torso
    rs('torso');
    push(); translate(lean * .5 * u, 0); rotate(lean * .03);
    const torso = P([[-3.3, -3.1], [-3.7, -5.2], [-4.3, -7.4], [-4.2, -8.7], [-3, -9.5], [0, -9.8], [3, -9.5], [4.2, -8.7], [4.3, -7.4], [3.7, -5.2], [3.3, -3.1], [0, -2.9]]);
    paint(torso, { wash: col, ink: null, curv: .4 });
    paint(ellPts(-1.3 * u, -7.4 * u, 2 * u, 1.4 * u, 16, J * 2, -.3), { fill: lt, fillOp: 120, bleed: .2, tex: .8, border: .8, ink: null });
    paint(ellPts(.4 * u, -3.9 * u, 3.2 * u, 1 * u, 16, J), { fill: dk, fillOp: 80, bleed: .08, tex: .6, border: .5, ink: null });
    paint(torso, { ink: INK, sw, curv: .4 });
    for (const s of [-1, 1]) inkLine(P([[s * .4, -7.2], [s * 1.6, -6.7], [s * 2.7, -7.1]]), sw * .45, SHV.skinDk, 'inkfine', .5);   // chest
    inkLine(P([[-.22, -4.6], [0, -4.35], [.22, -4.6]]), sw * .55, INK, 'inkfine', .6);   // navel
    if (ash > .02) {   // smeared ash: broad pale strokes and a dusting
      rs('ash');
      for (const [a, b, w] of [[[-3.4, -8.2], [-1, -8.9], 1.3], [[.4, -6.3], [3.1, -7.2], 1.2], [[-2.9, -5.7], [-.6, -5.1], 1.1], [[1, -4.7], [3, -4.2], 1]])
        paint(ribbon(P([a, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - .2], b]), .55 * u * w, .25 * u * w), { wash: SHV.ash, washOp: 235 * ash, ink: null });
      for (let k = 0; k < 10; k++) paint(ellPts(lerp(-3.2, 3.2, hash(k + 5)) * u, lerp(-9, -3.6, hash(k + 17)) * u, .14 * u, .12 * u, 6), { wash: SHV.ash, washOp: 200 * ash, ink: null });
    }

    // ---- rudraksha mala: a U of beads, then Vasuki over the collarbones
    rs('mala');
    for (let k = 0; k <= 14; k++) {
      const bx = lerp(-2.5, 2.5, k / 14), by = -9.35 + 3.2 * (1 - (bx / 2.5) ** 2);
      paint(ellPts(bx * u, by * u, .3 * u, .3 * u, 9), { wash: SHV.bead, fill: SHV.beadDk, fillOp: 60, tex: .4, ink: INK, sw: sw * .4 });
    }
    paint(ellPts(0, -5.7 * u, .45 * u, .5 * u, 10), { wash: SHV.gold, ink: INK, sw: sw * .45 });
    pop();

    // ---- lotus lap: the tiger-skin wrap, with the feet up on the thighs (noLap: none, for shivaLie())
    if (!o.noLap) {
    rs('lap');
    const lap = P([[-7, -1.3], [-6.7, -2.7], [-5.6, -3.8], [-3.4, -4.2], [0, -3.6], [3.4, -4.2], [5.6, -3.8], [6.7, -2.7], [7, -1.3], [6.2, -.3], [3.8, .05], [0, .1], [-3.8, .05], [-6.2, -.3]]);
    paint(lap, { wash: SHV.tiger, fill: SHV.tigerDk, fillOp: 90, bleed: .06, tex: .7, border: .5, ink: INK, sw: sw * .9, curv: .5 });
    for (const st of [[[-5.4, -2.6], [-4.8, -1.9], [-4.9, -1.1]], [[-3.9, -3.2], [-3.4, -2.3]], [[-1.4, -2.9], [-1.1, -1.9], [-1.5, -1.1]], [[1.2, -.4], [1.6, -1.3]],
                      [[3.8, -3.3], [3.3, -2.4], [3.5, -1.6]], [[5.3, -2.4], [4.8, -1.4]], [[-2.6, -.3], [-2.2, -1.1]], [[.2, -3], [.5, -2.3]]])
      paint(ribbon(P(st), .42 * u, .06 * u), { wash: SHV.stripe, washOp: 230, ink: null });
    inkLine(P([[-3.4, -3.95], [-1.6, -3.6], [0, -3.5], [1.6, -3.6], [3.4, -3.95]]), sw * 1.4, SHV.gold, 'ink', .5);   // waist cord
    rs('feet');
    for (const s of [-1, 1]) {
      paint(ellPts(s * 2.5 * u, -3.05 * u, 1.55 * u, .66 * u, 16, J, s * -.2), { wash: col, fill: dk, fillOp: 50, tex: .5, ink: INK, sw: sw * .8 });
      paint(ellPts(s * 2.35 * u, -3.02 * u, 1 * u, .36 * u, 12, 0, s * -.2), { wash: mixCol(SHV.sole, col, .25), ink: null });
      for (const k of [0, 1, 2]) inkLine(P([[s * (3.55 + k * .02), -3.35 + k * .3], [s * (3.95 + k * .02), -3.4 + k * .3]]), sw * .4, INK, 'inkfine', 0);   // toes
    }
    }
  }

  // ---- head (with the snake's head riding the shoulder next to it)
  if (only !== 'arms') {
    push(); translate(lean * u, 0);
    snakeBody(u, o, sw, rs, INK);
    if (groom) {
      rs('collar');   // a jewelled gold collar over Vasuki
      inkLine(P([[-2.9, -9.7], [-1.6, -8.5], [0, -8.15], [1.6, -8.5], [2.9, -9.7]]), sw * 2.6, SHV.gold, 'ink', .6);
      for (const k of [-2, -1, 0, 1, 2]) { const bx = k * .95; paint(ellPts(bx * u, (-8.2 - .12 * k * k) * u, .26 * u, .3 * u, 8), { wash: k % 2 ? SHV.gem2 : SHV.gem, ink: INK, sw: sw * .35 }); }
      paint(P([[0, -7.85], [.55, -7.2], [0, -6.4], [-.55, -7.2]]), { wash: SHV.gold, ink: INK, sw: sw * .45 });
      paint(ellPts(0, -7.15 * u, .22 * u, .26 * u, 8), { wash: SHV.gem, ink: null });
      rs('garland');   // marigolds and roses in a long U down to his lap
      const g = through(P([[-3.3, -9.6], [-3.6, -7.2], [-2.6, -4.9], [0, -4.2], [2.6, -4.9], [3.6, -7.2], [3.3, -9.6]]));
      for (let i = 0, n = 0; i < g.length; i += Math.max(1, Math.floor(g.length / 24)), n++)
        paint(ellPts(g[i][0], g[i][1], .42 * u, .36 * u, 10, u * .04), { wash: n % 4 === 2 ? SHV.rose : n % 2 ? SHV.marigold : '#E07A1F', ink: INK, sw: sw * .3 });
    }
    push(); translate(hx * .5 * u, 0);
    if (o.htilt) { translate(0, -10 * u); rotate(o.htilt); translate(0, 10 * u); }
    rs('ears');
    for (const s of [-1, 1]) paint(ellPts(s * 3.6 * u, -12.7 * u, .75 * u, 1.1 * u, 14, J), { wash: col, fill: dk, fillOp: 60, tex: .5, ink: INK, sw: sw * .8 });
    rs('head');
    const head = ellPts(0, -13 * u, 3.65 * u, 3.45 * u, 32, J);
    paint(head, { wash: col, ink: null });
    paint(ellPts((-1.3 + hx) * u, -14.3 * u, 1.9 * u, 1.1 * u, 16, J * 2, -.2), { fill: lt, fillOp: 120, bleed: .2, tex: .85, border: .8, ink: null });
    paint(ellPts(0, -10.2 * u, 2.8 * u, .9 * u, 16, J), { fill: dk, fillOp: 70, bleed: .1, tex: .6, border: .5, ink: null });
    paint(head, { ink: INK, sw });
    rs('kundal');
    for (const s of [-1, 1]) {   // gold hoops hanging from the ears
      const sw_ = Math.sin(T * 2.1 + s) * .08;
      push(); translate(s * 3.75 * u, -11.9 * u); rotate(sw_);
      inkLine(ellPts(0, .95 * u, .62 * u, .75 * u, 16).concat([[.62 * u, .95 * u]]), sw * 1.3, SHV.gold, 'ink', .6);
      pop();
    }

    push(); translate(hx * .9 * u, 0);
    shivaFace3(u, o, sw, rs, INK);
    pop();

    // ---- hair: front cap with a centre parting, then the jata bun, the moon and Ganga
    rs('hairfront');
    paint(P([[-3.75, -12.6], [-3.95, -14.3], [-3.25, -15.9], [-1.8, -16.8], [0, -17.05], [1.8, -16.8], [3.25, -15.9], [3.95, -14.3], [3.75, -12.6], [3.25, -13.5], [2.7, -15.05], [1.3, -15.65], [.15, -15.35], [0, -15.6], [-.15, -15.35], [-1.3, -15.65], [-2.7, -15.05], [-3.25, -13.5]]),
      { wash: SHV.hair, fill: SHV.hairDk, fillOp: 60, tex: .6, border: .5, ink: INK, sw: sw * .9, curv: .4 });
    for (const s of [-1, 1]) inkLine(P([[s * .5, -16.6], [s * 1.8, -16.2], [s * 3, -15.1]]), sw * .45, SHV.hairLt, 'inkfine', .5);
    rs('bun');
    paint(ellPts(0, -18.6 * u, 2.45 * u, 2.1 * u, 24, J), { wash: SHV.hair, fill: SHV.hairDk, fillOp: 70, tex: .6, border: .5, ink: INK, sw: sw * .9 });
    paint(ellPts(.1 * u, -20.7 * u, 1.35 * u, 1.05 * u, 18, J), { wash: SHV.hair, fill: SHV.hairDk, fillOp: 50, tex: .6, border: .5, ink: INK, sw: sw * .8 });
    inkLine(P([[-1.9, -18.9], [-1, -19.9], [.6, -19.9], [1.8, -19]]), sw * .5, SHV.hairLt, 'inkfine', .6);   // coils
    inkLine(P([[-1.6, -17.8], [-.4, -18.7], [1.2, -18.5], [2, -17.6]]), sw * .5, SHV.hairLt, 'inkfine', .6);
    inkLine(P([[-.6, -20.8], [.3, -21.3], [1, -20.6]]), sw * .45, SHV.hairLt, 'inkfine', .6);
    for (let k = 0; k < 7; k++) {   // a rudraksha band round the base of the bun
      const bx = lerp(-2.1, 2.1, k / 6);
      paint(ellPts(bx * u, (-16.85 - .25 * (1 - (bx / 2.1) ** 2)) * u, .27 * u, .27 * u, 8), { wash: SHV.bead, ink: INK, sw: sw * .35 });
    }
    if (ash > .02) { rs('jataash'); for (let k = 0; k < 8; k++) paint(ellPts(lerp(-2, 2, hash(k + 31)) * u, lerp(-21.2, -17.4, hash(k + 41)) * u, .13 * u, .11 * u, 6), { wash: SHV.ash, washOp: 210 * ash, ink: null }); }
    if (groom) {   // a gold crown round the base of the bun
      rs('crown');
      paint(P([[-2.5, -16.7], [2.5, -16.7], [2.4, -18.3], [1.9, -18], [1.6, -19.9], [.8, -19], [0, -21.4], [-.8, -19], [-1.6, -19.9], [-1.9, -18], [-2.4, -18]]), { wash: SHV.gold, fill: SHV.goldDk, fillOp: 60, tex: .5, ink: INK, sw: sw * .7, curv: .12 });
      inkLine(P([[-2.4, -17.15], [2.4, -17.15]]), sw * .9, SHV.goldDk, 'inkfine', 0);
      paint(ellPts(0, -18.75 * u, .38 * u, .46 * u, 8), { wash: SHV.gem, ink: INK, sw: sw * .35 });
      for (const s of [-1, 1]) paint(ellPts(s * 1.45 * u, -17.85 * u, .2 * u, .22 * u, 6), { wash: SHV.gem2, ink: null });
    }
    rs('moon');
    push(); translate(-2.35 * u, -18.5 * u); rotate(-.5 + (o.moonWob || 0)); scale(1.3);
    const moonP = []; for (let k = 0; k <= 12; k++) { const a = -1.3 + k / 12 * 2.6; moonP.push([Math.cos(a + Math.PI) * 1.25 * u, Math.sin(a + Math.PI) * 1.25 * u]); }
    for (let k = 12; k >= 0; k--) { const a = -1.1 + k / 12 * 2.2; moonP.push([Math.cos(a + Math.PI) * .85 * u + .35 * u, Math.sin(a + Math.PI) * .95 * u]); }
    paint(moonP, { wash: SHV.moon, fill: SHV.moonDk, fillOp: 50, tex: .4, ink: INK, sw: sw * .6, curv: .3 });
    pop();
    const gk = o.ganga ?? 1;
    if (gk > .02) {   // Ganga: a little fountain from the top knot, arcing out to the right and falling in drops
      rs('ganga');
      const h = .8 + .9 * gk, reach = 1.2 + .8 * gk, wv = Math.sin(T * 6) * .08;
      const path = [[.2, -21.6], [.35 + wv, -21.6 - h * .6], [.9, -21.6 - h], [reach * .8 + .6, -21.6 - h * .8], [reach + .8, -21.4 - h * .2]];
      paint(ribbon(P(path), .45 * u, .2 * u), { wash: SHV.ganga, fill: SHV.gangaDk, fillOp: 40, tex: .4, ink: INK, sw: sw * .45 });
      for (let k = 0; k < 3; k++) {
        const f = frac(T * 1.6 + k / 3), dx_ = reach + .8 + f * .5 * gk, dy_ = -21.4 - h * .2 + f * f * 2.4;
        paint(ellPts(dx_ * u, dy_ * u, .16 * u * (1 - f * .4), .22 * u * (1 - f * .4), 8), { wash: SHV.ganga, ink: INK, sw: sw * .3 });
      }
    }
    pop();
    snakeHead(u, o, sw, rs, INK);
    pop();
  }

  // ---- arms, last: over the lap, the snake and anything drawn between his body and his arms
  if (only !== 'body') {
    push(); translate(lean * .5 * u, 0);
    for (const s of [-1, 1]) {
      rs('arm' + s);
      const [sh, el, ha] = shivaArm({ ...o, lean: 0 }, s), hook = s < 0 ? o.armL : o.armR;
      paint(ribbon(P([sh, el, ha]), 1.6 * u, 1.15 * u), { wash: col, fill: dk, fillOp: 40, tex: .5, ink: INK, sw: sw * .85 });
      const at = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)], perp = (a, b, w) => { const d = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [-(b[1] - a[1]) / d * w, (b[0] - a[0]) / d * w]; };
      const band = (a, b, k, w, c, t) => { const p = at(a, b, k), n = perp(a, b, w); inkLine(P([[p[0] - n[0], p[1] - n[1]], [p[0] + n[0], p[1] + n[1]]]), sw * t, c, 'ink', 0); };
      for (const k of [.3, .42, .54]) { const p = at(sh, el, k), n = perp(sh, el, .38); inkLine(P([[p[0] - n[0], p[1] - n[1]], [p[0] + n[0], p[1] + n[1]]]), sw * .9, SHV.ash, 'inkfine', 0); }   // ash stripes
      band(sh, el, .72, .72, SHV.gold, 1.5);   // armlet
      if (groom) { band(sh, el, .82, .72, SHV.gold, 1.5); const p = at(sh, el, .77); paint(ellPts(p[0] * u, p[1] * u, .25 * u, .25 * u, 8), { wash: SHV.gem, ink: INK, sw: sw * .35 }); }
      if (ash > .02) { const a = at(el, ha, .2), b = at(el, ha, .55); paint(ribbon(P([a, b]), .55 * u, .3 * u), { wash: SHV.ash, washOp: 160 * ash, ink: null }); }
      band(el, ha, .78, .6, SHV.gold, 1.3);    // bangle
      push(); translate(ha[0] * u, ha[1] * u);
      const rest = !(s < 0 ? o.handL : o.handR) && o.mudra !== false;
      paint(ellPts(0, 0, .85 * u, .72 * u, 14, J), { wash: col, ink: INK, sw: sw * .8 });
      if (rest) inkLine(ellPts(s * .15 * u, -.2 * u, .3 * u, .26 * u, 10).concat([[s * .15 * u + .3 * u, -.2 * u]]), sw * .55, INK, 'inkfine', .5);   // chin mudra: thumb and finger in a ring
      else for (const k of [-.25, .15]) inkLine(P([[-.35 * s, k], [.05 * s, k + .1]]), sw * .4, INK, 'inkfine', 0);
      if (hook) hook(u, sw);
      pop();
    }
    pop();
  }
  pop();

  if (o.emote && only !== 'arms') {
    rs('emote');
    const top = EMOTE_TOP.includes(o.emote), dir = o.flip ? -1 : 1;
    emote(o.emote, top ? x : x + dir * 6.5 * u, y + dy + (top ? -25 : -17) * u * (1 - sq), u * 1.2, o.emoteK ?? 1, o.emoteAge ?? T);
  }
  rs('after');
}

// The face: tripundra and the third eye, brows, eyes, nose and mouth. Body-local, already shifted for the head turn.
function shivaFace3(u, o, sw, rs, INK) {
  const P = pts => U(pts, u);
  rs('tripundra');
  for (const [k, yy] of [[0, -14.9], [1, -14.45], [2, -14]]) paint(ribbon(P([[-2.3, yy + .12], [-1.2, yy - .05], [0, yy - .08], [1.2, yy - .05], [2.3, yy + .12]]), .24 * u, .2 * u), { wash: SHV.ash, washOp: 240, ink: null });
  // third eye: a vertical almond on the middle line; closed it's a seam with lashes
  rs('third');
  const k3 = clamp(o.third || 0), g = clamp(o.thirdGlow || 0), shk = (o.thirdShake || 0) * Math.sin(T * 90) * u;
  const ember = o.thirdCol || SHV.ember, eye3 = o.thirdCol || SHV.eye3, eye3Dk = o.thirdCol ? mixCol(o.thirdCol, SHV.eye3Dk, .45) : SHV.eye3Dk;
  push(); translate(shk, -14.45 * u);
  if (g > .01) glow(0, 0, u * (2.2 + 3 * g + 2 * k3), ember, g);
  const lens = (w, h) => { const p = []; for (let i = 0; i <= 12; i++) { const a = i / 12; p.push([Math.sin(Math.PI * a) * w, -h / 2 + h * a]); } for (let i = 11; i > 0; i--) { const a = i / 12; p.push([-Math.sin(Math.PI * a) * w, -h / 2 + h * a]); } return p; };
  const h3 = 1.55 * u * (1 + .15 * k3);
  if (k3 < .04) {
    if (g > .02) paint(lens(.14 * u * (1 + g), h3 * .9), { wash: ember, washOp: 255, ink: null });   // the red crack
    paint(lens(.2 * u, h3), { wash: mixCol(SHV.skin, SHV.skinDk, .4), washOp: 120, ink: INK, sw: sw * .7 });
    inkLine([[0, -h3 / 2], [0, h3 / 2]], sw * .9, INK, 'ink', 0);
    for (const s of [-1, 1]) for (const k of [-.25, .05, .35]) inkLine([[s * .08 * u, k * h3], [s * .38 * u, k * h3 + .12 * u]], sw * .45, INK, 'inkfine', 0);
  } else {
    const w = .62 * u * k3;
    paint(lens(w, h3), { wash: SHV.white, ink: INK, sw: sw * .8 });
    const ir = Math.min(w * .85, .45 * u);
    paint(ellPts(0, 0, ir, ir * 1.1, 14), { wash: eye3, fill: eye3Dk, fillOp: 70, tex: .4, ink: null });
    paint(ellPts(0, 0, ir * .3, ir * .75, 10), { wash: SHV.iris, ink: null });
    paint(ellPts(-ir * .35, -ir * .45, ir * .22, ir * .25, 8), { wash: SHV.white, ink: null });
    inkLine(lens(w, h3).slice(0, 13), sw * 1.2, INK, 'ink', .4);   // a heavier lid line on one side
  }
  pop();

  // brows: hair-coloured arcs; raised in surprise, pinched in anger
  rs('brows');
  const kinds = Array.isArray(o.eyes) ? o.eyes : [o.eyes || 'normal', o.eyes || 'normal'];
  const up = (o.brow ?? 0) + (kinds[0] === 'wide' || kinds[0] === 'scared' || kinds[0] === 'spark' ? .45 : 0) - (['angry', 'determined', 'narrow'].includes(kinds[0]) ? .1 : 0);
  const pinch = ['angry', 'determined'].includes(kinds[0]) ? .35 : ['sad', 'teary', 'scared'].includes(kinds[0]) ? -.3 : 0;
  for (const s of [-1, 1]) inkLine(P([[s * .75, -13.35 - up + pinch], [s * 1.45, -13.7 - up], [s * 2.2, -13.45 - up - pinch * .3]]), sw * 1.1, SHV.hair, 'ink', .5);

  rs('eyes');
  const lx = (o.lookX || 0) * u * .22, ly = (o.lookY || 0) * u * .18;
  const ownEyes = kinds.every(k => ['closed', 'normal', 'look', 'wide'].includes(k));
  if (ownEyes && (kinds.every(k => k === 'closed') || (o.squint || 0) > .5)) {   // serene: long curved lids with lashes (also his squint)
    for (const s of [-1, 1]) {
      inkLine(P([[s * .75, -12.55], [s * 1.45, -12.2], [s * 2.15, -12.5]]), sw * 1.2, INK, 'ink', .5);
      for (const k of [.2, .5, .8]) { const ex = s * lerp(.8, 2.1, k); inkLine(P([[ex, -12.3 + .12 * Math.sin(k * Math.PI) * 0], [ex + s * .12, -12.0]]), sw * .45, INK, 'inkfine', 0); }
    }
  } else if (ownEyes) {
    const wide = kinds[0] === 'wide', blink = !wide && ((T * .9 + (o.seed || 0) * 1.7) % 3.3) < .12;
    for (const s of [-1, 1]) {
      if (kinds[s < 0 ? 0 : 1] === 'closed') {   // one eye still shut: a peek, or a wink
        inkLine(P([[s * .75, -12.55], [s * 1.45, -12.2], [s * 2.15, -12.5]]), sw * 1.2, INK, 'ink', .5);
        for (const k of [.2, .5, .8]) { const ex = s * lerp(.8, 2.1, k); inkLine(P([[ex, -12.3], [ex + s * .12, -12.0]]), sw * .45, INK, 'inkfine', 0); }
        continue;
      }
      const ex = s * 1.45 * u, ey = -12.4 * u, rx = (wide ? .78 : .66) * u, ry = (wide ? .78 : .52) * u;
      if (blink) { inkLine([[ex - rx, ey], [ex, ey + .15 * u], [ex + rx, ey]], sw * 1.1, INK, 'ink', .5); continue; }
      paint(ellPts(ex, ey, rx, ry, 18), { wash: SHV.white, ink: INK, sw: sw * .6 });
      const ir = (wide ? .36 : .34) * u;
      paint(ellPts(ex + lx, ey + ly, ir, ir * 1.1, 14), { wash: SHV.iris, ink: null });
      paint(ellPts(ex + lx - .12 * u, ey + ly - .14 * u, .12 * u, .13 * u, 8), { wash: SHV.white, ink: null });
      inkLine([[ex - rx * 1.05, ey - ry * .1], [ex - rx * .3, ey - ry * 1.02], [ex + rx * .5, ey - ry * .95], [ex + rx * 1.1, ey - ry * .2]], sw * 1.3, INK, 'ink', .5);   // upper lid
    }
  } else { push(); translate(0, -12.4 * u); scale(.58); translate(0, 6 * u); eyes(u, o, sw / .58 * .85, [-1, 1], 0); pop(); }
  if (o.blush) for (const s of [-1, 1]) paint(ellPts(s * 2.25 * u, -11.2 * u, .85 * u, .45 * u, 14), { fill: PAL.rose, fillOp: 150 * clamp(o.blush), bleed: .2, tex: .4, ink: null });

  rs('nose');
  const sn = clamp(o.sniff || 0);
  push(); translate(.05 * u, (-11.55 - .25 * sn) * u); scale(1 + .25 * sn);
  inkLine(P([[.02, -.65], [-.12, -.1], [.08, .15], [.35, .05]]), sw * .75, INK, 'inkfine', .5);
  if (sn > .05) for (const s of [-1, 1]) paint(ellPts(s * .22 * u, .12 * u, .1 * u * (1 + sn), .07 * u, 8), { wash: SHV.skinDk, ink: null });
  pop();
  rs('mouth');
  push(); translate(0, -10.35 * u); scale(.48); translate(0, 4.3 * u); mouth(u, o.mouth, sw / .48 * .8); pop();
}

// Vasuki's body round the neck: a ribbon from behind his right shoulder, across the collarbones, up to his left shoulder.
function snakeBody(u, o, sw, rs, INK) {
  rs('snakebody');
  const up = clamp(o.snakeUp || 0), P = pts => U(pts, u);
  const path = [[3.1, -9.7], [3.7, -9], [2.9, -8.3], [1, -8], [-1, -8], [-2.8, -8.35], [-3.8, -9.1], [lerp(-4.3, -4.4, up), lerp(-10, -10.6, up)]];
  paint(ribbon(P(path), .4 * u, 1.05 * u), { wash: SHV.snake, fill: SHV.snakeDk, fillOp: 60, tex: .5, ink: INK, sw: sw * .7 });
  const C = through(P(path)), n = C.length;
  for (const k of [.25, .42, .58, .74, .88]) {   // bands
    const i = Math.min(n - 2, Math.floor(k * (n - 1))), [ax, ay] = C[i], [bx, by] = C[i + 1], d = Math.hypot(bx - ax, by - ay) || 1, w = lerp(.4, 1.05, k) * u * .42;
    inkLine([[ax - (by - ay) / d * w, ay + (bx - ax) / d * w], [ax + (by - ay) / d * w, ay - (bx - ax) / d * w]], sw * .8, SHV.snakeDk, 'inkfine', 0);
  }
}
// Vasuki's neck and head: resting on the shoulder, or raised and swaying toward whoever woke him.
function snakeHead(u, o, sw, rs, INK) {
  rs('snakehead');
  const up = clamp(o.snakeUp || 0), lk = o.snakeLook ?? -1, P = pts => U(pts, u), sway = Math.sin(T * 2.3) * .25 * up;
  const base = [lerp(-4.3, -4.4, up), lerp(-10, -10.6, up)];
  const hd = [lerp(-5.1, -5.4 + lk * .6 + sway, up), lerp(-10.3, -14.4, up)];
  const neck = [base, [lerp(-4.7, -4.3, up), lerp(-10.3, -12.2, up)], hd];
  paint(ribbon(P(neck), 1.05 * u, .9 * u), { wash: SHV.snake, fill: SHV.snakeDk, fillOp: 50, tex: .5, ink: INK, sw: sw * .7 });
  if (up > .3) paint(ribbon(P([[neck[1][0] + .15, neck[1][1] + .6], [hd[0] + .1, hd[1] + .9]]), .45 * u, .35 * u), { wash: SHV.snakeLt, ink: null });   // belly scales
  push(); translate(hd[0] * u, hd[1] * u); rotate(lerp(.35, 0, up) + lk * .15 * up);
  const hood = up * .5;
  paint(ellPts(0, .1 * u, (1.05 + hood) * u, (.8 + hood * .3) * u, 18, u * .03), { wash: SHV.snake, fill: SHV.snakeDk, fillOp: 50, tex: .5, ink: INK, sw: sw * .75 });
  paint(ellPts(lk * .25 * u, .35 * u, .6 * u, .38 * u, 12), { wash: SHV.snakeLt, ink: null });
  const ek = o.snakeEyes || 'closed';
  for (const s of [-1, 1]) {
    const ex = (s * .42 + lk * .18) * u, ey = -.12 * u;
    if (ek === 'closed') inkLine([[ex - .2 * u, ey], [ex, ey + .12 * u], [ex + .2 * u, ey]], sw * .6, INK, 'inkfine', .5);
    else if (ek === 'happy') inkLine([[ex - .2 * u, ey + .1 * u], [ex, ey - .1 * u], [ex + .2 * u, ey + .1 * u]], sw * .6, INK, 'inkfine', .5);
    else {
      paint(ellPts(ex, ey, .2 * u, .24 * u, 10), { wash: SHV.moon, ink: INK, sw: sw * .4 });
      paint(ellPts(ex + lk * .05 * u, ey, .07 * u, .17 * u, 8), { wash: PAL.ink, ink: null });
      if (ek === 'angry') inkLine([[ex - s * .28 * u, ey - .35 * u], [ex + s * .2 * u, ey - .18 * u]], sw * .8, INK, 'ink', 0);
    }
  }
  const tg = clamp(o.snakeTongue || 0);
  if (tg > .05) {
    const tx = lk * 1.1 * u * tg - (lk < 0 ? .3 * u : -.3 * u), ty = .45 * u, fl = Math.sin(T * 40) * .1 * u;
    inkLine([[lk * .5 * u, ty], [tx, ty + fl]], sw * .7, SHV.tongue, 'ink', 0);
    inkLine([[tx, ty + fl], [tx + lk * .25 * u, ty - .15 * u + fl]], sw * .5, SHV.tongue, 'ink', 0);
    inkLine([[tx, ty + fl], [tx + lk * .25 * u, ty + .15 * u + fl]], sw * .5, SHV.tongue, 'ink', 0);
  }
  pop();
}

// Shiva lying on his back (the way he lay in Kali's path): his head to screen-left, his face to us, hands behind his head,
// legs out to the right in the tiger skin. (x, y) is the ground under his waist; u as shiva(). His chest (where her
// foot lands) is shivaLieChest(x, y, u). o: every shiva() face / snake / ash option, plus thumb 0..1 (his upper hand comes
// out from behind his head with a thumbs-up), peek (one eye opens), breathe (u), noShadow, boilKey.
function shivaLieChest(x, y, u) { return [x - 4.2 * u, y - 7.6 * u]; }
function shivaLie(x, y, u, o = {}) {
  const id = o.boilKey ?? 'shl' + (++CLAWD_N), rs = p => boilSeed(`shivalie ${id} ${p}`), INK = SHV.ink, sw = clamp(u / 20, .4, 2.2) * (o.swMul || 1);
  const Px = x + 3 * u, Py = y - 4.1 * u + (o.breathe || 0) * u, th = clamp(o.thumb || 0);
  if (!o.noShadow) { rs('shadow'); paint(ellPts(x - 2 * u, y + .1 * u, u * 13, u * 1.1, 26), { fill: PAL.ink, fillOp: 80, bleed: .25, tex: .3, border: .1, ink: null }); }
  // ---- the legs, out to the right: shins and soles, then the tiger-skin wrap over the thighs
  rs('legs');
  for (const [ly, k] of [[-1.55, 1], [1.55, -1]]) {
    paint(ribbon([[x + 3.8 * u, Py + ly * u], [x + 7 * u, Py + (ly + k * .1) * u], [x + 9.2 * u, Py + (ly + k * .2) * u]], 1.75 * u, 1.35 * u), { wash: k > 0 ? SHV.skin : SHV.skinDk, ink: INK, sw: sw * .8 });
    inkLine([[x + 8.4 * u, Py + (ly - .62) * u], [x + 8.4 * u, Py + (ly + .62) * u]], sw * 1.4, SHV.gold, 'ink', 0);   // anklet
    paint(ellPts(x + 9.75 * u, Py + (ly + k * .2) * u, .62 * u, .95 * u, 14), { wash: mixCol(SHV.sole, SHV.skin, .25), ink: INK, sw: sw * .7 });
    for (const t of [-.5, -.15, .2, .5]) paint(ellPts(x + 10.35 * u, Py + (ly + k * .2 + t * 1.15) * u, .2 * u, .17 * u, 6), { wash: SHV.skin, ink: INK, sw: sw * .35 });
  }
  rs('wrap');
  const wrap = [[-.6, -3.6], [2.4, -3.75], [4.6, -3.1], [5.2, -1.6], [5.1, 1.5], [4.6, 3.1], [2.4, 3.75], [-.6, 3.6]].map(([a, b]) => [x + a * u, Py + b * u]);
  paint(wrap, { wash: SHV.tiger, fill: SHV.tigerDk, fillOp: 90, bleed: .06, tex: .7, border: .5, ink: INK, sw: sw * .9, curv: .4 });
  for (const [a, b, c] of [[.8, -3, -2], [2.2, -1.2, -.2], [3.6, -3.1, -2], [1.2, .8, 1.9], [3.0, 1.6, 2.9], [4.3, -.6, .5]]) paint(ribbon([[x + a * u, Py + b * u], [x + (a + .3) * u, Py + c * u]], .42 * u, .06 * u), { wash: SHV.stripe, washOp: 230, ink: null });
  inkLine([[x - .3 * u, Py - 3.4 * u], [x - .1 * u, Py], [x - .3 * u, Py + 3.4 * u]], sw * 1.4, SHV.gold, 'ink', .5);   // waist cord
  // ---- the rest of him, rotated to lie down: the arms first, so his head is over his hands
  const hand = (s, k) => s < 0 ? [-3.1, -15.7] : [lerp(3.1, 7.8, k), lerp(-15.7, -16.4, k)];
  const so = { ...SHV_SKIN, eyes: o.peek ? ['closed', 'normal'] : 'closed', mouth: 'smile', ganga: 0, ...o, rot: -Math.PI / 2, noLap: true, noShadow: true, mudra: false, boilKey: id,
    handL: hand(-1, 0), handR: hand(1, th), bendL: 1.6, bendR: lerp(1.6, -.6, th),
    armR: th > .3 ? (uu, sww) => { push(); rotate(Math.PI / 2); paint(ribbon(U([[0, -.2], [0, -1.3], [.08, -1.8]], uu), .55 * uu, .42 * uu), { wash: SHV.skin, ink: INK, sw: sww * .6 }); paint(ellPts(0, 0, .85 * uu, .72 * uu, 14), { wash: SHV.skin, ink: INK, sw: sww * .8 }); for (const k of [-.3, .1, .45]) inkLine(U([[-.5, k], [.1, k + .05]], uu), sww * .45, INK, 'inkfine', 0); pop(); } : undefined };
  shiva(Px, Py, u, { ...so, only: 'arms' });
  shiva(Px, Py, u, { ...so, only: 'body' });
}

// Model sheet: studio.html?loop=shiva, or node render.mjs --loop=shiva --sheet=0.5 --cols=1 --w=1080
(() => {
  LOOPS.shiva = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: PAL.paper, ink: null });
    const S = SHV_SKIN;
    shiva(290, 820, 20, { ...S, eyes: 'closed', mouth: 'smile', ganga: 1 });
    shiva(790, 820, 20, { ...S, eyes: 'closed', mouth: 'flat', third: 0, thirdGlow: .5 + .5 * Math.sin(t * 6), thirdShake: .05, snakeUp: 1, snakeEyes: 'angry', snakeTongue: 1 });
    shiva(290, 1400, 20, { ...feel('surprised', t), ...S, third: 1, ganga: 2, moonWob: .3 * Math.sin(t * 9), snakeUp: .7, snakeEyes: 'open', brow: .2 });
    shiva(790, 1400, 20, { ...S, eyes: 'closed', mouth: 'o', sniff: .5 + .5 * Math.sin(t * 8), handR: [2, -10.2], bendR: 1.8, armR: u => typeof kulhad === 'function' && kulhad(0, -.3 * u, u * 1.1, 'sheet') });
    shiva(540, 1880, 16, { ...feel('love', t), ...S, handL: [-1.4, -5.4], handR: [1.4, -5.4], bendL: 2.6, bendR: 2.6, snakeUp: .6, snakeEyes: 'happy' });
  };
  LOOPS.shiva.len = 4;
  // lying down (shivaLie): studio.html?loop=shivalie
  LOOPS.shivalie = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: PAL.paper, ink: null });
    shivaLie(560, 700, 30, {});
    shivaLie(560, 1500, 30, { thumb: clamp(Math.sin(t * 1.6) * 1.5 + .5), peek: t % 2 > 1 });
  };
  LOOPS.shivalie.len = 4;
  // the baraat dress: ash (left) and the groom (right), riding Nandi; studio.html?loop=shivagroom
  LOOPS.shivagroom = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: '#4A3F78', ink: null });
    [[0, 540, { ash: 1, eyes: 'closed', mouth: 'smile' }], [1, 1300, { groom: 1, eyes: 'closed', mouth: 'smile', snakeUp: .3 }]].forEach(([i, gy, over]) => {
      const nx = 520, nu = 26, no = { walk: i ? undefined : t * .8, seed: i };
      if (typeof nandi !== 'function') return;
      nandi(nx, gy + 500, nu, no);
      const [sx, sy] = nandiSeat(nx, gy + 500, nu, no);
      shiva(sx, sy + 10, 15, { ...SHV_SKIN, ...over });
    });
  };
  LOOPS.shivagroom.len = 4;
})();
