// ram.js: Shri Ram, king of Ayodhya, drawn on Narad Muni's rig (narada.js) like Krishna (krishna.js), so he stands at
// one height with Hanuman (hanuman.js) and Sita: Vishnu's blue skin, a tall gold kirita, black curls at his temples,
// makara kundals, the white-and-red Vaishnava tilak, a yellow pitambar with a red border, a maroon uttariya, a mala of
// gold beads, and the Kodanda, his bow, slung across his back (bow). Lakshman is the same rig in his own colours
// (LAKSHMAN_PAL, fair skin, a smaller crown). Sita is parvati() with SITA_PAL + SITA_SKIN (a rose-pink saree, a violet
// blouse, a queen's mukut). Load after narada.js, bal_krishna.js and krishna.js (its curls and earrings).
// (x, y) is the ground point under him; u is narada()'s unit (the kirita tops out near -28.6). Every narada() option
// works (walk, sit, bow, pray, lean, hx, handL / handR, eyes, mouth, emote, …) except the veena and the topknot.
// His own options:
//   kodanda   (default true) the bow on his back, upright behind his left side; false when he sits on a throne
//   crown     'kirita' (default) | 'small' (a low crown: Lakshman) | false
//   pal       overrides RAM (his colours); LAKSHMAN_PAL is Lakshman
// Helpers: as narada's (naradaHand, naradaHead, naradaMouth, …: same body).
const RAM = {
  skin: VSN.skin, skinDk: VSN.skinDk, skinLt: VSN.skinLt, ink: '#1E2A4A',
  dhoti: BK.pit, dhotiDk: BK.pitDk, dhotiLt: BK.pitLt, border: '#D2452F',
  shawl: '#9E2A44', shawlDk: '#6E1A30', hair: '#1E1B2E', hairLt: '#46426A', bead: '#EDB43C', beadDk: '#B67D1C', tulsi: '#FFE39A',
  gold: '#F2C230', goldDk: '#B88A1C', goldLt: '#FFE69A', gem: '#D2283A', gem2: '#2F9C94', pearl: '#FFF6E8',
  iris: '#141428', lip: '#B8505A', mouth: '#5A1E36', white: '#FFF8EC', tilak: '#FFF6E6', red: '#E2452B',
  wood: '#8A5230', woodDk: '#5E3418', string: '#FFF0C8',
};
const LAKSHMAN_PAL = { skin: '#F2C49A', skinDk: '#D69A6E', skinLt: '#FFE2C4', dhoti: '#E8862E', dhotiDk: '#B85E18', dhotiLt: '#FFB870', border: '#2E7A5A', shawl: '#2E7A6A', shawlDk: '#1E5A4C' };
const SITA_PAL = { skin: '#F2BE98', skinDk: '#D69470', skinLt: '#FFE0C8', saree: '#D9467C', sareeDk: '#A82E5C', sareeLt: '#F28AB0',
  blouse: '#6E3E9E', blouseDk: '#4E2A78', bangle: '#C8324A', lip: '#C8505E', sindoor: '#E2281E' };
const SITA_SKIN = { col: SITA_PAL.skin, dk: SITA_PAL.skinDk, lt: SITA_PAL.skinLt };

// the kirita, the curls and the kundals, in narada()'s head space (head centre (0, -20.6), 3.2 × 3.05)
function ramKirita(u, sw, o, C) {
  const P = pts => U(pts, u), INK = C.ink, J = u * .03;
  boilSeed(`ram ${o.boilKey ?? ''} curls`);
  for (const s of [-1, 1]) {   // a curl at each temple, and a makara kundal
    paint(ribbon(P([[s * 2.7, -22.6], [s * 3.35, -21.2], [s * 3.5, -19.6], [s * 3.2, -18.3]]), .95 * u, .45 * u), { wash: C.hair, ink: INK, sw: sw * .6 });
    inkLine(P([[s * 3.05, -21.6], [s * 3.3, -20.2], [s * 3.15, -19]]), sw * .4, C.hairLt, 'inkfine', .5);
    paint(P([[s * 3.2, -19.6], [s * 3.65, -19.1], [s * 3.55, -18.4], [s * 3.15, -18.1], [s * 2.95, -18.7]]), { wash: C.gold, fill: C.goldDk, fillOp: 50, tex: .4, ink: INK, sw: sw * .4, curv: .5 });
    paint(ellPts(s * 3.3 * u, -18.85 * u, .14 * u, .14 * u, 8), { wash: C.gem, ink: null });
  }
  if (o.crown === false) return;
  boilSeed(`ram ${o.boilKey ?? ''} crown`);
  push(); translate(0, -.35 * u);
  if (o.crown === 'small') {   // a low crown with three points
    paint(P([[-3.0, -22.4], [-3.05, -24.0], [-2.0, -23.6], [-1.2, -24.9], [0, -24.0], [1.2, -24.9], [2.0, -23.6], [3.05, -24.0], [3.0, -22.4], [0, -22.75]]), { wash: C.gold, fill: C.goldDk, fillOp: 50, tex: .4, ink: INK, sw: sw * .8, curv: .1 });
    paint(ellPts(0, -23.35 * u, .34 * u, .4 * u, 10), { wash: C.gem, ink: INK, sw: sw * .4 });
    pop(); return;
  }
  // the tall kirita: a band, a tapering drum, a pointed top
  const crown = P([[-3.1, -22.3], [-2.95, -24.0], [-2.55, -25.6], [-1.9, -27.0], [-.9, -27.7], [0, -28.6], [.9, -27.7], [1.9, -27.0], [2.55, -25.6], [2.95, -24.0], [3.1, -22.3], [0, -22.7]]);
  paint(crown, { wash: C.gold, fill: C.goldDk, fillOp: 55, bleed: .08, tex: .5, border: .4, ink: INK, sw: sw * .8, curv: .2 });
  paint(P([[-1.5, -24.6], [0, -27.6], [1.5, -24.6], [0, -24.2]]), { fill: C.goldLt, fillOp: 140, bleed: .2, tex: .5, ink: null });
  for (const yy of [-25.2, -26.6]) inkLine(P([[-2.5 * (1 - (yy + 24) * -.12), yy], [0, yy - .3], [2.5 * (1 - (yy + 24) * -.12), yy]]), sw * .6, C.goldDk, 'inkfine', .5);
  paint(P([[-3.2, -22.9], [3.2, -22.9], [3.15, -22.15], [0, -22.5], [-3.15, -22.15]]), { wash: C.goldDk, ink: INK, sw: sw * .6, curv: .2 });   // the band
  for (let i = 0; i < 9; i++) paint(ellPts((-2.7 + i * .675) * u, -22.55 * u, .14 * u, .14 * u, 8), { wash: C.pearl, ink: null });
  paint(ellPts(0, -24.1 * u, .42 * u, .5 * u, 12, J), { wash: C.gem, ink: INK, sw: sw * .4 });
  paint(ellPts(-.1 * u, -24.25 * u, .13 * u, .15 * u, 8), { wash: C.white, washOp: 200, ink: null });
  for (const s of [-1, 1]) paint(ellPts(s * 1.85 * u, -23.65 * u, .24 * u, .28 * u, 10), { wash: C.gem2, ink: INK, sw: sw * .3 });
  paint(ellPts(0, -28.75 * u, .32 * u, .32 * u, 10), { wash: C.gold, ink: INK, sw: sw * .4 });   // the finial
  pop();
}
// the Kodanda across his back, in body space: the top behind his left shoulder (screen left), the foot by his right hip
function ramBow(u, sw, C) {
  // upright on his left side, the string behind him, both tips on the same side (owner, 23 Oct 2026: the old diagonal
  // showed its top on one side and its bottom on the other)
  const P = pts => U(pts, u), INK = C.ink, A = [-4.5, -22.6], B = [-4.5, -4.8];
  inkLine(P([A, B]), sw * .5, C.string, 'inkfine', 0);
  paint(ribbon(P([A, [-5.6, -20.6], [-6.4, -17.2], [-6.7, -13.7], [-6.4, -10.2], [-5.6, -6.8], B]), .42 * u, .3 * u), { wash: C.wood, fill: C.woodDk, fillOp: 50, tex: .4, ink: INK, sw: sw * .6 });
  for (const p of [A, B]) paint(ellPts(p[0] * u, p[1] * u, .3 * u, .3 * u, 8), { wash: C.gold, ink: INK, sw: sw * .4 });
}

function ram(x, y, u, o = {}) {
  const C = { ...RAM, ...(o.pal || {}) };
  const q = { veena: false, topknot: false, ...o, pal: C, col: C.skin, dk: C.skinDk, lt: C.skinLt };   // his own skin always (emotions() hands over Clawd's)
  q.hat = (uu, sw) => { ramKirita(uu, sw, o, C); if (o.hat) o.hat(uu, sw); };
  q.behind = (uu, sw) => { if (o.kodanda !== false && !o.sit) ramBow(uu, sw, C); if (o.behind) o.behind(uu, sw); };
  delete q.kodanda;
  return narada(x, y, u, q);
}
function lakshman(x, y, u, o = {}) { return ram(x, y, u, { crown: 'small', ...o, pal: { ...LAKSHMAN_PAL, ...(o.pal || {}) } }); }

// Model sheet: studio.html?loop=ram, or node render.mjs --loop=ram --sheet=0.5 --cols=1 --w=1080
(() => {
  LOOPS.ram = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: PAL.paper, ink: null });
    ram(200, 820, 20, { seed: 1, mouth: 'smile' });
    ram(540, 820, 20, { seed: 2, eyes: 'wide', mouth: 'O', brow: 1, kodanda: false });
    ram(880, 820, 20, { seed: 3, eyes: 'happy', mouth: 'grin', handL: [-4.6, -18.5], handR: [4.6, -18.5] });
    lakshman(200, 1460, 20, { seed: 4, mouth: 'grin', eyes: 'happy' });
    parvati(540, 1460, 20, { pal: SITA_PAL, ...SITA_SKIN, seed: 5, mouth: 'smile' });
    parvati(880, 1460, 20, { pal: SITA_PAL, ...SITA_SKIN, seed: 6, eyes: 'closed', handR: [.4, -23.2], bendR: 1.4 });
    ram(300, 1860, 15, { sit: 1, eyes: 'closed', mouth: 'smile' });
    lakshman(780, 1860, 15, { mouth: 'open', eyes: 'closed', bow: .3 });
  };
  LOOPS.ram.len = 4;
})();
