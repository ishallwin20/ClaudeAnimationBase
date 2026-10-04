// boy.js: a modern Indian boy of about six, in a mustard tee and grey shorts, sitting cross-legged. Two drawn views:
//   boy(x, y, u, o)       from behind. (x, y) is the ground under his seat; about 16u tall, 13u wide across the knees.
//   boyFront(x, y, u, o)  from the front, holding something up in both hands (a book, a card, a plate): o.held(u, sw)
//                         draws it in body space, over his torso and lower face and under his hands.
//
// Body-local coordinates in u (y up is negative), both views:
//   seat -3.4..0 · knees (±5.4, -.9) · hem -2.8 · shoulders (±3.3, -8.2) · elbows (±4.7, -5.4) (front: ±5.8, -5.4)
//   head centre (0, -12.3), 3.8 × 3.55 · ears (±3.75, -11.8) · front: eyes (±1.45, -12.25) · nose (0, -11.3) · mouth (0, -10.4)
// boy() options:
//   pose:  bow 0..1 (head dips forward and down), hunch 0..1 (rounded shoulders, head sinks), breath -1..1 (chest rise),
//          swipe 0..1 (his right elbow kicks out, as when turning a page or swiping), hx -1..1 (head turn), dx, dy (u),
//          flip
//   light: rim 0..1 (a warm lamp rim on his left side)
//   boil:  boilKey, noShadow
// boyFront() options:
//   face:  eyes 'open' | 'read' (lids lowered, looking down) | 'happy' (closed arcs), lookX / lookY -1..1, blink 0..1,
//          brow 0..1 (raised), mouth null | 'smile' | 'grin' | 'O', blush 0..1, tilt (radians, the head only)
//   pose:  breath -1..1, handL / handR ([x, y] in u, body space), handRL / handRR (hand angles, radians), held(u, sw)
//   light: rim 0..1 (warm lamp rim on his right side), glow 0..1 (warm light on his face from what he holds)
//   boil:  boilKey, noShadow
const BOY = {
  skin: '#B97A55', skinDk: '#94593A', skinLt: '#D69B72', hair: '#2E2420', hairLt: '#55402F', hairRim: '#7A5A3E',
  tee: '#C8952E', teeDk: '#A07322', teeLt: '#E2B656', shorts: '#5E6E7C', shortsDk: '#4A5866', stripe: '#8A9AA6',
  ink: '#33231C', lash: '#241914', cheek: '#C9775A',
};

function boy(x, y, u, o = {}) {
  const id = o.boilKey ?? 'boy' + (++CLAWD_N), rs = p => boilSeed(`boy ${id} ${p}`);
  const sw = clamp(u / 22, .4, 2), J = u * .03, P = pts => pts.map(([a, b]) => [a * u, b * u]), INK = BOY.ink;
  const bow = o.bow || 0, hunch = o.hunch || 0, br = o.breath || 0, swp = o.swipe || 0, rim = o.rim || 0;
  x += (o.dx || 0) * u; y += (o.dy || 0) * u;

  rs('shadow');
  if (!o.noShadow) paint(ellPts(x, y + u * .2, u * 7.6, u * 1.5, 28), { fill: '#3A2618', fillOp: 90, bleed: .25, tex: .3, border: .1, ink: null });
  push(); translate(x, y); if (o.flip) scale(-1, 1);

  // ---- legs: the knees stick out either side of his back; the crossed shins are hidden in front of him
  rs('legs');
  for (const s of [-1, 1]) {
    paint(P(ellPts(s * 5.45, -.95, 1.35, 1.05, 16, .03)), { wash: s < 0 ? BOY.skinLt : BOY.skin, ink: INK, sw });
    paint(P([[s * 2.2, -3.1], [s * 3.7, -2.9], [s * 4.75, -2.25], [s * 5.0, -1.2], [s * 4.7, -.15], [s * 3.4, .15], [s * 2.2, .1]]), { wash: BOY.shorts, ink: INK, sw, curv: .4 });
    inkLine(P([[s * 4.55, -2.0], [s * 4.75, -1.0], [s * 4.5, -.25]]), sw * .6, BOY.stripe, 'inkfine');
  }
  // a sole peeks out under his right knee (screen left, from behind): his left foot tucked across
  paint(P(ellPts(-3.9, -.15, .9, .5, 12, .02, .3)), { wash: BOY.skinLt, ink: INK, sw: sw * .8 });
  paint(P(rrPts(-3.7, -3.5, 7.4, 3.75, 1.4)), { wash: BOY.shorts, fill: BOY.shortsDk, fillOp: 70, bleed: .05, tex: .5, border: .4, ink: INK, sw });

  // ---- arms: elbows show either side of the back; the forearms go forward, out of sight
  rs('arms');
  const elbow = s => s > 0 ? [4.75 + .7 * swp, -5.45 - .55 * swp] : [-4.7, -5.3];
  for (const s of [-1, 1]) {
    const e = elbow(s), sh = [s * 3.2, -7.9 + hunch * .35 - br * .12];
    paint(P(ribbon([sh, [lerp(sh[0], e[0], .55) + s * .25, lerp(sh[1], e[1], .55)], e, [s * 3.3, -4.3]], 1.9, 1.4)), { wash: s < 0 ? BOY.skinLt : BOY.skin, ink: INK, sw, curv: .3 });
  }

  // ---- torso: a mustard tee, hunched over whatever is in his lap; breath lifts the shoulders
  rs('tee');
  const sh = -8.3 + hunch * .45 - br * .14, tee = [[-3.95, -2.75], [-4.05, -4.6], [-3.85, -6.5], [-3.5 - hunch * .2, sh + .3], [-2.7, sh - .55], [-1.2, sh - .75 + hunch * .25],
    [1.2, sh - .75 + hunch * .25], [2.7, sh - .55], [3.5 + hunch * .2, sh + .3], [3.85, -6.5], [4.05, -4.6], [3.95, -2.75], [0, -2.6]];
  paint(P(tee), { wash: BOY.tee, ink: INK, sw, curv: .5 });
  paint(P([[.6, sh - .5], [3.3, sh - .1], [3.9, -5.5], [3.9, -2.9], [1.2, -2.75]]), { fill: BOY.teeDk, fillOp: 120, bleed: .12, tex: .5, border: .3, ink: null });
  if (rim > 0) paint(P([[-3.5, sh + .5], [-2.6, sh - .4], [-2.9, -6.5], [-3.5, -4.0], [-3.8, -4.4], [-3.9, -6.6]]), { wash: BOY.teeLt, washOp: 200 * rim, ink: null, curv: .5 });
  inkLine(P([[-2.4, sh + 1.4], [-.4, sh + 1.85], [1.8, sh + 1.5]]), sw * .55, BOY.teeDk, 'inkfine');          // hunch folds
  inkLine(P([[-1.6, sh + 2.4], [.3, sh + 2.75], [1.5, sh + 2.5]]), sw * .45, BOY.teeDk, 'inkfine');
  inkLine(P([[-3.3, -3.6], [-2.2, -3.25], [-1.2, -3.35]]), sw * .5, BOY.teeDk, 'inkfine');
  for (const s of [-1, 1]) {   // sleeves over the shoulders
    const e = elbow(s);
    paint(P([[s * 2.9, sh - .3], [s * 3.75, sh + .1], [lerp(s * 3.6, e[0], .5) + s * .45, lerp(sh, e[1], .5) + .1], [lerp(s * 3.3, e[0], .5) - s * .5, lerp(sh, e[1], .5) + .7], [s * 3.05, sh + 1.6]]),
      { wash: s < 0 && rim > 0 ? mixCol(BOY.tee, BOY.teeLt, rim * .6) : BOY.tee, ink: INK, sw, curv: .45 });
  }

  // ---- head: a big round head of dark hair, the nape and two ears
  const hx = (o.hx || 0) * .45, hy = -12.3 + bow * .95 + hunch * .55 - br * .12, rx = 3.8, ry = 3.55 - bow * .25;
  rs('neck');
  paint(P([[-1.15, hy + 2.0], [1.15, hy + 2.0], [1.25, sh - .45], [-1.25, sh - .45]]), { wash: BOY.skinDk, ink: INK, sw: sw * .8 });
  rs('hair');
  const hair = [];
  for (let i = 0; i < 36; i++) {
    const a = i / 36 * TAU, sx = Math.cos(a), sy = Math.sin(a);
    let px = hx + sx * rx, py = hy + sy * ry;
    if (sy > .66) py = hy + .66 * ry + (i % 2 ? .35 : -.05) + (1 - Math.abs(sx)) * (.55 + bow * .3);   // a tufty nape hairline
    hair.push([px, py]);
  }
  paint(P(hair), { wash: BOY.hair, ink: INK, sw, curv: .35 });
  paint(P([[hx - rx * .97, hy + .2], [hx - rx * .86, hy - 1.9], [hx - rx * .5, hy - 3.05], [hx - rx * .74, hy - 1.5], [hx - rx * .86, hy + 1.2]]), { wash: rim > 0 ? mixCol(BOY.hairLt, BOY.hairRim, rim) : BOY.hairLt, washOp: 200, ink: null, curv: .6 });
  inkLine(P([[hx + .9, hy - 1.55], [hx + .55, hy - 1.15], [hx + .2, hy - 1.5], [hx + .45, hy - 2.05], [hx + 1.1, hy - 1.9], [hx + 1.25, hy - 1.1]]), sw * .7, BOY.hairLt, 'inkfine');   // the crown whorl
  for (const [a, b] of [[[-.9, -.6], [-2.4, 1.0]], [[.3, -.4], [-.2, 1.8]], [[1.4, -.9], [2.6, .9]], [[-.5, -2.6], [-2.2, -2.0]]])
    inkLine(P([[hx + a[0], hy + a[1]], [hx + (a[0] + b[0]) / 2 + .2, hy + (a[1] + b[1]) / 2], [hx + b[0], hy + b[1]]]), sw * .55, BOY.hairLt, 'inkfine');
  paint(P(ribbon([[hx + .2, hy - ry + .25], [hx + .55, hy - ry - .55], [hx + 1.2, hy - ry - .75], [hx + 1.45, hy - ry - .4]], .55, .12)), { wash: BOY.hair, ink: INK, sw: sw * .7 });   // the cowlick
  rs('ears');
  for (const s of [-1, 1]) {
    const ex = hx + s * (rx - .05), ey = hy + .55;
    paint(P(ellPts(ex, ey, .72, 1.08, 14, .02)), { wash: s < 0 && rim > 0 ? mixCol(BOY.skin, BOY.skinLt, rim) : BOY.skin, ink: INK, sw: sw * .85 });
    inkLine(P([[ex + s * .15, ey - .55], [ex + s * .35, ey], [ex + s * .1, ey + .5]]), sw * .5, BOY.skinDk, 'inkfine');
  }
  pop();
}

function boyFront(x, y, u, o = {}) {
  const id = o.boilKey ?? 'boyf' + (++CLAWD_N), rs = p => boilSeed(`boyf ${id} ${p}`);
  const sw = clamp(u / 22, .4, 2), P = pts => pts.map(([a, b]) => [a * u, b * u]), INK = BOY.ink;
  const br = o.breath || 0, rim = o.rim || 0, hL = o.handL || [-7.8, -7], hR = o.handR || [7.8, -7];
  rs('shadow');
  if (!o.noShadow) paint(ellPts(x, y + u * .2, u * 7.6, u * 1.5, 28), { fill: '#3A2618', fillOp: 90, bleed: .25, tex: .3, border: .1, ink: null });
  push(); translate(x, y);

  // ---- legs: knees out to the sides, the shins crossed in front, soles turned up
  rs('legs');
  for (const s of [-1, 1]) {
    paint(P([[s * 2.0, -3.2], [s * 4.2, -3.0], [s * 5.3, -2.2], [s * 5.4, -1.0], [s * 3.6, -.6], [s * 2.0, -1.2]]), { wash: BOY.shorts, ink: INK, sw, curv: .4 });
    paint(P(ellPts(s * 5.5, -1.05, 1.35, 1.1, 16, .03)), { wash: s > 0 ? BOY.skinLt : BOY.skin, ink: INK, sw });
  }
  // each shin runs from its knee down across the middle to a foot tucked under the other knee, sole turned up
  paint(P(ellPts(3.4, -.15, 1.05, .62, 12, .02, -.35)), { wash: BOY.skinLt, ink: INK, sw: sw * .8 });
  paint(P(ribbon([[5.2, -1.45], [2.4, -.75], [-.6, -.2], [-2.9, -.05]], 1.55, 1.15)), { wash: BOY.skin, ink: INK, sw, curv: .3 });
  paint(P(ellPts(-3.4, -.05, 1.05, .62, 12, .02, .35)), { wash: BOY.skin, ink: INK, sw: sw * .8 });
  paint(P(ribbon([[-5.2, -1.45], [-2.4, -.85], [.6, -.35], [2.9, -.2]], 1.55, 1.15)), { wash: BOY.skinLt, ink: INK, sw, curv: .3 });
  for (const s of [-1, 1]) inkLine(P([[s * 3.0 - .3, -.25], [s * 3.0 + .3, -.15]]), sw * .5, BOY.skinDk, 'inkfine');

  // ---- torso and arms: the elbows out, forearms up to the hands
  rs('arms');
  const elbow = s => [s * 5.8, -5.4];
  for (const s of [-1, 1]) {
    const h = s < 0 ? hL : hR, e = elbow(s);
    paint(P(ribbon([[s * 3.2, -7.9], e, [lerp(e[0], h[0], .5), lerp(e[1], h[1], .5) + .2], h], 1.9, 1.5)), { wash: s > 0 ? BOY.skinLt : BOY.skin, ink: INK, sw, curv: .3 });
  }
  rs('tee');
  const sh = -8.3 - br * .14;
  paint(P([[-3.95, -2.75], [-4.05, -4.6], [-3.85, -6.5], [-3.5, sh + .3], [-2.7, sh - .55], [-1.2, sh - .75], [1.2, sh - .75], [2.7, sh - .55], [3.5, sh + .3], [3.85, -6.5], [4.05, -4.6], [3.95, -2.75], [0, -2.6]]), { wash: BOY.tee, ink: INK, sw, curv: .5 });
  paint(P([[-3.9, -2.9], [-4.0, -5.5], [-3.4, sh + .2], [-2.2, sh - .3], [-2.6, -5.0], [-2.0, -2.8]]), { fill: BOY.teeDk, fillOp: 110, bleed: .12, tex: .5, border: .3, ink: null });
  if (rim > 0) paint(P([[3.5, sh + .5], [2.6, sh - .4], [2.9, -6.5], [3.5, -4.0], [3.8, -4.4], [3.9, -6.6]]), { wash: BOY.teeLt, washOp: 200 * rim, ink: null, curv: .5 });
  paint(P([[-1.3, sh - .7], [0, sh + .15], [1.3, sh - .7], [1.0, sh - .2], [0, sh + .55], [-1.0, sh - .2]]), { wash: BOY.teeDk, ink: INK, sw: sw * .7, curv: .5 });   // the collar
  for (const s of [-1, 1]) {
    const e = elbow(s);
    paint(P([[s * 2.9, sh - .3], [s * 3.75, sh + .1], [lerp(s * 3.6, e[0], .5) + s * .4, lerp(sh, e[1], .5) + .1], [lerp(s * 3.3, e[0], .5) - s * .5, lerp(sh, e[1], .5) + .8], [s * 3.05, sh + 1.6]]),
      { wash: BOY.tee, ink: INK, sw, curv: .45 });
  }

  // ---- head
  const hy = -12.3 - br * .12;
  push(); translate(0, (hy + 2.2) * u); rotate(o.tilt || 0); translate(0, -(hy + 2.2) * u);
  rs('neck');
  paint(P([[-1.0, hy + 2.6], [1.0, hy + 2.6], [1.15, sh - .5], [-1.15, sh - .5]]), { wash: BOY.skinDk, ink: INK, sw: sw * .8 });
  rs('ears');
  for (const s of [-1, 1]) {
    const ex = s * 3.72, ey = hy + .45;
    paint(P(ellPts(ex, ey, .72, 1.05, 14, .02)), { wash: s > 0 && rim > 0 ? mixCol(BOY.skin, BOY.skinLt, rim) : BOY.skin, ink: INK, sw: sw * .85 });
    inkLine(P([[ex - s * .1, ey - .5], [ex + s * .2, ey], [ex - s * .05, ey + .45]]), sw * .5, BOY.skinDk, 'inkfine');
  }
  rs('face');
  const face = P(ellPts(0, hy + .2, 3.6, 3.4, 32, .02));
  paint(face, { wash: BOY.skin, ink: null });
  paint(P(ellPts(.9, hy - .6, 2.2, 1.6, 16)), { fill: BOY.skinLt, fillOp: 90 + 80 * (o.glow || 0), bleed: .2, tex: .6, border: .6, ink: null });
  paint(P(ellPts(0, hy + 2.8, 2.6, .9, 16)), { fill: BOY.skinDk, fillOp: 70, bleed: .1, tex: .6, border: .5, ink: null });
  paint(face, { ink: INK, sw });
  rs('hair');
  paint(P([[-3.75, hy + .4], [-3.85, hy - 1.6], [-3.2, hy - 3.1], [-1.6, hy - 3.9], [.2, hy - 4.0], [2.0, hy - 3.7], [3.3, hy - 2.9], [3.85, hy - 1.5], [3.75, hy + .4],
    [3.35, hy - .9], [2.7, hy - 1.75], [2.2, hy - 1.15], [1.45, hy - 1.95], [.6, hy - 1.3], [-.2, hy - 2.0], [-1.0, hy - 1.35], [-1.9, hy - 2.0], [-2.6, hy - 1.3], [-3.3, hy - 1.0]]),
    { wash: BOY.hair, ink: INK, sw, curv: .35 });
  paint(P([[1.2, hy - 3.6], [2.8, hy - 3.1], [3.5, hy - 1.8], [2.6, hy - 2.6]]), { wash: rim > 0 ? mixCol(BOY.hairLt, BOY.hairRim, rim) : BOY.hairLt, washOp: 200, ink: null, curv: .6 });
  for (const [a, b] of [[[-2.4, -3.1], [-1.2, -1.9]], [[.1, -3.5], [.4, -1.8]], [[2.0, -3.2], [1.6, -2.1]]])
    inkLine(P([[a[0], hy + a[1]], [(a[0] + b[0]) / 2 + .15, hy + (a[1] + b[1]) / 2], [b[0], hy + b[1]]]), sw * .55, BOY.hairLt, 'inkfine');
  paint(P(ribbon([[.2, hy - 3.85], [.55, hy - 4.65], [1.2, hy - 4.85], [1.45, hy - 4.5]], .55, .12)), { wash: BOY.hair, ink: INK, sw: sw * .7 });   // the cowlick
  rs('brows');
  const bu = (o.brow || 0) * .35;
  for (const s of [-1, 1]) inkLine(P([[s * .9, hy - .95 - bu], [s * 1.45, hy - 1.15 - bu], [s * 2.0, hy - 1.0 - bu]]), sw * .9, BOY.hair, 'ink', .5);
  rs('eyes');
  const kind = o.eyes || 'open', blink = clamp(o.blink || 0), lx = (o.lookX || 0) * .22, ly = (o.lookY || 0) * .2;
  for (const s of [-1, 1]) {
    const ex = s * 1.45, ey = hy + .05;
    if (kind === 'happy') { inkLine(P([[ex - .5, ey + .15], [ex, ey - .35], [ex + .5, ey + .15]]), sw * 1.2, BOY.lash, 'ink', .6); continue; }
    if (blink > .5) { inkLine(P([[ex - .45, ey + .15], [ex, ey + .3], [ex + .45, ey + .15]]), sw * 1.1, BOY.lash, 'ink', .5); continue; }
    paint(P(ellPts(ex + lx, ey + ly, .42, .55, 16)), { wash: BOY.lash, ink: null });
    paint(P(ellPts(ex + lx - .13, ey + ly - .2, .15, .17, 10)), { wash: PAL.cream, washOp: 240, ink: null });
    paint(P(ellPts(ex + lx + .13, ey + ly + .2, .06, .06, 8)), { wash: PAL.cream, washOp: 200, ink: null });
    if (kind === 'read') {   // lowered lids
      paint(P([[ex - .62, ey - .7], [ex + .62, ey - .7], [ex + .6, ey + .12], [ex, ey - .1], [ex - .6, ey + .12]]), { wash: BOY.skin, ink: null, curv: .4 });
      inkLine(P([[ex - .58, ey + .14], [ex, ey - .08], [ex + .58, ey + .14]]), sw * 1.1, BOY.lash, 'ink', .5);
    }
  }
  rs('cheeks');
  if (o.blush) for (const s of [-1, 1]) paint(P(ellPts(s * 2.25, hy + 1.15, .75, .4, 14)), { fill: '#E07A6A', fillOp: 160 * clamp(o.blush), bleed: .2, tex: .4, ink: null });
  inkLine(P([[-.08, hy + .85], [.14, hy + 1.1], [-.06, hy + 1.2]]), sw * .6, BOY.skinDk, 'inkfine', .5);   // nose
  rs('mouth');
  const m = o.mouth, my = hy + 1.95;
  if (m === 'smile') inkLine(P([[-.85, my - .1], [0, my + .35], [.85, my - .1]]), sw * .9, INK, 'ink', .6);
  else if (m === 'grin') {
    paint(P([[-1.15, my - .25], [1.15, my - .25], [.85, my + .5], [0, my + .85], [-.85, my + .5]]), { wash: '#5A2420', ink: INK, sw: sw * .8, curv: .45 });
    paint(P([[-.55, my + .45], [.55, my + .45], [0, my + .78]]), { wash: '#D9706A', ink: null, curv: .5 });
    paint(P([[-1.0, my - .22], [1.0, my - .22], [.8, my + .05], [-.8, my + .05]]), { wash: '#FFF5E2', ink: null, curv: .3 });
  } else if (m === 'O') paint(P(ellPts(0, my + .2, .45, .55, 12)), { wash: '#5A2420', ink: INK, sw: sw * .7 });
  pop();

  // ---- what he holds, then his hands over its edges
  if (o.held) { rs('held'); o.held(u, sw); }
  rs('hands');
  for (const s of [-1, 1]) {
    const h = s < 0 ? hL : hR, a = (s < 0 ? o.handRL : o.handRR) || 0, sk = s > 0 ? BOY.skinLt : BOY.skin;
    push(); translate(h[0] * u, h[1] * u); rotate(a); scale(s, 1);
    paint(P([[.55, -1.05], [-.55, -1.1], [-.95, -.4], [-.95, .55], [-.5, 1.1], [.6, 1.05], [.85, .3], [.85, -.5]]), { wash: sk, ink: INK, sw, curv: .55 });
    for (const f of [-.45, .15, .7]) inkLine(P([[-.95, f], [-.35, f + .05]]), sw * .55, BOY.skinDk, 'inkfine');   // fingers over the edge
    pop();
  }
  pop();
}

{
  // model sheet: the back view breathing, swiping and bowing; the front view reading, then grinning, then looking up
  LOOPS.boy = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: '#8C6A52', ink: null });
    const b = Math.sin(t * TAU / 2.4);
    boy(W * .5, H * .36, 30, { breath: b, hunch: .6, bow: .5 + .5 * Math.sin(t * TAU / 4), swipe: seg(t, 1, 1.2) * (1 - seg(t, 1.25, 1.6)), rim: .8 });
    boyFront(W * .5, H * .86, 26, { breath: b, eyes: t < 1.3 ? 'read' : t < 2.6 ? 'happy' : 'open', lookX: Math.sin(t * 5), lookY: t < 1.3 ? .7 : 0,
      mouth: t < 1.3 ? null : 'grin', blush: seg(t, 1.3, 1.6), brow: seg(t, 2.6, 2.8), rim: .8, handL: [-7.8, -7], handR: [7.8, -7],
      held: (u, sw) => { paint(rectPts(-7.5 * u, -10.9 * u + (t > 1.3 ? 2.6 * u : 0), 15 * u, 7.5 * u), { wash: '#F3E4C4', ink: BOY.ink, sw }); } });
  };
  LOOPS.boy.len = 4;
}
