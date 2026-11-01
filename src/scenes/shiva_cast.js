// shiva_cast.js: the designs for "Karpur Gauram", a Painterly cinemagraph (see PAINTERLY_GUIDE.md): Shiva in meditation
// on a rock ledge below Kailash at night, white as camphor, his throat blue, Vasuki round his neck, the Ganga springing
// from his jata, a dhuni fire burning in front of him, the trishul with the damru planted at his right.
//   svNight(c, top)    the set: the night sky, Kailash and the ranges, the rock ledge, the tiger skin he sits on, the dhuni
//                      pit and the firelight round it. top < 0 grows the sky upward (a taller frame).
//   svShiva(c)         Shiva seated in padmasana, eyes closed: jatamukuta with the crescent, tripundra and the closed third
//                      eye, the blue throat, Vasuki's coil, rudraksha, a tiger-skin dhoti, hands in jnana mudra. Drawn in
//                      ptHanuman's frame (face at PT_HX, 1000), placed by svPlace(); bake it with SV_BOX, SV_FINE, SV_KEEP.
//   svVasuki(ph)       Vasuki's neck and spread hood rising over his right shoulder, for sway phase ph (box SV_SNAKE_BOX).
//   svFire(ph)         the dhuni's flames for flicker phase ph (box SV_FIRE_BOX).
//   svTrishul(ph)      the trishul with the damru tied below the prongs, its red cloth for flutter phase ph (SV_TRI_BOX).
// Positions: SV_FACE, SV_THIRD (the third eye), SV_MOON (the crescent), SV_GANGA (the stream's path), SV_HOOD(ph) (the
// snake's mouth), SV_FIRE (the fire's base).
//   svScene(c, t, o)   the whole cinemagraph at loop time t (o.len: the loop's length; o.wake: the wake-up; o.top: sky).
const SV_S = 1.1, SV_FY = 880;                        // the figure, drawn in ptHanuman's frame, is scaled by SV_S, its face at y SV_FY
const SVH = (x, y) => [PT_HX + (x - PT_HX) * SV_S, SV_FY + (y - 1000) * SV_S];   // ptHanuman's frame → the reel's
function svPlace(c) { c.translate(PT_HX * (1 - SV_S), SV_FY - 1000 * SV_S); c.scale(SV_S, SV_S); }   // draw in ptHanuman's frame
const SV_HEAD = 1.12;                                 // a human head, a little bigger than his
const SVhd = (x, y) => [PT_HX + (x - PT_HX) * SV_HEAD, 1000 + (y - 1000) * SV_HEAD];   // a head point (ptHanuman frame), scaled
const SV_FACE = SVH(540, 1000);
const SV_THIRD = SVH(...SVhd(540, 959));
const SV_MOON = SVH(...SVhd(592, 866));
const SV_FIRE = [884, 1616];
const SV_SKIN = { base: '#DCE2EC', dk: '#8590AC', lt: '#FAFBFF', warm: '#F3D9CB' };
const SV_HAIR = { base: '#1A1311', mid: '#33241D', lt: '#6E625C' };   // matted, ash in it
const SV_TIGER = { base: '#D98A2B', dk: '#97521A', lt: '#F2B85A' };
const SV_SNAKE = { base: '#1F4E4A', dk: '#0B2224', lt: '#4F8C80', belly: '#E2D8A0' };
const SV_BOX = [...SVH(100, 740), 880 * SV_S, 820 * SV_S];
const SV_FINE = [[...SVH(540, 980), 100], [...SVH(240, 1440), 55], [...SVH(840, 1440), 55]];
const SV_KEEP = [[...SVH(540, 988), 78, .6]];

// ---------- the set (design) ----------
function svNight(c, top = 0) {
  const R = lcg(31);
  // the sky: deep indigo, lighter toward the ranges
  c.fillStyle = ptLin(c, 0, top, 0, 1250, [[0, '#04071A'], [.45, '#0A1234'], [.8, '#18245A'], [1, '#26336A']]); c.fillRect(0, top, PT_W, 1300 - top);
  ptMottle(c, 0, top, PT_W, 1100, 260, ['#0E1A48', '#1A1E52', '#08102E', '#22205A'], R, 40, 140, .25);
  // Kailash behind his left shoulder: a steep snow-clad peak, lit from the left by his halo, shaded on the right,
  // dark rock showing through the snow on its terraces, the gash down its face
  const kx = 800, ky = 600;
  const kail = `M ${kx - 380} 1260 C ${kx - 290} 1060 ${kx - 160} 820 ${kx - 60} ${ky + 34} C ${kx - 30} ${ky + 4} ${kx + 26} ${ky - 4} ${kx + 56} ${ky + 26}
                C ${kx + 150} 820 ${kx + 280} 1040 ${kx + 400} 1260 Z`;
  ptShape(c, kail, ptLin(c, 0, ky, 0, 1260, [[0, '#7E8CB4'], [.35, '#5C6A96'], [1, '#2C365C']]));
  inside(c, kail, () => {
    poly(c, [[kx - 2, ky], [kx + 70, ky + 20], [kx + 420, 1270], [kx + 30, 1270]], 'rgba(20,26,58,.55)');   // the shaded east face
    for (let i = 0; i < 8; i++) {   // rock bands showing through the snow, following the terraces
      const y = ky + 90 + i * 66 + (R() - .5) * 12, hw = 60 + i * 42;
      limb(c, [[kx - hw, y + 18], [kx - hw * .4, y + 2], [kx + 4, y - 4], [kx + hw * .5, y + 8], [kx + hw, y + 26]], [3, 9 + R() * 6, 12, 9, 3], 'rgba(28,34,66,.5)', false);
    }
    limb(c, [[kx - 4, ky + 120], [kx - 2, ky + 330], [kx + 6, ky + 620]], [10, 16, 8], 'rgba(18,22,50,.75)');   // the gash
    for (let i = 0; i < 7; i++) limb(c, [[kx - 2, ky + 150 + i * 66], [kx - 50 - R() * 40, ky + 190 + i * 66]], [5, 1], 'rgba(18,22,50,.5)');
    ellipse(c, kx - 60, ky + 140, 60, 120, 'rgba(200,214,250,.25)', .3);   // the lit snow below the summit
  });
  ptMottle(c, kx - 380, ky, kx + 400, 1260, 200, ['#7A88B0', '#4E5C8A', '#98A6CC', '#2E3862'], R, 8, 26, .18);
  // the ranges either side: lower peaks, darker, with a little snow on their crests
  const range = (pts, col, snow) => {
    poly(c, [...pts, [pts[pts.length - 1][0], 1400], [pts[0][0], 1400]], col);
    for (let i = 1; i < pts.length - 1; i++) if (pts[i][1] < pts[i - 1][1] && pts[i][1] < pts[i + 1][1]) {
      const [x, y] = pts[i]; poly(c, [[x, y], [x + 40, y + 46], [x + 10, y + 36], [x - 12, y + 60], [x - 36, y + 40]], snow);
    }
  };
  range([[-20, 1000], [80, 920], [190, 970], [300, 870], [420, 990], [520, 1060], [640, 1140]], '#2A3458', 'rgba(150,166,210,.7)');
  range([[640, 1180], [800, 1110], [940, 1050], [1020, 1000], [1100, 1060]], '#222C4E', 'rgba(140,156,200,.6)');
  range([[-20, 1180], [120, 1130], [260, 1170], [420, 1140], [580, 1190], [740, 1160], [880, 1200], [1100, 1150]], '#171D38', 'rgba(120,134,180,.55)');
  // a thin band of mist in the valley below the ranges
  c.save(); c.translate(540, 1290); c.scale(1, .1); glow(c, 0, 0, 700, '#6E7FB4', .35, 'source-over'); c.restore();

  // the rock ledge he sits on: dark stone, its top edge lit by his light, strata and cracks
  const ledge = `M 0 1416 C 160 1398 300 1382 540 1380 C 780 1382 940 1396 1080 1412 L 1080 1920 L 0 1920 Z`;
  ptShape(c, ledge, ptLin(c, 0, 1380, 0, 1920, [[0, '#46507A'], [.15, '#2C3350'], [.6, '#1A1F33'], [1, '#0C0E18']]));
  inside(c, ledge, () => {
    for (let i = 0; i < 14; i++) {   // strata
      const y = 1436 + i * 36 + R() * 20; c.strokeStyle = R() < .5 ? 'rgba(90,100,140,.25)' : 'rgba(5,6,12,.4)'; c.lineWidth = 3 + R() * 6;
      c.beginPath(); c.moveTo(-20, y); c.bezierCurveTo(300, y - 20 + R() * 40, 700, y - 20 + R() * 40, 1100, y + (R() - .5) * 40); c.stroke();
    }
    for (let i = 0; i < 9; i++) {   // cracks
      let x = R() * PT_W, y = 1440 + R() * 440; c.strokeStyle = 'rgba(4,5,10,.6)'; c.lineWidth = 2 + R() * 3; c.beginPath(); c.moveTo(x, y);
      for (let k = 0; k < 4; k++) { x += (R() - .5) * 60; y += 20 + R() * 40; c.lineTo(x, y); } c.stroke();
    }
    ptMottle(c, 0, 1380, PT_W, 1920, 300, ['#2E3550', '#1A1F30', '#3C4462', '#11141F'], R, 10, 40, .3);
    limb(c, [[0, 1418], [300, 1386], [540, 1384], [780, 1386], [1080, 1416]], [8, 10, 10, 10, 8], 'rgba(160,180,230,.4)', false);   // the lit lip
    // firelight pooled round the dhuni
    c.save(); c.translate(SV_FIRE[0], SV_FIRE[1]); c.scale(1, .45); glow(c, 0, 0, 420, '#FF8A3A', .55, 'source-over'); c.restore();
  });
  // the tiger skin spread under him, its paws at the corners
  const [tx, ty] = [540, 1446];
  const skin = `M ${tx - 400} ${ty + 10} C ${tx - 420} ${ty - 30} ${tx - 300} ${ty - 44} ${tx - 160} ${ty - 40} C ${tx} ${ty - 36} ${tx + 180} ${ty - 44} ${tx + 330} ${ty - 36}
                C ${tx + 430} ${ty - 30} ${tx + 440} ${ty + 20} ${tx + 400} ${ty + 70} C ${tx + 300} ${ty + 104} ${tx - 300} ${ty + 106} ${tx - 390} ${ty + 70} Z`;
  for (const [px, py, s] of [[tx - 420, ty + 66, -1], [tx + 432, ty + 60, 1], [tx - 360, ty - 30, -1], [tx + 360, ty - 34, 1]]) {
    ellipse(c, px, py, 34, 18, SV_TIGER.dk, s * .4); ellipse(c, px + s * 20, py + 4, 13, 9, '#6A3A12', s * .3);
  }
  ptShape(c, skin, ptLin(c, 0, ty - 44, 0, ty + 106, [[0, SV_TIGER.lt], [.5, SV_TIGER.base], [1, SV_TIGER.dk]]));
  inside(c, skin, () => {
    for (let i = 0; i < 16; i += 2) {   // stripes running in from the front edge, in twos and threes
      const x = tx - 400 + i * 52 + (R() - .5) * 24, n = 2 + (R() < .4 ? 1 : 0);
      for (let k = 0; k < n; k++) { const l = 22 + R() * 36, b = (x - tx) * .04 + (R() - .5) * 10, xx = x + k * 13; limb(c, [[xx, ty + 112], [xx + b, ty + 112 - l * .5], [xx + b * 2, ty + 112 - l]], [11 - k * 2, 7, 1.5], '#1A1006'); }
    }
    ellipse(c, tx, ty + 30, 380, 40, 'rgba(250,236,200,.25)');
  });
  // his contact shadow on the skin
  c.save(); c.translate(540, 1480); c.scale(1, .12); glow(c, 0, 0, 470, '#140C06', .7, 'source-over'); c.restore();

  // the dhuni: a ring of stones, glowing ash, crossed logs
  const [fx, fy] = SV_FIRE;
  ellipse(c, fx, fy + 6, 116, 34, '#1A0E08');
  ellipse(c, fx, fy, 92, 24, ptRad(c, fx, fy, 4, 92, [[0, '#FFE28A'], [.35, '#F07A26'], [.8, '#7A2A10'], [1, '#2A1008']]));
  limb(c, [[fx - 70, fy + 4], [fx + 60, fy - 16]], [20, 16], '#3A2214'); limb(c, [[fx - 64, fy - 14], [fx + 66, fy + 8]], [18, 18], '#2E1A10');
  limb(c, [[fx - 30, fy - 4], [fx + 50, fy - 10]], [6, 4], 'rgba(255,170,70,.8)');
  for (let i = 0; i < 11; i++) {
    const a = Math.PI * (.02 + i / 10 * .96), x = fx + Math.cos(a) * 112, y = fy + 8 + Math.sin(a) * 30;
    ellipse(c, x, y, 22 + R() * 8, 15 + R() * 4, '#2C2E3C'); ellipse(c, x - 2, y - 5, 16, 8, mixCol('#A06040', '#5A5E74', Math.abs(Math.cos(a))), 0);
  }
}

// ---------- Shiva in meditation (design, in ptHanuman's frame) ----------
function svLock(c, P, w, R, cols = SV_HAIR) {   // a matted lock: a dark rope, a few lit strands, ash
  limb(c, P, [w, w * .85, w * .55, 4], cols.base);
  for (let k = 0; k < 3; k++) { const o = (R() - .5) * w * .5; c.save(); c.globalAlpha = .3 + R() * .3; limb(c, P.map(([x, y], i) => [x + o * (1 - i / P.length), y]), [3.4, 2.6, 1.8, 1], [cols.mid, cols.lt, cols.mid][k]); c.restore(); }
}
function svBeads(c, P, r, gap, R) {   // a rudraksha mala along points
  const C = through(P, 24); let d = 0;
  for (let i = 1; i < C.length; i++) {
    d += Math.hypot(C[i][0] - C[i - 1][0], C[i][1] - C[i - 1][1]); if (d < gap) continue; d = 0;
    const [x, y] = C[i]; ellipse(c, x, y + .8, r, r * .92, '#2E1208'); ellipse(c, x, y, r * .86, r * .8, ['#7A3A1C', '#6A3014', '#86441E'][R() * 3 | 0]); ellipse(c, x - r * .3, y - r * .32, r * .3, r * .26, 'rgba(255,200,150,.55)');
  }
}
function svShiva(c) {
  const R = lcg(41), X = PT_HX, skin = { dk: SV_SKIN.dk, base: SV_SKIN.base, lt: SV_SKIN.lt };
  // ---- jata behind: matted locks from behind the head down past the shoulders to the waist
  for (let k = 0; k < 16; k++) {
    const s = k % 2 ? 1 : -1, j = k >> 1, sp = j * 10, wv = (R() - .5) * 18;
    svLock(c, [[X + s * (46 + j * 3), 955 + j * 4], [X + s * (82 + sp * .6), 1040 + wv], [X + s * (116 + sp), 1130 - wv], [X + s * (132 + sp), 1230 + j * 8]], 28 - j * 1.4, R);
  }
  // ---- the lap: padmasana under a tiger-skin dhoti
  const lap = `M ${X - 118} 1338 C ${X - 230} 1350 ${X - 330} 1390 ${X - 365} 1452 C ${X - 385} 1505 ${X - 330} 1542 ${X - 210} 1540
            C ${X - 90} 1534 ${X + 90} 1534 ${X + 210} 1540 C ${X + 330} 1542 ${X + 385} 1505 ${X + 365} 1452 C ${X + 330} 1390 ${X + 230} 1350 ${X + 118} 1338 Z`;
  ptShape(c, lap, ptLin(c, 0, 1338, 0, 1536, [[0, SV_TIGER.lt], [.55, SV_TIGER.base], [1, SV_TIGER.dk]]));
  inside(c, lap, () => {
    for (const s of [-1, 1]) { ellipse(c, X + s * 300, 1455, 78, 50, 'rgba(255,214,140,.45)', s * -.2); ellipse(c, X + s * 300, 1515, 80, 26, 'rgba(110,52,14,.5)', s * -.1); ellipse(c, X + s * 190, 1500, 70, 30, 'rgba(110,52,14,.35)'); }
    for (let i = 0; i < 24; i++) {   // stripes in pairs, wrapping round the thighs from the outside in
      const s = i % 2 ? 1 : -1, k = (i >> 1) / 12, x0 = X + s * (380 - k * 300), y0 = 1400 + (i >> 1) % 3 * 46 + (R() - .5) * 20, l = 44 + R() * 30;
      for (const d of [0, 16]) limb(c, [[x0 - s * d * .3, y0 + d], [x0 - s * (l * .5 + d * .3), y0 + d + 6], [x0 - s * (l + d * .2), y0 + d + 18]], [13, 9, 1.5], '#1A1006');
    }
  });
  // the shins crossing, and the feet sole-up on the thighs
  const shin = (d, g) => { ptShape(c, d, g); inside(c, d, () => { for (let i = 0; i < 6; i++) { const x = X - 260 + i * 70 + R() * 20; limb(c, [[x, 1420], [x + 8, 1450], [x + 2, 1480]], [8, 6, 1], '#22140A'); } }); };
  shin(`M ${X - 310} 1478 C ${X - 200} 1446 ${X - 40} 1452 ${X + 90} 1486 C ${X + 50} 1512 ${X - 210} 1514 ${X - 310} 1508 Z`, ptLin(c, 0, 1446, 0, 1514, [[0, '#EBA650'], [1, '#A85E1E']]));
  shin(`M ${X + 310} 1456 C ${X + 200} 1428 ${X + 40} 1436 ${X - 90} 1466 C ${X - 50} 1490 ${X + 210} 1494 ${X + 310} 1488 Z`, ptLin(c, 0, 1428, 0, 1494, [[0, '#F2B258'], [1, '#B86A22']]));
  for (const s of [-1, 1]) {
    const fx = X + s * 112, fy = 1455 - (s > 0 ? 20 : 0);
    ellipse(c, fx, fy + 4, 54, 24, SV_SKIN.dk, s * .14); ellipse(c, fx, fy, 50, 20, SV_SKIN.base, s * .14); ellipse(c, fx - s * 6, fy - 3, 34, 11, SV_SKIN.warm, s * .14);
    for (let k = 0; k < 5; k++) ellipse(c, fx - s * (44 - k * 1.5), fy - 15 + k * 7, 6.5, 5, k ? SV_SKIN.lt : '#F6E2D8');
    svBeads(c, [[fx + s * 22, fy - 6], [fx + s * 34, fy + 6], [fx + s * 28, fy + 18]], 4.5, 8, R);   // a rudraksha anklet
  }

  // ---- torso
  const torso = `M ${X - 45} 1062 C ${X - 90} 1080 ${X - 140} 1090 ${X - 168} 1110 C ${X - 190} 1160 ${X - 165} 1230 ${X - 150} 1260
                 C ${X - 135} 1295 ${X - 124} 1320 ${X - 120} 1345 L ${X + 120} 1345 C ${X + 124} 1320 ${X + 135} 1295 ${X + 150} 1260
                 C ${X + 165} 1230 ${X + 190} 1160 ${X + 168} 1110 C ${X + 140} 1090 ${X + 90} 1080 ${X + 45} 1062 Z`;
  ptShape(c, torso, ptRad(c, X, 1150, 10, 280, [[0, SV_SKIN.lt], [.5, SV_SKIN.base], [1, SV_SKIN.dk]], X, 1210));
  inside(c, torso, () => {
    for (const s of [-1, 1]) {
      ellipse(c, X + s * 66, 1158, 70, 46, 'rgba(255,255,255,.5)', s * .18);                     // chest, lit
      ellipse(c, X + s * 66, 1210, 64, 12, 'rgba(80,90,130,.35)', s * .1);                      // under the chest
      for (let r = 0; r < 3; r++) ellipse(c, X + s * 24, 1250 + r * 30, 20, 12, 'rgba(255,255,255,.28)');
      ellipse(c, X + s * 150, 1250, 40, 120, 'rgba(80,90,130,.35)');                             // flanks in shade
    }
    ellipse(c, X, 1100, 70, 26, 'rgba(80,90,130,.3)');
    ellipse(c, X, 1300, 8, 6, 'rgba(90,96,130,.6)');                                               // navel
  });
  // the dhoti's tiger-skin fold at the waist, tied with a cord
  limb(c, [[X - 124, 1340], [X, 1352], [X + 124, 1340]], [24, 26, 24], SV_TIGER.base, false);
  for (let i = 0; i < 8; i++) limb(c, [[X - 110 + i * 31, 1332], [X - 106 + i * 31, 1350]], [6, 2], '#1E1209', false);
  limb(c, [[X - 122, 1330], [X, 1340], [X + 122, 1330]], [5, 5, 5], '#E9DFC4', false);

  // ---- arms
  for (const s of [-1, 1]) {
    const sh = [X + s * 178, 1135], el = [X + s * 236, 1308], wr = [X + s * 282, 1418];
    ellipse(c, sh[0] + s * 4, sh[1] + 4, 62, 56, SV_SKIN.dk); ellipse(c, sh[0] + s * 2, sh[1] - 2, 56, 50, SV_SKIN.base); ellipse(c, sh[0] - s * 6, sh[1] - 16, 30, 22, 'rgba(255,255,255,.7)');
    ptForm(c, [[sh[0] + s * 4, sh[1] + 20], [X + s * 218, 1225], el], [96, 90, 68], skin, -s * .25, -.9);
    ptForm(c, [el, [X + s * 262, 1372], wr], [68, 60, 46], skin, -s * .4, -.8, .5);
    // the tripundra in ash across the upper arm, a rudraksha band above the elbow and at the wrist
    for (let k = 0; k < 3; k++) limb(c, [[X + s * (184 + k * 2), 1160 + k * 11], [X + s * (210 + k * 2), 1164 + k * 11], [X + s * (234 + k * 2), 1160 + k * 11]], [3.4, 3.8, 3], 'rgba(120,128,156,.55)', false);
    svBeads(c, [[X + s * 186, 1206], [X + s * 212, 1214], [X + s * 240, 1208]], 6, 11, R);
    svBeads(c, [[X + s * 268, 1404], [X + s * 282, 1400], [X + s * 296, 1394]], 5.5, 10, R);
    // the hand palm-up on the knee in jnana mudra: three fingers out, thumb and first finger touching
    ellipse(c, wr[0] + s * 16, wr[1] + 22, 30, 21, SV_SKIN.dk, s * .5); ellipse(c, wr[0] + s * 14, wr[1] + 18, 28, 19, SV_SKIN.base, s * .5);
    for (let k = 0; k < 3; k++) ptForm(c, [[wr[0] + s * (26 + k * 2), wr[1] + 26 + k * 8], [wr[0] + s * (46 + k * 2), wr[1] + 34 + k * 8], [wr[0] + s * (62 + k * 1), wr[1] + 38 + k * 9]], [12, 10, 8], skin, 0, -1, .5);
    c.strokeStyle = SV_SKIN.base; c.lineWidth = 9; c.beginPath(); c.arc(wr[0] + s * 34, wr[1] + 6, 10, 0, TAU); c.stroke();
    c.strokeStyle = SV_SKIN.lt; c.lineWidth = 3; c.beginPath(); c.arc(wr[0] + s * 34, wr[1] + 4, 10, Math.PI * 1.1, Math.PI * 1.9); c.stroke();
  }
  ptMottle(c, X - 420, 1060, X + 420, 1540, 420, ['#C8D0E0', '#FFFFFF', '#B4BED6', '#E8E4EC', '#D0D8E8'], R, 6, 24, .16);

  // ---- neck: the throat blue with the poison he holds there
  const neck = `M ${X - 38} 1040 L ${X + 38} 1040 C ${X + 44} 1076 ${X + 70} 1094 ${X + 110} 1104 L ${X - 110} 1104 C ${X - 70} 1094 ${X - 44} 1076 ${X - 38} 1040 Z`;
  ptShape(c, neck, ptLin(c, 0, 1040, 0, 1104, [[0, SV_SKIN.dk], [1, SV_SKIN.base]]));
  inside(c, neck, () => { ellipse(c, X, 1086, 26, 5, 'rgba(70,80,120,.3)'); c.save(); c.globalAlpha = .8; ellipse(c, X, 1098, 34, 12, '#5274C0'); c.restore(); c.save(); c.translate(X, 1098); c.scale(1, .4); glow(c, 0, 0, 56, '#3E62B4', .8, 'source-over'); c.restore(); ellipse(c, X + 8, 1096, 12, 4, 'rgba(170,200,255,.4)'); });
  // locks in front: two over each shoulder
  for (const s of [-1, 1]) for (let k = 0; k < 2; k++) svLock(c, [[X + s * (52 + k * 8), 968], [X + s * (68 + k * 10), 1040], [X + s * (94 + k * 14), 1112], [X + s * (104 + k * 18), 1186]], 21 - k * 4, R);
  // Vasuki's coil round the neck: from behind the left side of his neck, across the collarbones, over his right shoulder
  const coil = [[X + 94, 1096], [X + 40, 1128], [X - 20, 1132], [X - 72, 1116], [X - 104, 1094]];
  limb(c, coil, [30, 32, 32, 30, 28], SV_SNAKE.dk);
  limb(c, coil.map(([x, y]) => [x, y - 3]), [24, 26, 26, 24, 22], SV_SNAKE.base);
  c.save(); c.globalAlpha = .7; limb(c, coil.map(([x, y]) => [x, y - 8]), [8, 9, 9, 8, 7], SV_SNAKE.lt); c.restore();
  through(coil, 6).forEach(([x, y], i) => { if (i % 2) ellipse(c, x, y + 6, 7, 3.5, 'rgba(226,216,160,.6)'); });   // belly scales showing
  ellipse(c, X + 94, 1096, 16, 15, SV_SNAKE.dk);   // the coil goes round behind his neck here
  // the sacred thread, over his left shoulder (screen right) to the right hip
  c.strokeStyle = '#F7EED0'; c.lineWidth = 4; c.beginPath(); c.moveTo(X + 112, 1100); c.quadraticCurveTo(X + 20, 1240, X - 112, 1342); c.stroke();
  // rudraksha malas: one close round the neck, one long to the belly
  svBeads(c, [[X - 92, 1098], [X - 70, 1150], [X, 1176], [X + 70, 1150], [X + 92, 1098]], 7, 14, R);
  svBeads(c, [[X - 104, 1102], [X - 116, 1220], [X - 70, 1316], [X, 1336], [X + 70, 1316], [X + 116, 1220], [X + 104, 1102]], 7.5, 15, R);
  ellipse(c, X, 1346, 10, 13, '#6A3014'); limb(c, [[X, 1356], [X - 4, 1380]], [6, 2], '#C2401E');   // the meru bead and its tassel

  // ---- the head (a little bigger than his, scaled about the face)
  c.save(); c.translate(X, 1000); c.scale(SV_HEAD, SV_HEAD); c.translate(-X, -1000);
  for (const s of [-1, 1]) {   // ears with gold kundals
    ellipse(c, X + s * 54, 1002, 13, 20, SV_SKIN.base); ellipse(c, X + s * 55, 1004, 7, 12, SV_SKIN.dk);
    c.strokeStyle = '#94631A'; c.lineWidth = 5.5; c.beginPath(); c.arc(X + s * 57, 1038, 13, 0, TAU); c.stroke();
    c.strokeStyle = '#F2C858'; c.lineWidth = 3.5; c.beginPath(); c.arc(X + s * 57, 1037, 13, Math.PI * .9, Math.PI * 2.1); c.stroke();
  }
  const faceD = `M ${X - 50} 966 C ${X - 54} 1006 ${X - 48} 1040 ${X - 26} 1060 C ${X - 14} 1070 ${X + 14} 1070 ${X + 26} 1060 C ${X + 48} 1040 ${X + 54} 1006 ${X + 50} 966 C ${X + 30} 942 ${X - 30} 942 ${X - 50} 966 Z`;
  ptShape(c, faceD, ptRad(c, X - 6, 995, 5, 96, [[0, SV_SKIN.lt], [.6, SV_SKIN.base], [1, SV_SKIN.dk]], X, 1010));
  inside(c, faceD, () => {
    for (const s of [-1, 1]) {
      ellipse(c, X + s * 22, 996, 17, 9, 'rgba(110,116,150,.32)');          // eye sockets
      ellipse(c, X + s * 30, 1026, 13, 9, 'rgba(255,190,190,.28)');         // cheeks
      ellipse(c, X + s * 46, 1010, 10, 40, 'rgba(100,108,140,.3)');         // the sides of the face
    }
    ellipse(c, X + 6, 1018, 6, 18, 'rgba(110,116,150,.35)');                // the nose's shaded side
    ellipse(c, X - 3, 1012, 4, 16, 'rgba(255,255,255,.55)');                // the bridge, lit
    ellipse(c, X, 1067, 18, 4, 'rgba(110,116,150,.25)');                    // under the chin
    ellipse(c, X, 1056, 16, 6, 'rgba(255,255,255,.45)');                    // the chin, lit
  });
  // brows, closed eyes with lashes, the nose, the lips
  for (const s of [-1, 1]) {
    c.lineCap = 'round';
    c.strokeStyle = '#1E1A22'; c.lineWidth = 4.2; c.beginPath(); c.moveTo(X + s * 8, 982); c.quadraticCurveTo(X + s * 24, 974, X + s * 42, 982); c.stroke();
    c.strokeStyle = '#2A2028'; c.lineWidth = 3; c.beginPath(); c.moveTo(X + s * 10, 997); c.quadraticCurveTo(X + s * 23, 1004, X + s * 37, 996); c.stroke();
    c.lineWidth = 1.6; for (let k = 0; k < 3; k++) { const x = X + s * (17 + k * 8); c.beginPath(); c.moveTo(x, 1001 - (k === 1 ? -1 : 0)); c.lineTo(x + s * 2, 1006); c.stroke(); }
    ellipse(c, X + s * 23, 991, 12, 4, 'rgba(255,255,255,.45)');             // the lids, lit
  }
  c.strokeStyle = 'rgba(90,96,128,.75)'; c.lineWidth = 2.4; c.beginPath(); c.moveTo(X - 9, 1030); c.quadraticCurveTo(X, 1036, X + 9, 1030); c.stroke();
  ellipse(c, X - 6, 1031, 2.6, 1.8, '#5A5070'); ellipse(c, X + 6, 1031, 2.6, 1.8, '#5A5070');
  ptShape(c, `M ${X - 15} 1045 C ${X - 8} 1041 ${X - 2} 1042 ${X} 1044 C ${X + 2} 1042 ${X + 8} 1041 ${X + 15} 1045 C ${X + 6} 1047 ${X - 6} 1047 ${X - 15} 1045 Z`, '#B2525C');
  ptShape(c, `M ${X - 13} 1046 C ${X - 6} 1054 ${X + 6} 1054 ${X + 13} 1046 C ${X + 6} 1048 ${X - 6} 1048 ${X - 13} 1046 Z`, '#CE7880');
  c.strokeStyle = '#7A3440'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(X - 15, 1045); c.quadraticCurveTo(X, 1049, X + 15, 1045); c.stroke();
  // the tripundra in ash across the brow, and the third eye, closed, over it
  for (let k = 0; k < 3; k++) { c.strokeStyle = k === 1 ? 'rgba(130,136,166,.9)' : 'rgba(150,156,184,.85)'; c.lineWidth = 3; c.beginPath(); c.moveTo(X - 30, 956 + k * 7); c.quadraticCurveTo(X, 952 + k * 7, X + 30, 956 + k * 7); c.stroke(); }
  ptShape(c, `M ${X} 947 C ${X + 6} 954 ${X + 6} 964 ${X} 971 C ${X - 6} 964 ${X - 6} 954 ${X} 947 Z`, '#F4E4E0');
  c.strokeStyle = '#9A1E22'; c.lineWidth = 2; c.stroke(new Path2D(`M ${X} 947 C ${X + 6} 954 ${X + 6} 964 ${X} 971 C ${X - 6} 964 ${X - 6} 954 ${X} 947 Z`));
  c.strokeStyle = '#3A1418'; c.lineWidth = 2; c.beginPath(); c.moveTo(X, 950); c.quadraticCurveTo(X + 2, 959, X, 968); c.stroke();
  // the hairline
  ptShape(c, `M ${X - 56} 974 C ${X - 56} 940 ${X - 30} 932 ${X} 932 C ${X + 30} 932 ${X + 56} 940 ${X + 56} 974 C ${X + 46} 952 ${X + 24} 944 ${X} 945 C ${X - 24} 944 ${X - 46} 952 ${X - 56} 974 Z`, SV_HAIR.base);
  // the jatamukuta: matted locks coiled up into a tall knot
  const knot = `M ${X - 60} 950 C ${X - 78} 900 ${X - 62} 830 ${X - 40} 792 C ${X - 26} 768 ${X + 26} 768 ${X + 40} 792 C ${X + 62} 830 ${X + 78} 900 ${X + 60} 950 Z`;
  ptShape(c, knot, ptLin(c, X - 70, 0, X + 70, 0, [[0, '#0E0A09'], [.4, SV_HAIR.mid], [1, '#0E0A09']]));
  inside(c, knot, () => {
    for (let i = 0; i < 10; i++) {   // thick matted coils wound round the knot, each lit along its top
      const y = 784 + i * 17, w = 44 + Math.sin(i / 9 * Math.PI) * 30, d = i % 2 ? 1 : -1;
      limb(c, [[X - w, y + 16], [X - w * .3 * d, y - 6], [X + w, y + 12]], [16, 19, 15], '#0C0807', false);
      limb(c, [[X - w * .96, y + 12], [X - w * .3 * d, y - 9], [X + w * .96, y + 8]], [11, 13, 10], SV_HAIR.mid, false);
      c.save(); c.globalAlpha = .7; limb(c, [[X - w * .7, y + 4], [X - w * .2 * d, y - 12], [X + w * .6, y]], [2.5, 4, 2.5], SV_HAIR.lt, false); c.restore();
    }
  });
  for (let k = 0; k < 6; k++) { const s = k % 2 ? 1 : -1, j = k >> 1; svLock(c, [[X + s * (24 + j * 6), 800 + j * 26], [X + s * (66 + j * 6), 830 + j * 28], [X + s * (74 + j * 4), 890 + j * 20], [X + s * (62 + j * 2), 952]], 15 - j * 2, R); }   // loops hanging off the knot
  svBeads(c, [[X - 60, 912], [X - 30, 922], [X, 925], [X + 30, 922], [X + 60, 912]], 6, 12, R);   // a rudraksha string binds it
  // the crescent moon tucked in at the right of the knot
  c.save(); c.translate(X + 52, 866); c.rotate(.5);
  ptShape(c, 'M 0 -30 C 26 -22 30 18 4 30 C 16 14 14 -14 0 -30 Z', ptLin(c, 0, -30, 0, 30, [[0, '#FFFBEA'], [1, '#E6D9A8']]));
  c.restore();
  ellipse(c, X + 6, 776, 12, 8, '#BFD8F0');   // where the Ganga springs from his locks
  c.restore();

  // ---- light: cool from his halo above and behind, warm from the fire at his left (screen right), dark below
  c.save(); c.globalCompositeOperation = 'source-atop';
  c.fillStyle = ptLin(c, 0, 760, 0, 1545, [[0, 'rgba(210,226,255,.18)'], [.5, 'rgba(210,226,255,0)'], [1, 'rgba(20,20,50,.22)']]); c.fillRect(0, 760, PT_W, 800);
  c.fillStyle = ptLin(c, X, 0, X + 440, 0, [[0, 'rgba(255,150,70,0)'], [.6, 'rgba(255,150,70,.14)'], [1, 'rgba(255,140,60,.32)']]); c.fillRect(X, 760, 460, 800);
  c.fillStyle = ptLin(c, X - 440, 0, X, 0, [[0, 'rgba(40,56,120,.22)'], [1, 'rgba(40,56,120,0)']]); c.fillRect(X - 460, 760, 460, 800);
  c.restore();
}

// ---------- Vasuki's hood (design, one pose per phase, in ptHanuman's frame) ----------
// He rises from the coil over Shiva's right shoulder (screen left) and spreads his hood beside the face, looking at us;
// the hood sways and the head tilts with phase ph (0..1).
const SV_SNAKE_BOX = [...SVH(300, 780), 200 * SV_S, 330 * SV_S];
const SV_HOOD_K = 1.25;
function svHoodAt(ph) { const sw = Math.sin(ph * TAU); return { x: 390 + sw * 9, y: 950 - Math.abs(Math.cos(ph * TAU)) * 4, a: sw * .09 }; }
const SV_HOOD = ph => { const h = svHoodAt(ph), r = 39 * SV_HOOD_K; return SVH(h.x + Math.sin(h.a) * r, h.y - Math.cos(h.a) * r); };   // the mouth, for the tongue (reel px)
function svVasuki(ph) {
  return (c) => {
    svPlace(c);
    const h = svHoodAt(ph), P = [[X0 + 2, 1098], [X0 - 22, 1072], [h.x + 4, 1040], [h.x, h.y + 40]];
    limb(c, P, [30, 28, 28, 32], SV_SNAKE.dk);
    limb(c, P.map(([x, y]) => [x - 3, y]), [24, 22, 22, 26], SV_SNAKE.base);
    limb(c, P.map(([x, y]) => [x + 3, y]), [10, 9, 10, 12], SV_SNAKE.belly);
    c.save(); c.translate(h.x, h.y); c.rotate(h.a); c.scale(SV_HOOD_K, SV_HOOD_K);
    // the spread hood seen from the front: dark rim, the pale banded throat
    ptShape(c, 'M 0 -50 C 40 -52 66 -30 64 -2 C 62 26 30 46 10 70 L -10 70 C -30 46 -62 26 -64 -2 C -66 -30 -40 -52 0 -50 Z', ptRad(c, 0, -10, 6, 72, [[0, SV_SNAKE.lt], [.5, SV_SNAKE.base], [1, SV_SNAKE.dk]]));
    ptShape(c, 'M 0 -34 C 14 -34 20 -16 19 6 C 18 30 10 50 0 64 C -10 50 -18 30 -19 6 C -20 -16 -14 -34 0 -34 Z', ptLin(c, 0, -34, 0, 64, [[0, '#D8D49C'], [1, '#8E9064']]));
    for (let k = 0; k < 8; k++) { c.strokeStyle = 'rgba(40,60,40,.55)'; c.lineWidth = 1.8; c.beginPath(); c.moveTo(-17 + k * 1.4, -22 + k * 11); c.quadraticCurveTo(0, -17 + k * 11, 17 - k * 1.4, -22 + k * 11); c.stroke(); }
    for (const s of [-1, 1]) { c.strokeStyle = 'rgba(120,190,170,.35)'; c.lineWidth = 2; for (let k = 0; k < 4; k++) { c.beginPath(); c.moveTo(s * 22, -30 + k * 14); c.quadraticCurveTo(s * 46, -24 + k * 12, s * 58, -10 + k * 10); c.stroke(); } }   // the hood's ribs
    // the head over the top of the hood, flat and wide, looking at us, its eyes gold
    ptShape(c, 'M 0 -76 C 16 -76 24 -66 23 -54 C 22 -44 12 -38 0 -37 C -12 -38 -22 -44 -23 -54 C -24 -66 -16 -76 0 -76 Z', ptRad(c, 0, -62, 2, 28, [[0, SV_SNAKE.lt], [1, SV_SNAKE.dk]]));
    for (const s of [-1, 1]) { ellipse(c, s * 12, -58, 4.5, 3.6, '#F2C030', s * .3); ellipse(c, s * 12, -58, 1.3, 3, '#140A04'); }
    ellipse(c, 0, -68, 8, 3.5, 'rgba(255,255,255,.3)'); ellipse(c, 0, -41, 7, 2.4, 'rgba(0,0,0,.45)');
    c.restore();
  };
}
const X0 = PT_HX - 104;   // where Vasuki leaves the coil

// ---------- the dhuni's flames (design, one pose per phase) ----------
const SV_FIRE_BOX = [SV_FIRE[0] - 130, SV_FIRE[1] - 290, 260, 310];
function svFire(ph) {
  return (c) => {
    const [fx, fy] = SV_FIRE, R = lcg(70 + Math.round(ph * 97));
    const tongue = (x, w, hgt, lean, col) => {
      const tx = x + lean, ty = fy - hgt;
      ptShape(c, `M ${x - w} ${fy} C ${x - w * 1.1} ${fy - hgt * .4} ${tx - w * .3} ${ty + hgt * .3} ${tx} ${ty} C ${tx + w * .4} ${ty + hgt * .35} ${x + w * 1.1} ${fy - hgt * .4} ${x + w} ${fy} Z`, col);
    };
    const T = [[-58, 30, .55], [-24, 40, .9], [14, 42, 1], [48, 34, .7], [74, 24, .45]];
    T.forEach(([dx, w, hk], i) => {
      const f = .5 + .5 * Math.sin(ph * TAU * (1 + (i % 2)) + i * 2.1), hgt = 150 * hk * (.75 + .4 * f + R() * .15), lean = Math.sin(ph * TAU + i) * 18 + (R() - .5) * 12;
      tongue(SV_FIRE[0] + dx, w, hgt, lean, ptLin(c, 0, fy, 0, fy - hgt, [[0, '#FF8A24'], [.5, '#F0561A'], [1, 'rgba(200,40,10,.85)']]));
    });
    T.forEach(([dx, w, hk], i) => {
      const f = .5 + .5 * Math.sin(ph * TAU * (1 + (i % 2)) + i * 2.1 + .6), hgt = 100 * hk * (.7 + .4 * f), lean = Math.sin(ph * TAU + i + .4) * 12;
      tongue(SV_FIRE[0] + dx * .8, w * .55, hgt, lean, ptLin(c, 0, fy, 0, fy - hgt, [[0, '#FFF2B0'], [.6, '#FFC24A'], [1, '#FF8A24']]));
    });
    ellipse(c, fx + 6, fy - 16, 50, 16, '#FFF8D8');
    // a spark or two leaving the tips
    for (let k = 0; k < 2; k++) ellipse(c, fx + (R() - .5) * 90, fy - 140 - R() * 80, 3, 4, '#FFD27A');
  };
}

// ---------- the trishul and the damru (design, one pose per phase) ----------
// Planted in the rock at his right (screen left); the damru hangs tied below the prongs, its red cloth stirring with ph.
const SV_TRI_X = 96, SV_TRI_BOX = [12, 440, 200, 1160];
const SV_IRON = { base: '#9AA4BC', dk: '#4A5270', lt: '#E8EEFA' };
function svTrishul(ph) {
  return (c) => {
    const x = SV_TRI_X, iron = ptLin(c, x - 16, 0, x + 16, 0, [[0, SV_IRON.dk], [.4, SV_IRON.lt], [.6, SV_IRON.base], [1, SV_IRON.dk]]);
    limb(c, [[x - 2, 1580], [x + 2, 1000], [x + 6, 600]], [18, 16, 14], ptLin(c, x - 10, 0, x + 10, 0, [[0, '#3A2414'], [.45, '#8A5A30'], [1, '#2A180C']]));   // the staff
    // the prongs: a long spear in the middle, two curving out and up
    ptShape(c, `M ${x - 4} 604 L ${x - 6} 520 L ${x + 6} 446 L ${x + 18} 520 L ${x + 16} 604 Z`, iron);
    for (const s of [-1, 1]) ptShape(c, `M ${x + 6 + s * 8} 606 C ${x + 6 + s * 60} 600 ${x + 6 + s * 66} 556 ${x + 6 + s * 58} 494 C ${x + 6 + s * 48} 540 ${x + 6 + s * 36} 570 ${x + 6 + s * 6} 580 Z`, iron);
    limb(c, [[x - 34, 606], [x + 6, 612], [x + 46, 606]], [12, 14, 12], ptLin(c, 0, 600, 0, 618, [[0, '#FFE38C'], [1, '#94631A']]));   // the gold collar
    ellipse(c, x + 6, 628, 13, 9, '#E5AE34'); ellipse(c, x + 6, 646, 10, 7, '#94631A');
    // the damru on its cord, two drum heads and a waist, its beads hanging on strings
    const dx = x + 8, dy = 724;
    limb(c, [[x + 6, 652], [dx, dy - 36]], [3, 3], '#E9DFC4');
    for (const s of [-1, 1]) ptShape(c, `M ${dx - 9} ${dy} L ${dx + 9} ${dy} L ${dx + 30} ${dy + s * 36} L ${dx - 30} ${dy + s * 36} Z`, ptLin(c, dx - 30, 0, dx + 30, 0, [[0, '#5A2A10'], [.4, '#C47A3A'], [1, '#4A220C']]));
    for (const s of [-1, 1]) ellipse(c, dx, dy + s * 36, 30, 7, s > 0 ? '#D8CCAE' : '#F4ECD6');
    limb(c, [[dx - 11, dy], [dx + 11, dy]], [12, 12], '#B81E24', false);
    for (const s of [-1, 1]) { const sw = Math.sin(ph * TAU + s) * 6; limb(c, [[dx + s * 9, dy], [dx + s * 26 + sw, dy + 16], [dx + s * 32 + sw * 1.4, dy + 30]], [2, 2, 2], '#3A2414', false); ellipse(c, dx + s * 32 + sw * 1.4, dy + 34, 6, 6, '#3A2414'); }
    // the red cloth tied round the staff, its two ends stirring in the night air
    limb(c, [[x - 14, 664], [x + 4, 670], [x + 24, 664]], [14, 16, 14], '#C2281E');
    for (const [k, o] of [[0, 0], [1, 1.7]]) {
      const P = [[x + 14, 668]]; for (let i = 1; i <= 5; i++) P.push([x + 14 + i * 9 + Math.sin(ph * TAU + i * .7 + o) * i * 3.4, 668 + i * 26 + k * 10]);
      limb(c, P, [12, 12, 11, 10, 9, 8], ptLin(c, 0, 668, 0, 820, [[0, '#D8402C'], [1, '#801812']]));
    }
  };
}

// ---------- the scene ----------
// svScene(c, t, o) draws the whole cinemagraph at loop time t for a loop of o.len seconds (a whole number): every motion
// runs a whole number of times a loop, at about the pace it has in the 15 s reel. o.wake (0..1, default 1): the iPhone
// wake-up (the halo rises, the mantra rings open, the Ganga starts to run). o.top: how far up the sky goes (stars).
const SV_SNAKE_N = 12, SV_CLOTH_N = 10, SV_FIRE_N = 12, SV_FIRE_FPS = 8;   // poses; flame steps a second
const svFireSeq = L => Array.from({ length: L * SV_FIRE_FPS }, (_, i) => (i * 5 + (hash(i * 1.7) * 3 | 0)) % SV_FIRE_N);   // never the same pose twice running

// the Ganga's path from the top of his knot, up and over to the right, falling away into spray
const SV_GANGA = [SVhd(546, 776), [556, 716], [590, 696], [640, 700], [684, 732], [712, 790], [730, 870]].map(([x, y]) => SVH(x, y));
function svGanga(c, t, L, k = 1) {
  const C = through(SV_GANGA, 10), n = C.length;
  c.save(); c.globalAlpha = .4 * k; limb(c, SV_GANGA, [10, 14, 18, 20, 24, 30, 40], 'rgba(150,190,250,.5)'); c.globalAlpha = .55 * k; limb(c, SV_GANGA, [5, 7, 8, 9, 10, 10, 8], 'rgba(220,238,255,.6)'); c.restore();
  // the water running: bright beads travelling along it, a whole number of runs a loop
  for (let i = 0; i < 26; i++) {
    const s = frac(i / 26 + t * svPer(L, 6) / L), p = s * (n - 1), j = Math.min(n - 2, p | 0), f = p - j;
    const x = lerp(C[j][0], C[j + 1][0], f), y = lerp(C[j][1], C[j + 1][1], f);
    glow(c, x, y, 7 + s * 6, '#E6F4FF', (.55 + .3 * hash(i)) * Math.sin(s * Math.PI) ** .5 * k, 'lighter');
  }
  // spray falling off the end and fading
  const [ex, ey] = SV_GANGA[SV_GANGA.length - 1];
  for (let i = 0; i < 18; i++) {
    const s = frac(hash(i + 2) + t * svPer(L, 3 + (i % 3)) / L), x = ex + (hash(i + 7) - .3) * 40 + s * 24, y = ey + s * s * 140;
    glow(c, x, y, 5 + hash(i) * 4, '#DDEEFF', .6 * (1 - s) * k, 'lighter');
  }
  glow(c, ...SV_GANGA[0], 26, '#CFE6FF', .5 * k, 'lighter');
}

// stars: only in the open sky (not over Kailash or the ranges)
const svInSky = (x, y) => y < 880 && !(y > 560 && Math.abs(x - 800) < (y - 560) * .6 + 50) && !(x < 480 && y > 850);
const svStars = (top = 0) => Array.from({ length: Math.round(140 * (850 - top) / 850) }, (_, i) => [hash(i * 3.1) * PT_W, top + 30 + Math.pow(hash(i * 7.7), 1.2) * (820 - top), .4 + hash(i * 1.3)]).filter(([x, y]) => svInSky(x, y));
const svPer = (L, n15) => Math.max(1, Math.round(n15 * L / 15));   // n15 times in 15 s → a whole number of times in L s

function svScene(c, t, o = {}) {
  const L = o.len || 15, LP = TAU / L, wake = o.wake ?? 1, e = easeOut(wake), n = k => svPer(L, k);
  const looped = (t, draw) => { const u = t / L; draw(t, 1 - u); draw(t - L, u); };   // drifting things come back round
  const stars = svScene.stars[o.top || 0] ??= svStars(o.top || 0), fireSeq = svScene.fire[L] ??= svFireSeq(L);
  ptDraw(c, ptLayer('sv_night' + (o.top || 0), [0, o.top || 0, PT_W, PT_H - (o.top || 0)], c2 => svNight(c2, o.top || 0), { seed: 5 }));
  stars.forEach(([x, y, s], i) => {
    const k = .5 + .5 * Math.sin(t * n(2 + (hash(i + 5) * 5 | 0)) * LP + i * 2.4);
    twinkle(c, x, y, 4 + s * 6, (.2 + .6 * Math.pow(k, 3)) * (.6 + .4 * s), '#EEF0FF');
  });
  // his halo: moonlight behind his head, a soft disc and a thin ring, breathing
  const [hx, hy] = [SV_FACE[0], SV_FACE[1] - 40], br = .5 + .5 * Math.sin(t * n(2) * LP);
  glow(c, hx, hy, 640, '#7FA2E6', (.28 + .06 * br) * lerp(.4, 1, e), 'screen');
  glow(c, hx, hy, 260, '#E4EEFF', (.32 + .08 * br) * lerp(.3, 1, e), 'screen');
  c.save(); c.globalCompositeOperation = 'screen'; c.strokeStyle = `rgba(220,232,255,${(.22 + .08 * br) * e})`; c.lineWidth = 3; c.shadowColor = 'rgba(200,220,255,.9)'; c.shadowBlur = 18;
  c.beginPath(); c.arc(hx, hy, 236, 0, TAU); c.stroke(); c.restore();

  const kc = Math.floor(t / L * n(10) * SV_CLOTH_N) % SV_CLOTH_N;
  ptDraw(c, ptLayer('sv_trishul' + kc, SV_TRI_BOX, svTrishul(kc / SV_CLOTH_N), { alpha: true, seed: 23, brushes: PT_BRUSHES.slice(2) }));
  const hero = ptLayer('sv_shiva', SV_BOX, (c2) => { svPlace(c2); svShiva(c2); }, { alpha: true, seed: 17, brushes: PT_BRUSHES.slice(1), fine: SV_FINE, keep: SV_KEEP });
  ptDraw(c, hero);
  // rim light: cool from the halo above and behind; warm from the fire at his left, flickering with it
  const fl = .5 + .25 * Math.sin(t * n(23) * LP) + .15 * Math.sin(t * n(37) * LP + 1) + .1 * Math.sin(t * n(61) * LP + 2);
  const rim = ptRim(hero, { dx: 0, dy: -5, col: '#E6F0FF', blur: 6, key: 'svh' });
  ptDraw(c, rim, (.5 + .15 * br) * lerp(.2, 1, e), 'screen');
  ptDraw(c, ptRim(hero, { dx: 6, dy: 2, col: '#FFB066', blur: 7, key: 'svf', seed: 4, density: 0 }), .3 + .25 * fl, 'screen');
  // Vasuki: the hood sways; now and then the tongue flicks
  const ph = frac(t / L * n(3)), ks = Math.floor(ph * SV_SNAKE_N) % SV_SNAKE_N;
  ptDraw(c, ptLayer('sv_vasuki' + ks, SV_SNAKE_BOX, svVasuki(ks / SV_SNAKE_N), { alpha: true, seed: 29, brushes: PT_BRUSHES.slice(2), fine: [[...SVH(394, 880), 44]] }));
  const fq = frac(t / L * n(5)), fk = fq < .1 ? Math.sin(fq / .1 * Math.PI) : 0;
  if (fk > 0) {
    const [mx, my] = SV_HOOD(ks / SV_SNAKE_N), L = 26 * fk, wig = Math.sin(t * 90) * 3;
    c.save(); c.strokeStyle = '#C8202A'; c.lineCap = 'round'; c.lineWidth = 2.6;
    c.beginPath(); c.moveTo(mx, my); c.quadraticCurveTo(mx + wig, my + L * .6, mx, my + L); c.stroke();
    c.lineWidth = 1.8; c.beginPath(); c.moveTo(mx, my + L); c.lineTo(mx - 5, my + L + 7 * fk); c.moveTo(mx, my + L); c.lineTo(mx + 5, my + L + 7 * fk); c.stroke(); c.restore();
  }
  // the Ganga, the crescent's glow, the third eye breathing
  svGanga(c, t, L, e);
  glow(c, ...SV_MOON, 46, '#FFF6D8', (.35 + .12 * Math.sin(t * n(3) * LP)) * e, 'lighter');
  glow(c, ...SV_THIRD, 16, '#FF9A6A', (.25 + .2 * Math.pow(.5 + .5 * Math.sin(t * n(2) * LP - 1), 2)) * e, 'lighter');
  // the dhuni: stepped flames, the glow round them, sparks and a thread of smoke
  const kf = fireSeq[Math.floor(t * SV_FIRE_FPS) % fireSeq.length];
  glow(c, SV_FIRE[0], SV_FIRE[1] - 50, 300, '#FF8A3A', .32 + .12 * fl, 'lighter');
  ptDraw(c, ptLayer('sv_fire' + kf, SV_FIRE_BOX, svFire(kf / SV_FIRE_N), { alpha: true, seed: 31 + kf, brushes: PT_BRUSHES.slice(2), rough: 2 }));
  glow(c, SV_FIRE[0], SV_FIRE[1] - 40, 120, '#FFD27A', .25 + .15 * fl, 'lighter');
  looped(t, (tt, k) => motes(c, { n: 26, seed: 6, box: [SV_FIRE[0] - 90, SV_FIRE[1] - 520, SV_FIRE[0] + 90, SV_FIRE[1] - 60], r: 2.6, col: '#FFB45A', a: .9 * k, vx: -6, vy: -70, t: tt }));
  // ॐ नमः शिवाय, round him in rings that open on wake
  [[250, 235, .55, 25], [326, 312, .4, 24]].forEach(([rx, ry, a, size], i) => {
    const ki = easeOut(wake >= 1 ? 1 : seg(wake, i * .15, .55 + i * .15)), s = lerp(.55, 1, ki);
    nameRing(c, SV_FACE[0], SV_FACE[1] + 33, rx * s, ry * s, -Math.PI * 1.08, Math.PI * .08, 'ॐ नमः शिवाय', { size, a: a * ki, gap: 40, rot: (i % 2 ? -1 : 1) * .05 * Math.sin(t * LP + i), ph: t * n(4) * LP, seed: i * 3, shimmer: .45, glow: 'rgba(200,220,255,.85)', col: '#F4F8FF' });
  });
  // motes of light in the cold air, and sparkles on his rim
  looped(t, (tt, k) => motes(c, { n: 50, seed: 4, box: [60, 300, 1020, 1500], r: 2.6, col: '#DDE8FF', a: .55 * k, vx: 5, vy: -8, t: tt }));
  rim.pts.forEach(([x, y], i) => {
    const rate = Math.max(1, Math.round((.35 + hash(i) * .4) * L)) / L, q = frac(t * rate + hash(i + 9));
    twinkle(c, x, y, 8 + hash(i + 3) * 7, Math.pow(Math.max(0, Math.sin(q * Math.PI)), 6) * .8 * e, '#F2F6FF');
  });
}
svScene.stars = {}; svScene.fire = {};
