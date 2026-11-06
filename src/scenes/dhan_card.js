// dhan_card.js: "Happy Dhanteras", a Painterly greeting-card cinemagraph (designs in dhan_cast.js). The paintings are
// static; on top, the marigold strings and their bells swing (stepped poses, like hand animation), gold coins stream from
// Maa Lakshmi's giving hand into the brass pot, the lamps flicker, the gold chakra behind her head turns, she blinks once,
// her jewels and the bells catch the light, gold dust rises. The greeting is up from frame 0. Everything that moves
// repeats exactly over DUR, so the reel loops without a seam.
const DH_TEXT = { hi: 'शुभ धनतेरस', title: 'Happy Dhanteras', wish: ['May Maa Lakshmi and Lord Dhanvantari bless', 'your home with health, wealth and light.'], tag: 'R I S H I   K A T H A' };
const DH_GAR_N = 16, DH_LP = TAU / DUR;
const dhLooped = (t, draw) => { const u = t / DUR; draw(t, 1 - u); draw(t - DUR, u); };   // drifting things come back round

// a lamp flame: a teardrop that breathes and leans, a white heart, a glow round it
function dhFlame(c, x, y, t, i, s = 1) {
  const f = .5 + .3 * Math.sin(t * (7 + i) * DH_LP * 2 + i) + .2 * Math.sin(t * (13 + 2 * i) * DH_LP * 2 + i * 2), h = (38 + 10 * f) * s, w = 11 * s, lean = Math.sin(t * (3 + i) * DH_LP * 2 + i * 3) * 4 * s;
  glow(c, x, y - h * .4, 110 * s, '#FFB347', .32 + .12 * f, 'lighter');
  const tip = [x + lean, y - h];
  c.save();
  c.fillStyle = ptLin(c, 0, y, 0, y - h, [[0, '#FF7A1A'], [.4, '#FFB02E'], [1, 'rgba(255,200,80,.85)']]);
  c.beginPath(); c.moveTo(x - w, y - 4); c.bezierCurveTo(x - w * 1.2, y - h * .45, tip[0] - w * .25, tip[1] + h * .3, tip[0], tip[1]); c.bezierCurveTo(tip[0] + w * .3, tip[1] + h * .3, x + w * 1.2, y - h * .45, x + w, y - 4); c.quadraticCurveTo(x, y + 6, x - w, y - 4); c.fill();
  c.fillStyle = 'rgba(255,250,220,.95)'; c.beginPath(); c.ellipse(x + lean * .3, y - h * .3, w * .45, h * .26, 0, 0, TAU); c.fill();
  ellipse(c, x, y - 2, 3 * s, 4 * s, '#3A1A08');   // the wick
  c.restore();
  glow(c, x, y - h * .45, 34 * s, '#FFF2C0', .35 + .15 * f, 'lighter');
}

// the coins: a steady stream from her fingertips into the pot, each turning as it falls, a glint now and then
function dhCoins(c, t) {
  const N = 14, [x0, y0] = DH_POUR, [x1, y1] = [DH_POT[0] + 4, DH_POT[1] - 6];
  for (let i = 0; i < N; i++) {
    const s = frac(i / N + t * 4 / DUR), sx = (hash(i + 1) - .5) * 14, x = lerp(x0 + sx, x1 + sx * 2.2, s), y = lerp(y0, y1, s * s * .7 + s * .3);
    const spin = (t * (6 + (i % 3)) * DH_LP * 2) + i * 1.7, tilt = .18 + .82 * Math.abs(Math.cos(spin)), r = 11 + hash(i + 4) * 2, a = Math.min(1, s * 8) * Math.min(1, (1 - s) * 10);
    c.save(); c.globalAlpha = a; c.translate(x, y); c.rotate(hash(i + 7) - .5);
    ellipse(c, 0, 1.5, r, r * tilt, '#7A4A10'); ellipse(c, 0, 0, r, r * tilt, '#E9B23C'); ellipse(c, 0, 0, r * .7, r * .7 * tilt, '#F7CF5E');
    c.restore();
    const g = Math.pow(Math.max(0, Math.cos(spin)), 24);
    if (g > .05) twinkle(c, x - 3, y - 3, 18, g * a * .9, '#FFF6D0');
  }
  glow(c, x0, y0 + 6, 46, '#FFE29A', .35, 'lighter');
  glow(c, x1, y1, 90, '#FFD27A', .3 + .08 * Math.sin(t * 4 * DH_LP), 'lighter');
}

SHOTS.push({
  a: 0, b: DUR, draw(c, u, t) {
    ptDraw(c, ptLayer('dh_card', [0, 0, PT_W, PT_H], dhCard, { seed: 5 }));
    // her light: a warm glow behind her, breathing
    const br = .5 + .5 * Math.sin(t * 2 * DH_LP);
    glow(c, DH_HALO[0], DH_HALO[1], 560, '#FFD98A', .32 + .06 * br, 'screen');
    // the gold chakra turns 1/24 of a turn a loop (it is 24-fold, so it comes back to itself)
    const halo = ptLayer('dh_halo', DH_HALO_BOX, dhHalo, { alpha: true, seed: 19, brushes: PT_BRUSHES.slice(2) });
    c.save(); c.translate(...DH_HALO); c.rotate(t / DUR * TAU / 24); c.translate(-DH_HALO[0], -DH_HALO[1]); ptDraw(c, halo, .95); c.restore();
    glow(c, DH_HALO[0], DH_HALO[1], 200, '#FFF4C8', .22 + .08 * br, 'screen');
    // Maa Lakshmi; she blinks once a loop
    const tb = t - DUR * .62, shut = tb > 0 && tb < .13;
    const hero = ptLayer('dh_lakshmi' + (shut ? 0 : 1), DH_BOX, dhLakshmi(shut ? 0 : 1), { alpha: true, seed: 17, brushes: PT_BRUSHES.slice(1), fine: DH_FINE, keep: DH_KEEP });
    ptDraw(c, hero);
    const rim = ptRim(hero, { dx: 0, dy: -5, col: '#FFF0B8', blur: 5, key: 'dh', density: .05 });
    ptDraw(c, rim, .35 + .12 * br, 'screen');
    // in front: the lotus seat's front petals, the pot, the lamp
    ptDraw(c, ptLayer('dh_front', [0, 1560, PT_W, 360], dhFront, { alpha: true, seed: 23, brushes: PT_BRUSHES.slice(1) }));
    dhCoins(c, t);
    DH_FLAMES.forEach(([x, y], i) => dhFlame(c, x, y, t, i, i ? .85 : 1));
    // the marigold strings swing, three times a loop
    const k = Math.floor(frac(t / DUR * 3) * DH_GAR_N) % DH_GAR_N, ph = k / DH_GAR_N;
    ptDraw(c, ptLayer('dh_gar' + k, DH_GAR_BOX, dhGarlands(ph), { alpha: true, seed: 29, brushes: PT_BRUSHES.slice(2) }));
    DH_BELLS(ph).forEach(([x, y], i) => { const q = frac(t / DUR * 3 + i * .27); twinkle(c, x - 8, y + 10, 22, Math.pow(Math.max(0, Math.sin(q * TAU)), 10) * .8); });
    // gold dust rising from the pot and drifting round her
    dhLooped(t, (tt, a) => motes(c, { n: 26, seed: 6, box: [DH_POT[0] - 110, 1000, DH_POT[0] + 110, 1700], r: 2.6, col: '#FFCF6A', a: .8 * a, vx: 4, vy: -60, t: tt }));
    dhLooped(t, (tt, a) => motes(c, { n: 40, seed: 4, box: [120, 700, 960, 1600], r: 2.4, col: '#FFE7A0', a: .5 * a, vx: 5, vy: -9, t: tt }));
    // her jewels catch the light
    rim.pts.forEach(([x, y], i) => {
      const rate = Math.max(1, Math.round((.3 + hash(i) * .4) * DUR)) / DUR, q = frac(t * rate + hash(i + 9));
      twinkle(c, x, y, 8 + hash(i + 3) * 8, Math.pow(Math.max(0, Math.sin(q * Math.PI)), 6) * .85);
    });
    [[...dhHd(DH_X, 832), 0], [DH_X, 1322 + DH_DY, 1.7], [...dhHd(DH_X - 80, 1092), 3.1], [...dhHd(DH_X + 80, 1092), 4.4], [...dhHd(DH_X, 954), 2.2]].forEach(([x, y, p]) =>
      twinkle(c, x - 4, y - 4, 22, Math.pow(Math.max(0, Math.sin(t * DH_LP + p)), 14) * .9));
  }
});

// the greeting, over everything (crisp, not painted), inside the safe band
POST.push((c, t) => {
  if (!DH_TEXT.title) return;
  text(c, DH_TEXT.tag, 540, 300, '600 22px Poppins', 'rgba(110,70,30,.8)', {});
  text(c, DH_TEXT.hi, 540, 444, '46px "Tiro Devanagari Sanskrit"', '#A8701E', { glow: ['rgba(255,244,220,.9)', 10] });
  text(c, DH_TEXT.title, 540, 522, '96px Marcellus', '#5A1810', { glow: ['rgba(255,244,220,.9)', 14], maxW: 820 });
  DH_TEXT.wish.forEach((ln, i) => text(c, ln, 540, 594 + i * 42, '500 31px Poppins', '#4A3022', { glow: ['rgba(255,244,220,.95)', 10], maxW: 800 }));
});
LOOK.bloom = .12; LOOK.vignette = .32; LOOK.grain = .04;
