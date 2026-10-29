// parshu1_props.js: sets, props and the cast for parshu1.js (ad 63, "PARSHURAMA was born a WARRIOR because of a KHEER
// MIX-UP", Parshurama series Part 1). Loaded after src/ramayan.js, src/ramayan_sets.js (P1, ashram, court, riverBank,
// throne, tears, tree) and src/parshurama.js. Pure functions of their arguments (and T for boil).
//   PK                                              the palette
//   richika, satyavati, queen, gadhi, vishvamitra   the cast (on Valmiki's, Parvati's, Kaikeyi's and Dasharatha's rigs)
//   kheerBowl, steam, sageVision, warriorVision, thoughtBubble, waterSurge, cradle, babyJamadagni, crownProp, petals,
//   garland, towel                                                                                   props
//   kitchen, chulha, sunsetRidge                                sets
//   (from ad 60) CP, yagnaKund, smokePuff, shockRing, cloudPuff, poof, sunDisc, skyLapse
//   (from ad 59) PR, TK, peachGround, sparkleBurst, diya, templeBell, pcCard      the Books 1–3 card
const PK = {
  ink: '#2B2233', cream: '#FFF5E2', gold: '#F5C542',
  clay: '#B9653A', clayDk: '#86401F', clayLt: '#E09060', rim: '#9A4A26',
  kheer: '#FFF0D2', kheerDk: '#EED6A8', saffron: '#F28A1E', almond: '#F6E2BE', pista: '#9CC46A',
  sage: '#FFD86A', sageLt: '#FFF2C0', war: '#FF6A3A', warLt: '#FFB08A',
  wall: '#C98E5E', wallDk: '#9A6440', wallLt: '#E6B282', floor: '#8E5E3C', floorDk: '#6A4228',
  dusk: '#3E3A6E', duskLo: '#E89A6A', night: '#22204A',
  surge: '#8FD2F0', surgeDk: '#4E9AC8', foam: '#F2FAFF',
  sun: '#FFB040', ridgeA: '#5A2A4A', ridgeB: '#3A1A36', ridgeC: '#24122A', skyA: '#2A1E4E', skyB: '#C24A4A', skyC: '#FF9A4A',
  swaddle: '#FFF4E0', swaddleDk: '#E8D2B0', babySkin: '#F4C8A0', babySkinDk: '#D8A07A', wood: '#A8703E', woodDk: '#74482A',
};

// ---------- the cast ----------
// Richika, Bhrigu's son: a young sage on Valmiki's rig, black hair and beard, an ochre dhoti
const RICHIKA_PAL = { hair: '#2A2030', hairLt: '#4E4058', dhoti: '#C98A3A', dhotiDk: '#9A6420', dhotiLt: '#E8B46A', border: '#6A2E1E',
  skin: '#D9A27A', skinDk: '#B47A54', skinLt: '#F0C4A0' };
function richika(x, y, u, o = {}) { return valmiki(x, y, u, { beard: '#2A2030', beardLen: .75, ...o, pal: { ...RICHIKA_PAL, ...(o.pal || {}) } }); }
// Satyavati, Gadhi's daughter: Parvati's rig in a marigold saree with a red border, no crown
const SATYA_PAL = { saree: '#F2A82E', sareeDk: '#C8781A', sareeLt: '#FFD07A', blouse: '#C8324A', blouseDk: '#962338', bangle: '#C8324A',
  skin: '#F0BC94', skinDk: '#D4926C', skinLt: '#FFDEC4', lip: '#C8505E' };
function satyavati(x, y, u, o = {}) { return parvati(x, y, u, { crown: false, ...o, pal: { ...SATYA_PAL, ...(o.pal || {}) }, col: SATYA_PAL.skin, dk: SATYA_PAL.skinDk, lt: SATYA_PAL.skinLt }); }
// her mother, Gadhi's queen (unnamed in the sources): Kaikeyi's rig in plum and gold
const QUEEN_PAL = { saree: '#7A3E9E', sareeDk: '#56287A', sareeLt: '#A86ACC', blouse: '#E8A030', blouseDk: '#B87818', bangle: '#E8A030' };
function queen(x, y, u, o = {}) { return kaikeyi(x, y, u, { ...o, pal: { ...QUEEN_PAL, ...(o.pal || {}) } }); }
// King Gadhi of Kanyakubja: Dasharatha's rig, a black beard going grey, a teal dhoti
const GADHI_PAL = { hair: '#3E3440', hairLt: '#6A6070', dhoti: '#2E7A6A', dhotiDk: '#1E5A4C', dhotiLt: '#5AA08E', border: '#F2C230',
  shawl: '#C8323A', shawlDk: '#962338', skin: '#EDBE92', skinDk: '#CC9468', skinLt: '#FFDCBC' };
function gadhi(x, y, u, o = {}) { return dasharatha(x, y, u, { beard: '#4A4250', ...o, pal: { ...GADHI_PAL, ...(o.pal || {}) } }); }
// Vishvamitra in tapas: Valmiki's rig, a dark grey beard, a deep red dhoti (the king he was), gold armbands kept
const VISH_PAL = { hair: '#6E6670', hairLt: '#9A929C', dhoti: '#A8322E', dhotiDk: '#7A1E1E', dhotiLt: '#D2605A', border: '#F2C230',
  skin: '#E2AA80', skinDk: '#BE845C', skinLt: '#F6CCA6' };
function vishvamitra(x, y, u, o = {}) { return valmiki(x, y, u, { beard: '#6E6670', ...o, pal: { ...VISH_PAL, ...(o.pal || {}) } }); }

// ---------- props ----------
// a clay bowl of kheer seen from the front and a little above: (x, y) the bottom of the bowl, s its width.
// o: glow (a colour) + gk 0..1 (halo: false skips the painted halo, for dark grounds), level 1..0 (eaten down: 0 shows the bare clay inside), steam 0..1, key, tilt (rad)
function kheerBowl(x, y, s, o = {}) {
  const key = o.key || 'bowl', gk = o.gk ?? 1, lv = o.level ?? 1;
  if (o.glow && gk > 0) { boilSeed(key + 'glow'); if (o.halo !== false) paint(ellPts(x, y - s * .42, s * .78, s * .6, 26), { fill: o.glow, fillOp: 110 * gk, bleed: .35, tex: .3, border: .1, ink: null }); glow(x, y - s * .4, s * 1.3, o.glow, .55 * gk); }
  push(); translate(x, y); if (o.tilt) rotate(o.tilt);
  boilSeed(key + 'body');
  const sw = clamp(s / 120, .6, 1.8), ry = s * .11, top = -s * .34;
  paint([[-s * .5, top], [-s * .46, -s * .16], [-s * .3, -s * .02], [0, 0], [s * .3, -s * .02], [s * .46, -s * .16], [s * .5, top]], { wash: PK.clay, fill: PK.clayDk, fillOp: 70, tex: .5, ink: PK.ink, sw, curv: .5 });
  paint(ellPts(-s * .22, -s * .17, s * .1, s * .05, 10, 0, -.3), { wash: PK.clayLt, washOp: 170, ink: null });
  if (o.glow) paint(ribbon([[-s * .48, -s * .25], [-s * .25, -s * .15], [0, -s * .13], [s * .25, -s * .15], [s * .48, -s * .25]], s * .05, s * .05), { wash: o.glow, ink: PK.ink, sw: sw * .4 });   // a painted band in its colour
  paint(ellPts(0, top, s * .5, ry, 26), { wash: PK.rim, ink: PK.ink, sw: sw * .9 });
  boilSeed(key + 'kheer');
  if (lv > .05) {
    const rx = s * .44 * (.75 + .25 * lv), dy = (1 - lv) * s * .05;
    paint(ellPts(0, top + dy + s * .01, rx, ry * .74 * (.7 + .3 * lv), 24), { wash: PK.kheer, fill: PK.kheerDk, fillOp: 70, tex: .3, ink: null });
    for (let i = 0; i < 7 * lv; i++) {   // saffron strands, almond slivers, pistachio bits
      const a = hash(i * 3.1) * TAU, r = hash(i * 1.7) * .8, px = Math.cos(a) * rx * r, py = top + dy + Math.sin(a) * ry * .6 * r;
      if (i % 3 === 0) paint(ellPts(px, py, s * .03, s * .012, 8, 0, a), { wash: PK.almond, ink: PK.rim, sw: sw * .3 });
      else if (i % 3 === 1) inkLine([[px - s * .025, py], [px + s * .02, py - s * .008]], sw * 1.2, PK.saffron, 'inkfine', 0);
      else paint(ellPts(px, py, s * .014, s * .01, 6), { wash: PK.pista, ink: null });
    }
  } else paint(ellPts(0, top + s * .02, s * .4, ry * .6, 20), { wash: PK.clayDk, fill: PK.kheerDk, fillOp: 60, tex: .5, ink: null });
  pop();
  if (o.steam) steam(x, y + top - 4, s, T, o.steam, key + 'st');
}
// steam wisps rising from (x, y), s wide, k 0..1 (strength)
function steam(x, y, s, t, k, key = 'steam') {
  if (k <= 0) return;
  boilSeed(key);
  for (let i = 0; i < 3; i++) {
    const ph = frac(t * .45 + i / 3), h = s * (.7 + .5 * k), pts = [];
    for (let j = 0; j <= 6; j++) { const q = j / 6; pts.push([x + (i - 1) * s * .18 + Math.sin(t * 2.2 + q * 4 + i * 2) * s * .07 * q, y - q * h * (.4 + ph * .6)]); }
    paint(ribbon(pts, s * .05, s * .015), { wash: '#FFFFFF', washOp: 150 * k * (1 - ph * .7), ink: null });
  }
}
// a vision in light over a bowl: a calm sage sitting in meditation (gold), its base at (x, y), h tall, k 0..1
function sageVision(x, y, h, k, key = 'sagev') {
  if (k <= 0) return;
  const s = h / 10; boilSeed(key);
  glow(x, y - h * .5, h * .9, PK.sage, .55 * k);
  const op = 200 * k, C = { wash: PK.sage, washOp: op, ink: null };
  paint(ellPts(x, y - s * .9, s * 4, s * 1.1, 20), C);                                                   // crossed legs
  paint([[x - s * 2.4, y - s * 1.2], [x - s * 1.8, y - s * 5.6], [x + s * 1.8, y - s * 5.6], [x + s * 2.4, y - s * 1.2]], { ...C, curv: .3 });   // body
  paint(ellPts(x, y - s * 7, s * 1.3, s * 1.4, 18), C);                                                  // head
  paint(ellPts(x, y - s * 8.9, s * .7, s * .9, 14), C);                                                  // topknot
  for (const d of [-1, 1]) paint(ellPts(x + d * s * 2.6, y - s * 1.7, s * .55, s * .5, 10), C);           // hands on the knees
  paint(ellPts(x, y - s * 7, s * 2.4, s * 2.4, 30), { wash: PK.sageLt, washOp: 70 * k, ink: null });      // a halo
}
// a vision in light over a bowl: a warrior with a sword raised (red-orange), feet at (x, y), h tall, k 0..1
function warriorVision(x, y, h, k, key = 'warv') {
  if (k <= 0) return;
  const s = h / 10; boilSeed(key);
  glow(x, y - h * .5, h * .9, PK.war, .55 * k);
  const op = 200 * k, C = { wash: PK.war, washOp: op, ink: null };
  for (const d of [-1, 1]) paint(ribbon([[x + d * s * .5, y - s * 4.2], [x + d * s * 1.6, y - s * 2], [x + d * s * 2.2, y]], s * 1.1, s * .8), C);   // legs astride
  paint([[x - s * 1.7, y - s * 4], [x - s * 2.2, y - s * 7.4], [x + s * 2.2, y - s * 7.4], [x + s * 1.7, y - s * 4]], { ...C, curv: .3 });   // body
  paint(ellPts(x, y - s * 8.4, s * 1.1, s * 1.2, 16), C);                                                // head
  paint([[x - s * .9, y - s * 9.2], [x - s * .7, y - s * 10.3], [x, y - s * 9.7], [x + s * .7, y - s * 10.3], [x + s * .9, y - s * 9.2]], C);   // a crown
  paint(ribbon([[x - s * 2, y - s * 7.1], [x - s * 3, y - s * 5.4], [x - s * 2.5, y - s * 4.3]], s * .8, s * .6), C);   // the other arm, a fist
  paint(ribbon([[x + s * 2, y - s * 7.1], [x + s * 3.1, y - s * 8.6], [x + s * 3.3, y - s * 10]], s * .8, s * .6), C);   // the sword arm, raised
  paint([[x + s * 3.1, y - s * 10.2], [x + s * 3.5, y - s * 10.2], [x + s * 3.6, y - s * 15.6], [x + s * 3.3, y - s * 16.4], [x + s * 3.0, y - s * 15.6]], { wash: PK.warLt, washOp: op, ink: null });   // the blade
  paint(rectPts(x + s * 2.6, y - s * 10.4, s * 1.4, s * .35), C);                                         // the guard
}
// a thought bubble centred at (x, y), w × h, popping in with k 0..1; its tail trails toward (tx, ty)
function thoughtBubble(x, y, w, h, k, tx, ty, key = 'tb') {
  if (k <= 0) return;
  const p = backOut(k); boilSeed(key);
  for (let i = 0; i < 3; i++) { const q = (i + 1) / 4, r = (14 + i * 9) * p; paint(ellPts(lerp(tx, x, q * .7), lerp(ty, y + h * .4, q * .7), r, r * .9, 12), { wash: PK.cream, ink: PK.ink, sw: 1 }); }
  const P = [];
  for (let i = 0; i < 14; i++) { const a = i / 14 * TAU, bump = 1 + .1 * Math.abs(Math.sin(a * 3.5)); P.push([x + Math.cos(a) * w * .5 * p * bump, y + Math.sin(a) * h * .5 * p * bump]); }
  paint(P, { wash: PK.cream, ink: PK.ink, sw: 1.6, curv: .7 });
}
// the river heaving up: a column of water rising at (x, y) (its base), w wide, k 0..1 (its height), glowing
function waterSurge(x, y, w, k, t, key = 'surge') {
  if (k <= 0) return;
  const h = w * 1.25 * easeOut(k); boilSeed(key);
  glow(x, y - h * .5, w * 1.4, '#BFF0FF', .6 * k);
  const L = [], R = [];
  for (let j = 0; j <= 8; j++) { const q = j / 8, sway = Math.sin(t * 3 + q * 4) * w * .06 * q, wd = w * (.3 + .6 * Math.pow(1 - q, 2.5) + .05 * Math.sin(q * 6 + t * 4));
    L.push([x - wd + sway, y - q * h]); R.unshift([x + wd + sway, y - q * h]); }
  paint(L.concat(R), { wash: PK.surge, fill: PK.surgeDk, fillOp: 60, tex: .5, ink: PK.ink, sw: 1.4, curv: .5 });
  // the crest curling over, foam on top
  const cx = x + Math.sin(t * 3 + 4) * w * .06, cy = y - h;
  paint([[cx - w * .36, cy + w * .1], [cx - w * .3, cy - w * .14], [cx, cy - w * .26], [cx + w * .34, cy - w * .16], [cx + w * .44, cy + w * .04], [cx + w * .26, cy - w * .02], [cx + w * .1, cy + w * .1]], { wash: PK.foam, fill: PK.surge, fillOp: 50, tex: .4, ink: PK.ink, sw: 1.2, curv: .6 });
  for (let i = 0; i < 6; i++) { const q = frac(t * .8 + i / 6); paint(ellPts(x + (hash(i * 3.3) - .5) * w * .6, y - q * h, 8 + 6 * hash(i), 8 + 6 * hash(i), 8), { wash: PK.foam, washOp: 230 * (1 - q), ink: null }); }
  for (let i = 0; i < 4; i++) { const a = -Math.PI * (.2 + .6 * i / 3), r = w * (.6 + .4 * frac(t * 1.2 + i * .3)); paint(ellPts(x + Math.cos(a) * r, y + Math.sin(a) * r * .3 - 6, 10, 7, 8), { wash: PK.foam, washOp: 200, ink: null }); }
}
// a little wooden cradle on two rockers, (x, y) the floor under it, s wide; rock (rad) tips it
function cradle(x, y, s, rock = 0, key = 'cradle', inside = null) {
  boilSeed(key);
  paint(ellPts(x, y + 4, s * .55, s * .05, 16), { wash: '#000000', washOp: 40, ink: null });
  push(); translate(x, y); rotate(rock);
  paint([[-s * .55, -s * .02], [-s * .3, s * .02], [s * .3, s * .02], [s * .55, -s * .02]], { ink: PK.ink, sw: 1.6, curv: .5, wash: PK.woodDk });   // the rockers
  paint([[-s * .5, -s * .42], [-s * .44, -s * .08], [s * .44, -s * .08], [s * .5, -s * .42]], { wash: PK.wood, fill: PK.woodDk, fillOp: 60, tex: .5, ink: PK.ink, sw: 1.4, curv: .2 });
  if (inside) inside();
  paint([[-s * .5, -s * .3], [-s * .44, -s * .08], [s * .44, -s * .08], [s * .5, -s * .3]], { wash: PK.wood, fill: PK.woodDk, fillOp: 60, tex: .5, ink: PK.ink, sw: 1.4, curv: .2 });   // the front board
  for (let i = 0; i < 4; i++) paint(ellPts(-s * .3 + i * s * .2, -s * .19, s * .04, s * .04, 8), { wash: PK.gold, ink: PK.ink, sw: .6 });
  pop();
}
// baby Jamadagni swaddled, head at (x, y), s = the head's radius; o.eyes 'closed' | 'open', o.yawn 0..1, o.smile
function babyJamadagni(x, y, s, o = {}) {
  boilSeed((o.key || 'baby') + 'body');
  paint(ellPts(x + s * .9, y + s * 1.2, s * 1.9, s * 1.05, 20, 0, .12), { wash: PK.swaddle, fill: PK.swaddleDk, fillOp: 70, tex: .4, ink: PK.ink, sw: 1.2 });
  inkLine([[x - s * .5, y + s * .7], [x + s * 1.2, y + s * 1.6], [x + s * 2.6, y + s * 1.9]], 2.2, PK.gold, 'ink', .5);
  boilSeed((o.key || 'baby') + 'head');
  paint(ellPts(x, y, s, s * .95, 20), { wash: PK.babySkin, fill: PK.babySkinDk, fillOp: 40, tex: .3, ink: PK.ink, sw: 1.3 });
  inkLine([[x - s * .1, y - s * .92], [x + s * .1, y - s * 1.2], [x + s * .3, y - s * 1.05]], 2.6, PK.ink, 'ink', .6);   // a curl of hair
  paint(ellPts(x, y - s * .55, s * .07, s * .1, 8), { wash: '#E2452B', ink: null });                                   // a tiny tilak
  for (const d of [-1, 1]) paint(ellPts(x + d * s * .52, y + s * .25, s * .18, s * .1, 10), { wash: '#F49A8A', washOp: 150, ink: null });   // cheeks
  const ey = y - s * .08;
  for (const d of [-1, 1]) {
    if (o.eyes === 'open') { paint(ellPts(x + d * s * .36, ey, s * .13, s * .16, 10), { wash: PK.ink, ink: null }); paint(ellPts(x + d * s * .32, ey - s * .06, s * .045, s * .045, 6), { wash: '#FFFFFF', ink: null }); }
    else inkLine([[x + d * s * .36 - s * .14, ey], [x + d * s * .36, ey + s * .08], [x + d * s * .36 + s * .14, ey]], 2, PK.ink, 'ink', .5);
  }
  const yw = clamp(o.yawn || 0);
  if (yw > .1) paint(ellPts(x, y + s * .42, s * .14 * yw + s * .05, s * .2 * yw + s * .03, 10), { wash: '#A8404A', ink: PK.ink, sw: 1 });
  else inkLine([[x - s * .14, y + s * .4], [x, y + s * .48], [x + s * .14, y + s * .4]], 1.8, PK.ink, 'ink', .5);
}
// a king's gold crown set down on the ground (Vishvamitra's), its base at (x, y), s wide
function crownProp(x, y, s, key = 'crownp') {
  boilSeed(key);
  paint(ellPts(x, y + 4, s * .6, s * .08, 14), { wash: '#000000', washOp: 40, ink: null });
  paint([[-.5, 0], [-.55, -.5], [-.3, -.32], [-.15, -.75], [0, -.4], [.15, -.75], [.3, -.32], [.55, -.5], [.5, 0]].map(([a, b]) => [x + a * s, y + b * s]), { wash: PK.gold, fill: '#B8862A', fillOp: 60, tex: .4, ink: PK.ink, sw: 1.2 });
  paint(rectPts(x - s * .5, y - s * .16, s, s * .16), { wash: '#E8A830', ink: PK.ink, sw: 1 });
  for (const d of [-.25, 0, .25]) paint(ellPts(x + d * s, y - s * .08, s * .05, s * .05, 8), { wash: d ? '#2F9C94' : '#D2283A', ink: null });
}
// petals falling from the top of the frame (marigold and rose), from t0 on
function petals(t, t0, key = 'petals', n = 22) {
  if (t < t0) return;
  boilSeed(key);
  for (let i = 0; i < n; i++) {
    const a = t - t0 - hash(i * 2.7) * .8; if (a < 0) continue;
    const x = hash(i * 5.3) * 1080 + Math.sin(a * 2 + i) * 40, y = -40 + a * (380 + 160 * hash(i * 1.1)), r = a * 3 + i;
    if (y > 1960) continue;
    paint([[x + Math.cos(r) * 16, y + Math.sin(r) * 16], [x + Math.cos(r + 1.6) * 8, y + Math.sin(r + 1.6) * 8], [x - Math.cos(r) * 16, y - Math.sin(r) * 16], [x + Math.cos(r - 1.6) * 8, y + Math.sin(r - 1.6) * 8]],
      { wash: i % 3 ? '#F39A2E' : '#E8506A', ink: null, curv: .5 });
  }
}
// a marigold garland hanging round a neck at (x, y), w across the shoulders
function garland(x, y, w, key = 'garl') {
  boilSeed(key);
  for (let i = 0; i <= 12; i++) { const q = i / 12, a = Math.PI * q; paint(ellPts(x - Math.cos(a) * w * .5, y + Math.sin(a) * w * .75, 9, 9, 8), { wash: i % 2 ? '#F39A2E' : '#F7C23A', ink: PK.ink, sw: .5 }); }
}
// a folded bathing cloth held in a hand (arm hook space, at the hand)
const towel = (u, sw) => { paint(U([[-.6, -.4], [.7, -.5], [.9, 2.8], [-.4, 3.0]], u), { wash: '#F6F2EA', fill: '#DCD2C0', fillOp: 60, tex: .4, ink: PK.ink, sw: sw * .6, curv: .3 }); };

// ---------- sets ----------
// the ashram kitchen at dusk: a mud wall, a niche with a diya, the clay hearth on the left with its fire, a doorway on
// the right open to the dusk; lamp 0..1 brightens the lamplight
function kitchen(t, lamp = 1, key = 'kt') {
  boilSeed(key + 'wall');
  paint(rectPts(-400, -400, W + 800, 2000), { wash: PK.wall, fill: PK.wallDk, fillOp: 70, tex: .6, ink: null });
  paint(ellPts(380, 1100, 700, 600, 26), { fill: PK.wallLt, fillOp: 140 * lamp, bleed: .3, tex: .4, ink: null });
  boilSeed(key + 'door');
  paint([[800, 1580], [800, 820], [880, 740], [1040, 740], [1120, 820], [1120, 1580]], { wash: PK.dusk, ink: PK.ink, sw: 1.4, curv: .15 });
  paint(rectPts(800, 1300, 320, 280), { wash: PK.duskLo, washOp: 160, ink: null });
  for (let i = 0; i < 4; i++) paint(ellPts(860 + i * 70, 1290 - hash(i * 3.3) * 60, 40 + 20 * hash(i), 30, 10), { wash: '#2A3A4A', washOp: 200, ink: null });   // the forest outside
  paint(starPts(1000, 880, 7, .4, 4), { wash: '#FFF6DA', ink: null });
  boilSeed(key + 'niche');
  paint([[420, 860], [420, 740], [470, 700], [520, 740], [520, 860]], { wash: PK.wallDk, ink: PK.ink, sw: 1, curv: .3 });
  diya(462, 852, 22, lamp, key + 'diya');
  boilSeed(key + 'floor');
  paint(rectPts(-400, 1560, W + 800, 900), { wash: PK.floor, fill: PK.floorDk, fillOp: 60, tex: .6, ink: PK.ink, sw: 1 });
  paint(ellPts(420, 1700, 700, 160, 22), { fill: PK.wallLt, fillOp: 60 * lamp, bleed: .3, tex: .4, ink: null });
}
// the clay hearth (chulha) with a fire, (x, y) the floor, s wide
function chulha(x, y, s, t, key = 'chulha') {
  boilSeed(key);
  glow(x, y - s * .5, s * 1.2, '#FF9A3A', .5);
  paint([[x - s * .5, y], [x - s * .45, y - s * .5], [x + s * .45, y - s * .5], [x + s * .5, y]], { wash: PK.clay, fill: PK.clayDk, fillOp: 70, tex: .5, ink: PK.ink, sw: 1.3, curv: .2 });
  paint([[x - s * .16, y], [x - s * .14, y - s * .28], [x + s * .14, y - s * .28], [x + s * .16, y]], { wash: '#3A1E16', ink: PK.ink, sw: .9, curv: .4 });
  for (let i = 0; i < 3; i++) { const fx = x + (i - 1) * s * .07, h = s * (.2 + .06 * Math.sin(t * 13 + i * 2)); paint([[fx - s * .06, y - 4], [fx, y - h], [fx + s * .06, y - 4]], { wash: i % 2 ? '#FFC84A' : '#FF7A2A', ink: null, curv: .5 }); }
}
// (curved shapes keep their points within x -300..1380: p5.brush drops a curved polygon reaching far off the canvas)
// a sunset ridge: a red-violet sky, a low sun, ridges, the near rock where a figure stands (its top at y = top)
function sunsetRidge(t, o = {}) {
  const cool = o.cool || 0, C = c => cool ? mixCol(c, '#4A5A8A', cool) : c, top = o.top ?? 1480;
  boilSeed('rg sky');
  paint(rectPts(-600, -600, W + 1200, 2200), { wash: C(PK.skyA), ink: null });
  paint(ellPts(540, 1280, 1300, 640, 30), { wash: C(mixCol(PK.skyA, PK.skyB, .6)), washOp: 230, ink: null });
  paint(ellPts(540, 1300, 1000, 460, 30), { wash: C(PK.skyB), washOp: 230, ink: null });
  paint(ellPts(540, 1320, 700, 280, 30), { wash: C(PK.skyC), washOp: 220, ink: null });
  if (!cool) { glow(540 + (o.sunX || 0), 1180, 520, '#FFB040', .7); paint(ellPts(540 + (o.sunX || 0), 1180, 150, 150, 30), { wash: '#FFD07A', ink: null }); }
  boilSeed('rg clouds');
  for (let i = 0; i < 4; i++) { const x = frac(hash(i * 2.2) + t * .01) * 1500 - 200, y = 700 + i * 120; paint(ellPts(x, y, 220, 26, 14), { wash: C('#8A3A5A'), washOp: 200, ink: null }); }
  boilSeed('rg far');
  paint([[-300, 1280], [-100, 1210], [250, 1290], [600, 1180], [900, 1260], [1300, 1200], [1380, 1220], [1380, 1500], [-300, 1500]], { wash: C(PK.ridgeA), ink: null, curv: .4 });
  paint([[-300, 1390], [0, 1350], [500, 1410], [1000, 1340], [1380, 1390], [1380, 1600], [-300, 1600]], { wash: C(PK.ridgeB), ink: null, curv: .4 });
  boilSeed('rg rock');
  paint([[-300, 2400], [-300, top + 200], [200, top + 60], [420, top], [700, top + 10], [960, top + 120], [1380, top + 220], [1380, 2400]], { wash: C(PK.ridgeC), ink: PK.ink, sw: 1.2, curv: .3 });
  if (o.wind) { boilSeed('rg wind'); for (let i = 0; i < 6; i++) { const x = frac(hash(i * 3.7) - t * .6) * 1600 - 260, y = 500 + hash(i * 1.3) * 900; inkLine([[x, y], [x - 160, y + 10]], 1.6, '#FFD8B0', 'inkfine', 0); } }
}

// ---------- from ad 60 (curse_props.js) ----------
const CP = {
  ink: '#2B2233', cream: '#FFF5E2', gold: '#F5C542', goldLt: '#FFE69A', goldDk: '#C8922A',
  bark: '#A5764A', barkDk: '#74502E', barkLt: '#CDA071', rope: '#C8A26A', ropeDk: '#8E6E3E',
  wood: '#B57E46', woodDk: '#7A4E26', woodLt: '#DDA86A',
  clay: '#C86A3E', clayDk: '#94462A', clayLt: '#EA9A6C', ghee: '#F7CF5A',
  brass: '#E2A838', brassDk: '#A8761E', brassLt: '#FFD77A',
  rock: '#A99E90', rockDk: '#7E7266', rockLt: '#D2C9BC',
  brick: '#C8704A', brickDk: '#94482E', fire: '#FF9A2E', fireIn: '#FFE08A', fireOut: '#F2622A',
  smoke: '#5E5866', smokeLt: '#8E8896', soot: '#3A3238',
  water: '#8FD2F0', waterLt: '#E2F6FF',
  // the shore at dusk
  duskHi: '#6E5A9A', duskMid: '#E2866A', duskLo: '#FFC98E', sea: '#3E6E9E', seaDk: '#26476E', seaLt: '#F2B890',
  sand: '#D8A878', sandDk: '#AE7E52', cliff: '#7A6A6E', cliffDk: '#54485A', cliffLt: '#A8949A',
  lanka: '#F2C24A', night: '#1C2148', nightLo: '#3A3A72', moon: '#FFF4D2',
};


// the yagna: a square brick fire pit seen from the front, flames on top; flare 0..1 a big burst
function yagnaKund(x, y, s, t, flare = 0, key = 'kund') {
  boilSeed(key + 'pit');
  paint([[x - s * .5, y], [x + s * .5, y], [x + s * .44, y - s * .26], [x - s * .44, y - s * .26]], { wash: CP.brick, fill: CP.brickDk, fillOp: 55, tex: .5, ink: CP.ink, sw: 1.2 });
  for (let r = 1; r < 3; r++) inkLine([[x - s * .5 + r * s * .02, y - r * s * .087], [x + s * .5 - r * s * .02, y - r * s * .087]], .8, CP.brickDk, 'inkfine', 0);
  for (let i = 1; i < 5; i++) inkLine([[x - s * .5 + i * s * .2, y], [x - s * .5 + i * s * .2 - (i - 2.5) * s * .02, y - s * .087]], .7, CP.brickDk, 'inkfine', 0);
  const fh = s * (.42 + .35 * flare), cx = x, by = y - s * .24;
  glow(cx, by - fh * .4, s * (1 + flare), '#FFB050', .5 + .3 * flare);
  boilSeed(key + 'fire');
  const n = 5;
  for (let i = 0; i < n; i++) {
    const fx = cx + (i - 2) * s * .14, h = fh * (.6 + .4 * Math.sin(i * 1.7 + 1)) * (1 + .12 * Math.sin(t * 13 + i * 2)), w = s * .1;
    paint([[fx - w, by], [fx - w * .6, by - h * .5], [fx + Math.sin(t * 9 + i) * w * .5, by - h], [fx + w * .6, by - h * .5], [fx + w, by]], { wash: i % 2 ? CP.fire : CP.fireOut, ink: null, curv: .6 });
  }
  for (let i = 0; i < 3; i++) { const fx = cx + (i - 1) * s * .16, h = fh * .5 * (1 + .15 * Math.sin(t * 15 + i)); paint([[fx - s * .05, by], [fx, by - h], [fx + s * .05, by]], { wash: CP.fireIn, ink: null, curv: .6 }); }
}
// a puff of smoke (age 0..1), s across, drifting toward dir
function smokePuff(x, y, s, age, key = 'smoke', dir = [0, -1], col = CP.smoke) {
  if (age < 0 || age > 1) return;
  boilSeed(key);
  for (let i = 0; i < 9; i++) {
    const a = i / 9 * TAU + hash(i) * .6, r = s * (.15 + .6 * easeOut(age)) * (.7 + .5 * hash(i * 2.2));
    const px = x + Math.cos(a) * r + dir[0] * age * s * .8, py = y + Math.sin(a) * r * .8 + dir[1] * age * s * .8, rr = s * (.22 + .14 * hash(i * 4.1)) * (1 - age * .3);
    paint(ellPts(px, py, rr, rr * .85, 12), { wash: i % 3 ? col : CP.smokeLt, washOp: 230 * (1 - age * age), ink: null });
  }
}

// a ring of force, radius r, at (x, y); a fades it
function shockRing(x, y, r, a = 1, key = 'ring', col = '#FFF2C0', flat = .35) {
  if (a <= 0) return;
  boilSeed(key);
  const P = ellPts(x, y, r, r * flat, 40);
  inkLine([...P, P[0]], 10 * a, col, 'ink', .5);
  inkLine([...P, P[0]], 3 * a, '#FFFFFF', 'inkfine', .5);
}
// a soft cloud (from Part 9)
function cloudPuff(x, y, s, key, a = 255, col = '#FFF6EC', dk = '#E8D6CC') {
  boilSeed('cloud' + key);
  paint(ellPts(x, y + s * .18, s * 1.1, s * .32, 18), { wash: dk, washOp: a, ink: null });
  for (const [dx, dy, r] of [[-.6, 0, .42], [-.15, -.22, .55], [.4, -.08, .46], [.85, .06, .3]]) paint(ellPts(x + dx * s, y + dy * s, r * s, r * s * .85, 16), { wash: col, washOp: a, ink: null });
}
// a puff of magic smoke (age 0..1) (from Part 9)
function poof(x, y, s, age, key = 'pf', cols = ['#FFF2C8', '#F2D890']) {
  if (age < 0 || age > 1) return;
  boilSeed(key);
  glow(x, y, s * 1.6 * (1 - age), '#FFE0A0', .6 * (1 - age));
  for (let i = 0; i < 8; i++) { const a = i / 8 * TAU, r = s * (.3 + age * .9); paint(ellPts(x + Math.cos(a) * r, y + Math.sin(a) * r * .7, s * .35 * (1 - age * .6), s * .3 * (1 - age * .6), 12), { wash: cols[i % 2], washOp: 255 * (1 - age), ink: null }); }
}
// the sun as a friendly disc (for the memory and the time-lapse)
function sunDisc(x, y, r, key = 'sun', face = false) {
  boilSeed(key);
  glow(x, y, r * 3.2, '#FFC860', .7);
  paint(ellPts(x, y, r, r, 30), { wash: '#FFB43A', fill: '#F2862A', fillOp: 50, tex: .4, ink: CP.ink, sw: 1.2 });
  paint(ellPts(x - r * .3, y - r * .3, r * .35, r * .22, 14, 0, -.4), { wash: '#FFE08A', washOp: 220, ink: null });
  if (face) {
    for (const s of [-1, 1]) inkLine([[x + s * r * .35 - r * .12, y - r * .08], [x + s * r * .35, y - r * .18], [x + s * r * .35 + r * .12, y - r * .08]], 2.4, CP.ink, 'ink', .5);
    inkLine([[x - r * .25, y + r * .25], [x, y + r * .38], [x + r * .25, y + r * .25]], 2.4, CP.ink, 'ink', .5);
  }
}

// a sky time-lapse: k counts days (fractional), suns and moons arcing over, the sky cycling day → night
function skyLapse(t, k, key = 'lapse') {
  const ph = frac(k), day = Math.sin(ph * Math.PI) ** .6;   // 0..1 within each day; night between
  boilSeed(key + 'sky');
  paint(rectPts(-900, -900, W + 1800, H + 1800), { wash: mixCol(CP.night, '#8FC0EA', day), ink: null });
  paint(ellPts(540, 1500, 1300, 700, 26), { fill: mixCol(CP.nightLo, '#FCE3C4', day), fillOp: 200, bleed: .3, tex: .4, ink: null });
  if (day < .6) { boilSeed(key + 'st'); for (let i = 0; i < 18; i++) paint(starPts(hash(i * 2.3) * 1080, 200 + hash(i * 6.7) * 1100, 3 + 4 * hash(i * 3.3), .4, 4), { wash: '#FFF6DA', washOp: 255 * (1 - day / .6), ink: null }); }
  const a = Math.PI * (1 - ph);   // the sun by day, the moon by night (half a turn later)
  const sx = 540 + Math.cos(a) * 620, sy = 1300 - Math.sin(a) * 900;
  sunDisc(sx, sy, 70, key + 'sun');
  const a2 = Math.PI * (1 - frac(ph + .5)), mx = 540 + Math.cos(a2) * 620, my = 1300 - Math.sin(a2) * 900;
  boilSeed(key + 'moon'); glow(mx, my, 160, '#FFF4D2', .4); paint(ellPts(mx, my, 52, 52, 20), { wash: CP.moon, ink: CP.ink, sw: 1 });
  for (let i = 0; i < 5; i++) cloudPuff(1300 - frac(hash(i * 4.4) + k * 1.3) * 1900, 400 + hash(i * 3.3) * 900, 70 + 50 * hash(i), key + 'c' + i, 210);
}

// ---------- from ad 59 (pearls_props.js): the palette bits, the peach ground, sparkles, diyas and the Books 1–3 card ----------
const PR = {
  ink: '#2B2233', cream: '#FFF5E2',
  peach: '#FBE0CF', peachDk: '#F2C2A6', peachLt: '#FFF1E6', ray: '#FFE9D2',
  stone: '#F0C8A8', stoneDk: '#D6A282', stoneLt: '#FBE2CC', pillar: '#FFF0DC', pillarDk: '#E6CDA8', marble: '#F6EADA', marbleDk: '#E2D0B8',
  gold: '#F2C230', goldDk: '#B88A1C', goldLt: '#FFE69A', red: '#B8202E', velvet: '#8E1E3A',
  pearl: '#FBF6EE', pearlDk: '#D9CFE6', pearlLt: '#FFFFFF', pearlIn: '#EFE6DA',
  dusk: '#5A3A4E', duskDk: '#3A2436', duskLt: '#7E5466', wall: '#E8B98E', wallDk: '#C9946A', wallLt: '#F6D3AE',
  lamp: '#FFC24A', flame: '#FFE08A', flameIn: '#FFF4C8', flameOut: '#FF8A2A', clay: '#B85A32', clayDk: '#86391E',
  marigold: '#F39A2E', marigoldDk: '#D0701A', leaf: '#5E9A5A',
  heart: '#FFE7A6', heartLt: '#FFF6D8', heartDk: '#F7C66A', heartRim: '#E89A2A',
};
const TK = {
  ink: '#2B2233', cream: '#FFF5E2', marigold: '#F39A2E', petal: '#F4A6B8', gold: '#EDB43C', goldLt: '#FFE39A',
  rkOrange: '#F15A24', peach: '#FBE0CF', brown: '#3A2418', grey: '#6B5A50', teal: '#2E5F5A',
};
// peach with soft turning rays and drifting petals (the hook, the bridge, the ask)
function peachGround(t, cx = 540, cy = 1000) {
  boilSeed('peach');
  paint(rectPts(-200, -300, W + 400, H + 600), { wash: PR.peach, ink: null });
  boilSeed('peachrays');
  for (let i = 0; i < 12; i++) {
    const a = i / 12 * TAU + t * .05, w = .11;
    paint([[cx, cy], [cx + Math.cos(a - w) * 1700, cy + Math.sin(a - w) * 1700], [cx + Math.cos(a + w) * 1700, cy + Math.sin(a + w) * 1700]], { fill: PR.ray, fillOp: 110, bleed: .15, tex: .3, ink: null });
  }
  paint(ellPts(cx, cy, 560, 600, 30), { fill: PR.peachLt, fillOp: 150, bleed: .3, tex: .4, border: .2, ink: null });
  boilSeed('peachpetals');
  for (let i = 0; i < 8; i++) {
    const x = 60 + hash(i * 3.3) * 960 + 30 * Math.sin(t * .9 + i), y = frac(hash(i * 7.1) + t * (.035 + .02 * hash(i))) * (H + 80) - 40, r = t * .8 + i;
    paint([[x + Math.cos(r) * 15, y + Math.sin(r) * 15], [x + Math.cos(r + 1.6) * 7, y + Math.sin(r + 1.6) * 7], [x - Math.cos(r) * 15, y - Math.sin(r) * 15], [x + Math.cos(r - 1.6) * 7, y + Math.sin(r - 1.6) * 7]], { wash: i % 2 ? TK.marigold : TK.petal, washOp: 200, ink: null, curv: .5 });
  }
}
// a little 'awww' heart-sparkle for reactions
function sparkleBurst(x, y, s, age, key = 'burst', n = 8, cols = [TK.cream, TK.goldLt]) {
  if (age < 0 || age > .8) return;
  const k = age / .8; boilSeed(key);
  glow(x, y, s * (1 + k), cols[1], .6 * (1 - k));
  for (let i = 0; i < n; i++) { const a = i / n * TAU + hash(i) * .5, d = s * (.3 + 1.1 * easeOut(k)) * (.7 + .5 * hash(i * 2.1)); paint(starPts(x + Math.cos(a) * d, y + Math.sin(a) * d - k * s * .2, s * .22 * (1 - k * .8) * (.6 + hash(i * 5)), .3, 4), { wash: cols[i % 2], ink: null }); }
}
function diya(x, y, s, lit, key) {
  boilSeed('diya ' + key);
  const fl = Math.min(lit, 1);
  if (lit > .02) glow(x + s * .55, y - s * 1.1, s * 3.2, PR.flameOut, .5 * fl);
  paint([[x - s, y - s * .55], [x + s * .7, y - s * .55], [x + s * 1.25, y - s * .8], [x + s * .9, y - s * .3], [x + s * .5, y], [x - s * .6, y], [x - s * .95, y - s * .25]], { wash: PR.clay, fill: PR.clayDk, fillOp: 60, tex: .4, ink: PR.ink, sw: clamp(s / 14, .5, 1.6), curv: .4 });
  paint(ellPts(x - s * .1, y - s * .55, s * .85, s * .16, 10), { wash: PR.clayDk, ink: null });
  if (lit > .02) {
    const fx = x + s * .95, fy = y - s * .8, h = s * (1.2 + .25 * Math.sin(T * 17 + x)) * fl, w = s * .42;
    paint([[fx - w, fy], [fx - w * .7, fy - h * .5], [fx + Math.sin(T * 11 + x) * w * .3, fy - h], [fx + w * .7, fy - h * .5], [fx + w, fy], [fx, fy + w * .4]], { wash: PR.flame, ink: null, curv: .6 });
    paint(ellPts(fx, fy - h * .3, w * .4, h * .3, 8), { wash: PR.flameIn, ink: null });
  }
}
function templeBell(x, y, s, swing, key = 'bell') {
  boilSeed(key);
  inkLine([[x, y - 500], [x + Math.sin(swing) * 6, y - s]], 1.2, PR.goldDk, 'ink', 0);
  push(); translate(x, y - s); rotate(swing * .3);
  paint([[-s * .55, s * 1.1], [-s * .45, s * .3], [-s * .2, 0], [s * .2, 0], [s * .45, s * .3], [s * .55, s * 1.1]], { wash: PR.gold, fill: PR.goldDk, fillOp: 60, tex: .4, ink: PR.ink, sw: 1, curv: .4 });
  paint(ellPts(0, s * 1.2, s * .15, s * .15, 8), { wash: PR.goldDk, ink: PR.ink, sw: .6 });
  pop();
}
// ---------------- the card ----------------
function pcCard(t, C) {
  boilSeed('cardbg');
  paint(rectPts(-60, -60, W + 120, H + 120), { wash: TK.peach, ink: null });
  boilSeed('card glow'); glow(470, 900, 420, '#FFE7A8', .3);
  for (let i = 0; i < 7; i++) diya(110 + i * 125, 1490, 22, clamp((t - C.cap) * 4 - i * .4), 'card' + i);
  const X = 470, pk = t0 => Math.max(0, t - t0) * 5, br = Math.sin(t * 1.3) * .01;
  if (t > C.cap) letter('Stories of SHAKTI, for little ones', X, 660, 46, TK.teal, { screen: true, font: '50px Marcellus', ink: false, pop: pk(C.cap), maxW: 860 });
  [1, 2, 3].forEach((b, j) => {
    const t0 = C.covers + j * .15; if (t < t0) return;
    const x = X + (j - 1) * 290, y = 900 + (j === 1 ? -16 : 0);
    picture(PICS['book' + b], x, y, 276, 276, { rot: (j - 1) * .05 + (j % 2 ? br : -br), pop: pk(t0), r: 8, shadow: 18 });
  });
  if (t > C.price) {
    letter('Books 1–3 · OUT NOW', X, 1130, 46, TK.brown, { screen: true, font: '700 50px Poppins', ink: false, maxW: 860, pop: pk(C.price) });
    letter('Set of 3 for ₹500', X, 1196, 44, TK.rkOrange, { screen: true, font: '700 52px Poppins', ink: false, maxW: 860, pop: pk(C.price + .12) });
  }
  if (t > C.logo) picture(PICS.logo, X, 530, 140, 140, { pop: pk(C.logo) });
  if (t > C.pill) {
    const k = backOut(clamp(pk(C.pill))) * (1 + .03 * pulse(t, 4));
    boilSeed('pill');
    push(); translate(X, 1295); scale(k); paint(rrPts(-220, -44, 440, 88, 44), { wash: TK.rkOrange, ink: null }); pop();
    letter('rishikatha.com', X, 1297, 50, TK.cream, { screen: true, font: '700 52px Poppins', ink: false, pop: pk(C.pill) });
  }
  if (t > C.follow) letter('Follow @therishikatha', X, 1395, 36, TK.grey, { screen: true, font: '500 38px Poppins', ink: false, maxW: 860, pop: pk(C.follow) });
}
