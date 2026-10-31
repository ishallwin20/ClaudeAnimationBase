// wall_pt.js: Painterly live wallpapers (studio_wall_pt.html) at 1290×2796, drawn in the 1080×2340 design space and
// painted at full resolution (PT.k = W / 1080), seamless 6 s loops. wallP(name, fn(c, t, k)) registers <name> (the loop,
// frame 0 the still), <name>_wake (the iPhone's 2 s: k rises 0 → 1 over 1.5 s while the loop plays its last 1.5 s,
// landing on the still) and <name>_lock (a mock lock screen).
const WL = 6, DW = 1080, DH = 2340, KS = W / DW, WAKE = 1.5, LPW = TAU / WL;
PT.k = KS;
const lmod = t => ((t % WL) + WL) % WL;
let LOCK = false;
function lockScreen(c) {
  c.save(); c.setTransform(KS, 0, 0, KS, 0, 0); c.fillStyle = 'rgba(255,255,255,.92)'; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.font = '500 46px Poppins'; c.fillText('Monday, 26 October', DW / 2, 255); c.font = '700 250px Poppins'; c.fillText('9:41', DW / 2, 450);
  c.fillStyle = 'rgba(30,30,40,.5)'; for (const x of [150, 930]) { c.beginPath(); c.arc(x, 2175, 62, 0, TAU); c.fill(); }
  c.fillStyle = 'rgba(255,255,255,.8)'; c.fillRect(DW / 2 - 140, 2282, 280, 12); c.restore();
}
function wallP(name, look, fn, len = WL) {   // len: the loop's length (6 s unless a pack needs longer)
  const m = t => ((t % len) + len) % len;
  const at = (c, t, k) => { T = m(t); Object.assign(LOOK, look); c.setTransform(KS, 0, 0, KS, 0, 0); fn(c, m(t), k); };
  LOOPS[name] = (c, t) => at(c, t, 1); LOOPS[name + '_wake'] = (c, t) => at(c, t - WAKE, clamp(t / WAKE)); LOOPS[name + '_lock'] = (c, t) => { at(c, t, 1); c.__lock = 1; };
  LOOPS[name].len = LOOPS[name + '_lock'].len = len; LOOPS[name + '_wake'].len = 2;
}
SHOTS.push({ a: 0, b: 1e9, draw(c, u, t) { const q = new URLSearchParams(location.search).get('loop'), L = window.LOOP || LOOPS[q] || Object.values(LOOPS)[0]; c.__lock = 0; L(c, t); LOCK = !!c.__lock; } });
POST.push(c => { if (LOCK) lockScreen(c); });
// draw(t) and draw(t - WL) crossfaded across the loop: anything that drifts comes back to where it started
const loopedW = (t, draw) => { const u = t / WL; draw(t, 1 - u); draw(t - WL, u); };

// ---------- Hanuman in meditation ("Ram hi paar lagavenge", the reel on reel/hanuman-ram-loop) ----------
// The reel's scene moved down 420 px, the forest grown up to the top so the clock sits over the canopy. Tail: two
// sways a loop through 12 poses. wake: the राम rings bloom open from his head, the halo, rays and rim light rise.
const DY = 420, TAIL_N = 12;
wallP('pt_hanuman', { bloom: .22, vignette: .45, grain: .045 }, (c, t, k) => {
  const e = easeOut(k);
  c.translate(0, DY);
  ptDraw(c, ptLayer('forest', [0, -DY, DW, DH], c2 => ptForest(c2, -DY), { seed: 5 }));
  loopedW(t, (tt, w) => rays(c, PT_SUN[0] + 60, PT_SUN[1] - 520, { n: 14, dir: Math.PI / 2 + .12, spread: .9, len: 1900, w: 190, col: '#FFF6C4', a: (.16 + .05 * Math.sin(tt * 2 * LPW)) * w * lerp(.35, 1, e), t: tt, seed: 3 }));
  glow(c, PT_HX, 1000, 420, '#FFF3B0', (.3 + .06 * Math.sin(t * 2 * LPW)) * lerp(.45, 1, e), 'screen');
  const p = Math.floor(t / WL * 2 * TAIL_N) % TAIL_N;
  ptDraw(c, ptLayer('tail' + p, PT_TAIL_BOX, ptTail(p / TAIL_N), { alpha: true, seed: 9, brushes: PT_BRUSHES.slice(2) }));
  ptDraw(c, ptLayer('gada', [880, 930, 200, 560], ptGada, { alpha: true, seed: 13, brushes: PT_BRUSHES.slice(1) }));
  const hero = ptLayer('hanuman', [PT_HX - 420, 790, 840, 760], ptHanuman, {
    alpha: true, seed: 17, brushes: PT_BRUSHES.slice(1),
    fine: [[PT_HX, 1000, 75], [PT_HX - 300, 1440, 50], [PT_HX + 300, 1440, 50]], keep: [[PT_HX, 1005, 62, .55]],
  });
  ptDraw(c, hero);
  const rim = ptRim(hero, { dx: 0, dy: -5, col: '#FFF0A8', blur: 6, key: 'h' });
  ptDraw(c, rim, (.5 + .15 * Math.sin(t * 2 * LPW)) * lerp(.2, 1, e), 'screen');
  // the rings open out from his head in turn on wake
  [[190, 175, .7, 25], [255, 245, .62, 25], [320, 315, .52, 23], [385, 385, .42, 23], [450, 455, .32, 22]].forEach(([rx, ry, a, size], i) => {
    const ki = easeOut(k >= 1 ? 1 : seg(k, i * .12, .5 + i * .12)), s = lerp(.55, 1, ki);
    nameRing(c, PT_HX, PT_HY + 40, rx * s, ry * s, -Math.PI * 1.08, Math.PI * .08, 'राम', { size, a: a * ki, rot: (i % 2 ? -1 : 1) * .06 * Math.sin(t * LPW + i), ph: t * 4 * LPW, seed: i * 3, shimmer: .5 });
  });
  loopedW(t, (tt, w) => motes(c, { n: 90, seed: 4, box: [60, -300, 1020, 1600], r: 3.4, col: '#FFF6C8', a: .7 * w, vx: 6, vy: -10, t: tt }));
  rim.pts.forEach(([x, y], i) => {
    const rate = Math.max(1, Math.round((.35 + hash(i) * .4) * WL)) / WL, ph = frac(t * rate + hash(i + 9));
    twinkle(c, x, y, 9 + hash(i + 3) * 8, Math.pow(Math.max(0, Math.sin(ph * Math.PI)), 6) * .9 * e);
  });
});

// ---------- Hanuman carrying the Sanjeevani peak ("Laye sajeevan", the reel on reel/hanuman-sanjeevani-loop) ----------
// The reel's scene moved down 320 px, the dusk sky grown up behind the clock and the cloud sea down to the bottom. A 12 s
// loop (clouds sailing past at a calm pace need it; Android plays it once). wake: the herbs on the peak light up one
// after another, their light spreads round him, his rim light and sparkles rise.
const SJL = 12, SJLP = TAU / SJL, SJDY = 320;
const SJ_LANES = [
  { ids: [4, 6], y: [600, 940], gap: 300, a: .55, scale: 1 },           // thin wisps behind him
  { ids: [0, 1], y: [1250, 1272], gap: 60, a: 1, scale: 1 },            // the tops of the cloud sea behind him
  { ids: [2, 0], y: [1770, 1930], gap: 200, a: 1, scale: 1.5 },         // big ones near, at the bottom
];
// a lane: its clouds in a ring that moves one ring length a loop, tiled across the frame
function sjLaneW(c, t, L) {
  const ws = L.ids.map(i => SJ_CLOUD[i][0] * L.scale), ring = ws.reduce((s, w) => s + w + L.gap, 0), shift = ring * t / SJL;
  let x = 0;
  L.ids.forEach((id, k) => {
    const [w, h] = SJ_CLOUD[id], cl = ptLayer('sj_cloud' + id, [0, 0, w, h], sjCloud(id), { alpha: true, seed: 60 + id, brushes: PT_BRUSHES.slice(1), rough: 2.5 });
    for (let X = ((x - shift) % ring + ring) % ring - ws[k]; X < DW; X += ring) { c.save(); c.translate(X, L.y[k] - h * L.scale * .6); c.scale(L.scale, L.scale); ptDraw(c, cl, L.a); c.restore(); }
    x += ws[k] + L.gap;
  });
}
const SJ_STARS = Array.from({ length: 90 }, (_, i) => [hash(i * 3.1) * DW, -SJDY + 40 + Math.pow(hash(i * 7.7), 1.3) * (SJDY + 820), .5 + hash(i * 1.3)]);
wallP('pt_sanjeevani', { bloom: .24, vignette: .5, grain: .045 }, (c, t, k) => {
  const e = easeOut(k);
  c.translate(0, SJDY);
  ptDraw(c, ptLayer('sj_sky', [0, -SJDY, DW, DH], c2 => sjSky(c2, -SJDY, DH - SJDY), { seed: 5 }));
  SJ_STARS.forEach(([x, y, s], i) => {
    if (Math.hypot(x - SJ_MOON[0], y - SJ_MOON[1]) < 150) return;
    const n = 2 + (hash(i + 5) * 5 | 0), q = .5 + .5 * Math.sin(t * n * SJLP + i * 2.4);
    twinkle(c, x, y, 5 + s * 6, (.25 + .6 * Math.pow(q, 3)) * clamp(1 - y / 950), '#F4F0FF');
  });
  glow(c, SJ_MOON[0], SJ_MOON[1], 260, '#D8D2FF', .16 + .04 * Math.sin(t * 2 * SJLP), 'screen');
  sjLaneW(c, t, SJ_LANES[0]); sjLaneW(c, t, SJ_LANES[1]);
  c.save(); c.translate(3 * Math.sin(t * 2 * SJLP - 1.2), 7 * Math.sin(t * 2 * SJLP));   // he rises and falls on the wind
  const [mx, my] = sjM(-10, -150);
  glow(c, mx, my, 520, '#F2FFB0', (.2 + .05 * Math.sin(t * 6 * SJLP)) * e, 'screen');
  const kt = Math.floor(t / (SJL / 4) * 16) % 16, ks = Math.floor(t / (SJL / 14) * 10) % 10;
  ptDraw(c, ptLayer('sj_tail' + kt, SJ_TAIL_BOX, sjTail(kt / 16), { alpha: true, seed: 9, brushes: PT_BRUSHES.slice(2) }));
  ptDraw(c, ptLayer('sj_scarf' + ks, SJ_SCARF_BOX, sjScarf(ks / 10), { alpha: true, seed: 11, brushes: PT_BRUSHES.slice(2) }));
  const gada = ptLayer('sj_gada', SJ_GADA_BOX, sjGada, { alpha: true, seed: 13, brushes: PT_BRUSHES.slice(1) });
  ptDraw(c, gada);
  const [fx, fy] = sjW(...SJ_FACE);
  const hero = ptLayer('sj_hanuman', [50, 410, 840, 1000], sjHanuman, {
    alpha: true, seed: 17, brushes: PT_BRUSHES.slice(1),
    fine: [[fx, fy - 10, 92], [...sjW(-302, -352), 40], [...sjW(288, 168), 40]], keep: [[fx, fy + 4, 70, .55]],
  });
  ptDraw(c, hero);
  ptDraw(c, ptLayer('sj_mountain', [70, 200, 480, 480], sjMountain, { alpha: true, seed: 19, brushes: PT_BRUSHES.slice(1), fine: [[...sjM(0, 0), 60]] }));
  // on wake the herbs light one after another: until then each is dimmed back into the dark slope
  const lit = SJ_HERBS.map((_, i) => k >= 1 ? 1 : easeOut(seg(k, .05 + hash(i + 21) * .5, .35 + hash(i + 21) * .5)));
  SJ_HERBS.forEach(([hx, hy, r], i) => { if (lit[i] < 1) { const [x, y] = sjM(hx, hy); glow(c, x, y - r * .3, r * 2.4, '#16261C', (1 - lit[i]) * .95, 'source-over'); } });
  const rim = ptRim(hero, { dx: -4, dy: -5, col: '#FFF0A8', blur: 6, key: 'sjh' });
  ptDraw(c, rim, (.5 + .15 * Math.sin(t * 6 * SJLP)) * lerp(.25, 1, e), 'screen');
  ptDraw(c, ptRim(hero, { dx: 5, dy: -2, col: '#C9C2FF', blur: 5, key: 'sjm', seed: 4, density: 0 }), .35, 'screen');
  ptDraw(c, ptRim(gada, { dx: -4, dy: -5, col: '#FFF0A8', blur: 5, key: 'sjg', density: 0 }), .45 * lerp(.3, 1, e), 'screen');
  SJ_HERBS.forEach(([hx, hy, r], i) => {
    const [x, y] = sjM(hx, hy), n = 3 + (hash(i + 1) * 5 | 0), q = .5 + .5 * Math.sin(t * n * SJLP + i * 1.7);
    glow(c, x, y, r * 3.6, '#EEFFA0', (.35 + .3 * q) * lit[i] + (k < 1 ? Math.sin(lit[i] * Math.PI) * .5 : 0), 'screen');   // a flare as each one lights
    twinkle(c, x, y - r * .3, r * (1.2 + q), Math.pow(q, 4) * .95 * lit[i]);
  });
  loopedW2(t, (tt, w) => motes(c, { n: 34, seed: 8, box: [40, 160, 560, 700], r: 3, col: '#F0FFB0', a: .8 * w * e, vx: -14, vy: -16, t: tt }));
  rim.pts.forEach(([x, y], i) => {
    const rate = Math.max(1, Math.round((.35 + hash(i) * .4) * SJL)) / SJL, ph = frac(t * rate + hash(i + 9));
    twinkle(c, x, y, 8 + hash(i + 3) * 7, Math.pow(Math.max(0, Math.sin(ph * Math.PI)), 6) * .85 * e);
  });
  c.restore();
  sjLaneW(c, t, SJ_LANES[2]);
  loopedW2(t, (tt, w) => motes(c, { n: 50, seed: 4, box: [0, -SJDY, DW, 1900], r: 2.6, col: '#FFE9C8', a: .5 * w, vx: -40, vy: -4, t: tt }));
}, SJL);
// loopedW for the 12 s loop
function loopedW2(t, draw) { const u = t / SJL; draw(t, 1 - u); draw(t - SJL, u); }
