// panchmukhi.js: Panchmukhi Hanuman, the five-faced form of the Ahiravana (Mahiravana) legend and the Panchamukha
// Hanumat Kavacham: his own monkey face to the east (front), Narasimha to the south (his right, screen left), Garuda to
// the west, Varaha to the north (his left, screen right) and Hayagriva to the sky. Drawn on hanuman() (hanuman.js, so
// Narad's rig): the other four faces sit round his head in its own head space (narada()'s headBehind hook), so they
// bow, tilt and turn with it. Each face is a chibi head of its own with Narad-style eyes, a Vaishnava tilak and mouths
// that can blow (the five lamps). Also Makardhwaja (his son, part vanara part makara) on Bal Hanuman's rig.
// Load after hanuman.js, bal_hanuman.js and asuras.js.
//
//   pmHead(kind, x, y, s, o)      one face anywhere: kind 'hanuman' | 'narasimha' | 'garuda' | 'varaha' | 'hayagriva';
//                                 s is its unit (the face is about 4.4s wide); o: eyes 'normal' | 'wide' | 'closed' |
//                                 'happy' | 'angry' | 'squeeze', lookX / lookY, brow (-1 fierce .. 1 raised), mouth
//                                 'smile' | 'grin' | 'O' | 'roar' | 'flat' | 'frown', puff 0..1 (the inhale: cheeks
//                                 balloon, the face swells), blush, rot, seed, boilKey. 'hanuman' is a bare monkey face
//                                 (for the meaning slate), not the rig.
//   panchmukhi(x, y, u, o)        hanuman() with the four faces round his head: o.faces = { narasimha: {...}, garuda,
//                                 varaha, hayagriva }, each a pmHead() option set plus grow 0..1 (pops out from behind his
//                                 head on a backOut; 0 hides it). Every hanuman() option works.
//   pmFaceAt(x, y, u, o, kind, k) the world point of a face's centre (k = 0) or its mouth (k = 1); 'hanuman' too
//   pmWind(x0, y0, x1, y1, k, w, key, o)   a puff of breath from a mouth to a target: three wavy strands, curling
//                                 at the front; k 0..1 its travel (> 1 fades it), w its width
//   makardhwaja(x, y, u, o)       Hanuman's son, the gatekeeper of Patala: Bal Hanuman's rig in bronze fur, a teal
//                                 langot, a gatekeeper's helmet, a makara's fish tail (tailSway); every balHanuman()
//                                 option works; o.spear 0..1 a spear in his right hand (spearA tilts it), o.rope 0..1
//                                 a rope coiled round him (tied up), o.crown (a king's gold crown for the helmet)
//   ASURAS.ahiravana              the king of Patala on Mahishasura's rig: asura(x, y, u, { kind: 'ahiravana' })
// Model sheet: ?loop=panchmukhi
const PMK = {
  ink: '#4A2A18', white: '#FFF8EC', iris: '#2A160C', mouth: '#7A2A22', tongue: '#EE7A6E', cheek: '#F2907A',
  gold: '#F2C230', goldDk: '#B88A1C', tilak: '#FFF6E6', red: '#E2452B',
  lion: '#F4B840', lionDk: '#CC8A1E', lionLt: '#FFDC8A', mane: '#C4521F', maneDk: '#8E3412', maneLt: '#E8783E',
  muzzle: '#FFEDC8', muzzleDk: '#EBC894', nose: '#6A2E22',
  garuda: '#D9363C', garudaDk: '#A4202C', garudaLt: '#F26A6C', gface: '#FFE9D6', gfaceDk: '#EFC4A8',
  beak: '#F5C33A', beakDk: '#C48E1A', crest: '#2F8C70', crestLt: '#5AB894',
  boar: '#7E8EB8', boarDk: '#56668F', boarLt: '#A8B6D8', snout: '#F4A9B2', snoutDk: '#D27884', tusk: '#FFF6E2', bristle: '#3E4A72',
  horse: '#F7F1E6', horseDk: '#D9CDB8', horseLt: '#FFFFFF', hmane: '#4060B0', hmaneDk: '#2A4084', hmuzzle: '#EBD5CA', hmuzzleDk: '#CFAF9F',
  monkey: '#E9A23B', monkeyDk: '#C2771F', monkeyLt: '#F7C76C', mask: '#F8D7B4', maskDk: '#E3AE84',
};

// ---- shared face parts (head-local units s, y down; the face's centre is (0, 0))
function _pmEyes(s, sw, o, ex, ey, r, lidCol, browCol, key) {
  const P = pts => pts.map(([a, b]) => [a * s, b * s]), INK = PMK.ink;
  boilSeed(key + ' eyes');
  const kind = o.eyes || 'normal', br = clamp(o.brow || 0, -1, 1);
  const blink = ((T * .9 + (o.seed || 0) * 1.37 + .4) % 3.4) < .11;
  const lx = clamp(o.lookX || 0, -1, 1) * r * .38, ly = clamp(o.lookY || 0, -1, 1) * r * .34;
  for (const sd of [-1, 1]) {
    const x = sd * ex, wide = kind === 'wide', ang = kind === 'angry' ? 1 : 0;
    // the brow: down at the inside when fierce, up when surprised
    const by = ey - r * (wide ? 1.75 : 1.5) - Math.max(0, br) * .25, tilt = (-Math.min(0, br) + ang) * .32;
    inkLine(P([[x - sd * r * .9, by + tilt * sd * sd], [x + sd * r * .1, by - .06], [x + sd * r * 1.05, by - tilt * .3]]), sw * 1.1, browCol, 'ink', .4);
    if (kind === 'squeeze') {   // > <
      inkLine(P([[x - sd * r * .8, ey - r * .6], [x + sd * r * .55, ey], [x - sd * r * .8, ey + r * .6]]), sw * 1.2, INK, 'ink', .2);
      continue;
    }
    if (kind === 'closed' || kind === 'happy' || ((o.squint || 0) > .5) || (blink && !wide)) {
      const c = kind === 'happy' ? -.45 : .3;
      inkLine(P([[x - r * .95, ey], [x, ey + c * r], [x + r * .95, ey]]), sw * 1.15, INK, 'ink', .5);
      continue;
    }
    const rx = r * (wide ? 1.15 : 1), ry = r * (wide ? 1.3 : 1.12);
    paint(ellPts(x * s, ey * s, rx * s, ry * s, 16), { wash: PMK.white, ink: INK, sw: sw * .55 });
    const ir = (wide ? .5 : .66) * r;
    paint(ellPts((x + lx) * s, (ey + ly + r * .08) * s, ir * s, ir * 1.12 * s, 12), { wash: PMK.iris, ink: null });
    paint(ellPts((x + lx - ir * .35) * s, (ey + ly - ir * .3) * s, ir * .36 * s, ir * .38 * s, 8), { wash: PMK.white, ink: null });
    paint(ellPts((x + lx + ir * .35) * s, (ey + ly + ir * .4) * s, ir * .16 * s, ir * .16 * s, 6), { wash: PMK.white, ink: null });
    if (ang) {   // an angry lid across the top
      const top = ey - ry * 1.5, l0 = ey - ry * .35;
      paint(P([[x - rx * 1.25, top], [x + rx * 1.25, top], [x + rx * 1.25, l0 + sd * r * .3], [x - rx * 1.25, l0 - sd * r * .3]]), { wash: lidCol, ink: null });
      inkLine(P([[x - rx * 1.1, l0 - sd * r * .3], [x + rx * 1.1, l0 + sd * r * .3]]), sw * 1.2, INK, 'ink', 0);
    }
  }
}
// a Vaishnava U tilak (white, a red line up its middle) at (0, ty), h tall
function _pmTilak(s, sw, ty, h = .7) {
  const P = pts => pts.map(([a, b]) => [a * s, b * s]);
  inkLine(P([[-.3, ty - h], [-.26, ty - .1], [0, ty + .05], [.26, ty - .1], [.3, ty - h]]), sw * .9, PMK.tilak, 'ink', .5);
  inkLine(P([[0, ty - h * .9], [0, ty - .12]]), sw * .9, PMK.red, 'ink', 0);
}
// a mouth at (0, my); w its width; teeth: fangs for the lion and the boar
function _pmMouth(s, sw, o, my, w, fangs) {
  const P = pts => pts.map(([a, b]) => [a * w * s, (my + b * w) * s]), INK = PMK.ink, m = o.mouth || 'smile', pf = clamp(o.puff || 0);
  if (pf > .3 && (m === 'smile' || m === 'flat')) { inkLine(P([[-.25, 0], [.25, 0]]), sw * .9, INK, 'ink', 0); return; }   // lips pressed on the breath
  if (m === 'smile') inkLine(P([[-.55, -.05], [-.25, .2], [0, .05], [.25, .2], [.55, -.05]]), sw * .9, INK, 'ink', .6);
  else if (m === 'flat') inkLine(P([[-.4, .08], [.4, .08]]), sw * .85, INK, 'ink', 0);
  else if (m === 'frown') inkLine(P([[-.5, .25], [0, 0], [.5, .25]]), sw * .85, INK, 'ink', .6);
  else if (m === 'O') {
    paint(ellPts(0, (my + .18 * w) * s, .24 * w * s, .3 * w * s, 10), { wash: PMK.mouth, ink: INK, sw: sw * .55 });
  } else if (m === 'grin' || m === 'roar') {
    const big = m === 'roar' ? 1.45 : 1;
    paint(P([[-.62 * big, -.08], [.62 * big, -.08], [.45 * big, .45 * big], [0, .66 * big], [-.45 * big, .45 * big]]), { wash: PMK.mouth, ink: INK, sw: sw * .7, curv: .5 });
    if (m === 'roar') paint(ellPts(0, (my + .62 * w) * s, .32 * w * s, .2 * w * s, 10), { wash: PMK.tongue, ink: null });
    else paint(P([[-.52, -.04], [.52, -.04], [.45, .14], [-.45, .14]]), { wash: PMK.white, ink: null, curv: .3 });
    if (fangs) for (const sd of [-1, 1]) paint(P([[sd * .42 * big, -.06], [sd * .24 * big, -.06], [sd * .33 * big, .26 * big]]), { wash: PMK.white, ink: INK, sw: sw * .4 });
  }
}
// ballooning cheeks for the inhale
function _pmCheeks(s, sw, o, cx, cy, r, col, key) {
  const pf = clamp(o.puff || 0);
  if (o.blush) { boilSeed(key + ' blush'); for (const sd of [-1, 1]) paint(ellPts(sd * cx * s, (cy - .1) * s, r * .75 * s, r * .42 * s, 12), { fill: PMK.cheek, fillOp: 150 * clamp(o.blush), bleed: .2, tex: .4, ink: null }); }
  if (pf < .05) return;
  boilSeed(key + ' cheeks');
  for (const sd of [-1, 1]) {
    paint(ellPts(sd * (cx + pf * .25) * s, cy * s, r * (.6 + pf * .5) * s, r * (.55 + pf * .4) * s, 14), { wash: col, ink: PMK.ink, sw: sw * .5 });
    paint(ellPts(sd * (cx + pf * .25) * s, (cy + .05) * s, r * .5 * s, r * .3 * s, 10), { fill: PMK.cheek, fillOp: 120 * pf, bleed: .2, tex: .3, ink: null });
  }
}

// ---- the five faces (head-local, centre (0, 0), s units)
function _pmNarasimha(s, sw, o, key) {
  const P = pts => pts.map(([a, b]) => [a * s, b * s]), INK = PMK.ink, J = s * .03;
  boilSeed(key + ' mane');   // a scalloped mane, rust, darker inside
  const mane = [];
  for (let i = 0; i < 72; i++) { const a = i / 72 * TAU, r = 3.0 + .38 * Math.abs(Math.sin(a * 7 + .3)); mane.push([Math.cos(a) * r * s, (Math.sin(a) * r * .96 + .1) * s]); }
  paint(mane, { wash: PMK.mane, fill: PMK.maneDk, fillOp: 60, tex: .6, ink: INK, sw: sw * .9 });
  paint(ellPts(0, .15 * s, 2.55 * s, 2.45 * s, 24), { fill: PMK.maneDk, fillOp: 80, bleed: .15, tex: .5, ink: null });
  for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * .42; inkLine(P([[Math.cos(a) * 2.45, Math.sin(a) * 2.35], [Math.cos(a) * 3.05, Math.sin(a) * 2.95]]), sw * .5, PMK.maneLt, 'inkfine', .3); }
  boilSeed(key + ' ears');
  for (const sd of [-1, 1]) {
    paint(ellPts(sd * 1.7 * s, -1.75 * s, .62 * s, .6 * s, 12, J), { wash: PMK.lion, ink: INK, sw: sw * .7 });
    paint(ellPts(sd * 1.7 * s, -1.7 * s, .33 * s, .32 * s, 10), { wash: PMK.muzzleDk, ink: null });
  }
  boilSeed(key + ' face');
  const face = ellPts(0, .05 * s, 2.05 * s, 1.92 * s, 26, J);
  paint(face, { wash: PMK.lion, ink: null });
  paint(ellPts(-.7 * s, -.95 * s, 1.0 * s, .55 * s, 12, J, -.2), { fill: PMK.lionLt, fillOp: 120, bleed: .2, tex: .7, ink: null });
  paint(face, { ink: INK, sw });
  for (const k of [-.45, 0, .45]) inkLine(P([[k * .9, -1.75], [k, -1.35]]), sw * .6, PMK.lionDk, 'inkfine', .3);   // forehead stripes
  _pmEyes(s, sw, o, .82, -.35, .42, PMK.lion, PMK.maneDk, key);
  _pmCheeks(s, sw, o, .9, .75, .7, PMK.muzzle, key);
  boilSeed(key + ' muzzle');
  for (const sd of [-1, 1]) paint(ellPts(sd * .48 * s, .78 * s, .66 * s, .52 * s, 14), { wash: PMK.muzzle, ink: INK, sw: sw * .5 });
  for (const sd of [-1, 1]) for (let i = 0; i < 3; i++) paint(ellPts(sd * (.35 + i * .2) * s, (.7 + (i % 2) * .15) * s, .05 * s, .05 * s, 6), { wash: PMK.lionDk, ink: null });
  paint(P([[-.44, .22], [.44, .22], [.12, .58], [-.12, .58]]), { wash: PMK.nose, ink: INK, sw: sw * .5, curv: .5 });
  _pmMouth(s, sw, o, 1.28, .85, true);
  _pmTilak(s, sw, -.95, .55);
}
function _pmGaruda(s, sw, o, key) {
  const P = pts => pts.map(([a, b]) => [a * s, b * s]), INK = PMK.ink, J = s * .03;
  boilSeed(key + ' crest');   // three crest feathers
  for (const [cx, a] of [[-.75, -.45], [0, 0], [.75, .45]]) {
    push(); translate(cx * s, -1.8 * s); rotate(a);
    paint(P([[-.32, 0], [-.4, -.7], [0, -1.35], [.4, -.7], [.32, 0]]), { wash: PMK.crest, fill: PMK.crestLt, fillOp: 90, tex: .4, ink: INK, sw: sw * .6, curv: .5 });
    pop();
  }
  boilSeed(key + ' head');
  const head = [];
  for (let i = 0; i < 40; i++) {   // feathery cheeks
    const a = i / 40 * TAU, side = Math.pow(Math.abs(Math.cos(a)), 2) * (Math.sin(a) > -.1 ? 1 : 0), r = 1 + side * (i % 2 ? .13 : -.03);
    head.push([Math.cos(a) * 2.0 * r * s, Math.sin(a) * 2.05 * r * s]);
  }
  paint(head, { wash: PMK.garuda, fill: PMK.garudaDk, fillOp: 45, tex: .6, ink: INK, sw });
  paint(ellPts(-.6 * s, -1.1 * s, .9 * s, .45 * s, 12, J, -.2), { fill: PMK.garudaLt, fillOp: 110, bleed: .2, tex: .6, ink: null });
  boilSeed(key + ' mask');
  for (const sd of [-1, 1]) paint(ellPts(sd * .72 * s, -.2 * s, .95 * s, .9 * s, 16), { wash: PMK.gface, ink: null });
  paint(ellPts(0, .45 * s, .9 * s, .6 * s, 14), { wash: PMK.gface, ink: null });
  _pmEyes(s, sw, o, .74, -.25, .42, PMK.gface, PMK.garudaDk, key);
  _pmCheeks(s, sw, o, 1.15, .55, .6, PMK.gface, key);
  boilSeed(key + ' beak');   // a hooked gold beak; it parts to blow or shout
  const m = o.mouth || 'smile', open = m === 'roar' ? .55 : m === 'grin' ? .3 : m === 'O' ? .22 : 0;
  if (open > 0) {
    paint(P([[-.42, .5], [.42, .5], [.22, .95 + open], [0, 1.1 + open], [-.22, .95 + open]]), { wash: PMK.beakDk, ink: INK, sw: sw * .6, curv: .3 });
    paint(P([[-.34, .55], [.34, .55], [.16, .9 + open * .8], [-.16, .9 + open * .8]]), { wash: PMK.mouth, ink: null, curv: .4 });
  }
  push(); translate(0, -open * .25 * s);
  paint(P([[-.6, .05], [.6, .05], [.42, .7], [.12, 1.25], [0, 1.45], [-.12, 1.25], [-.42, .7]]), { wash: PMK.beak, fill: PMK.beakDk, fillOp: 50, tex: .4, ink: INK, sw: sw * .8, curv: .35 });
  for (const sd of [-1, 1]) paint(ellPts(sd * .2 * s, .35 * s, .07 * s, .1 * s, 6), { wash: PMK.ink, ink: null });
  if (!open) inkLine(P([[-.4, .62], [0, .78], [.4, .62]]), sw * .5, PMK.beakDk, 'inkfine', .5);
  pop();
  _pmTilak(s, sw, -1.15, .55);
}
function _pmVaraha(s, sw, o, key) {
  const P = pts => pts.map(([a, b]) => [a * s, b * s]), INK = PMK.ink, J = s * .03;
  boilSeed(key + ' ears');   // pointed ears, tipped out
  for (const sd of [-1, 1]) {
    paint(P([[sd * 1.0, -1.45], [sd * 2.25, -2.55], [sd * 1.95, -1.05]]), { wash: PMK.boar, ink: INK, sw: sw * .7, curv: .25 });
    paint(P([[sd * 1.2, -1.5], [sd * 2.0, -2.2], [sd * 1.85, -1.25]]), { wash: PMK.snout, ink: null, curv: .25 });
  }
  boilSeed(key + ' head');
  const head = ellPts(0, 0, 2.15 * s, 1.95 * s, 26, J);
  paint(head, { wash: PMK.boar, ink: null });
  paint(ellPts(-.7 * s, -.95 * s, 1.0 * s, .5 * s, 12, J, -.2), { fill: PMK.boarLt, fillOp: 120, bleed: .2, tex: .7, ink: null });
  paint(head, { ink: INK, sw });
  for (const k of [-.35, 0, .35]) inkLine(P([[k, -1.9], [k * 1.3, -2.45]]), sw * .9, PMK.bristle, 'ink', .3);   // a bristly tuft
  _pmEyes(s, sw, o, .88, -.5, .38, PMK.boar, PMK.bristle, key);
  _pmCheeks(s, sw, o, 1.25, .55, .6, PMK.boarLt, key);
  boilSeed(key + ' snout');
  for (const sd of [-1, 1]) {   // little tusks curling up beside the snout
    paint(P([[sd * .8, 1.0], [sd * 1.05, .95], [sd * 1.38, .4], [sd * 1.3, .3], [sd * 1.0, .65]]), { wash: PMK.tusk, ink: INK, sw: sw * .45, curv: .4 });
  }
  paint(ellPts(0, .65 * s, .98 * s, .7 * s, 18, J), { wash: PMK.snout, fill: PMK.snoutDk, fillOp: 40, tex: .4, ink: INK, sw: sw * .8 });
  for (const sd of [-1, 1]) paint(ellPts(sd * .3 * s, .66 * s, .13 * s, .22 * s, 8), { wash: PMK.snoutDk, ink: null });
  _pmMouth(s, sw, o, 1.55, .7, true);
  _pmTilak(s, sw, -1.05, .5);
}
function _pmHayagriva(s, sw, o, key) {
  const P = pts => pts.map(([a, b]) => [a * s, b * s]), INK = PMK.ink, J = s * .03;
  boilSeed(key + ' ears');
  for (const sd of [-1, 1]) {
    paint(P([[sd * .55, -2.0], [sd * 1.05, -3.25], [sd * 1.5, -1.85]]), { wash: PMK.horse, ink: INK, sw: sw * .7, curv: .35 });
    paint(P([[sd * .78, -2.05], [sd * 1.07, -2.9], [sd * 1.32, -1.95]]), { wash: PMK.hmuzzle, ink: null, curv: .35 });
  }
  boilSeed(key + ' mane');   // the mane falls behind the far side
  paint(P([[.2, -2.4], [1.5, -2.2], [2.2, -1.0], [2.3, .6], [1.9, 1.6], [1.55, .4], [1.4, -1.2]]), { wash: PMK.hmane, fill: PMK.hmaneDk, fillOp: 60, tex: .5, ink: INK, sw: sw * .7, curv: .45 });
  boilSeed(key + ' head');
  const head = P([[-1.5, -1.95], [-1.72, -.6], [-1.5, .6], [-1.22, 1.6], [-1.05, 2.25], [0, 2.55], [1.05, 2.25], [1.22, 1.6], [1.5, .6], [1.72, -.6], [1.5, -1.95], [.8, -2.4], [0, -2.5], [-.8, -2.4]]);
  paint(head, { wash: PMK.horse, ink: null, curv: .5 });
  paint(ellPts(-.65 * s, -1.25 * s, .8 * s, .5 * s, 12, J, -.2), { fill: PMK.horseLt, fillOp: 150, bleed: .2, tex: .6, ink: null });
  paint(ellPts(.9 * s, 0, .6 * s, 1.3 * s, 12, J), { fill: PMK.horseDk, fillOp: 70, bleed: .2, tex: .5, ink: null });
  paint(head, { ink: INK, sw, curv: .5 });
  boilSeed(key + ' forelock');
  paint(P([[-.65, -2.35], [0, -2.6], [.7, -2.3], [.45, -1.55], [.1, -1.85], [-.25, -1.45], [-.4, -1.95]]), { wash: PMK.hmane, ink: INK, sw: sw * .6, curv: .4 });
  _pmEyes(s, sw, o, .9, -.55, .4, PMK.horse, PMK.hmaneDk, key);
  _pmCheeks(s, sw, o, 1.05, .9, .55, PMK.horseLt, key);
  boilSeed(key + ' muzzle');
  paint(ellPts(0, 1.72 * s, 1.12 * s, .82 * s, 18, J), { wash: PMK.hmuzzle, fill: PMK.hmuzzleDk, fillOp: 50, tex: .4, ink: INK, sw: sw * .7 });
  for (const sd of [-1, 1]) inkLine(P([[sd * .58, 1.35], [sd * .42, 1.55], [sd * .5, 1.75]]), sw * .9, PMK.hmuzzleDk, 'ink', .5);
  _pmMouth(s, sw, o, 2.08, .62, false);
  _pmTilak(s, sw, -.95, .5);
}
function _pmMonkey(s, sw, o, key) {   // Hanuman's own face, bare (no rig): the meaning slate, the cover
  const P = pts => pts.map(([a, b]) => [a * s, b * s]), INK = PMK.ink, J = s * .03;
  boilSeed(key + ' ears');
  for (const sd of [-1, 1]) {
    paint(ellPts(sd * 2.25 * s, .1 * s, .8 * s, .86 * s, 14, J), { wash: PMK.monkey, ink: INK, sw: sw * .7 });
    paint(ellPts(sd * 2.28 * s, .15 * s, .46 * s, .52 * s, 10), { wash: PMK.mask, ink: null });
  }
  boilSeed(key + ' head');
  const head = ellPts(0, 0, 2.1 * s, 2.0 * s, 26, J);
  paint(head, { wash: PMK.monkey, fill: PMK.monkeyDk, fillOp: 40, tex: .5, ink: INK, sw });
  for (const sd of [-1, 1]) paint(ellPts(sd * .72 * s, -.12 * s, .86 * s, .8 * s, 14), { wash: PMK.mask, ink: null });
  paint(ellPts(0, 1.0 * s, 1.36 * s, 1.0 * s, 16), { wash: PMK.mask, ink: null });
  inkLine(P([[-1.5, -1.0], [-.72, -1.3], [0, -1.02], [.72, -1.3], [1.5, -1.0]]), sw * 1.3, PMK.monkeyDk, 'ink', .5);
  _pmEyes(s, sw, o, .72, -.15, .38, PMK.mask, PMK.monkeyDk, key);
  _pmCheeks(s, sw, o, 1.05, .85, .6, PMK.mask, key);
  for (const sd of [-1, 1]) paint(ellPts(sd * .2 * s, .5 * s, .1 * s, .07 * s, 6), { wash: INK, ink: null });
  _pmMouth(s, sw, o, 1.05, .9, false);
  boilSeed(key + ' tilak');
  paint(P([[-.3, -1.85], [-.24, -1.2], [0, -1.08], [.24, -1.2], [.3, -1.85], [0, -1.45]]), { wash: PMK.red, ink: null, curv: .4 });
}
const PM_DRAW = { narasimha: _pmNarasimha, garuda: _pmGaruda, varaha: _pmVaraha, hayagriva: _pmHayagriva, hanuman: _pmMonkey };
const PM_MOUTH_Y = { narasimha: 1.4, garuda: 1.25, varaha: 1.6, hayagriva: 2.15, hanuman: 1.15 };
function pmHead(kind, x, y, s, o = {}) {
  const sw = clamp(s / 14, .4, 2) * (o.swMul || 1), key = `pm ${o.boilKey ?? kind}`, pf = clamp(o.puff || 0);
  push(); translate(x, y); if (o.rot) rotate(o.rot); if (o.flip) scale(-1, 1);
  const sc = 1 + pf * .1 + (o.sq || 0) * .2;
  scale(sc * (1 + (o.sq || 0) * .3), sc * (1 - (o.sq || 0) * .4));
  if (o.glowK) { boilSeed(key + ' glow'); glow(0, 0, s * 4.5, '#FFD36A', o.glowK); }
  PM_DRAW[kind](s, sw, o, key);
  pop();
}

// ---- Panchmukhi on hanuman(): the slots of the four faces in narada()'s head space (u; the monkey head is centred at
// (0, -20.6), 3.3 × 3.15): [x, y, scale (pmHead s per u), rot]
const PM_SLOTS = {
  narasimha: [-6.3, -19.4, 1.12, .1], garuda: [-4.1, -25.9, 1.0, -.14],
  hayagriva: [4.1, -26.2, .92, .18], varaha: [6.3, -19.4, 1.1, -.1],
};
const PM_ORDER = ['garuda', 'hayagriva', 'narasimha', 'varaha'];   // drawn back to front
function _pmSlot(kind, g) {
  const [sx, sy, sc, r] = PM_SLOTS[kind], k = backOut(clamp(g));
  return [lerp(0, sx, k), lerp(-20.6, sy, k), sc * Math.max(0, k), r * clamp(g)];
}
function panchmukhi(x, y, u, o = {}) {
  const F = o.faces || {};
  const q = { ...o };
  q.headBehind = (uu, sw) => {
    for (const kind of PM_ORDER) {
      const f = F[kind] || {}, g = f.grow ?? 1; if (g <= .001) continue;
      const [hx, hy, sc, r] = _pmSlot(kind, g);
      pmHead(kind, hx * uu, hy * uu, sc * uu, { seed: PM_ORDER.indexOf(kind) * 1.7, ...f, rot: (f.rot || 0) + r, boilKey: `${o.boilKey ?? 'pm'} ${kind}` });
    }
    if (o.headBehind) o.headBehind(uu, sw);
  };
  delete q.faces;
  return hanuman(x, y, u, q);
}
// head space → world, through narada()'s head transform
function _pmHeadWorld(x, y, u, o, px, py) {
  const hx = clamp(o.hx || 0, -1, 1), bw = clamp(o.bow || 0), pf = clamp(o.puff || 0), a = (o.htilt || 0) - pf * .06;
  const qx = px * NRD_HS, qy = (py + 18) * NRD_HS;
  const rx = qx * Math.cos(a) - qy * Math.sin(a), ry = qx * Math.sin(a) + qy * Math.cos(a);
  return naradaLocal(x, y, u, o, rx + hx * .5, ry - 18 + bw * .5 - pf * .3);
}
function pmFaceAt(x, y, u, o, kind, k = 0) {
  if (kind === 'hanuman') return _pmHeadWorld(x, y, u, o, clamp(o.hx || 0, -1, 1) * 1.4 * k, lerp(-20.6, -18.2, k));
  const f = (o.faces || {})[kind] || {}, [hx, hy, sc, r] = _pmSlot(kind, f.grow ?? 1), rr = (f.rot || 0) + r, my = PM_MOUTH_Y[kind] * sc * k;
  return _pmHeadWorld(x, y, u, o, hx - Math.sin(rr) * my, hy + Math.cos(rr) * my);
}
// a puff of breath: three wavy strands from (x0, y0) toward (x1, y1), a curl at the front
function pmWind(x0, y0, x1, y1, k, w, key = 'wind', o = {}) {
  if (k <= 0) return;
  const fade = 1 - clamp(k - 1), head = clamp(k), tail = clamp(k * 1.25 - .55);
  if (fade <= 0 || head - tail < .02) return;
  boilSeed('pm wind ' + key);
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
  const col = o.col || '#F4FAFF', ink = o.ink || '#7A96C0';
  for (let i = 0; i < 8; i++) {   // cartoon puffs of breath riding out along the path, growing as they go
    const q = head - i * .11; if (q <= tail || q < 0) continue;
    const wig = Math.sin(i * 2.3 + T * 10) * w * .25, r = w * (.18 + q * .32) * fade;
    const px = x0 + dx * q + nx * wig, py = y0 + dy * q + ny * wig;
    paint(ellPts(px, py, r, r * .8, 12, r * .08), { wash: col, washOp: 235 * fade, ink, sw: Math.max(.6, w / 70) * fade });
  }
  for (let j = -1; j <= 1; j += 2) {   // two speed lines either side
    const pts = [];
    for (let i = 0; i <= 8; i++) { const q = lerp(tail, head, i / 8), off = j * w * (.55 + q * .3); pts.push([x0 + dx * q + nx * off, y0 + dy * q + ny * off]); }
    inkLine(pts, Math.max(1, w / 28) * fade, col, 'ink', .5);
  }
  if (k < 1.1) {   // the curl at the front
    const cx = x0 + dx * head, cy = y0 + dy * head, cr = w * .32;
    inkLine(Array.from({ length: 12 }, (_, i) => { const a = i / 11 * TAU * .85 + T * 9, r = cr * (1 - i / 16); return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; }), Math.max(1, w / 26), col, 'ink', .6);
  }
}

// ---- Makardhwaja: Bal Hanuman's rig, bronze, a teal langot, a helmet, a makara's fish tail
const MKD_PAL = { fur: '#D4893A', furDk: '#A9631E', furLt: '#EDB06A', langot: '#2E8C86', langotDk: '#1E625E', gold: '#E8B830', goldDk: '#B4861A' };
const MKD_SCALE = '#3FA8A0', MKD_SCALE_DK = '#277670', MKD_SCALE_LT = '#86D6C8', MKD_FIN = '#F2A340';
function _mkdTail(u, sw, o) {
  const ph = o.tailSway ?? T * 1.3, w = Math.sin(ph * TAU), INK = PMK.ink;
  const P = [[.9, -3.6], [2.6, -3.0], [4.2 + w * .15, -3.7], [5.1 + w * .3, -5.4], [5.0 + w * .45, -7.2], [4.4 + w * .55, -8.4]];
  paint(U(ribbon(P, 1.5, .55), u), { wash: MKD_SCALE, fill: MKD_SCALE_DK, fillOp: 55, tex: .5, ink: INK, sw: sw * .8, curv: .3 });
  for (let i = 1; i < P.length - 1; i++) {   // scale arcs
    const [a, b] = P[i], r = lerp(.55, .25, i / P.length);
    inkLine(U([[a - r, b - r * .2], [a, b + r * .5], [a + r, b - r * .2]], u), sw * .45, MKD_SCALE_LT, 'inkfine', .5);
  }
  const e = P[P.length - 1], f = P[P.length - 2], an = Math.atan2(e[1] - f[1], e[0] - f[0]);
  push(); translate(e[0] * u, e[1] * u); rotate(an + w * .15);   // the fan fin
  paint(U([[-.2, 0], [.9, -1.35], [1.25, -.9], [.75, 0], [1.25, .9], [.9, 1.35]], u), { wash: MKD_FIN, fill: '#C9741E', fillOp: 50, tex: .4, ink: INK, sw: sw * .6, curv: .3 });
  for (const s of [-1, 1]) inkLine(U([[0, 0], [.85, s * .9]], u), sw * .4, '#C9741E', 'inkfine', .3);
  pop();
}
function _mkdHelmet(u, sw) {   // a gatekeeper's little gold helmet with a teal plume (head-local: (0, 0) is the head centre)
  const P = pts => U(pts, u), INK = PMK.ink;
  paint(P([[-3.6, -1.5], [-3.45, -3.0], [-2.3, -4.15], [0, -4.65], [2.3, -4.15], [3.45, -3.0], [3.6, -1.5], [0, -2.0]]), { wash: MKD_PAL.gold, fill: MKD_PAL.goldDk, fillOp: 50, tex: .5, ink: INK, sw: sw * .8, curv: .3 });
  paint(P([[-3.7, -1.85], [3.7, -1.85], [3.6, -1.25], [-3.6, -1.25]]), { wash: MKD_PAL.goldDk, ink: INK, sw: sw * .6 });
  paint(P([[-.3, -4.55], [-1.0, -5.7], [-.45, -6.9], [.55, -7.1], [.65, -5.8], [.3, -4.55]]), { wash: MKD_SCALE, fill: MKD_SCALE_DK, fillOp: 50, ink: INK, sw: sw * .6, curv: .5 });
  paint(ellPts(0, -3.2 * u, .36 * u, .36 * u, 8), { wash: '#D2283A', ink: INK, sw: sw * .4 });
}
function _mkdCrown(u, sw) {   // the king of Patala's crown
  const P = pts => U(pts, u), INK = PMK.ink;
  paint(P([[-2.6, -2.6], [-2.8, -4.4], [-1.6, -3.7], [-.9, -5.0], [0, -4.0], [.9, -5.0], [1.6, -3.7], [2.8, -4.4], [2.6, -2.6], [0, -2.9]]), { wash: MKD_PAL.gold, fill: MKD_PAL.goldDk, fillOp: 50, tex: .5, ink: INK, sw: sw * .8, curv: .1 });
  for (const [x, y] of [[-2.8, -4.4], [-.9, -5.0], [.9, -5.0], [2.8, -4.4]]) paint(ellPts(x * u, y * u, .25 * u, .25 * u, 8), { wash: '#FFE69A', ink: INK, sw: sw * .3 });
  paint(ellPts(0, -3.4 * u, .32 * u, .32 * u, 8), { wash: '#2E8C86', ink: INK, sw: sw * .4 });
}
function makardhwaja(x, y, u, o = {}) {
  const q = { ...o, pal: { ...MKD_PAL, ...(o.pal || {}) }, tail: false };
  q.behind = (uu, sw) => { _mkdTail(uu, sw, o); if (o.behind) o.behind(uu, sw); };
  q.hat = (uu, sw) => { if (o.crown) _mkdCrown(uu, sw); else _mkdHelmet(uu, sw); if (o.hat) o.hat(uu, sw); };
  const r = clamp(o.rope || 0);
  if (r > 0) q.held = (uu, sw) => {   // a rope, coiled round his tummy and arms
    for (let i = 0; i < 3; i++) {
      const yy = -4.4 - i * 1.25, k = clamp(r * 3 - i);
      if (k <= 0) continue;
      paint(U(ribbon([[-3.2 * k, yy + .3], [-1.4 * k, yy + .55], [0, yy + .6], [1.4 * k, yy + .55], [3.2 * k, yy + .3]], .62, .62), uu), { wash: '#C9A46A', fill: '#8E6E3E', fillOp: 50, tex: .4, ink: PMK.ink, sw: sw * .7, curv: .4 });
    }
    if (o.held) o.held(uu, sw);
  };
  balHanuman(x, y, u, q);
  if (o.spear) {   // a spear in his right hand, upright
    const [hx, hy] = bhHand(x, y, u, q, 1), a = (o.spearA || 0) - .08, L = 13 * u * o.spear;
    boilSeed(`mkd ${o.boilKey ?? ''} spear`);
    push(); translate(hx, hy); rotate(a);
    paint(rectPts(-.18 * u, -L * .72, .36 * u, L), { wash: '#8A5A2E', ink: PMK.ink, sw: clamp(u / 20, .4, 2) * .6 });
    paint([[-.55 * u, -L * .72], [0, -L * .72 - 1.6 * u], [.55 * u, -L * .72]], { wash: '#D8DDE6', fill: '#9AA2B2', fillOp: 60, ink: PMK.ink, sw: clamp(u / 20, .4, 2) * .6 });
    paint(ellPts(0, -L * .72, .45 * u, .2 * u, 8), { wash: MKD_PAL.gold, ink: null });
    pop();
  }
}

// ---- Ahiravana, the king of Patala, on Mahishasura's rig
ASURAS.ahiravana = {
  pal: { skin: '#9A4A7E', skinDk: '#72325C', skinLt: '#C276A6', hair: '#1C1830', hairLt: '#3A3452', sash: '#E8A33A', sashDk: '#B67D1C', dhoti: '#2E2452', dhotiDk: '#1E1838', ink: '#1C1830' },
  horns: 'short', stache: 'thin', ring: false, shield: false, crown: { tall: 1, gem: '#B44CE6' },
};

// Model sheet: studio.html?loop=panchmukhi, or node render.mjs --loop=panchmukhi --sheet=0.5 --cols=1 --w=1080
(() => {
  LOOPS.panchmukhi = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: PAL.paper, ink: null });
    const g = clamp(frac(t / 4) * 1.6);
    panchmukhi(540, 900, 22, { mouth: 'smile', faces: { narasimha: { grow: g }, garuda: { grow: clamp(g * 1.2 - .1) }, varaha: { grow: clamp(g * 1.2 - .2) }, hayagriva: { grow: clamp(g * 1.2 - .3), lookY: -.7 } } });
    const kinds = ['hanuman', 'narasimha', 'garuda', 'varaha', 'hayagriva'];
    kinds.forEach((k, i) => pmHead(k, 120 + i * 210, 1150, 30, { mouth: 'smile', seed: i }));
    kinds.forEach((k, i) => pmHead(k, 120 + i * 210, 1420, 30, { mouth: 'O', puff: 1, eyes: 'squeeze', seed: i }));
    kinds.forEach((k, i) => pmHead(k, 120 + i * 210, 1690, 30, { mouth: i % 2 ? 'roar' : 'grin', eyes: i % 2 ? 'angry' : 'happy', blush: .6, seed: i }));
    makardhwaja(160, 1900, 12, { spear: 1, eyes: 'angry', mouth: 'open', handR: [3.4, -7.2], handShapeR: 'fist' });
    makardhwaja(400, 1900, 12, { rope: 1, eyes: 'sad', mouth: 'pout' });
    asura(780, 1900, 12, { kind: 'ahiravana', mouth: 'laugh', eyes: 'angry' });
  };
  LOOPS.panchmukhi.len = 4;
})();
