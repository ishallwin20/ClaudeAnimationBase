// toran.js: "Your grandmother hung MANGO LEAVES over the door. She wasn't decorating." (ad 82), in the 3D style.
// A house front with a mango-leaf toran (frame 0). The word: toran, from torana, a gateway (Sanchi's stone torana). The
// Bhagavatam: little Dhruva left home crying (4.8); when he came back every gate in the city had mango leaves, pots of
// water and burning lamps (4.9.55). When Krishna came home to Dwarka every door wore a torana (1.11.13). The same leaves
// crown the kalash. So it says: someone we love is coming home; this Diwali, Lakshmi (gold footprints walk in). The ask:
// mango leaves, marigolds or beads, what's on your door, comment your state; send this to the one who ties yours. Card.
// STORYBOARD.md has the plan and the sources; the timeline (from the voice) is toran_tl.js, the sets toran_sets.js.
LOOK.bloom = .14;   // matte (owner, 30 Oct): cine.js's own bloom low, no fx bloom
const CAPY = 1330;
const capBand = (c, a = .5) => band(c, 1200, 1490, a);
VO.caps.forEach((k, i) => say(i ? k.a : -1, k.b, k.text, { at: i ? k.at : k.at.map(() => -1), y: k.y ?? (k.id === 'hook' ? 1385 : CAPY) }));

const lens = (focus, ap = 5, o = {}) => ({ dof: { focus, aperture: ap, max: 12, nearK: .6 }, grade: { contrast: o.contrast ?? 1.07, sat: o.sat ?? 1.05, temp: o.temp ?? .04, lift: o.lift ?? 0, gamma: 1, gain: 1 } });
const dist = (p) => CAM3.position.distanceTo(V3(...p));
const at3 = (k, a, b) => a.map((v, i) => lerp(v, b[i], k));
const flashK = (c, t, at, col = '255,220,160', k = .45, rate = 5) => { const f = t > at ? Math.exp(-(t - at) * rate) : 0; if (f > .01) { c.save(); c.fillStyle = `rgba(${col},${k * f})`; c.fillRect(0, 0, W, H); c.restore(); } };
const GOLD = '#F4C46A', CREAM = '#FFF3DC', LEAF_C = '#B8E08A';
const H_ = HOME, TY = HOME.toranY;
const homeDay = (t, o = {}) => { env3(H_.S, 'dawn', { k: .45, rot: 2.2 }); H_.set(t, { mood: 'day', ...o }); };
const homeNight = (t, o = {}) => { env3(H_.S, 'lamplit', { k: .12, rot: 1 }); H_.set(t, { mood: 'night', ...o }); };
// a word over the top band: big gold, with a small line under it
function topTitle(c, t, at, out, big, small, o = {}) {
  const a = seg(t, at, at + .3) * (1 - seg(t, out, out + .3)); if (a <= 0) return;
  band(c, o.y0 ?? 380, o.y1 ?? 640, .6 * a);
  text(c, big, 540, o.y ?? 480, o.font || '700 96px Cinzel', o.col || GOLD, { pop: t - at, alpha: a, spacing: 6, glow: ['rgba(244,170,60,.4)', 28], maxW: 940 });
  if (small) text(c, small, 540, (o.y ?? 480) + (o.dy ?? 82), o.sfont || 'italic 42px Marcellus', CREAM, { pop: t - at - .2, alpha: a, glow: ['rgba(6,5,10,.95)', 16], maxW: 920 });
}

// ================= A · the hook: the door and its toran, morning =================
const camHook = (k, kc) => cam3({ pos: at3(kc, at3(k, [.8, 2.3, 2.75], [.72, 2.35, 2.5]), [.7, 2.55, 1.5]), at: at3(kc, [-.05, 2.42, 0], [-.15, 2.55, .2]), fov: lerp(48, 44, kc) });
SHOTS.push({ a: 0, b: TL.TORANA + .25, draw(c, u, t) {
  homeDay(t, { wind: .7 });
  const k = easeIO(seg(t, 0, TL.WASNT)), kc = easeIO(seg(t, TL.WASNT - .3, TL.DECOR + .8));
  camHook(k, kc);
  render3(c, H_.S, CAM3, { exposure: 1.0, fx: lens(dist([-.1, TY - .1, .22]), lerp(3, 6, kc), { temp: .06 }) });
  capBand(c);
  // on "TORAN": the word on the leaves
  topTitle(c, t, TL.TORAN - .1, TL.TORANA - .2, 'TORAN', null, { y: 520, y0: 420, y1: 620 });
} });

// ================= B · torana: a gateway (Sanchi) =================
SHOTS.push({ a: TL.TORANA, b: TL.C0 + .3, xf: .45, draw(c, u, t) {
  const k = easeIO(seg(t, TL.TORANA, TL.C0 + .3));
  cam3({ pos: at3(k, [.6, 1.6, 10.5], [-.4, 1.5, 17]), at: at3(k, [0, 5.4, 0], [0, 4.8, -4]), fov: lerp(54, 52, k) });
  env3(SANCHI.S, 'day', { k: .35, rot: 1 });
  render3(c, SANCHI.S, CAM3, { exposure: 1.0, fx: lens(dist([0, 5, 0]), 2, { temp: .08, sat: 1.0 }) });
  topTitle(c, t, TL.TORANA + .25, TL.C0, 'तोरण', 'TORANA · a gateway', { font: '110px "Tiro Devanagari Sanskrit"', y: 470, dy: 96, y0: 380, y1: 640 });
  if (t > TL.GATEWAY) { const a = seg(t, TL.GATEWAY, TL.GATEWAY + .3) * (1 - seg(t, TL.C0, TL.C0 + .3)); text(c, 'GATEWAY', 540, 700, '700 70px Cinzel', '#FFE2A0', { pop: t - TL.GATEWAY, alpha: a, spacing: 8, glow: ['rgba(10,6,4,.95)', 26] }); }
  tag(c, 'THE GREAT STUPA, SANCHI · c. 1st century BCE', 520, 1462, t, TL.SANSKRIT, { out: TL.C0 });
  capBand(c);
} });

// ================= C · Dhruva leaves home crying: the bare street at blue dusk, walking away from the palace =================
const GAP = (g) => g.i + (g.side > 0 ? .4 : 0);
SHOTS.push({ a: TL.C0, b: TL.D0 + .3, xf: .4, draw(c, u, t) {
  const k = easeIO(seg(t, TL.C0, TL.D0 + .3));
  CITY.set(t, { mood: 'blue', deco: () => ({ tor: 0, swag: 0, pots: 0, lamps: 0 }), palace: 0 });
  cam3({ pos: at3(k, [.2, 1.0, -31], [-.2, 1.05, -17]), at: [0, 3.0, -44], fov: 52 });
  env3(CITY.S, 'lamplit', { k: .08 });
  render3(c, CITY.S, CAM3, { exposure: 1.3, fx: lens(dist([0, 3, -44]), 3, { sat: .75, temp: -.1, contrast: 1.04 }) });
  topTitle(c, t, TL.DHRUVA - .1, TL.D0, 'DHRUVA', 'who became the Pole Star', { y: 470 });
  tag(c, 'BHAGAVATA PURANA 4.8', 470, 1462, t, TL.BHAG, { out: TL.D0 });
  capBand(c);
} });

// ================= D · when he came back: every gate gets mango leaves, pots of water, lamps =================
const decoBack = (t) => (g) => {
  const d = GAP(g) * .14;
  return { tor: seg(t, TL.EVERY - .2 + d, TL.EVERY + .5 + d), swag: t > TL.LEAVES + d * .6 ? 1 : 0, pots: seg(t, TL.POTS - .25 + d * .7, TL.POTS + .25 + d * .7), lamps: seg(t, TL.LAMPS - .45 + d * .7, TL.LAMPS + .1 + d * .7) };
};
SHOTS.push({ a: TL.D0, b: TL.E0 + .3, xf: .4, draw(c, u, t) {
  const k = easeIO(seg(t, TL.D0, TL.E0 + .3));
  CITY.set(t, { mood: 'dusk', deco: decoBack(t), palace: seg(t, TL.EVERY + 1.0, TL.EVERY + 1.6), palaceLamps: seg(t, TL.LAMPS, TL.LAMPS + .5), wind: .5 });
  const P = at3(k, [.6, 1.35, 1.0], [.9, 1.45, -15]); cam3({ pos: P, at: [P[0] + 2.7, P[1] + .95, P[2] - 5.2], fov: 54 });
  env3(CITY.S, 'lamplit', { k: .2 });
  render3(c, CITY.S, CAM3, { exposure: 1.35, fx: lens(dist([3.6, 2.6, CAM3.position.z - 5]), 3, { temp: .08, sat: 1.08 }) });
  if (t > TL.LEAVES - .2) {
    const a = seg(t, TL.LEAVES - .2, TL.LEAVES + .2) * (1 - seg(t, TL.E0 - .1, TL.E0 + .2)); band(c, 380, 690, .62 * a);
    text(c, 'चूतपल्लव … विलम्बिभिः', 540, 440, '48px "Tiro Devanagari Sanskrit"', '#FFE9C0', { alpha: a, glow: ['rgba(6,5,10,.95)', 16], maxW: 920 });
    text(c, 'उपस्कृतं प्रतिद्वारमपां कुम्भैः सदीपकैः', 540, 510, '48px "Tiro Devanagari Sanskrit"', '#FFE9C0', { alpha: a, glow: ['rgba(6,5,10,.95)', 16], maxW: 920 });
    text(c, '“hanging mango leaves … at every gate,', 540, 584, 'italic 34px Marcellus', CREAM, { alpha: a, glow: ['rgba(6,5,10,.95)', 14], maxW: 920 });
    text(c, 'pots of water with lamps”', 540, 630, 'italic 34px Marcellus', CREAM, { alpha: a, glow: ['rgba(6,5,10,.95)', 14], maxW: 920 });
  }
  tag(c, 'BHAGAVATA PURANA 4.9.55', 470, 1462, t, TL.EVERY);
  capBand(c);
} });

// ================= E · Krishna comes home to Dwarka: festive arches over every door, a crane up the street =================
SHOTS.push({ a: TL.E0, b: TL.F0 + .3, xf: .4, draw(c, u, t) {
  const k = easeIO(seg(t, TL.E0, TL.F0 + .3));
  CITY.set(t, { mood: 'day', deco: () => ({ tor: 1, swag: 1, pots: 1, lamps: .6 }), palace: 1, palaceLamps: .6, arches: seg(t, TL.KRISHNA - .3, TL.WORE + .4), wind: .7 });
  cam3({ pos: at3(k, [0, 1.6, 7], [1.5, 15, 12]), at: at3(k, [0, 4, -20], [0, 1, -26]), fov: lerp(54, 50, k) });
  env3(CITY.S, 'day', { k: .5, rot: 1 });
  render3(c, CITY.S, CAM3, { exposure: 1.0, fx: lens(dist([0, 3, -12]), 2, { temp: .05, sat: 1.08 }) });
  topTitle(c, t, TL.DWARKA - .1, TL.F0, 'DWARKA', null, { y: 470, y0: 390, y1: 560 });
  if (t > TL.WORE - .1) { const a = seg(t, TL.WORE - .1, TL.WORE + .3) * (1 - seg(t, TL.F0 - .1, TL.F0 + .2)); band(c, 560, 720, .6 * a);
    text(c, 'गोपुरद्वारमार्गेषु कृतकौतुकतोरणाम्', 540, 610, '46px "Tiro Devanagari Sanskrit"', '#FFE9C0', { alpha: a, glow: ['rgba(6,5,10,.95)', 16], maxW: 920 });
    text(c, '“festive toranas at the gates, the doors and the roads”', 540, 674, 'italic 32px Marcellus', CREAM, { alpha: a, glow: ['rgba(6,5,10,.95)', 14], maxW: 940 }); }
  tag(c, 'BHAGAVATA PURANA 1.11.13', 470, 1462, t, TL.KRISHNA);
  capBand(c);
} });

// ================= F · the same leaves crown the kalash: from the kalash up to the toran =================
SHOTS.push({ a: TL.F0, b: TL.G0 + .3, xf: .4, draw(c, u, t) {
  homeDay(t, { wind: .5 });
  const k = easeIO(seg(t, TL.PUJA - .2, TL.G0 + .3)), k0 = easeIO(seg(t, TL.F0, TL.KALASH + .4));
  cam3({ pos: at3(k, at3(k0, [-.45, .85, 2.25], [-.6, .9, 1.95]), [.5, 2.2, 2.9]), at: at3(k, [-1.3, .6, .42], [-.15, 2.5, .2]), fov: lerp(40, 48, k) });
  render3(c, H_.S, CAM3, { exposure: 1.0, fx: lens(k < .5 ? dist([-1.3, .6, .42]) : dist([0, TY, .22]), 6, { temp: .06 }) });
  topTitle(c, t, TL.KALASH - .1, TL.PUJA + .6, 'KALASH', 'mango leaves on a pot of water', { y: 470 });
  capBand(c);
} });

// ================= G · never decoration: dusk falls, the diyas light, the door opens on "someone we love" =================
SHOTS.push({ a: TL.G0, b: TL.H0 + .3, xf: .45, draw(c, u, t) {
  const n = t > TL.G0 + .2;
  const dk = H_.diyas.map((_, i) => seg(t, TL.NEVER + .3 + i * .22, TL.NEVER + .6 + i * .22));
  const op = seg(t, TL.LOVE - .5, TL.HOME + .4);
  env3(H_.S, 'lamplit', { k: .12, rot: 1 }); H_.set(t, { mood: 'dusk', wind: .45, diyas: dk, open: op, inner: op });
  const k = easeIO(seg(t, TL.G0, TL.H0 + .3));
  cam3({ pos: at3(k, [0, 1.75, 5.4], [0, 1.6, 4.3]), at: [0, 1.75, 0], fov: 52 });
  render3(c, H_.S, CAM3, { exposure: 1.5, fx: lens(dist([0, 1.5, .2]), 4, { temp: .07, sat: 1.06 }) });
  capBand(c);
} });

// ================= H · this Diwali, that's Lakshmi: gold footprints walk in =================
SHOTS.push({ a: TL.H0, b: TL.I0 + .3, xf: .4, draw(c, u, t) {
  const fk = 8 * seg(t, TL.DIWALI - .2, TL.LAKSHMI + .9);
  homeNight(t, { wind: .45, open: 1, inner: 1, feet: fk });
  const k = easeIO(seg(t, TL.H0, TL.I0 + .3));
  cam3({ pos: at3(k, [.1, 1.75, 4.6], [0, 1.55, 3.9]), at: at3(k, [0, .25, 1.3], [0, .7, 0]), fov: 52 });
  render3(c, H_.S, CAM3, { exposure: 1.3, fx: lens(dist([0, .2, 1.6]), 4, { temp: .07 }) });
  flashK(c, t, TL.LAKSHMI, '255,210,120', .22, 4);
  topTitle(c, t, TL.LAKSHMI - .05, TL.I0, 'LAKSHMI', null, { y: 500, y0: 410, y1: 590 });
  capBand(c);
} });

// ================= I · the ask: mango leaves, marigolds or beads? what's on YOUR door? =================
const swapAt = [TL.MANGO2 - .1, TL.MARIGOLDS - .15, TL.BEADS - .15];
function askToran(t) { let i = 0; while (i + 1 < swapAt.length && t >= swapAt[i + 1]) i++; return { kind: ['mango', 'marigold', 'beads'][i], on: seg(t, swapAt[i], swapAt[i] + .45), i }; }
SHOTS.push({ a: TL.I0, b: TL.J0 + .3, xf: .4, draw(c, u, t) {
  const s = t < swapAt[0] ? { kind: 'mango', on: 1, i: 0 } : askToran(t);
  homeNight(t, { wind: .5, open: 1, inner: 1, feet: 8, toran: s.kind, on: s.on });
  const k = easeIO(seg(t, TL.I0, TL.J0 + .3));
  cam3({ pos: at3(k, [0, 2.15, 3.5], [0, 2.2, 3.2]), at: [0, 2.25, 0], fov: 46 });
  render3(c, H_.S, CAM3, { exposure: 1.3, fx: lens(dist([0, TY, .22]), 3, { temp: .1 }) });
  const names = [['MANGO LEAVES', LEAF_C], ['MARIGOLDS', '#FFB040'], ['BEADS', '#FF7AA8']];
  if (t > swapAt[0]) { const [nm, col] = names[s.i]; const a = 1 - seg(t, TL.J0 + .1, TL.J0 + .4); band(c, 400, 560, .55 * a); text(c, nm, 540, 480, '700 76px Cinzel', col, { pop: t - swapAt[s.i], alpha: a, spacing: 5, glow: ['rgba(6,5,10,.95)', 24] }); }
  if (t > TL.YOUR - .1) text(c, 'YOUR STATE?', 540, 1120, '700 64px Cinzel', GOLD, { pop: t - TL.STATE, alpha: seg(t, TL.STATE - .1, TL.STATE + .2) * (1 - seg(t, TL.J0 + .1, TL.J0 + .4)), spacing: 4, glow: ['rgba(6,5,10,.95)', 24] });
  capBand(c);
} });

// ================= J · send this to the one who ties yours: the mango toran back, a slow push =================
SHOTS.push({ a: TL.J0, b: TL.CARD, xf: .4, draw(c, u, t) {
  homeNight(t, { wind: .55, open: 1, inner: 1, feet: 8, toran: 'mango', on: seg(t, TL.J0, TL.J0 + .5) });
  const k = easeIO(seg(t, TL.J0, TL.CARD));
  cam3({ pos: at3(k, [0, 1.95, 4.7], [.3, 2.2, 3.4]), at: [0, 2.1, 0], fov: 48 });
  render3(c, H_.S, CAM3, { exposure: 1.3, fx: lens(dist([0, TY, .22]), 4, { temp: .07 }) });
  capBand(c);
} });

// ================= the card =================
SHOTS.push({ a: TL.CARD, b: TL.END + 1, draw(c, u, t) {
  rkCardCine(c, u, t, { title: 'MEET OUR GODS', line: 'Picture books of our gods, for kids', price: 'The Navadurga Set is out now', note: 'Link in bio' });
} });
