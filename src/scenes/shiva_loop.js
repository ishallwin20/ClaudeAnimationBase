// shiva_loop.js: "Karpur Gauram", a Painterly cinemagraph: Shiva in meditation on a rock ledge below Kailash at night,
// white as camphor, his throat blue. The paintings are static; Vasuki sways his hood and flicks his tongue, the Ganga
// runs from his jata, the dhuni's flames flicker (stepped poses, like hand animation) and throw sparks, the damru's red
// cloth stirs, his halo, the crescent and the closed third eye breathe, ॐ नमः शिवाय turns round him in rings, stars
// twinkle. Over it, the verse sung after every aarti: कर्पूरगौरं करुणावतारं, संसारसारं भुजगेन्द्रहारम्. No music: the owner adds it.
// Everything that moves repeats exactly over DUR, so the reel loops without a seam. Designs: shiva_cast.js.
const LP = TAU / DUR;                                 // one turn per loop: sin(n * LP * t) repeats exactly
const SNAKE_N = 12, SNAKE_SWAYS = 3;                  // hood poses, sways a loop
const CLOTH_N = 10, CLOTH_FLUT = 10;                  // cloth poses, flutters a loop
const FIRE_N = 12, FIRE_FPS = 8;                      // flame poses, steps a second (a loop is a whole number of steps)
const FIRE_SEQ = Array.from({ length: DUR * FIRE_FPS }, (_, i) => (i * 5 + (hash(i * 1.7) * 3 | 0)) % FIRE_N);   // never the same pose twice running
const LINES = ['कर्पूरगौरं करुणावतारं', 'संसारसारं भुजगेन्द्रहारम्'];
// draw(t) and draw(t - DUR) crossfaded across the loop: anything that drifts comes back to where it started
const looped = (t, draw) => { const u = t / DUR; draw(t, 1 - u); draw(t - DUR, u); };

// the Ganga's path from the top of his knot, up and over to the right, falling away into spray
const GANGA = [SVhd(546, 776), [556, 716], [590, 696], [640, 700], [684, 732], [712, 790], [730, 870]].map(([x, y]) => SVH(x, y));
function ganga(c, t, k = 1) {
  const C = through(GANGA, 10), n = C.length;
  c.save(); c.globalAlpha = .4 * k; limb(c, GANGA, [10, 14, 18, 20, 24, 30, 40], 'rgba(150,190,250,.5)'); c.globalAlpha = .55 * k; limb(c, GANGA, [5, 7, 8, 9, 10, 10, 8], 'rgba(220,238,255,.6)'); c.restore();
  // the water running: bright beads travelling along it, a whole number of runs a loop
  for (let i = 0; i < 26; i++) {
    const s = frac(i / 26 + t * 6 / DUR), p = s * (n - 1), j = Math.min(n - 2, p | 0), f = p - j;
    const x = lerp(C[j][0], C[j + 1][0], f), y = lerp(C[j][1], C[j + 1][1], f);
    glow(c, x, y, 7 + s * 6, '#E6F4FF', (.55 + .3 * hash(i)) * Math.sin(s * Math.PI) ** .5 * k, 'lighter');
  }
  // spray falling off the end and fading
  const [ex, ey] = GANGA[GANGA.length - 1];
  for (let i = 0; i < 18; i++) {
    const s = frac(hash(i + 2) + t * (3 + (i % 3)) / DUR), x = ex + (hash(i + 7) - .3) * 40 + s * 24, y = ey + s * s * 140;
    glow(c, x, y, 5 + hash(i) * 4, '#DDEEFF', .6 * (1 - s) * k, 'lighter');
  }
  glow(c, ...GANGA[0], 26, '#CFE6FF', .5 * k, 'lighter');
}

// stars: only in the open sky (not over Kailash or the ranges)
const inSky = (x, y) => y < 880 && !(y > 560 && Math.abs(x - 800) < (y - 560) * .6 + 50) && !(x < 480 && y > 850);
const STARS = Array.from({ length: 140 }, (_, i) => [hash(i * 3.1) * W, 30 + Math.pow(hash(i * 7.7), 1.2) * 820, .4 + hash(i * 1.3)]).filter(([x, y]) => inSky(x, y));

function shivaScene(c, t, wake = 1) {
  const e = easeOut(wake);
  ptDraw(c, ptLayer('night', [0, 0, W, H], svNight, { seed: 5 }));
  STARS.forEach(([x, y, s], i) => {
    const n = 2 + (hash(i + 5) * 5 | 0), k = .5 + .5 * Math.sin(t * n * LP + i * 2.4);
    twinkle(c, x, y, 4 + s * 6, (.2 + .6 * Math.pow(k, 3)) * (.6 + .4 * s), '#EEF0FF');
  });
  // his halo: moonlight behind his head, a soft disc and a thin ring, breathing
  const [hx, hy] = [SV_FACE[0], SV_FACE[1] - 40], br = .5 + .5 * Math.sin(t * 2 * LP);
  glow(c, hx, hy, 640, '#7FA2E6', (.28 + .06 * br) * lerp(.4, 1, e), 'screen');
  glow(c, hx, hy, 260, '#E4EEFF', (.32 + .08 * br) * lerp(.3, 1, e), 'screen');
  c.save(); c.globalCompositeOperation = 'screen'; c.strokeStyle = `rgba(220,232,255,${(.22 + .08 * br) * e})`; c.lineWidth = 3; c.shadowColor = 'rgba(200,220,255,.9)'; c.shadowBlur = 18;
  c.beginPath(); c.arc(hx, hy, 236, 0, TAU); c.stroke(); c.restore();

  const kc = Math.floor(t / DUR * CLOTH_FLUT * CLOTH_N) % CLOTH_N;
  ptDraw(c, ptLayer('trishul' + kc, SV_TRI_BOX, svTrishul(kc / CLOTH_N), { alpha: true, seed: 23, brushes: PT_BRUSHES.slice(2) }));
  const hero = ptLayer('shiva', SV_BOX, (c2) => { svPlace(c2); svShiva(c2); }, { alpha: true, seed: 17, brushes: PT_BRUSHES.slice(1), fine: SV_FINE, keep: SV_KEEP });
  ptDraw(c, hero);
  // rim light: cool from the halo above and behind; warm from the fire at his left, flickering with it
  const fl = .5 + .25 * Math.sin(t * 23 * LP) + .15 * Math.sin(t * 37 * LP + 1) + .1 * Math.sin(t * 61 * LP + 2);
  const rim = ptRim(hero, { dx: 0, dy: -5, col: '#E6F0FF', blur: 6, key: 'h' });
  ptDraw(c, rim, (.5 + .15 * br) * lerp(.2, 1, e), 'screen');
  ptDraw(c, ptRim(hero, { dx: 6, dy: 2, col: '#FFB066', blur: 7, key: 'f', seed: 4, density: 0 }), .3 + .25 * fl, 'screen');
  // Vasuki: the hood sways; now and then the tongue flicks
  const ph = frac(t / DUR * SNAKE_SWAYS), ks = Math.floor(ph * SNAKE_N) % SNAKE_N;
  ptDraw(c, ptLayer('vasuki' + ks, SV_SNAKE_BOX, svVasuki(ks / SNAKE_N), { alpha: true, seed: 29, brushes: PT_BRUSHES.slice(2), fine: [[...SVH(394, 880), 44]] }));
  const fq = frac(t / DUR * 5), fk = fq < .1 ? Math.sin(fq / .1 * Math.PI) : 0;
  if (fk > 0) {
    const [mx, my] = SV_HOOD(ks / SNAKE_N), L = 26 * fk, wig = Math.sin(t * 90) * 3;
    c.save(); c.strokeStyle = '#C8202A'; c.lineCap = 'round'; c.lineWidth = 2.6;
    c.beginPath(); c.moveTo(mx, my); c.quadraticCurveTo(mx + wig, my + L * .6, mx, my + L); c.stroke();
    c.lineWidth = 1.8; c.beginPath(); c.moveTo(mx, my + L); c.lineTo(mx - 5, my + L + 7 * fk); c.moveTo(mx, my + L); c.lineTo(mx + 5, my + L + 7 * fk); c.stroke(); c.restore();
  }
  // the Ganga, the crescent's glow, the third eye breathing
  ganga(c, t, e);
  glow(c, ...SV_MOON, 46, '#FFF6D8', (.35 + .12 * Math.sin(t * 3 * LP)) * e, 'lighter');
  glow(c, ...SV_THIRD, 16, '#FF9A6A', (.25 + .2 * Math.pow(.5 + .5 * Math.sin(t * 2 * LP - 1), 2)) * e, 'lighter');
  // the dhuni: stepped flames, the glow round them, sparks and a thread of smoke
  const kf = FIRE_SEQ[Math.floor(t * FIRE_FPS) % FIRE_SEQ.length];
  glow(c, SV_FIRE[0], SV_FIRE[1] - 50, 300, '#FF8A3A', .32 + .12 * fl, 'lighter');
  ptDraw(c, ptLayer('fire' + kf, SV_FIRE_BOX, svFire(kf / FIRE_N), { alpha: true, seed: 31 + kf, brushes: PT_BRUSHES.slice(2), rough: 2 }));
  glow(c, SV_FIRE[0], SV_FIRE[1] - 40, 120, '#FFD27A', .25 + .15 * fl, 'lighter');
  looped(t, (tt, k) => motes(c, { n: 26, seed: 6, box: [SV_FIRE[0] - 90, SV_FIRE[1] - 520, SV_FIRE[0] + 90, SV_FIRE[1] - 60], r: 2.6, col: '#FFB45A', a: .9 * k, vx: -6, vy: -70, t: tt }));
  // ॐ नमः शिवाय, round him in rings that open on wake
  [[250, 235, .55, 25], [326, 312, .4, 24]].forEach(([rx, ry, a, size], i) => {
    const ki = easeOut(wake >= 1 ? 1 : seg(wake, i * .15, .55 + i * .15)), s = lerp(.55, 1, ki);
    nameRing(c, SV_FACE[0], SV_FACE[1] + 33, rx * s, ry * s, -Math.PI * 1.08, Math.PI * .08, 'ॐ नमः शिवाय', { size, a: a * ki, gap: 40, rot: (i % 2 ? -1 : 1) * .05 * Math.sin(t * LP + i), ph: t * 4 * LP, seed: i * 3, shimmer: .45, glow: 'rgba(200,220,255,.85)', col: '#F4F8FF' });
  });
  // motes of light in the cold air, and sparkles on his rim
  looped(t, (tt, k) => motes(c, { n: 50, seed: 4, box: [60, 300, 1020, 1500], r: 2.6, col: '#DDE8FF', a: .55 * k, vx: 5, vy: -8, t: tt }));
  rim.pts.forEach(([x, y], i) => {
    const rate = Math.max(1, Math.round((.35 + hash(i) * .4) * DUR)) / DUR, q = frac(t * rate + hash(i + 9));
    twinkle(c, x, y, 8 + hash(i + 3) * 7, Math.pow(Math.max(0, Math.sin(q * Math.PI)), 6) * .8 * e, '#F2F6FF');
  });
}

SHOTS.push({
  a: 0, b: DUR, draw(c, u, t) {
    shivaScene(c, t);
    // the verse, in the night sky above him (inside the safe band)
    LINES.forEach((ln, i) => text(c, ln, 540, 450 + i * 60, '46px "Tiro Devanagari Sanskrit"', '#FFF4DC', { glow: ['rgba(6,8,24,.95)', 18], maxW: 860 }));
  }
});
LOOK.bloom = .24; LOOK.vignette = .5; LOOK.grain = .045;
