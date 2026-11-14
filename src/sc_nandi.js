// sc_nandi.js: Nandi for the Scribble style (load after scribble.js and sc_cast.js), the temple courtyard at dusk and
// a brass diya.
//
// Nandi lies facing us, as he lies facing the sanctum: a white bull, his forelegs folded under him, the hump rising
// behind his head, a red cloth with a gold border over his back, a marigold garland and a brass bell on a red cord, a
// tripundra of ash and a kumkum dot on his brow, grey horns with gold caps, eyes closed. scNandi() → { body, head,
// earL, earR }, pivots in SCN (design px, frame 1080 × 1920): the breath scales the body about the ground, the head
// rides on it, the ears flick now and then.
//   scCourtyard(c, o): a temple courtyard at dusk far out of focus: the gopuram and the gold flagstaff behind him, rows
//     of lamps, a violet sky (o: { w, h, dy } as scHimalaya)
//   scDiya() → part, a brass diya drawn round (0, 0); scDiyaDraw(c, P, t, x, y, s, lean) lays it down with a live flame
const SCN = { x: 540, ground: 1700, neck: [540, 1390], earL: [455, 1110], earR: [625, 1110] };
const SC_BULL = { body: '#EFE9DF', dk: '#B7AEA2', lt: '#FFFFFF', hump: '#DCD6CF', muzzle: '#D9C3BC', muzzleDk: '#B69A92',
  horn: '#7A716A', hornDk: '#4E4742', ear: '#F0C4BA', hoof: '#5A504A', ink: '#3A302C',
  cloth: '#C8372D', clothDk: '#8E2219', clothLt: '#E8604E', gold: '#EDB838', goldDk: '#A97818', goldLt: '#FFE48A',
  marigold: '#F39A2E', marigoldDk: '#C8641A' };
const scBullCols = () => [SC_BULL.lt, SC_BULL.body, SC_BULL.dk];
const SCN_FUR = { len: 40, w: 1.4, dens: 1.5, follow: 1.2, hair: .4, outline: 7, curl: .45, under: .8, underBlur: 3, jit: .16, lt: .12, dk: .1, inkCol: '#6A625C' };

function scNandi() {
  const B = SC_BULL, X = SCN.x;
  const body = scPart('nd-body', [100, 1120, 880, 600], [{
    ...SCN_FUR, flow: 0,
    draw(c) {   // the haunches out to the sides, the hump behind the head, the deep chest, the knees folded under
      scBall(c, X, 1560, 410, 150, scBullCols());
      scBall(c, X, 1238, 178, 122, ['#F4F0EA', B.hump, '#A79E94']);
      scBall(c, X, 1500, 236, 178, scBullCols());
      scBall(c, X - 112, 1652, 92, 50, scBullCols(), .1);
      scBall(c, X + 112, 1652, 92, 50, scBullCols(), -.1);
      const g = c.createLinearGradient(0, 1600, 0, 1712); g.addColorStop(0, 'rgba(90,80,70,0)'); g.addColorStop(1, 'rgba(80,70,60,.45)');
      c.save(); c.globalCompositeOperation = 'source-atop'; c.fillStyle = g; c.fillRect(100, 1580, 880, 140); c.restore();
    },
  }, {
    len: 26, w: 1.4, dens: 1.6, flow: Math.PI / 2, follow: 1, hair: .1, outline: 5, under: .85, underBlur: 2, inkCol: '#5A1410',
    draw(c) {   // the red cloth hanging down his flanks on both sides
      [-1, 1].forEach(m => {
        c.save(); c.beginPath();
        c.moveTo(X + m * 250, 1410); c.quadraticCurveTo(X + m * 380, 1420, X + m * 440, 1500);
        c.lineTo(X + m * 448, 1640); c.quadraticCurveTo(X + m * 360, 1676, X + m * 278, 1640); c.quadraticCurveTo(X + m * 250, 1520, X + m * 250, 1410); c.closePath();
        const g = c.createLinearGradient(X + m * 250, 0, X + m * 450, 0); g.addColorStop(0, B.clothDk); g.addColorStop(.35, B.cloth); g.addColorStop(1, m < 0 ? B.clothLt : B.clothDk);
        c.fillStyle = g; c.fill(); c.restore();
      });
    },
    ink(c, rnd) {   // the gold border and a row of small mirrors
      [-1, 1].forEach(m => {
        scInk(c, [[X + m * 446, 1500], [X + m * 448, 1640], [X + m * 360, 1672], [X + m * 280, 1638]], 9, B.gold, rnd, { alpha: .9 });
        scInk(c, [[X + m * 432, 1520], [X + m * 434, 1626], [X + m * 360, 1652], [X + m * 292, 1624]], 1.6, B.goldDk, rnd, { alpha: .6 });
        for (let i = 0; i < 5; i++) { const u = i / 4; scDot(c, X + m * lerp(300, 410, u), lerp(1600, 1540, u), 5, '#F4F6FA', rnd); }
      });
    },
  }, {
    len: 24, w: 1.3, dens: 1.6, flow: Math.PI / 2, follow: 1.2, hair: .2, outline: 4, under: .85, underBlur: 2, jit: .14, lt: .14, dk: .08, inkCol: '#6A625C',
    draw(c) {   // the dewlap hanging down the chest, and the hooves tucked under
      c.save(); c.beginPath(); c.moveTo(X - 52, 1360); c.quadraticCurveTo(X - 70, 1480, X - 34, 1580); c.quadraticCurveTo(X, 1600, X + 34, 1580); c.quadraticCurveTo(X + 70, 1480, X + 52, 1360); c.closePath();
      const g = c.createLinearGradient(X - 60, 0, X + 60, 0); g.addColorStop(0, '#FFFFFF'); g.addColorStop(.6, B.body); g.addColorStop(1, B.dk); c.fillStyle = g; c.fill(); c.restore();
      scBall(c, X - 52, 1690, 34, 18, ['#8A7E76', B.hoof, '#2E2622']); scBall(c, X + 52, 1690, 34, 18, ['#8A7E76', B.hoof, '#2E2622']);
    },
    ink(c, rnd) {
      scInk(c, [[X - 52, 1676], [X - 52, 1704]], 1.6, '#2A221E', rnd, { alpha: .7 }); scInk(c, [[X + 52, 1676], [X + 52, 1704]], 1.6, '#2A221E', rnd, { alpha: .7 });
    },
  }, {
    len: 14, w: 1.3, dens: 2, flow: 0, follow: .8, hair: .5, outline: 3, under: .9, underBlur: 1.5, soft: 5, inkCol: '#8A4A10',
    draw(c) {   // the marigold garland round his neck, and the bell on its red cord
      for (let i = 0; i <= 22; i++) {
        const u = i / 22, x = lerp(X - 230, X + 230, u), y = 1388 + Math.sin(u * Math.PI) * 118;
        scBall(c, x, y, 21, 19, ['#FFD27A', B.marigold, B.marigoldDk]);
      }
      c.save(); c.strokeStyle = B.cloth; c.lineWidth = 8; c.beginPath(); c.moveTo(X - 120, 1380); c.quadraticCurveTo(X, 1470, X + 120, 1380); c.stroke(); c.restore();
      c.save(); c.beginPath(); c.moveTo(X - 34, 1528); c.quadraticCurveTo(X - 36, 1478, X, 1470); c.quadraticCurveTo(X + 36, 1478, X + 34, 1528); c.closePath();
      const g = c.createLinearGradient(X - 34, 0, X + 34, 0); g.addColorStop(0, B.goldLt); g.addColorStop(.5, B.gold); g.addColorStop(1, B.goldDk); c.fillStyle = g; c.fill(); c.restore();
    },
    ink(c, rnd) { scInk(c, [[X - 36, 1528], [X, 1534], [X + 36, 1528]], 4, B.goldDk, rnd); scDot(c, X, 1540, 6, '#6A4A10', rnd); },
  }], { seed: 61 });

  const head = scPart('nd-head', [380, 880, 320, 520], [{
    ...SCN_FUR, len: 30, hair: .25, flow: Math.PI / 2,
    draw(c) {   // the horns, then the long face narrowing to the muzzle, a forelock between the horns
      [-1, 1].forEach(m => {
        const P = [[X + m * 66, 1076], [X + m * 120, 1040], [X + m * 156, 990], [X + m * 160, 944], [X + m * 146, 914]];
        limb(c, P, [62, 50, 38, 26, 14], B.hornDk);
        c.save(); c.translate(-4 * m, -3); limb(c, P, [50, 40, 30, 20, 10], B.horn); c.restore();
        limb(c, P.slice(3), [22, 10], B.gold);
      });
      scBall(c, X, 1150, 110, 118, scBullCols());
      c.save(); c.beginPath(); c.moveTo(X - 108, 1150); c.quadraticCurveTo(X - 100, 1300, X - 74, 1350); c.lineTo(X + 74, 1350); c.quadraticCurveTo(X + 100, 1300, X + 108, 1150); c.closePath();
      const g = c.createLinearGradient(X - 100, 0, X + 100, 0); g.addColorStop(0, '#FFFFFF'); g.addColorStop(.55, B.body); g.addColorStop(1, B.dk); c.fillStyle = g; c.fill(); c.restore();
      scBall(c, X, 1335, 86, 58, ['#EEDDD8', B.muzzle, B.muzzleDk]);
      c.save(); c.globalAlpha = .9; limb(c, [[X - 30, 1060], [X - 6, 1040], [X + 20, 1046], [X + 28, 1066]], [26, 30, 24, 14], '#E6DFD5'); c.restore();
    },
    ink(c, rnd) {
      const I = B.ink;
      // eyes closed, on the sides of his face, long lashes
      scInk(c, [[X - 98, 1168], [X - 84, 1182], [X - 62, 1184], [X - 46, 1174]], 3.6, I, rnd);
      scInk(c, [[X + 46, 1174], [X + 62, 1184], [X + 84, 1182], [X + 98, 1168]], 3.6, I, rnd);
      [[-90, 1180, -100, 1192], [-78, 1184, -84, 1198], [-64, 1186, -66, 1200]].forEach(([x0, y0, x1, y1]) => { scInk(c, [[X + x0, y0], [X + x1, y1]], 1.6, I, rnd); scInk(c, [[X - x0, y0], [X - x1, y1]], 1.6, I, rnd); });
      // the tripundra in ash across the brow and the kumkum dot
      [1088, 1104, 1120].forEach(y => scInk(c, [[X - 58, y + 3], [X, y - 2], [X + 58, y + 3]], 5, '#B9B7C2', rnd, { alpha: .9 }));
      scDot(c, X, 1104, 8, '#D6332A', rnd);
      // nostrils and the line of the mouth
      scInk(c, [[X - 44, 1330], [X - 34, 1344], [X - 22, 1340]], 4, '#6A4A48', rnd); scInk(c, [[X + 44, 1330], [X + 34, 1344], [X + 22, 1340]], 4, '#6A4A48', rnd);
      scInk(c, [[X - 40, 1376], [X, 1384], [X + 40, 1376]], 2, '#8A6A66', rnd, { alpha: .6 });
    },
  }], { seed: 63 });

  const ear = side => scPart('nd-ear' + side, side < 0 ? [290, 1060, 180, 120] : [610, 1060, 180, 120], [{
    ...SCN_FUR, len: 22, hair: .3, outline: 4, flow: 0,
    draw(c) {
      c.save(); c.translate(X + side * 156, 1124); c.rotate(side * .25);
      scBall(c, 0, 0, 80, 34, scBullCols()); c.globalAlpha = .85; scBall(c, side * 6, 4, 58, 20, ['#FFD9D0', B.ear, '#D49488']); c.restore();
    },
  }], { seed: side < 0 ? 65 : 67 });
  return { body, head, earL: ear(-1), earR: ear(1) };
}

// ---------- a brass diya with a live flame ----------
function scDiya() {
  return scPart('diya', [-70, -40, 140, 70], [{
    len: 14, w: 1.2, dens: 2, flow: 0, follow: 1.2, hair: .1, outline: 4, under: .9, underBlur: 1.5, soft: 5, inkCol: '#5A3A08',
    draw(c) {
      c.save(); c.beginPath(); c.moveTo(-66, -14); c.quadraticCurveTo(-50, 26, 0, 28); c.quadraticCurveTo(50, 26, 66, -14); c.quadraticCurveTo(0, -4, -66, -14); c.closePath();
      const g = c.createLinearGradient(-66, 0, 66, 0); g.addColorStop(0, '#FFE48A'); g.addColorStop(.4, '#E0A630'); g.addColorStop(1, '#8A5A10'); c.fillStyle = g; c.fill(); c.restore();
      c.fillStyle = '#5A3A0A'; c.beginPath(); c.ellipse(0, -12, 60, 9, 0, 0, TAU); c.fill();
      c.fillStyle = '#C08A20'; c.beginPath(); c.moveTo(48, -16); c.lineTo(76, -26); c.lineTo(58, -8); c.closePath(); c.fill();
    },
  }], { seed: 69, pad: 16 });
}
function scDiyaDraw(c, P, t, x, y, s = 1, lean = 0, o = {}) {   // s < 0: mirrored (the spout on the left)
  c.save(); c.translate(x, y); c.scale(s, Math.abs(s)); lean *= Math.sign(s);
  scDraw(c, P, t, { ax: 0, ay: 0 });
  const fx = 66, fy = -28, fl = 1 + .1 * Math.sin(t * 31) + .06 * Math.sin(t * 47 + 1), h = 44 * fl * (o.h ?? 1), lx = lean * h;
  glow(c, fx, fy - 14, 150, '#FFB347', .35 * (o.glow ?? 1), 'screen');
  c.save(); c.globalCompositeOperation = 'lighter';
  const flame = (k, col) => { c.fillStyle = col; c.beginPath(); c.moveTo(fx - 9 * k, fy); c.quadraticCurveTo(fx - 12 * k + lx * .3, fy - h * .5 * k, fx + lx, fy - h * k); c.quadraticCurveTo(fx + 12 * k + lx * .3, fy - h * .5 * k, fx + 9 * k, fy); c.quadraticCurveTo(fx, fy + 6 * k, fx - 9 * k, fy); c.fill(); };
  flame(1, 'rgba(255,140,40,.75)'); flame(.72, 'rgba(255,210,90,.9)'); flame(.4, 'rgba(255,250,220,1)');
  c.restore(); c.restore();
}

// ---------- the courtyard at dusk, far out of focus ----------
function scCourtyard(c, o = {}) {
  const w = o.w || W, h = o.h || H, dy = o.dy || 0;
  const cv = sprite(`sc-court${w}x${h}+${dy}`, w, h, x => {
    const raw = scCanvas(w, h), r = raw.getContext('2d');
    const g = r.createLinearGradient(0, 0, 0, 1250 + dy); g.addColorStop(0, '#2A2458'); g.addColorStop(.45, '#6A4C8E'); g.addColorStop(.8, '#D88A7A'); g.addColorStop(1, '#F2B47A');
    r.fillStyle = g; r.fillRect(0, 0, w, h);
    r.translate(0, dy);
    const rt = scRnd(11);
    // the gopuram: a tall stepped tower, dark against the sky, a little lit from below
    r.fillStyle = '#4A3448'; r.beginPath(); r.moveTo(170, 1250);
    for (let i = 0; i < 7; i++) { const y = 1250 - i * 90, hw = 330 - i * 34; r.lineTo(540 - hw, y); r.lineTo(540 - hw + 14, y - 90); }
    r.lineTo(470, 560); r.quadraticCurveTo(540, 500, 610, 560);
    for (let i = 6; i >= 0; i--) { const y = 1250 - i * 90, hw = 330 - i * 34; r.lineTo(540 + hw - 14, y - 90); r.lineTo(540 + hw, y); }
    r.closePath(); r.fill();
    for (let i = 0; i < 7; i++) { const y = 1250 - i * 90 - 20, hw = 310 - i * 34; r.fillStyle = 'rgba(240,170,120,.18)'; r.fillRect(540 - hw, y, hw * 2, 10); }
    // the walls either side, the colonnade, and the courtyard floor
    r.fillStyle = '#5A3E48'; r.fillRect(-40, 1060, w + 80, 260);
    for (let i = 0; i < 9; i++) { const px = -20 + i * 140; r.fillStyle = '#3E2A36'; r.fillRect(px, 1060, 44, 260); }
    const fg = r.createLinearGradient(0, 1300, 0, h - dy); fg.addColorStop(0, '#8A6A62'); fg.addColorStop(1, '#4A3A3A'); r.fillStyle = fg; r.fillRect(-40, 1300, w + 80, h - dy - 1300 + 40);
    // the gold flagstaff (dhwajastambha) just behind him
    const pg = r.createLinearGradient(520, 0, 560, 0); pg.addColorStop(0, '#FFE08A'); pg.addColorStop(.5, '#D8A030'); pg.addColorStop(1, '#8A5A10');
    r.fillStyle = pg; r.fillRect(522, 640, 36, 700);
    for (let i = 0; i < 9; i++) { r.fillStyle = '#FFE8A0'; r.fillRect(514, 680 + i * 70, 52, 8); }
    // lamps: rows along the walls and the floor, and scattered on the tower
    const lamp = (lx, ly, lr, a) => { const lg = r.createRadialGradient(lx, ly, 0, lx, ly, lr); lg.addColorStop(0, `rgba(255,230,160,${a})`); lg.addColorStop(.5, `rgba(255,170,70,${a * .6})`); lg.addColorStop(1, 'rgba(255,150,60,0)'); r.fillStyle = lg; r.fillRect(lx - lr, ly - lr, lr * 2, lr * 2); };
    for (let i = 0; i < 16; i++) lamp(30 + i * 68, 1180 + (i % 2) * 8, 26, .95);
    for (let i = 0; i < 12; i++) lamp(rt() * w, 1330 + rt() * 160, 30 + rt() * 20, .8);
    for (let i = 0; i < 12; i++) { const k = rt(); lamp(540 + (rt() - .5) * (500 - k * 300), 1200 - k * 600, 16, .7); }
    // a warm glow over the floor from the lamps
    r.fillStyle = 'rgba(255,170,90,.12)'; r.fillRect(-40, 1150, w + 80, 500);
    x.filter = window.SC_SHARP ? 'none' : 'blur(20px)'; x.drawImage(raw, -40, -40, w + 80, h + 80); x.filter = 'none';
    // bokeh drawn after the blur: crisp-edged discs, the way a lens draws out-of-focus lamps
    const rb = scRnd(17);
    x.save(); x.globalCompositeOperation = 'screen';
    for (let i = 0; i < 26; i++) {
      const bx = rb() * w, by = dy + 1120 + rb() * 360, br = 18 + rb() * 34;
      x.fillStyle = `rgba(255,${190 + rb() * 50 | 0},${110 + rb() * 60 | 0},${.18 + rb() * .22})`; x.beginPath(); x.arc(bx, by, br, 0, TAU); x.fill();
    }
    x.restore();
  });
  c.drawImage(cv, 0, 0);
}
