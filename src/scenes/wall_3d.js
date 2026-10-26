// wall_3d.js: the 3D wallpaper (batch 3, studio_wall_3d.html): the shrine set at dusk, seen from the east through its
// door, the linga lit by the sanctum lamps; a seamless 6 s loop at 1290×2796, registered like wall_sb.js
// (LOOPS.<name>, <name>_wake: the iPhone's 2 s landing on the still at 1.5 s, <name>_lock). Every lamp flickers on a
// clock that swings once a loop; each stream of water scrolls a whole number of texture repeats a loop.
const WL = 6, DW = 1080, KS = W / DW, WAKE = 1.5;
const lsin = (t, n = 1, ph = 0) => Math.sin((t / WL * n + ph) * TAU);
const lmod = t => ((t % WL) + WL) % WL;
const W3 = world3(), T3 = shrine3(W3.scene);
function lockScreen3(c) {
  c.save(); c.setTransform(KS, 0, 0, KS, 0, 0); c.fillStyle = 'rgba(255,255,255,.92)'; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.font = '500 46px Poppins'; c.fillText('Monday, 26 October', DW / 2, 255); c.font = '700 250px Poppins'; c.fillText('9:41', DW / 2, 450);
  c.fillStyle = 'rgba(30,30,40,.5)'; for (const x of [150, 930]) { c.beginPath(); c.arc(x, 2175, 62, 0, TAU); c.fill(); }
  c.fillStyle = 'rgba(255,255,255,.8)'; c.fillRect(DW / 2 - 140, 2282, 280, 12); c.restore();
}
// the shrine at dusk; k the wake-up: the lamps light one after another and the bell swings
function sanctum(c, t, k) {
  const ex = W3.mood('dusk'), ct = 30 + 1.4 * Math.sin(TAU * t / WL), ws = (m, sp) => m.set(t * Math.max(1, Math.round(sp * WL)) / (sp * WL), 1);
  T3.set(ct, { lamps: i => k >= 1 ? 1 : seg(k, .05 + (i % 8) * .07, .3 + (i % 8) * .07), inner: i => k >= 1 ? 1 : seg(k, .1 + i * .15, .4 + i * .15), water: 1,
    bell: lsin(t, 1) * .05 + (k < 1 ? Math.sin(seg(k, .1, 1) * TAU * 2) * .45 * (1 - seg(k, .1, 1)) : 0) });
  [[T3.pour, 6], [T3.basin, 1.5], [T3.lip, 1.6], [T3.drop, 3], [T3.spout, 3.2], [T3.channel, 1.4]].forEach(([m, sp]) => m.set && ws(m, sp));
  const dz = lsin(t, 1) * .25, dy = lsin(t, 1, .25) * .06;
  render3(c, W3.scene, cam3({ pos: [7.3, 1.45 + dy, .9 + dz], at: [0, 3.5, .1], fov: 80 }), { exposure: ex * (1 + (k < 1 ? .25 * Math.sin(Math.PI * seg(k, .5, 1)) : 0)) });
}
let LOCK = false;
function wall3(name, fn) {
  const at = (c, t, k) => { T = lmod(t); fn(c, lmod(t), k); };
  LOOPS[name] = (c, t) => at(c, t, 1); LOOPS[name + '_wake'] = (c, t) => at(c, t - WAKE, clamp(t / WAKE)); LOOPS[name + '_lock'] = (c, t) => { at(c, t, 1); c.__lock = 1; };
  LOOPS[name].len = LOOPS[name + '_lock'].len = WL; LOOPS[name + '_wake'].len = 2;
}
wall3('wall3d_sanctum', sanctum);
SHOTS.push({ a: 0, b: 1e9, draw(c, u, t) { const q = new URLSearchParams(location.search).get('loop'), L = window.LOOP || LOOPS[q] || LOOPS.wall3d_sanctum; c.__lock = 0; L(c, t); LOCK = !!c.__lock; } });
POST.push(c => { if (LOCK) lockScreen3(c); });
