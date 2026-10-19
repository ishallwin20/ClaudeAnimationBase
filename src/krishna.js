// krishna.js: Krishna grown up, the king of Dwarka, drawn on Narad Muni's rig (narada.js) so the two stand at one
// height: Bal Krishna's blue skin, a gold mukut with a peacock feather (bkFeather from bal_krishna.js), black curls at
// his temples, makara kundals (gold fish earrings), the white-and-red Vaishnava tilak, a yellow pitambar with a red
// border, a peacock-teal uttariya, a mala of gold beads and tulsi green, gold armbands. Load after narada.js and
// bal_krishna.js.
// (x, y) is the ground point under him; u is narada()'s unit (about 29u tall to the feather tip, the mukut tops out
// near -27). Every narada() option works (walk, sit, bow, pray, lean, handL / handR, eyes, mouth, emote, …) except the
// veena and the topknot, which he doesn't have.
// His own options:
//   flute:  'hand' (held in his right hand, screen right, pointing down and out) | 'play' (both hands raise it to his
//           lips, out to screen right); featherWob (phase), crown (false: no mukut, just the curls and the feather)
//   pal:    overrides KRS (his colours), e.g. a darker skin
// Helpers: as narada's (naradaHand, naradaHead, naradaMouth, …: same body).
const KRS = {
  skin: BK.skin, skinDk: BK.skinDk, skinLt: BK.skinLt, ink: '#1E2A4A',
  dhoti: BK.pit, dhotiDk: BK.pitDk, dhotiLt: BK.pitLt, border: '#D2452F',
  shawl: '#2F9C94', shawlDk: '#1E6F6C', hair: '#1E1B2E', hairLt: '#46426A', bead: '#EDB43C', beadDk: '#B67D1C', tulsi: '#5DA45A',
  gold: '#F2C230', goldDk: '#B88A1C', goldLt: '#FFE69A', gem: '#D2283A', gem2: '#2F9C94', pearl: '#FFF6E8',
  iris: '#141428', lip: '#B8505A', mouth: '#5A1E36', white: '#FFF8EC', tilak: '#FFF6E6', red: '#E2452B',
};

// the mukut, the feather, the curls and the earrings, in narada()'s head space (head centre (0, -20.6), 3.2 × 3.05)
function krishnaMukut(u, sw, o, C) {
  const P = pts => U(pts, u), INK = C.ink, J = u * .03;
  boilSeed(`krishna ${o.boilKey ?? ''} curls`);
  for (const s of [-1, 1]) {   // a curl at each temple, falling past the ear
    paint(ribbon(P([[s * 2.7, -22.6], [s * 3.35, -21.2], [s * 3.5, -19.6], [s * 3.2, -18.3]]), .95 * u, .45 * u), { wash: C.hair, ink: INK, sw: sw * .6 });
    inkLine(P([[s * 3.05, -21.6], [s * 3.3, -20.2], [s * 3.15, -19]]), sw * .4, C.hairLt, 'inkfine', .5);
    // the makara kundal: a little gold fish hanging from the ear
    paint(P([[s * 3.2, -19.6], [s * 3.65, -19.1], [s * 3.55, -18.4], [s * 3.15, -18.1], [s * 2.95, -18.7]]), { wash: C.gold, fill: C.goldDk, fillOp: 50, tex: .4, ink: INK, sw: sw * .4, curv: .5 });
    paint(ellPts(s * 3.3 * u, -18.85 * u, .14 * u, .14 * u, 8), { wash: C.gem, ink: null });
  }
  // the feather, behind the crown, leaning out to screen right
  boilSeed(`krishna ${o.boilKey ?? ''} feather`);
  push(); translate(.5 * u, -19.95 * u); scale(1.2); bkFeather(u, sw / 1.2, { ...BK, ink: INK }, o.featherWob ?? T * .45); pop();
  if (o.crown === false) return;
  boilSeed(`krishna ${o.boilKey ?? ''} mukut`);
  push(); translate(0, -.35 * u);   // sits a little high, so the tilak shows under the band
  const crown = P([[-3.1, -22.3], [-3.0, -23.8], [-2.3, -24.3], [-1.6, -25.2], [-.8, -25.5], [0, -26.7], [.8, -25.5], [1.6, -25.2], [2.3, -24.3], [3.0, -23.8], [3.1, -22.3], [0, -22.7]]);
  paint(crown, { wash: C.gold, fill: C.goldDk, fillOp: 55, bleed: .08, tex: .5, border: .4, ink: INK, sw: sw * .8, curv: .15 });
  paint(P([[-1.4, -24.3], [0, -25.9], [1.4, -24.3], [0, -24.0]]), { fill: C.goldLt, fillOp: 140, bleed: .2, tex: .5, ink: null });
  paint(P([[-3.2, -22.9], [3.2, -22.9], [3.15, -22.15], [0, -22.5], [-3.15, -22.15]]), { wash: C.goldDk, ink: INK, sw: sw * .6, curv: .2 });   // the band
  for (let i = 0; i < 9; i++) paint(ellPts((-2.7 + i * .675) * u, -22.55 * u, .14 * u, .14 * u, 8), { wash: C.pearl, ink: null });
  paint(ellPts(0, -24.25 * u, .42 * u, .5 * u, 12, J), { wash: C.gem, ink: INK, sw: sw * .4 });
  paint(ellPts(-.1 * u, -24.4 * u, .13 * u, .15 * u, 8), { wash: C.white, washOp: 200, ink: null });
  for (const s of [-1, 1]) paint(ellPts(s * 1.85 * u, -23.75 * u, .26 * u, .3 * u, 10), { wash: C.gem2, ink: INK, sw: sw * .3 });
  pop();
}

// his bamboo flute, from (x0, y0) to (x1, y1) in the current space (u), with a red tassel at the far end
function krishnaFlute(u, sw, x0, y0, x1, y1, INK = KRS.ink) {
  paint(ribbon(U([[x0, y0], [x1, y1]], u), .36 * u, .34 * u), { wash: BK.flute, fill: BK.fluteDk, fillOp: 50, tex: .4, ink: INK, sw: sw * .5 });
  for (let k = 0; k < 6; k++) { const q = .3 + k * .1; paint(ellPts(lerp(x0, x1, q) * u, (lerp(y0, y1, q) - .02) * u, .07 * u, .07 * u, 6), { wash: BK.fluteDk, ink: null }); }
  inkLine(U([[x1, y1], [x1 + .15, y1 + .7], [x1 - .05, y1 + 1.3]], u), sw * 1.4, BK.border, 'ink', .5);
}

function krishna(x, y, u, o = {}) {
  const C = { ...KRS, ...(o.pal || {}) }, fl = o.flute;
  const q = { veena: false, topknot: false, ...o, pal: C, col: C.skin, dk: C.skinDk, lt: C.skinLt };   // his own skin always (emotions() hands over Clawd's)
  q.hat = (uu, sw) => { krishnaMukut(uu, sw, o, C); if (o.hat) o.hat(uu, sw); };
  if (fl === 'play') {
    q.handL = o.handL || [1.0, -18.1]; q.handR = o.handR || [4.3, -17.7]; q.bendL = o.bendL ?? -.6; q.bendR = o.bendR ?? .9;
    const hl = q.handL;
    q.armL = (uu, sw) => { krishnaFlute(uu, sw, -1.9 - hl[0] + 1.0, -.15, 6.4 - hl[0] + 1.0, .45, C.ink); if (o.armL) o.armL(uu, sw); };
  } else if (fl === 'hand') {
    q.armR = (uu, sw) => { krishnaFlute(uu, sw, -.9, -1.6, 1.4, 4.6, C.ink); if (o.armR) o.armR(uu, sw); };
  }
  delete q.flute;
  return narada(x, y, u, q);
}

// Model sheet: studio.html?loop=krishna, or node render.mjs --loop=krishna --sheet=0.5 --cols=1 --w=1080
(() => {
  LOOPS.krishna = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: PAL.paper, ink: null });
    krishna(200, 820, 20, { seed: 1, mouth: 'smile' });
    krishna(540, 820, 20, { seed: 2, flute: 'play', eyes: 'closed', mouth: 'flat', hx: .2 });
    krishna(880, 820, 20, { seed: 3, flute: 'hand', eyes: 'happy', mouth: 'grin', handL: [-4.4, -19.5] });
    krishna(200, 1460, 20, { seed: 4, eyes: 'wide', mouth: 'O', brow: 1 });
    krishna(540, 1460, 20, { seed: 5, eyes: ['normal', 'closed'], mouth: 'smug' });
    krishna(880, 1460, 20, { seed: 6, bow: 1, pray: 1, eyes: 'closed', mouth: 'smile' });
    krishna(300, 1860, 15, { sit: 1, eyes: 'closed', mouth: 'smile' });
    narada(760, 1860, 15, { mouth: 'smile', eyes: 'happy' });
    krishna(940, 1860, 15, { mouth: 'smile', hx: -.4, lookX: -.6 });
  };
  LOOPS.krishna.len = 4;
})();
