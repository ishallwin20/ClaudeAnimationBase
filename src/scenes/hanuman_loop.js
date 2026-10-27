// hanuman_loop.js: "Ram hi paar lagavenge", a Painterly cinemagraph: Hanuman in meditation in a sunlit forest clearing.
// The painting is static; his tail sways, "राम" turns round him in rings, light breathes, dust and sparkles drift, and
// the two lines of the bhajan the owner picked sit over him, in time with the song (whisper: line 1 0–6.1 s, line 2
// 6.1–11.7 s, then humming). Everything that moves repeats exactly over DUR, so the reel loops without a seam.
const LIGHT = [540, 640];          // where the sun breaks through the canopy
const HX = 540, HY = 1000;         // the centre of his face

// ---------- the forest (design) ----------
function forestDesign(c) {
  const R = lcg(11);
  // the backlit depth of the forest: bright yellow-green at the light, deep green at the edges
  let g = c.createRadialGradient(LIGHT[0], LIGHT[1], 30, LIGHT[0], LIGHT[1] + 200, 1250);
  [[0, '#FCF8CF'], [.12, '#EEF0A6'], [.3, '#BFD27A'], [.5, '#7FA04F'], [.75, '#456A31'], [1, '#22391A']].forEach(([k, col]) => g.addColorStop(k, col));
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  // far trunks, pale and blue in the haze
  for (let i = 0; i < 30; i++) {
    const x = 120 + R() * 840, wd = 8 + R() * 18, near = Math.abs(x - LIGHT[0]) / 500;
    c.fillStyle = mixCol('#C9D9B0', '#7F9C7A', clamp(near + R() * .2));
    c.globalAlpha = .55 + R() * .3; c.fillRect(x, 120 + R() * 200, wd, 1150); c.globalAlpha = 1;
  }
  // distant leaf masses, light
  for (let i = 0; i < 160; i++) {
    const x = R() * W, y = 150 + R() * 900, d = Math.hypot(x - LIGHT[0], y - LIGHT[1]) / 700;
    ellipse(c, x, y, 20 + R() * 50, 14 + R() * 30, mixCol('#E2EAA0', '#6E9246', clamp(d + R() * .2)), R() * 3);
  }
  // middle trunks, darker, slightly leaning, with a lit edge
  for (let i = 0; i < 9; i++) {
    const x = [70, 190, 300, 380, 700, 790, 880, 990, 250][i] + (R() - .5) * 30, wd = 26 + R() * 34, lean = (R() - .5) * 60;
    const d = clamp(Math.abs(x - LIGHT[0]) / 520);
    poly(c, [[x - wd / 2 + lean, 0], [x + wd / 2 + lean, 0], [x + wd * .6, 1330], [x - wd * .6, 1330]], mixCol('#7D9566', '#3D5232', d));
    c.globalAlpha = .5; poly(c, [[x + wd * .2 + lean, 0], [x + wd / 2 + lean, 0], [x + wd * .6, 1330], [x + wd * .3, 1330]], mixCol('#C6D58E', '#6E8A4E', d)); c.globalAlpha = 1;
  }
  // a veil of light in the air
  g = c.createRadialGradient(LIGHT[0], LIGHT[1] + 150, 0, LIGHT[0], LIGHT[1] + 150, 620);
  g.addColorStop(0, 'rgba(252,250,205,.75)'); g.addColorStop(.5, 'rgba(232,240,170,.3)'); g.addColorStop(1, 'rgba(232,240,170,0)');
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  // near trunks at the edges: big, dark, mossy, with branches into the canopy
  const trunk = (pts, wd, col, lit) => {
    limb(c, pts, wd, col);
    c.save(); c.globalAlpha = .55; limb(c, pts.map(([x, y]) => [x + wd[0] * .22, y]), wd.map(v => v * .35), lit); c.restore();
  };
  trunk([[40, 1500], [55, 1100], [30, 700], [60, 300], [20, -20]], [150, 130, 115, 100, 90], '#1E2C17', '#5E7A35');
  trunk([[60, 420], [180, 300], [330, 210], [470, 170]], [44, 30, 20, 12], '#26361C', '#7C9645');
  trunk([[1040, 1500], [1010, 1100], [1040, 650], [1000, 250], [1050, -20]], [140, 120, 105, 95, 85], '#1F2D18', '#6A8A3C');
  trunk([[1020, 560], [900, 430], [760, 330], [640, 300]], [40, 28, 18, 10], '#283A1D', '#8AA54C');
  trunk([[930, 1350], [900, 900], [870, 300], [880, -20]], [46, 40, 34, 30], '#33472A', '#93AE5E');
  // the canopy: leaf clusters, dark in the shade, yellow-green where the sun comes through
  for (let i = 0; i < 1500; i++) {
    const side = R(), x = side < .5 ? R() * 520 : 560 + R() * 520, y = -40 + Math.pow(R(), 1.6) * 620 + (Math.abs(x - 540) > 380 ? R() * 400 : 0);
    const d = Math.hypot(x - LIGHT[0], (y - LIGHT[1]) * 1.3) / 650, lit = clamp(1 - d + (R() - .5) * .5);
    const col = lit > .7 ? ['#E3EC9A', '#CFE07C', '#B8D161'][R() * 3 | 0] : lit > .4 ? ['#8EB04A', '#77A040', '#9DBB57'][R() * 3 | 0] : ['#2C4F22', '#3B6229', '#1E3A18', '#4E7531'][R() * 4 | 0];
    ellipse(c, x, y, 8 + R() * 26, 5 + R() * 14, col, R() * TAU);
  }
  // single lit leaves hanging in the light (top right)
  for (let i = 0; i < 70; i++) {
    const x = 560 + R() * 480, y = 40 + R() * 420, s = 10 + R() * 16, a = R() * TAU;
    c.save(); c.translate(x, y); c.rotate(a);
    c.fillStyle = ['#EAF2A8', '#D3E37E', '#BFD566'][R() * 3 | 0]; c.beginPath(); c.moveTo(-s, 0); c.quadraticCurveTo(0, -s * .55, s, 0); c.quadraticCurveTo(0, s * .55, -s, 0); c.fill(); c.restore();
  }
  // bushes in the middle distance, either side of the clearing
  for (let i = 0; i < 420; i++) {
    const left = R() < .5, x = left ? R() * 360 : 720 + R() * 360, y = 1160 + R() * 260;
    const lit = clamp(1 - (y - 1160) / 260 * .7 - Math.abs(x - 540) / 900 + (R() - .5) * .4);
    ellipse(c, x, y, 10 + R() * 22, 7 + R() * 12, mixCol('#2A4A20', '#A9C55A', lit), R() * TAU);
  }
  // the ground: deep green going into the dark foreground, a sunlit clearing round him
  g = c.createLinearGradient(0, 1330, 0, H);
  g.addColorStop(0, '#6E9440'); g.addColorStop(.35, '#5C8236'); g.addColorStop(1, '#22381A');
  c.fillStyle = g; c.beginPath(); c.moveTo(0, 1380); c.bezierCurveTo(300, 1330, 780, 1330, W, 1380); c.lineTo(W, H); c.lineTo(0, H); c.fill();
  g = c.createRadialGradient(540, 1530, 0, 540, 1530, 560); g.addColorStop(0, 'rgba(240,242,160,.95)'); g.addColorStop(.45, 'rgba(206,222,112,.75)'); g.addColorStop(1, 'rgba(160,190,80,0)');
  c.save(); c.translate(540, 1530); c.scale(1, .32); c.translate(-540, -1530); c.fillStyle = g; c.fillRect(-200, 900, 1500, 1300); c.restore();
  // his contact shadow on the grass
  g = c.createRadialGradient(540, 1535, 0, 540, 1535, 430); g.addColorStop(0, 'rgba(40,60,20,.55)'); g.addColorStop(1, 'rgba(40,60,20,0)');
  c.save(); c.translate(540, 1535); c.scale(1, .12); c.translate(-540, -1535); c.fillStyle = g; c.fillRect(0, 1000, W, 1100); c.restore();
  // grass blades
  c.lineCap = 'round';
  for (let i = 0; i < 2600; i++) {
    const x = R() * W, y = 1360 + Math.pow(R(), .8) * 580, len = 8 + (y - 1360) / 580 * 46 * (.5 + R()), lean = (R() - .5) * .8;
    const lit = clamp(1 - Math.hypot((x - 540) / 600, (y - 1530) / 220) + (R() - .5) * .3);
    c.strokeStyle = mixCol(y > 1760 ? '#162713' : '#3C6128', '#E6EE9E', lit * (y > 1760 ? .2 : 1)); c.lineWidth = 1.5 + (y - 1360) / 580 * 3;
    c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + lean * len * .5, y - len * .6, x + lean * len, y - len); c.stroke();
  }
  // little flowers: violet and white
  for (let i = 0; i < 160; i++) {
    const x = R() * W, y = 1400 + R() * 480; if (Math.abs(x - 540) < 330 && y < 1600) continue;
    ellipse(c, x, y, 3 + R() * 4, 2.5 + R() * 3, R() < .75 ? ['#7A68C8', '#9584DE', '#5E4FAE'][R() * 3 | 0] : '#F2F0E6');
  }
}

// ---------- Hanuman (design) ----------
const SK = { base: '#D4572B', dk: '#8F3016', lt: '#F28A4C', muz: '#F2A36C' };
const GOLD = { base: '#E5AE34', dk: '#94631A', lt: '#FFE38C' };
function lin(c, x0, y0, x1, y1, stops) { const g = c.createLinearGradient(x0, y0, x1, y1); stops.forEach(([k, col]) => g.addColorStop(k, col)); return g; }
function rad(c, x, y, r0, r1, stops, x1 = x, y1 = y) { const g = c.createRadialGradient(x, y, r0, x1, y1, r1); stops.forEach(([k, col]) => g.addColorStop(k, col)); return g; }
function shape(c, d, fill) { c.fillStyle = fill; c.fill(new Path2D(d)); }
function flowerChain(c, P, r, cols, R, n = 3) {
  const C = through(P, 14);
  for (let i = 0; i < C.length; i++) for (let k = 0; k < n; k++) {
    const [x, y] = C[i], a = R() * TAU, d = R() * r * .5;
    ellipse(c, x + Math.cos(a) * d, y + Math.sin(a) * d, r * (.45 + R() * .3), r * (.4 + R() * .25), cols[R() * cols.length | 0], R() * TAU);
  }
}
// a rounded form: dark under-colour, the body of the form shifted toward the light, a highlight on the lit side
function form(c, P, Wd, col, lx = 0, ly = -1, hi = .6) {
  const w0 = Wd[0], off = (k) => P.map(([x, y]) => [x + lx * w0 * k, y + ly * w0 * k]);
  limb(c, P, Wd, col.dk);
  limb(c, off(.1), Wd.map(v => v * .8), col.base);
  c.save(); c.globalAlpha = hi; limb(c, off(.24), Wd.map(v => v * .38), col.lt); c.restore();
}
// blotches of near colours over everything drawn so far (paint is never one flat colour)
function mottle(c, x0, y0, x1, y1, n, cols, R, r0 = 6, r1 = 26, a = .22) {
  c.save(); c.globalCompositeOperation = 'source-atop';
  for (let i = 0; i < n; i++) { c.globalAlpha = a * (.4 + R() * .6); ellipse(c, x0 + R() * (x1 - x0), y0 + R() * (y1 - y0), r0 + R() * (r1 - r0), r0 + R() * (r1 - r0) * .7, cols[R() * cols.length | 0], R() * TAU); }
  c.restore();
}
function lock(c, P, w, R) {   // a lock of hair: dark body and a few lit strands
  limb(c, P, [w, w * .8, w * .45, 3], '#140C09');
  for (let k = 0; k < 3; k++) { const o = (R() - .5) * w * .5; c.save(); c.globalAlpha = .35 + R() * .3; limb(c, P.map(([x, y], i) => [x + o * (1 - i / P.length), y]), [3, 2.4, 1.6, 1], ['#4A3226', '#6B4A34', '#38251C'][k]); c.restore(); }
}
function hanumanDesign(c) {
  const R = lcg(21);
  const SKN = { dk: SK.dk, base: SK.base, lt: SK.lt };
  // ---- hair behind: wavy locks from behind the ears down past the shoulders
  for (let k = 0; k < 14; k++) {
    const s = k % 2 ? 1 : -1, j = k >> 1, sp = j * 9, wv = (R() - .5) * 20;
    lock(c, [[HX + s * (48 + j * 3), 965 + j * 4], [HX + s * (78 + sp * .6), 1030 + wv], [HX + s * (110 + sp), 1100 - wv], [HX + s * (128 + sp), 1170 + j * 6]], 26 - j * 1.5, R);
  }
  // ---- the lap: padmasana under a yellow dhoti
  shape(c, `M ${HX - 118} 1338 C ${HX - 230} 1350 ${HX - 330} 1390 ${HX - 365} 1452 C ${HX - 385} 1505 ${HX - 330} 1542 ${HX - 210} 1540
            C ${HX - 90} 1534 ${HX + 90} 1534 ${HX + 210} 1540 C ${HX + 330} 1542 ${HX + 385} 1505 ${HX + 365} 1452 C ${HX + 330} 1390 ${HX + 230} 1350 ${HX + 118} 1338 Z`,
    lin(c, 0, 1338, 0, 1536, [[0, '#F4BC50'], [.55, '#E09A32'], [1, '#A65B1C']]));
  // knees: rounded masses, lit on top
  for (const s of [-1, 1]) { ellipse(c, HX + s * 300, 1455, 78, 50, 'rgba(255,214,120,.5)', s * -.2); ellipse(c, HX + s * 300, 1515, 80, 26, 'rgba(120,58,16,.5)', s * -.1); ellipse(c, HX + s * 190, 1500, 70, 30, 'rgba(120,58,16,.35)'); }
  // folds running in from the knees
  c.lineCap = 'round';
  for (let i = 0; i < 14; i++) {
    const s = i % 2 ? 1 : -1, k = (i >> 1) / 7, x0 = HX + s * (345 - k * 220), y0 = 1450 + (R() - .5) * 50;
    c.strokeStyle = R() < .5 ? 'rgba(150,78,20,.5)' : 'rgba(255,220,130,.55)'; c.lineWidth = 4 + R() * 7;
    c.beginPath(); c.moveTo(x0, y0); c.quadraticCurveTo(x0 - s * 60, y0 + (R() - .3) * 30, x0 - s * (110 + R() * 60), y0 + 25 + (R() - .5) * 40); c.stroke();
  }
  // the shins crossing, and the feet sole-up on the thighs
  shape(c, `M ${HX - 310} 1478 C ${HX - 200} 1446 ${HX - 40} 1452 ${HX + 90} 1486 C ${HX + 50} 1512 ${HX - 210} 1514 ${HX - 310} 1508 Z`, lin(c, 0, 1446, 0, 1514, [[0, '#EFAE46'], [1, '#B26820']]));
  shape(c, `M ${HX + 310} 1456 C ${HX + 200} 1428 ${HX + 40} 1436 ${HX - 90} 1466 C ${HX - 50} 1490 ${HX + 210} 1494 ${HX + 310} 1488 Z`, lin(c, 0, 1428, 0, 1494, [[0, '#F6BA52'], [1, '#C27424']]));
  for (const s of [-1, 1]) {
    const fx = HX + s * 112, fy = 1455 - (s > 0 ? 20 : 0);
    ellipse(c, fx, fy + 4, 54, 24, SK.dk, s * .14); ellipse(c, fx, fy, 50, 20, SK.base, s * .14); ellipse(c, fx - s * 6, fy - 3, 34, 11, SK.muz, s * .14);
    for (let k = 0; k < 5; k++) ellipse(c, fx - s * (44 - k * 1.5), fy - 15 + k * 7, 6.5, 5, k ? SK.lt : '#F7A870');
    ellipse(c, fx + s * 30, fy + 10, 9, 7, GOLD.base);   // anklet
  }

  // ---- torso
  const torso = `M ${HX - 45} 1062 C ${HX - 90} 1080 ${HX - 140} 1090 ${HX - 168} 1110 C ${HX - 190} 1160 ${HX - 165} 1230 ${HX - 150} 1260
                 C ${HX - 135} 1295 ${HX - 122} 1320 ${HX - 118} 1345 L ${HX + 118} 1345 C ${HX + 122} 1320 ${HX + 135} 1295 ${HX + 150} 1260
                 C ${HX + 165} 1230 ${HX + 190} 1160 ${HX + 168} 1110 C ${HX + 140} 1090 ${HX + 90} 1080 ${HX + 45} 1062 Z`;
  shape(c, torso, rad(c, HX, 1150, 10, 280, [[0, SK.lt], [.5, SK.base], [1, SK.dk]], HX, 1210));
  inside(c, torso, () => {
    for (const s of [-1, 1]) {
      ellipse(c, HX + s * 66, 1160, 70, 48, 'rgba(250,150,90,.5)', s * .18);                 // pecs, lit
      ellipse(c, HX + s * 66, 1214, 66, 14, 'rgba(110,30,12,.45)', s * .1);                  // under the pecs
      for (let r = 0; r < 3; r++) ellipse(c, HX + s * 26, 1250 + r * 30, 22, 13, 'rgba(250,150,95,.3)');   // abdomen
      ellipse(c, HX + s * 150, 1250, 40, 120, 'rgba(110,30,12,.4)');                           // flanks in shade
    }
    ellipse(c, HX, 1100, 70, 26, 'rgba(110,30,12,.35)');   // the pit of the neck
  });
  // gold waist band and the dhoti's top fold
  limb(c, [[HX - 122, 1340], [HX, 1350], [HX + 122, 1340]], [20, 22, 20], GOLD.base, false);
  limb(c, [[HX - 120, 1335], [HX, 1344], [HX + 120, 1335]], [5, 5, 5], GOLD.lt, false);

  // ---- the red uttariya: over the shoulders, down behind the arms, ends fluttering past the elbows
  for (const s of [-1, 1]) shape(c, `M ${HX + s * 90} 1080 C ${HX + s * 190} 1078 ${HX + s * 250} 1120 ${HX + s * 262} 1190 C ${HX + s * 275} 1270 ${HX + s * 290} 1340 ${HX + s * 312} 1404
      C ${HX + s * 258} 1418 ${HX + s * 222} 1400 ${HX + s * 206} 1340 C ${HX + s * 190} 1260 ${HX + s * 170} 1170 ${HX + s * 110} 1120 Z`,
    lin(c, 0, 1080, 0, 1420, [[0, '#D8402C'], [.5, '#AA281C'], [1, '#701812']]));

  // ---- arms
  for (const s of [-1, 1]) {
    const sh = [HX + s * 178, 1135], el = [HX + s * 236, 1308], wr = [HX + s * 282, 1418];
    ellipse(c, sh[0] + s * 4, sh[1] + 4, 62, 56, SK.dk); ellipse(c, sh[0] + s * 2, sh[1] - 2, 56, 50, SK.base); ellipse(c, sh[0] - s * 6, sh[1] - 16, 30, 22, 'rgba(250,150,90,.7)');   // deltoid
    form(c, [[sh[0] + s * 4, sh[1] + 20], [HX + s * 218, 1225], el], [100, 94, 70], SKN, -s * .25, -.9);
    form(c, [el, [HX + s * 262, 1372], wr], [70, 62, 48], SKN, -s * .4, -.8, .5);
    // armband with a red stone, wrist bangle
    limb(c, [[HX + s * 180, 1184], [HX + s * 208, 1190], [HX + s * 236, 1186]], [18, 20, 18], GOLD.base); ellipse(c, HX + s * 208, 1188, 10, 9, '#B81E24'); ellipse(c, HX + s * 206, 1185, 3, 3, '#FF9AA0');
    limb(c, [[HX + s * 268, 1406], [HX + s * 294, 1398]], [19, 19], GOLD.base); limb(c, [[HX + s * 268, 1402], [HX + s * 294, 1394]], [4, 4], GOLD.lt);
    // hand resting palm-up on the knee in jnana mudra: three fingers out, thumb and first finger touching
    ellipse(c, wr[0] + s * 16, wr[1] + 22, 30, 21, SK.dk, s * .5); ellipse(c, wr[0] + s * 14, wr[1] + 18, 28, 19, SK.base, s * .5);
    for (let k = 0; k < 3; k++) form(c, [[wr[0] + s * (26 + k * 2), wr[1] + 26 + k * 8], [wr[0] + s * (46 + k * 2), wr[1] + 34 + k * 8], [wr[0] + s * (62 + k * 1), wr[1] + 38 + k * 9]], [12, 10, 8], SKN, 0, -1, .5);
    c.strokeStyle = SK.base; c.lineWidth = 9; c.beginPath(); c.arc(wr[0] + s * 34, wr[1] + 6, 10, 0, TAU); c.stroke();
    c.strokeStyle = SK.lt; c.lineWidth = 3; c.beginPath(); c.arc(wr[0] + s * 34, wr[1] + 4, 10, Math.PI * 1.1, Math.PI * 1.9); c.stroke();
  }
  mottle(c, HX - 420, 1060, HX + 420, 1540, 500, [SK.dk, SK.lt, '#E86A34', '#B8401E', '#F7B24A', '#C77A26'], R, 6, 24, .18);

  // ---- neck, trapezius
  shape(c, `M ${HX - 38} 1040 L ${HX + 38} 1040 C ${HX + 44} 1070 ${HX + 70} 1084 ${HX + 110} 1092 L ${HX - 110} 1092 C ${HX - 70} 1084 ${HX - 44} 1070 ${HX - 38} 1040 Z`,
    lin(c, 0, 1040, 0, 1092, [[0, SK.dk], [1, SK.base]]));
  // hair in front: two locks over each shoulder
  for (const s of [-1, 1]) for (let k = 0; k < 2; k++) lock(c, [[HX + s * (50 + k * 8), 975], [HX + s * (66 + k * 10), 1040], [HX + s * (92 + k * 14), 1110], [HX + s * (100 + k * 18), 1172]], 20 - k * 4, R);
  // sacred thread
  c.strokeStyle = '#F7EED0'; c.lineWidth = 4; c.beginPath(); c.moveTo(HX - 112, 1100); c.quadraticCurveTo(HX - 20, 1240, HX + 112, 1342); c.stroke();
  // gold necklaces
  c.strokeStyle = GOLD.dk; c.lineWidth = 9; c.beginPath(); c.ellipse(HX, 1086, 50, 30, 0, .15, Math.PI - .15); c.stroke();
  c.strokeStyle = GOLD.base; c.lineWidth = 6; c.beginPath(); c.ellipse(HX, 1084, 50, 30, 0, .15, Math.PI - .15); c.stroke();
  c.lineWidth = 5; c.beginPath(); c.ellipse(HX, 1098, 70, 72, 0, .3, Math.PI - .3); c.stroke();
  ellipse(c, HX, 1170, 15, 19, GOLD.base); ellipse(c, HX, 1170, 8, 10, '#B81E24'); ellipse(c, HX - 2, 1166, 3, 3, '#FF9AA0');
  // garlands: white flowers to the belly, marigold with leaves to the lap
  flowerChain(c, [[HX - 100, 1094], [HX - 112, 1220], [HX - 92, 1360], [HX - 36, 1440], [HX + 36, 1440], [HX + 92, 1360], [HX + 112, 1220], [HX + 100, 1094]], 6, ['#3E7A2E', '#5C9A3A', '#2E5E22'], R, 1);
  flowerChain(c, [[HX - 110, 1094], [HX - 124, 1220], [HX - 104, 1364], [HX - 40, 1448], [HX + 40, 1448], [HX + 104, 1364], [HX + 124, 1220], [HX + 110, 1094]], 13, ['#F6971C', '#F7B22A', '#E8761A', '#FBC93C', '#D9601A'], R, 2);
  flowerChain(c, [[HX - 80, 1088], [HX - 90, 1180], [HX - 64, 1282], [HX, 1326], [HX + 64, 1282], [HX + 90, 1180], [HX + 80, 1088]], 15, ['#F6F3EA', '#E9E6EF', '#D3CDE6', '#FFFFFF', '#B8B1D6', '#C9C3E0'], R, 3);

  // ---- the head
  for (const s of [-1, 1]) {   // ears with gold kundals
    ellipse(c, HX + s * 56, 1002, 15, 21, SK.base); ellipse(c, HX + s * 57, 1004, 8, 13, SK.dk);
    ellipse(c, HX + s * 60, 1038, 10, 13, GOLD.base); ellipse(c, HX + s * 60, 1036, 4, 6, GOLD.lt); ellipse(c, HX + s * 60, 1052, 4, 4, '#B81E24');
  }
  shape(c, `M ${HX - 52} 970 C ${HX - 56} 1010 ${HX - 46} 1050 ${HX} 1066 C ${HX + 46} 1050 ${HX + 56} 1010 ${HX + 52} 970 C ${HX + 30} 948 ${HX - 30} 948 ${HX - 52} 970 Z`,
    rad(c, HX, 990, 5, 80, [[0, SK.lt], [.6, SK.base], [1, SK.dk]], HX, 1010));
  ellipse(c, HX, 1032, 36, 27, SK.muz); ellipse(c, HX, 1040, 30, 18, 'rgba(255,190,140,.6)');
  ellipse(c, HX, 1058, 22, 7, 'rgba(140,50,20,.35)');   // under the chin
  for (const s of [-1, 1]) {
    c.strokeStyle = '#4A1A0C'; c.lineWidth = 6; c.beginPath(); c.moveTo(HX + s * 8, 984); c.quadraticCurveTo(HX + s * 24, 976, HX + s * 42, 984); c.stroke();
    c.strokeStyle = '#2A0E06'; c.lineWidth = 3.4; c.beginPath(); c.moveTo(HX + s * 11, 999); c.quadraticCurveTo(HX + s * 24, 1006, HX + s * 37, 998); c.stroke();
    ellipse(c, HX + s * 24, 993, 13, 5, 'rgba(255,170,110,.5)');
    ellipse(c, HX + s * 34, 1022, 12, 8, 'rgba(255,120,90,.25)');   // cheeks
  }
  ellipse(c, HX, 1020, 9, 6, '#7E2A12'); ellipse(c, HX - 5, 1022, 2.6, 2, '#2A0E06'); ellipse(c, HX + 5, 1022, 2.6, 2, '#2A0E06');
  c.strokeStyle = '#6A200E'; c.lineWidth = 3; c.beginPath(); c.moveTo(HX - 18, 1044); c.quadraticCurveTo(HX, 1052, HX + 18, 1044); c.stroke();
  c.strokeStyle = '#FFFFFF'; c.lineWidth = 5; c.beginPath(); c.moveTo(HX - 9, 950); c.lineTo(HX - 7, 976); c.quadraticCurveTo(HX, 984, HX + 7, 976); c.lineTo(HX + 9, 950); c.stroke();
  c.strokeStyle = '#D6141E'; c.lineWidth = 5; c.beginPath(); c.moveTo(HX, 952); c.lineTo(HX, 978); c.stroke();
  shape(c, `M ${HX - 60} 972 C ${HX - 58} 940 ${HX + 58} 940 ${HX + 60} 972 C ${HX + 40} 952 ${HX - 40} 952 ${HX - 60} 972 Z`, '#17100D');

  // ---- the mukut: a jewelled band, two tiers of gold petals, a domed top and a spire, side fans over the ears
  const gl = lin(c, HX - 70, 0, HX + 70, 0, [[0, GOLD.dk], [.3, GOLD.lt], [.55, GOLD.base], [1, GOLD.dk]]);
  for (const s of [-1, 1]) shape(c, `M ${HX + s * 50} 958 C ${HX + s * 80} 940 ${HX + s * 96} 905 ${HX + s * 88} 878 C ${HX + s * 78} 905 ${HX + s * 66} 925 ${HX + s * 40} 935 Z`, gl);
  shape(c, `M ${HX - 62} 958 L ${HX - 58} 925 L ${HX + 58} 925 L ${HX + 62} 958 Z`, gl);                          // band
  for (let k = -2; k <= 2; k++) { ellipse(c, HX + k * 23, 943, 7, 7, GOLD.dk); ellipse(c, HX + k * 23, 942, 5.5, 5.5, k ? '#B81E24' : '#2C8A4A'); }
  for (let k = -3; k <= 3; k++) { const x = HX + k * 17; shape(c, `M ${x - 11} 928 Q ${x - 10} 900 ${x} 885 Q ${x + 10} 900 ${x + 11} 928 Z`, k % 2 ? GOLD.base : GOLD.lt); }   // petals
  shape(c, `M ${HX - 46} 905 C ${HX - 44} 868 ${HX - 24} 850 ${HX} 846 C ${HX + 24} 850 ${HX + 44} 868 ${HX + 46} 905 Z`, gl);   // dome
  for (let k = -2; k <= 2; k++) { const x = HX + k * 15; shape(c, `M ${x - 8} 872 Q ${x} 850 ${x + 8} 872 Z`, GOLD.lt); }
  ellipse(c, HX, 880, 13, 16, GOLD.dk); ellipse(c, HX, 879, 10, 13, '#B81E24'); ellipse(c, HX - 3, 874, 3.5, 4, '#FF9AA0');
  shape(c, `M ${HX - 12} 850 Q ${HX - 6} 826 ${HX} 800 Q ${HX + 6} 826 ${HX + 12} 850 Z`, gl);                     // spire
  ellipse(c, HX, 818, 7, 8, GOLD.lt); ellipse(c, HX, 798, 5, 7, GOLD.lt);
  mottle(c, HX - 100, 790, HX + 100, 960, 60, [GOLD.lt, GOLD.dk, '#FFF3B8', '#C98A22'], R, 3, 9, .2);
  c.save(); c.globalCompositeOperation = 'source-atop';
  c.fillStyle = lin(c, 0, 800, 0, 1545, [[0, 'rgba(255,244,190,.18)'], [.55, 'rgba(255,240,190,0)'], [.85, 'rgba(70,100,30,.04)'], [1, 'rgba(50,80,20,.14)']]); c.fillRect(0, 780, W, 780);
  c.restore();
}

// ---------- the gada (design) ----------
function gadaDesign(c) {
  const x = 985, y = 1430, r = 72;
  limb(c, [[x - 6, y - r + 10], [x - 14, 1100], [x - 20, 980]], [30, 28, 24], lin(c, x - 30, 0, x + 10, 0, [[0, GOLD.dk], [.5, GOLD.lt], [1, GOLD.dk]]));
  ellipse(c, x - 20, 975, 14, 18, GOLD.base); ellipse(c, x - 21, 958, 7, 12, GOLD.lt);
  for (const yy of [1080, 1180, 1290]) ellipse(c, x - 14 + (1290 - yy) * -.04, yy, 18, 8, GOLD.dk);
  ellipse(c, x, y, r, r * .92, rad(c, x - 22, y - 26, 4, r * 1.1, [[0, GOLD.lt], [.4, GOLD.base], [1, GOLD.dk]]));
  for (let k = -2; k <= 2; k++) { c.strokeStyle = 'rgba(120,70,15,.6)'; c.lineWidth = 4; c.beginPath(); c.ellipse(x, y, Math.abs(k) * 17 + 3, r * .9, 0, -Math.PI / 2, Math.PI / 2, k < 0); c.stroke(); }
  ellipse(c, x, y - r * .78, 30, 9, GOLD.dk); ellipse(c, x, y + r * .8, 26, 8, GOLD.dk);
}

// ---------- the tail (design, one pose per phase) ----------
function tailPts(ph) {
  const sw = Math.sin(ph * TAU), sw2 = Math.sin(ph * TAU - .9);
  const P = [[HX + 60, 1320], [HX + 120, 1230], [HX + 165, 1120], [HX + 170, 1030]];
  // the upper tail sways side to side; the curl at the tip turns with it
  const top = [[HX + 110 + sw * 30, 900], [HX + 50 + sw * 55, 820], [HX - 10 + sw * 70, 790]];
  const curl = [[HX - 50 + sw2 * 80, 805], [HX - 62 + sw2 * 86, 850], [HX - 40 + sw2 * 82, 880]];
  return [...P, ...top, ...curl];
}
function tailDesign(ph) {
  return (c) => {
    const P = tailPts(ph), n = P.length, Wd = P.map((_, i) => 30 - i * 1.8);
    limb(c, P, Wd, lin(c, 0, 800, 0, 1400, [[0, SK.lt], [.5, SK.base], [1, SK.dk]]));
    c.save(); c.globalAlpha = .5; limb(c, P.map(([x, y]) => [x - 5, y - 3]), Wd.map(v => v * .35), '#FFB47A'); c.restore();
    // tuft at the tip
    const [tx, ty] = P[n - 1];
    ellipse(c, tx, ty + 8, 16, 22, '#9C2E12');
  };
}

// ---------- the scene ----------
const LP = TAU / DUR;                         // one turn per loop: sin(n * LP * t) repeats exactly
const TAIL_N = 18, TAIL_CYCLE = DUR / 5;      // poses, seconds per sway (five sways a loop)
const TAIL_BOX = [HX - 220, 740, 480, 700];
const LYRICS = [
  [0, 6.14, 'जल थल गगन मण्डल में राम', 'JAL THAL GAGAN MANDAL MEIN RAM'],
  [6.14, 12.3, 'राम ही पार लगावेंगे', 'RAM HI PAAR LAGAVENGE'],
];
// draw(t) and draw(t - DUR) crossfaded across the loop: anything that drifts comes back to where it started
const looped = (t, draw) => { const u = t / DUR; draw(t, 1 - u); draw(t - DUR, u); };

SHOTS.push({
  a: 0, b: DUR, draw(c, u, t) {
    const plate = ptLayer('forest', [0, 0, W, H], forestDesign, { seed: 5 });
    ptDraw(c, plate);
    // god rays from the break in the canopy
    looped(t, (tt, k) => rays(c, LIGHT[0] + 60, LIGHT[1] - 520, { n: 14, dir: Math.PI / 2 + .12, spread: .9, len: 1700, w: 190, col: '#FFF6C4', a: (.16 + .05 * Math.sin(tt * 2 * LP)) * k, t: tt, seed: 3 }));
    // a warm glow behind him
    glow(c, HX, 1000, 420, '#FFF3B0', .3 + .06 * Math.sin(t * 3 * LP), 'screen');
    // tail behind him: stepped through baked poses
    const k = Math.floor((t / TAIL_CYCLE) * TAIL_N) % TAIL_N;
    const tail = ptLayer('tail' + k, TAIL_BOX, tailDesign(k / TAIL_N), { alpha: true, seed: 9, brushes: PT_BRUSHES.slice(2) });
    ptDraw(c, tail);
    const gada = ptLayer('gada', [880, 930, 200, 560], gadaDesign, { alpha: true, seed: 13, brushes: PT_BRUSHES.slice(1) });
    ptDraw(c, gada);
    const hero = ptLayer('hanuman', [HX - 420, 790, 840, 760], hanumanDesign, {
      alpha: true, seed: 17, brushes: PT_BRUSHES.slice(1),
      fine: [[HX, 1000, 75], [HX - 300, 1440, 50], [HX + 300, 1440, 50]], keep: [[HX, 1005, 62, .55]],
    });
    ptDraw(c, hero);
    // rim light on him, breathing
    const rim = ptRim(hero, { dx: 0, dy: -5, col: '#FFF0A8', blur: 6, key: 'h' });
    ptDraw(c, rim, .5 + .15 * Math.sin(t * 3 * LP), 'screen');
    // "राम" in rings round him, turning a little one way and back
    [[190, 175, .7, 25], [255, 245, .62, 25], [320, 315, .52, 23], [385, 385, .42, 23]].forEach(([rx, ry, a, size], i) =>
      nameRing(c, HX, HY + 40, rx, ry, -Math.PI * 1.08, Math.PI * .08, 'राम', { size, a, rot: (i % 2 ? -1 : 1) * .09 * Math.sin(t * LP + i), ph: t * 6 * LP, seed: i * 3, shimmer: .5 }));
    // dust in the light, sparkles on his rim
    looped(t, (tt, k) => motes(c, { n: 70, seed: 4, box: [80, 300, 1000, 1500], r: 3.2, col: '#FFF6C8', a: .7 * k, vx: 6, vy: -10, t: tt }));
    rim.pts.forEach(([x, y], i) => {
      const rate = Math.max(1, Math.round((.35 + hash(i) * .4) * DUR)) / DUR, ph = frac(t * rate + hash(i + 9));
      twinkle(c, x, y, 9 + hash(i + 3) * 8, Math.pow(Math.max(0, Math.sin(ph * Math.PI)), 6) * .9);
    });
    // the bhajan's line over him, in Devanagari with the words in Roman letters under it
    for (const [a, b, top, bot] of LYRICS) {
      if (t < a || t > b) continue;
      const v = Math.min(a === 0 ? 1 : seg(t, a, a + .4), 1 - seg(t, b - .5, b));
      c.save(); c.globalAlpha = v * .5; c.translate(HX, 1290); c.scale(1, .2); glow(c, 0, 0, 430, '#1E0E04', 1, 'source-over'); c.restore();   // a soft scrim so the words read over the garlands
      text(c, top, HX, 1262, '46px "Tiro Devanagari Sanskrit"', '#FFFDF2', { alpha: v, glow: ['rgba(50,22,6,.85)', 18], maxW: 760 });
      text(c, bot, HX, 1322, '600 24px Poppins', '#FFF0C8', { alpha: v, spacing: 4, glow: ['rgba(50,22,6,.85)', 12], maxW: 760 });
    }
  }
});
LOOK.bloom = .22; LOOK.vignette = .45; LOOK.grain = .045;
