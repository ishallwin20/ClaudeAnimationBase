// swaha.js: "Every time you say SWAHA, you're calling a GODDESS." (ad 49), the fifth 3D reel: a havan at night in the
// shrine's courtyard (cine3d_havan.js before cine3d_temple.js's shrine). The word ends every offering (the Yajur Veda's
// agnaye svāhā); the Devi Bhagavatam says it is a name: the offerings never reached the gods, Brahma prayed, and from the
// Devi came Svaha, Agni's power to burn and his wife; offered with her name, it reaches the gods; a mantra without her is
// a snake without poison (Devi Bhagavatam 9.43). Her sisters: Svadha, said when feeding the ancestors (9.44), and
// Dakshina, the gift to the priest (9.45). The ask; the 15K Family Deal card. STORYBOARD.md has the plan and the sources;
// the timeline is swaha_tl.js.
const W3 = world3(), T3 = shrine3(W3.scene), HV = havan3(W3.scene, { at: [5.2, 0, 0] }), STARS = stars3(W3.scene);
const K = HV.at, CAPY = 1330;
VO.caps.forEach((k, i) => say(i ? k.a : -1, k.b, k.text, { at: i ? k.at : k.at.map(() => -1), y: CAPY }));

const night = (o = {}) => W3.mood('night', { hemi: .3, sun: .45, sunAt: [-6, 9, -5], exposure: .95, ...o });
// a dark band behind the captions (the fire and the kund's rim sit under them)
POST.push((c, t) => { if (t > TL.CARD) return; const g = c.createLinearGradient(0, CAPY - 260, 0, CAPY + 260); g.addColorStop(0, 'rgba(4,2,6,0)'); g.addColorStop(.35, 'rgba(4,2,6,.62)'); g.addColorStop(.65, 'rgba(4,2,6,.62)'); g.addColorStop(1, 'rgba(4,2,6,0)'); c.fillStyle = g; c.fillRect(0, CAPY - 260, W, 520); });
// set the havan for this frame: the offerings (times), the fire's state (o)
const havan = (t, o = {}) => {
  const f = offerings(t, o.pours || [], { lead: o.lead }), x = offerings(t, o.fails || [], { fail: true, lead: o.lead });
  T3.set(t, { lamps: .7, inner: 1, water: 0 });
  HV.set(t, { fire: o.fire ?? 1, flare: Math.max(f.flare, o.flare || 0), dull: Math.max(o.dull || 0, x.puff * .6), gold: o.gold || 0,
    smoke: (o.smoke ?? .35) + x.puff * 1.6, ladle: Math.max(f.tip, x.tip, o.hold ? .08 : 0), ladleOn: !!o.hold, pour: Math.max(f.pour, x.pour), rise: o.rise, tarpan: o.tarpan || 0 });
  return f;
};
const close = (k = 0, o = {}) => cam3({ pos: [K[0] + lerp(1.7, 1.45, k), lerp(1.0, .95, k), K[2] + lerp(.45, .3, k)], at: [K[0] - .1, o.aty ?? .62, K[2]], fov: o.fov ?? 46 });
const orbit = (a, r = 3.2, y = 1.5, o = {}) => cam3({ pos: [K[0] + Math.cos(a) * r, y, K[2] + Math.sin(a) * r], at: [K[0] + (o.atx ?? -.5), o.aty ?? .9, K[2]], fov: o.fov ?? 48 });

// ================= A · the hook: the fire, the ladle tips, SWAHA =================
SHOTS.push({ a: -1, b: TL.B0 + .4, draw(c, u, t) {
  const ex = night(); havan(t, { pours: [TL.SWAHA0], hold: true });
  render3(c, W3.scene, close(easeIO(clamp(t / 4))), { exposure: ex });
} });

// ================= B · at every havan, every wedding, every griha pravesh =================
SHOTS.push({ a: TL.B0, b: TL.C0 + .4, xf: .4, draw(c, u, t) {
  const ex = night(); havan(t, { pours: [TL.HAVAN, TL.WEDDING, TL.GRIHA], lead: .4, hold: true });
  render3(c, W3.scene, orbit(lerp(1.25, .85, easeIO(u / 4.3)), lerp(3.2, 2.8, u / 4.3), 1.7, { atx: 0 }), { exposure: ex });
} });

// ================= C · the Vedas: agnaye svaha =================
SHOTS.push({ a: TL.C0, b: TL.D0 + .4, xf: .4, draw(c, u, t) {
  const ex = night(); havan(t, { pours: [TL.SWAHA1, TL.SWAHA2], hold: true });
  const k = easeIO(clamp(u / 6.5));
  render3(c, W3.scene, cam3({ pos: [K[0] + lerp(1.3, 1.1, k), lerp(.55, .6, k), K[2] + lerp(-.75, -.45, k)], at: [K[0] - .1, .85, K[2] + .05], fov: 50 }), { exposure: ex });
  deva(c, 'अग्नये स्वाहा', 540, 600, t, TL.AGNAYE - .1, { size: 100, sub: 'agnaye svāhā · Yajur Veda' });
} });

// ================= D · the Devi Bhagavatam says SWAHA is a NAME =================
SHOTS.push({ a: TL.D0, b: TL.E0 + .4, xf: .4, draw(c, u, t) {
  const ex = night(); havan(t, { gold: .35 * seg(t, TL.NAME - .3, TL.NAME + .4) });
  const k = easeIO(clamp(u / 4));
  render3(c, W3.scene, cam3({ pos: [K[0] + lerp(2.1, 1.7, k), lerp(.7, .9, k), K[2] + .2], at: [K[0], lerp(.9, 1.1, k), K[2]], fov: 50 }), { exposure: ex });
  deva(c, 'देवी भागवत पुराण', 540, 560, t, TL.DEVIB - .1, { size: 64, sub: 'Devi Bhagavata Purana', alpha: 1 - seg(t, TL.NAME - .5, TL.NAME - .2) });
  deva(c, 'स्वाहा', 540, 640, t, TL.NAME - .15, { size: 170, sub: 'svāhā' });
} });
POST.push((c, t) => flash(c, .35 * Math.exp(-Math.max(0, t - TL.NAME) * 4) * (t > TL.NAME ? 1 : 0), '#FFC870'));

// ================= E · once, the offerings never reached the gods; the gods went hungry =================
SHOTS.push({ a: TL.E0, b: TL.F0 + .4, xf: .4, draw(c, u, t) {
  const ex = night({ exposure: 1 }); const age = t - TL.FAILS[0];
  havan(t, { fire: .7, dull: .8, smoke: 1, fails: [TL.FAILS[0]], hold: true, rise: [age, .8, 1] });
  const up = easeIO(seg(t, TL.GODS0 - .9, TL.GODS0 + .6));
  render3(c, W3.scene, cam3({ pos: [K[0] + lerp(1.8, 2.6, up), lerp(1.0, .7, up), K[2] + .35], at: [K[0] - .1, lerp(.7, 9, up), K[2] - lerp(0, 1, up)], fov: lerp(46, 56, up) }), { exposure: ex });
} });

// ================= F · Brahma prayed, and from the Devi came a goddess: SWAHA =================
const vis = (t) => easeOut(seg(t, TL.GODDESS - .4, TL.SWAHA3 + .3)) * (1 - seg(t, TL.WIFE + .2, TL.WIFE + 1.1));
SHOTS.push({ a: TL.F0, b: TL.G0 + .4, xf: .5, draw(c, u, t) {
  const ex = night(); const g = seg(t, TL.DEVI - .2, TL.SWAHA3);
  havan(t, { dull: .5 * (1 - seg(t, TL.F0, TL.DEVI)), gold: g, flare: .4 * g });
  const k = easeIO(clamp(u / 5));
  render3(c, W3.scene, cam3({ pos: [K[0] + lerp(2.9, 2.5, k), lerp(.8, .85, k), K[2] + .25], at: [K[0], lerp(.95, 1.1, k), K[2]], fov: 52 }), { exposure: ex });
  svahaVision(c, 540, 1120, 3.4, t, vis(t));
} });
POST.push((c, t) => flash(c, .45 * Math.exp(-Math.max(0, t - TL.SWAHA3) * 3.5) * (t > TL.SWAHA3 ? 1 : 0), '#FFD890'));

// ================= G · she became Agni's power to burn, and his wife =================
SHOTS.push({ a: TL.G0, b: TL.H0 + .4, xf: .3, draw(c, u, t) {
  const ex = night(); const burn = seg(t, TL.BURN - .2, TL.BURN + .2) * Math.exp(-Math.max(0, t - TL.BURN - .2) * .9);
  havan(t, { gold: 1 - .5 * seg(t, TL.WIFE, TL.WIFE + 1), flare: .4 + .6 * burn });
  const k = easeIO(clamp(u / 4));
  render3(c, W3.scene, cam3({ pos: [K[0] + lerp(2.5, 2.2, k), lerp(.85, .9, k), K[2] + lerp(.25, .1, k)], at: [K[0], 1.1, K[2]], fov: 52 }), { exposure: ex });
  svahaVision(c, 540, 1120 - 30 * k, 3.4 + .2 * k, t, vis(t));
} });

// ================= H · end the offering with her name, and it reaches the gods =================
SHOTS.push({ a: TL.H0, b: TL.I0 + .4, xf: .4, draw(c, u, t) {
  const ex = night(); const t0 = TL.POURS[6], age = t - t0;
  const up = easeIO(seg(t, t0 + .3, TL.GODS + .3)), k = easeIO(clamp(u / 3));
  havan(t, { pours: [t0], hold: true, rise: [age, 1, 0], gold: .3, smoke: .35 * (1 - up) });
  render3(c, W3.scene, cam3({ pos: [K[0] + lerp(lerp(1.8, 1.55, k), 2.8, up), lerp(1.0, .6, up), K[2] + .35], at: [K[0] - .1, lerp(.65, 8, up), K[2]], fov: lerp(46, 60, up) }), { exposure: ex });
  STARS.material.opacity = .85 + .15 * seg(t, TL.GODS - .2, TL.GODS + .3);
} });
POST.push((c, t) => flash(c, .4 * Math.exp(-Math.max(0, t - TL.GODS) * 3) * (t > TL.GODS ? 1 : 0), '#FFE2A0'));

// ================= I · a mantra without SWAHA is a snake without poison =================
SHOTS.push({ a: TL.I0, b: TL.J0 + .4, xf: .4, draw(c, u, t) {
  const ex = night(); const x = seg(t, TL.WITHOUT, TL.WITHOUT + .6) * (1 - seg(t, TL.POISON + .4, TL.J0 + .4));
  havan(t, { fails: [TL.WITHOUT], hold: true, dull: .6 * x, smoke: .35 + .6 * x, rise: [t - TL.WITHOUT, .7, 1] });
  render3(c, W3.scene, close(1 - easeIO(clamp(u / 5)) * .6, { aty: .7 }), { exposure: ex });
} });

// ================= J · SWADHA: the name we say when we feed our ancestors =================
SHOTS.push({ a: TL.J0, b: TL.K0 + .4, xf: .5, draw(c, u, t) {
  const ex = night(); havan(t, { tarpan: seg(t, TL.ALONE - .2, TL.SWADHA + .3) }); const p = HV.tarpanAt, k = easeIO(clamp(u / 5));
  render3(c, W3.scene, cam3({ pos: [p[0] + lerp(1.15, .9, k), lerp(.9, .75, k), p[2] + lerp(.25, .15, k)], at: [p[0] - .05, .32, p[2] - .08], fov: 44 }), { exposure: ex });
  deva(c, 'स्वधा', 540, 540, t, TL.SWADHA - .1, { size: 150, sub: 'svadhā · for the ancestors' });
} });

// ================= K · DAKSHINA: the gift to the priest =================
SHOTS.push({ a: TL.K0, b: TL.L0 + .4, xf: .4, draw(c, u, t) {
  const ex = night(); havan(t, {}); const p = HV.dakshinaAt, k = easeIO(clamp(u / 3));
  render3(c, W3.scene, cam3({ pos: [p[0] + lerp(.75, .6, k), lerp(.7, .6, k), p[2] + lerp(-.35, -.2, k)], at: [p[0] - .02, .05, p[2]], fov: 42 }), { exposure: ex });
  const [x, y] = toScreen3([p[0], .06, p[2]]); for (let i = 0; i < 3; i++) { const tw = Math.max(0, Math.sin(t * 3 + i * 2.1)); glow(c, x + (i - 1) * 60, y - 20 + i * 14, 40 * tw, '#FFF0C8', .7 * tw); }
  deva(c, 'दक्षिणा', 540, 540, t, TL.DAKSHINA - .1, { size: 150, sub: 'dakṣiṇā · the gift to the priest' });
} });

// ================= L · all three, from above: goddesses as well =================
SHOTS.push({ a: TL.L0, b: TL.M0 + .4, xf: .4, draw(c, u, t) {
  const ex = night(); havan(t, { tarpan: 1 }); const k = easeIO(clamp(u / 3));
  render3(c, W3.scene, cam3({ pos: [K[0] + .35, lerp(8.2, 7.6, k), K[2] + .35], at: [K[0] + .35, 0, K[2] + .35], fov: 46 }), { exposure: ex });
  const lab = (p, dv, en, at) => { const [x, y] = toScreen3([p[0], .1, p[2]]); if (t < at) return; glow(c, x, y, 150, '#FFB040', .3 * clamp((t - at) * 2)); textA(c, dv, x + 150, y - 22, '72px "Tiro Devanagari Sanskrit"', '#FFE2A0', t - at, ['rgba(255,150,40,.9)', 24]); textA(c, en, x + 150, y + 40, '700 30px Cinzel', '#FFF3DC', t - at - .1, ['rgba(6,4,10,.9)', 14]); };
  lab(HV.dakshinaAt, 'दक्षिणा', 'DAKSHINA', TL.L0 + .3); lab(K, 'स्वाहा', 'SWAHA', TL.L0 + .1); lab(HV.tarpanAt, 'स्वधा', 'SWADHA', TL.L0 + .5);
} });

// ================= M · next havan, tell your child =================
SHOTS.push({ a: TL.M0, b: TL.N0 + .4, xf: .4, draw(c, u, t) {
  const ex = night(); havan(t, { rise: [frac((t - TL.M0) / 2.2) * 2.2 + .01, .7, 0] });
  render3(c, W3.scene, orbit(lerp(-.4, -.7, easeIO(u / 4.4)), lerp(2.6, 3.3, u / 4.4), lerp(1.3, 1.8, u / 4.4), { atx: 0, aty: 1.3 }), { exposure: ex });
} });

// ================= N · the ask =================
SHOTS.push({ a: TL.N0, b: TL.CARD, xf: .4, draw(c, u, t) {
  const ex = night(); havan(t, { pours: [TL.YES], hold: true, gold: .25 });
  render3(c, W3.scene, close(easeIO(clamp(u / 5))), { exposure: ex });
  deva(c, 'स्वाहा', 540, 560, t, TL.SWAHA4 - .1, { size: 150 });
} });

// ================= O · the card =================
SHOTS.push({ a: TL.CARD, b: TL.END + 1, draw(c, u, t) { dealCardCine(c, u, t); } });
