// durgama_props.js: props for ad 19, the Durgama story (src/scenes/durgama.js), that only this reel uses.
//   DURGAMA_PAL                      Durgama on the arunasura() rig: ash-grey skin, ember eyes, a blood-red dhoti
//   mantraFlow(c, t, o)              Devanagari letters of light flying from sources to a target (the Vedas taken, given back)
//   deadTree(c, x, y, k, col)        a bare, forked tree on cracked land
//   rain(c, t, o)                    streaks of rain catching the light
//   eyeAura(c, x, y, R, t, o)        Shatakshi's aura: rings of eyes opening one by one, weeping
//   produce(c, x, y, k, t)           grain, greens and fruit heaped in an open hand (Shakambhari)
//   sprouts(c, x0, x1, y, k, grow)   green shoots coming up along the ground
//   army(c, y, x0, x1, k, t, seed)   rows of soldiers: helmets, spears, shields, banners (one colour)
//   ringOfLight(c, x, y, r, t, a)    the luminous circle she put round the gods and the rishis
//   shakti(c, o)                     a small goddess silhouette, flying or standing, many-armed, with weapons
//   archer(c, o)                     Durga in side view facing right drawing a great bow (a silhouette); archerNock()
//   arrowLight(c, x0, y0, x1, y1, a) an arrow of light (a streak with a hot head)
//   banner(c, x, y, k, t, o)         Durgama's war flag on a tall pole
const DURGAMA_PAL = { skin: '#4A4246', skinSh: '#322C30', skinDk: '#1C181B', eye: '#FF5A2A', eyeHot: '#FFD0A0', dhoti: '#5A1418', dhotiSh: '#320A0E', helm: '#141014' };

// ---------- the Vedas, taken and given back ----------
const GLYPHS = ['ॐ', 'अ', 'ग्नि', 'मी', 'ळे', 'पु', 'रो', 'हि', 'तं', 'य', 'ज्ञ', 'स्य', 'दे', 'व', 'मृ', 'त्वि', 'जं', 'हो', 'ता', 'रं', 'र', 'त्न', 'धा', 'त', 'मम्'];
// o: from ([[x, y], ...] sources), to ([x, y]), n, t0 (the first leaves), dur (the stream lasts), fly (seconds each), size,
// arc (how far they bow out), seed, a. Letters leave their source in turn, swing along a curve and fade into the target.
function mantraFlow(c, t, o) {
  const n = o.n || 40, fly = o.fly || 1.6, size = o.size || 44, rnd = lcg(o.seed || 3);
  c.save(); c.textAlign = 'center'; c.textBaseline = 'middle';
  for (let i = 0; i < n; i++) {
    const src = o.from[i % o.from.length], t1 = o.t0 + rnd() * o.dur, side = rnd() - .5, sz = size * (.6 + rnd() * .7), g = GLYPHS[Math.floor(rnd() * GLYPHS.length)];
    const u = (t - t1) / fly; if (u < 0 || u > 1) continue;
    const e = ease(u), mx = (src[0] + o.to[0]) / 2 + side * (o.arc ?? 500), my = Math.min(src[1], o.to[1]) - 200 - rnd() * 300;
    const x = (1 - e) * (1 - e) * src[0] + 2 * (1 - e) * e * mx + e * e * o.to[0], y = (1 - e) * (1 - e) * src[1] + 2 * (1 - e) * e * my + e * e * o.to[1];
    const a = (o.a ?? 1) * Math.min(1, u * 5) * (1 - Math.pow(u, 4)), k = 1 - .5 * e;
    c.font = `${Math.round(sz * k)}px "Tiro Devanagari Sanskrit"`; c.globalAlpha = a;
    c.shadowColor = 'rgba(255,170,60,.95)'; c.shadowBlur = 22; c.fillStyle = '#FFE6A8'; c.fillText(g, x, y);
  }
  c.restore();
}

// ---------- the drought ----------
function deadTree(c, x, y, k, col) {
  c.save(); c.translate(x, y); c.scale(k, k);
  const br = (x0, y0, ang, len, w, d) => {
    const x1 = x0 + Math.cos(ang) * len, y1 = y0 + Math.sin(ang) * len;
    limb(c, [[x0, y0], [(x0 + x1) / 2 + Math.sin(d * 3.1) * 8, (y0 + y1) / 2], [x1, y1]], [w, w * .8, w * .55], col);
    if (d < 4) { br(x1, y1, ang - .45 - hash(d * 7 + x0) * .2, len * .7, w * .62, d + 1); br(x1, y1, ang + .4 + hash(d * 3 + y0) * .25, len * .66, w * .58, d + 1); }
  };
  br(0, 0, -Math.PI / 2 - .05, 260, 46, 0);
  fillPath(c, 'M -60 0 C -30 -20 30 -20 70 0 Z', col);
  c.restore();
}
// o: n, seed, a, len (streak length), vx, vy (px/s), col, box [x0, y0, x1, y1]
function rain(c, t, o = {}) {
  const [x0, y0, x1, y1] = o.box || [-100, -100, W + 100, H], w = x1 - x0, h = y1 - y0, n = o.n || 260, vy = o.vy || 2400, vx = o.vx || -300, len = o.len || 90;
  c.save(); c.globalCompositeOperation = 'lighter'; c.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const s = i * 1.91 + (o.seed || 0), sp = .7 + .6 * hash(s + 2);
    const x = x0 + ((hash(s) * w + vx * t * sp) % w + w) % w, y = y0 + ((hash(s + 1) * h + vy * t * sp) % h + h) % h, L = len * sp;
    c.strokeStyle = rgba(o.col || '#CFE4FF', (o.a ?? .5) * (.4 + .6 * hash(s + 5))); c.lineWidth = 1.2 + 1.6 * hash(s + 7);
    c.beginPath(); c.moveTo(x, y); c.lineTo(x - vx / vy * L, y - L); c.stroke();
  }
  c.restore();
}

// ---------- Shatakshi ----------
// Rings of eyes round (x, y), R the outer radius. o: rings (4), open (t → 0..1 for eye i of N: default each opens
// in turn from o.t0 over o.dur), tears (0..1 drops falling from them), gold (the glow), seed, a.
function eyeAura(c, x, y, R, t, o = {}) {
  const rings = o.rings || 4, eyes = [];
  for (let r = 0; r < rings; r++) { const rr = R * (.42 + .58 * r / (rings - 1)), n = 8 + r * 6; for (let i = 0; i < n; i++) eyes.push([rr, (i + (r % 2) * .5) / n * TAU - Math.PI / 2, .7 + .3 * r / (rings - 1)]); }
  const N = eyes.length, order = eyes.map((_, i) => i).sort((a, b) => hash(a * 3.3 + 1) - hash(b * 3.3 + 1));
  const rank = []; order.forEach((e, k) => rank[e] = k);
  c.save(); c.globalAlpha *= o.a ?? 1;
  eyes.forEach(([rr, ang, sz], i) => {
    const op = o.open ? o.open(i, N) : ease(seg(t, o.t0 + rank[i] / N * o.dur, o.t0 + rank[i] / N * o.dur + .35));
    const ex = x + Math.cos(ang + Math.sin(t * .1) * .02) * rr, ey = y + Math.sin(ang + Math.sin(t * .1) * .02) * rr * .92, s = 30 * sz * (o.k || 1);
    glow(c, ex, ey, s * 3, o.gold || '#FFC870', .28 * op);
    c.save(); c.translate(ex, ey);
    const up = lerp(.05, 1, op);
    const shape = `M ${-s} 0 Q 0 ${-s * .78 * up} ${s} 0 Q 0 ${s * .5 * up} ${-s} 0 Z`;
    fillPath(c, shape, rgba('#FFF4DC', .25 + .7 * op));
    if (op > .05) inside(c, shape, () => { ellipse(c, 0, s * .05, s * .38, s * .38, '#3A1E10'); ellipse(c, 0, s * .05, s * .17, s * .17, '#0A0604'); ellipse(c, s * .12, -s * .08, s * .07, s * .07, '#FFFFFF'); });
    strokePath(c, `M ${-s * 1.08} ${s * .04} Q 0 ${-s * .8 * up - 2} ${s * 1.08} ${s * .04}`, '#FFD890', 2.4);
    strokePath(c, `M ${-s} 0 Q 0 ${s * .5 * up + 1} ${s} 0`, rgba('#FFD890', .6), 1.4);
    c.restore();
    if (o.tears && op > .5) for (let k = 0; k < 2; k++) {
      const u = frac(t * (.55 + hash(i) * .3) + hash(i * 7 + k) + k * .5), dy = u * u * R * .9;
      const a = o.tears * (1 - u) * .9; ellipse(c, ex, ey + s * .5 + dy, 2.6 * sz, 4.2 * sz, rgba('#DDEEFF', a)); glow(c, ex, ey + s * .5 + dy, 12, '#BFE0FF', .4 * a);
    }
  });
  c.restore();
}

// ---------- Shakambhari ----------
// In an open hand at (x, y) (the top of the palm): a heap of grain, greens and fruit. k scale.
function produce(c, x, y, k, t) {
  c.save(); c.translate(x, y); c.scale(k, k);
  for (let i = 0; i < 7; i++) { const a = -1.3 + i * .43; c.save(); c.rotate(a * .5); fillPath(c, 'M 0 0 C -18 -30 -14 -80 4 -110 C 18 -80 18 -30 0 0 Z', i % 2 ? '#3E8A3A' : '#5AA845'); strokePath(c, 'M 2 -6 L 3 -100', '#2C6A2A', 2); c.restore(); }
  for (let i = 0; i < 9; i++) { const a = -.5 + i * .12; c.save(); c.rotate(a); strokePath(c, 'M 0 0 L 0 -120', '#C9A04A', 2.4); for (let j = 0; j < 5; j++) ellipse(c, (j % 2 ? 4 : -4), -84 - j * 8, 4, 7, '#E8C060'); c.restore(); }
  ellipse(c, -26, -22, 20, 17, '#F2A93A'); ellipse(c, -30, -27, 6, 4, '#FFD27A');            // a mango
  ellipse(c, 22, -20, 18, 18, '#B8202E'); ellipse(c, 18, -26, 5, 4, '#F06070');              // a pomegranate
  fillPath(c, 'M 22 -38 L 18 -46 L 26 -46 Z', '#8A1824');
  ellipse(c, 0, -34, 15, 14, '#7AB83A'); ellipse(c, -4, -38, 4, 3, '#C8F08A');               // a gourd
  fillPath(c, 'M -46 -10 C -40 -40 -20 -56 4 -60 C -10 -50 -26 -36 -34 -6 Z', '#F5D24A');  // a banana
  c.restore();
}
// Shoots coming up along y between x0 and x1: grow 0..1.
function sprouts(c, x0, x1, y, k, grow, t, seed = 1) {
  if (grow <= 0) return;
  const n = Math.round((x1 - x0) / (26 * k));
  for (let i = 0; i < n; i++) {
    const x = x0 + (i + hash(i + seed)) * (x1 - x0) / n, g = clamp(grow * 1.4 - hash(i * 3 + seed) * .4), h = (30 + 60 * hash(i * 5 + seed)) * k * g;
    if (h < 1) continue;
    const sw = Math.sin(t * 1.6 + i) * 4 * k;
    limb(c, [[x, y], [x + sw * .5, y - h * .5], [x + sw, y - h]], [5 * k, 4 * k, 1.5 * k], mixCol('#2E6A2A', '#7AC84A', hash(i * 7 + seed)), false);
    if (h > 20 * k) { c.save(); c.translate(x + sw * .6, y - h * .6); c.rotate(hash(i) > .5 ? .7 : -.7); fillPath(c, `M 0 0 C ${-8 * k} ${-6 * k} ${-8 * k} ${-18 * k} 0 ${-24 * k} C ${8 * k} ${-18 * k} ${8 * k} ${-6 * k} 0 0 Z`, '#5AB040'); c.restore(); }
  }
}

// ---------- the war ----------
// Rows of soldiers along y from x0 to x1: a helmeted head, shoulders, a spear (some a banner), a round shield; k scale
// (a soldier is about 140 tall at k 1); they bob as they march (march 0..1).
function army(c, y, x0, x1, k, t, seed = 1, col = '#120608', march = 1) {
  const n = Math.round((x1 - x0) / (46 * k));
  for (let i = 0; i < n; i++) {
    const h = hash(i * 1.7 + seed), x = x0 + (i + h * .6) * (x1 - x0) / n, b = Math.abs(Math.sin(t * 5 + i * 1.3)) * 6 * k * march, yy = y - b;
    fillPath(c, `M ${x - 22 * k} ${yy} L ${x - 20 * k} ${yy - 90 * k} C ${x - 14 * k} ${yy - 104 * k} ${x + 14 * k} ${yy - 104 * k} ${x + 20 * k} ${yy - 90 * k} L ${x + 22 * k} ${yy} Z`, col);
    ellipse(c, x, yy - 116 * k, 14 * k, 16 * k, col);
    fillPath(c, `M ${x - 15 * k} ${yy - 120 * k} L ${x} ${yy - (148 + 20 * h) * k} L ${x + 15 * k} ${yy - 120 * k} Z`, col);
    const sx = x + 26 * k, top = yy - (260 + 80 * hash(i * 2.3 + seed)) * k;
    strokePath(c, `M ${sx} ${yy + 10 * k} L ${sx + 6 * k} ${top}`, col, 4.5 * k);
    fillPath(c, `M ${sx + 6 * k - 7 * k} ${top + 10 * k} L ${sx + 6 * k} ${top - 22 * k} L ${sx + 6 * k + 7 * k} ${top + 10 * k} Z`, col);
    if (hash(i * 4.1 + seed) > .86) { const fl = Math.sin(t * 4 + i) * 10 * k; fillPath(c, `M ${sx + 6 * k} ${top + 14 * k} L ${sx + 80 * k + fl} ${top + 30 * k} L ${sx + 64 * k + fl} ${top + 50 * k} L ${sx + 82 * k + fl} ${top + 72 * k} L ${sx + 6 * k} ${top + 64 * k} Z`, col); }
    if (hash(i * 5.3 + seed) > .5) ellipse(c, x - 20 * k, yy - 60 * k, 22 * k, 26 * k, col);
  }
}
// The luminous circle round the gods and rishis: a dome of light on the ground at (x, y), r wide. a 0..1.
function ringOfLight(c, x, y, r, t, a = 1) {
  if (a <= 0) return;
  c.save(); c.globalCompositeOperation = 'lighter';
  const g = c.createRadialGradient(x, y, r * .2, x, y, r); g.addColorStop(0, rgba('#FFE2A0', .05 * a)); g.addColorStop(.85, rgba('#FFC860', .16 * a)); g.addColorStop(1, rgba('#FFF2C8', .5 * a));
  c.fillStyle = g; c.beginPath(); c.ellipse(x, y, r, r, 0, Math.PI, TAU); c.closePath(); c.fill();
  c.strokeStyle = rgba('#FFF2C8', .85 * a); c.lineWidth = 5; c.beginPath(); c.ellipse(x, y, r, r, 0, Math.PI, TAU); c.stroke();
  c.strokeStyle = rgba('#FFD890', .7 * a); c.lineWidth = 6; c.beginPath(); c.ellipse(x, y, r, r * .16, 0, 0, TAU); c.stroke();
  for (let i = 0; i < 18; i++) { const u = frac(i / 18 + t * .05), ang = Math.PI + u * Math.PI; const px = x + Math.cos(ang) * r, py = y + Math.sin(ang) * r; glow(c, px, py, 22, '#FFF2C8', .5 * a * (.5 + .5 * Math.sin(t * 3 + i))); }
  c.restore();
  glow(c, x, y - r * .4, r * 1.3, '#FFC860', .22 * a);
}
// A small goddess silhouette (one colour), about 900 tall standing. o: col, t, seed (varies hair, arms, weapons),
// arms (4–10), fly (0..1: legs trailing, body leaning into flight), wild (0..1 hair streaming out: Kali), tongue (Kali).
function shakti(c, o = {}) {
  const col = o.col || '#0C0608', t = o.t || 0, s = o.seed || 1, fly = o.fly || 0, n = o.arms || 4 + 2 * Math.floor(hash(s) * 3), wild = o.wild ?? hash(s * 2.1);
  c.save(); c.rotate(fly * .5);
  // hair streaming back and out
  for (let i = 0; i < 7; i++) { const sd = i % 2 ? 1 : -1, len = 260 + 220 * wild; limb(c, [[0, -820], [sd * (60 + i * 14), -760 + i * 12], [sd * (100 + i * 22) - fly * 120, -620 + i * 30 + Math.sin(t * 3 + i) * 16], [sd * (130 + i * 30) * (1 + wild) - fly * 260, -820 + len + i * 20 + Math.sin(t * 3 + i + 1) * 24]], [50, 44, 30, 4], col, false); }
  // legs: standing, or trailing in flight
  if (fly > .3) { limb(c, [[-20, -470], [-60 - 120 * fly, -250 + 120 * fly], [-90 - 260 * fly, -40 + 200 * fly]], [64, 50, 34], col); limb(c, [[20, -470], [10 - 60 * fly, -250 + 160 * fly], [-40 - 140 * fly, -20 + 260 * fly]], [64, 50, 34], col); }
  fillPath(c, `M -70 -520 C -100 -360 -${150 + 60 * fly} -180 -${150 + 140 * fly} ${-20 + 120 * fly} L ${150 - 100 * fly} ${-20 + 80 * fly} C 140 -180 100 -360 70 -520 Z`, col);
  fillPath(c, 'M -64 -520 C -70 -600 -96 -660 -110 -700 C -60 -730 60 -730 110 -700 C 96 -660 70 -600 64 -520 Z', col);
  fillPath(c, 'M -22 -700 L -24 -760 L 24 -760 L 22 -700 Z', col);
  ellipse(c, 0, -812, 46, 58, col);
  fillPath(c, `M -40 -850 L -30 -${930 + 30 * hash(s * 5)} L 0 -${1000 + 40 * hash(s * 6)} L 30 -${930 + 30 * hash(s * 5)} L 40 -850 Z`, col);   // the crown
  if (o.tongue) fillPath(c, 'M -10 -770 L 10 -770 L 6 -720 C 4 -712 -4 -712 -6 -720 Z', '#B0182A');
  // arms fanned out on both sides, each with a weapon
  for (let i = 0; i < n; i++) {
    const sd = i % 2 ? 1 : -1, j = Math.floor(i / 2), m = Math.ceil(n / 2), ang = -Math.PI / 2 + sd * (.5 + 1.9 * (j + .5) / m) + Math.sin(t * 2 + i) * .05;
    const sx = sd * 96, sy = -680, ex = sx + Math.cos(ang) * 170, ey = sy + Math.sin(ang) * 150, hx = sx + Math.cos(ang) * 320, hy = sy + Math.sin(ang) * 290;
    limb(c, [[sx, sy], [ex, ey], [hx, hy]], [44, 36, 28], col); ellipse(c, hx, hy, 20, 22, col);
    const w = Math.floor(hash(s * 13 + i) * 4), ux = Math.cos(ang), uy = Math.sin(ang);
    if (w === 0) strokePath(c, `M ${hx} ${hy} L ${hx + ux * 40 - uy * 10} ${hy - 200}`, col, 12);                                                         // a sword up
    else if (w === 1) { strokePath(c, `M ${hx} ${hy + 120} L ${hx} ${hy - 200}`, col, 8); fillPath(c, `M ${hx - 34} ${hy - 200} C ${hx - 34} ${hy - 250} ${hx - 20} ${hy - 260} ${hx - 22} ${hy - 290} L ${hx - 12} ${hy - 214} L ${hx + 12} ${hy - 214} L ${hx + 22} ${hy - 290} C ${hx + 20} ${hy - 260} ${hx + 34} ${hy - 250} ${hx + 34} ${hy - 200} Z M ${hx - 6} ${hy - 210} L ${hx} ${hy - 300} L ${hx + 6} ${hy - 210} Z`, col); }   // a trishul
    else if (w === 2) { c.save(); c.strokeStyle = col; c.lineWidth = 10; c.beginPath(); c.arc(hx + ux * 40, hy + uy * 40, 36, 0, TAU); c.stroke(); c.restore(); }   // a chakra
    else { strokePath(c, `M ${hx} ${hy} L ${hx + ux * 160} ${hy + uy * 160}`, col, 10); fillPath(c, `M ${hx + ux * 150 - uy * 40} ${hy + uy * 150 + ux * 40} L ${hx + ux * 200} ${hy + uy * 200} L ${hx + ux * 150 + uy * 40} ${hy + uy * 150 - ux * 40} Z`, col); }   // a spear
  }
  c.restore();
}

// ---------- the fifteen arrows ----------
// Durga drawing a great bow, side view facing right: a silhouette in one colour (o.col). Feet about 0, the head about
// -800, the bow's grip at (350, -705). o: t, draw (0..1 the string pulled back), wind.
const ARCH = { grip: [350, -705], nock: (d) => [lerp(318, 40, d), -705] };
function archerNock(d) { return ARCH.nock(clamp(d)); }
function archer(c, o = {}) {
  const col = o.col || '#120608', t = o.t || 0, d = clamp(o.draw ?? 1), g = o.wind ?? .6, [nx, ny] = archerNock(d);
  // the four arms behind her, with weapons: a trishul up, a sword, a chakra, a conch
  const back = [[[-20, -690], [-150, -800], [-240, -930]], [[-20, -680], [-170, -720], [-300, -760]], [[-20, -660], [-170, -620], [-300, -580]], [[-20, -650], [-140, -540], [-230, -450]]];
  back.forEach((P, i) => {
    limb(c, P, [42, 36, 28], col); const [hx, hy] = P[2]; ellipse(c, hx, hy, 20, 22, col);
    if (i === 0) { strokePath(c, `M ${hx + 30} ${hy + 260} L ${hx - 20} ${hy - 200}`, col, 9); fillPath(c, `M ${hx - 60} ${hy - 190} C ${hx - 66} ${hy - 240} ${hx - 52} ${hy - 262} ${hx - 54} ${hy - 290} L ${hx - 40} ${hy - 206} L ${hx - 2} ${hy - 206} L ${hx + 6} ${hy - 286} C ${hx + 8} ${hy - 260} ${hx + 18} ${hy - 236} ${hx + 18} ${hy - 196} Z M ${hx - 28} ${hy - 206} L ${hx - 24} ${hy - 310} L ${hx - 14} ${hy - 206} Z`, col); }
    if (i === 1) strokePath(c, `M ${hx} ${hy} L ${hx - 210} ${hy - 90}`, col, 14);
    if (i === 2) { c.save(); c.strokeStyle = col; c.lineWidth = 11; c.beginPath(); c.arc(hx - 50, hy + 10, 40, 0, TAU); c.stroke(); for (let k = 0; k < 8; k++) { const a = k / 8 * TAU + t * 3; fillPath(c, `M ${hx - 50 + Math.cos(a) * 40} ${hy + 10 + Math.sin(a) * 40} L ${hx - 50 + Math.cos(a + .1) * 62} ${hy + 10 + Math.sin(a + .1) * 62} L ${hx - 50 + Math.cos(a + .2) * 40} ${hy + 10 + Math.sin(a + .2) * 40} Z`, col); } c.restore(); }
    if (i === 3) fillPath(c, `M ${hx - 20} ${hy + 10} C ${hx - 60} ${hy + 20} ${hx - 80} ${hy + 60} ${hx - 60} ${hy + 90} C ${hx - 30} ${hy + 80} ${hx - 10} ${hy + 50} ${hx + 6} ${hy + 20} Z`, col);
  });
  // hair streaming back in the wind
  for (let i = 0; i < 6; i++) limb(c, [[-10, -840 + i * 12], [-90 - i * 10, -800 + i * 20 + Math.sin(t * 3 + i) * 8], [-200 - i * 20 - g * 60, -760 + i * 34 + Math.sin(t * 3 + i + 1) * 16], [-300 - i * 26 - g * 120, -720 + i * 46 + Math.sin(t * 3 + i + 2) * 26]], [44, 40, 26, 4], col, false);
  // legs in a wide stance (the front knee bent toward the target), the sari flaring between them
  limb(c, [[-30, -470], [-130, -250], [-210, -10]], [70, 56, 40], col); fillPath(c, 'M -250 0 L -190 -30 L -160 0 Z', col);
  limb(c, [[30, -470], [180, -290], [160, -10]], [74, 58, 42], col); fillPath(c, 'M 140 0 L 160 -34 L 230 0 Z', col);
  fillPath(c, `M -64 -540 C -110 -400 -200 -230 -${250 + 30 * Math.sin(t * 2)} -70 L -130 -60 L 10 -330 L 120 -120 L ${230 + 20 * Math.sin(t * 2 + 1)} -140 C 170 -300 110 -430 70 -540 Z`, col);
  // the pallu flying back from the shoulder
  limb(c, [[20, -700], [-120, -660 + Math.sin(t * 2.4) * 10], [-260 - g * 40, -600 + Math.sin(t * 2.4 + 1) * 20], [-380 - g * 80, -560 + Math.sin(t * 2.4 + 2) * 30]], [60, 64, 50, 26], col, false);
  // torso, neck, head in profile (the brow, nose and chin to screen right), the crown
  fillPath(c, 'M -62 -540 C -76 -610 -70 -680 -50 -722 L 60 -722 C 84 -690 80 -610 64 -540 Z', col);
  fillPath(c, 'M -18 -720 L -16 -768 L 26 -768 L 30 -720 Z', col);
  fillPath(c, 'M -40 -800 C -42 -846 -12 -872 20 -868 C 48 -864 58 -842 58 -820 L 70 -796 L 58 -790 C 60 -776 56 -764 50 -758 L 56 -748 C 40 -744 20 -746 6 -752 C -26 -760 -40 -778 -40 -800 Z', col);
  fillPath(c, 'M -24 -858 L -14 -930 L 10 -1010 L 30 -930 L 44 -858 Z', col);
  for (const k of [-1, 1]) fillPath(c, `M ${10 + k * 24} -870 L ${10 + k * 52} -930 L ${10 + k * 30} -880 Z`, col);
  // the bow arm out to the grip; the drawing arm, elbow high, the hand at the string
  limb(c, [[40, -700], [200, -704], [ARCH.grip[0] - 10, ARCH.grip[1]]], [42, 34, 28], col); ellipse(c, ARCH.grip[0], ARCH.grip[1], 22, 26, col);
  limb(c, [[-10, -700], [lerp(150, -110, d), lerp(-720, -740, d)], [nx - 16, ny]], [42, 36, 28], col); ellipse(c, nx - 6, ny, 20, 22, col);
  // the bow: a deep curve, bent further as it is drawn; the string to the nock
  const tipX = ARCH.grip[0] - 30 - 50 * d, bulge = ARCH.grip[0] + 120;
  strokePath(c, `M ${tipX} -1080 Q ${bulge} -705 ${tipX} -330`, col, 14);
  c.strokeStyle = col; c.lineWidth = 3; c.beginPath(); c.moveTo(tipX, -1080); c.lineTo(nx, ny); c.lineTo(tipX, -330); c.stroke();
}
// An arrow of light from (x0, y0) to its head at (x1, y1): a fading streak, a shaft, a hot head. a 0..1.
function arrowLight(c, x0, y0, x1, y1, a = 1, w = 1) {
  if (a <= 0) return;
  const ang = Math.atan2(y1 - y0, x1 - x0);
  c.save(); c.globalCompositeOperation = 'lighter';
  const g = c.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, rgba('#FFB050', 0)); g.addColorStop(.7, rgba('#FFD890', .55 * a)); g.addColorStop(1, rgba('#FFFFFF', a));
  c.strokeStyle = g; c.lineCap = 'round'; c.lineWidth = 7 * w; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke();
  c.lineWidth = 2.4 * w; c.strokeStyle = rgba('#FFFFFF', a); c.beginPath(); c.moveTo(lerp(x0, x1, .6), lerp(y0, y1, .6)); c.lineTo(x1, y1); c.stroke();
  c.translate(x1, y1); c.rotate(ang); fillPath(c, `M ${14 * w} 0 L ${-12 * w} ${-9 * w} L ${-6 * w} 0 L ${-12 * w} ${9 * w} Z`, rgba('#FFFFFF', a));
  c.restore();
  glow(c, x1, y1, 40 * w, '#FFC860', .6 * a);
}
// Durgama's war flag on a pole whose foot is at (x, y): a long swallow-tailed pennant. o: col, flag (the cloth), hit
// (0..1 torn), t.
function banner(c, x, y, k, t, o = {}) {
  const col = o.col || '#120608', top = y - 900 * k, fl = Math.sin(t * 3.4) * 20 * k, torn = o.hit || 0;
  strokePath(c, `M ${x} ${y} L ${x} ${top}`, col, 12 * k); ellipse(c, x, top - 10 * k, 16 * k, 16 * k, col);
  const L = 420 * k * (1 - .45 * torn);
  fillPath(c, `M ${x} ${top + 20 * k} C ${x + L * .4} ${top + 10 * k + fl} ${x + L * .7} ${top + 40 * k - fl} ${x + L} ${top + 30 * k + fl} L ${x + L * .8} ${top + 90 * k} L ${x + L} ${top + 150 * k - fl} C ${x + L * .6} ${top + 160 * k + fl} ${x + L * .3} ${top + 140 * k - fl} ${x} ${top + 150 * k} Z`, o.flag || '#7A1418');
}

// ---------- the parched land ----------
// Dry cracks across the ground from the horizon (y0) down: a seeded web of jagged dark lines, finer toward the horizon.
// k (0..1) how dry: they fade as the rain soaks the ground.
function dryCracks(c, y0, k, seed = 1) {
  if (k <= 0) return;
  const rnd = lcg(seed);
  c.save(); c.lineJoin = 'round'; c.lineCap = 'round';
  for (let i = 0; i < 46; i++) {
    let x = -100 + rnd() * 1300, y = y0 + Math.pow(rnd(), .7) * (H - y0 + 80), ang = rnd() * TAU;
    const pts = [[x, y]], n = 4 + Math.floor(rnd() * 5);
    for (let j = 0; j < n; j++) { const p = .35 + (y - y0) / (H - y0); ang += (rnd() - .5) * 1.4; x += Math.cos(ang) * 70 * p; y += Math.sin(ang) * 26 * p; pts.push([x, y]); }
    const p = .4 + (pts[0][1] - y0) / (H - y0);
    c.beginPath(); pts.forEach(([px, py], j) => j ? c.lineTo(px, py + 2 * p) : c.moveTo(px, py + 2 * p)); c.strokeStyle = rgba('#B08050', .35 * k); c.lineWidth = 3 * p; c.stroke();
    c.beginPath(); pts.forEach(([px, py], j) => j ? c.lineTo(px, py) : c.moveTo(px, py)); c.strokeStyle = rgba('#140A04', .85 * k); c.lineWidth = 4.5 * p; c.stroke();
  }
  c.restore();
}
// The old riverbed from the horizon to the viewer, widening with perspective; water (0..1) fills it from the horizon down.
const BED = [[640, 1066], [610, 1140], [700, 1240], [600, 1380], [420, 1540], [380, 1720], [300, 1920], [260, 2060]];
function riverbed(c, water = 0, t = 0) {
  const C = through(BED, 10), L = [], R = [];
  C.forEach(([x, y], i) => { const w = lerp(14, 420, clamp((y - 1066) / 950)); L.push([x - w / 2, y]); R.push([x + w / 2, y]); });
  const bed = new Path2D(); L.concat(R.reverse()).forEach(([x, y], i) => i ? bed.lineTo(x, y) : bed.moveTo(x, y)); bed.closePath();
  fillPath(c, bed, '#6A4A2C');
  inside(c, bed, () => {
    for (let i = 0; i < 18; i++) { const y = 1080 + i * 54; strokePath(c, `M -100 ${y} Q 540 ${y + 10} 1200 ${y}`, rgba('#3A2414', .14), 2 + i * .2); }   // dry ripples
    if (water > 0) {
      const wy = lerp(1060, 2080, water), g = c.createLinearGradient(0, 1060, 0, 2000); g.addColorStop(0, '#9FC8F0'); g.addColorStop(1, '#2E5E92');
      c.fillStyle = g; c.fillRect(-200, 1000, 1500, wy - 1000);
      for (let i = 0; i < 26; i++) { const y = 1080 + ((i * 41 + t * 160) % (wy - 1080 > 0 ? wy - 1080 : 1)); strokePath(c, `M ${300 + hash(i) * 500} ${y} l ${30 + 60 * (y - 1060) / 900} 0`, rgba('#E8F4FF', .55), 2 + 3 * (y - 1060) / 900); }
      glow(c, BED[0][0], wy, 200, '#E8F4FF', .5);
    }
  });
}
