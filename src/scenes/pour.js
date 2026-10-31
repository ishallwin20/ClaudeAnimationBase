// pour.js: "What you POUR on SHIVA decides what you GET" (ad 69), in the 3D style, #3 of the five-reel push. A black
// stone linga in a lamp-lit sanctum. Not a splash: the Shiva Purana's dhara is a stream that never breaks (Rudra Samhita,
// Srishti Khanda 14.67). Then each liquid and what it gives, one at a time down the stone: water eases fever (68–70),
// ghee and the family flourishes (72), milk with sugar, a mind like Brihaspati's (74–75), honey, wealth like Kubera's,
// sugarcane juice, every joy (80); one more defeats enemies (mustard oil, 79: in the dark, named on the board); only Ganga
// water gives this life's joys and moksha (81–82); with every stream the Mahamrityunjaya, ten thousand times (82). The
// screenshot board, the ask, next: the Diwali aarti-along, the card. STORYBOARD.md has the plan and the sources; the
// timeline (from the voice) is pour_tl.js, the sanctum, the liquids and the 2D pieces pour_props.js.
LOOK.bloom = .12;   // matte (owner, 30 Oct): cine.js's own bloom kept low, no fx bloom
const S = sanctum3(), SC = S.scene, CR = S.CROWN;
const CAPY = 1290;
// a soft dark band under the captions, so they read over milk and lamplight
const capBand = (c, a = .5) => band(c, 1190, 1500, a);
VO.caps.forEach((k, i) => say(i ? k.a : -1, k.b, k.text, { at: i ? k.at : k.at.map(() => -1), y: k.id === 'save' ? 1380 : CAPY }));

// cameras: orbit(a, R, h, at, fov): a 0 from the east (the door), + toward the south; north is on screen right
const orbit = (a, R, h, at = [0, .8, 0], fov = 34) => cam3({ pos: [Math.cos(a) * R, h, Math.sin(a) * R], at, fov });
// the lens: a little depth of field on the linga, a gentle warm grade (no bloom)
const lens = (focus, ap = 7, o = {}) => ({ dof: { focus, aperture: ap, max: 14, nearK: .6 }, grade: { contrast: 1.06, sat: o.sat ?? 1.02, temp: o.temp ?? .03, lift: .0, gamma: 1, gain: 1 }, ...o.fx });
const dist = (p) => CAM3.position.distanceTo(V3(...p));
// when each liquid is named: the drop row fills as they come
const NAMED = [TL.WATER, TL.GHEE, TL.MILK, TL.HONEY, TL.CANE, TL.ENEMIES - .3, TL.GANGA];
const row = (c, t, cur, a = 1) => dropRow(c, t, NAMED, { cur, alpha: a, y: 480 });
// pour(t, id, t0, o): the lota at the lip point o.lip (else above the crown to the north), tipping in from t0; the
// stream lands on the crown and the film runs down from it. Returns the film's front (0..1).
const LIP = [0, 1.3, -.26];
const pour = (t, id, t0, o = {}) => {
  const L = LIQ[id], lip = o.lip || LIP, tip = easeOut(seg(t, t0 - .6, t0)) * (o.tilt ?? 1.15);
  const p0 = o.noLota ? lip : S.lota.tip(lip, CR, tip);
  if (o.noLota) S.lota.visible = false;
  const head = o.head ?? easeIn(seg(t, t0 - .1, t0 + .28)), age = t - t0 - .25;
  S.stream.pour(t, p0, CR, id, { head, a: o.a ?? 1, r: o.r });
  const front = age > 0 ? clamp(age * L.front * (o.speed ?? 1)) : 0;
  S.wet(t, id, Math.max(front, o.wet ?? 0), { a: o.a ?? 1 });
  if (head > .98) S.spray.at(t, [CR[0] + .01, CR[1] + .005, CR[2]], id, o.spray ?? 1);
  return front;
};

// ================= A · the hook: milk on the black stone, frame 0 already pouring =================
SHOTS.push({ a: 0, b: TL.B0 + .3, draw(c, u, t) {
  S.reset(); S.set(t);
  pour(t, 'milk', -3, { wet: .55 + t * .08 });
  const k = easeIO(u / (TL.B0 + .3));
  orbit(.32 - .06 * k, lerp(3.0, 2.7, k), 1.35, [0, lerp(.6, .64, k), -.08], 38);
  render3(c, SC, CAM3, { exposure: 1.1, fx: lens(dist([0, .8, 0]), 6) });
  capBand(c);
  glow(c, 540, 760, 460, '#FFC890', .08);
} });

// ================= B · not a splash: water thrown at the stone, ✗ =================
SHOTS.push({ a: TL.B0, b: TL.C0 + .3, xf: .25, draw(c, u, t) {
  S.reset(); S.set(t);
  const from = [.9, 1.25, .55], t0 = TL.SPLASH - .25;
  S.toss.at(t, t0, from);
  S.coat.set(t, 'water', 0, { spots: .75 * clamp((t - t0 - .25) * 4), side: Math.atan2(from[2], from[0]), a: .7 });
  orbit(.12, 2.9, 1.3, [0, .62, -.05], 38);
  render3(c, SC, CAM3, { exposure: 1.1, fx: lens(dist([0, .8, 0]), 6) });
  capBand(c);
  mark(c, false, 540, 760, 200, t, TL.SPLASH + .05);
  flash(c, .25 * Math.exp(-Math.max(0, t - TL.SPLASH) * 6) * (t > TL.SPLASH ? 1 : 0), '#FF5A48', 'screen');
} });

// ================= C · the Purana: a stream that never breaks, ✓ (14.67) =================
SHOTS.push({ a: TL.C0, b: TL.D0 + .4, xf: .35, draw(c, u, t) {
  S.reset(); S.set(t);
  pour(t, 'water', TL.C0 + .1, { speed: .6 });
  const k = easeIO(u / (TL.D0 + .4 - TL.C0));
  // close on the crown: the stream meeting the stone, then easing back
  orbit(.4 - .1 * k, lerp(1.0, 1.25, k), lerp(1.32, 1.3, k), [0, lerp(1.05, .98, k), -.08], 40);
  render3(c, SC, CAM3, { exposure: 1.12, fx: lens(dist(CR), 9) });
  capBand(c);
  mark(c, true, 820, 1060, 150, t, TL.STREAM + .05);
  verse(c, [['“The devotees shall pour water', 'italic 40px Marcellus', '#FFF3DC'], ['in a continuous stream.”', 'italic 40px Marcellus', '#FFF3DC'],
    ['— Shiva Purana, Rudra Samhita 1.14.67', '28px Marcellus', '#CFC2B0']], 560, t, TL.PURANA - .2, { dy: 54 });
} });

// a liquid's shot: the camera path cam(k, t), its verse tag, the drop row on its name
const liquidShot = (id, a, b, nameAt, i, tagTxt, cam, o = {}) => SHOTS.push({ a, b, xf: .4, draw(c, u, t) {
  S.reset(); S.set(t, o.light);
  const front = pour(t, id, a + (o.lead ?? .5), o.pour);
  cam(easeIO(u / (b - a)), t);
  render3(c, SC, CAM3, { exposure: o.exposure ?? 1.12, fx: lens(o.focus ? dist(o.focus) : dist([0, .8, 0]), o.ap ?? 7, o.lens) });
  capBand(c);
  if (o.draw) o.draw(c, t, front);
  row(c, t, i);
  tag(c, tagTxt, 470, 1462, t, nameAt + .3, { size: 24 });
} });

// ================= D · WATER: it eases fever (14.68–70) =================
liquidShot('water', TL.D0, TL.E0 + .4, TL.WATER, 0, 'SHIVA PURANA · RUDRA SAMHITA 1.14.68',
  (k) => orbit(.55 - .25 * k, 2.8, lerp(1.0, 1.25, k), [0, .6, -.05], 36), { pour: { speed: .9 } });
// ================= E · GHEE: your family flourishes (14.72) =================
liquidShot('ghee', TL.E0, TL.F0 + .4, TL.GHEE, 1, 'SHIVA PURANA · RUDRA SAMHITA 1.14.72',
  (k) => orbit(-.15 + .2 * k, lerp(1.9, 1.7, k), lerp(.95, .9, k), [0, lerp(.85, .7, k), 0], 38), { focus: [.24, .8, 0], pour: { speed: .8 }, light: { col: '#FFC890' } });
// ================= F · MILK with SUGAR: a mind as sharp as Brihaspati's (14.74–75) =================
liquidShot('milk', TL.F0, TL.G0 + .4, TL.MILK, 2, 'SHIVA PURANA · RUDRA SAMHITA 1.14.74–75',
  (k) => orbit(.25 + .35 * k, lerp(3.0, 2.6, k), lerp(1.6, 1.3, k), [0, .62, -.05], 38), { pour: { speed: .55 } });
// ================= G · HONEY: wealth like Kubera's (14.80); macro, slow =================
liquidShot('honey', TL.G0, TL.H0 + .4, TL.HONEY, 3, 'SHIVA PURANA · RUDRA SAMHITA 1.14.80',
  (k) => orbit(.3 - .12 * k, lerp(1.75, 1.55, k), lerp(1.3, 1.2, k), [0, lerp(.9, .82, k), -.06], 38), { focus: CR, ap: 10, pour: { speed: 1.4, wet: .1 }, light: { col: '#FFD0A0' } });
// ================= H · SUGARCANE JUICE: every joy (14.80) =================
liquidShot('cane', TL.H0, TL.I0 + .4, TL.CANE, 4, 'SHIVA PURANA · RUDRA SAMHITA 1.14.80',
  (k) => orbit(-.35 + .5 * k, 2.9, lerp(1.05, 1.3, k), [0, .6, -.05], 36), { pour: { speed: .8 } });

// ================= I · one more defeats ENEMIES: in the dark, red, the oil unseen =================
SHOTS.push({ a: TL.I0, b: TL.J0 + .4, xf: .4, draw(c, u, t) {
  S.reset();
  const dark = seg(t, TL.ENEMIES - .4, TL.ENEMIES + .2);
  S.set(t, { lamps: lerp(.6, .15, dark), key: lerp(.35, .1, dark), rim: lerp(1.4, 2.2, dark), rimCol: '#FF4A30', hemi: .4, env: .4 });
  pour(t, 'oil', TL.I0 + .4, { speed: .7, spray: .5 });
  const k = easeIO(u / (TL.J0 + .4 - TL.I0));
  orbit(.1 + .1 * k, lerp(2.8, 2.4, k), 1.05, [0, .62, 0], 38);
  render3(c, SC, CAM3, { exposure: 1, fx: lens(dist([0, .8, 0]), 7, { sat: .9, temp: -.02 }) });
  capBand(c);
  if (dark > 0) { c.save(); c.globalCompositeOperation = 'multiply'; c.fillStyle = rgba('#B02A20', .22 * dark); c.fillRect(0, 0, W, H); c.restore(); }
  row(c, t, 5);
} });

// ================= J · only ONE gives this life's joys AND moksha: dark, a light opens above =================
SHOTS.push({ a: TL.J0, b: TL.K0 + .4, xf: .4, draw(c, u, t) {
  S.reset(); const k = easeIO(u / (TL.K0 + .4 - TL.J0)), up = seg(t, TL.MOKSHA - .3, TL.GANGA);
  S.set(t, { lamps: lerp(.35, .6, up), key: lerp(.3, .5, up), rim: .7, hemi: .6, col: '#DCE8FF' });
  orbit(.2, lerp(2.8, 2.6, k), 1.05, [0, lerp(.75, .85, k), 0], 42);
  render3(c, SC, CAM3, { exposure: 1.05, fx: lens(dist([0, .8, 0]), 6) });
  capBand(c);
  // the light from above, opening
  const [x, y] = toScreen3([0, 3.2, 0]);
  glow(c, x, Math.max(y, 120), 700, '#DFF2FF', .22 * up + .05, 'screen');
  row(c, t, -1);
} });

// ================= K · GANGA JAL: the stream comes down from the light =================
SHOTS.push({ a: TL.K0, b: TL.L0 + .4, xf: .3, draw(c, u, t) {
  S.reset(); S.set(t, { lamps: .8, key: .7, rim: .9, col: '#E8F0FF' });
  const head = easeIn(seg(t, TL.K0 + .05, TL.GANGA + .25));
  pour(t, 'ganga', TL.GANGA + .1, { lip: [.02, 3.4, -.02], noLota: true, head, speed: .7 });
  const k = easeIO(u / (TL.L0 + .4 - TL.K0));
  orbit(.25 - .1 * k, lerp(2.6, 3.1, k), lerp(.9, 1.15, k), [0, lerp(.95, .66, k), -.05], 44);
  render3(c, SC, CAM3, { exposure: 1.12, fx: lens(dist([0, .8, 0]), 6, { fx: { rays: { at: [0, 3.2, 0], k: .18, thresh: .9, decay: .95, len: .5, col: '#DFF2FF' } } }) });
  capBand(c);
  const [x, y] = toScreen3([0, 3.2, 0]);
  glow(c, x, Math.max(y, 100), 600, '#DFF2FF', .14, 'screen');
  row(c, t, 6);
  text(c, 'GANGA JAL', 540, 640, '700 96px Cinzel', '#FFE2A0', { pop: t - TL.GANGA, glow: ['rgba(10,6,4,.95)', 30], spacing: 4 });
  tag(c, 'SHIVA PURANA · RUDRA SAMHITA 1.14.81–82', 470, 1462, t, TL.GANGA + .4, { size: 24 });
} });

// ================= L · with every stream, the Mahamrityunjaya; ten thousand times (14.82) =================
SHOTS.push({ a: TL.L0, b: TL.M0 + .4, xf: .4, draw(c, u, t) {
  S.reset(); S.set(t, { lamps: 1, key: .8, rim: 1 });
  pour(t, 'ganga', TL.L0 - 3, { lip: [.02, 3.4, -.02], noLota: true, wet: 1 });
  const k = easeIO(u / (TL.M0 + .4 - TL.L0));
  orbit(.5 - .7 * k, 3.0, 1.25, [0, .66, -.05], 40);
  render3(c, SC, CAM3, { exposure: 1.1, fx: lens(dist([0, .8, 0]), 6) });
  capBand(c);
  const a = seg(t, TL.MANTRA - .2, TL.MANTRA + .3);
  if (a > 0) {
    band(c, 470, 720, .6 * a);
    text(c, 'ॐ त्र्यम्बकं यजामहे', 540, 545, '54px "Tiro Devanagari Sanskrit"', '#FFE2A0', { alpha: a, glow: ['rgba(6,5,10,.9)', 16] });
    text(c, 'सुगन्धिं पुष्टिवर्धनम्', 540, 625, '54px "Tiro Devanagari Sanskrit"', '#FFE2A0', { alpha: a, glow: ['rgba(6,5,10,.9)', 16] });
  }
  if (t > TL.TEN - .1) {
    const n = Math.round(10000 * easeOut(seg(t, TL.TEN - .1, TL.TIMES + .2)));
    text(c, n.toLocaleString('en-IN'), 540, 860, '700 150px Cinzel', '#FFD27A', { pop: t - TL.TEN + .1, glow: ['rgba(10,6,4,.95)', 30], spacing: 4 });
  }
} });

// ================= M · screenshot this: the board =================
SHOTS.push({ a: TL.M0, b: TL.N0 + .4, xf: .4, draw(c, u, t) {
  S.reset(); S.set(t, { lamps: 1, key: .8 });
  S.wet(t, 'ganga', 1);
  orbit(.3, 3.2, 2.4, [0, .7, 0], 40);
  render3(c, SC, CAM3, { exposure: 1.05, fx: lens(dist([0, .8, 0]), 10) });
  c.fillStyle = `rgba(6,5,10,${.45 * seg(t, TL.SCREEN - .2, TL.SCREEN + .3)})`; c.fillRect(0, 0, W, H);
  board(c, t, TL.SCREEN - .25);
  const f = seg(t, TL.SCREEN + .25, TL.SCREEN + .3) * (1 - seg(t, TL.SCREEN + .3, TL.SCREEN + .6));
  if (f > 0) { c.fillStyle = `rgba(255,248,235,${.5 * f})`; c.fillRect(0, 0, W, H); }
} });

// ================= N · the ask: which one will YOU pour? =================
SHOTS.push({ a: TL.N0, b: TL.O0 + .4, xf: .4, draw(c, u, t) {
  S.reset(); S.set(t);
  pour(t, 'milk', TL.N0 - 4, { lip: [.02, 3.4, -.02], noLota: true, wet: 1 });
  const k = easeIO(u / (TL.O0 + .4 - TL.N0));
  orbit(.2 + .1 * k, lerp(2.9, 2.7, k), 1.45, [0, .62, -.05], 38);
  render3(c, SC, CAM3, { exposure: 1.1, fx: lens(dist([0, .8, 0]), 7) });
  capBand(c);
  // the six to choose from, popping in round the question
  const pick = ['water', 'ghee', 'milk', 'honey', 'cane', 'ganga'];
  pick.forEach((id, i) => {
    const x = 170 + (i % 3) * 300, y = 520 + Math.floor(i / 3) * 170, at = TL.YOU - .2 + i * .1, k2 = popK(t - at);
    if (t < at) return;
    drop(c, x, y - 18 + 5 * Math.sin(t * 3 + i), 70 * k2, LIQ[id].dot, 1, { blur: 14 });
    text(c, LIQ[id].name, x, y + 52, '700 30px Cinzel', '#FFF3DC', { pop: t - at, glow: ['rgba(6,5,10,.95)', 14], spacing: 1, maxW: 260 });
  });
} });

// ================= O · next: the Diwali aarti, the plate circling the linga =================
SHOTS.push({ a: TL.O0, b: TL.CARD, xf: .4, draw(c, u, t) {
  S.reset(); S.set(t, { lamps: 1, key: .7 });
  S.wet(t, 'ganga', 1);
  // the plate goes round clockwise (seen from the devotee) in front of the linga
  const a = t * 2.2, P = S.plate; P.visible = true;
  P.position.set(.62 + .05 * Math.cos(a), .82 + .32 * Math.sin(a), .32 * Math.cos(a));
  S.wicks.forEach(w => w.set(t, 1));
  const k = easeIO(u / (TL.CARD - TL.O0));
  orbit(.08, lerp(2.7, 3.5, k), lerp(1.2, 1.6, k), [0, lerp(.62, .7, k), -.05], 40);
  render3(c, SC, CAM3, { exposure: 1.1, fx: lens(dist([0, .8, 0]), 7) });
  capBand(c);
  seriesTag(c, 'NEXT', t, TL.NEXT, { w: 240, y: 520 });
  text(c, 'DIWALI AARTI', 540, 640, '700 76px Cinzel', '#FFE2A0', { pop: t - TL.AARTI, glow: ['rgba(10,6,4,.95)', 24], spacing: 3 });
  text(c, 'do it WITH the reel', 540, 720, 'italic 42px Marcellus', '#FFF3DC', { pop: t - TL.AARTI - .3, glow: ['rgba(10,6,4,.95)', 16] });
} });

// ================= the card =================
SHOTS.push({ a: TL.CARD, b: TL.END + 1, draw(c, u, t) {
  rkCardCine(c, u, t, { title: 'MEET OUR GODS', line: 'Picture books of our gods, for kids', price: 'The Navadurga Set is out now', note: 'Link in bio' });
} });
