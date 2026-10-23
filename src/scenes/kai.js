// kai.js: "No human has EVER climbed this mountain." (ad 41), the second 3D reel: Mount Kailash (cine3d_kailash.js).
// Everest is 2 km taller and climbed 13,000+ times; Kailash, zero. Shiva's home, the mountain Ravana lifted, four rivers
// rising near it; Reinhold Messner refused it ("we conquer something in people's souls"); climbing it is forbidden.
// The twist: pilgrims walk AROUND it, over 50 km and a 5,600 m pass, Shiva on their right: pradakshina (the ad 31
// callback, its shrine and footprints). The ask, the 15K Family Deal card. STORYBOARD.md has the plan and the sources;
// the timeline (from the voice) is kai_tl.js, the stage, rivers, labels and card kai_props.js.
const K3 = kailash3(), KS = K3.scene; CAM3.far = 4500;
const STAGE = stage3();
const W3 = world3(), T3 = shrine3(W3.scene), RING = trail3(W3.scene, 0, .985, 40, { size: .5 });
const CAPY = 1290;
VO.caps.forEach((k, i) => say(i ? k.a : -1, k.b, k.text, { at: i ? k.at : k.at.map(() => -1), y: CAPY }));

// the kora: its highest point (the Dolma La), the gold line for the maps and for the walk, the prayer flags
const S_PASS = (() => { let best = 0, by = -1; for (let s = 0; s < 1; s += .002) { const y = K3.kora(s).y; if (y > by) { by = y; best = s; } } return best; })();
const RIB = K3.ribbon(0, 1, { w: 2.4, lift: .5 }), RIBW = K3.ribbon(S_PASS - .3, S_PASS + .1, { w: .9, lift: .15 });
// the Dolma La: where the camera stands (K), a pole of prayer flags beside it on the left
const PASSV = (() => { const q = K3.kora(S_PASS), rx = -q.dz, rz = q.dx, P = (k) => { const p = [q.x - q.dx * lerp(2.6, 1.6, k) - rx * .3, 0, q.z - q.dz * lerp(2.6, 1.6, k) - rz * .3]; p[1] = K3.h(p[0], p[2]) + lerp(.5, .42, k); return p; }; return { q, P }; })();
const FLAGS = (() => {
  const p = PASSV.P(.5), q = PASSV.q, f = V3(q.x * .5 - p[0], 0, q.z * .5 - p[2]).normalize(), l = [f.z, 0, -f.x];   // forward (toward the peak), left
  const at = (fw, lf) => { const x = p[0] + f.x * fw + l[0] * lf, z = p[2] + f.z * fw + l[2] * lf; return [x, K3.h(x, z), z]; };
  const base = at(1.6, 1.0), top = [base[0], base[1] + .7, base[2]];
  return flagFan(KS, top, [at(1.0, .2), at(1.5, .05), at(2.2, .2), at(2.8, .6), at(2.4, 1.8), at(1.4, 1.9)], .03);
})();
const HEAD = glow3(KS, [0, 0, 0], 9, '#FFE2A0', 1);
const RIV = RIVERS.map(r => K3.river(r.pts, { r: 1.6 }));
const reset = () => { RIB.set(0); RIBW.set(0); HEAD.visible = false; RIV.forEach(r => r.set(0, 0)); FLAGS.visible = false; CAM3.near = .05; };

// shake: a camera offset that dies away after t0
const shake = (t, t0, amp) => { const u = t - t0; if (u < 0) return [0, 0, 0]; const a = amp * Math.exp(-u * 1.6); return [a * vnoise(t * 19, 1), a * vnoise(t * 23, 2) * .6, a * vnoise(t * 17, 3)]; };
const add3 = (a, b) => a.map((v, i) => v + b[i]);
// a drone over the kora at s: h above the path, looking along it, turned toward the peak (right) by turn radians
function droneAt(s, o = {}) {
  const q = K3.kora(s), h = o.h ?? 1.2, tn = o.turn ?? .4, rx = -q.dz, rz = q.dx;   // the walker's right (toward the peak)
  const lx = q.dx * Math.cos(tn) + rx * Math.sin(tn), lz = q.dz * Math.cos(tn) + rz * Math.sin(tn), y = q.y + h;
  return cam3({ pos: [q.x - q.dx * (o.back ?? 0), y, q.z - q.dz * (o.back ?? 0)], at: [q.x + lx * 10, y + (o.look ?? .6), q.z + lz * 10], fov: o.fov ?? 60 });
}
const mapCam = (y, cz = 60, cx = 0) => cam3({ pos: [cx, y, cz + .001], at: [cx, 0, cz], up: [0, 0, -1], fov: 50 });

// ================= A · the hook: Kailash's south face in the morning =================
SHOTS.push({ a: 0, b: TL.B0 + .4, draw(c, u, t) {
  reset(); const ex = K3.mood('morning'); K3.set(t, { clouds: .45, plume: .7 });
  render3(c, KS, cam3({ pos: [lerp(2, 0, u / 3), 6.5 + u * .15, 62 - u * 1.6], at: [0, 13.6, 0], fov: 38 }), { exposure: ex });
} });

// ================= B · Everest beside Kailash: 2 km taller, 13,000 climbs; Kailash, zero =================
SHOTS.push({ a: TL.B0, b: TL.D0 + .4, xf: .4, draw(c, u, t) {
  reset(); STAGE.setLamps(t, seg(t, TL.B0 + .5, TL.B0 + 1.5));
  const k = easeIO(seg(t, TL.ONE - .5, TL.ZERO + .2));
  render3(c, STAGE.scene, cam3({ pos: [lerp(-2, 9, k), lerp(12, 14, k), lerp(150 - u * 2, 92, k)], at: [lerp(-1, 9, k), lerp(11.5, 14, k), 0], fov: 32 }), { exposure: 1.05 });
  const E = toScreen3(STAGE.top.e), K = toScreen3(STAGE.top.k);
  pin(c, 'EVEREST', STAGE.top.e, t, TL.EVEREST, { size: 52, dy: -120, col: '#FFF3DC' });
  pin(c, '8,849 m', STAGE.top.e, t, TL.EVEREST + .15, { font: '42px Marcellus', dy: -66, col: '#CFE0FF' });
  pin(c, 'KAILASH', STAGE.top.k, t, TL.TALLER - .3, { size: 52, dy: -120, col: '#F4C46A' });
  pin(c, '6,638 m', STAGE.top.k, t, TL.TALLER - .15, { font: '42px Marcellus', dy: -66, col: '#CFE0FF' });
  // the 2 km between them
  const dk = easeOut(seg(t, TL.TALLER - .3, TL.TALLER + .5)) * (1 - k);
  dash(c, K, [E[0], K[1]], 'rgba(255,226,160,.9)', dk);
  if (dk > .9) { c.save(); c.strokeStyle = 'rgba(255,226,160,.9)'; c.lineWidth = 4; c.beginPath(); c.moveTo(E[0] + 30, K[1]); c.lineTo(E[0] + 30, E[1]); c.stroke(); c.restore();
    text(c, '+2.2 km', E[0] + 110, (E[1] + K[1]) / 2, '700 40px Cinzel', '#FFE2A0', { pop: t - TL.TALLER - .2, glow: ['rgba(6,6,14,.9)', 16], alpha: 1 - k }); }
  // the climbs counting up under Everest
  const n = Math.round(13000 * easeOut(seg(t, TL.TIMES - 1.5, TL.TIMES + .1)));
  if (t > TL.TIMES - 1.5) text(c, (n >= 13000 ? '13,000+' : n.toLocaleString('en-IN')) + ' climbs', E[0], E[1] - 210, '700 50px Cinzel', '#FFE2A0', { glow: ['rgba(6,6,14,.95)', 20], alpha: 1 - k, maxW: 520 });
  // Kailash: zero
  if (t > TL.ZERO - .05) text(c, '0', K[0], K[1] - 300, '700 230px Cinzel', '#F4C46A', { pop: t - TL.ZERO + .05, glow: ['rgba(244,170,60,.7)', 40] });
} });

// ================= D · Mount Kailash, the home of Shiva: golden light, the crescent moon =================
SHOTS.push({ a: TL.D0, b: TL.E0 + .4, xf: .4, draw(c, u, t) {
  reset(); const ex = K3.mood('golden', { moon: [-520, 1150, -2500] }); K3.set(t, { clouds: .35, plume: .8 });
  const a = 1.95 - u * .03, r = 66;
  render3(c, KS, cam3({ pos: [Math.cos(a) * r, 8, Math.sin(a) * r], at: [0, 14.5, 0], fov: 40 }), { exposure: ex });
} });

// ================= E · the mountain Ravana lifted: it shakes =================
SHOTS.push({ a: TL.E0, b: TL.F0 + .4, xf: .3, draw(c, u, t) {
  reset(); const ex = K3.mood('alpen'); K3.set(t, { clouds: .3, plume: .9 });
  const sk = shake(t, TL.RAVANA - .1, .9);
  render3(c, KS, cam3({ pos: add3([5 - u * .4, 4.5, 34 - u * .6], sk), at: add3([0, 15, 0], sk.map(v => v * .5)), fov: 52, roll: sk[0] * .02 }), { exposure: ex });
  flash(c, .22 * Math.exp(-Math.max(0, t - TL.RAVANA) * 3) * (t > TL.RAVANA - .1 ? 1 : 0), '#FF6A3A');
} });

// ================= F · four rivers: the map =================
SHOTS.push({ a: TL.F0, b: TL.G0 + .4, xf: .4, draw(c, u, t) {
  reset(); const ex = K3.mood('map', { shadow: 280, at: [0, 0, 60] }); K3.set(t, { clouds: 0, plume: 0 });
  RIVERS.forEach((r, i) => RIV[i].set(t, easeOut(seg(t, TL[r.at] - .25, TL[r.at] + 1.4))));
  render3(c, KS, mapCam(lerp(330, 300, easeIO(u / 6.5)), 55), { exposure: ex });
  pin(c, 'KAILASH', [0, 22, 0], t, TL.F0 + .2, { size: 40, dy: -50, col: '#FFF3DC' });
  pin(c, 'Manasarovar', [32, 0, 122], t, TL.F0 + .4, { font: 'italic 34px Marcellus', col: '#D8F0FF', spacing: 0 });
  RIVERS.forEach(r => pin(c, r.name, r.label, t, TL[r.at] + .1, { size: 46, col: '#BFEFFF', maxW: 440 }));
} });

// ================= G · Reinhold Messner: the north face at dusk, then the summit =================
SHOTS.push({ a: TL.G0, b: TL.G2 + .4, xf: .4, draw(c, u, t) {
  reset(); const ex = K3.mood('blue', { moon: [600, 1300, 2400] }); K3.set(t, { clouds: .25, plume: .6 });
  const k = easeIO(u / (TL.G2 + .4 - TL.G0));
  render3(c, KS, cam3({ pos: [lerp(3, 1, k), lerp(4.5, 5.5, k), lerp(-27, -24, k)], at: [0, lerp(12, 17, k), 0], fov: 58 }), { exposure: ex });
} });
SHOTS.push({ a: TL.G2, b: TL.H0 + .4, xf: .4, draw(c, u, t) {
  reset(); const ex = K3.mood('golden'); K3.set(t, { clouds: .5, plume: 1 });
  const a = 1.2 + u * .05, r = lerp(40, 35, easeOut(seg(t, TL.REFUSED - .2, TL.REFUSED + .6)));
  render3(c, KS, cam3({ pos: [Math.cos(a) * r, 16, Math.sin(a) * r], at: [0, 17, 0], fov: 46 }), { exposure: ex });
} });

// ================= H · "we conquer something in people's souls": the summit's ice dome at sunset =================
SHOTS.push({ a: TL.H0, b: TL.I0 + .4, xf: .4, draw(c, u, t) {
  reset(); const ex = K3.mood('alpen'); K3.set(t, { clouds: .4, plume: 1, wind: 2.5 });
  const k = u / (TL.I0 + .4 - TL.H0);
  const a = lerp(1.2, 1.35, k), r = lerp(52, 46, k);
  render3(c, KS, cam3({ pos: [Math.cos(a) * r, lerp(13, 14, k), Math.sin(a) * r], at: [0, 15.5, 0], fov: 42 }), { exposure: ex });
} });

// ================= I · forbidden: night, the stars, the moon =================
SHOTS.push({ a: TL.I0, b: TL.J0 + .4, xf: .4, draw(c, u, t) {
  reset(); const ex = K3.mood('blue', { moon: [-500, 900, -2600] }); K3.set(t, { clouds: .2, plume: .5 });
  const k = u / (TL.J0 + .4 - TL.I0);
  render3(c, KS, cam3({ pos: [lerp(28, 22, k), 7, lerp(70, 64, k)], at: [0, 13.5, 0], fov: 42 }), { exposure: ex });
} });

// ================= J · they walk AROUND it: the camera rises to the map, the gold line goes round =================
SHOTS.push({ a: TL.J0, b: TL.K0 + .4, xf: .4, draw(c, u, t) {
  reset(); const ex = K3.mood('morning', { shadow: 120 }); K3.set(t, { clouds: .3 * (1 - seg(t, TL.WALK - 1, TL.WALK)), plume: .6 });
  const k = easeIO(seg(t, TL.J0, TL.WALK + .4)), on = easeIO(seg(t, TL.WALK - .1, TL.K0 + .3));
  RIB.set(on, 1); const q = K3.kora(on); HEAD.visible = on > 0 && on < 1; HEAD.position.set(q.x, q.y + 1, q.z);
  render3(c, KS, cam3({ pos: [0, lerp(30, 175, k), lerp(105, 48, k)], at: [0, lerp(10, 0, k), lerp(0, 4, k)], fov: 50 }), { exposure: ex });
} });

// ================= K · the kora: up at the Dolma La's prayer flags, then Shiva on their right =================
SHOTS.push({ a: TL.K0, b: TL.K2 + .4, xf: .4, draw(c, u, t) {
  reset(); const ex = K3.mood('morning', { at: [0, 8, -10] }); K3.set(t, { clouds: .5, plume: .8 });
  FLAGS.visible = true; FLAGS.set(t); CAM3.near = .01;
  const q = PASSV.q, k = easeOut(seg(t, TL.K0, TL.K2 + .4)), P = PASSV.P(k);
  render3(c, KS, cam3({ pos: P, at: [q.x * .5, lerp(10, 13, k), q.z * .5], fov: 56 }), { exposure: ex });
  if (t > TL.PASS - .1) text(c, 'DOLMA LA', 540, 560, '700 54px Cinzel', '#FFF3DC', { pop: t - TL.PASS + .1, glow: ['rgba(6,6,14,.9)', 18], spacing: 3 });
  if (t > TL.METRES - .1) text(c, '5,630 m · the highest point of the kora', 540, 626, '40px Marcellus', '#E4ECFF', { pop: t - TL.METRES + .1, glow: ['rgba(6,6,14,.9)', 16], maxW: 860 });
} });
SHOTS.push({ a: TL.K2, b: TL.L0 + .4, xf: .4, draw(c, u, t) {
  reset(); const ex = K3.mood('day', { at: [0, 8, -10] }); K3.set(t, { clouds: .4, plume: .8 });
  RIBW.set(1, .9);
  const s = lerp(S_PASS - .2, S_PASS - .15, u / (TL.L0 + .4 - TL.K2)), q = K3.kora(s), rx = -q.dz, rz = q.dx;
  render3(c, KS, cam3({ pos: [q.x - q.dx * 9 - rx * 5, q.y + 6.5, q.z - q.dz * 9 - rz * 5], at: [q.x + q.dx * 6 + rx * 15, q.y + 8.5, q.z + q.dz * 6 + rz * 15], fov: 62 }), { exposure: ex });
} });

// ================= L · pradakshina: the ad 31 shrine's footprints, then Kailash's =================
SHOTS.push({ a: TL.L0, b: TL.M0 + .4, xf: .4, draw(c, u, t) {
  reset();
  const xk = easeIO(seg(u, 1.2, 2.2));
  if (xk < 1) {
    const ex = W3.mood('dusk', { hemi: 1.6 }); T3.set(t, { lamps: 1, water: 1 }); trailShow(RING, t, TL.L0 - 1, TL.L0 - .9);
    render3(c, W3.scene, cam3({ pos: [0, lerp(24, 60, easeIn(seg(u, .3, 2.2))), .001], at: [0, 0, 0], up: [0, 0, -1], fov: 40 }), { exposure: ex * 1.1 });
  }
  if (xk > 0) {
    const ex = K3.mood('map', { shadow: 120, at: [0, 0, 10] }); K3.set(t, { clouds: 0, plume: 0 }); RIB.set(1, 1);
    render3(c, KS, mapCam(lerp(90, 150, easeOut(seg(u, 1.2, 3.5))), 6), { exposure: ex, alpha: xk });
  }
} });

// ================= M · the ask: Kailash at sunset, the gold kora round it =================
SHOTS.push({ a: TL.M0, b: TL.CARD, xf: .4, draw(c, u, t) {
  reset(); const ex = K3.mood('alpen', { shadow: 120 }); K3.set(t, { clouds: .3, plume: .8 });
  RIB.set(1, .9);
  const a = 1.75 - u * .04, r = 110;
  render3(c, KS, cam3({ pos: [Math.cos(a) * r, 34, Math.sin(a) * r], at: [0, 9, 0], fov: 42 }), { exposure: ex });
} });

// ================= N · the card =================
SHOTS.push({ a: TL.CARD, b: TL.END + 1, draw(c, u, t) { dealCardCine(c, u, t); } });
