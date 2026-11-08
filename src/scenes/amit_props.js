// amit_props.js: sets, props and the townsfolk of amit.js ("Amit roop pragate": Ram meets all of Ayodhya). Painted.
// Loaded after src/ramayan.js / ramayan_sets.js (RMY, P1, valmiki, rkVerse) and ram.js, parvati.js, kartikeya.js,
// hanuman.js. Pure functions of their arguments (and T for boil).
//   AM                                     the palette
//   dawnSky(t, key, o)                     the sky over the clouds: peach to gold, the sun, clouds streaming (o.drift)
//   cloudPuff(x, y, s, key, col)           one soft cloud
//   pushpak(x, y, s, o)                    the Pushpak vimana, a swan-prowed flying pavilion; (x, y) is the deck's centre,
//                                          s px per unit (hull ±10 units, roof at -12.5, finial -19); o.part 'back' |
//                                          'front' (riders go between), o.glow, o.flip
//   ayodhyaSet(t, key, o)                  outside Ayodhya by the Saryu: sky, gold walls and towers with flags and torans,
//                                          the river, the meadow; o.h the horizon (the wall's foot), o.warm 0..1
//   folk(x, y, u, kind, o)                 a person of Ayodhya on the cast rigs; kind 'dadi' 'mother' 'man' 'elder' 'boy'
//                                          'girl' 'queen'; o.v picks a colourway; every rig option passes through.
//                                          u is the ADULT MAN unit (narada()'s): women and kids are scaled to match
//   farFolk(x, y, s, i, o)                 a cheap far figure (head, body, a turban or an odhni) for the back rows
//   miniRam(x, y, s, o)                    a cheap far Ram (blue, gold crown, yellow dhoti) with his light
//   tulsidas(x, y, u, o)                   Goswami Tulsidas on Valmiki's rig: a white dhoti, a saffron shawl, a quill
//   rainCloud(x, y, s, k, key)             a little grey sorrow cloud with drops; k 0..1 pops it into petals
//   amPetals(t, key, n, o)                 marigold and rose petals falling (o.k density 0..1)
//   toran(x0, x1, y, sag, key)             a string of marigolds and mango leaves
//   followBoth(t, lt, C)                   the card: follow both (voice: the collaborator; art: us)
const AM = {
  ink: '#2B2233', cream: '#FFF5E2', gold: '#F5C542', goldDk: '#C08A22', goldLt: '#FFE69A',
  skyTop: '#F2A98E', skyHi: '#F8C69A', skyLo: '#FFEBC6', sun: '#FFF0C0', cloud: '#FFF3E4', cloudDk: '#F4CDB4',
  wall: '#EBC57E', wallDk: '#C6964E', wallLt: '#FBE2AA', roof: '#D9763A', roofDk: '#A8541E', dome: '#F5D27A',
  meadow: '#B5CC72', meadowDk: '#8EAA52', meadowLt: '#D2E09A', river: '#8CC6D8', riverDk: '#64A4BE', path: '#E8CF9A',
  flag: '#E8742A', flagDk: '#B8501A', maroon: '#9E2A44', marigold: '#F39A2E', marigoldLt: '#FFC24A', leaf: '#4E8A3E',
  rose: '#E2507A', hull: '#F2C230', hullDk: '#B88A1C', band: '#FFF0D2', red: '#C8323A', teal: '#2F9C94', swan: '#FFF8EE',
  beak: '#F08A2A', rain: '#8E96A8', rainDk: '#6E7688',
};

// ---------- the sky ----------
function cloudPuff(x, y, s, key, col = AM.cloud, op = 255) {
  boilSeed(key);
  paint([[x - s, y], [x - s * .85, y - s * .32], [x - s * .45, y - s * .5], [x - s * .1, y - s * .78], [x + s * .35, y - s * .62], [x + s * .7, y - s * .42], [x + s, y - s * .08], [x + s * .9, y + s * .12], [x - s * .9, y + s * .12]],
    { wash: col, washOp: op, ink: null, curv: .7 });
}
function dawnSky(t, key = 'ds', o = {}) {
  const drift = o.drift ?? 0;
  boilSeed(key + 'sky');
  paint(rectPts(-300, -300, W + 600, 1100), { wash: AM.skyTop, ink: null });
  paint(ellPts(540, 1500, 1300, 800, 30), { fill: AM.skyHi, fillOp: 230, bleed: .35, tex: .3, border: .1, ink: null });
  paint(ellPts(540, 2000, 1300, 700, 30), { fill: AM.skyLo, fillOp: 240, bleed: .35, tex: .3, border: .1, ink: null });
  paint(ellPts(540, 900, 900, 520, 26), { fill: AM.skyHi, fillOp: 200, bleed: .3, tex: .4, border: .2, ink: null });
  paint(ellPts(540, 1450, 1000, 420, 26), { fill: AM.skyLo, fillOp: 220, bleed: .3, tex: .4, border: .2, ink: null });
  const sx = o.sunX ?? 760, sy = o.sunY ?? 1240;
  glow(sx, sy, 420, '#FFD890', .55); paint(ellPts(sx, sy, 110, 110, 24), { wash: AM.sun, ink: null });
  // clouds in three layers, streaming right to left past the vimana (drift: px per second at the near layer)
  const layers = [[.35, 70, AM.cloudDk, 180, 8], [.6, 120, AM.cloud, 220, 7], [1, 190, AM.cloud, 255, 5]];
  layers.forEach(([k, s, col, op, n], L) => {
    for (let i = 0; i < n; i++) {
      const span = 1700, x0 = hash(i * 3.7 + L * 11) * span, x = ((x0 - t * drift * k) % span + span) % span - 300;
      const y = (o.cloudY ?? 600) + L * 380 + hash(i * 5.1 + L) * 360;
      cloudPuff(x, y, s * (.7 + .6 * hash(i * 2.9 + L)), `${key}c${L}_${i}`, col, op);
    }
  });
}

// ---------- the Pushpak ----------
// A flying pavilion on a gold hull with a swan's neck for a prow (screen right) and tail plumes behind, two slim pillars at
// the ends, a canopy with a central shikhara, a kalash and flags, bells along the canopy, little clouds under the keel.
function pushpak(x, y, s, o = {}) {
  const part = o.part || 'all', f = o.flip ? -1 : 1, P = pts => pts.map(([a, b]) => [x + f * a * s, y + b * s]), sw = Math.max(.5, s * .07);
  const key = o.key || 'pp', bob = o.bob ?? 0;
  if (part !== 'front') {
    if (o.glow !== 0) glow(x, y + 2 * s, 14 * s, '#FFE2A0', .5 * (o.glow ?? 1));
    boilSeed(key + 'tail');   // tail plumes, behind the hull at the stern
    [[-13.2, -7.4], [-14.2, -4.6], [-13.8, -1.8]].forEach(([tx, ty], i) =>   // three tail feathers fanning up and back
      paint(P([[-9.4, -1.2], [-10.6, -2.4 - i * .3], [tx + 1.2, ty - .4], [tx, ty], [tx - .2, ty + 1.2], [-10.4, -.4 + i * .2], [-9.4, .2]]), { wash: i === 1 ? AM.teal : AM.swan, fill: i === 1 ? '#1E6F6C' : AM.cloudDk, fillOp: 50, tex: .4, ink: AM.ink, sw, curv: .5 }));
    boilSeed(key + 'backwall');   // the far rail, seen over the deck
    paint(P([[-9.4, -2.6], [9.4, -2.6], [9.4, -1.6], [-9.4, -1.6]]), { wash: AM.hullDk, ink: AM.ink, sw: sw * .7 });
    boilSeed(key + 'backpost');   // the back pillars, behind the riders
    for (const px of [-7.6, 7.6]) paint(P([[px - .25, -15.2], [px + .25, -15.2], [px + .25, -2.4], [px - .25, -2.4]]), { wash: AM.hullDk, ink: AM.ink, sw: sw * .6 });
  }
  if (part === 'back') return;
  // the hull: a curved keel, the front rail (hides the riders' legs), a cream band with lotus studs, a red stripe
  boilSeed(key + 'hull');
  paint(P([[-10, -2.2], [-9.6, .8], [-8.4, 2.4], [-5, 3.3], [0, 3.6], [5, 3.3], [8.6, 2.3], [9.9, .6], [10.2, -2.2]]), { wash: AM.hull, fill: AM.hullDk, fillOp: 60, bleed: .1, tex: .5, ink: AM.ink, sw, curv: .3 });
  paint(P([[-9.9, -.9], [10.1, -.9], [10, .4], [-9.8, .4]]), { wash: AM.band, ink: AM.ink, sw: sw * .6 });
  inkLine(P([[-9.2, 1.4], [-5, 2.25], [0, 2.45], [5, 2.25], [9.2, 1.3]]), sw * 1.6, AM.red, 'ink', .5);
  for (let i = 0; i < 9; i++) { const px = -8 + i * 2; paint(ellPts(x + f * px * s, y - .25 * s, .38 * s, .38 * s, 10), { wash: i % 2 ? AM.teal : AM.red, ink: AM.ink, sw: sw * .4 }); }
  inkLine(P([[-10, -2.2], [10.2, -2.2]]), sw * 1.3, AM.goldDk, 'ink', 0);
  boilSeed(key + 'rail');   // little rail posts along the top
  for (let i = 0; i < 11; i++) { const px = -9.4 + i * 1.88; paint(P([[px - .14, -2.2], [px + .14, -2.2], [px + .14, -3.1], [px - .14, -3.1]]), { wash: AM.gold, ink: null }); paint(ellPts(x + f * px * s, y - 3.2 * s, .22 * s, .22 * s, 8), { wash: AM.gold, ink: AM.ink, sw: sw * .3 }); }
  inkLine(P([[-9.4, -3.05], [9.4, -3.05]]), sw * .9, AM.goldDk, 'ink', 0);
  // the swan's neck and head at the prow
  boilSeed(key + 'swan');
  const nk = bob * .3;
  paint(ribbon(P([[9.4, -.6], [11.2, -2.6], [11.9, -5.2 + nk], [11.3, -7.4 + nk], [11.9, -8.6 + nk]]), 1.5 * s, .9 * s), { wash: AM.swan, fill: AM.cloudDk, fillOp: 40, tex: .3, ink: AM.ink, sw });
  paint(ellPts(x + f * 12.2 * s, y + (-8.7 + nk) * s, 1.05 * s, .85 * s, 14), { wash: AM.swan, ink: AM.ink, sw });
  paint(P([[12.9, -9.1 + nk], [14.6, -8.6 + nk], [12.9, -8.2 + nk]]), { wash: AM.beak, ink: AM.ink, sw: sw * .7 });
  paint(ellPts(x + f * 12.35 * s, y + (-8.95 + nk) * s, .2 * s, .22 * s, 8), { wash: AM.ink, ink: null });
  paint(P([[11.6, -9.4 + nk], [12.4, -10.2 + nk], [12.8, -9.4 + nk]]), { wash: AM.gold, ink: AM.ink, sw: sw * .4 });   // a little crest
  inkLine(P([[10.8, -3.4], [11.8, -3.9]]), sw * .9, AM.gold, 'ink', 0);
  // the front pillars and the canopy
  boilSeed(key + 'posts');
  for (const px of [-8.8, 8.8]) {
    paint(P([[px - .32, -15.2], [px + .32, -15.2], [px + .32, -2.6], [px - .32, -2.6]]), { wash: AM.gold, fill: AM.hullDk, fillOp: 50, tex: .4, ink: AM.ink, sw: sw * .7 });
    paint(ellPts(x + f * px * s, y - 9 * s, .55 * s, .4 * s, 10), { wash: AM.red, ink: AM.ink, sw: sw * .4 });
  }
  push(); translate(0, -2.7 * s);
  boilSeed(key + 'roof');
  paint(P([[-10, -12.4], [10, -12.4], [9.4, -13.8], [-9.4, -13.8]]), { wash: AM.maroon, fill: '#6E1A30', fillOp: 50, tex: .4, ink: AM.ink, sw });
  for (let i = 0; i < 10; i++) { const px = -9 + i * 2; paint(P([[px - .9, -12.4], [px, -11.5], [px + .9, -12.4]]), { wash: AM.gold, ink: AM.ink, sw: sw * .4, curv: .5 }); }
  paint(P([[-6, -13.8], [-5.2, -16.2], [-3, -18], [0, -18.8], [3, -18], [5.2, -16.2], [6, -13.8]]), { wash: AM.hull, fill: AM.hullDk, fillOp: 55, tex: .5, ink: AM.ink, sw, curv: .4 });
  for (const yy of [-15.2, -16.7]) inkLine(P([[-5.1 * (1 + (yy + 15.2) * .15), yy], [0, yy - .3], [5.1 * (1 + (yy + 15.2) * .15), yy]]), sw * .7, AM.goldDk, 'inkfine', .5);
  paint(ellPts(x, y - 15.6 * s, .7 * s, .7 * s, 12), { wash: AM.red, ink: AM.ink, sw: sw * .5 });
  for (const px of [-8.4, 8.4]) paint(P([[px - 1.4, -13.8], [px, -15.8], [px + 1.4, -13.8]]), { wash: AM.hull, ink: AM.ink, sw: sw * .7, curv: .4 });
  paint(P([[-.55, -18.7], [-.7, -19.6], [0, -20.3], [.7, -19.6], [.55, -18.7]]), { wash: AM.gold, ink: AM.ink, sw: sw * .6, curv: .5 });   // the kalash
  boilSeed(key + 'flags');
  for (const px of [-8.4, 8.4]) {
    inkLine(P([[px, -15.8], [px, -18.6]]), sw * .8, AM.ink, 'inkfine', 0);
    const fl = Math.sin(T * 7 + px) * .4;
    paint(P([[px, -18.6], [px - 2.6, -18.1 + fl], [px, -17.4]]), { wash: AM.flag, ink: AM.ink, sw: sw * .5, curv: .3 });
  }
  boilSeed(key + 'bells');
  for (let i = 0; i < 4; i++) { const px = -6 + i * 4, sx = Math.sin(T * 4 + i) * .15; inkLine(P([[px, -11.6], [px + sx, -10.6]]), sw * .5, AM.goldDk, 'inkfine', 0); paint(ellPts(x + f * (px + sx) * s, y - 10.3 * s, .32 * s, .38 * s, 8), { wash: AM.gold, ink: AM.ink, sw: sw * .4 }); }
  pop();
  if (o.clouds !== false) {   // little clouds under the keel
    for (let i = 0; i < 5; i++) cloudPuff(x + f * (-8 + i * 4 + Math.sin(T * .8 + i) * .4) * s, y + (4.2 + (i % 2) * .5) * s, (2.4 + hash(i * 1.7)) * s, key + 'kc' + i, AM.cloud, 235);
  }
}

// ---------- outside Ayodhya ----------
function toran(x0, x1, y, sag = 40, key = 'tor') {
  boilSeed(key);
  const n = Math.max(4, Math.round((x1 - x0) / 34));
  inkLine(Array.from({ length: 9 }, (_, i) => { const k = i / 8; return [lerp(x0, x1, k), y + sag * 4 * k * (1 - k)]; }), 1, AM.leaf, 'inkfine', .5);
  for (let i = 0; i <= n; i++) {
    const k = i / n, px = lerp(x0, x1, k), py = y + sag * 4 * k * (1 - k);
    if (i % 2) paint([[px, py], [px - 7, py + 18], [px, py + 30], [px + 7, py + 18]], { wash: AM.leaf, ink: null, curv: .5 });
    else paint(ellPts(px, py + 8, 10, 10, 10), { wash: i % 4 ? AM.marigold : AM.marigoldLt, ink: null });
  }
}
function ayodhyaSet(t, key = 'ay', o = {}) {
  const h = o.h ?? 1080, warm = o.warm ?? 0, X0 = -300, X1 = W + 300;
  const S = c => warm ? mixCol(c, '#FFB868', warm * .25) : c;
  boilSeed(key + 'sky');
  paint(rectPts(X0, -300, X1 - X0, h + 300), { wash: S('#BFDCEB'), ink: null });
  paint(rectPts(X0, h - 520, X1 - X0, 560), { wash: S('#FBE3C0'), ink: null });
  paint(ellPts(540, h - 300, 900, 300, 24), { fill: S('#FFEFD2'), fillOp: 200, bleed: .3, tex: .4, border: .2, ink: null });
  glow(820, h - 640, 300, '#FFE2A0', .4 + .3 * warm);
  for (let i = 0; i < 4; i++) cloudPuff(-100 + i * 360 + Math.sin(t * .2 + i) * 20, h - 820 + 80 * hash(i * 3.1), 90 + 40 * hash(i), key + 'cl' + i, '#FFF8EE', 220);
  // the city: domes and spires behind the wall
  boilSeed(key + 'city');
  for (let i = 0; i < 8; i++) {
    const cx = -180 + i * 205 + 40 * hash(i * 1.9), ch = 170 + 140 * hash(i * 4.3), cw = 90 + 50 * hash(i * 2.2), top = h - 230 - ch;
    paint([[cx - cw / 2, h - 200], [cx - cw / 2, top], [cx + cw / 2, top], [cx + cw / 2, h - 200]], { wash: S(AM.wallLt), fill: S(AM.wall), fillOp: 60, tex: .4, ink: AM.ink, sw: .7 });
    paint([[cx - cw * .55, top], [cx - cw * .4, top - cw * .45], [cx, top - cw * .8], [cx + cw * .4, top - cw * .45], [cx + cw * .55, top]], { wash: S(i % 3 ? AM.dome : '#F2B05A'), ink: AM.ink, sw: .7, curv: .5 });
    inkLine([[cx, top - cw * .8], [cx, top - cw * .8 - 50]], 1.2, AM.ink, 'inkfine', 0);
    paint([[cx, top - cw * .8 - 50], [cx + 34 + Math.sin(t * 5 + i) * 5, top - cw * .8 - 40], [cx, top - cw * .8 - 28]], { wash: AM.flag, ink: AM.ink, sw: .5, curv: .3 });
    for (let r = 0; r < 2; r++) paint(rrPts(cx - 10, top + 30 + r * 60, 20, 34, 10), { wash: S('#A86A3A'), ink: null });
  }
  // the wall with its battlements, towers and the great gate, torans along the top
  boilSeed(key + 'wall');
  paint(rectPts(X0, h - 230, X1 - X0, 240), { wash: S(AM.wall), fill: S(AM.wallDk), fillOp: 45, tex: .5, ink: null });
  inkLine([[X0 + 100, h - 230], [X1 - 100, h - 230]], 1, AM.ink, 'ink', 0);
  for (let i = 0; i < 26; i++) paint(rectPts(X0 + 110 + i * 62, h - 262, 34, 34), { wash: S(AM.wall), ink: AM.ink, sw: .6 });
  boilSeed(key + 'gate');
  const gx = o.gateX ?? 540;
  for (const s of [-1, 1]) {   // two towers flanking the gate
    const tx = gx + s * 190;
    paint(rectPts(tx - 70, h - 420, 140, 420), { wash: S(AM.wallLt), fill: S(AM.wall), fillOp: 60, tex: .4, ink: AM.ink, sw: .9 });
    paint([[tx - 86, h - 420], [tx - 60, h - 500], [tx, h - 560], [tx + 60, h - 500], [tx + 86, h - 420]], { wash: S(AM.roof), fill: S(AM.roofDk), fillOp: 50, tex: .4, ink: AM.ink, sw: .9, curv: .4 });
    inkLine([[tx, h - 560], [tx, h - 640]], 1.4, AM.ink, 'inkfine', 0);
    paint([[tx, h - 640], [tx + s * 52 + Math.sin(t * 5 + s) * 6, h - 626], [tx, h - 608]], { wash: AM.flag, ink: AM.ink, sw: .6, curv: .3 });
    paint(rrPts(tx - 18, h - 360, 36, 60, 18), { wash: S('#A86A3A'), ink: AM.ink, sw: .5 });
  }
  paint([[gx - 120, h], [gx - 120, h - 210], [gx - 80, h - 290], [gx, h - 330], [gx + 80, h - 290], [gx + 120, h - 210], [gx + 120, h]], { wash: S(AM.wallLt), ink: AM.ink, sw: 1, curv: .3 });
  paint([[gx - 80, h], [gx - 80, h - 180], [gx - 50, h - 240], [gx, h - 262], [gx + 50, h - 240], [gx + 80, h - 180], [gx + 80, h]], { wash: S('#8A4E2A'), fill: '#6A3A1E', fillOp: 50, tex: .4, ink: AM.ink, sw: .9, curv: .4 });
  toran(gx - 110, gx + 110, h - 230, 30, key + 'tg');
  for (let i = 0; i < 5; i++) { const a = X0 + 120 + i * 360; if (Math.abs(a + 180 - gx) > 300) toran(a, a + 340, h - 228, 34, key + 'tw' + i); }
  // the Saryu, a band at the wall's foot, then the meadow
  boilSeed(key + 'river');
  paint(rectPts(X0, h, X1 - X0, 70), { wash: S(AM.river), ink: null });
  for (let i = 0; i < 7; i++) { const rx = -100 + i * 200 + ((t * 30) % 200); inkLine([[rx, h + 30 + (i % 2) * 18], [rx + 60, h + 30 + (i % 2) * 18]], 1.2, '#E8F6FA', 'inkfine', 0); }
  boilSeed(key + 'meadow');
  paint(rectPts(X0, h + 60, X1 - X0, 1900), { wash: S(AM.meadow), ink: null });
  paint(ellPts(540, h + 700, 1000, 380, 24), { fill: S(AM.meadowLt), fillOp: 120, bleed: .3, tex: .5, ink: null });
  inkLine([[X0 + 100, h + 62], [X1 - 100, h + 62]], .9, AM.ink, 'ink', .3);
  if (o.path !== false) paint([[gx - 60, h + 62], [gx + 60, h + 62], [gx + 260, h + 1200], [gx - 260, h + 1200]], { wash: S(AM.path), washOp: 200, ink: null });
  boilSeed(key + 'tufts');
  for (let i = 0; i < 18; i++) { const tx = -100 + hash(i * 3.3) * 1300, ty = h + 120 + hash(i * 7.7) * 900; inkLine([[tx - 8, ty], [tx - 3, ty - 14], [tx, ty], [tx + 4, ty - 12], [tx + 8, ty]], .8, AM.meadowDk, 'inkfine', .2); }
}

// ---------- the people of Ayodhya ----------
// colourways per kind (o.v picks one)
const FOLK = {
  dadi: [{ saree: '#F4ECDC', sareeDk: '#D8CCB4', sareeLt: '#FFFAF0', blouse: '#9E2A44', blouseDk: '#6E1A30', hair: '#C8C2C8', hairLt: '#ECE8EE', veil: '#F4ECDC', veilDk: '#D2C4AA', gold: '#C8323A', goldDk: '#962338', skin: '#E8B48A', skinDk: '#C68E66', skinLt: '#F8D2B0', sindoor: '#E8B48A' }],
  mother: [
    { saree: '#2E8A7A', sareeDk: '#1E5E54', sareeLt: '#5EB8A8', blouse: '#E8742A', blouseDk: '#B8501A', veil: '#F2C230', veilDk: '#C8962A', skin: '#E8AE84', skinDk: '#C6885E', skinLt: '#FAD0AE' },
    { saree: '#D9467C', sareeDk: '#A82E5C', sareeLt: '#F28AB0', blouse: '#2E5E9E', blouseDk: '#1E3E6E', veil: '#F39A2E', veilDk: '#C8701E', skin: '#D89A70', skinDk: '#B87A50', skinLt: '#F0BE96' },
    { saree: '#6E3E9E', sareeDk: '#4E2A78', sareeLt: '#9A6AC8', blouse: '#E2A12A', blouseDk: '#B8781A', veil: '#E2507A', veilDk: '#B8305A', skin: '#F0BE98', skinDk: '#D29470', skinLt: '#FFE0C8' },
  ],
  queen: [
    { saree: '#F4ECDC', sareeDk: '#D8CCB4', sareeLt: '#FFFAF0', blouse: '#C8323A', blouseDk: '#962338', hair: '#8E8A96', hairLt: '#C8C4CE', skin: '#F2C29E', skinDk: '#D69A74', skinLt: '#FFE2C8' },
    { saree: '#E8862E', sareeDk: '#B85E18', sareeLt: '#FFB870', blouse: '#2E7A5A', blouseDk: '#1E5A3E', hair: '#5E5A66', hairLt: '#8E8A96' },
  ],
  man: [
    { skin: '#D89A6E', skinDk: '#B47A4E', skinLt: '#F0BC90', dhoti: '#F4ECDC', dhotiDk: '#D8CCB4', dhotiLt: '#FFFAF0', border: '#C8323A', shawl: '#2E8A7A', shawlDk: '#1E5E54', turban: '#E8742A', turbanDk: '#B8501A' },
    { skin: '#C08458', skinDk: '#9A643A', skinLt: '#DCA478', dhoti: '#F2D27A', dhotiDk: '#C8A24A', dhotiLt: '#FFE8A8', border: '#2E5E9E', shawl: '#C8323A', shawlDk: '#962338', turban: '#F4ECDC', turbanDk: '#D2C4AA' },
    { skin: '#E8B48A', skinDk: '#C68E66', skinLt: '#F8D2B0', dhoti: '#F4ECDC', dhotiDk: '#D8CCB4', dhotiLt: '#FFFAF0', border: '#6E3E9E', shawl: '#E2A12A', shawlDk: '#B8781A', turban: '#C8323A', turbanDk: '#962338' },
  ],
  elder: [{ skin: '#D8A27A', skinDk: '#B47E56', skinLt: '#F0C29E', dhoti: '#F4ECDC', dhotiDk: '#D8CCB4', dhotiLt: '#FFFAF0', border: '#C8962A', shawl: '#9E7A4A', shawlDk: '#7A5A30', hair: '#F2ECE2', hairLt: '#FFFFFF', turban: '#F4ECDC', turbanDk: '#D2C4AA' }],
  boy: [
    { skin: '#D89A6E', skinDk: '#B47A4E', skinLt: '#F0BC90', teal: '#2FA8B8', tealDk: '#1E7684', tealLt: '#7FD4DE', sash: '#F2C230', sashDk: '#C8962A' },
    { skin: '#E8B48A', skinDk: '#C68E66', skinLt: '#F8D2B0', teal: '#E8742A', tealDk: '#B8501A', tealLt: '#FFB870', sash: '#C8323A', sashDk: '#962338' },
  ],
  girl: [
    { skin: '#E8AE84', skinDk: '#C6885E', skinLt: '#FAD0AE', teal: '#E2507A', tealDk: '#B8305A', tealLt: '#F28AB0', sash: '#F2C230', sashDk: '#C8962A' },
    { skin: '#D8986C', skinDk: '#B47A4E', skinLt: '#F0BA90', teal: '#F2C230', tealDk: '#C8962A', tealLt: '#FFE08A', sash: '#2E8A7A', sashDk: '#1E5E54' },
  ],
};
// a wrapped turban in narada()'s head space (head centre (0, -20.6), 3.2 × 3.05)
function turbanHat(C) {
  return (u, sw) => {
    const P = pts => U(pts, u);
    paint(P([[-3.35, -21.2], [-3.5, -22.6], [-2.9, -24.0], [-1.6, -24.9], [0, -25.2], [1.6, -24.9], [2.9, -24.0], [3.5, -22.6], [3.35, -21.2], [0, -21.9]]), { wash: C.turban, fill: C.turbanDk, fillOp: 50, tex: .4, ink: C.ink || AM.ink, sw: sw * .8, curv: .4 });
    for (const k of [0, 1]) inkLine(P([[-3.3, -21.9 - k * 1.1], [-1, -23.2 - k * .9], [2.2, -24.2 - k * .3]]), sw * .5, C.turbanDk, 'inkfine', .5);
    paint(P([[2.2, -23.2], [3.2, -23.9], [3.7, -23.1], [3.3, -22.3]]), { wash: C.turbanDk, ink: C.ink || AM.ink, sw: sw * .5, curv: .5 });
  };
}
function folk(x, y, u, kind, o = {}) {
  const list = FOLK[kind] || FOLK.man, C = { ...list[(o.v ?? 0) % list.length] };
  const q = { ...o }; delete q.v;
  if (kind === 'dadi' || kind === 'mother') {
    const pal = { ...C, ink: '#4A2530' }, skin = { col: C.skin, dk: C.skinDk, lt: C.skinLt };
    return parvati(x, y, u * 29 / 25.5 * (kind === 'dadi' ? .9 : .94), { crown: false, veil: 1, ...skin, ...q, pal });
  }
  if (kind === 'queen') return parvati(x, y, u * 29 / 25.5 * .95, { veil: o.veil ?? 0, col: C.skin || '#F2C29E', dk: C.skinDk || '#D69A74', lt: C.skinLt || '#FFE2C8', ...q, pal: { ...C, ink: '#4A2530' } });
  if (kind === 'boy' || kind === 'girl') return kartikeya(x, y, u * (o.small ?? .82), { spear: false, shield: false, feather: false, girl: kind === 'girl' ? 1 : 0, col: C.skin, dk: C.skinDk, lt: C.skinLt, ...q, pal: C });
  const pal = { ...C, ink: '#2B2233' };
  return ram(x, y, u, { crown: false, kodanda: false, beard: kind === 'elder' ? '#F4F0E8' : undefined, mala: false, hat: turbanHat(pal), ...q, pal });
}
// the back rows: a body and a head with an odhni or a turban, arms up when they cheer (o.cheer 0..1), a bob
function farFolk(x, y, s, i, o = {}) {
  const r = hash(i * 7.31), kind = r < .45 ? 'w' : r < .85 ? 'm' : 'k', sc = kind === 'k' ? .72 : 1, bob = (o.bob ?? 0) * Math.sin(T * 6 + i * 1.7) * s * .25;
  const cols = ['#2E8A7A', '#D9467C', '#E8742A', '#6E3E9E', '#F2C230', '#C8323A', '#2E5E9E', '#F4ECDC'], c1 = cols[(i * 3) % 8], c2 = cols[(i * 5 + 2) % 8];
  const skin = ['#E8B48A', '#D89A6E', '#C08458', '#F0BE98'][i % 4], h = s * sc, yy = y + bob;
  boilSeed('ff' + (o.key || '') + i);
  const cheer = o.cheer ?? 0;
  if (cheer > .05) for (const d of [-1, 1]) paint(ribbon([[x + d * h * .5, yy - h * 2.3], [x + d * h * (.7 + .2 * cheer), yy - h * (2.3 + 1.3 * cheer)]], h * .3, h * .22), { wash: skin, ink: AM.ink, sw: .4 });
  paint([[x - h * .8, yy], [x - h * .62, yy - h * 2.5], [x, yy - h * 2.8], [x + h * .62, yy - h * 2.5], [x + h * .8, yy]], { wash: c1, ink: AM.ink, sw: .6, curv: .4 });
  paint(ellPts(x, yy - h * 3.4, h * .62, h * .66, 12), { wash: skin, ink: AM.ink, sw: .6 });
  if (kind === 'w') paint([[x - h * .78, yy - h * 2.6], [x - h * .75, yy - h * 3.8], [x, yy - h * 4.25], [x + h * .75, yy - h * 3.8], [x + h * .78, yy - h * 2.6], [x + h * .5, yy - h * 3.4], [x - h * .5, yy - h * 3.4]], { wash: c2, ink: AM.ink, sw: .5, curv: .4 });
  else if (kind === 'm') paint(ellPts(x, yy - h * 3.85, h * .66, h * .34, 10), { wash: c2, ink: AM.ink, sw: .5 });
  else paint(ellPts(x, yy - h * 3.95, h * .3, h * .26, 8), { wash: '#2E2436', ink: null });
  if (h > 9) for (const d of [-1, 1]) paint(ellPts(x + d * h * .22, yy - h * 3.4, h * .08, h * .11, 6), { wash: AM.ink, ink: null });
}
// a far Ram: his light, a yellow dhoti, a maroon shawl, blue arms and face, the gold kirita
function miniRam(x, y, s, o = {}) {
  const k = o.k ?? 1; if (k <= .01) return;
  const h = s * (.4 + .6 * backOut(clamp(k))), bob = Math.sin(T * 5 + (o.i ?? 0)) * h * .08;
  boilSeed('mr' + (o.key || '') + (o.i ?? 0));
  glow(x, y - h * 2.6, h * 4, '#FFE08A', .45 * k);
  const yy = y + bob, arms = o.arms ?? .3;
  for (const d of [-1, 1]) paint(ribbon([[x + d * h * .5, yy - h * 2.3], [x + d * h * (.9 + .4 * arms), yy - h * (1.7 + 1.5 * arms)]], h * .32, h * .24), { wash: RAM.skin, ink: AM.ink, sw: .4 });
  paint([[x - h * .75, yy], [x - h * .6, yy - h * 1.3], [x + h * .6, yy - h * 1.3], [x + h * .75, yy]], { wash: RAM.dhoti, ink: AM.ink, sw: .6 });
  paint([[x - h * .6, yy - h * 1.3], [x - h * .62, yy - h * 2.5], [x + h * .62, yy - h * 2.5], [x + h * .6, yy - h * 1.3]], { wash: RAM.skin, ink: AM.ink, sw: .6 });
  paint([[x - h * .62, yy - h * 2.5], [x - h * .3, yy - h * 2.5], [x + h * .6, yy - h * 1.6], [x + h * .6, yy - h * 1.3]], { wash: RAM.shawl, ink: null });
  paint(ellPts(x, yy - h * 3.1, h * .6, h * .6, 12), { wash: RAM.skin, ink: AM.ink, sw: .6 });
  paint([[x - h * .55, yy - h * 3.4], [x - h * .45, yy - h * 4.2], [x, yy - h * 4.8], [x + h * .45, yy - h * 4.2], [x + h * .55, yy - h * 3.4]], { wash: RAM.gold, ink: AM.ink, sw: .5, curv: .3 });
}

// ---------- Tulsidas ----------
const TULSI_PAL = { dhoti: '#F4ECDC', dhotiDk: '#D8CCB4', dhotiLt: '#FFFAF0', border: '#E8742A', shawl: '#E8862E', shawlDk: '#B85E18' };
function tulsidas(x, y, u, o = {}) { return valmiki(x, y, u, { ...o, pal: { ...TULSI_PAL, ...(o.pal || {}) } }); }

// ---------- sorrow clouds, petals ----------
function rainCloud(x, y, s, k = 0, key = 'rc') {
  boilSeed(key);
  if (k < .5) {
    const sq = 1 + .25 * Math.sin(clamp(k * 2) * Math.PI), a = 1 - clamp(k * 2) * .3;
    for (let i = 0; i < 4; i++) { const dy = frac(T * 1.6 + i * .27) * s * 1.1; inkLine([[x - s * .5 + i * s * .33, y + s * .2 + dy], [x - s * .54 + i * s * .33, y + s * .38 + dy]], 1.3, '#7EA6C8', 'inkfine', 0); }
    paint([[x - s * sq, y], [x - s * .85 * sq, y - s * .42], [x - s * .4 * sq, y - s * .62], [x, y - s * .85 * sq], [x + s * .45 * sq, y - s * .62], [x + s * .9 * sq, y - s * .36], [x + s * sq, y], [x + s * .7 * sq, y + s * .22], [x - s * .7 * sq, y + s * .22]],
      { wash: AM.rain, washOp: 255 * a, fill: AM.rainDk, fillOp: 50, tex: .4, ink: AM.ink, sw: .8, curv: .6 });
  } else {   // POP: a ring of petals bursting out and falling
    const p = (k - .5) * 2;
    for (let i = 0; i < 9; i++) {
      const a = i / 9 * TAU + .3, r = s * (.3 + 1.3 * easeOut(p)), px = x + Math.cos(a) * r, py = y + Math.sin(a) * r * .7 + p * p * s * .9, rr = T * 3 + i;
      paint([[px + Math.cos(rr) * s * .14, py + Math.sin(rr) * s * .14], [px - Math.cos(rr) * s * .14, py - Math.sin(rr) * s * .14], [px + Math.cos(rr + 1.6) * s * .07, py + Math.sin(rr + 1.6) * s * .07]], { wash: i % 3 ? AM.marigold : AM.rose, washOp: 255 * (1 - clamp((p - .6) / .4)), ink: null, curv: .5 });
    }
    if (p < .4) glow(x, y, s * 1.6, '#FFE6A8', .5 * (1 - p / .4));
  }
}
function amPetals(t, key = 'pt', n = 14, o = {}) {
  boilSeed(key);
  const k = o.k ?? 1;
  for (let i = 0; i < Math.round(n * k); i++) {
    const x = (o.x0 ?? 40) + hash(i * 3.3) * (o.w ?? 1000) + 30 * Math.sin(t * .9 + i), y = (o.y0 ?? -100) + frac(hash(i * 7.1) + t * (.06 + .04 * hash(i))) * (o.h ?? 2100), r = t * .8 + i, s = o.s ?? 14;
    paint([[x + Math.cos(r) * s, y + Math.sin(r) * s], [x + Math.cos(r + 1.6) * s * .5, y + Math.sin(r + 1.6) * s * .5], [x - Math.cos(r) * s, y - Math.sin(r) * s], [x + Math.cos(r - 1.6) * s * .5, y + Math.sin(r - 1.6) * s * .5]],
      { wash: i % 3 === 0 ? AM.rose : i % 2 ? AM.marigold : AM.marigoldLt, washOp: 235, ink: null, curv: .5 });
  }
}

// ---------- the card: follow both ----------
// C: { voice, voiceName, at } (at: absolute times head, a, b, ask)
function followBoth(t, lt, C) {
  boilSeed('fbbg');
  paint(rectPts(-60, -60, W + 120, H + 120), { wash: RMY.maroon, ink: null });
  paint(ellPts(540, 980, 820, 820, 36), { fill: RMY.saffron, fillOp: 150, bleed: .3, tex: .4, border: .3, ink: null });
  glow(540, 980, 600, '#FFB060', .35);
  boilSeed('fbrays');
  for (let i = 0; i < 14; i++) { const a = i / 14 * TAU + t * .08, r0 = 360, r1 = 1100; paint([[540 + Math.cos(a - .05) * r0, 980 + Math.sin(a - .05) * r0], [540 + Math.cos(a) * r1, 980 + Math.sin(a) * r1], [540 + Math.cos(a + .05) * r0, 980 + Math.sin(a + .05) * r0]], { wash: RMY.ray, washOp: 45, ink: null }); }
  const A = C.at, pk = d => Math.max(0, t - d) * 4, X = 470;
  if (t > A.head) letter('Follow both', X, 560, 96, RMY.gold, { screen: true, font: '96px Marcellus', stroke: RMY.maroonDk, sw: .14, ink: false, pop: pk(A.head), maxW: 820 });
  const pill = (y, label, handle, name, d) => {
    if (t < d) return;
    letter(label, X, y - 96, 40, RMY.cream, { screen: true, font: '500 40px Poppins', ink: false, pop: pk(d), maxW: 800 });
    const k = backOut(clamp(pk(d + .1))) * (1 + .025 * pulse(t, 4));
    boilSeed('fbpill' + y); push(); translate(X, y); scale(k); paint(rrPts(-340, -58, 680, 116, 58), { wash: RMY.orange, ink: null }); pop();
    letter(handle, X, y + 3, 56, RMY.cream, { screen: true, font: '700 56px Poppins', ink: false, pop: pk(d + .1), maxW: 620 });
    if (name) letter(name, X, y + 98, 38, RMY.goldLt, { screen: true, font: '500 38px Poppins', ink: false, pop: pk(d + .25), maxW: 800 });
  };
  pill(820, 'Voice', C.voice, C.voiceName, A.a);
  pill(1120, 'Art & animation', '@therishikatha', null, A.b);
  if (t > A.ask) letter('Comment JAI SHRI RAM', X, 1330, 64, RMY.gold, { screen: true, stroke: RMY.maroonDk, sw: .2, ink: false, pop: pk(A.ask), maxW: 820 });
}

// ---------- the model sheet: ?loop=amit ----------
LOOPS.amit = t => {
  dawnSky(t, 'ms', { drift: 60 });
  pushpak(540, 520, 22, { part: 'back' });
  const ru = 22 * .42;
  hanuman(540 - 6 * 22, 520, ru, { mouth: 'grin', gada: 0 });
  parvati(540 - 2.6 * 22, 520, ru * 29 / 25.5 * .95, { pal: SITA_PAL, ...SITA_SKIN, mouth: 'smile' });
  ram(540 + .6 * 22, 520, ru, { mouth: 'smile', pray: 1, kodanda: false });
  lakshman(540 + 4.4 * 22, 520, ru, { eyes: 'happy', mouth: 'grin' });
  pushpak(540, 520, 22, { part: 'front' });
  boilSeed('msground'); paint(rectPts(-40, 1000, W + 80, 1000), { wash: AM.meadow, ink: null });
  folk(120, 1380, 11, 'dadi'); folk(300, 1380, 11, 'mother', { v: 1, mouth: 'smile' }); folk(480, 1380, 11, 'man', { mouth: 'grin' });
  folk(660, 1380, 11, 'elder', { mouth: 'smile' }); folk(820, 1380, 11, 'boy', { mouth: 'O' }); folk(960, 1380, 11, 'girl', { v: 1, mouth: 'smile' });
  tulsidas(160, 1880, 13, { leaf: 1, eyes: 'closed', mouth: 'smile' });
  for (let i = 0; i < 6; i++) farFolk(380 + i * 50, 1800, 16, i, { cheer: i % 2 });
  miniRam(760, 1800, 16, { i: 1 }); rainCloud(900, 1600, 70, 0, 'rcA'); rainCloud(980, 1760, 70, .7, 'rcB');
  folk(620, 1880, 11, 'queen', { mouth: 'smile' });
};
LOOPS.amit.len = 2;
