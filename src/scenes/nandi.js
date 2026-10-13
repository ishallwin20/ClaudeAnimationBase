// nandi.js: "Why do people WHISPER in NANDI's ear?" (reel/nandi-whisper), in the Cinematic style (src/cine.js).
// The Shiva Purana's story of Nandi: Sage Shilada's prayer, the glowing child in the ploughed field, the sages' doom
// ("he will die at eight"), the boy's prayer by the river, Shiva making him immortal (his gatekeeper and vahana); then
// why devotees whisper in his ear, why every Nandi faces Shiva, the callback to Ravana's Lanka, the one temple where
// Nandi moved (Thirupunkur, for Nandanar), the place call-out and a follow card. Times are in TL;
// tools/nandi_sfx.mjs uses the same ones.
const TL = { hook: 0, eye: 2.6, shilada: 5.0, field: 8.0, glow: 9.6, child: 10.4, boy: 13.0, sages: 15.6, doom: 18.4,
  river: 20.9, shiva: 26.0, appear: 26.6, bless: 28.8, bull: 30.0, kailash: 34.0, whisper: 39.4, thread: 42.2, faces: 44.8,
  ravana: 49.6, twist: 52.6, move: 54.6, ask: 58.4, card: 61.6, end: 65.6 };

// ---------- shared pieces ----------
const SIL = (col = '#1A0C14', a = .88) => ({ ...LIGHTS.dawnBack, tint: [col, a] });
const STONE = (a = 1) => ({ edge: { col: '#FFB070', w: 2.2, a: .5 * a }, rim: { col: '#FFD08A', dx: -6, dy: -3, a: .85 * a, blur: 1 } });
const WOMAN = { tint: ['#160606', .2], edge: { col: '#FFB070', w: 2.2, a: .7 }, rim: { col: '#FFD9A0', dx: -6, dy: -2, a: .95, blur: 1 } };
const templeBg = (c, t, warm = 1) => { sky(c, [[0, '#070404'], [900, '#1A0E0A'], [1900, '#2A1610']]); glow(c, 160, 900, 900, '#FF9A40', .35 * warm); };
// the temple's stone Nandi on his pedestal, the devotee at his ear. X, Y: Nandi's origin; K: his scale. o: ear, woman
// (0..1 her presence), pose, sanctum (x of the doorway, or null), open (the sanctum's light).
function templeNandi(c, cam, t, X, Y, K, o = {}) {
  plane(c, cam, 0, (c) => templeBg(c, t));
  plane(c, cam, .4, (c) => { if (o.pillars) pillars(c, 160, 1700, 200, '#1A0E0C', t, 6, 70); });
  plane(c, cam, 1, (c) => {
    if (o.sanctum != null) sanctum(c, o.sanctum, Y + 40 * K, K * .9, t, { open: o.open ?? .4 });
    // the pedestal
    fillPath(c, `M ${X - 380 * K} ${Y} L ${X + 330 * K} ${Y} L ${X + 330 * K} ${Y + 300} L ${X - 380 * K} ${Y + 300} Z`, '#1C1210');
    fillPath(c, `M ${X - 396 * K} ${Y} L ${X + 346 * K} ${Y} L ${X + 346 * K} ${Y + 22} L ${X - 396 * K} ${Y + 22} Z`, '#2C1C16');
    strokePath(c, `M ${X - 396 * K} ${Y} L ${X + 346 * K} ${Y}`, rgba('#FFB070', .35), 3);
    fillPath(c, `M -200 ${Y + 300} L ${W + 200} ${Y + 300} L ${W + 200} 2400 L -200 2400 Z`, '#120A08');
    figure(c, (f) => { f.translate(X, Y); f.scale(K, K); nandiLying(f, { t, stone: true, ear: o.ear || 0 }); }, STONE());
    if (o.lamps !== false) { deepa(c, X - 365 * K, Y + 4, K * .9, t, 1, 3); deepa(c, X + 260 * K, Y + 4, K * .9, t, 1, 4); }
    if (o.woman) figure(c, (f) => { f.translate(o.wx, o.wy); f.scale(o.wk, o.wk); devotee(f, { t, pose: o.pose || 'whisper', col: '#2A1012' }); }, { ...WOMAN, alpha: o.woman });
  });
}

// ---------- shot 1: the hook. A woman whispers into the ear of a temple's stone Nandi ----------
const HK = { X: 900, Y: 1330, K: 2.0, wx: 676, wy: 1630, wk: .89 };
SHOTS.push({ a: TL.hook, b: TL.shilada + .4, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.12, easeIO(u / 5.4)), fx: 520, fy: 960 };
  templeNandi(c, cam, t, HK.X, HK.Y, HK.K, { ear: ease(seg(t, 1.2, 1.8)) * .8, woman: 1, wx: HK.wx, wy: HK.wy, wk: HK.wk });
  plane(c, cam, 1.2, (c) => motes(c, { n: 30, seed: 3, box: [-100, 300, W + 100, 1900], r: 2.5, col: '#FFC890', a: .5, vx: 6, vy: -20, t }));
} });

// ---------- shot 2: Sage Shilada's prayer ----------
SHOTS.push({ a: TL.shilada, b: TL.field + .4, xf: .5, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.1, easeIO(u / 3.4)), fx: 540, fy: 1200 };
  plane(c, cam, 0, (c) => { sky(c, [[0, '#060A15'], [700, '#152039'], [1300, '#3A2E50'], [1700, '#6A4A60']]); stars(c, 120, 6, t, .8); });
  plane(c, cam, .05, (c) => { glow(c, 540, 300, 600, '#9FB4E6', .25); rays(c, 540, 0, { n: 7, dir: Math.PI / 2, spread: .5, len: 1700, w: 220, col: '#C8D6FF', a: .1, t, seed: 2 }); });
  plane(c, cam, .3, (c) => { kailash(c, 540, 820, 560, { rock: '#1A1E30', snow: '#8A96B8', snowSh: '#3A4260' }); haze(c, 1300, 300, '#4A4E70', .5); });
  plane(c, cam, 1, (c) => {
    fillPath(c, 'M -200 1480 C 200 1450 800 1450 1280 1490 L 1280 2400 L -200 2400 Z', '#0C0A12');
    yagna(c, 360, 1480, 150, t, .8);
    figure(c, (f) => { f.translate(640, 1480); f.scale(.95, .95); rishi(f, { t, pose: 'sit' }); }, { ...LIGHTS.fire, tint: ['#140808', .82], rim: { ...LIGHTS.fire.rim, dx: -5 } });
    embers(c, 360, 1440, t, 20, 4, 140, 500);
  });
} });

// ---------- shot 3: the field at dawn; the plough strikes light; a glowing child ----------
SHOTS.push({ a: TL.field, b: TL.boy + .4, xf: .5, draw(c, u, t) {
  const g = ease(seg(t, TL.glow, TL.child + .6)), walk = clamp((t - TL.field) / (TL.glow - TL.field)), cam = { z: lerp(1.0, 1.16, easeIO(u / 5.4)), fx: 430, fy: 1250 };
  plane(c, cam, 0, (c) => { sky(c, [[0, '#24183A'], [560, '#5E2E4E'], [1000, '#C9663D'], [1180, '#FFCF86']]); glow(c, 820, 1150, 700, '#FFB45A', .5); ellipse(c, 820, 1150, 120, 120, '#FFE9B8'); });
  plane(c, cam, .3, (c) => { ridge(c, 1150, 60, 12, '#3A1E30'); });
  plane(c, cam, 1, (c) => {
    furrows(c, 1170, t, { far: '#5A3026', near: '#120806' });
    const px = lerp(760, 560, walk), sx = px - 80;
    // the plough's track and the light rising from the earth where it struck
    if (g > 0) { glow(c, 380, 1380, 700 * g, '#FFC870', .8 * g); rays(c, 380, 1380, { n: 12, dir: -Math.PI / 2, spread: 1.6, len: 1100 * g, w: 140, col: '#FFE2A0', a: .3 * g, t, seed: 5 }); }
    figure(c, (f) => { f.translate(sx - 120, 1420); f.scale(.62, .62); plough(f, {}); }, SIL('#140A0A', .9));
    figure(c, (f) => { f.translate(px + 40, 1440); f.scale(.6, .6); rishi(f, { t, pose: 'plough' }); }, SIL('#140A0A', .9));
    if (g > 0) {
      const lift = ease(seg(t, TL.child, TL.child + 1.4));
      glow(c, 380, 1360 - 60 * lift, 260 * g, '#FFF2C8', .9 * g);
      figure(c, (f) => { f.translate(390, 1386 - 70 * lift); f.scale(.9, .9); boy(f, { t, pose: 'baby', col: '#FFF0D0' }); }, { edge: { col: '#FFFFFF', w: 2, a: .8 }, alpha: g });
    }
  });
  plane(c, cam, 1.2, (c) => motes(c, { n: 40 + 40 * g, seed: 8, box: [100, 700, 700, 1500], r: 3, col: '#FFE2A0', a: .4 + .4 * g, vx: 4, vy: -40, t }));
} });

// ---------- shot 4: the boy grows up beside his father ----------
SHOTS.push({ a: TL.boy, b: TL.sages + .4, xf: .5, draw(c, u, t) {
  const cam = { z: lerp(1.04, 1.12, easeIO(u / 3)), fx: 540, fy: 1300 };
  plane(c, cam, 0, (c) => { sky(c, [[0, '#2A1A3A'], [700, '#7A3A4A'], [1200, '#E08A50'], [1450, '#FFD08A']]); glow(c, 540, 1300, 800, '#FFB45A', .5); });
  plane(c, cam, .3, (c) => { ridge(c, 1340, 80, 3, '#3A1E30'); for (let i = 0; i < 3; i++) shrine(c, 120 + i * 60, 1350, 1, '#2A1424'); });
  plane(c, cam, 1, (c) => {
    fillPath(c, 'M -200 1480 C 200 1460 800 1460 1280 1490 L 1280 2400 L -200 2400 Z', '#1C0E16');
    figure(c, (f) => { f.translate(430, 1480); f.scale(.82, .82); boy(f, { t }); f.setTransform(c.getTransform()); f.translate(700, 1480); f.scale(.8, .8); rishi(f, { t }); }, SIL('#1A0C14', .86));
  });
} });

// ---------- shot 5: two sages foretell his death; the light drains ----------
SHOTS.push({ a: TL.sages, b: TL.river + .4, xf: .4, draw(c, u, t) {
  const dk = ease(seg(t, TL.doom - .4, TL.doom + .6)), walk = easeOut(seg(t, TL.sages, TL.sages + 2.2)), cam = { z: lerp(1.0, 1.2, easeIO(u / 5.3)), fx: 640, fy: 1150 };
  plane(c, cam, 0, (c) => { sky(c, [[0, mixCol('#2A1A3A', '#05070F', dk)], [700, mixCol('#7A3A4A', '#0E1428', dk)], [1200, mixCol('#E08A50', '#1E2440', dk)], [1450, mixCol('#FFD08A', '#2A3050', dk)]]); glow(c, 540, 1300, 800, '#FFB45A', .5 * (1 - dk)); });
  plane(c, cam, .1, (c) => { if (dk > 0) clouds(c, [[-200, 300 + 200 * dk, 900, 21, 40], [500, 420 + 200 * dk, 800, 22, 50, true]], t, PALETTES.nightFar, .8 * dk); });
  plane(c, cam, .3, (c) => ridge(c, 1340, 80, 3, mixCol('#3A1E30', '#0C1020', dk)));
  plane(c, cam, 1, (c) => {
    fillPath(c, 'M -200 1480 C 200 1460 800 1460 1280 1490 L 1280 2400 L -200 2400 Z', mixCol('#1C0E16', '#070A12', dk));
    const L = dk > .5 ? { ...LIGHTS.moonSilhouette } : SIL('#1A0C14', .86);
    figure(c, (f) => { f.translate(lerp(-120, 300, walk), 1480); f.scale(-.78, .78); rishi(f, { t, pose: t > TL.doom - .6 ? 'point' : 'stand' }); f.setTransform(c.getTransform()); f.translate(lerp(-260, 130, walk), 1480); f.scale(-.74, .74); rishi(f, { t: t + 1 }); }, L);
    figure(c, (f) => { f.translate(660, 1480); f.scale(-.82, .82); boy(f, { t }); f.setTransform(c.getTransform()); f.translate(900, 1480); f.scale(-.8, .8); rishi(f, { t, staff: false }); }, L);
    if (dk > 0) glow(c, 660, 1180, 220, '#6A86C8', .25 * dk);
  });
} });

// ---------- shot 6: the river at night; the boy prays; the moon crosses (time passes) ----------
SHOTS.push({ a: TL.river, b: TL.shiva + .3, xf: .5, draw(c, u, t) {
  const m = seg(t, TL.river, TL.shiva), mx = lerp(900, 200, m), my = 560 - Math.sin(m * Math.PI) * 220, cam = { z: lerp(1.0, 1.1, easeIO(u / 5.4)), fx: 700, fy: 1300 };
  plane(c, cam, 0, (c) => { sky(c, [[0, '#04060E'], [700, '#0E1630'], [1150, '#25305A']]); stars(c, 160, 11, t, 1); });
  plane(c, cam, .05, (c) => { glow(c, mx, my, 420, '#8FA6DC', .45); ellipse(c, mx, my, 40, 40, '#E6ECF6'); });
  plane(c, cam, .3, (c) => { ridge(c, 1140, 90, 41, '#0A0E1C'); river(c, 1150, 260, t, mx, '#0A1226'); });
  plane(c, cam, 1, (c) => {
    fillPath(c, 'M 380 1600 C 600 1400 900 1380 1280 1390 L 1280 2400 L 380 2400 Z', '#05070E');
    figure(c, (f) => { f.translate(800, 1420); f.scale(.9, .9); boy(f, { t, pose: 'sit' }); }, LIGHTS.moonSilhouette);
    glow(c, 742, 1240, 90, '#C8D6FF', .2 + .1 * Math.sin(t * 3));
  });
  plane(c, cam, 1.2, (c) => motes(c, { n: 30, seed: 12, box: [-100, 600, W + 100, 1900], r: 2, col: '#BFD0FF', a: .4, vx: 8, vy: -10, t }));
} });

// ---------- shot 7: Shiva appears in a column of light; the boy is touched by it ----------
SHOTS.push({ a: TL.shiva, b: TL.bull + .25, xf: .3, draw(c, u, t) {
  const ap = ease(seg(t, TL.appear - .2, TL.appear + 1.2)), bl = ease(seg(t, TL.bless, TL.bull)), cam = { z: lerp(1.08, 1.0, easeOut(u / 4)), fx: 540, fy: 1100 };
  plane(c, cam, 0, (c) => { sky(c, [[0, '#04060E'], [700, '#101A3A'], [1150, '#2A3666']]); stars(c, 160, 11, t, 1 - ap * .6); });
  plane(c, cam, .1, (c) => { glow(c, 420, 900, 1100 * ap, '#AFC6FF', .5 * ap); rays(c, 420, -100, { n: 9, dir: Math.PI / 2, spread: .35, len: 2200, w: 260, col: '#DDE8FF', a: .35 * ap, t, seed: 4 }); });
  plane(c, cam, .3, (c) => { ridge(c, 1140, 90, 41, '#0A0E1C'); river(c, 1150, 260, t, 420, '#0C1530'); glow(c, 420, 1200, 500 * ap, '#C8D6FF', .25 * ap); });
  plane(c, cam, 1, (c) => {
    if (ap > 0) figure(c, (f) => { f.translate(420, 1650); f.scale(.94, .94); shiva(f, { t, eyes: ap, arm: 'abhaya', wind: .5 }); }, { ...LIGHTS.moon, alpha: ap, edge: { col: '#E8F0FF', w: 3, a: .8 }, rim: { col: '#FFFFFF', dx: 0, dy: -6, a: 1, blur: 2 } });
    fillPath(c, 'M 520 1700 C 700 1560 900 1540 1280 1550 L 1280 2400 L 520 2400 Z', '#05070E');
    figure(c, (f) => { f.translate(860, 1580); f.scale(.8, .8); boy(f, { t, pose: 'sit', col: mixCol('#120C10', '#FFF4DA', bl) }); }, { ...LIGHTS.moonSilhouette, tint: ['#0A0F1C', .84 * (1 - bl)], edge: { col: '#FFFFFF', w: 2, a: .6 + .4 * bl } });
    if (bl > 0) { glow(c, 820, 1420, 400 * bl, '#FFF2C8', .8 * bl); glow(c, 820, 1420, 120, '#FFFFFF', bl); }
  });
} });

// ---------- shot 8: the great white bull, in gold light ----------
SHOTS.push({ a: TL.bull, b: TL.kailash + .5, draw(c, u, t) {
  const cam = { z: lerp(1.12, 1.0, easeOut(u / 4.2)), fx: 540, fy: 1200 };
  plane(c, cam, 0, (c) => { sky(c, [[0, '#24183A'], [560, '#5E2E4E'], [1000, '#C9663D'], [1380, '#FFCF86'], [1600, '#FFE2A8']]); glow(c, 540, 1190, 900, '#FFB45A', .55); ellipse(c, 540, 1190, 300, 300, '#FFE9B8'); });
  plane(c, cam, .05, (c) => rays(c, 540, 1190, { n: 18, dir: -Math.PI / 2, spread: 3.2, len: 1500, w: 200, col: '#FFE2A0', a: .18, t, seed: 9 }));
  plane(c, cam, .3, (c) => ridge(c, 1500, 120, 62, '#3A1E34'));
  plane(c, cam, 1, (c) => {
    fillPath(c, 'M -100 1640 C 200 1600 500 1590 700 1600 C 900 1610 1100 1640 1180 1660 L 1180 2400 L -100 2400 Z', '#24121E');
    figure(c, (f) => { f.translate(590, 1630); f.scale(1.4, 1.4); nandiStanding(f, { t }); }, { tint: ['#3A1830', .12], edge: { col: '#FFD9A0', w: 2.4, a: .75 }, rim: { col: '#FFF0C8', dx: 5, dy: -3, a: .9, blur: 1 } });
  });
  plane(c, cam, 1.2, (c) => motes(c, { n: 60, seed: 21, box: [-100, 500, W + 100, 1900], r: 3, col: '#FFE2A0', a: .6, vx: 6, vy: -30, t }));
} });

// ---------- shot 9: Kailash at night; Shiva meditates; Nandi guards the way ----------
SHOTS.push({ a: TL.kailash, b: TL.whisper + .4, xf: .6, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.1, easeIO(u / 5.4)), fx: 540, fy: 1000 };
  plane(c, cam, 0, (c) => { sky(c, [[0, '#060A15'], [650, '#111A30'], [1200, '#283350'], [1520, '#47516E']]); stars(c, 100, 2, t, .7); glow(c, 820, 440, 520, '#7F97CC', .4); ellipse(c, 820, 440, 46, 46, '#E6ECF6'); });
  plane(c, cam, .1, (c) => { rays(c, 820, 440, { n: 9, dir: 1.98, spread: .8, len: 1600, w: 300, col: '#A9BCE6', a: .12, t }); clouds(c, [[0, 300, 760, 1, 9], [600, 420, 620, 2, 12, true]], t, PALETTES.nightFar, .9); });
  plane(c, cam, .3, (c) => { kailash(c, 540, 700, 640); haze(c, 1300, 300, '#7886A6', .5); });
  plane(c, cam, .5, (c) => { ridge(c, 1260, 90, 3, '#1A2133', { freq: .006 }); glow(c, 330, 1130, 160, '#9FC0FF', .45); figure(c, (f) => { f.translate(330, 1236); f.scale(.34, .34); shivaSeated(f, { t }); }, LIGHTS.moonSilhouette); });
  plane(c, cam, 1, (c) => {
    fillPath(c, 'M -200 1560 C 200 1530 700 1530 1280 1580 L 1280 2400 L -200 2400 Z', '#0C111D');
    figure(c, (f) => { f.translate(780, 1640); f.scale(.86, .86); nandiStanding(f, { t }); }, LIGHTS.moon);
  });
  plane(c, cam, 1.2, (c) => motes(c, { n: 60, seed: 9, box: [-100, 0, W + 100, 1950], r: 3, col: '#DCE6FF', a: .5, vx: 60, vy: 90, t }));
} });

// ---------- shot 10: the whisper; a thread of light runs from his ear to the sanctum ----------
const WS = { X: 900, Y: 1320, K: 1.5, sx: 170 };
SHOTS.push({ a: TL.whisper, b: TL.faces + .4, xf: .5, draw(c, u, t) {
  const th = seg(t, TL.thread, TL.thread + 1.4), op = .4 + .6 * ease(seg(t, TL.thread + 1.2, TL.thread + 2)), cam = { z: lerp(1.0, 1.06, easeIO(u / 5.4)), fx: 540, fy: 900 };
  templeNandi(c, cam, t, WS.X, WS.Y, WS.K, { ear: .2 + .6 * ease(seg(t, TL.whisper + 1, TL.whisper + 1.6)), woman: 1, wx: 725, wy: 1620, wk: .78, sanctum: WS.sx, open: op });
  plane(c, cam, 1, (c) => {
    if (th <= 0) return;
    // the ear, then a curve over his head to the doorway's light; sparks run along it
    const p0 = [WS.X - 160 * WS.K, WS.Y - 205 * WS.K], p1 = [500, 780], p2 = [WS.sx + 20, WS.Y - 240];
    const at = (s) => [(1 - s) ** 2 * p0[0] + 2 * s * (1 - s) * p1[0] + s * s * p2[0], (1 - s) ** 2 * p0[1] + 2 * s * (1 - s) * p1[1] + s * s * p2[1]];
    c.save(); c.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 60; i++) { const s = i / 60; if (s > th) break; const [x, y] = at(s); glow(c, x, y, 26, '#FFC870', .35); }
    for (let i = 0; i < 6; i++) { const s = frac(t * .6 + i / 6) * th; const [x, y] = at(s); glow(c, x, y, 40, '#FFF2C8', .7); }
    const [hx, hy] = at(th); glow(c, hx, hy, 90, '#FFF2C8', .8);
    c.restore();
  });
} });

// ---------- shot 11: the wide: every Nandi faces Shiva ----------
SHOTS.push({ a: TL.faces, b: TL.ravana + .3, xf: .6, draw(c, u, t) {
  const cam = { z: lerp(1.12, 1.0, easeOut(u / 5)), fx: 540, fy: 1200 };
  templeNandi(c, cam, t, 760, 1300, 1.0, { sanctum: 210, open: .8, pillars: true });
  plane(c, cam, 1, (c) => { const a = .35 + .15 * Math.sin(t * 2); c.save(); c.globalCompositeOperation = 'lighter'; const g = c.createLinearGradient(260, 0, 600, 0); g.addColorStop(0, rgba('#FFC870', a)); g.addColorStop(1, rgba('#FFC870', 0)); c.fillStyle = g; c.fillRect(260, 1060, 340, 200); c.restore(); });
  plane(c, cam, 1.2, (c) => motes(c, { n: 40, seed: 31, box: [-100, 300, W + 100, 1900], r: 2.5, col: '#FFC890', a: .5, vx: 6, vy: -20, t }));
} });

// ---------- shot 12: the callback: the bull whose curse burned Ravana's Lanka ----------
SHOTS.push({ a: TL.ravana, b: TL.twist + .3, xf: .3, draw(c, u, t) {
  const eyes = ease(seg(t, TL.ravana + .6, TL.ravana + 1.1)), cam = { z: lerp(1.0, 1.1, easeIO(u / 3.3)), fx: 400, fy: 1100 }, hu = seg(t, TL.ravana + .4, TL.twist + .2);
  plane(c, cam, 0, (c) => { sky(c, [[0, '#12040A'], [600, '#3A0A12'], [1200, '#8A1E16'], [1650, '#D0461E']]); glow(c, 540, 1500, 1000, '#FF5A1E', .45); });
  plane(c, cam, .3, (c) => { lanka(c, 1520, t, 1, 7); c.save(); c.translate(lerp(-200, 1300, hu), 1150 - Math.sin(hu * Math.PI) * 160); c.scale(.4, .4); const tip = hanumanLeap(c, { t, col: '#0C0406' }); glow(c, tip[0], tip[1], 140, '#FF8A2A', .9); c.restore(); });
  plane(c, cam, 1, (c) => {
    fillPath(c, 'M -200 1640 C 200 1610 700 1610 1280 1650 L 1280 2400 L -200 2400 Z', '#14060A');
    figure(c, (f) => { f.translate(560, 1680); f.scale(1.25, 1.25); nandiStanding(f, { t, eyes }); }, { tint: ['#1A0606', .35], edge: { col: '#FF9A6A', w: 2.4, a: .8 }, rim: { col: '#FFC09A', dx: 0, dy: -5, a: .8, blur: 1 } });
    embers(c, 540, 1900, t, 50, 8, 1100, 1300);
  });
} });

// ---------- shot 13: Thirupunkur: Nandi moves aside so Nandanar, outside the gate, can see ----------
SHOTS.push({ a: TL.twist, b: TL.ask + .4, xf: .4, draw(c, u, t) {
  const mv = easeIO(seg(t, TL.move, TL.move + 1.4)), lit = ease(seg(t, TL.move + .6, TL.move + 2)), cam = { z: lerp(1.0, 1.1, easeIO(u / 6)), fx: 600, fy: 1200 };
  plane(c, cam, 0, (c) => { sky(c, [[0, '#0E0A1E'], [700, '#2A1838'], [1250, '#6A3048'], [1560, '#E08A5A']]); glow(c, 540, 1500, 900, '#FFB45A', .3); });
  plane(c, cam, .5, (c) => { gopuram(c, 400, 1520, 1.1, { door: .7 + .3 * lit }); });
  plane(c, cam, 1, (c) => {
    fillPath(c, 'M -200 1520 L 1280 1520 L 1280 2400 L -200 2400 Z', '#120A0C');
    // the light through the gate, falling on Nandanar once the way is clear
    if (lit > 0) { c.save(); c.globalCompositeOperation = 'lighter'; const g = c.createLinearGradient(400, 0, 900, 0); g.addColorStop(0, rgba('#FFD08A', .55 * lit)); g.addColorStop(1, rgba('#FFD08A', .1 * lit)); c.fillStyle = g;
      c.beginPath(); c.moveTo(440, 1300); c.lineTo(1000, 760); c.lineTo(1000, 1560); c.lineTo(440, 1520); c.closePath(); c.fill(); c.restore(); glow(c, 830, 1100, 400, '#FFD08A', .4 * lit); }
    // Nandi in the gateway, then aside
    figure(c, (f) => { f.translate(lerp(420, 120, mv), 1520 + 40 * mv); f.scale(.6 + .14 * mv, .6 + .14 * mv); nandiLying(f, { t, col: '#0E0808' }); }, { edge: { col: '#FFD08A', w: 2, a: .7 }, rim: { col: '#FFE8B0', dx: 4, dy: -3, a: .9 } });
    figure(c, (f) => { f.translate(850, 1560); f.scale(.82, .82); nandanar(f, { t, raise: .3 + .7 * ease(seg(t, TL.move + 1, TL.move + 2.2)) }); }, { tint: ['#140A0C', .9 - .3 * lit], edge: { col: '#FFD08A', w: 2.2, a: .6 + .3 * lit }, rim: { col: '#FFE8B0', dx: -5, dy: -2, a: .5 + .5 * lit, blur: 1 } });
  });
  plane(c, cam, 1.2, (c) => motes(c, { n: 40, seed: 41, box: [300, 600, 1100, 1700], r: 3, col: '#FFE2A0', a: .3 + .4 * lit, vx: 10, vy: -25, t }));
} });

// ---------- shot 14: the call-out, back at the temple ----------
SHOTS.push({ a: TL.ask, b: TL.card + .5, xf: .5, draw(c, u, t) {
  const cam = { z: lerp(1.1, 1.02, easeOut(u / 3.6)), fx: 520, fy: 960 };
  templeNandi(c, cam, t, HK.X, HK.Y, HK.K, { ear: .8, woman: 1, wx: HK.wx, wy: HK.wy, wk: HK.wk });
  plane(c, cam, 1.2, (c) => motes(c, { n: 30, seed: 3, box: [-100, 300, W + 100, 1900], r: 2.5, col: '#FFC890', a: .5, vx: 6, vy: -20, t }));
} });

// ---------- shot 15: the follow card ----------
SHOTS.push({ a: TL.card, b: TL.end + 1, xf: .6, draw(c, u, t) {
  sky(c, [[0, '#04100E'], [900, '#0F2A27'], [1920, '#050E0C']]);
  glow(c, 520, 1000, 760, '#2E5F5A', .55, 'screen');
  motes(c, { n: 60, seed: 61, box: [-50, 300, W + 50, 1900], r: 3, col: '#F4C46A', a: .6, vx: 6, vy: -26, t });
  const X = 520, pk = (d) => u - d;
  picture(c, PICS.logo, X, 520, 132, 132, { pop: pk(.2), r: 66 });
  text(c, 'HAR HAR MAHADEV', X, 668, '700 64px Cinzel', '#F4C46A', { pop: pk(.4), glow: ['rgba(244,196,106,.55)', 26], spacing: 3, maxW: 860 });
  const k = popK(pk(.6));
  if (k > .01) { glow(c, X, 1000, 300 * k, '#FFC870', .35); figure(c, (f) => { f.translate(X + 40, 1130); f.scale(.82 * k, .82 * k); nandiLying(f, { t }); }, { tint: ['#0A1A18', .25], edge: { col: '#F4C46A', w: 2.2, a: .8 }, rim: { col: '#FFE8B0', dx: 4, dy: -3, a: .9 } }); }
  text(c, 'Stories of Shiva and the gods', X, 1250, '42px Marcellus', '#FBE0CF', { pop: pk(1.0), maxW: 840 });
  const kk = popK(pk(1.3)) * (1 + .03 * Math.max(0, Math.sin(t * 5)));
  if (kk > .01) { c.save(); c.translate(X, 1370); c.scale(kk, kk); c.fillStyle = '#F15A24'; c.shadowColor = 'rgba(241,90,36,.6)'; c.shadowBlur = 30; c.beginPath(); c.roundRect(-300, -48, 600, 96, 48); c.fill(); c.restore(); }
  text(c, 'Follow @therishikatha', X, 1373, '700 50px Poppins', '#FFFFFF', { pop: pk(1.3), maxW: 540 });
  text(c, 'rishikatha.com', X, 1470, '500 36px Poppins', '#CFE3DF', { pop: pk(1.6) });
} });

// ---------- flashes ----------
const pulse = (t, t0, up, down) => t < t0 - up || t > t0 + 3 ? 0 : t < t0 ? ease(seg(t, t0 - up, t0)) : Math.exp(-(t - t0) * down);
POST.push((c, t) => {
  flash(c, .45 * pulse(t, TL.glow + .1, .1, 3), '#FFE8B0', 'screen');        // the plough strikes light
  flash(c, .6 * pulse(t, TL.appear, .15, 3), '#DDE8FF', 'screen');          // Shiva appears
  flash(c, 1 * pulse(t, TL.bull, .5, 2.2), '#FFFFFF', 'source-over');       // the boy becomes the bull
  flash(c, .4 * pulse(t, TL.ravana + .9, .05, 4), '#FFB070');               // his eyes flare
});

// ---------- captions (2.2–3 s a line; names in gold) ----------
say(-.35, 2.6, 'Why do people | WHISPER in | *NANDI\'s* ear?', { y: 545, size: 68, at: Array(7).fill(-.35) });
say(2.6, 5.0, 'It begins with a boy | who was told he\'d | die at *EIGHT.*', { y: 545 });
say(5.15, 8.0, 'Sage *SHILADA* begged | *Shiva* for a son | who would never die.', { y: 560 });
say(8.15, 10.4, 'One day, ploughing | the sacred field…', { y: 560 });
say(10.4, 13.0, '…he found a | GLOWING child | in the earth.', { y: 560, size: 60 });
say(13.15, 15.6, 'He named him *NANDI*: | "the one who | brings JOY."', { y: 600 });
say(15.75, 18.3, 'Then two sages | looked at the boy | and said:', { y: 600 });
say(18.45, 20.9, '"He will die | at *EIGHT.*"', { y: 640, size: 76 });
say(21.1, 23.6, 'Little *NANDI* | didn\'t cry.', { y: 760, size: 64 });
say(23.6, 26.1, 'He sat by the river | and prayed | to *SHIVA.*', { y: 760 });
say(26.4, 28.8, 'And *SHIVA* | came.', { y: 520, size: 72 });
say(28.8, 31.3, 'He made the boy | IMMORTAL…', { y: 520, size: 64 });
say(31.4, 34.0, '…his gatekeeper | and his vahana: | *NANDI*, the bull.', { y: 560 });
say(34.3, 36.8, '*Shiva* meditates | on *Kailash*…', { y: 480 });
say(36.8, 39.4, '…and *NANDI* | guards the door.', { y: 480, size: 64 });
say(39.6, 42.2, 'So devotees whisper | their wish | to *NANDI*…', { y: 545 });
say(42.2, 44.8, '…and *NANDI* | tells *SHIVA.*', { y: 545, size: 68 });
say(45.0, 47.6, 'That\'s why every | *NANDI* faces *SHIVA.*', { y: 600 });
say(47.6, 49.6, 'Waiting. | Always.', { y: 600, size: 68 });
say(49.8, 52.6, 'Yes, the *NANDI* | whose curse burned | *RAVANA\'s* Lanka.', { y: 560 });
say(52.8, 55.4, 'But at *THIRUPUNKUR*, | *NANDI* MOVED.', { y: 560 });
say(55.4, 58.4, '*Shiva* asked him | to step aside, so | *NANDANAR*, kept outside, | could see him.', { y: 560, size: 52 });
say(58.55, 61.75, 'Which temple\'s *NANDI* | have YOU | whispered to? | Comment your city!', { y: 570, size: 58 });
