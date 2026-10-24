// wall_kit.js: phone live wallpapers, as seamless loops (Painted).
// The canvas is 1290×2796 (an iPhone Pro Max, 19.5:9); every wallpaper draws in a 1080×2340 design space under
// wallBegin() / wallEnd(), so the reel rigs' u ranges apply as they are. Each wallpaper is a LOOP of WL seconds whose
// frame WL is frame 0: render one cycle with  node render.mjs --loop=<name> --png --out=out/wall/<name>  and
// tools/wallpaper.mjs makes the phone files from it.
//
// The lock screen, in design px: the date, the clock and the widgets cover about y 170–720 (keep it quiet: sky), the
// flashlight and camera buttons sit near (150, 2175) and (930, 2175), the home bar at y 2290. The subject lives in
// y 900–2100. Frame 0 is the still a phone shows most of the time: the prettiest pose, eyes open.
//
// Loop rules: every motion is a whole number of cycles per loop (lsin(), petalFall(), twinkle()), boil repeats because
// WL × 12 is whole, feel() repeats because WL is a whole number of bars at PROJECT.bpm, and the rigs' own idles and
// blinks (which run on T at their own rates) go through rigClock().
const WL = 6, DW = 1080, DH = 2340;
const lsin = (t, n = 1, ph = 0) => Math.sin((t / WL * n + ph) * TAU);    // n whole cycles per loop
const lcos = (t, n = 1, ph = 0) => Math.cos((t / WL * n + ph) * TAU);
function wallBegin() { camBegin(DW / 2, DH / 2, W / DW); }
function wallEnd() { camEnd(); }

// The rigs blink when (T·f + off + seed·1.7) mod per < ~.12, and sway on sin(T·k): neither divides the loop. rigClock()
// runs a rig on a clock that swings A s back and forth (so it repeats every loop), placed so the blink window sits where
// the swing passes sin = .8: the eyes blink at loop time `at` and again on the way back (WL/2 − at), a double blink.
const BLINKS = { clawd: [.9, 0, 3.3], balbappa: [.9, 0, 3.3], kid: [.9, .4, 3.4], owl: [.8, .4, 4.1], parvati: [.9, 1.6, 3.3], shiva: [.9, 0, 3.3],
  narada: [.9, 1.1, 3.7], nandi: [.8, .9, 3.7], lion: [.85, .9, 3.8], durga: [.9, 1.3, 3.6] };
function rigClock(t, kind, seed, fn, o = {}) {
  const [f, off, per] = BLINKS[kind], A = o.A ?? 1.5, s0 = .8, at = o.at ?? .9;
  const C = (.06 - off - seed * 1.7) / f - A * s0 + 20 * per / f;      // + whole periods: keep T positive (% of a negative)
  const ph = Math.asin(s0) - TAU * at / WL, save = T;
  T = o.noBlink ? C + 1.6 + A * Math.sin(TAU * t / WL + ph) * .3 : C + A * Math.sin(TAU * t / WL + ph);
  try { return fn(); } finally { T = save; }
}

// ---------- props ----------
// a clay diya, (x, y) the foot of the bowl, s its width; the flame flickers a whole number of times a loop
function diya(x, y, s, t, key, o = {}) {
  const ph = hash(key.length * 7.3 + x * .01), fl = lsin(t, 5, ph) * .5 + lsin(t, 9, ph * 2) * .3 + lsin(t, 13, ph * 3) * .2;
  const lit = o.lit ?? 1, fh = s * (.62 + .1 * fl);
  if (lit) { glow(x, y - s * .5, s * (2.6 + .25 * fl), '#FFB347', .75 * lit); glow(x, y - s * .55, s * 1.1, '#FFE6A0', .7 * lit); }
  boilSeed('diya ' + key);
  const b = [[-.5, -.36], [-.3, -.08], [0, 0], [.3, -.08], [.5, -.36], [.62, -.42], [.58, -.48], [0, -.42], [-.4, -.46]].map(([a, c]) => [x + a * s, y + c * s]);
  paint(b, { wash: o.col || '#C8673A', fill: '#8E3E20', fillOp: 70, tex: .5, ink: PAL.ink, sw: clamp(s / 70, .4, 1.1), curv: .35 });
  paint(ellPts(x - s * .02, y - s * .43, s * .42, s * .07, 16), { wash: '#6A2C16', ink: null });
  inkLine([[x - s * .3, y - s * .2], [x + s * .3, y - s * .2]], clamp(s / 110, .3, .8), '#F2C04A', 'inkfine', .3);
  if (!lit) return;
  const sway = (lsin(t, 3, ph) * .07 + lsin(t, 7, ph) * .04) * s, bx = x + s * .1, by = y - s * .45;
  const F = [[bx - s * .1, by], [bx - s * .12 + sway * .3, by - fh * .35], [bx + sway, by - fh], [bx + s * .12 + sway * .3, by - fh * .35], [bx + s * .1, by]];
  paint(F, { wash: '#FFB43C', ink: null, curv: .6 });
  paint(F.map(([a, c]) => [bx + (a - bx) * .55, by + (c - by) * .62]), { wash: '#FFF0B8', ink: null, curv: .6 });
}
// petals drifting down through a region, each looping a whole number of times per loop
function petalFall(t, n, key, o = {}) {
  const x0 = o.x0 ?? -40, x1 = o.x1 ?? DW + 40, y0 = o.y0 ?? -60, y1 = o.y1 ?? DH + 60, cols = o.cols || [['#F7A21B', '#D9780F'], ['#FFC93C', '#E0A21A']], s = o.s ?? 16;
  for (let i = 0; i < n; i++) {
    const cyc = (o.cyc ?? 1) + Math.floor(hash(i * 3.1 + 7) * 2), k = frac(hash(i * 5.7) + t / WL * cyc);
    const x = lerp(x0, x1, hash(i * 1.9)) + Math.sin(k * TAU * 2 + i) * 40, y = lerp(y0, y1, k), r = s * (.7 + .6 * hash(i * 2.3));
    const [c, dk] = cols[i % cols.length], spin = (k * 3 + hash(i)) * TAU;
    boilSeed(key + ' petal ' + i);
    push(); translate(x, y); rotate(spin); scale(1, .45 + .55 * Math.abs(Math.cos(spin * .7)));
    paint([[-r, 0], [-r * .4, -r * .5], [r, 0], [-r * .4, r * .5]], { wash: c, fill: dk, fillOp: 70, tex: .4, ink: null, curv: .6 });
    pop();
  }
}
// stars that twinkle a whole number of times per loop; o: y1 (lowest), col, s (size)
function twinkle(t, n, key, o = {}) {
  for (let i = 0; i < n; i++) {
    const x = hash(i * 1.37 + 3) * DW, y = (o.y0 ?? 0) + hash(i * 2.71 + 5) * ((o.y1 ?? 1300) - (o.y0 ?? 0)), big = hash(i * 9.1) > .8;
    const k = .55 + .45 * lsin(t, 1 + Math.floor(hash(i * 4.4) * 3), hash(i * 6.6)), r = (o.s ?? 1) * (big ? 9 : 4.5) * (.6 + .4 * k);
    if (big) glow(x, y, r * 4, o.col || '#FFF2C0', .35 * k);
    boilSeed(key + ' star ' + i);
    paint(big ? starPts(x, y, r * 1.6, .3, 4) : ellPts(x, y, r * .55, r * .55, 6), { wash: o.col || '#FFF2C0', washOp: 140 + 115 * k, ink: null });
  }
}
// a soft cloud bank: puffs along y, drifting `drift` px a loop and wrapping (whole loop)
function cloudBank(t, y, key, o = {}) {
  const n = o.n ?? 6, span = DW + 600, cols = o.cols || ['#FFF4E6', '#F6D9C2'];
  for (let i = 0; i < n; i++) {
    const x = ((hash(i * 3.3 + y) * span + t / WL * span * (o.laps ?? 1)) % span) - 300, w = (o.w ?? 260) * (.7 + .6 * hash(i * 1.1 + y));
    boilSeed(key + ' cloud ' + i);
    paint(ellPts(x, y + hash(i * 7.7) * 60, w, w * .32, 22), { fill: cols[1], fillOp: 150, bleed: .25, tex: .3, border: .3, ink: null });
    paint(ellPts(x - w * .2, y - w * .1 + hash(i * 7.7) * 60, w * .62, w * .3, 20), { fill: cols[0], fillOp: 190, bleed: .2, tex: .3, border: .3, ink: null });
  }
}
// a big halo of petals behind a deity, turning one petal-step per loop (so it repeats)
function petalHalo(t, x, y, r, key, o = {}) {
  const n = o.n ?? 16, rot = t / WL * TAU / n * (o.steps ?? 1);
  glow(x, y, r * 1.3, o.glow || '#FFD98A', o.glowA ?? .5);
  boilSeed(key + ' halo');
  paint(ellPts(x, y, r, r, 48), { fill: o.c1 || '#FFE6B8', fillOp: 200, bleed: .12, tex: .3, border: .4, ink: null });
  for (let i = 0; i < n; i++) {
    const a = rot + i / n * TAU, ca = Math.cos(a), sa = Math.sin(a), P = (d, w) => [x + ca * d - sa * w, y + sa * d + ca * w];
    paint([P(r * .72, 0), P(r * .86, r * .07), P(r * 1.02, 0), P(r * .86, -r * .07)], { wash: o.c2 || '#F7C978', washOp: 200, ink: null, curv: .5 });
  }
  inkLine(ellPts(x, y, r * .7, r * .7, 48).concat([[x + r * .7, y]]), 1, o.c3 || '#E8A84A', 'inkfine', .5);
}

// a marigold garland in swags across the top edge (above the date): n swags, sagging `sag` px, swaying a loop
function garland(t, y, key, o = {}) {
  const n = o.n ?? 3, sag = o.sag ?? 120, w = (DW + 80) / n;
  for (let j = 0; j < n; j++) {
    const x0 = -40 + j * w, sw = lsin(t, 1, j * .3) * 8;
    boilSeed(key + ' garland ' + j);
    for (let i = 0; i <= 14; i++) {
      const k = i / 14, x = x0 + k * w + sw * Math.sin(k * Math.PI), yy = y + sag * Math.sin(k * Math.PI) + sw * .3 * Math.sin(k * Math.PI);
      const col = i % 3 === 1 ? ['#FFC93C', '#E0A21A'] : ['#F7891B', '#C9620F'];
      paint(ellPts(x, yy, 21, 19, 12, 2), { wash: col[0], fill: col[1], fillOp: 90, tex: .6, ink: '#8A4A14', sw: .5 });
    }
    // a tassel at each knot
    const kx = x0, ky = y;
    paint(ellPts(kx, ky + 8, 16, 16, 10), { wash: '#E2476E', ink: '#8A2A40', sw: .5 });
    for (let i = 0; i < 4; i++) { const tw = lsin(t, 2, j * .4 + i * .1) * 6; paint(ellPts(kx + tw * (i / 3), ky + 34 + i * 26, 13 - i, 12 - i, 10), { wash: i % 2 ? '#FFC93C' : '#F7891B', ink: '#8A4A14', sw: .4 }); }
    paint(rrPts(kx - 9 + lsin(t, 2, j * .4 + .3) * 6, ky + 128, 18, 22, 6), { wash: '#6FAE5A', ink: '#3E6A30', sw: .4 });
  }
}

// ---------- checking ----------
// the lock screen over a wallpaper (date, clock, the two buttons, the home bar), to check the quiet zones
function lockGuides() {
  wallBegin();
  letter('Thursday, 23 October', DW / 2, 255, 46, '#FFFFFF', { font: '500 46px Poppins', ink: false, alpha: .92 });
  letter('9:41', DW / 2, 450, 250, '#FFFFFF', { font: '700 250px Poppins', ink: false, alpha: .92 });
  for (const x of [150, 930]) paint(ellPts(x, 2175, 62, 62, 24), { wash: '#1E1E28', washOp: 120, ink: null });
  paint(rrPts(DW / 2 - 140, 2282, 280, 12, 6), { wash: '#FFFFFF', washOp: 200, ink: null });
  wallEnd();
}
// wallpaper(name, fn): registers LOOPS[name] (the wallpaper) and LOOPS[name + '_lock'] (with the lock screen over it)
function wallpaper(name, fn) {
  LOOPS[name] = t => { wallBegin(); fn(t); wallEnd(); };
  LOOPS[name + '_lock'] = t => { LOOPS[name](t); lockGuides(); };
  LOOPS[name].len = LOOPS[name + '_lock'].len = WL;
}
