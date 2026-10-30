// rounds3.js: "How many times should you walk around HANUMAN?" (ad 65), Pradakshina Part 3, in the 3D style: Part 2's
// dusk courtyard, Shiva's shrine in the middle, four new corners for the gods viewers asked for: Krishna four (the same
// as Vishnu), Murugan six, the Navagraha nine, Hanuman three, or eleven in many temples. The twist: only Krishna's
// number is in a Purana (Part 2's Narasimha Purana verse, HBV 8.394: four for Keshava); Murugan's six is a South
// Indian verse with no known source; Hanuman's and the Navagraha's are temple custom: follow your temple's priest. The
// screenshot board, the ask (3 or 11?), Part 4's gods, the card. STORYBOARD.md has the plan and the sources; the
// timeline (from the voice) is rounds3_tl.js, the courtyard, platform, rings and emblems rounds3_props.js.
const W3 = world3(), SC = W3.scene, CEN = shrine3(SC, { court: false }), CT = court5(SC);
let FLAG = null, NAV = null;
GODS.forEach(g => {
  const grp = new THREE.Group(); grp.position.set(g.at[0], 0, g.at[1]); grp.scale.setScalar(SK); SC.add(grp);
  if (g.id === 'nava') { NAV = navagraha3(grp); g.T = NAV; }
  else g.T = shrine3(grp, { court: false, soma: false, linga: false, lights: false });
  if (g.id === 'hanuman') FLAG = flag3(grp);
  g.rings = []; for (let k = 0; k < g.n; k++) g.rings.push(ring3(SC, g.at[0], g.at[1], SK, k * g.gap, { col: g.id === 'hanuman' && k >= 3 ? '#FF7A3A' : '#FFC860' }));
});
const ALL = GODS.flatMap(g => g.rings);
const reset = () => ALL.forEach(r => trailSet(r, 0));
const lit = t => { CEN.set(t, { lamps: 1, water: 1 }); GODS.forEach(g => g.T.set(t, { lamps: 1 })); CT.set(t); FLAG.set(t); };
const god = id => GODS.find(g => g.id === id);
const showAll = (a = .85) => GODS.forEach(g => g.rings.forEach(r => trailSet(r, a)));
// the map from 70 m up: dusk's fog would wash it out, so push it back
const mapMood = () => { const ex = W3.mood('dusk', { hemi: 2.3 }); SC.fog.near = 90; SC.fog.far = 220; return ex * 1.15; };

const CAPY = 1290, MAPY = 1440;   // over the map, lower: under the south shrines
VO.caps.forEach((k, i) => say(i ? k.a : -1, k.b, k.text, { at: i ? k.at : k.at.map(() => -1), y: ['asked', 'twist', 'custom', 'save'].includes(k.id) ? MAPY : CAPY }));

// the map: straight down, north up, the whole courtyard above the captions
const mapCam = (u, h0 = 80, h1 = 77, zc = 1.6, xc = 0) => cam3({ pos: [xc, lerp(h0, h1, easeIO(u / 4)), zc + .001], at: [xc, 0, zc], up: [0, 0, -1], fov: 40 });
// a corner shrine from the courtyard side, circling it clockwise: R out, h up, a0 → a1 (radians, 0 = east, π/2 = south)
const orbit = (g, k, R, h, a0, a1, o = {}) => { const a = lerp(a0, a1, k), [cx, cz] = g.at; return cam3({ pos: [cx + Math.cos(a) * R, h, cz + Math.sin(a) * R], at: [cx, o.atY ?? 5, cz], fov: o.fov ?? 54 }); };
// the count beside a god's emblem as their rounds land: the number done so far, each pops as its ring closes
function tally(c, id, t, t0, d, n, o = {}) {
  const k = clamp(Math.floor((t - t0 + .04) / d), 0, n); if (k < 1) return 0;
  count(c, String((o.base || 0) + k), id, t, t0 + k * d - .04, o); return k;
}
// every god's count on the map (o.size, o.alpha, o.pulse: a function of the god's index → extra size)
const allCounts = (c, t, t0, o = {}) => GODS.forEach((g, i) => count(c, g.count || String(g.n), g.id, t, t0 + i * .16,
  { dx: g.id === 'hanuman' ? 2.5 : 1.6, size: (o.size || 64) + (o.pulse ? o.pulse(i) : 0), col: g.id === 'hanuman' ? '#FF9A6A' : '#FFE2A0', alpha: o.alpha }));
// the series tag at the top of the safe band
function seriesTag(c, txt, t, at, o = {}) {
  const k = popK(t - at), w = o.w || 500;
  c.save(); c.translate(540, o.y || 470); c.scale(k, k); c.fillStyle = 'rgba(20,12,8,.72)'; c.strokeStyle = 'rgba(244,196,106,.85)'; c.lineWidth = 3;
  c.beginPath(); c.roundRect(-w / 2, -38, w, 76, 38); c.fill(); c.stroke(); c.restore();
  text(c, txt, 540, (o.y || 470) + 2, '700 36px Cinzel', '#F4C46A', { spacing: 2, alpha: Math.min(1, k) });
}
// Hanuman's rounds: three in gold, then (on "ELEVEN") eight more in vermilion; the count climbs through them
function hanumanRounds(t, a = 1) {
  const g = god('hanuman');
  ringsShow(g.rings.slice(0, 3), t, ...TL.ringsF, { a });
  ringsShow(g.rings.slice(3), t, ...TL.ringsF2, { a });
}

// ================= A · the hook: Hanuman's shrine at dusk, his gada in light, the saffron flag =================
SHOTS.push({ a: 0, b: TL.B0 + .4, draw(c, u, t) {
  reset(); const ex = W3.mood('dusk'); lit(t);
  const g = god('hanuman'), k = u / (TL.B0 + .4);
  render3(c, SC, orbit(g, k, lerp(13.5, 12.8, k), 4.6, .62, .74, { atY: 6.9 }), { exposure: ex * 1.05 });
  const e = emblemAt('hanuman'); emblem(c, 'hanuman', e.x, e.y, Math.min(e.s, 150), t, 1);
  seriesTag(c, 'PRADAKSHINA · PART 3', t, -1);
} });

// ================= B · you asked for four more gods: the map, a question mark by each corner =================
SHOTS.push({ a: TL.B0, b: TL.C0 + .4, xf: .4, draw(c, u, t) {
  reset(); const ex = mapMood(); lit(t);
  render3(c, SC, mapCam(u), { exposure: ex * 1.1 });
  emblems(c, t, { a: id => .9 + .1 * Math.sin(t * 4), max: 60 });
  GODS.forEach((g, i) => count(c, '?', g.id, t, TL.FOUR_MORE - .2 + i * .16, { dx: 1.6, size: 66, col: '#FF9A6A' }));
} });

// ================= C–F · each god's rounds: the camera on their shrine, the rings landing, the count =================
const godShot = (id, a, b, rings, cam, o = {}) => SHOTS.push({ a, b, xf: .4, draw(c, u, t) {
  reset(); const ex = W3.mood('dusk'); lit(t);
  const g = god(id), k = u / (b - a);
  if (id === 'hanuman') hanumanRounds(t); else ringsShow(g.rings, t, ...rings, { a: 1 });
  render3(c, SC, orbit(g, easeIO(k), ...cam), { exposure: ex });
  band(c, 1130, 1450, .5);
  const e = emblemAt(id); emblem(c, id, e.x, e.y, Math.min(e.s, 170), t, seg(t, a + .1, a + .5));
  if (id !== 'hanuman') return tally(c, id, t, ...rings, g.n);
  const n3 = clamp(Math.floor((t - TL.ringsF[0] + .04) / TL.ringsF[1]), 0, 3), n8 = clamp(Math.floor((t - TL.ringsF2[0] + .04) / TL.ringsF2[1]), 0, 8);
  if (n8) count(c, String(3 + n8), id, t, TL.ringsF2[0] + n8 * TL.ringsF2[1] - .04, { col: '#FF9A6A' });
  else if (n3) count(c, String(n3), id, t, TL.ringsF[0] + n3 * TL.ringsF[1] - .04);
} });
godShot('krishna', TL.C0, TL.D0 + .4, TL.ringsC, [10, 12.5, .55, .8]);
godShot('murugan', TL.D0, TL.E0 + .4, TL.ringsD, [11.5, 14, -.75, -.5]);
godShot('nava', TL.E0, TL.F0 + .4, TL.ringsE, [11.5, 9.5, -1.3, -1.02, { atY: 1.2 }]);
godShot('hanuman', TL.F0, TL.G0 + .4, null, [14.5, 16, 1.75, 2.05]);

// ================= G · but only ONE is in a Purana: the map, every count, each flickering in turn =================
SHOTS.push({ a: TL.G0, b: TL.H0 + .4, xf: .4, draw(c, u, t) {
  reset(); const ex = mapMood(); lit(t); showAll(.85);
  render3(c, SC, mapCam(u, 80, 78), { exposure: ex * 1.1 });
  emblems(c, t, { a: .9, max: 60 });
  band(c, 1290, 1490, .45);
  allCounts(c, t, TL.G0 + .1, { pulse: i => 14 * Math.max(0, Math.sin(clamp((t - TL.ONE - i * .22) / .3) * Math.PI)) });
  GODS.forEach((g, i) => count(c, '?', g.id, t, TL.PURANA + i * .1, { dx: 1.6, dy: .8, size: 40, col: '#CFC2B0' }));
} });

// ================= H · Krishna's four: Part 2's verse, the Narasimha Purana =================
SHOTS.push({ a: TL.H0, b: TL.I0 + .4, xf: .4, draw(c, u, t) {
  reset(); const ex = W3.mood('dusk'); lit(t);
  const g = god('krishna'), k = easeIO(u / (TL.I0 + .4 - TL.H0));
  g.rings.forEach(r => trailSet(r, .9));
  render3(c, SC, orbit(g, k, 11, 12, .9, 1.1), { exposure: ex });
  const e = emblemAt('krishna'); emblem(c, 'krishna', e.x, e.y, Math.min(e.s, 170), t, 1);
  count(c, '4', 'krishna', t, TL.H0 + .2);
  tagAt(c, 'krishna', t, TL.KV + .3, { size: 32 });
  band(c, 1130, 1450, .5);
  const a = seg(t, TL.KV + .6, TL.KV + 1.1);
  band(c, 780, 1080, .75 * a);
  text(c, 'चतस्रः केशवे दद्यात्', 520, 870, '64px "Tiro Devanagari Sanskrit"', '#FFE2A0', { alpha: a, glow: ['rgba(255,170,60,.8)', 22], maxW: 860 });
  text(c, '“Give four rounds to Keshava”', 520, 950, '40px Marcellus', '#FFF3DC', { alpha: a, maxW: 860 });
  text(c, '— Narasimha Purana, in the Hari Bhakti Vilasa 8.394', 520, 1010, '30px Marcellus', '#CFC2B0', { alpha: a * .9, maxW: 860 });
} });

// ================= I · Murugan's six: a South Indian verse, no known source =================
SHOTS.push({ a: TL.I0, b: TL.J0 + .4, xf: .4, draw(c, u, t) {
  reset(); const ex = W3.mood('dusk'); lit(t);
  const g = god('murugan'), k = easeIO(u / (TL.J0 + .4 - TL.I0));
  g.rings.forEach(r => trailSet(r, .9));
  render3(c, SC, orbit(g, k, 12, 12.5, -.5, -.3), { exposure: ex });
  const e = emblemAt('murugan'); emblem(c, 'murugan', e.x, e.y, Math.min(e.s, 170), t, 1);
  band(c, 1130, 1450, .5);
  count(c, '6', 'murugan', t, TL.I0 + .2);
  tagAt(c, 'murugan', t, TL.SOUTH, { size: 32 });
  const ee = emblemAt('murugan'); text(c, 'SOURCE ?', ee.x + ee.s * 1.9, ee.y + ee.s * 1.35, '700 30px Cinzel', '#CFC2B0', { pop: t - TL.NOSRC, spacing: 2, glow: ['rgba(10,6,4,.95)', 18] });
} });

// ================= J · Hanuman and the Navagraha: temple custom, the west half of the map =================
SHOTS.push({ a: TL.J0, b: TL.K0 + .4, xf: .4, draw(c, u, t) {
  reset(); const ex = mapMood(); lit(t);
  god('hanuman').rings.forEach(r => trailSet(r, .85)); god('nava').rings.forEach(r => trailSet(r, .85));
  render3(c, SC, mapCam(u, 80, 78), { exposure: ex * 1.1 });
  c.save(); const gr = c.createLinearGradient(380, 0, 760, 0); gr.addColorStop(0, 'rgba(6,5,10,0)'); gr.addColorStop(1, 'rgba(6,5,10,.55)'); c.fillStyle = gr; c.fillRect(380, 0, W - 380, H); c.restore();
  emblems(c, t, { a: id => ['hanuman', 'nava'].includes(id) ? 1 : .25, max: 60, shiva: .5 });
  band(c, 1290, 1490, .45);
  count(c, '3 / 11', 'hanuman', t, TL.J0 + .2, { dx: 2.5, size: 60, col: '#FF9A6A' });
  count(c, '9', 'nava', t, TL.J0 + .2, { dx: 1.6, size: 64 });
  tagAt(c, 'hanuman', t, TL.CUSTOM, { dx: 2.5, dy: -2.1, size: 30 });
  tagAt(c, 'nava', t, TL.CUSTOM + .15, { dx: 1.6, dy: -2.1, size: 30 });
} });

// ================= K · follow your temple's priest: the middle shrine's door, the lamps, the bell =================
SHOTS.push({ a: TL.K0, b: TL.L0 + .4, xf: .4, draw(c, u, t) {
  reset(); const ex = W3.mood('dusk'); lit(t);
  const b0 = TL.PRIEST - .5;
  CEN.set(t, { lamps: 1, water: 1, bell: t > b0 ? .35 * Math.sin((t - b0) * 5.5) * Math.exp(-(t - b0) * .9) : 0 });
  const k = easeIO(u / (TL.L0 + .4 - TL.K0));
  render3(c, SC, cam3({ pos: [lerp(8.6, 6.4, k), lerp(2.3, 1.9, k), lerp(-1.2, -.7, k)], at: [0, lerp(2.2, 1.8, k), 0], fov: 52 }), { exposure: ex });
} });

// ================= L · screenshot this: the map, every count, the board =================
SHOTS.push({ a: TL.L0, b: TL.M0 + .4, xf: .4, draw(c, u, t) {
  reset(); const ex = mapMood(); lit(t); showAll(.8);
  render3(c, SC, mapCam(u, 80, 78), { exposure: ex * 1.1 });
  emblems(c, t, { a: .9, max: 60 });
  c.fillStyle = `rgba(6,5,10,${.45 * seg(t, TL.SCREEN - .2, TL.SCREEN + .3)})`; c.fillRect(0, 0, W, H);
  board(c, t, TL.SCREEN - .2);
  // the shutter: a white flash as the board lands
  const f = seg(t, TL.SCREEN + .25, TL.SCREEN + .3) * (1 - seg(t, TL.SCREEN + .3, TL.SCREEN + .6));
  if (f > 0) { c.fillStyle = `rgba(255,248,235,${.55 * f})`; c.fillRect(0, 0, W, H); }
} });

// ================= M · the ask: Hanuman's shrine, 3 or 11? =================
SHOTS.push({ a: TL.M0, b: TL.N0 + .4, xf: .4, draw(c, u, t) {
  reset(); const ex = W3.mood('dusk'); lit(t);
  const g = god('hanuman'), k = easeIO(u / (TL.N0 + .4 - TL.M0));
  g.rings.forEach((r, i) => trailSet(r, i < 3 ? .95 : .6 + .3 * Math.sin(t * 5)));
  render3(c, SC, orbit(g, k, lerp(15, 13.5, k), lerp(9, 7.5, k), 1.85, 2.05, { atY: 7.4 }), { exposure: ex });
  band(c, 1130, 1450, .5);
  const e = emblemAt('hanuman'); emblem(c, 'hanuman', e.x, e.y, Math.min(e.s, 150), t, 1);
  const p = 1 + .05 * Math.max(0, Math.sin(t * 5));
  text(c, '3', 300, 560, `700 ${Math.round(150 * (t > TL.ASK3 ? p : 1))}px Cinzel`, '#FFE2A0', { pop: t - TL.ASK3, glow: ['rgba(10,6,4,.95)', 26] });
  text(c, 'or', 540, 570, '700 60px Cinzel', '#FFF3DC', { pop: t - TL.ASK3 - .15, glow: ['rgba(10,6,4,.95)', 20] });
  text(c, '11', 780, 560, `700 ${Math.round(150 * (t > TL.ASK11 ? p : 1))}px Cinzel`, '#FF9A6A', { pop: t - TL.ASK11, glow: ['rgba(10,6,4,.95)', 26] });
} });

// ================= N · Part 4: Shani, Lakshmi, Ayyappa: from the east gate, the camera rises over the courtyard =================
SHOTS.push({ a: TL.N0, b: TL.CARD, xf: .4, draw(c, u, t) {
  reset(); const ex = W3.mood('dusk'); lit(t); showAll(.7);
  const k = easeIO(u / (TL.CARD - TL.N0));
  render3(c, SC, cam3({ pos: [lerp(10, 26, k), lerp(2.4, 11, k), lerp(-.8, 3, k)], at: [0, lerp(2.6, 3.4, k), 0], fov: 54 }), { exposure: ex });
  emblems(c, t, { a: seg(t, TL.N0 + .5, TL.N0 + 1.4) * .95, max: 80, shiva: 0 });
  seriesTag(c, 'NEXT · PART 4', t, TL.PART4, { w: 380 });
  ['SHANI', 'LAKSHMI', 'AYYAPPA'].forEach((n, i) => text(c, n, 540, 580 + i * 92, '700 70px Cinzel', '#FFE2A0', { pop: t - TL[n], glow: ['rgba(10,6,4,.95)', 24], spacing: 3 }));
} });

// ================= O · the card =================
SHOTS.push({ a: TL.CARD, b: TL.END + 1, draw(c, u, t) {
  rkCardCine(c, u, t, { title: 'MEET OUR GODS', line: 'Picture books of our gods, for kids', price: 'Books 1–3 · set of 3 for ₹500' });
} });
