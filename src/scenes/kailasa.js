// kailasa.js: "This temple was never BUILT. It was CARVED from ONE rock." (reel/kailasa-ellora), the first temple
// architecture reel, in the Cinematic style (src/cine.js), voiced (Sarvam: the narrator girish_en_devotional).
// The Kailasa temple at Ellora (Cave 16), 8th century, generally credited to the Rashtrakuta king Krishna I: three
// trenches cut down into the hill leave an island of rock, carved from the top down into the vimana, the halls and the
// floor; up to 200,000 tonnes of rock removed; a shrine over 30 m tall on a plinth of elephants, Nandi's mandapa and
// the rock bridge, the Ravana relief; the Baroda copper plate (c. 812): the gods in their sky-chariots astonished, the
// architect asking how he built it. The comment ask (which temple next?) and a follow card.
// Times are in TL (src/scenes/kailasa_tl.js, from the voice); tools/kailasa_sfx.mjs uses the same TL.
const shake = (t, t0, k = 14, d = 5) => { const u = t - t0; if (u < 0 || u > 1.4) return [0, 0]; const e = Math.exp(-u * d) * k; return [Math.sin(t * 53) * e, Math.cos(t * 41) * e]; };
const pulse = (t, t0, up, down) => t < t0 - up || t > t0 + 3 ? 0 : t < t0 ? ease(seg(t, t0 - up, t0)) : Math.exp(-(t - t0) * down);
// a sky whose brightest band sits on the horizon at screen y hy: cols = [top, mid, horizon]
const horizonSky = (c, hy, cols) => sky(c, [[0, cols[0]], [Math.max(10, hy - 420), cols[1]], [hy, cols[2]], [hy + 400, cols[2]]]);
const DAWN_SKY = ['#1E1236', '#7A3448', '#F6A862'], GOLD_SKY = ['#2A1A3A', '#A04E48', '#FFC880'], DUSK_SKY = ['#120818', '#5A1E30', '#E0703A'], NIGHT_SKY = ['#04060E', '#101A34', '#2A3658'];
// the iso camera, with the screen y of the hill's back edge (the horizon)
const kcam = (o) => { const cam = isoCam(o); cam.hy = cam.P(0, o.back ?? 140, KH)[1]; return cam; };
// a few tiny people standing in the courtyard, for scale
function people(c, cam, pts, col = '#140A0C') { for (const [x, y] of pts) { const [px, py] = cam.P(x, y, 0), h = 1.7 * cam.s * Math.cos(cam.el); limb(c, [[px, py], [px, py - h * .7]], [h * .26, h * .3], col); ellipse(c, px, py - h * .85, h * .14, h * .14, col); } }

// ---------- shot 1: the hook. The finished temple in its pit at dawn; "CARVED": a strike of light and dust ----------
SHOTS.push({ a: TL.hook, b: TL.name + .5, draw(c, u, t) {
  const [sx, sy] = shake(t, TL.carved, 8), cam = kcam({ cx: 540 + sx, cy: 1500 + sy, s: lerp(12.4, 13.4, easeIO(u / 5)), th: lerp(.42, .3, easeIO(u / 5)), el: .5 });
  sky(c, [[0, DAWN_SKY[0]], [1920, DAWN_SKY[2]]]);
  ellora(c, { sky: (c, hy) => { horizonSky(c, hy, DAWN_SKY); glow(c, 760, hy, 300, '#FFE0A0', .6); }, cam, t, pal: TEMPLE_PAL.dawn, haze: '#F0A060' });
  const d = pulse(t, TL.carved, .05, 1.6); if (d > 0) { const [px, py] = cam.P(0, 37, 8); glow(c, px, py, 420, '#FFE0B0', .25 * d); motes(c, { n: 60, seed: 3, box: [px - 400, py - 300, px + 400, py + 200], r: 3, col: '#FFE0B0', a: .7 * d, vx: 0, vy: -80, t }); }
  motes(c, { n: 40, seed: 2, box: [-100, 300, W + 100, 1900], r: 2.5, col: '#FFE0A8', a: .4, vx: 14, vy: -18, t });
} });

// ---------- shot 2: "Kailasa, at Ellora. Shiva's mountain, in stone.": low and frontal; Kailash rises ghostly behind ----------
SHOTS.push({ a: TL.name, b: TL.none + .4, xf: .5, draw(c, u, t) {
  const cam = kcam({ cx: 540, cy: lerp(1890, 1860, easeIO(u / 4.5)), s: lerp(12.6, 13.4, easeIO(u / 4.5)), th: lerp(-.06, .06, easeIO(u / 4.5)), el: .32 });
  const m = ease(seg(t, TL.mountain - .5, TL.mountain + 1.2));
  sky(c, [[0, GOLD_SKY[0]], [1920, GOLD_SKY[2]]]);
  ellora(c, { sky: (c, hy) => {
    horizonSky(c, hy, GOLD_SKY); glow(c, 540, hy, 420, '#FFE0A0', .45);
    if (m > 0) { c.save(); c.globalAlpha = .26 * m; kailash(c, 540, hy - 640 + (1 - m) * 60, 600, { rock: '#3A2440', snow: '#E8C8C0', snowSh: '#8A6A80' }); c.restore(); glow(c, 540, hy - 540, 200, '#FFF0D0', .15 * m); }
  }, cam, t, pal: TEMPLE_PAL.dawn, haze: '#FFC080', hazeLen: 160 });
  motes(c, { n: 40, seed: 5, box: [-100, 300, W + 100, 1900], r: 2.5, col: '#FFE0A8', a: .4, vx: 10, vy: -16, t });
} });

// ---------- shot 3: "No bricks. No blocks. No mortar.": three gold line drawings, each struck through ----------
SHOTS.push({ a: TL.none, b: TL.hill + .5, xf: .4, draw(c, u, t) {
  SKY.rock(c);
  for (let i = 0; i < 9; i++) strokePath(c, `M -50 ${700 + i * 150 + fbm(i, 2) * 40} C 300 ${660 + i * 150} 700 ${760 + i * 150} 1130 ${700 + i * 150}`, rgba('#3A2A26', .5), 3);
  glow(c, 540, 1150, 700, '#FF9A50', .12);
  const ic = [['brick', 200, TL.bricks], ['block', 540, TL.blocks], ['mortar', 880, TL.mortar]];
  for (const [k, x, w] of ic) lineIcon(c, k, x, 1120 + Math.sin(t * 1.3 + x) * 6, seg(t, w - .35, w + .05), ease(seg(t, w + .3, w + .6)));
} });

// ---------- shot 4: "Just one hill of solid rock.": the untouched hill above the valley at dawn ----------
SHOTS.push({ a: TL.hill, b: TL.trench + .4, xf: .4, draw(c, u, t) {
  const cam = kcam({ cx: 560, cy: lerp(1420, 1400, easeIO(u / 2.6)), s: lerp(9.6, 10.4, easeIO(u / 2.6)), th: .36, el: .62 });
  sky(c, [[0, DAWN_SKY[0]], [1920, DAWN_SKY[2]]]);
  ellora(c, { sky: (c, hy) => { horizonSky(c, hy, DAWN_SKY); glow(c, 900, hy, 260, '#FFE0A0', .5); }, cam, t, dig: 0, cut: KH, pal: TEMPLE_PAL.dawn, haze: '#F0A060' });
} });

// ---------- shot 5: the three trenches cut straight down (from above), leaving the island standing ----------
SHOTS.push({ a: TL.trench, b: TL.topdown + .4, xf: .5, draw(c, u, t) {
  const k = easeIO(seg(t, TL.trench, TL.topdown)), cam = kcam({ cx: 560, cy: lerp(1300, 1460, k), s: lerp(10, 11.4, k), th: lerp(.3, .4, k), el: lerp(1.05, .7, k) });
  const d0 = TL.three - .1, dig = [ease(seg(t, d0, d0 + 2.6)), ease(seg(t, d0 + .5, d0 + 3.1)), ease(seg(t, d0 + 1, d0 + 3.6))];
  sky(c, [[0, DAWN_SKY[0]], [1920, DAWN_SKY[2]]]);
  ellora(c, { sky: (c, hy) => horizonSky(c, hy, DAWN_SKY), cam, t, dig, cut: KH, galleries: 0, pal: TEMPLE_PAL.dawn, carvers: .7, haze: '#F0A060' });
  // the island picked out in light: "standing"
  const h = pulse(t, TL.standing, .4, 1.4);
  if (h > 0) { const q = [cam.P(-16, 6, KH), cam.P(16, 6, KH), cam.P(16, 68, KH), cam.P(-16, 68, KH)]; c.save(); c.shadowColor = '#FFD890'; c.shadowBlur = 24; c.globalAlpha = h; strokePath(c, `M ${q.map(p => p.join(' ')).join(' L ')} Z`, '#FFE8B0', 5); c.restore(); }
} });

// ---------- shot 6: carved from the top down: the tower, then the halls, then the floor they stood on ----------
SHOTS.push({ a: TL.topdown, b: TL.tonnes + .4, xf: .5, draw(c, u, t) {
  const cut = kf(t, [[TL.top - .2, KH], [TL.tower + .9, 17], [TL.halls + .8, 8], [TL.floor + 1.1, 0]]);
  const k = easeIO(seg(t, TL.topdown, TL.tonnes)), s = lerp(15.5, 12.4, k), el = lerp(.62, .56, k), cy = 1180 + s * (37 * Math.sin(el) + cut * Math.cos(el)) * .9;
  const cam = kcam({ cx: 540, cy, s, th: lerp(.46, .34, k), el });
  sky(c, [[0, DAWN_SKY[0]], [1920, DAWN_SKY[2]]]);
  ellora(c, { sky: (c, hy) => horizonSky(c, hy, DAWN_SKY), cam, t, cut, galleries: 1 - cut / KH, pal: TEMPLE_PAL.dawn, carvers: cut > .3 ? 1 : 0, dust: cut > .3 ? .8 : 0, haze: '#F0A060' });
  motes(c, { n: 50, seed: 7, box: [-100, 500, W + 100, 1900], r: 3, col: '#F0C8A0', a: .35, vx: 20, vy: -40, t });
} });

// ---------- shot 7: "Up to 200,000 tonnes of rock, cut away by hand": carvers at dusk on the half-cut tower ----------
const CARVERS = [[150, 1560, .5, 0], [420, 1640, .56, 1.7], [700, 1580, .5, 3.1], [960, 1650, .56, 4.4]];
const carveSwing = (t, ph) => { const q = ((t * 1.25 + ph * .23) % 1 + 1) % 1; return q < .75 ? easeOut(q / .75) : 1 - (q - .75) / .25; };
SHOTS.push({ a: TL.tonnes, b: TL.final + .4, xf: .5, draw(c, u, t) {
  const cam = kcam({ cx: 520, cy: 1880, s: lerp(22, 24, easeIO(u / 4.4)), th: .3, el: .4 });
  sky(c, [[0, DUSK_SKY[0]], [1920, DUSK_SKY[2]]]);
  ellora(c, { sky: (c, hy) => { horizonSky(c, hy, DUSK_SKY); glow(c, 540, hy, 600, '#FF9A50', .4); }, cam, t, cut: 14, galleries: .6, pal: TEMPLE_PAL.dusk, carvers: 1, dust: .5, haze: '#C05040' });
  haze(c, 1300, 600, '#1A0810', .5);
  // the ledge in front and the carvers on it, striking in turn; chips and sparks fly from each blow
  fillPath(c, 'M -100 1600 C 200 1560 500 1620 800 1580 C 950 1570 1100 1600 1200 1590 L 1200 2100 L -100 2100 Z', '#0A0408');
  for (const [x, y, k, ph] of CARVERS) {
    const sw = carveSwing(t, ph);
    figure(c, (f) => { f.translate(x, y); f.scale(k, k); carver(f, { swing: sw }); }, { tint: ['#0A0408', .9], edge: { col: '#FF9A6A', w: 2, a: .7 }, rim: { col: '#FFC09A', dx: 3, dy: -3, a: .8 } });
    if (sw < .12) { glow(c, x + 200 * k, y - 120 * k, 120, '#FFD08A', .8 * (1 - sw / .12)); for (let j = 0; j < 5; j++) { const q = (1 - sw / .12), a = j * 1.2 + ph; ellipse(c, x + 200 * k + Math.cos(a) * q * 70, y - 120 * k - Math.abs(Math.sin(a)) * q * 60, 4, 4, '#FFE0A0'); } }
  }
  debris(c, [100, 900, 1000], t, TL.tonnes, 7, 5, '#1A0C10', '#FF9A6A');
  motes(c, { n: 60, seed: 9, box: [-100, 600, W + 100, 1900], r: 3, col: '#FFB07A', a: .45, vx: 30, vy: -50, t });
} });

// ---------- shot 8: "Nothing could be added back. Every strike was FINAL.": the chisel, close; a chip falls away ----------
const STRIKES = () => [TL.final + .45, TL.final + 1.25, TL.final + 2.05, TL.strike + .1];
function chiselSwing(t) {
  const S = STRIKES(); let last = -9, next = 99; for (const s of S) { if (s <= t) last = s; else { next = s; break; } }
  if (next < 99 && t > next - .12) return (next - t) / .12;
  return last < -1 ? 1 : Math.min(1, (t - last) / .45);
}
SHOTS.push({ a: TL.final, b: TL.reveal + .4, xf: .4, draw(c, u, t) {
  const fin = ease(seg(t, TL.fin - .1, TL.fin + .4)), cam = { z: lerp(1, 1.12, easeIO(u / 4.4)) + fin * .04, fx: 420, fy: 1250 };
  plane(c, cam, 0, (c) => { SKY.rock(c); glow(c, 600, 1000, 700, '#FF9A50', .2 * (1 - fin * .6)); });
  plane(c, cam, 1, (c) => {
    // the rock face: a dark mass from the left, its edge catching the lamp
    const R = 'M -200 600 L 330 640 C 360 900 340 1100 380 1250 C 400 1420 350 1600 330 1900 L -200 1900 Z';
    fillPath(c, R, '#2A1E1C'); inside(c, R, () => { for (let i = 0; i < 30; i++) ellipse(c, hash(i * 3.3) * 400 - 100, 640 + hash(i * 5.1) * 1250, 30 + hash(i) * 70, 10 + hash(i * 2) * 20, rgba('#000', .18)); fillPath(c, 'M 260 600 L 400 600 L 400 1900 L 260 1900 Z', rgba('#FF9A60', .1)); });
    strokePath(c, 'M 330 640 C 360 900 340 1100 380 1250 C 400 1420 350 1600 330 1900', rgba('#FFB070', .5), 4);
    const sw = chiselSwing(t), chip = seg(t, TL.strike + .1, TL.strike + 1.4);
    c.save(); c.translate(390, 1250); c.scale(1.25, 1.25); c.translate(-70, 0); chiselClose(c, { swing: sw, chip }); c.restore();
    for (const s of STRIKES()) { const p = pulse(t, s, .02, 6); if (p > 0) { glow(c, 390, 1250, 320, '#FFD890', .9 * p); for (let j = 0; j < 7; j++) { const a = Math.PI * .6 + j * .25, r = (1 - p) * 160 + 20; ellipse(c, 390 + Math.cos(a) * r, 1250 + Math.sin(a) * r * .8 - 40, 5, 5, rgba('#FFE0A0', p)); } } }
  });
  plane(c, cam, 1.2, (c) => motes(c, { n: 40, seed: 11, box: [100, 900, 900, 1600], r: 3, col: '#E8C8A8', a: .4, vx: -20, vy: 40, t }));
} });

// ---------- shot 9: what remained: the finished shrine, over 30 metres; tiny people for scale ----------
SHOTS.push({ a: TL.reveal, b: TL.eleph + .4, xf: .6, draw(c, u, t) {
  const k = easeIO(u / 3.8), cam = kcam({ cx: 470, cy: lerp(1580, 1720, k), s: lerp(17, 15.5, k), th: lerp(.3, .22, k), el: lerp(.36, .42, k) });
  sky(c, [[0, GOLD_SKY[0]], [1920, GOLD_SKY[2]]]);
  ellora(c, { sky: (c, hy) => { horizonSky(c, hy, GOLD_SKY); glow(c, 700, hy, 600, '#FFE0A0', .5); }, cam, t, pal: TEMPLE_PAL.dawn, haze: '#FFB070', hazeLen: 200 });
  people(c, cam, [[-6, 18], [-4.6, 18.6], [7, 31], [-19, 50], [19.5, 47], [20.3, 47.6]]);
  const [bx, by] = cam.P(13, 51, 0), [, ty] = cam.P(13, 59.5, 32.4);
  heightMark(c, bx + 50, by, ty, '30 M', seg(t, TL.over - .3, TL.over + .9));
} });

// ---------- shot 10: "held up by stone ELEPHANTS": the plinth's elephants in a row, lamp-lit ----------
SHOTS.push({ a: TL.eleph + .3, b: TL.nandi + .4, xf: .5, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.06, easeIO(u / 2.4)), x: lerp(-50, 50, easeIO(u / 2.4)), fx: 540, fy: 1300 };
  plane(c, cam, 0, (c) => sky(c, [[0, '#120A08'], [900, '#2A1A14'], [1920, '#0A0606']]));
  plane(c, cam, 1, (c) => {
    // the plinth: mouldings above, the elephants' frieze, the floor
    fillPath(c, 'M -200 700 L 1300 700 L 1300 1060 L -200 1060 Z', '#3A2A26');
    for (let i = 0; i < 4; i++) fillPath(c, `M -200 ${730 + i * 80} L 1300 ${730 + i * 80} L 1300 ${756 + i * 80} L -200 ${756 + i * 80} Z`, '#2A1C1A');
    fillPath(c, 'M -200 1040 L 1300 1040 L 1300 1600 L -200 1600 Z', '#1A1010');
    glow(c, 540, 1500, 900, '#FF9A50', .3);
    const lit = pulse(t, TL.elephants, .2, 1.2);
    for (let i = -1; i <= 3; i++) {
      const x = 200 + i * 340;
      figure(c, (f) => { f.translate(x, 1560); f.scale(1.6, 1.6); elephantFront(f, { col: '#5A4640' }); },
        { tint: ['#3A2620', .35], edge: { col: '#FFC890', w: 2, a: .5 + lit * .4 }, rim: { col: '#FFD8A8', dx: 4, dy: -4, a: .6 + lit * .5, blur: 1 } });
    }
    fillPath(c, 'M -200 1560 L 1300 1560 L 1300 2100 L -200 2100 Z', '#0E0808');
    deepa(c, 370, 1650, 1.3, t); deepa(c, 710, 1650, 1.3, t + 1);
  });
  plane(c, cam, 1.2, (c) => motes(c, { n: 40, seed: 13, box: [-100, 800, W + 100, 1900], r: 3, col: '#FFC890', a: .4, vx: 6, vy: -24, t }));
} });

// ---------- shot 11: "Nandi in his own pavilion": the black stone Nandi between carved pillars ----------
SHOTS.push({ a: TL.nandi, b: TL.bridge - .2, xf: .5, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.08, easeIO(u / 3.2)), fx: 540, fy: 1300 };
  plane(c, cam, 1, (c) => nandiPavilion(c, t));
  plane(c, cam, 1.2, (c) => motes(c, { n: 30, seed: 15, box: [-100, 800, W + 100, 1900], r: 3, col: '#FFC890', a: .4, vx: 6, vy: -20, t }));
} });

// ---------- shot 12: "joined by a bridge of rock": close on the Nandi mandapa and the bridge to the hall ----------
SHOTS.push({ a: TL.bridge - .45, b: TL.ravana + .4, xf: .4, draw(c, u, t) {
  const k = easeIO(u / 1.9), s = lerp(21, 23, k), cam = isoCam({ cx: 0, cy: 0, s, th: lerp(1.0, .9, k), el: .3 });
  const [px, py] = cam.P(0, 32, 7), cam2 = kcam({ cx: 540 - px + 60, cy: 1250 - py, s, th: lerp(1.0, .9, k), el: .3 });
  sky(c, [[0, GOLD_SKY[0]], [1920, GOLD_SKY[2]]]);
  ellora(c, { sky: (c, hy) => horizonSky(c, hy, GOLD_SKY), cam: cam2, t, pal: TEMPLE_PAL.dawn, haze: '#FFB070', hazeLen: 160, omit: ['hillL', 'front'] });
  const sw = seg(t, TL.bridge - .2, TL.bridge + 1.2);
  if (sw > 0 && sw < 1) { const [bx, by] = cam2.P(0, lerp(30, 34, sw), 8.2); glow(c, bx, by, 160, '#FFE8B0', .6 * Math.sin(sw * Math.PI)); }
} });

// ---------- shot 13: the Ravana relief: Ravana under Kailash, Shiva and Parvati above, carved in the wall ----------
SHOTS.push({ a: TL.ravana, b: TL.plate + .4, xf: .5, draw(c, u, t) {
  const [sx, sy] = shake(t, TL.lifting, 6, 3), cam = { z: lerp(1.0, 1.08, easeIO(u / 4.2)), fx: 540, fy: 1200, x: sx, y: sy };
  plane(c, cam, 0, (c) => { sky(c, [[0, '#120C0C'], [1000, '#2A1E1A'], [1920, '#0A0606']]); for (let i = 0; i < 12; i++) strokePath(c, `M -50 ${200 + i * 150} L 1130 ${210 + i * 150}`, rgba('#000', .25), 3); });
  plane(c, cam, 1, (c) => ravanaRelief(c, 540, 1800, .78, { t, strain: .5 + pulse(t, TL.lifting, .3, 1) }));
  plane(c, cam, 1.2, (c) => motes(c, { n: 30, seed: 17, box: [-100, 600, W + 100, 1900], r: 3, col: '#FFC890', a: .35, vx: 6, vy: -20, t }));
} });

// ---------- shot 14: the copper plate of 812, a light sweeping its engraved lines ----------
SHOTS.push({ a: TL.plate, b: TL.gods + .1, xf: .5, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.1, easeIO(u / 4.4)), fx: 540, fy: 1150 };
  plane(c, cam, 0, (c) => { sky(c, [[0, '#0A0606'], [1100, '#24140E'], [1920, '#0A0606']]); glow(c, 540, 1150, 800, '#FF9A50', .25); });
  plane(c, cam, 1, (c) => { c.save(); c.translate(540, 1180); c.rotate(-.04 + u * .006); c.scale(1.2, 1.2); copperPlate(c, { t, shine: seg(t, TL.plate + .6, TL.plate + 3.4), lines: seg(t, TL.plate, TL.plate + 2.5) }); c.restore(); });
  plane(c, cam, 1.2, (c) => motes(c, { n: 30, seed: 19, box: [-100, 600, W + 100, 1900], r: 3, col: '#FFC890', a: .35, vx: 6, vy: -20, t }));
} });

// ---------- shot 15: the gods in their sky-chariots, gliding over the clouds; the temple's light below stops them ----------
SHOTS.push({ a: TL.gods - .2, b: TL.quote + .4, xf: .5, draw(c, u, t) {
  const st = ease(seg(t, TL.struck - .6, TL.struck + .6)), cam = { z: lerp(1.0, 1.06, easeIO(u / 4)), fx: 540, fy: 1100 };
  plane(c, cam, 0, (c) => { sky(c, [[0, '#0A0A20'], [600, '#1E2048'], [1100, '#5A3A5E'], [1600, '#C0784E'], [1920, '#FFD08A']]); stars(c, 60, 3, t, .5); });
  plane(c, cam, .3, (c) => { const ic = kcam({ cx: 540, cy: 2400, s: 5, th: .3, el: .9 }); ellora(c, { cam: ic, t, pal: { ...TEMPLE_PAL.night, ground: 'rgba(0,0,0,0)' }, lamps: 1, horizon: false, omit: ['hillL', 'hillR', 'hillB'], shadow: false }); glow(c, 540, 1800, 600, '#FFC870', .35 + .3 * st); });
  plane(c, cam, .6, (c) => clouds(c, [[-300, 1500, 1000, 61, 30], [400, 1650, 900, 62, 40, true], [-100, 1780, 900, 63, 24]], t, ['#2A1A34', '#5A3448', '#B0705A'], .85));
  plane(c, cam, 1, (c) => {
    for (const [x0, y, k, ph] of [[-260, 1020, .42, 0], [-560, 1240, .32, 1], [-80, 1330, .26, 2]]) {
      const run = (t - TL.gods + .2) * 150 * (1 - st * .85) + st * 30 + ph * 40, x = x0 + run + 400;
      c.save(); c.translate(x, y + Math.sin(t * 1.2 + ph) * 8); c.scale(k, k); pushpak(c, { t: t + ph, glow: .6 + st * .6 }); c.restore();
    }
  });
} });

// ---------- shot 16: "This temple made ITSELF. Such beauty is never man-made.": the temple by night, glowing ----------
SHOTS.push({ a: TL.quote, b: TL.arch + .4, xf: .6, draw(c, u, t) {
  const k = easeIO(u / 5), cam = kcam({ cx: 540, cy: 1560, s: lerp(11.5, 12.5, k), th: lerp(.05, .45, k), el: .55 });
  sky(c, [[0, NIGHT_SKY[0]], [1920, NIGHT_SKY[2]]]);
  ellora(c, { sky: (c, hy) => { horizonSky(c, hy, NIGHT_SKY); stars(c, 80, 5, t, .7); glow(c, 760, 300, 300, '#C8D8FF', .35); ellipse(c, 760, 300, 36, 36, '#EAF0FF'); }, cam, t, pal: TEMPLE_PAL.moon, lamps: .7, haze: '#26304C', hazeLen: 200 });
  const g = pulse(t, TL.itself, .2, .9), [px, py] = cam.P(0, 50, 18); glow(c, px, py, 700, '#FFD890', .2 + .25 * g);
  motes(c, { n: 50, seed: 21, box: [-100, 500, W + 100, 1900], r: 3, col: '#FFE0A0', a: .45, vx: 6, vy: -30, t });
} });

// ---------- shot 17: the architect, from behind, looking up at what he made: "Oh, how was it that I BUILT it?" ----------
SHOTS.push({ a: TL.arch, b: TL.ask + .4, xf: .6, draw(c, u, t) {
  const b = ease(seg(t, TL.built - .1, TL.built + 1.6)), k = easeIO(u / 6), cam = kcam({ cx: 520, cy: lerp(1850, 1820, k) + b * 30, s: lerp(14.5, 15.5, k) + b * 1.2, th: .02, el: .2 });
  sky(c, [[0, GOLD_SKY[0]], [1920, GOLD_SKY[2]]]);
  ellora(c, { sky: (c, hy) => { horizonSky(c, hy, GOLD_SKY); glow(c, 540, hy, 700, '#FFE0A0', .55 + b * .3); rays(c, 540, hy - 40, { n: 12, dir: -Math.PI / 2, spread: 3, len: 1200, w: 260, col: '#FFE2A8', a: .1 + b * .1, t }); }, cam, t, pal: TEMPLE_PAL.dawn, haze: '#FFC080', hazeLen: 140 });
  const aw = ease(seg(t, TL.oh - .2, TL.oh + 1.2));
  figure(c, (f) => { f.translate(800, 2010); f.scale(1.0, 1.0); sthapati(f, { awe: aw, look: .7 }); }, { tint: ['#0A0406', .9], edge: { col: '#FFD9A0', w: 2.4, a: .85 }, rim: { col: '#FFF0C8', dx: -4, dy: -5, a: .9, blur: 1 } });
  motes(c, { n: 50, seed: 23, box: [-100, 400, W + 100, 1900], r: 3, col: '#FFE0A0', a: .5, vx: 6, vy: -30, t });
} });

// ---------- shot 18: the temple at night with its lamps lit: the call-out ----------
SHOTS.push({ a: TL.ask, b: TL.card + .5, xf: .6, draw(c, u, t) {
  const k = easeIO(u / 6.4), cam = kcam({ cx: 540, cy: 1620, s: lerp(11.2, 12, k), th: lerp(.3, .42, k), el: .55 });
  sky(c, [[0, NIGHT_SKY[0]], [1920, NIGHT_SKY[2]]]);
  ellora(c, { sky: (c, hy) => { horizonSky(c, hy, NIGHT_SKY); stars(c, 90, 7, t, .8); }, cam, t, pal: TEMPLE_PAL.night, lamps: 1, haze: '#1C1C30', hazeLen: 200 });
  motes(c, { n: 40, seed: 25, box: [-100, 800, W + 100, 1900], r: 3, col: '#FFC890', a: .45, vx: 6, vy: -20, t });
} });

// ---------- shot 19: the follow card ----------
SHOTS.push({ a: TL.card, b: TL.end + 1, xf: .6, draw(c, u, t) {
  sky(c, [[0, '#04100E'], [900, '#0F2A27'], [1920, '#050E0C']]);
  glow(c, 520, 1000, 760, '#2E5F5A', .55, 'screen');
  motes(c, { n: 60, seed: 61, box: [-50, 300, W + 50, 1900], r: 3, col: '#F4C46A', a: .6, vx: 6, vy: -26, t });
  const X = 540, pk = (d) => u - d;
  picture(c, PICS.logo, X, 520, 132, 132, { pop: pk(.2), r: 66 });
  text(c, 'KAILASA, ELLORA', X, 668, '700 64px Cinzel', '#F4C46A', { pop: pk(.4), glow: ['rgba(244,196,106,.55)', 26], spacing: 3, maxW: 860 });
  const k = popK(pk(.6));
  if (k > .01) {
    glow(c, X, 980, 320 * k, '#FFC870', .3);
    c.save(); c.translate(X, 1000); c.scale(k, k); c.translate(-X, -1000);
    ellora(c, { cam: kcam({ cx: X, cy: 1150, s: 6, th: .35 + u * .05, el: .5 }), t, pal: { ...TEMPLE_PAL.dawn, ground: 'rgba(0,0,0,0)' }, horizon: false, omit: ['hillL', 'hillR', 'hillB'], shadow: false });
    c.restore();
  }
  text(c, 'Stories of Shiva and the gods', X, 1250, '42px Marcellus', '#FBE0CF', { pop: pk(1.0), maxW: 840 });
  const kk = popK(pk(1.3)) * (1 + .03 * Math.max(0, Math.sin(t * 5)));
  if (kk > .01) { c.save(); c.translate(X, 1370); c.scale(kk, kk); c.fillStyle = '#F15A24'; c.shadowColor = 'rgba(241,90,36,.6)'; c.shadowBlur = 30; c.beginPath(); c.roundRect(-300, -48, 600, 96, 48); c.fill(); c.restore(); }
  text(c, 'Follow @therishikatha', X, 1373, '700 50px Poppins', '#FFFFFF', { pop: pk(1.3), maxW: 540 });
  text(c, 'rishikatha.com', X, 1470, '500 36px Poppins', '#CFE3DF', { pop: pk(1.6) });
} });

// ---------- flashes ----------
POST.push((c, t) => {
  flash(c, .35 * pulse(t, TL.carved, .05, 3), '#FFE8C0', 'screen');      // CARVED
  flash(c, .25 * pulse(t, TL.standing, .1, 2), '#FFE8C0', 'screen');     // the island stands
  flash(c, .5 * pulse(t, TL.fin, .04, 2.4), '#FFFFFF', 'screen');        // FINAL
  flash(c, .2 * pulse(t, TL.tall, .1, 2), '#FFE8B0', 'screen');          // 30 metres
  flash(c, .25 * pulse(t, TL.itself, .1, 1.6), '#FFE8B0', 'screen');     // made ITSELF
  flash(c, .45 * pulse(t, TL.built, .05, 1.4), '#FFE8B0', 'screen');     // how was it that I BUILT it
});

// ---------- captions (from the voice) ----------
// the hook's first chunk is up and lit at frame 0 (the thumbnail)
VO.caps.forEach((k, i) => say(i ? k.a : -.35, k.b, k.text, { at: i ? k.at : k.at.map(() => -.35), y: k.y, size: k.size }));
