// hanuman_series.js: the Hanuman Ji series kit (Painted; plan in HANUMAN_SERIES.md). Shared by every part's scene.
// Load after hanuman.js, parvati.js, yama.js, ramayan.js (valmiki()) and src/scenes/rk_images.js (PICS, for the card).
//   HSK                                    the series palette (ink, cream, gold, the brand colours)
//   anjana, kesari, rishi                 Hanuman's mother (Parvati's rig, a forest-green saree, a saffron odhni, a
//                                         vanari's tail: tail: false hides it), his father Kesari (Hanuman's rig in
//                                         bronze, a gold band), a rishi in bark cloth (Valmiki's rig; k 0..2 picks one)
//   varuna, kubera, vishvakarma           three gods on Shani's rig through yama() (load after yama.js): Varuna in sea
//                                         colours with his noose, Kubera in gold and emerald with his mace and a purse,
//                                         Vishvakarma, white-bearded, with a hammer; every shani() / yama() option works
//   sugriva, bhikshu, vanRam, vanLakshman  Part 3 (Kishkindha 2–4): Sugriva on Hanuman's rig (tawny fur, a teal dhoti, his
//                                         mukut); Hanuman as the wandering monk he turned into (Narad's rig with a human
//                                         face: saffron robes, a tawny jata, a rudraksha mala, his sindoor tilak, no
//                                         tail); Ram and Lakshman as they were in the forest (jata, bark cloth, a
//                                         rudraksha mala, no crown or gold; the bows stay). Load after ram.js
//   hsPill(part)                          the small "HANUMAN · PART N" pill, bottom left of the safe band
//   hsSource(txt, age, life)              the small source line beside it (name the text when it is not Valmiki)
//   hsCard(t, C)                          the no-price Navadurga card; C = hsCardTimes(t0)
//   hsCoverTitle(part, lines)             the cover's orange PART N pill and title lines (inside the 3:4 crop)
//   poof, sparkleBurst, cloudPuff, flowerProp, diya, orb      small props every part uses
const HSK = {
  ink: '#2B2233', cream: '#FFF5E2', gold: '#F5C542', goldLt: '#FFE69A', goldDk: '#C8922A',
  orange: '#F15A24', peach: '#FBE0CF', teal: '#2E5F5A', brown: '#3A2418', grey: '#6B5A50', marigold: '#F39A2E', petal: '#F4A6B8',
  clay: '#B85A32', clayDk: '#86391E', flame: '#FFE08A', flameIn: '#FFF4C8', flameOut: '#FF8A2A',
  bark: '#A5764A', barkDk: '#74502E', barkLt: '#CDA071',
};

// ---------- the cast ----------
const ANJ_PAL = { saree: '#3E8E5A', sareeDk: '#2A6A40', sareeLt: '#6EB884', blouse: '#D9762E', blouseDk: '#A8541A',
  veil: '#F2A23A', veilDk: '#C8781E', bangle: '#D2283A', skin: '#EDB48A', skinDk: '#CC8A5F', skinLt: '#FFD9B8', lip: '#C0505E' };
const ANJ_FUR = { fur: '#D9924A', furDk: '#A8662A', ink: '#4A2530' };
function anjana(x, y, u, o = {}) {
  const prev = o.behind;
  return parvati(x, y, u, { crown: false, veil: 1, col: ANJ_PAL.skin, dk: ANJ_PAL.skinDk, lt: ANJ_PAL.skinLt, ...o, pal: { ...ANJ_PAL, ...(o.pal || {}) },
    behind: (uu, sw) => {
      if (o.tail !== false) { push(); translate(1.6 * uu, 0); hanumanTailDraw(uu * .95, sw, { tailSway: o.tailSway, tail: o.tail === 'droop' ? 'droop' : 'curl' }, ANJ_FUR); pop(); }
      if (prev) prev(uu, sw);
    } });
}
const KES_PAL = { skin: '#B8743A', skinDk: '#8A5022', skinLt: '#D8985A', fur: '#B8743A', furDk: '#8A5022', furLt: '#D8985A',
  mask: '#F2CFA8', maskDk: '#D6A47A', dhoti: '#2E7A6A', dhotiDk: '#1E5A4C', dhotiLt: '#5EA894' };
function kesari(x, y, u, o = {}) {
  const prev = o.hat;
  return hanuman(x, y, u, { crown: false, gada: 0, ...o, pal: { ...KES_PAL, ...(o.pal || {}) },
    hat: (uu, sw) => {
      boilSeed('kesari band');
      paint(U([[-3.1, -22.9], [-1.5, -23.7], [0, -23.9], [1.5, -23.7], [3.1, -22.9], [3, -22.2], [1.5, -22.95], [0, -23.15], [-1.5, -22.95], [-3, -22.2]], uu), { wash: HSK.gold, fill: HSK.goldDk, fillOp: 40, tex: .4, ink: HSK.ink, sw: sw * .6, curv: .4 });
      paint(ellPts(0, -23.55 * uu, .42 * uu, .42 * uu, 10), { wash: '#D2283A', ink: HSK.ink, sw: sw * .4 });
      if (prev) prev(uu, sw);
    } });
}
const RISHI_PAL = [
  { skin: '#D9A27A', skinDk: '#B47A54', skinLt: '#F0C4A0', hair: '#F2ECE2', hairLt: '#FFFFFF', shawl: '#EADBB8', shawlDk: '#C9B58E' },
  { skin: '#E8B48A', skinDk: '#C68A60', skinLt: '#FAD2AE', hair: '#C9C2BC', hairLt: '#E6E0DA', shawl: '#E2CFA2', shawlDk: '#BCA676' },
  { skin: '#C48A62', skinDk: '#9E6640', skinLt: '#E2AE88', hair: '#7E747E', hairLt: '#A49AA4', shawl: '#EEDCB4', shawlDk: '#C8B48A' },
];
const RISHI_BEARD = ['#F4F0E8', '#D2CCC6', '#8E848E'];
const BARK_DHOTI = { dhoti: HSK.bark, dhotiDk: HSK.barkDk, dhotiLt: HSK.barkLt, border: '#5A3A20' };
function rishi(x, y, u, k = 0, o = {}) {
  return valmiki(x, y, u, { beard: RISHI_BEARD[k], ...o, pal: { ...BARK_DHOTI, ...RISHI_PAL[k], ...(o.pal || {}) } });
}

// The three boon-givers of Part 2 (Uttara 36.15–21) who had no rig: Shani's body through yama() (the noose, the mace).
const VARUNA_PAL = { skin: '#9ADCD8', skinDk: '#62B0B0', skinLt: '#D2F4F0', dhoti: '#2E7FB8', dhotiDk: '#1E5A8A', dhotiLt: '#6EB4E0',
  sash: '#F4F7FB', sashDk: '#B9D3EA', gem: '#FFFFFF', gemLt: '#E0F4FF', hair: '#23304F', hairLt: '#4A5A80', iris: '#1E4A6E', lip: '#3A6A78', ash: '#FFFFFF' };
function varuna(x, y, u, o = {}) { return yama(x, y, u, { gada: false, stache: 'thin', ...o, pal: { ...VARUNA_PAL, ...(o.pal || {}) } }); }
const KUBERA_PAL = { skin: '#F2C58A', skinDk: '#D09A5A', skinLt: '#FFE2B8', dhoti: '#2E8A5A', dhotiDk: '#1E6440', dhotiLt: '#62B888',
  sash: '#C8362E', sashDk: '#96221E', gem: '#3FB67A', gemLt: '#A8F0C8', hair: '#2A1E1A', hairLt: '#4A3A32', iris: '#7A4A12', lip: '#8E3A36', ash: '#D2283A' };
function kubera(x, y, u, o = {}) {
  const prev = o.armL;
  return yama(x, y, u, { pasha: false, ...o, pal: { ...KUBERA_PAL, ...(o.pal || {}) },
    armL: o.purse === false ? prev : (uu, sw) => {   // a purse of coins hanging from his left hand
      boilSeed('kubera purse');
      paint(U([[-.5, .2], [-1.5, 1.4], [-1.6, 2.8], [-.7, 3.6], [.7, 3.6], [1.6, 2.8], [1.5, 1.4], [.5, .2]], uu), { wash: '#C8362E', fill: '#96221E', fillOp: 50, tex: .4, ink: HSK.ink, sw: sw * .6, curv: .5 });
      paint(rrPts(-.75 * uu, -.1 * uu, 1.5 * uu, .55 * uu, .2 * uu), { wash: HSK.gold, ink: HSK.ink, sw: sw * .5 });
      paint(ellPts(0, 2.2 * uu, .5 * uu, .5 * uu, 10), { wash: HSK.gold, ink: HSK.ink, sw: sw * .4 });
      if (prev) prev(uu, sw);
    } });
}
const VISHVA_PAL = { skin: '#E2A878', skinDk: '#BC8052', skinLt: '#F8CCA2', dhoti: '#C8862E', dhotiDk: '#96601A', dhotiLt: '#EAB060',
  sash: '#8A4A2E', sashDk: '#62301C', gem: '#F28A2E', gemLt: '#FFD0A0', hair: '#EDE8E0', hairLt: '#FFFFFF', iris: '#3A2418', lip: '#8E4A3A', ash: '#F2C230' };
function vishvakarma(x, y, u, o = {}) {
  const prev = o.armR;
  return yama(x, y, u, { pasha: false, gada: false, ...o, pal: { ...VISHVA_PAL, ...(o.pal || {}) },
    stache: (uu, sw) => {   // a full white beard
      boilSeed('vishva beard');
      paint(U([[-1.75, -19.5], [-1.95, -18.3], [-1.2, -16.8], [0, -16.1], [1.2, -16.8], [1.95, -18.3], [1.75, -19.5], [.7, -19.0], [0, -18.9], [-.7, -19.0]], uu), { wash: '#F4F0E8', fill: '#CFC8BC', fillOp: 40, tex: .3, ink: HSK.ink, sw: sw * .55, curv: .5 });
    },
    armR: o.hammer === false ? prev : (uu, sw) => {   // his hammer, head up
      boilSeed('vishva hammer');
      paint(ribbon(U([[0, 2.2], [0, -3.8]], uu), .42 * uu, .36 * uu), { wash: '#8A5A32', fill: '#62401E', fillOp: 50, ink: HSK.ink, sw: sw * .6 });
      paint(rrPts(-1.7 * uu, -5.3 * uu, 3.4 * uu, 1.7 * uu, .3 * uu), { wash: '#B8C0CC', fill: '#7E8898', fillOp: 60, tex: .4, ink: HSK.ink, sw: sw * .7 });
      paint(rrPts(-1.5 * uu, -5.15 * uu, 1.1 * uu, .45 * uu, .15 * uu), { wash: '#FFFFFF', washOp: 150, ink: null });
      if (prev) prev(uu, sw);
    } });
}

// Part 3 (Kishkindha 2–4). Sugriva: Hanuman's rig, tawnier, in teal, crowned (the text calls him king even in exile).
const SUG_PAL = { skin: '#C89A4A', skinDk: '#9A702A', skinLt: '#E8BC6A', fur: '#C89A4A', furDk: '#9A702A', furLt: '#E8BC6A', dhoti: '#2E6A5A', dhotiDk: '#1E4A3E', dhotiLt: '#4E8A7A' };
function sugriva(x, y, u, o = {}) { return hanuman(x, y, u, { gada: 0, ...o, pal: { ...SUG_PAL, ...(o.pal || {}) } }); }
// Hanuman as a bhikshu (3.2: he put off his monkey form): a human monk on Narad's rig, so no tail and no fur; his own
// warm colouring, a tawny jata and his sindoor tilak keep him recognisable. Every narada() option works.
const BHIKSHU_PAL = { skin: '#F2C08A', skinDk: '#D4975E', skinLt: '#FFDDB4', ink: '#4A2A18', dhoti: '#F08A2E', dhotiDk: '#C4621A', dhotiLt: '#FFB870', border: '#B8202E',
  shawl: '#F6A63C', shawlDk: '#CC7A1E', hair: '#7A4A22', hairLt: '#A87440', bead: '#7A4426', beadDk: '#52290F', tulsi: '#A86A3A', tilak: '#E2452B', red: '#E2452B', flower: '#F6A63C' };
function bhikshu(x, y, u, o = {}) { return narada(x, y, u, { veena: false, blush: .35, ...o, pal: { ...BHIKSHU_PAL, ...(o.pal || {}) } }); }
// Ram and Lakshman in the forest (3.8, 3.12–15: bark cloth, jata, arms that wear no ornaments): no crown, no gold.
const VAN_PAL = { dhoti: '#C99A5E', dhotiDk: '#9A7040', dhotiLt: '#E6C08C', border: '#7A5230', bead: '#7A4426', beadDk: '#52290F', tulsi: '#A86A3A',
  gold: '#1E1B2E', goldDk: '#1E1B2E', goldLt: '#46426A', gem: '#1E1B2E', flower: '#46426A' };
function vanRam(x, y, u, o = {}) { return ram(x, y, u, { crown: false, topknot: true, shawl: false, ...o, pal: { ...VAN_PAL, ...(o.pal || {}) } }); }
function vanLakshman(x, y, u, o = {}) { return ram(x, y, u, { crown: false, topknot: true, shawl: false, ...o, pal: { ...LAKSHMAN_PAL, ...VAN_PAL, dhoti: '#B8A46A', dhotiDk: '#8C7A44', dhotiLt: '#D8C894', ...(o.pal || {}) } }); }

// ---------- small props ----------
function cloudPuff(x, y, s, key, a = 255, col = '#FFF6EC', dk = '#E8D6CC') {
  boilSeed('cloud' + key);
  paint(ellPts(x, y + s * .18, s * 1.1, s * .32, 18), { wash: dk, washOp: a, ink: null });
  for (const [dx, dy, r] of [[-.6, 0, .42], [-.15, -.22, .55], [.4, -.08, .46], [.85, .06, .3]]) paint(ellPts(x + dx * s, y + dy * s, r * s, r * s * .85, 16), { wash: col, washOp: a, ink: null });
}
function poof(x, y, s, age, key = 'pf', cols = ['#FFF2C8', '#F2D890']) {
  if (age < 0 || age > 1) return;
  boilSeed(key);
  glow(x, y, s * 1.6 * (1 - age), '#FFE0A0', .6 * (1 - age));
  for (let i = 0; i < 8; i++) { const a = i / 8 * TAU, r = s * (.3 + age * .9); paint(ellPts(x + Math.cos(a) * r, y + Math.sin(a) * r * .7, s * .35 * (1 - age * .6), s * .3 * (1 - age * .6), 12), { wash: cols[i % 2], washOp: 255 * (1 - age), ink: null }); }
}
function sparkleBurst(x, y, s, age, key = 'burst', n = 8, cols = [HSK.cream, HSK.goldLt]) {
  if (age < 0 || age > .8) return;
  const k = age / .8; boilSeed(key);
  glow(x, y, s * (1 + k), cols[1], .6 * (1 - k));
  for (let i = 0; i < n; i++) { const a = i / n * TAU + hash(i) * .5, d = s * (.3 + 1.1 * easeOut(k)) * (.7 + .5 * hash(i * 2.1)); paint(starPts(x + Math.cos(a) * d, y + Math.sin(a) * d - k * s * .2, s * .22 * (1 - k * .8) * (.6 + hash(i * 5)), .3, 4), { wash: cols[i % 2], ink: null }); }
}
function flowerProp(x, y, s, key = 'flower', rot = 0, col = '#F2557A', dk = '#C83458') {
  boilSeed(key);
  for (let i = 0; i < 5; i++) { const a = rot + i / 5 * TAU; paint(ellPts(x + Math.cos(a) * s * .55, y + Math.sin(a) * s * .55, s * .48, s * .38, 12, 0, a), { wash: col, fill: dk, fillOp: 40, tex: .4, ink: HSK.ink, sw: .8 }); }
  paint(ellPts(x, y, s * .22, s * .22, 10), { wash: HSK.gold, ink: HSK.ink, sw: .6 });
}
// a little orb of light (a boon, a blessing, a spark of tejas) with a twinkle; ink: 1 outlines it (on a pale sky)
function orb(x, y, s, col, t, key = 'orb', ink = false) {
  boilSeed(key);
  glow(x, y, s * 3.4, col, .75);
  paint(ellPts(x, y, s * .6, s * .6, 20), { wash: ink ? col : mixCol(col, '#FFFFFF', .55), ink: ink ? HSK.ink : null, sw: .5 });
  paint(starPts(x, y, s * (1.1 + .2 * Math.sin(t * 14)), .25, 4, t * 2), { wash: '#FFFFFF', washOp: 225, ink: null });
}
function diya(x, y, s, lit, key) {
  boilSeed('diya ' + key);
  const fl = Math.min(lit, 1);
  if (lit > .02) glow(x + s * .55, y - s * 1.1, s * 3.2, HSK.flameOut, .5 * fl);
  paint([[x - s, y - s * .55], [x + s * .7, y - s * .55], [x + s * 1.25, y - s * .8], [x + s * .9, y - s * .3], [x + s * .5, y], [x - s * .6, y], [x - s * .95, y - s * .25]], { wash: HSK.clay, fill: HSK.clayDk, fillOp: 60, tex: .4, ink: HSK.ink, sw: clamp(s / 14, .5, 1.6), curv: .4 });
  paint(ellPts(x - s * .1, y - s * .55, s * .85, s * .16, 10), { wash: HSK.clayDk, ink: null });
  if (lit > .02) {
    const fx = x + s * .95, fy = y - s * .8, h = s * (1.2 + .25 * Math.sin(T * 17 + x)) * fl, w = s * .42;
    paint([[fx - w, fy], [fx - w * .7, fy - h * .5], [fx + Math.sin(T * 11 + x) * w * .3, fy - h], [fx + w * .7, fy - h * .5], [fx + w, fy], [fx, fy + w * .4]], { wash: HSK.flame, ink: null, curv: .6 });
    paint(ellPts(fx, fy - h * .3, w * .4, h * .3, 8), { wash: HSK.flameIn, ink: null });
  }
}

// ---------- the series marks ----------
// the small part pill, bottom left of the safe band (screen space: call it after camEnd())
// Show it and the source line in the opening only (about the first 9 s), then fade them out with `a` (owner, 11 Nov 2026).
function hsPill(part, a = 1) {
  boilSeed('hspill');
  paint(rrPts(64, 1440, 268, 52, 26), { wash: HSK.orange, washOp: 255 * a, ink: a < 1 ? null : HSK.ink, sw: 1 });
  letter('HANUMAN · PART ' + part, 198, 1468, 32, HSK.cream, { screen: true, ink: false, rot: 0, alpha: a, maxW: 240 });
}
// the source line, to the right of the pill
function hsSource(txt, age, life = 99) {
  if (age < 0 || age > life) return;
  const a = clamp(age * 4) * (1 - seg(age, life - .25, life));
  letter(txt, 640, 1468, 30, HSK.cream, { screen: true, ink: false, rot: 0, alpha: a, stroke: HSK.ink, sw: .2, maxW: 560 });
}
// the card (no price, from 31 Oct 2026): the three covers, "The Navadurga Set · OUT NOW", the site pill, link in bio, follow
const hsCardTimes = t0 => ({ cap: t0 + .1, covers: t0 + .3, line: t0 + 1.0, logo: t0 + 1.3, pill: t0 + 1.6, bio: t0 + 1.9, follow: t0 + 2.2 });
function hsCard(t, C) {
  boilSeed('cardbg');
  paint(rectPts(-60, -60, W + 120, H + 120), { wash: HSK.peach, ink: null });
  boilSeed('card glow'); glow(470, 900, 420, '#FFE7A8', .3);
  for (let i = 0; i < 7; i++) diya(110 + i * 125, 1490, 22, clamp((t - C.cap) * 4 - i * .4), 'card' + i);
  const X = 470, pk = t0 => Math.max(0, t - t0) * 5, br = Math.sin(t * 1.3) * .01;
  if (t > C.cap) letter('Stories of SHAKTI, for little ones', X, 660, 46, HSK.teal, { screen: true, font: '50px Marcellus', ink: false, pop: pk(C.cap), maxW: 860 });
  [1, 2, 3].forEach((b, j) => {
    const t0 = C.covers + j * .15; if (t < t0) return;
    const x = X + (j - 1) * 290, y = 900 + (j === 1 ? -16 : 0);
    picture(PICS['book' + b], x, y, 276, 276, { rot: (j - 1) * .05 + (j % 2 ? br : -br), pop: pk(t0), r: 8, shadow: 18 });
  });
  if (t > C.line) {
    letter('The Navadurga Set', X, 1130, 48, HSK.brown, { screen: true, font: '700 50px Poppins', ink: false, maxW: 860, pop: pk(C.line) });
    letter('OUT NOW', X, 1196, 46, HSK.orange, { screen: true, font: '700 52px Poppins', ink: false, maxW: 860, pop: pk(C.line + .12) });
  }
  if (t > C.logo) picture(PICS.logo, X, 530, 140, 140, { pop: pk(C.logo) });
  if (t > C.pill) {
    const k = backOut(clamp(pk(C.pill))) * (1 + .03 * pulse(t, 4));
    boilSeed('pill');
    push(); translate(X, 1295); scale(k); paint(rrPts(-220, -44, 440, 88, 44), { wash: HSK.orange, ink: null }); pop();
    letter('rishikatha.com', X, 1297, 50, HSK.cream, { screen: true, font: '700 52px Poppins', ink: false, pop: pk(C.pill) });
  }
  if (t > C.bio) letter('Check the link in bio', X, 1385, 38, HSK.brown, { screen: true, font: '500 38px Poppins', ink: false, maxW: 860, pop: pk(C.bio) });
  if (t > C.follow) letter('Follow @therishikatha', X, 1445, 36, HSK.grey, { screen: true, font: '500 38px Poppins', ink: false, maxW: 860, pop: pk(C.follow) });
}
// the cover's marks: the orange PART N pill and the title lines [[text, y, size, colour]] (screen space, inside the
// 3:4 grid crop y 240–1680)
function hsCoverTitle(part, lines) {
  boilSeed('covpill');
  paint(rrPts(540 - 190, 300 - 58, 380, 116, 58), { wash: HSK.orange, ink: HSK.ink, sw: 1.6 });
  letter('PART ' + part, 540, 304, 84, HSK.cream, { screen: true, stroke: HSK.ink, sw: .2, ink: false, rot: 0 });
  for (const [txt, y, size, col] of lines) letter(txt, 540, y, size, col || '#FFFFFF', { screen: true, stroke: HSK.ink, sw: .22, ink: false, maxW: 980, rot: -.02 });
}
