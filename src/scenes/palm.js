// palm.js: "Your palm has FOUR holy places" (ad 92), in the 3D style.
// The Dharma Shastras name four tirthas on the right hand (Manu 2.58–59, Yajnavalkya 1.19, Vishnu Smriti 62.1–4):
// the fingertips are the gods' (deva), below the little finger Prajapati's (kaya), the base of the thumb Brahma's, and
// between the thumb and the first finger the ancestors' (pitri), from which water for the dead is poured. Sip from
// Brahma's (three) first, one or two only if you must, from the ancestors' (four) never (Manu 2.58). Sip three
// times, water not hot or foaming, then wipe the lips twice (Manu 2.60–61). The ask: which one have you been sipping
// from? Comment 1, 2, 3 or 4. The card.
// STORYBOARD.md has the plan and the sources; the timeline (from the voice) is palm_tl.js, the set palm_sets.js.
LOOK.bloom = .1;   // matte (owner, 30 Oct): cine.js's own bloom low, no fx bloom
const CAPY = 1415;
const capBand = (c, a = .62) => band(c, 1290, 1530, a);
// caption line breaks (the words and their times are the voice's; only the breaks move)
const BR = {
  "Water offered to the gods | flows off *HERE.*": "Water offered | to the gods | flows off *HERE.*",
  "*THREE:* the base of the thumb. | *BRAHMA'S* tirtha.": "*THREE:* the base | of the thumb. | *BRAHMA'S* tirtha.",
  "*TWO:* below the little finger. | *PRAJAPATI'S,* the Creator's.": "*TWO:* below | the little finger. | *PRAJAPATI'S,* the Creator's.",
  "And *FOUR:* | between thumb and first finger.": "And *FOUR:* | between thumb | and first finger.",
    "named in the old law books: | *MANU,* *YAJNAVALKYA,* *VISHNU.*": "named in the old | law books: *MANU,* | *YAJNAVALKYA,* *VISHNU.*",
};
VO.caps.forEach((k, i) => say(i ? k.a : -1, k.b, BR[k.text] || k.text, { at: i ? k.at : k.at.map(() => -1), y: k.y ?? CAPY }));

const lens = (focus, ap = 5, o = {}) => ({ dof: { focus, aperture: ap, max: 14, nearK: .6 }, grade: { contrast: o.contrast ?? 1.06, sat: o.sat ?? 1.05, temp: o.temp ?? .02, tint: 0, lift: o.lift ?? 0, gamma: 1, gain: 1 } });
const dist = (p) => CAM3.position.distanceTo(p.isVector3 ? p : V3(...p));
const at3 = (k, a, b) => a.map((v, i) => lerp(v, b[i], k));
const R_ = (t, a, b) => easeIO(seg(t, a, b));
const flashK = (c, t, at, col = '255,236,200', k = .4, rate = 5) => { const f = t > at ? Math.exp(-(t - at) * rate) : 0; if (f > .01) { c.save(); c.fillStyle = `rgba(${col},${k * f})`; c.fillRect(0, 0, W, H); c.restore(); } };
const GOLD = '#F4C46A', CREAM = '#FFF3DC', COLD = '#CFE2FF', RED = '#FF6A55', DEVA = '"Tiro Devanagari Sanskrit"';
const W3 = (p) => SET.W(p);
const AN = SET.ANCH;
// a word over the top band: big, with a small line under it
function topTitle(c, t, at, out, big, small, o = {}) {
  const a = seg(t, at, at + .3) * (1 - seg(t, out, out + .3)); if (a <= 0) return;
  band(c, o.y0 ?? 390, o.y1 ?? 640, .55 * a);
  text(c, big, 540, o.y ?? 480, o.font || '700 88px Cinzel', o.col || GOLD, { pop: t - at, alpha: a, spacing: 5, glow: [o.glowCol || 'rgba(244,170,60,.35)', 28], maxW: 900 });
  if (small) text(c, small, 540, (o.y ?? 480) + (o.dy ?? 80), o.sfont || 'italic 40px Marcellus', o.scol || CREAM, { pop: t - at - .2, alpha: a, glow: ['rgba(6,5,10,.95)', 16], maxW: 880 });
}
// a verse: Devanagari lines, then the English, on a dark band
function shloka(c, t, at, out, deva, eng, y = 470) {
  const a = seg(t, at, at + .35) * (1 - seg(t, out, out + .3)); if (a <= 0) return;
  band(c, y - 70, y + deva.length * 64 + eng.length * 46 + 20, .62 * a);
  deva.forEach((s, i) => text(c, s, 540, y + i * 64, `44px ${DEVA}`, '#FFE9C0', { alpha: a, glow: ['rgba(6,5,10,.95)', 16], maxW: 920 }));
  eng.forEach((s, i) => text(c, s, 540, y + deva.length * 64 + 4 + i * 46, 'italic 34px Marcellus', CREAM, { alpha: a, glow: ['rgba(6,5,10,.95)', 14], maxW: 900 }));
}
// a numbered badge pinned to a world point (offset dx, dy on screen)
function badge(c, n, p, t, at, o = {}) {
  if (t < at) return;
  const a = (o.alpha ?? 1) * clamp((t - at) * 5) * (1 - seg(t, o.out ?? 1e9, (o.out ?? 1e9) + .3)); if (a <= 0) return;
  const [x0, y0, z] = toScreen3(p); if (z > 1) return;
  const x = x0 + (o.dx || 0), y = y0 + (o.dy || 0), r = o.r || 34, k = popK(t - at), col = o.col || GOLD;
  if (o.line !== false && (o.dx || o.dy)) { c.save(); c.globalAlpha = a * .8; c.strokeStyle = col; c.lineWidth = 2.5; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x - (o.dx || 0) * r / Math.hypot(o.dx || 0, o.dy || 0), y - (o.dy || 0) * r / Math.hypot(o.dx || 0, o.dy || 0)); c.stroke(); c.restore(); }
  c.save(); c.globalAlpha = a; c.translate(x, y); c.scale(k, k);
  c.fillStyle = 'rgba(14,9,8,.82)'; c.strokeStyle = col; c.lineWidth = 3.5; c.beginPath(); c.arc(0, 0, r, 0, Math.PI * 2); c.fill(); c.stroke();
  c.restore();
  text(c, String(n), x, y + 3, `700 ${Math.round(r * 1.25)}px Cinzel`, col, { alpha: a * Math.min(1, k), glow: ['rgba(6,5,10,.9)', 10] });
  if (o.label) text(c, o.label, x + (o.lx ?? 0), y + (o.ly ?? r + 34), `700 ${o.lsize || 32}px Cinzel`, o.lcol || CREAM, { pop: t - at - .1, alpha: a, spacing: 2, glow: ['rgba(6,5,10,.95)', 16], maxW: 520 });
  if (o.sub) text(c, o.sub, x + (o.lx ?? 0), y + (o.ly ?? r + 34) + 40, 'italic 32px Marcellus', o.scol || '#FFE2A0', { alpha: a * Math.min(1, k), glow: ['rgba(6,5,10,.95)', 14], maxW: 520 });
}
// a tick or a cross by a point
function mark(c, kind, p, t, at, o = {}) {
  if (t < at) return;
  const a = clamp((t - at) * 5) * (1 - seg(t, o.out ?? 1e9, (o.out ?? 1e9) + .3)); if (a <= 0) return;
  const [x0, y0] = toScreen3(p), x = x0 + (o.dx || 0), y = y0 + (o.dy || 0), s = (o.size || 40) * popK(t - at), col = kind === 'x' ? RED : '#8EE07A';
  c.save(); c.globalAlpha = a; c.translate(x, y); c.lineCap = 'round'; c.lineJoin = 'round';
  c.strokeStyle = 'rgba(8,6,6,.85)'; c.lineWidth = s * .42; c.beginPath();
  if (kind === 'x') { c.moveTo(-s, -s); c.lineTo(s, s); c.moveTo(s, -s); c.lineTo(-s, s); } else { c.moveTo(-s * .8, 0); c.lineTo(-s * .2, s * .6); c.lineTo(s, -s * .7); }
  c.stroke(); c.strokeStyle = col; c.lineWidth = s * .24; c.stroke(); c.restore();
}

// ---------- poses and views ----------
const REST = { pos: [0, 0, 0], rot: [0, 0, 0] };
const tiltTo = (k, e) => ({ pos: [0, 0, 0], rot: e.map(v => v * k) });
const P = { deva: AN.deva, praja: AN.praja, brahma: AN.brahma, pitri: AN.pitri };
const ALL = (o = {}) => ({ deva: 1, praja: 1, brahma: 1, pitri: 1, ...o });
const TOPV = (k = 0) => ({ pos: at3(k, [.018, .45, .15], [.018, .42, .135]), at: [.018, 0, -.04], fov: 40 });
// the hand lower in the frame, leaving the top for a title
const LOWV = (k = 0) => ({ pos: at3(k, [.018, .56, .2], [.018, .54, .195]), at: [.018, 0, -.058], fov: 40 });
const VIEW = { praja: [[-.12, .29, .15], [-.012, 0, -.025]], brahma: [[.13, .29, .16], [.03, 0, 0]], pitri: [[.17, .26, .06], [.04, 0, -.015]] };
const near = (v, k, f = .9) => ({ pos: at3(k, v[0], v[0].map((x, i) => lerp(v[1][i], x, f))), at: v[1], fov: 40 });
// the hook and the ask share this badge layout
function badges(c, t, at, o = {}) {
  const ats = o.ats || [at, at, at, at], cols = o.cols || [GOLD, GOLD, GOLD, GOLD];
  const L = { r: 30, lsize: 28 };
  badge(c, 1, W3(P.deva), t, ats[0], { ...L, col: cols[0], alpha: o.alpha?.[0], out: o.out, label: o.labels?.[0], ly: 66 });
  badge(c, 2, W3(P.praja), t, ats[1], { ...L, col: cols[1], alpha: o.alpha?.[1], out: o.out, label: o.labels?.[1], lx: -20, ly: 64 });
  badge(c, 3, W3(P.brahma), t, ats[2], { ...L, col: cols[2], alpha: o.alpha?.[2], out: o.out, label: o.labels?.[2], lx: -150, ly: 8 });
  badge(c, 4, W3(P.pitri), t, ats[3], { ...L, col: cols[3], alpha: o.alpha?.[3], out: o.out, label: o.labels?.[3], lx: 0, ly: -62 });
}

// ================= A · the hook: four holy places; one belongs to the dead =================
SHOTS.push({ a: 0, b: TL.B0 + .3, draw(c, u, t) {
  const d = R_(t, TL.DEAD - .25, TL.DEAD + .35);
  const ex = SET.set(t, { hand: REST, mk: { deva: 1 - .7 * d, praja: 1 - .7 * d, brahma: 1 - .7 * d, pitri: [1 + .5 * d, d > .3 ? 'cold' : 'gold'] }, cold: .55 * d });
  const k = easeIO(seg(t, 0, TL.B0 + .3));
  cam3({ pos: at3(d, TOPV(k * .5).pos, [.15, .25, .05]), at: at3(d, [.018, 0, -.034], [.04, 0, -.015]), fov: 40 });
  render3(c, SET.S, CAM3, { exposure: ex, fx: lens(dist(W3([0, 0, -.03])), 3, { temp: .02 - .08 * d }) });
  badges(c, t, -1, { alpha: [1 - .75 * d, 1 - .75 * d, 1 - .75 * d, 1], cols: [GOLD, GOLD, GOLD, d > .3 ? COLD : GOLD] });
  topTitle(c, t, TL.DEAD - .05, TL.B0 + .2, 'THE DEAD', null, { col: COLD, glowCol: 'rgba(150,190,255,.35)', y: 470, y0: 400, y1: 540, font: '700 84px Cinzel' });
  flashK(c, t, TL.DEAD, '200,220,255', .35, 4);
  capBand(c);
} });

// ================= B · not palm reading: tirthas, in the old law books =================
SHOTS.push({ a: TL.B0, b: TL.C0 + .3, xf: .35, draw(c, u, t) {
  const ex = SET.set(t, { hand: REST, mk: { deva: .7 * seg(t, TL.TIRTHA, TL.TIRTHA + .5), praja: .7 * seg(t, TL.TIRTHA + .1, TL.TIRTHA + .6), brahma: .7 * seg(t, TL.TIRTHA + .2, TL.TIRTHA + .7), pitri: .7 * seg(t, TL.TIRTHA + .3, TL.TIRTHA + .8) } });
  const k = easeIO(seg(t, TL.B0, TL.C0 + .3));
  cam3({ pos: at3(k, [-.05, .115, .31], [.04, .1, .27]), at: at3(k, [0, .045, -.1], [0, .04, -.1]), fov: 40 });
  render3(c, SET.S, CAM3, { exposure: ex, fx: lens(dist(W3([0, 0, -.02])), 6) });
  // "not palm reading": the lines struck through
  const np = seg(t, TL.NOT - .05, TL.NOT + .2) * (1 - seg(t, TL.TIRTHA - .2, TL.TIRTHA + .1));
  if (np > 0) {
    band(c, 400, 560, .5 * np);
    text(c, 'PALM READING', 540, 480, '700 76px Cinzel', CREAM, { alpha: np, spacing: 4, glow: ['rgba(6,5,10,.95)', 18] });
    const sk = seg(t, TL.NOT + .35, TL.NOT + .75); c.save(); c.globalAlpha = np; c.strokeStyle = RED; c.lineWidth = 9; c.lineCap = 'round'; c.beginPath(); c.moveTo(205, 476); c.lineTo(205 + 670 * sk, 476); c.stroke(); c.restore();
  }
  topTitle(c, t, TL.TIRTHA - .1, TL.LAW - .1, 'तीर्थ', 'TIRTHA · a holy place', { font: `110px ${DEVA}`, y: 470, dy: 96, y0: 380, y1: 640, sfont: '700 40px Cinzel', scol: GOLD });
  shloka(c, t, TL.LAW - .05, TL.C0 + .2, ['अङ्गुष्ठमूलस्य तले ब्राह्मं तीर्थं प्रचक्षते ।', 'कायमङ्गुलिमूलेऽग्रे दैवं पित्र्यं तयोरधः ॥'], ['Brahma’s at the thumb’s root, Prajapati’s at the', 'fingers’ root, the gods’ at the tips, the ancestors’ between'], 440);
  tag(c, 'MANUSMRITI 2.59', 540, 1150, t, TL.MANU - .05, { out: TL.YAJ - .15, size: 26 });
  tag(c, 'YAJNAVALKYA SMRITI 1.19', 540, 1150, t, TL.YAJ - .05, { out: TL.VISHNU - .15, size: 26 });
  tag(c, 'VISHNU SMRITI 62.1–4', 540, 1150, t, TL.VISHNU - .05, { out: TL.C0, size: 26 });
  capBand(c);
} });

// ================= C · one: the fingertips, the gods'; water offered to the gods flows off here =================
const C_TILT = TL.OFFERED + .35;
SHOTS.push({ a: TL.C0, b: C_TILT, xf: .4, draw(c, u, t) {
  const fill = seg(t, TL.WATER - .1, C_TILT - .3);
  const ex = SET.set(t, { hand: REST, pool: fill, pour: seg(t, TL.WATER - .9, TL.WATER - .2), pourFlow: seg(t, TL.WATER - .3, TL.WATER) * (1 - seg(t, C_TILT - .35, C_TILT - .1)), mk: { deva: seg(t, TL.ONE - .2, TL.ONE + .3) } });
  const k = easeIO(seg(t, TL.C0, C_TILT));
  cam3({ pos: at3(k, [.09, .2, .2], [.07, .18, .18]), at: at3(k, [-.005, .04, -.075], [-.01, .045, -.065]), fov: 40 });
  render3(c, SET.S, CAM3, { exposure: ex, fx: lens(dist(W3([0, .01, -.08])), 5) });
  badge(c, 1, W3(P.deva), t, TL.ONE - .05, { dx: 0, dy: -100, r: 40, line: false, out: TL.WATER - .3, label: 'DEVA TIRTHA', sub: 'the gods’', ly: -100, lsize: 46 });
  capBand(c);
} });
SHOTS.push({ a: C_TILT, b: TL.D0 + .3, xf: .25, draw(c, u, t) {
  const tk = R_(t, C_TILT, C_TILT + .7), flow = seg(t, C_TILT + .35, TL.HERE1);
  const ex = SET.set(t, { hand: tiltTo(tk, SET.DEVA_E), pool: 1 - .55 * flow, poolO: { dz: -.012 * tk }, devaFlow: flow, mk: { deva: 1 } });
  const k = easeIO(seg(t, C_TILT, TL.D0 + .3));
  cam3({ pos: at3(k, [-.2, .1, .05], [-.21, .08, .03]), at: at3(k, [0, -.03, -.08], [0, -.045, -.09]), fov: 40 });
  render3(c, SET.S, CAM3, { exposure: ex, fx: lens(dist(W3([0, -.02, -.1])), 4) });
  topTitle(c, t, TL.HERE1 - .1, TL.D0 + .3, 'TO THE GODS', 'off the fingertips', { y: 470, y0: 395, y1: 600, font: '700 76px Cinzel' });
  capBand(c);
} });

// ================= D · two: below the little finger, Prajapati's =================
SHOTS.push({ a: TL.D0, b: TL.E0 + .3, xf: .4, draw(c, u, t) {
  const ex = SET.set(t, { hand: REST, mk: { deva: .25, praja: seg(t, TL.TWO - .15, TL.TWO + .3) } });
  const k = easeIO(seg(t, TL.D0, TL.E0 + .3));
  cam3(near(VIEW.praja, k));
  render3(c, SET.S, CAM3, { exposure: ex, fx: lens(dist(W3(P.praja)), 5) });
  badge(c, 2, W3(P.praja), t, TL.TWO - .05, { dx: 0, dy: -220, r: 40, label: 'PRAJAPATI', sub: 'the Creator’s (kaya)', ly: -110, lsize: 46 });
  tag(c, 'YAJNAVALKYA 1.19 · VISHNU 62.1', 540, 1150, t, TL.PRAJA, { out: TL.E0 + .2, size: 24 });
  capBand(c);
} });

// ================= E · three: the base of the thumb, Brahma's; the first choice to sip from =================
SHOTS.push({ a: TL.E0, b: TL.F0 + .3, xf: .4, draw(c, u, t) {
  const fill = seg(t, TL.FIRST - .6, TL.SIP);
  const ex = SET.set(t, { hand: tiltTo(.5 * R_(t, TL.FIRST - .6, TL.SIP), [-.35, 0, .1]), pool: .55 * fill, poolO: { dz: .022, dx: .012 }, mk: { deva: .25, praja: .25, brahma: seg(t, TL.THREE - .15, TL.THREE + .3) } });
  const k = easeIO(seg(t, TL.E0, TL.F0 + .3));
  cam3(near(VIEW.brahma, k));
  render3(c, SET.S, CAM3, { exposure: ex, fx: lens(dist(W3(P.brahma)), 5) });
  badge(c, 3, W3(P.brahma), t, TL.THREE - .05, { dx: 0, dy: -220, r: 40, label: 'BRAHMA TIRTHA', sub: 'the root of the thumb', ly: -110, lsize: 46, out: TL.FIRST - .2 });
  topTitle(c, t, TL.FIRST - .1, TL.F0 + .3, 'SIP FROM HERE', 'the first choice', { y: 470, y0: 395, y1: 600, font: '700 80px Cinzel' });
  mark(c, 'v', W3(P.brahma), t, TL.SIP, { dx: 110, dy: -40, size: 44 });
  tag(c, 'MANUSMRITI 2.58', 540, 1150, t, TL.FIRST, { out: TL.F0 + .2, size: 24 });
  capBand(c);
} });

// ================= F · four: between thumb and first finger, the ancestors'; water for the dead =================
const F_TILT = TL.W4 - .1;
SHOTS.push({ a: TL.F0, b: F_TILT, xf: .4, draw(c, u, t) {
  const cold = R_(t, TL.F0, TL.PITRI);
  const ex = SET.set(t, { hand: REST, cold, pool: .8 * seg(t, TL.ANCESTORS - .4, F_TILT), til: seg(t, TL.ANCESTORS - .2, F_TILT), mk: { deva: .2 * (1 - cold), praja: .2 * (1 - cold), brahma: .2 * (1 - cold), pitri: [seg(t, TL.FOUR2 - .15, TL.FOUR2 + .3), 'cold'] } });
  const k = easeIO(seg(t, TL.F0, F_TILT));
  cam3(near(VIEW.pitri, k));
  render3(c, SET.S, CAM3, { exposure: ex, fx: lens(dist(W3(P.pitri)), 5, { temp: -.08 * cold, sat: 1 - .15 * cold }) });
  badge(c, 4, W3(P.pitri), t, TL.FOUR2 - .05, { dx: -60, dy: -220, r: 40, col: COLD, label: 'PITRI TIRTHA', sub: 'the ancestors’', ly: -110, lsize: 46, lcol: COLD, scol: COLD });
  capBand(c);
} });
SHOTS.push({ a: F_TILT, b: TL.G0 + .3, xf: .25, draw(c, u, t) {
  const tk = R_(t, F_TILT, F_TILT + .7), flow = seg(t, F_TILT + .4, TL.HERE4);
  const ex = SET.set(t, { hand: tiltTo(tk, SET.PITRI_E), cold: 1, pool: .8 - .6 * tk, poolO: { dx: .01 * tk }, til: 1, pitriFlow: flow, mk: { pitri: [1, 'cold'] } });
  const k = easeIO(seg(t, F_TILT, TL.G0 + .3));
  cam3({ pos: at3(k, [.2, .07, -.22], [.21, .05, -.24]), at: at3(k, [.035, -.04, -.035], [.035, -.055, -.035]), fov: 40 });
  render3(c, SET.S, CAM3, { exposure: ex, fx: lens(dist(W3([.05, -.02, -.012])), 4, { temp: -.08, sat: .85 }) });
  topTitle(c, t, TL.DEAD2 - .1, TL.G0 + .3, 'FOR THE DEAD', 'water and sesame, in tarpan', { col: COLD, glowCol: 'rgba(150,190,255,.35)', y: 470, y0: 395, y1: 600, font: '700 80px Cinzel' });
  capBand(c);
} });

// ================= G · the rule: when you sip, three (the best); one or two only if you must; four, never =================
// a word stamped by a badge (BEST, OK)
function stamp(c, txt, p, t, at, o = {}) {
  if (t < at) return;
  const [x0, y0] = toScreen3(p), a = clamp((t - at) * 5);
  text(c, txt, x0 + (o.dx || 0), y0 + (o.dy || 0), `700 ${o.size || 40}px Cinzel`, o.col || GOLD, { pop: t - at, alpha: a, spacing: 3, glow: ['rgba(6,5,10,.95)', 18] });
}
SHOTS.push({ a: TL.G0, b: TL.H0 + .3, xf: .4, draw(c, u, t) {
  const warm = 1 - R_(t, TL.G0, TL.G0 + 1.2), nv = seg(t, TL.R_FOUR - .1, TL.R_FOUR + .3), best = seg(t, TL.R_THREE - .1, TL.R_THREE + .3);
  const ok1 = seg(t, TL.R_ONE - .1, TL.R_ONE + .3), ok2 = seg(t, TL.R_TWO - .1, TL.R_TWO + .3);
  const ex = SET.set(t, { hand: REST, cold: warm, mk: { deva: .25 + .25 * ok1, praja: .25 + .25 * ok2, brahma: .5 + .9 * best, pitri: [1, nv > .2 ? 'red' : 'cold'] } });
  const k = easeIO(seg(t, TL.G0, TL.H0 + .3));
  cam3({ pos: at3(k, [.018, .58, .2], [.018, .56, .195]), at: [.018, 0, -.044], fov: 40 });   // a little higher than LOWV: BEST clears the caption
  render3(c, SET.S, CAM3, { exposure: ex, fx: lens(dist(W3([0, 0, -.03])), 3) });
  const GREY = '#B8B0A8';
  badges(c, t, -1, { ats: [-1, -1, -1, -1], cols: [ok1 > .2 ? GREY : GOLD, ok2 > .2 ? GREY : GOLD, GOLD, nv > .2 ? RED : COLD], alpha: [.55 + .3 * ok1, .55 + .3 * ok2, .6 + .4 * best, 1] });
  topTitle(c, t, TL.R_SIP - .1, TL.R_FOUR - .2, 'WHEN YOU SIP', null, { y: 470, y0: 400, y1: 540, font: '700 80px Cinzel' });
  stamp(c, 'BEST', W3(P.brahma), t, TL.R_THREE - .05, { dx: -150, dy: 0, size: 52 });
  mark(c, 'v', W3(P.brahma), t, TL.R_THREE + .1, { dx: 80, dy: -10, size: 40 });
  stamp(c, 'OK', W3(P.deva), t, TL.R_ONE - .05, { dx: 80, dy: 4, size: 34, col: GREY });
  stamp(c, 'OK', W3(P.praja), t, TL.R_TWO - .05, { dx: -80, dy: 4, size: 34, col: GREY });
  mark(c, 'x', W3(P.pitri), t, TL.NEVER - .05, { dx: 0, dy: 0, size: 64 });
  topTitle(c, t, TL.NEVER - .08, TL.H0 + .3, 'NEVER', 'न पित्र्येण कदाचन · Manusmriti 2.58', { col: RED, glowCol: 'rgba(255,90,70,.4)', y: 465, y0: 390, y1: 600, font: '700 110px Cinzel', sfont: `34px ${DEVA}` });
  flashK(c, t, TL.NEVER, '255,90,70', .25, 5);
  capBand(c);
} });

// ================= H · how: sip three times from the thumb's base; not hot, not foaming; wipe the lips twice =================
const sipK = (t) => { let k = 0; for (const s of TL.SIPS) k = Math.max(k, bump01(t, s - .75, s + .75)); return easeIO(k); };
SHOTS.push({ a: TL.H0, b: TL.I0 + .3, xf: .4, draw(c, u, t) {
  const sk = sipK(t), n = TL.SIPS.filter(s => t > s).length;
  const ex = SET.set(t, { hand: { pos: [0, .09 * sk, .1 * sk], rot: [.6 * sk, -.15 * sk, .25 * sk] }, pool: Math.max(.15, 1 - .3 * n), poolO: { dz: .02 * sk, dx: .01 * sk }, mk: { brahma: .6 + .4 * sk } });
  cam3({ pos: [0, .24, .24], at: [.01, 0, -.03], fov: 44 });
  render3(c, SET.S, CAM3, { exposure: ex, fx: lens(dist(W3([.01, 0, .01])), 3) });
  badge(c, 3, W3(P.brahma), t, TL.H0, { r: 34, alpha: 1 - clamp(sk * 3) });
  // the count
  const cx = [400, 540, 680];
  TL.SIPS.forEach((s, i) => {
    const a = seg(t, TL.H0, TL.H0 + .3) * (1 - seg(t, TL.I0, TL.I0 + .3)), on = t > s;
    c.save(); c.globalAlpha = a; c.fillStyle = on ? 'rgba(244,196,106,.95)' : 'rgba(14,9,8,.7)'; c.strokeStyle = GOLD; c.lineWidth = 4; c.beginPath(); c.arc(cx[i], 500, 46 * (on ? popK(t - s) : 1), 0, Math.PI * 2); c.fill(); c.stroke(); c.restore();
    text(c, String(i + 1), cx[i], 504, '700 54px Cinzel', on ? '#2A1608' : GOLD, { alpha: a });
  });
  text(c, 'SIPS', 540, 600, '700 40px Cinzel', CREAM, { alpha: seg(t, TL.H0, TL.H0 + .3) * (1 - seg(t, TL.I0, TL.I0 + .3)), spacing: 6, glow: ['rgba(6,5,10,.95)', 16] });
  tag(c, 'NOT HOT', 330, 700, t, TL.HOT - .05, { out: TL.I0, size: 36 });
  tag(c, 'NO FOAM', 750, 700, t, TL.FOAM - .05, { out: TL.I0, size: 36 });
  tag(c, 'WIPE THE LIPS × 2', 540, 800, t, TL.TWICE - .1, { out: TL.I0, size: 36 });
  tag(c, 'MANUSMRITI 2.60–61', 540, 1240, t, TL.H0 + .3, { out: TL.I0, size: 22, col: '#D8B070' });
  capBand(c);
} });

// ================= I · the ask: which one have you been sipping from? 1, 2, 3 or 4 =================
SHOTS.push({ a: TL.I0, b: TL.CARD, xf: .45, draw(c, u, t) {
  const gl = (w) => .4 + .6 * seg(t, w - .1, w + .2);
  const ex = SET.set(t, { hand: REST, mk: { deva: gl(TL.N1), praja: gl(TL.N2), brahma: gl(TL.N3), pitri: [gl(TL.N4), 'cold'] } });
  const k = easeIO(seg(t, TL.I0, TL.CARD));
  cam3(LOWV(k));
  render3(c, SET.S, CAM3, { exposure: ex, fx: lens(dist(W3([0, 0, -.03])), 3) });
  badges(c, t, -1, { ats: [TL.N1 - .05, TL.N2 - .05, TL.N3 - .05, TL.N4 - .05], cols: [GOLD, GOLD, GOLD, COLD], labels: ['GODS', 'CREATOR', 'BRAHMA', 'ANCESTORS'] });
  topTitle(c, t, TL.YOU - .1, TL.SAVE - .15, 'WHICH ONE?', null, { y: 470, y0: 400, y1: 540, font: '700 84px Cinzel' });
  topTitle(c, t, TL.SAVE - .1, TL.CARD + 1, 'SAVE THIS', 'for your next puja', { y: 460, y0: 385, y1: 590, font: '700 84px Cinzel' });
  capBand(c);
} });

// ================= the card =================
SHOTS.push({ a: TL.CARD, b: TL.END + 1, draw(c, u, t) {
  rkCardCine(c, u, t, { title: 'MEET OUR GODS', line: 'Picture books of our gods, for kids', price: 'The Navadurga Set is out now', note: 'Link in bio' });
} });
