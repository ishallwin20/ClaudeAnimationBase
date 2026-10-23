// jyoti.js: "Shiva appeared as LIGHT in 12 places in India." (ad 43), the fourth 3D reel: the twelve Jyotirlingas on a
// relief map of India (cine3d_india.js). Brahma and Vishnu argue who is greater; a pillar of fire with no end rises between
// them; Brahma flies up as a swan, Vishnu digs down as a boar, neither finds its end (Shiva Purana, Vidyeshvara Samhita
// 6–8). The pillar was Shiva, a linga of light: a Jyotirlinga. The Shiva Purana names twelve (Kotirudra Samhita 1),
// pillars of light rising on the map as each is named; Kedarnath in the Himalaya, Rameswaram by the sea where Ram
// worshipped Shiva before the war (Kotirudra 31, the ad 42 callback); the two still argued over (Vaidyanath, Nageshwar).
// The ask, the 15K Family Deal card. STORYBOARD.md has the plan and the sources; the timeline is jyoti_tl.js.
const I3 = india3(), VD = void3(), W3 = world3(), T3 = shrine3(W3.scene), S3 = setu3(); CAM3.far = 12000;
const CAPY = 1385;   // lower than ads 41–42: the map of India fills the frame above it
VO.caps.forEach((k, i) => say(i ? k.a : -1, k.b, k.text, { at: i ? k.at : k.at.map(() => -1), y: CAPY }));

// the pillars of light on the map: the twelve, and the other claimants
const PIL = JL.map(s => pillar3(I3.scene, I3.at(s.lon, s.lat), { h: 80, r: 2.4, col: '#FFC860' }));
const PALT = Object.fromEntries(Object.entries(ALT).map(([k, s]) => [k, pillar3(I3.scene, I3.at(s.lon, s.lat), { h: 80, r: 2.4, col: '#9EC8FF' })]));
const siteTop = (s) => { const p = I3.at(s.lon, s.lat); p[1] += 1; return p; };
// the linga's light in the shrine; Rameswaram's on the Palk Strait set
const LG = T3.linga.getWorldPosition(V3()), LPIL = pillar3(W3.scene, [LG.x, LG.y + 1.05, LG.z], { h: 30, r: .24, col: '#FFE2A0' });
// the copper pot and its stream over the linga (hidden while the light rises through it)
const POT = [], KEEP = new Set(); LPIL.traverse(m => KEEP.add(m)); W3.scene.updateMatrixWorld(true); W3.scene.traverse(m => { if ((!m.isMesh && !m.isSprite) || KEEP.has(m)) return; const q = m.isMesh ? new THREE.Box3().setFromObject(m).getCenter(V3()) : m.getWorldPosition(V3()); if (Math.hypot(q.x - LG.x, q.z - LG.z) < .45 && q.y > LG.y + 1.12 && q.y < LG.y + 3) POT.push(m); });
const RP = (() => { const [x, z] = S3.ll(79.317, 9.288); return [x, S3.h(x, z), z]; })(), RPIL = pillar3(S3.scene, RP, { h: 160, r: 2.2, col: '#FFD27A' });

const reset = () => {
  PIL.forEach(p => p.set(0, 0)); Object.values(PALT).forEach(p => p.set(0, 0)); I3.border.set(0); I3.lanka.set(0); I3.set(0);
  VD.pillar(0, 0); LPIL.set(0, 0); RPIL.set(0, 0); S3.bridge.set(0); S3.shoal.set(0); S3.set(0); CAM3.near = .3;
};
// the main view of India: tilted so the pillars stand up
const indiaCam = (k = 0, o = {}) => { CAM3.near = 4; const c = I3.at(82, 21); return cam3({ pos: [c[0], lerp(680, 640, k) * (o.zoom || 1), c[2] + lerp(330, 300, k) * (o.zoom || 1) + 95], at: [c[0], 0, c[2] + 95], fov: 44 }); };
const duskIndia = (o = {}) => I3.mood('space', { focus: 1, sun: 1.7, hemi: .3, exposure: .9, sunAt: [-.6, .45, .5], at: I3.at(80, 21), shadow: 320, ...o });
const allOn = (t, a = 1) => PIL.forEach(p => p.set(t, a));

// ================= A · the hook: India at dusk with twelve pillars of light =================
SHOTS.push({ a: 0, b: TL.B0 + .4, draw(c, u, t) {
  reset(); const ex = duskIndia(); I3.border.set(1, 2.4, .55); allOn(t, 1);
  render3(c, I3.scene, indiaCam(clamp(u / 6)), { exposure: ex });
  if (t > TL.YOU - .1) JL.forEach((s, i) => { const [x, y, z] = toScreen3(siteTop(s)); if (z < 1) text(c, String(i + 1), x, y - 40 - 14 * Math.sin(t * 2 + i), '700 34px Cinzel', '#FFF3DC', { pop: t - TL.YOU + .1 - i * .04, glow: ['rgba(6,6,14,.9)', 14] }); });
} });

// ================= B · Brahma and Vishnu argue; a pillar of fire with no end rises between them =================
SHOTS.push({ a: TL.B0, b: TL.UP - .2 + .4, xf: .4, draw(c, u, t) {
  reset(); const k = easeOut(seg(t, TL.FIRE - .35, TL.FIRE + .5));
  VD.pillar(t, k); const bob = Math.sin(t * 1.6) * 3;
  VD.at(VD.brahma, [lerp(-30, -36, k), 8 + bob, 0]); VD.at(VD.vishnu, [lerp(30, 36, k), 8 - bob, 0]);
  const sh = k > 0 && k < 1 ? (1 - k) * 4 : 0;
  render3(c, VD.scene, cam3({ pos: [vnoise(t * 20, 1) * sh, 14 + vnoise(t * 22, 2) * sh, lerp(150, 175, k) - u * 2], at: [0, lerp(8, 30, k), 0], fov: 52 }), { exposure: 1 });
  pin3(c, 'BRAHMA', VD.brahma.position.toArray(), t, TL.BRAHMA, { size: 46, dy: -70, col: '#FFD27A', spacing: 4 });
  pin3(c, 'VISHNU', VD.vishnu.position.toArray(), t, TL.VISHNU, { size: 46, dy: -70, col: '#9EC8FF', spacing: 4 });
  flash(c, .6 * Math.exp(-Math.max(0, t - TL.FIRE + .3) * 4) * (t > TL.FIRE - .3 ? 1 : 0), '#FFC070');
} });
// Brahma flies up as a swan
SHOTS.push({ a: TL.UP - .2, b: TL.VDOWN - .1 + .4, xf: .3, draw(c, u, t) {
  reset(); VD.pillar(t, 1); const y = 8 + 160 * u + 60 * u * u;
  VD.at(VD.brahma, [-28, y, 6], [0, 9, 0]);
  render3(c, VD.scene, cam3({ pos: [-80, y - 40, 120], at: [-14, y + 20, 0], fov: 56 }), { exposure: 1 });
  pin3(c, 'UP, as a swan', VD.brahma.position.toArray(), t, TL.UP - .1, { font: 'italic 46px Marcellus', dy: -80, col: '#FFE2A0', spacing: 0 });
} });
// Vishnu digs down as a boar
SHOTS.push({ a: TL.VDOWN - .1, b: TL.NEITHER - .3 + .4, xf: .3, draw(c, u, t) {
  reset(); VD.pillar(t, 1); const y = 8 - 160 * u - 60 * u * u;
  VD.at(VD.vishnu, [28, y, 6], [0, -9, 0]);
  render3(c, VD.scene, cam3({ pos: [80, y + 40, 120], at: [14, y - 20, 0], fov: 56 }), { exposure: 1 });
  pin3(c, 'DOWN, as a boar', VD.vishnu.position.toArray(), t, TL.DOWN - .1, { font: 'italic 46px Marcellus', dy: 90, col: '#BFE0FF', spacing: 0 });
} });
// neither found its end: far back, the pillar runs out of sight both ways
SHOTS.push({ a: TL.NEITHER - .3, b: TL.C0 + .4, xf: .4, draw(c, u, t) {
  reset(); VD.pillar(t, 1); const k = easeOut(clamp(u / 2.5));
  VD.at(VD.brahma, [-26, 900 + 300 * u, 6], [0, 9, 0]); VD.at(VD.vishnu, [26, -900 - 300 * u, 6], [0, -9, 0]);
  render3(c, VD.scene, cam3({ pos: [0, 0, lerp(400, 1700, k)], at: [0, 0, 0], fov: 60 }), { exposure: 1 });
} });

// ================= C · the pillar was Shiva: a linga of light, a Jyotirlinga =================
SHOTS.push({ a: TL.C0, b: TL.D0 + .4, xf: .5, draw(c, u, t) {
  reset(); const ex = W3.mood('night', { hemi: .5 }); T3.set(t, { lamps: 1, inner: 1, water: 1 });
  const on = easeOut(seg(t, TL.LINGA - .2, TL.JYOTI + .3)); LPIL.set(t, on);
  const k = easeIO(clamp(u / (TL.D0 + .4 - TL.C0)));
  POT.forEach(m => m.visible = false);
  render3(c, W3.scene, cam3({ pos: [LG.x + lerp(3.2, 2.4, k), LG.y + lerp(.8, .95, k), LG.z + lerp(.4, .25, k)], at: [LG.x, LG.y + lerp(.7, 1.1, k * on), LG.z], fov: 50 }), { exposure: ex * (1 + .3 * on) });
  POT.forEach(m => m.visible = true);
  flash(c, .35 * Math.exp(-Math.max(0, t - TL.JYOTI) * 3) * (t > TL.JYOTI ? 1 : 0), '#FFD890');
  if (t > TL.JYOTI - .05) text(c, 'ज्योतिर्लिङ्ग', 540, 520, '50px "Tiro Devanagari Sanskrit"', '#FFE2A0', { pop: t - TL.JYOTI + .05, glow: ['rgba(244,170,60,.7)', 26] });
} });

// ================= D · the Shiva Purana names twelve: pillars rise as each is named =================
SHOTS.push({ a: TL.D0, b: TL.E0 + .4, xf: .4, draw(c, u, t) {
  reset(); const ex = duskIndia(); I3.border.set(1, 2.4, .55);
  const k = clamp(u / (TL.E0 - TL.D0));
  JL.forEach((s, i) => { const on = seg(t, TL.NAMES[i] - .15, TL.NAMES[i] + .6); PIL[i].set(t, on); });
  render3(c, I3.scene, indiaCam(k, { zoom: lerp(1, .96, k) }), { exposure: ex });
  JL.forEach((s, i) => { const at = TL.NAMES[i] - .1, next = (TL.NAMES[i + 1] ?? TL.E0) - .1; if (t < next) siteLabel(c, s, siteTop(s), t, at, { big: 1.3 }); });
  if (t < TL.NAMES[0] - .2 && t > TL.PURANA - .1) text(c, 'शिव पुराण', 540, 520, '50px "Tiro Devanagari Sanskrit"', '#FFE2A0', { pop: t - TL.PURANA + .1, glow: ['rgba(244,170,60,.6)', 24] });
  // the count, top
  const n = TL.NAMES.filter(x => t >= x - .1).length;
  if (n) text(c, n + ' / 12', 540, 470, '700 56px Cinzel', '#FFF3DC', { glow: ['rgba(6,6,14,.9)', 18], spacing: 3 });
} });

// ================= E · Kedarnath, 3,583 m up in the Himalaya =================
SHOTS.push({ a: TL.E0, b: TL.F0 + .4, xf: .4, draw(c, u, t) {
  reset(); const s = JL[4], p = I3.at(s.lon, s.lat), ex = I3.mood('golden', { at: p, shadow: 80, sunAt: [-.7, .35, .55], fogNear: 70, fogFar: 260 }); I3.set(t, { clouds: .35 });
  PIL[4].set(t, 1);
  const k = easeIO(clamp(u / (TL.F0 + .4 - TL.E0)));
  render3(c, I3.scene, cam3({ pos: [p[0] + lerp(-30, -18, k), lerp(26, 18, k), p[2] + lerp(80, 56, k)], at: [p[0] + 4, 6, p[2] - 10], fov: 50 }), { exposure: ex });
  pin3(c, 'KEDARNATH', siteTop(s), t, TL.KEDAR - .1, { size: 54, dy: -150, col: '#FFE2A0', spacing: 4 });
  pin3(c, '3,583 m', siteTop(s), t, TL.METRES, { font: '42px Marcellus', dy: -95, col: '#E8ECFF', spacing: 1 });
} });

// ================= F · Rameswaram by the sea, where Ram worshipped Shiva before the war =================
SHOTS.push({ a: TL.F0, b: TL.G0 + .4, xf: .4, draw(c, u, t) {
  reset(); const ex = S3.mood('golden', { at: RP, shadow: 160 }); S3.set(t, { ripple: .15 }); S3.shoal.set(1, 1.4, .5);
  RPIL.set(t, easeOut(seg(t, TL.RAMES - .3, TL.RAMES + .5)));
  const k = clamp(u / (TL.G0 + .4 - TL.F0));
  render3(c, S3.scene, cam3({ pos: [RP[0] + lerp(110, 80, k), lerp(42, 30, k), RP[2] + lerp(130, 100, k)], at: [RP[0], 30, RP[2]], fov: 54 }), { exposure: ex });
  pin3(c, 'RAMESWARAM', RP, t, TL.RAMES - .1, { size: 54, dy: -330, dx: 90, col: '#FFE2A0', spacing: 4 });
} });

// ================= G · the two still argued over: Vaidyanath (Deoghar or Parli), Nageshwar (Dwarka, Aundha, Jageshwar) =================
SHOTS.push({ a: TL.G0, b: TL.H0 + .4, xf: .4, draw(c, u, t) {
  reset(); const ex = duskIndia(); I3.border.set(1, 2.4, .5);
  const vk = seg(t, TL.VAIDYA - .2, TL.VAIDYA + .4), nk = seg(t, TL.NAGESH - .2, TL.NAGESH + .4), dim = Math.max(vk, nk) * .75;
  JL.forEach((s, i) => PIL[i].set(t, i === 8 ? 1 - .5 * nk : i === 9 ? 1 : 1 - dim));
  const fl = (a) => .55 + .45 * Math.abs(Math.sin(t * 5 + a));
  PALT.parli.set(t, seg(t, TL.PARLI - .2, TL.PARLI + .4) * (1 - .5 * nk) * fl(1));
  PALT.aundha.set(t, seg(t, TL.AUNDHA - .2, TL.AUNDHA + .4) * fl(2)); PALT.jageshwar.set(t, seg(t, TL.JAGESH - .2, TL.JAGESH + .4) * fl(3));
  if (vk > 0 && nk < 1) PIL[8].set(t, fl(0));
  if (nk > 0) PIL[9].set(t, fl(4));
  render3(c, I3.scene, indiaCam(.5), { exposure: ex });
  const L = (s, at, o) => siteLabel(c, s, siteTop(s), t, at, { big: 1.05, ...o });
  if (nk < 1) { L({ ...JL[8], name: 'DEOGHAR?', state: 'Jharkhand' }, TL.DEOGHAR - .1, { alpha: 1 - nk }); L({ ...ALT.parli, name: 'PARLI?', state: 'Maharashtra', sx: -1, sy: 1 }, TL.PARLI - .1, { alpha: 1 - nk }); }
  if (nk > 0) {
    L({ ...JL[9], name: 'DWARKA?', state: 'Gujarat' }, TL.DWARKA - .1, {}); L({ ...ALT.aundha, name: 'AUNDHA?', state: 'Maharashtra', sx: 1, sy: 1 }, TL.AUNDHA - .1, {});
    L({ ...ALT.jageshwar, name: 'JAGESHWAR?', state: 'Uttarakhand', sx: 1, sy: -1 }, TL.JAGESH - .1, {});
  }
  const head = nk > 0 ? 'NAGESHWAR' : vk > 0 ? 'VAIDYANATH' : '';
  if (head) text(c, head, 540, 500, '700 72px Cinzel', '#FFE2A0', { pop: t - (nk > 0 ? TL.NAGESH : TL.VAIDYA), glow: ['rgba(244,170,60,.55)', 26], spacing: 5 });
} });

// ================= H · the ask: all twelve shining, the map turning slowly =================
SHOTS.push({ a: TL.H0, b: TL.CARD, xf: .4, draw(c, u, t) {
  reset(); const ex = duskIndia({ exposure: .95 }); I3.border.set(1, 2.4, .6); allOn(t, 1);
  render3(c, I3.scene, indiaCam(1 - clamp(u / 5) * .5), { exposure: ex });
} });

// ================= I · the card =================
SHOTS.push({ a: TL.CARD, b: TL.END + 1, draw(c, u, t) { dealCardCine(c, u, t); } });
