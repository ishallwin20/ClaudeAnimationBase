// shiva_cine.js: "There is one dance even the gods fear": Shiva's Tandava, the Rudra Tandava for Sati, the Shakti
// Peethas, Shailputri, and the dance of joy. A captioned explainer (no voice, no music) in the cinematic style
// (src/cine.js), ending on the Books 1–3 sale card. Times are in TL; tools/shiva_cine_sfx.mjs uses the same ones.

// ---------- shot 1: Kailash at night ----------
SHOTS.push({ a: 0, b: 4.4, draw(c, u, t) {
  const cam = { z: lerp(1, 1.12, easeIO(u / 4.4)), fx: 560, fy: 1450 }, fl = strikes(t, [2.75]);
  plane(c, cam, 0, (c) => sky(c, [[0, '#060A15'], [650, '#111A30'], [1200, '#283350'], [1520, '#47516E']]));
  plane(c, cam, .05, (c) => {
    glow(c, 800, 520, 560, '#7F97CC', .38); glow(c, 800, 520, 120, '#DDE6FA', .5);
    ellipse(c, 800, 520, 50, 50, '#E6ECF6'); ellipse(c, 786, 510, 12, 9, rgba('#C5CEE0', .7)); ellipse(c, 812, 538, 8, 6, rgba('#C5CEE0', .6));
    rays(c, 800, 520, { n: 9, dir: 1.98, spread: .8, len: 1600, w: 300, col: '#A9BCE6', a: .13, t });
  });
  plane(c, cam, .1, (c) => clouds(c, [[100, 300, 760, 1, 9], [700, 420, 620, 2, 12, true], [380, 660, 900, 3, 7]], t, PALETTES.nightFar, .9));
  plane(c, cam, .15, (c) => { bolt(c, 330, 380, 420, 1000, 7, fl); flash(c, fl * .28, '#9FB6F0'); });
  plane(c, cam, .3, (c) => kailash(c, 540, 860, 600, { light: 1 }));
  plane(c, cam, .35, (c) => haze(c, 1420, 320, '#7886A6', .5));
  plane(c, cam, .5, (c) => { ridge(c, 1470, 110, 3, '#1A2133', { freq: .006 }); haze(c, 1560, 200, '#6C7898', .3); });
  plane(c, cam, .7, (c) => clouds(c, [[600, 230, 1100, 4, 22], [0, 130, 900, 5, 18, true]], t, PALETTES.night, .95));
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
  plane(c, cam, .1, (c) => clouds(c, [[0, 260, 820, 11, 30], [500, 520, 700, 12, 40, true], [200, 900, 900, 13, 26]], t, PALETTES.nightFar, .9));
  plane(c, cam, .15, (c) => { bolt(c, 980, -40, 760, 1250, 21, fl); flash(c, fl * .3, '#9FB6F0'); });
  plane(c, cam, .25, (c) => { kailash(c, 240, 1120, 420); haze(c, 1500, 360, '#6E7C9E', .55); });
  plane(c, cam, .45, (c) => { ridge(c, 1640, 80, 8, '#151B2B', { freq: .005 }); });
  plane(c, cam, .6, (c) => clouds(c, [[300, 120, 1000, 14, 55], [900, 330, 760, 15, 70, true]], t, PALETTES.night, .85));
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
  plane(c, cam, .1, (c) => { glow(c, 900, 360, 600, '#6F87BE', .35); soft(c, 6, (s) => clouds(s, [[0, 300, 900, 21, 14], [600, 700, 800, 22, 18, true]], t, PALETTES.nightFar, .9), { blur: 2 }); });
  plane(c, cam, 1, (c) => {
    figure(c, (f) => { f.translate(540, hy); f.scale(K, K); f.translate(0, 815); shiva(f, { t, wind: .5, eyes, third, arm: 'abhaya', light: 1, look: [0, .1] }); },
      { tint: ['#16224A', .2], grade: [[1300, 'rgba(0,0,0,0)'], [1950, 'rgba(4,7,18,.7)']],
        edge: { col: '#D4E0FA', w: 3, a: .3 }, rim: { col: '#EAF1FF', dx: 9, dy: -4, a: .85, blur: 2 } });
    // the third eye's fire lights the face
    glow(c, 540, hy + (815 - 853) * K, 520 * third + 1, '#FF7A2A', .35 * third);
  });
  flash(c, .12 * third * (.6 + .4 * Math.sin(t * 40)), '#FF9A4A');
} });

// ---------- the timeline ----------
const TL = { yagna: 10.7, daksha: 15.0, point: 15.8, laugh: 17.9, fire: 20.4, walk: 22.2, burn: 24.75, rudra: 25.3, chakra: 32.8,
  hit: 35.4, peethas: 35.9, medit: 41.4, shail: 44.2, joy: 49.0, card: 56.8, end: 62.0 };

// ---------- shot 4: Sati before the yagna fire ----------
const SATI_FX = { tint: ['#1A0806', .5], edge: { col: '#FFB070', w: 2.5, a: .75 }, rim: { col: '#FFD08A', dx: 6, dy: -3, a: .9, blur: 1 } };
SHOTS.push({ a: TL.yagna, b: TL.daksha + .5, xf: .2, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.08, easeIO(u / 4.8)), fx: 540, fy: 1000 };
  plane(c, cam, 0, hallSky);
  plane(c, cam, .35, (c) => { pillars(c, 560, 1380, 560, '#2A130F', t); crowd(c, 40, 380, 1400, 4, .8, t, 0, '#1A0B09', 3); crowd(c, 740, 1060, 1400, 4, .8, t, 0, '#1A0B09', 5); });
  plane(c, cam, .5, (c) => { glow(c, 560, 1440, 500, '#FF7A26', .35); yagna(c, 560, 1440, 340, t, 1); embers(c, 560, 1300, t, 30, 2); });
  plane(c, cam, 1, (c) => figure(c, (f) => { f.translate(400, 2080); f.scale(1.45, 1.45); sati(f, { t, wind: .15 }); }, SATI_FX));
} });

// ---------- shot 5: Daksha insults Shiva ----------
SHOTS.push({ a: TL.daksha, b: TL.fire + .5, xf: .5, draw(c, u, t) {
  const laugh = seg(t, TL.laugh, TL.laugh + .4), point = easeOut(seg(t, TL.point, TL.point + .7));
  const cam = { z: lerp(1.0, 1.1, easeIO(u / 5.6)), fx: 700, fy: 1300 };
  plane(c, cam, 0, hallSky);
  plane(c, cam, .4, (c) => pillars(c, 600, 1440, 470, '#2A130F', t, 8, 40));
  plane(c, cam, .7, (c) => { glow(c, 470, 1500, 420, '#FF7A26', .35); yagna(c, 470, 1520, 240, t, .95); embers(c, 470, 1420, t, 24, 4, 200, 700); });
  plane(c, cam, .8, (c) => {
    figure(c, (f) => { f.translate(820, 1590); f.scale(.62, .62); daksha(f, { t, point, laugh }); }, { edge: { col: '#FF9A50', w: 2, a: .7 }, rim: { col: '#FFC07A', dx: -5, dy: -2, a: .9 } });
    figure(c, (f) => { f.translate(250, 1600); f.scale(.5, .5); sati(f, { t, wind: .1 }); }, { ...SATI_FX, rim: { col: '#FFD08A', dx: 5, dy: -2, a: .9 } });
  });
  plane(c, cam, 1.2, (c) => crowd(c, -60, 1140, 1900, 7, 1.4, t, laugh, '#0A0505', 9));
} });

// ---------- shot 6: Sati walks into the fire ----------
SHOTS.push({ a: TL.fire, b: TL.rudra + .3, xf: .5, draw(c, u, t) {
  const walk = Math.pow(seg(t, TL.walk, TL.burn), 1.25), fk = 1 + 1.7 * easeIn(seg(t, TL.walk + 1.2, TL.burn + .3));
  const cam = { z: lerp(1.04, 1.16, easeIO(u / 4.9)), fx: 540, fy: 1250 };
  plane(c, cam, 0, hallSky);
  plane(c, cam, .35, (c) => { pillars(c, 560, 1380, 560, '#2A130F', t); crowd(c, 40, 380, 1400, 4, .8, t, 0, '#1A0B09', 3); crowd(c, 740, 1060, 1400, 4, .8, t, 0, '#1A0B09', 5); });
  plane(c, cam, .5, (c) => { glow(c, 560, 1440, 500 * fk, '#FF7A26', .35 + .2 * (fk - 1)); yagna(c, 560, 1440, 340, t, fk); embers(c, 560, 1300, t, 30 + 40 * (fk - 1), 2, 340 * fk); });
  plane(c, cam, .5, (c) => {   // on the fire's plane, so she walks right up to the altar
    const x = lerp(400, 552, walk), k = lerp(1.45, .46, walk), y = lerp(2080, 1442, walk) - Math.abs(Math.sin(walk * Math.PI * 7)) * 10 * k, a = 1 - seg(walk, .72, .97);
    figure(c, (f) => { f.translate(x, y); f.scale(k, k); sati(f, { t, wind: .15 + walk * .6 }); }, { ...SATI_FX, alpha: a });
    if (walk > .6) { c.save(); c.globalAlpha = seg(walk, .6, 1); yagna(c, 560, 1440, 340, t + 3, fk * .9); c.restore(); }   // the flames close over her
  });
} });

// ---------- shot 7: the Rudra Tandava ----------
function redStorm(c, cam, t, u, fl) {
  plane(c, cam, 0, (c) => sky(c, [[0, '#12040A'], [600, '#3A0A12'], [1200, '#8A1E16'], [1650, '#D0461E']]));
  plane(c, cam, .05, (c) => { glow(c, 540, 1650, 1000, '#FF5A1E', .45); meteors(c, t, TL.rudra, 9, 3); });
  plane(c, cam, .1, (c) => clouds(c, [[0, 240, 900, 41, 40], [600, 420, 800, 42, 55, true], [200, 700, 900, 43, 30]], t, PALETTES.red, .95));
  plane(c, cam, .15, (c) => { bolt(c, 200, -40, 330, 1100, 31, strikes(t, [26.2])); bolt(c, 900, -40, 760, 1200, 32, strikes(t, [28.9])); bolt(c, 520, -40, 420, 900, 33, strikes(t, [31.3])); flash(c, fl * .3, '#FFC0A0'); });
  plane(c, cam, .3, (c) => { ridge(c, 1500, 260, 21, '#2A0A10', { freq: .005 }); for (let i = 0; i < 14; i++) { const x = 60 + hash(i * 4.4) * 960, y0 = 1300 + hash(i * 2.2) * 200, f = frac(t * .5 + hash(i)); ellipse(c, x + f * 20, y0 + f * f * 420, 7 + hash(i * 9) * 9, 6 + hash(i * 8) * 7, '#1E070C'); } haze(c, 1600, 260, '#FF6A2A', .35); });
  plane(c, cam, .6, (c) => { ridge(c, 1760, 60, 22, '#12050A', { freq: .006 }); cracks(c, 540, 1740, easeOut(seg(t, TL.rudra + .8, TL.chakra)), t, 9); });
}
SHOTS.push({ a: TL.rudra, b: TL.chakra + .4, xf: .3, draw(c, u, t) {
  const fl = strikes(t, [26.2, 28.9, 31.3]), P = 1.1, p = frac(u / P), stamp = p < .7 ? 0 : Math.exp(-(p - .7) * P * 10), sh = stamp * 16 + fl * 4;
  const cam = { z: lerp(1.12, 1.0, easeOut(u / 3)), fx: 540, fy: 1150, x: Math.sin(t * 53) * sh, y: Math.cos(t * 41) * sh };
  redStorm(c, cam, t, u, fl);
  plane(c, cam, 1, (c) => figure(c, (f) => { f.translate(540, 1740); f.scale(1.0, 1.0); rudra(f, { t: u, beat: P }); },
    { edge: { col: '#FF9A6A', w: 2.5, a: .8 }, rim: { col: mixCol('#FFB08A', '#FFFFFF', clamp(fl)), dx: 0, dy: -5, a: .8 + fl, blur: 1 } }));
  plane(c, cam, 1.2, (c) => motes(c, { n: 70, seed: 23, box: [-100, 200, W + 100, 1950], r: 3.4, col: '#FF8A4A', a: .8, vx: 40, vy: -160, t }));
} });

// ---------- shot 8: the Sudarshan chakra ----------
const chakraAt = k => [lerp(1180, 560, k), lerp(120, 1060, k) - Math.sin(k * Math.PI) * 120];
SHOTS.push({ a: TL.chakra, b: TL.peethas + .3, xf: .4, draw(c, u, t) {
  const fl = strikes(t, [31.3]), cam = { z: 1, fx: 540, fy: 1100 }, k = easeIn(seg(t, TL.chakra + .3, TL.hit));
  redStorm(c, cam, t, u, fl);
  plane(c, cam, 1, (c) => figure(c, (f) => { f.translate(540, 1560); f.scale(.55, .55); rudra(f, { t: u + 7.5, beat: 1.1 }); },
    { edge: { col: '#FF9A6A', w: 2, a: .8 }, rim: { col: '#FFB08A', dx: 0, dy: -4, a: .8 } }));
  if (k > 0) {
    for (let j = 10; j >= 1; j--) { const kj = Math.max(0, k - j * .03), [x, y] = chakraAt(kj); chakra(c, x, y, lerp(26, 120, kj), t * 25, .12 * (1 - j / 11), t); }
    const [x, y] = chakraAt(k); chakra(c, x, y, lerp(26, 120, k), t * 25, 1, t);
  }
} });

// ---------- shot 9: the Shakti Peethas ----------
const HILLS = [[1060, 70, 51, '#2D2748'], [1220, 90, 52, '#211C38'], [1420, 110, 53, '#17122A'], [1640, 130, 54, '#0E0B1A']];
const hillY = (i, x) => HILLS[i][0] - HILLS[i][1] * (fbm(x * .004, HILLS[i][2]) * .5 + .5);
const PEETHAS = Array.from({ length: 51 }, (_, i) => {
  const L = Math.min(3, Math.floor(hash(i * 3.1 + 1) * 4)), x = 50 + hash(i * 7.7) * 980;
  return { L, x, y: hillY(L, x) + 18 + hash(i * 5.3) * 50 * (L + 1), tl: TL.peethas + .7 + i / 51 * 3.4 + (hash(i * 9.9) - .5) * .25, sx: x + (hash(i * 2.2) - .5) * 500 };
});
SHOTS.push({ a: TL.peethas, b: TL.medit + .4, xf: .3, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.08, easeIO(u / 5.5)), fx: 540, fy: 1200 };
  plane(c, cam, 0, (c) => { sky(c, [[0, '#070614'], [700, '#141230'], [1100, '#2E2650'], [1300, '#3E3260']]); stars(c, 140, 3, t); glow(c, 540, 1100, 700, '#6A4A9A', .3); });
  HILLS.forEach(([, , , col], L) => plane(c, cam, .2 + L * .15, (c) => {
    ridge(c, HILLS[L][0], HILLS[L][1], HILLS[L][2], col, { freq: .004 });
    haze(c, HILLS[L][0] + 40, 120, '#5A4A8A', .18);
    for (const pp of PEETHAS) {
      if (pp.L !== L) continue;
      const k = .6 + L * .25, land = seg(t, pp.tl - .9, pp.tl);
      if (land < 1 && land > 0) {   // still falling: an ember with a tail
        const x = lerp(pp.sx, pp.x, land), y = lerp(-80, pp.y, easeIn(land));
        glow(c, x, y, 40 * k, '#FFB050', .9); ellipse(c, x, y, 4 * k, 4 * k, '#FFF2C8');
      } else if (land >= 1) {
        const a = t - pp.tl, b = Math.exp(-a * 4);
        glow(c, pp.x, pp.y - 30 * k, (70 + 140 * b) * k, '#FFB050', .55 + .4 * b);
        shrine(c, pp.x, pp.y, k * .9, col);
        glow(c, pp.x, pp.y - 2 * k, 14 * k, '#FFE6A0', .9);
      }
    }
  }));
  plane(c, cam, 1.1, (c) => motes(c, { n: 40, seed: 31, box: [-100, 200, W + 100, 1900], r: 2.6, col: '#FFD9A0', a: .5, vx: 6, vy: -20, t }));
} });

// ---------- shot 10: Shiva sits in silence for ages ----------
SHOTS.push({ a: TL.medit, b: TL.shail + .5, xf: .4, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.06, easeIO(u / 3.3)), fx: 560, fy: 1450 }, ma = lerp(-.2, 1.2, u / 3.3) * Math.PI;
  const mx = 540 - Math.cos(ma) * 520, my = 820 - Math.sin(ma) * 420;
  plane(c, cam, 0, (c) => { sky(c, [[0, '#060A15'], [650, '#111A30'], [1200, '#283350'], [1520, '#47516E']]); stars(c, 90, 8, t, .7); });
  plane(c, cam, .05, (c) => { glow(c, mx, my, 360, '#7F97CC', .35); ellipse(c, mx, my, 40, 40, '#E6ECF6'); });
  plane(c, cam, .3, (c) => kailash(c, 540, 860, 600, { light: 1 }));
  plane(c, cam, .35, (c) => haze(c, 1420, 320, '#7886A6', .5));
  plane(c, cam, .5, (c) => { ridge(c, 1470, 110, 3, '#1A2133', { freq: .006 }); haze(c, 1560, 200, '#6C7898', .3); });
  plane(c, cam, 1, (c) => {
    ledge(c, 500, 1590, '#0C111D', '#B9C8EA', .5);
    figure(c, (f) => { f.translate(600, 1592); f.scale(.34, .34); shivaSeated(f, { t }); }, { edge: { col: '#C9D7F5', w: 1.8, a: .6 }, rim: { col: '#E4EDFF', dx: 3, dy: -2, a: .9 } });
  });
  plane(c, cam, 1.1, (c) => motes(c, { n: 200, seed: 5, box: [-100, 0, W + 100, 1950], r: 3.4, col: '#E4ECFF', a: .65, vx: 40, vy: 160, t }));
} });

// ---------- shot 11: she returns as Shailputri, daughter of the mountains ----------
SHOTS.push({ a: TL.shail, b: TL.joy + .5, xf: .5, draw(c, u, t) {
  const cam = { z: lerp(1.08, 1.0, easeOut(u / 5)), fx: 540, fy: 1400 }, sy = lerp(1290, 1150, easeOut(u / 5));
  plane(c, cam, 0, (c) => sky(c, [[0, '#2A1B3E'], [600, '#6A3352'], [1050, '#D27448'], [1350, '#FFD08C']]));
  plane(c, cam, .05, (c) => { glow(c, 720, sy, 800, '#FFB45A', .5); glow(c, 720, sy, 220, '#FFF0C8', .7); ellipse(c, 720, sy, 120, 120, '#FFE9B8');
    rays(c, 720, sy, { n: 14, dir: -Math.PI / 2, spread: Math.PI * 1.4, len: 1400, w: 220, col: '#FFD58A', a: .2, t, seed: 9 }); });
  plane(c, cam, .1, (c) => clouds(c, [[0, 300, 800, 51, 10], [600, 560, 700, 52, 14, true]], t, PALETTES.dawn, .9));
  plane(c, cam, .25, (c) => { kailash(c, 300, 1050, 380, { rock: '#3A2036', snow: '#C9828A', snowSh: '#6E3A50', light: -1 }); ridge(c, 1330, 120, 61, '#4A2840', { freq: .005 }); haze(c, 1380, 240, '#FFC27A', .5); });
  plane(c, cam, .5, (c) => { ridge(c, 1520, 90, 62, '#2E1828', { freq: .006 }); haze(c, 1560, 160, '#FFB070', .3); });
  plane(c, cam, 1, (c) => {
    figure(c, (f) => fillPath(f, 'M -100 1720 C 120 1680 260 1650 380 1648 C 560 1640 760 1660 900 1700 C 1000 1730 1100 1760 1180 1800 L 1180 2100 L -100 2100 Z', '#1C111B'), { edge: { col: '#FFC98A', w: 2.5, a: .6 } });
    figure(c, (f) => { f.translate(730, 1676); f.scale(.5, .5); nandiLying(f, { t }); }, { edge: { col: '#FFD9A0', w: 2.2, a: .8 }, rim: { col: '#FFF0C8', dx: 4, dy: -3, a: .8 } });
    figure(c, (f) => { f.translate(430, 1652); f.scale(.62, .62); sati(f, { t, wind: .7, trishul: true, lotus: true }); },
      { tint: ['#2A1018', .55], edge: { col: '#FFD9A0', w: 2.4, a: .85 }, rim: { col: '#FFF0C8', dx: 5, dy: -3, a: .9, blur: 1 } });
  });
  plane(c, cam, 1.2, (c) => motes(c, { n: 50, seed: 41, box: [-100, 300, W + 100, 1900], r: 3, col: '#FFD9A0', a: .6, vx: 14, vy: -30, t }));
} });

// ---------- shot 12: the dance of joy ----------
SHOTS.push({ a: TL.joy, b: TL.card + .6, xf: .5, draw(c, u, t) {
  const cam = { z: lerp(1.22, 1.0, easeOut(u / 3.2)), fx: 540, fy: 1180 };
  plane(c, cam, 0, (c) => sky(c, [[0, '#24183A'], [560, '#5E2E4E'], [1000, '#C9663D'], [1380, '#FFCF86'], [1600, '#FFE2A8']]));
  plane(c, cam, .05, (c) => {
    glow(c, 540, 1190, 900, '#FFB45A', .55); glow(c, 540, 1190, 300, '#FFF0C8', .7);
    ellipse(c, 540, 1190, 235, 235, '#FFE9B8');
    rays(c, 540, 1190, { n: 18, dir: -Math.PI / 2, spread: Math.PI * 1.5, len: 1500, w: 240, col: '#FFD58A', a: .22, t, seed: 4 });
  });
  plane(c, cam, .1, (c) => clouds(c, [[0, 280, 900, 31, 10], [520, 520, 760, 32, 14, true], [200, 760, 640, 33, 8]], t, PALETTES.dawn, .92));
  plane(c, cam, .25, (c) => { kailash(c, 150, 1180, 400, { rock: '#3A2036', snow: '#B9727A', snowSh: '#6E3A50', light: -1 }); haze(c, 1500, 300, '#FFC27A', .55); });
  plane(c, cam, .45, (c) => { ridge(c, 1560, 60, 12, '#3B1F33', { freq: .006 }); haze(c, 1600, 160, '#FFB070', .35); });
  plane(c, cam, 1, (c) => {
    fireRing(c, 545, 1110, 470, t, easeOut(seg(u, .2, .9)));
    figure(c, (f) => fillPath(f, 'M -100 1600 C 100 1582 300 1566 420 1564 L 720 1564 C 840 1566 1000 1576 1180 1592 L 1180 2100 L -100 2100 Z', '#1C111B'), { edge: { col: '#FFC98A', w: 2.5, a: .6 }, grade: [[1560, 'rgba(120,60,40,.55)'], [1900, 'rgba(0,0,0,0)']] });
    figure(c, (f) => { f.translate(560, 1570); f.scale(.74, .74); nataraja(f, { t, col: '#1E1420' }); },
      { edge: { col: '#FFD9A0', w: 2.6, a: .85 }, rim: { col: '#FFF0C8', dx: 0, dy: -4, a: .7, blur: 1 } });
    glow(c, 560 + 252 * .74, 1570 - 950 * .74, 100, '#FFB050', .7);
  });
  plane(c, cam, 1.2, (c) => motes(c, { n: 70, seed: 17, box: [-100, 300, W + 100, 1900], r: 3, col: '#FFD9A0', a: .7, vx: 10, vy: -45, t }));
} });

// ---------- shot 13: the card (Thank You Sale, 11 Oct 2026) ----------
SHOTS.push({ a: TL.card, b: TL.end + 1, xf: .6, draw(c, u, t) {
  rkCardCine(c, u, t, { title: 'THANK YOU SALE', line: "Shailputri's story is Book 1", price: 'Books 1–3 for ₹400', note: 'Sale ends TONIGHT · 11 Oct, midnight' });
} });

// ---------- flashes between shots ----------
POST.push((c, t) => {
  if (t > 10.45 && t < 12) flash(c, t < 10.7 ? ease(seg(t, 10.45, 10.7)) : Math.exp(-(t - 10.7) * 4.5), '#FFF4E0', 'source-over');   // the third eye's white-out
  if (t > TL.burn - .3 && t < TL.burn + 2) flash(c, t < TL.burn + .25 ? ease(seg(t, TL.burn - .3, TL.burn + .25)) : Math.exp(-(t - TL.burn - .25) * 3.5), '#FFE2B0', 'source-over');   // she is gone
  if (t > TL.hit - .1 && t < TL.hit + 2) flash(c, t < TL.hit + .15 ? ease(seg(t, TL.hit - .1, TL.hit + .15)) : Math.exp(-(t - TL.hit - .15) * 4), '#FFE6A8', 'source-over');   // the chakra strikes
});

// ---------- captions (read at about 2.2–3 s a line; names in gold) ----------
say(-.35, 1.9, 'There is one dance', { y: 720 });
say(1.9, 4.0, 'that even the *gods* fear.', { y: 720 });
say(4.15, 5.9, "*Shiva's* *Tandava*.", { y: 1190, size: 66 });
say(5.9, 8.0, 'When he dances in *rage*,', { y: 1190 });
say(8.15, 10.4, 'worlds end.', { y: 1450, size: 72 });
say(11.0, 13.1, 'He danced it like that only *once*.', { y: 720 });
say(13.1, 15.4, 'For *Sati*, his wife.', { y: 720, size: 66 });
say(15.6, 18.0, 'Her father *Daksha* held a great yagna', { y: 720 });
say(18.0, 20.6, 'and insulted *Shiva* in front of everyone.', { y: 720 });
say(20.9, 23.0, 'Sati could not bear it.', { y: 700 });
say(23.0, 25.4, 'She gave up her body in the fire.', { y: 700 });
say(25.8, 28.0, 'Shiva lifted her body', { y: 520 });
say(28.0, 30.6, 'and danced the *Rudra* *Tandava*.', { y: 520, size: 62 });
say(30.6, 32.9, 'The universe began to *end*.', { y: 520 });
say(33.1, 36.0, 'To stop him, *Vishnu* sent the *Sudarshan* *Chakra*.', { y: 1400 });
say(36.3, 39.2, 'Where her body fell, 51 places became holy:', { y: 560 });
say(39.2, 41.5, 'the *Shakti* *Peethas*.', { y: 560, size: 72 });
say(41.7, 44.3, 'Shiva sat in silence for ages,', { y: 720 });
say(44.6, 46.6, 'until she came back', { y: 560 });
say(46.6, 49.4, 'as *Shailputri*, daughter of the mountains.', { y: 560 });
say(49.7, 51.8, 'And he danced again.', { y: 520 });
say(51.8, 53.9, 'This time, in *joy*.', { y: 520, size: 70 });
say(54.0, 56.9, 'Is there a *Shakti* *Peeth* | near YOU? | Comment your city!', { y: 540, size: 62 });
