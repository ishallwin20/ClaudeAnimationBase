// cine_asura.js: Arunasura (Aruna, "the red one"), the demon king of the Bhramari story, for the cinematic engine.
// Front view, in colour, lit by figure(). He sits: on his throne (cine_sets.js throne(), drawn in the same units) or
// cross-legged on the ground for his tapas. Units as cine_shiva.js: the feet at (0, 0), up is -y. Seated on the throne
// his hips are at -330 and his face is centred at (0, -655); asuraHead() draws the head at the rest position (0, -815),
// so a close-up is translate, scale(k), translate(0, 815), as for Shiva.
// Deep red-brown skin, a black mane, a black-and-gold helmet crown with two great horns sweeping up, pointed ears, a
// heavy brow, glowing yellow eyes, a curled moustache and short beard, two tusks; gold pauldrons and collar, a wide
// gold belt, a dark violet dhoti with a gold border.
//
// arunasura(c, o): o (all optional):
//   t, light (1 | -1), pose: 'throne' | 'tapas' (cross-legged on the ground)
//   arms: 'rest' (hands on the throne's arms) | 'namaste' | 'knees' (on the knees, for tapas) | 'up' (flailing, under
//     the swarm) | 'point' (the right hand up, pointing at a bee on his left armrest)
//   expr: 'calm' | 'smirk' | 'laugh' | 'scream' | 'chant' (eyes shut, mouth round) | 'shock'; look ([x, y])
//   eyes (0..1 the glow of the eyes), lean (radians: the head tilts back to laugh), armFx (figure() options per arm)
// asuraHead(c, o): the head alone at (0, -815): expr, eyes, look, t, light; crownOnly (just the horned helmet, e.g. fallen).
const ARU = {
  skin: '#7C3529', skinSh: '#5A2219', skinDk: '#3B140F', lip: '#3E1410', mouth: '#1A0606', tongue: '#A3343A',
  hair: '#0E0A0C', hairLt: '#2A1E22', eye: '#FFD23A', eyeHot: '#FFF2A0', brow: '#0E0808', tusk: '#E8DCC0', tuskSh: '#A8987A',
  horn: '#D8C9A6', hornSh: '#8E7E60', helm: '#16121A', helmLt: '#3A3044', gold: '#C8912E', goldSh: '#7E5718', goldLt: '#F2C866',
  ruby: '#C81E2A', dhoti: '#2C1838', dhotiSh: '#170C1E', border: '#C8912E',
};
// mouths per expression: [open 0..1, width, corner lift, shape]
const ARU_EXPR = {
  calm: { open: 0, cw: 1, lift: -2, brow: 1, eyes: .8 }, smirk: { open: .1, cw: 1.05, lift: 4, brow: .6, eyes: .7, smirk: true },
  laugh: { open: .9, cw: 1.3, lift: 6, brow: .2, eyes: .45 }, scream: { open: 1, cw: 1.15, lift: -4, brow: 1.3, eyes: 1, tall: true },
  chant: { open: .35, cw: .55, lift: 0, brow: -.2, eyes: 0 }, shock: { open: .6, cw: .75, lift: -2, brow: -.6, eyes: 1, tall: true },
};
const AR_FACE = 'M 0 -736 C 22 -736 40 -744 52 -758 C 62 -772 66 -794 66 -818 C 66 -848 60 -870 48 -884 C 34 -898 -34 -898 -48 -884 C -60 -870 -66 -848 -66 -818 C -66 -794 -62 -772 -52 -758 C -40 -744 -22 -736 0 -736 Z';
// the mane behind the head, wild, spilling onto the shoulders (head units)
function asuraMane(c, t) {
  const S = ARU;
  for (let i = 0; i < 9; i++) {
    const s = i % 2 ? 1 : -1, k = Math.floor(i / 2), y0 = -880 + k * 34, ph = t * 1.4 + i;
    limb(c, [[s * 40, y0], [s * (80 + k * 10), y0 + 30 + Math.sin(ph) * 4], [s * (104 + k * 10), y0 + 90 + Math.sin(ph + 1) * 6], [s * (112 + k * 8), y0 + 150]], [40, 40, 28, 4], i % 3 ? S.hair : S.hairLt, false);
  }
}
// the helmet crown alone: a black cap with a gold band and a ruby, and the two horns (head units)
function asuraCrown(c, L = 1) {
  const S = ARU;
  for (const s of [-1, 1]) {
    const P = [[s * 52, -884], [s * 120, -912], [s * 168, -980], [s * 176, -1060], [s * 150, -1118]];
    limb(c, P, [40, 34, 26, 16, 3], S.horn, false);
    limb(c, P.map(([x, y]) => [x + s * 6, y + 4]), [16, 14, 10, 6, 1], rgba(S.hornSh, .7), false);
    for (let k = 1; k < 7; k++) { const C = through(P), q = C[Math.floor(k / 7 * (C.length - 1))]; ellipse(c, q[0], q[1], 14 - k * 1.5, 3, rgba(S.hornSh, .6), s * (.6 - k * .15)); }
  }
  const HELM = 'M -64 -860 C -70 -908 -40 -940 0 -944 C 40 -940 70 -908 64 -860 C 40 -876 -40 -876 -64 -860 Z';
  fillPath(c, HELM, S.helm);
  inside(c, HELM, () => { strokePath(c, 'M -40 -930 C -20 -940 20 -940 40 -930', rgba(S.helmLt, .9), 3); c.save(); c.scale(L, 1); fillPath(c, 'M -80 -950 L -30 -950 L -40 -860 L -80 -860 Z', rgba('#000', .3)); c.restore(); });
  fillPath(c, 'M -66 -856 C -40 -874 40 -874 66 -856 L 66 -870 C 40 -888 -40 -888 -66 -870 Z', S.gold);
  fillPath(c, 'M 0 -900 L 16 -872 L 0 -852 L -16 -872 Z', S.gold); ellipse(c, 0, -873, 6, 8, S.ruby);
  for (const s of [-1, 1]) for (let k = 1; k <= 3; k++) fillPath(c, `M ${s * k * 16} -870 L ${s * (k * 16 + 5)} -892 L ${s * (k * 16 + 10)} -868 Z`, S.goldSh);
}
function asuraHead(c, o = {}) {
  const t = o.t || 0, L = o.light ?? 1, S = ARU, E = ARU_EXPR[o.expr || 'calm'] || ARU_EXPR.calm, eg = o.eyes ?? 1;
  if (o.crownOnly) { asuraCrown(c, L); return; }
  const shake = o.expr === 'laugh' ? Math.sin(t * 22) * 1.6 : o.expr === 'scream' ? Math.sin(t * 31) * 1.2 : 0;
  c.save(); c.translate(0, shake);
  if (o.mane !== false) asuraMane(c, t);
  // the neck, thick
  const NECK = 'M -46 -690 C -44 -716 -46 -742 -52 -780 L 52 -780 C 46 -742 44 -716 46 -690 Z';
  fillPath(c, NECK, S.skin);
  inside(c, NECK, () => { c.save(); c.scale(L, 1); fillPath(c, 'M -60 -800 L -24 -800 C -22 -760 -24 -720 -28 -690 L -60 -690 Z', rgba(S.skinSh, .9)); c.restore(); fillPath(c, 'M -60 -790 C -40 -756 40 -756 60 -790 L 60 -760 C 40 -730 -40 -730 -60 -760 Z', rgba(S.skinDk, .7)); });
  // pointed ears with gold hoops
  for (const s of [-1, 1]) {
    fillPath(c, `M ${s * 62} -842 C ${s * 82} -858 ${s * 98} -880 ${s * 104} -900 C ${s * 96} -872 ${s * 88} -830 ${s * 64} -800 Z`, s === -L ? S.skinSh : S.skin);
    c.strokeStyle = S.gold; c.lineWidth = 4; c.beginPath(); c.arc(s * 72, -800, 11, 0, TAU); c.stroke();
  }
  // the face
  fillPath(c, AR_FACE, S.skin);
  inside(c, AR_FACE, () => {
    c.save(); c.scale(L, 1);
    fillPath(c, 'M -80 -900 L -40 -886 C -48 -862 -48 -836 -46 -816 C -44 -796 -40 -778 -32 -764 C -24 -752 -14 -742 -4 -736 L -80 -730 Z', S.skinSh);
    fillPath(c, 'M -3 -838 C -7 -820 -12 -806 -16 -796 C -10 -790 -4 -790 0 -792 Z', S.skinSh);
    c.restore();
    for (const s of [-1, 1]) fillPath(c, `M ${s * 8} -850 C ${s * 24} -858 ${s * 44} -856 ${s * 58} -846 L ${s * 58} -834 C ${s * 44} -842 ${s * 24} -844 ${s * 8} -836 Z`, rgba(S.skinDk, .55));   // the brow ridge's shade
    for (const s of [-1, 1]) strokePath(c, `M ${s * 30} -790 C ${s * 40} -780 ${s * 46} -768 ${s * 48} -756`, rgba(S.skinDk, .55), 2.6);   // the folds by the mouth
  });
  // eyes: yellow, glowing, under a heavy angry brow
  for (const s of [-1, 1]) {
    const ex = s * 25, ey = -826, op = E.eyes, lw = 14;
    if (op > .05) {
      const up = lerp(1, -6, op), shape = `M ${ex - lw} ${ey + 1 + (s > 0 ? -2 : 2) * 0} Q ${ex} ${ey + up * 1.3} ${ex + lw} ${ey - 1} Q ${ex} ${ey + 6} ${ex - lw} ${ey + 1} Z`;
      fillPath(c, shape, mixCol('#5A3A10', S.eye, eg));
      inside(c, shape, () => { const lx = (o.look ? o.look[0] : 0) * 4, ly = (o.look ? o.look[1] : 0) * 2; ellipse(c, ex + lx, ey + .5 + ly, 3.6, 5.6, '#1A0A02'); ellipse(c, ex + lx + 1.4, ey - 1.6 + ly, 1.2, 1.2, S.eyeHot); });
      glow(c, ex, ey, 30, S.eye, .5 * eg * op);
      strokePath(c, `M ${ex - lw - 1} ${ey + 1.5} Q ${ex} ${ey + up * 1.3} ${ex + lw + 1} ${ey - .5}`, S.brow, 3);
    } else strokePath(c, `M ${ex - lw} ${ey} Q ${ex} ${ey + 5} ${ex + lw} ${ey}`, S.brow, 3);
    // the brow: thick, slanting down to the nose when angry (brow > 0), up in shock (< 0)
    const b = E.brow, inY = -840 + b * 7, outY = -848 - b * 3;
    fillPath(c, `M ${s * 6} ${inY} C ${s * 18} ${inY - 8} ${s * 36} ${outY - 6} ${s * 50} ${outY} L ${s * 48} ${outY + 7} C ${s * 34} ${outY + 2} ${s * 18} ${inY + 1} ${s * 7} ${inY + 7} Z`, S.brow);
  }
  // the nose: broad, flared nostrils
  fillPath(c, 'M -16 -796 C -20 -786 -14 -780 -6 -782 C -3 -778 3 -778 6 -782 C 14 -780 20 -786 16 -796 C 10 -790 -10 -790 -16 -796 Z', S.skinDk);
  // the mouth (an open one drops the jaw: more chin under it)
  if (E.open > .05) { const j = E.open * (E.tall ? 54 : 32) * .75; fillPath(c, `M -40 -760 C -36 ${-744 + j} -20 ${-734 + j} 0 ${-734 + j} C 20 ${-734 + j} 36 ${-744 + j} 40 -760 Z`, S.skin); }
  const ow = 24 * E.cw, op = E.open, my = -766 + op * 5, oh = op * (E.tall ? 54 : 32);
  if (op > .05) {
    const M = E.tall ? `M ${-ow * .7} ${my} C ${-ow * .8} ${my + oh * .9} ${ow * .8} ${my + oh * .9} ${ow * .7} ${my} C ${ow * .5} ${my - 6} ${-ow * .5} ${my - 6} ${-ow * .7} ${my} Z`
      : `M ${-ow} ${my - E.lift * .5} C ${-ow * .6} ${my + oh} ${ow * .6} ${my + oh} ${ow} ${my - E.lift * .5} C ${ow * .5} ${my - 4} ${-ow * .5} ${my - 4} ${-ow} ${my - E.lift * .5} Z`;
    fillPath(c, M, S.mouth);
    inside(c, M, () => { fillPath(c, `M ${-ow} ${my - 8} L ${ow} ${my - 8} L ${ow} ${my + 4} L ${-ow} ${my + 4} Z`, '#E8DCC8'); for (let i = -3; i <= 3; i++) strokePath(c, `M ${i * ow / 4} ${my - 8} L ${i * ow / 4} ${my + 4}`, rgba('#8A7A66', .7), 1); ellipse(c, 0, my + oh * .85, ow * .5, oh * .3, S.tongue); });
    strokePath(c, M, S.lip, 2.4);
  } else {
    const cy = my, l = E.lift, sm = E.smirk ? 6 : 0;
    strokePath(c, `M ${-ow} ${cy - l * .6} C ${-ow * .4} ${cy + 3} ${ow * .4} ${cy + 3} ${ow} ${cy - l * .6 - sm}`, S.lip, 3.2);
  }
  // tusks rising from the corners of the lower lip
  for (const s of [-1, 1]) { const tx = s * (ow * .8 + 2), ty = my + (op > .05 ? oh * .7 : 4); fillPath(c, `M ${tx - 4.5} ${ty} C ${tx - 4} ${ty - 10} ${tx - s * 1} ${ty - 18} ${tx + s * 2} ${ty - 22} C ${tx + s * 3} ${ty - 14} ${tx + 4.5} ${ty - 6} ${tx + 4.5} ${ty} Z`, S.tusk); }
  // the moustache, curled up at the ends, and a short pointed beard
  for (const s of [-1, 1]) fillPath(c, `M ${s * 3} -784 C ${s * 16} -788 ${s * 34} -786 ${s * 46} -778 C ${s * 58} -770 ${s * 66} -782 ${s * 64} -796 C ${s * 72} -782 ${s * 66} -762 ${s * 50} -764 C ${s * 36} -766 ${s * 18} -776 ${s * 3} -774 Z`, S.hair);
  { const j = op > .05 ? oh * .75 : 0; fillPath(c, `M -34 ${-744 + j * .5} C -24 ${-734 + j} 24 ${-734 + j} 34 ${-744 + j * .5} C 30 ${-722 + j} 14 ${-704 + j} 0 ${-696 + j} C -14 ${-704 + j} -30 ${-722 + j} -34 ${-744 + j * .5} Z`, S.hair); }
  asuraCrown(c, L);
  c.restore();
}
// one arm from shoulder S through elbow E to the wrist T; hand 'fist' | 'grip' (on an armrest) | 'open' (claws) | 'point'
function asuraArm(c, S0, E, T, hand, o = {}) {
  const S = ARU, L = o.light ?? 1, s = Math.sign(T[0] - S0[0]) || 1;
  ellipse(c, S0[0], S0[1], 44, 52, S.skin, s * -.2);
  limb(c, [S0, [(S0[0] + E[0]) / 2, (S0[1] + E[1]) / 2], E], [82, 74, 62], S.skin);
  limb(c, [E, [(E[0] + T[0]) / 2, (E[1] + T[1]) / 2], T], [62, 56, 46], S.skin);
  if (Math.sign(S0[0]) === -L) limb(c, [[S0[0] - s * 10, S0[1]], E, T], [34, 28, 20], rgba(S.skinSh, .85));
  ellipse(c, (S0[0] + E[0]) / 2, (S0[1] + E[1]) / 2, 40, 9, S.gold, Math.atan2(E[1] - S0[1], E[0] - S0[0]) + Math.PI / 2);   // armlet
  const wa = Math.atan2(T[1] - E[1], T[0] - E[0]);
  c.save(); c.translate(T[0], T[1]); c.rotate(wa);
  fillPath(c, 'M -14 -26 L 6 -28 L 6 28 L -14 26 Z', S.gold);                                                   // the bracer
  if (hand === 'open') { fillPath(c, 'M 4 -26 C 30 -30 44 -18 46 0 C 44 18 30 30 4 26 Z', S.skin); for (let i = 0; i < 4; i++) { const y = -21 + i * 14; limb(c, [[40, y], [62, y * 1.3], [74, y * 1.5 + 6]], [13, 10, 6], S.skin); fillPath(c, `M ${72} ${y * 1.5 + 2} L ${86} ${y * 1.5 + 10} L ${72} ${y * 1.5 + 10} Z`, S.tusk); } }
  else if (hand === 'point') { fillPath(c, 'M 4 -26 C 30 -30 46 -16 46 0 C 46 18 30 30 4 26 Z', S.skin); limb(c, [[40, -16], [70, -22], [92, -24]], [14, 12, 10], S.skin); fillPath(c, 'M 90 -30 L 104 -24 L 90 -18 Z', S.tusk); }
  else { fillPath(c, 'M 4 -28 C 34 -32 50 -16 50 2 C 50 20 34 32 4 28 Z', S.skin); for (let i = 0; i < 3; i++) strokePath(c, `M 30 ${-14 + i * 13} L 48 ${-14 + i * 13}`, S.skinSh, 2.4); }
  c.restore();
}
function arunasura(c, o = {}) {
  const t = o.t || 0, L = o.light ?? 1, S = ARU, pose = o.pose || 'throne', arms = o.arms || (pose === 'tapas' ? 'knees' : 'rest');
  const br = Math.sin(t * 1.3) * 1.5, dy = pose === 'tapas' ? 220 : 0;   // tapas sits on the ground: the body 220 lower
  // ---- legs ----
  if (pose === 'throne') {
    for (const s of [-1, 1]) {
      const SHIN = `M ${s * 96} -300 C ${s * 92} -220 ${s * 96} -120 ${s * 100} -46 L ${s * 160} -46 C ${s * 168} -120 ${s * 176} -220 ${s * 178} -300 Z`;
      fillPath(c, SHIN, s === -L ? S.skinSh : S.skin);
      inside(c, SHIN, () => { const inner = `M ${s * 90} -300 L ${s * 118} -300 C ${s * 112} -200 ${s * 114} -120 ${s * 118} -40 L ${s * 90} -40 Z`; if (s === L) fillPath(c, inner, rgba(S.skinSh, .6)); });
      fillPath(c, `M ${s * 96} -48 C ${s * 90} -24 ${s * 84} -8 ${s * 90} 0 L ${s * 180} 0 C ${s * 186} -12 ${s * 174} -22 ${s * 164} -30 L ${s * 160} -48 Z`, S.skin);
      fillPath(c, `M ${s * 94} -60 L ${s * 164} -60 L ${s * 166} -44 L ${s * 94} -44 Z`, S.gold);   // anklets
      for (let i = 0; i < 4; i++) ellipse(c, s * (104 + i * 18), 0, 7, 4, rgba(S.skinDk, .6));
    }
    // the dhoti over the thighs and knees, falling between the shins
    const DH = 'M -150 -420 C -170 -380 -196 -330 -200 -290 C -190 -260 -170 -250 -150 -256 C -120 -230 -60 -150 0 -130 C 60 -150 120 -230 150 -256 C 170 -250 190 -260 200 -290 C 196 -330 170 -380 150 -420 Z';
    fillPath(c, DH, S.dhoti);
    inside(c, DH, () => {
      for (let i = -3; i <= 3; i++) strokePath(c, `M ${i * 12} -400 C ${i * 14} -300 ${i * 12} -200 ${i * 6} -130`, rgba(S.dhotiSh, .9), 3);
      for (const s of [-1, 1]) strokePath(c, `M ${s * 60} -360 C ${s * 110} -330 ${s * 160} -300 ${s * 196} -290`, rgba(S.dhotiSh, .9), 3);
      c.save(); c.scale(L, 1); fillPath(c, 'M -220 -430 L -90 -430 C -100 -330 -130 -260 -150 -240 L -220 -240 Z', rgba(S.dhotiSh, .55)); c.restore();
      strokePath(c, 'M -200 -290 C -190 -260 -170 -250 -150 -256 C -120 -230 -60 -150 0 -130 C 60 -150 120 -230 150 -256 C 170 -250 190 -260 200 -290', S.border, 8);
    });
  } else {
    // cross-legged: the knees out wide, the shins crossed in front, the soles turned up on the thighs; the dhoti over the lap
    for (const s of [-1, 1]) {
      limb(c, [[s * 60, -110], [s * 170, -80], [s * 250, -36]], [96, 88, 76], S.dhoti);
      limb(c, [[s * 240, -30], [s * 120, -14], [-s * 60, -40]], [64, 58, 50], s === -L ? S.skinSh : S.skin);   // the shin, crossing over
      fillPath(c, `M ${-s * 40} -64 C ${-s * 80} -80 ${-s * 130} -76 ${-s * 150} -60 C ${-s * 130} -44 ${-s * 80} -42 ${-s * 40} -48 Z`, S.skin);   // a sole on the far thigh
      ellipse(c, s * 226, -32, 14, 30, S.gold, s * .4);
    }
    fillPath(c, 'M -110 -170 C -60 -190 60 -190 110 -170 L 120 -90 C 60 -70 -60 -70 -120 -90 Z', S.dhoti);
    strokePath(c, 'M -120 -90 C -60 -70 60 -70 120 -90', S.border, 8);
  }
  c.save(); c.translate(0, dy);
  c.save(); c.translate(0, 160); asuraMane(c, t); c.restore();
  // ---- torso ----
  const TORSO = `M -84 -400 C -96 -450 -128 -500 -150 -530 C -160 -544 -168 -552 -178 -556 C -130 -586 -70 ${-592 + br} -36 -596 L 36 -596 C 70 ${-592 + br} 130 -586 178 -556 C 168 -552 160 -544 150 -530 C 128 -500 96 -450 84 -400 Z`;
  fillPath(c, TORSO, S.skin);
  inside(c, TORSO, () => {
    c.save(); c.scale(L, 1); fillPath(c, 'M -190 -560 C -150 -540 -110 -500 -96 -450 C -90 -430 -88 -410 -86 -390 L -200 -390 Z', S.skinSh); c.restore();
    for (const s of [-1, 1]) { strokePath(c, `M ${s * 140} ${-520 + br} C ${s * 100} ${-488 + br} ${s * 50} ${-484 + br} ${s * 8} ${-500 + br}`, S.skinDk, 5); ellipse(c, s * 70, -508 + br, 40, 18, rgba(S.skinSh, .25)); }
    strokePath(c, `M 0 ${-560 + br} L 0 -500`, rgba(S.skinDk, .7), 3);
    for (const y of [-470, -440, -412]) for (const s of [-1, 1]) strokePath(c, `M ${s * 6} ${y} q ${s * 18} -3 ${s * 34} 2`, rgba(S.skinDk, .6), 3);
  });
  // the belt
  fillPath(c, 'M -92 -420 Q 0 -404 92 -420 L 96 -388 Q 0 -372 -96 -388 Z', S.gold);
  strokePath(c, 'M -92 -416 Q 0 -400 92 -416', S.goldSh, 2.4); strokePath(c, 'M -95 -392 Q 0 -376 95 -392', S.goldSh, 2.4);
  ellipse(c, 0, -398, 22, 18, S.goldSh); ellipse(c, 0, -398, 15, 12, S.gold); for (const s of [-1, 1]) ellipse(c, s * 6, -401, 3, 3, S.ruby);
  // the head (seated: 160 below its rest position), tilted by lean
  c.save(); c.translate(0, 160); c.translate(0, -700); c.rotate(o.lean || 0); c.translate(0, 700); asuraHead(c, { ...o, mane: false }); c.restore();
  // the collar: a broad gold torque with fangs hanging from it
  fillPath(c, `M -84 -592 C -60 -560 60 -560 84 -592 L 92 -576 C 64 -538 -64 -538 -92 -576 Z`, S.gold);
  for (let k = -4; k <= 4; k++) { const x = k * 18, y = -552 + Math.abs(k) * -3.5; fillPath(c, `M ${x - 4} ${y} L ${x} ${y + 18} L ${x + 4} ${y} Z`, S.tusk); }
  // pauldrons: layered gold plates with spikes
  for (const s of [-1, 1]) {
    c.save(); c.translate(s * 168, -560);
    for (let k = 0; k < 3; k++) { const r = 64 - k * 12; fillPath(c, `M ${-s * 30} ${-24 + k * 18} C ${s * 10} ${-50 + k * 16} ${s * 70} ${-40 + k * 18} ${s * (r + 10)} ${10 + k * 14} C ${s * 50} ${4 + k * 16} ${0} ${4 + k * 16} ${-s * 30} ${8 + k * 18} Z`, k % 2 ? S.goldSh : S.gold); }
    for (let k = 0; k < 3; k++) fillPath(c, `M ${s * (10 + k * 22)} ${-38 + k * 6} L ${s * (22 + k * 24)} ${-74 + k * 8} L ${s * (32 + k * 22)} ${-32 + k * 8} Z`, S.helm);
    c.restore();
  }
  // ---- arms ----
  const SH = [[-170, -540], [170, -540]];
  const arm = (i, E, T, hand) => figure(c, (a) => asuraArm(a, SH[i], E, T, hand, o), o.armFx || {});
  const A = {
    rest: [[[-250, -450], [-300, -450], 'grip'], [[250, -450], [300, -450], 'grip']],
    namaste: [[[-200, -420], [-30, -500], 'fist'], [[200, -420], [30, -500], 'fist']],
    knees: [[[-240, -400], [-236, -300], 'fist'], [[240, -400], [236, -300], 'fist']],
    up: [[[-280, -680], [-250 + Math.sin(t * 9) * 20, -840], 'open'], [[280, -660], [270 + Math.sin(t * 8 + 1) * 20, -830], 'open']],
    point: [[[-250, -450], [-300, -450], 'grip'], [[260, -520], [330, -560], 'point']],
  }[arms] || [];
  A.forEach(([E, T, hand], i) => arm(i, E, T, hand));
  if (arms === 'namaste') { fillPath(c, 'M -30 -540 C -20 -560 20 -560 30 -540 L 30 -470 C 20 -456 -20 -456 -30 -470 Z', S.skin); strokePath(c, 'M 0 -556 L 0 -462', S.skinDk, 2); }
  c.restore();
}
