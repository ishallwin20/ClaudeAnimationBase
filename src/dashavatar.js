// dashavatar.js: Vishnu's ten avatars, and the people round them, for the Painted style. Load after narada.js,
// kartikeya.js, ram.js, ramayan.js (dasharatha()), panchmukhi.js (pmHead()), asuras.js, fable.js (tortoise()) and
// surya.js (suryaHorse()). First reel: ad/77-books123-dashavatar.
//
// The avatars
//   matsya(x, y, s, o)      the golden fish, side view facing right: (x, y) the middle of the body, about 12s from tail
//                           to snout. o: swim (phase: the tail wags), horn 0..1 (the one horn the boat is tied to,
//                           Bhagavata 8.24.44), crown (default true: a little kirita, the sign that he is Vishnu), eyes
//                           'normal' | 'happy' | 'closed' | 'wide' | 'plead', lookX / lookY, mouth 'smile' | 'O' | 'flat',
//                           blush, glowK, rot, flip, boilKey. matsyaHorn(x, y, s, o) → the horn tip (tie a rope there).
//   kurma(x, y, u, o)       the turtle: fable.js's tortoise() in Vishnu's blue with a bronze-gold shell and a kirita;
//                           every tortoise() option works.
//   varaha(x, y, s, o)      the boar, side view facing right, dark blue-grey with a bristle ridge, one great tusk, a gold
//                           crown: (x, y) the middle of the belly, about 13s long. o: lift 0..1 (the head tips up to carry
//                           the earth), legs (false: none, he's in the water), run (phase), eyes 'normal' | 'happy' |
//                           'closed' | 'wide', mouth 'smile' | 'roar' | 'flat', glowK, rot, flip, boilKey.
//                           varahaTusk(x, y, s, o) → the top of the tusk (balance the earth there).
//   narasimha(x, y, u, o)   the man-lion on Narad's rig (a warrior's build) with panchmukhi.js's lion face and a gold
//                           kirita on the mane, claws at both hands; eyes / mouth / brow / lookX are the lion face's
//                           ('roar' opens the jaws); every narada() option works.
//   vamana(x, y, u, o)      the dwarf brahmin boy on Kartikeya's rig: Vishnu's blue, a topknot, a yellow dhoti, a palm-leaf
//                           parasol in his left hand (parasol 0..1) and a kamandalu in his right (pot 0..1); every
//                           kartikeya() option works. trivikramaFoot(x, y, s, o): the giant foot of the three steps, side
//                           view, sole down at (x, y), toes to the right, the leg rising out of frame; s = foot length / 10.
//   balarama(x, y, u, o)    on Ram's rig (ram.js): fair skin, a blue dhoti, a gold kirita, his plough (hala) in his right
//                           hand (plough 0..1, ploughA tips it); every ram() option works. hala(u, sw, a) draws the plough.
//   buddha(x, y, u, o)      seated in meditation on Narad's rig: golden skin, an ochre robe, tight blue-black curls with
//                           the ushnisha, long earlobes, eyes lowered; every narada() option works (sit: 1 is the default).
//   kalki(x, y, u, o)       the rider still to come, on Narad's rig as a silhouette (dark, a rim of light, a kirita's
//                           outline, no face) with a raised sword that shines (sword 0..1, swordGlow); draw him with his
//                           waist on the horse's back and the horse over his legs. kalkiHorse(x, y, u, o) = suryaHorse()
//                           in white with a silver mane, no gold harness.
// The people
//   manu(x, y, u, o)        King Manu (Satyavrata), a royal sage on Dasharatha's rig: a grey beard, white and saffron.
//   bali(x, y, u, o)        King Bali, the generous asura king, on Dasharatha's rig: a short black beard, violet and gold.
//   hiranyakashipu(x, y, u, o) / hiranyaksha(x, y, u, o)   the asura brothers on Mahishasura's rig (asura()).
//   prahlad(x, y, u, o)     the boy devotee on Kartikeya's rig: a saffron dhoti, a topknot, a Vaishnava tilak.
//   arjuna(x, y, u, o)      on Lakshman's rig, in white and blue.
// Props
//   chhatra(u, sw, k), kamandalu(u, sw, k) (arm-space hooks, upright at the hand), crownSmall(x, y, s, key) (a kirita).
const DSV = {
  ink: '#1E2A4A', gold: '#F2C230', goldDk: '#B88A1C', goldLt: '#FFE69A', jewel: '#C8324A', white: '#FFF8EC',
  // Matsya: gold scales, coral fins
  fish: '#F5B62E', fishDk: '#C9821A', fishLt: '#FFE08A', belly: '#FFF0C2', fin: '#F57A4A', finDk: '#C8502A', scale: '#C9821A', iris: '#1E1A30', mouth: '#7A2A26',
  // Varaha
  boar: '#5E70A2', boarDk: '#3E4C74', boarLt: '#94A6D2', bristle: '#232A44', snout: '#C99AA6', snoutDk: '#9E6C7A', tusk: '#FFF6E0', tuskDk: '#D8C8A6', hoof: '#2A2438',
  // Vishnu's blue (the skin of every avatar that shows it)
  skin: '#4F86D9', skinDk: '#3563AE', skinLt: '#8DB5EE', sole: '#E8A0A6',
  // Vamana's parasol and pot
  palm: '#D9A54A', palmDk: '#A8782A', palmLt: '#F2CF84', wood: '#8A5230', woodDk: '#5E3418', brass: '#E2A93A', brassDk: '#A8741E',
  // the plough
  iron: '#8E96A6', ironDk: '#5A6070',
};

// a small kirita, the sign that a form is Vishnu: centred on its base at (x, y), s = its height / 3
function crownSmall(x, y, s, key = 'crs', rot = 0, INK = DSV.ink) {
  boilSeed(key);
  push(); translate(x, y); rotate(rot);
  paint(U([[-1.25, 0], [-1.35, -1.4], [-.8, -1.2], [-.55, -2.4], [0, -1.6], [0, -3.1], [0, -1.6], [.55, -2.4], [.8, -1.2], [1.35, -1.4], [1.25, 0]], s),
    { wash: DSV.gold, fill: DSV.goldDk, fillOp: 50, tex: .4, ink: INK, sw: clamp(s / 14, .4, 1.6), curv: .1 });
  paint(U([[-1.3, 0], [1.3, 0], [1.25, -.45], [-1.25, -.45]], s), { wash: DSV.goldLt, ink: INK, sw: clamp(s / 18, .3, 1.2) });
  paint(ellPts(0, -.95 * s, .32 * s, .38 * s, 10), { wash: DSV.jewel, ink: INK, sw: clamp(s / 20, .3, 1) });
  pop();
}

// ================= 1 · Matsya =================
function _mtLocal(x, y, s, o, px, py) {
  const r = o.rot || 0, f = o.flip ? -1 : 1, c = Math.cos(r), sn = Math.sin(r);
  return [x + f * (px * c - py * sn) * s, y + (px * sn + py * c) * s];
}
function matsyaHorn(x, y, s, o = {}) { const k = clamp(o.horn ?? 1); return _mtLocal(x, y, s, o, 3.9 + 1.7 * k, -1.5 - 2.4 * k); }
function matsya(x, y, s, o = {}) {
  const id = o.boilKey ?? 'mt' + (++CLAWD_N), rs = p => boilSeed(`matsya ${id} ${p}`), C = { ...DSV, ...(o.pal || {}) };
  const INK = C.ink, sw = clamp(s / 14, .4, 2.2), P = pts => U(pts, s), J = s * .03;
  const ph = o.swim ?? T * 1.6, wag = Math.sin(ph * TAU) * .32, fl = Math.sin(ph * TAU + 1.2);
  if (o.glowK) { rs('glow'); glow(x, y, s * 9, '#FFE6A0', o.glowK); }
  push(); translate(x, y); if (o.flip) scale(-1, 1); rotate(o.rot || 0);
  // the tail fin, wagging about the root of the tail
  rs('tail'); push(); translate(-4.9 * s, 0); rotate(wag);
  paint(P([[.2, 0], [-2.2, -2.8], [-3.5, -2.9], [-2.5, -1.1], [-2.1, 0], [-2.5, 1.1], [-3.5, 2.9], [-2.2, 2.8]]), { wash: C.fin, fill: C.finDk, fillOp: 55, tex: .5, ink: INK, sw, curv: .35 });
  for (const k of [-1.9, -.9, .9, 1.9]) inkLine(P([[-.2, k * .12], [-2.6, k * 1.05]]), sw * .45, C.finDk, 'inkfine', .3);
  pop();
  // the dorsal fin and the far pectoral fin, behind the body
  rs('dorsal');
  paint(P([[-2.8, -1.9], [-1.6, -3.5 - .15 * fl], [.2, -3.7 - .1 * fl], [1.5, -2.25]]), { wash: C.fin, fill: C.finDk, fillOp: 55, tex: .5, ink: INK, sw: sw * .8, curv: .5 });
  for (const k of [-1.8, -.9, 0, .8]) inkLine(P([[k, -2.2], [k - .3, -3.2]]), sw * .4, C.finDk, 'inkfine', .3);
  // the body
  rs('body');
  const body = P([[4.75, -.1], [4.3, -1.5], [3.0, -2.35], [.6, -2.6], [-2.2, -2.15], [-4.3, -1.15], [-5.2, -.2], [-5.2, .2], [-4.3, 1.1], [-2.2, 2.05], [.6, 2.45], [3.0, 2.2], [4.3, 1.3]]);
  paint(body, { wash: C.fish, ink: null, curv: .5 });
  paint(P([[3.8, .9], [1.5, 2.1], [-1.5, 1.95], [-3.8, 1.0], [-1.5, .9], [1.5, .9]]), { fill: C.belly, fillOp: 170, bleed: .1, tex: .4, ink: null, curv: .5 });
  paint(ellPts(-.4 * s, -1.4 * s, 3.2 * s, .6 * s, 16, J, .03), { fill: C.fishLt, fillOp: 120, bleed: .2, tex: .6, ink: null });
  rs('scales');   // rows of little scale arcs, opening toward the tail
  for (let r = 0; r < 3; r++) for (let i = 0; i < 6; i++) {
    const cx = 1.6 - i * .95 - (r % 2) * .45, cy = -1.1 + r * .95;
    if (cx < -4 + Math.abs(cy) * .8) continue;
    inkLine(P([[cx + .1, cy - .38], [cx - .3, cy], [cx + .1, cy + .38]]), sw * .45, C.scale, 'inkfine', .6);
  }
  paint(body, { ink: INK, sw, curv: .5 });
  inkLine(P([[2.35, -1.75], [1.95, -.4], [2.05, 1.0], [2.4, 1.7]]), sw * .7, C.fishDk, 'ink', .6);   // the gill
  // the near pectoral fin, flapping
  rs('pec');
  push(); translate(1.5 * s, .7 * s); rotate(.25 + .25 * fl);
  paint(P([[0, 0], [-1.6, .5], [-2.3, 1.3], [-1.2, 1.4], [0, .5]]), { wash: C.fin, fill: C.finDk, fillOp: 55, tex: .5, ink: INK, sw: sw * .7, curv: .4 });
  pop();
  // the face
  rs('eye');
  const ex = 3.15, ey = -.75, e = o.eyes || 'normal', lx = clamp(o.lookX || 0, -1, 1) * .16, ly = clamp(o.lookY || 0, -1, 1) * .16;
  if (e === 'closed' || e === 'happy') {
    inkLine(P(e === 'happy' ? [[ex - .55, ey + .15], [ex, ey - .35], [ex + .55, ey + .15]] : [[ex - .55, ey], [ex, ey + .25], [ex + .55, ey]]), sw * 1.1, INK, 'ink', .6);
  } else {
    const r = e === 'wide' ? .72 : e === 'plead' ? .7 : .62;
    paint(ellPts(ex * s, ey * s, r * s, r * 1.05 * s, 18), { wash: C.white, ink: INK, sw: sw * .9 });
    paint(ellPts((ex + lx + .05) * s, (ey + ly + .05) * s, r * .62 * s, r * .68 * s, 14), { wash: C.iris, ink: null });
    paint(ellPts((ex + lx + .22) * s, (ey + ly - .2) * s, r * .22 * s, r * .22 * s, 8), { wash: '#FFFFFF', ink: null });
    if (e === 'plead') { paint(ellPts((ex + lx - .15) * s, (ey + ly + .25) * s, r * .12 * s, r * .12 * s, 8), { wash: '#FFFFFF', ink: null }); inkLine(P([[ex - .7, ey - .9], [ex + .1, ey - 1.0], [ex + .6, ey - .75]]), sw * .7, INK, 'ink', .5); }
  }
  rs('mouth');
  const m = o.mouth || 'smile';
  if (m === 'O') paint(ellPts(4.45 * s, .55 * s, .32 * s, .4 * s, 12), { wash: C.mouth, ink: INK, sw: sw * .7 });
  else inkLine(P(m === 'flat' ? [[3.9, .6], [4.6, .5]] : [[3.75, .45], [4.15, .78], [4.65, .5]]), sw * .9, INK, 'ink', .6);
  if (o.blush) paint(ellPts(3.2 * s, .55 * s, .55 * s, .3 * s, 12), { fill: '#F2907A', fillOp: 160 * clamp(o.blush), bleed: .2, tex: .3, ink: null });
  // the crown behind the horn, the horn on the brow
  if (o.crown !== false) crownSmall(2.55 * s, -2.2 * s, .62 * s, `matsya ${id} crown`, -.15, INK);
  const hk = clamp(o.horn ?? 0);
  if (hk > .02) {
    rs('horn');
    const tip = [3.9 + 1.7 * hk, -1.5 - 2.4 * hk];
    paint(ribbon(P([[3.75, -1.55], [4.4, -1.7 - 1.0 * hk], [4.9 + .8 * hk, -1.6 - 2.0 * hk], tip]), .75 * s * Math.max(.4, hk), .08 * s), { wash: C.goldLt, fill: C.goldDk, fillOp: 45, tex: .4, ink: INK, sw: sw * .8 });
    for (const k of [.3, .55, .78]) inkLine(P([[3.85 + k * 1.4 * hk - .2, -1.7 - k * 2.2 * hk], [3.85 + k * 1.4 * hk + .25, -1.55 - k * 2.2 * hk]]), sw * .4, C.goldDk, 'inkfine', 0);
  }
  pop();
  boilSeed(`matsya ${id} after`);
}

// ================= 2 · Kurma =================
const KURMA_PAL = { shell: '#C8962E', shellDk: '#8E6418', shellLt: '#E9C46A', rim: '#F2D88E', rimDk: '#C8A452',
  skin: DSV.skin, skinDk: DSV.skinDk, skinLt: DSV.skinLt, ink: DSV.ink };
function kurma(x, y, u, o = {}) {
  const q = { ...o, pal: { ...KURMA_PAL, ...(o.pal || {}) } };
  tortoise(x, y, u, q);
  if (o.crown !== false && clamp(o.tuckHead || 0) < .5) {
    const [hx, hy] = tortoiseHead(x, y, u, q);
    crownSmall(hx - (o.flip ? -.15 : .15) * u, hy - .55 * u, .42 * u, `kurma ${o.boilKey ?? ''} crown`, (o.flip ? .25 : -.25) + (o.htilt || 0));
  }
}

// ================= 3 · Varaha =================
function _vrLocal(x, y, s, o, px, py) {
  const r = o.rot || 0, f = o.flip ? -1 : 1, c = Math.cos(r), sn = Math.sin(r);
  return [x + f * (px * c - py * sn) * s, y + (px * sn + py * c) * s];
}
const VR_NECK = [2.6, -1.2];
function _vrHeadPt(o, px, py) {   // head-local → body-local: the head turns up about the neck by lift
  const a = -clamp(o.lift || 0) * .55, c = Math.cos(a), sn = Math.sin(a);
  return [VR_NECK[0] + px * c - py * sn, VR_NECK[1] + px * sn + py * c];
}
function varahaTusk(x, y, s, o = {}) { return _vrLocal(x, y, s, o, ..._vrHeadPt(o, 3.25, -1.85)); }
function varaha(x, y, s, o = {}) {
  const id = o.boilKey ?? 'vr' + (++CLAWD_N), rs = p => boilSeed(`varaha ${id} ${p}`), C = { ...DSV, ...(o.pal || {}) };
  const INK = C.ink, sw = clamp(s / 14, .4, 2.2), P = pts => U(pts, s), J = s * .03, run = o.run;
  if (o.glowK) { rs('glow'); glow(x, y - s * 2, s * 10, '#BFE6FF', o.glowK); }
  push(); translate(x, y); if (o.flip) scale(-1, 1); rotate(o.rot || 0);
  // legs (far pair first, darker)
  if (o.legs !== false) for (const [lx, far, ph] of [[-3.0, 1, .5], [1.6, 1, 0], [-2.4, 0, 0], [2.2, 0, .5]]) {
    rs('leg' + lx);
    const sw_ = run != null ? Math.sin((run + ph) * TAU) * .45 : 0;
    push(); translate(lx * s, 1.4 * s); rotate(sw_);
    paint(P([[-.55, -.4], [.55, -.4], [.45, 2.0], [-.4, 2.0]]), { wash: far ? C.boarDk : C.boar, ink: INK, sw: sw * .8, curv: .2 });
    paint(P([[-.48, 1.8], [.5, 1.8], [.55, 2.45], [-.5, 2.45]]), { wash: C.hoof, ink: INK, sw: sw * .6 });
    pop();
  }
  // the tail, a little curl
  rs('tail');
  inkLine(P([[-4.9, -1.2], [-5.6, -1.6], [-5.6, -2.3], [-5.0, -2.2], [-5.25, -1.75]]), sw * 1.2, C.boarDk, 'ink', .7);
  // the body: a heavy barrel, the hump over the shoulders
  rs('body');
  const body = P([[-5.0, -.8], [-4.6, -2.3], [-3.0, -3.2], [-.5, -3.4], [1.6, -3.9], [3.1, -3.0], [3.5, -1.0], [3.0, 1.0], [1.5, 1.9], [-1.5, 2.0], [-3.8, 1.6], [-4.9, .6]]);
  paint(body, { wash: C.boar, fill: C.boarDk, fillOp: 45, tex: .55, ink: null, curv: .55 });
  paint(ellPts(-.6 * s, -2.4 * s, 3.4 * s, .75 * s, 16, J, -.05), { fill: C.boarLt, fillOp: 110, bleed: .2, tex: .7, ink: null });
  paint(body, { ink: INK, sw, curv: .55 });
  rs('bristle');   // the bristle ridge along the back
  const ridge = [];
  for (let i = 0; i <= 14; i++) { const k = i / 14, bx = lerp(-3.6, 2.6, k), by = -3.2 - Math.sin(k * Math.PI) * .55 - (k > .7 ? (k - .7) * 1.4 : 0); ridge.push([bx, by], [bx + .2, by - .55 - (i % 2) * .25]); }
  inkLine(P(ridge), sw * 1.1, C.bristle, 'ink', .1);
  // the head, turned up by lift about the neck
  rs('head');
  push(); translate(VR_NECK[0] * s, VR_NECK[1] * s); rotate(-clamp(o.lift || 0) * .55);
  paint(P([[-.6, -2.0], [1.0, -2.1], [3.6, -.9], [4.5, -.3], [4.6, .5], [3.8, 1.0], [1.6, 1.5], [-.4, 1.4]]), { wash: C.boar, fill: C.boarDk, fillOp: 40, tex: .5, ink: INK, sw, curv: .45 });
  paint(ellPts(1.4 * s, -1.25 * s, 1.5 * s, .4 * s, 12, J, .15), { fill: C.boarLt, fillOp: 110, bleed: .2, tex: .6, ink: null });
  // the ear, pointing back and up
  paint(P([[.2, -1.7], [-.6, -3.3], [1.1, -2.0]]), { wash: C.boarDk, ink: INK, sw: sw * .8, curv: .3 });
  // the snout disc
  paint(ellPts(4.55 * s, .1 * s, .35 * s, .62 * s, 14), { wash: C.snout, fill: C.snoutDk, fillOp: 40, ink: INK, sw: sw * .7 });
  for (const k of [-.18, .3]) paint(ellPts(4.62 * s, k * s, .08 * s, .14 * s, 6), { wash: C.snoutDk, ink: null });
  // the mouth
  const m = o.mouth || 'smile';
  if (m === 'roar') paint(P([[2.4, .7], [4.2, .55], [3.9, 1.45], [2.6, 1.25]]), { wash: C.mouth || '#6E2A26', ink: INK, sw: sw * .7, curv: .3 });
  else inkLine(P(m === 'flat' ? [[2.6, .85], [3.9, .8]] : [[2.5, .65], [3.2, 1.0], [3.95, .8]]), sw * .9, INK, 'ink', .6);
  // the eye
  const e = o.eyes || 'normal', ex = 2.1, ey = -.7;
  if (e === 'closed' || e === 'happy') inkLine(P(e === 'happy' ? [[ex - .35, ey + .1], [ex, ey - .22], [ex + .35, ey + .1]] : [[ex - .35, ey], [ex, ey + .18], [ex + .35, ey]]), sw * .9, INK, 'ink', .6);
  else {
    const r = e === 'wide' ? .62 : .54;
    paint(ellPts(ex * s, ey * s, r * s, r * 1.1 * s, 14), { wash: C.white, ink: INK, sw: sw * .7 });
    paint(ellPts((ex + .08) * s, (ey + .04) * s, r * .6 * s, r * .66 * s, 12), { wash: C.iris || '#1E1A30', ink: null });
    paint(ellPts((ex + .2) * s, (ey - .14) * s, r * .2 * s, r * .2 * s, 8), { wash: '#FFFFFF', ink: null });
    inkLine(P([[ex - .5, ey - .62], [ex + .45, ey - .48]]), sw * .8, C.bristle, 'ink', .3);   // a heavy brow
  }
  // the great tusk, curving up past the snout
  rs('tusk');
  paint(ribbon(P([[3.0, .75], [3.75, .5], [3.85, -.6], [3.25, -1.85]]), .5 * s, .06 * s), { wash: C.tusk, fill: C.tuskDk, fillOp: 45, tex: .3, ink: INK, sw: sw * .7 });
  // the crown between the ears
  if (o.crown !== false) crownSmall(.9 * s, -2.0 * s, .52 * s, `varaha ${id} crown`, .2, INK);
  pop();
  pop();
  boilSeed(`varaha ${id} after`);
}

// ================= 4 · Narasimha =================
const NSM_PAL = { skin: '#E9A848', skinDk: '#C07E28', skinLt: '#FFD088', ink: '#4A2A18',
  dhoti: '#F2C230', dhotiDk: '#C8961C', dhotiLt: '#FFE08A', border: '#C8323A', shawl: '#D2452F', shawlDk: '#9E2E22',
  bead: '#EDB43C', beadDk: '#B67D1C', tulsi: '#EDB43C' };
function _nsClaws(u, sw) {   // four ivory claws curving from the top of the hand (arm space, upright)
  for (let i = 0; i < 4; i++) {
    const a = -.55 + i * .37, bx = Math.sin(a) * .55 * u, by = -Math.cos(a) * .45 * u;
    paint([[bx - .12 * u, by], [bx + .12 * u, by], [bx + Math.sin(a + .5) * .7 * u, by - Math.cos(a) * .6 * u]], { wash: '#FFF6E0', ink: PMK.ink, sw: sw * .35 });
  }
}
function narasimha(x, y, u, o = {}) {
  const key = o.boilKey ?? 'nsm';
  return narada(x, y, u, { veena: false, topknot: false, tilak: false, brawn: 1, shawl: true, ...o, pal: { ...NSM_PAL, ...(o.pal || {}) },
    face: (uu, sw, J, INK, hx, oo) => {
      pmHead('narasimha', hx * .7 * uu, -20.5 * uu, 1.22 * uu, { eyes: oo.eyes || 'angry', mouth: oo.mouth || 'roar', brow: oo.brow ?? -1, lookX: oo.lookX, lookY: oo.lookY, puff: oo.lionPuff, boilKey: key + 'face' });
      crownSmall(hx * .7 * uu, -24.3 * uu, .95 * uu, key + 'crown');
    },
    armL: (uu, sw) => { _nsClaws(uu, sw); if (o.armL) o.armL(uu, sw); },
    armR: (uu, sw) => { _nsClaws(uu, sw); if (o.armR) o.armR(uu, sw); } });
}

// ================= 5 · Vamana and Trivikrama =================
const VMN_PAL = { skin: DSV.skin, skinDk: DSV.skinDk, skinLt: DSV.skinLt, hair: '#1E1A2A', teal: '#F6C431', tealDk: '#D49A1A', tealLt: '#FFE08A', sash: '#C8803A', gold: '#F2C230' };
// the palm-leaf parasol, upright in the hand: a long staff and a shallow dome of ribs
function chhatra(u, sw, k = 1) {
  const P = pts => U(pts, u), INK = DSV.ink;
  push(); scale(k);
  paint(ribbon(P([[0, 1.2], [0, -8.6]]), .32 * u, .28 * u), { wash: DSV.wood, ink: INK, sw: sw * .5 });
  const dome = [];
  for (let i = 0; i <= 16; i++) { const a = Math.PI + i / 16 * Math.PI; dome.push([Math.cos(a) * 4.6, -8.2 + Math.sin(a) * 1.9]); }
  for (let i = 0; i <= 10; i++) { const k2 = i / 10, a = (k2 - .5) * .9; dome.push([4.6 - k2 * 9.2, -8.2 + .55 * Math.abs(Math.sin(k2 * Math.PI * 5))]); }
  paint(P(dome), { wash: DSV.palm, fill: DSV.palmDk, fillOp: 45, tex: .5, ink: INK, sw: sw * .8, curv: .2 });
  for (let i = 0; i < 7; i++) { const a = Math.PI + (i + .5) / 7 * Math.PI; inkLine(P([[0, -9.9], [Math.cos(a) * 4.5, -8.2 + Math.sin(a) * 1.85 + .1]]), sw * .45, DSV.palmDk, 'inkfine', .3); }
  paint(ellPts(0, -10.15 * u, .35 * u, .35 * u, 10), { wash: DSV.gold, ink: INK, sw: sw * .4 });
  pop();
}
// the kamandalu, hanging from the hand by its handle
function kamandalu(u, sw, k = 1) {
  const P = pts => U(pts, u), INK = DSV.ink;
  push(); scale(k);
  inkLine(P([[-.7, 1.1], [-.6, -.2], [0, -.45], [.6, -.2], [.7, 1.1]]), sw * .7, DSV.brassDk, 'ink', .6);
  paint(P([[-.5, .9], [.5, .9], [.6, 1.3], [1.35, 1.9], [1.45, 2.9], [.9, 3.5], [-.9, 3.5], [-1.45, 2.9], [-1.35, 1.9], [-.6, 1.3]]), { wash: DSV.brass, fill: DSV.brassDk, fillOp: 45, tex: .4, ink: INK, sw: sw * .7, curv: .5 });
  paint(ribbon(P([[1.2, 2.2], [2.1, 1.7], [2.5, 1.0]]), .3 * u, .14 * u), { wash: DSV.brass, ink: INK, sw: sw * .5 });
  paint(ellPts(-.55 * u, 2.3 * u, .25 * u, .45 * u, 8), { wash: '#FFF0C0', washOp: 140, ink: null });
  pop();
}
// a Vaishnava U tilak for the children on Kartikeya's rig (head space, over the face)
function kidTilak(u, sw) {
  inkLine(U([[-.5, -14.2], [-.42, -13.25], [0, -12.95], [.42, -13.25], [.5, -14.2]], u), sw * .9, '#FFF6E6', 'ink', .5);
  inkLine(U([[0, -14.1], [0, -13.3]], u), sw * .9, '#D9302E', 'ink', 0);
}
function vamana(x, y, u, o = {}) {
  const ps = o.parasol ?? 1, pt = o.pot ?? 1;
  return kartikeya(x, y, u, { spear: false, shield: false, feather: false, tilak: false, head: kidTilak, aL: .9, aR: -1.2, ...o, pal: { ...VMN_PAL, ...(o.pal || {}) },
    armL: (uu, sw) => { if (ps > .01) chhatra(uu, sw, ps); if (o.armL) o.armL(uu, sw); },
    armR: (uu, sw) => { if (pt > .01) kamandalu(uu, sw, pt); if (o.armR) o.armR(uu, sw); } });
}
// the giant foot: sole on the line y, heel at x - 3.2s, toes to x + 5.6s, the leg rising to y - legLen·s
function trivikramaFoot(x, y, s, o = {}) {
  const key = o.boilKey ?? 'tvf', INK = DSV.ink, sw = clamp(s / 10, .5, 3), P = pts => U(pts, s), len = o.legLen ?? 30;
  if (o.glowK) { boilSeed(key + 'glow'); glow(x + s, y - 2 * s, s * 9, '#FFE6A0', o.glowK); }
  push(); translate(x, y); if (o.flip) scale(-1, 1); rotate(o.rot || 0);
  boilSeed(key + ' leg');
  paint(P([[-3.2, -2.6], [-3.6, -8], [-3.9, -len], [2.3, -len], [1.9, -8], [1.4, -3.4]]), { wash: DSV.skin, fill: DSV.skinDk, fillOp: 40, tex: .5, ink: INK, sw, curv: .3 });
  if (len > 12) {   // the hem of the yellow dhoti, high up
    paint(P([[-3.6, -len - 1], [-3.3, -11.5], [-1.0, -10.6], [1.9, -11.3], [2.0, -len - 1]]), { wash: '#F6C431', fill: '#D49A1A', fillOp: 45, tex: .5, ink: INK, sw, curv: .3 });
    inkLine(P([[-3.3, -11.6], [-1.0, -10.7], [1.9, -11.4]]), sw * 1.6, '#D2452F', 'ink', .5);
  }
  boilSeed(key + ' foot');
  const foot = P([[-3.1, -3.6], [-3.6, -1.4], [-3.0, 0], [4.9, 0], [5.7, -.4], [5.7, -1.1], [5.2, -1.5], [4.6, -1.5], [3.4, -2.0], [1.6, -3.0], [1.4, -4.2]]);
  paint(foot, { wash: DSV.skin, fill: DSV.skinDk, fillOp: 40, tex: .5, ink: INK, sw, curv: .4 });
  paint(P([[-2.9, -.25], [4.7, -.25], [4.9, 0], [-3.0, 0]]), { wash: DSV.sole, ink: null });
  paint(ellPts(.2 * s, -2.1 * s, 2.0 * s, .45 * s, 14, 0, -.25), { fill: DSV.skinLt, fillOp: 110, bleed: .2, tex: .6, ink: null });
  for (const [k, h] of [[3.5, 1.55], [4.1, 1.45], [4.65, 1.35]]) paint(ellPts(k * s, -(h - .45) * s, .42 * s, .5 * s, 12), { wash: DSV.skin, ink: INK, sw: sw * .5 });   // the little toes, then the big toe over them
  paint(ellPts(5.15 * s, -.75 * s, .65 * s, .72 * s, 14), { wash: DSV.skin, ink: INK, sw: sw * .6 });
  paint(ellPts(5.45 * s, -.95 * s, .25 * s, .3 * s, 10), { wash: '#FFE2E0', washOp: 200, ink: INK, sw: sw * .4 });   // the nail
  // a gold anklet
  boilSeed(key + ' anklet');
  paint(P([[-3.2, -3.4], [1.3, -3.6], [1.3, -4.3], [-3.15, -4.1]]), { wash: DSV.gold, fill: DSV.goldDk, fillOp: 45, ink: INK, sw: sw * .7 });
  for (let i = 0; i < 6; i++) paint(ellPts((-2.8 + i * .8) * s, -3.35 * s, .22 * s, .22 * s, 8), { wash: DSV.goldLt, ink: INK, sw: sw * .3 });
  pop();
}

// ================= 9 · Balarama, the Buddha =================
const BLR_PAL = { skin: '#F4D2B4', skinDk: '#D6A888', skinLt: '#FFE8D4', dhoti: '#2F5FB0', dhotiDk: '#1E4282', dhotiLt: '#6E96D6',
  border: '#F2C230', shawl: '#F2C230', shawlDk: '#C8961C', hair: '#2A2030' };
// the plough, in arm space (upright at the hand): a long wooden beam down to an iron share that curves forward
function hala(u, sw, a = 0) {
  const P = pts => U(pts, u), INK = DSV.ink;
  push(); rotate(a);
  paint(ribbon(P([[0, -3.2], [0, 4], [.2, 10.6]]), .5 * u, .45 * u), { wash: DSV.wood, fill: DSV.woodDk, fillOp: 40, tex: .4, ink: INK, sw: sw * .7 });
  paint(ribbon(P([[-1.1, -3.2], [1.1, -3.2]]), .45 * u, .45 * u), { wash: DSV.woodDk, ink: INK, sw: sw * .5 });   // the grip
  paint(P([[-.3, 9.8], [.5, 9.6], [2.2, 11.1], [2.9, 12.6], [1.6, 12.0], [-.2, 11.0]]), { wash: DSV.iron, fill: DSV.ironDk, fillOp: 50, tex: .3, ink: INK, sw: sw * .7, curv: .3 });
  for (const k of [2, 6]) paint(P([[-.35, k], [.4, k], [.42, k + .5], [-.33, k + .5]]), { wash: DSV.gold, ink: INK, sw: sw * .3 });
  pop();
}
function balaramaShare(x, y, u, o = {}) {   // the world point of the plough's tip
  const [hx, hy] = naradaHand(x, y, u, { ...o, sit: 0 }, 1), a = o.ploughA ?? 0, f = o.flip ? -1 : 1;
  const lx = 2.9, ly = 12.6;
  return [hx + f * (lx * Math.cos(a) - ly * Math.sin(a)) * u, hy + (lx * Math.sin(a) + ly * Math.cos(a)) * u];
}
function balarama(x, y, u, o = {}) {
  const pk = o.plough ?? 1;
  return ram(x, y, u, { kodanda: false, handR: [5.4, -12.6], bendR: .7, ...o, pal: { ...BLR_PAL, ...(o.pal || {}) },
    armR: (uu, sw) => { if (pk > .01) { push(); scale(pk); hala(uu, sw, o.ploughA ?? 0); pop(); } if (o.armR) o.armR(uu, sw); } });
}
const BDH_PAL = { skin: '#E9B98A', skinDk: '#C89466', skinLt: '#F8D6B2', dhoti: '#D9822B', dhotiDk: '#A85E1A', dhotiLt: '#F2A85A',
  border: '#B8641E', shawl: '#D9822B', shawlDk: '#A85E1A', hair: '#1E2238', hairLt: '#3A4266' };
function _bdHead(uu, sw) {   // in narada()'s head space: tight curls over the crown, the ushnisha, long earlobes
  const P = pts => U(pts, uu), INK = NRD.ink;
  boilSeed('buddha ears');
  for (const s of [-1, 1]) paint(P([[s * 2.95, -21.0], [s * 3.3, -20.4], [s * 3.3, -18.0], [s * 3.05, -17.3], [s * 2.8, -18.0], [s * 2.85, -20.2]]), { wash: BDH_PAL.skin, fill: BDH_PAL.skinDk, fillOp: 40, ink: INK, sw: sw * .6, curv: .5 });
  boilSeed('buddha curls');
  paint(P([[-3.15, -21.2], [-3.0, -22.9], [-1.9, -23.75], [0, -24.05], [1.9, -23.75], [3.0, -22.9], [3.15, -21.2], [2.1, -22.2], [0, -22.5], [-2.1, -22.2]]), { wash: BDH_PAL.hair, ink: INK, sw: sw * .6, curv: .5 });
  paint(ellPts(0, -24.6 * uu, 1.35 * uu, 1.0 * uu, 16), { wash: BDH_PAL.hair, ink: INK, sw: sw * .6 });   // the ushnisha
  for (let i = 0; i < 16; i++) { const a = Math.PI + (i + .5) / 16 * Math.PI, r = i % 2 ? 2.55 : 2.95; paint(ellPts(Math.cos(a) * r * uu, (-21.4 + Math.sin(a) * r * .78) * uu, .26 * uu, .24 * uu, 8), { wash: BDH_PAL.hairLt, ink: null }); }
  for (let i = 0; i < 6; i++) { const a = Math.PI + (i + .5) / 6 * Math.PI; paint(ellPts(Math.cos(a) * .9 * uu, (-24.6 + Math.sin(a) * .6) * uu, .22 * uu, .2 * uu, 8), { wash: BDH_PAL.hairLt, ink: null }); }
  paint(ellPts(0, -21.0 * uu, .2 * uu, .2 * uu, 8), { wash: '#F6E6C8', ink: null });   // the urna
}
function buddha(x, y, u, o = {}) {
  return narada(x, y, u, { sit: 1, veena: false, topknot: false, tilak: false, mala: false, eyes: 'closed', mouth: 'smile', ...o, pal: { ...BDH_PAL, ...(o.pal || {}) },
    hat: (uu, sw) => { _bdHead(uu, sw); if (o.hat) o.hat(uu, sw); } });
}

// ================= 10 · Kalki =================
const KALKI_PAL = { skin: '#1C1826', skinDk: '#141020', skinLt: '#2A2436', dhoti: '#1C1826', dhotiDk: '#141020', dhotiLt: '#2A2436',
  border: '#2A2436', shawl: '#221C2E', shawlDk: '#141020', hair: '#141020', hairLt: '#2A2436', bead: '#2A2436', beadDk: '#141020', tulsi: '#2A2436', ink: '#0C0A12' };
function kalki(x, y, u, o = {}) {
  const sk = o.sword ?? 1, g = o.swordGlow ?? 1;
  return narada(x, y, u, { veena: false, topknot: false, tilak: false, mala: false, brawn: 1, handR: [5.6, -24], bendR: .4, ...o, pal: { ...KALKI_PAL, ...(o.pal || {}) },
    face: (uu, sw, J, INK, hx) => {   // no face: a dark head under a kirita's outline, a rim of light on one side
      boilSeed('kalki head');
      paint(ellPts(0, -20.6 * uu, 3.2 * uu, 3.05 * uu, 24, J), { wash: KALKI_PAL.skin, ink: INK, sw });
      paint(U([[-2.3, -23.2], [-2.5, -26.0], [-1.3, -25.4], [-.8, -27.6], [0, -26.2], [0, -29.2], [0, -26.2], [.8, -27.6], [1.3, -25.4], [2.5, -26.0], [2.3, -23.2]], uu), { wash: KALKI_PAL.skin, ink: INK, sw, curv: .1 });
      inkLine(U([[2.5, -22.6], [3.1, -20.8], [2.9, -18.9]], uu), sw * 1.6, '#BFD8FF', 'ink', .6);
    },
    armR: (uu, sw) => {
      if (sk < .02) return;
      push(); scale(sk);
      if (g > 0) glow(0, -6 * uu, 7 * uu, '#CFE6FF', .6 * g);
      paint(U([[-.45, -1.0], [.45, -1.0], [.38, -12.5], [0, -13.8], [-.38, -12.5]], uu), { wash: '#EAF4FF', fill: '#9FB8D8', fillOp: 40, ink: '#0C0A12', sw: sw * .6 });
      paint(U([[-1.4, -.6], [1.4, -.6], [1.4, -1.1], [-1.4, -1.1]], uu), { wash: '#C8D2E2', ink: '#0C0A12', sw: sw * .5 });
      pop();
      if (o.armR) o.armR(uu, sw);
    } });
}
function kalkiHorse(x, y, u, o = {}) { return suryaHorse(x, y, u, { coat: '#FAF8FF', coatDk: '#C9CCE0', mane: '#E2E6F2', harness: false, ...o }); }

// ================= the people =================
const MANU_PAL = { skin: '#E6B48A', skinDk: '#C28C62', skinLt: '#F8D2B0', dhoti: '#F6EEDD', dhotiDk: '#D8CCB0', dhotiLt: '#FFFFFF', border: '#E2852A', shawl: '#E2852A', shawlDk: '#B05E1A' };
function manu(x, y, u, o = {}) { return dasharatha(x, y, u, { beard: '#9A929A', boilKey: 'manu', seed: 61, ...o, pal: { ...MANU_PAL, ...(o.pal || {}) } }); }
const BALI_PAL = { hair: '#2A2030', hairLt: '#4E4058', skin: '#C98A5E', skinDk: '#A06A40', skinLt: '#E8B28A', dhoti: '#6A3A9A', dhotiDk: '#4A2870', dhotiLt: '#9A6ACA', border: '#F2C230', shawl: '#F2C230', shawlDk: '#C8961C' };
function bali(x, y, u, o = {}) { return dasharatha(x, y, u, { beard: '#2A2030', beardLen: .45, boilKey: 'bali', seed: 63, ...o, pal: { ...BALI_PAL, ...(o.pal || {}) } }); }
function hiranyakashipu(x, y, u, o = {}) {
  return asura(x, y, u, { kind: 'shumbha', boilKey: 'hkp', seed: 65, ...o, pal: { skin: '#C85A3A', skinDk: '#9E3E26', skinLt: '#E88A68', dhoti: '#2A1E3A', dhotiDk: '#1A1228', sash: '#F2C230', sashDk: '#C8961C', ...(o.pal || {}) } });
}
function hiranyaksha(x, y, u, o = {}) {
  return asura(x, y, u, { kind: 'chanda', boilKey: 'hks', seed: 67, ...o, pal: { skin: '#3E6A5A', skinDk: '#2A4A3E', skinLt: '#6A9A86', ...(o.pal || {}) } });
}
const PRAH_PAL = { skin: '#EAB88E', skinDk: '#C69068', skinLt: '#FAD4B0', teal: '#F29A38', tealDk: '#C96E1E', tealLt: '#FFC27A', sash: '#F6EEDD' };
function prahlad(x, y, u, o = {}) { return kartikeya(x, y, u, { spear: false, shield: false, feather: false, tilak: false, head: kidTilak, boilKey: 'prah', seed: 69, ...o, pal: { ...PRAH_PAL, ...(o.pal || {}) } }); }
const ARJ_PAL = { dhoti: '#F6EEDD', dhotiDk: '#D8CCB0', dhotiLt: '#FFFFFF', shawl: '#3E6AB8', shawlDk: '#2A4A86', border: '#F2C230' };
function arjuna(x, y, u, o = {}) { return lakshman(x, y, u, { boilKey: 'arj', seed: 71, kodanda: false, ...o, pal: { ...ARJ_PAL, ...(o.pal || {}) } }); }

// Model sheet: studio.html?loop=dashavatar, or node render.mjs --loop=dashavatar --sheet=0.5 --cols=1 --w=1080
(() => {
  LOOPS.dashavatar = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: PAL.paper, ink: null });
    matsya(240, 330, 16, { horn: 1, eyes: 'happy' });
    matsya(470, 260, 5, { eyes: 'plead' });
    kurma(800, 400, 30, { eyes: 'happy', mouth: 'smile', neck: .8 });
    varaha(260, 820, 22, { lift: .6, eyes: 'happy' });
    earthBall(...varahaTusk(260, 820, 22, { lift: .6 }).map((v, i) => v - (i ? 70 : 0)), 70, t, 'sheetearth');
    narasimha(800, 1000, 15, { eyes: 'angry', mouth: 'roar', handL: [-6, -20], handR: [6, -20] });
    vamana(160, 1460, 17, { eyes: 'normal', mouth: 'smile' });
    trivikramaFoot(330, 1440, 16, { legLen: 14 });
    balarama(700, 1460, 14, { mouth: 'smile' });
    buddha(940, 1440, 12, {});
    kalkiHorse(300, 1800, 18, { gallop: frac(t) });
    kalki(300, 1800 - 9 * 18 + 12.2 * 12, 12, {});
    kalkiHorse(300, 1800, 18, { gallop: frac(t) });
    manu(620, 1880, 12, {}); bali(760, 1880, 12, {}); prahlad(880, 1880, 12, {}); hiranyakashipu(1010, 1880, 11, {});
  };
  LOOPS.dashavatar.len = 4;
})();
