// sanjeevani_cast.js: the designs for "Laye sajeevan" (Painterly, see PAINTERLY_GUIDE.md): Hanuman flying at dusk with
// the Dronagiri peak on his raised right palm, its herbs shining (Valmiki, Yuddha Kanda 74: the herbs blazed and lit the
// ten directions, and he tore off the whole peak), the gada in his left hand.
//   sjSky(c)          the dusk sky: indigo to saffron, the moon, high streaks, and a sea of clouds below
//   sjCloud(i)        a cloud as a design (i: 0–3 sea clouds, 4–6 thin wisps), drawn at [0, 0, SJ_CLOUD[i]]
//   sjHanuman(c)      him, in the body frame (SJ): head, torso, arms, the dhoti over bent legs
//   sjMountain(c)     the peak torn out with its earth, roots and his fingers round the front; herbs at SJ_HERBS
//   sjGada(c)         the gada upright in his left fist
//   sjTail(ph)        his tail rising on his left and curling over, for sway phase ph (0..1)
//   sjScarf(ph)       the two ends of his uttariya streaming back in the wind, for flutter phase ph (0..1)
// The figure is drawn in a body frame: origin at his chest, upright, then leaned and scaled into the frame by SJ.
// sjW(x, y) maps a body-frame point to frame px (for fine/keep discs, herb glows, the rim).
const SJ = { ox: 560, oy: 890, th: .08, s: .92 };
const sjW = (x, y) => [SJ.ox + (x * Math.cos(SJ.th) - y * Math.sin(SJ.th)) * SJ.s, SJ.oy + (x * Math.sin(SJ.th) + y * Math.cos(SJ.th)) * SJ.s];
const sjFrame = c => { c.translate(SJ.ox, SJ.oy); c.rotate(SJ.th); c.scale(SJ.s, SJ.s); };
const SJ_FACE = [0, -215], SJ_HS = 1.22;            // face centre (body frame) and head scale
const SJ_MB = [-305, -350];                          // where the mountain's earth sits on his palm (body frame)
const SJ_MOON = [800, 372];
// herbs on the slopes, relative to SJ_MB: [x, y, r]
const SJ_HERBS = [[-150, -82, 12], [-110, -124, 11], [-58, -152, 13], [2, -124, 12], [62, -142, 11], [120, -102, 12], [150, -70, 10], [-88, -202, 10],
  [-20, -204, 12], [58, -206, 10], [-130, -60, 11], [-30, -72, 13], [90, -66, 11], [8, -250, 9], [-168, -64, 9], [168, -64, 9]];
const SJ_SKIN = { dk: '#8F3016', base: '#D4572B', lt: '#F28A4C', muz: '#F2A36C' };
const SJ_GOLD = { base: '#E5AE34', dk: '#94631A', lt: '#FFE38C' };

// ---------- the sky (design) ----------
function sjSky(c) {
  const R = lcg(31);
  c.fillStyle = ptLin(c, 0, 0, 0, 1400, [[0, '#0C1033'], [.25, '#1C1A4E'], [.48, '#3A2C68'], [.66, '#7A3F78'], [.8, '#C46478'], [.9, '#EE9A62'], [1, '#FBC77A']]);
  c.fillRect(0, 0, PT_W, PT_H);
  // the moon, with a soft halo
  c.fillStyle = ptRad(c, SJ_MOON[0], SJ_MOON[1], 40, 340, [[0, 'rgba(230,226,255,.5)'], [.3, 'rgba(170,160,230,.18)'], [1, 'rgba(120,110,200,0)']]); c.fillRect(0, 0, PT_W, 900);
  ellipse(c, SJ_MOON[0], SJ_MOON[1], 66, 66, ptRad(c, SJ_MOON[0] - 18, SJ_MOON[1] - 20, 4, 80, [[0, '#FFFBEA'], [.7, '#F4EBD4'], [1, '#D9CDBE']]));
  for (const [dx, dy, r] of [[-20, -10, 16], [14, 12, 20], [22, -22, 10], [-12, 26, 11]]) ellipse(c, SJ_MOON[0] + dx, SJ_MOON[1] + dy, r, r * .8, 'rgba(176,166,170,.4)');
  // high streaks of cloud, rose underneath
  for (let i = 0; i < 14; i++) {
    const y = 820 + R() * 380, x = R() * PT_W, w = 160 + R() * 320, lit = clamp((y - 820) / 380);
    c.globalAlpha = .25 + R() * .25; ellipse(c, x, y, w, 7 + R() * 9, mixCol('#6F4C8C', '#F0A07E', lit), (R() - .5) * .06); c.globalAlpha = 1;
  }
  // the glow along the horizon, where the sun has gone
  c.fillStyle = ptRad(c, 540, 1360, 20, 760, [[0, 'rgba(255,214,140,.85)'], [.4, 'rgba(250,160,110,.35)'], [1, 'rgba(240,130,110,0)']]); c.fillRect(0, 900, PT_W, 800);
  // the sea of clouds: rows of rounded tops, small and lit far off, big and violet near
  for (let row = 0; row < 9; row++) {
    const k = row / 8, y0 = 1300 + Math.pow(k, 1.35) * 560, n = 9 - row * .5, rr = 40 + k * 120;
    for (let i = 0; i < n * 3; i++) {
      const x = (i / (n * 3)) * (PT_W + 200) - 100 + (R() - .5) * 80, y = y0 + (R() - .5) * 24, r = rr * (.6 + R() * .6);
      const glowK = clamp(1 - Math.abs(x - 540) / 900) * (1 - k * .75);
      ellipse(c, x, y + r * .25, r * 1.25, r * .7, mixCol('#3B2E62', '#7E5A8E', 1 - k), 0);
      ellipse(c, x - r * .05, y, r * 1.08, r * .58, mixCol(mixCol('#5C4580', '#B9789A', 1 - k), '#FFC79A', glowK * .8), 0);
      ellipse(c, x - r * .1, y - r * .22, r * .7, r * .32, mixCol(mixCol('#806098', '#F2B39A', 1 - k), '#FFE2B0', glowK), 0);
    }
  }
  ptMottle(c, 0, 1250, PT_W, PT_H, 260, ['#4A3A70', '#C98AA0', '#FFD6A8', '#6C5290'], R, 10, 40, .14);
  // the darkest foreground at the bottom
  c.fillStyle = ptLin(c, 0, 1640, 0, PT_H, [[0, 'rgba(30,22,60,0)'], [1, 'rgba(24,18,52,.65)']]); c.fillRect(0, 1640, PT_W, 280);
}

// ---------- clouds that sail past (designs) ----------
const SJ_CLOUD = [[620, 260], [520, 230], [700, 280], [560, 250], [700, 120], [560, 110], [640, 130]];
function sjCloud(i) {
  return (c) => {
    const [w, h] = SJ_CLOUD[i], R = lcg(40 + i * 7), wisp = i >= 4, lumps = [];
    const n = wisp ? 9 : 8 + (R() * 4 | 0);
    for (let k = 0; k < n; k++) {
      const u = (k + .5) / n, r = (wisp ? h * .22 : h * (.2 + R() * .17)) * (1 - Math.abs(u - .5) * 1.1);
      lumps.push([w * .08 + u * w * .84 + (R() - .5) * 30, h * .62 - r * (wisp ? .2 : .5) - R() * h * (wisp ? .05 : .15) * (1 - Math.abs(u - .5) * 1.6), r * (wisp ? 1.6 : 1)]);
    }
    const blob = (dy, col, sc = 1) => { c.fillStyle = col; c.beginPath(); for (const [x, y, r] of lumps) { c.moveTo(x + r * sc, y + dy); c.ellipse(x, y + dy, r * sc, r * sc * (wisp ? .32 : .78), 0, 0, TAU); } c.fill(); };
    blob(0, wisp ? '#6A4F8A' : '#4E3C78');
    c.save(); c.globalCompositeOperation = 'source-atop';
    blob(-h * .08, wisp ? '#B47FA4' : '#9B6E9C');
    blob(-h * .2, wisp ? '#F2B49A' : '#E9A79C', .9);
    blob(-h * .3, '#FFDDB2', .62);
    ptMottle(c, 0, 0, w, h, 60, ['#FFE7C0', '#8A6AA6', '#D99AA6'], R, 6, 22, .2);
    c.restore();
  };
}

// ---------- Hanuman (design, body frame) ----------
function sjHead(c, R) {
  c.save(); c.translate(...SJ_FACE); c.scale(SJ_HS, SJ_HS);
  for (const s of [-1, 1]) {   // ears with gold kundals
    ellipse(c, s * 56, 2, 15, 21, SJ_SKIN.base); ellipse(c, s * 57, 4, 8, 13, SJ_SKIN.dk);
    ellipse(c, s * 60, 38, 10, 13, SJ_GOLD.base); ellipse(c, s * 60, 36, 4, 6, SJ_GOLD.lt); ellipse(c, s * 60, 52, 4, 4, '#B81E24');
  }
  ptShape(c, 'M -52 -30 C -56 10 -46 50 0 66 C 46 50 56 10 52 -30 C 30 -52 -30 -52 -52 -30 Z', ptRad(c, -6, -14, 5, 80, [[0, SJ_SKIN.lt], [.6, SJ_SKIN.base], [1, SJ_SKIN.dk]], 0, 10));
  ellipse(c, 0, 32, 36, 27, SJ_SKIN.muz); ellipse(c, -2, 40, 30, 18, 'rgba(255,196,146,.6)');
  ellipse(c, 0, 58, 22, 7, 'rgba(140,50,20,.35)');
  for (const s of [-1, 1]) {
    c.strokeStyle = '#4A1A0C'; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(s * 8, -20); c.quadraticCurveTo(s * 24, -29, s * 43, -20); c.stroke();
    // open eyes, looking at us
    ellipse(c, s * 24, -4, 13, 7.6, '#FBF3E4');
    ellipse(c, s * 23, -3, 6.4, 6.4, '#5A2A10'); ellipse(c, s * 23, -3, 3.4, 3.4, '#140804'); ellipse(c, s * 21, -6, 1.9, 1.9, '#FFFFFF');
    c.strokeStyle = '#2A0E06'; c.lineWidth = 3.6; c.beginPath(); c.moveTo(s * 10, -5); c.quadraticCurveTo(s * 24, -15, s * 39, -4); c.stroke();
    c.strokeStyle = 'rgba(90,30,10,.5)'; c.lineWidth = 1.8; c.beginPath(); c.moveTo(s * 14, 3); c.quadraticCurveTo(s * 24, 7, s * 34, 3); c.stroke();
    ellipse(c, s * 34, 22, 12, 8, 'rgba(255,120,90,.25)');   // cheeks
  }
  ellipse(c, 0, 20, 9, 6, '#7E2A12'); ellipse(c, -5, 22, 2.6, 2, '#2A0E06'); ellipse(c, 5, 22, 2.6, 2, '#2A0E06');
  c.strokeStyle = '#6A200E'; c.lineWidth = 3; c.beginPath(); c.moveTo(-19, 43); c.quadraticCurveTo(0, 53, 19, 43); c.stroke();
  c.strokeStyle = '#FFFFFF'; c.lineWidth = 5; c.beginPath(); c.moveTo(-9, -50); c.lineTo(-7, -27); c.quadraticCurveTo(0, -19, 7, -27); c.lineTo(9, -50); c.stroke();
  c.strokeStyle = '#D6141E'; c.lineWidth = 5; c.beginPath(); c.moveTo(0, -48); c.lineTo(0, -25); c.stroke();
  ptShape(c, 'M -60 -28 C -58 -60 58 -60 60 -28 C 40 -48 -40 -48 -60 -28 Z', '#17100D');
  // the mukut: band, petals, dome, spire, side fans
  const gl = ptLin(c, -70, 0, 70, 0, [[0, SJ_GOLD.dk], [.3, SJ_GOLD.lt], [.55, SJ_GOLD.base], [1, SJ_GOLD.dk]]);
  for (const s of [-1, 1]) ptShape(c, `M ${s * 50} -42 C ${s * 80} -60 ${s * 96} -95 ${s * 88} -122 C ${s * 78} -95 ${s * 66} -75 ${s * 40} -65 Z`, gl);
  ptShape(c, 'M -62 -42 L -58 -75 L 58 -75 L 62 -42 Z', gl);
  for (let k = -2; k <= 2; k++) { ellipse(c, k * 23, -57, 7, 7, SJ_GOLD.dk); ellipse(c, k * 23, -58, 5.5, 5.5, k ? '#B81E24' : '#2C8A4A'); }
  for (let k = -3; k <= 3; k++) { const x = k * 17; ptShape(c, `M ${x - 11} -72 Q ${x - 10} -100 ${x} -115 Q ${x + 10} -100 ${x + 11} -72 Z`, k % 2 ? SJ_GOLD.base : SJ_GOLD.lt); }
  ptShape(c, 'M -46 -95 C -44 -132 -24 -150 0 -154 C 24 -150 44 -132 46 -95 Z', gl);
  for (let k = -2; k <= 2; k++) { const x = k * 15; ptShape(c, `M ${x - 8} -128 Q ${x} -150 ${x + 8} -128 Z`, SJ_GOLD.lt); }
  ellipse(c, 0, -120, 13, 16, SJ_GOLD.dk); ellipse(c, 0, -121, 10, 13, '#B81E24'); ellipse(c, -3, -126, 3.5, 4, '#FF9AA0');
  ptShape(c, 'M -12 -150 Q -6 -174 0 -200 Q 6 -174 12 -150 Z', gl);
  ellipse(c, 0, -182, 7, 8, SJ_GOLD.lt); ellipse(c, 0, -202, 5, 7, SJ_GOLD.lt);
  ptMottle(c, -100, -210, 100, -40, 60, [SJ_GOLD.lt, SJ_GOLD.dk, '#FFF3B8', '#C98A22'], R, 3, 9, .2);
  c.restore();
}

function sjHanuman(c) {
  const R = lcg(23), skin = { dk: SJ_SKIN.dk, base: SJ_SKIN.base, lt: SJ_SKIN.lt };
  c.save(); sjFrame(c);
  // ---- hair behind: locks streaming back (screen left) in the wind, a few falling on his left
  for (let k = 0; k < 9; k++) {
    const y0 = -232 + k * 13, wv = (R() - .5) * 22, len = 150 + R() * 70;
    ptLock(c, [[-40, y0], [-90, y0 + 18 + wv], [-40 - len * .8, y0 + 34 - wv], [-40 - len, y0 + 52 + k * 4]], 30 - k * 1.4, R);
  }
  for (let k = 0; k < 4; k++) ptLock(c, [[50 + k * 4, -210 + k * 6], [82 + k * 6, -165], [104 + k * 10, -120 + k * 4], [112 + k * 14, -82 + k * 8]], 26 - k * 3, R);

  // ---- legs, in a flying stride: his right leg stretched out behind (screen left), his left knee driving forward with
  // the shin hanging back under it. Shins and feet first, the dhoti over the thighs.
  const foot = (P, Wd, toeDir) => {   // a foot along P (heel to toes), toes fanned at the end
    ptForm(c, P, Wd, skin, -.3, -.9, .55);
    const [tx, ty] = P[P.length - 1], [px, py] = P[P.length - 2], a = Math.atan2(ty - py, tx - px), nx = -Math.sin(a), ny = Math.cos(a);
    for (let k = -2; k <= 2; k++) { const o = k * Wd[Wd.length - 1] * .2, r = 8 - Math.abs(k) * .8; ellipse(c, tx + nx * o + Math.cos(a) * (6 - Math.abs(k) * 2), ty + ny * o + Math.sin(a) * (6 - Math.abs(k) * 2), r, r * .8, SJ_SKIN.base); ellipse(c, tx + nx * o + Math.cos(a) * (6 - Math.abs(k) * 2) - 2, ty + ny * o + Math.sin(a) * (6 - Math.abs(k) * 2) - 2, r * .5, r * .4, SJ_SKIN.lt); }
    ellipse(c, P[0][0] - Math.cos(a) * 6, P[0][1] - Math.sin(a) * 6, Wd[0] * .42, Wd[0] * .36, SJ_SKIN.base);   // the heel
  };
  // his right leg, behind: the calf, the ankle, the foot pointed back
  ptForm(c, [[-236, 318], [-300, 340], [-360, 352], [-404, 356]], [104, 98, 74, 56], skin, -.25, -.95);
  ellipse(c, -300, 326, 46, 20, 'rgba(250,150,90,.45)', .2);                                               // the calf's lit top
  limb(c, [[-394, 330], [-398, 356], [-400, 382]], [18, 18, 18], SJ_GOLD.base); limb(c, [[-391, 330], [-395, 356], [-397, 382]], [4, 4, 4], SJ_GOLD.lt);   // anklet
  foot([[-412, 360], [-448, 356], [-486, 346]], [54, 46, 34]);
  // his left leg, in front: the shin hangs back under the knee, the foot points down and back
  ptForm(c, [[190, 384], [158, 420], [124, 448], [92, 466]], [106, 100, 76, 56], skin, -.3, -.9);
  ellipse(c, 168, 408, 40, 20, 'rgba(250,150,90,.45)', -.7);                                              // the calf's lit top
  limb(c, [[86, 440], [96, 464], [106, 488]], [18, 18, 18], SJ_GOLD.base); limb(c, [[89, 439], [99, 463], [109, 487]], [4, 4, 4], SJ_GOLD.lt);   // anklet
  foot([[82, 476], [54, 486], [24, 488]], [52, 44, 32]);
  // the dhoti: pelvis and both thighs to the knees, yellow, folds running to the knees
  const dh = ptLin(c, 0, 190, 0, 400, [[0, '#F6C255'], [.55, '#E19B33'], [1, '#A65B1C']]);
  ptShape(c, 'M -134 192 C -156 240 -166 272 -156 304 L 156 304 C 166 272 156 240 134 192 Z', dh);
  ptForm(c, [[-82, 258], [-160, 292], [-244, 320]], [176, 160, 132], { dk: '#A65B1C', base: '#E9A43A', lt: '#FFD27A' }, -.25, -.95, .55);
  ptForm(c, [[80, 258], [136, 316], [186, 372]], [180, 162, 136], { dk: '#A65B1C', base: '#EFAE46', lt: '#FFDA86' }, -.3, -.9, .55);
  c.lineCap = 'round';
  for (let i = 0; i < 14; i++) {
    const s = i % 2 ? 1 : -1, x0 = s * (40 + R() * 60), y0 = 230 + R() * 40, x1 = s > 0 ? 160 + R() * 30 : -220 - R() * 30, y1 = s > 0 ? 350 + R() * 30 : 300 + R() * 30;
    c.strokeStyle = R() < .5 ? 'rgba(150,78,20,.5)' : 'rgba(255,224,140,.5)'; c.lineWidth = 4 + R() * 6;
    c.beginPath(); c.moveTo(x0, y0); c.quadraticCurveTo((x0 + x1) / 2 + (R() - .5) * 40, (y0 + y1) / 2 + 20, x1, y1); c.stroke();
  }
  // the front pleats between the thighs, and the hems at the knees
  ptShape(c, 'M -22 205 L 22 205 L 34 330 Q 0 345 -30 330 Z', ptLin(c, -30, 0, 34, 0, [[0, '#C7782A'], [.5, '#FBCB66'], [1, '#C17026']]));
  limb(c, [[-268, 262], [-262, 322], [-250, 384]], [20, 20, 18], '#B8282A'); limb(c, [[118, 418], [176, 432], [244, 404]], [20, 20, 18], '#B8282A');

  // ---- torso
  const torso = 'M -48 -140 C -95 -122 -150 -112 -178 -92 C -200 -40 -175 30 -160 60 C -145 95 -132 150 -128 200 L 128 200 C 132 150 145 95 160 60 C 175 30 200 -40 178 -92 C 150 -112 95 -122 48 -140 Z';
  ptShape(c, torso, ptRad(c, -20, -40, 10, 290, [[0, SJ_SKIN.lt], [.5, SJ_SKIN.base], [1, SJ_SKIN.dk]], 0, 20));
  inside(c, torso, () => {
    for (const s of [-1, 1]) {
      ellipse(c, s * 68, -42, 72, 50, 'rgba(250,150,90,.5)', s * .18);
      ellipse(c, s * 68, 14, 68, 14, 'rgba(110,30,12,.45)', s * .1);
      for (let r = 0; r < 3; r++) ellipse(c, s * 27, 52 + r * 32, 23, 13, 'rgba(250,150,95,.3)');
      ellipse(c, s * 158, 60, 42, 130, 'rgba(110,30,12,.4)');
    }
    ellipse(c, 0, -108, 72, 26, 'rgba(110,30,12,.35)');
  });
  limb(c, [[-128, 196], [0, 206], [128, 196]], [22, 24, 22], SJ_GOLD.base, false);
  limb(c, [[-126, 191], [0, 200], [126, 191]], [5, 5, 5], SJ_GOLD.lt, false);
  // the uttariya over his shoulders, behind the neck (its ends stream back: sjScarf)
  limb(c, [[-196, -70], [-150, -112], [0, -146], [150, -112], [196, -70]], [34, 32, 30, 32, 34], '#A8261C', false);
  limb(c, [[-190, -78], [-148, -118], [0, -152], [148, -118], [190, -78]], [12, 12, 10, 12, 12], '#E0503A', false);

  // ---- his right arm raised high (screen left), palm up under the mountain
  const S1 = [-165, -80], E1 = [-262, -205], W1 = [-298, -330];
  ellipse(c, S1[0] - 4, S1[1] + 2, 62, 56, SJ_SKIN.dk); ellipse(c, S1[0] - 2, S1[1] - 4, 56, 50, SJ_SKIN.base); ellipse(c, S1[0] - 14, S1[1] - 18, 30, 22, 'rgba(250,150,90,.7)');
  ptForm(c, [[-172, -62], [-222, -140], E1], [100, 90, 72], skin, -.55, -.75);
  ptForm(c, [E1, [-284, -270], W1], [72, 64, 54], skin, -.6, -.6, .5);
  limb(c, [[-252, -112], [-218, -136], [-184, -160]], [18, 20, 18], SJ_GOLD.base); ellipse(c, -218, -136, 10, 9, '#B81E24'); ellipse(c, -220, -139, 3, 3, '#FF9AA0');
  limb(c, [[-324, -322], [-298, -330], [-272, -336]], [19, 19, 19], SJ_GOLD.base); limb(c, [[-324, -326], [-298, -334], [-272, -340]], [4, 4, 4], SJ_GOLD.lt);
  ellipse(c, -302, -352, 38, 22, SJ_SKIN.dk, -.1); ellipse(c, -302, -356, 34, 18, SJ_SKIN.base, -.1);   // the heel of the hand
  // ---- his left arm (screen right), down to the fist round the gada
  const S2 = [165, -80], E2 = [240, 45], W2 = [278, 148];
  ellipse(c, S2[0] + 4, S2[1] + 4, 62, 56, SJ_SKIN.dk); ellipse(c, S2[0] + 2, S2[1] - 2, 56, 50, SJ_SKIN.base); ellipse(c, S2[0] - 6, S2[1] - 16, 30, 22, 'rgba(250,150,90,.6)');
  ptForm(c, [[170, -60], [210, -10], E2], [96, 88, 70], skin, -.45, -.8);
  ptForm(c, [E2, [262, 100], W2], [70, 62, 52], skin, -.5, -.7, .5);
  limb(c, [[178, -10], [205, -18], [234, -28]], [18, 20, 18], SJ_GOLD.base); ellipse(c, 206, -18, 10, 9, '#B81E24'); ellipse(c, 204, -21, 3, 3, '#FF9AA0');
  limb(c, [[252, 146], [278, 140], [302, 134]], [19, 19, 19], SJ_GOLD.base); limb(c, [[252, 142], [278, 136], [302, 130]], [4, 4, 4], SJ_GOLD.lt);
  ellipse(c, 290, 176, 33, 36, SJ_SKIN.dk); ellipse(c, 288, 172, 29, 32, SJ_SKIN.base);
  for (let k = 0; k < 4; k++) { ellipse(c, 270 + k * 3, 156 + k * 14, 14, 7, SJ_SKIN.dk, -.15); ellipse(c, 268 + k * 3, 154 + k * 14, 11, 5, SJ_SKIN.lt, -.15); }
  ptForm(c, [[300, 152], [286, 146], [272, 150]], [16, 14, 12], skin, 0, -1, .6);   // the thumb over the top
  ptMottle(c, -360, -360, 340, 480, 520, [SJ_SKIN.dk, SJ_SKIN.lt, '#E86A34', '#B8401E', '#F7B24A', '#C77A26'], R, 6, 24, .18);

  // ---- neck, hair in front, sacred thread, necklaces, garlands
  ptShape(c, 'M -40 -164 L 40 -164 C 46 -134 72 -120 112 -112 L -112 -112 C -72 -120 -46 -134 -40 -164 Z', ptLin(c, 0, -164, 0, -112, [[0, SJ_SKIN.dk], [1, SJ_SKIN.base]]));
  for (let k = 0; k < 2; k++) ptLock(c, [[58 + k * 8, -196], [74 + k * 10, -150], [98 + k * 14, -100], [104 + k * 18, -50]], 20 - k * 4, R);
  c.strokeStyle = '#F7EED0'; c.lineWidth = 4; c.beginPath(); c.moveTo(118, -106); c.quadraticCurveTo(22, 40, -118, 196); c.stroke();   // janeu: over his left shoulder (screen right)
  c.strokeStyle = SJ_GOLD.dk; c.lineWidth = 9; c.beginPath(); c.ellipse(0, -118, 52, 32, 0, .15, Math.PI - .15); c.stroke();
  c.strokeStyle = SJ_GOLD.base; c.lineWidth = 6; c.beginPath(); c.ellipse(0, -120, 52, 32, 0, .15, Math.PI - .15); c.stroke();
  c.lineWidth = 5; c.beginPath(); c.ellipse(0, -104, 72, 74, 0, .3, Math.PI - .3); c.stroke();
  ellipse(c, 0, -32, 15, 19, SJ_GOLD.base); ellipse(c, 0, -32, 8, 10, '#B81E24'); ellipse(c, -2, -36, 3, 3, '#FF9AA0');
  // garlands swing back a little in the wind
  const sw = (P) => P.map(([x, y]) => [x - Math.max(0, y + 100) * .1, y]);
  ptFlowers(c, sw([[-102, -112], [-114, 10], [-96, 130], [-40, 196], [36, 196], [92, 130], [114, 10], [102, -112]]), 6, ['#3E7A2E', '#5C9A3A', '#2E5E22'], R, 1);
  ptFlowers(c, sw([[-112, -112], [-126, 10], [-108, 134], [-44, 204], [40, 204], [104, 134], [124, 10], [112, -112]]), 13, ['#F6971C', '#F7B22A', '#E8761A', '#FBC93C', '#D9601A'], R, 2);
  ptFlowers(c, sw([[-82, -118], [-92, -26], [-66, 74], [0, 116], [64, 74], [90, -26], [80, -118]]), 15, ['#F6F3EA', '#E9E6EF', '#D3CDE6', '#FFFFFF', '#B8B1D6', '#C9C3E0'], R, 3);

  // ---- the head
  sjHead(c, R);
  // ---- grade: the herbs' gold light from above left, the dusk violet from below right
  c.save(); c.globalCompositeOperation = 'source-atop';
  c.fillStyle = ptLin(c, -360, -420, 300, 500, [[0, 'rgba(255,240,170,.24)'], [.45, 'rgba(255,230,170,0)'], [.8, 'rgba(90,60,140,.12)'], [1, 'rgba(70,50,130,.3)']]); c.fillRect(-500, -700, 1100, 1300);
  c.restore();
  c.restore();
}

// ---------- the mountain (design, body frame) ----------
// Drawn round SJ_MB (where its earth sits on his palm), scaled by SJ_MS: two snowy summits, rock lit lavender on the faces
// turned to the moon, forest on the lower slopes, the herbs shining among them.
const SJ_MS = 1.1;
const SJ_PEAK = 'M -200 -50 L -196 -92 L -178 -120 L -170 -150 L -150 -176 L -132 -168 L -116 -214 L -96 -246 L -80 -236 L -60 -280 L -36 -318 L -14 -296 L 4 -270 L 18 -282 L 38 -300 L 58 -268 L 80 -236 L 100 -222 L 118 -190 L 140 -168 L 158 -130 L 176 -98 C 186 -80 190 -64 190 -50 Z';
function sjMountain(c) {
  const R = lcg(51);
  c.save(); sjFrame(c); c.translate(...SJ_MB); c.scale(SJ_MS, SJ_MS);
  // the earth torn out under it, and the roots hanging from it
  c.lineCap = 'round';
  for (let i = 0; i < 16; i++) {
    const x = -180 + i * 23 + (R() - .5) * 14, len = 30 + R() * 64, P = [[x, -4], [x + (R() - .5) * 20, len * .5], [x + (R() - .5) * 34, len]];
    limb(c, P, [7, 4, 1.5], R() < .5 ? '#3A2416' : '#5A3A22');
  }
  ptShape(c, 'M -204 -54 C -188 -2 -110 16 -15 14 C 80 14 162 -2 194 -54 Z', ptLin(c, 0, -54, 0, 14, [[0, '#7A5232'], [.5, '#55361F'], [1, '#2E1C10']]));
  for (let i = 0; i < 22; i++) ellipse(c, -180 + R() * 360, -44 + R() * 44, 6 + R() * 12, 4 + R() * 7, ['#6E6464', '#8A7E76', '#4E4448', '#7A5A3E'][R() * 4 | 0], R() * 3);
  // the rock
  ptShape(c, SJ_PEAK, ptLin(c, -200, -320, 190, -50, [[0, '#4A3C5C'], [.55, '#3A2E4C'], [1, '#2A2238']]));
  inside(c, SJ_PEAK, () => {
    // ridges run down from each point of the skyline: the face right of a ridge is lit by the moon, the left in shade
    const tops = [[-36, -318], [38, -300], [-96, -246], [-150, -176], [100, -222], [140, -168], [-60, -280], [80, -236]];
    for (const [x, y] of tops) {
      const dx = 40 + R() * 50, bx = x + dx * .4, by = -40 - R() * 30;
      poly(c, [[x, y], [x + dx * 1.6, by + 20], [bx + 6, by]], 'rgba(176,160,210,.55)');
      poly(c, [[x, y], [bx, by], [x - dx * .9, by + 10]], 'rgba(18,12,30,.4)');
      c.strokeStyle = 'rgba(220,210,240,.45)'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(x, y); c.lineTo(bx + 3, by); c.stroke();
    }
    // strata: short slanting cracks
    for (let i = 0; i < 70; i++) { const x = -190 + R() * 380, y = -60 - R() * 240; c.strokeStyle = R() < .5 ? 'rgba(20,14,34,.35)' : 'rgba(200,190,230,.25)'; c.lineWidth = 1.5 + R() * 2; c.beginPath(); c.moveTo(x, y); c.lineTo(x + 10 + R() * 18, y + 6 + R() * 10); c.stroke(); }
    // snow on both summits, pink in the dusk
    ptShape(c, 'M -84 -244 L -60 -280 L -36 -318 L -14 -296 L 4 -270 L 18 -282 L 38 -300 L 58 -268 L 70 -252 L 48 -256 L 36 -240 L 22 -258 L 8 -244 L -6 -262 L -22 -250 L -34 -276 L -48 -246 L -62 -258 Z',
      ptLin(c, -80, -320, 60, -240, [[0, '#FFF6F2'], [.6, '#E6D4E6'], [1, '#B8A6CE']]));
    // forest on the lower slopes, dark, the side toward the moon a little lighter
    for (let i = 0; i < 300; i++) {
      const x = -196 + R() * 386, y = -48 - Math.pow(R(), 1.8) * 95, lit = clamp((x + 40) / 260 + (R() - .5) * .4);
      ellipse(c, x, y, 6 + R() * 11, 5 + R() * 8, mixCol(mixCol('#132619', '#24402A', R()), '#58706A', lit * .6), R() * 3);
    }
    // the herbs' light on the slopes round them
    for (const [x, y, r] of SJ_HERBS) { c.fillStyle = ptRad(c, x, y, 0, r * 5, [[0, 'rgba(232,255,150,.55)'], [.5, 'rgba(200,240,120,.18)'], [1, 'rgba(200,240,120,0)']]); c.fillRect(x - r * 5, y - r * 5, r * 10, r * 10); }
  });
  // the herbs: tufts of shining leaves
  for (const [x, y, r] of SJ_HERBS) {
    for (let k = 0; k < 7; k++) {
      const a = (k - 3) * .38, l = r * (.9 + R() * .5);
      c.save(); c.translate(x, y); c.rotate(a);
      c.fillStyle = ['#F2FFB4', '#D8FF8C', '#FFF6B0'][k % 3]; c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(-l * .35, -l * .5, 0, -l); c.quadraticCurveTo(l * .35, -l * .5, 0, 0); c.fill(); c.restore();
    }
    ellipse(c, x, y - r * .3, r * .35, r * .35, '#FFFFF0');
  }
  ptMottle(c, -200, -320, 190, 10, 140, ['#5A4A70', '#2A2038', '#7A6A8E', '#3E5A3E'], R, 4, 14, .16);
  // his fingers round the front of the earth
  for (let k = 0; k < 4; k++) ptForm(c, [[-26 + k * 17, 16], [-28 + k * 17, 0], [-27 + k * 17, -14]], [17, 15, 12], { dk: SJ_SKIN.dk, base: SJ_SKIN.base, lt: SJ_SKIN.lt }, -.3, -.8, .5);
  ptForm(c, [[42, 12], [52, 0], [56, -12]], [18, 15, 12], { dk: SJ_SKIN.dk, base: SJ_SKIN.base, lt: SJ_SKIN.lt }, -.3, -.8, .5);
  c.restore();
}
// a point on the mountain (relative to SJ_MB, before SJ_MS) in frame px
const sjM = (x, y) => sjW(SJ_MB[0] + x * SJ_MS, SJ_MB[1] + y * SJ_MS);

// ---------- the gada (design, body frame) ----------
function sjGada(c) {
  c.save(); sjFrame(c);
  const H = [338, -112], r = 66;
  limb(c, [[268, 250], [300, 70], [326, -50]], [26, 25, 24], ptLin(c, 270, 0, 310, 0, [[0, SJ_GOLD.dk], [.5, SJ_GOLD.lt], [1, SJ_GOLD.dk]]));
  ellipse(c, 266, 262, 15, 18, SJ_GOLD.base); ellipse(c, 264, 258, 7, 9, SJ_GOLD.lt);
  for (const y of [40, 0, -30]) ellipse(c, 300 + (70 - y) * .14 - 10, y, 18, 8, SJ_GOLD.dk, -.18);
  ellipse(c, H[0], H[1], r, r * .94, ptRad(c, H[0] - 22, H[1] - 24, 4, r * 1.1, [[0, SJ_GOLD.lt], [.4, SJ_GOLD.base], [1, SJ_GOLD.dk]]));
  for (let k = -2; k <= 2; k++) { c.strokeStyle = 'rgba(120,70,15,.6)'; c.lineWidth = 4; c.beginPath(); c.ellipse(H[0], H[1], Math.abs(k) * 16 + 3, r * .9, -.18, -Math.PI / 2, Math.PI / 2, k < 0); c.stroke(); }
  ellipse(c, H[0] - 10, H[1] + r * .8, 26, 8, SJ_GOLD.dk, -.18);
  ellipse(c, H[0] + 12, H[1] - r * .82, 24, 8, SJ_GOLD.dk, -.18);
  ellipse(c, H[0] + 16, H[1] - r - 14, 12, 15, SJ_GOLD.base); ellipse(c, H[0] + 15, H[1] - r - 18, 6, 7, SJ_GOLD.lt);
  c.restore();
}
const SJ_GADA_BOX = [770, 700, 260, 520];

// ---------- the tail (design, one pose per phase) ----------
function sjTail(ph) {
  return (c) => {
    const sw = Math.sin(ph * TAU), sw2 = Math.sin(ph * TAU - 1);
    const P = [[110, 250], [240, 250], [360, 190], [440, 60], [462 + sw * 10, -110], [440 + sw * 26, -260], [384 + sw * 40, -360], [326 + sw2 * 52, -372], [306 + sw2 * 56, -330], [330 + sw2 * 54, -298]];
    c.save(); sjFrame(c);
    const Wd = P.map((_, i) => 32 - i * 1.9);
    limb(c, P, Wd, ptLin(c, 0, -380, 0, 260, [[0, SJ_SKIN.lt], [.5, SJ_SKIN.base], [1, SJ_SKIN.dk]]));
    c.globalAlpha = .5; limb(c, P.map(([x, y]) => [x - 6, y - 3]), Wd.map(v => v * .35), '#FFB47A'); c.globalAlpha = 1;
    const [tx, ty] = P[P.length - 1]; ellipse(c, tx, ty + 6, 15, 20, '#9C2E12');
    c.restore();
  };
}
const SJ_TAIL_BOX = [620, 480, 420, 760];

// ---------- the uttariya's two ends, streaming back (design, one pose per phase) ----------
// Broad cloth: the wave runs down it, and where it twists the band narrows and shows its darker underside.
function sjScarf(ph) {
  return (c) => {
    c.save(); sjFrame(c);
    for (const [x0, y0, L, droop, w0, off] of [[-130, -40, 400, 50, 80, 0], [-110, 160, 330, 60, 62, .45]]) {
      const n = 14, mid = [], top = [], bot = [];
      for (let i = 0; i <= n; i++) {
        const s = i / n, wave = TAU * (s * 1.1 - ph - off), a = 46 * Math.pow(s, 1.1);
        mid.push([x0 - L * s, y0 + droop * s * s + a * Math.sin(wave)]);
      }
      for (let i = 0; i <= n; i++) {
        const s = i / n, wave = TAU * (s * 1.1 - ph - off), tw = .35 + .65 * Math.abs(Math.cos(wave * .5 + .6)), w = w0 * (1 - s * .35) * (s < .08 ? .8 : 1) * tw / 2;
        const p = mid[Math.max(0, i - 1)], q = mid[Math.min(n, i + 1)], dx = q[0] - p[0], dy = q[1] - p[1], d = Math.hypot(dx, dy) || 1;
        top.push([mid[i][0] + dy / d * w, mid[i][1] - dx / d * w, tw]); bot.push([mid[i][0] - dy / d * w, mid[i][1] + dx / d * w, tw]);
      }
      // the end is cut square, with a short fringe
      const band = () => { c.beginPath(); top.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); for (let i = n; i >= 0; i--) c.lineTo(bot[i][0], bot[i][1]); c.closePath(); };
      band(); c.fillStyle = ptLin(c, x0, 0, x0 - L, 0, [[0, '#B42C20'], [1, '#D8452E']]); c.fill();
      c.save(); band(); c.clip();
      // where the band twists thin we see its underside: darker
      for (let i = 0; i < n; i++) { const k = 1 - top[i][2]; if (k < .25) continue; poly(c, [top[i], top[i + 1], bot[i + 1], bot[i]], `rgba(90,14,10,${(k * .7).toFixed(2)})`); }
      // the light along the upper edge, a gold border along the lower
      limb(c, top.map(([x, y]) => [x, y + 7]), top.map(() => 10), 'rgba(255,150,110,.55)', false);
      limb(c, bot.map(([x, y]) => [x, y - 6]), bot.map(() => 7), SJ_GOLD.base, false);
      c.restore();
      const e = n; for (let k = 0; k < 6; k++) { const u = k / 5, x = lerp(top[e][0], bot[e][0], u), y = lerp(top[e][1], bot[e][1], u); c.strokeStyle = SJ_GOLD.base; c.lineWidth = 3; c.beginPath(); c.moveTo(x, y); c.lineTo(x - 16, y + 3); c.stroke(); }
    }
    c.restore();
  };
}
const SJ_SCARF_BOX = [0, 740, 540, 560];
