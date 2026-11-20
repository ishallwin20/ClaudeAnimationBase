// Issue 2, Act 3 (pp. 22–40): Lanka. The leap, Simhika, the golden city, Sita, the ring, the grove, the kinkaras, Aksha,
// Indrajit, the court, the tail, the burning, and Sita found alive. Verses: SCRIPT.md (Sundara 1–54).
const NIGHTL = () => ({ ...lit(KLIGHT(-4, -4, { rim: '#A8C8FF' })), tint: ['#2A3A6A', .22] });
const FIREL = () => ({ ...lit(KLIGHT(4, -4, { rim: '#FFB060' })), tint: ['#FF6A20', .18] });
// a whole figure on the deva rig, its head at (x, y), scale k, turned r
function fig(c, x, y, k, o, light = lit(DAY()), fn = hanFigure, r = 0) { c.save(); c.translate(x, y); c.rotate(r); c.scale(k * (o.flip ? -1 : 1), k); figure(c, (c) => fn(c, { t: 0, ...o }), light); c.restore(); }
function rakshasiBust(c, o = {}) { devaBust(c, { who: 'rk' + ((o.r || 0) % 4), fem: true, fangs: true, hair: 'wild', crown: false, tilak: false, dress: 'sari', build: .95, cloth: ['#5A2A4A', '#2A4A3A', '#6A3A1A', '#3A2A5A'][(o.r || 0) % 4], ...o }); }
const sitaAt = (c, x, y, k, o, light = lit(DAY())) => bust(c, x, y, k, o, light, sitaBust);
const rakAt = (c, x, y, k, o, light = lit(DAY())) => bust(c, x, y, k, o, light, rakshasaBust);
const ravAt = (c, x, y, k, o, light = lit(DAY())) => bust(c, x, y, k, o, light, dashaBust);
const AKSHA = { who: 'aksha', crown: 'mukut', dress: 'armor', armor: '#B8862A' };
const INDRAJIT = { who: 'indrajit', crown: 'kirita', stache: true, tilak: 'line', dress: 'armor', armor: '#3A3A4A' };
const VIBHI = { who: 'vibhi', crown: 'mukut', stache: true, beard: 'short', tilak: 'dot' };

// ---------- sets ----------
function sea(c, P, hz, o = {}) {
  const day = o.day ?? true;
  vgrad(c, P, day ? [[0, '#4A8AC8'], [hz, '#CFE6F6'], [hz + .001, '#2E6A9A'], [1, '#14385A']] : [[0, '#0A1430'], [hz, '#2A3A6A'], [hz + .001, '#14284A'], [1, '#060E22']]);
  const R = lcg(o.seed || 4);
  for (let i = 0; i < 30; i++) { const y = P.h * (hz + .02 + R() * (1 - hz)), x = P.w * R(), w = 40 + (y / P.h - hz) * 260; strokePath(c, `M ${x} ${y} q ${w / 2} -8 ${w} 0`, rgba(day ? '#BEE0F6' : '#5A7AB0', .5), 3); }
}
// a fire as tongues: three layers, each one path (one ink line per layer)
function blaze(c, x, y, w, h, seed = 1, cols = ['#C8301A', '#FF8A1E', '#FFE07A']) {
  cols.forEach((col, L) => {
    const R = lcg(seed + L * 7), Q = new Path2D(), n = Math.max(3, Math.round(w / 40)), k = 1 - L * .28;
    Q.moveTo(x - w / 2 * k, y);
    for (let i = 0; i < n; i++) { const a = x - w / 2 * k + w * k * i / n, b = a + w * k / n, hh = h * k * (.45 + R() * .7); Q.quadraticCurveTo(a + (b - a) * .1, y - hh * .5, a + (b - a) * (.3 + R() * .4), y - hh); Q.quadraticCurveTo(b - (b - a) * .1, y - hh * .4, b, y); }
    Q.closePath(); fillPath(c, Q, col);
  });
}
// Lanka: gold palaces on the Trikuta hill behind a gold wall; burn 0..1 sets it alight
function lankaCity(c, P, base, k = 1, o = {}) {
  const R = lcg(o.seed || 11), burn = o.burn || 0, goldSh = '#9A6A1E', bg = o.bg || (o.night ? '#1E2A4A' : '#E8A07A');
  fillPath(c, `M -20 ${base + 20} L -20 ${base - 60 * k} Q ${P.w * .5} ${base - 300 * k} ${P.w + 20} ${base - 60 * k} L ${P.w + 20} ${base + 20} Z`, burn ? '#2A1210' : o.night ? '#1A2238' : '#6A5A5A');
  for (let r = 0; r < 3; r++) {
    const sc = (.55 + r * .25) * k, fade = (2 - r) * .22, B = [];
    for (let x = -30 + R() * 40; x < P.w + 40; x += (70 + R() * 60) * sc) { const hill = 1 - Math.pow((x / P.w - .5) * 2, 2); B.push([x, base - (60 + hill * 200 - r * 70) * k, (26 + R() * 22) * sc, (70 + R() * 130) * sc, R()]); }
    for (const [x, y, w, h, q] of B) {
      const body = mixCol(q > .72 ? '#F4ECD8' : '#E8B84A', bg, fade), dome = mixCol(q > .72 ? '#E8B84A' : '#F6D27A', bg, fade), sh = mixCol(goldSh, bg, fade);
      const BD = `M ${x - w} ${y + 30 * sc} L ${x - w} ${y - h} L ${x + w} ${y - h} L ${x + w} ${y + 30 * sc} Z`;
      fillPath(c, BD, body); inside(c, BD, () => fillPath(c, `M ${x + w * .3} ${y - h} L ${x + w + 2} ${y - h} L ${x + w + 2} ${y + 40 * sc} L ${x + w * .3} ${y + 40 * sc} Z`, rgba(sh, .45)));
      const DM = `M ${x - w - 4} ${y - h} C ${x - w} ${y - h - w * 1.3} ${x} ${y - h - w * 1.7} ${x} ${y - h - w * 2.1} C ${x} ${y - h - w * 1.7} ${x + w} ${y - h - w * 1.3} ${x + w + 4} ${y - h} Z`;
      fillPath(c, DM, dome); strokePath(c, DM, sh, 2.5); strokePath(c, BD, sh, 2.5);
      for (let j = 1; j < h / (30 * sc); j++) for (const s2 of [-1, 1]) ellipse(c, x + s2 * w * .45, y - j * 30 * sc, 4 * sc, 8 * sc, o.night || burn ? '#FFE8A0' : sh);
      if (burn && q < burn) { glow(c, x, y - h, w * 3, '#FF6A1E', .45); blaze(c, x, y - h + 4, w * 2.4, (70 + q * 140) * sc * burn, Math.round(x * 3 + r)); }
    }
  }
  const wy = base - 34 * k, wc = burn ? '#B8782A' : '#D8A040';
  fillPath(c, `M -20 ${base + 20} L -20 ${wy} L ${P.w + 20} ${wy} L ${P.w + 20} ${base + 20} Z`, wc);
  for (let x = -10; x < P.w; x += 30 * k) fillPath(c, `M ${x} ${wy} l 0 ${-14 * k} l ${16 * k} 0 l 0 ${14 * k} Z`, wc);
  strokePath(c, `M -20 ${wy} L ${P.w + 20} ${wy}`, goldSh, 3);
}
// the Ashoka grove at night: dark trunks, red-orange flowers
function groveBg(c, P, o = {}) {
  vgrad(c, P, [[0, o.dawn ? '#3A2A4A' : '#0E1428'], [1, o.dawn ? '#8A5A5A' : '#1E2A3A']]);
  if (!o.dawn) ellipse(c, P.w * .82, P.h * .16, 34, 34, '#F4F0DA');
  const R = lcg(o.seed || 5);
  for (let i = 0; i < 7; i++) { const x = P.w * (i + .5) / 7 + (R() - .5) * 60, top = P.h * (.05 + R() * .2); strokePath(c, `M ${x} ${P.h + 20} C ${x - 10} ${P.h * .6} ${x + 20} ${top + 80} ${x} ${top}`, '#1A1416', 26 + R() * 20); }
  for (let i = 0; i < 9; i++) puffs(c, P.w * R(), P.h * (.06 + R() * .3), 240 + R() * 200, i % 2 ? '#1E3A2A' : '#264A30', i + 3, 6);
  for (let i = 0; i < 80; i++) ellipse(c, P.w * R(), P.h * (.02 + R() * .42), 5, 4, ['#E8502A', '#F2A03A', '#C8301E'][i % 3]);
  fillPath(c, `M -20 ${P.h * .86} Q ${P.w * .5} ${P.h * .82} ${P.w + 20} ${P.h * .86} L ${P.w + 20} ${P.h + 20} L -20 ${P.h + 20} Z`, '#1E2A1E');
}
function rope(c, pts, w = 10) { strokePath(c, 'M ' + pts.map(p => p.join(' ')).join(' L '), '#8A6A3A', w); for (let i = 0; i < pts.length - 1; i++) { const [a, b] = [pts[i], pts[i + 1]]; for (let k = 0; k < 1; k += .2) strokePath(c, `M ${lerp(a[0], b[0], k) - 4} ${lerp(a[1], b[1], k) - 4} l 8 8`, '#4A3418', 2.5); } }
function gate(c, x, y, k, col = '#C8963A') {
  const G = `M ${x - 260 * k} ${y} L ${x - 260 * k} ${y - 420 * k} L ${x + 260 * k} ${y - 420 * k} L ${x + 260 * k} ${y} L ${x + 150 * k} ${y} L ${x + 150 * k} ${y - 230 * k} Q ${x} ${y - 360 * k} ${x - 150 * k} ${y - 230 * k} L ${x - 150 * k} ${y} Z`;
  fillPath(c, G, col); strokePath(c, G, '#6A4A1A', 4);
  for (let i = 0; i < 9; i++) fillPath(c, `M ${x - 260 * k + i * 60 * k} ${y - 420 * k} l 0 ${-30 * k} l ${30 * k} 0 l 0 ${30 * k} Z`, col);
}
function bodies(c, P, y0, n, seed = 3, k = 1) {
  const R = lcg(seed);
  for (let i = 0; i < n; i++) { const x = P.w * R(), y = P.h * (y0 + R() * (1 - y0)), a = (R() - .5) * 3; c.save(); c.translate(x, y); c.rotate(a); c.scale(k, k); fillPath(c, 'M -60 -14 C -70 -30 -40 -40 -20 -26 L 50 -20 C 70 -18 70 10 50 14 L -20 18 C -40 32 -70 26 -60 -14 Z', ['#2A2028', '#34282A', '#22262E'][i % 3]); ellipse(c, -66, -4, 22, 20, ['#3A3036', '#2E2A30'][i % 2]); c.restore(); }
}
function smoke(c, P, n, seed = 2, col = '#2A2228') { const R = lcg(seed); for (let i = 0; i < n; i++) puffs(c, P.w * R(), P.h * (.05 + R() * .5), 260 + R() * 300, col, seed + i, 6); }

// =================== p22 · the leap ===================
ART.oceanLeap = (c, P) => {
  sea(c, P, .62);
  puffs(c, P.w * .2, P.h * .2, 420, '#F4F8FC', 2); puffs(c, P.w * .8, P.h * .1, 360, '#F4F8FC', 5);
  // the sea pulled up in his wake: a rising trail of foam and spray
  for (let i = 0; i < 14; i++) { const k = i / 13, x = P.w * (.02 + k * .5), y = P.h * (.66 - Math.pow(k, 1.6) * .3); puffs(c, x, y, 120 + (1 - k) * 160, i % 2 ? '#E8F4FC' : '#BEE0F6', i + 2, 5); }
  for (let i = 0; i < 40; i++) { const R = lcg(i + 1); ellipse(c, P.w * (.3 + R() * .3), P.h * (.3 + R() * .2), 5 + R() * 7, 5 + R() * 7, '#E8F4FC'); }
  speedLines(c, P.w * 1.3, P.h * .3, 22, 500, 1500, 'rgba(255,255,255,.85)', 2.5, 4, Math.PI * .94, Math.PI * 1.06);
  glow(c, P.w * .62, P.h * .34, 300, '#FFE8B0', .5);
  fig(c, P.w * .74, P.h * .26, .34, { legs: 'leap', arms: ['reach', 'reach'], expr: 'fierce', look: [1, 0], tail: 'stream', crown: 'band' }, lit(DAY()), hanFigure, 1.05);
};

// =================== p23 · Simhika ===================
ART.simhikaRises = (c, P) => {
  sea(c, P, .3);
  // a vast shape under the water, two burning eyes
  const S = `M ${P.w * .2} ${P.h + 20} C ${P.w * .2} ${P.h * .5} ${P.w * .4} ${P.h * .42} ${P.w * .55} ${P.h * .42} C ${P.w * .72} ${P.h * .42} ${P.w * .9} ${P.h * .55} ${P.w * .92} ${P.h + 20} Z`;
  fillPath(c, S, rgba('#0A1E1A', .75));
  for (const x of [.47, .63]) { glow(c, P.w * x, P.h * .62, 60, '#FFD040', .8); ellipse(c, P.w * x, P.h * .62, 22, 12, '#FFE070'); ellipse(c, P.w * x, P.h * .62, 6, 10, '#2A0A04'); }
  fig(c, P.w * .8, P.h * .1, .1, { legs: 'leap', arms: ['reach', 'reach'], expr: 'fierce', tail: 'stream', crown: 'band' }, lit(DAY()), hanFigure, 1.25);
};
ART.shadowCaught = (c, P) => {
  sea(c, P, .45);
  // his shadow on the water, and a green hand closing on it
  c.save(); c.translate(P.w * .45, P.h * .82); c.scale(1, .3); fillPath(c, ellP(0, 0, 160, 50), rgba('#06121E', .6)); c.restore();
  const H = `M ${P.w * .3} ${P.h + 20} C ${P.w * .3} ${P.h * .9} ${P.w * .34} ${P.h * .78} ${P.w * .38} ${P.h * .74} L ${P.w * .36} ${P.h * .62} L ${P.w * .4} ${P.h * .6} L ${P.w * .42} ${P.h * .72} L ${P.w * .44} ${P.h * .58} L ${P.w * .48} ${P.h * .58} L ${P.w * .48} ${P.h * .72} L ${P.w * .52} ${P.h * .6} L ${P.w * .56} ${P.h * .62} L ${P.w * .54} ${P.h * .76} C ${P.w * .58} ${P.h * .82} ${P.w * .6} ${P.h * .9} ${P.w * .6} ${P.h + 20} Z`;
  void H;
  for (const x of [.4, .5]) { glow(c, P.w * x, P.h * .9, 40, '#FFD040', .7); ellipse(c, P.w * x, P.h * .9, 14, 7, '#FFE070'); }
  [[.3, -.5], [.36, -.2], [.54, .2], [.6, .5]].forEach(([x, a]) => { c.save(); c.translate(P.w * x, P.h + 10); c.rotate(a); limb(c, [[0, 0], [0, -90], [a * -60, -170], [a * -110, -200]], [46, 40, 26, 6], '#2E5A4E'); c.restore(); });
  for (let i = 0; i < 6; i++) strokePath(c, `M ${P.w * (.3 + i * .06)} ${P.h * .95} q 20 -18 40 0`, '#BEE0F6', 3);
  // Hanuman jerked to a stop: body whipped back, speed lines snapping
  speedLines(c, P.w * .5, P.h * .22, 26, 120, 300, 'rgba(255,255,255,.8)', 3, 2);
  fig(c, P.w * .48, P.h * .12, .17, { legs: 'leap', arms: ['up', 'throw'], expr: 'awe', look: [0, 1], tail: 'stream', crown: 'band' }, lit(DAY()), hanFigure, .5);
};
function simhikaMaw(c, x, y, k, open = 1) {
  c.save(); c.translate(x, y); c.scale(k, k);
  // the head rising from the sea, the mouth taking most of it
  const S = devaPal({ who: 'simhika' });
  for (let i = 0; i < 18; i++) { const a = Math.PI + i / 17 * Math.PI, r = 380 + (i % 3) * 60; limb(c, [[Math.cos(a) * 280, Math.sin(a) * 240], [Math.cos(a) * r, Math.sin(a) * r * .9], [Math.cos(a + .15) * (r + 120), Math.sin(a + .15) * (r + 80)]], [70, 40, 10], S.hair); }
  const F = 'M -330 300 C -360 0 -260 -300 0 -310 C 260 -300 360 0 330 300 Z';
  fillPath(c, F, S.skin); inside(c, F, () => fillPath(c, 'M 140 -320 C 320 -200 340 100 300 320 L 400 320 L 400 -320 Z', S.skinSh)); strokePath(c, F, S.skinDk, 6);
  for (const s of [-1, 1]) {
    strokePath(c, `M ${s * 40} -170 Q ${s * 140} -150 ${s * 230} -210`, S.brow, 16);
    const E = `M ${s * 60} -120 Q ${s * 140} -175 ${s * 220} -130 Q ${s * 140} -95 ${s * 60} -120 Z`;
    glow(c, s * 140, -130, 90, '#FFD040', .7); fillPath(c, E, '#FFE070'); ellipse(c, s * 140, -130, 16, 24, '#1A0604'); strokePath(c, E, S.kohl, 6);
  }
  // the mouth: wide as the sky, deep as the underworld
  const M = `M -280 ${-40 + 40 * (1 - open)} C -200 ${-90} 200 ${-90} 280 ${-40 + 40 * (1 - open)} C 260 ${120 + 260 * open} -260 ${120 + 260 * open} -280 ${-40 + 40 * (1 - open)} Z`;
  fillPath(c, M, '#1A0408');
  inside(c, M, () => { glow(c, 0, 160 * open, 220, '#5A0A14', .9); for (let i = -4; i <= 4; i++) { fillPath(c, `M ${i * 58 - 24} -70 L ${i * 58} ${-10 + Math.abs(i) * 6} L ${i * 58 + 24} -70 Z`, '#F2E8D0'); fillPath(c, `M ${i * 58 - 22} ${100 + 220 * open} L ${i * 58} ${40 + 200 * open} L ${i * 58 + 22} ${100 + 220 * open} Z`, '#F2E8D0'); } });
  strokePath(c, M, '#0A0204', 8);
  c.restore();
}
ART.simhikaMouth = (c, P) => {
  vgrad(c, P, [[0, '#3A5A8A'], [1, '#9AC0E0']]);
  simhikaMaw(c, P.w * .5, P.h * .78, .62, 1);
  fillPath(c, `M -20 ${P.h * .9} Q ${P.w * .5} ${P.h * .86} ${P.w + 20} ${P.h * .9} L ${P.w + 20} ${P.h + 20} L -20 ${P.h + 20} Z`, '#1E5A8A');
  // he grows: huge in the sky above her
  glow(c, P.w * .5, P.h * .2, 260, '#FFE8B0', .5);
  fig(c, P.w * .84, P.h * .1, .26, { legs: 'stride', arms: ['fist', 'fist'], expr: 'fierce', look: [-.6, .8], turn: -.3, tail: 'up', crown: 'band' }, lit(DAY()));
};

// =================== p24 · inside ===================
ART.hanShrinks = (c, P) => {
  vgrad(c, P, [[0, '#2A3A5A'], [1, '#5A7AA0']]);
  simhikaMaw(c, P.w * .74, P.h * .55, .42, 1);
  // a golden mote diving into the dark
  strokePath(c, `M ${P.w * .98} ${P.h * .02} Q ${P.w * .86} ${P.h * .3} ${P.w * .75} ${P.h * .7}`, 'rgba(255,220,140,.9)', 6);
  glow(c, P.w * .75, P.h * .7, 40, '#FFD27A', .9);
  fig(c, P.w * .755, P.h * .68, .035, { legs: 'leap', arms: ['reach', 'reach'], expr: 'fierce', tail: 'stream', crown: 'band' }, lit(DAY()), hanFigure, 2.4);
};
ART.burstOut = (c, P) => {
  vgrad(c, P, [[0, '#1A1030'], [1, '#3A1A2A']]);
  // her body thrown back, torn open, a burst of light; Hanuman bursting out, fist first
  const B = `M -20 ${P.h + 20} C ${P.w * .05} ${P.h * .5} ${P.w * .3} ${P.h * .3} ${P.w * .5} ${P.h * .32} C ${P.w * .7} ${P.h * .34} ${P.w * .95} ${P.h * .5} ${P.w + 20} ${P.h + 20} Z`;
  fillPath(c, B, '#2A4A42'); strokePath(c, B, '#0A1E1A', 5);
  const R = lcg(6), Q = new Path2D(); for (let i = 0; i < 26; i++) { const a = i / 26 * TAU, r = i % 2 ? 160 : 420 + R() * 200; Q.lineTo(P.w * .52 + Math.cos(a) * r, P.h * .58 + Math.sin(a) * r * .8); } Q.closePath();
  fillPath(c, Q, '#FFE08A'); fillPath(c, ellP(P.w * .52, P.h * .58, 200, 160), '#FFF6D0');
  for (let i = 0; i < 26; i++) { const a = R() * TAU, r = 200 + R() * 300; ellipse(c, P.w * .52 + Math.cos(a) * r, P.h * .58 + Math.sin(a) * r * .8, 8 + R() * 14, 6 + R() * 10, '#8A0A14'); }
  bust(c, P.w * .52, P.h * .42, .6, { expr: 'roar', look: [0, -.3], arms: ['up', 'reach'], crown: 'band', blood: .6, pal: { skinDk: '#5A1A10' } }, lit(DAY()), hanBust);
};
ART.simhikaSinks = (c, P) => {
  sea(c, P, .4, { seed: 9 });
  // a green hand going under, bubbles; far off, a golden speck flying on
  c.save(); c.translate(-P.w * .4, 0); const H = `M ${P.w * .62} ${P.h + 20} L ${P.w * .62} ${P.h * .7} L ${P.w * .6} ${P.h * .6} L ${P.w * .63} ${P.h * .58} L ${P.w * .65} ${P.h * .66} L ${P.w * .67} ${P.h * .56} L ${P.w * .7} ${P.h * .57} L ${P.w * .7} ${P.h * .68} L ${P.w * .73} ${P.h * .62} L ${P.w * .75} ${P.h * .65} L ${P.w * .74} ${P.h * .76} L ${P.w * .74} ${P.h + 20} Z`;
  fillPath(c, H, '#2E5A4E'); strokePath(c, H, '#0A1E1A', 4); c.restore();
  for (let i = 0; i < 14; i++) { const R = lcg(i + 3); const b = ellP(P.w * (.15 + R() * .25), P.h * (.5 + R() * .4), 6 + R() * 10, 6 + R() * 10); strokePath(c, b, '#E0F0FA', 3); }
  for (let i = 0; i < 5; i++) strokePath(c, `M ${P.w * .12 + i * 20} ${P.h * .84} q ${100 + i * 20} -10 ${200 + i * 40} 0`, '#8AC0E8', 3);
  fig(c, P.w * .93, P.h * .12, .07, { legs: 'leap', arms: ['reach', 'reach'], expr: 'fierce', tail: 'stream', crown: 'band' }, lit(DAY()), hanFigure, 1.25);
};

// =================== p25 · the golden city ===================
ART.lankaNight = (c, P) => {
  vgrad(c, P, [[0, '#060A1E'], [.7, '#1E2A4A'], [.701, '#0A1428'], [1, '#060A18']]);
  { const R = lcg(4); for (let i = 0; i < 60; i++) ellipse(c, P.w * R(), P.h * R() * .6, 1.5 + R() * 2, 1.5 + R() * 2, '#E8ECF8'); } ellipse(c, P.w * .14, P.h * .16, 44, 44, '#F6F2DE'); glow(c, P.w * .14, P.h * .16, 140, '#DDE6FF', .3);
  lankaCity(c, P, P.h * .78, .9, { night: true });
  // guards along the wall
  const R = lcg(2); for (let i = 0; i < 22; i++) { const x = P.w * (i + .5) / 22, y = P.h * .78 - 34 * .9 - 14 * .9; fillPath(c, `M ${x - 6} ${y} L ${x - 5} ${y - 26} C ${x - 6} ${y - 34} ${x + 6} ${y - 34} ${x + 5} ${y - 26} L ${x + 6} ${y} Z`, '#14101A'); strokePath(c, `M ${x + 10} ${y} L ${x + 12} ${y - 50}`, '#14101A', 2.5); }
  for (let i = 0; i < 8; i++) strokePath(c, `M ${P.w * (i * .14)} ${P.h * .86} q 60 -6 120 0`, 'rgba(200,170,90,.5)', 3);
};
ART.roofs = (c, P) => {
  vgrad(c, P, [[0, '#0A1030'], [1, '#2A3A6A']]); ellipse(c, P.w * .86, P.h * .2, 50, 50, '#F6F2DE'); glow(c, P.w * .86, P.h * .2, 160, '#DDE6FF', .35);
  // roofs and domes in moonlight, receding
  for (const [y, k, col, sd] of [[.55, .7, '#3A4A6A', 2], [.8, 1, '#4A5A80', 5], [1.05, 1.4, '#5A6A8E', 8]]) {
    const R = lcg(sd);
    for (let x = -40; x < P.w + 60; x += (120 + R() * 80) * k) { const w = (50 + R() * 40) * k, Y = P.h * y; fillPath(c, `M ${x - w} ${Y} L ${x - w} ${Y - 60 * k} C ${x - w} ${Y - 60 * k - w} ${x} ${Y - 60 * k - w * 1.5} ${x} ${Y - 60 * k - w * 1.9} C ${x} ${Y - 60 * k - w * 1.5} ${x + w} ${Y - 60 * k - w} ${x + w} ${Y - 60 * k} L ${x + w} ${Y} Z`, col); strokePath(c, `M ${x} ${Y - 60 * k - w * 1.9} l 0 -16`, '#C8A050', 3); }
  }
  // Hanuman, cat-small, crouched on a dome, peering down
  fig(c, P.w * .4, P.h * .52, .08, { legs: 'crouch', arms: [[1.15, .25, 'fist'], [1.15, .25, 'fist']], expr: 'calm', look: [-.6, .6], tail: 'curl', crown: 'band' }, NIGHTL());
  for (const x of [.2, .62, .78]) { ellipse(c, P.w * x, P.h * .9, 16, 10, '#FFE8A0'); glow(c, P.w * x, P.h * .9, 40, '#FFD27A', .4); }
};
ART.wallDawn = (c, P) => {
  vgrad(c, P, [[0, '#4A3A6A'], [.6, '#E8907A'], [1, '#F4C890']]);
  lankaCity(c, P, P.h * .95, .6, { seed: 3, bg: '#E8907A' });
  fillPath(c, `M -20 ${P.h * .9} L ${P.w + 20} ${P.h * .9} L ${P.w + 20} ${P.h + 20} L -20 ${P.h + 20} Z`, '#C8963A');
  bust(c, P.w * .3, P.h * .64, .4, { expr: 'grief', look: [.4, .6], turn: .2, arms: ['down', 'down'], crown: 'band' }, lit(DAY(-4, -4)), hanBust);
};

// =================== p26 · two months ===================
ART.grove = (c, P) => {
  groveBg(c, P);
  // the shimshapa tree, Sita beneath it, thin, alone; rakshasis around, asleep and awake
  strokePath(c, `M ${P.w * .5} ${P.h + 20} C ${P.w * .48} ${P.h * .7} ${P.w * .54} ${P.h * .4} ${P.w * .5} ${P.h * .1}`, '#2A1E1A', 46);
  puffs(c, P.w * .5, P.h * .12, 520, '#2E5A34', 9, 8);
  [[.14, 0, 'laugh'], [.28, 1, 'sleep'], [.74, 2, 'fierce'], [.88, 3, 'laugh']].forEach(([x, r, e]) => bust(c, P.w * x, P.h * .64, .26, { r, expr: e, look: [(x < .5 ? 1 : -1), 0], turn: x < .5 ? .3 : -.3, arms: ['down', 'down'] }, NIGHTL(), rakshasiBust));
  sitaAt(c, P.w * .5, P.h * .6, .3, { expr: 'grief', look: [0, .6], arms: ['down', 'down'] }, NIGHTL());
};
ART.ravanaThreat = (c, P) => {
  groveBg(c, P, { seed: 8 });
  glow(c, P.w * .7, P.h * .6, 400, '#C8501E', .35);
  ravAt(c, P.w * .7, P.h * .58, .36, { expr: 'rage', look: [-.6, .5], arms: ['down', 'point'] }, FIREL());
  sitaAt(c, P.w * .14, P.h * .82, .24, { expr: 'grief', look: [0, 1], arms: ['chest', 'down'], turn: .3 }, NIGHTL());
};
ART.eyesLeaves = (c, P) => {
  vgrad(c, P, [[0, '#0A1424'], [1, '#14242A']]);
  c.save(); c.translate(P.w * .38, P.h * .56); c.scale(1.5, 1.5); figure(c, (c) => hanHead(c, { expr: 'fierce', look: [.2, .7], t: P.t }), NIGHTL()); c.restore();
  // leaves across his face, leaving the eyes
  const R = lcg(3);
  for (let i = 0; i < 40; i++) { const x = P.w * R(), y = R() > .5 ? P.h * (.0 + R() * .3) : P.h * (.72 + R() * .3); leaf(c, x, y, 40 + R() * 30, R() * TAU, i % 2 ? '#1E4A2A' : '#2A5A34'); }
  // the branch, and his fist closing until the bark splits
  strokePath(c, `M ${P.w * .55} ${P.h + 20} C ${P.w * .62} ${P.h * .7} ${P.w * .78} ${P.h * .62} ${P.w + 20} ${P.h * .58}`, '#3A2A1E', 40);
  c.save(); c.translate(P.w * .8, P.h * .62); c.scale(1.3, 1.3); devaHand(c, [0, 0], -1.5, 'fist', { skin: '#E39A34', skinDk: '#7A4410' }); c.restore();
  for (const [dx, dy] of [[-60, -20], [50, 30], [-40, 40]]) strokePath(c, `M ${P.w * .8 + dx} ${P.h * .62 + dy} l ${dx * .4} ${dy * .4} l 8 -10`, '#F4E0B0', 3);
};

// =================== p27 · the ring ===================
ART.ringOffer = (c, P) => {
  groveBg(c, P, { seed: 2 });
  sitaAt(c, P.w * .26, P.h * .5, .5, { expr: 'shock', look: [1, 0], turn: .3, arms: ['chest', 'open'] }, NIGHTL());
  bust(c, P.w * .76, P.h * .5, .5, { expr: 'tender', look: [-1, 0], turn: -.3, arms: ['reach', 'down'], crown: 'band' }, NIGHTL(), hanBust);
  // the ring held out on his fingers, glinting
  const rx = P.w * .76 - 330 * .5 * .82 - 40, ry = P.h * .5 + 150 * .5;
  glow(c, rx, ry, 60, '#FFE08A', .9); c.strokeStyle = '#F0B83A'; c.lineWidth = 7; c.beginPath(); c.arc(rx, ry, 13, 0, TAU); c.stroke(); ellipse(c, rx, ry - 14, 6, 6, '#C21E2A');
};
ART.ringFace = (c, P) => {
  vgrad(c, P, [[0, '#1A2440'], [1, '#3A3A5A']]); glow(c, P.w * .5, P.h * .55, 320, '#FFE8B0', .35);
  sitaAt(c, P.w * .5, P.h * .5, .62, { expr: 'kind', look: [.4, .6], arms: ['down', 'chest'] }, lit(DAY()));
  glow(c, P.w * .6, P.h * .8, 50, '#FFE08A', .9); c.strokeStyle = '#F0B83A'; c.lineWidth = 7; c.beginPath(); c.arc(P.w * .6, P.h * .8, 12, 0, TAU); c.stroke();
};
ART.jewelGive = (c, P) => {
  vgrad(c, P, [[0, '#1A2440'], [1, '#3A3A5A']]);
  sitaAt(c, P.w * .3, P.h * .5, .45, { expr: 'grief', look: [1, .4], turn: .3, arms: ['down', 'reach'] }, lit(DAY()));
  glow(c, P.w * .7, P.h * .7, 90, '#9AE8FF', .8); ellipse(c, P.w * .7, P.h * .7, 20, 20, '#E8FAFF'); fillPath(c, `M ${P.w * .7} ${P.h * .7 - 16} l 12 16 l -12 16 l -12 -16 Z`, '#5AC8F0');
  c.save(); c.translate(P.w * .82, P.h * .78); c.scale(-1.1, 1.1); devaHand(c, [0, 0], -.4, 'open', { skin: '#E39A34', skinDk: '#7A4410' }); c.restore();
};

// =================== p28 · the grove smashed ===================
ART.groveSmash = (c, P) => {
  groveBg(c, P, { dawn: true, seed: 6 });
  // pavilions broken, trees in the air
  const R = lcg(4);
  for (let i = 0; i < 6; i++) { const x = P.w * R(), y = P.h * (.1 + R() * .4); c.save(); c.translate(x, y); c.rotate(R() * 3); strokePath(c, 'M 0 0 L 0 -200', '#3A2A1E', 22); puffs(c, 0, -220, 200, '#2E5A34', i, 5); c.restore(); }
  for (let i = 0; i < 14; i++) { c.save(); c.translate(P.w * R(), P.h * (.5 + R() * .4)); c.rotate(R() * 3); fillPath(c, 'M -40 -10 L 40 -14 L 44 10 L -36 14 Z', '#C8963A'); c.restore(); }
  // the one tree left standing, far off, and Sita under it
  strokePath(c, `M ${P.w * .1} ${P.h * .86} C ${P.w * .09} ${P.h * .7} ${P.w * .12} ${P.h * .62} ${P.w * .1} ${P.h * .52}`, '#2A1E1A', 18);
  puffs(c, P.w * .1, P.h * .52, 200, '#2E5A34', 2, 6);
  glow(c, P.w * .1, P.h * .8, 60, '#FFE8B0', .4); sitaAt(c, P.w * .1, P.h * .79, .08, { expr: 'calm', arms: ['down', 'down'] }, NIGHTL());
  // Hanuman tearing a tree up by its roots
  fig(c, P.w * .52, P.h * .38, .4, { legs: 'stride', arms: ['up', 'up'], expr: 'roar', look: [0, 0], tail: 'up', crown: 'band' }, lit(DAY()));
  c.save(); c.translate(P.w * .52, P.h * .24); c.rotate(-.2); strokePath(c, 'M -300 0 L 300 0', '#3A2A1E', 40); for (let i = 0; i < 6; i++) strokePath(c, `M 300 0 l ${40 + i * 10} ${-60 + i * 24}`, '#3A2A1E', 10); puffs(c, -340, -10, 320, '#2E5A34', 3, 7); c.restore();
};

// =================== p29 · eighty thousand ===================
ART.kinkaras = (c, P) => {
  vgrad(c, P, [[0, '#2A1A2A'], [.5, '#8A3A2A'], [1, '#3A1A1A']]);
  gate(c, P.w * .5, P.h * .86, 1.5, '#B8863A');
  fillPath(c, `M -20 ${P.h * .84} L ${P.w + 20} ${P.h * .84} L ${P.w + 20} ${P.h + 20} L -20 ${P.h + 20} Z`, '#4A2A22');
  glow(c, P.w * .5, P.h * .52, 460, '#FFC060', .45);
  fig(c, P.w * .5, P.h * .4, .4, { legs: 'stride', arms: ['fist', 'fist'], expr: 'roar', look: [0, .2], tail: 'up', crown: 'band' }, lit(DAY()));
  // kinkaras pouring in from both sides with hammers and maces, like moths into a fire
  const rows = [[.6, .2, 3], [.7, .23, 4], [.8, .27, 4]];
  rows.forEach(([y, k, n], ri) => { for (let j = 0; j < n; j++) for (const s of [-1, 1]) { const x = P.w * (.5 + s * (.48 - j * .07 - ri * .01)); if (s < 0 && ri === 2 && j < 2) continue; rakAt(c, x, P.h * y, k, { r: (j + ri + (s > 0 ? 1 : 0)) % 4, expr: ['rage', 'scream', 'fierce'][(j + ri) % 3], look: [-s, -.5], turn: -s * .4, arms: ['up', 'fist'], hold: (j + ri) % 2 ? 'mace' : 'hammer' }, FIREL()); } });
};

// =================== p30 · the iron bar ===================
ART.beamTear = (c, P) => {
  vgrad(c, P, [[0, '#3A2A2A'], [1, '#8A4A3A']]);
  gate(c, P.w * .5, P.h * 1.2, 1.2, '#B8863A');
  bust(c, P.w * .5, P.h * .4, .42, { expr: 'snarl', look: [0, -.3], arms: ['up', 'up'], crown: 'band' }, lit(DAY()), hanBust);
  strokePath(c, `M ${P.w * .05} ${P.h * .14} L ${P.w * .95} ${P.h * .08}`, '#3A3A44', 34); strokePath(c, `M ${P.w * .05} ${P.h * .14} L ${P.w * .95} ${P.h * .08}`, '#6A6A78', 8);
};
ART.beamFrame = (c, P) => {
  vgrad(c, P, [[0, '#5A4A3A'], [1, '#2A2018']]);
  fillPath(c, `M -20 ${P.h * .6} L ${P.w + 20} ${P.h * .6} L ${P.w + 20} ${P.h + 20} L -20 ${P.h + 20} Z`, '#8A7A6A');
  for (let i = 0; i < 6; i++) strokePath(c, `M ${P.w * (.1 + i * .16)} ${P.h * .6} l ${(i % 2 ? 30 : -30)} 80 l 20 60`, '#3A2E26', 5);
  c.save(); c.translate(P.w * .5, P.h * .56); c.rotate(-.25); fillPath(c, 'M -400 -30 L 400 -30 L 400 30 L -400 30 Z', '#4A4A56'); strokePath(c, 'M -400 -30 L 400 -30 L 400 30 L -400 30 Z', '#1A1A20', 4); for (let i = -3; i <= 3; i++) ellipse(c, i * 100, 0, 10, 10, '#8A8A98'); c.restore();
  for (const [x, a] of [[.3, -1.2], [.66, -1.4]]) { c.save(); c.translate(P.w * x, P.h * .58); c.scale(1.4, 1.4); devaHand(c, [0, 0], a, 'fist', { skin: '#E39A34', skinDk: '#7A4410' }); c.restore(); }
  const R = lcg(3); for (let i = 0; i < 16; i++) { c.save(); c.translate(P.w * (.3 + R() * .5), P.h * (.4 + R() * .4)); c.rotate(R() * 3); fillPath(c, 'M -10 -8 L 12 -6 L 8 10 L -12 6 Z', '#6A5A4A'); c.restore(); }
};
ART.beamSwing = (c, P) => {
  vgrad(c, P, [[0, '#4A2A2A'], [1, '#C8703A']]);
  fillPath(c, `M -20 ${P.h * .86} L ${P.w + 20} ${P.h * .86} L ${P.w + 20} ${P.h + 20} L -20 ${P.h + 20} Z`, '#5A3A2A');
  // the sweep of the bar
  c.save(); c.globalAlpha = .5; for (let i = 0; i < 5; i++) { c.save(); c.translate(P.w * .32, P.h * .42); c.rotate(-.9 + i * .22); strokePath(c, 'M 0 0 L 520 0', '#F4E0C0', 16); c.restore(); } c.restore();
  fig(c, P.w * .3, P.h * .26, .25, { legs: 'stride', arms: ['up', 'up'], expr: 'roar', look: [1, 0], tail: 'stream', crown: 'band' }, lit(DAY()));
  c.save(); c.translate(P.w * .3, P.h * .06); c.rotate(-.12); strokePath(c, 'M -100 0 L 600 0', '#3A3A44', 26); strokePath(c, 'M -100 0 L 600 0', '#7A7A88', 6); c.restore();
  // rakshasas broken and flying
  [[.64, .3, 2.2, 0], [.8, .52, -.9, 1], [.9, .22, 1.4, 2], [.58, .6, .7, 3]].forEach(([x, y, r, i]) => fig(c, P.w * x, P.h * y, .1, { who: 'rk' + i, fangs: true, hair: 'wild', crown: false, stache: true, legs: ['leap', 'run', 'kneel', 'leap'][i], arms: ['up', 'throw'], expr: 'scream', dhoti: '#3A2A22' }, FIREL(), devaFigure, r));
  bodies(c, P, .86, 10, 5, .7);
};
ART.gateSit = (c, P) => {
  vgrad(c, P, [[0, '#2A1A2A'], [1, '#8A4A3A']]);
  gate(c, P.w * .72, P.h * .92, .8, '#B8863A');
  fig(c, P.w * .72, P.h * .2, .1, { legs: 'crouch', arms: [[1.3, -.2, 'fist'], [1.2, .2, 'rest']], expr: 'calm', look: [-.6, .4], tail: 'curl', crown: 'band' }, lit(DAY()));
  bodies(c, P, .78, 40, 8, .55);
};

// =================== p31 · more ===================
ART.jambumali = (c, P) => {
  vgrad(c, P, [[0, '#3A2030'], [1, '#A04A3A']]);
  gate(c, P.w * .14, P.h * 1.02, .6, '#B8863A'); fig(c, P.w * .14, P.h * .38, .055, { legs: 'crouch', arms: ['fist', 'fist'], expr: 'calm', tail: 'curl', crown: 'band' });
  rakAt(c, P.w * .62, P.h * .46, .48, { r: 2, crown: 'mukut', hair: 'long', expr: 'rage', look: [-1, 0], turn: -.3, arms: ['reach', 'fist'], hold: 'bow' }, FIREL());
  for (let i = 0; i < 5; i++) strokePath(c, `M ${P.w * (.4 - i * .03)} ${P.h * (.3 + i * .08)} l ${-P.w * .18} ${-P.h * .02}`, '#F4E0C0', 3);
};
ART.ministersSons = (c, P) => {
  vgrad(c, P, [[0, '#3A2030'], [1, '#C86A3A']]);
  fillPath(c, `M -20 ${P.h * .84} L ${P.w + 20} ${P.h * .84} L ${P.w + 20} ${P.h + 20} L -20 ${P.h + 20} Z`, '#5A3A2A');
  for (let i = 0; i < 7; i++) { const x = P.w * (.95 - i * .13), y = P.h * (.84 + (i % 2) * .04), k = .32; c.save(); c.translate(x, y); c.scale(-k, k); chariot(c, { col: ['#3A1A1A', '#2A2030'][i % 2], gallop: i * .7 }); c.restore(); }
  for (let i = 0; i < 7; i++) rakAt(c, P.w * (.95 - i * .13) + 10, P.h * .52, .12, { r: i % 4, crown: 'mukut', expr: 'fierce', look: [-1, 0], turn: -.3, arms: ['down', 'fist'], hold: 'sword' }, FIREL());
};
ART.generals = (c, P) => {
  vgrad(c, P, [[0, '#2A1A2A'], [1, '#8A3A2A']]);
  gate(c, P.w * .5, P.h * 1.04, .9, '#B8863A');
  fig(c, P.w * .5, P.h * .26, .06, { legs: 'crouch', arms: ['fist', 'fist'], expr: 'calm', tail: 'curl', crown: 'band' });
  [.1, .26, .74, .9].forEach((x, i) => rakAt(c, P.w * x, P.h * .55, .3, { r: i, crown: 'mukut', hair: 'long', expr: ['fierce', 'rage', 'rage', 'fierce'][i], look: [x < .5 ? 1 : -1, -.3], turn: x < .5 ? .3 : -.3, arms: ['down', 'fist'], hold: ['mace', 'sword', 'sword', 'mace'][i] }, FIREL()));
  bodies(c, P, .86, 14, 2, .6);
};

// =================== p32 · Aksha ===================
ART.ravanaLooks = (c, P) => {
  vgrad(c, P, [[0, '#2A1018'], [1, '#6A2A2A']]);
  for (let i = 0; i < 5; i++) strokePath(c, `M ${P.w * (.08 + i * .22)} 0 L ${P.w * (.08 + i * .22)} ${P.h}`, '#8A6A2A', 26);
  ravAt(c, P.w * .56, P.h * .52, .38, { expr: 'fierce', look: [1, .2], arms: ['down', 'down'], extra: 3 }, FIREL());
  bust(c, P.w * .9, P.h * .66, .3, { ...AKSHA, expr: 'calm', look: [-1, 0], turn: -.3, arms: ['down', 'down'] }, FIREL());
};
function akshaCar(c, x, y, k, o = {}) {
  c.save(); c.translate(x, y); c.scale(k * (o.flip ? -1 : 1), k);
  for (let i = 0; i < 4; i++) { c.save(); c.translate(520 + i * 70, 40 - i * 10); c.scale(.8, .8); horse(c, { col: ['#E8E0D0', '#D8CCB8'][i % 2], gallop: (o.t || 0) + i * .6 }); c.restore(); }
  strokePath(c, 'M 40 -40 C 200 -60 360 -110 520 -150', '#8A5A1A', 14);
  const C = 'M -200 -20 L 90 -20 L 110 -60 C 100 -200 40 -260 -40 -280 L -40 -240 C 0 -220 30 -180 40 -100 L -180 -100 L -200 -160 Z';
  fillPath(c, C, '#E8B84A'); strokePath(c, C, '#8A5A1A', 4);
  wheel(c, -60, 0, 120, { col: '#8A5A1A', iron: '#3A2A1A' });
  c.restore();
}
ART.aksha = (c, P) => {
  vgrad(c, P, [[0, '#3A1A1A'], [.6, '#E86A2A'], [1, '#FFC060']]);
  glow(c, P.w * .38, P.h * .5, 420, '#FFD27A', .5);
  flames(c, P.w * .38, P.h * .5, 260, 18, 140, ['#E8401A', '#FFB040'], 6);
  akshaCar(c, P.w * .26, P.h * .96, .5, { t: P.t });
  bust(c, P.w * .3, P.h * .42, .5, { ...AKSHA, expr: 'fierce', look: [1, 0], turn: .3, arms: ['down', 'fist'], hold: 'bow' }, lit(DAY()));
};
ART.akshaArrows = (c, P) => {
  vgrad(c, P, [[0, '#2A1A2A'], [1, '#8A3A2A']]);
  bust(c, P.w * .64, P.h * .4, .52, { expr: 'roar', look: [-.6, 0], turn: -.2, arms: ['fist', 'fist'], crown: 'band', blood: .7 }, lit(DAY()), hanBust);
  for (const [x, y] of [[.56, .78], [.66, .84], [.61, .9]]) { const ex = P.w * x - P.w * .22, ey = P.h * y - P.h * .03; strokePath(c, `M ${P.w * x} ${P.h * y} L ${ex} ${ey}`, '#5A3A1A', 6); for (const s of [-1, 1]) fillPath(c, `M ${ex} ${ey} l -26 ${s * 14} l 34 ${-s * 8} Z`, '#E8E0D0'); ellipse(c, P.w * x, P.h * y, 9, 9, '#9E1414'); }
  for (let i = 0; i < 8; i++) strokePath(c, `M ${P.w * .02} ${P.h * (.3 + i * .08)} l ${P.w * .26} ${P.h * .02}`, 'rgba(255,240,200,.8)', 2.5);
};

// =================== p33 · the young sun ===================
ART.hanAdmires = (c, P) => {
  vgrad(c, P, [[0, '#2A1A2A'], [.6, '#C86A3A'], [1, '#F2A060']]);
  redSun(c, P.w * .2, P.h * .62, 110, { a: .5 });
  akshaCar(c, P.w * .18, P.h * .98, .3, { t: P.t });
  bust(c, P.w * .2, P.h * .64, .24, { ...AKSHA, expr: 'fierce', look: [1, 0], turn: .3, arms: ['down', 'fist'], hold: 'bow' }, lit(DAY()));
  bust(c, P.w * .72, P.h * .58, .62, { expr: 'calm', look: [-1, .3], turn: -.3, arms: ['down', 'down'], crown: 'band', blood: .8 }, lit(DAY(-4, -4)), hanBust);
  for (const [x, y] of [[.66, .9], [.72, .94]]) { strokePath(c, `M ${P.w * x} ${P.h * y} l ${-90} -10`, '#5A3A1A', 6); ellipse(c, P.w * x, P.h * y, 7, 7, '#9E1414'); }
};
ART.hanDecides = (c, P) => {
  vgrad(c, P, [[0, '#1A1020'], [1, '#5A2A2A']]);
  c.save(); c.translate(P.w * .5, P.h * .7); c.scale(1.5, 1.5); figure(c, (c) => hanHead(c, { expr: 'fierce', look: [-.8, 0], blood: .6, t: P.t }), lit(DAY())); c.restore();
};
ART.babyInset = (c, P) => {
  vgrad(c, P, [[0, '#E8A040'], [1, '#FFE0A0']]);
  redSun(c, P.w * .72, P.h * .3, 80);
  baby(c, P.w * .38, P.h * .62, .3, .5, { pose: 'leap', arms: [[-2.0, .2], [-1.25, -.1]], legs: [[2.4, .3], [2.0, .25]], expr: 'grin', look: [.8, -.5], red: .6, t: P.t });
  c.fillStyle = 'rgba(255,200,120,.18)'; c.fillRect(0, 0, P.w, P.h);
};

// =================== p34 · whirled ===================
ART.horsesDie = (c, P) => {
  vgrad(c, P, [[0, '#3A1A1A'], [1, '#C8703A']]);
  fillPath(c, `M -20 ${P.h * .82} L ${P.w + 20} ${P.h * .82} L ${P.w + 20} ${P.h + 20} L -20 ${P.h + 20} Z`, '#5A3A2A');
  // the eight horses down, the car tipped over, dust
  for (let i = 0; i < 5; i++) { c.save(); c.translate(P.w * (.06 + i * .09), P.h * (.86 + (i % 2) * .05)); c.rotate(-.3 + (i % 2) * .5); c.scale(.24, -.24); horse(c, { col: '#D8C8A8' }); c.restore(); }
  c.save(); c.translate(P.w * .58, P.h * .86); c.rotate(-.5); c.scale(.3, .3); const C = 'M -200 -20 L 90 -20 L 110 -60 C 100 -200 40 -260 -40 -280 L -40 -240 C 0 -220 30 -180 40 -100 L -180 -100 L -200 -160 Z'; fillPath(c, C, '#E8B84A'); strokePath(c, C, '#8A5A1A', 6); c.restore();
  wheel(c, P.w * .66, P.h * .62, 46, { col: '#8A5A1A', spin: 2 });
  for (let i = 0; i < 9; i++) { const R = lcg(i + 2); puffs(c, P.w * (.05 + R() * .6), P.h * (.84 + R() * .08), 160, '#9A7A5A', i, 5); }
  // Aksha leaps into the sky, sword raised
  fig(c, P.w * .8, P.h * .14, .16, { ...AKSHA, legs: 'leap', arms: ['up', 'fist'], hold: 'sword', expr: 'rage', look: [-1, 0] }, lit(DAY()), devaFigure, -.5);
};
ART.whirl = (c, P) => {
  vgrad(c, P, [[0, '#1A1030'], [1, '#C86A3A']]);
  // Hanuman holds Aksha by the feet and swings him round and round: the body radial from his hands, ghosts round the ring
  const cx = P.w * .5, cy = P.h * .4, rad = 290, k = rad / 1150;
  for (let i = 0; i < 5; i++) { c.beginPath(); c.arc(cx, cy, rad - 20 + i * 18, 0, TAU); c.strokeStyle = 'rgba(255,240,210,.45)'; c.lineWidth = 6 - i; c.stroke(); }
  const akshaAt = (a, light) => { c.save(); c.translate(cx, cy); c.rotate(a + Math.PI / 2); c.scale(k, k); c.translate(0, -1150); figure(c, (c) => devaFigure(c, { ...AKSHA, legs: 'stand', arms: ['up', 'up'], expr: 'scream' }), light); c.restore(); };
  for (let i = 1; i < 5; i++) akshaAt(-.5 - i * .7, { ...lit(DAY()), alpha: .35 - i * .06 });
  fig(c, cx, cy + 120, .3, { legs: 'stride', arms: ['up', 'up'], expr: 'roar', look: [.6, -1], tail: 'stream', crown: 'band', blood: .6 }, lit(DAY()));
  akshaAt(-.5, lit(DAY()));
};
ART.akshaDead = (c, P) => {
  vgrad(c, P, [[0, '#2A1A1A'], [1, '#5A2A2A']]);
  fillPath(c, `M -20 ${P.h * .7} L ${P.w + 20} ${P.h * .7} L ${P.w + 20} ${P.h + 20} L -20 ${P.h + 20} Z`, '#4A3028');
  fillPath(c, ellP(P.w * .22, P.h * .86, 210, 32), '#5A0A10');
  c.save(); c.translate(P.w * .05, P.h * .84); c.rotate(-1.5); c.scale(.2, .2); figure(c, (c) => devaFigure(c, { ...AKSHA, crown: false, legs: [[1.3, .4], [1.8, -.5]], arms: [[2.6, .4, 'rest'], [.3, .5, 'rest']], expr: 'sleep', look: [0, 0] }), { ...lit(DAY()), tint: ['#3A2A3A', .3] }); c.restore();
  c.save(); c.translate(P.w * .42, P.h * .88); c.rotate(.5); c.scale(.24, .24); fillPath(c, 'M -80 0 L -74 -60 C -60 -150 60 -150 74 -60 L 80 0 Z', '#E8B84A'); strokePath(c, 'M -80 0 L -74 -60 C -60 -150 60 -150 74 -60 L 80 0 Z', '#8A5A1A', 6); c.restore();
};

// =================== p35 · bound ===================
ART.indrajit = (c, P) => {
  vgrad(c, P, [[0, '#14102A'], [1, '#4A2A5A']]);
  glow(c, P.w * .62, P.h * .5, 380, '#FFE08A', .35);
  puffs(c, P.w * .36, P.h * .96, 700, '#3A2A5A', 4, 8);
  bust(c, P.w * .36, P.h * .4, .48, { ...INDRAJIT, expr: 'fierce', look: [1, 0], turn: .3, arms: ['point', 'fist'], hold: 'bow' }, lit(DAY()));
  // the Brahma weapon: an arrow of light
  strokePath(c, `M ${P.w * .5} ${P.h * .42} L ${P.w * .98} ${P.h * .36}`, '#FFF6D0', 10); glow(c, P.w * .9, P.h * .37, 120, '#FFE08A', .9);
  fillPath(c, `M ${P.w * .98} ${P.h * .36} l -40 -20 l 6 20 l -6 20 Z`, '#FFFFFF');
};
function coils(c, cx, cy, rx, ry, n, seed = 1) { const R = lcg(seed); for (let i = 0; i < n; i++) { const y = cy - ry + (i + .5) / n * ry * 2, a = (R() - .5) * .3; c.save(); c.translate(cx, y); c.rotate(a); c.beginPath(); c.ellipse(0, 0, rx, 26, 0, 0, TAU); c.strokeStyle = 'rgba(255,224,138,.95)'; c.lineWidth = 12; c.stroke(); c.restore(); } glow(c, cx, cy, Math.max(rx, ry) * 1.2, '#FFE08A', .4); }
ART.bound = (c, P) => {
  vgrad(c, P, [[0, '#14102A'], [1, '#4A2A5A']]);
  fig(c, P.w * .42, P.h * .28, .2, { legs: 'leap', arms: ['side', 'side'], expr: 'calm', look: [0, 1], tail: 'stream', crown: 'band' }, lit(DAY()), hanFigure, .5);
  coils(c, P.w * .38, P.h * .52, 140, 200, 6, 3);
  speedLines(c, P.w * .4, P.h * 1.2, 20, 600, 900, 'rgba(255,255,255,.5)', 3, 2, -Math.PI * .6, -Math.PI * .4);
};
ART.calmEyes = (c, P) => {
  vgrad(c, P, [[0, '#14102A'], [1, '#3A2A4A']]);
  c.save(); c.translate(P.w * .5, P.h * .44); c.scale(1.6, 1.6); figure(c, (c) => hanHead(c, { expr: 'calm', look: [0, 0], t: P.t }), lit(DAY())); c.restore();
  coils(c, P.w * .5, P.h * .86, 260, 90, 3, 5);
};

// =================== p36 · Ravana's court ===================
function hall(c, P) {
  vgrad(c, P, [[0, '#2A1018'], [1, '#5A2A2A']]);
  for (let i = 0; i < 4; i++) { const x = P.w * (.12 + i * .26); fillPath(c, `M ${x - 14} 0 L ${x + 14} 0 L ${x + 14} ${P.h} L ${x - 14} ${P.h} Z`, '#6A4A22'); strokePath(c, `M ${x - 14} 0 L ${x - 14} ${P.h}`, '#3A2810', 3); }
  fillPath(c, `M -20 ${P.h * .84} L ${P.w + 20} ${P.h * .84} L ${P.w + 20} ${P.h + 20} L -20 ${P.h + 20} Z`, '#3A1A1A');
}
ART.court = (c, P) => {
  hall(c, P);
  // the crystal throne, blazing with gems
  const T = `M ${P.w * .5 - 300} ${P.h * .9} L ${P.w * .5 - 260} ${P.h * .1} Q ${P.w * .5} ${P.h * -.05} ${P.w * .5 + 260} ${P.h * .1} L ${P.w * .5 + 300} ${P.h * .9} Z`;
  fillPath(c, T, 'rgba(200,230,255,.55)'); strokePath(c, T, '#E8F4FF', 5);
  const R = lcg(4); for (let i = 0; i < 30; i++) { const a = R() * Math.PI, x = P.w * .5 + Math.cos(a) * 280 * (.6 + R() * .4), y = P.h * .5 - Math.sin(a) * P.h * .4; ellipse(c, x, y, 7, 7, ['#C21E2A', '#1E8A5A', '#3A6AE8', '#F0B83A'][i % 4]); }
  ravAt(c, P.w * .5, P.h * .34, .34, { expr: 'fierce', look: [-.6, .6], arms: ['down', 'down'], extra: 4 }, FIREL());
  // Hanuman bound before him, small, seen from behind and to the side
  bust(c, P.w * .14, P.h * .78, .3, { expr: 'calm', look: [1, -.3], turn: .4, arms: ['side', 'side'], crown: 'band' }, FIREL(), hanBust);
  rope(c, [[P.w * .02, P.h * .86], [P.w * .26, P.h * .82], [P.w * .04, P.h * .94], [P.w * .26, P.h * .92]]);
  [.84, .94].forEach((x, i) => rakAt(c, P.w * x, P.h * .76, .22, { r: i + 1, expr: 'laugh', look: [-1, 0], turn: -.3, arms: ['down', 'down'] }, FIREL()));
};
ART.hanSpeaks = (c, P) => { hall(c, P); bust(c, P.w * .5, P.h * .8, .36, { expr: 'fierce', look: [.6, 0], turn: .2, arms: ['side', 'side'], crown: 'band' }, FIREL(), hanBust); rope(c, [[P.w * .25, P.h * .98], [P.w * .75, P.h * .9]]); };
ART.ravanaKill = (c, P) => { hall(c, P); ravAt(c, P.w * .5, P.h * .82, .3, { expr: 'rage', look: [-.6, 0], arms: ['down', 'point'], extra: 3 }, FIREL()); };
ART.vibhishana = (c, P) => { hall(c, P); bust(c, P.w * .5, P.h * .8, .34, { ...VIBHI, expr: 'speak', look: [.6, 0], turn: .2, arms: ['down', 'abhaya'] }, FIREL()); };
ART.ravanaBurn = (c, P) => { hall(c, P); ravAt(c, P.w * .5, P.h * .82, .3, { expr: 'laugh', look: [0, 0], arms: ['down', 'fist'], extra: 3 }, FIREL()); };

// =================== p37 · be cool ===================
ART.tailRags = (c, P) => {
  vgrad(c, P, [[0, '#1A1020'], [1, '#5A3A3A']]);
  lankaCity(c, P, P.h * .72, .45, { seed: 9, night: true });
  // torches
  for (const x of [.08, .36, .62, .92]) { strokePath(c, `M ${P.w * x} ${P.h} L ${P.w * x} ${P.h * .58}`, '#3A2A1A', 10); glow(c, P.w * x, P.h * .56, 70, '#FF9A2A', .7); blaze(c, P.w * x, P.h * .6, 40, 60, Math.round(x * 100)); }
  // Hanuman led through the streets, the tail wound in rags and lit
  bust(c, P.w * .5, P.h * .42, .32, { expr: 'calm', look: [-.4, 0], arms: ['side', 'side'], crown: 'band' }, FIREL(), hanBust);
  rope(c, [[P.w * .42, P.h * .82], [P.w * .58, P.h * .78], [P.w * .2, P.h * .74]]);
  const T = [[P.w * .54, P.h * .8], [P.w * .7, P.h * .7], [P.w * .8, P.h * .5], [P.w * .86, P.h * .3]];
  limb(c, T, [30, 40, 42, 36], '#C8B490'); for (let i = 0; i < 7; i++) { const p = [lerp(T[1][0], T[3][0], i / 7), lerp(T[1][1], T[3][1], i / 7)]; strokePath(c, `M ${p[0] - 26} ${p[1] - 14} q 26 30 52 22`, '#7A6A4A', 4); }
  glow(c, P.w * .84, P.h * .32, 120, '#FF8A1E', .9); blaze(c, P.w * .85, P.h * .36, 90, 150, 3);
  [.08, .2, .34, .66, .8, .94].forEach((x, i) => rakAt(c, P.w * x, P.h * .92, .15, { r: i % 4, expr: i % 2 ? 'laugh' : 'smile', look: [x < .5 ? 1 : -1, -.4], turn: x < .5 ? .3 : -.3, arms: ['up', 'fist'] }, FIREL()));
};
ART.sitaPrays = (c, P) => {
  groveBg(c, P, { seed: 3 });
  glow(c, P.w * .3, P.h * .5, 260, '#FFE8B0', .3);
  sitaAt(c, P.w * .3, P.h * .48, .42, { expr: 'sleep', look: [0, 0], arms: ['namaste', 'namaste'] }, NIGHTL());
  glow(c, P.w * .9, P.h * .2, 120, '#FF8A2A', .4);
};
ART.tailCool = (c, P) => {
  vgrad(c, P, [[0, '#1A1020'], [1, '#6A3A2A']]);
  // the tail curling up in front, ablaze, the tip touched with frost
  const T = [[P.w * .9, P.h + 20], [P.w * .86, P.h * .6], [P.w * .8, P.h * .3], [P.w * .7, P.h * .18]];
  limb(c, T, [40, 38, 34, 28], '#E39A34');
  blaze(c, P.w * .82, P.h * .44, 160, 260, 7);
  for (let i = 0; i < 10; i++) { const R = lcg(i + 9); const x = P.w * (.66 + R() * .12), y = P.h * (.12 + R() * .14); strokePath(c, `M ${x - 8} ${y} L ${x + 8} ${y} M ${x} ${y - 8} L ${x} ${y + 8}`, '#DDF4FF', 3); }
  glow(c, P.w * .7, P.h * .18, 60, '#BEE8FF', .7);
  c.save(); c.translate(P.w * .38, P.h * .56); c.scale(1.35, 1.35); figure(c, (c) => hanHead(c, { expr: 'awe', look: [1, -.5], crown: 'band', t: P.t }), FIREL()); c.restore();
};

// =================== p38–39 · Lanka burns ===================
ART.burn1 = (c, P) => {
  vgrad(c, P, [[0, '#14080E'], [.5, '#6A1A14'], [1, '#C8501E']]);
  smoke(c, P, 8, 3, '#2A1A1E');
  lankaCity(c, P, P.h * .78, .9, { seed: 4, burn: .8, bg: '#6A1A14' }); lankaCity(c, P, P.h * 1.04, 1.5, { seed: 5, burn: .8, bg: '#6A1A14' });
  // roof to roof, the tail a torch
  const T = [[P.w * .6, P.h * .42], [P.w * .4, P.h * .48], [P.w * .2, P.h * .44], [P.w * .06, P.h * .36]];
  limb(c, T, [34, 32, 28, 22], '#E39A34'); glow(c, P.w * .06, P.h * .36, 140, '#FF8A1E', .9); blaze(c, P.w * .07, P.h * .38, 120, 200, 11);
  glow(c, P.w * .62, P.h * .32, 300, '#FFD27A', .35);
  fig(c, P.w * .7, P.h * .24, .26, { legs: 'leap', arms: ['reach', 'up'], expr: 'roar', look: [1, 0], tail: false, crown: 'band' }, FIREL(), hanFigure, 1.0);
};
ART.burn2 = (c, P) => {
  vgrad(c, P, [[0, '#0A0408'], [.3, '#4A1410'], [1, '#2A0A08']]);
  smoke(c, P, 9, 7, '#1E1216');
  glow(c, P.w * .5, P.h * .7, 700, '#FF6A1E', .45);
  for (const [y, k, sd] of [[.5, .55, 3], [.68, .75, 5], [.88, 1, 8], [1.08, 1.3, 2]]) lankaCity(c, { ...P, h: P.h }, P.h * y, k, { seed: sd, burn: .95, bg: '#4A1410' });
  // rivers of melted gold, silver and gems running out of the houses
  for (let i = 0; i < 4; i++) { const y = P.h * (.56 + i * .19); strokePath(c, `M -20 ${y} C ${P.w * .3} ${y + 30} ${P.w * .6} ${y - 30} ${P.w + 20} ${y + 10}`, ['#FFD040', '#F0F0F8', '#FFB020', '#FFE07A'][i], 16); }
  glow(c, P.w * .5, P.h * .14, 200, '#FFE08A', .3);
  fig(c, P.w * .52, P.h * .08, .08, { legs: 'leap', arms: ['reach', 'reach'], expr: 'roar', tail: 'stream', crown: 'band' }, FIREL(), hanFigure, 1.2);
};

// =================== p40 · Sita ===================
ART.shoreLooks = (c, P) => {
  vgrad(c, P, [[0, '#14080E'], [.5, '#8A2A1A'], [.62, '#C8501E'], [.621, '#3A1A1A'], [1, '#1A0E10']]);
  lankaCity(c, P, P.h * .62, .55, { seed: 7, burn: .9, bg: '#8A2A1A' }); smoke(c, P, 3, 2, '#2A1A1E');
  for (let i = 0; i < 6; i++) strokePath(c, `M ${P.w * (.1 + i * .15)} ${P.h * (.7 + i * .03)} q 60 -6 120 0`, 'rgba(255,140,80,.5)', 3);
  fillPath(c, `M ${P.w * .55} ${P.h + 20} Q ${P.w * .75} ${P.h * .76} ${P.w + 20} ${P.h * .8} L ${P.w + 20} ${P.h + 20} Z`, '#3A2E26');
  bust(c, P.w * .8, P.h * .72, .3, { expr: 'calm', look: [-1, -.3], turn: -.5, arms: ['down', 'down'], crown: 'band' }, FIREL(), hanBust);
  strokePath(c, `M ${P.w * .7} ${P.h * .96} C ${P.w * .6} ${P.h * .9} ${P.w * .5} ${P.h * .94} ${P.w * .42} ${P.h * .88}`, '#E39A34', 22);
};
ART.horror = (c, P) => { vgrad(c, P, [[0, '#3A0A0A'], [1, '#C8501E']]); c.save(); c.translate(P.w * .5, P.h * .8); c.scale(.95, .95); figure(c, (c) => hanHead(c, { expr: 'grief', look: [0, .5], crown: 'band', t: P.t }), FIREL()); c.restore(); };
ART.wisdom = (c, P) => { vgrad(c, P, [[0, '#2A0A0A'], [1, '#6A2A1A']]); bust(c, P.w * .5, P.h * .84, .3, { expr: 'grief', look: [0, 1], tilt: .15, arms: ['throat', 'throat'], crown: 'band' }, FIREL(), hanBust); };
ART.sitaAlive = (c, P) => {
  groveBg(c, P, { seed: 2, dawn: true }); smoke(c, P, 4, 6, 'rgba(60,40,40,.6)');
  strokePath(c, `M ${P.w * .3} ${P.h + 20} C ${P.w * .28} ${P.h * .7} ${P.w * .32} ${P.h * .4} ${P.w * .3} ${P.h * .1}`, '#2A1E1A', 40); puffs(c, P.w * .3, P.h * .14, 460, '#2E5A34', 9, 8);
  glow(c, P.w * .3, P.h * .62, 200, '#FFE8B0', .4);
  sitaAt(c, P.w * .3, P.h * .56, .36, { expr: 'kind', look: [1, -.2], turn: .3, arms: ['down', 'down'] }, lit(DAY()));
  bust(c, P.w * .76, P.h * .58, .36, { expr: 'tender', look: [-1, 0], turn: -.3, arms: ['namaste', 'namaste'], crown: 'band' }, lit(DAY()), hanBust);
};
