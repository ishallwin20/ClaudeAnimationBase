// pt_demo.js: the Painterly style's demo (painterly.html): the cast in its forest clearing as a seamless 6 s
// cinemagraph. The painting is baked once; on top, the tail sways through 12 baked poses, "राम" turns round him in
// rings, the god rays, halo and rim light breathe, dust drifts and sparkles flicker on his rim.
const LP = TAU / DUR, TAIL_N = 12;
// draw(t) and draw(t - DUR) crossfaded across the loop: anything that drifts comes back to where it started
const looped = (t, draw) => { const u = t / DUR; draw(t, 1 - u); draw(t - DUR, u); };
SHOTS.push({
  a: 0, b: DUR, draw(c, u, t) {
    ptDraw(c, ptLayer('forest', [0, 0, W, H], ptForest, { seed: 5 }));
    looped(t, (tt, k) => rays(c, PT_SUN[0] + 60, PT_SUN[1] - 520, { n: 14, dir: Math.PI / 2 + .12, spread: .9, len: 1700, w: 190, col: '#FFF6C4', a: (.16 + .05 * Math.sin(tt * 2 * LP)) * k, t: tt, seed: 3 }));
    glow(c, PT_HX, 1000, 420, '#FFF3B0', .3 + .06 * Math.sin(t * 2 * LP), 'screen');
    const k = Math.floor(t / DUR * 2 * TAIL_N) % TAIL_N;   // two sways a loop
    ptDraw(c, ptLayer('tail' + k, PT_TAIL_BOX, ptTail(k / TAIL_N), { alpha: true, seed: 9, brushes: PT_BRUSHES.slice(2) }));
    ptDraw(c, ptLayer('gada', [880, 930, 200, 560], ptGada, { alpha: true, seed: 13, brushes: PT_BRUSHES.slice(1) }));
    const hero = ptLayer('hanuman', [PT_HX - 420, 790, 840, 760], ptHanuman, {
      alpha: true, seed: 17, brushes: PT_BRUSHES.slice(1),
      fine: [[PT_HX, 1000, 75], [PT_HX - 300, 1440, 50], [PT_HX + 300, 1440, 50]], keep: [[PT_HX, 1005, 62, .55]],
    });
    ptDraw(c, hero);
    const rim = ptRim(hero, { dx: 0, dy: -5, col: '#FFF0A8', blur: 6, key: 'h' });
    ptDraw(c, rim, .5 + .15 * Math.sin(t * 2 * LP), 'screen');
    [[190, 175, .7, 25], [255, 245, .62, 25], [320, 315, .52, 23], [385, 385, .42, 23]].forEach(([rx, ry, a, size], i) =>
      nameRing(c, PT_HX, PT_HY + 40, rx, ry, -Math.PI * 1.08, Math.PI * .08, 'राम', { size, a, rot: (i % 2 ? -1 : 1) * .06 * Math.sin(t * LP + i), ph: t * 4 * LP, seed: i * 3, shimmer: .5 }));
    looped(t, (tt, k) => motes(c, { n: 70, seed: 4, box: [80, 300, 1000, 1500], r: 3.2, col: '#FFF6C8', a: .7 * k, vx: 6, vy: -10, t: tt }));
    rim.pts.forEach(([x, y], i) => {
      const rate = Math.max(1, Math.round((.35 + hash(i) * .4) * DUR)) / DUR, ph = frac(t * rate + hash(i + 9));
      twinkle(c, x, y, 9 + hash(i + 3) * 8, Math.pow(Math.max(0, Math.sin(ph * Math.PI)), 6) * .9);
    });
  }
});
LOOK.bloom = .22; LOOK.vignette = .45; LOOK.grain = .045;
