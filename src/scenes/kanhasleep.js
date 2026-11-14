// kanhasleep.js: "Fall asleep with Kanha", a seamless Scribble loop of slow sleepy breathing: in for 4 s, out for 6 s
// (a longer out-breath), three rounds (30 s). On the bank of the Yamuna at night Kanha has fallen asleep leaning on a
// calf; the calf's flank and Kanha's chest rise together as they breathe in, the flute in his lap rising with him, and
// fireflies blink round them. The words are soft and small.
const KS = 10, KS_IN = 4;
function ksAt(t) {
  const p = ((t % KS) + KS) % KS, k = p < KS_IN ? 0 : 1, u = k ? (p - KS_IN) / (KS - KS_IN) : p / KS_IN;
  return { p, k, u, b: k ? .5 + .5 * Math.cos(Math.PI * u) : .5 - .5 * Math.cos(Math.PI * u) };
}
const KS_PARTS = () => window._ks || (window._ks = { k: scKanha(), grass: scGrass({ y: 1690 }) });
function ksScene(c, t, o = {}) {
  const len = o.len || DUR, { b } = o.breath || ksAt(t), P = KS_PARTS(), K = P.k, dy = o.dy || 0;
  scVrindavan(c, o.set);
  c.save(); c.translate(0, dy);
  c.save(); const sg = c.createRadialGradient(560, 1660, 10, 560, 1660, 460);
  sg.addColorStop(0, 'rgba(5,10,20,.6)'); sg.addColorStop(1, 'rgba(5,10,20,0)'); c.fillStyle = sg;
  c.translate(560, 1660); c.scale(1, .14); c.translate(-560, -1660); c.fillRect(100, 1200, 920, 920); c.restore();
  scDraw(c, K.calf, t, { ax: SCKR.calf[0], ay: SCKR.calf[1], sx: 1 + .02 * b, sy: 1 + .07 * b });
  const ear = flick(t, [3.1, 18.4], len);
  scDraw(c, K.calfHead, t, { ax: SCKR.calfNeck[0], ay: SCKR.calfNeck[1], rot: -.01 * b + .04 * ear, dy: -3 * b });
  scDraw(c, K.legs, t);
  scDraw(c, K.torso, t, { ax: SCKR.lap[0], ay: SCKR.lap[1], sx: 1 + .02 * b, sy: 1 + .04 * b });
  scDraw(c, K.head, t, { ax: SCKR.neck[0], ay: SCKR.neck[1], dy: -9 * b, rot: .2 + .02 * b });
  scDraw(c, P.grass, t);
  scFireflies(c, t, { n: 14, seed: 3, box: [60, 900, 1020, 1660], r: 12, len });
  c.restore();
}
const flick = (t, ts, len) => ts.reduce((s, t0) => { let d = ((t - t0) % len + len) % len; return s + (d < .5 ? Math.sin(d / .5 * Math.PI) * Math.exp(-d * 3) : 0); }, 0);

SHOTS.push({
  a: 0, b: DUR + 1, draw(c, u, t) {
    const B = ksAt(t);
    ksScene(c, t, { breath: B });
    if (window.COVER) return;
    const { k, b } = B, toNext = (k ? KS : KS_IN) - B.p, fade = clamp(toNext / .45);
    const s = lerp(.84, 1.08, b), y = lerp(560, 490, b), pop = t < .05 ? 1 : lerp(.75, 1, clamp((B.p - k * KS_IN) / .4));
    c.save(); c.translate(540, y); c.scale(pop, pop);
    scWord(c, k ? 'Breathe out' : 'Breathe in', 0, 0, 104 * s, { alpha: fade * .95, glow: ['rgba(5,10,30,.6)', 18] });
    scWord(c, k ? 'slowly… let the day go' : 'slowly…', 0, 88 * s, 44 * s, { alpha: .8 * fade, glow: ['rgba(5,10,30,.6)', 12] });
    c.restore();
  }
});
LOOK.bloom = .14; LOOK.vignette = .34; LOOK.grain = .05;
