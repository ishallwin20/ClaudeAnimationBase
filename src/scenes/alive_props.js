// alive_props.js: the figures of "Is HANUMAN alive?" (ad 84), all silhouettes with a rim of light.
//   rimSil(g, draw, o)      a silhouette lit from behind: draw(g) fills the shape, the rim is what a blurred copy leaves
//   hanuGiant(g, o)         Hanuman grown huge, front view from the waist up, on a 1024 × 1536 board: the mukut, the
//                           ruff, kundalas, the tail curling up behind; his hands go where o.handL / o.handR say (IK),
//                           o.eyes (the glow), o.only: 'hands' draws the forearms and fists alone (a board in front)
const SCR = {};
function scr(key, w, h) { let cv = SCR[key]; if (!cv || cv.width !== w || cv.height !== h) { cv = SCR[key] = document.createElement('canvas'); cv.width = w; cv.height = h; } const g = cv.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, w, h); g.filter = 'none'; g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; return g; }
function rimSil(g, draw, o = {}) {
  const w = g.canvas.width, h = g.canvas.height, a = scr('rimA' + w, w, h), b = scr('rimB' + w, w, h);
  a.save(); a.setTransform(g.getTransform()); draw(a); a.restore();
  b.drawImage(a.canvas, 0, 0); b.globalCompositeOperation = 'source-in'; b.fillStyle = o.light || '#BFD0FF'; b.fillRect(0, 0, w, h);
  b.globalCompositeOperation = 'source-atop';
  for (const [bl, al] of o.passes || [[34, .9], [9, .55]]) { b.filter = `blur(${bl}px)`; b.globalAlpha = al; b.drawImage(a.canvas, o.dx ?? 0, o.dy ?? 0); }
  b.filter = 'none'; b.globalAlpha = 1;
  if (o.after) o.after(b);
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = o.alpha ?? 1; g.drawImage(b.canvas, 0, 0); g.restore();
}
const ik2 = (S, T, l1, l2, s) => { const dx = T[0] - S[0], dy = T[1] - S[1], d = Math.min(Math.hypot(dx, dy), l1 + l2 - 2), b = Math.atan2(dy, dx), a = Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1)); return [S[0] + l1 * Math.cos(b + s * a), S[1] + l1 * Math.sin(b + s * a)]; };
const GI = { W: 1280, cx: 640, sh: 860, shx: 300, l1: 350, l2: 340 };
function hanuGiant(g, o = {}) {
  const t = o.t || 0, cx = GI.cx, br = Math.sin(t * 1.1) * 5, hands = o.only === 'hands', hy = 610 + br * .6;
  const hL = o.handL || [cx - 362, 1400], hR = o.handR || [cx + 362, 1400];
  const SL = [cx - GI.shx, GI.sh + br], SR = [cx + GI.shx, GI.sh + br];
  const eL = ik2(SL, hL, GI.l1, GI.l2, o.bendL ?? 1), eR = ik2(SR, hR, GI.l1, GI.l2, o.bendR ?? -1);
  eL[0] = Math.max(eL[0], 84); eR[0] = Math.min(eR[0], GI.W - 84);   // keep the elbows on the board
  const under = o.under ?? 0, gold = o.gold || '#FFC870', lc = o.underAt || [(hL[0] + hR[0]) / 2, (hL[1] + hR[1]) / 2 + (o.underDy ?? 0)];
  const body = (c) => {
    const col = c.createLinearGradient(0, 200, 0, 1536); col.addColorStop(0, o.dark0 || '#050818'); col.addColorStop(1, o.dark1 || '#0B1230');
    const arm = (S, E, Hd, full) => {
      const mid = [lerp(E[0], Hd[0], .3), lerp(E[1], Hd[1], .3)];
      if (full) limb(c, [S, [lerp(S[0], E[0], .5), lerp(S[1], E[1], .5)], E, [lerp(E[0], Hd[0], .45), lerp(E[1], Hd[1], .45)], Hd], [150, 142, 112, 116, 84], col);
      else limb(c, [mid, [lerp(E[0], Hd[0], .6), lerp(E[1], Hd[1], .6)], Hd], [112, 106, 84], col);
      const a = Math.atan2(Hd[1] - E[1], Hd[0] - E[0]); c.save(); c.translate(Hd[0], Hd[1]); c.rotate(a); c.fillStyle = col;
      c.beginPath(); c.roundRect(-46, -80, 150, 160, 56); c.fill(); for (let i = 0; i < 4; i++) { c.beginPath(); c.arc(92, -57 + i * 38, 25, 0, TAU); c.fill(); }
      c.restore();
    };
    if (hands) { arm(SL, eL, hL, false); arm(SR, eR, hR, false); return; }
    const tw = Math.sin(t * .9) * 14;
    limb(c, [[cx + 190, 1500], [cx + 400, 1270], [cx + 468 + tw * .3, 940], [cx + 430 + tw, 640], [cx + 352 + tw, 470], [cx + 380 + tw, 372], [cx + 452 + tw * 1.2, 384]], [50, 48, 44, 38, 34, 32, 34], col); ellipse(c, cx + 462 + tw * 1.2, 396, 36, 28, col, .5);
    // torso: thick neck and traps, a deep chest, a narrow waist
    c.fillStyle = col; c.beginPath(); c.moveTo(cx - 104, hy + 120); c.bezierCurveTo(cx - 150, 790 + br, cx - 300, 760 + br, cx - 392, 850 + br);
    c.bezierCurveTo(cx - 400, 1010, cx - 250, 1160, cx - 215, 1320); c.bezierCurveTo(cx - 212, 1400, cx - 250, 1470, cx - 270, 1536); c.lineTo(cx + 270, 1536);
    c.bezierCurveTo(cx + 250, 1470, cx + 212, 1400, cx + 215, 1320); c.bezierCurveTo(cx + 250, 1160, cx + 400, 1010, cx + 392, 850 + br);
    c.bezierCurveTo(cx + 300, 760 + br, cx + 150, 790 + br, cx + 104, hy + 120); c.closePath(); c.fill();
    ellipse(c, SL[0] - 6, SL[1], 134, 122, col); ellipse(c, SR[0] + 6, SR[1], 134, 122, col);
    arm(SL, eL, hL, true); arm(SR, eR, hR, true);
    // the ruff, the head, ears and kundalas
    c.beginPath(); c.moveTo(cx - 150, hy - 70);
    const R = [[-196, hy + 4], [-176, hy + 26], [-214, hy + 74], [-178, hy + 86], [-198, hy + 138], [-150, hy + 136], [-146, hy + 184], [-96, hy + 168], [-64, hy + 212], [-28, hy + 186], [0, hy + 220]];
    for (const [x, y] of R) c.lineTo(cx + x, y); for (const [x, y] of [...R].reverse().slice(1)) c.lineTo(cx - x, y); c.lineTo(cx + 150, hy - 70); c.closePath(); c.fill();
    ellipse(c, cx, hy, 152, 162, col);
    for (const s of [-1, 1]) { ellipse(c, cx + s * 168, hy - 6, 40, 54, col, s * .25); c.beginPath(); c.arc(cx + s * 186, hy + 84, 38, 0, TAU); c.arc(cx + s * 186, hy + 84, 21, 0, TAU, true); c.fill('evenodd'); }
    // the mukut: a jewelled band, rounded tiers, the finial
    c.beginPath(); c.roundRect(cx - 168, hy - 150, 336, 62, 14); c.fill();
    for (const s of [-1, 1]) poly(c, [[cx + s * 150, hy - 110], [cx + s * 214, hy - 214], [cx + s * 120, hy - 150]], col);
    for (const [hw, y0, y1] of [[140, hy - 146, hy - 226], [110, hy - 216, hy - 290], [80, hy - 280, hy - 344], [52, hy - 336, hy - 388]]) { c.beginPath(); c.roundRect(cx - hw, y1, hw * 2, y0 - y1, 30); c.fill(); }
    ellipse(c, cx, hy - 404, 26, 26, col); poly(c, [[cx - 10, hy - 420], [cx, hy - 474], [cx + 10, hy - 420]], col);
  };
  rimSil(g, body, { light: o.light || '#C8D6FF', dx: o.dx ?? 0, dy: o.dy ?? 6, passes: o.passes, after: hands && !under ? null : (b) => {
    // the herbs' light from below, on whatever of him faces it
    if (under > .01) { const gr = b.createRadialGradient(lc[0], lc[1], 60, lc[0], lc[1], o.underR ?? 640); gr.addColorStop(0, rgba(gold, .5 * under)); gr.addColorStop(.45, rgba(gold, .14 * under)); gr.addColorStop(1, rgba(gold, 0)); b.fillStyle = gr; b.fillRect(0, 0, 1280, 1536); }
    if (hands) return;
    if (under > .01) {
      b.lineCap = 'round'; b.strokeStyle = rgba('#02030A', .5 * under); b.lineWidth = 10;
      b.beginPath(); b.moveTo(cx - 300, 1010 + br); b.quadraticCurveTo(cx - 160, 1090 + br, cx - 14, 1030 + br); b.moveTo(cx + 300, 1010 + br); b.quadraticCurveTo(cx + 160, 1090 + br, cx + 14, 1030 + br); b.stroke();
    }
    // he rises out of the mist
    b.globalCompositeOperation = 'destination-out'; const fg = b.createLinearGradient(0, 1180, 0, 1536); fg.addColorStop(0, 'rgba(0,0,0,0)'); fg.addColorStop(1, 'rgba(0,0,0,1)'); b.fillStyle = fg; b.fillRect(0, 1180, 1280, 360); b.globalCompositeOperation = 'source-atop';
  } });
  if (hands) return;
  const orn = o.orn ?? .5, oc = (a) => rgba(gold, a * orn);
  g.save(); g.lineCap = 'round';
  g.strokeStyle = oc(.55); g.lineWidth = 8; g.beginPath(); g.moveTo(cx - 156, hy - 118); g.lineTo(cx + 156, hy - 118); g.stroke();
  g.fillStyle = oc(.8); g.beginPath(); g.arc(cx, hy - 119, 13, 0, TAU); g.fill();
  g.lineWidth = 4; g.strokeStyle = oc(.4); for (const [hw, y] of [[104, hy - 222], [76, hy - 286], [48, hy - 340]]) { g.beginPath(); g.moveTo(cx - hw, y); g.lineTo(cx + hw, y); g.stroke(); }
  g.strokeStyle = oc(.42); g.lineWidth = 7; g.beginPath(); g.arc(cx, hy + 150, 190, .2 * Math.PI, .8 * Math.PI); g.stroke(); g.beginPath(); g.arc(cx, hy + 110, 300, .28 * Math.PI, .72 * Math.PI); g.stroke();
  g.strokeStyle = oc(.3); g.lineWidth = 6; g.beginPath(); g.moveTo(cx + 262, 800); g.quadraticCurveTo(cx + 40, 1130, cx - 200, 1400); g.stroke();   // the janeu, over his left shoulder
  for (const [S, E] of [[SL, eL], [SR, eR]]) { const k = .5, x = lerp(S[0], E[0], k), y = lerp(S[1], E[1], k), a = Math.atan2(E[1] - S[1], E[0] - S[0]) + Math.PI / 2; g.strokeStyle = oc(.5); g.lineWidth = 11; g.beginPath(); g.moveTo(x - Math.cos(a) * 62, y - Math.sin(a) * 62); g.lineTo(x + Math.cos(a) * 62, y + Math.sin(a) * 62); g.stroke(); }
  g.restore();
  const ey = o.eyes ?? 0, ang = o.anger ?? 0;
  if (ey > .01) for (const s of [-1, 1]) {
    const x = cx + s * 60, y = hy - 2; g.save(); g.globalCompositeOperation = 'lighter';
    const gr = g.createRadialGradient(x, y, 0, x, y, 110 * ey); gr.addColorStop(0, rgba(o.eyeCol || '#FFA030', .6 * ey)); gr.addColorStop(1, rgba(o.eyeCol || '#FFA030', 0)); g.fillStyle = gr; g.fillRect(x - 120, y - 120, 240, 240);
    g.translate(x, y); g.rotate(s * (.08 + .2 * ang)); g.fillStyle = rgba('#FFF0C8', ey); g.beginPath(); g.moveTo(-40, 3); g.quadraticCurveTo(0, -24 * (1 - ang * .45), 40, 3); g.quadraticCurveTo(0, 18, -40, 3); g.fill(); g.restore();
  }
}

// ---------- Hanuman flying, side view (a silhouette, facing right): the mountain goes on his raised palm ----------
// Hips at (0, 0); about 520 tall with the arm. Returns the palm [x, y]. o: t, col, gada.
function hanuFly(c, o = {}) {
  const col = o.col || '#070612', t = o.t || 0, w = Math.sin(t * 3) * 6, palm = [150, -366];
  limb(c, [[-20, 0], [-120, -50], [-196, -180 + w], [-160, -296 + w], [-96, -310 + w], [-78, -268 + w]], [30, 28, 24, 20, 17, 15], col); ellipse(c, -74, -258 + w, 20, 16, col);
  limb(c, [[-6, -24], [-120, -44 + w * .5], [-236, -6 + w], [-300, -30 + w * 1.6]], [26, 22, 14, 3], col, false);
  if (o.gada !== false) { limb(c, [[-66, -70], [-180, -150]], [13, 13], col); ellipse(c, -204, -166, 44, 40, col, -.6); ellipse(c, -236, -190, 14, 14, col); }
  limb(c, [[0, 0], [-112, 58], [-232, 40]], [58, 44, 26], col); fillPath(c, 'M -226 26 L -276 30 L -272 56 L -224 54 Z', col);
  limb(c, [[0, 0], [112, 36], [70, 132]], [60, 46, 28], col); fillPath(c, 'M 56 120 L 112 136 L 106 158 L 54 148 Z', col);
  fillPath(c, 'M -50 -30 C -70 30 -30 70 30 62 C 70 50 76 0 50 -34 Z', col);
  limb(c, [[0, -10], [34, -84], [70, -156]], [84, 92, 104], col);
  limb(c, [[40, -150], [-14, -112], [-66, -70]], [36, 30, 24], col); ellipse(c, -66, -70, 20, 18, col);
  limb(c, [[70, -168], [150, -250], palm], [38, 30, 24], col); fillPath(c, `M ${palm[0] - 34} ${palm[1] - 2} L ${palm[0] + 38} ${palm[1] - 10} L ${palm[0] + 34} ${palm[1] + 12} L ${palm[0] - 30} ${palm[1] + 16} Z`, col);
  c.save(); c.translate(108, -236); c.rotate(.18);
  ellipse(c, 0, 0, 44, 48, col); ellipse(c, 36, 14, 30, 22, col); ellipse(c, -30, -4, 14, 20, col); fillPath(c, 'M -40 6 L -62 30 L -34 28 L -44 54 L -10 40 Z', col);
  fillPath(c, 'M -44 -30 L 44 -30 L 40 -52 L 30 -52 L 26 -76 L 16 -76 L 12 -96 L 0 -118 L -12 -96 L -16 -76 L -26 -76 L -30 -52 L -40 -52 Z', col); c.restore();
  return palm;
}
// the herb peak, small, for a far Hanuman's palm: base centre at (0, 0), s wide
function miniPeak(c, s, t, o = {}) {
  const col = o.col || '#0A0A14';
  c.save(); c.scale(s / 200, s / 200);
  fillPath(c, 'M -100 0 L -84 -34 L -60 -52 L -44 -92 L -22 -108 L -6 -150 L 12 -128 L 30 -134 L 44 -96 L 66 -74 L 78 -40 L 100 0 L 70 22 L 52 14 L 40 44 L 22 30 L 6 66 L -12 34 L -30 48 L -44 18 L -70 24 Z', col);
  c.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 46; i++) { const a = hash(i * 3.1), b = hash(i * 7.7), y = -8 - b * 120, hw = 92 * (1 - b * .86), x = (a * 2 - 1) * hw, tw = .5 + .5 * Math.sin(t * (2 + hash(i) * 3) + i); const r = (3 + hash(i * 1.3) * 5) * (.6 + .4 * tw); const gr = c.createRadialGradient(x, y, 0, x, y, r * 2.4); gr.addColorStop(0, rgba(i % 3 ? '#FFE090' : '#B0FFC0', .9 * tw * (o.k ?? 1))); gr.addColorStop(1, 'rgba(255,220,140,0)'); c.fillStyle = gr; c.fillRect(x - r * 3, y - r * 3, r * 6, r * 6); }
  c.restore();
}
// ---------- the battlefield ----------
// a fallen vanara: a low shape on the ground with a curl of tail, an arrow or a spear standing in it
function fallen(c, x, y, s, seed, col) {
  const h = (i) => hash(seed * 13.7 + i), f = h(1) < .5 ? -1 : 1;
  c.save(); c.translate(x, y); c.scale(s * f, s);
  limb(c, [[-96, 0], [-44, -24 - h(2) * 10], [26, -30], [92, -8]], [14, 36, 40, 20], col); ellipse(c, 106, -14, 19, 17, col);
  if (h(3) < .7) limb(c, [[-92, -6], [-128, -30], [-124, -62], [-104, -60]], [9, 8, 7, 6], col, false);
  if (h(4) < .6) limb(c, [[20, -30], [60, -56], [96, -40]], [13, 11, 9], col);
  const n = 1 + Math.floor(h(5) * 2.4);
  for (let i = 0; i < n; i++) { const ax = -60 + h(6 + i) * 110, an = -1.57 + (h(9 + i) - .5) * 1.1, L = 50 + h(12 + i) * 40; c.save(); c.translate(ax, -22); c.rotate(an); c.fillStyle = col; c.fillRect(0, -1.6, L, 3.2); poly(c, [[L - 16, 0], [L + 2, -7], [L - 4, 0], [L + 2, 7]], col); c.restore(); }
  if (h(20) < .22) { c.save(); c.translate(-30 + h(21) * 80, -10); c.rotate(-1.57 + (h(22) - .5) * .7); c.fillStyle = col; c.fillRect(0, -3, 190, 6); poly(c, [[186, -9], [222, 0], [186, 9]], col); c.restore(); }
  c.restore();
}
// a warrior on his feet (a silhouette, facing right): o.k 0..1 rising from the ground, tail, crown, torch (returns the flame's point), arm (0..1 raised)
function warrior(c, x, y, s, o = {}) {
  const col = o.col || '#06060C', k = o.k ?? 1, t = o.t || 0, f = o.flip ? -1 : 1, bob = Math.sin(t * 5 + x) * (o.walk ? 5 : 0);
  c.save(); c.translate(x, y + bob * s); c.scale(s * f, s * k);
  limb(c, [[-22, 0], [-18, -90], [0, -170]], [18, 26, 34], col); limb(c, [[26, 0], [18, -90], [0, -170]], [18, 26, 34], col);
  limb(c, [[0, -160], [4, -250], [8, -318]], [58, 64, 80], col);
  ellipse(c, 14, -362, 30, 34, col); ellipse(c, 36, -354, 20, 15, col);
  if (o.crown) fillPath(c, 'M -16 -384 L 44 -384 L 38 -404 L 28 -404 L 24 -424 L 14 -448 L 4 -424 L 0 -404 L -10 -404 Z', col);
  if (o.tail !== false) limb(c, [[-10, -170], [-70, -200], [-104, -280], [-84, -350], [-56, -344]], [15, 14, 12, 10, 9], col, false);
  const up = o.arm ?? 0, hand = [lerp(50, 74, up), lerp(-190, -420, up)];
  limb(c, [[14, -306], [lerp(40, 66, up), lerp(-250, -330, up)], hand], [24, 20, 16], col);
  limb(c, [[-6, -306], [-30, -250], [-24, -196]], [24, 20, 16], col);
  let fl = null;
  if (o.torch) { c.fillStyle = col; c.save(); c.translate(hand[0], hand[1]); c.rotate(.2); c.fillRect(-4, -70, 8, 86); c.restore(); fl = [x + (hand[0] + 14) * s * f, y + (hand[1] - 78) * s * k + bob * s]; }
  else if (o.mace) { c.save(); c.translate(hand[0], hand[1]); c.rotate(.3); c.fillStyle = col; c.fillRect(-4, -90, 8, 110); ellipse(c, 0, -100, 20, 24, col); c.restore(); }
  c.restore(); return fl;
}
function flameShape(c, x, y, w, h, t, seed = 0) {
  const ln = Math.sin(t * 9 + seed) * w * .35 + Math.sin(t * 23 + seed * 3) * w * .15, f = 1 + .16 * vnoise(t * 10, seed);
  for (const [k, col] of [[1, '#FF7A20'], [.68, '#FFB040'], [.36, '#FFF0B8']]) { const W2 = w * k, H2 = h * k * f; c.fillStyle = col; c.beginPath(); c.moveTo(x + ln * k, y - H2); c.bezierCurveTo(x + W2 * .5, y - H2 * .45, x + W2, y - H2 * .12, x, y); c.bezierCurveTo(x - W2, y - H2 * .12, x - W2 * .5, y - H2 * .45, x + ln * k, y - H2); c.fill(); }
}
function torchFire(c, x, y, k, t, seed = 0) {
  const f = 1 + .18 * vnoise(t * 9, seed) + .08 * Math.sin(t * 27 + seed);
  glow(c, x, y - 20 * k, 360 * k * f, '#FF8A30', .42); glow(c, x, y - 20 * k, 120 * k * f, '#FFC060', .7);
  flameShape(c, x, y + 14 * k, 17 * k, 64 * k, t, seed);
}
// a prince fallen on his back (a silhouette, head to the right, the kirita on), his bow standing in the ground by him
function princeDown(c, x, y, s, col, o = {}) {
  c.save(); c.translate(x, y); c.scale(s, s);
  limb(c, [[-250, -10], [-140, -34], [-40, -30]], [22, 34, 44], col); limb(c, [[-236, -6], [-150, -52], [-60, -34]], [20, 30, 40], col);
  limb(c, [[-50, -30], [40, -52], [120, -46]], [50, 66, 58], col); limb(c, [[90, -50], [40, -20], [-30, -8]], [22, 18, 14], col);
  ellipse(c, 156, -46, 30, 28, col); fillPath(c, 'M 172 -74 L 236 -70 L 262 -52 L 300 -46 L 262 -38 L 236 -22 L 174 -18 Z', col);
  const bx = o.bow ?? -40; c.save(); c.translate(bx, -30); c.rotate(o.lean ?? .12); c.lineCap = 'round';
  strokePath(c, 'M 0 0 C -70 -60 -84 -170 -22 -230 C -84 -290 -70 -400 0 -460', col, 13); strokePath(c, 'M 0 0 L 0 -460', col, 2.5); c.restore();
  c.restore();
}
// old Jambavan, lying back against a rock, pierced with arrows (side view, head to the right). Hips at (0, 0).
// o: t, col, beard (its colour), reach (0..1 a hand lifting), arrows
function jambavanDown(c, o = {}) {
  const col = o.col || '#07060C', t = o.t || 0, br = Math.sin(t * 1.3) * 4, rc = o.reach ?? 0;
  fillPath(c, 'M -120 20 L -60 -150 L 60 -250 L 250 -330 L 390 -250 L 460 -90 L 470 20 Z', o.rock || '#0B0A12');
  limb(c, [[0, -10], [-150, -110], [-290, -10]], [104, 82, 52], col); fillPath(c, 'M -300 -34 L -366 -40 L -372 -4 L -296 6 Z', col);
  limb(c, [[-10, 0], [-170, -40], [-330, 0]], [100, 78, 50], col);
  limb(c, [[0, -30], [84, -120 - br * .5], [150, -214 - br]], [170, 196, 176], col);
  const hd = [214, -300 - br];
  fillPath(c, `M ${hd[0] - 30} ${hd[1] + 40} L ${hd[0] + 40} ${hd[1] + 64} L ${hd[0] + 22} ${hd[1] + 110} L ${hd[0] + 2} ${hd[1] + 92} L ${hd[0] - 12} ${hd[1] + 150} L ${hd[0] - 34} ${hd[1] + 118} L ${hd[0] - 54} ${hd[1] + 170} L ${hd[0] - 70} ${hd[1] + 110} Z`, o.beard || '#3A3A4A');
  ellipse(c, hd[0], hd[1], 84, 76, col); limb(c, [[hd[0] + 30, hd[1] + 6], [hd[0] + 128, hd[1] - 22]], [84, 50], col); ellipse(c, hd[0] + 140, hd[1] - 30, 22, 18, col);
  ellipse(c, hd[0] - 40, hd[1] - 70, 30, 30, col);
  limb(c, [[120, -210 - br], [200, -130], [lerp(290, 330, rc), lerp(-110, -260, rc)]], [60, 48, 36], col); ellipse(c, lerp(296, 338, rc), lerp(-112, -268, rc), 26, 22, col);
  for (const [x, y, a, L] of o.arrows || [[40, -130, -1.1, 150], [100, -200, -1.5, 130], [-60, -70, -1.9, 140], [-170, -90, -1.35, 120], [150, -150, -.75, 120]]) { c.save(); c.translate(x, y); c.rotate(a); c.fillStyle = col; c.fillRect(0, -2.5, L, 5); poly(c, [[L - 30, 0], [L + 4, -12], [L - 8, 0], [L + 4, 12]], col); c.restore(); }
  return hd;
}
// a bow lying on the ground (seen at a low angle): centre (0, 0), about 700 long
function bowDown(c, col, rot = 0, s = 1) {
  c.save(); c.rotate(rot); c.scale(s, s * .34); c.lineCap = 'round';
  strokePath(c, 'M -350 0 C -300 -200 -120 -260 0 -230 C 120 -260 300 -200 350 0', col, 20); strokePath(c, 'M -350 0 L 350 0', col, 4);
  c.restore();
}
