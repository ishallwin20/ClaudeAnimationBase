// narada.js: Narad Muni, the wandering devarishi, standing: fair skin, a tall black topknot bound with a rudraksha band
// and a white flower, the white-and-red Vaishnava tilak (he's Narayana's devotee), a saffron knee-length dhoti with a
// maroon border, a cream uttariya across his chest, a tulsi mala, and his mahati veena over his left shoulder (its gourd
// at his hip, the neck rising past his head). Kartals (little cymbals) for his right hand.
// monkey: 1 swaps his face for the monkey face Vishnu gave him (Ramcharitmanas, Bal Kand): brown fur, big ears, a peach
// mask and muzzle, his own topknot and tilak still on top.
// Load after bappa.js (U()), clawd.js (eyes() / mouth() / emote(), so feel() and emotions() drive him too).
// (x, y) is the ground point under him; u is the size unit (about 29u tall to the top of the topknot, 7.5u wide).
//
// Body-local coordinates in u (y up is negative):
//   feet (±1.3, -.5) · legs -5.6..-.7 · dhoti -12.2..-5.2 · chest centre (0, -14.6) · shoulders (±3, -16.3)
//   head centre (0, -20.6), 3.2 × 3.05 · eyes (±1.2, -20.5) · mouth (0, -18.5) · topknot (0, -25.3), top -27.2
//   (the head is then scaled 1.16× about the neck at (0, -18), as Shani's)
//   veena: the gourd (-1.3, -9) · the neck runs up past the left of his head to its top gourd (-4.9, -27.4)
//   sit: 1 crosses his legs in meditation (a lap -3.6..0, out to ±6.2); everything above the waist drops by 8.6u
//
// Options (all optional):
//   pose:   walk (phase), dx, dy (u), sq, rot, flip, hx (-1..1 head turn), htilt, lean (u), bow 0..1, sit (1: lotus
//           pose), puff 0..1 (pride: the chest swells, the chin goes up), cloud 0..1 (stands on a little cloud)
//   arms:   handL / handR = [x, y] in u (default: the left hand on the veena's neck, the right hanging), bendL / bendR,
//           pray 0..1 (palms joined), mudra 0..1 (sitting: hands on the knees in chin mudra), strum 0..1 (the right hand
//           plucks the strings), kartal 0..1 (cymbals in the right hand) + clap (seconds since a clink), armL / armR
//           hooks (upright, at the hands), veena (default true)
//   face:   eyes ('normal' / 'look' / 'wide' / 'closed' / 'happy' / 'smug' / 'angry' are his own; every other kind is
//           Clawd's: heart, swirl, …), lookX / lookY, brow (-1 stern .. 1 raised), mouth ('smile' / 'grin' / 'smug' /
//           'flat' / 'frown' / 'O' / 'open' / 'scream' / 'sheepish' are his own, else Clawd's), squint, blush, sweat,
//           seed, tint + tintK; monkey 0..1 (> .5: the monkey face, same eyes and mouths)
//   extras: hat(u, sw) (head space, over the topknot: a sprouting tree of pride), headBehind(u, sw) (head space, under
//           the head and over the torso: Panchmukhi Hanuman's other four faces), behind(u, sw) (body space, drawn
//           first: Hanuman's tail in hanuman.js, Ram's bow), chest(u, sw) (body space, over the torso
//           and under the mala: a sacred thread), mala (false: no mala), shawl (false: no uttariya), topknot (false: none, for a crown in
//           hat: Krishna in krishna.js), emote + emoteK + emoteAge, boilKey,
//           noShadow, swMul, tilak (false: none), face(u, sw, J, INK, hx, o) (head space: drawn instead of his head and
//           face, eyes and mouth included: Jambavan's bear face in jambavan.js; naradaEyes / naradaMouth_ help)
//   others: pal (overrides NRD: skin, dhoti, border, shawl, hair, …) + beard (a colour: a full sage's beard and moustache)
//           draw other rishis on his rig (Kashyapa, Agastya in the Surya book; NRD_SAGE is a white-haired elder)
// Helpers: naradaHand(x, y, u, o, s), naradaHead(x, y, u, o), naradaEye(x, y, u, o, s), naradaMouth(x, y, u, o),
//          naradaTop(x, y, u, o) (the top of the topknot), naradaLocal(x, y, u, o, px, py) → world [x, y] (upper body).
const NRD = {
  skin: '#F4C79E', skinDk: '#D99A6E', skinLt: '#FFE3C6', ink: '#3A2430',
  dhoti: '#F29A38', dhotiDk: '#C96E1E', dhotiLt: '#FFC27A', border: '#A8323A',
  shawl: '#FFF3DC', shawlDk: '#E2CFA8', hair: '#2A2030', hairLt: '#4E4058', bead: '#8A4E2E', beadDk: '#5E3220', tulsi: '#C9A86A',
  gold: '#EDB43C', goldDk: '#B67D1C', goldLt: '#FFE39A', white: '#FFF8EC', iris: '#2A1A1E', lip: '#B8505A', tilak: '#FFF6E6', red: '#D9302E',
  wood: '#A0602E', woodDk: '#6E3C1A', woodLt: '#D08A4E', gourd: '#E8B860', gourdDk: '#B8862E', string: '#FFF0C8', flower: '#FFFDF4',
  fur: '#9A6440', furDk: '#6E4228', furLt: '#C08A5E', mask: '#F0C29A', maskDk: '#D29A70', mouth: '#5A2228', cloud: '#FFFFFF', cloudDk: '#D6E2F2',
};
const NRD_HS = 1.16, NRD_SIT = 8.6;
const NRD_SKIN = { col: NRD.skin, dk: NRD.skinDk, lt: NRD.skinLt };
const NRD_VB = [-1.3, -9], NRD_VT = [-4.9, -27.4];   // the veena's gourd and its top

function naradaArm(o, s) {
  const sh = [s * 3, -16.3], sit = o.sit ? 1 : 0;
  let ha = (s < 0 ? o.handL : o.handR) || (s < 0 ? (o.veena === false ? [-3.45, -10.8] : [-2.35, -13.2]) : [3.45, -10.8]);
  const st = clamp(o.strum || 0), md = clamp(o.mudra ?? (sit && !(s < 0 ? o.handL : o.handR) ? 1 : 0)), pr = clamp(o.pray || 0);
  if (s > 0 && st > 0) { const w = Math.sin(T * 16) * .35; ha = [lerp(ha[0], -.35 + w, st), lerp(ha[1], -11.4 + w * .4, st)]; }
  if (md > 0 && sit && !(s < 0 && o.veena !== false && !o.handL)) ha = [lerp(ha[0], s * 4.6, md), lerp(ha[1], -9.6, md)];   // knees, in body u before the sit drop
  if (pr > 0) ha = [lerp(ha[0], s * .42, pr), lerp(ha[1], -14.3, pr)];
  const dx = ha[0] - sh[0], dy = ha[1] - sh[1], d = Math.hypot(dx, dy) || 1;
  let nx = -dy / d, ny = dx / d; if (nx * s < 0) { nx = -nx; ny = -ny; }
  const b = (s < 0 ? o.bendL : o.bendR) ?? .6;
  return [sh, [(sh[0] + ha[0]) / 2 + nx * b, (sh[1] + ha[1]) / 2 + ny * b], ha];
}
function naradaLocal(x, y, u, o, px, py) {
  const sq = o.sq || 0, fx = o.flip ? -1 : 1, l = o.lean || 0, r = l * .07;
  const qx = px, qy = py + 12, hx = qx * Math.cos(r) - qy * Math.sin(r), hy = qx * Math.sin(r) + qy * Math.cos(r) - 12 + (o.sit ? NRD_SIT : 0);
  const R = o.rot || 0, X = fx * hx * (1 + sq * .6), Y = hy * (1 - sq);
  return [x + (o.dx || 0) * u + (X * Math.cos(R) - Y * Math.sin(R)) * u, y + (o.dy || 0) * u + (X * Math.sin(R) + Y * Math.cos(R)) * u];
}
const _nrH = v => -18 + (v + 18) * NRD_HS;
function naradaHand(x, y, u, o, s) { const [, , h] = naradaArm(o, s); return naradaLocal(x, y, u, o, h[0], h[1]); }
function naradaHead(x, y, u, o = {}) { return naradaLocal(x, y, u, o, clamp(o.hx || 0, -1, 1) * .5, _nrH(-20.6) + (o.bow || 0) * .5 - (o.puff || 0) * .3); }
function naradaEye(x, y, u, o = {}, s = 1) { const hx = clamp(o.hx || 0, -1, 1); return naradaLocal(x, y, u, o, hx * .5 + (hx * .8 + s * 1.2) * NRD_HS, _nrH(-20.5) + (o.bow || 0) * .5); }
function naradaMouth(x, y, u, o = {}) { const hx = clamp(o.hx || 0, -1, 1); return naradaLocal(x, y, u, o, hx * 1.4, _nrH(-18.5) + (o.bow || 0) * .5); }
function naradaTop(x, y, u, o = {}) { return naradaLocal(x, y, u, o, clamp(o.hx || 0, -1, 1) * .7, _nrH(-27.2) + (o.bow || 0) * .5); }

// the mahati veena, in body u: a gourd at the bottom, a long neck, a small gourd and pegs at the top, three strings
function naradaVeena(u, sw, INK = NRD.ink, shiver = 0) {
  const P = pts => U(pts, u), [bx, by] = NRD_VB, [tx, ty] = NRD_VT, dx = tx - bx, dy = ty - by, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
  paint(P([[bx + nx * .55, by + ny * .55], [tx + nx * .4, ty + ny * .4], [tx - nx * .4, ty - ny * .4], [bx - nx * .55, by - ny * .55]]), { wash: NRD.wood, fill: NRD.woodDk, fillOp: 50, tex: .5, ink: INK, sw: sw * .7 });
  const along = k => [bx + dx * k, by + dy * k];
  for (const k of [.3, .55, .8]) { const [a, b] = along(k); inkLine(P([[a + nx * .55, b + ny * .55], [a - nx * .55, b - ny * .55]]), sw * .9, NRD.gold, 'ink', 0); }   // frets bands
  paint(ellPts(tx * u, ty * u, 1 * u, .95 * u, 16), { wash: NRD.gourd, fill: NRD.gourdDk, fillOp: 60, tex: .5, ink: INK, sw: sw * .7 });
  for (const k of [.93, .96]) { const [a, b] = along(k); inkLine(P([[a + nx * 1, b + ny * 1], [a + nx * 1.5, b + ny * 1.5]]), sw * 1, NRD.woodDk, 'ink', 0); }   // pegs
  for (const j of [-.25, 0, .25]) {
    const w = shiver * Math.sin(T * 60 + j * 9) * .12;
    inkLine(P([[bx + nx * (j + w), by + ny * (j + w) - .4], [lerp(bx, tx, .5) + nx * (j - w), lerp(by, ty, .5) + ny * (j - w)], [tx + nx * j * .8, ty + ny * j * .8 + .9]]), sw * .35, NRD.string, 'inkfine', 0);
  }
  paint(ellPts(bx * u, by * u, 1.75 * u, 1.65 * u, 20), { wash: NRD.gourd, fill: NRD.gourdDk, fillOp: 70, tex: .6, ink: INK, sw: sw * .8 });
  paint(ellPts((bx - .55) * u, (by - .5) * u, .6 * u, .45 * u, 10), { wash: NRD.goldLt, washOp: 150, ink: null });
  inkLine(P([[bx - 1, by - 1.1], [bx + .2, by - 1.6], [bx + 1.2, by - 1.1]]), sw * .9, NRD.woodDk, 'ink', .5);   // the collar
}
function naradaKartal(u, sw, clap = 9, INK = NRD.ink) {
  const k = clap < .25 ? 1 - clap / .25 : 0;
  for (const s of [-1, 1]) {
    push(); translate(s * (.15 + .5 * (1 - k)) * u, -.9 * u); rotate(s * (.25 + .4 * (1 - k)));
    paint(ellPts(0, 0, .8 * u, .28 * u, 12), { wash: NRD.gold, fill: NRD.goldDk, fillOp: 50, ink: INK, sw: sw * .55 });
    pop();
  }
}

// an elder rishi: white hair and beard, a deeper saffron, a rudraksha-brown border
const NRD_SAGE = { hair: '#EDE6DC', hairLt: '#FFFFFF', dhoti: '#E8862E', dhotiDk: '#B85E18', border: '#7A3A1E', skin: '#E8B48A', skinDk: '#C68A60', skinLt: '#FAD2AE' };
function narada(x, y, u, o = {}) {
  if (o.pal) {   // draw on the same rig in other colours: swap NRD for the call (the eye and mouth helpers read it too)
    const keep = { ...NRD }; Object.assign(NRD, o.pal);
    try { return narada(x, y, u, { ...o, pal: null }); } finally { Object.assign(NRD, keep); }
  }
  const id = o.boilKey ?? 'nr' + (++CLAWD_N), rs = p => boilSeed(`narada ${id} ${p}`);
  x += (o.dx || 0) * u;
  const dy = (o.dy || 0) * u, sq = (o.sq || 0) + (o.take || 0), sw = clamp(u / 20, .4, 2) * (o.swMul || 1), J = u * .04;
  const { col, dk, lt } = tintCols({ ...o, col: o.col || NRD.skin, dk: o.dk || NRD.skinDk, lt: o.lt || NRD.skinLt });
  const P = pts => U(pts, u), INK = NRD.ink, wk = o.walk, hx = clamp(o.hx || 0, -1, 1), lean = o.lean || 0, sit = !!o.sit;
  const bw = clamp(o.bow || 0), pf = clamp(o.puff || 0), mk = (o.monkey || 0) > .5;

  if (o.cloud) {
    rs('cloud');
    const k = clamp(o.cloud);
    const L = [[-4.6, .5, 1.7], [-2.6, -.3, 2.1], [0, -.7, 2.4], [2.6, -.3, 2.1], [4.6, .5, 1.7], [-1.4, 1.1, 2], [1.6, 1.1, 2]];
    for (const [cx, cy, r] of L) paint(ellPts(x + cx * u * k, y + cy * u, r * u * k, r * .7 * u * k, 16, J * 2), { wash: NRD.cloud, ink: INK, sw: sw * .45 });
    paint(ellPts(x, y + .4 * u, 5 * u * k, 1.2 * u * k, 20, J), { wash: NRD.cloud, ink: null });   // hides the inner lobe lines
    paint(ellPts(x, y + 1.2 * u, 4.6 * u * k, .9 * u * k, 18, J), { fill: NRD.cloudDk, fillOp: 90, bleed: .2, tex: .3, ink: null });
  } else if (!o.noShadow) { rs('shadow'); paint(ellPts(x, y + u * .1, u * (sit ? 6.6 : 4.4) * (1 - Math.min(.5, Math.abs(o.dy || 0) * .05)), u * .9, 22), { fill: PAL.ink, fillOp: 80, bleed: .25, tex: .3, border: .1, ink: null }); }
  push();
  translate(x, y + dy);
  if (o.rot) rotate(o.rot);
  scale((o.flip ? -1 : 1) * (1 + sq * .6), 1 - sq);
  if (o.behind) { rs('behind'); o.behind(u, sw); }   // body space, under everything: a tail, a bow on the back
  const upper = f => { push(); if (sit) translate(0, NRD_SIT * u); translate(0, -12 * u); rotate(lean * .07); translate(0, 12 * u); f(); pop(); };   // about the waist, no slide (a slide parted the torso from the dhoti)
  const headT = () => { translate(hx * .5 * u, (bw * .5 - pf * .3) * u); translate(0, -18 * u); if (o.htilt) rotate(o.htilt); rotate(-pf * .06); scale(NRD_HS); translate(0, 18 * u); };

  if (sit) {
    // ---- crossed legs in the saffron dhoti, the soles up on the thighs
    rs('lap');
    paint(P([[-5.8, 0], [-6.3, -1.5], [-4.6, -3.3], [-2, -3.9], [0, -3.5], [2, -3.9], [4.6, -3.3], [6.3, -1.5], [5.8, 0], [0, .35]]), { wash: NRD.dhoti, fill: NRD.dhotiDk, fillOp: 70, tex: .6, ink: INK, sw: sw * .9, curv: .4 });
    inkLine(P([[-5.6, -.2], [0, .15], [5.6, -.2]]), sw * 1.4, NRD.border, 'ink', .4);
    for (const s of [-1, 1]) {
      paint(ellPts(s * 2.6 * u, -2.6 * u, 1.3 * u, .6 * u, 14, J, s * .25), { wash: col, fill: dk, fillOp: 40, tex: .5, ink: INK, sw: sw * .7 });
      inkLine(P([[s * 1.9, -2.4], [s * 3.2, -2.85]]), sw * .4, dk, 'inkfine', .3);
    }
    inkLine(P([[-3.6, -2.8], [0, -1.9], [3.6, -2.8]]), sw * .5, NRD.dhotiDk, 'inkfine', .5);
  } else {
    // ---- legs under the knee-length dhoti, bare feet
    rs('legs');
    for (const s of [-1, 1]) {
      const l = wk == null ? 0 : Math.max(0, Math.sin((wk + (s < 0 ? 0 : .5)) * TAU)) * .8, cx = s * 1.3;
      paint(P([[cx - .8, -5.8], [cx + .8, -5.8], [cx + .75, -.75 - l], [cx - .75, -.75 - l]]), { wash: col, fill: dk, fillOp: 50, tex: .5, ink: INK, sw: sw * .85 });
      paint(ellPts((cx + s * .15) * u, (-.5 - l) * u, 1.1 * u, .52 * u, 16, J), { wash: col, fill: dk, fillOp: 40, tex: .5, ink: INK, sw: sw * .8 });
    }
    rs('dhoti');
    const hs = wk == null ? 0 : Math.sin(wk * TAU) * .25;
    paint(P([[-2.9, -12.2], [2.9, -12.2], [3.4, -9.4], [3.75 + hs, -6.6], [3.5 + hs, -5.2], [1.3, -5.5], [.35, -6.3], [-.35, -6.3], [-1.3, -5.5], [-3.5 + hs, -5.2], [-3.75 + hs, -6.6], [-3.4, -9.4]]),
      { wash: NRD.dhoti, fill: NRD.dhotiDk, fillOp: 70, bleed: .06, tex: .7, border: .5, ink: INK, sw: sw * .9, curv: .25 });
    for (const s of [-1, 1]) inkLine(P([[s * .4, -6.25], [s * 1.3, -5.6], [s * 3.5 + hs, -5.35]]), sw * 1.5, NRD.border, 'ink', .4);
    inkLine(P([[0, -11.6], [-.2, -8.6], [0, -6.4]]), sw * 1.1, NRD.border, 'ink', .4);   // the front pleat
    for (const k of [-1.7, 1.6]) inkLine(P([[k * .7, -11.2], [k, -8.5], [k * 1.15, -6.2]]), sw * .5, NRD.dhotiLt, 'inkfine', .5);
  }

  upper(() => {
    // ---- torso (puffed with pride), the uttariya, the mala
    rs('torso');
    push(); translate(0, -14.6 * u); scale(1 + pf * .16, 1 + pf * .06); translate(0, 14.6 * u);
    const chest = P([[-3, -16.9], [3, -16.9], [3.25, -14.6], [2.7, -12], [-2.7, -12], [-3.25, -14.6]]);
    paint(chest, { wash: col, ink: null, curv: .35 });
    paint(ellPts(-1.1 * u, -15.6 * u, 1.5 * u, .9 * u, 14, J * 2, -.3), { fill: lt, fillOp: 120, bleed: .2, tex: .8, border: .8, ink: null });
    paint(chest, { ink: INK, sw: sw * .9, curv: .35 });
    inkLine(P([[-.35, -13], [0, -12.8], [.35, -13]]), sw * .45, INK, 'inkfine', .5);
    paint(rrPts(-2.95 * u, -12.7 * u, 5.9 * u, .75 * u, .3 * u, J), { wash: NRD.border, fill: '#7A2028', fillOp: 50, tex: .5, ink: INK, sw: sw * .7 });   // the waist knot
    if (o.shawl !== false) {
      rs('shawl');   // the uttariya: over the left shoulder, across to the right hip, its end hanging
      paint(ribbon(P([[-3.1, -17], [-1.4, -15.4], [.8, -13.7], [2.9, -12.4], [3.4, -10.6]]), 1.3 * u, 1 * u), { wash: NRD.shawl, fill: NRD.shawlDk, fillOp: 60, tex: .5, ink: INK, sw: sw * .65 });
      inkLine(P([[-2.6, -16.1], [-.6, -14.3], [1.6, -12.7]]), sw * .45, NRD.shawlDk, 'inkfine', .5);
    }
    if (o.chest) { rs('chest'); o.chest(u, sw); }
    rs('neck');
    paint(P([[-.85, -18.4], [.85, -18.4], [.9, -16.8], [-.9, -16.8]]), { wash: col, fill: dk, fillOp: 60, tex: .5, ink: INK, sw: sw * .6 });
    if (o.mala !== false) {
      rs('mala');   // a long tulsi-and-rudraksha mala
      const ML = through(P([[-1.9, -17.1], [-1.5, -15.4], [-.7, -14.1], [0, -13.8], [.7, -14.1], [1.5, -15.4], [1.9, -17.1]]));
      ML.forEach((p, i) => { if (i % 2 === 0) paint(ellPts(p[0], p[1], .22 * u, .22 * u, 8), { wash: i % 4 ? NRD.tulsi : NRD.bead, ink: INK, sw: sw * .3 }); });
    }
    pop();

    // ---- the veena, between the body and the head (its neck passes behind the head)
    if (o.veena !== false) { rs('veena'); naradaVeena(u, sw, INK, clamp(o.strum || 0)); }

    // ---- head
    push(); headT();
    if (o.headBehind) { rs('headBehind'); o.headBehind(u, sw); }   // head space, under the head: Panchmukhi's other faces
    if (o.face) { rs('face'); o.face(u, sw, J, INK, hx, o); }   // another face entirely (Jambavan's bear face)
    else if (!mk) {
      rs('ears');
      for (const s of [-1, 1]) paint(ellPts(s * 3.15 * u, -20.3 * u, .55 * u, .85 * u, 12, J), { wash: col, fill: dk, fillOp: 60, tex: .5, ink: INK, sw: sw * .7 });
      rs('head');
      const head = ellPts(0, -20.6 * u, 3.2 * u, 3.05 * u, 30, J);
      paint(head, { wash: col, ink: null });
      paint(ellPts((-1.2 + hx) * u, -21.8 * u, 1.7 * u, .9 * u, 14, J * 2, -.2), { fill: lt, fillOp: 120, bleed: .2, tex: .85, border: .8, ink: null });
      paint(ellPts(0, -18.2 * u, 2.2 * u, .75 * u, 14, J), { fill: dk, fillOp: 55, bleed: .1, tex: .6, border: .5, ink: null });
      paint(head, { ink: INK, sw });
      rs('hairfront');   // the hair swept up into the topknot, a lock at each temple
      paint(P([[-3.2, -20.2], [-3.35, -22.2], [-2.5, -23.4], [-1, -23.85], [0, -23.9], [1, -23.85], [2.5, -23.4], [3.35, -22.2], [3.2, -20.2], [2.85, -21.5], [1.8, -22.4], [0, -22.75], [-1.8, -22.4], [-2.85, -21.5]]),
        { wash: NRD.hair, ink: INK, sw: sw * .85, curv: .4 });
      for (const s of [-1, 1]) inkLine(P([[s * 2.4, -22.9], [s * 1.2, -23.4], [s * .3, -23.6]]), sw * .45, NRD.hairLt, 'inkfine', .5);
    } else naradaMonkeyHead(u, sw, J, INK, hx, o);
    // ---- the topknot, its rudraksha band and a white flower
    rs('topknot');
    if (o.topknot !== false) {
    const kb = Math.sin(T * 2.4) * .04;
    push(); translate(0, -23.6 * u); rotate(kb); translate(0, 23.6 * u);
    paint(P([[-1.3, -23.5], [-1.75, -24.7], [-1.6, -26.2], [-.8, -27.1], [0, -27.25], [.8, -27.1], [1.6, -26.2], [1.75, -24.7], [1.3, -23.5]]), { wash: NRD.hair, ink: INK, sw: sw * .8, curv: .5 });
    inkLine(P([[-1, -25.3], [-.2, -26.6], [.8, -26.4]]), sw * .45, NRD.hairLt, 'inkfine', .6);
    for (let i = 0; i < 7; i++) paint(ellPts((-1.45 + i * .48) * u, (-24.15 - Math.sin(i / 6 * Math.PI) * .12) * u, .2 * u, .2 * u, 8), { wash: NRD.bead, ink: INK, sw: sw * .3 });
    for (let i = 0; i < 5; i++) { const a = i / 5 * TAU; paint(ellPts((1.55 + Math.cos(a) * .32) * u, (-25.6 + Math.sin(a) * .32) * u, .26 * u, .26 * u, 8), { wash: NRD.flower, ink: INK, sw: sw * .25 }); }
    paint(ellPts(1.55 * u, -25.6 * u, .16 * u, .16 * u, 8), { wash: NRD.gold, ink: null });
    pop();
    }
    if (o.hat) { rs('hat'); o.hat(u, sw); }

    push(); translate(hx * .8 * u, 0);
    rs('tilak');   // the urdhva pundra: a white U with a red line up its middle
    const ty = mk ? -22.6 : -21.75;
    if (o.tilak !== false) {
    inkLine(P([[-.36, ty - .95], [-.3, ty - .2], [0, ty - .02], [.3, ty - .2], [.36, ty - .95]]), sw * .7, NRD.tilak, 'ink', .5);
    inkLine(P([[-.36, ty - .95], [-.3, ty - .2], [0, ty - .02], [.3, ty - .2], [.36, ty - .95]]).map(([a, b]) => [a * 1.18, b + .03 * u]), sw * .3, NRD.skinDk, 'inkfine', .5);
    inkLine(P([[0, ty - 1], [0, ty - .25]]), sw * .7, NRD.red, 'ink', 0);
    }
    if (!mk && !o.face) {
      if (o.blush) for (const s of [-1, 1]) paint(ellPts(s * 2 * u, -19.2 * u, .7 * u, .36 * u, 14), { fill: PAL.rose, fillOp: 150 * clamp(o.blush), bleed: .2, tex: .4, ink: null });
      naradaEyes(u, o, sw, col, [-1.2, -20.5], .62, .48, NRD.hair);
      rs('nose');
      inkLine(P([[.02, -19.9], [-.12, -19.35], [.15, -19.25]]), sw * .55, NRD.skinDk, 'inkfine', .5);
      if (o.beard) {   // a sage's beard from the cheeks to the chest, and a moustache over the mouth
        rs('beard');
        const bc = o.beard, bd = mixCol(bc, NRD.ink, .25);
        paint(P([[-3.1, -20.2], [-2.9, -18.6], [-2.3, -16.9], [-1.4, -15.4], [0, -14.4], [1.4, -15.4], [2.3, -16.9], [2.9, -18.6], [3.1, -20.2], [2.2, -18.9], [1, -18.1], [0, -17.9], [-1, -18.1], [-2.2, -18.9]]),
          { wash: bc, fill: bd, fillOp: 50, tex: .6, ink: INK, sw: sw * .8, curv: .45 });
        for (const k of [-1.3, 0, 1.3]) inkLine(P([[k * .9, -17.4], [k, -16.2], [k * .7, -15.2]]), sw * .45, bd, 'inkfine', .5);
        for (const s2 of [-1, 1]) paint(ribbon(P([[s2 * .1, -18.95], [s2 * .7, -19], [s2 * 1.3, -18.6], [s2 * 1.6, -18.1]]), .45 * u, .15 * u), { wash: bc, ink: INK, sw: sw * .4 });
      }
      rs('mouth');
      naradaMouth_(u, o, sw, o.beard ? -18.25 : -18.45, o.beard ? .8 : 1);
    }
    if (o.sweat) { rs('sweat'); paint(P([[2.6, -23], [3, -22.1], [2.6, -21.7], [2.25, -22.1]]), { wash: '#9ED0F0', ink: INK, sw: sw * .4, curv: .6 }); }
    pop();
    pop();

    // ---- arms, last
    const pr = clamp(o.pray || 0);
    for (const s of [-1, 1]) {
      rs('arm' + s);
      const [sh, el, ha] = naradaArm(o, s), hook = s < 0 ? o.armL : o.armR;
      paint(ribbon(P([sh, el, ha]), 1.2 * u, .85 * u), { wash: col, fill: dk, fillOp: 40, tex: .5, ink: INK, sw: sw * .85 });
      const d = Math.hypot(el[0] - sh[0], el[1] - sh[1]) || 1, nx = -(el[1] - sh[1]) / d * .55, ny = (el[0] - sh[0]) / d * .55, bx = lerp(sh[0], el[0], .5), by = lerp(sh[1], el[1], .5);
      for (const k of [-.12, .12]) inkLine(P([[bx - nx + k, by - ny + k], [bx + nx + k, by + ny + k]]), sw * .8, NRD.bead, 'ink', 0);   // rudraksha armband
      if (pr > .5 && s > 0) {
        paint(P([[-.55, -13.6], [-.5, -15], [0, -16.1], [.5, -15], [.55, -13.6], [0, -13.3]]), { wash: col, ink: INK, sw: sw * .7, curv: .4 });
        inkLine(P([[0, -15.9], [0, -13.5]]), sw * .5, INK, 'inkfine', 0);
        continue;
      }
      if (pr > .5) continue;
      push(); translate(ha[0] * u, ha[1] * u);
      if (s > 0 && o.kartal) naradaKartal(u * clamp(o.kartal), sw, o.clap ?? 9, INK);
      paint(ellPts(0, 0, .7 * u, .64 * u, 14, J), { wash: col, ink: INK, sw: sw * .75 });
      if (sit && clamp(o.mudra ?? 1) > .5 && !(s < 0 ? o.handL : o.handR) && !(s < 0 && o.veena !== false)) paint(ellPts(.25 * s * u, -.35 * u, .22 * u, .22 * u, 8), { ink: INK, sw: sw * .4 });   // chin mudra ring
      if (hook) hook(u, sw);
      pop();
    }
  });
  pop();

  if (o.emote) {
    rs('emote');
    const top = EMOTE_TOP.includes(o.emote), dir = o.flip ? -1 : 1, hy = sit ? NRD_SIT : 0;
    emote(o.emote, top ? x : x + dir * 5.4 * u, y + dy + ((top ? -31 : -25) + hy) * u * (1 - sq), u * 1.15, o.emoteK ?? 1, o.emoteAge ?? T);
  }
  rs('after');
}

// his eyes (normal and monkey faces share them): e0 = [x of the screen-left eye, y], rx / ry the eye's size
function naradaEyes(u, o, sw, lidCol, e0, rx0, ry0, browCol) {
  const P = pts => U(pts, u), INK = NRD.ink;
  boilSeed(`narada ${o.boilKey ?? ''} eyes`);
  const kinds = Array.isArray(o.eyes) ? o.eyes : o.eyes === 'wink' ? ['normal', 'closed'] : [o.eyes || 'normal', o.eyes || 'normal'];
  const own = k => ['normal', 'look', 'wide', 'closed', 'happy', 'smug', 'angry'].includes(k), br = clamp(o.brow || 0, -1, 1);
  if (!kinds.every(own)) { push(); translate(0, e0[1] * u); scale(.5); translate(0, 6 * u); eyes(u, o, sw / .5 * .85, [-1, 1], 0); pop(); return; }
  const lx = (o.lookX || 0) * u * .2, ly = clamp(o.lookY || 0, -1, 1) * u * .18;
  const blink = ((T * .9 + (o.seed || 0) * 1.7 + 1.1) % 3.7) < .12;
  [-1, 1].forEach((s, i) => {
    const k = (o.squint || 0) > .5 ? 'closed' : kinds[i], ex = s * -e0[0] * u, ey = e0[1] * u, wide = k === 'wide', ang = k === 'angry' ? 1 : 0;
    const by = e0[1] - .95 - (wide ? .35 : 0) - Math.max(0, br) * .3, bi = (Math.min(0, br) - ang) * .4;
    inkLine(P([[s * .5 * -e0[0] / 1.2, by + .1 - bi], [s * -e0[0], by - .15], [s * -e0[0] * 1.55, by + .05]]), sw * 1.1, browCol, 'ink', .4);
    if (k === 'closed' || k === 'happy' || (blink && !wide && k !== 'smug')) {
      const c = k === 'happy' ? -.3 : .2;
      inkLine([[ex - .6 * u, ey], [ex, ey + c * u], [ex + .6 * u, ey]], sw * 1.15, INK, 'ink', .5);
      return;
    }
    const rx = (wide ? 1.2 : 1) * rx0 * u, ry = (wide ? 1.35 : 1) * ry0 * u;
    paint(ellPts(ex, ey, rx, ry, 16), { wash: NRD.white, ink: null });
    paint(ellPts(ex + lx, ey + ly, (wide ? .26 : .32) * u, (wide ? .3 : .37) * u, 12), { wash: NRD.iris, ink: null });
    paint(ellPts(ex + lx - .1 * u, ey + ly - .13 * u, .1 * u, .11 * u, 8), { wash: NRD.white, ink: null });
    const lid = clamp(k === 'smug' ? .5 : ang ? .35 : 0, 0, .95);
    if (lid > .02) {
      const top = ey - ry * 1.4, l0 = ey - ry + lid * ry * 2, tilt = ang * s * .25 * u;
      paint([[ex - rx * 1.2, top], [ex + rx * 1.2, top], [ex + rx * 1.2, l0 - tilt], [ex - rx * 1.2, l0 + tilt]], { wash: lidCol, ink: null });
      inkLine([[ex - rx * 1.05, l0 + tilt], [ex + rx * 1.05, l0 - tilt]], sw * 1.3, INK, 'ink', 0);
    } else inkLine([[ex - rx * 1.05, ey - ry * .1], [ex - rx * .3, ey - ry * 1.05], [ex + rx * .4, ey - ry * 1.05], [ex + rx * 1.1, ey - ry * .2]], sw * 1.3, INK, 'ink', .5);
  });
}
// his mouths, centred at y my (head u); k scales them (the monkey's are wider)
function naradaMouth_(u, o, sw, my, k = 1) {
  const P = pts => U(pts.map(([a, b]) => [a * k, my + b * k]), u), INK = NRD.ink, m = o.mouth || 'smile';
  if (m === 'smile') inkLine(P([[-.55, 0], [0, .25], [.55, 0]]), sw * .85, INK, 'ink', .6);
  else if (m === 'smug') inkLine(P([[-.55, .08], [0, .2], [.5, 0], [.7, -.2]]), sw * .85, INK, 'ink', .6);
  else if (m === 'sheepish') inkLine(P([[-.5, .05], [-.15, .17], [.2, .03], [.5, -.1]]), sw * .8, INK, 'ink', .6);
  else if (m === 'flat') inkLine(P([[-.45, .08], [.45, .08]]), sw * .8, INK, 'ink', 0);
  else if (m === 'frown') inkLine(P([[-.55, .25], [0, 0], [.55, .25]]), sw * .85, INK, 'ink', .6);
  else if (m === 'grin') {
    paint(P([[-.8, -.1], [.8, -.1], [.55, .45], [0, .62], [-.55, .45]]), { wash: NRD.mouth, ink: INK, sw: sw * .7, curv: .5 });
    paint(P([[-.7, -.06], [.7, -.06], [.6, .14], [-.6, .14]]), { wash: NRD.white, ink: null, curv: .3 });
  } else if (m === 'O') paint(ellPts(0, (my + .2 * k) * u, .26 * k * u, .32 * k * u, 10), { wash: NRD.mouth, ink: INK, sw: sw * .5 });
  else if (m === 'open') paint(P([[-.55, -.02], [.55, -.02], [.4, .45], [0, .62], [-.4, .45]]), { wash: NRD.mouth, ink: INK, sw: sw * .6, curv: .5 });
  else if (m === 'scream') {
    paint(ellPts(0, (my + .55 * k) * u, .75 * k * u, .95 * k * u, 16), { wash: NRD.mouth, ink: INK, sw: sw * .7 });
    paint(P([[-.55, -.15], [.55, -.15], [.4, .1], [-.4, .1]]), { wash: NRD.white, ink: null, curv: .3 });
    paint(ellPts(0, (my + 1.05 * k) * u, .4 * k * u, .25 * k * u, 10), { wash: '#E07A72', ink: null });
  } else { push(); translate(0, my * u); scale(.4 * k); translate(0, 4.3 * u); mouth(u, m, sw / (.4 * k) * .8); pop(); }
}
// the monkey face, in head space (drawn instead of his own head)
function naradaMonkeyHead(u, sw, J, INK, hx, o) {
  const P = pts => U(pts, u);
  boilSeed('narada monkey ears');
  for (const s of [-1, 1]) {
    paint(ellPts(s * 3.55 * u, -20.3 * u, 1.25 * u, 1.35 * u, 16, J), { wash: NRD.fur, fill: NRD.furDk, fillOp: 50, tex: .5, ink: INK, sw: sw * .7 });
    paint(ellPts(s * 3.6 * u, -20.2 * u, .72 * u, .82 * u, 12), { wash: NRD.mask, fill: NRD.maskDk, fillOp: 60, tex: .4, ink: null });
  }
  boilSeed('narada monkey head');
  const n = 36, head = [];
  for (let i = 0; i < n; i++) {   // fur with tufts at the cheeks
    const a = i / n * TAU, side = Math.pow(Math.abs(Math.cos(a)), 3) * (Math.sin(a) > -.2 ? 1 : 0), r = 1 + side * (i % 2 ? .12 : -.02);
    head.push([Math.cos(a) * 3.3 * r * u, (-20.6 + Math.sin(a) * 3.15 * r) * u]);
  }
  paint(head, { wash: NRD.fur, fill: NRD.furDk, fillOp: 45, tex: .6, ink: INK, sw });
  paint(ellPts((-1 + hx) * u, -22.4 * u, 1.6 * u, .7 * u, 14, J, -.2), { fill: NRD.furLt, fillOp: 110, bleed: .2, tex: .7, border: .7, ink: null });
  push(); translate(hx * .8 * u, 0);
  boilSeed('narada monkey mask');   // the peach mask: round over each eye, and a big muzzle
  for (const s of [-1, 1]) paint(ellPts(s * 1.15 * u, -20.8 * u, 1.35 * u, 1.25 * u, 16), { wash: NRD.mask, ink: null });
  paint(ellPts(0, -18.75 * u, 2.15 * u, 1.6 * u, 20), { wash: NRD.mask, ink: null });
  paint(ellPts(0, -18.4 * u, 1.7 * u, .8 * u, 14), { fill: NRD.maskDk, fillOp: 70, bleed: .15, tex: .5, ink: null });
  inkLine(through(P([[-2.1, -18.4], [-1.6, -17.4], [0, -17.05], [1.6, -17.4], [2.1, -18.4]])), sw * .7, INK, 'ink', .5);
  inkLine(P([[-2.4, -21.9], [-1.15, -22.35], [0, -21.95], [1.15, -22.35], [2.4, -21.9]]), sw * 1.5, NRD.furDk, 'ink', .5);   // the brow ridge
  naradaEyes(u, o, sw, NRD.mask, [-1.12, -20.8], .55, .5, NRD.furDk);
  boilSeed('narada monkey nose');
  for (const s of [-1, 1]) paint(ellPts(s * .3 * u, -19.55 * u, .16 * u, .11 * u, 8), { wash: INK, ink: null });
  inkLine(P([[-.6, -19.95], [0, -20.15], [.6, -19.95]]), sw * .5, NRD.maskDk, 'inkfine', .5);
  boilSeed('narada monkey mouth');
  naradaMouth_(u, o, sw, -18.45, 1.5);
  if (o.blush) for (const s of [-1, 1]) paint(ellPts(s * 1.9 * u, -19.1 * u, .6 * u, .32 * u, 14), { fill: PAL.rose, fillOp: 160 * clamp(o.blush), bleed: .2, tex: .4, ink: null });
  pop();
}

// Model sheet: studio.html?loop=narada, or node render.mjs --loop=narada --sheet=0.5 --cols=1 --w=1080
(() => {
  LOOPS.narada = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: PAL.paper, ink: null });
    const cells = [
      [{ mouth: 'smile', strum: 1 }], [{ eyes: 'smug', mouth: 'smug', puff: 1 }], [{ eyes: 'heart', mouth: 'grin', kartal: 1, clap: frac(t) }],
      [{ monkey: 1, eyes: 'smug', mouth: 'grin' }], [{ monkey: 1, eyes: 'wide', mouth: 'scream', handL: [-4.6, -20], handR: [4.6, -20] }], [{ monkey: 1, eyes: 'angry', mouth: 'open', handR: [6.5, -17] }],
    ];
    cells.forEach(([over], i) => {
      const cx = 190 + (i % 3) * 350, gy = 760 + Math.floor(i / 3) * 640;
      narada(cx, gy, 20, { seed: i, ...over });
    });
    narada(300, 1820, 16, { sit: 1, eyes: 'closed', mouth: 'smile' });
    narada(780, 1780, 16, { cloud: 1, pray: 1, eyes: 'closed', bow: .5 });
  };
  LOOPS.narada.len = 4;
})();
