// donkey.js: a small, fluffy grey donkey in side view (Maa Kalaratri's vahana): a cream muzzle, belly and eye rings,
// ENORMOUS ears, a dark spiky mane and forelock, a tail tuft, a red bridle with a tassel, a red saddle cloth with a gold
// border and a little marigold garland. Load after bappa.js (U()) and clawd.js (tintCols(), emote()).
// (x, y) is the ground under the middle of his body; u is the size unit (about 14u from tail to muzzle, 7.3u to the
// top of the back, 15.5u to the ear tips). He faces screen-right; flip: true faces him left.
//
// Body-local coordinates in u (y up is negative):
//   hooves at y 0, near legs at x -3.5 and 3.2 · belly -2.9 · back -7.2 · seat (-.6, -7.45) · neck pivot (5, -9.6) ·
//   forehead (5.9, -11.4) · eye (6.6, -9.9) · muzzle (8.7, -8.2) · ear tips about (5.2, -15.4)
//
// Options (all optional):
//   pose:   walk (phase: diagonal pairs and a bob), nod (radians: + lowers the muzzle), kick 0..1 (a buck: the rump goes
//           up about the front hips and both hind legs fire out backwards), plant 0..1 (braced: the front hooves dig in
//           forward, he leans back and drops his head), rear 0..1 (the front hooves leave the ground), dx, dy (in u),
//           sq, rot, flip
//   parts:  ears (-1 flopped forward .. 0 up .. 1 pinned flat back) or earL / earR (the far / near ear on its own),
//           tail (-1..1; default a swish), wind 0..1, cloth / garland / bridle (false to leave them off)
//   mouth:  bray 0..1 (the head tips up, the jaw drops: big square teeth and a pink tongue), grin 0..1 (lips part over
//           the teeth), lick 0..1 (the tongue comes out and curls up)
//   face:   eyes ('normal' | 'closed' | 'happy' | 'wide' | 'determined' | 'angry' | 'heart'), lookX / lookY (-1..1),
//           seed (blink timing)
//   extras: tint + tintK, emote + emoteK + emoteAge, boilKey, noShadow, swMul
// Helpers: donkeySeat / donkeyHead / donkeyMuzzle / donkeyEar / donkeyHoof(x, y, u, o[, i]) → world points, through the
// same pose, so a rider, a hand or a prop can touch him.
const DNK = {
  body: '#A3A1AE', shade: '#7E7C8D', light: '#C4C2CE', far: '#8C8A9B', cream: '#F1E8D8', creamDk: '#D6CBB6',
  mane: '#4A4452', maneLt: '#6A6274', ear: '#E2B9BE', hoof: '#463C44', ink: '#3A303C', eye: '#241C24', white: '#FFFAF0',
  mouth: '#6A2A34', tongue: '#EE8A98', tongueDk: '#C9606E', tooth: '#FFF6E4',
  cloth: '#C8324A', clothDk: '#982238', gold: '#EDB43C', goldDk: '#B67D1C', goldLt: '#FFE39A', marigold: '#F39A2E',
};

// the body's tilt (kick: about the front hip, the rump up; plant / rear: about the hind hip) and the walking bob
function donkeyPose(o) {
  const bob = o.walk == null ? 0 : -Math.abs(Math.sin(o.walk * TAU * 2)) * .14;
  const kick = clamp(o.kick || 0), back = clamp(o.plant || 0) * .07 + clamp(o.rear || 0) * .2;
  return kick > 0 && kick * .22 >= back ? { ang: kick * .22, px: 3.2, py: -4.3, bob } : { ang: -back, px: -3.5, py: -4.3, bob };
}
// a body-local point (u) after the nod and the bray (head points only), the tilt and the bob
const DNK_DROP = .7, DNK_HEAD = 1.32;   // the body sits this much lower than its drawn coordinates (short legs); the head's scale
function donkeyLocal(o, lx, ly, head) {
  if (head) {
    const a = (o.nod || 0) + clamp(o.plant || 0) * .3 + clamp(o.kick || 0) * .35 - clamp(o.bray || 0) * .6;
    const px = (lx - 5) * DNK_HEAD, py = (ly + 9.6) * DNK_HEAD; lx = 5 + px * Math.cos(a) - py * Math.sin(a); ly = -9.6 + px * Math.sin(a) + py * Math.cos(a);
  }
  ly += DNK_DROP;
  const { ang, px: cx, py: cy, bob } = donkeyPose(o), px = lx - cx, py = ly - cy;
  return [cx + px * Math.cos(ang) - py * Math.sin(ang), cy + px * Math.sin(ang) + py * Math.cos(ang) + bob];
}
function donkeyOut(x, y, u, o, bx, by) {
  const sq = o.sq || 0, px = (o.flip ? -1 : 1) * (1 + sq * .6) * bx * u, py = (1 - sq) * by * u, r = o.rot || 0;
  return [x + (o.dx || 0) * u + px * Math.cos(r) - py * Math.sin(r), y + (o.dy || 0) * u + px * Math.sin(r) + py * Math.cos(r)];
}
function donkeyWorld(x, y, u, o, lx, ly, head) { const [bx, by] = donkeyLocal(o, lx, ly, head); return donkeyOut(x, y, u, o, bx, by); }
const donkeySeat = (x, y, u, o = {}) => donkeyWorld(x, y, u, o, -.6, -7.45);
const donkeyHead = (x, y, u, o = {}) => donkeyWorld(x, y, u, o, 6.6, -10.2, true);
const donkeyMuzzle = (x, y, u, o = {}) => donkeyWorld(x, y, u, o, 8.8, -8.2, true);
const donkeyEar = (x, y, u, o = {}) => donkeyWorld(x, y, u, o, 5.5, -13.5, true);
// legs: 0 near hind, 1 near front, 2 far hind, 3 far front. [hip, knee, hoof] in u, outside the body's tilt.
const DNK_LEGS = [[-3.5, .5, 0], [3.2, 0, 1], [-2.7, 0, 0], [3.9, .5, 1]];
function donkeyLeg(o, i) {
  const [lx, ph, front] = DNK_LEGS[i], hip = donkeyLocal(o, lx, -4.3);
  let hx = lx, hy = 0;
  if (o.walk != null) { const a = (o.walk + ph) * TAU; hx += Math.sin(a) * .9; hy = -Math.max(0, Math.cos(a)) * .6; }
  let knee = [(hip[0] + hx) / 2 + (front ? .15 : -.35), (hip[1] + hy) / 2 + (front ? 0 : .15)];
  const kk = clamp(o.kick || 0), pl = clamp(o.plant || 0), rr = clamp(o.rear || 0), far = i > 1 ? .45 : 0;
  if (front) {
    if (pl > 0) { hx = lerp(hx, lx + 1.5 + far * .4, pl); knee = [lerp(knee[0], (hip[0] + hx) / 2 + .1, pl), lerp(knee[1], (hip[1] + hy) / 2, pl)]; }
    if (rr > 0) { hx = lerp(hx, hip[0] + 1 + far, rr); hy = lerp(hy, hip[1] + 2.3 - far * .5, rr); knee = [lerp(knee[0], hip[0] + 1.5 + far, rr), lerp(knee[1], hip[1] + 1.1, rr)]; }
  } else if (kk > 0) {   // both hind legs fire out backwards, the near one a touch further
    const tx = hip[0] - 3.6 - (i === 0 ? .3 : 0), ty = hip[1] + .9 + (i === 0 ? 0 : .35);
    hx = lerp(hx, tx, kk); hy = lerp(hy, ty, kk);
    knee = [lerp(knee[0], (hip[0] + tx) / 2 + .1, kk), lerp(knee[1], (hip[1] + ty) / 2 + .55, kk)];
  } else if (pl > 0) { hx = lerp(hx, lx - .6, pl); }
  return [hip, knee, [hx, hy]];
}
const donkeyHoof = (x, y, u, o = {}, i = 0) => { const [, , h] = donkeyLeg(o, i); return donkeyOut(x, y, u, o, h[0], h[1]); };

function donkey(x, y, u, o = {}) {
  const id = o.boilKey ?? 'd' + (++CLAWD_N), rs = p => boilSeed(`donkey ${id} ${p}`);
  const sq = o.sq || 0, sw = clamp(u / 20, .4, 2) * (o.swMul || 1), J = u * .035, INK = DNK.ink;
  const { col, dk, lt } = tintCols({ ...o, col: o.col || DNK.body, dk: o.dk || DNK.shade, lt: o.lt || DNK.light });
  const P = pts => U(pts, u), wind = clamp(o.wind || 0), { ang, px: tcx, py: tcy, bob } = donkeyPose(o);
  const bray = clamp(o.bray || 0), grin = Math.max(clamp(o.grin || 0), bray), lick = clamp(o.lick || 0);
  const nod = (o.nod || 0) + clamp(o.plant || 0) * .3 + clamp(o.kick || 0) * .35 - bray * .6;
  const flut = wind * Math.sin(T * 26);
  const earA = v => v >= 0 ? -.22 - v * 1.25 : -.22 - v * 1.85;   // 0 up and a touch back; 1 pinned flat back; -1 flopped forward

  if (!o.noShadow) { rs('shadow'); paint(ellPts(x + (o.dx || 0) * u + u * .3, y + u * .15, u * 6.4, u * .95, 22), { fill: PAL.ink, fillOp: 70, bleed: .2, tex: .3, border: .1, ink: null }); }
  push();
  translate(x + (o.dx || 0) * u, y + (o.dy || 0) * u);
  if (o.rot) rotate(o.rot);
  scale((o.flip ? -1 : 1) * (1 + sq * .6), 1 - sq);
  const tilt = f => { push(); translate(tcx * u, (tcy + bob) * u); rotate(ang); translate(-tcx * u, (-tcy + DNK_DROP) * u); f(); pop(); };
  const headSpace = f => { push(); translate(5 * u, -9.6 * u); rotate(nod); scale(DNK_HEAD); translate(-5 * u, 9.6 * u); f(); pop(); };
  const leg = (i, c) => {
    rs('leg' + i);
    const [hip, knee, hoof] = donkeyLeg(o, i), top = [hoof[0], hoof[1] - .5];
    paint(ribbon(P([hip, knee, top]), 1.75 * u, 1.15 * u), { wash: c, ink: INK, sw: sw * .8 });
    paint(ellPts(hoof[0] * u, (hoof[1] - .62) * u, .62 * u, .3 * u, 10, J), { wash: DNK.creamDk, ink: null });   // a fluffy fetlock
    paint(P([[hoof[0] - .5, hoof[1] - .55], [hoof[0] + .52, hoof[1] - .55], [hoof[0] + .62, hoof[1]], [hoof[0] - .58, hoof[1]]]), { wash: DNK.hoof, ink: INK, sw: sw * .6 });
  };
  const ear = (a, near) => {
    push(); translate((near ? 5.2 : 5.85) * u, (near ? -11.1 : -11.3) * u); rotate(a + flut * .1 + Math.sin(T * 1.3 + (near ? 0 : 1.7)) * .04);
    const sh = near ? col : DNK.far;
    paint(U([[-.5, .2], [-.78, -1.6], [-.68, -3.4], [-.2, -4.35], [.12, -4.45], [.5, -3.5], [.68, -1.7], [.48, .25]], u), { wash: sh, ink: INK, sw: sw * .8, curv: .5 });
    paint(U([[-.2, -.4], [-.42, -1.8], [-.32, -3.3], [0, -3.85], [.25, -3.2], [.32, -1.7], [.18, -.3]], u), { wash: near ? DNK.ear : mixCol(DNK.ear, DNK.far, .4), ink: null, curv: .5 });
    paint(U([[-.66, -3.6], [-.2, -4.35], [.12, -4.45], [.46, -3.6], [0, -3.85]], u), { wash: DNK.mane, ink: null, curv: .4 });   // dark tips
    pop();
  };

  // ---- behind: the tail, the far legs, the far ear
  tilt(() => {
    rs('tail');
    const ts = o.tail ?? Math.sin(T * 2.1) * .55, tx = -6.6 + ts * 1.1 - wind * 2.4 + flut * .3, ty = -3.4 - wind * 2.4 + clamp(o.kick || 0) * -1.6;
    paint(ribbon(P([[-5.2, -6.6], [-6.1 - wind * .8, -5.4 - wind * .6], [tx, ty]]), .36 * u, .2 * u), { wash: col, ink: INK, sw: sw * .7 });
    paint(ellPts(tx * u, (ty + .55) * u, .42 * u, .8 * u, 12, J, -wind * 1.1 + ts * .3), { wash: DNK.mane, ink: INK, sw: sw * .5 });
  });
  leg(2, DNK.far); leg(3, DNK.far);
  tilt(() => headSpace(() => { rs('farear'); ear(earA(o.earL ?? o.ears ?? 0), false); }));

  tilt(() => {
    // ---- the body and neck: one outline, fluffy
    rs('body');
    const body = P([[-5.1, -6.5], [-5.6, -5.1], [-5.1, -3.6], [-3.6, -2.75], [0, -2.35], [2.8, -2.6], [4.1, -3.4], [4.6, -4.8], [4.75, -6.1], [5.1, -7.4], [5.75, -8.8], [6.15, -9.9],
      [5, -10.8], [4.1, -10.2], [3.3, -8.9], [2.5, -7.6], [.5, -7.25], [-2.5, -7.25], [-4.4, -7.05]]);
    paint(body, { wash: col, ink: null, curv: .5 });
    paint(P([[-4.6, -4], [-3.4, -2.9], [0, -2.55], [2.9, -2.8], [4, -3.6], [2.6, -3.9], [0, -3.7], [-3, -3.8]]), { wash: DNK.cream, ink: null, curv: .5 });   // the belly
    paint(P([[-5.3, -5], [-4.8, -3.8], [-3.5, -3.2], [-3.8, -4.4]]), { fill: dk, fillOp: 110, bleed: .1, tex: .5, ink: null, curv: .5 });
    paint(body, { ink: INK, sw, curv: .5 });
    for (const [a, b] of [[[4.4, -5.2], [4.75, -5.9]], [[-4.9, -6.6], [-5.2, -6]], [[3.9, -3.75], [4.2, -3.3]]]) inkLine(P([a, b]), sw * .5, dk, 'inkfine', .3);   // fur flicks
    // the mane: a dark spiky crest along the top of the neck
    rs('mane');
    const M = [[2.4, -7.55], [2.9, -8.5], [3.1, -8.25], [3.5, -9.4], [3.75, -9.05], [4.1, -10.2], [4.35, -9.8], [4.75, -10.95], [5.05, -10.75], [4.9, -10.3], [4.2, -9.7], [3.6, -8.75], [3, -7.95]];
    paint(P(M.map(([a, b], k) => [a + (k % 2 ? 0 : flut * .1), b])), { wash: DNK.mane, ink: INK, sw: sw * .6, curv: .1 });

    // ---- the saddle cloth
    if (o.cloth !== false) {
      rs('cloth');
      const cl = P([[-3.1, -7.25], [-1, -7.4], [1.6, -7.3], [1.9, -5.9], [1.7, -4.8], [-.6, -4.6], [-2.9, -4.8], [-3.25, -6]]);
      paint(cl, { wash: DNK.cloth, fill: DNK.clothDk, fillOp: 70, tex: .6, border: .4, ink: INK, sw: sw * .8, curv: .25 });
      inkLine(P([[-2.95, -5.15], [-.6, -4.95], [1.6, -5.15]]), sw * 1.7, DNK.gold, 'ink', .4);
      for (let k = 0; k < 5; k++) { const bx = lerp(-2.7, 1.4, k / 4); paint(U([[bx - .14, -4.75], [bx + .14, -4.75], [bx, -4.15]], u), { wash: DNK.marigold, ink: INK, sw: sw * .3 }); }   // tassels
      paint(starPts(-.6 * u, -6.2 * u, .45 * u, .45, 4), { wash: DNK.goldLt, ink: null });
    }
  });

  leg(0, col); leg(1, col);

  tilt(() => {
    // ---- the garland round the base of the neck
    if (o.garland !== false) {
      rs('garland');
      const G = through(P([[3.2, -8.6], [3.5, -7.2], [4, -6.1], [4.7, -5.8], [5.2, -6.6], [5.3, -7.6]]), 3);
      G.forEach(([gx, gy], k) => paint(ellPts(gx - wind * u * .2 * Math.sin(k), gy, .3 * u, .3 * u, 8, J), { wash: k % 2 ? DNK.marigold : DNK.gold, ink: INK, sw: sw * .35 }));
    }

    headSpace(() => {
      // ---- the head: the lower jaw first (it drops on a bray), the mouth inside, then the upper head over it
      const jawA = bray * .85 + grin * .06;
      rs('jaw');
      push(); translate(6.9 * u, -7.75 * u); rotate(jawA); translate(-6.9 * u, 7.75 * u);
      paint(P([[6.5, -7.95], [8.3, -7.75], [9.05, -7.65], [8.95, -7.1], [8.3, -6.75], [7.2, -6.85], [6.4, -7.3]]), { wash: DNK.cream, ink: INK, sw: sw * .8, curv: .5 });
      if (grin > .05) for (const tx of [7.85, 8.35, 8.8]) paint(P([[tx - .23, -7.75], [tx + .2, -7.73], [tx + .19, -7.75 + .32 * grin], [tx - .22, -7.75 + .32 * grin]]), { wash: DNK.tooth, ink: INK, sw: sw * .35 });   // lower teeth
      pop();
      if (jawA > .03) {   // the open mouth: dark, with a pink tongue
        rs('mouthin');
        const j = [6.9 + Math.cos(jawA) * 2.1, -7.75 + Math.sin(jawA) * 2.1];
        paint(P([[6.8, -7.8], [9.05, -7.75], [j[0] + .1, j[1] + .05], [7.4, -7.5]]), { wash: DNK.mouth, ink: null, curv: .3 });
        paint(ellPts((7.8 + j[0]) / 2 * u, ((-7.6 + j[1]) / 2 + .1) * u, .7 * u, .26 * u, 12, J, jawA * .6), { wash: DNK.tongue, ink: null });
      }
      if (lick > .02) {   // the tongue comes out and curls up
        rs('lick');
        const e = easeOut(lick), tip = [9.2 + 1.6 * e, -7.6 + .2 * e - 1.4 * e * e];
        paint(ribbon(P([[8.6, -7.6], [9.3 + .8 * e, -7.3 + .3 * e], tip]), .55 * u, .38 * u), { wash: DNK.tongue, ink: INK, sw: sw * .5 });
        inkLine(P([[9 + .4 * e, -7.45], [9.6 + .9 * e, -7.25 + .1 * e]]), sw * .4, DNK.tongueDk, 'inkfine', .5);
      }
      rs('head');
      const head = P([[4.6, -10.5], [5.1, -11.45], [6.3, -11.75], [7.4, -11.1], [8.4, -9.95], [9.15, -8.95], [9.3, -8.1], [9.1, -7.65], [8.3, -7.75], [7.2, -7.85], [6.2, -8.1], [5.2, -8.9]]);
      paint(head, { wash: col, ink: null, curv: .5 });
      paint(P([[7.55, -9.75], [8.5, -9.75], [9.2, -8.95], [9.32, -8.1], [9.1, -7.65], [8.2, -7.75], [7.3, -7.85], [7.15, -8.8]]), { wash: DNK.cream, ink: null, curv: .5 });   // the muzzle
      paint(ellPts(5.5 * u, -9.3 * u, 1 * u, .6 * u, 12, J, .5), { fill: dk, fillOp: 90, bleed: .1, tex: .5, ink: null });   // the cheek
      paint(head, { ink: INK, sw, curv: .5 });
      if (grin > .05) for (const tx of [7.75, 8.25, 8.72]) paint(P([[tx - .24, -7.82], [tx + .21, -7.8], [tx + .2, -7.8 + .42 * grin], [tx - .23, -7.82 + .42 * grin]]), { wash: DNK.tooth, ink: INK, sw: sw * .35 });   // big square top teeth
      else inkLine(P([[7.4, -7.9], [8.3, -7.82], [9.05, -7.72]]), sw * .6, INK, 'inkfine', .5);
      rs('nostril');
      paint(ellPts(8.85 * u, -8.75 * u, .18 * u, .28 * u, 8, 0, .4), { wash: DNK.mouth, ink: null });
      inkLine(P([[8.6, -9.15], [8.95, -9.1], [9.1, -8.8]]), sw * .45, INK, 'inkfine', .5);

      // ---- the bridle: a red strap round the muzzle and behind the cheek, a gold boss and a tassel
      if (o.bridle !== false) {
        rs('bridle');
        inkLine(P([[7.75, -10.05], [7.85, -9], [7.8, -7.95]]), sw * 1.25, DNK.cloth, 'ink', .4);
        inkLine(P([[5, -11], [5.15, -9.8], [5.8, -8.75], [6.8, -8.55], [7.8, -8.6]]), sw * 1.25, DNK.cloth, 'ink', .4);
        paint(ellPts(7.8 * u, -8.6 * u, .28 * u, .28 * u, 8), { wash: DNK.gold, ink: INK, sw: sw * .4 });
        push(); translate(5.25 * u, -9.4 * u); rotate(Math.sin(T * 2.2) * .15 - nod * .8 + wind * .6);
        inkLine(U([[0, 0], [0, .5]], u), sw * .5, DNK.goldDk, 'inkfine', 0);
        paint(U([[0, .45], [.28, .9], [.2, 1.55], [-.2, 1.55], [-.28, .9]], u), { wash: DNK.cloth, ink: INK, sw: sw * .4, curv: .3 });
        pop();
      }

      // ---- the eye: big, in a cream ring
      rs('eye');
      const kind = o.eyes || 'normal', ex = 6.6 * u, ey = -9.95 * u;
      paint(ellPts(ex, ey, .95 * u, .85 * u, 14, J), { wash: DNK.cream, ink: null });
      const blink = ((T * .8 + (o.seed || 0) * 1.7 + .4) % 3.5) < .12;
      if (kind === 'closed' || kind === 'happy' || blink) {
        const c = kind === 'happy' ? -.32 : .22;
        inkLine([[ex - .58 * u, ey], [ex, ey + c * u], [ex + .58 * u, ey]], sw * 1.3, DNK.eye, 'ink', .5);
        inkLine([[ex + .5 * u, ey - .02 * u], [ex + .82 * u, ey - .25 * u]], sw * .6, DNK.eye, 'inkfine', 0);
      } else if (kind === 'heart') {
        paint(heartPts(ex, ey + .05 * u, .62 * u), { wash: '#E2506A', ink: DNK.eye, sw: sw * .5 });
      } else {
        const wide = kind === 'wide', rx = (wide ? .66 : .56) * u, ry = (wide ? .7 : .62) * u, pr = wide ? .3 : .38;
        paint(ellPts(ex, ey, rx, ry, 16), { wash: DNK.white, ink: DNK.eye, sw: sw * .6 });
        const lx = (o.lookX || 0) * (rx - pr * u) * .85, ly = (o.lookY || 0) * (ry - pr * u) * .85;
        paint(ellPts(ex + lx, ey + ly, pr * u, pr * 1.12 * u, 12), { wash: DNK.eye, ink: null });
        paint(ellPts(ex + lx + .1 * u, ey + ly - .15 * u, .13 * u, .14 * u, 8), { wash: DNK.white, ink: null });
        inkLine([[ex + rx * .9, ey - ry * .4], [ex + rx * 1.45, ey - ry * .85]], sw * .6, DNK.eye, 'inkfine', 0);   // lash
        if (kind === 'determined' || kind === 'angry') {
          const k = kind === 'angry' ? 1 : .6;
          paint([[ex - rx * 1.3, ey - ry * 1.5], [ex - rx * 1.3, ey - ry * (1 - .5 * k)], [ex + rx * 1.3, ey - ry * (1 - 1.1 * k)], [ex + rx * 1.3, ey - ry * 1.5]], { wash: col, ink: null });
          inkLine([[ex - rx * 1.2, ey - ry * (1.05 - .5 * k)], [ex + rx * 1.25, ey - ry * (1.05 - 1.1 * k)]], sw * 1.6, DNK.eye, 'ink', 0);
        }
      }

      // ---- the near ear and the forelock
      rs('nearear');
      ear(earA(o.earR ?? o.ears ?? 0), true);
      rs('forelock');
      paint(P([[4.85, -11.15], [5.2, -11.95], [5.45, -11.55], [5.85, -12.1], [6, -11.6], [6.35, -11.75], [6.25, -11.3], [5.6, -11]]), { wash: DNK.mane, ink: INK, sw: sw * .55, curv: .15 });
    });
  });
  pop();

  if (o.emote) {
    rs('emote');
    const [hx, hy] = donkeyHead(x, y, u, o), dir = o.flip ? -1 : 1;
    emote(o.emote, hx + dir * 1.8 * u, hy - 4.6 * u, u * 1.4, o.emoteK ?? 1, o.emoteAge ?? T);
  }
  rs('after');
}

// Model sheet: studio.html?loop=donkey, or node render.mjs --loop=donkey --sheet=0.5 --cols=1 --w=1080
(() => {
  LOOPS.donkey = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: '#B8C8E0', ink: null });
    const cells = [
      { grin: 1, lookX: -.3 }, { walk: t * 1.6, eyes: 'happy' }, { bray: .5 + .5 * Math.abs(Math.sin(t * 5)), ears: -.6 },
      { plant: 1, ears: 1, eyes: 'angry' }, { kick: 1, ears: 1, eyes: 'determined', tail: -1 }, { earR: -1, lick: frac(t / 2) * 1.4, eyes: 'happy', emote: 'heart' },
    ];
    cells.forEach((o, i) => donkey(300 + (i % 2) * 500, 560 + Math.floor(i / 2) * 600, 26, { seed: i, ...o }));
  };
  LOOPS.donkey.len = 4;
})();
