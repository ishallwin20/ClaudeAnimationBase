// pt_cast.js: the Painterly style's shared cast and sets (see PAINTERLY_GUIDE.md). Each is a DESIGN: clean canvas shapes
// drawn in the reel's 1080×1920 frame px, which ptLayer() bakes into a painting. Use them as they are or draw over them.
//   ptForest(c, top)    a sunlit forest clearing: backlit trunks, a leafy canopy, bushes, a lit clearing, grass and violet
//                       flowers, his contact shadow; the sun breaks through at PT_SUN. top < 0 extends it upward.
//   ptHanuman(c)        Hanuman seated in padmasana, eyes closed (face centre PT_HX, PT_HY): mukut, tilak, kundals,
//                       wavy locks, red uttariya, sacred thread, gold, white and marigold garlands, a yellow dhoti, hands in
//                       jnana mudra on the knees. Bake with fine: [[PT_HX, 1000, 75], ...] and keep: [[PT_HX, 1005, 62, .55]].
//   ptTail(ph)          his tail rising behind him and curling over the crown, as a design for sway phase ph (0..1);
//                       bake a few phases into poses and cycle them (box PT_TAIL_BOX).
//   ptGada(c)           his gold gada standing on its head at his right (box [880, 930, 200, 560]).
const PT_W = 1080, PT_H = 1920;
const PT_SUN = [540, 640];          // where the sun breaks through the canopy
const PT_HX = 540, PT_HY = 1000;         // the centre of his face

// ---------- the forest (design) ----------
function ptForest(c, top = 0) {   // top < 0: the canopy and trunks go on up to y = top (a taller frame)
  const R = lcg(11);
  // the backlit depth of the forest: bright yellow-green at the light, deep green at the edges
  let g = c.createRadialGradient(PT_SUN[0], PT_SUN[1], 30, PT_SUN[0], PT_SUN[1] + 200, 1250);
  [[0, '#FCF8CF'], [.12, '#EEF0A6'], [.3, '#BFD27A'], [.5, '#7FA04F'], [.75, '#456A31'], [1, '#22391A']].forEach(([k, col]) => g.addColorStop(k, col));
  c.fillStyle = g; c.fillRect(0, top, PT_W, PT_H - top);
  // far trunks, pale and blue in the haze
  for (let i = 0; i < 30; i++) {
    const x = 120 + R() * 840, wd = 8 + R() * 18, near = Math.abs(x - PT_SUN[0]) / 500;
    c.fillStyle = mixCol('#C9D9B0', '#7F9C7A', clamp(near + R() * .2));
    c.globalAlpha = .55 + R() * .3; c.fillRect(x, 120 + R() * 200, wd, 1150); c.globalAlpha = 1;
  }
  // distant leaf masses, light
  for (let i = 0; i < 160; i++) {
    const x = R() * PT_W, y = 150 + R() * 900, d = Math.hypot(x - PT_SUN[0], y - PT_SUN[1]) / 700;
    ellipse(c, x, y, 20 + R() * 50, 14 + R() * 30, mixCol('#E2EAA0', '#6E9246', clamp(d + R() * .2)), R() * 3);
  }
  // middle trunks, darker, slightly leaning, with a lit edge
  for (let i = 0; i < 9; i++) {
    const x = [70, 190, 300, 380, 700, 790, 880, 990, 250][i] + (R() - .5) * 30, wd = 26 + R() * 34, lean = (R() - .5) * 60;
    const d = clamp(Math.abs(x - PT_SUN[0]) / 520);
    poly(c, [[x - wd / 2 + lean, top], [x + wd / 2 + lean, top], [x + wd * .6, 1330], [x - wd * .6, 1330]], mixCol('#7D9566', '#3D5232', d));
    c.globalAlpha = .5; poly(c, [[x + wd * .2 + lean, top], [x + wd / 2 + lean, top], [x + wd * .6, 1330], [x + wd * .3, 1330]], mixCol('#C6D58E', '#6E8A4E', d)); c.globalAlpha = 1;
  }
  // a veil of light in the air
  g = c.createRadialGradient(PT_SUN[0], PT_SUN[1] + 150, 0, PT_SUN[0], PT_SUN[1] + 150, 620);
  g.addColorStop(0, 'rgba(252,250,205,.75)'); g.addColorStop(.5, 'rgba(232,240,170,.3)'); g.addColorStop(1, 'rgba(232,240,170,0)');
  c.fillStyle = g; c.fillRect(0, 0, PT_W, PT_H);
  // near trunks at the edges: big, dark, mossy, with branches into the canopy
  const trunk = (pts, wd, col, lit) => {
    if (top < 0 && pts[pts.length - 1][1] < 0) { pts = [...pts, [pts[pts.length - 1][0], top - 40]]; wd = [...wd, wd[wd.length - 1]]; }
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
    const side = R(), x = side < .5 ? R() * 520 : 560 + R() * 520, y = top - 40 + Math.pow(R(), 1.6) * (620 - top) + (Math.abs(x - 540) > 380 ? R() * 400 : 0);
    const d = Math.hypot(x - PT_SUN[0], (y - PT_SUN[1]) * 1.3) / 650, lit = clamp(1 - d + (R() - .5) * .5);
    const col = lit > .7 ? ['#E3EC9A', '#CFE07C', '#B8D161'][R() * 3 | 0] : lit > .4 ? ['#8EB04A', '#77A040', '#9DBB57'][R() * 3 | 0] : ['#2C4F22', '#3B6229', '#1E3A18', '#4E7531'][R() * 4 | 0];
    ellipse(c, x, y, 8 + R() * 26, 5 + R() * 14, col, R() * TAU);
  }
  // single lit leaves hanging in the light (top right)
  for (let i = 0; i < 70; i++) {
    const x = 560 + R() * 480, y = 40 + top * .6 + R() * (420 - top * .6), s = 10 + R() * 16, a = R() * TAU;
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
  g = c.createLinearGradient(0, 1330, 0, PT_H);
  g.addColorStop(0, '#6E9440'); g.addColorStop(.35, '#5C8236'); g.addColorStop(1, '#22381A');
  c.fillStyle = g; c.beginPath(); c.moveTo(0, 1380); c.bezierCurveTo(300, 1330, 780, 1330, PT_W, 1380); c.lineTo(PT_W, PT_H); c.lineTo(0, PT_H); c.fill();
  g = c.createRadialGradient(540, 1530, 0, 540, 1530, 560); g.addColorStop(0, 'rgba(240,242,160,.95)'); g.addColorStop(.45, 'rgba(206,222,112,.75)'); g.addColorStop(1, 'rgba(160,190,80,0)');
  c.save(); c.translate(540, 1530); c.scale(1, .32); c.translate(-540, -1530); c.fillStyle = g; c.fillRect(-200, 900, 1500, 1300); c.restore();
  // his contact shadow on the grass
  g = c.createRadialGradient(540, 1535, 0, 540, 1535, 430); g.addColorStop(0, 'rgba(40,60,20,.55)'); g.addColorStop(1, 'rgba(40,60,20,0)');
  c.save(); c.translate(540, 1535); c.scale(1, .12); c.translate(-540, -1535); c.fillStyle = g; c.fillRect(0, 1000, PT_W, 1100); c.restore();
  // grass blades
  c.lineCap = 'round';
  for (let i = 0; i < 2600; i++) {
    const x = R() * PT_W, y = 1360 + Math.pow(R(), .8) * 580, len = 8 + (y - 1360) / 580 * 46 * (.5 + R()), lean = (R() - .5) * .8;
    const lit = clamp(1 - Math.hypot((x - 540) / 600, (y - 1530) / 220) + (R() - .5) * .3);
    c.strokeStyle = mixCol(y > 1760 ? '#162713' : '#3C6128', '#E6EE9E', lit * (y > 1760 ? .2 : 1)); c.lineWidth = 1.5 + (y - 1360) / 580 * 3;
    c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + lean * len * .5, y - len * .6, x + lean * len, y - len); c.stroke();
  }
  // little flowers: violet and white
  for (let i = 0; i < 160; i++) {
    const x = R() * PT_W, y = 1400 + R() * 480; if (Math.abs(x - 540) < 330 && y < 1600) continue;
    ellipse(c, x, y, 3 + R() * 4, 2.5 + R() * 3, R() < .75 ? ['#7A68C8', '#9584DE', '#5E4FAE'][R() * 3 | 0] : '#F2F0E6');
  }
}

// ---------- Hanuman in meditation (design) ----------
const PT_SKIN = { base: '#D4572B', dk: '#8F3016', lt: '#F28A4C', muz: '#F2A36C' };
const PT_GOLD = { base: '#E5AE34', dk: '#94631A', lt: '#FFE38C' };
function ptHanuman(c) {
  const R = lcg(21);
  const skin = { dk: PT_SKIN.dk, base: PT_SKIN.base, lt: PT_SKIN.lt };
  // ---- hair behind: wavy locks from behind the ears down past the shoulders
  for (let k = 0; k < 14; k++) {
    const s = k % 2 ? 1 : -1, j = k >> 1, sp = j * 9, wv = (R() - .5) * 20;
    ptLock(c, [[PT_HX + s * (48 + j * 3), 965 + j * 4], [PT_HX + s * (78 + sp * .6), 1030 + wv], [PT_HX + s * (110 + sp), 1100 - wv], [PT_HX + s * (128 + sp), 1170 + j * 6]], 26 - j * 1.5, R);
  }
  // ---- the lap: padmasana under a yellow dhoti
  ptShape(c, `M ${PT_HX - 118} 1338 C ${PT_HX - 230} 1350 ${PT_HX - 330} 1390 ${PT_HX - 365} 1452 C ${PT_HX - 385} 1505 ${PT_HX - 330} 1542 ${PT_HX - 210} 1540
            C ${PT_HX - 90} 1534 ${PT_HX + 90} 1534 ${PT_HX + 210} 1540 C ${PT_HX + 330} 1542 ${PT_HX + 385} 1505 ${PT_HX + 365} 1452 C ${PT_HX + 330} 1390 ${PT_HX + 230} 1350 ${PT_HX + 118} 1338 Z`,
    ptLin(c, 0, 1338, 0, 1536, [[0, '#F4BC50'], [.55, '#E09A32'], [1, '#A65B1C']]));
  // knees: rounded masses, lit on top
  for (const s of [-1, 1]) { ellipse(c, PT_HX + s * 300, 1455, 78, 50, 'rgba(255,214,120,.5)', s * -.2); ellipse(c, PT_HX + s * 300, 1515, 80, 26, 'rgba(120,58,16,.5)', s * -.1); ellipse(c, PT_HX + s * 190, 1500, 70, 30, 'rgba(120,58,16,.35)'); }
  // folds running in from the knees
  c.lineCap = 'round';
  for (let i = 0; i < 14; i++) {
    const s = i % 2 ? 1 : -1, k = (i >> 1) / 7, x0 = PT_HX + s * (345 - k * 220), y0 = 1450 + (R() - .5) * 50;
    c.strokeStyle = R() < .5 ? 'rgba(150,78,20,.5)' : 'rgba(255,220,130,.55)'; c.lineWidth = 4 + R() * 7;
    c.beginPath(); c.moveTo(x0, y0); c.quadraticCurveTo(x0 - s * 60, y0 + (R() - .3) * 30, x0 - s * (110 + R() * 60), y0 + 25 + (R() - .5) * 40); c.stroke();
  }
  // the shins crossing, and the feet sole-up on the thighs
  ptShape(c, `M ${PT_HX - 310} 1478 C ${PT_HX - 200} 1446 ${PT_HX - 40} 1452 ${PT_HX + 90} 1486 C ${PT_HX + 50} 1512 ${PT_HX - 210} 1514 ${PT_HX - 310} 1508 Z`, ptLin(c, 0, 1446, 0, 1514, [[0, '#EFAE46'], [1, '#B26820']]));
  ptShape(c, `M ${PT_HX + 310} 1456 C ${PT_HX + 200} 1428 ${PT_HX + 40} 1436 ${PT_HX - 90} 1466 C ${PT_HX - 50} 1490 ${PT_HX + 210} 1494 ${PT_HX + 310} 1488 Z`, ptLin(c, 0, 1428, 0, 1494, [[0, '#F6BA52'], [1, '#C27424']]));
  for (const s of [-1, 1]) {
    const fx = PT_HX + s * 112, fy = 1455 - (s > 0 ? 20 : 0);
    ellipse(c, fx, fy + 4, 54, 24, PT_SKIN.dk, s * .14); ellipse(c, fx, fy, 50, 20, PT_SKIN.base, s * .14); ellipse(c, fx - s * 6, fy - 3, 34, 11, PT_SKIN.muz, s * .14);
    for (let k = 0; k < 5; k++) ellipse(c, fx - s * (44 - k * 1.5), fy - 15 + k * 7, 6.5, 5, k ? PT_SKIN.lt : '#F7A870');
    ellipse(c, fx + s * 30, fy + 10, 9, 7, PT_GOLD.base);   // anklet
  }

  // ---- torso
  const torso = `M ${PT_HX - 45} 1062 C ${PT_HX - 90} 1080 ${PT_HX - 140} 1090 ${PT_HX - 168} 1110 C ${PT_HX - 190} 1160 ${PT_HX - 165} 1230 ${PT_HX - 150} 1260
                 C ${PT_HX - 135} 1295 ${PT_HX - 122} 1320 ${PT_HX - 118} 1345 L ${PT_HX + 118} 1345 C ${PT_HX + 122} 1320 ${PT_HX + 135} 1295 ${PT_HX + 150} 1260
                 C ${PT_HX + 165} 1230 ${PT_HX + 190} 1160 ${PT_HX + 168} 1110 C ${PT_HX + 140} 1090 ${PT_HX + 90} 1080 ${PT_HX + 45} 1062 Z`;
  ptShape(c, torso, ptRad(c, PT_HX, 1150, 10, 280, [[0, PT_SKIN.lt], [.5, PT_SKIN.base], [1, PT_SKIN.dk]], PT_HX, 1210));
  inside(c, torso, () => {
    for (const s of [-1, 1]) {
      ellipse(c, PT_HX + s * 66, 1160, 70, 48, 'rgba(250,150,90,.5)', s * .18);                 // pecs, lit
      ellipse(c, PT_HX + s * 66, 1214, 66, 14, 'rgba(110,30,12,.45)', s * .1);                  // under the pecs
      for (let r = 0; r < 3; r++) ellipse(c, PT_HX + s * 26, 1250 + r * 30, 22, 13, 'rgba(250,150,95,.3)');   // abdomen
      ellipse(c, PT_HX + s * 150, 1250, 40, 120, 'rgba(110,30,12,.4)');                           // flanks in shade
    }
    ellipse(c, PT_HX, 1100, 70, 26, 'rgba(110,30,12,.35)');   // the pit of the neck
  });
  // gold waist band and the dhoti's top fold
  limb(c, [[PT_HX - 122, 1340], [PT_HX, 1350], [PT_HX + 122, 1340]], [20, 22, 20], PT_GOLD.base, false);
  limb(c, [[PT_HX - 120, 1335], [PT_HX, 1344], [PT_HX + 120, 1335]], [5, 5, 5], PT_GOLD.lt, false);

  // ---- the red uttariya: over the shoulders, down behind the arms, ends fluttering past the elbows
  for (const s of [-1, 1]) ptShape(c, `M ${PT_HX + s * 90} 1080 C ${PT_HX + s * 190} 1078 ${PT_HX + s * 250} 1120 ${PT_HX + s * 262} 1190 C ${PT_HX + s * 275} 1270 ${PT_HX + s * 290} 1340 ${PT_HX + s * 312} 1404
      C ${PT_HX + s * 258} 1418 ${PT_HX + s * 222} 1400 ${PT_HX + s * 206} 1340 C ${PT_HX + s * 190} 1260 ${PT_HX + s * 170} 1170 ${PT_HX + s * 110} 1120 Z`,
    ptLin(c, 0, 1080, 0, 1420, [[0, '#D8402C'], [.5, '#AA281C'], [1, '#701812']]));

  // ---- arms
  for (const s of [-1, 1]) {
    const sh = [PT_HX + s * 178, 1135], el = [PT_HX + s * 236, 1308], wr = [PT_HX + s * 282, 1418];
    ellipse(c, sh[0] + s * 4, sh[1] + 4, 62, 56, PT_SKIN.dk); ellipse(c, sh[0] + s * 2, sh[1] - 2, 56, 50, PT_SKIN.base); ellipse(c, sh[0] - s * 6, sh[1] - 16, 30, 22, 'rgba(250,150,90,.7)');   // deltoid
    ptForm(c, [[sh[0] + s * 4, sh[1] + 20], [PT_HX + s * 218, 1225], el], [100, 94, 70], skin, -s * .25, -.9);
    ptForm(c, [el, [PT_HX + s * 262, 1372], wr], [70, 62, 48], skin, -s * .4, -.8, .5);
    // armband with a red stone, wrist bangle
    limb(c, [[PT_HX + s * 180, 1184], [PT_HX + s * 208, 1190], [PT_HX + s * 236, 1186]], [18, 20, 18], PT_GOLD.base); ellipse(c, PT_HX + s * 208, 1188, 10, 9, '#B81E24'); ellipse(c, PT_HX + s * 206, 1185, 3, 3, '#FF9AA0');
    limb(c, [[PT_HX + s * 268, 1406], [PT_HX + s * 294, 1398]], [19, 19], PT_GOLD.base); limb(c, [[PT_HX + s * 268, 1402], [PT_HX + s * 294, 1394]], [4, 4], PT_GOLD.lt);
    // hand resting palm-up on the knee in jnana mudra: three fingers out, thumb and first finger touching
    ellipse(c, wr[0] + s * 16, wr[1] + 22, 30, 21, PT_SKIN.dk, s * .5); ellipse(c, wr[0] + s * 14, wr[1] + 18, 28, 19, PT_SKIN.base, s * .5);
    for (let k = 0; k < 3; k++) ptForm(c, [[wr[0] + s * (26 + k * 2), wr[1] + 26 + k * 8], [wr[0] + s * (46 + k * 2), wr[1] + 34 + k * 8], [wr[0] + s * (62 + k * 1), wr[1] + 38 + k * 9]], [12, 10, 8], skin, 0, -1, .5);
    c.strokeStyle = PT_SKIN.base; c.lineWidth = 9; c.beginPath(); c.arc(wr[0] + s * 34, wr[1] + 6, 10, 0, TAU); c.stroke();
    c.strokeStyle = PT_SKIN.lt; c.lineWidth = 3; c.beginPath(); c.arc(wr[0] + s * 34, wr[1] + 4, 10, Math.PI * 1.1, Math.PI * 1.9); c.stroke();
  }
  ptMottle(c, PT_HX - 420, 1060, PT_HX + 420, 1540, 500, [PT_SKIN.dk, PT_SKIN.lt, '#E86A34', '#B8401E', '#F7B24A', '#C77A26'], R, 6, 24, .18);

  // ---- neck, trapezius
  ptShape(c, `M ${PT_HX - 38} 1040 L ${PT_HX + 38} 1040 C ${PT_HX + 44} 1070 ${PT_HX + 70} 1084 ${PT_HX + 110} 1092 L ${PT_HX - 110} 1092 C ${PT_HX - 70} 1084 ${PT_HX - 44} 1070 ${PT_HX - 38} 1040 Z`,
    ptLin(c, 0, 1040, 0, 1092, [[0, PT_SKIN.dk], [1, PT_SKIN.base]]));
  // hair in front: two locks over each shoulder
  for (const s of [-1, 1]) for (let k = 0; k < 2; k++) ptLock(c, [[PT_HX + s * (50 + k * 8), 975], [PT_HX + s * (66 + k * 10), 1040], [PT_HX + s * (92 + k * 14), 1110], [PT_HX + s * (100 + k * 18), 1172]], 20 - k * 4, R);
  // sacred thread, over his left shoulder (screen right)
  c.strokeStyle = '#F7EED0'; c.lineWidth = 4; c.beginPath(); c.moveTo(PT_HX + 112, 1100); c.quadraticCurveTo(PT_HX + 20, 1240, PT_HX - 112, 1342); c.stroke();
  // gold necklaces
  c.strokeStyle = PT_GOLD.dk; c.lineWidth = 9; c.beginPath(); c.ellipse(PT_HX, 1086, 50, 30, 0, .15, Math.PI - .15); c.stroke();
  c.strokeStyle = PT_GOLD.base; c.lineWidth = 6; c.beginPath(); c.ellipse(PT_HX, 1084, 50, 30, 0, .15, Math.PI - .15); c.stroke();
  c.lineWidth = 5; c.beginPath(); c.ellipse(PT_HX, 1098, 70, 72, 0, .3, Math.PI - .3); c.stroke();
  ellipse(c, PT_HX, 1170, 15, 19, PT_GOLD.base); ellipse(c, PT_HX, 1170, 8, 10, '#B81E24'); ellipse(c, PT_HX - 2, 1166, 3, 3, '#FF9AA0');
  // garlands: white flowers to the belly, marigold with leaves to the lap
  ptFlowers(c, [[PT_HX - 100, 1094], [PT_HX - 112, 1220], [PT_HX - 92, 1360], [PT_HX - 36, 1440], [PT_HX + 36, 1440], [PT_HX + 92, 1360], [PT_HX + 112, 1220], [PT_HX + 100, 1094]], 6, ['#3E7A2E', '#5C9A3A', '#2E5E22'], R, 1);
  ptFlowers(c, [[PT_HX - 110, 1094], [PT_HX - 124, 1220], [PT_HX - 104, 1364], [PT_HX - 40, 1448], [PT_HX + 40, 1448], [PT_HX + 104, 1364], [PT_HX + 124, 1220], [PT_HX + 110, 1094]], 13, ['#F6971C', '#F7B22A', '#E8761A', '#FBC93C', '#D9601A'], R, 2);
  ptFlowers(c, [[PT_HX - 80, 1088], [PT_HX - 90, 1180], [PT_HX - 64, 1282], [PT_HX, 1326], [PT_HX + 64, 1282], [PT_HX + 90, 1180], [PT_HX + 80, 1088]], 15, ['#F6F3EA', '#E9E6EF', '#D3CDE6', '#FFFFFF', '#B8B1D6', '#C9C3E0'], R, 3);

  // ---- the head
  for (const s of [-1, 1]) {   // ears with gold kundals
    ellipse(c, PT_HX + s * 56, 1002, 15, 21, PT_SKIN.base); ellipse(c, PT_HX + s * 57, 1004, 8, 13, PT_SKIN.dk);
    ellipse(c, PT_HX + s * 60, 1038, 10, 13, PT_GOLD.base); ellipse(c, PT_HX + s * 60, 1036, 4, 6, PT_GOLD.lt); ellipse(c, PT_HX + s * 60, 1052, 4, 4, '#B81E24');
  }
  ptShape(c, `M ${PT_HX - 52} 970 C ${PT_HX - 56} 1010 ${PT_HX - 46} 1050 ${PT_HX} 1066 C ${PT_HX + 46} 1050 ${PT_HX + 56} 1010 ${PT_HX + 52} 970 C ${PT_HX + 30} 948 ${PT_HX - 30} 948 ${PT_HX - 52} 970 Z`,
    ptRad(c, PT_HX, 990, 5, 80, [[0, PT_SKIN.lt], [.6, PT_SKIN.base], [1, PT_SKIN.dk]], PT_HX, 1010));
  ellipse(c, PT_HX, 1032, 36, 27, PT_SKIN.muz); ellipse(c, PT_HX, 1040, 30, 18, 'rgba(255,190,140,.6)');
  ellipse(c, PT_HX, 1058, 22, 7, 'rgba(140,50,20,.35)');   // under the chin
  for (const s of [-1, 1]) {
    c.strokeStyle = '#4A1A0C'; c.lineWidth = 6; c.beginPath(); c.moveTo(PT_HX + s * 8, 984); c.quadraticCurveTo(PT_HX + s * 24, 976, PT_HX + s * 42, 984); c.stroke();
    c.strokeStyle = '#2A0E06'; c.lineWidth = 3.4; c.beginPath(); c.moveTo(PT_HX + s * 11, 999); c.quadraticCurveTo(PT_HX + s * 24, 1006, PT_HX + s * 37, 998); c.stroke();
    ellipse(c, PT_HX + s * 24, 993, 13, 5, 'rgba(255,170,110,.5)');
    ellipse(c, PT_HX + s * 34, 1022, 12, 8, 'rgba(255,120,90,.25)');   // cheeks
  }
  ellipse(c, PT_HX, 1020, 9, 6, '#7E2A12'); ellipse(c, PT_HX - 5, 1022, 2.6, 2, '#2A0E06'); ellipse(c, PT_HX + 5, 1022, 2.6, 2, '#2A0E06');
  c.strokeStyle = '#6A200E'; c.lineWidth = 3; c.beginPath(); c.moveTo(PT_HX - 18, 1044); c.quadraticCurveTo(PT_HX, 1052, PT_HX + 18, 1044); c.stroke();
  c.strokeStyle = '#FFFFFF'; c.lineWidth = 5; c.beginPath(); c.moveTo(PT_HX - 9, 950); c.lineTo(PT_HX - 7, 976); c.quadraticCurveTo(PT_HX, 984, PT_HX + 7, 976); c.lineTo(PT_HX + 9, 950); c.stroke();
  c.strokeStyle = '#D6141E'; c.lineWidth = 5; c.beginPath(); c.moveTo(PT_HX, 952); c.lineTo(PT_HX, 978); c.stroke();
  ptShape(c, `M ${PT_HX - 60} 972 C ${PT_HX - 58} 940 ${PT_HX + 58} 940 ${PT_HX + 60} 972 C ${PT_HX + 40} 952 ${PT_HX - 40} 952 ${PT_HX - 60} 972 Z`, '#17100D');

  // ---- the mukut: a jewelled band, two tiers of gold petals, a domed top and a spire, side fans over the ears
  const gl = ptLin(c, PT_HX - 70, 0, PT_HX + 70, 0, [[0, PT_GOLD.dk], [.3, PT_GOLD.lt], [.55, PT_GOLD.base], [1, PT_GOLD.dk]]);
  for (const s of [-1, 1]) ptShape(c, `M ${PT_HX + s * 50} 958 C ${PT_HX + s * 80} 940 ${PT_HX + s * 96} 905 ${PT_HX + s * 88} 878 C ${PT_HX + s * 78} 905 ${PT_HX + s * 66} 925 ${PT_HX + s * 40} 935 Z`, gl);
  ptShape(c, `M ${PT_HX - 62} 958 L ${PT_HX - 58} 925 L ${PT_HX + 58} 925 L ${PT_HX + 62} 958 Z`, gl);                          // band
  for (let k = -2; k <= 2; k++) { ellipse(c, PT_HX + k * 23, 943, 7, 7, PT_GOLD.dk); ellipse(c, PT_HX + k * 23, 942, 5.5, 5.5, k ? '#B81E24' : '#2C8A4A'); }
  for (let k = -3; k <= 3; k++) { const x = PT_HX + k * 17; ptShape(c, `M ${x - 11} 928 Q ${x - 10} 900 ${x} 885 Q ${x + 10} 900 ${x + 11} 928 Z`, k % 2 ? PT_GOLD.base : PT_GOLD.lt); }   // petals
  ptShape(c, `M ${PT_HX - 46} 905 C ${PT_HX - 44} 868 ${PT_HX - 24} 850 ${PT_HX} 846 C ${PT_HX + 24} 850 ${PT_HX + 44} 868 ${PT_HX + 46} 905 Z`, gl);   // dome
  for (let k = -2; k <= 2; k++) { const x = PT_HX + k * 15; ptShape(c, `M ${x - 8} 872 Q ${x} 850 ${x + 8} 872 Z`, PT_GOLD.lt); }
  ellipse(c, PT_HX, 880, 13, 16, PT_GOLD.dk); ellipse(c, PT_HX, 879, 10, 13, '#B81E24'); ellipse(c, PT_HX - 3, 874, 3.5, 4, '#FF9AA0');
  ptShape(c, `M ${PT_HX - 12} 850 Q ${PT_HX - 6} 826 ${PT_HX} 800 Q ${PT_HX + 6} 826 ${PT_HX + 12} 850 Z`, gl);                     // spire
  ellipse(c, PT_HX, 818, 7, 8, PT_GOLD.lt); ellipse(c, PT_HX, 798, 5, 7, PT_GOLD.lt);
  ptMottle(c, PT_HX - 100, 790, PT_HX + 100, 960, 60, [PT_GOLD.lt, PT_GOLD.dk, '#FFF3B8', '#C98A22'], R, 3, 9, .2);
  c.save(); c.globalCompositeOperation = 'source-atop';
  c.fillStyle = ptLin(c, 0, 800, 0, 1545, [[0, 'rgba(255,244,190,.18)'], [.55, 'rgba(255,240,190,0)'], [.85, 'rgba(70,100,30,.04)'], [1, 'rgba(50,80,20,.14)']]); c.fillRect(0, 780, PT_W, 780);
  c.restore();
}

// ---------- the gada (design) ----------
function ptGada(c) {
  const x = 985, y = 1430, r = 72;
  limb(c, [[x - 6, y - r + 10], [x - 14, 1100], [x - 20, 980]], [30, 28, 24], ptLin(c, x - 30, 0, x + 10, 0, [[0, PT_GOLD.dk], [.5, PT_GOLD.lt], [1, PT_GOLD.dk]]));
  ellipse(c, x - 20, 975, 14, 18, PT_GOLD.base); ellipse(c, x - 21, 958, 7, 12, PT_GOLD.lt);
  for (const yy of [1080, 1180, 1290]) ellipse(c, x - 14 + (1290 - yy) * -.04, yy, 18, 8, PT_GOLD.dk);
  ellipse(c, x, y, r, r * .92, ptRad(c, x - 22, y - 26, 4, r * 1.1, [[0, PT_GOLD.lt], [.4, PT_GOLD.base], [1, PT_GOLD.dk]]));
  for (let k = -2; k <= 2; k++) { c.strokeStyle = 'rgba(120,70,15,.6)'; c.lineWidth = 4; c.beginPath(); c.ellipse(x, y, Math.abs(k) * 17 + 3, r * .9, 0, -Math.PI / 2, Math.PI / 2, k < 0); c.stroke(); }
  ellipse(c, x, y - r * .78, 30, 9, PT_GOLD.dk); ellipse(c, x, y + r * .8, 26, 8, PT_GOLD.dk);
}

// ---------- the tail (design, one pose per phase) ----------
function ptTailPts(ph) {
  const sw = Math.sin(ph * TAU), sw2 = Math.sin(ph * TAU - .9);
  const P = [[PT_HX + 60, 1320], [PT_HX + 120, 1230], [PT_HX + 165, 1120], [PT_HX + 170, 1030]];
  // the upper tail sways side to side; the curl at the tip turns with it
  const top = [[PT_HX + 110 + sw * 30, 900], [PT_HX + 50 + sw * 55, 820], [PT_HX - 10 + sw * 70, 790]];
  const curl = [[PT_HX - 50 + sw2 * 80, 805], [PT_HX - 62 + sw2 * 86, 850], [PT_HX - 40 + sw2 * 82, 880]];
  return [...P, ...top, ...curl];
}
function ptTail(ph) {
  return (c) => {
    const P = ptTailPts(ph), n = P.length, Wd = P.map((_, i) => 30 - i * 1.8);
    limb(c, P, Wd, ptLin(c, 0, 800, 0, 1400, [[0, PT_SKIN.lt], [.5, PT_SKIN.base], [1, PT_SKIN.dk]]));
    c.save(); c.globalAlpha = .5; limb(c, P.map(([x, y]) => [x - 5, y - 3]), Wd.map(v => v * .35), '#FFB47A'); c.restore();
    // tuft at the tip
    const [tx, ty] = P[n - 1];
    ellipse(c, tx, ty + 8, 16, 22, '#9C2E12');
  };
}
const PT_TAIL_BOX = [PT_HX - 220, 740, 480, 700];
