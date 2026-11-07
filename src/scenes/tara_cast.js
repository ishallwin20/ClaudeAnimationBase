// tara_cast.js: the designs for "Maa Tara and Shiva" (Painterly; STORYBOARD.md). Night sets and the Devi rig.
//   trRiver(c)        the riverbank at night (Tarapith): moon, the far bank with a chala temple, the river, the ghat,
//                     a jaba bush, an old tree with threads tied on it, the stone seat with a tiger skin, clay lamps
//   trSea(c)          the churning of the ocean: Mandara in the storm, Vasuki round it, the sea boiling at its foot
//   trShore(c)        a rock ledge over the night sea (Shiva sits on it; svShiva from src/pt_shiva.js)
//   trBody(o)         the Devi seated (no head): o.tara (blue-black, four arms: khadga and blue lotus, tiger skin, loose
//                     hair, jaba garland) or Parvati (warm, two arms, red saree). Stage px; the face is at TR_FACE.
//   trHead(o)         her head: o.tara, o.eyes 'front' | 'down' | 'shut', o.tear, o.mouth 'smile' | 'soft' | 'sad'
//   trFront(o)        her lower arms cradling and the pallu over the child (o.tara; Parvati has no front layer)
//   trBaby(face)      baby Shiva wrapped in the pallu, his face 'pain' | 'calm'
//   trDevotees(c)     three devotees seen from behind on the ghat: a mother with her baby, a boy, an old sevak
// Positions: TR_FACE (her face), TR_THIRD, TR_BABY (his face), TR_THROAT (his throat), TR_HEART (where the light
// flows from), TR_MOON, TR_LAMPS.
const TR_X = 540, TR_DY = 100, TR_HS = 1.15;                        // the figure is drawn in dhLakshmi's frame, moved down TR_DY
const trHd = (x, y) => [TR_X + (x - TR_X) * TR_HS, 1100 + TR_DY + (y - 1100) * TR_HS];   // a head point → stage px
const TR_FACE = trHd(540, 1000), TR_THIRD = trHd(540, 950);
const TR_MOON = [812, 380];
const TR_BABY = [TR_X + 72, 1236 + TR_DY], TR_THROAT = [TR_X + 74, 1282 + TR_DY], TR_HEART = [TR_X + 40, 1250 + TR_DY];
const TR_LAMPS = [[118, 1838], [262, 1866], [818, 1866], [962, 1838], [404, 1880], [676, 1880]];
const TR_BLUE = { base: '#3D5AA6', dk: '#1A2758', lt: '#7896D6', face: [[0, '#88A4E0'], [.45, '#5470B8'], [.8, '#3A5296'], [1, '#22336E']], sh: '14,22,64', hl: '200,220,255' };
const TR_WARM = { base: '#E8B088', dk: '#A86A48', lt: '#FCD8B6', face: [[0, '#FFE2C6'], [.45, '#F2C09A'], [.8, '#DDA07A'], [1, '#B47452']], sh: '150,80,50', hl: '255,236,220' };
const TR_CRIM = { base: '#8E1426', dk: '#4A0612', lt: '#C2304A' };
const TR_TIGER = { base: '#D98A2B', dk: '#97521A', lt: '#F2B85A' };
const TR_BODY_BOX = [90, 620, 900, 1200];
const TR_HEAD_BOX = [TR_X - 260, 600, 520, 680];
const TR_BABY_BOX = [TR_X - 120, 1150 + TR_DY, 280, 240];

// ---------- small parts ----------
function trJaba(c, x, y, r, rot = 0) {   // a red hibiscus seen from the front: five broad petals, the long stamen
  c.save(); c.translate(x, y); c.rotate(rot);
  for (let i = 0; i < 5; i++) {
    c.save(); c.rotate(i / 5 * TAU);
    ptShape(c, `M 0 0 C ${r * .5} ${-r * .2} ${r * .7} ${-r * .8} ${r * .25} ${-r * 1.02} C 0 ${-r * 1.1} ${-r * .3} ${-r * 1.05} ${-r * .5} ${-r * .85} C ${-r * .7} ${-r * .5} ${-r * .4} ${-r * .15} 0 0 Z`,
      ptLin(c, 0, 0, 0, -r, [[0, '#6A0410'], [.35, '#C0101E'], [1, '#E83A3A']]));
    c.restore();
  }
  ellipse(c, 0, 0, r * .18, r * .18, '#4A020A');
  limb(c, [[0, 0], [r * .35, -r * .5], [r * .55, -r * 1.1]], [r * .07, r * .06, r * .05], '#E8C040', false);
  ellipse(c, r * .55, -r * 1.12, r * .1, r * .1, '#FFE070');
  c.restore();
}
function trLeaf(c, x, y, l, w, a, col) { c.save(); c.translate(x, y); c.rotate(a); ptShape(c, `M 0 0 C ${w} ${-l * .3} ${w * .6} ${-l * .8} 0 ${-l} C ${-w * .6} ${-l * .8} ${-w} ${-l * .3} 0 0 Z`, col); c.restore(); }
function trDiya(c, x, y) {   // a clay lamp on the step
  ellipse(c, x, y + 10, 46, 12, 'rgba(0,0,0,.5)');
  ptShape(c, `M ${x - 40} ${y - 4} C ${x - 36} ${y + 14} ${x + 30} ${y + 16} ${x + 40} ${y - 4} C ${x + 52} ${y - 8} ${x + 54} ${y - 14} ${x + 44} ${y - 12} C ${x + 10} ${y - 4} ${x - 26} ${y - 6} ${x - 40} ${y - 4} Z`, ptLin(c, 0, y - 12, 0, y + 16, [[0, '#C8783A'], [1, '#5A2A10']]));
  ellipse(c, x, y - 6, 38, 7, '#3A1A08'); ellipse(c, x, y - 7, 32, 5, '#B8862A');
}

function trLock(c, P, w, R) {   // a lock of loose hair: blue-black, a few cold-lit strands
  limb(c, P, [w, w * .8, w * .45, 3], '#08060C');
  for (let k = 0; k < 3; k++) { const o = (R() - .5) * w * .5; c.save(); c.globalAlpha = .3 + R() * .25; limb(c, P.map(([x, y], i) => [x + o * (1 - i / P.length), y]), [3, 2.4, 1.6, 1], ['#262A44', '#3A4064', '#1C1E30'][k]); c.restore(); }
}

// ---------- the riverbank (design) ----------
function trRiver(c, o = {}) {
  const R = lcg(81);
  c.fillStyle = ptLin(c, 0, 0, 0, 1130, [[0, '#040716'], [.45, '#0A1434'], [.8, '#172A56'], [1, '#22396A']]); c.fillRect(0, 0, PT_W, 1130);
  ptMottle(c, 0, 0, PT_W, 1080, 220, ['#0E1A44', '#13244E', '#08102C', '#1C2C5C'], R, 40, 140, .22);
  c.fillStyle = ptRad(c, ...TR_MOON, 10, 560, [[0, 'rgba(190,206,255,.42)'], [.4, 'rgba(150,170,235,.14)'], [1, 'rgba(150,170,235,0)']]); c.fillRect(0, 0, PT_W, 1130);
  ellipse(c, ...TR_MOON, 54, 54, ptRad(c, TR_MOON[0] - 14, TR_MOON[1] - 14, 4, 60, [[0, '#FFFDF2'], [.7, '#F2EED8'], [1, '#D8D6C8']]));
  for (const [dx, dy, r] of [[-14, 10, 12], [16, -12, 9], [6, 20, 7], [-22, -16, 6]]) ellipse(c, TR_MOON[0] + dx, TR_MOON[1] + dy, r, r * .8, 'rgba(170,170,160,.35)');
  // the far bank: a line of trees, and a little chala-roofed temple with a lamp in its door
  const fb = [[-20, 1060]]; for (let x = 0; x <= 1100; x += 40) fb.push([x, 1050 - Math.abs(vnoise(x * .01, 4)) * 70 - (x < 380 && x > 140 ? 20 : 0)]);
  for (const [x, y] of fb) ellipse(c, x, y, 34 + R() * 20, 30 + R() * 16, ['#08121E', '#0A1622', '#0C1826'][R() * 3 | 0]);
  poly(c, [...fb, [1100, 1100], [-20, 1100]], '#08121E');
  const tx = 250, ty = 1060;
  poly(c, [[tx - 60, ty], [tx - 60, ty - 56], [tx + 60, ty - 56], [tx + 60, ty]], '#0E1626');
  ptShape(c, `M ${tx - 74} ${ty - 50} C ${tx - 50} ${ty - 110} ${tx + 50} ${ty - 110} ${tx + 74} ${ty - 50} C ${tx + 40} ${ty - 64} ${tx - 40} ${ty - 64} ${tx - 74} ${ty - 50} Z`, '#101A2C');
  limb(c, [[tx, ty - 98], [tx, ty - 132]], [5, 2], '#101A2C'); ellipse(c, tx, ty - 120, 6, 6, '#101A2C');
  ellipse(c, tx, ty - 22, 12, 18, '#E8A040'); ellipse(c, tx, ty - 22, 8, 12, '#FFE0A0');
  // the river: dark and wide, the moon's road laid on it, lit streaks
  ptShape(c, `M 0 1080 L 1080 1080 L 1080 1440 C 800 1420 300 1426 0 1450 Z`, ptLin(c, 0, 1080, 0, 1440, [[0, '#1C3058'], [.3, '#12224A'], [1, '#081430']]));
  for (let i = 0; i < 40; i++) { const y = 1090 + Math.pow(R(), 1.4) * 340, x = R() * 1080, l = 40 + R() * 160; limb(c, [[x, y], [x + l, y + (R() - .5) * 3]], [1.5, 2.5], `rgba(120,150,210,${.08 + R() * .14})`, false); }
  for (let i = 0; i < 26; i++) { const y = 1086 + i * 13, w = 18 + i * 3.4 + R() * 20; ellipse(c, TR_MOON[0] + (R() - .5) * 30, y, w, 3 + i * .12, `rgba(230,236,255,${.35 - i * .01})`); }
  // the near bank: earth and the ghat's stone steps, lit warm by the lamps
  ptShape(c, `M 0 1430 C 300 1404 800 1398 1080 1420 L 1080 1920 L 0 1920 Z`, ptLin(c, 0, 1400, 0, 1920, [[0, '#2A2220'], [.3, '#1C1716'], [1, '#0A0808']]));
  for (const [y, a] of [[1520, .3], [1610, .35], [1700, .4], [1790, .45]]) {
    limb(c, [[0, y + 6], [540, y - 4], [1080, y + 6]], [10, 10, 10], 'rgba(0,0,0,.4)', false);
    limb(c, [[0, y], [540, y - 10], [1080, y]], [4, 4, 4], `rgba(220,150,90,${a * .45})`, false);
  }
  ptMottle(c, 0, 1420, PT_W, 1920, 240, ['#2E2422', '#191312', '#3A2C26', '#100C0C'], R, 10, 40, .3);
  c.save(); c.translate(540, 1850); c.scale(1, .3); glow(c, 0, 0, 640, '#FF9A4A', .32, 'source-over'); c.restore();
  // an old tree at the right, threads tied round its trunk, roots hanging
  limb(c, [[1010, 1460], [1000, 1100], [1030, 700], [1010, 300], [1050, -20]], [110, 96, 86, 80, 76], '#0E0A0A');
  limb(c, [[1000, 1460], [990, 1100], [1016, 700]], [60, 50, 44], '#1E1614');
  for (let i = 0; i < 7; i++) { const x = 960 + R() * 110, y0 = 160 + R() * 300; limb(c, [[x, y0], [x + (R() - .5) * 30, y0 + 120], [x + (R() - .5) * 40, y0 + 220 + R() * 120]], [4, 3, 1.5], 'rgba(20,14,12,.8)'); }
  for (let k = 0; k < 6; k++) { const y = 1150 + k * 18; limb(c, [[948, y + 6], [1000, y - 6], [1070, y + 4]], [4, 4, 4], ['#C0201E', '#E8B030', '#C0201E'][k % 3], false); }
  limb(c, [[958, 1170], [940, 1220], [946, 1260]], [5, 4, 2], '#C0201E');
  // branches and leaves across the top right
  for (let i = 0; i < 70; i++) { const x = 700 + R() * 420, y = -30 + R() * 360; trLeaf(c, x, y, 40 + R() * 30, 18, R() * TAU, ['#06100C', '#0A1812', '#0C1C14'][R() * 3 | 0]); }
  // the jaba bush at the left: dark leaves, red flowers
  for (let i = 0; i < 120; i++) { const a = R() * TAU, d = Math.sqrt(R()), x = 90 + Math.cos(a) * 200 * d, y = 1300 + Math.sin(a) * 260 * d; trLeaf(c, x, y, 50 + R() * 26, 22, a + R(), ['#0C2414', '#12301A', '#183A20', '#0A1C10'][R() * 4 | 0]); }
  for (let i = 0; i < 11; i++) { const a = R() * TAU, d = .3 + R() * .7, x = 90 + Math.cos(a) * 170 * d, y = 1300 + Math.sin(a) * 220 * d; trJaba(c, x, y, 26 + R() * 10, R() * TAU); }
  // the stone seat under her, a tiger skin over it
  if (o.seat !== false) {
  ptShape(c, `M ${TR_X - 330} 1720 C ${TR_X - 330} 1690 ${TR_X + 330} 1690 ${TR_X + 330} 1720 L ${TR_X + 350} 1800 C ${TR_X + 200} 1820 ${TR_X - 200} 1820 ${TR_X - 350} 1800 Z`, ptLin(c, 0, 1690, 0, 1820, [[0, '#5A4E50'], [.3, '#3A3234'], [1, '#161214']]));
  const skin = `M ${TR_X - 300} 1716 C ${TR_X - 180} 1704 ${TR_X + 180} 1704 ${TR_X + 300} 1716 L ${TR_X + 250} 1790 C ${TR_X + 120} 1802 ${TR_X - 120} 1802 ${TR_X - 250} 1790 Z`;
  ptShape(c, skin, ptLin(c, 0, 1704, 0, 1800, [[0, TR_TIGER.lt], [.5, TR_TIGER.base], [1, TR_TIGER.dk]]));
  inside(c, skin, () => { for (let i = 0; i < 14; i++) { const x = TR_X - 280 + i * 42 + (R() - .5) * 14; limb(c, [[x, 1800], [x + 6, 1770], [x + 2, 1744]], [10, 7, 1.5], '#1A1006'); } });
  }
  for (const [x, y] of TR_LAMPS) trDiya(c, x, y);
}

// ---------- the churning (design) ----------
function trStorm(c, R, y1, tint = '#1E3A30') {
  c.fillStyle = ptLin(c, 0, 0, 0, y1, [[0, '#04060E'], [.55, '#0C1428'], [.85, '#16243A'], [1, tint]]); c.fillRect(0, 0, PT_W, y1);
  for (let i = 0; i < 26; i++) { const x = R() * 1200 - 60, y = 80 + R() * (y1 - 400), w = 160 + R() * 260; ellipse(c, x, y, w, w * .32, ['#0A1020', '#121A30', '#0E1626', '#1A2238'][R() * 4 | 0], (R() - .5) * .2); ellipse(c, x - w * .2, y - w * .12, w * .5, w * .1, 'rgba(90,110,150,.14)'); }
  ptMottle(c, 0, 0, PT_W, y1, 200, ['#0A1020', '#1A2438', '#22304A', '#0C1222'], R, 30, 120, .25);
}
function trVasukiBand(c, P, w) {
  limb(c, P, P.map(() => w), '#0B2224');
  limb(c, P.map(([x, y]) => [x, y - w * .12]), P.map(() => w * .76), '#1F4E4A');
  c.save(); c.globalAlpha = .6; limb(c, P.map(([x, y]) => [x, y - w * .3]), P.map(() => w * .22), '#5E9C8A'); c.restore();
}
function trSea(c) {
  const R = lcg(91);
  trStorm(c, R, 1300);
  // Mandara: a dark mountain standing in the sea, its flanks lit by lightning from the left
  const m = `M 230 1330 C 300 1100 380 800 470 560 C 500 500 580 500 610 560 C 700 800 780 1100 850 1330 Z`;
  ptShape(c, m, ptLin(c, 230, 0, 850, 0, [[0, '#3A4458'], [.4, '#262E40'], [1, '#0E121C']]));
  inside(c, m, () => { for (let i = 0; i < 16; i++) { const y = 600 + i * 46, w = 60 + i * 22; limb(c, [[540 - w, y + 20], [540 - w * .3, y], [540 + w * .4, y + 10]], [6, 10, 6], 'rgba(10,12,20,.45)', false); } ellipse(c, 400, 900, 60, 300, 'rgba(150,170,210,.14)', .25); });
  // Vasuki wound round it, his body running out to both sides
  for (let k = 0; k < 5; k++) { const y = 760 + k * 120, hw = 120 + k * 46; trVasukiBand(c, [[540 - hw - 10, y + 40], [540 - hw * .3, y + 64], [540 + hw * .5, y + 50], [540 + hw + 10, y + 10]], 40 + k * 4); }
  trVasukiBand(c, [[-40, 1240], [140, 1230], [300, 1260], [440, 1290]], 52);
  trVasukiBand(c, [[640, 1290], [800, 1250], [960, 1230], [1120, 1240]], 52);
  // tiny figures hauling on him at both ends
  for (let i = 0; i < 7; i++) for (const s of [-1, 1]) {
    const x = s < 0 ? 40 + i * 46 : 1040 - i * 46, y = 1232 + (s < 0 ? i * 4 : i * 4), h = 46 - i * 2;
    ellipse(c, x, y - h, 7, 8, '#06080E'); poly(c, [[x - 8, y - h + 6], [x + 8, y - h + 6], [x + 10 + s * 6, y], [x - 10 + s * 6, y]], '#06080E');
    limb(c, [[x, y - h + 12], [x - s * 18, y - h + 22]], [4, 3], '#06080E');
  }
  // the sea: black water heaving, foam whirling round the mountain's foot
  ptShape(c, `M 0 1290 C 300 1270 800 1270 1080 1290 L 1080 1920 L 0 1920 Z`, ptLin(c, 0, 1270, 0, 1920, [[0, '#14283A'], [.3, '#0C1A28'], [1, '#040A12']]));
  for (let i = 0; i < 60; i++) { const a = R() * TAU, r = 120 + R() * 380, x = 540 + Math.cos(a) * r, y = 1360 + Math.sin(a) * r * .22 + r * .2; if (y > 1290) limb(c, [[x, y], [x + Math.sin(a) * 60, y - Math.cos(a) * 12]], [3 + R() * 4, 1], `rgba(210,230,240,${.15 + R() * .3})`, false); }
  for (let i = 0; i < 40; i++) { const x = R() * 1080, y = 1320 + Math.pow(R(), .8) * 600; limb(c, [[x - 60, y], [x, y - 8], [x + 60, y]], [2, 5, 2], `rgba(150,190,210,${.08 + R() * .14})`, false); }
  ptMottle(c, 0, 1280, PT_W, 1920, 200, ['#0C1A28', '#16303E', '#061018', '#1E3A44'], R, 20, 70, .25);
  c.save(); c.translate(540, 1350); c.scale(1, .25); glow(c, 0, 0, 380, '#3E7A4A', .45, 'source-over'); c.restore();   // the poison's light where it wells up
}

// ---------- the ledge over the sea (design) ----------
function trShore(c) {
  const R = lcg(95);
  trStorm(c, R, 1190, '#1C3830');
  // the sea far below, Mandara small on the horizon with the poison welling up round it
  ptShape(c, `M 0 1150 L 1080 1150 L 1080 1500 L 0 1500 Z`, ptLin(c, 0, 1150, 0, 1500, [[0, '#18303A'], [1, '#08121A']]));
  for (let i = 0; i < 30; i++) { const y = 1160 + Math.pow(R(), 1.3) * 300, x = R() * 1080; limb(c, [[x, y], [x + 40 + R() * 80, y]], [1.5, 2.5], `rgba(150,190,200,${.06 + R() * .12})`, false); }
  const mx = 900;
  ptShape(c, `M ${mx - 90} 1156 C ${mx - 60} 1090 ${mx - 26} 1010 ${mx - 6} 960 C ${mx + 4} 948 ${mx + 14} 948 ${mx + 22} 960 C ${mx + 40} 1010 ${mx + 70} 1090 ${mx + 96} 1156 Z`, '#0E1420');
  for (let k = 0; k < 3; k++) limb(c, [[mx - 50 + k * 8, 1030 + k * 40], [mx, 1046 + k * 40], [mx + 50 - k * 4, 1026 + k * 40]], [10, 12, 10], '#16302E', false);
  c.save(); c.translate(mx, 1150); c.scale(1, .3); glow(c, 0, 0, 200, '#4A9A5A', .5, 'source-over'); c.restore();
  // the ledge he sits on, its lip lit, the tiger skin (as in svNight)
  c.save(); c.translate(0, SV_GY);
  const ledge = `M 0 1416 C 160 1398 300 1382 540 1380 C 780 1382 940 1396 1080 1412 L 1080 1920 L 0 1920 Z`;
  ptShape(c, ledge, ptLin(c, 0, 1380, 0, 1920, [[0, '#46507A'], [.15, '#2C3350'], [.6, '#1A1F33'], [1, '#0C0E18']]));
  inside(c, ledge, () => {
    for (let i = 0; i < 14; i++) { const y = 1436 + i * 36 + R() * 20; c.strokeStyle = R() < .5 ? 'rgba(90,100,140,.25)' : 'rgba(5,6,12,.4)'; c.lineWidth = 3 + R() * 6; c.beginPath(); c.moveTo(-20, y); c.bezierCurveTo(300, y - 20 + R() * 40, 700, y - 20 + R() * 40, 1100, y + (R() - .5) * 40); c.stroke(); }
    ptMottle(c, 0, 1380, PT_W, 1920, 300, ['#2E3550', '#1A1F30', '#3C4462', '#11141F'], R, 10, 40, .3);
    limb(c, [[0, 1418], [300, 1386], [540, 1384], [780, 1386], [1080, 1416]], [8, 10, 10, 10, 8], 'rgba(160,180,230,.4)', false);
  });
  const [tx, ty] = [540, 1446];
  const skin = `M ${tx - 400} ${ty + 10} C ${tx - 420} ${ty - 30} ${tx - 300} ${ty - 44} ${tx - 160} ${ty - 40} C ${tx} ${ty - 36} ${tx + 180} ${ty - 44} ${tx + 330} ${ty - 36}
                C ${tx + 430} ${ty - 30} ${tx + 440} ${ty + 20} ${tx + 400} ${ty + 70} C ${tx + 300} ${ty + 104} ${tx - 300} ${ty + 106} ${tx - 390} ${ty + 70} Z`;
  ptShape(c, skin, ptLin(c, 0, ty - 44, 0, ty + 106, [[0, SV_TIGER.lt], [.5, SV_TIGER.base], [1, SV_TIGER.dk]]));
  inside(c, skin, () => { for (let i = 0; i < 16; i += 2) { const x = tx - 400 + i * 52 + (R() - .5) * 24; for (let k = 0; k < 2; k++) { const l = 22 + R() * 36, xx = x + k * 13; limb(c, [[xx, ty + 112], [xx + 2, ty + 112 - l * .5], [xx + 4, ty + 112 - l]], [11 - k * 2, 7, 1.5], '#1A1006'); } } });
  c.save(); c.translate(540, 1480); c.scale(1, .12); glow(c, 0, 0, 470, '#140C06', .7, 'source-over'); c.restore();
  c.restore();
}

// ---------- the Devi seated (design, dhLakshmi's frame moved down TR_DY; no head) ----------
function trHand(c, x, y, ang, sk) {   // a hand curved round his back: the fingers together, seen from the back, alta at the tips
  c.save(); c.translate(x, y); c.rotate(ang);
  const m = 'M -26 -18 C -6 -26 30 -24 52 -14 C 64 -8 66 8 54 14 C 30 22 -4 22 -26 16 C -36 8 -36 -10 -26 -18 Z';
  ptShape(c, m, ptLin(c, 0, -24, 0, 22, [[0, sk.lt], [.5, sk.base], [1, sk.dk]]));
  for (const v of [-7, 1, 9]) limb(c, [[22, v], [40, v + 1], [56, v + 2]], [1.2, 1.4, .8], `rgba(${sk.sh},.5)`, false);
  for (const v of [-10, -2, 6, 13]) ellipse(c, 58, v + 1, 4, 3.2, '#C0303A');
  ellipse(c, -6, -14, 16, 5, rgba(sk.lt, .5));
  c.restore();
}
function trBody(o = {}) {
  const T = !!o.tara, sk = T ? TR_BLUE : TR_WARM;
  return (c) => {
    c.translate(0, TR_DY);
    const R = lcg(T ? 151 : 153), X = TR_X, red = T ? TR_CRIM : DH_RED;
    // ---- hair behind: Tara's loose and wild, spreading past her shoulders to the waist; Parvati's long and smooth
    if (T) {
      ptShape(c, `M ${X - 130} 860 C ${X - 260} 900 ${X - 330} 1080 ${X - 320} 1300 C ${X - 300} 1400 ${X - 250} 1440 ${X - 200} 1420 L ${X + 200} 1420 C ${X + 250} 1440 ${X + 300} 1400 ${X + 320} 1300 C ${X + 330} 1080 ${X + 260} 900 ${X + 130} 860 Z`, ptLin(c, X - 330, 0, X + 330, 0, [[0, '#06040A'], [.3, '#16101C'], [.5, '#0C0810'], [.7, '#16101C'], [1, '#06040A']]));
      for (let k = 0; k < 30; k++) { const s = k % 2 ? 1 : -1, j = k >> 1, sp = j * 14, w = (R() - .5) * 40; trLock(c, [[X + s * (60 + j * 6), 900 + j * 10], [X + s * (150 + sp * .6), 1040 + w], [X + s * (220 + sp * .5), 1200 - w], [X + s * (250 + sp * .4 + R() * 40), 1330 + j * 6]], 26 - j * .8, R); }
    } else {
      for (const s of [-1, 1]) ptShape(c, `M ${X + s * 60} 930 C ${X + s * 120} 960 ${X + s * 140} 1080 ${X + s * 170} 1180 C ${X + s * 190} 1260 ${X + s * 200} 1330 ${X + s * 170} 1360 L ${X + s * 110} 1300 C ${X + s * 100} 1200 ${X + s * 80} 1100 ${X + s * 40} 1040 Z`, ptLin(c, X, 0, X + s * 190, 0, [[0, '#120A08'], [.6, '#24160F'], [1, '#0C0605']]));
      // the veil falling behind her shoulders
      ptShape(c, `M ${X - 110} 900 C ${X - 150} 980 ${X - 170} 1080 ${X - 196} 1180 C ${X - 120} 1150 ${X - 60} 1140 ${X} 1140 C ${X + 60} 1140 ${X + 120} 1150 ${X + 196} 1180 C ${X + 170} 1080 ${X + 150} 980 ${X + 110} 900 Z`, ptLin(c, X - 240, 0, X + 240, 0, [[0, '#6A0818'], [.5, '#B01C30'], [1, '#6A0818']]));
    }
    ellipse(c, X, 950, 112, 108, '#100A0C');
    // ---- Tara's upper arms: her right (screen left) raises the khadga, her left holds the blue lotus
    if (T) for (const s of [-1, 1]) {
      const sh = [X + s * 150, 1200], el = [X + s * 302, 1238], wr = [X + s * 292, 1098];
      ptForm(c, [sh, [X + s * 240, 1236], el], [64, 58, 50], sk, -s * .2, -.9, .45);
      ptForm(c, [el, [X + s * 302, 1170], wr], [50, 44, 38], sk, -s * .4, -.6, .5);
      dhBand(c, [[X + s * 250, 1206], [X + s * 262, 1238], [X + s * 254, 1268]], 12);
      dhBangles(c, [X + s * 292, 1100], -1);
      if (s < 0) {   // the khadga: a heavy blade curving forward at the tip, a gold hilt
        const hx = X - 290, hy = 1060;
        const blade = `M ${hx - 10} ${hy - 20} L ${hx - 14} ${hy - 200} C ${hx - 16} ${hy - 280} ${hx + 10} ${hy - 330} ${hx + 40} ${hy - 352} C ${hx + 30} ${hy - 300} ${hx + 18} ${hy - 260} ${hx + 14} ${hy - 200} L ${hx + 12} ${hy - 20} Z`;
        ptShape(c, blade, ptLin(c, hx - 16, 0, hx + 40, 0, [[0, '#4A5270'], [.35, '#E8EEFA'], [.55, '#9AA4BC'], [1, '#3A4260']]));
        limb(c, [[hx - 2, hy - 30], [hx - 2, hy - 190]], [2, 1], 'rgba(255,255,255,.5)', false);
        limb(c, [[hx - 34, hy - 20], [hx, hy - 24], [hx + 34, hy - 20]], [12, 14, 12], ptLin(c, 0, hy - 30, 0, hy - 10, [[0, '#FFE38C'], [1, '#94631A']]));
        limb(c, [[hx, hy - 14], [hx, hy + 40]], [14, 12], '#5A3610');
      } else {
        limb(c, [[X + s * 290, 1060], [X + s * 292, 1020]], [8, 8], '#2E5A3A');
        c.save(); c.translate(X + s * 292, 990); c.rotate(s * .12);   // the blue lotus (utpala): narrow pointed petals
        for (const a of [-1.1, -.7, -.35, 0, .35, .7, 1.1]) dhPetalAt(c, 0, 20, a, 74 - Math.abs(a) * 10, 18, { base: '#E8EEFF', mid: '#8AA4E8', tip: '#3E5CB8' });
        for (const a of [-.4, 0, .4]) dhPetalAt(c, 0, 24, a, 48, 16, { base: '#F4F6FF', mid: '#B4C6F2', tip: '#5A78CC' });
        ellipse(c, 0, 4, 10, 6, '#F2C84A');
        c.restore();
      }
      dhFist(c, X + s * 290, 1068, s);
    }
    // ---- the lap: Tara in a tiger skin, Parvati in her red saree
    const lap = `M ${X - 150} 1380 C ${X - 260} 1400 ${X - 360} 1450 ${X - 384} 1530 C ${X - 396} 1600 ${X - 320} 1650 ${X - 200} 1652
                 L ${X + 200} 1652 C ${X + 320} 1650 ${X + 396} 1600 ${X + 384} 1530 C ${X + 360} 1450 ${X + 260} 1400 ${X + 150} 1380 Z`;
    if (T) {
      ptShape(c, lap, ptLin(c, 0, 1380, 0, 1652, [[0, TR_TIGER.lt], [.55, TR_TIGER.base], [1, TR_TIGER.dk]]));
      inside(c, lap, () => {
        for (const s of [-1, 1]) { ellipse(c, X + s * 270, 1500, 90, 54, 'rgba(255,214,140,.4)', s * -.2); ellipse(c, X + s * 210, 1610, 120, 28, 'rgba(110,52,14,.5)'); }
        for (let i = 0; i < 26; i++) { const s = i % 2 ? 1 : -1, k = (i >> 1) / 13, x0 = X + s * (390 - k * 330), y0 = 1430 + (i >> 1) % 3 * 60 + (R() - .5) * 20, l = 44 + R() * 30; for (const d of [0, 16]) limb(c, [[x0 - s * d * .3, y0 + d], [x0 - s * (l * .5 + d * .3), y0 + d + 6], [x0 - s * (l + d * .2), y0 + d + 18]], [13, 9, 1.5], '#1A1006'); }
      });
      dhBand(c, [[X - 392, 1590], [X - 300, 1640], [X, 1650], [X + 300, 1640], [X + 392, 1590]], 14);
    } else {
      ptShape(c, lap, ptLin(c, 0, 1380, 0, 1652, [[0, red.lt], [.45, red.base], [1, red.dk]]));
      dhBand(c, [[X - 392, 1590], [X - 300, 1640], [X, 1650], [X + 300, 1640], [X + 392, 1590]], 26);
    }
    // ---- the torso: skin, the choli
    const torso = `M ${X - 44} 1130 C ${X - 92} 1150 ${X - 160} 1158 ${X - 192} 1190 C ${X - 216} 1240 ${X - 206} 1320 ${X - 170} 1400 L ${X + 170} 1400 C ${X + 206} 1320 ${X + 216} 1240 ${X + 192} 1190 C ${X + 160} 1158 ${X + 92} 1150 ${X + 44} 1130 Z`;
    ptShape(c, torso, ptRad(c, X, 1210, 10, 260, [[0, sk.lt], [.55, sk.base], [1, sk.dk]], X, 1260));
    inside(c, torso, () => { ellipse(c, X, 1365, 26, 6, `rgba(${sk.sh},.35)`); ellipse(c, X, 1372, 5, 4, `rgba(${sk.sh},.6)`); });
    const choli = `M ${X - 196} 1214 C ${X - 130} 1196 ${X - 64} 1236 ${X} 1252 C ${X + 64} 1236 ${X + 130} 1196 ${X + 196} 1214 L ${X + 190} 1336 C ${X + 100} 1346 ${X - 100} 1346 ${X - 190} 1336 Z`;
    ptShape(c, choli, ptLin(c, 0, 1200, 0, 1346, [[0, red.lt], [.5, red.base], [1, red.dk]]));
    dhBand(c, [[X - 194, 1216], [X - 130, 1200], [X - 64, 1238], [X, 1254], [X + 64, 1238], [X + 130, 1200], [X + 194, 1216]], 12);
    dhBand(c, [[X - 190, 1334], [X, 1346], [X + 190, 1334]], 12);
    // ---- shoulders (the lower arms come from here; Tara's are in trFront)
    for (const s of [-1, 1]) {
      const sh = [X + s * 182, 1222];
      ellipse(c, sh[0] + s * 4, sh[1] + 4, 46, 50, sk.dk); ellipse(c, sh[0], sh[1], 42, 46, sk.base); ellipse(c, sh[0] - s * 8, sh[1] - 14, 22, 18, rgba(sk.lt, .6));
      ellipse(c, sh[0] + s * 4, sh[1] + 2, 44, 40, red.dk); ellipse(c, sh[0] + s * 2, sh[1] - 2, 40, 36, red.base);
      dhBand(c, [[sh[0] - s * 30, sh[1] + 30], [sh[0] + s * 8, sh[1] + 40], [sh[0] + s * 42, sh[1] + 24]], 10);
    }
    if (!T) {   // Parvati's arms, down at her sides, hands in her lap
      for (const s of [-1, 1]) {
        const sh = [X + s * 186, 1240], el = [X + s * 236, 1400], wr = [X + s * 120, 1520];
        ptForm(c, [sh, [X + s * 220, 1320], el], [64, 60, 52], sk, -s * .3, -.9, .45);
        ptForm(c, [el, [X + s * 180, 1480], wr], [52, 46, 40], sk, -s * .3, -.8, .5);
        dhBangles(c, [X + s * 140, 1500], 1);
      }
      // her pallu over her left shoulder
      const pallu = `M ${X + 120} 1176 C ${X + 170} 1170 ${X + 204} 1196 ${X + 206} 1240 C ${X + 110} 1330 ${X - 30} 1400 ${X - 176} 1440 L ${X - 190} 1356 C ${X - 80} 1340 ${X + 40} 1270 ${X + 120} 1176 Z`;
      ptShape(c, pallu, ptLin(c, X + 200, 1170, X - 180, 1430, [[0, '#D8452C'], [.45, '#E0503C'], [1, '#9A1E1A']]));
      dhBand(c, [[X + 206, 1242], [X + 110, 1332], [X - 30, 1402], [X - 178, 1442]], 22);
    }
    // ---- the neck, necklaces; Tara's garland of jaba
    const neck = `M ${X - 38} 1070 L ${X + 38} 1070 C ${X + 40} 1110 ${X + 56} 1130 ${X + 90} 1146 L ${X - 90} 1146 C ${X - 56} 1130 ${X - 40} 1110 ${X - 38} 1070 Z`;
    ptShape(c, neck, ptLin(c, 0, 1070, 0, 1146, [[0, sk.dk], [.45, sk.base], [1, sk.base]]));
    dhBand(c, [[X - 42, 1108], [X, 1122], [X + 42, 1108]], 14);
    [-28, -10, 10, 28].forEach((dx, i) => dhGem(c, X + dx, 1118 + Math.abs(dx) * -.14, 4.5, i % 2 ? '#1E8A5A' : '#B0182C'));
    dhBeads(c, [[X - 74, 1146], [X - 50, 1186], [X, 1206], [X + 50, 1186], [X + 74, 1146]], 6, 10);
    if (T) {
      const G = through([[X - 130, 1150], [X - 170, 1300], [X - 150, 1440], [X - 60, 1520], [X + 60, 1520], [X + 150, 1440], [X + 170, 1300], [X + 130, 1150]], 6);
      for (let i = 0; i < G.length; i += 2) { limb(c, [G[i], G[Math.min(G.length - 1, i + 2)]], [6, 6], '#1E3A1A', false); }
      for (let i = 0; i < G.length; i += 3) trJaba(c, G[i][0], G[i][1], 20, i * .9);
    } else {
      dhBeads(c, [[X - 96, 1150], [X - 90, 1240], [X - 40, 1300], [X, 1312], [X + 40, 1300], [X + 90, 1240], [X + 96, 1150]], 5, 11, ['#F4EEE2', '#FFFFFF', '#FFFFFF']);
    }
    // ---- grade: moonlight from above right, lamplight warm from below
    c.save(); c.globalCompositeOperation = 'source-atop';
    c.fillStyle = ptLin(c, 0, 640, 0, 1700, [[0, 'rgba(190,210,255,.12)'], [.55, 'rgba(190,210,255,0)'], [1, 'rgba(255,140,60,.22)']]); c.fillRect(0, 600, PT_W, 1200);
    c.restore();
  };
}

// ---------- her lower arms cradling, the pallu over the child (design) ----------
function trFront(o = {}) {
  const sk = TR_BLUE;
  return (c) => {
    c.translate(0, TR_DY);
    const X = TR_X, red = TR_CRIM;
    // her right (screen left): elbow out and down, the forearm sweeping in under the child, the hand cupped
    { const sh = [X - 186, 1240], el = [X - 252, 1392], wr = [X - 120, 1440];
      ptForm(c, [sh, [X - 230, 1310], el], [64, 60, 52], sk, .3, -.9, .45);
      ptForm(c, [el, [X - 190, 1440], wr], [52, 48, 42], sk, .1, -1, .5);
      c.save(); c.translate(X - 150, 1442); c.rotate(-.3); dhBangles(c, [0, 0], 1); c.restore(); }
    // the pallu: from her left shoulder down across the child to her right hip, a gold border on its edge
    const pallu = `M ${X + 130} 1176 C ${X + 186} 1172 ${X + 214} 1200 ${X + 214} 1250 C ${X + 200} 1350 ${X + 60} 1440 ${X - 120} 1470 C ${X - 180} 1476 ${X - 220} 1460 ${X - 230} 1430
                   C ${X - 150} 1400 ${X - 40} 1350 ${X + 40} 1306 C ${X + 100} 1272 ${X + 120} 1230 ${X + 130} 1176 Z`;
    ptShape(c, pallu, ptLin(c, X + 210, 1180, X - 200, 1460, [[0, '#B42440'], [.45, '#8E1426'], [1, '#4A0612']]));
    inside(c, pallu, () => {
      for (let k = 0; k < 5; k++) limb(c, [[X + 190 - k * 12, 1220 + k * 10], [X + 60 - k * 24, 1360 + k * 10], [X - 180, 1440 + k * 6]], [3, 6, 3], 'rgba(40,0,10,.3)');
      for (let i = 0; i < 40; i++) { const R = hash(i * 3.3), Q = hash(i * 7.1); ellipse(c, X - 200 + R * 400, 1200 + Q * 260, 3.2, 3.2, 'rgba(255,210,120,.75)'); }
      ellipse(c, X + 60, 1330, 120, 50, 'rgba(255,170,190,.16)', -.6);   // the round of the child under it
    });
    dhBand(c, [[X + 130, 1180], [X + 118, 1236], [X + 80, 1286], [X + 20, 1320], [X - 80, 1374], [X - 230, 1432]], 16);
    // her left (screen right): the elbow out, the forearm up behind his back, the hand round his head and shoulders
    { const sh = [X + 186, 1240], el = [X + 250, 1380], wr = [X + 176, 1300];
      ptForm(c, [sh, [X + 232, 1310], el], [64, 60, 52], sk, -.3, -.9, .45);
      ptForm(c, [el, [X + 220, 1340], wr], [52, 46, 40], sk, -.4, -.8, .5);
      c.save(); c.translate(X + 190, 1310); c.rotate(.9); dhBangles(c, [0, 0], 1); c.restore();
      trHand(c, X + 158, 1282, Math.PI * .92, sk); }
    c.save(); c.globalCompositeOperation = 'source-atop';
    c.fillStyle = ptLin(c, 0, 1150, 0, 1480, [[0, 'rgba(190,210,255,.08)'], [1, 'rgba(255,140,60,.2)']]); c.fillRect(0, 1100, PT_W, 420);
    c.restore();
  };
}

// ---------- her head (design, in dhLakshmi's head frame; placed with trHd) ----------
function trHead(o = {}) {
  const T = !!o.tara, sk = T ? TR_BLUE : TR_WARM, eyes = o.eyes || 'front', mouth = o.mouth || 'soft';
  const S = a => `rgba(${sk.sh},${a})`, HL = a => `rgba(${sk.hl},${a})`;
  return (c) => {
    c.translate(TR_X, 1100 + TR_DY); c.scale(TR_HS, TR_HS); c.translate(-TR_X, -1100);
    const X = TR_X, R = lcg(T ? 61 : 63);
    // ears and jhumkas
    for (const s of [-1, 1]) {
      ellipse(c, X + s * 71, 1012, 8, 15, sk.base); ellipse(c, X + s * 72, 1013, 4, 8, sk.dk);
      dhGem(c, X + s * 78, 1030, 6, '#B0182C');
      const jx = X + s * 80, jy = 1046;
      ptShape(c, `M ${jx - 6} ${jy} C ${jx - 20} ${jy + 12} ${jx - 22} ${jy + 30} ${jx - 20} ${jy + 40} L ${jx + 20} ${jy + 40} C ${jx + 22} ${jy + 30} ${jx + 20} ${jy + 12} ${jx + 6} ${jy} Z`, ptLin(c, jx - 22, 0, jx + 22, 0, [[0, DH_GOLD.dk], [.4, DH_GOLD.lt], [1, DH_GOLD.base]]));
      for (let k = 0; k < 5; k++) ellipse(c, jx - 16 + k * 8, jy + 46, 3.4, 3.8, '#FFFFFF');
      dhBand(c, [[jx - 22, jy + 40], [jx + 22, jy + 40]], 6);
    }
    const faceD = `M ${X - 68} 952 C ${X - 72} 1004 ${X - 64} 1044 ${X - 42} 1074 C ${X - 27} 1096 ${X - 12} 1107 ${X} 1108 C ${X + 12} 1107 ${X + 27} 1096 ${X + 42} 1074 C ${X + 64} 1044 ${X + 72} 1004 ${X + 68} 952 C ${X + 50} 908 ${X - 50} 908 ${X - 68} 952 Z`;
    ptShape(c, faceD, ptRad(c, X - 14, 990, 8, 118, sk.face, X, 1006));
    inside(c, faceD, () => {
      ellipse(c, X + 62, 1020, 20, 70, S(.22)); ellipse(c, X - 64, 1020, 12, 60, S(.12));
      for (const s of [-1, 1]) { ellipse(c, X + s * 34, 980, 24, 8, S(.14)); ellipse(c, X + s * 42, 1036, 17, 11, T ? 'rgba(150,120,220,.16)' : 'rgba(236,128,112,.17)'); ellipse(c, X + s * 36, 1014, 22, 7, HL(.22)); }
      ellipse(c, X, 940, 40, 14, HL(.3)); ellipse(c, X + 9, 1012, 5, 24, S(.16)); ellipse(c, X, 1056, 5, 5, S(.1));
      ellipse(c, X, 1084, 13, 3.5, S(.28)); ellipse(c, X - 2, 1093, 13, 7, HL(.4)); ellipse(c, X, 1106, 30, 6, S(.28));
    });
    // the eyes (as dhLakshmi's): open looking at us, lowered looking down, or shut
    const EI = 16, EO = 52, EY = 993, dn = eyes === 'down';
    const eye = s => dn ? `M ${X + s * EI} ${EY + 3} C ${X + s * 22} ${EY - 1} ${X + s * 38} ${EY - 3} ${X + s * EO} ${EY + 1} C ${X + s * 40} ${EY + 7} ${X + s * 24} ${EY + 8} ${X + s * EI} ${EY + 3} Z`
      : `M ${X + s * EI} ${EY + 2} C ${X + s * 21} ${EY - 7} ${X + s * 38} ${EY - 10} ${X + s * EO} ${EY - 2} C ${X + s * 40} ${EY + 7} ${X + s * 24} ${EY + 8} ${X + s * EI} ${EY + 2} Z`;
    c.lineCap = 'round'; c.lineJoin = 'round';
    for (const s of [-1, 1]) {
      c.save(); c.globalAlpha = .32; ptShape(c, `M ${X + s * (EI - 1)} ${EY + 1} C ${X + s * 20} ${EY - 16} ${X + s * 42} ${EY - 18} ${X + s * (EO + 6)} ${EY - 5} C ${X + s * 40} ${EY - 11} ${X + s * 22} ${EY - 8} ${X + s * (EI - 1)} ${EY + 1} Z`, T ? 'rgba(110,70,160,.7)' : 'rgba(178,92,70,.6)'); c.restore();
      c.strokeStyle = S(.5); c.lineWidth = 1.3; c.beginPath(); c.moveTo(X + s * 20, EY - 10); c.bezierCurveTo(X + s * 28, EY - 17, X + s * 42, EY - 17, X + s * 50, EY - 10); c.stroke();
      if (eyes !== 'shut') {
        ptShape(c, eye(s), ptLin(c, X + s * EI, 0, X + s * EO, 0, [[0, '#E4D6D0'], [.25, '#F8F2EC'], [.75, '#F6EEE6'], [1, '#D8C4B8']]));
        inside(c, eye(s), () => {
          const ix = X + s * 33 + (o.look || 0) * 3, iy = EY - .5 + (dn ? 4.5 : 0);
          ellipse(c, ix, iy, 7.6, 7.6, '#1C0E08');
          ellipse(c, ix, iy, 6.7, 6.7, ptRad(c, ix, iy + 2, 1, 6.7, [[0, '#8A5426'], [.6, '#5A3216'], [1, '#3A1E0C']]));
          ellipse(c, ix, iy, 2.9, 2.9, '#0A0402');
          ellipse(c, ix - s * 2.4, iy - 2.4, 1.6, 1.5, '#FFFFFF'); ellipse(c, ix + s * 2, iy + 2.6, .8, .8, 'rgba(255,255,255,.7)');
          ellipse(c, X + s * 34, EY - (dn ? 4 : 9), 22, dn ? 5 : 4, 'rgba(50,24,30,.5)');
          ellipse(c, X + s * (EI + 2), EY + 2, 2.6, 2, 'rgba(220,130,130,.6)');
          if (o.tear) ellipse(c, X + s * 34, EY + 6, 16, 2.4, 'rgba(230,245,255,.75)');   // the eye brimming
        });
        if (dn) limb(c, [[X + s * (EI - 1), EY + 3], [X + s * 22, EY - 1], [X + s * 38, EY - 3], [X + s * EO, EY + 1], [X + s * (EO + 9), EY - 4]], [1.2, 3, 3.4, 2.8, .6], '#120806');
        else limb(c, [[X + s * (EI - 1), EY + 2], [X + s * 22, EY - 7], [X + s * 38, EY - 10], [X + s * EO, EY - 2], [X + s * (EO + 9), EY - 7]], [1.2, 2.8, 3.2, 2.6, .6], '#120806');
        limb(c, [[X + s * (EI + 1), EY + 3], [X + s * 28, EY + 7.5], [X + s * 42, EY + 5.5], [X + s * EO, EY - 1.5]], [.6, 1.5, 1.7, 1], 'rgba(22,10,8,.85)');
        if (dn) { c.strokeStyle = '#120806'; c.lineWidth = 1; for (let k = 0; k < 5; k++) { const x = X + s * (24 + k * 5.5); c.beginPath(); c.moveTo(x, EY + 1); c.lineTo(x + s * 1.2, EY + 5); c.stroke(); } }
      } else {
        ptShape(c, eye(s), T ? 'rgba(60,70,130,.5)' : 'rgba(196,118,92,.45)');
        limb(c, [[X + s * (EI - 1), EY + 2], [X + s * 28, EY + 6], [X + s * 42, EY + 4], [X + s * EO, EY - 2], [X + s * (EO + 9), EY - 7]], [1.2, 2.6, 2.8, 2.2, .6], '#120806');
        c.strokeStyle = '#120806'; c.lineWidth = 1; for (let k = 0; k < 5; k++) { const x = X + s * (24 + k * 5.5); c.beginPath(); c.moveTo(x, EY + 6); c.lineTo(x + s * 1.4, EY + 10); c.stroke(); }
      }
      // the brows: Parvati's knit a little in grief
      const lift = mouth === 'sad' ? 1 : 0;
      limb(c, [[X + s * 17, EY - 15 - lift * 4], [X + s * 30, EY - 22 - lift * 2], [X + s * 45, EY - 23], [X + s * 61, EY - 17]], [2.2, 3.2, 2.4, .7], '#1A0C08');
    }
    if (o.tear) {   // one tear down her right cheek (screen left)
      ptShape(c, `M ${X - 40} 1004 C ${X - 43} 1020 ${X - 44} 1034 ${X - 42} 1046 C ${X - 40} 1052 ${X - 34} 1052 ${X - 34} 1044 C ${X - 34} 1032 ${X - 37} 1018 ${X - 40} 1004 Z`, 'rgba(220,240,255,.6)');
      ellipse(c, X - 38, 1044, 2.4, 3, 'rgba(255,255,255,.95)');
    }
    // the nose
    limb(c, [[X + 10, 1000], [X + 10, 1016], [X + 12, 1030]], [.6, 1.6, 1.2], S(.3));
    ellipse(c, X - 1, 1033, 7, 5, HL(.5));
    c.strokeStyle = T ? 'rgba(14,20,60,.75)' : 'rgba(112,48,32,.75)'; c.lineWidth = 2;
    for (const s of [-1, 1]) { c.beginPath(); c.moveTo(X + s * 14, 1033); c.bezierCurveTo(X + s * 17, 1042, X + s * 11, 1046, X + s * 6, 1043.5); c.stroke(); }
    c.lineWidth = 1.5; c.beginPath(); c.moveTo(X - 6, 1043.5); c.quadraticCurveTo(X, 1046.5, X + 6, 1043.5); c.stroke();
    ellipse(c, X - 7, 1042, 2.8, 1.6, T ? '#101640' : '#5E2618'); ellipse(c, X + 7, 1042, 2.8, 1.6, T ? '#101640' : '#5E2618');
    // the lips: a soft smile, a gentle one, or sad (corners down)
    const up = mouth === 'smile' ? 1 : mouth === 'sad' ? -1 : .35;
    ptShape(c, `M ${X - 22} ${1063 - up * 1.5} C ${X - 14} 1061 ${X - 10} 1058 ${X - 5} 1059 C ${X - 2} 1059 ${X - 1} 1061 ${X} 1061.5 C ${X + 1} 1061 ${X + 2} 1059 ${X + 5} 1059 C ${X + 10} 1058 ${X + 14} 1061 ${X + 22} ${1063 - up * 1.5} C ${X + 12} 1067 ${X - 12} 1067 ${X - 22} ${1063 - up * 1.5} Z`, ptLin(c, 0, 1058, 0, 1067, T ? [[0, '#9A2A48'], [1, '#701438']] : [[0, '#B4323E'], [1, '#8E1C2A']]));
    ptShape(c, `M ${X - 19} 1065 C ${X - 12} ${1078 + up} ${X + 12} ${1078 + up} ${X + 19} 1065 C ${X + 10} 1069.5 ${X - 10} 1069.5 ${X - 19} 1065 Z`, ptLin(c, 0, 1066, 0, 1079, T ? [[0, '#A0304E'], [.6, '#BC4A68'], [1, '#A0384E']] : [[0, '#B83442'], [.6, '#D0505C'], [1, '#B83E4A']]));
    ellipse(c, X + 1, 1073, 6, 2, 'rgba(255,214,220,.55)');
    c.strokeStyle = T ? '#3A0820' : '#5A0E18'; c.lineWidth = 1.8; c.beginPath(); c.moveTo(X - 24, 1064 - up * 4); c.quadraticCurveTo(X - 18, 1066 - up, X - 12, 1067); c.quadraticCurveTo(X, 1069, X + 12, 1067); c.quadraticCurveTo(X + 18, 1066 - up, X + 24, 1064 - up * 4); c.stroke();
    if (up > .5) for (const s of [-1, 1]) ellipse(c, X + s * 38, 1040, 15, 10, HL(.3));
    c.strokeStyle = DH_GOLD.base; c.lineWidth = 3; c.beginPath(); c.arc(X + 12, 1052, 12, -1.9, 1.3); c.stroke();
    dhGem(c, X + 23, 1058, 3, '#B0182C');
    // the hair over the brow, parted; sindoor in the parting
    ptShape(c, `M ${X - 80} 990 C ${X - 84} 930 ${X - 50} 900 ${X} 896 C ${X + 50} 900 ${X + 84} 930 ${X + 80} 990 C ${X + 70} 950 ${X + 40} 926 ${X + 2} 930 L ${X - 2} 930 C ${X - 40} 926 ${X - 70} 950 ${X - 80} 990 Z`, '#120A0C');
    for (const s of [-1, 1]) { c.save(); c.globalAlpha = .4; limb(c, [[X + s * 4, 904], [X + s * 44, 916], [X + s * 74, 962]], [3, 2.4, 1.4], '#5A3E40'); c.restore(); }
    if (T) {   // loose strands falling over her temples
      for (const s of [-1, 1]) for (let k = 0; k < 3; k++) limb(c, [[X + s * (60 + k * 6), 930], [X + s * (82 + k * 8), 990], [X + s * (78 + k * 10), 1060 + k * 20]], [6, 4, 1.5], '#100A0E');
    }
    limb(c, [[X, 900], [X, 928]], [3, 2], '#C8102A');
    // the third eye (Tara: open, upright) or the bindi (Parvati)
    if (T) {
      const ty = 952, th = o.third ?? 1;
      ptShape(c, `M ${X} ${ty - 15} C ${X + 8} ${ty - 6} ${X + 8} ${ty + 6} ${X} ${ty + 15} C ${X - 8} ${ty + 6} ${X - 8} ${ty - 6} ${X} ${ty - 15} Z`, '#120806');
      if (th > 0) { c.save(); c.translate(X, ty); c.scale(th, 1); ptShape(c, `M 0 -12 C 6 -5 6 5 0 12 C -6 5 -6 -5 0 -12 Z`, '#F6EEE6'); ellipse(c, 0, 0, 4.2, 5, '#8A2A16'); ellipse(c, 0, 0, 2, 2.6, '#0A0402'); ellipse(c, -1.2, -1.6, 1, 1, '#FFFFFF'); c.restore(); }
      ellipse(c, X, 974, 4, 4, '#C8102A');
    } else { dhGem(c, X, 968, 5, '#C41E32'); ellipse(c, X, 959, 2.2, 2.2, DH_GOLD.lt); }
    // the crown: a coronet of seven pointed gold petals on a jewelled band; Tara's with jaba tucked at the sides
    for (let k = -3; k <= 3; k++) {
      const x = X + k * 25, h = (T ? 92 : 74) - Math.abs(k) * 10, a = k * .1;
      c.save(); c.translate(x, 910); c.rotate(a);
      const leaf = `M -15 0 C -20 ${-h * .45} -8 ${-h * .8} 0 ${-h} C 8 ${-h * .8} 20 ${-h * .45} 15 0 Z`;
      ptShape(c, leaf, ptLin(c, -16, 0, 16, 0, [[0, DH_GOLD.dk], [.4, DH_GOLD.lt], [1, DH_GOLD.base]]));
      c.strokeStyle = DH_GOLD.dk; c.lineWidth = 2; c.stroke(new Path2D(leaf));
      dhGem(c, 0, -h * .42, k ? 5 : 8, k % 2 ? '#1E8A5A' : '#B0182C'); ellipse(c, 0, -h * .82, 2.4, 2.4, '#FFF6DA');
      c.restore();
    }
    dhBand(c, [[X - 88, 904], [X, 914], [X + 88, 904]], 20);
    for (let k = -3; k <= 3; k++) dhGem(c, X + k * 25, 908 + Math.abs(k) * -.6, k % 2 ? 4.5 : 5.5, k % 2 ? '#1E8A5A' : '#B0182C');
    for (let k = -8; k <= 8; k++) ellipse(c, X + k * 10.5, 920 - Math.abs(k) * .5, 2.4, 2.8, '#FFFFFF');
    if (T) { trJaba(c, X - 96, 900, 22, .4); trJaba(c, X + 96, 900, 22, -.4); }
    else {   // Parvati's veil over the back of the crown, framing her face
      ptShape(c, `M ${X - 100} 960 C ${X - 120} 880 ${X - 70} 830 ${X} 828 C ${X + 70} 830 ${X + 120} 880 ${X + 100} 960 C ${X + 110} 1000 ${X + 104} 1040 ${X + 96} 1080 L ${X + 84} 1080 C ${X + 92} 1000 ${X + 90} 940 ${X + 80} 900 C ${X + 40} 880 ${X - 40} 880 ${X - 80} 900 C ${X - 90} 940 ${X - 92} 1000 ${X - 84} 1080 L ${X - 96} 1080 C ${X - 104} 1040 ${X - 110} 1000 ${X - 100} 960 Z`, ptLin(c, X - 120, 0, X + 120, 0, [[0, '#7A0A1C'], [.5, '#C4223A'], [1, '#7A0A1C']]));
      dhBand(c, [[X - 98, 1076], [X - 104, 960], [X - 70, 860], [X, 838], [X + 70, 860], [X + 104, 960], [X + 98, 1076]], 8);
    }
    c.save(); c.globalCompositeOperation = 'source-atop';
    c.fillStyle = ptLin(c, 0, 820, 0, 1110, [[0, 'rgba(200,220,255,.12)'], [1, 'rgba(255,150,80,.1)']]); c.fillRect(X - 200, 780, 400, 340);
    c.restore();
  };
}

// ---------- baby Shiva in her arms (design, stage px) ----------
// His head at TR_BABY, tilted toward her; the rest of him is under the pallu (trFront), so only the face, a little jata
// knot with the crescent, and the blue throat show.
function trBaby(face = 'calm') {
  return (c) => {
    const [bx, by] = TR_BABY, sk = SV_SKIN, pain = face === 'pain';
    c.save(); c.translate(bx, by); c.rotate(-.35);
    // the bundle's top under his chin (the pallu covers the rest)
    ellipse(c, -30, 70, 90, 46, '#7A1022');
    // the topknot of jata, a crescent in it
    ellipse(c, 6, -50, 28, 22, '#1A1311'); ellipse(c, 2, -64, 18, 16, '#241A16'); limb(c, [[-14, -58], [4, -70], [20, -58]], [3, 3, 3], '#4A3A34', false);
    c.save(); c.translate(24, -60); c.rotate(.5); ptShape(c, 'M 0 -12 C 10 -8 12 8 2 12 C 6 6 6 -6 0 -12 Z', '#FFF6DA'); c.restore();
    // the round baby face
    const f = 'M -42 -10 C -44 -40 -20 -50 2 -50 C 26 -50 46 -36 44 -6 C 42 22 24 42 0 42 C -24 42 -40 22 -42 -10 Z';
    ptShape(c, f, ptRad(c, -8, -14, 4, 56, [[0, sk.lt], [.6, sk.base], [1, sk.dk]]));
    inside(c, f, () => { ellipse(c, -20, 12, 12, 8, 'rgba(255,190,200,.4)'); ellipse(c, 22, 12, 12, 8, 'rgba(255,190,200,.4)'); ellipse(c, 30, 0, 14, 36, 'rgba(110,116,150,.25)'); });
    // hair on the brow, the tripundra a smudge of ash
    ptShape(c, 'M -40 -18 C -38 -44 -12 -52 4 -50 C 24 -50 42 -40 42 -16 C 32 -34 14 -40 0 -38 C -16 -38 -30 -32 -40 -18 Z', '#1A1311');
    for (let k = 0; k < 3; k++) limb(c, [[-12, -26 + k * 4], [0, -28 + k * 4], [12, -26 + k * 4]], [1.6, 1.8, 1.6], 'rgba(150,156,184,.8)', false);
    // closed eyes: pain knits the brows and pulls the mouth down; calm curves them into a sleeping smile
    c.strokeStyle = '#2A2028'; c.lineCap = 'round';
    for (const s of [-1, 1]) {
      c.lineWidth = 2.6; c.beginPath();
      if (pain) { c.moveTo(s * 8, -6); c.quadraticCurveTo(s * 17, -2, s * 26, -6); } else { c.moveTo(s * 8, -4); c.quadraticCurveTo(s * 17, 2, s * 26, -4); }
      c.stroke();
      c.lineWidth = 2; c.beginPath();
      if (pain) { c.moveTo(s * 6, -14); c.lineTo(s * 26, -18); } else { c.moveTo(s * 8, -16); c.quadraticCurveTo(s * 17, -20, s * 26, -16); }
      c.stroke();
    }
    ellipse(c, 0, 8, 4, 3, 'rgba(110,116,150,.5)');
    c.strokeStyle = '#A0404C'; c.lineWidth = 2.6; c.beginPath();
    if (pain) { c.moveTo(-8, 24); c.quadraticCurveTo(0, 19, 8, 24); } else { c.moveTo(-9, 20); c.quadraticCurveTo(0, 28, 9, 20); }
    c.stroke();
    // the throat, blue (the poison is drawn live over it)
    ptShape(c, 'M -18 36 C -16 50 16 50 18 36 L 22 60 L -22 60 Z', ptLin(c, 0, 36, 0, 60, [[0, sk.dk], [1, '#5274C0']]));
    // one small hand out over the pallu
    ellipse(c, -50, 52, 13, 11, sk.base); ellipse(c, -54, 48, 6, 4, sk.lt);
    c.restore();
  };
}

// ---------- the devotees on the ghat, from behind (design, stage px) ----------
function trDevotees(c) {
  const R = lcg(171), D = '#0A0708', rim = 'rgba(255,170,90,.55)';
  const seatY = 1610;
  // a mother on the left, her baby on her shoulder, her sari over her head
  { const x = 300;
    ptShape(c, `M ${x - 90} ${seatY} C ${x - 100} ${seatY - 100} ${x - 70} ${seatY - 200} ${x - 40} ${seatY - 250} C ${x - 30} ${seatY - 300} ${x + 30} ${seatY - 300} ${x + 40} ${seatY - 250} C ${x + 70} ${seatY - 200} ${x + 100} ${seatY - 100} ${x + 90} ${seatY} Z`, D);
    ellipse(c, x, seatY - 290, 38, 44, D);
    ellipse(c, x - 54, seatY - 248, 26, 28, D); ellipse(c, x - 54, seatY - 280, 8, 8, D);   // the baby's head on her shoulder, a tuft
    limb(c, [[x - 70, seatY - 220], [x - 50, seatY - 200]], [18, 16], D);
    limb(c, [[x - 30, seatY - 326], [x + 2, seatY - 334], [x + 34, seatY - 322]], [3, 3, 3], rim, false); }
  // a boy in the middle, sitting with his knees up
  { const x = 560;
    ptShape(c, `M ${x - 56} ${seatY} C ${x - 64} ${seatY - 70} ${x - 50} ${seatY - 150} ${x - 30} ${seatY - 170} C ${x - 10} ${seatY - 186} ${x + 10} ${seatY - 186} ${x + 30} ${seatY - 170} C ${x + 50} ${seatY - 150} ${x + 64} ${seatY - 70} ${x + 56} ${seatY} Z`, D);
    ellipse(c, x, seatY - 206, 30, 32, D); ellipse(c, x + 10, seatY - 236, 14, 10, D);
    limb(c, [[x - 24, seatY - 230], [x, seatY - 238], [x + 26, seatY - 228]], [3, 3, 3], rim, false); }
  // an old sevak at the right, shawl over his shoulders, a staff by him
  { const x = 790;
    limb(c, [[x + 96, seatY + 10], [x + 100, seatY - 360]], [8, 6], D);
    ptShape(c, `M ${x - 96} ${seatY} C ${x - 104} ${seatY - 110} ${x - 80} ${seatY - 210} ${x - 46} ${seatY - 246} C ${x - 20} ${seatY - 270} ${x + 20} ${seatY - 270} ${x + 46} ${seatY - 246} C ${x + 80} ${seatY - 210} ${x + 104} ${seatY - 110} ${x + 96} ${seatY} Z`, D);
    ellipse(c, x, seatY - 286, 36, 40, D);
    limb(c, [[x - 28, seatY - 320], [x, seatY - 328], [x + 30, seatY - 318]], [3, 3, 3], rim, false); }
  // the rim of lamplight along their shoulders
  for (const [x, w] of [[300, 90], [560, 56], [790, 96]]) limb(c, [[x - w, seatY - 20], [x - w * .9, seatY - 120]], [3, 2], 'rgba(255,170,90,.35)', false);
}
