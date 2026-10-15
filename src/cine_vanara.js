// cine_vanara.js: the vanaras for the cinematic engine (cine.js), first drawn as Angad, Vali's son, Ram's envoy to Lanka.
// Front view, in colour, lit by figure(). Same units as cine_shiva.js: the feet at (0, 0), up is -y, the face centred
// at about (0, -815). A noble vanara, not a cartoon monkey: a heroic human body covered in short golden-brown fur
// (a paler chest), a pale tan face mask round the eyes and a full muzzle, a broad flat nose, a heavy brow, amber eyes,
// a ruff of darker fur round the face, round ears, a long tail curling up on screen right; a gold yuvraj crown, a red
// tilak, a gold hara, a red uttariya across the chest, a saffron dhoti to the knees, gold armlets and anklets.
//
// vanara(c, o): the whole figure. o (all optional):
//   t, light (1 lit from screen right, -1 from the left), pal (colours over VN's: Sugriva, Vali, a colour Hanuman)
//   pose: 'stand' | 'walk' (a step cycle, o.step 0..1) | 'plant' (feet wide, one foot stamped: o.press 0..1 sinks
//     the body a little) | 'strike' (a deep crouch, both fists on the ground) | 'bow' (namaste, the head lowered)
//   arms: 'hips' | 'fold' (crossed on the chest) | 'down' | 'namaste' | 'fists' (to the ground, for 'strike');
//     each pose has a default
//   expr: 'calm' | 'smirk' | 'fierce' | 'laugh' | 'tears'; look ([x, y] irises), eyes (0..1 overrides how open)
//   tail (true), armFx: figure() options for each arm (its own edge light)
// vanaraHead(c, o): the head alone at its rest position (0, -815), with the neck: expr, look, eyes, t, light, pal.
//   A close-up: translate to the face, scale(k), translate(0, 815).
// vanaraFoot(c, o): the foot, close, side view with the toes to screen right, the sole on y = 0, the heel at about
//   x -110, the toes reaching x 280, the shin up to the dhoti hem at -600. o: t, press (0..1 the stamp: the toes
//   grip and dust rings out), lift (0..1 the foot rises off the ground, heel first), pal.
// vanaraKneel(c, o): a vanara kneeling in side view facing screen right, hands joined, head bowed, the tail curled
//   behind: a silhouette (o.col) about 640 tall. o: t, bow (0..1 how low the head goes).
const VN = {
  fur: '#A86A2E', furSh: '#7A4A1E', furDk: '#4E2E12', furLt: '#D39C58', chest: '#C9955E',
  face: '#E2B88A', faceSh: '#B98B60', muzzle: '#EBCBA4', nose: '#3A2216', sole: '#6E4A33', ear: '#C9906A',
  lip: '#6A3A26', mouth: '#2A0E0A', teeth: '#EFE6D4', tongue: '#A8443E', eyeW: '#F2E6CC', iris: '#9A6414', irisDk: '#3A2208', kohl: '#1A0E08',
  gold: '#D9A441', goldSh: '#93692A', goldLt: '#F6D58A', ruby: '#B3202C', emerald: '#1F7A5A', pearl: '#F3EBD8',
  dhoti: '#E0901E', dhotiSh: '#A8620E', sash: '#9E1E24', sashSh: '#6A1218', tilak: '#C8202A', ash: '#F3EBD8',
};
let VN_CUR = VN;
function vnWithPal(o, draw) { const prev = VN_CUR; VN_CUR = { ...VN, ...o.pal }; try { return draw({ ...o, pal: null }); } finally { VN_CUR = prev; } }

// per expression: eyes (open 0..1+, or 'happy'), brow (-1 angry .. +1 anguish), mouth, open
const VN_EXPR = {
  calm: { eyes: 1, brow: -.15, mouth: 'shut' },
  smirk: { eyes: .72, brow: -.55, mouth: 'smirk' },
  fierce: { eyes: 1.15, brow: -1, mouth: 'roar', open: .7 },
  laugh: { eyes: 'happy', brow: -.1, mouth: 'laugh', open: .8 },
  tears: { eyes: .62, brow: 1, mouth: 'sad' },
};

// ---------- the head ----------
function vanaraHead(c, o = {}) {
  if (o.pal) return vnWithPal(o, (q) => vanaraHead(c, q));
  const S = VN_CUR, t = o.t || 0, L = o.light ?? 1, E = VN_EXPR[o.expr || 'calm'], m = o.open ?? E.open ?? 0;
  const jaw = E.mouth === 'roar' ? m * 16 : E.mouth === 'laugh' ? m * 12 : 0;
  // the neck
  const NECK = 'M -40 -690 C -38 -724 -40 -752 -44 -780 L 44 -780 C 40 -752 38 -724 40 -690 Z';
  fillPath(c, NECK, S.fur);
  inside(c, NECK, () => { c.save(); c.scale(L, 1); fillPath(c, 'M -48 -790 L -24 -790 C -22 -750 -24 -720 -28 -690 L -48 -690 Z', rgba(S.furSh, .9)); c.restore();
    fillPath(c, 'M -52 -790 C -36 -752 -14 -742 0 -742 C 14 -742 36 -752 52 -790 L 52 -756 C 30 -730 -30 -730 -52 -756 Z', rgba(S.furDk, .6)); });
  // the ruff: darker fur round the face, in tufts, longest at the cheeks
  c.fillStyle = S.furDk; c.beginPath();
  for (let i = 0; i <= 36; i++) {
    const a = -Math.PI / 2 + i / 36 * TAU, cheek = Math.max(0, Math.cos(a)) ** 2 * 0 + Math.abs(Math.cos(a)) * Math.max(0, Math.sin(a) + .3) * 22;
    const r = (i % 2 ? 72 : 86) + cheek + (i % 2 ? 0 : Math.sin(t * 2 + i) * 1.2), rx = r * 1.02, ry = r * 1.06;
    c.lineTo(Math.cos(a) * rx, -812 + Math.sin(a) * ry);
  }
  c.closePath(); c.fill();
  // ears: round, set at the sides
  for (const s of [-1, 1]) {
    fillPath(c, `M ${s * 58} -846 C ${s * 82} -858 ${s * 92} -828 ${s * 86} -806 C ${s * 82} -792 ${s * 70} -788 ${s * 60} -794 Z`, s === -L ? S.furSh : S.fur);
    fillPath(c, `M ${s * 64} -836 C ${s * 78} -842 ${s * 82} -824 ${s * 78} -810 C ${s * 74} -802 ${s * 68} -802 ${s * 64} -806 Z`, S.ear);
    const sw = Math.sin(t * 1.3 + s);
    c.strokeStyle = S.gold; c.lineWidth = 4; c.beginPath(); c.arc(s * 78 + sw, -786, 9, 0, TAU); c.stroke();
  }
  // the head: fur over the skull and cheeks
  const HEAD = `M 0 ${-736 + jaw} C 30 ${-736 + jaw} 52 -752 60 -782 C 66 -806 66 -836 60 -856 C 52 -884 30 -900 0 -902 C -30 -900 -52 -884 -60 -856 C -66 -836 -66 -806 -60 -782 C -52 -752 -30 ${-736 + jaw} 0 ${-736 + jaw} Z`;
  fillPath(c, HEAD, S.fur);
  inside(c, HEAD, () => { c.save(); c.scale(L, 1); fillPath(c, 'M -80 -910 L -44 -900 C -58 -860 -60 -820 -54 -790 C -48 -766 -36 -748 -20 -738 L -80 -720 Z', rgba(S.furSh, .85)); c.restore(); });
  // the face mask: pale round the eyes, down over a full muzzle
  const MASK = `M 0 -866 C 26 -868 48 -854 50 -830 C 52 -812 46 -802 42 -794 C 50 -780 46 ${-756 + jaw} 24 ${-746 + jaw} C 12 ${-742 + jaw} -12 ${-742 + jaw} -24 ${-746 + jaw} C -46 ${-756 + jaw} -50 -780 -42 -794 C -46 -802 -52 -812 -50 -830 C -48 -854 -26 -868 0 -866 Z`;
  fillPath(c, MASK, S.face);
  inside(c, MASK, () => {
    c.save(); c.scale(L, 1);
    fillPath(c, 'M -60 -870 L -34 -864 C -44 -840 -44 -816 -38 -800 C -34 -786 -36 -770 -28 -750 L -60 -740 Z', rgba(S.faceSh, .8));
    c.restore();
    // the muzzle: a fuller, paler mound under the nose, shaded beneath
    ellipse(c, 0, -774 + jaw * .4, 38, 28 + jaw * .4, S.muzzle);
    fillPath(c, `M -40 ${-760 + jaw} C -20 ${-748 + jaw} 20 ${-748 + jaw} 40 ${-760 + jaw} L 40 ${-736 + jaw} L -40 ${-736 + jaw} Z`, rgba(S.faceSh, .55));
    for (const s of [-1, 1]) ellipse(c, s * 20, -828, 16, 9, rgba(S.faceSh, .35));   // the sockets
  });
  // the widow's peak of fur down the forehead, and the tilak on it
  fillPath(c, 'M -54 -872 C -30 -884 30 -884 54 -872 L 52 -852 C 34 -858 14 -852 0 -838 C -14 -852 -34 -858 -52 -852 Z', S.fur);
  strokePath(c, 'M -9 -870 C -9 -856 -5 -850 0 -846 C 5 -850 9 -856 9 -870', S.ash, 3);
  strokePath(c, 'M 0 -868 L 0 -850', S.tilak, 3.4);
  // eyes: amber, under a heavy brow
  const op0 = o.eyes ?? E.eyes;
  for (const s of [-1, 1]) {
    const ex = s * 21, ey = -824, lw = 12.5;
    if (op0 === 'happy') {
      strokePath(c, `M ${ex - lw} ${ey + 2} Q ${ex} ${ey - 8} ${ex + lw} ${ey + 2}`, S.kohl, 3.2);
      strokePath(c, `M ${ex - lw * .8} ${ey + 7} Q ${ex} ${ey + 3} ${ex + lw * .8} ${ey + 7}`, rgba(S.faceSh, .9), 1.6);
    } else {
      const op = op0, up = lerp(4, -8, Math.min(op, 1)) - Math.max(0, op - 1) * 12, lo = 6 + Math.max(0, op - 1) * 10;
      const shape = `M ${ex - lw} ${ey + 1} Q ${ex - 2 * s} ${ey + up * 1.25} ${ex + lw} ${ey - 1} Q ${ex} ${ey + lo} ${ex - lw} ${ey + 1} Z`;
      if (op > .04) {
        fillPath(c, shape, S.eyeW);
        inside(c, shape, () => {
          const lx = (o.look ? o.look[0] : 0) * 4, ly = (o.look ? o.look[1] : 0) * 2, ir = op > 1 ? 4.6 : 5.8;
          ellipse(c, ex + lx, ey + .5 + ly, ir, ir * 1.08, S.iris); ellipse(c, ex + lx, ey + .5 + ly, ir * .46, ir * .5, S.irisDk);
          ellipse(c, ex + lx + 1.6, ey - 1.4 + ly, 1.3, 1.3, '#FFF8EC');
          ellipse(c, ex, ey + up * .9, lw + 2, 5, rgba(S.faceSh, .55));
        });
      }
      strokePath(c, `M ${ex - lw - 1} ${ey + 1.5} Q ${ex - 2 * s} ${ey + up * 1.25} ${ex + lw + 1} ${ey - .5}`, S.kohl, 3);
      if (op > .04) strokePath(c, `M ${ex - lw + 2} ${ey + 2} Q ${ex} ${ey + lo + 1} ${ex + lw - 2} ${ey + 1}`, rgba(S.kohl, .6), 1.3);
      if (op < .3) for (let i = 0; i < 4; i++) { const u = (i + 1) / 5, x = lerp(ex - lw, ex + lw, u), y = ey + 1.5 + (up * 1.25 - 1) * 2 * u * (1 - u) * 1.2; strokePath(c, `M ${x} ${y} l ${(u - .5) * 2} 2.6`, S.kohl, 1.1); }
      if (E.mouth === 'sad') {   // tears: a wet line and a drop sliding down the muzzle
        strokePath(c, `M ${ex - lw + 3} ${ey + 4} Q ${ex} ${ey + lo + 2} ${ex + lw - 3} ${ey + 3}`, rgba('#DDEBFF', .8), 1.6);
        const k = frac(t * .45 + (s > 0 ? .5 : 0)), dy = k * 46;
        ellipse(c, ex + s * 4, ey + 9 + dy, 2.4, 3.4, rgba('#E6F0FF', .85 * (1 - k)));
        strokePath(c, `M ${ex + s * 4} ${ey + 8} L ${ex + s * 4} ${ey + 8 + dy}`, rgba('#DDEBFF', .35 * (1 - k)), 1.6);
      }
    }
    // the brow ridge: a heavy fur line; angry = inner ends down, anguish = inner ends up
    const b = E.brow, iy = -836 + b * -7 + (op0 === 'happy' ? -3 : 0), oy = -841 + b * 4;
    limb(c, [[s * 5, iy], [s * 21, (iy + oy) / 2 - 5 + Math.abs(b) * 2], [s * 40, oy]], [9, 8.5, 4], S.furDk);
  }
  // the nose: broad and flat, two nostrils
  fillPath(c, 'M -15 -796 C -16 -806 -8 -812 0 -812 C 8 -812 16 -806 15 -796 C 10 -790 -10 -790 -15 -796 Z', S.nose);
  for (const s of [-1, 1]) ellipse(c, s * 6.5, -797, 3.6, 2.4, '#140804', s * .3);
  strokePath(c, 'M -5 -808 C -2 -810 2 -810 5 -808', rgba('#8A6450', .7), 1.6);
  strokePath(c, 'M 0 -790 L 0 -778', rgba(S.faceSh, .9), 2);   // the philtrum
  // the mouth: wide across the muzzle
  const U = -770 + jaw * .3;
  if (E.mouth === 'shut' || E.mouth === 'smirk' || E.mouth === 'sad') {
    const k = E.mouth === 'smirk' ? 1 : 0, d = E.mouth === 'sad' ? -1 : 0;
    strokePath(c, `M -24 ${U - d * 3} C -10 ${U + 3 + d * 2} 10 ${U + 3 + d * 2 - k * 2} ${24 + k * 2} ${U - k * 7 - d * 3}`, S.lip, 2.6);
    fillPath(c, `M -12 ${U + 4} C -4 ${U + 9} 4 ${U + 9} 12 ${U + 4 - k} C 4 ${U + 6} -4 ${U + 6} -12 ${U + 4} Z`, rgba(S.faceSh, .8));
  } else {
    const D = E.mouth === 'roar' ? U + 10 + m * 26 : U + 8 + m * 20, w = E.mouth === 'laugh' ? 24 + m * 4 : 20 + m * 3;
    const MO = `M ${-w} ${U} C ${-w * .5} ${U - 3} ${w * .5} ${U - 3} ${w} ${U} C ${w * .95} ${(U + D) / 2 + 3} ${w * .55} ${D} 0 ${D} C ${-w * .55} ${D} ${-w * .95} ${(U + D) / 2 + 3} ${-w} ${U} Z`;
    fillPath(c, MO, S.mouth);
    inside(c, MO, () => {
      fillPath(c, `M ${-w} ${U - 4} L ${w} ${U - 4} L ${w} ${U + 4.5} L ${-w} ${U + 4.5} Z`, S.teeth);
      if (E.mouth === 'roar') for (const s of [-1, 1]) { fillPath(c, `M ${s * (w - 9)} ${U} L ${s * (w - 4)} ${U} L ${s * (w - 6.5)} ${U + 11} Z`, S.teeth); fillPath(c, `M ${s * (w - 9)} ${D} L ${s * (w - 4)} ${D} L ${s * (w - 6.5)} ${D - 9} Z`, S.teeth); }
      ellipse(c, 0, D + 2, w * .66, (D - U) * .3, S.tongue);
    });
    strokePath(c, MO, S.lip, 1.6);
  }
  // the crown: a gold yuvraj kirita, three peaks, fur tufts at its sides
  for (const s of [-1, 1]) for (let i = 0; i < 3; i++) fillPath(c, `M ${s * (44 + i * 6)} ${-876 + i * 4} L ${s * (66 + i * 6)} ${-884 + i * 10} L ${s * (50 + i * 6)} ${-862 + i * 6} Z`, S.furDk);
  const KIR = 'M -52 -878 L -50 -930 L -32 -912 L -18 -960 L 0 -1000 L 18 -960 L 32 -912 L 50 -930 L 52 -878 Z';
  fillPath(c, KIR, S.gold);
  c.save(); c.scale(L, 1); inside(c, KIR, () => fillPath(c, 'M -80 -1010 L -6 -1010 L -12 -870 L -80 -870 Z', rgba(S.goldSh, .7))); c.restore();
  strokePath(c, 'M -18 -958 L 0 -996 L 18 -958', rgba(S.goldLt, .7), 2);
  ellipse(c, 0, -940, 6, 8, S.ruby); glow(c, 0, -940, 18, '#FF6A5A', .3);
  for (const x of [-34, 34]) ellipse(c, x, -906, 3.4, 4.2, S.emerald);
  const BAND = 'M -56 -872 C -36 -884 36 -884 56 -872 L 54 -896 C 34 -906 -34 -906 -54 -896 Z';
  fillPath(c, BAND, S.goldSh); strokePath(c, 'M -54 -886 C -36 -894 36 -894 54 -886', S.goldLt, 2.2);
  for (let i = -4; i <= 4; i++) ellipse(c, i * 11.5, -888 - (4 - Math.abs(i)) * .5, 2.4, 2.4, i % 2 ? S.ruby : S.goldLt);
}

// ---------- arms, legs, the tail ----------
// one arm, shoulder S, elbow E, wrist T; hand 'fist' | 'palm' (flat on the ground) | 'none'
function vnArm(c, S0, E, T, o = {}) {
  const S = VN_CUR, k = o.k ?? 1, col = o.col || S.fur;
  limb(c, [S0, [lerp(S0[0], E[0], .5), lerp(S0[1], E[1], .5)], E], [60 * k, 52 * k, 40 * k], col);
  limb(c, [E, [lerp(E[0], T[0], .5), lerp(E[1], T[1], .5)], T], [42 * k, 38 * k, 28 * k], col);
  if (o.shade) limb(c, [[S0[0] + o.shade[0], S0[1] + o.shade[1]], [E[0] + o.shade[0], E[1] + o.shade[1]], [T[0] + o.shade[0] * .7, T[1] + o.shade[1] * .7]], [22 * k, 16 * k, 10 * k], rgba(S.furSh, .7));
  // a few hair strokes down the forearm
  for (let i = 0; i < 3; i++) { const u = .3 + i * .2, x = lerp(E[0], T[0], u), y = lerp(E[1], T[1], u); strokePath(c, `M ${x - 6} ${y - 4} l 6 8 l 6 -8`, rgba(S.furDk, .35), 1.6); }
  const a = Math.atan2(T[1] - E[1], T[0] - E[0]);
  ellipse(c, lerp(S0[0], E[0], .6), lerp(S0[1], E[1], .6), 27 * k, 8 * k, S.gold, Math.atan2(E[1] - S0[1], E[0] - S0[0]) + Math.PI / 2);   // armlet
  ellipse(c, lerp(E[0], T[0], .86), lerp(E[1], T[1], .86), 17 * k, 7 * k, S.gold, a + Math.PI / 2);   // bracelet
  const hx = T[0] + Math.cos(a) * 15 * k, hy = T[1] + Math.sin(a) * 15 * k;
  if (o.hand === 'palm') { for (let f = -1.5; f <= 1.5; f++) limb(c, [[hx + f * 9 * k, hy], [hx + f * 11 * k, hy + 18 * k]], [9 * k, 7 * k], col); ellipse(c, hx, hy, 24 * k, 14 * k, col); }
  else if (o.hand !== 'none') { ellipse(c, hx, hy, 23 * k, 26 * k, col, a); strokePath(c, `M ${hx + Math.cos(a + 1.3) * 13 * k} ${hy + Math.sin(a + 1.3) * 13 * k} L ${hx + Math.cos(a + 1.9) * 11 * k} ${hy + Math.sin(a + 1.9) * 11 * k}`, rgba(S.furDk, .6), 2 * k); }
}
// the tail from the hip, out to screen right and curling up; o.wave sways it
function vnTail(c, t, wave = 1, x0 = 40, y0 = -470) {
  const S = VN_CUR, w = Math.sin(t * 1.6) * 10 * wave, w2 = Math.sin(t * 1.6 - .8) * 14 * wave;
  const P = [[x0, y0], [x0 + 110, y0 + 30], [x0 + 230, y0 - 10 + w * .3], [x0 + 290, y0 - 140 + w], [x0 + 268, y0 - 270 + w2], [x0 + 206, y0 - 316 + w2], [x0 + 170, y0 - 280 + w2]];
  limb(c, P, [34, 30, 26, 22, 18, 15, 12], S.fur);
  limb(c, P.map(([x, y]) => [x + 4, y + 6]), [14, 12, 10, 9, 8, 6, 4], rgba(S.furSh, .55), false);
  ellipse(c, P[6][0], P[6][1], 16, 14, S.furDk);   // the tuft at the tip
}

// ---------- the whole figure ----------
function vanara(c, o = {}) {
  if (o.pal) return vnWithPal(o, (q) => vanara(c, q));
  const t = o.t || 0, L = o.light ?? 1, S = VN_CUR, pose = o.pose || 'stand', br = Math.sin(t * 1.4) * 1.5;
  const arms = o.arms || { stand: 'hips', walk: 'down', plant: 'fold', strike: 'fists', bow: 'namaste' }[pose];
  const press = o.press || 0, D = pose === 'strike' ? 300 : pose === 'plant' ? 24 + press * 16 : pose === 'bow' ? 10 : 0;
  const st = pose === 'walk' ? (o.step ?? frac(t * 1.1)) : 0, bob = pose === 'walk' ? Math.abs(Math.sin(st * TAU)) * -10 : 0;
  if (o.tail !== false) vnTail(c, t, 1, 40, -470 + D);
  // legs: hip, knee, ankle per side
  for (const s of [-1, 1]) {
    let hip = [s * 60, -470 + D + bob], knee, ank;
    if (pose === 'strike') { knee = [s * 280, -210]; ank = [s * 250, -42]; }
    else if (pose === 'plant') { knee = [s * 130, -250 + D * .4]; ank = [s * 168, -42]; }
    else if (pose === 'walk') { const up = Math.max(0, Math.sin((st + (s > 0 ? .5 : 0)) * TAU)) * 40; knee = [s * 82, -252 - up * .6 + bob]; ank = [s * 74, -42 - up]; }
    else { knee = [s * 84, -252]; ank = [s * 76, -42]; }
    limb(c, [hip, knee], [118, 94], S.fur);
    limb(c, [knee, [lerp(knee[0], ank[0], .5), lerp(knee[1], ank[1], .5)], ank], [88, 70, 50], S.fur);
    if (s === -L) limb(c, [[knee[0] + s * 14, knee[1]], [lerp(knee[0], ank[0], .5) + s * 12, lerp(knee[1], ank[1], .5)], [ank[0] + s * 8, ank[1]]], [36, 28, 18], rgba(S.furSh, .9));
    for (let i = 0; i < 3; i++) { const u = .25 + i * .22, x = lerp(knee[0], ank[0], u), y = lerp(knee[1], ank[1], u); strokePath(c, `M ${x - 7} ${y - 4} l 7 8 l 7 -8`, rgba(S.furDk, .3), 1.6); }
    // a long vanara foot, toes splayed, the big toe set apart
    const fx = ank[0], fy = ank[1] + 42;
    fillPath(c, `M ${fx - 30} ${fy - 48} C ${fx - 36} ${fy - 20} ${fx - 32} ${fy - 6} ${fx - 26} ${fy} L ${fx + s * 66 + 10} ${fy} C ${fx + s * 72} ${fy - 14} ${fx + s * 44} ${fy - 26} ${fx + 24} ${fy - 48} Z`, S.fur);
    for (let i = 0; i < 4; i++) ellipse(c, fx + s * (8 + i * 16), fy - 4, 9, 6, i === 0 ? S.furSh : mixCol(S.fur, S.furSh, .3));
    ellipse(c, fx - s * 28, fy - 6, 10, 7, mixCol(S.fur, S.furSh, .3), -s * .5);   // the big toe, apart
    ellipse(c, fx, fy - 54, 30, 8, S.gold); ellipse(c, fx, fy - 60, 27, 3, S.goldSh);
    // the dhoti over the thigh, to the knee
    limb(c, [[s * 48, -480 + D + bob], [lerp(s * 48, knee[0], .55), lerp(-480 + D + bob, knee[1], .55)], [knee[0] * 1.02, knee[1] + 22]], [150, 132, 104], S.dhoti, false);
    limb(c, [[knee[0] * .92, knee[1] + 14], [knee[0] * 1.03, knee[1] + 26]], [100, 94], S.gold, false);
  }
  // the front pleats, the gold belt
  const PL = `M -48 ${-488 + D + bob} L 48 ${-488 + D + bob} L 40 ${-230 + D * .5} L -40 ${-230 + D * .5} Z`;
  fillPath(c, PL, S.dhoti);
  inside(c, PL, () => { for (let i = -2; i <= 2; i++) strokePath(c, `M ${i * 15} ${-480 + D} L ${i * 13} ${-226 + D * .5}`, rgba(S.dhotiSh, .9), 4); fillPath(c, `M -60 ${-254 + D * .5} L 60 ${-254 + D * .5} L 60 ${-226 + D * .5} L -60 ${-226 + D * .5} Z`, S.gold); });
  c.save(); c.translate(0, D + br * .3 + bob);
  // torso: athletic, short fur, a paler chest
  const TORSO = `M -90 -478 C -98 -540 -118 -600 -130 -644 C -138 -670 -146 -690 -158 -702 C -120 -722 -68 ${-726 + br} -28 -732 L 28 -732 C 68 ${-726 + br} 120 -722 158 -702 C 146 -690 138 -670 130 -644 C 118 -600 98 -540 90 -478 Z`;
  fillPath(c, TORSO, S.fur);
  inside(c, TORSO, () => {
    fillPath(c, 'M -84 -690 C -60 -706 60 -706 84 -690 C 92 -620 70 -540 46 -478 L -46 -478 C -70 -540 -92 -620 -84 -690 Z', S.chest);
    c.save(); if (L < 0) c.scale(-1, 1);
    fillPath(c, 'M -90 -478 C -98 -540 -118 -600 -130 -644 C -138 -670 -146 -690 -166 -702 L -156 -702 C -120 -690 -90 -660 -80 -620 C -70 -580 -72 -520 -66 -478 Z', S.furSh);
    c.restore();
    for (const s of [-1, 1]) strokePath(c, `M ${s * 118} -630 C ${s * 90} -604 ${s * 44} -600 ${s * 6} -614`, rgba(S.furSh, .9), 4);
    for (const [y, w] of [[-570, 28], [-534, 26]]) for (const s of [-1, 1]) strokePath(c, `M ${s * 6} ${y} q ${s * w / 2} -3 ${s * w} 2`, rgba(S.furSh, .6), 2.4);
    strokePath(c, 'M 0 -590 L 0 -505', rgba(S.furSh, .45), 2);
    for (let i = 0; i < 14; i++) { const x = (hash(i * 3.1) - .5) * 220, y = -700 + hash(i * 7.7) * 200; strokePath(c, `M ${x - 6} ${y - 4} l 6 8 l 6 -8`, rgba(S.furDk, .22), 1.5); }
  });
  // the red uttariya across the chest, from the left shoulder to the right hip
  limb(c, [[-128, -708], [-40, -630], [50, -540], [104, -486]], [40, 36, 34, 30], S.sash, false);
  limb(c, [[-120, -700], [-40, -626], [50, -536]], [10, 9, 8], rgba(S.sashSh, .8), false);
  fillPath(c, 'M -94 -500 Q 0 -486 94 -500 L 92 -470 Q 0 -458 -92 -470 Z', S.gold);   // the belt
  for (let i = -3; i <= 3; i++) ellipse(c, i * 24, -484 + Math.abs(i) * .8, 4.6, 5.6, i % 2 ? S.ruby : S.emerald);
  // the hara: two strands of gold and a pearl strand, a ruby pendant
  for (const [y0, dy, n, r, col] of [[-722, 62, 15, 4.6, S.gold], [-718, 96, 19, 4, S.pearl]]) for (let i = 0; i <= n; i++) {
    const u = i / n, x = lerp(-62 - dy * .2, 62 + dy * .2, u), y = y0 + Math.pow(Math.sin(u * Math.PI), .8) * dy;
    ellipse(c, x, y, r, r, col);
  }
  fillPath(c, 'M -12 -620 L 12 -620 L 0 -596 Z', S.gold); ellipse(c, 0, -614, 7, 8, S.ruby);
  // the head (a bow lowers it and tips it forward)
  c.save(); if (pose === 'bow') { c.translate(0, 26); c.translate(0, -760); c.scale(1, .97); c.translate(0, 760); }
  vanaraHead(c, { t, light: L, expr: o.expr, look: o.look || (pose === 'bow' ? [0, 1] : null), eyes: o.eyes ?? (pose === 'bow' ? .15 : undefined), open: o.open });
  c.restore();
  // the arms
  const SH = [[-170, -690 + br], [170, -690 + br]];
  const arm = (s, E, T, hand, k = 1.1) => figure(c, (a) => {
    ellipse(a, s * 166, -680 + br, 40, 48, S.fur, s * -.2);   // the deltoid
    vnArm(a, SH[s > 0 ? 1 : 0], E, T, { k, hand, shade: s === -L ? [s * 10, 4] : null });
  }, o.armFx || {});
  if (arms === 'hips') for (const s of [-1, 1]) arm(s, [s * 286, -566], [s * 128, -492], 'fist');
  else if (arms === 'down') for (const s of [-1, 1]) arm(s, [s * 214, -540], [s * 222, -404], 'fist');
  else if (arms === 'fists') for (const s of [-1, 1]) arm(s, [s * 214, -530], [s * 150, -70 - D], 'fist', 1.14);
  else if (arms === 'namaste') {
    for (const s of [-1, 1]) arm(s, [s * 196, -556], [s * 16, -640], 'none');
    fillPath(c, 'M -18 -700 C -24 -680 -26 -650 -18 -626 L 18 -626 C 26 -650 24 -680 18 -700 C 10 -712 -10 -712 -18 -700 Z', S.fur);
    strokePath(c, 'M 0 -706 L 0 -628', rgba(S.furDk, .7), 2);
  } else if (arms === 'fold') {
    // crossed on the chest: the far forearm under, the near one over, each fist tucked under the other's bicep
    const far = L > 0 ? -1 : 1;
    for (const s of [far, -far]) figure(c, (a) => {
      ellipse(a, s * 166, -680 + br, 40, 48, S.fur, s * -.2);
      const Sp = SH[s > 0 ? 1 : 0], E = [s * 176, -548], T = [-s * 108, s === far ? -614 : -590];
      vnArm(a, Sp, E, T, { k: 1.12, hand: 'none', shade: s === -L ? [s * 8, 4] : null });
      ellipse(a, T[0] - s * 10, T[1] - 4, 22, 24, S.fur);
    }, o.armFx || {});
  }
  c.restore();
}

// ---------- the foot, close ----------
function vanaraFoot(c, o = {}) {
  if (o.pal) return vnWithPal(o, (q) => vanaraFoot(c, q));
  const S = VN_CUR, t = o.t || 0, p = o.press || 0, lift = o.lift || 0;
  c.save(); c.translate(-110, 0); c.rotate(-lift * .2); c.translate(110, -lift * 230 + p * 4);
  // the shin, furred, up to the dhoti
  const SHIN = 'M -70 -640 C -90 -520 -78 -380 -56 -170 L 58 -170 C 62 -320 70 -480 74 -640 Z';
  fillPath(c, SHIN, S.fur);
  inside(c, SHIN, () => {
    fillPath(c, 'M -100 -660 L -24 -660 C -20 -480 -20 -320 -22 -150 L -100 -150 Z', rgba(S.furSh, .9));
    for (let i = 0; i < 16; i++) { const x = -50 + hash(i * 1.7) * 100, y = -600 + hash(i * 4.3) * 420; strokePath(c, `M ${x - 7} ${y - 5} l 7 10 l 7 -10`, rgba(S.furDk, .35), 2); }
  });
  // tufts of fur at the ankle
  for (let i = 0; i < 9; i++) { const x = -60 + i * 15, y = -178 + Math.abs(i - 4) * 2; fillPath(c, `M ${x - 9} ${y - 10} L ${x + 2} ${y + 16 + (i % 2) * 6} L ${x + 9} ${y - 10} Z`, i % 2 ? S.fur : S.furSh); }
  // the foot: long, the sole dark, the top furred
  const FOOT = 'M -56 -188 L 58 -188 C 62 -150 80 -118 118 -98 C 140 -88 160 -80 176 -72 C 192 -62 198 -46 194 -30 C 190 -10 178 0 160 2 L -60 2 C -98 2 -112 -22 -108 -60 C -104 -104 -78 -150 -56 -188 Z';
  fillPath(c, FOOT, S.fur);
  inside(c, FOOT, () => {
    fillPath(c, 'M -130 -30 C -40 -14 120 -14 300 -16 L 300 20 L -130 20 Z', S.sole);
    fillPath(c, 'M -130 -46 C -40 -34 120 -34 300 -34 L 300 -16 C 120 -14 -40 -14 -130 -30 Z', rgba(S.furSh, .9));
    ellipse(c, -74, -70, 22, 34, rgba(S.furSh, .3));
    for (let i = 0; i < 8; i++) { const x = -20 + i * 26, y = -150 + i * 12; strokePath(c, `M ${x - 7} ${y - 4} l 7 9 l 7 -9`, rgba(S.furDk, .3), 1.8); }
  });
  // the toes: four long, knuckled ones gripping the floor; they curl in as he stamps
  const g = p * .22;
  for (const [x, y, len, wd] of [[146, -70, 80, 28], [162, -54, 88, 30], [174, -38, 92, 31], [182, -22, 94, 32]]) {
    const drop = -8 - y + g * 6, L2 = len * (1 - g * .25);
    c.save(); c.translate(x, y);
    const P = [[0, 0], [L2 * .55, drop * .2 - 4], [L2, drop]];
    limb(c, P.map(([a, b]) => [a, b + 1.5]), [wd + 4, wd + 2, wd - 3], rgba(S.furDk, .9));
    limb(c, P, [wd, wd - 2, wd - 6], S.fur);
    strokePath(c, `M ${L2 * .5} ${drop * .2 - 4 - wd * .45} l 2 ${wd * .5}`, rgba(S.furDk, .45), 2);   // the knuckle
    ellipse(c, L2 + 3, drop + 2, wd * .36, wd * .26, S.sole);   // the nail pad on the floor
    c.restore();
  }
  // the anklet: a heavy gold band with bells
  ellipse(c, 0, -178, 64, 14, S.gold); ellipse(c, 0, -184, 60, 5, S.goldSh); strokePath(c, 'M -58 -174 C -20 -168 20 -168 58 -174', rgba(S.goldLt, .8), 2.4);
  for (let i = 0; i < 8; i++) ellipse(c, -50 + i * 14.3, -162 + Math.abs(i - 3.5) * 1.4, 6, 7, S.gold);
  // the saffron dhoti's hem with its gold border at the top
  const HEM = 'M -110 -760 L 118 -760 C 130 -700 140 -650 150 -606 C 90 -590 40 -604 0 -596 C -50 -606 -100 -592 -146 -608 C -136 -650 -124 -700 -110 -760 Z';
  fillPath(c, HEM, S.dhoti);
  inside(c, HEM, () => { for (let i = -3; i <= 3; i++) strokePath(c, `M ${i * 30} -720 L ${i * 32} -606`, rgba(S.dhotiSh, .8), 4); fillPath(c, 'M -160 -632 C -100 -618 -50 -630 0 -622 C 40 -630 90 -616 160 -632 L 160 -580 L -160 -580 Z', S.gold); });
  c.restore();
}

// ---------- kneeling (a silhouette) ----------
// On his knees facing screen right, the torso tipping forward with o.bow (0: upright, hands joined; 1: bowed to the
// ground, the hands forward, as at a lord's feet). The knee at (0, 0); the hands land near (300, 0) at bow 1.
function vanaraKneel(c, o = {}) {
  const col = o.col || '#120A08', t = o.t || 0, bw = clamp(o.bow ?? 1), w = Math.sin(t * 1.4) * 5;
  const hip = [-50, -230], th = lerp(.2, 1.2, easeIO(bw)), sh = [hip[0] + Math.sin(th) * 290, hip[1] - Math.cos(th) * 290];
  limb(c, [hip, [-170, -250], [-250, -340 + w], [-240, -450 + w], [-180, -480 + w], [-156, -440 + w]], [30, 26, 22, 18, 14, 11], col);   // the tail
  ellipse(c, -156, -442 + w, 15, 13, col);
  limb(c, [[-180, -18], [-90, -20], [0, -26]], [44, 56, 64], col);   // the shin on the ground
  fillPath(c, 'M -230 0 C -232 -30 -210 -44 -176 -44 L -150 0 Z', col);   // the foot behind
  limb(c, [[0, -30], [-20, -130], hip], [80, 100, 116], col);   // the thigh
  fillPath(c, `M ${hip[0] - 70} ${hip[1] + 40} C ${hip[0] - 60} ${hip[1] - 20} ${hip[0] + 60} ${hip[1] - 20} ${hip[0] + 80} ${hip[1] + 50} L ${hip[0]} ${hip[1] + 120} Z`, col);   // the dhoti
  limb(c, [hip, [lerp(hip[0], sh[0], .5), lerp(hip[1], sh[1], .5) - 10], sh], [120, 112, 116], col);   // the torso
  // the arms: hands joined at the chest, reaching down to the ground as he bows
  const hd = [lerp(sh[0] + 80, sh[0] + 120, bw), lerp(sh[1] + 60, -12, bw)], el = [lerp(sh[0] + 40, sh[0] + 30, bw), lerp(sh[1] + 120, sh[1] + 140, bw)];
  limb(c, [sh, el, hd], [52, 40, 32], col); ellipse(c, hd[0] + 10, hd[1] - 4, 26, 18, col);
  // the head, tipped down with the torso: the muzzle forward, the ear, the crown
  c.save(); c.translate(sh[0] + Math.sin(th) * 70, sh[1] - Math.cos(th) * 70); c.rotate(th - .1);
  ellipse(c, 0, -10, 50, 56, col);
  fillPath(c, 'M 28 -20 C 60 -16 74 4 68 26 C 56 40 30 40 14 30 Z', col);   // the muzzle, toward his chest
  ellipse(c, -44, -10, 16, 20, col);   // the ear
  fillPath(c, 'M -36 -56 L -32 -110 L -12 -88 L 0 -134 L 12 -88 L 32 -110 L 36 -56 Z', col);   // the crown
  c.restore();
}
