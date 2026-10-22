// prad.js: "Why do Hindus walk around a temple CLOCKWISE?" (ad 31), the first reel in the 3D style: a stone Shiva
// shrine at dusk (cine3d_temple.js), the camera as the devotee. Pradakshina: keep God on your right, east → south →
// west like the sun. The twist: in a Shiva temple you never finish the circle; the abhisheka water runs out to the
// north through the somasutra, it is tirtha, you don't step over it; you walk round to it, turn back and go the other
// way (Shiva Rahasya 7.26.56, 80). The parent line, the ask, the 15K Family Deal card. STORYBOARD.md has the plan and
// the sources; the timeline (from the voice) is prad_tl.js, the trails, walker and card prad_props.js.
const W3 = world3(), T3 = shrine3(W3.scene), SC = W3.scene;
const CAPY = 1290;
VO.caps.forEach((k, i) => say(i ? k.a : -1, k.b, k.text, { at: i ? k.at : k.at.map(() => -1), y: CAPY }));

// the trails: the full clockwise round (B, D), the walker's steps (G), Shiva's way: clockwise from the channel's east
// side round to its west side, then back the other way on the outside (H, K)
const RING = trail3(SC, 0, .985, 40, { col: '#FFC860', size: .5 });
const STEPG = trail3(SC, .64, .733, 5, { col: '#FFC860' });
const GO = trail3(SC, .775, 1.725, 40, { col: '#FFC860', size: .5 });
const BACK = trail3(SC, 1.725, .775, 40, { col: '#FFE6B0', off: .62, size: .5 });
const STOP = [stopLine3(SC, -.5), stopLine3(SC, .5)];
// the sun's orb (D)
const SUN = glow3(SC, [0, 9, 0], 7, '#FFB040', 1), SUNC = glow3(SC, [0, 9, 0], 2.2, '#FFF4D0', 1);
const reset = () => { trailHide(RING, STEPG, GO, BACK); STOP.forEach(s => { s.material.opacity = 0; }); SUN.visible = SUNC.visible = false; };
const ON = { lamps: 1, water: 1 };
// the map: straight down, north up, the whole path in view
const mapCam = (u, z0 = 25, z1 = 23) => cam3({ pos: [0, lerp(z0, z1, easeIO(u / 4)), .001], at: [0, 0, 0], up: [0, 0, -1], fov: 40 });

// ================= A · the hook: the shrine at dusk, the camera already walking round it =================
SHOTS.push({ a: 0, b: TL.B0 + .4, draw(c, u, t) {
  reset(); const ex = W3.mood('dusk'); T3.set(t, ON);
  const a = .52 + u * .06;   // clockwise seen from above: east → south
  render3(c, SC, cam3({ pos: [Math.cos(a) * 16, 4.4 + u * .12, Math.sin(a) * 16], at: [0, 3.7, 0], fov: 46 }), { exposure: ex });
} });

// ================= B · pradakshina: the map, the footprints going round =================
SHOTS.push({ a: TL.B0, b: TL.C0 + .4, xf: .4, draw(c, u, t) {
  reset(); const ex = W3.mood('dusk', { hemi: 1.6 }); T3.set(t, ON);
  trailShow(RING, t, TL.B0 + .3, TL.RIGHTW + .2, { hold: .8, rest: .45 });
  render3(c, SC, mapCam(u), { exposure: ex * 1.1 });
  pin(c, 'E', [5.0, 0, 0], t, TL.B0 + .3, { size: 52, alpha: .9 }); pin(c, 'N', [0, 0, -6.4], t, TL.B0 + .3, { size: 52, alpha: .9 });
} });

// ================= C · on your right: the walk along the south side =================
SHOTS.push({ a: TL.C0, b: TL.D0 + .4, xf: .4, draw(c, u, t) {
  reset(); const ex = W3.mood('dusk'); T3.set(t, ON);
  const s = lerp(TL.walkC[0], TL.walkC[1], u / (TL.D0 + .4 - TL.C0));
  render3(c, SC, pov(s, { off: 1.2, at: [-3.1, 1.9, 2.0], fov: 64 }), { exposure: ex });
} });

// ================= D · the sun's way: east, south, west =================
SHOTS.push({ a: TL.D0, b: TL.E0 + .4, xf: .4, draw(c, u, t) {
  reset();
  const ss = kf(t, [[TL.D0, -.04], [TL.EAST, 0], [TL.SOUTH, .25], [TL.WEST, .5], [TL.E0 + .4, .62]], easeIO), th = ss * TAU;
  const ex = W3.mood('day', { sunAt: [Math.cos(th) * 8, 11, Math.sin(th) * 8] });
  T3.set(t, { lamps: 0, water: 1 });
  SUN.visible = SUNC.visible = true; for (const o of [SUN, SUNC]) o.position.set(Math.cos(th) * 5.6, 5.5, Math.sin(th) * 5.6 + 2);
  RING.forEach((f, i) => { const fs = i / RING.length; f.visible = fs <= ss + .01; f.material.opacity = .9 * clamp(1 - (ss - fs) * 1.2, .35, 1); });
  render3(c, SC, cam3({ pos: [0, 21, -10.5], at: [0, 0, 1.5], fov: 50 }), { exposure: ex });
  pin(c, 'EAST', [4.3, 0, 2], t, TL.EAST, { size: 46 }); pin(c, 'SOUTH', [0, 0, 6.9], t, TL.SOUTH, { size: 46 }); pin(c, 'WEST', [-4.3, 0, 2], t, TL.WEST, { size: 46 });
} });

// ================= E · the twist: walking up the west side, round the corner, and stopping =================
SHOTS.push({ a: TL.E0, b: TL.F0 + .4, xf: .4, draw(c, u, t) {
  reset(); const ex = W3.mood('dusk'); T3.set(t, ON);
  const s = kf(t, [[TL.E0, TL.walkE[0]], [TL.NEVER, TL.walkE[1] - .02], [TL.CIRCLE, TL.walkE[1]]], x => x < 1 ? easeOut(x) : 1);
  const stop = seg(t, TL.NEVER - .2, TL.NEVER + .4);
  render3(c, SC, pov(s, { turn: .12, pitch: lerp(.12, .3, stop), fov: 64, bob: 1 - stop }), { exposure: ex });
} });

// ================= F · the water: poured on the linga, out through the north wall =================
SHOTS.push({ a: TL.F0, b: TL.F2 + .4, xf: .4, draw(c, u, t) {
  reset(); const ex = W3.mood('night'); T3.set(t, ON);
  const k = easeIO(seg(t, TL.POURED - .2, TL.F2 + .3));
  render3(c, SC, cam3({ pos: [lerp(1.55, .95, k), lerp(2.15, 1.45, k), lerp(.35, -.35, k)], at: [lerp(0, 0, k), lerp(1.55, .85, k), lerp(0, -1.3, k)], fov: 48 }), { exposure: ex });
} });
SHOTS.push({ a: TL.F2, b: TL.G0 + .4, xf: .4, draw(c, u, t) {
  reset(); const ex = W3.mood('dusk'); T3.set(t, ON);
  const k = easeIO(u / (TL.G0 + .4 - TL.F2));
  render3(c, SC, cam3({ pos: [lerp(2.6, 1.7, k), lerp(1.5, 1.1, k), lerp(-4.2, -6.3, k)], at: [0, lerp(.55, .1, k), lerp(-3.1, -4.6, k)], fov: 50 }), { exposure: ex });
} });

// ================= G · tirtha: the walker comes to the channel's edge and stops =================
SHOTS.push({ a: TL.G0, b: TL.H0 + .4, xf: .4, draw(c, u, t) {
  reset(); const ex = W3.mood('dusk'); T3.set(t, ON);
  const s = kf(t, [[TL.G0, TL.walkG[0]], [TL.STEP - .2, TL.walkG[1]]], easeOut), stop = seg(t, TL.STEP - .6, TL.STEP);
  trailShow(STEPG, t, TL.G0 + .2, TL.STEP - .2);
  STOP[0].material.opacity = .9 * seg(t, TL.STEP, TL.STEP + .25) * (.75 + .25 * Math.sin(t * 6));
  render3(c, SC, pov(s, { turn: .05, pitch: lerp(.32, .62, stop), fov: 64, bob: 1 - stop }), { exposure: ex });
} });

// ================= H · round to it, turn back, the other way: the map =================
SHOTS.push({ a: TL.H0, b: TL.I0 + .4, xf: .4, draw(c, u, t) {
  reset(); const ex = W3.mood('dusk', { hemi: 1.6 }); T3.set(t, ON);
  trailShow(GO, t, TL.H0 + .25, TL.REACH + .25, { a: 1 });
  trailShow(BACK, t, TL.TURN, TL.OTHER + .5, { a: 1 });
  STOP[0].material.opacity = .9 * seg(t, TL.REACH + .2, TL.REACH + .4); STOP[1].material.opacity = .9 * seg(t, TL.OTHER + .4, TL.OTHER + .6);
  render3(c, SC, mapCam(u, 24, 22.5), { exposure: ex * 1.1 });
} });

// ================= I · the Shiva Rahasya: do not cross the somasutra =================
SHOTS.push({ a: TL.I0, b: TL.J0 + .4, xf: .4, draw(c, u, t) {
  reset(); const ex = W3.mood('dusk'); T3.set(t, ON);
  const k = easeIO(u / (TL.J0 + .4 - TL.I0));
  render3(c, SC, cam3({ pos: [lerp(-1.4, -1.0, k), lerp(1.0, .75, k), lerp(-5.6, -5.0, k)], at: [0, lerp(.35, .2, k), lerp(-3.4, -3.6, k)], fov: 52 }), { exposure: ex });
  const a = seg(t, TL.I0 + .5, TL.I0 + 1.1);
  text(c, 'सोमसूत्रं न लङ्घयेत्', 520, 640, '76px "Tiro Devanagari Sanskrit"', '#FFE2A0', { alpha: a, glow: ['rgba(255,170,60,.9)', 26], maxW: 900 });
  text(c, 'somasūtraṁ na laṅghayet', 520, 730, '40px Marcellus', '#FBE0CF', { alpha: a * .9 });
  text(c, '— Shiva Rahasya 7.26.80', 520, 790, '34px Marcellus', '#CFC2B0', { alpha: a * .8 });
} });

// ================= J · show your child: the shrine at dusk, the bell =================
SHOTS.push({ a: TL.J0, b: TL.K0 + .4, xf: .4, draw(c, u, t) {
  reset(); const ex = W3.mood('dusk'); T3.set(t, { ...ON, bell: .35 * Math.sin((t - TL.CHILD + .5) * 5.5) * Math.exp(-Math.max(0, t - TL.CHILD + .5) * .9) * (t > TL.CHILD - .5 ? 1 : 0) });
  const k = easeIO(u / (TL.K0 + .4 - TL.J0));
  render3(c, SC, cam3({ pos: [lerp(5.0, 13.5, k), lerp(1.5, 3.0, k), lerp(-.6, -2.4, k)], at: [0, lerp(1.9, 3.8, k), 0], fov: lerp(50, 48, k) }), { exposure: ex });
} });

// ================= K · the ask: the map, Shiva's way glowing =================
SHOTS.push({ a: TL.K0, b: TL.CARD, xf: .4, draw(c, u, t) {
  reset(); const ex = W3.mood('dusk', { hemi: 1.6 }); T3.set(t, ON);
  trailShow(GO, t, TL.K0 - 1, TL.K0 - .9); trailShow(BACK, t, TL.K0 - 1, TL.K0 - .9);
  STOP.forEach(s => { s.material.opacity = .8 + .2 * Math.sin(t * 5); });
  render3(c, SC, mapCam(u, 22, 20.5), { exposure: ex * 1.1 });
} });

// ================= L · the card =================
SHOTS.push({ a: TL.CARD, b: TL.END + 1, draw(c, u, t) { dealCardCine(c, u, t); } });
