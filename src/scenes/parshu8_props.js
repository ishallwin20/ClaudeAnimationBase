// parshu8_props.js: the cast, sets and props for parshu8.js (ad 80, "PARSHURAMA'S 3 STUDENTS", Parshurama series
// Part 8, the finale). Loaded after parshu1–7_props.js (PK, CP, cloudPuff, sparkleBurst, P2, tapasSet, dustPlain,
// celestialWeapons, navCard, P3, grade, eyeBlaze, curseWave, nameTag, wick, silPal, P4, sunburst, arrow, P5, ancestor,
// lakesSet, bigCount, P6, royalChariot, astraStreak, P7, goldVoid) and the shared rigs (parshurama.js, ram.js,
// ramayan.js: valmiki(); parvati.js; narada.js; dashavatar.js: kalki(), kalkiHorse()). Pure functions of their
// arguments (and T).
//   P8                                     the palette
//   bhishma, drona, karna, amba            the cast (karna's kundalas: karnaEars())
//   plainBow (an armL hook), kavacha (a chest hook), alarka (the insect), astraIn, lampRow   props
//   mahendraSet, nightField                sets
const P8 = {
  ink: '#2B2233', cream: '#FFF5E2', gold: '#F5C542', red: '#FF5A3C', violet: '#B78CFF', violetHot: '#F0E6FF',
  wood: '#8A5230', woodDk: '#5E3418', woodLt: '#B87A48', string: '#FFF4D8',
  kGold: '#F2C24A', kGoldDk: '#B8861C', kGoldLt: '#FFE69A', kGlow: '#FFD86A',
  bug: '#7A3A2E', bugDk: '#4A1E18', bugLt: '#C87A5A', blood: '#B8202A',
  night: '#141A36', nightLo: '#2A2E5A', duskHi: '#3A2246', duskLo: '#E87A4A',
};

// ---------- the cast ----------
// Bhishma, Ganga's son: Ram's rig with Lakshman's small crown, all in white and silver, a long silver beard (the look
// everyone knows him by)
const BHISHMA_PAL = { skin: '#F0C49C', skinDk: '#D09A70', skinLt: '#FFE2C4', dhoti: '#F4F0E6', dhotiDk: '#CFC6B4', dhotiLt: '#FFFFFF',
  border: '#C8A040', shawl: '#E6E2EE', shawlDk: '#B4AEC6', hair: '#E2E0EA', hairLt: '#FFFFFF', ink: '#2B2233' };
function bhishma(x, y, u, o = {}) { return ram(x, y, u, { crown: 'small', kodanda: false, beard: '#ECEAF2', beardLen: .95, boilKey: 'bhi', seed: 81, ...o, pal: { ...BHISHMA_PAL, ...(o.pal || {}) } }); }
// Drona, a poor young brahmin when he came to Mahendra (Adi 131): Valmiki's rig, a black beard, a faded, patched dhoti
const DRONA_PAL = { hair: '#2A2228', hairLt: '#4E4450', dhoti: '#D2C29C', dhotiDk: '#A8966E', dhotiLt: '#EADCB8', border: '#7A5A3A',
  shawl: '#E6DCC2', shawlDk: '#C2B496', skin: '#D49A72', skinDk: '#AE744C', skinLt: '#EEC09A' };
function drona(x, y, u, o = {}) { return valmiki(x, y, u, { boilKey: 'dro', seed: 83, beard: '#2E2630', beardLen: .7, ...o, pal: { ...DRONA_PAL, ...(o.pal || {}) } }); }
// Karna, Surya's son: Ram's rig with no crown and no bow, golden skin, a plain white dhoti (he came as a brahmin), the
// gold kavacha he was born with across his chest and the gold kundalas in his ears (ramKirita's earrings, lit)
const KARNA_PAL = { skin: '#F0BE86', skinDk: '#CC9258', skinLt: '#FFDCAA', dhoti: '#FFF4E0', dhotiDk: '#E0D2B0', dhotiLt: '#FFFFFF',
  border: '#C87A2A', shawl: '#F6E6C8', shawlDk: '#D8C4A0', hair: '#1E1820', hairLt: '#46384A', gold: '#F5C542', goldDk: '#B8861C', gem: '#E8402A' };
function karna(x, y, u, o = {}) {
  const prev = o.chest;
  return ram(x, y, u, { crown: false, kodanda: false, boilKey: 'kar8', seed: 85, ...o, pal: { ...KARNA_PAL, ...(o.pal || {}) },
    chest: (uu, sw) => { if (o.kavacha !== false) kavacha(uu, sw, o.kavGlow ?? 0); if (prev) prev(uu, sw); } });
}
// the light of his kundalas, after he is drawn: k 0..1
function karnaEars(x, y, u, o, k = 1) {
  if (k <= 0) return;
  for (const s of [-1, 1]) { const [ex, ey] = naradaLocal(x, y, u, { crown: false, ...o }, s * 3.3, -18.85); glow(ex, ey, 2.4 * u, P8.kGlow, .55 * k); glow(ex, ey, .8 * u, '#FFFFFF', .5 * k); }
}
// the kavacha: gold scale armour over the chest, in narada()'s body space (shoulders (±3, -16.3), chest (0, -14.6))
function kavacha(u, sw, g = 0) {
  boilSeed('kavacha');
  const P = pts => U(pts, u);
  if (g > 0) glow(0, -14.4 * u, 5 * u, P8.kGlow, .5 * g);
  paint(P([[-2.7, -16.9], [-1.2, -17.3], [0, -17.0], [1.2, -17.3], [2.7, -16.9], [2.55, -13.6], [1.9, -11.9], [0, -11.4], [-1.9, -11.9], [-2.55, -13.6]]),
    { wash: P8.kGold, fill: P8.kGoldDk, fillOp: 45, tex: .4, ink: P8.ink, sw: sw * .55, curv: .35 });
  for (let r = 0; r < 4; r++) {   // rows of scales
    const y = -16.2 + r * 1.15, n = 5 - (r > 2 ? 1 : 0);
    for (let i = 0; i < n; i++) { const x = -2.0 + i * (4 / (n - 1)) + (r % 2 ? .25 : 0); if (Math.abs(x) > 2.3) continue; inkLine(P([[x - .45, y], [x, y + .55], [x + .45, y]]), sw * .35, P8.kGoldDk, 'inkfine', .5); }
  }
  inkLine(P([[-1.9, -16.4], [-1.2, -15.2]]), sw * .5, P8.kGoldLt, 'inkfine', .3);
  paint(ellPts(0, -14.6 * u, .5 * u, .5 * u, 12), { wash: '#FFF2B0', ink: P8.ink, sw: sw * .4 });   // a little sun at the centre
}
// Amba, princess of Kashi: Parvati's rig in rose and gold, a small crown
const AMBA_PAL = { saree: '#D84A6A', sareeDk: '#A82E4E', sareeLt: '#F28AA2', blouse: '#E8A030', blouseDk: '#B87818', bangle: '#E8A030',
  skin: '#F2BE98', skinDk: '#D69470', skinLt: '#FFE0C8' };
function amba(x, y, u, o = {}) { return parvati(x, y, u, { boilKey: 'amba', seed: 87, ...o, pal: { ...AMBA_PAL, ...(o.pal || {}) }, col: AMBA_PAL.skin, dk: AMBA_PAL.skinDk, lt: AMBA_PAL.skinLt }); }

// ---------- props ----------
// a plain wooden bow as an armL hook for narada()'s rig (as vishnuBow() in parshu6_props.js): draw 0..1 pulls the
// string, arrow nocks one; g 0..1 lights the arrowhead in col (the sleep weapon: violet)
function plainBow(draw = 0, arrow = true, g = 0, col = P8.violet) {
  return (u, sw) => {
    const k = u / 1.7, pull = clamp(draw);
    push(); scale(1.7);
    const tipT = [.6, -4.9], tipB = [.6, 4.9];
    inkLine(U([tipT, [.6 + pull * 2.6, 0], tipB], k), sw * .5, P8.string, 'inkfine', 0);
    const limb = U([[.6, -5.0], [-.4, -3.5], [-.95, -1.2], [-1.0, 0], [-.95, 1.2], [-.4, 3.5], [.6, 5.0]], k);
    paint(ribbon(limb, .3 * k, .24 * k), { wash: P8.wood, fill: P8.woodDk, fillOp: 50, tex: .4, ink: P8.ink, sw: sw * .55 });
    inkLine(U([[-.55, -3.0], [-.92, -1.2]], k), sw * .4, P8.woodLt, 'inkfine', .3);
    paint(U([[-1.25, -.7], [-.7, -.7], [-.7, .7], [-1.25, .7]], k), { wash: '#C8323A', ink: P8.ink, sw: sw * .4 });   // the grip
    if (arrow && pull > .05) {
      const ax = (.6 + pull * 2.6) * k;
      if (g > 0) { glow(-1.5 * k, 0, 4.6 * k, col, .45 * g); glow(-3.9 * k, 0, 2.8 * k * (.85 + .15 * Math.sin(T * 9)), col, .8 * g); }
      inkLine([[ax, 0], [-3.4 * k, 0]], sw * 1.2, g > .3 ? mixCol(P8.woodDk, col, .6) : P8.woodDk, 'ink', 0);
      paint([[-3.4 * k, -.38 * k], [-4.5 * k, 0], [-3.4 * k, .38 * k]], { wash: g > .3 ? P8.violetHot : '#C8CCD8', ink: P8.ink, sw: sw * .4 });
      for (const s of [-1, 1]) paint([[ax - .1 * k, 0], [ax + .5 * k, s * .4 * k], [ax + .9 * k, s * .38 * k], [ax + .4 * k, 0]], { wash: P8.cream, ink: P8.ink, sw: sw * .3 });
    }
    pop();
  };
}
// Alarka (Shanti 3): a worm "that resembled a hog in shape", eight feet, keen teeth, bristles like needles; facing
// right, s ≈ its length; walk is a phase
function alarka(x, y, s, o = {}) {
  const f = o.flip ? -1 : 1, w = o.walk ?? 0, key = o.key || 'alk';
  push(); translate(x, y); scale(f, 1); if (o.rot) rotate(o.rot);
  boilSeed(key);
  const u = s / 10;
  for (let i = 0; i < 4; i++) {   // eight feet: four a side, the far ones darker
    const lx = -3 + i * 2, a = Math.sin(w * TAU + i * 1.4) * .8;
    inkLine([[lx * u, 1 * u], [(lx + a) * u, 2.6 * u]], Math.max(1, u * .45), P8.bugDk, 'ink', .2);
    inkLine([[(lx + .5) * u, .6 * u], [(lx + .5 - a) * u, 2.2 * u]], Math.max(1, u * .35), P8.bug, 'ink', .2);
  }
  paint(ellPts(0, 0, 5 * u, 2.1 * u, 18), { wash: P8.bug, fill: P8.bugDk, fillOp: 60, tex: .5, ink: P8.ink, sw: Math.max(.5, u * .2) });
  for (let i = 0; i < 9; i++) { const bx = (-4 + i) * u, h = (1.9 - Math.abs(i - 4) * .12) * u; inkLine([[bx, -h + .4 * u], [bx + .3 * u, -h - 1.1 * u]], Math.max(.8, u * .2), P8.bugLt, 'inkfine', 0); }
  paint([[4.4 * u, -.9 * u], [6.4 * u, -.3 * u], [6.6 * u, .5 * u], [4.6 * u, 1.1 * u]], { wash: P8.bugLt, ink: P8.ink, sw: Math.max(.5, u * .2) });   // the hog's snout
  paint(ellPts(6.5 * u, .1 * u, .35 * u, .45 * u, 8), { wash: P8.bugDk, ink: null });
  paint([[5 * u, 1 * u], [5.3 * u, 1.9 * u], [5.6 * u, 1.05 * u]], { wash: '#FFF8EC', ink: null });   // a tooth
  paint(ellPts(4.2 * u, -.7 * u, .5 * u, .5 * u, 8), { wash: '#FF5A3C', ink: null });   // a red eye
  pop();
}
// astras flying from (x0, y0) into (x1, y1) one after another: p 0..1 over the whole stream
function astraIn(x0, y0, x1, y1, p, n = 5, key = 'ain') {
  for (let i = 0; i < n; i++) {
    const q = clamp(p * 1.6 - i * .14), k = easeIn(q), arc = Math.sin(Math.PI * q) * (i % 2 ? 140 : -110);
    if (q <= 0 || q >= 1) continue;
    const x = lerp(x0, x1, k), y = lerp(y0, y1, k) + arc;
    glow(x, y, 110, '#FFE6A0', .55); glow(x, y, 40, '#FFFFFF', .8);
    boilSeed(key + i); push(); translate(x, y); rotate(q * 6 + i); astra(ASTRAS[i % ASTRAS.length], 9 * (1 - q * .5), 1, { fill: P2.calm, rim: P2.calmRim }); pop();
  }
}
// a row of lamps on the ground; outAt[i] = when lamp i goes out (wick smoke after)
function lampRow(xs, y, s, t, onAt, outAt, key = 'lr') {
  xs.forEach((x, i) => {
    const on = t > onAt[i], out = t > outAt[i];
    boilSeed(key + i);
    paint(ellPts(x, y + s * .25, s * 1.1, s * .42, 14), { wash: '#B8642E', fill: '#7E3E1C', fillOp: 60, ink: P8.ink, sw: .8 });
    if (on && !out) {
      const fl = 1 + .08 * Math.sin(t * 13 + i * 2);
      glow(x, y - s * .6, s * 7, '#FFB050', .45 * clamp((t - onAt[i]) * 3));
      paint([[x, y - s * 1.5 * fl], [x + s * .38, y - s * .4], [x, y - s * .1], [x - s * .38, y - s * .4]], { wash: '#FFC850', ink: null, curv: .5 });
      paint(ellPts(x, y - s * .45, s * .16, s * .3, 8), { wash: '#FFFFFF', ink: null });
    }
    if (out) wick(x, y - s * .3, s, t - outAt[i], key + 'w' + i);
  });
}

// ---------- sets ----------
// Mahendra, the mountain by the eastern sea where Parshurama lives (Adi 131, Shanti 2, Bhagavata 9.16.26): Part 2's
// tapas rock under a chosen sky, a sea line glinting below the peaks, and a flowering tree at screen left if tree
function mahendraSet(t, o = {}) {
  tapasSet(t, { sky: o.sky || SKY_GOLD, rockY: o.rockY ?? 1590, flowers: o.flowers ?? 1, skyFx: () => {
    if (o.sun) { glow(o.sun[0], o.sun[1], 420, '#FFE6A0', .6); boilSeed('m8sun'); paint(ellPts(o.sun[0], o.sun[1], 90, 90, 24), { wash: '#FFF2C8', ink: null }); }
    if (o.skyFx) o.skyFx();
    boilSeed('m8sea'); paint(rectPts(-300, 1300, W + 600, 140), { wash: mixCol('#5EA8C8', (o.sky || SKY_GOLD).mid, .35), washOp: 200, ink: null });
    for (let i = 0; i < 9; i++) inkLine([[-200 + i * 170 + Math.sin(t + i) * 10, 1330 + (i % 3) * 22], [-120 + i * 170 + Math.sin(t + i) * 10, 1330 + (i % 3) * 22]], 2, '#FFF6E0', 'inkfine', .3);
  } });
  if (o.tree) tree(o.tree[0], o.tree[1], o.tree[2] || 700, 'm8t', Math.sin(t * .8) * .3);
}
// Kurukshetra at night (the duel's nights, the sleep weapon): dustPlain under a night grade, stars, a moon
function nightField(t, k = 1, key = 'nf') {
  dustPlain(t);
  boilSeed(key); paint(rectPts(-300, -300, W + 600, 2700), { wash: P8.night, washOp: 200 * k, ink: null });
  for (let i = 0; i < 26; i++) { const x = hash(i * 3.7) * 1080, y = 300 + hash(i * 5.1) * 900, r = 2 + 3 * hash(i); paint(ellPts(x, y, r, r, 6), { wash: '#FFF6E0', washOp: 255 * k * (.5 + .5 * Math.sin(t * 2 + i)), ink: null }); }
  glow(820, 560, 160, '#DDE6FF', .5 * k); paint(ellPts(820, 560, 54, 54, 20), { wash: '#F2F4FF', washOp: 255 * k, ink: null });
}
