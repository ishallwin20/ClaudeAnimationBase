// sita.js: "Was RAM right to leave SITA?" (ad 67), Cinematic with the 3D India map as its spine. The reel takes no side:
// four poets testify, each pinned on the map where they wrote. Valmiki (Uttara Kanda, Critical Edition): Ayodhya's
// whispers (7.42), Ram's "my heart knows she is pure… I'd give up my life" (7.44); Kalidasa (Raghuvamsha 14): Sita's
// message to the king (14.61), her prayer for him in her next life (14.66), "cast out of his house, never out of his
// heart" (14.84); Valmiki again: Ram asks forgiveness (7.88.3), Sita's oath and the Earth (7.88.10–14), the golden Sita
// (7.89.4); Bhavabhuti reunites them; Tulsidas has no exile (Manas, Uttarkand 25); the crowd at the oath was divided
// (7.87.12). The ask: which Ramayan did you grow up with? The card: Books 1–3. STORYBOARD.md has the plan.
LOOK.bloom = .12; LOOK.vignette = .62; LOOK.grain = .07;
const I3 = india3({ bbox: [66, 5, 97, 36], vex: 8 }); CAM3.far = 12000;
const CAPY = 1400;
const RAM_EYE = [440, 850];   // the eye of the close Ram (shot D), for the tear
POST.push((c, t) => { if (t > TL.B0 && t < TL.CARD) band(c, 1270, 1540, .42); });
VO.caps.forEach((k, i) => say(i ? k.a : -1, k.b, k.text, { at: i ? k.at : k.at.map(() => -1), y: i ? CAPY : 560, ...(i ? {} : { size: 66 }) }));

// ---------- the map ----------
const pp = (s, lift = 0) => I3.at(s.lon, s.lat, lift);
const PIL = Object.fromEntries(POET_ORDER.map(k => [k, pillar3(I3.scene, pp(POET[k]), { h: 30, r: .9, col: '#FFC860' })]));
const reset = () => { Object.values(PIL).forEach(p => { p.set(0, 0); p.scale.setScalar(1); }); I3.border.set(0); I3.lanka.set(0); I3.set(0); CAM3.near = .5; I3.ground.scale.y = 1; };
const mapCam = (lon, lat, alt, back, az = 0, o = {}) => {
  const c = I3.at(lon, lat), pos = [c[0] + Math.sin(az) * back, alt, c[2] + Math.cos(az) * back];
  return { cam: cam3({ pos, at: [c[0], o.ay ?? 0, c[2]], fov: o.fov ?? 42 }), d: Math.hypot(back, alt) };
};
const golden = (p, o = {}) => I3.mood('golden', { at: p, shadow: o.shadow ?? 300, sunAt: o.sunAt || [-.75, .42, .5], fogNear: o.fogNear ?? 600, fogFar: o.fogFar ?? 5000, hemi: o.hemi ?? .8, sun: o.sun ?? 3, ...o });
// matte: a warm grade, no sparkle (owner, 30 Oct: not too shiny)
const FXM = (o = {}) => ({ grade: { contrast: 1.06, sat: 1.05, temp: .06, shadows: '#1C1830', highlights: '#FFD8A0', split: .08, ...(o.grade || {}) } });
// a poet's pillar shot: the camera settles over the place as the name lands
function poetShot(c, u, t, key, dur, at, o = {}) {
  reset(); const P = POET[key], ex = golden(pp(P), { fogNear: 300, fogFar: 3000, shadow: 120 }); I3.set(t, { clouds: .25 });
  POET_ORDER.forEach(k => { PIL[k].scale.setScalar(.6); PIL[k].set(t, k === key ? seg(t, at - .5, at + .2) : .35); });
  I3.border.set(1, .5, .3);
  const k = easeOut(clamp(u / dur)), C = mapCam(P.lon, P.lat - .3, lerp(o.alt0 ?? 150, o.alt1 ?? 75, k), lerp(o.b0 ?? 140, o.b1 ?? 70, k), o.az ?? .25, { fov: 42, ay: 4 });
  render3(c, I3.scene, C.cam, { exposure: ex * 1.05, fx: FXM() });
  stopLabel(c, P, pp(P, 20), t, at, { big: 1.15, dy: -90 });
}

// ================= A · the hook: Sita alone on the Ganga's bank at dusk; the boat going away =================
SHOTS.push({ a: 0, b: TL.B0 + .4, draw(c, u, t) {
  const cam = { z: lerp(1, 1.06, easeIO(u / 2.6)), fx: 470, fy: 900 };
  duskRiver(c, cam, t, { boat: .1 + u * .05 });
  plane(c, cam, 1, (c) => figure(c, (f) => { f.translate(470, 2120); f.scale(1.32, 1.32); sita(f, { t, eyes: .4, wind: .55, tears: .4 }); }, { ...LIGHTS.moon, rim: { ...LIGHTS.moon.rim, dx: 8, a: .9 } }));
  band(c, 470, 660, .45);
} });

// ================= B · "We won't judge. Four poets will.": four pillars rise across India =================
SHOTS.push({ a: TL.B0, b: TL.C0 + .4, xf: .35, draw(c, u, t) {
  reset(); CAM3.near = 4; const ex = I3.mood('golden', { at: I3.at(80, 22), shadow: 1400, fogNear: 2500, fogFar: 9000, sunAt: [-.8, .45, .4], focus: .55, edge: .5 }); I3.set(t, { clouds: .25 });
  I3.border.set(1, 3.2, .4);
  POET_ORDER.forEach((k, i) => { PIL[k].scale.setScalar(2.6); PIL[k].set(t, seg(t, TL.POETS - .3 + i * .22, TL.POETS + .3 + i * .22)); });
  const k = easeIO(clamp(u / (TL.C0 + .4 - TL.B0)));
  const C = mapCam(80.5, 21.5, lerp(560, 470, k), lerp(330, 280, k), -.05, { fov: 40 });
  render3(c, I3.scene, C.cam, { exposure: ex * 1.04, fx: FXM() });
  POET_ORDER.forEach((key, i) => stopLabel(c, { name: POET[key].name }, pp(POET[key], 2), t, TL.POETS + .1 + i * .22, { big: .62, dy: key === 'tulsi' ? -40 : key === 'valmiki' ? -60 : 50, dx: key === 'tulsi' ? 70 : key === 'valmiki' ? -60 : 0 }));
  chip(c, '2,000 YEARS', 540, 560, t, TL.POETS + 1.1, { size: 44 });
} });

// ================= C · "First, VALMIKI.": down to his pillar by the Ganga =================
SHOTS.push({ a: TL.C0, b: TL.C1 + .35, xf: .3, draw(c, u, t) { poetShot(c, u, t, 'valmiki', TL.C1 + .35 - TL.C0, TL.VALMIKI - .1, { alt0: 260, b0: 220 }); } });

// ================= C1 · Ayodhya whispered: the lanes at night, Ram small on his terrace =================
SHOTS.push({ a: TL.C1, b: TL.D0 + .4, xf: .3, draw(c, u, t) {
  const k = easeIO(clamp(u / (TL.D0 + .4 - TL.C1)));
  const cam = { z: lerp(1.0, 1.12, k), fx: 520, fy: 1100, y: lerp(0, -40, k) };
  ayodhya(c, cam, t, { lean: seg(t, TL.RAVANA - .3, TL.RAVANA + .3), murmur: .2 + .3 * seg(t, TL.RAVANA, TL.RAVANA + 1) });
} });

// ================= D · Ram close at the window: "My heart knows she is pure… I'd give up my own life." =================
SHOTS.push({ a: TL.D0, b: TL.E0 + .4, xf: .4, draw(c, u, t) {
  const k = easeIO(clamp(u / (TL.E0 + .4 - TL.D0))), cam = { z: lerp(1, 1.1, k), fx: 470, fy: 820 };
  plane(c, cam, 0, (c) => { sky(c, [[0, '#04060F'], [900, '#121838'], [1920, '#0A0C1E']]); stars(c, 50, 3, t, .5); });
  plane(c, cam, .2, (c) => { glow(c, 760, 760, 520, '#9FB4F0', .35); ellipse(c, 760, 760, 150, 150, '#E8EEFA'); ellipse(c, 720, 730, 30, 26, '#D2DAEC'); ellipse(c, 800, 800, 22, 18, '#D6DEEE'); });
  plane(c, cam, .6, (c) => jharokha(c, 620, 1560, 900, 1260, '#07060E'));
  plane(c, cam, 1, (c) => {
    figure(c, (f) => { f.translate(520, 2260); f.scale(1.75, 1.75); ramSil(f, { t, col: '#06050C', wind: .2 }); }, { tint: ['#06050C', .9], edge: { col: '#BFD0F5', w: 2.2, a: .6 }, rim: { col: '#EAF1FF', dx: 7, dy: -3, a: .9, blur: 1 } });
    tear(c, RAM_EYE[0], RAM_EYE[1], seg(t, TL.LIFE - .5, TL.LIFE + 1.4), seg(t, TL.LIFE - .6, TL.LIFE - .3));
  });
} });

// ================= E · "In KALIDASA…": his pillar at Ujjain =================
SHOTS.push({ a: TL.E0, b: TL.E1 + .4, xf: .4, draw(c, u, t) { poetShot(c, u, t, 'kalidasa', TL.E1 + .4 - TL.E0, TL.KALIDASA - .1, { az: -.3 }); } });

// ================= E1 · Sita by the river, the boat gone; her message rises in Kalidasa's words =================
const R14_61 = ['वाच्यस्त्वया मद्वचनात् स राजा', 'वह्नौ विशुद्धामपि यत् समक्षम्।', 'मां लोकवादश्रवणादहासीः', 'श्रुतस्य किं तत्सदृशं कुलस्य॥'];
SHOTS.push({ a: TL.E1, b: TL.F0 + .4, xf: .4, draw(c, u, t) {
  const k = easeIO(clamp(u / (TL.F0 + .4 - TL.E1))), cam = { z: lerp(1.04, 1.12, k), fx: 560, fy: 1000 };
  duskRiver(c, cam, t, { hy: 1000, boat: 1 });
  plane(c, cam, 1, (c) => figure(c, (f) => { f.translate(560, 1800); f.scale(1.38, 1.38); sita(f, { t, pose: 'kneel', tears: .5 + .5 * seg(t, TL.GOSSIP - .5, TL.GOSSIP + .5), wind: .5 }); }, { ...LIGHTS.moon, rim: { ...LIGHTS.moon.rim, dx: 8, a: .85 } }));
  c.save(); c.globalAlpha = 1 - seg(t, TL.F0 - .2, TL.F0 + .3);
  R14_61.forEach((ln, i) => { const a = seg(t, TL.E1 + .3 + i * .9, TL.E1 + 1.1 + i * .9); if (a > 0) text(c, ln, 540, 470 + i * 70 - a * 8, '46px "Tiro Devanagari Sanskrit"', '#FFE2A0', { alpha: a, glow: ['rgba(255,170,60,.7)', 18] }); });
  if (t > TL.E1 + 3.8) text(c, 'Raghuvamsha 14.61', 540, 760, 'italic 30px Marcellus', '#F4EEE4', { pop: t - TL.E1 - 3.8, glow: ['rgba(6,6,14,.9)', 14], spacing: 2 });
  c.restore();
} });

// ================= F · "And yet she prays…": Sita from behind, her gaze on the rising sun =================
SHOTS.push({ a: TL.F0, b: TL.G0 + .4, xf: .5, draw(c, u, t) {
  const k = easeIO(clamp(u / (TL.G0 + .4 - TL.F0))), cam = { z: lerp(1.08, 1, k), fx: 540, fy: 900 };
  plane(c, cam, 0, (c) => { sky(c, [[0, '#24183A'], [500, '#6A3A4A'], [900, '#E09A6A'], [1150, '#FFE2A8'], [1400, '#E8A870']]); });
  plane(c, cam, .1, (c) => { glow(c, 540, 900, 700, '#FFD890', .55); ellipse(c, 540, 900, 210, 210, '#FFF4D8'); rays(c, 540, 900, { n: 16, dir: -Math.PI / 2, spread: 3.4, len: 1100, w: 160, col: '#FFE2A0', a: .25, t }); });
  plane(c, cam, .3, (c) => { ridge(c, 1180, 70, 3, '#5A3040', { freq: .005 }); for (const x of [150, 930]) hut(c, x, 1210, .6, {}); });
  plane(c, cam, .6, (c) => { fillPath(c, `M -200 1250 L ${W + 200} 1250 L ${W + 200} 2200 L -200 2200 Z`, '#24121C'); haze(c, 1250, 120, '#E8A870', .4); });
  plane(c, cam, 1, (c) => figure(c, (f) => { f.translate(540, 2150); f.scale(1.5, 1.5); sitaBack(f, { t, wind: .45 }); }, LIGHTS.dawnBack));
  plane(c, cam, 1.2, (c) => motes(c, { n: 40, seed: 5, box: [-50, 300, W + 50, 1500], r: 3, col: '#FFE2A0', a: .5, vx: 8, vy: -20, t }));
} });

// ================= G · "Cast out of his house. Never out of his heart.": Ram alone under the winter moon =================
SHOTS.push({ a: TL.G0, b: TL.H0 + .4, xf: .5, draw(c, u, t) {
  const k = easeIO(clamp(u / (TL.H0 + .4 - TL.G0))), cam = { z: lerp(1.12, 1.02, k), fx: 600, fy: 900 };
  plane(c, cam, 0, (c) => { sky(c, [[0, '#03050D'], [800, '#0E1634'], [1400, '#1E2448']]); stars(c, 80, 6, t, .6); });
  plane(c, cam, .15, (c) => { glow(c, 700, 640, 480, '#AFC4F5', .38); ellipse(c, 700, 640, 170, 170, '#E8EEFA'); ellipse(c, 650, 600, 34, 28, '#D2DAEC'); });
  plane(c, cam, .4, (c) => { fillPath(c, `M -200 1240 L ${W + 200} 1240 L ${W + 200} 2200 L -200 2200 Z`, '#06050C'); for (let i = 0; i < 12; i++) fillPath(c, `M ${-40 + i * 100} 1240 L ${-40 + i * 100} 1180 L ${-10 + i * 100} 1180 L ${-10 + i * 100} 1240 Z`, '#06050C'); fillPath(c, `M -200 1170 L ${W + 200} 1170 L ${W + 200} 1186 L -200 1186 Z`, '#06050C'); });
  plane(c, cam, 1, (c) => figure(c, (f) => { f.translate(330, 1250); f.scale(-.9, .9); ramSil(f, { t, col: '#06050C', wind: .5 }); }, { ...LIGHTS.moonSilhouette, rim: { col: '#E4EDFF', dx: 4, dy: -2, a: .9 } }));
  plane(c, cam, 1.2, (c) => motes(c, { n: 90, seed: 2, box: [-50, 0, W + 50, 1900], r: 3, col: '#E4EEFF', a: .6, vx: 14, vy: 70, t }));
  if (t > TL.HEART - .1) glow(c, 330, 520, 60 * seg(t, TL.HEART - .1, TL.HEART + .5), '#FFD8A0', .5);
} });

// ---------- the Ashvamedha hall: pillars, the yagna fire, the crowd ----------
function hall(c, cam, t, o = {}) {
  plane(c, cam, 0, (c) => hallSky(c));
  plane(c, cam, .5, (c) => pillars(c, 330, 1250, o.fx ?? 540, '#1A0D0A', t, 7, 46));
  plane(c, cam, .8, (c) => { if (o.fire !== false) { yagna(c, o.fx ?? 540, 1250, o.fw ?? 240, t, 1); embers(c, o.fx ?? 540, 1100, t, 30, 5, 260, 700); } });
}
const fireLit = (dx = 4) => ({ ...LIGHTS.fire, rim: { ...LIGHTS.fire.rim, dx, a: .9 } });

// ================= H · "Years later, at his YAGNA… 'I knew she was SINLESS. Forgive me.'" =================
SHOTS.push({ a: TL.H0, b: TL.I0 + .4, xf: .5, draw(c, u, t) {
  const k = easeIO(clamp(u / (TL.I0 + .4 - TL.H0))), fz = seg(t, TL.SINLESS - .4, TL.FORGIVE + .8);
  const cam = { z: lerp(1, 1.08, k) + .14 * easeIO(fz), fx: lerp(540, 840, easeIO(fz)), fy: 1000 };
  hall(c, cam, t);
  const walk = easeOut(seg(t, TL.H0, TL.TELLS_V));
  plane(c, cam, 1, (c) => {
    figure(c, (f) => { f.translate(lerp(90, 210, walk), 1260); f.scale(-.6, .6); rishi(f, { t }); }, fireLit(-4));
    figure(c, (f) => { f.translate(lerp(200, 330, walk), 1260); f.scale(.58, .58); sita(f, { t, eyes: .35, wind: .15 }); }, { ...fireLit(-4), tint: ['#1A0806', .3] });
    figure(c, (f) => { f.translate(860, 1260); f.scale(.64, .64); ramSil(f, { t, namaste: t > TL.TELLS_V, wind: .15 }); }, fireLit(-5));
    crowd(c, -60, 1140, 1560, 8, 1.2, t, 0, '#0A0504', 2); crowd(c, -100, 1180, 1820, 7, 1.6, t, 0, '#050302', 5);
  });
} });

// ================= I · Sita's oath, close; gold light rising from below on "MOTHER EARTH" =================
SHOTS.push({ a: TL.I0, b: TL.J0 + .4, xf: .4, draw(c, u, t) {
  const k = easeIO(clamp(u / (TL.J0 + .4 - TL.I0))), gl = seg(t, TL.MOTHER - .3, TL.OPEN + .8);
  const cam = { z: lerp(1, 1.08, k) + Math.sin(t * 47) * .002 * gl, fx: 540, fy: 800 };
  plane(c, cam, 0, (c) => { hallSky(c); glow(c, 540, 1900, 900 * gl + 1, '#FFC860', .6 * gl); });
  plane(c, cam, .3, (c) => { for (const x of [120, 960]) fillPath(c, `M ${x - 40} 0 L ${x + 40} 0 L ${x + 40} 1920 L ${x - 40} 1920 Z`, '#140A08'); });
  plane(c, cam, 1, (c) => figure(c, (f) => { f.translate(540, 2930); f.scale(2.6, 2.6); sita(f, { t, eyes: .05, tears: .5, wind: .2 + .3 * gl }); },
    { tint: ['#1A0806', .25], grade: [[1300, 'rgba(255,190,90,0)'], [1920, `rgba(255,190,90,${.5 * gl})`]], edge: { col: '#FFC890', w: 2.4, a: .5 }, rim: { col: '#FFE6B0', dx: 8, dy: lerp(-3, 4, gl), a: .9, blur: 1 } }));
  plane(c, cam, 1.2, (c) => motes(c, { n: 50, seed: 8, box: [-50, 600, W + 50, 1950], r: 3.2, col: '#FFD27A', a: .7 * gl, vx: 4, vy: -90, t }));
} });

// ================= J · The Earth opens: a throne on the heads of nagas rises, takes her, goes down; flowers rain =================
SHOTS.push({ a: TL.J0, b: TL.K0 + .4, xf: .3, draw(c, u, t) {
  const rise = seg(t, TL.J0 - .2, TL.J0 + .7) * (1 - seg(t, TL.HOME - .4, TL.HOME + .6)), GY = 1250;
  const cam = { z: 1.04 + Math.sin(t * 53) * .004 * (1 - seg(t, TL.J0, TL.J0 + 1)), fx: 540, fy: 1000 };
  plane(c, cam, 0, (c) => { hallSky(c); glow(c, 540, GY, 700, '#FFC860', .55 + .2 * rise); });
  plane(c, cam, .5, (c) => pillars(c, 330, GY, 540, '#1A0D0A', t, 7, 46));
  plane(c, cam, 1, (c) => {
    fillPath(c, `M -200 ${GY} L ${W + 200} ${GY} L ${W + 200} 2200 L -200 2200 Z`, '#140806');
    cracks(c, 540, GY + 10, seg(t, TL.J0 - .6, TL.J0 + .3), t, 11);
    glow(c, 540, GY + 20, 320, '#FFE2A0', .7); ellipse(c, 540, GY + 14, 260, 22, '#FFF0C8');
    const seat = nagaThrone(c, 540, GY + 10, 1, t, rise);
    c.save(); c.beginPath(); c.rect(-300, -300, W + 600, GY + 310); c.clip();
    figure(c, (f) => { f.translate(540, seat); f.scale(.5, .5); sita(f, { t, eyes: .2, wind: .3 }); }, { tint: ['#3A1A08', .15], edge: { col: '#FFE2A0', w: 2, a: .8 }, rim: { col: '#FFF0C8', dx: 0, dy: 4, a: .8 } });
    c.restore();
    crowd(c, -60, 1140, 1600, 8, 1.2, t, 0, '#0A0504', 2);
  });
  petals(c, t, seg(t, TL.J0 + .3, TL.J0 + 1));
} });

// ================= K · "Ram never married again… a SITA of GOLD sat beside him." =================
SHOTS.push({ a: TL.K0, b: TL.L0 + .4, xf: .5, draw(c, u, t) {
  const k = easeIO(clamp(u / (TL.L0 + .4 - TL.K0))), gl = seg(t, TL.GOLD - .3, TL.GOLD + .4);
  const cam = { z: lerp(1.02, 1.12, k), fx: 420, fy: 1000 };
  hall(c, cam, t, { fx: 560, fw: 200 });
  plane(c, cam, 1, (c) => {
    fillPath(c, 'M 220 1262 L 420 1262 L 404 1236 L 236 1236 Z', '#3A2010');
    figure(c, (f) => { f.translate(320, 1240); f.scale(.6, .6); sita(f, { t: 0, eyes: .8, wind: 0, look: [0, 0] }); },
      { tint: ['#D49A38', .58], grade: [[500, 'rgba(255,236,170,.2)'], [1260, 'rgba(90,50,10,.35)']], edge: { col: '#FFE6A0', w: 2.2, a: .7 + .3 * gl }, rim: { col: '#FFF4D0', dx: 5, dy: -3, a: .8 + .2 * gl, blur: 1 } });
    if (gl > 0) { glow(c, 345, 820, 140, '#FFE6A0', .5 * Math.sin(gl * Math.PI)); }
    figure(c, (f) => { f.translate(830, 1260); f.scale(.64, .64); ramSil(f, { t, namaste: true, wind: .15 }); }, fireLit(-5));
    crowd(c, -60, 1140, 1600, 8, 1.2, t, 0, '#0A0504', 2);
  });
} });

// ================= L · "BHAVABHUTI couldn't bear it.": his pillar in Vidarbha =================
SHOTS.push({ a: TL.L0, b: TL.L1 + .4, xf: .4, draw(c, u, t) { poetShot(c, u, t, 'bhava', TL.L1 + .4 - TL.L0, TL.BHAVA - .1, { az: .5, alt0: 130, b0: 120 }); } });

// ================= L1 · "In his play, they are REUNITED.": dawn, Sita and Ram face each other, petals =================
SHOTS.push({ a: TL.L1, b: TL.M0 + .4, xf: .4, draw(c, u, t) {
  const k = easeIO(clamp(u / (TL.M0 + .4 - TL.L1))), cam = { z: lerp(1.0, 1.08, k), fx: 560, fy: 1000 };
  plane(c, cam, 0, (c) => { sky(c, [[0, '#2A1A3A'], [600, '#8A4A5A'], [1000, '#F0A870'], [1200, '#FFE0A8']]); glow(c, 560, 1080, 520, '#FFD890', .6); ellipse(c, 560, 1080, 130, 130, '#FFF4D8'); });
  plane(c, cam, .3, (c) => { ridge(c, 1180, 50, 9, '#6A3A48', { freq: .006 }); river(c, 1190, 120, t, 560, '#7A4A4A'); });
  plane(c, cam, .7, (c) => fillPath(c, `M -200 1290 C 300 1260 800 1270 ${W + 200} 1300 L ${W + 200} 2200 L -200 2200 Z`, '#1E1018'));
  plane(c, cam, 1, (c) => {
    figure(c, (f) => { f.translate(360, 1300); f.scale(.72, .72); sita(f, { t, eyes: .9, wind: .3, look: [3, 0] }); }, { tint: ['#2A1018', .25], edge: { col: '#FFD9A0', w: 2.2, a: .8 }, rim: { col: '#FFF0C8', dx: 4, dy: -3, a: .9, blur: 1 } });
    figure(c, (f) => { f.translate(790, 1300); f.scale(.76, .76); ramSil(f, { t, wind: .3 }); }, LIGHTS.dawnBack);
  });
  petals(c, t, seg(t, TL.REUNITED - .4, TL.REUNITED + .4));
} });

// ================= M · "And TULSIDAS?": his pillar at Kashi =================
SHOTS.push({ a: TL.M0, b: TL.M1 + .4, xf: .3, draw(c, u, t) { poetShot(c, u, t, 'tulsi', TL.M1 + .4 - TL.M0, TL.TULSI - .15, { az: -.2, alt0: 110, b0: 100 }); } });

// ================= M1 · the Manas's page: Sita bears Lav and Kush in Ram's reign; no exile =================
SHOTS.push({ a: TL.M1, b: TL.N0 + .4, xf: .4, draw(c, u, t) {
  const k = easeIO(clamp(u / (TL.N0 + .4 - TL.M1))), cam = { z: lerp(1.0, 1.08, k), fx: 540, fy: 800 };
  plane(c, cam, 0, (c) => { sky(c, [[0, '#0C0604'], [900, '#2A160C'], [1920, '#0A0503']]); glow(c, 220, 1180, 700, '#FF9A40', .3 + .04 * Math.sin(t * 6)); });
  plane(c, cam, 1, (c) => {
    manasPage(c, 560, 830, 940, 640, t, seg(t, TL.NOEXILE - .6, TL.NOEXILE));
    deepa(c, 170, 1240, 1.1, t, 1, 3);
  });
  if (t > TL.M1 + 1.2) text(c, 'Many scholars think Valmiki’s last book was added later.', 540, 1225, 'italic 30px Marcellus', '#F4E6CC', { pop: t - TL.M1 - 1.2, glow: ['rgba(6,6,14,.95)', 16], maxW: 940 });
} });

// ================= N · "Even in Valmiki, the crowd was DIVIDED.": two halves of the crowd light up, then both =================
SHOTS.push({ a: TL.N0, b: TL.O0 + .4, xf: .4, draw(c, u, t) {
  const k = easeIO(clamp(u / (TL.O0 + .4 - TL.N0))), cam = { z: lerp(1.08, 1.0, k), fx: 540, fy: 1100 };
  const L = seg(t, TL.SITA_W - .3, TL.SITA_W + .2), R = seg(t, TL.RAM_W - .3, TL.RAM_W + .2), B = seg(t, TL.BOTH - .3, TL.BOTH + .3);
  hall(c, cam, t, { fire: false });
  plane(c, cam, .8, (c) => { glow(c, 540, 1180, 300, '#FFE2A0', .55); figure(c, (f) => { f.translate(540, 1240); f.scale(.36, .36); sita(f, { t, eyes: .2 }); }, { tint: ['#3A1A08', .2], edge: { col: '#FFE2A0', w: 1.6, a: .8 } }); });
  plane(c, cam, 1, (c) => {
    const side = (x0, x1, a, gc) => { if (a > 0) glow(c, (x0 + x1) / 2, 1500, 520, gc, .45 * a); };
    side(-100, 540, Math.max(L, B), '#FFB060'); side(540, 1180, Math.max(R, B), '#FFB060');
    side(-100, 540, Math.max(L, B), '#FFD890'); side(540, 1180, Math.max(R, B), '#FFD890');
    for (const [y, s, n, sd] of [[1420, 1, 9, 3], [1640, 1.35, 8, 6], [1900, 1.7, 7, 9]]) {
      crowd(c, -60, 540, y, Math.ceil(n / 2), s, t, .3 * Math.max(L, B), rgba('#0A0504', 1), sd, Math.max(L, B) * .6);
      crowd(c, 540, 1140, y, Math.ceil(n / 2), s, t, .3 * Math.max(R, B), rgba('#0A0504', 1), sd + 1, Math.max(R, B) * .6);
    }
  });
  const pop = (txt, x, y, at, sz = 64) => { if (t > at) text(c, txt, x, y, `${sz}px "Tiro Devanagari Sanskrit"`, '#FFE2A0', { pop: t - at, glow: ['rgba(255,150,40,.85)', 22] }); };
  pop('साधु सीता!', 290, 760, TL.SITA_W - .1); pop('साधु राम!', 790, 760, TL.RAM_W - .1); pop('साधु साधु!', 540, 600, TL.BOTH - .1, 72);
} });

// ================= O · the ask: which Ramayan did YOU grow up with? the Ramayans of India light up =================
SHOTS.push({ a: TL.O0, b: TL.CARD, xf: .4, draw(c, u, t) {
  reset(); CAM3.near = 4; const ex = I3.mood('golden', { at: I3.at(80, 22), shadow: 1400, fogNear: 2500, fogFar: 9000, sunAt: [-.8, .45, .4], focus: .55, edge: .5 }); I3.set(t, { clouds: 0 });
  I3.border.set(1, 3.2, .4);
  const k = easeIO(clamp(u / (TL.CARD - TL.O0)));
  const C = mapCam(82, 16.2, lerp(600, 630, k), lerp(280, 295, k), -.03, { fov: 40 });
  render3(c, I3.scene, C.cam, { exposure: ex * .95, fx: FXM() });
  RAMAYANS.forEach(([lon, lat, name, lang, dx, dy], i) => {
    const at = TL.O0 + .25 + i * .17; if (t < at) return;
    const [x, y, z] = toScreen3(I3.at(lon, lat, 2)); if (z > 1) return;
    const kk = popK(t - at);
    c.save(); c.globalAlpha = clamp(kk); glow(c, x, y, 30, '#FFC860', .6); ellipse(c, x, y, 7 * kk, 7 * kk, '#FFF0C8'); c.restore();
    text(c, lang.toUpperCase(), clamp(x + dx, 110, 970), y + dy, '700 30px Cinzel', '#FFE2A0', { pop: t - at, glow: ['rgba(6,6,14,.95)', 16], spacing: 1 });
    text(c, name.toLowerCase().replace(/\b\w/g, m => m.toUpperCase()), clamp(x + dx, 110, 970), y + dy + 30, 'italic 25px Marcellus', '#F4EEE4', { pop: t - at - .08, glow: ['rgba(6,6,14,.95)', 14] });
  });
  chip(c, '…or the one on TV?', 540, 470, t, TL.COMMENT + .3, { size: 34 });
} });

// ================= P · the card =================
SHOTS.push({ a: TL.CARD, b: TL.END + 1, draw(c, u, t) {
  rkCardCine(c, u, t, { title: 'MEET OUR GODS', line: 'Picture books of our gods, for kids', price: 'Books 1–3 · set of 3 for ₹500' });
} });
