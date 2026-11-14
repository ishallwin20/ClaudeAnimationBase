// sc_ganesha.js: Bal Ganesha for the Scribble style (load after scribble.js and sc_cast.js), and his set.
//
// Bal Ganesha sits cross-legged on a pink lotus on a lily pad, front view, eyes closed, hands in gyan mudra on his
// knees. Salmon-pink skin (the Painted Bal Bappa's colours), big fan ears, the trunk curling to his left (screen right),
// two tusks with his left one (screen right) broken (Ekadanta), a small gold mukut, a red tilak, the sacred thread, an
// orange dhoti with a gold band. scGanesha() → { earL, earR, legs, torso, head, trunk }, pivots in SCG (design px,
// frame 1080 × 1920). The ears are their own parts so they can flutter while he hums; the trunk turns about its root.
//   scLotus() → { back, front, pad }: the lotus seat (petals behind him, petals in front) and the lily pad under it
//   scBee() → { body, wings }: a honeybee, drawn round (0, 0); scBeeDraw(c, P, t, x, y, ang, flap) lays one down
//   scPond(c, o): a lotus pond in the morning, far out of focus (o: { w, h, dy } as scHimalaya)
const SCG = { x: 540, ground: 1650, lap: [540, 1590], neck: [540, 1255], earL: [420, 1050], earR: [660, 1050], trunkRoot: [540, 1135] };
const SC_GAN = { skin: '#F4876A', dk: '#D65C42', lt: '#FFB79E', earIn: '#EE6A50', ink: '#5A2A1A',
  dhoti: '#F59A3C', dhotiDk: '#C9681E', dhotiLt: '#FFC77A', gold: '#EDB838', goldDk: '#A97818', goldLt: '#FFE48A',
  tusk: '#FBEBD3', tuskDk: '#D9C2A0', red: '#D6332A' };
const scGanCols = () => [SC_GAN.lt, SC_GAN.skin, SC_GAN.dk];

function scGanesha() {
  const G = SC_GAN, X = SCG.x;
  const ear = (side) => scPart('bg-ear' + side, side < 0 ? [170, 900, 280, 330] : [630, 900, 280, 330], [{
    len: 28, w: 1.3, dens: 1.5, hair: .12, outline: 5, under: .9, underBlur: 2.5, jit: .14, lt: .18, dk: .06, follow: 1.3, curl: .45, inkCol: '#7A3220',
    flow: (x, y) => Math.atan2(y - 1060, x - X) + Math.PI / 2,
    draw(c) {   // a big fan ear, the inside pinker, a soft fold along the root
      const cx = X + side * 228, cy = 1078;
      c.save(); c.beginPath();
      c.moveTo(X + side * 110, 960);
      c.bezierCurveTo(X + side * 200, 905, X + side * 345, 930, X + side * 360, 1040);
      c.bezierCurveTo(X + side * 372, 1140, X + side * 330, 1205, X + side * 250, 1215);
      c.bezierCurveTo(X + side * 190, 1220, X + side * 150, 1180, X + side * 110, 1150);
      c.closePath();
      const g = c.createRadialGradient(cx - side * 40, cy - 60, 10, cx, cy, 190); g.addColorStop(0, G.lt); g.addColorStop(.55, G.skin); g.addColorStop(1, G.dk);
      c.fillStyle = g; c.fill(); c.restore();
      c.save(); c.globalAlpha = .9; c.beginPath(); c.ellipse(cx + side * 10, cy + 10, 92, 112, side * .25, 0, TAU);
      const g2 = c.createRadialGradient(cx, cy, 10, cx, cy, 120); g2.addColorStop(0, '#FF9C9C'); g2.addColorStop(1, '#E86A6E'); c.fillStyle = g2; c.fill(); c.restore();
    },
    ink(c, rnd) { scInk(c, [[X + side * 150, 1000], [X + side * 175, 1080], [X + side * 160, 1150]], 1.8, '#9A4030', rnd, { alpha: .45 }); },
  }], { seed: side < 0 ? 21 : 23 });

  const legs = scPart('bg-legs', [260, 1520, 560, 170], [{
    len: 46, w: 1.5, dens: 1.6, flow: 0, follow: 1, hair: .25, outline: 9, curl: .45, inkCol: '#7A3A10',
    draw(c) {   // the dhoti over his crossed legs
      scBall(c, 395, 1598, 132, 62, [G.dhotiLt, G.dhoti, G.dhotiDk], -.06);
      scBall(c, 685, 1598, 132, 62, [G.dhotiLt, G.dhoti, G.dhotiDk], .06);
      limb(c, [[318, 1622], [470, 1634], [640, 1626]], [62, 60, 52], G.dhoti);
      limb(c, [[762, 1618], [610, 1632], [440, 1622]], [62, 60, 52], G.dhoti);
      c.save(); c.globalAlpha = .5; limb(c, [[330, 1606], [470, 1620], [600, 1614]], [14, 16, 10], G.dhotiLt); c.restore();
      const g = c.createLinearGradient(0, 1600, 0, 1668); g.addColorStop(0, 'rgba(150,60,10,0)'); g.addColorStop(1, 'rgba(130,50,8,.5)');
      c.save(); c.globalCompositeOperation = 'source-atop'; c.fillStyle = g; c.fillRect(250, 1580, 600, 110); c.restore();
    },
    ink(c, rnd) {   // the gold border along the hem
      scInk(c, [[300, 1640], [400, 1656], [520, 1656], [640, 1650], [770, 1636]], 5, G.gold, rnd, { alpha: .85 });
      scInk(c, [[300, 1646], [400, 1662], [520, 1662], [640, 1656], [770, 1642]], 1.4, G.goldDk, rnd, { alpha: .6 });
    },
  }, {
    len: 18, w: 1.3, dens: 1.8, flow: .3, hair: .15, outline: 2, under: .95, inkCol: '#8A3A20',
    draw(c) {   // his feet, soles up where the shins cross
      scBall(c, 458, 1610, 36, 22, scGanCols(), -.35);
      scBall(c, 622, 1608, 36, 22, scGanCols(), .35);
    },
    ink(c, rnd) {
      [[432, 1600], [438, 1592], [446, 1588]].forEach(([x, y]) => scDot(c, x, y, 2.4, G.dk, rnd));
      [[648, 1598], [642, 1590], [634, 1586]].forEach(([x, y]) => scDot(c, x, y, 2.4, G.dk, rnd));
      // anklets
      scInk(c, [[478, 1596], [492, 1612], [488, 1628]], 3.2, G.gold, rnd, { alpha: .85 }); scInk(c, [[602, 1594], [588, 1610], [592, 1626]], 3.2, G.gold, rnd, { alpha: .85 });
    },
  }], { seed: 25 });

  const torso = scPart('bg-torso', [290, 1180, 500, 460], [{
    len: 28, w: 1.3, dens: 1.5, hair: .12, outline: 5, under: .9, underBlur: 2.5, jit: .14, lt: .18, dk: .06, flow: (x, y) => Math.atan2(y - 1452, x - 540) + Math.PI / 2, follow: 1.2, curl: .45, inkCol: '#7A3220',
    draw(c) {   // the chest and the round pot belly
      scBall(c, 540, 1318, 140, 100, scGanCols());
      scBall(c, 540, 1452, 168, 150, scGanCols());
      c.save(); c.globalAlpha = .45; scBall(c, 505, 1420, 70, 66, ['#FFD9C8', G.lt, G.skin]); c.restore();
    },
    ink(c, rnd) {
      scInk(c, [[530, 1470], [540, 1482], [552, 1472]], 2.4, '#A8402A', rnd, { alpha: .7 });   // his navel
      // the sacred thread: over his left shoulder (screen right) down to his right hip, "/"
      scInk(c, [[648, 1240], [612, 1320], [560, 1420], [470, 1540]], 4.5, '#9A6A1C', rnd, { alpha: .45, jit: 1.2 });
      scInk(c, [[646, 1238], [610, 1318], [558, 1418], [468, 1538]], 2.6, '#FFF0C0', rnd, { alpha: .95, jit: 1 });
    },
  }, {
    len: 24, w: 1.4, dens: 1.6, flow: 0, follow: .8, hair: .2, outline: 3, inkCol: '#6A3008',
    draw(c) {   // the dhoti's waist under the belly, a gold band, the pleats falling between the knees
      c.save(); c.beginPath(); c.moveTo(398, 1540); c.quadraticCurveTo(540, 1600, 682, 1540); c.lineTo(690, 1590); c.quadraticCurveTo(540, 1640, 390, 1590); c.closePath();
      c.fillStyle = G.dhoti; c.fill(); c.restore();
      c.save(); c.beginPath(); c.moveTo(510, 1580); c.lineTo(570, 1580); c.quadraticCurveTo(584, 1620, 590, 1650); c.quadraticCurveTo(540, 1660, 490, 1650); c.quadraticCurveTo(496, 1620, 510, 1580); c.closePath();
      const g = c.createLinearGradient(500, 0, 590, 0); g.addColorStop(0, G.dhotiLt); g.addColorStop(.6, G.dhoti); g.addColorStop(1, G.dhotiDk); c.fillStyle = g; c.fill(); c.restore();
      c.save(); c.strokeStyle = G.gold; c.lineWidth = 14; c.lineCap = 'round'; c.beginPath(); c.moveTo(400, 1546); c.quadraticCurveTo(540, 1604, 680, 1546); c.stroke(); c.restore();
    },
    ink(c, rnd) { [520, 540, 560].forEach(x => scInk(c, [[x, 1590], [x - 2, 1622], [x, 1650]], 1.3, '#9A4A10', rnd, { alpha: .5 })); },
  }, {
    len: 28, w: 1.3, dens: 1.5, hair: .12, outline: 5, under: .9, underBlur: 2.5, jit: .14, lt: .18, dk: .06, follow: 1.5, curl: .45, inkCol: '#7A3220',
    draw(c) {   // chubby arms down his sides to his knees
      limb(c, [[420, 1270], [372, 1350], [348, 1450], [348, 1530]], [76, 68, 58, 48], G.dk);
      limb(c, [[660, 1270], [708, 1350], [732, 1450], [732, 1530]], [76, 68, 58, 48], G.dk);
      limb(c, [[414, 1270], [366, 1350], [342, 1448], [344, 1526]], [62, 54, 46, 38], G.skin);
      limb(c, [[654, 1270], [702, 1350], [726, 1448], [726, 1526]], [62, 54, 46, 38], G.skin);
      c.save(); c.globalAlpha = .6; limb(c, [[404, 1280], [364, 1356], [342, 1430]], [18, 16, 10], G.lt); c.restore();
    },
    ink(c, rnd) {   // gold armlets and bracelets
      [[1, [[392, 1318], [420, 1334], [440, 1322]], [[328, 1500], [350, 1512], [370, 1502]]], [-1, [[688, 1318], [660, 1334], [640, 1322]], [[752, 1500], [730, 1512], [710, 1502]]]].forEach(([, a, b]) => {
        scInk(c, a, 6, G.gold, rnd, { alpha: .9 }); scInk(c, b, 6, G.gold, rnd, { alpha: .9 });
      });
    },
  }, {
    len: 20, w: 1.3, dens: 1.8, flow: 0, follow: 1, hair: .15, outline: 2, under: .95, inkCol: '#8A3A20',
    draw(c) {   // gyan mudra on each knee
      [[1, 346], [-1, 734]].forEach(([m, x]) => {
        scBall(c, x, 1560, 44, 30, scGanCols());
        c.save(); c.strokeStyle = G.skin; c.lineWidth = 11; c.beginPath(); c.ellipse(x + m * 14, 1534, 14, 12, 0, 0, TAU); c.stroke(); c.restore();
        [[-46, -4, -.2], [-44, 10, .12], [-38, 23, .45]].forEach(([dx, dy, a]) => {
          c.save(); c.translate(x + m * dx, 1560 + dy); c.rotate(m > 0 ? a : -a); scBall(c, 0, 0, 16, 8, scGanCols()); c.restore();
        });
      });
    },
    ink(c, rnd) {
      [[1, 346], [-1, 734]].forEach(([m, x]) => {
        c.save(); c.strokeStyle = '#8A3A20'; c.lineWidth = 2.6; c.globalAlpha = .8;
        c.beginPath(); c.ellipse(x + m * 14 + (rnd() - .5), 1534 + (rnd() - .5), 14, 12, 0, 0, TAU); c.stroke(); c.restore();
      });
    },
  }], { seed: 27 });

  const head = scPart('bg-head', [330, 820, 420, 460], [{
    len: 28, w: 1.3, dens: 1.5, hair: .12, outline: 5, under: .9, underBlur: 2.5, jit: .14, lt: .18, dk: .06, follow: 1.2, curl: .45, inkCol: '#7A3220',
    flow: (x, y) => Math.atan2(y - 1080, x - X) + Math.PI / 2,
    draw(c) {   // the round head, and two chubby cheeks either side of the trunk
      scBall(c, X, 1060, 178, 168, scGanCols());
      scBall(c, X - 78, 1150, 74, 62, scGanCols());
      scBall(c, X + 78, 1150, 74, 62, scGanCols());
      [[X - 92, 1160], [X + 92, 1160]].forEach(([x, y]) => { const b = c.createRadialGradient(x, y, 2, x, y, 44); b.addColorStop(0, 'rgba(235,70,80,.45)'); b.addColorStop(1, 'rgba(235,70,80,0)'); c.fillStyle = b; c.fillRect(x - 46, y - 46, 92, 92); });
    },
    ink(c, rnd) {
      const I = SC_GAN.ink;
      // eyes closed: lowered lids, small lashes
      scInk(c, [[X - 104, 1080], [X - 88, 1093], [X - 66, 1097], [X - 46, 1088]], 4, I, rnd);
      scInk(c, [[X + 46, 1088], [X + 66, 1097], [X + 88, 1093], [X + 104, 1080]], 4, I, rnd);
      scInk(c, [[X - 104, 1082], [X - 115, 1076]], 2.2, I, rnd); scInk(c, [[X + 104, 1082], [X + 115, 1076]], 2.2, I, rnd);
      // the tilak: a red flame on his brow and a dot under it
      scInk(c, [[X, 950], [X, 998]], 11, SC_GAN.red, rnd, { jit: 1 }); scDot(c, X, 1008, 5, '#F4C040', rnd);
      // his smile peeping out to the left of the trunk
      scInk(c, [[X - 62, 1226], [X - 46, 1238], [X - 28, 1238]], 3, '#8A2A1E', rnd);
    },
  }, {
    len: 18, w: 1.3, dens: 1.8, flow: Math.PI / 2, follow: 1, hair: .1, outline: 4, under: .9, underBlur: 2, inkCol: '#7A5A1C',
    draw(c) {   // the mukut: a small gold crown with a pointed top
      c.save(); c.beginPath();
      c.moveTo(X - 112, 940); c.quadraticCurveTo(X - 120, 880, X - 70, 850); c.quadraticCurveTo(X - 30, 830, X, 790);
      c.quadraticCurveTo(X + 30, 830, X + 70, 850); c.quadraticCurveTo(X + 120, 880, X + 112, 940); c.quadraticCurveTo(X, 916, X - 112, 940); c.closePath();
      const g = c.createLinearGradient(X - 110, 0, X + 110, 0); g.addColorStop(0, G.goldLt); g.addColorStop(.45, G.gold); g.addColorStop(1, G.goldDk); c.fillStyle = g; c.fill(); c.restore();
      c.save(); c.strokeStyle = G.goldDk; c.lineWidth = 10; c.beginPath(); c.moveTo(X - 112, 936); c.quadraticCurveTo(X, 912, X + 112, 936); c.stroke(); c.restore();
    },
    ink(c, rnd) {
      scDot(c, X, 880, 13, '#D2283A', rnd); scDot(c, X - 60, 900, 7, '#2E8A5A', rnd); scDot(c, X + 60, 900, 7, '#2E8A5A', rnd);
      scDot(c, X, 784, 7, G.goldLt, rnd);
      [-80, -40, 0, 40, 80].forEach(dx => scDot(c, X + dx, 928 - Math.abs(dx) * .1, 3.2, '#FFF6E0', rnd));
    },
  }], { seed: 29 });

  const trunk = scPart('bg-trunk', [440, 1060, 240, 270], [{
    len: 22, w: 1.3, dens: 1.6, flow: Math.PI / 2, follow: 1.4, hair: .1, outline: 7, under: .9, underBlur: 2, jit: .14, lt: .18, dk: .06, inkCol: '#7A3220',
    draw(c) {   // the tusks, then the trunk curling to his left (screen right)
      c.save(); c.translate(X - 60, 1196); c.rotate(.45); scBall(c, 0, 0, 12, 30, ['#FFFFFF', G.tusk, G.tuskDk]); c.restore();
      c.save(); c.translate(X + 58, 1180); c.rotate(-.45); scBall(c, 0, 0, 12, 16, ['#FFFFFF', G.tusk, G.tuskDk]); c.restore();
      const P = [[X, 1110], [X - 4, 1180], [X + 4, 1245], [X + 38, 1292], [X + 84, 1292], [X + 104, 1262], [X + 90, 1238]];
      limb(c, P, [112, 88, 66, 50, 38, 28, 20], G.dk);
      c.save(); c.translate(-6, -3); limb(c, P, [96, 74, 54, 40, 30, 22, 14], G.skin); c.restore();
      c.save(); c.globalAlpha = .55; c.translate(-14, -2); limb(c, P.slice(0, 4), [16, 14, 10, 6], G.lt); c.restore();
    },
    ink(c, rnd) {   // the wrinkles across the trunk, the broken tusk's jagged top
      [[1170, 18], [1196, 16], [1222, 14], [1248, 12]].forEach(([y, w], i) => scInk(c, [[X - w - 4 + i * 2, y], [X + 2 + i * 3, y + 5], [X + w + 4 + i * 4, y]], 1.4, '#A8402A', rnd, { alpha: .55 }));
      scInk(c, [[X + 44, 1160], [X + 50, 1155], [X + 55, 1162], [X + 61, 1157]], 1.6, '#A08A6A', rnd, { alpha: .8 });
      scInk(c, [[X - 60, 1150], [X - 46, 1190], [X - 40, 1212]], 1.4, '#B8A080', rnd, { alpha: .6 });
    },
  }], { seed: 31 });
  return { earL: ear(-1), earR: ear(1), legs, torso, head, trunk };
}

// ---------- the lotus seat and the lily pad ----------
const SC_LOTUS = { pink: '#F4A3BD', pinkDk: '#D2668C', pinkLt: '#FFE3EC', pad: '#5E9C4C', padDk: '#3C6E34', padLt: '#9CCB6A' };
function scPetal(c, x, y, len, wid, ang, cols) {
  c.save(); c.translate(x, y); c.rotate(ang);
  c.beginPath(); c.moveTo(0, 0); c.bezierCurveTo(wid, -len * .25, wid * .8, -len * .8, 0, -len); c.bezierCurveTo(-wid * .8, -len * .8, -wid, -len * .25, 0, 0); c.closePath();
  const g = c.createLinearGradient(0, 0, 0, -len); g.addColorStop(0, cols[2]); g.addColorStop(.45, cols[1]); g.addColorStop(1, cols[0]);
  c.fillStyle = g; c.fill(); c.restore();
}
function scLotus(o = {}) {
  const L = SC_LOTUS, cols = [L.pinkLt, L.pink, L.pinkDk], X = o.x ?? 540, Y = o.y ?? 1690, key = o.key || '';
  const back = scPart('lotus-back' + key, [X - 340, Y - 260, 680, 300], [{
    len: 30, w: 1.4, dens: 1.5, follow: 1.5, hair: .15, outline: 6, curl: .35, inkCol: '#9A3A5A', under: .75,
    flow: (x, y) => Math.atan2(y - Y, x - X),
    draw(c) {   // the petals standing up behind him
      [[-1.2, 210, 78], [-.85, 240, 84], [-.45, 250, 86], [.45, 250, 86], [.85, 240, 84], [1.2, 210, 78], [0, 230, 80]].forEach(([a, len, wd]) => scPetal(c, X + a * 120, Y - 10, len, wd, a * .8, cols));
    },
  }], { seed: 41 });
  const front = scPart('lotus-front' + key, [X - 360, Y - 90, 720, 190], [{
    len: 30, w: 1.4, dens: 1.5, follow: 1.5, hair: .15, outline: 6, curl: .35, inkCol: '#9A3A5A', under: .75,
    flow: (x, y) => Math.atan2(y - (Y - 60), x - X),
    draw(c) {   // the petals turned out toward us and down, round the lap
      [[-1.55, 160, 70], [1.55, 160, 70], [-2.05, 150, 74], [2.05, 150, 74], [-2.5, 140, 76], [2.5, 140, 76], [Math.PI, 135, 80]].forEach(([a, len, wd]) => scPetal(c, X + Math.sin(a) * 150, Y - 30, len, wd, a, cols));
    },
    ink(c, rnd) { [-1.55, -2.05, -2.5, Math.PI, 2.5, 2.05, 1.55].forEach(a => scInk(c, [[X + Math.sin(a) * 150, Y - 30], [X + Math.sin(a) * 150 + Math.sin(a) * 80, Y - 30 - Math.cos(a) * 80]], 1.2, '#C25A7E', rnd, { alpha: .35 })); },
  }], { seed: 43 });
  const pad = scPart('lotus-pad' + key, [X - 470, Y + 20, 940, 230], [{
    len: 50, w: 1.5, dens: 1.5, follow: .9, hair: .2, outline: 7, curl: .4, inkCol: '#24461E', under: .7,
    flow: (x, y) => Math.atan2((y - (Y + 120)) * 4, x - X),
    draw(c) {   // the lily pad, seen low, with its notch toward us
      c.save(); c.beginPath(); c.ellipse(X, Y + 120, 460, 100, 0, 0, TAU); c.moveTo(X, Y + 120); c.closePath();
      const g = c.createRadialGradient(X - 120, Y + 80, 20, X, Y + 120, 470); g.addColorStop(0, L.padLt); g.addColorStop(.5, L.pad); g.addColorStop(1, L.padDk);
      c.fillStyle = g; c.fill();
      c.globalCompositeOperation = 'destination-out'; c.beginPath(); c.moveTo(X + 30, Y + 220); c.lineTo(X + 4, Y + 130); c.lineTo(X + 90, Y + 222); c.closePath(); c.fill(); c.restore();
    },
    ink(c, rnd) { for (let i = 0; i < 12; i++) { const a = Math.PI * (i / 11) + .05; scInk(c, [[X, Y + 120], [X + Math.cos(a) * 420, Y + 120 + Math.sin(a) * 90]], 1.2, '#3C6E34', rnd, { alpha: .3 }); } },
  }], { seed: 45 });
  return { back, front, pad };
}

// ---------- a honeybee ----------
function scBee() {
  const body = scPart('bee-body', [-34, -22, 68, 44], [{
    len: 9, w: 1.1, dens: 2.2, flow: 0, follow: 1.2, hair: .6, outline: 3, curl: .3, under: .85, underBlur: 1.5, soft: 4, inkCol: '#2A1A08',
    draw(c) {
      scBall(c, 4, 2, 22, 15, ['#FFE48A', '#F2B623', '#B87A0A']);
      c.save(); c.beginPath(); c.ellipse(4, 2, 22, 15, 0, 0, TAU); c.clip(); c.fillStyle = '#2A1E10'; c.fillRect(-4, -20, 7, 40); c.fillRect(11, -20, 6, 40); c.restore();
      scBall(c, -22, 0, 11, 10, ['#5A4A30', '#2A1E10', '#120C04']);
    },
    ink(c, rnd) { scInk(c, [[-28, -6], [-36, -16]], 1.2, '#1A1008', rnd); scInk(c, [[-26, -8], [-30, -19]], 1.2, '#1A1008', rnd); scInk(c, [[26, 2], [32, 3]], 1.6, '#1A1008', rnd); },
  }], { seed: 51, pad: 14 });
  const wings = scPart('bee-wings', [-20, -40, 44, 40], [{
    len: 8, w: .9, dens: 1.6, follow: 1.5, hair: .1, outline: 2, under: .6, underBlur: 1, soft: 4, inkCol: '#7A8AA0', jit: .1, dk: .02, lt: .4,
    draw(c) {
      c.fillStyle = 'rgba(235,245,255,.85)'; c.beginPath(); c.ellipse(-4, -18, 10, 18, -.4, 0, TAU); c.fill();
      c.fillStyle = 'rgba(220,235,250,.75)'; c.beginPath(); c.ellipse(10, -14, 8, 14, .3, 0, TAU); c.fill();
    },
  }], { seed: 53, pad: 12 });
  return { body, wings };
}
// one bee at (x, y), heading ang (0: flying right), wings flapping by flap (0..1); s: size
function scBeeDraw(c, P, t, x, y, ang, flap, s = 1) {
  const flip = Math.cos(ang) < 0 ? -1 : 1, tilt = flip > 0 ? ang : ang - Math.PI;
  c.save(); c.translate(x, y); c.rotate(tilt * .35); c.scale(s * flip, s);
  scDraw(c, P.body, t, { ax: 0, ay: 0 });
  scDraw(c, P.wings, t, { ax: 0, ay: -6, sy: .35 + .65 * flap, alpha: .85 });
  c.restore();
}

// ---------- the pond, far out of focus ----------
function scPond(c, o = {}) {
  const w = o.w || W, h = o.h || H, dy = o.dy || 0;
  const cv = sprite(`sc-pond${w}x${h}+${dy}`, w, h, x => {
    const raw = scCanvas(w, h), r = raw.getContext('2d');
    const g = r.createLinearGradient(0, 0, 0, 1000 + dy); g.addColorStop(0, '#9BC8E2'); g.addColorStop(.6, '#D8EADF'); g.addColorStop(1, '#F4EBC8');
    r.fillStyle = g; r.fillRect(0, 0, w, h);
    r.translate(0, dy);
    // the sun, low on the left, and the light round it
    const sg = r.createRadialGradient(170, 760, 10, 170, 760, 520); sg.addColorStop(0, 'rgba(255,250,225,1)'); sg.addColorStop(.25, 'rgba(255,240,200,.6)'); sg.addColorStop(1, 'rgba(255,240,200,0)');
    r.fillStyle = sg; r.fillRect(-400, 200, 1200, 1200);
    // trees round the far bank: soft green masses, lit on the left
    const rt = scRnd(7);
    for (let i = 0; i < 26; i++) {
      const tx = -80 + i * 48 + rt() * 30, ty = 940 + rt() * 70 - Math.sin(i / 25 * Math.PI) * 60, tr = 80 + rt() * 70;
      r.fillStyle = mixCol('#3F7A44', '#2A5634', rt()); r.beginPath(); r.ellipse(tx, ty, tr, tr * 1.1, 0, 0, TAU); r.fill();
      r.fillStyle = rgba('#8DBF5A', .5 * (1 - tx / w)); r.beginPath(); r.ellipse(tx - tr * .25, ty - tr * .3, tr * .6, tr * .55, 0, 0, TAU); r.fill();
    }
    r.fillStyle = '#2C5232'; r.fillRect(-40, 1020, w + 80, 70);
    // the water: the sky's colour near the bank, deeper teal toward us, streaks of reflected light
    const wg = r.createLinearGradient(0, 1060, 0, h - dy); wg.addColorStop(0, '#A8CFC4'); wg.addColorStop(.3, '#5E9A92'); wg.addColorStop(1, '#2F6660');
    r.fillStyle = wg; r.fillRect(-40, 1070, w + 80, h - dy - 1070 + 40);
    for (let i = 0; i < 40; i++) { const yy = 1080 + Math.pow(rt(), 1.6) * (h - dy - 1080); r.fillStyle = `rgba(230,245,235,${.12 + rt() * .18})`; r.fillRect(rt() * w - 100, yy, 120 + rt() * 300, 3 + rt() * 6); }
    // lily pads and a few lotuses on the water, smaller with distance
    for (let i = 0; i < 22; i++) {
      const py = 1110 + Math.pow(rt(), 1.3) * 700, k = (py - 1050) / 700, px = rt() * w, pr = 30 + k * 120;
      r.fillStyle = mixCol('#4E8C40', '#7AB458', rt()); r.beginPath(); r.ellipse(px, py, pr, pr * .26, 0, 0, TAU); r.fill();
      if (rt() < .35) { r.fillStyle = '#F2A2BC'; r.beginPath(); r.ellipse(px + pr * .2, py - pr * .16, pr * .3, pr * .26, 0, 0, TAU); r.fill(); }
    }
    // bokeh: sunlight glinting on the water
    for (let i = 0; i < 26; i++) { const bx = rt() * w, by = 1100 + rt() * 500, br = 14 + rt() * 26; r.fillStyle = `rgba(255,252,236,${.35 + rt() * .4})`; r.beginPath(); r.ellipse(bx, by, br, br, 0, 0, TAU); r.fill(); }
    x.filter = window.SC_SHARP ? 'none' : 'blur(22px)'; x.drawImage(raw, -40, -40, w + 80, h + 80); x.filter = 'none';
  });
  c.drawImage(cv, 0, 0);
}
