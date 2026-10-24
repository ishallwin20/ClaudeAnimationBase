// wall_batch2.js: live wallpapers, batch 2 (Painted): Hanuman in sindoor, Kanha with his cow, Maa Lakshmi on her lotus,
// Narad Muni on a cloud, Maa Durga with Sher. Each is a seamless WL loop whose last second (5–6 s) is the iPhone's
// wake-up moment: a little beat (beat()) that settles on frame 0, the still (tools/wallpack.mjs plays 5–6 s on iPhone).
(() => {
  const beat = (t, a = 5, b = 6) => Math.sin(Math.PI * seg(t, a, b));
  function sky(key, hi, lo, mid) {
    boilSeed(key);
    paint(rectPts(-60, -60, DW + 120, DH + 120), { wash: hi, ink: null });
    paint(ellPts(540, 1600, 1000, 1150, 40), { fill: lo, fillOp: 190, bleed: .35, tex: .3, border: .2, ink: null });
    if (mid) paint(ellPts(540, 1650, 650, 800, 36), { fill: mid, fillOp: 150, bleed: .35, tex: .3, border: .2, ink: null });
  }
  function rays(t, x, y, r0, r1, n, col, op, key) {
    boilSeed(key);
    for (let i = 0; i < n; i++) {
      const a = i / n * TAU + t / WL * TAU / n, w = TAU / n * .28;
      paint([[x + Math.cos(a - w) * r0, y + Math.sin(a - w) * r0], [x + Math.cos(a) * r1, y + Math.sin(a) * r1], [x + Math.cos(a + w) * r0, y + Math.sin(a + w) * r0]], { wash: col, washOp: op, ink: null });
    }
  }
  function floor(y, c, dk, key) {
    boilSeed(key);
    paint(rectPts(-60, y, DW + 120, DH - y + 60), { wash: c, fill: dk, fillOp: 60, tex: .4, ink: null });
    inkLine([[-40, y + 2], [DW / 2, y - 4], [DW + 40, y + 2]], 1.2, dk, 'ink', .5);
  }

  // Hanuman covered in sindoor for Shri Ram's long life, palms joined, at sunrise; sindoor dust drifting
  wallpaper('wall_sindoor', t => {
    sky('wsd sky', '#F07A32', '#FFC067', '#FFE6A8');
    cloudBank(t, 620, 'wsd', { n: 5, w: 300, cols: ['#FFE1B0', '#F7B070'] });
    const x = 540, y = 2010, u = 40, hop = beat(t), breath = lsin(t, 2) * .1;
    glow(x, 1330, 700, '#FFE9A0', .6);
    rays(t, x, 1330, 330, 640, 24, '#FFD27A', 110, 'wsd rays');
    paint(ellPts(x, 1330, 300, 300, 40), { fill: '#FFF0C0', fillOp: 170, bleed: .2, tex: .3, border: .3, ink: null });
    floor(1990, '#C0562E', '#8E3A1E', 'wsd floor');
    paint(ellPts(x, 2150, 420, 95, 40), { wash: '#FFF0DC', washOp: 200, ink: null });
    for (let i = 0; i < 16; i++) { const a = i / 16 * TAU; paint(ellPts(x + Math.cos(a) * 340, 2150 + Math.sin(a) * 74, 24, 11, 10, 0, a), { wash: i % 2 ? '#E8341C' : '#F7A21B', ink: null }); }
    diya(130, 2030, 150, t, 'wsd L'); diya(950, 2030, 150, t, 'wsd R');
    rigClock(t, 'narada', 0, () => hanuman(x, y - hop * 36, u, {
      sindoor: 1, pray: 1, eyes: 'happy', mouth: hop > .3 ? 'grin' : 'smile', blush: .5, dy: -breath, sq: breath * .2 - hop * .04,
      htilt: lsin(t, 1, .2) * .04, tailSway: 1.5 + 1.1 * lsin(t, 2), boilKey: 'wsd hanu', noShadow: true,
    }), { noBlink: true });
    // a brass bowl of sindoor at his feet
    boilSeed('wsd bowl');
    paint(ellPts(x + 250, 2045, 70, 22, 18), { wash: '#E2341C', fill: '#A81E10', fillOp: 60, ink: null });
    paint([[x + 175, 2045], [x + 195, 2085], [x + 250, 2100], [x + 305, 2085], [x + 325, 2045]], { wash: '#E8B33A', fill: '#B8821C', fillOp: 70, tex: .5, ink: PAL.ink, sw: .8, curv: .4 });
    petalFall(t, 34, 'wsd dust', { y0: 200, s: 9, cols: [['#E8341C', '#B01E10'], ['#FF6A3A', '#D2401E'], ['#FFC93C', '#E0A21A']] });
    garland(t, 10, 'wsd', { n: 3, sag: 110 });
  });

  // Kanha patting his cow in a Vrindavan meadow (morning); she nuzzles up on wake
  wallpaper('wall_kanha_cow', t => {
    sky('wkc sky', '#86C0EA', '#FFE3BE', '#FFF4DC');
    cloudBank(t, 560, 'wkc', { n: 5, w: 300, cols: ['#FFFFFF', '#DCEAF6'] });
    cloudBank(t, 1050, 'wkc2', { n: 4, w: 220, cols: ['#FFFFFF', '#E6F0F8'] });
    boilSeed('wkc hills');
    paint([[-60, 1560], [200, 1430], [460, 1520], [720, 1400], [1140, 1540], [1140, 2400], [-60, 2400]], { wash: '#8CC27A', fill: '#6FA860', fillOp: 60, tex: .4, ink: null, curv: .6 });
    for (let i = 0; i < 5; i++) { const tx = [90, 330, 640, 860, 1010][i], ty = [1470, 1500, 1440, 1450, 1500][i];
      paint(ellPts(tx, ty - 40, 60, 70, 16), { wash: '#4E8A48', fill: '#3A6E38', fillOp: 70, tex: .5, ink: null }); }
    floor(1820, '#6FAE5A', '#4E8A40', 'wkc ground');
    for (let i = 0; i < 26; i++) { const fx = hash(i * 3.7) * DW, fy = 1880 + hash(i * 1.3) * 420; boilSeed('wkc fl ' + i);
      paint(ellPts(fx, fy, 9, 9, 8), { wash: ['#FFFFFF', '#FFD23C', '#F28BB0'][i % 3], ink: null }); }
    const nz = beat(t), pat = .35 * Math.max(0, lsin(t, 3)), breath = lsin(t, 2) * .1;
    rigClock(t, 'nandi', 0, () => nandi(800, 2070, 42, {
      pal: COW_PAL, ...COW_COL, flip: true, nod: .1 * lsin(t, 2) - .22 * nz, tail: .5 * lsin(t, 3), ear: .2 * lsin(t, 2, .3),
      eyes: nz > .3 ? 'happy' : 'normal', lookX: -.5, boilKey: 'wkc cow',
    }), { at: 2 });
    rigClock(t, 'kid', 0, () => balKrishna(230, 2080, 42, {
      pose: 'stand', eyes: nz > .3 ? 'happy' : 'normal', mouth: nz > .3 ? 'open' : 'smile', blush: .6, lookX: .45, htilt: .06 + lsin(t, 1) * .03,
      dy: -breath, sq: breath * .3, handR: [4.4, -9.4 - pat], handShapeR: 'open', handL: [-2.6, -3.4], handShapeL: 'open', featherWob: t / WL * 3, boilKey: 'wkc kanha',
    }), { at: .4 });
    for (let i = 0; i < 4; i++) { const a = t / WL * TAU * (1 + i % 2) + i * 1.7, bx = 150 + hash(i * 2.9) * 780 + Math.cos(a) * 70, by = 1350 + hash(i * 4.1) * 300 + Math.sin(a * 2) * 40, f = Math.abs(lsin(t, 12, i * .2));
      boilSeed('wkc bf ' + i);
      for (const s of [-1, 1]) paint(ellPts(bx + s * 14 * f, by, 14 * f + 3, 11, 8), { wash: ['#FFB43C', '#F28BB0'][i % 2], ink: PAL.ink, sw: .4 }); }
  });

  // Maa Lakshmi on her lotus over a night pond on Diwali, coins pouring from her palm, floating diyas
  wallpaper('wall_lakshmi', t => {
    sky('wl sky', '#1A1240', '#3A2A6A', '#5A3A7A');
    twinkle(t, 50, 'wl', { y1: 1300 });
    const x = 540, y = 1965, u = 37, k = beat(t), breath = lsin(t, 2) * .1;
    glow(x, 1450, 760, '#FFC860', .45 + .2 * k);
    rays(t, x, 1430, 360, 620, 20, '#FFD27A', 70, 'wl rays');
    boilSeed('wl pond');
    paint(rectPts(-60, 1900, DW + 120, 560), { wash: '#24245A', fill: '#1A1A44', fillOp: 70, tex: .4, ink: null });
    for (let i = 0; i < 7; i++) { const ry = 1960 + i * 50, rx = 120 + hash(i * 3.1) * 840, w = 60 + hash(i) * 80 + 10 * lsin(t, 2, i * .3);
      inkLine([[rx - w, ry], [rx + w, ry]], 1, '#6A6AB0', 'inkfine', .3); }
    for (let i = 0; i < 4; i++) { const px = [140, 330, 760, 950][i], py = [2130, 2230, 2240, 2120][i];
      boilSeed('wl pad ' + i); paint(ellPts(px, py, 90, 30, 18), { wash: '#3E8A50', fill: '#2A6A3A', fillOp: 70, ink: '#1E3A26', sw: .6 }); }
    for (let i = 0; i < 4; i++) diya([140, 330, 760, 950][i], [2115, 2215, 2225, 2105][i] + lsin(t, 2, i * .25) * 6, 100, t, 'wl diya ' + i);
    lotusSeat(x, y + 20, 600, 'wl lotus', .9);
    rigClock(t, 'parvati', 0, () => lakshmi(x, y, u, {
      coins: 1, coinT: t / WL * 5 / .9, coinsTo: y + 10, eyes: 'normal', mouth: 'smile', blush: .4, glowK: .6 + .3 * k,
      dy: -breath, sq: breath * .2, htilt: lsin(t, 1, .2) * .03, boilKey: 'wl lk',
    }), { at: 1.2 });
    for (let i = 0; i < 10; i++) { const a = i / 10 * TAU + t / WL * TAU, r = 470 + 30 * lsin(t, 2, i * .1), sx = x + Math.cos(a) * r, sy = 1450 + Math.sin(a) * r * .8, g = .5 + .5 * lsin(t, 3, i * .13);
      glow(sx, sy, 30, '#FFF2B0', .4 * g); boilSeed('wl sp ' + i); paint(starPts(sx, sy, 12 * g + 4, .25, 4), { wash: '#FFF6D0', ink: null }); }
  });

  // Narad Muni on a cloud, playing his veena and singing Narayana's name, music notes rising
  wallpaper('wall_narad', t => {
    sky('wn sky', '#5FA8E2', '#BFE2F6', '#FFF2DE');
    cloudBank(t, 700, 'wn', { n: 5, w: 300, cols: ['#FFFFFF', '#DCEAF6'] });
    cloudBank(t, 1250, 'wn2', { n: 4, w: 240, cols: ['#FFFFFF', '#E6F0F8'], laps: 2 });
    cloudBank(t, 2150, 'wn3', { n: 6, w: 340, cols: ['#FFFFFF', '#D6E6F4'] });
    const k = beat(t), x = 540, y = 1960 + lsin(t, 2) * 14 - k * 30, u = 34, sing = Math.max(0, lsin(t, 3));
    glow(x, 1400, 520, '#FFF4C8', .5);
    rigClock(t, 'narada', 0, () => narada(x, y, u, {
      cloud: 1, strum: clamp(Math.max(0, lsin(t, 6)) * .8 + k * .4), eyes: 'happy', mouth: sing > .5 || k > .3 ? 'open' : 'smile', blush: .5,
      htilt: lsin(t, 1, .2) * .06, hx: lsin(t, 1) * .15, boilKey: 'wn narad',
    }), { noBlink: true });
    push(); translate(x - 210, y - 560); scale(2.2); notes(0, 0, t / 1.2, 'wn notes', '#F2C230', 3); pop();
    push(); translate(x + 190, y - 720); scale(1.8); notes(0, 0, t / 1.2 + .7, 'wn notes2', '#F28BB0', 3); pop();
  });

  // Maa Durga, ten arms with the gods' gifts, Sher beside her: a Navratri evening
  wallpaper('wall_durga', t => {
    sky('wd sky', '#7A1E2A', '#E0603A', '#FFC56A');
    const x = 450, y = 1990, u = 31, k = beat(t), breath = lsin(t, 2) * .1;
    petalHalo(t, x, 1330, 560, 'wd', { n: 20, c1: '#FFD58A', c2: '#F7A21B', glow: '#FFB347', glowA: .6 });
    floor(1960, '#8E2A2A', '#5E1A1A', 'wd floor');
    paint(ellPts(540, 2150, 440, 100, 40), { wash: '#FFF0DC', washOp: 200, ink: null });
    for (let i = 0; i < 16; i++) { const a = i / 16 * TAU + t / WL * TAU / 16; paint(ellPts(540 + Math.cos(a) * 350, 2150 + Math.sin(a) * 78, 24, 11, 10, 0, a), { wash: i % 2 ? '#E2476E' : '#F7A21B', ink: null }); }
    diya(110, 2010, 140, t, 'wd L'); diya(1000, 2010, 140, t, 'wd R');
    rigClock(t, 'durga', 0, () => durga(x, y, u, {
      ...DRG_SKIN, eyes: 'normal', mouth: 'smile', blush: .4, aura: .3, chakraSpin: t / WL * TAU * 2,
      dy: -breath, sq: breath * .2, htilt: lsin(t, 1, .2) * .03, boilKey: 'wd durga', noShadow: true,
    }), { at: 1 });
    rigClock(t, 'lion', 0, () => lion(830, 2060, 24, {
      eyes: k > .3 ? 'happy' : 'normal', mouth: k > .3 ? 'roar' : 'smile', mouthK: .5 * k, tail: .35 * lsin(t, 2), hx: -.25, lookX: -.4,
      inhale: .3 * k, boilKey: 'wd sher',
    }), { at: 3 });
    petalFall(t, 18, 'wd', { y0: 160, s: 20 });
    garland(t, 10, 'wd', { n: 3, sag: 110 });
  });
})();
