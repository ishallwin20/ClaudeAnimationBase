// wall_bappa.js: "Bal Bappa and his modak": Bal Bappa on a pink lotus at dusk, a modak in his raised hand, Mooshak
// beside him nibbling one, two diyas, marigold petals drifting down, a petal halo turning slowly behind him.
(() => {
  const C = { skyHi: '#F6B98C', skyLo: '#FFE3C0', ground: '#E9A36A', groundDk: '#C97E4A', rangoli: '#FFF3DC', rangoli2: '#E2476E' };
  wallpaper('wall_bappa', t => {
    boilSeed('wb sky');
    paint(rectPts(-60, -60, DW + 120, DH + 120), { wash: C.skyHi, ink: null });
    paint(ellPts(540, 1500, 900, 1050, 40), { fill: C.skyLo, fillOp: 190, bleed: .35, tex: .3, border: .2, ink: null });
    paint(ellPts(540, 1550, 620, 760, 36), { fill: '#FFF0D8', fillOp: 150, bleed: .35, tex: .3, border: .2, ink: null });
    cloudBank(t, 560, 'wb', { n: 5, w: 300, cols: ['#FFE9D6', '#F7C9A8'] });
    cloudBank(t, 980, 'wb2', { n: 4, w: 220, cols: ['#FFF1E0', '#F9D6B8'], laps: 1 });
    // the halo behind him
    const bx = 540, by = 1900, u = 45;
    petalHalo(t, bx, by - 30 - 10.6 * u, 500, 'wb', { n: 16 });
    // the ground: a floor with a rangoli ring
    boilSeed('wb ground');
    paint(rectPts(-60, 1960, DW + 120, 500), { wash: C.ground, fill: C.groundDk, fillOp: 60, tex: .4, ink: null });
    inkLine([[-40, 1962], [DW / 2, 1956], [DW + 40, 1962]], 1.2, '#B06A3A', 'ink', .5);
    paint(ellPts(bx, 2120, 470, 105, 40), { wash: C.rangoli, washOp: 210, ink: null });
    for (let i = 0; i < 18; i++) { const a = i / 18 * TAU + t / WL * TAU / 18; paint(ellPts(bx + Math.cos(a) * 380, 2120 + Math.sin(a) * 82, 26, 12, 10, 0, a), { wash: i % 2 ? C.rangoli2 : '#F7A21B', ink: null }); }
    // diyas either side
    diya(125, 2010, 165, t, 'wb L');
    diya(955, 2010, 165, t, 'wb R');
    // the lotus and Bal Bappa
    lotusSeat(bx, by - 30, 640, 'wb lotus', .8);
    const breath = lsin(t, 2) * .12, sway = lsin(t, 1, .15);
    rigClock(t, 'balbappa', 1, () => balBappa(bx, by - 30, u, {
      eyes: 'normal', mouth: 'smile', blush: .55, seed: 1, boilKey: 'wb bappa', noShadow: true,
      dy: -breath, sq: breath * .3, htilt: sway * .05, hx: sway * .12, lookX: .25 * sway,
      ear: .25 + .25 * lsin(t, 2, .3), trunkSway: .25 * lsin(t, 2, .5),
      aR: .12, armR: (uu) => modak(uu * .5, uu * .4, uu * 1.9), aL: .5 + .05 * lsin(t, 2, .2),
    }), { at: 1.4 });
    // Mooshak, by the lotus, nibbling
    const chew = Math.max(0, lsin(t, 6)), mx = 800, my = 2120;
    rigClock(t, 'clawd', 2, () => mooshak(mx, my, 32, { eyes: 'happy', mouth: chew > .3 ? 'o' : 'smile', tail: t / WL * 3, dy: -.08 * chew, boilKey: 'wb moo' }), { at: 3.4 });
    modak(mx - 2, my - 1.05 * 32 - 5 * chew, 50);
    // marigold petals in front
    petalFall(t, 18, 'wb', { y0: 140, s: 22 });
    garland(t, 10, 'wb', { n: 3, sag: 110 });
  });
})();
