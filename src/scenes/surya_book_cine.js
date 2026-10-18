// surya_book_cine.js: Surya book pp. 10–11 ("the fruit in the sky") in the Cinematic engine's daylight look, as a sample
// next to the Painted spread. Slot 5 is the spread (t = 5.5); slot 0 is a character sheet for checking the rigs.
// Drawn in the book's design space (DW × DH = half the 300 dpi canvas, under scale 2): 1 mm ≈ 5.9 units, the trim 3 mm
// in, the fold at x = DW / 2. The words are set over it by tools/book.mjs from books/surya/book.js (variant 'cine').
(() => {
  const DW = W / 2, DH = H / 2, MM = DW / 286, K = W / DW;
  const X = (mm, side = 'L') => (3 + (side === 'R' ? 140 : 0) + mm) * MM, Y = mm => (3 + mm) * MM;
  Object.assign(LOOK, { bloom: .12, vignette: 0, grain: .025 });
  const at = (c, x, y, s, rot, f) => { c.save(); c.translate(x, y); c.scale(s, s); if (rot) c.rotate(rot); f(c); c.restore(); };
  // a figure in design space: figure() works in screen pixels, so its light widths scale with K
  const fig = (c, f, L) => figure(c, f, L);

  function sheet(c, u, t) {
    c.save(); c.scale(K, K);
    sky(c, [[0, '#BFDDF2'], [DH, '#FCE8C8']]);
    at(c, 260, 760, 1.15, 0, (f) => fig(f, (g) => kidHanuman(g, { pose: 'sit', mouth: 'smile', t }), KLIGHT(6, -5)));
    at(c, 640, 620, .95, .9, (f) => fig(f, (g) => kidHanuman(g, { pose: 'leap', mouth: 'aah', look: [.6, -.5], t }), KLIGHT(6, -5)));
    at(c, 980, 700, .95, 2.5, (f) => fig(f, (g) => kidHanuman(g, { pose: 'tumble', mouth: 'wail', eyes: 'dizzy', jaw: 1, t }), KLIGHT(6, -5)));
    at(c, 1250, 1240, .62, 0, (f) => { fig(f, (g) => airavataK(g, { t }), KLIGHT(5, -6)); const [sx, sy] = airavataSeat(); at(f, sx, sy + 480 * .62, .62, 0, (h) => fig(h, (g) => indraK(g, { t, vajra: false }), KLIGHT(5, -6))); });
    c.restore();
  }

  function spread(c, u, t) {
    c.save(); c.scale(K, K);
    // ---- the morning sky: blue overhead, gold and peach toward the horizon; the red-gold sun on the right page
    sky(c, [[0, '#76AEE0'], [380, '#A6CDEA'], [760, '#F3DDB8'], [1000, '#F8C48E'], [DH, '#F6B47C']]);
    const sx = X(106, 'R'), sy = Y(66), sr = 160;
    soft(c, 4, (s) => { glow(s, sx, sy, 900, '#FFD27A', .7); glow(s, sx, sy, 420, '#FFE6A8', .8); });
    rays(c, sx, sy, { n: 26, dir: Math.PI * .75, spread: Math.PI * 1.9, len: 1300, w: 160, col: '#FFE8B0', a: .2, t: 0, seed: 3 });
    // far mountains in haze
    ridge(c, 1000, 130, 4, '#BBA9CB', { freq: .0024 });
    haze(c, 1000, 130, '#F8D8B8', .55);
    ridge(c, 1070, 100, 9, '#A895BA', { freq: .003 });
    haze(c, 1080, 100, '#F6CFA8', .5);
    // far clouds
    [[X(26), Y(66), 380, 2], [X(122), Y(112), 330, 5], [X(28, 'R'), Y(60), 340, 8], [X(58, 'R'), Y(132), 420, 11]].forEach(([x, y, w, sd]) => puff(c, x, y, w, sd, { a: .92 }));
    // ---- the sun: a hot disc with Surya's face in it, kind, watching the child
    glow(c, sx, sy, 280, '#FFB24A', .8);
    const DISC = circ(sx, sy, sr);
    inside(c, DISC, () => {
      const g = c.createRadialGradient(sx - 20, sy - 30, 10, sx, sy, sr); g.addColorStop(0, '#FFF6D0'); g.addColorStop(.55, '#FFD06A'); g.addColorStop(1, '#F59A3A');
      c.fillStyle = g; c.fillRect(sx - sr, sy - sr, 2 * sr, 2 * sr);
      at(c, sx, sy + 862 * .7, .7, 0, (f) => figure(f, (g2) => suryaHead(g2, { t, look: [-.8, .35] }), { tint: ['#FF9A30', .18], edge: { col: '#FFF0C0', w: 2.4, a: .5 } }));
      glow(c, sx, sy + 40, sr * 1.2, '#FFF2C0', .3);
      const fade = c.createLinearGradient(0, sy + sr * .35, 0, sy + sr); fade.addColorStop(0, rgba('#FFD06A', 0)); fade.addColorStop(1, rgba('#FFC060', 1)); c.fillStyle = fade; c.fillRect(sx - sr, sy, 2 * sr, sr);
    });
    strokePath(c, DISC, rgba('#FFF4D0', .9), 6);
    // ---- the forest below the left page, the tree he leapt from
    ridge(c, 1150, 50, 14, '#6FA05A', { freq: .004, x1: DW * .64 });
    ridge(c, 1200, 40, 15, '#5E9450', { freq: .005, x1: DW * .6 });
    [[X(36), 1215, 92, 3], [X(70), 1200, 80, 4], [X(104), 1222, 96, 6], [X(134), 1240, 84, 9], [X(150), 1280, 70, 10], [X(4), 1260, 100, 12], [X(56), 1290, 110, 13], [X(118), 1300, 110, 16]].forEach(([x, y, r, sd]) => leafCrown(c, x, y, r, sd, { cols: ['#2E6A34', '#4A8C40', '#7DB850', '#B2DA70'] }));
    leafTree(c, X(10), 1420, 900, 21, { lean: 60, cols: ['#2A6232', '#468A3E', '#7CBA50', '#BCE07A'] });
    // flowers in the near bushes
    for (let i = 0; i < 12; i++) { const x = X(30 + i * 9.5), y = 1290 + (i % 3) * 14; for (let k = 0; k < 5; k++) { const a = k / 5 * TAU; ellipse(c, x + Math.cos(a) * 7, y + Math.sin(a) * 7, 6, 6, ['#FFF6EA', '#F7A8C0', '#FFD45A'][i % 3]); } ellipse(c, x, y, 4, 4, '#F07A22'); }
    // birds startled off the treetops
    [[X(78), Y(156), 14], [X(88), Y(148), 11], [X(98), Y(158), 12]].forEach(([x, y, s2]) => strokePath(c, `M ${x - s2} ${y - s2 * .4} Q ${x - s2 * .4} ${y - s2 * .6} ${x} ${y} Q ${x + s2 * .4} ${y - s2 * .6} ${x + s2} ${y - s2 * .4}`, '#4A3A40', 3));
    // ---- the right page: Airavata and Indra in the cloud bank
    puff(c, X(86, 'R'), 1120, 860, 17, { a: .95 });
    const ax = X(100, 'R'), ay = 1200, as = .5;
    at(c, ax, ay, as, 0, (f) => {
      fig(f, (g) => airavataK(g, { t, trunk: 1 }), KLIGHT(4, -6));
      const [px, py] = airavataSeat(); at(f, px, py + 480 * .6, .6, 0, (h) => fig(h, (g) => indraK(g, { t, look: [-.9, .2], vajra: false }), KLIGHT(4, -6)));
    });
    [[X(40, 'R'), 1300, 560, 23], [X(116, 'R'), 1200, 520, 33], [X(110, 'R'), 1290, 600, 19], [X(76, 'R'), 1350, 760, 29], [X(4, 'R'), 1350, 520, 31]].forEach(([x, y, w, sd]) => puff(c, x, y, w, sd));
    // the vajra that bumped him, its trail back to Indra
    const vx = X(44, 'R'), vy = Y(100);
    strokePath(c, `M ${vx + 30} ${vy + 20} Q ${vx + 160} ${vy + 120} ${X(104, 'R')} ${Y(118)}`, rgba('#FFF6D8', .55), 12);
    glow(c, vx, vy, 100, '#FFE08A', .6);
    vajraK(c, vx, vy, .55, -.9);
    // ---- baby Hanuman, leaping for the sun (left page)
    at(c, X(80), Y(110), .8, .82, (f) => fig(f, (g) => kidHanuman(g, { pose: 'leap', mouth: 'aah', look: [.7, -.4], t }), KLIGHT(6, -4)));
    // ---- and tumbling down, dizzy, his chin swollen, wrapped in Surya's gift of light (right page)
    const hx = X(22, 'R'), hy = Y(112);
    glow(c, hx, hy, 190, '#FFE6A0', .75);
    at(c, hx + 6, hy - 6, .64, 2.55, (f) => fig(f, (g) => kidHanuman(g, { pose: 'tumble', mouth: 'wail', eyes: 'dizzy', jaw: 1, t }), KLIGHT(-4, 5)));
    for (let i = 0; i < 9; i++) { const a = i / 9 * TAU + .3, r = 130 + (i % 3) * 18, x = hx + Math.cos(a) * r, y = hy + Math.sin(a) * r * .85, s2 = 9 + (i % 3) * 4;
      glow(c, x, y, s2 * 3, '#FFE6A0', .6); fillPath(c, `M ${x} ${y - s2} L ${x + s2 * .3} ${y - s2 * .3} L ${x + s2} ${y} L ${x + s2 * .3} ${y + s2 * .3} L ${x} ${y + s2} L ${x - s2 * .3} ${y + s2 * .3} L ${x - s2} ${y} L ${x - s2 * .3} ${y - s2 * .3} Z`, '#FFF2B8'); }
    c.restore();
  }

  SHOTS.push({ a: 0, b: 1, draw: sheet });
  SHOTS.push({ a: 5, b: 6, draw: spread });
})();
