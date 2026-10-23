// wall_krishna.js: "Makhan chor": little Kanha sitting by a pot of butter under a full Vrindavan moon, dipping his
// hand in and licking it, his peacock feather swaying, kadamba flowers swinging overhead, fireflies, twinkling stars.
(() => {
  const C = { skyHi: '#151440', skyMid: '#2A2A6E', skyLo: '#4A4A92', moon: '#FFF4D6', hill: '#25305E', grass: '#2E5A4E', grassDk: '#21443C', grassLt: '#4F8A62',
    pot: '#C8673A', potDk: '#8E3E20', potLt: '#E8956A', butter: '#FFF8E6', butterDk: '#EADBB8', leaf: '#3E7A4A', leafDk: '#2A5636', kadamba: '#F7C948', kadambaDk: '#D99A22' };
  // a clay matki brimming with butter, (x, y) its foot, s its width
  function matki(x, y, s, key) {
    boilSeed(key);
    paint(ellPts(x, y - s * .02, s * .6, s * .1, 18), { fill: '#0A0A20', fillOp: 90, bleed: .2, ink: null });
    const P = [[-.18, 0], [-.42, -.12], [-.52, -.38], [-.42, -.64], [-.26, -.74], [-.3, -.82], [.3, -.82], [.26, -.74], [.42, -.64], [.52, -.38], [.42, -.12], [.18, 0]].map(([a, b]) => [x + a * s, y + b * s]);
    paint(P, { wash: C.pot, fill: C.potDk, fillOp: 80, tex: .5, ink: BK.ink, sw: 1.1, curv: .5 });
    paint(ellPts(x - s * .22, y - s * .45, s * .08, s * .16, 10), { wash: C.potLt, washOp: 160, ink: null });
    inkLine([[x - s * .48, y - s * .5], [x + s * .48, y - s * .5]], .7, '#F2C04A', 'inkfine', .4);
    for (let i = 0; i < 7; i++) paint(ellPts(x - s * .36 + i * s * .12, y - s * .5 + (i % 2) * s * .03, s * .025, s * .025, 6), { wash: '#F2C04A', ink: null });
    // the butter heaped over the mouth, a drip down the side
    paint([[x - s * .34, y - s * .8], [x - s * .3, y - s * .92], [x - s * .12, y - s * 1.0], [x + s * .06, y - s * .97], [x + s * .26, y - s * .93], [x + s * .34, y - s * .8], [x + s * .2, y - s * .74], [x + s * .17, y - s * .64], [x + s * .11, y - s * .74], [x - s * .34, y - s * .76]],
      { wash: C.butter, fill: C.butterDk, fillOp: 60, tex: .4, ink: BK.ink, sw: .9, curv: .6 });
  }
  wallpaper('wall_krishna', t => {
    boilSeed('wk sky');
    paint(rectPts(-60, -60, DW + 120, DH + 120), { wash: C.skyHi, ink: null });
    glow(540, 1700, 1500, '#3A3A9A', .85); glow(540, 1750, 800, '#5A5AB0', .5);
    twinkle(t, 46, 'wk', { y1: 1500 });
    // the full moon, behind his head
    const mx = 540, my = 1060;
    glow(mx, my, 620, '#FFE9B0', .55); glow(mx, my, 330, '#FFF4D6', .6);
    boilSeed('wk moon');
    paint(ellPts(mx, my, 250, 250, 40), { wash: C.moon, fill: '#F2E2B8', fillOp: 90, tex: .5, border: .4, ink: null });
    for (const [a, b, r] of [[-70, -40, 38], [60, 50, 26], [20, -90, 18], [-40, 90, 22]]) paint(ellPts(mx + a, my + b, r, r * .85, 12), { fill: '#EAD6A6', fillOp: 110, bleed: .15, ink: null });
    cloudBank(t, 1330, 'wk', { n: 4, w: 260, cols: ['#3E3E86', '#33336E'] });
    // hills, then the grass he sits on
    boilSeed('wk hills');
    paint([[-60, 1700], [200, 1600], [430, 1660], [700, 1580], [1000, 1640], [1140, 1620], [1140, 2400], [-60, 2400]], { wash: C.hill, ink: null, curv: .5 });
    paint([[-60, 1850], [300, 1800], [780, 1830], [1140, 1790], [1140, 2400], [-60, 2400]], { wash: C.grass, fill: C.grassDk, fillOp: 60, tex: .5, ink: null, curv: .5 });
    for (let i = 0; i < 26; i++) { const x = hash(i * 3.7) * DW, y = 1830 + hash(i * 5.1) * 480, h = 26 + hash(i) * 30, sw = lsin(t, 1, hash(i * 2)) * 6;
      inkLine([[x - 6, y], [x - 3 + sw * .6, y - h * .7], [x + sw, y - h]], 1, C.grassLt, 'ink', .5); inkLine([[x + 5, y], [x + 8 + sw, y - h * .6]], 1, C.grassLt, 'ink', .5); }
    // a kadamba branch hanging in from the top right, its round yellow flowers swinging
    boilSeed('wk branch');
    const bs = lsin(t, 1, .2) * 10;
    paint(ribbon([[1160, 760], [960, 800], [780, 870 + bs * .4], [640, 905 + bs]], 30, 9), { wash: '#4A3226', ink: '#1E1420', sw: .9 });
    for (let i = 0; i < 6; i++) { const k = i / 5, x = lerp(1110, 690, k), y = lerp(780, 900, k) + bs * k, a = i % 2 ? 1 : -1;
      const la = Math.PI / 2 + a * .7 + lsin(t, 1, i * .2) * .06, L = 120, ca = Math.cos(la), sa = Math.sin(la), Q = (d, w) => [x + ca * d - sa * w, y + sa * d + ca * w];
      paint([Q(0, 0), Q(L * .35, 26), Q(L, 0), Q(L * .35, -26)], { wash: C.leaf, fill: C.leafDk, fillOp: 70, tex: .4, ink: '#1E3020', sw: .6, curv: .6 });
      inkLine([Q(4, 0), Q(L * .9, 0)], .5, C.leafDk, 'inkfine', .3); }
    for (let i = 0; i < 4; i++) { const k = (i + .5) / 4, x = lerp(1100, 700, k), y = lerp(790, 905, k) + bs * k, sw = lsin(t, 2, i * .25) * .12, L = 70 + i * 22;
      const fx = x + Math.sin(sw) * L, fy = y + Math.cos(sw) * L;
      inkLine([[x, y], [fx, fy]], 1, '#2A5636', 'inkfine', 0);
      glow(fx, fy, 60, '#FFD45A', .35);
      paint(ellPts(fx, fy + 30, 36, 36, 18, 2.5), { wash: C.kadamba, fill: C.kadambaDk, fillOp: 90, tex: .8, ink: '#7A4A10', sw: .6 });
      for (let j = 0; j < 10; j++) { const b = j / 10 * TAU; paint(ellPts(fx + Math.cos(b) * 36, fy + 30 + Math.sin(b) * 36, 5, 5, 6), { wash: '#FFF0B0', ink: null }); } }
    // Kanha, sitting, and the pot to his left (screen right)
    const kx = 470, ky = 2040, u = 52, px = kx + 400;
    matki(px, ky + 20, 290, 'wk pot');
    // the hand: dips into the butter (1.2–1.9 s), lifts to the mouth (2.3–3.9 s: two licks), drops back to rest
    const k = kf(t, [[0, 0], [.9, 0], [1.6, 1], [2.1, 1], [2.9, 2], [4.4, 2], [5.3, 0]]);
    const rest = [3.0, -3.2], pot = [6.4, -6.0], lick = [1.1, -8.4];
    const handR = k < 1 ? rest.map((v, i) => lerp(v, pot[i], ease(k))) : pot.map((v, i) => lerp(v, lick[i], ease(k - 1)));
    const licking = k > 1.9 && t < 4.4, lk = licking ? Math.max(0, lsin(t, 6, .1)) : 0;
    const breath = lsin(t, 2) * .1;
    const KO = {
      pose: 'sit', eyes: licking ? 'happy' : 'normal', mouth: licking ? (lk > .3 ? 'cat' : 'smile') : 'smile', blush: .6 + .3 * lk,
      lookX: lerp(.35, .1, clamp(k - 1)), lookY: k > .4 && k < 1.4 ? .3 : 0, htilt: lerp(.05, -.08, clamp(k - 1)) + lsin(t, 1) * .03,
      dy: -breath, sq: breath * .3, featherWob: t / WL * 3, handR, handShapeR: k > .8 && k < 2.2 ? 'hold' : 'open', handL: [-2.6, -3.4], handShapeL: 'open',
      boilKey: 'wk kanha',
    };
    rigClock(t, 'kid', 0, () => balKrishna(kx, ky, u, KO), { at: .4 });
    // a dab of butter on his fingers once he's dipped them
    if (k > .9 && k < 2.6) { const [hx, hy] = bkHand(kx, ky, u, KO, 1), a = clamp((2.6 - k) * 3); boilSeed('wk dab');
      paint(ellPts(hx + 4, hy - 16, 22 * a, 14 * a, 10), { wash: C.butter, ink: BK.ink, sw: .6 }); }
    // fireflies on little closed loops
    for (let i = 0; i < 9; i++) { const a = t / WL * TAU * (1 + i % 2) + i * 2.1, x = 120 + hash(i * 3.3) * 840 + Math.cos(a) * 60, y = 1450 + hash(i * 1.9) * 650 + Math.sin(a * 2) * 30, b = .5 + .5 * lsin(t, 3 + i % 3, hash(i));
      glow(x, y, 40, '#D8FF8A', .5 * b); boilSeed('wk fly ' + i); paint(ellPts(x, y, 5, 5, 6), { wash: '#F4FFC8', washOp: 120 + 135 * b, ink: null }); }
  });
})();
