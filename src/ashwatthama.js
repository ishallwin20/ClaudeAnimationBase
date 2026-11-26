// ashwatthama.js: Ashwatthama, Drona's son, in the Painted style, on Narad Muni's rig (narada.js) with Parshurama's
// warrior build, so he stands at one height with Ram, Hanuman and Parshurama. Drawn to match the CHIRANJEEVI comic
// (Issue 1): warm brown skin, a short black beard and moustache, a dark indigo cloth cap wound round his head with a
// small topknot above it and a gold band at its rim, THE GEM on his forehead (sahaja mani, born with him: Sauptika
// 10.11.20, 10.15.28) glowing ice-blue, gold hoops in his ears, a dark steel kavacha with gold trim over a maroon dhoti,
// the sacred thread (he is a brahmin) over the armour, a quiver on his back. Load after narada.js and parshurama.js
// (psrQuiver(), psrChest()) and chandraghanta.js (dhanush(), baan()).
// (x, y) is the ground point under him; u is narada()'s unit (about 27u tall to the top of the topknot).
// Every narada() option works (walk, sit, bow, lean, hx, htilt, handL / handR, eyes ('angry' is his look), mouth,
// brow, emote, behind, armL / armR, …) except the veena, the uttariya and the mala, which he doesn't have.
// His own options:
//   gem       (default 1) 0..1 the gem's light (0: no glow, the stone still there); gone: 1 takes the stone away and
//             leaves a dark mark (after the curse, Sauptika 10.16)
//   dhanush   0..1 a bow in his left hand (dhanush()); arrow: 1 nocks an arrow
//   quiver    (default true) the quiver over his right shoulder
//   armour    (default true) the kavacha; false shows a bare chest
//   pal       overrides ASH (his colours)
// Helpers: ashGem(x, y, u, o) → the gem's world point (for glows and match cuts); the narada helpers (naradaHand,
// naradaHead, naradaEye, naradaLocal, …) work as they are.
const ASH = {
  skin: '#C98A5C', skinDk: '#A06640', skinLt: '#E6AE80', ink: '#2A1A22',
  dhoti: '#7C2232', dhotiDk: '#561624', dhotiLt: '#A8404E', border: '#E2A836',
  shawl: '#F4E6CC', shawlDk: '#D2BE98', hair: '#1E1620', hairLt: '#463A4A',
  cap: '#2C3358', capDk: '#1C2040', capLt: '#47507E',
  armour: '#4A5468', armourDk: '#2E3646', armourLt: '#7A869C',
  gold: '#E8B43A', goldDk: '#B07A1C', goldLt: '#FFE39A',
  gem: '#BFF4FF', gemDk: '#5CC8E8', gemLt: '#FFFFFF', scar: '#5A2A2E',
  thread: '#FFF4DC', threadDk: '#D8C6A0', wood: '#7A4A2A', woodDk: '#4E2C14', woodLt: '#A8703E',
  quiver: '#4A2A1E', quiverDk: '#2E1810', feather: '#E8DCC4', bead: '#7E3E22', beadDk: '#552614',
  white: '#FFF8EC', iris: '#22140F', lip: '#9A4248', mouth: '#4A1820',
};
const ASH_GEM = [0, -21.95];   // head space, between the brows and the cap's band

function ashGem(x, y, u, o = {}) {
  const [hx, hy] = naradaHead(x, y, u, o);   // the head centre in world space (the head is scaled 1.16× about the neck)
  const s = (o.flip ? -1 : 1), tl = o.htilt || 0;
  const dx = (clamp(o.hx || 0, -1, 1) * .8 + ASH_GEM[0]) * u * NRD_HS, dy = (ASH_GEM[1] + 20.6) * u * NRD_HS;
  return [hx + s * (dx * Math.cos(tl) - dy * Math.sin(tl)), hy + dx * Math.sin(tl) + dy * Math.cos(tl)];
}

// the cap, topknot, band, hoops and gem, in narada()'s head space (head centre (0, -20.6), 3.2 × 3.05)
function ashHead(u, sw, o, C) {
  const P = pts => U(pts, u), INK = C.ink, hx = clamp(o.hx || 0, -1, 1);
  boilSeed(`ash ${o.boilKey ?? ''} hoops`);
  for (const s of [-1, 1]) {   // gold hoops in the ears
    paint(ellPts(s * 3.2 * u, -18.55 * u, .42 * u, .5 * u, 14), { ink: C.gold, sw: sw * 1.5 });
    inkLine(P([[s * 2.95, -18.2], [s * 3.2, -18.05], [s * 3.45, -18.2]]), sw * .5, C.goldDk, 'inkfine', .4);
  }
  boilSeed(`ash ${o.boilKey ?? ''} cap`);
  const bob = Math.sin(T * 2.2) * .03;
  push(); translate(0, -23.6 * u); rotate(bob); translate(0, 23.6 * u);
  paint(P([[-.95, -24.6], [-1.3, -25.5], [-1.05, -26.5], [-.4, -27.05], [.4, -27.05], [1.05, -26.5], [1.3, -25.5], [.95, -24.6]]), { wash: C.hair, ink: INK, sw: sw * .75, curv: .5 });   // the topknot
  inkLine(P([[-.6, -25.6], [0, -26.5], [.6, -26.2]]), sw * .4, C.hairLt, 'inkfine', .6);
  paint(rrPts(-.95 * u, -25.05 * u, 1.9 * u, .5 * u, .2 * u), { wash: C.gold, ink: INK, sw: sw * .4 });   // its gold tie
  pop();
  // the cloth cap: a dome over the crown, wound in folds, down to a gold band across the forehead
  const cap = P([[-3.3, -21.4], [-3.45, -22.6], [-3.05, -23.8], [-2.1, -24.75], [-.9, -25.2], [0, -25.25], [.9, -25.2], [2.1, -24.75], [3.05, -23.8], [3.45, -22.6], [3.3, -21.4], [2.4, -22.15], [1.2, -22.5], [0, -22.6], [-1.2, -22.5], [-2.4, -22.15]]);
  paint(cap, { wash: C.cap, fill: C.capDk, fillOp: 70, bleed: .08, tex: .5, ink: INK, sw: sw * .85, curv: .35 });
  paint(ellPts((-1.1 + hx * .4) * u, -24 * u, 1.3 * u, .45 * u, 12, 0, -.25), { fill: C.capLt, fillOp: 120, bleed: .2, tex: .6, ink: null });   // a sheen
  for (const [a, b, c2] of [[[-3.1, -23.2], [-1.2, -24.4], [1.4, -24.9]], [[-3.2, -22.5], [-.6, -23.6], [2.3, -24.1]], [[-2.4, -22.4], [.8, -23.0], [3.1, -23.1]]])
    inkLine(P([a, b, c2]), sw * .45, C.capDk, 'inkfine', .5);   // the winding folds
  inkLine(P([[-3.3, -21.55], [-2.4, -22.3], [-1.2, -22.65], [0, -22.75], [1.2, -22.65], [2.4, -22.3], [3.3, -21.55]]), sw * 2.1, C.gold, 'ink', .5);   // the band
  inkLine(P([[-3.2, -21.4], [-2.35, -22.1], [-1.15, -22.45], [0, -22.55], [1.15, -22.45], [2.35, -22.1], [3.2, -21.4]]), sw * .35, C.goldDk, 'inkfine', .5);
  // the gem, set in the skin under the band
  push(); translate(hx * .8 * u, 0);
  boilSeed(`ash ${o.boilKey ?? ''} gem`);
  const [gx, gy] = ASH_GEM;
  if (o.gone) {
    paint(ellPts(gx * u, gy * u, .36 * u, .3 * u, 10), { fill: C.scar, fillOp: 160, bleed: .15, tex: .5, ink: INK, sw: sw * .3 });
  } else {
    const g = clamp(o.gem ?? 1), fl = .9 + .1 * Math.sin(T * 3.1);
    if (g > 0) { glow(gx * u, gy * u, 2.6 * u * fl, C.gemDk, 150 * g); glow(gx * u, gy * u, 1.1 * u, C.gemLt, 170 * g); }
    paint(P([[gx, gy - .52], [gx + .4, gy], [gx, gy + .48], [gx - .4, gy]]), { wash: C.gem, ink: INK, sw: sw * .45 });
    paint(P([[gx, gy - .52], [gx + .4, gy], [gx, gy + .05]]), { wash: C.gemDk, washOp: 150, ink: null });
    paint(ellPts((gx - .1) * u, (gy - .18) * u, .09 * u, .12 * u, 6), { wash: C.gemLt, ink: null });
  }
  pop();
}
// the kavacha over the torso (narada()'s chest -16.9..-12), then the sacred thread over it
function ashChest(u, sw, o, C) {
  const P = pts => U(pts, u), INK = C.ink;
  if (o.armour !== false) {
    boilSeed(`ash ${o.boilKey ?? ''} armour`);
    const plate = P([[-3.15, -16.6], [-1.2, -16.95], [0, -16.6], [1.2, -16.95], [3.15, -16.6], [3.35, -14.6], [3.1, -12.6], [0, -12.2], [-3.1, -12.6], [-3.35, -14.6]]);
    paint(plate, { wash: C.armour, fill: C.armourDk, fillOp: 70, bleed: .06, tex: .5, ink: INK, sw: sw * .85, curv: .2 });
    for (const s of [-1, 1]) paint(ellPts(s * 1.5 * u, -15.2 * u, 1.05 * u, .8 * u, 12), { fill: C.armourLt, fillOp: 90, bleed: .2, tex: .5, ink: null });   // the two pectoral plates
    inkLine(P([[0, -16.5], [0, -12.4]]), sw * .5, C.armourDk, 'inkfine', 0);
    for (const yy of [-13.9, -13.2]) inkLine(P([[-2.9, yy], [0, yy + .2], [2.9, yy]]), sw * .45, C.armourDk, 'inkfine', .4);
    inkLine(P([[-3.15, -16.55], [-1.2, -16.9], [0, -16.55], [1.2, -16.9], [3.15, -16.55]]), sw * 1.5, C.gold, 'ink', .4);   // gold trim at the neck
    inkLine(P([[-3.1, -12.55], [0, -12.15], [3.1, -12.55]]), sw * 1.5, C.gold, 'ink', .4);
    paint(ellPts(0, -14.9 * u, .42 * u, .42 * u, 10), { wash: C.gold, ink: INK, sw: sw * .4 });   // a boss
  }
  const fx = o.flip ? -1 : 1, M = pts => P(pts.map(([a, b]) => [a * fx, b]));   // the thread: screen-right shoulder to screen-left hip
  inkLine(M([[2.8, -16.8], [1.3, -15.2], [-.5, -13.6], [-2.5, -12.3]]), sw * 1.1, C.thread, 'ink', .4);
  inkLine(M([[2.65, -16.55], [1.15, -15], [-.65, -13.4], [-2.4, -12.1]]), sw * .3, C.threadDk, 'inkfine', .4);
}

function ashwatthama(x, y, u, o = {}) {
  const C = { ...ASH, ...(o.pal || {}) };
  const q = { veena: false, topknot: false, shawl: false, mala: false, tilak: false, brawn: 1, beard: C.hair, beardLen: .45, eyes: 'angry', brow: -.4, ...o,
    pal: C, col: C.skin, dk: C.skinDk, lt: C.skinLt };   // his own skin always (emotions() hands over Clawd's)
  q.hat = (uu, sw) => { ashHead(uu, sw, o, C); if (o.hat) o.hat(uu, sw); };
  q.chest = (uu, sw) => { ashChest(uu, sw, o, C); if (o.chest) o.chest(uu, sw); };
  q.behind = (uu, sw) => { if (o.quiver !== false && !o.sit) psrQuiver(uu, sw, C); if (o.behind) o.behind(uu, sw); };
  const bw = clamp(o.dhanush || 0);
  if (bw > 0) {
    q.handL = o.handL || [-4.6, -12.6]; q.bendL = o.bendL ?? .9;
    q.armL = (uu, sw) => {
      push(); scale(bw * 1.25); dhanush(uu, sw, 0, C.ink); if (o.arrow) baan(uu * .9, sw, -Math.PI / 2, C.ink); pop();
      if (o.armL) o.armL(uu, sw);
    };
  }
  for (const k of ['gem', 'gone', 'dhanush', 'arrow', 'quiver', 'armour']) delete q[k];
  return narada(x, y, u, q);
}

// Model sheet: studio.html?loop=ashwatthama, or node render.mjs --loop=ashwatthama --sheet=0.5 --cols=1 --w=1080
(() => {
  LOOPS.ashwatthama = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: '#1E2440', ink: null });
    ashwatthama(220, 860, 20, { seed: 1, mouth: 'flat' });
    ashwatthama(560, 860, 20, { seed: 2, eyes: 'normal', brow: 0, mouth: 'smile', dhanush: 1, arrow: 1 });
    ashwatthama(880, 860, 20, { seed: 3, eyes: 'wide', mouth: 'open', walk: t * 1.3, gem: .4 });
    ashwatthama(240, 1500, 20, { seed: 4, eyes: 'closed', mouth: 'frown', bow: .3, gone: 1 });
    ashwatthama(600, 1500, 20, { seed: 5, sit: 1, mouth: 'frown', lookX: .6, lookY: -1 });
    ashwatthama(900, 1500, 20, { seed: 6, eyes: 'angry', brow: -1, mouth: 'smug', hx: .5, htilt: -.1 });
    parshurama(140, 1880, 12, { seed: 7 });
    ashwatthama(960, 1880, 12, { seed: 8, flip: 1, dhanush: 1 });
  };
  LOOPS.ashwatthama.len = 4;
})();
