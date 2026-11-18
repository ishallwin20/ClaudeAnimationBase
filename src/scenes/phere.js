// phere.js: "Saat phere were never seven rounds" (ad 102), in the 3D style.
// The Paraskara Grihya Sutra (the Shukla Yajurveda's book of home rites; tr. Oldenberg, SBE 29) lays the wedding down:
// the bride's brother pours fried grain (laja) into her joined hands, she offers it into the fire (1.6.1–2), treads on
// a stone north of the fire, "like a stone be firm" (1.7.1), and he leads her round the fire (1.7.3); twice again,
// from the fried grain on (1.7.4): three rounds (1.7.6). Then he makes her take seven steps northward, a word with each:
// sap/food, juice/strength, wealth, comfort/joy, cattle, the seasons, and "Friend! be with seven steps" (1.8.1).
// Asvalayana 1.7 and Sankhayana 1.13–14 lead her round three times too. The Hindu Marriage Act 1955, s. 7(2): where the
// rites include saptapadi, the marriage is complete and binding when the seventh step is taken.
// STORYBOARD.md has the plan and the sources; the timeline (from the voice) is phere_tl.js, the set phere_sets.js.
LOOK.bloom = .1;   // matte (owner, 30 Oct): cine.js's own bloom low, no fx bloom
const CAPY = 1415;
const capBand = (c, a = .6) => band(c, 1290, 1530, a);
VO.caps.forEach((k, i) => say(i ? k.a : -1, k.b, k.text, { at: i ? k.at : k.at.map(() => -1), y: k.y ?? CAPY }));

const lens = (focus, ap = 4, o = {}) => ({ dof: { focus, aperture: ap, max: 12, nearK: .6 }, grade: { contrast: o.contrast ?? 1.06, sat: o.sat ?? 1.06, temp: o.temp ?? .03, tint: 0, lift: o.lift ?? 0, gamma: 1, gain: 1 } });
const dist = (p) => CAM3.position.distanceTo(p.isVector3 ? p : V3(...p));
const at3 = (k, a, b) => a.map((v, i) => lerp(v, b[i], k));
const R_ = (t, a, b) => easeIO(seg(t, a, b));
const flashK = (c, t, at, col = '255,236,200', k = .4, rate = 5) => { const f = t > at ? Math.exp(-(t - at) * rate) : 0; if (f > .01) { c.save(); c.fillStyle = `rgba(${col},${k * f})`; c.fillRect(0, 0, W, H); c.restore(); } };
const GOLD = '#F4C46A', CREAM = '#FFF3DC', RED = '#FF6A55', DEVA = '"Tiro Devanagari Sanskrit"';
const ALL3 = [1, 1, 1];
// render the set: the canopy hides itself when the camera is above it
const R3 = (c, o) => { SET.CAN.visible = CAM3.position.y < 2.45; render3(c, SET.S, CAM3, o); };
const bump01 = (x, a, b) => { const m = (a + b) / 2, h = (b - a) / 2; return Math.max(0, 1 - Math.pow((x - m) / h, 2)); };
// a word over the top band: big, with a small line under it
function topTitle(c, t, at, out, big, small, o = {}) {
  const a = seg(t, at, at + .3) * (1 - seg(t, out, out + .3)); if (a <= 0) return;
  band(c, o.y0 ?? 390, o.y1 ?? 640, .55 * a);
  text(c, big, 540, o.y ?? 480, o.font || '700 88px Cinzel', o.col || GOLD, { pop: t - at, alpha: a, spacing: 5, glow: [o.glowCol || 'rgba(244,170,60,.35)', 28], maxW: 940 });
  if (small) text(c, small, 540, (o.y ?? 480) + (o.dy ?? 80), o.sfont || 'italic 40px Marcellus', o.scol || CREAM, { pop: t - at - .2, alpha: a, glow: ['rgba(6,5,10,.95)', 16], maxW: 900 });
}
// a round gold badge with a number, at a screen point
function disc2(c, n, x, y, t, at, o = {}) {
  if (t < at) return;
  const a = (o.alpha ?? 1) * clamp((t - at) * 5) * (1 - seg(t, o.out ?? 1e9, (o.out ?? 1e9) + .3)); if (a <= 0) return;
  const r = o.r || 34, k = popK(t - at), col = o.col || GOLD;
  c.save(); c.globalAlpha = a; c.translate(x, y); c.scale(k, k);
  c.fillStyle = o.fill || 'rgba(14,9,8,.82)'; c.strokeStyle = col; c.lineWidth = 3.5; c.beginPath(); c.arc(0, 0, r, 0, Math.PI * 2); c.fill(); c.stroke();
  c.restore();
  text(c, String(n), x, y + 3, `700 ${Math.round(r * 1.2)}px Cinzel`, o.ncol || col, { alpha: a * Math.min(1, k), glow: ['rgba(6,5,10,.9)', 10] });
}
// the hook's and the count's big number in the middle of the frame
function bigNum(c, n, t, at, out, o = {}) {
  const a = seg(t, at, at + .15) * (1 - seg(t, out, out + .3)); if (a <= 0) return;
  band(c, (o.y ?? 560) - 190, (o.y ?? 560) + 190, .6 * a);
  text(c, String(n), 540, o.y ?? 560, `700 ${o.size || 230}px Cinzel`, o.col || GOLD, { pop: t - at, alpha: a, glow: ['rgba(255,170,60,.45)', 40] });
  if (o.sub) text(c, o.sub, 540, (o.y ?? 560) + (o.size || 230) * .52, '700 46px Cinzel', CREAM, { pop: t - at - .1, alpha: a, spacing: 6, glow: ['rgba(6,5,10,.95)', 18] });
}

// ---------- views ----------
const STEPV = { pos: [0, 5.6, -1.3], at: [0, 0, -3.05] };
const HIGH = (k = 0) => ({ pos: at3(k, [0, 5.1, 3.4], [0, 5.3, 3.0]), at: [0, 0, -.25], fov: 46 });
const BEHIND = (k = 0) => ({ pos: at3(k, STEPV.pos, [0, 5.3, -1.5]), at: STEPV.at, fov: 46 });
const stepK = (t) => TL.W.reduce((s, w) => s + R_(t, w - .2, w + .1), 0);

// ================= A · the hook: seven rings round the fire → three stay → the seven become steps =================
SHOTS.push({ a: 0, b: TL.B0 + .3, draw(c, u, t) {
  const keep = 7 - 4 * R_(t, TL.THREE0 - .05, TL.THREE0 + .6), dim = 1 - .7 * R_(t, TL.NEVER - .1, TL.NEVER + .6);
  const sk = seg(t, TL.STEPS0 - .7, TL.STEPS0 + .25), tilt = R_(t, TL.SEVEN0, TL.STEPS0 + .2);
  const ex = SET.set(t, { seven: dim, sevenKeep: keep, steps: 7 * sk, stepGlow: Array.from({ length: 7 }, (_, i) => clamp(sk * 7 - i)), printK: 1 });
  cam3({ pos: at3(tilt, [0, 6.4, 3.9], STEPV.pos), at: at3(tilt, [0, 0, -.2], STEPV.at), fov: lerp(48, 46, tilt) });
  R3(c, { exposure: ex, fx: lens(dist([0, .3, -.6 - 1.8 * tilt]), 3) });
  for (let i = 0; i < 7; i++) { const [x, y] = toScreen3(SET.STEP(i)); disc2(c, i + 1, x - 150, y, t, TL.STEPS0 - .45 + i * .1, { r: 28 }); }
  bigNum(c, 3, t, TL.THREE0 - .05, TL.NEVER - .2, { sub: 'ROUNDS', y: 560 });
  flashK(c, t, TL.THREE0, '255,200,120', .18, 4);
  flashK(c, t, TL.STEPS0, '255,220,150', .22, 4);
  capBand(c);
} });

// ================= B · the source: Paraskara Grihya Sutra; two more agree =================
SHOTS.push({ a: TL.B0, b: TL.C0 + .3, xf: .4, draw(c, u, t) {
  const ex = SET.set(t, {});
  const k = easeIO(seg(t, TL.B0, TL.C0 + .3)), a = lerp(.05, .4, k);
  cam3({ pos: [3.4 * Math.sin(a), 1.45 - .15 * k, 3.4 * Math.cos(a)], at: [0, .55, 0], fov: 44 });
  R3(c, { exposure: ex, fx: lens(dist([0, .5, 0]), 5) });
  topTitle(c, t, TL.PARAS - .25, TL.TWOMORE - .3, 'पारस्कर गृह्यसूत्र', 'PARASKARA GRIHYA SUTRA', { font: `96px ${DEVA}`, y: 470, dy: 92, y0: 370, y1: 640, sfont: '700 40px Cinzel', scol: GOLD });
  tag(c, 'THE SHUKLA YAJURVEDA', 540, 700, t, TL.SHUKLA - .1, { out: TL.TWOMORE - .3, size: 30 });
  topTitle(c, t, TL.TWOMORE - .1, TL.C0 + .2, 'THREE ROUNDS', 'in all three', { y: 470, y0: 380, y1: 600, font: '700 84px Cinzel' });
  tag(c, 'PARASKARA 1.7.6', 540, 680, t, TL.TWOMORE + .1, { out: TL.C0 + .2, size: 28 });
  tag(c, 'ASHVALAYANA 1.7.6', 540, 750, t, TL.TWOMORE + .35, { out: TL.C0 + .2, size: 28 });
  tag(c, 'SHANKHAYANA 1.13–1.14', 540, 820, t, TL.TWOMORE + .6, { out: TL.C0 + .2, size: 28 });
  capBand(c);
} });

// ================= C · the rite: laja into her hands, into the fire; the stone =================
const C2 = TL.OFFERS - .2, C3 = TL.STONE - .7;
SHOTS.push({ a: TL.C0, b: C2 + .3, xf: .4, draw(c, u, t) {
  const on = seg(t, TL.BROTHER - .2, TL.RICE);
  const ex = SET.set(t, { laja: { from: [-.62, 2.5, .25], to: [-.62, .55, .25], on, w: .035, spread: .05, per: .75 } });
  const k = easeIO(seg(t, TL.C0, C2 + .3));
  cam3({ pos: at3(k, [-1.55, 1.25, 1.85], [-1.45, 1.3, 1.7]), at: [-.62, 1.35, .25], fov: 40 });
  R3(c, { exposure: ex, fx: lens(dist([-.62, 1.3, .25]), 6) });
  topTitle(c, t, TL.RICE - .15, C2 + .3, 'LAJA', 'puffed rice, from her brother', { y: 470, y0: 390, y1: 600, font: '700 92px Cinzel' });
  tag(c, 'PARASKARA 1.6.1', 540, 1180, t, TL.BROTHER, { out: C2 + .2, size: 26 });
  capBand(c);
} });
SHOTS.push({ a: C2, b: C3 + .3, xf: .35, draw(c, u, t) {
  const fl = seg(t, TL.FIRE - .5, TL.FIRE) * (1 - seg(t, TL.FIRE + .4, C3 + .3));
  const ex = SET.set(t, { laja: { from: [-.3, 1.75, .05], to: [0, .32, 0], on: seg(t, C2, C2 + .5) * (1 - seg(t, TL.FIRE + .5, C3)), w: .03, spread: .14, per: .7 }, flare: fl });
  const k = easeIO(seg(t, C2, C3 + .3));
  cam3({ pos: at3(k, [.15, 1.35, 2.1], [.1, 1.25, 1.85]), at: [0, .65, 0], fov: 44 });
  R3(c, { exposure: ex, fx: lens(dist([0, .5, 0]), 4) });
  topTitle(c, t, TL.FIRE - .1, C3 + .3, 'INTO THE FIRE', null, { y: 470, y0: 400, y1: 550, font: '700 80px Cinzel' });
  tag(c, 'PARASKARA 1.6.2', 540, 1180, t, TL.OFFERS, { out: C3 + .2, size: 26 });
  capBand(c);
} });
SHOTS.push({ a: C3, b: TL.D0 + .3, xf: .35, draw(c, u, t) {
  const st = t > TL.STONE ? (t - TL.STONE) : 0;
  const ex = SET.set(t, { stone: st });
  const k = easeIO(seg(t, C3, TL.D0 + .3));
  cam3({ pos: at3(k, [.75, .82, -.3], [.62, .7, -.42]), at: [.2, .05, -1.08], fov: 40 });
  R3(c, { exposure: ex, fx: lens(dist(SET.STONE), 3) });
  topTitle(c, t, TL.FIRM - .1, TL.D0 + .3, 'BE FIRM', 'like this stone', { y: 470, y0: 390, y1: 600, font: '700 96px Cinzel' });
  tag(c, 'PARASKARA 1.7.1', 540, 1180, t, TL.STONE, { out: TL.D0 + .2, size: 26 });
  flashK(c, t, TL.STONE, '255,230,190', .2, 6);
  capBand(c);
} });

// ================= D · the rounds: one, two, three; only three =================
const roundsAt = (t) => TL.R.map(([a, b]) => seg(t, a, b));
SHOTS.push({ a: TL.D0, b: TL.E0 + .3, xf: .4, draw(c, u, t) {
  const ex = SET.set(t, { canopy: false, rounds: roundsAt(t), trail: .3, stone: 9 });
  const k = easeIO(seg(t, TL.D0, TL.E0 + .3)), drop = 1 - R_(t, TL.D0, TL.D0 + 1.4);
  const v = HIGH(k);
  cam3({ pos: at3(drop, v.pos, [.6, 3.1, 3.6]), at: at3(drop, v.at, [0, .2, -.3]), fov: 46 });
  R3(c, { exposure: ex, fx: lens(dist([0, 0, 0]), 2) });
  bigNum(c, 1, t, TL.ONE - .05, TL.TWO - .6, { sub: 'ROUND' });
  bigNum(c, 2, t, TL.TWO - .05, TL.THREE - .6, { sub: 'ROUNDS' });
  bigNum(c, 3, t, TL.THREE - .05, TL.E0, { sub: 'ROUNDS', col: '#FFD98A' });
  tag(c, 'PARASKARA 1.7.4–1.7.6', 540, 1180, t, TL.ONLY - .1, { out: TL.E0, size: 26 });
  flashK(c, t, TL.THREE, '255,210,140', .2, 4);
  capBand(c);
} });

// ================= E · then the seven steps, toward the north =================
SHOTS.push({ a: TL.E0, b: TL.F0 + .3, xf: .45, draw(c, u, t) {
  const pre = seg(t, TL.SEVENSTEPS - .2, TL.SEVENSTEPS + .8) * (1 - .6 * seg(t, TL.EACH, TL.F0));
  const ex = SET.set(t, { rounds: ALL3, trail: .3, ringK: 1 - .5 * seg(t, TL.E0, TL.E0 + 1.5), stone: 9, stepGlow: Array.from({ length: 7 }, (_, i) => .5 * clamp(pre * 8 - i)) });
  const k = R_(t, TL.E0, TL.EACH);
  const v0 = HIGH(1), v1 = BEHIND(0);
  cam3({ pos: at3(k, v0.pos, v1.pos), at: at3(k, v0.at, v1.at), fov: 46 });
  R3(c, { exposure: ex, fx: lens(dist([0, 0, -3.2]), 3) });
  // NORTH at the far end of the path
  const [nx, ny, nz] = toScreen3([0, 0, -5.2]), na = seg(t, TL.NORTH - .2, TL.NORTH + .2) * (1 - seg(t, TL.F0, TL.F0 + .3));
  if (nz < 1 && na > 0) { text(c, '▲', nx, ny - 70, '700 44px Cinzel', GOLD, { alpha: na, glow: ['rgba(6,5,10,.9)', 12] }); text(c, 'NORTH', nx, ny - 20, '700 40px Cinzel', CREAM, { alpha: na, spacing: 6, glow: ['rgba(6,5,10,.95)', 16] }); }
  topTitle(c, t, TL.SEVENSTEPS - .1, TL.EACH - .2, 'SAPTAPADI', 'seven steps', { y: 470, y0: 390, y1: 600, font: '700 92px Cinzel' });
  tag(c, 'PARASKARA 1.8.1', 540, 1180, t, TL.SEVENSTEPS, { out: TL.F0 + .2, size: 26 });
  capBand(c);
} });

// ================= F · one word a step: food, strength, wealth, joy, cattle, the seasons =================
const WORDS = ['FOOD', 'STRENGTH', 'WEALTH', 'JOY', 'CATTLE', 'THE SEASONS'];
function stepLabels(c, t, n, o = {}) {
  for (let i = 0; i < n; i++) {
    const at = o.ats ? o.ats[i] : -1, [x, y, z] = toScreen3(SET.STEP(i)); if (z > 1) continue;
    const a = (o.alpha ?? 1) * clamp((t - at) * 5);
    const r = o.r ?? 30, bx = x - (o.dx ?? 210);
    disc2(c, i + 1, bx, y, t, at, { r, alpha: o.alpha, col: i === 6 ? '#FFE9A8' : GOLD });
    if (o.words !== false && i < 6) text(c, WORDS[i], x + (o.dx ?? 210), y + 4, `700 ${o.size ?? 40}px Cinzel`, CREAM, { pop: t - (o.wats ? o.wats[i] : at), alpha: a * (t > (o.wats ? o.wats[i] : at) ? 1 : 0), spacing: 2, glow: ['rgba(6,5,10,.95)', 16], maxW: 330 });
  }
}
SHOTS.push({ a: TL.F0, b: TL.G0 + .3, xf: .3, draw(c, u, t) {
  const n = stepK(t);
  const ex = SET.set(t, { rounds: ALL3, trail: .3, ringK: .5, stone: 9, steps: n, stepGlow: Array.from({ length: 7 }, (_, i) => clamp(n - i)) });
  const k = easeIO(seg(t, TL.F0, TL.G0 + .3));
  cam3(BEHIND(k * .6));
  R3(c, { exposure: ex, fx: lens(dist([0, 0, -3.4]), 3) });
  stepLabels(c, t, 6, { ats: TL.W.map(w => w - .05), wats: TL.WW.map(w => w - .05) });
  capBand(c);
} });

// ================= G · the seventh: he calls her FRIEND =================
SHOTS.push({ a: TL.G0, b: TL.H0 + .3, xf: .3, draw(c, u, t) {
  const n = 6 + R_(t, TL.SEVENTH - .2, TL.SEVENTH + .15), fr = R_(t, TL.FRIEND - .1, TL.FRIEND + .5);
  const ex = SET.set(t, { rounds: ALL3, trail: .3, ringK: .5 * (1 - .6 * fr), stone: 9, steps: n, stepGlow: Array.from({ length: 7 }, (_, i) => clamp(n - i) * (i < 6 ? 1 - .5 * fr : 1)), seventh: fr });
  const k = easeIO(seg(t, TL.G0, TL.H0 + .3));
  cam3(BEHIND(.6 + .4 * k));
  R3(c, { exposure: ex, fx: lens(dist(SET.STEP(6)), 2) });
  stepLabels(c, t, 7, { ats: [-1, -1, -1, -1, -1, -1, TL.SEVENTH - .05], wats: Array(6).fill(-1), alpha: 1 - .75 * fr });
  topTitle(c, t, TL.FRIEND - .08, TL.H0 + .3, 'FRIEND', 'सखे सप्तपदा भव', { y: 470, y0: 370, y1: 630, font: '700 130px Cinzel', col: '#FFE9A8', sfont: `46px ${DEVA}`, dy: 100 });
  flashK(c, t, TL.FRIEND, '255,236,190', .3, 3);
  capBand(c);
} });

// ================= H · even the law: complete at the seventh step =================
SHOTS.push({ a: TL.H0, b: TL.I0 + .3, xf: .45, draw(c, u, t) {
  const p = bump01(t, TL.SEVSTEP - .3, TL.SEVSTEP + 1.2);
  const ex = SET.set(t, { canopy: false, rounds: ALL3, trail: .3, ringK: .3, stone: 9, steps: 7, stepGlow: [.4, .4, .4, .4, .4, .4, .6], seventh: .2 + .3 * p });
  const k = easeIO(seg(t, TL.H0, TL.I0 + .3));
  cam3({ pos: at3(k, [0, 2.5, -3.75], [0, 2.2, -3.95]), at: [0, 0, -4.68], fov: 46 });
  R3(c, { exposure: ex, fx: lens(dist([0, 0, -3.4]), 2) });
  const a = seg(t, TL.ACT - .5, TL.ACT) * (1 - seg(t, TL.I0, TL.I0 + .3));
  if (a > 0) {
    band(c, 360, 760, .72 * a);
    text(c, 'HINDU MARRIAGE ACT, 1955', 540, 440, '700 50px Cinzel', GOLD, { alpha: a, spacing: 3, glow: ['rgba(6,5,10,.95)', 16], maxW: 960 });
    text(c, 'SECTION 7(2)', 540, 500, '700 34px Cinzel', CREAM, { alpha: a, spacing: 6, glow: ['rgba(6,5,10,.95)', 14] });
    const q = seg(t, TL.SAPTA - .3, TL.SAPTA + .2);
    ['“…the marriage becomes complete and', 'binding when the seventh step', 'is taken.”'].forEach((s, i) => text(c, s, 540, 580 + i * 52, 'italic 42px Marcellus', i ? '#FFE9C0' : CREAM, { alpha: a * q, glow: ['rgba(6,5,10,.95)', 14], maxW: 960 }));
  }
  disc2(c, 7, toScreen3(SET.STEP(6))[0] - 230, toScreen3(SET.STEP(6))[1], t, TL.SEVSTEP - .05, { r: 44 + 8 * p, fill: 'rgba(60,36,8,.85)', col: '#FFE9A8' });
  capBand(c);
} });

// ================= I · the ask: how many rounds at your wedding? 3, 4 or 7 + your state =================
SHOTS.push({ a: TL.I0, b: TL.CARD, xf: .45, draw(c, u, t) {
  const ex = SET.set(t, { canopy: false, rounds: ALL3, trail: .35, ringK: 1, stone: 9, steps: 7, stepGlow: Array(7).fill(.6), seventh: .3 });
  const k = easeIO(seg(t, TL.I0, TL.CARD));
  cam3({ pos: at3(k, [0, 6.6, 2.4], [0, 7.0, 2.2]), at: [0, 0, -1.5], fov: 50 });
  R3(c, { exposure: ex, fx: lens(dist([0, 0, -1.2]), 1.5) });
  topTitle(c, t, TL.HOW - .1, TL.SEND - .2, 'YOUR WEDDING?', null, { y: 470, y0: 400, y1: 540, font: '700 84px Cinzel' });
  [[3, TL.N3, 340], [4, TL.N4, 540], [7, TL.N7, 740]].forEach(([n, at, x]) => disc2(c, n, x, 640, t, at - .05, { r: 62, out: TL.SEND - .2 }));
  text(c, '+ YOUR STATE', 540, 760, '700 44px Cinzel', CREAM, { pop: t - TL.STATE + .05, alpha: (t > TL.STATE - .05 ? 1 : 0) * (1 - seg(t, TL.SEND - .2, TL.SEND + .1)), spacing: 4, glow: ['rgba(6,5,10,.95)', 16] });
  topTitle(c, t, TL.SEND - .1, TL.CARD + 1, 'SEND THIS', 'to a couple getting married', { y: 470, y0: 385, y1: 600, font: '700 88px Cinzel' });
  capBand(c);
} });

// ================= the card =================
SHOTS.push({ a: TL.CARD, b: TL.END + 1, draw(c, u, t) {
  rkCardCine(c, u, t, { title: 'MEET OUR GODS', line: 'Picture books of our gods, for kids', price: 'The Navadurga Set is out now', note: 'Link in bio' });
} });
