// po_ardha.js: Ardhanarishvara in the Pothi style (needs pothi.js, po_cast.js, dhGem). Standing, facing us, one body
// split down the middle as in Shankaracharya's stotram: the right half (our left) Shiva, camphor-white, jata with the
// crescent and the Ganga, the half third eye and tripundra, a serpent, rudraksha, a tiger skin, the trishul with its
// damaru; the left half (our right) Parvati, champak-gold, her hair in a bun with jasmine, a jhumka, a red choli and
// sari with a gold border, a blue lily in her hand, alta on her foot. The eyes are lowered.
// Drawn about the navel at (0, 0), y down: the jata's top near y -580, the soles near y 620; place it with a transform.
//   poArdha(c, o): o.ph (0..1 loop phase), o.k (cycles per loop): the Ganga flows, the damaru swings, the pallu stirs,
//   the snake's head sways (o.flick 0..1 shows its tongue).
const AR = {
  shiva: { base: '#C3C8D6', lt: '#E2E5EE', dk: '#8C92AA' },
  uma: { base: '#D8A766', lt: '#EEC88E', dk: '#A47436' },
  tiger: { base: '#C99140', lt: '#E2B464', dk: '#8E5E22', stripe: '#33261C' },
  sari: { base: '#9E2C34', lt: '#C2464A', dk: '#6A1A22' },
  jata: '#3E2E26', snake: { base: '#4C625A', lt: '#7A9284', dk: '#2C3C36', belly: '#D9C9A0' },
  lily: { base: '#6E70AE', lt: '#9A9CD0', dk: '#46487E' }
};
const arMir = P => P.map(([x, y, k]) => k ? [-x, y, k] : [-x, y]);
// a closed shape from one side's outline (top on the midline .. bottom on the midline) and the midline back up
const arHalf = (side, sgn) => { const P = sgn < 0 ? arMir(side) : side; return [[0, P[0][1], 1], ...P.slice(1, -1), [0, P[P.length - 1][1], 1]]; };

function poArdha(c, o = {}) {
  const Sv = AR.shiva, U = AR.uma, G = PO.gold, T = AR.tiger, Sr = AR.sari, ph = (o.ph || 0) * TAU, k = o.k || 2;
  const half = (side, sgn, col, opt) => poFill(c, arHalf(side, sgn), col.base, Object.assign({ sh: [sgn * 12, 6, 12, rgba(col.dk, .8)], hi: [-sgn * 8, -6, 8, rgba(col.lt, .7)] }, opt || {}));

  // ---- the Ganga: a stream from the top of the jata, arcing out and falling behind his shoulder
  const GP = [[-28, -612], [-74, -650], [-134, -642], [-176, -586], [-202, -500], [-218, -400], [-226, -300]];
  poLine(c, GP, 'rgba(160,196,214,.45)', 12); poLine(c, GP, 'rgba(214,234,240,.8)', 5);
  c.save(); c.setLineDash([18, 26]); c.lineDashOffset = -ph * k * 88; poLine(c, GP, 'rgba(255,255,255,.95)', 3); c.restore();
  for (let i = 0; i < 6; i++) { const q = frac(ph * k + i / 6); ellipse(c, -224 + Math.sin(i * 2.1) * 10, -300 + q * 70, 3 * (1 - q), 4 * (1 - q), `rgba(200,226,236,${.8 * (1 - q)})`); }

  // ---- the trishul, standing beside him, the damaru tied under the prongs
  const tx = -232;
  poLine(c, [[tx, 630], [tx, -560]], G.dk, 11); poLine(c, [[tx, 630], [tx, -560]], G.base, 7); poLine(c, [[tx - 2, 630], [tx - 2, -560]], rgba(G.lt, .8), 2);
  poFill(c, [[tx - 5, -556, 1], [tx - 4, -620], [tx, -664, 1], [tx + 4, -620], [tx + 5, -556, 1]], '#B9BCC6', { sh: [3, 0, 3, 'rgba(90,92,110,.8)'] });
  for (const s of [-1, 1]) poFill(c, [[tx + s * 4, -562, 1], [tx + s * 34, -566], [tx + s * 42, -600], [tx + s * 36, -632, 1], [tx + s * 30, -600], [tx + s * 22, -576], [tx + s * 4, -572, 1]], '#B9BCC6', { sh: [s * 3, 3, 3, 'rgba(90,92,110,.8)'] });
  poBorder(c, [[tx - 22, -560], [tx + 22, -560]], 8);
  const sw = Math.sin(ph * k) * .35;
  c.save(); c.translate(tx, -544); c.rotate(sw);
  poLine(c, [[0, 0], [0, 40]], '#8A2A2A', 2.4);
  c.save(); c.translate(0, 58);
  poFill(c, [[-14, -18, 1], [14, -18, 1], [3, 0], [14, 18, 1], [-14, 18, 1], [-3, 0]], '#A9764A', { sh: [5, 0, 4, 'rgba(90,50,30,.8)'], hi: [-4, 0, 3, 'rgba(230,190,140,.7)'] });
  poLine(c, [[-14, -18], [14, -18]], '#E8DCC0', 3); poLine(c, [[-14, 18], [14, 18]], '#E8DCC0', 3);
  c.restore(); c.restore();

  // ---- jata (his half) and her hair (her half) behind the head; his locks fall behind his shoulder
  const HS = 1.2, headIn = () => { c.save(); c.translate(0, -330); c.scale(HS, HS); c.translate(0, 330); };
  headIn();
  for (let i = 0; i < 4; i++) poFill(c, poLimb([[-40 - i * 4, -430], [-62 - i * 8, -380], [-82 - i * 10, -330], [-96 - i * 12, -286]], [16, 14, 11, 4]), AR.jata, { hi: [-3, 0, 3, 'rgba(120,96,80,.45)'] });
  poFill(c, [[0, -446, 1], [-26, -456], [-48, -440], [-58, -412], [-62, -440], [-62, -488], [-52, -528], [-34, -556], [-14, -572], [0, -574, 1]], AR.jata,
    { hi: [-6, -4, 6, 'rgba(130,100,80,.5)'], sh: [6, 0, 6, 'rgba(10,6,4,.5)'],
      inside: () => { for (let y = -560; y < -430; y += 12) poLine(c, [[-66, y + 6], [-30, y], [2, y + 4]], 'rgba(120,92,72,.55)', 2.2); } });
  const hair = [[0, -446, 1], [26, -452], [44, -438], [50, -414], [52, -392], [58, -394], [62, -426], [56, -458], [38, -476], [16, -482], [0, -482, 1]];
  poFill(c, hair, PO.hair, { hi: [4, -4, 5, 'rgba(110,96,96,.45)'] });
  // her bun with a gold ring and a string of jasmine
  ellipse(c, 34, -498, 30, 24, PO.hair); poEdge(c, (() => { const p = new Path2D(); p.ellipse(34, -498, 30, 24, 0, 0, TAU); return p; })(), -4, -4, 4, 'rgba(110,96,96,.45)');
  poBorder(c, [[10, -486], [34, -478], [58, -488]], 6);
  poDots(c, [[6, -500], [16, -520], [36, -526], [56, -516], [64, -498]], 4, 8, '#F4EFE2', false);
  // the crescent on his jata
  c.save(); c.translate(-46, -520); c.rotate(-.5);
  const mo = new Path2D(); mo.arc(0, 0, 20, 0, TAU); const cut = new Path2D(); cut.arc(8, -5, 17, 0, TAU);
  c.save(); c.clip(mo); c.fillStyle = '#F4F1E4'; c.fill(mo); c.globalCompositeOperation = 'destination-out'; c.fill(cut); c.restore();
  c.restore();
  glow(c, -46, -520, 50, '#E8F0FF', .3 + .1 * Math.sin(ph * k), 'source-over');
  c.restore();

  // ---- his arm, raised to grip the trishul (behind the body)
  poFill(c, poLimb([[-128, -276], [-168, -214], [-196, -150]], [58, 50, 42]), Sv.base, { sh: [-10, 4, 10, rgba(Sv.dk, .85)], hi: [8, -4, 8, rgba(Sv.lt, .8)] });
  poFill(c, poLimb([[-196, -150], [-208, -200], [-222, -246]], [42, 36, 30]), Sv.base, { sh: [-8, 0, 8, rgba(Sv.dk, .85)], hi: [8, 0, 6, rgba(Sv.lt, .8)] });
  poFill(c, [[-244, -276], [-226, -284], [-210, -276], [-206, -252], [-216, -240], [-238, -242], [-248, -256]], Sv.base, { sh: [-5, 4, 5, rgba(Sv.dk, .85)], hi: [4, -3, 4, rgba(Sv.lt, .8)],
    inside: () => { for (const y of [-272, -264, -256]) poLine(c, [[-246, y], [-226, y - 1]], rgba(Sv.dk, .55), 1.3); } });
  poDots(c, [[-212, -236], [-222, -232], [-232, -232]], 4, 7, '#6A3E2A', false);           // a rudraksha bracelet
  poDots(c, [[-150, -244], [-160, -232], [-172, -224]], 4.4, 8, '#6A3E2A', false);

  // ---- her pallu hanging behind her arm, stirring
  const pw = Math.sin(ph * k + .8) * 8;
  poFill(c, [[110, -290], [138, -250], [154, -150], [162 + pw * .5, -40], [170 + pw, 60, 1], [140 + pw, 66, 1], [128, -40], [118, -150], [100, -240]], Sr.base, { sh: [10, 0, 10, rgba(Sr.dk, .8)], hi: [-6, 0, 6, rgba(Sr.lt, .5)] });
  poBorder(c, [[140 + pw, 66], [170 + pw, 60]], 7);

  // ---- the torso: his broad half and her slender half meeting on the midline
  half([[0, -324], [-24, -318], [-64, -306], [-110, -292], [-138, -272], [-140, -246], [-118, -226], [-110, -180], [-100, -120], [-84, -60], [-86, -16], [0, -12]], 1, Sv,
    { sh: [-12, 6, 12, rgba(Sv.dk, .8)], hi: [8, -6, 8, rgba(Sv.lt, .7)],
      inside: () => { poFold(c, [[-92, -206], [-60, -188], [-14, -192]], 7, rgba(Sv.dk, .5), 6); poFold(c, [[-40, -140], [-28, -100]], 4, rgba(Sv.dk, .35), 4); poFold(c, [[-90, -260], [-50, -270]], 6, rgba(Sv.lt, .7), 5); } });
  half([[0, -324], [22, -318], [56, -306], [96, -292], [120, -276], [124, -252], [106, -230], [106, -196], [98, -164], [76, -112], [60, -60], [64, -16], [0, -12]], 1, U,
    { sh: [12, 6, 12, rgba(U.dk, .8)], hi: [-8, -6, 8, rgba(U.lt, .7)] });
  ellipse(c, 0, -36, 3, 4.2, rgba(U.dk, .9));                                                // the navel
  // her choli, red with a gold edge, over the curve of her breast
  poFill(c, [[0, -262, 1], [36, -270], [76, -264], [104, -240], [108, -200], [98, -168], [64, -156], [28, -164], [0, -170, 1]], Sr.base,
    { sh: [[10, 10, 10, rgba(Sr.dk, .8)], [0, 14, 8, rgba(Sr.dk, .5)]], hi: [-6, -10, 10, rgba(Sr.lt, .7)], inside: () => poFold(c, [[30, -230], [60, -222], [86, -206]], 8, rgba(Sr.lt, .55), 8) });
  poBorder(c, [[0, -170], [28, -164], [64, -156], [98, -168]], 6);
  // the pallu across her: from her waist up over her shoulder
  poFill(c, [[2, -14, 1], [4, -110], [40, -200], [86, -272], [116, -296], [126, -276], [100, -230], [62, -150], [36, -60], [30, -14, 1]], Sr.base,
    { sh: [8, 0, 8, rgba(Sr.dk, .8)], hi: [-6, 0, 6, rgba(Sr.lt, .55)],
      inside: () => { for (const [x, y] of [[16, -60], [30, -120], [56, -180], [86, -240], [22, -100]]) ellipse(c, x, y, 2.6, 3.4, G.base); } });
  poBorder(c, [[30, -14], [36, -60], [62, -150], [100, -230], [126, -276]], 6);
  // a girdle on her half, a cord on his
  poBorder(c, [[0, -14], [36, -16], [64, -18]], 7);
  poLine(c, [[0, -14], [-44, -16], [-86, -18]], '#6A3E2A', 4);

  // ---- below the waist: his tiger skin to the knee, her sari to the ankle
  const tg = [[0, -14, 1], [-86, -18], [-96, 40], [-108, 140], [-116, 240], [-124, 318], [-104, 306], [-90, 330], [-70, 312], [-52, 336], [-34, 314], [-14, 338], [0, 320, 1]];
  // his leg below the knee
  poFill(c, poLimb([[-72, 300], [-74, 380], [-70, 470], [-66, 572]], [64, 58, 42, 32]), Sv.base, { sh: [-10, 0, 10, rgba(Sv.dk, .85)], hi: [8, 0, 8, rgba(Sv.lt, .8)] });
  poFill(c, [[-84, 566], [-50, 566], [-44, 596], [-52, 616], [-96, 620], [-116, 612], [-112, 598]], Sv.base, { sh: [0, 6, 5, rgba(Sv.dk, .85)], hi: [0, -4, 4, rgba(Sv.lt, .8)],
    inside: () => { for (let i = 0; i < 4; i++) poLine(c, [[-110 + i * 10, 612], [-108 + i * 10, 618]], rgba(Sv.dk, .6), 1.2); } });
  poFill(c, tg, T.base, { sh: [-12, 8, 12, rgba(T.dk, .8)], hi: [8, -4, 8, rgba(T.lt, .7)],
    inside: () => { const R = lcg(4); for (let y = 20; y < 330; y += 34) for (let x = -108 + (y % 68 ? 14 : 0); x < 0; x += 36) { const l = 22 + R() * 12, yy = y + R() * 10, a = -.25 + R() * .2; c.save(); c.translate(x + R() * 8, yy); c.rotate(a); poFill(c, [[-l / 2, 0, 1], [-l / 6, -3.4], [l / 2, -1, 1], [0, 2.2]], T.stripe, { alpha: .85 }); c.restore(); } } });
  // the tiger's paw hanging at his side
  poFill(c, poLimb([[-118, 250], [-128, 300], [-132, 350]], [22, 18, 16]), T.base, { sh: [-4, 0, 4, rgba(T.dk, .8)] });
  for (let i = 0; i < 3; i++) poLine(c, [[-138 + i * 5, 356], [-140 + i * 5, 366]], '#EDE4D0', 2);
  // her sari: pleats down the front, a gold border at the hem
  const sari = [[0, -14, 1], [64, -18], [92, 40], [112, 160], [126, 300], [138, 450], [150, 588, 1], [0, 596, 1]];
  poFill(c, [[66, 570], [100, 570], [112, 598], [102, 616], [62, 618], [48, 604]], U.base, { sh: [0, 6, 5, rgba(U.dk, .85)],
    inside: () => { poLine(c, [[48, 610], [104, 614]], '#A8303A', 6); for (let i = 0; i < 4; i++) poLine(c, [[90 + i * 6, 606], [92 + i * 6, 616]], rgba(U.dk, .6), 1.2); } });
  poDots(c, [[56, 576], [80, 572], [104, 576]], 3, 7);                                       // anklet
  poFill(c, sari, Sr.base, { sh: [12, 8, 12, rgba(Sr.dk, .8)], hi: [-8, 0, 8, rgba(Sr.lt, .55)],
    inside: () => {
      for (let i = 0; i < 5; i++) poFold(c, [[8 + i * 10, 60], [10 + i * 14, 300], [12 + i * 18, 590]], 4, rgba(Sr.dk, .55), 3);
      poFold(c, [[70, 40], [96, 300], [118, 580]], 8, rgba(Sr.lt, .4), 8);
      const R = lcg(9); for (let i = 0; i < 18; i++) ellipse(c, 20 + R() * 100, R() * 560, 2.6, 3.4, G.base);
    } });
  poBorder(c, [[0, 572], [70, 574], [150, 584]], 12);
  poBorder(c, [[60, 0], [70, 300], [78, 574]], 6);

  // ---- her arm, hanging, a blue lily held up beside her
  poFill(c, poLimb([[116, -270], [146, -200], [164, -130]], [48, 40, 34]), U.base, { sh: [8, 0, 8, rgba(U.dk, .85)], hi: [-6, 0, 6, rgba(U.lt, .8)] });
  poFill(c, [[100, -282], [128, -282], [148, -246], [140, -232], [112, -238]], Sr.base, { sh: [6, 4, 6, rgba(Sr.dk, .8)] });
  poBorder(c, [[114, -238], [140, -232]], 5);
  poFill(c, poLimb([[164, -130], [170, -70], [172, -14]], [34, 28, 24]), U.base, { sh: [6, 0, 6, rgba(U.dk, .85)], hi: [-5, 0, 5, rgba(U.lt, .8)] });
  poBorder(c, [[146, -164], [162, -156], [180, -160]], 7);
  for (const y of [-34, -26]) poBorder(c, [[160, y], [172, y + 2], [184, y]], 5);
  poDots(c, [[160, -18], [184, -18]], 2.4, 5, PO.red, false);
  // the lily's stalk from her fingers, the flower at her shoulder
  const ls = Math.sin(ph * k + 2) * 6;
  poLine(c, [[176, 8], [190, -60], [196 + ls * .5, -140], [200 + ls, -200]], PO.leaf.dk, 4);
  poFill(c, [[160, -14], [184, -16], [194, 0], [190, 22], [172, 28], [158, 16]], U.base, { sh: [4, 4, 5, rgba(U.dk, .85)], hi: [-3, -3, 3, rgba(U.lt, .8)],
    inside: () => { for (const y of [0, 8, 16]) poLine(c, [[176, y], [192, y + 1]], rgba(U.dk, .55), 1.2); } });
  poLotus(c, 200 + ls, -200, 40, .8, AR.lily);

  // ---- the neck and the head
  half([[0, -350], [-22, -350], [-24, -320], [-30, -306], [0, -306]], 1, Sv, { sh: [-6, 6, 8, rgba(Sv.dk, .8)] });
  half([[0, -350], [22, -350], [24, -320], [30, -306], [0, -306]], 1, U, { sh: [6, 6, 8, rgba(U.dk, .8)] });
  for (const y of [-334, -322]) { poLine(c, [[-16, y], [0, y + 3]], rgba(Sv.dk, .5), 1.4); poLine(c, [[0, y + 3], [16, y]], rgba(U.dk, .5), 1.4); }
  headIn(); poArdhaHead(c); c.restore();
  // necklaces: rudraksha on his half, gold on hers, meeting at a pendant
  poDots(c, [[-24, -312], [-30, -276], [-18, -240], [0, -226]], 4.6, 9, '#6A3E2A', false);
  poDots(c, [[22, -314], [28, -290], [16, -254], [0, -240]], 3.2, 7);
  poDots(c, [[24, -312], [36, -270], [22, -228], [0, -214]], 2.6, 6.5, '#F2EEE2', false);
  dhGem(c, 0, -226, 7, PO.red);

  // ---- the serpent round his neck, its hood raised by his shoulder
  const fl = o.flick || 0, hs = Math.sin(ph * k + 1.2) * .08;
  const sn = [[-2, -318], [-26, -300], [-56, -292], [-84, -296], [-104, -314], [-110, -342], [-106, -362]];
  poFill(c, poLimb(sn, [10, 11, 11, 11, 10, 9, 8]), AR.snake.base, { sh: [0, 3, 3, rgba(AR.snake.dk, .85)], hi: [0, -2, 2, rgba(AR.snake.lt, .8)],
    inside: () => { for (const [x, y] of poAlong(sn, 9)) ellipse(c, x, y + 1, 2, 1.4, rgba(AR.snake.dk, .5)); } });
  c.save(); c.translate(-104, -372); c.rotate(hs);
  poFill(c, [[0, 12], [-9, 4], [-15, -8], [-13, -22], [-6, -30], [0, -32], [6, -30], [13, -22], [15, -8], [9, 4]], AR.snake.base, { sh: [0, 5, 5, rgba(AR.snake.dk, .85)], hi: [0, -3, 3, rgba(AR.snake.lt, .8)],
    inside: () => { poFill(c, [[0, 10], [-6, 2], [-8, -10], [0, -18], [8, -10], [6, 2]], AR.snake.belly, { alpha: .85 }); poLine(c, [[-4, -8], [0, -4], [4, -8]], rgba(AR.snake.dk, .7), 1.2); } });
  ellipse(c, 0, -32, 5.5, 4.6, AR.snake.base); ellipse(c, -2.4, -33, 1.2, 1.2, '#1A1A1A'); ellipse(c, 2.4, -33, 1.2, 1.2, '#1A1A1A');
  if (fl > 0) { c.strokeStyle = '#8E2A30'; c.lineWidth = 1.8; c.beginPath(); c.moveTo(0, -34); c.lineTo(0, -34 - 12 * fl); c.moveTo(0, -34 - 12 * fl); c.lineTo(-3, -40 - 12 * fl); c.moveTo(0, -34 - 12 * fl); c.lineTo(3, -40 - 12 * fl); c.stroke(); }
  c.restore();
}

// the face, frontal: his half and her half on one oval; eyes lowered
function poArdhaHead(c) {
  const Sv = AR.shiva, U = AR.uma, G = PO.gold;
  const FH = [[0, -448, 1], [22, -446], [38, -434], [45, -412], [46, -390], [42, -368], [35, -350], [24, -337], [12, -330], [0, -328, 1]];
  poFill(c, arHalf(FH, -1), Sv.base, { sh: [[-12, 4, 12, rgba(Sv.dk, .75)], [0, 8, 6, rgba(Sv.dk, .35)]], hi: [6, -4, 8, rgba(Sv.lt, .7)] });
  poFill(c, arHalf(FH, 1), U.base, { sh: [[12, 4, 12, rgba(U.dk, .75)], [0, 8, 6, rgba(U.dk, .35)]], hi: [-6, -4, 8, rgba(U.lt, .7)] });
  // ears: his with a big ivory ring, hers with a gold jhumka
  poFill(c, [[-44, -404], [-54, -402], [-56, -384], [-50, -370], [-44, -372]], Sv.base, { sh: [-3, 2, 3, rgba(Sv.dk, .8)] });
  c.save(); c.strokeStyle = '#EDE4CC'; c.lineWidth = 4; c.beginPath(); c.arc(-50, -358, 10, 0, TAU); c.stroke(); c.strokeStyle = 'rgba(150,130,100,.6)'; c.lineWidth = 1.2; c.beginPath(); c.arc(-50, -358, 12, .3, 2.6); c.stroke(); c.restore();
  poFill(c, [[44, -404], [54, -402], [56, -384], [50, -370], [44, -372]], U.base, { sh: [3, 2, 3, rgba(U.dk, .8)] });
  poFill(c, [[44, -368], [56, -368], [62, -340], [38, -340]], G.base, { sh: [4, 0, 4, rgba(G.dk, .8)], hi: [-3, -2, 3, rgba(G.lt, .8)] });
  poDots(c, [[38, -338], [50, -334], [62, -338]], 2.4, 5, '#F2EEE2', false);
  ellipse(c, 50, -372, 4, 4, G.base);
  // brows
  poLine(c, [[-6, -409], [-19, -414], [-33, -410]], 'rgba(44,32,30,.75)', 2.4);
  poLine(c, [[6, -409], [19, -414], [33, -410]], 'rgba(44,32,30,.75)', 2.2);
  // eyes lowered: a long lid line, lashes, the kajal winged on her side
  for (const s of [-1, 1]) {
    const x = s * 19, P = [[x - s * 14, -392], [x - s * 6, -387.5], [x + s * 4, -387.5], [x + s * 14, -391]];
    poFill(c, [[x - s * 14, -392], [x - s * 5, -394.5], [x + s * 6, -394.5], [x + s * 14, -391], [x + s * 4, -388.5], [x - s * 6, -388.5]], s < 0 ? rgba(Sv.dk, .5) : rgba(U.dk, .45));
    poLine(c, P, 'rgba(30,20,22,.92)', 2.2);
    if (s > 0) poLine(c, [[x + 13, -391], [x + 19, -394]], 'rgba(30,20,22,.85)', 1.6);
    poLine(c, [[x - s * 10, -398], [x + s * 10, -398]], s < 0 ? rgba(Sv.dk, .4) : rgba(U.dk, .4), 1.4);
  }
  // the nose: a soft shade down one side, the nostrils, a light on the tip
  c.save(); c.filter = 'blur(2px)'; poLine(c, [[4, -404], [6, -386], [8, -372]], rgba(U.dk, .55), 3); c.restore();
  poLine(c, [[-7, -368], [-3, -365.5], [0, -366]], 'rgba(60,40,40,.6)', 1.4); poLine(c, [[7, -368], [3, -365.5], [0, -366]], 'rgba(60,40,40,.6)', 1.4);
  // lips: his half a dusky rose, hers red
  poFill(c, [[0, -354.5], [-5, -356.5], [-12, -352.5], [-6, -349.5], [0, -349.8]], '#9A6070');
  poFill(c, [[0, -354.5], [5, -356.5], [12, -352.5], [6, -349.5], [0, -349.8]], '#B23A44');
  poFill(c, [[0, -349.6], [-10, -351.5], [-6, -345], [0, -343.5]], '#A87080');
  poFill(c, [[0, -349.6], [10, -351.5], [6, -345], [0, -343.5]], '#C04A50');
  poLine(c, [[-12, -352.5], [0, -350], [12, -352.5]], 'rgba(70,30,36,.7)', 1.1);
  // his tripundra, the third eye on the parting line, the sindoor in her parting
  for (const y of [-432, -426, -420]) poLine(c, [[-34, y + 1], [-18, y], [-4, y]], 'rgba(250,248,240,.95)', 2.2);
  poFill(c, [[0, -436, 1], [-3, -426], [0, -414, 1], [3, -426]], '#7A2228');
  poLine(c, [[2, -449], [2, -480]], '#B0242E', 2.6);
  ellipse(c, 0, -440, 2.4, 2.4, '#B0242E');
  // a gold tikka on her half of the brow line, a band where the jata starts on his
  poBorder(c, [[-2, -448], [-26, -456], [-48, -440]], 5);
}
