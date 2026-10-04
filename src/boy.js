// boy.js: a modern Indian boy of about six, in a mustard tee and grey shorts, drawn for scenes where we see him from
// behind (reading, watching, sulking). Two drawn views; neither shows the full face:
//   boy(x, y, u, o)     from behind, sitting cross-legged. (x, y) is the ground under his seat; about 16u tall, 13u wide
//                       across the knees.
//   boyOTS(x, y, u, o)  over his right shoulder from above, looking down into his lap: the back of his head in lost
//                       profile (ear, cheek and lashes), shoulders, both arms, crossed shins, and whatever he holds.
//                       (x, y) is the centre of his lap. o.held(u, sw) draws the held thing in lap space (between the
//                       legs and the hands); o.handL / o.handR are the hand points in lap space, in u.
//
// boy() body-local coordinates in u (y up is negative):
//   seat -3.4..0 · knees (±5.4, -.9) · hem -2.8 · shoulders (±3.3, -8.2) · elbows (±4.7, -5.4)
//   head centre (0, -12.3), 3.8 × 3.55 · ears (±3.75, -11.8)
// Options:
//   pose:  bow 0..1 (head dips forward and down), hunch 0..1 (rounded shoulders, head sinks), breath -1..1 (chest rise),
//          swipe 0..1 (his right elbow kicks out, as when turning a page or swiping), hx -1..1 (head turn), dx, dy (u),
//          flip
//   light: rim 0..1 (a warm lamp rim on his left side), rimCol
//   boil:  boilKey, noShadow
// boyOTS() options: bow, smile 0..1 (the cheek lifts), blink 0..1, lean 0..1 (head comes closer to the lap),
//   handL, handR ([x, y] in u), held(u, sw), rim, boilKey
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

// Over the shoulder, from above: the lap at (x, y). Head in lost profile at the upper left, facing down-right at the lap.
function boyOTS(x, y, u, o = {}) {
  const id = o.boilKey ?? 'boyots' + (++CLAWD_N), rs = p => boilSeed(`boyots ${id} ${p}`);
  const sw = clamp(u / 22, .4, 2), P = pts => pts.map(([a, b]) => [a * u, b * u]), INK = BOY.ink;
  const bow = o.bow || 0, smile = o.smile || 0, lean = o.lean || 0, rim = o.rim || 0;
  const hL = o.handL || [-9.6, .3], hR = o.handR || [9.4, 4.0];
  push(); translate(x, y);

  // ---- crossed shins and knees, under the lap
  rs('legs');
  for (const s of [-1, 1]) {
    paint(P([[s * 1.2, 3.2], [s * 6.0, 4.0], [s * 10.6, 5.8], [s * 11.4, 8.4], [s * 9.6, 9.6], [s * 4.8, 8.2], [s * .4, 7.0]]), { wash: s < 0 ? BOY.skinLt : BOY.skin, ink: INK, sw, curv: .45 });
    paint(P([[s * 7.8, 3.6], [s * 11.6, 3.9], [s * 12.6, 6.6], [s * 11.2, 8.4], [s * 9.2, 6.4]]), { wash: BOY.shorts, ink: INK, sw, curv: .45 });
    inkLine(P([[s * 10.6, 4.2], [s * 11.9, 6.1]]), sw * .6, BOY.stripe, 'inkfine');
  }
  paint(P(ellPts(-.6, 8.5, 1.5, .85, 14, .02, -.2)), { wash: BOY.skinLt, ink: INK, sw: sw * .8 });   // a sole between the shins
  paint(P(ellPts(1.6, 8.9, 1.4, .8, 14, .02, .25)), { wash: BOY.skin, ink: INK, sw: sw * .8 });

  // ---- shoulders and upper arms, seen from above, then the held thing in his lap
  rs('tee');
  const back = [[-14.4, -1.0], [-14.6, -4.6], [-13.4, -8.6], [-9.8, -11.6], [-4.0, -13.0], [4.0, -12.8], [9.8, -11.2], [13.4, -8.2], [14.6, -4.4], [14.4, -1.0]];
  paint(P(back), { wash: BOY.tee, ink: INK, sw, curv: .55 });
  paint(P([[3.5, -12.4], [9.8, -10.8], [13.2, -7.8], [14.2, -4.2], [10.6, -2.0], [4.0, -6.0]]), { fill: BOY.teeDk, fillOp: 110, bleed: .12, tex: .5, border: .3, ink: null });
  if (rim > 0) paint(P([[-14.2, -4.6], [-13.0, -8.6], [-9.6, -11.4], [-11.4, -8.4], [-12.8, -4.4]]), { wash: BOY.teeLt, washOp: 190 * rim, ink: null, curv: .5 });
  inkLine(P([[-6.5, -6.4], [-3.5, -5.6], [-.5, -6.0]]), sw * .55, BOY.teeDk, 'inkfine');
  for (const s of [-1, 1]) inkLine(P([[s * 10.6, -9.6], [s * 11.6, -8.0], [s * 12.0, -6.4]]), sw * .6, BOY.teeDk, 'inkfine');   // sleeve seams
  if (o.held) { rs('held'); o.held(u, sw); }

  // ---- arms: from the sleeves down to the hands at the book's edges; the hand (thumb on the page) is drawn last
  rs('arms');
  const arm = (s, h) => {
    const sh = [s * 12.6, -3.2], el = [s * 13.4, 1.0];
    paint(P(ribbon([sh, el, [lerp(el[0], h[0], .5) + s * .2, lerp(el[1], h[1], .5)], h], 2.7, 2.1)), { wash: s < 0 ? BOY.skinLt : BOY.skin, ink: INK, sw, curv: .3 });
    paint(P([[s * 10.9, -3.6], [s * 14.5, -4.6], [s * 14.8, -1.6], [s * 11.6, -.6]]), { wash: BOY.tee, ink: INK, sw, curv: .5 });   // the sleeve hem
    const a = Math.atan2(h[1] - el[1], h[0] - el[0]);
    push(); translate(h[0] * u, h[1] * u); rotate(a);
    const sk = s < 0 ? BOY.skinLt : BOY.skin;
    paint(P([[-1.0, -1.15], [.9, -1.3], [1.7, -.6], [1.75, .55], [.9, 1.25], [-1.0, 1.15]]), { wash: sk, ink: INK, sw, curv: .55 });   // the hand
    for (const f of [-.55, .05, .6]) inkLine(P([[1.1, f], [1.65, f + .05]]), sw * .5, BOY.skinDk, 'inkfine');                          // knuckles
    paint(P(ribbon([[.3, -s * .85], [1.3, -s * 1.25], [2.25, -s * 1.15]], .8, .6)), { wash: sk, ink: INK, sw: sw * .8 });               // the thumb on the page
    pop();
  };
  arm(-1, hL); arm(1, hR);

  // ---- head: lost profile, turned down-right toward the lap; leaning brings it lower and closer
  const cx = -4.6 + lean * .8, cy = -16.4 + bow * .8 + lean * 1.2, rx = 7.4, ry = 7.1;
  rs('nape');
  paint(P([[cx - 2.6, cy + 5.4], [cx + 1.8, cy + 5.0], [cx + 2.2, cy + 8.6], [cx - 2.2, cy + 8.8]]), { wash: BOY.skinDk, ink: INK, sw, curv: .4 });
  rs('face');
  // the cheek and jaw on the far side of the head, catching the light from the page
  const ch = smile * .55;
  paint(P([[cx + 3.4, cy + .8], [cx + 6.6, cy + 1.6 - ch * .5], [cx + 7.7, cy + 3.4 - ch], [cx + 7.1, cy + 5.6 - ch * .6], [cx + 5.4, cy + 6.9], [cx + 3.0, cy + 6.0]]), { wash: BOY.skinLt, ink: INK, sw, curv: .55 });
  paint(P(ellPts(cx + 6.4, cy + 4.0 - ch, .9, .55, 12)), { wash: BOY.cheek, washOp: 90 + 110 * smile, ink: null });
  const blink = o.blink || 0, lx = cx + 7.0, ly = cy + 2.5 - ch * .9;
  inkLine(P([[lx - .5, ly - .2], [lx + .2, ly + .1 + blink * .25], [lx + .7, ly - .1]]), sw * .9, BOY.lash, 'ink');   // lashes past the cheek
  inkLine(P([[lx + .15, ly + .05], [lx + .55, ly + .45]]), sw * .6, BOY.lash, 'inkfine');
  rs('ohair');
  const hair = [];
  for (let i = 0; i < 40; i++) {
    const a = i / 40 * TAU, sx = Math.cos(a), sy = Math.sin(a);
    let px = cx + sx * rx, py = cy + sy * ry;
    if (sx > .35 && sy > -.2) { px = cx + sx * rx * .82; py = cy + sy * ry * .9; }   // the hairline steps back over the face
    if (sy > .6) py = cy + ry * .6 + (i % 2 ? .45 : 0) + (1 - Math.abs(sx)) * .9;      // tufts at the nape
    hair.push([px, py]);
  }
  paint(P(hair), { wash: BOY.hair, ink: INK, sw, curv: .35 });
  paint(P([[cx - rx * .98, cy + .5], [cx - rx * .86, cy - 3.6], [cx - rx * .45, cy - 6.3], [cx - rx * .72, cy - 3.0], [cx - rx * .84, cy + 2.6]]), { wash: rim > 0 ? mixCol(BOY.hairLt, BOY.hairRim, rim) : BOY.hairLt, washOp: 200, ink: null, curv: .6 });
  inkLine(P([[cx - .6, cy - 2.2], [cx - 1.3, cy - 1.4], [cx - 2.0, cy - 2.4], [cx - 1.2, cy - 3.4], [cx - .1, cy - 3.0], [cx + .2, cy - 1.6]]), sw * .9, BOY.hairLt, 'inkfine');   // crown whorl
  for (const [a, b] of [[[-2.8, -.6], [-5.6, 2.6]], [[-.6, -.2], [.4, 4.4]], [[1.2, -2.4], [4.6, .4]], [[-2.6, -4.4], [-5.4, -3.4]], [[.6, -4.4], [3.0, -5.6]]])
    inkLine(P([[cx + a[0], cy + a[1]], [cx + (a[0] + b[0]) / 2 + .4, cy + (a[1] + b[1]) / 2], [cx + b[0], cy + b[1]]]), sw * .7, BOY.hairLt, 'inkfine');
  rs('oear');
  const ex = cx + rx * .8, ey = cy + .3;
  paint(P(ellPts(ex, ey, 1.25, 1.85, 16, .02, .25)), { wash: BOY.skin, ink: INK, sw });
  inkLine(P([[ex - .1, ey - 1.0], [ex + .5, ey - .1], [ex + .1, ey + .9]]), sw * .6, BOY.skinDk, 'inkfine');
  pop();
}

{
  // model sheet: the back view breathing, swiping and bowing; the over-the-shoulder view smiling over a plain book
  LOOPS.boy = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: '#8C6A52', ink: null });
    const b = Math.sin(t * TAU / 2.4);
    boy(W * .5, H * .36, 30, { breath: b, hunch: .6, bow: .5 + .5 * Math.sin(t * TAU / 4), swipe: seg(t, 1, 1.2) * (1 - seg(t, 1.25, 1.6)), rim: .8 });
    boyOTS(W * .5, H * .8, 22, { smile: seg(t, 2, 2.4), lean: seg(t, 2.2, 2.8), rim: .8, held: (u, sw) => {
      paint(rectPts(-9.5 * u, -4.8 * u, 19 * u, 9.6 * u), { wash: '#F3E4C4', ink: BOY.ink, sw });
      inkLine([[0, -4.8 * u], [0, 4.8 * u]], sw, BOY.ink);
    } });
  };
  LOOPS.boy.len = 4;
}
