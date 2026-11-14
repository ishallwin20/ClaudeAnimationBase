// sc_kanha.js: Bal Krishna asleep against a calf, for the Scribble style (load after scribble.js and sc_cast.js), the
// moonlit bank of the Yamuna, and a grass verge in front.
//
// A white calf with tan patches lies curled on the grass, its head down on the right, eyes closed. Kanha sits in front
// of it, leaning back on its side: blue skin, eyes closed, a peacock feather in his top-knot, makara earrings, a
// U-shaped tilak, a yellow pitambar with a red border, his flute across his lap. scKanha() → { calf, calfHead, legs,
// torso, head }, pivots in SCKR (design px, frame 1080 × 1920).
//   scVrindavan(c, o): the Yamuna at night far out of focus: the moon, kadamba trees, the river with the moon on it,
//     a few lamps in a far village (o: { w, h, dy } as scHimalaya)
//   scGrass(o) → part: a grass verge across the bottom (o: { y: its top, h, key, col, lt, dk })
const SCKR = { ground: 1660, calf: [610, 1650], calfNeck: [900, 1560], lap: [480, 1610], neck: [500, 1360], calfEarL: [840, 1420] };
const SC_KAN = { skin: '#5C8FD8', dk: '#3B66AE', lt: '#93B9EE', hair: '#1E1B2E', hairLt: '#46426A', pit: '#F2C64A', pitDk: '#C99020', pitLt: '#FFE38A',
  border: '#D2452F', gold: '#F2C230', goldDk: '#A97818', pearl: '#FFF6E8', feather: '#3E9A5A', featherDk: '#1E5A3A', eyeBlue: '#1E3C8A', eyeTeal: '#2AA8A0',
  flute: '#B07A3A', fluteDk: '#7A4A1C', ink: '#16203A',
  calf: '#EEEAE6', calfDk: '#ACA9BA', calfLt: '#FFFFFF', patch: '#C9925E', patchDk: '#946238', muzzle: '#E7B9B0', muzzleDk: '#C08C84', hoof: '#5A4A46' };
const scKanCols = () => [SC_KAN.lt, SC_KAN.skin, SC_KAN.dk];
const scCalfCols = () => [SC_KAN.calfLt, SC_KAN.calf, SC_KAN.calfDk];
const SCKR_SKIN = { len: 26, w: 1.3, dens: 1.5, hair: .12, outline: 5, under: .9, underBlur: 2.5, jit: .14, lt: .18, dk: .06, follow: 1.2, curl: .45, inkCol: '#1A2A50' };
const SCKR_FUR = { len: 40, w: 1.4, dens: 1.5, follow: 1.2, hair: .6, outline: 7, curl: .5, under: .8, underBlur: 3, jit: .16, lt: .12, dk: .1, inkCol: '#5A5668' };

function scKanha() {
  const K = SC_KAN;
  const calf = scPart('kc-calf', [180, 1320, 760, 360], [{
    ...SCKR_FUR, flow: 0,
    draw(c) {   // the body lying curled, the haunch on the left, tan patches, the folded legs, the tail
      limb(c, [[300, 1470], [252, 1520], [244, 1590], [280, 1630], [330, 1640]], [20, 18, 16, 14, 18], K.calfDk);
      scBall(c, 610, 1505, 312, 150, scCalfCols());
      scBall(c, 366, 1528, 132, 116, scCalfCols(), .2);
      c.save(); c.beginPath(); c.ellipse(610, 1505, 312, 150, 0, 0, TAU); c.clip();
      [[700, 1420, 90, 56, .3], [520, 1400, 60, 40, -.2], [800, 1520, 70, 60, .1]].forEach(([x, y, rx, ry, a]) => scBall(c, x, y, rx, ry, ['#E2B486', K.patch, K.patchDk], a));
      c.restore();
      scBall(c, 300, 1470, 54, 44, ['#E2B486', K.patch, K.patchDk], .3);
      scBall(c, 786, 1632, 70, 34, scCalfCols(), -.1);
      scBall(c, 300, 1630, 48, 26, scCalfCols(), .2);
      scBall(c, 734, 1646, 22, 15, ['#8A7A76', K.hoof, '#2A2220']); scBall(c, 262, 1640, 20, 13, ['#8A7A76', K.hoof, '#2A2220']);
      const g = c.createLinearGradient(0, 1560, 0, 1660); g.addColorStop(0, 'rgba(40,40,70,0)'); g.addColorStop(1, 'rgba(30,30,60,.45)');
      c.save(); c.globalCompositeOperation = 'source-atop'; c.fillStyle = g; c.fillRect(180, 1540, 760, 140); c.restore();
    },
  }], { seed: 91 });

  const calfHead = scPart('kc-calfhead', [780, 1340, 260, 280], [{
    ...SCKR_FUR, len: 26, hair: .35,
    flow: (x, y) => Math.atan2(y - 1470, x - 905) + Math.PI / 2,
    draw(c) {   // the head resting low, the ears drooping, the pink muzzle
      c.save(); c.translate(842, 1420); c.rotate(.6); scBall(c, 0, 0, 54, 24, scCalfCols()); c.globalAlpha = .8; scBall(c, 4, 3, 38, 14, ['#FFD9D0', '#F0B4AA', '#C88A82']); c.restore();
      c.save(); c.translate(976, 1424); c.rotate(-.5); scBall(c, 0, 0, 54, 24, scCalfCols()); c.globalAlpha = .8; scBall(c, -4, 3, 38, 14, ['#FFD9D0', '#F0B4AA', '#C88A82']); c.restore();
      scBall(c, 908, 1468, 82, 90, scCalfCols(), -.1);
      scBall(c, 900, 1536, 56, 40, ['#F6D2CA', K.muzzle, K.muzzleDk]);
      scBall(c, 930, 1408, 40, 30, ['#E2B486', K.patch, K.patchDk], .3);
    },
    ink(c, rnd) {
      const I = '#2A2030';
      scInk(c, [[858, 1462], [870, 1472], [888, 1474], [900, 1466]], 3.2, I, rnd); scInk(c, [[922, 1464], [934, 1472], [952, 1470], [962, 1460]], 3.2, I, rnd);
      [[862, 1468, 852, 1478], [956, 1466, 966, 1476]].forEach(([a, b, x, y]) => scInk(c, [[a, b], [x, y]], 1.6, I, rnd));
      scDot(c, 886, 1540, 4, '#7A4A48', rnd); scDot(c, 914, 1540, 4, '#7A4A48', rnd);
      scInk(c, [[872, 1590], [900, 1600], [930, 1590]], 5, K.border, rnd);   // a red cord, a little bell
      scDot(c, 900, 1606, 9, K.gold, rnd);
    },
  }], { seed: 93 });

  const legs = scPart('kk-legs', [300, 1560, 360, 170], [{
    len: 30, w: 1.4, dens: 1.5, flow: 0, follow: 1, hair: .15, outline: 6, under: .85, inkCol: '#8A5A10',
    draw(c) {   // the pitambar over his lap and legs, stretched out toward us, crossed at the ankles
      scBall(c, 480, 1606, 158, 58, [K.pitLt, K.pit, K.pitDk]);
      scBall(c, 418, 1652, 74, 46, [K.pitLt, K.pit, K.pitDk], .2);
      scBall(c, 546, 1656, 74, 46, [K.pitLt, K.pit, K.pitDk], -.2);
    },
    ink(c, rnd) { scInk(c, [[352, 1680], [418, 1696], [480, 1690]], 6, K.border, rnd); scInk(c, [[490, 1692], [546, 1700], [612, 1684]], 6, K.border, rnd); },
  }, {
    ...SCKR_SKIN, len: 16,
    draw(c) { scBall(c, 436, 1704, 34, 22, scKanCols(), .3); scBall(c, 520, 1708, 34, 22, scKanCols(), -.3); },
    ink(c, rnd) { scInk(c, [[408, 1690], [436, 1686], [462, 1694]], 4, K.gold, rnd); scInk(c, [[494, 1696], [520, 1690], [548, 1698]], 4, K.gold, rnd); },
  }], { seed: 95 });

  const torso = scPart('kk-torso', [320, 1350, 360, 280], [{
    ...SCKR_SKIN, flow: Math.PI / 2,
    draw(c) {   // the chest, leaning back a little onto the calf
      c.save(); c.translate(474, 1488); c.rotate(.1); scBall(c, 0, 0, 98, 108, scKanCols()); c.restore();
    },
    ink(c, rnd) {   // a pearl string and the vaijayanti garland
      for (let i = 0; i <= 12; i++) { const u = i / 12; scDot(c, lerp(410, 540, u) + 6, 1420 + Math.sin(u * Math.PI) * 52, 4.5, K.pearl, rnd); }
      const fl = ['#F2F0F6', '#E2453A', '#F2C230', '#E87AA8'];
      for (let i = 0; i <= 16; i++) { const u = i / 16; scDot(c, lerp(400, 556, u) + 10, 1426 + Math.sin(u * Math.PI) * 120, 7, fl[i % 4], rnd); }
    },
  }, {
    ...SCKR_SKIN, follow: 1.5,
    draw(c) {   // arms down to his lap
      limb(c, [[402, 1420], [372, 1490], [384, 1556], [420, 1584]], [54, 48, 42, 36], K.dk);
      limb(c, [[552, 1414], [576, 1486], [560, 1552], [526, 1580]], [54, 48, 42, 36], K.dk);
      limb(c, [[398, 1418], [368, 1488], [380, 1552], [416, 1580]], [44, 38, 34, 28], K.skin);
      limb(c, [[548, 1412], [572, 1484], [556, 1548], [522, 1576]], [44, 38, 34, 28], K.skin);
    },
    ink(c, rnd) { scInk(c, [[356, 1450], [378, 1466], [396, 1456]], 6, K.gold, rnd); scInk(c, [[578, 1444], [560, 1462], [544, 1452]], 6, K.gold, rnd); },
  }, {
    len: 14, w: 1.2, dens: 1.8, flow: -.12, follow: 1.2, hair: .05, outline: 3, under: .9, underBlur: 1.5, inkCol: '#3A1A08',
    draw(c) {   // the flute across his lap, and his hands resting on it
      limb(c, [[300, 1600], [470, 1582], [648, 1556]], [18, 18, 16], K.fluteDk);
      limb(c, [[300, 1596], [470, 1578], [648, 1552]], [13, 13, 12], K.flute);
      scBall(c, 424, 1584, 30, 22, scKanCols()); scBall(c, 526, 1574, 30, 22, scKanCols());
    },
    ink(c, rnd) { [[330, 1595], [610, 1559]].forEach(([x, y]) => scInk(c, [[x, y - 9], [x + 2, y + 9]], 5, K.border, rnd)); [[600, 1560], [580, 1563]].forEach(([x, y]) => scDot(c, x, y, 3, '#3A1A08', rnd)); scDot(c, 640, 1557, 5, K.gold, rnd); },
  }], { seed: 97 });

  const head = scPart('kk-head', [360, 960, 300, 440], [{
    len: 22, w: 1.3, dens: 1.6, follow: 1.4, hair: .25, outline: 6, curl: .55, inkCol: '#000000', jit: .2, lt: .2, dk: .1, under: .85,
    flow: (x, y) => Math.atan2(y - 1250, x - 500),
    draw(c) {   // the peacock feather standing up from the top-knot, the black hair behind and round the face
      limb(c, [[512, 1140], [540, 1080], [574, 1020], [600, 980]], [6, 5, 4, 3], K.featherDk);
      c.save(); c.translate(590, 1010); c.rotate(.5); scBall(c, 0, 0, 38, 62, ['#9CC24A', K.feather, K.featherDk]); c.restore();
      scBall(c, 500, 1240, 124, 116, [K.hairLt, K.hair, '#08080C']);
      scBall(c, 508, 1132, 46, 34, [K.hairLt, K.hair, '#08080C']);
      [[398, 1300], [602, 1300], [420, 1330], [584, 1334]].forEach(([x, y]) => scBall(c, x, y, 26, 30, [K.hairLt, K.hair, '#08080C']));
    },
    ink(c, rnd) {   // the feather's eye
      c.save(); c.translate(590, 1008); c.rotate(.5);
      [[24, 32, '#C8A82A'], [18, 24, K.eyeTeal], [11, 15, K.eyeBlue], [5, 7, '#0A1430']].forEach(([rx, ry, col]) => { c.fillStyle = col; c.beginPath(); c.ellipse((rnd() - .5) * 1.2, (rnd() - .5) * 1.2, rx, ry, 0, 0, TAU); c.fill(); });
      c.restore();
      scInk(c, [[480, 1146], [508, 1150], [536, 1140]], 6, K.gold, rnd);   // a gold band round the knot
    },
  }, {
    ...SCKR_SKIN, flow: (x, y) => Math.atan2(y - 1270, x - 500) + Math.PI / 2,
    draw(c) {   // the face, the ears
      scBall(c, 394, 1272, 22, 28, scKanCols()); scBall(c, 606, 1272, 22, 28, scKanCols());
      c.save(); c.beginPath(); c.ellipse(500, 1276, 104, 96, 0, 0, TAU);
      const g = c.createRadialGradient(470, 1240, 10, 500, 1276, 120); g.addColorStop(0, K.lt); g.addColorStop(.6, K.skin); g.addColorStop(1, K.dk); c.fillStyle = g; c.fill(); c.restore();
      [[440, 1310], [560, 1310]].forEach(([x, y]) => { const b = c.createRadialGradient(x, y, 2, x, y, 32); b.addColorStop(0, 'rgba(230,110,170,.45)'); b.addColorStop(1, 'rgba(230,110,170,0)'); c.fillStyle = b; c.fillRect(x - 34, y - 34, 68, 68); });
      // a fringe of curls over the brow
      [[430, 1196], [466, 1184], [504, 1180], [542, 1186], [574, 1200]].forEach(([x, y]) => scBall(c, x, y, 30, 22, [K.hairLt, K.hair, '#08080C']));
    },
    ink(c, rnd) {
      const I = K.ink;
      scInk(c, [[440, 1270], [454, 1282], [472, 1284], [486, 1274]], 3.6, I, rnd); scInk(c, [[514, 1274], [528, 1284], [546, 1282], [560, 1270]], 3.6, I, rnd);
      scInk(c, [[440, 1272], [432, 1266]], 2, I, rnd); scInk(c, [[560, 1272], [568, 1266]], 2, I, rnd);
      scDot(c, 500, 1300, 2.6, '#22305A', rnd);
      scInk(c, [[484, 1326], [500, 1334], [516, 1326]], 2.8, '#6A1E36', rnd);
      // the tilak: a U of sandal with a red line inside
      scInk(c, [[484, 1214], [488, 1244], [500, 1252], [512, 1244], [516, 1214]], 4, '#FFF2D0', rnd); scInk(c, [[500, 1218], [500, 1244]], 3.4, '#E2453A', rnd);
      scDot(c, 438, 1222, 3.4, '#0A0A14', rnd);
      [[392, 1312], [608, 1312]].forEach(([x, y]) => { scDot(c, x, y, 10, K.gold, rnd); scDot(c, x, y + 18, 6, K.gold, rnd); });
    },
  }], { seed: 99 });
  return { calf, calfHead, legs, torso, head };
}

// ---------- a grass verge ----------
function scGrass(o = {}) {
  const Y = o.y ?? 1680, h = o.h || H;
  return scPart('grass' + (o.key || '') + Y + 'x' + h, [-20, Y - 60, 1120, h - Y + 80], [{
    len: 54, w: 1.5, dens: 1.4, flow: Math.PI / 2 + .12, follow: .3, hair: 1.6, outline: 0, curl: .3, under: .75, underBlur: 4, jit: .3, lt: .2, dk: .2,
    draw(c) {
      c.beginPath(); c.moveTo(-20, h + 20);
      for (let x = -20; x <= 1100; x += 20) c.lineTo(x, Y + Math.pow((x - 520) / 560, 2) * -60 + scFbm2(x / 70, 2, 5, 3) * 18);
      c.lineTo(1100, h + 20); c.closePath();
      const g = c.createLinearGradient(0, Y - 60, 0, h); g.addColorStop(0, o.lt || '#5E8A78'); g.addColorStop(.3, o.col || '#2E5A4C'); g.addColorStop(1, o.dk || '#12241E'); c.fillStyle = g; c.fill();
    },
  }], { seed: 101, pad: 30 });
}

// ---------- the Yamuna at night ----------
const SC_MOON = [800, 560];
function scVrindavan(c, o = {}) {
  const w = o.w || W, h = o.h || H, dy = o.dy || 0;
  const cv = sprite(`sc-vrin${w}x${h}+${dy}`, w, h, x => {
    const raw = scCanvas(w, h), r = raw.getContext('2d');
    const g = r.createLinearGradient(0, 0, 0, 1150 + dy); g.addColorStop(0, '#0A1030'); g.addColorStop(.6, '#1C2C5E'); g.addColorStop(1, '#3A5888');
    r.fillStyle = g; r.fillRect(0, 0, w, h);
    r.translate(0, dy);
    const rt = scRnd(31);
    const [mx, my] = SC_MOON;
    const mg = r.createRadialGradient(mx, my, 0, mx, my, 520); mg.addColorStop(0, 'rgba(200,215,255,.55)'); mg.addColorStop(1, 'rgba(200,215,255,0)'); r.fillStyle = mg; r.fillRect(mx - 520, my - 520, 1040, 1040);
    r.fillStyle = '#FFFBEA'; r.beginPath(); r.arc(mx, my, 92, 0, TAU); r.fill();
    // far bank, the river with the moon's path on it, the near bank
    r.fillStyle = '#152240'; r.beginPath(); r.moveTo(-40, 1110); for (let xx = -40; xx <= w + 40; xx += 30) r.lineTo(xx, 1080 - Math.abs(scFbm2(xx / 90, 3, 7, 3)) * 90); r.lineTo(w + 40, 1150); r.lineTo(-40, 1150); r.closePath(); r.fill();
    const rg = r.createLinearGradient(0, 1140, 0, 1330); rg.addColorStop(0, '#2C4A7A'); rg.addColorStop(1, '#1A2E54'); r.fillStyle = rg; r.fillRect(-40, 1140, w + 80, 200);
    for (let i = 0; i < 18; i++) { const yy = 1150 + i * 10, ww = 60 + rt() * 140; r.fillStyle = `rgba(255,248,220,${.25 + rt() * .4})`; r.fillRect(mx - ww / 2 + (rt() - .5) * 60, yy, ww, 4); }
    const bg = r.createLinearGradient(0, 1320, 0, h - dy); bg.addColorStop(0, '#1E3A3E'); bg.addColorStop(1, '#0E1C20'); r.fillStyle = bg; r.fillRect(-40, 1320, w + 80, h - dy - 1280);
    // kadamba trees on both sides, dark against the sky
    [[-60, 760, 340], [120, 640, 260], [1080, 820, 300], [980, 980, 200]].forEach(([tx, ty, tr]) => {
      r.fillStyle = '#0C1428'; r.fillRect(tx - 24, ty, 48, 1400 - ty);
      for (let i = 0; i < 9; i++) { r.beginPath(); r.ellipse(tx + (rt() - .5) * tr * 1.4, ty + (rt() - .5) * tr * .8, tr * (.4 + rt() * .35), tr * (.35 + rt() * .3), 0, 0, TAU); r.fill(); }
    });
    // a far village: a few warm lamps along the far bank
    for (let i = 0; i < 9; i++) { const lx = 260 + rt() * 560, ly = 1060 + rt() * 40, lg = r.createRadialGradient(lx, ly, 0, lx, ly, 18); lg.addColorStop(0, 'rgba(255,200,120,.9)'); lg.addColorStop(1, 'rgba(255,170,80,0)'); r.fillStyle = lg; r.fillRect(lx - 18, ly - 18, 36, 36); }
    x.filter = window.SC_SHARP ? 'none' : 'blur(18px)'; x.drawImage(raw, -40, -40, w + 80, h + 80); x.filter = 'none';
    // stars: tiny soft discs
    const rs = scRnd(37); x.save(); x.globalCompositeOperation = 'screen';
    for (let i = 0; i < 70; i++) { const sx = rs() * w, sy = rs() * (780 + dy); if (Math.hypot(sx - mx, sy - dy - my) < 220) continue; x.fillStyle = `rgba(230,236,255,${.2 + rs() * .5})`; x.beginPath(); x.arc(sx, sy, 1.5 + rs() * 2.5, 0, TAU); x.fill(); }
    x.restore();
  });
  c.drawImage(cv, 0, 0);
}
