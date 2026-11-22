// po_cast.js: the Pothi style's cast (needs pothi.js).
//   Anantashayana: Vishnu asleep on Shesha, side on. He lies on his back on the coils, his head raised on his far hand,
//   the face in profile toward his feet, eyes lowered (yoganidra); the near arm lies along his side, the hand on his
//   thigh; the pitambar to the ankles, the feet crossed; a maroon uttariya over the coil's edge. The design frame is a
//   1080 x 1920 stage (the bed's top centre near (566, 1340)); draw it elsewhere with a transform.
//     poAnantaHood(c): Shesha's neck and seven hoods (the heads bowed toward him); fills PO_ANANTA.tips (snout x, y, angle)
//     poAnantaBed(c): the coils, the tail and Vishnu.
//     poAnantaNavel(ph, bloom): (c) => the lotus rising from his navel, swaying with ph (0..1), opening with bloom.
//     PO_ANANTA: halo, haloR, navel, lotus, neck (the hoods' pivot), hoodBox, bedBox, lotusBox.
const PO_ANANTA = {
  head: { x: 292, y: 1170, r: -.3, s: 1.04 },
  halo: [278, 1142], haloR: 122, neck: [190, 1400], hoodC: [250, 1196],
  navel: [552, 1266], lotus: [800, 960],
  hoodBox: [0, 640, 620, 860], bedBox: [60, 960, 1010, 700], lotusBox: [520, 820, 420, 520],
  tips: []
};
const poAHT = (x, y) => { const { x: X, y: Y, r, s } = PO_ANANTA.head, co = Math.cos(r), si = Math.sin(r); return [X + (x * co - y * si) * s, Y + (x * si + y * co) * s]; };
// a soft fold: a blurred stroke inside the current clip
function poFold(c, P, w, col, blur = 4) { c.save(); c.filter = `blur(${blur}px)`; poLine(c, P, col, w); c.restore(); }

// ---------- Shesha's hoods ----------
function poAnantaHood(c) {
  const [cx, cy] = PO_ANANTA.hoodC, S = PO.slate, Cr = PO.cream, A = PO_ANANTA;
  // the neck rising from the coils behind his head, its cream belly toward him
  const neck = poLimb([A.neck, [194, 1330], [220, 1250], [cx, cy]], [96, 92, 86, 84]);
  poFill(c, neck, S.base, { sh: [14, 0, 12, rgba(S.dk, .8)], hi: [-12, 0, 10, rgba(S.lt, .7)] });
  poFill(c, poLimb([[A.neck[0] + 30, A.neck[1]], [228, 1330], [248, 1252], [cx + 22, cy + 14]], [30, 32, 30, 28]), Cr.base, { sh: [6, 0, 6, rgba(Cr.dk, .7)] });
  // seven hoods in a fan, the outer ones behind; each rises, swells, and curls forward into a head bowed toward him
  for (const i of [6, 5, 4, 3, 2, 1, 0]) {
    const f = i / 6, a = lerp(-.46, .5, f), m = Math.abs(i - 3), l = 410 - m * 26, w = 92 - m * 3;
    const bx = cx + Math.sin(a) * 30, by = cy + 30;
    c.save(); c.translate(bx, by); c.rotate(a);
    const back = [[-w * .2, 0], [-w * .38, -l * .34], [-w * .48, -l * .62], [-w * .4, -l * .84], [-w * .16, -l * .97], [w * .16, -l * 1.02], [w * .52, -l * .99], [w * .82, -l * .94], [w * .98, -l * .9, 1], [w * .76, -l * .86], [w * .5, -l * .85], [w * .5, -l * .68], [w * .5, -l * .5], [w * .36, -l * .26], [w * .22, 0]];
    poFill(c, back, S.base, { sh: [[w * .16, 0, w * .2, rgba(S.dk, .85)], [0, -l * .05, 8, rgba(S.dk, .4)]], hi: [-w * .22, 0, w * .2, rgba(S.lt, .9)],
      inside: () => poFold(c, [[-w * .22, -l * .1], [-w * .3, -l * .5], [-w * .22, -l * .86]], w * .1, rgba(S.lt, .5), w * .08) });
    // the cream underside of the hood, turned toward him
    const face = [[w * .02, -l * .04], [-w * .1, -l * .3], [-w * .14, -l * .58], [-w * .04, -l * .78], [w * .2, -l * .84], [w * .5, -l * .85], [w * .5, -l * .62], [w * .46, -l * .4], [w * .34, -l * .2], [w * .2, -l * .02]];
    poFill(c, face, Cr.base, { sh: [w * .1, l * .06, w * .14, rgba(Cr.dk, .8)], hi: [-w * .06, -l * .04, w * .12, rgba(Cr.lt, .8)],
      inside: () => { for (let k = 0; k < 9; k++) { const yy = -l * (.1 + k * .08); poLine(c, [[-w * .14, yy + 5], [w * .18, yy - 3], [w * .5, yy + 5]], rgba(Cr.dk, .3), 1.6); } } });
    // the eye, pale, and the mouth line
    ellipse(c, w * .56, -l * .945, w * .075, w * .05, '#D8D4BC', -.2); ellipse(c, w * .58, -l * .945, w * .022, w * .042, '#1A1A20');
    poLine(c, [[w * .94, -l * .9], [w * .72, -l * .885], [w * .52, -l * .89]], rgba(S.deep, .6), 1.6);
    c.restore();
    const ca = Math.cos(a), sa = Math.sin(a), sx = w * .98, sy = -l * .9;
    A.tips[i] = [bx + sx * ca - sy * sa, by + sx * sa + sy * ca, a + Math.PI / 2];
  }
}

// ---------- the coils ----------
function poCoilBand(c, x0, x1, y0, y1) {
  const r = (y1 - y0) * .5, mx = (x0 + x1) / 2, my = (y0 + y1) / 2, S = PO.coil;
  const P = [[x0 + r, y0], [mx, y0 - 5], [x1 - r, y0], [x1, my], [x1 - r * .9, y1], [mx, y1 + 8], [x0 + r * .9, y1], [x0, my]];
  poFill(c, P, S.base, { sh: [0, 22, 16, rgba(S.dk, .95)], hi: [[0, -14, 8, rgba(S.lt, .9)], [0, -30, 18, rgba('#6E7590', .5)]],
    inside: () => { for (let row = 0; row < 3; row++) for (let x = x0 + (row % 2) * 14; x < x1; x += 28) { c.strokeStyle = 'rgba(10,12,20,.12)'; c.lineWidth = 1.5; c.beginPath(); c.arc(x, y0 + 22 + row * (y1 - y0 - 30) / 3, 11, .3, Math.PI - .3); c.stroke(); } } });
}

// ---------- Vishnu on the coils ----------
function poAnantaBed(c) {
  const sk = PO.skin, S = PO.coil, H = poAHT, M = PO.maroon, Y = PO.silk, G = PO.gold;
  poCoilBand(c, 95, 1035, 1508, 1606);
  c.save(); c.filter = 'blur(6px)'; ellipse(c, 566, 1516, 440, 12, 'rgba(10,12,20,.4)'); c.restore();
  poCoilBand(c, 120, 1012, 1428, 1522);
  c.save(); c.filter = 'blur(6px)'; ellipse(c, 566, 1436, 420, 12, 'rgba(10,12,20,.4)'); c.restore();
  poCoilBand(c, 146, 986, 1336, 1440);
  // the bolster where the coil lifts under his shoulders
  poFill(c, [[150, 1392], [156, 1330], [196, 1292], [262, 1280], [330, 1296], [380, 1336], [300, 1362], [180, 1382]], S.base, { sh: [0, 16, 12, rgba(S.dk, .9)], hi: [0, -10, 8, rgba(S.lt, .9)] });
  // the tail curling up past his feet
  poFill(c, poLimb([[1000, 1574], [1046, 1512], [1056, 1452], [1040, 1410], [1014, 1398]], [78, 62, 44, 26, 8]), S.base, { sh: [10, 0, 10, rgba(S.dk, .9)], hi: [-8, 0, 8, rgba(S.lt, .8)] });
  c.save(); c.filter = 'blur(10px)'; ellipse(c, 600, 1342, 330, 12, 'rgba(10,12,22,.45)'); c.restore();

  // ---- the far (right) arm: the elbow on the bolster, the hand under the back of his head
  poFill(c, poLimb([[322, 1262], [276, 1294], [238, 1310]], [42, 36, 30]), sk.far, { sh: [0, 8, 8, rgba(sk.dk, .8)] });
  poFill(c, poLimb([[238, 1310], [244, 1268], [256, 1228]], [30, 27, 22]), sk.far, { sh: [6, 0, 6, rgba(sk.dk, .8)] });
  poBorder(c, [[232, 1252], [246, 1256], [260, 1252]], 7);
  poFill(c, [[242, 1236], [254, 1208], [268, 1194], [284, 1198], [286, 1214], [272, 1236]], sk.far);

  // ---- his hair: long and wavy, spread on the bolster behind his shoulder
  const hair = [H(-30, -36), H(-50, -6), [230, 1212], [222, 1232], [228, 1250], [220, 1272], [228, 1292], [224, 1314], [236, 1334], [234, 1352], [256, 1362], [292, 1366], [308, 1332], [298, 1286], [302, 1238], H(8, 22)];
  poFill(c, hair, PO.hair, { hi: [-6, -4, 6, 'rgba(110,90,80,.35)'],
    inside: () => { for (let k = 0; k < 5; k++) poLine(c, [H(-38 + k * 6, -10), [234 + k * 10, 1240], [250 + k * 9, 1310], [268 + k * 6, 1352]], 'rgba(120,100,90,.25)', 1.6); } });

  // ---- the uttariya: maroon silk over his shoulders, its end falling over the coil, gold buti and border
  const ut = [[292, 1238], [338, 1248], [366, 1290], [362, 1350], [334, 1404], [300, 1452, 1], [268, 1436], [236, 1450], [204, 1440, 1], [222, 1384], [252, 1328], [276, 1280]];
  poFill(c, ut, M.base, { sh: [12, 0, 12, rgba(M.dk, .8)], hi: [-10, 0, 10, rgba(M.lt, .6)],
    inside: () => { poFold(c, [[330, 1270], [310, 1350], [270, 1440]], 8, rgba(M.dk, .6), 5); poFold(c, [[300, 1280], [270, 1350], [232, 1440]], 6, rgba(M.dk, .45), 5); poFold(c, [[350, 1300], [330, 1370], [296, 1440]], 5, rgba(M.lt, .5), 4); for (const [x, y] of [[300, 1320], [330, 1340], [276, 1370], [312, 1384], [250, 1410], [290, 1420], [232, 1430]]) ellipse(c, x, y, 3.2, 4.4, G.base); } });
  poBorder(c, [[364, 1330], [350, 1380], [324, 1420], [300, 1450]], 7);
  poBorder(c, [[300, 1452], [268, 1438], [236, 1452], [204, 1442]], 8);

  // ---- the torso on its back, the chest toward the sky
  const torso = [[350, 1238], [380, 1214], [420, 1208], [454, 1220], [482, 1242], [514, 1255], [550, 1262], [600, 1266, 1], [604, 1342, 1], [520, 1344], [420, 1338], [344, 1316], [304, 1294], [298, 1262], [318, 1238]];
  poFill(c, torso, sk.base, { sh: [0, 32, 24, rgba(sk.dk, .95)], hi: [0, -12, 10, rgba(sk.lt, .8)],
    inside: () => { poFold(c, [[404, 1242], [434, 1248], [462, 1240]], 5, rgba(sk.dk, .55), 3); poFold(c, [[490, 1264], [522, 1272], [552, 1278]], 5, rgba(sk.dk, .3), 4); ellipse(c, 546, 1270, 3.6, 2.8, rgba(sk.dk, .9)); } });
  poLine(c, [[344, 1252], [420, 1272], [500, 1290], [590, 1302]], 'rgba(246,240,226,.9)', 2);    // the sacred thread
  poDots(c, [[350, 1238], [366, 1252], [388, 1254], [406, 1246]], 2.8, 6.5);
  poDots(c, [[348, 1242], [370, 1264], [396, 1268], [420, 1258]], 2.6, 6.5, '#F2EEE2', false);
  dhGem(c, 394, 1264, 6, PO.red);

  // ---- the pitambar: ochre silk from the waist to the ankles; the far knee drawn up, the cloth falling from it in folds
  const dh = [[592, 1262, 1], [640, 1240], [700, 1206], [748, 1176], [776, 1166], [800, 1176], [830, 1214], [860, 1260], [884, 1292], [914, 1296, 1], [924, 1340, 1], [880, 1356], [800, 1364], [700, 1360], [630, 1354], [594, 1346, 1]];
  poFill(c, dh, Y.base, { sh: [0, 22, 18, rgba(Y.dk, .85)], hi: [0, -12, 12, rgba(Y.lt, .9)],
    inside: () => {
      for (const [x, y] of [[690, 1330], [744, 1336], [800, 1334], [846, 1318]]) poFold(c, [[784, 1182], [lerp(784, x, .5) - 6, lerp(1182, y, .5)], [x, y]], 6, rgba(Y.dk, .45), 5);
      poFold(c, [[804, 1190], [844, 1242], [880, 1292]], 10, rgba(Y.dk, .35), 7);
      poFold(c, [[640, 1250], [700, 1214], [762, 1180]], 9, rgba(Y.lt, .85), 6);
      poFold(c, [[624, 1304], [720, 1310], [830, 1306], [910, 1310]], 6, rgba(Y.lt, .6), 5);
    } });
  poBorder(c, [[914, 1298], [918, 1318], [924, 1338]], 7);
  poBorder(c, [[924, 1340], [880, 1358], [800, 1366], [700, 1362], [630, 1356]], 6);
  // the waist: a gold band, the patka's maroon end hanging down the coil
  poFill(c, [[592, 1263], [603, 1262], [607, 1346], [597, 1347]], G.base, { sh: [4, 0, 3, rgba(G.dk, .8)], hi: [-3, 0, 3, rgba(G.lt, .8)] });

  // ---- the feet, crossed at the ankle, toes up; red alta on the soles, gold anklets
  const foot = (dx, dy, col) => {
    const F = [[912, 1326], [916, 1346], [934, 1350], [956, 1336], [974, 1310], [990, 1282], [992, 1268, 1], [982, 1266], [962, 1282], [940, 1292], [922, 1298], [910, 1308]].map(([x, y]) => [x + dx, y + dy]);
    poFill(c, F, col, { sh: [8, 4, 8, rgba(sk.dk, .8)], hi: [-6, -4, 6, rgba(sk.lt, .7)],
      inside: () => { poLine(c, [[996 + dx, 1268 + dy], [980 + dx, 1306 + dy], [958 + dx, 1340 + dy], [930 + dx, 1356 + dy]], '#A8303A', 7); for (let k = 0; k < 3; k++) poLine(c, [[982 + dx - k * 6, 1272 + dy + k * 4], [978 + dx - k * 6, 1280 + dy + k * 4]], rgba(sk.dk, .6), 1.2); } });
    poDots(c, [[908 + dx, 1314 + dy], [920 + dx, 1302 + dy], [934 + dx, 1290 + dy]], 2.8, 5.5);
  };
  foot(0, 0, sk.base);


  // ---- the near (left) arm along his side, the hand on his thigh
  const up = poLimb([[350, 1262], [392, 1280], [436, 1296], [476, 1306]], [46, 42, 36, 29]);
  const fore = poLimb([[474, 1306], [526, 1314], [574, 1316], [604, 1312]], [29, 31, 26, 21]);
  c.save(); c.filter = 'blur(6px)'; c.translate(0, 8); c.fillStyle = rgba(sk.dk, .7); c.fill(poPath(up)); c.fill(poPath(fore)); c.restore();
  const arm = PO_ANANTA.armCol || '#8E8BA2';
  poFill(c, fore, arm, { sh: [0, 10, 8, rgba(sk.dk, .75)], hi: [0, -6, 6, rgba(sk.lt, .85)] });
  poFill(c, up, arm, { sh: [0, 12, 10, rgba(sk.dk, .75)], hi: [0, -8, 8, rgba(sk.lt, .9)] });
  poBorder(c, [[404, 1266], [410, 1286], [414, 1306]], 8);                                  // the armlet
  poDots(c, [[404, 1268], [412, 1306]], 2.2, 6, PO.red, false);
  poBorder(c, [[586, 1300], [588, 1314], [590, 1328]], 6); poBorder(c, [[596, 1300], [598, 1314], [598, 1326]], 4);
  if (PO_ANANTA.simpleHand) // one soft mitten shape, the fingers together (the Dashavatar book)
    poFill(c, [[598, 1302], [624, 1295], [654, 1297], [680, 1304], [694, 1314], [686, 1324], [656, 1328], [626, 1327], [602, 1324]], arm, { sh: [0, 7, 6, rgba(sk.dk, .7)], hi: [0, -5, 4, rgba(sk.lt, .85)] });
  else {
  for (let i = 3; i >= 0; i--) poFill(c, poLimb([[646, 1303 + i * 4.5], [668, 1305 + i * 4.6], [686 - i * 3, 1310 + i * 4.6], [694 - i * 4, 1316 + i * 4.4]], [8, 7, 6, 4.6]), i ? mixCol(arm, sk.dk, .12 * i) : arm, { sh: [0, 3, 2, rgba(sk.dk, .6)] });
  poFill(c, [[598, 1302], [620, 1295], [640, 1297], [652, 1304], [652, 1322], [630, 1326], [604, 1324]], arm, { sh: [0, 7, 6, rgba(sk.dk, .7)], hi: [0, -5, 4, rgba(sk.lt, .85)] });
  }
  poFill(c, poLimb([[622, 1298], [640, 1290], [656, 1290]], [10, 8, 6]), arm, { hi: [0, -3, 2, rgba(sk.lt, .8)] });

  // ---- the vanamala: a tulsi garland with gold beads, from his neck along his side to the knee
  if (PO_ANANTA.malaDrape) {
    // (the Dashavatar book) a thinner, shorter garland that hangs like a mala: from his neck the near strand sags
    // across his chest to the belly, turns and climbs back up to the left, slipping over the edge of his body (the far
    // strand is out of sight); the climb is clipped to the torso so it vanishes behind him
    const Gd = poAlong([[346, 1246], [376, 1262], [410, 1280], [446, 1292], [478, 1295], [502, 1286], [510, 1268], [500, 1248], [478, 1230]], 6);
    c.save();
    const clip = poPath(torso); clip.rect(0, 0, 440, 2000); c.clip(clip);
    limb(c, Gd, Gd.map(() => 7), '#5A7650', false);
    for (const [x, y] of poAlong(Gd, 4.5)) ellipse(c, x, y - 1, 2.6, 2.6, '#7E9C6A');
    poAlong(Gd, 40).forEach(([x, y], k) => { ellipse(c, x, y, 3.8, 3.8, ['#EDE6D4', '#9A2E36', '#E0901C'][k % 3]); ellipse(c, x, y, 1.4, 1.4, G.lt); });
    c.restore();
  } else {
  const Gm = [[350, 1246], [392, 1228], [450, 1232], [520, 1266], [580, 1278], [640, 1258], [690, 1234], [730, 1210]];
  limb(c, Gm, Gm.map(() => 12), '#5A7650', false);
  for (const [x, y] of poAlong(Gm, 5)) ellipse(c, x, y - 2, 3.8, 3.8, '#7E9C6A');
  for (const [x, y] of poAlong(Gm, 8)) ellipse(c, x + 1, y + 3, 1.7, 1.7, G.base);
  poAlong(Gm, 90).forEach(([x, y], k) => { ellipse(c, x, y, 5.5, 5.5, k % 2 ? '#EDE6D4' : '#9A2E36'); ellipse(c, x, y, 2, 2, G.lt); });
  }

  // ---- the neck and the head, the face lifted toward his feet
  poFill(c, [H(-20, 22), H(16, 44), [354, 1238], [340, 1252], [312, 1248], [300, 1238]], sk.base, { sh: [-8, 8, 10, rgba(sk.dk, .8)] });
  poAnantaHead(c);
  poFill(c, poLimb([H(-22, 16), [300, 1226], [312, 1262], [318, 1300]], [20, 18, 14, 6]), PO.hair);   // a lock over the shoulder
}

function poAnantaHead(c) {
  const sk = PO.skin, G = PO.gold, { x, y, r, s } = PO_ANANTA.head;
  c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s);
  // the profile: a long brow, a straight nose, full lips, a small round chin; the jaw; the back of the head
  const face = [[22, -50], [32, -34], [38, -18], [37, -10], [44, 3], [50, 12, 1], [44, 16], [45, 19.5], [42, 22.5, 1], [44.5, 26], [39.5, 30.5], [41.5, 37], [35, 45], [18, 48], [-4, 42], [-18, 28], [-40, 6], [-44, -20], [-34, -46], [-6, -56]];
  poFill(c, face, sk.base, { sh: [[-14, 6, 14, rgba(sk.dk, .7)], [0, 10, 6, rgba(sk.dk, .4)]], hi: [6, -4, 6, rgba(sk.lt, .7)] });
  // hair over the head and behind the ear
  poFill(c, [[28, -40], [10, -54], [-24, -54], [-44, -34], [-48, -4], [-40, 16], [-30, 8], [-22, -16], [-6, -30], [16, -34]], PO.hair);
  // the ear, a gold kundala
  poFill(c, [[-12, -12], [-4, -6], [-4, 8], [-10, 14], [-18, 6], [-18, -6]], sk.base, { sh: [-3, 3, 3, rgba(sk.dk, .7)] });
  poFill(c, [[-12, 14], [-3, 18], [0, 28], [-6, 38], [-15, 36], [-11, 28], [-16, 22]], G.base, { sh: [3, 2, 3, rgba(G.dk, .8)], hi: [-2, -2, 2, rgba(G.lt, .8)] });
  ellipse(c, -6, 28, 2.6, 2.6, PO.red);
  // the eye lowered: one long lid line; the brow; lips
  poLine(c, [[35, -6.5], [27, -3.8], [19, -4.4], [13, -7.5]], 'rgba(28,24,34,.85)', 1.8);
  poLine(c, [[37.5, -17], [29, -19.6], [19, -19], [11, -16.4]], 'rgba(28,24,34,.6)', 1.6);
  poFill(c, [[45, 19.5], [41, 18.8], [38.5, 21.8], [42.2, 22.4]], '#6E4A5E');
  poFill(c, [[42.2, 22.6], [38.5, 22], [40, 26], [44.4, 25.6]], '#7E5468');
  poLine(c, [[35, -24], [31, -40]], 'rgba(246,238,220,.9)', 2.6); poLine(c, [[34.2, -25], [30.8, -38]], PO.red, 1);   // the tilak, side on
  // the kirita: a gold band, a ring of lotus-petal points, a smaller tier, a finial; a spiked fan at the back
  c.save(); c.translate(-48, -34); c.rotate(-.15);
  for (let k = 0; k < 9; k++) { const a = -1.9 + k * .2; poLine(c, [[0, 0], [Math.cos(a) * 30, Math.sin(a) * 30]], G.base, 3); }
  c.restore();
  const band = [[34, -34], [32, -46], [-44, -36], [-44, -24]];
  poFill(c, [[36, -32, 1], [33, -52, 1], [26, -86], [10, -100], [-12, -104], [-32, -96], [-44, -74], [-46, -38, 1], [-44, -24, 1]], G.base, { sh: [-10, 0, 10, rgba(G.dk, .8)], hi: [8, -4, 8, rgba(G.lt, .8)] });
  // petal points: the outline of each petal in a darker gold, the rim between them cut in
  const pts = [[30, -50], [12, -54], [-8, -54], [-28, -50], [-42, -44]];
  pts.forEach(([px, py], k) => {
    const h = 34 - Math.abs(k - 1.5) * 4, P = [[px - 9, py + 4], [px - 7, py - h * .5], [px, py - h, 1], [px + 7, py - h * .5], [px + 9, py + 4]];
    poFill(c, P, G.base, { sh: [-4, 0, 4, rgba(G.dk, .7)], hi: [3, -3, 3, rgba(G.lt, .8)] });
    poLine(c, [[px - 5, py], [px - 4, py - h * .45], [px, py - h * .8], [px + 4, py - h * .45], [px + 5, py]], rgba(G.dk, .6), 1.2);
  });
  poFill(c, [[18, -88], [6, -112], [-6, -118], [-20, -110], [-30, -88]], G.base, { sh: [-6, 0, 6, rgba(G.dk, .8)], hi: [4, -3, 4, rgba(G.lt, .8)] });
  poFill(c, [[-1, -118], [6, -126], [0, -140, 1], [-8, -126]], G.base, { sh: [-3, 0, 3, rgba(G.dk, .8)] });
  ellipse(c, -1, -114, 3, 3, G.lt);
  poBorder(c, band.slice(0, 1).concat([[-6, -40], [-44, -30]]), 7);
  dhGem(c, 10, -44, 3.6, PO.red);
  c.restore();
}

// ---------- the lotus from his navel ----------
function poAnantaNavel(ph, bloom = 1) {
  return (c) => {
    const sw = Math.sin(ph * TAU) * 10, [nx, ny] = PO_ANANTA.navel, L = PO_ANANTA.lotus, top = [L[0] + sw, L[1] + Math.abs(sw) * .1];
    const S = [[nx, ny + 4], [nx + 26, ny - 70], [nx + 90 + sw * .2, ny - 170], [top[0] - 30 + sw * .5, top[1] + 150], [top[0], top[1] + 20]];
    poFill(c, poLimb(S, [9, 8.5, 8, 7, 7]), '#5E7444', { sh: [3, 0, 3, rgba(PO.leaf.dk, .8)] });
    // a leaf on the stalk
    c.save(); c.translate(nx + 66, ny - 140); c.rotate(-.9 + sw * .004);
    poFill(c, [[0, 0, 1], [36, -26], [96, -26], [130, -4, 1], [94, 16], [36, 16]], PO.leaf.base, { sh: [0, 10, 10, rgba(PO.leaf.dk, .8)], hi: [0, -8, 8, rgba(PO.leaf.lt, .7)],
      inside: () => poLine(c, [[4, -2], [124, -4]], rgba(PO.leaf.lt, .7), 1.4) });
    c.restore();
    poLotus(c, top[0], top[1] + 26, 60, easeOut(bloom));
  };
}
