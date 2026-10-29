// kerala.js: "Kerala was pulled out of the SEA" (ad 62, Kerala Piravi, 1 Nov), the 3D style in the film look, no voice.
// Parshurama, a lit silhouette, on a headland at sunset, his axe raised; he had won the earth from arrogant kings and
// given it all away (MBh 12.49); Kashyapa told him he could not live on land he had given; the ocean made new land for
// him (MBh 12.49). Kerala's own legend (the Keralolpathi): at Gokarna he prayed to Varuna and threw his axe; the sea drew
// back as far as it flew, Gokarna to Kanyakumari: Parashurama Kshetram. On the real map (DEM) the old sea laps the Ghats
// and draws back behind the flying axe. Then science: the coastal plain is young land, the sea once came further in,
// the backwaters began as a bay shut in by sand bars, Kuttanad is farmed below sea level. Happy Kerala Piravi, the
// districts light up: which part are you from? The card. STORYBOARD.md has the plan and the sources.
LOOK.bloom = .06; LOOK.vignette = .6; LOOK.grain = .06;

const I3 = india3(), KP = keralaPatch(I3), ROWS = keralaCoast(), SEA = oldSea(I3, ROWS);
const COAST = line3(I3.scene, ROWS.map(([lo, la]) => I3.at(lo, la, .12)), { col: '#FFD27A', add: true, core: .8 });
const GOK = pillar3(I3.scene, I3.at(74.32, 14.54), { h: 14, r: .45, col: '#FFD27A' }), KAN = pillar3(I3.scene, I3.at(77.54, 8.09), { h: 14, r: .45, col: '#FFD27A' });
const DIST = [['Kasaragod', 74.99, 12.50], ['Kannur', 75.37, 11.87], ['Wayanad', 76.08, 11.61], ['Kozhikode', 75.78, 11.25], ['Malappuram', 76.07, 11.07],
  ['Palakkad', 76.65, 10.78], ['Thrissur', 76.21, 10.53], ['Ernakulam', 76.27, 9.98], ['Idukki', 76.97, 9.85], ['Kottayam', 76.52, 9.59],
  ['Alappuzha', 76.34, 9.49], ['Pathanamthitta', 76.79, 9.26], ['Kollam', 76.61, 8.89], ['Thiruvananthapuram', 76.94, 8.52]];
const LAMPS = DIST.map(([, lo, la]) => pillar3(I3.scene, I3.at(lo, la), { h: 5, r: .22, col: '#FFC860' }));
const OLD = 70;   // the old sea's level (m) in the legend: up to the foot of the Ghats
// the whole coast, north up (Kerala is a tall strip: it fills the 9:16 frame): k 0..1 eases between two distances
const KMID = I3.at(76.0, 11.1);
const kerCam = (d = 1, dx = 0, mid = KMID) => cam3({ pos: [mid[0] + 8 + dx, 150 * d, mid[2] + 105 * d], at: [mid[0] + 1, 0, mid[2] + 7], fov: 40 });
const lerp3 = (a, b, k) => a.map((v, i) => lerp(v, b[i], k));
// the map's mood each frame (also hides the per-shot marks)
function mapMood(name, at, o = {}) {
  CAM3.near = 1; CAM3.far = 12000;
  const ex = I3.mood(name, { at, shadow: o.shadow ?? 160, sunAt: o.sunAt, fogNear: o.fogNear ?? 400, fogFar: o.fogFar ?? 2600, focus: 0, edge: 0, hemi: o.hemi });
  KP.sync(); I3.set(o.t || 0, { clouds: o.clouds ?? .15 }); I3.border.set(0); I3.lanka.set(0);
  COAST.set(0); GOK.set(0, 0); KAN.set(0, 0); LAMPS.forEach(l => l.set(0, 0)); SEA.set(() => 0, 0);
  return ex;
}
const FXM = (o = {}) => ({ bloom: { k: o.bloom ?? .25, thresh: 1 }, grade: { contrast: 1.07, sat: 1.12, temp: o.temp ?? .06, shadows: '#1A1430', highlights: '#FFE0B0', split: .08 }, ca: .001 });
// the sweep: how far the axe has flown (0 Gokarna .. 1 Kanyakumari) and the sea's level behind it
const sweepK = t => easeIO(seg(t, TL.SWEEP0, TL.SWEEP1));
const levelAt = p => lat => { const fl = lerp(KER_N + .1, KER_S - .3, p); return OLD * (1 - smooth01((lat - fl) / .7)); };
function smooth01(x) { x = clamp(x); return x * x * (3 - 2 * x); }
const rowAt = p => { const f = p * (ROWS.length - 1), i = Math.floor(f), r0 = ROWS[i], r1 = ROWS[Math.min(i + 1, ROWS.length - 1)], k = f - i; return [lerp(r0[0], r1[0], k), lerp(r0[1], r1[1], k)]; };

const CAPY = 1385, TOPY = 540, TOP = new Set(['hook', 'kashyapa', 'varuna', 'throw']);   // over the shore, the captions sit in the sky
const topAt = t => CAPS.some(([id, a, b]) => TOP.has(id) && t >= a - .2 && t <= b + .2);
POST.push((c, t) => { if (t < TL.CARD) topAt(t) ? band(c, 400, 700, .35) : band(c, 1200, 1500, .4); });
CAPS.forEach(([id, a, b, txt], i) => {
  const o = { y: TOP.has(id) ? TOPY : CAPY };
  if (!i) { o.size = 66; const n = txt.split(/\s+/).filter(w => w && w !== '|').length; o.at = Array(n).fill(-1); }
  say(a, b, txt, o);
});

// ================= A · the hook: Parshurama on the headland at sunset, the axe raised =================
const heroCam = (t, a, b, z0, z1) => ({ z: lerp(z0, z1, easeIO(seg(t, a, b))), fx: 700, fy: 1200 });
function hero(c, t, o = {}) {
  const cam = o.cam || {};
  shore(c, t, { sun: [300, 1000], glow: o.glow || 0, cam });
  const ft = headland(c, cam);
  plane(c, cam, 1, c => {
    c.save(); c.translate(ft[0], ft[1]); c.scale(.76, .76);
    figure(c, f => psrSil(f, { t, arm: o.arm ?? -1.42, axe: o.axe ?? true, reach: o.reach || 0, wind: .6 }), LIGHTS.dawnBack);
    if (o.axe !== false) { const Hd = psrHand(o.arm ?? -1.42); parashuGlow(c, Hd[0], Hd[1], o.arm ?? -1.42, 1, o.axeGlow ?? 1, t); }
    c.restore();
  });
}
SHOTS.push({ a: 0, b: TL.B0 + .4, draw(c, u, t) {
  hero(c, t, { cam: heroCam(t, 0, 4.4, 1.0, 1.08), arm: -1.42 - .04 * Math.sin(t * 1.4) });
} });

// ================= B · he had won the earth from arrogant kings, and given all of it away =================
SHOTS.push({ a: TL.B0, b: TL.C0 + .4, xf: .45, draw(c, u, t) {
  const p = I3.at(80, 21), ex = mapMood('golden', p, { shadow: 500, fogNear: 2000, fogFar: 9000, clouds: .08, t }); I3.mood('golden', { at: p, shadow: 500, fogNear: 2000, fogFar: 9000, focus: .5, edge: 1 }); KP.sync();
  const k = easeIO(u / 4), give = easeIO(seg(t, TL.C0 - 1.6, TL.C0 - .2));
  I3.border.set(1, lerp(2.4, 3.2, k), 1 - .85 * give);
  const cam = cam3({ pos: [p[0] + lerp(-30, 0, k), lerp(560, 640, k), p[2] + lerp(420, 470, k)], at: [p[0], 0, p[2] + 20], fov: 40 });
  render3(c, I3.scene, cam, { exposure: ex, fx: FXM() });
  if (give > 0) glow(c, 540, 820, 600, '#FFC060', .25 * Math.sin(Math.PI * give));
} });

// ================= C · Sage Kashyapa: you can't live on land you have given away =================
SHOTS.push({ a: TL.C0, b: TL.D0 + .4, xf: .4, draw(c, u, t) {
  const cam = { z: lerp(1.02, 1.08, easeIO(u / 3.8)), fx: 540, fy: 1300 };
  sky(c, [[0, '#1A1030'], [600, '#5A2E4A'], [1000, '#D8784A'], [1240, '#FFC07A'], [1320, '#F09A5A']]);
  plane(c, cam, .2, c => { glow(c, 540, 1240, 800, '#FFB060', .5, 'screen'); sunDisc(c, 540, 1250, 90, t, { col: '#FFE6B0' }); });
  plane(c, cam, .4, c => ridge(c, 1250, 60, 7, '#3A1E30'));
  plane(c, cam, .7, c => ridge(c, 1330, 40, 3, '#1E1020'));
  plane(c, cam, 1, c => {
    c.fillStyle = '#0A0610'; c.fillRect(-200, 1540, W + 400, H);
    c.save(); c.translate(290, 1560); c.scale(-.78, .78); figure(c, f => rishi(f, { t, pose: 'stand' }), LIGHTS.dawnBack); c.restore();   // Kashyapa, facing right
    c.save(); c.translate(790, 1560); c.scale(.76, .76); figure(c, f => psrSil(f, { t, arm: 1.35, axe: true, wind: .3 }), LIGHTS.dawnBack); c.restore();
  });
} });

// ================= D · the Mahabharata: the ocean made new land for him (the old sea at the Ghats) =================
SHOTS.push({ a: TL.D0, b: TL.E0 + .4, xf: .45, draw(c, u, t) {
  const p = I3.at(75.6, 11.6), ex = mapMood('golden', p, { shadow: 140, clouds: 0, t, sunAt: [-.8, .35, .3] });
  SEA.set(() => OLD, .9);
  const k = easeIO(u / 3.8);
  const cam = cam3({ pos: [p[0] - lerp(64, 42, k), lerp(62, 40, k), p[2] + lerp(44, 30, k)], at: [p[0] + 9, 0, p[2] - 8], fov: 44 });
  render3(c, I3.scene, cam, { exposure: ex, fx: FXM() });
  pin3(c, 'WESTERN GHATS', I3.at(76.3, 11.9, 3), t, TL.D0 + 1.2, { size: 30, col: '#FFFFFF', spacing: 4, alpha: seg(t, TL.D0 + 1.2, TL.D0 + 1.6) * .9 });
} });

// ================= E · Kerala's own legend: he stood at Gokarna (the sea over the whole coast) =================
SHOTS.push({ a: TL.E0, b: TL.F0 + .4, xf: .4, draw(c, u, t) {
  const g = I3.at(74.32, 14.54), ex = mapMood('golden', g, { shadow: 120, clouds: 0, t, sunAt: [-.8, .3, .2] });
  SEA.set(() => OLD, .9); GOK.set(t, seg(t, TL.E0 + 1.6, TL.E0 + 2.4));
  const k = easeIO(u / 3.8);
  const cam = cam3({ pos: [g[0] + lerp(-40, -26, k), lerp(70, 34, k), g[2] - lerp(40, 26, k)], at: [g[0] + 4, 0, g[2] + lerp(40, 22, k)], fov: 44 });
  render3(c, I3.scene, cam, { exposure: ex, fx: FXM() });
  pin3(c, 'GOKARNA', I3.at(74.32, 14.54, 15), t, TL.E0 + 1.8, { size: 46, col: '#FFE2A0', dy: -24, spacing: 6 });
} });

// ================= F, G · he prayed to Varuna; then he threw his axe =================
SHOTS.push({ a: TL.F0, b: TL.H0 + .3, xf: .45, draw(c, u, t) {
  const T0 = TL.THROW, wind = easeIO(seg(t, TL.F0 + 1.6, T0 - .3)), sw = easeIn(seg(t, T0 - .12, T0 + .14));
  let arm = lerp(1.35, -1.05, wind); arm = lerp(arm, 2.5, sw);
  const rel = T0 + .02, flying = t > rel, gl = seg(t, TL.F0 + .3, TL.F0 + 1.4) * (1 - .6 * seg(t, T0, T0 + .6));
  const z = t < T0 ? lerp(1.0, 1.12, easeIO(seg(t, TL.F0, T0))) : lerp(1.12, 1.0, easeOut(seg(t, T0, T0 + 1.2)));
  const shake = t > T0 ? Math.exp(-(t - T0) * 6) * 12 : 0;
  const cam = { z, fx: 700, fy: 1200, x: Math.sin(t * 61) * shake, y: Math.cos(t * 53) * shake };
  hero(c, t, { cam, arm, axe: !flying, reach: wind * .4 + sw * .6, glow: gl, axeGlow: .6 + .4 * wind });
  if (flying) {   // the axe flies away over the sea toward the sunset, spinning, a trail of light behind it
    const f = seg(t, rel, rel + 2.2);
    plane(c, cam, 1, c => {
      const P = s => { const e = easeOut(s); return [lerp(780 + psrHand(-2.6)[0] * .76, 300, e), lerp(1706 + psrHand(-2.6)[1] * .76, 1010, e) - Math.sin(Math.PI * Math.min(1, s * 1.1)) * 260]; };
      for (let i = 12; i >= 1; i--) { const s = Math.max(0, f - i * .025), [x, y] = P(s); glow(c, x, y, 70 * (1 - f * .7), '#FFC060', .2 * (1 - i / 12)); }
      const [x, y] = P(f), k = lerp(.76, .08, easeOut(f));
      parashuGlow(c, x - Math.cos(t * 22) * 160 * k, y - Math.sin(t * 22) * 160 * k, t * 22, k, 1 - seg(f, .9, 1), t);
    });
    flash(c, Math.exp(-(t - rel) * 9) * .5, '#FFE6B0');
  }
} });

// ================= H · the sea draws back as far as it flew, Gokarna to Kanyakumari =================
SHOTS.push({ a: TL.H0, b: TL.I0 + .4, xf: .3, draw(c, u, t) {
  const p = sweepK(t), [alo, ala] = rowAt(p), A = I3.at(alo, ala);
  const mid = I3.at(75.8, 11.3), ex = mapMood('golden', mid, { shadow: 260, clouds: .12, t, sunAt: [-.85, .32, .25] });
  SEA.set(levelAt(p), .9); COAST.set(p, 1.1, 1); GOK.set(t, 1); KAN.set(t, seg(t, TL.KANYA - .4, TL.KANYA + .4));
  // the camera rides behind the axe, high over the sea, looking south down the coast
  const k = easeIO(seg(t, TL.H0, TL.I0)), q = Math.min(1, p + .12), [blo, bla] = rowAt(Math.max(0, p - .18)), B = I3.at(blo, bla);
  const fin = easeIO(seg(t, TL.SWEEP1 - 1.4, TL.I0 + .4));
  const KC = kerCam(1), pos = lerp3([B[0] - 36, 52, B[2] - 30], KC.position.toArray(), fin), at = lerp3(I3.at(...rowAt(q)), [KMID[0] + 1, 0, KMID[2] + 7], fin);
  render3(c, I3.scene, cam3({ pos, at, fov: lerp(46, 40, fin) }), { exposure: ex, fx: FXM({ bloom: .3 }) });
  // the axe of light, spinning, a little above the coast
  if (p < .995) {
    const ax = [A[0] - 1.5, 4 + 3 * Math.sin(Math.PI * p), A[2]], [x, y, zz] = toScreen3(ax);
    if (zz < 1) { for (let i = 1; i <= 8; i++) { const [tx, ty] = toScreen3(I3.at(...rowAt(Math.max(0, p - i * .012)), 4)); glow(c, tx, ty, 50, '#FFC060', .22 * (1 - i / 8)); }
      parashuGlow(c, x, y, t * 20, .16, 1, t); }
  }
  pin3(c, 'GOKARNA', I3.at(74.32, 14.54, 15), t, TL.H0, { size: 38, col: '#FFE2A0', dy: -20, spacing: 5, alpha: 1 - fin * .3 });
  pin3(c, 'KANYAKUMARI', I3.at(77.54, 8.09, 15), t, TL.KANYA, { size: 42, col: '#FFE2A0', dy: -20, spacing: 5 });
} });

// ================= I · Parashurama Kshetram =================
SHOTS.push({ a: TL.I0, b: TL.J0 + .4, xf: .4, draw(c, u, t) {
  const mid = I3.at(76.0, 11.0), ex = mapMood('golden', mid, { shadow: 260, clouds: 0, t, sunAt: [-.85, .32, .25] });
  COAST.set(1, 1.1, 1); GOK.set(t, 1); KAN.set(t, 1);
  const k = easeIO(u / 4);
  render3(c, I3.scene, kerCam(lerp(1, .94, k), lerp(0, -8, k)), { exposure: ex, fx: FXM({ bloom: .3 }) });
  const a = seg(t, TL.I0 + .1, TL.I0 + .6);
  text(c, 'परशुराम क्षेत्रम्', 540, 520, '64px "Tiro Devanagari Sanskrit"', '#FFE2A0', { alpha: a, glow: ['rgba(255,170,60,.8)', 24], pop: t - TL.I0 - .1 });
  text(c, 'THE LAND OF PARSHURAMA', 540, 610, '700 46px Cinzel', '#F4C46A', { alpha: a, spacing: 4, glow: ['rgba(10,6,4,.9)', 16], maxW: 980 });
} });

// ================= J, K · science: the coastal plain is young land; the sea once came further inland =================
SHOTS.push({ a: TL.J0, b: TL.K0 + .4, xf: .45, draw(c, u, t) {
  const p = I3.at(76.1, 10.2), ex = mapMood('day', p, { shadow: 120, clouds: .25, t, sunAt: [-.3, .8, .5] });
  // THEN: the sea rises a little over the lowlands; TODAY: it drains back to the shore
  const up = easeIO(seg(t, TL.RISE0, TL.RISE0 + 1.4)) * (1 - easeIO(seg(t, TL.K0 - 1.2, TL.K0 + .2)));
  SEA.set(() => 14 * up, .85 * clamp(up * 3)); COAST.set(1, .5, .7 * (1 - up));
  const k = easeIO(u / 7.6);
  render3(c, I3.scene, cam3({ pos: [p[0] - lerp(46, 30, k), lerp(70, 52, k), p[2] + lerp(40, 30, k)], at: [p[0] + 2, 0, p[2] - 4], fov: 44 }), { exposure: ex, fx: FXM({ temp: 0 }) });
  pin3(c, 'COASTAL PLAIN', I3.at(75.95, 10.6, 1.5), t, TL.J0 + 1.4, { size: 34, col: '#FFFFFF', spacing: 4, alpha: seg(t, TL.J0 + 1.4, TL.J0 + 1.8) * (1 - seg(t, TL.RISE0, TL.RISE0 + .4)) });
  const th = seg(t, TL.RISE0 + .4, TL.RISE0 + .8) * (1 - seg(t, TL.K0 - 1.2, TL.K0 - .9)), td = seg(t, TL.K0 - .8, TL.K0 - .4);
  if (th > 0) text(c, 'THEN', 540, 560, '700 64px Cinzel', '#BFF4FF', { alpha: th, spacing: 10, glow: ['rgba(4,10,20,.9)', 20] });
  if (td > 0) text(c, 'TODAY', 540, 560, '700 64px Cinzel', '#FFE2A0', { alpha: td, spacing: 10, glow: ['rgba(4,10,20,.9)', 20] });
} });

// ================= K, L · the backwaters, a bay shut in by sand bars; Kuttanad below sea level =================
SHOTS.push({ a: TL.K0, b: TL.L0 + .4, xf: .4, draw(c, u, t) {
  const v = I3.at(76.36, 9.6), ex = mapMood('day', v, { shadow: 60, clouds: 0, t, sunAt: [-.3, .8, .5] });
  const k = easeIO(u / 7.6);
  render3(c, I3.scene, cam3({ pos: [v[0] - lerp(14, 9, k), lerp(26, 18, k), v[2] + lerp(16, 12, k)], at: [v[0] + .8, 0, v[2] - .6], fov: 44 }), { exposure: ex, fx: FXM({ temp: 0 }) });
  pin3(c, 'VEMBANAD', I3.at(76.39, 9.72, .6), t, TL.K0 + .6, { size: 36, col: '#BFF4FF', spacing: 5, dx: 40 });
  pin3(c, 'sand bar', I3.at(76.27, 9.78, .6), t, TL.K0 + 1.6, { font: '32px Marcellus', col: '#FFE2A0', dx: -90, alpha: seg(t, TL.K0 + 1.6, TL.K0 + 2) });
  pin3(c, 'KUTTANAD', I3.at(76.42, 9.42, .6), t, TL.KUTT + .2, { size: 36, col: '#FFE2A0', spacing: 5, dx: 40 });
} });

// ================= L · the legend says the sea drew back; the land says so too =================
SHOTS.push({ a: TL.L0, b: TL.M0 + .4, xf: .45, draw(c, u, t) {
  const mid = I3.at(76.0, 11.0), ex = mapMood('golden', mid, { shadow: 260, clouds: 0, t, sunAt: [-.85, .32, .25] });
  COAST.set(1, 1.1, 1);
  const k = easeIO(u / 4);
  render3(c, I3.scene, kerCam(lerp(.8, 1.05, k), lerp(-6, 4, k)), { exposure: ex, fx: FXM({ bloom: .3 }) });
} });

// ================= M · Happy Kerala Piravi; the districts light up: which part are you from? =================
SHOTS.push({ a: TL.M0, b: TL.CARD + .2, xf: .45, draw(c, u, t) {
  const mid = I3.at(76.0, 10.4), ex = mapMood('golden', mid, { shadow: 260, clouds: 0, t, sunAt: [-.85, .32, .25] });
  COAST.set(1, .7, .55);
  const k = easeIO(u / 7.4);
  render3(c, I3.scene, kerCam(lerp(.78, .72, k), -6, mid), { exposure: ex * .92, fx: FXM({ bloom: .4, temp: .1 }) });
  DIST.forEach(([nm, lo, la], i) => {
    const at = TL.M0 + .6 + i * .22; LAMPS[i].set(t, seg(t, at, at + .5));
    const left = ['Kasaragod', 'Kannur', 'Kozhikode', 'Thrissur', 'Ernakulam', 'Alappuzha'].includes(nm);
    pin3(c, nm, I3.at(lo, la, 2), t, at + .2, { font: '500 28px Poppins', col: '#FFF0D0', dx: left ? -18 - nm.length * 8 : 18 + nm.length * 8, spacing: 0, glow: ['rgba(10,6,18,.95)', 10] });
  });
} });

// ================= N · the card =================
SHOTS.push({ a: TL.CARD, b: TL.END + 1, draw(c, u, t) {
  rkCardCine(c, u, t, { title: 'MEET OUR GODS', line: 'Picture books of our gods, for kids', price: 'Books 1–3 · set of 3 for ₹500', note: 'Parshurama series · coming soon' });
} });
