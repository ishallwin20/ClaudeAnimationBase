// yama.js: "Diwali is FIVE days. The god of DEATH gets THREE." (ad 58) in the 3D style. The five days of Dipavali as
// the Padma Purana (Uttara Khanda 122) gives them, told through one village: day one, a single clay diya set outside the
// door for Yama, its flame turned south, and Death on his buffalo coming up the misty lane and turning away at its
// light; day two, a dawn bath at the ghat and water poured for Yama by his fourteen names; day three, the new moon, every
// roof and step and the river alight, Lakshmi's footprints at the door; day four, the hill ringed with lamps; day five,
// the twist: the god of death walks to his sister Yamuna's house by the river and she feeds him; so on Bhai Dooj brothers
// eat from their sister's hand. The close, the ask (does your family light the Yama diya?), the card. STORYBOARD.md has
// the plan and the sources; the timeline (from the voice) is yama_tl.js, the sets yama_props.js.
const W3 = world3(), SC = W3.scene, V = village3(SC), L3 = lamps3(SC, V), RM = room3(SC);
const HD = diya3(SC, DIYA_AT, { yaw: 0, shadow: true, power: .7, range: 9 });   // the Yama diya, its spout to the south (+z)
const YB = yamaBoard3(SC);
// a cold glow in the mist behind him, so his silhouette reads
const BACK = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexSoft(), color: '#8A9AC8', transparent: true, opacity: 0, depthWrite: false, fog: false })); BACK.scale.set(11, 7, 1); SC.add(BACK);
// the ghat's lota: a copper pot tipping water and black sesame into the river (day two)
const LOTA_AT = [RIVER_X + .1, WATER_Y + .62, -12.4];
const LOTA = (() => {
  // the lota tips to the south (+z): the devotee faces south for the tarpan
  const [lx, ly, lz] = LOTA_AT, G = new THREE.Group(); G.position.set(lx, ly, lz); SC.add(G);
  const pot = new THREE.Group(); G.add(pot);
  mesh3(pot, lathe3(smooth3([[0, -.1], [.06, -.1], [.09, -.05], [.095, .01], [.065, .06], [.042, .08], [.056, .105], [0, .105]], 4), 36), YM.copper, [0, 0, 0]);
  const stream = stream3(SC, [[lx, ly + .1, lz + .07], [lx, ly + .06, lz + .13], [lx, ly - .25, lz + .21], [lx, WATER_Y + .01, lz + .25]], .011, { speed: 4, opacity: .8, col: '#F0E4E0', glow: '#7A6A80' });
  const tilM = YM.std('#141210', .6), til = [];
  for (let i = 0; i < 44; i++) til.push(mesh3(SC, new THREE.SphereGeometry(.0045, 5, 4), tilM, [0, 0, 0], { cast: false }));
  // rings where the water lands
  const rings = [];
  for (let i = 0; i < 4; i++) rings.push(mesh3(SC, new THREE.RingGeometry(.9, 1, 48), new THREE.MeshBasicMaterial({ color: '#FFE2C0', transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }), [lx, WATER_Y + .01, lz + .25], { rot: [-Math.PI / 2, 0, 0], cast: false, receive: false }));
  const set = (t, on) => {
    G.visible = on > 0; pot.rotation.set(clamp(on) * 1.35, 0, 0);
    stream.set(t, clamp(on * 2 - .8));
    til.forEach((m, i) => { const per = .5, a = frac(t / per + hash(i + 7)) * per; m.position.set(lx + (hash(i + 8) - .5) * .05, ly + .08 - a * a * 4.6, lz + .1 + a * .3); m.visible = on > .7 && m.position.y > WATER_Y; });
    rings.forEach((r, i) => { const a = frac(t * .7 + i / 4); r.scale.setScalar(.03 + a * .5); r.material.opacity = on > .7 ? .5 * (1 - a) : 0; });
  };
  set(0, 0);
  return { set };
})();
// Lakshmi's footprints at the hero's door (day three): stepping in off the lane
const FEET = Array.from({ length: 6 }, (_, i) => foot3(SC, DIYA_AT[0] + 2.6 - i * .42, (i % 2 ? .13 : -.13), yawOf(-1, 0), i % 2 ? 1 : -1, { size: .2, col: '#FFB040', y: i < 4 ? 0 : .32 }));

// ---------- per shot: reset what the shots share ----------
function reset(t) {
  YB.place([0, 0, 0], { a: 0, draw() {} }); BACK.visible = false;
  L3.set(t, 0); LOTA.set(t, 0); V.setStars(0); V.setMist(0); V.setSun(0, 0);
  HD.flame.set(t, 1); HD.group.visible = true;
  V.inner.intensity = 0; V.sisInner.intensity = 0; V.hero.setOpen(.2);
  RM.thaliDiya.flame.set(t, 0); RM.standFlame.set(t, 0);
  FEET.forEach(f => f.material.opacity = 0);
  V.water.material.envMap = ENV.lane; V.ripple.offset.set(t * .006, t * .01);
}
// env maps for the water: each mood's sky, prefiltered
const ENV = (() => {
  const pm = new THREE.PMREMGenerator(GL3), out = {};
  for (const k of ['lane', 'dawn', 'diwali', 'gold']) {
    const s = new THREE.Scene(); const d = W3.skies[k].clone(); d.visible = true; s.add(d);
    out[k] = pm.fromScene(s, 0, .1, 1000).texture;
  }
  return out;
})();
// the sun's shadow box, moved to where a shot is (world3 aims it at the origin)
function sunOn(at, dir, size = 14) {
  const d = V3(...dir).normalize().multiplyScalar(40);
  W3.sun.position.set(at[0] + d.x, at[1] + d.y, at[2] + d.z); W3.sun.target.position.set(...at); W3.sun.target.updateMatrixWorld();
  Object.assign(W3.sun.shadow.camera, { left: -size, right: size, top: size, bottom: -size }); W3.sun.shadow.camera.updateProjectionMatrix();
}
const lane = (o = {}) => { const ex = W3.mood('lane', o); sunOn([0, 0, 0], MOODS3.lane.sun[2]); V.setStars(o.stars ?? 1); V.setMist(o.mist ?? 1); V.inner.intensity = o.inner ?? 1.2; V.water.material.envMap = ENV.lane; return ex; };

// ---------- Yama riding his buffalo, painted on the board ----------
// d: distance walked (m) for the gait; o.eye 0..1 (the burning eyes), o.col (silhouette), o.walk (gait phase override)
function rider(g, push, o = {}) {
  const wk = o.walk ?? (o.d ?? 0) / 1.7, bob = Math.sin(wk * TAU * 2) * 6;
  yamaRider(g, { col: o.col ?? '#16151C', walk: wk, t: o.t ?? 0, eye: 0, bell: true, gada: o.gada ?? true, gadaA: o.gadaA ?? .12, noose: o.noose ?? 1 });
  // the eyes: his (head units through the rider's transform) and the buffalo's
  push(30 - 11.4, -630 + bob); push(30 + 11.4, -630 + bob); push(404, -262 + bob);
}
function eyeGlows(c, a, o = {}) {
  if (a <= .01) return;
  YB.eyes().forEach((p, i) => { const [x, y, z] = toScreen3(p); if (z > 1) return; const r = (o.r ?? 40) * (i === 2 ? 1.1 : 1); glow(c, x, y, r, '#FF2A10', .85 * a); glow(c, x, y, r * .28, '#FFD0A0', .9 * a); });
}

// ---------- 2D on top ----------
const CAPY = 1300;
// a dark band under the captions
POST.push((c, t) => { if (t < TL.CARD) band(c, 1140, 1470, .4); });
VO.caps.forEach((k, i) => say(i ? k.a : -1, k.b, k.text, { at: i ? k.at : k.at.map(() => -1), y: CAPY }));

// the five days: five chips across the top of the safe band; the current one lit, Yama's three marked in red
const DAYS = [['DHANTERAS', 1], ['NARAKA CHATURDASHI', 1], ['AMAVASYA', 0], ['GOVARDHAN', 0], ['BHAI DOOJ', 1]];
const dayNow = t => t < TL.B0 ? -1 : t < TL.D0 ? 0 : t < TL.E0 ? 1 : t < TL.F0 ? 2 : t < TL.G0 ? 3 : 4;
function tracker(c, t, o = {}) {
  const a = o.a ?? 1; if (a <= .01) return;
  const y = o.y ?? 505, cur = o.cur ?? dayNow(t), marks = o.marks ?? (t >= TL.THREE - .05);
  DAYS.forEach(([name, yama], i) => {
    const x = 220 + i * 150, pop = o.noPop ? null : t - (TL.FIVE - .25 + i * .07), on = i === cur, past = i < cur;
    const k = popK(pop); if (k <= .01) return;
    c.save(); c.globalAlpha *= a * clamp(k); c.translate(x, y); c.scale(k, k);
    if (on) glow(c, 0, 0, 90, yama ? '#FF5A3A' : '#FFC060', .55);
    c.fillStyle = on ? 'rgba(60,24,10,.85)' : 'rgba(14,10,10,.72)'; c.beginPath(); c.arc(0, 0, 40, 0, TAU); c.fill();
    const red = yama && marks, ring = red ? (on ? '#FF6A4A' : 'rgba(255,90,60,.8)') : (on ? '#F4C46A' : past ? 'rgba(244,196,106,.65)' : 'rgba(244,196,106,.35)');
    c.strokeStyle = ring; c.lineWidth = on ? 5 : 3; c.beginPath(); c.arc(0, 0, 40, 0, TAU); c.stroke();
    c.restore();
    text(c, String(i + 1), x, y + 2, '700 44px Cinzel', on ? '#FFF3DC' : past ? '#F4C46A' : 'rgba(244,196,106,.6)', { alpha: a * clamp(k), glow: ['rgba(5,4,10,.9)', 12] });
    if (red) text(c, 'YAMA', x, y + 64, '700 26px Cinzel', '#FF7A5A', { pop: o.noPop ? null : t - (TL.THREE - .05 + [0, .08, 0, 0, .16][i]), alpha: a, spacing: 2, glow: ['rgba(5,4,10,.95)', 14] });
  });
  if (cur >= 0 && o.name !== false) {
    const nm = DAYS[cur][0], at = [TL.B0, TL.D0, TL.E0, TL.F0, TL.G0][cur];
    const k = popK(o.noPop ? null : t - at - .25);
    if (k > .01) { c.save(); c.globalAlpha *= a; c.translate(540, y + 122); c.scale(k, k); c.font = '700 34px Cinzel'; c.letterSpacing = '3px'; const w = c.measureText(nm).width + 60; c.fillStyle = 'rgba(20,10,8,.75)'; c.strokeStyle = DAYS[cur][1] ? 'rgba(255,110,80,.85)' : 'rgba(244,196,106,.85)'; c.lineWidth = 3; c.beginPath(); c.roundRect(-w / 2, -32, w, 64, 32); c.fill(); c.stroke(); c.restore();
      text(c, nm, 540, y + 124, '700 34px Cinzel', DAYS[cur][1] ? '#FF9A7A' : '#F4C46A', { alpha: a * clamp(k), spacing: 3 }); }
  }
}
// a letter or word pinned to a world point
function pin(c, txt, p, font, col, o = {}) { const [x, y, z] = toScreen3(p); if (z > 1) return; text(c, txt, x + (o.dx ?? 0), y + (o.dy ?? 0), font, col, { alpha: o.alpha ?? 1, pop: o.pop, glow: o.glow || ['rgba(5,4,10,.95)', 20], spacing: o.spacing || 0 }); }

// ================= A · the hook: one diya at a door, in the dark =================
SHOTS.push({ a: 0, b: TL.B0 + .4, draw(c, u, t) {
  reset(t); const ex = lane({ inner: 0 }); V.hero.setOpen(1);
  const k = u / (TL.B0 + .4);
  render3(c, SC, cam3({ pos: [DIYA_AT[0] + lerp(1.35, 1.2, k), lerp(.52, .5, k), DIYA_AT[2] + lerp(.14, .12, k)], at: [DIYA_AT[0], DIYA_AT[1] - .02, DIYA_AT[2] + .01], fov: 30 }), { exposure: ex });
  tracker(c, t);
  tag(c, 'DIWALI · PADMA PURANA', 1470, t, { w: 560 });
} });

// ================= B · day one: the lane, the lamp outside the door, and far off, two red eyes =================
SHOTS.push({ a: TL.B0, b: TL.C0 + .4, xf: .4, draw(c, u, t) {
  reset(t); const ex = lane();
  const k = easeIO(u / (TL.C0 + .4 - TL.B0));
  render3(c, SC, cam3({ pos: [lerp(3.2, .3, k), lerp(6.5, 1.25, k), lerp(-9, -4.4, k)], at: [lerp(-1, -1.0, k), lerp(1.4, .9, k), lerp(2, 6, k)], fov: 52 }), { exposure: ex });
  // far down the lane to the south, in the mist: his eyes, on YAMA
  const e = seg(t, TL.YAMA - .1, TL.YAMA + .4) * (1 - seg(t, TL.C0, TL.C0 + .4));
  for (const dz of [-.14, .14]) { const [x, y, z] = toScreen3([1.6 + dz, 2.35, 24]); if (z < 1) { glow(c, x, y, 18, '#FF2A10', .8 * e * (.8 + .2 * Math.sin(t * 9))); glow(c, x, y, 5, '#FFC0A0', .9 * e); } }
  tracker(c, t);
} });

// ================= C1 · the flame turned south: the doorstep from above, a compass on the ground =================
SHOTS.push({ a: TL.C0, b: TL.C1 + .4, xf: .4, draw(c, u, t) {
  reset(t); const ex = lane();
  const k = easeIO(u / (TL.C1 + .4 - TL.C0));
  render3(c, SC, cam3({ pos: [DIYA_AT[0] + lerp(1.8, 1.6, k), lerp(.62, .58, k), DIYA_AT[2] + .02], at: [DIYA_AT[0], DIYA_AT[1] - .05, DIYA_AT[2] + .02], fov: 36 }), { exposure: ex });
  // a compass on the otla: seen from the lane, south is to the left, north to the right
  const p0 = DIYA_AT, a = seg(t, TL.C0 + .1, TL.C0 + .5), sP = [p0[0], p0[1], p0[2] + .3], nP = [p0[0], p0[1], p0[2] - .22];
  pin(c, 'N', nP, '700 60px Cinzel', '#CFC2B0', { alpha: a * .7, dy: 20 });
  const sA = seg(t, TL.SOUTH - .15, TL.SOUTH + .2);
  const [fx, fy] = toScreen3(HD.tip()), [sx, sy] = toScreen3(sP);
  if (sA > 0) {
    c.save(); c.globalAlpha = sA; c.strokeStyle = '#FF7A4A'; c.lineWidth = 8; c.lineCap = 'round'; c.lineJoin = 'round'; c.shadowColor = 'rgba(255,90,40,.8)'; c.shadowBlur = 18;
    const y = fy - 70, x0 = fx - 10, x1 = lerp(x0, sx + 60, easeOut(sA));
    c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y); c.stroke();
    c.beginPath(); c.moveTo(x1 + 24, y - 22); c.lineTo(x1, y); c.lineTo(x1 + 24, y + 22); c.stroke(); c.restore();
  }
  pin(c, 'S', sP, '700 120px Cinzel', '#FFB070', { alpha: Math.max(a * .7, sA), dy: 20, pop: sA > 0 ? t - TL.SOUTH + .15 : null, glow: ['rgba(255,90,40,.7)', 30] });
  if (t > TL.SOUTH + .3) pin(c, "YAMA'S", sP, '700 34px Cinzel', '#FF9A7A', { dy: -70, pop: t - TL.SOUTH - .3, spacing: 3 });
  tracker(c, t);
} });

// ================= C2 · untimely death stays away: he rides up the lane, stops at the light, turns back =================
// the walk: in from the south (+z) to the lamp, a halt, then back into the mist
const YAMA_X = 2.9;
function yamaWalk(t, t0) {
  const t1 = t0 + 2.0, t2 = t1 + .9, t3 = t2 + 2.4;   // walk in, halt, turn and go
  const zIn = 11, zStop = 2.2;
  if (t < t1) { const k = seg(t, t0, t1); return { z: lerp(zIn, zStop, 1 - (1 - k) * (1 - k) * .0 - 0) * 0 + lerp(zIn, zStop, k), d: k * (zIn - zStop), flip: true, eye: 1, stop: 0 }; }
  if (t < t2) { const k = seg(t, t1, t2); return { z: zStop, d: zIn - zStop + .2 * easeOut(k), flip: true, eye: 1 - .9 * k, stop: k }; }
  const k = seg(t, t2, t3); return { z: lerp(zStop, zIn + 4, easeIn(k) * .6 + k * .4), d: zIn - zStop + k * 9, flip: false, eye: .1, stop: 1, gone: k };
}
const shotC2 = (a, b, t0, o = {}) => SHOTS.push({ a, b, xf: .4, draw(c, u, t) {
  reset(t); const ex = lane({ inner: 1.0 });
  const w = yamaWalk(t, t0), flare = Math.exp(-Math.max(0, t - (t0 + 2.0)) * 2.2) * (t > t0 + 2.0 ? 1 : 0);
  HD.flame.set(t, 1 + 1.2 * flare);
  HD.flame.light.intensity *= 1 + 2.5 * flare;
  V.hero.setOpen(.95);
  const cam = cam3({ pos: [HERO.x - .22, .8, -.12], at: [YAMA_X, .82, 1.3], fov: 66 });
  BACK.position.set(YAMA_X + 2.4, 2.0, w.z + .6); BACK.material.opacity = .55 * (1 - (w.gone ?? 0) * .5); BACK.visible = true;
  YB.place([YAMA_X, 0, w.z], { h: 3.9, yaw: -Math.PI / 2, flip: w.flip, a: 1 - (w.gone ?? 0) * .9, draw: (g, push) => rider(g, push, { d: w.d, t }) });
  render3(c, SC, cam, { exposure: ex });
  eyeGlows(c, w.eye * (1 - (w.gone ?? 0)), { r: 30 });
} });
shotC2(TL.C1, TL.D0 + .4, TL.C1 + .1);

// ================= D1 · day two, morning: a bath at the ghat, water for Yama =================
SHOTS.push({ a: TL.D0, b: TL.N14 - .1, xf: .5, draw(c, u, t) {
  reset(t); HD.flame.set(t, 0);
  const ex = W3.mood('dawn'); sunOn([RIVER_X, 0, -12], MOODS3.dawn.sun[2]); V.water.material.envMap = ENV.dawn; V.setStars(.25); V.setSun([RIVER_X + 280, 12, -14], .9, 70);
  LOTA.set(t, .02 + seg(t, TL.WATER - .6, TL.WATER));
  const k = easeIO(u / (TL.N14 - .1 - TL.D0));
  render3(c, SC, cam3({ pos: [LOTA_AT[0] - 1.7 + k * .15, LOTA_AT[1] + .22, LOTA_AT[2] + .08], at: [LOTA_AT[0] + 2, LOTA_AT[1] - .3, LOTA_AT[2] + .05], fov: 44 }), { exposure: ex });
  tracker(c, t);
} });

// ================= D2 · by his fourteen names: up to the dawn sky, the names in a ring =================
const NAMES = [['यम', 'YAMA'], ['धर्मराज', 'DHARMARAJA'], ['मृत्यु', 'MRITYU'], ['अन्तक', 'ANTAKA'], ['वैवस्वत', 'VAIVASVATA'], ['काल', 'KALA'], ['सर्वभूतक्षय', 'SARVABHUTAKSHAYA'],
  ['औदुम्बर', 'AUDUMBARA'], ['दध्न', 'DADHNA'], ['नील', 'NILA'], ['परमेष्ठी', 'PARAMESHTHI'], ['वृकोदर', 'VRIKODARA'], ['चित्र', 'CHITRA'], ['चित्रगुप्त', 'CHITRAGUPTA']];
function nameRing(c, t, o = {}) {
  const cx = 540, cy = o.cy ?? 820, R = o.R ?? 335, a = o.a ?? 1, rot = (t - TL.N14) * .03;
  const n = o.all ? 14 : clamp(Math.floor((t - TL.N14) / TL.NSTEP) + 1, 0, 14);
  const done = seg(t, TL.N14 + 13 * TL.NSTEP + .2, TL.N14 + 13 * TL.NSTEP + .6);
  glow(c, cx, cy, R * 1.25, '#FFB060', (.12 + .18 * done) * a);
  for (let i = 0; i < n; i++) {
    const th = -Math.PI / 2 + (i + .5) / 14 * TAU + rot, x = cx + Math.cos(th) * R, y = cy + Math.sin(th) * R;
    const pop = o.all ? null : t - (TL.N14 + i * TL.NSTEP);
    text(c, NAMES[i][0], x, y - 8, '46px "Tiro Devanagari Sanskrit"', '#FFE2A0', { pop, alpha: a, glow: ['rgba(255,150,50,.75)', 18], maxW: 130 });
    text(c, NAMES[i][1], x, y + 34, '700 19px Cinzel', '#F4D8B0', { pop, alpha: a * .9, spacing: 1, glow: ['rgba(5,4,10,.95)', 10], maxW: 130 });
  }
  if (n > 0) text(c, String(n), cx, cy + 6, '700 150px Cinzel', '#FFF3DC', { pop: o.all ? null : t - (TL.N14 + (n - 1) * TL.NSTEP), alpha: a, glow: ['rgba(255,140,40,.8)', 34] });
  if (n > 0) text(c, 'NAMES', cx, cy + 96, '700 32px Cinzel', '#F4C46A', { alpha: a, spacing: 5, glow: ['rgba(5,4,10,.9)', 12] });
}
SHOTS.push({ a: TL.N14 - .5, b: TL.E0 + .4, xf: .4, draw(c, u, t) {
  reset(t); HD.flame.set(t, 0);
  const ex = W3.mood('dawn'); sunOn([RIVER_X, 0, -12], MOODS3.dawn.sun[2]); V.water.material.envMap = ENV.dawn; V.setStars(.25); V.setSun([RIVER_X + 280, 12, -14], .9, 70);
  LOTA.set(t, 1);
  const k = easeIO(u / 2.2);
  render3(c, SC, cam3({ pos: [LOTA_AT[0] - 1.55, LOTA_AT[1] + .22, LOTA_AT[2] + .08], at: [LOTA_AT[0] + 2, lerp(LOTA_AT[1] - .3, LOTA_AT[1] + 4.5, k), LOTA_AT[2] + .05], fov: 44 }), { exposure: ex });
  nameRing(c, t);
} });

// ================= E · day three, the new moon: every lamp in the village, Lakshmi's feet at the door =================
SHOTS.push({ a: TL.E0, b: TL.F0 + .4, xf: .35, draw(c, u, t) {
  reset(t); const ex = W3.mood('diwali'); sunOn([0, 0, 0], [-6, 10, 9]); V.setStars(.9); V.inner.intensity = 1.6; V.water.material.envMap = ENV.diwali;
  L3.set(t, 1, { radius: 2 + Math.pow(u * 1.6, 2.2) * 6 });
  FEET.forEach((f, i) => f.material.opacity = .85 * seg(t, TL.LAKSHMI - .5 + (5 - i) * .08, TL.LAKSHMI - .2 + (5 - i) * .08));
  const k = easeIO(u / (TL.F0 + .4 - TL.E0));
  const pos = kf(k, [[0, [DIYA_AT[0] + 3.2, 1.1, 1.4]], [.4, [3.6, 4, 6]], [1, [2.2, 9.5, 17]]], x => x);
  const at = kf(k, [[0, [DIYA_AT[0], .7, .1]], [.4, [-.5, 1.2, -2]], [1, [2.2, -.5, -12]]], x => x);
  render3(c, SC, cam3({ pos, at, fov: lerp(48, 56, k) }), { exposure: ex });
  tracker(c, t);
} });

// ================= F · day four: the hill across the river, ringed with lamps at first light =================
SHOTS.push({ a: TL.F0, b: TL.G0 + .2, xf: .35, draw(c, u, t) {
  reset(t); HD.flame.set(t, 0);
  const ex = W3.mood('dawn', { exposure: .62, sun: .2, hemi: .5 }); SC.fog.near = 120; SC.fog.far = 700; sunOn([RIVER_X + 60, 0, -40], [60, 3, -10], 60); V.water.material.envMap = ENV.dawn; V.setStars(.6);
  L3.set(t, .5, { hill: seg(t, TL.GOVARDHAN - .5, TL.GOVARDHAN + .3) });
  const k = easeIO(u / (TL.G0 + .2 - TL.F0));
  render3(c, SC, cam3({ pos: [RIVER_X + 10 + 14 * k, 6 - 2 * k, -6 - 6 * k], at: [V.HILL[0], 10, V.HILL[2]], fov: 46 }), { exposure: ex });
  tracker(c, t);
} });
// the beat of silence before day five: a fade to black
POST.push((c, t) => { const a = seg(t, TL.G0 - .25, TL.G0) * (1 - seg(t, TL.G0 + .15, TL.G0 + .6)); if (a > 0) { c.fillStyle = `rgba(0,0,0,${a})`; c.fillRect(0, 0, W, H); } });

// ================= G · day five: the god of death walks to his sister's house by the river =================
const SIS_DOOR = [SIS.x, 0, SIS.z + 2.3 + .9];   // before the sister's door (its otla to the south)
function shotG(a, b, o = {}) {
  SHOTS.push({ a, b, xf: o.xf ?? .2, draw(c, u, t) {
    reset(t); HD.flame.set(t, 0);
    const ex = W3.mood('gold', { exposure: o.exposure ?? .92 }); sunOn([SIS.x, 0, -22], [60, 4, 4], 18); V.water.material.envMap = ENV.gold; V.sisInner.intensity = 2.4;
    const camP = o.cam ? o.cam(u) : [lerp(15.2, 15.6, u / 4), 1.1, lerp(-19.2, -19.6, u / 4)], camA = o.at ? o.at(u) : [21.5, 1.9, -25.2];
    const cam = cam3({ pos: camP, at: camA, fov: o.fov ?? 56 });
    if (o.yama !== false) {
      const k = o.walkK ? o.walkK(t) : seg(t, a, a + 3.4), z = lerp(-13.5, SIS_DOOR[2] + .6, easeOut(k)), x = 21.6;
      const yaw = Math.atan2(camP[0] - x, camP[2] - z);
      YB.place([x, 0, z], { h: 3.9, yaw, flip: true, a: 1, draw: (g, push) => rider(g, push, { d: k * 12, walk: k >= 1 ? 0 : undefined, t, col: '#120E10' }) });
    }
    render3(c, SC, cam, { exposure: ex });
    if (o.tracker !== false) tracker(c, t);
  } });
}
shotG(TL.G0 + .05, TL.H0 + .4, { walkK: t => seg(t, TL.G0 + .2, TL.HOUSE + .3) });

// ================= H · long ago on this day Yamuna fed her brother: the room, the thali, his shadow on the wall =================
const SHADOW = (() => {   // his shadow on the back wall, cast by the lamp behind him: crowned head and broad shoulders, seated
  const S = 1024, cv = document.createElement('canvas'); cv.width = cv.height = S; const g = cv.getContext('2d');
  const tex = new THREE.CanvasTexture(cv), BLACK = Object.fromEntries(Object.keys(YAMA_C).map(k => [k, '#000000']));
  const m = mesh3(SC, new THREE.PlaneGeometry(2.4, 2.4), new THREE.MeshBasicMaterial({ map: tex, color: '#000000', transparent: true, opacity: .6, depthWrite: false }), RM.at([.2, 1.35, -2.18]), { cast: false, receive: false });
  const set = (t, a) => {
    m.visible = a > .01; if (!m.visible) return; m.material.opacity = .62 * a;
    g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, S, S); g.filter = 'blur(7px)'; g.fillStyle = '#000';
    const sw = Math.sin(t * 7) * .008 + vnoise(t * 5, 4) * .01;
    g.translate(S / 2, S); g.rotate(sw);
    // shoulders and arms down to the floor of the frame
    g.beginPath(); g.moveTo(-330, 0); g.bezierCurveTo(-330, -260, -300, -400, -150, -430); g.lineTo(-60, -460); g.lineTo(60, -460); g.lineTo(150, -430); g.bezierCurveTo(300, -400, 330, -260, 330, 0); g.closePath(); g.fill();
    // the head, crowned, moustached (cine_yama.js), scaled to the shoulders
    g.save(); g.translate(0, -440); g.scale(1.55, 1.55); g.translate(0, 740); withSur(BLACK, () => { suryaHead(g, { fierce: .2, kundala: 'sun' }); yamaStache(g, BLACK); }); g.restore();
    g.filter = 'none'; tex.needsUpdate = true;
  };
  set(0, 0); return { set };
})();
const room = (o = {}) => { const ex = W3.mood('room'); sunOn(RM.at([0, 0, 0]), [8, 6, 1.5], 4); W3.sun.intensity = o.sun ?? 2.2; RM.thaliDiya.flame.set(o.t, 1); RM.standFlame.set(o.t, 1); return ex; };
SHOTS.push({ a: TL.H0, b: TL.I0 + .4, xf: .4, draw(c, u, t) {
  reset(t); HD.flame.set(t, 0); const ex = room({ t });
  SHADOW.set(t, seg(t, TL.YAMUNA - .4, TL.FED));
  const k = easeIO(u / (TL.I0 + .4 - TL.H0));
  render3(c, SC, cam3({ pos: RM.at([.2, lerp(1.12, 1.04, k), lerp(.75, .5, k)]), at: RM.at([.2, .82, -1.6]), fov: 52 }), { exposure: ex });
  tracker(c, t);
} });

// ================= I · so on Bhai Dooj, brothers eat from their sister's hand: the thali, close =================
SHOTS.push({ a: TL.I0, b: TL.J0 + .4, xf: .4, draw(c, u, t) {
  reset(t); HD.flame.set(t, 0); const ex = room({ t }); SHADOW.set(t, 0);
  const k = easeIO(u / (TL.J0 + .4 - TL.I0)), th = RM.thaliAt();
  render3(c, SC, cam3({ pos: [th[0] + lerp(.55, .42, k), th[1] + lerp(.5, .42, k), th[2] + lerp(.62, .5, k)], at: [th[0] - .02, th[1] + .02, th[2] - .02], fov: 40 }), { exposure: ex });
  tracker(c, t);
} });

// ================= J · two days we keep Death away (the lane, him turning back) =================
shotC2(TL.J0, TL.J1 + .4, TL.J0 - 1.3, { tracker: false });
// ...on the third even Death goes home to his sister: the bank, the buffalo waiting at her door
shotG(TL.J1, TL.K0 + .4, { xf: .4, tracker: false, walkK: t => seg(t, TL.J1 - .2, TL.HOME + .1), cam: u => [lerp(12.6, 14.2, easeIO(u / 6)), 1.3, lerp(-17, -19.5, easeIO(u / 6))], fov: 54 });

// ================= K · the ask: the Yama diya at the door again, its flame to the south =================
// an arrow from the flame to the left of the frame (south, seen from the lane) and an S
function southArrow(c, t, at, o = {}) {
  const a = seg(t, at, at + .35); if (a <= 0) return;
  const [fx, fy] = toScreen3(HD.tip()), y = fy + (o.dy ?? 0), x0 = fx - 70, x1 = lerp(x0, o.to ?? 250, easeOut(a));
  c.save(); c.globalAlpha = a; c.strokeStyle = '#FF7A4A'; c.lineWidth = 8; c.lineCap = 'round'; c.lineJoin = 'round'; c.shadowColor = 'rgba(255,90,40,.8)'; c.shadowBlur = 18;
  c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y); c.stroke(); c.beginPath(); c.moveTo(x1 + 24, y - 22); c.lineTo(x1, y); c.lineTo(x1 + 24, y + 22); c.stroke(); c.restore();
  text(c, 'S', (o.to ?? 250) - 70, y + 4, '700 100px Cinzel', '#FFB070', { pop: t - at - .2, glow: ['rgba(255,90,40,.7)', 30] });
}
SHOTS.push({ a: TL.K0, b: TL.CARD, xf: .4, draw(c, u, t) {
  reset(t); const ex = lane({ inner: 0 }); V.hero.setOpen(1);
  const k = easeIO(u / (TL.CARD - TL.K0));
  render3(c, SC, cam3({ pos: [DIYA_AT[0] + lerp(1.45, 1.2, k), lerp(.53, .5, k), DIYA_AT[2] + lerp(.16, .12, k)], at: [DIYA_AT[0], DIYA_AT[1] - .02, DIYA_AT[2] + .09], fov: 30 }), { exposure: ex });
  tracker(c, t, { cur: 0, noPop: true, name: false });
  southArrow(c, t, TL.DIYA - .3);
} });

// ================= L · the card =================
SHOTS.push({ a: TL.CARD, b: TL.END + 1, draw(c, u, t) {
  rkCardCine(c, u, t, { title: 'MEET OUR GODS', line: 'Picture books of our gods, for kids', price: 'Books 1–3 · set of 3 for ₹500' });
} });
