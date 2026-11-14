// nandibreath.js: "Breathe with Nandi", a seamless Scribble loop of even breathing (sama vritti): in for 5 s, out for
// 5 s, three rounds (30 s). Nandi lies in the temple courtyard at dusk, facing the sanctum (and us), eyes closed; his
// whole body swells as he breathes in and settles as he breathes out, and now and then an ear flicks. Two brass diyas
// burn on the stone platform in front of him.
const NB = 10, NB_IN = 5;
function nbAt(t) {
  const p = ((t % NB) + NB) % NB, k = p < NB_IN ? 0 : 1, u = k ? (p - NB_IN) / (NB - NB_IN) : p / NB_IN;
  return { p, k, u, b: k ? .5 + .5 * Math.cos(Math.PI * u) : .5 - .5 * Math.cos(Math.PI * u) };
}
const ND_PARTS = () => window._nd || (window._nd = { n: scNandi(), diya: scDiya() });
const flick = (t, ts, len) => ts.reduce((s, t0) => { let d = ((t - t0) % len + len) % len; return s + (d < .5 ? Math.sin(d / .5 * Math.PI) * Math.exp(-d * 3) : 0); }, 0);
const ndTop = X => 1694 + Math.pow((X - 540) / 620, 2) * 46 + scFbm2(X / 140, 6, 3, 3) * 8;
function ndScene(c, t, o = {}) {
  const len = o.len || DUR, { b } = o.breath || nbAt(t), P = ND_PARTS(), N = P.n, dy = o.dy || 0;
  scCourtyard(c, o.set);
  scRock(c, { ...o.set, key: 'nd', y0: 1650, top: ndTop, pal: { base: [150, 128, 112], lichen: .25, shade: [.92, .7] }, near: 120 });
  c.save(); c.translate(0, dy);
  // contact shadow
  c.save(); const sg = c.createRadialGradient(SCN.x, SCN.ground, 10, SCN.x, SCN.ground, 460);
  sg.addColorStop(0, 'rgba(40,24,20,.55)'); sg.addColorStop(1, 'rgba(40,24,20,0)'); c.fillStyle = sg;
  c.translate(SCN.x, SCN.ground); c.scale(1, .12); c.translate(-SCN.x, -SCN.ground); c.fillRect(SCN.x - 480, SCN.ground - 480, 960, 960); c.restore();
  const lift = 16 * b;
  scDraw(c, N.body, t, { ax: SCN.x, ay: SCN.ground, sx: 1 + .025 * b, sy: 1 + .05 * b });
  const fl = flick(t, [2.3, 13.1, 21.7], len), fr = flick(t, [7.8, 17.4, 26.6], len);
  scDraw(c, N.earL, t, { ax: SCN.earL[0], ay: SCN.earL[1], dy: -lift, rot: .05 * b - .5 * fl });
  scDraw(c, N.earR, t, { ax: SCN.earR[0], ay: SCN.earR[1], dy: -lift, rot: -.05 * b + .5 * fr });
  scDraw(c, N.head, t, { ax: SCN.neck[0], ay: SCN.neck[1], dy: -lift, rot: .008 * Math.sin(t * TAU / NB) });
  scDiyaDraw(c, P.diya, t, 150, 1748, 1.15, .1 * Math.sin(t * 1.3));
  scDiyaDraw(c, P.diya, t, 930, 1748, -1.15, .1 * Math.sin(t * 1.1 + 2));
  c.restore();
}

SHOTS.push({
  a: 0, b: DUR + 1, draw(c, u, t) {
    const B = nbAt(t);
    ndScene(c, t, { breath: B });
    // dusk motes drifting in the lamplight
    scLooped(t, DUR, (tt, w) => motes(c, { n: 40, seed: 5, box: [0, 900, W, 1700], r: 3, col: '#FFD9A0', a: .45 * w, vx: 6, vy: -8, t: tt }));
    if (window.COVER) return;
    const { k, b } = B, toNext = (k ? NB : NB_IN) - B.p, fade = clamp(toNext / .35);
    const s = lerp(.82, 1.12, b), y = lerp(560, 480, b), pop = t < .05 ? 1 : lerp(.6, 1, clamp((B.p - k * NB_IN) / .22));
    c.save(); c.translate(540, y); c.scale(pop, pop);
    scWord(c, k ? 'Exhale' : 'Inhale', 0, 0, 118 * s, { alpha: fade, glow: ['rgba(40,20,50,.45)', 18] });
    scWord(c, k ? 'रेचक' : 'पूरक', 0, 92 * s, 46 * s, { alpha: .85 * fade, glow: ['rgba(40,20,50,.45)', 12] });
    c.restore();
  }
});
LOOK.bloom = .12; LOOK.vignette = .3; LOOK.grain = .05;
