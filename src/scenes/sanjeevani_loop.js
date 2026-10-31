// sanjeevani_loop.js: "Laye sajeevan", a Painterly cinemagraph: Hanuman flying at dusk above a sea of clouds with the
// Dronagiri peak on his raised palm. The paintings are static; clouds sail past (one or two full laps a loop, so the
// stream never jumps), his uttariya flutters and his tail sways through baked poses, he rises and falls a little on the
// wind, the herbs shine and twinkle and their light breathes, stars twinkle, dust drifts off the peak. Over it, the
// Hanuman Chalisa's line for this moment: लाय सजीवन लखन जियाये, श्रीरघुबीर हरषि उर लाये. No music: the owner adds it.
// Everything that moves repeats exactly over DUR, so the reel loops without a seam. Designs: sanjeevani_cast.js.
const LP = TAU / DUR;                            // one turn per loop: sin(n * LP * t) repeats exactly
const TAIL_N = 16, TAIL_CYCLE = DUR / 6;         // poses, seconds per sway (six a loop)
const SCARF_N = 10, SCARF_CYCLE = DUR / 18;      // poses, seconds per flutter (eighteen a loop)
const LINES = ['लाय सजीवन लखन जियाये', 'श्रीरघुबीर हरषि उर लाये'];
// draw(t) and draw(t - DUR) crossfaded across the loop: anything that drifts comes back to where it started
const looped = (t, draw) => { const u = t / DUR; draw(t, 1 - u); draw(t - DUR, u); };

// clouds sailing left: each lane is a ring of sprites that moves `laps` whole ring lengths a loop
const LANES = [
  { ids: [4, 5, 6], y: [560, 760, 980], gap: 520, laps: 1, a: .55, scale: 1 },               // thin wisps high behind him
  { ids: [0, 1, 2, 3, 1], y: [1236, 1262, 1244, 1270, 1250], gap: 120, laps: 1, a: 1, scale: 1 },   // tops of the cloud sea behind him
  { ids: [2, 0, 3], y: [1640, 1700, 1660], gap: 260, laps: 2, a: 1, scale: 1.5 },            // big ones near, below the words
];
function lane(c, t, L) {
  const ws = L.ids.map(i => SJ_CLOUD[i][0] * L.scale), ring = ws.reduce((s, w) => s + w + L.gap, 0), span = Math.max(ring, W + Math.max(...ws) + L.gap);
  let x = 0;
  L.ids.forEach((id, k) => {
    const [w, h] = SJ_CLOUD[id], S = L.scale, X = ((x - L.laps * span * t / DUR) % span + span) % span - ws[k];
    x += ws[k] + L.gap;
    if (X > W) return;
    const cl = ptLayer('cloud' + id, [0, 0, w, h], sjCloud(id), { alpha: true, seed: 60 + id, brushes: PT_BRUSHES.slice(1), rough: 2.5 });
    c.save(); c.translate(X, L.y[k] - h * S * .6); c.scale(S, S); ptDraw(c, cl, L.a); c.restore();
  });
}

const STARS = Array.from({ length: 70 }, (_, i) => [hash(i * 3.1) * W, 60 + Math.pow(hash(i * 7.7), 1.4) * 820, .5 + hash(i * 1.3)]);

SHOTS.push({
  a: 0, b: DUR, draw(c, u, t) {
    ptDraw(c, ptLayer('sky', [0, 0, W, H], sjSky, { seed: 5 }));
    // stars, each twinkling a whole number of times a loop
    STARS.forEach(([x, y, s], i) => {
      if (Math.hypot(x - SJ_MOON[0], y - SJ_MOON[1]) < 150) return;
      const n = 2 + (hash(i + 5) * 5 | 0), k = .5 + .5 * Math.sin(t * n * LP + i * 2.4);
      twinkle(c, x, y, 5 + s * 6, (.25 + .6 * Math.pow(k, 3)) * clamp(1 - y / 950), '#F4F0FF');
    });
    glow(c, SJ_MOON[0], SJ_MOON[1], 260, '#D8D2FF', .16 + .04 * Math.sin(t * 2 * LP), 'screen');
    lane(c, t, LANES[0]);
    lane(c, t, LANES[1]);

    // he rises and falls a little on the wind; everything of his moves together
    const bob = 7 * Math.sin(t * 3 * LP), sway = 3 * Math.sin(t * 3 * LP - 1.2);
    c.save(); c.translate(sway, bob);
    const [mx, my] = sjM(-10, -150);
    glow(c, mx, my, 520, '#F2FFB0', .2 + .05 * Math.sin(t * 5 * LP), 'screen');   // the herbs' light round him
    const kt = Math.floor(t / TAIL_CYCLE * TAIL_N) % TAIL_N;
    ptDraw(c, ptLayer('tail' + kt, SJ_TAIL_BOX, sjTail(kt / TAIL_N), { alpha: true, seed: 9, brushes: PT_BRUSHES.slice(2) }));
    const ks = Math.floor(t / SCARF_CYCLE * SCARF_N) % SCARF_N;
    ptDraw(c, ptLayer('scarf' + ks, SJ_SCARF_BOX, sjScarf(ks / SCARF_N), { alpha: true, seed: 11, brushes: PT_BRUSHES.slice(2) }));
    const gada = ptLayer('gada', SJ_GADA_BOX, sjGada, { alpha: true, seed: 13, brushes: PT_BRUSHES.slice(1) });
    ptDraw(c, gada);
    const [fx, fy] = sjW(...SJ_FACE);
    const hero = ptLayer('hanuman', [150, 430, 740, 980], sjHanuman, {
      alpha: true, seed: 17, brushes: PT_BRUSHES.slice(1),
      fine: [[fx, fy - 10, 92], [...sjW(-302, -352), 40], [...sjW(288, 168), 40]], keep: [[fx, fy + 4, 70, .55]],
    });
    ptDraw(c, hero);
    const mtn = ptLayer('mountain', [70, 200, 480, 480], sjMountain, { alpha: true, seed: 19, brushes: PT_BRUSHES.slice(1), fine: [[...sjM(0, 0), 60]] });
    ptDraw(c, mtn);
    // rim light: gold from the herbs above left, lavender from the moon on the right
    const rim = ptRim(hero, { dx: -4, dy: -5, col: '#FFF0A8', blur: 6, key: 'h' });
    ptDraw(c, rim, .5 + .15 * Math.sin(t * 5 * LP), 'screen');
    ptDraw(c, ptRim(hero, { dx: 5, dy: -2, col: '#C9C2FF', blur: 5, key: 'm', seed: 4, density: 0 }), .35, 'screen');
    ptDraw(c, ptRim(gada, { dx: -4, dy: -5, col: '#FFF0A8', blur: 5, key: 'g', density: 0 }), .45, 'screen');
    // the herbs shine: each breathes and twinkles a whole number of times a loop
    SJ_HERBS.forEach(([hx, hy, r], i) => {
      const [x, y] = sjM(hx, hy), n = 2 + (hash(i + 1) * 4 | 0), k = .5 + .5 * Math.sin(t * n * LP + i * 1.7);
      glow(c, x, y, r * 3.6, '#EEFFA0', .35 + .3 * k, 'screen');
      twinkle(c, x, y - r * .3, r * (1.2 + k), Math.pow(k, 4) * .95, '#FFFFE0');
    });
    // motes of light rising off the peak and blown back
    looped(t, (tt, k) => motes(c, { n: 34, seed: 8, box: [40, 160, 560, 700], r: 3, col: '#F0FFB0', a: .8 * k, vx: -14, vy: -16, t: tt }));
    // sparkles on his rim
    rim.pts.forEach(([x, y], i) => {
      const rate = Math.max(1, Math.round((.35 + hash(i) * .4) * DUR)) / DUR, ph = frac(t * rate + hash(i + 9));
      twinkle(c, x, y, 8 + hash(i + 3) * 7, Math.pow(Math.max(0, Math.sin(ph * Math.PI)), 6) * .85);
    });
    c.restore();

    lane(c, t, LANES[2]);
    looped(t, (tt, k) => motes(c, { n: 40, seed: 4, box: [0, 300, W, 1500], r: 2.6, col: '#FFE9C8', a: .5 * k, vx: -40, vy: -4, t: tt }));
    // the Chalisa's line, over the clouds, inside the safe band
    c.save(); c.globalAlpha = .5; c.translate(540, 1428); c.scale(1, .24); glow(c, 0, 0, 470, '#1A0F2E', 1, 'source-over'); c.restore();
    LINES.forEach((ln, i) => text(c, ln, 540, 1392 + i * 70, '54px "Tiro Devanagari Sanskrit"', '#FFF6DE', { glow: ['rgba(30,14,40,.9)', 18], maxW: 900 }));
  }
});
LOOK.bloom = .24; LOOK.vignette = .5; LOOK.grain = .045;
