// nidhi.js: ad 116, "There's a forest in Vrindavan that NOBODY is allowed to enter after SUNSET": Nidhivan, the grove
// locked every evening, the bed made in the Rang Mahal, what local stories say happens to anyone who stays to watch;
// then what the Bhagavatam itself says of the Raas (10.33.19, .37, .39). The 3D style with GLB models (the reference
// reels: still models, cinema direction, mono labels). Facts and sources: STORYBOARD.md. Times: nidhi_tl.js.
// Sets in nidhi_props.js: GR the grove (dusk / night / dawn), RM the Rang Mahal, HS the neighbour's wall, BK the bank.
LOOK.bloom = .03; LOOK.grain = .07; LOOK.vignette = .8;
Object.assign(CAP, { font: 'Oswald', weight: 600, size: 58, maxW: 900, x: 540, y: 1330, gold: '#FFC65A', lit: '#FFF6E6', dim: .3 });
const CAPY = 1330;
VO.caps.forEach((k, i) => say(i ? k.a : -1, k.b, k.text, { at: i ? k.at : k.at.map(() => -1), y: k.y ?? CAPY }));

// the HDRIs' sky pictures are images: ask for them now, so cine.js waits for them before the first frame
['night2', 'fire', 'dawn', 'lamplit'].forEach(n => env3(new THREE.Scene(), n, { bg: true }));
const GR = grove3(), RM = room3(), BK = bank3(), HS = house3(), PS = pairStage3();
const R_ = (t, a, b) => clamp((t - a) / (b - a));

// ---------- the lens and the grade ----------
const NIGHTG = { sh: '#0E2440', hi: '#C8D8FF', split: .22, contrast: 1.14 };
const DUSKG = { sh: '#1E3A50', hi: '#FFA060', split: .2, contrast: 1.1 };
const WARMG = { sh: '#2A1A30', hi: '#FFB060', split: .16, contrast: 1.12 };
const DAWNG = { sh: '#3A4A60', hi: '#FFD0A0', split: .14, contrast: 1.06 };
const lens = (focus, ap = 1.5, o = {}) => ({ dof: { focus, aperture: ap, max: o.max ?? 12, nearK: o.nearK ?? .7 },
  bloom: { k: o.bloom ?? .07, thresh: 1.5, knee: .6, radius: 1 }, rays: o.rays, ca: .0015,
  grade: { contrast: o.contrast ?? 1.1, sat: o.sat ?? 1, temp: o.temp ?? 0, tint: 0, lift: o.lift ?? 0, gamma: 1, gain: o.gain ?? 1, shadows: o.sh ?? '#20405A', highlights: o.hi ?? '#FFB070', split: o.split ?? .18 } });
const moonRays = (k = .7) => ({ at: GR.moon.position.toArray(), k, thresh: .45, col: '#AFC4FF' });
const sunRays = (k = .6) => ({ at: GR.sun.position.toArray().map((v, i) => v + [0, 0, -14][i]), k, thresh: .5, col: '#FFB070' });

// ---------- 2D: labels, stickers, the corner, black and white ----------
// tag: a mono label in a black box with a coloured bar at its left, typed in (the reference reels' look)
function tag(c, t, t0, t1, txt, x, y, o = {}) {
  if (t < t0 || t > t1) return;
  const vis = Math.min(seg(t, t0, t0 + .15), 1 - seg(t, t1 - .2, t1)), n = Math.ceil(txt.length * clamp((t - t0) / Math.max(.25, txt.length * .03)));
  const s = txt.slice(0, n), fs = o.size ?? 32;
  c.save(); c.globalAlpha = vis; c.font = `700 ${fs}px "Space Mono"`; c.letterSpacing = (fs * .08) + 'px'; c.textBaseline = 'middle';
  const w = c.measureText(txt).width, pad = fs * .55, bw = w + pad * 2 + 8, bh = fs * 1.75, x0 = o.align === 'center' ? x - bw / 2 : o.align === 'right' ? x - bw : x;
  c.fillStyle = 'rgba(8,8,10,.82)'; c.fillRect(x0, y - bh / 2, bw, bh);
  c.fillStyle = o.col || '#E8402A'; c.fillRect(x0, y - bh / 2, 6, bh);
  c.fillStyle = '#F4F0E8'; c.fillText(s, x0 + pad + 8, y + 1);
  c.restore();
}
// sticker: a red box with white condensed caps, slightly turned ("RUK JAIYE" in the reference)
function sticker(c, t, t0, t1, txt, x, y, o = {}) {
  if (t < t0 || t > t1) return;
  const k = popK(t - t0), vis = 1 - seg(t, t1 - .2, t1), fs = o.size ?? 64;
  c.save(); c.translate(x, y); c.rotate(o.rot ?? -.04); c.scale(k, k); c.globalAlpha = vis * clamp(k);
  c.font = `400 ${fs}px Anton`; c.letterSpacing = '2px'; c.textAlign = 'center'; c.textBaseline = 'middle';
  const w = c.measureText(txt).width + fs * .7, h = fs * 1.35;
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 18; c.fillStyle = o.col || '#C8281E'; c.fillRect(-w / 2, -h / 2, w, h);
  c.shadowBlur = 0; c.strokeStyle = 'rgba(255,230,200,.85)'; c.lineWidth = 3; c.strokeRect(-w / 2 + 6, -h / 2 + 6, w - 12, h - 12);
  c.fillStyle = '#FFF4E4'; c.fillText(txt, 0, 3); c.restore();
}
// big: a headline in tall condensed caps
function big(c, t, t0, t1, txt, y, o = {}) {
  if (t < t0 || t > t1) return;
  const vis = Math.min(seg(t, t0, t0 + .25), 1 - seg(t, t1 - .25, t1)), fs = o.size ?? 150;
  c.save(); c.globalAlpha = vis; c.font = `400 ${fs}px Anton`; c.letterSpacing = '3px'; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.shadowColor = 'rgba(0,0,0,.65)'; c.shadowBlur = 40; c.fillStyle = o.col || '#FFF4E4';
  c.translate(540, y + (1 - vis) * 20); const sc = 1 + .04 * (1 - vis); c.scale(sc, sc); c.fillText(txt, 0, 0); c.restore();
}
// the corner label: what kind of claim is on screen
const CORNER = [[TL.D0, TL.M0, 'LOCAL BELIEF', '#E8402A'], [TL.M0, TL.P0, 'BHAGAVATA PURANA · 10.33', '#E8B030']];
function corner(c, t) {
  for (const [a, b, txt, col] of CORNER) tag(c, t, a + .3, b, txt, 64, 456, { size: 24, col });
}
const black = (c, a) => { if (a <= 0) return; c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = clamp(a); c.fillStyle = '#000'; c.fillRect(0, 0, W, H); c.restore(); };
const white = (c, a) => { if (a <= 0) return; c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = clamp(a); c.fillStyle = '#FFF8EC'; c.fillRect(0, 0, W, H); c.restore(); };
// a soft dark band behind the captions
const capBand = (c, a = .55) => { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); const g = c.createLinearGradient(0, 1130, 0, 1560); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(.45, `rgba(0,0,0,${a})`); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, 1130, W, 430); c.restore(); };

// ================= A · the lock at dusk: "There's a forest in Vrindavan that NOBODY is allowed to enter after SUNSET" =================
SHOTS.push({ a: 0, b: TL.B0, draw(c, u, t) {
  GR.set('dusk', { az: 8, el: 6, rot: 2.6, fog: .05, sun: 3.6, bgK: 1.1 }); GR.lock.set(0);
  GR.fill.position.set(.35, 1.35, .75); GR.fill.color.set('#FFB27A'); GR.fill.intensity = 2.2; GR.fill.distance = 2; GR.fill.decay = 2;
  const k = R_(t, 0, TL.B0), L = GR.lock.getWorldPosition(V3());
  const pos = [L.x + lerp(.12, .06, k), L.y + lerp(.07, .04, k), L.z + lerp(.5, .36, k)];
  render3(c, GR.scene, cam3({ pos, at: [L.x, L.y - .035, L.z], fov: 30 }), { exposure: 1.05, fx: lens(Math.hypot(pos[0] - L.x, pos[1] - L.y, pos[2] - L.z), 12, { ...DUSKG, max: 22, rays: sunRays(.5) }) });
  capBand(c, .5);
  tag(c, t, .6, TL.B0, 'NIDHIVAN · VRINDAVAN', 540, 1165, { align: 'center' });
} });

// ================= B · through the gate: "And the reason… is hard to BELIEVE" =================
SHOTS.push({ a: TL.B0, b: TL.C0 + .4, draw(c, u, t) {
  GR.set('dusk', { az: 8, el: 5, rot: 2.6, fog: .045, sun: 3.6 }); GR.fill.intensity = 0;
  const k = easeIO(R_(t, TL.B0, TL.C0 + .4));
  render3(c, GR.scene, cam3({ pos: [.05, lerp(.6, 1.1, k), lerp(2.4, -.6, k)], at: [0, lerp(1.6, 1.4, k), -10], fov: 50 }), { exposure: 1.05, fx: lens(lerp(2.4, 6, k), 3, { ...DUSKG, rays: sunRays(.8) }) });
  capBand(c, .5);
} });

// ================= C · the path at dusk: "It's called NIDHIVAN. The grove where BANKE BIHARI JI first appeared, to SWAMI HARIDAS" =================
SHOTS.push({ a: TL.C0, b: TL.D0 + .6, xf: .4, draw(c, u, t) {
  GR.set('dusk', { az: 4, el: 4, rot: 2.6, fog: .05, sun: 3.4 }); GR.fill.intensity = 0;
  const k = R_(t, TL.C0, TL.D0 + .6);
  render3(c, GR.scene, cam3({ pos: [lerp(-.3, .25, k), 1.45 + .02 * Math.sin(t * 4.5), lerp(-2, -9, k)], at: [lerp(.6, -.2, k), 1.5, -24], fov: 48 }), { exposure: 1.05, fx: lens(5, 2.5, { ...DUSKG, rays: sunRays(.9) }) });
  capBand(c, .5);
  big(c, t, TL.NIDHIVAN - .1, TL.BANKE - .3, 'NIDHIVAN', 640, { size: 170 });
  tag(c, t, TL.BANKE, TL.D0 + .4, 'BANKE BIHARI JI · APPEARED HERE', 540, 600, { align: 'center' });
  tag(c, t, TL.HARIDAS - .2, TL.D0 + .4, 'SWAMI HARIDAS · 16TH CENTURY', 540, 680, { align: 'center', col: '#E8B030' });
} });

// ================= D · night falls on the path: "Devotees believe that every night, KRISHNA returns here… to dance the MAHARAAS…" =================
SHOTS.push({ a: TL.D0, b: TL.E0 + .5, xf: .6, draw(c, u, t) {
  const k = R_(t, TL.D0, TL.E0 + .5);
  GR.set('night', { az: 0, el: lerp(5, 10, k), fog: .055, moonSize: 8, bgK: .5 }); GR.rmGlow.material.opacity = .55;
  render3(c, GR.scene, cam3({ pos: [0, lerp(.9, 1.6, easeIO(k)), lerp(-3, -6, k)], at: [0, lerp(2.2, 2.8, k), -30], fov: 50 }), { exposure: 1.3, fx: lens(9, 2.5, { ...NIGHTG, rays: moonRays(.9) }) });
  capBand(c, .45); corner(c, t);
  tag(c, t, TL.MAHARAAS, TL.E0 + .3, 'MAHARAAS · EVERY NIGHT', 540, 600, { align: 'center', col: '#E8B030' });
} });

// ================= E · a pair: "Its trees grow in PAIRS, twisted round each other. Locals say that at night… they become the GOPIS" =================
SHOTS.push({ a: TL.E0, b: TL.F0 + .4, xf: .4, draw(c, u, t) {
  const k = R_(t, TL.E0, TL.F0 + .4), a = lerp(-.45, .45, k), r = lerp(5.4, 4.4, k);
  PS.set({ az: 0, el: 14 });
  const pos = [Math.sin(a) * r, lerp(.45, .8, k), Math.cos(a) * r];
  render3(c, PS.scene, cam3({ pos, at: [0, 2.3, 0], fov: 46 }), { exposure: 1.2, fx: lens(r, 3, { ...NIGHTG, rays: { at: PS.moon.position.toArray(), k: .8, thresh: .45, col: '#AFC4FF' } }) });
  capBand(c, .5); corner(c, t);
  tag(c, t, TL.PAIRS, TL.F0 + .2, 'TULSI · ALWAYS IN PAIRS', 540, 600, { align: 'center' });
} });

// ================= F · the Rang Mahal at night: "Every evening, a BED is made inside the RANG MAHAL" =================
SHOTS.push({ a: TL.F0, b: TL.G0 + .3, xf: .5, draw(c, u, t) {
  const k = easeIO(R_(t, TL.F0, TL.G0 + .3));
  RM.set(t, { lamp: 1, door: 1, env: 'lamplit', envK: .35, out: .4, outCol: '#7E92D0' }); RM.fill.intensity = 0;
  render3(c, RM.scene, cam3({ pos: [lerp(.1, .5, k), lerp(1.5, 1.35, k), lerp(4.2, 1.2, k)], at: [-.3, .7, -1], fov: 44 }), { exposure: 1.25, fx: lens(lerp(4.6, 2.4, k), 3, WARMG) });
  capBand(c, .5); corner(c, t);
  tag(c, t, TL.RANG - .1, TL.G0 + .2, 'RANG MAHAL · INSIDE NIDHIVAN', 540, 600, { align: 'center' });
} });

// ================= G · the offerings: "WATER. PAAN. SWEETS. A neem twig to brush with. BANGLES, and SINDOOR" =================
const CH = (x, y, z) => [RM.ch.position.x + x, y, RM.ch.position.z + z];
const near = (at, d, el, az) => [at[0] + Math.sin(az) * Math.cos(el) * d, at[1] + Math.sin(el) * d, at[2] + Math.cos(az) * Math.cos(el) * d];
const ITEMS = [
  [TL.G0, TL.PAAN - .1, CH(-.2, .47, -.12), .62, .4, -.35, 'JAL · A LOTA OF WATER'],
  [TL.PAAN - .1, TL.SWEETS - .1, CH(.12, .4, -.1), .5, .5, .5, 'PAAN'],
  [TL.SWEETS - .1, TL.NEEM - .15, CH(.05, .4, .14), .4, .55, -.3, 'MITHAI · LADDOO'],
  [TL.NEEM - .15, TL.BANGLES - .15, CH(-.22, .37, .14), .45, .75, .3, 'NEEM DATUN'],
  [TL.BANGLES - .15, TL.H0 + .2, CH(.25, .38, .04), .4, .6, .7, 'CHOODIYAN · SINDOOR'],
];
ITEMS.forEach(([a, b, at, d, el, az, label], i) => SHOTS.push({ a, b, draw(c, u, t) {
  const k = R_(t, a, b);
  RM.set(t, { lamp: 1, door: 1, env: 'lamplit', envK: 1 });
  const pos = near(at, d * (1 - .12 * k), el - .08 * k, az + (i % 2 ? .25 : -.25) * k);
  RM.fill.position.set(...near(at, .7, .9, az - .9)); RM.fill.color.set('#FFB872'); RM.fill.intensity = 1.1;
  render3(c, RM.scene, cam3({ pos, at, fov: 30 }), { exposure: 1.3, fx: lens(Math.hypot(pos[0] - at[0], pos[1] - at[1], pos[2] - at[2]), 9, WARMG) });
  capBand(c, .5); corner(c, t);
  tag(c, t, a + .05, b, label, 540, 1160, { align: 'center' });
} }));

// ================= H · locked: "Then the doors are LOCKED… from the OUTSIDE" =================
SHOTS.push({ a: TL.H0, b: TL.OUTSIDE - .05, draw(c, u, t) {
  const k = R_(t, TL.H0 + .3, TL.LOCKED + .35);
  RM.set(t, { lamp: 1, door: 1 - easeIO(k), out: 1.2, outCol: '#7E92D0', env: 'lamplit', envK: .3 }); RM.fill.intensity = 0;
  render3(c, RM.scene, cam3({ pos: [-.1, 1.5, -1.6], at: [0, 1.3, 2], fov: 50 }), { exposure: 1.2, fx: lens(3.4, 2, WARMG) });
  capBand(c, .5); corner(c, t);
} });
SHOTS.push({ a: TL.OUTSIDE - .05, b: TL.I0 + .3, draw(c, u, t) {
  GR.set('night', { az: 10, el: 12, fog: .05 }); GR.fill.position.set(.35, 1.35, .75); GR.fill.color.set('#AFC0FF'); GR.fill.intensity = 2; GR.fill.distance = 2; GR.fill.decay = 2;
  GR.lock.set(1 - easeIn(R_(t, TL.OUTSIDE - .05, TL.OUTSIDE + .25)));
  const L = GR.lock.getWorldPosition(V3()), pos = [L.x + .1, L.y + .03, L.z + .46];
  render3(c, GR.scene, cam3({ pos, at: [L.x, L.y - .03, L.z], fov: 30 }), { exposure: 1.4, fx: lens(.47, 12, { ...NIGHTG, max: 20, rays: moonRays(.5) }) });
  black(c, seg(t, TL.I0 - .5, TL.I0 + .1));
  capBand(c, .5); corner(c, t);
} });

// ================= I · the neighbour's window: "Neighbours shut their WINDOWS at the evening aarti. Some have BRICKED them up" =================
SHOTS.push({ a: TL.I0, b: TL.J0 + .3, xf: .3, draw(c, u, t) {
  const k = easeIO(R_(t, TL.I0, TL.J0 + .3)); HS.set();
  render3(c, HS.scene, cam3({ pos: [lerp(1.6, .5, k), lerp(1.4, 1.9, k), lerp(5.2, 3.2, k)], at: [0, 2.2, 0], fov: 40 }), { exposure: 1.3, fx: lens(lerp(5.4, 3.3, k), 3, NIGHTG) });
  capBand(c, .5); corner(c, t);
  tag(c, t, TL.BRICKED, TL.J0 + .2, 'FACING NIDHIVAN · BRICKED UP', 540, 600, { align: 'center' });
} });

// ================= J · the peek: "Because local stories warn: whoever stays to WATCH… loses their SIGHT. Or their MIND" =================
const PEEK = (() => {   // leaves in front of the lens, parting as it pushes in
  const n = 900, im = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), leafMat, n), r = lcg(55), base = [];
  for (let i = 0; i < n; i++) { const x = (r() - .5) * 3.4, y = .2 + r() * 2.6, z = 9.2 + r() * 3.2; base.push([x, y, z, r() * TAU, r() * TAU, r() * TAU, .18 + r() * .2]); }
  im.castShadow = false; BK.scene.add(im);
  const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler();
  return { set(open, on = 1) { im.visible = on > 0; base.forEach(([x, y, z, a, b, cc, s], i) => { const dx = x - 0, dy = y - 1.35, d = Math.hypot(dx, dy) + .001, push = open * Math.max(0, 1.2 - d) * .9;
    E.set(a, b, cc); Q.setFromEuler(E); M.compose(V3(x + dx / d * push, y + dy / d * push, z), Q, V3(s, s, s)); im.setMatrixAt(i, M); }); im.instanceMatrix.needsUpdate = true; } };
})();
SHOTS.push({ a: TL.J0, b: TL.SIGHT + .45, draw(c, u, t) {
  const k = R_(t, TL.J0, TL.SIGHT + .3);
  BK.set(t, { el: 20, az: 0, core: lerp(1.2, 3.2, k * k), spin: .3 }); PEEK.set(easeIO(k), 1);
  const pos = [0, 1.35, lerp(13.6, 9.6, easeIn(k))];
  render3(c, BK.scene, cam3({ pos, at: [0, 1.2, 0], fov: 40 }), { exposure: lerp(1.2, 1.9, k * k), fx: lens(lerp(1.2, 2.2, k), 30, { ...WARMG, max: 34, bloom: .2 }) });
  white(c, seg(t, TL.SIGHT - .35, TL.SIGHT + .05));
  capBand(c, .5); corner(c, t);
  sticker(c, t, TL.WARN - .2, TL.SIGHT - .3, 'LOCAL STORIES', 540, 620);
} });
SHOTS.push({ a: TL.SIGHT + .45, b: TL.K0 + .4, draw(c, u, t) {   // white fading to black; the ringing
  PEEK.set(0, 0);
  c.fillStyle = '#000'; c.fillRect(0, 0, W, H);
  white(c, 1 - seg(t, TL.SIGHT + .45, TL.MIND - .1));
  corner(c, t);
} });

// ================= K · dawn in the Rang Mahal: "At dawn, the priests say… the bed looks SLEPT IN. The WATER is gone. The PAAN, eaten" =================
SHOTS.push({ a: TL.K0, b: TL.SLEPT - .2, xf: .6, draw(c, u, t) {
  const k = R_(t, TL.K0, TL.SLEPT - .2);
  RM.set(t, { morning: 1, lamp: 0, door: easeIO(R_(t, TL.K0 + .2, TL.DAWN + 1)), out: 3, outCol: '#FFD8A8', hemi: .4, env: 'dawn', envK: .4 }); RM.fill.intensity = 0;
  render3(c, RM.scene, cam3({ pos: [.3, 1.55, lerp(4, 3, k)], at: [-.2, .9, -1], fov: 44 }), { exposure: 1.1, fx: lens(4, 2.5, DAWNG) });
  capBand(c, .5); corner(c, t);
  tag(c, t, TL.DAWN, TL.SLEPT - .2, 'MORNING · DOORS UNLOCKED', 540, 600, { align: 'center' });
} });
const MORN = [
  [TL.SLEPT - .2, TL.WATER2 - .15, [-.35, .68, -.75], 1.7, .7, .45, 'THE BED · SLEPT IN'],
  [TL.WATER2 - .15, TL.PAAN2 - .15, CH(-.14, .44, -.1), .75, .55, -.15, 'THE LOTA · EMPTY'],
  [TL.PAAN2 - .15, TL.L0 + .3, CH(.12, .4, -.1), .5, .5, .5, 'THE PAAN · EATEN'],
];
MORN.forEach(([a, b, at, d, el, az, label], i) => SHOTS.push({ a, b, draw(c, u, t) {
  const k = R_(t, a, b);
  RM.set(t, { morning: 1, lamp: 0, door: 1, out: 3, outCol: '#FFD8A8', hemi: .4, env: 'dawn', envK: .4 }); RM.fill.intensity = 0;
  const pos = near(at, d * (1 - .1 * k), el, az + .2 * k);
  if (i) { RM.fill.position.set(...near(at, .7, .9, az - .9)); RM.fill.color.set('#FFE0C0'); RM.fill.intensity = .8; }
  render3(c, RM.scene, cam3({ pos, at, fov: i ? 30 : 40 }), { exposure: 1.1, fx: lens(Math.hypot(pos[0] - at[0], pos[1] - at[1], pos[2] - at[2]), i ? 9 : 4, DAWNG) });
  capBand(c, .5); corner(c, t);
  tag(c, t, a + .05, b, label, 540, 1160, { align: 'center' });
} }));

// ================= L · the gate at dawn: "Are these stories TRUE? No one has ever FILMED it. No one is SUPPOSED to" =================
SHOTS.push({ a: TL.L0, b: TL.M0 + .4, xf: .4, draw(c, u, t) {
  const k = R_(t, TL.L0, TL.M0 + .4);
  GR.set('dawn', { az: 20, el: 10, rot: 1, fog: .035, sun: 3.4, hemi: .9 }); GR.lock.set(0); GR.fill.intensity = 0;
  render3(c, GR.scene, cam3({ pos: [lerp(.8, .3, k), 1.3, lerp(4.5, 2.4, k)], at: [0, 1.4, 0], fov: 42 }), { exposure: 1.2, fx: lens(lerp(4.6, 2.4, k), 3, { ...DAWNG, rays: sunRays(.7) }) });
  capBand(c, .5); corner(c, t);
  big(c, t, TL.TRUE - .05, TL.FILMED - .2, 'TRUE?', 700, { size: 220 });
} });

// ================= M · the Raas from above: "But the BHAGAVATAM tells a stranger story. On the night of the RAAS, KRISHNA became as many as there were GOPIS" =================
SHOTS.push({ a: TL.M0, b: TL.N0 + .4, xf: .6, draw(c, u, t) {
  const k = easeIO(R_(t, TL.M0, TL.N0 + .4));
  BK.set(t, { el: 30, az: 20, core: 1, spin: .22, n: 1 + 11 * clamp((t - TL.MANY + .1) / 1.6) });
  const w = BK.pairs[0].getWorldPosition(V3()), m = easeIO(R_(t, TL.MANY - .6, TL.N0 + .4)), h = lerp(1.6, 17, m);
  const pos = [lerp(w.x * 1.9, 0, m), h, lerp(w.z * 1.9, .01, m)], at = [lerp(w.x, 0, m), lerp(1.1, 0, m), lerp(w.z, 0, m)];
  render3(c, BK.scene, cam3({ pos, at, fov: 46 }), { exposure: 1.25, fx: lens(Math.hypot(pos[0] - at[0], pos[1] - at[1], pos[2] - at[2]), 3, { ...NIGHTG, hi: '#FFC890' }) });
  capBand(c, .5); corner(c, t);
  tag(c, t, TL.MANY - .1, TL.N0 + .3, '10.33.19 · AS MANY AS THE GOPIS', 540, 600, { align: 'center', col: '#E8B030' });
} });

// ================= N · Vraj never noticed: "And all of VRAJ never noticed. Each man thought his wife was right BESIDE him" =================
SHOTS.push({ a: TL.N0, b: TL.O0 + .4, xf: .5, draw(c, u, t) {
  const k = R_(t, TL.N0, TL.O0 + .4);
  BK.set(t, { el: 16, az: 330, core: 1.2, spin: .22 });
  render3(c, BK.scene, cam3({ pos: [lerp(-14, -11, k), .9, lerp(16, 13, k)], at: [0, 1.1, 0], fov: 34 }), { exposure: 1.3, fx: lens(20, 3, { ...NIGHTG, hi: '#FFC890' }) });
  capBand(c, .5); corner(c, t);
  tag(c, t, TL.BESIDE - .2, TL.O0 + .3, '10.33.37 · BY HIS MAYA', 540, 600, { align: 'center', col: '#E8B030' });
} });

// ================= O · Radha-Krishna: "You were never meant to SEE the Raas. Whoever simply HEARS it with faith… is freed from the heart's DISEASE" =================
SHOTS.push({ a: TL.O0, b: TL.P0 + .4, xf: .6, draw(c, u, t) {
  const k = R_(t, TL.O0, TL.P0 + .4);
  BK.set(t, { el: 22, az: 40, core: 1.4, spin: 0, n: 1 });
  const P = BK.pairs[0], w = P.getWorldPosition(V3()), a = lerp(-.5, .35, k), r = lerp(3.2, 2.2, easeIO(k));
  const dir = V3(-w.x, 0, -w.z).normalize(), side = V3(dir.z, 0, -dir.x);
  const pos = w.clone().addScaledVector(dir, Math.cos(a) * r).addScaledVector(side, Math.sin(a) * r);
  render3(c, BK.scene, cam3({ pos: [pos.x, lerp(1.1, 1.45, k), pos.z], at: [w.x, lerp(1.2, 1.45, k), w.z], fov: 34 }), { exposure: 1.3, fx: lens(r, 7, { ...WARMG, hi: '#FFC890', sh: '#14243E' }) });
  capBand(c, .5); corner(c, t);
  tag(c, t, TL.HEARS, TL.P0 + .3, '10.33.39 · WHOEVER HEARS IT', 540, 600, { align: 'center', col: '#E8B030' });
} });

// ================= P · would you stay? the lock under the moon =================
SHOTS.push({ a: TL.P0, b: TL.CARD, xf: .5, draw(c, u, t) {
  const k = R_(t, TL.P0, TL.CARD);
  GR.set('night', { az: 4, el: 8, fog: .05, moonSize: 10 }); GR.lock.set(0); GR.fill.position.set(.35, 1.35, .75); GR.fill.color.set('#AFC0FF'); GR.fill.intensity = 2.2; GR.fill.distance = 2; GR.fill.decay = 2;
  const L = GR.lock.getWorldPosition(V3()), pos = [L.x + lerp(.5, .1, k), L.y + lerp(.25, .05, k), L.z + lerp(1.6, .5, easeIO(k))];
  render3(c, GR.scene, cam3({ pos, at: [L.x, L.y - .03, L.z], fov: 32 }), { exposure: 1.45, fx: lens(Math.hypot(pos[0] - L.x, pos[1] - L.y, pos[2] - L.z), 10, { ...NIGHTG, max: 20, rays: moonRays(.8) }) });
  capBand(c, .55);
  big(c, t, TL.YES - .1, TL.CARD, 'YES  or  NO?', 700, { size: 140 });
  black(c, seg(t, TL.CARD - .35, TL.CARD) * .6);
} });

// ================= the card =================
SHOTS.push({ a: TL.CARD, b: TL.END + 1, draw(c, u, t) {
  rkCardCine(c, u, t, { title: 'MEET OUR GODS', line: 'Picture books of our gods, for kids', price: 'The Navadurga Set is out now', note: 'Link in bio' });
} });
