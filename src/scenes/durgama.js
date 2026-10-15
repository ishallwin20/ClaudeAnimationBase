// durgama.js: ad 19, "Maa DURGA's name came from a DEMON." The Devi Bhagavata Purana's Durgama story (7.28) in the
// Cinematic style (src/cine.js): Durgama takes the Vedas by Brahma's boon, the yagnas stop and a hundred years of drought
// follow; the rishis pray in the Himalayas and the Devi comes with countless eyes (Shatakshi), weeps for nine nights
// (the tears become rivers) and feeds the world from her hands (Shakambhari); Durgama attacks with a thousand armies, she
// shields the gods and rishis in a ring of light and stands outside alone, goddesses burst from her body, ten days of
// war, fifteen arrows on the eleventh, the Vedas given back, "My name is Durga". The name call-out, the Books 1–3 card.
// Times are in TL; tools/durgama_sfx.mjs uses the same ones. The score (Lyria take 1) hushes at 52–54 and hits at 56.0.
const TL = { hook: 0, boon: 4.6, wish: 7.1, vedas: 9.4, forgot: 11.7, drought: 13.8, years: 16.2, pray: 18.6, came: 21.2,
  eyes: 22.6, name1: 25.0, tears: 26.8, nine: 29.2, rivers: 31.4, feed: 33.8, attack: 36.2, ring: 39.2, alone: 41.6,
  shaktis: 43.2, burst: 43.6, names: 45.4, war: 47.6, arrows: 50.2, count: 51.0, release: 54.0, heart: 56.0, fall: 57.0,
  name: 58.0, said: 61.6, durga: 63.4, ask: 65.0, card: 68.2, end: 73.2 };
// the fifteen arrows appear on the string one by one, then fly; where the first ten strike (the five in the heart at TL.heart)
const ARROW_T = (i) => TL.count + i * .2;
const HITS = { flag: 54.4, eyes: 54.7, arms: 55.0 };

// ---------- shared pieces ----------
const shake = (t, k) => ({ x: Math.sin(t * 53) * k, y: Math.cos(t * 41) * k });
const STORM = (c) => sky(c, [[0, '#12040A'], [600, '#3A0A12'], [1250, '#8A1E16'], [1750, '#D0461E']]);
const LIT_RED = (fl = 0) => ({ tint: ['#2A0A10', .14], edge: { col: '#FFD9A0', w: 2.4, a: .7 }, rim: { col: '#FFE6B0', dx: 6, dy: -3, a: .8 + fl, blur: 1 } });
const DEMON_RED = (fl = 0) => ({ tint: ['#2A0A10', .2], grade: [[1100, 'rgba(0,0,0,0)'], [1950, 'rgba(14,2,4,.6)']], edge: { col: '#FF9A6A', w: 2.4, a: .7 }, rim: { col: '#FFB08A', dx: 0, dy: -6, a: .8 + fl, blur: 1 } });
const SIL = (col, rim) => ({ tint: [col, .9], edge: { col: rim, w: 2, a: .85 }, rim: { col: rim, dx: 0, dy: -3, a: .9 } });
// Durga, eight-armed, at (x, y) (her feet), scale k
const durgaFig = (c, x, y, k, t, o = {}, light = LIT_RED()) => figure(c, (f) => { f.translate(x, y); f.scale(k, k); devi(f, { t, durga: true, upper: 'open', wind: .6, ...o }); }, light);
// Durgama standing, at (x, y), scale k
const durgamaFig = (c, x, y, k, t, o = {}, light = DEMON_RED()) => figure(c, (f) => { f.translate(x, y); f.scale(k, k); if (o.rot) f.rotate(o.rot); arunasura(f, { t, pose: 'stand', arms: 'roar', expr: 'scream', pal: DURGAMA_PAL, ...o }); }, light);
// the parched land of the drought (shots 4 and 8): wet 0..1 darkens it and lays a sheen on it
function land(c, t, wet = 0, water = 0) {
  fillPath(c, 'M -200 1060 C 200 1040 700 1050 1300 1070 L 1300 2200 L -200 2200 Z', mixCol('#8A5E34', '#2A3424', wet));
  const g = c.createLinearGradient(0, 1060, 0, 1920); g.addColorStop(0, rgba(wet ? '#5A6A70' : '#F2C88A', .5)); g.addColorStop(.3, rgba('#000000', 0)); g.addColorStop(1, rgba('#0A0604', .55)); c.fillStyle = g; c.fillRect(-200, 1060, 1500, 1000);
  dryCracks(c, 1070, 1 - wet * .75, 4);
  riverbed(c, water, t);
}

// ---------- shot 1: the hook (Durga in the storm, eyes burning) ----------
SHOTS.push({ a: TL.hook, b: TL.boon + .3, draw(c, u, t) {
  const fl = strikes(t, [1.2, 3.6]), cam = { z: lerp(1.0, 1.07, easeIO(u / 4.9)), fx: 540, fy: 900, ...shake(t, .8) };
  plane(c, cam, 0, (c) => { STORM(c); glow(c, 540, 1500, 1000, '#FF5A1E', .45); });
  plane(c, cam, .1, (c) => clouds(c, [[0, 300, 900, 11, 30], [600, 560, 760, 12, 45, true], [200, 860, 800, 13, 22]], t, PALETTES.red, .85));
  plane(c, cam, .15, (c) => { bolt(c, 120, -40, 260, 700, 3, strikes(t, [1.2]), '#FFD0B0'); bolt(c, 980, -40, 840, 620, 9, strikes(t, [3.6]), '#FFD0B0'); flash(c, fl * .22, '#FFB08A'); });
  plane(c, cam, .4, (c) => { ridge(c, 1640, 120, 21, '#1A060A', { freq: .004 }); haze(c, 1620, 200, '#D0461E', .4); });
  plane(c, cam, 1, (c) => { glow(c, 540, 1050, 620, '#FFC860', .22); durgaFig(c, 540, 1830, 1.25, t, { fire: .85 }, LIT_RED(fl)); embers(c, 540, 1950, t, 60, 4, 1200, 1500); });
} });

// ---------- shot 2: Durgama's tapas, Brahma's lotus, the Vedas flying into him ----------
SHOTS.push({ a: TL.boon, b: TL.vedas + .3, xf: .4, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.12, easeIO(u / 5.2)), fx: 540, fy: 1250 }, take = seg(t, TL.wish, TL.vedas);
  plane(c, cam, 0, (c) => { sky(c, [[0, '#07040F'], [800, '#1C0E2C'], [1500, '#3A1840'], [1900, '#1A0A18']]); stars(c, 80, 6, t, .6); });
  plane(c, cam, .2, (c) => { ridge(c, 1520, 220, 41, '#140A1A', { freq: .003 }); haze(c, 1500, 260, '#6A3A6A', .35); });
  plane(c, cam, .5, (c) => lotusLight(c, 540, 860, 100, t, easeOut(seg(t, TL.boon, TL.boon + 1.6))));
  plane(c, cam, 1, (c) => {
    fillPath(c, 'M 140 1810 C 300 1760 780 1760 940 1810 L 1000 2000 L 80 2000 Z', '#0E0810');
    glow(c, 540, 1380, 300 + 200 * take, '#FFB050', .25 + .35 * take);
    figure(c, (f) => { f.translate(540, 1800); f.scale(1.0, 1.0); arunasura(f, { t, pose: 'tapas', arms: 'knees', expr: take > .2 ? 'smirk' : 'chant', eyes: .3 + .7 * take, pal: DURGAMA_PAL }); },
      { tint: ['#1A0A28', .2], edge: { col: '#FFD9A0', w: 2.2, a: .6 }, rim: { col: '#FFE2A0', dx: 0, dy: -6, a: .8, blur: 1 } });
    mantraFlow(c, t, { from: [[-80, 400], [1160, 500], [-80, 1100], [1160, 1200], [300, -60], [800, -60]], to: [540, 1390], n: 70, t0: TL.wish + .1, dur: 2.1, fly: 1.3, size: 46, arc: 420, seed: 5 });
  });
  plane(c, cam, 1.2, (c) => motes(c, { n: 40, seed: 12, box: [-100, 300, W + 100, 1900], r: 3, col: '#FFD890', a: .4, vx: 10, vy: -30, t }));
} });

// ---------- shot 3: the rishis at the yagna; the mantras leave them and the fire dies ----------
SHOTS.push({ a: TL.vedas, b: TL.drought + .3, xf: .4, draw(c, u, t) {
  const cam = { z: lerp(1.04, 1.12, easeIO(u / 4.6)), fx: 540, fy: 1400 }, die = easeIO(seg(t, TL.forgot - .2, TL.drought - .3)), k = lerp(1, .06, die);
  plane(c, cam, 0, (c) => sky(c, [[0, '#0A0506'], [900, mixCol('#2A120C', '#141820', die)], [1500, mixCol('#4A2012', '#1E2228', die)], [1920, '#0A0806']]));
  plane(c, cam, .3, (c) => { ridge(c, 1420, 160, 51, '#120A08', { freq: .004 }); });
  plane(c, cam, 1, (c) => {
    fillPath(c, 'M -200 1560 C 300 1540 800 1540 1300 1560 L 1300 2200 L -200 2200 Z', '#120A08');
    yagna(c, 540, 1600, 300, t, k);
    if (die > .2) motes(c, { n: 40, seed: 31, box: [430, 900, 650, 1560], r: 9, col: '#5A5450', a: .25 * die, vx: 10, vy: -60, t });   // smoke
    const light = { tint: ['#1A0806', .55 + .3 * die], edge: { col: mixCol('#FFB070', '#8A96A8', die), w: 2.2, a: .7 }, rim: { col: mixCol('#FFD08A', '#A8B4C8', die), dx: 0, dy: -3, a: .8 * (1 - die * .6) } };
    figure(c, (f) => {
      for (const [x, s, sc] of [[110, -1, .95], [300, -1, 1.05], [780, 1, 1.05], [970, 1, .95]]) { f.save(); f.translate(x, 1720); f.scale(s * sc, sc); rishi(f, { t, pose: 'sit' }); f.restore(); }
    }, light);
    mantraFlow(c, t, { from: [[110, 1300], [300, 1270], [540, 1440], [780, 1270], [970, 1300]], to: [1160, 120], n: 60, t0: TL.vedas + .1, dur: 2.6, fly: 1.6, size: 42, arc: 260, seed: 9 });
  });
  plane(c, cam, 1.2, (c) => embers(c, 540, 1560, t, Math.round(40 * k), 9, 300, 900));
} });

// ---------- shot 4: the drought, and a hundred years of it ----------
SHOTS.push({ a: TL.drought, b: TL.pray + .3, xf: .4, draw(c, u, t) {
  const yr = seg(t, TL.years, TL.pray + .3), cyc = yr > 0 ? frac((t - TL.years) * 1.3 + .5) : .5, day = Math.sin(Math.PI * cyc);
  const cam = { z: lerp(1.0, 1.1, easeIO(u / 5)), fx: 540, fy: 1200, x: Math.sin(t * 1.1) * 4 };
  const sx = yr > 0 ? lerp(-120, 1200, cyc) : 760, sy = yr > 0 ? 1000 - day * 640 : 520, dim = yr > 0 ? 1 - day : 0;
  plane(c, cam, 0, (c) => { sky(c, [[0, mixCol('#3A2410', '#05060C', dim)], [700, mixCol('#A8682E', '#0E1220', dim)], [1100, mixCol('#E8B070', '#2A2430', dim)]]); sunDisc(c, sx, sy, 110, t, { life: 1 }); });
  plane(c, cam, .1, (c) => haze(c, 900, 500, '#FFD8A0', .25 * (1 - dim)));
  plane(c, cam, 1, (c) => {
    land(c, t, 0);
    deadTree(c, 230, 1420, 1.15, '#140A06'); deadTree(c, 930, 1180, .55, '#24140A');
    flash(c, dim * .45, '#03040A', 'multiply');
  });
  plane(c, cam, 1.2, (c) => motes(c, { n: 70, seed: 41, box: [-100, 900, W + 100, 1950], r: 4, col: '#E8B880', a: .35, vx: 160, vy: -12, t }));
} });

// ---------- shot 5: the rishis pray in the Himalayas; a light comes ----------
SHOTS.push({ a: TL.pray, b: TL.eyes + .4, xf: .4, draw(c, u, t) {
  const come = easeOut(seg(t, TL.came - .2, TL.eyes + .2)), cam = { z: lerp(1.0, 1.1, easeIO(u / 4.6)), fx: 420, fy: 900 };
  plane(c, cam, 0, (c) => { sky(c, [[0, '#04060E'], [800, '#0E1630'], [1400, '#1E2C4E'], [1900, '#2A3858']]); stars(c, 110, 3, t, .8); });
  plane(c, cam, .1, (c) => { glow(c, 300, 620, 900 * come, '#FFE2A8', .7 * come); glow(c, 300, 620, 160 * come + 10, '#FFFFFF', .9 * come); if (come > 0) rays(c, 300, 620, { n: 20, dir: Math.PI / 2, spread: TAU, len: 1500 * come, w: 220, col: '#FFE2A8', a: .3 * come, t, seed: 4 }); });
  plane(c, cam, .25, (c) => { kailash(c, 760, 760, 560, { rock: '#1E2840', snow: '#B8C8E4', snowSh: '#5A6A8C', light: -1 }); kailash(c, 170, 980, 420, { rock: '#18203A', snow: '#9AAACA', snowSh: '#4A5A7A', light: -1 }); haze(c, 1300, 360, '#5A6A9A', .45); });
  plane(c, cam, .5, (c) => clouds(c, [[0, 1250, 900, 61, 12], [600, 1400, 760, 62, 18, true]], t, PALETTES.nightFar, .8));
  plane(c, cam, 1, (c) => {
    figure(c, (f) => { fillPath(f, 'M 380 1920 L 420 1660 C 560 1630 860 1620 1200 1640 L 1200 1920 Z', '#0A0E1A');
      for (const [x, sc] of [[600, .62], [770, .66], [940, .62]]) { f.save(); f.translate(x, 1660); f.scale(sc, sc); rishi(f, { t, pose: 'sit' }); f.restore(); } },
      { tint: ['#0A0F1C', .84], edge: { col: '#C9D7F5', w: 1.8, a: .55 }, rim: { col: '#FFF0C8', dx: -4, dy: -3, a: .3 + .7 * come } });
  });
  plane(c, cam, 1.2, (c) => motes(c, { n: 60, seed: 51, box: [-100, 0, W + 100, 1950], r: 3.5, col: '#DCE6FF', a: .5, vx: 60, vy: 120, t }));
} });

// ---------- shot 6: Shatakshi: the Devi in her aura of countless eyes ----------
SHOTS.push({ a: TL.eyes, b: TL.tears + .4, xf: .3, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.1, easeIO(u / 4.4)), fx: 540, fy: 900 };
  plane(c, cam, 0, (c) => { sky(c, [[0, '#0A0614'], [900, '#24123A'], [1900, '#120A1E']]); glow(c, 540, 900, 900, '#8A5AC8', .35); });
  plane(c, cam, .6, (c) => { glow(c, 540, 880, 520, '#FFD890', .3); eyeAura(c, 540, 880, 480, t, { t0: TL.eyes + .3, dur: 2.2, k: 1.05 }); });
  plane(c, cam, 1, (c) => figure(c, (f) => { f.translate(540, 1760); f.scale(1.05, 1.05); devi(f, { t, upper: 'open', wind: .4, eyes: 1 }); },
    { tint: ['#1A0A28', .14], edge: { col: '#FFE2B0', w: 2.4, a: .75 }, rim: { col: '#FFF0C8', dx: 6, dy: -3, a: .85, blur: 1 } }));
  plane(c, cam, 1.2, (c) => motes(c, { n: 50, seed: 61, box: [-100, 200, W + 100, 1900], r: 3, col: '#FFE2A8', a: .5, vx: 0, vy: -40, t }));
} });

// ---------- shot 7: her face; every eye weeping; nine nights ----------
SHOTS.push({ a: TL.tears, b: TL.rivers + .4, xf: .5, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.07, easeIO(u / 4.8)), fx: 540, fy: 820 }, tr = easeOut(seg(t, TL.tears + .2, TL.tears + 1.4)), nights = seg(t, TL.nine, TL.rivers + .4);
  plane(c, cam, 0, (c) => { sky(c, [[0, '#04060E'], [1000, '#101A34'], [1920, '#1A2440']]); if (nights > 0) { const m = frac((t - TL.nine) * .9), mx = lerp(-80, 1160, m), my = 520 - Math.sin(Math.PI * m) * 300; glow(c, mx, my, 220, '#9FB6F0', .4); ellipse(c, mx, my, 34, 34, '#E6ECF6'); } });
  plane(c, cam, .4, (c) => soft(c, 3, (s) => eyeAura(s, 540, 820, 760, t, { open: () => 1, tears: tr, k: 1.6, gold: '#A8C8FF', rings: 3 }), { alpha: .55 }));
  plane(c, cam, 1, (c) => figure(c, (f) => { f.translate(540, 840); f.scale(6.2, 6.2); f.translate(0, 815); deviHead(f, { t, eyes: .72, tears: tr, look: [0, .7] }); },
    { tint: ['#0E1A3A', .2], edge: { col: '#CFE0FF', w: 3, a: .3 }, rim: { col: '#E4EEFF', dx: 9, dy: -4, a: .7, blur: 1.5 } }));
  plane(c, cam, 1.2, (c) => rain(c, t, { n: Math.round(160 * nights), a: .35, len: 70, vx: -120, vy: 1600, seed: 2 }));
} });

// ---------- shot 8: the tears become rivers; the land turns green ----------
SHOTS.push({ a: TL.rivers, b: TL.feed + .4, xf: .4, draw(c, u, t) {
  const cam = { z: lerp(1.06, 1.0, easeIO(u / 2.8)), fx: 540, fy: 1200 }, flow = easeIO(seg(t, TL.rivers + .2, TL.feed)), wet = easeOut(seg(t, TL.rivers, TL.rivers + 1.2));
  plane(c, cam, 0, (c) => { sky(c, [[0, '#0A0E18'], [700, '#2A3448'], [1100, '#5A6A80']]); clouds(c, [[0, 300, 900, 71, 30], [600, 520, 800, 72, 40, true], [200, 760, 900, 73, 24]], t, PALETTES.night, .95); });
  plane(c, cam, 1, (c) => {
    land(c, t, wet, flow);
    glow(c, 500, 1500, 500 * flow, '#9FC8F0', .2);
    sprouts(c, -40, 1120, 1240, 1.2, seg(t, TL.rivers + 1, TL.feed + .4), t, 3); sprouts(c, -40, 1120, 1600, 1.8, seg(t, TL.rivers + 1.3, TL.feed + .4), t, 7);
    deadTree(c, 230, 1420, 1.15, '#101208');
  });
  plane(c, cam, 1.2, (c) => rain(c, t, { n: 320, a: .45, len: 110, vx: -200, vy: 2200, seed: 5 }));
} });

// ---------- shot 9: Shakambhari: grain, fruit and greens in her hands ----------
SHOTS.push({ a: TL.feed, b: TL.attack + .4, xf: .4, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.08, easeIO(u / 2.8)), fx: 540, fy: 900 };
  plane(c, cam, 0, (c) => { sky(c, [[0, '#1A2410'], [700, '#5A6A2A'], [1200, '#E8C070'], [1600, '#FFE2A8']]); glow(c, 540, 1200, 900, '#FFD890', .45); rays(c, 540, 1300, { n: 16, dir: -Math.PI / 2, spread: 2.6, len: 1500, w: 220, col: '#FFE6A8', a: .2, t, seed: 6 }); });
  plane(c, cam, .4, (c) => { ridge(c, 1560, 120, 81, '#3A5A22', { freq: .004 }); haze(c, 1540, 160, '#C8E090', .3); });
  plane(c, cam, 1, (c) => {
    figure(c, (f) => { f.translate(540, 1820); f.scale(1.1, 1.1); devi(f, { t, upper: 'open', wind: .3, eyes: 1, look: [0, .3] }); for (const s of [-1, 1]) produce(f, s * 252, -905, 1.0, t); },
      { tint: ['#2A1A08', .1], edge: { col: '#FFF0C8', w: 2.4, a: .75 }, rim: { col: '#FFF6D8', dx: 0, dy: -4, a: .85, blur: 1 } });
    sprouts(c, -40, 1120, 1830, 2.2, 1, t, 9);
    for (const s of [-1, 1]) motes(c, { n: 24, seed: 70 + s, box: [540 + s * 277 - 60, 840, 540 + s * 277 + 60, 1800], r: 4, col: '#F2D27A', a: .7, vx: 0, vy: 220, t });   // grain falling from her hands
  });
} });

// ---------- shot 10: Durgama comes with a thousand armies ----------
SHOTS.push({ a: TL.attack, b: TL.ring + .4, xf: .3, draw(c, u, t) {
  const fl = strikes(t, [36.9, 38.5]), cam = { z: lerp(1.0, 1.12, easeIO(u / 3.2)), fx: 540, fy: 1000, ...shake(t, 2) };
  plane(c, cam, 0, (c) => { STORM(c); glow(c, 540, 1300, 900, '#FF5A1E', .4); });
  plane(c, cam, .1, (c) => { clouds(c, [[0, 280, 900, 81, 50], [600, 500, 760, 82, 70, true]], t, PALETTES.red, .85); bolt(c, 160, -40, 300, 640, 15, fl, '#FFD0B0'); flash(c, fl * .2, '#FFB08A'); });
  plane(c, cam, .3, (c) => { ridge(c, 1280, 120, 83, '#24080C', { freq: .004 }); army(c, 1250, -60, 1140, .4, t, 3, '#1E0608'); haze(c, 1280, 160, '#D0461E', .35); });
  plane(c, cam, .55, (c) => { ridge(c, 1440, 90, 84, '#16050A', { freq: .006 }); army(c, 1420, -80, 1160, .62, t, 5, '#14040A'); });
  plane(c, cam, 1, (c) => { banner(c, 900, 1960, 1.2, t); durgamaFig(c, 520, 1960, 1.15, t, { expr: 'scream' }, DEMON_RED(fl)); embers(c, 540, 1960, t, 50, 8, 1200, 1400); });
} });

// ---------- shot 11: the ring of light; she stands outside, alone ----------
SHOTS.push({ a: TL.ring, b: TL.shaktis + .4, xf: .4, draw(c, u, t) {
  const alone = easeIO(seg(t, TL.alone - .2, TL.shaktis + .4)), ringA = easeOut(seg(t, TL.ring + .1, TL.ring + 1));
  const cam = { z: lerp(1.0, 1.55, alone), fx: lerp(540, 700, alone), fy: lerp(1300, 1360, alone) };
  plane(c, cam, 0, (c) => { sky(c, [[0, '#0E040A'], [700, '#3A0E16'], [1200, '#9A2E1E'], [1500, '#E06A2A']]); glow(c, 900, 1420, 700, '#FF7A2A', .5); });
  plane(c, cam, .2, (c) => clouds(c, [[0, 400, 900, 91, 20], [600, 700, 760, 92, 30, true]], t, PALETTES.red, .8));
  plane(c, cam, .5, (c) => { ridge(c, 1400, 70, 93, '#200608', { freq: .005 }); figure(c, (f) => army(f, 1392, 760 + 200 * (1 - u / 4.2), 1300, .32, t, 7, '#160406'), { edge: { col: '#FF8A5A', w: 1.6, a: .8 } }); });
  plane(c, cam, 1, (c) => {
    fillPath(c, 'M -200 1500 C 300 1480 800 1484 1300 1500 L 1300 2200 L -200 2200 Z', '#100406');
    figure(c, (f) => army(f, 1500, 860 + 120 * (1 - u / 4.2), 1300, .55, t, 9, '#0C0204'), { edge: { col: '#FF9A6A', w: 2, a: .85 } });
    figure(c, (f) => { for (const [x, sc, p] of [[230, .2, 'sit'], [300, .24, 'stand'], [370, .2, 'sit'], [430, .22, 'stand']]) { f.save(); f.translate(x, 1500); f.scale(-sc, sc); rishi(f, { t, pose: p }); f.restore(); } },
      { tint: ['#1A0806', .7], edge: { col: '#FFE2A0', w: 1.5, a: .7 } });
    ringOfLight(c, 330, 1500, 230, t, ringA);
    durgaFig(c, 700, 1500, .42, t, { fire: .5 }, { tint: ['#2A1018', .78], edge: { col: '#FFD9A0', w: 2, a: .85 }, rim: { col: '#FFF0C8', dx: 3, dy: -2, a: .9 } });
  });
  plane(c, cam, 1.2, (c) => embers(c, 900, 1700, t, 40, 11, 900, 1200));
} });

// ---------- shot 12: goddesses burst out of her body ----------
// The goddesses are her own shape filled with light, in five lights: Kalika's blue-black, Tarini's blue, Bhairavi's red,
// Bagala's yellow, Chhinnamasta's red-orange.
const SHAKTI_LIGHT = [['#16204A', '#9FB8FF'], ['#1E5A8A', '#BFE8FF'], ['#8A1A16', '#FFB08A'], ['#B08A16', '#FFF0A0'], ['#A8381E', '#FFC8A0']];
function goddess(c, x, y, k, t, i, flip = 1) {
  const [fill, edge] = SHAKTI_LIGHT[i % 5];
  glow(c, x, y - 560 * k, 700 * k, edge, .3);
  figure(c, (f) => { f.translate(x, y); f.scale(k * flip, k); devi(f, { t: t + i, durga: true, upper: 'open', wind: .9, fire: 1 }); },
    { tint: [fill, .86], edge: { col: edge, w: 2.2, a: .9 }, rim: { col: '#FFFFFF', dx: 0, dy: -3, a: .7 } });
}
SHOTS.push({ a: TL.shaktis, b: TL.war + .3, xf: .3, draw(c, u, t) {
  const b = t - TL.burst, cam = { z: lerp(1.0, 1.1, easeIO(u / 4.6)), fx: 540, fy: 1000, ...shake(t, b > 0 ? 9 * Math.exp(-b * 2.5) : 0) };
  plane(c, cam, 0, (c) => { sky(c, [[0, '#0E0410'], [800, '#3A0E2A'], [1500, '#8A2A2A'], [1920, '#2A0A0E']]); glow(c, 540, 1050, 900, '#FFB860', .35 + .4 * Math.exp(-Math.max(0, b) * 1.5)); });
  plane(c, cam, .2, (c) => { if (b > 0) rays(c, 540, 1050, { n: 24, dir: 0, spread: TAU, len: 1600, w: 200, col: '#FFE2A8', a: .35 * Math.exp(-b * .8), t, seed: 9 }); });
  // each leaves her body at its own time and flies out toward the camera, growing, till it leaves the frame
  const fly = (c, front) => { for (let i = 0; i < 40; i++) {
    const t0 = TL.burst + i * .1, v = t - t0; if (v < 0 || v > 1.7) continue;
    const ang = i * 2.39996 + .4, e = v / 1.7, sc = .08 + .52 * Math.pow(e, 1.5), d = 60 + 1000 * Math.pow(e, 1.3);
    if ((sc > .3) !== front) continue;
    const x = 540 + Math.cos(ang) * d, y = 1150 + Math.sin(ang) * d * .9 + 560 * sc;
    goddess(c, x, y, sc, t, i, Math.cos(ang) < 0 ? -1 : 1);
  } };
  plane(c, cam, 1, (c) => durgaFig(c, 540, 1820, 1.15, t, { fire: b > 0 ? 1 : .6, wind: .9 }, LIT_RED(b > 0 ? Math.exp(-b * 2) : 0)));
  plane(c, cam, 1.05, (c) => fly(c, false));
  plane(c, cam, 1.1, (c) => fly(c, true));
  plane(c, cam, 1.2, (c) => motes(c, { n: 60, seed: 81, box: [-100, 200, W + 100, 1950], r: 4, col: '#FFD890', a: .5, vx: 0, vy: -80, t }));
} });

// ---------- shot 13: ten days of war ----------
SHOTS.push({ a: TL.war, b: TL.arrows + .4, xf: .3, draw(c, u, t) {
  const day = .5 + .5 * Math.sin((t - TL.war) * 7), hits = [48.1, 48.8, 49.5], fl = strikes(t, hits), gone = seg(t, TL.war, TL.arrows + .2);
  const cam = { z: lerp(1.0, 1.08, easeIO(u / 2.8)), fx: 540, fy: 1300, ...shake(t, 2 + fl * 8) };
  plane(c, cam, 0, (c) => sky(c, [[0, mixCol('#06030A', '#3A0A12', day)], [900, mixCol('#14060E', '#8A1E16', day)], [1400, mixCol('#2A0A10', '#E0562A', day)]]));
  plane(c, cam, .2, (c) => { clouds(c, [[0, 400, 900, 101, 160], [600, 640, 760, 102, 220, true]], t, PALETTES.red, .8); flash(c, fl * .25, '#FFC08A'); });
  plane(c, cam, .5, (c) => { ridge(c, 1380, 80, 103, '#200608', { freq: .005 }); figure(c, (f) => army(f, 1370, 300, 1160, .32, t, 11, '#160406'), { edge: { col: '#FF8A5A', w: 1.4, a: .7 } }); });
  plane(c, cam, 1, (c) => {
    fillPath(c, 'M -200 1560 C 300 1540 800 1544 1300 1560 L 1300 2200 L -200 2200 Z', '#0E0406');
    // the demon soldiers on the right, falling back as the days pass; the goddesses advancing from the left
    figure(c, (f) => { for (let i = 0; i < 7; i++) { const x = 560 + i * 90 + hash(i) * 30, down = clamp(gone * 1.8 - hash(i * 3) * .9); f.save(); f.translate(x, 1640); f.rotate(down * 1.4); f.globalAlpha = 1 - down * .8; army(f, 0, -20, 30, 1.25, t, 20 + i, '#0A0204', 0); f.restore(); } },
      { edge: { col: '#FF9A6A', w: 2, a: .85 } });
    for (let i = 0; i < 5; i++) goddess(c, 60 + i * 120 + 220 * gone + Math.sin(t * 2 + i) * 10, 1720 + (i % 2) * 40, .36, t, i);
    for (const [h0, x, y] of [[48.1, 640, 1300], [48.8, 760, 1240], [49.5, 600, 1360]]) { const v = t - h0; if (v > 0 && v < .8) glow(c, x, y, 300 * (1 - v), '#FFE2B0', .9 * (1 - v / .8)); }
    debris(c, [500, 1000, 1100], t, TL.war, 16, 3);
  });
  plane(c, cam, 1.2, (c) => embers(c, 540, 1950, t, 60, 13, 1200, 1400));
} });

// ---------- shot 14: the eleventh day: she draws fifteen arrows ----------
// the archer stands at (250, 1560) × .95; arrow i fans out from the nock at its own angle
const AX = 250, AY = 1560, AK = .95, ARROW_ANG = (i) => (i - 7) * .045;
SHOTS.push({ a: TL.arrows, b: TL.release + .35, xf: .4, draw(c, u, t) {
  const d = t < TL.release ? easeIO(seg(t, TL.arrows + .3, TL.count + .2)) : lerp(1, 0, easeOut(seg(t, TL.release, TL.release + .12)));
  const tense = t > TL.count && t < TL.release ? Math.sin(t * 61) * 1.2 : 0, rel = t - TL.release;
  const cam = { z: lerp(1.0, 1.12, easeIO(seg(t, TL.arrows, TL.release))), fx: 400, fy: 1000, x: tense, y: rel > 0 ? Math.cos(t * 41) * 6 * Math.exp(-rel * 6) : 0 };
  plane(c, cam, 0, (c) => { sky(c, [[0, '#0A0204'], [800, '#2A060A'], [1300, '#6A1410'], [1700, '#2A0606']]); });
  plane(c, cam, .1, (c) => { glow(c, 640, 980, 700, '#FF4A1E', .5); ellipse(c, 640, 980, 400, 400, '#C8321A'); ellipse(c, 640, 980, 380, 380, '#E04A22'); glow(c, 640, 980, 380, '#FFB060', .25); });
  plane(c, cam, .3, (c) => { ridge(c, 1520, 70, 111, '#140406', { freq: .005 }); haze(c, 1500, 140, '#FF6A2A', .3); });
  plane(c, cam, 1, (c) => {
    fillPath(c, 'M -200 1560 C 300 1552 800 1556 1300 1566 L 1300 2200 L -200 2200 Z', '#0A0204');
    figure(c, (f) => { f.translate(AX, AY); f.scale(AK, AK); archer(f, { t, draw: d }); }, { tint: ['#0A0204', .9], edge: { col: '#FFB080', w: 2, a: .85 }, rim: { col: '#FFD8B0', dx: 0, dy: -3, a: .9 } });
    // the arrows of light on the string, one more every 0.2 s; at the release they leave together
    const [nx, ny] = archerNock(Math.max(d, .001)), X0 = AX + nx * AK, Y0 = AY + ny * AK;
    for (let i = 0; i < 15; i++) {
      const a0 = ARROW_T(i), on = easeOut(seg(t, a0, a0 + .12)); if (on <= 0) continue;
      const ang = ARROW_ANG(i), L = 520 * AK, fx = rel > 0 ? rel * 5200 : 0;
      arrowLight(c, X0 + fx * Math.cos(ang), Y0 + fx * Math.sin(ang), X0 + (L + fx) * Math.cos(ang), Y0 + (L + fx) * Math.sin(ang), on * (rel > 0 ? 1 : .85), .9);
    }
    // the count, big, as each arrow lands on the string
    const n = Math.min(15, Math.floor((t - TL.count) / .2) + 1);
    if (t >= TL.count && t < TL.release) { const pop = t - ARROW_T(n - 1); text(c, String(n), 820, 640, '700 150px Cinzel', '#FFF3DC', { pop, glow: ['rgba(255,170,60,.9)', 40] }); }
  });
} });

// ---------- shot 15: the arrows strike Durgama; five through his heart; he falls ----------
// targets in his local units (he stands at (560, 1960) × 1.12); the flag is in screen pixels
const DX = 560, DY = 1960, DK = 1.12, toS = ([x, y]) => [DX + x * DK, DY + y * DK];
const HIT_PTS = { flag: [[1030, 1090]], eyes: [[-22, -918], [22, -918]], arms: [[-250, -720], [250, -720]], heart: [[30, -770], [56, -790], [44, -744], [12, -800], [70, -760]] };
SHOTS.push({ a: TL.release + .2, b: TL.name + .5, xf: .15, draw(c, u, t) {
  const h = t - TL.heart, fall = easeIn(seg(t, TL.fall, TL.fall + .95)), fl = h > 0 ? Math.exp(-h * 4) : 0;
  const cam = { z: lerp(1.0, 1.1, easeIO(u / 3)), fx: 560, fy: 1000, ...shake(t, 3 + 22 * fl + 10 * (t > TL.fall + .9 && t < TL.fall + 1.4 ? 1 : 0)) };
  plane(c, cam, 0, (c) => { STORM(c); glow(c, 560, 1300, 900, '#FF5A1E', .4); });
  plane(c, cam, .1, (c) => clouds(c, [[0, 300, 900, 121, 60], [600, 520, 760, 122, 80, true]], t, PALETTES.red, .85));
  plane(c, cam, .4, (c) => { ridge(c, 1500, 80, 123, '#1A0508', { freq: .005 }); haze(c, 1480, 160, '#D0461E', .35); });
  plane(c, cam, 1, (c) => {
    banner(c, 960, 1960, 1.1, t, { hit: easeOut(seg(t, HITS.flag, HITS.flag + .3)) });
    const blind = t > HITS.eyes ? 0 : 1;
    durgamaFig(c, DX, DY + fall * 260, DK, t, { rot: -fall * .5, expr: t > HITS.eyes ? 'scream' : 'scream', eyes: blind, arms: 'roar' }, DEMON_RED(fl));
    // the arrows: each streaks in from the left over .16 s and stays, glowing, where it struck
    const shot = (pts, t1, screen) => pts.forEach((p, i) => {
      // a point on him follows his fall: rotated about his feet with him, then dropped (the flag stays put)
      const r = -fall * .5, [tx, ty] = screen ? p : [DX + (p[0] * Math.cos(r) - p[1] * Math.sin(r)) * DK, DY + (p[0] * Math.sin(r) + p[1] * Math.cos(r)) * DK], k = seg(t, t1 - .16, t1); if (k <= 0) return;
      const drop = screen ? 0 : fall * 260, ang = -.08 + (i - pts.length / 2) * .05, len = 260;
      if (k < 1) arrowLight(c, tx - 900 * (1 - k) - 500, ty + drop - 40 * (1 - k), tx - 900 * (1 - k), ty + drop, 1, 1.5);
      else { const a = .5 + .5 * Math.exp(-(t - t1) * 2); arrowLight(c, tx - len * Math.cos(ang), ty + drop - len * Math.sin(ang), tx, ty + drop, a, 1.3); if (t - t1 < .4) glow(c, tx, ty + drop, 160, '#FFFFFF', .8 * (1 - (t - t1) / .4)); }
    });
    shot(HIT_PTS.flag, HITS.flag, true); shot(HIT_PTS.eyes, HITS.eyes); shot(HIT_PTS.arms, HITS.arms); shot(HIT_PTS.heart, TL.heart);
    // the four for the horses and the one for the charioteer fly low across the bottom, out of frame
    for (let i = 0; i < 5; i++) { const t1 = 54.3 + i * .05, k = seg(t, t1 - .2, t1); if (k > 0 && k < 1) arrowLight(c, -400 + 1900 * k, 1880 + i * 14, 0 + 1900 * k, 1880 + i * 14, 1, 1); }
    if (h > 0) { shockRings(c, ...toS([40, -770]), t, [TL.heart, TL.heart + .25]); glow(c, ...toS([40, -770]), 500 * fl + 60, '#FFE2B0', .9 * fl); }
    if (t > TL.fall + .9) { const v = t - TL.fall - .9; glow(c, 560, 1900, 700, '#FF9A5A', .3 * Math.exp(-v * 2)); motes(c, { n: 60, seed: 131, box: [100, 1600, 1000, 1960], r: 10, col: '#8A5A4A', a: .4 * Math.exp(-v), vx: 0, vy: -90, t }); }
    embers(c, 560, 1960, t, 50, 14, 1200, 1400);
  });
} });

// ---------- shot 16: dawn; the Vedas given back; "So my name is DURGA" ----------
SHOTS.push({ a: TL.name, b: TL.card + .1, xf: .6, draw(c, u, t) {
  const push = easeIO(seg(t, TL.said - .4, TL.durga + .4)), back = easeIO(seg(t, TL.ask - .4, TL.ask + 1)), z = lerp(lerp(1.0, 1.55, push), .8, back);
  const cam = { z, fx: 540, fy: lerp(lerp(1000, 820, push), 1900, back) }, dg = t - TL.durga;
  plane(c, cam, 0, (c) => { sky(c, [[0, '#24183A'], [560, '#5E2E4E'], [1000, '#C9663D'], [1380, '#FFCF86'], [1600, '#FFE2A8']]); glow(c, 540, 1240, 900, '#FFB45A', .55); ellipse(c, 540, 1240, 300, 300, '#FFE9B8'); });
  plane(c, cam, .1, (c) => { rays(c, 540, 1240, { n: 18, dir: -Math.PI / 2, spread: 3, len: 1600, w: 240, col: '#FFE6A8', a: .22 + (dg > 0 ? .3 * Math.exp(-dg) : 0), t, seed: 12 }); clouds(c, [[0, 520, 900, 141, 14], [600, 760, 800, 142, 20, true]], t, PALETTES.dawn, .85); });
  plane(c, cam, .4, (c) => { ridge(c, 1640, 110, 143, '#3A1A2A', { freq: .004 }); haze(c, 1620, 200, '#FFB070', .35); });
  plane(c, cam, 1, (c) => {
    durgaFig(c, 540, 1840, 1.2, t, { fire: dg > 0 ? .9 : .2, wind: .4 }, { tint: ['#2A1018', .12], edge: { col: '#FFE2B0', w: 2.4, a: .8 }, rim: { col: '#FFF0C8', dx: 5, dy: -4, a: .9, blur: 1 } });
    figure(c, (f) => { for (const [x, s, sc] of [[110, 1, .5], [230, 1, .55], [850, -1, .55], [970, -1, .5]]) { f.save(); f.translate(x, 1960); f.scale(-s * sc, sc); rishi(f, { t, pose: 'stand', staff: false }); f.restore(); } },
      { tint: ['#2A1018', .85], edge: { col: '#FFD9A0', w: 2, a: .85 } });
    for (const to of [[170, 1760], [910, 1760]]) mantraFlow(c, t, { from: [[540, 1180]], to, n: 30, t0: TL.name + .4, dur: 2.4, fly: 1.4, size: 40, arc: 160, seed: to[0] });
  });
  plane(c, cam, 1.2, (c) => motes(c, { n: 60, seed: 151, box: [-100, 200, W + 100, 1950], r: 3.5, col: '#FFE2A8', a: .55, vx: 6, vy: -40, t }));
} });

// ---------- the card ----------
SHOTS.push({ a: TL.card, b: TL.end + .1, draw(c, u, t) {
  rkCardCine(c, u, t, { title: 'JAI MAA DURGA', line: 'Meet her nine forms in our books', price: 'Books 1–3 · set of 3 for ₹500' });
} });

// ---------- flashes ----------
POST.push((c, t) => {
  // dark pools behind captions that sit on bright shots (Shakambhari's dawn, DURGA, the ask over the sun)
  for (const [a, b, y, sy] of [[TL.feed, TL.attack, 1420, .4], [TL.durga, TL.ask, 1420, .35], [TL.ask, TL.card, 600, .5]]) {
    const dk = Math.min(seg(t, a - .1, a + .2), 1 - seg(t, b - .2, b)); if (dk <= 0) continue;
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.translate(540, y); c.scale(1, sy); glow(c, 0, 0, 620, '#0A0204', .75 * dk, 'source-over'); c.restore();
  }
  flash(c, .9 * Math.exp(-Math.max(0, t - TL.eyes) * 3) * (t > TL.eyes - .05 ? 1 : 0), '#FFF6E0');
  flash(c, .85 * Math.exp(-Math.max(0, t - TL.burst) * 3.5) * (t > TL.burst - .03 ? 1 : 0), '#FFF2D8');
  flash(c, .35 * Math.exp(-Math.max(0, t - TL.release) * 6) * (t > TL.release - .02 ? 1 : 0), '#FFE2B0');
  flash(c, 1 * Math.exp(-Math.max(0, t - TL.heart) * 3) * (t > TL.heart - .02 ? 1 : 0), '#FFFFFF');
  flash(c, .6 * Math.exp(-Math.max(0, t - TL.durga) * 2.5) * (t > TL.durga - .02 && t < TL.card ? 1 : 0), '#FFD890');
  flash(c, .8 * Math.exp(-Math.max(0, t - TL.card) * 4) * (t > TL.card - .02 ? 1 : 0), '#FFF6E0');
});

// ---------- captions ----------
say(-.35, 2.5, 'Maa *DURGA*\'s name | came from | a DEMON.', { y: 1400, size: 66, at: Array(7).fill(-.35) });
say(2.5, 4.6, 'She earned it | with FIFTEEN | arrows.', { y: 1400, size: 62 });
say(4.8, 7.1, 'A demon, *Durgama*, | pleased *Brahma* | with his tapas.', { y: 540 });
say(7.1, 9.4, 'His boon: | "Give me ALL | the *Vedas*."', { y: 540, size: 60 });
say(9.6, 11.7, 'Every mantra | left the earth.', { y: 560 });
say(11.7, 13.9, 'The rishis forgot | the *Vedas*. | The yagnas stopped.', { y: 560 });
say(14.0, 16.2, 'No yagna. | No rain.', { y: 1200, size: 64 });
say(16.2, 18.6, 'For ONE HUNDRED | YEARS.', { y: 1200, size: 70 });
say(18.8, 21.2, 'The rishis prayed | to the *Devi* | in the *Himalayas*.', { y: 1180 });
say(21.2, 22.8, 'And she came.', { y: 1180, size: 64 });
say(23.0, 25.0, 'With COUNTLESS | eyes.', { y: 1420, size: 64 });
say(25.0, 26.8, '*SHATAKSHI*.', { y: 1420, size: 84 });
say(27.0, 29.2, 'And every eye | was CRYING.', { y: 1430 });
say(29.2, 31.4, 'She wept | for NINE nights.', { y: 1430 });
say(31.6, 33.8, 'Her tears | became RIVERS.', { y: 620, size: 64 });
say(33.8, 36.2, 'She fed the world | from her own hands: | *SHAKAMBHARI*.', { y: 1420 });
say(36.4, 39.2, 'Then *Durgama* came | with a THOUSAND | armies.', { y: 1420 });
say(39.4, 41.6, 'She shielded the | gods and rishis | in a ring of light,', { y: 580 });
say(41.6, 43.2, 'and stood outside. | ALONE.', { y: 580, size: 64 });
say(43.4, 45.4, 'Goddesses burst | out of her body:', { y: 1430 });
say(45.4, 47.6, '*Kalika*. *Tarini*. | *Bhairavi*. *Bagala*. | *Chhinnamasta*.', { y: 1430 });
say(47.8, 50.2, 'In TEN days, | his armies | were gone.', { y: 580 });
say(50.4, 52.4, 'On the | eleventh day,', { y: 1440 });
say(52.4, 54.0, 'she drew | FIFTEEN arrows.', { y: 1440, size: 62 });
say(54.0, 56.0, 'His horses. | His charioteer. | His flag. His eyes. | His arms.', { y: 1380, size: 52 });
say(56.0, 58.0, 'And FIVE | through his heart.', { y: 1400, size: 64 });
say(58.2, 61.6, 'She gave the *Vedas* | back to the rishis, | and said:', { y: 600 });
say(61.6, 63.4, '"I killed *Durgama*. | So my name is..."', { y: 1420 });
say(63.4, 65.0, '*DURGA*.', { y: 1420, size: 130 });
say(65.0, 68.2, 'Is your name | *DURGA*, *SHATAKSHI* | or *SHAKAMBHARI*? | Comment it!', { y: 600 });
