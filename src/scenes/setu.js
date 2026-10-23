// setu.js: "This bridge across the SEA was built in FIVE DAYS." (ad 42), the third 3D reel: Ram Setu, told from Valmiki
// (Yuddha Kanda 21–22). Ram's army reaches the sea; three nights he prays to the Ocean, who never comes; his arrows raise
// waves like mountains; the Ocean god rises: he cannot change his nature, but Nala, son of Vishwakarma, can build a
// bridge, and he will hold it. The vanaras hurl trees and rocks as big as elephants; 14, 20, 21, 22, 23 yojanas in five
// days, 100 long and 10 wide; the gods watch; it shines like the Milky Way; Ram crosses on Hanuman's shoulders, Lakshman on
// Angad's. Today a 48 km chain of shoals runs from India to Sri Lanka: Ram Setu. The ask, the 15K Family Deal card.
// STORYBOARD.md has the plan and the sources; the timeline (from the voice) is setu_tl.js, the camp, labels, counter and
// card setu_props.js. Sets: the Palk Strait (cine3d_setu.js) and India (cine3d_india.js).
const S3 = setu3(), I3 = india3(); CAM3.far = 12000;
const A = S3.path(0), B = S3.path(1), CAMP = camp3(S3);
const CAPY = 1290;
VO.caps.forEach((k, i) => say(i ? k.a : -1, k.b, k.text, { at: i ? k.at : k.at.map(() => -1), y: CAPY }));
// Ram Setu's line on the India map
const ISETU = line3(I3.scene, SETU.line.map(([lon, lat]) => I3.at(lon, lat, .3)), { col: '#FFD27A', add: true, core: .8 });
const ISGLOW = glow3(I3.scene, I3.at(79.57, 9.13, 1), 20, '#FFC860', 0); ISGLOW.renderOrder = 6; ISGLOW.material.depthTest = false;
const P3 = (k, y = 0) => { const [x, z] = S3.ll(...PLACES[k]); return [x, y, z]; };

const reset = () => {
  S3.bridge.set(0); S3.fly.set(0, 0, 0); S3.army.set(0, 0, 0); S3.god.set(0, 0); S3.fire.set(0, 0); S3.shoal.set(0); S3.arrows.set(0, []);
  CAMP.set(0, 0); S3.set(0); ISETU.set(0); ISGLOW.visible = false; I3.border.set(0); I3.lanka.set(0); CAM3.near = .3;
};
const shake = (t, t0, amp) => { const u = t - t0; if (u < 0) return [0, 0, 0]; const a = amp * Math.exp(-u * 2); return [a * vnoise(t * 19, 1), a * vnoise(t * 23, 2) * .6, a * vnoise(t * 17, 3)]; };
const add3 = (a, b) => a.map((v, i) => v + b[i]);
// a camera straight down over (x, z) at height y, the bridge's line running up the screen (Sri Lanka at the top)
const topCam = (x, z, y, fov = 50) => { CAM3.near = y * .2; return cam3({ pos: [x, y, z + .001], at: [x, 0, z], up: [B.x - A.x, 0, B.z - A.z], fov }); };

// ================= A · the hook: the finished bridge across the strait, golden light =================
SHOTS.push({ a: 0, b: TL.B0 + .4, draw(c, u, t) {
  reset(); const ex = S3.mood('golden', { at: [0, 0, 0], shadow: 260 }); S3.set(t, { ripple: .15 }); S3.bridge.set(1);
  const d = [B.x - A.x, B.z - A.z], l = Math.hypot(...d), dx = d[0] / l, dz = d[1] / l;
  render3(c, S3.scene, cam3({ pos: [A.x - dx * (95 - u * 5) + dz * 18, 48 - u * 1.5, A.z - dz * (95 - u * 5) - dx * 18], at: [lerp(A.x, B.x, .62), 0, lerp(A.z, B.z, .62)], fov: 50 }), { exposure: ex });
} });

// ================= B · "It's RAM SETU." India from the sky, diving to the strait =================
SHOTS.push({ a: TL.B0, b: TL.C0 + .4, xf: .4, draw(c, u, t) {
  const k = easeIO(clamp(u / (TL.C0 + .4 - TL.B0))), p = I3.at(79.57, 9.13), alt = lerp(720, 120, k);
  reset(); const ex = I3.mood('space', { focus: lerp(1, .25, k), edge: 1 - k, at: I3.at(79.5, 12), shadow: 400 });
  const on = easeOut(seg(t, TL.SETU - .3, TL.SETU + .5));
  I3.border.set(1, alt * .005, .85); I3.lanka.set(1, alt * .005, .85); ISETU.set(on, alt * .014, 1);
  ISGLOW.visible = on > 0; ISGLOW.scale.setScalar(alt * .09 * (1 + .12 * Math.sin(t * 6))); ISGLOW.material.opacity = .8 * on;
  CAM3.near = 2;
  render3(c, I3.scene, cam3({ pos: [lerp(p[0] + 4, p[0], k), alt, lerp(p[2] - 110, p[2] + alt * .55, k)], at: [p[0], 0, lerp(p[2] - 150, p[2] + alt * .22, k)], fov: 45 }), { exposure: ex });
} });

// ================= C · the army reaches the sea at dawn; Lanka across it =================
SHOTS.push({ a: TL.C0, b: TL.D0 + .4, xf: .4, draw(c, u, t) {
  reset(); const ex = S3.mood('dawn'); S3.set(t, { ripple: .25 }); CAMP.set(t, 1);
  const k = u / (TL.D0 + .4 - TL.C0);
  const sp = S3.ll(79.395, 9.205); render3(c, S3.scene, cam3({ pos: [sp[0] + k * 10, 6 - k, sp[1] + k * 6], at: [A.x + 70, 0, A.z + 40], fov: 56 }), { exposure: ex });
  pin3(c, 'LANKA', [A.x + 700, 0, A.z + 400], t, TL.LANKA, { size: 58, dy: -40, col: '#FFE2A0', spacing: 6 });
  pin3(c, '→ across the sea', [A.x + 700, 0, A.z + 400], t, TL.LANKA + .25, { font: 'italic 40px Marcellus', dy: 20, col: '#FFF3DC', spacing: 0 });
} });

// ================= D · three nights: Ram prays to the Ocean; it never comes =================
SHOTS.push({ a: TL.D0, b: TL.E0 + .4, xf: .4, draw(c, u, t) {
  reset(); const nk = clamp(Math.floor((t - TL.NIGHTS + .2) / .75), 0, 2), mk = ((t - TL.D0) / .75) % 1;
  const ex = S3.mood('night', { moon: [lerp(-2600, 2600, t < TL.NIGHTS + 2 ? mk : .5), 900 + 700 * Math.sin((t < TL.NIGHTS + 2 ? mk : .5) * Math.PI), -3200], milky: .45 });
  S3.set(t, { ripple: .1, swell: .005 }); S3.fire.set(t, 1); CAMP.set(t, .35);
  const f = S3.fire.group.position;
  render3(c, S3.scene, cam3({ pos: [f.x - 12, 2.2, f.z + 9], at: [f.x + 40, 3, f.z - 6], fov: 54 }), { exposure: ex });
  if (t > TL.NIGHTS - .2 && t < TL.NEVER) text(c, 'NIGHT ' + (nk + 1), 540, 560, '700 66px Cinzel', '#DCE6FF', { pop: t - TL.NIGHTS + .2 - nk * .75, glow: ['rgba(120,150,255,.5)', 26], spacing: 6 });
} });

// ================= E · his bow: fire arrows, and the waves rise like mountains =================
const IMP = [[A.x + 40, A.z + 34], [A.x + 70, A.z + 14], [A.x + 62, A.z + 58], [A.x + 95, A.z + 40]];
const SHOT_FROM = [A.x - 25, 4, A.z + 22];
const SHOTS_E = IMP.map(([x, z], i) => [TL.BOW + .05 + i * .32, SHOT_FROM, [x, 0, z]]);
SHOTS.push({ a: TL.E0, b: TL.F0 + .4, xf: .4, draw(c, u, t) {
  reset(); const ex = S3.mood('dusk', { disc: false }); S3.fire.set(t, 1);
  S3.set(t, { waves: 1, ripple: .3, swell: .05 + .2 * seg(t, TL.WAVES - .5, TL.MOUNTAINS), impacts: SHOTS_E.map(([t0, , to], i) => [to[0], to[2], t0 + .9, 5 + i]) });
  S3.arrows.set(t, SHOTS_E);
  let sk = [0, 0, 0]; SHOTS_E.forEach(([t0]) => { sk = add3(sk, shake(t, t0 + .9, .5)); });
  render3(c, S3.scene, cam3({ pos: add3([A.x - 22, 3.2, A.z + 36], sk), at: add3([A.x + 80, 4, A.z + 36], sk.map(v => v * .5)), fov: 58 }), { exposure: ex });
  SHOTS_E.forEach(([t0]) => flash(c, .25 * Math.exp(-Math.max(0, t - t0 - .9) * 4) * (t > t0 + .9 ? 1 : 0), '#FFB060'));
} });

// ================= F · the Ocean god rises: "I cannot change my nature" =================
SHOTS.push({ a: TL.F0, b: TL.G0 + .4, xf: .4, draw(c, u, t) {
  reset(); const ex = S3.mood('dusk', { exposure: .95 }); S3.fire.set(t, 1);
  S3.set(t, { ripple: .2, swell: .02 }); S3.god.set(t, easeOut(seg(t, TL.GOD - .4, TL.GOD + 1.4)));
  const g = S3.god.at, k = u / (TL.G0 + .4 - TL.F0);
  render3(c, S3.scene, cam3({ pos: [g[0] - 150 + k * 10, 6 + k * 3, g[2] + 120], at: [g[0], 18 + k * 30, g[2]], fov: 56 }), { exposure: ex });
} });

// ================= G · "But NALA, son of VISHWAKARMA, can build a bridge. And I will hold it." =================
SHOTS.push({ a: TL.G0, b: TL.H0 + .4, xf: .4, draw(c, u, t) {
  reset(); const ex = S3.mood('dusk', { exposure: .95 }); S3.set(t, { ripple: .15, swell: .01 }); S3.god.set(t, 1 - .6 * seg(t, TL.HOLD, TL.H0 + .4));
  S3.shoal.set(easeIO(seg(t, TL.BRIDGE - .3, TL.HOLD)), 3.2, .95);
  const g = S3.god.at, k = easeIO(clamp(u / (TL.H0 + .4 - TL.G0)));
  render3(c, S3.scene, cam3({ pos: [lerp(g[0] - 140, -40, k), lerp(9, 120, k), lerp(g[2] + 130, 170, k)], at: [lerp(g[0], 5, k), lerp(40, 0, k), lerp(g[2], 0, k)], fov: 56 }), { exposure: ex });
  if (t > TL.NALA - .05) text(c, 'NALA', 540, 560, '700 150px Cinzel', '#F4C46A', { pop: t - TL.NALA + .05, glow: ['rgba(244,170,60,.7)', 40], spacing: 10, alpha: 1 - seg(t, TL.BRIDGE - .4, TL.BRIDGE) });
  if (t > TL.VISHWA - .05) text(c, 'son of Vishwakarma', 540, 668, 'italic 52px Marcellus', '#FFF3DC', { pop: t - TL.VISHWA + .05, glow: ['rgba(6,6,14,.9)', 18], alpha: 1 - seg(t, TL.BRIDGE - .4, TL.BRIDGE) });
} });

// ================= H · trees and rocks as big as elephants =================
SHOTS.push({ a: TL.H0, b: TL.I0 + .4, xf: .4, draw(c, u, t) {
  reset(); const ex = S3.mood('golden', { at: [A.x + 20, 0, A.z], shadow: 80 }); S3.set(t, { ripple: .2 });
  const on = lerp(.035, .07, u / 4.5); S3.bridge.set(on); S3.fly.set(t, on, 1);
  const p = S3.path(on), k = u / (TL.I0 + .4 - TL.H0);
  render3(c, S3.scene, cam3({ pos: [p.x - 16 - k * 4, 6.5 + k * 2, p.z + 30], at: [p.x + 4, 3, p.z], fov: 54 }), { exposure: ex });
} });

// ================= I · five days: 14, 20, 21, 22, 23 yojanas =================
// the day's light: the sun crossing the sky once per day (a time-lapse); a short night between days
function dayLight(t) {
  let i = -1; for (let k = 0; k < 5; k++) if (t >= TL.D[k] - .2) i = k;
  const t0 = i < 0 ? TL.I0 : TL.D[i] - .2, t1 = i < 4 ? TL.D[i + 1] - .2 : TL.DEND, ph = clamp((t - t0) / (t1 - t0));
  const el = Math.sin(lerp(.08, .92, ph) * Math.PI), az = Math.cos(lerp(.08, .92, ph) * Math.PI);
  return { i, ph, el, sunAt: [az * .9, Math.max(.06, el), .35] };
}
SHOTS.push({ a: TL.I0, b: TL.J0 + .4, xf: .4, draw(c, u, t) {
  reset(); const L = dayLight(t), mood = L.el > .45 ? 'day' : 'golden';
  const ex = S3.mood(mood, { sunAt: L.sunAt, at: [0, 0, 0], shadow: 200 }) * .86 * (.55 + .45 * easeIO(seg(L.el, .05, .35)));
  S3.set(t, { ripple: .12 });
  // how much is built: each day's share laid down while its day lasts
  const i = L.i, built = i < 0 ? 4 : lerp(i ? CUM[i - 1] : 4, CUM[i], easeIO(L.ph)), on = built / 100;
  S3.bridge.set(on); S3.fly.set(t, on, i >= 0 && i < 5 ? 1 : 0);
  const p = S3.path(Math.max(.05, on)), k = clamp((t - TL.I0) / (TL.J0 + .4 - TL.I0));
  render3(c, S3.scene, cam3({ pos: [p.x - 40 - p.dz * 10, lerp(30, 70, k), p.z + 70], at: [p.x + 10, 0, p.z - 5], fov: 54 }), { exposure: ex });
  dayCounter(c, t, i, built, 1 - seg(t, TL.J0 - .2, TL.J0 + .3));
} });

// ================= J · 100 yojanas long, 10 wide: the whole bridge from above =================
SHOTS.push({ a: TL.J0, b: TL.K0 + .4, xf: .4, draw(c, u, t) {
  reset(); const ex = S3.mood('day', { at: [0, 0, 0], shadow: 200, fogNear: 2000, fogFar: 9000 }); S3.set(t, { ripple: .05 }); S3.bridge.set(1);
  const m = S3.path(.5);
  render3(c, S3.scene, topCam(m.x, m.z, lerp(560, 600, u / 3), 46), { exposure: ex });
  const a = toScreen3([A.x, .5, A.z]), b = toScreen3([B.x, .5, B.z]), q = S3.path(.8), w = S3.BW / 2;
  dimension(c, [a[0] - 150, a[1]], [b[0] - 150, b[1]], '100', easeOut(seg(t, TL.HUNDRED - .2, TL.HUNDRED + .5)), { dx: -10, pop: t - TL.HUNDRED - .5 });
  const l = toScreen3([q.x + q.dz * w, .5, q.z - q.dx * w]), r = toScreen3([q.x - q.dz * w, .5, q.z + q.dx * w]);
  dimension(c, [l[0] + 40, l[1]], [r[0] + 40, r[1]], '', easeOut(seg(t, TL.TEN - .2, TL.TEN + .3)));
  if (t > TL.TEN + .3) text(c, '10', Math.max(l[0], r[0]) + 110, (l[1] + r[1]) / 2, '700 50px Cinzel', '#FFE2A0', { pop: t - TL.TEN - .3, glow: ['rgba(6,6,14,.95)', 20] });
  if (t > TL.HUNDRED + .3) text(c, 'yojanas', a[0] - 150, (a[1] + b[1]) / 2 + 52, 'italic 38px Marcellus', '#FFF3DC', { pop: t - TL.HUNDRED - .3, glow: ['rgba(6,6,14,.95)', 16] });
} });

// ================= K · the gods watched; it shone like the Milky Way on the sea =================
SHOTS.push({ a: TL.K0, b: TL.L0 + .4, xf: .4, draw(c, u, t) {
  reset(); const ex = S3.mood('night', { milky: 1, moon: false, exposure: 1.25 }); S3.set(t, { ripple: .12, swell: .005 }); S3.bridge.set(1);
  S3.army.set(t, 1, easeOut(seg(t, TL.K0, TL.MILKY)), { speed: .0005, size: 1.3 });
  const k = u / (TL.L0 + .4 - TL.K0);
  render3(c, S3.scene, cam3({ pos: [A.x - 26 + k * 6, 7 + k * 2, A.z + 2], at: [B.x, lerp(70, 25, easeIO(seg(t, TL.SKY, TL.MILKY + .4))), B.z - 40], fov: 64 }), { exposure: ex });
} });

// ================= L · Ram crossed on Hanuman's shoulders, Lakshman on Angad's: the torches cross =================
SHOTS.push({ a: TL.L0, b: TL.M0 + .4, xf: .4, draw(c, u, t) {
  reset(); const ex = S3.mood('dawn', { exposure: 1.05, at: [0, 0, 0], shadow: 200 }); S3.set(t, { ripple: .15 }); S3.bridge.set(1);
  const k = clamp(u / (TL.M0 + .4 - TL.L0)), front = lerp(.15, .95, easeIO(k));
  S3.army.set(t, front, 1, { speed: .02, size: 1.4 });
  const p = S3.path(front);
  render3(c, S3.scene, cam3({ pos: [p.x - 50, 24, p.z + 46], at: [p.x + 6, 0, p.z - 2], fov: 54 }), { exposure: ex });
} });

// ================= M · today: the shoals from above; 48 km; Ram Setu =================
SHOTS.push({ a: TL.M0, b: TL.N0 + .4, xf: .4, draw(c, u, t) {
  reset(); const ex = S3.mood('day', { at: [0, 0, 0], shadow: 260, fogNear: 3000, fogFar: 9000, exposure: .88 }); S3.set(t, { ripple: .04 });
  S3.shoal.set(easeIO(seg(t, TL.KM - .3, TL.SHOALS + .4)), 2.6, .9);
  const m = S3.path(.5), y = lerp(760, 680, easeIO(clamp(u / 7)));
  render3(c, S3.scene, topCam(m.x - 30, m.z + 10, y, 50), { exposure: ex });
  const a = toScreen3([A.x, .5, A.z]), b = toScreen3([B.x, .5, B.z]);
  if (t > TL.KM - .1) text(c, '48 km', (a[0] + b[0]) / 2 + 150, (a[1] + b[1]) / 2, '700 54px Cinzel', '#FFE2A0', { pop: t - TL.KM + .1, glow: ['rgba(6,6,14,.95)', 20], alpha: 1 - seg(t, TL.HINDUS - .3, TL.HINDUS) });
  pin3(c, 'INDIA', P3('dhanushkodi'), t, TL.INDIA - .1, { size: 50, col: '#FFF3DC', spacing: 6 });
  if (t > TL.LANKA2 - .1) { const q = toScreen3(P3('talaimannar')); text(c, 'SRI LANKA', q[0], Math.max(500, q[1]), '700 50px Cinzel', '#FFF3DC', { pop: t - TL.LANKA2 + .1, glow: ['rgba(6,6,14,.9)', 18], spacing: 4 }); }
  if (t > TL.SETU2 - .1) text(c, 'RAM SETU', (a[0] + b[0]) / 2 - 170, (a[1] + b[1]) / 2, '700 72px Cinzel', '#F4C46A', { pop: t - TL.SETU2 + .1, glow: ['rgba(244,170,60,.6)', 30], spacing: 4 });
} });

// ================= N · the ask: low over the shoals in golden light =================
SHOTS.push({ a: TL.N0, b: TL.CARD, xf: .4, draw(c, u, t) {
  reset(); const ex = S3.mood('golden', { at: [A.x, 0, A.z], shadow: 200 }); S3.set(t, { ripple: .15 });
  S3.shoal.set(1, 1.2, .6);
  const k = u / (TL.CARD - TL.N0);
  const R = P3('rameswaram'); render3(c, S3.scene, cam3({ pos: [A.x + 40 - k * 10, 24, A.z + 60], at: [R[0] + 30, 0, R[2] + 10], fov: 56 }), { exposure: ex });
  pin3(c, 'RAMESWARAM', P3('rameswaram'), t, TL.RAMESWARAM - .1, { size: 54, col: '#F4C46A', spacing: 4, dy: -40 });
} });

// ================= O · the card =================
SHOTS.push({ a: TL.CARD, b: TL.END + 1, draw(c, u, t) { dealCardCine(c, u, t); } });
