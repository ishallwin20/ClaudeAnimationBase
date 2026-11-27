// jtrail.js: ad 119, the trailer for the 12 JYOTIRLINGAS series (JYOTIRLINGA_SERIES.md). "They tried to ERASE these
// temples. Again and again. And every time, they FAILED." The temple (cine3d_mandir.js, Somnath's shape) is broken twice
// and flies back together; the endless pillar of fire (Vidyeshvara 6–8); twelve pillars on India; the raiders as faceless
// shadows, their names redacted ("we will NOT say their names"); the rebuilders in gold (Kumarpal, Ahilyabai Holkar,
// Ranoji Shinde, Maharaja Ranjit Singh, Sardar Patel); three questions (the Somnath arrow, three states, the boulder);
// the title, "Episode 1: Somnath. Tonight.", the ask, the follow card. Facts used: JYOTIRLINGA_SERIES.md.
LOOK.bloom = .03; LOOK.grain = .07; LOOK.vignette = .78;
Object.assign(CAP, { font: 'Oswald', weight: 600, size: 60, maxW: 900, x: 540, gold: '#FFC65A', lit: '#FFF6E6', dim: .3 });
const CAPY = 1330;
const caps = VO.caps.filter(k => k.id !== 'roll' && k.id !== 'title');
caps.forEach((k, i) => say(i ? k.a : -1, k.b, k.text, { at: i ? k.at : k.at.map(() => -1), y: k.y ?? CAPY }));

['night2', 'evening'].forEach(n => env3(new THREE.Scene(), n, { bg: true }));
const SW = somWorld3(), TM = mandir3(SW.scene), RD = raiders3(SW.scene, 110, { at: [150, 0, 26], dir: [-1, 0, -.22], spread: [70, 34] });
const SMK = smoke3(SW.scene, 46, { at: [16, 0, 0], box: [60, 30], rise: 70, a: .75 });
const TPIL = pillar3(SW.scene, TM.at.top, { h: 900, r: 2.6, col: '#FFD27A' });
const I3 = india3(), VD = void3();
const PIL = JL.map(s => pillar3(I3.scene, I3.at(s.lon, s.lat), { h: 80, r: 2.4, col: '#FFC860' }));
const QP = ['parli', 'baijnath'].map(k => pillar3(I3.scene, I3.at(ALT[k].lon, ALT[k].lat), { h: 80, r: 2.4, col: '#9EC8FF' }));
const siteTop = (s) => { const p = I3.at(s.lon, s.lat); p[1] += 1; return p; };

// the words' times (from the voice)
const Wd = (id, word, n = 0) => { const hits = []; VO.caps.filter(c => c.id === id).forEach(c => c.text.split(/\s+/).filter(w => w && w !== '|').forEach((w, i) => { if (w.replace(/[*“”"'’.,:?!…]/g, '').toLowerCase() === word.toLowerCase()) hits.push(c.at[i]); })); if (hits[n] == null) throw new Error(`no ${word} in ${id}`); return hits[n]; };
const LN = VO.lines;
const TL = {
  AGAIN1: Wd('again', 'again'), AGAIN2: Wd('again', 'again', 1), FAILED: Wd('failed', 'failed'), L0: LN.light.a - .25, LIGHT: Wd('light', 'light'),
  M0: LN.twelve.a - .15, KEDAR: Wd('twelve', 'kedarnath'), RAMES: Wd('twelve', 'rameswaram'), D0: LN.dark.a - .2, LOOTED: Wd('dark', 'looted'), BROKE: Wd('dark', 'broke'), BURNED: Wd('dark', 'burned'),
  N0: LN.names.a - .15, NOT: Wd('names', 'not'), K0: LN.kings.a - .15, REBUILT: Wd('kings', 'rebuilt'),
  R: [LN.roll.a, 27.78, 29.13, 30.22, 31.58], S0: LN.stone.a - .1, STONE2: Wd('stone', 'stone'), F0: LN.faq.a - .15, Q1: LN.q1.a - .15, Q2: LN.q2.a - .15, Q3: LN.q3.a - .15,
  T0: LN.title.a - .15, ASK: LN.ask.a - .15, CARD: LN.ask.end + .7,
};
// the roll's names start on their words (the voice's own split of the line)
{ const rc = VO.caps.filter(c => c.id === 'roll'); rc.forEach((c, i) => TL.R[i] = c.at[0] - .05); }

// ---------- the lens and the grade ----------
const GOLDG = { sh: '#24405A', hi: '#FFB070', split: .16, contrast: 1.1 };
const NIGHTG = { sh: '#140608', hi: '#FF7A30', split: .26, contrast: 1.16 };
const BLUEG = { sh: '#10284A', hi: '#FFC080', split: .22, contrast: 1.1 };
const lens = (focus, g = GOLDG, o = {}) => ({ dof: { focus, aperture: o.ap ?? 1.1, max: 10, nearK: .6 }, bloom: { k: o.bloom ?? .06, thresh: 1.6, knee: .6, radius: 1 }, ca: .0012, rays: o.rays,
  grade: { contrast: g.contrast, sat: o.sat ?? 1.02, temp: 0, tint: 0, lift: 0, gamma: 1, gain: o.gain ?? 1, shadows: g.sh, highlights: g.hi, split: g.split } });
const shakeOf = (t, t0, k = 1) => { const u = t - t0; if (u < 0 || u > 1.2) return [0, 0, 0]; const a = k * Math.exp(-u * 4); return [vnoise(t * 30, 1) * a, vnoise(t * 33, 2) * a, vnoise(t * 29, 3) * a]; };
const add3 = (a, b) => a.map((v, i) => v + b[i]);
const reset = () => { TM.set(0, {}); RD.set(0, { on: 0 }); SMK.set(0, { on: 0 }); TPIL.set(0, 0); PIL.forEach(p => p.set(0, 0)); QP.forEach(p => p.set(0, 0)); I3.border.set(0); VD.pillar(0, 0); CAM3.far = 3000; CAM3.near = .3; };
const tCam = (o) => { CAM3.far = 3000; CAM3.near = .5; return cam3(o); };
const flashAt = (c, t, t0, a = .7, col = '#FFE2B0', d = 5) => { if (t >= t0) flash(c, a * Math.exp(-(t - t0) * d), col); };
const indiaCam = (k = 0, o = {}) => { CAM3.far = 12000; CAM3.near = 4; const c = I3.at(82, 21); return cam3({ pos: [c[0], lerp(680, 640, k) * (o.zoom || 1), c[2] + lerp(330, 300, k) * (o.zoom || 1) + 95], at: [c[0], 0, c[2] + 95], fov: 44 }); };
const duskIndia = (o = {}) => I3.mood('space', { focus: 1, sun: 1.7, hemi: .3, exposure: .9, sunAt: [-.6, .45, .5], at: I3.at(80, 21), shadow: 320, ...o });

// ================= 1 · the hook: the temple at sunset by the sea (the caption up at frame 0) =================
SHOTS.push({ a: 0, b: TL.AGAIN1, draw(c, u, t) {
  reset(); TM.set(t, { flag: 1 }); const ex = SW.mood('golden', { t });
  const k = easeOut(clamp(u / 2.2));
  render3(c, SW.scene, tCam({ pos: [lerp(104, 94, k), lerp(6, 8, k), lerp(52, 46, k)], at: [6, 24, 0], fov: 46 }), { exposure: ex, fx: lens(100) });
} });
// ================= 2 · AGAIN: night, the temple blown apart (from the south-west) =================
SHOTS.push({ a: TL.AGAIN1, b: TL.AGAIN2, draw(c, u, t) {
  reset(); const b = easeOut(seg(t, TL.AGAIN1 + .05, TL.AGAIN1 + 1.4)) * .7; TM.set(t, { brk: b, dustCol: '#5A3A28' }); SMK.set(t, { on: 1, col: '#2A1810' });
  const ex = SW.mood('night', { t, fireAt: [24, 6, 40], fire: 1800 });
  render3(c, SW.scene, tCam({ pos: add3([-46, 5, 66], shakeOf(t, TL.AGAIN1, 1.2)), at: [8, 20, 0], fov: 50 }), { exposure: ex, fx: lens(80, NIGHTG) });
  flashAt(c, t, TL.AGAIN1, .9, '#FFB070', 6);
} });
// ================= 3 · AND AGAIN: the spire's top blown off (from the north-east, close) =================
SHOTS.push({ a: TL.AGAIN2, b: LN.failed.a - .05, draw(c, u, t) {
  reset(); const b = easeOut(seg(t, TL.AGAIN2 + .05, TL.AGAIN2 + 1.2)) * .55; TM.set(t, { brk: b, dustCol: '#5A3A28' }); SMK.set(t, { on: 1, col: '#2A1810' });
  const ex = SW.mood('night', { t, fireAt: [30, 8, -30], fire: 1600 });
  render3(c, SW.scene, tCam({ pos: add3([44, 26, -58], shakeOf(t, TL.AGAIN2, 1)), at: [0, 34, 0], fov: 46 }), { exposure: ex, fx: lens(72, NIGHTG) });
  flashAt(c, t, TL.AGAIN2, .9, '#FF9050', 6);
} });
// ================= 4 · every time, they FAILED: gold light, the rubble flies back together =================
SHOTS.push({ a: LN.failed.a - .05, b: TL.L0 + .3, draw(c, u, t) {
  reset(); const b = 1 - easeIO(seg(t, LN.failed.a + .1, TL.FAILED + .05)); TM.set(t, { brk: b, mode: 'build', dust: .5, flag: 1 });
  const ex = SW.mood('golden', { t }); const k = easeIO(clamp(u / 2.6));
  render3(c, SW.scene, tCam({ pos: [lerp(70, 98, k), lerp(4, 11, k), lerp(46, 60, k)], at: [14, lerp(10, 24, k), 0], fov: 48 }), { exposure: ex, fx: lens(100) });
  flashAt(c, t, TL.FAILED, .55, '#FFD890', 3);
} });
// ================= 5 · the endless pillar of light =================
SHOTS.push({ a: TL.L0, b: TL.M0 + .4, xf: .3, draw(c, u, t) {
  reset(); CAM3.far = 12000; const k = easeOut(seg(t, TL.L0 + .2, TL.L0 + 1.1)); VD.pillar(t, k);
  VD.at(VD.brahma, [-26, 400 + 260 * u, 6], [0, 9, 0]); VD.at(VD.vishnu, [26, -400 - 260 * u, 6], [0, -9, 0]);
  const y = lerp(-40, 120, easeIO(clamp(u / 4)));
  render3(c, VD.scene, cam3({ pos: [lerp(-14, 10, u / 4), y, lerp(110, 64, easeIO(clamp(u / 4)))], at: [0, y + 40, 0], fov: 58 }), { exposure: 1 });
  flashAt(c, t, TL.LIGHT, .4, '#FFD890', 3);
} });
// ================= 6 · twelve pillars on India; Kedarnath, Rameswaram =================
SHOTS.push({ a: TL.M0, b: TL.D0 + .3, xf: .4, draw(c, u, t) {
  reset(); const ex = duskIndia(); I3.border.set(1, 2.4, .55);
  JL.forEach((s, i) => PIL[i].set(t, seg(t, TL.M0 + .2 + i * .1, TL.M0 + .7 + i * .1)));
  render3(c, I3.scene, indiaCam(clamp(u / 5)), { exposure: ex });
  const n = JL.filter((s, i) => t >= TL.M0 + .2 + i * .1).length, fo = 1 - seg(t, TL.KEDAR - .5, TL.KEDAR - .1);
  if (n && fo > 0) text(c, n + ' / 12', 540, 500, '700 64px Cinzel', '#FFF3DC', { glow: ['rgba(6,6,14,.9)', 18], spacing: 3, alpha: fo });
  siteLabel(c, JL[4], siteTop(JL[4]), t, TL.KEDAR - .1, { big: 1.3 });
  siteLabel(c, JL[10], siteTop(JL[10]), t, TL.RAMES - .1, { big: 1.3 });
} });
// ================= 7 · raiders came: faceless shadows with torches, walking on the temple at night =================
SHOTS.push({ a: TL.D0, b: TL.BROKE - .1, draw(c, u, t) {
  reset(); TM.set(t, {}); RD.set(t, { on: 1, walk: 6 + u * 3.2 }); SMK.set(t, { on: .5, col: '#2A1810' });
  const ex = SW.mood('night', { t, fireAt: [96, 6, 22], fire: 1300, fog: .008 });
  const k = easeIO(clamp(u / 3));
  render3(c, SW.scene, tCam({ pos: [lerp(236, 226, k), 2.4, lerp(52, 47, k)], at: [20, 18, 0], fov: 36 }), { exposure: ex, fx: lens(90, NIGHTG, { ap: .7 }) });
  jTag(c, t, TL.LOOTED - .1, TL.BROKE - .1, 'GOLD · LOOTED', 120, 520, { col: '#C8281E' });
} });
// ================= 8 · they BROKE the lingas: the temple blown apart, close =================
SHOTS.push({ a: TL.BROKE - .1, b: TL.BURNED - .05, draw(c, u, t) {
  reset(); const b = easeOut(seg(t, TL.BROKE, TL.BROKE + 1.3)) * .9; TM.set(t, { brk: b, dustCol: '#4A3022' }); SMK.set(t, { on: 1, col: '#22140C' });
  const ex = SW.mood('night', { t, fireAt: [40, 8, 30], fire: 1800 });
  render3(c, SW.scene, tCam({ pos: add3([62, 9, 44], shakeOf(t, TL.BROKE, 1.4)), at: [6, 18, 0], fov: 50 }), { exposure: ex, fx: lens(70, NIGHTG) });
  flashAt(c, t, TL.BROKE, .9, '#FF9A50', 5);
} });
// ================= 9 · they BURNED the halls: the ruin in smoke and firelight =================
SHOTS.push({ a: TL.BURNED - .05, b: TL.N0 + .3, draw(c, u, t) {
  reset(); TM.set(t, { brk: 1, keep: 7, dust: 0, fire: 1 }); SMK.set(t, { on: 1, col: '#1A0E08', speed: 1.4 });
  const ex = SW.mood('night', { t, fireAt: [20 + 6 * Math.sin(t * 9), 5, 10], fire: 2200 + 500 * Math.sin(t * 13), fog: .009 });
  const k = easeIO(clamp(u / 1.8));
  render3(c, SW.scene, tCam({ pos: [lerp(70, 58, k), lerp(14, 11, k), lerp(-56, -46, k)], at: [18, 6, 0], fov: 48 }), { exposure: ex, fx: lens(60, NIGHTG) });
} });
// ================= 10 · we will NOT say their names: the shadows, the redacted records; they dissolve =================
SHOTS.push({ a: TL.N0, b: TL.K0 + .3, xf: .25, draw(c, u, t) {
  reset(); TM.set(t, { brk: 1, keep: 7, dust: 0, fire: .8 }); SMK.set(t, { on: 1, col: '#120A06' });
  RD.set(t, { on: 1, walk: 70 + u * 1.2, fade: seg(t, TL.NOT + .2, TL.K0 + .2) });
  const ex = SW.mood('night', { t, fireAt: [40, 6, 10], fire: 1600, fog: .01 });
  render3(c, SW.scene, tCam({ pos: [lerp(118, 112, u / 3), 1.6, 30], at: [70, 3.2, 14], fov: 38 }), { exposure: ex, fx: lens(40, NIGHTG, { ap: 1.4 }) });
  redact(c, t, TL.N0 + .15, TL.K0 + .2, '1026', 'SOMNATH', 560);
  redact(c, t, TL.N0 + .55, TL.K0 + .2, '1234', 'MAHAKAL', 700);
  redact(c, t, TL.N0 + .95, TL.K0 + .2, '1669', 'KASHI VISHWANATH', 840);
} });
// ================= 11 · we will name the ones who REBUILT them: dawn gold on the rubble, the stones begin to rise =================
SHOTS.push({ a: TL.K0, b: TL.R[0] - .05, xf: .3, draw(c, u, t) {
  reset(); const b = 1 - .22 * easeIO(seg(t, TL.REBUILT - .4, TL.R[0])); TM.set(t, { brk: b, mode: 'build', dust: .4 });
  const ex = SW.mood('golden', { t }); const k = easeIO(clamp(u / 2.2));
  render3(c, SW.scene, tCam({ pos: [lerp(46, 40, k), lerp(3, 4, k), lerp(30, 26, k)], at: [10, 4, 0], fov: 48 }), { exposure: ex, fx: lens(34) });
  flashAt(c, t, TL.REBUILT, .4, '#FFD890', 3);
} });
// ================= 12 · the roll: the names in gold as the temple rises course by course =================
const ROLL = [['KUMARPAL', 'SOMNATH · 1169'], ['AHILYABAI HOLKAR', 'KASHI VISHWANATH · 1780'], ['RANOJI SHINDE', 'MAHAKAL · 1730s'], ['MAHARAJA RANJIT SINGH', "KASHI VISHWANATH'S GOLD · 1835"], ['SARDAR PATEL', 'SOMNATH · 1947']];
SHOTS.push({ a: TL.R[0] - .05, b: TL.S0, draw(c, u, t) {
  reset(); const b = .78 * (1 - easeIO(seg(t, TL.R[0], TL.S0 + .2))) + .12; TM.set(t, { brk: b, mode: 'build', dust: .3, flag: 1 });
  const ex = SW.mood('golden', { t }); const a = lerp(.9, -.35, easeIO(clamp(u / (TL.S0 - TL.R[0])))), R0 = 96;
  render3(c, SW.scene, tCam({ pos: [14 + Math.cos(a) * R0, lerp(8, 14, u / 6), Math.sin(a) * R0], at: [14, 18, 0], fov: 46 }), { exposure: ex, fx: lens(R0) });
  ROLL.forEach(([nm, sub], i) => goldName(c, t, TL.R[i], (TL.R[i + 1] ?? TL.S0) - .02, nm, sub, 760));
} });
// ================= 13 · stone by STONE: the last courses land on the spire, the kalasha, the flag =================
SHOTS.push({ a: TL.S0, b: TL.F0 + .3, draw(c, u, t) {
  reset(); const b = .12 * (1 - easeIO(seg(t, TL.S0, TL.STONE2 + .15))); TM.set(t, { brk: b, mode: 'build', dust: .2, flag: 1 });
  const ex = SW.mood('golden', { t }); const k = easeIO(clamp(u / 2));
  render3(c, SW.scene, tCam({ pos: [lerp(24, 30, k), lerp(40, 44, k), lerp(26, 32, k)], at: [0, lerp(41, 44, k), 0], fov: 44 }), { exposure: ex, fx: lens(36, GOLDG, { ap: 1.4 }) });
  flashAt(c, t, TL.STONE2 + .1, .35, '#FFD890', 3);
} });
// ================= 14 · the questions nobody answers: the temple at blue hour =================
SHOTS.push({ a: TL.F0, b: TL.Q1 + .3, xf: .3, draw(c, u, t) {
  reset(); TM.set(t, { flag: .8 }); const ex = SW.mood('blue', { t, exposure: 1.1 });
  const a = lerp(.25, .05, u / 2.4), R0 = 120;
  render3(c, SW.scene, tCam({ pos: [14 + Math.cos(a) * R0, 5, Math.sin(a) * R0 + 10], at: [14, 22, 0], fov: 44 }), { exposure: ex, fx: lens(R0, BLUEG) });
} });
// ================= 15 · Q1: the arrow at Somnath, pointing south over the sea =================
SHOTS.push({ a: TL.Q1, b: TL.Q2 + .3, xf: .3, draw(c, u, t) {
  reset(); TM.set(t, { flag: 1 }); const ex = SW.mood('golden', { t });
  const tip = SW.stambh.tip, k = easeIO(clamp(u / 3.2));
  render3(c, SW.scene, tCam({ pos: [tip[0] + lerp(1.5, 1.2, k), tip[1] + lerp(2.4, 1.9, k), tip[2] - lerp(10, 8.2, k)], at: [tip[0] - .35, tip[1] - 1.6, tip[2] + 5], fov: 44 }), { exposure: ex, fx: lens(lerp(9.5, 7.8, k), GOLDG, { ap: 1.1 }) });
  // the line of the arrow, out over the sea to the horizon
  const d = easeOut(seg(t, TL.Q1 + .6, TL.Q1 + 2)); if (d > 0) {
    const [x0, y0] = toScreen3([tip[0], tip[1], tip[2] + .4]), [x1, y1] = toScreen3([tip[0], tip[1] - 3, tip[2] + 3000]);
    c.save(); c.strokeStyle = 'rgba(255,214,130,.9)'; c.lineWidth = 4; c.setLineDash([18, 14]); c.lineDashOffset = -t * 60; c.shadowColor = 'rgba(255,190,90,.8)'; c.shadowBlur = 12;
    c.beginPath(); c.moveTo(x0, y0); c.lineTo(lerp(x0, x1, d), lerp(y0, y1, d)); c.stroke(); c.restore();
  }
  jTag(c, t, TL.Q1 + .3, TL.Q2 + .2, 'BAAN STAMBH · SOMNATH', 120, 520);
} });
// ================= 16 · Q2: three claimants for one Jyotirlinga =================
SHOTS.push({ a: TL.Q2, b: TL.Q3 + .3, xf: .3, draw(c, u, t) {
  reset(); const ex = duskIndia(); I3.border.set(1, 2.4, .55);
  JL.forEach((s, i) => PIL[i].set(t, i === 8 ? 0 : .25));
  const fl = (a) => .55 + .45 * Math.abs(Math.sin(t * 5 + a));
  const on = (i) => seg(t, TL.Q2 + .3 + i * .35, TL.Q2 + .7 + i * .35);
  const P3 = [PIL[8], QP[0], QP[1]], S3 = [JL[8], ALT.parli, ALT.baijnath];
  P3.forEach((p, i) => p.set(t, on(i) * fl(i)));
  render3(c, I3.scene, indiaCam(.4), { exposure: ex });
  S3.forEach((s, i) => { if (on(i) > 0) pin3(c, '?', siteTop(s), t, TL.Q2 + .3 + i * .35, { size: 70, dy: -70, col: '#BFE0FF' }); });
} });
// ================= 17 · Q3: the boulder (Kedarnath, 2013) =================
SHOTS.push({ a: TL.Q3, b: TL.T0 + .3, xf: .3, draw(c, u, t) {
  reset(); CAM3.far = 12000; CAM3.near = 1; const s = JL[4], p = I3.at(s.lon, s.lat), ex = I3.mood('golden', { at: p, shadow: 80, sunAt: [-.7, .35, .55], fogNear: 70, fogFar: 260 }); I3.set(t, { clouds: .35 });
  PIL[4].set(t, 1); const k = easeIO(clamp(u / 2.6));
  render3(c, I3.scene, cam3({ pos: [p[0] + lerp(-30, -18, k), lerp(26, 18, k), p[2] + lerp(80, 56, k)], at: [p[0] + 4, 6, p[2] - 10], fov: 50 }), { exposure: ex });
  pin3(c, '2013', siteTop(s), t, TL.Q3 + .5, { size: 64, dy: -130, col: '#FFE2A0', spacing: 6 });
} });
// ================= 18 · the title: night, a pillar of light from Somnath's spire into the sky =================
SHOTS.push({ a: TL.T0, b: TL.ASK + .3, xf: .2, draw(c, u, t) {
  reset(); TM.set(t, { flag: 1 }); TPIL.set(t, easeOut(seg(t, TL.T0, TL.T0 + 1.2)));
  const ex = SW.mood('night', { t, fire: 700, fireAt: [40, 20, 30], fogCol: '#06060C', fog: .002, envK: .35, bgK: .22 });
  const k = easeIO(clamp(u / 4.5));
  render3(c, SW.scene, tCam({ pos: [lerp(150, 130, k), lerp(3, 6, k), lerp(70, 60, k)], at: [10, lerp(40, 60, k), 0], fov: 52 }), { exposure: ex * 1.15, fx: lens(140, BLUEG, { bloom: .1 }) });
  flashAt(c, t, TL.T0 + .1, .5, '#FFE2B0', 2.5);
  { const g = c.createRadialGradient(540, 700, 40, 540, 700, 520); g.addColorStop(0, 'rgba(0,0,0,.55)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, 200, W, 1000); }
  jTitle(c, t, TL.T0 + .1, 640);
  if (t > TL.T0 + 1.4) text(c, 'EPISODE 1 · SOMNATH', 540, 1060, '700 50px "Space Mono"', '#FFFFFF', { pop: t - TL.T0 - 1.4, spacing: 4, glow: ['rgba(0,0,0,.9)', 16] });
  sticker(c, t, TL.T0 + 2.4, 'TONIGHT', 540, 1190);
} });
// ================= 19 · the ask: all twelve shining =================
SHOTS.push({ a: TL.ASK, b: TL.CARD, xf: .3, draw(c, u, t) {
  reset(); const ex = duskIndia({ exposure: .95 }); I3.border.set(1, 2.4, .6); PIL.forEach(p => p.set(t, 1));
  render3(c, I3.scene, indiaCam(1 - clamp(u / 4) * .5), { exposure: ex });
} });
// ================= 20 · the card =================
SHOTS.push({ a: TL.CARD, b: PROJECT.duration + 1, xf: .3, draw(c, u, t) { trailerCard(c, u, t); } });
