// jatayu_props.js: the sets and props of the Jatayu reel (src/scenes/jatayu.js): skies by mood, Ravana's whole rig in
// the air (the mules, the gold chariot, the charioteer, Ravana holding Sita), arrows, the bow's halves and its pearls,
// the torn arms, falling feathers, the anklet's spark, Jatayu's spirit in light.

// ---------- skies ----------
const SKY = {
  dusk: (c) => { sky(c, [[0, '#120818'], [600, '#3A1530'], [1150, '#93312A'], [1500, '#E0703A'], [1920, '#3A1418']]); glow(c, 720, 1380, 760, '#FF8A3A', .45); },
  violet: (c) => { sky(c, [[0, '#0C0A1E'], [700, '#2A1C44'], [1250, '#7A3A5A'], [1600, '#D07A5A'], [1920, '#2A1424']]); glow(c, 760, 1420, 640, '#FFA060', .35); },
  storm: (c, fl = 0) => { sky(c, [[0, '#0E0308'], [600, '#3A0A12'], [1200, '#8A1E16'], [1650, '#D0461E'], [1920, '#4A1008']]); glow(c, 540, 1650, 1000, '#FF5A1E', .42); if (fl) flash(c, fl * .25, '#FFB08A'); },
  night: (c) => { sky(c, [[0, '#04060E'], [800, '#0C1428'], [1500, '#1C2846'], [1920, '#0A0E1A']]); },
  pale: (c) => { sky(c, [[0, '#2A2630'], [700, '#6A5E66'], [1300, '#A8968C'], [1920, '#4A3E40']]); glow(c, 540, 700, 700, '#FFF0E0', .25); },
  dawn: (c) => { sky(c, [[0, '#1E1434'], [560, '#5E2E4E'], [1000, '#C9663D'], [1380, '#FFCF86'], [1600, '#FFE2A8'], [1920, '#3A2030']]); },
};
const STORM_FX = { tint: ['#2A0A10', .2], edge: { col: '#FF9A6A', w: 2.4, a: .7 }, rim: { col: '#FFB08A', dx: 0, dy: -5, a: .8, blur: 1 } };
const SIL_FX = (a = .88) => ({ tint: ['#140810', a], edge: { col: '#FF9A6A', w: 2.4, a: .8 }, rim: { col: '#FFC09A', dx: 0, dy: -5, a: .85, blur: 1 } });
const DUSK_FX = { tint: ['#2A0A18', .14], edge: { col: '#FFC890', w: 2.4, a: .6 }, rim: { col: '#FFE0B0', dx: 7, dy: -3, a: .85, blur: 1 } };
const NIGHT_FX = { ...LIGHTS.moon, grade: null };

// ---------- Ravana's rig: the two mules ahead, the chariot, the charioteer, Ravana holding Sita ----------
// In rig units: the chariot's floor at (0, 0), the mules ahead from x 760. o: t, mules ('alive' | 'dead' | false),
// broken (0..1), driver, sita (true), expr / exprs, frontL, reach, glow, rv (extra ravana() options).
function rig(c, o = {}) {
  const t = o.t || 0, br = o.broken || 0;
  if (o.mules !== false) for (const [dx, dy, ph] of [[1240, -40, .3], [1060, 10, 0]]) {
    c.save(); c.translate(dx + br * 200, dy + br * br * 900); c.rotate(br * 1.2); c.scale(.95, .95); rvMule(c, { t, gallop: t * 2.2 + ph, dead: o.mules === 'dead' || br > .05 }); c.restore();
  }
  c.save(); c.translate(br * -60, br * br * 300); c.rotate(-br * .25);
  ravanaChariot(c, { t, layer: 'back', driver: o.driver !== false && br < .05, glow: o.glow ?? .8 });
  c.save(); c.translate(-60, -30); c.scale(.72, .72);
  ravana(c, { t, frontR: o.sita !== false ? 'carry' : null, frontL: o.frontL || 'fist', expr: o.expr || 'laugh', exprs: o.exprs, ...o.rv });
  if (o.sita !== false) { c.save(); c.translate(340, 30); c.scale(.82, .82); sita(c, { t, pose: 'carried', reach: o.reach ?? 1, wind: .9, tears: .5 }); c.restore(); rvCarryArm(c, { t, hold: [300, -470] }); }
  c.restore();
  ravanaChariot(c, { t, layer: 'front', spin: t * 3 });
  c.restore();
  // the charioteer, struck from the prow, falling away
  if (br > .05) { c.save(); c.translate(380 + br * 300, -330 + br * br * 1400); c.rotate(br * 3); ellipse(c, 0, 0, 54, 80, '#1C1216'); ellipse(c, 20, -100, 36, 40, '#1C1216'); c.restore(); }
}

// ---------- arrows, the bow, the arms ----------
function arrow(c, x, y, a, len, col = '#1A0E0C', glowA = 0) {
  c.save(); c.translate(x, y); c.rotate(a);
  if (glowA) glow(c, len * .5, 0, len * .5, '#FFB060', glowA);
  strokePath(c, `M ${-len} 0 L 0 0`, col, 4);
  fillPath(c, 'M 0 -7 L 26 0 L 0 7 Z', col);
  for (const s of [-1, 1]) fillPath(c, `M ${-len} 0 L ${-len + 30} 0 L ${-len + 10} ${s * 12} Z`, col);
  c.restore();
}
// a volley: n arrows from (x0, y0) toward (x1, y1) from time t0, each its own spread and speed
function volley(c, t, t0, n, x0, y0, x1, y1, seed = 1, k = 1) {
  for (let i = 0; i < n; i++) {
    const st = t0 + hash(i * 3.1 + seed) * 1.6, u = (t - st) / .55; if (u < 0 || u > 1.2) continue;
    const ex = x1 + (hash(i * 7.7 + seed) - .5) * 700, ey = y1 + (hash(i * 5.3 + seed) - .5) * 600;
    const x = lerp(x0, ex, u), y = lerp(y0, ey, u), a = Math.atan2(ey - y0, ex - x0);
    arrow(c, x, y, a, 110 * k, '#140A08', .25);
  }
}
// one of the bow's halves, flying: the gem bow cut at its grip
function bowHalf(c, x, y, rot, k, upper) {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(k, upper ? k : -k);
  strokePath(c, 'M 0 0 C 30 -40 60 -90 0 -150', RV.goldSh, 11); strokePath(c, 'M 0 0 C 28 -40 56 -90 0 -150', RV.gold, 6);
  for (let i = 1; i <= 4; i++) { const u = i / 5; ellipse(c, 3 * (1 - u) * u * 2 * 55 * .9, -150 * u, 5, 5, i % 2 ? RV.ruby : '#F3EBD8'); }
  strokePath(c, 'M 0 -150 L -10 -60', rgba('#E8DCC0', .7), 1.5);
  c.restore();
}
// pearls and gems scattering from (x, y) since t0
function scatter(c, x, y, t, t0, n, seed = 3, k = 1) {
  const u = t - t0; if (u < 0) return;
  for (let i = 0; i < n; i++) {
    const a = hash(i * 2.3 + seed) * TAU, v = 300 + hash(i * 4.1 + seed) * 600, px = x + Math.cos(a) * v * u * k, py = y + Math.sin(a) * v * u * k + 700 * u * u * k;
    ellipse(c, px, py, 7 * k, 7 * k, i % 3 ? '#F3EBD8' : RV.ruby); glow(c, px, py, 20 * k, '#FFE8C0', .3 * Math.max(0, 1 - u));
  }
}
// a torn arm, flying off and tumbling (a silhouette, in Ravana's units: about 470 long)
function looseArm(c, x, y, rot, k, col = '#140810') {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(k, k);
  limb(c, [[0, 0], [10, -230], [40, -460]], [60, 46, 34], col); ellipse(c, 46, -486, 24, 28, col);
  c.restore();
}
// feathers drifting down since t0 (slow motion), over a box
function featherFall(c, t, t0, n, box, seed = 5, k = 1, col) {
  const u = t - t0; if (u < 0) return;
  for (let i = 0; i < n; i++) {
    const x0 = lerp(box[0], box[2], hash(i * 1.9 + seed)), y0 = lerp(box[1], box[3], hash(i * 3.7 + seed)) - 200, v = 60 + hash(i * 5.1 + seed) * 90;
    const y = y0 + v * u, x = x0 + Math.sin(u * 1.6 + i) * 40, r = Math.sin(u * 1.3 + i * 2) * .9;
    feather(c, x, y, k * (.35 + hash(i * 6.3 + seed) * .4), r, col);
  }
}
// the gold anklet falling as a spark from (x0, y0) since t0, with a trail
function anklet(c, t, t0, x0, y0) {
  const u = t - t0; if (u < 0 || u > 2.2) return;
  for (let j = 6; j >= 0; j--) { const v = Math.max(0, u - j * .04), x = x0 - v * 80, y = y0 + 300 * v * v + 120 * v; glow(c, x, y, 26 - j * 3, '#FFD070', .5 * (1 - j / 7)); }
  const x = x0 - u * 80, y = y0 + 300 * u * u + 120 * u;
  c.strokeStyle = '#FFE6A0'; c.lineWidth = 3; c.beginPath(); c.ellipse(x, y, 12, 7, u * 6, 0, TAU); c.stroke();
}
// rocks on the ground (the fallen bird lies on them)
function rocks(c, y, seed, col = '#0C0E18', lit = '#5A6A9A') {
  for (let i = 0; i < 7; i++) {
    const x = hash(i * 2.7 + seed) * 1300 - 110, w = 160 + hash(i * 1.3 + seed) * 260, h = 60 + hash(i * 3.9 + seed) * 90;
    fillPath(c, `M ${x - w / 2} ${y + 40} C ${x - w * .4} ${y - h} ${x + w * .3} ${y - h * 1.1} ${x + w / 2} ${y + 40} Z`, col);
    strokePath(c, `M ${x - w * .3} ${y - h * .6} C ${x - w * .1} ${y - h * .95} ${x + w * .2} ${y - h} ${x + w * .35} ${y - h * .6}`, rgba(lit, .5), 3);
  }
  fillPath(c, `M -200 ${y + 30} L 1300 ${y + 30} L 1300 2200 L -200 2200 Z`, col);
}
