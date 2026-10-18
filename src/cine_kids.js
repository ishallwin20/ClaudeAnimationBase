// cine_kids.js: the Cinematic engine (cine.js) in daylight, for picture books: clean shapes with soft painted volume
// (gradient shading inside each shape, a warm darker contour, a light rim toward the sun), bright skies, tree canopies.
// The cast here is drawn the way children's books draw them: chubby, big eyes, rounded forms, while the gods keep the
// Cinematic proportions (suryaHead() recoloured for Indra).
// Load after cine.js, cine_surya.js.
//
//   KLIGHT(dx, dy)          figure() options for a daylit figure, the light toward screen direction (dx, dy)
//   shade(c, d, x0, y0, x1, y1, col, a)  a soft linear shade inside path d, clear at (x0, y0), col·a at (x1, y1)
//   kidHanuman(c, o)        Bal Hanuman: golden fur, a peach face, big eyes, a curly tuft, a red langot, the munja thread,
//                           gold kundals, a long tail. Units: his belly at (0, 0), the head's centre (0, -175), about
//                           430 tall standing. o: pose 'leap' | 'tumble', t, rot (radians, about the belly), look [x, y],
//                           mouth 'aah' | 'wail' | 'smile', eyes 'open' | 'dizzy', jaw (0..1 the swollen chin), arms /
//                           legs (overrides: [shoulder angle, elbow bend] per side, in his upright frame, 0 = right)
//   airavataK(c, o)         Airavata, Indra's white elephant, four tusks, 3/4 view facing left, from the knees up (stand
//                           him in clouds). Units: ground under the knees at (0, 0), about 820 tall, 1100 long. o: t,
//                           trunk (0 down .. 1 raised), ear (flap phase). airavataSeat() is where a rider sits.
//   indraK(c, o)            Indra from the waist up (seated): suryaHead() in his colours, a blue uttariya, gold; the
//                           right arm raised with the vajra. Units as surya(): the waist at y -480. o: t, look, vajra.
//   vajraK(c, x, y, s, a)   the vajra (thunderbolt), centred on (x, y), s ≈ 1 is 220 long, a its angle
//   canopy(c, x, y, w, seed, cols)  a tree crown or bush: cloud()'s lumpy sprite in greens (cols = [under, body, lit])
//   kidTree(c, x, y, h, seed, o)    a trunk with a canopy on top
const KID = {
  fur: '#E9A23B', furSh: '#C27A24', furDk: '#94561A', furLt: '#FFC968', face: '#F8D6AE', faceSh: '#E5B184', faceLt: '#FFEBD2',
  eye: '#3A2014', eyeW: '#FFFDF6', lid: '#5A3020', mouth: '#8E2E2A', tongue: '#F07A78', blush: '#F59A8E',
  langot: '#D8322E', langotSh: '#A21E1E', gold: '#F2BE3E', goldSh: '#B88420', goldLt: '#FFE69A', thread: '#FFF4D8', tilak: '#E0281E',
  ink: '#5A2E18',
};
const KLIGHT = (dx = 5, dy = -4, o = {}) => ({ edge: { col: o.edge || '#6A3A1E', w: o.w ?? 2.6, a: o.ea ?? .38 }, rim: { col: o.rim || '#FFF2C8', dx, dy, a: o.ra ?? .75, blur: 1.5 } });
function shade(c, d, x0, y0, x1, y1, col, a = .6) {
  inside(c, d, () => { const g = c.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, rgba(col, 0)); g.addColorStop(1, rgba(col, a)); c.fillStyle = g; c.fillRect(-4000, -4000, 8000, 8000); });
}
function radialShade(c, d, x, y, r0, r1, col, a = .6) {
  inside(c, d, () => { const g = c.createRadialGradient(x, y, r0, x, y, r1); g.addColorStop(0, rgba(col, 0)); g.addColorStop(1, rgba(col, a)); c.fillStyle = g; c.fillRect(-4000, -4000, 8000, 8000); });
}
const circ = (x, y, r) => { const p = new Path2D(); p.arc(x, y, r, 0, TAU); return p; };
const ellP = (x, y, rx, ry, rot = 0) => { const p = new Path2D(); p.ellipse(x, y, rx, ry, rot, 0, TAU); return p; };
// a two-bone chain from p, angle a1 (radians, 0 = +x), length l1, then the elbow bend b (added), length l2
const chain = (p, a1, l1, b, l2) => { const e = [p[0] + Math.cos(a1) * l1, p[1] + Math.sin(a1) * l1]; return [p, e, [e[0] + Math.cos(a1 + b) * l2, e[1] + Math.sin(a1 + b) * l2]]; };

// ---------------- Bal Hanuman ----------------
const KH_POSE = {
  leap: { arms: [[-1.95, .25], [-1.25, -.15]], legs: [[1.95, .9], [1.45, .35]], head: -.45, tail: 'stream' },
  tumble: { arms: [[-2.6, -.9], [-.45, -2.25]], legs: [[-1.2, .9], [-.4, -.7]], head: .35, tail: 'whirl' },
  sit: { arms: [[2.3, -.6], [.84, .6]], legs: [[2.2, -1.1], [.9, 1.1]], head: 0, tail: 'curl' },
};
function kidHanuman(c, o = {}) {
  const S = KID, t = o.t || 0, P = KH_POSE[o.pose || 'leap'];
  const arms = o.arms || P.arms, legs = o.legs || P.legs;
  c.save(); c.rotate(o.rot || 0);
  // ---- the tail, behind everything: from the base of the back, streaming, ending in a curl
  {
    const tw = Math.sin(t * 2.2) * 8, T0 = [-10, 70];
    const pts = P.tail === 'stream' ? [T0, [-60, 140], [-150, 210 + tw], [-250, 230 + tw], [-330, 200], [-360, 150], [-330, 120], [-300, 140]]
      : P.tail === 'whirl' ? [T0, [40, 150], [140, 190 + tw], [230, 150], [250, 70], [210, 30], [170, 50], [180, 80]]
      : [T0, [-90, 90], [-150, 20], [-150, -80], [-110, -120], [-80, -100], [-90, -70]];
    limb(c, pts, [30, 28, 26, 24, 22, 20, 18, 14], S.fur);
    limb(c, pts.map(([x, y]) => [x + 4, y + 5]), [12, 12, 11, 10, 9, 8, 7, 5], rgba(S.furSh, .55));
  }
  const lim = (sh, a, b, l1, l2, w, s) => {
    const ch = chain(sh, a, l1, b, l2);
    limb(c, ch, w, S.fur);
    limb(c, ch.map(([x, y]) => [x + 5 * s, y + 6]), w.map(v => v * .4), rgba(S.furSh, .55));
    return ch;
  };
  // ---- the far leg and arm (screen-left side, drawn first, a touch darker)
  const hip = s => [s * 34, 66], shoulder = s => [s * 56, -50];
  const foot = (p, a, s) => { c.save(); c.translate(p[0], p[1]); c.rotate(a + Math.PI / 2); const f = ellP(0, 10, 24, 36); fillPath(c, f, S.face); shade(c, f, 10, -10, -16, 40, S.faceSh, .8); for (const k of [-12, -2, 8]) ellipse(c, k, 40, 7, 9, S.face); c.restore(); };
  const hand = (p, a, s) => { c.save(); c.translate(p[0], p[1]); c.rotate(a); const h = ellP(16, 0, 27, 23); fillPath(c, h, S.face); shade(c, h, 16, -20, 16, 24, S.faceSh, .7); ellipse(c, 8, -20 * s, 10, 8, S.face, .5); strokePath(c, `M 30 -8 L 40 -6 M 31 4 L 42 5`, rgba(S.faceSh, .9), 2.4); c.restore(); };
  const legF = lim(hip(-1), legs[0][0], legs[0][1], 66, 62, [50, 44, 36], -1); ellipse(c, ...legF[2], 22, 9, S.gold, legs[0][0] + legs[0][1]); foot(legF[2], legs[0][0] + legs[0][1], -1);
  const armF = lim(shoulder(-1), arms[0][0], arms[0][1], 58, 56, [42, 36, 32], -1); ellipse(c, ...armF[2], 18, 18, S.gold); hand(armF[2], arms[0][0] + arms[0][1], -1);
  // ---- torso
  const TORSO = 'M 0 -84 C 46 -84 74 -56 78 -14 C 82 34 66 82 30 96 C 12 102 -12 102 -30 96 C -66 82 -82 34 -78 -14 C -74 -56 -46 -84 0 -84 Z';
  fillPath(c, TORSO, S.fur);
  const BELLY = ellP(4, 18, 50, 60);
  inside(c, TORSO, () => { fillPath(c, BELLY, S.face); shade(c, BELLY, 30, -30, -40, 70, S.faceSh, .7); });
  shade(c, TORSO, 40, -60, -70, 70, S.furDk, .55);
  // the langot and its gold waistband
  const LANG = 'M -70 46 C -40 58 40 58 70 46 C 66 72 50 92 30 98 L 8 104 L -8 104 L -30 98 C -50 92 -66 72 -70 46 Z';
  fillPath(c, LANG, S.langot); shade(c, LANG, 30, 50, -50, 100, S.langotSh, .8);
  limb(c, [[-72, 46], [0, 60], [72, 46]], [14, 14, 14], S.gold, false); limb(c, [[-72, 43], [0, 56], [72, 43]], [4, 4, 4], S.goldLt, false);
  ellipse(c, 0, 60, 9, 9, S.langotSh); ellipse(c, 0, 60, 5, 5, S.gold);
  // the munja (sacred) thread over the left shoulder
  strokePath(c, 'M 46 -72 C 20 -30 -20 10 -60 44', S.thread, 4.5);
  strokePath(c, 'M 46 -72 C 20 -30 -20 10 -60 44', rgba(S.goldSh, .3), 1.2);
  // a gold necklace with a pendant
  strokePath(c, 'M -40 -70 C -22 -48 22 -48 40 -70', S.gold, 6); ellipse(c, 0, -50, 9, 11, S.gold); ellipse(c, 0, -50, 5, 6, S.tilak);
  // ---- the near leg
  const legN = lim(hip(1), legs[1][0], legs[1][1], 66, 62, [52, 46, 38], 1); ellipse(c, ...legN[2], 23, 9, S.gold, legs[1][0] + legs[1][1]); foot(legN[2], legs[1][0] + legs[1][1], 1);
  // ---- the head (it turns on the neck by P.head)
  c.save(); c.translate(0, -84); c.rotate(o.headRot ?? P.head); c.translate(0, 84);
  kidHanumanHead(c, o);
  c.restore();
  // ---- the near arm, last
  const armN = lim(shoulder(1), arms[1][0], arms[1][1], 58, 56, [44, 38, 34], 1); ellipse(c, ...armN[2], 19, 19, S.gold); hand(armN[2], arms[1][0] + arms[1][1], 1);
  c.restore();
}
function kidHanumanHead(c, o = {}) {
  const S = KID, t = o.t || 0, hy = -186, lk = o.look || [0, 0], mo = o.mouth || 'aah', dz = o.eyes === 'dizzy';
  // ears
  for (const s of [-1, 1]) { const E = ellP(s * 104, hy + 8, 32, 36); fillPath(c, E, S.fur); fillPath(c, ellP(s * 106, hy + 10, 19, 23), S.face); shade(c, E, s * 90, hy, s * 130, hy + 30, S.furDk, .5); }
  // the head: round, with fur tufts at the cheeks
  const H = new Path2D(); H.arc(0, hy, 102, 0, TAU);
  for (const s of [-1, 1]) for (let i = 0; i < 3; i++) { const a = s > 0 ? .25 + i * .22 : Math.PI - .25 - i * .22; H.moveTo(Math.cos(a) * 92, hy + Math.sin(a) * 92); H.lineTo(Math.cos(a + s * .12) * 120, hy + Math.sin(a + s * .12) * 120); H.lineTo(Math.cos(a + s * .22) * 96, hy + Math.sin(a + s * .22) * 96); H.closePath(); }
  fillPath(c, H, S.fur);
  radialShade(c, H, 30, hy - 40, 50, 150, S.furDk, .55);
  // the curly tuft on top
  limb(c, [[-6, hy - 96], [-4, hy - 128], [18, hy - 146], [36, hy - 132], [28, hy - 114], [14, hy - 122]], [34, 26, 20, 16, 12, 8], S.fur);
  limb(c, [[-6, hy - 96], [-4, hy - 128], [18, hy - 146]], [10, 8, 6], rgba(S.furLt, .7));
  // the peach face: two eye lobes and the muzzle, as one shape
  const F = new Path2D(); F.addPath(ellP(-38, hy - 6, 44, 46)); F.addPath(ellP(38, hy - 6, 44, 46)); F.addPath(ellP(0, hy + 48, 70, 52));
  fillPath(c, F, S.face);
  shade(c, F, 20, hy - 30, -60, hy + 80, S.faceSh, .65);
  // a soft forehead highlight on the fur
  ellipse(c, -30, hy - 74, 34, 14, rgba(S.furLt, .45), -.2);
  // brows: little fur arcs
  for (const s of [-1, 1]) strokePath(c, `M ${s * 20} ${hy - 58} Q ${s * 40} ${hy - 72} ${s * 60} ${hy - 62}`, rgba(S.furDk, .85), 6);
  // the sindoor tilak and a kajal dot
  fillPath(c, `M 0 ${hy - 92} C 8 ${hy - 78} 8 ${hy - 62} 0 ${hy - 52} C -8 ${hy - 62} -8 ${hy - 78} 0 ${hy - 92} Z`, S.tilak);
  ellipse(c, -70, hy - 46, 6, 6, '#2A1A14');
  // eyes: big, glossy
  for (const s of [-1, 1]) {
    const ex = s * 38, ey = hy - 6;
    if (dz) {
      fillPath(c, ellP(ex, ey, 24, 26), S.eyeW);
      let d = ''; for (let i = 0; i <= 28; i++) { const a = i / 28 * TAU * 2.2 * s + t, r = 3 + i * .65; d += (i ? ' L ' : 'M ') + (ex + Math.cos(a) * r) + ' ' + (ey + Math.sin(a) * r); }
      strokePath(c, d, S.eye, 3.4);
      strokePath(c, `M ${ex - 26} ${ey - 10} Q ${ex} ${ey - 32} ${ex + 26} ${ey - 10}`, S.lid, 4);
      continue;
    }
    const EW = ellP(ex, ey, 25, 30);
    fillPath(c, EW, S.eyeW);
    inside(c, EW, () => {
      const ix = ex + lk[0] * 7, iy = ey + 3 + lk[1] * 6;
      ellipse(c, ix, iy, 19, 23, S.eye); ellipse(c, ix, iy + 4, 13, 15, mixCol(S.eye, '#7A4A2A', .45)); ellipse(c, ix, iy, 9, 10, '#120A06');
      ellipse(c, ix - 7, iy - 9, 7, 8, '#FFFFFF'); ellipse(c, ix + 7, iy + 9, 3.2, 3.2, '#FFFFFF');
      shade(c, EW, ex, ey + 10, ex, ey - 30, S.lid, .25);
    });
    strokePath(c, `M ${ex - 26} ${ey - 2} Q ${ex} ${ey - 40} ${ex + 26} ${ey - 2}`, S.lid, 4.4);
    strokePath(c, `M ${ex + s * 22} ${ey - 16} l ${s * 9} -7`, S.lid, 3);
  }
  // cheeks
  for (const s of [-1, 1]) ellipse(c, s * 62, hy + 34, 18, 11, rgba(S.blush, .6));
  // the nose: a soft bump and two nostrils
  ellipse(c, 0, hy + 22, 16, 9, rgba(S.faceSh, .55));
  for (const s of [-1, 1]) ellipse(c, s * 7, hy + 24, 4.2, 3.2, '#5A2E20');
  // the mouth
  if (mo === 'aah') {
    const M = `M -30 ${hy + 52} C -26 ${hy + 92} 26 ${hy + 92} 30 ${hy + 52} C 14 ${hy + 58} -14 ${hy + 58} -30 ${hy + 52} Z`;
    fillPath(c, M, S.mouth); inside(c, M, () => ellipse(c, 0, hy + 88, 20, 14, S.tongue));
    fillPath(c, `M -22 ${hy + 54} C -12 ${hy + 60} 12 ${hy + 60} 22 ${hy + 54} L 20 ${hy + 60} C 10 ${hy + 64} -10 ${hy + 64} -20 ${hy + 60} Z`, '#FFFDF6');
  } else if (mo === 'wail') {
    const M = ellP(0, hy + 70, 22, 26);
    fillPath(c, M, S.mouth); inside(c, M, () => ellipse(c, 0, hy + 92, 16, 12, S.tongue));
  } else strokePath(c, `M -24 ${hy + 58} Q 0 ${hy + 78} 24 ${hy + 58}`, S.mouth, 5);
  // the chin the vajra struck: a pink swelling on his left jaw
  if (o.jaw) { const J = ellP(-54, hy + 70, 26 * o.jaw, 20 * o.jaw); fillPath(c, J, '#F2A090'); shade(c, J, -60, hy + 56, -40, hy + 88, '#C86A5A', .6); ellipse(c, -60, hy + 62, 7, 4, rgba('#FFFFFF', .6)); }
  // gold kundals
  for (const s of [-1, 1]) { const kx = s * 108 + Math.sin(t * 2 + s) * 1.5, ky = hy + 48; strokePath(c, new Path2D(`M ${kx + 14} ${ky} A 14 14 0 1 1 ${kx + 13.9} ${ky - 1}`), S.gold, 6); ellipse(c, kx, ky + 15, 4, 4, S.goldLt); }
}

// ---------------- Airavata ----------------
const AIR = { body: '#F3EFEA', sh: '#CFC6C0', dk: '#A69C97', lt: '#FFFFFF', ear: '#EEDAD6', earIn: '#F2B6B4', tusk: '#FFF6E0', tuskSh: '#D8C8A4',
  cloth: '#C8283A', clothSh: '#8E1A28', clothLt: '#E8505E', gold: '#F2BE3E', goldSh: '#B88420', goldLt: '#FFE69A', ruby: '#C81E2A', emerald: '#1E8A5A', eye: '#2A1A14', mouth: '#E8908E' };
const airavataSeat = () => [230, -800];
function airavataK(c, o = {}) {
  const A = AIR, t = o.t || 0, tr = o.trunk ?? 1, fl = Math.sin((o.ear ?? t) * 1.6) * .06;
  const tusk = (x, y, k, far) => { const P = [[x, y], [x - 60 * k, y + 46 * k], [x - 150 * k, y + 40 * k], [x - 210 * k, y - 20 * k]]; limb(c, P, [40 * k, 34 * k, 24 * k, 8], far ? A.tuskSh : A.tusk); if (!far) limb(c, P.map(([a, b]) => [a + 3, b + 8]), [12 * k, 11 * k, 8 * k, 2], rgba(A.tuskSh, .8)); ellipse(c, x - 6 * k, y + 4, 24 * k, 18 * k, A.gold); ellipse(c, x - 6 * k, y + 4, 10 * k, 8 * k, A.ruby); };
  // far tusks (behind the trunk)
  tusk(-330, -380, .86, true); tusk(-290, -350, .74, true);
  // the legs (the clouds hide their feet)
  for (const [x, w, col] of [[470, 160, A.sh], [-60, 160, A.sh]]) fillPath(c, `M ${x - w / 2} -260 L ${x - w / 2 + 6} 40 L ${x + w / 2 - 6} 40 L ${x + w / 2} -260 Z`, col);
  const BODY = 'M -150 -560 C -100 -720 40 -800 240 -800 C 430 -800 560 -720 600 -560 C 630 -440 610 -300 560 -220 C 420 -170 120 -170 -60 -200 C -150 -240 -200 -400 -150 -560 Z';
  fillPath(c, BODY, A.body);
  shade(c, BODY, 220, -780, 220, -170, A.sh, .9); shade(c, BODY, 100, -500, 640, -400, A.dk, .35);
  for (const [x, w] of [[390, 175], [80, 180]]) { const L = `M ${x - w / 2} -300 C ${x - w / 2} -180 ${x - w / 2 + 4} -60 ${x - w / 2 + 8} 40 L ${x + w / 2 - 8} 40 C ${x + w / 2 - 4} -60 ${x + w / 2} -180 ${x + w / 2} -300 Z`; fillPath(c, L, A.body); shade(c, L, x - w / 2, -100, x + w / 2, -100, A.sh, .7); }
  // the caparison over the back: red with a gold border, jewels and tassels
  const CL = 'M 40 -770 C 140 -810 330 -810 470 -770 C 510 -670 520 -530 510 -400 C 390 -380 170 -380 60 -400 C 40 -530 30 -670 40 -770 Z';
  fillPath(c, CL, A.cloth); shade(c, CL, 260, -770, 280, -400, A.clothSh, .75);
  inside(c, CL, () => { for (let i = 0; i < 5; i++) { const x = 100 + i * 90; fillPath(c, `M ${x} -650 l 24 32 l -24 32 l -24 -32 Z`, rgba(A.gold, .95)); ellipse(c, x, -618, 7, 7, i % 2 ? A.emerald : A.ruby); } strokePath(c, 'M 40 -720 C 160 -750 340 -750 480 -720', rgba(A.gold, .8), 6); });
  limb(c, [[60, -404], [280, -384], [510, -404]], [22, 22, 22], A.gold, false); limb(c, [[60, -404], [280, -384], [510, -404]], [6, 6, 6], A.goldLt, false);
  for (let i = 0; i < 9; i++) { const x = 80 + i * 54, y = -386 + Math.sin(i / 8 * Math.PI) * 6; strokePath(c, `M ${x} ${y} L ${x + Math.sin(t * 2 + i) * 3} ${y + 32}`, A.gold, 4); ellipse(c, x + Math.sin(t * 2 + i) * 3, y + 40, 8, 11, A.ruby); }
  fillPath(c, 'M 120 -800 C 160 -840 300 -840 340 -800 L 330 -766 C 270 -780 190 -780 130 -766 Z', A.clothSh);
  limb(c, [[110, -796], [230, -822], [350, -796]], [16, 16, 16], A.gold, false);
  // the ear, behind the head: a big rounded flap, pink inside
  c.save(); c.translate(-90, -700); c.rotate(fl);
  const EAR = 'M 0 0 C 70 -50 200 -40 236 70 C 270 190 214 330 106 376 C 36 400 -12 352 -12 282 C -12 188 -36 94 0 0 Z';
  fillPath(c, EAR, A.ear); fillPath(c, 'M 26 36 C 84 0 176 12 200 94 C 222 188 176 292 106 328 C 58 340 36 306 34 258 C 30 176 12 106 26 36 Z', A.earIn);
  shade(c, EAR, 190, 40, 20, 360, A.dk, .4);
  c.restore();
  // the head: big, two domes on top, full cheeks
  const HEAD = 'M -470 -560 C -490 -700 -420 -840 -290 -870 C -220 -886 -150 -870 -104 -836 C -40 -790 -14 -700 -24 -600 C -34 -490 -100 -400 -200 -372 C -310 -344 -440 -400 -470 -560 Z';
  fillPath(c, HEAD, A.body);
  shade(c, HEAD, -230, -860, -280, -370, A.sh, .75); radialShade(c, HEAD, -300, -740, 60, 320, A.sh, .3);
  ellipse(c, -320, -820, 80, 32, rgba(A.lt, .8), -.3); ellipse(c, -180, -830, 50, 22, rgba(A.lt, .6), .2);
  strokePath(c, 'M -230 -884 C -236 -850 -240 -816 -236 -790', rgba(A.dk, .45), 5);   // the cleft between the domes
  // the head ornament: a gold plate down the forehead with a ruby, gold chains
  fillPath(c, 'M -314 -800 C -290 -752 -292 -694 -324 -646 C -356 -694 -358 -752 -334 -800 Z', A.gold);
  ellipse(c, -324, -704, 15, 18, A.ruby); ellipse(c, -328, -710, 5, 5, '#FFB0A0');
  for (const k of [0, 1, 2]) strokePath(c, `M -200 ${-820 + k * 34} C -240 ${-776 + k * 34} -280 ${-756 + k * 34} -320 ${-758 + k * 34}`, A.gold, 4.5);
  for (const k of [0, 1, 2]) ellipse(c, -230 + k * 6, -790 + k * 34, 6, 6, A.goldLt);
  // the eye: kind, with lashes
  const ex = -340, ey = -620;
  ellipse(c, ex, ey, 40, 34, '#FFFDF6'); ellipse(c, ex - 6, ey + 3, 26, 28, A.eye); ellipse(c, ex - 6, ey + 6, 16, 17, '#5A3A2A'); ellipse(c, ex - 14, ey - 8, 9, 9, '#FFFFFF'); ellipse(c, ex + 2, ey + 14, 4, 4, '#FFFFFF');
  strokePath(c, `M ${ex - 46} ${ey - 2} Q ${ex - 4} ${ey - 46} ${ex + 44} ${ey - 8}`, '#6A5A54', 6.5);
  for (const k of [-.6, 0, .6]) strokePath(c, `M ${ex + k * 40} ${ey - 30 + Math.abs(k) * 12} l ${k * 9 - 4} -18`, '#6A5A54', 4);
  strokePath(c, `M ${ex - 44} ${ey - 46} Q ${ex - 5} ${ey - 68} ${ex + 34} ${ey - 50}`, rgba(A.dk, .5), 3.5);
  // the mouth: a smile under the trunk's root
  fillPath(c, 'M -420 -440 C -390 -396 -320 -390 -280 -424 C -320 -412 -380 -414 -420 -440 Z', A.mouth);
  // the trunk: thick at the root, down, forward and up in a trumpeting curl
  const k = tr;
  const TP = [[-410, -540], [-450, -440], [-500, -370 + k * 10], [-580, -360 - k * 30], [-650, -420 - k * 70], [-680, -520 - k * 100], [-660, -600 - k * 110], [-620, -610 - k * 100]];
  figure(c, (c) => {
  limb(c, TP, [170, 150, 122, 100, 82, 66, 52, 40], A.body);
  limb(c, TP.map(([a, b]) => [a + 14, b + 16]), [60, 54, 46, 38, 30, 24, 18, 12], rgba(A.sh, .8));
  const TC = through(TP, 8);
  for (let i = 5; i < TC.length - 5; i += 4) { const [a, b] = TC[i], [a2, b2] = TC[i + 1], dx = a2 - a, dy = b2 - b, d = Math.hypot(dx, dy) || 1, w = lerp(70, 24, i / TC.length); strokePath(c, `M ${a - dy / d * w} ${b + dx / d * w} Q ${a + dx / d * 8} ${b + dy / d * 8} ${a + dy / d * w} ${b - dx / d * w}`, rgba(A.dk, .4), 3); }
  ellipse(c, ...TP[TP.length - 1], 14, 10, rgba(A.earIn, .9));
  }, { edge: { col: '#8E807A', w: 3, a: .55 } });
  // the near tusks, over the trunk's root, capped in gold
  tusk(-300, -410, 1.15, false); tusk(-250, -378, 1, false);
}

// ---------------- Indra ----------------
const INDRA_PAL = { skin: '#EEC49A', skinSh: '#D19A6C', skinDk: '#9A6440', palm: '#F6D6B2', lip: '#A0503E', lipLo: '#C06A52', hair: '#1E140F', hairLt: '#3A2A20' };
function withPal(base, pal, f) { const keep = { ...base }; Object.assign(base, pal); try { f(); } finally { Object.assign(base, keep); } }
function indraK(c, o = {}) {
  const t = o.t || 0, S = SUR, P = INDRA_PAL, br = Math.sin(t * 1.4) * 1.2;
  withPal(SUR, P, () => {
    // hair behind the shoulders
    fillPath(c, 'M -50 -874 C -80 -850 -96 -800 -98 -740 L -86 -690 L 86 -690 L 98 -740 C 96 -800 80 -850 50 -874 Z', S.hair);
    // the left arm, behind the body, resting forward on the seat rail
    figure(c, (a) => { limb(a, [[-138, -680], [-178, -590], [-140, -510]], [60, 50, 44], S.skin); limb(a, [[-146, -676], [-186, -590], [-150, -520]], [22, 18, 14], rgba(S.skinSh, .9)); ellipse(a, -176, -600, 28, 8, S.gold, -.3); ellipse(a, -136, -500, 26, 22, S.skin); }, o.armFx || {});
    // torso: bare, a blue uttariya across, gold necklaces
    const TORSO = `M -84 -478 C -92 -540 -114 -600 -124 -642 C -132 -668 -140 -690 -150 -700 C -116 -720 -64 ${-722 + br} -27 -728 L 27 -728 C 64 ${-722 + br} 116 -720 150 -700 C 140 -690 132 -668 124 -642 C 114 -600 92 -540 84 -478 Z`;
    fillPath(c, TORSO, S.skin);
    shade(c, TORSO, 60, -700, -130, -520, S.skinSh, .8);
    inside(c, TORSO, () => { for (const s of [-1, 1]) strokePath(c, `M ${s * 110} ${-640 + br} C ${s * 80} ${-612 + br} ${s * 40} ${-606 + br} ${s * 8} ${-618 + br}`, rgba(S.skinSh, .8), 3); strokePath(c, 'M 0 -600 L 0 -500', rgba(S.skinSh, .6), 2.5); });
    const UT = 'M 150 -700 C 110 -660 40 -600 -20 -540 C -60 -500 -90 -484 -96 -478 L -60 -470 C -10 -510 60 -580 130 -640 C 146 -654 156 -680 150 -700 Z';
    fillPath(c, UT, '#3E7EC8'); shade(c, UT, 120, -680, -60, -480, '#1E4E8E', .7);
    strokePath(c, 'M 150 -700 C 110 -660 40 -600 -20 -540 C -60 -500 -90 -484 -96 -478', '#F2BE3E', 4);
    for (let r = 0; r < 2; r++) for (let i = 0; i <= 18; i++) { const u = i / 18, x = lerp(-38 - r * 10, 38 + r * 10, u), y = -722 + Math.pow(Math.sin(u * Math.PI), .8) * (38 + r * 30) + br; ellipse(c, x, y, 4.5 - r, 4.5 - r, r ? S.goldLt : S.gold); }
    ellipse(c, 0, -658 + br, 12, 14, S.gold); ellipse(c, 0, -658 + br, 7, 8, '#2E6EC8');
    // the waist: a gold belt over a white dhoti top (the seat hides the rest)
    fillPath(c, 'M -92 -500 Q 0 -488 92 -500 L 96 -440 Q 0 -428 -96 -440 Z', '#FFF4E6'); fillPath(c, 'M -90 -500 Q 0 -488 90 -500 L 88 -476 Q 0 -464 -88 -476 Z', S.gold);
    ellipse(c, 0, -482, 13, 11, S.ruby);
    suryaHead(c, { t, look: o.look || [-.6, .2], light: 1 });
    for (const s of [-1, 1]) { fillPath(c, `M ${s * 108} -722 C ${s * 140} -730 ${s * 168} -714 ${s * 176} -684 C ${s * 156} -694 ${s * 130} -696 ${s * 112} -692 Z`, S.gold); }
    // the right arm, raised high with the vajra
    figure(c, (a) => {
      limb(a, [[140, -690], [212, -770], [236, -880]], [62, 52, 44], S.skin); limb(a, [[150, -690], [222, -770], [246, -876]], [20, 16, 12], rgba(S.skinSh, .7));
      ellipse(a, 214, -770, 28, 8, S.gold, .9); ellipse(a, 236, -856, 20, 6, S.gold, .2);
      if (o.vajra !== false) vajraK(a, 240, -930, .95, -.25);
      if (o.vajra !== false) { fillPath(a, 'M 214 -880 C 210 -900 218 -918 236 -920 C 254 -918 262 -900 258 -880 C 252 -866 220 -866 214 -880 Z', S.skin); for (let i = 0; i < 3; i++) strokePath(a, `M ${218} ${-900 + i * 9} L ${254} ${-900 + i * 9}`, rgba(S.skinSh, .9), 1.8); }
      else { fillPath(a, 'M 216 -876 C 206 -900 206 -930 214 -956 C 220 -970 232 -968 232 -952 L 236 -972 C 240 -984 254 -982 254 -968 L 256 -950 C 262 -962 274 -958 272 -944 L 268 -900 C 280 -912 292 -904 286 -890 C 276 -872 266 -862 250 -860 C 236 -858 222 -864 216 -876 Z', S.skin); strokePath(a, 'M 226 -900 C 236 -896 250 -896 262 -902', rgba(S.skinSh, .9), 2); }
    }, o.armFx || {});
  });
}
// the vajra: a grip with a gold ring, and at each end three curved prongs closing to a point
function vajraK(c, x, y, s = 1, a = 0) {
  const G = AIR.gold, Gs = AIR.goldSh, Gl = AIR.goldLt;
  c.save(); c.translate(x, y); c.rotate(a); c.scale(s, s);
  fillPath(c, 'M -14 -30 L 14 -30 L 12 30 L -12 30 Z', Gs);
  for (const k of [-1, 1]) {
    c.save(); c.scale(1, k);
    ellipse(c, 0, 34, 22, 12, G); ellipse(c, 0, 34, 10, 6, AIR.ruby);
    fillPath(c, 'M -20 44 C -60 70 -60 110 -6 140 L 0 150 L 6 140 C 60 110 60 70 20 44 Z', G);
    fillPath(c, 'M -8 44 C -26 70 -24 110 -2 136 L 2 136 C 24 110 26 70 8 44 Z', Gl);
    fillPath(c, 'M -3 44 L 3 44 L 2 152 L -2 152 Z', Gs);
    c.restore();
  }
  c.restore();
}

// ---------------- foliage ----------------
function canopy(c, x, y, w, seed, cols = ['#3E7A3A', '#5E9E48', '#9CCB5E'], a = 1, flip = false) { cloud(c, x, y, w, seed + 500, cols, a, flip); }
function kidTree(c, x, y, h, seed, o = {}) {
  const tw = h * .09, lean = o.lean || 0;
  limb(c, [[x, y], [x + lean * .4, y - h * .4], [x + lean, y - h * .78]], [tw * 1.5, tw, tw * .8], o.bark || '#6A4428');
  limb(c, [[x + tw * .3, y], [x + lean * .4 + tw * .3, y - h * .4], [x + lean + tw * .2, y - h * .78]], [tw * .5, tw * .35, tw * .2], rgba('#3A2414', .5));
  for (let i = 0; i < 3; i++) canopy(c, x + lean + (i - 1) * h * .26, y - h * (.82 + (i === 1 ? .16 : 0)), h * (.9 - (i === 1 ? 0 : .2)), seed + i, o.cols, 1, i % 2 === 1);
}

// A leafy crown, painted: lumps in one shape, lit from (lx, ly) (a unit direction), with lit leaf clusters on the light
// side, darker pockets on the far side and a sprinkle of leaves. r is its radius; seed varies the lumps.
function leafCrown(c, x, y, r, seed, o = {}) {
  const cols = o.cols || ['#2F6A34', '#4E8E40', '#86BE52', '#B8DE74'], [lx, ly] = o.light || [.6, -.8], rnd = lcg(seed * 13 + 7);
  const lumps = []; const n = 9 + Math.floor(rnd() * 4);
  for (let i = 0; i < n; i++) { const a = i / n * TAU + rnd() * .4, d = r * (.55 + rnd() * .2); lumps.push([x + Math.cos(a) * d, y + Math.sin(a) * d * .82, r * (.36 + rnd() * .16)]); }
  lumps.push([x, y, r * .7]);
  const P = new Path2D(); for (const [a, b, q] of lumps) { P.moveTo(a + q, b); P.arc(a, b, q, 0, TAU); }
  fillPath(c, P, cols[1]);
  inside(c, P, () => {
    const g = c.createLinearGradient(x + lx * r, y + ly * r, x - lx * r, y - ly * r); g.addColorStop(0, rgba(cols[2], .9)); g.addColorStop(.5, rgba(cols[1], 0)); g.addColorStop(1, rgba(cols[0], .95));
    c.fillStyle = g; c.fillRect(x - r * 2, y - r * 2, r * 4, r * 4);
    // lit clusters toward the light, dark pockets away from it
    for (const [a, b, q] of lumps) { ellipse(c, a + lx * q * .35, b + ly * q * .35, q * .62, q * .5, rgba(cols[2], .55)); ellipse(c, a + lx * q * .5, b + ly * q * .5, q * .3, q * .22, rgba(cols[3], .5)); ellipse(c, a - lx * q * .7, b - ly * q * .7, q * .45, q * .3, rgba(cols[0], .35)); }
    for (let i = 0; i < 40; i++) { const a = rnd() * TAU, d = rnd() * r * 1.1, px = x + Math.cos(a) * d, py = y + Math.sin(a) * d * .82, lit = (Math.cos(a) * lx + Math.sin(a) * ly) > 0; ellipse(c, px, py, r * .05, r * .03, rgba(lit ? cols[3] : cols[0], .6), rnd() * 3); }
  });
}
function leafTree(c, x, y, h, seed, o = {}) {
  const tw = h * .07, lean = o.lean || 0, bark = o.bark || '#6A4428';
  const top = [x + lean, y - h * .62];
  limb(c, [[x, y], [x + lean * .4, y - h * .3], top], [tw * 1.8, tw * 1.1, tw * .8], bark);
  limb(c, [[x + tw * .4, y], [x + lean * .4 + tw * .3, y - h * .3], [top[0] + tw * .2, top[1]]], [tw * .6, tw * .4, tw * .25], rgba('#3A2414', .45));
  for (const [dx, dy, l] of [[-1, -.2, .3], [1, -.35, .28]]) limb(c, [[x + lean * .5, y - h * .45], [x + lean * .5 + dx * h * l, y - h * (.45 - dy * .3) - h * .1]], [tw * .7, tw * .3], bark);
  const R = h * .3;
  [[-.55, .05, .7], [.6, .02, .68], [0, -.42, .75], [-.3, -.18, .8], [.32, -.2, .8]].forEach(([dx, dy, k], i) => leafCrown(c, top[0] + dx * R, top[1] + dy * R, R * k, seed + i, o));
}
// A puffy cloud: round lumps in one shape, a gradient from a lit top to a warm underside, soft highlights on the lumps.
function puff(c, x, y, w, seed, o = {}) {
  const rnd = lcg(seed * 31 + 5), n = 6 + Math.floor(rnd() * 4), h = w * .32, lumps = [];
  for (let i = 0; i < n; i++) { const u = (i + .5) / n, r = w * (.11 + rnd() * .09) * (1 - Math.abs(u - .5) * .9); lumps.push([x - w / 2 + u * w, y - r * .5 - rnd() * h * .3 * (1 - Math.abs(u - .5) * 1.6), r]); }
  for (let i = 0; i < 4; i++) lumps.push([x - w * .35 + rnd() * w * .7, y + h * .05, w * (.08 + rnd() * .05)]);
  const P = new Path2D(); for (const [a, b, r] of lumps) { P.moveTo(a + r, b); P.arc(a, b, r, 0, TAU); }
  const top = o.top || '#FFFDF8', bot = o.bot || '#F2C6B4', a = o.a ?? 1;
  c.save(); c.globalAlpha *= a;
  inside(c, P, () => {
    const g = c.createLinearGradient(0, y - h, 0, y + h * .3); g.addColorStop(0, top); g.addColorStop(.6, mixCol(top, bot, .35)); g.addColorStop(1, bot);
    c.fillStyle = g; c.fillRect(x - w, y - h * 2, w * 2, h * 3);
    for (const [lx, ly, r] of lumps) { const gg = c.createRadialGradient(lx - r * .3, ly - r * .45, 0, lx - r * .3, ly - r * .45, r * .9); gg.addColorStop(0, rgba('#FFFFFF', .75)); gg.addColorStop(1, rgba('#FFFFFF', 0)); c.fillStyle = gg; c.fillRect(lx - r * 1.3, ly - r * 1.5, r * 2.6, r * 2.6); }
  });
  c.restore();
}
