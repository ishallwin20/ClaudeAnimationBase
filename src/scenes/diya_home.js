// diya_home.js: "Pass it on", a 20 s Diwali loop in the Cel style (flat fills, cel shade, navy ink, paper grain), drawn
// on twos (12 drawings a second). A grandmother's diya burns on the tulsi chaura in a village courtyard. Three sparks
// lift off its flame, become a wisp of light and fly over the night: the village, the fields, a river bridge with a
// train, the city. On a city balcony five unlit diyas wait on the parapet; the wisp lights them one by one and the young
// person inside looks up. A spark rises over the tower and bursts ("Happy Diwali"); one ember falls, all the way home,
// into her diya: frame 0 again.
//
// Sets are baked once (ptLayer, left unpainted: PT_RAW). Diyas, flames, sparks, the train and the glows are live.
CEL.fps = 12;
const TD = t => celHold(t, 12);          // everything moves on twos, like the hand-drawn reference
const INK = CEL.ink;
const PAL = {
  sky0: '#11152B', sky1: '#1B2140', sky2: '#262C50', star: '#FFF0C8',
  tree: '#2B5D6C', treeSh: '#1C4050', treeLt: '#3A7686',
  mud: '#7A4E3A', mudSh: '#64402F', geru: '#6A2C22', lime: '#CFC6B4', limeSh: '#A0977F', earth: '#4A3128',
  roof: '#6B3426', roofSh: '#4C2219', wood: '#4A2C20',
  tulsi: '#2F6A48', tulsiSh: '#1F4A33', stem: '#4A3446',
  clay: '#C4502A', claySh: '#8E3519', clayLt: '#E07444', oil: '#2E140C', deco: '#F3C77A',
  spark: '#FFEBA6', sparkGlow: '#FFC861', warm: '#FFB35A',
  conc: '#5A5D72', concSh: '#454759', concLt: '#6E7186', wall: '#363850', slab: '#676A7F',
};
const DUR_LOOP = 20;

// ---------- small helpers ----------
const dens = (P, step = 26) => { const out = []; for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length], n = Math.max(1, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / step)); for (let k = 0; k < n; k++) out.push(v2.lerp(a, b, k / n)); } return out; };
const rectP = (x0, y0, x1, y1) => dens([[x0, y0], [x1, y0], [x1, y1], [x0, y1]]);
const box = (c, x0, y0, x1, y1, fill, o = {}) => celShape(c, rectP(x0, y0, x1, y1), fill, { dense: true, w: 4.5, ...o });
const lin = (c, x0, y0, x1, y1, stops) => { const g = c.createLinearGradient(x0, y0, x1, y1); stops.forEach(([k, col]) => g.addColorStop(k, col)); return g; };
function stars(c, x0, y0, x1, y1, n, seed) {
  const R = lcg(seed);
  for (let i = 0; i < n; i++) {
    const x = lerp(x0, x1, R()), y = lerp(y0, y1, R()), r = .9 + R() * 2, a = .35 + R() * .6;
    c.fillStyle = rgba(PAL.star, a); c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
    if (R() < .08) { c.strokeStyle = rgba(PAL.star, a * .8); c.lineWidth = 1.6; c.beginPath(); c.moveTo(x - 9, y); c.lineTo(x + 9, y); c.moveTo(x, y - 9); c.lineTo(x, y + 9); c.stroke(); }
  }
}
// a leafy crown: a jagged blob (leaf lobes) with a cel shade and a few ink ticks inside, after the reference's trees
function crown(c, cx, cy, rx, ry, seed, o = {}) {
  const n = o.n || 36, P = [];
  for (let i = 0; i < n; i++) { const a = i / n * TAU, k = (i % 2 ? .84 : 1.03) + .1 * vnoise(i * .8, seed); P.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]); }
  celShape(c, P, o.fill || PAL.tree, { n: 3, shade: [o.sh || PAL.treeSh, 22, 30], lt: [o.lt || PAL.treeLt, 10, 14], w: 4.2 });
  const R = lcg(seed * 13 + 1);
  for (let i = 0; i < (o.ticks ?? 5); i++) {
    const x = cx + (R() - .5) * rx * 1.1, y = cy + (R() - .3) * ry * .9, s = 14 + R() * 12;
    celLine(c, [[x - s, y - s * .3], [x - s * .3, y + s * .2], [x + s * .2, y - s * .2], [x + s, y + s * .3]], 3.2);
  }
}
function frond(c, x, y, ang, len, droop, seed) {
  const sp = []; for (let i = 0; i <= 8; i++) { const u = i / 8, a = ang + droop * u * u; sp.push([x + Math.cos(ang) * len * u + Math.cos(a) * 0, y + Math.sin(ang) * len * u + droop * 260 * u * u]); }
  const L = [], R = [];
  for (let i = 0; i < sp.length; i++) {
    const a = sp[Math.max(0, i - 1)], b = sp[Math.min(sp.length - 1, i + 1)], d = v2.norm(v2.sub(b, a)), q = v2.perp(d), u = i / (sp.length - 1);
    const w = 46 * Math.sin(Math.PI * Math.min(1, u * 1.15 + .05)) * (i % 2 ? .55 : 1);
    L.push(v2.add(sp[i], v2.mul(q, w))); R.push(v2.sub(sp[i], v2.mul(q, w * .8)));
  }
  celShape(c, [...L, ...R.reverse()], PAL.tree, { n: 2, shade: [PAL.treeSh, 0, 14], w: 3.8 });
  celLine(c, sp, 3);
}
function textC(c, txt, x, y, size, col, a = 1, o = {}) {
  if (a <= .01) return;
  c.save(); c.globalAlpha = a; c.font = `700 ${size}px Kalam`; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.shadowColor = 'rgba(8,8,24,.85)'; c.shadowBlur = 18; c.shadowOffsetY = 4;
  c.lineJoin = 'round'; c.lineWidth = 9; c.strokeStyle = 'rgba(14,14,36,.9)'; c.strokeText(txt, x, y);
  c.shadowBlur = 0; c.shadowOffsetY = 0;
  if (o.glow) { c.shadowColor = o.glow; c.shadowBlur = 26; }
  c.fillStyle = col; c.fillText(txt, x, y); c.restore();
}

// ---------- the diya ----------
// (x, y): the bottom of its foot. s: scale (1 = 180 px wide). o.lit 0..1: how far its flame has grown; o.flare: a flash
// as it catches; o.seed: its own flicker.
function diya(c, x, y, s, o = {}) {
  const lit = o.lit ?? 0, seed = o.seed || 0;
  c.save(); c.translate(x, y); c.scale(s, s);
  ellipse(c, 0, 1, 96, 11, 'rgba(8,6,18,.5)');
  celShape(c, dens([[-24, -14], [24, -14], [34, 0], [-34, 0]], 12), PAL.claySh, { dense: true, w: 4 });   // the foot
  celOval(c, 0, -56, 88, 16, '#7E2F17', { w: 4 });                       // the lip, seen from the front
  celOval(c, 0, -55, 74, 10, PAL.oil, { ink: false });                    // the oil
  c.strokeStyle = 'rgba(255,214,140,.55)'; c.lineWidth = 3; c.beginPath(); c.ellipse(-12, -57, 34, 4, 0, Math.PI * 1.05, Math.PI * 1.6); c.stroke();
  celShape(c, [[-88, -56], [-82, -34], [-60, -16], [-24, -8], [0, -7], [24, -8], [60, -16], [82, -34], [88, -56], [46, -44], [0, -40], [-46, -44]], PAL.clay,
    { shade: [PAL.claySh, 12, 12], lt: [PAL.clayLt, 4, 10], w: 4.5, n: 5,
      over: (g) => {   // the painted band: cream dots between two ochre lines, and little petals
        g.strokeStyle = PAL.deco; g.lineWidth = 3;
        for (const yy of [-36, -20]) { g.beginPath(); g.moveTo(-90, yy); g.quadraticCurveTo(0, yy + 8, 90, yy); g.stroke(); }
        for (let i = -4; i <= 4; i++) { ellipse(g, i * 17, -27 + Math.abs(i) * -.6, 3.4, 3.4, PAL.deco); }
        if (lit > 0) { g.fillStyle = lin(g, 0, -60, 0, -8, [[0, `rgba(255,200,110,${.45 * lit})`], [1, 'rgba(255,200,110,0)']]); g.fillRect(-100, -70, 200, 70); }
      } });
  // the wick, resting on the front of the lip
  celLine(c, [[-6, -46], [0, -52], [3, -60]], 4.5);
  c.restore();
  if (lit > 0) flame(c, x + 3 * s, y - 60 * s, s, lit, o.flare || 0, seed);
}
// a flame standing on (x, y): an orange teardrop with a dark-red ink line, a yellow heart and a white-blue core
function flame(c, x, y, s, lit, flare, seed) {
  const d = CEL.d, f = hash(d * 1.7 + seed * 9.1), lean = (hash(d * 3.1 + seed * 5.3) - .5) * .3;
  const h = 84 * s * clamp(lit, 0, 1.4) * (1 + .55 * flare) * (.9 + .2 * f), w = h * .3 * (1 + .25 * flare);
  if (h < 3) return;
  glow(c, x, y - h * .4, (220 + 260 * flare) * s * clamp(lit), PAL.warm, (.34 + .4 * flare) * clamp(lit));
  const tip = [x + lean * h, y - h];
  const P = [[x, y + w * .35], [x - w, y - h * .2], [x - w * .78, y - h * .52], [x + lean * h * .45 - w * .28, y - h * .78], tip, [x + lean * h * .45 + w * .3, y - h * .74], [x + w * .8, y - h * .48], [x + w, y - h * .18]];
  const ink = CEL.ink; CEL.ink = '#7A2A12';
  celShape(c, P, '#F59A33', { n: 5, w: 3.2 * s + .6, boil: .7, shade: ['#E26A1E', 0, -10 * s] });
  CEL.ink = ink;
  const Q = P.map(([px, py]) => [x + (px - x) * .55, y + (py - y) * .62 + h * .02]);
  celShape(c, Q, '#FFDD72', { n: 5, ink: false, boil: .7 });
  ellipse(c, x, y - h * .08, w * .28, h * .12, '#FFF8DE');
  ellipse(c, x, y + w * .12, w * .3, h * .05, 'rgba(120,160,255,.7)');
}

// ---------- sparks and the wisp ----------
function sparkDot(c, x, y, r = 5.5, a = 1) {
  glow(c, x, y, r * 7, PAL.sparkGlow, .5 * a);
  c.save(); c.globalAlpha = a; ellipse(c, x, y, r, r * 1.15, PAL.spark); c.restore();
}
// three sparks circling a point, as they come off a flame
function sparks3(c, x, y, td, a, spread = 1) {
  for (let i = 0; i < 3; i++) { const g = td * 4.2 + i * TAU / 3; sparkDot(c, x + Math.cos(g) * 22 * spread, y + Math.sin(g) * 13 * spread - i * 5, 6.2, a); }
}
// a wisp of light: the path pos(s) sampled from s = t - len to t (clipped to [t0, t1]), with a squiggle across it that
// is fixed to the sample time, so the ribbon wiggles as it travels. After t1 the tail drains into the end point.
function wisp(c, pos, t, t0, t1, o = {}) {
  const len = o.len ?? .5, a = Math.max(t0, t - len), b = Math.min(t, t1); if (b <= a + .005) return;
  const n = 22, P = [];
  for (let i = 0; i <= n; i++) {
    const s = lerp(a, b, i / n), p = pos(s), p2 = pos(s + .015), q = v2.perp(v2.norm(v2.sub(p2, p)));
    const amp = (o.amp ?? 16) * Math.sin(Math.PI * clamp((s - (t - len)) / len)), off = Math.sin(s * (o.freq ?? 19)) * amp;
    P.push(v2.add(p, v2.mul(q, off)));
  }
  c.save(); c.globalCompositeOperation = 'lighter'; c.lineCap = 'round'; c.lineJoin = 'round';
  for (const [wk, col, al] of [[4.2, PAL.sparkGlow, .2], [1, PAL.spark, 1]]) {
    for (let i = 0; i < n; i++) { const k = (i + 1) / n; c.strokeStyle = rgba(col, al * (.4 + .6 * k)); c.lineWidth = (1.2 + 4.6 * k) * wk * (o.w ?? 1); c.beginPath(); c.moveTo(P[i][0], P[i][1]); c.lineTo(P[i + 1][0], P[i + 1][1]); c.stroke(); }
  }
  c.restore();
  if (t <= t1 + .02) { const h = P[n]; sparkDot(c, h[0], h[1], 5.5 * (o.w ?? 1), 1); }
}
// a burst of light: radial dashes flying out, then a ring of fading dots (u: 0..1 over its life)
function burst(c, x, y, u, R = 210) {
  if (u <= 0 || u >= 1) return;
  glow(c, x, y, 520, PAL.sparkGlow, .55 * Math.exp(-u * 5));
  c.save(); c.globalCompositeOperation = 'lighter'; c.strokeStyle = PAL.spark; c.lineCap = 'round';
  const e = easeOut(u), n = 14;
  for (let i = 0; i < n; i++) {
    const g = i / n * TAU + hash(i) * .2, r0 = R * (.15 + .75 * e) * (.8 + .4 * hash(i + 3)), r1 = r0 + R * .32 * (1 - u) * (i % 2 ? .6 : 1);
    if (u < .62) { c.globalAlpha = 1 - u * .8; c.lineWidth = 5 * (1 - u * .6); c.beginPath(); c.moveTo(x + Math.cos(g) * r0, y + Math.sin(g) * r0); c.lineTo(x + Math.cos(g) * r1, y + Math.sin(g) * r1 + u * 30); c.stroke(); }
    else { c.globalAlpha = (1 - u) * 2.4; const rr = r1 + 10; ellipse(c, x + Math.cos(g) * rr, y + Math.sin(g) * rr + u * 60, 3.4, 3.4, PAL.spark); }
  }
  c.restore();
}

// ---------- the village courtyard (world y -1500 .. 1920; the camera tilts up into the sky and back) ----------
const VD = { x: 540, y: 1152, s: 1.4 };       // the grandmother's diya, on the lip of the tulsi chaura
const VF = [VD.x + 3 * VD.s, VD.y - 60 * VD.s];            // its flame's base
function villageSet(c) {
  c.fillStyle = lin(c, 0, -1500, 0, 800, [[0, PAL.sky0], [.6, PAL.sky1], [1, PAL.sky2]]); c.fillRect(0, -1500, W, 3420);
  stars(c, 0, -1500, W, 560, 150, 4);
  // the coconut palm on the right, leaning in, its crown high above the roof
  const trunk = [[930, 800], [900, 300], [850, -300], [790, -860]];
  celShape(c, celTube(trunk, [70, 58, 48, 40]), '#3A3440', { dense: true, shade: ['#2A2532', 14, 0], w: 4.5 });
  for (let i = 1; i < 18; i++) { const p = through(trunk, 6)[Math.round(i / 18 * 18)]; if (p) celLine(c, [[p[0] - 22, p[1] + 4], [p[0], p[1] - 3], [p[0] + 22, p[1] + 4]], 2.6); }
  for (const [ang, len, dr] of [[-2.6, 400, .2], [-2.1, 380, -.4], [-1.6, 300, -.6], [-1.1, 380, -.3], [-.5, 420, .2], [.1, 380, .5], [-3.1, 360, .6], [2.9, 300, .6]]) frond(c, 790, -870, ang, len, dr, 1);
  ellipse(c, 790, -860, 40, 34, '#4A3A2E'); for (const [dx, dy] of [[-22, 14], [6, 22], [26, 6]]) celOval(c, 790 + dx, -850 + dy, 20, 22, '#5B6A3A', { w: 3 });
  // the neem on the left
  celShape(c, celTube([[150, 800], [130, 500], [90, 200], [40, -80]], [60, 46, 36, 24]), '#3A3440', { dense: true, shade: ['#2A2532', 12, 0], w: 4.5 });
  celLine(c, [[110, 260], [220, 120], [300, 40]], 14); celLine(c, [[110, 260], [220, 120], [300, 40]], 9, { col: '#3A3440' });
  for (const [x, y, rx, ry, sd] of [[20, -180, 230, 170, 2], [230, -40, 200, 150, 3], [-20, 160, 200, 160, 5], [250, 220, 170, 130, 6], [90, 40, 190, 150, 7], [340, 380, 140, 110, 8]]) crown(c, x, y, rx, ry, sd);
  // the roof: clay tiles in rows, a scalloped eave, the dark under it
  celShape(c, rectP(-40, 560, 1120, 770), PAL.roof, { dense: true, shade: [PAL.roofSh, 0, -26], w: 5 });
  c.strokeStyle = rgba('#2A120C', .7); c.lineWidth = 3;
  for (let x = -20; x < 1100; x += 36) { c.beginPath(); c.moveTo(x, 568); c.lineTo(x + 8, 760); c.stroke(); }
  for (const y of [620, 690]) { c.beginPath(); c.moveTo(-40, y); c.lineTo(1120, y + 6); c.stroke(); }
  for (let x = -20; x < 1100; x += 36) celOval(c, x + 22, 774, 16, 12, PAL.roofSh, { w: 3 });
  // the mud wall of the house, its geru dado and the lime line
  celShape(c, rectP(-40, 780, 1120, 1580), PAL.mud, { dense: true, w: 5 });
  c.fillStyle = lin(c, 0, 780, 0, 900, [[0, 'rgba(20,10,20,.55)'], [1, 'rgba(20,10,20,0)']]); c.fillRect(-40, 780, 1160, 120);
  const R = lcg(11); for (let i = 0; i < 9; i++) { const x = R() * 1000, y = 880 + R() * 480, P = []; for (let k = 0; k < 9; k++) { const a = k / 9 * TAU; P.push([x + Math.cos(a) * (40 + R() * 40), y + Math.sin(a) * (20 + R() * 26)]); } celShape(c, P, PAL.mudSh, { ink: false, n: 3 }); }
  celShape(c, rectP(-40, 1400, 1120, 1580), PAL.geru, { dense: true, w: 4.5 });
  c.strokeStyle = PAL.lime; c.lineWidth = 6; c.beginPath(); c.moveTo(-40, 1404); c.lineTo(1120, 1404); c.stroke();
  // the wall niche (aala) with a brass lota
  celShape(c, dens([[130, 1140], [130, 1040], [185, 990], [240, 1040], [240, 1140]], 18), '#3A2420', { dense: true, w: 4.5 });
  celShape(c, [[165, 1138], [158, 1100], [170, 1080], [178, 1066], [192, 1066], [200, 1080], [212, 1100], [205, 1138]], '#B7863A', { n: 4, shade: ['#7A5422', 8, 0], w: 3.5 });
  // the doorway, warm inside, with a mango-leaf toran, and her in it
  celShape(c, rectP(676, 850, 914, 1520), PAL.wood, { dense: true, w: 5 });
  celShape(c, rectP(700, 874, 890, 1500), '#E59A4A', { dense: true, w: 4, over: (g) => { g.fillStyle = lin(g, 0, 874, 0, 1500, [[0, '#F7C576'], [.6, '#E8994A'], [1, '#B8642E']]); g.fillRect(700, 874, 190, 626); } });
  grandmother(c, 812, 1500);
  for (let i = 0; i < 9; i++) { const x = 690 + i * 26, y = 884 + Math.sin(i / 8 * Math.PI) * 16; celShape(c, [[x - 7, y], [x + 7, y], [x + 3, y + 40], [x, y + 50], [x - 3, y + 40]], i % 2 ? '#3E7A3C' : '#4E8C42', { n: 3, w: 2.6 }); if (i % 2 === 0) celOval(c, x, y - 2, 7, 7, '#F28A1E', { w: 2.4 }); }
  celLine(c, [[676, 884], [795, 900], [914, 884]], 3);
  // the threshold and the courtyard floor
  celShape(c, rectP(690, 1500, 900, 1540), '#9C7A60', { dense: true, w: 4 });
  celShape(c, rectP(-40, 1580, 1120, 1960), PAL.earth, { dense: true, w: 4.5 });
  for (let i = 0; i < 14; i++) { const R2 = lcg(30 + i), x = R2() * 1080, y = 1620 + R2() * 280; ellipse(c, x, y, 26 + R2() * 40, 5 + R2() * 6, 'rgba(110,78,60,.35)'); }
  // marigold petals scattered by the chaura
  for (let i = 0; i < 16; i++) { const R3 = lcg(60 + i), x = 300 + R3() * 480, y = 1595 + R3() * 120; ellipse(c, x, y, 6, 4, i % 3 ? '#F2921E' : '#F6C23A', R3() * 3); }
  // night: everything below the sky falls off into a cool dark away from her diya
  c.save(); c.globalCompositeOperation = 'multiply';
  const g = c.createRadialGradient(540, 1060, 120, 540, 1060, 900); g.addColorStop(0, '#FFFFFF'); g.addColorStop(.45, '#B9B4C8'); g.addColorStop(1, '#5E6492');
  c.fillStyle = g; c.fillRect(-40, 560, 1160, 1420); c.restore();
  // the tulsi chaura: a whitewashed pedestal, an ochre border, a small arched niche
  celShape(c, rectP(320, 1500, 760, 1592), PAL.limeSh, { dense: true, w: 4.5, lt: [PAL.lime, 0, 10] });
  celShape(c, rectP(372, 1186, 708, 1500), PAL.lime, { dense: true, w: 4.5, shade: [PAL.limeSh, 26, 0] });
  c.strokeStyle = '#C7782E'; c.lineWidth = 5; c.strokeRect(400, 1214, 280, 262);
  for (let i = 0; i < 9; i++) ellipse(c, 412 + i * 32, 1232, 4, 4, '#B2402A');
  celShape(c, dens([[500, 1460], [500, 1360], [540, 1318], [580, 1360], [580, 1460]], 16), '#3B2A28', { dense: true, w: 4 });
  celShape(c, rectP(346, 1150, 734, 1190), PAL.lime, { dense: true, w: 4.5, shade: [PAL.limeSh, 0, 10] });
  ellipse(c, 540, 1150, 150, 12, '#2A1A16');
  tulsi(c, 540, 1150);
}
function grandmother(c, x, y) {   // a silhouette against the warm doorway: sari pallu over her head, a hand on the frame
  const S = '#2A1820';
  celShape(c, [[x - 52, y], [x - 44, y - 230], [x - 40, y - 330], [x - 26, y - 400], [x + 28, y - 400], [x + 44, y - 330], [x + 52, y - 230], [x + 62, y]], S, { n: 4, w: 4 });
  celShape(c, celTube([[x + 34, y - 380], [x + 70, y - 330], [x + 80, y - 280]], [30, 24, 20]), S, { dense: true, w: 4 });
  celShape(c, [[x - 44, y - 380], [x - 40, y - 450], [x - 20, y - 486], [x + 16, y - 488], [x + 40, y - 456], [x + 46, y - 400], [x + 30, y - 360], [x - 30, y - 352]], S, { n: 5, w: 4 });
  c.strokeStyle = 'rgba(255,190,110,.55)'; c.lineWidth = 3; c.beginPath(); c.moveTo(x + 44, y - 450); c.quadraticCurveTo(x + 50, y - 400, x + 44, y - 360); c.stroke();
}
function tulsi(c, x, y) {
  const st = [[[0, 0], [-4, -120], [-6, -250]], [[0, -60], [-60, -140], [-100, -190]], [[0, -70], [60, -150], [96, -200]], [[-3, -150], [-40, -230], [-60, -280]], [[-3, -150], [40, -235], [58, -290]]];
  for (const s of st) celLine(c, s.map(([a, b]) => [x + a, y + b]), 6, { under: PAL.stem });
  const R = lcg(77);
  for (const [cx, cy, n] of [[-6, -270, 9], [-100, -205, 8], [96, -215, 8], [-62, -295, 7], [58, -305, 7], [-50, -130, 6], [50, -140, 6], [0, -190, 7]]) {
    for (let i = 0; i < n; i++) {
      const a = i / n * TAU + R() * .4, r = 22 + R() * 16, lx = x + cx + Math.cos(a) * r, ly = y + cy + Math.sin(a) * r * .7;
      celOval(c, lx, ly, 15, 8, i % 3 ? PAL.tulsi : '#3C7E55', { rot: a, w: 2.6, shade: [PAL.tulsiSh, 0, 4] });
    }
    for (let k = -1; k <= 1; k++) { const sx = x + cx + k * 12, sy = y + cy - 26; celLine(c, [[sx, sy], [sx + k * 3, sy - 26]], 4, { under: '#7A4E6A' }); }
  }
}

// ---------- the journey: a long panorama the camera pans across (world x 0 .. 3600) ----------
const BX = 2500;   // how far the camera pans
const HORIZON = 1440;
function journeySky(c) {
  c.fillStyle = lin(c, 0, 0, 0, H, [[0, PAL.sky0], [.55, PAL.sky1], [.75, '#2E3358'], [1, '#2E3358']]); c.fillRect(0, 0, W, H);
  stars(c, 0, 0, W, 1150, 170, 8);
}
function journeyFar(c) {   // low hills, far away
  const P = [[-20, HORIZON + 40]]; for (let x = -20; x <= 2020; x += 60) P.push([x, HORIZON - 70 - 60 * (fbm(x / 400, 3) + .5)]); P.push([2020, HORIZON + 40]);
  celShape(c, P, '#24304C', { n: 2, w: 3.5, shade: ['#1D2740', 0, 20] });
}
function hut(c, x, y, w, lit) {
  celShape(c, rectP(x - w / 2, y - w * .55, x + w / 2, y), '#6E4A3A', { dense: true, w: 4, shade: ['#56392E', 14, 0] });
  celShape(c, [[x - w * .7, y - w * .5], [x, y - w * 1.15], [x + w * .7, y - w * .5], [x, y - w * .42]], '#7A6440', { n: 3, w: 4, shade: ['#5C4A30', 0, 16] });
  if (lit) { celShape(c, rectP(x - w * .12, y - w * .38, x + w * .12, y), '#F2AE5A', { dense: true, w: 3 }); }
}
function tower(c, x, y, w, h, seed) {
  celShape(c, rectP(x, y - h, x + w, y), '#2E3450', { dense: true, w: 4, shade: ['#252A42', 18, 0] });
  const R = lcg(seed), cols = Math.floor(w / 34), rows = Math.floor(h / 44);
  for (let r = 0; r < rows; r++) for (let k = 0; k < cols; k++) {
    const v = R(); if (v < .45) continue;
    c.fillStyle = v > .82 ? '#F6C978' : v > .7 ? '#C9D6F2' : '#E8A65A'; c.globalAlpha = .55 + .45 * R(); c.fillRect(x + 12 + k * 34, y - h + 18 + r * 44, 16, 22); c.globalAlpha = 1;
  }
  if (seed % 3 === 0) { c.fillStyle = '#FFD27A'; for (let yy = y - h + 8; yy < y; yy += 9) { c.globalAlpha = .8; c.fillRect(x + 3, yy, 4, 4); c.fillRect(x + w - 7, yy + 4, 4, 4); } c.globalAlpha = 1; }   // fairy lights down the edges
}
function journeyMid(c) {
  // ground
  celShape(c, rectP(-20, HORIZON, 3620, 1960), '#1E2638', { dense: true, w: 4 });
  // the village: huts with lit doorways, banana plants, a big tree
  for (const [x, w, lit] of [[150, 150, 1], [380, 120, 1], [560, 170, 0], [780, 130, 1]]) hut(c, x, HORIZON + 10, w, lit);
  for (const [x, y, rx, ry, sd] of [[660, HORIZON - 230, 140, 110, 21], [720, HORIZON - 330, 110, 90, 22], [40, HORIZON - 200, 120, 100, 23]]) crown(c, x, y, rx, ry, sd, { ticks: 3 });
  // the fields: bunds, a pond full of stars, a small temple with its lamp
  for (let i = 0; i < 6; i++) celLine(c, [[920 + i * 30, HORIZON + 40 + i * 70], [1700, HORIZON + 30 + i * 74]], 3, { col: '#141A2A' });
  celOval(c, 1250, HORIZON + 180, 200, 40, '#2C3A62', { w: 4 }); stars(c, 1080, HORIZON + 160, 1420, HORIZON + 200, 12, 5);
  celShape(c, [[1460, HORIZON], [1460, HORIZON - 110], [1490, HORIZON - 190], [1500, HORIZON - 240], [1510, HORIZON - 190], [1540, HORIZON - 110], [1540, HORIZON]], '#5A4A52', { n: 2, w: 4, shade: ['#433640', 10, 0] });
  celLine(c, [[1500, HORIZON - 240], [1500, HORIZON - 290]], 3); celShape(c, [[1500, HORIZON - 290], [1530, HORIZON - 280], [1500, HORIZON - 270]], '#E2552A', { n: 1, w: 2 });
  // the river and the railway bridge
  celShape(c, rectP(1720, HORIZON + 60, 2420, HORIZON + 210), '#2C3A62', { dense: true, w: 4 }); stars(c, 1730, HORIZON + 80, 2410, HORIZON + 200, 18, 6);
  celShape(c, rectP(1700, HORIZON - 120, 2440, HORIZON - 92), '#3B3F55', { dense: true, w: 4 });
  for (let i = 0; i < 4; i++) { const x0 = 1720 + i * 175; celLine(c, [[x0, HORIZON - 92], [x0 + 88, HORIZON - 190], [x0 + 175, HORIZON - 92]], 5); for (let k = 1; k < 4; k++) celLine(c, [[x0 + k * 44, HORIZON - 92], [x0 + k * 44, HORIZON - 92 - [0, 50, 98, 50][k]]], 3); }
  for (let i = 0; i <= 4; i++) celShape(c, rectP(1712 + i * 175, HORIZON - 92, 1734 + i * 175, HORIZON + 120), '#3B3F55', { dense: true, w: 3.5 });
  // the city
  const R = lcg(41); let x = 2460;
  while (x < 3600) { const w = 120 + R() * 110, h = 260 + R() * 520; tower(c, x, HORIZON + 10, w, h, Math.floor(R() * 1000)); x += w + 10 + R() * 30; }
}
function train(c, x, y) {   // a night train: dark coaches, a row of lit windows
  for (let k = 0; k < 6; k++) {
    const x0 = x + k * 148;
    celShape(c, rectP(x0, y - 62, x0 + 140, y), '#2B3A4E', { dense: true, w: 3.5 });
    for (let j = 0; j < 5; j++) { c.fillStyle = '#F7C978'; c.fillRect(x0 + 12 + j * 26, y - 48, 16, 16); }
  }
  celShape(c, [[x - 40, y], [x - 40, y - 52], [x - 10, y - 66], [x, y - 66], [x, y]], '#3C4E66', { n: 1, w: 3.5 });
  glow(c, x - 40, y - 30, 70, '#FFE7A0', .5);
}

// ---------- the city balcony (world y -1500 .. 1920: the roof and the sky above) ----------
const CD = [175, 385, 595, 805].map(x => ({ x, y: 1244, s: 1.05 }));
const LIGHT = [9.6, 10.35, 11.1, 11.85];
function floorBand(c, y0, ours) {   // one storey of the tower's balconies: slab, back wall, a door, the parapet
  celShape(c, rectP(-40, y0, 1120, y0 + 80), PAL.slab, { dense: true, w: 5, shade: ['#4E5064', 0, 22] });
  celShape(c, rectP(-40, y0 + 80, 1120, y0 + 542), PAL.wall, { dense: true, w: 4.5 });
  c.fillStyle = lin(c, 0, y0 + 80, 0, y0 + 170, [[0, 'rgba(10,10,24,.6)'], [1, 'rgba(10,10,24,0)']]); c.fillRect(-40, y0 + 80, 1160, 90);
  if (ours) {
    // the sliding door, warm inside: a curtain on the left pane, a sofa and the young one on it with a phone
    celShape(c, rectP(450, y0 + 120, 940, y0 + 542), '#22232E', { dense: true, w: 5 });
    celShape(c, rectP(470, y0 + 140, 920, y0 + 542), '#E8A55A', { dense: true, w: 3.5, over: (g) => { g.fillStyle = lin(g, 0, y0 + 140, 0, y0 + 542, [[0, '#F6C47A'], [.7, '#E39A4E'], [1, '#B86A34']]); g.fillRect(470, y0 + 140, 450, 402); g.fillStyle = 'rgba(255,240,210,.18)'; g.beginPath(); g.moveTo(560, y0 + 140); g.lineTo(640, y0 + 140); g.lineTo(520, y0 + 542); g.lineTo(440, y0 + 542); g.fill(); } });
    celShape(c, dens([[470, y0 + 140], [640, y0 + 140], [610, y0 + 300], [630, y0 + 542], [470, y0 + 542]], 24), '#7A3236', { dense: true, w: 4, shade: ['#5A2228', 16, 0] });
    for (const x of [505, 545, 585]) celLine(c, [[x, y0 + 150], [x - 6, y0 + 330], [x + 4, y0 + 530]], 3);
    celLine(c, [[695, y0 + 140], [695, y0 + 542]], 7);
    celShape(c, rectP(700, y0 + 400, 920, y0 + 542), '#5A3226', { dense: true, w: 4, lt: ['#6E4030', 0, 10] });
  } else {
    celShape(c, rectP(520, y0 + 140, 900, y0 + 542), '#22232E', { dense: true, w: 5 });
    celShape(c, rectP(540, y0 + 160, 880, y0 + 542), '#2C3046', { dense: true, w: 3.5 });
    celLine(c, [[710, y0 + 160], [710, y0 + 542]], 6);
  }
  // the AC unit on the left
  celShape(c, rectP(90, y0 + 260, 360, y0 + 470), '#6A6C7C', { dense: true, w: 4.5, shade: ['#545666', 14, 14] });
  celOval(c, 290, y0 + 365, 62, 62, '#3E4050', { w: 4 });
  for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; celLine(c, [[290, y0 + 365], [290 + Math.cos(a) * 54, y0 + 365 + Math.sin(a) * 54]], 2.4, { col: '#2A2B38' }); }
  for (let i = 0; i < 5; i++) celLine(c, [[110, y0 + 290 + i * 34], [200, y0 + 290 + i * 34]], 3, { col: '#55576A' });
  // the parapet: a ledge on top, its face below
  celShape(c, rectP(-40, y0 + 542, 1120, y0 + 572), PAL.concLt, { dense: true, w: 4.5 });
  celShape(c, rectP(-40, y0 + 572, 1120, y0 + 700), PAL.conc, { dense: true, w: 4.5, shade: [PAL.concSh, 0, -22] });
}
function citySet(c) {
  c.fillStyle = lin(c, 0, -2000, 0, 100, [[0, PAL.sky0], [1, PAL.sky2]]); c.fillRect(0, -2000, W, 2200);
  stars(c, 0, -2000, W, -300, 170, 9);
  // far towers behind the roof
  const R = lcg(55); let x = -20; while (x < 1100) { const w = 110 + R() * 90, h = 120 + R() * 300; tower(c, x, -60, w, h, Math.floor(R() * 999)); x += w + 18; }
  // the roof: a parapet, a water tank on legs, an antenna
  celShape(c, rectP(-40, -120, 1120, 0), PAL.conc, { dense: true, w: 5, shade: [PAL.concSh, 0, -20] });
  for (const lx of [720, 920]) celShape(c, rectP(lx, -330, lx + 22, -120), '#3A3C4C', { dense: true, w: 3.5 });
  celShape(c, dens([[690, -560], [950, -560], [950, -330], [690, -330]], 26), '#2F3240', { dense: true, w: 5, shade: ['#252836', 18, 0], lt: ['#3F4356', 0, 10] });
  for (const yy of [-500, -440, -380]) celLine(c, [[692, yy], [948, yy]], 2.6);
  celLine(c, [[240, -120], [240, -420]], 4); celLine(c, [[200, -380], [280, -380]], 3.4); celLine(c, [[210, -330], [270, -330]], 3.4);
  floorBand(c, 0, false);
  floorBand(c, 700, true);
  floorBand(c, 1400, false);
  // night: the facade falls off into a cool dark away from the balcony's diyas
  c.save(); c.globalCompositeOperation = 'multiply';
  const g = c.createRadialGradient(560, 1150, 160, 560, 1150, 1100); g.addColorStop(0, '#FFFFFF'); g.addColorStop(.5, '#B4B2CC'); g.addColorStop(1, '#5A6090');
  c.fillStyle = g; c.fillRect(-40, -130, 1160, 2100); c.restore();
}
// the young one inside, a silhouette on the sofa; look 0..1: the head lifts from the phone to the window
function youngOne(c, look) {
  const S = '#2C1A1C', x = 800, y = 1240, ink = 4;
  celShape(c, [[x - 70, y - 100], [x - 64, y - 200], [x - 40, y - 236], [x + 40, y - 236], [x + 64, y - 200], [x + 72, y - 100]], S, { n: 4, w: ink });
  const hx = x - 10 * (1 - look), hy = y - 270 + 14 * (1 - look);
  celOval(c, hx, hy, 36, 40, S, { w: ink, rot: -.2 * (1 - look) });
  c.strokeStyle = 'rgba(255,200,120,.5)'; c.lineWidth = 3; c.beginPath(); c.arc(hx, hy, 38, -1.2, .2); c.stroke();
  const px = x - 30, py = lerp(y - 196, y - 150, look);
  celShape(c, celTube([[x - 52, y - 200], [x - 60, y - 150], [px, py]], [24, 22, 18]), S, { dense: true, w: ink });
  glow(c, px, py - 20, 90, '#9FC4FF', .5 * (1 - .6 * look));
  celShape(c, rectP(px - 14, py - 28, px + 14, py), '#1A1E2C', { dense: true, w: 3 });
  c.fillStyle = rgba('#CFE2FF', .9 - .5 * look); c.fillRect(px - 10, py - 24, 20, 20);
}

// ---------- the timeline ----------
const T_UP = [2.0, 4.0], CAMV = -1250;                  // the village tilt up (and back down at the end)
const T_J = [4.0, 8.4];                                 // the journey
const T_C = [8.4, 17.0];                                // the balcony, the rise, the burst, the ember
const T_TILT = [13.7, 15.3], CAMC = -1750, T_BURST = 15.35, BURST_AT = [540, 700];
const T_HOME = [17.0, 18.6], T_LAND = 18.85;
const camVillage = t => t < 10 ? CAMV * Math.pow(seg(t, ...T_UP), 2) : CAMV * (1 - easeOut(seg(t, ...T_HOME)));
const camCity = t => CAMC * easeIO(seg(t, ...T_TILT));
// the paths, in screen px (world = screen + the camera)
const pRise = s => [540 + 30 * Math.sin(s * 2.3) + kf(s, [[.9, 0], [2, 30], [4, 20]]), kf(s, [[.9, VF[1] - 70], [2.0, 830], [4.0, 640]])];
const pJourney = s => { const p = kf(s, [[3.3, [560, 640]], [4.6, [420, 700]], [6.0, [600, 640]], [7.4, [720, 720]], [8.4, [900, 1180]]], x => x); return [p[0] + 30 * Math.sin(s * 2.1), p[1] + 40 * Math.sin(s * 1.6)]; };
const flameAt = i => [CD[i].x + 3 * CD[i].s, CD[i].y - 60 * CD[i].s];
const pCity = s => {
  if (s < LIGHT[0]) return kf(s, [[8.3, [1000, 180]], [8.9, [720, 600]], [9.3, [330, 900]], [LIGHT[0], flameAt(0)]], easeIO);
  for (let i = 0; i < LIGHT.length - 1; i++) if (s < LIGHT[i + 1]) {
    const u = seg(s, LIGHT[i], LIGHT[i + 1]), a = flameAt(i), b = flameAt(i + 1);
    return [lerp(a[0], b[0], ease(u)), lerp(a[1], b[1], u) - Math.sin(Math.PI * u) * 190];
  }
  return flameAt(LIGHT.length - 1);
};
const pUp = s => kf(s, [[13.1, [598, 1150]], [13.7, [520, 960]], [T_BURST, BURST_AT]], easeIO);
const pEmber = s => kf(s, [[T_BURST + .55, [560, 730]], [16.3, [330, 900]], [17.0, [470, 1980]]], easeIn);
const pHome = s => kf(s, [[16.95, [500, -60]], [17.6, [470, 420]], [18.2, [570, 760]], [18.6, [530, 960]], [T_LAND, [VF[0], VF[1] - 6]]], ease);

const withCam = (f, cam) => s => { const p = f(s); return [p[0], p[1] + cam(s)]; };

// shot 1 + shot 4: the village (the same set; the loop opens and closes here)
function villageShot(c, t) {
  const td = TD(t), cam = camVillage(td); celBegin(td);
  c.save(); c.translate(0, -cam);
  ptDraw(c, ptLayer('village', [0, -1500, W, 3420], villageSet));
  glow(c, 795, 1200, 420, '#FFB060', .14);                                   // the doorway's spill
  // her diya: it flares as the ember comes home, and gives off three sparks at the start
  const flare = td > T_LAND ? Math.exp(-(td - T_LAND) * 4.5) * seg(td, T_LAND, T_LAND + .05) * (1 - seg(td, 19.7, 19.9)) : 0;
  glow(c, VF[0], VF[1] + 40, 360, PAL.warm, .22 + .25 * flare);               // the warm pool on the chaura
  diya(c, VD.x, VD.y, VD.s, { lit: 1, flare, seed: 1 });
  if (td < 6) {
    const a = seg(td, .9, 1.2) * (1 - seg(td, 3.2, 3.6)), p = withCam(pRise, camVillage)(td);
    if (a > 0) sparks3(c, p[0], p[1], td, a, 1 - .7 * seg(td, 2.8, 3.6));
    wisp(c, withCam(pRise, camVillage), td, 3.3, 4.2, { len: .5 });
  } else {
    wisp(c, withCam(pHome, camVillage), td, 16.95, T_LAND, { len: .55 });
    if (td > T_LAND && td < T_LAND + .5) burstSmall(c, VF[0], VF[1] - 30, seg(td, T_LAND, T_LAND + .5));
  }
  c.restore();
  // the hook, up at frame 0, and back as the loop closes
  const capA = window.COVER ? 0 : (1 - seg(t, 2.5, 2.9)) + seg(t, 19.2, 19.6);
  textC(c, 'Far from home', 540, 450, 78, '#FFF1D6', clamp(capA));
  textC(c, 'this Diwali?', 540, 538, 78, '#FFD36A', clamp(capA), { glow: 'rgba(255,190,90,.6)' });
}
function burstSmall(c, x, y, u) {   // a flame catching: six little dashes
  c.save(); c.globalCompositeOperation = 'lighter'; c.strokeStyle = PAL.spark; c.lineCap = 'round'; c.lineWidth = 4 * (1 - u); c.globalAlpha = 1 - u;
  for (let i = 0; i < 6; i++) { const g = -Math.PI / 2 + (i - 2.5) * .5, r0 = 30 + 50 * easeOut(u), r1 = r0 + 26 * (1 - u); c.beginPath(); c.moveTo(x + Math.cos(g) * r0, y + Math.sin(g) * r0); c.lineTo(x + Math.cos(g) * r1, y + Math.sin(g) * r1); c.stroke(); }
  c.restore();
}
SHOTS.push({ a: 0, b: T_J[0], draw: (c, u, t) => villageShot(c, t) });
SHOTS.push({ a: T_HOME[0], b: DUR_LOOP, draw: (c, u, t) => villageShot(c, t) });

// shot 2: the journey
SHOTS.push({
  a: T_J[0], b: T_J[1], draw(c, u, t) {
    const td = TD(t), px = BX * easeIO(seg(td, T_J[0] - .4, T_J[1] + .2)) ; celBegin(td);
    ptDraw(c, ptLayer('jsky', [0, 0, W, H], journeySky));
    c.save(); c.translate(-px * .35, 0); ptDraw(c, ptLayer('jfar', [0, 0, 2040, H], journeyFar)); c.restore();
    c.save(); c.translate(-px, 0);
    ptDraw(c, ptLayer('jmid', [0, 0, 3640, H], journeyMid));
    for (const [x, y] of [[150, HORIZON - 20], [380, HORIZON - 15], [780, HORIZON - 15], [1500, HORIZON - 280]]) glow(c, x, y, 70, PAL.warm, .4 + .1 * hash(CEL.d + x));
    const tx = 2500 - 260 * (td - T_J[0]); c.save(); c.beginPath(); c.rect(1700, 0, 760, H); c.clip(); train(c, tx, HORIZON - 120); c.restore();
    c.restore();
    for (const [t0, x, y] of [[6.6, 860, 520], [7.3, 640, 420], [7.9, 900, 330]]) { const k = seg(td, t0, t0 + .7); if (k > 0 && k < 1) burst(c, x, y, k, 60); }
    wisp(c, pJourney, td, 3.3, 9, { len: .6, amp: 20 });
  }
});

// shot 3: the balcony, the five diyas, the rise, the burst, the ember falling home
SHOTS.push({
  a: T_C[0], b: T_C[1], draw(c, u, t) {
    const td = TD(t), cam = camCity(td); celBegin(td);
    c.save(); c.translate(0, -cam);
    ptDraw(c, ptLayer('city', [0, -2000, W, 3920], citySet));
    youngOne(c, ease(seg(td, 9.9, 10.5)));
    glow(c, 700, 1060, 460, '#FFB060', .12);
    CD.forEach((d, i) => {
      const L = LIGHT[i], lit = td < L ? 0 : backOut(seg(td, L, L + .35), 2), flare = td < L ? 0 : Math.exp(-(td - L) * 4);
      diya(c, d.x, d.y, d.s, { lit, flare, seed: i + 3 });
      if (td > L && td < L + .45) burstSmall(c, ...v2.add(flameAt(i), [0, -20]), seg(td, L, L + .45));
    });
    const lit = clamp((td - LIGHT[0]) / (LIGHT[3] - LIGHT[0] + .4));
    if (lit > 0) glow(c, 500, 1220, 620, PAL.warm, .16 * lit);                       // the parapet warming up
    wisp(c, pCity, td, 8.3, LIGHT[3], { len: .55 });
    wisp(c, withCam(pUp, camCity), td, 13.1, T_BURST, { len: .3, amp: 6, w: .8 });
    c.restore();
    burst(c, BURST_AT[0], BURST_AT[1], seg(td, T_BURST, T_BURST + .85), 320);
    burst(c, BURST_AT[0], BURST_AT[1], seg(td, T_BURST + .12, T_BURST + .8), 170);
    wisp(c, pEmber, td, T_BURST + .55, 17.2, { len: .45 });
    textC(c, 'Her diya still finds you.', 540, 560, 70, '#FFF1D6', seg(t, 10.15, 10.45) * (1 - seg(t, 13.5, 13.8)));
    textC(c, 'Happy Diwali', 540, 990, 104, '#FFD36A', seg(t, T_BURST + .1, T_BURST + .35) * (1 - seg(t, 16.75, 17.0)), { glow: 'rgba(255,190,90,.7)' });
  }
});

// the watermark, on every frame: the Rishi Katha logo and handle, small, low in the safe band
POST.push((c) => {
  c.save(); c.globalAlpha = .78;
  picture(c, PICS.logo, 96, 1452, 68, 68);
  c.font = '600 27px Poppins'; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillStyle = '#FBE0CF';
  c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 8; c.fillText('@therishikatha', 140, 1453);
  c.restore();
});
LOOK.bloom = .22; LOOK.vignette = .3; LOOK.grain = .07;
