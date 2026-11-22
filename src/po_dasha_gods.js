// po_dasha_gods.js: the Dashavatar book's gods, facing us, in the Pothi style with a Pichwai/Tanjore richness (needs
// pothi.js and po_dashavatar.js). Every frontal figure is drawn about its navel at (0, 0), y down: the soles near y 620,
// the crown's tip near y -600 (an adult about 1100 tall with the crown); place it with a transform (fig() in the scenes
// puts the soles on a point: translate(0, -620)). Light from the top left.
//   PDX: the book's richer palette (Vishnu's cloud blue, Tanjore gold, the pitambar, Brahma's gold-red, Indra, Shiva).
//   pfHead(c, o): a frontal head about (0, 0) (face -58..62). o.sk, o.eye 'half' | 'closed' | 'open' | 'sad',
//     o.mouth 'smile' | 'calm' | 'sad', o.tilak 'u' | 'tri' | 'dot', o.beard 'white' (Brahma), o.hair 'vishnu' | 'none'
//   pfKirita(c), pfIndraCrown(c), pfJataMukut(c, o): crowns over a pfHead (same frame)
//   pfHand(c, x, y, a, sk, kind, o): a frontal hand, the wrist at (x, y), the fingers along angle a (0 = up):
//     'palm' (abhaya: palm to us, fingers up), 'fist' (gripping, knuckles to us), 'join' (namaste, palms pressed),
//     'down' (varada: palm to us, fingers down), 'cup' (palm up, holding)
//   pfArm(c, P, sk, o): a two-segment arm through P = [shoulder, elbow, wrist] with an armlet and bangles
//   pdVishnuStand(c, o): Vishnu on a lotus, four arms: chakra, shankha, gada, padma. o.eye, o.mouth, o.halo (0..1),
//     o.lower: 'gada' (the lower left on the gada: default) ; o.bless: the lower right in abhaya instead of the lotus
//   pdBrahma(c, o): four-faced Brahma (three faces seen), gold-red, white beard, four arms (the Vedas, the mala, the
//     kamandalu, the sruva); o.pose 'seat' (padmasana) | 'pray' (hands joined, eyes closed) | 'bless' (bending, a hand
//     down to the Earth-cow)
//   pdShivaStand(c, o): Shiva, camphor-white, blue throat, jata with the moon and Ganga, tiger skin; o.pose 'pray'
//   pdIndra(c, o): Indra, gold crown, vajra at his sash; o.pose 'pray'
//   pdLotusSeat(c, x, y, w, o): a frontal lotus pedestal (rows of petals), its top at y
//   pdHalo(c, x, y, r, o): a Tanjore prabha: a glowing disc, a gold ring, a flame-petal rim
const PDX = {
  vishnu: { base: '#5C6EA6', lt: '#8494C6', dk: '#3A4676', far: '#4E5E92' },
  gold: { base: '#D9AE4C', lt: '#F7DC8A', dk: '#956C22' },
  pita: { base: '#DDA93A', lt: '#F4CF68', dk: '#A47424' },
  maroon: { base: '#962E36', lt: '#BC4A4E', dk: '#621820' },
  brahma: { base: '#C98A58', lt: '#E4AE7E', dk: '#94603A', far: '#B07848' },
  indra: { base: '#D6A878', lt: '#EEC89C', dk: '#A4784C', far: '#C0946A' },
  shiva: { base: '#C6CBD8', lt: '#E4E7EF', dk: '#8E94AC', far: '#AEB4C6' },
  lakshmi: { base: '#E0AE84', lt: '#F4CCA4', dk: '#AC7A52', far: '#CC9A70' },
  sari: { base: '#B42A3A', lt: '#D84E58', dk: '#781826' },
  indigo: { base: '#1E2452', lt: '#323A72', dk: '#121634', deep: '#0C0F26' },
  emerald: '#2A7A5E', ruby: '#B8202E', pearl: '#F4EEE0', ink: 'rgba(22,16,24,.92)'
};
// the legs are drawn at 560 long and squashed by PF_LEG: the soles at PF_SOLE (a stockier, Tanjore build)
const PF_LEG = .84, PF_SOLE = 512, PF_HEAD = [-430, 1.32];
const pfMir = P => P.map(([x, y, k]) => k ? [-x, y, k] : [-x, y]);
// a symmetric shape from one side (top on the midline .. bottom on the midline)
const pfSym = side => [...side, ...pfMir(side).reverse().slice(1, -1)];
const pfSh = (pal, w = 40, o = {}) => ({ sh: [[w * .14, w * .08, w * .16, rgba(pal.dk, o.sa ?? .85)]], hi: [-w * .1, -w * .08, w * .12, rgba(pal.lt, o.ha ?? .7)], ...o });
function dhGem(c, x, y, r, col) { pdGem(c, x, y, r, col); }
// Tanjore gold: a raised band with a row of pearls or gems along it
function pfGoldBand(c, P, w, o = {}) {
  poBorder(c, P, w, PDX.gold);
  if (o.pearls) poDots(c, P, w * .28, w * .9, PDX.pearl, false);
  if (o.gems) poAlong(P, o.gems).forEach(([x, y], i) => pdGem(c, x, y, w * .26, i % 2 ? PDX.emerald : PDX.ruby));
}

// ---------- the head, facing us ----------
const PF_FACE = [[0, -58, 1], [22, -56], [38, -44], [45, -22], [46, 0], [42, 22], [35, 40], [24, 53], [12, 60], [0, 62, 1]];
function pfHead(c, o = {}) {
  const sk = o.sk || PDX.vishnu, G = PDX.gold, e = o.eye || 'half', ink = PDX.ink;
  // hair behind the face, falling to the shoulders in locks (Vishnu, Indra) or none (under a jata)
  const hc = o.hairCol || PO.hair;
  if (o.hair !== 'none') {
    poFill(c, [[0, -70, 1], [-40, -64], [-58, -34], [-62, 10], [-70, 60], [-84, 110], [-60, 118], [-50, 70], [-44, 30], [44, 30], [50, 70], [60, 118], [84, 110], [70, 60], [62, 10], [58, -34], [40, -64]], hc, { hi: [0, -4, 6, 'rgba(120,110,130,.35)'] });
    for (const s of [-1, 1]) for (let i = 0; i < 3; i++) poFill(c, poLimb([[s * (54 + i * 6), 40], [s * (64 + i * 8), 80], [s * (60 + i * 10), 120 + i * 6]], [12, 10, 4]), hc, { hi: [-2, -2, 3, 'rgba(120,110,130,.35)'] });
  }
  // the neck
  poFill(c, pfSym([[0, 40, 1], [24, 40], [26, 80], [32, 104], [0, 104, 1]]), sk.base, { sh: [[0, 10, 10, rgba(sk.dk, .85)], [10, 0, 8, rgba(sk.dk, .5)], [-10, 0, 8, rgba(sk.dk, .5)]] });
  // ears
  for (const s of [-1, 1]) poFill(c, [[s * 42, -12], [s * 54, -12], [s * 56, 8], [s * 50, 22], [s * 43, 20]], sk.base, { sh: [s * 3, 2, 3, rgba(sk.dk, .8)] });
  // the face
  poFill(c, pfSym(PF_FACE), sk.base, { sh: [[-12, 4, 14, rgba(sk.dk, .62)], [12, 4, 14, rgba(sk.dk, .42)], [0, 10, 7, rgba(sk.dk, .32)]], hi: [0, -8, 12, rgba(sk.lt, .55)] });
  if (o.blush) for (const s of [-1, 1]) ellipse(c, s * 24, 24, 10, 6, rgba('#D06A78', .16));
  // brows: long and arched (lotus-eyed), drawn down at the middle when sad
  const sad = e === 'sad' || o.mouth === 'sad';
  for (const s of [-1, 1]) poLine(c, [[s * 6, -18 + (sad ? -3 : 0)], [s * 18, -23], [s * 32, -22], [s * 40, -16]], 'rgba(26,18,22,.8)', 2.4);
  // the eyes: long almond lotus eyes reaching toward the temples
  for (const s of [-1, 1]) {
    const x = s * 20, top = e === 'open' ? -6.5 : -4, bot = 3.2;
    const P = [[x - s * 15, -.5], [x - s * 6, top], [x + s * 6, top - .4], [x + s * 18, -2.5], [x + s * 8, bot], [x - s * 6, bot]];
    if (e === 'closed') {
      poLine(c, [[x - s * 15, 0], [x - s * 5, 3.4], [x + s * 6, 3.4], [x + s * 18, -1]], ink, 2.2);
      for (let k = 0; k < 4; k++) poLine(c, [[x - s * 6 + s * k * 5, 3.8], [x - s * 7 + s * k * 5, 6.4]], 'rgba(22,16,24,.6)', 1);
      continue;
    }
    const eye = poPath(P);
    c.save(); c.fillStyle = '#F1E9DC'; c.fill(eye); c.clip(eye);
    const iy = e === 'half' ? 1 : e === 'sad' ? 1.4 : -.6;
    const px = x - s * .4 + (o.look || 0) * 4;
    ellipse(c, px, iy, 4.6, 4.6, '#2A2026'); ellipse(c, px, iy, 2.4, 2.4, '#100C10');
    ellipse(c, px - 1.6, iy - 1.6, 1.1, 1.1, 'rgba(255,255,255,.85)');
    if (e === 'half' || e === 'sad') { c.fillStyle = rgba(sk.dk, .9); c.fill(poPath([[x - s * 16, -8], [x + s * 19, -8], [x + s * 19, -2.6], [x + s * 6, -2.6], [x - s * 6, -2.4], [x - s * 16, -1.8]])); }
    c.restore();
    // the upper lid, a kajal line winged to the temple; the lower lid faint
    const ly = e === 'half' || e === 'sad' ? -2.6 : top - .3;
    poLine(c, [[x - s * 15, -.4], [x - s * 6, ly], [x + s * 6, ly - .2], [x + s * 18, -2.5], [x + s * 24, -5.5]], ink, 2.4);
    poLine(c, [[x - s * 12, 1.8], [x - s * 4, bot + .3], [x + s * 8, bot + .2], [x + s * 17, -1.2]], 'rgba(22,16,24,.38)', 1.1);
    if (e === 'sad') ellipse(c, x + s * 10, 8, 1.8, 2.6, 'rgba(220,236,250,.9)');
    if (e === 'half') poLine(c, [[x - s * 9, -7.5], [x + s * 9, -8]], rgba(sk.dk, .45), 1.2);
  }
  // the nose: a soft shade down one side, the nostrils, a light on the tip
  c.save(); c.filter = `blur(${Math.max(.5, 2 * pdK(c))}px)`; poLine(c, [[4, -12], [6, 10], [8, 22]], rgba(sk.dk, .6), 3.2); c.restore();
  poLine(c, [[-7, 26], [-3, 28.5], [0, 28]], 'rgba(40,24,30,.55)', 1.4); poLine(c, [[7, 26], [3, 28.5], [0, 28]], 'rgba(40,24,30,.55)', 1.4);
  ellipse(c, 1, 21, 3, 2, rgba(sk.lt, .5));
  // the mouth
  const m = o.mouth || 'smile', up = m === 'smile' ? 1.6 : m === 'sad' ? -1.6 : 0, lip = o.lip || '#7A3A4C';
  if (o.beard !== 'white') {
    poFill(c, [[0, 38.5], [-5, 37], [-12.5, 40 - up], [-6, 42], [0, 41.6], [6, 42], [12.5, 40 - up], [5, 37]], lip);
    poFill(c, [[-11, 41 - up * .5], [-5, 42.4], [0, 42], [5, 42.4], [11, 41 - up * .5], [6, 46.5], [0, 47.5], [-6, 46.5]], o.lip2 || '#8E4A5A');
    poLine(c, [[-13, 40 - up], [-5, 42], [0, 41.6], [5, 42], [13, 40 - up]], 'rgba(60,20,30,.7)', 1.2);
    if (m === 'smile') for (const s of [-1, 1]) poLine(c, [[s * 13, 40 - up], [s * 15.5, 37.4]], 'rgba(60,20,30,.45)', 1.1);
  }
  // the beard and moustache (Brahma): white, flowing to the chest
  if (o.beard === 'white') {
    const W = PD.white;
    poFill(c, pfSym([[0, 30, 1], [14, 30], [30, 24], [42, 8], [46, 30], [42, 60], [34, 96], [20, 130], [0, 150, 1]]), W.base,
      { sh: [[10, 8, 10, rgba(W.dk, .8)], [-10, 8, 10, rgba(W.dk, .6)]], hi: [0, -6, 6, rgba(W.lt, .9)], inside: () => { for (const x of [-26, -14, -2, 10, 22]) pdFold(c, [[x, 50], [x * .8, 100], [x * .4, 140]], 2, rgba(W.dk, .55), 1.5); } });
    poFill(c, [[0, 33], [-10, 31], [-24, 36], [-34, 46], [-22, 42], [-8, 38], [0, 39], [8, 38], [22, 42], [34, 46], [24, 36], [10, 31]], W.base, { sh: [0, 3, 3, rgba(W.dk, .8)] });
    poFill(c, [[-7, 40], [0, 39], [7, 40], [4, 45], [-4, 45]], '#9A5A64');
  }
  // tilak
  if (o.tilak === 'u') { for (const s of [-1, 1]) poLine(c, [[s * 4, -28], [s * 7, -50]], 'rgba(248,242,226,.95)', 3); poLine(c, [[0, -28], [0, -46]], PO.red, 2.6); }
  if (o.tilak === 'tri') for (const y of [-42, -36, -30]) poLine(c, [[-26, y + 1], [0, y - 1], [26, y + 1]], 'rgba(250,248,240,.95)', 2.4);
  if (o.tilak === 'dot') ellipse(c, 0, -30, 3.4, 3.4, PO.red);
  // hair over the brow, parted, framing the face
  if (o.hair !== 'none') poFill(c, [[0, -54, 1], [-20, -50], [-36, -40], [-44, -20], [-46, 0], [-50, -24], [-46, -50], [-26, -66], [0, -70, 1], [26, -66], [46, -50], [50, -24], [46, 0], [44, -20], [36, -40], [20, -50]], hc, { hi: [0, -3, 4, 'rgba(120,110,130,.35)'] });
}
// the earrings: makara kundalas (Vishnu), gold drops (others)
function pfEarrings(c, kind = 'makara') {
  const G = PDX.gold;
  for (const s of [-1, 1]) {
    c.save(); c.translate(s * 54, 28); c.scale(s * .68, .68);
    if (kind === 'makara') {
      poFill(c, [[-6, -10], [6, -14], [16, -6], [18, 10], [12, 26], [0, 34], [-8, 26], [-4, 14], [-10, 4]], G.base, { sh: [4, 4, 4, rgba(G.dk, .85)], hi: [-3, -3, 3, rgba(G.lt, .9)],
        inside: () => { poLine(c, [[2, -6], [10, 4], [8, 20]], rgba(G.dk, .7), 1.4); } });
      pdGem(c, 6, 8, 3.4, PDX.ruby); poDots(c, [[-6, 30], [2, 38], [10, 32]], 2.4, 5, PDX.pearl, false);
    } else {
      ellipse(c, 0, -2, 5, 5, G.base); poFill(c, [[-8, 4], [8, 4], [10, 20], [0, 28, 1], [-10, 20]], G.base, { sh: [3, 3, 3, rgba(G.dk, .85)] });
      poDots(c, [[-8, 24], [0, 30], [8, 24]], 2.2, 5, PDX.pearl, false);
    }
    c.restore();
  }
}
// Vishnu's kirita, facing us: a tall gold crown in tiers, lotus-petal plates, a big ruby, side flares, a finial
function pfKirita(c, o = {}) {
  const G = PDX.gold, gd = { sh: [[-10, 0, 10, rgba(G.dk, .75)], [8, 0, 8, rgba(G.dk, .35)]], hi: [0, -6, 8, rgba(G.lt, .85)] };
  // small gold rosettes at the temples where the crown meets the hair
  for (const sx of [-1, 1]) { c.save(); c.translate(sx * 46, -46); for (let k = 0; k < 6; k++) { c.save(); c.rotate(k / 6 * TAU); poFill(c, [[0, 0, 1], [-3.4, -5], [0, -10, 1], [3.4, -5]], G.base, { sh: [1, 1, 1.4, rgba(G.dk, .8)] }); c.restore(); } pdGem(c, 0, 0, 2.6, PDX.ruby); c.restore(); }
  // the crown: a tapering cylinder
  const body = pfSym([[0, -186, 1], [10, -184], [24, -150], [32, -120], [38, -96], [44, -70], [48, -52, 1], [0, -50, 1]]);
  poFill(c, body, G.base, { ...gd, inside: () => {
    for (const [y, w] of [[-72, 46], [-98, 40], [-124, 33]]) { pfGoldBand(c, [[-w, y + 4], [0, y], [w, y + 4]], 6); }
    // rows of gem settings between the bands
    for (const [y, w, n] of [[-86, 38, 7], [-111, 32, 5], [-137, 24, 3]]) for (let i = 0; i < n; i++) { const x = -w + (i + .5) * 2 * w / n; pdGem(c, x, y, 2.6, i % 2 ? PDX.emerald : PDX.ruby); }
    // lotus-petal plates on the lowest tier
    for (let i = -2; i <= 2; i++) { const x = i * 19, h = 24 - Math.abs(i) * 3; poFill(c, [[x - 8, -54], [x - 7, -54 - h * .5], [x, -54 - h, 1], [x + 7, -54 - h * .5], [x + 8, -54]], G.lt, { alpha: .55 }); poLine(c, [[x - 5, -55], [x, -52 - h], [x + 5, -55]], rgba(G.dk, .5), 1.2); }
  } });
  // the finial: a gold bud with a pearl
  poFill(c, [[0, -214, 1], [8, -200], [10, -186], [-10, -186], [-8, -200]], G.base, gd);
  ellipse(c, 0, -218, 4, 4, PDX.pearl);
  // the brow band with the big ruby at the front
  pfGoldBand(c, [[-48, -50], [-24, -55], [0, -56], [24, -55], [48, -50]], 9, { pearls: true });
  c.save(); c.translate(0, -76);
  poFill(c, [[0, -26, 1], [16, -8], [12, 10], [0, 16, 1], [-12, 10], [-16, -8]], G.base, gd);
  pdGem(c, 0, -4, 7, PDX.ruby);
  c.restore();
}
// Indra's crown: lower and wider than the kirita, three tall points, emeralds
function pfIndraCrown(c) {
  const G = PDX.gold, gd = { sh: [-8, 0, 8, rgba(G.dk, .8)], hi: [0, -5, 6, rgba(G.lt, .85)] };
  poFill(c, pfSym([[0, -118, 1], [30, -112], [46, -92], [50, -56, 1], [0, -52, 1]]), G.base, { ...gd, inside: () => { pfGoldBand(c, [[-48, -80], [0, -86], [48, -80]], 6, { pearls: true }); } });
  for (const [x, h] of [[-30, 34], [0, 52], [30, 34]]) {
    poFill(c, [[x - 15, -96], [x - 10, -96 - h * .5], [x, -96 - h, 1], [x + 10, -96 - h * .5], [x + 15, -96]], G.base, gd);
    pdGem(c, x, -96 - h * .4, h > 40 ? 5 : 3.6, h > 40 ? PDX.emerald : PDX.ruby);
  }
  pfGoldBand(c, [[-50, -52], [0, -58], [50, -52]], 9, { gems: 22 });
  for (const s of [-1, 1]) poFill(c, [[s * 50, -60], [s * 66, -74], [s * 70, -54], [s * 56, -48]], G.base, gd);
}
// a jata-mukuta: the hair piled tall and bound in gold (Brahma's three heads; Shiva uses his own)
function pfJataMukut(c, o = {}) {
  const G = PDX.gold, hc = o.col || '#C79A44';
  poFill(c, pfSym([[0, -150, 1], [20, -146], [34, -124], [38, -94], [44, -62], [48, -48, 1], [0, -50, 1]]), hc, { hi: [-6, -4, 6, 'rgba(140,120,110,.45)'],
    inside: () => { for (let y = -140; y < -56; y += 11) poLine(c, [[-44, y + 6], [0, y], [44, y + 6]], 'rgba(120,84,30,.45)', 2); } });
  for (const y of [-64, -96, -126]) pfGoldBand(c, [[-40 + (y + 64) * -.2, y + 3], [0, y], [40 + (y + 64) * .2, y + 3]], 7);
  pdGem(c, 0, -82, 4.4, PDX.ruby); pdGem(c, 0, -112, 3.6, PDX.emerald);
  poFill(c, [[0, -168, 1], [9, -152], [-9, -152]], G.base, { sh: [-3, 0, 3, rgba(G.dk, .8)] });
  pfGoldBand(c, [[-48, -50], [0, -55], [48, -50]], 8, { pearls: true });
}

// ---------- hands and arms, facing us ----------
function pfHand(c, x, y, a, sk, kind = 'palm', o = {}) {
  const s = o.s || 1, col = o.col || sk.base, dk = rgba(sk.dk, .55), mir = o.mir ? -1 : 1;
  c.save(); c.translate(x, y); c.rotate(a); c.scale(s * mir, s);
  const sh = { sh: [4, 3, 5, rgba(sk.dk, .85)], hi: [-3, -3, 4, rgba(sk.lt, .7)] };
  if (kind === 'palm' || kind === 'down') {
    // the palm toward us, the fingers together (pointing along -y), the thumb out to one side
    poFill(c, [[-13, 0], [-15, -22], [-14, -46], [-11, -52], [-6, -50], [-3, -56], [3, -56], [7, -52], [12, -50], [14, -44], [14, -22], [22, -20], [26, -12], [18, -6], [13, 0]], col, { ...sh,
      inside: () => { for (const xx of [-7, 0, 7]) poLine(c, [[xx, -26], [xx, -52]], dk, 1.1); poLine(c, [[-10, -18], [0, -12], [10, -16]], dk, 1); ellipse(c, 0, -16, 5, 5, 'rgba(176,50,56,.45)'); } });
  } else if (kind === 'fist') {
    poFill(c, [[-14, 0], [-16, -16], [-14, -30], [-4, -34], [8, -34], [16, -28], [16, -12], [12, 0]], col, { ...sh,
      inside: () => { for (const yy of [-28, -21, -14]) poLine(c, [[-14, yy], [14, yy + 1]], dk, 1.1); } });
    poFill(c, [[-16, -16], [-22, -24], [-18, -32], [-10, -30]], col, sh);
  } else if (kind === 'join') {
    // two palms pressed, fingers up, a seam, a thumb on each side
    poFill(c, [[-14, 0], [-17, -20], [-15, -44], [-8, -60], [0, -66, 1], [8, -60], [15, -44], [17, -20], [14, 0]], col, { ...sh,
      inside: () => { poLine(c, [[0, -64], [0, -2]], rgba(sk.dk, .7), 1.3); for (const xx of [-8, 8]) poLine(c, [[xx, -26], [xx * .7, -54]], dk, 1); } });
    for (const sx of [-1, 1]) poFill(c, [[sx * 10, -8], [sx * 16, -28], [sx * 12, -36], [sx * 6, -26]], col, sh);
  } else if (kind === 'cup') {
    poFill(c, [[-14, 0], [-18, -14], [-26, -22], [-20, -28], [0, -30], [20, -28], [26, -22], [18, -14], [14, 0]], col, { ...sh, inside: () => poLine(c, [[-18, -22], [18, -22]], dk, 1) });
  }
  if (o.bangle !== false) { pfGoldBand(c, [[-15, 4], [0, 7], [15, 4]], 6); pfGoldBand(c, [[-15, 11], [0, 14], [15, 11]], 5); }
  c.restore();
}
function pfArm(c, P, sk, o = {}) {
  const [s, e, w] = P, W = o.w || [44, 36, 28], col = o.col || sk.base;
  const mid = [(s[0] + e[0]) / 2, (s[1] + e[1]) / 2];
  poFill(c, poLimb([s, mid, e], [W[0], (W[0] + W[1]) / 2, W[1]]), col, pfSh(sk, W[0]));
  poFill(c, poLimb([e, [(e[0] + w[0]) / 2, (e[1] + w[1]) / 2], w], [W[1], (W[1] + W[2]) / 2, W[2]]), col, pfSh(sk, W[1]));
  // the keyura (armlet) on the upper arm
  if (o.armlet !== false) {
    const u = .38, ax = lerp(s[0], e[0], u), ay = lerp(s[1], e[1], u), an = Math.atan2(e[1] - s[1], e[0] - s[0]) + Math.PI / 2, r = W[0] * .52;
    pfGoldBand(c, [[ax - Math.cos(an) * r, ay - Math.sin(an) * r], [ax, ay], [ax + Math.cos(an) * r, ay + Math.sin(an) * r]], 8);
    pdGem(c, ax, ay, 3.4, PDX.ruby);
  }
}

// ---------- props ----------
// a frontal lotus pedestal: rows of petals, its top at (x, y), w wide
function pdLotusSeat(c, x, y, w, o = {}) {
  const L = o.col || { base: '#C2506A', lt: '#E888A0', dk: '#7E2440' }, G = PDX.gold;
  c.save(); c.translate(x, y); c.scale(w / 300, w / 300);
  // the back row (upturned, behind the feet) is drawn by the caller first with o.back
  const petal = (px, py, a, l, wd, col) => { c.save(); c.translate(px, py); c.rotate(a);
    poFill(c, [[0, 0, 1], [-wd, -l * .35], [-wd * .7, -l * .8], [0, -l, 1], [wd * .7, -l * .8], [wd, -l * .35]], col.base, { sh: [wd * .3, 0, wd * .4, rgba(col.dk, .8)], hi: [-wd * .2, -l * .2, wd * .3, rgba(col.lt, .9)],
      inside: () => poLine(c, [[0, -4], [0, -l * .8]], rgba(col.dk, .45), 1.6) }); c.restore(); };
  if (o.back) { for (let i = -4; i <= 4; i++) petal(i * 30, 18, i * .2, 80, 22, L); c.restore(); return; }
  // the front rows: upturned petals in front, a row turned down beneath
  for (let i = -5; i <= 5; i++) petal(i * 28, 30, Math.PI + i * .1, 50, 18, { base: L.dk, lt: L.base, dk: '#4E1428' });
  poFill(c, pfSym([[0, 0, 1], [110, 4], [150, 20], [140, 34], [0, 40, 1]]), '#E6C46A', { sh: [0, 8, 8, rgba(G.dk, .8)], hi: [0, -4, 4, rgba(G.lt, .9)] });
  poDots(c, [[-130, 24], [0, 34], [130, 24]], 3.4, 10, G.dk, false);
  for (let i = -4; i <= 4; i++) petal(i * 34, 26, i * .16, 66, 22, L);
  c.restore();
}
// a Tanjore prabha behind a head or a figure
function pdHalo(c, x, y, r, o = {}) {
  const G = PDX.gold, a = o.a ?? 1;
  c.save(); c.globalAlpha *= a;
  glow(c, x, y, r * 1.7, o.glow || '#FFE4A0', .45, 'source-over');
  c.fillStyle = ptRad(c, x, y, 0, r, [[0, 'rgba(255,248,224,.95)'], [.7, 'rgba(250,226,160,.85)'], [1, 'rgba(236,190,100,.8)']]);
  c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
  // flame petals round the rim
  const n = Math.round(r / 7);
  for (let i = 0; i < n; i++) { const t = i / n * TAU, cx = x + Math.cos(t) * r, cy = y + Math.sin(t) * r; c.save(); c.translate(cx, cy); c.rotate(t + Math.PI / 2);
    poFill(c, [[-r * .08, 0], [0, -r * .16, 1], [r * .08, 0]], G.base, { sh: [2, 0, 2, rgba(G.dk, .8)] }); c.restore(); }
  c.lineWidth = r * .05; c.strokeStyle = G.base; c.beginPath(); c.arc(x, y, r, 0, TAU); c.stroke();
  c.lineWidth = r * .012; c.strokeStyle = G.dk; c.beginPath(); c.arc(x, y, r * .92, 0, TAU); c.stroke();
  poDots(c, Array.from({ length: 65 }, (_, i) => [x + Math.cos(i / 64 * TAU) * r * .86, y + Math.sin(i / 64 * TAU) * r * .86]), r * .014, r * .06, G.base, false);
  c.restore();
}
// the padma held by a stalk: a closed-ish pink lotus
function pdPadma(c, x0, y0, x1, y1, r = 34) {
  poLine(c, [[x0, y0], [(x0 + x1) / 2 + 6, (y0 + y1) / 2], [x1, y1 + r * .4]], PO.leaf.dk, 5);
  poLotus(c, x1, y1, r, .75, { base: '#C2506A', lt: '#E888A0', dk: '#7E2440' });
}
// the vajra: a double-ended thunderbolt
function pdVajra(c, x, y, a, s = 1) {
  const G = PDX.gold;
  c.save(); c.translate(x, y); c.rotate(a); c.scale(s, s);
  poFill(c, poLimb([[0, -14], [0, 14]], [12, 12]), G.base, { sh: [3, 0, 3, rgba(G.dk, .8)] });
  for (const d of [-1, 1]) {
    ellipse(c, 0, d * 18, 8, 5, G.base);
    for (const sx of [-1, 0, 1]) poFill(c, [[sx * 4, d * 20], [sx * 14, d * 34], [sx * 6, d * 54, 1], [sx * 2, d * 36]], G.base, { sh: [2, 0, 2, rgba(G.dk, .8)], hi: [-1, 0, 2, rgba(G.lt, .8)] });
  }
  c.restore();
}

// ---------- the lower body, facing us ----------
// a dhoti to the ankles (pal), with a pleated fall at the front, a gold hem, a sash knotted at the hips
function pfDhoti(c, pal, o = {}) {
  c.save(); c.scale(1, PF_LEG); pfDhotiIn(c, pal, o); c.restore();
}
function pfDhotiIn(c, pal, o = {}) {
  const G = PDX.gold, M = o.sash || PDX.maroon, hem = o.hem ?? 560;
  // the side swags of the sash looping over the thighs (behind the vanamala)
  const side = [[0, -18, 1], [88, -20], [106, 40], [118, 160], [124, 300], [120, 440], [116, hem], [70, hem + 14], [24, hem + 4], [0, hem - 20, 1]];
  poFill(c, pfSym(side), pal.base, { sh: [[-14, 6, 14, rgba(pal.dk, .8)], [14, 6, 14, rgba(pal.dk, .55)]], hi: [0, -6, 8, rgba(pal.lt, .7)],
    inside: () => {
      for (const s of [-1, 1]) for (const [a, b] of [[[s * 40, 40], [s * 56, 540]], [[s * 76, 60], [s * 92, 540]], [[s * 100, 120], [s * 110, 400]]]) pdFold(c, [a, b], 6, rgba(pal.dk, .45), 6);
      for (const s of [-1, 1]) pdFold(c, [[s * 60, 300], [s * 96, 330], [s * 118, 300]], 8, rgba(pal.lt, .5), 8);
      const R = lcg(5); for (let i = 0; i < 46; i++) { const x = (R() - .5) * 220, y = 20 + R() * 520; ellipse(c, x, y, 2.4, 3.2, rgba(M.base, .75)); }
    } });
  // the pleated fall down the middle
  poFill(c, [[-22, -10], [22, -10], [30, 200], [36, hem], [0, hem + 14, 1], [-36, hem], [-30, 200]], pal.base, { sh: [8, 0, 8, rgba(pal.dk, .7)], hi: [-6, 0, 6, rgba(pal.lt, .8)],
    inside: () => { for (const x of [-20, -8, 4, 16]) pdFold(c, [[x * .6, 0], [x, 300], [x * 1.4, hem]], 3, rgba(pal.dk, .55), 2); } });
  pfGoldBand(c, [[-116, hem], [-70, hem + 14], [-36, hem], [0, hem + 14], [36, hem], [70, hem + 14], [116, hem]], 12);
  pfGoldBand(c, [[-36, hem], [-30, 200], [-22, -6]], 6); pfGoldBand(c, [[36, hem], [30, 200], [22, -6]], 6);
  // the sash: a band at the waist, the knot, loops over the hips, ends hanging at the sides
  for (const s of [-1, 1]) {
    poFill(c, [[s * 70, -10], [s * 110, 30], [s * 134, 110], [s * 120, 150], [s * 104, 100], [s * 88, 40]], M.base, pfSh(M, 30));
    poFill(c, poLimb([[s * 120, 40], [s * 140, 160], [s * 146, 290]], [16, 18, 8]), M.base, pfSh(M, 18));
    ellipse(c, s * 146, 296, 7, 9, PDX.gold.base); ellipse(c, s * 144, 292, 3, 3, PDX.gold.lt);
  }
  poFill(c, [[-92, -26], [92, -26], [94, 6], [0, 12], [-94, 6]], M.base, pfSh(M, 30));
  pfGoldBand(c, [[-94, 8], [0, 14], [94, 8]], 10, { gems: 26 });
  // the kati-sutra clasp
  c.save(); c.translate(0, 10); poFill(c, [[0, -16, 1], [20, 0], [0, 20, 1], [-20, 0]], G.base, pfSh(G, 30)); pdGem(c, 0, 2, 6, PDX.emerald); c.restore();
}
// two feet facing us, standing on y = sole, heels apart
function pfFeet(c, sk, o = {}) {
  const y = o.y ?? PF_SOLE, sp = o.sp ?? 48;
  for (const s of [-1, 1]) {
    c.save(); c.translate(s * sp, y); c.scale(s, 1);
    poFill(c, [[-14, -50], [14, -50], [18, -24], [30, -12], [40, -2, 1], [-16, 0, 1], [-22, -14]], sk.base, { sh: [5, 4, 5, rgba(sk.dk, .85)], hi: [-3, -3, 3, rgba(sk.lt, .7)],
      inside: () => { poLine(c, [[-16, -1], [40, -1]], 'rgba(180,40,50,.85)', 4); for (const xx of [6, 16, 26, 34]) poLine(c, [[xx, -10], [xx + 1, -2]], rgba(sk.dk, .5), 1); } });
    poDots(c, [[-14, -50], [0, -54], [14, -50]], 3, 6, PDX.gold.base);
    c.restore();
  }
}

// ---------- the torso, facing us ----------
const PF_TORSO = [[0, -324, 1], [-24, -318], [-64, -308], [-110, -294], [-136, -274], [-138, -248], [-118, -226], [-108, -180], [-96, -120], [-80, -60], [-82, -16], [0, -12, 1]];
function pfTorso(c, sk, o = {}) {
  poFill(c, pfSym(PF_TORSO), sk.base, { sh: [[-14, 6, 14, rgba(sk.dk, .75)], [14, 6, 14, rgba(sk.dk, .55)]], hi: [0, -8, 10, rgba(sk.lt, .65)],
    inside: () => {
      for (const s of [-1, 1]) pdFold(c, [[s * 92, -206], [s * 58, -186], [s * 12, -192]], 7, rgba(sk.dk, .45), 6);
      for (const s of [-1, 1]) pdFold(c, [[s * 90, -262], [s * 50, -272]], 6, rgba(sk.lt, .6), 5);
      pdFold(c, [[0, -150], [0, -60]], 4, rgba(sk.dk, .3), 4);
      ellipse(c, 0, -40, 3.2, 4.4, rgba(sk.dk, .9));
    } });
}
// the necklaces: a gold collar with gems, a longer chain with the Kaustubha (o.kaustubha), pearls
function pfNecklaces(c, o = {}) {
  const G = PDX.gold;
  poFill(c, pfSym([[0, -312, 1], [30, -316], [52, -306], [56, -290], [34, -276], [0, -268, 1]]), G.base, { sh: [0, 4, 4, rgba(G.dk, .85)], hi: [0, -3, 3, rgba(G.lt, .9)],
    inside: () => poDots(c, [[-44, -296], [-20, -282], [0, -279], [20, -282], [44, -296]], 2.6, 9, PDX.ruby, false) });
  poDots(c, [[-52, -296], [-50, -262], [-30, -236], [0, -228], [30, -236], [50, -262], [52, -296]], 3, 7, PDX.pearl, false);
  poDots(c, [[-60, -292], [-58, -236], [-34, -200], [0, -190], [34, -200], [58, -236], [60, -292]], 3.4, 8);
  if (o.kaustubha) {
    c.save(); c.translate(0, -186);
    poFill(c, [[0, -14, 1], [16, 0], [0, 22, 1], [-16, 0]], G.base, pfSh(G, 34)); pdGem(c, 0, 2, 9, PDX.ruby);
    c.restore();
  }
}
// the janeu: over the left shoulder (screen right), to the right hip (screen left): "/"
function pfJaneu(c, o = {}) {
  poLine(c, [[96, -296], [60, -220], [10, -110], [-40, -40], [-74, -10]], o.col || 'rgba(246,240,226,.95)', 2.6);
}
// the vanamala: a garland of leaves and flowers from the shoulders to the knees
function pfVanamala(c, o = {}) {
  const lo = o.lo ?? 330, vm = [[-78, -300], [-96, -200], [-104, -40], [-96, 140], [-66, lo - 10], [-30, lo], [0, lo + 6], [30, lo], [66, lo - 10], [96, 140], [104, -40], [96, -200], [78, -300]];
  limb(c, vm, vm.map(() => 8), '#4E6E46', false);
  for (const [x, y] of poAlong(vm, 5)) ellipse(c, x, y - 1, 2.9, 2.9, '#7E9C6A');
  poAlong(vm, 34).forEach(([x, y], i) => { ellipse(c, x, y, 4.4, 4.4, ['#EDE6D4', '#C0303C', '#E0901C'][i % 3]); ellipse(c, x, y, 1.6, 1.6, PDX.gold.lt); });
}

// the gada upside down: the head resting on the ground at (gx, gy), the shaft up to the handle's knob at (x, y)
function pdGadaDown(c, x, y, gx, gy) {
  const G = PO.gold;
  poLine(c, [[x, y], [gx, gy]], G.dk, 16); poLine(c, [[x, y], [gx, gy]], G.base, 11); poLine(c, [[x + 3, y], [gx + 3, gy]], rgba(G.lt, .8), 2.4);
  ellipse(c, x, y - 2, 11, 9, G.dk); ellipse(c, x, y - 3, 8, 7, G.base);                       // the knob at the handle's end
  poBorder(c, [[gx - 12, gy - 70], [gx + 12, gy - 70]], 5);                                   // a collar above the head
  c.save(); c.translate(gx, gy - 10);
  poFill(c, [[-48, 0], [-40, -30], [-14, -46], [14, -46], [40, -30], [48, 0], [40, 30], [14, 44], [-14, 44], [-40, 30]], G.base, { sh: [6, 12, 12, rgba(G.dk, .9)], hi: [-6, -10, 10, rgba(G.lt, .9)],
    inside: () => { for (const xx of [-28, -8, 12, 32]) pdFold(c, [[xx, -44], [xx + 3, 0], [xx, 44]], 3, rgba(G.dk, .55), 2); poBorder(c, [[-50, 0], [50, 0]], 5); } });
  c.restore();
}

// ---------- Vishnu standing on the lotus ----------
function pdVishnuStand(c, o = {}) {
  const sk = PDX.vishnu, Y = PDX.pita, G = PDX.gold;
  if (o.halo !== 0) pdHalo(c, 0, -470, 196, { a: o.halo ?? 1 });
  if (o.seat !== false) pdLotusSeat(c, 0, PF_SOLE - 8, 330, { back: true });
  // the gada standing on its head at his left (screen right), his lower left hand on the handle's end
  pdGadaDown(c, 218, -40, 226, PF_SOLE - 40);
  // the upper arms, behind the shoulders: chakra (his right, screen left), shankha (his left, screen right)
  pfArm(c, [[-104, -290], [-196, -250], [-218, -352]], sk, { col: sk.far, w: [42, 34, 26] });
  pfArm(c, [[104, -290], [196, -250], [218, -352]], sk, { col: sk.far, w: [42, 34, 26] });
  pdChakra(c, -226, -446, 44);
  pfHand(c, -218, -352, -.05, sk, 'palm', { col: sk.far, s: .9 });
  pfHand(c, 218, -352, .05, sk, 'fist', { col: sk.far, s: .9 });
  pdShankha(c, 222, -410, -.15);
  // the legs (only the feet show under the dhoti)
  pfFeet(c, sk);
  pfDhoti(c, Y);
  pfTorso(c, sk);
  pfVanamala(c);
  pfJaneu(c);
  pfNecklaces(c, { kaustubha: true });
  // the shrivatsa on his chest (his right, screen left): a small gold curl
  poLine(c, [[-46, -236], [-40, -244], [-34, -238], [-40, -230], [-46, -236]], G.base, 2.4);
  // the lower arms, in front: his right holds the padma (or blesses), his left rests on the gada
  if (o.bless) { pfArm(c, [[-124, -270], [-160, -170], [-140, -96]], sk); pfHand(c, -140, -96, -.1, sk, 'palm'); }
  else { pfArm(c, [[-124, -270], [-176, -160], [-150, -214]], sk); pdPadma(c, -150, -200, -152, -300, 36); pfHand(c, -150, -214, .1, sk, 'fist'); }
  pfArm(c, [[124, -270], [176, -170], [206, -84]], sk);
  pfHand(c, 212, -62, 3.3, sk, 'fist', { mir: true });
  // the head
  c.save(); c.translate(0, PF_HEAD[0]); c.scale(PF_HEAD[1], PF_HEAD[1]);
  pfHead(c, { sk, eye: o.eye || 'half', mouth: o.mouth || 'smile', tilak: 'u' });
  pfEarrings(c, 'makara');
  pfKirita(c);
  c.restore();
  if (o.seat !== false) pdLotusSeat(c, 0, PF_SOLE - 8, 330);
}

// ---------- Brahma ----------
// the side faces: profile heads turned out, partly behind the front face
function pfBrahmaSide(c, s, o) {
  c.save(); c.translate(s * 50, -6); c.scale(s * .86, .86);
  pdHead(c, { sk: PDX.brahma, face: 'man', hair: 'none', beard: 'sage', eye: o.eye === 'closed' ? 'low' : 'low', mouth: 'calm', tilak: 'u' });
  c.translate(-6, 0); c.scale(.9, .9); pfJataMukut(c);
  c.restore();
}
function pdBrahma(c, o = {}) {
  const sk = PDX.brahma, R = { base: '#B83A2E', lt: '#DA6650', dk: '#7A2018' }, G = PDX.gold, pose = o.pose || 'pray', W = PD.white;
  const seat = pose === 'seat', bend = pose === 'bless' ? .16 : 0;
  if (o.halo !== 0) pdHalo(c, 0, -480, 210, { a: o.halo ?? .9 });
  if (seat) pdLotusSeat(c, 0, 190, 460, { back: true });
  // body tilt when bending
  c.save(); c.translate(0, 0); c.rotate(bend * .4);
  // upper arms behind: the Vedas (his right, screen left) and the akshamala (his left)
  pfArm(c, [[-104, -290], [-190, -250], [-206, -346]], sk, { col: sk.far, w: [40, 32, 26] });
  pfArm(c, [[104, -290], [190, -250], [206, -346]], sk, { col: sk.far, w: [40, 32, 26] });
  // the palm-leaf book
  c.save(); c.translate(-210, -380); c.rotate(-.1);
  poFill(c, [[-46, -12, 1], [46, -12, 1], [46, 12, 1], [-46, 12, 1]], '#D8C08A', { sh: [0, 5, 4, 'rgba(120,90,50,.8)'], inside: () => { for (const y of [-6, 0, 6]) poLine(c, [[-40, y], [40, y]], 'rgba(120,90,50,.5)', 1); } });
  poFill(c, [[-50, -16, 1], [50, -16, 1], [50, -10, 1], [-50, -10, 1]], '#7A4E2E'); poFill(c, [[-50, 10, 1], [50, 10, 1], [50, 16, 1], [-50, 16, 1]], '#7A4E2E');
  poLine(c, [[0, -16], [0, 16]], '#B0303A', 2);
  c.restore();
  pfHand(c, -206, -346, -.05, sk, 'fist', { col: sk.far, s: .86 });
  poDots(c, [[206, -350], [196, -320], [204, -290], [218, -300], [222, -330]], 4, 8, '#6A3E2A', false);
  pfHand(c, 206, -346, .05, sk, 'palm', { col: sk.far, s: .86 });
  // the lower body
  if (seat) {
    // padmasana: the crossed shins across the lap, the soles up
    poFill(c, pfSym([[0, -14, 1], [90, -16], [150, 40], [190, 110], [170, 160], [0, 170, 1]]), R.base, { sh: [[-14, 8, 14, rgba(R.dk, .8)], [14, 8, 14, rgba(R.dk, .6)]], hi: [0, -6, 8, rgba(R.lt, .7)],
      inside: () => { for (const s of [-1, 1]) pdFold(c, [[s * 40, 30], [s * 120, 90], [s * 170, 130]], 6, rgba(R.dk, .5), 6); } });
    for (const s of [-1, 1]) { c.save(); c.translate(s * 60, 100); c.scale(s, 1); poFill(c, [[-30, -10], [20, -18], [50, -6], [56, 10], [20, 14], [-30, 10]], sk.base, { sh: [0, 4, 4, rgba(sk.dk, .85)], inside: () => poLine(c, [[-20, 12], [52, 8]], 'rgba(180,40,50,.8)', 4) }); c.restore(); }
    pfGoldBand(c, [[-190, 140], [0, 172], [190, 140]], 10);
  } else {
    pfFeet(c, sk);
    pfDhoti(c, R, { sash: { base: '#D8A84A', lt: '#F0CC70', dk: '#9A7020' } });
  }
  pfTorso(c, sk);
  // a deerskin uttariya over his left shoulder
  poFill(c, [[60, -316], [120, -300], [140, -260], [104, -160], [40, -60], [-20, -20], [-40, -40], [20, -120], [70, -220]], PD.deer.base, { ...pfSh(PD.deer, 60), inside: () => { const Rr = lcg(3); for (let i = 0; i < 14; i++) ellipse(c, 20 + Rr() * 100, -260 + Rr() * 200, 4, 3, rgba(PD.deer.dk, .6)); } });
  pfJaneu(c);
  pfNecklaces(c, {});
  // the lower arms: the kamandalu (his left, screen right), and the right hand by pose
  if (pose === 'pray') {
    pfArm(c, [[-124, -270], [-150, -170], [-24, -180]], sk); pfArm(c, [[124, -270], [150, -170], [24, -180]], sk);
    pfHand(c, 0, -166, 0, sk, 'join', { s: 1.25 });
  } else if (pose === 'bless') {
    pfArm(c, [[-124, -270], [-186, -170], [-250, -90]], sk); pfHand(c, -250, -90, -2.4, sk, 'down');
    pfArm(c, [[124, -270], [172, -170], [150, -90]], sk);
    pdKamandalu(c, 150, -26, .9); pfHand(c, 150, -90, 3.0, sk, 'fist', { mir: true });
  } else {
    pfArm(c, [[-124, -270], [-170, -170], [-120, -110]], sk); pfHand(c, -120, -110, .2, sk, 'palm');
    pfArm(c, [[124, -270], [172, -170], [150, -70]], sk);
    pdKamandalu(c, 150, -6, .9); pfHand(c, 150, -70, 3.0, sk, 'fist', { mir: true });
  }
  // the heads: two side faces turned out, the front face, all crowned with a jata-mukuta
  c.save(); c.translate(0, PF_HEAD[0]); c.rotate(bend); c.scale(PF_HEAD[1] * .96, PF_HEAD[1] * .96);
  pfBrahmaSide(c, -1, o); pfBrahmaSide(c, 1, o);
  pfHead(c, { sk, eye: o.eye || (pose === 'pray' ? 'closed' : 'half'), mouth: 'smile', tilak: 'u', beard: 'white', hair: 'none' });
  pfEarrings(c, 'drop');
  pfJataMukut(c);
  c.restore();
  c.restore();
  if (seat) pdLotusSeat(c, 0, 190, 460);
}

// ---------- Shiva ----------
function pdShivaStand(c, o = {}) {
  const sk = PDX.shiva, T = AR.tiger, G = PDX.gold;
  if (o.halo !== 0) pdHalo(c, 0, -470, 190, { a: o.halo ?? .85, glow: '#E6EEFF' });
  // the trishul standing beside him (screen left), the damaru tied under the prongs
  const tx = -200;
  poLine(c, [[tx, PF_SOLE], [tx, -540]], G.dk, 11); poLine(c, [[tx, PF_SOLE], [tx, -540]], G.base, 7);
  poFill(c, [[tx - 5, -536, 1], [tx - 4, -600], [tx, -644, 1], [tx + 4, -600], [tx + 5, -536, 1]], '#B9BCC6', { sh: [3, 0, 3, 'rgba(90,92,110,.8)'] });
  for (const s of [-1, 1]) poFill(c, [[tx + s * 4, -542, 1], [tx + s * 34, -546], [tx + s * 42, -580], [tx + s * 36, -612, 1], [tx + s * 30, -580], [tx + s * 22, -556], [tx + s * 4, -552, 1]], '#B9BCC6', { sh: [s * 3, 3, 3, 'rgba(90,92,110,.8)'] });
  pfGoldBand(c, [[tx - 22, -540], [tx + 22, -540]], 8);
  c.save(); c.translate(tx, -520);
  poLine(c, [[0, 0], [0, 30]], '#8A2A2A', 2.4); c.translate(0, 48);
  poFill(c, [[-14, -18, 1], [14, -18, 1], [3, 0], [14, 18, 1], [-14, 18, 1], [-3, 0]], '#A9764A', { sh: [5, 0, 4, 'rgba(90,50,30,.8)'] });
  c.restore();
  // legs below the tiger skin
  for (const s of [-1, 1]) poFill(c, poLimb([[s * 60, 250], [s * 62, 360], [s * 56, PF_SOLE - 40]], [66, 52, 34]), sk.base, pfSh(sk, 60));
  pfFeet(c, sk, { sp: 56 });
  // the tiger skin to the knees
  const tg = pfSym([[0, -14, 1], [-86, -18], [-100, 50], [-110, 150], [-116, 250], [-96, 242], [-80, 266], [-56, 248], [-36, 270], [-14, 252], [0, 266, 1]]);
  poFill(c, tg, T.base, { sh: [[-12, 8, 12, rgba(T.dk, .8)], [12, 8, 12, rgba(T.dk, .6)]], hi: [0, -4, 8, rgba(T.lt, .7)],
    inside: () => { const R = lcg(4); for (let y = 20; y < 260; y += 34) for (let x = -104 + (y % 68 ? 14 : 0); x < 110; x += 36) { const l = 22 + R() * 12, a = -.25 + R() * .2; c.save(); c.translate(x + R() * 8, y + R() * 10); c.rotate(a); poFill(c, [[-l / 2, 0, 1], [-l / 6, -3.4], [l / 2, -1, 1], [0, 2.2]], T.stripe, { alpha: .85 }); c.restore(); } } });
  poLine(c, [[-86, -14], [0, -10], [86, -14]], '#6A3E2A', 5);
  pfTorso(c, sk);
  pfJaneu(c);
  poDots(c, [[-30, -312], [-36, -270], [-20, -232], [0, -222], [20, -232], [36, -270], [30, -312]], 4.6, 9, '#6A3E2A', false);
  // the serpent round his neck
  const sn = [[60, -306], [30, -296], [0, -294], [-34, -300], [-64, -312], [-84, -340]];
  poFill(c, poLimb(sn, [10, 11, 11, 11, 10, 8]), AR.snake.base, { sh: [0, 3, 3, rgba(AR.snake.dk, .85)], hi: [0, -2, 2, rgba(AR.snake.lt, .8)] });
  c.save(); c.translate(-88, -352); ellipse(c, 0, 0, 12, 14, AR.snake.base); ellipse(c, 0, 2, 6, 9, AR.snake.belly); ellipse(c, -3, -8, 1.4, 1.4, '#111'); ellipse(c, 3, -8, 1.4, 1.4, '#111'); c.restore();
  // hands joined at the chest
  pfArm(c, [[-124, -270], [-150, -170], [-24, -180]], sk, { armlet: false }); pfArm(c, [[124, -270], [150, -170], [24, -180]], sk, { armlet: false });
  for (const s of [-1, 1]) poDots(c, [[s * 140, -230], [s * 148, -214], [s * 156, -230]], 4, 7, '#6A3E2A', false);
  pfHand(c, 0, -166, 0, sk, 'join', { s: 1.25, bangle: false });
  // the head: jata piled high, the crescent, the Ganga, the third eye, the blue throat
  c.save(); c.translate(0, PF_HEAD[0]); c.scale(PF_HEAD[1], PF_HEAD[1]);
  for (let i = 0; i < 3; i++) for (const s of [-1, 1]) poFill(c, poLimb([[s * (40 + i * 5), -10], [s * (60 + i * 9), 44], [s * (72 + i * 11), 96], [s * (78 + i * 13), 136]], [18, 15, 11, 4]), AR.jata, { hi: [-3, 0, 3, 'rgba(120,96,80,.45)'] });
  pfHead(c, { sk, eye: o.eye || 'closed', mouth: 'calm', tilak: 'tri', hairCol: AR.jata, lip: '#8A5A6A' });
  c.save(); c.filter = `blur(${Math.max(.5, 5 * pdK(c))}px)`; poFill(c, [[-22, 78], [22, 78], [24, 96], [-24, 96]], rgba('#5A78B0', .4)); c.restore();
  poFill(c, [[0, -42, 1], [-3, -32], [0, -22, 1], [3, -32]], '#7A2228');
  // the jata: a tall coil
  poFill(c, pfSym([[0, -166, 1], [16, -164], [26, -150], [28, -120], [30, -94], [36, -72], [30, -60], [0, -60, 1]]), AR.jata, { hi: [-6, -4, 6, 'rgba(130,100,80,.5)'],
    inside: () => { for (let y = -158; y < -62; y += 10) poLine(c, [[-34, y + 2], [-8, y + 7], [16, y + 2], [34, y + 6]], 'rgba(120,92,72,.55)', 2.2); } });
  poDots(c, [[-32, -70], [0, -74], [32, -70]], 4, 9, '#6A3E2A', false);
  c.save(); c.translate(-28, -128); c.rotate(-.5);
  const mo = new Path2D(); mo.arc(0, 0, 18, 0, TAU); mo.arc(8, -5, 15.5, 0, TAU);
  c.fillStyle = '#F6F3E8'; c.fill(mo, 'evenodd'); glow(c, 0, 0, 40, '#EEF4FF', .4, 'source-over');
  c.restore();
  const GP = [[8, -156], [30, -186], [60, -190], [82, -170], [90, -130]];
  poLine(c, GP, 'rgba(160,196,214,.5)', 10); poLine(c, GP, 'rgba(220,238,244,.9)', 4);
  for (const s of [-1, 1]) { c.save(); c.strokeStyle = '#EDE4CC'; c.lineWidth = 4; c.beginPath(); c.arc(s * 52, 34, 10, 0, TAU); c.stroke(); c.restore(); }
  c.restore();
}

// ---------- Indra ----------
function pdIndra(c, o = {}) {
  const sk = PDX.indra, G = PDX.gold, Gr = { base: '#3E7A62', lt: '#62A088', dk: '#24503E' };
  if (o.halo !== 0) pdHalo(c, 0, -460, 180, { a: o.halo ?? .8 });
  pfFeet(c, sk);
  pfDhoti(c, Gr, { sash: PDX.maroon });
  // the vajra tucked in his sash at his left hip
  pdVajra(c, 104, -30, .5, 1.3);
  pfTorso(c, sk);
  pfJaneu(c);
  pfNecklaces(c, {});
  poDots(c, [[-64, -290], [-60, -230], [-36, -180], [0, -166], [36, -180], [60, -230], [64, -290]], 3.2, 8, PDX.ruby, false);
  pfArm(c, [[-124, -270], [-150, -170], [-24, -180]], sk); pfArm(c, [[124, -270], [150, -170], [24, -180]], sk);
  pfHand(c, 0, -166, 0, sk, 'join', { s: 1.25 });
  c.save(); c.translate(0, PF_HEAD[0]); c.scale(PF_HEAD[1], PF_HEAD[1]);
  pfHead(c, { sk, eye: o.eye || 'half', mouth: 'calm', tilak: 'dot', lip: '#9A4A54' });
  // a thin moustache
  poFill(c, [[0, 33], [-10, 32], [-20, 37], [-10, 36], [0, 36.5], [10, 36], [20, 37], [10, 32]], PO.hair);
  pfEarrings(c, 'drop');
  pfIndraCrown(c);
  c.restore();
}
