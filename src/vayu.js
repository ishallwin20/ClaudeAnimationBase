// vayu.js: Vayu, the wind god, working nights as a Swarga-Mart courier. Sky-blue, white windswept hair, a saffron cap
// and vest, an insulated delivery pack on his back, and no legs: from the waist down he's a tapering cloud tail.
// Load after bappa.js (he reuses U()) and clawd.js (eyes() / mouth() / emote(), so feel() and emotions() drive him).
//
// (x, y) is his WAISTLINE, where the torso meets the cloud (he floats, so there's no ground point); u is the size unit.
// He faces screen-right (add flip to face left); his tail and hair stream back to the left.
// Body-local coordinates in u (y up is negative):
//   waist 0 · torso -5.4..0 · shoulders (±2.45, -4.9) · head centre (0, -8.2), 2.55 × 2.4 · eyes (±1.3, -8.2)
//   cap -10.9..-9.6, visor out to +3.6 · pack (-4.7..-1.6, -6.6..-2) · tail down and back to about (-8, 3.5)
//
// Options (all optional):
//   pose:   dx, dy (in u), sq, rot (pivots at the waist), flip, aL, aR (arm angle: 0 = straight out, + = up, - = down),
//           armL(u, sw) / armR(u, sw) (hooks at the hand; facing right, aR is the near arm), hx (-1..1 head turn)
//   motion: speed 0..1 (tail stretches out flat behind, hair streams, speed lines), tail (phase of the tail's ripple)
//   face:   eyes, mouth, lookX / lookY, squint, blush, seed, tint + tintK (from feel / emotions); shades 0..1
//           (1 = on his eyes, 0 = pushed up onto the cap brim; omit for none)
//   extras: pack (default true), emote + emoteK + emoteAge, boilKey, glowK (a soft blue aura, for flight)
const VAY = {
  skin: '#86C3E6', skinDk: '#5C9DC8', skinLt: '#C4E4F5', ink: '#23304F',
  hair: '#F4F7FB', hairDk: '#C5D6E6', cloud: '#EEF5FB', cloudDk: '#B9D3EA',
  saff: '#F29250', saffDk: '#CF6630', saffLt: '#FFC98F', cream: '#FCE6C8', lens: '#2A2740', gold: '#EDB43C',
};

// The Swarga-Mart mark: a little cloud with a lightning bolt through it. (x, y) = centre, s = size (about 2s wide).
function swargaMark(x, y, s, sw = 1, cloud = VAY.cream, bolt = VAY.gold) {
  const c = [[-1, .35], [-.95, -.05], [-.55, -.35], [-.3, -.62], [.15, -.7], [.5, -.45], [.85, -.4], [1.05, -.05], [.95, .35]].map(([a, b]) => [x + a * s, y + b * s]);
  paint(c, { wash: cloud, ink: VAY.ink, sw: sw * .7, curv: .6 });
  paint([[.12, -.95], [-.38, .1], [-.02, .1], [-.22, .95], [.42, -.2], [.06, -.2], [.28, -.95]].map(([a, b]) => [x + a * s, y + b * s]), { wash: bolt, ink: VAY.ink, sw: sw * .55 });
}

function vayu(x, y, u, o = {}) {
  const id = o.boilKey ?? 'v' + (++CLAWD_N), rs = p => boilSeed(`vayu ${id} ${p}`);
  x += (o.dx || 0) * u;
  const dy = (o.dy || 0) * u, sq = (o.sq || 0), sw = clamp(u / 20, .4, 2) * (o.swMul || 1), J = u * .05;
  const { col, dk, lt } = tintCols({ ...o, col: o.col || VAY.skin, dk: o.dk || VAY.skinDk, lt: o.lt || VAY.skinLt });
  const P = pts => U(pts, u), INK = VAY.ink, sp = clamp(o.speed || 0), ph = o.tail ?? T * 1.3, hx = clamp(o.hx || 0, -1, 1);

  push();
  translate(x, y + dy);
  if (o.rot) rotate(o.rot);
  scale((o.flip ? -1 : 1) * (1 + sq * .6), 1 - sq);

  if (o.glowK) glow(-1 * u, -3 * u, 12 * u, '#6FB6FF', o.glowK * .6);

  // ---- speed lines (behind everything): stable per line, longer with speed
  if (sp > .05) {
    rs('speed');
    for (let i = 0; i < 7; i++) {
      const yy = lerp(-10, 3.5, hash(i * 3.1)) , x0 = -3 - 4 * hash(i * 7.7) - sp * 2, len = (4 + 6 * hash(i * 1.3)) * sp;
      inkLine(P([[x0, yy], [x0 - len, yy + len * .03]]), sw * (.5 + .4 * hash(i)), mixCol(VAY.cloudDk, '#FFFFFF', .3), 'inkfine', 0);
    }
  }

  // ---- cloud tail: one tapered ribbon that curls down and back, with puffs along its top edge; speed pulls it out flat
  rs('tail');
  const tw = k => Math.sin((ph - k * .9) * TAU) * (.35 + .5 * k) * (1 - sp * .5);
  const tpath = [0, .18, .36, .54, .72, .88, 1].map(k => {
    const cx = lerp(-k * 3.2 - k * k * 4.6, -k * 13, sp), cy = lerp(k * 4.4 - k * k * 1.6, k * 1.4, sp);
    return [cx, cy + tw(k)];
  });
  paint(ribbon(P(tpath), 4.6 * u, .5 * u), { wash: VAY.cloud, fill: VAY.cloudDk, fillOp: 70, bleed: .08, tex: .6, border: .6, ink: INK, sw: sw * .8 });
  for (const [k, r] of [[.2, 1.5], [.42, 1.15], [.63, .85]]) {   // puffs riding the tail
    const i = Math.round(k * 6), [px, py] = tpath[i];
    paint(ellPts((px - .2) * u, (py - .9 * (1 - sp * .6)) * u, r * u, r * .8 * u, 16, J), { wash: VAY.cloud, fill: VAY.cloudDk, fillOp: 40, tex: .5, ink: INK, sw: sw * .6 });
  }
  inkLine(P([[-.6, 1.2], [-1.8, 2.3 - sp], [-3.2, 2.7 - sp * 1.2]]), sw * .45, VAY.cloudDk, 'inkfine', .5);   // a curl line inside

  // ---- delivery pack, strapped on his back (behind the torso)
  if (o.pack !== false) {
    rs('pack');
    paint(rrPts(-4.8 * u, -6.7 * u, 3.4 * u, 4.8 * u, .45 * u, J), { wash: VAY.saff, fill: VAY.saffDk, fillOp: 90, tex: .6, border: .5, ink: INK, sw: sw * .85 });
    inkLine(P([[-4.6, -5.6], [-1.6, -5.6]]), sw * .5, VAY.saffDk, 'inkfine', 0);   // the lid seam
    swargaMark(-3.25 * u, -3.7 * u, .95 * u, sw);
  }

  // ---- arms: the far one (aL) goes behind the torso, the near one (aR) in front
  const drawArm = s => {
    rs('arm' + s);
    const a = (s < 0 ? o.aL : o.aR) ?? -1.05, hook = s < 0 ? o.armL : o.armR, L = 3.1 * u, ex = Math.cos(a) * L, ey = -Math.sin(a) * L;
    push(); translate((s < 0 ? -1.8 : 2.3) * u, -4.8 * u);
    const nx = -ey / L * .3 * u, ny = ex / L * .3 * u;
    const c = s < 0 ? mixCol(col, dk, .45) : col;
    paint(ribbon([[0, 0], [ex * .5 + nx, ey * .5 + ny], [ex, ey]], 1.25 * u, .9 * u), { wash: c, fill: dk, fillOp: 40, tex: .5, ink: INK, sw: sw * .8 });
    paint(ellPts(ex * .08, ey * .08, 1 * u, .8 * u, 14, J), { wash: s < 0 ? VAY.saffDk : VAY.saff, ink: INK, sw: sw * .7 });   // vest shoulder cap
    push(); translate(ex, ey);
    paint(ellPts(0, 0, .75 * u, .7 * u, 14, J), { wash: c, ink: INK, sw: sw * .75 });
    inkLine(P([[-.3, -.2], [.1, -.1]]), sw * .35, INK, 'inkfine', 0);
    if (hook) hook(u, sw);
    pop(); pop();
  };
  drawArm(-1);

  // ---- torso: a sky-blue chest under a saffron vest with a cream stripe and the mark, a cream sash at the waist
  rs('torso');
  paint(P([[-2.1, -5.45], [2.1, -5.45], [2.85, -4.4], [2.8, -2.6], [2.2, -.8], [1.5, .2], [-1.5, .2], [-2.2, -.8], [-2.8, -2.6], [-2.85, -4.4]]),
    { wash: VAY.saff, fill: VAY.saffDk, fillOp: 70, bleed: .05, tex: .6, border: .5, ink: INK, sw: sw * .9, curv: .45 });
  paint(P([[-.9, -5.4], [.9, -5.4], [.35, -3.8], [-.35, -3.8]]), { wash: col, ink: INK, sw: sw * .6, curv: .2 });   // the V of the neck
  inkLine(P([[-2.4, -2.6], [-1, -3.6], [.6, -3.5]]), sw * .8, VAY.cream, 'ink', .5);   // the swoosh stripe
  swargaMark(1.15 * u, -2.5 * u, .62 * u, sw * .8);
  paint(P([[-2.15, -.75], [2.15, -.75], [1.7, .4], [-1.7, .4]]), { wash: VAY.cream, fill: VAY.saffLt, fillOp: 60, tex: .5, ink: INK, sw: sw * .7, curv: .2 });

  // ---- head
  push(); translate(hx * .5 * u, 0);
  rs('hairback');   // windswept hair streaming back off the head, longer and flatter with speed
  for (const [k, y0] of [[0, -9.8], [1, -8.6], [2, -7.4]]) {
    const w = Math.sin((T * 1.7 + k * .31) * TAU) * .35 * (1 - sp * .4), L = 3 + k * .4 + sp * 2.5;
    const pts = [[-1.2, y0], [-1.2 - L * .45, y0 - .6 + w - k * .1], [-1.2 - L * .85, y0 + .2 + w * 1.4 - sp * .4], [-1.2 - L, y0 - .5 + w * 1.8]];
    paint(ribbon(P(pts), 2.1 * u, .25 * u), { wash: VAY.hair, fill: VAY.hairDk, fillOp: 60, tex: .5, ink: INK, sw: sw * .7 });
  }
  rs('ear');
  paint(ellPts(-2.2 * u, -8 * u, .7 * u, .95 * u, 14, J), { wash: col, fill: dk, fillOp: 40, tex: .5, ink: INK, sw: sw * .7 });
  paint(ellPts(-2.3 * u, -7.2 * u, .16 * u, .2 * u, 8), { wash: VAY.gold, ink: INK, sw: sw * .35 });   // a gold stud
  rs('head');
  const head = ellPts(.1 * u, -8.35 * u, 2.85 * u, 2.6 * u, 30, J);
  paint(head, { wash: col, ink: null });
  paint(ellPts(-.8 * u, -9.1 * u, 1.3 * u, .8 * u, 14, J * 2, -.3), { fill: lt, fillOp: 120, bleed: .2, tex: .8, border: .8, ink: null });
  paint(ellPts(.2 * u, -6.4 * u, 1.9 * u, .6 * u, 14, J), { fill: dk, fillOp: 50, bleed: .1, tex: .6, border: .5, ink: null });
  paint(head, { ink: INK, sw });
  if (o.blush) for (const s of [-1, 1]) paint(ellPts((.25 + s * 1.65) * u, -7.2 * u, .6 * u, .32 * u, 12), { fill: PAL.rose, fillOp: 150 * clamp(o.blush), bleed: .2, tex: .4, ink: null });
  rs('eyes');
  const sh = o.shades;
  push(); translate((.25 + hx * .4) * u, 0);
  const kinds = Array.isArray(o.eyes) ? o.eyes : [o.eyes || 'normal', o.eyes || 'normal'];
  if (sh != null && sh >= .85) { /* behind the shades */ }
  else if (kinds.every(k => k === 'normal' || k === 'look') && !o.squint) {   // his own: round and glossy, with bushy white brows
    const lx = (o.lookX || 0) * u * .22, ly = (o.lookY || 0) * u * .18, blink = ((T * .8 + (o.seed || 0) * 1.3 + .7) % 3.1) < .12;
    for (const s of [-1, 1]) {
      const ex = s * 1.2 * u, ey = -8.45 * u;
      inkLine(P([[s * .7, -9.45], [s * 1.2, -9.7], [s * 1.75, -9.5]]), sw * 1.1, VAY.hair, 'ink', .5);
      if (blink) { inkLine([[ex - .42 * u, ey + .1 * u], [ex + .42 * u, ey + .1 * u]], sw * 1.1, VAY.lens, 'ink', .3); continue; }
      paint(ellPts(ex + lx, ey + ly, .4 * u, .52 * u, 16), { wash: VAY.lens, ink: null });
      paint(ellPts(ex + lx - .12 * u, ey + ly - .19 * u, .15 * u, .17 * u, 10), { wash: PAL.cream, washOp: 240, ink: null });
    }
  } else { push(); translate(0, -8.45 * u); scale(.55); translate(0, 6 * u); eyes(u, o, sw / .55 * .85, [-1, 1], 0); pop(); }
  rs('mouth');
  push(); translate(0, -6.3 * u); scale(.48); translate(0, 4.3 * u); mouth(u, o.mouth, sw / .48 * .8); pop();
  rs('stache');   // a small curled moustache, lifting with speed
  for (const s of [-1, 1]) paint(ribbon(P([[s * .05, -7.05], [s * .65, -7.15 - sp * .15], [s * 1.2, -6.95 - sp * .3], [s * 1.45, -7.3 - sp * .45]]), .5 * u, .12 * u), { wash: VAY.hair, fill: VAY.hairDk, fillOp: 50, ink: INK, sw: sw * .45 });
  pop();

  // ---- cap: a saffron dome with a forward visor and a little wing, sitting on the hair
  rs('cap');
  paint(P([[-2.85, -9.55], [-2.6, -10.7], [-1.4, -11.4], [.2, -11.55], [1.8, -11.2], [2.8, -10.4], [2.95, -9.65]]),
    { wash: VAY.saff, fill: VAY.saffDk, fillOp: 70, tex: .6, border: .5, ink: INK, sw: sw * .85, curv: .4 });
  paint(P([[1.6, -9.95], [2.9, -9.8], [4, -9.5], [3.9, -9.2], [2.7, -9.3], [1.6, -9.45]]), { wash: VAY.saffDk, ink: INK, sw: sw * .7, curv: .3 });   // visor
  paint(P([[-1.3, -10.2], [-2.3, -10.9], [-2.9, -10.6], [-2.2, -10.25], [-2.8, -10], [-1.9, -9.85]]), { wash: VAY.cream, ink: INK, sw: sw * .5, curv: .2 });   // wing
  paint(ellPts(.2 * u, -11.5 * u, .3 * u, .2 * u, 8), { wash: VAY.saffDk, ink: INK, sw: sw * .4 });
  // shades: on the eyes at 1, riding up onto the brim at 0
  if (sh != null) {
    rs('shades');
    const yy = lerp(-9.75, -8.5, ease(sh)), cx0 = .25 + hx * .4;
    for (const s of [-1, 1]) {
      const cx = cx0 + s * 1.3;
      paint(P([[cx - .82, yy - .45], [cx + .82, yy - .45], [cx + .75, yy + .15], [cx + .35, yy + .55], [cx - .35, yy + .55], [cx - .75, yy + .15]]), { wash: VAY.lens, ink: INK, sw: sw * .6, curv: .3 });
      inkLine(P([[cx - .5, yy - .15], [cx - .15, yy - .35]]), sw * .35, PAL.cream, 'inkfine', 0);
    }
    inkLine(P([[cx0 - .5, yy - .35], [cx0, yy - .5], [cx0 + .5, yy - .35]]), sw * .6, INK, 'ink', .5);
    inkLine(P([[cx0 - 2.1, yy - .3], [-2.4, yy - .1]]), sw * .6, INK, 'ink', 0);
  }
  pop();

  drawArm(1);
  pop();

  rs('emote');
  if (o.emote) {
    const top = EMOTE_TOP.includes(o.emote), dir = o.flip ? -1 : 1;
    emote(o.emote, top ? x : x + dir * 4.6 * u, y + dy + (top ? -13.5 : -10.5) * u * (1 - sq), u * 1.05, o.emoteK ?? 1, o.emoteAge ?? T);
  }
  rs('after');
}

// Model sheet: studio.html?loop=vayu, or node render.mjs --loop=vayu --sheet=0.5 --cols=1 --w=1080
(() => {
  LOOPS.vayu = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: PAL.paper, ink: null });
    const cells = [
      ['neutral', {}], ['cool', { shades: 1, speed: 1, aL: -2.3, aR: -2.5 }],
      ['happy', { aR: .1, shades: 0 }], ['proud', { aR: 1.9, shades: 0 }],
      ['surprised', { shades: .5 }], ['smug', { shades: 1, speed: .5, rot: .2 }],
    ];
    cells.forEach(([name, over], i) => {
      const cx = 300 + (i % 2) * 520, gy = 420 + Math.floor(i / 2) * 600;
      vayu(cx, gy, 26, { ...feel(name, t + i * .3, { seed: i }), ...over });
    });
  };
  LOOPS.vayu.len = 4;
})();
