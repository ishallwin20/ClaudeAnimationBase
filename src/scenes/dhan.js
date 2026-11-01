// dhan.js: "DHANTERAS was never about GOLD" (ad 71), in the 3D style. A gold coin spins on red puja cloth and falls
// flat as its other name comes up: Dhanvantari Trayodashi. The ocean of milk at dawn: the gods churned it for one thing,
// amrit (Bhagavata 8.6.21–23); first came treasures, the wish-cow, the white elephant, the jewel (8.8.1–6), then Lakshmi,
// the goddess of wealth (8.8.8); they kept churning; last of all rose Dhanvantari with a jug full of amrit (8.8.31–35),
// the god of health who gave the world Ayurveda (2.7.21). Wealth came first, life was the prize. For this night the
// Padma Purana gives one rule: a lamp for Yama outside the door, so untimely death stays away (Uttara Khanda 122); not one
// word about gold. The screenshot board, the ask (GOLD or HEALTH?), next: the Diwali aarti-along, the card.
// STORYBOARD.md has the plan and the sources; the timeline (from the voice) is dhan_tl.js, the sets dhan_sets.js.
LOOK.bloom = .1;   // matte (owner, 30 Oct): cine.js's own bloom kept low, no fx bloom
const ST = studio3(), OC = ocean3(), DR = door3();
const CAPY = 1290;
// darker over the bright milk (the ocean shots are the ones with a far clip)
const capBand = (c, a) => band(c, 1190, 1500, a ?? (CAM3.far > 1000 ? .72 : .5));
VO.caps.forEach((k, i) => say(i ? k.a : -1, k.b, k.text, { at: i ? k.at : k.at.map(() => -1), y: k.y ?? CAPY }));

// the lens: depth of field, a gentle grade (no bloom)
const lens = (focus, ap = 7, o = {}) => ({ dof: { focus, aperture: ap, max: 14, nearK: .6 }, grade: { contrast: o.contrast ?? 1.06, sat: o.sat ?? 1.03, temp: o.temp ?? .03, lift: 0, gamma: 1, gain: 1 }, ...o.fx });
const dist = (p) => CAM3.position.distanceTo(V3(...p));
const clip = (near, far) => { CAM3.near = near; CAM3.far = far; };
const at3 = (k, a, b) => a.map((v, i) => lerp(v, b[i], k));

// ================= A · the hook: the coin spinning on its edge; it falls flat on its other name =================
// the coin: spinning (phi) on its edge with a little precession; from NAME it tips, rings down and lies flat
const FALL0 = TL.NAME - .15, FALL1 = FALL0 + .85;
function coinSpin(t) {
  const th = t < FALL0 ? .06 + .02 * Math.sin(t * 3) : t < FALL1 ? lerp(.08, Math.PI / 2 - .05, easeIn(seg(t, FALL0, FALL1))) : Math.PI / 2 - .05 * Math.exp(-(t - FALL1) * 3.5) * Math.abs(Math.cos((t - FALL1) * 22));
  const w = t < FALL0 ? 7.5 : 7.5 + 22 * seg(t, FALL0, FALL1 + .5) * Math.exp(-Math.max(0, t - FALL1) * 2);
  const phi = t < FALL0 ? t * 7.5 : FALL0 * 7.5 + (t - FALL0) * w;
  coinPose(ST.coin, 0, 0, phi, th);
}
SHOTS.push({ a: 0, b: TL.C0 + .3, draw(c, u, t) {
  clip(.05, 80); ST.set(t); ST.K.visible = false; ST.coin.group.visible = true;
  coinSpin(t);
  const k = easeIO(seg(t, FALL0 - .3, TL.C0 + .3));
  cam3({ pos: at3(k, [.3, .45, 4.6], [.2, 3.2, 1.9]), at: at3(k, [0, .2, 0], [0, -.2, -.45]), fov: 30 });
  render3(c, ST.S, CAM3, { exposure: 1.05, fx: lens(dist([0, .5, 0]), 9) });
  capBand(c);
  title(c, 'DHANVANTARI', 470, t, TL.NAME, { size: 84 });
  title(c, 'TRAYODASHI', 570, t, TL.TRAY, { size: 84 });
} });

// ================= C · the ocean of milk: the gods churned it for one thing, AMRIT (8.6.21–23) =================
SHOTS.push({ a: TL.C0, b: TL.D0 + .4, xf: .35, draw(c, u, t) {
  clip(1, 2600); OC.set(t);
  const k = easeIO(u / (TL.D0 + .4 - TL.C0));
  cam3({ pos: at3(k, [150, 22, 200], [118, 18, 158]), at: [0, 30, 0], fov: 42 });
  render3(c, OC.S, CAM3, { exposure: .95, fx: lens(dist([0, 30, 0]), 2, { fx: { rays: { at: [-420, 40, -820], k: .14, thresh: .85, decay: .95, len: .55, col: '#FFE0B0' } } }) });
  capBand(c);
  title(c, 'AMRIT', 600, t, TL.AMRIT, { size: 110, col: '#FFD27A' });
  tag(c, 'BHAGAVATA PURANA 8.6.22', 470, 1462, t, TL.OCEAN + .2, { size: 24 });
} });

// ================= D · first came treasures: lights rising out of the foam (8.8.1–6) =================
const TREAS = [[TL.COW - .5, 'KAMADHENU', 'the wish-cow'], [TL.ELEPHANT - .5, 'AIRAVATA', 'the white elephant'], [TL.JEWEL - .5, 'KAUSTUBHA', 'the great jewel']];
SHOTS.push({ a: TL.D0, b: TL.E0 + .4, xf: .4, draw(c, u, t) {
  clip(1, 2600); OC.set(t);
  TREAS.forEach(([t0], i) => OC.rise(i, t, t0));
  const k = easeIO(u / (TL.E0 + .4 - TL.D0));
  cam3({ pos: at3(k, [95, 9, 120], [80, 12, 105]), at: at3(k, [0, 22, 10], [0, 30, 10]), fov: 46 });
  render3(c, OC.S, CAM3, { exposure: .95, fx: lens(dist([0, 25, 20]), 3) });
  capBand(c);
  TREAS.forEach(([t0, name, sub], i) => {
    const T = OC.treasures[i]; if (!T.g.visible) return;
    pinLabel(c, name, T.g.position.toArray(), t, t0 + .45, { up: 70, sub, out: i < 2 ? TREAS[i + 1][0] + .8 : 1e9 });
  });
  tag(c, 'BHAGAVATA PURANA 8.8.1–6', 470, 1462, t, TL.TREAS + .2, { size: 24 });
} });

// ================= E · then Lakshmi herself, the goddess of wealth (8.8.8): the lotus opens =================
SHOTS.push({ a: TL.E0, b: TL.F0 + .4, xf: .4, draw(c, u, t) {
  clip(.5, 2600); OC.set(t);
  const L = OC.lotus; L.visible = true; OC.vas.visible = false;
  const r = easeOut(seg(t, TL.E0 - .2, TL.LAKSHMI + .3)), op = easeIO(seg(t, TL.LAKSHMI - .2, TL.WEALTH + .3));
  L.position.y = lerp(-6, 0, r); L.open(op);
  OC.lotusHalo.material.opacity = .55 * op;
  const k = easeIO(u / (TL.F0 + .4 - TL.E0));
  cam3({ pos: at3(k, [-22, 11, 96], [-26, 15, 91]), at: [-46, 4.5, 62], fov: 40 });
  render3(c, OC.S, CAM3, { exposure: .95, fx: lens(dist([-46, 3, 62]), 6) });
  capBand(c);
  title(c, 'LAKSHMI', 600, t, TL.LAKSHMI, { size: 110, col: '#FFC8D8', glowCol: 'rgba(60,10,30,.95)' });
  tag(c, 'BHAGAVATA PURANA 8.8.8', 470, 1462, t, TL.LAKSHMI + .3, { size: 24 });
} });

// ================= F · but the gods kept churning: low and fast over the milk, the mountain spinning =================
SHOTS.push({ a: TL.F0, b: TL.G0 + .4, xf: .3, draw(c, u, t) {
  clip(1, 2600); OC.set(t, { churn: 2.6, sunGlow: .55, sun: .8 });
  const k = easeIn(u / (TL.G0 + .4 - TL.F0)), sh = .25 * Math.sin(t * 31) * k;
  cam3({ pos: at3(k, [110, 4, 70], [60, 3, 40]), at: [0, 18 + sh, 0], fov: 44, roll: .03 * Math.sin(t * 2) });
  render3(c, OC.S, CAM3, { exposure: .9, fx: lens(dist([0, 20, 0]), 3, { sat: .95 }) });
  capBand(c);
} });

// ================= G · last of all rose DHANVANTARI, with a jug full of amrit (8.8.31–35) =================
const DP = [34, 0, -6];
SHOTS.push({ a: TL.G0, b: TL.H0 + .4, xf: .35, draw(c, u, t) {
  clip(.5, 2600); OC.set(t, { churn: .6, sunGlow: .9 });
  OC.dRise(t, seg(t, TL.G0 + .1, TL.DHANV + .4));
  const k = easeIO(u / (TL.H0 + .4 - TL.G0)), jug = easeIO(seg(t, TL.JUG - .3, TL.AMRIT2 + .5));
  const DM_ = OC.D.group, s = 9;
  // the jug in world space
  const J = OC.D.K.getWorldPosition(V3()).toArray();
  const aim = at3(jug, [DP[0], 9.5 + DM_.position.y * .25, DP[2]], J);
  cam3({ pos: at3(k, [DP[0] + 34, 3, DP[2] + 14], [DP[0] + 24, 5, DP[2] + 10]), at: aim, fov: lerp(44, 30, jug) });
  render3(c, OC.S, CAM3, { exposure: .95, fx: lens(dist(aim), 4, { fx: { rays: { screen: (() => { const [x, y] = toScreen3([DP[0] - 2, 11 + DM_.position.y, DP[2]]); return [x / W, 1 - y / H]; })(), k: .16, thresh: .8, decay: .95, len: .5, col: '#FFE2B0' } } }) });
  capBand(c);
  title(c, 'DHANVANTARI', 560, t, TL.DHANV, { size: 92, out: TL.JUG - .2 });
  tag(c, 'BHAGAVATA PURANA 8.8.31–34', 470, 1462, t, TL.DHANV + .3, { size: 24 });
} });

// ================= H · the god of HEALTH, who gave the world AYURVEDA (2.7.21) =================
SHOTS.push({ a: TL.H0, b: TL.I0 + .4, xf: .35, draw(c, u, t) {
  clip(.3, 2600); OC.set(t, { churn: .4 });
  OC.dRise(t, 1);
  const k = easeIO(u / (TL.I0 + .4 - TL.H0)), D = OC.D.group;
  const head = OC.D.head.getWorldPosition(V3()).toArray(), J = OC.D.K.getWorldPosition(V3()).toArray();
  const aim = at3(k, J, [head[0], (head[1] + J[1]) / 2, head[2]]);
  cam3({ pos: at3(k, [DP[0] + 24, 6, DP[2] + 9], [DP[0] + 26, 9, DP[2] + 11]), at: aim, fov: 38 });
  render3(c, OC.S, CAM3, { exposure: .95, fx: lens(dist(aim), 6) });
  capBand(c);
  title(c, 'AYURVEDA', 580, t, TL.AYURVEDA, { size: 100 });
  text(c, 'the science of life', 540, 670, 'italic 42px Marcellus', '#FFF3DC', { pop: t - TL.AYURVEDA - .3, glow: ['rgba(10,6,4,.95)', 16] });
  tag(c, 'BHAGAVATA PURANA 2.7.21', 470, 1462, t, TL.HEALTH + .2, { size: 24 });
} });

// ================= I · wealth came first, life was the prize: the lotus and Dhanvantari, the mountain between =================
SHOTS.push({ a: TL.I0, b: TL.J0 + .4, xf: .4, draw(c, u, t) {
  clip(1, 2600); OC.set(t, { churn: .3 });
  // the two set side by side for this picture: the lotus on the left, Dhanvantari on the right, the mountain between
  OC.D.group.position.x = 9; OC.D.group.position.z = 92; OC.D.group.rotation.y = .6; OC.dRise(t, 1);
  const L = OC.lotus; L.visible = true; L.position.set(-15, 0, 78); L.open(1); OC.lotusHalo.material.opacity = .6;
  const k = easeIO(u / (TL.J0 + .4 - TL.I0));
  cam3({ pos: at3(k, [4, 12, 158], [3, 13, 152]), at: [0, 9, 96], fov: 44 });
  render3(c, OC.S, CAM3, { exposure: .95, fx: lens(dist([0, 12, 20]), 2) });
  capBand(c);
  pinLabel(c, 'WEALTH', [-15, 6, 78], t, TL.WEALTH2, { up: 110, size: 46, col: '#FFC8D8', sub: 'came first' });
  pinLabel(c, 'LIFE', [9, 12.5, 92], t, TL.LIFE, { up: 120, size: 64, col: '#FFD27A', sub: 'was the prize' });
} });

// ================= J · and for this night, the Padma Purana gives one rule: the doorway at dusk =================
SHOTS.push({ a: TL.J0, b: TL.K0 + .4, xf: .5, draw(c, u, t) {
  clip(.05, 600); DR.set(t, { yama: 0 });
  const k = easeIO(u / (TL.K0 + .4 - TL.J0));
  cam3({ pos: at3(k, [.7, 1.2, 5.6], [.5, 1.0, 4.4]), at: [0, 1.0, 0], fov: 46 });
  render3(c, DR.S, CAM3, { exposure: 1.3, fx: lens(dist([0, 1, .5]), 6) });
  capBand(c);
  verse(c, [['“On the thirteenth day of the dark half', 'italic 38px Marcellus', '#FFF3DC'], ['of Kartika, a man should offer a light', 'italic 38px Marcellus', '#FFF3DC'],
    ['to Yama outside his house.”', 'italic 38px Marcellus', '#FFF3DC'], ['— Padma Purana, Uttara Khanda 122', '28px Marcellus', '#CFC2B0']], 520, t, TL.PADMA - .2, { dy: 52 });
} });

// ================= K · a lamp for Yama outside your door, so untimely death stays away =================
SHOTS.push({ a: TL.K0, b: TL.L0 + .4, xf: .35, draw(c, u, t) {
  clip(.02, 600);
  const lit = easeOut(seg(t, TL.LAMP - .1, TL.LAMP + .4));
  DR.set(t, { yama: lit, inside: .9 });
  const k = easeIO(u / (TL.L0 + .4 - TL.K0)), Y = [DR.YP[0] + .07, .06, DR.YP[2]];
  cam3({ pos: at3(k, [1.7, .78, 2.35], [1.38, .52, 1.9]), at: at3(k, [.6, .14, .7], [.66, .1, .8]), fov: 30 });
  render3(c, DR.S, CAM3, { exposure: 1.15, fx: lens(dist(Y), 10) });
  capBand(c);
  tag(c, 'PADMA PURANA · UTTARA KHANDA 122', 470, 1462, t, TL.LAMP + .2, { size: 24 });
} });

// ================= L · not one word about GOLD: the coin on the step, then back to the lamp =================
SHOTS.push({ a: TL.L0, b: TL.M0 + .4, xf: .3, draw(c, u, t) {
  clip(.01, 600); DR.set(t, { yama: 1, inside: .9 });
  const k = easeIO(u / (TL.M0 + .4 - TL.L0)), C = [DR.CP[0], .145, DR.CP[2]], Y = [DR.YP[0] + .07, .06, DR.YP[2]];
  cam3({ pos: at3(k, [.5, .32, .95], [.56, .36, 1.0]), at: at3(k, C, [.45, .1, .6]), fov: 32 });
  const f = lerp(dist(C), dist(Y), easeIO(seg(t, TL.GOLD + .5, TL.M0 + .2)));
  render3(c, DR.S, CAM3, { exposure: 1.15, fx: lens(f, 12) });
  capBand(c);
} });

// ================= M · screenshot this: the board =================
SHOTS.push({ a: TL.M0, b: TL.N0 + .4, xf: .4, draw(c, u, t) {
  clip(.05, 600); DR.set(t, { yama: 1, row: 0 });
  cam3({ pos: [.5, 1.0, 4.4], at: [0, 1.0, 0], fov: 46 });
  render3(c, DR.S, CAM3, { exposure: 1.1, fx: lens(dist([0, 1, .5]), 10) });
  c.fillStyle = `rgba(6,5,10,${.5 * seg(t, TL.SCREEN - .2, TL.SCREEN + .3)})`; c.fillRect(0, 0, W, H);
  board(c, t, TL.SCREEN - .25, { y0: 520 });
  const fl = seg(t, TL.SCREEN + .25, TL.SCREEN + .3) * (1 - seg(t, TL.SCREEN + .3, TL.SCREEN + .6));
  if (fl > 0) { c.fillStyle = `rgba(255,248,235,${.5 * fl})`; c.fillRect(0, 0, W, H); }
} });

// ================= N · the ask: GOLD or HEALTH? the coin and the jug side by side =================
SHOTS.push({ a: TL.N0, b: TL.O0 + .4, xf: .4, draw(c, u, t) {
  clip(.05, 80); ST.set(t);
  ST.coin.group.visible = true; coinPose(ST.coin, -.52, 0, .5 + .25 * Math.sin(t * .8), 0);
  const K = ST.K; K.visible = true; K.position.set(.55, 0, 0); K.set(t, .5 + .5 * seg(t, TL.HEALTH2 - .2, TL.HEALTH2 + .3));
  const k = easeIO(u / (TL.O0 + .4 - TL.N0));
  cam3({ pos: at3(k, [0, 1.0, 7.6], [0, 1.1, 7.0]), at: [0, .3, 0], fov: 30 });
  render3(c, ST.S, CAM3, { exposure: 1.05, fx: lens(dist([0, .5, 0]), 7) });
  capBand(c);
  pinLabel(c, 'GOLD', [-.52, 1.05, 0], t, TL.GOLD2, { up: 60, size: 58, col: '#FFE2A0' });
  pinLabel(c, 'HEALTH', [.55, 1.2, 0], t, TL.HEALTH2, { up: 60, size: 58, col: '#FFD27A' });
} });

// ================= O · next: the Diwali aarti; the lamps along the step light one by one =================
SHOTS.push({ a: TL.O0, b: TL.CARD, xf: .4, draw(c, u, t) {
  clip(.05, 600); DR.set(t, { yama: 1, row: (t - TL.O0) * 1.6 });
  const k = easeIO(u / (TL.CARD - TL.O0));
  cam3({ pos: at3(k, [.3, .8, 2.4], [.5, 1.3, 5.0]), at: at3(k, [0, .1, .4], [0, .55, 0]), fov: 44 });
  render3(c, DR.S, CAM3, { exposure: 1.15, fx: lens(dist([0, .4, .8]), 8) });
  capBand(c);
  seriesTag(c, 'NEXT', t, TL.NEXT, { w: 240, y: 520 });
  text(c, 'DIWALI AARTI', 540, 640, '700 76px Cinzel', '#FFE2A0', { pop: t - TL.AARTI, glow: ['rgba(10,6,4,.95)', 24], spacing: 3 });
  text(c, 'do it WITH the reel', 540, 720, 'italic 42px Marcellus', '#FFF3DC', { pop: t - TL.AARTI - .3, glow: ['rgba(10,6,4,.95)', 16] });
} });

// ================= the card =================
SHOTS.push({ a: TL.CARD, b: TL.END + 1, draw(c, u, t) {
  rkCardCine(c, u, t, { title: 'MEET OUR GODS', line: 'Picture books of our gods, for kids', price: 'The Navadurga Set is out now', note: 'Link in bio' });
} });
