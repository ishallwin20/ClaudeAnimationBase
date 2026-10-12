// ravana_kailash.js: ad 15, "RAVANA lifted Kailash with SHIVA on it. Shiva's answer? ONE TOE." The Uttara Kanda story
// in the Cinematic style (src/cine.js): the Pushpak stops over Kailash, Nandi blocks it and curses Ravana, Ravana lifts
// the mountain with twenty arms, Shiva presses it down with one toe, the scream that named him, the thousand years of
// song (the Shiv Tandav Stotram), Chandrahas, Hanuman burns Lanka, the name call-out, the Books 1–3 card.
// Times are in TL; tools/ravana_kailash_sfx.mjs uses the same ones.
const TL = { hook: 0, pushpak: 5.0, stop: 8.6, nandi: 9.8, laugh: 14.2, curse: 17.2, glare: 18.1, lift: 20.0, grip: 21.6, rise: 22.4,
  risen: 24.6, top: 25.0, toe: 29.4, press: 31.6, slam: 33.4, hit: 33.65, roar: 37.4, name: 40.3, song: 43.0, reveal: 45.9,
  dawn: 50.4, lanka: 54.2, ask: 57.6, card: 61.2, end: 65.4 };

// ---------- shared pieces ----------
const STORM = ['#12040A', '#3A0A12', '#8A1E16', '#D0461E'];
const stormSky = (c) => sky(c, [[0, STORM[0]], [600, STORM[1]], [1250, STORM[2]], [1700, STORM[3]]]);
const RV_STORM = (fl = 0) => ({ tint: ['#1A0608', .45], grade: [[900, 'rgba(0,0,0,0)'], [1900, 'rgba(10,2,4,.6)']], edge: { col: '#FF9A6A', w: 2.5, a: .8 }, rim: { col: '#FFC09A', dx: 0, dy: -6, a: .75 + fl, blur: 1 } });
const SHIVA_TOP = { tint: ['#0A0F1C', .86], edge: { col: '#9FC0FF', w: 2, a: .8 }, rim: { col: '#DCE8FF', dx: 0, dy: -3, a: .9 } };
const shake = (t, k) => ({ x: Math.sin(t * 53) * k, y: Math.cos(t * 41) * k });
// Ravana under Kailash, holding it up (shots 1, 6, 9), as the Ellora relief has it: the mountain over a cave and his
// twenty palms pressed round the cave's arch. Ravana stands at (540, 1860) × .9. o: reach (0..1), pose ('lift' |
// 'pinned'), expr, fl (lightning), hole (0..1 the glow where it was torn out), debris (start time), bolts, strain, drop
// the mountain's cave if it isn't where his hands are (shot 9, falling).
const RVX = 540, RVY = 1860, RVK = .9, FLOOR = 1480;
function archOf(o) { const A = ravanaArch(o); return { x: RVX, y: RVY + RVK * A.cy, rx: RVK * A.rx, ry: RVK * A.ry }; }
function liftSet(c, cam, t, o) {
  const fl = o.fl || 0, full = archOf({ pose: 'lift', reach: 1 }), a = o.arch || archOf(o), base = a.y + 30 + (full.ry - a.ry);
  plane(c, cam, 0, (c) => { stormSky(c); glow(c, 540, 1500, 900, '#FF5A1E', .4); });
  plane(c, cam, .1, (c) => { stars(c, 50, 4, t, .25); clouds(c, [[0, 300, 900, 41, 30], [600, 520, 760, 42, 45, true]], t, PALETTES.red, .85); });
  plane(c, cam, .15, (c) => { if (o.bolts) for (const [x0, y0, x1, y1, s] of o.bolts) bolt(c, x0, y0, x1, y1, s, fl, '#FFD0B0'); flash(c, fl * .22, '#FFB08A'); });
  plane(c, cam, .3, (c) => { ridge(c, FLOOR - 40, 140, 31, '#2A0A10', { freq: .004 }); haze(c, FLOOR - 40, 240, '#C8401E', .35); });
  plane(c, cam, 1, (c) => {
    // the mountain, 1.35× (so the cave fits inside it), its base on the floor or lifted; Shiva a speck of light on top
    const K = 1.35, top = base - 700 * K;
    figure(c, (f) => { f.save(); f.translate(540, base); f.scale(K, K); uprooted(f, 0, -700, 640, t, { rock: '#22101A', snow: '#9C7480', snowSh: '#4A2634', under: '#0E0508', depth: 40, light: 1 }); f.restore(); },
      { edge: { col: '#FF9A6A', w: 2.5, a: .55 }, rim: { col: '#FFD0B0', dx: 0, dy: -5, a: .6 + fl } });
    // the cave his hands hold up: dark inside, lit at its rim by the fire below
    c.save(); c.beginPath(); c.ellipse(a.x, base + 2, a.rx + 8, base + 2 - (a.y - a.ry - 8), 0, Math.PI, TAU); c.closePath();
    const g = c.createLinearGradient(0, a.y - a.ry, 0, base); g.addColorStop(0, '#080305'); g.addColorStop(1, '#2A0A0C'); c.fillStyle = g; c.fill();
    c.strokeStyle = rgba('#FF9A5A', .55); c.lineWidth = 4; c.stroke(); c.restore();
    glow(c, 540, top + 8, 120, '#7FA8FF', .7); glow(c, 540, top + 8, 40, '#E8F0FF', .8);
    figure(c, (f) => { f.translate(540, top + 30); f.scale(.12, .12); shivaSeated(f, { t }); }, SHIVA_TOP);
    // the floor, and the glowing scar it was torn from
    fillPath(c, `M -200 ${FLOOR} C 200 ${FLOOR - 14} 800 ${FLOOR - 14} 1280 ${FLOOR + 6} L 1280 2200 L -200 2200 Z`, '#14060A');
    if (o.hole) { glow(c, 540, FLOOR, 700 * o.hole, '#FF7A2A', .6 * o.hole); cracks(c, 540, FLOOR + 6, o.hole, t, 13); haze(c, FLOOR + 10, 50, '#FF8A3A', .5 * o.hole, 'lighter'); }
    if (o.debris != null) debris(c, [180, base, 900], t, o.debris, 18, 7);
    glow(c, 540, 1900, 600, '#FF6A2A', .3);
    figure(c, (f) => { f.translate(RVX, RVY); f.scale(RVK, RVK); ravana(f, { t, pose: o.pose || 'lift', reach: o.reach, expr: o.expr || 'grit', strain: o.strain ?? 1 }); }, RV_STORM(fl));
    embers(c, 540, 1900, t, 50, 8, 1100, 1300);
  });
}

// ---------- shot 1: the hook (Ravana holding Kailash over his heads) ----------
SHOTS.push({ a: TL.hook, b: TL.pushpak + .3, draw(c, u, t) {
  const fl = strikes(t, [1.15, 3.55]), sh = shake(t, 2.5);
  const cam = { z: lerp(1.0, 1.08, easeIO(u / 5.3)), fx: 540, fy: 900, ...sh };
  liftSet(c, cam, t, { reach: 1, fl, hole: 1, debris: -1.2, bolts: [[160, -40, 300, 640, 3], [960, -40, 820, 520, 9]], strain: 1 });
} });

// ---------- shot 2: the Pushpak at dusk, and it STOPS ----------
SHOTS.push({ a: TL.pushpak, b: TL.nandi + .4, xf: .3, draw(c, u, t) {
  const us = t - TL.stop, x = us < 0 ? lerp(-160, 560, (t - TL.pushpak) / (TL.stop - TL.pushpak)) : 560 + 30 * Math.exp(-us * 5) * Math.sin(us * 22);
  const rot = us < 0 ? -.02 : .14 * Math.exp(-us * 4) * Math.sin(us * 16), jolt = us > 0 ? Math.exp(-us * 7) : 0;
  const cam = { z: lerp(1.0, 1.1, easeIO(u / 5.2)), fx: 560, fy: 800, x: Math.sin(t * 53) * 6 * jolt, y: Math.cos(t * 41) * 6 * jolt };
  plane(c, cam, 0, (c) => sky(c, [[0, '#1E1230'], [500, '#5A2848'], [1000, '#C2583A'], [1450, '#FFB86A'], [1700, '#FFD9A0']]));
  plane(c, cam, .05, (c) => { glow(c, 380, 1420, 700, '#FFB45A', .5); ellipse(c, 380, 1420, 170, 170, '#FFE2A8'); rays(c, 380, 1420, { n: 14, dir: -Math.PI / 2, spread: 2.4, len: 1400, w: 220, col: '#FFD58A', a: .18, t, seed: 2 }); });
  plane(c, cam, .1, (c) => clouds(c, [[0, 360, 900, 51, 18], [600, 560, 700, 52, 26, true], [200, 1100, 800, 53, 14]], t, PALETTES.dawn, .9));
  plane(c, cam, .25, (c) => { kailash(c, 800, 980, 380, { rock: '#3A2036', snow: '#E8B0A0', snowSh: '#8E4E5E', light: -1 }); haze(c, 1500, 300, '#FFB070', .5); });
  plane(c, cam, .45, (c) => { ridge(c, 1400, 150, 51, '#2E1628', { freq: .005 }); haze(c, 1380, 120, '#FFA060', .25); ridge(c, 1560, 90, 52, '#1C0E18', { freq: .007 }); });
  plane(c, cam, 1, (c) => {
    c.save(); c.translate(x, 720 + Math.sin(t * 1.6) * 6); c.rotate(rot); c.scale(.82, .82);
    pushpak(c, { t, layer: 'back' });
    figure(c, (f) => { f.translate(40, 0); f.scale(.21, .21); ravana(f, { t, expr: us > 0 && us < 1.4 ? 'scream' : 'smirk', weapons: true }); }, { tint: ['#3A1020', .3], edge: { col: '#FFD9A0', w: 1.6, a: .7 }, rim: { col: '#FFF0C8', dx: -3, dy: -2, a: .8 } });
    pushpak(c, { t, layer: 'front' });
    c.restore();
    // the invisible wall it hit: a small ripple at the prow
    const ru = t - TL.stop; if (ru > 0 && ru < .9) { const r = 30 + 260 * easeOut(ru / .9); c.save(); c.globalCompositeOperation = 'lighter'; c.strokeStyle = rgba('#CFE0FF', .8 * (1 - ru / .9)); c.lineWidth = 5; c.beginPath(); c.ellipse(x + 300, 600, r * .45, r, 0, 0, TAU); c.stroke(); c.restore(); glow(c, x + 300, 600, 160 * (1 - ru / .9), '#CFE0FF', .5); }
  });
  plane(c, cam, 1.2, (c) => motes(c, { n: 40, seed: 21, box: [-100, 300, W + 100, 1900], r: 3, col: '#FFD9A0', a: .5, vx: -40, vy: -20, t }));
} });

// ---------- shots 3 and 5: Nandi blocks the way; then his eyes, the curse ----------
function nandiSet(c, cam, t, eyes, k = 1) {
  plane(c, cam, 0, (c) => sky(c, [[0, '#120C24'], [600, '#30184A'], [1100, '#7A3460'], [1500, '#C25A54']]));
  plane(c, cam, .05, (c) => { stars(c, 60, 8, t, .5); glow(c, 900, 1350, 600, '#FF8A5A', .3); });
  plane(c, cam, .15, (c) => {
    c.save(); c.translate(250, 430 + Math.sin(t * 1.4) * 5); c.scale(.36, .36); pushpak(c, { t, glow: .7 }); c.restore();
    clouds(c, [[0, 640, 800, 61, 10], [500, 900, 700, 62, 16, true]], t, PALETTES.dawn, .7);
  });
  plane(c, cam, .3, (c) => { kailash(c, 760, 760, 520, { rock: '#2A1834', snow: '#B88CA8', snowSh: '#5E3A60', light: -1 }); haze(c, 1440, 320, '#A05A78', .45); });
  plane(c, cam, .6, (c) => ridge(c, 1640, 100, 63, '#1E1024', { freq: .006 }));
  plane(c, cam, 1, (c) => {
    figure(c, (f) => fillPath(f, 'M 140 1760 C 300 1660 520 1630 760 1640 C 900 1648 1040 1680 1200 1720 L 1200 2200 L 140 2200 Z', '#160C1A'), { edge: { col: '#FFB0A0', w: 2.5, a: .55 } });
    figure(c, (f) => { f.translate(640, 1680); f.scale(1.2 * k, 1.2 * k); nandiStanding(f, { t, eyes }); },
      { tint: ['#2A1238', .2], grade: [[1300, 'rgba(0,0,0,0)'], [1800, 'rgba(20,6,24,.55)']], edge: { col: '#FFD0C0', w: 2.4, a: .6 }, rim: { col: '#FFE8D8', dx: -5, dy: -3, a: .9, blur: 1 } });
  });
  plane(c, cam, 1.2, (c) => motes(c, { n: 40, seed: 31, box: [-100, 300, W + 100, 1900], r: 3, col: '#FFD0E0', a: .4, vx: 20, vy: -15, t }));
}
SHOTS.push({ a: TL.nandi, b: TL.laugh + .4, xf: .4, draw(c, u, t) {
  nandiSet(c, { z: lerp(1.0, 1.12, easeIO(u / 4.8)), fx: 420, fy: 1300 }, t, 0);
} });
// the head is at about (640 - 310 × 1.2, 1680 - 350 × 1.2) = (268, 1260): push in on it
SHOTS.push({ a: TL.curse, b: TL.lift + .3, xf: .3, draw(c, u, t) {
  const eyes = easeOut(seg(t, TL.glare, TL.glare + .5)), sh = eyes > .5 && t < TL.glare + 1 ? shake(t, 5 * (1 - (t - TL.glare))) : { x: 0, y: 0 };
  nandiSet(c, { z: lerp(2.2, 2.5, easeIO(u / 3.2)), fx: 300, fy: 1200, ...sh }, t, eyes);
  flash(c, .25 * eyes * Math.exp(-Math.max(0, t - TL.glare - .2) * 3), '#FFC54A');
} });

// ---------- shot 4: Ravana laughs ----------
SHOTS.push({ a: TL.laugh, b: TL.curse + .3, xf: .3, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.07, easeIO(u / 3.4)), fx: 540, fy: 1000, y: Math.sin(t * 9) * 2 };
  plane(c, cam, 0, (c) => sky(c, [[0, '#1E1230'], [600, '#5A2848'], [1200, '#C2583A'], [1700, '#FFB86A']]));
  plane(c, cam, .1, (c) => { glow(c, 200, 1500, 800, '#FFB45A', .45); clouds(c, [[0, 500, 900, 71, 20], [600, 800, 760, 72, 30, true]], t, PALETTES.dawn, .8); });
  plane(c, cam, .4, (c) => { for (const x of [60, 1020]) { fillPath(c, `M ${x - 26} 1920 L ${x + 26} 1920 L ${x + 26} 300 L ${x - 26} 300 Z`, '#3A1A12'); fillPath(c, `M ${x - 10} 1920 L ${x + 26} 1920 L ${x + 26} 300 L ${x - 10} 300 Z`, '#7A5022'); } fillPath(c, 'M -100 240 C 300 160 780 160 1180 240 L 1180 330 C 780 250 300 250 -100 330 Z', '#7A2A22'); });
  plane(c, cam, 1, (c) => {
    figure(c, (f) => { f.translate(540, 2380); f.scale(1.5, 1.5); ravana(f, { t, expr: 'laugh', weapons: true, light: -1 }); },
      { tint: ['#2A0E18', .22], grade: [[1300, 'rgba(0,0,0,0)'], [1920, 'rgba(20,4,10,.6)']], edge: { col: '#FFD9A0', w: 2.4, a: .5 }, rim: { col: '#FFF0C8', dx: -7, dy: -3, a: .85, blur: 1 } });
    c.save(); c.translate(540, 1830); c.scale(1.9, 1.9); pushpak(c, { t, layer: 'front', glow: 0 }); c.restore();
  });
} });

// ---------- shot 6: he grips the mountain, and it rises ----------
SHOTS.push({ a: TL.lift, b: TL.top + .4, xf: .3, draw(c, u, t) {
  const reach = t < TL.rise ? lerp(0, .25, easeIO(seg(t, TL.lift + .3, TL.grip))) : lerp(.25, 1, easeIO(seg(t, TL.rise, TL.risen)));
  const rising = seg(t, TL.rise, TL.risen), fl = strikes(t, [21.1, 23.6]), sh = shake(t, 2 + 9 * rising * (t < TL.risen + .5 ? 1 : .3));
  const cam = { z: lerp(1.12, .98, easeIO(u / 5.2)), fx: 540, fy: 1000, ...sh };
  liftSet(c, cam, t, { reach, fl, hole: rising, debris: t > TL.rise ? TL.rise : null, bolts: [[180, -40, 320, 620, 5], [900, -40, 780, 560, 11]], strain: .4 + rising });
} });

// ---------- shot 7: the summit tilting; Parvati holds on, Shiva doesn't open his eyes ----------
SHOTS.push({ a: TL.top, b: TL.toe + .4, xf: .4, draw(c, u, t) {
  const fl = strikes(t, [26.3, 28.6]), tilt = Math.sin(t * 2.2) * .045 + Math.sin(t * 5.3) * .012;
  const cam = { z: lerp(1.0, 1.12, easeIO(u / 4.6)), fx: 540, fy: 1250, r: tilt, ...shake(t, 4) };
  plane(c, cam, 0, (c) => { stormSky(c); glow(c, 540, 1600, 1000, '#FF5A1E', .35); });
  plane(c, cam, .1, (c) => { clouds(c, [[0, 520, 900, 81, 60], [600, 760, 760, 82, 80, true], [300, 1000, 900, 83, 50]], t, PALETTES.red, .85); });
  plane(c, cam, .15, (c) => { bolt(c, 120, -40, 260, 900, 15, fl, '#FFD0B0'); bolt(c, 980, -40, 860, 800, 17, strikes(t, [28.6]), '#FFD0B0'); flash(c, fl * .25, '#FFB08A'); });
  plane(c, cam, 1, (c) => {
    figure(c, (f) => kailash(f, 540, 1400, 1100, { rock: '#24101A', snow: '#D6B0B8', snowSh: '#7A4458', light: 1 }), { edge: { col: '#FFB090', w: 2.5, a: .5 }, rim: { col: '#FFE0D0', dx: 0, dy: -5, a: .7 + fl } });
    motes(c, { n: 90, seed: 41, box: [-100, 1300, W + 100, 2000], r: 5, col: '#F2E8F0', a: .6, vx: 260 * Math.sign(tilt || 1), vy: 220, t });
    glow(c, 520, 1100, 420, '#6F98FF', .45); glow(c, 520, 1080, 160, '#DCE8FF', .35);
    figure(c, (f) => { f.translate(500, 1416); f.scale(.9, .9); shivaSeated(f, { t }); }, SHIVA_TOP);
    figure(c, (f) => { f.translate(760, 1416); f.scale(.82, .82); parvatiCling(f, { t, shake: 1, col: '#120810' }); }, { ...RV_STORM(fl), tint: ['#120810', .9] });
  });
} });

// ---------- shot 8: ONE TOE ----------
SHOTS.push({ a: TL.toe, b: TL.slam + .25, xf: .4, draw(c, u, t) {
  const press = easeIO(seg(t, TL.press - 1.0, TL.press)), boom = t > TL.press ? Math.exp(-(t - TL.press) * 3) : 0;
  const cam = { z: kf(t, [[TL.toe, 1.0], [TL.press, 1.18], [TL.press + .1, 1.24], [TL.slam + .3, 1.3]], easeIO), fx: 700, fy: 1380, ...shake(t, 10 * boom) };
  plane(c, cam, 0, (c) => sky(c, [[0, '#050812'], [800, '#0E1630'], [1500, '#1E2C52']]));
  plane(c, cam, .1, (c) => { stars(c, 90, 5, t, .7); glow(c, 820, 1400, 900, '#5A7CC8', .3 + .4 * boom); });
  plane(c, cam, .3, (c) => clouds(c, [[0, 900, 900, 91, 12], [500, 1150, 760, 92, 18, true]], t, PALETTES.nightFar, .8));
  plane(c, cam, 1, (c) => {
    fillPath(c, 'M -200 1380 C 200 1360 700 1366 1300 1390 L 1300 2200 L -200 2200 Z', '#1A2236');
    fillPath(c, 'M -200 1384 C 200 1356 700 1360 1300 1380 L 1300 1430 C 700 1410 200 1410 -200 1440 Z', '#C9D6EE');
    fillPath(c, 'M -200 1440 C 200 1410 700 1410 1300 1430 L 1300 1460 C 700 1446 200 1446 -200 1470 Z', '#7E8EB0');
    figure(c, (f) => { f.translate(110, 1392); f.scale(2.3, 2.3); shivaFoot(f, { t, press }); }, { tint: ['#16224A', .12], edge: { col: '#D4E0FA', w: 2.4, a: .6 }, rim: { col: '#EAF1FF', dx: 6, dy: -4, a: .85, blur: 1 } });
    shockRings(c, 760, 1398, t, [TL.press, TL.press + .35], '#CFE0FF');
    motes(c, { n: 50, seed: 43, box: [-100, 300, W + 100, 1900], r: 3.5, col: '#DCE6FF', a: .5, vx: 40, vy: 90, t });
  });
  flash(c, .55 * boom, '#DCE8FF');
} });

// ---------- shot 9: the slam; Ravana crushed ----------
SHOTS.push({ a: TL.slam, b: TL.roar + .3, xf: .15, draw(c, u, t) {
  const fall = easeIn(seg(t, TL.slam + .05, TL.hit)), down = t >= TL.hit, after = Math.max(0, t - TL.hit);
  const cam = { z: lerp(1.04, 1.12, easeIO(u / 4.2)), fx: 540, fy: 1000, ...shake(t, down ? 16 * Math.exp(-after * 1.6) + 1.5 : 3) };
  const A0 = archOf({ pose: 'lift', reach: 1 }), A1 = archOf({ pose: 'pinned' }), arch = { x: 540, y: lerp(A0.y, A1.y, fall), rx: lerp(A0.rx, A1.rx, fall), ry: lerp(A0.ry, A1.ry, fall) };
  liftSet(c, cam, t, { pose: down ? 'pinned' : 'lift', reach: 1, arch, fl: strikes(t, [35.2]), hole: down ? .3 : 1, expr: down ? 'scream' : 'grit', bolts: [[200, -40, 300, 600, 23]] });
  // the dust wall
  plane(c, cam, 1.1, (c) => { if (!down) return; const k = Math.exp(-after * .5); haze(c, 1150 - after * 60, 500 + after * 200, '#B07060', .6 * k); motes(c, { n: 120, seed: 51, box: [-100, 700, W + 100, 1700], r: 6, col: '#E0B0A0', a: .5 * k, vx: 160, vy: -60, t }); });
} });

// ---------- shot 10: the roar that named him ----------
SHOTS.push({ a: TL.roar, b: TL.song + .4, xf: .3, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.1, easeIO(u / 5.6)), fx: 540, fy: 960, ...shake(t, 5) };
  plane(c, cam, 0, (c) => { stormSky(c); stars(c, 80, 12, t, .4); });
  plane(c, cam, .1, (c) => { meteors(c, t, TL.roar, 12, 7); glow(c, 540, 1000, 900, '#FF6A2A', .3 + .1 * Math.sin(t * 20)); });
  plane(c, cam, .3, (c) => { shockRings(c, 540, 1020, t, [37.6, 38.3, 39.0, 39.7, 40.4, 41.1], '#FFD0A0'); });
  plane(c, cam, 1, (c) => {
    // the mountain's underside pressing down from above
    fillPath(c, 'M -200 -100 L 1280 -100 L 1280 470 C 1000 520 800 470 540 500 C 300 520 100 480 -200 520 Z', '#120610');
    cracks(c, 540, 440, 1, t, 21);
    figure(c, (f) => { f.translate(540, 1000); f.scale(1.32, 1.32); f.translate(0, 790); ravanaHeads(f, { t, expr: 'scream' }); },
      { tint: ['#2A0608', .3], grade: [[900, 'rgba(0,0,0,0)'], [1500, 'rgba(20,2,6,.6)']], edge: { col: '#FFB080', w: 2.4, a: .55 }, rim: { col: '#FFD8B0', dx: 0, dy: -6, a: .8, blur: 1 } });
    embers(c, 540, 1900, t, 60, 9, 1200, 1700);
  });
  flash(c, .2 * Math.exp(-Math.max(0, t - TL.name) * 3) * (t > TL.name ? 1 : 0), '#FFC870');
} });

// ---------- shot 11: a thousand years of song ----------
const STOTRAM = ['जटाटवीगलज्जलप्रवाहपावितस्थले', 'गलेऽवलम्ब्य लम्बितां भुजङ्गतुङ्गमालिकाम्', 'डमड्डमड्डमड्डमन्निनादवड्डमर्वयं', 'चकार चण्डताण्डवं तनोतु नः शिवः शिवम्'];
SHOTS.push({ a: TL.song, b: TL.dawn + .4, xf: .5, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.16, easeIO(u / 7.6)), fx: 540, fy: 1500 };
  const mu = u / 7.6, mx = lerp(-60, 1140, mu), my = 700 - Math.sin(mu * Math.PI) * 420;   // the moon crossing: ages pass
  plane(c, cam, 0, (c) => sky(c, [[0, '#060A18'], [700, '#141E3C'], [1300, '#2E2A58'], [1700, '#4A3A6A']]));
  plane(c, cam, .05, (c) => { stars(c, 140, 2, t, .8); glow(c, mx, my, 500, '#7F97CC', .35); ellipse(c, mx, my, 42, 42, '#E6ECF6'); });
  plane(c, cam, .1, (c) => clouds(c, [[0, 900, 900, 101, 60], [600, 1050, 760, 102, 80, true]], t, PALETTES.nightFar, .8));
  plane(c, cam, .6, (c) => { kailash(c, 540, 700, 760, { light: -1 }); glow(c, 540, 706, 90, '#9FC0FF', .5); haze(c, 1440, 260, '#6C7898', .4); });
  plane(c, cam, 1, (c) => {
    // the foot of Kailash pressing on his arms: a rock shelf with a cave cut where he kneels
    const A = ravanaArch({ pose: 'pinned' }), ax = 540, ay = 1830 + .52 * A.cy, rx = .52 * A.rx + 6, ry = .52 * A.ry + 6;
    figure(c, (f) => { const P = new Path2D(); P.moveTo(-200, ay + 30);
      for (let x = -200; x <= 1280; x += 20) { const d = (x - 540) / 760; P.lineTo(x, ay - ry - 30 - 110 * Math.max(0, 1 - d * d) + fbm(x * .02, 3) * 24); }
      P.lineTo(1280, ay + 30); P.closePath(); P.moveTo(ax - rx, ay + 30); P.ellipse(ax, ay + 30, rx, ry + 30, 0, Math.PI, TAU); P.closePath();
      f.fillStyle = '#121A2E'; f.fill(P, 'evenodd'); },
      { edge: { col: '#AFC3EE', w: 2.4, a: .55 }, rim: { col: '#E4EDFF', dx: 0, dy: -4, a: .7 } });
    fillPath(c, 'M -200 1800 C 200 1780 800 1780 1280 1800 L 1280 2200 L -200 2200 Z', '#0C1020');
    figure(c, (f) => { f.translate(540, 1830); f.scale(.52, .52); ravana(f, { t, pose: 'pinned', expr: 'sing' }); }, { ...LIGHTS.moon, tint: ['#16224A', .38] });
    glow(c, 540, 1420, 400, '#FFB050', .25 + .1 * Math.sin(t * 2));
    stotram(c, STOTRAM, 540, 1120, t, TL.song + .4, { size: 44, gap: 1.6, rise: 40, fade: 3.6, maxW: 880 });
  });
  plane(c, cam, 1.2, (c) => motes(c, { n: 60, seed: 61, box: [-100, 700, W + 100, 1800], r: 3, col: '#FFD9A0', a: .5, vx: 0, vy: -40, t }));
} });

// ---------- shot 12: dawn; forgiven, and the sword Chandrahas ----------
function chandrahas(c, x, y, ang, a = 1) {
  if (a <= 0) return;
  glow(c, x, y, 260, '#BFE0FF', .6 * a); glow(c, x, y, 90, '#FFFFFF', .7 * a);
  c.save(); c.translate(x, y); c.rotate(ang); c.globalAlpha *= a;
  fillPath(c, 'M -10 120 C -20 40 -24 -60 6 -230 C 30 -150 44 -40 14 120 Z', '#E8F0FF');   // the crescent blade
  fillPath(c, 'M -2 120 C -8 40 -6 -60 6 -230 C 14 -120 22 -30 14 120 Z', '#B8C8E0');
  fillPath(c, 'M -42 126 L 46 126 L 40 140 L -36 140 Z', '#D9A441'); fillPath(c, 'M -8 140 L 10 140 L 10 200 L -8 200 Z', '#5A3420'); ellipse(c, 1, 206, 12, 10, '#D9A441');
  c.restore();
}
SHOTS.push({ a: TL.dawn, b: TL.lanka + .4, xf: .5, draw(c, u, t) {
  const cam = { z: lerp(1.08, 1.0, easeOut(u / 4)), fx: 540, fy: 1300 };
  plane(c, cam, 0, (c) => sky(c, [[0, '#24183A'], [560, '#5E2E4E'], [1000, '#C9663D'], [1380, '#FFCF86'], [1600, '#FFE2A8']]));
  plane(c, cam, .05, (c) => { glow(c, 540, 1150, 900, '#FFB45A', .55); ellipse(c, 540, 1150, 220, 220, '#FFE9B8'); rays(c, 540, 1150, { n: 18, dir: -Math.PI / 2, spread: Math.PI * 1.5, len: 1500, w: 240, col: '#FFD58A', a: .22, t, seed: 4 }); });
  plane(c, cam, .2, (c) => { kailash(c, 540, 820, 560, { rock: '#3A2036', snow: '#E0A090', snowSh: '#8E4E5E', light: -1 }); haze(c, 1480, 300, '#FFC27A', .5); });
  plane(c, cam, 1, (c) => {
    figure(c, (f) => fillPath(f, 'M -200 1700 C 200 1680 800 1680 1280 1700 L 1280 2200 L -200 2200 Z', '#1C111B'), { edge: { col: '#FFC98A', w: 2.5, a: .6 } });
    figure(c, (f) => { f.translate(540, 1720); f.scale(.62, .62); ravana(f, { t, pose: 'bow', expr: 'calm' }); }, LIGHTS.dawnBack);
    const d = easeOut(seg(u, .3, 2.6)); chandrahas(c, 540, lerp(500, 1060, d), Math.sin(t * 1.4) * .08, d > 0 ? Math.min(1, u * 1.5) : 0);
  });
  plane(c, cam, 1.2, (c) => motes(c, { n: 70, seed: 17, box: [-100, 300, W + 100, 1900], r: 3, col: '#FFD9A0', a: .7, vx: 10, vy: -45, t }));
} });

// ---------- shot 13: Lanka burns ----------
SHOTS.push({ a: TL.lanka, b: TL.ask + .4, xf: .4, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.08, easeIO(u / 3.6)), fx: 540, fy: 1300 }, burn = easeOut(seg(u, .2, 2.6));
  const hx = lerp(-200, 1300, u / 3.4), hy = 1360 - Math.sin(u / 3.4 * Math.PI) * 200;
  plane(c, cam, 0, (c) => sky(c, [[0, '#0A0408'], [700, '#2A0A10'], [1300, '#7A2212'], [1750, '#D04A1A']]));
  plane(c, cam, .1, (c) => { stars(c, 60, 9, t, .3); for (let i = 0; i < 4; i++) soft(c, 4, (s) => { s.fillStyle = rgba('#1A0A0C', .5); s.beginPath(); s.ellipse(200 + i * 240 + Math.sin(t * .4 + i) * 40, 900 - i * 60 - u * 40, 260, 140, 0, 0, TAU); s.fill(); }, { blur: 6 }); });
  plane(c, cam, .5, (c) => lanka(c, 1640, t, burn * .6, 11));
  plane(c, cam, 1, (c) => {
    lanka(c, 1800, t, burn, 7);
    // Hanuman's leap, the burning tail streaming fire behind him
    for (let i = 1; i < 14; i++) { const v = u - i * .05; if (v < 0) break; const px = lerp(-200, 1300, v / 3.4) - 70 * .62, py = 1360 - Math.sin(v / 3.4 * Math.PI) * 200 - 230 * .62; glow(c, px, py, 60 - i * 3, '#FF8A2A', .5 - i * .03); }
    c.save(); c.translate(hx, hy); c.scale(.62, .62); c.rotate(-.1 + u * .05); const tip = hanumanLeap(c, { t, col: '#0C0406' });
    glow(c, tip[0], tip[1], 160, '#FF8A2A', .9); glow(c, tip[0], tip[1], 50, '#FFF0B0', .9); c.restore();
  });
} });

// ---------- shot 14: the name call-out ----------
SHOTS.push({ a: TL.ask, b: TL.card + .5, xf: .4, draw(c, u, t) {
  const cam = { z: lerp(1.1, 1.0, easeOut(u / 3.8)), fx: 540, fy: 1300 };
  plane(c, cam, 0, (c) => sky(c, [[0, '#0E0A1E'], [700, '#2A1838'], [1250, '#6A3048'], [1560, '#E08A5A']]));
  plane(c, cam, .05, (c) => { glow(c, 540, 1500, 900, '#FFB45A', .45); rays(c, 540, 1560, { n: 16, dir: -Math.PI / 2, spread: 2.6, len: 1600, w: 260, col: '#FFD58A', a: .2, t, seed: 6 }); });
  plane(c, cam, .3, (c) => { kailash(c, 540, 1480, 640, { rock: '#2A1830', snow: '#D89888', snowSh: '#7E4458', light: -1 }); });
  plane(c, cam, 1, (c) => {
    figure(c, (f) => { f.translate(540, 1496); f.scale(.34, .34); shivaSeated(f, { t }); f.translate(250, 0); }, { ...LIGHTS.dawnBack, tint: ['#1A0C14', .9] });
    glow(c, 540, 1400, 160, '#FFE0A0', .35);
  });
  plane(c, cam, 1.2, (c) => motes(c, { n: 50, seed: 71, box: [-100, 300, W + 100, 1900], r: 3, col: '#FFD9A0', a: .6, vx: 10, vy: -35, t }));
} });

// ---------- shot 15: the card ----------
SHOTS.push({ a: TL.card, b: TL.end + 1, xf: .6, draw(c, u, t) {
  rkCardCine(c, u, t, { title: 'HAR HAR MAHADEV', line: "Parvati's story begins in Book 1", price: 'Books 1–3 · set of 3 for ₹500' });
} });

// ---------- flashes ----------
const pulse = (t, t0, up, down) => t < t0 - up || t > t0 + 3 ? 0 : t < t0 ? ease(seg(t, t0 - up, t0)) : Math.exp(-(t - t0) * down);
POST.push((c, t) => {
  flash(c, .55 * pulse(t, TL.risen, .15, 3.5), '#FFE0B0', 'source-over');   // Kailash torn out
  flash(c, .9 * pulse(t, TL.hit, .08, 3), '#FFFFFF', 'source-over');      // the slam
  flash(c, .5 * pulse(t, TL.roar + .05, .05, 4), '#FFC890');                // the scream
});

// ---------- captions (2.2–3 s a line; names in gold) ----------
say(-.35, 2.55, '*RAVANA* lifted | *KAILASH* | with *SHIVA* on it.', { y: 1360, size: 66, at: Array(7).fill(-.35) });
say(2.55, 5.15, "Shiva's answer? | *ONE* *TOE.*", { y: 1390, size: 72 });
say(5.3, 7.85, '*Ravana* had stolen | a flying chariot: | the *Pushpak*.', { y: 1400 });
say(7.85, 10.05, 'Over *Kailash*, | it suddenly STOPPED.', { y: 1420 });
say(10.2, 12.4, '*Nandi* | blocked the way.', { y: 700, size: 60 });
say(12.4, 14.45, '"No one flies | over *Mahadev*."', { y: 700, size: 60 });
say(14.55, 17.35, '*Ravana* LAUGHED | at him.', { y: 1420, size: 64 });
say(17.5, 20.25, '*Nandi* cursed him: | "MONKEYS will | burn your Lanka."', { y: 600 });
say(20.4, 22.6, 'So *Ravana* decided | to LIFT the mountain.', { y: 1420, size: 54 });
say(22.6, 25.1, 'All TWENTY arms. | *Kailash* rose | into the sky.', { y: 1400 });
say(25.3, 27.45, "*Parvati* grabbed | *Shiva's* arm.", { y: 560 });
say(27.45, 29.6, "*Shiva* didn't even | open his eyes.", { y: 560 });
say(29.75, 33.35, 'He pressed down | with *ONE* *TOE.*', { y: 820, size: 72 });
say(34.1, 37.3, 'Twenty arms, | crushed under | the mountain.', { y: 1400 });
say(37.65, 40.3, 'His SCREAM shook | the three worlds.', { y: 1430 });
say(40.3, 43.05, 'That scream became | his name: *RAVANA*, | "the one who roars."', { y: 1400 });
say(43.3, 45.9, 'Trapped, he sang | to *Shiva* for a | THOUSAND years.', { y: 560 });
say(45.9, 48.5, 'That song is the | *SHIV* *TANDAV* | *STOTRAM.*', { y: 560, size: 64 });
say(48.5, 50.5, 'Yes. *Ravana* | wrote it.', { y: 560, size: 64 });
say(50.7, 54.2, '*Shiva* forgave him | and gave him the | sword *Chandrahas.*', { y: 600 });
say(54.45, 57.65, "And *Nandi's* curse? | *Hanuman* set | Lanka on fire.", { y: 580 });
say(57.85, 61.25, 'Is your name *SHIVA*, | *SHANKAR*, *MAHESH* | or *RUDRA*? | Comment it!', { y: 900, size: 60 });
