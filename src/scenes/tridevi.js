// tridevi.js: "Lakshmi was born as BRAHMA'S sister" (ad 91), in the 3D style.
// The Devi Mahatmya's appendix, the Pradhanika Rahasya: first there was one goddess, Mahalakshmi; she took two more forms,
// dark Mahakali and moon-bright Mahasaraswati. Each mother bore a pair: Brahma and Lakshmi; Shiva and Saraswati; Vishnu
// and Gauri. Then she gave each sister to a different brother (Saraswati to Brahma, Gauri to Shiva, Lakshmi to Vishnu).
// Brahma and Saraswati made the cosmic egg, Shiva and Gauri broke it open, Vishnu and Lakshmi protect the world inside.
// No couple could do it alone: knowledge makes, strength opens, wealth keeps alive (our reading). Wealth without
// knowledge is wasted, knowledge without strength helpless, strength without both dangerous. And the chapter ends: all
// of them are one, Mahalakshmi, the mother of all. The ask: which one does your family pray to most? The card.
// STORYBOARD.md has the plan and the sources; the timeline (from the voice) is tridevi_tl.js, the set tridevi_sets.js.
LOOK.bloom = .1;   // matte (owner, 30 Oct): cine.js's own bloom low, no fx bloom
const CAPY = 1340;
const capBand = (c, a = .55) => band(c, 1190, 1500, a);
VO.caps.forEach((k, i) => say(i ? k.a : -1, k.b, k.text, { at: i ? k.at : k.at.map(() => -1), y: k.y ?? CAPY }));

const ST = STAGE;
const lens = (focus, ap = 5, o = {}) => ({ dof: { focus, aperture: ap, max: 12, nearK: .6 }, grade: { contrast: o.contrast ?? 1.08, sat: o.sat ?? 1.06, temp: o.temp ?? .03, lift: o.lift ?? 0, gamma: 1, gain: 1 } });
const dist = (p) => CAM3.position.distanceTo(V3(...p));
const at3 = (k, a, b) => a.map((v, i) => lerp(v, b[i], k));
const R_ = (t, a, b) => easeIO(seg(t, a, b));
const flashK = (c, t, at, col = '255,236,200', k = .4, rate = 5) => { const f = t > at ? Math.exp(-(t - at) * rate) : 0; if (f > .01) { c.save(); c.fillStyle = `rgba(${col},${k * f})`; c.fillRect(0, 0, W, H); c.restore(); } };
const GOLD = '#F4C46A', CREAM = '#FFF3DC', DEVA = '"Tiro Devanagari Sanskrit"';
const up3 = (p, dy) => [p[0], p[1] + dy, p[2]];
const GOD_P = k => up3(ST.godAt(k), ST.godTop[k] + .08), DAU_P = (k, x = 1) => up3(ST.dauPos(k, x), ST.DTOP + .06);
const DEV_ST = k => ST.devAt(k);   // a station's goddess seat
// a word over the top band: big gold, with a small line under it
function topTitle(c, t, at, out, big, small, o = {}) {
  const a = seg(t, at, at + .3) * (1 - seg(t, out, out + .3)); if (a <= 0) return;
  band(c, o.y0 ?? 390, o.y1 ?? 650, .6 * a);
  text(c, big, 540, o.y ?? 480, o.font || '700 92px Cinzel', o.col || GOLD, { pop: t - at, alpha: a, spacing: 5, glow: [o.glowCol || 'rgba(244,170,60,.4)', 28], maxW: 900 });
  if (small) text(c, small, 540, (o.y ?? 480) + (o.dy ?? 84), o.sfont || 'italic 40px Marcellus', CREAM, { pop: t - at - .2, alpha: a, glow: ['rgba(6,5,10,.95)', 16], maxW: 880 });
}
// a verse: Devanagari lines, then the English, on a dark band
function shloka(c, t, at, out, deva, eng, y = 470) {
  const a = seg(t, at, at + .35) * (1 - seg(t, out, out + .3)); if (a <= 0) return;
  band(c, y - 70, y + deva.length * 66 + eng.length * 46 + 20, .66 * a);
  deva.forEach((s, i) => text(c, s, 540, y + i * 66, `46px ${DEVA}`, '#FFE9C0', { alpha: a, glow: ['rgba(6,5,10,.95)', 16], maxW: 900 }));
  eng.forEach((s, i) => text(c, s, 540, y + deva.length * 66 + 4 + i * 46, 'italic 34px Marcellus', CREAM, { alpha: a, glow: ['rgba(6,5,10,.95)', 14], maxW: 900 }));
}
// a name over a figure (pinned to the world), small
const lab = (c, txt, p, t, at, o = {}) => pinLabel(c, txt, p, t, at, { size: 36, up: 80, ...o });

// ---------- story states ----------
const MOMS = { moms: { M: 1, K: 1, S: 1 }, split: { K: 1, S: 1 }, momLit: { M: .55, K: .55, S: .55 } };
const PAIRS = (o = {}) => ({ ...MOMS, gods: { M: 1, K: 1, S: 1 }, daus: { L: 1, SA: 1, G: 1 }, sib: { M: [1, 1], K: [1, 1], S: [1, 1] }, ...o });
const WED = (o = {}) => ({ ...MOMS, gods: { M: 1, K: 1, S: 1 }, daus: { L: 1, SA: 1, G: 1 }, cross: { L: 1, SA: 1, G: 1 }, wed: { M: [1, 1], K: [1, 1], S: [1, 1] }, ...o });
const ALL_EGG = { form: 1, open: 1, world: 1, protect: 1 };

// ================= A · the hook: Lakshmi and Brahma, then Saraswati and Shiva =================
SHOTS.push({ a: 0, b: TL.SARASWATI - .22, draw(c, u, t) {
  ST.set(t, PAIRS({ momLit: { M: .3, K: .3, S: .3 } }));
  const k = easeIO(seg(t, 0, TL.SARASWATI));
  cam3({ pos: at3(k, [.05, .62, 1.3], [0, .58, 1.0]), at: [0, .45, -1.45], fov: 46 });
  render3(c, ST.S, CAM3, { exposure: 1.0, fx: lens(dist([0, .4, -1.45]), 5) });
  lab(c, 'BRAHMA', GOD_P('M'), t, -1); lab(c, 'LAKSHMI', DAU_P('L', 0), t, -1);
  capBand(c);
} });
SHOTS.push({ a: TL.SARASWATI - .22, b: TL.B0 + .3, xf: .2, draw(c, u, t) {
  ST.set(t, PAIRS({ momLit: { M: .3, K: .3, S: .3 } }));
  const k = easeIO(seg(t, TL.SARASWATI - .22, TL.B0 + .3)), s = ST.STN.K;
  cam3({ pos: at3(k, [s[0] + .2, .8, s[2] + 2.75], [s[0] + .12, .72, s[2] + 2.4]), at: [s[0], .4, s[2]], fov: 42 });
  render3(c, ST.S, CAM3, { exposure: 1.0, fx: lens(dist([s[0], .4, s[2]]), 5) });
  lab(c, 'SARASWATI', DAU_P('SA', 0), t, TL.SARASWATI - .1); lab(c, 'SHIVA', GOD_P('K'), t, TL.SHIVAS - .15);
  capBand(c);
} });

// ================= B · the source: a palm-leaf manuscript opens =================
SHOTS.push({ a: TL.B0, b: TL.C0 + .3, xf: .35, draw(c, u, t) {
  ST.set(t, { bookOn: 1, book: seg(t, TL.DEVI - .5, TL.DEVI + .9), neb: 1 });
  const k = easeIO(seg(t, TL.B0, TL.C0 + .3));
  cam3({ pos: at3(k, [.25, 1.1, 3.55], [0, .86, 3.0]), at: at3(k, [0, .32, 2.35], [0, .34, 2.3]), fov: 38 });
  render3(c, ST.S, CAM3, { exposure: 1.0, fx: lens(dist([0, .34, 2.35]), 6) });
  topTitle(c, t, TL.DEVI - .1, TL.PRADHANIKA - .3, 'DEVI MAHATMYA', 'and its secret chapter…', { y: 480 });
  topTitle(c, t, TL.PRADHANIKA - .15, TL.C0, 'प्राधानिकं रहस्यम्', 'PRADHANIKA RAHASYA', { font: `100px ${DEVA}`, y: 470, dy: 92, y0: 380, y1: 650, sfont: '700 40px Cinzel' });
  tag(c, 'APPENDED TO THE DURGA SAPTASHATI', 480, 1466, t, TL.DEVI, { out: TL.C0, size: 22 });
  capBand(c);
} });

// ================= C · one goddess, Mahalakshmi; she becomes three =================
SHOTS.push({ a: TL.C0, b: TL.D0 + .3, xf: .4, draw(c, u, t) {
  const aM = seg(t, TL.ONE - .6, TL.ONE + .3), aK = seg(t, TL.MAHAK - .5, TL.MAHAK + .25), aS = seg(t, TL.MAHAS - .5, TL.MAHAS + .25);
  ST.set(t, { moms: { M: aM, K: aK, S: aS }, split: { K: seg(t, TL.MAHAK - .5, TL.MAHAK + .6), S: seg(t, TL.MAHAS - .5, TL.MAHAS + .6) },
    momLit: { M: 1, K: 1, S: 1 }, momGlow: { M: .25 + .6 * bump01(t, TL.ONE - .9, TL.ONE + .9), K: .7 * bump01(t, TL.MAHAK - .6, TL.MAHAK + 1), S: .7 * bump01(t, TL.MAHAS - .6, TL.MAHAS + 1) } });
  const k = easeIO(seg(t, TL.THREE - .3, TL.MAHAS + .5)), M = ST.MP.M;
  cam3({ pos: at3(k, [0, 1.6, -.75 + .2 * seg(t, TL.C0, TL.THREE)], [0, 2.05, 3.7]), at: at3(k, [0, 1.3, M[2]], [0, 1.15, -2.9]), fov: lerp(40, 50, k) });
  render3(c, ST.S, CAM3, { exposure: 1.0, fx: lens(dist([0, 1.3, M[2]]), lerp(5, 2, k)) });
  shloka(c, t, TL.MAHAL - .1, TL.THREE + .2, ['सर्वस्याद्या महालक्ष्मीः'], ['“the first of all is Mahalakshmi”'], 470);
  lab(c, 'MAHALAKSHMI', up3(M, 1.2), t, TL.THREE + .4, { sub: 'the One' });
  lab(c, 'MAHAKALI', up3(ST.MP.K, 1.08), t, TL.MAHAK + .2, { sub: 'dark' });
  lab(c, 'MAHASARASWATI', up3(ST.MP.S, 1.08), t, TL.MAHAS + .2, { sub: 'moon-bright', size: 32 });
  tag(c, 'PRADHANIKA RAHASYA 4–16', 420, 1466, t, TL.ONE, { out: TL.D0 });
  capBand(c);
} });

// ================= D · each mother bears a pair =================
const pairsAt = (t) => {
  const P = (w) => seg(t, w - .25, w + .3);
  const bo = (w) => seg(t, w + .6, w + 1.2);
  return { ...MOMS, momLit: { M: .8, K: .8, S: .8 },
    birth: { M: seg(t, TL.PAIR - .5, TL.PAIR + .7), K: seg(t, TL.PAIR - .4, TL.PAIR + .8), S: seg(t, TL.PAIR - .3, TL.PAIR + .9) },
    birthOut: { M: bo(TL.P_LA), K: bo(TL.P_SA), S: bo(TL.P_GA) },
    gods: { M: P(TL.P_BR), K: P(TL.P_SH), S: P(TL.P_VI) }, daus: { L: P(TL.P_LA), SA: P(TL.P_SA), G: P(TL.P_GA) },
    sib: { M: [seg(t, TL.P_LA + .1, TL.P_LA + .7), 1], K: [seg(t, TL.P_SA + .1, TL.P_SA + .7), 1], S: [seg(t, TL.P_GA + .1, TL.P_GA + .7), 1] } };
};
SHOTS.push({ a: TL.D0, b: TL.P_BR - .25, xf: .4, draw(c, u, t) {
  ST.set(t, pairsAt(t));
  const k = easeIO(seg(t, TL.D0, TL.P_BR));
  cam3({ pos: at3(k, [0, 3.0, 5.0], [0, 2.6, 4.3]), at: [0, .8, -1.3], fov: 50 });
  render3(c, ST.S, CAM3, { exposure: 1.0, fx: lens(dist([0, .5, -.5]), 2) });
  topTitle(c, t, TL.PAIR - .1, TL.P_BR, 'A PAIR', 'from each mother', { y: 480 });
  tag(c, 'PRADHANIKA RAHASYA 17–24', 420, 1466, t, TL.D0 + .2, { out: TL.E0 });
  capBand(c);
} });
const stationShot = (key, a, b, names) => SHOTS.push({ a, b, xf: .25, draw(c, u, t) {
  ST.set(t, pairsAt(t));
  const s = ST.STN[key], k = easeIO(seg(t, a, b)), back = key === 'M';
  const p0 = back ? [.05, .86, 1.45] : [s[0] + Math.sign(s[0]) * -.15, .86, s[2] + 2.75], p1 = back ? [0, .76, 1.15] : [s[0] + Math.sign(s[0]) * -.08, .74, s[2] + 2.4];
  cam3({ pos: at3(k, p0, p1), at: [s[0], .4, s[2]], fov: 42 });
  render3(c, ST.S, CAM3, { exposure: 1.0, fx: lens(dist([s[0], .4, s[2]]), 5) });
  for (const [txt, p, at, o] of names) lab(c, txt, p, t, at, o);
  tag(c, 'PRADHANIKA RAHASYA 17–24', 420, 1466, t, -9, { out: TL.E0 });
  capBand(c);
} });
stationShot('M', TL.P_BR - .25, TL.P_SH - .25, [['BRAHMA', GOD_P('M'), TL.P_BR], ['LAKSHMI', DAU_P('L', 0), TL.P_LA]]);
stationShot('K', TL.P_SH - .25, TL.P_VI - .25, [['SHIVA', GOD_P('K'), TL.P_SH], ['SARASWATI', DAU_P('SA', 0), TL.P_SA]]);
stationShot('S', TL.P_VI - .25, TL.E0 + .3, [['VISHNU', GOD_P('S'), TL.P_VI], ['GAURI', DAU_P('G', 0), TL.P_GA, { sub: 'Parvati' }]]);

// ================= E · she gives each sister to a different brother: the goddesses fly round the circle =================
const crossAt = (t) => {
  // all three circle clockwise together (none lands on a seat still taken), then each couple lights as it is named
  const xs = seg(t, TL.DIFFERENT - .25, TL.X_SA + .1), xg = xs, xl = xs;
  const sa = 1 - seg(t, TL.DIFFERENT - .2, TL.DIFFERENT + .6), fo = 1 - seg(t, TL.F0 - .6, TL.F0 + .2);
  return { ...MOMS, gods: { M: 1, K: 1, S: 1 }, daus: { L: 1, SA: 1, G: 1 }, cross: { L: xl, SA: xs, G: xg },
    sib: { M: [1, sa], K: [1, sa], S: [1, sa] }, trail: { SA: [xs, fo], G: [xg, fo], L: [xl, fo] },
    wed: { M: [seg(t, TL.X_BR + .3, TL.X_BR + .9), 1], K: [seg(t, TL.X_SH + .3, TL.X_SH + .9), 1], S: [seg(t, TL.X_VI + .3, TL.X_VI + .9), 1] },
    dauGlow: { SA: .35 * bump01(xs, 0, 1) + .6 * bump01(t, TL.X_BR - .2, TL.X_BR + 1.4), G: .35 * bump01(xg, 0, 1) + .6 * bump01(t, TL.X_SH - .2, TL.X_SH + 1.4), L: .35 * bump01(xl, 0, 1) + .6 * bump01(t, TL.X_VI - .2, TL.X_VI + 1.4) },
    godGlow: { M: .5 * bump01(t, TL.X_BR - .2, TL.X_BR + 1.4), K: .5 * bump01(t, TL.X_SH - .2, TL.X_SH + 1.4), S: .5 * bump01(t, TL.X_VI - .2, TL.X_VI + 1.4) } };
};
SHOTS.push({ a: TL.E0, b: TL.F0 + .3, xf: .4, draw(c, u, t) {
  const o = crossAt(t); ST.set(t, o);
  const k = easeIO(seg(t, TL.E0, TL.F0 + .3));
  cam3({ pos: at3(k, [-.3, 4.2, 4.0], [.3, 4.4, 3.6]), at: [0, .3, -1.05], fov: 52 });
  render3(c, ST.S, CAM3, { exposure: 1.0, fx: lens(dist([0, .2, -.4]), 1.5) });
  for (const [g, nm, w] of [['M', 'BRAHMA + SARASWATI', TL.X_BR - .1], ['K', 'SHIVA + GAURI', TL.X_SH - .1], ['S', 'VISHNU + LAKSHMI', TL.X_VI - .1]]) lab(c, nm, up3(ST.STN[g], ST.DTOP + .1), t, w, { up: 70, size: 30, col: GOLD });
  shloka(c, t, TL.DIFFERENT + .2, TL.F0, ['ब्रह्मणे प्रददौ पत्नीं महालक्ष्मीर्नृप त्रयीम्', 'रुद्राय गौरीं वरदां वासुदेवाय च श्रियम्'], ['“To Brahma she gave Trayi; to Rudra, Gauri;', 'to Vasudeva, Shri”'], 450);
  tag(c, 'PRADHANIKA RAHASYA 26', 420, 1466, t, TL.DIFFERENT, { out: TL.F0 });
  capBand(c);
} });

// ================= F · the cosmic egg: made, broken open, protected =================
const eggAt = (t) => ({
  form: seg(t, TL.EGG - 1.0, TL.EGG + .2), charge: seg(t, TL.E_SH + .4, TL.OPEN - .1), open: seg(t, TL.OPEN - .12, TL.OPEN + .7),
  world: seg(t, TL.OPEN, TL.OPEN + .8), protect: seg(t, TL.PROTECT - .2, TL.PROTECT + .9),
  streams: { M: seg(t, TL.E_BR, TL.EGG - .6), K: seg(t, TL.E_SH, TL.OPEN - .3), S: seg(t, TL.E_VI, TL.PROTECT) },
  streamsOut: { M: seg(t, TL.EGG + .2, TL.EGG + .8), K: seg(t, TL.OPEN + .4, TL.OPEN + 1), S: seg(t, TL.INSIDE + .2, TL.INSIDE + .9) },
});
const coupleLit = (t, w) => ({ M: .6 + .4 * bump01(t, w.M[0], w.M[1]), K: .6 + .4 * bump01(t, w.K[0], w.K[1]), S: .6 + .4 * bump01(t, w.S[0], w.S[1]) });
const eggShot = (a, b, p0, p1, look, verse) => SHOTS.push({ a, b, xf: .3, draw(c, u, t) {
  const E = eggAt(t);
  ST.set(t, WED({ egg: E, dauGlow: { SA: .5 * bump01(t, TL.E_BR - .2, TL.EGG + .3), G: .5 * bump01(t, TL.E_SH - .2, TL.OPEN + .3), L: .5 * bump01(t, TL.E_VI - .2, TL.INSIDE) }, godGlow: { M: .4 * bump01(t, TL.E_BR - .2, TL.EGG + .3), K: .4 * bump01(t, TL.E_SH - .2, TL.OPEN + .3), S: .4 * bump01(t, TL.E_VI - .2, TL.INSIDE) } }));
  const k = easeIO(seg(t, a, b)), sh = E.charge > 0 && E.open < .05 ? .012 * E.charge : 0;
  cam3({ pos: at3(k, p0, p1).map((v, i) => v + (i < 2 ? Math.sin(t * 60 + i * 2) * sh : 0)), at: look, fov: 44 });
  render3(c, ST.S, CAM3, { exposure: 1.0, fx: lens(dist(ST.EGGP), 4) });
  flashK(c, t, TL.OPEN, '255,236,200', .5, 4);
  shloka(c, t, a + .15, b - .1, verse[0], verse[1], 470);
  tag(c, 'PRADHANIKA RAHASYA 27–29', 440, 1466, t, -9, { out: TL.G0 });
  capBand(c);
} });
eggShot(TL.F0, TL.E_SH - .2, [0, 1.25, 3.3], [0, 1.3, 2.8], [0, 1.15, -.8], [['स्वरया सह सम्भूय विरिञ्चोऽण्डमजीजनत्'], ['“With Svara, Brahma made the egg”']]);
eggShot(TL.E_SH - .2, TL.E_VI - .2, [-2.75, 1.75, 2.95], [-2.5, 1.8, 2.6], [-.45, 1.05, -.05], [['बिभेद भगवान् रुद्रस्तद् गौर्या सह वीर्यवान्'], ['“mighty Rudra, with Gauri, broke it open”']]);
eggShot(TL.E_VI - .2, TL.G0 + .3, [2.75, 1.75, 2.95], [2.5, 1.8, 2.6], [.45, 1.05, -.05], [['पुपोष पालयामास तल्लक्ष्म्या सह केशवः'], ['“Keshava, with Lakshmi, nourished and protected it”']]);

// ================= G · no couple could do it alone: knowledge, strength, wealth =================
SHOTS.push({ a: TL.G0, b: TL.H0 + .3, xf: .4, draw(c, u, t) {
  const gl = (w) => .7 * bump01(t, w - .3, w + 2.2);
  ST.set(t, WED({ egg: ALL_EGG, dauGlow: { SA: gl(TL.KNOW), G: gl(TL.STRONG), L: gl(TL.WEALTH) } }));
  const k = easeIO(seg(t, TL.G0, TL.H0 + .3));
  cam3({ pos: at3(k, [0, 3.7, 4.9], [0, 4.1, 4.4]), at: [0, .55, -.45], fov: 52 });
  render3(c, ST.S, CAM3, { exposure: 1.0, fx: lens(dist([0, .6, -.4]), 1.5) });
  lab(c, 'KNOWLEDGE', DAU_P('SA'), t, TL.KNOW - .05, { sub: 'Saraswati', up: 40, dx: 150 });
  lab(c, 'STRENGTH', DAU_P('G'), t, TL.STRONG - .05, { sub: 'Gauri' });
  lab(c, 'WEALTH', DAU_P('L'), t, TL.WEALTH - .05, { sub: 'Lakshmi' });
  capBand(c);
} });

// ================= H · one without the others =================
// wealth without knowledge: Lakshmi lit, her coins spilling away; Saraswati dark behind her
SHOTS.push({ a: TL.H0, b: TL.L_KN - .25, xf: .4, draw(c, u, t) {
  const dk = R_(t, TL.H0 - .2, TL.H0 + .8);
  ST.set(t, WED({ lit: { SA: 1 - .9 * dk, G: 1 - .7 * dk }, stLit: { M: 1 - .9 * dk, K: .3, S: 1 }, coins: t - (TL.H0 + .5), key: .75, momLit: { M: .2, K: .2, S: .2 } }));
  const k = easeIO(seg(t, TL.H0, TL.L_KN));
  cam3({ pos: at3(k, [2.55, 1.1, 3.25], [2.4, 1.0, 2.95]), at: [1.35, .35, .5], fov: 40 });
  render3(c, ST.S, CAM3, { exposure: 1.0, fx: lens(dist(DEV_ST('S')), 6) });
  title(c, 'WASTED', 520, t, TL.WASTED - .05, { size: 110, out: TL.L_KN - .4 });
  capBand(c);
} });
// knowledge without strength: Saraswati lit, Gauri dark in the foreground
SHOTS.push({ a: TL.L_KN - .25, b: TL.L_ST - .25, xf: .3, draw(c, u, t) {
  ST.set(t, WED({ lit: { L: .1, G: .1 }, stLit: { M: 1, K: .05, S: .1 }, key: .75, momLit: { M: .2, K: .2, S: .2 } }));
  const k = easeIO(seg(t, TL.L_KN - .25, TL.L_ST));
  cam3({ pos: at3(k, [-1.15, .9, 1.9], [-1.0, .8, 1.6]), at: [.34, .42, -1.45], fov: 36 });
  render3(c, ST.S, CAM3, { exposure: 1.0, fx: lens(dist(DEV_ST('M')), 6, { temp: -.04 }) });
  title(c, 'HELPLESS', 520, t, TL.HELPLESS - .05, { size: 110, out: TL.L_ST - .4 });
  capBand(c);
} });
// strength without both: Gauri alone, in red light, her trident catching it
SHOTS.push({ a: TL.L_ST - .25, b: TL.I0 + .3, xf: .3, draw(c, u, t) {
  const r = R_(t, TL.DANGEROUS - .6, TL.DANGEROUS + .1);
  ST.set(t, WED({ lit: { L: .08, SA: .08 }, stLit: { M: .05, K: 1 - .5 * r, S: .05 }, red: r, key: .6 - .3 * r, momLit: { M: .1, K: .1, S: .1 }, neb: 1 - .5 * r }));
  const k = easeIO(seg(t, TL.L_ST - .25, TL.I0 + .3)), d = DEV_ST('K');
  cam3({ pos: at3(k, [d[0] + .35, .72, d[2] + 1.95], [d[0] + .2, .6, d[2] + 1.6]), at: [d[0], .45, d[2]], fov: 40 });
  render3(c, ST.S, CAM3, { exposure: 1.0, fx: lens(dist(d), 6, { sat: 1.1 }) });
  title(c, 'DANGEROUS', 520, t, TL.DANGEROUS - .05, { size: 104, col: '#FF7A5A' });
  capBand(c);
} });

// ================= I · the chapter ends: all are one, Mahalakshmi =================
SHOTS.push({ a: TL.I0, b: TL.J0 + .3, xf: .45, draw(c, u, t) {
  const m = seg(t, TL.ONE2 - .5, TL.ONE2 + .7), mo = seg(t, TL.MOTHER, TL.J0), back = seg(t, TL.ONE2 + .1, TL.ONE2 + 1.1);
  ST.set(t, WED({ moms: { M: 1, K: 1 - seg(t, TL.ONE2 + .7, TL.ONE2 + 1.1), S: 1 - seg(t, TL.ONE2 + .7, TL.ONE2 + 1.1) }, split: { K: 1 - back, S: 1 - back },
    momLit: { M: .7 + .5 * seg(t, TL.MAHAL2 - .3, TL.MAHAL2 + .3), K: .7, S: .7 }, momGlow: { M: .9 * seg(t, TL.ONE2, TL.MAHAL2 + .4) },
    merge: { L: [m, 1 - mo], SA: [m, 1 - mo], G: [m, 1 - mo] }, dauGlow: { L: .5 * m, SA: .5 * m, G: .5 * m } }));
  const k = easeIO(seg(t, TL.I0, TL.MOTHER)), M = ST.MP.M;
  cam3({ pos: at3(k, [0, 2.2, 4.6], [0, 1.65, -.95]), at: at3(k, [0, .9, -1.2], [0, 1.3, M[2]]), fov: lerp(48, 40, k) });
  render3(c, ST.S, CAM3, { exposure: 1.0, fx: lens(dist([0, 1.3, M[2]]), lerp(1.5, 5, k)) });
  title(c, 'MAHALAKSHMI', 500, t, TL.MAHAL2 - .05, { size: 92, sub: 'the mother of all' });
  tag(c, 'PRADHANIKA RAHASYA 30', 420, 1466, t, TL.ENDS, { out: TL.J0 });
  capBand(c);
} });

// ================= J · the ask: which one does your family pray to most? =================
SHOTS.push({ a: TL.J0, b: TL.CARD, xf: .45, draw(c, u, t) {
  const gl = (w) => .6 * bump01(t, w - .3, w + 1.6);
  ST.set(t, WED({ row: { L: 1, SA: 1, G: 1 }, wed: {}, dauGlow: { L: gl(TL.A_LA), SA: gl(TL.A_SA), G: gl(TL.A_PA) }, momLit: { M: .35, K: .35, S: .35 }, stLit: { M: .2, K: .2, S: .2 } }));
  const k = easeIO(seg(t, TL.J0, TL.CARD));
  cam3({ pos: at3(k, [0, .85, 4.65], [0, .8, 4.4]), at: [0, .3, 1.2], fov: 50 });
  render3(c, ST.S, CAM3, { exposure: 1.0, fx: lens(dist([0, .4, 1.25]), 3) });
  for (const [d, nm, w] of [['L', 'LAKSHMI', TL.A_LA], ['SA', 'SARASWATI', TL.A_SA], ['G', 'PARVATI', TL.A_PA]]) {
    const [x, y] = toScreen3(up3(ST.ROW[d], ST.DTOP + .1));
    text(c, nm, x, y - 30, '700 38px Cinzel', GOLD, { pop: t - w, alpha: seg(t, w - .1, w + .15), spacing: 2, glow: ['rgba(6,5,10,.95)', 18] });
  }
  topTitle(c, t, TL.YOUR - .1, TL.COMMENT - .2, 'WHICH ONE?', null, { y: 478, y0: 405, y1: 545, font: '700 80px Cinzel' });
  topTitle(c, t, TL.COMMENT - .1, TL.CARD + 1, 'YOUR STATE?', null, { y: 478, y0: 405, y1: 545, font: '700 80px Cinzel' });
  capBand(c);
} });

// ================= the card =================
SHOTS.push({ a: TL.CARD, b: TL.END + 1, draw(c, u, t) {
  rkCardCine(c, u, t, { title: 'MEET OUR GODS', line: 'Picture books of our gods, for kids', price: 'The Navadurga Set is out now', note: 'Link in bio' });
} });
