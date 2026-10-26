// aarti.js: "You've been doing AARTI wrong" (ad 54) in the 3D style: a lamp-lit sanctum, a black stone Vishnu murti, the
// camera as the devotee holding the aarti lamp. Most of us wave it round and round; the temple way gives the lamp a
// path: four circles at the feet, two at the navel, three at the face, seven round the whole body (the 4-2-3-7 of the
// temple manuals; many homes do the face once). The flame: ghee or camphor, an odd number of wicks (Hari Bhakti Vilasa
// 8.298). And the twist: forgot the mantras, got the steps wrong? Shiva tells Parvati in the Skanda Purana that the
// aarti makes the puja complete (HBV 8.302). The parent line, the ask (face: 1 or 3?), the card. STORYBOARD.md has the
// plan and the sources; the timeline (from the voice) is aarti_tl.js, the set, murti, lamp and trails aarti_props.js.
const W3 = world3(), SC = W3.scene, SAN = sanctum3(SC), MUR = murti3(SC), LAMP = aartiLamp3(SC), RINGS = rings3(SC), SCR = scribble3(SC);
const ORDER = ['feet', 'navel', 'face', 'whole'];

// ---------- the lamp's path through the whole reel (so it never jumps between shots) ----------
const circling = id => { const [t0, d] = TL[id], n = PARTS[id].n; return [t0, t0 + n * d, t => { const k = clamp((t - t0) / d, 0, n - 1e-4); return circleAt(id, Math.floor(k), k % 1); }]; };
const FACEY = PARTS.face.y, REST = [RX + .2, FACEY - .16, -.3];
const SEGS = [
  [-1, TL.B0 + .1, t => [RX, FACEY - .2 + .04 * Math.sin(t * 3.4), -.24 + .05 * Math.cos(t * 3.4)]],
  [TL.B0 + .3, TL.C0 + .3, t => SCRIB.pt(seg(t, TL.B0 + .3, TL.C0 + .3) * SCRIB.len * TAU / 2)],
  circling('feet'), circling('navel'), circling('face'), circling('whole'),
  [TL.H0 + .35, TL.I0 + .2, () => REST],
  [TL.I0 + .5, TL.J0 + .3, t => SCRIB.pt(seg(t, TL.I0 + .5, TL.J0 + .3) * SCRIB.len * TAU / 2 * .6 + 3)],
  [TL.SHIVA, TL.L0 + .4, t => circleAt('face', 0, (t - TL.SHIVA) * .55 % 1)],
  [TL.L0 + .9, 999, t => circleAt('face', 2, (t - TL.L0) * .8 % 1)],
];
function lampAt(t) {
  for (let i = 0; i < SEGS.length; i++) {
    const [a, b, f] = SEGS[i];
    if (t >= a && t <= b) return f(t);
    const nx = SEGS[i + 1];
    if (nx && t > b && t < nx[0]) { const k = easeIO(seg(t, b, nx[0])), p = f(b), q = nx[2](nx[0]); return p.map((v, j) => lerp(v, q[j], k) + (j === 0 ? Math.sin(k * Math.PI) * .12 : 0)); }
  }
  return SEGS[SEGS.length - 1][2](t);
}
// the circles drawn so far for a part: ring k's progress at t
const ringProg = (id, k, t) => { const [t0, d] = TL[id]; return seg(t, t0 + k * d, t0 + (k + 1) * d); };
const circlesDone = (id, t) => { const [t0, d] = TL[id]; return clamp(Math.floor((t - t0 + .03) / d), 0, PARTS[id].n); };
function showRings(t, o = {}) {
  for (const id of ORDER) RINGS[id].forEach((r, k) => {
    const a = typeof o.a === 'function' ? o.a(id, k) : o.a ?? .9;
    r.set(o.full ? 1 : ringProg(id, k, t), a);
  });
}
const hideRings = () => { for (const id of ORDER) RINGS[id].forEach(r => r.set(0)); };
const lit = (t, o = {}) => {
  SAN.set(t, o.lamps ?? 1);
  LAMP.place(lampAt(t), t, { wicks: o.wicks, power: o.power, on: o.on });
  MUR.chakra.rotation.x = t * .6;
};
const night = (o = {}) => W3.mood('night', { hemi: o.hemi ?? .22, exposure: o.exposure ?? 1.0 });

// a part's screen circle (centre and radius in px) on this frame's camera
function ringScreen(id, k = 0) {
  const P = PARTS[id], c = toScreen3([RX + k * RSTEP, P.y, 0]), e = toScreen3([RX + k * RSTEP, P.y, -(P.rz ?? P.r) * (1 + k * RGROW)]), top = toScreen3([RX + k * RSTEP, P.y + (P.ry ?? P.r), 0]);
  return { x: c[0], y: c[1], rx: Math.abs(e[0] - c[0]), ry: Math.abs(top[1] - c[1]), z: c[2] };
}
// the count beside a part's circles: o.side 1 = screen right (default), -1 left; o.label under it
function partCount(c, id, txt, t, at, o = {}) {
  if (t < at) return;
  const s = ringScreen(id, PARTS[id].n - 1); if (s.z > 1) return;
  const size = o.size || 96, side = o.side ?? 1;
  let x = s.x + side * (s.rx + (o.gap ?? 40) + size * .4), y = s.y + (o.dy ?? 0);
  x = clamp(x, 170, 880); y = clamp(y, 470, 1460);
  text(c, txt, x, y, `700 ${size}px Cinzel`, o.col || '#FFE2A0', { pop: o.noPop ? null : t - at, alpha: o.alpha ?? 1, glow: ['rgba(10,6,4,.95)', 26] });
  if (o.label) text(c, o.label, x, y + size * .62, `700 ${Math.round(size * .34)}px Cinzel`, o.lcol || '#F4C46A', { pop: o.noPop ? null : t - at - .08, alpha: o.alpha ?? 1, glow: ['rgba(10,6,4,.95)', 16], spacing: 3 });
}

const CAPY = 1300;
// a soft dark band under the captions, so they read over the yellow silk and the lamp light
POST.push((c, t) => { if (t < TL.CARD) band(c, 1120, 1480, .42); });
VO.caps.forEach((k, i) => say(i ? k.a : -1, k.b, k.text, { at: i ? k.at : k.at.map(() => -1), y: CAPY }));

// ================= A · the hook: his face in the lamp's light =================
SHOTS.push({ a: 0, b: TL.B0 + .4, draw(c, u, t) {
  hideRings(); SCR.set(0); const ex = night(); lit(t);
  const k = u / (TL.B0 + .4);
  render3(c, SC, cam3({ pos: [lerp(3.1, 2.9, k), lerp(1.8, 1.82, k), lerp(-.5, -.45, k)], at: [0, 1.62, 0], fov: 38 }), { exposure: ex });
  tag(c, 'AARTI · THE TEMPLE WAY', 1462, t);
} });

// ================= B · most of us: round and round, anywhere =================
SHOTS.push({ a: TL.B0, b: TL.C0 + .4, xf: .4, draw(c, u, t) {
  hideRings(); const ex = night(); lit(t);
  SCR.set(seg(t, TL.B0 + .3, TL.C0 + .3), .9);
  const k = easeIO(u / (TL.C0 + .4 - TL.B0));
  render3(c, SC, cam3({ pos: [lerp(3.3, 3.7, k), lerp(1.7, 1.6, k), lerp(-.9, -.7, k)], at: [0, PED + .98, 0], fov: 46 }), { exposure: ex });
} });

// ================= C · but in temples the lamp follows a path, a number for each part =================
SHOTS.push({ a: TL.C0, b: TL.D0 + .4, xf: .4, draw(c, u, t) {
  hideRings(); const ex = night(); lit(t);
  SCR.set(1, .9 * (1 - seg(t, TL.TEMPLES - .2, TL.PATH)));
  // the four places, faint: one ghost circle each
  const g = seg(t, TL.PATH - .1, TL.PATH + .4);
  ORDER.forEach((id, i) => RINGS[id][0].set(1, .3 * g * seg(t, TL.PATH - .1 + i * .12, TL.PATH + .3 + i * .12)));
  const k = easeIO(u / (TL.D0 + .4 - TL.C0));
  render3(c, SC, cam3({ pos: [lerp(3.9, 4.1, k), 1.5, lerp(-.45, -.35, k)], at: [0, PED + .98, 0], fov: 46 }), { exposure: ex });
  ORDER.forEach((id, i) => partCount(c, id, '?', t, TL.NUMBER - .1 + i * .14, { size: 76, col: '#FF9A6A', side: id === 'whole' ? -1 : 1, gap: id === 'whole' ? 10 : 40 }));
} });

// ================= D–G · each part: the circles land, the count climbs =================
const partShot = (id, a, b, cam, o = {}) => SHOTS.push({ a, b, xf: .4, draw(c, u, t) {
  SCR.set(0); const ex = night(); lit(t);
  showRings(t, { a: (pid) => pid === id ? 1 : .45 });
  const k = easeIO(u / (b - a));
  render3(c, SC, cam3(cam(k)), { exposure: ex });
  const n = circlesDone(id, t);
  if (n) partCount(c, id, String(n), t, TL[id][0] + n * TL[id][1] - .03, { size: o.size || 110, label: o.label, side: o.side, gap: o.gap });
} });
partShot('feet', TL.D0, TL.E0 + .4, k => ({ pos: [lerp(3.0, 2.8, k), lerp(1.2, 1.12, k), lerp(-.8, -.65, k)], at: [RX - .05, PED - .04, .02], fov: 30 }), { label: 'FEET' });
partShot('navel', TL.E0, TL.F0 + .4, k => ({ pos: [lerp(2.5, 2.3, k), PED + 1.08, lerp(-.65, -.55, k)], at: [RX - .05, PED + .9, .02], fov: 32 }), { label: 'NAVEL' });
partShot('face', TL.F0, TL.G0 + .4, k => ({ pos: [lerp(2.7, 2.5, k), FACEY + .02, lerp(-.6, -.52, k)], at: [RX - .05, FACEY - .1, .02], fov: 30 }), { label: 'FACE' });
partShot('whole', TL.G0, TL.H0 + .4, k => ({ pos: [lerp(4.0, 4.4, k), lerp(1.55, 1.5, k), lerp(-1.0, -.8, k)], at: [0, PED + .98, 0], fov: 46 }), { label: 'WHOLE BODY', side: -1, gap: 10, size: 120 });

// ================= H · the flame: ghee or camphor, an odd number of wicks =================
SHOTS.push({ a: TL.H0, b: TL.I0 + .4, xf: .4, draw(c, u, t) {
  SCR.set(0); showRings(t, { a: .35 });
  const ex = night({ hemi: .26 });
  const wicks = clamp(Math.floor(lerp(1, 6, seg(t, TL.FLAME - .2, TL.ODD - .1))), 1, 5);
  lit(t, { wicks, power: 4 });
  const p = lampAt(t), k = easeIO(u / (TL.I0 + .4 - TL.H0));
  render3(c, SC, cam3({ pos: [p[0] + lerp(.85, .72, k), p[1] + lerp(.12, .08, k), lerp(-.3, -.27, k)], at: [p[0] - .14, p[1] + .02, -.22], fov: 42 }), { exposure: ex });
  // the odd numbers, under the flame
  const a = seg(t, TL.ODD - .15, TL.ODD + .2);
  band(c, 980, 1200, .55 * a);
  if (a > 0) ['3', '5', '7'].forEach((n, i) => text(c, n, 360 + i * 160, 1095, '700 120px Cinzel', '#FFE2A0', { pop: t - TL.ODD - i * .16, glow: ['rgba(10,6,4,.95)', 24] }));
} });

// ================= I · forgot the mantras? got the steps wrong? =================
SHOTS.push({ a: TL.I0, b: TL.J0 + .4, xf: .4, draw(c, u, t) {
  hideRings(); const ex = night({ hemi: .28 }); lit(t);
  SCR.set(seg(t, TL.I0 + .5, TL.J0 + .3) * .6, .85);
  const k = easeIO(u / (TL.J0 + .4 - TL.I0));
  render3(c, SC, cam3({ pos: [lerp(3.2, 3.9, k), lerp(1.7, 1.6, k), lerp(.9, .6, k)], at: [0, PED + 1.0, 0], fov: 46, roll: lerp(-.03, .02, k) }), { exposure: ex });
} });

// ================= J · Shiva tells Parvati: do the aarti, and the puja is complete =================
const VERSE = ['मन्त्रहीनं क्रियाहीनं', 'यत्कृतं पूजनं हरेः ।', 'सर्वं सम्पूर्णतामेति', 'कृते नीराजने शिवे ॥'];
SHOTS.push({ a: TL.J0, b: TL.K0 + .4, xf: .4, draw(c, u, t) {
  const done = seg(t, TL.COMPLETE - .25, TL.COMPLETE + .35);
  const ex = night({ hemi: .32 + .1 * done }); lit(t, { power: 5 + 2 * done });
  SCR.set(.6, .85 * (1 - seg(t, TL.SKANDA, TL.SHIVA + .3)));
  // every circle lights at once, in order, on COMPLETE
  showRings(t, { full: true, a: (id, k) => .95 * seg(t, TL.COMPLETE - .3 + (ORDER.indexOf(id) * 3 + k) * .03, TL.COMPLETE + (ORDER.indexOf(id) * 3 + k) * .03) });
  const k = easeIO(u / (TL.K0 + .4 - TL.J0));
  render3(c, SC, cam3({ pos: [lerp(4.4, 3.9, k), 1.5, lerp(-.2, -.3, k)], at: [0, PED + 1.0, 0], fov: 46 }), { exposure: ex * (1 + .15 * done) });
  const a = seg(t, TL.SKANDA - .2, TL.SKANDA + .3) * (1 - seg(t, TL.K0, TL.K0 + .35));
  band(c, 420, 900, .72 * a);
  VERSE.forEach((l, i) => text(c, l, 520, 500 + i * 76 + (i > 1 ? 14 : 0), '58px "Tiro Devanagari Sanskrit"', '#FFE2A0', { alpha: a, glow: ['rgba(255,170,60,.8)', 22], maxW: 880 }));
  text(c, '— Skanda Purana, in the Hari Bhakti Vilasa 8.302', 520, 836, '30px Marcellus', '#CFC2B0', { alpha: a * .9, maxW: 880 });
  if (done > 0) glow(c, 540, 760, 900, '#FFB050', .18 * done * (1 - seg(t, TL.COMPLETE + .4, TL.COMPLETE + 1.6)));
} });

// ================= K · tonight let your child hold the lamp and count: 4, 2, 3, 7 =================
const SUMMARY = [['feet', '4', 'FEET', 'N4', 1], ['navel', '2', 'NAVEL', 'N2', 1], ['face', '3', 'FACE', 'N3', 1], ['whole', '7', 'WHOLE BODY', 'N7', -1]];
SHOTS.push({ a: TL.K0, b: TL.L0 + .4, xf: .4, draw(c, u, t) {
  SCR.set(0); const ex = night(); lit(t);
  showRings(t, { full: true, a: (id) => .55 + .45 * seg(t, TL[SUMMARY.find(s => s[0] === id)[3]] - .1, TL[SUMMARY.find(s => s[0] === id)[3]] + .15) });
  const k = easeIO(u / (TL.L0 + .4 - TL.K0));
  render3(c, SC, cam3({ pos: [lerp(4.0, 4.15, k), 1.5, lerp(-.35, -.25, k)], at: [0, PED + .98, 0], fov: 46 }), { exposure: ex });
  for (const [id, n, lab, w, side] of SUMMARY) partCount(c, id, n, t, TL[w] - .05, { size: 92, label: lab, side, gap: side < 0 ? 10 : 40 });
} });

// ================= L · the ask: the face, once or three times? =================
SHOTS.push({ a: TL.L0, b: TL.CARD, xf: .4, draw(c, u, t) {
  SCR.set(0); const ex = night(); lit(t);
  showRings(t, { full: true, a: (id, k) => id === 'face' ? (k === 0 ? 1 : .55 + .45 * Math.max(0, Math.sin(t * 5))) : .35 });
  const k = easeIO(u / (TL.CARD - TL.L0));
  render3(c, SC, cam3({ pos: [lerp(2.4, 2.1, k), FACEY - .05, lerp(-.55, -.48, k)], at: [.05, FACEY - .1, 0], fov: 28 }), { exposure: ex });
  // once, or three times? over the chest, clear of the circling lamp
  band(c, 960, 1200, .5 * seg(t, TL.ONCE - .3, TL.ONCE));
  if (t > TL.ONCE - .1) text(c, '1', 400, 1085, '700 130px Cinzel', '#FFF3DC', { pop: t - TL.ONCE + .1, glow: ['rgba(10,6,4,.95)', 26] });
  if (t > TL.YOUR) text(c, 'or', 540, 1095, '700 64px Cinzel', '#F4C46A', { pop: t - TL.YOUR, glow: ['rgba(10,6,4,.95)', 20] });
  if (t > TL.C3 - .1) text(c, '3', 680, 1085, '700 130px Cinzel', '#FFE2A0', { pop: t - TL.C3 + .1, glow: ['rgba(10,6,4,.95)', 26] });
} });

// ================= M · the card =================
SHOTS.push({ a: TL.CARD, b: TL.END + 1, draw(c, u, t) {
  rkCardCine(c, u, t, { title: 'MEET OUR GODS', line: 'Picture books of our gods, for kids', price: 'Books 1–3 · set of 3 for ₹500' });
} });
