// alive.js: "Is HANUMAN alive?" (ad 84). Valmiki Ramayana, Yuddha Kanda 74: Indrajit's Brahmastra fells sixty-seven
// crore vanaras, and Ram and Lakshman with them. Hanuman and Vibhishana walk the field with torches and find old
// Jambavan, who cannot see for arrows; he asks only whether Hanuman lives ("if Hanuman lives, the army, though killed,
// lives"). He sends him to the Himalaya, to the mountain of herbs between Kailasa and Rishabha. Hanuman stands on
// Trikuta like a second mountain, leaps, finds the mountain blazing; the herbs hide; he tears the peak out and
// carries it back shining like a second sun; on its fragrance Ram, Lakshman and the army rise as if from sleep.
// 3D (the Himalaya, the map) with Cinematic silhouettes (the battlefield, the figures). STORYBOARD.md has the plan.
LOOK.bloom = .05; LOOK.vignette = .66; LOOK.grain = .075;
const TL = { A: 0, B: 4.0, C: 7.6, D: 12.2, E: 16.0, F: 21.6, G: 26.2, H: 28.2, I: 33.0, J: 38.5, K: 43.5, EYES: 45.0, L: 47.5, RIP: 50.8, M: 56.4, N: 61.4, O: 67.4, CARD: 77.0, END: 82.5 };

// a soft dark band behind the caption on the cloud-bright 3D shots
POST.push((c, t) => { const a = seg(t, TL.H, TL.H + .5) * (1 - seg(t, TL.N - .3, TL.N + .3)); if (a <= 0) return; const g = c.createLinearGradient(0, 1180, 0, 1560); g.addColorStop(0, 'rgba(4,6,18,0)'); g.addColorStop(.4, `rgba(4,6,18,${.5 * a})`); g.addColorStop(.75, `rgba(4,6,18,${.5 * a})`); g.addColorStop(1, 'rgba(4,6,18,0)'); c.fillStyle = g; c.fillRect(0, 1180, W, 380); });
// ---------- captions ----------
const lit = (txt) => txt.split(/\s+/).filter(w => w !== '|').map(() => -1);
say(-1, 3.8, '*67* *crore* warriors. | One *Brahmastra*.', { y: 560, size: 62, at: lit('*67* *crore* warriors. | One *Brahmastra*.') });
say(4.2, 7.4, 'Even *Ram* and *Lakshman* | lay senseless.', { y: 600 });
say(7.9, 10.3, 'Old *Jambavan*, | blind with arrows,', { y: 560 });
say(10.4, 12.1, 'asked only one thing:', { y: 560 });
say(12.7, 15.8, 'Is *HANUMAN* | alive?', { y: 560, size: 96 });
say(16.3, 18.5, 'Why not ask for *Ram*?', { y: 560 });
say(18.7, 21.5, '“If *Hanuman* lives, | we ALL live.”', { y: 560, size: 62 });
say(21.9, 24.7, '“Go to the *Himalaya*. | Bring the herbs.”', { y: 1330 });
say(28.6, 31.2, 'From *Lanka* | to the *Himalaya*.', { y: 1360 });
say(33.5, 36.8, 'A mountain *blazing* | with healing herbs.', { y: 1330 });
say(38.9, 42.2, 'But the herbs saw him… | and *hid*.', { y: 1330 });
say(44.0, 47.2, 'No mercy for *Ram*? | Then he’d take it ALL.', { y: 1330 });
say(53.3, 56.2, 'He tore out | the *whole* *mountain*.', { y: 1350, size: 62 });
say(56.7, 59.8, 'He crossed the night | like a *second* *sun*.', { y: 1340 });
say(61.7, 64.0, 'One breath of its | fragrance…', { y: 560 });
say(64.2, 67.2, 'and they *all* rose, | as if from sleep.', { y: 560 });
say(67.8, 70.6, 'When all seems lost, | ask only one thing:', { y: 560 });
say(70.9, 73.8, 'Is *Hanuman* | with you?', { y: 600, size: 84 });
say(74.0, 76.9, 'Comment | *JAI* *HANUMAN*', { y: 600, size: 76 });

// ---------- the 2D sets ----------
// the battlefield at night: rows of the fallen, darker toward us, against the smoke-lit haze of the horizon.
// o: dy (the horizon moved down), from/to (rows drawn), gold (the herbs' light arriving), rise (they stand), fires
const FROWS = [[1090, .3, 14], [1124, .4, 12], [1172, .54, 10], [1240, .74, 8], [1340, 1.0, 7], [1480, 1.36, 6], [1680, 1.9, 5]];
function field(c, cam, t, o = {}) {
  const gold = o.gold ?? 0, rise = o.rise ?? 0, dy = o.dy ?? 0, hz = 1090 + dy;
  const G = (a, b) => mixCol(a, b, gold);
  plane(c, cam, 0, (c) => { sky(c, [[0, G('#04060E', '#1E1630')], [hz - 620, G('#10162E', '#4A2E4A')], [hz - 260, G('#3E2A3C', '#A8623E')], [hz - 80, G('#A05C36', '#F0A858')], [hz + 10, G('#D8884A', '#FFD890')], [1920, G('#D8884A', '#FFD890')]]); stars(c, 110, 4, t, .8 * (1 - gold * .8)); });
  plane(c, cam, .1, (c) => { glow(c, 300, hz - 20, 620, '#FFA050', .3); glow(c, 860, hz - 10, 520, '#FF9040', .26);
    if (gold > 0) { glow(c, 880, hz - 620, 1000 * gold, '#FFC060', .5 * gold); glow(c, 880, hz - 620, 300 * gold, '#FFF4D0', .9 * gold); rays(c, 880, hz - 620, { n: 11, len: 1800, col: '#FFE0A0', a: .1 * gold, t, spread: 2.4, dir: 2.1, w: 110 }); } });
  plane(c, cam, .2, (c) => { ridge(c, hz - 44, 46, 7, G('#7C4630', '#A8703A')); for (let i = 0; i < 9; i++) { const x = 40 + i * 127 + hash(i) * 50, h = 50 + hash(i * 3) * 70; c.save(); c.translate(x, hz - 40); c.rotate((hash(i * 7) - .5) * .5); c.fillStyle = G('#6A3A2A', '#8A5A30'); c.fillRect(-1.5, -h, 3, h); if (i % 3 === 0) poly(c, [[1, -h], [34, -h + 6], [20, -h + 14], [32, -h + 24], [1, -h + 22]], c.fillStyle); c.restore(); } });
  FROWS.forEach(([y0, s, n], r) => { if (r < (o.from ?? 0) || r > (o.to ?? 6)) return; const y = y0 + dy * (1 - r / 14), q = r / 6, col = G(mixCol('#5E3626', '#050408', Math.pow(q, .6)), mixCol('#7A5226', '#0A0706', Math.pow(q, .6)));
    plane(c, cam, .5 + r * .1, (c) => {
      ridge(c, y, 9 * s, 20 + r, col);
      for (let i = 0; i < n; i++) {
        const sd = r * 31 + i, x = (i + .15 + hash(sd) * .7) / n * (W + 240) - 120, yy = y + 2 * s;
        const k = rise > 0 ? ease(seg(rise, hash(sd * 3.3) * .55, hash(sd * 3.3) * .55 + .4)) : 0;
        if (k < .98) { c.save(); c.globalAlpha = 1 - k; fallen(c, x, yy, s, sd, col); c.restore(); }
        if (k > .02) warrior(c, x, yy, s * .92, { col, k, t, flip: hash(sd * 1.9) < .5, arm: k * (hash(sd * 5.1) < .6 ? 1 : .2), mace: hash(sd * 7.7) < .5 });
        if (hash(sd * 9.9) < .2) { c.save(); c.translate(x + 70 * s, yy); c.rotate((hash(sd * 4.3) - .5) * .6); c.fillStyle = col; c.fillRect(-2 * s, -230 * s, 4 * s, 230 * s); poly(c, [[2 * s, -230 * s], [70 * s, -214 * s], [40 * s, -196 * s], [66 * s, -176 * s], [2 * s, -180 * s]], col); c.restore(); }
      }
      if (o.fires !== false) for (const [fr, fx, fk] of [[1, 170, 1], [2, 790, 1.1], [3, 360, 1.2], [5, 930, 1.1]]) if (fr === r) torchFire(c, fx, y - 2 * s, s * 1.5 * fk * (1 - gold * .6), t, fr * 7);
      if (r < 5) haze(c, y + 20 * s, 150 * s, G('#C8703A', '#FFC878'), .13 - r * .015);
    }); });
  plane(c, cam, 1.3, (c) => { motes(c, { n: 60, seed: 9, box: [-100, 400, W + 100, 1900], r: 2.6, col: '#FFB060', a: .75 * (1 - gold), vx: 18, vy: -70, t }); if (gold > 0) motes(c, { n: 140, seed: 21, box: [-100, 300, W + 100, 1900], r: 3.4, col: '#FFE6A0', a: .85 * gold, vx: -90, vy: 26, t }); });
}
const RIMW = { edge: { col: '#FFC890', w: 2, a: .55 }, rim: { col: '#FFB060', dx: 6, dy: -3, a: .85, blur: 4 } };

// ================= A · the hook: the field of the fallen =================
SHOTS.push({ a: 0, b: TL.B + .5, draw(c, u, t) {
  field(c, { z: lerp(1.0, 1.1, ease(u / 4.6)), fx: 540, fy: 1100, x: lerp(0, -30, u / 4.6) }, t);
} });
// ================= B · Ram and Lakshman =================
SHOTS.push({ a: TL.B, b: TL.C + .5, xf: .5, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.1, ease(u / 4.2)), fx: 540, fy: 1400 };
  field(c, cam, t, { dy: 330, to: 2, fires: false });
  plane(c, cam, 1, (c) => {
    fillPath(c, 'M -100 1640 C 150 1560 380 1530 600 1540 C 820 1550 1000 1590 1180 1650 L 1180 2000 L -100 2000 Z', '#060509');
    figure(c, (f) => { princeDown(f, 400, 1556, 1.0, '#060509', { bow: -150, lean: .16 }); princeDown(f, 790, 1574, .9, '#060509', { bow: 20, lean: -.1 }); }, RIMW);
    fallen(c, 120, 1760, 1.7, 5, '#040307'); fallen(c, 960, 1820, 1.9, 9, '#040307');
  });
  plane(c, cam, 1.3, (c) => motes(c, { n: 40, seed: 5, box: [-100, 600, W + 100, 1900], r: 2.6, col: '#FFB060', a: .6, vx: 14, vy: -60, t }));
} });
// ================= C · the torches find Jambavan =================
const jamb = (c, t, k, o = {}) => figure(c, (f) => { f.translate(o.x ?? 560, o.y ?? 1560); f.scale(k, k); jambavanDown(f, { t, beard: '#100D14', reach: o.reach, col: '#060509', rock: '#0A080C' }); },
  { edge: { col: '#FFC890', w: 2, a: .4 }, rim: { col: '#FFB060', dx: o.dx ?? -7, dy: -3, a: o.warm ?? .9, blur: 4 } });
const mound = (c) => fillPath(c, 'M -100 1640 C 150 1600 380 1580 600 1586 C 820 1590 1000 1610 1180 1650 L 1180 2000 L -100 2000 Z', '#060509');
SHOTS.push({ a: TL.C, b: TL.D + .4, xf: .5, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.1, ease(u / 5)), fx: 620, fy: 1400 }, ap = ease(seg(u, .1, 4.0));
  field(c, cam, t, { dy: 330, to: 2, fires: false });
  plane(c, cam, 1, (c) => {
    mound(c);
    const x1 = lerp(-160, 250, ap), x2 = lerp(-340, 90, ap);
    const f2 = warrior(c, x2, 1612, 1.0, { t, walk: ap < 1, crown: true, tail: false, torch: true, arm: .75, col: '#060509' });
    const f1 = warrior(c, x1, 1604, 1.06, { t, walk: ap < 1, crown: true, torch: true, arm: .8, col: '#060509' });
    jamb(c, t, .84, { x: 660, y: 1600, warm: .2 + .8 * ap });
    torchFire(c, f2[0], f2[1], 1, t, 2); torchFire(c, f1[0], f1[1], 1.1, t, 5);
    fallen(c, 930, 1800, 1.8, 8, '#040307');
  });
  plane(c, cam, 1.3, (c) => motes(c, { n: 40, seed: 15, box: [-100, 600, W + 100, 1900], r: 2.6, col: '#FFB060', a: .6, vx: 14, vy: -60, t }));
} });
// ================= D · "Is Hanuman alive?" =================
SHOTS.push({ a: TL.D, b: TL.E + .4, xf: .35, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.08, ease(u / 4.2)), fx: 560, fy: 900 };
  plane(c, cam, 0, (c) => { sky(c, [[0, '#04060E'], [500, '#141830'], [1000, '#5A3438'], [1500, '#B86A3A'], [1920, '#D8884A']]); stars(c, 60, 4, t, .6); glow(c, 80, 1250, 800, '#FF9A40', .3 + .04 * Math.sin(t * 9)); });
  plane(c, cam, .5, (c) => { ridge(c, 1560, 40, 5, '#5A3426'); haze(c, 1500, 300, '#C8703A', .2); });
  plane(c, cam, 1, (c) => jamb(c, t, 2.2, { x: 120, y: 1930, reach: ease(seg(u, .5, 2.4)) * .9 }));
  plane(c, cam, 1.3, (c) => { torchFire(c, 70, 1330, 1.7, t, 5); motes(c, { n: 30, seed: 25, box: [-100, 500, 500, 1500], r: 3, col: '#FFB060', a: .7, vx: 10, vy: -90, t }); });
} });
// ================= E · Hanuman at his feet: "if he lives, we all live" =================
SHOTS.push({ a: TL.E, b: TL.F + .5, xf: .5, draw(c, u, t) {
  const cam = { z: lerp(1.04, 1.14, ease(u / 5.8)), fx: 500, fy: 1400 };
  field(c, cam, t, { dy: 330, to: 2, fires: false });
  plane(c, cam, 1, (c) => {
    mound(c); glow(c, 430, 1480, 560, '#FF8A30', .3);
    jamb(c, t, .84, { x: 700, y: 1600, reach: .5 + .3 * Math.sin(t * .8) });
    figure(c, (f) => { f.translate(250, 1606); f.scale(.72, .72); vanaraKneel(f, { t, bow: ease(seg(u, .3, 1.8)) * .8, col: '#060509' }); }, { edge: { col: '#FFC890', w: 2, a: .4 }, rim: { col: '#FFB060', dx: 6, dy: -3, a: .9, blur: 4 } });
    c.fillStyle = '#060509'; c.save(); c.translate(440, 1606); c.rotate(-.16); c.fillRect(-5, -160, 10, 160); c.restore(); torchFire(c, 414, 1436, 1.1, t, 5);
  });
  plane(c, cam, 1.3, (c) => motes(c, { n: 40, seed: 15, box: [-100, 600, W + 100, 1900], r: 2.6, col: '#FFB060', a: .6, vx: 14, vy: -60, t }));
} });
// ================= F · on Trikuta, like a second mountain =================
const GCV = document.createElement('canvas'); GCV.width = GI.W; GCV.height = 1536;
function giant2d(c, t, x, y, k, o = {}) {
  const g = GCV.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, GI.W, 1536); hanuGiant(g, { t, ...o });
  c.save(); c.globalAlpha = o.alpha ?? 1; c.drawImage(GCV, x - GI.W / 2 * k, y - 1536 * k, GI.W * k, 1536 * k); c.restore();
}
SHOTS.push({ a: TL.F, b: TL.G + .25, xf: .5, draw(c, u, t) {
  const gr = easeIO(seg(u, .3, 3.6)), sink = ease(seg(u, 2.6, 4.6)), sh = sink * (1 - seg(u, 4.4, 4.6) * 0) * 7;
  const cam = { z: lerp(1.0, 1.08, ease(u / 4.6)), fx: 540, fy: 1000, x: Math.sin(t * 53) * sh, y: Math.cos(t * 41) * sh };
  plane(c, cam, 0, (c) => { sky(c, [[0, '#03050F'], [700, '#0C1636'], [1180, '#27376E'], [1240, '#0A1024'], [1920, '#04050C']]); stars(c, 130, 31, t, .85); });
  plane(c, cam, .08, (c) => { glow(c, 560, 560, 620, '#7F97E0', .34); ellipse(c, 560, 560, 150, 150, '#EEF0F8'); });
  plane(c, cam, .5, (c) => giant2d(c, t, 540, lerp(1560, 1250, gr), lerp(.42, .74, gr), { eyes: seg(u, 2.2, 3), anger: .6, light: '#C8D6FF', dy: 6 }));
  plane(c, cam, .8, (c) => { c.save(); c.translate(0, sink * 70);
    fillPath(c, 'M -100 1300 L 80 1210 L 190 1160 L 300 1040 L 400 1000 L 470 900 L 560 880 L 640 930 L 720 1010 L 820 1060 L 930 1180 L 1180 1290 L 1180 2000 L -100 2000 Z', '#05060E');
    for (let i = 0; i < 46; i++) { const x = 180 + hash(i * 3.3) * 720, y = 1180 + hash(i * 5.1) * 150; glow(c, x, y, 9 + hash(i) * 8, '#FFC060', .5 + .4 * Math.sin(t * 3 + i)); }
    c.restore(); debris(c, [200, 1000, 900, 1300], t, TL.F + 2.7, 26, 5, '#05060E', '#8FA6E8'); });
  plane(c, cam, 1, (c) => { haze(c, 1320, 300, '#1E2C5C', .5); c.fillStyle = '#04050C'; c.fillRect(-100, 1500, W + 200, 500); for (let i = 0; i < 5; i++) { c.fillStyle = rgba('#8FA6E8', .1); c.fillRect(-100, 1520 + i * 70 + Math.sin(t + i) * 6, W + 200, 3); } });
} });
// ================= G · the leap =================
SHOTS.push({ a: TL.G, b: TL.H + .4, xf: .12, draw(c, u, t) {
  const cam = { z: 1, fx: 540, fy: 960, x: Math.sin(t * 53) * 12 * Math.exp(-u * 2.5), y: Math.cos(t * 41) * 12 * Math.exp(-u * 2.5) };
  plane(c, cam, 0, (c) => { sky(c, [[0, '#02040C'], [900, '#0A1432'], [1600, '#22326A'], [1920, '#0A1024']]); stars(c, 170, 37, t, .9); });
  plane(c, cam, .1, (c) => { glow(c, 250, 1500, 500, '#7F97E0', .3); ellipse(c, 250, 1500, 120, 120, '#EEF0F8'); });
  plane(c, cam, 1, (c) => {
    const k = easeOut(seg(u, 0, 1.5)), x = lerp(430, 900, k), y = lerp(1900, -200, k);
    c.save(); c.globalCompositeOperation = 'lighter'; const gr = c.createLinearGradient(430, 1900, x, y); gr.addColorStop(0, 'rgba(255,170,60,0)'); gr.addColorStop(.7, 'rgba(255,190,90,.5)'); gr.addColorStop(1, 'rgba(255,240,200,1)');
    c.strokeStyle = gr; c.lineCap = 'round'; c.lineWidth = 26; c.beginPath(); c.moveTo(430, 1900); c.lineTo(x, y); c.stroke(); c.lineWidth = 7; c.strokeStyle = 'rgba(255,250,230,.9)'; c.stroke(); c.restore();
    glow(c, x, y, 260, '#FFB050', .7); glow(c, x, y, 70, '#FFFFFF', 1);
    shockRings(c, 430, 1800, t, [TL.G, TL.G + .22], '#FFE2B0');
  });
} });
POST.push((c, t) => { flash(c, Math.exp(-Math.abs(t - TL.G) * 9) * .9, '#FFF0D0'); flash(c, Math.exp(-Math.max(0, t - TL.RIP) * 4) * (t >= TL.RIP ? 1 : 0), '#FFF2D0'); flash(c, seg(t, TL.RIP - .5, TL.RIP - .42) * (t < TL.RIP ? .0 : 0), '#000000'); });

// ================= H · the map: Lanka to the Himalaya =================
const I3 = india3({ vex: 9 });
const LK = I3.at(80.75, 7.9), HK = I3.at(81.3, 30.7);
const ARC = [...Array(90)].map((_, i) => { const s = i / 89; return [lerp(LK[0], HK[0], s), lerp(LK[1], HK[1], s) + 3 + 34 * Math.sin(s * Math.PI), lerp(LK[2], HK[2], s)]; });
const TRAIL = line3(I3.scene, ARC, { col: '#FFC060', add: true, core: .85 }), COMET = glow3(I3.scene, [0, 0, 0], 26, '#FFB040', 0), CORE = glow3(I3.scene, [0, 0, 0], 8, '#FFFFFF', 0);
SHOTS.push({ a: TL.H, b: TL.I + .5, xf: .4, draw(c, u, t) {
  const s = ease(seg(u, .2, 4.4)), i = Math.min(88, Math.floor(s * 89)), p = ARC[i];
  const ex = I3.mood('night', { focus: .25, hemi: .75, sun: 1.5, stars: .9 }); I3.set(t, { clouds: .16 }); I3.border.set(1, 1.4, .5); I3.lanka.set(1, 1.2, .8);
  const alt = kf(u, [[0, 70], [2.4, 250], [5, 120]], easeIO), cz = lerp(LK[2] + 70, HK[2] + 170, ease(u / 5));
  TRAIL.set(Math.max(.001, s), alt * .012, .9); COMET.position.set(...p); CORE.position.set(...p); COMET.material.opacity = .9; CORE.material.opacity = 1; COMET.scale.setScalar(alt * .16); CORE.scale.setScalar(alt * .05);
  render3(c, I3.scene, cam3({ pos: [lerp(LK[0] - 10, HK[0] - 20, ease(u / 5)), alt, cz], at: [p[0], 0, p[2] - 40], fov: 42 }), { exposure: ex, fx: { bloom: { k: .1, thresh: 1.3 }, grade: { contrast: 1.08, sat: 1.05, temp: -.03, shadows: '#0A1030', split: .1 }, ca: .001 } });
  const a = seg(u, .2, .8) * (1 - seg(u, 2.4, 3)), b = seg(u, 3.2, 3.8);
  if (a > 0) pin3(c, 'LANKA', LK, t, TL.H + .2, { size: 40, dy: 70, alpha: a });
  if (b > 0) { pin3(c, 'HIMALAYA', HK, t, TL.H + 3.2, { size: 40, dy: -80, alpha: b }); }
} });

// ================= the Himalaya =================
const HM = himalaya3(); CAM3.far = 12000; CAM3.near = .5;
const GBW = 34 * GI.W / 1024, GB = board3(HM.scene, GBW, 51, GI.W, 1536, { order: 5 }), GH = board3(HM.scene, GBW, 51, GI.W, 1536, { order: 30 });
GH.material.depthTest = false;
const GPOS = [0, 28.5, -15], gpx = (wx, wy) => [GI.cx + wx / 34 * 1024, (GPOS[1] + 25.5 - wy) / 51 * 1536];
const FXN = (o = {}) => ({ bloom: { k: .09, thresh: 1.4, radius: 1 }, grade: { contrast: 1.08, sat: 1.06, temp: -.04, shadows: '#0A1030', highlights: '#FFE6B0', split: .12 }, ca: .001, ...o });
function peakAt(t) {
  const u = t - TL.RIP;
  if (u < 0) { const st = seg(t, TL.RIP - 1.8, TL.RIP); return { p: [Math.sin(t * 47) * .09 * st, AL.cut + Math.abs(Math.sin(t * 39)) * .07 * st, 0], r: [0, 0, Math.sin(t * 43) * .006 * st], k2: 0 }; }
  const k1 = easeOut(seg(u, 0, 1.9)), k2 = easeIO(seg(u, 2.0, 4.6));
  return { p: [lerp(0, -15.6, k2), AL.cut + k1 * 8.5 + k2 * 20.5, lerp(0, -2, k2)], r: [0, k2 * .5 + u * .03, k1 * .05 - k2 * .03], k2 };
}
const mixP = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
// one frame of the Himalaya: o.cam { pos, at, fov }, giant (0..1), eyes, grip (0..1 the hands on the peak), hide, herbs
function himalaya(c, t, o = {}) {
  I3.scene.visible = false;
  const P = peakAt(t); HM.peak.visible = o.peak !== false; HM.peak.position.set(...P.p); HM.peak.rotation.set(...P.r);
  const ex = HM.mood(o.mood || {}), hide = o.hide ?? 0, lit = (o.herbs ?? 1) * (1 - hide);
  HM.set(t, { herbs: o.herbs ?? 1, hide, tear: t - TL.RIP, tearRise: 14, fire: o.fire ?? 0, clouds: o.clouds ?? 1, dust: .45 });
  const on = o.giant ?? 0; GB.visible = on > .01; GH.visible = GB.visible && (o.grip ?? 0) > .5;
  if (GB.visible) {
    const rest = [[GI.cx - 372, 1420], [GI.cx + 372, 1420]], gk = ease(o.grip ?? 0), [px, py] = P.p;
    const hL = mixP(mixP(rest[0], gpx(px - 8.4, py + 2.2), gk), gpx(px + .4, py - 3.6), P.k2), hR = mixP(mixP(rest[1], gpx(px + 8.4, py + 2.2), gk), rest[1], P.k2);
    const p = { t, handL: hL, handR: hR, eyes: o.eyes ?? 0, anger: o.anger ?? 1, dy: 8, under: lit * .85 * (1 - .45 * P.k2), underDy: -40, underAt: P.k2 > 0 ? mixP(mixP(hL, hR, .5), gpx(px, py + 1), P.k2) : null };
    GB.paint(g => hanuGiant(g, p)); GB.place(GPOS); GB.material.opacity = on;
    if (GH.visible) { GH.paint(g => hanuGiant(g, { ...p, only: 'hands' })); GH.place(GPOS); }
  }
  render3(c, HM.scene, cam3(o.cam), { exposure: ex * (o.ex ?? 1), fx: FXN(o.fx) });
  I3.scene.visible = true;
}
// I · the mountain of herbs, blazing between Kailasa and Rishabha
SHOTS.push({ a: TL.I, b: TL.J + .6, xf: .6, draw(c, u, t) {
  himalaya(c, t, { cam: { pos: kf(u, [[0, [34, 26, 230]], [6, [6, 11, 98]]], easeOut), at: [0, 10, 0], fov: 40 } });
  const a = seg(u, 2.6, 3.2) * (1 - seg(u, 4.9, 5.4));
  if (a > 0) { pin3(c, 'KAILASH', [-19, 33, -52], t, TL.I + 2.6, { size: 38, dy: -34, alpha: a, col: '#DCE6FF' }); pin3(c, 'RISHABHA', [21, 29, -58], t, TL.I + 2.9, { size: 38, dy: -34, alpha: a, col: '#DCE6FF' }); }
} });
// J · the herbs hide
SHOTS.push({ a: TL.J, b: TL.K + .6, xf: .6, draw(c, u, t) {
  himalaya(c, t, { hide: ease(seg(u, .9, 3.9)), cam: { pos: kf(u, [[0, [9, 11, 96]], [5.6, [-7, 9.5, 70]]], easeIO), at: [0, 10, 0], fov: 40 } });
} });
// K · he rises behind it; the eyes
SHOTS.push({ a: TL.K, b: TL.L + .1, xf: .6, draw(c, u, t) {
  himalaya(c, t, { hide: 1, giant: ease(seg(u, .2, 2.0)), eyes: easeOut(seg(t, TL.EYES, TL.EYES + .35)), anger: seg(t, TL.EYES, TL.EYES + 1.5), cam: { pos: kf(u, [[0, [-4, 9, 86]], [4.2, [0, 9, 78]]], easeIO), at: [0, 15, 0], fov: 40 } });
} });
// L · the grip, the strain, the silence, the tear; the mountain on his palm
SHOTS.push({ a: TL.L, b: TL.M + .5, draw(c, u, t) {
  const r = t - TL.RIP, sk = r < 0 ? seg(t, TL.RIP - 1.8, TL.RIP) * .12 : 1.1 * Math.exp(-r * 2.2), back = easeIO(seg(r, .6, 4.4));
  himalaya(c, t, { hide: 1 - ease(seg(r, .15, 1.5)), giant: 1, eyes: 1, anger: 1, grip: seg(u, .2, 1.4), fire: r < 0 ? ease(seg(t, TL.RIP - 1.9, TL.RIP - .5)) * (1 - seg(t, TL.RIP - .5, TL.RIP - .42)) : Math.exp(-r * .9),
    ex: r < 0 ? 1 - .55 * seg(t, TL.RIP - .5, TL.RIP - .42) : 1,
    cam: { pos: [Math.sin(t * 53) * sk, lerp(9, 11, back) + Math.cos(t * 41) * sk, lerp(78, 97, back)], at: [lerp(0, -2.5, back), lerp(15, 22.5, back), 0], fov: 40 } });
} });
// ================= M · the return: a second sun =================
SHOTS.push({ a: TL.M, b: TL.N + .6, xf: .6, draw(c, u, t) {
  I3.scene.visible = false; HM.peak.visible = false; HM.ground.visible = false; GB.visible = GH.visible = false;
  const ex = HM.mood({ moonOn: false, sun: 1.0, sunCol: '#B8A8D8', moon: [-.5, .16, -1], hemi: .5, hemiCol: '#5A58A0', fog: '#3A2A50', cloudLit: '#E6C4C8', cloudShade: '#15173C', cloudFog: '#3A2E5A', stars: .7 });
  HM.set(t, { herbs: 0, clouds: 1, wind: 14 });
  render3(c, HM.scene, cam3({ pos: [420 + u * 5, 7.2, 380], at: [300 + u * 5, 10.5, 260], fov: 46 }), { exposure: ex, fx: FXN({ grade: { contrast: 1.06, sat: 1.1, temp: .05, shadows: '#141038', highlights: '#FFD9A0', split: .14 } }) });
  HM.peak.visible = true; HM.ground.visible = true;
  const x = lerp(300, 600, ease(u / 5.4)), y = 900 + Math.sin(t * 1.2) * 12, k = 1.0;
  glow(c, x + 30, y - 190, 1150, '#FF9A40', .42); glow(c, x + 30, y - 190, 520, '#FFD890', .7); glow(c, x + 30, y - 200, 210, '#FFFFFF', .95);
  rays(c, x + 30, y - 200, { n: 16, len: 1500, col: '#FFE0A0', a: .1, t, dir: 0, spread: TAU, w: 80 });
  c.save(); c.globalCompositeOperation = 'lighter'; const gr = c.createLinearGradient(x - 900, y + 240, x, y); gr.addColorStop(0, 'rgba(255,170,60,0)'); gr.addColorStop(1, 'rgba(255,210,130,.5)'); c.strokeStyle = gr; c.lineCap = 'round'; c.lineWidth = 60; c.beginPath(); c.moveTo(x - 900, y + 240); c.lineTo(x - 60, y + 10); c.stroke(); c.restore();
  figure(c, (f) => { f.translate(x, y); f.scale(k, k); const pm = hanuFly(f, { t, col: '#0A0610' }); f.translate(pm[0], pm[1] - 4); miniPeak(f, 250, t, { col: '#0E0A14' }); }, { edge: { col: '#FFE6B0', w: 2.5, a: .9 }, rim: { col: '#FFF0C8', dx: 2, dy: -5, a: .9, blur: 3 } });
  motes(c, { n: 70, seed: 3, box: [-100, 300, W + 100, 1500], r: 3, col: '#FFE6A0', a: .7, vx: -260, vy: 40, t });
} });
// ================= N · the fragrance: they rise =================
SHOTS.push({ a: TL.N, b: TL.O + .7, xf: .6, draw(c, u, t) {
  field(c, { z: lerp(1.1, 1.0, ease(u / 6.4)), fx: 540, fy: 1100 }, t, { gold: ease(seg(u, .2, 3)), rise: seg(u, 2.0, 5.6), to: 4 });
} });
// ================= O · dawn =================
SHOTS.push({ a: TL.O, b: TL.CARD + .1, xf: .7, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.1, ease(u / 9.6)), fx: 540, fy: 1200 };
  plane(c, cam, 0, (c) => sky(c, [[0, '#1A1436'], [520, '#5A3A66'], [1000, '#E8905A'], [1330, '#FFD890'], [1400, '#FFE9B8']]));
  plane(c, cam, .06, (c) => { glow(c, 560, 1250, 900, '#FFB860', .5); ellipse(c, 560, 1250, 250, 250, '#FFF4D0'); rays(c, 560, 1250, { n: 16, len: 1700, col: '#FFE6A8', a: .08, t, dir: -Math.PI / 2, spread: Math.PI, w: 90 }); });
  plane(c, cam, .3, (c) => { ridge(c, 1330, 70, 17, '#5A3440'); haze(c, 1300, 200, '#FFC890', .3); });
  plane(c, cam, 1, (c) => {
    fillPath(c, 'M -100 1560 C 200 1500 400 1470 620 1480 C 800 1490 1000 1530 1180 1570 L 1180 2000 L -100 2000 Z', '#0C0810');
    figure(c, (f) => { f.translate(770, 1500); f.scale(.56, .56); ramSil(f, { t, bless: ease(seg(u, .8, 2.6)), col: '#0C0810' }); }, { edge: { col: '#FFE2A8', w: 2, a: .8 } });
    figure(c, (f) => { f.translate(370, 1496); f.scale(.56, .56); vanaraKneel(f, { t, bow: .9, col: '#0C0810' }); }, { edge: { col: '#FFE2A8', w: 2, a: .8 } });
  });
  plane(c, cam, 1.3, (c) => motes(c, { n: 70, seed: 41, box: [-100, 300, W + 100, 1900], r: 3, col: '#FFE6A0', a: .7, vx: 8, vy: -40, t }));
} });
// ================= the card =================
SHOTS.push({ a: TL.CARD, b: TL.END, xf: .5, draw(c, u, t) {
  rkCardCine(c, u, t, { title: 'MEET OUR GODS', line: 'Picture books of our gods, for kids', price: 'The Navadurga Set is out now', note: 'Link in bio' });
} });
