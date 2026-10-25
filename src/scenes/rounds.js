// rounds.js: "How many times should you walk around EACH god?" (ad 50), Pradakshina Part 2, in the 3D style: a dusk
// courtyard of five shrines, Shiva's in the middle, Devi, Ganesha, Vishnu and Surya at the corners, the camera as the
// devotee. Most of us do the same rounds for every god; the Narasimha Purana (quoted in the Hari Bhakti Vilasa 8.394)
// gives each their own: Devi one, Ganesha three, Vishnu four, Surya seven, Shiva half (Part 1's rule: never cross the
// somasutra, walk up to it and turn back). The verse, the parent line, the ask, the card. STORYBOARD.md has the plan and
// the sources; the timeline (from the voice) is rounds_tl.js, the courtyard, rings and emblems rounds_props.js.
const W3 = world3(), SC = W3.scene, CEN = shrine3(SC, { court: false }), CT = court5(SC);
GODS.forEach(g => {
  const grp = new THREE.Group(); grp.position.set(g.at[0], 0, g.at[1]); grp.scale.setScalar(SK); SC.add(grp);
  g.T = shrine3(grp, { court: false, soma: false, linga: false, lights: false });
  g.rings = []; for (let k = 0; k < Math.max(g.n, 3); k++) g.rings.push(ring3(SC, g.at[0], g.at[1], SK, k * RGAP));
});
const CR = [0, 1, 2].map(k => ring3(SC, 0, 0, 1, k * RGAP));          // the middle shrine's three rounds (B: the same for all)
// Shiva's way (Part 1): clockwise from the channel's east side round to its west side, then back on the outside
const GO = trail3(SC, .775, 1.725, 44, { col: '#FFC860' });
const BACK = trail3(SC, 1.725, .775, 44, { col: '#FFE6B0', off: .62 });
const STOP = [stopLine3(SC, -.5), stopLine3(SC, .5)];
const ALL = [...GODS.flatMap(g => g.rings), ...CR, GO, BACK];
const reset = () => { ALL.forEach(r => trailSet(r, 0)); STOP.forEach(s => { s.material.opacity = 0; }); };
const lit = t => { CEN.set(t, { lamps: 1, water: 1 }); GODS.forEach(g => g.T.set(t, { lamps: 1 })); CT.set(t); };
const god = id => GODS.find(g => g.id === id);
// the map from 70 m up: dusk's fog would wash it out, so push it back
const mapMood = () => { const ex = W3.mood('dusk', { hemi: 2.3 }); SC.fog.near = 90; SC.fog.far = 220; return ex * 1.15; };

const CAPY = 1290, MAPY = 1385;   // over the map, lower: under the south shrines
VO.caps.forEach((k, i) => say(i ? k.a : -1, k.b, k.text, { at: i ? k.at : k.at.map(() => -1), y: ['same', 'own', 'verse', 'ask'].includes(k.id) ? MAPY : CAPY }));

// the map: straight down, north up, the whole courtyard above the captions
const mapCam = (u, h0 = 74, h1 = 71, zc = 3.2) => cam3({ pos: [0, lerp(h0, h1, easeIO(u / 4)), zc + .001], at: [0, 0, zc], up: [0, 0, -1], fov: 40 });
// a corner shrine from the courtyard side, circling it clockwise: R out, h up, a0 → a1 (radians, 0 = east, π/2 = south)
const orbit = (g, k, R, h, a0, a1, o = {}) => { const a = lerp(a0, a1, k), [cx, cz] = g.at; return cam3({ pos: [cx + Math.cos(a) * R, h, cz + Math.sin(a) * R], at: [cx, o.atY ?? 5, cz], fov: o.fov ?? 54 }); };
// the count beside a god's emblem as their rounds land: the number done so far, each pops as its ring closes
function tally(c, id, t, t0, d, n, o = {}) {
  const k = clamp(Math.floor((t - t0 + .04) / d), 0, n); if (k < 1) return;
  count(c, String(k), id, t, t0 + k * d - .04, o);
}

// ================= A · the hook: the courtyard at dusk, five shrines, their emblems over them =================
SHOTS.push({ a: 0, b: TL.B0 + .4, draw(c, u, t) {
  reset(); const ex = W3.mood('dusk'); SC.fog.near = 40; SC.fog.far = 130; lit(t);
  const a = 1.5 + u * .025;   // from the south, high: all five shrines across the frame
  render3(c, SC, cam3({ pos: [Math.cos(a) * 40, 30 - u * .3, Math.sin(a) * 40], at: [0, 2, -1.5], fov: 54 }), { exposure: ex * 1.1 });
  emblems(c, t, { a: .95, max: 90 });
  // the series tag
  const k = popK(t + 1);
  c.save(); c.translate(540, 470); c.scale(k, k); c.fillStyle = 'rgba(20,12,8,.72)'; c.strokeStyle = 'rgba(244,196,106,.85)'; c.lineWidth = 3;
  c.beginPath(); c.roundRect(-250, -38, 500, 76, 38); c.fill(); c.stroke(); c.restore();
  text(c, 'PRADAKSHINA · PART 2', 540, 472, '700 36px Cinzel', '#F4C46A', { spacing: 2 });
} });

// ================= B · the same rounds for every god: three rings round every shrine at once =================
SHOTS.push({ a: TL.B0, b: TL.C0 + .4, xf: .4, draw(c, u, t) {
  reset(); const ex = mapMood(); lit(t);
  for (const r of [...GODS.map(g => g.rings.slice(0, 3)), CR]) ringsShow(r, t, ...TL.ringsB, { a: .9 });
  render3(c, SC, mapCam(u), { exposure: ex * 1.1 });
  emblems(c, t, { a: .9, max: 60 });
  const k = clamp(Math.floor((t - TL.ringsB[0] + .04) / TL.ringsB[1]), 0, 3);
  if (k) for (const id of ['shiva', 'devi', 'ganesha', 'vishnu', 'surya']) count(c, String(k), id, t, TL.ringsB[0] + k * TL.ringsB[1] - .04, { dx: 1.6, size: 58, col: '#FFF3DC' });
} });

// ================= C · their own number: the rings fade, a question mark over each =================
SHOTS.push({ a: TL.C0, b: TL.D0 + .4, xf: .4, draw(c, u, t) {
  reset(); const ex = mapMood(); lit(t);
  const fade = 1 - seg(t, TL.C0 + .2, TL.OWN - .2);
  for (const r of [...GODS.flatMap(g => g.rings.slice(0, 3)), ...CR]) trailSet(r, .9 * fade);
  render3(c, SC, mapCam(u + 1.2), { exposure: ex * 1.1 });
  emblems(c, t, { a: id => .9 + .1 * Math.sin(t * 4), max: 60 });
  ['devi', 'ganesha', 'vishnu', 'surya', 'shiva'].forEach((id, i) => count(c, '?', id, t, TL.OWN - .25 + i * .14, { dx: 1.6, size: 64, col: '#FF9A6A' }));
} });

// ================= D–G · each god's rounds: the camera on their shrine, the rings landing, the count =================
const godShot = (id, a, b, rings, cam) => SHOTS.push({ a, b, xf: .4, draw(c, u, t) {
  reset(); const ex = W3.mood('dusk'); lit(t);
  const g = god(id), k = u / (b - a);
  ringsShow(g.rings.slice(0, g.n), t, ...rings, { a: 1 });
  render3(c, SC, orbit(g, easeIO(k), ...cam), { exposure: ex });
  const e = emblemAt(id); emblem(c, id, e.x, e.y, e.s, t, seg(t, a + .1, a + .5));
  tally(c, id, t, ...rings, g.n);
} });
godShot('devi', TL.D0, TL.E0 + .4, TL.ringsD, [10, 12.5, .55, .8]);
godShot('ganesha', TL.E0, TL.F0 + .4, TL.ringsE, [11, 13.5, -.75, -.5]);
godShot('vishnu', TL.F0, TL.G0 + .4, TL.ringsF, [11.5, 14, -1.3, -1.05]);
godShot('surya', TL.G0, TL.H0 + .4, TL.ringsG, [13.5, 16.5, 1.75, 2.05]);

// ================= H · and Shiva? Only half: the middle shrine =================
SHOTS.push({ a: TL.H0, b: TL.I0 + .4, xf: .4, draw(c, u, t) {
  reset(); const ex = W3.mood('dusk'); lit(t);
  const k = easeIO(u / (TL.I0 + .4 - TL.H0)), a = lerp(.35, .55, k);
  render3(c, SC, cam3({ pos: [Math.cos(a) * 18, 8 - k, Math.sin(a) * 18], at: [0, 6.2, 0], fov: 54 }), { exposure: ex });
  const e = emblemAt('shiva'); emblem(c, 'shiva', e.x, e.y, e.s, t, seg(t, TL.SHIVA - .3, TL.SHIVA + .2));
  count(c, '½', 'shiva', t, TL.HALF, { dx: 1.9, col: '#FF9A6A' });
} });

// ================= I · Part 1: you never cross the water: the channel, the stop line =================
SHOTS.push({ a: TL.I0, b: TL.J0 + .4, xf: .4, draw(c, u, t) {
  reset(); const ex = W3.mood('dusk'); lit(t);
  const k = easeIO(u / (TL.J0 + .4 - TL.I0));
  STOP[0].material.opacity = .9 * seg(t, TL.CROSS - .1, TL.CROSS + .15) * (.75 + .25 * Math.sin(t * 6));
  STOP[1].material.opacity = STOP[0].material.opacity;
  render3(c, SC, cam3({ pos: [lerp(-3.4, -2.6, k), lerp(2.1, 1.7, k), lerp(-7.6, -6.9, k)], at: [0, lerp(.6, .3, k), lerp(-3.5, -3.8, k)], fov: 52 }), { exposure: ex });
} });

// ================= J · walk up to it and turn back: the middle shrine's map, Shiva's way =================
SHOTS.push({ a: TL.J0, b: TL.K0 + .4, xf: .4, draw(c, u, t) {
  reset(); const ex = W3.mood('dusk', { hemi: 1.6 }); lit(t);
  trailShow(GO, t, TL.J0 + .15, TL.TURN - .1, { a: 1 });
  trailShow(BACK, t, TL.TURN, TL.K0 + .25, { a: 1 });
  STOP[0].material.opacity = .9 * seg(t, TL.TURN - .2, TL.TURN); STOP[1].material.opacity = .9 * seg(t, TL.K0 + .1, TL.K0 + .3);
  render3(c, SC, cam3({ pos: [0, lerp(25, 23, easeIO(u / 3)), 1.2], at: [0, 0, 1.2], up: [0, 0, -1], fov: 40 }), { exposure: ex * 1.1 });
} });

// ================= K · the verse: the whole courtyard, every count =================
const VERSE = ['एकां चण्ड्यां रवौ सप्त', 'तिस्रो दद्याद्विनायके ।', 'चतस्रः केशवे दद्या-', 'च्छिवे त्वर्धप्रदक्षिणाम् ॥'];
const allCounts = (c, t, t0, o = {}) => {
  [['devi', '1'], ['ganesha', '3'], ['vishnu', '4'], ['surya', '7'], ['shiva', '½']].forEach(([id, n], i) => count(c, n, id, t, t0 + i * .16, { dx: 1.6, size: o.size || 66, col: id === 'shiva' ? '#FF9A6A' : '#FFE2A0', alpha: o.alpha }));
};
const showAll = (a = .85) => { GODS.forEach(g => g.rings.slice(0, g.n).forEach(r => trailSet(r, a))); trailSet(GO, a); trailSet(BACK, a); STOP.forEach(s => { s.material.opacity = a; }); };
SHOTS.push({ a: TL.K0, b: TL.L0 + .4, xf: .4, draw(c, u, t) {
  reset(); const ex = mapMood(); lit(t); showAll();
  render3(c, SC, mapCam(u, 74, 72), { exposure: ex * 1.1 });
  emblems(c, t, { a: .9, max: 60 });
  allCounts(c, t, TL.K0 + .1);
  const a = seg(t, TL.VERSE - .3, TL.VERSE + .3);
  band(c, 400, 900, .7 * a);
  VERSE.forEach((l, i) => text(c, l, 520, 500 + i * 76 + (i > 1 ? 14 : 0), '58px "Tiro Devanagari Sanskrit"', '#FFE2A0', { alpha: a, glow: ['rgba(255,170,60,.8)', 22], maxW: 900 }));
  text(c, '— Narasimha Purana, in the Hari Bhakti Vilasa 8.394', 520, 836, '30px Marcellus', '#CFC2B0', { alpha: a * .9, maxW: 900 });
} });

// ================= L · count them with your child: from the gate, the bell =================
SHOTS.push({ a: TL.L0, b: TL.M0 + .4, xf: .4, draw(c, u, t) {
  reset(); const ex = W3.mood('dusk'); showAll(.7);
  CEN.set(t, { lamps: 1, water: 1, bell: .35 * Math.sin((t - TL.COUNT + .4) * 5.5) * Math.exp(-Math.max(0, t - TL.COUNT + .4) * .9) * (t > TL.COUNT - .4 ? 1 : 0) });
  GODS.forEach(g => g.T.set(t, { lamps: 1 })); CT.set(t);
  const k = easeIO(u / (TL.M0 + .4 - TL.L0));
  render3(c, SC, cam3({ pos: [lerp(9, 24, k), lerp(2.2, 9, k), lerp(-.8, 3, k)], at: [0, lerp(2.4, 3.6, k), 0], fov: lerp(52, 54, k) }), { exposure: ex });
  emblems(c, t, { a: seg(t, TL.L0 + .5, TL.L0 + 1.4) * .95, max: 80 });
} });

// ================= M · the ask: the courtyard, every count pulsing =================
SHOTS.push({ a: TL.M0, b: TL.CARD, xf: .4, draw(c, u, t) {
  reset(); const ex = mapMood(); lit(t); showAll(.8 + .2 * Math.sin(t * 5));
  render3(c, SC, mapCam(u, 72, 70), { exposure: ex * 1.1 });
  emblems(c, t, { a: .95, max: 60 });
  allCounts(c, t, TL.M0 - 2, { size: 66 + 6 * Math.max(0, Math.sin(t * 5)) });
} });

// ================= N · the card =================
SHOTS.push({ a: TL.CARD, b: TL.END + 1, draw(c, u, t) {
  rkCardCine(c, u, t, { title: 'MEET OUR GODS', line: 'Picture books of our gods, for kids', price: 'Books 1–3 · set of 3 for ₹500' });
} });
