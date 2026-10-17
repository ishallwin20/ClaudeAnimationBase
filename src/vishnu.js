// vishnu.js: Vishnu, sitting (to ride Garuda): blue skin, a yellow pitambara, a tall gold kirita, the white
// Vaishnava tilak with a red line, a vanamala of leaves and flowers, and four arms: the Sudarshana chakra spinning on his
// back right hand, the Panchajanya shankh in his back left, the front pair free (abhaya and a lotus by default).
// Load after bappa.js (U()), indra.js (_ik()), shailputri.js (lotus()) and durga.js (chakra(), shankh()).
// (x, y) is his seat; u is the size unit (about 10.5u tall to the crown's tip, built on Indra's sitting proportions).
// Ride him on Garuda: kamaParrot(x, y, s, { pal: GARUDA_PAL, ring: false, hat: garudaCrown, only: 'body' }), then
// vishnu(...parrotSeat(x, y, s, o), u, …), then the parrot again with only: 'wing'.
//
// Seat-local u: waist 0 · shoulders (±1.9, -3.1) · head centre (0, -5.25) · kirita to -10.6 · back hands (±3.3, -5.6)
// Options: handL / handR (front arms, 2-bone targets in seat u), joined 0..1 (front palms together at the chest),
//          chakraSpin (radians), chakra 0..1 / shankh 0..1 (scale; 0 hides), lotus (default true, in the front left hand),
//          eyes 'normal' | 'wide' | 'closed' | 'happy' | 'sad', lookX, brows (-1..1), mouth 'smile' | 'flat' | 'O' |
//          'open' | 'frown' | 'sheepish', lean (radians), bow 0..1, flip, sweat, tint + tintK, boilKey
// Helpers: vishnuHand(x, y, u, o, s), vishnuChakra(x, y, u, o) → world [x, y].
const VSN = {
  ink: '#1E2A4A', skin: '#4F86D9', skinDk: '#3563AE', skinLt: '#8DB5EE', gold: '#F2C230', goldDk: '#B88A1C', goldLt: '#FFE69A',
  silk: '#F6C431', silkDk: '#D49A1A', hair: '#1E1A2A', white: '#FFF8EC', mouth: '#6E2A26', tilak: '#FFF6E6', red: '#D9302E',
  leaf: '#5DA45A', leafDk: '#3C7A40', flower: '#E8576E', flower2: '#F39A2B', jewel: '#C8324A',
};
function vishnuArm(o, s) {
  let h = (s < 0 ? o.handL : o.handR) || (s > 0 ? [2.7, -4.7] : [-1.7, -.5]);
  const j = clamp(o.joined || 0); if (j > 0) h = [lerp(h[0], s * .25, j), lerp(h[1], -2.1, j)];
  return _ik([s * 1.9, -3.0], h, 1.75, 1.7, s, (s < 0 ? o.bendL : o.bendR) ?? 1);
}
function vishnuWorld(x, y, u, o, px, py) { const r = (o.lean || 0) + (o.bow || 0) * .3, c = Math.cos(r), sn = Math.sin(r); return [x + (px * c - py * sn) * u * (o.flip ? -1 : 1), y + (px * sn + py * c) * u]; }
function vishnuHand(x, y, u, o, s) { return vishnuWorld(x, y, u, o, ...vishnuArm(o, s)[2]); }
function vishnuChakra(x, y, u, o = {}) { return vishnuWorld(x, y, u, o, 3.4, -7.4); }

function vishnu(x, y, u, o = {}) {
  const id = o.boilKey ?? 'vi' + (++CLAWD_N), rs = p => boilSeed(`vishnu ${id} ${p}`), INK = VSN.ink, sw = clamp(u / 20, .4, 2);
  const { col, dk, lt } = tintCols({ tint: o.tint, tintK: o.tintK, col: VSN.skin, dk: VSN.skinDk, lt: VSN.skinLt });
  const P = pts => U(pts, u);
  push(); translate(x, y); if (o.flip) scale(-1, 1); rotate((o.lean || 0) + (o.bow || 0) * .3);
  // ---- the back pair, behind everything: chakra on the right, shankh on the left
  for (const s of [-1, 1]) {
    rs('back' + s);
    const sh = [s * 1.6, -3.2], el = [s * 2.8, -3.9], ha = [s * 3.3, -5.6];
    paint(P(ribbon([sh, el, ha], .85, .7)), { wash: dk, fill: dk, fillOp: 40, ink: INK, sw: sw * .6, curv: .3 });
    push(); translate(ha[0] * u, ha[1] * u);
    const k = clamp(s > 0 ? o.chakra ?? 1 : o.shankh ?? 1);
    if (k > .01) { push(); scale(k); if (s > 0) chakra(u * .85, sw, o.chakraSpin ?? T * 4, INK); else shankh(u * .7, sw, -.3, INK); pop(); }
    paint(ellPts(0, 0, .45 * u, .43 * u, 10), { wash: dk, ink: INK, sw: sw * .5 });
    pop();
  }
  // ---- lap and torso
  rs('body');
  paint(P([[-2.7, .25], [-3, -.7], [-1.6, -1.25], [0, -1.05], [1.6, -1.25], [3, -.7], [2.7, .25]]), { wash: VSN.silk, fill: VSN.silkDk, fillOp: 50, ink: INK, sw: sw * .7, curv: .4 });
  inkLine(P([[-2.6, .05], [0, .2], [2.6, .05]]), sw * 1.1, VSN.goldDk, 'ink', .4);
  paint(P([[-1.75, -3.4], [1.75, -3.4], [2.05, -1.9], [1.85, -.6], [-1.85, -.6], [-2.05, -1.9]]), { wash: col, fill: dk, fillOp: 35, ink: INK, sw: sw * .8, curv: .4 });
  inkLine(P([[-1.4, -3.3], [-.2, -1.9], [1.2, -.8]]), sw * .45, VSN.white, 'inkfine', .4);   // the sacred thread
  paint(P(ribbon([[-1.6, -3.35], [0, -2.65], [1.6, -3.35]], .55, .55)), { wash: VSN.gold, ink: INK, sw: sw * .5 });   // gold collar
  paint(ellPts(0, -2.55 * u, .22 * u, .25 * u, 8), { wash: VSN.jewel, ink: INK, sw: sw * .35 });   // the Kaustubha
  rs('mala');   // the vanamala, knee-long, of leaves with red and orange flowers
  const ML = [[-1.7, -3.2], [-1.9, -2], [-1.6, -.9], [-.8, -.3], [0, -.15], [.8, -.3], [1.6, -.9], [1.9, -2], [1.7, -3.2]];
  inkLine(P(ML), sw * 1.8, VSN.leafDk, 'ink', .5);
  through(P(ML)).forEach((p, i) => { if (i % 3 === 0) paint(ellPts(p[0], p[1], .2 * u, .2 * u, 8), { wash: i % 2 ? VSN.flower : VSN.flower2, ink: null }); });
  // ---- the front arms
  const arms = [-1, 1].map(s => {
    const [sh, el, ha] = vishnuArm(o, s);
    rs('arm' + s);
    paint(P(ribbon([sh, el, ha], .95, .8)), { wash: s < 0 ? col : lt, fill: dk, fillOp: 30, ink: INK, sw: sw * .7, curv: .3 });
    paint(P(ribbon([[lerp(el[0], ha[0], .6), lerp(el[1], ha[1], .6)], [lerp(el[0], ha[0], .75), lerp(el[1], ha[1], .75)]], .95, .95)), { wash: VSN.gold, ink: INK, sw: sw * .4 });
    return { s, el, ha };
  });
  // ---- head: hair, face, kirita
  rs('hair');
  const hx = (o.lookX || 0) * .1;
  paint(P([[-2.1, -6.2], [-2.3, -4.6], [-2.5, -3.4], [-1.6, -3.6], [1.6, -3.6], [2.5, -3.4], [2.3, -4.6], [2.1, -6.2], [0, -7.4]]), { wash: VSN.hair, ink: INK, sw: sw * .6, curv: .4 });
  rs('head');
  paint(P([[-.55, -3.6], [.55, -3.6], [.6, -3.0], [-.6, -3.0]]), { wash: dk, ink: INK, sw: sw * .5 });
  paint(P([[-1.95, -5.8], [-1.6, -7.0], [0, -7.4], [1.6, -7.0], [1.95, -5.8], [1.85, -4.6], [1.3, -3.7], [0, -3.35], [-1.3, -3.7], [-1.85, -4.6]]), { wash: col, fill: dk, fillOp: 25, ink: INK, sw: sw * .85, curv: .5 });
  for (const s of [-1, 1]) {
    paint(ellPts(s * 1.95 * u, -5.3 * u, .38 * u, .52 * u, 10), { wash: col, ink: INK, sw: sw * .5 });
    paint(P([[s * 2.05, -4.95], [s * 2.4, -4.5], [s * 2.05, -3.95], [s * 1.7, -4.5]]), { wash: VSN.gold, ink: INK, sw: sw * .3 });   // makara kundals
  }
  rs('crown');
  paint(P([[-1.8, -6.4], [-1.9, -7.8], [-1.4, -8.8], [-.9, -9.7], [-.45, -10.3], [0, -10.75], [.45, -10.3], [.9, -9.7], [1.4, -8.8], [1.9, -7.8], [1.8, -6.4]]), { wash: VSN.gold, fill: VSN.goldDk, fillOp: 40, ink: INK, sw: sw * .7, curv: .15 });
  paint(P(ribbon([[-1.9, -6.55], [0, -6.8], [1.9, -6.55]], .5, .5)), { wash: VSN.goldLt, ink: INK, sw: sw * .4 });
  for (const [cx, cy] of [[0, -8.1], [-.75, -7.7], [.75, -7.7]]) paint(ellPts(cx * u, cy * u, .22 * u, .27 * u, 8), { wash: VSN.jewel, ink: INK, sw: sw * .3 });
  paint(ellPts(0, -10.85 * u, .2 * u, .2 * u, 8), { wash: VSN.jewel, ink: INK, sw: sw * .3 });
  rs('face');
  push(); translate(hx * u, 0);
  // the urdhva pundra: a white U from the brow with a red line up its middle
  inkLine(P([[-.32, -6.55], [-.25, -6.05], [0, -5.9], [.25, -6.05], [.32, -6.55]]), sw * .9, VSN.tilak, 'ink', .5);
  inkLine(P([[0, -6.6], [0, -6.05]]), sw * .8, VSN.red, 'ink', 0);
  const ek = o.eyes || 'normal', br = clamp(o.brows ?? 0, -1, 1);
  for (const s of [-1, 1]) {
    const ex = s * .78, ey = -5.45;
    inkLine(P([[s * .4, ey - .55 + Math.min(0, br) * -.2 - Math.max(0, br) * .2], [s * 1.2, ey - .62 - Math.max(0, br) * .25]]), sw * 1, VSN.hair, 'ink', 0);
    if (ek === 'closed' || ek === 'happy') { inkLine(P(ek === 'happy' ? [[ex - .32, ey + .1], [ex, ey - .18], [ex + .32, ey + .1]] : [[ex - .32, ey], [ex, ey + .16], [ex + .32, ey]]), sw * 1.1, INK, 'ink', .6); continue; }
    const r = ek === 'wide' ? .4 : .33;
    paint(ellPts(ex * u, ey * u, (r + .04) * u, r * u, 12), { wash: VSN.white, ink: INK, sw: sw * .45 });
    paint(ellPts((ex + (o.lookX || 0) * .1) * u, (ey + .03) * u, (ek === 'wide' ? .14 : .18) * u, (ek === 'wide' ? .16 : .21) * u, 10), { wash: INK, ink: null });
    if (ek === 'sad') inkLine(P([[ex - .3, ey - .42 + s * .05], [ex + .3, ey - .42 - s * .05]]), sw * .6, INK, 'inkfine', 0);
  }
  inkLine(P([[0, -5.0], [-.12, -4.6], [.1, -4.5]]), sw * .5, dk, 'inkfine', .5);
  const m = o.mouth || 'smile', my = -4.0;
  if (m === 'smile') inkLine(P([[-.45, my], [0, my + .22], [.45, my]]), sw * .8, INK, 'ink', .6);
  else if (m === 'sheepish') inkLine(P([[-.45, my + .05], [-.1, my + .15], [.2, my + .05], [.45, my - .1]]), sw * .8, INK, 'ink', .6);
  else if (m === 'flat') inkLine(P([[-.4, my + .08], [.4, my + .08]]), sw * .8, INK, 'ink', 0);
  else if (m === 'frown') inkLine(P([[-.45, my + .2], [0, my], [.45, my + .2]]), sw * .8, INK, 'ink', .6);
  else if (m === 'O') paint(ellPts(0, (my + .15) * u, .2 * u, .26 * u, 10), { wash: VSN.mouth, ink: INK, sw: sw * .5 });
  else if (m === 'open') paint(P([[-.45, my - .05], [.45, my - .05], [.3, my + .32], [0, my + .45], [-.3, my + .32]]), { wash: VSN.mouth, ink: INK, sw: sw * .6, curv: .5 });
  pop();
  if (o.sweat) { rs('sweat'); paint(P([[2.2, -7.0], [2.55, -6.2], [2.2, -5.9], [1.9, -6.2]]), { wash: '#9ED0F0', ink: INK, sw: sw * .4, curv: .6 }); }
  // ---- the front hands: a lotus in the left; joined palms when praying
  const jn = clamp(o.joined || 0);
  if (jn > .5) {
    rs('joined');
    paint(P([[-.35, -1.6], [-.32, -2.6], [0, -3.25], [.32, -2.6], [.35, -1.6], [0, -1.4]]), { wash: lt, ink: INK, sw: sw * .55, curv: .4 });
    inkLine(P([[0, -3.1], [0, -1.6]]), sw * .45, INK, 'inkfine', 0);
  } else for (const A of arms) {
    rs('hand' + A.s);
    if (A.s < 0 && o.lotus !== false) { push(); translate(A.ha[0] * u, A.ha[1] * u); lotus(u * .55, sw, 1, INK); pop(); }
    paint(ellPts(A.ha[0] * u, A.ha[1] * u, .5 * u, .48 * u, 12), { wash: A.s < 0 ? col : lt, ink: INK, sw: sw * .55 });
  }
  pop();
  boilSeed(`vishnu ${id} after`);
}

// Model sheet: studio.html?loop=vishnu (riding Garuda), or node render.mjs --loop=vishnu --sheet=0.5 --cols=1 --w=1080
(() => {
  LOOPS.vishnu = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: PAL.paper, ink: null });
    const fly = { flap: Math.sin(t * 8), fly: true, pal: GARUDA_PAL, ring: false, hat: garudaCrown, brow: true }, s = 34;
    kamaParrot(540, 760, s, { ...fly, only: 'body' });
    vishnu(...parrotSeat(540, 760, s, fly), 30, { lookX: .5 });
    kamaParrot(540, 760, s, { ...fly, only: 'wing' });
    vishnu(300, 1500, 42, { joined: 1, eyes: 'sad', mouth: 'flat', brows: 1 });
    vishnu(780, 1500, 42, { eyes: 'happy', handR: [3, -6.5] });
  };
  LOOPS.vishnu.len = 4;
})();
