// sun_props.js: sets, props and the one-reel characters of "Baby HANUMAN tried to EAT the SUN" (sun.js).
//   surya(x, y, R, o)            the Sun with a face: rays that turn and soften, eyes, mouth, a wink, a puff
//   rahu(x, y, s, o)             Rahu, only a head (as in the myth), wild smoky hair, a crown, a smoky wisp below
//   brahma(x, y, s, o)           Brahma on a lotus (ad 13's)
//   thought(x, y, r, k, fromX, fromY, fill)   a thought bubble with trailing puffs; fill(cx, cy, r) paints inside
//   mango(x, y, s, o) · jamun(x, y, s) · ghostFruit(x, y, s) · basket(x, y, s, n) · cloud(x, y, s, o) · bird(x, y, s, o)
//   clearingSet(t, o) · skySet(t, o) · nightSet(t, o) · peakSet(t, o) · followCard(t, C)
const SK = {
  ink: '#3A2A30', cream: '#FFF5E2',
  lilac: '#BBA9DA', peach: '#F8BC8E', dawn: '#FFD9A2', hillFar: '#A596C8', hill: '#7FAE72', hillDk: '#5E8E5E', grass: '#8CBC72', grassDk: '#6A9A58',
  trunk: '#7A4A30', trunkDk: '#55301E', leaf: '#5E9A5E', leafDk: '#3F7A4E', leafLt: '#86BC74', plate: '#6FA85A',
  sun: '#FFB83A', sunDk: '#F2862A', sunLt: '#FFE08A', ray: '#FFCF4A', rayDk: '#F79A2E', sunCheek: '#FF8A5A', sunMouth: '#B2401E',
  mango: '#FFBE2E', mangoDk: '#F2861E', mangoBlush: '#F25A2A', mangoLt: '#FFE27A', stalk: '#6A4A2A',
  jamun: '#4A2A5E', jamunLt: '#8A5AA8',
  skyTop: '#5FA8E0', sky: '#8ECBEE', skyLow: '#CDEBFA', cloud: '#FFFFFF', cloudDk: '#D6E6F2',
  nightTop: '#0F1440', night: '#1E2766', nightLow: '#3A3480', star: '#FFF3C8',
  storm: '#2E3566', stormLt: '#4A5288', stormCl: '#5A6296', stormClDk: '#3E4672', bolt: '#FFF0A0',
  rock: '#A08A78', rockDk: '#7A6656', rockLt: '#C4AE98', cave: '#2A2438',
  rahu: '#6C719E', rahuDk: '#4A4E7A', rahuLt: '#9298C2', rahuHair: '#2A2440', rahuSmoke: '#4A4468', fang: '#FFF8EC', rahuMouth: '#5A1E2E',
  gold: '#EDB43C', goldDk: '#B67D1C', goldLt: '#FFE39A',
  lotus: '#F4A6B8', lotusDk: '#E0708C', brahma: '#F2B48A', brahmaDk: '#D08A60', beard: '#FBF5EA', robe: '#E0573A', robeDk: '#A83A26', arch: '#F2C76A', archDk: '#C9962E', thali: '#E8C25A',
  wicker: '#C98A4A', wickerDk: '#8E5A2A', saffron: '#F39A2E', rkOrange: '#F15A24', rkPeach: '#FBE0CF', teal: '#2E5F5A', brown: '#3A2418', grey: '#6B5A50',
};

// ---------- the Sun ----------
// o: rot (the rays turn), soft 0..1 (the rays round off: gentle), mood: eyes 'open' | 'closed' | 'happy' | 'wide' |
// 'wink' | 'puff'; mouth 'smile' | 'O' | 'grin' | 'puff' | 'gasp'; lookX/lookY; sweat; blush; mango 0..1 (in the baby's
// eyes: a stalk and a leaf grow, the disc goes mango-gold and pear-shaped); squash [sx, sy]; glowK; key
function surya(x, y, R, o = {}) {
  const key = o.key || 'sun', sw = clamp(R / 90, .6, 2.4), mg = clamp(o.mango || 0), sf = clamp(o.soft || 0), INK = SK.ink;
  const [sx, sy] = o.squash || [1, 1];
  boilSeed(key + 'glow');
  glow(x, y, R * 2.6, '#FFC766', o.glowK ?? .9);
  glow(x, y, R * 1.6, '#FFE6A0', (o.glowK ?? .9) * .7);
  push(); translate(x, y); scale(sx, sy);
  // rays: 12 long and 12 short, alternating; soft rounds them into petals
  boilSeed(key + 'rays');
  const rot = o.rot ?? T * .15, nR = 12;
  if (mg < .98) for (let i = 0; i < nR * 2; i++) {
    const a = rot + i / (nR * 2) * TAU, long = i % 2 === 0, L = R * (long ? 1.55 - sf * .25 : 1.3 - sf * .12) * (1 - mg), w = (long ? .16 : .11) * (1 + sf * .6);
    if (L < R * 1.02) continue;
    const pts = [[Math.cos(a - w) * R * .92, Math.sin(a - w) * R * .92], [Math.cos(a) * L, Math.sin(a) * L], [Math.cos(a + w) * R * .92, Math.sin(a + w) * R * .92]];
    if (sf > .3) pts.splice(1, 0, [Math.cos(a - w * .5) * (L - R * .08), Math.sin(a - w * .5) * (L - R * .08)]), pts.splice(3, 0, [Math.cos(a + w * .5) * (L - R * .08), Math.sin(a + w * .5) * (L - R * .08)]);
    paint(pts, { wash: long ? SK.ray : SK.rayDk, ink: INK, sw: sw * .6, curv: sf * .6 });
  }
  // the disc (a mango in his eyes: narrower at the top, a blush on one side)
  boilSeed(key + 'disc');
  const D = []; for (let i = 0; i < 30; i++) { const a = i / 30 * TAU, c = Math.cos(a), s = Math.sin(a); D.push([c * R * (1 - mg * (.12 + .1 * -s)), s * R * (1 + mg * .1) + mg * R * .05 * c]); }
  paint(D, { wash: mixCol(SK.sun, SK.mango, mg), fill: SK.sunDk, fillOp: 60, bleed: .1, tex: .5, border: .5, ink: INK, sw, curv: .5 });
  paint(ellPts(-R * .3, -R * .35, R * .45, R * .3, 18, 0, -.5), { wash: SK.sunLt, washOp: 160, ink: null });
  if (mg > 0) paint(ellPts(R * .45, R * .25, R * .4 * mg, R * .5 * mg, 18), { fill: SK.mangoBlush, fillOp: 150 * mg, bleed: .3, tex: .5, ink: null });
  if (mg > .05) {   // the stalk and a leaf
    boilSeed(key + 'stalk');
    const k = easeOut(mg), top = -R * 1.08;
    paint(ribbon([[0, top + R * .1], [R * .05, top - R * .12 * k], [R * .15, top - R * .2 * k]], R * .1, R * .07), { wash: SK.stalk, ink: INK, sw: sw * .6 });
    push(); translate(R * .1, top - R * .12 * k); rotate(-.5 + Math.sin(T * 3) * .06); scale(k);
    paint([[0, 0], [R * .25, -R * .2], [R * .6, -R * .22], [R * .85, -R * .08], [R * .6, R * .06], [R * .25, R * .06]], { wash: SK.leaf, fill: SK.leafDk, fillOp: 60, ink: INK, sw: sw * .6, curv: .5 });
    inkLine([[R * .05, -R * .02], [R * .75, -R * .1]], sw * .4, SK.leafDk, 'inkfine', .5);
    pop();
  }
  // the face (fades in the mango)
  if ((o.face ?? 1) > 0 && mg < .7) {
    boilSeed(key + 'face');
    const F = (a, b) => [a * R, b * R], ek = o.eyes || 'open', lx = (o.lookX || 0) * .06, ly = (o.lookY || 0) * .05;
    for (const s of [-1, 1]) {
      const ex = s * .32, ey = -.12, k = ek === 'wink' && s > 0 ? 'happy' : ek === 'wink' ? 'open' : ek;
      if (k === 'closed') inkLine([F(ex - .12, ey), F(ex, ey + .07), F(ex + .12, ey)], sw * 1.3, INK, 'ink', .6);
      else if (k === 'happy') inkLine([F(ex - .12, ey + .04), F(ex, ey - .08), F(ex + .12, ey + .04)], sw * 1.4, INK, 'ink', .6);
      else if (k === 'puff') inkLine([F(ex - .12, ey - .04), F(ex + .02 * s, ey + .02), F(ex - .12, ey + .07)], sw * 1.3, INK, 'ink', .3);
      else {
        const r = k === 'wide' ? .13 : .1;
        paint(ellPts(ex * R, ey * R, r * R, r * 1.15 * R, 14), { wash: SK.cream, ink: INK, sw: sw * .6 });
        paint(ellPts((ex + lx) * R, (ey + ly + .01) * R, (k === 'wide' ? .045 : .065) * R, (k === 'wide' ? .055 : .08) * R, 10), { wash: INK, ink: null });
        paint(ellPts((ex + lx - .02) * R, (ey + ly - .025) * R, .022 * R, .022 * R, 6), { wash: SK.cream, ink: null });
      }
    }
    if (o.blush ?? 1) for (const s of [-1, 1]) paint(ellPts(s * .52 * R, .12 * R, .14 * R, .08 * R, 12), { fill: SK.sunCheek, fillOp: 150, bleed: .2, ink: null });
    const m = o.mouth || 'smile', my = .22;
    if (m === 'smile') inkLine([F(-.16, my), F(0, my + .09), F(.16, my)], sw * 1.2, INK, 'ink', .6);
    else if (m === 'grin') { paint([F(-.2, my - .02), F(.2, my - .02), F(.12, my + .12), F(0, my + .15), F(-.12, my + .12)], { wash: SK.sunMouth, ink: INK, sw: sw * .7, curv: .5 }); }
    else if (m === 'O' || m === 'gasp') paint(ellPts(0, (my + .06) * R, (m === 'gasp' ? .1 : .07) * R, (m === 'gasp' ? .13 : .09) * R, 12), { wash: SK.sunMouth, ink: INK, sw: sw * .7 });
    else if (m === 'puff') { paint(ellPts(0, (my + .03) * R, .05 * R, .035 * R, 8), { wash: SK.sunDk, ink: INK, sw: sw * .6 }); for (const s of [-1, 1]) paint(ellPts(s * .4 * R, (my - .02) * R, .16 * R, .12 * R, 12), { wash: mixCol(SK.sun, SK.sunLt, .5), ink: null }); }
    if (o.sweat) paint([F(.62, -.5), F(.7, -.36), F(.62, -.3), F(.55, -.36)], { wash: '#9ED0F0', ink: INK, sw: sw * .5, curv: .6 });
  }
  pop();
  if (o.tint) { boilSeed(key + 'tint'); paint(ellPts(x, y, R * sx, R * sy, 30), { wash: o.tint, washOp: 120 * (o.tintK ?? 1), ink: null }); }
}

// ---------- Rahu: a head, only a head ----------
// o: eyes 'hungry' | 'wide' | 'scared' | 'sad'; mouth 'lick' | 'O' | 'wail' | 'grin'; lookX; tears; flip; puff; tint; key
function rahu(x, y, s, o = {}) {
  const u = s, sw = clamp(u / 22, .5, 2), INK = SK.ink, key = o.key || 'rahu', P = pts => pts.map(([a, b]) => [a * u, b * u]);
  push(); translate(x, y); if (o.flip) scale(-1, 1); if (o.rot) rotate(o.rot);
  // the smoky wisp where a body would be
  boilSeed(key + 'smoke');
  const wv = Math.sin(T * 4) * .4;
  paint(P(ribbon([[0, 2.2], [-.6 + wv, 3.6], [.5 - wv, 4.8], [-.3 + wv, 6.0], [.4, 6.8]], 3.4, .2)), { wash: SK.rahuSmoke, washOp: 220, ink: INK, sw: sw * .6 });
  // wild hair, a dark smoky mane behind the face
  boilSeed(key + 'hair');
  const H = []; for (let i = 0; i < 18; i++) { const a = -Math.PI * 1.05 + i / 17 * Math.PI * 1.1, r = i % 2 ? 3.6 : 4.4 + .3 * Math.sin(T * 5 + i); H.push([Math.cos(a) * r, Math.sin(a) * r * .95 - .3]); }
  H.push([3.0, 1.2], [-3.0, 1.2]);
  paint(P(H), { wash: SK.rahuHair, ink: INK, sw: sw * .7, curv: .3 });
  // the face
  boilSeed(key + 'face');
  const pf = clamp(o.puff || 0), col = o.tint ? mixCol(SK.rahu, o.tint, .5) : SK.rahu;
  paint(P([[-2.6 - pf * .4, -.6], [-2.3, -2.2], [0, -2.8], [2.3, -2.2], [2.6 + pf * .4, -.6], [2.3 + pf * .4, 1.2], [1.2, 2.3], [0, 2.6], [-1.2, 2.3], [-2.3 - pf * .4, 1.2]]), { wash: col, fill: SK.rahuDk, fillOp: 40, ink: INK, sw, curv: .5 });
  // a crown, a bit crooked
  paint(P([[-1.7, -2.3], [-1.8, -3.3], [-1.1, -2.8], [-.6, -3.8], [0, -3.0], [.6, -3.8], [1.1, -2.8], [1.8, -3.3], [1.7, -2.3]]), { wash: SK.gold, fill: SK.goldDk, fillOp: 40, ink: INK, sw: sw * .6, curv: .1 });
  // brows, eyes
  const ek = o.eyes || 'hungry', lx = (o.lookX || 0) * .2;
  for (const sd of [-1, 1]) {
    const ex = sd * .95, ey = -.7;
    const r = ek === 'wide' || ek === 'scared' ? .62 : .48;
    paint(ellPts(ex * u, ey * u, r * u, (r + .1) * u, 14), { wash: '#FFF4C8', ink: INK, sw: sw * .6 });
    paint(ellPts((ex + lx) * u, (ey + .05) * u, (ek === 'scared' ? .12 : .22) * u, (ek === 'scared' ? .14 : .26) * u, 10), { wash: INK, ink: null });
    const by = ek === 'hungry' ? -1.5 + sd * 0 : ek === 'sad' || ek === 'scared' ? -1.6 : -1.75;
    inkLine(P([[sd * .4, by + (ek === 'hungry' ? .25 : ek === 'sad' || ek === 'scared' ? -.2 : 0)], [sd * 1.5, by - (ek === 'hungry' ? .1 : ek === 'sad' || ek === 'scared' ? -.25 : 0)]]), sw * 2, SK.rahuHair, 'ink', 0);
  }
  // nose, moustache, mouth with fangs
  inkLine(P([[0, -.2], [-.2, .3], [.15, .4]]), sw * .6, SK.rahuDk, 'inkfine', .5);
  const m = o.mouth || 'grin', my = 1.2;
  if (m === 'lick' || m === 'grin') {
    paint(P([[-1.2, my - .2], [1.2, my - .2], [.8, my + .45], [0, my + .6], [-.8, my + .45]]), { wash: SK.rahuMouth, ink: INK, sw: sw * .7, curv: .5 });
    for (const sd of [-1, 1]) paint(P([[sd * .75, my - .2], [sd * .45, my - .2], [sd * .6, my + .35]]), { wash: SK.fang, ink: INK, sw: sw * .4 });
    if (m === 'lick') { const lk = Math.sin(T * 7); paint(P(ribbon([[.2, my + .1], [.9 + lk * .1, my + .2], [1.35, my - .1 + lk * .15]], .6, .45)), { wash: '#E2607A', ink: INK, sw: sw * .5 }); }
  } else if (m === 'O') { paint(ellPts(0, (my + .2) * u, .45 * u, .55 * u, 12), { wash: SK.rahuMouth, ink: INK, sw: sw * .7 }); }
  else if (m === 'wail') {
    paint(P([[-1.2, my - .3], [1.2, my - .3], [.9, my + .9], [0, my + 1.2], [-.9, my + .9]]), { wash: SK.rahuMouth, ink: INK, sw: sw * .7, curv: .5 });
    for (const sd of [-1, 1]) paint(P([[sd * .8, my - .3], [sd * .5, my - .3], [sd * .65, my + .2]]), { wash: SK.fang, ink: INK, sw: sw * .4 });
  }
  if (o.tears) for (const sd of [-1, 1]) {
    const k = frac(T * 2.5 + (sd > 0 ? .5 : 0));
    paint(P([[sd * (1.6 + k * 1.2), -.3 + k * .6], [sd * (1.9 + k * 1.2), .1 + k * .6], [sd * (1.6 + k * 1.2), .4 + k * .6], [sd * (1.35 + k * 1.2), .1 + k * .6]]), { wash: '#9ED0F0', ink: INK, sw: sw * .4, curv: .6 });
  }
  pop();
}

// ---------- Brahma on a lotus (ad 13's): four heads (three seen), white beards, four arms ----------
// (x, y) the base of the lotus, s the size (about 1 = 300 px tall); o: glow 0..1, eyes, bless 0..1, brows, lookX
function brahma(x, y, s, o = {}) {
  const u = 30 * s, P = pts => pts.map(([a, b]) => [x + a * u, y + b * u]), INK = SK.ink, sw = clamp(u / 25, .5, 1.6);
  glow(x, y - 5 * u, 7 * u, '#FFE08A', .8 * (o.glow ?? 1));
  boilSeed('brlotus');
  for (let i = 0; i < 7; i++) { const a = lerp(-2.6, -.54, i / 6), L = 2.6 + .4 * (i % 2); paint(P([[0, -.2], [Math.cos(a - .25) * L * .6, Math.sin(a - .25) * L * .5 - .2], [Math.cos(a) * L, Math.sin(a) * L * .55 - .2], [Math.cos(a + .25) * L * .6, Math.sin(a + .25) * L * .5 - .2]]), { wash: i % 2 ? SK.lotus : '#F8C4D0', ink: INK, sw: sw * .6, curv: .5 }); }
  paint(P([[-3.2, -.4], [3.2, -.4], [2.6, .3], [-2.6, .3]]), { wash: SK.lotusDk, ink: INK, sw: sw * .6, curv: .5 });
  boilSeed('brbody');
  for (const sd of [-1, 1]) paint(P(ribbon([[sd * 1.3, -5.6], [sd * 2.6, -6.6], [sd * 3.0, -7.8]], .55, .45)), { wash: SK.brahma, ink: INK, sw: sw * .6 });
  paint(ellPts(x - 3.0 * u, y - 7.9 * u, .38 * u, .34 * u, 10), { wash: SK.brahma, ink: INK, sw: sw * .5 });
  paint(ellPts(x + 3.0 * u, y - 7.9 * u, .38 * u, .34 * u, 10), { wash: SK.brahma, ink: INK, sw: sw * .5 });
  { const m = []; for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; m.push([x + (-3.0 + Math.cos(a) * .6) * u, y + (-7.3 + Math.sin(a) * .6) * u]); } for (const p of m) paint(ellPts(p[0], p[1], .12 * u, .12 * u, 6), { wash: '#8A4E2E', ink: null }); }
  paint(P([[2.7, -8.2], [3.4, -8.2], [3.6, -9.0], [3.3, -9.5], [2.9, -9.5], [2.6, -9.0]]), { wash: SK.thali, ink: INK, sw: sw * .5, curv: .4 });
  paint(P([[-2.6, -.4], [-2.9, -1.4], [-1.6, -2.0], [0, -1.8], [1.6, -2.0], [2.9, -1.4], [2.6, -.4]]), { wash: SK.robe, fill: SK.robeDk, fillOp: 50, ink: INK, sw: sw * .7, curv: .4 });
  paint(P([[-1.5, -6.0], [1.5, -6.0], [1.9, -4.2], [1.7, -1.8], [-1.7, -1.8], [-1.9, -4.2]]), { wash: SK.brahma, fill: SK.brahmaDk, fillOp: 40, ink: INK, sw: sw * .7, curv: .4 });
  paint(P(ribbon([[-1.5, -5.7], [0, -4.0], [1.6, -2.4]], .7, .7)), { wash: SK.robe, ink: INK, sw: sw * .5 });
  paint(P(ribbon([[-1.5, -5.4], [-2.3, -4.0], [-1.4, -3.0]], .6, .5)), { wash: SK.brahma, ink: INK, sw: sw * .6 });
  paint(P([[-2.2, -3.4], [-.6, -3.4], [-.6, -2.4], [-2.2, -2.4]]), { wash: '#B5643E', ink: INK, sw: sw * .6 });
  inkLine(P([[-1.4, -3.4], [-1.4, -2.4]]), sw * .6, INK, 'inkfine', 0);
  const bl = o.bless ?? 0;
  paint(P(ribbon([[1.5, -5.4], [2.4, -4.6], [2.2, -5.6 - bl * .4]], .6, .5)), { wash: SK.brahma, ink: INK, sw: sw * .6 });
  paint(P([[1.85, -5.5 - bl * .4], [2.55, -5.5 - bl * .4], [2.6, -6.4 - bl * .4], [1.8, -6.4 - bl * .4]]), { wash: SK.brahma, ink: INK, sw: sw * .5, curv: .5 });
  if (bl > .05) glow(x + 2.2 * u, y - 6 * u, 1.6 * u * bl, '#FFF0B0', .9 * bl);
  boilSeed('brheads');
  const face = (cx, cy, sc, side) => {
    const Q = pts => pts.map(([a, b]) => [x + (cx + a * sc * (side || 1)) * u, y + (cy + b * sc) * u]);
    paint(Q([[-.9, -.2], [-.85, -.9], [0, -1.15], [.85, -.9], [.9, -.2], [.6, .5], [0, .65], [-.6, .5]]), { wash: SK.brahma, ink: INK, sw: sw * .6, curv: .5 });
    paint(Q([[-.85, .0], [-.3, .25], [0, .2], [.3, .25], [.85, .0], [.6, .9], [0, 1.4], [-.6, .9]]), { wash: SK.beard, ink: INK, sw: sw * .5, curv: .5 });
    paint(Q([[-.75, -.8], [-.6, -1.6], [-.3, -1.35], [0, -1.9], [.3, -1.35], [.6, -1.6], [.75, -.8]]), { wash: SK.arch, fill: SK.archDk, fillOp: 50, ink: INK, sw: sw * .5, curv: .1 });
    const ek = o.eyes || 'closed', lx = (o.lookX || 0) * .08;
    for (const e of side ? [.3] : [-.32, .32]) {
      const ex = cx + e * sc * (side || 1), ey = cy - .25 * sc;
      if (ek === 'closed') inkLine([[x + (ex - .14 * sc) * u, y + ey * u], [x + ex * u, y + (ey + .08 * sc) * u], [x + (ex + .14 * sc) * u, y + ey * u]], sw, INK, 'ink', .5);
      else { paint(ellPts(x + ex * u, y + ey * u, .14 * sc * u, .16 * sc * u, 10), { wash: '#FFF8EC', ink: INK, sw: sw * .4 }); paint(ellPts(x + (ex + lx) * u, y + ey * u, .07 * sc * u, .09 * sc * u, 8), { wash: INK, ink: null }); }
      inkLine([[x + (ex - .16 * sc) * u, y + (ey - .22 * sc - (o.brows || 0) * .1) * u], [x + (ex + .16 * sc) * u, y + (ey - .25 * sc - (o.brows || 0) * .12) * u]], sw * 1.1, '#E8E0D0', 'ink', 0);
    }
    inkLine(Q([[-.2, .3], [0, .38], [.2, .3]]), sw * .8, INK, 'ink', .5);
  };
  face(-1.15, -6.9, .78, -1); face(1.15, -6.9, .78, 1); face(0, -7.2, 1, 0);
}

// ---------- small props ----------
// a thought bubble: k 0..1 pops it (the trailing puffs first), from (fromX, fromY) (the thinker's head) to (x, y)
function thought(x, y, r, k, fromX, fromY, fill, key = 'th') {
  if (k <= 0) return;
  boilSeed(key);
  for (let i = 0; i < 3; i++) {
    const kk = backOut(clamp(k * 3 - i * .5)); if (kk <= 0) continue;
    const f = (i + 1) / 4, px = lerp(fromX, x, f * .8), py = lerp(fromY, y, f * .8), pr = r * (.08 + i * .05) * kk;
    paint(ellPts(px, py, pr, pr, 12), { wash: SK.cream, ink: SK.ink, sw: 1 });
  }
  const kb = backOut(clamp(k * 2.2 - .9)); if (kb <= 0) return;
  const C = []; for (let i = 0; i < 9; i++) { const a = i / 9 * TAU + .2, rr = r * kb * (1 + .1 * Math.sin(i * 2.3)); C.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr * .82]); }
  for (const [cx, cy] of C) paint(ellPts(cx, cy, r * .32 * kb, r * .3 * kb, 14), { wash: SK.cream, ink: SK.ink, sw: 1.1 });
  paint(ellPts(x, y, r * kb * .95, r * kb * .8, 24), { wash: SK.cream, ink: null });
  if (kb > .6) fill(x, y, r * kb);
}
function mango(x, y, s, o = {}) {
  boilSeed(o.key || 'mango');
  push(); translate(x, y); rotate(o.rot || 0);
  const D = []; for (let i = 0; i < 24; i++) { const a = i / 24 * TAU, c = Math.cos(a), sn = Math.sin(a); D.push([c * s * (.82 - .12 * -sn), sn * s + .08 * s * c]); }
  paint(D, { wash: SK.mango, fill: SK.mangoDk, fillOp: 60, tex: .5, ink: SK.ink, sw: clamp(s / 40, .5, 1.6), curv: .5 });
  paint(ellPts(s * .35, s * .25, s * .35, s * .45, 14), { fill: SK.mangoBlush, fillOp: 140, bleed: .3, ink: null });
  paint(ellPts(-s * .3, -s * .35, s * .18, s * .25, 10, 0, -.4), { wash: SK.mangoLt, washOp: 180, ink: null });
  if (o.bite) {   // a bite out of the top right: a cream scallop
    const bx = s * .45, by = -s * .5;
    for (const [dx, dy] of [[-.15, .05], [.05, .15], [.2, 0]]) paint(ellPts(bx + dx * s, by + dy * s, s * .2, s * .2, 12), { wash: '#FFE9A0', ink: SK.ink, sw: .8 });
  }
  paint(ribbon([[0, -s * .95], [s * .05, -s * 1.15], [s * .14, -s * 1.22]], s * .1, s * .07), { wash: SK.stalk, ink: SK.ink, sw: .8 });
  push(); translate(s * .1, -s * 1.12); rotate(-.6);
  paint([[0, 0], [s * .25, -s * .18], [s * .55, -s * .2], [s * .75, -s * .08], [s * .55, s * .05], [s * .25, s * .05]], { wash: SK.leaf, ink: SK.ink, sw: .8, curv: .5 });
  pop(); pop();
}
function jamun(x, y, s) {
  boilSeed('jamun');
  push(); translate(x, y); rotate(-.2);
  paint(ellPts(0, 0, s * .72, s, 20), { wash: SK.jamun, fill: '#2A1438', fillOp: 60, ink: SK.ink, sw: 1 });
  paint(ellPts(-s * .25, -s * .4, s * .15, s * .25, 10, 0, -.3), { wash: SK.jamunLt, washOp: 200, ink: null });
  paint(ribbon([[0, -s], [s * .1, -s * 1.25]], s * .12, s * .08), { wash: SK.stalk, ink: SK.ink, sw: .8 });
  pop();
}
// Airavata as a fruit, in the baby's eyes: a big white round fruit with a leaf, four tiny tusks and a little trunk
function ghostFruit(x, y, s) {
  boilSeed('gfruit');
  push(); translate(x, y);
  paint(ellPts(0, 0, s, s * .92, 22), { wash: '#F4F6FA', fill: '#C3C9D6', fillOp: 70, ink: SK.ink, sw: 1.1 });
  paint(ellPts(-s * .35, -s * .4, s * .25, s * .18, 10, 0, -.4), { wash: '#FFFFFF', ink: null });
  for (const sd of [-1, 1]) for (const k of [.25, .45]) paint(ribbon([[sd * k * s, s * .3], [sd * (k + .12) * s, s * .5]], s * .1, s * .02), { wash: '#FFF6E0', ink: SK.ink, sw: .6 });
  paint(ribbon([[0, s * .15], [0, s * .55], [s * .12, s * .7]], s * .2, s * .1), { wash: '#E6E9F0', ink: SK.ink, sw: .7 });
  for (const sd of [-1, 1]) paint(ellPts(sd * .3 * s, -.05 * s, .07 * s, .08 * s, 8), { wash: SK.ink, ink: null });
  paint(ribbon([[0, -s * .9], [s * .05, -s * 1.15]], s * .1, s * .07), { wash: SK.stalk, ink: SK.ink, sw: .8 });
  push(); translate(s * .05, -s * 1.08); rotate(-.5); paint([[0, 0], [s * .25, -s * .18], [s * .55, -s * .2], [s * .7, -s * .06], [s * .5, s * .05]], { wash: SK.leaf, ink: SK.ink, sw: .8, curv: .5 }); pop();
  pop();
}
function basket(x, y, s, n = 5, key = 'basket') {
  boilSeed(key + 'm');
  const spots = [[-.55, -.55], [.05, -.7], [.6, -.5], [-.25, -.95], [.35, -1.0]].slice(0, n);
  for (const [a, b] of spots) mango(x + a * s, y + b * s, s * .38, { rot: a * .6, key: key + a });
  boilSeed(key);
  paint([[x - s * 1.1, y - s * .55], [x + s * 1.1, y - s * .55], [x + s * .85, y + s * .45], [x - s * .85, y + s * .45]], { wash: SK.wicker, fill: SK.wickerDk, fillOp: 60, tex: .6, ink: SK.ink, sw: 1.2, curv: .2 });
  for (let i = 1; i < 4; i++) inkLine([[x - s * (1.1 - i * .06), y - s * .55 + i * s * .25], [x + s * (1.1 - i * .06), y - s * .55 + i * s * .25]], .8, SK.wickerDk, 'inkfine', .2);
  for (let i = -4; i <= 4; i++) inkLine([[x + i * s * .24, y - s * .55], [x + i * s * .19, y + s * .45]], .6, SK.wickerDk, 'inkfine', 0);
  paint(ribbon([[x - s * 1.15, y - s * .55], [x + s * 1.15, y - s * .55]], s * .16, s * .16), { wash: SK.wicker, ink: SK.ink, sw: 1 });
}
function cloud(x, y, s, o = {}) {
  boilSeed(o.key || 'cl' + Math.round(x * 3 + y));
  const c = o.col || SK.cloud, d = o.dk || SK.cloudDk;
  const B = [[-1.0, .1, .55], [-.45, -.25, .7], [.25, -.35, .8], [.9, 0, .55], [.3, .2, .6], [-.4, .25, .55]];
  for (const [a, b, r] of B) paint(ellPts(x + a * s, y + b * s, r * s, r * s * .8, 16), { wash: c, fill: d, fillOp: 40, tex: .4, ink: o.ink === false ? null : SK.ink, sw: o.sw ?? 1 });
  paint(ellPts(x, y + .1 * s, 1.2 * s, .45 * s, 18), { wash: c, ink: null });
}
function bird(x, y, s, o = {}) {
  boilSeed(o.key || 'bird' + Math.round(x));
  const f = Math.sin((o.flap ?? T * 3) * TAU), P = pts => pts.map(([a, b]) => [x + a * s * (o.flip ? -1 : 1), y + b * s]);
  paint(P([[-.9, 0], [-.3, -.3], [.4, -.25], [.9, -.05], [.4, .25], [-.3, .25]]), { wash: o.col || '#F2EDE4', ink: SK.ink, sw: .9, curv: .5 });
  paint(P([[-.1, -.1], [-.5, -.1 - f * .8], [.3, -.15 - f * .5]]), { wash: o.col || '#F2EDE4', ink: SK.ink, sw: .8, curv: .4 });
  paint(P([[.85, -.1], [1.2, 0], [.85, .05]]), { wash: '#F2A93B', ink: SK.ink, sw: .6 });
  if (o.eye === 'wide') { paint(ellPts(...P([[.55, -.08]])[0], .16 * s, .18 * s, 8), { wash: '#FFFFFF', ink: SK.ink, sw: .5 }); paint(ellPts(...P([[.57, -.07]])[0], .06 * s, .07 * s, 6), { wash: SK.ink, ink: null }); }
  else paint(ellPts(...P([[.55, -.08]])[0], .06 * s, .07 * s, 6), { wash: SK.ink, ink: null });
}

// ---------- sets ----------
const gradBands = (cols, y0 = -80, y1 = H + 80, key = 'grad') => {
  boilSeed(key);
  const n = cols.length;
  paint(rectPts(-80, y0, W + 160, y1 - y0), { wash: cols[n - 1], ink: null });
  for (let i = n - 2; i >= 0; i--) { const yb = lerp(y0, y1, (i + 1) / n); paint([[-80, y0], [W + 80, y0], [W + 80, yb + 40], [W * .5, yb + 70], [-80, yb + 40]], { fill: cols[i], fillOp: 230, bleed: .12, tex: .3, border: .2, ink: null }); }
};
// the dawn clearing: a sky that warms with sky 0..1 (lilac → gold), a far hill (the sun rises behind it), a tree on the
// left with a leaf plate under it, grass. o.sun(x, y) is called between the far hill and the near ground.
function clearingSet(t, o = {}) {
  const k = clamp(o.sky ?? 0), sh = o.shift ?? 0;
  gradBands([mixCol(SK.lilac, '#9CCFF0', k), mixCol(SK.peach, '#CDEBFA', k), mixCol(SK.dawn, '#FFF0C8', k)], -80, 1150 + sh, 'csky');
  push(); translate(0, sh);
  boilSeed('cclouds');
  for (let i = 0; i < 3; i++) cloud(160 + i * 380 + (o.cloudDx || 0) + Math.sin(t * .2 + i) * 20, 380 + i * 90 + (i % 2) * 60, 70 + i * 10, { col: mixCol('#FBE6E0', '#FFFFFF', k), dk: mixCol(SK.lilac, SK.cloudDk, k), ink: false, key: 'ccl' + i });
  if (o.sun) { pop(); o.sun(); push(); translate(0, sh); }
  boilSeed('chillfar');
  paint([[-80, 1090], [150, 1010], [380, 1040], [620, 980], [860, 1020], [1160, 990], [1160, 1300], [-80, 1300]], { fill: SK.hillFar, fillOp: 230, bleed: .1, tex: .4, ink: null, curv: .6 });
  boilSeed('chill');
  paint([[-80, 1130], [300, 1100], [700, 1120], [1160, 1090], [1160, 2000], [-80, 2000]], { wash: SK.hill, fill: SK.hillDk, fillOp: 40, tex: .4, ink: null, curv: .5 });
  boilSeed('cground');
  paint([[-80, 1230], [400, 1205], [800, 1215], [1160, 1200], [1160, 2000], [-80, 2000]], { wash: SK.grass, fill: SK.grassDk, fillOp: 50, tex: .5, ink: SK.ink, sw: 1.2, curv: .5 });
  // the tree on the left, leaves swaying
  boilSeed('ctree');
  paint([[40, 1240], [70, 900], [55, 700], [100, 700], [120, 900], [140, 1240]], { wash: SK.trunk, fill: SK.trunkDk, fillOp: 60, tex: .5, ink: SK.ink, sw: 1.2, curv: .3 });
  const sway = Math.sin(t * 1.2) * 8 * (o.still ? 0 : 1);
  for (const [cx, cy, r] of [[20, 640, 150], [170, 600, 130], [90, 520, 140], [230, 700, 100]]) paint(ellPts(cx + sway, cy, r, r * .85, 18, 4), { wash: SK.leaf, fill: SK.leafDk, fillOp: 50, tex: .5, ink: SK.ink, sw: 1.1 });
  for (let i = 0; i < 6; i++) paint(ellPts(30 + hash(i) * 200 + sway, 560 + hash(i + 9) * 160, 18, 12, 8, 0, hash(i) * 3), { wash: SK.leafLt, ink: null });
  // grass tufts
  boilSeed('ctufts');
  for (let i = 0; i < 9; i++) { const gx = 60 + hash(i * 3.1) * 980, gy = 1300 + hash(i * 5.3) * 500, sw2 = Math.sin(t * 2 + i) * 4 * (o.still ? 0 : 1); for (const d of [-10, 0, 10]) inkLine([[gx + d, gy], [gx + d * 1.6 + sw2, gy - 26 - Math.abs(d)]], 1.2, SK.grassDk, 'inkfine', .5); }
  if (o.plate) {   // an empty leaf plate under the tree
    boilSeed('cplate');
    paint(ellPts(800, 1360, 100, 30, 18), { wash: SK.plate, fill: SK.leafDk, fillOp: 50, ink: SK.ink, sw: 1 });
    inkLine([[710, 1360], [890, 1360]], .8, SK.leafDk, 'inkfine', 0);
  }
  pop();
}
// open sky; climb 0..1 shifts it from dawn-low to bright day-high
function skySet(t, o = {}) {
  const k = clamp(o.climb ?? 1);
  gradBands([mixCol('#B9A6D8', SK.skyTop, k), mixCol(SK.peach, SK.sky, k), mixCol(SK.dawn, SK.skyLow, k)], -80, H + 80, 'ssky');
}
function nightSet(t, o = {}) {
  gradBands([SK.nightTop, SK.night, SK.nightLow], -80, H + 80, 'nsky');
  boilSeed('nstars');
  for (let i = 0; i < 46; i++) {
    const x = hash(i * 1.7) * W, y = hash(i * 3.9) * H, tw = .6 + .4 * Math.sin(t * (2 + hash(i) * 3) + i), r = (2 + hash(i * 7) * 4) * tw;
    paint(starPts(x, y, r * 2.2, .35, 4), { wash: SK.star, ink: null });
  }
}
// the mountain peak (rocks), with a cave mouth on the right
function peakSet(t, o = {}) {
  const k = clamp(o.day ?? 1);
  gradBands([mixCol(SK.night, SK.skyTop, k), mixCol(SK.nightLow, SK.sky, k), mixCol('#5A5090', SK.skyLow, k)], -80, H + 80, 'psky');
  boilSeed('pfar');
  paint([[-80, 1300], [200, 1050], [380, 1180], [640, 980], [900, 1150], [1160, 1060], [1160, 2000], [-80, 2000]], { fill: mixCol(SK.hillFar, '#8FA6C8', k), fillOp: 220, bleed: .1, tex: .4, ink: null, curv: .3 });
  boilSeed('ppeak');
  paint([[60, 2000], [260, 1500], [430, 1330], [540, 1290], [650, 1335], [820, 1520], [1100, 2000]], { wash: SK.rock, fill: SK.rockDk, fillOp: 60, tex: .6, ink: SK.ink, sw: 1.4, curv: .2 });
  for (const [a, b] of [[[350, 1560], [470, 1470]], [[640, 1500], [760, 1640]], [[480, 1700], [560, 1620]]]) inkLine([a, b], 1, SK.rockDk, 'inkfine', .3);
  paint([[430, 1335], [540, 1295], [650, 1340], [600, 1350], [540, 1320], [480, 1345]], { wash: SK.rockLt, ink: null, curv: .4 });
  if (o.cave) {
    boilSeed('pcave');
    paint([[730, 1730], [745, 1590], [800, 1490], [880, 1455], [960, 1500], [1000, 1610], [1010, 1740]], { wash: SK.rockDk, ink: SK.ink, sw: 1.3, curv: .5 });   // the rocky rim
    paint([[770, 1740], [780, 1610], [825, 1525], [885, 1500], [945, 1535], [975, 1625], [980, 1740]], { wash: SK.cave, ink: null, curv: .5 });
    for (const [x0, l] of [[830, 40], [880, 28], [930, 36]]) paint([[x0 - 12, 1520], [x0 + 12, 1520], [x0, 1520 + l]], { wash: SK.rockDk, ink: null });   // little stalactites
  }
}

// ---------- the follow card ----------
function followCard(t, C) {
  boilSeed('cardbg');
  paint(rectPts(-60, -60, W + 120, H + 120), { wash: SK.rkPeach, ink: null });
  boilSeed('cardpetals');
  for (let i = 0; i < 9; i++) {
    const x = 60 + hash(i * 3.3) * 960 + 30 * Math.sin(t * .9 + i), y = frac(hash(i * 7.1) + t * (.035 + .02 * hash(i))) * (H + 80) - 40, r = t * .8 + i;
    paint([[x + Math.cos(r) * 15, y + Math.sin(r) * 15], [x + Math.cos(r + 1.6) * 7, y + Math.sin(r + 1.6) * 7], [x - Math.cos(r) * 15, y - Math.sin(r) * 15], [x + Math.cos(r - 1.6) * 7, y + Math.sin(r - 1.6) * 7]], { wash: i % 2 ? SK.saffron : '#F4A6B8', washOp: 200, ink: null, curv: .5 });
  }
  const X = 470, pk = t0 => Math.max(0, t - t0) * 5;
  if (PICS.logo) picture(PICS.logo, X, 530, 170, 170, { pop: pk(C.card) });
  letter('Stories of our gods,', X, 680, 64, SK.teal, { screen: true, font: '64px Marcellus', ink: false, pop: pk(C.card + .1), maxW: 860 });
  letter('for little ones', X, 752, 64, SK.teal, { screen: true, font: '64px Marcellus', ink: false, pop: pk(C.card + .2), maxW: 860 });
  if (C.baby) C.baby();
  if (t > C.follow) letter('Follow @therishikatha', X, 1310, 64, SK.rkOrange, { screen: true, font: '700 64px Poppins', ink: false, maxW: 880, pop: pk(C.follow) });
  if (t > C.pill) {
    const k = backOut(clamp(pk(C.pill))) * (1 + .03 * pulse(t, 4));
    boilSeed('pill');
    push(); translate(X, 1420); scale(k); paint(rrPts(-230, -46, 460, 92, 46), { wash: SK.teal, ink: null }); pop();
    letter('rishikatha.com', X, 1422, 50, SK.cream, { screen: true, font: '700 52px Poppins', ink: false, pop: pk(C.pill) });
  }
}
