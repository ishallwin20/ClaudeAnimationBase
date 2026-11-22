// po_dasha_world.js: the Dashavatar book's people and creatures in profile, in the Pothi style (needs pothi.js,
// po_dashavatar.js, po_dasha_gods.js). Profile figures face +x with their feet on y = 0 (flip with scale(-1, 1)); an
// adult stands about 810 to the top of the head, a child about 560.
//   pdHairBack / pdHairFront: pdHead's extra hair styles: 'bun' (a knot with jasmine), 'braid', 'veil' (an odhni over
//     the head, o.veil its colour), 'pagri' (a turban, o.pagri its colour), 'mukut' (Lakshmi: a bun and a small gold
//     crown); o.bindi, o.nath (a nose ring), o.hairCol (white for elders)
//   pdPerson(c, o): a villager. o.kind 'man' | 'woman' | 'boy' | 'girl' | 'elder' (an old woman) | 'sage';
//     o.legs 'stand' | 'walk' | 'sit'; o.near / o.far: [upper-arm angle, forearm angle, hand] (radians from straight
//     down, + forward; hand 'open' | 'grip' | 'up' | 'join'); o.lean (radians, the torso forward); o.tilt (the head);
//     o.eye, o.mouth, o.brow; o.wear 'dhoti' | 'short' | 'sari' | 'langa' | 'robe'; o.cloth / o.top / o.trim colours;
//     o.prop { near: 'stick' | 'purse' | 'basket' | 'leaf' | 'bowl' | 'grain', far: ... }
//   pdLakshmi(c, o): Lakshmi seated on her heels, in profile; o.pose 'seat' (a lotus in her hands) | 'serve' (her
//     hands forward, as at his feet)
//   pdBhumiCow(c, o): the Earth as a gentle cow, in profile; o.mood 'sad' (the head low, a tear) | 'hope' (the head
//     up); o.glow (0..1)
const PW = {
  cotton: { base: '#ECE4D2', lt: '#FBF6EA', dk: '#B8AC94' },
  indigoCloth: { base: '#3E4C8A', lt: '#6070AE', dk: '#26305E' },
  turmeric: { base: '#D9A23C', lt: '#F0C468', dk: '#9E6E1E' },
  rose: { base: '#C2506A', lt: '#E07A90', dk: '#86283E' },
  leafCloth: { base: '#4E8A62', lt: '#74AE86', dk: '#2E5A3E' },
  rust: { base: '#B2532E', lt: '#D27A50', dk: '#7A3218' },
  skinA: { base: '#B47A50', lt: '#D09C70', dk: '#7E5030', far: '#9A6640' },
  skinB: { base: '#C68E62', lt: '#E0AE84', dk: '#8E5E3C', far: '#AE7A50' },
  skinC: { base: '#9A6440', lt: '#BA8460', dk: '#684024', far: '#845434' },
  cow: { base: '#F1EADC', lt: '#FFFCF4', dk: '#B8ACC2', far: '#DCD2CC' }
};

// ---------- extra hair for pdHead ----------
function pdHairBack(c, o) {
  const hc = o.hairCol || PO.hair;
  if (o.hair === 'bun' || o.hair === 'mukut') { ellipse(c, -52, -18, 22, 19, hc); ellipse(c, -56, -24, 9, 6, 'rgba(120,110,120,.4)'); poDots(c, [[-38, -36], [-56, -40], [-72, -26], [-72, -6]], 3.6, 7.5, '#F6F0E2', false); }
  if (o.hair === 'braid') {
    const P = [[-40, 4], [-50, 50], [-52, 100], [-48, 150]];
    poFill(c, poLimb(P, [26, 20, 16, 10]), hc, { hi: [-2, -2, 3, 'rgba(120,110,120,.4)'], inside: () => { for (const [x, y] of poAlong(P, 16)) poLine(c, [[x - 9, y - 4], [x + 9, y + 4]], 'rgba(90,80,90,.6)', 1.6); } });
    ellipse(c, -48, 160, 6, 8, o.ribbon || PO.red);
  }
  if (o.hair === 'veil') poFill(c, [[20, -62], [-20, -74], [-58, -54], [-72, -6], [-78, 70], [-62, 120], [-36, 80], [-24, 30], [-20, 0]], (o.veil || PW.cotton).base, pdL(o.veil || PW.cotton, 60));
}
function pdHairFront(c, o) {
  const hc = o.hairCol || PO.hair, fem = o.face === 'woman' || o.face === 'girl';
  if (fem) { poLine(c, [[16.5, -6.8], [10, -10]], 'rgba(28,22,30,.9)', 1.8); if (o.bindi !== false) ellipse(c, 34, -26, 2.4, 2.4, PO.red); }
  if (o.nath) { c.save(); c.strokeStyle = PO.gold.base; c.lineWidth = 1.6; c.beginPath(); c.arc(42, 17, 5, -1.2, 3.6); c.stroke(); c.restore(); ellipse(c, 38, 21, 1.6, 1.6, '#F2EEE2'); }
  if (o.hair === 'bun' || o.hair === 'braid' || o.hair === 'mukut' || o.hair === 'veil') {
    poFill(c, [[32, -40], [16, -57], [-14, -63], [-42, -51], [-52, -22], [-48, 8], [-36, 16], [-28, -2], [-16, -18], [2, -30], [24, -35]], hc, { hi: [0, -4, 5, 'rgba(120,110,130,.4)'] });
    poLine(c, [[26, -44], [0, -54], [-30, -50]], 'rgba(130,120,130,.4)', 1.6);
    if (fem && o.hair !== 'veil') poLine(c, [[24, -40], [8, -52]], PO.red, 2);                         // sindoor in the parting
  }
  if (o.hair === 'veil') {
    const V = o.veil || PW.cotton;
    poFill(c, [[30, -44], [16, -64], [-14, -74], [-48, -62], [-66, -28], [-70, 16], [-56, 40], [-44, 12], [-34, -14], [-18, -34], [4, -46], [24, -50]], V.base,
      { ...pdL(V, 70), inside: () => pdFold(c, [[0, -60], [-40, -40], [-56, 0]], 4, rgba(V.dk, .5), 4) });
    poLine(c, [[30, -44], [24, -50], [4, -46], [-18, -34], [-34, -14], [-44, 12], [-56, 40]], o.trim || PO.maroon.base, 3);
  }
  if (o.hair === 'pagri') {
    const T = o.pagri || PW.turmeric;
    poFill(c, [[36, -36], [34, -54], [22, -72], [-2, -84], [-30, -84], [-54, -70], [-64, -44], [-60, -16], [-46, -4], [-34, -14], [-14, -26], [12, -32]], T.base,
      { ...pdL(T, 80), inside: () => { for (const k of [0, 1, 2, 3, 4]) pdFold(c, [[36 - k * 3, -40 - k * 9], [4, -46 - k * 9], [-34, -30 - k * 12], [-60, -20 - k * 12]], 3, rgba(T.dk, .5), 2); } });
    poFill(c, [[-56, -66], [-74, -88], [-86, -76], [-70, -50]], T.base, pdL(T, 20));
  }
  if (o.hair === 'mukut') {
    // Lakshmi's karanda crown: a tiered gold cone with a finial, a jewelled band at the brow
    const G = PDX.gold, gd = { sh: [-6, 0, 6, rgba(G.dk, .8)], hi: [5, -4, 5, rgba(G.lt, .85)] };
    poFill(c, [[30, -42, 1], [24, -62], [12, -86], [-4, -104], [-22, -98], [-34, -76], [-40, -48, 1]], G.base, { ...gd, inside: () => { for (const y of [-58, -76, -92]) poBorder(c, [[30, y + 6], [-4, y], [-40, y + 6]], 3.6, G); } });
    poFill(c, [[-6, -102], [2, -114], [-4, -132, 1], [-12, -114]], G.base, gd);
    poBorder(c, [[32, -40], [-4, -48], [-42, -42]], 6, G); pdGem(c, 10, -50, 3.4, PDX.ruby); pdGem(c, -16, -66, 2.8, PDX.emerald);
  }
}

// ---------- villagers ----------
const PP = { sh: [4, -650], shF: [-8, -650], L1: 150, L2: 126 };
function pdPerson(c, o = {}) {
  const kind = o.kind || 'man', child = kind === 'boy' || kind === 'girl', fem = kind === 'woman' || kind === 'girl' || kind === 'elder';
  const sk = o.sk || (kind === 'sage' ? PD.shukra : fem ? PW.skinB : PW.skinA);
  const wear = o.wear || (kind === 'woman' || kind === 'elder' ? 'sari' : kind === 'girl' ? 'langa' : kind === 'sage' ? 'robe' : kind === 'boy' ? 'short' : 'dhoti');
  const cloth = o.cloth || (wear === 'robe' ? PD.saffron : wear === 'sari' ? (kind === 'elder' ? PW.cotton : PW.rose) : wear === 'langa' ? PW.turmeric : PW.cotton);
  const trim = o.trim || (wear === 'sari' || wear === 'langa' ? { base: '#C99A3E', lt: '#ECC870', dk: '#8E6A22' } : { base: '#9E3A36', lt: '#C05A50', dk: '#6A2220' });
  const legs = o.legs || 'stand', sit = legs === 'sit', off = sit ? 280 : 0, lean = (o.lean || 0) + (kind === 'elder' ? .12 : 0);
  c.save();
  if (child) c.scale(.62, .62);
  // ---- legs and the lower garment
  const hip = [0, -450 + off];
  const LG = {
    stand: { n: [[14, -440], [16, -240], [18, -28]], f: [[-10, -440], [-20, -240], [-24, -28]], fa: [0, 0] },
    walk: { n: [[14, -440], [52, -236], [74, -28]], f: [[-10, -440], [-34, -236], [-74, -44]], fa: [0, .32] },
    sit: { n: [[14, -150], [170, -60], [30, -24]], f: [[-8, -156], [150, -76], [0, -30]], fa: [0, 0] },
  }[legs];
  const leg = (P, col, far) => {
    const [h, k, a] = P;
    pdLimb(c, [h, k], [86, 62].map(w => w * (child ? 1.05 : 1)), sk, far ? { col: sk.far } : {});
    pdLimb(c, [k, [(k[0] + a[0]) / 2, (k[1] + a[1]) / 2], a], [60, 48, 34], sk, far ? { col: sk.far } : {});
    if (sit) { c.save(); c.translate(a[0], a[1]); c.rotate(-.25); c.scale(-1, 1); pdFoot(c, 0, 0, sk, { col: far ? sk.far : sk.base, alta: fem, anklet: fem }); c.restore(); }
    else pdFoot(c, a[0], a[1], sk, { col: far ? sk.far : sk.base, a: far ? LG.fa[1] : LG.fa[0], alta: fem, anklet: fem || child });
  };
  if (!sit) { leg(LG.f, sk, true); leg(LG.n, sk, false); }
  // the garment over the legs (sitting: a lap with one foot showing in front)
  const fold = (P, col) => pdFold(c, P, 5, rgba(col.dk, .5), 5);
  if (wear === 'dhoti' || wear === 'short' || wear === 'robe') {
    const ln = wear === 'short' ? -250 : wear === 'robe' ? -60 : -130;
    let D;
    if (sit) D = [[-60, -196], [30, -194], [90, -150], [180, -100], [206, -60], [196, -14, 1], [60, -6], [-60, -8, 1], [-78, -80], [-74, -150]];
    else if (legs === 'walk') D = [[-60, -480], [56, -484], [70, -400], [90, -300], [100, ln, 1], [40, ln + 10], [0, -290], [-40, ln + 6], [-92, ln - 4, 1], [-80, -300], [-70, -400]];
    else D = [[-58, -480], [56, -484], [64, -400], [70, -300], [70, ln, 1], [20, ln + 8], [-20, ln + 4], [-62, ln, 1], [-66, -300], [-66, -400]];
    poFill(c, D, cloth.base, { ...pdL(cloth, 140), inside: () => { fold([[0, -470 + (sit ? 280 : 0)], [10, ln + (sit ? 0 : -10)]], cloth); fold([[40, -460 + (sit ? 270 : 0)], [60, ln]], cloth); } });
    if (!sit) poBorder(c, D.slice(4, 9).map(p => [p[0], p[1]]), 6, trim);
    if (sit && wear === 'robe') poBorder(c, [[196, -14], [60, -6], [-60, -8]], 6, trim);
  } else if (wear === 'sari' || wear === 'langa') {
    let D;
    if (sit) D = [[-62, -200], [34, -198], [96, -150], [186, -100], [212, -56], [204, -10, 1], [60, -4], [-62, -6, 1], [-82, -80], [-76, -150]];
    else D = [[-58, -490], [50, -494], [62, -400], [72, -280], [88, -140], [104, -20, 1], [40, -14], [-20, -16], [-78, -22, 1], [-80, -150], [-74, -300], [-68, -420]];
    poFill(c, D, cloth.base, { ...pdL(cloth, 150), inside: () => {
      if (!sit) for (const x of [-20, 6, 30, 54]) fold([[x * .6, -460], [x, -20]], cloth);
      const R = lcg(7); for (let i = 0; i < 26; i++) ellipse(c, -70 + R() * 170, -480 + R() * 460 + (sit ? 280 : 0), 2.4, 3, rgba(trim.base, .8));
    } });
    if (!sit) poBorder(c, [[104, -20], [40, -14], [-20, -16], [-78, -22]], 9, trim);
    else poBorder(c, [[204, -10], [60, -4], [-62, -6]], 8, trim);
  }
  if (sit) { c.save(); c.translate(120, -40); c.rotate(.1); c.scale(-1, 1); pdFoot(c, 0, 0, sk, { alta: fem, anklet: fem }); c.restore(); }
  // ---- the upper body, about the hip, leaning
  c.save(); c.translate(0, off); c.translate(hip[0], -450); c.rotate(lean); c.translate(-hip[0], 450);
  const arm = (A, far) => {
    const [a1, a2, hand] = A || [.08, .14, 'open'], [sx, sy] = far ? PP.shF : PP.sh;
    const ex = sx + Math.sin(a1) * PP.L1, ey = sy + Math.cos(a1) * PP.L1, wx = ex + Math.sin(a2) * PP.L2, wy = ey + Math.cos(a2) * PP.L2;
    const col = far ? sk.far : sk.base, sleeve = o.top && !fem;
    pdLimb(c, [[sx, sy], [ex, ey]], [50, 42], sk, { col: sleeve ? o.top.base : col });
    pdLimb(c, [[ex, ey], [wx, wy]], [42, 32], sk, { col });
    return [wx, wy, Math.atan2(wy - ey, wx - ex), hand, col];
  };
  const hand = ([x, y, a, kind, col], far) => pdHand(c, x, y, kind === 'join' ? a - .3 : a, sk, kind || 'open', { col, s: 1, bangle: fem });
  const prop = (w, what) => {
    if (!what) return;
    const [x, y] = w;
    if (what === 'stick') { const gy = -off; poLine(c, [[x + 6, y - 20], [x + 30, gy + (sit ? 0 : 0)]], PD.wood.dk, 10); poLine(c, [[x + 6, y - 20], [x + 30, gy]], PD.wood.base, 6); }
    if (what === 'purse') { c.save(); c.translate(x + 28, y + 14); poFill(c, [[-14, -10], [14, -10], [20, 10], [12, 24], [-12, 24], [-20, 10]], '#8E3A3A', pdL({ dk: '#5A1E1E', lt: '#B85A50' }, 40)); poLine(c, [[-14, -10], [0, -4], [14, -10]], PO.gold.base, 3); poDots(c, [[-12, 8], [0, 12], [12, 8]], 2, 6, PO.gold.base, false); c.restore(); }
    if (what === 'basket') { c.save(); c.translate(x + 30, y - 10); poFill(c, [[-56, -20], [56, -20], [46, 30], [-46, 30]], '#B08A4E', { ...pdL({ dk: '#6E5226', lt: '#D4B07A' }, 80), inside: () => { for (let k = -50; k < 56; k += 10) poLine(c, [[k, -20], [k * .84, 30]], 'rgba(110,80,40,.5)', 1.4); } }); for (let i = 0; i < 9; i++) ellipse(c, -44 + i * 11, -22 - Math.sin(i) * 3, 7, 5, '#E8C46A'); c.restore(); }
    if (what === 'grain') { for (let i = 0; i < 14; i++) ellipse(c, x + 46 + Math.sin(i * 3) * 6, y + 10 + i * 9, 2.4, 2, '#E4BE60'); }
    if (what === 'bowl') { c.save(); c.translate(x + 34, y - 6); poFill(c, [[-34, -8], [34, -8], [26, 14], [-26, 14]], '#9A6A44', pdL({ dk: '#5E3E24', lt: '#C08A5E' }, 50)); poFill(c, [[-30, -8], [30, -8], [20, -14], [-20, -14]], '#E4BE60'); c.restore(); }
    if (what === 'leaf') { c.save(); c.translate(x + 30, y - 8); c.rotate(-.5); poFill(c, [[-40, -8, 1], [40, -8, 1], [40, 8, 1], [-40, 8, 1]], '#D8C08A', { sh: [0, 4, 3, 'rgba(120,90,50,.8)'], inside: () => { for (const yy of [-3, 3]) poLine(c, [[-34, yy], [34, yy]], 'rgba(120,90,50,.55)', 1); } }); c.restore(); }
  };
  const F = arm(o.far, true); hand(F, true);
  prop(F, o.prop && o.prop.far);
  // the torso (a kurta, a choli with the pallu, or bare with a thread)
  const TS = PD_TORSO.map(([x, y]) => [x * (fem ? .86 : 1), y]);
  poFill(c, TS, sk.base, { ...pdL(sk, 110), inside: () => { if (kind !== 'elder' && !fem) pdFold(c, [[66, -600], [40, -580], [10, -584]], 5, rgba(sk.dk, .45), 5); } });
  if (fem) {
    const Ch = o.top || (kind === 'girl' ? PW.leafCloth : PW.indigoCloth);
    poFill(c, [[-26, -560], [50, -560], [56, -600], [58, -634], [40, -672], [8, -684], [-18, -672]], Ch.base, pdL(Ch, 80));
    if (wear === 'sari') {
      poFill(c, [[-48, -500], [30, -494], [60, -560], [60, -640], [36, -690], [0, -700], [-30, -690], [-6, -640], [-30, -560]], cloth.base, { ...pdL(cloth, 70), inside: () => fold([[40, -500], [40, -650]], cloth) });
      poBorder(c, [[30, -494], [60, -560], [60, -640], [36, -690]], 7, trim);
    }
  } else if (o.top) {
    const T = o.top;
    poFill(c, [[-60, -380], [64, -380], [70, -470], [74, -600], [66, -650], [40, -682], [-22, -698], [-50, -676], [-64, -620], [-66, -480]], T.base, { ...pdL(T, 120), inside: () => { fold([[20, -680], [24, -400]], T); fold([[-30, -660], [-40, -400]], T); } });
    poBorder(c, [[-60, -380], [64, -380]], 6, trim);
  } else {
    poLine(c, [[-6, -694], [20, -620], [44, -540], [52, -478]], 'rgba(246,240,224,.9)', 2.4);
    if (wear !== 'robe') poFill(c, [[-58, -500], [54, -500], [56, -470], [-56, -466]], trim.base, pdL(trim, 30));
  }
  if (wear === 'robe') { poFill(c, [[-56, -660], [-20, -698], [20, -692], [52, -560], [56, -470], [20, -464], [24, -560], [-6, -650], [-40, -630]], cloth.base, { ...pdL(cloth, 50) }); for (const [x, y] of poAlong([[30, -690], [50, -650], [58, -600], [54, -560]], 9)) ellipse(c, x, y, 4, 4, '#5A2E24'); }
  // neck and head
  poFill(c, [[-20, -690], [22, -690], [26, -722], [-12, -728]], sk.base, { sh: [6, 4, 6, rgba(sk.dk, .7)] });
  const hs = child ? 1.12 * 1.45 : 1.12;
  c.save(); c.translate(10, child ? -770 : -752); c.rotate((o.tilt || 0) + (kind === 'elder' ? .15 : 0)); c.scale(hs, hs);
  const hair = o.hair || { man: 'pagri', woman: 'bun', boy: 'tuft', girl: 'braid', elder: 'veil', sage: 'jata' }[kind];
  pdHead(c, { sk, face: kind === 'boy' ? 'boy' : kind === 'girl' ? 'girl' : fem ? 'woman' : 'man', hair, beard: kind === 'sage' ? 'sage' : o.beard, eye: o.eye || 'open', mouth: o.mouth || 'smile', brow: o.brow || 0,
    age: kind === 'elder' || kind === 'sage' ? 1 : 0, hairCol: kind === 'elder' ? '#D8D2CA' : o.hairCol, veil: o.veil || (kind === 'elder' ? PW.cotton : null), trim: trim.base, pagri: o.pagri, nath: o.nath ?? (kind === 'woman'), bindi: fem, tilak: kind === 'sage' ? 'tri' : o.tilak });
  c.restore();
  if (fem) poDots(c, [[30, -690], [46, -668], [54, -640]], 3, 7);                         // a necklace
  const N = arm(o.near, false); hand(N, false);
  prop(N, o.prop && o.prop.near);
  c.restore();
  c.restore();
}

// ---------- Lakshmi, seated on her heels ----------
// kneeling back on her heels: the knees forward on the ground (x ≈ 190), the hips over the heels (x ≈ -70), the waist at
// y ≈ -250 (the standing torso moved down by 220)
function pdLakshmi(c, o = {}) {
  const sk = PDX.lakshmi, S = PDX.sari, G = PDX.gold, serve = o.pose === 'serve', dy = 220;
  // the pallu's fall behind her back
  poFill(c, [[-40, -470 + dy], [-74, -420 + dy], [-104, -300 + dy], [-130, -120], [-110, -60], [-80, -140], [-60, -300 + dy]], S.base, pdL(S, 50));
  // the sari over the folded legs: from the waist round the hips, along the ground to the knees, back along the thigh
  const L = [[-46, -262], [-84, -230], [-118, -160], [-130, -80], [-128, -18], [-100, -4, 1], [60, -4], [200, -6, 1], [216, -36], [206, -70], [150, -96], [70, -130], [30, -190], [46, -256]];
  poFill(c, L, S.base, { ...pdL(S, 180), inside: () => {
    for (const [a, b] of [[[-60, -220], [-100, -40]], [[0, -200], [60, -40]], [[80, -110], [180, -40]]]) pdFold(c, [a, b], 6, rgba(S.dk, .5), 6);
    pdFold(c, [[40, -150], [120, -110], [200, -60]], 8, rgba(S.lt, .5), 8);
    const R = lcg(2); for (let i = 0; i < 30; i++) ellipse(c, -120 + R() * 320, -230 + R() * 220, 2.6, 3.2, G.base);
  } });
  poBorder(c, [[200, -6], [60, -4], [-100, -4]], 10, G);
  poBorder(c, [[46, -256], [30, -190], [70, -130], [150, -96], [206, -70]], 6, G);
  // a foot peeping out behind her, the sole up
  c.save(); c.translate(-128, -22); c.rotate(.2); c.scale(-1, 1); pdFoot(c, 0, 0, sk, { alta: true }); c.restore();
  c.save(); c.translate(0, dy);
  const TS = PD_TORSO.map(([x, y]) => [x * .86, y]);
  // the far arm
  const fa = serve ? [[-8, -650], [40, -560], [130, -560]] : [[-8, -650], [30, -560], [96, -520]];
  pdLimb(c, fa.slice(0, 2), [46, 38], sk, { col: sk.far }); pdLimb(c, fa.slice(1), [38, 30], sk, { col: sk.far });
  pdHand(c, ...fa[2], serve ? .1 : -.2, sk, serve ? 'open' : 'up', { col: sk.far });
  poFill(c, TS, sk.base, pdL(sk, 110));
  poFill(c, [[-34, -560], [50, -560], [56, -600], [58, -634], [40, -672], [-6, -684], [-36, -664]], PDX.maroon.base, pdL(PDX.maroon, 80));
  // the pallu across the chest and over her shoulder
  poFill(c, [[-48, -472], [34, -470], [60, -560], [60, -640], [36, -690], [0, -702], [-34, -692], [-6, -640], [-30, -560]], S.base, { ...pdL(S, 70), inside: () => pdFold(c, [[40, -490], [44, -660]], 5, rgba(S.dk, .5), 5) });
  poBorder(c, [[34, -470], [60, -560], [60, -640], [36, -690]], 8, G);
  // jewellery: necklaces, the waist belt
  poDots(c, [[30, -690], [50, -660], [58, -620]], 3.6, 8, G.base);
  poDots(c, [[24, -688], [40, -640], [46, -600], [40, -560]], 3, 7, PDX.pearl, false);
  pdGem(c, 46, -604, 6, PDX.ruby);
  poBorder(c, [[-48, -476], [0, -472], [46, -476]], 9, G);
  // neck and head
  poFill(c, [[-20, -690], [22, -690], [26, -722], [-12, -728]], sk.base, { sh: [6, 4, 6, rgba(sk.dk, .7)] });
  c.save(); c.translate(10, -752); c.rotate(o.tilt ?? (serve ? .2 : .06)); c.scale(1.16, 1.16);
  pdHead(c, { sk, face: 'woman', hair: 'mukut', eye: o.eye || 'low', mouth: 'smile', nath: true, bindi: true });
  c.restore();
  // the near arm; a lotus (seat) or both hands forward (serve)
  const na = serve ? [[6, -650], [56, -560], [150, -540]] : [[6, -650], [40, -560], [110, -500]];
  pdLimb(c, na.slice(0, 2), [50, 40], sk); pdLimb(c, na.slice(1), [40, 30], sk);
  poBorder(c, [[16, -606], [34, -602], [50, -606]], 8, G);
  if (!serve) { poLine(c, [[110, -500], [120, -560], [128, -640]], PO.leaf.dk, 4); poLotus(c, 128, -650, 34, .8, { base: '#C2506A', lt: '#E888A0', dk: '#7E2440' }); }
  pdHand(c, ...na[2], serve ? .05 : -.5, sk, serve ? 'open' : 'grip');
  c.restore();
}

// ---------- Bhumi Devi as a cow ----------
function pdBhumiCow(c, o = {}) {
  const C = PW.cow, G = PDX.gold, sad = o.mood !== 'hope', glw = o.glow ?? 1;
  if (glw) glow(c, 40, -280, 520, '#FFE9B8', .4 * glw, 'source-over');
  // the far legs
  const legF = (x, k) => { pdLimb(c, [[x, -260], [x + k, -150], [x + k * .7, -70], [x + k * .6, -22]], [66, 40, 28, 26], C, { col: C.far }); ellipse(c, x + k * .6, -12, 17, 13, '#5A4A48'); };
  legF(-180, -10); legF(170, 6);
  // the tail
  poLine(c, [[-250, -360], [-290, -300], [-296, -180], [-284, -90]], C.dk, 8);
  poFill(c, [[-296, -110], [-276, -100], [-270, -60], [-290, -40], [-304, -70]], '#5A4A48');
  // the body: the back, the belly, the hump at the withers, the dewlap
  const B = [[-260, -370], [-170, -400], [-40, -396], [90, -410], [150, -470], [196, -476], [236, -430], [270, -360], [264, -280], [240, -220], [180, -190], [60, -200], [-80, -196], [-200, -210], [-256, -260], [-272, -320]];
  poFill(c, B, C.base, { sh: [[0, 26, 26, rgba(C.dk, .75)], [24, 0, 20, rgba(C.dk, .4)]], hi: [0, -16, 16, rgba(C.lt, .95)],
    inside: () => { pdFold(c, [[-200, -300], [-160, -240]], 10, rgba(C.dk, .4), 10); pdFold(c, [[130, -400], [160, -260]], 10, rgba(C.dk, .3), 10); } });
  // the cloth on her back: red with a gold border and a lotus
  poFill(c, [[-150, -398], [80, -408], [100, -330], [76, -250], [-130, -240], [-170, -320]], PDX.sari.base, { ...pdL(PDX.sari, 120), inside: () => { const R = lcg(3); for (let i = 0; i < 16; i++) ellipse(c, -130 + R() * 200, -380 + R() * 120, 3, 3.6, G.base); } });
  poBorder(c, [[-150, -398], [-170, -320], [-130, -240], [76, -250], [100, -330], [80, -408]], 8, G);
  poLotus(c, -36, -320, 30, 1, { base: '#E0B04C', lt: '#F6D88A', dk: '#A07624' });
  // the near legs
  const leg = (x, k) => { pdLimb(c, [[x, -270], [x + k, -150], [x + k * .7, -70], [x + k * .6, -22]], [74, 44, 30, 28], C); ellipse(c, x + k * .6, -10, 18, 13, '#4A3C3A'); poDots(c, [[x + k * .6 - 16, -34], [x + k * .6, -38], [x + k * .6 + 16, -34]], 3, 6, G.base); };
  leg(-210, 14); leg(200, -8);
  // the neck and head, lowered when sad
  c.save(); c.translate(250, -380); c.rotate(sad ? .42 : -.12);
  poFill(c, [[-60, -70], [40, -60], [120, -30], [150, 20], [110, 70], [20, 110], [-40, 140], [-70, 60]], C.base, { sh: [0, 18, 18, rgba(C.dk, .7)], hi: [0, -10, 10, rgba(C.lt, .9)] });
  // the dewlap folds and a bell
  poFill(c, [[-40, 100], [20, 110], [10, 170], [-30, 200], [-60, 160]], C.base, { sh: [10, 10, 12, rgba(C.dk, .7)] });
  poLine(c, [[-46, 60], [20, 90], [60, 60]], PDX.maroon.base, 6);
  c.save(); c.translate(-6, 100); poFill(c, [[-12, -6], [12, -6], [16, 20], [-16, 20]], G.base, pdL(G, 30)); ellipse(c, 0, 22, 4, 4, G.dk); c.restore();
  // the head: a long gentle face
  c.translate(130, 0);
  poFill(c, [[-34, -44], [10, -52], [70, -34], [130, -12], [154, 18], [150, 54], [116, 68], [50, 66], [-10, 58], [-44, 24]], C.base, { sh: [[0, 14, 14, rgba(C.dk, .7)], [10, 0, 10, rgba(C.dk, .4)]], hi: [0, -8, 8, rgba(C.lt, .95)] });
  poFill(c, [[110, 6], [150, 12], [160, 36], [150, 58], [116, 62]], '#BFA0A2', { sh: [4, 4, 4, 'rgba(120,80,90,.6)'] });   // the muzzle
  ellipse(c, 142, 32, 5, 3.4, '#6A3A3A');
  // horns, small and painted, and the ears (drooping when sad)
  for (const [hx, k] of [[-4, 0], [10, 1]]) poFill(c, poLimb([[hx, -38], [hx - 6, -70], [hx + 10, -96]], [16, 12, 4]), k ? '#C6A878' : '#AE9264', { sh: [3, 0, 3, 'rgba(110,80,50,.7)'] });
  poBorder(c, [[-12, -66], [2, -62], [16, -66]], 5, G);
  c.save(); c.translate(-14, -10); c.rotate(sad ? -1.35 : -.75);
  poFill(c, [[0, -10], [-30, -16], [-70, -4], [-80, 10], [-60, 18], [-20, 14]], C.base, { sh: [0, 6, 6, rgba(C.dk, .8)], inside: () => poFill(c, [[-10, -4], [-60, 0], [-64, 8], [-20, 8]], '#E2B4B0') });
  c.restore();
  // the eye: big, dark, lashed; a tear when sad
  ellipse(c, 44, -8, 13, 10, '#2A1E22'); ellipse(c, 40, -12, 3.4, 2.6, 'rgba(255,255,255,.85)');
  poLine(c, [[30, -14], [44, sad ? -16 : -19], [60, -12]], 'rgba(30,20,24,.9)', 3);
  for (let i = 0; i < 4; i++) poLine(c, [[34 + i * 7, -16 + (sad ? 0 : -2)], [32 + i * 7, -24]], 'rgba(30,20,24,.8)', 1.4);
  if (sad) { poLine(c, [[40, 4], [36, 20], [38, 34]], 'rgba(200,226,246,.9)', 3); ellipse(c, 38, 38, 4, 5.4, 'rgba(210,232,250,.95)'); }
  // a tilak of kumkum and a garland on the brow
  ellipse(c, 76, -32, 4, 6, PO.red);
  c.restore();
}
