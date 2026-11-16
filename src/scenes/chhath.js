// chhath.js: "The whole world bows to the RISING sun. ONE festival bows first to the SETTING sun." (ad 97), in the 3D
// style: Chhath Puja explained in its four days. No priest, no idol, no temple: a river, the sun and a 36-hour fast.
// Day 1 Nahay Khay (a holy dip, one pure meal: rice, chana dal, lauki), day 2 Kharna (a day's fast broken at night with
// jaggery kheer and roti off a clay stove; then 36 hours without food or water), day 3 Sandhya Arghya (waist-deep in
// the river, a soop of fruit and thekua raised to the setting sun), day 4 Usha Arghya (back in the water before dawn;
// the sun rises, the fast breaks). Chhathi Maiya is Shashthi Devi, the guardian of children; folk songs call her the
// Sun's sister. The close: Chhath bows to the one who sets, because he will rise again. Jai Chhathi Maiya. The card
// is the Ashwatthama comic's (no price).
// STORYBOARD.md has the plan and the sources; the timeline (from the voice) is chhath_tl.js, the sets chhath_sets.js.
LOOK.bloom = .1;   // matte (owner, 30 Oct): cine.js's own bloom low
const CAPY = 1415;
const capBand = (c, a = .6) => band(c, 1290, 1535, a);
const BR = {
  "Before dawn, they are back | in the cold water.": "Before dawn, | they are back | in the cold water.",
  "*CHHATH.* | No priest. No idol. No temple.": "*CHHATH.* | No priest. No idol. | No temple.",
  "Waist-deep in the river, | a *SOOP* of fruit and thekua": "Waist-deep in the river, | a *SOOP* of fruit | and thekua",
  "At night: jaggery kheer | and roti, off a clay stove.": "At night: jaggery kheer | and roti, | off a clay stove.",
};
VO.caps.forEach((k, i) => say(i ? k.a : -1, k.b, BR[k.text] || k.text, { at: i ? k.at : k.at.map(() => -1), y: k.y ?? CAPY }));

const lens = (focus, ap = 5, o = {}) => ({ dof: { focus, aperture: ap, max: o.max ?? 14, nearK: .6 }, bloom: { k: o.bloom ?? .07, thresh: 1.6, knee: .6, radius: 1 }, rays: o.rays, grade: { contrast: o.contrast ?? 1.07, sat: o.sat ?? 1.06, temp: o.temp ?? .0, tint: 0, lift: o.lift ?? 0, gamma: 1, gain: 1 } });
const dist = (p) => CAM3.position.distanceTo(p.isVector3 ? p : V3(...p));
const at3 = (k, a, b) => a.map((v, i) => lerp(v, b[i], k));
const R_ = (t, a, b) => easeIO(seg(t, a, b));
const flashK = (c, t, at, col = '255,236,200', k = .4, rate = 5) => { const f = t > at ? Math.exp(-(t - at) * rate) : 0; if (f > .01) { c.save(); c.fillStyle = `rgba(${col},${k * f})`; c.fillRect(0, 0, W, H); c.restore(); } };
const GOLD = '#F4C46A', CREAM = '#FFF3DC', RED = '#FF6A55', DEVA = '"Tiro Devanagari Sanskrit"';
const HERO_P = [0, .5, -2.4];
// the ghat: set the frame's state, place the camera, mirror the scene in the water, render
function ghat(c, t, o, cam, fx) {
  const ex = SET.set(t, o); cam3(cam); SET.refl();
  render3(c, SET.S, CAM3, { exposure: ex, fx });
}
function home(c, t, o, cam, fx) { const ex = AANGAN.set(t, o); cam3(cam); render3(c, AANGAN.S, CAM3, { exposure: ex, fx }); }
// a word over the top band: big, with a small line under it
function topTitle(c, t, at, out, big, small, o = {}) {
  const a = seg(t, at, at + .3) * (1 - seg(t, out, out + .3)); if (a <= 0) return;
  band(c, o.y0 ?? 400, o.y1 ?? 640, (o.band ?? .5) * a);
  text(c, big, 540, o.y ?? 490, o.font || '700 88px Cinzel', o.col || GOLD, { pop: t - at, alpha: a, spacing: o.spacing ?? 5, glow: [o.glowCol || 'rgba(10,6,4,.9)', 26], maxW: 940 });
  if (small) text(c, small, 540, (o.y ?? 490) + (o.dy ?? 82), o.sfont || 'italic 40px Marcellus', o.scol || CREAM, { pop: t - at - .2, alpha: a, glow: ['rgba(6,5,10,.95)', 16], maxW: 900 });
}
// a day's title: a "DAY n" pill, the day's name, what it means
function dayTitle(c, t, at, out, n, name, sub) {
  const a = seg(t, at, at + .25) * (1 - seg(t, out, out + .3)); if (a <= 0) return;
  band(c, 400, 700, .58 * a);
  tag(c, `DAY ${n} OF 4`, 540, 462, t, at, { size: 30, alpha: a });
  text(c, name, 540, 548, '700 84px Cinzel', GOLD, { pop: t - at - .12, alpha: a, spacing: 4, glow: ['rgba(10,6,4,.9)', 26], maxW: 960 });
  text(c, sub, 540, 626, 'italic 40px Marcellus', CREAM, { pop: t - at - .3, alpha: a, glow: ['rgba(6,5,10,.95)', 16], maxW: 900 });
  // four dots: where we are
  for (let i = 0; i < 4; i++) { c.save(); c.globalAlpha = a; c.fillStyle = i < n ? GOLD : 'rgba(255,243,220,.3)'; c.beginPath(); c.arc(540 + (i - 1.5) * 34, 676, i === n - 1 ? 9 : 6, 0, 7); c.fill(); c.restore(); }
}
// a tag with a red strike through it ("NO PRIEST")
function noTag(c, txt, x, y, t, at, out, o = {}) {
  tag(c, txt, x, y, t, at, { out, size: o.size ?? 44, col: CREAM });
  const k = seg(t, at + .12, at + .4) * (1 - seg(t, out, out + .3)); if (k <= 0 || t < at) return;
  c.save(); c.font = `700 ${o.size ?? 44}px Cinzel`; const w = c.measureText(txt).width * .5 + 40; c.restore();
  c.save(); c.globalAlpha = 1 - seg(t, out, out + .3); c.strokeStyle = RED; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(x - w, y + 2); c.lineTo(x - w + 2 * w * k, y + 2); c.stroke(); c.restore();
}

// ================= A · the hook: the whole world bows to the rising sun; one festival bows first to the setting sun =================
SHOTS.push({ a: 0, b: TL.B0 + .3, draw(c, u, t) {
  const k = easeIO(seg(t, -1, TL.B0 + .3)), r = R_(t, TL.ONE + .2, TL.SETTING + .5);
  ghat(c, t, { mood: ['dusk'], sunEl: lerp(2.6, 1.2, seg(t, 0, TL.B0)), sunR: 2.7, hero: .25 + .75 * r, raise: .2 + .6 * r, pools: .3 },
    { pos: at3(k, [.25, 1.08, 3.7], [.1, 1.02, 3.1]), at: [0, .52, -2.4], fov: 28 }, lens(dist(HERO_P), 4));
  capBand(c);
} });

// ================= B · Chhath: no priest, no idol, no temple; a river, the sun, a fast of 36 hours =================
SHOTS.push({ a: TL.B0, b: TL.JUST + .25, xf: .4, draw(c, u, t) {
  const k = easeIO(seg(t, TL.B0, TL.JUST + .25));
  ghat(c, t, { mood: ['dusk'], sunEl: 3.6, sunAz: 9, sunR: 2.3, raise: .7, hero: .8, pools: .6 },
    { pos: at3(k, [-2.6, 1.05, 3.9], [-1.5, 1.0, 3.3]), at: [.5, .75, -3], fov: 38 }, lens(dist([0, .5, -2]), 4));
  topTitle(c, t, TL.CHHATH - .1, TL.PRIEST - .1, 'छठ', 'CHHATH · the sixth day after Diwali', { font: `150px ${DEVA}`, y: 500, dy: 118, y0: 380, y1: 690, sfont: '700 36px Cinzel', scol: GOLD });
  noTag(c, 'PRIEST', 235, 520, t, TL.PRIEST - .08, TL.JUST + .1);
  noTag(c, 'IDOL', 540, 520, t, TL.IDOL - .08, TL.JUST + .1);
  noTag(c, 'TEMPLE', 835, 520, t, TL.TEMPLE - .08, TL.JUST + .1);
  capBand(c);
} });
SHOTS.push({ a: TL.JUST, b: TL.C0 + .3, xf: .35, draw(c, u, t) {
  const k = easeIO(seg(t, TL.JUST, TL.C0 + .3));
  ghat(c, t, { mood: ['dusk'], sunEl: 2.6, sunAz: 50, sunR: 2.4, raise: .9, hero: 1, pools: .3 },
    { pos: at3(k, [-5.4, 1.35, 2.3], [-4.2, 1.2, 1.9]), at: [3, .4, -3], fov: 40 }, lens(dist([-1.9, .4, -1.5]), 4));
  const a36 = seg(t, TL.FAST - .1, TL.FAST + .2) * (1 - seg(t, TL.C0, TL.C0 + .3));
  if (a36 > 0) { band(c, 390, 690, .5 * a36);
    text(c, '36', 540, 500, '700 200px Cinzel', GOLD, { pop: t - TL.H36 + .12, alpha: a36, glow: ['rgba(10,6,4,.9)', 30] });
    text(c, 'HOURS · NO FOOD · NO WATER', 540, 630, '700 38px Cinzel', CREAM, { pop: t - TL.H36 - .1, alpha: a36, spacing: 3, glow: ['rgba(6,5,10,.95)', 16], maxW: 940 }); }
  capBand(c);
} });

// ================= C · day 1, Nahay Khay: a holy dip, then one pure meal =================
const C_MEAL = TL.MEAL - .75;
SHOTS.push({ a: TL.C0, b: C_MEAL + .3, xf: .4, draw(c, u, t) {
  const k = easeIO(seg(t, TL.C0, C_MEAL + .3));
  ghat(c, t, { mood: ['day'], sunEl: 34, sunAz: 30, sunR: 1.2, soops: false, lamps: 0, floats: 0, props: false, calm: 1.2 },
    { pos: at3(k, [-3.6, 1.5, 2.6], [-2.6, 1.3, 2.0]), at: [1.5, .35, -3], fov: 40 }, lens(dist([-1.9, .4, -1.5]), 3, { temp: -.01 }));
  dayTitle(c, t, TL.DAY1 - .1, TL.D0, 1, 'NAHAY KHAY', '“bathe and eat”');
  capBand(c);
} });
SHOTS.push({ a: C_MEAL, b: TL.D0 + .3, xf: .4, draw(c, u, t) {
  const k = easeIO(seg(t, C_MEAL, TL.D0 + .3));
  home(c, t, { day: 1 }, { pos: at3(k, [.28, .78, 1.38], [.1, .64, 1.18]), at: [.02, .05, -.1], fov: 36 }, lens(dist([0, .04, .02]), 2, { temp: .03 }));
  dayTitle(c, t, TL.DAY1 - .1, TL.D0, 1, 'NAHAY KHAY', '“bathe and eat”');
  pinLabel(c, 'RICE', [-.06, .07, .05], t, TL.RICE - .05, { out: TL.D0, up: 110, size: 38 });
  pinLabel(c, 'CHANA DAL', [.24, .06, -.07], t, TL.DAL - .05, { out: TL.D0, up: 150, dx: 70, size: 34 });
  pinLabel(c, 'LAUKI', [.2, .05, .1], t, TL.LAUKI - .05, { out: TL.D0, up: -80, dx: 90, size: 34 });
  capBand(c);
} });

// ================= D · day 2, Kharna: fast all day; at night kheer and roti off a clay stove =================
SHOTS.push({ a: TL.D0, b: TL.THEN + .2, xf: .4, draw(c, u, t) {
  const k = easeIO(seg(t, TL.D0, TL.THEN + .2));
  home(c, t, { day: 2, fire: 1 }, { pos: at3(k, [.55, .95, 1.75], [.32, .82, 1.5]), at: [.05, .34, -.1], fov: 38 }, lens(dist([0, .2, -.1]), 2.5, { temp: .02 }));
  dayTitle(c, t, TL.DAY2 - .1, TL.THEN, 2, 'KHARNA', 'the last meal');
  pinLabel(c, 'GUR KHEER', [-.12, .52, -.24], t, TL.KHEER - .05, { out: TL.THEN, up: 70, size: 36 });
  pinLabel(c, 'ROTI', [.31, .04, .14], t, TL.ROTI - .05, { out: TL.THEN, up: 110, dx: 60, size: 36 });
  capBand(c);
} });
// then 36 hours: the fire dies down
SHOTS.push({ a: TL.THEN, b: TL.F0 + .3, xf: .3, draw(c, u, t) {
  const k = easeIO(seg(t, TL.THEN, TL.F0 + .3)), f = 1 - .88 * R_(t, TL.THEN, TL.FOOD + .6);
  home(c, t, { day: 2, fire: f }, { pos: at3(k, [.1, .34, .95], [.02, .26, .7]), at: [-.1, .12, -.2], fov: 40 }, lens(dist([-.12, .1, -.15]), 5, { temp: -.02 }));
  const a = seg(t, TL.THEN, TL.THEN + .2) * (1 - seg(t, TL.F0, TL.F0 + .3));
  band(c, 390, 720, .55 * a);
  text(c, '36 HOURS', 540, 500, '700 130px Cinzel', GOLD, { pop: t - TL.E36 + .1, alpha: a, spacing: 4, glow: ['rgba(10,6,4,.9)', 30], maxW: 980 });
  noTag(c, 'FOOD', 380, 640, t, TL.FOOD - .15, TL.F0);
  noTag(c, 'WATER', 690, 640, t, TL.DROP - .1, TL.F0);
  capBand(c);
} });

// ================= F · day 3, Sandhya Arghya: waist-deep, a soop raised to the setting sun =================
SHOTS.push({ a: TL.F0, b: TL.RAISED - .1, xf: .4, draw(c, u, t) {
  const k = easeIO(seg(t, TL.F0, TL.RAISED - .1));
  ghat(c, t, { mood: ['dusk'], sunEl: 3.4, sunR: 2.4, hero: .05 + .2 * k, raise: .1, pools: .5, fill: 1.2 },
    { pos: at3(k, [1.25, .8, -4.5], [.85, .74, -4.25]), at: [.05, .62, -2.5], fov: 32 }, lens(dist([0, .5, -2.6]), 6, { max: 18 }));
  pinLabel(c, 'SOOP', SET.HERO.soop.getWorldPosition(V3()).add(V3(0, .06, 0)), t, TL.SOOP - .05, { out: TL.RAISED - .2, up: 130, dx: 210, size: 40 });
  dayTitle(c, t, TL.DAY3 - .1, TL.WAIST + 1.2, 3, 'SANDHYA ARGHYA', 'the evening offering');
  capBand(c);
} });
SHOTS.push({ a: TL.RAISED - .1, b: TL.G0 + .3, xf: .3, draw(c, u, t) {
  const k = easeIO(seg(t, TL.RAISED - .1, TL.G0 + .3)), r = R_(t, TL.RAISED - .1, TL.SET3);
  ghat(c, t, { mood: ['dusk'], sunEl: lerp(1.6, .3, k), sunR: 2.9, hero: r, raise: r, pools: .3 },
    { pos: at3(k, [0, 1.25, 4.6], [0, 1.5, 5.6]), at: [0, .7, -2.4], fov: 30 }, lens(dist(HERO_P), 3));
  capBand(c);
} });

// ================= G · day 4, Usha Arghya: before dawn, back in the cold water; waiting =================
SHOTS.push({ a: TL.G0, b: TL.H0 + .3, xf: .5, draw(c, u, t) {
  const k = seg(t, TL.G0, TL.H0 + .3), w = R_(t, TL.WAITING - .4, TL.H0 + .3);
  ghat(c, t, { mood: ['night', 'predawn', .55 + .45 * k], sunEl: lerp(-9, -3.2, k), sunR: 2.6, hero: 0, raise: 0, pools: 1, mist: 1, calm: .7, halo: .4 + 1.4 * w },
    { pos: at3(easeIO(k), [-3.4, .95, 2.2], [1.6, 1.0, 3.0]), at: at3(easeIO(k), [-.6, .5, -2.6], [0, .5, -2.4]), fov: 34 }, lens(dist(HERO_P), 4, { temp: -.05, bloom: .1 }));
  dayTitle(c, t, TL.DAY4 - .1, TL.DAWN + 1.2, 4, 'USHA ARGHYA', 'the dawn offering');
  capBand(c);
} });

// ================= H · and then the sun rises; only then does the fast break =================
SHOTS.push({ a: TL.H0, b: TL.I0 + .3, draw(c, u, t) {
  const k = seg(t, TL.H0, TL.I0 + .3), up = R_(t, TL.H0, TL.RISES + 1.2), el = lerp(-3.2, 3.6, up), r = R_(t, TL.RISES - .9, TL.RISES + .5);
  ghat(c, t, { mood: ['predawn', 'dawn', R_(t, TL.H0 + .2, TL.RISES + .6)], sunEl: el, sunR: 2.6, hero: r, raise: r, pools: 1 - up, mist: 1 - .6 * up, calm: .8 },
    { pos: at3(easeIO(k), [.3, 1.1, 4.2], [.1, 1.05, 3.4]), at: [0, .55, -2.4], fov: 28 },
    lens(dist(HERO_P), 4, { bloom: .1, rays: el > -.5 ? { at: SET.sunAt(el), k: .3 * clamp((el + .5) / 2), thresh: 1.4, decay: .965, len: .8, col: '#FFD9A0' } : undefined }));
  flashK(c, t, TL.RISES - .1, '255,226,170', .3, 2.5);
  capBand(c);
} });

// ================= I · Chhathi Maiya: Shashthi Devi, the guardian of children; the Sun's own sister =================
SHOTS.push({ a: TL.I0, b: TL.J0 + .3, xf: .5, draw(c, u, t) {
  const k = easeIO(seg(t, TL.I0, TL.J0 + .3));
  ghat(c, t, { mood: ['dawn'], sunEl: 4.5, sunAz: 16, sunR: 2.4, hero: .22, raise: .5, pools: 0, lamps: .8, fill: 1.2 },
    { pos: at3(k, [-1.15, .8, -4.3], [-.8, .76, -4.45]), at: [-.05, .66, -2.5], fov: 32 }, lens(dist([0, .6, -2.5]), 6, { max: 18, temp: .02 }));
  topTitle(c, t, TL.MAIYA - .1, TL.J0, 'CHHATHI MAIYA', null, { y: 480, y0: 400, y1: 700, font: '700 84px Cinzel' });
  tag(c, 'SHASHTHI DEVI · guardian of children', 540, 585, t, TL.SHASHTHI - .05, { out: TL.J0, size: 30 });
  tag(c, 'DEVI BHAGAVATA PURANA 9.46', 540, 652, t, TL.GUARD - .05, { out: TL.J0, size: 22, col: '#D8B070' });
  capBand(c);
} });

// ================= J · the world salutes whoever is rising; Chhath bows to the one who sets: he will rise again =================
SHOTS.push({ a: TL.J0, b: TL.K0 + .3, xf: .5, draw(c, u, t) {
  const down = R_(t, TL.BOWS - .6, TL.SETS + .3), back = R_(t, TL.BECAUSE + .5, TL.K0 + .3);
  const el = down < 1 ? lerp(9, .9, down) : lerp(.9, 6.5, back), k = easeIO(seg(t, TL.J0, TL.K0 + .3));
  ghat(c, t, { mood: back > 0 ? ['dusk', 'dawn', back] : ['dawn', 'dusk', down], sunEl: el, sunR: 2.6, hero: 1 - .3 * down + .3 * back, raise: .9, pools: .4 * down * (1 - back) },
    { pos: at3(k, [0, 1.3, 5.2], [0, 1.15, 4.2]), at: [0, lerp(1.0, .62, down) + .3 * back, -2.4], fov: 30 }, lens(dist(HERO_P), 3));
  capBand(c);
} });

// ================= K · tell us your ghat; Jai Chhathi Maiya =================
SHOTS.push({ a: TL.K0, b: TL.CARD + .3, xf: .5, draw(c, u, t) {
  const k = easeIO(seg(t, TL.K0, TL.CARD + .3));
  ghat(c, t, { mood: ['dawn'], sunEl: lerp(2.0, 2.8, k), sunAz: 2, sunR: 2.5, hero: 1, raise: 1, pools: 0, lamps: .8 },
    { pos: at3(k, [2.2, 1.55, 6.0], [1.4, 1.75, 6.9]), at: [0, 1.25, -3], fov: 40 },
    lens(dist([0, .5, -2]), 3, { bloom: .1, rays: { at: SET.sunAt(2.5, 2), k: .25, thresh: 1.4, decay: .965, len: .7, col: '#FFD9A0' } }));
  topTitle(c, t, TL.GHAT - .15, TL.JAI - .25, 'YOUR GHAT?', 'tell us in the comments', { y: 480, y0: 395, y1: 620, font: '700 92px Cinzel' });
  const a = seg(t, TL.JAI - .15, TL.JAI + .1);
  if (a > 0) { band(c, 380, 760, .55 * a);
    text(c, 'जय छठी मैया', 540, 470, `100px ${DEVA}`, '#FFE9C0', { pop: t - TL.JAI + .15, alpha: a, glow: ['rgba(244,150,40,.5)', 30] });
    text(c, 'JAI CHHATHI', 540, 590, '700 100px Cinzel', GOLD, { pop: t - TL.JAI, alpha: a, spacing: 4, glow: ['rgba(10,6,4,.9)', 28], maxW: 980 });
    text(c, 'MAIYA!', 540, 690, '700 110px Cinzel', GOLD, { pop: t - TL.JAI - .25, alpha: a, spacing: 6, glow: ['rgba(10,6,4,.9)', 28] }); }
  flashK(c, t, TL.JAI - .05, '255,226,170', .22, 3);
  capBand(c, .6 * (1 - seg(t, TL.JAI + 1.3, TL.JAI + 1.6)));
} });

// ================= the card: the Ashwatthama comic (no price) =================
PICS.ashCover = Object.assign(new Image(), { src: 'assets/rk/ashwatthama_cover.jpg' });
function comicCard(c, u, t) {
  const pk = d => u - d, X = 520;
  sky(c, [[0, '#04060E'], [900, '#121C38'], [1920, '#05060B']]);
  glow(c, X, 900, 760, '#2E4A7A', .45, 'screen');
  motes(c, { n: 50, seed: 61, box: [-50, 300, W + 50, 1900], r: 3, col: '#9FE4FF', a: .5, vx: 4, vy: -22, t });
  text(c, 'NEW · A COMIC FROM', X, 452, '500 34px Poppins', '#CFE3DF', { pop: pk(.1), spacing: 4 });
  picture(c, PICS.logo, X - 175, 512, 74, 74, { pop: pk(.2), r: 37 });
  text(c, 'RISHI KATHA', X + 40, 515, '42px Marcellus', '#FBE0CF', { pop: pk(.2), spacing: 3 });
  glow(c, X, 890, 450, '#7FD8FF', .22 + .05 * Math.sin(t * 2));
  picture(c, PICS.ashCover, X, 890, 480, 600, { pop: pk(.35), r: 10, shadow: 34, rot: Math.sin(t * 1.1) * .006 });
  text(c, 'ASHWATTHAMA', X, 1245, '700 66px Cinzel', '#F4C46A', { pop: pk(.8), glow: ['rgba(244,196,106,.5)', 22], spacing: 3, maxW: 880 });
  text(c, 'The man who cannot die · CHIRANJEEVI 1', X, 1308, '500 33px Poppins', '#FFFFFF', { pop: pk(1.0), maxW: 880 });
  { const k = popK(pk(1.3)) * (1 + .03 * Math.max(0, Math.sin(t * 5))); if (k > .01) { c.save(); c.translate(X, 1392); c.scale(k, k); c.fillStyle = '#F15A24'; c.shadowColor = 'rgba(241,90,36,.6)'; c.shadowBlur = 30; c.beginPath(); c.roundRect(-230, -44, 460, 88, 44); c.fill(); c.restore(); text(c, 'rishikatha.com', X, 1395, '700 50px Poppins', '#FFFFFF', { pop: pk(1.3) }); } }
  text(c, 'Out now · link in bio · Follow @therishikatha', X, 1478, '500 32px Poppins', '#CFE3DF', { pop: pk(1.6), maxW: 880 });
}
SHOTS.push({ a: TL.CARD, b: TL.END + 1, draw(c, u, t) { comicCard(c, u, t); } });
