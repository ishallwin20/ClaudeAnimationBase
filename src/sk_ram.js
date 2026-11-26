// sk_ram.js: Ram lifting Shiva's bow at Sita's swayamvar (Valmiki, Bala Kanda 67), in the Sketch style. Drawn over a
// posed rig (sketch_pose.html: indian_teenager.glb, lunging, the left fist raised, the face turned up at it) mapped
// into the 1080 x 1920 frame. Ram's blue skin from the Ramayan cast, a pitambara dhoti, a red patka, a maroon
// uttariya, a gold kirita; the bow held by its middle above his head, its string loose from the left tip to his
// right hand. skRamScene(c, t, o): the finished frame; o.noText leaves the quote off; o.u (0..1) the draw-on.
const SKR = {
  skin: '#6A7698', skinSh: '#2E3452', skinHi: '#B4BED8', skinRf: '#B98A66', skinLine: '#171424',
  gold: '#C8932C', goldSh: '#6E4812', goldHi: '#F6D985', goldLine: '#3A2408',
  dhoti: '#E3AE3A', dhotiSh: '#9C6716', dhotiHi: '#FBDC8A',
  patka: '#8E1B1E', patkaSh: '#4E0A10', patkaHi: '#C94A3A',
  utt: '#7A1828', uttSh: '#3E0812', uttHi: '#B0404A',
  hair: '#17131D', hairHi: '#4A4660', red: '#A3161A', thread: '#F3E7CF',
  ink: '#1A1210',
};
// the head's local frame: an upright profile facing right, origin mid-skull, tipped back by HEAD.a
const HEAD = { x: 514, y: 790, a: -.48, k: 1.3 };
function skHeadPt([x, y]) { const c = Math.cos(HEAD.a), s = Math.sin(HEAD.a); return [HEAD.x + (x * c - y * s) * HEAD.k, HEAD.y + (x * s + y * c) * HEAD.k]; }
const skH = P => P.map(skHeadPt);
// the bow's frame: x along the bow from the grip, y up-negative; turned BOW.a, the grip in the fist
const BOW = { x: 666, y: 588, a: .1, L: 390, y0: 44 };   // y0: the arc's rise, so the grip sits in the fist
function skBowPt([s, y]) { const c = Math.cos(BOW.a), n = Math.sin(BOW.a); y += BOW.y0; return [BOW.x + s * c - y * n, BOW.y + s * n + y * c]; }
const skB = P => P.map(skBowPt);

function skRamScene(c, t, o = {}) {
  SK.paper(c, 1080, 1920);
  SK.L = [-.7, -.7];
  if (!o.noText) skQuote(c, o);
  SK.ground(c, { x: 560, y: 1700, w: 900, seed: 4 });
  c.save(); c.filter = `blur(${14 * SK.S}px)`; c.fillStyle = 'rgba(70,45,25,.35)';   // the cast shadow
  c.beginPath(); c.ellipse(560, 1712, 300, 18, -.02, 0, 7); c.fill(); c.restore();
  skUttariya(c, t);
  skHairBack(c);
  // o.body: a posed, toon-shaded 3D body (sketch_ram3d.html at t 1.5, drawn where the guide sits) in place of the drawn limbs;
  // its own face is kept, the head frame is fitted to its skull (o.head) and only the hair, kundala and crown are drawn
  const keep = [{ ...HEAD }, { ...BOW }];
  if (o.body) { Object.assign(HEAD, o.head || {}); Object.assign(BOW, o.bow || {}); }
  if (o.body) c.drawImage(o.body, 44.8, 312, 1080 * .88, 1920 * .88);
  else { skBackLeg(c); skFrontShin(c); }
  skDhoti(c);
  if (!o.body) { skNeck(c); skTorso(c); }
  skPatka(c, t);
  if (!o.body) skRaisedArm(c);
  skBow(c, t);
  skFist(c);
  skHead(c, !!o.body);
  if (!o.body) skFrontArm(c);
  skString(c, t);
  skFlicks(c);
  Object.assign(HEAD, keep[0]); Object.assign(BOW, keep[1]);
}

function skQuote(c, o) {
  c.save(); c.fillStyle = '#1B1512'; c.textAlign = 'center'; c.textBaseline = 'alphabetic';
  c.font = '500 46px Gelasio';
  const L = o.lines || ['“He took the bow by its middle,', 'as if in play.”'];
  L.forEach((s, i) => c.fillText(s, 520, 436 + i * 56));
  c.font = 'italic 400 26px Gelasio'; c.fillStyle = '#4A3A2E';
  c.fillText(o.cite || '— Valmiki Ramayana, Bala Kanda', 520, 436 + L.length * 56 - 4);
  c.restore();
}

// ---- cloth behind ----
function skUttariya(c, t) {
  const C = SKR, f = Math.sin(t * 2.4) * 10, g = Math.sin(t * 2.4 + 1.4) * 12;
  // over both shoulders; the near end lifts and streams out to the left in the wind
  const CL = [[488, 884], [450, 892], [410, 910], [368, 936], [322, 958 + g * .3], [276, 972 + g * .6], [230, 980 + g], [186, 976 + f + g * .5], [146, 960 + f * 1.4]];
  const wv = u => 44 + 26 * u + 10 * Math.sin(u * 9 + f * .1);
  const P = SK.ribbon(CL, wv).map(([x, y], i, A) => [x, y + 26 * Math.max(0, (i < A.length / 2 ? i / (A.length / 2) : (A.length - i) / (A.length / 2)) - .3)]);
  SK.paint(c, P, C.utt, { sh: C.uttSh, hi: C.uttHi, d: 16, blur: 4, hatch: .6, L: [-.2, -1] });
  SK.streaks(c, P, { n: 22, dir: [-1, .15], len: 50, cols: ['rgba(40,0,10,.5)', 'rgba(230,130,120,.45)'], seed: 31 });
  SK.line(c, P, { w: 1.6, seed: 41, piece: [50, 130], ov: 10, closed: 1 });
  [[[400, 930], [330, 968], [262, 990]], [[360, 950], [300, 990], [230, 1010]]].forEach((Q, i) => SK.line(c, Q, { w: 1, seed: 43 + i }));
  const n = P.length / 2, end = [P[n - 2], P[n - 1], P[n], P[n + 1]];
  BI.stroke(c, end, { w: 7, a: .05, b: .05, col: C.gold, seed: 45 });
}
function skHairBack(c) {
  const C = SKR, P = skH([[-30, -46], [-52, -20], [-60, 10], [-58, 40], [-62, 70], [-68, 100]]).concat([[440, 952], [418, 948], [430, 960], [462, 958], [484, 930], [496, 900]], skH([[-8, 40], [-14, 10]]));
  SK.paint(c, P, C.hair, { hi: C.hairHi, d: 12, blur: 6, hia: .6 });
  SK.streaks(c, P, { n: 16, dir: [-.25, 1], len: 60, w: 1.4, cols: ['rgba(140,140,180,.35)', 'rgba(0,0,0,.5)'], seed: 51 });
  SK.line(c, P.slice(0, 9), { w: 2.6, seed: 52 });
}

// ---- legs ----
function skBackLeg(c) {
  const C = SKR, P = [[328, 1610], [324, 1640], [322, 1662], [312, 1680], [296, 1692], [280, 1700], [268, 1708], [274, 1716], [300, 1719], [332, 1721], [356, 1719], [366, 1708], [362, 1688], [360, 1662], [364, 1640], [370, 1610]];
  SK.paint(c, P, C.skin, { sh: C.skinSh, hi: C.skinHi, rf: C.skinRf, d: 14, blur: 7 });
  SK.line(c, P, { w: 2.2, seed: 61, ang: 1 });
  [[284, 1706], [292, 1704], [300, 1702]].forEach(([x, y], i) => SK.line(c, [[x, y], [x + 1, y + 12]], { w: .9, seed: 62 + i, ov: 1 })); SK.line(c, [[342, 1676], [350, 1686]], { w: .9, seed: 65 });
  skAnklet(c, [[322, 1650], [340, 1656], [360, 1652]]);
}
function skFrontShin(c) {
  const C = SKR, P = [[668, 1610], [668, 1640], [668, 1666], [674, 1690], [690, 1701], [730, 1703], [766, 1701], [792, 1697], [804, 1689], [796, 1680], [770, 1674], [746, 1662], [736, 1646], [738, 1610]];
  SK.paint(c, P, C.skin, { sh: C.skinSh, hi: C.skinHi, rf: C.skinRf, d: 14, blur: 7 });
  SK.line(c, P, { w: 2.2, seed: 71, ang: 1 });
  [[772, 1686], [784, 1688], [794, 1690]].forEach(([x, y], i) => SK.line(c, [[x, y - 6], [x + 1, y + 8]], { w: .9, seed: 72 + i, ov: 1 })); SK.line(c, [[680, 1664], [690, 1672]], { w: .9, seed: 76 });
  skAnklet(c, [[670, 1654], [702, 1660], [736, 1656]]);
  SK.rim(c, [[668, 1570], [664, 1620], [670, 1660]], { seed: 73 });
}
function skAnklet(c, P) {
  BI.stroke(c, P, { w: 9, a: .1, b: .1, jit: .1, col: SKR.gold, seed: 1 });
  BI.stroke(c, P.map(([x, y]) => [x, y - 2]), { w: 3, a: .2, b: .2, jit: .2, col: SKR.goldHi, seed: 2 });
  SK.line(c, P.map(([x, y]) => [x, y + 4]), { w: 1.4, seed: 81, col: SKR.goldLine });
}
function skDhoti(c) {
  const C = SKR;
  const P = [[420, 1185], [392, 1262], [360, 1350], [336, 1440], [320, 1520], [310, 1580], [314, 1626], [340, 1618], [364, 1634], [392, 1620], [414, 1626], [414, 1560], [424, 1500], [446, 1468], [482, 1478], [522, 1486], [564, 1480], [606, 1470], [640, 1482], [652, 1530], [654, 1630], [680, 1622], [706, 1640], [734, 1626], [764, 1634], [768, 1560], [764, 1480], [752, 1414], [730, 1334], [680, 1252], [614, 1196]];
  SK.paint(c, P, C.dhoti, { sh: C.dhotiSh, hi: C.dhotiHi, d: 30, blur: 6, hatch: .7, hcol: 'rgba(90,50,6,.4)', rf: '#F0C070' });
  // fold shadows: pulled from the bent front knee back to the waist, hanging down the back leg
  const fold = (Q, w, sd) => { BI.stroke(c, Q, { w, a: .15, b: .6, jit: .3, col: 'rgba(130,78,12,.55)', seed: sd, rough: .2 }); SK.line(c, Q.map(([x, y]) => [x - w * .35, y]), { w: 1.2, seed: sd, ang: 1, ov: 10 }); };
  c.save(); c.clip(BI.path(P));
  fold([[720, 1400], [680, 1330], [630, 1260], [596, 1214]], 14, 301); fold([[732, 1440], [690, 1390], [640, 1330]], 10, 302); fold([[706, 1470], [704, 1560], [712, 1630]], 10, 303);
  fold([[668, 1440], [674, 1530], [680, 1620]], 8, 304); fold([[440, 1240], [420, 1330], [398, 1420], [380, 1520], [372, 1610]], 12, 305); fold([[470, 1290], [446, 1380], [428, 1470], [412, 1600]], 10, 306);
  fold([[392, 1300], [370, 1400], [352, 1500], [340, 1600]], 8, 307); fold([[600, 1360], [630, 1420]], 8, 308);
  fold([[470, 1330], [500, 1420], [512, 1476]], 10, 309); fold([[590, 1330], [580, 1410], [574, 1474]], 10, 310); fold([[452, 1380], [474, 1440], [470, 1470]], 7, 311); fold([[620, 1400], [622, 1450], [616, 1470]], 7, 312);
  c.restore();
  SK.streaks(c, P, { n: 30, fan: [520, 1210], to: [[320, 1570], [750, 1580]], w: 1.8, bend: 30, cols: ['rgba(255,240,190,.55)', 'rgba(150,90,20,.4)'], seed: 91 });
  SK.line(c, P, { w: 2.2, seed: 92, ang: 1, piece: [60, 150], ov: 12 });
  // hem borders, red with gold
  for (const [Q, sd] of [[[[314, 1620], [340, 1612], [364, 1628], [392, 1614], [414, 1620]], 3], [[[654, 1624], [680, 1616], [706, 1634], [734, 1620], [764, 1628]], 4]]) {
    BI.stroke(c, Q, { w: 9, a: .05, b: .05, jit: .2, col: C.red, seed: sd }); BI.stroke(c, Q.map(([x, y]) => [x, y - 5]), { w: 2, a: .05, b: .05, col: C.gold, seed: sd + 9 }); }
  SK.rim(c, [[418, 1200], [392, 1262], [366, 1352], [344, 1442], [328, 1512]].map(([x, y]) => [x - 7, y]), { seed: 94 });
}
// the front pleats, hanging between the legs, and the red patka at the waist with its end
function skPatka(c, t) {
  const C = SKR, sw = Math.sin(t * 2.2 + .6) * 4;
  const pl = [[500, 1205], [544, 1205], [558, 1300], [566, 1400], [572 + sw, 1496], [560 + sw, 1516], [548 + sw, 1502], [536 + sw, 1520], [522 + sw, 1504], [508 + sw, 1522], [494 + sw, 1506], [490, 1400], [494, 1300]];
  SK.paint(c, pl, C.dhoti, { sh: C.dhotiSh, hi: C.dhotiHi, d: 16, blur: 8 });
  [508, 522, 536, 550].forEach((x, i) => SK.line(c, [[x - 2, 1215], [x, 1350], [x + 2 + sw * .7, 1498]], { w: 1.3, seed: 101 + i }));
  BI.stroke(c, [[494 + sw, 1506], [508 + sw, 1522], [522 + sw, 1504], [536 + sw, 1520], [548 + sw, 1502], [560 + sw, 1516], [572 + sw, 1496]], { w: 5, a: .05, b: .05, jit: .2, col: C.red, seed: 5, step: 1 });
  SK.line(c, pl, { w: 2.2, seed: 105, ang: 1 });
  // the sash
  const P = [[410, 1160], [470, 1172], [520, 1176], [580, 1170], [620, 1164], [624, 1214], [570, 1222], [520, 1226], [466, 1220], [414, 1212]];
  SK.paint(c, P, C.patka, { sh: C.patkaSh, hi: C.patkaHi, d: 14, blur: 6 });
  SK.streaks(c, P, { n: 12, dir: [1, .05], len: 60, w: 1.6, cols: ['rgba(0,0,0,.35)', 'rgba(230,120,90,.4)'], seed: 111 });
  BI.stroke(c, [[412, 1166], [520, 1180], [620, 1170]], { w: 4, a: .05, b: .05, col: C.gold, seed: 6 });
  BI.stroke(c, [[414, 1208], [520, 1222], [622, 1210]], { w: 4, a: .05, b: .05, col: C.gold, seed: 7 });
  SK.line(c, P, { w: 2.4, seed: 112, ang: 1 });
  // the hanging end, swaying, with a gold zari pattern
  const E = [[436, 1206], [472, 1212], [478 + sw * .5, 1290], [474 + sw, 1362], [458 + sw, 1384], [442 + sw, 1362], [432 + sw * .5, 1290]];
  SK.paint(c, E, C.patka, { sh: C.patkaSh, hi: C.patkaHi, d: 10, blur: 6 });
  for (let i = 0; i < 5; i++) { const y = 1236 + i * 26; BI.stroke(c, [[440 + sw * i / 6, y], [455 + sw * i / 6, y - 6], [470 + sw * i / 6, y]], { w: 1.8, a: .2, b: .2, col: C.gold, seed: 8 + i }); }
  BI.stroke(c, [[442 + sw, 1362], [458 + sw, 1380], [474 + sw, 1362]], { w: 4, a: .1, b: .1, col: C.gold, seed: 14 });
  SK.line(c, E, { w: 2, seed: 113, ang: 1 });
  // the knot
  SK.paint(c, BI.circ(452, 1200, 20, 16, .3), C.patka, { sh: C.patkaSh, hi: C.patkaHi, d: 8, blur: 4 });
  SK.line(c, BI.circ(452, 1200, 20, 16, .3), { w: 2, seed: 114, closed: 1 });
}

// ---- body ----
function skNeck(c) {
  const C = SKR, P = [[498, 826], [490, 894], [568, 900], [562, 846], [540, 836]];
  SK.paint(c, P, C.skin, { sh: C.skinSh, hi: C.skinHi, rf: C.skinRf, d: 16, blur: 8 });
  SK.line(c, [[566, 852], [568, 880], [572, 900]], { w: 2, seed: 121 });
  SK.line(c, [[520, 862], [534, 880], [546, 896]], { w: 1.2, seed: 122 });   // the sternomastoid
}
function skTorso(c) {
  const C = SKR;
  const P = [[490, 880], [455, 893], [425, 903], [405, 922], [397, 955], [403, 1000], [412, 1060], [416, 1120], [418, 1188], [614, 1188], [606, 1120], [600, 1060], [604, 1000], [620, 955], [640, 925], [628, 900], [600, 893], [568, 892]];
  SK.paint(c, P, C.skin, { sh: C.skinSh, hi: C.skinHi, rf: C.skinRf, d: 34, blur: 18, inner: c => {
    // the pec and abdomen forms as soft shade patches
    c.save(); c.filter = `blur(${9 * SK.S}px)`; c.globalAlpha = .55; c.fillStyle = C.skinSh;
    c.beginPath(); c.ellipse(500, 1012, 80, 14, .12, 0, 7); c.fill();
    c.beginPath(); c.ellipse(578, 1004, 22, 12, -.3, 0, 7); c.fill();
    c.globalAlpha = .35; [1052, 1092, 1130].forEach(y => { c.beginPath(); c.ellipse(512, y, 30, 6, 0, 0, 7); c.fill(); c.beginPath(); c.ellipse(566, y + 2, 18, 5, 0, 0, 7); c.fill(); });
    c.beginPath(); c.ellipse(590, 1100, 12, 60, .05, 0, 7); c.fill();
    c.globalAlpha = .4; c.fillStyle = C.skinHi; c.beginPath(); c.ellipse(470, 960, 46, 30, -.3, 0, 7); c.fill();
    c.beginPath(); c.ellipse(530, 1060, 18, 50, 0, 0, 7); c.fill();
    c.restore();
  } });
  SK.streaks(c, P, { n: 46, dir: [.25, 1], len: 22, w: 2.2, cols: ['rgba(190,200,230,.35)', 'rgba(30,30,60,.3)', 'rgba(200,150,120,.18)'], seed: 139 });
  SK.line(c, [[490, 880], [455, 893], [425, 903], [405, 922], [397, 955], [403, 1000], [412, 1060], [416, 1120], [418, 1188]], { w: 2.6, seed: 131, ang: 1 });
  SK.line(c, [[614, 1188], [606, 1120], [600, 1060], [604, 1000], [620, 955], [640, 925]], { w: 2.4, seed: 132, ang: 1 });
  // anatomy: collarbones, pecs, linea alba, abs, obliques, ribs under the raised arm, navel
  const th = { w: 1.3, ang: 1, piece: [30, 90], ov: 4 };
  [[[500, 905], [530, 918], [552, 912]], [[560, 914], [590, 905], [618, 902]], [[430, 990], [470, 1018], [520, 1022], [548, 1008]], [[556, 1000], [578, 1012], [596, 996]],
   [[548, 930], [546, 970], [550, 1010]], [[548, 1030], [548, 1100], [550, 1150]], [[512, 1048], [530, 1050]], [[514, 1090], [532, 1092]], [[566, 1050], [582, 1046]], [[566, 1090], [584, 1086]],
   [[592, 1040], [596, 1100], [602, 1160]], [[602, 960], [592, 972]], [[604, 984], [594, 994]], [[430, 1110], [450, 1170]]].forEach((Q, i) => SK.line(c, Q, { ...th, seed: 133 + i }));
  BI.stroke(c, [[548, 1146], [552, 1154], [548, 1160]], { w: 2.2, a: .3, b: .3, col: C.skinLine });
  SK.rim(c, [[455, 891], [425, 901], [405, 920], [395, 955], [401, 1000], [410, 1060]].map(([x, y]) => [x - 5, y - 3]), { seed: 147 });
  // the janeu, over the left shoulder (screen right) to the right hip
  const J = [[618, 900], [580, 960], [530, 1040], [480, 1110], [430, 1176]];
  BI.stroke(c, J, { w: 2.6, a: .02, b: .02, jit: .1, col: C.thread, seed: 9 });
  BI.stroke(c, J.map(([x, y]) => [x + 3, y + 2]), { w: 1.2, a: .02, b: .02, jit: .2, col: 'rgba(120,100,80,.6)', seed: 10 });
  // the necklace and mala
  BI.stroke(c, [[498, 892], [512, 916], [536, 926], [560, 916], [572, 896]], { w: 6, a: .02, b: .02, col: C.gold, seed: 11 });
  BI.stroke(c, [[498, 890], [512, 913], [536, 922], [560, 912], [572, 894]], { w: 2, a: .1, b: .1, col: C.goldHi, seed: 12 });
  const M = [[494, 896], [486, 950], [500, 1010], [534, 1040], [574, 1012], [592, 950], [580, 900]];
  for (let i = 0; i < 26; i++) { const p = BI.curve(M, false, 3), q = p[Math.floor(i / 26 * (p.length - 1))]; BI.disc(c, q[0], q[1], 4.2, C.gold); BI.disc(c, q[0] - 1.2, q[1] - 1.2, 1.6, C.goldHi); }
  SK.paint(c, [[522, 1036], [546, 1036], [544, 1062], [534, 1074], [524, 1062]], C.gold, { sh: C.goldSh, hi: C.goldHi, d: 5, blur: 3 });
  BI.disc(c, 534, 1050, 5, C.red);
  SK.line(c, [[522, 1036], [546, 1036], [544, 1062], [534, 1074], [524, 1062]], { w: 1.4, seed: 148, closed: 1, col: C.goldLine });
}
function skRaisedArm(c) {
  const C = SKR;
  // the far edge (screen left): deltoid, biceps, the elbow, the forearm swelling below the elbow, the wrist
  const P = [[596, 900], [606, 872], [616, 842], [624, 812], [632, 790], [634, 760], [638, 724], [644, 690], [648, 652],
    [676, 650], [682, 690], [688, 740], [694, 772], [692, 800], [696, 836], [698, 866], [688, 896], [668, 922], [646, 934], [624, 920]];
  SK.paint(c, P, C.skin, { sh: C.skinSh, hi: C.skinHi, rf: C.skinRf, d: 18, blur: 5 });
  SK.streaks(c, P, { n: 26, dir: [.15, -1], len: 22, w: 2, cols: ['rgba(190,200,230,.35)', 'rgba(30,30,60,.3)'], seed: 159 });
  SK.line(c, P.slice(0, 9), { w: 2, seed: 151, ang: 0, ov: 10 });
  SK.line(c, P.slice(9, 19), { w: 2.4, seed: 152, ang: 0, ov: 10 });
  SK.line(c, [[642, 794], [660, 806], [680, 800]], { w: 1.2, seed: 153 });          // the elbow crease
  SK.line(c, [[624, 902], [652, 884], [680, 872]], { w: 1.2, seed: 154 });          // the deltoid
  SK.line(c, [[650, 760], [660, 720], [664, 690]], { w: .9, seed: 156 });           // the forearm's ridge
  SK.rim(c, [[604, 870], [614, 838], [622, 808], [630, 780], [634, 744], [642, 704]].map(([x, y]) => [x - 7, y]), { seed: 155 });
  skBand(c, [[620, 850], [656, 856], [696, 846]], 12);                              // the armlet
  skBand(c, [[646, 660], [662, 664], [680, 658]], 12);                              // the kada
}
function skBand(c, P, w) {
  const C = SKR, top = P.map(([x, y]) => [x, y - w / 2]), bot = P.map(([x, y]) => [x, y + w / 2]).reverse(), S = [...top, ...bot];
  SK.paint(c, S, C.gold, { sh: C.goldSh, hi: C.goldHi, d: 5, blur: 3, ang: 1 });
  const m = P[1]; BI.disc(c, m[0], m[1], w * .32, C.red); BI.disc(c, m[0] - 1, m[1] - 1, w * .12, '#F2A0A0');
  SK.line(c, top, { w: 1.4, seed: 161 + P[0][1], col: C.goldLine }); SK.line(c, bot, { w: 1.4, seed: 162 + P[0][1], col: C.goldLine });
}
function skFist(c) {
  const C = SKR, sk = { sh: C.skinSh, hi: C.skinHi, rf: C.skinRf, blur: 2, hatch: 0 };
  // the back of the hand, from the kada up to the grip
  const back = [[648, 652], [640, 630], [640, 608], [694, 602], [698, 628], [682, 652]];
  SK.paint(c, back, C.skin, { ...sk, d: 10 });
  SK.line(c, back, { w: 1.8, seed: 171, ov: 6 });
  SK.line(c, [[656, 640], [662, 616]], { w: .9, seed: 179 }); SK.line(c, [[672, 640], [676, 614]], { w: .9, seed: 180 });   // tendons
  // four fingers over the grip: the knuckles above it, the fingers wrapped in front, the tips tucked under
  for (let i = 0; i < 4; i++) {
    const x0 = 638 + i * 14.5, x1 = x0 + 15, y0 = skBowPt([x0 - BOW.x, -21])[1] - 8, y1 = skBowPt([x0 - BOW.x, 21])[1] + 2;
    const F = [[x0, y1], [x0 - 1, y0 + 10], [x0 + 3, y0 + 1], [x0 + 8, y0 - 2], [x1 - 2, y0 + 1], [x1 + 1, y0 + 10], [x1, y1 - 2], [x0 + 8, y1 + 3]];
    SK.paint(c, F, C.skin, { ...sk, d: 6 });
    SK.line(c, F, { w: 1.5, seed: 172 + i, piece: [24, 60], ov: 3, closed: 1 });
    SK.line(c, [[x0 + 3, (y0 + y1) / 2 + 2], [x1 - 3, (y0 + y1) / 2]], { w: .9, seed: 182 + i, ov: 1 });        // the crease of the middle joint
    BI.oval(c, x0 + 7, y0 + 4, 4, 2.5, 'rgba(200,210,235,.55)');                                                 // light on the knuckle
  }
  // the thumb, wrapping round from the far side over the fingers
  const T = [[698, 636], [690, 620], [676, 610], [662, 604], [656, 610], [668, 618], [684, 630], [690, 644]];
  SK.paint(c, T, C.skin, { ...sk, d: 5 });
  SK.line(c, T, { w: 1.6, seed: 177, piece: [30, 70], ov: 3, closed: 1 });
  BI.oval(c, 662, 607, 4, 2.6, 'rgba(220,214,230,.7)', -.3);
}
function skBow(c, t) {
  const C = SKR, L = BOW.L, N = 160;
  // centreline: an arc, its middle highest, the tips swept up into recurves
  const yc = s => { const v = Math.abs(s / L); return -44 * (1 - v * v) + (v > .74 ? -420 * Math.pow(v - .74, 2) : 0); };
  const th = s => { const a = Math.abs(s); let w = 13 + 24 * Math.pow(Math.max(0, 1 - a / L), .7); if (a < 46) w = 42;
    for (const k of [62, 150, 285]) w += 14 * Math.exp(-Math.pow((a - k) / 11, 2)); return w; };
  SKR.bowY = yc;
  const top = [], bot = [];
  for (let i = 0; i <= N; i++) { const s = -L + 2 * L * i / N, h = th(s) / 2, d = (yc(s + 1) - yc(s - 1)) / 2, n = Math.hypot(1, d); top.push([s + d * h / n, yc(s) - h / n]); bot.push([s - d * h / n, yc(s) + h / n]); }
  const P = skB([...top, ...bot.slice().reverse()]);
  SK.paint(c, P, C.gold, { sh: C.goldSh, hi: C.goldHi, d: 12, blur: 3, sha: .95, hatch: .5, hcol: 'rgba(60,30,4,.5)', inner: c => {
    BI.stroke(c, skB(top.map(([x, y]) => [x, y + 5])), { w: 5, a: .3, b: .3, jit: .35, col: 'rgba(255,244,200,.85)', rough: .35, seed: 3 });
    BI.stroke(c, skB(bot.map(([x, y]) => [x, y - 4])), { w: 4, a: .3, b: .3, jit: .35, col: 'rgba(70,36,6,.6)', rough: .35, seed: 4 });
  } });
  SK.streaks(c, P, { n: 40, dir: [Math.cos(BOW.a), Math.sin(BOW.a)], len: 46, w: 1.4, cols: ['rgba(255,235,170,.6)', 'rgba(90,50,10,.5)'], seed: 181 });
  // the grip, wrapped dark
  const G = skB([[-46, yc(-46) - 21], [46, yc(46) - 21], [46, yc(46) + 21], [-46, yc(-46) + 21]]);
  SK.paint(c, G, '#3A2414', { hi: '#8A6242', d: 7, blur: 2, ang: 1, hatch: 0 });
  for (let s = -42; s <= 42; s += 8) SK.line(c, skB([[s - 4, yc(s) - 20], [s + 4, yc(s) + 20]]), { w: 1, seed: 190 + s, col: '#120A06', piece: [50, 50], ov: 1 });
  // gold knuckles at the limb roots and along the limbs, engraved scrolls
  for (const k of [-285, -150, -62, 62, 150, 285]) { const h = th(k) / 2 + 2; SK.line(c, skB([[k - 6, yc(k) - h], [k - 2, yc(k)], [k - 6, yc(k) + h]]), { w: 1.5, seed: 200 + k, col: C.goldLine, ov: 3 }); SK.line(c, skB([[k + 6, yc(k) - h], [k + 2, yc(k)], [k + 6, yc(k) + h]]), { w: 1.5, seed: 210 + k, col: C.goldLine, ov: 3 });
    const m = skBowPt([k, yc(k)]); BI.disc(c, m[0], m[1], 4.5, C.red); BI.disc(c, m[0] - 1.2, m[1] - 1.2, 1.6, '#F6B0A8'); }
  for (const k of [-220, -105, 105, 220]) for (const q of [-1, 1]) BI.stroke(c, skB(BI.spiral(k + q * 12, yc(k), 1.5, 6.5, 1.1, q > 0 ? 0 : Math.PI, q)), { w: 1.3, a: .2, b: .4, col: C.goldLine, seed: k + q });
  SK.line(c, P, { w: 2, seed: 211, col: '#2A1806', piece: [50, 140], ov: 9 });
  // the tips: a curled hook each, a red gem
  for (const sg of [-1, 1]) {
    const s0 = sg * L, e = [s0, yc(s0)], sp = BI.spiral(s0 + sg * 8, e[1] + 2, 12, 2, .8, sg > 0 ? Math.PI : 0, sg > 0 ? 1 : -1, 24);
    BI.stroke(c, skB(sp), { w: 9, a: .02, b: .7, col: C.gold, seed: 5 + sg }); BI.stroke(c, skB(sp), { w: 2, a: .1, b: .6, col: '#2A1806', seed: 7 + sg });
    const g = skBowPt(e); BI.disc(c, g[0], g[1], 6, C.red); BI.disc(c, g[0] - 1.5, g[1] - 1.5, 2, '#F4A6A0');
  }
  // a glint travelling along the bow
  const gs = -L + ((t * .55) % 1.6) * 2 * L / 1.2; if (Math.abs(gs) < L) { const g = skBowPt([gs, yc(gs) - 8]); const gr = c.createRadialGradient(g[0], g[1], 0, g[0], g[1], 30); gr.addColorStop(0, 'rgba(255,250,220,.9)'); gr.addColorStop(1, 'rgba(255,250,220,0)'); c.fillStyle = gr; c.fillRect(g[0] - 34, g[1] - 34, 68, 68); }
  SK.rim(c, skB(top.slice(14, 66).map(([x, y]) => [x, y - 6])), { seed: 212 });
}

// ---- head ----
function skHead(c, faceless) {
  const C = SKR;
  if (!faceless) {
  const face = skH([[-12, -60], [14, -56], [32, -42], [40, -24], [36, -12], [42, 0], [52, 12], [50, 18], [42, 21], [45, 27], [41, 31], [43, 36], [37, 41], [39, 48], [33, 57], [12, 60], [-6, 50], [-14, 30], [-30, 6], [-36, -24]]);
  SK.paint(c, face, C.skin, { sh: C.skinSh, hi: C.skinHi, rf: C.skinRf, d: 14, blur: 8, inner: c => {
    c.save(); c.filter = `blur(${5 * SK.S}px)`; c.fillStyle = C.skinSh; c.globalAlpha = .6;
    const e = skHeadPt([28, -8]); c.beginPath(); c.ellipse(e[0], e[1], 12, 7, HEAD.a, 0, 7); c.fill();       // the eye socket
    const ch = skHeadPt([18, 40]); c.beginPath(); c.ellipse(ch[0], ch[1], 18, 9, HEAD.a + .5, 0, 7); c.fill();  // under the cheekbone
    c.globalAlpha = .45; c.fillStyle = C.skinHi; const cb = skHeadPt([22, 14]); c.beginPath(); c.ellipse(cb[0], cb[1], 12, 8, HEAD.a, 0, 7); c.fill();
    const fh = skHeadPt([20, -36]); c.beginPath(); c.ellipse(fh[0], fh[1], 14, 8, HEAD.a, 0, 7); c.fill();
    c.restore();
  } });
  // profile line, jaw
  SK.line(c, skH([[32, -42], [40, -24], [36, -12], [42, 0], [52, 12], [50, 18], [42, 21], [45, 27], [41, 31], [43, 36], [37, 41], [39, 48], [33, 57], [12, 60]]), { w: 2.2, seed: 221, piece: [40, 90], ov: 4 });
  SK.line(c, skH([[-6, 30], [8, 48], [30, 56]]), { w: 1.2, seed: 222, piece: [30, 60], ov: 3 });
  // the eye, looking up at the bow
  const eyeU = skH([[20, -10], [27, -14], [35, -12], [38, -8]]), eyeL = skH([[22, -6], [30, -4], [37, -7]]);
  BI.fill(c, [...eyeU, ...eyeL.slice().reverse()], '#E9E4F0');
  const ir = skHeadPt([33, -10]); BI.disc(c, ir[0], ir[1], 3.4, '#14101C');
  BI.stroke(c, eyeU, { w: 3, a: .1, b: .5, col: C.skinLine, seed: 1 });
  BI.stroke(c, eyeL, { w: 1.2, a: .3, b: .5, col: C.skinLine, seed: 2 });
  BI.stroke(c, skH([[16, -22], [26, -24], [36, -22], [41, -19]]), { w: 4.2, a: .1, b: .6, col: '#120E18', seed: 3 });   // the brow
  SK.line(c, skH([[22, -16], [32, -18]]), { w: .9, seed: 223 });                                                       // the lid crease
  // nostril, mouth
  BI.stroke(c, skH([[40, 14], [44, 17], [46, 15]]), { w: 1.6, a: .3, b: .3, col: C.skinLine, seed: 4 });
  BI.stroke(c, skH([[30, 31], [36, 31], [41, 31]]), { w: 1.8, a: .5, b: .2, col: '#2A1830', seed: 5 });
  BI.stroke(c, skH([[36, 27], [42, 27]]), { w: 2.6, a: .3, b: .3, col: 'rgba(150,70,90,.6)', seed: 6 });
  // the tilak: a white U and a red line, on the brow
  BI.stroke(c, skH([[32, -26], [36, -40]]), { w: 3, a: .1, b: .3, col: '#F8F0E4', seed: 7 });
  BI.stroke(c, skH([[34, -28], [37, -38]]), { w: 1.6, a: .1, b: .3, col: C.red, seed: 8 });
  }
  // hair at the temple and over the ear
  const hr = skH([[-12, -60], [14, -56], [10, -40], [0, -30], [-6, -12], [-4, 4], [-16, 20], [-30, 16], [-36, -20]]);
  SK.paint(c, hr, C.hair, { hi: C.hairHi, d: 8, blur: 4 });
  SK.streaks(c, hr, { n: 10, dir: [-.4, 1], len: 30, w: 1.2, cols: ['rgba(140,140,190,.4)'], seed: 231 });
  // the ear and kundala
  const ear = skH([[-6, -6], [2, -10], [6, 0], [4, 14], [-2, 22], [-8, 18]]);
  if (!faceless) { SK.paint(c, ear, C.skin, { sh: C.skinSh, hi: C.skinHi, rf: C.skinRf, d: 4, blur: 2 });
  SK.line(c, ear, { w: 1.6, seed: 232, piece: [30, 60], ov: 2 }); }
  const k = skHeadPt([-4, 34]);
  SK.paint(c, BI.circ(k[0], k[1], 9, 12, HEAD.a), C.gold, { sh: C.goldSh, hi: C.goldHi, d: 3, blur: 2 });
  BI.disc(c, k[0], k[1] + 2, 3, C.red);
  SK.line(c, BI.circ(k[0], k[1], 9, 12, HEAD.a), { w: 1.4, seed: 233, closed: 1, col: C.goldLine });
  skCrown(c);
  SK.rim(c, skH([[-58, 0], [-50, -30], [-36, -50]]).map(([x, y]) => [x - 6, y]), { seed: 234 });
}
function skCrown(c) {
  const C = SKR;
  const P = skH([[-56, -26], [-60, -44], [-57, -70], [-52, -98], [-44, -124], [-34, -142], [-20, -152], [-6, -149], [6, -136], [16, -112], [26, -86], [36, -62], [44, -42]]);
  SK.paint(c, P, C.gold, { sh: C.goldSh, hi: C.goldHi, d: 12, blur: 3, hatch: .5, hcol: 'rgba(60,30,4,.5)' });
  SK.streaks(c, P, { n: 22, fan: skHeadPt([-16, -170]), to: skH([[-58, -30], [44, -44]]), w: 1.3, bend: 5, cols: ['rgba(255,240,180,.6)', 'rgba(90,50,10,.5)'], seed: 241 });
  const band = skH([[-58, -28], [-58, -42], [0, -48], [44, -52], [45, -38], [0, -34]]);
  SK.paint(c, band, C.gold, { sh: C.goldSh, hi: C.goldHi, d: 5, blur: 2, hatch: 0 });
  for (let i = 0; i < 9; i++) { const q = skHeadPt([-52 + i * 11.5, -36 - i * .9]); BI.disc(c, q[0], q[1], 2.4, '#FFF3DA'); }
  [[-60, -52, 36], [-88, -48, 22], [-114, -42, 10], [-136, -34, -4]].forEach(([y, a, b], i) => {
    const n = 4 - (i > 1 ? 1 : 0) - (i > 2 ? 1 : 0); for (let j = 0; j < n; j++) { const x = a + (b - a) * (j + .5) / n, w = (b - a) / n * .42;
      SK.paint(c, skH([[x - w, y + 7], [x, y - 12], [x + w, y + 7]]), C.goldHi, { sh: C.goldSh, d: 4, blur: 1, hatch: 0 });
      SK.line(c, skH([[x - w, y + 7], [x, y - 12], [x + w, y + 7]]), { w: 1.1, seed: 250 + i * 9 + j, col: C.goldLine, ov: 3 }); }
    SK.line(c, skH([[a - 4, y + 9], [(a + b) / 2, y + 6], [b + 4, y + 7]]), { w: 1.3, seed: 260 + i, col: C.goldLine });
    if (i < 3) { const g = skHeadPt([(a + b) / 2 + 6, y + 2]); BI.disc(c, g[0], g[1], 3, i % 2 ? '#2F8C7E' : C.red); }
  });
  const j = skHeadPt([20, -44]); BI.disc(c, j[0], j[1], 7.5, C.red); BI.disc(c, j[0] - 2.5, j[1] - 2.5, 2.4, '#F7B0A8');
  SK.line(c, BI.circ(j[0], j[1], 7.5), { w: 1.2, closed: 1, seed: 264, col: C.goldLine });
  SK.line(c, P, { w: 2, seed: 255, col: '#24160A', piece: [40, 110], ov: 10 });
  SK.line(c, band, { w: 1.5, seed: 256, col: '#24160A', closed: 1 });
  const tip = skHeadPt([-14, -162]); SK.paint(c, BI.circ(tip[0], tip[1], 6, 10, HEAD.a), C.gold, { sh: C.goldSh, hi: C.goldHi, d: 4, blur: 1, hatch: 0 }); SK.line(c, BI.circ(tip[0], tip[1], 6, 10, HEAD.a), { w: 1.2, closed: 1, seed: 257 });
}

// ---- the near arm, across the body, the string in its fingers ----
function skFrontArm(c) {
  const C = SKR;
  const up = [[404, 920], [396, 960], [396, 1000], [402, 1040], [412, 1068], [440, 1050], [444, 1000], [446, 960], [440, 930]];
  const fo = [[410, 1046], [440, 1040], [482, 1062], [530, 1082], [562, 1092], [560, 1124], [522, 1116], [470, 1098], [418, 1080]];
  SK.paint(c, up, C.skin, { sh: C.skinSh, hi: C.skinHi, rf: C.skinRf, d: 18, blur: 9 });
  SK.paint(c, fo, C.skin, { sh: C.skinSh, hi: C.skinHi, rf: C.skinRf, d: 14, blur: 7 });
  SK.line(c, [[404, 920], [396, 960], [396, 1000], [402, 1040], [412, 1070], [418, 1080], [470, 1098], [522, 1116], [560, 1124]], { w: 2.6, seed: 261, ang: 1 });
  SK.line(c, [[446, 966], [444, 1000], [440, 1040], [482, 1062], [530, 1082], [562, 1092]], { w: 2, seed: 262, ang: 1 });
  SK.line(c, [[418, 1050], [432, 1060]], { w: 1.2, seed: 263 });
  SK.rim(c, [[400, 930], [392, 970], [392, 1010], [400, 1050]].map(([x, y]) => [x - 6, y]), { seed: 264 });
  skBand(c, [[398, 984], [420, 990], [446, 984]], 12);
  skBand(c, [[548, 1088], [552, 1106], [554, 1124]].map(([x, y]) => [x, y]), 10);
  // the hand: loosely closed, thumb and index pinching the string
  const H = [[556, 1090], [582, 1086], [606, 1094], [624, 1108], [622, 1126], [604, 1136], [578, 1136], [558, 1124]];
  SK.paint(c, H, C.skin, { sh: C.skinSh, hi: C.skinHi, rf: C.skinRf, d: 8, blur: 4 });
  SK.line(c, H, { w: 2, seed: 265, piece: [30, 80], ov: 3, closed: 1 });
  [[[590, 1112], [612, 1120]], [[586, 1122], [606, 1132]], [[594, 1100], [618, 1110]]].forEach((Q, i) => SK.line(c, Q, { w: 1.2, seed: 266 + i }));
}
function skString(c, t) {
  const tip = skBowPt([-BOW.L, SKR.bowY(-BOW.L)]), sw = Math.sin(t * 2.4) * 10;
  const P = [tip, [tip[0] + 6 + sw * .3, tip[1] + 110], [tip[0] + 40 + sw, tip[1] + 240], [450, 1040], [530, 1092], [600, 1110]];
  BI.stroke(c, P, { w: 2, a: .02, b: .02, jit: .15, col: '#EFE2C2', seed: 1, step: 2 });
  BI.stroke(c, P.map(([x, y]) => [x + 1.5, y + 1]), { w: .9, a: .02, b: .02, jit: .2, col: 'rgba(60,40,20,.7)', seed: 2, step: 2 });
}
// red flicks: the energy of the lift
function skFlicks(c) {
  SK.flick(c, [[700, 880], [740, 860], [790, 848]], { w: 4, seed: 1 });
  SK.flick(c, [[380, 940], [350, 925], [318, 930]], { w: 3.5, seed: 2, drops: 10 });
  SK.flick(c, [[760, 640], [800, 628], [846, 634]], { w: 3, seed: 3 });
  SK.flick(c, [[780, 1380], [820, 1360], [860, 1370]], { w: 3, seed: 4, drops: 8 });
  SK.flick(c, [[300, 1250], [276, 1290], [272, 1330]], { w: 3, seed: 5 });
}
