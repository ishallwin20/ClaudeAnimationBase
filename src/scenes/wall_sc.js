// wall_sc.js: Scribble live wallpapers (studio_wall_sc.html) at 1290×2796, drawn in the 1080×2340 design space (the
// reels' 1080×1920 scenes moved down DY px, their sets grown up behind the clock), seamless 6 s loops: one slow breath
// (in for 3 s, out for 3 s) while the strokes boil. wallS(name, look, fn(c, t, k)) registers <name> (the loop, frame 0
// the still), <name>_wake (the iPhone's 2 s: k rises 0 → 1 over 1.5 s while the loop plays its last 1.5 s, landing on
// the still) and <name>_lock (a mock lock screen).
const WL = 6, DW = 1080, DH = 2340, KS = W / DW, WAKE = 1.5, DY = 360, SET = { w: DW, h: DH, dy: DY };
let LOCK = false;
function lockScreen(c) {
  c.save(); c.setTransform(KS, 0, 0, KS, 0, 0); c.fillStyle = 'rgba(255,255,255,.92)'; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.font = '500 46px Poppins'; c.fillText('Saturday, 14 November', DW / 2, 255); c.font = '700 250px Poppins'; c.fillText('9:41', DW / 2, 450);
  c.fillStyle = 'rgba(30,30,40,.5)'; for (const x of [150, 930]) { c.beginPath(); c.arc(x, 2175, 62, 0, TAU); c.fill(); }
  c.fillStyle = 'rgba(255,255,255,.8)'; c.fillRect(DW / 2 - 140, 2282, 280, 12); c.restore();
}
function wallS(name, look, fn) {
  const m = t => ((t % WL) + WL) % WL;
  const at = (c, t, k) => { T = m(t); Object.assign(LOOK, look); c.setTransform(KS, 0, 0, KS, 0, 0); fn(c, m(t), k); };
  LOOPS[name] = (c, t) => at(c, t, 1); LOOPS[name + '_wake'] = (c, t) => at(c, t - WAKE, clamp(t / WAKE)); LOOPS[name + '_lock'] = (c, t) => { at(c, t, 1); c.__lock = 1; };
  LOOPS[name].len = LOOPS[name + '_lock'].len = WL; LOOPS[name + '_wake'].len = 2;
}
SHOTS.push({ a: 0, b: 1e9, draw(c, u, t) { const q = new URLSearchParams(location.search).get('loop'), L = window.LOOP || LOOPS[q] || Object.values(LOOPS)[0]; c.__lock = 0; L(c, t); LOCK = !!c.__lock; } });
POST.push(c => { if (LOCK) lockScreen(c); });
const breath6 = t => .5 - .5 * Math.cos(TAU * t / WL);   // 0 empty at t = 0, full at 3 s
const pulse = (t, ts) => ts.reduce((s, t0) => { const d = ((t - t0) % WL + WL) % WL; return s + (d < .5 ? Math.sin(d / .5 * Math.PI) * Math.exp(-d * 3) : 0); }, 0);
const shadowAt = (c, x, y, r, a = .55, k = .14, col = '30,24,18') => {
  c.save(); const g = c.createRadialGradient(x, y, 10, x, y, r); g.addColorStop(0, `rgba(${col},${a})`); g.addColorStop(1, `rgba(${col},0)`); c.fillStyle = g;
  c.translate(x, y); c.scale(1, k); c.translate(-x, -y); c.fillRect(x - r, y - r, 2 * r, 2 * r); c.restore();
};

// ---------- 01 Bal Hanuman breathing in the Himalaya (the reel "Breathe with Bal Hanuman") ----------
// wake: the prana motes rush in to him from far out and his first breath begins
wallS('sc_hanuman', { bloom: .1, vignette: .28, grain: .045 }, (c, t, k) => {
  const e = easeOut(k), b = breath6(t), P = window._bh || (window._bh = scHanuman()), still = Math.sin(t * TAU / WL * 2) * .15;
  scHimalaya(c, SET); scRock(c, SET);
  c.translate(0, DY);
  shadowAt(c, SCH.x, SCH.ground, 300, .55, .16);
  const lift = 22 * b + still;
  scDraw(c, P.tail, t, { ax: SCH.tailRoot[0], ay: SCH.tailRoot[1], rot: -.035 * b, dy: -lift * .3 });
  scDraw(c, P.legs, t);
  scDraw(c, P.torso, t, { ax: SCH.lap[0], ay: SCH.lap[1], sx: 1 + .03 * b, sy: 1 + .062 * b });
  scDraw(c, P.head, t, { ax: SCH.neck[0], ay: SCH.neck[1], dy: -lift - 5 * b, rot: .012 * Math.sin(t * TAU / WL) });
  for (let i = 0; i < 52; i++) {
    const a0 = hash(i * 3.1) * TAU, r0 = 300 + hash(i * 5.7) * 300, far = lerp(2.6, 1, e), rr = r0 * far * (1 - .32 * b) + 6 * Math.sin(t * TAU / WL * 2 + i);
    const mx = 540 + Math.cos(a0) * rr * .9, my = 1180 + Math.sin(a0) * rr * .75, tw = .5 + .5 * Math.sin(t * TAU / WL * 3 + i * 1.7);
    glow(c, mx, my, 7 + hash(i) * 9, '#FFF4D6', (.28 + .3 * tw) * (my < 1640 ? 1 : 0) * lerp(.2, 1, e), 'screen');
  }
});

// ---------- 02 Bal Ganesha and the bees (the reel "Bee breath with Bal Ganesha") ----------
// wake: the bees fly in from out of frame to their circles round him
const WBEES = Array.from({ length: 6 }, (_, i) => ({ n: i % 2 ? -1 : 1, ph: i / 6 * TAU + hash(i) * .6, rx: 330 + hash(i + 3) * 90, ry: 90 + hash(i + 7) * 70, cy: 1060 + hash(i + 9) * 160, tilt: (hash(i + 11) - .5) * .5, s: .85 + hash(i + 13) * .35 }));
function wallBees(c, t, front, P, far) {
  WBEES.forEach((B, i) => {
    const th = B.ph + TAU * B.n * t / WL, sn = Math.sin(th);
    if ((sn >= 0) !== front) return;
    const x0 = Math.cos(th) * B.rx * far, y0 = sn * B.ry * far;
    const x = 540 + x0 * Math.cos(B.tilt) - y0 * Math.sin(B.tilt), y = B.cy + x0 * Math.sin(B.tilt) + y0 * Math.cos(B.tilt) + 10 * Math.sin(t * TAU / WL * 4 + i * 2);
    const ang = Math.atan2(Math.cos(th) * B.n * B.ry / B.rx, -Math.sin(th) * B.n);
    scBeeDraw(c, P.bee, t, x, y, ang, .5 + .5 * Math.sin(t * TAU * 11 + i), B.s * (.92 + .14 * sn));
  });
}
wallS('sc_ganesha', { bloom: .1, vignette: .28, grain: .045 }, (c, t, k) => {
  const e = easeOut(k), b = breath6(t), P = window._bg || (window._bg = { g: scGanesha(), lotus: scLotus(), bee: scBee() }), G = P.g, L = P.lotus, far = lerp(3.2, 1, e);
  scPond(c, SET);
  c.translate(0, DY);
  scDraw(c, L.pad, t);
  wallBees(c, t, false, P, far);
  scDraw(c, L.back, t);
  const lift = 18 * b, fl = .025 * Math.sin(t * TAU / WL * 6);
  scDraw(c, G.earL, t, { ax: SCG.earL[0], ay: SCG.earL[1], dy: -lift, rot: -.05 * b + fl });
  scDraw(c, G.earR, t, { ax: SCG.earR[0], ay: SCG.earR[1], dy: -lift, rot: .05 * b - fl });
  scDraw(c, G.legs, t);
  scDraw(c, G.torso, t, { ax: SCG.lap[0], ay: SCG.lap[1], sx: 1 + .035 * b, sy: 1 + .055 * b });
  scDraw(c, G.head, t, { ax: SCG.neck[0], ay: SCG.neck[1], dy: -lift });
  scDraw(c, G.trunk, t, { ax: SCG.trunkRoot[0], ay: SCG.trunkRoot[1], dy: -lift, rot: -.07 * b });
  scDraw(c, L.front, t);
  wallBees(c, t, true, P, far);
});

// ---------- 03 Nandi in the temple courtyard (the reel "Breathe with Nandi") ----------
// wake: the two diyas catch and their flames rise
const wNdTop = X => 1694 + Math.pow((X - 540) / 620, 2) * 46 + scFbm2(X / 140, 6, 3, 3) * 8;
wallS('sc_nandi', { bloom: .12, vignette: .3, grain: .045 }, (c, t, k) => {
  const e = easeOut(k), b = breath6(t), P = window._nd || (window._nd = { n: scNandi(), diya: scDiya() }), N = P.n;
  scCourtyard(c, SET);
  scRock(c, { ...SET, key: 'nd', y0: 1650, top: wNdTop, pal: { base: [150, 128, 112], lichen: .25, shade: [.92, .7] }, near: 120 });
  c.translate(0, DY);
  shadowAt(c, SCN.x, SCN.ground, 460, .55, .12, '40,24,20');
  const lift = 16 * b;
  scDraw(c, N.body, t, { ax: SCN.x, ay: SCN.ground, sx: 1 + .025 * b, sy: 1 + .05 * b });
  scDraw(c, N.earL, t, { ax: SCN.earL[0], ay: SCN.earL[1], dy: -lift, rot: .05 * b - .5 * pulse(t, [1.7]) });
  scDraw(c, N.earR, t, { ax: SCN.earR[0], ay: SCN.earR[1], dy: -lift, rot: -.05 * b + .5 * pulse(t, [4.4]) });
  scDraw(c, N.head, t, { ax: SCN.neck[0], ay: SCN.neck[1], dy: -lift });
  const lit = i => k >= 1 ? 1 : easeOut(seg(k, .1 + i * .3, .6 + i * .3));
  scDiyaDraw(c, P.diya, t, 296, 1752, 1.15, .1 * Math.sin(t * TAU / WL * 2), { h: lit(0), glow: lit(0) });
  scDiyaDraw(c, P.diya, t, 784, 1752, -1.15, .1 * Math.sin(t * TAU / WL * 3 + 2), { h: lit(1), glow: lit(1) });
  scLooped(t, WL, (tt, w) => motes(c, { n: 30, seed: 5, box: [0, 900, DW, 1700], r: 3, col: '#FFD9A0', a: .45 * w, vx: 6, vy: -8, t: tt }));
});

// ---------- 04 Kumbhakarna asleep (the reel "Breathe with Kumbhakarna") ----------
// one snore a loop: in for 2.5 s (mouth wide, the flame pulled in), a beat held, out for 3 s (lips pursed, z's drift up)
// wake: the myna hops up from his foot onto his belly
function kbWall(t) {
  const b = t < 2.5 ? .5 - .5 * Math.cos(Math.PI * t / 2.5) : t < 3 ? 1 : .5 + .5 * Math.cos(Math.PI * (t - 3) / 3);
  const blow = t >= 3 ? clamp((t - 3) * 2) * clamp((6 - t) * 1.6) : 0, u = t >= 3 ? (t - 3) / 3 : 0;
  return { b, blow, u, inn: t < 2.5 ? Math.sin(Math.PI * t / 2.5) : 0 };
}
wallS('sc_kumbha', { bloom: .12, vignette: .32, grain: .045 }, (c, t, k) => {
  const { b, blow, u, inn } = kbWall(t), P = window._kb || (window._kb = { k: scKumbha(), myna: scMyna(), diya: scDiya() }), K = P.k;
  scHall(c, SET);
  scRock(c, { ...SET, key: 'kb', y0: 1700, top: X => 1742 + scFbm2(X / 140, 9, 3, 3) * 6, pal: { base: [92, 80, 86], lichen: 0, shade: [.85, .6] }, near: 100 });
  c.translate(0, DY);
  scDraw(c, K.bed, t); scDraw(c, K.legs, t);
  const sx = 1 + .03 * b, sy = 1 + .1 * b;
  scDraw(c, K.belly, t, { ax: SCK.belly[0], ay: SCK.belly[1], sx, sy });
  const open = t < 3 ? lerp(1, 1.4, b) : lerp(1.4, 1, clamp(u * 5));
  scKumbhaHead(c, K, t, { dy: -6 * b, rot: .02 * b, mouth: [lerp(1, .55, blow), lerp(open, .6, blow)], tash: [1 + .07 * blow, blow * .05 * Math.sin(t * 38)] });
  // the myna: on its perch on the belly; on wake it hops there from the top of his foot
  const bx = 600 + 120 * sx, by = SCK.belly[1] - (SCK.belly[1] - 1301) * sy;
  let mx = bx, my = by, face = 1;
  if (k < 1) { const v = easeIO(k), hops = Math.abs(Math.sin(v * Math.PI * 2)); mx = lerp(1010, bx, v); my = lerp(1412, by, v) - 70 * hops; }
  c.save(); c.translate(mx, my); c.scale(face, 1); scDraw(c, P.myna, t, { ax: 0, ay: 0, rot: blow * .06 * Math.sin(t * 20) }); c.restore();
  scDiyaDraw(c, P.diya, t, 380, 1766, 1.4, t < 3 ? -.55 * inn : 1.3 * blow, { h: t < 3 ? 1 + .35 * inn : 1 - .45 * blow, glow: 1 });
  if (t >= 3) {
    const [zx, zy] = scKumbhaAt(SCK.head[0], SCK.mouth[1], 0);
    for (let i = 0; i < 3; i++) {
      const v = clamp(u * 1.4 - i * .18); if (v <= 0 || v >= 1) continue;
      c.save(); c.globalAlpha = Math.sin(v * Math.PI) * .9; c.translate(zx + 40 + v * 150 + i * 20, zy - 60 - v * 260); c.rotate(-.2 + i * .15);
      scWord(c, 'z', 0, 0, 40 + i * 14, { weight: 700, glow: ['rgba(20,10,30,.6)', 10] }); c.restore();
    }
  }
});

// ---------- 05 Kanha asleep against a calf (the reel "Fall asleep with Kanha") ----------
// wake: the fireflies light up one after another
wallS('sc_kanha', { bloom: .14, vignette: .34, grain: .045 }, (c, t, k) => {
  const b = breath6(t), P = window._ks || (window._ks = { k: scKanha(), grass: scGrass({ y: 1690, h: DH - DY, key: "w" }) }), K = P.k;
  scVrindavan(c, SET);
  c.translate(0, DY);
  shadowAt(c, 560, 1660, 460, .6, .14, '5,10,20');
  scDraw(c, K.calf, t, { ax: SCKR.calf[0], ay: SCKR.calf[1], sx: 1 + .02 * b, sy: 1 + .07 * b });
  scDraw(c, K.calfHead, t, { ax: SCKR.calfNeck[0], ay: SCKR.calfNeck[1], rot: -.01 * b + .04 * pulse(t, [4.2]), dy: -3 * b });
  scDraw(c, K.legs, t);
  scDraw(c, K.torso, t, { ax: SCKR.lap[0], ay: SCKR.lap[1], sx: 1 + .02 * b, sy: 1 + .04 * b });
  scDraw(c, K.head, t, { ax: SCKR.neck[0], ay: SCKR.neck[1], dy: -9 * b, rot: .2 + .02 * b });
  scDraw(c, P.grass, t);
  for (let i = 0; i < 16; i++) {   // fireflies on closed paths, blinking; on wake each lights in turn
    const s = i * 7.3 + 3, n1 = 1 + Math.floor(hash(s) * 2), n2 = 1 + Math.floor(hash(s + 1) * 2), nb = 2 + Math.floor(hash(s + 2) * 3);
    const x = lerp(60, 1020, .5 + .45 * Math.sin(TAU * n1 * t / WL + hash(s + 3) * TAU)), y = lerp(780, 1660, .5 + .45 * Math.sin(TAU * n2 * t / WL + hash(s + 4) * TAU));
    const on = Math.pow(Math.max(0, Math.sin(TAU * nb * t / WL + hash(s + 5) * TAU)), 3), lit = k >= 1 ? 1 : easeOut(seg(k, hash(s + 6) * .6, hash(s + 6) * .6 + .35));
    glow(c, x, y, 34, '#E8FF9A', .9 * (.15 + .85 * on) * lit, 'screen'); glow(c, x, y, 7, '#FFFFF0', .9 * on * lit + (k < 1 ? Math.sin(lit * Math.PI) * .6 : 0), 'screen');
  }
});
