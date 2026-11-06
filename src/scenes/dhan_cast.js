// dhan_cast.js: the designs for "Happy Dhanteras", a Painterly greeting-card cinemagraph (see PAINTERLY_GUIDE.md): Maa
// Lakshmi with four arms seated on a pink lotus on a cream card, a gold chakra turning behind her head; her upper hands
// hold lotuses, her lower right pours gold coins into a brass pot, her lower left holds a gold kalash. Marigold strings
// with brass bells hang from the top corners and swing; a gold filigree crest hangs at the top; a brass lamp burns.
//   dhCard(c)          the set: the cream card, the faint mandala behind her, the gold crest, the lotus seat's back petals
//   dhHalo(c)          the gold chakra behind her head (baked once, turned in the scene; 24-fold, so 1/24 turn loops)
//   dhLakshmi(eyes)    Maa Lakshmi (eyes: 1 open, 0 shut, for the blink); bake with DH_BOX, DH_FINE, DH_KEEP
//   dhFront(c)         in front of her: the lotus seat's front petals, the brass pot of coins, the lamp stand
//   dhGarlands(ph)     the four marigold strings and their bells at swing phase ph (0..1); DH_BELLS(ph): the bells (px)
// Positions: DH_FACE, DH_HALO (the chakra's centre), DH_POUR (where the coins leave her fingers), DH_POT (the pot's mouth),
// DH_FLAMES (the lamps' wicks), DH_KALASH (the kalash's mouth).
const DH_X = 540, DH_DY = 45;                       // she is drawn with the face at (540, 1000), then moved down DH_DY
const DH_HEAD = 1.15, DH_CHIN = 1100;               // her head is drawn bigger, grown up from the chin
const dhHd = (x, y) => [DH_X + (x - DH_X) * DH_HEAD, DH_CHIN + (y - DH_CHIN) * DH_HEAD + DH_DY];   // a head point → reel px
const DH_FY = dhHd(DH_X, 1000)[1];                  // her face's centre in the reel
const DH_FACE = [DH_X, DH_FY], DH_HALO = [DH_X, DH_FY - 30];
const DH_SKIN = { base: '#E8B088', dk: '#A86A48', lt: '#FCD8B6' };
const DH_RED = { base: '#C21F35', dk: '#6E0C1E', lt: '#E8505E' };
const DH_GOLD = { base: '#D9A440', dk: '#8A5A16', lt: '#FFE6A0', mid: '#F2C25A' };
const DH_PINK = { tip: '#D9497A', mid: '#F08FAE', base: '#FFE4EC' };
const DH_BOX = [140, 580 + DH_DY, 800, 1100];
const DH_FINE = [[DH_X, DH_FY, 135], [DH_X - 330, 1470 + DH_DY, 60], [DH_X + 300, 1530 + DH_DY, 50], [DH_X - 290, 1072 + DH_DY, 40], [DH_X + 290, 1072 + DH_DY, 40]];
const DH_KEEP = [[DH_X, DH_FY + 4, 118, .7], [...dhHd(DH_X - 40, 988), 40, .55], [...dhHd(DH_X + 40, 988), 40, .55], [...dhHd(DH_X, 1068), 26, .5]];
const DH_POUR = [DH_X - 342, 1512 + DH_DY];
const DH_POT = [196, 1700];
const DH_KALASH = [DH_X + 304, 1398 + DH_DY];
const DH_LAMP = [930, 1600];
const DH_FLAMES = [[DH_LAMP[0], DH_LAMP[1] - 6], [70, 1846], [1010, 1846], [420, 1880], [660, 1880]];

// ---------- small parts ----------
// a lotus petal: base at (0, 0), pointing up (-y), length h, half-width w
const dhPetal = (h, w) => `M 0 0 C ${w} ${-h * .25} ${w * .7} ${-h * .8} 0 ${-h} C ${-w * .7} ${-h * .8} ${-w} ${-h * .25} 0 0 Z`;
function dhPetalAt(c, x, y, ang, h, w, cols = DH_PINK) {
  c.save(); c.translate(x, y); c.rotate(ang);
  ptShape(c, dhPetal(h, w), ptLin(c, 0, 0, 0, -h, [[0, cols.base], [.55, cols.mid], [1, cols.tip]]));
  c.strokeStyle = 'rgba(176,40,96,.55)'; c.lineWidth = Math.max(1.4, w * .045); c.stroke(new Path2D(dhPetal(h, w)));   // its edge
  c.strokeStyle = 'rgba(190,60,110,.35)'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(0, -h * .1); c.lineTo(0, -h * .85); c.stroke();   // the midrib
  ellipse(c, -w * .3, -h * .45, w * .18, h * .22, 'rgba(255,255,255,.35)');                                                           // its lit side
  c.restore();
}
// a lotus in bloom seen from the front: back petals fanned, front petals cupped, a gold heart
function dhLotus(c, x, y, r, rot = 0) {
  c.save(); c.translate(x, y); c.rotate(rot);
  [-1.25, 1.25].forEach(a => dhPetalAt(c, 0, r * .3, a, r * .9, r * .32));
  [-.8, -.4, 0, .4, .8].forEach(a => dhPetalAt(c, 0, r * .32, a, r * 1.05, r * .34));
  ellipse(c, 0, -r * .05, r * .3, r * .16, '#F7C84A'); ellipse(c, 0, -r * .1, r * .22, r * .1, '#FFE89A');
  for (let i = 0; i < 9; i++) ellipse(c, (i - 4) * r * .06, -r * .16 - Math.abs(i - 4) * -r * .01, 2.2, 4.4, '#E89A22');
  [-.55, -.18, .18, .55].forEach(a => dhPetalAt(c, 0, r * .4, a, r * .62, r * .3, { base: '#FFF0F4', mid: '#F6A6C0', tip: '#E2608C' }));
  c.restore();
}
// a gold coin, flat-on (in designs); the falling coins in the scene are drawn live
function dhCoin(c, x, y, r, tilt = 1) {
  ellipse(c, x, y + 1.5, r, r * tilt, '#7A4A10'); ellipse(c, x, y, r, r * tilt, '#E9B23C'); ellipse(c, x, y, r * .72, r * .72 * tilt, '#F7CF5E');
  ellipse(c, x - r * .3, y - r * .3 * tilt, r * .28, r * .18 * tilt, 'rgba(255,250,220,.8)');
}
// a string of gold beads (or pearls) along points
function dhBeads(c, P, r, gap, cols = [DH_GOLD.base, DH_GOLD.mid, DH_GOLD.lt]) {
  const C = through(P, 24); let d = gap;
  for (let i = 0; i < C.length; i++) {
    if (i) d += Math.hypot(C[i][0] - C[i - 1][0], C[i][1] - C[i - 1][1]); if (d < gap) continue; d = 0;
    const [x, y] = C[i]; ellipse(c, x, y + r * .25, r, r, 'rgba(90,50,10,.55)'); ellipse(c, x, y, r, r, cols[0]); ellipse(c, x - r * .25, y - r * .25, r * .55, r * .5, cols[1]); ellipse(c, x - r * .35, y - r * .4, r * .25, r * .2, cols[2]);
  }
}
// a gold band along points: dark under-edge, gold body, a lit line
function dhBand(c, P, w, cap = false) {
  limb(c, P, P.map(() => w), DH_GOLD.dk, cap);
  limb(c, P.map(([x, y]) => [x, y - w * .08]), P.map(() => w * .78), DH_GOLD.base, cap);
  c.save(); c.globalAlpha = .8; limb(c, P.map(([x, y]) => [x, y - w * .22]), P.map(() => w * .22), DH_GOLD.lt, cap); c.restore();
}
function dhGem(c, x, y, r, col) {   // a cabochon set in gold
  ellipse(c, x, y, r + 2.5, r * 1.05 + 2.5, DH_GOLD.dk); ellipse(c, x, y, r + 1.2, r * 1.05 + 1.2, DH_GOLD.mid);
  ellipse(c, x, y, r, r * 1.05, col); ellipse(c, x - r * .3, y - r * .35, r * .35, r * .25, 'rgba(255,255,255,.7)');
}

// ---------- the card (design) ----------
function dhCard(c) {
  const R = lcg(11);
  // cream paper, warmer toward the middle where her light falls
  c.fillStyle = ptLin(c, 0, 0, 0, PT_H, [[0, '#EADCC2'], [.35, '#F3E8D2'], [.7, '#EFE0C4'], [1, '#E2CDA8']]); c.fillRect(0, 0, PT_W, PT_H);
  c.fillStyle = ptRad(c, DH_X, DH_FY, 60, 900, [[0, 'rgba(255,240,205,.8)'], [1, 'rgba(255,240,205,0)']]); c.fillRect(0, 0, PT_W, PT_H);
  ptMottle(c, 0, 0, PT_W, PT_H, 520, ['#E4D2B2', '#F6EDDA', '#DCC6A0', '#EEE0C6', '#E8D6BC'], R, 30, 120, .3);
  // the faint mandala behind her: rings of petals drawn in a darker tan, like a watermark
  c.save(); c.translate(DH_X, DH_FY - 30);
  const tan = a => `rgba(150,112,70,${a})`;
  c.lineWidth = 2.4;
  for (const [r, n, h, a] of [[290, 24, 70, .3], [380, 32, 80, .24], [480, 40, 90, .18]]) {
    c.strokeStyle = tan(a);
    for (let i = 0; i < n; i++) { const g = i / n * TAU; c.save(); c.rotate(g); c.beginPath(); c.moveTo(-TAU * r / n / 2, -r); c.quadraticCurveTo(0, -r - h * 1.6, TAU * r / n / 2, -r); c.stroke(); c.beginPath(); c.moveTo(0, -r - 6); c.lineTo(0, -r - h * .55); c.stroke(); c.restore(); }
    c.beginPath(); c.arc(0, 0, r, 0, TAU); c.stroke();
  }
  for (let i = 0; i < 48; i++) { const g = i / 48 * TAU; ellipse(c, Math.cos(g) * 540, Math.sin(g) * 540, 4, 4, tan(.18)); }
  c.restore();
  // the gold crest hanging at the top: a half mandala of scrolls and petals
  c.save(); c.translate(DH_X, -40);
  const gold = ptLin(c, -300, 0, 300, 0, [[0, DH_GOLD.dk], [.3, DH_GOLD.mid], [.5, DH_GOLD.lt], [.7, DH_GOLD.mid], [1, DH_GOLD.dk]]);
  for (let i = 0; i <= 16; i++) {   // big petals fanned downward
    const g = Math.PI * (.06 + i / 16 * .88); c.save(); c.rotate(g - Math.PI / 2);
    ptShape(c, 'M -22 120 C -40 170 -26 220 0 250 C 26 220 40 170 22 120 Z', gold);
    ptShape(c, 'M -10 140 C -18 170 -12 200 0 220 C 12 200 18 170 10 140 Z', 'rgba(110,70,20,.55)');
    ellipse(c, 0, 268, 7, 7, DH_GOLD.mid); c.restore();
  }
  for (let i = 0; i <= 24; i++) {   // scrolls between them
    const g = Math.PI * (.04 + i / 24 * .92); c.save(); c.rotate(g - Math.PI / 2);
    c.strokeStyle = DH_GOLD.base; c.lineWidth = 5; c.beginPath(); c.moveTo(0, 96); c.bezierCurveTo(26, 104, 30, 136, 10, 140); c.bezierCurveTo(-2, 140, -4, 128, 6, 124); c.stroke(); c.restore();
  }
  ellipse(c, 0, 0, 120, 120, DH_GOLD.dk); ellipse(c, 0, 0, 112, 112, gold); ellipse(c, 0, 0, 86, 86, '#B97E26');
  for (let i = 0; i < 12; i++) { const g = Math.PI * (i / 11); dhPetalAt(c, Math.cos(g) * 60, Math.sin(g) * 60, g + Math.PI / 2, 34, 12, { base: DH_GOLD.lt, mid: DH_GOLD.mid, tip: DH_GOLD.dk }); }
  dhGem(c, 0, 60, 12, '#B0182C');
  c.restore();
  ptMottle(c, 200, 0, 880, 260, 80, [DH_GOLD.lt, DH_GOLD.dk, DH_GOLD.mid], R, 4, 14, .25);
  // the lotus seat's back petals, behind her lap
  const sy = 1640 + DH_DY;
  for (let i = 0; i < 11; i++) { const a = -1.35 + i / 10 * 2.7; dhPetalAt(c, DH_X + Math.sin(a) * 80, sy + 40, a, 230 + Math.cos(a) * 60, 74); }
  for (let i = 0; i < 9; i++) { const a = -1.5 + i / 8 * 3; dhPetalAt(c, DH_X + Math.sin(a) * 160, sy + 70, a * 1.05, 190, 70, { base: '#FFF2F6', mid: '#F7B0C6', tip: '#E46A92' }); }
  // the warm shadow under the seat
  c.save(); c.translate(DH_X, 1880); c.scale(1, .12); glow(c, 0, 0, 520, '#7A4A20', .45, 'source-over'); c.restore();
}

// ---------- the gold chakra behind her head (design, centred on DH_HALO) ----------
const DH_HALO_R = 250, DH_HALO_BOX = [DH_HALO[0] - DH_HALO_R - 10, DH_HALO[1] - DH_HALO_R - 10, (DH_HALO_R + 10) * 2, (DH_HALO_R + 10) * 2];
function dhHalo(c) {
  const [hx, hy] = DH_HALO, rr = DH_HALO_R;
  c.save(); c.translate(hx, hy);
  // 24 flame-points round the rim
  for (let i = 0; i < 24; i++) {
    c.save(); c.rotate(i / 24 * TAU);
    ptShape(c, `M -24 ${-rr + 46} C -20 ${-rr + 20} -6 ${-rr + 6} 0 ${-rr} C 6 ${-rr + 6} 20 ${-rr + 20} 24 ${-rr + 46} Z`, ptLin(c, 0, -rr, 0, -rr + 46, [[0, DH_GOLD.lt], [1, DH_GOLD.base]]));
    ellipse(c, 0, -rr + 30, 5, 8, '#C0392B'); c.restore();
  }
  ellipse(c, 0, 0, rr - 40, rr - 40, ptRad(c, 0, 0, rr * .3, rr - 40, [[0, 'rgba(255,236,170,.0)'], [.8, 'rgba(255,214,120,.55)'], [1, DH_GOLD.base]]));
  c.strokeStyle = DH_GOLD.dk; c.lineWidth = 6; c.beginPath(); c.arc(0, 0, rr - 42, 0, TAU); c.stroke();
  c.strokeStyle = DH_GOLD.lt; c.lineWidth = 3; c.beginPath(); c.arc(0, 0, rr - 46, 0, TAU); c.stroke();
  for (let i = 0; i < 48; i++) { const g = i / 48 * TAU; ellipse(c, Math.cos(g) * (rr - 60), Math.sin(g) * (rr - 60), 4.5, 4.5, i % 2 ? DH_GOLD.lt : '#FFF6DA'); }
  // spokes: thin gold lines with a bead
  for (let i = 0; i < 24; i++) { const g = i / 24 * TAU; c.strokeStyle = 'rgba(200,140,40,.6)'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(Math.cos(g) * 120, Math.sin(g) * 120); c.lineTo(Math.cos(g) * (rr - 74), Math.sin(g) * (rr - 74)); c.stroke(); ellipse(c, Math.cos(g) * 160, Math.sin(g) * 160, 5, 5, DH_GOLD.mid); }
  c.strokeStyle = DH_GOLD.base; c.lineWidth = 4; c.beginPath(); c.arc(0, 0, 120, 0, TAU); c.stroke();
  c.restore();
}

// ---------- Maa Lakshmi (design, face at (540, 1000); moved down by DH_DY) ----------
// a hand in varada (giving): palm toward us, fingers down, alta on the palm and fingertips. Local u along the hand from
// the wrist, v across (v > 0: the thumb's side).
function dhVaradaHand(c, wr, ang, s = 1) {
  const sk = DH_SKIN;
  c.save(); c.translate(wr[0], wr[1]); c.rotate(ang); c.scale(1, s);
  // fingers: index (nearest the thumb) to little
  [[13, 34, 10.5], [4, 40, 11], [-5, 37, 10.5], [-14, 29, 9.5]].forEach(([v, len, w], i) => {
    ptForm(c, [[40, v], [40 + len * .55, v - i * .6], [40 + len, v - i * 1.2]], [w, w * .92, w * .72], sk, 0, -.8, .45);
    ellipse(c, 40 + len - 3, v - i * 1.2, w * .32, w * .3, '#C0303A');   // alta on the fingertip
  });
  // the palm
  ellipse(c, 24, 0, 30, 25, sk.dk); ellipse(c, 23, -1, 28, 23, sk.base); ellipse(c, 18, -6, 14, 10, 'rgba(255,240,225,.6)');
  ellipse(c, 26, 0, 12, 12, 'rgba(200,40,50,.75)'); ellipse(c, 26, 0, 7, 7, 'rgba(240,200,190,.9)');   // the alta circle
  c.strokeStyle = 'rgba(140,70,50,.5)'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(8, 12); c.quadraticCurveTo(28, 8, 44, 14); c.stroke();
  // the thumb, out to the side
  ptForm(c, [[8, 18], [22, 30], [36, 36]], [17, 14, 11], sk, 0, -.8, .45);
  ellipse(c, 34, 36, 4, 4, '#C0303A');
  c.restore();
}
// a lotus-holding fist (the lotus is drawn over it), knuckles toward us
function dhFist(c, x, y, s) {
  ellipse(c, x, y + 2, 27, 25, DH_SKIN.dk); ellipse(c, x, y, 25, 23, DH_SKIN.base);
  for (let k = 0; k < 4; k++) { const yy = y - 12 + k * 8.5; ellipse(c, x - s * 8, yy, 16, 5, 'rgba(255,225,200,.5)'); c.strokeStyle = 'rgba(120,60,40,.55)'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(x - s * 22, yy + 4); c.lineTo(x + s * 6, yy + 4); c.stroke(); }
  ptForm(c, [[x + s * 14, y + 14], [x + s * 4, y - 2], [x - s * 6, y - 8]], [14, 12, 10], DH_SKIN, 0, -1, .4);   // the thumb across
  ellipse(c, x - s * 8, y - 10, 3.5, 3, '#C0303A');
}
function dhBangles(c, P, s = 1) {   // a stack of bangles at the wrist: red glass and gold
  const [x, y] = P;
  for (let k = 0; k < 5; k++) { const yy = y + k * 7 * s; ellipse(c, x, yy, 28, 9, k % 2 ? '#B0182C' : DH_GOLD.dk); ellipse(c, x, yy - 2, 27, 7, k % 2 ? '#E2384A' : DH_GOLD.mid); }
}

function dhLakshmi(eyes = 1) {
  return (c) => {
    c.translate(0, DH_DY);
    const R = lcg(51), X = DH_X, sk = DH_SKIN, red = DH_RED;
    // ---- hair behind: long, black, falling behind the shoulders
    for (const s of [-1, 1]) {
      ptShape(c, `M ${X + s * 60} 930 C ${X + s * 120} 960 ${X + s * 140} 1080 ${X + s * 170} 1180 C ${X + s * 190} 1260 ${X + s * 200} 1330 ${X + s * 170} 1360 L ${X + s * 110} 1300 C ${X + s * 100} 1200 ${X + s * 80} 1100 ${X + s * 40} 1040 Z`, ptLin(c, X, 0, X + s * 190, 0, [[0, '#120A08'], [.6, '#24160F'], [1, '#0C0605']]));
      for (let k = 0; k < 4; k++) { c.save(); c.globalAlpha = .35; limb(c, [[X + s * (70 + k * 8), 950], [X + s * (120 + k * 10), 1100], [X + s * (150 + k * 8), 1300]], [3, 2.5, 1.5], '#5A3E30'); c.restore(); }
    }
    ellipse(c, X, 950, 112, 108, '#140C09');
    // ---- the upper arms, behind her: from behind the shoulders out to the elbow and up to the lotus
    for (const s of [-1, 1]) {
      const sh = [X + s * 150, 1200], el = [X + s * 302, 1238], wr = [X + s * 292, 1098];
      ptForm(c, [sh, [X + s * 240, 1236], el], [64, 58, 50], sk, -s * .2, -.9, .45);
      ptForm(c, [el, [X + s * 302, 1170], wr], [50, 44, 38], sk, -s * .4, -.6, .5);
      dhBand(c, [[X + s * 250, 1206], [X + s * 262, 1238], [X + s * 254, 1268]], 12);   // an armlet
      dhBangles(c, [X + s * 292, 1100], -1);
      dhFist(c, X + s * 290, 1068, s);
      limb(c, [[X + s * 290, 1060], [X + s * 292, 1020]], [8, 8], '#4E7A2E');   // the lotus stem
      dhLotus(c, X + s * 292, 990, 66, s * .12);
    }
    // ---- the lotus seat is in the set; her lap: padmasana under a red saree with a gold border
    const lap = `M ${X - 150} 1380 C ${X - 260} 1400 ${X - 360} 1450 ${X - 384} 1530 C ${X - 396} 1600 ${X - 320} 1650 ${X - 200} 1652
                 L ${X + 200} 1652 C ${X + 320} 1650 ${X + 396} 1600 ${X + 384} 1530 C ${X + 360} 1450 ${X + 260} 1400 ${X + 150} 1380 Z`;
    ptShape(c, lap, ptLin(c, 0, 1380, 0, 1652, [[0, red.lt], [.45, red.base], [1, red.dk]]));
    inside(c, lap, () => {
      for (const s of [-1, 1]) { ellipse(c, X + s * 260, 1500, 110, 60, 'rgba(255,150,150,.3)', s * -.2); ellipse(c, X + s * 200, 1600, 120, 30, 'rgba(70,6,20,.35)'); }
      for (let i = 0; i < 9; i++) { const x = X - 240 + i * 60; limb(c, [[x, 1420], [x + (x - X) * .2, 1530], [x + (x - X) * .35, 1650]], [5, 7, 4], 'rgba(90,8,24,.35)'); }   // folds fanning from the waist
      for (let i = 0; i < 40; i++) { const x = X - 340 + R() * 680, y = 1420 + R() * 200; ellipse(c, x, y, 4, 4, 'rgba(255,214,120,.8)'); }       // gold butis
      dhBand(c, [[X - 392, 1590], [X - 300, 1640], [X, 1650], [X + 300, 1640], [X + 392, 1590]], 26);                                      // the border at the hem
      for (let i = 0; i < 18; i++) ellipse(c, X - 340 + i * 40, 1640 - Math.abs(i - 8.5) * 2.4 + (i % 2) * 2, 5, 5, '#B0182C');
    });
    // the pleats falling in front, from the waist
    const pleat = `M ${X - 60} 1400 L ${X + 60} 1400 L ${X + 90} 1655 L ${X - 90} 1655 Z`;
    ptShape(c, pleat, ptLin(c, X - 90, 0, X + 90, 0, [[0, red.dk], [.3, red.base], [.5, red.lt], [.7, red.base], [1, red.dk]]));
    for (let k = -2; k <= 2; k++) limb(c, [[X + k * 22, 1404], [X + k * 34, 1650]], [3, 4], 'rgba(80,6,20,.45)');
    dhBand(c, [[X - 92, 1640], [X, 1648], [X + 92, 1640]], 18);
    // ---- the torso: skin, then the choli
    const torso = `M ${X - 44} 1130 C ${X - 92} 1150 ${X - 160} 1158 ${X - 192} 1190 C ${X - 216} 1240 ${X - 206} 1320 ${X - 170} 1400 L ${X + 170} 1400 C ${X + 206} 1320 ${X + 216} 1240 ${X + 192} 1190 C ${X + 160} 1158 ${X + 92} 1150 ${X + 44} 1130 Z`;
    ptShape(c, torso, ptRad(c, X, 1210, 10, 260, [[0, sk.lt], [.55, sk.base], [1, sk.dk]], X, 1260));
    inside(c, torso, () => { ellipse(c, X, 1365, 26, 6, 'rgba(140,70,40,.35)'); ellipse(c, X, 1372, 5, 4, 'rgba(120,60,30,.6)'); });
    const choli = `M ${X - 196} 1214 C ${X - 130} 1196 ${X - 64} 1236 ${X} 1252 C ${X + 64} 1236 ${X + 130} 1196 ${X + 196} 1214 L ${X + 190} 1336 C ${X + 100} 1346 ${X - 100} 1346 ${X - 190} 1336 Z`;
    ptShape(c, choli, ptLin(c, 0, 1200, 0, 1346, [[0, red.lt], [.5, red.base], [1, red.dk]]));
    inside(c, choli, () => { for (const s of [-1, 1]) ellipse(c, X + s * 70, 1272, 70, 40, 'rgba(255,170,170,.3)'); ellipse(c, X, 1290, 6, 40, 'rgba(70,6,20,.4)'); });
    dhBand(c, [[X - 194, 1216], [X - 130, 1200], [X - 64, 1238], [X, 1254], [X + 64, 1238], [X + 130, 1200], [X + 194, 1216]], 12);
    dhBand(c, [[X - 190, 1334], [X, 1346], [X + 190, 1334]], 12);
    // ---- the pallu: from her left shoulder (screen right) across her body to her right hip, a gold border on its edge
    const pallu = `M ${X + 120} 1176 C ${X + 170} 1170 ${X + 204} 1196 ${X + 206} 1240 C ${X + 110} 1330 ${X - 30} 1400 ${X - 176} 1440 L ${X - 190} 1356 C ${X - 80} 1340 ${X + 40} 1270 ${X + 120} 1176 Z`;
    ptShape(c, pallu, ptLin(c, X + 200, 1170, X - 180, 1430, [[0, '#D8452C'], [.45, '#F06A3E'], [1, '#9A1E1A']]));
    inside(c, pallu, () => { for (let i = 0; i < 30; i++) ellipse(c, X - 170 + R() * 380, 1180 + R() * 260, 3.5, 3.5, 'rgba(255,214,120,.85)'); for (let k = 0; k < 4; k++) limb(c, [[X + 180 - k * 14, 1200 + k * 10], [X + 40 - k * 24, 1320 + k * 12], [X - 170, 1380 + k * 14]], [3, 5, 3], 'rgba(80,6,20,.28)'); });
    dhBand(c, [[X + 206, 1242], [X + 110, 1332], [X - 30, 1402], [X - 178, 1442]], 22);
    for (let k = 0; k < 7; k++) { const q = k / 6, x = lerp(X + 190, X - 160, q), y = lerp(1256, 1436, q) - Math.sin(q * Math.PI) * 6; ellipse(c, x, y, 4, 4, k % 2 ? '#1E8A5A' : '#B0182C'); }
    // ---- the lower arms: her right pours coins, her left holds the kalash
    for (const s of [-1, 1]) {
      const sh = [X + s * 182, 1222];
      ellipse(c, sh[0] + s * 4, sh[1] + 4, 46, 50, sk.dk); ellipse(c, sh[0], sh[1], 42, 46, sk.base); ellipse(c, sh[0] - s * 8, sh[1] - 14, 22, 18, 'rgba(255,236,215,.6)');
      // the sleeve: a short red cap with a gold edge
      ellipse(c, sh[0] + s * 4, sh[1] + 2, 44, 40, red.dk); ellipse(c, sh[0] + s * 2, sh[1] - 2, 40, 36, red.base); ellipse(c, sh[0] - s * 8, sh[1] - 14, 20, 14, 'rgba(255,150,150,.45)');
      dhBand(c, [[sh[0] - s * 30, sh[1] + 30], [sh[0] + s * 8, sh[1] + 40], [sh[0] + s * 42, sh[1] + 24]], 10);
    }
    { // her right (screen left): elbow out, the forearm down and out, the hand giving
      const sh = [X - 186, 1240], el = [X - 248, 1350], wr = [X - 300, 1432];
      ptForm(c, [sh, [X - 222, 1300], el], [64, 60, 52], sk, .3, -.9, .45);
      ptForm(c, [el, [X - 276, 1392], wr], [52, 46, 40], sk, .3, -.8, .5);
      dhBand(c, [[X - 238, 1270], [X - 214, 1286], [X - 194, 1292]], 12);
      dhVaradaHand(c, [wr[0] - 4, wr[1] + 12], Math.atan2(1, -.32), 1);
      c.save(); c.translate(wr[0], wr[1] - 4); c.rotate(-.35); dhBangles(c, [0, 0], 1); c.restore();
    }
    { // her left (screen right): the forearm down to the kalash on her palm
      const sh = [X + 186, 1240], el = [X + 250, 1356], wr = [X + 268, 1490];
      ptForm(c, [sh, [X + 224, 1300], el], [64, 60, 52], sk, -.3, -.9, .45);
      ptForm(c, [el, [X + 262, 1420], wr], [52, 46, 40], sk, -.3, -.8, .5);
      dhBand(c, [[X + 238, 1270], [X + 214, 1286], [X + 194, 1292]], 12);
      dhBangles(c, [X + 266, 1450], 1);
      // the palm under the kalash, fingers curling up its side
      ellipse(c, X + 300, 1552, 52, 20, sk.dk); ellipse(c, X + 300, 1548, 48, 17, sk.base);
      dhKalash(c, X + 304, 1478);
      for (let k = 0; k < 4; k++) { const fx = X + 250 + k * 9, fy = 1500 + k * 13; ptForm(c, [[fx - 8, fy + 30], [fx - 4, fy + 14], [fx + 6, fy + 2]], [13, 12, 10], sk, -.3, -1, .45); ellipse(c, fx + 6, fy + 2, 3.5, 3, '#C0303A'); }
      ptForm(c, [[X + 270, 1545], [X + 254, 1520], [X + 254, 1498]], [15, 13, 11], sk, -.3, -1, .45);
    }
    // ---- the neck
    const neck = `M ${X - 38} 1070 L ${X + 38} 1070 C ${X + 40} 1110 ${X + 56} 1130 ${X + 90} 1146 L ${X - 90} 1146 C ${X - 56} 1130 ${X - 40} 1110 ${X - 38} 1070 Z`;
    ptShape(c, neck, ptLin(c, 0, 1070, 0, 1146, [[0, sk.dk], [.45, sk.base], [1, sk.base]]));
    // ---- necklaces: a gem choker, a gold collar of beads, a long haar with a pendant
    dhBand(c, [[X - 42, 1108], [X, 1122], [X + 42, 1108]], 14);
    [-28, -10, 10, 28].forEach((dx, i) => dhGem(c, X + dx, 1118 + Math.abs(dx) * -.14, 4.5, i % 2 ? '#1E8A5A' : '#B0182C'));
    dhBeads(c, [[X - 74, 1146], [X - 50, 1186], [X, 1206], [X + 50, 1186], [X + 74, 1146]], 6, 10);
    for (let k = 0; k < 9; k++) { const x = X - 48 + k * 12, y = 1196 + Math.sin(k / 8 * Math.PI) * 12; limb(c, [[x, y], [x, y + 14]], [7, 4], DH_GOLD.base); ellipse(c, x, y + 16, 3.5, 4.5, '#B0182C'); }
    dhBeads(c, [[X - 96, 1150], [X - 90, 1240], [X - 40, 1300], [X, 1312], [X + 40, 1300], [X + 90, 1240], [X + 96, 1150]], 5, 11, ['#F4EEE2', '#FFFFFF', '#FFFFFF']);
    dhGem(c, X, 1322, 13, '#B0182C'); ellipse(c, X, 1344, 8, 10, DH_GOLD.base);
    // ---- the head (drawn bigger, grown up from the chin)
    c.save(); c.translate(X, DH_CHIN); c.scale(DH_HEAD, DH_HEAD); c.translate(-X, -DH_CHIN);
    // ears and the jhumkas
    for (const s of [-1, 1]) {
      ellipse(c, X + s * 71, 1012, 8, 15, sk.base); ellipse(c, X + s * 72, 1013, 4, 8, sk.dk);
      dhGem(c, X + s * 78, 1030, 6, '#B0182C');
      const jx = X + s * 80, jy = 1046;
      ptShape(c, `M ${jx - 6} ${jy} C ${jx - 20} ${jy + 12} ${jx - 22} ${jy + 30} ${jx - 20} ${jy + 40} L ${jx + 20} ${jy + 40} C ${jx + 22} ${jy + 30} ${jx + 20} ${jy + 12} ${jx + 6} ${jy} Z`, ptLin(c, jx - 22, 0, jx + 22, 0, [[0, DH_GOLD.dk], [.4, DH_GOLD.lt], [1, DH_GOLD.base]]));
      for (let k = 0; k < 5; k++) ellipse(c, jx - 16 + k * 8, jy + 46, 3.4, 3.8, '#FFFFFF');
      dhBand(c, [[jx - 22, jy + 40], [jx + 22, jy + 40]], 6);
    }
    // the face: an oval, a softly tapered chin, lit from the upper left
    const faceD = `M ${X - 68} 952 C ${X - 72} 1004 ${X - 64} 1044 ${X - 42} 1074 C ${X - 27} 1096 ${X - 12} 1107 ${X} 1108 C ${X + 12} 1107 ${X + 27} 1096 ${X + 42} 1074 C ${X + 64} 1044 ${X + 72} 1004 ${X + 68} 952 C ${X + 50} 908 ${X - 50} 908 ${X - 68} 952 Z`;
    ptShape(c, faceD, ptRad(c, X - 14, 990, 8, 118, [[0, '#FFE2C6'], [.45, '#F2C09A'], [.8, '#DDA07A'], [1, '#B47452']], X, 1006));
    inside(c, faceD, () => {
      ellipse(c, X + 62, 1020, 20, 70, 'rgba(150,80,50,.22)');               // the far side of the face, in shade
      ellipse(c, X - 64, 1020, 12, 60, 'rgba(150,80,50,.12)');
      for (const s of [-1, 1]) {
        ellipse(c, X + s * 36, 970, 30, 10, 'rgba(150,80,55,.16)');         // under the brow
        ellipse(c, X + s * 42, 1036, 17, 11, 'rgba(236,128,112,.17)');      // a little colour on the cheeks
        ellipse(c, X + s * 36, 1014, 22, 7, 'rgba(255,236,220,.22)');       // the lit top of the cheekbone
      }
      ellipse(c, X, 940, 40, 14, 'rgba(255,240,225,.3)');                    // the forehead, lit
      ellipse(c, X + 9, 1012, 5, 24, 'rgba(150,80,50,.16)');                 // the shaded side of the nose
      ellipse(c, X, 1056, 5, 5, 'rgba(150,80,50,.1)');                       // the philtrum
      ellipse(c, X, 1084, 13, 3.5, 'rgba(150,80,50,.28)');                   // under the lower lip
      ellipse(c, X - 2, 1093, 13, 7, 'rgba(255,236,215,.4)');                // the chin, lit
      ellipse(c, X, 1106, 30, 6, 'rgba(130,64,40,.28)');                     // under the chin
    });
    // the eyes: long fish-shaped (meenakshi) eyes, the upper lid resting on the iris, kajal sweeping up into a wing
    const eye = s => `M ${X + s * 13} 995 C ${X + s * 21} 983 ${X + s * 40} 976 ${X + s * 56} 983 C ${X + s * 61} 985 ${X + s * 64} 987 ${X + s * 68} 989 C ${X + s * 50} 999 ${X + s * 26} 1002 ${X + s * 13} 995 Z`;
    c.lineCap = 'round'; c.lineJoin = 'round';
    for (const s of [-1, 1]) {
      // the lid: a rose-gold tint between the crease and the lashes
      c.save(); c.globalAlpha = .38; ptShape(c, `M ${X + s * 12} 994 C ${X + s * 18} 966 ${X + s * 46} 960 ${X + s * 70} 984 C ${X + s * 50} 974 ${X + s * 24} 976 ${X + s * 12} 994 Z`, 'rgba(178,92,70,.6)'); c.restore();
      c.strokeStyle = 'rgba(120,56,38,.5)'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(X + s * 17, 976); c.bezierCurveTo(X + s * 28, 964, X + s * 50, 963, X + s * 62, 975); c.stroke();   // the crease
      if (eyes) {
        ptShape(c, eye(s), ptLin(c, X + s * 13, 0, X + s * 67, 0, [[0, '#E4CFC0'], [.25, '#F6ECE2'], [.75, '#F4E8DC'], [1, '#D8BBA8']]));
        inside(c, eye(s), () => {
          ellipse(c, X + s * 37, 991, 11, 11, '#24120A');                                     // the iris's dark rim: both lids cut it
          ellipse(c, X + s * 37, 991, 9.8, 9.8, ptRad(c, X + s * 37, 994, 2, 9.8, [[0, '#8A5426'], [.6, '#5A3216'], [1, '#3A1E0C']]));
          ellipse(c, X + s * 37, 991, 4.3, 4.3, '#0A0402');                                       // the pupil
          ellipse(c, X + s * 34, 987.5, 2.3, 2.1, '#FFFFFF'); ellipse(c, X + s * 39.5, 994.5, 1.1, 1, 'rgba(255,255,255,.7)');   // catchlights
          ellipse(c, X + s * 40, 978, 32, 6, 'rgba(70,30,20,.5)');                               // the upper lid's shadow across the eye
          ellipse(c, X + s * 15, 995, 4, 3, 'rgba(220,130,130,.6)');                             // the pink inner corner
        });
        // kajal: a heavy upper line that sweeps up into a wing, a softer line below meeting it at the outer corner
        limb(c, [[X + s * 12, 995], [X + s * 22, 983], [X + s * 40, 976], [X + s * 57, 983], [X + s * 69, 988], [X + s * 83, 979]], [2, 4.4, 5, 4.8, 3.4, .8], '#120806');
        limb(c, [[X + s * 15, 997.5], [X + s * 30, 1002.5], [X + s * 50, 999.5], [X + s * 67, 989]], [1, 2.4, 2.8, 1.6], 'rgba(22,10,8,.9)');
        for (let k = 0; k < 5; k++) { const q = .5 + k * .11, x = X + s * lerp(40, 66, q * 1.2 - .5), y = lerp(973, 986, (q - .5) * 2); c.beginPath(); c.moveTo(x, y - 2); c.lineTo(x + s * (3 + k), y - 6 - k * .6); c.stroke(); }
      } else {
        // shut: the lid down over the eye, the lashes curving down, the kajal wing still there
        ptShape(c, eye(s), 'rgba(196,118,92,.45)');
        limb(c, [[X + s * 12, 995], [X + s * 30, 1001], [X + s * 50, 999], [X + s * 66, 989], [X + s * 80, 980]], [2, 4, 4.4, 3.2, .8], '#120806');
        c.strokeStyle = '#120806'; c.lineWidth = 1.4; for (let k = 0; k < 5; k++) { const x = X + s * (24 + k * 8); c.beginPath(); c.moveTo(x, 1001); c.lineTo(x + s * 2, 1007); c.stroke(); }
      }
      // the brow: a long, fine, tapered arch
      limb(c, [[X + s * 15, 961], [X + s * 30, 951], [X + s * 48, 948], [X + s * 70, 957]], [2.6, 4, 3, .8], '#2A140C');
    }
    // the nose: a soft line down its shaded side, a rounded tip, the nostril wings
    limb(c, [[X + 10, 1000], [X + 10, 1016], [X + 12, 1030]], [.6, 1.6, 1.2], 'rgba(140,66,44,.28)');
    ellipse(c, X - 1, 1033, 7, 5, 'rgba(255,240,226,.55)');
    c.strokeStyle = 'rgba(112,48,32,.75)'; c.lineWidth = 2;
    for (const s of [-1, 1]) { c.beginPath(); c.moveTo(X + s * 14, 1033); c.bezierCurveTo(X + s * 17, 1042, X + s * 11, 1046, X + s * 6, 1043.5); c.stroke(); }
    c.lineWidth = 1.5; c.beginPath(); c.moveTo(X - 6, 1043.5); c.quadraticCurveTo(X, 1046.5, X + 6, 1043.5); c.stroke();
    ellipse(c, X - 7, 1042, 2.8, 1.6, '#5E2618'); ellipse(c, X + 7, 1042, 2.8, 1.6, '#5E2618');
    ellipse(c, X, 1050, 10, 3, 'rgba(150,80,50,.22)');
    // the lips: a full bow, a fuller lower lip, smiling: the corners lift and the lower lip curves up with them
    ptShape(c, `M ${X - 24} 1062 C ${X - 15} 1061 ${X - 10} 1058 ${X - 5} 1059 C ${X - 2} 1059 ${X - 1} 1061 ${X} 1061.5 C ${X + 1} 1061 ${X + 2} 1059 ${X + 5} 1059 C ${X + 10} 1058 ${X + 15} 1061 ${X + 24} 1062 C ${X + 12} 1067 ${X - 12} 1067 ${X - 24} 1062 Z`, ptLin(c, 0, 1058, 0, 1067, [[0, '#B4323E'], [1, '#8E1C2A']]));
    ptShape(c, `M ${X - 21} 1064 C ${X - 13} 1079 ${X + 13} 1079 ${X + 21} 1064 C ${X + 10} 1069.5 ${X - 10} 1069.5 ${X - 21} 1064 Z`, ptLin(c, 0, 1066, 0, 1079, [[0, '#B83442'], [.6, '#D0505C'], [1, '#B83E4A']]));
    ellipse(c, X + 1, 1073, 7, 2.2, 'rgba(255,214,210,.65)');
    ellipse(c, X - 7, 1061.5, 3, 1.2, 'rgba(255,214,210,.4)');
    c.strokeStyle = '#5A0E18'; c.lineWidth = 1.8; c.beginPath(); c.moveTo(X - 27, 1059.5); c.quadraticCurveTo(X - 22, 1064.5, X - 15, 1066.5); c.quadraticCurveTo(X, 1069.5, X + 15, 1066.5); c.quadraticCurveTo(X + 22, 1064.5, X + 27, 1059.5); c.stroke();   // the parting, its corners turned well up
    for (const s of [-1, 1]) {
      limb(c, [[X + s * 27, 1057], [X + s * 30, 1062], [X + s * 28, 1067]], [.6, 1.4, .6], 'rgba(140,60,45,.35)');   // the smile's crease at each corner
      ellipse(c, X + s * 38, 1040, 15, 10, 'rgba(255,226,206,.35)');                                                 // the cheeks lifted by the smile
      ellipse(c, X + s * 38, 1047, 14, 4, 'rgba(160,84,60,.12)');
    }
    c.strokeStyle = DH_GOLD.base; c.lineWidth = 3; c.beginPath(); c.arc(X + 12, 1052, 12, -1.9, 1.3); c.stroke();   // the nath, through her left nostril
    dhGem(c, X + 23, 1058, 3, '#B0182C');
    dhBeads(c, [[X + 22, 1046], [X + 50, 1030], [X + 76, 1010]], 2.4, 6, ['#F4EEE2', '#FFFFFF', '#FFFFFF']);   // its chain of pearls to the ear
    // the hair over the forehead, parted in the middle, a line of sindoor in the parting
    ptShape(c, `M ${X - 80} 990 C ${X - 84} 930 ${X - 50} 900 ${X} 896 C ${X + 50} 900 ${X + 84} 930 ${X + 80} 990 C ${X + 70} 950 ${X + 40} 926 ${X + 2} 930 L ${X - 2} 930 C ${X - 40} 926 ${X - 70} 950 ${X - 80} 990 Z`, '#170D0A');
    for (const s of [-1, 1]) { c.save(); c.globalAlpha = .4; limb(c, [[X + s * 4, 904], [X + s * 44, 916], [X + s * 74, 962]], [3, 2.4, 1.4], '#5A3E30'); c.restore(); }
    // bindi, and the maang tikka hanging from the crown into the parting
    dhGem(c, X, 954, 6, '#C41E32'); ellipse(c, X, 943, 2.4, 2.4, DH_GOLD.lt);
    limb(c, [[X, 900], [X, 924]], [2.5, 2.5], DH_GOLD.base); dhGem(c, X, 928, 7, '#1E8A5A'); for (const dx of [-5, 0, 5]) ellipse(c, X + dx, 938 + (dx ? -2 : 0), 2.2, 2.6, '#FFFFFF');
    // ---- the kirita mukut: a tall gold crown in tiers, set with rubies and emeralds, a lotus bud on top
    // the spire: tiers narrowing to a point, each tier a row of gold scallops with a gem (squashed a little: it stays clear of the greeting)
    c.save(); c.translate(X, 880); c.scale(1, .8); c.translate(-X, -880);
    const spire = `M ${X - 62} 880 C ${X - 64} 830 ${X - 46} 780 ${X - 30} 740 L ${X - 14} 700 C ${X - 6} 688 ${X + 6} 688 ${X + 14} 700 L ${X + 30} 740 C ${X + 46} 780 ${X + 64} 830 ${X + 62} 880 Z`;
    ptShape(c, spire, ptLin(c, X - 64, 0, X + 64, 0, [[0, DH_GOLD.dk], [.3, DH_GOLD.mid], [.46, DH_GOLD.lt], [.7, DH_GOLD.base], [1, DH_GOLD.dk]]));
    inside(c, spire, () => {
      for (const [y, w, n] of [[852, 66, 9], [810, 54, 7], [770, 42, 6], [734, 30, 4]]) {
        c.strokeStyle = 'rgba(110,64,14,.75)'; c.lineWidth = 3; c.beginPath(); c.moveTo(X - w, y + 16); c.quadraticCurveTo(X, y + 24, X + w, y + 16); c.stroke();
        for (let k = 0; k < n; k++) { const x = X - w + (k + .5) * 2 * w / n; c.beginPath(); c.arc(x, y + 14, w / n, Math.PI, TAU); c.stroke(); ellipse(c, x, y + 8, 2.6, 2.6, '#FFF6DA'); }
      }
    });
    dhGem(c, X, 832, 10, '#1E8A5A'); dhGem(c, X, 790, 7, '#B0182C'); dhGem(c, X, 754, 5, '#1E8A5A');
    ptShape(c, `M ${X} 650 C ${X + 14} 666 ${X + 18} 684 ${X + 10} 698 L ${X - 10} 698 C ${X - 18} 684 ${X - 14} 666 ${X} 650 Z`, ptLin(c, X - 16, 0, X + 16, 0, [[0, DH_GOLD.dk], [.5, DH_GOLD.lt], [1, DH_GOLD.base]]));
    dhGem(c, X, 682, 4.5, '#B0182C');
    c.restore();
    // the coronet: seven pointed gold petals standing round the brow, each set with a stone, the middle one tallest
    for (let k = -3; k <= 3; k++) {
      const x = X + k * 25, h = 74 - Math.abs(k) * 9, a = k * .1;
      c.save(); c.translate(x, 910); c.rotate(a);
      const leaf = `M -15 0 C -20 ${-h * .45} -8 ${-h * .8} 0 ${-h} C 8 ${-h * .8} 20 ${-h * .45} 15 0 Z`;
      ptShape(c, leaf, ptLin(c, -16, 0, 16, 0, [[0, DH_GOLD.dk], [.4, DH_GOLD.lt], [1, DH_GOLD.base]]));
      c.strokeStyle = DH_GOLD.dk; c.lineWidth = 2; c.stroke(new Path2D(leaf));
      dhGem(c, 0, -h * .42, k ? 5 : 8, k % 2 ? '#1E8A5A' : '#B0182C'); ellipse(c, 0, -h * .82, 2.4, 2.4, '#FFF6DA');
      c.restore();
    }
    dhBand(c, [[X - 88, 904], [X, 914], [X + 88, 904]], 20);
    for (let k = -3; k <= 3; k++) dhGem(c, X + k * 25, 908 + Math.abs(k) * -.6, k % 2 ? 4.5 : 5.5, k % 2 ? '#1E8A5A' : '#B0182C');
    for (let k = -8; k <= 8; k++) ellipse(c, X + k * 10.5, 920 - Math.abs(k) * .5, 2.4, 2.8, '#FFFFFF');   // a fringe of pearls on the brow
    c.restore();
    // ---- grade: warm light from above, the halo's gold behind; a little rose from the lotuses below
    c.save(); c.globalCompositeOperation = 'source-atop';
    c.fillStyle = ptLin(c, 0, 660, 0, 1660, [[0, 'rgba(255,236,170,.16)'], [.5, 'rgba(255,236,170,0)'], [1, 'rgba(120,20,50,.14)']]); c.fillRect(0, 660, PT_W, 1000);
    c.restore();
    ptMottle(c, X - 400, 1140, X + 400, 1650, 200, ['#D02A40', '#A81830', '#E0485A', '#B82034'], R, 6, 22, .12);
  };
}

// the gold kalash she holds: a round pot, a lotus-petal collar, coins heaped in its mouth
function dhKalash(c, x, y) {
  const body = `M ${x - 30} ${y - 70} C ${x - 80} ${y - 50} ${x - 84} ${y + 30} ${x - 50} ${y + 62} C ${x - 20} ${y + 80} ${x + 20} ${y + 80} ${x + 50} ${y + 62} C ${x + 84} ${y + 30} ${x + 80} ${y - 50} ${x + 30} ${y - 70} Z`;
  ptShape(c, body, ptRad(c, x - 26, y - 16, 6, 100, [[0, DH_GOLD.lt], [.45, DH_GOLD.mid], [1, DH_GOLD.dk]]));
  inside(c, body, () => { dhBand(c, [[x - 80, y + 4], [x, y + 18], [x + 80, y + 4]], 10); for (let k = -3; k <= 3; k++) ellipse(c, x + k * 20, y + 12 + Math.abs(k) * -1.6, 4, 4, k % 2 ? '#1E8A5A' : '#B0182C'); ellipse(c, x + 40, y - 20, 14, 40, 'rgba(110,64,14,.35)'); });
  ptShape(c, `M ${x - 34} ${y - 68} L ${x + 34} ${y - 68} L ${x + 26} ${y - 88} L ${x - 26} ${y - 88} Z`, DH_GOLD.base);
  ellipse(c, x, y - 92, 44, 12, DH_GOLD.dk); ellipse(c, x, y - 94, 40, 10, DH_GOLD.mid);
  ellipse(c, x, y - 96, 32, 7, '#5A3610');
  for (const [dx, dy] of [[-18, -100], [0, -104], [16, -100], [-8, -108], [10, -110], [26, -98], [-26, -98], [2, -116]]) dhCoin(c, x + dx, y + dy, 9, .45);
}

// ---------- in front of her (design) ----------
function dhFront(c) {
  const R = lcg(61), sy = 1640 + DH_DY;
  // the lotus seat's front petals, curling up over the hem of her saree
  for (let i = 0; i < 8; i++) { const a = -1.2 + i / 7 * 2.4; dhPetalAt(c, DH_X + Math.sin(a) * 300, sy + 150 - Math.cos(a) * 30, a * .55, 150, 50, { base: '#FFF4F7', mid: '#F4A2BC', tip: '#DE5A88' }); }
  for (let i = 0; i < 7; i++) { const a = -1.05 + i / 6 * 2.1; dhPetalAt(c, DH_X + Math.sin(a) * 240, sy + 196, a * .45, 120, 46); }
  // two lotus leaves either side
  for (const s of [-1, 1]) { ellipse(c, DH_X + s * 360, 1880, 150, 44, '#2E6B3A', s * .08); ellipse(c, DH_X + s * 350, 1874, 130, 34, '#4C8F4E', s * .08); limb(c, [[DH_X + s * 240, 1874], [DH_X + s * 470, 1880]], [3, 1], 'rgba(20,60,30,.6)'); }
  // the brass pot under her giving hand, heaped with coins
  const [px, py] = DH_POT;
  ellipse(c, px, py + 190, 120, 20, 'rgba(80,40,10,.4)');
  const pot = `M ${px - 64} ${py + 6} C ${px - 140} ${py + 30} ${px - 140} ${py + 150} ${px - 70} ${py + 182} C ${px - 30} ${py + 196} ${px + 30} ${py + 196} ${px + 70} ${py + 182} C ${px + 140} ${py + 150} ${px + 140} ${py + 30} ${px + 64} ${py + 6} Z`;
  ptShape(c, pot, ptRad(c, px - 40, py + 60, 10, 170, [[0, '#FFE6A0'], [.35, '#E3A93E'], [.8, '#94601A'], [1, '#5A3608']]));
  inside(c, pot, () => { dhBand(c, [[px - 140, py + 80], [px, py + 96], [px + 140, py + 80]], 12); ellipse(c, px + 70, py + 100, 22, 60, 'rgba(70,40,8,.35)'); ellipse(c, px - 60, py + 60, 18, 30, 'rgba(255,250,220,.4)'); });
  ellipse(c, px, py + 6, 76, 18, '#94601A'); ellipse(c, px, py + 2, 72, 15, '#E3A93E'); ellipse(c, px, py + 2, 62, 11, '#5A3610');
  for (let i = 0; i < 22; i++) { const a = R() * TAU, d = R(); dhCoin(c, px + Math.cos(a) * 56 * d, py - 4 - (1 - d) * 22 + Math.sin(a) * 8 * d, 10, .45); }
  for (let i = 0; i < 7; i++) dhCoin(c, px - 140 + R() * 300, py + 186 + R() * 20, 11, .4);   // coins spilt on the ground
  // a brass lamp stand at the right, its wick lit in the scene
  const [lx, ly] = DH_LAMP;
  ellipse(c, lx, 1900, 90, 18, 'rgba(80,40,10,.4)');
  ptShape(c, `M ${lx - 70} 1896 C ${lx - 60} 1860 ${lx - 30} 1850 ${lx - 12} 1840 L ${lx + 12} 1840 C ${lx + 30} 1850 ${lx + 60} 1860 ${lx + 70} 1896 Z`, ptLin(c, lx - 70, 0, lx + 70, 0, [[0, '#7A4A10'], [.4, '#F2C25A'], [1, '#6A3E0C']]));
  limb(c, [[lx, 1844], [lx, 1700], [lx, ly + 40]], [20, 16, 14], ptLin(c, lx - 10, 0, lx + 10, 0, [[0, '#7A4A10'], [.4, '#FFE6A0'], [1, '#6A3E0C']]), false);
  for (const y of [1760, 1700, 1660]) { ellipse(c, lx, y, 22, 9, '#8A5A16'); ellipse(c, lx, y - 2, 20, 7, '#F2C25A'); }
  ptShape(c, `M ${lx - 56} ${ly + 8} C ${lx - 50} ${ly + 36} ${lx + 50} ${ly + 36} ${lx + 56} ${ly + 8} Z`, ptLin(c, 0, ly, 0, ly + 34, [[0, '#FFE6A0'], [1, '#7A4A10']]));
  ellipse(c, lx, ly + 8, 56, 10, '#B37A22'); ellipse(c, lx, ly + 7, 48, 7, '#4A2A08');
  // clay diyas along the front
  for (const [dx, dy] of DH_FLAMES.slice(1)) {
    ellipse(c, dx, dy + 34, 58, 10, 'rgba(70,30,10,.4)');
    ptShape(c, `M ${dx - 50} ${dy + 6} C ${dx - 44} ${dy + 34} ${dx + 44} ${dy + 34} ${dx + 50} ${dy + 6} C ${dx + 30} ${dy + 14} ${dx - 30} ${dy + 14} ${dx - 50} ${dy + 6} Z`, ptLin(c, 0, dy, 0, dy + 32, [[0, '#D4733A'], [1, '#7A3414']]));
    ellipse(c, dx, dy + 7, 50, 9, '#9A4A22'); ellipse(c, dx, dy + 7, 42, 6, '#5A2810');
    limb(c, [[dx - 40, dy + 18], [dx, dy + 24], [dx + 40, dy + 18]], [3, 3, 3], 'rgba(255,220,150,.6)');
  }
}

// ---------- the marigold strings and bells (design, one pose per swing phase) ----------
// Each string hangs from the top edge and swings like a pendulum, the lower end a little behind the top.
const DH_STRINGS = [[46, 0, 13, 0], [124, 0, 10, 1.4], [956, 0, 10, 3.1], [1034, 0, 13, 4.3]];   // x, y, flowers, phase
const DH_GAR_BOX = [0, -20, PT_W, 760];
const dhStringPts = (ph, [x, y, n, p]) => Array.from({ length: n + 1 }, (_, i) => { const d = i * 44, a = .07 * Math.sin(ph * TAU + p - i * .05) + .015 * Math.sin(ph * TAU * 2 + p); return [x + Math.sin(a) * d, y + Math.cos(a) * d]; });
const DH_BELLS = ph => DH_STRINGS.map(s => { const P = dhStringPts(ph, s); return [P[P.length - 1][0], P[P.length - 1][1] + 44]; });
function dhGarlands(ph) {
  return (c) => {
    DH_STRINGS.forEach((s, j) => {
      const P = dhStringPts(ph, s), R = lcg(80 + j), [bx, by] = P[P.length - 1];
      limb(c, P, P.map(() => 2.5), '#5A3A1A', false);
      P.slice(0, -1).forEach(([x, y], i) => {
        if (i === 0) return;
        const yel = (i + j) % 3 === 0, r = 24 + R() * 3;
        ellipse(c, x, y + 2, r, r * .92, yel ? '#C9820E' : '#B84A0A');
        for (let k = 0; k < 14; k++) { const a = k / 14 * TAU + R() * .3; ellipse(c, x + Math.cos(a) * r * .66, y + Math.sin(a) * r * .6, r * .36, r * .3, yel ? (k % 2 ? '#FFC21E' : '#F6A80E') : (k % 2 ? '#F8862A' : '#EE6A14'), a); }
        ellipse(c, x, y, r * .42, r * .38, yel ? '#FFD84A' : '#FF9A34'); ellipse(c, x - 5, y - 6, r * .3, r * .2, 'rgba(255,240,200,.5)');
        if (i % 3 === 0) { ellipse(c, x + 18, y + 22, 13, 5, '#3E7A2A', .8); ellipse(c, x - 18, y + 22, 13, 5, '#3E7A2A', -.8); }
      });
      // a red bead, then the brass bell, its clapper showing under the lip
      ellipse(c, bx, by + 2, 9, 9, '#B0182C');
      const gx = bx, gy = by + 14;
      ellipse(c, gx, gy, 8, 6, '#8A5A16');
      ptShape(c, `M ${gx - 14} ${gy + 4} C ${gx - 18} ${gy + 26} ${gx - 24} ${gy + 44} ${gx - 34} ${gy + 54} L ${gx + 34} ${gy + 54} C ${gx + 24} ${gy + 44} ${gx + 18} ${gy + 26} ${gx + 14} ${gy + 4} Z`, ptLin(c, gx - 34, 0, gx + 34, 0, [[0, '#7A4A10'], [.35, '#FFE6A0'], [.6, '#E3A93E'], [1, '#6A3E0C']]));
      ellipse(c, gx, gy + 54, 34, 7, '#94601A'); ellipse(c, gx, gy + 56, 28, 4, '#3A2206');
      ellipse(c, gx + Math.sin(ph * TAU + s[3] - .8) * 6, gy + 62, 6, 6, '#B37A22');
    });
  };
}
