// jambavan.js: Jambavan, the old king of the bears (Valmiki: the eldest of Sugriva's army, who at the ocean reminds
// Hanuman who he is, Kishkindha 66), drawn on Narad Muni's rig (narada.js) with a bear's face through its face hook, so
// he stands at one height with Hanuman (hanuman.js), Ram and Lakshman: dark brown fur, round ears, a cream muzzle and a
// black nose, white bushy brows and a long white beard (he's very old), a pale crescent on his chest, a maroon dhoti
// with an ochre border, an ochre uttariya, a rudraksha mala and a knobbly staff. A little hunched (bow .15).
// Load after narada.js.
// (x, y) is the ground point under him; u is narada()'s unit (about 26u tall to the ear tips). Every narada() option
// works (walk, sit, bow, lean, hx, htilt, handL / handR, eyes, mouth, blush, emote, armL / armR, …); the veena, the
// topknot and the tilak are off.
// His own options:
//   staff 0..1 (default 1)  his staff in his right hand, upright to the ground (sitting: across his lap is up to you,
//                           pass staff: 0 and draw it with jambavanStaff())
//   staffLen (u)            how far below the hand it reaches (default: to the ground from the default hand)
//   pal                     overrides JMB (his colours)
// Helpers: as narada's (naradaHand, naradaHead, naradaMouth, …); jambavanStaff(u, sw, len) draws the staff in arm space.
const JMB = {
  skin: '#6A4430', skinDk: '#4A2E20', skinLt: '#8E6448', ink: '#2E1C18',
  fur: '#6A4430', furDk: '#4A2E20', furLt: '#8E6448', muzzle: '#E8CBA4', muzzleDk: '#C8A47E', nose: '#241614',
  brow: '#F4EEE4', browDk: '#C9BFB2', beard: '#F2ECE2', beardDk: '#CFC5B8', chest: '#D9BC94',
  dhoti: '#8A2E34', dhotiDk: '#62202A', dhotiLt: '#B2525A', border: '#D99A3A',
  shawl: '#D9A24A', shawlDk: '#A87A2E', bead: '#7A4626', beadDk: '#52301A', tulsi: '#A87A4E',
  iris: '#1E120E', white: '#FFF6EA', mouth: '#5A2226', lip: '#8A4A40', wood: '#8A5A32', woodDk: '#5E3A1E', woodLt: '#B88050',
};

// the staff: a knobbly stick with a crook at the top, in arm space at the hand (upright), reaching len u down
function jambavanStaff(u, sw, len = 10.6, INK = JMB.ink) {
  const P = pts => U(pts, u);
  paint(ribbon(P([[.1, len], [-.1, len * .5], [.15, 0], [0, -2.2], [.5, -3.1], [1.2, -3.2], [1.4, -2.6]]), .55 * u, .42 * u), { wash: JMB.wood, fill: JMB.woodDk, fillOp: 50, tex: .5, ink: INK, sw: sw * .7 });
  for (const k of [.25, .55, .8]) paint(ellPts(.05 * u, len * k * u, .36 * u, .2 * u, 10), { wash: JMB.woodDk, ink: null });   // the knots
  inkLine(P([[-.1, -1.6], [-.05, len * .9]]), sw * .4, JMB.woodLt, 'inkfine', .3);
}

// the bear face, in head space (narada's face hook): centred like Narad's head at (0, -20.6)
function jambavanFace(u, sw, J, INK, hx, o) {
  const P = pts => U(pts, u);
  boilSeed(`jambavan ${o.boilKey ?? ''} ears`);
  for (const s of [-1, 1]) {
    paint(ellPts(s * 2.7 * u, -23.5 * u, 1.15 * u, 1.1 * u, 16, J), { wash: JMB.fur, fill: JMB.furDk, fillOp: 50, tex: .5, ink: INK, sw: sw * .7 });
    paint(ellPts(s * 2.7 * u, -23.4 * u, .6 * u, .55 * u, 12), { wash: JMB.muzzleDk, ink: null });
  }
  boilSeed(`jambavan ${o.boilKey ?? ''} beard`);   // the long white beard, from the cheeks down over the chest
  paint(P([[-3, -19.8], [-3.1, -18.2], [-2.6, -16.6], [-1.9, -15.4], [-1.1, -14.6], [-.4, -13.9], [0, -13.4], [.4, -13.9], [1.1, -14.6], [1.9, -15.4], [2.6, -16.6], [3.1, -18.2], [3, -19.8], [0, -18]]),
    { wash: JMB.beard, fill: JMB.beardDk, fillOp: 55, tex: .6, ink: INK, sw: sw * .8, curv: .45 });
  for (const k of [-1.6, -.5, .6, 1.7]) inkLine(P([[k * .9, -17.2], [k, -16], [k * .7, -14.9]]), sw * .45, JMB.beardDk, 'inkfine', .5);
  boilSeed(`jambavan ${o.boilKey ?? ''} head`);
  const n = 36, head = [];
  for (let i = 0; i < n; i++) {   // a round furry head, tufts at the cheeks
    const a = i / n * TAU, side = Math.pow(Math.abs(Math.cos(a)), 3) * (Math.sin(a) > -.3 ? 1 : 0), r = 1 + side * (i % 2 ? .13 : -.02);
    head.push([Math.cos(a) * 3.35 * r * u, (-20.7 + Math.sin(a) * 3.15 * r) * u]);
  }
  paint(head, { wash: JMB.fur, fill: JMB.furDk, fillOp: 45, tex: .6, ink: INK, sw });
  paint(ellPts((-1 + hx) * u, -22.6 * u, 1.6 * u, .7 * u, 14, J, -.2), { fill: JMB.furLt, fillOp: 110, bleed: .2, tex: .7, border: .7, ink: null });
  push(); translate(hx * .8 * u, 0);
  boilSeed(`jambavan ${o.boilKey ?? ''} muzzle`);
  paint(ellPts(0, -18.7 * u, 1.95 * u, 1.45 * u, 20, J), { wash: JMB.muzzle, fill: JMB.muzzleDk, fillOp: 45, tex: .4, ink: INK, sw: sw * .6 });
  naradaEyes(u, o, sw, JMB.fur, [-1.15, -20.85], .58, .54, JMB.fur);
  boilSeed(`jambavan ${o.boilKey ?? ''} brows`);   // white bushy brows over the eyes (they move with brow)
  const br = clamp(o.brow || 0, -1, 1), ang = o.eyes === 'angry' ? 1 : 0;
  for (const s of [-1, 1]) {
    const by = -21.85 - Math.max(0, br) * .35 - (o.eyes === 'wide' ? .3 : 0), tilt = (Math.min(0, br) - ang) * .35;
    paint(ribbon(P([[s * .35, by + .15 - tilt], [s * 1.2, by - .2], [s * 2.1, by - .05], [s * 2.7, by + .35]]), .75 * u, .3 * u), { wash: JMB.brow, fill: JMB.browDk, fillOp: 40, tex: .4, ink: INK, sw: sw * .4 });
  }
  boilSeed(`jambavan ${o.boilKey ?? ''} nose`);
  paint(P([[-.62, -19.75], [.62, -19.75], [.4, -19.25], [0, -19.05], [-.4, -19.25]]), { wash: JMB.nose, ink: INK, sw: sw * .4, curv: .5 });
  paint(ellPts(-.2 * u, -19.6 * u, .16 * u, .08 * u, 8), { wash: '#FFFFFF', washOp: 170, ink: null });
  boilSeed(`jambavan ${o.boilKey ?? ''} mouth`);
  naradaMouth_(u, o, sw, -18.1, 1.1);
  for (const s of [-1, 1]) paint(ellPts(s * .5 * u, -18.72 * u, .62 * u, .3 * u, 12, 0, s * .25), { wash: JMB.beard, ink: INK, sw: sw * .35 });   // a bushy little moustache
  if (o.blush) for (const s of [-1, 1]) paint(ellPts(s * 2.05 * u, -19.3 * u, .55 * u, .3 * u, 14), { fill: PAL.rose, fillOp: 150 * clamp(o.blush), bleed: .2, tex: .4, ink: null });
  pop();
}

function jambavan(x, y, u, o = {}) {
  const st = o.staff ?? 1, prev = o.armR, prevChest = o.chest;
  const q = { veena: false, topknot: false, tilak: false, bow: .15, ...o, face: jambavanFace, pal: { ...JMB, ...(o.pal || {}) } };
  q.chest = (uu, sw) => {   // the bear's pale chest crescent, under the beard
    boilSeed(`jambavan ${o.boilKey ?? ''} crescent`);
    paint(U([[-2.3, -16.4], [-1.2, -14.9], [0, -14.4], [1.2, -14.9], [2.3, -16.4], [1.4, -15.6], [0, -15.2], [-1.4, -15.6]], uu), { wash: JMB.chest, ink: null, curv: .5 });
    if (prevChest) prevChest(uu, sw);
  };
  if (st > 0) {
    if (!o.handR) { q.handR = [3.6, -11.6]; q.bendR = o.bendR ?? .8; }
    q.armR = (uu, sw) => { push(); scale(st); jambavanStaff(uu, sw, o.staffLen ?? 11.4); pop(); if (prev) prev(uu, sw); };
  }
  return narada(x, y, u, q);
}

// Model sheet: studio.html?loop=jambavan, or node render.mjs --loop=jambavan --sheet=0.5 --cols=1 --w=1080
(() => {
  LOOPS.jambavan = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: PAL.paper, ink: null });
    const cells = [{ mouth: 'smile' }, { eyes: 'happy', mouth: 'grin', blush: .5 }, { eyes: 'wide', mouth: 'O', brow: 1 },
      { eyes: 'closed', mouth: 'smile', walk: t * 1.2 }, { eyes: 'angry', mouth: 'frown', staff: 0, handL: [-4.6, -17] }, { mouth: 'open', hx: .5, lookX: .8, handL: [-1, -16] }];
    cells.forEach((over, i) => {
      const cx = 190 + (i % 3) * 350, gy = 760 + Math.floor(i / 3) * 640;
      jambavan(cx, gy, 20, { seed: i, ...over });
    });
    jambavan(320, 1820, 18, { sit: 1, staff: 0, eyes: 'happy', mouth: 'smile' });
    jambavan(780, 1820, 18, { sit: 1, staff: 0, mouth: 'open', handL: [-1.5, -14], hx: -.4, lookX: -.8 });
  };
  LOOPS.jambavan.len = 4;
})();
