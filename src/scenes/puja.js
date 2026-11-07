// puja.js: "Lakshmi Puja is TOMORROW. SAVE this: the whole puja, step by step." (ad 83), in the 3D style.
// A home mandir at night (frame 0: the finished puja). When: after sunset, Pradosh Kaal (the house front at dusk).
// Then fourteen steps, each numbered: clean (a brass Ganesha bathed, a clay Lakshmi wiped), the red cloth, the murtis
// (as you face them: Saraswati, Lakshmi, Ganesha; traditions differ), new clothes, malas, flowers, a lotus; the kalash
// built up on its rice; sit facing east or north, achaman; the sankalp; Ganesha first (Shiva Purana); the offerings with
// each god's mantra; the havan (if your family does one); aarti, Ganesha then Lakshmi; pushpanjali; the forgiveness
// prayer; diyas, rangoli and footprints at the door, one lamp all night. The ask: who sits where on your chowki? Card.
// STORYBOARD.md has the plan and the sources; the timeline (from the voice) is puja_tl.js, the sets puja_mandir.js
// (MANDIR, HVS) and puja_sets.js (HOME, the house front from ad 82), the murtis puja_murti.js.
LOOK.bloom = .14;   // matte (owner, 30 Oct): cine.js's own bloom low, no fx bloom
const CAPY = 1330;
const capBand = (c, a = .5) => band(c, 1200, 1490, a);
VO.caps.forEach((k, i) => say(i ? k.a : -1, k.b, k.text, { at: i ? k.at : k.at.map(() => -1), y: k.y ?? CAPY, size: 50 }));

const lens = (focus, ap = 4, o = {}) => ({ dof: { focus, aperture: ap, max: 10, nearK: .6 }, grade: { contrast: o.contrast ?? 1.06, sat: o.sat ?? 1.04, temp: o.temp ?? .04, lift: o.lift ?? 0, gamma: 1, gain: 1 } });
const dist = (p) => CAM3.position.distanceTo(V3(...p));
const at3 = (k, a, b) => a.map((v, i) => lerp(v, b[i], k));
const flashK = (c, t, at, col = '255,220,160', k = .45, rate = 5) => { const f = t > at ? Math.exp(-(t - at) * rate) : 0; if (f > .01) { c.save(); c.fillStyle = `rgba(${col},${k * f})`; c.fillRect(0, 0, W, H); c.restore(); } };
const GOLD = '#F4C46A', CREAM = '#FFF3DC';
const M_ = MANDIR, Hm = HOME;
const homeDusk = (t, o = {}) => { env3(Hm.S, 'lamplit', { k: .12, rot: 1 }); Hm.set(t, { mood: 'dusk', ...o }); };
const homeNight = (t, o = {}) => { env3(Hm.S, 'lamplit', { k: .12, rot: 1 }); Hm.set(t, { mood: 'night', ...o }); };
const mandir = (t, o = {}) => { env3(M_.S, 'lamplit', { k: o.envK ?? .2, rot: 1 }); M_.set(t, o); };
const shoot = (c, focusP, ap = 3, o = {}) => render3(c, M_.S, CAM3, { exposure: o.exposure ?? 1.05, fx: lens(dist(focusP), ap, o) });
// where things are
const MY = CH.h + .17;                                                     // the murtis' middle height
const MP = MX.map(x => [x, MY, MZ]);                                       // Saraswati, Lakshmi, Ganesha
const FACE = [[MX[0], CH.h + .32, MZ + .03], [MX[1], CH.h + .34, MZ + .03], [MX[2], CH.h + .32, MZ + .06]];
const KAL = [M_.kalashAt[0], .3, M_.kalashAt[2]];
const WIDE = (k = 0) => cam3({ pos: at3(k, [0, 1.08, 2.5], [0, 1.0, 2.15]), at: [0, .55, 0], fov: 50 });
// a murti's name on the cloth under it
function nameUnder(c, s, i, t, at, out = 1e9, o = {}) {
  if (t < at) return; const [x, y, z] = toScreen3([MX[i], CH.h + .01, MZ + .3]); if (z > 1) return;
  text(c, s, x, y + (o.dy ?? 34), `700 ${o.size || 32}px Cinzel`, o.col || '#FFF3DC', { pop: t - at, alpha: 1 - seg(t, out - .3, out), spacing: 2, glow: ['rgba(8,6,12,.95)', 18] });
}
// states
const PREP = { dull: 0, cloth: 0, murti: [0, 0, 0], dress: [0, 0, 0], mala: [0, 0, 0], tilak: [0, 0, 0], lotus: 0, flowers: 0, bhog: 0, samai: 0, diyas: 0, chowkiLamp: 0, incense: 0,
  kalash: { water: 0, leaves: 0, coco: 0, swastik: 0, mauli: 0 } };
const DONE = { cloth: 1, murti: [1, 1, 1], dress: [1, 1, 1], mala: [1, 1, 1], tilak: [1, 1, 1], lotus: 1, flowers: 1, bhog: 1, samai: 1, diyas: 1, chowkiLamp: 1, incense: 1, kalash: {} };
const ST = (base, o) => ({ ...base, ...o });

// a step's number and name in the top band
function stepTitle(c, t, at, out, n, name, o = {}) {
  const a = seg(t, at, at + .3) * (1 - seg(t, out - .3, out)); if (a <= 0) return;
  band(c, o.y0 ?? 380, o.y1 ?? 640, .55 * a);
  text(c, 'STEP ' + n, 540, o.y ?? 462, '700 80px Cinzel', GOLD, { pop: t - at, alpha: a, spacing: 8, glow: ['rgba(244,170,60,.4)', 26] });
  if (name) text(c, name, 540, (o.y ?? 462) + 82, 'italic 46px Marcellus', CREAM, { pop: t - at - .15, alpha: a, glow: ['rgba(6,5,10,.95)', 16], maxW: 920 });
}
// a word over the top band (as in ad 82)
function topTitle(c, t, at, out, big, small, o = {}) {
  const a = seg(t, at, at + .3) * (1 - seg(t, out, out + .3)); if (a <= 0) return;
  band(c, o.y0 ?? 380, o.y1 ?? 640, .6 * a);
  text(c, big, 540, o.y ?? 480, o.font || '700 96px Cinzel', o.col || GOLD, { pop: t - at, alpha: a, spacing: o.spacing ?? 6, glow: ['rgba(244,170,60,.4)', 28], maxW: 940 });
  if (small) text(c, small, 540, (o.y ?? 480) + (o.dy ?? 82), o.sfont || 'italic 42px Marcellus', CREAM, { pop: t - at - .2, alpha: a, glow: ['rgba(6,5,10,.95)', 16], maxW: 920 });
}
// a mantra: Devanagari over its Roman reading
function mantra(c, t, at, out, dev, rom, y = 700) {
  const a = seg(t, at, at + .3) * (1 - seg(t, out - .25, out)); if (a <= 0) return;
  band(c, y - 70, y + 90, .6 * a);
  text(c, dev, 540, y - 6, '52px "Tiro Devanagari Sanskrit"', '#FFE9C0', { alpha: a, glow: ['rgba(6,5,10,.95)', 16], maxW: 920 });
  text(c, rom, 540, y + 52, 'italic 40px Marcellus', GOLD, { alpha: a, glow: ['rgba(6,5,10,.95)', 14], maxW: 920 });
}

// ================= A · the hook: the finished puja, frame 0 =================
SHOTS.push({ a: 0, b: TL.WHEN0 + .25, draw(c, u, t) {
  mandir(t, DONE);
  WIDE(easeIO(seg(t, 0, TL.WHEN0 + .25)));
  shoot(c, [0, .55, 0], 2);
  band(c, 380, 640, .55);
  text(c, 'THE WHOLE PUJA', 540, 440, 'italic 46px Marcellus', CREAM, { glow: ['rgba(6,5,10,.95)', 16] });
  text(c, '14 STEPS', 540, 540, '700 110px Cinzel', GOLD, { pop: t > TL.STEP ? t - TL.STEP : null, spacing: 8, glow: ['rgba(244,170,60,.4)', 30] });
  capBand(c);
} });

// ================= B · when: after sunset, Pradosh Kaal (the house front at dusk) =================
SHOTS.push({ a: TL.WHEN0, b: TL.S10 + .3, xf: .4, draw(c, u, t) {
  const k = easeIO(seg(t, TL.WHEN0, TL.S10 + .3));
  homeDusk(t, { wind: .4, diyas: Hm.diyas.map((_, i) => seg(t, TL.PRADOSH - .2 + i * .15, TL.PRADOSH + .2 + i * .15)) });
  cam3({ pos: at3(k, [0, 1.7, 5.6], [0, 1.6, 4.6]), at: [0, 1.6, 0], fov: 52 });
  render3(c, Hm.S, CAM3, { exposure: 1.45, fx: lens(dist([0, 1.5, .2]), 3, { temp: .06 }) });
  topTitle(c, t, TL.PRADOSH - .1, TL.S10, 'PRADOSH KAAL', 'just after sunset', { font: '700 84px Cinzel' });
  tag(c, 'SUN 8 NOV 2026 · DELHI 5:54 – 7:50 PM', 540, 1120, t, TL.MUHURAT - .2, { out: TL.S10, size: 26 });
  capBand(c);
} });

// ================= step 1 · clean: the plates shine; a brass Ganesha bathed; a clay Lakshmi wiped =================
SHOTS.push({ a: TL.S10, b: TL.METAL - .1, xf: .4, draw(c, u, t) {
  const sh = seg(t, TL.CLEAN, TL.PLATE + .3);
  mandir(t, ST(PREP, { dull: 1 - sh, motes: 1 }));
  const k = easeIO(seg(t, TL.S10, TL.METAL));
  cam3({ pos: at3(k, [.15, 1.0, 2.0], [0, .9, 1.75]), at: [0, .3, .2], fov: 48 });
  // a glint sweeps across the thali, the samai, the kalash
  const gx = lerp(-.9, .9, sh); M_.set(t, ST(PREP, { dull: 1 - sh, motes: 1, glint: [gx, .25 + .1 * Math.sin(sh * 6), .5, .7 * Math.sin(sh * Math.PI), .6] }));
  shoot(c, [0, .1, .6], 3);
  stepTitle(c, t, TL.S10 + .3, TL.METAL - .1, 1, 'Clean everything');
  capBand(c);
} });
SHOTS.push({ a: TL.METAL - .1, b: TL.CLAY - .1, xf: .3, draw(c, u, t) {
  const W0 = M_.washAt[0], k = easeIO(seg(t, TL.METAL - .1, TL.CLAY));
  mandir(t, ST(DONE, { wash: { pour: seg(t, TL.BATH - .6, TL.BATH + .1) } }));
  cam3({ pos: at3(k, [W0 + .2, .72, .85], [W0 + .1, .68, .7]), at: [W0, .45, 0], fov: 40 });
  shoot(c, [W0, .45, 0], 3);
  stepTitle(c, t, -1, TL.CLAY, 1, 'Clean everything');
  topTitle(c, t, TL.BATH - .1, TL.CLAY - .2, 'METAL', 'a bath', { y: 760, y0: 680, y1: 880, font: '700 70px Cinzel' });
  capBand(c);
} });
SHOTS.push({ a: TL.CLAY - .1, b: TL.S20 + .3, xf: .3, draw(c, u, t) {
  const W0 = M_.washAt[0] + .85, k = easeIO(seg(t, TL.CLAY - .1, TL.S20 + .3));
  mandir(t, ST(DONE, { wash: { pour: 0, wipe: t > TL.WIPE - .5 ? t - TL.WIPE + .5 : -1 } }));
  cam3({ pos: at3(k, [W0 + .05, .72, .8], [W0 - .05, .7, .68]), at: [W0, .55, 0], fov: 40 });
  shoot(c, [W0, .55, 0], 3);
  stepTitle(c, t, -1, TL.S20 + .3, 1, 'Clean everything');
  topTitle(c, t, TL.CLAY, TL.S20, 'CLAY', 'no water, a soft cloth', { y: 760, y0: 680, y1: 880, font: '700 70px Cinzel' });
  capBand(c);
} });

// ================= step 2 · the red cloth on the chowki =================
SHOTS.push({ a: TL.S20, b: TL.S30 + .3, xf: .4, draw(c, u, t) {
  const k = easeIO(seg(t, TL.S20, TL.S30 + .3));
  mandir(t, ST(PREP, { cloth: seg(t, TL.RED - .3, TL.CHOWKI + .5) }));
  cam3({ pos: at3(k, [.5, 1.15, 1.7], [.2, 1.05, 1.55]), at: [0, .3, 0], fov: 46 });
  shoot(c, [0, .34, 0], 3);
  stepTitle(c, t, TL.S20 + .2, TL.S30 + .3, 2, 'A red cloth on a chowki');
  capBand(c);
} });

// ================= step 3 · the murtis: as you face them, Saraswati, Lakshmi, Ganesha =================
SHOTS.push({ a: TL.S30, b: TL.S40 + .3, xf: .4, draw(c, u, t) {
  const k = easeIO(seg(t, TL.S30, TL.S40 + .3));
  const mk = [seg(t, TL.SARAS - .3, TL.SARAS + .25), seg(t, TL.LAKSH - .3, TL.LAKSH + .25), seg(t, TL.GANESH - .3, TL.GANESH + .25)];
  mandir(t, ST(PREP, { cloth: 1, murti: mk }));
  cam3({ pos: at3(k, [0, 1.0, 2.45], [0, .95, 2.25]), at: [0, .5, 0], fov: 48 });
  shoot(c, [0, .5, MZ], 3);
  stepTitle(c, t, TL.S30 + .2, TL.S40 + .3, 3, 'Who sits where');
  const nm = [['SARASWATI', TL.SARAS], ['LAKSHMI', TL.LAKSH], ['GANESHA', TL.GANESH]];
  nm.forEach(([s, at], i) => nameUnder(c, s, i, t, at, TL.S40 + .3, { size: 36 }));
  if (t > TL.FACE - .1) text(c, 'as you face them', 540, 1110, 'italic 40px Marcellus', CREAM, { pop: t - TL.FACE, alpha: 1 - seg(t, TL.S40 - .2, TL.S40 + .1), glow: ['rgba(6,5,10,.95)', 16] });
  tag(c, 'MANY HOMES · TRADITIONS DIFFER', 540, 720, t, TL.MANY, { out: TL.S40, size: 26 });
  capBand(c);
} });

// ================= step 4 · new clothes, malas, flowers, a lotus for Lakshmi =================
SHOTS.push({ a: TL.S40, b: TL.S50 + .3, xf: .4, draw(c, u, t) {
  const k = easeIO(seg(t, TL.FLOWERS, TL.S50 + .3));
  const dr = [0, 1, 2].map(i => seg(t, TL.CLOTHES - .3 + i * .18, TL.CLOTHES + .1 + i * .18)), ml = [0, 1, 2].map(i => seg(t, TL.MALA - .2 + i * .15, TL.MALA + .15 + i * .15));
  mandir(t, ST(PREP, { cloth: 1, murti: [1, 1, 1], dress: dr, mala: ml, flowers: seg(t, TL.FLOWERS - .2, TL.FLOWERS), lotus: seg(t, TL.LOTUS - .2, TL.LOTUS + .3) }));
  cam3({ pos: at3(k, [0, .98, 2.3], [0, .64, .86]), at: at3(k, [0, .5, 0], [0, .48, MZ]), fov: lerp(48, 38, k) });
  shoot(c, [0, .48, MZ], 3);
  stepTitle(c, t, TL.S40 + .2, TL.S50 + .3, 4, 'Clothes, mala, flowers');
  for (const [w, at, y] of [['NEW CLOTHES', TL.CLOTHES, 720], ['MALA', TL.MALA, 720], ['LOTUS', TL.LOTUS, 720]]) {
    const nx = { 'NEW CLOTHES': TL.MALA, 'MALA': TL.FLOWERS, 'LOTUS': TL.S50 }[w];
    if (t > at - .05 && t < nx) text(c, w, 540, y, '700 64px Cinzel', w === 'LOTUS' ? '#FFB8C8' : GOLD, { pop: t - at, spacing: 4, glow: ['rgba(6,5,10,.95)', 22] });
  }
  capBand(c);
} });

// ================= step 5 · the kalash, built up on its rice =================
SHOTS.push({ a: TL.S50, b: TL.S60 + .3, xf: .4, draw(c, u, t) {
  const k = easeIO(seg(t, TL.S50, TL.S60 + .3));
  const dropK = (at) => t < at - .25 ? -1 : (t - at + .25) / .5;   // a coin/supari/rice falling into the pot
  mandir(t, ST(DONE, { kalash: { pot: seg(t, TL.KALASH - .3, TL.KALASH + .2), water: seg(t, TL.WATER - .2, TL.WATER + .5), coin: dropK(TL.COIN), supari: dropK(TL.SUPARI), rice: dropK(TL.RICE),
    leaves: seg(t, TL.LEAVES - .3, TL.LEAVES + .5), coco: seg(t, TL.COCONUT - .35, TL.COCONUT + .2), swastik: seg(t, TL.SWASTIK - .2, TL.SWASTIK + .3), mauli: seg(t, TL.MAULI - .2, TL.MAULI + .3) } }));
  const K0 = M_.kalashAt;
  cam3({ pos: at3(k, [K0[0] + .2, .62, K0[2] + .78], [K0[0] + .08, .55, K0[2] + .6]), at: [K0[0], .26, K0[2]], fov: 42 });
  shoot(c, [K0[0], .26, K0[2]], 3);
  stepTitle(c, t, TL.S50 + .2, TL.S60 + .3, 5, 'The kalash');
  const items = [['WATER', TL.WATER], ['COIN', TL.COIN], ['SUPARI', TL.SUPARI], ['RICE', TL.RICE], ['5 MANGO LEAVES', TL.LEAVES], ['COCONUT', TL.COCONUT], ['SWASTIK', TL.SWASTIK], ['MAULI', TL.MAULI]];
  items.forEach(([w, at], i) => { const nx = items[i + 1] ? items[i + 1][1] : TL.S60; if (t > at - .05 && t < nx - .05) text(c, w, 540, 730, '700 62px Cinzel', GOLD, { pop: t - at, spacing: 4, glow: ['rgba(6,5,10,.95)', 22] }); });
  capBand(c);
} });

// ================= step 6 · sit facing east or north; achaman, three sips =================
SHOTS.push({ a: TL.S60, b: TL.SIP - .15, xf: .4, draw(c, u, t) {
  const k = easeIO(seg(t, TL.S60, TL.SIP));
  mandir(t, ST(DONE, { samai: seg(t, TL.S60, TL.S60 + .8), diyas: 0, chowkiLamp: 0, incense: 0, tilak: [0, 0, 0], bhog: 0 }));
  cam3({ pos: at3(k, [0, 1.55, 2.2], [0, .95, 1.55]), at: [0, .45, 0], fov: 48 });
  shoot(c, [0, .5, MZ], 2);
  stepTitle(c, t, TL.S60 + .2, TL.SIP, 6, 'Sit, and sip');
  // the compass: E and N
  const a = seg(t, TL.EAST - .2, TL.EAST + .2);
  if (a > 0) { c.save(); c.globalAlpha = a; c.translate(540, 1030); c.strokeStyle = 'rgba(244,196,106,.85)'; c.lineWidth = 4; c.beginPath(); c.arc(0, 0, 90, 0, TAU); c.stroke();
    c.fillStyle = GOLD; c.beginPath(); c.moveTo(0, -120); c.lineTo(-16, -84); c.lineTo(16, -84); c.fill(); c.beginPath(); c.moveTo(120, 0); c.lineTo(84, -16); c.lineTo(84, 16); c.fill(); c.restore();
    text(c, 'N', 540, 1030 - 150, '700 46px Cinzel', t > TL.NORTH - .1 ? '#FFFFFF' : GOLD, { alpha: a, pop: t > TL.NORTH - .1 ? t - TL.NORTH : null, glow: ['rgba(6,5,10,.95)', 16] });
    text(c, 'E', 540 + 152, 1030, '700 46px Cinzel', '#FFFFFF', { alpha: a, pop: t - TL.EAST, glow: ['rgba(6,5,10,.95)', 16] });
    text(c, 'you face', 540, 1036, 'italic 34px Marcellus', CREAM, { alpha: a, glow: ['rgba(6,5,10,.95)', 14] }); }
  capBand(c);
} });
const SIPS = [0, 1, 2].map(i => TL.SIP + .1 + i * ((TL.ACHAMAN - TL.SIP) / 2.6));
SHOTS.push({ a: TL.SIP - .15, b: TL.S70 + .3, xf: .3, draw(c, u, t) {
  const P0 = M_.PP.position, k = easeIO(seg(t, TL.SIP - .15, TL.S70 + .3));
  const dr = SIPS.map(s => t > s ? (t - s) / .6 : null);
  const tilt = Math.max(...SIPS.map(s => Math.exp(-Math.pow((t - s - .1) / .25, 2)))) * .7;
  mandir(t, ST(DONE, { diyas: 0, chowkiLamp: 0, incense: 0, tilak: [0, 0, 0], bhog: 0, drops: dr, spoon: tilt }));
  cam3({ pos: at3(k, [P0.x + .12, .32, P0.z + .34], [P0.x + .08, .28, P0.z + .28]), at: [P0.x - .02, .1, P0.z], fov: 40 });
  shoot(c, [P0.x - .02, .1, P0.z], 4);
  stepTitle(c, t, -1, TL.S70 + .3, 6, 'Sit, and sip');
  SIPS.forEach((s, i) => { if (t > s) text(c, String(i + 1), 360 + i * 180, 760, '700 110px Cinzel', GOLD, { pop: t - s, alpha: 1 - seg(t, TL.S70 - .2, TL.S70 + .1), glow: ['rgba(6,5,10,.95)', 24] }); });
  topTitle(c, t, TL.ACHAMAN - .05, TL.S70, 'ACHAMAN', null, { y: 930, y0: 860, y1: 1010, font: '700 72px Cinzel' });
  capBand(c);
} });

// ================= step 7 · the sankalp: water, rice and a flower in the hand; your name, the day, why you pray =================
SHOTS.push({ a: TL.S70, b: TL.S80 + .3, xf: .4, draw(c, u, t) {
  const P0 = M_.PP.position, k = easeIO(seg(t, TL.NAME - .3, TL.S80 + .3));
  mandir(t, ST(DONE, { diyas: 0, chowkiLamp: 0, incense: 0, tilak: [0, 0, 0], bhog: 0, sankalp: 1 }));
  cam3({ pos: at3(k, [P0.x + .14, .36, P0.z + .3], [0, .95, 1.6]), at: at3(k, [P0.x + .02, .08, P0.z], [0, .5, 0]), fov: lerp(40, 46, k) });
  shoot(c, k < .5 ? [P0.x, .08, P0.z] : [0, .5, MZ], 3);
  stepTitle(c, t, TL.S70 + .2, TL.S80 + .3, 7, 'The sankalp');
  for (const [w, at, y] of [['YOUR NAME', TL.NAME, 700], ['THE DAY', TL.DAY, 790], ['WHY YOU PRAY', TL.WHY, 880]])
    if (t > at - .05) text(c, w, 540, y, '700 62px Cinzel', GOLD, { pop: t - at, alpha: 1 - seg(t, TL.SANKALP - .3, TL.SANKALP), spacing: 4, glow: ['rgba(6,5,10,.95)', 22] });
  topTitle(c, t, TL.SANKALP - .05, TL.S80, 'SANKALP', 'संकल्प · your intention', { y: 760, y0: 680, y1: 900, font: '700 90px Cinzel' });
  capBand(c);
} });

// ================= step 8 · Ganesha first =================
SHOTS.push({ a: TL.S80, b: TL.S90 + .3, xf: .4, draw(c, u, t) {
  const k = easeIO(seg(t, TL.S80, TL.S90 + .3)), F = FACE[2];
  const hk = seg(t, TL.FIRST - .4, TL.FIRST + .3);
  mandir(t, ST(DONE, { diyas: 0, chowkiLamp: 0, incense: 0, tilak: [0, 0, 0], bhog: 0, halo: [MX[2], CH.h + .22, MZ - .1, .25 + .35 * hk, .7 + .4 * hk] }));
  cam3({ pos: at3(k, [.25, .85, 1.35], [MX[2] + .04, .58, .62]), at: at3(k, [.25, .5, MZ], [MX[2], .5, MZ]), fov: lerp(44, 38, k) });
  shoot(c, [MX[2], .5, MZ], 3);
  stepTitle(c, t, TL.S80 + .2, TL.SHIVA, 8, 'Ganesha first');
  topTitle(c, t, TL.FIRST - .05, TL.S90, 'FIRST', 'always', { y: 480, font: '700 120px Cinzel' });
  tag(c, 'SHIVA PURANA · RUDRA SAMHITA, KUMARA KHANDA 18', 540, 1120, t, TL.SHIVA, { out: TL.S90, size: 24 });
  capBand(c);
} });

// ================= step 9 · each god in turn: tilak, akshat, flowers, incense, a lamp, bhog, with their mantra =================
// the camera goes Ganesha → Lakshmi (at LAMP) → Saraswati (at MANTRA); each gets the tilak as the camera arrives
SHOTS.push({ a: TL.S90, b: TL.S100 + .3, xf: .4, draw(c, u, t) {
  const toL = easeIO(seg(t, TL.LAMP9 - .5, TL.LAMP9 + .3)), toS = easeIO(seg(t, TL.MANTRA - .6, TL.MANTRA + .2));
  const x = lerp(lerp(MX[2], MX[1], toL), MX[0], toS);
  const til = [seg(t, TL.MANTRA, TL.MANTRA + .3), seg(t, TL.LAMP9 + .1, TL.LAMP9 + .4), seg(t, TL.TILAK - .1, TL.TILAK + .2)];
  mandir(t, ST(DONE, { tilak: til, diyas: 0, chowkiLamp: seg(t, TL.LAMP9 - .1, TL.LAMP9 + .3), incense: seg(t, TL.INCENSE - .2, TL.INCENSE + .3), bhog: seg(t, TL.BHOG - .2, TL.BHOG),
    glint: t > TL.AKSHAT - .1 && t < TL.AKSHAT + .5 ? [MX[2], CH.h + .36, MZ + .08, .5 * Math.sin(seg(t, TL.AKSHAT - .1, TL.AKSHAT + .5) * Math.PI), .25] : null }));
  cam3({ pos: [x + .03, .66, .82], at: [x, .5, MZ], fov: 40 });
  shoot(c, [x, .5, MZ], 3);
  stepTitle(c, t, TL.S90 + .2, TL.TILAK - .1, 9, 'Each god in turn');
  const words = [['TILAK', TL.TILAK], ['AKSHAT', TL.AKSHAT], ['FLOWERS', TL.FLOWERS9], ['INCENSE', TL.INCENSE], ['A LAMP', TL.LAMP9], ['BHOG', TL.BHOG]];
  words.forEach(([w, at], i) => { const nx = words[i + 1] ? words[i + 1][1] : TL.MANTRA; if (t > at - .05 && t < nx - .05) text(c, w, 540, 500, '700 80px Cinzel', GOLD, { pop: t - at, spacing: 6, glow: ['rgba(6,5,10,.95)', 24] }); });
  if (t > TL.BHOG && t < TL.MANTRA - .1) text(c, 'kheel-batashe, sweets', 540, 572, 'italic 38px Marcellus', CREAM, { alpha: seg(t, TL.BHOG, TL.BHOG + .3), glow: ['rgba(6,5,10,.95)', 14] });
  mantra(c, t, TL.TILAK - .1, TL.LAMP9 - .3, 'ॐ गं गणपतये नमः', 'Om Gam Ganapataye Namah', 1040);
  mantra(c, t, TL.LAMP9 + .1, TL.MANTRA - .4, 'ॐ श्रीं महालक्ष्म्यै नमः', 'Om Shreem Mahalakshmyai Namah', 1040);
  mantra(c, t, TL.MANTRA + .1, TL.S100 + .3, 'ॐ ऐं सरस्वत्यै नमः', 'Om Aim Saraswatyai Namah', 1040);
  capBand(c);
} });

// ================= step 10 · the havan, if your family does one =================
SHOTS.push({ a: TL.S100, b: TL.S110 + .3, xf: .4, draw(c, u, t) {
  const k = easeIO(seg(t, TL.S100, TL.S110 + .3));
  env3(HVS.S, 'lamplit', { k: .15, rot: 1 });
  const fl = Math.exp(-Math.max(0, t - TL.HAVAN) * 2.5) * (t > TL.HAVAN ? 1 : 0) + Math.exp(-Math.max(0, t - TL.NOW) * 2.5) * (t > TL.NOW ? 1 : 0);
  HVS.set(t, { fire: .9, flare: clamp(fl), ladle: seg(t, TL.HAVAN - .6, TL.HAVAN - .1) * (1 - seg(t, TL.NOW + .2, TL.NOW + .6)), pour: seg(t, TL.HAVAN - .2, TL.HAVAN + .4) * (1 - seg(t, TL.NOW, TL.NOW + .4)) });
  cam3({ pos: at3(k, [.4, 1.25, 2.4], [.25, 1.05, 1.9]), at: [0, .55, 0], fov: 50 });
  render3(c, HVS.S, CAM3, { exposure: 1.1, fx: lens(dist([0, .4, 0]), 3, { temp: .06 }) });
  stepTitle(c, t, TL.S100 + .2, TL.S110 + .3, 10, 'Havan');
  tag(c, 'IF YOUR FAMILY DOES ONE', 540, 1120, t, TL.HAVAN - .3, { out: TL.S110, size: 26 });
  capBand(c);
} });

// ================= step 11 · aarti: Ganesha first, then Lakshmi =================
const ARC = .12, ACY = CH.h + .19, ACZ = MZ + .22, APER = 1.05;
const aartiAt = (cx, tt) => { const a = Math.PI + tt / APER * TAU; return [cx + ARC * Math.sin(a), ACY + ARC * Math.cos(a) * 1.15, ACZ]; };
function aartiPath(t) {
  const sw = TL.THENL - .4;   // moves from Ganesha to Lakshmi
  const at = (tt) => tt < sw ? aartiAt(MX[2], tt - TL.AARTI) : tt < sw + .35 ? at3(easeIO((tt - sw) / .35), aartiAt(MX[2], sw - TL.AARTI), aartiAt(MX[1], 0)) : aartiAt(MX[1], tt - sw - .35);
  return { p: at(t), trail: Array.from({ length: 60 }, (_, i) => t - i * .02 > TL.AARTI - .2 ? at(t - i * .02) : null).filter(Boolean) };
}
SHOTS.push({ a: TL.S110, b: TL.S120 + .3, xf: .4, draw(c, u, t) {
  const k = easeIO(seg(t, TL.S110, TL.S120 + .3)), on = seg(t, TL.AARTI - .5, TL.AARTI - .1);
  const P = aartiPath(Math.max(t, TL.AARTI - .5));
  mandir(t, ST(DONE, { light: .75, aarti: { p: P.p, on, trail: P.trail } }));
  const fx = lerp(MX[2], MX[1], easeIO(seg(t, TL.THENL - .6, TL.THENL + .2)));
  cam3({ pos: [fx + lerp(.12, .06, k), .72, lerp(1.5, 1.35, k)], at: [fx, .5, MZ], fov: 40 });
  shoot(c, [fx, .5, MZ], 3);
  stepTitle(c, t, TL.S110 + .2, TL.S120 + .3, 11, 'Aarti');
  capBand(c);
} });

// ================= step 12 · pushpanjali: flowers in folded hands, a shower of petals =================
SHOTS.push({ a: TL.S120, b: TL.S130 + .3, xf: .4, draw(c, u, t) {
  const k = easeIO(seg(t, TL.S120, TL.S130 + .3));
  mandir(t, ST(DONE, { petals: t - TL.FOLDED + .3 }));
  WIDE(.6 + .4 * k);
  shoot(c, [0, .55, 0], 2);
  stepTitle(c, t, TL.S120 + .2, TL.PUSHP, 12, 'Flowers in folded hands');
  topTitle(c, t, TL.PUSHP - .05, TL.S130, 'PUSHPANJALI', 'पुष्पांजलि', { font: '700 84px Cinzel', sfont: '46px "Tiro Devanagari Sanskrit"' });
  capBand(c);
} });

// ================= step 13 · forgiveness: the closing prayer, the lights low =================
SHOTS.push({ a: TL.S130, b: TL.S140 + .3, xf: .5, draw(c, u, t) {
  const k = easeIO(seg(t, TL.S130, TL.S140 + .3));
  mandir(t, ST(DONE, { light: lerp(1, .35, seg(t, TL.S130, TL.FORGIVE + .5)), petals: 99, envK: .12, coins: t > TL.COMPLETE - .3 ? t - TL.COMPLETE + .3 : null }));
  cam3({ pos: at3(k, [0, .8, 1.3], [0, .68, .7]), at: [0, .55, MZ], fov: lerp(40, 34, k) });
  shoot(c, [0, .55, MZ], 3, { exposure: 1.15 });
  stepTitle(c, t, TL.S130 + .2, TL.MANTRAH - .2, 13, 'Ask forgiveness');
  const a = seg(t, TL.MANTRAH - .3, TL.MANTRAH) * (1 - seg(t, TL.S140 - .1, TL.S140 + .2));
  if (a > 0) {
    band(c, 380, 760, .66 * a);
    text(c, 'मन्त्रहीनं क्रियाहीनं भक्तिहीनं सुरेश्वर ।', 540, 440, '46px "Tiro Devanagari Sanskrit"', '#FFE9C0', { alpha: a, glow: ['rgba(6,5,10,.95)', 16], maxW: 940 });
    text(c, 'यत्पूजितं मया देव परिपूर्णं तदस्तु मे ॥', 540, 506, '46px "Tiro Devanagari Sanskrit"', '#FFE9C0', { alpha: a, glow: ['rgba(6,5,10,.95)', 16], maxW: 940 });
    text(c, 'mantra-hīnaṁ kriyā-hīnaṁ bhakti-hīnaṁ sureśvara', 540, 576, 'italic 32px Marcellus', GOLD, { alpha: a, glow: ['rgba(6,5,10,.95)', 14], maxW: 940 });
    text(c, '“Lacking mantra, rite or devotion, O Lord,', 540, 640, 'italic 34px Marcellus', CREAM, { alpha: a * seg(t, TL.MISSED - .3, TL.MISSED + .2), glow: ['rgba(6,5,10,.95)', 14], maxW: 940 });
    text(c, 'let what I offered be complete.”', 540, 686, 'italic 34px Marcellus', CREAM, { alpha: a * seg(t, TL.MISSED - .3, TL.MISSED + .2), glow: ['rgba(6,5,10,.95)', 14], maxW: 940 });
  }
  tag(c, 'THE TRADITIONAL CLOSING PRAYER', 540, 1120, t, TL.MANTRAH, { out: TL.S140, size: 24 });
  capBand(c);
} });

// ================= step 14 · diyas in every room, rangoli and footprints at the door, one lamp all night =================
SHOTS.push({ a: TL.S140, b: TL.ASK0 + .3, xf: .45, draw(c, u, t) {
  const k = easeIO(seg(t, TL.S140, TL.ASK0 + .3));
  const dk = Hm.diyas.map((_, i) => seg(t, TL.DIYAS - .2 + i * .2, TL.DIYAS + .1 + i * .2));
  const op = seg(t, TL.ROOM - .4, TL.ROOM + .5);
  homeNight(t, { wind: .45, diyas: dk, open: op, inner: op, feet: 8 * seg(t, TL.FOOT - .5, TL.DOOR + .6) });
  cam3({ pos: at3(k, [.2, 1.8, 5.0], [0, 1.6, 3.9]), at: at3(k, [0, 1.3, 0], [0, 1.0, 0]), fov: 52 });
  render3(c, Hm.S, CAM3, { exposure: 1.55, fx: lens(dist([0, 1, .6]), 3, { temp: .07 }) });
  stepTitle(c, t, TL.S140 + .2, TL.ALL - .3, 14, 'Light up the home');
  topTitle(c, t, TL.ALL - .1, TL.ASK0, 'ALL NIGHT', 'one lamp keeps burning', { font: '700 90px Cinzel' });
  capBand(c);
} });

// ================= the ask: who sits where on YOUR chowki? save this =================
SHOTS.push({ a: TL.ASK0, b: TL.CARD, xf: .4, draw(c, u, t) {
  const k = easeIO(seg(t, TL.ASK0, TL.CARD));
  mandir(t, ST(DONE, { petals: 99 }));
  WIDE(1 - k * .3);
  shoot(c, [0, .55, 0], 2);
  ['SARASWATI', 'LAKSHMI', 'GANESHA'].forEach((s, i) => nameUnder(c, s, i, t, TL.ASK0 + .2 + i * .15, 1e9, { size: 30 }));
  topTitle(c, t, TL.YOUR - .1, TL.CARD + 1, 'YOUR CHOWKI?', 'who sits where', { font: '700 84px Cinzel' });
  if (t > TL.SAVE2 - .1) text(c, 'SAVE THIS', 540, 1110, '700 60px Cinzel', '#FFFFFF', { pop: t - TL.SAVE2, spacing: 6, glow: ['rgba(244,170,60,.6)', 26] });
  capBand(c);
} });

// ================= the card =================
SHOTS.push({ a: TL.CARD, b: TL.END + 1, draw(c, u, t) {
  rkCardCine(c, u, t, { title: 'MEET OUR GODS', line: 'Picture books of our gods, for kids', price: 'The Navadurga Set is out now', note: 'Link in bio' });
} });
