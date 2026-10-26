// wall_batch3.js: live wallpapers, batch 3 (Painted): darshans in batch 2's recipe (one god centred and facing us, a
// glowing halo or rays behind, diyas, a rangoli, a garland). Each is wallpaperK(name, fn(t, k)): t the loop time, k the
// wake-up (0 → 1). It registers <name> (the 6 s loop, frame 0 the still) and <name>_wake (the iPhone's 2 s: k rises
// over the first 1.5 s while the loop plays its last 1.5 s, landing exactly on the still at 1.5 s; tools/wallpack.mjs
// takes the key frame there). The boil follows the loop time in both, so the still is the same frame.
(() => {
  // ---------- the kit ----------
  BLINKS.karti = [.9, .8, 3.3];   // kartikeya()'s own blink: (T·.9 + seed·1.7 + .8) mod 3.3
  function wallpaperK(name, fn) {
    wallpaper(name, t => fn(t, 1));
    LOOPS[name + '_wake'] = t => { const lt = ((t - 1.5) % WL + WL) % WL; T = lt; BOILN = Math.floor(T * BOIL); wallBegin(); fn(lt, clamp(t / 1.5)); wallEnd(); };
    LOOPS[name + '_wake'].len = 2;
  }
  const kSeg = (k, a, b) => k >= 1 ? 1 : seg(k, a, b);
  const kBump = (k, a, b) => k >= 1 ? 0 : Math.sin(Math.PI * seg(k, a, b));
  function sky(key, hi, lo, mid) {
    boilSeed(key);
    paint(rectPts(-60, -60, DW + 120, DH + 120), { wash: hi, ink: null });
    paint(ellPts(540, 1600, 1000, 1150, 40), { fill: lo, fillOp: 190, bleed: .35, tex: .3, border: .2, ink: null });
    if (mid) paint(ellPts(540, 1650, 650, 800, 36), { fill: mid, fillOp: 150, bleed: .35, tex: .3, border: .2, ink: null });
  }
  function rays(t, x, y, r0, r1, n, col, op, key, steps = 1) {
    boilSeed(key);
    for (let i = 0; i < n; i++) {
      const a = i / n * TAU + t / WL * TAU / n * steps, w = TAU / n * .28;
      paint([[x + Math.cos(a - w) * r0, y + Math.sin(a - w) * r0], [x + Math.cos(a) * r1, y + Math.sin(a) * r1], [x + Math.cos(a + w) * r0, y + Math.sin(a + w) * r0]], { wash: col, washOp: op, ink: null });
    }
  }
  function floor(y, c, dk, key) {
    boilSeed(key);
    paint(rectPts(-60, y, DW + 120, DH - y + 60), { wash: c, fill: dk, fillOp: 60, tex: .4, ink: null });
    inkLine([[-40, y + 2], [DW / 2, y - 4], [DW + 40, y + 2]], 1.2, dk, 'ink', .5);
  }
  function rangoli(t, x, y, rx, ry, cols, key, o = {}) {
    boilSeed(key);
    paint(ellPts(x, y, rx, ry, 40), { wash: o.base || '#FFF0DC', washOp: 210, ink: null });
    const n = o.n ?? 18;
    for (let i = 0; i < n; i++) { const a = i / n * TAU + t / WL * TAU / n; paint(ellPts(x + Math.cos(a) * rx * .8, y + Math.sin(a) * ry * .8, 26, 12, 10, 0, a), { wash: cols[i % cols.length], ink: null }); }
    if (o.inner) for (let i = 0; i < 10; i++) { const a = i / 10 * TAU - t / WL * TAU / 10; paint(ellPts(x + Math.cos(a) * rx * .45, y + Math.sin(a) * ry * .45, 16, 8, 8, 0, a), { wash: o.inner, ink: null }); }
  }
  // sparkles turning round a point, a whole turn a loop
  function sparkles(t, x, y, r, n, key, col = '#FFF6D0') {
    for (let i = 0; i < n; i++) { const a = i / n * TAU + t / WL * TAU, rr = r + 30 * lsin(t, 2, i * .1), sx = x + Math.cos(a) * rr, sy = y + Math.sin(a) * rr * .8, g = .5 + .5 * lsin(t, 3, i * .13);
      glow(sx, sy, 30, '#FFF2B0', .4 * g); boilSeed(key + ' sp ' + i); paint(starPts(sx, sy, 12 * g + 4, .25, 4), { wash: col, ink: null }); }
  }
  const P = (pts, x, y, u) => pts.map(([a, b]) => [x + a * u, y + b * u]);
  // cuteFace(x, y, r, o): the Painted rigs' face at any size: glossy eyes (a white, a big dark iris, two highlights),
  // thin arched brows, a button nose, a small smile, blush. r ~ the eyes' spacing. o.open (0..1: lids), o.ink, o.lip
  function cuteFace(x, y, r, o = {}) {
    const ink = o.ink || '#1A1414', op = o.open ?? 1;
    for (const s of [-1, 1]) {
      const ex = x + s * r, ey = y;
      inkLine([[ex - r * .42, ey - r * .62], [ex, ey - r * .76], [ex + r * .42, ey - r * .62]], Math.max(2, r * .06), ink, 'ink', .5);
      paint(ellPts(x + s * r * 1.55, y + r * .78, r * .42, r * .24, 14), { fill: PAL.rose, fillOp: 150, bleed: .2, tex: .4, ink: null });
      if (op < .35) { inkLine([[ex - r * .4, ey + r * .05], [ex, ey + r * .16], [ex + r * .4, ey + r * .05]], Math.max(2, r * .07), ink, 'ink', .4); continue; }
      paint(ellPts(ex, ey, r * .46, r * .52 * op, 20), { wash: '#FFFDF6', ink, sw: 1.4 });
      paint(ellPts(ex, ey + r * .04, r * .34, r * .42 * op, 18), { wash: o.iris || '#1E1414', ink: null });
      paint(ellPts(ex - r * .12, ey - r * .14 * op, r * .13, r * .15 * op, 10), { wash: '#FFFFFF', ink: null });
      paint(ellPts(ex + r * .13, ey + r * .2 * op, r * .06, r * .06, 8), { wash: '#FFFFFF', washOp: 220, ink: null });
    }
    inkLine([[x - r * .04, y + r * .52], [x + r * .1, y + r * .68], [x - r * .04, y + r * .74]], Math.max(1.5, r * .045), o.nose || ink, 'inkfine', .5);
    inkLine([[x - r * .42, y + r * 1.0], [x, y + r * 1.16], [x + r * .42, y + r * 1.0]], Math.max(2, r * .07), o.lip || '#8A2A30', 'ink', .5);
  }
  const INK = '#4A2B1C';

  // ---------- 4. Lakshmi and Ganesha on Diwali night: the puja pair ----------
  // wake: the row of diyas lights left to right and the coins begin to pour
  wallpaperK('p3_lakshmi_ganesh', (t, k) => {
    sky('lg sky', '#4A1238', '#B8402E', '#F2A04A');
    twinkle(t, 30, 'lg', { y1: 900 });
    const cx = 540, hy = 1420;
    glow(cx, hy, 820, '#FFC860', .5);
    rays(t, cx, hy, 380, 760, 28, '#FFD27A', 70, 'lg rays');
    floor(1985, '#6A1E2C', '#44121C', 'lg floor');
    rangoli(t, cx, 2150, 470, 100, ['#F7A21B', '#E2476E', '#FFD23C'], 'lg rangoli', { inner: '#F28BB0' });
    // Maa Lakshmi on her lotus, Bal Bappa on his, side by side
    lotusSeat(320, 1985, 480, 'lg lotus L', .8);
    lotusSeat(790, 1990, 480, 'lg lotus R', .8);
    const breath = lsin(t, 2) * .1, coins = kSeg(k, .55, .8);
    rigClock(t, 'parvati', 0, () => lakshmi(320, 1965, 31, {
      coins, coinT: t / WL * 5 / .9, coinsTo: 2010, eyes: 'normal', mouth: 'smile', blush: .4, glowK: .7,
      dy: -breath, sq: breath * .2, htilt: lsin(t, 1, .2) * .03, boilKey: 'lg lk', noShadow: true,
    }), { at: 1.2 });
    rigClock(t, 'balbappa', 1, () => balBappa(790, 1960, 36, {
      eyes: 'normal', mouth: 'smile', blush: .55, seed: 1, boilKey: 'lg bappa', noShadow: true,
      dy: -breath, sq: breath * .3, htilt: lsin(t, 1, .4) * .05, lookX: -.3, ear: .25 + .25 * lsin(t, 2, .3), trunkSway: .25 * lsin(t, 2, .5),
      aR: .12, armR: (uu) => modak(uu * .5, uu * .4, uu * 1.9), aL: .5 + .05 * lsin(t, 2, .2),
    }), { at: 3.3 });
    // five diyas along the front, lit one after another on wake
    for (let i = 0; i < 5; i++) { const x = 220 + i * 160; diya(x, 2160 + Math.abs(i - 2) * -22, 95, t, 'lg d' + i, { lit: kSeg(k, .05 + i * .1, .2 + i * .1) }); }
    diya(95, 2000, 140, t, 'lg L', { lit: kSeg(k, 0, .15) }); diya(985, 2000, 140, t, 'lg R', { lit: kSeg(k, .5, .65) });
    sparkles(t, cx, hy, 520, 10, 'lg');
    petalFall(t, 16, 'lg', { y0: 160, s: 20 });
    garland(t, 10, 'lg', { n: 3, sag: 110 });
  });

  // ---------- Bal Murugan and his peacock ----------
  // The peacock stands behind him, its tail fanned out as his halo; Palani hill and its temple far behind.
  // wake: the peacock opens its tail
  function peacockFan(t, x, y, R, open, key) {
    const n = 25, spread = lerp(.25, 1.48, easeOut(open)), r = R * (.55 + .45 * easeOut(open));
    for (const [row, rr, off] of [[0, 1, 0], [1, .74, .5]]) {
      for (let i = 0; i < n; i++) {
        const f = (i + off) / (n - 1) * 2 - 1; if (Math.abs(f) > 1) continue;
        const sh = lsin(t, 1, i * .05) * .015, a = -Math.PI / 2 + f * spread + sh, ca = Math.cos(a), sa = Math.sin(a), L = r * rr;
        boilSeed(`${key} f${row} ${i}`);
        const Q = (d, w) => [x + ca * d - sa * w, y + sa * d + ca * w];
        inkLine([Q(L * .1, 0), Q(L * .82, 0)], 1.4, '#2E6A4A', 'inkfine', .2);
        paint([Q(L * .45, 0), Q(L * .7, L * .07), Q(L * .98, L * .06), Q(L * 1.04, 0), Q(L * .98, -L * .06), Q(L * .7, -L * .07)], { wash: row ? '#3FA36C' : '#2F8A5C', fill: '#1E6A48', fillOp: 70, tex: .5, ink: '#1E4A36', sw: .6, curv: .5 });
        const ex = Q(L * .9, 0), g = .55 + .45 * lsin(t, 2, i * .11 + row * .3);
        paint(ellPts(ex[0], ex[1], L * .06, L * .072, 14, 0, a + Math.PI / 2), { wash: '#E8B83A', ink: null });
        paint(ellPts(ex[0], ex[1], L * .044, L * .054, 12, 0, a + Math.PI / 2), { wash: '#2FB0A8', ink: null });
        paint(ellPts(ex[0], ex[1], L * .026, L * .032, 10, 0, a + Math.PI / 2), { wash: '#1E3A8A', ink: null });
        if (g > .85) glow(ex[0], ex[1], L * .08, '#FFF4C0', (g - .85) * 3);
      }
    }
  }
  function peacockBody(t, x, y, key) {   // the body, rump to the left (where the fan grows from), chest to the right, on two legs
    boilSeed(key);
    for (const [lx, ph] of [[x + 20, 0], [x + 75, .5]]) {
      const st = lsin(t, 1, ph) * 4;
      inkLine([[lx, y + 70], [lx + st, y + 170], [lx - 4 + st, 1980]], 7, '#8A7A6A', 'ink', .3);
      for (const a2 of [-.6, 0, .6]) inkLine([[lx - 4 + st, 1980], [lx - 4 + st + Math.sin(a2) * 34, 1984 + Math.cos(a2) * 6]], 5, '#8A7A6A', 'ink', 0);
    }
    paint(ellPts(x, y, 175, 92, 26, 0, -.12), { wash: '#2E5FC8', fill: '#1E3E9A', fillOp: 60, tex: .5, ink: '#1A2A5A', sw: 1.1 });
    paint(ellPts(x - 50, y - 22, 120, 52, 20, 0, -.1), { wash: '#C8A070', fill: '#9A7448', fillOp: 60, tex: .6, ink: '#5A3A1A', sw: .8 });   // the folded wing
    for (let i = 0; i < 5; i++) inkLine([[x - 140 + i * 40, y - 40], [x - 128 + i * 40, y + 6]], 2, '#6A4A2A', 'inkfine', .3);
    for (let i = 0; i < 7; i++) paint(ellPts(x + 70 + (i % 3) * 22, y - 30 + Math.floor(i / 3) * 26, 10, 8, 8), { wash: '#3FA0D8', ink: null });   // the breast's sheen
  }
  function peacockHead(t, x, y, s, key, o = {}) {   // neck and head, rising from (x, y), facing left, s ~ head width
    boilSeed(key);
    const nod = o.nod || 0, hx = x - s * .5, hy = y - s * 3.2 + nod * s * .3;
    paint(ribbon([[x + s * .2, y], [x + s * .1, y - s * 1.2], [x - s * .15, y - s * 2.2], [hx + s * .25, hy + s * .45]], s * 1.25, s * .5), { wash: '#2E5FC8', fill: '#1E3E9A', fillOp: 60, tex: .5, ink: '#1A2A5A', sw: .9 });
    for (let i = 0; i < 5; i++) { const f = .2 + i * .15; paint(ellPts(lerp(x, hx, f) + s * .1, lerp(y, hy, f), s * .14, s * .1, 8), { wash: '#3FA0D8', ink: null }); }
    paint(ellPts(hx, hy, s * .55, s * .5, 18), { wash: '#2E5FC8', fill: '#1E3E9A', fillOp: 40, tex: .4, ink: '#1A2A5A', sw: .9 });
    for (const [dx, h] of [[-.2, 1.1], [0, 1.25], [.2, 1.1]]) { inkLine([[hx + dx * s, hy - s * .45], [hx + dx * s * 1.6, hy - s * h]], 1.2, '#1A2A5A', 'inkfine', .3); paint(ellPts(hx + dx * s * 1.6, hy - s * h, s * .1, s * .12, 8), { wash: '#2FB0A8', ink: '#1A2A5A', sw: .4 }); }
    paint(ellPts(hx - s * .12, hy - s * .05, s * .22, s * .1, 10, 0, -.2), { wash: '#FFFFFF', ink: null });
    paint(ellPts(hx - s * .14, hy - s * .05, s * .07, s * .08, 8), { wash: '#1A1A22', ink: null });
    paint([[hx - s * .5, hy + s * .02], [hx - s * .82, hy + s * .1], [hx - s * .5, hy + s * .2]], { wash: '#D8C8A0', ink: '#1A2A5A', sw: .5 });
    if (o.blush) paint(ellPts(hx + s * .05, hy + s * .2, s * .14, s * .08, 10), { fill: PAL.rose, fillOp: 110, bleed: .2, tex: .4, ink: null });
  }
  wallpaperK('p3_murugan', (t, k) => {
    sky('mu sky', '#F07A32', '#FFC067', '#FFE6A8');
    cloudBank(t, 640, 'mu', { n: 5, w: 300, cols: ['#FFE1B0', '#F7B070'] });
    // Palani hill, its temple's gold vimana on top
    boilSeed('mu hill');
    paint([[-60, 1860], [60, 1790], [150, 1735], [220, 1730], [300, 1780], [420, 1850], [700, 1880], [900, 1820], [1000, 1790], [1140, 1800], [1140, 2100], [-60, 2100]], { wash: '#C77A4A', fill: '#A85E36', fillOp: 70, tex: .4, ink: null, curv: .5 });
    paint(rectPts(160, 1690, 56, 42), { wash: '#F2C230', fill: '#C89A1C', fillOp: 60, ink: INK, sw: .7 });
    paint([[154, 1692], [188, 1650], [222, 1692]], { wash: '#F2C230', fill: '#C89A1C', fillOp: 60, ink: INK, sw: .7 });
    paint(ellPts(188, 1646, 7, 7, 8), { wash: '#F2C230', ink: INK, sw: .5 });
    const cx = 540, fy = 1500, open = kSeg(k, .1, .75), pop = kBump(k, .55, 1);
    glow(cx, fy, 760, '#FFE9A0', .55);
    peacockFan(t, cx, fy + 160, 640, open, 'mu fan');
    floor(1985, '#2F7A6A', '#1E5A4C', 'mu floor');
    rangoli(t, cx, 2150, 450, 96, ['#F7A21B', '#E2476E', '#2FB0A8'], 'mu rangoli');
    diya(110, 2010, 140, t, 'mu L'); diya(970, 2010, 140, t, 'mu R');
    peacockBody(t, 690, 1720, 'mu body');
    peacockHead(t, 790, 1680, 78, 'mu pk', { nod: lsin(t, 2) * .3 - pop * .5, blush: 1 });
    const breath = lsin(t, 2) * .1;
    rigClock(t, 'karti', 0, () => kartikeya(cx - 20, 2020, 44, {
      shield: false, spearA: .08, aR: -1.0, aL: -.9, eyes: 'normal', mouth: pop > .3 ? 'grin' : 'smile', blush: .55, lookX: .15,
      dy: -breath, sq: breath * .3, htilt: lsin(t, 1, .2) * .04, featherWob: lsin(t, 1) * .1, boilKey: 'mu karti', noShadow: true,
    }), { at: 1.1 });
    petalFall(t, 16, 'mu', { y0: 160, s: 20 });
    garland(t, 10, 'mu', { n: 3, sag: 110 });
  });

  // ---------- Ram Lalla of Ayodhya ----------
  // The five-year-old Ram in black stone, a golden bow and arrow, a tall crown, before a gold prabhavali (its ring of
  // medallions stands for the ten avatars carved round the murti), between pink sandstone pillars.
  // wake: the lamps light and rose petals fall
  const RL = { skin: '#3C3E4C', skinDk: '#262833', skinLt: '#6A6E84', teal: '#F2C230', tealDk: '#C89A1C', tealLt: '#FFE69A', sash: '#D9302E', sashDk: '#A02020', hair: '#1A1A22', hairLt: '#3A3A48', gold: '#F2C230', goldDk: '#B88A1C', gem: '#D9302E', eye: '#1A1414', brow: '#1A1414', ink: '#2A1E14' };
  function ramCrown(u, sw) {   // a tall gold kirita over the head, with a sun-burst and gems
    boilSeed('rl crown');
    paint(U([[-2.8, -14.3], [2.8, -14.3], [2.7, -16], [2.2, -17.3], [1.4, -18.3], [.6, -18.9], [0, -19.6], [-.6, -18.9], [-1.4, -18.3], [-2.2, -17.3], [-2.7, -16]], u), { wash: RL.gold, fill: RL.goldDk, fillOp: 60, tex: .5, ink: RL.ink, sw: sw * .8, curv: .3 });
    for (const yy of [-15.3, -16.8]) inkLine(U([[-2.6, yy], [0, yy - .3], [2.6, yy]], u), sw * .7, RL.goldDk, 'inkfine', .4);
    for (let i = 0; i < 5; i++) { const a = Math.PI + (i + .5) / 5 * Math.PI; paint(ellPts(Math.cos(a) * 2.2 * u, (-16.6 + Math.sin(a) * 1.6) * u, .32 * u, .4 * u, 10, 0, a + Math.PI / 2), { wash: '#FFE69A', ink: RL.ink, sw: sw * .4 }); }
    for (const [gx, gy, r] of [[0, -15.6, .5], [-1.5, -15.3, .28], [1.5, -15.3, .28], [0, -18.2, .34], [0, -19.7, .26]]) paint(ellPts(gx * u, gy * u, r * u, r * u * 1.1, 10), { wash: gy < -18 ? '#2E8A5A' : RL.gem, ink: RL.ink, sw: sw * .4 });
    for (const s of [-1, 1]) paint(U([[s * 2.4, -14.6], [s * 3.6, -15.8], [s * 3.2, -14.2]], u), { wash: RL.gold, ink: RL.ink, sw: sw * .5 });
    // the Vaishnava tilak
    inkLine(U([[-.42, -13.9], [-.3, -13], [0, -12.75], [.3, -13], [.42, -13.9]], u), sw * 1.1, '#FFF6E6', 'ink', .4);
    inkLine(U([[0, -13.85], [0, -12.95]], u), sw * 1.1, '#D9302E', 'ink', 0);
  }
  function goldBow(u, sw) {   // held upright at (0, 0)
    boilSeed('rl bow');
    inkLine(U([[0, -6.4], [.2, -3], [0, 0], [.2, 3], [0, 6.4]], u), sw * .5, '#FFF2C8', 'inkfine', 0);
    paint(ribbon(U([[0, -6.6], [1.4, -4.6], [1.9, -2], [1.4, 0], [1.9, 2], [1.4, 4.6], [0, 6.6]], u), .5 * u, .5 * u), { wash: RL.gold, fill: RL.goldDk, fillOp: 60, tex: .4, ink: RL.ink, sw: sw * .7 });
    paint(ellPts(1.4 * u, 0, .5 * u, .8 * u, 10), { wash: RL.gold, ink: RL.ink, sw: sw * .5 });
  }
  function goldArrow(u, sw) {   // held point down at (0, 0)
    boilSeed('rl arrow');
    inkLine(U([[0, -4], [0, 5.4]], u), sw * 1.2, RL.goldDk, 'ink', 0);
    paint(U([[-.45, 5.2], [.45, 5.2], [0, 6.6]], u), { wash: RL.gold, ink: RL.ink, sw: sw * .5 });
    for (const s of [-1, 1]) paint(U([[0, -3.2], [s * .7, -4.4], [s * .5, -3], [0, -2.2]], u), { wash: '#D9302E', ink: RL.ink, sw: sw * .4 });
  }
  wallpaperK('p3_ramlalla', (t, k) => {
    sky('rl sky', '#5A2A1A', '#C8643A', '#F2B26A');
    const cx = 540;
    // pink sandstone pillars either side
    for (const s of [-1, 1]) { const px = cx + s * 430; boilSeed('rl pillar ' + s);
      paint(rectPts(px - 70, 760, 140, 1240), { wash: '#E8A08A', fill: '#C87A68', fillOp: 70, tex: .5, ink: INK, sw: .8 });
      for (let j = 0; j < 6; j++) inkLine([[px - 66, 900 + j * 200], [px + 66, 900 + j * 200]], 1, '#B06A58', 'inkfine', .2);
      for (let j = 0; j < 5; j++) paint(ellPts(px, 1000 + j * 200, 30, 30, 14), { wash: '#F2B8A4', ink: '#B06A58', sw: .5 }); }
    // the gold prabhavali: an arch with ten medallions round it
    const ay = 1450;
    glow(cx, ay, 700, '#FFE29A', .6);
    rays(t, cx, ay, 300, 560, 24, '#FFD27A', 90, 'rl rays');
    boilSeed('rl arch');
    const arch = []; for (let i = 0; i <= 40; i++) { const a = Math.PI + i / 40 * Math.PI; arch.push([cx + Math.cos(a) * 330, ay - 60 + Math.sin(a) * 430]); }
    paint([[cx - 330, 1990], ...arch, [cx + 330, 1990]], { wash: '#E8B83A', fill: '#B8821C', fillOp: 60, tex: .5, ink: INK, sw: 1.1 });
    const arch2 = arch.map(([x, y]) => [cx + (x - cx) * .84, ay - 60 + (y - ay + 60) * .86]);
    paint([[cx - 277, 1990], ...arch2, [cx + 277, 1990]], { wash: '#3A2A3A', fill: '#24182A', fillOp: 70, tex: .4, ink: INK, sw: .8 });
    for (let i = 0; i < 10; i++) { const a = Math.PI + (i + .5) / 10 * Math.PI, mx = cx + Math.cos(a) * 304, my = ay - 60 + Math.sin(a) * 396, g = .6 + .4 * lsin(t, 1, -i * .1);
      paint(ellPts(mx, my, 24, 24, 14), { wash: '#FFE69A', fill: '#E8B83A', fillOp: 60, ink: INK, sw: .6 }); glow(mx, my, 34, '#FFF2B0', .3 * g); }
    glow(cx, 1480, 380, '#FFE9B0', .35);
    floor(1990, '#C87A68', '#9A5A48', 'rl floor');
    rangoli(t, cx, 2150, 450, 96, ['#F7A21B', '#E2476E', '#FFD23C'], 'rl rangoli');
    lotusSeat(cx, 2000, 560, 'rl lotus', .9);
    const breath = lsin(t, 2) * .08;
    rigClock(t, 'karti', 0, () => kartikeya(cx, 1985, 40, {
      pal: RL, crown: 0, topknot: false, feather: false, tilak: false, shield: false, spear: false, aR: -1.15, aL: -1.15,
      armR: (u, sw) => goldBow(u, sw), armL: (u, sw) => goldArrow(u, sw), head: (u, sw) => ramCrown(u, sw),
      eyes: 'normal', mouth: 'smile', blush: .3, dy: -breath, sq: breath * .3, htilt: lsin(t, 1, .2) * .03, boilKey: 'rl ram', noShadow: true,
    }), { at: 2.2 });
    // gold necklaces and a garland of roses and marigolds over him
    boilSeed('rl mala');
    for (let i = 0; i <= 16; i++) { const f = i / 16, a = Math.PI * f, mx = cx - Math.cos(a) * 130, my = 1985 - 9.2 * 40 + Math.sin(a) * 210 - breath * 40;
      paint(ellPts(mx, my, 15, 15, 10), { wash: i % 2 ? '#E2476E' : '#F7A21B', ink: INK, sw: .4 }); }
    diya(110, 2010, 140, t, 'rl L', { lit: kSeg(k, .05, .3) }); diya(970, 2010, 140, t, 'rl R', { lit: kSeg(k, .25, .5) });
    petalFall(t, 20, 'rl', { y0: 160, s: 18, cols: [['#E2476E', '#B02A4A'], ['#F28BB0', '#D45C8A'], ['#FFC93C', '#E0A21A']] });
    garland(t, 10, 'rl', { n: 3, sag: 110 });
  });

  // ---------- Tirupati: Sri Venkateswara (Balaji, Srinivasa, Govinda) ----------
  // Dark as the murti, a tall gold kirita, the white namam over his eyes, the chakra and shankh in his upper hands, the
  // lower right hand pointing to his feet (varada), the lower left on his hip, a heavy garland; the gold Ananda Nilayam
  // vimana behind. wake: the lamps light and a glint runs over the gold
  const VB = { skin: '#2E3352', skinDk: '#1C2036', skinLt: '#545C84', teal: '#F2C230', tealDk: '#C89A1C', tealLt: '#FFE69A', sash: '#D9302E', sashDk: '#A02020', hair: '#1A1A22', hairLt: '#3A3A48', gold: '#F2C230', goldDk: '#B88A1C', gem: '#D9302E', eye: '#1A1414', brow: '#1A1414', ink: '#2A1E14' };
  function balajiHead(u, sw) {
    boilSeed('vb crown');
    // the kirita: tall, tapering, banded, a gem in each band
    paint(U([[-2.9, -14.2], [2.9, -14.2], [2.6, -17], [2.1, -19.6], [1.5, -21.8], [.8, -23.4], [0, -24.3], [-.8, -23.4], [-1.5, -21.8], [-2.1, -19.6], [-2.6, -17]], u), { wash: VB.gold, fill: VB.goldDk, fillOp: 60, tex: .5, ink: VB.ink, sw: sw * .8, curv: .2 });
    for (const [yy, w] of [[-15.6, 2.7], [-17.8, 2.35], [-20, 1.95], [-22, 1.45]]) { inkLine(U([[-w, yy], [0, yy - .2], [w, yy]], u), sw * .8, VB.goldDk, 'inkfine', .4); paint(ellPts(0, (yy - .75) * u, .34 * u, .4 * u, 10), { wash: yy < -19 ? '#2E8A5A' : VB.gem, ink: VB.ink, sw: sw * .4 }); }
    for (const s of [-1, 1]) paint(U([[s * 2.8, -14.4], [s * 4, -15.4], [s * 3.4, -13.6]], u), { wash: VB.gold, ink: VB.ink, sw: sw * .5 });
    // the namam: a broad white U over the eyes, the red line up its middle
    for (const s of [-1, 1]) paint(ribbon(U([[s * 1.15, -11.3], [s * 1.2, -12.6], [s * 1.05, -14.1]], u), 1.05 * u, .8 * u), { wash: '#FFFDF4', ink: VB.ink, sw: sw * .45 });
    paint(ribbon(U([[-1.15, -11.35], [0, -10.95], [1.15, -11.35]], u), .7 * u, .7 * u), { wash: '#FFFDF4', ink: null });
    paint(ribbon(U([[0, -11.5], [0, -14]], u), .42 * u, .3 * u), { wash: '#E8501E', ink: null });
  }
  wallpaperK('p3_balaji', (t, k) => {
    sky('vb sky', '#16204A', '#3A4A8A', '#C88A4A');
    twinkle(t, 30, 'vb', { y1: 900 });
    const cx = 540, hy = 1360;
    // the Ananda Nilayam: a gold vimana, tiered, a kalasha on top
    glow(cx, 1300, 760, '#FFD27A', .45);
    boilSeed('vb vimana');
    for (const [y0, y1, w] of [[1720, 1530, 290], [1530, 1370, 240], [1370, 1230, 190], [1230, 1110, 140]]) {
      paint([[cx - w, y0], [cx - w * .92, y1], [cx + w * .92, y1], [cx + w, y0]], { wash: '#D9A43A', fill: '#A8761C', fillOp: 60, tex: .5, ink: INK, sw: 1 });
      paint(rectPts(cx - w * .94, y1 - 14, w * 1.88, 18), { wash: '#F2C230', ink: INK, sw: .7 });
      for (let j = -2; j <= 2; j++) paint(ellPts(cx + j * w * .36, (y0 + y1) / 2 + 6, 13, 20, 10), { wash: '#8A5A14', ink: null });
    }
    paint(ellPts(cx, 1075, 120, 66, 24), { wash: '#F2C230', fill: '#B8821C', fillOp: 60, tex: .5, ink: INK, sw: 1 });
    paint(ellPts(cx, 1000, 26, 24, 12), { wash: '#F2C230', ink: INK, sw: .7 }); paint([[cx - 12, 980], [cx, 945], [cx + 12, 980]], { wash: '#F2C230', ink: INK, sw: .6 });
    rays(t, cx, hy, 330, 700, 26, '#FFE29A', 70, 'vb rays');
    floor(1990, '#5A3A6A', '#3A2448', 'vb floor');
    rangoli(t, cx, 2150, 450, 96, ['#F7A21B', '#E2476E', '#FFD23C'], 'vb rangoli');
    const breath = lsin(t, 2) * .08, x = cx, y = 1985, u = 40, sh = (s) => [x + s * 2.6 * u, y - 8.7 * u - breath * u];
    // the upper pair of arms, raised, with the chakra (his right, screen left) and the shankh
    for (const s of [-1, 1]) { const [sx, sy] = sh(s), hx2 = sx + s * 2.3 * u, hy2 = sy - 3.1 * u; boilSeed('vb up ' + s);
      paint(ribbon([[sx, sy], [sx + s * 1.5 * u, sy - 1.7 * u], [hx2, hy2]], 1.1 * u, .9 * u), { wash: VB.skin, fill: VB.skinDk, fillOp: 40, tex: .5, ink: VB.ink, sw: 1.2 });
      inkLine([[sx + s * 1.1 * u, sy - 1.6 * u], [sx + s * 1.9 * u, sy - .9 * u]], 2.4, VB.gold, 'ink', 0);
      push(); translate(hx2, hy2); if (s < 0) chakra(u, 1.6, t / WL * TAU * 2, VB.ink); else shankh(u * 1.05, 1.6, .15, VB.ink); pop();
      paint(ellPts(hx2, hy2 + .15 * u, .7 * u, .62 * u, 14), { wash: VB.skin, ink: VB.ink, sw: 1 }); }
    rigClock(t, 'karti', 0, () => kartikeya(x, y, u, {
      pal: VB, crown: 0, topknot: false, feather: false, tilak: false, shield: false, spear: false, aL: -1.25, aR: -1.68,
      head: (uu, sw) => balajiHead(uu, sw), eyes: 'normal', mouth: 'smile', blush: .25, dy: -breath, sq: breath * .3, boilKey: 'vb body', noShadow: true,
    }), { noBlink: true });
    // the gold kavacham on his chest, Lakshmi's mark on it, the long garland
    boilSeed('vb kavach');
    paint(P([[-2.2, -9.2], [2.2, -9.2], [2.0, -7.6], [1.2, -6.7], [-1.2, -6.7], [-2.0, -7.6]], x, y - breath * u, u), { wash: '#F2C230', fill: '#C89A1C', fillOp: 50, tex: .4, ink: INK, sw: .9, curv: .3 });
    paint(ellPts(x + .9 * u, y - 8.1 * u - breath * u, .38 * u, .44 * u, 10), { wash: '#E2476E', ink: INK, sw: .5 });
    for (let i = 0; i <= 22; i++) { const f = i / 22, a = Math.PI * f, gx = x - Math.cos(a) * 2.5 * u, gy = y - 9.1 * u + Math.sin(a) * 6.6 * u - breath * u;
      paint(ellPts(gx, gy, 15, 15, 10), { wash: ['#F7A21B', '#FFFFFF', '#E2476E', '#5DA45A'][i % 4], ink: INK, sw: .4 }); }
    const gl = kBump(k, .3, 1);
    if (gl > 0) { const gx = lerp(cx - 300, cx + 300, seg(k, .3, 1)); glow(gx, 1250, 220, '#FFF6D0', .7 * gl); }
    diya(110, 2010, 140, t, 'vb L', { lit: kSeg(k, .05, .3) }); diya(970, 2010, 140, t, 'vb R', { lit: kSeg(k, .2, .45) });
    sparkles(t, cx, hy, 540, 10, 'vb');
    petalFall(t, 14, 'vb', { y0: 160, s: 18 });
    garland(t, 10, 'vb', { n: 3, sag: 110 });
  });

  // ---------- Sabarimala: Ayyappa ----------
  // Seated in his yogic squat, the yogapatta band round his knees, the right hand in chin mudra, the left resting on the
  // knee, a bell at his neck; above the eighteen gold steps, the forest hills behind. wake: the lamps along the steps light
  const AY = { skin: '#E8B482', skinDk: '#C88A5A', skinLt: '#FFD9B0', teal: '#E8701E', tealDk: '#B8501A', tealLt: '#FFA860', sash: '#2A2A3A', sashDk: '#121218', hair: '#1E1A24', hairLt: '#3A3446', gold: '#F2C230', goldDk: '#B88A1C', gem: '#D9302E', eye: '#2A1A12', brow: '#2A1A12', ink: '#3A2214', dot: '#D2452F', ash: '#FBF3E6' };
  wallpaperK('p3_ayyappa', (t, k) => {
    sky('ay sky', '#1A3A3A', '#4A8A6A', '#F2C27A');
    twinkle(t, 26, 'ay', { y1: 860 });
    const cx = 540;
    glow(cx, 1380, 720, '#FFE29A', .5);
    rays(t, cx, 1380, 320, 680, 24, '#FFE9A8', 60, 'ay rays');
    // forest hills
    boilSeed('ay hills');
    paint([[-60, 1620], [140, 1540], [300, 1590], [470, 1520], [640, 1580], [820, 1500], [1140, 1590], [1140, 2100], [-60, 2100]], { wash: '#2E6A4A', fill: '#1E4A34', fillOp: 70, tex: .5, ink: null, curv: .6 });
    for (let i = 0; i < 9; i++) { const tx = 40 + i * 125, ty = 1600 + (i % 2) * 40; paint([[tx - 34, ty + 30], [tx, ty - 70], [tx + 34, ty + 30]], { wash: '#1E5A3A', ink: null }); }
    // the eighteen steps, gold, narrowing up to his seat; lamps along both edges light from the bottom up on wake
    const steps = (yMax = 1e9) => {   // drawn again over the rig (yMax): its legs, lowered under the seat, must not show
      boilSeed('ay steps');
      const sTop = 1880, sBot = 2330, y1 = Math.min(sBot, yMax), w1 = lerp(170, 360, (y1 - sTop) / (sBot - sTop));
      paint([[cx - 170, sTop], [cx + 170, sTop], [cx + w1, y1], [cx - w1, y1]], { wash: '#E8B83A', fill: '#B8821C', fillOp: 60, tex: .5, ink: INK, sw: 1 });
      for (let i = 1; i < 18; i++) { const f = i / 18, yy = lerp(sTop, sBot, f), w = lerp(170, 360, f); if (yy < y1) inkLine([[cx - w, yy], [cx + w, yy]], 1, '#9A6A14', 'inkfine', 0); }
      for (let i = 0; i < 6; i++) { const f = 1 - i / 6 - .08, yy = lerp(sTop, sBot, f), w = lerp(170, 360, f) + 30;
        if (yy < y1 + 40) for (const s of [-1, 1]) diya(cx + s * w, yy, 60, t, `ay st ${i} ${s}`, { lit: kSeg(k, .05 + i * .1, .2 + i * .1) }); }
    };
    steps();
    // Ayyappa, seated low on a gold seat in his yogic squat: the rig's body lowered 3.5u so his hips sit on the seat, the
    // seat's front hiding the rest; then the knees up and wide either side of the chest, bare shins down to the feet, the
    // yogapatta across the front of both knees, the left arm draped over the left knee, the right hand in chin mudra
    const x = cx, y = 1870, u = 44, breath = lsin(t, 2) * .08, dyB = 3.5 - breath, chin = 3.36, Q = pts => P(pts, x, y, u), Qb = pts => P(pts, x, y + dyB * u - 3.5 * u, u);
    rigClock(t, 'karti', 0, () => kartikeya(x, y, u, {
      pal: AY, crown: 1, topknot: false, feather: false, shield: false, spear: false, aL: chin, aR: -1.25,
      eyes: 'normal', mouth: 'smile', blush: .35, dy: dyB, sq: breath * .3, htilt: lsin(t, 1, .2) * .03, boilKey: 'ay body', noShadow: true,
    }), { at: 2.4 });
    steps(y + 3.6 * u);
    boilSeed('ay seat'); paint(rrPts(cx - 250, y - 4, 500, 72, 16), { wash: '#F2C230', fill: '#C89A1C', fillOp: 60, tex: .4, ink: INK, sw: 1 });
    for (let j = 0; j < 5; j++) paint(ellPts(cx - 200 + j * 100, y + 32, 14, 14, 10), { wash: j % 2 ? '#2E8A5A' : '#D9302E', ink: INK, sw: .4 });
    boilSeed('ay legs');
    for (const s of [-1, 1]) {
      paint(ribbon(Q([[s * 1.4, -1.0], [s * 2.6, -2.8], [s * 3.4, -4.1]]), 1.55 * u, 1.3 * u), { wash: AY.teal, fill: AY.tealDk, fillOp: 50, tex: .6, ink: INK, sw: 1 });   // the thighs, in the dhoti
      paint(ribbon(Q([[s * 3.45, -4.0], [s * 3.55, -2.2], [s * 3.4, -.7]]), 1.15 * u, .95 * u), { wash: AY.skin, fill: AY.skinDk, fillOp: 40, tex: .5, ink: INK, sw: 1 });   // the shins
      paint(ellPts(x + s * 3.45 * u, y - 4.2 * u, 1.08 * u, .95 * u, 18), { wash: AY.skin, fill: AY.skinLt, fillOp: 50, tex: .5, ink: INK, sw: 1 });   // the knees, up
      paint(ellPts(x + s * 3.65 * u, y - .4 * u, 1.2 * u, .46 * u, 14), { wash: AY.skin, ink: INK, sw: .9 });   // the feet on the seat
      inkLine(Q([[s * 2.9, -.95], [s * 4.0, -.95]]), 2.4, AY.gold, 'ink', 0);
    }
    // the yogapatta: a gold band across the front of both knees
    paint(ribbon(Q([[-4.7, -3.0], [-2.3, -2.6], [0, -2.5], [2.3, -2.6], [4.7, -3.0]]), .78 * u, .78 * u), { wash: '#F2C230', fill: '#C89A1C', fillOp: 50, tex: .4, ink: INK, sw: 1 });
    inkLine(Q([[-4.5, -3.0], [0, -2.55], [4.5, -3.0]]), 1.2, '#9A6A14', 'inkfine', .4);
    for (const s of [-1, 1]) paint(ellPts(x + s * 4.75 * u, y - 3.0 * u, .3 * u, .42 * u, 10), { wash: '#F2C230', ink: INK, sw: .6 });
    // the left arm (screen right) over the knee, the hand hanging past it
    boilSeed('ay arm');
    paint(ribbon(Qb([[2.6, -5.2], [3.6, -4.7], [4.45, -3.7]]), 1.1 * u, .92 * u), { wash: AY.skin, fill: AY.skinDk, fillOp: 40, tex: .5, ink: INK, sw: 1 });
    inkLine(Qb([[3.0, -5.4], [3.3, -4.5]]), 2.4, AY.gold, 'ink', 0);
    paint(ellPts(x + 4.6 * u, y - 3.35 * u + (dyB - 3.5) * u, .62 * u, .7 * u, 14), { wash: AY.skin, ink: INK, sw: .9 });
    // the chin mudra at his chest: thumb and forefinger in a ring, three fingers up
    const [mx, my] = kartiHand(x, y, u, { aL: chin, dy: dyB }, -1);
    paint(ellPts(mx, my, .72 * u, .66 * u, 14), { wash: AY.skin, ink: INK, sw: .9 });
    paint(ellPts(mx - .3 * u, my - .45 * u, .26 * u, .26 * u, 10), { wash: AY.skinLt, ink: INK, sw: .7 });
    for (const dd of [0, .3, .58]) inkLine([[mx + dd * u, my - .4 * u], [mx + (dd + .1) * u, my - 1.25 * u]], 3, INK, 'ink', 0);
    // the bell at his neck
    const yy0 = y + (dyB - 3.5) * u;
    inkLine(P([[-.4, -5.8], [0, -5.5], [.4, -5.8]], x, yy0, u), 1, INK, 'inkfine', .4);
    const bs = lsin(t, 2) * .12 + kBump(k, .4, 1) * .5;
    push(); translate(x, yy0 - 5.5 * u); rotate(bs); boilSeed('ay bell');
    paint(U([[-.5, 0], [.5, 0], [.7, 1.1], [-.7, 1.1]], u), { wash: '#F2C230', fill: '#C89A1C', fillOp: 50, ink: INK, sw: .7, curv: .4 });
    paint(ellPts(0, 1.2 * u, .2 * u, .2 * u, 8), { wash: '#8A6A14', ink: null }); pop();
    petalFall(t, 14, 'ay', { y0: 160, s: 18 });
    garland(t, 10, 'ay', { n: 3, sag: 110 });
  });

  // ---------- Mahakal of Ujjain: the jyotirlinga in its shringar ----------
  // The linga on its silver jaladhari, its face of sandal and bhasma: big eyes, the tripundra and third eye, the
  // crescent moon, a silver crown of five naga hoods, rudraksha and garlands, bilva leaves; a trishul and damaru behind,
  // ash drifting up. wake: a puff of bhasma blows off the linga and clears
  wallpaperK('p3_mahakal', (t, k) => {
    sky('mk sky', '#140E2A', '#3A2A5A', '#7A4A6A');
    twinkle(t, 36, 'mk', { y1: 1000 });
    const cx = 540, lx = cx, ly = 1880;
    glow(cx, 1420, 760, '#FFB86A', .4);
    rays(t, cx, 1420, 340, 700, 24, '#FFD9A0', 55, 'mk rays');
    // the trishul behind, a damaru tied to it
    boilSeed('mk trishul');
    inkLine([[cx, 2000], [cx, 900]], 14, '#4A3A2A', 'ink', 0); inkLine([[cx, 2000], [cx, 900]], 9, '#8A6A4A', 'ink', 0);
    paint([[cx - 16, 900], [cx + 16, 900], [cx + 10, 860], [cx, 760], [cx - 10, 860]], { wash: '#DCE3EA', ink: INK, sw: 1 });
    for (const s of [-1, 1]) paint([[cx, 915], [cx + s * 110, 905], [cx + s * 125, 790], [cx + s * 90, 880]], { wash: '#DCE3EA', ink: INK, sw: 1, curv: .3 });
    push(); translate(cx + 70, 990); rotate(lsin(t, 2) * .12); boilSeed('mk damaru');
    paint([[-36, -34], [36, -34], [8, 0], [36, 34], [-36, 34], [-8, 0]], { wash: '#C8673A', ink: INK, sw: 1, curv: .2 });
    for (const yy of [-34, 34]) paint(ellPts(0, yy, 36, 9, 12), { wash: '#F2C04A', ink: INK, sw: .6 }); pop();
    floor(1990, '#3A2A3A', '#221A24', 'mk floor');
    rangoli(t, cx, 2160, 450, 92, ['#FFFFFF', '#F7A21B', '#E2476E'], 'mk rangoli', { base: '#F3EEE6' });
    // the silver jaladhari, its spout to the right
    boilSeed('mk base');
    paint([[lx + 260, 1900], [lx + 470, 1930], [lx + 480, 1965], [lx + 270, 1965]], { wash: '#C8D0DC', fill: '#8A94A4', fillOp: 60, tex: .4, ink: INK, sw: 1, curv: .3 });
    paint(ellPts(lx, 1935, 330, 70, 30), { wash: '#C8D0DC', fill: '#8A94A4', fillOp: 60, tex: .4, ink: INK, sw: 1.2 });
    paint(ellPts(lx, 1912, 300, 56, 30), { wash: '#E6EBF2', fill: '#B4BCC8', fillOp: 50, tex: .4, ink: INK, sw: .9 });
    // the linga: a dome of dark stone dusted with bhasma
    const L = [[lx - 212, ly + 10], [lx - 214, ly - 200]]; for (let i = 0; i <= 32; i++) { const a = Math.PI + i / 32 * Math.PI; L.push([lx + Math.cos(a) * 214, ly - 200 + Math.sin(a) * 330]); } L.push([lx + 214, ly - 200], [lx + 212, ly + 10]);
    boilSeed('mk linga');
    paint(L, { wash: '#3A3640', fill: '#24222A', fillOp: 70, tex: .5, ink: INK, sw: 1.4 });
    paint(ellPts(lx - 70, ly - 380, 100, 140, 20, 0, -.2), { fill: '#7A7680', fillOp: 120, bleed: .3, tex: .8, border: .8, ink: null });
    for (const [bx, by, r] of [[-150, -120, 70], [160, -90, 60], [-120, -420, 50], [140, -360, 55], [0, -40, 80]]) paint(ellPts(lx + bx, ly + by, r, r * .8, 16), { fill: '#D8D4DC', fillOp: 70, bleed: .35, tex: .8, border: .8, ink: null });
    // the tripundra across the forehead, a red dot, the third eye
    const fy = ly - 235;
    for (const yy of [-150, -118, -86]) inkLine([[lx - 165, fy + yy + 12], [lx, fy + yy - 6], [lx + 165, fy + yy + 12]], 9, '#FFFDF6', 'ink', .4);
    const open = 1 - kBump(k, .5, .85);
    paint(ellPts(lx, fy - 124, 15, 30 * Math.max(.15, open), 12), { wash: '#F2C04A', ink: INK, sw: .8 }); if (open > .4) paint(ellPts(lx, fy - 124, 6, 15 * open, 8), { wash: '#D9302E', ink: null });
    cuteFace(lx, fy + 10, 82, { open, lip: '#C0485A', nose: '#8A6A5A' });
    // the silver crown above the forehead: a band, five naga hoods fanned over the top, the crescent moon
    boilSeed('mk crown');
    for (let i = 0; i < 5; i++) { const a = Math.PI + (i + .5) / 5 * Math.PI, hx = lx + Math.cos(a) * 195, hy = ly - 330 + Math.sin(a) * 265;
      push(); translate(hx, hy); rotate(a + Math.PI / 2);
      paint([[-44, 34], [-52, -10], [-30, -56], [0, -70], [30, -56], [52, -10], [44, 34]], { wash: '#E2E7EE', fill: '#9AA4B4', fillOp: 60, tex: .4, ink: INK, sw: 1.1, curv: .4 });
      paint(ellPts(0, -14, 18, 26, 12), { wash: '#AAB4C4', ink: null }); for (const s of [-1, 1]) paint(ellPts(s * 12, -34, 5, 5, 6), { wash: '#D9302E', ink: null });
      pop(); }
    paint(ribbon([[lx - 205, ly - 400], [lx - 100, ly - 452], [lx, ly - 466], [lx + 100, ly - 452], [lx + 205, ly - 400]], 34, 34), { wash: '#E2E7EE', fill: '#9AA4B4', fillOp: 50, tex: .4, ink: INK, sw: 1.1 });
    for (const gx of [-120, -40, 40, 120]) paint(ellPts(lx + gx, ly - 448 + Math.abs(gx) * .28, 9, 9, 8), { wash: Math.abs(gx) > 100 ? '#2E8A5A' : '#D9302E', ink: null });
    push(); translate(lx - 150, ly - 520); rotate(-.6); boilSeed('mk moon');
    paint([[-40, 24], [-50, -8], [-34, -40], [-6, -54], [-22, -28], [-24, 0], [-10, 26], [12, 40]], { wash: '#FFF6D8', ink: INK, sw: 1, curv: .5 }); pop();
    for (const s2 of [-1, 1]) { push(); translate(lx + s2 * 36, ly - 610); rotate(s2 * .4); boilSeed('mk bel ' + s2);
      for (const a of [-.6, 0, .6]) { push(); rotate(a); paint(ellPts(0, -26, 12, 26, 10), { wash: '#4E9A4A', ink: '#2A5A2A', sw: .6 }); pop(); } pop(); }
    // rudraksha and garlands draped over the linga
    for (let i = 0; i <= 18; i++) { const f = i / 18, a = Math.PI * f; paint(ellPts(lx - Math.cos(a) * 180, ly - 200 + Math.sin(a) * 120, 11, 11, 8), { wash: '#7A3A22', ink: null }); }
    for (let i = 0; i <= 22; i++) { const f = i / 22, a = Math.PI * f; paint(ellPts(lx - Math.cos(a) * 205, ly - 120 + Math.sin(a) * 110, 15, 15, 10), { wash: i % 2 ? '#FFFFFF' : '#E2476E', ink: INK, sw: .4 }); }
    // ash drifting up, and the wake's puff of bhasma
    for (let i = 0; i < 18; i++) { const f = frac(hash(i * 2.3) + t / WL * (1 + i % 2)), ax = lx + (hash(i * 4.1) - .5) * 520 + Math.sin(f * TAU + i) * 30, ay = 1700 - f * 900;
      boilSeed('mk ash ' + i); paint(ellPts(ax, ay, 8 + 6 * hash(i), 8 + 6 * hash(i), 8), { wash: '#E6E2EA', washOp: 160 * Math.sin(Math.PI * f), ink: null }); }
    const puff = kBump(k, .0, .7), pr = seg(k, 0, .7);
    if (puff > 0) for (let i = 0; i < 9; i++) { const a = -Math.PI / 2 + (i - 4) * .3, r = 60 + pr * 360;
      boilSeed('mk puff ' + i); paint(ellPts(lx + Math.cos(a) * r, ly - 420 + Math.sin(a) * r * .8, 90 + pr * 120, 70 + pr * 90, 18), { fill: '#EEEAF2', fillOp: 230 * puff, bleed: .3, tex: .5, border: .4, ink: null }); }
    diya(110, 2010, 140, t, 'mk L'); diya(970, 2010, 140, t, 'mk R');
    garland(t, 10, 'mk', { n: 3, sag: 110 });
  });

  // ---------- Khatu Shyam ----------
  // Shyam Baba as his shrine shows him: the head, dark, with large eyes, a tall crown with a peacock feather, big
  // earrings, heaped in roses and marigolds on a silver throne under a royal umbrella, saffron flags (nishan) either
  // side. wake: a shower of rose petals
  wallpaperK('p3_khatushyam', (t, k) => {
    sky('ks sky', '#7A1E2A', '#E0603A', '#FFC56A');
    const cx = 540, fy = 1440;
    petalHalo(t, cx, fy - 30, 520, 'ks', { n: 22, c1: '#FFD58A', c2: '#F7A21B', glow: '#FFB347', glowA: .6 });
    // the saffron nishan flags either side
    for (const s of [-1, 1]) { const px = cx + s * 430; boilSeed('ks flag ' + s);
      inkLine([[px, 2000], [px, 980]], 7, '#6A4A2A', 'ink', 0);
      const w = lsin(t, 2, s * .25) * 20;
      paint([[px, 990], [px + s * 170, 1010 + w], [px + s * 150, 1080 + w * .6], [px + s * 175, 1150 + w], [px, 1140]], { wash: '#F7891B', fill: '#D9620F', fillOp: 60, tex: .5, ink: INK, sw: .9, curv: .4 }); }
    // the silver throne's arch
    boilSeed('ks throne');
    const arch = []; for (let i = 0; i <= 40; i++) { const a = Math.PI + i / 40 * Math.PI; arch.push([cx + Math.cos(a) * 330, 1500 + Math.sin(a) * 470]); }
    paint([[cx - 330, 1990], ...arch, [cx + 330, 1990]], { wash: '#DCE3EA', fill: '#9AA8B8', fillOp: 60, tex: .5, ink: INK, sw: 1.1 });
    paint([[cx - 270, 1990], ...arch.map(([x, y]) => [cx + (x - cx) * .82, 1500 + (y - 1500) * .86]), [cx + 270, 1990]], { wash: '#7A2A3A', fill: '#5A1A2A', fillOp: 60, tex: .4, ink: INK, sw: .8 });
    // the royal umbrella above
    boilSeed('ks chhatra');
    paint([[cx - 260, 960], [cx - 150, 880], [cx, 850], [cx + 150, 880], [cx + 260, 960]], { wash: '#D9302E', fill: '#A02020', fillOp: 60, tex: .5, ink: INK, sw: 1, curv: .5 });
    for (let i = 0; i < 9; i++) { const x = cx - 240 + i * 60, sw2 = lsin(t, 2, i * .1) * 5; inkLine([[x, 955], [x + sw2, 990]], 2, '#F2C230', 'ink', 0); paint(ellPts(x + sw2, 996, 7, 9, 8), { wash: '#F2C230', ink: null }); }
    paint(ellPts(cx, 840, 16, 16, 10), { wash: '#F2C230', ink: INK, sw: .6 });
    floor(1990, '#6A1E2C', '#44121C', 'ks floor');
    rangoli(t, cx, 2150, 450, 96, ['#F7A21B', '#E2476E', '#FFD23C'], 'ks rangoli');
    // the garlands heaped below the head: roses, marigolds, white flowers
    for (let r = 0; r < 6; r++) for (let i = 0; i <= 12; i++) { const f = i / 12, a = Math.PI * f, gx = cx - Math.cos(a) * (150 + r * 26), gy = fy + 190 + Math.sin(a) * (90 + r * 55);
      boilSeed(`ks g${r} ${i}`); paint(ellPts(gx, gy, 20, 20, 10), { wash: ['#E2476E', '#F7A21B', '#FFFFFF', '#D9302E', '#FFC93C', '#F28BB0'][(r + i) % 6], ink: INK, sw: .5 }); }
    // the head: dark, the face framed by the crown and earrings
    const br = lsin(t, 2) * 4, bl = (k >= 1 && Math.abs(t - 2.6) < .07) || Math.abs(t - 2.75) < .05;
    boilSeed('ks face');
    paint(ellPts(cx, fy + br, 190, 210, 36), { wash: '#3A4C8E', fill: '#2A3670', fillOp: 50, tex: .5, ink: INK, sw: 1.4 });
    paint(ellPts(cx - 70, fy - 70 + br, 70, 40, 16, 0, -.3), { fill: '#4A5A8A', fillOp: 120, bleed: .3, tex: .6, border: .6, ink: null });
    for (const s of [-1, 1]) {   // the earrings
      paint(ellPts(cx + s * 195, fy + 60 + br, 30, 44, 14), { wash: '#F2C230', fill: '#C89A1C', fillOp: 50, ink: INK, sw: .9 }); paint(ellPts(cx + s * 195, fy + 60 + br, 12, 18, 8), { wash: '#D9302E', ink: null });
    }
    cuteFace(cx, fy - 4 + br, 76, { open: bl ? 0 : 1, lip: '#E2476E', ink: '#0E1020' });
    inkLine([[cx - 22, fy - 150 + br], [cx - 12, fy - 80 + br], [cx, fy - 70 + br], [cx + 12, fy - 80 + br], [cx + 22, fy - 150 + br]], 6, '#FFFDF6', 'ink', .4);
    inkLine([[cx, fy - 140 + br], [cx, fy - 84 + br]], 6, '#D9302E', 'ink', 0);
    // the crown and its peacock feather
    boilSeed('ks crown');
    paint([[cx - 200, fy - 160 + br], [cx + 200, fy - 160 + br], [cx + 170, fy - 280 + br], [cx + 90, fy - 330 + br], [cx, fy - 390 + br], [cx - 90, fy - 330 + br], [cx - 170, fy - 280 + br]], { wash: '#F2C230', fill: '#B88A1C', fillOp: 60, tex: .5, ink: INK, sw: 1.2, curv: .3 });
    for (const [gx, gy, r, c] of [[0, -230, 26, '#D9302E'], [-110, -205, 16, '#2E8A5A'], [110, -205, 16, '#2E8A5A'], [0, -320, 16, '#D9302E']]) paint(ellPts(cx + gx, fy + gy + br, r, r * 1.1, 12), { wash: c, ink: INK, sw: .6 });
    inkLine([[cx - 190, fy - 172 + br], [cx, fy - 186 + br], [cx + 190, fy - 172 + br]], 4, '#B88A1C', 'inkfine', .4);
    push(); translate(cx + 60, fy - 360 + br); rotate(.35 + lsin(t, 1) * .06); boilSeed('ks feather');
    paint(ellPts(0, -80, 34, 82, 16), { wash: '#3FA36C', fill: '#2E7A5A', fillOp: 60, tex: .5, ink: '#1E4A36', sw: .8 });
    paint(ellPts(0, -110, 20, 26, 12), { wash: '#E8B83A', ink: null }); paint(ellPts(0, -110, 13, 17, 10), { wash: '#2FB0A8', ink: null }); paint(ellPts(0, -110, 7, 9, 8), { wash: '#1E3A8A', ink: null }); pop();
    diya(110, 2010, 140, t, 'ks L'); diya(970, 2010, 140, t, 'ks R');
    const shower = kSeg(k, 0, .9);
    petalFall(t, 22, 'ks', { y0: 160, s: 20, cols: [['#E2476E', '#B02A4A'], ['#D9302E', '#A02020'], ['#F28BB0', '#D45C8A']] });
    if (k < 1) for (let i = 0; i < 30; i++) { const f = shower + hash(i * 3.1) * .3, x = hash(i * 1.7) * DW, y = -100 + f * 1900 + hash(i * 2.2) * 300;
      boilSeed('ks shower ' + i); push(); translate(x, y); rotate(f * 6 + i); paint([[-18, 0], [-6, -9], [18, 0], [-6, 9]], { wash: i % 2 ? '#E2476E' : '#D9302E', ink: null }); pop(); }
    garland(t, 10, 'ks', { n: 3, sag: 110 });
  });

  // ---------- Puri: Jagannath, Balabhadra and Subhadra ----------
  // On the ratnavedi, Balabhadra (white) on the left, Subhadra (yellow) between, Jagannath (dark) on the right, their
  // big round eyes; the Shree Mandir's spire behind with the Neelachakra and the flag. wake: they blink in turn
  function jagaDeity(x, y, s, o) {   // (x, y) the foot of the body, s its size (face width ~ s)
    const { face, eye, cloth, cloth2, key, arms = true, blink = 0, round = 1 } = o;
    boilSeed(key);
    // body draped in cloth
    paint([[x - s * .55, y], [x - s * .5, y - s * .9], [x - s * .42, y - s * 1.05], [x + s * .42, y - s * 1.05], [x + s * .5, y - s * .9], [x + s * .55, y]], { wash: cloth, fill: cloth2, fillOp: 60, tex: .6, ink: INK, sw: 1.2, curv: .3 });
    for (let i = 0; i < 3; i++) inkLine([[x - s * .5, y - s * (.2 + i * .25)], [x, y - s * (.15 + i * .25)], [x + s * .5, y - s * (.2 + i * .25)]], 2.4, '#F2C230', 'ink', .4);
    if (arms) for (const sd of [-1, 1]) paint(ribbon([[x + sd * s * .45, y - s * .95], [x + sd * s * .78, y - s * .92], [x + sd * s * .86, y - s * .82]], s * .2, s * .17), { wash: face, ink: INK, sw: 1 });
    // the head
    const hy = y - s * 1.55;
    paint([[x - s * .55, hy + s * .5], [x - s * .6, hy - s * .25], [x - s * .45, hy - s * .55], [x + s * .45, hy - s * .55], [x + s * .6, hy - s * .25], [x + s * .55, hy + s * .5]], { wash: face, ink: INK, sw: 1.4, curv: .45 });
    // the crown band
    paint([[x - s * .6, hy - s * .45], [x + s * .6, hy - s * .45], [x + s * .5, hy - s * .82], [x + s * .2, hy - s * .7], [x, hy - s * .98], [x - s * .2, hy - s * .7], [x - s * .5, hy - s * .82]], { wash: '#F2C230', fill: '#C89A1C', fillOp: 60, tex: .4, ink: INK, sw: 1, curv: .2 });
    paint(ellPts(x, hy - s * .55, s * .07, s * .08, 10), { wash: '#D9302E', ink: INK, sw: .5 });
    // eyes: white with a red rim, a black dot
    for (const sd of [-1, 1]) {
      const ex = x + sd * s * .26, ey = hy - s * .05, rx = s * .19, ry = s * .19 * round;
      paint(ellPts(ex, ey, rx * 1.12, ry * 1.12, 20), { wash: '#D9302E', ink: INK, sw: .9 });
      paint(ellPts(ex, ey, rx, ry * (1 - .9 * blink), 20), { wash: '#FFFDF6', ink: null });
      if (blink < .6) paint(ellPts(ex, ey, s * .085, s * .085 * (1 - blink), 14), { wash: '#141414', ink: null });
    }
    if (eye) paint(ellPts(x, hy - s * .32, s * .05, s * .09, 10), { wash: eye, ink: null });
    paint([[x - s * .3, hy + s * .3], [x, hy + s * .4], [x + s * .3, hy + s * .3], [x, hy + s * .27]], { wash: '#D9302E', ink: INK, sw: .8, curv: .5 });
  }
  wallpaperK('p3_jagannath', (t, k) => {
    sky('jg sky', '#14204A', '#2A4A8A', '#E8904A');
    twinkle(t, 34, 'jg', { y1: 900 });
    const cx = 540;
    // the Shree Mandir's spire, the Neelachakra, the flag
    boilSeed('jg spire');
    paint([[cx - 230, 1700], [cx - 210, 1300], [cx - 150, 1080], [cx - 80, 960], [cx, 930], [cx + 80, 960], [cx + 150, 1080], [cx + 210, 1300], [cx + 230, 1700]], { wash: '#E8D6C0', fill: '#B8A08A', fillOp: 60, tex: .5, ink: INK, sw: 1, curv: .35 });
    for (let i = 0; i < 9; i++) { const yy = 1000 + i * 75, w = [70, 120, 155, 180, 195, 205, 212, 218, 222][i]; inkLine([[cx - w, yy], [cx + w, yy]], 1, '#9A8068', 'inkfine', .2); }
    paint(ellPts(cx, 915, 40, 20, 14), { wash: '#C8B49A', ink: INK, sw: .8 });
    push(); translate(cx, 860); boilSeed('jg chakra');
    paint(ellPts(0, 0, 34, 34, 18), { wash: '#C8D0DC', ink: INK, sw: .9 }); paint(ellPts(0, 0, 22, 22, 14), { wash: '#4A5A8A', ink: null });
    for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; inkLine([[0, 0], [Math.cos(a) * 30, Math.sin(a) * 30]], 2.5, '#C8D0DC', 'ink', 0); } pop();
    inkLine([[cx, 830], [cx, 760]], 4, '#4A3A2A', 'ink', 0);
    const fw = lsin(t, 3) * 14 + kBump(k, 0, 1) * 30;
    paint([[cx, 760], [cx + 110, 770 + fw * .3], [cx + 200, 790 + fw], [cx + 110, 805 + fw * .5], [cx, 800]], { wash: '#D9302E', fill: '#A02020', fillOp: 60, ink: INK, sw: .8, curv: .4 });
    glow(cx, 1550, 640, '#FFD27A', .45);
    rays(t, cx, 1550, 340, 640, 24, '#FFE29A', 55, 'jg rays');
    floor(1990, '#5A2A2A', '#3A1A1A', 'jg floor');
    // the ratnavedi
    boilSeed('jg vedi'); paint(rrPts(cx - 470, 1930, 940, 80, 16), { wash: '#E8B83A', fill: '#B8821C', fillOp: 60, tex: .4, ink: INK, sw: 1 });
    for (let i = 0; i < 9; i++) paint(ellPts(cx - 400 + i * 100, 1970, 14, 14, 10), { wash: i % 2 ? '#D9302E' : '#2E8A5A', ink: INK, sw: .4 });
    rangoli(t, cx, 2160, 450, 92, ['#F7A21B', '#E2476E', '#FFD23C'], 'jg rangoli');
    const bl = (i, at) => Math.max(blinkK(t, at), kBump(k, .2 + i * .22, .38 + i * .22));
    const bob = i => lsin(t, 1, i * .2) * 6;
    jagaDeity(cx - 300, 1935 + bob(0), 270, { face: '#FFFDF6', cloth: '#2E7AB8', cloth2: '#1E5A8A', key: 'jg bala', blink: bl(0, 1.5), round: .85, eye: '#D9302E' });
    jagaDeity(cx + 290, 1935 + bob(2), 280, { face: '#1E1E26', cloth: '#F2C230', cloth2: '#C89A1C', key: 'jg jaga', blink: bl(2, 3.5), eye: '#FFFDF6' });
    jagaDeity(cx, 1935 + bob(1), 200, { face: '#F7D54A', cloth: '#D9302E', cloth2: '#A02020', key: 'jg subh', arms: false, blink: bl(1, 2.5), round: .9, eye: '#D9302E' });
    diya(100, 2040, 120, t, 'jg L'); diya(980, 2040, 120, t, 'jg R');
    petalFall(t, 14, 'jg', { y0: 160, s: 18 });
    garland(t, 10, 'jg', { n: 3, sag: 110 });
  });
  function blinkK(t, at) { const d = Math.abs(((t - at) % WL + WL * 1.5) % WL - WL / 2); return d < .06 ? 1 : d < .1 ? (.1 - d) / .04 : 0; }

  // ---------- Kedarnath in the snow ----------
  // The stone temple under the Kedar peaks at night, its spire and gold kalash, lamps at the door; Nandi kneels in the
  // snow before it, facing the door; snow falls. wake: the lamps light and the bell swings
  wallpaperK('p3_kedarnath', (t, k) => {
    sky('kd sky', '#0E1430', '#22305A', '#4A5A8A');
    twinkle(t, 60, 'kd', { y1: 1000 });
    const cx = 560;
    // the peaks
    boilSeed('kd peaks');
    paint([[-60, 1500], [120, 1180], [260, 1020], [380, 1120], [520, 900], [640, 840], [760, 960], [900, 1080], [1000, 1000], [1140, 1150], [1140, 1700], [-60, 1700]], { wash: '#E8EEF8', fill: '#B4C0DC', fillOp: 70, tex: .5, ink: '#3A4A6A', sw: .9, curv: .2 });
    paint([[640, 840], [760, 960], [900, 1080], [1000, 1000], [1140, 1150], [1140, 1700], [700, 1700], [650, 1200]], { wash: '#9AA8CC', fill: '#7A88B0', fillOp: 50, tex: .4, ink: null, curv: .2 });
    glow(cx, 1500, 560, '#FFD27A', .35);
    // the temple: a hall with a peaked front, the spire behind it with a gold kalash
    boilSeed('kd temple');
    paint([[cx - 150, 1560], [cx - 140, 1330], [cx - 95, 1200], [cx - 40, 1140], [cx, 1120], [cx + 40, 1140], [cx + 95, 1200], [cx + 140, 1330], [cx + 150, 1560]], { wash: '#8A8C9A', fill: '#5A5C6A', fillOp: 60, tex: .6, ink: INK, sw: 1, curv: .2 });
    for (let i = 0; i < 6; i++) { const yy = 1180 + i * 60, w = [50, 85, 110, 130, 140, 146][i]; inkLine([[cx - w, yy], [cx + w, yy]], 1, '#4A4C5A', 'inkfine', 0); }
    paint(ellPts(cx, 1105, 22, 18, 10), { wash: '#F2C230', ink: INK, sw: .7 }); paint([[cx - 8, 1090], [cx, 1050], [cx + 8, 1090]], { wash: '#F2C230', ink: INK, sw: .6 });
    paint([[cx - 290, 1880], [cx - 290, 1600], [cx - 230, 1560], [cx, 1450], [cx + 230, 1560], [cx + 290, 1600], [cx + 290, 1880]], { wash: '#9A9CAA', fill: '#6A6C7A', fillOp: 60, tex: .6, ink: INK, sw: 1.2, curv: .1 });
    paint([[cx - 230, 1585], [cx, 1480], [cx + 230, 1585]], { wash: '#B8BAC6', ink: INK, sw: .8 });
    for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) inkLine([[cx - 280 + c * 95 + (r % 2) * 45, 1640 + r * 60], [cx - 200 + c * 95 + (r % 2) * 45, 1640 + r * 60]], .8, '#5A5C6A', 'inkfine', 0);
    // snow on the roofs
    paint([[cx - 300, 1605], [cx - 230, 1556], [cx, 1445], [cx + 230, 1556], [cx + 300, 1605], [cx + 230, 1590], [cx, 1475], [cx - 230, 1590]], { wash: '#F4F8FF', ink: null });
    paint([[cx - 140, 1335], [cx - 95, 1195], [cx - 40, 1135], [cx, 1118], [cx + 40, 1135], [cx + 95, 1195], [cx + 140, 1335], [cx + 90, 1240], [cx, 1150], [cx - 90, 1240]], { wash: '#F4F8FF', washOp: 200, ink: null });
    // the door, lit
    const lit = kSeg(k, .1, .5);
    paint([[cx - 70, 1880], [cx - 70, 1710], [cx, 1660], [cx + 70, 1710], [cx + 70, 1880]], { wash: '#3A2A1A', ink: INK, sw: 1, curv: .3 });
    if (lit > 0) { glow(cx, 1780, 260, '#FFB347', .7 * lit); paint([[cx - 56, 1880], [cx - 56, 1720], [cx, 1678], [cx + 56, 1720], [cx + 56, 1880]], { wash: '#FFB347', washOp: 210 * lit, ink: null, curv: .3 }); }
    const bs = lsin(t, 2) * .08 + kBump(k, .3, 1) * .6;
    push(); translate(cx + 110, 1690); rotate(bs); boilSeed('kd bell'); inkLine([[0, 0], [0, 40]], 2, '#4A3A2A', 'ink', 0);
    paint([[-16, 40], [16, 40], [24, 78], [-24, 78]], { wash: '#E8B83A', ink: INK, sw: .7, curv: .4 }); pop();
    // the ground, snow
    floor(1880, '#E8EEF8', '#B4C0DC', 'kd snow');
    for (const [x, ph] of [[cx - 180, 0], [cx + 180, .5]]) diya(x, 1900, 90, t, 'kd lamp ' + x, { lit: kSeg(k, .1 + ph * .4, .4 + ph * .4) });
    // Nandi, kneeling in the snow, facing the door
    rigClock(t, 'nandi', 0, () => nandi(270, 2090, 30, { kneel: 1, snow: 1, eyes: 'normal', lookX: .3, tail: .3 * lsin(t, 2), ear: .15 * lsin(t, 2, .3), boilKey: 'kd nandi' }), { at: 2.4 });
    snowFallK(t, 70, 'kd');
    glow(cx, 1780, 360, '#FFB347', .25 * lit);
  });
  function snowFallK(t, n, key) {
    for (let i = 0; i < n; i++) { const laps = 1 + Math.floor(hash(i * 2.7) * 2), f = frac(hash(i * 1.3) + t / WL * laps), x = hash(i * 3.9) * DW + Math.sin(f * TAU * 2 + i) * 30, y = -40 + f * (DH + 80), r = 4 + 6 * hash(i * 5.1);
      boilSeed(key + ' snow ' + i); paint(ellPts(x, y, r, r, 8), { wash: '#FFFFFF', washOp: 200, ink: null }); }
  }
})();
