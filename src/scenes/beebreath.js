// beebreath.js: "Bee breath with Bal Ganesha", a seamless Scribble loop of Bhramari pranayama (Hatha Yoga Pradipika
// 2.68): breathe in through the nose for 4 s, then hum like a bee for 8 s, three rounds (36 s). Bal Ganesha sits on a
// lotus in a pond, eyes closed; his chest fills and his trunk lifts as he breathes in, and as he hums his ears flutter
// and the bees circling him draw in close. The word rises and grows on the in-breath; the hum is a "Hmmm" that grows
// an m at a time while its letters tremble.
const BB = 12, BB_IN = 4;
function bbAt(t) {
  const p = ((t % BB) + BB) % BB, k = p < BB_IN ? 0 : 1, u = k ? (p - BB_IN) / (BB - BB_IN) : p / BB_IN;
  const b = k ? .5 + .5 * Math.cos(Math.PI * u) : .5 - .5 * Math.cos(Math.PI * u);   // 0 empty → 1 full
  const hum = k ? clamp(u * 12) * clamp((1 - u) * 14) : 0;                              // the hum's loudness
  return { p, k, u, b, hum };
}
const BG_PARTS = () => window._bg || (window._bg = { g: scGanesha(), lotus: scLotus(), bee: scBee() });
// the bees: each circles him a whole number of times a loop, on its own tilted ellipse
const BEES = Array.from({ length: 6 }, (_, i) => ({ n: [5, 6, 4, 6, 5, 4][i] * (i % 2 ? -1 : 1), ph: i / 6 * TAU + hash(i) * .6, rx: 330 + hash(i + 3) * 90, ry: 90 + hash(i + 7) * 70, cy: 1060 + hash(i + 9) * 160, tilt: (hash(i + 11) - .5) * .5, s: .85 + hash(i + 13) * .35 }));
function bbBees(c, t, front, P, hum, len) {
  BEES.forEach((B, i) => {
    const th = B.ph + TAU * B.n * t / len, sn = Math.sin(th);
    if ((sn >= 0) !== front) return;
    const rk = lerp(1.18, .86, hum), x0 = Math.cos(th) * B.rx * rk, y0 = sn * B.ry * rk;
    const x = 540 + x0 * Math.cos(B.tilt) - y0 * Math.sin(B.tilt), y = B.cy + x0 * Math.sin(B.tilt) + y0 * Math.cos(B.tilt) + 10 * Math.sin(t * TAU * .75 + i * 2);
    const vx = -Math.sin(th) * Math.sign(B.n), vy = Math.cos(th) * Math.sign(B.n) * B.ry / B.rx;
    const ang = Math.atan2(vy, vx), flap = .5 + .5 * Math.sin(t * TAU * 11 + i);
    scBeeDraw(c, P.bee, t, x + hum * 2.2 * Math.sin(t * TAU * 9 + i), y, ang, flap, B.s * (.92 + .14 * sn));
  });
}
function bbScene(c, t, o = {}) {
  const len = o.len || DUR, { b, hum } = o.breath || bbAt(t), P = BG_PARTS(), G = P.g, L = P.lotus;
  scPond(c, o.set);
  scDraw(c, L.pad, t);
  bbBees(c, t, false, P, hum, len);
  scDraw(c, L.back, t);
  const lift = 18 * b, fl = hum * .045 * Math.sin(t * TAU * 1.7);
  scDraw(c, G.earL, t, { ax: SCG.earL[0], ay: SCG.earL[1], dy: -lift, rot: -.05 * b + fl });
  scDraw(c, G.earR, t, { ax: SCG.earR[0], ay: SCG.earR[1], dy: -lift, rot: .05 * b - fl });
  scDraw(c, G.legs, t);
  scDraw(c, G.torso, t, { ax: SCG.lap[0], ay: SCG.lap[1], sx: 1 + .035 * b, sy: 1 + .055 * b });
  scDraw(c, G.head, t, { ax: SCG.neck[0], ay: SCG.neck[1], dy: -lift, rot: .01 * Math.sin(t * TAU / BB) });
  scDraw(c, G.trunk, t, { ax: SCG.trunkRoot[0], ay: SCG.trunkRoot[1], dy: -lift, rot: -.07 * b + hum * .012 * Math.sin(t * TAU * 2.3) });
  scDraw(c, L.front, t);
  bbBees(c, t, true, P, hum, len);
}

SHOTS.push({
  a: 0, b: DUR + 1, draw(c, u, t) {
    const B = bbAt(t);
    bbScene(c, t, { breath: B });
    if (window.COVER) return;
    const G = ['rgba(20,60,70,.6)', 20];
    // the words
    const { k, u: pu, b, hum } = B, toNext = k ? (BB - B.p) : (BB_IN - B.p), fade = clamp(toNext / .35);
    if (k === 0) {
      const s = lerp(.82, 1.12, b), y = lerp(560, 480, b), pop = t < .05 ? 1 : lerp(.6, 1, clamp(B.p / .22));
      c.save(); c.translate(540, y); c.scale(pop, pop);
      scWord(c, 'Breathe in', 0, 0, 112 * s, { alpha: fade, glow: G });
      scWord(c, 'through your nose', 0, 92 * s, 46 * s, { alpha: .9 * fade, glow: G });
      c.restore();
    } else {
      const s = lerp(.86, 1.12, b), y = lerp(560, 480, b), m = 3 + Math.floor(pu * 7);
      const pop = lerp(.6, 1, clamp((B.p - BB_IN) / .22));
      c.save(); c.translate(540, y); c.scale(pop, pop);
      scWord(c, 'H' + 'm'.repeat(m), 0, 0, 112 * s, { alpha: fade, wave: 3 + 5 * hum, t, glow: G });
      scWord(c, 'hum like a bee', 0, 92 * s, 46 * s, { alpha: .9 * fade, glow: G });
      c.restore();
    }
  }
});
LOOK.bloom = .1; LOOK.vignette = .28; LOOK.grain = .05;
