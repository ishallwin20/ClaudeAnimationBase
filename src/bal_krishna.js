// bal_krishna.js: Bal Krishna, little Kanha of Gokul, as the Bhagavata and the painters show him: dark blue skin (Vishnu's
// blue, as in vishnu.js), big kajal-lined eyes, black curls (alakas) with a topknot, a pearl band and a PEACOCK
// FEATHER, the white Vaishnava tilak, a kajal nazar dot, gold kundals, a pearl necklace with a crescent pendant, a
// yellow pitambar with a red border and a gold kardhani of little bells, anklets, bangles, and his flute tucked at the
// waist. Built on Bal Hanuman's proportions (bal_hanuman.js), so the two babies match. Front view, in two poses:
//   pose 'stand'  (x, y) is the ground between his feet. About 17u tall to the topknot (21u to the feather tip).
//   pose 'sit'    sitting on his bottom, legs out toward us, soles showing: (x, y) is the ground under him.
// Load after bappa.js (U()), clawd.js (eyes() / mouth() / emote(), so feel() and emotions() drive him) and aarav.js
// (his hands are Aarav's hand shapes, in blue).
//
// Body-local coordinates in u (y up is negative), for 'stand' ('sit' moves everything from the hips up down by 3u):
//   feet (±1.2, -.4) · hips (±1, -3.4) · pitambar -4.5..-2.0 · belly (0, -5.6) · shoulders (±2.05, -7.7)
//   head centre (0, -12.2), 3.6 × 3.4 (drawn 1.1× about the neck) · eyes (±1.25, -12.6) · mouth (0, -10.6)
//   topknot (0, -16.9) · feather eye about (1.3, -21)
//
// Options (all optional):
//   pose:   pose, dx, dy (u), sq, rot (pivots at (x, y)), flip, hx (-1..1 head turn), htilt (radians), nod (u, the head
//           dips), walk (phase, stand), shake (radians: the head shakes "no"), wiggle (-1..1: the bottom swings)
//   arms:   handL / handR = [x, y] in body u (2-bone arms; out-of-reach targets are pulled in), bendL / bendR (1 elbows
//           out, -1 in), handShapeL / handShapeR (Aarav's: 'open' | 'fist' | 'claw' | 'point' | 'hold'), handAL / handAR.
//           Without targets, aL / aR (feel()'s arm angles) swing them; resting they hang by his tummy.
//   face:   eyes, mouth, lookX / lookY, squint, blush, brows (-1 cross .. +1 raised), worry 0..1, mouthK (size of 'aam' /
//           'open' / 'wail'), seed, tint + tintK. His own eyes: 'normal' / 'look' / 'wide' / 'happy' / 'closed' /
//           'squeeze' / 'sad' / 'sparkle' / 'heart' / 'swirl' / 'innocent' (huge shiny puppy eyes: "who, ME?") /
//           'scared' (small pupils); a pair mixes them, 'wink' is ['normal', 'happy']; every other kind is Clawd's.
//           His own mouths: 'smile' / 'grin' / 'O' / 'open' / 'aam' (wide open: "aaaa") / 'puff' (lips pressed, cheeks
//           full) / 'chew' / 'pout' / 'wail' / 'frown' / 'flat' / 'yawn' / 'cat' / 'giggle'; every other kind is Clawd's.
//   cosmos: 0..1 inside the 'aam' mouth there is NIGHT: stars, a swirl of galaxy, a little sun and moon (BhP 10.8.37)
//   mud:    0..1 mud smudged round his mouth, on a cheek and on his right hand (he ate some)
//   cheeks: puff 0..1 (the cheeks balloon out)
//   extras: feather (default true), featherWob (phase), flute (default true: tucked in the kardhani), glowK (a soft
//           blue-gold aura, drawn first), emote + emoteK + emoteAge, hooks behind(u, sw) (body space, first) / hat(u, sw)
//           (head space) / held(u, sw) (body space, under the hands), boilKey, noShadow, swMul
// Helpers: bkHand(x, y, u, o, s), bkHead(x, y, u, o), bkMouth(x, y, u, o), bkBelly(x, y, u, o), bkChest(x, y, u, o)
//          → world [x, y].
const BK = {
  skin: '#5C8FD8', skinDk: '#3E6CB8', skinLt: '#8EB6EE', ink: '#1E2A4A', hair: '#1E1B2E', hairLt: '#46426A',
  eye: '#141428', white: '#FFF8EC', mouth: '#5A1E36', tongue: '#E87A8A', cheek: '#E58AB6', sole: '#A8C6F2',
  pit: '#F7C948', pitDk: '#D99A22', pitLt: '#FFE38A', border: '#D2452F', gold: '#F2C230', goldDk: '#B88A1C',
  goldLt: '#FFE69A', pearl: '#FFF6E8', gem: '#D2283A', feather: '#4FA25A', featherDk: '#2A6E40', featherLt: '#9CC24A',
  fEye1: '#E2B83A', fEye2: '#1F9C94', fEye3: '#24407E', tilak: '#FFF4DE', tilakRed: '#E2452B', kajal: '#141428',
  flute: '#C98E4A', fluteDk: '#8E5A28', mud: '#7A4E30', mudLt: '#9A6A44', night: '#1A1440', star: '#FFF4C8', glow: '#FFD98A',
};

const BK_UP = { stand: 0, sit: 3.0 };
const BK_SH = [2.05, -7.7];
function bkArm(o, s) {
  const up = BK_UP[o.pose || 'stand'] ?? 0, sh = [s * BK_SH[0], BK_SH[1] + up], L1 = 1.85, L2 = 1.8;
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
function bkWorld(x, y, u, o, px, py) {
  const sq = (o.sq || 0), fx = o.flip ? -1 : 1, r = o.rot || 0;
  const lx = fx * px * u * (1 + sq * .6), ly = py * u * (1 - sq);
  return [x + (o.dx || 0) * u + lx * Math.cos(r) - ly * Math.sin(r), y + (o.dy || 0) * u + lx * Math.sin(r) + ly * Math.cos(r)];
}
function bkHeadLocal(o) { const up = o.pose === 'sit' ? BK_UP.sit : 0; return [clamp(o.hx || 0, -1, 1) * .35, -12.2 + (o.nod || 0) + up]; }
function bkHead(x, y, u, o = {}) { const h = bkHeadLocal(o); return bkWorld(x, y, u, o, h[0], h[1]); }
function bkMouth(x, y, u, o = {}) { const h = bkHeadLocal(o); return bkWorld(x, y, u, o, h[0] + clamp(o.hx || 0, -1, 1) * .5, h[1] + 1.75); }
function bkBelly(x, y, u, o = {}) { return bkWorld(x, y, u, o, 0, -5.6 + (o.pose === 'sit' ? BK_UP.sit : 0)); }
function bkChest(x, y, u, o = {}) { return bkWorld(x, y, u, o, 0, -7.2 + (o.pose === 'sit' ? BK_UP.sit : 0)); }
function bkHand(x, y, u, o, s) { const [, , h] = bkArm(o, s); return bkWorld(x, y, u, o, h[0], h[1]); }

// the peacock feather, in head space: a stem from the topknot, a green vane with barbs, the eye at the tip
function bkFeather(u, sw, C, wob) {
  const w = Math.sin(wob * TAU) * .18, w2 = Math.sin(wob * TAU - .8) * .3;
  const S = [[.2, -4.95], [.75, -6.0 + w * .2], [1.35 + w, -7.0], [1.95 + w2, -7.9]];
  const tip = S[3], a = Math.atan2(S[3][1] - S[2][1], S[3][0] - S[2][0]);
  // the vane: a long leaf round the upper stem
  const n = [-Math.sin(a), Math.cos(a)], L = (k, r) => { const p = [lerp(S[0][0], tip[0], k), lerp(S[0][1], tip[1], k)]; return [p[0] + n[0] * r, p[1] + n[1] * r]; };
  const vane = [L(.12, 0), L(.35, .45), L(.65, .75), L(.95, .7), L(1.02, 0), L(.95, -.7), L(.65, -.75), L(.35, -.45)];
  paint(U(vane, u), { wash: C.feather, fill: C.featherDk, fillOp: 60, tex: .5, ink: C.ink, sw: sw * .5, curv: .5 });
  for (let i = 2; i < 7; i++) for (const s of [-1, 1]) { const k = i / 7.5; inkLine(U([L(k, 0), L(k + .07, s * (.3 + .35 * Math.sin(k * Math.PI)))], u), sw * .35, C.featherLt, 'inkfine', .3); }
  inkLine(U(S, u), sw * .55, C.featherDk, 'inkfine', .5);
  // the eye
  push(); translate(tip[0] * u, tip[1] * u); rotate(a + Math.PI / 2);
  paint(ellPts(0, .1 * u, .88 * u, 1.1 * u, 18), { wash: C.featherLt, ink: C.ink, sw: sw * .45 });
  paint(ellPts(0, .2 * u, .7 * u, .9 * u, 16), { wash: C.fEye1, ink: null });
  paint(ellPts(0, .28 * u, .5 * u, .66 * u, 14), { wash: C.fEye2, ink: null });
  paint(ellPts(0, .36 * u, .28 * u, .38 * u, 12), { wash: C.fEye3, ink: null });
  pop();
}

function balKrishna(x, y, u, o = {}) {
  const id = o.boilKey ?? 'bk' + (++CLAWD_N), rs = p => boilSeed(`balkrishna ${id} ${p}`);
  const C = { ...BK, ...(o.pal || {}) }, INK = C.ink;
  const pose = o.pose || 'stand', up = BK_UP[pose] ?? 0, sit = pose === 'sit';
  const sq = (o.sq || 0) + (o.take || 0), sw = clamp(u / 20, .4, 2) * (o.swMul || 1), J = u * .03;
  const { col, dk, lt } = tintCols({ tint: o.tint, tintK: o.tintK, col: C.skin, dk: C.skinDk, lt: C.skinLt });
  const hx = clamp(o.hx || 0, -1, 1), wig = clamp(o.wiggle || 0, -1, 1), mud = clamp(o.mud || 0);
  const B = pts => U(pts.map(([a, b]) => [a, b + up]), u);    // body point list (stand coordinates) → this pose

  if (o.glowK) { rs('aura'); const [gx, gy] = bkWorld(x, y, u, o, 0, -10 + up); glow(gx, gy, u * 13, C.glow, o.glowK); }
  if (!o.noShadow) { rs('shadow'); const f = 1 - Math.min(.5, Math.abs(o.dy || 0) * .05); paint(ellPts(x + (o.dx || 0) * u, y + u * .1, u * (sit ? 4.4 : 3.4) * f, u * .75 * f, 22), { fill: PAL.ink, fillOp: 80, bleed: .25, tex: .3, border: .1, ink: null }); }
  push();
  translate(x + (o.dx || 0) * u, y + (o.dy || 0) * u);
  if (o.rot) rotate(o.rot);
  scale((o.flip ? -1 : 1) * (1 + sq * .6), 1 - sq);
  if (o.behind) { rs('behind'); o.behind(u, sw); }

  // ---------------- standing legs: short and chubby, anklets with bells
  if (!sit) {
    rs('legs');
    for (const s of [-1, 1]) {
      const l = o.walk == null ? 0 : Math.max(0, Math.sin((o.walk + (s < 0 ? 0 : .5)) * TAU)) * .7;
      const hip = [s * 1.0, -3.5], knee = [s * 1.15 + wig * .3, -2.0 - l * .3], ank = [s * 1.2 + wig * .15, -.75 - l];
      paint(U(ribbon([hip, knee, ank], 1.55, 1.2), u), { wash: s < 0 ? col : lt, fill: dk, fillOp: s < 0 ? 40 : 15, tex: .4, ink: INK, sw: sw * .85, curv: .3 });
      const fx = ank[0] + s * .15, fy = ank[1] + .35;
      paint(U([[fx - .85, fy + .3], [fx - .8, fy - .25], [fx - .1, fy - .45], [fx + .6, fy - .35], [fx + .95, fy + .05], [fx + .8, fy + .35], [fx, fy + .45]], u), { wash: s < 0 ? col : lt, ink: INK, sw: sw * .8, curv: .5 });
      for (const k of [-.4, -.05, .3]) inkLine(U([[fx + k * s, fy + .42], [fx + k * s + .04 * s, fy + .2]], u), sw * .45, dk, 'inkfine', 0);
      paint(U(ribbon([[ank[0] - .75, ank[1] - .05], [ank[0] + .75, ank[1] - .05]], .3, .3), u), { wash: C.gold, ink: INK, sw: sw * .4 });   // the anklet
      for (const k of [-.45, 0, .45]) paint(ellPts((ank[0] + k) * u, (ank[1] + .2) * u, .13 * u, .13 * u, 7), { wash: C.goldLt, ink: INK, sw: sw * .3 });
    }
  }

  // ---------------- body: a round tummy, the pearls and the crescent pendant
  rs('body');
  push(); if (wig) { translate(0, (-3.6 + up) * u); rotate(wig * .06); translate(0, (3.6 - up) * u); }
  const torso = [[-1.9, -8.15], [0, -8.4], [1.9, -8.15], [2.35, -7.4], [2.75, -6.0], [2.85, -4.9], [2.5, -3.7], [1.4, -3.05], [0, -2.9], [-1.4, -3.05], [-2.5, -3.7], [-2.85, -4.9], [-2.75, -6.0], [-2.35, -7.4]];
  paint(B(torso), { wash: col, fill: dk, fillOp: 35, bleed: .08, tex: .45, border: .4, ink: INK, sw: sw * .9, curv: .45 });
  paint(B([[-2.6, -6.6], [-2.1, -7.3], [-1.75, -5.5], [-2.0, -3.9], [-2.6, -4.2], [-2.8, -5.3]]), { wash: dk, washOp: 70, ink: null, curv: .5 });   // shade on his right
  paint(ellPts(.5 * u, (-6.2 + up) * u, 1.1 * u, 1.2 * u, 16, J), { wash: lt, washOp: 90, ink: null });   // the tummy's light
  inkLine(B([[-.18, -5.0], [0, -4.85], [.18, -5.0]]), sw * .5, dk, 'inkfine', .5);   // navel
  rs('pearls');
  for (let i = 0; i <= 10; i++) { const k = i / 10, a = Math.PI * (1 - k); paint(ellPts(Math.cos(a) * 1.75 * u, (-7.95 + Math.sin(a) * 1.05 + up) * u, .17 * u, .17 * u, 7), { wash: C.pearl, ink: INK, sw: sw * .25 }); }
  inkLine(B([[-1.9, -8.0], [-1.2, -6.95], [0, -6.55], [1.2, -6.95], [1.9, -8.0]]), sw * .9, C.gold, 'ink', .6);
  paint(B([[-.55, -6.6], [0, -6.35], [.55, -6.6], [.3, -6.0], [0, -5.85], [-.3, -6.0]]), { wash: C.goldLt, ink: INK, sw: sw * .4, curv: .5 });   // the crescent
  paint(ellPts(0, (-6.1 + up) * u, .14 * u, .14 * u, 7), { wash: C.gem, ink: null });

  // ---------------- the pitambar: a yellow wrap, a front pleat, a red border; the gold kardhani with bells
  rs('pitambar');
  if (sit) paint(B([[-2.62, -4.45], [0, -4.25], [2.62, -4.45], [2.8, -3.55], [0, -3.35], [-2.8, -3.55]]), { wash: C.pit, fill: C.pitDk, fillOp: 55, tex: .5, ink: INK, sw: sw * .8, curv: .35 });
  else {
  paint(B([[-2.62, -4.45], [0, -4.25], [2.62, -4.45], [2.75, -3.2], [2.3, -2.05], [1.2, -1.85], [.5, -2.3], [0, -2.4], [-.5, -2.3], [-1.2, -1.85], [-2.3, -2.05], [-2.75, -3.2]]), { wash: C.pit, fill: C.pitDk, fillOp: 55, tex: .5, ink: INK, sw: sw * .8, curv: .35 });
  inkLine(B([[-2.3, -2.2], [-1.2, -2.0], [-.5, -2.45], [0, -2.55], [.5, -2.45], [1.2, -2.0], [2.3, -2.2]]), sw * 1.3, C.border, 'ink', .4);
  paint(B([[-.6, -3.9], [.6, -3.9], [.8, -1.65], [.35, -1.35], [0, -1.5], [-.35, -1.35], [-.8, -1.65]]), { wash: C.pitLt, fill: C.pitDk, fillOp: 40, tex: .5, ink: INK, sw: sw * .65, curv: .4 });   // the front pleat
  for (const k of [-.3, .05, .35]) inkLine(B([[k * .6, -3.7], [k, -1.7]]), sw * .4, C.pitDk, 'inkfine', .3);
  inkLine(B([[-.8, -1.7], [-.35, -1.4], [0, -1.55], [.35, -1.4], [.8, -1.7]]), sw * 1.1, C.border, 'ink', .4);
  }
  paint(B(ribbon([[-2.68, -4.5], [0, -4.3], [2.68, -4.5]], .4, .4)), { wash: C.gold, ink: INK, sw: sw * .5 });
  for (let i = 0; i < 7; i++) { const bx = -2.2 + i * .73, by = -4.0 - Math.abs(bx) * .06 + Math.sin(T * 6 + i) * .03; paint(ellPts(bx * u, (by + up) * u, .16 * u, .16 * u, 7), { wash: C.goldLt, ink: INK, sw: sw * .3 }); }
  // the flute, tucked in the kardhani on his left, a red tassel at its foot
  if (o.flute !== false) {
    rs('flute');
    const f0 = sit ? [1.7, -3.7] : [1.15, -2.7], f1 = sit ? [3.2, -6.9] : [2.85, -6.2];
    paint(B(ribbon([f0, f1], .34, .34)), { wash: C.flute, fill: C.fluteDk, fillOp: 50, tex: .4, ink: INK, sw: sw * .5 });
    for (let k = 1; k <= 4; k++) { const p = [lerp(f0[0], f1[0], .45 + k * .1), lerp(f0[1], f1[1], .45 + k * .1)]; paint(ellPts(p[0] * u, (p[1] + up) * u, .07 * u, .07 * u, 6), { wash: C.fluteDk, ink: null }); }
    paint(B(ribbon([f0, [f0[0] - .15 + Math.sin(T * 2.5) * .1, f0[1] + .7], [f0[0] - .1 + Math.sin(T * 2.5 + .6) * .15, f0[1] + 1.2]], .3, .12)), { wash: C.border, ink: INK, sw: sw * .35 });
  }
  pop();

  // ---------------- sitting legs: toward us, soles out, anklets
  if (sit) {
    rs('legs');
    for (const s of [-1, 1]) {
      const hip = [s * 1.2, -1.1], ft = [s * 2.75, -.5];
      paint(U(ribbon([hip, [s * 2.0, -.8], ft], 1.75, 1.5), u), { wash: s < 0 ? col : lt, fill: dk, fillOp: s < 0 ? 40 : 15, tex: .4, ink: INK, sw: sw * .85, curv: .3 });
      paint(U(ribbon([[s * 2.05, -1.65], [s * 2.35, -.05]], .32, .32), u), { wash: C.gold, ink: INK, sw: sw * .4 });   // the anklet
      for (const k of [-.55, .1, .7]) paint(ellPts((s * 2.2 + k * .2) * u, (-.85 + k) * u, .13 * u, .13 * u, 7), { wash: C.goldLt, ink: INK, sw: sw * .3 });
      const fx = ft[0] + s * .2, fy = ft[1] - .1;
      paint(ellPts(fx * u, fy * u, .88 * u, 1.08 * u, 16, J, s * .15), { wash: C.sole, fill: dk, fillOp: 25, tex: .3, ink: INK, sw: sw * .8 });
      for (let k = 0; k < 4; k++) paint(ellPts((fx - .45 + k * .3) * u, (fy - .92 + Math.abs(k - 1.5) * .09) * u, .17 * u, .19 * u, 8), { wash: C.sole, ink: INK, sw: sw * .4 });
      paint(ellPts(fx * u, (fy + .15) * u, .38 * u, .42 * u, 10), { fill: C.cheek, fillOp: 60, bleed: .2, ink: null });
    }
    // the pitambar's lap, over the thighs
    rs('lap');
    paint(U([[-2.4, -2.0], [2.4, -2.0], [2.6, -1.2], [1.6, -.75], [0, -.95], [-1.6, -.75], [-2.6, -1.2]], u), { wash: C.pit, fill: C.pitDk, fillOp: 45, tex: .5, ink: INK, sw: sw * .7, curv: .4 });
    inkLine(U([[-2.5, -1.15], [-1.6, -.85], [0, -1.05], [1.6, -.85], [2.5, -1.15]], u), sw * 1.2, C.border, 'ink', .4);
  }

  // ---------------- arms (the hands come last, over the held prop)
  const arms = [-1, 1].map(s => {
    const [sh, el, ha] = bkArm(o, s), sk = s < 0 ? col : lt, T3 = p => [p[0], p[1] - up];
    rs('arm' + s);
    paint(B(ribbon([T3(sh), T3(el), T3(ha)], 1.2, 1.0)), { wash: sk, fill: dk, fillOp: s < 0 ? 40 : 15, tex: .4, ink: INK, sw: sw * .8, curv: .3 });
    for (const k of [.24, .36]) paint(B(ribbon([T3([ha[0] + (el[0] - ha[0]) * k, ha[1] + (el[1] - ha[1]) * k]), T3([ha[0] + (el[0] - ha[0]) * (k + .08), ha[1] + (el[1] - ha[1]) * (k + .08)])], 1.12, 1.12)), { wash: C.gold, ink: INK, sw: sw * .4 });   // two bangles
    paint(B(ribbon([T3([sh[0] + (el[0] - sh[0]) * .55, sh[1] + (el[1] - sh[1]) * .55]), T3([sh[0] + (el[0] - sh[0]) * .66, sh[1] + (el[1] - sh[1]) * .66])], 1.25, 1.25)), { wash: C.gold, ink: INK, sw: sw * .4 });   // the armlet
    return { s, el, ha, sk };
  });

  // ---------------- head
  const hl = bkHeadLocal({ ...o, pose: 'stand' }), hy = hl[1] + up;
  push();
  translate(hx * .35 * u, hy * u);
  const shk = o.shake || 0;
  if (o.htilt || shk) { translate(0, 3 * u); rotate((o.htilt || 0) + shk); translate(0, -3 * u); }
  translate(0, 3.2 * u); scale(1.1); translate(0, -3.2 * u);   // a big baby head, grown from the neck
  const Hd = pts => U(pts, u);      // head-local: (0, 0) is the head centre
  const p = clamp(o.puff || 0);
  // back hair: curls round the head and down by the ears
  rs('backhair');
  paint(ellPts(0, -.35 * u, 3.95 * u, 3.75 * u, 26, J), { wash: C.hair, ink: INK, sw: sw * .7 });
  for (const s of [-1, 1]) for (let i = 0; i < 3; i++) {
    const cx = s * (3.45 - i * .1), cy = .3 + i * .85 + Math.sin(T * 1.7 + i + s) * .05;
    paint(ellPts(cx * u, cy * u, .62 * u, .55 * u, 12, J), { wash: C.hair, ink: INK, sw: sw * .55 });
    inkLine(Hd([[cx - s * .25, cy - .15], [cx + s * .1, cy - .25], [cx + s * .2, cy + .05], [cx, cy + .2]]), sw * .4, C.hairLt, 'inkfine', .6);
  }
  rs('ears');
  for (const s of [-1, 1]) {
    paint(ellPts(s * (3.6 + p * .5) * u, .25 * u, .85 * u, 1.0 * u, 16, J), { wash: col, fill: dk, fillOp: 50, tex: .4, ink: INK, sw: sw * .7 });
    const kx = s * (3.7 + p * .5), ky = 1.25, sway = Math.sin(T * 2.3 + s) * .1;   // the kundal: a gold drop with a ruby
    push(); translate(kx * u, ky * u); rotate(sway);
    paint(U([[0, 0], [.45, .55], [.4, 1.05], [0, 1.3], [-.4, 1.05], [-.45, .55]], u), { wash: C.gold, fill: C.goldDk, fillOp: 40, ink: INK, sw: sw * .4, curv: .5 });
    paint(ellPts(0, .78 * u, .2 * u, .22 * u, 8), { wash: C.gem, ink: null });
    pop();
  }
  rs('head');
  const head = [];   // a round baby head, chubby at the cheeks (wider with puff)
  for (let k = 0; k < 24; k++) { const a = k / 24 * TAU, c = Math.cos(a), sn = Math.sin(a), low = Math.max(0, sn); head.push([c * (3.55 + low * (.25 + p * .9)), sn * (sn < 0 ? 3.4 : 3.3)]); }
  paint(Hd(head), { wash: col, fill: dk, fillOp: 30, bleed: .08, tex: .45, border: .4, ink: null, curv: .5 });
  paint(ellPts(-1.2 * u, -1.6 * u, 1.4 * u, .8 * u, 14, J, -.3), { wash: lt, washOp: 80, ink: null });   // light on the forehead
  paint(Hd(head), { ink: INK, sw, curv: .5 });
  if (p > 0) for (const s of [-1, 1]) paint(ellPts(s * (1.8 + p * .55) * u, 1.2 * u, (.75 + p * .55) * u, (.6 + p * .45) * u, 16), { wash: lt, washOp: 90 + 120 * p, ink: null });
  // front hair: a cap of curls with a scalloped fringe, parted for the tilak
  rs('hair');
  const cap = [[-3.75, .35], [-3.9, -1.4], [-3.3, -3.0], [-1.9, -3.9], [0, -4.1], [1.9, -3.9], [3.3, -3.0], [3.9, -1.4], [3.75, .35], [3.3, -.5], [3.05, -1.7],
    [2.6, -2.2], [2.25, -2.75], [1.75, -2.4], [1.3, -2.95], [.85, -2.6], [.45, -3.0], [0, -3.25], [-.45, -3.0], [-.85, -2.6], [-1.3, -2.95], [-1.75, -2.4], [-2.25, -2.75], [-2.6, -2.2], [-3.05, -1.7], [-3.3, -.5]];
  paint(Hd(cap), { wash: C.hair, ink: INK, sw: sw * .75, curv: .35 });
  for (const [a, b] of [[-2.4, -3.2], [-1.0, -3.55], [1.0, -3.55], [2.4, -3.2], [-3.3, -1.6], [3.3, -1.6]]) inkLine(Hd([[a - .3, b + .1], [a, b - .2], [a + .3, b], [a + .1, b + .25]]), sw * .4, C.hairLt, 'inkfine', .6);
  // the topknot with a pearl band, and the feather
  rs('topknot');
  if (o.feather !== false) bkFeather(u, sw, C, o.featherWob ?? T * .55);
  paint(ellPts(0, -4.55 * u, 1.3 * u, 1.0 * u, 16, J), { wash: C.hair, ink: INK, sw: sw * .65 });
  inkLine(Hd([[-.6, -4.8], [-.1, -5.2], [.5, -4.95]]), sw * .4, C.hairLt, 'inkfine', .6);
  paint(Hd(ribbon([[-1.2, -4.0], [0, -3.85], [1.2, -4.0]], .34, .34)), { wash: C.gold, ink: INK, sw: sw * .4 });
  for (let i = 0; i < 5; i++) paint(ellPts((-.9 + i * .45) * u, (-3.93 + Math.abs(i - 2) * .03) * u, .12 * u, .12 * u, 6), { wash: C.pearl, ink: null });
  rs('tilak');   // the Vaishnava tilak: a white U with a red line, in the parting of the fringe
  paint(Hd([[-.4, -3.0], [-.3, -1.85], [0, -1.55], [.3, -1.85], [.4, -3.0], [.2, -3.0], [.14, -2.0], [0, -1.85], [-.14, -2.0], [-.2, -3.0]]), { wash: C.tilak, ink: null, curv: .3 });
  paint(Hd([[-.07, -2.9], [.07, -2.9], [.06, -2.05], [-.06, -2.05]]), { wash: C.tilakRed, ink: null });
  rs('nazar');
  paint(ellPts(-2.55 * u, -1.15 * u, .2 * u, .2 * u, 10), { wash: C.kajal, ink: null });   // the kajal nazar dot

  push(); translate(hx * .5 * u, 0);
  // ---- brows
  rs('brows');
  const ek = Array.isArray(o.eyes) ? o.eyes[0] : o.eyes;
  const bAng = clamp((o.brows ?? 0) - (['angry', 'determined'].includes(ek) ? .8 : 0) + (ek === 'innocent' ? .9 : 0), -1, 1), wy = clamp(o.worry || 0) + (['sad', 'scared'].includes(ek) ? .7 : 0);
  for (const s of [-1, 1]) {
    const lift = Math.max(0, bAng) * .3, inY = -1.82 - lift + Math.min(0, bAng) * -.3 - wy * .3, outY = -1.92 - lift - Math.min(0, bAng) * -.1 + wy * .1;
    paint(Hd(ribbon([[s * .65, inY], [s * 1.25, (inY + outY) / 2 - .16], [s * 1.8, outY]], .15, .07)), { wash: C.hair, ink: null });
  }
  // ---- eyes: big, kajal-lined
  rs('eyes');
  const kinds = Array.isArray(o.eyes) ? o.eyes : o.eyes === 'wink' ? ['normal', 'happy'] : [o.eyes || 'normal', o.eyes || 'normal'];
  const own = k => ['normal', 'look', 'wide', 'happy', 'closed', 'squeeze', 'sad', 'sparkle', 'heart', 'swirl', 'innocent', 'scared'].includes(k);
  if (kinds.every(own)) {
    const lx = (o.lookX || 0) * .22, ly = (o.lookY || 0) * .18;
    const blink = ((T * .9 + (o.seed || 0) * 1.7 + .4) % 3.4) < .11;
    [-1, 1].forEach((s, i) => {
      const k = (o.squint || 0) > .6 ? 'squeeze' : kinds[i], ex = s * 1.25, ey = -.4;
      if (k === 'happy') { inkLine(Hd([[ex - .6, ey + .2], [ex, ey - .42], [ex + .6, ey + .2]]), sw * 1.3, INK, 'ink', .6); inkLine(Hd([[ex + s * .55, ey + .1], [ex + s * .85, ey - .15]]), sw * .55, INK, 'inkfine', 0); return; }
      if (k === 'closed' || (blink && !['heart', 'swirl', 'sparkle', 'innocent'].includes(k))) { inkLine(Hd([[ex - .6, ey], [ex, ey + .38], [ex + .6, ey]]), sw * 1.2, INK, 'ink', .6); inkLine(Hd([[ex + s * .55, ey + .05], [ex + s * .85, ey + .2]]), sw * .55, INK, 'inkfine', 0); return; }
      if (k === 'squeeze') { inkLine(Hd([[ex - s * .5, ey - .4], [ex + s * .35, ey], [ex - s * .5, ey + .35]]), sw * 1.25, INK, 'ink', .2); return; }
      if (k === 'heart') { paint(heartPts(ex * u, (ey + .05) * u, .8 * u * (1 + .1 * Math.sin(T * 9))), { wash: '#E2476E', ink: INK, sw: sw * .6 }); return; }
      if (k === 'swirl') {
        paint(ellPts(ex * u, ey * u, .7 * u, .78 * u, 18), { wash: C.white, ink: INK, sw: sw * .6 });
        const sp = []; for (let j = 0; j < 22; j++) { const a = j * .55 + T * 9 * s, r = .08 + j * .026; sp.push([ex + Math.cos(a) * r, ey + Math.sin(a) * r]); }
        inkLine(Hd(sp), sw * .65, INK, 'inkfine', .5); return;
      }
      const wide = k === 'wide' || k === 'scared', big = k === 'sparkle' || k === 'innocent', rx = wide ? .8 : big ? .8 : .72, ry = wide ? .92 : big ? .9 : .84;
      paint(Hd(ellPts(ex, ey, rx, ry, 18)), { wash: C.white, ink: null });
      const pr = k === 'scared' ? .26 : k === 'wide' ? .34 : k === 'innocent' ? .66 : big ? .6 : .52;
      paint(ellPts((ex + lx) * u, (ey + ly + .06) * u, pr * u, pr * 1.12 * u, 14), { wash: C.eye, ink: null });
      if (k === 'sparkle') {
        const tw = 1 + .18 * Math.sin(T * 14 + s);
        paint(starPts((ex + lx - .08) * u, (ey + ly - .08) * u, .42 * u * tw, .38, 4), { wash: C.white, ink: null });
      } else if (k === 'innocent') {   // two big shines and a wet glint at the bottom: "who, ME?"
        paint(ellPts((ex + lx - .2) * u, (ey + ly - .22) * u, .24 * u, .27 * u, 10), { wash: C.white, ink: null });
        paint(ellPts((ex + lx + .22) * u, (ey + ly + .05) * u, .11 * u, .11 * u, 8), { wash: C.white, ink: null });
        inkLine(Hd([[ex + lx - .35, ey + ly + .5], [ex + lx, ey + ly + .6], [ex + lx + .35, ey + ly + .5]]), sw * .5, C.white, 'inkfine', .5);
      } else {
        paint(ellPts((ex + lx - .16) * u, (ey + ly - .2) * u, .17 * u, .19 * u, 8), { wash: C.white, ink: null });
        paint(ellPts((ex + lx + .16) * u, (ey + ly + .22) * u, .07 * u, .07 * u, 6), { wash: C.white, washOp: 210, ink: null });
      }
      // the kajal-lined upper lid with a little wing, and two lashes
      inkLine(Hd([[ex - rx * 1.05, ey + .05], [ex - rx * .5, ey - ry * .98], [ex + rx * .5, ey - ry * .98], [ex + rx * 1.05, ey + .05]]), sw * 1.3, INK, 'ink', .5);
      inkLine(Hd([[ex + s * rx * .95, ey - ry * .15], [ex + s * rx * 1.25, ey - ry * .4]]), sw * .6, INK, 'inkfine', 0);
      inkLine(Hd([[ex - rx * .7, ey + ry * .78], [ex, ey + ry * .98], [ex + rx * .7, ey + ry * .78]]), sw * .5, C.skinDk, 'inkfine', .5);   // the lower lash line
      if (k === 'sad') inkLine(Hd([[ex - .45, ey + ry * .75], [ex + .45, ey + ry * .75]]), sw * .5, C.skinDk, 'inkfine', .5);
    });
  } else { push(); translate(0, -.2 * u); scale(.46); translate(0, 6 * u); eyes(u, o, sw / .46 * .85, [-1, 1], 0); pop(); }
  // ---- cheeks, nose, mouth
  rs('blush');
  const bl = o.blush ?? .45;
  if (bl) for (const s of [-1, 1]) paint(ellPts(s * (2.1 + p * .5) * u, .95 * u, .62 * u, .36 * u, 14), { fill: C.cheek, fillOp: 160 * clamp(bl), bleed: .2, tex: .4, ink: null });
  rs('nose');
  inkLine(Hd([[-.22, .72], [0, .86], [.22, .72]]), sw * .55, C.skinDk, 'inkfine', .5);
  rs('mouth');
  const m = o.mouth || 'smile', my = 1.75, mk = clamp(o.mouthK ?? 1, 0, 1.4), dark = C.mouth, cos = clamp(o.cosmos || 0);
  if (m === 'smile') inkLine(Hd([[-.75, my - .15], [0, my + .28], [.75, my - .15]]), sw * .9, INK, 'ink', .6);
  else if (m === 'cat') inkLine(Hd([[-.72, my - .05], [-.36, my + .24], [0, my], [.36, my + .24], [.72, my - .05]]), sw * .85, INK, 'ink', .5);
  else if (m === 'grin' || m === 'giggle') {
    const g = m === 'giggle' ? 1 + .12 * Math.sin(T * 30) : 1;
    paint(Hd([[-1.0, my - .25], [1.0, my - .25], [.78, my + .45 * g], [0, my + .75 * g], [-.78, my + .45 * g]]), { wash: dark, ink: INK, sw: sw * .75, curv: .45 });
    paint(Hd([[-.48, my + .42 * g], [.48, my + .42 * g], [0, my + .7 * g]]), { wash: C.tongue, ink: null, curv: .5 });
    paint(Hd([[-.55, my - .22], [.55, my - .22], [.45, my - .02], [-.45, my - .02]]), { wash: C.white, washOp: 230, ink: null });
  } else if (m === 'O') paint(Hd(ellPts(0, my + .2, .36 * mk + .1, .44 * mk + .1, 12)), { wash: dark, ink: INK, sw: sw * .7 });
  else if (m === 'open' || m === 'yawn' || m === 'wail') {
    const w = (m === 'yawn' ? .7 : .75) * (.6 + .5 * mk), d = (m === 'yawn' ? 1.3 : .9) * (.5 + .6 * mk);
    paint(Hd([[-w, my - .2], [w, my - .2], [w * .8, my + d * .6], [0, my + d], [-w * .8, my + d * .6]]), { wash: dark, ink: INK, sw: sw * .75, curv: .5 });
    paint(Hd([[-w * .55, my + d * .65], [w * .55, my + d * .65], [0, my + d * .95]]), { wash: C.tongue, ink: null, curv: .5 });
  } else if (m === 'aam') {   // wide open: "aaaa"; with cosmos the inside is the night sky
    const r = .45 + mk * 1.2, cy = my + .2 + mk * .3;
    paint(ellPts(0, cy * u, r * u, r * .9 * u, 24), { wash: mixCol(dark, C.night, cos), ink: INK, sw: sw * .9 });
    if (cos < .6) paint(ellPts(0, (cy + r * .5) * u, r * .6 * u, r * .3 * u, 14), { wash: C.tongue, washOp: 255 * (1 - cos / .6), ink: null });
    if (cos > 0) {
      rs('cosmos');
      glow(.15 * r * u, (cy - .1 * r) * u, r * 1.1 * u, '#8A6AE8', .5 * cos);
      for (let i = 0; i < 16; i++) {
        const a = hash(i * 2.3) * TAU, rr = Math.sqrt(hash(i * 5.1)) * r * .8, tw = .6 + .4 * Math.sin(T * (3 + hash(i) * 4) + i);
        paint(starPts(Math.cos(a) * rr * u, (cy + Math.sin(a) * rr * .85) * u, (.07 + hash(i * 9.7) * .1) * r * u * tw * 2, .35, 4), { wash: C.star, washOp: 255 * cos, ink: null });
      }
      const sp = []; for (let j = 0; j < 26; j++) { const a = j * .42 + T * .6, rr = .04 * r + j * .018 * r; sp.push([Math.cos(a) * rr * u, (cy + Math.sin(a) * rr * .6) * u]); }
      inkLine(sp, sw * .9, '#C8B8FF', 'inkfine', .6);
      glow(-.45 * r * u, (cy - .35 * r) * u, .35 * r * u, '#FFC24A', .9 * cos);   // a little sun
      paint(ellPts(-.45 * r * u, (cy - .35 * r) * u, .12 * r * u, .12 * r * u, 10), { wash: '#FFD25A', washOp: 255 * cos, ink: null });
      paint(ellPts(.5 * r * u, (cy + .3 * r) * u, .1 * r * u, .1 * r * u, 10), { wash: '#F4F0FF', washOp: 255 * cos, ink: null });   // and the moon
    }
    paint(ellPts(0, (cy - r * .8) * u, r * .45 * u, r * .1 * u, 10), { wash: C.white, washOp: 230, ink: null });   // two milk teeth
  } else if (m === 'puff') paint(ellPts(0, (my + .15) * u, .3 * u, .2 * u, 10), { wash: C.mouth, ink: INK, sw: sw * .7 });
  else if (m === 'chew') {
    const c = Math.sin(T * 14);
    if (c > 0) inkLine(Hd([[-.55, my + .1], [0, my + .25 + c * .1], [.55, my + .1]]), sw * .85, INK, 'ink', .6);
    else paint(ellPts(0, (my + .15) * u, .32 * u, (.12 - c * .1) * u, 10), { wash: dark, ink: INK, sw: sw * .65 });
  } else if (m === 'pout') {
    paint(ellPts(0, (my + .2) * u, .36 * u, .25 * u, 10), { wash: C.cheek, ink: INK, sw: sw * .7 });
    inkLine(Hd([[-.2, my + .2], [.2, my + .2]]), sw * .4, INK, 'inkfine', 0);
  } else if (m === 'frown') inkLine(Hd([[-.7, my + .3], [0, my - .08], [.7, my + .3]]), sw * .85, INK, 'ink', .6);
  else if (m === 'flat') inkLine(Hd([[-.55, my + .1], [.55, my + .1]]), sw * .8, INK, 'ink', 0);
  else { push(); translate(0, my * u); scale(.42); translate(0, 4.3 * u); mouth(u, m, sw / .42 * .8); pop(); }
  if (mud > 0) {   // mud: round the mouth and on his right cheek
    rs('mud');
    if (m !== 'aam') paint(Hd([[-1.25, my - .1], [-.9, my - .35], [-.6, my - .05], [-.2, my + .45], [.4, my + .5], [.85, my + .15], [1.15, my + .3], [.95, my + .75], [.3, my + 1.0], [-.5, my + .95], [-1.1, my + .55]]), { wash: C.mud, washOp: 150 * mud, ink: null, curv: .5 });
    paint(Hd(ribbon([[-2.55, .35], [-2.05, .7], [-1.55, .85]], .38, .16)), { wash: C.mud, washOp: 160 * mud, ink: null });
    for (const [mx, my2] of (m === 'aam' ? [[-2.3, .95]] : [[-.7, my + .7], [.6, my + .62], [-2.3, .95]])) paint(ellPts(mx * u, my2 * u, .1 * u, .1 * u, 7), { wash: C.mudLt, washOp: 220 * mud, ink: null });
  }
  pop();   // face offset
  if (o.hat) { rs('hat'); o.hat(u, sw); }
  pop();   // head

  if (o.held) { rs('held'); o.held(u, sw); }
  for (const A of arms) {
    rs('hand' + A.s);
    const shape = (A.s < 0 ? o.handShapeL : o.handShapeR) || 'open';
    const a = (A.s < 0 ? o.handAL : o.handAR) ?? Math.atan2(A.ha[1] - A.el[1], A.ha[0] - A.el[0]);
    push(); translate(A.ha[0] * u, (A.ha[1]) * u); rotate(a); translate(-.2 * u, 0);
    scale(.95); aaravHandShape(u, sw / .95, shape, A.s, A.sk, dk, INK);
    if (mud > 0 && A.s < 0) paint(ellPts(.8 * u, 0, .55 * u, .4 * u, 10, J), { wash: C.mud, washOp: 190 * mud, ink: null });
    pop();
  }
  pop();

  if (o.emote) {
    rs('emote');
    const h = bkHeadLocal(o), top = EMOTE_TOP.includes(o.emote);
    const [ex, ey] = bkWorld(x, y, u, o, (o.flip ? -1 : 1) * 4.1, h[1] - 3.8);
    emote(o.emote, top ? bkHead(x, y, u, o)[0] : ex, top ? bkWorld(x, y, u, o, 0, h[1] - 6.2)[1] : ey, u * 1.0, o.emoteK ?? 1, o.emoteAge ?? T);
  }
  rs('after');
}

// Model sheet: studio.html?loop=balkrishna, or node render.mjs --loop=balkrishna --sheet=0.5,1.5,2.5,3.5 --cols=4 --w=540
(() => {
  LOOPS.balkrishna = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: '#EDE3D2', ink: null });
    const u = 26, cyc = t % 4;
    // 1 · sitting, muddy, chewing → caught
    balKrishna(270, 640, u, { pose: 'sit', ...emotions(t, [[0, 'happy', { eyes: 'happy', mouth: 'chew' }], [2, 'surprised', { eyes: 'wide', mouth: 'O' }]]), mud: 1, handL: [-2.2, -9.4], handR: [2.4, -5.0], handShapeL: 'hold', boilKey: 'k1' });
    // 2 · standing, "who, ME?": innocent eyes, a hand on his chest, the head shakes no
    balKrishna(800, 640, u, { eyes: 'innocent', mouth: 'pout', shake: Math.sin(t * 12) * .12, handL: [-.6, -7.4], handShapeL: 'open', aR: -1.2, boilKey: 'k2', seed: 2 });
    // 3 · "aaaa": the mouth wide open, the cosmos inside
    balKrishna(270, 1260, u, { pose: 'sit', eyes: 'closed', mouth: 'aam', mouthK: 1.3, cosmos: cyc > 1.5 ? 1 : 0, handL: [-2.6, -5.0], handR: [2.6, -5.0], boilKey: 'k3' });
    // 4 · scared, eyes darting
    balKrishna(800, 1260, u, { eyes: 'scared', mouth: 'wobble', lookX: Math.sin(t * 7), worry: 1, handL: [-1.4, -8.6], handR: [1.4, -8.6], handShapeL: 'fist', handShapeR: 'fist', bendL: -1, bendR: -1, boilKey: 'k4' });
    // 5 · a wink and a giggle
    balKrishna(270, 1850, u * .9, { eyes: 'wink', mouth: 'giggle', handL: [-1.2, -9.6], handShapeL: 'fist', aR: .6, blush: .8, boilKey: 'k5' });
    // 6 · walking, cheeks puffed
    balKrishna(800, 1850, u * .9, { eyes: 'normal', mouth: 'puff', puff: .8, walk: t * 1.6, aL: -.4, aR: -1.4, boilKey: 'k6' });
  };
  LOOPS.balkrishna.len = 4;
})();
