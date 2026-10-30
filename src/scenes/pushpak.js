// pushpak.js: "The whole Ramayan in one flight, told by Ram himself" (ad 64), the 3D style in the film look. After the
// war Ram flies home from Lanka on the Pushpak and points out every place to Sita (Valmiki, Yuddha Kanda 123): the
// Pushpak crosses a relief map of India (cine3d_india.js) from Lanka to Prayag, a pillar of light rising at each place
// as he names it, with a memory from the Ramayan series in a golden bubble (tools/pushpak_clips.mjs). Bharata's vow
// (Ayodhya 112) sets the clock; the time facts come from Valmiki too (the bridge in 5 days, Yuddha 22; 4 months of rain,
// Kishkindha 26; 10 years in the Dandaka ashrams, Aranya 11). On Panchami, with the 14th year complete, they land at
// Bharadvaja's ashram (Yuddha 124) and Hanuman races ahead to Bharata (Yuddha 125). The whole route lit; the ask (how
// many have you visited?); the card (the Parshurama series, follow, the wallpapers). STORYBOARD.md has the plan.
LOOK.bloom = .05; LOOK.vignette = .6; LOOK.grain = .06;
const I3 = india3({ bbox: [66, 4, 92, 31], vex: 8 }); CAM3.far = 12000;
const ENV = env3(new THREE.Scene(), 'dawn').env;
const PK = pushpak3(I3.scene, ENV), TR = trail3(I3.scene), WI = wisps3(I3.scene), PAD = padukas3(I3.scene, ENV);
const at3 = (s, lift = 0) => I3.at(s.lon, s.lat, lift);
const CAPY = 1385;
POST.push((c, t) => { if (t < TL.CARD) band(c, 1230, 1560, .38); });
VO.caps.forEach((k, i) => say(i ? k.a : -1, k.b, k.text, { at: i ? k.at : k.at.map(() => -1), y: CAPY, ...(i ? {} : { size: 62 }) }));

// ---------- the map's marks ----------
const lineOn = (pts, o) => line3(I3.scene, pts.map(([lo, la]) => I3.at(lo, la, .3)), o);
const ROUTE_LINE = line3(I3.scene, ROUTE.pts.map(([x, z]) => [x, I3.h(x, z) + .3, z]), { col: '#FFC860', add: true, core: .8 });
const BRIDGE = lineOn([[79.43, 9.17], [79.52, 9.14], [79.6, 9.12], [79.73, 9.09]], { col: '#FFE2A0', add: true, core: .9 });
const GODAVARI = lineOn([[73.53, 19.93], [73.79, 20.0], [74.2, 19.85], [74.8, 19.6], [75.4, 19.45], [76.3, 19.15], [77.2, 18.95], [78.3, 18.9], [79.4, 18.8], [80.3, 18.2], [80.9, 17.6], [81.7, 17.0]], { col: '#7FDFFF', add: true, core: .6 });
const YAMUNA = lineOn([[79.4, 26.15], [80.0, 25.95], [80.5, 25.75], [81.0, 25.55], [81.5, 25.42], [81.88, 25.43]], { col: '#3FA0FF', add: true, core: .4 });
const GANGA = lineOn([[80.35, 26.48], [80.8, 26.15], [81.2, 25.85], [81.63, 25.6], [81.88, 25.43], [82.3, 25.3], [83.0, 25.3]], { col: '#7FE8FF', add: true, core: .5 });
const SARAYU = lineOn([[81.4, 27.3], [81.9, 27.0], [82.2, 26.8], [82.7, 26.55], [83.4, 26.3]], { col: '#8FE8FF', add: true, core: .6 });
const HANU = lineOn([[81.88, 25.43], [81.95, 25.8], [82.05, 26.2], [82.13, 26.62]], { col: '#FFB050', add: true, core: .9 });
const PIL = Object.fromEntries(Object.entries(STOPS).map(([k, s]) => [k, pillar3(I3.scene, at3(s), { h: k === 'ayodhya' ? 40 : 22, r: k === 'ayodhya' ? 1.1 : .8, col: k === 'ayodhya' ? '#FFE2A0' : '#FFC860' })]));
// the Dandaka's ashrams: little lamps in the forest
const ASH = [[77.2, 20.6], [78.4, 21.3], [79.6, 20.4], [80.6, 21.6], [81.4, 20.2], [79.0, 22.4], [80.2, 23.0], [77.8, 22.0], [82.0, 21.4], [76.4, 21.6]].map(([lo, la]) => glow3(I3.scene, I3.at(lo, la, .6), 9, '#FFD27A', 0));
// the fire of Bharata's vow at Nandigram
const FIRES = [[0, 0, 70], [-.9, .3, 46], [.8, .2, 52], [-.3, -.7, 40], [.5, .8, 38]].map(([dx, dz, k], i) => { const p = at3(STOPS.nandi, .2); return flame3(I3.scene, [p[0] + dx, p[1], p[2] + dz], k, { light: false, seed: i * 7 }); });
const FIRE = { set: (t, on) => FIRES.forEach(f => f.set(t, on)) };
const HCOMET = glow3(I3.scene, [0, 0, 0], 7, '#FFB040', 0), HCORE = glow3(I3.scene, [0, 0, 0], 2.2, '#FFFFFF', 0);

const reset = () => {
  ROUTE_LINE.set(0); BRIDGE.set(0); GODAVARI.set(0); YAMUNA.set(0); GANGA.set(0); SARAYU.set(0); HANU.set(0);
  Object.values(PIL).forEach(p => p.set(0, 0)); ASH.forEach(g => g.material.opacity = 0); FIRE.set(0, 0); PAD.set(0, 0);
  HCOMET.material.opacity = 0; HCORE.material.opacity = 0; PK.set(0, { on: false }); TR.set(I3, 0, 0); WI.set(0, [0, 0, 0], [0, -1], 0);
  I3.border.set(0); I3.lanka.set(0); I3.set(0); I3.far.visible = true; CAM3.near = .5; I3.ground.scale.y = 1;
};
// the Pushpak at time t (scale sc), its trail and the wisps; returns its pose
const flyAt = (t, o = {}) => {
  const q = flyPose(I3, t, o.alt ?? 5.5); if (o.p) q.p = o.p;
  PK.pose(q.p, q.yaw, o.bank ?? Math.sin(t * .6) * .04, t, o.sc ?? 1); PK.set(t, { on: true, glow: o.glow ?? 1 });
  TR.set(I3, t, o.trail ?? 1, o.sc ?? 1, o.alt ?? 5.5); WI.set(t, q.p, q.dir, o.wisps ?? 0, o.wo || {});
  return q;
};
// the route drawn up to the Pushpak (w: the line's width for the camera's height)
const routeTo = (t, w, a = 1) => ROUTE_LINE.set(Math.max(.001, FLY.s(t)), w, a);
// a camera behind the Pushpak (q from flyAt): d away, el up, az round from straight behind (+ = to its right)
const chase = (q, d, el, az, o = {}) => {
  const [dx, dz] = q.dir, bx = -dx, bz = -dz, rx = -dz, rz = dx, ce = Math.cos(el);
  const pos = [q.p[0] + (bx * Math.cos(az) + rx * Math.sin(az)) * d * ce, q.p[1] + d * Math.sin(el), q.p[2] + (bz * Math.cos(az) + rz * Math.sin(az)) * d * ce];
  const ah = o.ahead ?? 0, at = [q.p[0] + dx * ah, q.p[1] + (o.ly ?? 0), q.p[2] + dz * ah];
  return { cam: cam3({ pos, at, fov: o.fov ?? 36 }), d: Math.hypot(pos[0] - at[0], pos[1] - at[1], pos[2] - at[2]) };
};
// a camera over the map: looking at lon/lat from a bearing (az, 0 = from the south), at a height and ground distance
const mapCam = (lon, lat, alt, back, az = 0, o = {}) => {
  const c = I3.at(lon, lat), pos = [c[0] + Math.sin(az) * back, alt, c[2] + Math.cos(az) * back];
  return { cam: cam3({ pos, at: [c[0], o.ay ?? 0, c[2]], fov: o.fov ?? 42 }), d: Math.hypot(back, alt) };
};
const golden = (p, o = {}) => I3.mood('golden', { at: p, shadow: o.shadow ?? 120, sunAt: o.sunAt || [-.75, .42, .5], fogNear: o.fogNear ?? 300, fogFar: o.fogFar ?? 2600, hemi: o.hemi ?? .8, sun: o.sun ?? 3.2, ...o });
const dusk = (p, o = {}) => I3.mood('dusk', { at: p, shadow: o.shadow ?? 160, fogNear: o.fogNear ?? 300, fogFar: o.fogFar ?? 2600, ...o });
// the film look: a warm grade; dof only on the close shots
const FXM = (focus, ap = 0, o = {}) => ({ bloom: { k: .26, thresh: 1 }, ...(ap ? { dof: { focus, aperture: ap, max: 14 } } : {}), grade: { contrast: 1.06, sat: 1.1, temp: .08, shadows: '#1C1830', highlights: '#FFD090', split: .1, ...(o.grade || {}) }, ca: .0012 });
const wOf = (alt) => Math.max(.25, alt * .006);
const pinP = (s, lift = 0) => at3(s, lift);

// ================= A · the hook: the Pushpak over Lanka, gold in the morning sun =================
SHOTS.push({ a: 0, b: TL.B0 + .4, draw(c, u, t) {
  reset(); CAM3.near = .2; const q = flyAt(t, { alt: 4, wisps: .7, wo: { v: 3, w: 6, span: 30, wide: 14, tall: 3, dy: -2 } });
  const ex = golden(q.p, { fogNear: 150, fogFar: 1600, shadow: 30 }); I3.set(t, { clouds: .3 });
  const k = easeOut(clamp(u / 4.5)), C = chase(q, lerp(13, 11.5, k), lerp(.2, .24, k), lerp(-2.5, -2.25, k), { ly: -.7, fov: 34 });
  render3(c, I3.scene, C.cam, { exposure: ex * 1.05, fx: FXM(C.d, 7) });
} });

// ================= B · after the war, home on the Pushpak; Sita sees every place; Valmiki recorded it =================
SHOTS.push({ a: TL.B0, b: TL.C0 + .4, xf: .4, draw(c, u, t) {
  reset(); CAM3.near = .3; const k = easeIO(clamp(u / (TL.C0 + .4 - TL.B0)));
  const q = flyAt(t, { alt: 4, sc: lerp(1, 2.6, k), glow: lerp(1, 2, k), wisps: 1 - seg(t, TL.SITA, TL.SITA + 1), wo: { v: 8, w: 8, span: 40, wide: 20, dy: -2 } });
  const ex = golden(q.p, { fogNear: lerp(150, 900, k), fogFar: lerp(1100, 3000, k * k), shadow: lerp(40, 300, k) }); I3.set(t, { clouds: .3 });
  PIL.ayodhya.scale.setScalar(4); PIL.ayodhya.set(t, seg(t, TL.SITA - .3, TL.SITA + .8)); routeTo(t, wOf(lerp(4, 40, k)));
  const C = chase(q, lerp(11.5, 90, k), lerp(.24, .62, k), lerp(-.6, 0, k), { ly: lerp(-.7, 0, k), ahead: lerp(0, 90, k), fov: lerp(34, 44, k) });
  render3(c, I3.scene, C.cam, { exposure: ex * 1.05, fx: FXM(C.d, lerp(6, 0, seg(u, 0, 1.5))) }); PIL.ayodhya.scale.setScalar(1);
  if (t > TL.SITA) stopLabel(c, { name: 'AYODHYA', sub: 'home' }, pinP(STOPS.ayodhya, 160), t, TL.SITA + .2, { big: .8, dy: -30 });
  if (t > TL.VALMIKI - .1) {
    const a = seg(t, TL.VALMIKI - .1, TL.VALMIKI + .3);
    text(c, 'वाल्मीकि रामायण', 540, 520, '54px "Tiro Devanagari Sanskrit"', '#FFE2A0', { pop: t - TL.VALMIKI + .1, glow: ['rgba(6,6,14,.9)', 20] });
    text(c, 'Yuddha Kanda · Sarga 123', 540, 588, '34px Marcellus', '#F4EEE4', { alpha: a, glow: ['rgba(6,6,14,.9)', 16], spacing: 2 });
  }
} });

// ================= C · he had to hurry: Bharata's vow, the fire at Nandigram, 14 years =================
SHOTS.push({ a: TL.C0, b: TL.D0 + .4, xf: .3, draw(c, u, t) {
  reset(); CAM3.near = .5; const p = pinP(STOPS.nandi), ex = dusk(p, { fogNear: 40, fogFar: 260, shadow: 40 });
  const fire = seg(t, TL.FIRE - .5, TL.FIRE + .2);
  FIRE.set(t, .4 + .6 * fire);
  const k = easeIO(clamp(u / (TL.D0 + .4 - TL.C0)));
  const C = mapCam(STOPS.nandi.lon, STOPS.nandi.lat, lerp(8, 6.5, k), lerp(-24, -20, k), lerp(-.2, -.1, k), { ay: 2.5, fov: 40 });
  render3(c, I3.scene, C.cam, { exposure: ex * 1.1, fx: FXM(C.d, 5, { grade: { temp: .16 } }) });
  stopLabel(c, { name: 'BHARATA', sub: 'Nandigram, by Ayodhya' }, p, t, TL.BHARATA, { big: 1, dy: 110 });
  // the clock: 14 years, a ring nearly closed
  if (t > TL.YEARS14 - .2) {
    const a = popK(t - TL.YEARS14 + .2), cx = 540, cy = 560;
    c.save(); c.globalAlpha = clamp(a); c.translate(cx, cy); c.scale(a, a);
    c.lineWidth = 14; c.strokeStyle = 'rgba(255,255,255,.18)'; c.beginPath(); c.arc(0, 0, 120, 0, TAU); c.stroke();
    const end = lerp(.9, .985, seg(t, TL.YEARS14, TL.FIRE + .3));
    c.strokeStyle = '#F4C46A'; c.shadowColor = '#FFB040'; c.shadowBlur = 24; c.beginPath(); c.arc(0, 0, 120, -Math.PI / 2, -Math.PI / 2 + TAU * end); c.stroke(); c.shadowBlur = 0;
    text(c, '14', 0, -14, '700 96px Cinzel', '#FFF3DC', { glow: ['rgba(6,6,14,.9)', 16] }); text(c, 'YEARS', 0, 58, '700 30px Cinzel', '#FFE2A0', { spacing: 4 });
    c.restore();
  }
  flash(c, .35 * Math.exp(-Math.max(0, t - TL.FIRE) * 4) * (t > TL.FIRE ? 1 : 0), '#FF9A40');
} });

// ================= D · "Look, Sita: Lanka. There, Ravana fell." =================
SHOTS.push({ a: TL.D0, b: TL.E0 + .4, xf: .3, draw(c, u, t) {
  reset(); CAM3.near = .5; const q = flyAt(t, { sc: 2.2, glow: 1.5 }), L = pinP(STOPS.lanka), ex = golden(L, { fogNear: 300, fogFar: 2600, shadow: 160 }); I3.set(t, { clouds: .3 });
  I3.lanka.set(1, .5, .6 * seg(t, TL.LANKA - .3, TL.LANKA + .3)); PIL.lanka.set(t, seg(t, TL.LANKA - .4, TL.LANKA + .4)); routeTo(t, .4);
  const k = easeIO(clamp(u / 4));
  const C = mapCam(80.6, 8.0, lerp(70, 62, k), lerp(-62, -54, k), lerp(-.5, -.4, k), { fov: 42 });
  render3(c, I3.scene, C.cam, { exposure: ex * 1.05, fx: FXM(C.d) });
  const [lx, ly] = toScreen3(pinP(STOPS.lanka, 22));
  memory(c, 'lanka', t, TL.LANKA + .45, TL.E0 + .25, { x: 560, y: 860, r: 240, from: [lx, ly - 10], skip: .3 });
  stopLabel(c, STOPS.lanka, pinP(STOPS.lanka, 22), t, TL.LANKA - .05, { big: 1.1, dy: -30 });
} });

// ================= E · "Nala's bridge, built in 5 days." =================
SHOTS.push({ a: TL.E0, b: TL.F0 + .4, xf: .3, draw(c, u, t) {
  reset(); CAM3.near = .5; const q = flyAt(t, { sc: .5 }), B = I3.at(79.58, 9.13), ex = golden(B, { fogNear: 200, fogFar: 1600, shadow: 80 });
  const k = easeIO(clamp(u / 3.2)), alt = lerp(30, 24, k);
  BRIDGE.set(seg(t, TL.BRIDGE - .5, TL.DAYS5 + .4), wOf(alt) * 3, 1); PIL.setu.scale.setScalar(.5); PIL.setu.set(t, seg(t, TL.BRIDGE - .4, TL.BRIDGE + .3)); routeTo(t, wOf(alt) * .7, .8);
  const C = mapCam(79.52, 9.12, alt, lerp(30, 24, k), lerp(-.7, -.55, k), { fov: 42 });
  render3(c, I3.scene, C.cam, { exposure: ex * 1.05, fx: FXM(C.d) }); PIL.setu.scale.setScalar(1);
  memory(c, 'setu', t, TL.BRIDGE + .1, TL.F0 + .25, { x: 540, y: 850, r: 230, skip: .6 });
  stopLabel(c, STOPS.setu, pinP(STOPS.setu, 11), t, TL.BRIDGE - .1, { big: .95, dy: -30 });
  chip(c, '5 DAYS', 540, 1120, t, TL.DAYS5 - .05, { size: 46 });
} });

// ================= F · "Here, Mainaka rose out of the sea to rest Hanuman." =================
SHOTS.push({ a: TL.F0, b: TL.G0 + .4, xf: .3, draw(c, u, t) {
  reset(); CAM3.near = .2; const q = flyAt(t, { alt: 4, wisps: 1, wo: { v: 10, w: 7, span: 36, wide: 16, tall: 4, dy: -2 } }), ex = golden(q.p, { fogNear: 150, fogFar: 1600, shadow: 30, sunAt: [-.6, .35, -.6] });
  const k = easeIO(clamp(u / 3.6)), C = chase(q, lerp(13, 11.5, k), lerp(.22, .26, k), lerp(1.9, 2.2, k), { ly: -1.6, fov: 36 });
  render3(c, I3.scene, C.cam, { exposure: ex * 1.05, fx: FXM(C.d, 7) });
  memory(c, 'mainaka', t, TL.MAINAKA - .1, TL.G0 + .25, { x: 540, y: 1000, r: 240, skip: .2 });
} });

// ================= G · "Kishkindha, where I killed Vali." They'd waited out 4 months of rain there. =================
SHOTS.push({ a: TL.G0, b: TL.H0 + .4, xf: .3, draw(c, u, t) {
  reset(); CAM3.near = .5; const K = pinP(STOPS.kish), rain = seg(t, TL.MONTHS4 - .9, TL.MONTHS4 - .3) * (1 - seg(t, TL.H0 - .2, TL.H0 + .3));
  const ex = golden(K, { fogNear: 120, fogFar: lerp(1200, 500, rain), shadow: 90, sun: lerp(3.2, 1.2, rain) }); I3.set(t, { clouds: lerp(.2, 1, rain), wind: 2 });
  const q = flyAt(t, { sc: 1.6, glow: 1.4 }); PIL.kish.scale.setScalar(.6); PIL.kish.set(t, seg(t, TL.KISH - .4, TL.KISH + .3)); routeTo(t, .5);
  const k = easeIO(clamp(u / (TL.H0 + .4 - TL.G0)));
  const C = mapCam(STOPS.kish.lon, STOPS.kish.lat + .2, lerp(48, 40, k), lerp(56, 48, k), lerp(.35, .2, k), { fov: 42 });
  render3(c, I3.scene, C.cam, { exposure: ex * lerp(1.05, .8, rain), fx: FXM(C.d) }); PIL.kish.scale.setScalar(1);
  rain2(c, t, rain);
  const [px, py] = toScreen3(pinP(STOPS.kish, 13));
  memory(c, 'vali', t, TL.KISH + .3, TL.MONTHS4 - .5, { x: 540, y: 860, r: 230, from: [px, py - 10] });
  stopLabel(c, STOPS.kish, pinP(STOPS.kish, 13), t, TL.KISH - .05, { big: 1, dy: -30 });
  chip(c, '4 MONTHS OF RAIN', 540, 760, t, TL.MONTHS4 - .1, { size: 44, col: '#CFE6FF' });
} });

// ================= H · "Rishyamuka, where I met Sugriva. Pampa, where I wept for you, and met Shabari." =================
SHOTS.push({ a: TL.H0, b: TL.I0 + .4, xf: .4, draw(c, u, t) {
  reset(); CAM3.near = .3; const K = pinP(STOPS.pampa), ex = golden(K, { fogNear: 120, fogFar: 1200, shadow: 80 }); I3.set(t, { clouds: .2 });
  const q = flyAt(t, { sc: 1.6, glow: 1.4 }); [PIL.rishya, PIL.pampa].forEach(p => p.scale.setScalar(.3)); PIL.kish.scale.setScalar(.6); PIL.kish.set(t, 1);
  PIL.rishya.set(t, seg(t, TL.RISHYA - .3, TL.RISHYA + .3)); PIL.pampa.set(t, seg(t, TL.PAMPA - .3, TL.PAMPA + .3)); routeTo(t, .12);
  const k = easeIO(clamp(u / (TL.I0 + .4 - TL.H0)));
  const C = mapCam(STOPS.kish.lon, STOPS.kish.lat + .2, lerp(40, 34, k), lerp(48, 42, k), lerp(.2, .1, k), { fov: 42 });
  render3(c, I3.scene, C.cam, { exposure: ex * 1.05, fx: FXM(C.d) }); [PIL.rishya, PIL.pampa, PIL.kish].forEach(p => p.scale.setScalar(1));
  memory(c, 'sugriva', t, TL.SUGRIVA - .5, TL.I0 + .25, { x: 540, y: 860, r: 240 });
  stopLabel(c, STOPS.rishya, pinP(STOPS.rishya, 6), t, TL.RISHYA - .05, { big: .8, dx: -190, dy: -10 });
  stopLabel(c, STOPS.pampa, pinP(STOPS.pampa, 6), t, TL.PAMPA - .05, { big: .8, dx: 190, dy: -10 });
  chip(c, 'SHABARI', 540, 1110, t, TL.SHABARI - .05, { size: 40 });
} });

// ================= I · "There, Jatayu fought for you, and fell." =================
SHOTS.push({ a: TL.I0, b: TL.J0 + .4, xf: .3, draw(c, u, t) {
  reset(); CAM3.near = .2; const q = flyAt(t, { alt: 4, wisps: .7, wo: { v: 12, w: 7, span: 40, wide: 18, tall: 4, dy: -2 } }), ex = golden(q.p, { fogNear: 150, fogFar: 1600, shadow: 40 });
  PIL.jatayu.scale.setScalar(.5); PIL.jatayu.set(t, seg(t, TL.JATAYU - .3, TL.JATAYU + .3)); routeTo(t, .1);
  const k = easeIO(clamp(u / 3)), C = chase(q, lerp(11, 12.5, k), lerp(.26, .3, k), lerp(.5, .3, k), { ly: -2, ahead: 3, fov: 38 });
  render3(c, I3.scene, C.cam, { exposure: ex * 1.05, fx: FXM(C.d, 6) }); PIL.jatayu.scale.setScalar(1);
  memory(c, 'jatayu', t, TL.JATAYU - .1, TL.J0 + .25, { x: 560, y: 840, r: 230, skip: 1.0, k: 1.1 });
  stopLabel(c, STOPS.jatayu, pinP(STOPS.jatayu, 11), t, TL.JATAYU - .05, { big: .85, dy: -20 });
} });

// ================= J · "Panchavati. I fought Khara's army there, and from our hut, Ravana took you." =================
SHOTS.push({ a: TL.J0, b: TL.K0 + .4, xf: .3, draw(c, u, t) {
  reset(); CAM3.near = .5; const N = pinP(STOPS.panch), ex = golden(N, { fogNear: 120, fogFar: 1100, shadow: 90 }); I3.set(t, { clouds: .2 });
  const q = flyAt(t, { sc: 1.6, glow: 1.4 }); PIL.panch.scale.setScalar(.6); PIL.panch.set(t, seg(t, TL.PANCH - .4, TL.PANCH + .3)); routeTo(t, .5);
  const k = easeIO(clamp(u / (TL.K0 + .4 - TL.J0))), alt = lerp(48, 40, k);
  GODAVARI.set(seg(t, TL.PANCH - .2, TL.PANCH + 1.6), wOf(alt), .9);
  const C = mapCam(74.2, 19.8, alt, lerp(56, 48, k), lerp(-.4, -.6, k), { fov: 42 });
  render3(c, I3.scene, C.cam, { exposure: ex * 1.05, fx: FXM(C.d) }); PIL.panch.scale.setScalar(1);
  const [px, py] = toScreen3(pinP(STOPS.panch, 13));
  memory(c, 'khara', t, TL.KHARA - .5, TL.HUT - .15, { x: 560, y: 870, r: 230, from: [px, py - 10] });
  memory(c, 'taken', t, TL.HUT - .1, TL.K0 + .25, { x: 560, y: 870, r: 230, from: [px, py - 10] });
  stopLabel(c, STOPS.panch, pinP(STOPS.panch, 13), t, TL.PANCH - .05, { big: 1, dy: -30 });
  if (t > TL.PANCH + .6) text(c, 'GODAVARI', ...toScreen3(I3.at(75.1, 19.5, 1)).slice(0, 2), 'italic 34px Marcellus', '#BFF4FF', { pop: t - TL.PANCH - .6, glow: ['rgba(6,6,14,.9)', 14], spacing: 3 });
} });

// ================= K · the ashrams of Agastya and Atri; 10 years among these sages: the Dandaka from high up =================
SHOTS.push({ a: TL.K0, b: TL.L0 + .4, xf: .4, draw(c, u, t) {
  reset(); CAM3.near = 2; const ex = golden(I3.at(78.5, 22.5), { fogNear: 900, fogFar: 5000, shadow: 400 }); I3.set(t, { clouds: .35 });
  const k = easeIO(clamp(u / (TL.L0 + .4 - TL.K0))), alt = lerp(250, 300, k);
  flyAt(t, { sc: 7, trail: 1, glow: 2.2 }); routeTo(t, wOf(alt));
  PIL.panch.scale.setScalar(4); PIL.atri.scale.setScalar(4); PIL.panch.set(t, 1); PIL.atri.set(t, seg(t, TL.ATRI - .3, TL.ATRI + .4));
  ASH.forEach((g, i) => g.material.opacity = .9 * seg(t, TL.AGASTYA + i * .12, TL.AGASTYA + .5 + i * .12) * (.7 + .3 * Math.sin(t * 3 + i)));
  const C = mapCam(78.2, 22.2, alt, lerp(230, 260, k), lerp(-.25, .05, k), { fov: 44 });
  render3(c, I3.scene, C.cam, { exposure: ex * 1.05, fx: FXM(C.d) }); PIL.panch.scale.setScalar(1); PIL.atri.scale.setScalar(1);
  stopLabel(c, { name: 'AGASTYA', sub: '' }, I3.at(74.3, 19.6, 2), t, TL.AGASTYA - .05, { big: .85, dy: -30 });
  stopLabel(c, STOPS.atri, pinP(STOPS.atri, 88), t, TL.ATRI - .05, { big: .85, dy: -30 });
  if (t > TL.ANASUYA) text(c, 'DANDAKA FOREST', ...toScreen3(I3.at(79.4, 21.0, 2)).slice(0, 2), 'italic 40px Marcellus', '#D8F0C8', { pop: t - TL.ANASUYA, glow: ['rgba(6,6,14,.9)', 16], spacing: 4 });
  chip(c, '10 YEARS', 540, 640, t, TL.YEARS10 - .1, { size: 50 });
} });

// ================= L · "Chitrakoot, where Bharata begged me to come home, and took my sandals." =================
SHOTS.push({ a: TL.L0, b: TL.M0 + .4, xf: .3, draw(c, u, t) {
  reset(); CAM3.near = .5; const P = pinP(STOPS.chitra), ex = golden(P, { fogNear: 100, fogFar: 900, shadow: 80 }); I3.set(t, { clouds: .2 });
  const q = flyAt(t, { sc: 1.4, glow: 1.3 }); PIL.chitra.scale.setScalar(.6); PIL.chitra.set(t, seg(t, TL.CHITRA - .4, TL.CHITRA + .3)); routeTo(t, .45);
  const sk = seg(t, TL.SANDALS - .7, TL.SANDALS + .2);
  PAD.position.set(P[0] + 1.5, P[1] + lerp(2, 9, easeOut(sk)), P[2] + 3); PAD.userData.sc = 3.2; PAD.rotation.set(1.05, Math.sin(t * 1.2) * .25, 0); PAD.set(t, sk);
  const k = easeIO(clamp(u / (TL.M0 + .4 - TL.L0)));
  const C = mapCam(STOPS.chitra.lon, STOPS.chitra.lat - .05, lerp(52, 44, k), lerp(32, 27, k), lerp(.3, .1, k), { fov: 42, ay: lerp(2, 6, sk) });
  render3(c, I3.scene, C.cam, { exposure: ex * 1.05, fx: FXM(C.d) }); PIL.chitra.scale.setScalar(1);
  stopLabel(c, STOPS.chitra, pinP(STOPS.chitra, 13), t, TL.CHITRA - .05, { big: 1, dy: -30 });
  if (t > TL.SANDALS) text(c, 'His sandals ruled Ayodhya for 14 years', 540, 1110, 'italic 34px Marcellus', '#FFE8C0', { pop: t - TL.SANDALS - .1, glow: ['rgba(6,6,14,.95)', 16] });
} });

// ================= M · "The Yamuna. The Ganga. Guha's town." =================
SHOTS.push({ a: TL.M0, b: TL.N0 + .4, xf: .3, draw(c, u, t) {
  reset(); CAM3.near = .5; const P = pinP(STOPS.prayag), ex = golden(P, { fogNear: 120, fogFar: 1000, shadow: 90, sunAt: [-.8, .3, .35] }); I3.set(t, { clouds: .2 });
  const q = flyAt(t, { sc: 1.4, glow: 1.3 }); routeTo(t, .45); PIL.prayag.scale.setScalar(.6); PIL.guha.scale.setScalar(.6);
  const k = easeIO(clamp(u / (TL.N0 + .4 - TL.M0))), alt = lerp(44, 38, k);
  YAMUNA.set(seg(t, TL.YAMUNA - .4, TL.YAMUNA + .6), wOf(alt) * 2.2, 1); GANGA.set(seg(t, TL.GANGA - .4, TL.GANGA + .8), wOf(alt) * 2.6, 1);
  PIL.prayag.set(t, seg(t, TL.YAMUNA - .2, TL.GANGA + .2)); PIL.guha.set(t, seg(t, TL.GUHA - .3, TL.GUHA + .3));
  const C = mapCam(81.55, 25.62, alt + 10, lerp(32, 28, k), lerp(-.15, .05, k), { fov: 42 });
  render3(c, I3.scene, C.cam, { exposure: ex * 1.05, fx: FXM(C.d) }); PIL.prayag.scale.setScalar(1); PIL.guha.scale.setScalar(1);
  if (t > TL.YAMUNA) text(c, 'YAMUNA', ...toScreen3(I3.at(81.1, 25.5, 1)).slice(0, 2), 'italic 38px Marcellus', '#BFE0FF', { pop: t - TL.YAMUNA, glow: ['rgba(6,6,14,.9)', 14], spacing: 3 });
  if (t > TL.GANGA) text(c, 'GANGA', ...toScreen3(I3.at(81.25, 25.85, 1)).slice(0, 2), 'italic 38px Marcellus', '#E6FAFF', { pop: t - TL.GANGA, glow: ['rgba(6,6,14,.9)', 14], spacing: 3 });
  stopLabel(c, STOPS.prayag, pinP(STOPS.prayag, 13), t, TL.YAMUNA + .2, { big: .85, dx: 120, dy: -10 });
  stopLabel(c, STOPS.guha, pinP(STOPS.guha, 13), t, TL.GUHA - .05, { big: .85, dx: -110, dy: -40 });
} });

// ================= N · "And there... Ayodhya. Bow down to it, Sita." =================
SHOTS.push({ a: TL.N0, b: TL.O0 + .4, xf: .4, draw(c, u, t) {
  reset(); I3.ground.scale.y = .15; CAM3.near = .3; const q = flyAt(t, { sc: 1, trail: 0 }), A = pinP(STOPS.ayodhya), ex = golden(A, { fogNear: 20, fogFar: 160, shadow: 60, sunAt: [-.9, .22, .2] }); I3.set(t, { clouds: .25 });
  PIL.ayodhya.scale.setScalar(.3); PIL.ayodhya.set(t, .3 + .7 * seg(t, TL.AYODHYA - .3, TL.AYODHYA + .5)); SARAYU.set(seg(t, TL.AYODHYA - .2, TL.AYODHYA + 1), .25, .8); routeTo(t, .12);
  const k = easeIO(clamp(u / (TL.O0 + .4 - TL.N0)));
  // behind the Pushpak, looking north up the plain to Ayodhya on the horizon
  const pos = [q.p[0] - 9 + lerp(0, 1.5, k), q.p[1] + lerp(4, 5.5, k), q.p[2] + 13 - lerp(0, 3, k)];
  const cam = cam3({ pos, at: [lerp(q.p[0], A[0], .6), lerp(q.p[1], 8, .6), lerp(q.p[2], A[2], .6)], fov: 40 });
  PK.visible = false; render3(c, I3.scene, cam, { exposure: ex * 1.08, fx: FXM(18, 4) }); PIL.ayodhya.scale.setScalar(1);
  const [ax, ay] = toScreen3(pinP(STOPS.ayodhya, 40));
  memory(c, 'ayodhya', t, TL.BOW - .1, TL.O0 + .25, { x: 540, y: 820, r: 220, tag: '14 YEARS AGO', k: 1.1 });
  stopLabel(c, { name: 'AYODHYA', sub: '' }, pinP(STOPS.ayodhya, 12), t, TL.AYODHYA - .05, { big: 1.3, dy: -30 });
} });

// ================= O · the 14th year complete; on Panchami they land at Bharadvaja's ashram =================
SHOTS.push({ a: TL.O0, b: TL.P0 + .4, xf: .5, draw(c, u, t) {
  reset(); I3.ground.scale.y = .15; CAM3.near = .2; const P = pinP(STOPS.prayag), ex = dusk(P, { fogNear: 20, fogFar: 160, shadow: 30, sunAt: [-.95, .12, .25] });
  const land = easeIO(seg(t, TL.PANCHAMI - .6, TL.BHARADVAJA + .6)), g = I3.h(P[0], P[2]);
  const q = flyPose(I3, t), pp = [P[0] + .4, lerp(5, g + .9, land), P[2] - .3];
  flyAt(t, { p: pp, sc: 1, bank: 0, trail: 1 - land, glow: 1.4 });
  const k = easeIO(clamp(u / (TL.P0 + .4 - TL.O0)));
  const cam = cam3({ pos: [pp[0] - 8 + k, lerp(pp[1] + 3, g + 3.6, land), pp[2] + 10.5 - k], at: [pp[0], pp[1] - .9, pp[2]], fov: 36 });
  render3(c, I3.scene, cam, { exposure: ex * 1.2, fx: FXM(Math.hypot(8, 10.5), 6, { grade: { temp: .14 } }) });
  moon2(c, 250, 560, 44, seg(t, TL.PANCHAMI - .3, TL.PANCHAMI + .4));
  if (t > TL.PANCHAMI) text(c, '5th day of the waxing moon', 250, 650, 'italic 30px Marcellus', '#FFF0D0', { pop: t - TL.PANCHAMI - .2, glow: ['rgba(6,6,14,.95)', 14] });
  stopLabel(c, { name: "BHARADVAJA'S ASHRAM", sub: 'Prayag' }, [pp[0], g + 2.2, pp[2]], t, TL.BHARADVAJA - .05, { big: .85, dy: -260 });
} });

// ================= P · Ram sends Hanuman racing ahead to tell Bharata: "I'm home." =================
SHOTS.push({ a: TL.P0, b: TL.Q0 + .4, xf: .3, draw(c, u, t) {
  reset(); I3.ground.scale.y = .15; CAM3.near = .5; const P = pinP(STOPS.prayag), N = pinP(STOPS.nandi), A = pinP(STOPS.ayodhya), ex = golden(I3.at(82.05, 26.0), { fogNear: 200, fogFar: 1500, shadow: 140, sunAt: [-.9, .25, .3], sun: 2.6 });
  const run = easeIO(seg(t, TL.RACING - .3, TL.HOME - .1)), home = seg(t, TL.HOME - .1, TL.HOME + .4);
  PIL.prayag.set(t, 1); PIL.ayodhya.set(t, .5 + .5 * home); PIL.nandi.set(t, home);
  HANU.set(run, .35, 1); PIL.prayag.scale.setScalar(.25); PIL.ayodhya.scale.setScalar(.3); PIL.nandi.scale.setScalar(.25);
  const hp = [lerp(P[0], N[0], run), lerp(P[1], N[1], run) + 1 + Math.sin(run * Math.PI) * 2.5, lerp(P[2], N[2], run)];
  HCOMET.position.set(...hp); HCORE.position.set(...hp); const ca = seg(t, TL.RACING - .4, TL.RACING) * (1 - home * .6); HCOMET.material.opacity = ca; HCORE.material.opacity = ca;
  flyAt(t, { p: [P[0] + .4, I3.h(P[0], P[2]) * .15 + .9, P[2] - .3], sc: .5, trail: 0, glow: 1.4 });
  YAMUNA.set(1, .15, .7); GANGA.set(1, .18, .7); SARAYU.set(1, .15, .7);
  const k = easeIO(clamp(u / (TL.Q0 + .4 - TL.P0)));
  const C = mapCam(82.03, 25.86, lerp(40, 43, k), lerp(17, 19, k), lerp(-.35, -.25, k), { fov: 42 });
  render3(c, I3.scene, C.cam, { exposure: ex * 1.05, fx: FXM(C.d, 0, { grade: { temp: .18 } }) });
  PIL.prayag.scale.setScalar(1); PIL.ayodhya.scale.setScalar(1); PIL.nandi.scale.setScalar(1);
  if (t > TL.HANUMAN2 - .1) { const [x, y] = toScreen3(hp); text(c, 'HANUMAN', x, y - 60, '700 40px Cinzel', '#FFD890', { pop: t - TL.HANUMAN2 + .1, glow: ['rgba(6,6,14,.95)', 16], spacing: 3, alpha: 1 - home }); }
  stopLabel(c, { name: 'BHARATA', sub: 'Nandigram' }, pinP(STOPS.nandi, 6), t, TL.HOME - .1, { big: .9, dx: -150, dy: -30 });
  flash(c, .3 * Math.exp(-Math.max(0, t - TL.HOME) * 3) * (t > TL.HOME ? 1 : 0), '#FFD080');
} });

// ================= Q · Lanka to Ayodhya: the whole route lit =================
const MODERN = ['Sri Lanka', 'Rameswaram', 'Hampi', 'Nashik', 'Chitrakoot', 'Prayagraj', 'Shringverpur', 'Ayodhya'];
const allStops = (t, a = 1) => { for (const k of ['lanka', 'setu', 'kish', 'jatayu', 'panch', 'atri', 'chitra', 'prayag', 'guha', 'ayodhya']) PIL[k].set(t, a); };
const wideCam = (k) => mapCam(79.6, 16.0, lerp(570, 610, k), lerp(310, 335, k), -.06, { fov: 40 });
SHOTS.push({ a: TL.Q0, b: TL.R0 + .4, xf: .4, draw(c, u, t) {
  reset(); CAM3.near = 4; const ex = I3.mood('golden', { at: I3.at(79, 18), shadow: 1400, fogNear: 2500, fogFar: 9000, sunAt: [-.8, .45, .4], focus: .55, edge: .5 }); I3.set(t, { clouds: .25 });
  const k = easeIO(clamp(u / (TL.R0 + .4 - TL.Q0))), alt = 500;
  ROUTE_LINE.set(seg(t, TL.Q0, TL.ONE), wOf(alt) * .9, 1); HANU.set(seg(t, TL.AYODHYA2 - .4, TL.AYODHYA2 + .2), wOf(alt) * .9, 1);
  allStops(t, 1); I3.border.set(1, 3.4, .35);
  const C = wideCam(k); Object.values(PIL).forEach(p => p.scale.setScalar(1.6));
  render3(c, I3.scene, C.cam, { exposure: ex * 1.04, fx: FXM(C.d) });
  Object.values(PIL).forEach(p => p.scale.setScalar(1));
  stopLabel(c, { name: 'LANKA', sub: '' }, pinP(STOPS.lanka, 2), t, TL.LANKA2 - .05, { big: 1.1, dy: 60 });
  stopLabel(c, { name: 'AYODHYA', sub: '' }, pinP(STOPS.ayodhya, 2), t, TL.AYODHYA2 - .05, { big: 1.1, dy: -60 });
} });

// ================= R · the ask: how many have you visited? eight places, numbered =================
SHOTS.push({ a: TL.R0, b: TL.CARD, xf: .3, draw(c, u, t) {
  reset(); CAM3.near = 4; const ex = I3.mood('golden', { at: I3.at(79, 18), shadow: 1400, fogNear: 2500, fogFar: 9000, sunAt: [-.8, .45, .4], focus: .55, edge: .5 }); I3.set(t, { clouds: .25 });
  ROUTE_LINE.set(1, wOf(500) * .9, 1); HANU.set(1, wOf(500) * .9, 1); allStops(t, 1); I3.border.set(1, 1.6, .35);
  const C = wideCam(1); Object.values(PIL).forEach(p => p.scale.setScalar(1.6));
  render3(c, I3.scene, C.cam, { exposure: ex * 1.04, fx: FXM(C.d) }); Object.values(PIL).forEach(p => p.scale.setScalar(1));
  // a numbered badge on each place, and the list over the Arabian Sea
  c.save(); c.fillStyle = 'rgba(12,8,18,.72)'; c.strokeStyle = 'rgba(244,196,106,.8)'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(40, 455, 390, 470, 26); c.globalAlpha = clamp((t - TL.R0) * 3); c.fill(); c.stroke(); c.restore();
  COUNT.forEach((id, i) => {
    const s = STOPS[id], at = TL.R0 + .2 + i * .22, [x, y, z] = toScreen3(pinP(s, 2)); if (t < at || z > 1) return;
    const k = popK(t - at);
    c.save(); c.globalAlpha = clamp(k); c.fillStyle = '#7A1E22'; c.strokeStyle = '#F4C46A'; c.lineWidth = 3; c.beginPath(); c.arc(x, y, 21 * k, 0, TAU); c.fill(); c.stroke(); c.restore();
    text(c, String(i + 1), x, y + 1, '700 26px Cinzel', '#FFE8B8', { pop: t - at });
    const ly = 505 + i * 54;
    c.save(); c.globalAlpha = clamp(k); c.fillStyle = '#7A1E22'; c.strokeStyle = '#F4C46A'; c.lineWidth = 2.5; c.beginPath(); c.arc(84, ly, 19, 0, TAU); c.fill(); c.stroke(); c.restore();
    text(c, String(i + 1), 84, ly + 1, '700 24px Cinzel', '#FFE8B8', { pop: t - at });
    c.save(); c.globalAlpha = clamp(k); c.font = '600 34px Poppins'; c.fillStyle = '#FFF3DC'; c.textBaseline = 'middle'; c.shadowColor = 'rgba(6,6,14,.9)'; c.shadowBlur = 10; c.fillText(MODERN[i], 118, ly + 2); c.restore();
  });
} });

// ================= S · the card: the Parshurama series starts soon, follow, the wallpapers =================
SHOTS.push({ a: TL.CARD, b: TL.END + 1, xf: .4, draw(c, u, t) { seriesCard(c, u, t); } });
