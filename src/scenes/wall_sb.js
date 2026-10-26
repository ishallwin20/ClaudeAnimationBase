// wall_sb.js: the Storybook wallpapers (batch 3, studio_wall_sb.html): seamless 6 s loops at 1290×2796, drawn in the
// 1080×2340 design space of wall_kit.js (the lock screen's date and clock cover y ~170–720: keep it quiet; the subject
// lives in y 900–2100, clear of the buttons at y ~2175).
// Each wallpaper is wallSB(name, fn(c, t, k)): t the loop time (0..6), k the wake-up (0..1). It registers
//   LOOPS[name]          the Android loop (k = 1 throughout); its frame 0 is the still
//   LOOPS[name_wake]     the iPhone Live Photo: 2 s, k rising 0 → 1 over the first 1.5 s while the loop runs its last
//                        1.5 s, so it lands exactly on the still at 1.5 s (tools/wallpack.mjs takes the key there)
//   LOOPS[name_lock]     the loop under a mock lock screen, for checking
// The boil (SB.boil, 10 a second) runs on T, which is set to the loop time, so it repeats every loop. The rigs' own
// idles run on o.t at rates that don't divide the loop, so they get swing(t): a clock that goes forth and back once a
// loop; blinks are placed by hand (blinkAt), and the main motions use lsin (whole cycles a loop).
const WL = 6, DW = 1080, DH = 2340, KS = W / DW, WAKE = 1.5;
const lsin = (t, n = 1, ph = 0) => Math.sin((t / WL * n + ph) * TAU);
const lcos = (t, n = 1, ph = 0) => Math.cos((t / WL * n + ph) * TAU);
const swing = (t, A = 1.4, c0 = 30) => c0 + A * Math.sin(TAU * t / WL);
const lmod = t => ((t % WL) + WL) % WL;
// a blink (0..1) shut around each of the times given (loop time), .16 s long
const blinkAt = (t, ...ats) => Math.max(0, ...ats.map(a => { const d = Math.abs(lmod(t - a + WL / 2) - WL / 2); return d < .08 ? 1 : d < .12 ? (.12 - d) / .04 : 0; }));
// points round an ellipse (for dry-brush rings)
const ellipsePts = (x, y, rx, ry, n = 24) => Array.from({ length: n + 1 }, (_, i) => [x + Math.cos(i / n * TAU) * rx, y + Math.sin(i / n * TAU) * ry]);
// a pop (0..~1.1 overshoot) of a wake-up beat between a and b of k
const kPop = (k, a, b) => popK(seg(k, a, b) * .25);

function lockScreen(c) {
  c.save(); c.setTransform(KS, 0, 0, KS, 0, 0); c.fillStyle = 'rgba(255,255,255,.92)'; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.font = '500 46px Poppins'; c.fillText('Monday, 26 October', DW / 2, 255);
  c.font = '700 250px Poppins'; c.fillText('9:41', DW / 2, 450);
  c.fillStyle = 'rgba(30,30,40,.5)'; for (const x of [150, 930]) { c.beginPath(); c.arc(x, 2175, 62, 0, TAU); c.fill(); }
  c.fillStyle = 'rgba(255,255,255,.8)'; c.fillRect(DW / 2 - 140, 2282, 280, 12); c.restore();
}
function wallSB(name, fn) {
  const at = (c, t, k) => { T = lmod(t); c.setTransform(KS, 0, 0, KS, 0, 0); fn(c, lmod(t), k); };
  LOOPS[name] = (c, t) => at(c, t, 1);
  LOOPS[name + '_wake'] = (c, t) => at(c, t - WAKE, clamp(t / WAKE));
  LOOPS[name + '_lock'] = (c, t) => { at(c, t, 1); c.__lock = 1; };
  LOOPS[name].len = LOOPS[name + '_lock'].len = WL; LOOPS[name + '_wake'].len = 2;
}
// the one shot: whichever loop render.mjs picked (window.LOOP), else ?loop=<name> in the URL, else the first
let LOCK = false;
SHOTS.push({ a: 0, b: 1e9, draw(c, u, t) {
  const q = new URLSearchParams(location.search).get('loop'), L = window.LOOP || LOOPS[q] || Object.values(LOOPS)[0];
  c.__lock = 0; L(c, t); LOCK = !!c.__lock;
} });
POST.push(c => { if (LOCK) lockScreen(c); });

// ---------- shared bits ----------
// a flat wall over the whole frame, with specks
function wallBg(c, col, o = {}) { c.fillStyle = col; c.fillRect(-10, -10, DW + 20, DH + 20); if (o.speck) { const [n, sc] = o.speck, r = lcg(o.seed || 5); for (let i = 0; i < n; i++) sbDot(c, r() * DW, (o.y0 ?? 0) + r() * ((o.y1 ?? DH) - (o.y0 ?? 0)), 2 + r() * 3, sc); } }
// stars that twinkle a whole number of times a loop
function sbStars(c, t, n, seed, o = {}) {
  for (let i = 0; i < n; i++) {
    const x = hash(i * 1.37 + seed) * DW, y = (o.y0 ?? 0) + hash(i * 2.71 + seed) * ((o.y1 ?? 1300) - (o.y0 ?? 0)), big = hash(i * 9.1 + seed) > .78;
    const k = .55 + .45 * lsin(t, 1 + Math.floor(hash(i * 4.4) * 3), hash(i * 6.6)), r = (big ? 7 : 3.5) * (.7 + .3 * k);
    c.save(); c.globalAlpha *= .5 + .5 * k;
    if (big) { sbLine(c, [[x - r * 2.2, y], [x + r * 2.2, y]], r * .7, o.col || '#FFF4C8', { taper: .8 }); sbLine(c, [[x, y - r * 2.2], [x, y + r * 2.2]], r * .7, o.col || '#FFF4C8', { taper: .8 }); }
    sbDot(c, x, y, r * .8, o.col || '#FFF4C8'); c.restore();
  }
}
// snow or dust falling a whole number of screens a loop
function sbFall(c, t, n, seed, o = {}) {
  for (let i = 0; i < n; i++) {
    const s = i * 1.37 + seed, laps = (o.laps ?? 1) + Math.floor(hash(s + 2) * 2), k = frac(hash(s + 1) + t / WL * laps);
    const x = hash(s) * DW + Math.sin(k * TAU * 2 + s) * 26, y = (o.y0 ?? -40) + k * ((o.y1 ?? DH + 40) - (o.y0 ?? -40)), r = (o.r || 6) * (.5 + hash(s + 3));
    c.save(); c.globalAlpha *= (o.a ?? .8) * (.5 + .5 * hash(s + 4)); sbDot(c, x, y, r, o.col || '#FFFFFF'); c.restore();
  }
}
// fireflies (or sparks) drifting on closed paths, glowing a whole number of times a loop
function sbFireflies(c, t, n, seed, box, o = {}) {
  const [x0, y0, x1, y1] = box;
  for (let i = 0; i < n; i++) {
    const s = i * 2.3 + seed, cx = lerp(x0, x1, hash(s)), cy = lerp(y0, y1, hash(s + 1)), ax = 40 + hash(s + 2) * 60, ay = 30 + hash(s + 3) * 50;
    const x = cx + ax * lsin(t, 1, hash(s + 4)), y = cy + ay * lsin(t, 2, hash(s + 5)), g = .5 + .5 * lsin(t, 2 + Math.floor(hash(s + 6) * 2), hash(s + 7));
    const rg = c.createRadialGradient(x, y, 0, x, y, 26); rg.addColorStop(0, rgba(o.col || '#FFF0A0', .7 * g)); rg.addColorStop(1, rgba(o.col || '#FFF0A0', 0));
    c.fillStyle = rg; c.fillRect(x - 26, y - 26, 52, 52); sbDot(c, x, y, 4.5, rgba(o.core || '#FFFBE0', .5 + .5 * g));
  }
}
// petals falling and turning, whole laps a loop
function sbPetals(c, t, n, seed, cols, o = {}) {
  for (let i = 0; i < n; i++) {
    const s = i * 3.1 + seed, laps = 1 + Math.floor(hash(s + 7) * 2), k = frac(hash(s) + t / WL * laps);
    const x = hash(s + 1) * DW + Math.sin(k * TAU * 2 + i) * 40, y = (o.y0 ?? -60) + k * ((o.y1 ?? DH + 60) - (o.y0 ?? -60)), r = (o.r || 16) * (.7 + .6 * hash(s + 2)), sp = (k * laps * 2 + hash(s)) * TAU;
    c.save(); c.translate(x, y); c.rotate(sp); c.scale(1, .45 + .55 * Math.abs(Math.cos(sp * .5)));
    sbShape(c, sbPoly([[-r, 0], [-r * .3, -r * .55], [r, 0], [-r * .3, r * .55]], { n: 4, jit: .4 }), cols[i % cols.length], { tex: false }); c.restore();
  }
}
// a marigold toran along the very top (above the date), swags swaying a loop
function sbToran(c, t, y = 40, o = {}) {
  const n = o.n ?? 4, w = (DW + 60) / n, sag = o.sag ?? 70;
  for (let j = 0; j < n; j++) {
    const x0 = -30 + j * w, sw = lsin(t, 1, j * .3) * 6;
    for (let i = 0; i <= 12; i++) { const f = i / 12, x = x0 + f * w + sw * Math.sin(f * Math.PI), yy = y + sag * Math.sin(f * Math.PI); sbDot(c, x, yy, 17, i % 3 === 1 ? '#FFC93C' : '#F7891B'); }
    c.save(); c.translate(x0, y); c.rotate(lsin(t, 2, j * .2) * .06); sbShape(c, sbPoly([[-16, 0], [16, 0], [0, 60]], { n: 4, jit: .6 }), '#4E9A5A', { tex: false }); c.restore();
  }
}

// ---------- props ----------
// a smiling sun: a disc in a ring of rays that turns one ray a loop; o.look, o.surprise (0..1: round eyes, an "o")
function sbSun(c, x, y, R, t, o = {}) {
  const n = 12, rot = t / WL * TAU / n, sp = o.surprise || 0;
  const g = c.createRadialGradient(x, y, R * .6, x, y, R * 2.4); g.addColorStop(0, 'rgba(255,236,150,.55)'); g.addColorStop(1, 'rgba(255,236,150,0)'); c.fillStyle = g; c.fillRect(x - R * 2.4, y - R * 2.4, R * 4.8, R * 4.8);
  for (let i = 0; i < n; i++) { const a = rot + i / n * TAU, ca = Math.cos(a), sa = Math.sin(a), Q = (d, w) => [x + ca * d - sa * w, y + sa * d + ca * w], L = i % 2 ? 1.42 : 1.6;
    sbShape(c, sbPoly([Q(R * .9, -R * .16), Q(R * L, 0), Q(R * .9, R * .16)], { n: 4, jit: .8 }), i % 2 ? '#FFC94A' : '#FFD86A', { tex: false }); }
  sbEll(c, x, y, R, R, '#FFB02E', { shade: ['rgba(230,90,10,.25)', .8], spot: [x - R * .3, y - R * .35, R * .7, 'rgba(255,255,220,.3)'] });
  const lk = o.look || [0, 0];
  for (const sd of [-1, 1]) sbEye(c, x + sd * R * .32, y - R * .12, R * (.085 + .03 * sp), { look: lk, white: sp > .4, blink: o.blink });
  sbCheek(c, x - R * .52, y + R * .2, R * .22, '#F0606A'); sbCheek(c, x + R * .52, y + R * .2, R * .22, '#F0606A');
  if (sp > .4) sbMouth(c, x, y + R * .32, R * .5, 'o', { col: '#8A3A1A' }); else sbMouth(c, x, y + R * .28, R * .42, 'smile', { col: '#8A3A1A' });
}
// a flock of little dry "v" birds crossing a whole width a loop
function sbBirds(c, t, n, y, seed, o = {}) {
  for (let i = 0; i < n; i++) { const s = i * 1.7 + seed, k = frac(hash(s) + t / WL * (o.laps ?? 1)), x = -80 + k * (DW + 160), yy = y + hash(s + 1) * 160 + lsin(t, 3, hash(s + 2)) * 10, w = 18 + hash(s + 3) * 10, fl = lsin(t, 12, hash(s)) * .5 + .5;
    sbLine(c, [[x - w, yy - w * .3 * fl], [x, yy + w * .2], [x + w, yy - w * .3 * fl]], 4, o.col || '#3A4A6A', { taper: .4 }); }
}
// a firework: a burst of dry rays and dots, n whole bursts a loop, each at its own phase
function sbFirework(c, t, x, y, R, col, n = 1, ph = 0) {
  const f = frac(t / WL * n + ph); if (f > .55) return;
  const k = easeOut(f / .4), a = 1 - seg(f, .3, .55);
  c.save(); c.globalAlpha *= a;
  for (let i = 0; i < 14; i++) { const an = i / 14 * TAU + ph * 3, r0 = R * .25 * k, r1 = R * k; sbLine(c, [[x + Math.cos(an) * r0, y + Math.sin(an) * r0], [x + Math.cos(an) * r1, y + Math.sin(an) * r1 + f * 20]], 6, col, { taper: .7 }); sbDot(c, x + Math.cos(an) * r1 * 1.1, y + Math.sin(an) * r1 * 1.1 + f * 40, 6, '#FFF6D0'); }
  c.restore();
}
// a brass kalash standing on (x, y), about 330 tall at k 1
function sbKalash(c, x, y, k = 1) {
  c.save(); c.translate(x, y); c.scale(k, k);
  sbEll(c, 0, -2, 120, 18, 'rgba(60,10,20,.35)', { tex: false });
  sbEll(c, 0, -150, 160, 150, '#E2A33A', { shade: ['rgba(120,50,0,.35)', .9], spot: [-60, -200, 90, 'rgba(255,240,190,.45)'] });
  sbEll(c, 0, -16, 70, 18, '#C98A2A', { tex: false });
  sbShape(c, sbPoly([[-70, -270], [70, -270], [60, -320], [-60, -320]], { n: 4 }), '#D99A34', { tex: false });
  sbEll(c, 0, -326, 104, 26, '#EDB54A', { tex: false }); sbEll(c, 0, -330, 80, 15, '#8A5A1A', { tex: false });
  sbDry(c, [[-74, -282], [0, -270], [74, -282]], 14, '#D8323C', .95, 5, { n: 12 }); sbDry(c, [[-74, -294], [0, -282], [74, -294]], 6, '#FFF2C8', .9, 3, { n: 12 });
  for (const dx of [-90, -30, 30, 90]) sbDot(c, dx, -150 + Math.abs(dx) * .1, 7, '#F7D57A');
  c.restore();
}
// a footprint (alta / rice paste), toes up, at (x, y), rotated a
function sbFoot(c, x, y, a, s = 1, col = '#FFF1DC', glow = 0) {
  c.save(); c.translate(x, y); c.rotate(a); c.scale(s, s);
  if (glow > .01) { const g = c.createRadialGradient(0, -10, 0, 0, -10, 90); g.addColorStop(0, rgba('#FFD86A', .55 * glow)); g.addColorStop(1, rgba('#FFD86A', 0)); c.fillStyle = g; c.fillRect(-90, -100, 180, 180); }
  sbEll(c, 0, 0, 20, 40, col, { tex: false, pear: -.2 });
  for (const [dx, dy, r] of [[-14, -50, 8], [-2, -55, 7], [9, -52, 6], [17, -46, 5], [23, -38, 4.5]]) sbDot(c, dx, dy, r, col);
  sbDot(c, 0, 0, 5, '#E2483D');
  c.restore();
}

// ================= the wallpapers =================

// ---------- 1. Bal Hanuman and the sun-fruit ----------
// wake: he swoops up from below with his mouth wide open for a bite, and the sun's eyes go round
wallSB('sb_hanuman', (c, t, k) => {
  wallBg(c, '#86BCE8');
  const g = c.createLinearGradient(0, 1200, 0, DH); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(255,236,200,.45)'); c.fillStyle = g; c.fillRect(0, 1200, DW, DH - 1200);
  sbBirds(c, t, 3, 1000, 4);
  const bite = Math.sin(Math.PI * seg(k, .25, .85)), sur = Math.sin(Math.PI * seg(k, .35, .95));
  for (let i = 0; i < 5; i++) { const f = frac(hash(i * 3.3) + t / WL), y = 720 + f * (DH - 420), x = (hash(i * 5.1) * DW + i * 260) % DW; sbCloud(c, x, y, 230 + 90 * hash(i), '#FFFFFF', .85 * seg(f, 0, .15)); }
  sbSun(c, 800, 990, 165, t, { look: [-.7, .6], surprise: sur, blink: blinkAt(t, 3.3) });
  // clouds rushing down past him (he flies up): whole screens a loop
  const up = (1 - easeOut(k)) * 520, bob = lsin(t, 1) * 18, hx = 300 - (1 - easeOut(k)) * 120, hy = 1990 + up + bob;
  sbSwoosh(c, [[hx - 330, hy + 420], [hx - 150, hy + 170], [hx + 10, hy - 60]], 150, '#FFFFFF', .45);
  sbHanuman(c, hx, hy, 1.12, { t: swing(t), rot: .42, reach: .92 + .08 * lsin(t, 2), tail: lsin(t, 1) * .7, kick: lsin(t, 3), blink: blinkAt(t, 1.6),
    mouth: bite > .15 ? 'wide' : 'grin', open: bite, look: [.6, -.5] });
});

// ---------- 2. Bal Bappa shares his modaks with Mooshak ----------
// wake: Mooshak pops up from behind the plate of modaks; Bappa's eyes crinkle happy
wallSB('sb_bappa', (c, t, k) => {
  wallBg(c, '#5FB3A8', { speck: [40, 'rgba(255,255,255,.18)'], seed: 3, y0: 800 });
  sbShape(c, sbPoly([[-20, 1990], [1100, 1975], [1100, 2400], [-20, 2400]], { n: 6 }), '#4A9A8E', { tex: false });
  // a rangoli under the plate
  sbDry(c, ellipsePts(790, 2075, 210, 46), 10, '#FFFFFF', .6, 4, { n: 60 });
  for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; sbDot(c, 790 + Math.cos(a) * 170, 2075 + Math.sin(a) * 36, 8, i % 2 ? '#F7891B' : '#FFC93C'); }
  sbToran(c, t, 34);
  sbPetals(c, t, 9, 2, ['#F7891B', '#FFC93C', '#F06A6A'], { y0: 760 });
  for (const [dx, ph] of [[110, 0], [210, .4]]) sbDiya(c, dx, 2085, .7, { fl: lsin(t, 5, ph) * .6 + lsin(t, 9, ph) * .4 });
  // Mooshak behind the plate, popping up (clipped below its rim)
  const pop = k >= 1 ? 1 : clamp(kPop(k, .12, .6)), hop = k < 1 ? Math.sin(Math.PI * seg(k, .12, .45)) : 0, nib = Math.max(0, lsin(t, 1, .2)) ;
  c.save(); c.beginPath(); c.rect(0, 0, DW, 2050); c.clip();
  sbMouse(c, 850, 2050 + (1 - pop) * 520, .58, { t: swing(t), hold: 'modak', blink: blinkAt(t, 3.9), hop: hop, nose: lsin(t, 18) * 3 * Math.max(0, lsin(t, 2)), tail: lsin(t, 2) * .6, ear: Math.max(0, lsin(t, 3, .1)) * .6, look: [-.4, 0] });
  c.restore();
  // the plate and its heap of modaks
  sbEll(c, 760, 2050, 170, 34, '#E2A33A', { tex: false, shade: ['rgba(120,50,0,.3)', 1.6] }); sbEll(c, 760, 2044, 136, 22, '#F2C25A', { tex: false });
  for (const [mx, my, s] of [[690, 2050, .62], [760, 2056, .62], [830, 2050, .62], [725, 1975, .6], [795, 1975, .6], [760, 1902, .58]]) sbModak(c, mx, my, s);
  const happy = k < 1 && seg(k, .5, .62) > 0 && seg(k, .9, .98) < 1;
  sbBappa(c, 400, 2010, 1.2, { t: swing(t), trunk: lsin(t, 1) * .5, blink: blinkAt(t, 1.8), happy, look: [.6, .1], arm: 'abhaya' });
});

// ---------- 3. Om Namah Shivaya: Shiva in dhyana on Kailash ----------
// wake: Vasuki pops up over his shoulder and flicks a big forked tongue
wallSB('sb_shiva', (c, t, k) => {
  wallBg(c, '#2A3166');
  sbStars(c, t, 46, 3, { y1: 1250 });
  // Kailash behind him, the snow lit on its left face
  sbShape(c, sbPoly([[-200, 2400], [140, 1720], [400, 1250], [540, 1150], [680, 1260], [930, 1700], [1280, 2400]], { n: 8 }), '#DDE3F2', { tex: false });
  sbShape(c, sbPoly([[540, 1150], [680, 1260], [930, 1700], [1280, 2400], [700, 2400], [620, 1600]], { n: 6 }), '#AEB6D8', { tex: false });
  sbFall(c, t, 50, 7, { r: 5, a: .7 });
  // the glow behind him, breathing once a loop
  const gl = .5 + .5 * lsin(t, 1);
  { const g = c.createRadialGradient(540, 1560, 60, 540, 1560, 520); g.addColorStop(0, rgba('#FFF4D0', .32 + .08 * gl)); g.addColorStop(1, rgba('#FFF4D0', 0)); c.fillStyle = g; c.fillRect(0, 1000, DW, 1200); }
  sbEll(c, 540, 2075, 330, 60, '#59608E', { tex: false });
  const pop = k >= 1 ? 1 : clamp(kPop(k, .05, .4)), fl = k < 1 ? Math.max(Math.sin(Math.PI * seg(k, .42, .66)), Math.sin(Math.PI * seg(k, .68, .92))) : Math.sin(Math.PI * seg(t, 2.4, 2.75));
  sbShiva(c, 520, 2060, 1.06, { t: swing(t, 1.2), ganga: t / WL * 3, snake: { pop, tongue: fl, sway: lsin(t, 1) * .6, blink: blinkAt(t, 4.1), look: [0, .3] } });
});

// ---------- 4. Lakshmi and Ganesha on Diwali night ----------
// wake: the diyas light one after another, left to right, and the coins start to pour
wallSB('sb_lakshmi_ganesh', (c, t, k) => {
  wallBg(c, '#3A2C6E');
  sbStars(c, t, 30, 11, { y1: 1100 });
  // a string of little lights in a swag below the clock
  for (let i = 0; i <= 18; i++) { const f = i / 18, x = -20 + f * (DW + 40), y = 860 + Math.sin(f * Math.PI) * 120, on = .55 + .45 * lsin(t, 3, i * .37);
    const g = c.createRadialGradient(x, y, 0, x, y, 30); g.addColorStop(0, rgba(i % 3 ? '#FFD86A' : '#FF8A6A', .6 * on)); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(x - 30, y - 30, 60, 60); sbDot(c, x, y, 7, i % 3 ? '#FFE9A0' : '#FFB49A'); }
  sbShape(c, sbPoly([[-20, 2010], [1100, 1995], [1100, 2400], [-20, 2400]], { n: 6 }), '#2C2156', { tex: false });
  sbDry(c, ellipsePts(540, 2080, 420, 52), 10, '#F7D57A', .45, 4, { n: 70 });
  const coins = k >= 1 ? 1 : seg(k, .6, .8);
  sbDevi(c, 320, 1990, 1.05, { kind: 'lakshmi', t: swing(t, 1), coinT: t * 5 / 5.4, coins: coins > 0 ? 1 : 0 });
  sbBappa(c, 800, 2000, .98, { t: swing(t, 1.2, 40), trunk: lsin(t, 1, .3) * .5, blink: blinkAt(t, 2.2), look: [-.3, .1] });
  for (let i = 0; i < 5; i++) { const x = 270 + i * 135, lit = k >= 1 ? 1 : easeOut(seg(k, .08 + i * .1, .22 + i * .1)); sbDiya(c, x, 2110, .75, { lit, fl: lsin(t, 5, i * .3) * .6 + lsin(t, 11, i * .7) * .4 }); }
});

// ---------- 5. The owl's Diwali ----------
// the gag (in the loop, and the iPhone's wake-up): his head turns right round, landing face front on the still
wallSB('sb_owl', (c, t, k) => {
  wallBg(c, '#24306A');
  sbStars(c, t, 26, 5, { y1: 1000 });
  sbFirework(c, t, 260, 1060, 190, '#FF8AA0', 1, .1); sbFirework(c, t, 820, 940, 230, '#FFD86A', 1, .45); sbFirework(c, t, 600, 1250, 150, '#8AD8FF', 2, .7);
  // the town below: rooftops with lit windows
  sbShape(c, sbPoly([[-20, 1500], [120, 1470], [130, 1400], [300, 1400], [310, 1460], [520, 1450], [540, 1360], [700, 1360], [720, 1440], [900, 1430], [910, 1380], [1100, 1380], [1100, 1900], [-20, 1900]], { n: 3, jit: 1 }), '#1A2250', { tex: false });
  for (let i = 0; i < 22; i++) { const x = 30 + hash(i * 3.3) * 1020, y = 1480 + hash(i * 1.7) * 250, on = .6 + .4 * lsin(t, 1 + (i % 3), hash(i)); c.save(); c.globalAlpha *= on; sbShape(c, sbPoly([[x, y], [x + 26, y], [x + 26, y + 30], [x, y + 30]], { n: 3, jit: .6 }), '#FFCF6A', { tex: false }); c.restore(); }
  // the parapet, diyas along it
  sbShape(c, sbPoly([[-20, 1915], [1100, 1905], [1100, 2400], [-20, 2400]], { n: 6 }), '#B5563A', { tex: false, shade: ['rgba(40,0,0,.3)', 1.57] });
  sbShape(c, sbPoly([[-20, 1890], [1100, 1880], [1100, 1945], [-20, 1950]], { n: 6 }), '#D07048', { tex: false });
  for (const [x, ph] of [[110, 0], [290, .3], [800, .6], [970, .9]]) sbDiya(c, x, 1900, .7, { fl: lsin(t, 5, ph) * .6 + lsin(t, 9, ph) * .4 });
  const turn = easeIO(seg(t, 4.55, 5.75));
  sbOwl(c, 545, 1900, 1.1, { t: swing(t), turn, blink: blinkAt(t, 2.0), tilt: lsin(t, 1) * .05 });
  sbDiya(c, 545, 1930, .9, { fl: lsin(t, 4) * .6 + lsin(t, 10) * .4 });
  // coins glinting on the ledge
  for (const [x, y] of [[380, 1918], [420, 1925], [690, 1922]]) sbCoin(c, x, y, .55);
});

// ---------- 6. Dhanteras: a brass kalash overflowing with gold coins, Lakshmi's footprints walking in ----------
// wake: the coins spill out in a little burst and settle
const KALASH_SPILL = [[370, 2075], [415, 2100], [690, 2090], [730, 2068], [640, 2112], [460, 2112], [330, 2100], [760, 2100]];
wallSB('sb_dhanteras', (c, t, k) => {
  wallBg(c, '#7A1E2C', { speck: [50, 'rgba(255,210,120,.18)'], seed: 7, y0: 760 });
  // the footprints: pairs walking in from the bottom left, a glow passing up them once a loop
  const steps = [[70, 1960, .55], [150, 1915, .75], [130, 1810, .6], [215, 1770, .8]];
  steps.forEach(([x, y, a], i) => sbFoot(c, x, y, a, .95, '#FFF1DC', Math.max(0, lsin(t, 1, -i * .1)) ** 3));
  // a rangoli ring under the kalash
  sbDry(c, ellipsePts(540, 2045, 360, 76), 12, '#FFF1DC', .55, 5, { n: 70 });
  for (let i = 0; i < 16; i++) { const a = i / 16 * TAU; sbDot(c, 540 + Math.cos(a) * 300, 2045 + Math.sin(a) * 62, 10, i % 2 ? '#F7891B' : '#FFC93C'); }
  for (const [x, ph] of [[870, 0], [960, .5]]) sbDiya(c, x, 2010 - (x - 870) * .5, .7, { fl: lsin(t, 5, ph) * .6 + lsin(t, 9, ph) * .4 });
  // mango leaves fanned behind the coins, the kalash, the heap
  c.save(); c.translate(540, 2050); c.scale(1.22, 1.22); c.translate(-540, -2050);
  for (const a of [-1.1, -.55, 0, .55, 1.1]) { c.save(); c.translate(540, 1610); c.rotate(a * .8); sbShape(c, sbPoly([[0, 0], [-34, -90], [0, -200], [34, -90]], { n: 6 }), a ? '#3E8A4A' : '#4E9A5A', { tex: false }); sbLine(c, [[0, -10], [0, -180]], 3, '#2A5A30', { taper: .4 }); c.restore(); }
  sbKalash(c, 540, 2090, 1.45);
  for (const [x, y] of [[470, 1600], [540, 1588], [610, 1600], [500, 1565], [580, 1565], [540, 1535], [430, 1618], [650, 1618]]) sbCoin(c, x, y, .9);
  for (let i = 0; i < 4; i++) { const x = 650 + i * 20, y = 1660 + i * 60; sbCoin(c, x + 70, y, .8, { spin: .15 * i }); }
  // the spill: coins from the mouth to the floor
  KALASH_SPILL.forEach(([fx, fy], i) => { const p = k >= 1 ? 1 : easeOut(seg(k, .12 + i * .04, .55 + i * .04)), x = lerp(540, fx, p), y = lerp(1560, fy, p) - Math.sin(p * Math.PI) * (260 + i * 20);
    sbCoin(c, x, y, .8, { spin: p < 1 ? p * 3 + i * .2 : .1 * (i % 3) }); });
  c.restore();
  // glints twinkling on the heap
  for (let i = 0; i < 6; i++) { const x = 430 + hash(i * 2.1) * 220, y = 1540 + hash(i * 3.7) * 110, g = Math.max(0, lsin(t, 2, hash(i * 5.3))) ** 4; if (g > .02) { sbLine(c, [[x - 26 * g, y], [x + 26 * g, y]], 5, '#FFF8D8', { taper: .9 }); sbLine(c, [[x, y - 26 * g], [x, y + 26 * g]], 5, '#FFF8D8', { taper: .9 }); } }
});

// ---------- 7. Bal Krishna and the calf ----------
// wake: the calf licks his cheek and he scrunches up laughing
wallSB('sb_krishna_calf', (c, t, k) => {
  wallBg(c, '#F4B860');
  for (let i = 0; i < 2; i++) { const f = frac(hash(i * 4.1) + t / WL), x = -300 + f * (DW + 600); sbCloud(c, x, 900 + i * 170, 260, '#FFF4E0', .8); }
  sbShape(c, sbPoly([[-20, 1960], [300, 1930], [700, 1950], [1100, 1925], [1100, 2400], [-20, 2400]], { n: 8 }), '#7FB069', { tex: false });
  for (let i = 0; i < 26; i++) { const x = hash(i * 1.3) * DW, y = 1980 + hash(i * 2.9) * 300; sbDry(c, [[x, y], [x + 6, y - 30 - 10 * hash(i)]], 6, '#5E9A50', .8, 3, { n: 5 }); }
  for (let i = 0; i < 2; i++) { const x = 200 + i * 600 + lsin(t, 1, i * .5) * 120, y = 1250 + lsin(t, 2, i * .3) * 80, fl = Math.abs(lsin(t, 12, i * .2));
    for (const sd of [-1, 1]) sbEll(c, x + sd * 16 * (.3 + .7 * fl), y, 16 * (.3 + .7 * fl), 22, i ? '#FFFFFF' : '#F06A9A', { tex: false }); }
  const lick = k < 1 ? Math.sin(Math.PI * seg(k, .15, .55)) : 0, hap = k < 1 && k > .3 && k < .88;
  const kx = 360, ky = 2030, ks = 1.2;
  sbKrishna(c, kx, ky, ks, { t: swing(t, 1.2, 50), arm: 'none', feather: lsin(t, 1) * .6, blink: blinkAt(t, 1.4), happy: hap, mouth: hap ? 'grin' : 'smile', tilt: hap ? -.08 : 0, look: [.5, 0] });
  const calf = { t: swing(t), lick, head: -.1 - lick * 1.8, tail: lsin(t, 2) * .8, ear: lsin(t, 3) * .3, blink: blinkAt(t, 3.4) };
  sbCalf(c, 820, 2045, 1.22, calf);
  // his arm round the calf's neck, over it
  sbLimb(c, [kx + 100 * ks, ky - 415 * ks], [kx + 290 * ks, ky - 360 * ks], 34 * ks, SB_KRISHNA.skin);
  sbEll(c, kx + 300 * ks, ky - 352 * ks, 33 * ks, 31 * ks, SB_KRISHNA.skin, { tex: false }); sbDry(c, [[kx + 255 * ks, ky - 395 * ks], [kx + 262 * ks, ky - 340 * ks]], 9 * ks, SB_KRISHNA.gold, .9, 3, { n: 6 });
  // the calf's head again, over the arm: the arm goes behind it and round the neck
  c.save(); c.beginPath(); c.rect(0, 0, 668, DH); c.clip(); c.beginPath(); c.ellipse(548, 1500, 190, 230, 0, 0, TAU); c.clip(); sbCalf(c, 820, 2045, 1.22, calf); c.restore();
});

// ---------- 8. The vahana squad: Nandi, the donkey, Mooshak and the owl, posing for a group photo ----------
// wake: they pop up one after another
wallSB('sb_vahanas', (c, t, k) => {
  wallBg(c, '#B9A3DE', { speck: [40, 'rgba(255,255,255,.25)'], seed: 4, y0: 760 });
  sbShape(c, sbPoly([[-20, 1990], [1100, 1975], [1100, 2400], [-20, 2400]], { n: 6 }), '#9C86C4', { tex: false });
  const P = i => k >= 1 ? 1 : clamp(kPop(k, .05 + i * .16, .4 + i * .16)), hop = (i, at) => Math.sin(Math.PI * seg(t, at, at + .4)) * (k >= 1 ? 1 : 0);
  const lift = (i, at) => (1 - P(i)) * 700 - hop(i, at) * 50;
  sbNandi(c, 170, 1940 + lift(0, 1.0), .64, { t: swing(t), flip: true, blink: blinkAt(t, 2.6), tail: lsin(t, 2) * .7 });
  sbDonkey(c, 905, 1940 + lift(1, 2.0), .64, { t: swing(t, 1.4, 40), blink: blinkAt(t, 3.6), ears: lsin(t, 2) * .6, tail: lsin(t, 2, .3) * .7 });
  sbMouse(c, 400, 2120 + lift(2, 3.0), .44, { t: swing(t, 1.4, 50), flip: true, hold: 'modak', blink: blinkAt(t, 1.2), hop: hop(2, 3.0), nose: 0, tail: lsin(t, 2) * .6 });
  sbOwl(c, 690, 2120 + lift(3, 4.0), .5, { t: swing(t, 1.4, 60), blink: blinkAt(t, .5), hop: hop(3, 4.0), tilt: lsin(t, 1) * .08 });
});

// ---------- 9. Kartik: a lamp for Tulsi ----------
// wake: the lamp catches and flares
wallSB('sb_tulsi', (c, t, k) => {
  wallBg(c, '#3D3A78');
  sbStars(c, t, 40, 9, { y1: 1300 });
  sbShape(c, sbPoly([[-20, 2010], [1100, 1995], [1100, 2400], [-20, 2400]], { n: 6 }), '#2E2B60', { tex: false });
  sbFireflies(c, t, 9, 3, [100, 1150, 980, 1900]);
  // the tulsi plant: stems, leaf clusters and flower spikes, swaying a loop
  const sway = lsin(t, 1) * 10;
  const stems = [[540, 1720, 540, 1240], [540, 1600, 380, 1380], [540, 1560, 700, 1330], [540, 1460, 430, 1290], [540, 1420, 650, 1260]];
  for (const [x0, y0, x1, y1] of stems) sbLine(c, [[x0, y0], [(x0 + x1) / 2 + sway * .4, (y0 + y1) / 2], [x1 + sway, y1]], 12, '#4A3A4A', { taper: .5 });
  for (let i = 0; i < 90; i++) { const s = stems[i % 5], f = .35 + hash(i * 1.9) * .65, x = lerp(s[0], s[2] + sway, f) + (hash(i * 3.1) - .5) * 90, y = lerp(s[1], s[3], f) + (hash(i * 4.3) - .5) * 60, a = hash(i * 7.7) * TAU, st = lsin(t, 2, hash(i)) * .1;
    c.save(); c.translate(x, y); c.rotate(a + st); sbEll(c, 0, -24, 18, 30, ['#3E7A44', '#4E8E4E', '#5E9C52', '#5A4A78'][i % 4], { tex: false }); c.restore(); }
  for (const s of stems) { const x = s[2] + sway, y = s[3]; for (let j = 0; j < 5; j++) sbDot(c, x + Math.sin(j) * 4, y - 14 - j * 16, 6, '#8A5AA8'); }
  // the tulsi vrindavan (whitewashed, a terracotta border), a niche with the lamp
  sbShape(c, sbPoly([[340, 1730], [740, 1730], [720, 2080], [360, 2080]], { n: 4, jit: 1 }), '#F3E6D4', { tex: false, shade: ['rgba(60,40,90,.3)', 0] });
  sbShape(c, sbPoly([[320, 1700], [760, 1700], [760, 1745], [320, 1745]], { n: 4, jit: 1 }), '#C8673A', { tex: false });
  sbShape(c, sbPoly([[340, 2060], [740, 2060], [760, 2110], [320, 2110]], { n: 4, jit: 1 }), '#C8673A', { tex: false });
  sbShape(c, sbPoly([[460, 2000], [620, 2000], [620, 1880], [580, 1830], [540, 1815], [500, 1830], [460, 1880]], { n: 5, jit: .8 }), '#5A2A1A', { tex: false });
  for (const [x, y] of [[390, 1790], [690, 1790], [390, 2010], [690, 2010]]) sbDot(c, x, y, 12, '#E2483D');
  const lit = k >= 1 ? 1 : easeOut(seg(k, .15, .6)), flare = k < 1 ? Math.sin(Math.PI * seg(k, .4, .95)) * .8 : 0;
  sbDiya(c, 540, 1995, .85, { lit, fl: lsin(t, 5) * .6 + lsin(t, 11) * .4 + flare, glow: 1 + flare });
  sbDiya(c, 220, 2160, .65, { fl: lsin(t, 4, .3) * .6 + lsin(t, 9, .3) * .4 });
});
