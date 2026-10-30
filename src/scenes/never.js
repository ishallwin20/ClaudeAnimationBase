// never.js: "NEVER offer THIS flower to SHIVA" (ad 66), in the 3D style. The ketaki on black: it once told a lie. The
// Shiva Purana's story (Vidyeshvara 7–8): Brahma and Vishnu fight, a pillar of fire with no end rises between them,
// Vishnu dives for its root, Brahma flies for its top; a ketaki falls from Shiva's head, Brahma begs it to say he saw
// the top, it lies, and Shiva will have it no more in his worship. The same Purana bars the champa too (Rudra Samhita
// 1.14.36), but LISTS tulsi for Shiva (1.14.28): joy in this life and moksha. The god who refuses tulsi is Ganesha
// (Brahma Vaivarta, Ganapati Khanda: their curses), and Vishnu loves the two flowers Shiva refuses (the Narasimha
// Purana in the Hari Bhakti Vilasa 7). The screenshot board, the ask (did you know?), next: Rudrabhishek, the card.
// STORYBOARD.md has the plan and the sources; the timeline (from the voice) is never_tl.js, the flowers, the void,
// the courtyard, the marks and the board never_props.js.
const STU = studio3(), VD = void3();
const W3 = world3(), SC = W3.scene, CEN = shrine3(SC, { court: false }), CT = court5(SC);
GODS.forEach(g => {
  const grp = new THREE.Group(); grp.position.set(g.at[0], 0, g.at[1]); grp.scale.setScalar(SK); SC.add(grp);
  g.T = shrine3(grp, { court: false, soma: false, linga: false, lights: false });
});
const god = id => GODS.find(g => g.id === id);
// the flowers in the courtyard: a sprig over the linga (offered), and big ones floating by the corner shrines
const OFF = new THREE.Group(); SC.add(OFF); const TUL = tulsi3(OFF, { k: 2.9, em: .25 });
const LTOP = [0, CEN.F + .34 + .74, 0];   // the linga's crown (its pot hangs .54 m above)
// the linga's black stone a little less polished (owner, 30 Oct: nothing shiny)
CEN.linga.traverse(m => { if (m.material && m.material.color && m.material.color.getHex() === 0x1A1819) m.material.roughness = .42; });
const BIG = { tulsi: tulsi3(SC, { k: 8.5, em: .3 }), ketaki: ketaki3(SC, { k: 3.6, em: .3 }), champa: champa3(SC, { k: 13, em: .3 }) };
// a soft fill on each floating flower from the camera's side (the dusk sun is behind them)
const FILL = [0, 1].map(() => { const l = new THREE.PointLight('#FFE6C8', 0, 6, 2); SC.add(l); return l; });
const fillAt = (i, sx, sy, d) => { FILL[i].position.copy(screenAt(sx, sy, d)); FILL[i].intensity = 14; };
// a world point d metres from the camera, on screen at (sx, sy): to float a flower where the frame needs it
const screenAt = (sx, sy, d) => (CAM3.updateMatrixWorld(), new THREE.Vector3(sx / W * 2 - 1, 1 - sy / H * 2, .5).unproject(CAM3).sub(CAM3.position).normalize().multiplyScalar(d).add(CAM3.position));
const hideBig = () => { for (const k in BIG) BIG[k].visible = false; FILL.forEach(l => { l.intensity = 0; }); };
const lit = (t, w = 0) => { CEN.set(t, { lamps: 1, water: w }); GODS.forEach(g => g.T.set(t, { lamps: 1 })); CT.set(t); };
// the sprig over the linga: k 0 hovering above it, 1 resting on it
const tulsiOn = (t, k) => { OFF.visible = true; OFF.position.set(LTOP[0] + .15 * (1 - k), LTOP[1] + lerp(.12, -.03, easeIO(k)) + (1 - k) * .03 * Math.sin(t * 2), LTOP[2]); OFF.rotation.set(0, t * .4 * (1 - k) + .6, k * 1.2); };

const CAPY = 1290;
VO.caps.forEach((k, i) => say(i ? k.a : -1, k.b, k.text, { at: i ? k.at : k.at.map(() => -1), y: k.id === 'save' ? 1430 : k.id === 'hook' || k.id === 'lie' ? 1360 : CAPY }));

// cameras: the studio (around the origin), a corner shrine from the courtyard side (as ad 50), the sanctum door
const stuCam = (a, R, h, at = [0, .17, 0], fov = 34) => cam3({ pos: [Math.sin(a) * R, h, Math.cos(a) * R], at, fov });
const orbit = (g, k, R, h, a0, a1, o = {}) => { const a = lerp(a0, a1, k), [cx, cz] = g.at; return cam3({ pos: [cx + Math.cos(a) * R, h, cz + Math.sin(a) * R], at: [cx, o.atY ?? 5, cz], fov: o.fov ?? 54 }); };
const doorCam = (k, o = {}) => cam3({ pos: [lerp(o.x0 ?? 4.4, o.x1 ?? 3.3, k), lerp(o.y0 ?? 1.75, o.y1 ?? 1.6, k), lerp(o.z0 ?? .5, o.z1 ?? .15, k)], at: [LTOP[0], LTOP[1] + (o.dy ?? .12), LTOP[2]], fov: o.fov ?? 40 });
// the studio light: warm, or (on "LIE") cold and low
const stuLight = (lie = 0) => { STU.key.color.set('#FFEBD2').lerp(new THREE.Color('#FF5A48'), lie); STU.key.intensity = lerp(2.0, 1.5, lie); STU.hemi.intensity = lerp(.55, .3, lie); };

// ================= A · the hook: the ketaki on black; "it once told a LIE" =================
SHOTS.push({ a: 0, b: TL.B0 + .4, draw(c, u, t) {
  STU.put(['ketaki']); STU.F.ketaki.position.set(0, 0, 0); STU.F.ketaki.rotation.set(0, t * .25, 0);
  const lie = seg(t, TL.LIE - .1, TL.LIE + .15), push = easeOut(seg(t, TL.LIE - .1, TL.LIE + .35));
  stuLight(lie);
  render3(c, STU.scene, stuCam(.3 + t * .05, lerp(1.6, 1.32, push) - t * .02, .42, [0, lerp(.1, .13, push), 0]), { exposure: 1.05 });
  glow(c, 540, 760, 520, lie ? '#FF4A3A' : '#FFC890', .12 + .12 * lie);
} });

// ================= B · Brahma and Vishnu fight; a pillar of fire with no end rises between them =================
SHOTS.push({ a: TL.B0, b: TL.C0 + .4, xf: .4, draw(c, u, t) {
  const k = easeOut(seg(t, TL.PILLAR - .35, TL.PILLAR + .5)); VD.pillar(t, k); VD.flowerAt([0, 0, 0], 0, false);
  const bob = Math.sin(t * 1.6) * 3, clash = Math.max(0, Math.sin(clamp((t - TL.GREATER + .6) / 1.2) * Math.PI)) * (1 - k);
  VD.at(VD.brahma, [lerp(-30, -27, k) + clash * 8, 8 + bob, 0]); VD.at(VD.vishnu, [lerp(30, 27, k) - clash * 8, 8 - bob, 0]);
  const sh = k > 0 && k < 1 ? (1 - k) * 4 : 0;
  render3(c, VD.scene, cam3({ pos: [vnoise(t * 20, 1) * sh, 14 + vnoise(t * 22, 2) * sh, lerp(150, 175, k) - u * 2], at: [0, lerp(8, 30, k), 0], fov: 52 }), { exposure: 1 });
  pinW(c, 'BRAHMA', VD.brahma.position.toArray(), t, TL.BRAHMA, { dy: -70, col: '#FFD27A', spacing: 4 });
  pinW(c, 'VISHNU', VD.vishnu.position.toArray(), t, TL.VISHNU, { dy: -70, col: '#9EC8FF', spacing: 4 });
  band(c, 1150, 1450, .85 * k);
  flash(c, .6 * Math.exp(-Math.max(0, t - TL.PILLAR + .3) * 4) * (t > TL.PILLAR - .3 ? 1 : 0), '#FFC070');
} });
// Vishnu dives for its root, as a boar
SHOTS.push({ a: TL.C0, b: TL.C1 + .3, xf: .3, draw(c, u, t) {
  VD.pillar(t, 1); VD.flowerAt([0, 0, 0], 0, false); const y = 8 - 160 * u - 60 * u * u;
  VD.at(VD.vishnu, [28, y, 6], [0, -9, 0]);
  render3(c, VD.scene, cam3({ pos: [80, y + 40, 120], at: [14, y - 20, 0], fov: 56 }), { exposure: 1 });
  band(c, 1150, 1450, .85);
  pinW(c, 'DOWN, as a boar', VD.vishnu.position.toArray(), t, TL.C0 + .2, { font: 'italic 46px Marcellus', dy: 90, col: '#BFE0FF', spacing: 0 });
} });
// Brahma flies for its top, as a swan
SHOTS.push({ a: TL.C1, b: TL.D0 + .4, xf: .3, draw(c, u, t) {
  VD.pillar(t, 1); VD.flowerAt([0, 0, 0], 0, false); const y = 8 + 160 * u + 60 * u * u;
  VD.at(VD.brahma, [-28, y, 6], [0, 9, 0]);
  render3(c, VD.scene, cam3({ pos: [-80, y - 40, 120], at: [-14, y + 20, 0], fov: 56 }), { exposure: 1 });
  band(c, 1150, 1450, .85);
  pinW(c, 'UP, as a swan', VD.brahma.position.toArray(), t, TL.C1 + .2, { font: 'italic 46px Marcellus', dy: -80, col: '#FFE2A0', spacing: 0 });
} });

// ================= D · on the way, a flower falls from Shiva's head: the ketaki =================
// Brahma high up the pillar, rising; the flower tumbling down to meet him, lit by the fire
const YB = 2000;
SHOTS.push({ a: TL.D0, b: TL.E0 + .4, xf: .4, draw(c, u, t) {
  VD.pillar(t, 1); const d = TL.E0 + .4 - TL.D0, k = u / d;
  const yb = YB + 40 * k, yf = lerp(YB + 150, YB + 32, easeOut(seg(t, TL.D0, TL.KETAKI + .2)));
  VD.at(VD.brahma, [-30, yb, 10], [0, 9, 0]);
  VD.flowerAt([-14, yf, 14], t * .5);
  render3(c, VD.scene, cam3({ pos: [-52, yb - 10, 66], at: [-14, lerp(yb + 60, yf + 2, easeIO(k)), 10], fov: 50 }), { exposure: .95 });
  band(c, 1150, 1450, .85);
} });

// ================= E · Brahma begs it: "Say I saw the top." And the flower LIED =================
SHOTS.push({ a: TL.E0, b: TL.F0 + .4, xf: .4, draw(c, u, t) {
  VD.pillar(t, 1); const d = TL.F0 + .4 - TL.E0, k = u / d;
  const y = YB + 40 - 30 * k, jolt = t > TL.LIED ? Math.exp(-(t - TL.LIED) * 6) : 0;
  VD.at(VD.brahma, [-34, y + 2, 4], [0, -2, 0]);
  VD.flowerAt([-14 + jolt * 2, y - 4, 14], 1.2 + t * .3 + jolt * .6);
  render3(c, VD.scene, cam3({ pos: [lerp(-34, -24, easeIO(k)), y + 2, lerp(118, 100, easeIO(k))], at: [-18, y + 10, 8], fov: 46 }), { exposure: .95 });
  band(c, 1150, 1450, .85);
  const lie = seg(t, TL.LIED - .05, TL.LIED + .2);
  if (lie > 0) { c.save(); c.globalCompositeOperation = 'multiply'; c.fillStyle = rgba('#C04040', .35 * lie); c.fillRect(0, 0, W, H); c.restore(); }
  flash(c, .35 * jolt, '#FF6A50');
} });

// ================= F · Shiva: "I have no desire to include you in my worship." =================
// the pillar from below, filling the sky; the flower falls away from it into the dark
SHOTS.push({ a: TL.F0, b: TL.G0 + .4, xf: .4, draw(c, u, t) {
  VD.pillar(t, 1); const d = TL.G0 + .4 - TL.F0, k = u / d;
  const fall = easeIO(seg(t, TL.WORSHIP - .4, TL.WORSHIP + 1.2)), y = YB - 200 * fall;
  VD.at(VD.brahma, [-40, YB + 300, 0], [0, 0, 0]);
  VD.flowerAt([-16 - fall * 20, y, 22], 2 + t * .4 + fall * 3, fall < .98);
  VD.fire.intensity *= 1 - fall;
  render3(c, VD.scene, cam3({ pos: [-66, YB - 70, 70], at: [-30, lerp(YB + 20, YB - 40, k), 6], fov: 58 }), { exposure: 1 });
  band(c, 1150, 1450, .85);
  flash(c, .45 * Math.exp(-Math.max(0, t - TL.SAID) * 3) * (t > TL.SAID ? 1 : 0), '#FFD8A0');
} });

// ================= G · the Shiva Purana bars one more: the champa =================
SHOTS.push({ a: TL.G0, b: TL.H0 + .4, xf: .4, draw(c, u, t) {
  STU.put(['ketaki', 'champa']); stuLight(0);
  const ch = popK(t - TL.CHAMPA + .25);
  STU.F.ketaki.position.set(-.12, .0, 0); STU.F.ketaki.scale.setScalar(.75); STU.F.ketaki.rotation.set(0, t * .2, .1);
  STU.F.champa.position.set(.15, .1, .05); STU.F.champa.scale.setScalar(2.4 * Math.max(.001, ch)); STU.F.champa.rotation.set(.9, t * .3, 0);
  render3(c, STU.scene, stuCam(.05 + u * .03, 1.75 - u * .03, .3, [.01, .1, 0]), { exposure: 1.1 });
  STU.F.ketaki.scale.setScalar(1);
  const [kx, ky] = toScreen3([-.12, .17, 0]), [cx, cy] = toScreen3([.15, .1, .05]);
  mark(c, false, kx, ky, 130, t, TL.G0 + .35);
  if (ch > .5) mark(c, false, cx, cy, 130, t, TL.CHAMPA + .15);
  pinW(c, 'CHAMPA', [.15, .1, .05], t, TL.CHAMPA, { dy: 110, col: '#FFC86A' });
  verse(c, [['“Except the Champaka and the Ketaka,', 'italic 42px Marcellus', '#FFF3DC'], ['there is no flower that does not appeal to Shiva.”', 'italic 42px Marcellus', '#FFF3DC'],
    ['— Shiva Purana, Rudra Samhita 1.14.36', '30px Marcellus', '#CFC2B0']], 520, t, TL.PURANA - .2, { dy: 58 });
} });

// ================= H · but tulsi? "Never for Shiva" — the Shiva Purana LISTS it: joy in this life, and moksha =================
SHOTS.push({ a: TL.H0, b: TL.I0 + .4, xf: .4, draw(c, u, t) {
  hideBig(); const ex = W3.mood('night', { hemi: .5 }); lit(t);
  const d = TL.I0 + .4 - TL.H0, k = u / d, on = seg(t, TL.LISTS, TL.LISTS + 1.4);
  tulsiOn(t, on);
  render3(c, SC, doorCam(easeIO(k), { dy: -.32, x0: 4.8, x1: 4.0 }), { exposure: ex * 1.25 });
  const [x, y] = toScreen3([LTOP[0], LTOP[1] + lerp(.4, .3, easeIO(on)), LTOP[2]]);
  if (t < TL.LISTS + .1) mark(c, false, x + 190, y - 90, 130, t, TL.NEVER, { alpha: 1 - seg(t, TL.LISTS - .05, TL.LISTS + .1) });
  mark(c, true, x + 190, y - 90, 130, t, TL.LISTS + .05);
  pinW(c, 'TULSI', [LTOP[0], LTOP[1] + lerp(.4, .3, easeIO(on)), LTOP[2]], t, TL.TULSI, { dx: -200, col: '#B8E890' });
  verse(c, [['“Worldly pleasures and salvation will be secured', 'italic 40px Marcellus', '#FFF3DC'], ['by a person who worships with Tulasī.”', 'italic 40px Marcellus', '#FFF3DC'],
    ['— Shiva Purana, Rudra Samhita 1.14.28', '30px Marcellus', '#CFC2B0']], 520, t, TL.JOY - .3, { dy: 56 });
} });

// ================= I · the god who refuses tulsi: Ganesha; they cursed each other =================
SHOTS.push({ a: TL.I0, b: TL.J0 + .4, xf: .4, draw(c, u, t) {
  hideBig(); OFF.visible = false; const ex = W3.mood('dusk'); lit(t);
  const g = god('ganesha'), d = TL.J0 + .4 - TL.I0, k = easeIO(u / d);
  const curse = t > TL.CURSED - .1 ? Math.exp(-(t - TL.CURSED + .1) * 3) : 0;
  BIG.tulsi.visible = true;
  const cam = orbit(g, k, lerp(14, 12.5, k), 5.2, -.85, -.6, { atY: 5.4 }), x = 250, y = 800 + 14 * Math.sin(t * 1.5);
  BIG.tulsi.position.copy(screenAt(x, y + 130, 7)); fillAt(0, x + 60, y - 40, 4.6); BIG.tulsi.rotation.set(0, t * .3, .1 + curse * .3 * Math.sin(t * 40));
  render3(c, SC, cam, { exposure: ex });
  const e = emblemAt('ganesha'); emblem(c, 'ganesha', e.x, e.y, Math.min(e.s, 170), t, seg(t, TL.I0 + .1, TL.I0 + .5));
  mark(c, false, x, y + 230, 120, t, TL.REFUSES);
  if (curse > .01) { flash(c, .35 * curse, '#FF8040'); bolt(c, e.x - 30, e.y + 40, x + 40, y - 80, Math.floor(t * 12), curse, '#FFB070'); }
  tag(c, 'BRAHMA VAIVARTA PURANA', 540, 1150, t, TL.MARRY - .2, { size: 30 });
} });

// ================= J · and the two flowers Shiva refuses? Vishnu loves them =================
SHOTS.push({ a: TL.J0, b: TL.K0 + .4, xf: .4, draw(c, u, t) {
  hideBig(); OFF.visible = false; const ex = W3.mood('dusk'); lit(t);
  const g = god('vishnu'), d = TL.K0 + .4 - TL.J0, k = easeIO(u / d), down = easeIO(seg(t, TL.LOVES - .3, TL.LOVES + 1.2));
  BIG.ketaki.visible = BIG.champa.visible = true;
  const cam = orbit(g, k, lerp(11.5, 10.5, k), 6, .5, .78, { atY: 5.2 });
  const [kx, ky] = [230, lerp(760, 860, down) + 12 * Math.sin(t * 1.3)], [cx, cy] = [850, lerp(800, 890, down) + 12 * Math.sin(t * 1.7)];
  BIG.ketaki.position.copy(screenAt(kx, ky + 140, 8)); fillAt(0, kx + 40, ky - 40, 5.4); fillAt(1, cx - 40, cy - 40, 5.4); BIG.ketaki.rotation.set(0, t * .3, .15);
  BIG.champa.position.copy(screenAt(cx, cy, 8)); BIG.champa.rotation.set(1.1, t * .4, 0);
  render3(c, SC, cam, { exposure: ex });
  const e = emblemAt('vishnu'); emblem(c, 'vishnu', e.x, e.y, Math.min(e.s, 170), t, seg(t, TL.J0 + .1, TL.J0 + .5));
  const off = 1 - seg(t, TL.LOVES - .1, TL.LOVES + .05);
  mark(c, false, kx, ky + 210, 110, t, TL.TWO, { alpha: off }); mark(c, false, cx, cy + 190, 110, t, TL.TWO + .12, { alpha: off });
  mark(c, true, kx, ky + 210, 110, t, TL.LOVES); mark(c, true, cx, cy + 190, 110, t, TL.LOVES + .12);
  tag(c, 'NARASIMHA PURANA · HARI BHAKTI VILASA 7', 540, 1150, t, TL.VLOVES, { size: 26 });
} });

// ================= K · screenshot this: the board over the courtyard =================
SHOTS.push({ a: TL.K0, b: TL.L0 + .4, xf: .4, draw(c, u, t) {
  hideBig(); OFF.visible = false; const ex = W3.mood('dusk', { hemi: 2.3 }); SC.fog.near = 90; SC.fog.far = 220; lit(t);
  render3(c, SC, cam3({ pos: [0, lerp(80, 77, easeIO(u / 4)), 1.601], at: [0, 0, 1.6], up: [0, 0, -1], fov: 40 }), { exposure: ex * 1.2 });
  c.fillStyle = `rgba(6,5,10,${.5 * seg(t, TL.SCREEN - .2, TL.SCREEN + .3)})`; c.fillRect(0, 0, W, H);
  board(c, t, TL.SCREEN - .2);
  const f = seg(t, TL.SCREEN + .25, TL.SCREEN + .3) * (1 - seg(t, TL.SCREEN + .3, TL.SCREEN + .6));
  if (f > 0) { c.fillStyle = `rgba(255,248,235,${.55 * f})`; c.fillRect(0, 0, W, H); }
} });

// ================= L · the ask: tulsi on the linga; YES or NO? =================
SHOTS.push({ a: TL.L0, b: TL.M0 + .4, xf: .4, draw(c, u, t) {
  hideBig(); const ex = W3.mood('night', { hemi: .5 }); lit(t); tulsiOn(t, 1);
  const d = TL.M0 + .4 - TL.L0, k = easeIO(u / d);
  render3(c, SC, doorCam(k, { x0: 4.4, x1: 3.8, y0: 1.9, y1: 1.8, z0: -.4, z1: -.1, dy: -.3 }), { exposure: ex * 1.25 });
  const p = 1 + .05 * Math.max(0, Math.sin(t * 5));
  text(c, 'YES', 330, 600, `700 ${Math.round(130 * (t > TL.YES ? p : 1))}px Cinzel`, '#FFE2A0', { pop: t - TL.YES, glow: ['rgba(10,6,4,.95)', 26] });
  text(c, 'or', 540, 610, '700 56px Cinzel', '#FFF3DC', { pop: t - TL.YES - .15, glow: ['rgba(10,6,4,.95)', 20] });
  text(c, 'NO', 750, 600, `700 ${Math.round(130 * (t > TL.NOQ ? p : 1))}px Cinzel`, '#FF9A6A', { pop: t - TL.NOQ, glow: ['rgba(10,6,4,.95)', 26] });
} });

// ================= M · next: what you pour on Shiva; the water starts on the linga, the camera rises out =================
SHOTS.push({ a: TL.M0, b: TL.CARD, xf: .4, draw(c, u, t) {
  hideBig(); OFF.visible = false; const ex = W3.mood('dusk'); lit(t, seg(t, TL.POUR - .6, TL.POUR + .6));
  const k = easeIO(u / (TL.CARD - TL.M0));
  render3(c, SC, cam3({ pos: [lerp(3.4, 12, k), lerp(1.9, 6.5, k), lerp(.3, 3.5, k)], at: [0, lerp(1.6, 3.2, k), 0], fov: lerp(46, 54, k) }), { exposure: ex });
  seriesTag(c, 'NEXT', t, TL.NEXT, { w: 240 });
  text(c, 'RUDRABHISHEK', 540, 580, '700 72px Cinzel', '#FFE2A0', { pop: t - TL.POUR, glow: ['rgba(10,6,4,.95)', 24], spacing: 3 });
} });

// ================= N · the card =================
SHOTS.push({ a: TL.CARD, b: TL.END + 1, draw(c, u, t) {
  rkCardCine(c, u, t, { title: 'MEET OUR GODS', line: 'Picture books of our gods, for kids', price: 'Books 1–3 · set of 3 for ₹500' });
} });
