// addicted.js: the 0–9 s picture of ad 001 "Addicted", animated (the A/B twin of the live-action clip). No captions:
// ad-maker draws these frames in place of its generated clip and puts its own captions, art shot and end card on top.
// Storyboard: STORYBOARD.md. Sets and props: addicted_props.js. Character: src/boy.js.
(() => {
  // ---- time constants (video time; the captions they play under are ad-maker's: 0.4–2.4, 2.7–5.3, 6.45–8.4)
  const SWIPE = 1.55, PUSH0 = 2.5, GLINT0 = 2.8, GLINT1 = 3.7, BUZZ0 = 4.15, BUZZ1 = 4.9, PUSH1 = 5.45, CUT = 5.95;
  const CLEAR = 6.4, LIFT = 6.75, FLIP0 = 6.95, FLIP1 = 7.45, SMILE = 7.55, LEAN0 = 7.6, LEAN1 = 8.1, DIVE0 = 8.0, DIVE1 = 9.0;

  // ---- a camera that moves world point T from where cam0 shows it to the centre of the screen while the zoom goes
  // z0 → z1 (log scale) and the rotation r0 → r1: no drift, whatever the zoom
  function camToward(T, c0, z0, z1, r1, k, r0 = 0) {
    const z = z0 * Math.pow(z1 / z0, k), r = lerp(r0, r1, k);
    const p0 = [W / 2 + z0 * (T[0] - c0[0]), H / 2 + z0 * (T[1] - c0[1])], s = [lerp(p0[0], W / 2, k) - W / 2, lerp(p0[1], H / 2, k) - H / 2];
    const c = Math.cos(-r), si = Math.sin(-r), d = [(s[0] * c - s[1] * si) / z, (s[0] * si + s[1] * c) / z];   // screen offset back to world
    return [T[0] - d[0], T[1] - d[1], z, r];
  }

  // ---- shot A: one multiplane shot from behind him. Depth d: 0 = the wall, .5 = the floor and pouf, 1 = the rug and boy.
  const BOY_X = 540, BOY_Y = 1610, BU = 52, SHOULDER = [590, 1330];
  function layerCam(t, d) {
    const drift = 1 + .02 * seg(t, 0, PUSH0), k = ease(seg(t, PUSH0, PUSH1));
    const z0 = drift * (1 + k * (.08 + .17 * d)), c0 = [540, 960 - 70 * k * d];
    const w = easeIn(seg(t, PUSH1, CUT)), zw = [2.2, 3.5, 10][d === 0 ? 0 : d < 1 ? 1 : 2];
    if (w <= 0) return [c0[0], c0[1], z0, 0];
    return camToward(d === 1 ? SHOULDER : [540, 900], c0, z0, z0 * zw, 0, w);
  }
  function behind(t, lt, dur) {
    const tt = onTwos(t);
    let c = layerCam(t, 0); camBegin(...c); roomBack(tt, { glint: seg(t, GLINT0, GLINT1) }); motes(t); camEnd();
    c = layerCam(t, .5); camBegin(...c); roomMid(t, { buzz: seg(t, BUZZ0, BUZZ1) }); camEnd();
    c = layerCam(t, 1); camBegin(...c);
    rug();
    const br = Math.sin(tt * TAU / 2.6), nod = .12 * Math.max(0, Math.sin(tt * TAU / 1.7));
    const dip = .25 * ease(seg(t, BUZZ0 + .2, BUZZ0 + .6));   // the tablet buzzes: his head goes lower, not up
    const sw = ease(seg(tt, SWIPE, SWIPE + .12)) * (1 - ease(seg(tt, SWIPE + .2, SWIPE + .45)));
    boy(BOY_X, BOY_Y, BU, { boilKey: 'boyA', breath: br, hunch: .7, bow: .45 + nod + dip, swipe: sw, rim: .9 });
    camEnd();
  }

  // ---- shot B: over his shoulder, looking down into the lap; the camera dives into the right page at the end
  const LAP = [540, 1250], OU = 48, PW = 9.5 * 48, BOOK_ROT = -.06;
  // ad-maker's first art frame (drawCover of the right page, fx .745, fy .46, zoom 1.18 into 1080×1920) shows native
  // spread pixel N0 at the screen's top-left corner, at S_F screen px per native px. The dive ends exactly there.
  const S_F = Math.max(1080 / 2550, 1920 / 2550) * 1.18, N0 = [2550 + clamp(.745 * 2550 - 1080 / S_F / 2, 0, 2550 - 1080 / S_F), clamp(.46 * 2550 - 1920 / S_F / 2, 0, 2550 - 1920 / S_F)];
  const BS = PW / 2550;   // lap px per native px
  const nativeToWorld = ([nx, ny]) => { const x = (nx - 2550) * BS, y = (ny - 1275) * BS, c = Math.cos(BOOK_ROT), s = Math.sin(BOOK_ROT); return [LAP[0] + x * c - y * s, LAP[1] + x * s + y * c]; };
  const DIVE_T = nativeToWorld([N0[0] + W / 2 / S_F, N0[1] + H / 2 / S_F]), DIVE_Z = S_F / BS;
  function overShoulder(t, lt, dur) {
    const tt = onTwos(t);
    const settle = 1 + .06 * (1 - easeOut(seg(t, CUT, CLEAR + .3))) + .025 * seg(t, CLEAR, DIVE0);
    const dk = ease(seg(t, DIVE0, DIVE1));
    const cam = dk > 0 ? camToward(DIVE_T, [540, 960], settle, DIVE_Z, -BOOK_ROT, dk) : [540, 960, settle, 0];
    camBegin(...cam);
    boilSeed('otsfloor');
    paint(rectPts(-200, -200, W + 400, H + 400), { wash: RM.jute, ink: null });
    for (let i = 0; i < 9; i++) inkLine(ellPts(540, 1260, 300 + i * 120, 170 + i * 70, 40, 0).concat([[840 + i * 120, 1260]]), .8, RM.juteDk, 'inkfine', .5);
    paint(ellPts(80, 500, 700, 900, 30, 10), { fill: RM.juteLt, fillOp: 80, bleed: .3, tex: .5, ink: null });
    paint(ellPts(540, 1300, 700, 380, 30), { fill: '#3A2618', fillOp: 70, bleed: .3, tex: .3, ink: null });
    const flip = ease(seg(tt, FLIP0, FLIP1));
    const lift = ease(seg(tt, LIFT, FLIP0)) * (1 - ease(seg(tt, FLIP0 + .1, FLIP0 + .45)));
    const hR = [lerp(10.2, 9.0, lift), lerp(5.0, 2.6, lift)];
    const br = Math.sin(tt * TAU / 2.6);
    boyOTS(LAP[0], LAP[1], OU, {
      boilKey: 'boyB', rim: .8, bow: .3 + .05 * br, smile: ease(seg(t, SMILE, SMILE + .3)), lean: ease(seg(t, LEAN0, LEAN1)),
      blink: seg(tt, 6.55, 6.62) * (1 - seg(tt, 6.66, 6.75)), handL: [-10.1, .6], handR: hR,
      held: () => { push(); rotate(BOOK_ROT); book(PW, { flip, zoom: cam[2] }); pop(); },
    });
    camEnd();
    // the near shoulder we pushed into slides away (screen space)
    const cl = easeOut(seg(t, CUT, CLEAR));
    if (cl < 1) {
      boilSeed('nearshoulder');
      const ox = lerp(540, -760, cl), oy = lerp(960, 2700, cl);
      paint(ellPts(ox, oy, 1350, 1750, 36, 0, -.5), { wash: BOY.tee, ink: BOY.ink, sw: 3 });
      paint(ellPts(ox + 420, oy - 300, 900, 1300, 30, 0, -.5), { fill: BOY.teeDk, fillOp: 110, bleed: .2, tex: .5, ink: null });
      for (let i = 0; i < 2; i++) inkLine([[ox - 520 + i * 260, oy - 880 + i * 260], [ox - 120 + i * 260, oy - 760 + i * 260], [ox + 260 + i * 260, oy - 840 + i * 260]], 2.2, BOY.teeDk, 'inkfine', .8);
    }
  }

  shots([[0, behind], [CUT, overShoulder]]);
})();
