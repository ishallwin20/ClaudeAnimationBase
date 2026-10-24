// rp12_props.js: sets, props and the extra cast for rp12.js (Ramayan Part 12, "The Last Arrow", the finale). Loaded
// after src/ramayan.js and src/ramayan_sets.js (P1, court, throne, tree, notes, tears, arrowAt). Pure functions.
//   P12                                         the palette
//   battlefield, sunSky, skyRoute, sunburst      sets
//   cloudPuff, petals, bigSun, pushpaka          props
//   warChariot(x, y, s, t, o)                    a chariot on the ground: Surya's chariot body with donkeys (Ravana's) or
//                                                white horses (Indra's, with Matali at the reins)
//   agastya(x, y, u, o), matali(x, y, u, o)      the sage (short, white-haired, bearded) and Indra's charioteer
const P12 = {
  ink: '#2B2233', cream: '#FFF5E2', gold: '#F5C542',
  duskHi: '#D9785A', duskLo: '#F7C08E', earth: '#C9A06E', earthDk: '#A07848', lanka: '#B8862E', lankaDk: '#7E5420',
  skyHi: '#8FC0EA', skyLo: '#FCE3C4', sea: '#3E86B8', seaLt: '#9ED0EE',
  petal: ['#F4A6B8', '#F39A2E', '#FFD45A', '#FFFFFF'],
};

// ---------- small props ----------
function cloudPuff(x, y, s, key, a = 255, col = '#FFF6EC', dk = '#E8D6CC') {
  boilSeed('cloud' + key);
  paint(ellPts(x, y + s * .18, s * 1.1, s * .32, 18), { wash: dk, washOp: a, ink: null });
  for (const [dx, dy, r] of [[-.6, 0, .42], [-.15, -.22, .55], [.4, -.08, .46], [.85, .06, .3]]) paint(ellPts(x + dx * s, y + dy * s, r * s, r * s * .85, 16), { wash: col, washOp: a, ink: null });
}
// flower petals raining down over the frame (k 0..1 how many)
function petals(t, k = 1, key = 'pt', n = 40) {
  if (k <= 0) return;
  boilSeed(key);
  for (let i = 0; i < n * k; i++) {
    const x = hash(i * 3.1) * 1300 - 100 + Math.sin(t * 1.4 + i) * 40, y = frac(hash(i * 7.9) + t * (.12 + .08 * hash(i * 1.7))) * 2200 - 150, a = t * 2 + i;
    paint(ellPts(x, y, 13, 8, 8, 0, a), { wash: P12.petal[i % 4], ink: P12.ink, sw: .4 });
  }
}
// the Sun as the hymn's subject: a big glowing disc with turning rays, centred at (x, y), r its radius, k 0..1
function bigSun(x, y, r, t, k = 1, key = 'bs') {
  if (k <= 0) return;
  boilSeed(key);
  glow(x, y, r * 2.6, '#FFC860', .6 * k);
  for (let i = 0; i < 14; i++) { const a = i / 14 * TAU + t * .2, r0 = r * 1.15, r1 = r * (1.6 + .15 * Math.sin(t * 3 + i)); paint([[x + Math.cos(a - .08) * r0, y + Math.sin(a - .08) * r0], [x + Math.cos(a) * r1, y + Math.sin(a) * r1], [x + Math.cos(a + .08) * r0, y + Math.sin(a + .08) * r0]], { wash: '#FFD860', washOp: 220 * k, ink: null }); }
  paint(ellPts(x, y, r, r, 30), { wash: '#FFE38A', washOp: 255 * k, ink: '#E8A030', sw: 1.2 });
}
// the Pushpaka: a flying golden vimana, a boat-shaped deck with a dome and swan prows; (x, y) its deck's middle, s wide.
// o.riders(deckPoint) draws the riders standing on the deck (between the back and the front rail)
function pushpaka(x, y, s, t, o = {}) {
  boilSeed('pk' + (o.key || ''));
  glow(x, y - s * .2, s * .9, '#FFE08A', .35);
  paint(ellPts(x, y - s * .42, s * .2, s * .2, 20), { wash: '#F2C24A', fill: '#C8922A', fillOp: 40, tex: .3, ink: P12.ink, sw: 1 });   // the dome
  paint(rectPts(x - s * .04, y - s * .7, s * .08, s * .1), { wash: '#C8922A', ink: P12.ink, sw: .6 });
  for (const d of [-1, 1]) paint(rectPts(x + d * s * .3 - s * .02, y - s * .4, s * .04, s * .4), { wash: '#E8B84A', ink: P12.ink, sw: .7 });   // pillars
  paint(rrPts(x - s * .36, y - s * .46, s * .72, s * .06, s * .03), { wash: '#D2283A', ink: P12.ink, sw: .8 });   // the canopy
  if (o.riders) o.riders([x, y]);
  // the hull: a golden crescent with swan heads at both ends, on puffy clouds
  boilSeed('pkh' + (o.key || ''));
  paint([[x - s * .5, y - s * .06], [x + s * .5, y - s * .06], [x + s * .4, y + s * .12], [x - s * .4, y + s * .12]], { wash: '#F2C24A', fill: '#C8922A', fillOp: 50, tex: .3, ink: P12.ink, sw: 1.1, curv: .3 });
  for (let i = 0; i < 7; i++) paint(ellPts(x - s * .36 + i * s * .12, y + s * .03, s * .025, s * .025, 8), { wash: '#D2283A', ink: null });
  for (const d of [-1, 1]) { paint(ribbon([[x + d * s * .48, y - s * .04], [x + d * s * .58, y - s * .16], [x + d * s * .54, y - s * .26]], s * .05, s * .035), { wash: '#FFF6EA', ink: P12.ink, sw: .8 }); paint([[x + d * s * .54, y - s * .27], [x + d * s * .62, y - s * .25], [x + d * s * .55, y - s * .23]], { wash: '#F39A2E', ink: P12.ink, sw: .5 }); }
  for (let i = 0; i < 4; i++) cloudPuff(x - s * .4 + i * s * .26, y + s * .16 + Math.sin(t * 2 + i) * 4, s * .14, 'pkc' + i + (o.key || ''), 240);
}

// ---------- sets ----------
// Lanka's battlefield at dusk: a red-gold sky, the city on its hill far off, the dusty field
function battlefield(t, key = 'bf', o = {}) {
  const gy = o.gy ?? 1640;
  boilSeed(key + 'sky');
  paint(rectPts(-600, -800, W + 1200, gy + 900), { wash: P12.duskHi, ink: null });
  paint(ellPts(540, gy - 400, 1100, 420, 26), { fill: P12.duskLo, fillOp: 220, bleed: .3, tex: .4, ink: null });
  glow(800, gy - 420, 300, '#FFC070', .4); paint(ellPts(800, gy - 410, 70, 70, 20), { wash: '#FFD9A0', ink: null });
  boilSeed(key + 'lanka');
  paint([[-400, gy - 240], [-120, gy - 380], [160, gy - 410], [420, gy - 340], [620, gy - 250], [-400, gy - 200]], { wash: P12.lankaDk, ink: null, curv: .6 });
  for (let i = 0; i < 7; i++) { const x = -60 + i * 80, h = 90 + 120 * hash(i * 4.7), y = gy - 330 - Math.sin(i * .5) * 30; paint([[x - 26, y], [x - 26, y - h], [x, y - h - 50], [x + 26, y - h], [x + 26, y]], { wash: P12.lanka, ink: mixCol(P12.ink, P12.lanka, .5), sw: .7, curv: .1 }); paint(ellPts(x, y - h - 4, 22, 22, 12), { wash: P12.lanka, ink: null }); }
  boilSeed(key + 'field');
  paint(rectPts(-600, gy - 220, W + 1200, 1600), { wash: P12.earth, fill: P12.earthDk, fillOp: 60, tex: .5, ink: null });
  inkLine([[-200, gy - 218], [600, gy - 226], [1300, gy - 214]], 1, P12.ink, 'ink', .4);
  boilSeed(key + 'arrows');
  for (let i = 0; i < 7; i++) { const x = -50 + hash(i * 9.1) * 1200, y = gy - 150 + hash(i * 3.7) * 400, a = -.4 + hash(i * 1.3) * .8; inkLine([[x, y], [x + Math.sin(a) * 70, y - Math.cos(a) * 70]], 2.2, '#5A3A2A', 'ink', 0); }
}
// open sky with clouds streaming left (the flight home), the sea far below
function skyRoute(t, key = 'sr') {
  boilSeed(key + 'sky');
  paint(rectPts(-600, -800, W + 1200, 3200), { wash: P12.skyHi, ink: null });
  paint(ellPts(540, 1500, 1200, 500, 26), { fill: P12.skyLo, fillOp: 220, bleed: .3, tex: .4, ink: null });
  for (let i = 0; i < 7; i++) { const x = 1500 - frac(hash(i * 7.3) + t * (.08 + .05 * hash(i))) * 2200, y = 350 + hash(i * 5.1) * 1500; cloudPuff(x, y, 70 + 90 * hash(i * 1.9), key + i, 220); }
}
// a saffron sunburst (the end)
function sunburst(t, key = 'sb', cy = 1150) {
  boilSeed(key);
  paint(rectPts(-200, -200, W + 400, H + 400), { wash: RMY.maroon, ink: null });
  paint(ellPts(540, cy, 900, 900, 40), { fill: RMY.saffron, fillOp: 230, bleed: .25, tex: .4, border: .3, ink: null });
  glow(540, cy, 700, '#FFB060', .55);
  boilSeed(key + 'r');
  for (let i = 0; i < 16; i++) { const a = i / 16 * TAU + t * .1, r0 = 420, r1 = 1100; paint([[540 + Math.cos(a - .05) * r0, cy + Math.sin(a - .05) * r0], [540 + Math.cos(a) * r1, cy + Math.sin(a) * r1], [540 + Math.cos(a + .05) * r0, cy + Math.sin(a + .05) * r0]], { wash: RMY.ray, washOp: 70, ink: null }); }
}

// ---------- the cast ----------
// a war chariot on the ground facing screen right (flip: left): Surya's chariot body; o.team 'donkeys' (Ravana's,
// grey with fangs, as in Part 7) or 'horses' (Indra's, white); o.riders(seat) draws who stands in it; (x, y) the ground
// under the wheel, s about the chariot's length
function warChariot(x, y, s, t, o = {}) {
  const u = s / 14, f = o.flip ? -1 : 1, gal = (o.run ?? 0) * t * 1.6, key = o.key || 'wc';
  for (const [dx, dy, k] of [[11.5, -1, 'a'], [14.5, .6, 'b']]) {
    if (o.team === 'horses') suryaHorse(x + f * dx * u, y - 6 * u + dy * u, u * .75, { boilKey: key + 'h' + k, gallop: frac(gal + (k === 'b' ? .3 : 0)), flip: o.flip, mane: '#F2C24A' });
    else donkey(x + f * dx * u, y + dy * u, u * .8, { boilKey: key + 'd' + k, walk: gal + (k === 'b' ? .3 : 0), ears: 1, eyes: 'angry', tint: '#4A3A5A', tintK: .35, cloth: false, garland: false, noShadow: true, flip: o.flip });
  }
  suryaChariot(x, y, u * 1.4, { part: 'back', boilKey: key + 'c', flip: o.flip });
  if (o.riders) o.riders(suryaChariotSeat(x, y, u * 1.4, { flip: o.flip }));
  suryaChariot(x, y, u * 1.4, { part: 'front', boilKey: key + 'c', spin: gal * 3, flip: o.flip, pole: [x + f * 11 * u, y - 4 * u] });
}
// Agastya: a short old sage with a white beard and topknot (Narad's rig with the elder's colours)
function agastya(x, y, u, o = {}) { return narada(x, y, u, { veena: false, beard: '#EDE6DC', ...o, pal: { ...NRD_SAGE, ...(o.pal || {}) } }); }
// Matali, Indra's charioteer: Aruna's rig (Surya's body, a band crown, no halo) from the waist up, holding the reins
function matali(x, y, u, o = {}) { return surya(x, y, u, { pal: ARUNA_PAL, crown: 'band', halo: 0, legs: false, reins: 1, lotus: false, ...o }); }
// Sugriva and the vanaras (as in Parts 8 and 11)
const VK_FUR = { skin: '#C89A4A', skinDk: '#9A702A', skinLt: '#E8BC6A', fur: '#C89A4A', furDk: '#9A702A', furLt: '#E8BC6A', dhoti: '#2E6A5A', dhotiDk: '#1E4A3E', dhotiLt: '#4E8A7A' };
function vanaraKing(x, y, u, o = {}) { return hanuman(x, y, u, { gada: 0, tail: 'curl', ...o, pal: { ...HNM, ...VK_FUR, ...(o.pal || {}) } }); }
const VANARA_FURS = [['#B8864A', '#8A5E2E', '#D8A86A'], ['#9A8A7A', '#6E6050', '#BCAE9E'], ['#C87A3A', '#9A5420', '#E89E62'], ['#8A6A4A', '#5E4430', '#AA8A6A']];
function vanara(x, y, u, i = 0, o = {}) { const [f, d, l] = VANARA_FURS[i % 4]; return hanuman(x, y, u, { gada: 0, crown: false, tail: 'curl', ...o, pal: { ...HNM, skin: f, skinDk: d, skinLt: l, fur: f, furDk: d, furLt: l, dhoti: ['#2E6A5A', '#7A3A8A', '#3A5A9A', '#8A3A2E'][i % 4], dhotiDk: '#1E2A3A', ...(o.pal || {}) } }); }
