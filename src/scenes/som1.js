// som1.js: ad 120, 12 JYOTIRLINGAS Episode 1: Somnath I (JYOTIRLINGA_SERIES.md). "This temple was BROKEN FIVE times.
// And it's still STANDING." The ident; the story (Kotirudra 14): Daksha's 27 daughters as the nakshatras, the Moon who
// loved only Rohini, the curse, Chandra's six months of the Mrityunjaya mantra at Prabhasa, Shiva's pillar, the
// fortnights, the temple rising round the linga; the look (Maru-Gurjara, Kailash Mahameru Prasad, the halls, the arrow);
// the dark (five years, five redacted names); the light (Mularaja, Kumarpal, Mahipala; Ahilyabai Holkar's portrait and
// her works on the map; Sardar Patel's portrait and the princely states; Gandhi, Nehru's letter, Rajendra Prasad; 11 May
// 1951); the myth bust (17 was his campaigns); the ask; next; the series card. Facts used: STORYBOARD.md.
LOOK.bloom = .03; LOOK.grain = .07; LOOK.vignette = .78;
Object.assign(CAP, { font: 'Oswald', weight: 600, size: 60, maxW: 900, x: 540, gold: '#FFC65A', lit: '#FFF6E6', dim: .3 });
const CAPY = 1330;
const caps = VO.caps.filter(k => k.id !== 'years');
caps.forEach((k, i) => say(i ? k.a : -1, k.b, k.text, { at: i ? k.at : k.at.map(() => -1), y: k.y ?? CAPY }));
PICS.ashCover = Object.assign(new Image(), { src: 'assets/rk/ashwatthama_cover.jpg' });

['night2', 'evening'].forEach(n => env3(new THREE.Scene(), n, { bg: true }));
const SW = somWorld3(), TM = mandir3(SW.scene), RD = raiders3(SW.scene, 110, { at: [150, 0, 26], dir: [-1, 0, -.22], spread: [70, 34] });
const TM2 = mandir3(SW.scene, { seed: 9 }); TM2.scale.setScalar(.4); TM2.position.set(-46, 0, -52);
const SMK = smoke3(SW.scene, 46, { at: [16, 0, 0], box: [60, 30], rise: 70, a: .75 });
const TPIL = pillar3(SW.scene, TM.at.top, { h: 900, r: 2.6, col: '#FFD27A' });
const SEANRM = SW.sea.material.normalMap;
const ST = story3(SEANRM), SWM = phaseMoon3(SW.scene, ST.moonTex, [0, 400, 0], 60);
const I3 = india3();
const PIL = JL.map(s => pillar3(I3.scene, I3.at(s.lon, s.lat), { h: 80, r: 2.4, col: '#FFC860' }));
const AHP = AHW.map(s => pillar3(I3.scene, I3.at(s.lon, s.lat), { h: 34, r: 1.4, col: '#FFC860' }));
const DOTS = princelyDots(560);
const siteTop = (s) => { const p = I3.at(s.lon, s.lat); p[1] += 1; return p; };

// ---------- the lens and the grade (as the trailer) ----------
const GOLDG = { sh: '#24405A', hi: '#FFB070', split: .16, contrast: 1.1 };
const NIGHTG = { sh: '#140608', hi: '#FF7A30', split: .26, contrast: 1.16 };
const BLUEG = { sh: '#10284A', hi: '#FFC080', split: .22, contrast: 1.1 };
const MOONG = { sh: '#0A1A3A', hi: '#C8D8FF', split: .2, contrast: 1.08 };
const lens = (focus, g = GOLDG, o = {}) => ({ dof: { focus, aperture: o.ap ?? 1.1, max: 10, nearK: .6 }, bloom: { k: o.bloom ?? .06, thresh: 1.6, knee: .6, radius: 1 }, ca: .0012, rays: o.rays,
  grade: { contrast: g.contrast, sat: o.sat ?? 1.02, temp: 0, tint: 0, lift: 0, gamma: 1, gain: o.gain ?? 1, shadows: g.sh, highlights: g.hi, split: g.split } });
const shakeOf = (t, t0, k = 1) => { const u = t - t0; if (u < 0 || u > 1.2) return [0, 0, 0]; const a = k * Math.exp(-u * 4); return [vnoise(t * 30, 1) * a, vnoise(t * 33, 2) * a, vnoise(t * 29, 3) * a]; };
const add3 = (a, b) => a.map((v, i) => v + b[i]);
const reset = () => {
  TM.set(0, {}); TM2.visible = false; RD.set(0, { on: 0 }); SMK.set(0, { on: 0 }); TPIL.set(0, 0); SWM.set(0);
  PIL.forEach(p => p.set(0, 0)); AHP.forEach(p => p.set(0, 0)); I3.border.set(0); CAM3.far = 3000; CAM3.near = .3;
};
const tCam = (o) => { CAM3.far = 3000; CAM3.near = .5; return cam3(o); };
const flashAt = (c, t, t0, a = .7, col = '#FFE2B0', d = 5) => { if (t >= t0) flash(c, a * Math.exp(-(t - t0) * d), col); };
const indiaCam = (k = 0, o = {}) => { CAM3.far = 12000; CAM3.near = 4; const c = I3.at(o.lon ?? 80, o.lat ?? 21); return cam3({ pos: [c[0], lerp(680, 640, k) * (o.zoom || 1), c[2] + lerp(330, 300, k) * (o.zoom || 1) + 95], at: [c[0], 0, c[2] + 95], fov: 44 }); };
const duskIndia = (o = {}) => I3.mood('space', { focus: 1, sun: 1.7, hemi: .3, exposure: .9, sunAt: [-.6, .45, .5], at: I3.at(80, 21), shadow: 320, ...o });
// the moon in the Somnath sky, placed behind the camera's target (so it sits in frame), lifted by up metres
const moonOver = (pos, at, up = 0, side = 0, d = 700) => { const v = V3(at[0] - pos[0], 0, at[2] - pos[2]).normalize(); SWM.position.set(at[0] + v.x * d - v.z * side, at[1] + up, at[2] + v.z * d + v.x * side); };
// a label with a leader to a world point: a dot on the point, a line out to a mono tag
function callout(c, t, t0, t1, txt, p, dx, dy, o = {}) {
  if (t < t0 || t > t1) return; const [x, y, z] = toScreen3(p); if (z > 1) return;
  const k = easeOut(seg(t, t0, t0 + .25)), vis = 1 - seg(t, t1 - .2, t1);
  c.save(); c.globalAlpha = vis; c.strokeStyle = 'rgba(255,226,160,.85)'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(x, y); c.lineTo(x + dx * k, y + dy * k); c.stroke();
  c.fillStyle = '#FFE2A0'; c.beginPath(); c.arc(x, y, 7, 0, TAU); c.fill(); c.restore();
  if (k > .9) jTag(c, t, t0 + .22, t1, txt, x + dx + (dx < 0 ? 0 : 0), y + dy, { align: dx < 0 ? 'right' : 'left', size: o.size ?? 26, col: o.col });
}

// ================= 1 · the hook: Somnath at sunset by the sea (the caption up at frame 0) =================
SHOTS.push({ a: 0, b: TL.STAND, draw(c, u, t) {
  reset(); TM.set(t, { flag: 1 }); const ex = SW.mood('golden', { t });
  const k = easeOut(clamp(u / 2.4));
  render3(c, SW.scene, tCam({ pos: [lerp(104, 94, k), lerp(6, 8, k), lerp(52, 46, k)], at: [6, 24, 0], fov: 46 }), { exposure: ex, fx: lens(100) });
} });
// ================= 2 · still STANDING: low under the spire, the flag in the wind =================
SHOTS.push({ a: TL.STAND, b: TL.ID0, draw(c, u, t) {
  reset(); TM.set(t, { flag: 1 }); const ex = SW.mood('golden', { t }); const k = easeIO(clamp(u / 1.5));
  render3(c, SW.scene, tCam({ pos: [lerp(36, 32, k), 2, lerp(-30, -24, k)], at: [0, lerp(30, 42, k), 0], fov: 50 }), { exposure: ex, fx: lens(44, GOLDG, { ap: .8 }) });
} });
// ================= 3 · the ident: a pillar of light strikes Gujarat's coast =================
SHOTS.push({ a: TL.ID0, b: TL.S0 + .3, xf: .15, draw(c, u, t) {
  reset(); const ex = duskIndia(); I3.border.set(1, 2.4, .55);
  PIL.forEach((p, i) => p.set(t, i ? .18 : easeOut(seg(t, TL.ID0, TL.ID0 + .35))));
  render3(c, I3.scene, indiaCam(clamp(u / 2), { lon: 76, lat: 21, zoom: .8 }), { exposure: ex });
  flashAt(c, t, TL.ID0 + .05, .55, '#FFE2B0', 4);
  text(c, 'JYOTIRLINGA', 540, 1150, '700 44px "Space Mono"', '#FFF3DC', { pop: t - TL.ID0 - .1, spacing: 10, glow: ['rgba(6,6,14,.9)', 18] });
  text(c, '1 / 12', 540, 1250, '700 96px Cinzel', '#FFC65A', { pop: t - TL.ID0 - .2, spacing: 6, glow: ['rgba(255,160,60,.5)', 30] });
  siteLabel(c, JL[0], siteTop(JL[0]), t, TL.ID0 + .3, { big: 1.5, dx: 40, dy: 40 });
} });

// ================= 4 · Daksha's 27 daughters: the nakshatras light along the moon's path =================
const storyCam = (pos, at, fov = 50) => { CAM3.far = 6000; CAM3.near = .3; return cam3({ pos, at, fov }); };
const STORY = (c, u, t) => cornerTag(c, t, TL.S0 + .2, TL.LK0 - .1, 'SHIVA PURANA · KOTIRUDRA 14');
SHOTS.push({ a: TL.S0, b: TL.ROH0, xf: .3, draw(c, u, t) {
  reset(); ST.set({ t, naks: easeIO(seg(t, TL.N27 - .4, TL.MOON + .3)), moon: [1, 1, 1, 0, 150], chandra: 0, lamp: 0 });
  const k = easeIO(clamp(u / 2.8));
  render3(c, ST.scene, storyCam([0, lerp(1.6, 2.2, k), -12], [0, lerp(300, 560, k), 1300], 52), { exposure: 1.05, fx: lens(1400, MOONG, { ap: .4, bloom: .1 }) });
  const n = Math.round(27 * easeIO(seg(t, TL.N27 - .4, TL.MOON + .3)));
  if (n) text(c, String(n), 540, 520, '700 90px Cinzel', '#E8EEFF', { glow: ['rgba(120,150,255,.6)', 26], alpha: 1 - seg(t, TL.ROH0 - .4, TL.ROH0) });
  if (n) text(c, 'NAKSHATRAS · DAKSHA\'S DAUGHTERS', 540, 590, '700 26px "Space Mono"', '#C8D4FF', { spacing: 3, alpha: 1 - seg(t, TL.ROH0 - .4, TL.ROH0) });
  STORY(c, u, t);
} });
// ================= 5 · he loved only Rohini: she blazes, the others dim; the camera closes on the two =================
SHOTS.push({ a: TL.ROH0, b: TL.CURSE0, draw(c, u, t) {
  reset(); const r = easeIO(seg(t, TL.ROHINI - .3, TL.ROHINI + .5));
  ST.set({ t, naks: 1, roh: r, dim: r, moon: [1, 1, 1, 0, 150], chandra: 0, lamp: 0 });
  const k = easeIO(clamp(u / 3.4)), R = ST.naks[ST.ROH].p, M = ST.MPOS, at = [lerp(M[0], (M[0] + R[0]) / 2, k), lerp(M[1], (M[1] + R[1]) / 2, k), lerp(M[2], (M[2] + R[2]) / 2, k)];
  render3(c, ST.scene, storyCam([0, 1.8, -12], at, lerp(46, 30, k)), { exposure: 1.05, fx: lens(1400, MOONG, { ap: .4, bloom: .12 }) });
  pin3(c, 'ROHINI', R, t, TL.ROHINI, { size: 40, dy: -60, col: '#FFC890', spacing: 6 });
  STORY(c, u, t);
} });
// ================= 6 · the curse: a red flare through the 26; at WASTE AWAY the moon wastes to a sliver =================
SHOTS.push({ a: TL.CURSE0, b: TL.PR0, draw(c, u, t) {
  reset(); const red = Math.exp(-Math.max(0, t - TL.CURSED) * 1.6) * (t > TL.CURSED ? 1 : 0), w = easeIO(seg(t, TL.WASTE - .05, TL.WASTE + 1.4));
  ST.set({ t, naks: 1, roh: 1 - w * .6, dim: .8, red, moon: [1, lerp(1, .05, w), -1, w, 150], chandra: 0, lamp: 0 });
  const R = ST.naks[ST.ROH].p, M = ST.MPOS, at = [(M[0] + R[0]) / 2, (M[1] + R[1]) / 2, (M[2] + R[2]) / 2];
  render3(c, ST.scene, storyCam(add3([0, 1.8, -12], shakeOf(t, TL.CURSED, .08)), at, lerp(30, 34, clamp(u / 2.5))), { exposure: 1.05, fx: lens(1400, MOONG, { ap: .4, bloom: .12 }) });
  if (t > TL.CURSED) flash(c, .45 * Math.exp(-(t - TL.CURSED) * 3), '#FF3A20');
  if (t > TL.WASTE) flash(c, .25 * Math.exp(-(t - TL.WASTE) * 3), '#8A1A10');
  pin3(c, 'KSHAYA · THE WASTING', M, t, TL.WASTE + .3, { size: 30, dy: 150, col: '#FF9A86', font: '700 30px "Space Mono"', spacing: 3 });
  STORY(c, u, t);
} });
// ================= 7 · Prabhasa by the sea: Chandra before the earthen linga; six months of the mantra =================
SHOTS.push({ a: TL.PR0, b: TL.BOON0, xf: .35, draw(c, u, t) {
  reset(); const tl = easeIO(seg(t, TL.SIX - .3, TL.BOON0)), ch = seg(t, TL.CHANT - .2, TL.CHANT + .6);
  ST.set({ t, naks: 1, dim: .7, moon: [1, .05, -1, .85, 150], chant: ch, wheel: tl * 2.2 });
  const k = easeIO(clamp(u / 3)), L = ST.LP;
  const kd = easeIO(clamp(u / 1.8));
  render3(c, ST.scene, storyCam([lerp(3.4, 4.4, k), lerp(4, 1.8, kd), lerp(-6, -3, k)], [lerp(-.6, -1.1, k), lerp(40, -.4, kd), lerp(120, 9, kd)], 46), { exposure: 1.1, fx: lens(9, MOONG, { ap: .7 }) });
  text(c, 'PRABHASA', 540, 548, '700 60px Cinzel', '#E8EEFF', { pop: t - TL.PRABHASA + .1, spacing: 12, glow: ['rgba(80,110,220,.6)', 24] });
  if (t > TL.SIX - .2) { const d = Math.max(1, Math.round(180 * tl)); jTag(c, t, TL.SIX - .2, TL.BOON0 + .2, `DAY ${d} / 180`, 540, 1080, { align: 'center', size: 34, col: '#9EB8FF' }); }
  STORY(c, u, t);
} });
// ================= 8 · Shiva appeared: the pillar from the linga; the moon healed, waning and waxing by fortnight =================
SHOTS.push({ a: TL.BOON0, b: TL.ST0 + .3, draw(c, u, t) {
  reset(); const p = easeOut(seg(t, TL.BOON0 + .05, TL.BOON0 + .6));
  const wa = easeIO(seg(t, TL.WANE, TL.GROW - .1)), gr = easeIO(seg(t, TL.GROW, TL.ST0 + .2));
  const f = t < TL.GROW ? lerp(1, .03, wa) : lerp(.03, 1, gr), side = t < TL.GROW ? -1 : 1;
  ST.set({ t, naks: 1, dim: .5, moon: [1, f, side, 0, 130], chant: 1 - p, pillar: p });
  const k = easeIO(clamp(u / 3.6));
  render3(c, ST.scene, storyCam([lerp(2.5, 4, k), lerp(1.6, 3, k), lerp(-30, -60, k)], [lerp(-1.9, -1, k), lerp(14, 340, k), lerp(6, 760, k)], 52), { exposure: 1.05, fx: lens(60, BLUEG, { ap: .3, bloom: .14 }) });
  flashAt(c, t, TL.BOON0 + .05, .8, '#FFEAC0', 2.6);
  jTag(c, t, TL.WANE, TL.GROW - .05, '15 DAYS · WANE', 540, 1080, { align: 'center', size: 32, col: '#9EB8FF' });
  jTag(c, t, TL.GROW, TL.ST0 + .3, '15 DAYS · WAX', 540, 1080, { align: 'center', size: 32, col: '#FFC65A' });
  STORY(c, u, t);
} });
// ================= 9 · Shiva stayed: the temple rises round the light; the crescent over the spire =================
SHOTS.push({ a: TL.ST0, b: TL.LK0 + .3, xf: .3, draw(c, u, t) {
  reset(); const b = 1 - easeIO(seg(t, TL.ST0 + .1, TL.SOMNATH + .3)); TM.set(t, { brk: b, mode: 'build', dust: .3, flag: .8 });
  const ex = SW.mood('night', { t, fire: 900, fireAt: [30, 40, 40], sun: .7, hemi: .2, fog: .003, fogCol: '#0A1428', envK: .5, bgK: .6 }); SW.fill.color.set('#FFE0B0'); SW.fill.intensity = 650; TPIL.set(t, .6 * (1 - seg(t, TL.SOMNATH, TL.LK0)));
  const k = easeIO(clamp(u / 3.4)), pos = [lerp(120, 104, k), lerp(4, 7, k), lerp(64, 54, k)], at = [8, lerp(30, 36, k), 0];
  moonOver(pos, at, 230, 60); SWM.set(1, .22, 1, 0, 70);
  render3(c, SW.scene, tCam({ pos, at, fov: 48 }), { exposure: ex * 1.2, fx: lens(120, MOONG, { bloom: .1 }) });
  if (t > TL.SOMNATH - .1) {
    text(c, 'सोमनाथ', 540, 1060, '96px "Tiro Devanagari Sanskrit"', '#FFC65A', { pop: t - TL.SOMNATH + .1, glow: ['rgba(255,160,60,.55)', 28] });
    text(c, 'SOMA = THE MOON · NATHA = LORD', 540, 1160, '700 32px "Space Mono"', '#FFF3DC', { pop: t - TL.SOMNATH - .2, spacing: 2, glow: ['rgba(6,6,14,.9)', 16] });
  }
  STORY(c, u, t);
} });

// ================= 10 · the look: an orbit at sunset, then low along the halls, with labels =================
const LOOKT = (c, t) => cornerTag(c, t, TL.LK0 + .1, TL.RD0, 'TODAY · VERAVAL, GUJARAT', JCOL.teal);
SHOTS.push({ a: TL.LK0, b: TL.MARU + 1.4, xf: .25, draw(c, u, t) {
  reset(); TM.set(t, { flag: 1 }); const ex = SW.mood('golden', { t });
  const a = lerp(-.55, -.15, easeIO(clamp(u / 3.2))), R0 = 92;
  render3(c, SW.scene, tCam({ pos: [14 + Math.cos(a) * R0, 12, Math.sin(a) * R0], at: [14, 20, 0], fov: 46 }), { exposure: ex, fx: lens(R0) });
  jTag(c, t, TL.MARU - .1, TL.MARU + 1.4, 'MARU-GURJARA · CHAULUKYA STYLE', 540, 560, { align: 'center', size: 30 });
  callout(c, t, TL.MARU + .3, TL.MARU + 1.4, 'KAILASH MAHAMERU PRASAD', TM.at.kalash, 60, 200);
  LOOKT(c, t);
} });
SHOTS.push({ a: TL.MARU + 1.4, b: TL.AR0, draw(c, u, t) {
  reset(); TM.set(t, { flag: 1 }); const ex = SW.mood('golden', { t }); const k = easeIO(clamp(u / 2.2));
  render3(c, SW.scene, tCam({ pos: [lerp(78, 62, k), lerp(5, 4, k), lerp(34, 30, k)], at: [lerp(20, 4, k), lerp(10, 14, k), 0], fov: 50 }), { exposure: ex, fx: lens(48, GOLDG, { ap: .8 }) });
  const d = TL.AR0 - (TL.MARU + 1.4), t0 = TL.MARU + 1.4;
  callout(c, t, t0 + .05, TL.AR0 + .1, 'NRITYA MANDAPA', TM.at.nritya, -40, -110);
  callout(c, t, t0 + d * .3, TL.AR0 + .1, 'SABHA MANDAPA', TM.at.mandapa, -60, -170);
  callout(c, t, t0 + d * .6, TL.AR0 + .1, 'THE SANCTUM', [0, TM.at.JY + 8, 0], 40, -240);
  LOOKT(c, t);
} });
// ================= 11 · an ARROW on the sea wall =================
SHOTS.push({ a: TL.AR0, b: TL.RD0 + .3, xf: .25, draw(c, u, t) {
  reset(); TM.set(t, { flag: 1 }); const ex = SW.mood('golden', { t });
  const tip = SW.stambh.tip, k = easeIO(clamp(u / 2.6));
  render3(c, SW.scene, tCam({ pos: [tip[0] + lerp(1.5, 1.2, k), tip[1] + lerp(2.4, 1.9, k), tip[2] - lerp(10, 8.2, k)], at: [tip[0] - .35, tip[1] - 1.6, tip[2] + 5], fov: 44 }), { exposure: ex, fx: lens(lerp(9.5, 7.8, k), GOLDG, { ap: 1.1 }) });
  const d = easeOut(seg(t, TL.ARROW, TL.ARROW + 1.2)); if (d > 0) {
    const [x0, y0] = toScreen3([tip[0], tip[1], tip[2] + .4]), [x1, y1] = toScreen3([tip[0], tip[1] - 3, tip[2] + 3000]);
    c.save(); c.strokeStyle = 'rgba(255,214,130,.9)'; c.lineWidth = 4; c.setLineDash([18, 14]); c.lineDashOffset = -t * 60; c.shadowColor = 'rgba(255,190,90,.8)'; c.shadowBlur = 12;
    c.beginPath(); c.moveTo(x0, y0); c.lineTo(lerp(x0, x1, d), lerp(y0, y1, d)); c.stroke(); c.restore();
  }
  jTag(c, t, TL.AR0 + .3, TL.RD0 + .3, 'BAAN STAMBH · THE ARROW PILLAR', 120, 560);
  sticker(c, t, TL.ARROW + .5, 'EPISODE 2', 760, 1080, { size: 54, rot: .05 });
  LOOKT(c, t);
} });

// ================= 12 · the raiders came: faceless shadows with torches, at night =================
const ROLES = ['A RAIDER FROM THE WEST', "A SULTAN'S ARMY", 'A GOVERNOR OF GUJARAT', 'A SULTAN OF GUJARAT', "AN EMPEROR'S ORDER"];
const YEARS = ['1026', '1299', '1395', '1451', '1706'];
const BARS = (c, t) => YEARS.forEach((y, i) => redact(c, t, TL.YR[i] - .05, TL.BK0 + .2, y, ROLES[i], 560 + i * 122, {}));
SHOTS.push({ a: TL.RD0, b: TL.YR[0] - .05, xf: .2, draw(c, u, t) {
  reset(); TM.set(t, {}); RD.set(t, { on: 1, walk: 6 + u * 3.2 });
  const ex = SW.mood('night', { t, fireAt: [96, 6, 22], fire: 1300, fog: .008 });
  render3(c, SW.scene, tCam({ pos: [lerp(236, 228, u), 2.4, lerp(52, 48, u)], at: [20, 18, 0], fov: 36 }), { exposure: ex, fx: lens(90, NIGHTG, { ap: .7 }) });
} });
// ================= 13–17 · the five years: the temple broken on each, faster each time; a redacted record per year =================
const BRK = [[[-46, 5, 66], [8, 20, 0], 50], [[44, 26, -58], [0, 34, 0], 46], [[62, 9, 44], [6, 18, 0], 50], [[-30, 14, -60], [10, 22, 0], 48], [[96, 4, 20], [10, 16, 0], 44]];
YEARS.forEach((y, i) => {
  const a = TL.YR[i] - .05, b = i < 4 ? TL.YR[i + 1] - .05 : TL.NM0;
  SHOTS.push({ a, b, draw(c, u, t) {
    reset(); const dur = [1.3, 1.1, .9, .75, .6][i], br = easeOut(seg(t, a + .05, a + .05 + dur)) * [.7, .6, .75, .6, .95][i];
    TM.set(t, { brk: br, dustCol: '#5A3A28', fire: i === 4 ? seg(t, a + .6, b) : 0 }); SMK.set(t, { on: 1, col: '#2A1810' });
    const [p, at, fov] = BRK[i], ex = SW.mood('night', { t, fireAt: [24 + i * 6, 6, 30 - i * 12], fire: 1700 });
    render3(c, SW.scene, tCam({ pos: add3(p, shakeOf(t, a, 1.2)), at, fov }), { exposure: ex, fx: lens(Math.hypot(p[0] - at[0], p[2] - at[2]), NIGHTG) });
    flashAt(c, t, a, .85, '#FFB070', 6);
    BARS(c, t);
  } });
});
// ================= 18 · we won't say their NAMES: the ruin burning, the shadows dissolving, the five bars =================
SHOTS.push({ a: TL.NM0, b: TL.BK0 + .3, draw(c, u, t) {
  reset(); TM.set(t, { brk: 1, keep: 7, dust: 0, fire: .9 }); SMK.set(t, { on: 1, col: '#120A06' });
  RD.set(t, { on: 1, walk: 70 + u * 1.2, fade: seg(t, TL.NAMES - .2, TL.BK0 + .2) });
  const ex = SW.mood('night', { t, fireAt: [40, 6, 10], fire: 1600, fog: .01 });
  render3(c, SW.scene, tCam({ pos: [lerp(118, 112, u / 2), 1.6, 30], at: [70, 3.2, 14], fov: 38 }), { exposure: ex, fx: lens(40, NIGHTG, { ap: 1.4 }) });
  BARS(c, t);
  if (t > TL.NAMES) flash(c, .18 * Math.exp(-(t - TL.NAMES) * 4), '#FF3020');
} });

// ================= 19 · someone built it BACK: dawn gold on the rubble, the stones begin to rise =================
const HIST = (c, t, t1 = TL.MY0) => cornerTag(c, t, TL.BK0 + .2, t1, 'HISTORY', JCOL.teal);
SHOTS.push({ a: TL.BK0, b: TL.R[0], xf: .3, draw(c, u, t) {
  reset(); const b = 1 - .22 * easeIO(seg(t, TL.BACK - .4, TL.R[0])); TM.set(t, { brk: b, mode: 'build', dust: .4 });
  const ex = SW.mood('golden', { t }); const k = easeIO(clamp(u / 2.4));
  render3(c, SW.scene, tCam({ pos: [lerp(46, 40, k), lerp(3, 4, k), lerp(30, 26, k)], at: [10, 4, 0], fov: 48 }), { exposure: ex, fx: lens(34) });
  flashAt(c, t, TL.BACK, .4, '#FFD890', 3);
  HIST(c, t);
} });
// ================= 20 · the roll: Mularaja, Kumarpal, Mahipala, in gold, as the temple rises =================
const ROLL = [['MULARAJA', 'BEFORE 997 CE · THE FIRST TEMPLE'], ['KUMARPAL', '1169 CE · STONE AND JEWELS'], ['MAHIPALA', '1308 CE · REBUILT']];
SHOTS.push({ a: TL.R[0], b: TL.AH0, draw(c, u, t) {
  reset(); const b = .78 * (1 - easeIO(seg(t, TL.R[0], TL.RL1))); TM.set(t, { brk: b, mode: 'build', dust: .3, flag: 1 });
  const ex = SW.mood('golden', { t }); const a = lerp(.9, -.35, easeIO(clamp(u / (TL.AH0 - TL.R[0])))), R0 = 96;
  render3(c, SW.scene, tCam({ pos: [14 + Math.cos(a) * R0, lerp(8, 14, u / 6), Math.sin(a) * R0], at: [14, 18, 0], fov: 46 }), { exposure: ex, fx: lens(R0) });
  ROLL.forEach(([nm, sub], i) => goldName(c, t, TL.R[i], (TL.R[i + 1] ?? TL.AH0) - .02, nm, sub, 760));
  HIST(c, t);
} });
// ================= 21 · beside the ruins, Ahilyabai Holkar built a new Somnath =================
SHOTS.push({ a: TL.AH0, b: TL.AH2, xf: .3, draw(c, u, t) {
  reset(); TM.set(t, { brk: 1, keep: 7, dust: 0 }); TM2.visible = true;
  TM2.set(t, { brk: 1 - easeIO(seg(t, TL.AH0 + .2, TL.AHNAME + 1.4)), mode: 'build', dust: .3, flag: 1 });
  const ex = SW.mood('golden', { t }); const k = easeIO(clamp(u / 3.2));
  render3(c, SW.scene, tCam({ pos: [lerp(60, 52, k), lerp(9, 11, k), lerp(28, 18, k)], at: [lerp(-12, -22, k), 6, lerp(-20, -28, k)], fov: 48 }), { exposure: ex, fx: lens(70) });
  callout(c, t, TL.AHNAME + .4, TL.AH2 + .1, "AHILYABAI'S TEMPLE · c. 1783", [-46, 12, -52], -40, -200, { col: JCOL.gold });
  callout(c, t, TL.AH0 + .5, TL.AH2 + .1, 'THE OLD TEMPLE · IN RUINS', [8, 6, 0], 30, -260, { col: JCOL.red });
  HIST(c, t);
} });
// ================= 22 · Ahilyabai's portrait =================
SHOTS.push({ a: TL.AH2, b: TL.AH3, xf: .25, draw(c, u, t) {
  portrait(c, t, TL.AH2, silAhilya, { x: 520, y: 1070, s: .66, hx: 560, hy: 760, seed: 9 });
  goldName(c, t, TL.AH2 + .15, TL.AH3 + .3, 'AHILYABAI HOLKAR', '1725–1795 · QUEEN OF MALWA', 1150, { size: 70 });
  HIST(c, t);
} });
// ================= 23 · her works across India: temples, ghats, wells, rest houses, alms-houses =================
const AHBIG = ['BADRINATH', 'KASHI', 'GAYA', 'PURI', 'DWARKA', 'SOMNATH', 'RAMESWARAM', 'AYODHYA', 'SRISAILAM'];
SHOTS.push({ a: TL.AH3, b: TL.PT0, xf: .3, draw(c, u, t) {
  reset(); const ex = duskIndia(); I3.border.set(1, 2.4, .45);
  const on = (i) => TL.AH3 + .3 + i * ((TL.RAMES - TL.AH3 - .6) / AHW.length);
  AHW.forEach((s, i) => AHP[i].set(t, easeOut(seg(t, on(i), on(i) + .3))));
  render3(c, I3.scene, indiaCam(clamp(u / 7), { lon: 79, lat: 20.5, zoom: .98 }), { exposure: ex });
  AHW.forEach((s, i) => { if (!AHBIG.includes(s.name)) return; const big = s.name === 'BADRINATH' && t > TL.BADRI - .1 || s.name === 'RAMESWARAM' && t > TL.RAMES - .1;
    pin3(c, s.name, siteTop(s), t, on(i) + .1, { size: big ? 34 : 24, dy: -34, col: big ? '#FFE2A0' : '#F4D9A0', font: `700 ${big ? 34 : 24}px Cinzel`, spacing: 1 }); });
  jTag(c, t, TL.AH3 + .2, TL.PT0 + .3, 'HER WORKS · 1767–1795', 120, 560, { size: 28 });
  HIST(c, t);
} });
// ================= 24 · Sardar Patel's portrait: November 1947, Junagadh: REBUILD SOMNATH =================
SHOTS.push({ a: TL.PT0, b: TL.PT2, xf: .3, draw(c, u, t) {
  portrait(c, t, TL.PT0, silPatel, { x: 520, y: 1080, s: .7, hx: 560, hy: 760, seed: 47, mid: '#14100A' });
  goldName(c, t, TL.PATEL - .05, TL.REBUILD - .1, 'SARDAR PATEL', 'NOVEMBER 1947 · JUNAGADH', 1150, { size: 76 });
  sticker(c, t, TL.REBUILD - .05, 'REBUILD SOMNATH', 540, 1150, { size: 66, col: '#B8341E' });
  if (t > TL.REBUILD - .05) flash(c, .2 * Math.exp(-(t - TL.REBUILD) * 4), '#FFD890');
  HIST(c, t);
} });
// ================= 25 · the princely states joined into one India =================
SHOTS.push({ a: TL.PT2, b: TL.GA0, xf: .3, draw(c, u, t) {
  reset(); const ex = duskIndia(); const one = easeIO(seg(t, TL.ONE - .1, TL.ONE + .6)); I3.border.set(1, 2.4 + 3 * one, .4 + .6 * one);
  render3(c, I3.scene, indiaCam(clamp(u / 5), { lon: 79, lat: 21.5, zoom: .98 }), { exposure: ex });
  const t0 = TL.PT2 + .3, span = TL.ONE - t0 - .2;
  c.save(); c.globalCompositeOperation = 'lighter';
  DOTS.forEach((d) => { const ta = t0 + d.d * span; if (t < ta) return; const [x, y, z] = toScreen3(I3.at(d.lon, d.lat)); if (z > 1) return;
    const k = popK(t - ta), r = (3.5 + 2 * one) * k; c.globalAlpha = (1 - one * .6); c.fillStyle = one > .3 ? '#FFD27A' : '#F4C46A'; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); });
  c.restore();
  const n = Math.round(565 * clamp((t - t0) / span)); if (t > t0) jTag(c, t, t0, TL.GA0 + .3, `~${Math.min(n, 565)} PRINCELY STATES · 1947`, 540, 560, { align: 'center', size: 30 });
  if (one > 0) text(c, 'ONE INDIA', 540, 680, '700 72px Cinzel', '#FFC65A', { pop: t - TL.ONE, spacing: 8, glow: ['rgba(255,160,60,.55)', 30] });
  HIST(c, t);
} });

// ================= 26 · Gandhi: the people's money, not the state's: gold flowing into the rising temple at night =================
const GOLDS = [...Array(160)].map((_, i) => { const r = lcg(300 + i); return { x: r() * W, y0: 1500 + r() * 500, d: r(), s: 2 + r() * 4 }; });
SHOTS.push({ a: TL.GA0, b: TL.LT0 + .3, xf: .3, draw(c, u, t) {
  reset(); const b = .32 * (1 - easeIO(seg(t, TL.GA0, TL.LT0 + .6))); TM.set(t, { brk: b, mode: 'build', dust: .2, flag: .8 });
  const ex = SW.mood('blue', { t, exposure: 1.05 }); const k = easeIO(clamp(u / 3));
  render3(c, SW.scene, tCam({ pos: [lerp(108, 98, k), 5, lerp(-40, -36, k)], at: [12, 20, 0], fov: 48 }), { exposure: ex, fx: lens(110, BLUEG) });
  const [tx, ty] = toScreen3([6, 22, 0]);
  c.save(); c.globalCompositeOperation = 'lighter';
  GOLDS.forEach(g => { const q = ((u * .35 + g.d) % 1), e = easeIO(q); const x = lerp(g.x, tx + (g.x - 540) * .1, e), y = lerp(g.y0, ty, e);
    c.globalAlpha = Math.sin(Math.PI * q) * seg(t, TL.PEOPLE - .5, TL.PEOPLE + .3) * .9; c.fillStyle = '#FFD27A'; c.beginPath(); c.arc(x, y, g.s, 0, TAU); c.fill(); });
  c.restore();
  jTag(c, t, TL.PEOPLE - .1, TL.LT0 + .3, 'THE SOMNATH TRUST · PUBLIC FUNDS', 540, 560, { align: 'center', size: 28 });
  HIST(c, t);
} });
// ================= 27 · Nehru's letter to the President =================
const LETTER = { date: '2 MARCH 1951', head: ['FROM: THE PRIME MINISTER', 'TO:   THE PRESIDENT'],
  body: ['"I confess that I do not like', 'the idea of your associating', 'yourself with a spectacular', 'opening of the Somnath Temple…"'],
  src: 'Selected Works of J. Nehru, 2nd series, vol. 16', typeDur: 1.8 };
SHOTS.push({ a: TL.LT0, b: TL.PRASAD - .05, draw(c, u, t) {
  reset(); TM.set(t, { flag: .6 }); const ex = SW.mood('blue', { t, exposure: .7 });
  render3(c, SW.scene, tCam({ pos: [96, 4, -30], at: [12, 22, 0], fov: 48 }), { exposure: ex, fx: lens(100, BLUEG, { ap: 2.5 }) });
  c.fillStyle = 'rgba(0,0,0,.35)'; c.fillRect(0, 0, W, H);
  letterCard(c, t, TL.LT0 + .05, TL.PRASAD + .2, LETTER, { y: 820 });
  HIST(c, t);
} });
// ================= 28 · Rajendra Prasad went anyway =================
SHOTS.push({ a: TL.PRASAD - .05, b: TL.IN0, draw(c, u, t) {
  reset(); TM.set(t, { flag: 1 }); const ex = SW.mood('golden', { t }); const k = easeIO(clamp(u / 2.4));
  render3(c, SW.scene, tCam({ pos: [lerp(130, 118, k), 2.4, lerp(8, 4, k)], at: [20, 16, 0], fov: 44 }), { exposure: ex, fx: lens(110) });
  goldName(c, t, TL.PRASAD - .05, TL.IN0 + .2, 'RAJENDRA PRASAD', 'PRESIDENT OF INDIA', 760, { size: 76 });
  HIST(c, t);
} });
// ================= 29 · 11 May 1951: the linga installed; light from the spire =================
SHOTS.push({ a: TL.IN0, b: TL.MY0 + .3, xf: .2, draw(c, u, t) {
  reset(); TM.set(t, { flag: 1 }); const ex = SW.mood('golden', { t }); TPIL.set(t, .7 * easeOut(seg(t, TL.LINGA - .1, TL.LINGA + .8)));
  const k = easeIO(clamp(u / 4.2));
  render3(c, SW.scene, tCam({ pos: [lerp(40, 54, k), lerp(4, 30, k), lerp(26, 44, k)], at: [0, lerp(30, 40, k), 0], fov: 48 }), { exposure: ex, fx: lens(56, GOLDG, { bloom: .08 }) });
  flashAt(c, t, TL.LINGA - .05, .45, '#FFE2B0', 2.5);
  jTag(c, t, TL.IN0 + .1, TL.MY0 + .3, '11 MAY 1951 · THE LINGA INSTALLED', 540, 560, { align: 'center', size: 30 });
  HIST(c, t);
} });

// ================= 30–31 · the myth bust: 17 times? No. 17 was his campaigns; Somnath was hit five times =================
const MYTH = (c, t) => cornerTag(c, t, TL.MY0 + .1, TL.ASK, 'MYTH BUST', JCOL.red);
SHOTS.push({ a: TL.MY0, b: TL.ASK + .3, xf: .3, draw(c, u, t) {
  reset(); TM.set(t, { flag: .8 }); const ex = SW.mood('blue', { t, exposure: .85 });
  const a = lerp(.25, -.1, u / 7), R0 = 120;
  render3(c, SW.scene, tCam({ pos: [14 + Math.cos(a) * R0, 5, Math.sin(a) * R0 + 10], at: [14, 22, 0], fov: 44 }), { exposure: ex, fx: lens(R0, BLUEG) });
  c.fillStyle = 'rgba(0,0,0,.3)'; c.fillRect(0, 0, W, H);
  // 17, struck through at NO, then the campaigns' line
  const gone = seg(t, TL.MY2 + 1.3, TL.MY2 + 1.7);
  if (gone < 1) {
    c.save(); c.globalAlpha = 1 - gone;
    text(c, '17', 540, 720, '400 300px Anton', '#FFF4E4', { pop: t - TL.MY0 - .1, glow: ['rgba(0,0,0,.8)', 30] });
    text(c, 'TIMES?', 540, 900, '400 80px Anton', '#FFF4E4', { pop: t - TL.MY0 - .3, spacing: 6 });
    const s = easeOut(seg(t, TL.NO - .05, TL.NO + .2)); if (s > 0) { c.strokeStyle = '#E0281E'; c.lineWidth = 22; c.lineCap = 'round'; c.beginPath(); c.moveTo(330, 820); c.lineTo(330 + 420 * s, 820 - 220 * s); c.stroke(); }
    c.restore();
    sticker(c, t, TL.NO, 'NO.', 760, 560, { size: 80, rot: .08 });
    if (t > TL.MY2 && gone < 1) jTag(c, t, TL.MY2, TL.MY2 + 1.7, '17 = HIS CAMPAIGNS INTO INDIA · 1000–1025', 540, 1040, { align: 'center', size: 26 });
  }
  if (t > TL.MY2 + 1.4) {
    text(c, '5', 540, 690, '400 300px Anton', '#FFC65A', { pop: t - TL.MY2 - 1.4, glow: ['rgba(255,150,60,.5)', 40] });
    text(c, 'ATTACKS ON SOMNATH', 540, 870, '400 64px Anton', '#FFF4E4', { pop: t - TL.MY2 - 1.6, spacing: 4 });
    YEARS.forEach((y, i) => text(c, y, 220 + i * 160, 970, '700 40px "Space Mono"', '#F4D9A0', { pop: t - TL.FIVE - i * .08, spacing: 2 }));
  }
  MYTH(c, t);
} });
// ================= 32 · the ask: the temple at blue hour, its lamps, the crescent over the spire =================
SHOTS.push({ a: TL.ASK, b: TL.NX0 + .3, xf: .3, draw(c, u, t) {
  reset(); TM.set(t, { flag: 1 }); const ex = SW.mood('blue', { t, exposure: 1.1 });
  const k = easeIO(clamp(u / 3.6)), pos = [lerp(140, 118, k), lerp(3, 5, k), lerp(70, 60, k)], at = [10, 26, 0];
  moonOver(pos, at, 300, 80); SWM.set(1, .22, 1, 0, 50);
  render3(c, SW.scene, tCam({ pos, at, fov: 46 }), { exposure: ex, fx: lens(130, BLUEG) });
  if (t > TL.JAI) { const g = seg(t, TL.JAI, TL.JAI + .6); glow(c, 540, 1360, 420, '#F4B048', .18 * g, 'screen'); }
} });
// ================= 33 · next: the arrow that points to the South Pole =================
SHOTS.push({ a: TL.NX0, b: TL.CARD, xf: .3, draw(c, u, t) {
  reset(); TM.set(t, { flag: 1 }); const ex = SW.mood('blue', { t, exposure: 1.05 });
  const tip = SW.stambh.tip, k = easeIO(clamp(u / 3));
  render3(c, SW.scene, tCam({ pos: [tip[0] + lerp(2.5, 1.6, k), tip[1] + lerp(2.6, 2, k), tip[2] - lerp(11, 9, k)], at: [tip[0] - .35, tip[1] - 1.6, tip[2] + 5], fov: 46 }), { exposure: ex, fx: lens(lerp(10.5, 8.8, k), BLUEG, { ap: 1.1 }) });
  const d = easeOut(seg(t, TL.POLE - .4, TL.POLE + .8)); if (d > 0) {
    const [x0, y0] = toScreen3([tip[0], tip[1], tip[2] + .4]), [x1, y1] = toScreen3([tip[0], tip[1] - 3, tip[2] + 3000]);
    c.save(); c.strokeStyle = 'rgba(255,214,130,.9)'; c.lineWidth = 4; c.setLineDash([18, 14]); c.lineDashOffset = -t * 60; c.shadowColor = 'rgba(255,190,90,.8)'; c.shadowBlur = 12;
    c.beginPath(); c.moveTo(x0, y0); c.lineTo(lerp(x0, x1, d), lerp(y0, y1, d)); c.stroke(); c.restore();
  }
  jTag(c, t, TL.NX0 + .1, TL.CARD, 'NEXT · SOMNATH II', 540, 560, { align: 'center', size: 32 });
} });
// ================= 34 · the card =================
SHOTS.push({ a: TL.CARD, b: PROJECT.duration + 1, xf: .3, draw(c, u, t) { seriesCard(c, u, t, { next: 'EPISODE 2 · SOMNATH II · NEXT' }); } });
