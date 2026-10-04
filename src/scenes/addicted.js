// addicted.js: the 0–9 s picture of ad 001 "Addicted", animated (the A/B twin of the live-action clip). No captions:
// ad-maker draws these frames in place of its generated clip and puts its own captions, art shot and end card on top.
// Storyboard: STORYBOARD.md. Sets and props: addicted_props.js. Character: src/boy.js.
(() => {
  // ---- time constants (video time; the captions they play under are ad-maker's: 0.4–2.4, 2.7–5.3, 6.45–8.4)
  const SWIPE = 1.55, PUSH0 = 2.5, GLINT0 = 2.8, GLINT1 = 3.7, BUZZ0 = 4.15, BUZZ1 = 4.9, PUSH1 = 5.45, CUT = 5.95;
  const CLEAR = 6.35, BLINK = 6.85, LOWER0 = 7.05, LOWER1 = 7.35, JOY = 7.2, TURN0 = 7.45, TURN1 = 7.8, LOOK = 7.55, HOP = 7.8, DIVE0 = 8.05, DIVE1 = 9.0;

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

  // ---- shot B: the camera has come round to his face. He reads with the book held up (we see its real cover), lowers
  // it grinning, spins it round to show us the page, and the camera dives into it.
  const FX = 540, FY = 1660, FU = 60, PU = 6.2, PW = PU * FU, BOOK_ROT = -.03;   // PU: page width in u
  const bookY = t => kf(t, [[LOWER0, -8.3], [LOWER1, -5.6], [TURN0, -5.6], [TURN1, -6.0]]);   // the book's centre, body space (u)
  // ad-maker's first art frame (drawCover of the right page, fx .745, fy .46, zoom 1.18 into 1080×1920) shows native
  // spread pixel N0 at the screen's top-left corner, at S_F screen px per native px. The dive ends exactly there.
  const S_F = Math.max(1080 / 2550, 1920 / 2550) * 1.18, N0 = [2550 + clamp(.745 * 2550 - 1080 / S_F / 2, 0, 2550 - 1080 / S_F), clamp(.46 * 2550 - 1920 / S_F / 2, 0, 2550 - 1920 / S_F)];
  const BS = PW / 2550, BOOK_C = [FX, FY + bookY(DIVE0) * FU];   // lap px per native px; the book's centre once it's shown
  const nativeToWorld = ([nx, ny]) => { const x = (nx - 2550) * BS, y = (ny - 1275) * BS, c = Math.cos(BOOK_ROT), s = Math.sin(BOOK_ROT); return [BOOK_C[0] + x * c - y * s, BOOK_C[1] + x * s + y * c]; };
  const DIVE_T = nativeToWorld([N0[0] + W / 2 / S_F, N0[1] + H / 2 / S_F]), DIVE_Z = S_F / BS;
  function front(t, lt, dur) {
    const tt = onTwos(t);
    const z0 = 1.1 + .05 * (1 - easeOut(seg(t, CUT, CLEAR + .35))) + .03 * seg(t, CLEAR, DIVE0), c0 = [540 + 70 * (1 - easeOut(seg(t, CUT, CLEAR + .45))), 1050];
    const dk = ease(seg(t, DIVE0, DIVE1));
    const cam = dk > 0 ? camToward(DIVE_T, c0, z0, DIVE_Z, -BOOK_ROT, dk) : [c0[0], c0[1], z0, 0];
    camBegin(...cam);
    roomFront(tt);
    const by = bookY(t), turn = ease(seg(t, TURN0, TURN1)), ax = Math.abs(Math.cos(Math.PI * turn));
    const presented = ease(seg(t, TURN1 - .1, TURN1 + .1)), joy = t >= JOY, look = t >= LOOK;
    const hop = -.3 * Math.sin(Math.PI * seg(t, HOP, HOP + .22));
    // hands: on the side edges while reading and turning (they follow the edges in as it spins), then under the bottom corners
    const side = Math.max(1.1, PU * ax + .35), hx = lerp(side, PU + .55, presented), hy = lerp(by + .2, by + PU / 2 + .75, presented);
    const kick = joy ? spring(t, JOY, 7, 22) * .06 : 0;
    boyFront(FX, FY + hop * FU, FU, {
      boilKey: 'boyF', breath: Math.sin(tt * TAU / 2.6), rim: .8, glow: joy ? 0 : 1,
      eyes: look ? 'open' : joy ? 'happy' : 'read', lookX: look ? 0 : .75 * Math.sin((tt - 6) * TAU * .8), lookY: look ? .1 : .8,
      blink: seg(tt, BLINK, BLINK + .04) * (1 - seg(tt, BLINK + .08, BLINK + .12)), brow: look ? 1 : joy ? .6 : .45,
      mouth: joy ? 'grin' : null, blush: ease(seg(t, JOY, JOY + .25)), tilt: kick + (look ? -.05 * ease(seg(t, LOOK, LOOK + .2)) : 0),
      handL: [-hx, hy], handR: [hx, hy],
      held: (u, sw) => {
        if (!joy) glow(0, (by - PU / 2 - .3) * u, 3.6 * u, '#FFD9A0', .32);   // the page lights his face
        push(); translate(0, by * u); rotate(BOOK_ROT * presented); heldBook(PW, { turn, zoom: cam[2] }); pop();
      },
    });
    bookMagic(t, FX - 260, FX + 260, FY + (bookY(t) - PU / 2 - .3) * FU + hop * FU, (1 - seg(t, JOY - .1, JOY + .2)) * seg(t, CUT, CLEAR + .2));
    camEnd();
    // the near shoulder we pushed into slides away to the left as the camera comes round (screen space)
    const cl = easeOut(seg(t, CUT, CLEAR));
    if (cl < 1) {
      boilSeed('nearshoulder');
      const ox = lerp(540, -1500, cl), oy = 960;
      paint(ellPts(ox, oy, 1350, 1750, 36, 0, -.3), { wash: BOY.tee, ink: BOY.ink, sw: 3 });
      paint(ellPts(ox + 420, oy - 300, 900, 1300, 30, 0, -.3), { fill: BOY.teeDk, fillOp: 110, bleed: .2, tex: .5, ink: null });
      for (let i = 0; i < 2; i++) inkLine([[ox - 520 + i * 260, oy - 880 + i * 260], [ox - 120 + i * 260, oy - 760 + i * 260], [ox + 260 + i * 260, oy - 840 + i * 260]], 2.2, BOY.teeDk, 'inkfine', .8);
    }
  }

  shots([[0, behind], [CUT, front]]);
})();
