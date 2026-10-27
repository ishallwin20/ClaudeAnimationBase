// rudraksha.js: "Count the lines on your RUDRAKSHA" (ad 56) in the 3D style. A macro rudraksha over crimson velvet, its
// lines lighting in gold; the Shiva Purana's origin (Vidyeshvara Samhita 25.5–7: after thousands of divine years of
// tapas Shiva opened his eyes and his tears became rudraksha trees) in a moonlit Himalayan clearing; rudra + aksha;
// the blue fruit opening on the seed; then the count, the Purana's god for each number of lines (25.64–80): 1 Shiva,
// 4 Brahma, 6 Kartikeya, 9 Durga, 10 Vishnu (Janardana), 12 the twelve Adityas, 14 the highest Shiva; the twist: almost
// every bead has five (Kalagni Rudra); a mantra on rudraksha is a crore times stronger (25.58); the full list of 14 to
// save; the ask (comment your number); the card. STORYBOARD.md has the plan and the sources.
const ST = studio3(), FO = forest3();
const B = bead3(ST.S, { N: 5 }), EMB = emblem3(ST.S), NUMS = numRing3(ST.S), FR = fruit3(ST.S), MALA = mala3(ST.S), HEAP = heap3(ST.S);
MALA.position.y = -1.35;
const FIRE = [...Array(16)].map((_, i) => { const a = i / 16 * TAU, r = 1.9; return flame3(ST.S, [Math.cos(a) * r, -1.35, Math.sin(a) * r], 6 + (i % 3), { light: false, seed: i * 3.3 }); });
// the list: 14 small beads, pole up, on the velvet
const LIST = [...Array(14)].map((_, i) => bead3(ST.S, { res: 'lo', N: i + 1 }));

// everything the studio shots share, reset at the top of each (objects persist between frames)
function studio(o = {}) {
  B.group.visible = !!o.bead; FR.set(0, 0); NUMS.set(0, null); EMB.place('', 0, 0); MALA.visible = !!o.mala; HEAP.visible = !!o.heap;
  FIRE.forEach(f => f.set(0, 0)); LIST.forEach(b => { b.group.visible = false; b.lines(0); });
  B.lines(0); B.group.position.set(0, 0, 0); B.group.rotation.set(0, 0, 0); B.group.scale.setScalar(1); B.spin.rotation.set(0, 0, 0);
  return ST.look(o.look || 'velvet', o);
}
// a camera on a sphere round `at`: dist, elevation, azimuth (radians)
const orbit = (d, el, az, at = [0, 0, 0], fov = 26, o = {}) => { const p = [at[0] + d * Math.cos(el) * Math.sin(az), at[1] + d * Math.sin(el), at[2] + d * Math.cos(el) * Math.cos(az)]; return { cam: cam3({ pos: p, at, fov, ...o }), pos: p }; };
const lerp3 = (a, b, k) => a.map((v, i) => lerp(v, b[i], k));

const CAPY = 1300;
POST.push((c, t) => { if (t < TL.CARD) band(c, 1160, 1450, .42); });
VO.caps.forEach((k, i) => say(i ? k.a : -1, k.b, k.text, { at: i ? k.at : k.at.map(() => -1), y: CAPY }));

// ================= A · the hook: a bead in the lamp light, its lines glowing =================
SHOTS.push({ a: 0, b: TL.B0 + .4, draw(c, u, t) {
  const ex = studio({ bead: 1, key: [4, 6, 6] });
  B.spin.rotation.y = .4 + t * .32; B.group.rotation.set(.1, 0, -.12);
  B.lines(1, .55 + .25 * Math.sin(t * 3));
  const { cam } = orbit(lerp(11.2, 10.6, u / 2.6), .42, .35 + u * .03, [0, -.5, 0]);
  render3(c, ST.S, cam, { exposure: ex });
} });

// ================= B · each number belongs to a different god: the numerals round it =================
SHOTS.push({ a: TL.B0, b: TL.C0 + .4, xf: .4, draw(c, u, t) {
  const ex = studio({ bead: 1, key: [4, 6, 6] });
  B.spin.rotation.y = .4 + t * .32 + easeIO(seg(t, TL.B0, TL.C0)) * 2; B.group.rotation.set(.1, 0, -.12);
  B.lines(1, .5);
  NUMS.set(t, i => seg(t, TL.B0 + .3 + i * .13, TL.B0 + .6 + i * .13) * (1 + .3 * seg(t, TL.GOD, TL.GOD + .2) * (1 - seg(t, TL.GOD + .3, TL.GOD + .9))), 2.15, .3);
  const { cam } = orbit(lerp(10.6, 13.5, easeIO(u / 3.2)), lerp(.42, .3, easeIO(u / 3.2)), .45, [0, -.5, 0]);
  render3(c, ST.S, cam, { exposure: ex });
} });

// ---------- Shiva in the sky (2D, drawn over the 3D night) ----------
function shivaVision(c, t, o) {
  const l = scratch('vision'), { x, y, k } = o;
  l.save(); l.translate(x, y); l.scale(k, k); l.translate(0, 815); shivaHead(l, { t, eyes: o.eyes ?? 0, light: -1, wind: .2 }); l.restore();
  l.globalCompositeOperation = 'destination-in';
  const g = l.createRadialGradient(x, y + 30, 0, x, y + 30, o.R || 600); g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(.5, 'rgba(0,0,0,.85)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  l.fillStyle = g; l.fillRect(0, 0, W, H); l.globalCompositeOperation = 'source-over';
  l.globalCompositeOperation = 'source-atop'; l.fillStyle = 'rgba(120,160,255,.22)'; l.fillRect(0, 0, W, H); l.globalCompositeOperation = 'source-over';
  blit(c, l.canvas, o.a * .62);
  blit(c, l.canvas, o.a * .5, 'screen', 'blur(22px)');
}
// where his eyes are on screen (the head drawn at x, y, scale k): s -1 his right (screen left)
const eyeAt = (o, s) => [o.x + s * 19 * o.k, o.y + (-820 + 815) * o.k];
const SKY = { x: 540, y: 690, k: 4.6, R: 640 };
const skyCam = (k) => cam3({ pos: [0, 1.7, 15], at: [0, lerp(10, 8, k), -40], fov: 50 });
const forestBare = () => { FO.hero.set(0); FO.others.forEach(o => o.T.set(0)); FO.setTear(null, 0); FO.setRing(0, 0); FO.far.forEach(f => f.material.opacity = 0); };

// ================= C · Shiva in tapas, thousands of divine years =================
SHOTS.push({ a: TL.C0, b: TL.D0 + .4, xf: .5, draw(c, u, t) {
  const ex = FO.mood({ exposure: 1.2 }); forestBare();
  render3(c, FO.S, skyCam(easeIO(u / 5.5) * .3), { exposure: ex });
  shivaVision(c, t, { ...SKY, y: SKY.y + 20 - u * 4, eyes: 0, a: seg(t, TL.C0 + .1, TL.C0 + 1.4) });
} });

// ================= D · he opened his eyes, and tears fell =================
const TEAR = { form: () => TL.EYES - .1, fall: () => TL.TEARS + .05 };
SHOTS.push({ a: TL.D0, b: TL.E0 + .3, xf: .2, draw(c, u, t) {
  const ex = FO.mood({ exposure: 1.2 }); forestBare();
  const tilt = easeIO(seg(t, TL.TEARS, TL.E0));
  render3(c, FO.S, skyCam(.3 + .7 * tilt), { exposure: ex });
  const eyes = easeOut(seg(t, TL.OPENED - .1, TL.OPENED + .7)), o = { ...SKY, y: SKY.y - 1.5 * (t - TL.C0) * 4 + 40 * tilt };
  shivaVision(c, t, { ...o, eyes, a: 1 - .6 * tilt });
  // the tears: one from each eye, the right one falling to us
  for (const s of [-1, 1]) {
    const [ex0, ey0] = eyeAt(o, s), f = seg(t, TEAR.form(), TEAR.form() + .5), roll = easeIn(seg(t, TEAR.fall() - .3, TEAR.fall() + .2));
    if (f <= 0) continue;
    const fall = s < 0 ? easeIn(seg(t, TEAR.fall() + .15, TL.E0 + .25)) : 0;
    const x = ex0 + s * 4 + fall * 60, y = ey0 + 12 + roll * 50 * o.k / 4.6 + fall * 1250, r = (5 + 4 * f) * (1 + fall * 5);
    if (s > 0 && roll >= 1) continue;
    glow(c, x, y, r * 6, '#A8D0FF', .55 * f);
    c.save(); c.fillStyle = `rgba(235,245,255,${.95 * f})`; c.beginPath(); c.moveTo(x, y - r * 1.8); c.bezierCurveTo(x + r, y - r * .6, x + r, y + r, x, y + r); c.bezierCurveTo(x - r, y + r, x - r, y - r * .6, x, y - r * 1.8); c.fill(); c.restore();
    if (fall > 0) glow(c, x, y - r * 4, r * 3, '#BFDFFF', .5 * fall);
  }
  // the drop passes the lens: a flash of moonlight
  const fl = seg(t, TL.E0 - .15, TL.E0 + .1) * (1 - seg(t, TL.E0 + .1, TL.E0 + .3));
  if (fl > 0) glow(c, 520, 1100, 900, '#BFDFFF', .5 * fl);
} });

// ================= E · where they fell, rudraksha trees grew =================
const IMPACT = () => TL.WHERE - .1;
SHOTS.push({ a: TL.E0, b: TL.F0 + .4, xf: .3, draw(c, u, t) {
  const ex = FO.mood({ exposure: 1.25 });
  const td = seg(t, TL.E0, IMPACT());
  FO.setTear(t < IMPACT() ? [0, lerp(3.2, .05, easeIn(td)), 0] : null, 1);
  const ri = seg(t, IMPACT(), IMPACT() + 1.6); FO.setRing(easeOut(ri), (1 - ri) * (ri > 0 ? 1 : 0));
  const g = seg(t, IMPACT() + .15, TL.GREW + .7); FO.hero.set(easeOut(g * .92 + .08 * g * g));
  FO.others.forEach((o, i) => { const s = IMPACT() + .5 + i * .12; o.T.set(easeOut(seg(t, s + .45, s + 2.4))); FO.far[i].position.y = lerp(8, .3, easeIn(seg(t, s - .2, s + .45))); FO.far[i].material.opacity = seg(t, s - .2, s) * (1 - seg(t, s + .45, s + .9)); });
  const k = easeIO(seg(t, IMPACT() + .2, TL.F0 + .4));
  render3(c, FO.S, cam3({ pos: lerp3([2.5, 2.4, 9.5], [7.5, 2.6, 14], k), at: lerp3([0, 1.0, 0], [0, 4.2, 0], k), fov: lerp(46, 50, k) }), { exposure: ex });
} });

// ================= F · rudra, aksha: the eye of Shiva =================
SHOTS.push({ a: TL.F0, b: TL.G0 + .4, xf: .4, draw(c, u, t) {
  const ex = FO.mood({ exposure: 1.3 }); FO.setTear(null, 0); FO.setRing(0, 0); FO.far.forEach(f => f.material.opacity = 0);
  FO.hero.set(1); FO.others.forEach(o => o.T.set(1));
  const k = easeIO(u / 4.2);
  render3(c, FO.S, cam3({ pos: lerp3([7.5, 2.6, 14], [10, 2.2, 17.5], k), at: lerp3([0, 4.2, 0], [0, 5.6, -2], k), fov: 50 }), { exposure: ex });
  // his eyes again, faint in the sky, open
  // the name in Devanagari over the canopy
  const a1 = seg(t, TL.RUDRA - .1, TL.RUDRA + .2), a2 = seg(t, TL.AKSHA - .1, TL.AKSHA + .2), m = easeIO(seg(t, TL.EYE - .3, TL.EYE + .3)), out = 1 - seg(t, TL.G0, TL.G0 + .35);
  const y = 520;
  if (m < 1) {
    text(c, 'रुद्र', lerp(380, 470, m), y, '96px "Tiro Devanagari Sanskrit"', '#FFE2A0', { alpha: a1 * (1 - m) * out, glow: ['rgba(255,170,60,.8)', 26], pop: t - TL.RUDRA + .1 });
    text(c, '+', 540, y, '700 64px Cinzel', '#F4C46A', { alpha: a2 * (1 - m) * out });
    text(c, 'अक्ष', lerp(700, 610, m), y, '96px "Tiro Devanagari Sanskrit"', '#FFE2A0', { alpha: a2 * (1 - m) * out, glow: ['rgba(255,170,60,.8)', 26], pop: t - TL.AKSHA + .1 });
  }
  if (m > 0) text(c, 'रुद्राक्ष', 540, y, '112px "Tiro Devanagari Sanskrit"', '#FFE2A0', { alpha: m * out, glow: ['rgba(255,170,60,.9)', 32] });
  if (m > 0) text(c, 'THE EYE OF RUDRA', 540, y + 92, '700 34px Cinzel', '#F4C46A', { alpha: m * out, spacing: 6, glow: ['rgba(10,6,4,.9)', 16] });
} });

// ================= G · its fruit is blue; the bead is the seed inside =================
SHOTS.push({ a: TL.G0, b: TL.BLUE + .5, xf: .4, draw(c, u, t) {
  const ex = FO.mood({ exposure: 1.3 }); FO.hero.set(1); FO.others.forEach(o => o.T.set(1));
  // fly into the canopy, to a cluster of fruit on the first tree
  const f = FO.hero.fruits[7].p.clone().applyMatrix4(FO.hero.group.matrixWorld), k = easeIO(seg(t, TL.G0, TL.BLUE + .5));
  const end = [f.x + .55, f.y + .05, f.z + .9], from = [10, 2.2, 17.5];
  render3(c, FO.S, cam3({ pos: lerp3(from, end, k), at: lerp3([0, 5.6, -2], [f.x, f.y, f.z], Math.min(1, k * 1.4)), fov: lerp(50, 34, k) }), { exposure: ex });
} });
SHOTS.push({ a: TL.BLUE + .1, b: TL.H0 + .4, xf: .4, draw(c, u, t) {
  const ex = studio({ look: 'canopy', bead: 1, key: [3, 7, 5], hemi: .5 });
  const open = seg(t, TL.SEED - .45, TL.SEED + .75);
  FR.set(open, 1); FR.group.rotation.set(0, Math.PI / 2 + .2 + u * .12, 0);
  B.spin.rotation.y = .3 + u * .12;
  const { cam } = orbit(lerp(14, 11.5, easeIO(u / 3)), lerp(.1, .28, easeIO(u / 3)), .2 + u * .05, [0, lerp(.1, -.4, easeIO(u / 3)), 0]);
  render3(c, ST.S, cam, { exposure: ex * 1.05 });
} });

// ================= H · now count its lines, top to bottom =================
SHOTS.push({ a: TL.H0, b: TL.I0 + .4, xf: .45, draw(c, u, t) {
  const ex = studio({ bead: 1, key: [4, 6, 6] });
  B.spin.rotation.y = .3 + t * .12 - TL.H0 * .12 + 1.1; B.group.rotation.set(.12, 0, -.1);
  B.lines(i => seg(t, TL.LINES - .2 + i * .14, TL.BOTTOM + .1 + i * .06), 1);
  const { cam } = orbit(lerp(10.6, 10, easeIO(u / 3)), lerp(.28, .42, easeIO(u / 3)), .2, [0, -.45, 0]);
  render3(c, ST.S, cam, { exposure: ex });
} });

// ================= I · the count: one god for each number =================
TL.GODS.forEach((G, gi) => {
  const nx = TL.GODS[gi + 1], b = nx ? nx.a : TL.J0;
  SHOTS.push({ a: G.a, b: b + .3, xf: gi ? 0 : .4, draw(c, u, t) {
    const ex = studio({ bead: 1, key: [2, 8, 4] });
    // the swap: a quick turn, the new bead
    const sw = easeIO(seg(t, G.a - .05, G.a + .45));
    B.setN(G.n); B.spin.rotation.y = gi * 1.3 + sw * TAU * .5 + (t - G.a) * .18; B.group.scale.setScalar(.92 + .08 * easeOut(seg(t, G.a, G.a + .4)));
    const dt = Math.min(.9, 1.1 - G.n * .02);
    B.lines(i => seg(t, G.num + .05 + i * dt / G.n, G.num + .3 + i * dt / G.n), 1);
    const az = .3 + gi * .5 + (t - G.a) * .06, o = orbit(15.4, 1.18, az, [Math.sin(az) * .75, -.2, Math.cos(az) * .75]);
    EMB.place(G.key, G.n, .85 * seg(t, G.name - .2, G.name + .25), o.pos, [0, 0, 0], 1.8, 4.6);
    render3(c, ST.S, o.cam, { exposure: ex });
    // tick each line as it lights: its number just outside the bead
    const C0 = toScreen3([0, 0, 0]);
    for (let i = 0; i < G.n; i++) {
      const at = G.num + .3 + i * dt / G.n; if (t < at) continue;
      const cv = B.tip(i), p = cv.getPoint(.5).clone().applyMatrix4(B.spin.matrixWorld), s = toScreen3(p), d = Math.hypot(s[0] - C0[0], s[1] - C0[1]) || 1;
      const x = C0[0] + (s[0] - C0[0]) / d * (d + 52), y = C0[1] + (s[1] - C0[1]) / d * (d + 52);
      text(c, String(i + 1), x, y, '700 34px Cinzel', '#FFE2A0', { pop: t - at, alpha: .9, glow: ['rgba(10,6,4,.95)', 14] });
    }
    text(c, String(G.n), 540, 1150, '700 120px Cinzel', '#FFE2A0', { pop: t - G.num, glow: ['rgba(255,150,40,.7)', 30] });
  } });
});

// ================= J · but almost every rudraksha has five lines =================
SHOTS.push({ a: TL.J0, b: TL.J1 + .4, xf: .4, draw(c, u, t) {
  const ex = studio({ heap: 1, key: [4, 9, 5], hemi: .4 });
  const k = easeIO(u / 3.6);
  render3(c, ST.S, cam3({ pos: [lerp(2, .5, k), lerp(30, 23, k), lerp(20, 15, k)], at: [0, lerp(.8, 1.2, k), 0], fov: 30 }), { exposure: ex });
  if (t > TL.FIVE1 - .1) {
    band(c, 940, 1180, .5 * seg(t, TL.FIVE1 - .2, TL.FIVE1));
    text(c, '5', 540, 1050, '700 170px Cinzel', '#FFE2A0', { pop: t - TL.FIVE1 + .1, glow: ['rgba(255,150,40,.8)', 34] });
  }
} });
// five is Rudra himself: Kalagni, the fire of time
SHOTS.push({ a: TL.J1, b: TL.K0 + .4, xf: .35, draw(c, u, t) {
  const fire = seg(t, TL.KALAGNI - .3, TL.KALAGNI + .4);
  const ex = studio({ bead: 1, look: 'fire', key: [2, 8, 4], warm: 8 + 16 * fire });
  ST.warm.position.set(0, -.4, 0);
  B.setN(5); B.spin.rotation.y = 2 + u * .25; B.group.scale.setScalar(.92 + .08 * easeOut(seg(t, TL.J1, TL.J1 + .4)));
  B.lines(i => seg(t, TL.FIVE2 + i * .12, TL.FIVE2 + .3 + i * .12), 1, '#FFB060');
  FIRE.forEach((f, i) => f.set(t, seg(t, TL.RUDRA5 - .4 + i * .04, TL.KALAGNI + i * .03) * (.75 + .25 * fire)));
  const az5 = 3.2 + u * .05, o = orbit(lerp(15.8, 14.8, easeIO(u / 3.5)), 1.1, az5, [Math.sin(az5) * .75, -.2, Math.cos(az5) * .75]);
  EMB.place('kalagni', 5, .9 * seg(t, TL.RUDRA5 - .2, TL.RUDRA5 + .3), o.pos, [0, 0, 0], 1.8, 4.6);
  render3(c, ST.S, o.cam, { exposure: ex });
  band(c, 1080, 1480, .5);
  text(c, '5', 540, 1150, '700 120px Cinzel', '#FFE2A0', { pop: t - TL.FIVE2, glow: ['rgba(255,110,30,.8)', 30] });
} });

// ================= K · chant on it, and a mantra is a crore times stronger =================
SHOTS.push({ a: TL.K0, b: TL.L0 + .4, xf: .4, draw(c, u, t) {
  const ex = studio({ mala: 1, key: [3, 9, 6], hemi: .4 });
  const steps = (t - TL.K0) * 2.2, step = Math.floor(steps) + easeIO((steps % 1) * 1.6);
  const burst = TL.CRORE - .1;
  MALA.set(step, i => { const near = Math.max(0, 1 - Math.abs(((i + step) % 108 + 108) % 108 - 53) / 1.6); return Math.max(near * .7 * (1 - seg(t, burst, burst + .3)), seg(t, burst + i * .005, burst + .2 + i * .005) * (1 - seg(t, TL.L0 - .2, TL.L0 + .3))); });
  const k = easeIO(seg(t, TL.MANTRA - .6, TL.CRORE + .3));
  const { cam } = orbit(lerp(4.2, 26, k), lerp(.38, 1.12, k), .5 * (1 - k) + .1, lerp3([0, -1.1, 10.1], [0, -1.2, 2.4], k), 34);
  render3(c, ST.S, cam, { exposure: ex * (1 + .25 * seg(t, burst, burst + .3) * (1 - seg(t, burst + .5, burst + 1.6))) });
  const a = seg(t, TL.CRORE - .15, TL.CRORE + .1) * (1 - seg(t, TL.L0, TL.L0 + .3));
  if (a > 0) { band(c, 720, 960, .45 * a); text(c, '× 1,00,00,000', 540, 840, '700 92px Cinzel', '#FFE2A0', { pop: t - TL.CRORE + .15, alpha: a, glow: ['rgba(255,150,40,.8)', 30], maxW: 900 }); }
} });

// ================= L · save this: the fourteen, and the ask =================
const NAMES = [['SHIVA', 'himself'], ['ISHA', 'lord of the gods'], ['ALL LEARNING', 'every lore'], ['BRAHMA', ''], ['KALAGNI RUDRA', 'the most common'], ['KARTIKEYA', ''], ['ANANGA', 'Kamadeva'],
  ['BHAIRAVA', ''], ['DURGA', 'her nine forms'], ['VISHNU', 'Janardana'], ['RUDRA', ''], ['12 ADITYAS', 'the twelve suns'], ['VISHVEDEVAS', 'all the gods'], ['PARAMA SHIVA', 'the highest']];
const ROW0 = 560, ROWH = 94, COLX = [124, 586], PX = 119.4;   // the grid camera looks straight down from 30: 119.4 px a metre
const listAt = i => [COLX[i < 7 ? 0 : 1], ROW0 + (i % 7) * ROWH];
SHOTS.push({ a: TL.L0, b: TL.CARD, xf: .45, draw(c, u, t) {
  const ex = studio({ key: [3, 9, 5], hemi: .5 });
  LIST.forEach((b, i) => {
    const [sx, sy] = listAt(i), k = easeOut(seg(t, TL.L0 + .15 + i * .05, TL.L0 + .5 + i * .05));
    b.group.visible = k > .01; b.group.position.set((sx - 540) / PX, -1.35 + .36 * .93, (sy - 960) / PX); b.group.scale.setScalar(.36 * k);
    b.spin.rotation.y = i * .7 + t * .2; b.lines(1, i === 4 ? .9 : .5);
  });
  render3(c, ST.S, cam3({ pos: [0, 30, .001], at: [0, 0, 0], fov: 30, up: [0, 0, -1] }), { exposure: ex * .9 });
  band(c, 400, 1230, .55 * seg(t, TL.L0, TL.L0 + .4));
  text(c, 'COUNT THE LINES', 540, 470, '700 40px Cinzel', '#F4C46A', { alpha: seg(t, TL.L0 + .1, TL.L0 + .5), spacing: 6, glow: ['rgba(10,6,4,.9)', 16] });
  NAMES.forEach(([nm, sub], i) => {
    const [sx, sy] = listAt(i), a = seg(t, TL.L0 + .3 + i * .05, TL.L0 + .6 + i * .05); if (a <= 0) return;
    const x = sx + 56, hot = i === 4;
    if (hot) { const p = .6 + .4 * Math.sin(t * 4); c.save(); c.globalAlpha = a * p; c.strokeStyle = '#F4C46A'; c.lineWidth = 3; c.shadowColor = '#FFB040'; c.shadowBlur = 16; c.beginPath(); c.roundRect(sx - 52, sy - 44, 400, 88, 18); c.stroke(); c.restore(); }
    c.save(); c.globalAlpha = a; c.textAlign = 'left'; c.textBaseline = 'middle'; c.shadowColor = 'rgba(6,4,6,.95)'; c.shadowBlur = 10;
    c.font = '700 40px Cinzel'; c.fillStyle = '#FFE2A0'; c.fillText(String(i + 1), x, sy - (sub ? 14 : 0));
    const nw = 56; c.font = `700 ${nm.length > 11 ? 29 : 33}px Cinzel`; c.fillStyle = hot ? '#FFD27A' : '#FFF3DC'; c.letterSpacing = '1px';
    const mw = 280; let w = c.measureText(nm).width; c.save(); c.translate(x + nw, sy - (sub ? 14 : 0)); if (w > mw) c.scale(mw / w, 1); c.fillText(nm, 0, 0); c.restore();
    if (sub) { c.font = '26px Marcellus'; c.fillStyle = hot ? '#F4C46A' : '#CFC2B0'; c.fillText(sub, x + nw, sy + 22); }
    c.restore();
  });
  text(c, 'Shiva Purana · Vidyeshvara Samhita 25', 540, 1210, '28px Marcellus', '#CFC2B0', { alpha: .85 * seg(t, TL.L0 + 1, TL.L0 + 1.5) });
} });

// ================= M · the card =================
SHOTS.push({ a: TL.CARD, b: TL.END + 1, draw(c, u, t) {
  rkCardCine(c, u, t, { title: 'MEET OUR GODS', line: 'Picture books of our gods, for kids', price: 'Books 1–3 · set of 3 for ₹500' });
} });
