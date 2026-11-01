// parshu3_props.js: sets, props and the cast for parshu3.js (ad 70, "His father ordered PARSHURAMA to KILL HIS MOTHER",
// Parshurama series Part 3). Loaded after parshu1_props.js (PK, CP, PR, TK, shockRing, smokePuff, sparkleBurst, diya,
// sunsetRidge) and parshu2_props.js (P2, halo, lightBeam, navCard), and the shared rigs (parshurama.js, narada.js,
// parvati.js, ramayan.js: valmiki(), dasharatha(), kaikeyi()). Pure functions of their arguments (and T for boil).
//   P3                                                         the palette
//   jamadagni, renuka, brother, BROS, chitraratha, citraQueen  the cast
//   bloodGround, ashramSet, riverSet, grade, whipStreaks        sets and grades
//   waterPot, lotusGarland, drips, eyeBlaze, curseWave, nameTag, wick   props
const P3 = {
  ink: '#2B2233', cream: '#FFF5E2', gold: '#F5C542', red: '#FF5A3C', redDk: '#B8241E', violet: '#B07CFF', violetDk: '#5A2E9E',
  blood: '#4A0E1C', bloodMid: '#7A1A26', bloodLt: '#A8322E',
  night: '#141A36', dusk: '#3A4A8A', sunset: '#C8402A',
  water: '#5EA8C8', waterDk: '#3A7EA0', waterLt: '#BFE6F2', lotus: '#F48AA8', lotusDk: '#D0587E', lotusC: '#FFE08A',
  clay: '#B85A32', clayDk: '#86391E', clayLt: '#E08A5A', drop: '#BFE6F6',
};

// ---------- the cast ----------
// Jamadagni, Bhrigu's line, "of great austerities" (MBh 3.116.1): Valmiki's rig, a long dark-grey beard, an ochre dhoti
const JAMA_PAL = { hair: '#4A4248', hairLt: '#7A7078', dhoti: '#B8662A', dhotiDk: '#8A4618', dhotiLt: '#E09A5A', border: '#5A1E1A',
  shawl: '#EADBC0', shawlDk: '#C8B48E', skin: '#C98E66', skinDk: '#A06A46', skinLt: '#E6B28A' };
function jamadagni(x, y, u, o = {}) { return valmiki(x, y, u, { beard: '#5A5258', beardLen: 1, ...o, pal: { ...JAMA_PAL, ...(o.pal || {}) } }); }
// Renuka, King Prasenajit's daughter (3.116.2): Parvati's rig in a rose saree with a turmeric blouse, no crown
const RENU_PAL = { saree: '#C8456A', sareeDk: '#962E4E', sareeLt: '#EE7E9A', blouse: '#E8A030', blouseDk: '#B87818', bangle: '#E8A030',
  skin: '#EBB68E', skinDk: '#C88E66', skinLt: '#FAD6B6', lip: '#C24E5E' };
function renuka(x, y, u, o = {}) { return parvati(x, y, u, { crown: false, ...o, pal: { ...RENU_PAL, ...(o.pal || {}) }, col: RENU_PAL.skin, dk: RENU_PAL.skinDk, lt: RENU_PAL.skinLt }); }
// the four elder sons (3.116.10: Rumanvan the eldest, Sushena, Vasu, Vishvavasu): Parshurama's rig without the axe, the
// quiver, the hide or the aura, bearded (they are older than Rama), each in his own cloth
const BROS = [
  { name: 'RUMANVAN', beard: '#2A1E20', beardLen: .85, pal: { dhoti: '#C98A3A', dhotiDk: '#9A6420', dhotiLt: '#E8B46A', border: '#6A2E1E', skin: '#D49A6E', skinDk: '#AE744C', skinLt: '#EEC09A' } },
  { name: 'SUSHENA', beard: '#2E2024', beardLen: .7, pal: { dhoti: '#A8483A', dhotiDk: '#7A2E24', dhotiLt: '#D2786A', border: '#3E1A18', skin: '#DCA478', skinDk: '#B47E54', skinLt: '#F2C8A2' } },
  { name: 'VASU', beard: '#30221E', beardLen: .55, pal: { dhoti: '#8E8A3E', dhotiDk: '#666226', dhotiLt: '#B8B46A', border: '#4A3A1A', skin: '#D09468', skinDk: '#A86E46', skinLt: '#EABA92' } },
  { name: 'VISHVAVASU', beard: '#2A1E22', beardLen: .4, pal: { dhoti: '#E2D2AE', dhotiDk: '#B8A47C', dhotiLt: '#F6ECD4', border: '#8A3A24', skin: '#DCA67C', skinDk: '#B48058', skinLt: '#F2CAA6' } },
];
function brother(i, x, y, u, o = {}) {
  const B = BROS[i];
  return parshurama(x, y, u, { flip: 1, axe: false, quiver: false, hide: false, aura: 0, beard: B.beard, beardLen: B.beardLen, boilKey: 'bro' + i, seed: 20 + i * 3,
    ...o, pal: { ...B.pal, ...(o.pal || {}) } });
}
// King Chitraratha of Martikavata (3.116.6), sporting in the water with his wife, wearing a lotus garland (3.116.7):
// Dasharatha's rig, young (a black beard), a sky-blue and gold dhoti; his queen on Kaikeyi's rig in sea-green
const CITRA_PAL = { hair: '#221A22', hairLt: '#4A3E4A', dhoti: '#3E86B8', dhotiDk: '#2A5E88', dhotiLt: '#7AB6DE', border: '#F2C230', skin: '#E8B48C', skinDk: '#C48C64', skinLt: '#F8D2B2' };
function chitraratha(x, y, u, o = {}) { return dasharatha(x, y, u, { beard: '#2A2028', ...o, pal: { ...CITRA_PAL, ...(o.pal || {}) } }); }
const CQ_PAL = { saree: '#3AA88A', sareeDk: '#257A62', sareeLt: '#76D2B4', blouse: '#E8506A', blouseDk: '#B83450', bangle: '#F2C230' };
function citraQueen(x, y, u, o = {}) { return kaikeyi(x, y, u, { ...o, pal: { ...CQ_PAL, ...(o.pal || {}) } }); }
// a silhouette palette: every colour one dark, for a figure against the sun
const silPal = (P, col = '#1C0E16') => Object.fromEntries(Object.keys(P).map(k => [k, col]));

// ---------- props ----------
// a clay water pot on her hip, in an arm hook (hand space, upright): s scales it
function waterPot(u, sw, s = 1) {
  const P = pts => U(pts.map(([a, b]) => [a * s, b * s]), u);
  paint(P([[-1.2, -1.6], [-2.1, -.4], [-2.2, 1.2], [-1.4, 2.5], [0, 2.9], [1.4, 2.5], [2.2, 1.2], [2.1, -.4], [1.2, -1.6]]), { wash: P3.clay, fill: P3.clayDk, fillOp: 60, tex: .5, ink: P3.ink, sw: sw * .7, curv: .5 });
  paint(rrPts(-1.15 * u * s, -2.3 * u * s, 2.3 * u * s, .8 * u * s, .3 * u * s), { wash: P3.clayLt, ink: P3.ink, sw: sw * .6 });
  inkLine(P([[-1.9, .4], [0, .75], [1.9, .4]]), sw * .5, P3.clayDk, 'inkfine', .5);
  paint(ellPts(-1 * u * s, -.4 * u * s, .35 * u * s, .7 * u * s, 8), { wash: '#F2B08A', washOp: 120, ink: null });
}
// a garland of pink lotuses round a neck at (x, y), w across the shoulders
function lotusGarland(x, y, w, key = 'lotg') {
  boilSeed(key);
  for (let i = 0; i <= 8; i++) {
    const k = i / 8, a = Math.PI * k, px = x - Math.cos(a) * w * .5, py = y + Math.sin(a) * w * .55;
    paint(ellPts(px, py, w * .09, w * .07, 10), { wash: i % 2 ? P3.lotus : P3.lotusDk, ink: P3.ink, sw: .5 });
    paint(ellPts(px, py - w * .01, w * .03, w * .025, 6), { wash: P3.lotusC, ink: null });
  }
}
// water dripping from (x, y) down to the ground at gy: a few falling drops
function drips(x, y, w, gy, t, key = 'drip', n = 6) {
  boilSeed(key);
  for (let i = 0; i < n; i++) {
    const px = x + (hash(i * 3.7) - .5) * w, py = y + frac(hash(i * 5.3) + t * (.7 + .3 * hash(i))) * (gy - y);
    paint([[px, py - 9], [px + 4, py + 2], [px, py + 6], [px - 4, py + 2]], { wash: P3.drop, washOp: 220, ink: null, curv: .6 });
  }
}
// burning eyes: two glows at the eyes of a head at (hx, hy), u the rig's unit, k 0..1
function eyeBlaze(hx, hy, u, k, col = P3.red, key = 'blaze') {
  if (k <= 0) return;
  boilSeed(key);
  for (const s of [-1, 1]) { glow(hx + s * 1.25 * u, hy + .1 * u, 2.4 * u * (.9 + .1 * Math.sin(T * 13 + s)), col, .9 * k); glow(hx + s * 1.25 * u, hy + .1 * u, .9 * u, '#FFFFFF', .7 * k); }
}
// a curse rolling out from (x, y): a band of violet rings and sparks, a 0..1
function curseWave(x, y, a, key = 'curse') {
  if (a <= 0 || a >= 1) return;
  for (let i = 0; i < 3; i++) { const k = clamp(a * 1.4 - i * .18); if (k > 0 && k < 1) shockRing(x, y, 80 + k * 1100, 1 - k, key + i, i % 2 ? P3.violetDk : P3.violet, .3); }
  boilSeed(key + 's');
  for (let i = 0; i < 14; i++) { const ang = hash(i * 2.9) * TAU, d = 60 + a * 900 * (.5 + .5 * hash(i * 4.1)); paint(starPts(x + Math.cos(ang) * d, y + Math.sin(ang) * d * .4, 14 * (1 - a), .35, 4), { wash: '#E6D2FF', ink: null }); }
}
// a small name under a figure (the brothers): a dark pill with cream letters
function nameTag(txt, x, y, k = 1, key = 'tag') {
  if (k <= 0) return;
  flushLetters();
  boilSeed(key);
  const w = txt.length * 19 + 34;
  paint(rrPts(x - w / 2, y - 24, w, 48, 22), { wash: '#1C1424', washOp: 200 * k, ink: null });
  letter(txt, x, y + 2, 34, P3.cream, { screen: false, ink: false, pop: k * 2, rot: 0 });
}
// a lamp's wick after the flame dies: a red ember and a thin curl of smoke, age seconds since
function wick(x, y, s, age, key = 'wick') {
  boilSeed(key);
  const e = clamp(1 - age / 1.6);
  if (e > 0) { glow(x, y, s * 1.4, '#FF5A2A', .5 * e); paint(ellPts(x, y, s * .2, s * .2, 8), { wash: '#FF6A3A', washOp: 255 * e, ink: null }); }
  for (let i = 0; i < 7; i++) {
    const k = clamp(age * .5 - i * .06), py = y - k * s * 9 - i * s * .9, px = x + Math.sin(age * 1.8 + i * .9) * s * (.3 + i * .12);
    if (k > 0) paint(ellPts(px, py, s * (.25 + i * .07), s * (.35 + i * .05), 8), { wash: '#B8B0C0', washOp: 110 * (1 - i / 7) * clamp(3 - age * .6), ink: null });
  }
}

// ---------- sets ----------
// the hook's ground: a deep blood-maroon plain, a darker vignette, slow embers rising
function bloodGround(t, cx = 540, cy = 1150) {
  boilSeed('blood');
  paint(rectPts(-200, -300, W + 400, H + 600), { wash: P3.blood, ink: null });
  paint(ellPts(cx, cy, 700, 820, 30), { fill: P3.bloodMid, fillOp: 200, bleed: .35, tex: .4, border: .2, ink: null });
  paint(ellPts(cx, cy - 60, 380, 460, 26), { fill: P3.bloodLt, fillOp: 110, bleed: .35, tex: .4, border: .2, ink: null });
  boilSeed('embers');
  for (let i = 0; i < 16; i++) {
    const x = 40 + hash(i * 3.3) * 1000 + 30 * Math.sin(t * .8 + i), y = H + 40 - frac(hash(i * 7.1) + t * (.04 + .03 * hash(i * 2))) * (H + 120);
    paint(ellPts(x, y, 4 + 4 * hash(i), 4 + 4 * hash(i), 8), { wash: i % 3 ? '#FF8A4A' : '#FFD08A', washOp: 200, ink: null });
  }
}
// the ashram: the Ramayan kit's forest hermitage, in a grade ('day' | 'dusk' | 'sunset' | 'night' | 'dawn') laid over
// the set only (call grade() again after the cast for the cast)
const GRADES = { day: null, dusk: ['#2A3A7A', .42], sunset: ['#B8302A', .3], night: ['#0E1430', .62], dawn: ['#F2A07A', .18], violet: ['#4A1E7A', .45] };
function ashramSet(t, g = 'day', key = 'p3as') {
  ashram(t, key);
  grade(g);
}
function grade(g, mul = 1) {
  const G = GRADES[g]; if (!G) return;
  flushLetters();
  paint(rectPts(-300, -300, W + 600, H + 600), { wash: G[0], washOp: 255 * G[1] * mul, ink: null });
}
// the river at noon: a bright sky, the far bank, the water; mid() draws what is IN the water (the king and queen), then
// the water's near band laps over them at y = o.waistY, and the near bank with reeds (top at y = o.bankY)
function riverSet(t, mid, o = {}) {
  const wy = o.waistY ?? 1330, by = o.bankY ?? 1560, key = 'p3rv';
  boilSeed(key + 'sky');
  paint(rectPts(-300, -300, W + 600, 1500), { wash: '#8CC8EA', ink: null });
  paint(ellPts(700, 1050, 1000, 380, 26), { fill: '#E8F4F2', fillOp: 220, bleed: .3, tex: .4, border: .2, ink: null });
  boilSeed(key + 'far');
  paint([[-300, 1130], [100, 1060], [400, 1090], [800, 1040], [1380, 1080], [1380, 1200], [-300, 1200]], { wash: P1.leafDk, ink: null, curv: .6 });
  for (let i = 0; i < 8; i++) { const x = -100 + i * 180 + 40 * hash(i * 3.1), r = 60 + 40 * hash(i * 5.7); paint(ellPts(x, 1090 - r * .4, r, r * .8, 14, 2), { wash: i % 2 ? P1.leaf : P1.leafDk, ink: null }); }
  boilSeed(key + 'water');
  paint(rectPts(-300, 1150, W + 600, by - 1150 + 40), { wash: P3.water, ink: null });
  paint(ellPts(540, 1250, 900, 90, 22), { fill: P3.waterLt, fillOp: 70, bleed: .3, tex: .4, ink: null });
  if (mid) mid();
  boilSeed(key + 'near');
  paint(rectPts(-300, wy, W + 600, by - wy + 40), { wash: P3.water, washOp: 235, ink: null });
  paint(ellPts(540, wy + 90, 900, 120, 22), { fill: P3.waterDk, fillOp: 90, bleed: .3, tex: .4, ink: null });
  boilSeed(key + 'ripples');
  for (let i = 0; i < 12; i++) { const y = wy + 10 + hash(i * 2.3) * (by - wy - 30), x = frac(hash(i * 7.7) + t * .03) * 1500 - 200; inkLine([[x, y], [x + 90, y]], 1.6, P3.waterLt, 'inkfine', 0); }
  boilSeed(key + 'bank');
  paint([[-300, by], [200, by - 30], [700, by + 5], [1380, by - 25], [1380, 2400], [-300, 2400]], { wash: P1.grass, fill: P1.grassDk, fillOp: 60, tex: .5, ink: P1.ink, sw: .9, curv: .5 });
  boilSeed(key + 'reeds');
  for (let i = 0; i < 14; i++) { const x = -40 + i * 85 + 30 * hash(i * 1.7), h = 70 + 60 * hash(i * 4.1), sw2 = Math.sin(t * 1.5 + i) * 8; inkLine([[x, by + 10], [x + sw2 * .5, by + 10 - h * .6], [x + sw2, by + 10 - h]], 2, i % 2 ? P1.reed : P1.reedDk, 'ink', .5); }
}
// a whip-pan's motion streaks over the frame, p 0..1 (dir ±1)
function whipStreaks(p, cols = ['#2A0A14', '#5A1A22'], key = 'whip') {
  if (p <= 0) return;
  flushLetters(); boilSeed(key);
  for (let i = 0; i < 16; i++) { const y = hash(i * 2.7) * 1920; inkLine([[-100, y], [1180, y]], 60 * p, cols[i % 2], 'ink', 0); }
}
// the curse on a narada-rig figure: blank white eyes (no pupils) and a violet fog round the head, k 0..1
function dazed(x, y, u, o, k, key = 'dazed') {
  if (k <= 0) return;
  const [hx, hy] = naradaHead(x, y, u, o);
  boilSeed(key);
  glow(hx, hy - u, 4.5 * u, P3.violetDk, .55 * k);
  for (const s of [-1, 1]) { const [ex, ey] = naradaEye(x, y, u, o, s); paint(ellPts(ex, ey, .66 * u, .58 * u, 14), { wash: '#F4EEFF', washOp: 255 * k, ink: P3.ink, sw: .7 }); }
  for (let i = 0; i < 3; i++) { const a = T * 2.2 + i * TAU / 3; paint(starPts(hx + Math.cos(a) * 3.2 * u, hy - 3.2 * u + Math.sin(a) * .8 * u, .7 * u, .4, 4), { wash: '#D8C2FF', washOp: 220 * k, ink: null }); }
}
