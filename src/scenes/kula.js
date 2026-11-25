// kula.js: ad 115, "It takes 3,500 KILOS of GHEE to light this MOUNTAIN": what goes into the Maha Deepam on Arunachala
// (the ghee, the 1,500 m cloth wick, the copper kopparai and the 40 who carry it up), and who lights it: the fishermen
// of the Parvatha Raja Kulam, whose daughter, in the Tiruvilaiyadal Puranam's net-casting episode, was Parvati.
// The 3D style, with the voice. Facts and sources: STORYBOARD.md. Times: kula_tl.js (from the voice).
// Worlds: ARU (Arunachala, ad 110/114's, with the kopparai, the tins, the wick, the cloth stood up) in kula_aru.js; HM
// (one home's diya), RV (the sea at night) and MP (the map) in kula_sets.js; the silhouettes in kula_cast.js.
LOOK.bloom = .06;
const CAPY = 1360;
VO.caps.forEach((k, i) => say(i ? k.a : -1, k.b, k.text, { at: i ? k.at : k.at.map(() => -1), y: k.y ?? CAPY }));
const capBand = (c, a = .5) => band(c, 1180, 1560, Math.max(a, .55));
const lens = (focus, ap = 1.5, o = {}) => ({ dof: { focus, aperture: ap, max: o.max ?? 6, nearK: .5 },
  bloom: { k: o.bloom ?? .1, thresh: 1.6, knee: .6, radius: 1 },
  grade: { contrast: o.contrast ?? 1.08, sat: o.sat ?? 1.06, temp: o.temp ?? .02, tint: 0, lift: o.lift ?? 0, gamma: 1, gain: o.gain ?? 1 } });
const D2R = Math.PI / 180;
const dirAE = (az, el) => V3(Math.sin(az * D2R) * Math.cos(el * D2R), Math.sin(el * D2R), -Math.cos(az * D2R) * Math.cos(el * D2R));
const moonOff = (fov) => Math.atan(340 / 960 * Math.tan(fov / 2 * D2R)) / D2R;
const dist = (p) => CAM3.position.distanceTo(p.isVector3 ? p : V3(...p));
function cam(o) { CAM3.near = o.near ?? .05; CAM3.far = o.far ?? 6000; return cam3(o); }
const aimAE = (pos, az, el) => { const d = dirAE(az, el); return [pos[0] + d.x * 100, pos[1] + d.y * 100, pos[2] + d.z * 100]; };
const off = (p, d) => [p[0] + d[0], p[1] + d[1], p[2] + d[2]];
const SU = SUMMIT, SUA = [SU.x, SU.y, SU.z];
// a point round the summit: az (deg from north, clockwise), el (deg), r (m), from a point h m above the summit
const orbit = (az, el, r, h = 1.2, c = SUA) => { const d = dirAE(az, el); return [c[0] + d.x * r, c[1] + h + d.y * r, c[2] + d.z * r]; };
const tdy = (az, el, r) => [Math.sin(az * D2R) * Math.cos(el * D2R) * r, Math.sin(el * D2R) * r, -Math.cos(az * D2R) * Math.cos(el * D2R) * r];

// ---------- the moods on the hill ----------
const BLUE = { sky: ['blue', 'blue', 0], sunAt: [.75, .4, .35], sunCol: '#9AACE0', hemi: 1.05, hemiSky: '#7E8CC8', hemiGround: '#3A3028', sun: 1.1, exposure: 1.32 };
const NIGHT = { ...BLUE, sky: ['blue', 'night', .5], hemi: .9, sun: .9, exposure: 1.3 };
const DAY = { sky: ['day', 'day', 0], sunAt: [.5, .75, .4], sunCol: '#FFF0D8', hemi: 1.4, hemiSky: '#BCD4F0', hemiGround: '#6A5A48', sun: 3.2, exposure: 1.05, fog: 1 / 60000, town: 0, crowd: 0, vill: 0 };
const GOLDM = { sky: ['gold', 'gold', 0], sunAt: [-.8, .22, .5], sunCol: '#FFC890', hemi: 1.2, hemiSky: '#9AA8D0', hemiGround: '#5A4232', sun: 3.4, exposure: 1.1, fog: 1 / 45000, town: .2, crowd: 0, vill: .1 };
const DAWN = { sky: ['dawn', 'dawn', 0], sunAt: [.9, .12, .1], sunCol: '#FFB070', hemi: 1.15, hemiSky: '#8A86C0', hemiGround: '#4A3430', sun: 2.6, exposure: 1.1, town: .3, crowd: 0, vill: .3 };
const DUSK = { sky: ['dusk', 'dusk', 0], sunAt: [-.9, .06, .2], sunCol: '#FF9A60', hemi: 1.1, hemiSky: '#6A70B0', hemiGround: '#3A2A28', sun: 1.6, exposure: 1.2, town: .7, crowd: .6, vill: .6 };
function aruna(c, t, pos, at, fov, mood, o = {}, fx = null) {
  CAM3.near = o.near ?? .1; CAM3.far = 220000; cam3({ pos, at, fov });
  const ex = ARU.set(t, { ...mood, ...o });
  render3(c, ARU.S, CAM3, { exposure: ex, fx: fx || lens(dist(at), .6) });
}
const potO = (o = {}) => ({ size: .45, power: 45, beacon: .01, halo: .22, haze: .1, ...o });

// ================= A · It takes 3,500 KILOS of GHEE to light this MOUNTAIN (frame 0 finished) =================
// close on the blazing kopparai against the lit plain far below, a slow push; on "MOUNTAIN" a cut to the whole hill
// with its flame, pulling back
const A1 = TL.MOUNTAIN - .25;
SHOTS.push({ a: 0, b: A1, draw(c, u, t) {
  const k = seg(t, 0, A1), r = lerp(9, 7.8, k), pos = orbit(lerp(112, 118, k), 4, r, 1.9), at = off(SUA, [0, .1, 0]);
  aruna(c, t, pos, at, 40, NIGHT, { fireO: potO({ rocks: false, potYaw: -.5 }) }, lens(dist(SU), .9, { max: 5 }));
  bigNum(c, t, TL.KILOS - .1, TL.B0, '3,500 KG', 'of ghee', { y: 470 });
  capBand(c, .5);
} });
const HILLWIDE = (c, t, k, az0, az1, r0, r1, extra = {}) => {
  const pos = orbit(lerp(az0, az1, k), lerp(9, 11, k), lerp(r0, r1, k), 0), at = off(SUA, [0, -200, 0]);
  aruna(c, t, pos, at, 38, NIGHT, { moon: [(lerp(az0, az1, k) + 175) * D2R, 24 * D2R, { size: .04, stars: 0 }], fireO: { beacon: .014, ...extra } }, lens(dist(SU), .6));
};
SHOTS.push({ a: A1, b: TL.B0 + .3, draw(c, u, t) {
  HILLWIDE(c, t, easeOut(seg(t, A1, TL.B0 + .3)), 135, 140, 1150, 1700);
  bigNum(c, t, TL.KILOS - .1, TL.B0, '3,500 KG', 'of ghee', { y: 470 });
  capBand(c, .5);
} });

// ================= B · Enough to light ONE home's diya every evening… for nearly 1,000 YEARS =================
SHOTS.push({ a: TL.B0, b: TL.C0 + .3, xf: .35, draw(c, u, t) {
  const k = R_(t, TL.B0, TL.C0 + .3);
  // a slow day before "every evening", then the days racing (faster and faster) through the years
  const d0 = .55 + (t - TL.B0) * .07, sp = t < TL.B1 ? 0 : Math.pow(seg(t, TL.B1, TL.C0), 1.6) * 60;
  const day = t < TL.B1 ? .52 + (t - TL.B0) * .012 : .56 + sp * (t - TL.B1);
  CAM3.near = .02; CAM3.far = 40;
  const pos = [lerp(.14, .06, k), lerp(1.12, 1.06, k), lerp(.75, .42, k)], at = [0, HM.NY + .16, HM.WZ];
  cam3({ pos, at, fov: 32 });
  const ex = HM.set(t, { day });
  render3(c, HM.S, CAM3, { exposure: ex * .85, fx: lens(dist(at), 2.4, { max: 9, temp: .05 }) });
  const yrs = t < TL.B1 ? 0 : Math.round(Math.pow(seg(t, TL.B1, TL.YEARS + .25), 1.4) * 958);
  if (t > TL.B1) {
    const a = seg(t, TL.B1, TL.B1 + .2) * (1 - seg(t, TL.C0, TL.C0 + .3));
    band(c, 330, 680, .5 * a);
    text(c, `${yrs.toLocaleString('en-IN')}`, 540, 480, '700 150px Cinzel', GOLD, { alpha: a, spacing: 6, glow: ['rgba(255,150,60,.5)', 30] });
    text(c, 'YEARS', 540, 600, '700 54px Cinzel', CREAM, { alpha: a, spacing: 10, glow: ['rgba(6,5,10,.95)', 16] });
    source2(c, t, TL.YEARS, TL.C0, 'at 10 g of ghee an evening', 1610);
  }
  capBand(c, .5);
} });

// ================= C · Its wick: 1,500 METRES of cotton cloth =================
SHOTS.push({ a: TL.C0, b: TL.C1 + .3, xf: .35, draw(c, u, t) {
  const k = R_(t, TL.C0, TL.C1 + .3);
  const pos = orbit(lerp(150, 175, k), lerp(14, 22, k), lerp(4.6, 3.6, k), .4), at = off(SUA, [-.6, .7, .4]);
  aruna(c, t, pos, at, 42, DAY, { fire: 0, fireO: { rocks: false, potYaw: -1.2, tins: 1, coil: 1 } }, lens(dist(at), 2.5, { max: 7, temp: .03 }));
  bigNum(c, t, TL.METRES - .15, TL.C1 + .2, '1,500 M', 'of cotton cloth', { y: 470 });
  capBand(c, .5);
} });
// stood up beside the hill: the ribbon rises past the summit; the hill's 813 m against the cloth's 1,500 m
SHOTS.push({ a: TL.C1, b: TL.D0 + .3, xf: .3, draw(c, u, t) {
  const k = R_(t, TL.C1, TL.D0 + .3), up = easeIO(seg(t, TL.C1 + .2, TL.TWICE + .5));
  const tgt = [-1250, lerp(420, 640, k), lerp(700, 800, k)];
  const pos = [lerp(-1300, -1500, k), lerp(240, 320, k), lerp(5300, 6400, k)];
  aruna(c, t, pos, tgt, 46, GOLDM, { fire: 0, cloth: { k: up, yaw: .5, em: .35 } }, lens(dist(tgt), 0));
  // the measure: the summit's height across to the cloth, the cloth's tip
  const a = seg(t, TL.C1 + .5, TL.C1 + .8) * (1 - seg(t, TL.D0, TL.D0 + .3));
  if (a > 0) {
    const s = place2(SU), cl = place2(V3(CLOTH_X, SU.y, CLOTH_Z));
    dashed2(c, [s[0], s[1]], [cl[0], cl[1]], a);
    tag2(c, '813 M', clamp(s[0] + 20, 200, 800), s[1] - 70, a, 'Arunachala');
  }
  const b = seg(t, TL.TWICE - .3, TL.TWICE) * (1 - seg(t, TL.D0, TL.D0 + .3));
  if (b > 0) { const tp = place2(ARU.CLOTH.top(up)); tag2(c, '1,500 M', clamp(tp[0], 260, 820), tp[1] - 70, b, 'the wick'); }
  capBand(c, .5);
} });

// ================= D · a COPPER pot taller than a MAN, heavier than FOUR =================
SHOTS.push({ a: TL.D0, b: TL.E0 + .3, xf: .35, draw(c, u, t) {
  const k = R_(t, TL.D0, TL.E0 + .3);
  const pos = orbit(lerp(70, 92, k), lerp(4, 7, k), lerp(5.4, 4.6, k), .5), at = off(SUA, [0, 1.2, 0]);
  aruna(c, t, pos, at, 40, DAWN, { fire: 0, fireO: { potYaw: .15 } }, lens(dist(at), 2, { max: 6, temp: .04 }));
  // a man beside it, for scale (1.65 m against its 1.75 m + the stand)
  const m = place2(off(SUA, [-.05, 0, 1.0]));
  figure(c, (f) => { f.translate(m[0] + m[2] * .1, m[1]); const s = m[2] / 100 * (165 / 170); f.scale(-s, s); man2(f, { t, pose: 'pray' }); }, LIGHTS.dawnBack);
  const p0 = place2(off(SUA, [0, .12, 0])), p1 = place2(off(SUA, [0, 1.87, 0]));
  const a = seg(t, TL.MAN - .2, TL.MAN + .1) * (1 - seg(t, TL.E0, TL.E0 + .3));
  if (a > 0) { const x = p0[0] + p0[2] * .75; ruler2(c, x, p0[1], p1[1], a); tag2(c, '5.75 FT', Math.min(x + 140, 900), p1[1] - 60, a); }
  bigNum(c, t, TL.FOUR - .15, TL.E0 + .2, '310 KG', 'of copper and iron', { y: 470 });
  capBand(c, .5);
} });

// ================= E · Over 40 people carry it up the mountain, on foot =================
// the 3D sky and the plain far below; over it, a 2D ridge of rock rising to the upper left, the men climbing it in a
// line, the kopparai slung from two poles between them, all in silhouette against the light
const RIDGE2 = (x, t = 0) => 1490 - (1080 - x) * .62 + 26 * Math.sin(x * .013) + 14 * Math.sin(x * .041 + 1);
function ridge2(c, col = '#07060A') {
  c.save(); c.fillStyle = col; c.beginPath(); c.moveTo(-40, H); for (let x = -40; x <= W + 40; x += 10) c.lineTo(x, RIDGE2(x)); c.lineTo(W + 40, H); c.closePath(); c.fill();
  const r = lcg(12); for (let i = 0; i < 14; i++) { const x = r() * W, y = RIDGE2(x); ellipse(c, x, y + 6, 30 + r() * 50, 16 + r() * 18, col, (r() - .5) * .6); }
  c.restore();
}
function climbers(c, t, o = {}) {
  const n = o.n ?? 9, sp = o.speed ?? 34, gap = o.gap ?? 150, torches = [];
  figure(c, (f) => {
    ridge2(f);
    const xs = []; for (let i = 0; i < n; i++) xs.push(1180 - ((t * sp + i * gap + (o.x0 ?? 0)) % (n * gap)));
    xs.forEach((x, i) => {
      const y = RIDGE2(x) + 6, k = (o.k ?? 1.9) * (1 + (y - 900) / 2400);
      f.save(); f.translate(x, y); f.scale(-k, k);
      const pot = o.pot && (i === 3 || i === 4), torch = o.torch && i % 2 === 0;
      const out = {}; man2(f, { t, pose: torch ? 'torch' : pot ? 'carry' : (i % 3 === 1 ? 'carry' : 'walk'), ph: t * 5.2 + i * 1.7, climb: .9, lean: .28, out });
      if (out.torch) torches.push([out.torch.x, out.torch.y, k]);
      f.restore();
    });
    if (o.pot) {
      const a = xs[3], b = xs[4]; if (Math.abs(a - b) < gap * 1.2) {
        const ka = (o.k ?? 1.9), ya = RIDGE2(a) - 152 * ka, yb = RIDGE2(b) - 152 * ka;
        f.strokeStyle = '#07060A'; f.lineCap = 'round'; f.lineWidth = 7; f.beginPath(); f.moveTo(a, ya); f.lineTo(b, yb); f.stroke();
        const mx = (a + b) / 2, my = (ya + yb) / 2; f.lineWidth = 4; f.beginPath(); f.moveTo(mx - 22, my); f.lineTo(mx - 34, my + 40); f.moveTo(mx + 22, my); f.lineTo(mx + 34, my + 40); f.stroke();
        o.potAt = [mx, my];
      }
    }
  }, LIGHTS[o.light || 'dawnBack']);
  if (o.potAt) { const [mx, my] = o.potAt; c.save(); const g = c.createLinearGradient(mx - 52, 0, mx + 52, 0); g.addColorStop(0, '#3A1608'); g.addColorStop(.75, '#7A3410'); g.addColorStop(1, '#E08A40');
    c.fillStyle = g; c.beginPath(); c.moveTo(mx - 54, my + 34); c.lineTo(mx + 54, my + 34); c.lineTo(mx + 42, my + 170); c.lineTo(mx - 42, my + 170); c.closePath(); c.fill();
    c.fillStyle = '#1A0C06'; c.fillRect(mx - 56, my + 30, 112, 10); c.fillStyle = 'rgba(250,236,210,.55)'; c.fillRect(mx - 52, my + 62, 104, 4); c.fillRect(mx - 44, my + 150, 88, 4);
    c.strokeStyle = 'rgba(255,200,140,.8)'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(mx + 54, my + 34); c.lineTo(mx + 42, my + 170); c.stroke(); c.restore(); }
  torches.forEach(([x, y, k], i) => torch2(c, x, y, k * .8, t + i));
}
SHOTS.push({ a: TL.E0, b: TL.F0 + .3, xf: .3, draw(c, u, t) {
  const k = R_(t, TL.E0, TL.F0 + .3), pos = orbit(95, 0, 40, 30);
  aruna(c, t, pos, aimAE(pos, lerp(96, 92, k), lerp(4, 6, k)), 50, DAWN, { fire: 0, sunAt: [.98, .05, .1], town: .4 }, lens(5000, 0));
  climbers(c, t - TL.E0 + 3, { pot: true });
  bigNum(c, t, TL.FORTY - .15, TL.F0 + .2, '40+', 'people · on foot', { y: 470 });
  capBand(c, .5);
} });

// ================= F · For generations, only ONE community has lit it: FISHERMEN =================
// dusk on the summit, the pot unlit; the men round it, one pouring ghee in, two holding torches
function lighters(c, t, o = {}) {
  const torches = [], g = [
    { p: [1.1, 0, .25], pose: 'pour', flip: -1 }, { p: [-1.0, 0, .5], pose: 'torch', flip: 1 }, { p: [.4, 0, 1.3], pose: 'pray', flip: -1 },
    { p: [-.6, 0, -1.1], pose: 'torch', flip: 1 }, { p: [1.3, 0, -.9], pose: 'fold', flip: -1 }, { p: [-1.6, 0, -.2], pose: 'stand', flip: 1 }];
  const P = g.map(m => ({ ...m, w: off(SUA, m.p) })).sort((a, b) => dist(b.w) - dist(a.w));
  figure(c, (f) => {
    for (const m of P) { const [x, y, s, z] = place2(m.w); if (z > 1) continue; const k = s / 100; f.save(); f.translate(x, y); f.scale(k * m.flip, k); const out = {}; man2(f, { t, pose: m.pose, out }); if (out.torch) torches.push([out.torch.x, out.torch.y, k]); f.restore(); }
  }, LIGHTS[o.light || 'fire']);
  torches.forEach(([x, y, k], i) => torch2(c, x, y, k, t + i));
}
function torch2(c, x, y, k, t) {
  k = Math.min(k, 1.4);
  glow(c, x, y, 90 * k * 2.2, '#FF9A40', .5); glow(c, x, y - 10 * k, 30 * k * 2.2, '#FFE8B0', .9);
  c.save(); c.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 3; i++) { const h = (34 + 8 * Math.sin(t * 9 + i)) * k * 2.2, w = (10 - i * 2.5) * k * 2.2; const gr = c.createLinearGradient(x, y, x, y - h); gr.addColorStop(0, i ? 'rgba(255,240,190,.9)' : 'rgba(255,160,60,.8)'); gr.addColorStop(1, 'rgba(255,90,20,0)'); c.fillStyle = gr; c.beginPath(); c.moveTo(x - w, y); c.quadraticCurveTo(x - w * .6, y - h * .6, x + 2 * Math.sin(t * 7 + i) * k, y - h); c.quadraticCurveTo(x + w * .6, y - h * .6, x + w, y); c.fill(); }
  c.restore();
}
SHOTS.push({ a: TL.F0, b: TL.G0 + .3, xf: .35, draw(c, u, t) {
  const k = R_(t, TL.F0, TL.G0 + .3), push = easeIO(seg(t, TL.FISHER - .6, TL.G0));
  const pos = orbit(lerp(200, 214, k), lerp(-2, 1, k), lerp(7.5, 6.2, k) - 1.2 * push, 1.0), at = off(SUA, [0, 1.5, 0]);
  aruna(c, t, pos, at, 44, DUSK, { fire: 0, fireO: { potYaw: -2.0, tins: 1 } }, lens(dist(at), 1.6, { max: 6 }));
  lighters(c, t);
  capBand(c, .5);
} });

// ================= G · Fishermen? On a mountain 90 KM from the SEA? =================
SITE.coast = [79.84, 11.98];
const MAPN = { sunAt: [-.35, .7, .55], sun: 2.2, hemi: .9, hemiCol: '#6A80C8', exposure: 1.3, stars: .6, fogCol: '#14204A', fogNear: 300, fogFar: 1400 };
const MA = (lon, lat, lift = 0) => MP.at(lon, lat, lift);
SHOTS.push({ a: TL.G0, b: TL.H0 + .3, xf: .3, draw(c, u, t) {
  const k = easeOut(seg(t, TL.G0, TL.H0 + .3)), C = MA(79.5, 12.0);
  const pos = off(C, [lerp(-1, 1, k), lerp(40, 34, k), lerp(30, 26, k)]);
  CAM3.near = 1; CAM3.far = 20000; cam3({ pos, at: C, fov: 46 });
  const ex = MP.mood('night', MAPN); MP.set(t, { outline: .4, lineW: pos[1] * .003, lamps: .45 });
  render3(c, MP.scene, CAM3, { exposure: ex, fx: lens(dist(C), 0, { bloom: .12, sat: 1.12 }) });
  const A = toScreen3(MA(...SITE.aruna)), B = toScreen3(MA(...SITE.coast));
  const lk = easeIO(seg(t, TL.KM - .5, TL.KM + .5));
  if (lk > 0) { c.save(); c.strokeStyle = GOLD; c.lineWidth = 7; c.shadowColor = 'rgba(6,5,10,.9)'; c.shadowBlur = 10; c.setLineDash([20, 12]); c.lineCap = 'round'; c.beginPath(); c.moveTo(A[0], A[1]); c.lineTo(lerp(A[0], B[0], lk), lerp(A[1], B[1], lk)); c.stroke(); c.restore(); }
  dot2(c, MA(...SITE.aruna), t, TL.G0, TL.H0 + .3); dot2(c, MA(...SITE.coast), t, TL.SEA - .4, TL.H0 + .3, '150,200,255');
  pin2(c, 'ARUNACHALA', MA(...SITE.aruna), t, TL.G0 + .2, TL.H0 + .3, { dy: 130, dx: -120 });
  pin2(c, 'THE SEA', MA(...SITE.coast), t, TL.SEA - .3, TL.H0 + .3, { dy: 130, dx: 120, col: BLUEL });
  if (t > TL.KM) text(c, '90 KM', (A[0] + B[0]) / 2, Math.min(A[1], B[1]) - 120, '700 72px Cinzel', GOLD, { pop: t - TL.KM, alpha: seg(t, TL.KM, TL.KM + .2) * (1 - seg(t, TL.H0, TL.H0 + .3)), spacing: 4, glow: ['rgba(6,5,10,.95)', 18] });
  capBand(c, .5);
} });

// ================= the sea at night (the legend) =================
const SEA_MOON = [0, 9];
function sea(c, t, pos, at, fov, o = {}, fx) {
  cam({ pos, at, fov, near: .05, far: 4000 });
  const ex = RV.set(t, { place: 'sea', mood: o.mood || ['thai'], moonAz: o.moonAz ?? SEA_MOON[0], moonEl: o.moonEl ?? SEA_MOON[1], moonR: o.moonR ?? 2.6, bank: o.bank ?? false, calm: o.calm ?? 1.4, exposure: o.exposure ?? 1.05 });
  RV.refl(); render3(c, RV.S, CAM3, { exposure: ex, fx: fx || lens(60, 0, { bloom: .08 }) });
}
// the beach: dark sand across the bottom of the frame, with a wet line catching the moon
function sand2(c, y0, tilt = 0) {
  c.save(); const g = c.createLinearGradient(0, y0 - 30, 0, H); g.addColorStop(0, 'rgba(8,9,18,0)'); g.addColorStop(.06, '#0A0B16'); g.addColorStop(1, '#040408');
  c.fillStyle = g; c.beginPath(); c.moveTo(0, y0 + tilt); c.bezierCurveTo(300, y0 - 10, 700, y0 + 14, W, y0 - tilt); c.lineTo(W, H); c.lineTo(0, H); c.fill();
  c.strokeStyle = 'rgba(200,214,250,.25)'; c.lineWidth = 3; c.beginPath(); c.moveTo(0, y0 + tilt + 3); c.bezierCurveTo(300, y0 - 7, 700, y0 + 17, W, y0 - tilt + 3); c.stroke(); c.restore();
}
function shore2(c, t, y0) {
  palm2(c, 60, y0 + 30, 560, -.18, t); palm2(c, 170, y0 + 20, 430, .1, t + 2); palm2(c, 1010, y0 + 26, 520, .2, t + 4);
  hut2(c, 250, y0 + 8, 150); hut2(c, 880, y0 + 6, 130);
  c.save(); c.translate(560, y0 + 36); c.scale(.42, .42); boat2(c, {}); c.restore();
}

// ================= H · In the Tiruvilaiyadal Puranam, PARVATI is born on earth, as the daughter of a FISHERMEN'S CHIEF =================
SHOTS.push({ a: TL.H0, b: TL.I0 + .3, xf: .4, draw(c, u, t) {
  const k = R_(t, TL.H0, TL.I0 + .3);
  const pos = [0, 1.4, 8], fov = lerp(52, 44, k);
  sea(c, t, pos, aimAE(pos, SEA_MOON[0], SEA_MOON[1] - moonOff(fov)), fov);
  const y0 = 1180 + 40 * k; sand2(c, y0, 10); shore2(c, t, y0);
  // the girl on the wet sand, the moon behind her; her father comes to her side on "chief"
  const s = lerp(3.2, 3.8, k), ch = easeOut(seg(t, TL.CHIEF - 1.4, TL.CHIEF));
  figure(c, (f) => {
    f.save(); f.translate(lerp(430, 420, k) - 120 * ch, y0 + 70); f.scale(s * .98, s * .98); man2(f, { t, pose: 'stand', turban: true, staff: true, beard: true, col: '#0A0B14' }); f.restore();
    f.save(); f.translate(lerp(560, 600, k), y0 + 80); f.scale(-s, s); girl2(f, { t, pose: 'pray', wind: .8 }); f.restore();
  }, LIGHTS.moonSilhouette);
  topTitle(c, t, TL.PURANAM - .2, TL.CHIEF - 1.6, 'திருவிளையாடல் புராணம்', 'Tiruvilaiyadal Puranam · Valai Veesiya Padalam', { font: `800 72px ${TAMIL}`, y: 470, dy: 90, sfont: 'italic 40px Marcellus', bandA: .4 });
  capBand(c, .5);
} });

// ================= I · A giant SHARK terrorises their sea =================
SHOTS.push({ a: TL.I0, b: TL.I1 + .3, xf: .25, draw(c, u, t) {
  const k = R_(t, TL.I0, TL.I1 + .3), pos = [0, .9, 8], fov = 50;
  const sh = shakeAt(t, TL.SHARK + .35, 6);
  sea(c, t, pos, aimAE(pos, SEA_MOON[0] + sh[0] * .3, SEA_MOON[1] - moonOff(fov) + sh[1] * .3), fov, { calm: 1.8 });
  // the fin cutting the moon's path, then the breach right across the moon
  const hz = toScreen3(aimAE(pos, 0, 0))[1];
  const fk = seg(t, TL.I0, TL.SHARK - .2), bk = seg(t, TL.SHARK - .25, TL.SHARK + 1.1);
  if (fk < 1) { const x = lerp(-80, 700, fk), y = hz + 140; c.save(); c.translate(x, y); c.scale(.55, .55); c.fillStyle = '#05060C'; c.beginPath(); c.moveTo(-60, 0); c.quadraticCurveTo(-10, -60, 40, -130); c.quadraticCurveTo(50, -60, 90, 0); c.fill(); c.restore(); wake2(c, x, y, t); }
  if (bk > 0 && bk < 1) {
    const x = lerp(260, 820, bk), y = hz + 160 - Math.sin(bk * Math.PI) * 560, a = lerp(-.7, .8, bk);
    c.save(); c.translate(x, y); c.rotate(a); c.scale(1.05, 1.05); shark2(c, { bend: Math.sin(bk * 3) * .6, jaw: Math.sin(bk * Math.PI), tail: Math.sin(t * 14) * .25 }); c.restore();
    spray2(c, lerp(260, 400, bk), hz + 160, bk, t); if (bk > .7) spray2(c, 820, hz + 160, (bk - .7) / .3, t + 1);
  }
  if (t > TL.SHARK + .9) spray2(c, 820, hz + 160, seg(t, TL.SHARK + .9, TL.SHARK + 2.2) * .7 + .3, t + 1);
  capBand(c, .5);
} });
function wake2(c, x, y, t) { c.save(); c.strokeStyle = 'rgba(210,222,255,.5)'; c.lineWidth = 3; for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(x - 60 - i * 40, y + 4 + i * 4); c.quadraticCurveTo(x - 160 - i * 50, y + 14 + i * 6, x - 280 - i * 60, y + 10 + i * 8); c.stroke(); } c.restore(); }
function spray2(c, x, y, k, t) {
  const r = lcg(7 + Math.floor(x)); c.save(); c.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 70; i++) { const a = -Math.PI / 2 + (r() - .5) * 2.2, v = 200 + r() * 500, px = x + Math.cos(a) * v * k, py = y + Math.sin(a) * v * k + 600 * k * k; c.fillStyle = `rgba(220,232,255,${.6 * (1 - k)})`; c.beginPath(); c.arc(px, py, 2 + r() * 5, 0, TAU); c.fill(); }
  c.restore();
}

// ================= I1 · The chief vows: whoever catches it MARRIES her =================
SHOTS.push({ a: TL.I1, b: TL.J0 + .3, xf: .35, draw(c, u, t) {
  const k = R_(t, TL.I1, TL.J0 + .3), pos = [0, 1.1, 8], fov = lerp(46, 40, k);
  sea(c, t, pos, aimAE(pos, SEA_MOON[0] + 2, SEA_MOON[1] - moonOff(fov) - 2), fov);
  const y0 = 1240; sand2(c, y0, -8);
  // a rock; the chief on it, arm raised; the fishermen below; his daughter to one side
  c.save(); c.fillStyle = '#05050A'; c.beginPath(); c.moveTo(300, y0 + 30); c.quadraticCurveTo(360, y0 - 120, 520, y0 - 110); c.quadraticCurveTo(640, y0 - 100, 700, y0 + 30); c.fill(); c.restore();
  const s = 3.4, vow = seg(t, TL.I1 + .4, TL.I1 + .9);
  figure(c, (f) => {
    f.save(); f.translate(500, y0 - 108); f.scale(s, s); man2(f, { t, pose: vow > .5 ? 'vow' : 'stand', turban: true, beard: true }); f.restore();
    for (const [x, sc, fl, pose] of [[180, 3.9, 1, 'fold'], [300, 4.4, 1, 'stand'], [780, 4.2, -1, 'stand'], [900, 4.6, -1, 'fold']]) { f.save(); f.translate(x, y0 + 330); f.scale(sc * fl, sc); man2(f, { t, pose }); f.restore(); }
    f.save(); f.translate(650, y0 + 60); f.scale(-3.6, 3.6); girl2(f, { t, pose: 'pray', wind: .7 }); f.restore();
  }, LIGHTS.moonSilhouette);
  capBand(c, .5);
} });

// ================= J · A young fisherman casts his NET… and drags it in =================
SHOTS.push({ a: TL.J0, b: TL.K0 + .3, xf: .35, draw(c, u, t) {
  const k = R_(t, TL.J0, TL.K0 + .3), pos = [0, 1.0, 8], fov = 46;
  sea(c, t, pos, aimAE(pos, SEA_MOON[0] - 3, SEA_MOON[1] - moonOff(fov) + 1), fov, { calm: 1.6 });
  const hz = toScreen3(aimAE(pos, 0, 0))[1], bob = 8 * Math.sin(t * 1.6);
  const bx = 400, by = hz + 150 + bob, s = 2.4;
  const ck = seg(t, TL.NET - .9, TL.NET + .1), pull = seg(t, TL.DRAGS - .3, TL.K0);
  const out = {};
  figure(c, (f) => {
    f.save(); f.translate(bx, by); f.rotate(.03 * Math.sin(t * 1.3)); f.scale(s, s); boat2(f, {}); f.translate(60, -22); man2(f, { t, pose: pull > 0 ? 'pull' : 'cast', k: ck, out }); f.restore();
    // the shark in the net, thrashing as it is hauled to the boat
    if (pull > 0) { f.save(); f.translate(lerp(900, 760, pull), hz + 110 + 20 * Math.sin(t * 9)); f.rotate(-.3 + .25 * Math.sin(t * 11)); f.scale(-.55, .55); shark2(f, { bend: .5 * Math.sin(t * 9), tail: .4 * Math.sin(t * 13), jaw: .6 }); f.restore(); }
  }, LIGHTS.moonSilhouette);
  const nk = seg(t, TL.NET - .1, TL.NET + .8);
  if (out.hand && nk > 0 && pull <= 0) net2(c, out.hand.x, out.hand.y, lerp(out.hand.x + 60, 820, nk), lerp(out.hand.y - 200, hz + 110, nk), 190, .3, nk);
  if (pull > 0 && out.hand) { const nx = lerp(820, 740, pull), ny = hz + 110; c.save(); c.strokeStyle = 'rgba(220,232,255,.7)'; c.lineWidth = 2; c.beginPath(); c.moveTo(out.hand.x, out.hand.y); c.quadraticCurveTo((out.hand.x + nx) / 2, ny + 30, nx, ny); c.stroke(); c.restore(); net2(c, nx - 20, ny - 60, nx, ny, 120, .5, .6, '220,232,255', .8); spray2(c, nx, ny + 20, (t * 1.7) % 1, t); }
  capBand(c, .5);
} });

// ================= K · The fisherman… was SHIVA =================
SHOTS.push({ a: TL.K0, b: TL.K1 + .3, xf: .3, draw(c, u, t) {
  const k = R_(t, TL.K0, TL.K1 + .3), pos = [0, 1.0, 8], fov = 40;
  sea(c, t, pos, aimAE(pos, SEA_MOON[0], SEA_MOON[1] - moonOff(fov) + 5), fov);
  const rv = easeIO(seg(t, TL.SHIVA - .6, TL.SHIVA + .3));
  const hz = toScreen3(aimAE(pos, 0, 0))[1];
  const m = toScreen3(aimAE(pos, SEA_MOON[0], SEA_MOON[1]));
  glow(c, m[0], m[1], 600 * (.6 + rv), '#BFD4FF', .35 + .3 * rv);
  const s = lerp(.92, 1.0, k);
  if (rv < 1) { c.save(); c.globalAlpha = 1 - rv; figure(c, (f) => { f.translate(540, 1900); f.scale(s * 5.0, s * 5.0); man2(f, { t, pose: 'stand' }); }, LIGHTS.moonSilhouette); c.restore(); }
  if (rv > 0) { c.save(); c.globalAlpha = rv; figure(c, (f) => { f.translate(540, 1900); f.scale(s * .95, s * .95); shiva(f, { t, eyes: .9, arm: 'abhaya', wind: .6 }); }, LIGHTS.moon); c.restore(); }
  flashK(c, t, TL.SHIVA - .15, '220,232,255', .55, 3);
  capBand(c, .5);
} });

// ================= K1 · And the shark? NANDI =================
SHOTS.push({ a: TL.K1, b: TL.L0 + .3, xf: .3, draw(c, u, t) {
  const k = R_(t, TL.K1, TL.L0 + .3), pos = [0, .7, 8], fov = 44;
  sea(c, t, pos, aimAE(pos, SEA_MOON[0] + 4, SEA_MOON[1] - moonOff(fov) + 3), fov);
  const hz = toScreen3(aimAE(pos, 0, 0))[1];
  const nv = easeIO(seg(t, TL.NANDI - .6, TL.NANDI + .3));
  if (nv < 1) { c.save(); c.globalAlpha = 1 - nv; c.translate(560, hz + 60); c.scale(-1.1, 1.1); shark2(c, { bend: .2 * Math.sin(t * 2), tail: .2 * Math.sin(t * 3) }); c.restore(); }
  glow(c, 540, hz - 60, 520, '#FFE8B0', .45 * nv);
  if (nv > 0) { c.save(); c.globalAlpha = nv; figure(c, (f) => { f.translate(560, hz + 150); f.scale(1.15, 1.15); nandiLying(f, { t, look: -.2 }); }, LIGHTS.moon); c.restore(); }
  flashK(c, t, TL.NANDI - .15, '255,236,200', .45, 3);
  capBand(c, .5);
} });

// ================= L · Those fishermen call themselves PARVATHA RAJA KULAM: the family of PARVATI'S father =================
SHOTS.push({ a: TL.L0, b: TL.M0 + .3, xf: .4, draw(c, u, t) {
  const k = R_(t, TL.L0, TL.M0 + .3);
  const pos = orbit(lerp(160, 140, k), lerp(3, 6, k), lerp(8.5, 7.2, k), 1.1), at = off(SUA, [0, 1.4, 0]);
  aruna(c, t, pos, at, 44, DUSK, { fire: 0, sky: ['dusk', 'blue', k * .5], fireO: { potYaw: -1.6, tins: 1 } }, lens(dist(at), 1.4, { max: 6 }));
  lighters(c, t);
  topTitle(c, t, TL.KULAM - .25, TL.M0, 'பர்வதராஜகுலம்', 'Parvatha Raja Kulam', { font: `800 80px ${TAMIL}`, y: 470, dy: 94, sfont: 'italic 46px Marcellus', bandA: .45 });
  capBand(c, .5);
} });

// ================= M · So every Karthigai, the BRIDE'S family climbs HIS mountain… =================
SHOTS.push({ a: TL.M0, b: TL.M1 + .25, xf: .35, draw(c, u, t) {
  const k = R_(t, TL.M0, TL.M1 + .25), pos = orbit(265, 0, 40, 30);
  aruna(c, t, pos, aimAE(pos, lerp(262, 266, k), lerp(4, 6, k)), 50, DUSK, { fire: 0, sky: ['dusk', 'blue', .3], sunAt: [-.98, .03, .1] }, lens(5000, 0));
  climbers(c, t - TL.M0 + 7, { torch: true, light: 'fire', x0: 40 });
  capBand(c, .5);
} });

// ================= M1 · and lights his FIRE (the ignition, then the whole hill) =================
const N1 = TL.DAYS - .55, M2 = TL.FIRE + .75;
SHOTS.push({ a: TL.M1, b: M2, draw(c, u, t) {
  const ig = TL.FIRE - .05, on = easeOut(seg(t, ig, ig + .5)), sh = shakeAt(t, ig, .25), k = seg(t, TL.M1, M2);
  const pos = off(orbit(lerp(200, 204, k), 5, lerp(9, 10, k), 1.9), [sh[0], sh[1], 0]), at = off(SUA, [0, 1.0, 0]);
  aruna(c, t, pos, at, 44, { ...DUSK, sky: ['dusk', 'blue', .8], exposure: 1.25 }, { fire: on, fireO: potO({ rocks: false, potYaw: -1.95, flare: .6 * (1 - seg(t, ig + .4, ig + 2)), tins: 1 }) }, lens(dist(SU), .9, { max: 5 }));
  lighters(c, t);
  flashK(c, t, ig, '255,214,150', .6, 4);
  capBand(c, .5);
} });
// the whole hill blazing, pulling back
SHOTS.push({ a: M2, b: N1 + .3, draw(c, u, t) {
  HILLWIDE(c, t, easeOut(seg(t, M2, N1 + .3)), 150, 145, 1100, 1900, { flare: .5 * (1 - seg(t, M2, M2 + 1.5)) });
  capBand(c, .5);
} });

// ================= N · It burns for 11 DAYS. Who would YOU go see it with? TAG them =================
const TP = TEMPLE, RAJA = V3(TP.x + 120, TP.y, TP.z);
const HOOK_POS = (k) => at3(k, [RAJA.x + 470, 22, RAJA.z + 560], [RAJA.x + 360, 28, RAJA.z + 450]);
SHOTS.push({ a: N1, b: TL.CARD, xf: .4, draw(c, u, t) {
  const k = R_(t, N1, TL.CARD), pos = HOOK_POS(.2 + .6 * k), at = [300, lerp(300, 340, k), 300];
  aruna(c, t, pos, at, 34, { ...BLUE }, { moon: [(aeA(pos, at) + 3) * D2R, 24 * D2R, { size: .045, stars: 0 }], fireO: { beacon: .012 } }, lens(dist(SU), .6));
  bigNum(c, t, TL.DAYS - .15, TL.CARD, '11 DAYS', 'and nights, on the summit', { y: 470 });
  fadeK(c, seg(t, TL.CARD - .35, TL.CARD) * .6);
  capBand(c, .72);
} });
function aeA(pos, at) { const d = V3(at[0] - pos[0], at[1] - pos[1], at[2] - pos[2]).normalize(); return Math.atan2(d.x, -d.z) / D2R; }

// ================= the card =================
SHOTS.push({ a: TL.CARD, b: TL.END + 1, draw(c, u, t) {
  rkCardCine(c, u, t, { title: 'MEET OUR GODS', line: 'Picture books of our gods, for kids', price: 'The Navadurga Set is out now', note: 'Link in bio' });
} });
