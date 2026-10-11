// shiva_cine.js: the cinematic style test. Shiva's Tandava, the opening of the Shiv Tandav reel.
//   1  0.0–4.4   Kailash at night, a storm. Shiva, small, on a ledge with the trishul. "There is one dance..."
//   2  3.9–8.4   Shiva, knees up, eyes closed, wind in his hair; lightning behind him. "Shiva's Tandava. When he dances in rage,"
//   3  8.0–10.9  his face: the eyes open, then the third eye; push in to it, white-out. "worlds end."
//   4 10.7–15.2  dawn: the Nataraja silhouette in a ring of fire, backlit by the sun. "When he dances in joy, they begin again."

// ---------- the set pieces ----------
function kailash(c, cx, top, w, k = {}) {
  const base = top + 700, rock = k.rock || '#1A2236', snow = k.snow || '#93A2C4', snowSh = k.snowSh || '#56637F', L = k.light ?? 1;
  const BODY = `M ${cx - w} ${base} C ${cx - w * .72} ${base - 140} ${cx - w * .36} ${top + 210} ${cx - w * .12} ${top + 34} Q ${cx} ${top - 16} ${cx + w * .12} ${top + 34} C ${cx + w * .36} ${top + 210} ${cx + w * .72} ${base - 140} ${cx + w} ${base} Z`;
  fillPath(c, BODY, rock);
  inside(c, BODY, () => {
    // snow on the upper slopes, with a ragged lower edge
    c.fillStyle = snow; c.beginPath(); c.moveTo(cx - w, top - 50);
    for (let x = cx - w; x <= cx + w; x += 10) { const d = Math.abs(x - cx) / w; c.lineTo(x, top + 420 - d * 120 + fbm(x * .012, 4) * 40); }
    c.lineTo(cx + w, top - 50); c.closePath(); c.fill();
    // the shaded face
    c.save(); c.translate(cx, 0); c.scale(L, 1);
    fillPath(c, `M 0 ${top - 20} C ${-w * .03} ${top + 200} ${-w * .1} ${top + 420} ${-w * .06} ${base} L ${-w * 1.2} ${base} L ${-w * 1.2} ${top - 20} Z`, rgba(snowSh, .85));
    c.restore();
    // the terraces: soft dark bands across the face
    for (let i = 0; i < 4; i++) {
      const y = top + 150 + i * 70, hw = w * (.2 + i * .1);
      c.fillStyle = rgba(rock, .28); c.beginPath(); c.moveTo(cx - hw, y + hw * .3);
      for (let x = cx - hw; x <= cx + hw; x += 12) c.lineTo(x, y + Math.abs(x - cx) * .3 + fbm(x * .02, i + 9) * 8);
      for (let x = cx + hw; x >= cx - hw; x -= 12) c.lineTo(x, y + 16 + Math.abs(x - cx) * .3 + fbm(x * .02, i + 19) * 8);
      c.closePath(); c.fill();
    }
  });
}
// A rocky ledge to stand on, lit along its top edge.
// A cliff coming in from the right, its edge at x; the top at y.
function ledge(c, x, y, col, lit, la = .5) {
  const d = `M ${x - 40} ${y + 30} C ${x - 30} ${y + 6} ${x} ${y - 2} ${x + 60} ${y} C ${x + 200} ${y + 4} ${x + 420} ${y - 18} ${W + 200} ${y - 30} L ${W + 200} ${H + 300} L ${x + 60} ${H + 300} C ${x + 20} ${y + 300} ${x - 60} ${y + 160} ${x - 40} ${y + 30} Z`;
  figure(c, (f) => fillPath(f, d, col), { edge: { col: lit, w: 2.5, a: la } });
}
function clouds(c, set, t, cols, a = 1) {
  for (const [x, y, w, seed, v, flip] of set) { const span = W + w; cloud(c, ((x + t * v) % span + span) % span - w / 2, y, w, seed, cols, a, flip); }
}
function fireRing(c, cx, cy, r, t, a = 1) {
  const g0 = Math.PI / 2 + .52, g1 = Math.PI / 2 - .52 + TAU;
  soft(c, 4, (s) => { s.globalCompositeOperation = 'lighter'; s.strokeStyle = rgba('#FF8A2A', .7 * a); s.lineWidth = 60; s.beginPath(); s.arc(cx, cy, r, g0, g1); s.stroke(); }, { blur: 5, op: 'lighter' });
  c.save(); c.globalCompositeOperation = 'lighter';
  c.strokeStyle = rgba('#FFB04A', .9 * a); c.lineWidth = 10; c.beginPath(); c.arc(cx, cy, r, g0, g1); c.stroke();
  const n = 44;
  for (let i = 0; i <= n; i++) {
    const ang = lerp(g0, g1, i / n), h = (46 + 26 * Math.sin(t * 8 + i * 1.9) + 14 * Math.sin(t * 13 + i * 3.1)) * a, w = 15;
    const bx = cx + Math.cos(ang) * (r + 4), by = cy + Math.sin(ang) * (r + 4), nx = Math.cos(ang), ny = Math.sin(ang), tx = -ny, ty = nx, lean = Math.sin(t * 5 + i) * 8;
    for (const [k, col] of [[1, '#FF6A1E'], [.65, '#FFB347'], [.32, '#FFF1C0']]) {
      c.fillStyle = rgba(col, .85); c.beginPath();
      c.moveTo(bx + tx * w * k, by + ty * w * k);
      c.quadraticCurveTo(bx + nx * h * k * .6 + tx * w * k, by + ny * h * k * .6 + ty * w * k, bx + nx * h * k + tx * lean * k, by + ny * h * k + ty * lean * k);
      c.quadraticCurveTo(bx + nx * h * k * .6 - tx * w * k, by + ny * h * k * .6 - ty * w * k, bx - tx * w * k, by - ty * w * k);
      c.closePath(); c.fill();
    }
  }
  c.restore();
}

// ---------- shot 1: Kailash at night ----------
const NIGHT = ['#151B2E', '#2A3452', '#5A6788'], NIGHT_FAR = ['#1A2238', '#27304B', '#3C4766'];
SHOTS.push({ a: 0, b: 4.4, draw(c, u, t) {
  const cam = { z: lerp(1, 1.12, easeIO(u / 4.4)), fx: 560, fy: 1450 }, fl = strikes(t, [2.75]);
  plane(c, cam, 0, (c) => sky(c, [[0, '#060A15'], [650, '#111A30'], [1200, '#283350'], [1520, '#47516E']]));
  plane(c, cam, .05, (c) => {
    glow(c, 800, 520, 560, '#7F97CC', .38); glow(c, 800, 520, 120, '#DDE6FA', .5);
    ellipse(c, 800, 520, 50, 50, '#E6ECF6'); ellipse(c, 786, 510, 12, 9, rgba('#C5CEE0', .7)); ellipse(c, 812, 538, 8, 6, rgba('#C5CEE0', .6));
    rays(c, 800, 520, { n: 9, dir: 1.98, spread: .8, len: 1600, w: 300, col: '#A9BCE6', a: .13, t });
  });
  plane(c, cam, .1, (c) => clouds(c, [[100, 300, 760, 1, 9], [700, 420, 620, 2, 12, true], [380, 660, 900, 3, 7]], t, NIGHT_FAR, .9));
  plane(c, cam, .15, (c) => { bolt(c, 330, 380, 420, 1000, 7, fl); flash(c, fl * .28, '#9FB6F0'); });
  plane(c, cam, .3, (c) => kailash(c, 540, 860, 600, { light: 1 }));
  plane(c, cam, .35, (c) => haze(c, 1420, 320, '#7886A6', .5));
  plane(c, cam, .5, (c) => { ridge(c, 1470, 110, 3, '#1A2133', { freq: .006 }); haze(c, 1560, 200, '#6C7898', .3); });
  plane(c, cam, .7, (c) => clouds(c, [[600, 230, 1100, 4, 22], [0, 130, 900, 5, 18, true]], t, NIGHT, .95));
  plane(c, cam, 1, (c) => {
    ledge(c, 500, 1590, '#0C111D', '#B9C8EA', .5);
    figure(c, (f) => { f.translate(560, 1592); f.scale(.27, .27); shiva(f, { t, wind: .9, eyes: 0, arm: 'down' }); },
      { tint: ['#0A0F1C', .84], edge: { col: '#C9D7F5', w: 1.8, a: .55 }, rim: { col: '#E4EDFF', dx: 3, dy: -2, a: .9 + fl } });
  });
  plane(c, cam, 1.1, (c) => motes(c, { n: 90, seed: 3, box: [-100, 200, W + 100, 1900], r: 3.2, col: '#DCE6FF', a: .55, vx: 70, vy: 110, t }));
  plane(c, cam, 1.4, (c) => {
    fillPath(c, 'M -120 1820 C 0 1770 120 1760 200 1800 C 250 1830 270 1900 280 2100 L -120 2100 Z', '#04060B');
  });
} });

// ---------- shot 2: Shiva, knees up ----------
SHOTS.push({ a: 3.9, b: 8.4, xf: .5, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.14, easeIO(u / 4.5)), fx: 540, fy: 790 }, fl = strikes(t, [6.35]);
  plane(c, cam, 0, (c) => sky(c, [[0, '#070B17'], [700, '#152039'], [1400, '#2F3B5B'], [1900, '#3E4A68']]));
  plane(c, cam, .05, (c) => { glow(c, 840, 420, 520, '#7F97CC', .42); glow(c, 840, 420, 110, '#DDE6FA', .55); ellipse(c, 840, 420, 44, 44, '#E6ECF6'); });
  plane(c, cam, .1, (c) => clouds(c, [[0, 260, 820, 11, 30], [500, 520, 700, 12, 40, true], [200, 900, 900, 13, 26]], t, NIGHT_FAR, .9));
  plane(c, cam, .15, (c) => { bolt(c, 980, -40, 760, 1250, 21, fl); flash(c, fl * .3, '#9FB6F0'); });
  plane(c, cam, .25, (c) => { kailash(c, 240, 1120, 420); haze(c, 1500, 360, '#6E7C9E', .55); });
  plane(c, cam, .45, (c) => { ridge(c, 1640, 80, 8, '#151B2B', { freq: .005 }); });
  plane(c, cam, .6, (c) => clouds(c, [[300, 120, 1000, 14, 55], [900, 330, 760, 15, 70, true]], t, NIGHT, .85));
  plane(c, cam, 1, (c) => {
    figure(c, (f) => { f.translate(540, 2210); f.scale(1.75, 1.75); shiva(f, { t, wind: .7, eyes: 0, arm: 'abhaya', light: 1, armFx: { edge: { col: '#D4E0FA', w: 2, a: .5 } } }); },
      { tint: ['#16224A', .3], grade: [[600, 'rgba(0,0,0,0)'], [1900, 'rgba(4,7,18,.7)']],
        edge: { col: '#D4E0FA', w: 2.4, a: .55 }, rim: { col: '#EAF1FF', dx: 6, dy: -3, a: .8 + fl * 1.2, blur: 1 } });
  });
  plane(c, cam, 1.2, (c) => motes(c, { n: 60, seed: 9, box: [-100, 0, W + 100, 1950], r: 3.5, col: '#DCE6FF', a: .5, vx: 120, vy: 140, t }));
} });

// ---------- shot 3: the face, the eyes, the third eye ----------
SHOTS.push({ a: 8.0, b: 10.9, xf: .35, draw(c, u, t) {
  const eyes = easeOut(seg(u, .85, 1.05)), third = easeIO(seg(u, 1.5, 2.1)), K = 6.6, hy = 930;
  const [sx, sy] = third > .3 ? [Math.sin(t * 61) * 4 * third, Math.cos(t * 47) * 3 * third] : [0, 0];
  const cam = { z: kf(u, [[0, 1.04], [.85, 1.0], [1.05, 1.03], [2.1, 1.06], [2.9, 1.55]], easeIO), fx: 540, fy: hy + (815 - 853) * K, x: sx, y: sy };
  plane(c, cam, 0, (c) => sky(c, [[0, '#060914'], [900, '#121B33'], [1900, '#1D2846']]));
  plane(c, cam, .1, (c) => { glow(c, 900, 360, 600, '#6F87BE', .35); soft(c, 6, (s) => clouds(s, [[0, 300, 900, 21, 14], [600, 700, 800, 22, 18, true]], t, NIGHT_FAR, .9), { blur: 2 }); });
  plane(c, cam, 1, (c) => {
    figure(c, (f) => { f.translate(540, hy); f.scale(K, K); f.translate(0, 815); shiva(f, { t, wind: .5, eyes, third, arm: 'abhaya', light: 1, look: [0, .1] }); },
      { tint: ['#16224A', .2], grade: [[1300, 'rgba(0,0,0,0)'], [1950, 'rgba(4,7,18,.7)']],
        edge: { col: '#D4E0FA', w: 3, a: .3 }, rim: { col: '#EAF1FF', dx: 9, dy: -4, a: .85, blur: 2 } });
    // the third eye's fire lights the face
    glow(c, 540, hy + (815 - 853) * K, 520 * third + 1, '#FF7A2A', .35 * third);
  });
  flash(c, .12 * third * (.6 + .4 * Math.sin(t * 40)), '#FF9A4A');
} });

// ---------- shot 4: dawn, the dance ----------
SHOTS.push({ a: 10.7, b: 15.2, xf: .15, draw(c, u, t) {
  const cam = { z: lerp(1.22, 1.0, easeOut(u / 3.2)), fx: 540, fy: 1180 };
  const DAWN = ['#5A2C46', '#9C4B55', '#E8A06C'];
  plane(c, cam, 0, (c) => sky(c, [[0, '#24183A'], [560, '#5E2E4E'], [1000, '#C9663D'], [1380, '#FFCF86'], [1600, '#FFE2A8']]));
  plane(c, cam, .05, (c) => {
    glow(c, 540, 1190, 900, '#FFB45A', .55); glow(c, 540, 1190, 300, '#FFF0C8', .7);
    ellipse(c, 540, 1190, 235, 235, '#FFE9B8');
    rays(c, 540, 1190, { n: 18, dir: -Math.PI / 2, spread: Math.PI * 1.5, len: 1500, w: 240, col: '#FFD58A', a: .22, t, seed: 4 });
  });
  plane(c, cam, .1, (c) => clouds(c, [[0, 280, 900, 31, 10], [520, 520, 760, 32, 14, true], [200, 760, 640, 33, 8]], t, DAWN, .92));
  plane(c, cam, .25, (c) => { kailash(c, 150, 1180, 400, { rock: '#3A2036', snow: '#B9727A', snowSh: '#6E3A50', light: -1 }); haze(c, 1500, 300, '#FFC27A', .55); });
  plane(c, cam, .45, (c) => { ridge(c, 1560, 60, 12, '#3B1F33', { freq: .006 }); haze(c, 1600, 160, '#FFB070', .35); });
  plane(c, cam, 1, (c) => {
    fireRing(c, 545, 1110, 470, t, easeOut(seg(u, 0, .6)));
    figure(c, (f) => fillPath(f, 'M -100 1600 C 100 1582 300 1566 420 1564 L 720 1564 C 840 1566 1000 1576 1180 1592 L 1180 2100 L -100 2100 Z', '#1C111B'), { edge: { col: '#FFC98A', w: 2.5, a: .6 }, grade: [[1560, 'rgba(120,60,40,.55)'], [1900, 'rgba(0,0,0,0)']] });
    figure(c, (f) => { f.translate(560, 1570); f.scale(.74, .74); nataraja(f, { t, col: '#1E1420' }); },
      { edge: { col: '#FFD9A0', w: 2.6, a: .85 }, rim: { col: '#FFF0C8', dx: 0, dy: -4, a: .7, blur: 1 } });
    // the flame in his hand and the fire stay bright over the silhouette
    glow(c, 560 + 252 * .74, 1570 - 950 * .74, 100, '#FFB050', .7);
  });
  plane(c, cam, 1.2, (c) => motes(c, { n: 70, seed: 17, box: [-100, 300, W + 100, 1900], r: 3, col: '#FFD9A0', a: .7, vx: 10, vy: -45, t }));
} });

// the white-out from the third eye into the dawn
POST.push((c, t) => { if (t > 10.45) flash(c, t < 10.7 ? ease(seg(t, 10.45, 10.7)) : Math.exp(-(t - 10.7) * 4.5), '#FFF4E0', 'source-over'); });

// ---------- captions (auto-timed until the voice track exists) ----------
say(-.35, 1.9, 'There is one dance', { y: 720 });
say(1.9, 4.0, 'that even the *gods* fear.', { y: 720 });
say(4.15, 5.9, "*Shiva's* *Tandava*.", { y: 1190, size: 66 });
say(5.9, 8.0, 'When he dances in *rage*,', { y: 1190 });
say(8.15, 10.5, 'worlds end.', { y: 1450, size: 72 });
say(11.0, 12.95, 'When he dances in *joy*,', { y: 520 });
say(12.95, 15.2, 'they begin again.', { y: 520 });
