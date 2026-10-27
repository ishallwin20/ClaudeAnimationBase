// hanuman_loop.js: "Ram hi paar lagavenge", a Painterly cinemagraph: Hanuman in meditation in a sunlit forest clearing.
// The painting is static; his tail sways, "राम" turns round him in rings, light breathes, dust and sparkles drift, and
// the two lines of the bhajan the owner picked sit over him, in time with the song (whisper: line 1 0–6.1 s, line 2
// 6.1–11.7 s, then humming). Everything that moves repeats exactly over DUR, so the reel loops without a seam.
// The forest, Hanuman, his tail and gada are the Painterly cast (src/pt_cast.js).
// ---------- the scene ----------
const LP = TAU / DUR;                         // one turn per loop: sin(n * LP * t) repeats exactly
const TAIL_N = 18, TAIL_CYCLE = DUR / 5;      // poses, seconds per sway (five sways a loop)
const LYRICS = [
  [0, 6.14, 'जल थल गगन मण्डल में राम', 'JAL THAL GAGAN MANDAL MEIN RAM'],
  [6.14, 12.3, 'राम ही पार लगावेंगे', 'RAM HI PAAR LAGAVENGE'],
];
// draw(t) and draw(t - DUR) crossfaded across the loop: anything that drifts comes back to where it started
const looped = (t, draw) => { const u = t / DUR; draw(t, 1 - u); draw(t - DUR, u); };

SHOTS.push({
  a: 0, b: DUR, draw(c, u, t) {
    const plate = ptLayer('forest', [0, 0, W, H], ptForest, { seed: 5 });
    ptDraw(c, plate);
    // god rays from the break in the canopy
    looped(t, (tt, k) => rays(c, PT_SUN[0] + 60, PT_SUN[1] - 520, { n: 14, dir: Math.PI / 2 + .12, spread: .9, len: 1700, w: 190, col: '#FFF6C4', a: (.16 + .05 * Math.sin(tt * 2 * LP)) * k, t: tt, seed: 3 }));
    // a warm glow behind him
    glow(c, PT_HX, 1000, 420, '#FFF3B0', .3 + .06 * Math.sin(t * 3 * LP), 'screen');
    // tail behind him: stepped through baked poses
    const k = Math.floor((t / TAIL_CYCLE) * TAIL_N) % TAIL_N;
    const tail = ptLayer('tail' + k, PT_TAIL_BOX, ptTail(k / TAIL_N), { alpha: true, seed: 9, brushes: PT_BRUSHES.slice(2) });
    ptDraw(c, tail);
    const gada = ptLayer('gada', [880, 930, 200, 560], ptGada, { alpha: true, seed: 13, brushes: PT_BRUSHES.slice(1) });
    ptDraw(c, gada);
    const hero = ptLayer('hanuman', [PT_HX - 420, 790, 840, 760], ptHanuman, {
      alpha: true, seed: 17, brushes: PT_BRUSHES.slice(1),
      fine: [[PT_HX, 1000, 75], [PT_HX - 300, 1440, 50], [PT_HX + 300, 1440, 50]], keep: [[PT_HX, 1005, 62, .55]],
    });
    ptDraw(c, hero);
    // rim light on him, breathing
    const rim = ptRim(hero, { dx: 0, dy: -5, col: '#FFF0A8', blur: 6, key: 'h' });
    ptDraw(c, rim, .5 + .15 * Math.sin(t * 3 * LP), 'screen');
    // "राम" in rings round him, turning a little one way and back
    [[190, 175, .7, 25], [255, 245, .62, 25], [320, 315, .52, 23], [385, 385, .42, 23]].forEach(([rx, ry, a, size], i) =>
      nameRing(c, PT_HX, PT_HY + 40, rx, ry, -Math.PI * 1.08, Math.PI * .08, 'राम', { size, a, rot: (i % 2 ? -1 : 1) * .09 * Math.sin(t * LP + i), ph: t * 6 * LP, seed: i * 3, shimmer: .5 }));
    // dust in the light, sparkles on his rim
    looped(t, (tt, k) => motes(c, { n: 70, seed: 4, box: [80, 300, 1000, 1500], r: 3.2, col: '#FFF6C8', a: .7 * k, vx: 6, vy: -10, t: tt }));
    rim.pts.forEach(([x, y], i) => {
      const rate = Math.max(1, Math.round((.35 + hash(i) * .4) * DUR)) / DUR, ph = frac(t * rate + hash(i + 9));
      twinkle(c, x, y, 9 + hash(i + 3) * 8, Math.pow(Math.max(0, Math.sin(ph * Math.PI)), 6) * .9);
    });
    // the bhajan's line over him, in Devanagari with the words in Roman letters under it
    for (const [a, b, top, bot] of LYRICS) {
      if (t < a || t > b) continue;
      const v = Math.min(a === 0 ? 1 : seg(t, a, a + .4), 1 - seg(t, b - .5, b));
      c.save(); c.globalAlpha = v * .5; c.translate(PT_HX, 1290); c.scale(1, .2); glow(c, 0, 0, 430, '#1E0E04', 1, 'source-over'); c.restore();   // a soft scrim so the words read over the garlands
      text(c, top, PT_HX, 1262, '46px "Tiro Devanagari Sanskrit"', '#FFFDF2', { alpha: v, glow: ['rgba(50,22,6,.85)', 18], maxW: 760 });
      text(c, bot, PT_HX, 1322, '600 24px Poppins', '#FFF0C8', { alpha: v, spacing: 4, glow: ['rgba(50,22,6,.85)', 12], maxW: 760 });
    }
  }
});
LOOK.bloom = .22; LOOK.vignette = .45; LOOK.grain = .045;
