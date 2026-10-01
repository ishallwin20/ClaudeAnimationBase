// nandi.js: Nandi, a white zebu bull in side view: a hump, a dewlap, olive horns, a red saddle cloth with a gold border,
// a bell on a red cord and a marigold garland. Load after bappa.js (U()) and clawd.js (tintCols(), emote()).
// (x, y) is the ground under the middle of his body; u is the size unit (about 17u from tail to muzzle, 11u to the top
// of the hump, 13u to the horn tips; the head is drawn 1.2× about the neck). He faces screen-right; flip: true faces him left.
//
// Body-local coordinates in u (y up is negative):
//   hooves at y 0, near legs at x -3.6 and 3.4 · belly -3 · back -8.4 · hump (2.6, -10.1) · neck pivot (6.2, -8.4) ·
//   forehead (8, -10.3) · eye (8.2, -8.9) · muzzle (10.3, -7.3) · horn tip (6.9, -12.3) · seat (-1.4, -8.55)
//
// Options (all optional):
//   pose:   walk (phase: the legs step in diagonal pairs and the body bobs), nod (radians: + lowers the muzzle),
//           kneel 0..1 (the front legs fold and the chest comes down), lift 0..1 (rears: the front hooves leave the
//           ground), dx, dy (in u), sq, rot, flip
//   parts:  ear (radians, a flick), tail (-1..1; default a slow swish), bell (radians, the bell's swing),
//           wind 0..1 (ears, tail and garland stream to his back), snow 0..1 (snow piled on his back, head and horn),
//           snort 0..1 (the progress of two steam puffs from his nostril), cloth / garland (false to leave them off)
//   face:   eyes ('normal' | 'closed' | 'happy' | 'wide' | 'determined'), lookX / lookY (-1..1), seed (blink timing)
//   extras: tint + tintK, emote + emoteK + emoteAge, boilKey, noShadow, swMul
// Helpers: nandiSeat / nandiHead / nandiMuzzle / nandiHornTip / nandiHoof(x, y, u, o[, i]) → world points, through
// the same pose, so a rider, a hand or a prop can touch him.
const NAN = {
  body: '#FBF3E4', shade: '#C9CFE0', warm: '#E3D6C2', far: '#D5D6E0', ink: '#4A3A3A', muzzle: '#6B5A5A', ear: '#F2B5A8',
  horn: '#B7A35A', hornDk: '#8A7A3C', hoof: '#5A4A44', eye: '#2A1A1E', white: '#FFFDF6',
  cloth: '#E2574A', clothDk: '#B93C34', gold: '#EDB43C', goldDk: '#B67D1C', goldLt: '#FFE39A', marigold: '#F39A2E', tuft: '#5A4A44',
  snow: '#FFFDF6', snowDk: '#C9D8EC', steam: '#FFFDF6',
};

// the body's tilt (kneel / lift, about the hind hip) and its walking bob
function nandiPose(o) {
  const bob = o.walk == null ? 0 : -Math.abs(Math.sin(o.walk * TAU * 2)) * .12;
  return { ang: (o.kneel || 0) * .2 - (o.lift || 0) * .17, bob };
}
// a body-local point (u) after the nod (head points only), the tilt and the bob
function nandiLocal(o, lx, ly, head) {
  if (head) { const a = o.nod || 0, px = (lx - 6.2) * 1.2, py = (ly + 8.4) * 1.2; lx = 6.2 + px * Math.cos(a) - py * Math.sin(a); ly = -8.4 + px * Math.sin(a) + py * Math.cos(a); }
  const { ang, bob } = nandiPose(o), px = lx + 3.2, py = ly + 4.2;
  return [-3.2 + px * Math.cos(ang) - py * Math.sin(ang), -4.2 + px * Math.sin(ang) + py * Math.cos(ang) + bob];
}
function nandiOut(x, y, u, o, bx, by) {
  const sq = o.sq || 0, px = (o.flip ? -1 : 1) * (1 + sq * .6) * bx * u, py = (1 - sq) * by * u, r = o.rot || 0;
  return [x + (o.dx || 0) * u + px * Math.cos(r) - py * Math.sin(r), y + (o.dy || 0) * u + px * Math.sin(r) + py * Math.cos(r)];
}
function nandiWorld(x, y, u, o, lx, ly, head) { const [bx, by] = nandiLocal(o, lx, ly, head); return nandiOut(x, y, u, o, bx, by); }
const nandiSeat = (x, y, u, o = {}) => nandiWorld(x, y, u, o, -1.4, -8.55);
const nandiHead = (x, y, u, o = {}) => nandiWorld(x, y, u, o, 8, -10.3, true);
const nandiMuzzle = (x, y, u, o = {}) => nandiWorld(x, y, u, o, 10.3, -7.3, true);
const nandiHornTip = (x, y, u, o = {}) => nandiWorld(x, y, u, o, 6.9, -12.3, true);
// legs: 0 near hind, 1 near front, 2 far hind, 3 far front. [hip, knee, hoof] in u, outside the body's tilt.
const NAN_LEGS = [[-3.6, .5, 0], [3.4, 0, 1], [-2.8, 0, 0], [4.2, .5, 1]];
function nandiLeg(o, i) {
  const [lx, ph, front] = NAN_LEGS[i], hip = nandiLocal(o, lx, -4.6);
  let hx = lx, hy = 0;
  if (o.walk != null) { const a = (o.walk + ph) * TAU; hx += Math.sin(a) * 1.1; hy = -Math.max(0, Math.cos(a)) * .55; }
  let knee = [(hip[0] + hx) / 2 + (front ? .2 : -.45), (hip[1] + hy) / 2 + (front ? 0 : .2)];
  if (front) {
    const kn = clamp(o.kneel || 0), lf = clamp(o.lift || 0), far = i === 3 ? .5 : 0;
    if (kn > 0) { hx = lerp(hx, lx - 1.3, kn); hy = lerp(hy, -.3, kn); knee = [lerp(knee[0], lx + 1.2, kn), lerp(knee[1], -.75, kn)]; }
    if (lf > 0) { hx = lerp(hx, hip[0] + 1.1 + far, lf); hy = lerp(hy, hip[1] + 2.5 - far * .6, lf); knee = [lerp(knee[0], hip[0] + 1.7 + far, lf), lerp(knee[1], hip[1] + 1.2, lf)]; }
  }
  return [hip, knee, [hx, hy]];
}
const nandiHoof = (x, y, u, o = {}, i = 1) => { const [, , h] = nandiLeg(o, i); return nandiOut(x, y, u, o, h[0], h[1]); };

function nandi(x, y, u, o = {}) {
  const id = o.boilKey ?? 'n' + (++CLAWD_N), rs = p => boilSeed(`nandi ${id} ${p}`);
  const sq = o.sq || 0, sw = clamp(u / 20, .4, 2) * (o.swMul || 1), J = u * .03, INK = NAN.ink;
  const { col, dk, lt } = tintCols({ ...o, col: o.col || NAN.body, dk: o.dk || NAN.shade, lt: o.lt || NAN.white });
  const P = pts => U(pts, u), wind = clamp(o.wind || 0), snow = clamp(o.snow || 0), { ang, bob } = nandiPose(o);
  const flut = wind * Math.sin(T * 26);

  if (!o.noShadow) { rs('shadow'); paint(ellPts(x + (o.dx || 0) * u + u * .8, y + u * .15, u * 8.2, u * 1.1, 24), { fill: PAL.ink, fillOp: 70, bleed: .2, tex: .3, border: .1, ink: null }); }
  push();
  translate(x + (o.dx || 0) * u, y + (o.dy || 0) * u);
  if (o.rot) rotate(o.rot);
  scale((o.flip ? -1 : 1) * (1 + sq * .6), 1 - sq);
  const tilt = f => { push(); translate(-3.2 * u, (-4.2 + bob) * u); rotate(ang); translate(3.2 * u, 4.2 * u); f(); pop(); };
  const leg = (i, c, cd) => {
    rs('leg' + i);
    const [hip, knee, hoof] = nandiLeg(o, i), top = [hoof[0], hoof[1] - .5];
    paint(ribbon(P([hip, knee, top]), 1.7 * u, 1.15 * u), { wash: c, ink: INK, sw: sw * .8 });
    paint(P([[hoof[0] - .6, hoof[1] - .6], [hoof[0] + .62, hoof[1] - .6], [hoof[0] + .72, hoof[1]], [hoof[0] - .66, hoof[1]]]), { wash: NAN.hoof, ink: INK, sw: sw * .6 });
  };

  // ---- behind: the tail, the far legs
  tilt(() => {
    rs('tail');
    const ts = o.tail ?? Math.sin(T * 1.8) * .5, tx = -7 + ts * 1.2 - wind * 2.6 + flut * .3, ty = -3 - wind * 2.6;
    const tail = [[-6.1, -7.5], [-7.2 - wind * .8, -5.6 - wind * .8], [tx, ty]];
    paint(ribbon(P(tail), .5 * u, .28 * u), { wash: col, ink: INK, sw: sw * .7 });
    paint(ellPts(tx * u, (ty + .5) * u, .45 * u, .75 * u, 12, J, -wind * 1.1), { wash: NAN.tuft, ink: INK, sw: sw * .5 });
  });
  leg(2, NAN.far, dk); leg(3, NAN.far, dk);

  tilt(() => {
    // ---- the far horn and ear, behind the head
    push(); translate(6.2 * u, -8.4 * u); rotate(o.nod || 0); scale(1.2); translate(-6.2 * u, 8.4 * u);
    rs('farhorn');
    paint(ribbon(P([[7.9, -10.3], [8.3, -11.3], [8, -12.1]]), .7 * u, .16 * u), { wash: NAN.hornDk, ink: INK, sw: sw * .7 });
    pop();

    // ---- the body: one outline
    rs('body');
    const body = P([[-6.2, -6.6], [-6.4, -4.6], [-4.5, -3.2], [0, -2.9], [3.5, -3.3], [5.4, -4.4], [6, -5.6], [6.2, -7.2], [6.4, -8.6], [4.7, -9.3], [3.5, -10.6], [2.5, -11], [1.4, -9.9], [.4, -8.9], [-1.5, -8.5], [-4.5, -8.3], [-6, -7.8]]);
    paint(body, { wash: col, ink: null, curv: .5 });
    paint(P([[-5.8, -4.6], [-4, -3.4], [0, -3.1], [3.4, -3.5], [5.2, -4.6], [3, -4.5], [0, -4.2], [-3.5, -4.4]]), { fill: dk, fillOp: 120, bleed: .1, tex: .5, border: .4, ink: null, curv: .5 });
    paint(body, { ink: INK, sw, curv: .5 });
    inkLine(P([[5.5, -6.9], [5.75, -5.9], [5.5, -4.9]]), sw * .5, NAN.warm, 'inkfine', .5);   // dewlap folds
    inkLine(P([[4.9, -6.4], [5.1, -5.5], [4.8, -4.6]]), sw * .5, NAN.warm, 'inkfine', .5);
    inkLine(P([[1.7, -9.3], [2.6, -10.1], [3.6, -9.5]]), sw * .5, NAN.warm, 'inkfine', .5);   // the hump
    inkLine(P([[-5.2, -6.6], [-5.5, -5.4]]), sw * .5, NAN.warm, 'inkfine', .5);   // the haunch

    // ---- the saddle cloth
    if (o.cloth !== false) {
      rs('cloth');
      const cl = P([[-3.9, -8.45], [-1.5, -8.6], [1, -9.05], [1.25, -7], [1.05, -5.7], [-1.4, -5.45], [-3.85, -5.7], [-4.05, -7]]);
      paint(cl, { wash: NAN.cloth, fill: NAN.clothDk, fillOp: 70, tex: .6, border: .4, ink: INK, sw: sw * .8, curv: .25 });
      inkLine(P([[-3.6, -6.1], [-1.4, -5.9], [.8, -6.1]]), sw * 1.7, NAN.gold, 'ink', .4);
      for (let k = 0; k < 4; k++) { const bx = lerp(-3.3, .5, k / 3); inkLine(P([[bx, -5.6], [bx + .05, -4.9]]), sw * .8, NAN.goldDk, 'inkfine', 0); }
      paint(starPts(-1.4 * u, -7.3 * u, .55 * u, .45, 4), { wash: NAN.goldLt, ink: null });
    }
    if (snow > 0) {
      rs('snowback');
      const h = snow * 1.25;
      paint(P([[-5.7, -7.9], [-4.5, -8.3 - h * .7], [-1.5, -8.5 - h], [.6, -9 - h * .8], [2.5, -11 - h], [4, -9.9 - h * .4], [4.7, -9.2], [3.5, -10.5], [2.5, -10.9], [1.4, -9.8], [.4, -8.8], [-1.5, -8.4], [-4.5, -8.2]]),
        { wash: NAN.snow, ink: NAN.snowDk, sw: sw * .6, curv: .4 });
    }
  });

  leg(0, col, dk); leg(1, col, dk);

  tilt(() => {
    // ---- cord, garland and bell round the neck
    if (o.garland !== false) {
      rs('garland');
      const G = through(P([[4.5, -9.1], [4.9, -7.4], [5.5, -6], [6.3, -5.5], [6.9, -6.4], [6.8, -7.4]]), 3);
      G.forEach(([gx, gy], k) => paint(ellPts(gx - wind * u * .25 * Math.sin(k), gy, .34 * u, .34 * u, 8, J), { wash: k % 2 ? NAN.marigold : NAN.gold, ink: INK, sw: sw * .35 }));
    }
    rs('bell');
    push(); translate(6.35 * u, -5.4 * u); rotate((o.bell || 0) - wind * .5 + flut * .1);
    paint(U([[-.5, .95], [-.42, .2], [0, -.1], [.42, .2], [.5, .95]], u), { wash: NAN.gold, fill: NAN.goldDk, fillOp: 60, tex: .4, ink: INK, sw: sw * .6, curv: .35 });
    paint(ellPts(0, 1.05 * u, .17 * u, .17 * u, 8), { wash: NAN.goldDk, ink: INK, sw: sw * .4 });
    pop();

    // ---- the head, nodding about the neck
    push(); translate(6.2 * u, -8.4 * u); rotate(o.nod || 0); scale(1.2); translate(-6.2 * u, 8.4 * u);
    rs('head');
    const head = P([[5.9, -9.7], [6.6, -10.35], [7.8, -10.5], [8.7, -9.8], [9.9, -8.4], [10.4, -7.4], [9.7, -6.55], [8.1, -6.6], [6.7, -7], [5.8, -8.2]]);
    paint(head, { wash: col, ink: null, curv: .5 });
    paint(P([[6.2, -7.6], [7.4, -7], [8.6, -6.8], [7.2, -7.7]]), { fill: dk, fillOp: 100, bleed: .1, tex: .5, ink: null, curv: .5 });
    paint(head, { ink: INK, sw, curv: .5 });
    rs('muzzle');
    paint(P([[9.35, -8], [10.1, -8.05], [10.42, -7.4], [9.95, -6.62], [9.2, -6.75], [9.05, -7.4]]), { wash: NAN.muzzle, ink: INK, sw: sw * .6, curv: .5 });
    paint(ellPts(10 * u, -7.55 * u, .16 * u, .12 * u, 8), { wash: NAN.eye, ink: null });
    inkLine(P([[9.2, -6.95], [9.75, -6.85], [10.15, -7]]), sw * .5, NAN.eye, 'inkfine', .5);
    rs('horn');
    paint(ribbon(P([[7, -10.3], [7.35, -11.4], [6.9, -12.3]]), .8 * u, .16 * u), { wash: NAN.horn, fill: NAN.hornDk, fillOp: 60, tex: .4, ink: INK, sw: sw * .8 });
    paint(ellPts(7.75 * u, -10.05 * u, .3 * u, .3 * u, 8), { wash: NAN.gold, ink: INK, sw: sw * .4 });   // forehead ornament
    rs('ear');
    push(); translate(6.5 * u, -9.5 * u); rotate((o.ear || 0) + wind * .5 + flut * .12);
    paint(U([[0, -.25], [-1.1, -.75], [-1.95, -.1], [-1.1, .45], [0, .3]], u), { wash: col, ink: INK, sw: sw * .8, curv: .5 });
    paint(U([[-.35, -.05], [-1.05, -.35], [-1.55, -.05], [-1.05, .2]], u), { wash: NAN.ear, ink: null, curv: .5 });
    pop();
    if (snow > 0) {
      rs('snowhead');
      paint(ellPts(7.4 * u, (-10.55 - snow * .3) * u, (.5 + .6 * snow) * u, (.2 + .45 * snow) * u, 14, J), { wash: NAN.snow, ink: NAN.snowDk, sw: sw * .5 });
      paint(ellPts(6.95 * u, (-12.3 - snow * .1) * u, .32 * snow * u, .3 * snow * u, 10), { wash: NAN.snow, ink: NAN.snowDk, sw: sw * .4 });
    }
    // the eye
    rs('eye');
    const kind = o.eyes || 'normal', ex = 8.2 * u, ey = -8.9 * u;
    const blink = ((T * .8 + (o.seed || 0) * 1.7 + .9) % 3.7) < .12;
    if (kind === 'closed' || kind === 'happy' || blink) {
      const c = kind === 'happy' ? -.3 : .25;
      inkLine([[ex - .55 * u, ey], [ex, ey + c * u], [ex + .55 * u, ey]], sw * 1.2, NAN.eye, 'ink', .5);
      inkLine([[ex - .5 * u, ey + .02 * u], [ex - .8 * u, ey - .2 * u]], sw * .6, NAN.eye, 'inkfine', 0);
    } else {
      const wide = kind === 'wide', rx = (wide ? .62 : .52) * u, ry = (wide ? .66 : .56) * u, pr = wide ? .3 : .4;
      paint(ellPts(ex, ey, rx, ry, 16), { wash: NAN.white, ink: NAN.eye, sw: sw * .6 });
      const lx = (o.lookX || 0) * (rx - pr * u) * .8, ly = (o.lookY || 0) * (ry - pr * u) * .8;
      paint(ellPts(ex + lx, ey + ly, pr * u, pr * 1.12 * u, 12), { wash: NAN.eye, ink: null });
      paint(ellPts(ex + lx - .12 * u, ey + ly - .15 * u, .12 * u, .13 * u, 8), { wash: NAN.white, ink: null });
      inkLine([[ex - rx, ey - ry * .3], [ex - rx * 1.5, ey - ry * .8]], sw * .6, NAN.eye, 'inkfine', 0);   // lash
      if (kind === 'determined') inkLine([[ex - .8 * u, ey - .95 * u], [ex + .7 * u, ey - .5 * u]], sw * 1.5, NAN.eye, 'ink', 0);
    }
    // steam from the nostril
    const sn = o.snort || 0;
    if (sn > 0 && sn < 1) {
      rs('snort');
      for (const [d, a] of [[0, -.15], [.18, .25]]) {
        const k = clamp((sn - d) / (1 - d)); if (k <= 0) continue;
        const px = (10.5 + k * 2.6) * u, py = (-7.5 + a * k * 3) * u, r = (.35 + k * .8) * u;
        paint(ellPts(px, py, r, r * .8, 12, J * 3), { wash: NAN.steam, washOp: 230 * (1 - k * k), ink: NAN.snowDk, sw: sw * .4 });
      }
    }
    pop();
  });
  pop();

  if (o.emote) {
    rs('emote');
    const [hx, hy] = nandiHead(x, y, u, o), dir = o.flip ? -1 : 1;
    emote(o.emote, hx + dir * 1.6 * u, hy - 3.4 * u, u * 1.5, o.emoteK ?? 1, o.emoteAge ?? T);
  }
  rs('after');
}

// Model sheet: studio.html?loop=nandi, or node render.mjs --loop=nandi --sheet=0.5 --cols=1 --w=1080
(() => {
  LOOPS.nandi = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: '#8FB4DE', ink: null });
    const cells = [
      {}, { walk: t * 1.2, eyes: 'happy' }, { nod: .6, eyes: 'determined' },
      { kneel: 1, nod: .45, eyes: 'closed' }, { wind: 1, snow: 1, eyes: 'determined' }, { lift: 1, eyes: 'wide', snort: frac(t) },
    ];
    cells.forEach((o, i) => nandi(230 + (i % 2) * 520, 560 + Math.floor(i / 2) * 600, 27, { seed: i, ...o }));
  };
  LOOPS.nandi.len = 4;
})();
