// wall_mix.js: wallpapers that mix the cine.js styles (studio_wall_mix.html): Cinematic light (glow, bloom, rim-lit
// silhouettes) with Storybook's flat shapes and paper, at 1290×2796, drawn in the 1080×2340 design space, seamless 6 s
// loops. wallM(name, look, fn(c, t, k)) registers <name> (the loop, frame 0 the still), <name>_wake (the iPhone's 2 s:
// k rises 0 → 1 over 1.5 s while the loop plays its last 1.5 s, landing on the still) and <name>_lock (a mock lock
// screen). look sets this wallpaper's finish: { bloom, vignette, grain, paper, boil } (cine.js LOOK, SB.paper, SB.boil).
const WL = 6, DW = 1080, DH = 2340, KS = W / DW, WAKE = 1.5;
const lsin = (t, n = 1, ph = 0) => Math.sin((t / WL * n + ph) * TAU);
const lmod = t => ((t % WL) + WL) % WL;
const kSeg = (k, a, b) => k >= 1 ? 1 : seg(k, a, b);
const kBump = (k, a, b) => k >= 1 ? 0 : Math.sin(Math.PI * seg(k, a, b));
let LOCK = false;
function lockScreen(c) {
  c.save(); c.setTransform(KS, 0, 0, KS, 0, 0); c.fillStyle = 'rgba(255,255,255,.92)'; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.font = '500 46px Poppins'; c.fillText('Monday, 26 October', DW / 2, 255); c.font = '700 250px Poppins'; c.fillText('9:41', DW / 2, 450);
  c.fillStyle = 'rgba(30,30,40,.5)'; for (const x of [150, 930]) { c.beginPath(); c.arc(x, 2175, 62, 0, TAU); c.fill(); }
  c.fillStyle = 'rgba(255,255,255,.8)'; c.fillRect(DW / 2 - 140, 2282, 280, 12); c.restore();
}
function wallM(name, look, fn) {
  const at = (c, t, k) => {
    T = lmod(t); Object.assign(LOOK, { bloom: look.bloom ?? 0, vignette: look.vignette ?? 0, grain: look.grain ?? 0 }); SB.paper = look.paper ?? 0; SB.boil = look.boil ?? 0;
    c.setTransform(KS, 0, 0, KS, 0, 0); fn(c, lmod(t), k);
  };
  LOOPS[name] = (c, t) => at(c, t, 1); LOOPS[name + '_wake'] = (c, t) => at(c, t - WAKE, clamp(t / WAKE)); LOOPS[name + '_lock'] = (c, t) => { at(c, t, 1); c.__lock = 1; };
  LOOPS[name].len = LOOPS[name + '_lock'].len = WL; LOOPS[name + '_wake'].len = 2;
}
SHOTS.push({ a: 0, b: 1e9, draw(c, u, t) { const q = new URLSearchParams(location.search).get('loop'), L = window.LOOP || LOOPS[q] || Object.values(LOOPS)[0]; c.__lock = 0; L(c, t); LOCK = !!c.__lock; } });
POST.push(c => { if (LOCK) lockScreen(c); });

// ---------- shared bits ----------
function vgrad(c, stops) { const g = c.createLinearGradient(0, 0, 0, DH); for (const [y, col] of stops) g.addColorStop(y / DH, col); c.fillStyle = g; c.fillRect(-20, -20, DW + 40, DH + 40); }
function stars(c, t, n, seed, y1 = 1200, col = '#EAF0FF') {
  for (let i = 0; i < n; i++) { const x = hash(i * 1.37 + seed) * DW, y = hash(i * 2.71 + seed) * y1, k = .55 + .45 * lsin(t, 1 + Math.floor(hash(i * 4.4) * 3), hash(i * 6.6)), big = hash(i * 9.1 + seed) > .85;
    glow(c, x, y, (big ? 10 : 4) * k, col, .9 * k); if (big) { c.fillStyle = rgba(col, .8 * k); c.fillRect(x - 1, y - 10 * k, 2, 20 * k); c.fillRect(x - 10 * k, y - 1, 20 * k, 2); } }
}
function fireflies(c, t, n, seed, box, col = '#FFE9A0') {
  const [x0, y0, x1, y1] = box;
  for (let i = 0; i < n; i++) { const s = i * 2.3 + seed, x = lerp(x0, x1, hash(s)) + (40 + hash(s + 2) * 60) * lsin(t, 1, hash(s + 4)), y = lerp(y0, y1, hash(s + 1)) + (30 + hash(s + 3) * 50) * lsin(t, 2, hash(s + 5)), g = .5 + .5 * lsin(t, 2 + Math.floor(hash(s + 6) * 2), hash(s + 7));
    glow(c, x, y, 26 * g + 6, col, .8 * g); ellipse(c, x, y, 3, 3, rgba('#FFFBE0', .6 + .4 * g)); }
}
// a music note glyph, glowing (x, y the head), s its size
function note(c, x, y, s, col, a = 1) {
  if (a <= .01) return; c.save(); c.globalAlpha *= a;
  glow(c, x, y - s * .8, s * 2.2, col, .5);
  c.fillStyle = col; c.beginPath(); c.ellipse(x, y, s * .42, s * .3, -.4, 0, TAU); c.fill();
  c.fillRect(x + s * .3, y - s * 1.5, s * .12, s * 1.5);
  c.beginPath(); c.moveTo(x + s * .42, y - s * 1.5); c.quadraticCurveTo(x + s * .9, y - s * 1.2, x + s * .75, y - s * .7); c.lineWidth = s * .12; c.strokeStyle = col; c.stroke();
  c.restore();
}

// ================= Krishna's flute under the full moon =================
// Krishna in silhouette, waist up, playing his flute against a huge rising moon over the Yamuna mist; his peacock
// feather and dupatta stir in the night wind, notes rise from the flute, fireflies drift. Cinematic rim light on a
// flat Storybook-paper picture. wake: the moon brightens and the first notes rise
const KM = { ink: '#060A16' };
// a closed shape through smooth points
function spoly(c, P, col) { poly(c, through(P.concat([P[0], P[1]]), 8).slice(4, -4), col); }
function krishnaSil(c, t, o = {}) {
  const fw = o.feather ?? 0, dw = o.dupatta ?? 0, hw = o.hair ?? 0, col = KM.ink;
  // the dupatta, flowing out to the right behind him
  spoly(c, [[760, 1450], [830, 1500 + dw * 6], [900, 1600 + dw * 14], [960, 1740 + dw * 24], [1030, 1880 + dw * 34], [990, 1900 + dw * 30], [930, 1800 + dw * 20], [880, 1700 + dw * 10], [820, 1640], [790, 1560]], col);
  spoly(c, [[960, 1740 + dw * 24], [1020, 1800 + dw * 40], [1070, 1900 + dw * 50], [1040, 1910 + dw * 46], [1000, 1850 + dw * 34]], col);
  // the torso and shoulders, cropped by the bottom of the frame
  spoly(c, [[595, 1395], [520, 1430], [470, 1500], [466, 1640], [496, 1820], [486, 2000], [470, 2420], [830, 2420], [812, 2000], [800, 1820], [828, 1640], [826, 1500], [780, 1430], [700, 1395]], col);
  poly(c, [[600, 1330], [690, 1330], [705, 1420], [590, 1420]], col);   // the neck
  // hair falling to the shoulder behind, the bun
  limb(c, [[720, 1250], [760 + hw * 6, 1330], [775 + hw * 10, 1440]], [70, 52, 26], col);
  ellipse(c, 748, 1195, 52, 48, col);
  // the head and the profile, facing left
  ellipse(c, 655, 1262, 108, 112, col);
  spoly(c, [[610, 1165], [566, 1196], [552, 1234], [528, 1266], [547, 1280], [538, 1300], [552, 1326], [590, 1354], [640, 1362], [660, 1260]], col);
  // the mukut, the peacock feather on it
  spoly(c, [[566, 1200], [574, 1146], [608, 1112], [660, 1104], [702, 1124], [722, 1172], [700, 1200], [620, 1206]], col);
  c.save(); c.translate(668, 1118); c.rotate(.32 + fw * .08);
  spoly(c, [[-8, 0], [-26, -60], [-30, -130], [-14, -190], [6, -214], [26, -190], [36, -130], [26, -60], [8, 0]], col);   // a full plume, set in the crown
  for (let i = 0; i < 6; i++) { const yy = -60 - i * 24; for (const sd of [-1, 1]) limb(c, [[sd * 24, yy], [sd * 44, yy - 18]], [5, 1], col); }
  ellipse(c, 4, -168, 16, 24, rgba('#2FB0A8', .6), .05); ellipse(c, 4, -168, 8, 12, rgba('#1E3A8A', .95), .05);   // the feather's eye, faintly lit
  c.restore();
  // the flute across the moon, the arms rising to it, the hands on it
  limb(c, [[150, 1282], [640, 1312]], [15, 18], col);
  limb(c, [[480, 1495], [336, 1478], [318, 1312]], [62, 46, 36], col);   // the outer arm, its elbow down
  limb(c, [[548, 1450], [474, 1430], [456, 1316]], [54, 42, 34], col);   // the inner arm
  for (const [hx, hy] of [[318, 1294], [458, 1300]]) { ellipse(c, hx, hy, 34, 25, col); for (let f = 0; f < 3; f++) ellipse(c, hx - 18 + f * 17, hy - 22, 8, 13, col); }
  for (const [bx, by] of [[322, 1360], [460, 1362]]) ellipse(c, bx, by, 32, 9, col);   // bangles
}
wallM('krishna_moon', { bloom: .35, vignette: .45, grain: .05, paper: .55 }, (c, t, k) => {
  vgrad(c, [[0, '#050A1C'], [900, '#0E1A3A'], [1600, '#22365E'], [2340, '#31476E']]);
  stars(c, t, 60, 3, 1150);
  const mb = (.62 + .38 * kSeg(k, 0, .7)) * (.94 + .06 * lsin(t, 1));
  // the moon: a flat disc with soft craters, a wide glow
  glow(c, 600, 1380, 900, '#6E86C8', .45 * mb); glow(c, 600, 1380, 520, '#C9D6F5', .55 * mb);
  ellipse(c, 600, 1380, 300, 300, mixCol('#C9CFE0', '#F6F2E4', mb));
  for (const [a, b, r] of [[-110, -80, 60], [80, 60, 44], [30, -140, 30], [-60, 120, 36], [140, -40, 26]]) ellipse(c, 600 + a, 1380 + b, r, r * .88, rgba('#B8BDD0', .35));
  glow(c, 600, 1380, 340, '#FFFFFF', .2 * mb);
  // mist over the Yamuna, drifting a whole width a loop
  for (let i = 0; i < 6; i++) { const x = ((hash(i * 3.3) * (DW + 800) + t / WL * (DW + 800)) % (DW + 800)) - 400, y = 1900 + i * 70;
    glow(c, x, y, 380 + 80 * hash(i), '#9AB0DA', .16); }
  fireflies(c, t, 12, 5, [60, 1500, 1020, 2200]);
  // Krishna, lit from behind by the moon
  figure(c, f => krishnaSil(f, t, { feather: lsin(t, 1), dupatta: lsin(t, 2, .1), hair: lsin(t, 1, .3) }),
    { tint: ['#060A16', .0], edge: { col: '#DCE6FF', w: 2.6, a: .7 * mb }, rim: { col: '#F2F6FF', dx: -5, dy: -4, a: .85 * mb, blur: 1 } });
  // mist rising over him from the river: the silhouette fades into it
  { const g = c.createLinearGradient(0, 1820, 0, DH); g.addColorStop(0, 'rgba(60,84,130,0)'); g.addColorStop(1, 'rgba(70,96,146,.75)'); c.fillStyle = g; c.fillRect(0, 1820, DW, DH - 1820); }
  for (let i = 0; i < 5; i++) { const x = ((hash(i * 5.3) * (DW + 800) - t / WL * (DW + 800)) % (DW + 800) + DW + 800) % (DW + 800) - 400; glow(c, x, 2060 + i * 50, 420, '#9AB0DA', .14); }
  // notes rising from the flute's end, whole laps a loop
  const nk = kSeg(k, .35, .9);
  for (let i = 0; i < 6; i++) { const f = frac(hash(i * 2.9) + t / WL * (1 + i % 2)), x = 175 - f * 120 + Math.sin(f * TAU + i) * 30, y = 1300 - f * 520;
    note(c, x, y, 26 + 10 * hash(i), i % 2 ? '#FFE29A' : '#BFE6FF', Math.sin(Math.PI * f) * .9 * nk); }
});

// ================= Diwali night on the terrace =================
// Fireworks burst over a town strung with lights; on the terrace an anaar throws a fountain of gold sparks, a chakri
// spins on the floor, diyas line the parapet, and two children in silhouette watch, one drawing circles of light with a
// phuljhadi. Every spark is periodic, so the loop repeats. wake: the anaar catches, the chakri starts, a big burst
const sparkCol = ['#FFE7A0', '#FFD06A', '#FFF6DC'];
function burst(c, t, x, y, R, cols, n, per, ph, k = 1) {   // a firework: n stars flung out as streaks, drooping, fading; `per` bursts a loop
  const a = frac(t / WL * per + ph); if (a > .62) return;
  const e = easeOut(a / .45), fade = 1 - seg(a, .22, .62), drop = a * a * 300;
  if (a < .1) glow(c, x, y, R * .9, '#FFF6DC', (1 - a / .1) * .9 * k);
  glow(c, x, y + drop * .5, R * 1.1 * e, cols[0], .18 * fade * k);
  c.save(); c.globalCompositeOperation = 'lighter'; c.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const an = i / n * TAU + ph * 7 + hash(i) * .1, rr = R * (.8 + .35 * hash(i * 3.1 + ph)), r = rr * e, r0 = Math.max(0, r - rr * .35 * (1 - a));
    const px = x + Math.cos(an) * r, py = y + Math.sin(an) * r + drop, qx = x + Math.cos(an) * r0, qy = y + Math.sin(an) * r0 + drop * .7, col = cols[i % cols.length];
    c.strokeStyle = rgba(col, .75 * fade * k); c.lineWidth = 4; c.beginPath(); c.moveTo(qx, qy); c.lineTo(px, py); c.stroke();
    glow(c, px, py, 20, col, fade * k); ellipse(c, px, py, 4, 4, rgba('#FFFFFF', fade * k));
  }
  c.restore();
}
function anaar(c, t, x, y, k) {   // the clay flowerpot and its fountain
  const on = k;
  if (on > .01) {
    glow(c, x, y - 120, 520, '#FFB347', .45 * on); glow(c, x, y - 40, 240, '#FFE6A0', .5 * on);
    for (let i = 0; i < 140; i++) {
      const life = WL / (5 + (i % 3)), f = frac(hash(i * 1.7) + t / life), an = -Math.PI / 2 + (hash(i * 2.3) - .5) * .55, v = (1250 + 450 * hash(i * 3.9)) * on;
      const px = x + Math.cos(an) * v * f, py = y - 70 + Math.sin(an) * v * f + 1150 * f * f, a = (1 - f * .8) * on;
      glow(c, px, py, 12 + 10 * (1 - f), sparkCol[i % 3], .9 * a); ellipse(c, px, py, 3, 3, rgba('#FFFFFF', a));
    }
  }
  c.fillStyle = '#7A3A22'; c.beginPath(); c.moveTo(x - 46, y); c.lineTo(x - 22, y - 74); c.lineTo(x + 22, y - 74); c.lineTo(x + 46, y); c.closePath(); c.fill();
  ellipse(c, x, y - 74, 22, 7, '#3A1A10'); ellipse(c, x, y, 46, 10, '#5A2A18');
  c.fillStyle = 'rgba(255,200,120,.35)'; c.fillRect(x - 30, y - 50, 60, 6);
}
function chakri(c, t, x, y, k) {   // the ground spinner: a bright core, sparks thrown out along the spin
  const on = k, spin = t / WL * TAU * 12 * on;
  if (on < .01) { ellipse(c, x, y, 26, 9, '#3A2A1A'); return; }
  glow(c, x, y, 300, '#9AFF8A', .45 * on); glow(c, x, y, 110, '#FFFFFF', .8 * on);
  for (let i = 0; i < 80; i++) {
    const f = frac(hash(i * 4.3) + t / (WL / 6)), a0 = spin + i / 80 * TAU, r = 30 + f * 280, a = a0 - f * 1.6, py = y + Math.sin(a) * r * .32, px = x + Math.cos(a) * r;
    glow(c, px, py, 13, i % 2 ? '#B6FF8A' : '#FFE7A0', (1 - f) * on); ellipse(c, px, py, 2.4, 2.4, rgba('#FFFFFF', (1 - f) * on));
  }
  ellipse(c, x, y, 20, 8, '#FFFDF0');
}
function kid(c, x, y, s, o = {}) {   // a child in silhouette standing at (x, y), s ~ height; o.girl (a frock, a plait), o.arm [x, y] the raised hand
  const col = '#0C0812', hy = y - s * .84;
  for (const sd of [-1, 1]) { limb(c, [[x + sd * s * .06, y - s * .4], [x + sd * s * .07, y - s * .05]], [s * .075, s * .06], col); ellipse(c, x + sd * s * .08, y - s * .02, s * .06, s * .025, col); }   // the legs and feet
  spoly(c, [[x - s * .1, y - s * .7], [x - s * .12, y - s * .5], [x - s * .1, y - s * .38], [x + s * .1, y - s * .38], [x + s * .12, y - s * .5], [x + s * .1, y - s * .7]], col);   // the body
  if (o.girl) spoly(c, [[x - s * .11, y - s * .52], [x - s * .2, y - s * .3], [x + s * .2, y - s * .3], [x + s * .11, y - s * .52]], col);
  else poly(c, [[x - s * .11, y - s * .42], [x + s * .11, y - s * .42], [x + s * .12, y - s * .3], [x - s * .12, y - s * .3]], col);   // his shorts
  poly(c, [[x - s * .035, y - s * .76], [x + s * .035, y - s * .76], [x + s * .035, y - s * .68], [x - s * .035, y - s * .68]], col);   // the neck
  ellipse(c, x, hy, s * .105, s * .115, col);
  if (o.girl) { limb(c, [[x + s * .08, hy - s * .02], [x + s * .14, hy + s * .1], [x + s * .13, hy + s * .24]], [s * .05, s * .04, s * .025], col); ellipse(c, x + s * .13, hy + s * .25, s * .025, s * .02, col); }
  else ellipse(c, x - s * .02, hy - s * .07, s * .1, s * .06, col);   // his tuft of hair
  limb(c, [[x - s * .1, y - s * .68], [x - s * .14, y - s * .54], [x - s * .13, y - s * .42]], [s * .055, s * .05, s * .045], col);
  const [ax, ay] = o.arm || [x + s * .14, y - s * .42];
  limb(c, [[x + s * .1, y - s * .68], [lerp(x + s * .1, ax, .5) + s * .05, lerp(y - s * .68, ay, .5)], [ax, ay]], [s * .055, s * .05, s * .045], col);
  ellipse(c, ax, ay, s * .03, s * .03, col);
}
wallM('diwali_night', { bloom: .5, vignette: .35, grain: .05, paper: .45 }, (c, t, k) => {
  vgrad(c, [[0, '#07061A'], [900, '#1A1240'], [1500, '#3A1E52'], [1750, '#5A2A4A']]);
  stars(c, t, 40, 7, 1100);
  // fireworks, at their own phases, below the clock
  const big = kBump(k, .45, 1);
  burst(c, t, 300, 980, 230, ['#FF6A8A', '#FFD06A'], 44, 1, .05);
  burst(c, t, 790, 920, 270, ['#8AD8FF', '#FFFFFF'], 48, 1, .4);
  burst(c, t, 560, 1180, 180, ['#B6FF8A', '#FFE7A0'], 28, 2, .7);
  burst(c, t, 170, 1260, 140, ['#FFB347', '#FF6A8A'], 24, 1, .62);
  if (big > 0) burst(c, seg(k, .45, 1) * WL * .62, 540, 1000, 340, ['#FFE7A0', '#FF8AB0', '#8AD8FF'], 48, 1, 0, 1);
  // the town: rooftops with lit windows and strings of lights
  c.fillStyle = '#120C24';
  c.beginPath(); c.moveTo(-20, 1720); for (const [x, y] of [[-20, 1500], [120, 1500], [120, 1440], [260, 1440], [260, 1520], [380, 1520], [380, 1400], [470, 1360], [560, 1400], [560, 1500], [700, 1500], [700, 1450], [860, 1450], [860, 1520], [960, 1520], [960, 1420], [1100, 1420], [1100, 1720]]) c.lineTo(x, y); c.closePath(); c.fill();
  for (let i = 0; i < 26; i++) { const x = 20 + hash(i * 3.3) * 1040, y = 1530 + hash(i * 1.7) * 150, on = .6 + .4 * lsin(t, 1 + (i % 3), hash(i)); c.fillStyle = rgba('#FFCF6A', .85 * on); c.fillRect(x, y, 16, 22); glow(c, x + 8, y + 11, 26, '#FFB347', .3 * on); }
  for (let s2 = 0; s2 < 2; s2++) for (let i = 0; i <= 24; i++) { const f = i / 24, x = -20 + f * 1120, y = 1450 + s2 * 90 + Math.sin(f * Math.PI * 2 + s2) * 30, on = .55 + .45 * lsin(t, 3, i * .21 + s2 * .3);
    const col = ['#FFD06A', '#FF8AB0', '#8AD8FF', '#B6FF8A'][(i + s2) % 4]; glow(c, x, y, 18, col, .7 * on); ellipse(c, x, y, 4, 4, rgba('#FFFFFF', .8 * on)); }
  // the terrace: the parapet with diyas, the floor
  c.fillStyle = '#3A1E2E'; c.fillRect(-20, 1720, DW + 40, 60); c.fillStyle = '#4A2838'; c.fillRect(-20, 1712, DW + 40, 14);
  for (let i = 0; i < 9; i++) { const x = 60 + i * 120; sbDiya(c, x, 1714, .62, { fl: lsin(t, 5, i * .3) * .6 + lsin(t, 11, i * .7) * .4 }); }
  vgrad(c, [[0, 'rgba(0,0,0,0)']]);
  { const g = c.createLinearGradient(0, 1780, 0, DH); g.addColorStop(0, '#2A1626'); g.addColorStop(1, '#170A14'); c.fillStyle = g; c.fillRect(-20, 1780, DW + 40, DH - 1780); }
  // a rangoli on the floor, lit by the fountain
  for (let i = 0; i < 16; i++) { const a = i / 16 * TAU; ellipse(c, 560 + Math.cos(a) * 220, 2080 + Math.sin(a) * 44, 16, 8, rgba(['#F7A21B', '#E2476E', '#FFD23C'][i % 3], .8), a); }
  // the anaar and the chakri
  const ign = kSeg(k, .05, .4), spin = kSeg(k, .3, .7);
  anaar(c, t, 560, 2060, ign);
  chakri(c, t, 800, 2020, spin);
  // two children watching, lit by the fountain; the girl draws circles with her phuljhadi
  const sa = t / WL * TAU * 3, sx = 250 + Math.cos(sa) * 60, sy = 1560 + Math.sin(sa) * 60;
  figure(c, f => { kid(f, 210, 2060, 470, { girl: 1, arm: [sx - 8, sy + 26] }); kid(f, 360, 2070, 400, { arm: [400, 1780] }); }, LIGHTS.fire);
  for (let j = 0; j < 24; j++) { const a2 = sa - j * .09, tx = 250 + Math.cos(a2) * 60, ty = 1560 + Math.sin(a2) * 60; glow(c, tx, ty, 14, '#FFE7A0', .7 * (1 - j / 24)); }
  glow(c, sx, sy, 60, '#FFF6DC', .9);
  for (let i = 0; i < 12; i++) { const f = frac(hash(i * 2.1) + t / (WL / 8)), a3 = hash(i * 3.7) * TAU, px = sx + Math.cos(a3) * f * 60, py = sy + Math.sin(a3) * f * 60 + f * f * 40; glow(c, px, py, 7, '#FFF6DC', 1 - f); }
});

// ================= Radha and Krishna at the lotus pond =================
// Bal Radha and Bal Krishna, Storybook, holding hands on a big lily pad in a lotus pond at dawn; Cinematic soft light
// behind them, mist, their reflections in the water, petals drifting. wake: they turn to each other and smile
const swing = (t, A = 1.4, c0 = 30) => c0 + A * Math.sin(TAU * t / WL);
const blinkAt = (t, ...ats) => Math.max(0, ...ats.map(a => { const d = Math.abs(lmod(t - a + WL / 2) - WL / 2); return d < .08 ? 1 : d < .12 ? (.12 - d) / .04 : 0; }));
function rkPair(c, t, k) {
  const turn = kBump(k, .25, .95), hap = turn > .35;
  const kx = 350, rx = 730, gy = 1990, s = 1.05;
  sbKrishna(c, kx, gy, s, { t: swing(t, 1.2, 50), arm: 'none', feather: lsin(t, 1) * .6, blink: blinkAt(t, 1.4), happy: hap, mouth: hap ? 'grin' : 'smile', look: [turn > .1 ? .9 : .2, 0], tilt: .04 * turn });
  sbRadha(c, rx, gy, s, { t: swing(t, 1.2, 70), arm: 'none', odhni: lsin(t, 1, .2), blink: blinkAt(t, 3.6), happy: hap, mouth: hap ? 'grin' : 'smile', look: [turn > .1 ? -.9 : -.2, 0], tilt: -.05 * turn });
  // their hands, joined between them
  sbLimb(c, [kx + 100 * s, gy - 415 * s], [544, gy - 330 * s], 33 * s, SB_KRISHNA.skin);
  sbLimb(c, [rx - 95 * s, gy - 395 * s], [552, gy - 330 * s], 30 * s, SB_RADHA.skin);
  sbDry(c, [[rx - 150 * s, gy - 360 * s], [rx - 160 * s, gy - 330 * s]], 9, SB_RADHA.red, .9, 3, { n: 6 });
  sbEll(c, 556, gy - 328 * s, 30, 28, SB_RADHA.skin, { tex: false }); sbEll(c, 540, gy - 334 * s, 32, 30, SB_KRISHNA.skin, { tex: false });
}
wallM('radha_krishna', { bloom: .3, vignette: .25, grain: .03, paper: .55, boil: 10 }, (c, t, k) => {
  vgrad(c, [[0, '#4A3E7E'], [800, '#8A6AA8'], [1350, '#E89AB0'], [1700, '#FFD9B8']]);
  // the dawn glow behind them, soft rays
  glow(c, 540, 1560, 900, '#FFE2B8', .55); glow(c, 540, 1600, 420, '#FFF4DC', .5);
  c.save(); c.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 9; i++) { const a = -Math.PI / 2 + (i - 4) * .22 + lsin(t, 1, i * .1) * .02, len = 1200; const g = c.createLinearGradient(540, 1600, 540 + Math.cos(a) * len, 1600 + Math.sin(a) * len); g.addColorStop(0, 'rgba(255,240,210,.09)'); g.addColorStop(1, 'rgba(255,240,210,0)');
    c.fillStyle = g; c.beginPath(); c.moveTo(540, 1600); c.lineTo(540 + Math.cos(a - .05) * len, 1600 + Math.sin(a - .05) * len); c.lineTo(540 + Math.cos(a + .05) * len, 1600 + Math.sin(a + .05) * len); c.closePath(); c.fill(); }
  c.restore();
  // soft trees either side (kadamba), far and pale
  for (const [tx, ty, r, a] of [[60, 1380, 220, .55], [200, 1500, 170, .5], [1020, 1360, 230, .55], [880, 1500, 170, .5]]) { sbEll(c, tx, ty, r, r * .8, rgba('#7A5A9A', a), { tex: false }); for (let i = 0; i < 5; i++) sbDot(c, tx + (hash(i + tx) - .5) * r * 1.4, ty + (hash(i * 3 + tx) - .5) * r, 12, rgba('#FFC84A', .7)); }
  // the water: soft bands of light drifting, a whole width a loop
  { const g = c.createLinearGradient(0, 1720, 0, DH); g.addColorStop(0, '#C8A8D8'); g.addColorStop(.4, '#8A82C0'); g.addColorStop(1, '#4A4A8A'); c.fillStyle = g; c.fillRect(-20, 1720, DW + 40, DH - 1720); }
  for (let i = 0; i < 12; i++) { const y = 1740 + i * 50, x = ((hash(i * 2.3) * (DW + 400) + t / WL * (DW + 400) * (i % 2 ? 1 : -1)) % (DW + 400) + DW + 400) % (DW + 400) - 200; sbDry(c, [[x - 120, y], [x + 120, y + 2]], 6, '#FFFFFF', .25, 3, { n: 8 }); }
  // their reflections, flipped at the waterline, faint
  c.save(); c.beginPath(); c.rect(0, 1992, DW, DH); c.clip(); c.translate(0, 1992 * 2 + 10); c.scale(1, -1); c.globalAlpha = .28; rkPair(c, t, k); c.restore();
  // the lily pad they stand on, lotuses around
  sbEll(c, 545, 2000, 380, 62, '#5E9C6A', { shade: ['rgba(20,60,30,.25)', 1.57] }); sbEll(c, 545, 1992, 340, 48, '#7AB884', { tex: false, alpha: .7 });
  for (const [lx, ly, ks, ph] of [[120, 2110, .9, 0], [960, 2090, .85, .4], [260, 2230, .7, .7], [840, 2240, .7, .2], [60, 1880, .55, .5], [1010, 1860, .55, .9]]) {
    sbEll(c, lx, ly + 10, 110 * ks, 26 * ks, '#4E8A5A', { tex: false }); sbLotus(c, lx, ly + lsin(t, 2, ph) * 4, ks, { lotus: '#F29AB0', lotus2: '#FBD0DA' }); }
  rkPair(c, t, k);
  // petals drifting down, butterflies
  for (let i = 0; i < 14; i++) { const f = frac(hash(i * 3.1) + t / WL * (1 + i % 2)), x = hash(i * 1.7) * DW + Math.sin(f * TAU * 2 + i) * 40, y = 760 + f * 1500, sp = f * 10 + i;
    c.save(); c.translate(x, y); c.rotate(sp); c.scale(1, .5 + .5 * Math.abs(Math.cos(sp))); sbShape(c, sbPoly([[-14, 0], [-4, -8], [14, 0], [-4, 8]], { n: 4, jit: .4 }), i % 2 ? '#F29AB0' : '#FBD0DA', { tex: false }); c.restore(); }
  for (let i = 0; i < 2; i++) { const bx = 300 + i * 480 + lsin(t, 1, i * .5) * 90, by = 1250 + lsin(t, 2, i * .3) * 60, f = Math.abs(lsin(t, 12, i * .2));
    for (const sd of [-1, 1]) sbEll(c, bx + sd * 16 * (.3 + .7 * f), by, 16 * (.3 + .7 * f), 22, i ? '#FFF4DC' : '#F06A9A', { tex: false }); }
});
