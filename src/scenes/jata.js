// jata.js: "Why do some sadhus keep JATA and some SHAVE?" (ad 87), in the 3D style.
// Two sadhus on a banyan's stone platform by a river at dawn: one with jata, one shaven (frame 0). The old texts describe
// two roads out of the world. Road one, the forest hermit: Manu 6.6 has him wear jata, beard and nails uncut (his hair
// grows); so Ram, leaving for the forest, asked for banyan milk and matted his hair (Ayodhya Kanda 52). Road two, the
// wandering sannyasi: he owns nothing, his head is shaven (Jabala Upanishad 5), even the shikha is given up (his hair and
// tuft go). One never cuts, one cuts it all: both threw away the comb. Today many who follow Shiva, the matted-haired
// (Kapardin, Rig Veda 1.114.1), keep jata, like the Nagas; Dandi sannyasis stay shaven. But even a Naga begins with a
// shaved head at his diksha. Bhaja Govindam: matted or shaven, if only for the stomach it's a costume. The ask; the card.
// STORYBOARD.md has the plan and the sources; the timeline (from the voice) is jata_tl.js, the set jata_sets.js.
LOOK.bloom = .12;   // matte (owner, 30 Oct): cine.js's own bloom low, no fx bloom
const CAPY = 1340;
const capBand = (c, a = .55) => band(c, 1190, 1500, a);
VO.caps.forEach((k, i) => say(i ? k.a : -1, k.b, k.text, { at: i ? k.at : k.at.map(() => -1), y: k.y ?? CAPY }));

const lens = (focus, ap = 5, o = {}) => ({ dof: { focus, aperture: ap, max: 12, nearK: .6 }, grade: { contrast: o.contrast ?? 1.07, sat: o.sat ?? 1.05, temp: o.temp ?? .04, lift: o.lift ?? 0, gamma: 1, gain: 1 } });
const dist = (p) => CAM3.position.distanceTo(V3(...p));
const at3 = (k, a, b) => a.map((v, i) => lerp(v, b[i], k));
const flashK = (c, t, at, col = '255,236,200', k = .4, rate = 5) => { const f = t > at ? Math.exp(-(t - at) * rate) : 0; if (f > .01) { c.save(); c.fillStyle = `rgba(${col},${k * f})`; c.fillRect(0, 0, W, H); c.restore(); } };
const GOLD = '#F4C46A', CREAM = '#FFF3DC', DEVA = '"Tiro Devanagari Sanskrit"';
const G_ = GHAT, JH = [G_.JP[0], G_.L1 + .82, G_.JP[2]], MH = [G_.MP[0], G_.L2 + .82, G_.MP[2]];   // the two heads
const dawn = (t, o = {}) => { env3(G_.S, 'dawn', { k: .5, rot: 2.2 }); G_.set(t, { mood: 'dawn', fire: 1, ...o }); };
const forest = (t, o = {}) => { env3(G_.S, 'day', { k: .4, rot: 1 }); G_.set(t, { mood: 'forest', ...o }); };
const dusk = (t, o = {}) => { env3(G_.S, 'lamplit', { k: .1, rot: 1 }); G_.set(t, { mood: 'dusk', ...o }); };
// a word over the top band: big gold, with a small line under it
function topTitle(c, t, at, out, big, small, o = {}) {
  const a = seg(t, at, at + .3) * (1 - seg(t, out, out + .3)); if (a <= 0) return;
  band(c, o.y0 ?? 390, o.y1 ?? 650, .6 * a);
  text(c, big, 540, o.y ?? 480, o.font || '700 92px Cinzel', o.col || GOLD, { pop: t - at, alpha: a, spacing: 5, glow: ['rgba(244,170,60,.4)', 28], maxW: 900 });
  if (small) text(c, small, 540, (o.y ?? 480) + (o.dy ?? 84), o.sfont || 'italic 40px Marcellus', CREAM, { pop: t - at - .2, alpha: a, glow: ['rgba(6,5,10,.95)', 16], maxW: 880 });
}
// a verse: Devanagari lines, then the English, on a dark band under the title
function shloka(c, t, at, out, deva, eng, y = 700) {
  const a = seg(t, at, at + .35) * (1 - seg(t, out, out + .3)); if (a <= 0) return;
  const n = deva.length + eng.length; band(c, y - 70, y + deva.length * 66 + eng.length * 46 + 20, .66 * a);
  deva.forEach((s, i) => text(c, s, 540, y + i * 66, `46px ${DEVA}`, '#FFE9C0', { alpha: a, glow: ['rgba(6,5,10,.95)', 16], maxW: 880 }));
  eng.forEach((s, i) => text(c, s, 540, y + deva.length * 66 + 4 + i * 46, 'italic 34px Marcellus', CREAM, { alpha: a, glow: ['rgba(6,5,10,.95)', 14], maxW: 880 }));
}
// the two-shot: the jata sadhu low and near on the left, the shaven sannyasi higher and behind on the right
const twoShot = (k, o = {}) => cam3({ pos: at3(k, o.p0 || [-.02, 1.34, 3.5], o.p1 || [0, 1.3, 3.0]), at: at3(k, o.a0 || [.03, 1.2, -.9], o.a1 || [.03, 1.22, -.9]), fov: o.fov ?? 40 });

// ================= A · the hook: the two sadhus at dawn =================
SHOTS.push({ a: 0, b: TL.B0 + .3, draw(c, u, t) {
  dawn(t, { hairJ: 1, hairM: 0, fire: 1 });
  twoShot(easeIO(seg(t, 0, TL.B0 + .3)));
  const f = lerp(dist(JH), dist(MH), easeIO(seg(t, TL.SHAVE - .35, TL.SHAVE + .35)));
  render3(c, G_.S, CAM3, { exposure: 1.0, fx: lens(f, 5, { temp: .06 }) });
  capBand(c);
} });

// ================= B · two roads out of the world: crane back, the two named =================
SHOTS.push({ a: TL.B0, b: TL.C0 + .3, xf: .4, draw(c, u, t) {
  dawn(t, { hairJ: 1, hairM: 0, fire: 1 });
  const k = easeIO(seg(t, TL.B0, TL.C0 + .3));
  cam3({ pos: at3(k, [.9, 1.5, 3.2], [1.5, 2.0, 4.6]), at: at3(k, [.05, 1.15, -.9], [.05, 1.1, -1]), fov: 40 });
  render3(c, G_.S, CAM3, { exposure: 1.0, fx: lens(dist([.1, 1.2, -1]), 2.5, { temp: .06 }) });
  topTitle(c, t, TL.TWO - .1, TL.C0, 'TWO ROADS', 'out of the world', { y: 480 });
  capBand(c);
} });

// ================= C · road one: the forest hermit; his jata grows (Manu 6.6) =================
SHOTS.push({ a: TL.C0, b: TL.D0 + .3, xf: .4, draw(c, u, t) {
  const hk = lerp(.12, 1, easeIO(seg(t, TL.MANU + .2, TL.NAILS + .5)));
  forest(t, { hairJ: hk, hairM: 0, dhuni: 0, tri: 0 });
  const k = easeIO(seg(t, TL.C0, TL.D0 + .3));
  cam3({ pos: at3(k, [-1.25, 1.2, 1.75], [.35, 1.28, 1.7]), at: at3(k, [JH[0], 1.0, JH[2]], [JH[0], 1.04, JH[2]]), fov: 36 });
  render3(c, G_.S, CAM3, { exposure: 1.0, fx: lens(dist(JH), 6, { temp: .02, sat: 1.08 }) });
  topTitle(c, t, TL.HERMIT - .1, TL.MANU + .1, 'ROAD ONE', 'the forest hermit · vanaprastha', { y: 480 });
  shloka(c, t, TL.JATA - .15, TL.D0, ['जटाश्च बिभृयान्नित्यं', 'श्मश्रुलोमनखानि च'], ['“he shall always wear matted hair,', 'his beard, body hair and nails uncut”'], 470);
  tag(c, 'MANUSMRITI 6.6', 420, 1466, t, TL.MANU, { out: TL.D0 });
  capBand(c);
} });

// ================= D · Ram asks for banyan milk and mats his hair (Ayodhya Kanda 52) =================
SHOTS.push({ a: TL.D0, b: TL.E0 + .3, xf: .4, draw(c, u, t) {
  forest(t, { hairJ: 1, hairM: 0, ram: 1, milk: seg(t, TL.BANYAN - .2, TL.MATTED + 1), dhuni: 0, tri: 0 });
  const k = easeIO(seg(t, TL.D0, TL.E0 + .3)), tp = G_.tipP;
  cam3({ pos: at3(k, [tp[0] + 1.1, G_.L2 + 1.2, tp[2] + 3.4], [tp[0] + .55, G_.L2 + .8, tp[2] + 2.1]), at: at3(k, [tp[0] + .3, G_.L2 + .95, tp[2]], [tp[0] + .2, G_.L2 + .72, tp[2]]), fov: 40 });
  render3(c, G_.S, CAM3, { exposure: 1.0, fx: lens(dist([tp[0], G_.cupY + .2, tp[2]]), 6, { temp: .03, sat: 1.08 }) });
  topTitle(c, t, TL.RAM - .1, TL.ASKED, 'RAM', 'leaves Ayodhya for the forest', { y: 480 });
  shloka(c, t, TL.BANYAN - .15, TL.E0, ['जटाः कृत्वा गमिष्यामि', 'न्यग्रोधक्षीरमानय'], ['“I shall go with matted hair:', 'bring me the milk of the banyan”'], 470);
  tag(c, 'VALMIKI RAMAYANA · AYODHYA KANDA 52', 480, 1466, t, TL.RAM, { out: TL.E0, size: 22 });
  capBand(c);
} });

// ================= E · road two: the wandering sannyasi; his hair goes, then the shikha (Jabala 5–6) =================
SHOTS.push({ a: TL.E0, b: TL.F0 + .3, xf: .4, draw(c, u, t) {
  const hk = 1 - easeIO(seg(t, TL.SHAVEN - .35, TL.SHAVEN + .3)), sk = 1 - easeIO(seg(t, TL.GIVEN - .15, TL.GIVEN + .45));
  dawn(t, { hairJ: 1, hairM: hk, shikha: sk });
  const k = easeIO(seg(t, TL.E0, TL.F0 + .3));
  cam3({ pos: at3(k, [1.75, 1.75, .25], [-.35, 1.85, .2]), at: at3(k, [MH[0], 1.56, MH[2]], [MH[0], 1.6, MH[2]]), fov: 36 });
  render3(c, G_.S, CAM3, { exposure: 1.0, fx: lens(dist(MH), 6, { temp: .06 }) });
  flashK(c, t, TL.SHAVEN, '255,236,200', .22);
  topTitle(c, t, TL.SANNYASI - .25, TL.NOTHING + .3, 'ROAD TWO', 'the wandering sannyasi', { y: 480 });
  shloka(c, t, TL.SHAVEN - .3, TL.F0, ['मुण्डोऽपरिग्रहः'], ['“shaven-headed, without possessions”'], 480);
  tag(c, 'JABALA UPANISHAD 5–6', 420, 1466, t, TL.NOTHING, { out: TL.F0 });
  capBand(c);
} });

// ================= F · one never cuts, one cuts it all: both threw away the comb =================
SHOTS.push({ a: TL.F0, b: TL.G0 + .3, xf: .4, draw(c, u, t) {
  dawn(t, { hairJ: 1, hairM: 0, comb: 1 });
  const k = easeIO(seg(t, TL.BOTH - .3, TL.COMB + .2)), cp = G_.CP;
  const f = t < TL.ONE2 - .2 ? dist(JH) : lerp(dist(MH), dist(cp), k);
  cam3({ pos: at3(k, [-.6, 1.36, 3.25], [cp[0] + .12, G_.L1 + .62, cp[2] + .95]), at: at3(k, [.05, 1.2, -.9], [cp[0], G_.L1 + .03, cp[2]]), fov: lerp(40, 26, k) });
  render3(c, G_.S, CAM3, { exposure: 1.0, fx: lens(lerp(dist(JH), f, seg(t, TL.ONE2 - .3, TL.ONE2 + .2)), lerp(6, 1.5, k), { temp: .06 }) });
  capBand(c);
} });

// ================= G · today: followers of Shiva keep jata, like the Nagas; Dandi sannyasis stay shaven =================
SHOTS.push({ a: TL.G0, b: TL.DANDI - .25, xf: .4, draw(c, u, t) {
  dawn(t, { hairJ: 1, hairM: 0, fire: 1, sun: 2.6 });
  const k = easeIO(seg(t, TL.G0, TL.DANDI - .25));
  cam3({ pos: at3(k, [-.95, .78, 1.75], [-.2, .9, 1.9]), at: at3(k, [JH[0] + .05, 1.18, JH[2]], [JH[0] + .05, 1.14, JH[2]]), fov: 42 });
  render3(c, G_.S, CAM3, { exposure: 1.0, fx: lens(dist(JH), 5, { temp: .07 }) });
  topTitle(c, t, TL.SHIVA - .1, TL.KEEP + .3, 'कपर्दिन्', 'KAPARDIN · “the matted-haired”', { font: `100px ${DEVA}`, y: 470, dy: 92, y0: 380, y1: 650 });
  tag(c, 'RUDRA IN THE RIG VEDA 1.114.1', 460, 1466, t, TL.MATTEDH, { out: TL.KEEP + .3 });
  topTitle(c, t, TL.NAGA - .1, TL.DANDI - .3, 'NAGA SADHU', 'jata, ash, a trident', { y: 480 });
  capBand(c);
} });
SHOTS.push({ a: TL.DANDI - .25, b: TL.H0 + .3, xf: .35, draw(c, u, t) {
  dawn(t, { hairJ: 1, hairM: 0, fire: 1 });
  const k = easeIO(seg(t, TL.DANDI - .25, TL.H0 + .3));
  cam3({ pos: at3(k, [1.5, 1.45, .55], [.95, 1.55, .75]), at: at3(k, [MH[0] + .1, 1.52, MH[2]], [MH[0] + .12, 1.55, MH[2]]), fov: 42 });
  render3(c, G_.S, CAM3, { exposure: 1.0, fx: lens(dist(MH), 5, { temp: .06 }) });
  topTitle(c, t, TL.DANDI - .1, TL.H0, 'DANDI SANNYASI', 'danda: the staff he carries', { y: 480, font: '700 80px Cinzel' });
  capBand(c);
} });

// ================= H · even a Naga begins with a shaved head, on the day of his diksha =================
SHOTS.push({ a: TL.H0, b: TL.I0 + .3, xf: .4, draw(c, u, t) {
  const hk = 1 - easeIO(seg(t, TL.SHAVED - .5, TL.SHAVED + .35));
  dawn(t, { hairJ: hk, hairM: 0, fire: 1 });
  const k = easeIO(seg(t, TL.H0, TL.I0 + .3));
  cam3({ pos: at3(k, [.3, 1.2, 2.1], [.05, 1.22, 1.45]), at: at3(k, [JH[0], 1.05, JH[2]], [JH[0], 1.1, JH[2]]), fov: 38 });
  render3(c, G_.S, CAM3, { exposure: 1.0, fx: lens(dist(JH), 6, { temp: .06 }) });
  flashK(c, t, TL.SHAVED, '255,236,200', .25);
  topTitle(c, t, TL.DIKSHA - .15, TL.I0, 'DIKSHA', 'the day he is initiated', { y: 480 });
  tag(c, 'NAGA INITIATION AT THE KUMBH MELA', 470, 1466, t, TL.SHAVED, { out: TL.I0, size: 22 });
  capBand(c);
} });

// ================= I · Bhaja Govindam: matted or shaven, if only for the stomach it's a costume =================
SHOTS.push({ a: TL.I0, b: TL.J0 + .3, xf: .5, draw(c, u, t) {
  dusk(t, { hairJ: 1, hairM: 0, fire: 1 });
  const k = easeIO(seg(t, TL.I0, TL.J0 + .3));
  cam3({ pos: at3(k, [-1.6, 1.0, 4.2], [-1.2, 1.15, 3.5]), at: [.3, 1.25, -1.2], fov: 42 });
  render3(c, G_.S, CAM3, { exposure: 1.15, fx: lens(dist(JH), 3, { temp: .08, sat: 1.1 }) });
  shloka(c, t, TL.MATTED2 - .3, TL.J0, ['जटिलो मुण्डी लुञ्छितकेशः', 'काषायाम्बरबहुकृतवेषः ।', 'उदरनिमित्तं बहुकृतवेषः ॥'], ['“matted, shaven, hair plucked out, in ochre robes:', 'so many costumes, all for the belly”'], 450);
  tag(c, 'BHAJA GOVINDAM', 420, 1466, t, TL.BHAJA, { out: TL.J0 });
  capBand(c);
} });

// ================= J · the ask: where did you last see a sadhu with jata? =================
SHOTS.push({ a: TL.J0, b: TL.CARD, xf: .5, draw(c, u, t) {
  dawn(t, { hairJ: 1, hairM: 0, fire: 1 });
  twoShot(easeIO(seg(t, TL.J0, TL.CARD)), { p0: [.25, 1.3, 3.0], p1: [-.05, 1.34, 3.4] });
  render3(c, G_.S, CAM3, { exposure: 1.0, fx: lens(dist(JH), 4, { temp: .06 }) });
  if (t > TL.COMMENT - .1) { const a = seg(t, TL.COMMENT - .1, TL.COMMENT + .2); band(c, 400, 600, .6 * a); text(c, 'WHICH PLACE?', 540, 500, '700 86px Cinzel', GOLD, { pop: t - TL.PLACE, alpha: seg(t, TL.PLACE - .05, TL.PLACE + .2), spacing: 5, glow: ['rgba(6,5,10,.95)', 26] }); }
  capBand(c);
} });

// ================= the card =================
SHOTS.push({ a: TL.CARD, b: TL.END + 1, draw(c, u, t) {
  rkCardCine(c, u, t, { title: 'MEET OUR GODS', line: 'Picture books of our gods, for kids', price: 'The Navadurga Set is out now', note: 'Link in bio' });
} });
