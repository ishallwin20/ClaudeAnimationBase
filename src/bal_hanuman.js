// bal_hanuman.js: Bal Hanuman, baby Hanuman as the Hanuman Chalisa paints him: "kanchan baran" (golden fur), "kanan
// kundal kunchit kesa" (gold rings in his ears, a curly tuft), the munja thread across his chest, a red langot with a
// gold waistband, a sindoor tilak and a kajal nazar dot (he's a baby). A peach monkey-face mask, big glossy eyes and a
// long tail that ends in a curl. Front view, in three poses, each drawn for itself:
//   pose 'stand'  (x, y) is the ground between his feet. About 16.8u tall to the tuft, 7.5u wide.
//   pose 'sit'    sitting on his bottom, legs out toward us, soles showing: (x, y) is the ground under him. 13.8u tall.
//   pose 'fly'    (x, y) is his BELLY, so rot spins him around it: tilt him (rot) toward where he flies; the legs trail
//                 and kick (kick: phase), the tail streams (tail 'stream').
// Load after bappa.js (U()), clawd.js (eyes() / mouth() / emote(), so feel() and emotions() drive him) and aarav.js
// (his hands are Aarav's hand shapes in golden fur).
//
// Body-local coordinates in u (y up is negative), for 'stand' ('sit' moves everything from the hips up down by 3u,
// 'fly' moves the body down by 5.6u so the belly sits on (x, y)):
//   feet (±1.2, -.4) · hips (±1, -3.4) · langot -4.5..-2.4 · belly centre (0, -5.6) · shoulders (±2.05, -7.7)
//   head centre (0, -12.2), 3.6 × 3.3 · eyes (±1.2, -12.6) · mouth (0, -10.65) · tuft tip (.4, -16.8) · ears (±3.75, -12.1)
//
// Options (all optional):
//   pose:   pose, dx, dy (u), sq, rot (pivots at (x, y)), flip, hx (-1..1 head turn), htilt (radians), nod (u, the head
//           dips), walk (phase, stand), kick (phase, fly: the legs flutter), wiggle (-1..1: the bottom swings, for the
//           pounce), belly 0..1 (a grumble: the tummy bulges)
//   arms:   handL / handR = [x, y] in body u (2-bone arms; out-of-reach targets are pulled in), bendL / bendR (1 elbows
//           out, -1 in), handShapeL / handShapeR (Aarav's: 'open' | 'fist' | 'claw' | 'point' | 'hold'), handAL / handAR.
//           Without targets, aL / aR (feel()'s arm angles) swing them; resting they hang by his tummy.
//   face:   eyes, mouth, lookX / lookY, squint, blush, brows (-1 cross .. +1 raised), worry 0..1, mouthK (size of
//           'aam' / 'open' / 'wail'), seed, tint + tintK. His own eyes: 'normal' / 'look' / 'wide' / 'happy' /
//           'closed' / 'squeeze' / 'sad' / 'sparkle' (food eyes: stars in them) / 'heart' / 'swirl' (dizzy); every
//           other kind is Clawd's. His own mouths: 'smile' / 'grin' / 'O' / 'open' / 'aam' (the sun-sized gulp) /
//           'puff' (lips pressed, cheeks full) / 'chew' / 'pout' / 'wail' / 'frown' / 'flat' / 'yawn' / 'cat';
//           every other kind is Clawd's. drool 0..1 (a drop from the corner of his mouth)
//   cheeks: puff 0..1 (the cheeks balloon out), cheekGlow 0..1 (the sun inside: they shine), jaw 0..1 (the swelling on
//           his left jaw where the vajra hit), plaster (a crossed plaster on it)
//   tail:   tail = 'curl' (up behind him, default) | 'stream' (out behind a flight) | 'droop', tailSway (phase)
//   extras: garland 0..1 (Indra's gold lotuses round his neck), glowK (a gold aura, drawn first), emote + emoteK +
//           emoteAge, hooks behind(u, sw) (body space, first) / hat(u, sw) (head space) / held(u, sw) (body space, under
//           the hands), boilKey, noShadow, swMul
// Helpers: bhHand(x, y, u, o, s), bhHead(x, y, u, o), bhMouth(x, y, u, o), bhBelly(x, y, u, o), bhCheek(x, y, u, o, s),
//          bhJaw(x, y, u, o) → world [x, y].
const BH = {
  fur: '#E9A23B', furDk: '#C2771F', furLt: '#F7C76C', face: '#F8D7B4', faceDk: '#E3AE84', faceLt: '#FFEBD6',
  ink: '#4A2A18', eye: '#2A160C', white: '#FFF8EC', mouth: '#7A2A22', tongue: '#EE7A6E', cheek: '#F2907A',
  langot: '#D8352A', langotDk: '#A4231C', gold: '#F2C230', goldDk: '#C4901A', thread: '#F4E3A2', tilak: '#E2452B',
  tilakLt: '#F7A23A', kajal: '#2A1E22', sole: '#F2B79A', bump: '#F0A88E', glow: '#FFD36A', lotus: '#F6B23A',
};

const BH_UP = { stand: 0, sit: 3.0, fly: 0 }, BH_LIFT = 5.6;   // fly: the whole body moves down by BH_LIFT
const BH_SH = [2.05, -7.7];
function bhArm(o, s) {
  const up = BH_UP[o.pose || 'stand'] ?? 0, sh = [s * BH_SH[0], BH_SH[1] + up], L1 = 1.85, L2 = 1.8;
  let h = s < 0 ? o.handL : o.handR;
  if (h) h = [h[0], h[1] + up];
  else { const a = (s < 0 ? o.aL : o.aR) ?? -1.2, ang = -1.25 + (clamp(a, -1.5, 1.6) + 1.2) * .6; h = [sh[0] + s * Math.cos(ang) * 3.3, sh[1] - Math.sin(ang) * 3.3]; }
  let dx = h[0] - sh[0], dy = h[1] - sh[1], d = Math.hypot(dx, dy) || 1e-3;
  const reach = L1 + L2 - .05;
  if (d > reach) { h = [sh[0] + dx / d * reach, sh[1] + dy / d * reach]; dx = h[0] - sh[0]; dy = h[1] - sh[1]; d = reach; }
  d = Math.max(d, .6);
  const a = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1)), base = Math.atan2(dy, dx);
  const e1 = [sh[0] + Math.cos(base + a) * L1, sh[1] + Math.sin(base + a) * L1], e2 = [sh[0] + Math.cos(base - a) * L1, sh[1] + Math.sin(base - a) * L1];
  const out = (e1[0] - e2[0]) * s > 0 ? e1 : e2, inn = out === e1 ? e2 : e1;
  return [sh, ((s < 0 ? o.bendL : o.bendR) ?? 1) < 0 ? inn : out, h];
}
function bhWorld(x, y, u, o, px, py) {
  const sq = (o.sq || 0), fx = o.flip ? -1 : 1, r = o.rot || 0, lift = o.pose === 'fly' ? BH_LIFT : 0;
  const lx = fx * px * u * (1 + sq * .6), ly = (py + lift) * u * (1 - sq);
  return [x + (o.dx || 0) * u + lx * Math.cos(r) - ly * Math.sin(r), y + (o.dy || 0) * u + lx * Math.sin(r) + ly * Math.cos(r)];
}
// the head centre in body u (before the pose's up offset), and the offsets the head's own drawing uses
function bhHeadLocal(o) { const up = o.pose === 'sit' ? BH_UP.sit : 0; return [clamp(o.hx || 0, -1, 1) * .35, -12.2 + (o.nod || 0) + up]; }
function bhHead(x, y, u, o = {}) { const h = bhHeadLocal(o); return bhWorld(x, y, u, o, h[0], h[1]); }
function bhMouth(x, y, u, o = {}) { const h = bhHeadLocal(o); return bhWorld(x, y, u, o, h[0] + clamp(o.hx || 0, -1, 1) * .45, h[1] + 1.55); }
function bhCheek(x, y, u, o = {}, s = 1) { const h = bhHeadLocal(o), p = clamp(o.puff || 0); return bhWorld(x, y, u, o, h[0] + s * (2.0 + p * .7), h[1] + 1.0); }
function bhJaw(x, y, u, o = {}) { const h = bhHeadLocal(o); return bhWorld(x, y, u, o, h[0] + 2.0, h[1] + 2.0); }
function bhBelly(x, y, u, o = {}) { return bhWorld(x, y, u, o, 0, -5.6 + (o.pose === 'sit' ? BH_UP.sit : 0)); }
function bhHand(x, y, u, o, s) { const [, , h] = bhArm(o, s); return bhWorld(x, y, u, o, h[0], h[1]); }

// the tail: one tapered ribbon from behind his hip, ending in a curl with a darker tuft
function bhTail(u, sw, o, C, dk) {
  const kind = o.tail || 'curl', ph = o.tailSway ?? T * 1.1, w = Math.sin(ph * TAU), w2 = Math.sin(ph * TAU + 1.3), up = BH_UP[o.pose || 'stand'] ?? 0;
  let P;
  if (kind === 'stream') P = [[.9, -3.6], [1.6, -1.6 + w * .2], [1.4 + w * .5, .8], [2.0 + w2 * .7, 3.0], [3.0 + w * .6, 4.6], [3.9 + w2 * .4, 5.2], [4.2, 4.5], [3.7, 4.1]];
  else if (kind === 'droop') P = [[1.2, -3.6], [3.0, -3.2], [4.6 + w * .15, -2.2], [5.6 + w * .2, -.9], [6.4, -.5], [6.9, -1.0], [6.6, -1.5]];
  else P = [[1.2, -3.8], [3.2, -3.4], [4.9 + w * .2, -4.4], [5.5 + w * .35, -6.6], [5.1 + w2 * .4, -8.8], [4.3 + w2 * .3, -9.9], [3.5 + w2 * .2, -9.6], [3.5 + w2 * .2, -8.8], [4.1 + w2 * .25, -8.75]];
  P = P.map(([a, b]) => [a, b + up]);
  paint(U(ribbon(P, .95, .5), u), { wash: C.fur, fill: dk, fillOp: 50, tex: .4, ink: C.ink, sw: sw * .8, curv: .3 });
  // the tuft at the tip
  const e = P[P.length - 1], f = P[P.length - 2], a = Math.atan2(e[1] - f[1], e[0] - f[0]);
  push(); translate(e[0] * u, e[1] * u); rotate(a);
  paint(U([[-.35, -.35], [.25, -.42], [.6, -.2], [.75, .05], [.55, .3], [.2, .4], [-.35, .32]], u), { wash: C.furDk, ink: C.ink, sw: sw * .6, curv: .5 });
  pop();
}

function balHanuman(x, y, u, o = {}) {
  const id = o.boilKey ?? 'bh' + (++CLAWD_N), rs = p => boilSeed(`balhan ${id} ${p}`);
  const C = { ...BH, ...(o.pal || {}) }, INK = C.ink;
  const pose = o.pose || 'stand', up = BH_UP[pose] ?? 0, fly = pose === 'fly', sit = pose === 'sit';
  const sq = (o.sq || 0) + (o.take || 0), sw = clamp(u / 20, .4, 2) * (o.swMul || 1), J = u * .03;
  const { col, dk, lt } = tintCols({ tint: o.tint, tintK: o.tintK, col: C.fur, dk: C.furDk, lt: C.furLt });
  const hx = clamp(o.hx || 0, -1, 1), wig = clamp(o.wiggle || 0, -1, 1), bel = clamp(o.belly || 0);
  const B = pts => U(pts.map(([a, b]) => [a, b + up]), u);    // body point list (stand coordinates) → this pose

  if (o.glowK) { rs('aura'); const [gx, gy] = bhWorld(x, y, u, o, 0, -9 + up); glow(gx, gy, u * 12, C.glow, o.glowK); }
  if (!o.noShadow && !fly) { rs('shadow'); const f = 1 - Math.min(.5, Math.abs(o.dy || 0) * .05); paint(ellPts(x + (o.dx || 0) * u, y + u * .1, u * (sit ? 4.4 : 3.4) * f, u * .75 * f, 22), { fill: PAL.ink, fillOp: 80, bleed: .25, tex: .3, border: .1, ink: null }); }
  push();
  translate(x + (o.dx || 0) * u, y + (o.dy || 0) * u);
  if (o.rot) rotate(o.rot);
  scale((o.flip ? -1 : 1) * (1 + sq * .6), 1 - sq);
  if (fly) translate(0, BH_LIFT * u);     // the belly sits on (x, y)
  if (o.behind) { rs('behind'); o.behind(u, sw); }

  // ---------------- the tail, behind everything
  rs('tail');
  push(); if (wig) { translate(0, -3.6 * u); rotate(wig * .12); translate(0, 3.6 * u); } bhTail(u, sw, o, C, dk); pop();

  // ---------------- legs (stand, fly): short and chubby, behind the langot
  if (!sit) {
    rs('legs');
    for (const s of [-1, 1]) {
      let hip = [s * 1.0, -3.5], knee, ank, sole = false;
      if (fly) {   // trailing down and back, kicking in turn; we see the soles
        const k = Math.sin(((o.kick ?? T * 1.6) + (s < 0 ? 0 : .5)) * TAU);
        knee = [s * 1.15, -1.9 + k * .25]; ank = [s * (1.0 + k * .15), -.5 + k * .55]; sole = true;
      } else {
        const l = o.walk == null ? 0 : Math.max(0, Math.sin((o.walk + (s < 0 ? 0 : .5)) * TAU)) * .7;
        knee = [s * 1.15 + wig * .3, -2.0 - l * .3]; ank = [s * 1.2 + wig * .15, -.75 - l];
      }
      paint(U(ribbon([hip, knee, ank], 1.55, 1.2), u), { wash: s < 0 ? col : lt, fill: dk, fillOp: s < 0 ? 40 : 15, tex: .4, ink: INK, sw: sw * .85, curv: .3 });
      if (sole) {
        paint(ellPts(ank[0] * u, (ank[1] + .45) * u, .72 * u, .9 * u, 16, J), { wash: C.sole, ink: INK, sw: sw * .75 });
        for (let k = 0; k < 4; k++) paint(ellPts((ank[0] - .42 + k * .28) * u, (ank[1] + 1.25 - Math.abs(k - 1.5) * .07) * u, .15 * u, .17 * u, 8), { wash: C.sole, ink: INK, sw: sw * .4 });
      } else {
        const fx = ank[0] + s * .15, fy = ank[1] + .35;
        paint(U([[fx - .85, fy + .3], [fx - .8, fy - .25], [fx - .1, fy - .45], [fx + .6, fy - .35], [fx + .95, fy + .05], [fx + .8, fy + .35], [fx, fy + .45]], u), { wash: s < 0 ? col : lt, ink: INK, sw: sw * .8, curv: .5 });
        for (const k of [-.4, -.05, .3]) inkLine(U([[fx + k * s, fy + .42], [fx + k * s + .04 * s, fy + .2]], u), sw * .45, dk, 'inkfine', 0);
      }
    }
  }

  // ---------------- body: a round tummy, the cream belly patch, the munja thread
  rs('body');
  const bw = 1 + bel * .12;
  push(); if (wig) { translate(0, (-3.6 + up) * u); rotate(wig * .06); translate(0, (3.6 - up) * u); }
  const torso = [[-1.9, -8.15], [0, -8.4], [1.9, -8.15], [2.35, -7.4], [2.75 * bw, -6.0], [2.85 * bw, -4.9], [2.5, -3.7], [1.4, -3.05], [0, -2.9], [-1.4, -3.05], [-2.5, -3.7], [-2.85 * bw, -4.9], [-2.75 * bw, -6.0], [-2.35, -7.4]];
  paint(B(torso), { wash: col, fill: dk, fillOp: 35, bleed: .08, tex: .45, border: .4, ink: INK, sw: sw * .9, curv: .45 });
  paint(B([[-2.6, -6.6], [-2.1, -7.3], [-1.75, -5.5], [-2.0, -3.9], [-2.6, -4.2], [-2.8, -5.3]]), { wash: dk, washOp: 70, ink: null, curv: .5 });   // shade on his right
  paint(ellPts(0, (-5.4 + up) * u, 1.75 * bw * u, 1.85 * bw * u, 20, J), { wash: C.faceLt, fill: C.faceDk, fillOp: 30, tex: .4, ink: null });
  inkLine(B([[-.18, -5.0], [0, -4.85], [.18, -5.0]]), sw * .5, C.faceDk, 'inkfine', .5);   // navel
  rs('thread');
  inkLine(B([[1.75, -8.1], [.9, -7.2], [-.4, -5.8], [-1.6, -4.6], [-2.35, -4.0]]), sw * 1.1, C.thread, 'ink', .5);
  inkLine(B([[1.75, -8.0], [.9, -7.1], [-.4, -5.7], [-1.6, -4.5], [-2.35, -3.9]]), sw * .3, C.goldDk, 'inkfine', .5);

  // ---------------- the langot: a gold waistband, a red wrap and a front flap
  rs('langot');
  paint(B([[-2.6, -4.35], [0, -4.15], [2.6, -4.35], [2.55, -3.45], [1.4, -2.95], [0, -2.75], [-1.4, -2.95], [-2.55, -3.45]]), { wash: C.langot, fill: C.langotDk, fillOp: 60, tex: .5, ink: INK, sw: sw * .8, curv: .35 });
  paint(B([[-.75, -3.6], [.75, -3.6], [.9, -2.3], [0, -1.95], [-.9, -2.3]]), { wash: C.langot, fill: C.langotDk, fillOp: 80, tex: .5, ink: INK, sw: sw * .7, curv: .4 });
  paint(B(ribbon([[-2.65, -4.4], [0, -4.2], [2.65, -4.4]], .42, .42)), { wash: C.gold, ink: INK, sw: sw * .55 });
  pop();

  // ---------------- sitting legs: toward us, soles out (drawn over the langot)
  if (sit) {
    rs('legs');
    for (const s of [-1, 1]) {
      const hip = [s * 1.2, -1.1], ft = [s * 2.75, -.5];
      paint(U(ribbon([hip, [s * 2.0, -.8], ft], 1.75, 1.5), u), { wash: s < 0 ? col : lt, fill: dk, fillOp: s < 0 ? 40 : 15, tex: .4, ink: INK, sw: sw * .85, curv: .3 });
      const fx = ft[0] + s * .2, fy = ft[1] - .1;
      paint(ellPts(fx * u, fy * u, .88 * u, 1.08 * u, 16, J, s * .15), { wash: C.sole, fill: C.faceDk, fillOp: 30, tex: .3, ink: INK, sw: sw * .8 });
      for (let k = 0; k < 4; k++) paint(ellPts((fx - .45 + k * .3) * u, (fy - .92 + Math.abs(k - 1.5) * .09) * u, .17 * u, .19 * u, 8), { wash: C.sole, ink: INK, sw: sw * .4 });
      paint(ellPts(fx * u, (fy + .15) * u, .38 * u, .42 * u, 10), { fill: C.cheek, fillOp: 70, bleed: .2, ink: null });   // a pink pad
    }
  }

  // ---------------- arms (the hands come last, over the held prop)
  const arms = [-1, 1].map(s => {
    const [sh, el, ha] = bhArm(o, s), sk = s < 0 ? col : lt, T3 = p => [p[0], p[1] - up];
    rs('arm' + s);
    paint(B(ribbon([T3(sh), T3(el), T3(ha)], 1.2, 1.0)), { wash: sk, fill: dk, fillOp: s < 0 ? 40 : 15, tex: .4, ink: INK, sw: sw * .8, curv: .3 });
    paint(B(ribbon([T3([ha[0] + (el[0] - ha[0]) * .28, ha[1] + (el[1] - ha[1]) * .28]), T3([ha[0] + (el[0] - ha[0]) * .4, ha[1] + (el[1] - ha[1]) * .4])], 1.12, 1.12)), { wash: C.gold, ink: INK, sw: sw * .45 });   // a gold bangle
    return { s, el, ha, sk };
  });

  // ---------------- head
  const hl = bhHeadLocal({ ...o, pose: 'stand' }), hy = hl[1] + up;
  push();
  translate(hx * .35 * u, hy * u);
  if (o.htilt) { translate(0, 3 * u); rotate(o.htilt); translate(0, -3 * u); }
  translate(0, 3.2 * u); scale(1.1); translate(0, -3.2 * u);   // a big baby head, grown from the neck
  const Hd = pts => U(pts, u);      // head-local: (0, 0) is the head centre
  const p = clamp(o.puff || 0), jw = clamp(o.jaw || 0), gl = clamp(o.cheekGlow || 0);
  rs('ears');
  for (const s of [-1, 1]) {
    paint(ellPts(s * (3.7 + p * .5) * u, .05 * u, .95 * u, 1.08 * u, 16, J), { wash: col, fill: dk, fillOp: 50, tex: .4, ink: INK, sw: sw * .75 });
    paint(ellPts(s * (3.75 + p * .5) * u, .1 * u, .55 * u, .68 * u, 12, J), { wash: C.face, fill: C.faceDk, fillOp: 50, tex: .4, ink: null });
    // the kundal: a gold hoop hanging from the lobe
    const kx = s * (3.85 + p * .5), ky = 1.55, sway = Math.sin(T * 2.3 + s) * .08;
    push(); translate(kx * u, ky * u); rotate(sway);
    paint(ellPts(0, .5 * u, .55 * u, .6 * u, 16), { wash: C.gold, ink: INK, sw: sw * .4 });
    paint(ellPts(0, .5 * u, .27 * u, .31 * u, 12), { wash: col, ink: INK, sw: sw * .3 });
    pop();
  }
  rs('head');
  const cw = 3.55 + p * .9;   // cheek width
  const head = [];   // a round baby head, chubby at the cheeks (wider with puff), bulging at the left jaw
  for (let k = 0; k < 24; k++) {
    const a = k / 24 * TAU, c = Math.cos(a), sn = Math.sin(a), low = Math.max(0, sn);
    head.push([c * (3.6 + low * (.25 + p * .9)) + (c > 0 ? jw * .75 * Math.max(0, Math.sin(2 * a)) : 0), sn * (sn < 0 ? 3.4 : 3.3 + jw * .2 * Math.max(0, c))]);
  }
  paint(Hd(head), { wash: col, fill: dk, fillOp: 35, bleed: .08, tex: .45, border: .4, ink: null, curv: .5 });
  paint(Hd(head), { ink: INK, sw, curv: .5 });
  // the face mask: a heart over the eyes, the muzzle below; the cheeks balloon with puff
  rs('mask');
  const mw = 2.45 + p * .85;
  const mask = [[0, -1.25], [-.6, -1.95], [-1.45, -2.1], [-2.25, -1.6], [-2.55, -.6], [-mw, .55], [-(mw - .3), 1.75], [-1.5, 2.65], [0, 2.95], [1.4 + jw * .3, 2.85 + jw * .5], [mw - .3 + jw * .65, 1.9 + jw * .45], [mw + jw * .3, .55], [2.55, -.6], [2.25, -1.6], [1.45, -2.1], [.6, -1.95]];
  paint(Hd(mask), { wash: C.face, fill: C.faceDk, fillOp: 30, bleed: .08, tex: .35, border: .4, ink: INK, sw: sw * .7, curv: .5 });
  if (jw > 0) {   // the swollen left jaw (his left = our right): the mask bulges there, a little red, with a shine
    rs('jaw');
    paint(ellPts((2.0 + p * .4) * u, 2.0 * u, .95 * u, .75 * u, 14), { fill: C.bump, fillOp: 210 * jw, bleed: .25, tex: .4, ink: null });
    paint(ellPts((2.25 + p * .4) * u, 1.65 * u, .22 * u, .14 * u, 8, 0, -.5), { wash: C.white, washOp: 200 * jw, ink: null });
    if (o.plaster) {   // a little crossed plaster
      push(); translate((2.1 + p * .4) * u, 2.15 * u);
      for (const a of [.6, -.6]) { push(); rotate(a); paint(rrPts(-.7 * u, -.2 * u, 1.4 * u, .4 * u, .12 * u), { wash: '#F6E7CF', ink: INK, sw: sw * .4 }); pop(); }
      pop();
    }
  }
  paint(ellPts(0, 1.95 * u, 1.55 * u, .95 * u, 16, J), { wash: C.faceLt, washOp: 150, ink: null });   // the muzzle, a touch lighter
  if (gl > 0 || p > 0) {   // the cheeks, full (and shining when the sun is inside)
    for (const s of [-1, 1]) {
      paint(ellPts(s * (1.75 + p * .55) * u, 1.2 * u, (.75 + p * .55) * u, (.6 + p * .45) * u, 16), { wash: mixCol(C.face, '#FFE9A6', gl), washOp: 120 + 135 * Math.max(p, gl) * .8, ink: null });
      if (gl > 0) glow(s * (1.75 + p * .55) * u, 1.2 * u, (2.2 + p) * u, C.glow, gl * .9);
    }
  }
  rs('tuft');   // "kunchit kesa": a curly tuft on top
  paint(Hd(ribbon([[-.35, -3.1], [-.2, -3.9], [.35, -4.45], [.95, -4.25], [.95, -3.7], [.55, -3.55]], .75, .25)), { wash: col, fill: dk, fillOp: 40, ink: INK, sw: sw * .7 });
  for (const s of [-1, 1]) paint(Hd(ribbon([[s * .7, -3.05], [s * 1.1, -3.55], [s * 1.55, -3.6]], .45, .12)), { wash: col, ink: INK, sw: sw * .55 });
  rs('tilak');   // a sindoor tilak: a red U, an orange line in it
  paint(Hd([[-.42, -2.95], [-.32, -1.75], [0, -1.45], [.32, -1.75], [.42, -2.95], [.22, -2.95], [.15, -1.9], [0, -1.75], [-.15, -1.9], [-.22, -2.95]]), { wash: C.tilak, ink: null, curv: .3 });
  paint(Hd([[-.08, -2.85], [.08, -2.85], [.06, -2.05], [-.06, -2.05]]), { wash: C.tilakLt, ink: null });
  rs('nazar');
  paint(ellPts(-2.55 * u, -2.0 * u, .22 * u, .22 * u, 10), { wash: C.kajal, ink: null });   // the kajal dot

  push(); translate(hx * .5 * u, 0);
  // ---- brows: little dark arcs at the top of the mask
  rs('brows');
  const ek = Array.isArray(o.eyes) ? o.eyes[0] : o.eyes;
  const bAng = clamp((o.brows ?? 0) - (['angry', 'determined'].includes(ek) ? .8 : 0), -1, 1), wy = clamp(o.worry || 0) + (['sad', 'scared'].includes(ek) ? .7 : 0);
  for (const s of [-1, 1]) {
    const lift = Math.max(0, bAng) * .3, inY = -1.6 - lift + Math.min(0, bAng) * -.3 - wy * .3, outY = -1.75 - lift - Math.min(0, bAng) * -.1 + wy * .1;
    paint(Hd(ribbon([[s * .55, inY], [s * 1.15, (inY + outY) / 2 - .12], [s * 1.75, outY]], .26, .14)), { wash: C.furDk, ink: null });
  }
  // ---- eyes
  rs('eyes');
  const kinds = Array.isArray(o.eyes) ? o.eyes : o.eyes === 'wink' ? ['normal', 'happy'] : [o.eyes || 'normal', o.eyes || 'normal'];
  const own = k => ['normal', 'look', 'wide', 'happy', 'closed', 'squeeze', 'sad', 'sparkle', 'heart', 'swirl'].includes(k);
  if (kinds.every(own)) {
    const lx = (o.lookX || 0) * .2, ly = (o.lookY || 0) * .18;
    const blink = ((T * .9 + (o.seed || 0) * 1.7 + .4) % 3.4) < .11;
    [-1, 1].forEach((s, i) => {
      const k = (o.squint || 0) > .6 ? 'squeeze' : kinds[i], ex = s * 1.2, ey = -.45;
      if (k === 'happy') { inkLine(Hd([[ex - .55, ey + .2], [ex, ey - .4], [ex + .55, ey + .2]]), sw * 1.25, INK, 'ink', .6); return; }
      if (k === 'closed' || (blink && !['heart', 'swirl', 'sparkle'].includes(k))) { inkLine(Hd([[ex - .55, ey], [ex, ey + .35], [ex + .55, ey]]), sw * 1.15, INK, 'ink', .6); return; }
      if (k === 'squeeze') { inkLine(Hd([[ex - s * .5, ey - .4], [ex + s * .35, ey], [ex - s * .5, ey + .35]]), sw * 1.25, INK, 'ink', .2); return; }
      if (k === 'heart') { paint(heartPts(ex * u, (ey + .05) * u, .78 * u * (1 + .1 * Math.sin(T * 9))), { wash: '#E2476E', ink: INK, sw: sw * .6 }); return; }
      if (k === 'swirl') {
        paint(ellPts(ex * u, ey * u, .68 * u, .76 * u, 18), { wash: C.white, ink: INK, sw: sw * .6 });
        const sp = []; for (let j = 0; j < 22; j++) { const a = j * .55 + T * 9 * s, r = .08 + j * .026; sp.push([ex + Math.cos(a) * r, ey + Math.sin(a) * r]); }
        inkLine(Hd(sp), sw * .65, INK, 'inkfine', .5); return;
      }
      const wide = k === 'wide', big = k === 'sparkle', rx = wide ? .76 : big ? .74 : .68, ry = wide ? .9 : big ? .88 : .82;
      paint(Hd(ellPts(ex, ey, rx, ry, 18)), { wash: C.white, ink: null });
      const pr = wide ? .3 : big ? .58 : .5;
      paint(ellPts((ex + lx) * u, (ey + ly + .05) * u, pr * u, pr * 1.15 * u, 14), { wash: C.eye, ink: null });
      if (big) {   // food eyes: a star of light in each, twinkling
        const tw = 1 + .18 * Math.sin(T * 14 + s);
        paint(starPts((ex + lx - .08) * u, (ey + ly - .08) * u, .42 * u * tw, .38, 4), { wash: C.white, ink: null });
        paint(ellPts((ex + lx + .22) * u, (ey + ly + .3) * u, .09 * u, .09 * u, 6), { wash: C.white, ink: null });
      } else {
        paint(ellPts((ex + lx - .15) * u, (ey + ly - .2) * u, .16 * u, .18 * u, 8), { wash: C.white, ink: null });
        paint(ellPts((ex + lx + .15) * u, (ey + ly + .22) * u, .07 * u, .07 * u, 6), { wash: C.white, washOp: 210, ink: null });
      }
      inkLine(Hd([[ex - rx * 1.05, ey + .05], [ex - rx * .5, ey - ry * .97], [ex + rx * .5, ey - ry * .97], [ex + rx * 1.05, ey + .05]]), sw * 1.2, INK, 'ink', .5);   // the upper lid
      if (k === 'sad') inkLine(Hd([[ex - .45, ey + ry * .75], [ex + .45, ey + ry * .75]]), sw * .5, C.faceDk, 'inkfine', .5);
    });
  } else { push(); translate(0, -.2 * u); scale(.46); translate(0, 6 * u); eyes(u, o, sw / .46 * .85, [-1, 1], 0); pop(); }
  // ---- cheeks, nose, mouth
  rs('blush');
  if (o.blush) for (const s of [-1, 1]) paint(ellPts(s * (2.05 + p * .5) * u, .9 * u, .6 * u, .34 * u, 14), { fill: C.cheek, fillOp: 170 * clamp(o.blush), bleed: .2, tex: .4, ink: null });
  rs('nose');
  for (const s of [-1, 1]) paint(ellPts(s * .24 * u, .82 * u, .11 * u, .08 * u, 8, 0, s * .4), { wash: C.ink, ink: null });
  rs('mouth');
  const m = o.mouth || 'smile', my = 1.6, mk = clamp(o.mouthK ?? 1, 0, 1.4), dark = C.mouth;
  if (m === 'smile') inkLine(Hd([[-.8, my - .15], [0, my + .3], [.8, my - .15]]), sw * .9, INK, 'ink', .6);
  else if (m === 'cat') inkLine(Hd([[-.75, my - .05], [-.38, my + .25], [0, my], [.38, my + .25], [.75, my - .05]]), sw * .85, INK, 'ink', .5);
  else if (m === 'grin') {
    paint(Hd([[-1.05, my - .25], [1.05, my - .25], [.8, my + .5], [0, my + .8], [-.8, my + .5]]), { wash: dark, ink: INK, sw: sw * .75, curv: .45 });
    paint(Hd([[-.5, my + .45], [.5, my + .45], [0, my + .75]]), { wash: C.tongue, ink: null, curv: .5 });
  } else if (m === 'O') paint(Hd(ellPts(0, my + .2, .38 * mk + .1, .46 * mk + .1, 12)), { wash: dark, ink: INK, sw: sw * .7 });
  else if (m === 'open' || m === 'yawn' || m === 'wail') {
    const w = (m === 'yawn' ? .7 : .75) * (.6 + .5 * mk), d = (m === 'yawn' ? 1.3 : .9) * (.5 + .6 * mk);
    paint(Hd([[-w, my - .2], [w, my - .2], [w * .8, my + d * .6], [0, my + d], [-w * .8, my + d * .6]]), { wash: dark, ink: INK, sw: sw * .75, curv: .5 });
    paint(Hd([[-w * .55, my + d * .65], [w * .55, my + d * .65], [0, my + d * .95]]), { wash: C.tongue, ink: null, curv: .5 });
  } else if (m === 'aam') {   // the gulp: a huge round mouth, wider than his face at mk 1.4
    const r = .45 + mk * 1.35;
    paint(ellPts(0, (my + .25 + mk * .35) * u, r * u, r * .92 * u, 22), { wash: dark, ink: INK, sw: sw * .9 });
    paint(ellPts(0, (my + .25 + mk * .35 + r * .5) * u, r * .6 * u, r * .32 * u, 14), { wash: C.tongue, ink: null });
    paint(ellPts(0, (my + .25 + mk * .35 - r * .78) * u, r * .5 * u, r * .12 * u, 10), { wash: C.white, washOp: 230, ink: null });   // two milk teeth
  } else if (m === 'puff') {
    paint(ellPts(0, (my + .15) * u, .32 * u, .22 * u, 10), { wash: C.faceDk, ink: INK, sw: sw * .7 });
    if (gl > 0) for (let i = 0; i < 4; i++) {   // light leaking from his lips
      const a = -.5 + i * .35 + Math.sin(T * 5 + i) * .05, l = (.8 + .4 * hash(i)) * gl;
      paint([[Math.cos(a) * .3 * u, (my + .15) * u + Math.sin(a) * .15 * u], [Math.cos(a - .06) * (.3 + l) * u, (my + .15) * u + Math.sin(a) * (.15 + l * .4) * u + l * .3 * u], [Math.cos(a + .06) * (.3 + l) * u, (my + .15) * u + Math.sin(a) * (.15 + l * .4) * u + l * .3 * u]], { wash: '#FFF2B8', washOp: 200, ink: null });
    }
  } else if (m === 'chew') {
    const c = Math.sin(T * 14);
    if (c > 0) inkLine(Hd([[-.55, my + .1], [0, my + .25 + c * .1], [.55, my + .1]]), sw * .85, INK, 'ink', .6);
    else paint(ellPts(0, (my + .15) * u, .32 * u, (.12 - c * .1) * u, 10), { wash: dark, ink: INK, sw: sw * .65 });
  } else if (m === 'pout') {
    paint(ellPts(0, (my + .2) * u, .38 * u, .26 * u, 10), { wash: C.cheek, ink: INK, sw: sw * .7 });
    inkLine(Hd([[-.2, my + .2], [.2, my + .2]]), sw * .4, INK, 'inkfine', 0);
  } else if (m === 'frown') inkLine(Hd([[-.7, my + .3], [0, my - .08], [.7, my + .3]]), sw * .85, INK, 'ink', .6);
  else if (m === 'flat') inkLine(Hd([[-.55, my + .1], [.55, my + .1]]), sw * .8, INK, 'ink', 0);
  else { push(); translate(0, my * u); scale(.42); translate(0, 4.3 * u); mouth(u, m, sw / .42 * .8); pop(); }
  if (o.drool) {   // a drop from the corner of his mouth, stretching down
    const dk2 = clamp(o.drool), dy2 = .3 + dk2 * .9;
    paint([[.55 * u, (my + .1) * u], [.75 * u, (my + .2) * u], [.78 * u, (my + .2 + dy2) * u], [.62 * u, (my + .45 + dy2) * u], [.48 * u, (my + .2 + dy2) * u]], { wash: '#BFE3F2', washOp: 220, ink: INK, sw: sw * .4, curv: .6 });
  }
  pop();   // face offset
  if (o.hat) { rs('hat'); o.hat(u, sw); }
  pop();   // head

  // ---------------- Indra's garland of gold lotuses
  if (o.garland) {
    rs('garland');
    const g = clamp(o.garland), n = 9;
    for (let i = 0; i < n; i++) {
      const k = i / (n - 1), a = Math.PI * (1 - k), gx = Math.cos(a) * 2.15, gy = -7.9 + Math.sin(a) * 2.2 * g + (1 - g) * -.5;
      if (k > g + .05 && g < 1) continue;
      const lx = gx * u, ly = (gy + up) * u, r = .5 * u;   // a little gold lotus: three petals up, two out
      for (const [pa, pl] of [[-Math.PI / 2, 1], [-Math.PI / 2 - .7, .85], [-Math.PI / 2 + .7, .85], [-Math.PI / 2 - 1.5, .7], [-Math.PI / 2 + 1.5, .7]])
        paint([[lx, ly], [lx + Math.cos(pa - .35) * r * .6 * pl, ly + Math.sin(pa - .35) * r * .6 * pl], [lx + Math.cos(pa) * r * pl, ly + Math.sin(pa) * r * pl], [lx + Math.cos(pa + .35) * r * .6 * pl, ly + Math.sin(pa + .35) * r * .6 * pl]], { wash: C.lotus, ink: INK, sw: sw * .3, curv: .5 });
      paint(ellPts(lx, ly + .1 * u, .2 * u, .14 * u, 8), { wash: C.goldDk, ink: null });
    }
  }
  if (o.held) { rs('held'); o.held(u, sw); }
  for (const A of arms) {
    rs('hand' + A.s);
    const shape = (A.s < 0 ? o.handShapeL : o.handShapeR) || 'open';
    const a = (A.s < 0 ? o.handAL : o.handAR) ?? Math.atan2(A.ha[1] - A.el[1], A.ha[0] - A.el[0]);
    push(); translate(A.ha[0] * u, A.ha[1] * u); rotate(a); translate(-.2 * u, 0);
    scale(.95); aaravHandShape(u, sw / .95, shape, A.s, A.sk, dk, INK);
    pop();
  }
  pop();

  if (o.emote) {
    rs('emote');
    const h = bhHeadLocal(o), top = EMOTE_TOP.includes(o.emote);
    const [ex, ey] = bhWorld(x, y, u, o, (o.flip ? -1 : 1) * 3.9, h[1] - 3.6);
    emote(o.emote, top ? bhHead(x, y, u, o)[0] : ex, top ? bhWorld(x, y, u, o, 0, h[1] - 5.6)[1] : ey, u * 1.0, o.emoteK ?? 1, o.emoteAge ?? T);
  }
  rs('after');
}

// Model sheet: studio.html?loop=balhanuman, or node render.mjs --loop=balhanuman --sheet=0.5,1.5,2.5,3.5 --cols=4 --w=540
(() => {
  LOOPS.balhanuman = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: '#EDE3D2', ink: null });
    const u = 26, cyc = t % 4;
    // 1 · sitting, an emotion timeline: hungry pout → food eyes → drool
    const e1 = emotions(t, [[0, 'neutral'], [1.2, 'sad', { mouth: 'pout' }], [2.4, 'starstruck', { eyes: 'sparkle', mouth: 'smile' }]]);
    balHanuman(260, 640, u, { pose: 'sit', ...e1, drool: cyc > 2.8 ? seg(cyc, 2.8, 3.6) : 0, handL: [-2.3, -5.4], handR: [2.4, -5.0], handShapeL: 'open', handShapeR: 'open', boilKey: 'h1' });
    // 2 · standing, the gulp: aam → puff with the glow
    const g = cyc < 1.4 ? 0 : cyc < 2 ? 1 : 2;
    balHanuman(800, 640, u, { eyes: g === 2 ? 'happy' : 'wide', mouth: g === 0 ? 'aam' : g === 1 ? 'aam' : 'puff', mouthK: g === 0 ? ease(cyc / 1.4) * 1.4 : 1.4, puff: g === 2 ? 1 : 0, cheekGlow: g === 2 ? 1 : 0,
      handL: [-3.2, -9.5], handR: [3.2, -9.5], boilKey: 'h2', seed: 2 });
    // 3 · flying up and right, reaching
    balHanuman(260, 1150, u, { pose: 'fly', rot: .55, eyes: 'sparkle', mouth: 'open', mouthK: .6, tail: 'stream', handL: [-2.2, -11.5], handR: [2.0, -12.0], handShapeL: 'open', handShapeR: 'claw', boilKey: 'h3' });
    // 4 · dazed with the bump, sitting
    balHanuman(800, 1300, u, { pose: 'sit', eyes: 'swirl', mouth: 'wobble', jaw: 1, tail: 'droop', aL: -1, aR: -1, emote: 'stars', boilKey: 'h4' });
    // 5 · proud, with the garland and the bump
    balHanuman(260, 1820, u * .9, { eyes: 'happy', mouth: 'grin', jaw: 1, garland: 1, handL: [-2.0, -10.6], handShapeL: 'fist', handR: [4.0, -9.5], handShapeR: 'fist', bendR: 1, blush: .6, boilKey: 'h5' });
    // 6 · the butt wiggle
    balHanuman(800, 1820, u * .9, { eyes: 'sparkle', mouth: 'cat', wiggle: Math.sin(t * 14), nod: .6, handL: [-1.6, -2.8], handR: [1.6, -2.8], handShapeL: 'claw', handShapeR: 'claw', boilKey: 'h6' });
  };
  LOOPS.balhanuman.len = 4;
})();
