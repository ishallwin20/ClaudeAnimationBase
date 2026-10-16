// cine_ravana.js: Ravana, Dashanan, for the cinematic engine (cine.js). Front view, in colour, lit by figure().
// Same units as cine_shiva.js: the feet stand at (0, 0), up is -y; the centre head's face spans -742..-892 (its centre
// about (0, -815), as Shiva's), the tall mukut's tip is about -1050. He is broader than Shiva and lords it: deep bronze
// skin, a black moustache curled up at the ends, kohl, Shiva's tripundra in ash on every forehead (he was Shiva's
// devotee), gold kundals, a crimson dhoti with a gold border, layered gold, and a black high collar behind the heads.
// TEN heads in a shallow arc that drops toward the ends: the centre one (index 4) in a tall gold mukut, four to screen
// left and five to screen right in smaller crowns, smaller and lower the further out (as the Painted Ravana has them).
// TWENTY arms: the front pair plus nine on each side behind, fanned like a peacock's tail (with weapons) or raised.
//
// ravana(c, o): the whole figure. o (all optional):
//   t (seconds), light (1 lit from screen right, -1 from the left), pose: 'stand' | 'lift' | 'pinned' | 'bow' | 'sit'
//     ('sit': on a throne, the seat at -300 as for goldThrone() in cine_sets.js, the hips at -330, everything above
//     140 lower than standing, so the centre face is at about (0, -675))
//   expr: the face on every head: 'calm' | 'smirk' | 'laugh' | 'scream' | 'sing' | 'grit'; or exprs: [10] per head
//   reach (0..1, 'lift': how high the hands are), weapons (true: the back hands of 'stand' hold swords, maces, a bow…)
//   front ('hips' | 'down' | 'namaste' | 'up' | 'rest' (hands on the throne's arms) | 'grab' (both hands reaching
//   down in front, to seize something at his feet)), crowns (false: bare heads, the crowns fallen; or [10] per head),
//   armFx / headFx: figure() options for each front arm / each head, so
//   they get their own edge light (costly: use them for colour shots, not silhouettes)
// ravanaHeads(c, o): the row of heads and the collar alone, for a close-up (same units and options).
// rvHead(c, o): one head at its rest position (centre (0, -815)): expr, crown ('mukut' | 'crown'), open (0..1 the
//   mouth), t, light, look ([x, y] irises), neck (true). Scale a close-up like Shiva's: translate, scale(k), translate(0, 815).
//   crown: false draws the bare head.
// rvCrown(c, o): one crown alone, its band centred at (0, 0), about 120 wide: kind ('mukut' | 'crown'), light. For the
//   crowns falling and flying.
const RV = {
  skin: '#9C6A48', skinSh: '#76492F', skinDk: '#4F2E1D', palm: '#B88262', lip: '#5E3024', lipLo: '#7E4434',
  eyeW: '#EDE3D2', iris: '#3A160C', kohl: '#140B0B', hair: '#120C10', hairLt: '#2E2128', ash: '#EFE8DA',
  gold: '#D9A441', goldSh: '#93692A', goldLt: '#F6D58A', ruby: '#B3202C', emerald: '#1F7A5A',
  dhoti: '#7C1526', dhotiSh: '#4E0C18', black: '#1A1216', blackLt: '#3A2A30', mouth: '#2A0C0A', teeth: '#EDE4D2', tongue: '#A33C36',
  steel: '#C3CAD3', steelSh: '#7E8794', wood: '#5A3420',
};

// ---------- one head ----------
const RV_FACE = (j) => `M 0 ${-742 + j} C 16 ${-742 + j} 28 ${-748 + j * .6} 37 -758 C 47 -770 52 -786 54 -802 C 56 -816 56.5 -830 55.5 -844 C 54 -864 48 -878 38 -886 C 26 -895 -26 -895 -38 -886 C -48 -878 -54 -864 -55.5 -844 C -56.5 -830 -56 -816 -54 -802 C -52 -786 -47 -770 -37 -758 C -28 ${-748 + j * .6} -16 ${-742 + j} 0 ${-742 + j} Z`;
// per expression: eyes (open 0..1, or 'happy' squint), brow (-1 angry .. +1 anguish), the mouth's shape and how open
const RV_EXPR = {
  calm: { eyes: 1, brow: -.3, mouth: 'shut' },
  smirk: { eyes: .8, brow: -.7, mouth: 'smirk' },
  laugh: { eyes: 'happy', brow: -.2, mouth: 'laugh', open: .85 },
  scream: { eyes: 1.25, brow: 1, mouth: 'scream', open: 1 },
  sing: { eyes: 0, brow: .5, mouth: 'sing', open: .55 },
  grit: { eyes: .45, brow: -1, mouth: 'grit', open: .35 },
};
function rvHead(c, o = {}) {
  const S = RV, t = o.t || 0, L = o.light ?? 1, E = RV_EXPR[o.expr || 'calm'], m = o.open ?? E.open ?? 0;
  const jaw = E.mouth === 'scream' ? m * 20 : E.mouth === 'laugh' ? m * 12 : E.mouth === 'sing' ? m * 8 : 0, FACE = RV_FACE(jaw);
  // hair behind: thick black curls to the shoulders
  fillPath(c, 'M -60 -860 C -74 -810 -76 -764 -68 -728 C -44 -716 44 -716 68 -728 C 76 -764 74 -810 60 -860 Z', S.hair);
  for (const s of [-1, 1]) for (let i = 0; i < 3; i++) { const x = s * (50 + i * 9), y = -742 + i * 9; ellipse(c, x, y, 14, 12, i % 2 ? S.hairLt : S.hair); }
  if (o.neck) {
    const NECK = 'M -36 -700 C -34 -730 -36 -760 -40 -792 L 40 -792 C 36 -760 34 -730 36 -700 Z';
    fillPath(c, NECK, S.skin);
    inside(c, NECK, () => { c.save(); c.scale(L, 1); fillPath(c, 'M -44 -800 L -22 -800 C -20 -760 -22 -730 -26 -700 L -44 -700 Z', rgba(S.skinSh, .9)); c.restore();
      fillPath(c, 'M -50 -800 C -36 -764 -14 -752 0 -752 C 14 -752 36 -764 50 -800 L 50 -768 C 32 -740 -32 -740 -50 -768 Z', rgba(S.skinDk, .7)); });
  }
  // ears and kundals (big gold hoops with a ruby drop)
  for (const s of [-1, 1]) {
    fillPath(c, `M ${s * 51} -840 C ${s * 63} -845 ${s * 66} -827 ${s * 64} -813 C ${s * 63} -802 ${s * 57} -795 ${s * 51} -798 Z`, s === -L ? S.skinSh : S.skin);
    const sw = Math.sin(t * 1.3 + s) * 1;
    c.strokeStyle = S.gold; c.lineWidth = 4.5; c.beginPath(); c.arc(s * 58 + sw, -782, 12, 0, TAU); c.stroke();
    ellipse(c, s * 58 + sw, -768, 4, 5, S.ruby);
  }
  // face
  fillPath(c, FACE, S.skin);
  inside(c, FACE, () => {
    c.save(); c.scale(L, 1);
    fillPath(c, 'M -66 -900 L -35 -888 C -41 -864 -41 -842 -39 -822 C -38 -806 -35 -790 -30 -776 C -23 -760 -13 -748 -3 -740 L -66 -720 Z', S.skinSh);
    fillPath(c, 'M -53 -808 C -43 -801 -34 -793 -27 -780 C -35 -784 -45 -788 -55 -790 Z', rgba(S.skinDk, .45));
    fillPath(c, 'M -2 -832 C -6 -816 -10 -802 -13 -791 C -9 -786 -4 -785.5 -1 -787 C -2 -800 -2 -816 -2 -832 Z', S.skinSh);
    strokePath(c, 'M 3 -828 C 4 -814 5 -802 4.5 -794', rgba('#D9A07A', .5), 2.6);
    c.restore();
    for (const s of [-1, 1]) ellipse(c, s * 22, -826, 17, 8, rgba(S.skinDk, .2));
  });
  // eyes: kohl-lined, with a wing at the outer corner
  for (const s of [-1, 1]) {
    const ex = s * 22, ey = -821, lw = 13.5;
    if (E.eyes === 'happy') {   // laughing: squeezed shut into upward arcs
      strokePath(c, `M ${ex - lw} ${ey + 2} Q ${ex} ${ey - 9} ${ex + lw} ${ey + 2}`, S.kohl, 3.4);
      strokePath(c, `M ${ex - lw * .8} ${ey + 7} Q ${ex} ${ey + 3} ${ex + lw * .8} ${ey + 7}`, rgba(S.skinDk, .7), 1.6);
    } else {
      const op = E.eyes, up = lerp(4, -8, Math.min(op, 1)) - Math.max(0, op - 1) * 14, lo = 6.5 + Math.max(0, op - 1) * 12;
      const shape = `M ${ex - lw} ${ey + 1} Q ${ex - 2 * s} ${ey + up * 1.25} ${ex + lw} ${ey - 1} Q ${ex} ${ey + lo} ${ex - lw} ${ey + 1} Z`;
      if (op > .04) {
        fillPath(c, shape, S.eyeW);
        inside(c, shape, () => {
          const lx = (o.look ? o.look[0] : 0) * 4, ly = (o.look ? o.look[1] : 0) * 2, ir = op > 1 ? 4.2 : 5.6;
          ellipse(c, ex + lx, ey + .5 + ly, ir, ir * 1.1, S.iris); ellipse(c, ex + lx, ey + .5 + ly, ir * .45, ir * .5, '#0A0504');
          ellipse(c, ex + lx + 1.6, ey - 1.4 + ly, 1.3, 1.3, '#FFF8EC');
          ellipse(c, ex, ey + up * .9, lw + 2, 5, rgba(S.skinDk, .45));
        });
      }
      strokePath(c, `M ${ex - lw - 1} ${ey + 1.5} Q ${ex - 2 * s} ${ey + up * 1.25} ${ex + lw + 1} ${ey - .5}`, S.kohl, 3.2);
      strokePath(c, `M ${ex + s * lw} ${ey - .5} L ${ex + s * (lw + 7)} ${ey - 4}`, S.kohl, 2.4);   // the wing
      if (op > .04) strokePath(c, `M ${ex - lw + 2} ${ey + 2} Q ${ex} ${ey + lo + 1} ${ex + lw - 2} ${ey + 1}`, rgba(S.kohl, .7), 1.4);
      if (op < .3) for (let i = 0; i < 4; i++) { const u = (i + 1) / 5, x = lerp(ex - lw, ex + lw, u), y = ey + 1.5 + (up * 1.25 - 1) * 2 * u * (1 - u) * 1.2; strokePath(c, `M ${x} ${y} l ${(u - .5) * 2} 2.6`, S.kohl, 1.1); }
    }
    // heavy brows: angry = inner ends down, anguish = inner ends up
    const b = E.brow, iy = -833 + b * -7 + (E.eyes === 'happy' ? -3 : 0), oy = -838 + b * 4;
    limb(c, [[s * 7, iy], [s * 22, (iy + oy) / 2 - 5 + Math.abs(b) * 2], [s * 39, oy]], [7.5, 7, 3], S.hair);
  }
  // nose tip
  strokePath(c, 'M -9 -789 C -5 -785 5 -785 9 -789', S.skinDk, 2.1);
  // the mouth
  const U = -771;
  if (E.mouth === 'shut' || E.mouth === 'smirk') {
    const k = E.mouth === 'smirk' ? 1 : 0;
    fillPath(c, `M -12 ${U + 1} C -5 ${U + 8} 5 ${U + 8} 12 ${U + 1 - k * 3} C 5 ${U + 2} -5 ${U + 2} -12 ${U + 1} Z`, S.lipLo);
    strokePath(c, `M -14 ${U + 1} C -6 ${U + 2} 6 ${U + 2 - k * 2} ${15 + k * 2} ${U - 1 - k * 5}`, S.skinDk, 1.8);
  } else {
    const D = E.mouth === 'scream' ? U + 10 + m * 34 : E.mouth === 'laugh' ? U + 8 + m * 22 : E.mouth === 'sing' ? U + 6 + m * 14 : U + 12;
    const w = E.mouth === 'laugh' ? 17 + m * 5 : E.mouth === 'scream' ? 13 + m * 5 : E.mouth === 'sing' ? 8 + m * 3 : 16;
    const MO = `M ${-w} ${U} C ${-w * .5} ${U - 3} ${w * .5} ${U - 3} ${w} ${U} C ${w * .95} ${(U + D) / 2 + 3} ${w * .55} ${D} 0 ${D} C ${-w * .55} ${D} ${-w * .95} ${(U + D) / 2 + 3} ${-w} ${U} Z`;
    fillPath(c, MO, S.mouth);
    inside(c, MO, () => {
      if (E.mouth === 'grit') { fillPath(c, `M ${-w} ${U - 4} L ${w} ${U - 4} L ${w} ${D + 4} L ${-w} ${D + 4} Z`, S.teeth); strokePath(c, `M ${-w} ${(U + D) / 2} L ${w} ${(U + D) / 2}`, S.mouth, 1.6); for (const x of [-8, 0, 8]) strokePath(c, `M ${x} ${U} L ${x} ${D}`, rgba(S.mouth, .6), 1); }
      else {
        if (E.mouth !== 'sing') fillPath(c, `M ${-w} ${U - 4} L ${w} ${U - 4} L ${w} ${U + 4.5} L ${-w} ${U + 4.5} Z`, S.teeth);
        ellipse(c, 0, D + 2, w * .7, (D - U) * .32, S.tongue);
      }
    });
  }
  // the moustache, curled up at the ends
  for (const s of [-1, 1]) limb(c, [[s * 1, -780], [s * 14, -783], [s * 28, -779], [s * 40, -784], [s * 45, -796], [s * 41, -803]], [7, 10, 9, 6, 3.5, 1.5], S.hair, false);
  // tripundra (three lines of ash) and a red dot
  for (let i = 0; i < 3; i++) { const y = -850 - i * 6.5; strokePath(c, `M -30 ${y + 1.5} Q 0 ${y - 3.4} 30 ${y + 1.5}`, S.ash, 3.2); }
  ellipse(c, 0, -843, 3.2, 3.6, S.ruby);
  // hair under the crown
  const CAP = 'M -57 -812 C -66 -856 -56 -900 0 -906 C 56 -900 66 -856 57 -812 C 56 -834 51 -858 43 -870 C 31 -882 12 -884 0 -880 C -12 -884 -31 -882 -43 -870 C -51 -858 -56 -834 -57 -812 Z';
  fillPath(c, CAP, S.hair);
  if (o.crown !== false) rvCrownShape(c, o.crown || 'crown', L);
}

// a crown in the head's units (the band at -890): 'mukut' (tall, tiered, the centre head's) | 'crown' (pointed)
function rvCrownShape(c, kind, L = 1) {
  const S = RV;
  const band = 'M -60 -874 C -40 -886 40 -886 60 -874 L 58 -904 C 38 -914 -38 -914 -58 -904 Z';
  if (kind === 'mukut') {
    for (const s of [-1, 1]) fillPath(c, `M ${s * 54} -900 C ${s * 70} -910 ${s * 80} -926 ${s * 82} -946 C ${s * 72} -938 ${s * 64} -932 ${s * 50} -928 Z`, S.gold);   // side flares
    const T1 = 'M -54 -904 L -40 -966 L 40 -966 L 54 -904 Z', T2 = 'M -38 -964 L -24 -1010 L 24 -1010 L 38 -964 Z';
    fillPath(c, T1, S.gold); fillPath(c, T2, S.gold);
    fillPath(c, 'M -26 -1008 C -22 -1030 -10 -1044 0 -1062 C 10 -1044 22 -1030 26 -1008 Z', S.gold);
    c.save(); c.scale(L, 1); for (const p of [T1, T2]) inside(c, p, () => fillPath(c, 'M -80 -1080 L -8 -1080 L -14 -890 L -80 -890 Z', rgba(S.goldSh, .7))); c.restore();
    for (const [y, w] of [[-930, 44], [-984, 30]]) { strokePath(c, `M ${-w} ${y} L ${w} ${y}`, S.goldSh, 3); for (let i = -2; i <= 2; i++) ellipse(c, i * w / 2.6, y + 14, 3.2, 4, i ? S.emerald : S.ruby); }
    ellipse(c, 0, -1030, 6, 8, S.ruby); glow(c, 0, -1030, 22, '#FF6A5A', .35);
    strokePath(c, 'M -2 -1056 L 2 -1014', rgba(S.goldLt, .8), 2.5);
  } else {
    const pts = [[-54, -904], [-50, -938], [-36, -924], [-24, -956], [-12, -934], [0, -974], [12, -934], [24, -956], [36, -924], [50, -938], [54, -904]];
    poly(c, pts, S.gold);
    c.save(); c.scale(L, 1); inside(c, new Path2D('M ' + pts.map(p => p.join(' ')).join(' L ') + ' Z'), () => fillPath(c, 'M -80 -990 L -8 -990 L -14 -890 L -80 -890 Z', rgba(S.goldSh, .7))); c.restore();
    for (const x of [-24, 0, 24]) ellipse(c, x, -926, 3.6, 4.4, x ? S.emerald : S.ruby);
  }
  fillPath(c, band, S.goldSh); strokePath(c, 'M -58 -890 C -38 -898 38 -898 58 -890', S.goldLt, 2.2);
  for (let i = -4; i <= 4; i++) ellipse(c, i * 12, -893 - (4 - Math.abs(i)) * .6, 2.6, 2.6, i % 2 ? S.ruby : S.goldLt);
}
function rvCrown(c, o = {}) { c.save(); c.translate(0, 890); rvCrownShape(c, o.kind || 'crown', o.light ?? 1); c.restore(); }

// ---------- the row of heads ----------
// Head i (0..9, the centre one is 4): its place, size and drop toward the ends; the outer ones are drawn first.
function rvHeadPos(i) {
  const k = i - 4, a = Math.abs(k), sc = 1 - .06 * a;
  let x = 0; for (let j = 1; j <= a; j++) x += (2 - .06 * (2 * j - 1)) / 2 * 86;
  return { x: Math.sign(k) * x, y: 10 * a + 2.4 * a * a, s: sc, k };
}
function ravanaHeads(c, o = {}) {
  const t = o.t || 0, L = o.light ?? 1, S = RV;
  // the high black collar behind the side heads, edged in gold
  const COL = 'M -380 -676 C -320 -770 -170 -800 0 -800 C 170 -800 330 -770 400 -676 C 330 -700 170 -716 0 -716 C -170 -716 -320 -700 -380 -676 Z';
  fillPath(c, COL, S.black);
  inside(c, COL, () => { for (let i = 0; i < 7; i++) strokePath(c, `M ${-380 + i * 130} -660 L ${-300 + i * 110} -800`, rgba(S.blackLt, .6), 3); });
  strokePath(c, 'M -380 -676 C -320 -770 -170 -800 0 -800 C 170 -800 330 -770 400 -676', S.gold, 4);
  const order = [9, 0, 8, 1, 7, 2, 6, 3, 5, 4];
  for (const i of order) {
    const p = rvHeadPos(i), expr = (o.exprs && o.exprs[i]) || o.expr || 'calm', E = RV_EXPR[expr];
    let dx = 0, dy = 0, rot = (p.k ? Math.sign(p.k) * .05 : 0);
    let open = E.open;
    if (expr === 'laugh') { dy += Math.sin(t * 9 + i * 1.7) * 3; rot += Math.sin(t * 7 + i) * .05; open = .55 + .45 * Math.abs(Math.sin(t * 9 + i * 1.3)); }
    if (expr === 'scream') { dx += Math.sin(t * 43 + i * 2) * 1.6; dy += Math.cos(t * 37 + i) * 1.2; rot -= Math.sign(p.k) * .04; }
    if (expr === 'sing') { open = .35 + .3 * Math.max(0, Math.sin(t * 2.2 + i * .7)); rot += Math.sin(t * .9 + i * .5) * .025 - Math.sign(p.k) * .03; dy -= 4; }
    if (expr === 'grit') { dx += Math.sin(t * 31 + i) * 1.2; }
    if (o.bow) { dy += 10; rot *= .5; }
    const draw = (h) => {
      h.save(); h.translate(p.x + dx, p.y + dy - 815); h.rotate(rot); h.scale(p.s, p.s); h.translate(0, 815);
      // ambient occlusion from the nearer head onto this one
      if (p.k) glow(h, -Math.sign(p.k) * 70, -800, 90, '#000000', .35, 'source-atop');
      const on = o.crowns === false ? false : Array.isArray(o.crowns) ? o.crowns[i] : true;
      rvHead(h, { t, light: L, expr, open, crown: on ? (p.k ? 'crown' : 'mukut') : false, neck: !p.k, look: o.look || [p.k ? Math.sign(p.k) * .4 : 0, 0] });
      h.restore();
    };
    if (o.headFx) figure(c, draw, o.headFx); else draw(c);
  }
}

// ---------- arms ----------
// Two-bone reach: the elbow bends to side `bend` of the line from shoulder S to target T; T is pulled in if too far.
function rvReach(S, T, a, b, bend) {
  const dx = T[0] - S[0], dy = T[1] - S[1], d = Math.hypot(dx, dy) || 1, m = Math.min(d, a + b - 1), ux = dx / d, uy = dy / d;
  const x = (a * a - b * b + m * m) / (2 * m), h = Math.sqrt(Math.max(0, a * a - x * x));
  return [[S[0] + ux * x - uy * h * bend, S[1] + uy * x + ux * h * bend], [S[0] + ux * m, S[1] + uy * m]];
}
// one arm from shoulder S through elbow E to the wrist T; hand 'fist' | 'palm' (flat, pushing up) | 'namaste'
function rvArm(c, S, E, T, col, o = {}) {
  const k = o.k ?? 1, sh = o.shade;
  limb(c, [S, [lerp(S[0], E[0], .5), lerp(S[1], E[1], .5)], E], [62 * k, 54 * k, 44 * k], col);
  limb(c, [E, [lerp(E[0], T[0], .5), lerp(E[1], T[1], .5)], T], [44 * k, 40 * k, 31 * k], col);
  if (sh) limb(c, [[S[0] + sh[0], S[1] + sh[1]], [E[0] + sh[0], E[1] + sh[1]], [T[0] + sh[0] * .7, T[1] + sh[1] * .7]], [24 * k, 18 * k, 12 * k], rgba(RV.skinDk, .55));
  const a = Math.atan2(T[1] - E[1], T[0] - E[0]);
  ellipse(c, lerp(S[0], E[0], .62), lerp(S[1], E[1], .62), 29 * k, 8 * k, RV.gold, Math.atan2(E[1] - S[1], E[0] - S[0]) + Math.PI / 2);   // armlet
  ellipse(c, lerp(E[0], T[0], .88), lerp(E[1], T[1], .88), 18 * k, 7 * k, RV.gold, a + Math.PI / 2);   // bracelet
  const hx = T[0] + Math.cos(a) * 16 * k, hy = T[1] + Math.sin(a) * 16 * k;
  if (o.hand === 'palm') {   // a spread hand pressed flat on a surface; palmRot is the surface's direction
    const r = o.palmRot || 0, n = r - Math.PI / 2;
    for (let f = -1.5; f <= 1.5; f++) { const bx = hx + Math.cos(r) * f * 10 * k, by = hy + Math.sin(r) * f * 10 * k; limb(c, [[bx, by], [bx + Math.cos(n) * 18 * k, by + Math.sin(n) * 18 * k]], [10 * k, 8 * k], col); }
    ellipse(c, hx, hy, 26 * k, 17 * k, col, r);
  }
  else if (o.hand !== 'none') { ellipse(c, hx, hy, 24 * k, 27 * k, col, a); strokePath(c, `M ${hx + Math.cos(a + 1.3) * 14 * k} ${hy + Math.sin(a + 1.3) * 14 * k} L ${hx + Math.cos(a + 1.9) * 12 * k} ${hy + Math.sin(a + 1.9) * 12 * k}`, rgba(RV.skinDk, .6), 2 * k); }
  if (o.weapon) rvWeapon(c, hx, hy, a + Math.PI / 2, o.weapon, k);
}
// a weapon held upright-ish in the fist at (x, y), at angle a (radians from +x)
function rvWeapon(c, x, y, a, kind, k = 1) {
  c.save(); c.translate(x, y); c.rotate(a);
  if (kind === 'sword') { fillPath(c, `M -8 0 L 8 0 L 6 -170 L 0 -196 L -6 -170 Z`, RV.steel); fillPath(c, 'M 0 0 L 8 0 L 6 -170 L 0 -196 Z', RV.steelSh); fillPath(c, 'M -22 6 L 22 6 L 18 -4 L -18 -4 Z', RV.gold); fillPath(c, 'M -5 6 L 5 6 L 5 36 L -5 36 Z', RV.wood); }
  else if (kind === 'mace') { fillPath(c, 'M -5 40 L 5 40 L 5 -120 L -5 -120 Z', RV.gold); ellipse(c, 0, -146, 30, 34, RV.gold); ellipse(c, 8, -152, 10, 14, rgba(RV.goldLt, .7)); for (let i = 0; i < 5; i++) ellipse(c, Math.cos(i * 1.26) * 30, -146 + Math.sin(i * 1.26) * 34, 5, 5, RV.goldSh); }
  else if (kind === 'spear') { fillPath(c, 'M -3.5 60 L 3.5 60 L 3.5 -200 L -3.5 -200 Z', RV.wood); fillPath(c, 'M 0 -262 C 12 -236 12 -214 6 -198 L -6 -198 C -12 -214 -12 -236 0 -262 Z', RV.steel); }
  else if (kind === 'axe') { fillPath(c, 'M -4 50 L 4 50 L 4 -130 L -4 -130 Z', RV.wood); fillPath(c, 'M 4 -128 C 40 -150 56 -110 52 -76 C 36 -92 18 -96 4 -92 Z', RV.steel); }
  else if (kind === 'gembow') {   // the bow set with pearls and gemstones (Valmiki 3.51.10), upright
    strokePath(c, 'M 0 -150 C 64 -100 64 100 0 150', RV.goldSh, 11); strokePath(c, 'M 0 -150 C 60 -100 60 100 0 150', RV.gold, 6);
    for (let i = 0; i <= 8; i++) { const u = i / 8, x = 3 * (1 - u) * u * 2 * 62, y = lerp(-150, 150, u); ellipse(c, x, y, 5, 5, i % 2 ? RV.ruby : '#F3EBD8'); }
    strokePath(c, 'M 0 -150 L 0 150', rgba('#E8DCC0', .8), 1.5);
  }
  else if (kind === 'bow') { strokePath(c, 'M 0 -150 C 60 -100 60 100 0 150', RV.wood, 9); strokePath(c, 'M 0 -150 L 0 150', rgba('#E8DCC0', .8), 1.5); }
  else if (kind === 'disc') { ellipse(c, 0, -40, 30, 30, RV.gold); ellipse(c, 0, -40, 14, 14, RV.goldSh); }
  c.restore();
}

// The arch of hands in 'lift' and 'pinned' (body units): a half-ellipse round the heads that the palms press on, so a
// scene can cut the matching cave into the mountain's underside. o: pose, reach.
function ravanaArch(o = {}) {
  const pinned = o.pose === 'pinned', D = (pinned ? 1 : .55) * 170, A = pinned ? .62 : lerp(.45, 1, o.reach ?? 1);
  return { cx: 0, cy: -760 + D, rx: 600 * A, ry: 470 * A };
}

// ---------- the whole figure ----------
const RV_WEAPONS = ['sword', 'mace', 'spear', 'axe', 'bow', 'disc', 'sword', 'mace', 'spear'];
function ravana(c, o = {}) {
  const t = o.t || 0, L = o.light ?? 1, S = RV, pose = o.pose || 'stand', br = Math.sin(t * 1.4) * 1.5;
  const sit = pose === 'sit', sq = pose === 'lift' ? .55 : pose === 'pinned' ? 1 : pose === 'bow' ? 1 : 0, D = sit ? 140 : sq * 170;
    // the nine back arms each side, behind everything
  const back = [];
  for (const s of [-1, 1]) for (let j = 0; j < 9; j++) {
    const Sx = s * (140 + j * 7), Sy = -700 + j * 6 + D + br, Sp = [Sx, Sy];
    let T, bend = s;
    if (pose === 'stand' || sit) {
      const phi = lerp(.3, 2.15, j / 8) + Math.sin(t * 1.1 + j * .9 + s) * .03, R = 370 + (j % 2) * 30;
      T = [Sx + s * Math.sin(phi) * R, Sy - Math.cos(phi) * R];
    } else if (pose === 'bow') {
      const phi = lerp(1.6, 2.7, j / 8), R = 330;
      T = [Sx + s * Math.sin(phi) * R, Sy - Math.cos(phi) * R]; bend = -s;
    } else {
      const A = ravanaArch(o), phi = lerp(.34, 1.62, j / 8), jit = Math.sin(t * 23 + j * 2.3) * (o.strain || 0) * 3;
      T = [s * Math.sin(phi) * (A.rx - 26) + jit, A.cy - Math.cos(phi) * (A.ry - 26) + jit];
    }
    back.push({ s, j, Sp, T, bend });
  }
  // draw the far arms (the lower and outer ones in 'stand') first; the deeper ones darker
  back.sort((p, q) => (pose === 'stand' ? q.j - p.j : q.j - p.j));
  for (const b of back) {
    const lift = pose === 'lift' || pose === 'pinned', [E, T] = rvReach(b.Sp, b.T, lift ? 265 : 235, lift ? 250 : 220, b.bend), col = mixCol(S.skin, S.skinDk, .12 + b.j * .045);
    const gone = b.s < 0 && o.lostLeft ? clamp(o.lostLeft * 9 - (8 - b.j)) : 0;
    if (gone > .98) { ellipse(c, b.Sp[0], b.Sp[1], 30, 26, mixCol(col, '#3A0A0A', .5)); continue; }
    c.save(); if (gone) { c.translate(b.Sp[0], b.Sp[1]); c.scale(1 - gone, 1 - gone); c.translate(-b.Sp[0], -b.Sp[1]); }
    rvArm(c, b.Sp, E, T, col, { k: pose === 'stand' || sit ? .95 : 1.08, hand: lift ? 'palm' : 'fist', palmRot: Math.atan2(T[1] - ravanaArch(o).cy, T[0]) + Math.PI / 2, weapon: pose === 'stand' && o.weapons ? RV_WEAPONS[(b.j + (b.s > 0 ? 4 : 0)) % 9] : null, side: b.s });
    c.restore();
  }
  // legs
  if (sit) for (const s of [-1, 1]) {
    // seated: the thighs come toward us (short and wide), the shins straight down to the feet
    const hip = [s * 66, -350], knee = [s * 168, -310], ank = [s * 158, -42];
    limb(c, [knee, [lerp(knee[0], ank[0], .5), -170], ank], [104, 84, 58], S.skin);
    if (s === -L) limb(c, [[knee[0] + s * 18, knee[1] + 20], [ank[0] + s * 12, -150], ank], [44, 34, 20], rgba(S.skinSh, .9));
    fillPath(c, `M ${ank[0] - 30} -46 C ${ank[0] - 34} -20 ${ank[0] - 30} -6 ${ank[0] - 26} 0 L ${ank[0] + s * 60 + 10} 0 C ${ank[0] + s * 66} -12 ${ank[0] + s * 40} -24 ${ank[0] + 22} -46 Z`, S.skin);
    ellipse(c, ank[0], -52, 30, 8, S.gold); ellipse(c, ank[0], -58, 27, 3, S.goldSh);
    limb(c, [hip, [lerp(hip[0], knee[0], .5), -334], knee], [176, 168, 140], S.dhoti, false);
    ellipse(c, knee[0], knee[1] + 8, 66, 54, S.dhoti);
    strokePath(c, `M ${knee[0] - 62} ${knee[1] + 30} C ${knee[0] - 20} ${knee[1] + 64} ${knee[0] + 20} ${knee[1] + 64} ${knee[0] + 62} ${knee[1] + 30}`, S.gold, 10);
  }
  else for (const s of [-1, 1]) {
    const hip = [s * 64, -470 + D], knee = [s * lerp(78, 236, sq), lerp(-250, -238, sq)], ank = [s * lerp(64, 250, sq), -42];
    limb(c, [hip, knee], [132, 104], S.skin); limb(c, [knee, [lerp(knee[0], ank[0], .5), -150], ank], [98, 80, 56], S.skin);
    if (s === -L) limb(c, [[hip[0] + s * 20, hip[1]], [knee[0] + s * 18, knee[1]], ank], [50, 40, 22], rgba(S.skinSh, .9));
    fillPath(c, `M ${ank[0] - 30} -46 C ${ank[0] - 34} -20 ${ank[0] - 30} -6 ${ank[0] - 26} 0 L ${ank[0] + s * 60 + 10} 0 C ${ank[0] + s * 66} -12 ${ank[0] + s * 40} -24 ${ank[0] + 22} -46 Z`, S.skin);
    ellipse(c, ank[0], -52, 30, 8, S.gold); ellipse(c, ank[0], -58, 27, 3, S.goldSh);
    // the dhoti over the thigh, to the knee
    limb(c, [[s * 50, -480 + D], [lerp(s * 50, knee[0], .55), lerp(-480 + D, knee[1], .55)], [knee[0] * 1.02, knee[1] + 26]], [168, 146, 116], S.dhoti, false);
    limb(c, [[knee[0] * .9, knee[1] + 18], [knee[0] * 1.03, knee[1] + 30]], [108, 102], S.gold, false);
  }
  // front pleats and the gold belt
  const PL = sit ? 'M -60 -360 L 60 -360 L 50 -150 L -50 -150 Z' : `M -52 ${-488 + D} L 52 ${-488 + D} L 44 ${-200 + D * .55} L -44 ${-200 + D * .55} Z`;
  fillPath(c, PL, S.dhoti);
  const pb = sit ? -150 : -200 + D * .55;
  inside(c, PL, () => { for (let i = -2; i <= 2; i++) strokePath(c, `M ${i * 16} ${-480 + D} L ${i * 14} ${pb + 4}`, rgba(S.dhotiSh, .9), 4); fillPath(c, `M -60 ${pb - 24} L 60 ${pb - 24} L 60 ${pb + 4} L -60 ${pb + 4} Z`, S.gold); });
  c.save(); c.translate(0, D + br * .3);
  // torso (drawn 1.2× wide: he is massive)
  c.save(); c.scale(1.2, 1);
  const TORSO = `M -96 -478 C -104 -540 -128 -600 -140 -644 C -148 -670 -156 -690 -168 -702 C -128 -722 -72 ${-726 + br} -30 -732 L 30 -732 C 72 ${-726 + br} 128 -722 168 -702 C 156 -690 148 -670 140 -644 C 128 -600 104 -540 96 -478 Z`;
  fillPath(c, TORSO, S.skin);
  inside(c, TORSO, () => {
    c.save(); if (L < 0) c.scale(-1, 1);
    fillPath(c, 'M -96 -478 C -104 -540 -128 -600 -140 -644 C -148 -670 -156 -690 -176 -702 L -166 -702 C -130 -690 -96 -660 -86 -620 C -76 -580 -78 -520 -72 -478 Z', S.skinSh);
    c.restore();
    for (const s of [-1, 1]) strokePath(c, `M ${s * 126} -630 C ${s * 96} -602 ${s * 46} -598 ${s * 6} -614`, S.skinSh, 4.5);
    for (const [y, w] of [[-570, 30], [-532, 28]]) for (const s of [-1, 1]) strokePath(c, `M ${s * 6} ${y} q ${s * w / 2} -3 ${s * w} 2`, rgba(S.skinSh, .7), 2.6);
    strokePath(c, 'M 0 -590 L 0 -505', rgba(S.skinSh, .5), 2.2);
  });
  fillPath(c, 'M -100 -500 Q 0 -486 100 -500 L 98 -470 Q 0 -458 -98 -470 Z', S.gold);   // the belt
  for (let i = -3; i <= 3; i++) ellipse(c, i * 26, -484 + Math.abs(i) * .8, 5, 6, i % 2 ? S.ruby : S.emerald);
  // layered gold on the chest
  for (const [y0, dy, n, r] of [[-716, 70, 15, 5], [-712, 110, 19, 5.5], [-708, 150, 23, 4.5]]) for (let i = 0; i <= n; i++) {
    const u = i / n, x = lerp(-70 - dy * .2, 70 + dy * .2, u), y = y0 + Math.pow(Math.sin(u * Math.PI), .8) * dy;
    ellipse(c, x, y, r, r, i % 4 === 2 ? S.ruby : S.gold);
  }
  ellipse(c, 0, -566, 12, 15, S.ruby); strokePath(c, 'M -16 -566 A 16 19 0 1 0 16 -566 A 16 19 0 1 0 -16 -566', S.gold, 4);
  c.restore();
  // the front pair of arms
  const front = o.front || (pose === 'stand' ? 'hips' : pose === 'bow' ? 'namaste' : sit ? 'rest' : 'up');
  const fArm = (s) => {
    const Sp = [s * 192, -692 + br], d = (a) => ellipse(a, s * 190, -680 + br, 42, 52, S.skin, s * -.2);
    figure(c, (a) => {
      d(a);
      let E, T, hand = 'fist', weapon = null, wk = 1.6;
      const fm = (s > 0 ? o.frontR : o.frontL) || front;
      if (fm === 'carry') return;   // drawn by rvCarryArm(), over whoever he holds
      if (fm === 'sword') { const e = ease(clamp(o.swing || 0)); T = [lerp(s * 330, -s * 60, e), lerp(-1010, -470, e) - Math.sin(e * Math.PI) * 140]; [E, T] = rvReach(Sp, T, 265, 250, -s); weapon = 'sword'; wk = 3.4; }
      else if (fm === 'bow') { E = [s * 330, -700]; T = [s * 470, -726]; weapon = o.bowBroken ? null : 'gembow'; wk = 2; }
      else if (fm === 'fist') { E = [s * 300, -820]; T = [s * 300, -980]; }
      else if (front === 'hips') { E = [s * 300, -560]; T = [s * 140, -488]; }
      else if (front === 'down') { E = [s * 222, -540]; T = [s * 230, -400]; }
      else if (front === 'rest') { E = [s * 284, -566]; T = [s * 300, -536]; }
      else if (front === 'grab') { E = [s * 236, -536]; T = [s * 96, -414]; }
      else if (front === 'namaste') { E = [s * 200, -560]; T = [s * 16, -640]; hand = 'none'; }
      else { const A = ravanaArch(o), phi = .14; [E, T] = rvReach(Sp, [s * Math.sin(phi) * (A.rx - 26), A.cy - Math.cos(phi) * (A.ry - 26) - D], 265, 250, s); hand = 'palm'; }
      rvArm(a, Sp, E, T, S.skin, { k: 1.15, hand, palmRot: 0, shade: s === -L ? [s * 10, 4] : null });
      if (weapon) { const ang = Math.atan2(T[1] - E[1], T[0] - E[0]), hx = T[0] + Math.cos(ang) * 18, hy = T[1] + Math.sin(ang) * 18; rvWeapon(a, hx, hy, weapon === 'gembow' ? 0 : ang + Math.PI / 2, weapon, wk); }
      if (front === 'namaste') fillPath(a, `M ${s * 2} -700 C ${s * 18} -690 ${s * 30} -660 ${s * 24} -630 L ${s * 2} -626 Z`, S.skin);
    }, o.armFx || {});
  };
  if (front === 'up') { fArm(-1); fArm(1); }
  // the heads; then, standing, the front arms over the chest
  ravanaHeads(c, { t, light: L, expr: o.expr, exprs: o.exprs, headFx: o.headFx, look: o.look, bow: pose === 'bow' });
  if (front !== 'up') { fArm(-1); fArm(1); }
  c.restore();
}

// ---------- for the Jatayu story (Valmiki, Aranya Kanda 49–52) ----------
// rvCarryArm(c, o): Ravana's front arm on screen right (frontR: 'carry'), wrapped round someone held at his side: drawn
//   after them, in his units (the same transform as ravana()). o: t, pose, hold ([x, y] where the hand grips, default
//   the waist of a figure standing at x 300), fx (figure() options for its edge).
function rvCarryArm(c, o = {}) {
  const t = o.t || 0, br = Math.sin(t * 1.4) * 1.5, D = o.pose === 'sit' ? 140 : 0, H = o.hold || [330, -560];
  c.save(); c.translate(0, D + br * .3);
  figure(c, (a) => {
    const Sp = [192, -692 + br]; ellipse(a, 190, -680 + br, 42, 52, RV.skin, -.2);
    const [E, T] = rvReach(Sp, H, 265, 250, 1);
    rvArm(a, Sp, E, T, RV.skin, { k: 1.15, hand: 'fist' });
  }, o.fx || {});
  c.restore();
}

// rvMule(c, o): one of the chariot's "ghost-faced mules" (3.49.19, 3.51.15), side view facing right, galloping through
//   the air; about 640 long, the hooves near y 0, the head up at about (380, -520). Ash-dark with a spiky mane, long
//   ears, a goblin's face: glowing eyes and a fanged grin. o: t, gallop (phase), glow (0..1 the eyes), dead (true: limp,
//   the eyes out, the legs folded), col.
function rvMule(c, o = {}) {
  const t = o.t || 0, one = o.col, C = (k) => one || k, dead = o.dead, g = dead ? 0 : (o.gallop ?? t * 2.2) * TAU;
  const body = '#3A3438', dark = '#221E22', lt = '#5E565C';
  // legs: far pair first, the flying gallop (front reaching, back pushing)
  const leg = (hx, hy, a, k, col) => { const kx = hx + Math.cos(a) * 130, ky = hy + Math.sin(a) * 130, a2 = a + (dead ? .9 : .5 * k), fx = kx + Math.cos(a2) * 120, fy = ky + Math.sin(a2) * 120;
    limb(c, [[hx, hy], [kx, ky], [fx, fy]], [70, 42, 30], C(col)); ellipse(c, kx, ky, 22, 22, C(col)); ellipse(c, fx + Math.cos(a2) * 14, fy + Math.sin(a2) * 14, 22, 16, C('#141012'), a2); };
  const sw = Math.sin(g), sw2 = Math.sin(g + 1.2);
  leg(160, -280, dead ? 1.9 : .5 + sw * .5, -1, dark); leg(-150, -270, dead ? 1.7 : 2.3 + sw2 * .45, 1, dark);
  // the tail
  limb(c, [[-200, -330], [-270, -300 + Math.sin(t * 5) * 10], [-320, -250]], [22, 14, 8], C(dark)); ellipse(c, -326, -240, 18, 30, C(dark), .5);
  // body and neck
  ellipse(c, 0, -320, 210, 100, C(body));
  if (!one) inside(c, new Path2D('M -220 -320 a 220 100 0 1 0 440 0 a 220 100 0 1 0 -440 0'), () => { ellipse(c, 0, -250, 220, 50, rgba(dark, .7)); ellipse(c, 40, -390, 160, 26, rgba(lt, .5)); });
  const hd = dead ? 1 : 0, nx = 330, ny = dead ? -320 : -470;
  limb(c, [[140, -350], [230, ny + 70 - hd * 20], [nx - 20, ny + 10]], [150, 110, 86], C(body));
  // the spiky mane along the neck
  for (let i = 0; i < 9; i++) { const u = i / 8, x = lerp(130, nx - 30, u), y = lerp(-400, ny - 26, u); fillPath(c, `M ${x - 16} ${y + 8} L ${x - 4 - 26} ${y - 40 - Math.sin(t * 6 + i) * 4} L ${x + 14} ${y + 4} Z`, C('#141012')); }
  // the head: a long donkey's head angled down, tall ears, a goblin's face (a fanged grin, a slit of fire for an eye)
  c.save(); c.translate(nx, ny); c.rotate(dead ? .9 : -.05 + Math.sin(g) * .04);
  for (const [dx, a, l] of [[-34, -2.25, 160], [-8, -1.95, 170]]) { const ex = dx + Math.cos(a) * l, ey = -30 + Math.sin(a) * l, px = -Math.sin(a) * 22, py = Math.cos(a) * 22;
    fillPath(c, `M ${dx - px} ${-30 - py} Q ${(dx + ex) / 2 - px * 1.4} ${(-30 + ey) / 2 - py * 1.4} ${ex} ${ey} Q ${(dx + ex) / 2 + px * 1.4} ${(-30 + ey) / 2 + py * 1.4} ${dx + px} ${-30 + py} Z`, C(dark)); }
  const HD = 'M -44 -44 C 10 -66 64 -44 112 18 C 142 50 162 80 152 106 C 142 128 110 128 88 116 C 48 94 -2 64 -44 30 Z';
  fillPath(c, HD, C(body));
  if (!one) {
    inside(c, HD, () => { fillPath(c, 'M -60 20 C 20 60 90 100 170 96 L 170 160 L -60 160 Z', rgba(dark, .8)); ellipse(c, 132, 96, 40, 30, '#1A1618'); strokePath(c, 'M -30 -40 C 20 -56 60 -40 100 10', rgba(lt, .7), 6); });
    ellipse(c, 146, 86, 6, 4, '#0A0608');
    fillPath(c, 'M 74 108 C 100 122 128 128 150 118 L 146 130 C 120 140 96 136 70 118 Z', '#120608');
    for (const x of [86, 106, 126]) fillPath(c, `M ${x} 114 L ${x + 9} 116 L ${x + 3} 134 Z`, '#EDE4D2');
    if (!dead) { const gl = o.glow ?? 1; glow(c, 22, -4, 70, '#FFB030', .7 * gl); fillPath(c, 'M 2 -2 C 12 -14 32 -16 44 -8 C 32 2 14 4 2 -2 Z', mixCol('#FFE070', '#FFF8D0', .5 * gl)); ellipse(c, 24, -7, 3, 6, '#3A0A04'); }
    else strokePath(c, 'M 6 -6 L 40 -6', '#0E0A0C', 3);
    fillPath(c, 'M -6 -22 C 14 -34 40 -30 58 -18 L 52 -10 C 36 -20 14 -22 -2 -14 Z', '#141012');   // the heavy brow
    strokePath(c, 'M 96 70 C 110 60 128 62 140 72', RV.gold, 6);   // the noseband
  }
  c.restore();
  if (!one) { strokePath(c, 'M 150 -400 C 200 -360 230 -300 220 -250', RV.gold, 16); for (let i = 0; i < 4; i++) ellipse(c, 168 + i * 18, -378 + i * 40, 5, 5, RV.ruby); }
  // the near legs
  leg(180, -270, dead ? 1.6 : .2 - sw * .5, -1, body); leg(-130, -260, dead ? 1.4 : 2.6 - sw2 * .45, 1, body);
}

// ravanaChariot(c, o): Ravana's gold chariot, side view flying right (3.49.19: golden wheels and parts, yoked to the
//   mules; it flies at will). The floor at y 0 from x -420 to 460, the high back and the prow rising; one big gold wheel
//   at (-60, 70); a red pennant on a staff at the back; the pole runs forward to the mules (drawn by rvMule, ahead of
//   x 700). o: t, layer ('back' the staff, pennant and the far rail; 'front' the panel, the wheel, the pole; omit for
//   both), spin (the wheel's turn, radians), driver (true: the charioteer at the prow, a dark rakshasa holding the
//   reins), col (a silhouette), glow (0..1 maya light under it).
function ravanaChariot(c, o = {}) {
  const t = o.t || 0, one = o.col, C = (k) => one || RV[k] || k, back = o.layer !== 'front', front = o.layer !== 'back';
  if (back) {
    if (o.glow) glow(c, 0, 80, 520, '#FF9A40', .35 * o.glow);
    fillPath(c, 'M -430 -10 L -446 -980 L -428 -980 L -410 -10 Z', C('goldSh'));
    const fl = (x) => Math.sin(t * 4 - x * .02) * (x + 440) * .05;
    let P = 'M -436 -970'; for (let x = -436; x <= -100; x += 28) P += ` L ${x} ${-970 + fl(x)}`; for (let x = -100; x >= -436; x -= 28) P += ` L ${x + (x === -100 ? 0 : 0)} ${-860 + fl(x) * 1.2 + (x + 436) * .15}`;
    fillPath(c, P + ' Z', C('#9E1622'));
    fillPath(c, 'M -400 -280 C -380 -330 -300 -330 -280 -280 L 360 -280 C 400 -300 440 -300 470 -270 L 470 -240 L -400 -240 Z', C('goldSh'));   // the far rail
    if (o.driver) {
      // the charioteer (3.51.18): a crouched dark rakshasa at the prow, horned, reins in hand
      const dc = one || '#1C1216';
      ellipse(c, 360, -330, 54, 80, dc); ellipse(c, 380, -430, 36, 40, dc);
      for (const s of [-1, 1]) fillPath(c, `M ${380 + s * 20} -460 Q ${380 + s * 46} -500 ${380 + s * 30} -530 Q ${380 + s * 30} -496 ${380 + s * 8} -468 Z`, dc);
      limb(c, [[380, -350], [440, -320], [500, -300]], [30, 24, 18], dc);
      if (!one) ellipse(c, 394, -434, 6, 4, '#FFB040');
    }
  }
  if (front) {
    // the pole, out to the mules
    limb(c, [[440, -60], [700, -150], [930, -250]], [30, 26, 22], C('goldSh'));
    strokePath(c, 'M 500 -300 C 640 -320 800 -340 960 -390', rgba('#2A1A10', .9), 4);   // the reins
    const PANEL = 'M -420 -10 L 380 -10 C 430 -10 462 -40 472 -96 L 482 -280 C 452 -300 420 -292 408 -262 L 396 -130 L -360 -130 L -384 -300 C -394 -334 -428 -334 -440 -300 Z';
    fillPath(c, PANEL, C('gold'));
    if (!one) inside(c, PANEL, () => {
      fillPath(c, 'M -460 -70 L 500 -70 L 500 20 L -460 20 Z', rgba(RV.goldSh, .9));
      strokePath(c, 'M -380 -110 L 400 -110', RV.goldSh, 6); strokePath(c, 'M -380 -96 L 400 -96', rgba(RV.goldLt, .8), 3);
      for (let i = 0; i < 14; i++) { const x = -330 + i * 52; ellipse(c, x, -102, 7, 7, i % 2 ? RV.ruby : RV.emerald); }
      for (let i = 0; i < 6; i++) strokePath(c, `M ${-300 + i * 120} -40 c 20 -24 40 -24 60 0`, rgba(RV.goldLt, .6), 3);
      strokePath(c, 'M -436 -296 C -420 -320 -396 -320 -388 -296', rgba(RV.goldLt, .9), 4);
    });
    // the wheel: a gold rim, twelve spokes, a hub
    c.save(); c.translate(-60, 70); c.rotate(o.spin ?? t * 2);
    c.strokeStyle = C('goldSh'); c.lineWidth = 34; c.beginPath(); c.arc(0, 0, 170, 0, TAU); c.stroke();
    c.strokeStyle = C('gold'); c.lineWidth = 18; c.beginPath(); c.arc(0, 0, 170, 0, TAU); c.stroke();
    for (let i = 0; i < 12; i++) { c.rotate(TAU / 12); fillPath(c, 'M -6 0 L 6 0 L 4 -160 L -4 -160 Z', C('gold')); }
    ellipse(c, 0, 0, 40, 40, C('gold')); if (!one) { ellipse(c, 0, 0, 18, 18, RV.ruby); for (let i = 0; i < 16; i++) ellipse(c, Math.cos(i * TAU / 16) * 170, Math.sin(i * TAU / 16) * 170, 5, 5, RV.goldLt); }
    c.restore();
  }
}

// rvBlade(c, o): Ravana's sword, close: a long curved blade along -y from the hilt at (0, 0) to the tip at about
//   (60, -1000), a gold hilt with a ruby below. o: glint (0..1 a flash of light running up the blade), col.
function rvBlade(c, o = {}) {
  const one = o.col, C = (k) => one || RV[k];
  fillPath(c, 'M -20 40 L 20 40 L 16 220 L -16 220 Z', C('wood'));
  for (let i = 0; i < 6; i++) strokePath(c, `M -18 ${60 + i * 28} L 18 ${74 + i * 28}`, C('gold'), 4);
  ellipse(c, 0, 240, 30, 26, C('gold')); if (!one) ellipse(c, 0, 240, 12, 12, RV.ruby);
  fillPath(c, 'M -110 20 C -60 0 60 0 110 20 L 104 44 C 60 30 -60 30 -104 44 Z', C('gold')); if (!one) ellipse(c, 0, 24, 14, 14, RV.ruby);
  const BL = 'M -34 0 C -40 -300 -20 -640 30 -880 C 44 -940 56 -980 64 -1010 C 62 -960 58 -900 52 -860 C 40 -620 40 -300 34 0 Z';
  fillPath(c, BL, C('steel'));
  if (!one) {
    inside(c, BL, () => {
      fillPath(c, 'M 0 0 C -4 -300 14 -640 50 -880 L 80 -1020 L 80 20 Z', RV.steelSh);
      strokePath(c, 'M -6 -20 C -10 -300 4 -600 34 -820', rgba('#5E6670', .9), 6);
      if (o.glint != null) { const y = lerp(40, -1040, o.glint); fillPath(c, `M -80 ${y + 80} L 100 ${y - 40} L 100 ${y - 10} L -80 ${y + 110} Z`, rgba('#FFFFFF', .85)); }
    });
    if (o.glint != null) { const g = o.glint, y = lerp(0, -1000, g); glow(c, lerp(-10, 60, g * g), y, 140, '#E8F0FF', .8 * Math.sin(g * Math.PI)); }
  }
}
