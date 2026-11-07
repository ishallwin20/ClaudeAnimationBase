// ninth.js: "Vishnu's 9th avatar: is it BALARAM? Or BUDDHA?" (ad 81), in the 3D style.
// A dark stone hall, ten seats round a pool, one per avatar. Every list agrees on eight (Matsya … Ram, and Kalki); the
// fight is over two places and three names. The Varaha Purana (4.2) seats Krishna and Buddha; Jaydev's Geet Govind
// Balaram and Buddha, Krishna being the one who takes all ten forms; Vedanta Desika's Dashavatara Stotra Balaram and
// Krishna; the Mahabharata's list (Shanti 340) has neither, and a swan; the Bhagavata (1.3.23–24) counts all three, 19th,
// 20th, 21st, and says the avatars are countless, like streams from an endless lake (1.3.26). The board, the ask, the card.
// STORYBOARD.md has the plan and the sources; the timeline (from the voice) is ninth_tl.js, the set ninth_sets.js.
LOOK.bloom = .12;   // matte (owner, 30 Oct): cine.js's own bloom low, no fx bloom
const CAPY = 1330;
const capBand = (c, a = .5) => band(c, 1200, 1490, a);
VO.caps.forEach((k, i) => say(i ? k.a : -1, k.b, k.text, { at: i ? k.at : k.at.map(() => -1), y: k.y ?? (k.id === 'ask' ? 1380 : k.id === 'hook' ? 1385 : CAPY) }));

const lens = (focus, ap = 5, o = {}) => ({ dof: { focus, aperture: ap, max: 12, nearK: .6 }, grade: { contrast: o.contrast ?? 1.07, sat: o.sat ?? 1.05, temp: o.temp ?? .04, lift: 0, gamma: 1, gain: 1 } });
const dist = (p) => CAM3.position.distanceTo(V3(...p));
const at3 = (k, a, b) => a.map((v, i) => lerp(v, b[i], k));
const add3 = (a, b) => a.map((v, i) => v + b[i]);
const S = HALL.S;
S.environment = null;
const ENV = () => { env3(S, 'lamplit', { k: .35, rot: 1.2 }); };

// ---------- where the three candidates are ----------
const T9 = [Math.cos(.314), 0, Math.sin(.314)];                       // seat 9's tangent (screen right, seen from the pool)
const ABOVE9 = HALL.seatPos(9, HALL.TOP + .42);
const SPOT = {
  hookL: add3(ABOVE9, T9.map(v => v * -.42)), hookR: add3(ABOVE9, T9.map(v => v * .42)),
  hov: { krishna: [-.6, 1.5, .2], balaram: [0, 1.5, .2], buddha: [.6, 1.5, .2] },
  sunk: { krishna: [-.5, -1.2, .1], balaram: [0, -1.2, .1], buddha: [.5, -1.2, .1] },
  s8: HALL.seatPos(8, HALL.TOP + .02), s9: HALL.seatPos(9, HALL.TOP + .02), sky: [0, 5.6, 0], skyLow: [0, 4.1, 0],
  o19: HALL.pos22(19, HALL.TOP22 + .02), o20: HALL.pos22(20, HALL.TOP22 + .02), o21: HALL.pos22(21, HALL.TOP22 + .02),
};
// keys: [[t, place, dur], …]: from t the candidate travels to place over dur (an arc when it changes height a little)
const KEYS = {
  balaram: [[-9, SPOT.hookL], [TL.C0 + .3, SPOT.sunk.balaram, 1.0], [TL.BAL1 - .25, SPOT.hov.balaram], [TL.BUD2 + .35, SPOT.sunk.balaram, 1.1], [TL.BAL3 - .3, SPOT.s8, 1.0],
    [TL.NEITHER - .1, SPOT.sunk.balaram, 1.1], [TL.BAL5 - .35, SPOT.o19, 1.0], [TL.K0, SPOT.hov.balaram, 1.0]],
  buddha: [[-9, SPOT.hookR], [TL.C0 + .3, SPOT.sunk.buddha, 1.0], [TL.BUD1 - .25, SPOT.hov.buddha], [TL.BUD2 - .3, SPOT.s9, 1.0], [TL.KRI4 - .9, SPOT.sunk.buddha, 1.0],
    [TL.BUD5 - .35, SPOT.o21, 1.0], [TL.K0, SPOT.hov.buddha, 1.0]],
  krishna: [[-9, SPOT.sunk.krishna], [TL.KRI1 - .25, SPOT.hov.krishna], [TL.KRI2 - .3, SPOT.s8, 1.0], [TL.PICKS2 - .4, SPOT.sky, 1.1], [TL.KRI3 - .5, SPOT.skyLow, 1.2], [TL.KRI4 - .2, SPOT.s9, 1.2],
    [TL.KRI5 - .35, SPOT.o20, 1.0], [TL.K0, SPOT.hov.krishna, 1.0]],
};
function place(name, t) {
  const K = KEYS[name]; let i = 0; while (i + 1 < K.length && t >= K[i + 1][0]) i++;
  const [t0, to, dur = .8] = K[i], from = i ? K[i - 1][1] : to, k = easeIO(seg(t, t0, t0 + dur));
  const p = at3(k, from, to), lift = Math.abs(to[1] - from[1]) < 1.2 ? .45 * Math.sin(Math.PI * k) * Math.min(1, Math.hypot(to[0] - from[0], to[2] - from[2]) / 1.5) : 0;
  return [p[0], p[1] + lift, p[2]];
}
// when a candidate is named or seated: a quick swell
const PULSE = { balaram: [TL.BAL0, TL.BAL1, TL.BAL3, TL.BAL4, TL.BAL5], buddha: [TL.BUD0, TL.BUD1, TL.BUD2, TL.BUD3, TL.BUD5], krishna: [TL.KRI1, TL.KRI2, TL.KRI3, TL.KRI4, TL.KRI5] };
const pulse = (name, t) => PULSE[name].reduce((s, a) => s + (t > a - .05 ? Math.exp(-(t - a + .05) * 5) * .12 : 0), 0);
const FIGHT = (t) => {   // the hook's two candidates lunge at each other twice
  const hit = (a) => { const u = t - (a - .32); return u < 0 || u > .9 ? 0 : u < .32 ? easeIn(u / .32) : 1 - easeOut((u - .32) / .58); };
  return Math.max(hit(TL.FIGHT), hit(TL.BREAK + .25));
};
function candidates(t, o = {}) {
  for (const n of ['krishna', 'balaram', 'buddha']) {
    const e = HALL.cand[n], p = place(n, t);
    if (n !== 'krishna') { const f = FIGHT(t) * (t < TL.C0 + .3 ? 1 : 0), s = n === 'balaram' ? 1 : -1; p[0] += T9[0] * s * .2 * f; p[2] += T9[2] * s * .2 * f; }
    e.position.set(...p); e.visible = p[1] > -1.15; e.children[0].visible = p[1] < 3;
    const toCam = Math.atan2(CAM3.position.x - p[0], CAM3.position.z - p[2]);
    e.rotation.set(0, toCam + (n === 'krishna' ? .25 : 0) + .1 * Math.sin(t * .6 + p[0]), 0);
    e.scale.setScalar((o.scale ?? 1) * EK * (1 + pulse(n, t)));
  }
}
// what sits in seats 8 and 9 at t (for their lights)
const occupied = (t, i) => ['krishna', 'balaram', 'buddha'].some(n => { const p = place(n, t), s = i === 8 ? SPOT.s8 : SPOT.s9; return Math.hypot(p[0] - s[0], p[1] - s[1], p[2] - s[2]) < .25; });
// the seats' light: 1–7 and 10 on (after the eight light up), 8 and 9 by who sits there
function lights(t, o = {}) {
  const lit = {}, base = o.base ?? .85;
  for (let i = 1; i <= 10; i++) lit[i] = base;
  for (const i of [8, 9]) lit[i] = occupied(t, i) ? 1 : (o.empty ?? .28);
  return lit;
}
const EIGHT = [1, 2, 3, 4, 5, 6, 7, 10], eightAt = (j) => TL.AGREES + .05 + j * .2;

// 2D: a name over a world point
function nameAt(c, txt, p, t, at, o = {}) {
  if (t < at) return; const [x, y, z] = toScreen3(p); if (z > 1) return;
  const a = (o.alpha ?? 1) * seg(t, at, at + .25) * (1 - seg(t, o.out ?? 1e9, (o.out ?? 1e9) + .3)); if (a <= 0) return;
  text(c, txt, clamp(x, 150, 930), y, `700 ${o.size || 40}px Cinzel`, o.col || '#FFE2A0', { pop: t - at, alpha: a, glow: ['rgba(6,5,10,.95)', 18], spacing: 3, maxW: o.maxW || 360 });
  if (o.sub) text(c, o.sub, clamp(x, 150, 930), y + (o.size || 40) * .85, 'italic 28px Marcellus', '#FFF3DC', { alpha: a, glow: ['rgba(6,5,10,.95)', 12], maxW: 360 });
}
// a list's verdict at the top: its name, then the two seats it fills
function verdict(c, t, at, out, name, sub, picks, verse) {
  const a = seg(t, at, at + .35) * (1 - seg(t, out, out + .35)); if (a <= 0) return;
  band(c, 392, verse ? 700 : 640, .66 * a);
  text(c, name, 540, 446, '700 52px Cinzel', '#F4C46A', { pop: t - at, alpha: a, spacing: 4, glow: ['rgba(244,170,60,.35)', 22], maxW: 900 });
  if (sub) text(c, sub, 540, 496, 'italic 30px Marcellus', '#E8DCC4', { alpha: a, glow: ['rgba(6,5,10,.9)', 12], maxW: 900 });
  picks.forEach(([n, who, at2, col], i) => {
    if (t < at2) return; const x = 540 + (i - (picks.length - 1) / 2) * (picks.length > 2 ? 310 : 400), k = t - at2;
    text(c, `${n} · ${who}`, x, 568, `700 ${picks.length > 2 ? 36 : 42}px Cinzel`, col || '#FFF3DC', { pop: k, alpha: a, spacing: 2, glow: ['rgba(6,5,10,.95)', 16], maxW: picks.length > 2 ? 300 : 390 });
  });
  if (verse && t > verse[1]) text(c, verse[0], 540, 640, '44px "Tiro Devanagari Sanskrit"', '#FFE9C0', { alpha: a * seg(t, verse[1], verse[1] + .4) * (1 - seg(t, verse[2] ?? 1e9, (verse[2] ?? 1e9) + .3)), glow: ['rgba(6,5,10,.95)', 16], maxW: 920 });
}
const flashK = (c, t, at, col = '255,220,160', k = .45, rate = 5) => { const f = t > at ? Math.exp(-(t - at) * rate) : 0; if (f > .01) { c.save(); c.fillStyle = `rgba(${col},${k * f})`; c.fillRect(0, 0, W, H); c.restore(); } };
const KRI_C = '#9FE0C8', BAL_C = '#F4D9A0', BUD_C = '#FFD27A';

// ================= A · the hook: seat 9, the plough and the Buddha hovering over it =================
const camHook = (k) => { const n = [Math.sin(.314), 0, -Math.cos(.314)], d = lerp(4.25, 3.9, k), P = HALL.seatPos(9); return cam3({ pos: [P[0] - n[0] * d, 1.98, P[2] - n[2] * d], at: [P[0], 1.8, P[2]], fov: 44 }); };
SHOTS.push({ a: 0, b: TL.C0 + .3, draw(c, u, t) {
  ENV();
  const lit = {}; for (let i = 1; i <= 10; i++) lit[i] = i === 9 ? 1 : .0;
  const rise = {}; for (const i of EIGHT) rise[i] = 0;
  const f = FIGHT(t), hit = f > .97 ? 1 : 0;
  const sp = t > TL.BREAK ? TL.BREAK + .25 : TL.FIGHT;
  HALL.set(t, { lit, rise, sparks: [...add3(ABOVE9, [0, .25, 0]), sp] });
  const cam = camHook(easeIO(u / (TL.C0 + .3))), sh = Math.max(0, 1 - (t - TL.FIGHT) * 3) * (t > TL.FIGHT ? 1 : 0) + Math.max(0, 1 - (t - TL.BREAK - .25) * 3) * (t > TL.BREAK + .25 ? 1 : 0);
  if (sh > 0) { cam.position.x += .03 * sh * Math.sin(t * 90); cam.position.y += .02 * sh * Math.cos(t * 77); }
  candidates(t);
  render3(c, S, CAM3, { exposure: 1.15, fx: lens(dist(ABOVE9), 4) });
  flashK(c, t, TL.FIGHT, '255,200,130', .18, 8); flashK(c, t, TL.BREAK + .25, '255,200,130', .18, 8);
  // the names over them, "?" between
  const lab = 1 - seg(t, TL.ASK0 - .3, TL.ASK0);
  nameAt(c, 'BALARAM', add3(SPOT.hookL, [0, -.06, .25]), t, -1, { size: 46, col: BAL_C, alpha: lab });
  nameAt(c, 'BUDDHA', add3(SPOT.hookR, [0, -.06, .25]), t, -1, { size: 46, col: BUD_C, alpha: lab });
  band(c, 380, 560, .5 * lab);
  text(c, 'VISHNU’S', 540, 432, '700 40px Cinzel', '#FFF3DC', { alpha: lab, spacing: 8, glow: ['rgba(6,5,10,.95)', 16] });
  text(c, '9th AVATAR', 540, 500, '700 80px Cinzel', '#F4C46A', { alpha: lab, spacing: 4, glow: ['rgba(244,170,60,.4)', 26] });
  capBand(c);
} });

// ================= C · every list agrees on eight: the whole ring, seats lighting one by one =================
SHOTS.push({ a: TL.C0, b: TL.D0 + .3, xf: .3, draw(c, u, t) {
  ENV();
  const lit = {}, rise = {};
  EIGHT.forEach((i, j) => { const k = seg(t, eightAt(j), eightAt(j) + .35); lit[i] = .12 + .88 * k; rise[i] = k; });
  lit[8] = lit[9] = .3 * seg(t, TL.EIGHT, TL.TEN);
  HALL.set(t, { lit, rise });
  const k = easeIO(seg(t, TL.C0, TL.C0 + 1.6)), H = HALL.seatPos(9);
  const n = [Math.sin(.314), 0, -Math.cos(.314)], p0 = [H[0] - n[0] * 3.9, 1.95, H[2] - n[2] * 3.9], p1 = [0, 15.0, 12.6];
  cam3({ pos: at3(k, p0, p1), at: at3(k, [H[0], 1.7, H[2]], [0, .1, -.6]), fov: lerp(44, 42, k) });
  candidates(t);
  render3(c, S, CAM3, { exposure: 1.4, fx: lens(dist([0, .5, 0]), 2) });
  EIGHT.forEach((i, j) => nameAt(c, HALL.NAMES[i], HALL.seatPos(i, 2.05), t, eightAt(j) + .1, { size: 30, col: '#FFF3DC', out: TL.D0 }));
  [8, 9].forEach(i => nameAt(c, '?', HALL.seatPos(i, 1.9), t, TL.TEN - .1, { size: 64, col: '#F4C46A', out: TL.D0 + .2 }));
  capBand(c);
} });

// the two-shot over the pool, toward seats 8 and 9
const camTwo = (k, o = {}) => cam3({ pos: [o.x ?? 0, lerp(2.4, 2.3, k), lerp(5.5, 5.1, k)], at: [o.ax ?? 0, 1.85, -1.6], fov: o.fov ?? 44 });
const TWO = (t, o = {}) => { ENV(); HALL.set(t, { lit: lights(t, o), ...o.set }); };

// ================= D · two places, three names: the candidates rise from the pool =================
SHOTS.push({ a: TL.D0, b: TL.E0 + .3, xf: .35, draw(c, u, t) {
  TWO(t, { empty: .25 + .5 * Math.max(0, Math.sin((t - TL.TWO) * 6)) * seg(t, TL.TWO, TL.TWO + .1) * (1 - seg(t, TL.PLACES + .5, TL.PLACES + .8)), set: { pool: .25 * seg(t, TL.THREE - .5, TL.THREE) } });
  const kD = easeIO(seg(t, TL.PLACES + .2, TL.THREE + .6)), kE = easeIO(seg(t, TL.BUD1 + .4, TL.E0 + .3));
  cam3({ pos: at3(kE, at3(kD, [0, 2.2, 3.6], [0, 2.0, 5.5]), [0, 2.4, 5.6]), at: at3(kE, at3(kD, [0, 1.75, -2.85], [0, 1.78, .2]), [0, 1.85, -1.6]), fov: 44 });
  candidates(t);
  render3(c, S, CAM3, { exposure: 1.2, fx: lens(dist(at3(kD, [0, 1.5, -2.85], [0, 1.8, .2])), 5) });
  nameAt(c, '8', HALL.seatPos(8, 1.9), t, TL.TWO, { size: 70, col: '#F4C46A', out: TL.THREE - .2 });
  nameAt(c, '9', HALL.seatPos(9, 1.9), t, TL.TWO + .1, { size: 70, col: '#F4C46A', out: TL.THREE - .2 });
  nameAt(c, 'KRISHNA', add3(SPOT.hov.krishna, [0, -.12, .3]), t, TL.KRI1, { size: 40, col: KRI_C });
  nameAt(c, 'BALARAM', add3(SPOT.hov.balaram, [0, -.12, .3]), t, TL.BAL1, { size: 40, col: BAL_C });
  nameAt(c, 'BUDDHA', add3(SPOT.hov.buddha, [0, -.12, .3]), t, TL.BUD1, { size: 40, col: BUD_C });
  if (t > TL.THREE - .2) text(c, '3 NAMES · 2 PLACES', 540, 470, '700 50px Cinzel', '#FFF3DC', { pop: t - TL.THREE + .2, alpha: 1 - seg(t, TL.E0 - .2, TL.E0 + .1), spacing: 4, glow: ['rgba(6,5,10,.95)', 18] });
  capBand(c);
} });

// ================= E · the Varaha Purana: Krishna and Buddha =================
SHOTS.push({ a: TL.E0, b: TL.F0 + .3, xf: .3, draw(c, u, t) {
  TWO(t);
  camTwo(.6 + .4 * easeIO(u / (TL.F0 + .3 - TL.E0)));
  candidates(t);
  render3(c, S, CAM3, { exposure: 1.2, fx: lens(dist([0, 1.4, -1.5]), 5) });
  verdict(c, t, TL.VARAHA - .1, TL.F0 - .1, 'VARAHA PURANA', '4.2', [['8', 'KRISHNA', TL.KRI2 + .3, KRI_C], ['9', 'BUDDHA', TL.BUD2 + .3, BUD_C]], ['रामो रामश्च कृष्णश्च बुद्धः कल्की च ते दश', TL.PICKS1]);
  capBand(c);
} });

// ================= F · Jaydev's Geet Govind: Balaram and Buddha; and Krishna takes all ten forms =================
const F_UP = TL.WHERE - .3, F_BACK = TL.TAKES - .5;
SHOTS.push({ a: TL.F0, b: TL.G0 + .3, xf: .3, draw(c, u, t) {
  const beams = seg(t, TL.TAKES - .1, TL.TAKES + .6), all = seg(t, TL.TAKES, TL.FORMS);
  const lit = lights(t); for (let i = 1; i <= 10; i++) lit[i] = Math.max(lit[i], all);
  ENV(); HALL.set(t, { lit, beams, sky: seg(t, TL.KRI3 - .4, TL.KRI3 + .2) });
  const kU = easeIO(seg(t, F_UP, TL.KRI3 + .2)), kB = easeIO(seg(t, F_BACK, TL.FORMS + .4));
  const p0 = [0, 2.3, 5.1], a0 = [0, 1.85, -1.6], p1 = [0, 1.6, 4.6], a1 = [0, 4.0, -.3], p2 = [0, 7.4, 6.4], a2 = [0, 2.7, -.9];
  cam3({ pos: at3(kB, at3(kU, p0, p1), p2), at: at3(kB, at3(kU, a0, a1), a2), fov: lerp(lerp(44, 50, kU), 46, kB) });
  candidates(t);
  render3(c, S, CAM3, { exposure: 1.2, fx: lens(dist(at3(kB, at3(kU, [0, 1.4, -2.5], SPOT.skyLow), [0, 1.2, 0])), 4) });
  verdict(c, t, TL.GEET - .2, TL.WHERE - .3, 'GEET GOVIND', 'Jaydev · 12th century', [['8', 'BALARAM', TL.BAL3 + .3, BAL_C], ['9', 'BUDDHA', TL.BUD3, BUD_C]], ['केशव धृतबुद्धशरीर जय जगदीश हरे', TL.BUD3 + .2]);
  nameAt(c, 'KRISHNA', add3(SPOT.skyLow, [0, 1.25, 0]), t, TL.KRI3, { size: 50, col: KRI_C, out: TL.TAKES - .4 });
  if (t > TL.TAKES) { text(c, 'ALL TEN', 540, 440, '700 76px Cinzel', '#FFE2A0', { pop: t - TL.TAKES, alpha: 1 - seg(t, TL.G0 - .2, TL.G0 + .1), spacing: 6, glow: ['rgba(244,170,60,.45)', 26] });
    text(c, 'are Krishna’s forms', 540, 504, 'italic 40px Marcellus', '#FFF3DC', { pop: t - TL.TAKES - .2, alpha: 1 - seg(t, TL.G0 - .2, TL.G0 + .1), glow: ['rgba(6,5,10,.95)', 14] }); }
  tag(c, 'GEET GOVIND 1 · THE DASHAVATARA SONG', 470, 1462, t, TL.PICKS2);
  capBand(c);
} });

// ================= G · Vedanta Desika: Balaram and Krishna, no Buddha =================
SHOTS.push({ a: TL.G0, b: TL.H0 + .3, xf: .4, draw(c, u, t) {
  TWO(t, { set: { sky: 1 - seg(t, TL.G0, TL.KRI4) } });
  camTwo(easeIO(u / (TL.H0 + .3 - TL.G0)), { fov: 44 });
  candidates(t);
  render3(c, S, CAM3, { exposure: 1.2, fx: lens(dist([0, 1.4, -2.5]), 5) });
  verdict(c, t, TL.DESIKA - .1, TL.H0 - .1, 'VEDANTA DESIKA', 'Dashavatara Stotra · Tamil Nadu, 14th century', [['8', 'BALARAM', TL.BAL4, BAL_C], ['9', 'KRISHNA', TL.KRI4 + .4, KRI_C]]);
  if (t > TL.NOBUD - .1) text(c, 'NO BUDDHA', 540, 636, '700 40px Cinzel', '#FF9A7A', { pop: t - TL.NOBUD + .1, alpha: 1 - seg(t, TL.H0 - .2, TL.H0), spacing: 4, glow: ['rgba(6,5,10,.95)', 16] });
  capBand(c);
} });

// ================= H · the Mahabharata: neither, and a swan on the pool =================
const swanAt = (t) => { const k = easeOut(seg(t, TL.NEITHER + .3, TL.SWAN + .4)); return [lerp(-2.0, .05, k), .12, lerp(-.1, -.35, k)]; };
SHOTS.push({ a: TL.H0, b: TL.I0 + .3, xf: .35, draw(c, u, t) {
  ENV(); const lit = lights(t, { base: .55 });
  HALL.set(t, { lit, swan: t > TL.NEITHER ? swanAt(t) : null, swanYaw: 0, pool: .18 });
  const k = easeIO(u / (TL.I0 + .3 - TL.H0));
  const kT = easeIO(seg(t, TL.NEITHER + .2, TL.SWAN - .2));
  cam3({ pos: at3(kT, [0, 2.35, 5.2], [.1, 4.3, 2.2]), at: at3(kT, [0, 1.85, -1.6], [0, -.1, -.5]), fov: lerp(44, 46, kT) });
  candidates(t);
  render3(c, S, CAM3, { exposure: 1.2, fx: lens(dist([0, .5, 0]), 5) });
  verdict(c, t, TL.MBH - .1, TL.I0 - .1, 'MAHABHARAT', 'Shanti Parva 340: the ten forms', [['NO', 'BALARAM', TL.NEITHER + .1, BAL_C], ['NO', 'BUDDHA', TL.NEITHER + .3, BUD_C]]);
  nameAt(c, 'HAMSA · THE SWAN', [.05, .55, -1.3], t, TL.SWAN, { size: 40, col: '#FFFFFF' });
  capBand(c);
} });

// ================= I · the Bhagavata counts all three: the ring of 22 rises; 19, 20, 21 =================
SHOTS.push({ a: TL.I0, b: TL.J0 + .3, xf: .35, draw(c, u, t) {
  ENV(); const lit = lights(t, { base: .45 });
  const up = seg(t, TL.BHAG - .4, TL.ALL3 + .2);
  HALL.set(t, { lit, outer: up, outerLit: seg(t, TL.BHAG, TL.ALL3), pool: .15 });
  const k = easeIO(seg(t, TL.I0, TL.BHAG + .6));
  cam3({ pos: at3(k, [0, 2.3, 5.1], [0, 3.0, 1.6]), at: at3(k, [0, 1.85, -1.6], [0, 2.55, -4.9]), fov: lerp(44, 56, k) });
  candidates(t, { scale: 1.25 });
  render3(c, S, CAM3, { exposure: 1.25, fx: lens(dist([0, 2.4, -4.9]), 3) });
  verdict(c, t, TL.BHAG - .1, TL.J0 - .1, 'BHAGAVATA PURANA', '1.3: twenty-two avatars', [['19', 'BALARAM', TL.N19, BAL_C], ['20', 'KRISHNA', TL.N20, KRI_C], ['21', 'BUDDHA', TL.N21, BUD_C]]);
  if (up > .3) for (let n = 1; n <= 22; n++) { if (n >= 19 && n <= 21) continue; const p = HALL.pos22(n, HALL.TOP22 + .75), [x, y, z] = toScreen3(p); if (z < 1 && x > 60 && x < 1020 && y > 720 && y < 1180) text(c, String(n), x, y, '700 30px Cinzel', '#E8DCC4', { alpha: .8 * seg(up, .3, .8), glow: ['rgba(6,5,10,.9)', 12] }); }
  tag(c, 'BHAGAVATA PURANA 1.3.23–24', 470, 1462, t, TL.ALL3);
  capBand(c);
} });

// ================= J · countless, like streams from an endless lake =================
SHOTS.push({ a: TL.J0, b: TL.K0 + .3, xf: .4, draw(c, u, t) {
  ENV(); const lit = lights(t, { base: .7 });
  const sk = seg(t, TL.COUNTLESS - .9, TL.STREAMS + .8), lk = easeIn(seg(t, TL.STREAMS - .3, TL.LAKE + .4)) * .97 + .03 * sk;
  S.fog.near = lerp(9, 30, sk); S.fog.far = lerp(34, 120, sk);
  HALL.set(t, { lit, outer: 1, outerLit: 1, streams: sk, lamps: lk, pool: .2 + .8 * seg(t, TL.COUNTLESS - .6, TL.COUNTLESS) });
  const k = easeIO(seg(t, TL.J0, TL.K0 + .3));
  cam3({ pos: at3(k, [0, 3.0, 1.6], [0, 30, 21]), at: at3(k, [0, 2.55, -4.9], [0, 0, -1.5]), fov: lerp(56, 52, k) });
  candidates(t);
  render3(c, S, CAM3, { exposure: 1.2, fx: lens(dist([0, 0, 0]), 1.5) });
  S.fog.near = 9; S.fog.far = 34;
  if (t > TL.COUNTLESS - .2) { band(c, 400, 640, .5 * (1 - seg(t, TL.K0 - .2, TL.K0 + .1)));
    text(c, 'अवतारा ह्यसङ्ख्येयाः', 540, 478, '60px "Tiro Devanagari Sanskrit"', '#FFE9C0', { pop: t - TL.COUNTLESS + .2, alpha: 1 - seg(t, TL.K0 - .2, TL.K0 + .1), glow: ['rgba(244,170,60,.4)', 24] });
    text(c, '“the avatars are countless”', 540, 570, 'italic 40px Marcellus', '#FFF3DC', { pop: t - TL.COUNTLESS, alpha: 1 - seg(t, TL.K0 - .2, TL.K0 + .1), glow: ['rgba(6,5,10,.95)', 14] }); }
  tag(c, 'BHAGAVATA PURANA 1.3.26', 470, 1462, t, TL.COUNTLESS);
  capBand(c);
} });

// ================= K · save this: the board of the lists; the ask =================
function board(c, t, at) {
  const a = seg(t, at, at + .4); if (a <= 0) return;
  c.save(); c.globalAlpha = a; c.fillStyle = 'rgba(8,6,10,.82)'; c.strokeStyle = 'rgba(244,196,106,.75)'; c.lineWidth = 3; c.beginPath(); c.roundRect(60, 410, 960, 480, 26); c.fill(); c.stroke(); c.restore();
  text(c, 'VISHNU’S 10: WHO GETS 8 & 9?', 540, 462, '700 40px Cinzel', '#F4C46A', { alpha: a, spacing: 2, maxW: 900 });
  const rows = [['VARAHA PURANA', [['KRISHNA', KRI_C], ['BUDDHA', BUD_C]]], ['GEET GOVIND · Jaydev', [['BALARAM', BAL_C], ['BUDDHA', BUD_C]]], ['VEDANTA DESIKA', [['BALARAM', BAL_C], ['KRISHNA', KRI_C]]],
    ['MAHABHARAT', [['neither: a SWAN', '#FFFFFF']]], ['BHAGAVATA', [['all 3: 19 · 20 · 21', '#FFE2A0']]]];
  rows.forEach(([src, picks], r) => { const y = 530 + r * 76, k = seg(t, at + .2 + r * .12, at + .45 + r * .12); if (k <= 0) return;
    c.save(); c.globalAlpha = a * k * .35; c.fillStyle = 'rgba(244,196,106,.5)'; c.fillRect(100, y + 36, 880, 1.5); c.restore();
    c.save(); c.globalAlpha = a * k; c.font = '700 30px Cinzel'; c.letterSpacing = '1px'; c.fillStyle = '#E8DCC4'; c.textBaseline = 'middle'; c.fillText(src, 100, y); c.restore();
    if (picks.length === 1) { c.save(); c.globalAlpha = a * k; c.font = '700 30px Cinzel'; c.fillStyle = picks[0][1]; c.textAlign = 'right'; c.textBaseline = 'middle'; c.fillText(picks[0][0], 980, y); c.restore(); }
    else picks.forEach(([n, col], i) => { c.save(); c.globalAlpha = a * k; c.font = '700 30px Cinzel'; c.fillStyle = col; c.textAlign = 'right'; c.textBaseline = 'middle'; c.fillText(n, i ? 980 : 790, y); c.restore(); });
  });
}
SHOTS.push({ a: TL.K0, b: TL.CARD, xf: .4, draw(c, u, t) {
  TWO(t, { empty: .45 + .3 * Math.sin(t * 3), set: { pool: .3 } });
  cam3({ pos: [0, lerp(2.1, 2.02, u / 8), lerp(5.9, 5.6, u / 8)], at: [0, 2.02, -1.4], fov: 44 });
  candidates(t);
  render3(c, S, CAM3, { exposure: 1.2, fx: lens(dist([0, 1.4, .1]), 5) });
  c.fillStyle = `rgba(6,5,10,${.3 * seg(t, TL.K0, TL.K0 + .5)})`; c.fillRect(0, 0, W, H);
  board(c, t, TL.K0 + .1);
  capBand(c, .55);
} });

// ================= the card =================
SHOTS.push({ a: TL.CARD, b: TL.END + 1, draw(c, u, t) {
  rkCardCine(c, u, t, { title: 'MEET OUR GODS', line: 'Picture books of our gods, for kids', price: 'The Navadurga Set is out now', note: 'Link in bio' });
} });
