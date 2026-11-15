// sc_hanu.js: more Bal Hanuman for the Scribble style, in four looks (load after scribble.js and sc_cast.js).
// The poses are drawn in the reels' 1080 × 1920 frame (the same head and proportions as scHanuman), so a scene places
// them with a translate. Each takes a "look" that sets the strokes:
//   SCL.thread  thread art on dark paper: long thin strands, many loose hairs and loops
//   SCL.color   colour scribble on black: the default strokes with pale loops
//   SCL.pencil  coloured pencil on cream paper: short diagonal hatching, the paper's tooth showing
//   SCL.fur     the default (the "Breathe with…" reels)
//
// scBalHead(o)      the head; o: { key, look, eyes: 'closed' | 'open', gaze: [dx, dy], mouth: 'smile' | 'open' | 'o' }
// scHanuGada(look)  Bal Hanuman asleep hugging his gada, his cheek on its handle (pivots in SCHG)
// scHanuStone(look) Bal Hanuman hugging a floating stone with राम on it, his feet dangling below (pivots in SCHS)
// scHanuLeap(look)  Bal Hanuman leaping up at the sun, both arms reaching (pivots in SCHL)
// scHanuLeaf(look)  Bal Hanuman sitting in the rain under a banana leaf, a diya beside him (pivots in SCHR)
// Sets: scPaperDark, scPaperCream (sprites), scPeepal (hanging leaves), scThreadTemple (a shikhara in white thread),
// scMoonbeam, scPencilSun, scPencilHills, scRainNight (the blurred night forest), scRain (looping streaks), scBanana.

const SCL = {
  fur: {},
  thread: { len: 104, w: 1.05, curl: .72, hair: 1.5, outline: 16, dens: 1.55, under: .42, jit: .34, lt: .2, dk: .16 },
  color: { len: 70, w: 1.25, curl: .7, hair: 1.1, outline: 12, dens: 1.6, under: .38, inkCol: '#E9DFC8', jit: .32 },
  pencil: { len: 24, w: 1.05, curl: .18, follow: .5, hair: .22, outline: 4, inkCol: '#5A4636', under: .34, underBlur: 3, jit: .2, lt: .08, dk: .2, dens: 2.1, flow: -.95 },
};
// the face layer keeps its smooth skin in every look
const SCL_FACE = {
  fur: {}, thread: { len: 38, hair: .5, outline: 6, under: .8 }, color: { len: 34, hair: .4, outline: 6, under: .82, inkCol: '#E9DFC8' },
  pencil: { len: 16, w: .95, curl: .15, follow: .5, flow: -.95, hair: .1, outline: 2, inkCol: '#7A5A44', under: .62, underBlur: 2, dens: 2.2, dk: .12, lt: .06 },
};
const scLook = (look, L, face) => ({ ...L, ...(face ? SCL_FACE : SCL)[look || 'fur'], draw: L.draw, ink: L.ink, ...(L.keep || {}) });
const SCP = (look) => look === 'pencil' ? { tooth: .38 } : {};

// ---------- the head ----------
function scBalHead(o = {}) {
  const F = o.pal || SC_FUR, look = o.look || 'fur', key = `bh2-head-${o.key || look}`;
  const [gx, gy] = o.gaze || [0, 0];
  return scPart(key, [280, 850, 520, 420], [scLook(look, {
    len: 66, w: 1.5, dens: 1.7, follow: 1.2, hair: 1, outline: 9, curl: .6,
    flow: (x, y) => Math.atan2(y - 1100, x - 540),
    draw(c) {
      scBall(c, 352, 1112, 54, 56, [F.lt, F.fur, F.dk]); scBall(c, 728, 1112, 54, 56, [F.lt, F.fur, F.dk]);
      scBall(c, 540, 1094, 182, 160, [F.lt, F.fur, F.dk]);
      limb(c, [[512, 958], [522, 912], [556, 884], [598, 888], [612, 914], [596, 934], [576, 924]], [44, 36, 30, 24, 18, 14, 10], F.fur);
      c.save(); c.globalAlpha = .6; limb(c, [[520, 940], [532, 906], [560, 892]], [12, 10, 6], F.lt); c.restore();
    },
    keep: look === 'pencil' ? { flow: (x, y) => -.95 } : {},
  }), scLook(look, {
    len: 30, w: 1.2, dens: 1.5, flow: 0, follow: 1.1, hair: .3, outline: 4, inkCol: '#8A5536', under: .85, underBlur: 2, dk: .03, lt: .25, jit: .12,
    draw(c) {
      const cols = [F.faceLt, F.face, F.faceDk];
      c.save(); c.beginPath();
      c.ellipse(476, 1074, 76, 72, -.1, 0, TAU); c.ellipse(604, 1074, 76, 72, .1, 0, TAU); c.ellipse(540, 1164, 112, 74, 0, 0, TAU);
      const g = c.createRadialGradient(510, 1080, 10, 540, 1110, 170); g.addColorStop(0, cols[0]); g.addColorStop(.6, cols[1]); g.addColorStop(1, cols[2]);
      c.fillStyle = g; c.fill(); c.restore();
      scBall(c, 352, 1114, 30, 32, cols); scBall(c, 728, 1114, 30, 32, cols);
      [[436, 1150], [644, 1150]].forEach(([x, y]) => { const b = c.createRadialGradient(x, y, 2, x, y, 40); b.addColorStop(0, 'rgba(240,110,100,.6)'); b.addColorStop(1, 'rgba(240,110,100,0)'); c.fillStyle = b; c.fillRect(x - 45, y - 45, 90, 90); });
    },
    ink(c, rnd) {
      const I = F.ink;
      if (o.eyes === 'open') {
        // big round eyes, a bright catch-light in each, looking along the gaze
        [[482, 1080], [598, 1080]].forEach(([x, y]) => {
          c.save(); c.fillStyle = '#2A1A10'; c.beginPath(); c.ellipse(x + gx * 5, y + gy * 5, 21, 26, 0, 0, TAU); c.fill(); c.restore();
          scInk(c, [[x - 22, y - 2], [x - 12, y - 24], [x + 10, y - 26], [x + 22, y - 4]], 2, I, rnd, { alpha: .6 });
          scDot(c, x + gx * 9 - 7, y + gy * 9 - 9, 7.5, '#FFFFFF', rnd); scDot(c, x + gx * 9 + 7, y + gy * 9 + 9, 3, '#FFFFFF', rnd);
        });
        // brows lifted in delight
        scInk(c, [[452, 1030], [480, 1020], [508, 1028]], 3, F.faceDk, rnd); scInk(c, [[572, 1028], [600, 1020], [628, 1030]], 3, F.faceDk, rnd);
      } else {
        scInk(c, [[438, 1080], [458, 1094], [482, 1098], [506, 1092], [520, 1080]], 4.2, I, rnd);
        scInk(c, [[560, 1080], [574, 1092], [598, 1098], [622, 1094], [642, 1080]], 4.2, I, rnd);
        scInk(c, [[440, 1082], [428, 1078]], 2.4, I, rnd); scInk(c, [[640, 1082], [652, 1078]], 2.4, I, rnd);
      }
      scDot(c, 528, 1142, 4.2, I, rnd); scDot(c, 552, 1142, 4.2, I, rnd);
      if (o.mouth === 'open' || o.mouth === 'o') {   // an open, delighted mouth with a pink tongue
        const wide = o.mouth === 'open' ? 1 : .62;
        c.save(); c.beginPath(); c.moveTo(540 - 30 * wide, 1174); c.quadraticCurveTo(540, 1186, 540 + 30 * wide, 1174); c.quadraticCurveTo(540 + 22 * wide, 1214, 540, 1216); c.quadraticCurveTo(540 - 22 * wide, 1214, 540 - 30 * wide, 1174);
        c.fillStyle = '#6E1E18'; c.fill(); c.clip(); c.fillStyle = '#EE7E7A'; c.beginPath(); c.ellipse(540, 1214, 20 * wide, 13, 0, 0, TAU); c.fill(); c.restore();
        scInk(c, [[540 - 30 * wide, 1174], [540, 1186], [540 + 30 * wide, 1174]], 2.4, '#5A1A12', rnd, { alpha: .8 });
      } else scInk(c, [[512, 1180], [526, 1192], [540, 1195], [554, 1192], [568, 1180]], 3, '#7A3A26', rnd);
      scInk(c, [[540, 978], [540, 1016]], 9, '#E0401E', rnd, { jit: 1 }); scDot(c, 540, 1022, 4, '#F4C040', rnd);
      scDot(c, 408, 1006, 3.6, '#2A1C14', rnd);
      [[350, 1168], [730, 1168]].forEach(([x, y]) => { c.save(); c.strokeStyle = F.gold; c.lineWidth = 5; c.beginPath(); c.ellipse(x + (rnd() - .5) * 1.5, y, 13, 15, 0, 0, TAU); c.stroke(); c.strokeStyle = '#8A5A10'; c.lineWidth = 1.2; c.globalAlpha = .7; c.stroke(); c.restore(); });
    },
  }, true)], { seed: 11, ...SCP(look) });
}

// the trunk: a pear and a paler belly, the munja thread "/"
function scBalTrunk(c, F, a = 0) {
  c.save(); c.beginPath();
  c.moveTo(540, 1228); c.bezierCurveTo(640, 1228, 690, 1300, 696, 1400); c.bezierCurveTo(702, 1500, 640, 1556, 540, 1556);
  c.bezierCurveTo(440, 1556, 378, 1500, 384, 1400); c.bezierCurveTo(390, 1300, 440, 1228, 540, 1228); c.closePath();
  const g = c.createRadialGradient(490, 1330, 20, 540, 1400, 200); g.addColorStop(0, F.lt); g.addColorStop(.55, F.fur); g.addColorStop(1, F.dk);
  c.fillStyle = g; c.fill(); c.restore();
  c.save(); c.globalAlpha = .75; scBall(c, 540, 1430, 98, 104, ['#FFE6A8', F.lt, F.fur]); c.restore();
}
const scMunja = (c, rnd) => { scInk(c, [[652, 1262], [600, 1340], [530, 1430], [452, 1520]], 4.5, '#7A5A1C', rnd, { alpha: .55, jit: 1.2 }); scInk(c, [[650, 1260], [598, 1338], [528, 1428], [450, 1518]], 2.6, '#F2DC8A', rnd, { alpha: .9, jit: 1 }); };
function scLangot(c, F) {
  c.save(); c.beginPath(); c.moveTo(506, 1512); c.lineTo(574, 1512); c.quadraticCurveTo(586, 1570, 592, 1614); c.quadraticCurveTo(540, 1626, 488, 1614); c.quadraticCurveTo(494, 1570, 506, 1512); c.closePath();
  const g = c.createLinearGradient(500, 0, 590, 0); g.addColorStop(0, F.red); g.addColorStop(.6, F.red); g.addColorStop(1, F.redDk); c.fillStyle = g; c.fill(); c.restore();
  c.save(); c.strokeStyle = F.gold; c.lineWidth = 12; c.lineCap = 'round'; c.beginPath(); c.moveTo(436, 1488); c.quadraticCurveTo(540, 1530, 644, 1488); c.stroke(); c.restore();
}
// a small fist / hand: a fur ball with a peach palm showing
function scBalHand(c, F, x, y, r = 28, rot = 0, palm = true) {
  scBall(c, x, y, r * 1.1, r * .9, [F.lt, F.fur, F.dk], rot);
  if (palm) scBall(c, x + Math.cos(rot + 1.2) * r * .25, y + Math.sin(rot + 1.2) * r * .25, r * .72, r * .5, [F.faceLt, F.face, F.faceDk], rot);
}
// cross-legged legs and the tail, as in scHanuman, in a look
function scBalLegs(look, key) {
  const F = SC_FUR;
  return scPart(`bh2-legs-${key}`, [270, 1520, 540, 160], [scLook(look, {
    len: 84, w: 1.5, dens: 1.6, flow: 0, follow: .9, hair: .8, outline: 9, curl: .6,
    draw(c) {
      scBall(c, 395, 1592, 128, 62, scFurCols(), -.06); scBall(c, 685, 1592, 128, 62, scFurCols(), .06);
      limb(c, [[318, 1618], [470, 1630], [640, 1622]], [64, 62, 54], F.fur); limb(c, [[762, 1614], [610, 1628], [440, 1618]], [64, 62, 54], F.fur);
      c.save(); c.globalAlpha = .5; limb(c, [[330, 1606], [470, 1618], [600, 1612]], [16, 18, 12], F.lt); c.restore();
      const g = c.createLinearGradient(0, 1600, 0, 1665); g.addColorStop(0, 'rgba(120,60,10,0)'); g.addColorStop(1, 'rgba(110,52,8,.55)');
      c.save(); c.globalCompositeOperation = 'source-atop'; c.fillStyle = g; c.fillRect(250, 1580, 580, 100); c.restore();
    },
  }), scLook(look, {
    len: 18, w: 1.3, dens: 1.8, flow: .3, hair: .2, outline: 2, under: .95,
    draw(c) { scBall(c, 458, 1606, 34, 21, [F.faceLt, F.face, F.faceDk], -.35); scBall(c, 622, 1604, 34, 21, [F.faceLt, F.face, F.faceDk], .35); },
  }, true)], { seed: 5, ...SCP(look) });
}
function scBalTail(look, key, P, Wd) {
  const F = SC_FUR, xs = P.map(p => p[0]), ys = P.map(p => p[1]), x0 = Math.min(...xs) - 50, y0 = Math.min(...ys) - 50;
  return scPart(`bh2-tail-${key}`, [x0, y0, Math.max(...xs) + 50 - x0, Math.max(...ys) + 50 - y0], [scLook(look, {
    len: 64, w: 1.5, dens: 1.6, follow: 1.4, hair: .8, outline: 6, curl: .6,
    draw(c) {
      Wd = Wd || P.map((_, i) => 40 - 22 * i / (P.length - 1));
      limb(c, P, Wd, F.dk);
      c.save(); c.translate(-5, -4); limb(c, P, Wd.map(w => w * .8), F.fur); c.restore();
      c.save(); c.translate(-9, -6); c.globalAlpha = .5; limb(c, P.slice(1, -2), Wd.slice(1, -2).map(w => w * .3), F.lt); c.restore();
    },
  })], { seed: 3, ...SCP(look) });
}

// ---------- 1. asleep hugging his gada (thread art) ----------
// He sits cross-legged; the gada stands at his right (screen left), its head on the ground, the handle up to his
// cheek; both arms hug the handle and his head leans on it, face turned up to the moon.
const SCHG = { neck: [540, 1250], lap: [540, 1585], tailRoot: [640, 1600], tilt: -.3, ball: [244, 1052], knob: [222, 1640] };
const SC_GOLD = { lt: '#FFE9A0', base: '#E2A62E', dk: '#8A5612', ink: '#5A3A0C' };
function scGadaDesign(c, ball, knob, r = 88) {
  const [bx, by] = ball, [kx, ky] = knob, G = SC_GOLD, ang = Math.atan2(ky - by, kx - bx), nx = Math.cos(ang), ny = Math.sin(ang);
  // the shaft, with the light down its left side
  limb(c, [[bx + nx * r * .7, by + ny * r * .7], [kx, ky]], [44, 34], G.dk, false);
  c.save(); c.translate(-4, -1); limb(c, [[bx + nx * r * .7, by + ny * r * .7], [kx, ky]], [34, 26], G.base, false); c.restore();
  c.save(); c.translate(-9, 0); c.globalAlpha = .7; limb(c, [[bx + nx * r * .8, by + ny * r * .8], [kx, ky]], [10, 8], G.lt, false); c.restore();
  // collars on the shaft
  [.18, .5, .82].forEach(u => { const x = lerp(bx + nx * r, kx, u), y = lerp(by + ny * r, ky, u); scBall(c, x, y, 26, 12, [G.lt, G.base, G.dk], ang + Math.PI / 2); });
  scBall(c, kx, ky, 30, 30, [G.lt, G.base, G.dk]);
  // the head: a ribbed ovoid with a crown where the shaft enters and a spike below
  scBall(c, bx + nx * r * .92, by + ny * r * .92, 36, 20, [G.lt, G.base, G.dk], ang + Math.PI / 2);
  scBall(c, bx, by, r * .92, r, [G.lt, G.base, G.dk], ang + Math.PI / 2);
  scBall(c, bx - nx * r * 1.04, by - ny * r * 1.04, 16, 16, [G.lt, G.base, G.dk]);
}
function scGadaInk(c, rnd, ball, knob, r = 88) {
  const [bx, by] = ball, [kx, ky] = knob, ang = Math.atan2(ky - by, kx - bx), nx = Math.cos(ang), ny = Math.sin(ang), px = -ny, py = nx;
  for (let k = -2; k <= 2; k++) {   // meridian ribs
    const pts = []; for (let s = -1; s <= 1.0001; s += .25) { const u = s * r * .98, wv = Math.sqrt(Math.max(0, 1 - s * s)) * r * .88 * k / 2.6; pts.push([bx + nx * u + px * wv, by + ny * u + py * wv]); }
    scInk(c, pts, 2, SC_GOLD.ink, rnd, { alpha: .45 });
  }
  const eq = []; for (let s = -1; s <= 1.0001; s += .2) eq.push([bx + px * s * r * .9 + nx * Math.cos(s * 1.5) * 10, by + py * s * r * .9 + ny * Math.cos(s * 1.5) * 10]);
  scInk(c, eq, 3, SC_GOLD.ink, rnd, { alpha: .55 });
  [[-.35, -.35], [.3, -.42]].forEach(([u, v]) => scDot(c, bx + nx * u * r + px * v * r * .6, by + ny * u * r + py * v * r * .6, 5, '#FFF6D0', rnd));
}
function scHanuGada(look = 'thread') {
  const F = SC_FUR, k = 'gada-' + look, S = SCHG;
  const tail = scBalTail(look, k, [[600, 1612], [700, 1606], [790, 1560], [846, 1460], [850, 1340], [818, 1230], [806, 1130], [836, 1050], [884, 1028], [912, 1064], [896, 1100], [866, 1092]], [40, 38, 36, 34, 32, 30, 28, 26, 24, 22, 20, 18]);
  const legs = scBalLegs(look, k);
  const torso = scPart(`bh2-torso-${k}`, [370, 1220, 340, 400], [scLook(look, {
    len: 86, w: 1.5, dens: 1.6, flow: Math.PI / 2, follow: 1.1, hair: .8, outline: 8, curl: .6,
    draw(c) { scBalTrunk(c, F); }, ink: scMunja,
  }), scLook(look, { len: 24, w: 1.4, dens: 1.6, flow: 0, follow: .8, hair: .2, outline: 3, inkCol: '#4A1410', draw(c) { scLangot(c, F); } })], { seed: 7, ...SCP(look) });
  const gada = scPart(`bh2-gada-${look}`, [100, 900, 290, 790], [scLook(look, {
    len: 28, w: 1.3, dens: 1.7, follow: 1.4, hair: .25, outline: 4, inkCol: '#6A4510', under: .75, underBlur: 2, jit: .2, lt: .2, dk: .1,
    flow: Math.atan2(S.knob[1] - S.ball[1], S.knob[0] - S.ball[0]),
    draw(c) { scGadaDesign(c, S.ball, S.knob, 104); }, ink(c, rnd) { scGadaInk(c, rnd, S.ball, S.knob, 104); },
    keep: { hair: .3, outline: 5, len: look === 'thread' ? 46 : 28 },
  })], { seed: 13, ...SCP(look) });
  const arms = scPart(`bh2-arms-${k}`, [220, 1240, 560, 340], [scLook(look, {
    len: 64, w: 1.5, dens: 1.6, follow: 1.5, hair: .8, outline: 10, curl: .5, inkCol: '#5A3210',
    draw(c) {
      // his right arm (screen left) wrapped round the handle; his left resting on his knee
      limb(c, [[420, 1290], [360, 1300], [300, 1318], [262, 1330]], [58, 52, 46, 42], F.dk);
      limb(c, [[418, 1286], [358, 1296], [300, 1312], [264, 1324]], [46, 42, 38, 34], F.fur);
      limb(c, [[666, 1284], [710, 1360], [736, 1450], [734, 1530]], [70, 62, 54, 46], F.dk);
      limb(c, [[660, 1284], [704, 1360], [730, 1448], [728, 1526]], [56, 48, 42, 36], F.fur);
      c.save(); c.globalAlpha = .55; limb(c, [[400, 1280], [340, 1298]], [12, 8], F.lt); c.restore();
    },
  }), scLook(look, {
    len: 22, w: 1.3, dens: 1.8, flow: 0, follow: 1, hair: .25, outline: 2, under: .95,
    draw(c) { scBalHand(c, F, 252, 1334, 28, 1.9); scBalHand(c, F, 732, 1548, 34, .2); },
    ink(c, rnd) { [1322, 1334, 1346].forEach(y => scInk(c, [[236, y], [260, y + 3]], 1.6, '#6A3A12', rnd, { alpha: .6 })); },
  }, true)], { seed: 17, ...SCP(look) });
  const head = scBalHead({ look, key: 'gada-' + look, eyes: 'closed' });
  return { tail, legs, torso, gada, arms, head };
}

// ---------- 2. hugging a floating stone (colour scribble on black) ----------
const SCHS = { stone: [540, 1450, 300, 196], neck: [540, 1250], legL: [478, 1600], legR: [604, 1600] };
function scStonePath(c, cx, cy, rx, ry) {
  c.beginPath();
  for (let i = 0; i <= 96; i++) { const a = i / 96 * TAU, r = 1 + .06 * Math.sin(a * 3 + 1) + .04 * Math.sin(a * 7 + 2) + .025 * Math.sin(a * 13 + 4); const x = cx + Math.cos(a) * rx * r, y = cy + Math.sin(a) * ry * r * (Math.sin(a) > 0 ? 1.04 : 1); i ? c.lineTo(x, y) : c.moveTo(x, y); }
  c.closePath();
}
function scHanuStone(look = 'color') {
  const F = SC_FUR, k = 'stone-' + look, [sx, sy, rx, ry] = SCHS.stone;
  const tail = scBalTail(look, k, [[640, 1420], [760, 1380], [820, 1280], [830, 1180], [800, 1090], [820, 1010], [870, 990], [900, 1030], [880, 1066], [852, 1054]], [38, 36, 34, 32, 30, 28, 26, 24, 22, 20]);
  const back = scPart(`bh2-back-${k}`, [380, 1200, 320, 120], [scLook(look, {   // his shoulders, behind the stone
    len: 70, w: 1.5, dens: 1.6, flow: 0, follow: 1.1, hair: .8, outline: 6, curl: .6,
    draw(c) { scBall(c, 540, 1270, 150, 56, scFurCols()); },
  })], { seed: 19, ...SCP(look) });
  const stone = scPart(`bh2-stone-${look}`, [sx - rx - 20, sy - ry - 20, 2 * rx + 40, 2 * ry + 40], [scLook(look, {
    len: 46, w: 1.3, dens: 1.7, follow: 1.3, hair: .35, outline: 14, curl: .7, inkCol: '#20242A', under: .6, jit: .3, lt: .16, dk: .2,
    flow: (x, y) => Math.atan2(y - sy, x - sx) + Math.PI / 2,
    draw(c) {
      scStonePath(c, sx, sy, rx, ry);
      const g = c.createRadialGradient(sx - rx * .35, sy - ry * .5, 10, sx, sy, rx * 1.1); g.addColorStop(0, '#E2D6C0'); g.addColorStop(.45, '#A2927C'); g.addColorStop(1, '#4A4038');
      c.fillStyle = g; c.fill();
      // pitted, porous: a few darker hollows
      const r = scRnd(5); for (let i = 0; i < 26; i++) { const a = r() * TAU, d = Math.sqrt(r()) * .85; scBall(c, sx + Math.cos(a) * rx * d, sy + Math.sin(a) * ry * d, 8 + r() * 18, 6 + r() * 12, ['#6E665C', '#544C44', '#3A342E']); }
      // a flat lit top where he rests his chin, a dark wet underside
      c.save(); scStonePath(c, sx, sy, rx, ry); c.clip(); c.fillStyle = 'rgba(30,24,20,.45)'; c.beginPath(); c.ellipse(sx, sy + ry * 1.05, rx * 1.1, ry * .5, 0, 0, TAU); c.fill(); c.restore();
    },
    keep: { len: 30, hair: .15, outline: 7, under: .85, underBlur: 3, curl: .5, dens: 1.5 },
  })], { seed: 23, ...SCP(look) });
  const arms = scPart(`bh2-arms-${k}`, [250, 1220, 580, 290], [scLook(look, {
    len: 64, w: 1.5, dens: 1.6, follow: 1.5, hair: .8, outline: 8, curl: .5, inkCol: '#5A3210',
    draw(c) {
      [[1, 0], [-1, 1080]].forEach(([m, o]) => {
        const P = [[420, 1262], [356, 1280], [306, 1330], [290, 1398], [312, 1452]].map(([x, y]) => [m > 0 ? x : o - x, y]);
        limb(c, P, [60, 54, 48, 44, 40], F.dk); c.save(); c.translate(m * 2, -3); limb(c, P, [48, 44, 38, 34, 30], F.fur); c.restore();
      });
    },
  }), scLook(look, {
    len: 22, w: 1.3, dens: 1.8, flow: 0, follow: 1, hair: .25, outline: 2, under: .95,
    draw(c) { scBalHand(c, F, 322, 1460, 30, .9); scBalHand(c, F, 758, 1460, 30, Math.PI - .9); },
    ink(c, rnd) { [[1, 322], [-1, 758]].forEach(([m, x]) => [-10, 0, 10].forEach(d => scInk(c, [[x + m * 12, 1462 + d], [x + m * 26, 1466 + d * 1.2]], 1.5, '#6A3A12', rnd, { alpha: .55 }))); },
  }, true)], { seed: 29, ...SCP(look) });
  const leg = (side) => {
    const m = side === 'L' ? -1 : 1, [lx, ly] = side === 'L' ? SCHS.legL : SCHS.legR;
    return scPart(`bh2-leg${side}-${k}`, [lx - 70, ly - 30, 140, 170], [scLook(look, {
      len: 50, w: 1.4, dens: 1.6, flow: Math.PI / 2, follow: 1.2, hair: .7, outline: 5, curl: .6,
      draw(c) { limb(c, [[lx, ly], [lx + m * 4, ly + 50], [lx + m * 8, ly + 84]], [52, 44, 38], F.fur); },
    }), scLook(look, {
      len: 16, w: 1.2, dens: 1.8, flow: 0, follow: 1, hair: .15, outline: 2, under: .95,
      draw(c) { scBall(c, lx + m * 14, ly + 104, 38, 22, [F.faceLt, F.face, F.faceDk], m * .15); },
      ink(c, rnd) { [-16, -4, 8].forEach(d => scInk(c, [[lx + m * 14 + d + m * 18, ly + 96], [lx + m * 14 + d + m * 18, ly + 112]], 1.4, F.faceDk, rnd, { alpha: .6 })); },
    }, true)], { seed: side === 'L' ? 31 : 37, ...SCP(look) });
  };
  const head = scBalHead({ look, key: 'stone-' + look, eyes: 'closed' });
  return { tail, back, stone, arms, legL: leg('L'), legR: leg('R'), head };
}

// ---------- 3. leaping at the sun (coloured pencil) ----------
// His body runs up to the right, both arms reaching, eyes wide on the "fruit", his tail swirling below.
const SCHL = { neck: [578, 1276], tilt: .32, body: [500, 1440], tailRoot: [430, 1530] };
function scHanuLeap(look = 'pencil') {
  const F = SC_FUR, k = 'leap-' + look;
  const tail = scBalTail(look, k, [[440, 1540], [360, 1520], [270, 1530], [210, 1590], [214, 1660], [262, 1690], [306, 1662], [292, 1626]], [36, 34, 32, 30, 26, 22, 18, 14]);
  const body = scPart(`bh2-body-${k}`, [240, 1000, 620, 840], [scLook(look, {
    len: 70, w: 1.5, dens: 1.6, follow: 1.3, hair: .8, outline: 10, curl: .6, flow: -1.1,
    draw(c) {
      // the legs trailing: his right (screen left) bent back at the knee, his left stretched down
      limb(c, [[436, 1530], [352, 1590], [318, 1700]], [86, 70, 56], F.dk); c.save(); c.translate(-3, -3); limb(c, [[436, 1530], [352, 1590], [318, 1700]], [72, 60, 46], F.fur); c.restore();
      limb(c, [[502, 1560], [478, 1660], [418, 1760]], [86, 72, 58], F.dk); c.save(); c.translate(-3, -3); limb(c, [[502, 1560], [478, 1660], [418, 1760]], [72, 60, 48], F.fur); c.restore();
      // the trunk, leaning up to the right
      c.save(); c.translate(500, 1420); c.rotate(.42);
      const g = c.createRadialGradient(-40, -60, 20, 0, 0, 200); g.addColorStop(0, F.lt); g.addColorStop(.55, F.fur); g.addColorStop(1, F.dk);
      c.fillStyle = g; c.beginPath(); c.ellipse(0, 0, 130, 168, 0, 0, TAU); c.fill();
      c.globalAlpha = .75; scBall(c, -6, 30, 86, 100, ['#FFE6A8', F.lt, F.fur]); c.restore();
      // the arms reaching up: his left (screen right) out past his head, his right straight up beside it
      limb(c, [[630, 1330], [720, 1250], [800, 1150], [842, 1090]], [62, 54, 48, 44], F.dk); c.save(); c.translate(-3, -3); limb(c, [[630, 1330], [720, 1250], [800, 1150], [842, 1090]], [50, 44, 38, 34], F.fur); c.restore();
      limb(c, [[452, 1300], [414, 1200], [410, 1100], [432, 1030]], [62, 54, 48, 44], F.dk); c.save(); c.translate(-3, -3); limb(c, [[452, 1300], [414, 1200], [410, 1100], [432, 1030]], [50, 44, 38, 34], F.fur); c.restore();
    },
  }), scLook(look, {
    len: 24, w: 1.4, dens: 1.6, flow: 0, follow: .8, hair: .2, outline: 3, inkCol: '#4A1410',
    draw(c) {   // the langot at his hips, a fluttering end
      c.save(); c.translate(472, 1528); c.rotate(.42); c.fillStyle = F.red; c.beginPath(); c.ellipse(0, 0, 96, 40, 0, 0, TAU); c.fill();
      c.strokeStyle = F.gold; c.lineWidth = 12; c.beginPath(); c.ellipse(0, -16, 100, 30, 0, Math.PI * 1.05, Math.PI * 1.95); c.stroke(); c.restore();
      limb(c, [[440, 1560], [400, 1600], [356, 1610], [318, 1636]], [30, 26, 22, 14], F.red);
    },
  }), scLook(look, {
    len: 18, w: 1.3, dens: 1.8, flow: .3, follow: 1, hair: .2, outline: 2, under: .95,
    draw(c) {   // open hands, fingers spread at the sun; the soles of his feet
      [[848, 1074, -.7], [438, 1012, -1.4]].forEach(([x, y, a]) => {
        scBall(c, x, y, 30, 26, [F.faceLt, F.face, F.faceDk], a);
        [-.7, -.25, .2, .65].forEach((d, i) => { const r = 38 + (i === 1 || i === 2 ? 6 : 0), fx = x + Math.cos(a + d) * r * .9, fy = y + Math.sin(a + d) * r * .9; scBall(c, fx, fy, 15, 8.5, [F.faceLt, F.face, F.faceDk], a + d); });
        const th = a + 1.35; scBall(c, x + Math.cos(th) * 30, y + Math.sin(th) * 30, 14, 9, [F.faceLt, F.face, F.faceDk], th);
      });
      scBall(c, 306, 1722, 30, 42, [F.faceLt, F.face, F.faceDk], .5); scBall(c, 404, 1786, 30, 42, [F.faceLt, F.face, F.faceDk], .9);
    },
  }, true)], { seed: 41, ...SCP(look) });
  const head = scBalHead({ look, key: 'leap-' + look, eyes: 'open', gaze: [.7, -.7], mouth: 'open' });
  return { tail, body, head };
}

// ---------- 4. under a banana leaf in the rain, a diya beside him ----------
const SCHR = { neck: [540, 1250], lap: [540, 1585], stemHand: [742, 1146], leafRoot: [736, 836], diya: [262, 1640] };
function scHanuLeaf(look = 'fur') {
  const F = SC_FUR, k = 'leaf-' + look;
  const tail = scBalTail(look, k, [[600, 1612], [700, 1606], [800, 1590], [870, 1530], [900, 1450], [884, 1380], [850, 1360], [826, 1390], [846, 1418]], [40, 38, 36, 34, 30, 26, 22, 18, 16]);
  const legs = scBalLegs(look, k);
  const torso = scPart(`bh2-torso-${k}`, [370, 1220, 340, 400], [scLook(look, {
    len: 86, w: 1.5, dens: 1.6, flow: Math.PI / 2, follow: 1.1, hair: .8, outline: 8, curl: .6,
    draw(c) { scBalTrunk(c, F); }, ink: scMunja,
  }), scLook(look, { len: 24, w: 1.4, dens: 1.6, flow: 0, follow: .8, hair: .2, outline: 3, inkCol: '#4A1410', draw(c) { scLangot(c, F); } })], { seed: 7, ...SCP(look) });
  const arms = scPart(`bh2-arms-${k}`, [220, 1080, 600, 500], [scLook(look, {
    len: 64, w: 1.5, dens: 1.6, follow: 1.5, hair: .8, outline: 10, curl: .5, inkCol: '#5A3210',
    draw(c) {
      // his left arm (screen right) up, holding the stem; his right cupped round the diya's flame
      limb(c, [[664, 1290], [736, 1262], [762, 1200], [748, 1160]], [58, 52, 46, 42], F.dk); c.save(); c.translate(-3, -3); limb(c, [[664, 1290], [736, 1262], [762, 1200], [748, 1160]], [46, 42, 38, 34], F.fur); c.restore();
      limb(c, [[418, 1290], [370, 1360], [326, 1430], [300, 1480]], [58, 52, 46, 42], F.dk); c.save(); c.translate(-3, -3); limb(c, [[418, 1290], [370, 1360], [326, 1430], [300, 1480]], [46, 42, 38, 34], F.fur); c.restore();
    },
  }), scLook(look, {
    len: 20, w: 1.3, dens: 1.8, flow: 0, follow: 1, hair: .25, outline: 2, under: .95,
    draw(c) { scBalHand(c, F, 744, 1150, 28, -1.6); scBalHand(c, F, 292, 1494, 30, 2.4); },
    ink(c, rnd) { [1136, 1150, 1164].forEach(y => scInk(c, [[730, y], [760, y + 2]], 1.5, '#6A3A12', rnd, { alpha: .55 })); },
  }, true)], { seed: 43, ...SCP(look) });
  const head = scBalHead({ look, key: 'leaf-' + look, eyes: 'open', gaze: [-.3, -.9], mouth: 'o' });
  const leaf = scBanana(look);
  return { tail, legs, torso, arms, head, leaf };
}
// a banana leaf held up as an umbrella: the stem from his hand, the blade arching over to the left
const SCBL = { mid: [[736, 836], [640, 760], [500, 744], [360, 786], [236, 874], [150, 980]] };
function scBanana(look = 'fur') {
  const M = SCBL.mid;
  return scPart(`bh2-banana-${look}`, [60, 620, 760, 560], [scLook(look, {
    len: 56, w: 1.4, dens: 1.6, follow: .7, hair: .4, outline: 10, curl: .4, inkCol: '#16301A', under: .6, jit: .26,
    flow: (x, y) => { // the veins run out from the midrib, down and outward
      let best = 0, bd = 1e9; M.forEach((p, i) => { const d = Math.hypot(x - p[0], y - p[1]); if (d < bd) { bd = d; best = i; } });
      const a = M[Math.max(0, best - 1)], b = M[Math.min(M.length - 1, best + 1)], ta = Math.atan2(b[1] - a[1], b[0] - a[0]);
      return ta + (y > lerp(a[1], b[1], .5) ? -1.2 : 1.2);
    },
    draw(c) {
      // the blade: the far half darker, the near half drooping lower and lit
      limb(c, M.map(([x, y]) => [x, y - 40]), [30, 150, 190, 170, 120, 30], '#2F6A30');
      limb(c, M.map(([x, y]) => [x, y + 46]), [30, 170, 220, 200, 140, 30], '#4E9A44');
      c.save(); c.globalAlpha = .5; limb(c, M.map(([x, y]) => [x, y + 70]), [10, 70, 100, 90, 60, 10], '#8CC85E'); c.restore();
    },
    ink(c, rnd) {
      scInk(c, M, 7, '#C8D88A', rnd, { alpha: .9 });   // the pale midrib
      for (let i = 0; i < 26; i++) { const u = (i + .5) / 26 * (M.length - 1), j = Math.min(M.length - 2, Math.floor(u)), f = u - j, x = lerp(M[j][0], M[j + 1][0], f), y = lerp(M[j][1], M[j + 1][1], f);
        scInk(c, [[x, y + 6], [x - 24, y + 70], [x - 56, y + 140 * (1 - Math.abs(u / 5 - .45))]], 1.4, '#2A5A28', rnd, { alpha: .45 });
        scInk(c, [[x, y - 6], [x - 18, y - 50], [x - 40, y - 100 * (1 - Math.abs(u / 5 - .45))]], 1.2, '#1E4220', rnd, { alpha: .4 }); }
      // the stem down to his hand
      scInk(c, [[736, 836], [742, 960], [744, 1070], [744, 1150]], 14, '#6E8A3A', rnd, { jit: .6 }); scInk(c, [[732, 840], [738, 960], [740, 1070]], 4, '#B8CC7A', rnd, { alpha: .6 });
    },
  })], { seed: 47, ...SCP(look) });
}

// ---------- the sets ----------
// dark handmade paper: mottled, with fibres
function scPaperDark(c, w = 1080, h = 2340, key = 'dk') {
  c.drawImage(sprite(`paperdk-${key}-${w}x${h}`, w, h, (x) => {
    const id = x.createImageData(w, h), d = id.data;
    for (let y = 0; y < h; y++) for (let X = 0; X < w; X++) {
      const n = scFbm2(X / 260, y / 260, 3, 3) * 9 + scNoise2(X / 2, y / 2, 7) * 5 + scNoise2(X / 7, y / 7, 9) * 4, i = (y * w + X) * 4;
      d[i] = 30 + n; d[i + 1] = 27 + n; d[i + 2] = 23 + n * .9; d[i + 3] = 255;
    }
    x.putImageData(id, 0, 0);
    const r = scRnd(77); x.lineCap = 'round';
    for (let i = 0; i < 900; i++) {
      const px = r() * w, py = r() * h, a = r() * TAU, L = 6 + r() * 26;
      x.strokeStyle = r() < .5 ? 'rgba(80,72,60,.35)' : 'rgba(8,6,4,.4)'; x.lineWidth = .6 + r() * .6;
      x.beginPath(); x.moveTo(px, py); x.quadraticCurveTo(px + Math.cos(a + .6) * L * .5, py + Math.sin(a + .6) * L * .5, px + Math.cos(a) * L, py + Math.sin(a) * L); x.stroke();
    }
  }), 0, 0);
}
// cream drawing paper: warm, a soft tooth, a faint vignette
function scPaperCream(c, w = 1080, h = 2340) {
  c.drawImage(sprite(`papercr-${w}x${h}`, w, h, (x) => {
    const id = x.createImageData(w, h), d = id.data;
    for (let y = 0; y < h; y++) for (let X = 0; X < w; X++) {
      const n = scFbm2(X / 300, y / 300, 4, 3) * 6 + scNoise2(X / 1.8, y / 1.8, 5) * 5 + scNoise2(X / 6, y / 9, 6) * 4, i = (y * w + X) * 4;
      const v = 1 - .1 * Math.pow(Math.hypot((X - w / 2) / w, (y - h / 2) / h) * 1.6, 2);
      d[i] = (243 + n) * v; d[i + 1] = (232 + n) * v; d[i + 2] = (211 + n * .9) * v; d[i + 3] = 255;
    }
    x.putImageData(id, 0, 0);
  }), 0, 0);
}
// hanging peepal leaves on a branch: heart-shaped with a long drip tip. leaves: [[x, y (stalk end), size, angle]]
function scPeepal(key, branch, leaves, look = 'thread') {
  const xs = [...branch.map(p => p[0]), ...leaves.map(l => l[0])], ys = [...branch.map(p => p[1]), ...leaves.map(l => l[1])];
  const x0 = Math.min(...xs) - 140, y0 = Math.min(...ys) - 60, x1 = Math.max(...xs) + 140, y1 = Math.max(...ys) + 260;
  const leafPath = (c, x, y, s, a) => {
    c.save(); c.translate(x, y); c.rotate(a); c.scale(s, s); c.beginPath();
    c.moveTo(0, 0); c.bezierCurveTo(-70, 10, -78, 90, -30, 140); c.quadraticCurveTo(-8, 162, 0, 220); c.quadraticCurveTo(8, 162, 30, 140); c.bezierCurveTo(78, 90, 70, 10, 0, 0); c.closePath(); c.restore();
  };
  return scPart(`peepal-${key}`, [x0, y0, x1 - x0, y1 - y0], [scLook(look, {
    len: 30, w: 1.05, dens: 1.5, follow: 1.8, hair: .25, outline: 3, curl: .45, inkCol: '#0E1A0C', under: .78, underBlur: 2, jit: .3, soft: 5,
    flow: Math.PI / 2, keep: { len: 30, hair: .25, outline: 3, under: .78, dens: 1.5 },
    draw(c) {
      limb(c, branch, branch.map((_, i) => 26 - 16 * i / (branch.length - 1)), '#4A3624');
      leaves.forEach(([x, y, s, a], i) => {
        const r = scRnd(i + 3), lit = r();
        leafPath(c, x, y, s, a);
        const g = c.createLinearGradient(x - 60 * s, y, x + 60 * s, y + 200 * s); g.addColorStop(0, lit > .5 ? '#B8D46A' : '#7FAE48'); g.addColorStop(.6, lit > .5 ? '#6E9E3C' : '#4C7A2E'); g.addColorStop(1, '#24461C');
        c.fillStyle = g; c.fill();
      });
    },
    ink(c, rnd) {
      leaves.forEach(([x, y, s, a]) => {   // a pale thread round each leaf, and the veins
        for (let p = 0; p < 2; p++) { leafPath(c, x + (rnd() - .5) * 2, y + (rnd() - .5) * 2, s, a); c.strokeStyle = p ? 'rgba(20,34,14,.7)' : 'rgba(214,230,160,.75)'; c.lineWidth = p ? 1 : 1.5; c.stroke(); }
        const P = (u, v) => [x + (Math.cos(a) * u - Math.sin(a) * v) * s, y + (Math.sin(a) * u + Math.cos(a) * v) * s];
        scInk(c, [P(0, -14), P(0, 0), P(0, 80), P(0, 150), P(0, 210)], 1.6, 'rgba(230,236,190,.8)', rnd, { alpha: .7 });
        [30, 60, 92, 122].forEach(v => { scInk(c, [P(0, v), P(-26, v + 18), P(-48, v + 28)], 1, 'rgba(220,232,180,.7)', rnd, { alpha: .45 }); scInk(c, [P(0, v), P(26, v + 18), P(48, v + 28)], 1, 'rgba(220,232,180,.7)', rnd, { alpha: .45 }); });
      });
    },
  })], { seed: 53 + key.length });
}
// a shikhara temple drawn in thin pale thread, 4 boiling variants. x, y: the base centre; s: scale
function scThreadTemple(c, t, x, y, s = 1, a = .5) {
  const v = SC.raw ? 0 : Math.floor(t * SC.boil + 1e-6) % SC.variants;
  const cv = sprite(`ttemple-${v}`, 520, 900, (g) => {
    const rnd = scRnd(61 + v * 17), X = 260, B = 880, I = 'rgba(232,224,206,.9)';
    const L = (pts, w = 1.2, al = .55) => { for (let p = 0; p < 3; p++) scInk(g, pts, w * (.6 + rnd() * .6), I, rnd, { alpha: al * (.5 + rnd() * .5), jit: 2.4, passes: 1 }); };
    // the plinth, the hall with its pillars and doorway, the curved tower in courses, the amalaka and kalash
    L([[X - 230, B], [X + 230, B]]); L([[X - 220, B - 30], [X + 220, B - 30]]); L([[X - 230, B], [X - 220, B - 30]]); L([[X + 230, B], [X + 220, B - 30]]);
    L([[X - 190, B - 30], [X - 190, B - 250]]); L([[X + 190, B - 30], [X + 190, B - 250]]);
    [-120, -60, 60, 120].forEach(d => L([[X + d, B - 30], [X + d, B - 240]], .9, .4));
    L([[X - 40, B - 30], [X - 40, B - 170], [X, B - 200], [X + 40, B - 170], [X + 40, B - 30]], 1.4, .7);
    L([[X - 210, B - 250], [X + 210, B - 250]]); L([[X - 200, B - 280], [X + 200, B - 280]]);
    for (let k = 0; k < 12; k++) {
      const u = k / 12, u2 = (k + 1) / 12, hw = q => 180 * (1 - Math.pow(q, 1.6) * .82), yy = q => B - 280 - q * 480;
      L([[X - hw(u), yy(u)], [X - hw(u) * .98, yy(u) - 20], [X - hw(u2), yy(u2)]], 1.1, .5); L([[X + hw(u), yy(u)], [X + hw(u) * .98, yy(u) - 20], [X + hw(u2), yy(u2)]], 1.1, .5);
      L([[X - hw(u2), yy(u2)], [X + hw(u2), yy(u2)]], .8, .32);
      L([[X - hw(u2) * .35, yy(u2)], [X - hw(u2) * .35, yy(u)]], .7, .25); L([[X + hw(u2) * .35, yy(u2)], [X + hw(u2) * .35, yy(u)]], .7, .25);
    }
    for (let i = 0; i < 3; i++) L(Array.from({ length: 13 }, (_, j) => { const a = j / 12 * TAU; return [X + Math.cos(a) * 52, B - 776 + Math.sin(a) * 16]; }), 1.1, .6);
    L([[X, B - 792], [X - 14, B - 812], [X, B - 846], [X + 14, B - 812], [X, B - 792]], 1.2, .7); L([[X, B - 846], [X, B - 880]], 1, .6);
    L([[X, B - 880], [X + 40, B - 868], [X, B - 856]], 1, .6);
  });
  c.save(); c.globalAlpha *= a; c.translate(x, y); c.scale(s, s); c.drawImage(cv, -260, -880); c.restore();
}
// a beam of moonlight from (x0, y0) to (x1, y1), w0 → w1 wide, in thin threads; shimmer 0..1
function scMoonbeam(c, t, x0, y0, x1, y1, w0, w1, a = 1) {
  const v = SC.raw ? 0 : Math.floor(t * SC.boil + 1e-6) % SC.variants, L = Math.hypot(x1 - x0, y1 - y0), ang = Math.atan2(y1 - y0, x1 - x0);
  const cv = sprite(`beam-${Math.round(L)}-${w0}-${w1}-${v}`, Math.ceil(L) + 40, w1 + 80, (g, cw, ch) => {
    const rnd = scRnd(71 + v * 11), cy = ch / 2;
    const grad = g.createLinearGradient(0, 0, L, 0); grad.addColorStop(0, 'rgba(255,240,200,.30)'); grad.addColorStop(.7, 'rgba(255,236,190,.12)'); grad.addColorStop(1, 'rgba(255,236,190,0)');
    g.fillStyle = grad; g.filter = 'blur(10px)'; g.beginPath(); g.moveTo(0, cy - w0 / 2); g.lineTo(L, cy - w1 / 2); g.lineTo(L, cy + w1 / 2); g.lineTo(0, cy + w0 / 2); g.closePath(); g.fill(); g.filter = 'none';
    g.lineCap = 'round';
    for (let i = 0; i < 170; i++) {
      const s = rnd() * 2 - 1, u0 = rnd() * .5, u1 = u0 + .3 + rnd() * .6, wob = (rnd() - .5) * 18;
      g.strokeStyle = rnd() < .7 ? 'rgba(255,238,196,1)' : 'rgba(255,214,140,1)'; g.globalAlpha = .05 + rnd() * .2 * (1 - u0); g.lineWidth = .6 + rnd() * .9;
      g.beginPath(); g.moveTo(u0 * L, cy + s * lerp(w0, w1, u0) / 2); g.quadraticCurveTo((u0 + u1) / 2 * L, cy + s * lerp(w0, w1, (u0 + u1) / 2) / 2 + wob, Math.min(u1, 1) * L, cy + s * lerp(w0, w1, Math.min(u1, 1)) / 2); g.stroke();
    }
  });
  c.save(); c.globalCompositeOperation = 'screen'; c.globalAlpha *= a; c.translate(x0, y0); c.rotate(ang); c.drawImage(cv, 0, -cv.height / 2); c.restore();
}
// the moon in thread: a pale disc, its seas faint, a glow
function scThreadMoon(c, t, x, y, r, a = 1) {
  glow(c, x, y, r * 5, '#FFF2D0', .22 * a, 'screen'); glow(c, x, y, r * 2, '#FFF6E0', .4 * a, 'screen');
  const P = window._tmoon || (window._tmoon = scPart('tmoon', [400, 400, 280, 280], [{
    len: 34, w: 1.1, dens: 1.8, follow: 1.4, hair: .6, outline: 6, curl: .7, under: .8, inkCol: '#C8BEA8', jit: .12, lt: .3, dk: .06,
    flow: (px, py) => Math.atan2(py - 540, px - 540) + Math.PI / 2,
    draw(g) {
      scBall(g, 540, 540, 120, 120, ['#FFFFFA', '#F4EEDC', '#D8CEB4']);
      [[500, 510, 34, 26], [575, 560, 28, 22], [520, 590, 20, 16], [585, 495, 16, 13]].forEach(([mx, my, rx, ry]) => scBall(g, mx, my, rx, ry, ['#E0D8C4', '#D2C8B0', '#C8BEA4']));
    },
  }], { seed: 3 }));
  scDraw(c, P, t, { ax: 540, ay: 540, dx: x - 540, dy: y - 540, sx: r / 120, alpha: a });
}

// ---------- the pencil sun and hills ----------
function scPencilSun(c, t, x, y, r, k = 1) {
  const v = SC.raw ? 0 : Math.floor(t * SC.boil + 1e-6) % SC.variants;
  const P = window._psun || (window._psun = scPart('psun', [540 - 190, 540 - 190, 380, 380], [{
    ...SCL.pencil, len: 26, dens: 2.2, under: .42, outline: 6, inkCol: '#B86A10', flow: -.95,
    draw(g) { scBall(g, 540, 540, 170, 170, ['#FFE680', '#FFB628', '#F07A12'], 0, -.2, -.25); },
    ink(g, rnd) { for (let i = 0; i < 3; i++) { g.save(); g.strokeStyle = '#C8740E'; g.globalAlpha = .4; g.lineWidth = 1.4; g.beginPath(); g.ellipse(540 + (rnd() - .5) * 4, 540 + (rnd() - .5) * 4, 168 + rnd() * 6, 168 + rnd() * 6, 0, 0, TAU); g.stroke(); g.restore(); } },
  }], { seed: 5, tooth: .3 }));
  // rays: hand-drawn wavy strokes in gold and orange, turning slowly; 4 boiling variants
  const rays = sprite(`psun-rays-${v}`, 900, 900, (g) => {
    const rnd = scRnd(81 + v * 7);
    for (let i = 0; i < 36; i++) {
      const a = i / 36 * TAU + (rnd() - .5) * .04, long = i % 2 ? 1 : 1.35, r0 = 200, r1 = r0 + (90 + rnd() * 30) * long;
      const pts = []; for (let s = 0; s <= 6; s++) { const rr = lerp(r0, r1, s / 6), wv = Math.sin(s * 1.6 + i) * 10 * (s / 6); pts.push([450 + Math.cos(a) * rr - Math.sin(a) * wv, 450 + Math.sin(a) * rr + Math.cos(a) * wv]); }
      scInk(g, pts, 3 * (i % 2 ? .8 : 1.1), i % 2 ? '#E89A1C' : '#D2601A', rnd, { alpha: .7, jit: 1.6 });
    }
  });
  glow(c, x, y, r * 3.2, '#FFD27A', .28 * k, 'multiply');
  c.save(); c.translate(x, y); c.rotate(t / 6 * TAU / 18); c.scale(r / 170, r / 170); c.globalAlpha *= k; c.drawImage(rays, -450, -450); c.restore();
  scDraw(c, P, t, { ax: 540, ay: 540, dx: x - 540, dy: y - 540, sx: r / 170 });
}
// soft pencil clouds and far hills, hatched (a sprite with 4 boiling variants). o: { key, y, h, w }
function scPencilHills(c, t, o = {}) {
  const v = SC.raw ? 0 : Math.floor(t * SC.boil + 1e-6) % SC.variants, w = o.w || 1080, h = o.h || 520, Y = o.y || 1800;
  const cv = sprite(`phills-${o.key || ''}-${v}`, w, h, (g) => {
    const rnd = scRnd(91 + v * 5);
    const ridgeY = (X, base, amp, sc, sd) => base - amp * (scFbm2(X / sc, sd, sd, 3) * .5 + .5);
    [[230, 150, 220, 2, ['#C9A06A', '#A87C4A']], [330, 120, 160, 5, ['#9A7A58', '#7A5A3E']]].forEach(([base, amp, sc, sd, cols]) => {
      for (let X = -10; X < w + 10; X += 3) {
        const top = ridgeY(X, base, amp, sc, sd);
        for (let k = 0; k < 2; k++) { const y0 = top + rnd() * 12, len = 18 + rnd() * 60; g.strokeStyle = cols[k]; g.globalAlpha = .18 + rnd() * .28; g.lineWidth = .9 + rnd() * .5; g.beginPath(); g.moveTo(X, y0); g.lineTo(X - len * .55, y0 + len * .8); g.stroke(); }
      }
      const pts = []; for (let X = -10; X <= w + 10; X += 18) pts.push([X, ridgeY(X, base, amp, sc, sd)]);
      scInk(g, pts, 1.6, cols[1], rnd, { alpha: .65, jit: 1.4 });
    });
  });
  c.save(); c.globalCompositeOperation = 'multiply'; c.drawImage(cv, 0, Y); c.restore();
}
function scPencilCloud(c, t, x, y, s, seed) {
  const v = SC.raw ? 0 : Math.floor(t * SC.boil + 1e-6) % SC.variants;
  const cv = sprite(`pcloud-${seed}-${v}`, 420, 200, (g) => {
    const rnd = scRnd(seed * 13 + v * 3), lumps = [[110, 130, 60], [170, 100, 70], [240, 96, 64], [300, 124, 52], [200, 140, 70]];
    g.save(); g.beginPath(); lumps.forEach(([lx, ly, r]) => { g.moveTo(lx + r, ly); g.ellipse(lx, ly, r, r * .8, 0, 0, TAU); }); g.rect(60, 100, 300, 50); g.clip();
    for (let i = 0; i < 420; i++) { const X = 40 + rnd() * 340, Y = 30 + rnd() * 130; g.strokeStyle = rnd() < .7 ? '#90A8CC' : '#B4C6E2'; g.globalAlpha = .45 + rnd() * .35; g.lineWidth = .9 + rnd() * .5; g.beginPath(); g.moveTo(X, Y); g.lineTo(X - 16, Y + 22); g.stroke(); }
    g.restore(); g.globalAlpha = 1;
    lumps.forEach(([lx, ly, r]) => { const pts = []; for (let a = Math.PI * .95; a <= Math.PI * 2.05; a += .2) pts.push([lx + Math.cos(a) * r, ly + Math.sin(a) * r * .8]); scInk(g, pts, 1.6, '#7A8CA8', rnd, { alpha: .55, jit: 1.6 }); });
    scInk(g, [[60, 150], [360, 150]], 1.4, '#7A8CA8', rnd, { alpha: .45 });
  });
  c.save(); c.globalCompositeOperation = 'multiply'; c.translate(x, y); c.scale(s, s); c.drawImage(cv, -210, -100); c.restore();
}

// ---------- the rainy night ----------
function scRainNight(c, w = 1080, h = 2340) {
  c.drawImage(sprite(`rainnight-${w}x${h}`, w, h, (x) => {
    const raw = scCanvas(w, h), r = raw.getContext('2d');
    const g = r.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#0B1A20'); g.addColorStop(.35, '#163038'); g.addColorStop(.7, '#1C3A40'); g.addColorStop(1, '#0E1E22'); r.fillStyle = g; r.fillRect(0, 0, w, h);
    // a pale break in the clouds behind the trees
    const m = r.createRadialGradient(560, 820, 20, 560, 820, 700); m.addColorStop(0, 'rgba(170,210,214,.5)'); m.addColorStop(1, 'rgba(170,210,214,0)'); r.fillStyle = m; r.fillRect(0, 0, w, h);
    // far trees, then nearer trees, in mist
    const trees = (base, n, hgt, col, sd) => { const rnd = scRnd(sd); r.fillStyle = col; for (let i = 0; i < n; i++) { const tx = rnd() * w, th = hgt * (.6 + rnd() * .6); r.beginPath(); r.ellipse(tx, base - th * .6, th * .32, th * .6, 0, 0, TAU); r.fill(); r.fillRect(tx - 6, base - th * .3, 12, th * .5); } r.fillRect(0, base, w, h - base); };
    trees(1500, 14, 520, '#1F4048', 3);
    r.fillStyle = 'rgba(120,170,176,.18)'; r.fillRect(0, 1300, w, 400);
    trees(1700, 9, 780, '#122A30', 7);
    r.fillStyle = 'rgba(100,150,156,.12)'; r.fillRect(0, 1650, w, 300);
    const rb = scRnd(9); for (let i = 0; i < 7; i++) { r.fillStyle = `rgba(190,226,230,${.15 + rb() * .2})`; r.beginPath(); r.arc(rb() * w, 700 + rb() * 900, 20 + rb() * 30, 0, TAU); r.fill(); }
    x.filter = 'blur(22px)'; x.drawImage(raw, -40, -40, w + 80, h + 80); x.filter = 'none';
  }), 0, 0);
}
// rain: n streaks in a box, falling at speed (px/s) with a slant; seamless over len s (each streak wraps a whole
// number of times). o: { n, box, speed, slant, len (streak px), w, a, col, seed, loop }
function scRain(c, t, o) {
  const [x0, y0, x1, y1] = o.box, H0 = y1 - y0, L = o.loop || 6;
  c.save(); c.lineCap = 'round'; c.strokeStyle = o.col || 'rgba(210,236,240,1)';
  for (let i = 0; i < o.n; i++) {
    const s = i * 1.913 + (o.seed || 0), turns = Math.max(1, Math.round(o.speed * L / H0 * (.8 + hash(s) * .4))), v = turns * H0 / L;
    const y = y0 + ((hash(s + 1) * H0 + v * t) % H0), x = x0 + hash(s + 2) * (x1 - x0) + (y - y0) * o.slant, ln = o.len * (.6 + hash(s + 3) * .8);
    c.globalAlpha = o.a * (.35 + .65 * hash(s + 4)); c.lineWidth = o.w * (.6 + hash(s + 5) * .8);
    c.beginPath(); c.moveTo(x, y); c.lineTo(x - o.slant * ln, y - ln); c.stroke();
  }
  c.restore();
}
