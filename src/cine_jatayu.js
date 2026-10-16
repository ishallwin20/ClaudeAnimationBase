// cine_jatayu.js: Jatayu, the king of eagles (Valmiki: "gṛdhrarāja"), for the cinematic engine (cine.js). In colour,
// lit by figure(). An ancient, noble bird of prey, not a cartoon: deep umber body and wings with long fingered primaries,
// a silver band where the old secondaries have greyed, a shaggy silver ruff and swept-back crest (he is 60,000 years
// old), a heavy ivory-gold hooked beak on a yellow cere, an amber eye under a grey brow shelf, yellow scaled feet with
// black talons, and a thin gold circlet with a ruby (a king; a look, not a claim).
// The head is drawn in profile facing screen right in its own units: the eye at (0, 0), the crest's back at about
// x -230, the beak's tip at about (215, 62), the crown at y -92.
//
// jatayu(c, o): the whole bird. o (all optional):
//   pose: 'perch' (side view facing right, standing on a branch at y 0, about 830 tall to the crest) |
//         'spread' (front view, wings spread, the head turned in profile to screen right; the body's centre at (0, 0),
//           the wings reach about x ±1230, the crest y -520, the talons y 440, the tail y 560) |
//         'fallen' (lying on his side on the ground at y 0, facing right, about 900 long)
//   t, eyes (0..1 open; 0 asleep), expr: 'calm' | 'fierce' (brow down, beak open) | 'pain' (eye half shut, beak
//   ajar), beak (0..1 how open, overrides expr), tuck (0..1 'perch': the head sunk into the ruff, asleep),
//   flap (0..1 'spread': 0 wings raised high, 1 swept down), strike (0..1 'spread': the talons thrust forward, open),
//   wings: true | false | 'stumps' (cut off: ragged stubs at the shoulders), loose (0..1 feathers out of place, tired),
//   breath (0..1 the chest heaving), wind (0..1 crest and ruff), col (one colour: a silhouette, or the card's gold)
// jatayuHead(c, o): the head and neck alone in head units, for a close-up (scale ×3–5): eyes, expr, beak, t, wind, col.
// jatayuTalon(c, o): one foot, close, the ankle at (0, -420), the toes reaching down to about y 60: grip (0..1 the
//   toes curl closed round a bar at y 0), t, col.
// feather(c, x, y, k, rot, col): one loose flight feather (about 220 long at k 1), for drifting.
const JT = {
  body: '#4A3020', bodySh: '#2E1C12', bodyLt: '#8A6444', prim: '#20150E', primLt: '#3E2C1E', silver: '#9A9284',
  chest: '#6A462A', chestLt: '#9E7448', ruff: '#E6E1D4', ruffSh: '#A9A396', head: '#DCD6C8', headSh: '#A8A193',
  white: '#F5F1E7', brow: '#8E887E', skin: '#5E5650', beak: '#EBCB86', beakSh: '#BC9850', beakTip: '#5C4A32',
  cere: '#D9A030', iris: '#E9A232', irisDk: '#93520E', pupil: '#0A0604', mouth: '#5A1A16', foot: '#D4A23E',
  footSh: '#9C7428', talon: '#15100C', gold: '#D9A441', goldLt: '#F6D58A', ruby: '#B3202C', wound: '#5A0E10',
};
const JT_EXPR = { calm: { eyes: 1, brow: 0, beak: 0 }, fierce: { eyes: 1.1, brow: 1, beak: .7 }, pain: { eyes: .45, brow: -.8, beak: .3 } };
const jtPal = (o) => { const one = o.col; return (k) => one || JT[k]; };

// one long feather as a tapered limb from (x, y) at angle a (radians, screen: 0 = +x, π/2 = down), length len, width w
function jtQuill(c, x, y, a, len, w, col, bend = 0, tip) {
  const ca = Math.cos(a), sa = Math.sin(a), nx = -sa, ny = ca;
  const P = [[x, y], [x + ca * len * .5 + nx * bend * len * .06, y + sa * len * .5 + ny * bend * len * .06], [x + ca * len + nx * bend * len * .1, y + sa * len + ny * bend * len * .1]];
  limb(c, P, [w, w * .92, w * .5], col);
  if (tip) limb(c, [[lerp(P[1][0], P[2][0], .45), lerp(P[1][1], P[2][1], .45)], P[2]], [w * .7, w * .45], tip);
  return P[2];
}
// rows of scalloped feather edges inside the current clip: x0..x1, rows from y0 every dy, size r
function jtScallops(c, x0, x1, y0, y1, r, col, w = 2.4, seed = 1) {
  c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round';
  let row = 0;
  for (let y = y0; y < y1; y += r * 1.1, row++) for (let x = x0 + (row % 2) * r; x < x1; x += r * 2) {
    const j = (hash(x * .13 + y * .71 + seed) - .5) * r * .4;
    c.beginPath(); c.moveTo(x - r + j, y); c.quadraticCurveTo(x + j, y + r * 1.25, x + r + j, y); c.stroke();
  }
}

// ---------- the head (head units: the eye at (0, 0), facing right) ----------
function jatayuHead(c, o = {}) {
  const C = jtPal(o), one = !!o.col, t = o.t || 0, E = JT_EXPR[o.expr || 'calm'], wd = (o.wind ?? .4);
  const open = clamp(o.beak ?? E.beak), br = E.brow, eyes = o.eyes ?? E.eyes;
  // the neck, down to where the ruff covers it
  if (o.neck !== false) {
    fillPath(c, 'M -128 40 C -150 130 -166 220 -196 320 L 136 320 C 100 230 70 150 52 82 Z', C('head'));
    if (!one) inside(c, 'M -128 40 C -150 130 -166 220 -196 320 L 136 320 C 100 230 70 150 52 82 Z', () => {
      fillPath(c, 'M -200 60 C -150 150 -120 240 -110 330 L -220 330 Z', rgba(JT.headSh, .7));
      c.strokeStyle = rgba(JT.headSh, .8); c.lineWidth = 3;
      for (let i = 0; i < 9; i++) { const x = -120 + i * 26, y = 120 + (i % 3) * 50; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + 6, y + 30, x - 4, y + 52); c.stroke(); }
    });
  }
  if (o.neck !== false && o.ruff !== false) jtRuff(c, C, -30, 300, 230, t, wd, one, 1.1);
  // the crest: long silver plumes swept back off the crown, lifting in the wind
  for (let i = 0; i < 6; i++) {
    const a = Math.PI + .1 + i * .13 + Math.sin(t * 2.3 + i * 1.7) * .04 * wd, len = 150 - i * 12 + (i === 1 ? 30 : 0);
    jtQuill(c, -70 + i * 4, -62 + i * 16, a, len, 34 - i * 2, i % 2 ? C('ruffSh') : C('ruff'), i % 2 ? -1 : 1);
  }
  // the skull
  const HEAD = 'M -126 64 C -158 22 -148 -42 -104 -70 C -62 -96 0 -94 42 -78 C 72 -66 90 -50 98 -36 L 98 42 C 70 72 30 94 -22 102 C -64 106 -104 92 -126 64 Z';
  fillPath(c, HEAD, C('head'));
  if (!one) inside(c, HEAD, () => {
    fillPath(c, 'M -170 26 C -90 46 30 58 110 40 L 110 140 L -170 140 Z', rgba(JT.headSh, .75));   // the cheek and throat in shade
    fillPath(c, 'M -40 -98 C 10 -96 60 -80 96 -46 L 96 -30 C 60 -62 10 -78 -40 -80 Z', rgba(JT.white, .6));   // the crown catching light
    c.strokeStyle = rgba(JT.headSh, .9); c.lineWidth = 2.6;
    for (const [x, y, l] of [[-96, -30, 30], [-74, -2, 34], [-100, 18, 30], [-52, 30, 30], [-80, 46, 28], [-30, 58, 26], [-110, -6, 22]]) { c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x - l * .5, y + l * .3, x - l, y + l * .1); c.stroke(); }
  });
  // the gold circlet over the crown
  if (!one) {
    strokePath(c, 'M -104 -60 C -64 -88 -6 -92 40 -76', JT.gold, 9);
    strokePath(c, 'M -100 -62 C -62 -86 -8 -90 36 -76', rgba(JT.goldLt, .8), 3);
    ellipse(c, 6, -86, 8, 9, JT.ruby); ellipse(c, 4, -88, 3, 3, rgba('#FFB0B0', .7));
  }
  // the beak: a yellow cere, then the heavy hooked upper bill; the lower bill drops as it opens (about (112, 30))
  const ja = open * .42, rot = (x, y) => [112 + (x - 112) * Math.cos(ja) - (y - 30) * Math.sin(ja), 30 + (x - 112) * Math.sin(ja) + (y - 30) * Math.cos(ja)];
  if (open > .02) { const [mx, my] = rot(192, 48); fillPath(c, `M 108 28 L 200 40 L ${mx} ${my} L 112 ${36 + open * 10} Z`, C('mouth')); }
  c.save(); c.translate(112, 30); c.rotate(ja); c.translate(-112, -30);
  fillPath(c, 'M 114 28 C 148 32 178 38 194 46 C 178 58 146 58 116 50 Z', C('beakSh'));
  if (!one) strokePath(c, 'M 120 46 C 146 52 170 50 188 46', rgba(JT.beakTip, .6), 2);
  c.restore();
  const BILL = 'M 116 -44 C 166 -56 210 -34 230 2 C 244 30 242 66 216 86 C 212 64 202 48 186 42 C 160 34 138 32 116 30 Z';
  fillPath(c, BILL, C('beak'));
  if (!one) inside(c, BILL, () => {
    fillPath(c, 'M 110 10 C 160 8 200 18 232 38 L 250 100 L 110 100 Z', rgba(JT.beakSh, .9));
    ellipse(c, 222, 70, 18, 22, rgba(JT.beakTip, .85), .3);
    strokePath(c, 'M 126 -36 C 166 -44 200 -26 216 2', rgba('#FFF4D6', .55), 5);
  });
  fillPath(c, 'M 90 -40 C 102 -48 116 -46 124 -38 C 134 -16 134 12 124 30 C 112 34 100 34 90 30 C 84 6 84 -18 90 -40 Z', C('cere'));
  if (!one) { ellipse(c, 142, -14, 8, 4.5, JT.beakTip, -.2); strokePath(c, 'M 96 32 C 130 34 164 38 190 44', rgba(JT.beakTip, .8), 2.4); }
  // the bare skin round the eye, the eye, the lid, the brow shelf over it
  if (!one) {
    ellipse(c, 2, 2, 36, 28, JT.skin);
    if (eyes > .03) {
      const lid = clamp(1 - eyes);
      ellipse(c, 0, 0, 19, 18.5, JT.iris); ellipse(c, 0, 0, 19, 18.5, rgba(JT.irisDk, .25));
      ellipse(c, 2, 0, 9 - (eyes > 1 ? 2 : 0), 9 - (eyes > 1 ? 2 : 0), JT.pupil);
      ellipse(c, 7, -7, 4, 4, '#FFF8EC');
      if (lid > 0) fillPath(c, `M -24 -22 L 24 -22 L 24 ${-20 + lid * 40} C 10 ${-14 + lid * 42} -10 ${-14 + lid * 42} -24 ${-20 + lid * 38} Z`, JT.skin);
      strokePath(c, `M -20 ${-14 + lid * 36} C -8 ${-20 + lid * 38} 10 ${-20 + lid * 38} 21 ${-12 + lid * 34}`, rgba('#1A1412', .8), 2.6);
    } else {
      strokePath(c, 'M -20 2 C -8 10 10 10 21 2', rgba('#1A1412', .9), 3);
      for (let i = 0; i < 4; i++) strokePath(c, `M ${-12 + i * 9} ${8} l ${-1 + i * .6} 5`, rgba('#1A1412', .7), 1.6);
    }
    strokePath(c, 'M -26 22 C -10 30 10 30 26 20', rgba('#2A2420', .45), 1.8);   // age: creases under the eye
    strokePath(c, 'M -22 30 C -6 38 12 36 24 28', rgba('#2A2420', .3), 1.5);
  }
  // the brow shelf: lower at the front when fierce, raised in pain
  const fy = -22 + br * 9, by = -26 - Math.max(0, -br) * 6;
  fillPath(c, `M -42 ${by + 4} C -14 ${by - 16} 30 ${fy - 18} 66 ${fy - 2} L 62 ${fy + 8} C 30 ${fy - 4} -10 ${by - 2} -40 ${by + 14} Z`, C('brow'));
  if (!one) strokePath(c, `M -36 ${by + 2} C -10 ${by - 14} 30 ${fy - 16} 62 ${fy - 2}`, rgba(JT.white, .45), 2.4);
}

// ---------- a wing (wing units: the shoulder at (0, 0), the wing reaching along +x, the leading edge on the -y side) ----------
// o: span (0..1 how far the primaries fan), loose, t, seed
function jtWing(c, C, one, o = {}) {
  const sp = o.span ?? 1, lo = o.loose || 0, t = o.t || 0;
  // primaries: seven fingers off the hand, the top ones pointing out, the lower ones back
  const PR = [[640, -66, -.2, 470], [660, -44, -.06, 500], [668, -18, .08, 505], [664, 8, .22, 480], [650, 32, .36, 445], [626, 52, .5, 400], [596, 70, .64, 350]];
  PR.forEach(([x, y, a, len], i) => {
    const aa = lerp(.12 + i * .06, a, sp) + (lo ? (hash(i * 3.1 + 2) - .5) * .35 * lo : 0) + Math.sin(t * 3 + i) * .01;
    if (lo > .5 && i === 4) return;   // a gap where one has gone
    jtQuill(c, x - 40, y, aa, len, 64 - i * 2, C('prim'), .6, one ? null : rgba(JT.primLt, .9));
  });
  // secondaries along the trailing edge, their tips silvered with age
  for (let i = 0; i < 11; i++) {
    const x = 20 + i * 58, ln = 250 - i * 6 + (hash(i + 9) - .5) * 20, a = Math.PI / 2 + .22 + i * .015 + (lo ? (hash(i * 1.7) - .5) * .3 * lo : 0);
    const tip = jtQuill(c, x, 70, a, ln, 70, C('bodySh'), 0);
    if (!one) limb(c, [[lerp(x, tip[0], .62), lerp(70, tip[1], .62)], [lerp(x, tip[0], .9), lerp(70, tip[1], .9)]], [70, 60], rgba(JT.silver, .3));
  }
  // the coverts: the wing's arm, scalloped
  const COV = 'M -14 -40 C 120 -100 300 -142 452 -128 C 562 -118 662 -90 724 -48 C 746 -12 724 30 684 52 C 560 92 380 142 200 152 C 100 158 28 142 -14 112 Z';
  fillPath(c, COV, C('body'));
  if (!one) inside(c, COV, () => {
    fillPath(c, 'M -20 70 C 160 110 420 90 740 10 L 760 200 L -20 200 Z', rgba(JT.bodySh, .7));
    jtScallops(c, 0, 720, -110, 60, 22, rgba(JT.bodyLt, .55), 2.4, 3);
    strokePath(c, 'M -10 -34 C 120 -94 300 -136 452 -122 C 560 -112 660 -84 720 -44', rgba(JT.bodyLt, .9), 7);
  });
}

// ---------- the folded wing and body, side view facing right (perch, fallen) ----------
function jtSideBody(c, C, one, o) {
  const t = o.t || 0, lo = o.loose || 0, br = (o.breath || 0) * Math.sin(t * 2.6) * 8, wings = o.wings ?? true;
  // the tail: dark feathers hanging down and back
  for (let i = 0; i < 7; i++) jtQuill(c, -170 + i * 6, -250 + i * 4, 1.86 + i * .05 + (lo ? (hash(i * 5) - .5) * .2 * lo : 0), 330 - Math.abs(i - 3) * 14, 64, C(i % 2 ? 'prim' : 'bodySh'), 0, one ? null : rgba(JT.silver, .35));
  // the body
  const BODY = `M -204 -250 C -214 -420 -92 ${-560 - br} 50 ${-576 - br} C 150 ${-586 - br} 202 -500 198 -400 C 194 -300 142 -198 60 -168 C -40 -138 -160 -168 -204 -250 Z`;
  fillPath(c, BODY, C('chest'));
  if (!one) inside(c, BODY, () => {
    fillPath(c, 'M -220 -320 C -100 -300 60 -240 220 -280 L 220 -120 L -220 -120 Z', rgba(JT.bodySh, .6));
    c.strokeStyle = rgba(JT.chestLt, .6); c.lineWidth = 3;
    for (let i = 0; i < 26; i++) { const x = 60 + hash(i * 2.3) * 140, y = -520 + hash(i * 4.1) * 320; c.beginPath(); c.moveTo(x - 9, y); c.lineTo(x, y + 18); c.lineTo(x + 9, y); c.stroke(); }
  });
  // the legs: feathered thighs, then the scaled yellow tarsus and the gripping toes
  if (o.pose !== 'fallen') {
    limb(c, [[34, -236], [28, -176], [18, -130]], [118, 96, 58], C('body'));
    if (!one) for (let i = 0; i < 5; i++) jtQuill(c, -14 + i * 14, -168, 1.5 + (i - 2) * .12, 46, 22, rgba(JT.bodySh, .9));
    limb(c, [[16, -124], [8, -60], [0, -18]], [34, 31, 28], C('foot'));
    if (!one) for (let y = -110; y < -24; y += 14) strokePath(c, `M ${-12 + (y + 110) * -.08} ${y} l 26 2`, rgba(JT.footSh, .9), 2);
    for (const [P, w] of [[[[0, -18], [56, -6], [96, 4]], 24], [[[0, -18], [46, -2], [76, 10]], 22], [[[0, -18], [-50, -6], [-74, 2]], 24]]) {
      limb(c, P, [w, w * .9, w * .7], C('foot'));
      const e = P[2], s = Math.sign(e[0]);
      fillPath(c, `M ${e[0]} ${e[1] - 10} C ${e[0] + s * 28} ${e[1] - 4} ${e[0] + s * 30} ${e[1] + 26} ${e[0] + s * 14} ${e[1] + 40} C ${e[0] + s * 16} ${e[1] + 22} ${e[0] + s * 8} ${e[1] + 10} ${e[0] - s * 6} ${e[1] + 8} Z`, C('talon'));
    }
  }
  // the folded wing over the body, the primaries crossing past the tail
  if (wings === true) {
    const WG = 'M 92 -560 C -10 -592 -172 -500 -242 -340 C -282 -250 -322 -142 -366 -36 L -334 -46 C -292 -148 -232 -250 -150 -320 C -60 -392 62 -402 122 -442 C 152 -472 142 -540 92 -560 Z';
    fillPath(c, WG, C('body'));
    if (!one) inside(c, WG, () => {
      jtScallops(c, -200, 140, -590, -440, 20, rgba(JT.bodyLt, .55), 2.4, 7);
      strokePath(c, 'M 110 -446 C 20 -440 -120 -380 -210 -280', rgba(JT.silver, .6), 22);
      for (let i = 0; i < 5; i++) strokePath(c, `M ${-120 - i * 18} ${-380 + i * 22} C ${-200 - i * 16} ${-280 + i * 14} ${-280 - i * 10} ${-160 + i * 10} ${-350 - i * 4} ${-50 + i * 4}`, rgba(JT.prim, .9), 14);
      strokePath(c, 'M 86 -556 C -10 -584 -168 -494 -236 -338', rgba(JT.bodyLt, .8), 6);
    });
  } else if (wings === 'stumps') {
    // ragged stubs where the wings were cut away
    for (let i = 0; i < 6; i++) jtQuill(c, 60 - i * 26, -500 + i * 10, -2.3 - i * .12 + (hash(i * 7) - .5) * .3, 70 + hash(i * 3) * 40, 30, C(i % 2 ? 'body' : 'bodySh'), 0, one ? null : rgba(JT.wound, .7));
    if (!one) for (let i = 0; i < 3; i++) ellipse(c, 40 - i * 40, -488 + i * 14, 16, 6, rgba(JT.wound, .55), -.4);
  }
}
// the ruff: a shaggy silver collar round (x, y), r across
function jtRuff(c, C, x, y, r, t, wd, one, k = 1) {
  c.fillStyle = C('ruffSh'); c.beginPath();
  for (let i = 0; i <= 40; i++) { const a = i / 40 * TAU, rr = r * (i % 2 ? .78 : 1.08) * (1 + .03 * Math.sin(t * 3 + i) * wd); c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr * .62 * k); }
  c.closePath(); c.fill();
  c.fillStyle = C('ruff'); c.beginPath();
  for (let i = 0; i <= 34; i++) { const a = i / 34 * TAU, rr = r * (i % 2 ? .62 : .9) * (1 + .04 * Math.sin(t * 2.6 + i * 1.3) * wd); c.lineTo(x + Math.cos(a) * rr, y - r * .08 + Math.sin(a) * rr * .55 * k); }
  c.closePath(); c.fill();
  if (!one) { c.strokeStyle = rgba(JT.ruffSh, .9); c.lineWidth = 2.6; for (let i = 0; i < 14; i++) { const a = i / 14 * TAU, px = x + Math.cos(a) * r * .5, py = y + Math.sin(a) * r * .3; c.beginPath(); c.moveTo(px, py); c.lineTo(px + Math.cos(a) * r * .3, py + Math.sin(a) * r * .2 + 8); c.stroke(); } }
}

// ---------- the whole bird ----------
function jatayu(c, o = {}) {
  const C = jtPal(o), one = !!o.col, t = o.t || 0, pose = o.pose || 'perch', wd = o.wind ?? .4, wings = o.wings ?? true;
  const H = { t, expr: o.expr, eyes: o.eyes, beak: o.beak, wind: wd, col: o.col };
  if (pose === 'perch') {
    jtSideBody(c, C, one, o);
    const tk = o.tuck || 0;
    const hx = lerp(222, 200, tk), hy = lerp(-726, -650, tk);
    limb(c, [[140, -540], [180, -610], [hx - 40, hy + 40]], [160, 130, 116], C('head'));
    if (!one) limb(c, [[110, -530], [140, -600], [hx - 80, hy + 50]], [60, 50, 40], rgba(JT.headSh, .8));
    jtRuff(c, C, 140, -552, 136, t, wd, one);
    c.save(); c.translate(hx, hy); c.rotate(lerp(-.06, .34, tk)); c.scale(.95, .95); jatayuHead(c, { ...H, neck: false }); c.restore();
    jtRuff(c, C, 170, -586, 76, t, wd, one, .8);
  } else if (pose === 'fallen') {
    // the perched body turned over onto the ground (breast down, tail to screen left), the head resting in front
    const br = (o.breath || 0) * Math.sin(t * 2.6) * .012;
    c.save(); c.translate(-80, -168); c.rotate(.82); c.scale(1, 1 + br); c.translate(40, 380);
    if (wings === true) { c.save(); c.translate(-20, -470); c.rotate(2.5); c.scale(.85, -.6); jtWing(c, C, one, { span: .45, loose: Math.max(.4, o.loose || 0), t }); c.restore(); }
    jtSideBody(c, C, one, { ...o, wings: wings === true ? 'none' : wings, pose: 'fallen' });
    c.restore();
    limb(c, [[150, -120], [250, -96], [330, -70]], [130, 104, 90], C('head'));
    jtRuff(c, C, 150, -120, 110, t, wd * .3, one, .9);
    c.save(); c.translate(390, -80); c.rotate(.46); c.scale(.95, .95); jatayuHead(c, { ...H, neck: false, expr: o.expr || 'pain' }); c.restore();
  } else {
    // 'spread': front view. The tail fan behind, then the wings, the legs, the body, the ruff, the head in profile.
    const fl = o.flap ?? 0, st = o.strike || 0, br = Math.sin(t * 1.6) * 3;
    for (let i = 0; i < 9; i++) jtQuill(c, (i - 4) * 14, 170, Math.PI / 2 + (i - 4) * .12, 380 - Math.abs(i - 4) * 18, 76, C(i % 2 ? 'prim' : 'bodySh'), 0, one ? null : rgba(JT.silver, .4));
    if (wings === true) for (const s of [-1, 1]) {
      c.save(); c.translate(s * 100, -150 + br); c.scale(s, 1); c.rotate(lerp(-.62, .42, fl)); c.scale(1, lerp(1, .78, Math.sin(fl * Math.PI)));
      jtWing(c, C, one, { span: lerp(1, .7, fl), loose: o.loose, t: t + s });
      c.restore();
    } else if (wings === 'stumps') for (const s of [-1, 1]) for (let i = 0; i < 5; i++) jtQuill(c, s * (110 + i * 6), -160 + i * 18, s > 0 ? -.3 + i * .2 : Math.PI + .3 - i * .2, 80 + hash(i + s) * 40, 32, C('bodySh'), 0, one ? null : rgba(JT.wound, .7));
    // legs: shaggy feathered thighs, yellow tarsi, toes and talons (thrust forward and open when striking)
    for (const s of [-1, 1]) {
      limb(c, [[s * 64, 120], [s * 76, 220], [s * 82, 300]], [120, 110, 80], C('bodySh'));
      const fk = 1 + st * .7, fx = s * lerp(88, 120, st), fy = lerp(420, 470, st);
      limb(c, [[s * 82, 290], [fx, fy - 40 * fk]], [40, 36 * fk], C('foot'));
      for (const [a, len] of [[-.55, 70], [0, 80], [.55, 70], [Math.PI, 46]]) {
        const aa = Math.PI / 2 + s * a * (1 + st * .6), ex = fx + Math.cos(aa) * len * fk, ey = fy - 40 * fk + Math.sin(aa) * len * fk + 30 * fk;
        limb(c, [[fx, fy - 40 * fk], [ex, ey]], [26 * fk, 20 * fk], C('foot'));
        c.save(); c.translate(ex, ey); c.rotate(aa - Math.PI / 2); c.scale(fk, fk);
        fillPath(c, 'M -9 -4 C -10 18 -2 34 14 44 C 6 30 6 16 9 -4 Z', C('talon')); c.restore();
      }
    }
    // the body, front on
    const BODY = `M 0 ${-262 + br} C 124 ${-262 + br} 172 -150 162 -20 C 152 110 92 222 0 232 C -92 222 -152 110 -162 -20 C -172 -150 -124 ${-262 + br} 0 ${-262 + br} Z`;
    fillPath(c, BODY, C('chest'));
    if (!one) inside(c, BODY, () => {
      fillPath(c, 'M -170 60 C -60 120 60 120 170 60 L 170 260 L -170 260 Z', rgba(JT.bodySh, .6));
      fillPath(c, 'M 60 -270 C 140 -230 170 -120 160 0 L 180 0 L 180 -280 Z', rgba(JT.bodySh, .5));
      c.strokeStyle = rgba(JT.chestLt, .55); c.lineWidth = 3;
      for (let i = 0; i < 40; i++) { const x = (hash(i * 2.7) - .5) * 250, y = -200 + hash(i * 5.3) * 380; c.beginPath(); c.moveTo(x - 10, y); c.lineTo(x, y + 20); c.lineTo(x + 10, y); c.stroke(); }
    });
    jtRuff(c, C, 0, -250 + br, 168, t, wd, one);
    // the neck rises out of the ruff, the head turned in profile
    limb(c, [[0, -250], [16, -330], [24, -380]], [118, 100, 88], C('head'));
    c.save(); c.translate(36, -436 + br); c.scale(1.15, 1.15); jatayuHead(c, { ...H, neck: false }); c.restore();
    jtRuff(c, C, 6, -282 + br, 96, t, wd, one, .8);
  }
}

// ---------- the foot, close ----------
function jatayuTalon(c, o = {}) {
  const C = jtPal(o), one = !!o.col, g = clamp(o.grip ?? 0);
  // the shaggy feathered leg, ending in a ragged fringe over the tarsus
  let F = 'M -110 -760 L 110 -760 L 104 -470';
  for (let i = 0; i <= 10; i++) F += ` L ${104 - i * 20.8} ${-470 + (i % 2 ? 34 : 0) + (hash(i * 3.3) - .5) * 14}`;
  F += ' Z';
  // the toes behind the leg first: three forward (spread, curling in round a bar at y 0 as they grip), the hallux back
  const toes = [[2.35, [96, 84, 64], -1, 64], [1.62, [104, 90, 70], 1, 70], [.9, [96, 84, 64], 1, 64], [-2.4, [70, 50], 1, 56]];
  const tip = [];
  for (const [a0, seg, sgn, w] of toes) {
    let x = 0, y = -230, a = a0; const P = [[x, y]];
    for (const L of seg) { x += Math.cos(a) * L; y += Math.sin(a) * L; P.push([x, y]); a += sgn * lerp(.1, .55, g); }
    tip.push([P, a, sgn, w]);
  }
  limb(c, [[0, -480], [0, -360], [0, -226]], [104, 98, 92], C('foot'));
  if (!one) inside(c, new Path2D('M -52 -480 L 52 -480 L 48 -220 L -48 -220 Z'), () => {
    for (let y = -470, r = 0; y < -220; y += 24, r++) for (let x = -58 + (r % 2) * 18; x < 60; x += 36) strokePath(c, `M ${x} ${y} q 18 12 36 0`, rgba(JT.footSh, .9), 2.4);
    fillPath(c, 'M 22 -480 L 60 -480 L 56 -220 L 18 -220 Z', rgba(JT.footSh, .55));
  });
  for (const [P, a, sgn, w] of tip) {
    limb(c, P, P.map((_, i) => w - i * 7), C('foot'));
    if (!one) for (let i = 1; i < P.length - 1; i++) { const q = P[i]; strokePath(c, `M ${q[0] - 16} ${q[1] - 8} l 32 14`, rgba(JT.footSh, .9), 2.4); }
    const e = P[P.length - 1];
    c.save(); c.translate(e[0], e[1]); c.rotate(a); c.scale(1, sgn);
    fillPath(c, 'M -10 -22 C 40 -26 76 4 80 52 C 60 30 38 20 -6 20 Z', C('talon'));
    if (!one) strokePath(c, 'M 2 -16 C 36 -18 62 6 70 38', rgba('#6A5A4E', .7), 3);
    c.restore();
  }
  fillPath(c, F, C('bodySh'));
  if (!one) inside(c, F, () => { jtScallops(c, -110, 110, -740, -470, 22, rgba(JT.bodyLt, .5), 2.6, 5); fillPath(c, 'M 40 -770 L 120 -770 L 120 -440 L 50 -440 Z', rgba('#000', .25)); });
}

// ---------- one loose feather ----------
function feather(c, x, y, k, rot, col) {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(k, k);
  fillPath(c, 'M 0 -110 C 18 -90 26 -30 22 30 C 18 70 8 100 0 110 C -6 90 -16 60 -20 20 C -24 -30 -14 -86 0 -110 Z', col || JT.prim);
  if (!col) { fillPath(c, 'M 0 -110 C 18 -90 26 -30 22 30 C 18 70 8 100 0 110 Z', rgba(JT.primLt, .8)); strokePath(c, 'M 0 -104 C 3 -40 3 40 0 118', rgba(JT.silver, .8), 2.4); }
  c.restore();
}
