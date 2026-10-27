// wall_pt.js: Painterly live wallpapers (studio_wall_pt.html) at 1290×2796, drawn in the 1080×2340 design space and
// painted at full resolution (PT.k = W / 1080), seamless 6 s loops. wallP(name, fn(c, t, k)) registers <name> (the loop,
// frame 0 the still), <name>_wake (the iPhone's 2 s: k rises 0 → 1 over 1.5 s while the loop plays its last 1.5 s,
// landing on the still) and <name>_lock (a mock lock screen).
const WL = 6, DW = 1080, DH = 2340, KS = W / DW, WAKE = 1.5, LPW = TAU / WL;
PT.k = KS;
const lmod = t => ((t % WL) + WL) % WL;
let LOCK = false;
function lockScreen(c) {
  c.save(); c.setTransform(KS, 0, 0, KS, 0, 0); c.fillStyle = 'rgba(255,255,255,.92)'; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.font = '500 46px Poppins'; c.fillText('Monday, 26 October', DW / 2, 255); c.font = '700 250px Poppins'; c.fillText('9:41', DW / 2, 450);
  c.fillStyle = 'rgba(30,30,40,.5)'; for (const x of [150, 930]) { c.beginPath(); c.arc(x, 2175, 62, 0, TAU); c.fill(); }
  c.fillStyle = 'rgba(255,255,255,.8)'; c.fillRect(DW / 2 - 140, 2282, 280, 12); c.restore();
}
function wallP(name, look, fn) {
  const at = (c, t, k) => { T = lmod(t); Object.assign(LOOK, look); c.setTransform(KS, 0, 0, KS, 0, 0); fn(c, lmod(t), k); };
  LOOPS[name] = (c, t) => at(c, t, 1); LOOPS[name + '_wake'] = (c, t) => at(c, t - WAKE, clamp(t / WAKE)); LOOPS[name + '_lock'] = (c, t) => { at(c, t, 1); c.__lock = 1; };
  LOOPS[name].len = LOOPS[name + '_lock'].len = WL; LOOPS[name + '_wake'].len = 2;
}
SHOTS.push({ a: 0, b: 1e9, draw(c, u, t) { const q = new URLSearchParams(location.search).get('loop'), L = window.LOOP || LOOPS[q] || Object.values(LOOPS)[0]; c.__lock = 0; L(c, t); LOCK = !!c.__lock; } });
POST.push(c => { if (LOCK) lockScreen(c); });
// draw(t) and draw(t - WL) crossfaded across the loop: anything that drifts comes back to where it started
const loopedW = (t, draw) => { const u = t / WL; draw(t, 1 - u); draw(t - WL, u); };

// ---------- Hanuman in meditation ("Ram hi paar lagavenge", the reel on reel/hanuman-ram-loop) ----------
// The reel's scene moved down 420 px, the forest grown up to the top so the clock sits over the canopy. Tail: two
// sways a loop through 12 poses. wake: the राम rings bloom open from his head, the halo, rays and rim light rise.
const DY = 420, TAIL_N = 12;
wallP('pt_hanuman', { bloom: .22, vignette: .45, grain: .045 }, (c, t, k) => {
  const e = easeOut(k);
  c.translate(0, DY);
  ptDraw(c, ptLayer('forest', [0, -DY, DW, DH], c2 => ptForest(c2, -DY), { seed: 5 }));
  loopedW(t, (tt, w) => rays(c, PT_SUN[0] + 60, PT_SUN[1] - 520, { n: 14, dir: Math.PI / 2 + .12, spread: .9, len: 1900, w: 190, col: '#FFF6C4', a: (.16 + .05 * Math.sin(tt * 2 * LPW)) * w * lerp(.35, 1, e), t: tt, seed: 3 }));
  glow(c, PT_HX, 1000, 420, '#FFF3B0', (.3 + .06 * Math.sin(t * 2 * LPW)) * lerp(.45, 1, e), 'screen');
  const p = Math.floor(t / WL * 2 * TAIL_N) % TAIL_N;
  ptDraw(c, ptLayer('tail' + p, PT_TAIL_BOX, ptTail(p / TAIL_N), { alpha: true, seed: 9, brushes: PT_BRUSHES.slice(2) }));
  ptDraw(c, ptLayer('gada', [880, 930, 200, 560], ptGada, { alpha: true, seed: 13, brushes: PT_BRUSHES.slice(1) }));
  const hero = ptLayer('hanuman', [PT_HX - 420, 790, 840, 760], ptHanuman, {
    alpha: true, seed: 17, brushes: PT_BRUSHES.slice(1),
    fine: [[PT_HX, 1000, 75], [PT_HX - 300, 1440, 50], [PT_HX + 300, 1440, 50]], keep: [[PT_HX, 1005, 62, .55]],
  });
  ptDraw(c, hero);
  const rim = ptRim(hero, { dx: 0, dy: -5, col: '#FFF0A8', blur: 6, key: 'h' });
  ptDraw(c, rim, (.5 + .15 * Math.sin(t * 2 * LPW)) * lerp(.2, 1, e), 'screen');
  // the rings open out from his head in turn on wake
  [[190, 175, .7, 25], [255, 245, .62, 25], [320, 315, .52, 23], [385, 385, .42, 23], [450, 455, .32, 22]].forEach(([rx, ry, a, size], i) => {
    const ki = easeOut(k >= 1 ? 1 : seg(k, i * .12, .5 + i * .12)), s = lerp(.55, 1, ki);
    nameRing(c, PT_HX, PT_HY + 40, rx * s, ry * s, -Math.PI * 1.08, Math.PI * .08, 'राम', { size, a: a * ki, rot: (i % 2 ? -1 : 1) * .06 * Math.sin(t * LPW + i), ph: t * 4 * LPW, seed: i * 3, shimmer: .5 });
  });
  loopedW(t, (tt, w) => motes(c, { n: 90, seed: 4, box: [60, -300, 1020, 1600], r: 3.4, col: '#FFF6C8', a: .7 * w, vx: 6, vy: -10, t: tt }));
  rim.pts.forEach(([x, y], i) => {
    const rate = Math.max(1, Math.round((.35 + hash(i) * .4) * WL)) / WL, ph = frac(t * rate + hash(i + 9));
    twinkle(c, x, y, 9 + hash(i + 3) * 8, Math.pow(Math.max(0, Math.sin(ph * Math.PI)), 6) * .9 * e);
  });
});
