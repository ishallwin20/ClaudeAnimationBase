// parshurama.js: Parshurama (Bhargava Rama, Jamadagnya), Vishnu's sixth avatar, the sage who became a warrior, on
// Narad Muni's rig (narada.js) like Ram and Hanuman, so he stands at one height with them: warm wheat skin, a warrior's
// build (narada()'s brawn), matted jata piled high and bound with rudraksha, long locks falling behind his shoulders, a
// short black beard and moustache, the ash tripundra with a red bindu (Shiva's disciple), rudraksha kundals, the
// yajnopavita (sacred thread) across his bare chest, a rudraksha mala and armbands, a deep-saffron dhoti with a maroon
// border, a krishnajina (blackbuck skin) tied round his hips, a quiver on his back, and THE PARASHU, Shiva's axe, in his
// right hand. Load after narada.js and chandraghanta.js (dhanush(), baan()).
// (x, y) is the ground point under him; u is narada()'s unit (about 29u tall to the top of the jata). Every narada()
// option works (walk, sit, bow, pray, lean, hx, htilt, handL / handR, eyes, mouth, brow, emote, behind, armL / armR, …)
// except the veena, the topknot and the uttariya, which he doesn't have.
// His own options:
//   axe        'hold' (default: upright in his right hand, the blade by his head) | 'shoulder' (on his right shoulder)
//              | 'raise' (overhead, to strike) | false; axeA adds a turn (rad, + tips the blade outward), axeK 0..1 scales
//              it in (it arrives), axeGlow 0..1 (Shiva's gift: a white-gold light on the blade)
//   dhanush    0..1: a bow in his left hand (dhanush(); Vishnu's bow, Valmiki Bala Kanda 75), arrow: 1 nocks an arrow
//              (not `bow`: that's narada()'s forward bend)
//   quiver     (default true) the quiver over his right shoulder, behind him
//   beard      (default PSR.hair) a colour or false (young: clean-shaven); beardLen (default .55)
//   tilak      'tripundra' (default) | 'u' (the Vaishnava U, narada()'s) | false
//   hide       (default true) the krishnajina round his hips
//   locks      (default true) the long locks behind his shoulders; wind 0..1 blows them (and the jata's loose ends) to
//              screen left, windDir ±1 flips that
//   aura       0..1 a fierce warm light behind him (Valmiki: "blazing like fire"), drawn first
//   pal        overrides PSR (his colours)
// Helpers: as narada's (naradaHand, naradaHead, naradaMouth, …: same body); parashu(u, sw, o) draws the axe at (0, 0)
// = the grip, haft up (+x is the blade side); parshuramaAxe(x, y, u, o) → the world point of the blade's centre.
const PSR = {
  skin: '#E0A576', skinDk: '#B97A4E', skinLt: '#F6CCA0', ink: '#3A2026',
  dhoti: '#E06A1C', dhotiDk: '#A94A10', dhotiLt: '#FFA352', border: '#7A1E26',
  shawl: '#FFF3DC', shawlDk: '#E2CFA8', hair: '#271A1E', hairLt: '#55393C', bead: '#7E3E22', beadDk: '#552614', tulsi: '#A05A30',
  thread: '#FFF4DC', threadDk: '#D8C6A0', ash: '#F4F0E8', ashDk: '#CFC6B8', red: '#D42A2A', tilak: '#FFF6E6',
  hideC: '#4A3226', hideDk: '#2E1E18', hideLt: '#E9D7B4',
  wood: '#8A5230', woodDk: '#5E3418', woodLt: '#B87A48', steel: '#C9D3DC', steelDk: '#7C8896', edge: '#F6FBFF',
  gold: '#EDB43C', goldDk: '#B67D1C', goldLt: '#FFE39A', quiver: '#7A3A24', quiverDk: '#52240F', feather: '#F2E6CC',
  white: '#FFF8EC', iris: '#22140F', lip: '#A8484E', mouth: '#5A1E26',
};
// the axe's presets: [the right hand in body u, bendR, the haft's turn in rad]
const PSR_AXE = { hold: [[4.5, -12.2], .95, .1], shoulder: [[1.5, -13.6], 1.1, .62], raise: [[3.7, -24.2], 1.5, .55] };

// Shiva's parashu, at the grip (0, 0), the haft running up -y and down +y, the blade on +x
function parashu(u, sw, o = {}) {
  const C = { ...PSR, ...(o.pal || {}) }, P = pts => U(pts, u), INK = C.ink, g = clamp(o.glow || 0);
  if (g > 0) { glow(1.9 * u, -6.5 * u, 4.2 * u * (.85 + .15 * Math.sin(T * 5)), '#FFE6A0', 110 * g); glow(2.4 * u, -6.4 * u, 2 * u, '#FFFFFF', 90 * g); }
  paint(ribbon(P([[0, 4.3], [0, 0], [0, -8.2]]), .36 * u, .3 * u), { wash: C.wood, fill: C.woodDk, fillOp: 55, tex: .5, ink: INK, sw: sw * .6 });   // the haft
  inkLine(P([[-.06, 3.6], [-.08, -2], [-.06, -7.6]]), sw * .35, C.woodLt, 'inkfine', 0);
  paint(ellPts(0, 4.45 * u, .3 * u, .26 * u, 8), { wash: C.gold, ink: INK, sw: sw * .4 });   // the ferrule
  // the crescent blade: a socket round the haft, a neck, then a wide curved edge
  const blade = P([[-.35, -7.6], [.6, -7.75], [1.6, -8.5], [2.55, -9.2], [3.2, -8.5], [3.45, -6.9], [3.2, -5.2], [2.6, -4.3], [1.7, -4.95], [.6, -5.55], [-.35, -5.45]]);
  paint(blade, { wash: C.steel, fill: C.steelDk, fillOp: 70, bleed: .06, tex: .4, ink: INK, sw: sw * .7, curv: .35 });
  inkLine(P([[2.55, -8.95], [3.15, -8.25], [3.32, -6.9], [3.1, -5.35], [2.62, -4.6]]), sw * (1.1 + g * .6), C.edge, 'ink', .5);   // the bright edge
  paint(P([[.9, -7.3], [2.2, -7.9], [2.55, -6.6], [2.1, -5.4], [.9, -5.95]]), { fill: C.steelDk, fillOp: 60, bleed: .15, tex: .5, ink: null });
  paint(ellPts(1.85 * u, -6.65 * u, .38 * u, .38 * u, 10), { wash: C.gold, ink: INK, sw: sw * .4 });   // a boss on the blade
  paint(rrPts(-.5 * u, -7.9 * u, 1 * u, 2.6 * u, .25 * u), { wash: C.gold, fill: C.goldDk, fillOp: 50, tex: .4, ink: INK, sw: sw * .55 });   // the gold socket
  for (const yy of [-7.25, -6.6, -5.95]) inkLine(P([[-.45, yy], [.45, yy]]), sw * .45, C.goldDk, 'inkfine', 0);
  paint(P([[-.5, -7.6], [-1.2, -7.1], [-.5, -6.4]]), { wash: C.steel, ink: INK, sw: sw * .5, curv: .2 });   // the back spike
  paint(ellPts(0, -8.45 * u, .3 * u, .3 * u, 8), { wash: C.gold, ink: INK, sw: sw * .4 });   // the finial
}

function _psrAxePose(o) {
  const a = o.axe === undefined ? 'hold' : o.axe;
  if (!a) return null;
  const [h, b, r] = PSR_AXE[a] || PSR_AXE.hold;
  return { hand: o.handR || h, bend: o.bendR ?? b, a: r + (o.axeA || 0) };
}
function parshuramaAxe(x, y, u, o = {}) {
  const p = _psrAxePose(o); if (!p) return naradaHand(x, y, u, o, 1);
  const s = clamp(o.axeK ?? 1), bx = 1.9 * s, by = -6.6 * s, c = Math.cos(p.a), sn = Math.sin(p.a);
  return naradaLocal(x, y, u, { ...o, handR: p.hand }, p.hand[0] + bx * c - by * sn, p.hand[1] + bx * sn + by * c);
}

// the jata, the kundals and the tripundra, in narada()'s head space (head centre (0, -20.6), 3.2 × 3.05)
function psrHead(u, sw, o, C) {
  const P = pts => U(pts, u), INK = C.ink, J = u * .03, hx = clamp(o.hx || 0, -1, 1);
  const wd = clamp(o.wind || 0) * (o.windDir || 1), bob = Math.sin(T * 2.1) * .05;
  boilSeed(`psr ${o.boilKey ?? ''} kundal`);
  for (const s of [-1, 1]) {   // a rudraksha bead hanging from each ear
    paint(ellPts(s * 3.25 * u, -18.85 * u, .3 * u, .32 * u, 10), { wash: C.bead, ink: INK, sw: sw * .4 });
    inkLine(P([[s * 3.12, -19.05], [s * 3.38, -18.65]]), sw * .3, C.beadDk, 'inkfine', 0);
  }
  boilSeed(`psr ${o.boilKey ?? ''} jata`);
  push(); translate(0, -23.4 * u); rotate(bob - wd * .04); translate(0, 23.4 * u);
  // the matted locks coiled into a jatamukuta: a tapering stack, three wrapped coils drawn into it, a lock looped over the top
  const bun = P([[-1.75, -23.2], [-2.05, -24.5], [-1.85, -25.7], [-1.45, -26.7], [-.8, -27.45], [0, -27.7], [.8, -27.45], [1.45, -26.7], [1.85, -25.7], [2.05, -24.5], [1.75, -23.2]]);
  paint(bun, { wash: C.hair, ink: INK, sw: sw * .85, curv: .45 });
  for (const [yy, w] of [[-24.55, 1.85], [-25.75, 1.6], [-26.8, 1.15]]) inkLine(P([[-w, yy + .25], [-w * .4, yy - .2], [w * .4, yy - .2], [w, yy + .25]]), sw * .55, C.hairLt, 'inkfine', .6);
  for (const [a, b] of [[-.9, -24.1], [.7, -25.2], [-.5, -26.3]]) inkLine(P([[a, b], [a + .35, b - .4]]), sw * .4, C.hairLt, 'inkfine', .3);
  paint(ribbon(P([[-.6, -27.5], [-.1, -28.35], [.75, -28.2], [1.0, -27.4]]), .42 * u, .3 * u), { wash: C.hair, ink: INK, sw: sw * .5 });
  for (let i = 0; i < 8; i++) {   // the rudraksha binding round its base
    const k = i / 7;
    paint(ellPts((-1.85 + k * 3.7) * u, (-23.75 - Math.sin(k * Math.PI) * .25) * u, .23 * u, .23 * u, 8), { wash: C.bead, ink: INK, sw: sw * .3 });
  }
  pop();
  if (o.tilak !== 'tripundra' && o.tilak !== undefined) return;
  boilSeed(`psr ${o.boilKey ?? ''} tripundra`);   // three ash lines across the forehead, a red bindu on them
  push(); translate(hx * .8 * u, 0);
  for (const [yy, w] of [[-22.48, 1.35], [-22.18, 1.45], [-21.88, 1.3]]) inkLine(P([[-w, yy + .06], [0, yy - .04], [w, yy + .06]]), sw * .6, C.ash, 'ink', .5);
  paint(ellPts(0, -22.18 * u, .2 * u, .22 * u, 8), { wash: C.red, ink: null });
  pop();
}
// the long locks behind his head and shoulders, in head space (drawn under the head)
function psrLocks(u, sw, o, C) {
  if (o.locks === false) return;
  const P = pts => U(pts, u), INK = C.ink, wd = clamp(o.wind || 0) * (o.windDir || 1);
  for (const s of [-1, 1]) for (const j of [0, 1]) {
    const ph = T * 1.8 + s * 1.3 + j * 2, w = Math.sin(ph) * .12, x0 = s * (2.3 + j * .6), lift = wd * (j ? 1.4 : 1);
    const pts = [[x0, -22.6], [s * (3.3 + j * .5) - lift * .6, -20.6 - lift * .3], [s * (3.8 + j * .6) + w - lift * 1.4, -18.2 - lift * .9], [s * (3.9 + j * .5) + w * 1.6 - lift * 2.4, -15.9 - lift * 1.6]];
    paint(ribbon(P(pts), (1.2 - j * .2) * u, .3 * u), { wash: C.hair, ink: INK, sw: sw * .6 });
    inkLine(P(pts.slice(1, 3).map(([a, b]) => [a - s * .2, b])), sw * .4, C.hairLt, 'inkfine', .5);
  }
}
// the yajnopavita, the muscles and the krishnajina, in body space (narada()'s torso: chest -16.9..-12)
function psrChest(u, sw, o, C) {
  const P = pts => U(pts, u);
  for (const s of [-1, 1]) inkLine(P([[s * 2.55, -15.15], [s * 1.5, -14.55], [s * .3, -14.85]]), sw * .55, C.skinDk, 'inkfine', .5);   // the chest
  inkLine(P([[0, -14.55], [0, -13.15]]), sw * .4, C.skinDk, 'inkfine', 0);
  for (const yy of [-13.65, -12.95]) for (const s of [-1, 1]) inkLine(P([[s * .3, yy], [s * .85, yy + .05]]), sw * .35, C.skinDk, 'inkfine', .3);
  inkLine(P([[-2.8, -16.8], [-1.3, -15.2], [.5, -13.6], [2.5, -12.3]]), sw * 1.15, C.thread, 'ink', .4);   // the sacred thread, left shoulder to right hip
  inkLine(P([[-2.65, -16.55], [-1.15, -15], [.65, -13.4], [2.4, -12.1]]), sw * .3, C.threadDk, 'inkfine', .4);
  if (o.hide === false) return;
  // the blackbuck skin round his hips: dark above, the pale belly fur at its ragged hem, tied at his right hip
  const hide = P([[-3.15, -12.3], [3.15, -12.3], [3.45, -10.6], [3.25, -9.3], [2.7, -9.75], [1.9, -9.2], [1.0, -9.45], [.1, -8.85], [-.9, -9.55], [-1.7, -9.0], [-2.5, -9.6], [-3.25, -9.35], [-3.45, -10.8]]);
  paint(hide, { wash: C.hideC, fill: C.hideDk, fillOp: 70, tex: .6, ink: C.ink, sw: sw * .75, curv: .2 });
  paint(P([[-3.25, -9.95], [-2.5, -10.1], [-1.7, -9.6], [-.9, -10.05], [.1, -9.45], [1.0, -9.9], [1.9, -9.7], [2.7, -10.2], [3.25, -9.8], [3.25, -9.3], [2.7, -9.75], [1.9, -9.2], [1.0, -9.45], [.1, -8.85], [-.9, -9.55], [-1.7, -9.0], [-2.5, -9.6], [-3.25, -9.35]]), { wash: C.hideLt, ink: null });
  for (const [a, b] of [[-1.9, -11.4], [.3, -11.1], [2.2, -11.5]]) paint(ellPts(a * u, b * u, .34 * u, .22 * u, 8), { wash: C.hideLt, washOp: 120, ink: null });
  paint(ribbon(P([[2.1, -11.5], [2.35, -10.4], [2.15, -9.3]]), .4 * u, .2 * u), { wash: C.hideC, ink: C.ink, sw: sw * .4 });
  paint(ellPts(2.1 * u, -11.75 * u, .42 * u, .38 * u, 10), { wash: C.hideDk, ink: C.ink, sw: sw * .45 });   // the knot, at his right hip
}
// the quiver over his right shoulder, in body space (drawn behind him)
function psrQuiver(u, sw, C) {
  const P = pts => U(pts, u), INK = C.ink;
  for (const [a, b, k] of [[4.6, -21.0, 0], [5.3, -20.4, 1], [4.0, -20.6, 2]]) {   // arrow ends with fletching
    inkLine(P([[a - .6, b + 1.8], [a, b]]), sw * .7, C.wood, 'ink', 0);
    paint(P([[a, b], [a + .35 + k * .05, b - .55], [a + .1, b - 1.1], [a - .3, b - .5]]), { wash: C.feather, ink: INK, sw: sw * .35, curv: .3 });
  }
  const tube = P([[3.0, -19.3], [5.3, -19.0], [3.4, -9.8], [1.7, -10.2]]);
  paint(tube, { wash: C.quiver, fill: C.quiverDk, fillOp: 60, tex: .5, ink: INK, sw: sw * .7, curv: .15 });
  for (const [a, b] of [[[3.05, -18.5], [5.15, -18.2]], [[1.95, -11.1], [3.55, -10.8]]]) inkLine(P([a, b]), sw * .9, C.gold, 'ink', 0);
}

function parshurama(x, y, u, o = {}) {
  const C = { ...PSR, ...(o.pal || {}) };
  const q = { veena: false, topknot: false, shawl: false, brawn: 1, beard: C.hair, beardLen: .55, ...o,
    tilak: o.tilak === 'u' ? undefined : false, pal: C, col: C.skin, dk: C.skinDk, lt: C.skinLt };   // his own skin always (emotions() hands over Clawd's)
  if (o.beard === false) delete q.beard;
  if (o.aura) {   // drawn before him: the light sits behind
    boilSeed(`psr ${o.boilKey ?? ''} aura`);
    const [hx, hy] = naradaHead(x, y, u, o), k = clamp(o.aura);
    glow(hx, hy + 6 * u, 15 * u * (.92 + .08 * Math.sin(T * 6)), '#FF7A2A', 120 * k);
    glow(hx, hy, 7 * u, '#FFD27A', 90 * k);
  }
  q.hat = (uu, sw) => { psrHead(uu, sw, o, C); if (o.hat) o.hat(uu, sw); };
  q.headBehind = (uu, sw) => { psrLocks(uu, sw, o, C); if (o.headBehind) o.headBehind(uu, sw); };
  q.chest = (uu, sw) => { psrChest(uu, sw, o, C); if (o.chest) o.chest(uu, sw); };
  q.behind = (uu, sw) => { if (o.quiver !== false && !o.sit) psrQuiver(uu, sw, C); if (o.behind) o.behind(uu, sw); };
  const ax = _psrAxePose(o);
  if (ax) {
    q.handR = ax.hand; q.bendR = ax.bend;
    q.armR = (uu, sw) => {
      const s = clamp(o.axeK ?? 1);
      push(); rotate(ax.a); scale(s); parashu(uu, sw, { pal: C, glow: o.axeGlow }); pop();
      paint(ellPts(0, 0, .82 * uu, .72 * uu, 14), { wash: C.skin, ink: C.ink, sw: sw * .75 });   // the fist over the haft
      inkLine(U([[-.45, -.25], [.3, -.32]], uu), sw * .4, C.skinDk, 'inkfine', .3);
      if (o.armR) o.armR(uu, sw);
    };
  }
  const bw = clamp(o.dhanush || 0);
  if (bw > 0) {
    q.handL = o.handL || [-4.6, -12.6]; q.bendL = o.bendL ?? .9;
    q.armL = (uu, sw) => {
      push(); scale(bw * 1.25); dhanush(uu, sw, 0, C.ink); if (o.arrow) baan(uu * .9, sw, -Math.PI / 2, C.ink); pop();
      if (o.armL) o.armL(uu, sw);
    };
  }
  for (const k of ['axe', 'axeA', 'axeK', 'axeGlow', 'dhanush', 'arrow', 'quiver', 'hide', 'locks', 'wind', 'windDir', 'aura']) delete q[k];
  return narada(x, y, u, q);
}

// Model sheet: studio.html?loop=parshurama, or node render.mjs --loop=parshurama --sheet=0.5 --cols=1 --w=1080
(() => {
  LOOPS.parshurama = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: PAL.paper, ink: null });
    parshurama(200, 820, 20, { seed: 1, mouth: 'smile' });
    parshurama(540, 820, 20, { seed: 2, eyes: 'angry', mouth: 'frown', brow: -1, axe: 'shoulder', wind: .6, aura: .8 });
    parshurama(880, 820, 20, { seed: 3, eyes: 'wide', mouth: 'open', axe: 'raise', axeGlow: .5 + .5 * Math.sin(t * 3), walk: t * 1.3 });
    parshurama(200, 1460, 20, { seed: 4, axe: false, pray: 1, bow: .4, eyes: 'closed', mouth: 'smile' });
    parshurama(540, 1460, 20, { seed: 5, axe: 'shoulder', dhanush: 1, arrow: 1, eyes: 'look', lookX: -1, mouth: 'flat', flip: 1 });
    ram(880, 1460, 20, { seed: 6, eyes: 'wide', mouth: 'O' });
    parshurama(300, 1860, 15, { sit: 1, axe: false, eyes: 'closed', mouth: 'smile' });
    parshurama(780, 1860, 15, { beard: false, eyes: 'happy', mouth: 'grin', axeGlow: 1 });
  };
  LOOPS.parshurama.len = 4;
})();
