// ashwatthama_cast.js: the cast of CHIRANJEEVI Issue 1 for the Cinematic engine (cine.js), drawn for comic panels.
// Needs cine_surya.js (suryaHead) and cine_yama.js (withSur). Units as the Cinematic cast: a head centred at (0, -815).
//
//   ashHead(c, o)       Ashwatthama's head: suryaHead in his colours, hair in a warrior's knot, no crown, the gem
//                       (o.gem 0..1 how bright; false = gone) in place of a tilak. o: eyes, look, fierce, pain, mouth, t.
//   ashBust(c, o)       his head and shoulders in dark armour with a red uttariya (draw inside figure()).
//   ashGemGlow(c, a)    the gem's light, drawn AFTER figure() with the same transform (glows aren't tinted).
//   ashSit(c, o)        a small seated silhouette, back to a trunk, knees up, the bow leaning (feet at 0, 0).
//   sleeper(c, o)       a man asleep on his side on the ground, head to the left (o.who 'kripa' | 'krita'), ~700 long.
//   crow(c, x, y, k, o) a crow asleep on a perch (side view facing o.dir), or o.fly (wings up, startled).
//   owlDive(c, o)       the owl front view, wings spread, talons forward (body centre at 0, 0; ~1100 wing to wing).
//   owlPerch(c, o)      the owl perched, wings folded, facing us (feet at 0, 0; ~420 tall).
//   owlTalon(c, o)      the owl's foot close: feathered shank, four toes, black claws; o.grip 0..1 closing.
//   owlEyes(c, x, y, k, a)  two glowing eyes in the dark.
//   banyan(c, o)        a banyan as a silhouette: a wide crown, hanging aerial roots, branches (o.col, o.seed).
//   branch(c, P, w, col) a branch along points P, tapering from w.
const ASH = {
  skin: '#C48A5E', skinSh: '#976044', skinDk: '#56301F', palm: '#E2B08A', lip: '#6A3022', lipLo: '#8E4430',
  hair: '#120D0F', hairLt: '#2E2226', eyeW: '#EDE3D2', iris: '#2A1A12', brow: '#120C0C', bead: '#120D0F', tilak: '#C81E2A',
  gold: '#D9A441', goldSh: '#8A5E1E', goldLt: '#FFE08A',
  armor: '#2C313D', armorSh: '#171A22', armorLt: '#4C5568', cloth: '#6A1F1C', clothSh: '#3E0F0E', gem: '#A8EEFF', gemDk: '#2E8FB8',
};
const OWL = { base: '#7E5228', dk: '#3B2310', lt: '#BE8C4E', disc: '#C79C62', discDk: '#8A6236', eye: '#E9C628', eyeRim: '#2A1A0A', pupil: '#070403', beak: '#2A2420', claw: '#121014', streak: '#2E1A0C' };
const CROW = { body: '#0C0C11', sheen: '#2C3346', beak: '#16161C' };

// ---------- Ashwatthama ----------
function ashGem(c, a = 1) {
  if (a === false) return;
  const P = 'M 0 -870 L 8 -857 L 0 -844 L -8 -857 Z';
  fillPath(c, P, ASH.gemDk); inside(c, P, () => { fillPath(c, 'M 0 -870 L 8 -857 L 0 -857 Z', ASH.gem); fillPath(c, 'M -8 -857 L 0 -844 L 0 -857 Z', mixCol(ASH.gem, ASH.gemDk, .4)); });
  strokePath(c, P, ASH.gold, 1.6);
  ellipse(c, -2, -862, 1.6, 2.4, '#FFFFFF');
}
function ashGemGlow(c, a = 1) {
  if (!a) return;
  glow(c, 0, -857, 70, '#7FD8FF', .55 * a); glow(c, 0, -857, 22, '#E8FBFF', .7 * a);
}
function ashHead(c, o = {}) {
  withSur(ASH, () => {
    // short hair behind the ears, down to the nape (no hanging locks)
    for (const k of [-1, 1]) fillPath(c, `M ${k * 40} -870 C ${k * 62} -850 ${k * 64} -800 ${k * 52} -770 C ${k * 46} -760 ${k * 40} -766 ${k * 40} -780 Z`, ASH.hair);
    suryaHead(c, { crown: false, bun: true, curls: false, kundala: 'ring', tilak: false, ...o });
  });
  // stubble along the jaw: a soldier's, not a sage's beard
  inside(c, SUR_FACE, () => fillPath(c, 'M -46 -790 C -40 -760 -20 -746 0 -746 C 20 -746 40 -760 46 -790 C 34 -770 18 -762 0 -762 C -18 -762 -34 -770 -46 -790 Z', rgba('#1A1010', .28)));
  // a short warrior's beard along the jaw (the mouth left clear) and a fuller moustache
  fillPath(c, 'M -47 -806 C -48 -772 -30 -742 0 -737 C 30 -742 48 -772 47 -806 C 42 -786 34 -770 22 -760 C 16 -767 8 -768 0 -767 C -8 -768 -16 -767 -22 -760 C -34 -770 -42 -786 -47 -806 Z', ASH.hair);
  for (const k of [-1, 1]) fillPath(c, `M 0 -781 C ${k * 10} -785 ${k * 22} -783 ${k * 27} -768 C ${k * 20} -774 ${k * 10} -776 0 -775 Z`, ASH.hair);
  if (o.gem !== false) ashGem(c, o.gem ?? 1);
}
function ashBust(c, o = {}) {
  const A = ASH, br = Math.sin((o.t || 0) * 1.4) * 2;
  // shoulders and armour
  const TOR = `M -230 -360 C -236 -470 -214 -600 -160 -650 C -120 -690 -70 -704 -34 -708 L 34 -708 C 70 -704 120 -690 160 -650 C 214 -600 236 -470 230 -360 Z`;
  fillPath(c, TOR, A.armor);
  inside(c, TOR, () => {
    fillPath(c, 'M -260 -720 L -110 -720 C -130 -620 -150 -520 -150 -360 L -260 -360 Z', A.armorSh);
    for (const s of [-1, 1]) {   // pauldrons: three lames each
      for (let i = 0; i < 3; i++) { const y = -640 + i * 34; fillPath(c, `M ${s * 120} ${y} C ${s * 170} ${y - 26} ${s * 226} ${y - 8} ${s * 240} ${y + 30} L ${s * 236} ${y + 46} C ${s * 214} ${y + 14} ${s * 170} ${y + 4} ${s * 124} ${y + 22} Z`, i % 2 ? A.armorLt : mixCol(A.armor, A.armorLt, .5)); strokePath(c, `M ${s * 124} ${y + 22} C ${s * 170} ${y + 4} ${s * 214} ${y + 14} ${s * 236} ${y + 46}`, A.goldSh, 3); }
    }
    // the breastplate's gold edge and a sun boss
    strokePath(c, 'M -110 -690 C -70 -620 70 -620 110 -690', A.gold, 6);
    ellipse(c, 0, -560 + br, 30, 30, A.goldSh); ellipse(c, 0, -560 + br, 22, 22, A.gold); ellipse(c, -6, -566 + br, 6, 6, A.goldLt);
    // the red uttariya over his left shoulder (screen right), across the chest
    const UT = `M 70 -700 C 140 -690 200 -650 230 -560 L 230 -470 C 140 -520 40 -470 -60 -380 L -140 -360 C -40 -470 40 -560 70 -700 Z`;
    fillPath(c, UT, A.cloth); inside(c, UT, () => { for (let i = 0; i < 4; i++) strokePath(c, `M ${90 + i * 30} -690 C ${60 + i * 30} -600 ${0 + i * 30} -500 ${-80 + i * 30} -390`, rgba(A.clothSh, .7), 5); });
  });
  // a gorget round the neck, gold-edged
  fillPath(c, 'M -52 -700 C -50 -726 -40 -740 -34 -742 L 34 -742 C 40 -740 50 -726 52 -700 C 30 -690 -30 -690 -52 -700 Z', A.armorSh);
  strokePath(c, 'M -50 -704 C -30 -694 30 -694 50 -704', A.gold, 4);
  ashHead(c, o);
  fillPath(c, 'M -40 -716 C -38 -734 -34 -744 -30 -748 L 30 -748 C 34 -744 38 -734 40 -716 C 20 -708 -20 -708 -40 -716 Z', A.armor);
  strokePath(c, 'M -40 -716 C -20 -708 20 -708 40 -716', A.gold, 3);
}
function ashSit(c, o = {}) {
  const col = o.col || '#0E0E16';
  // knees up, arms over the knees, the head up and awake; the bow leaning against the trunk beside him
  strokePath(c, 'M 160 -620 C 220 -420 220 -180 150 0', col, 10);   // bow
  strokePath(c, 'M 160 -620 L 150 0', rgba(col, .8), 2);
  fillPath(c, 'M -170 0 C -180 -120 -150 -220 -60 -250 L 120 -250 C 170 -250 190 -120 170 0 Z', col);   // seat and legs
  fillPath(c, 'M 20 -250 C 60 -340 120 -380 150 -330 C 170 -290 140 -250 110 -250 Z', col);   // knee
  fillPath(c, 'M -150 -240 C -170 -340 -140 -470 -70 -510 L 30 -510 C 70 -480 80 -400 60 -250 Z', col);   // torso, leaning back
  limb(c, [[20, -480], [110, -380], [150, -330]], [40, 30, 26], col);   // arm on the knee
  ellipse(c, -20, -560, 46, 54, col); ellipse(c, -24, -622, 26, 22, col);   // head and knot
}
function sleeper(c, o = {}) {
  // lying on his back, head to the left, face up in profile, knees drawn up a little, ~760 long, ground at y 0
  const col = o.col || '#11121A', who = o.who || 'kripa', br = Math.sin((o.t || 0) * 1.2) * 3;
  limb(c, [[60, -50], [250, -40], [400, -26]], [92, 70, 48], col);   // the far leg, straight
  fillPath(c, 'M 380 -60 C 420 -64 440 -40 436 -10 L 380 -6 Z', col);   // foot
  limb(c, [[50, -70], [220, -170], [330, -40]], [96, 70, 48], col);   // the near leg, knee up
  fillPath(c, 'M 316 -60 C 350 -66 372 -40 368 -8 L 310 -6 Z', col);
  // torso: shoulders, a chest that rises with breath, the belly, hips
  fillPath(c, `M -290 -8 C -300 -60 -280 -${104 + br} -230 -${118 + br} C -160 -${132 + br} -80 -${124 + br} -20 -${108 + br * .5} C 40 -96 90 -92 110 -60 C 120 -30 100 -6 70 0 L -280 0 Z`, col);
  // the arm across the chest, the far arm on the ground
  limb(c, [[-220, -112 - br], [-130, -150 - br], [-40, -128 - br * .6]], [46, 38, 30], col);
  ellipse(c, -30, -126 - br * .5, 22, 17, col);
  limb(c, [[-250, -30], [-150, -10], [-60, -6]], [40, 32, 24], col);
  // head in profile, face up: the back of the skull, forehead, nose, lips, chin
  fillPath(c, 'M -300 -30 C -300 -70 -320 -96 -350 -104 C -372 -110 -400 -100 -410 -76 C -424 -46 -414 -14 -390 -2 L -300 -2 Z', col);
  fillPath(c, 'M -350 -104 C -344 -112 -338 -116 -336 -128 L -326 -118 C -322 -112 -318 -110 -314 -106 C -316 -100 -310 -96 -308 -92 C -306 -88 -300 -86 -300 -80 L -300 -30 Z', col);
  if (who === 'kripa') {   // an old teacher: a knot of hair behind, a long beard over the throat
    ellipse(c, -420, -48, 30, 24, col);
    fillPath(c, 'M -300 -86 C -280 -84 -250 -70 -236 -46 C -250 -50 -270 -50 -286 -40 C -292 -60 -298 -70 -300 -86 Z', col);
  } else {   // Kritavarma: a warrior's turban; his helmet set down by his head
    fillPath(c, 'M -414 -70 C -420 -110 -380 -126 -346 -112 C -370 -104 -392 -92 -404 -60 Z', col);
    fillPath(c, 'M -520 0 C -526 -50 -470 -74 -440 -40 C -432 -22 -436 -8 -440 0 Z', col);
    strokePath(c, 'M -480 -64 L -482 -96', col, 6);
  }
  ellipse(c, 20, 6, 470, 16, rgba('#000000', .5));   // contact shadow
}

// ---------- crows ----------
function crow(c, x, y, k, o = {}) {
  const C = { ...CROW, ...(o.pal || {}) }, d = o.dir || 1;
  c.save(); c.translate(x, y); c.scale(k * d, k); c.rotate(o.rot || 0);
  if (o.fly) {
    const f = o.flap ?? .5;
    for (const s of [-1, 1]) fillPath(c, `M 0 -20 C ${s * 40} ${-60 - f * 60} ${s * 90} ${-90 - f * 80} ${s * 150} ${-80 - f * 120} C ${s * 120} ${-50 - f * 60} ${s * 90} -20 ${s * 30} 0 Z`, C.body);
    ellipse(c, 0, -10, 46, 22, C.body, -.2); ellipse(c, 44, -26, 18, 15, C.body); fillPath(c, 'M 58 -30 L 84 -24 L 58 -20 Z', C.beak);
    fillPath(c, 'M -40 -4 L -96 10 L -90 -14 Z', C.body);
  } else {
    fillPath(c, 'M -78 -26 C -70 -66 0 -84 44 -66 C 66 -56 70 -30 46 -10 C 16 8 -40 6 -78 -26 Z', C.body);   // body
    fillPath(c, 'M -70 -30 L -150 -4 L -146 -18 L -152 -26 L -72 -46 Z', C.body);   // the wedge tail
    if (o.tuck) ellipse(c, 40, -68, 26, 22, C.body);
    else {
      fillPath(c, 'M 30 -64 C 36 -96 70 -104 84 -86 C 90 -78 90 -70 86 -66 L 46 -50 Z', C.body);   // head up
      fillPath(c, 'M 82 -88 L 124 -78 C 112 -72 98 -70 84 -70 Z', C.beak);   // the heavy beak
      ellipse(c, 70, -86, 3, 3, rgba('#7A8AA8', .8));
    }
    strokePath(c, 'M -40 -62 C -6 -76 28 -72 50 -56', rgba(C.sheen, .9), 4);
    for (const lx of [-10, 12]) strokePath(c, `M ${lx} 0 L ${lx + 2} 16`, C.body, 4);
  }
  c.restore();
}

// ---------- the owl (an Indian eagle-owl: tawny, ear tufts, streaked breast, fierce yellow eyes) ----------
function owlFace(c, o = {}) {
  const P = { ...OWL, ...(o.pal || {}) };
  // head: broad and flat-topped, two long ear tufts swept out
  const HEAD = 'M -122 -40 C -144 -120 -132 -196 -102 -232 C -116 -270 -140 -306 -170 -340 C -110 -318 -72 -284 -46 -246 C -16 -254 16 -254 46 -246 C 72 -284 110 -318 170 -340 C 140 -306 116 -270 102 -232 C 132 -196 144 -120 122 -40 C 84 22 -84 22 -122 -40 Z';
  fillPath(c, HEAD, P.base);
  inside(c, HEAD, () => {
    for (let i = 0; i < 18; i++) { const x = -150 + i * 18; strokePath(c, `M ${x} -300 l 6 26`, rgba(P.dk, .7), 4); strokePath(c, `M ${x + 9} -250 l 5 20`, rgba(P.dk, .5), 3); }
  });
  // facial discs with a dark rim
  for (const s of [-1, 1]) {
    ellipse(c, s * 50, -118, 64, 66, P.disc);
    inside(c, (() => { const p = new Path2D(); p.ellipse(s * 50, -118, 64, 66, 0, 0, TAU); return p; })(), () => { for (let i = 0; i < 9; i++) { const a = -1.2 + i * .3; strokePath(c, `M ${s * 50 + Math.cos(a) * 34 * s} ${-118 + Math.sin(a) * 34} L ${s * 50 + Math.cos(a) * 62 * s} ${-118 + Math.sin(a) * 62}`, rgba(P.discDk, .5), 3); } });
    strokePath(c, `M ${s * 6} -176 C ${s * 76} -204 ${s * 126} -150 ${s * 112} -76 C ${s * 104} -40 ${s * 64} -30 ${s * 20} -48`, P.dk, 8);
  }
  // pale brows meeting in a V over the beak
  for (const s of [-1, 1]) fillPath(c, `M ${s * 4} -142 C ${s * 26} -180 ${s * 80} -196 ${s * 128} -178 C ${s * 86} -178 ${s * 44} -168 ${s * 12} -124 Z`, '#E4D2A6');
  // eyes: big orange-yellow irises under heavy lids slanting down to the beak (the glare)
  const op = o.eyes ?? 1;
  for (const s of [-1, 1]) {
    const ex = s * 48, ey = -116, R = 31;
    const EYE = (() => { const p = new Path2D(); p.ellipse(ex, ey, R, R * op, 0, 0, TAU); return p; })();
    fillPath(c, EYE, P.eye);
    inside(c, EYE, () => {
      glow(c, ex, ey + 8, R, '#FF8A10', .5, 'source-over');
      ellipse(c, ex + (o.look ? o.look[0] * 7 : 0), ey + 4 + (o.look ? o.look[1] * 6 : 0), 17, 18, P.pupil);
      ellipse(c, ex + 10, ey - 4, 5, 5, '#FFFBE8');
      // the lid: low at the inner corner (by the beak), high at the outer: a glare
      const yIn = ey + R * .05, yOut = ey - R * .6, yl = s > 0 ? yIn : yOut, yr = s > 0 ? yOut : yIn;
      fillPath(c, `M ${ex - R * 1.5} ${ey - R * 1.6} L ${ex + R * 1.5} ${ey - R * 1.6} L ${ex + R * 1.5} ${yr} L ${ex - R * 1.5} ${yl} Z`, P.dk);
    });
    { const yIn = ey + R * .05, yOut = ey - R * .6; strokePath(c, `M ${ex - s * R * 1.1} ${lerp(yIn, yOut, (1 - 1.1 / 1.5) / 2)} L ${ex + s * R * 1.1} ${lerp(yIn, yOut, 1 - (1 - 1.1 / 1.5) / 2)}`, P.eyeRim, 7); }
    c.save(); c.strokeStyle = P.eyeRim; c.lineWidth = 5; c.beginPath(); c.ellipse(ex, ey, R + 2, (R + 2) * op, 0, 0, TAU); c.stroke(); c.restore();
  }
  // the hooked beak
  fillPath(c, 'M -16 -110 C -14 -84 -6 -62 2 -40 C 8 -52 12 -62 12 -72 C 14 -84 14 -96 16 -110 C 6 -104 -6 -104 -16 -110 Z', P.beak);
  strokePath(c, 'M -10 -104 C -6 -86 -2 -64 2 -48', rgba('#6A6070', .6), 2);
}
function blade(c, x, y, a, len, w, col, bar) {
  const ca = Math.cos(a), sa = Math.sin(a), nx = -sa, ny = ca, tip = [x + ca * len, y + sa * len], m = [x + ca * len * .5, y + sa * len * .5];
  const p = `M ${x + nx * w / 2} ${y + ny * w / 2} Q ${m[0] + nx * w * .62} ${m[1] + ny * w * .62} ${tip[0]} ${tip[1]} Q ${m[0] - nx * w * .4} ${m[1] - ny * w * .4} ${x - nx * w / 2} ${y - ny * w / 2} Z`;
  fillPath(c, p, col);
  if (bar) inside(c, p, () => { for (let b = 1; b < 6; b++) { const u = b / 6; strokePath(c, `M ${x + ca * len * u + nx * w} ${y + sa * len * u + ny * w} L ${x + ca * len * (u + .04) - nx * w} ${y + sa * len * (u + .04) - ny * w}`, bar, w * .16); } });
  strokePath(c, `M ${x} ${y} Q ${m[0] + nx * w * .1} ${m[1] + ny * w * .1} ${tip[0]} ${tip[1]}`, rgba(bar || '#000', .55), 2);
}
function owlWing(c, s, f, P) {
  // spread up and out (s = -1 left, 1 right); the shoulder at (70, -80), the wrist at (430, -340)
  c.save(); c.scale(s, 1); c.rotate(-f * .4);
  // secondaries along the arm, pointing down and out
  for (let i = 0; i < 11; i++) { const u = i / 10, x = lerp(110, 420, u), y = lerp(-70, -330, u); blade(c, x, y, lerp(1.25, .55, u), lerp(230, 200, u), 62, i % 2 ? P.base : mixCol(P.base, P.lt, .3), rgba(P.dk, .7)); }
  // primaries fanning from the wrist
  for (let i = 0; i < 9; i++) { const u = i / 8; blade(c, 420 + u * 10, -330 + u * 14, lerp(-1.05, .35, u), lerp(330, 250, u), 58, i % 2 ? mixCol(P.base, P.dk, .2) : P.base, rgba(P.dk, .75)); }
  // coverts: the wing's lit body over the feather bases, in scalloped rows
  const CV = 'M 40 -50 C 140 -230 300 -360 470 -380 C 500 -340 470 -280 420 -250 C 330 -190 220 -110 130 -10 Z';
  fillPath(c, CV, P.lt);
  inside(c, CV, () => {
    for (let r = 0; r < 4; r++) for (let i = 0; i < 12; i++) { const u = i / 11, x = lerp(120 + r * 40, 440, u), y = lerp(-60 - r * 20, -340 + r * 30, u) + r * 22; ellipse(c, x, y, 22, 14, r % 2 ? P.base : mixCol(P.lt, P.base, .5), -.7); strokePath(c, `M ${x - 18} ${y + 8} Q ${x} ${y + 16} ${x + 18} ${y + 6}`, rgba(P.dk, .6), 3); }
    fillPath(c, 'M 30 -60 C 140 -250 300 -380 480 -400 L 480 -370 C 320 -350 170 -230 70 -40 Z', rgba(P.dk, .45));
  });
  c.restore();
}
function owlTalonsDown(c, P, grip = 0) {
  for (const s of [-1, 1]) {
    // a thick feathered leg thrust forward
    const LEG = `M ${s * 26} 110 C ${s * 30} 170 ${s * 40} 220 ${s * 48} 262 L ${s * 108} 262 C ${s * 100} 210 ${s * 90} 160 ${s * 78} 110 Z`;
    fillPath(c, LEG, P.lt); inside(c, LEG, () => { for (let j = 0; j < 6; j++) strokePath(c, `M ${s * 40} ${120 + j * 24} q ${s * 20} 8 ${s * 50} 0`, rgba(P.dk, .45), 4); });
    for (const [dx, a] of [[-26, .75], [0, .25], [24, -.2], [8, -1.4]]) {
      const x0 = s * 78 + dx * s, y0 = 262, ang = Math.PI / 2 + a * s * (1 - grip * .5), l = 70;
      const tx = x0 + Math.cos(ang) * l, ty = y0 + Math.sin(ang) * l;
      limb(c, [[x0, y0], [tx, ty]], [24, 18], '#B8A070');
      for (let b = 1; b < 4; b++) strokePath(c, `M ${lerp(x0, tx, b / 4) - 9} ${lerp(y0, ty, b / 4)} l 18 0`, rgba('#5A4A2A', .7), 3);
      const ca = Math.cos(ang), sa = Math.sin(ang), nx = -sa, ny = ca, cl = 56, cu = s * (1 + grip);
      fillPath(c, `M ${tx + nx * 9} ${ty + ny * 9} Q ${tx + ca * cl * .7 + nx * 10} ${ty + sa * cl * .7 + ny * 10} ${tx + ca * cl - nx * 22 * cu} ${ty + sa * cl - ny * 22 * cu} Q ${tx + ca * cl * .5 - nx * 4} ${ty + sa * cl * .5 - ny * 4} ${tx - nx * 9} ${ty - ny * 9} Z`, P.claw);
    }
  }
}
function owlDive(c, o = {}) {
  const P = { ...OWL, ...(o.pal || {}) };
  owlWing(c, -1, o.raise ?? .2, P); owlWing(c, 1, o.raise ?? .2, P);
  owlTalonsDown(c, P, o.grip || 0);
  // body: a broad streaked breast
  const B = 'M -120 -60 C -150 40 -110 160 0 190 C 110 160 150 40 120 -60 C 80 -110 -80 -110 -120 -60 Z';
  fillPath(c, B, P.lt);
  inside(c, B, () => {
    fillPath(c, 'M -160 -100 L -60 -100 C -90 0 -70 120 -20 200 L -160 200 Z', rgba(P.base, .8));
    for (let j = 0; j < 7; j++) for (let i = -3; i <= 3; i++) { const x = i * 32 + (j % 2) * 14, y = -40 + j * 30; fillPath(c, `M ${x} ${y} C ${x - 4} ${y + 10} ${x - 2} ${y + 18} ${x} ${y + 22} C ${x + 2} ${y + 18} ${x + 4} ${y + 10} ${x} ${y} Z`, P.streak); }
  });
  c.save(); c.translate(0, -10); c.scale(1.08, 1.08); owlFace(c, o); c.restore();
}
function owlPerch(c, o = {}) {
  const P = { ...OWL, ...(o.pal || {}) };
  for (const s of [-1, 1]) for (let i = 0; i < 3; i++) { const x = s * (24 + i * 14); fillPath(c, `M ${x - 5} -14 C ${x - 4} 6 ${x + 6} 16 ${x + 14 * s} 12 C ${x + 4} 6 ${x + 2} -4 ${x + 5} -14 Z`, P.claw); }
  const B = 'M -130 -60 C -150 -180 -120 -280 0 -300 C 120 -280 150 -180 130 -60 C 110 -20 60 -6 0 -6 C -60 -6 -110 -20 -130 -60 Z';
  fillPath(c, B, P.lt);
  inside(c, B, () => {
    for (const s of [-1, 1]) fillPath(c, `M ${s * 150} -300 C ${s * 80} -260 ${s * 70} -140 ${s * 110} -10 L ${s * 160} -10 Z`, P.base);   // folded wings
    for (let j = 0; j < 7; j++) for (let i = -2; i <= 2; i++) { const x = i * 28 + (j % 2) * 12, y = -250 + j * 32; fillPath(c, `M ${x} ${y} C ${x - 4} ${y + 10} ${x - 2} ${y + 18} ${x} ${y + 22} C ${x + 2} ${y + 18} ${x + 4} ${y + 10} ${x} ${y} Z`, P.streak); }
  });
  c.save(); c.translate(0, -260); c.scale(.92, .92); owlFace(c, o); c.restore();
}
function owlTalon(c, o = {}) {
  // one foot close, coming down: the feathered shank from above, toes spread (grip 0) or closing (1)
  const P = { ...OWL, ...(o.pal || {}) }, g = o.grip || 0;
  const LEG = 'M -80 -460 C -76 -320 -70 -180 -60 -70 L 60 -70 C 70 -180 76 -320 80 -460 Z';
  fillPath(c, LEG, P.lt); inside(c, LEG, () => { fillPath(c, 'M -100 -480 L -30 -480 C -40 -300 -40 -160 -36 -60 L -100 -60 Z', rgba(P.base, .7)); for (let j = 0; j < 12; j++) strokePath(c, `M -50 ${-440 + j * 32} q 40 12 100 0`, rgba(P.dk, .45), 5); });
  for (const [dx, a, l] of [[-40, 2.3 - g * .5, 150], [-12, 1.85 - g * .35, 170], [20, 1.3 + g * .3, 170], [44, .8 + g * .6, 140]]) {
    const x0 = dx, y0 = -70, tx = x0 + Math.cos(a) * l, ty = y0 + Math.sin(a) * l;
    limb(c, [[x0, y0], [lerp(x0, tx, .5), lerp(y0, ty, .5) - 6], [tx, ty]], [46, 38, 30], '#B8A070');
    for (let b = 1; b < 6; b++) strokePath(c, `M ${lerp(x0, tx, b / 6) - 16} ${lerp(y0, ty, b / 6)} l 32 -2`, rgba('#5A4A2A', .7), 4);
    const ca = Math.cos(a), sa = Math.sin(a), nx = -sa, ny = ca, cl = 120, cu = (a > 1.57 ? 1 : -1) * (1 + g);
    fillPath(c, `M ${tx + nx * 15} ${ty + ny * 15} Q ${tx + ca * cl * .7 + nx * 18} ${ty + sa * cl * .7 + ny * 18} ${tx + ca * cl - nx * 50 * cu} ${ty + sa * cl - ny * 50 * cu} Q ${tx + ca * cl * .5 - nx * 6} ${ty + sa * cl * .5 - ny * 6} ${tx - nx * 15} ${ty - ny * 15} Z`, P.claw);
    strokePath(c, `M ${tx + nx * 6} ${ty + ny * 6} Q ${tx + ca * cl * .7 + nx * 8} ${ty + sa * cl * .7 + ny * 8} ${tx + ca * cl - nx * 46 * cu} ${ty + sa * cl - ny * 46 * cu}`, rgba('#6A6478', .7), 4);
  }
}
function owlEyes(c, x, y, k, a = 1) {
  for (const s of [-1, 1]) {
    glow(c, x + s * 44 * k, y, 90 * k, '#E9C628', .35 * a);
    ellipse(c, x + s * 44 * k, y, 29 * k, 24 * k, rgba('#E9C628', a)); ellipse(c, x + s * 44 * k, y, 14 * k, 14 * k, '#070403'); ellipse(c, x + s * 44 * k + 8 * k, y - 8 * k, 4 * k, 4 * k, rgba('#FFFBE8', a));
  }
  for (const s of [-1, 1]) fillPath(c, `M ${x + s * 8 * k} ${y - 26 * k} C ${x + s * 40 * k} ${y - 50 * k} ${x + s * 80 * k} ${y - 44 * k} ${x + s * 96 * k} ${y - 24 * k} C ${x + s * 70 * k} ${y - 32 * k} ${x + s * 40 * k} ${y - 30 * k} ${x + s * 10 * k} ${y - 14 * k} Z`, '#000');
}

// ---------- the banyan ----------
function branch(c, P, w, col) { limb(c, P, P.map((_, i) => w * (1 - i / P.length * .75)), col); }
// a clump of banyan leaves (big ovals) round (x, y), r across
function leafClump(c, x, y, r, n, seed, col) {
  const rnd = lcg(seed);
  for (let i = 0; i < n; i++) { const a = rnd() * TAU, d = Math.sqrt(rnd()) * r, lx = x + Math.cos(a) * d, ly = y + Math.sin(a) * d * .7; ellipse(c, lx, ly, 26 + rnd() * 14, 12 + rnd() * 6, col, rnd() * Math.PI); }
}
function banyan(c, o = {}) {
  // at (0, 0) on the ground, about 2200 wide and 1200 tall at scale 1; the hanging roots are banyanRoots()
  const col = o.col || '#0B0B12', rnd = lcg(o.seed || 3);
  fillPath(c, 'M -170 0 C -120 -200 -130 -420 -100 -560 L 100 -560 C 130 -420 120 -200 190 0 Z', col);
  fillPath(c, 'M -260 0 C -200 -20 -170 -40 -150 -80 L -120 0 Z M 280 0 C 220 -20 190 -40 170 -80 L 140 0 Z', col);   // root flare
  for (const s of [-1, 1]) { branch(c, [[s * 40, -500], [s * 320, -660], [s * 700, -720], [s * 1040, -690]], 80, col); branch(c, [[s * 300, -650], [s * 520, -820], [s * 640, -900]], 44, col); }
  branch(c, [[0, -540], [-160, -820], [-260, -980]], 66, col); branch(c, [[0, -540], [200, -800], [340, -960]], 66, col);
  // the crown: soft overlapping masses, then leaf clumps along its top and under-edge so it reads as leaves
  for (let i = 0; i < 18; i++) { const u = (i + .5) / 18, cx = lerp(-1080, 1080, u), cy = -800 - Math.sin(u * Math.PI) * 300; ellipse(c, cx, cy, 220, 150 + Math.sin(u * Math.PI) * 60, col); }
  for (let i = 0; i < 40; i++) { const u = rnd(), cx = lerp(-1180, 1180, u), cy = -820 - Math.sin(u * Math.PI) * 380 + (rnd() - .3) * 90; leafClump(c, cx, cy, 90 + rnd() * 50, 22, i + 7, col); }
  for (let i = 0; i < 28; i++) { const u = rnd(), cx = lerp(-1150, 1150, u), cy = -690 - Math.sin(u * Math.PI) * 120 + rnd() * 40; leafClump(c, cx, cy, 70 + rnd() * 30, 14, i + 99, col); }
}
function banyanRoots(c, o = {}) {
  const col = o.col || '#0B0B12', rnd = lcg((o.seed || 3) + 50);
  for (let i = 0; i < 54; i++) {
    const s = rnd() < .5 ? -1 : 1, x = s * (150 + rnd() * 920), yTop = -700 + Math.abs(x) * .02, full = rnd() < .35, yb = full ? 0 : yTop + 160 + rnd() * 380;
    strokePath(c, `M ${x} ${yTop} C ${x + (rnd() - .5) * 26} ${lerp(yTop, yb, .4)} ${x + (rnd() - .5) * 26} ${lerp(yTop, yb, .7)} ${x + (rnd() - .5) * 18} ${yb}`, col, (full ? 7 : 2) + rnd() * 5);
  }
}

// ---------- night set pieces ----------
function nightSky(c, w, h, o = {}) {
  sky(c, o.stops || [[0, '#05070F'], [h * .55, '#0E1730'], [h, '#26304C']]);
  if (o.stars !== false && !CK.ink_) { const rnd = lcg(o.seed || 5); for (let i = 0; i < (o.nStars || 90); i++) { const x = rnd() * w, y = rnd() * h * .7, r = .6 + rnd() * 1.6; ellipse(c, x, y, r, r, rgba('#E8ECFF', .25 + rnd() * .6)); } }
}
function moon(c, x, y, r, a = 1) {
  glow(c, x, y, r * 7, '#8FA6D8', .38 * a); glow(c, x, y, r * 2.4, '#DCE6FF', .5 * a);
  ellipse(c, x, y, r, r, '#EEF2FA'); ellipse(c, x + r * .25, y - r * .1, r * .22, r * .18, rgba('#C9D2E6', .7)); ellipse(c, x - r * .3, y + r * .3, r * .15, r * .12, rgba('#C9D2E6', .6));
}
