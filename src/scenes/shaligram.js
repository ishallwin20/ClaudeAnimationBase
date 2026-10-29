// shaligram.js: "This stone is 150 MILLION years old" (ad 61), the 3D style in the film look. A polished black Shaligram
// with an ammonite's whorl on its face; the Purana's story (Devi Bhagavatam 9.24: Vishnu broke Tulsi's heart, she cursed
// him to become a stone, he accepted: she would become the river Gandaki and the tulsi plant, he a stone on her bank,
// where creatures with sharp teeth would carve his chakras); then science's (the stone split open on its spiral, an
// ammonite, a sea creature 150 million years ago in the age of the dinosaurs; India crashed into Asia, the sea floor rose
// into the Himalayas; today the fossils wash out of the Kali Gandaki); same river, same stone, same spiral; a puja
// worships a piece of the Himalaya with tulsi and river water (Gita 10.25: of what stands still, I am the Himalaya);
// nature itself is sacred; never without tulsi (DB 9.24); the ask; the card. STORYBOARD.md has the plan and the sources.
LOOK.bloom = .06; LOOK.vignette = .62; LOOK.grain = .07;
const ST = studio3(), AL = altar3();

// a camera on a sphere round `at`: dist, elevation, azimuth (radians)
const orbit = (d, el, az, at = [0, 0, 0], fov = 30, o = {}) => cam3({ pos: [at[0] + d * Math.cos(el) * Math.sin(az), at[1] + d * Math.sin(el), at[2] + d * Math.cos(el) * Math.cos(az)], at, fov, ...o });
const lerp3 = (a, b, k) => a.map((v, i) => lerp(v, b[i], k));
// frame3(c, r, az, el, ys, fov): a camera that fits a sphere (centre c, radius r) across the frame's width, seen from
// azimuth az / elevation el, with the centre at screen height ys (px); returns { cam, d } (d: the focus distance)
function frame3(cc, r, az, el, ys = 800, fov = 30, o = {}) {
  const tv = Math.tan(fov * Math.PI / 360), th = tv * W / H, d = r / th * (o.fill ?? 1.1);
  const dir = [Math.cos(el) * Math.sin(az), Math.sin(el), Math.cos(el) * Math.cos(az)], pos = cc.map((v, i) => v + dir[i] * d);
  const n = 1 - 2 * ys / H, up = [-Math.sin(el) * Math.sin(az), Math.cos(el), -Math.sin(el) * Math.cos(az)];
  const at = cc.map((v, i) => v - up[i] * n * d * tv);
  return { cam: cam3({ pos, at, fov, ...o }), d, pos, at };
}
// the film look per set
const FX = {
  gold: (focus, ap = 7) => ({ bloom: { k: .22, thresh: 1.1 }, dof: { focus, aperture: ap, max: 18 }, grade: { contrast: 1.06, sat: 1.06, temp: .12, shadows: '#2A1A30', highlights: '#FFC070', split: .1 }, ca: .0015 }),
  cold: (focus, ap = 7) => ({ bloom: { k: .2, thresh: 1.1 }, dof: { focus, aperture: ap, max: 18 }, grade: { contrast: 1.08, sat: .95, temp: -.25, shadows: '#10203A', highlights: '#DDEBFF', split: .1 }, ca: .0015 }),
  lamp: (focus, ap = 10) => ({ bloom: { k: .3, thresh: 1 }, dof: { focus, aperture: ap, max: 22 }, grade: { contrast: 1.05, sat: 1.1, temp: .25, shadows: '#2A1410', highlights: '#FFC080', split: .12 }, ca: .0015 }),
};
// the stone's pose on the cloth: face to the camera, tipped back a little, resting on its edge
const poseStone = (SG, o = {}) => { SG.group.position.set(0, o.y ?? -.02, 0); SG.group.rotation.set(o.rx ?? -.32, o.ry ?? 0, o.rz ?? 0); };

const CAPY = 1330;
POST.push((c, t) => { if (t < TL.CARD) band(c, 1180, 1470, .42); });
VO.caps.forEach((k, i) => say(i ? k.a : -1, k.b, k.text, { at: i ? k.at : k.at.map(() => -1), y: CAPY, ...(i ? {} : { size: 66 }) }));

// ================= A · the hook: the stone, 150 million years old =================
SHOTS.push({ a: 0, b: TL.B0 + .4, draw(c, u, t) {
  ST.look(0, t); ST.SG.set(t, { split: 0 }); poseStone(ST.SG, { ry: -.25 + t * .05 });
  const F = frame3([0, 0, 0], lerp(1.35, 1.2, easeOut(u / 3.8)), .12, .3, 820, 24);
  render3(c, ST.S, F.cam, { exposure: 1.05, fx: FX.gold(F.d, 9) });
} });

// ================= B · Hindus worship it as Vishnu himself: the altar =================
SHOTS.push({ a: TL.B0, b: TL.C0 + .4, xf: .4, draw(c, u, t) {
  AL.SG.group.rotation.set(-.9, .2, 0); AL.SG.set(t, { split: 0 }); AL.set(t, { leaves: 3 });
  const k = easeIO(u / 3.9);
  const d = lerp(19, 16, k), cam = orbit(d, lerp(.36, .28, k), lerp(-.3, .08, k), [0, -1.6, -.5], 26);
  render3(c, AL.S, cam, { exposure: 1, fx: FX.lamp(d, 12) });
  const g = seg(t, TL.VISHNU - .3, TL.VISHNU + .6) * (1 - seg(t, TL.C0, TL.C0 + .4));
  if (g > 0) { const [x, y] = toScreen3([0, .4, 0]); glow(c, x, y, 420, '#FFC060', .35 * g); }
} });

// ================= C · it's a Shaligram; the Purana tells its story, so does science =================
SHOTS.push({ a: TL.C0, b: TL.D0 + .4, xf: .35, draw(c, u, t) {
  const sci = easeIO(seg(t, TL.SCIENCE - .35, TL.SCIENCE + .35));
  ST.look(sci, t); ST.SG.set(t, { split: 0 }); poseStone(ST.SG, { ry: .5 - u * .22 });
  const F = frame3([0, 0, 0], 1.35, -.3 + u * .06, .24, 980, 24);
  render3(c, ST.S, F.cam, { exposure: 1.05, fx: sci < .5 ? FX.gold(F.d, 9) : FX.cold(F.d, 9) });
  const a = seg(t, TL.SHALIGRAM - .2, TL.SHALIGRAM + .2) * (1 - seg(t, TL.D0, TL.D0 + .35));
  if (a > 0) {
    text(c, 'शालग्राम', 540, 470, '96px "Tiro Devanagari Sanskrit"', '#FFE2A0', { alpha: a, glow: ['rgba(255,170,60,.8)', 26], pop: t - TL.SHALIGRAM + .2 });
    text(c, 'SHALIGRAM', 540, 565, '700 64px Cinzel', '#F4C46A', { alpha: a, spacing: 8, glow: ['rgba(10,6,4,.9)', 16] });
  }
} });


// ================= D · Vishnu broke the heart of his devotee Tulsi; she cursed him: become a stone! =================
const SGE = stage3();
const FXS = (focus, ap = 8) => ({ bloom: { k: .4, thresh: .8 }, dof: { focus, aperture: ap, max: 20 }, grade: { contrast: 1.08, sat: 1.05, temp: 0, shadows: '#0A0C1A', highlights: '#FFE4B8', split: .1 }, ca: .0018 });
const LEAF_TIP = [-1.2, .1, -.25];   // where the tear hangs (a leaf tip of the sprig, found by eye)
SHOTS.push({ a: TL.D0, b: TL.E0 + .4, xf: .45, draw(c, u, t) {
  const curse = seg(t, TL.STONE1 - .15, TL.STONE1 + .25), fall = easeIn(seg(t, TL.STONE2 - .05, TL.STONE2 + .3)), land = TL.STONE2 + .3;
  const tearF = seg(t, TL.TULSI1 - .1, TL.TULSI1 + .5);
  const vAt = lerp3([1.0, 1.4, .5], [.9, -.08, .5], fall);
  SGE.set(t, { sprig: 1, tulsiL: .7 + .5 * curse * (1 - seg(t, land, land + 1)), vishL: .25 * (1 - fall), tulsi: .3 + .6 * curse * (1 - seg(t, land, land + .8)), tulsiAt: [-1.45, .95, -.7],
    vish: (t < land ? 1 : 0) * (1 - .3 * curse), vishAt: vAt, drop: tearF < 1 ? [LEAF_TIP[0], LEAF_TIP[1] - easeIn(tearF) * .9, LEAF_TIP[2]] : null });
  const st = seg(t, land - .05, land + .2);
  SGE.SG.group.visible = t > land - .05; SGE.SG.group.scale.setScalar(.7 + .3 * easeOut(st)); SGE.SG.set(t, { split: 0, heat: 1 - easeOut(seg(t, land, land + 1.6)), gold: .5 });
  const two = easeIO(seg(t, TL.CURSED - .6, TL.CURSED + .6)), shake = t > land ? Math.exp(-(t - land) * 7) * .05 : 0;
  const F = frame3(lerp3([-1.5, .15, -.6], [-.25, .3, -.1], two), lerp(1.2, 2.3, two), lerp(-.25, -.05, two), lerp(.1, .16, two), 800, 30);
  F.cam.position.x += shake * Math.sin(t * 80); F.cam.position.y += shake * Math.cos(t * 70);
  render3(c, SGE.S, F.cam, { exposure: 1.1, fx: FXS(F.d, lerp(9, 7, two)) });
  if (curse > 0) glow(c, ...toScreen3([-1.45, .95, -.7]).slice(0, 2), 600, '#C8FFE0', .22 * curse * (1 - seg(t, TL.STONE2, TL.STONE2 + .6)));
  const fl = seg(t, land - .05, land + .05) * (1 - seg(t, land + .05, land + .4));
  if (fl > 0) glow(c, ...toScreen3([.9, 0, .5]).slice(0, 2), 900, '#FFD080', .5 * fl);
} });

// ================= E · Vishnu accepted: the river Gandaki, the tulsi plant, a stone on your bank =================
SHOTS.push({ a: TL.E0, b: TL.F0 + .4, xf: .4, draw(c, u, t) {
  const toRiver = easeIn(seg(t, TL.RIVER1 - .7, TL.RIVER1)), grow = easeOut(seg(t, TL.TULSI2 - .3, TL.PLANT + 1.2));
  SGE.set(t, { sprig: 1 - grow, bush: grow, tulsiL: .7 * (1 - .4 * grow) + .3 * grow, vishL: .5 * seg(t, TL.STONE3 - .4, TL.BANK), tulsi: .5 * (1 - toRiver), tulsiAt: lerp3([-1.45, .95, -.7], [-1.4, -.7, -.4], toRiver),
    river: .7 * seg(t, TL.RIVER1 - .15, TL.RIVER1 + .2), front: easeOut(seg(t, TL.RIVER1 - .15, TL.GANDAKI1 + 1.6)) * 1.05 });
  SGE.SG.group.visible = true; SGE.SG.group.scale.setScalar(1); SGE.SG.set(t, { split: 0, heat: .15 * (1 - seg(t, TL.E0, TL.E0 + 1)), gold: .5 + .5 * seg(t, TL.STONE3 - .3, TL.BANK) });
  const k = easeIO(seg(t, TL.E0, TL.F0 + .4));
  const F = frame3(lerp3([-.25, .3, -.1], [-.4, .3, -1], k), lerp(2.3, 3.6, k), lerp(-.05, .12, k), lerp(.16, .42, k), 800, 30);
  render3(c, SGE.S, F.cam, { exposure: 1.05, fx: FXS(F.d, 5) });
  const g = seg(t, TL.TULSI2 - .2, TL.PLANT + .4) * (1 - seg(t, TL.PLANT + .4, TL.PLANT + 1.6));
  if (g > 0) glow(c, ...toScreen3([-1.9, 2.2, -1.5]).slice(0, 2), 380, '#C8FFB0', .3 * g);
} });

// ================= F · tiny creatures with sharp teeth will carve my chakras in them =================
SHOTS.push({ a: TL.F0, b: TL.G0 + .4, xf: .4, draw(c, u, t) {
  SGE.set(t, { bush: 1, tulsiL: .2, vishL: .6, river: .22, front: 1.05 });
  const cv = lerp(.02, 1.06, easeIO(seg(t, TL.TINY - .1, TL.CHAKRAS + .5)));
  SGE.SG.set(t, { split: 0, carve: cv, front: 1 - seg(t, TL.CHAKRAS + .4, TL.G0 + .3), gold: 1 });
  const k = easeIO(u / 4.4);
  const F = frame3([.9, 0, .5], lerp(1.15, 1.3, k), lerp(-.5, -.3, k), lerp(.42, .36, k), 800, 28);
  render3(c, SGE.S, F.cam, { exposure: 1.05, fx: FXS(F.d, 10) });
} });

// ================= G · now look inside one: a spiral (science's cold light; the stone splits) =================
SHOTS.push({ a: TL.G0, b: TL.H0 + .4, xf: .3, draw(c, u, t) {
  ST.look(1, t); poseStone(ST.SG, { ry: 0, rx: -.2 });
  const sp = easeIO(seg(t, TL.INSIDE - .2, TL.SPIRAL1 + .2));
  ST.SG.set(t, { split: sp, gold: 1 });
  const k = easeOut(u / 2.3), cam = orbit(lerp(10.4, 6.6, k), .2, .05, [0, lerp(-.25, -.05, k), 0], 26);
  render3(c, ST.S, cam, { exposure: 1.1, fx: FX.cold(lerp(10.3, 6.5, k), 8) });
  const fl = seg(t, TL.INSIDE - .2, TL.INSIDE) * (1 - seg(t, TL.INSIDE, TL.INSIDE + .4));
  if (fl > 0) glow(c, 540, 820, 600, '#DDEBFF', .4 * fl);
} });

// ================= H · it's an ammonite, a sea creature turned to stone =================
const SEA = sea3(), SHORE = shore3();
const FXW = (focus, ap = 8) => ({ bloom: { k: .3, thresh: .9 }, rays: { at: [0, 40, -10], k: .7, thresh: .4, col: '#BFF0FF' }, dof: { focus, aperture: ap, max: 18 }, grade: { contrast: 1.05, sat: 1.12, temp: -.15, shadows: '#02182A', highlights: '#E0FFFF', split: .08 }, ca: .002 });
SHOTS.push({ a: TL.H0, b: TL.I0 + .4, xf: .5, draw(c, u, t) {
  CAM3.far = 600;
  SEA.set(t, { stone: easeIO(seg(t, TL.STONE4 - .5, TL.STONE4 + .6)) });
  const hp = SEA.AMS[0].path(t), k = easeIO(u / 3.4);
  const cam = cam3({ pos: [hp[0] + lerp(.3, .1, k), hp[1] + .15, hp[2] + lerp(1.5, 1.9, k)], at: [hp[0], hp[1] - .05, hp[2]], fov: 34 });
  render3(c, SEA.S, cam, { exposure: 1.1, fx: FXW(lerp(1.5, 1.9, k), 12) });
} });

// ================= I · it swam in a sea 150 million years ago, with the dinosaurs =================
const UP = () => TL.AGO + .15;   // the camera breaks the surface
SHOTS.push({ a: TL.I0, b: TL.J0 + .4, xf: .4, draw(c, u, t) {
  CAM3.far = 600; SEA.set(t, {});
  const rise = easeIn(seg(t, TL.I0 + .6, UP())), k = easeIO(u / 4);
  const pos = [lerp(-1.5, -.5, k), lerp(2.4, 11.9, rise), lerp(5, 3, k)], at = [lerp(0, .5, k), lerp(2.2, 13, rise), -8];
  if (t < UP()) {
    render3(c, SEA.S, cam3({ pos, at, fov: 44 }), { exposure: 1.1, fx: FXW(lerp(7, 9, k), 7) });
  } else {
    // over-under: the camera at the waterline; the shore above, the sea below, a wavy line between
    const w = seg(t, UP(), UP() + .5), yl = lerp(H * .6, H * .46, easeOut(w));
    const up = scratch('sg_up'), dn = scratch('sg_dn');
    CAM3.far = 3000; SHORE.set(t);
    render3(up, SHORE.S, cam3({ pos: [0, .8, 20], at: [14, 14, -160], fov: 46 }), { exposure: 1, fx: { bloom: { k: .35, thresh: .9 }, rays: { at: [-200, 60, -400], k: .5, thresh: .7, col: '#FFC890' }, grade: { contrast: 1.06, sat: 1.1, temp: .3, highlights: '#FFC890', split: .1 } } });
    CAM3.far = 600;
    render3(dn, SEA.S, cam3({ pos: [-.5, 10.6, 3], at: [.5, 8.5, -8], fov: 50 }), { exposure: 1.1, fx: FXW(8, 6) });
    c.drawImage(dn.canvas, 0, 0);
    c.save(); c.beginPath(); c.moveTo(0, 0); c.lineTo(W, 0);
    for (let x = W; x >= 0; x -= 20) c.lineTo(x, yl + 10 * Math.sin(x * .012 + t * 3) + 5 * Math.sin(x * .031 - t * 4));
    c.closePath(); c.clip(); c.drawImage(up.canvas, 0, 0); c.restore();
    c.save(); c.strokeStyle = 'rgba(230,250,255,.7)'; c.lineWidth = 4; c.shadowColor = 'rgba(200,240,255,.9)'; c.shadowBlur = 12; c.beginPath();
    for (let x = 0; x <= W; x += 20) { const y = yl + 10 * Math.sin(x * .012 + t * 3) + 5 * Math.sin(x * .031 - t * 4); x ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); c.restore();
    const fl = 1 - seg(t, UP(), UP() + .3); if (fl > 0) glow(c, 540, yl, 900, '#E0FBFF', .5 * fl);
  }
  const a = seg(t, TL.I0 + .2, TL.I0 + .7) * (1 - seg(t, UP() - .3, UP()));
  if (a > 0) { band(c, 410, 580, .35 * a); text(c, 'THE TETHYS SEA', 540, 470, '700 46px Cinzel', '#DDF6FF', { alpha: a, spacing: 6, glow: ['rgba(2,20,30,.9)', 16] }); text(c, '150 million years ago', 540, 530, '36px Marcellus', '#BFE8F8', { alpha: a * .9, glow: ['rgba(2,20,30,.9)', 14] }); }
} });

// ================= J · then India crashed into Asia; the sea floor rose and became the Himalayas =================
const STRATA = strata3();
SHOTS.push({ a: TL.J0, b: TL.K0 + .4, xf: .4, draw(c, u, t) {
  CAM3.far = 600;
  const k = .5 * easeIn(seg(t, TL.INDIA - .3, TL.CRASHED + .1)) + .5 * easeIO(seg(t, TL.ROSE - .4, TL.HIMALAYAS1 + .2));
  STRATA.set(t, k, { snow: seg(t, TL.HIMALAYAS1 - .3, TL.HIMALAYAS1 + .6) });
  const hit = TL.CRASHED + .1, shake = t > hit ? Math.exp(-(t - hit) * 6) * .12 : 0, kk = easeIO(u / 5);
  const cam = cam3({ pos: [lerp(6, -4, kk) + shake * Math.sin(t * 70), lerp(13, 15, kk) + shake * Math.cos(t * 60), lerp(62, 52, kk)], at: [-.3, lerp(-4, -1.2, kk), 0], fov: 32 });
  render3(c, STRATA.S, cam, { exposure: 1.05, fx: { bloom: { k: .3, thresh: 1 }, dof: { focus: lerp(62, 52, kk), aperture: 3, max: 8 }, grade: { contrast: 1.06, sat: 1.05, temp: .05 } } });
  // the labels: ASIA (left), INDIA with its arrow (right), riding the plates
  const la = seg(t, TL.J0, TL.J0 + .4);
  const [ax, ay] = toScreen3(STRATA.def(-7.2, 0, 3.5, k)), [ix, iy] = toScreen3(STRATA.def(7.2, 0, 3.5, k));
  text(c, 'ASIA', ax, ay - 70, '700 44px Cinzel', '#DDE8D0', { alpha: la, spacing: 6, glow: ['rgba(6,8,10,.9)', 16] });
  text(c, 'INDIA', ix, iy - 70, '700 44px Cinzel', '#FFD7A8', { alpha: la, spacing: 6, glow: ['rgba(6,8,10,.9)', 16] });
  if (k < .5) text(c, '←', ix, iy - 130, '700 64px Cinzel', '#FFD7A8', { alpha: la * (1 - seg(k, .4, .5)) });
  const [sx, sy] = toScreen3(STRATA.def(0, .8, 3.5, k)); text(c, 'TETHYS SEA', sx, sy - 40, '700 32px Cinzel', '#BFE8FF', { alpha: la * (1 - seg(t, TL.CRASHED - .2, TL.CRASHED + .3)), spacing: 4, glow: ['rgba(6,8,10,.9)', 14] });
  const hl = seg(t, TL.HIMALAYAS1 - .2, TL.HIMALAYAS1 + .3); if (hl > 0) { const [hx, hy] = toScreen3([-.4, 9.5, 0]); text(c, 'HIMALAYAS', hx, Math.max(470, hy - 30), '700 50px Cinzel', '#FFFFFF', { alpha: hl, spacing: 8, glow: ['rgba(6,8,10,.9)', 18], pop: t - TL.HIMALAYAS1 + .2 }); }
  const fl = seg(t, hit - .05, hit) * (1 - seg(t, hit, hit + .4)); if (fl > 0) glow(c, ...toScreen3(STRATA.def(-3.6, 0, 3.5, k)).slice(0, 2), 700, '#FFE0B0', .5 * fl);
} });

// ================= K · today these fossils wash out of one river: the Gandaki =================
const I3 = india3({ bbox: [68, 17, 99, 38] }), RB = riverbed3(), HIM = himalaya3();
const GLINE = line3(I3.scene, GANDAKI_LL.map(([lo, la]) => I3.at(lo, la, .25)), { col: '#8FE8FF', add: true, core: .8 });
const MUKTI = pillar3(I3.scene, I3.at(83.87, 28.82), { h: 16, r: .5, col: '#FFD27A' });
SHOTS.push({ a: TL.K0, b: TL.GANDAKI2 - .1, xf: .45, draw(c, u, t) {
  CAM3.near = 2; CAM3.far = 12000;
  const p = I3.at(84.2, 27.6), ex = I3.mood('day', { at: p, shadow: 200, sunAt: [-.5, .55, .6], fogNear: 300, fogFar: 1600 }); I3.set(t, { clouds: .25 }); I3.far.visible = false;
  const k = easeIO(seg(t, TL.K0, TL.GANDAKI2));
  GLINE.set(easeIO(seg(t, TL.FOSSILS - .2, TL.GANDAKI2 - .2)), lerp(2.6, 1.8, k), 1); MUKTI.set(t, seg(t, TL.FOSSILS, TL.FOSSILS + .6));
  const cam = cam3({ pos: [p[0] + lerp(-20, -8, k), lerp(110, 72, k), p[2] + lerp(160, 100, k)], at: [p[0] - 6, 0, p[2] - lerp(12, 22, k)], fov: 44 });
  render3(c, I3.scene, cam, { exposure: ex, fx: { bloom: { k: .25, thresh: 1 }, grade: { contrast: 1.06, sat: 1.1, temp: .03 }, ca: .001 } });
  const la = seg(t, TL.K0 + .2, TL.K0 + .6);
  pin3(c, 'HIMALAYAS', I3.at(84.6, 28.9, 6), t, TL.K0 + .2, { size: 40, col: '#FFFFFF', dy: -20, alpha: la, spacing: 6 });
  pin3(c, 'NEPAL', I3.at(84.9, 28.0, 2), t, TL.K0 + .4, { size: 32, col: '#E8E0D0', alpha: la * .9, spacing: 5 });
  pin3(c, 'INDIA', I3.at(84.6, 26.3, 2), t, TL.K0 + .5, { size: 32, col: '#E8E0D0', alpha: la * .9, spacing: 5 });
  pin3(c, 'Muktinath', I3.at(83.87, 28.82, 4), t, TL.FOSSILS + .3, { font: '30px Marcellus', col: '#FFE2A0', dx: 90, dy: -16, alpha: seg(t, TL.FOSSILS + .3, TL.FOSSILS + .7) });
  pin3(c, 'GANDAKI', I3.at(83.6, 28.1, 3), t, TL.GANDAKI2 - .6, { size: 44, col: '#BFF4FF', dx: -120, spacing: 4 });
  CAM3.near = .05;
} });
// down onto the riverbed: the pebbles, the stone among them
SHOTS.push({ a: TL.GANDAKI2 - .5, b: TL.L0 + .4, xf: .4, draw(c, u, t) {
  CAM3.near = .01; CAM3.far = 12000; RB.mood('day', t); RB.SG.set(t, { split: 0, gold: .7 }); RB.leaf.visible = false;
  const k = easeOut(seg(t, TL.GANDAKI2 - .5, TL.L0 + .4));
  const cam = cam3({ pos: [lerp(.5, .12, k), lerp(1.6, .16, k), lerp(1.8, .34, k)], at: [0, .025, 0], fov: 34 });
  render3(c, RB.S, cam, { exposure: 1, fx: { bloom: { k: .25, thresh: 1 }, dof: { focus: lerp(2.4, .36, k), aperture: 16, max: 14 }, grade: { contrast: 1.07, sat: 1.08, temp: .05 }, ca: .0012 } });
  CAM3.near = .05;
} });

// ================= L · same river, same stone, same spiral: the Purana (left, gold) and science (right, cold) =================
// each beat a split frame: the stage's river of light | the Gandaki on the map; the stone born of light | the stone on the
// riverbed; the carved gold spiral | the fossil's cut face
function halves(c, t, L, R, a) {
  const l = scratch('sg_l'), r = scratch('sg_r');
  L(l); R(r);
  c.save(); c.beginPath(); c.rect(0, 0, W / 2, H); c.clip(); c.drawImage(l.canvas, -W / 4, 0); c.restore();
  c.save(); c.beginPath(); c.rect(W / 2, 0, W / 2, H); c.clip(); c.drawImage(r.canvas, W / 4, 0); c.restore();
  c.save(); c.fillStyle = '#F4C46A'; c.shadowColor = 'rgba(255,190,80,.9)'; c.shadowBlur = 14; c.fillRect(W / 2 - 2, 0, 4, H); c.restore();
  band(c, 400, 560, .45 * a);
  text(c, 'PURANA', W / 4, 480, '700 40px Cinzel', '#FFD27A', { alpha: a, spacing: 6, glow: ['rgba(6,4,6,.9)', 14] });
  text(c, 'SCIENCE', W * .75, 480, '700 40px Cinzel', '#CFE6FF', { alpha: a, spacing: 6, glow: ['rgba(6,4,6,.9)', 14] });
}
const beatOf = (t) => t < TL.SAME_S - .25 ? 0 : t < TL.SAME_P - .25 ? 1 : 2;
SHOTS.push({ a: TL.L0, b: TL.M0 + .4, xf: .3, draw(c, u, t) {
  const b = beatOf(t), a = seg(t, TL.L0, TL.L0 + .3);
  halves(c, t, (l) => {
    if (b === 0) { SGE.set(t, { bush: 1, tulsiL: .5, vishL: .6, river: .8, front: 1.05 }); SGE.SG.set(t, { split: 0, gold: 1 });
      render3(l, SGE.S, cam3({ pos: [.6, 3.4, 8], at: [.4, -.8, -2], fov: 38 }), { exposure: 1.05, fx: FXS(8.5, 4) }); }
    else if (b === 1) { SGE.set(t, { bush: 1, tulsiL: .4, vishL: 1, river: .5, front: 1.05 }); SGE.SG.set(t, { split: 0, gold: 1, heat: .05 });
      render3(l, SGE.S, orbit(7.5, .3, -.3 + (t - TL.SAME_S) * .1, [.9, -.3, .5], 30), { exposure: 1.05, fx: FXS(7.4, 8) }); }
    else { SGE.set(t, { bush: 1, tulsiL: .2, vishL: .8, river: .25, front: 1.05 }); SGE.SG.set(t, { split: 0, gold: 1, carve: 2, front: 0 });
      render3(l, SGE.S, orbit(5.2, .42, -.5, [.9, -.3, .5], 26), { exposure: 1.1, fx: FXS(5.1, 9) }); }
  }, (r) => {
    if (b === 0) { CAM3.near = 2; CAM3.far = 12000; const p = I3.at(84.0, 28.0), ex = I3.mood('day', { at: p, shadow: 200, sunAt: [-.5, .55, .6], fogNear: 300, fogFar: 1600 }); I3.far.visible = false; GLINE.set(1, 1.6, 1); MUKTI.set(t, 1);
      render3(r, I3.scene, cam3({ pos: [p[0] - 4, 60, p[2] + 70], at: [p[0] - 2, 0, p[2] - 8], fov: 44 }), { exposure: ex, fx: { bloom: { k: .25, thresh: 1 }, grade: { contrast: 1.06, sat: 1.1 } } }); CAM3.near = .05; }
    else if (b === 1) { CAM3.near = .01; CAM3.far = 12000; RB.mood('day', t); RB.SG.set(t, { split: 0, gold: .7 }); RB.leaf.visible = false;
      render3(r, RB.S, cam3({ pos: [.1, .14, .3], at: [0, .025, 0], fov: 34 }), { exposure: 1, fx: { bloom: { k: .25, thresh: 1 }, dof: { focus: .32, aperture: 16, max: 14 }, grade: { contrast: 1.07, sat: 1.08 } } }); CAM3.near = .05; }
    else { ST.look(1, t); poseStone(ST.SG, { ry: 0, rx: -.2 }); ST.SG.set(t, { split: 1, gold: 1 });
      render3(r, ST.S, orbit(5.2, .2, .05, [0, -.05, 0], 26), { exposure: 1.1, fx: FX.cold(5.1, 8) }); }
  }, a);
  const k = [TL.SAME_R, TL.SAME_S, TL.SAME_P][b], fl = seg(t, k - .3, k - .2) * (1 - seg(t, k - .2, k + .1));
  if (fl > 0) glow(c, 540, 900, 700, '#FFF0D0', .35 * fl);
} });

// ================= M · so in a Shaligram puja you worship a piece of the Himalayas, with tulsi and river water =================
SHOTS.push({ a: TL.M0, b: TL.N0 + .4, xf: .4, draw(c, u, t) {
  AL.SG.group.rotation.set(-.9, .2, 0); AL.SG.set(t, { split: 0, gold: .8 });
  const lv = t < TL.TULSI3 - .4 ? 0 : 3, fall = seg(t, TL.TULSI3 - .45, TL.TULSI3 + .5);
  const pour = seg(t, TL.RIVERW - .5, TL.RIVERW - .1);
  AL.set(t, { leaves: lv && fall >= 1 ? 3 : 0, fall: fall > 0 && fall < 1 ? fall : -1, lota: easeIO(seg(t, TL.RIVERW - 1.1, TL.RIVERW - .4)), pour: pour, wet: seg(t, TL.RIVERW, TL.N0) });
  const k = easeIO(u / 5.6), d = lerp(16, 12, k);
  const cam = orbit(d, lerp(.32, .26, k), lerp(.25, -.15, k), [0, lerp(-1.5, -.9, k), -.4], 26);
  render3(c, AL.S, cam, { exposure: 1, fx: FX.lamp(d, 12) });
  const g = seg(t, TL.HIMALAYAS2 - .3, TL.HIMALAYAS2 + .3) * (1 - seg(t, TL.HIMALAYAS2 + .5, TL.HIMALAYAS2 + 1.2));
  if (g > 0) { const [x, y] = toScreen3([0, .4, 0]); glow(c, x, y, 380, '#FFE6B0', .3 * g); }
} });

// ================= N · Krishna says in the Gita: of all that stands still, I am the Himalaya =================
SHOTS.push({ a: TL.N0, b: TL.O0 + .4, xf: .5, draw(c, u, t) {
  CAM3.near = 5; CAM3.far = 60000;
  const k = easeIO(u / 4.8);
  const cam = cam3({ pos: [lerp(-900, 700, k), lerp(2300, 2600, k), 2000], at: [lerp(-500, 300, k), lerp(3600, 3400, k), -24000], fov: 38 });
  render3(c, HIM.S, cam, { exposure: 1.05, fx: { bloom: { k: .4, thresh: .85 }, rays: { at: [-80000, 16000, 30000], k: .4, thresh: .7, col: '#FFB070' }, grade: { contrast: 1.1, sat: 1.12, temp: .25, highlights: '#FFC090', shadows: '#2A2040', split: .12 }, ca: .001 } });
  CAM3.near = .05;
  const a = seg(t, TL.STILL - .3, TL.STILL + .2) * (1 - seg(t, TL.O0, TL.O0 + .4));
  if (a > 0) {
    band(c, 410, 700, .5 * a);
    text(c, 'स्थावराणां हिमालयः', 540, 525, '92px "Tiro Devanagari Sanskrit"', '#FFE2A0', { alpha: a, glow: ['rgba(255,170,60,.8)', 26], pop: t - TL.STILL + .3 });
    text(c, 'Bhagavad Gita 10.25', 540, 630, '36px Marcellus', '#F4D9A8', { alpha: a * .9, glow: ['rgba(10,6,4,.9)', 14] });
  }
} });

// ================= O · in Sanatan Dharma, nature itself is sacred: the riverbed at golden hour, a tulsi leaf drifting =================
SHOTS.push({ a: TL.O0, b: TL.P0 + .4, xf: .5, draw(c, u, t) {
  CAM3.near = .01; CAM3.far = 12000; RB.mood('golden', t); RB.SG.set(t, { split: 0, gold: .9 });
  const k = easeIO(u / 3.6), lf = seg(t, TL.O0, TL.P0 + .4);
  RB.leaf.visible = true; RB.leaf.scale.setScalar(.045); RB.leaf.position.set(lerp(-.16, .1, lf), .037, lerp(.07, .09, lf) + .01 * Math.sin(t * 2)); RB.leaf.rotation.order = 'YXZ'; RB.leaf.rotation.set(-Math.PI / 2, .6 + t * .15, 0);
  const cam = cam3({ pos: [lerp(-.25, -.12, k), lerp(.09, .12, k), lerp(.36, .3, k)], at: [0, .025, -.01], fov: 34 });
  render3(c, RB.S, cam, { exposure: 1.02, fx: { bloom: { k: .3, thresh: .9 }, dof: { focus: .33, aperture: 18, max: 16 }, grade: { contrast: 1.07, sat: 1.12, temp: .3, highlights: '#FFC890', split: .1 }, ca: .0012 } });
  CAM3.near = .05;
} });

// ================= P · that's why a Shaligram is never worshipped without tulsi =================
SHOTS.push({ a: TL.P0, b: TL.Q0 + .4, xf: .45, draw(c, u, t) {
  AL.SG.group.rotation.set(-.9, .2, 0); AL.SG.set(t, { split: 0, gold: .8 });
  const fall = seg(t, TL.TULSI4 - .7, TL.TULSI4 + .3);
  AL.set(t, { leaves: 2, fall: fall > 0 ? Math.min(fall, 1) : -1, wet: 1 });
  const k = easeIO(u / 3.8), d = lerp(13, 11, k);
  render3(c, AL.S, orbit(d, lerp(.46, .4, k), .1, [0, -.5, 0], 26), { exposure: 1, fx: FX.lamp(d, 14) });
} });

// ================= Q · did you know it was a fossil? comment yes or no =================
SHOTS.push({ a: TL.Q0, b: TL.CARD + .2, xf: .45, draw(c, u, t) {
  ST.look(0, t); ST.SG.set(t, { split: 0, gold: 1 }); poseStone(ST.SG, { ry: -.4 + u * .12 });
  const F = frame3([0, 0, 0], lerp(1.35, 1.22, easeOut(u / 4.5)), .12, .3, 820, 24);
  render3(c, ST.S, F.cam, { exposure: 1.05, fx: FX.gold(F.d, 9) });
} });

// ================= R · the card =================
SHOTS.push({ a: TL.CARD, b: TL.END + 1, draw(c, u, t) {
  rkCardCine(c, u, t, { title: 'MEET OUR GODS', line: 'Picture books of our gods, for kids', price: 'Books 1–3 · set of 3 for ₹500' });
} });
