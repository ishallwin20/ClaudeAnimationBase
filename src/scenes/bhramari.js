// bhramari.js: "No creature with 2 legs or 4 legs could kill him. Maa Durga's answer? SIX LEGS." (reel/bhramari-bees),
// in the Cinematic style (src/cine.js), with a Sarvam voiceover. The Devi Bhagavata Purana's story of Arunasura: his
// 40,000 years of tapas, Brahma's boon (no weapon, nothing with two legs or four), heaven taken, the Gayatri as his
// shield and Brihaspati getting him to drop it, the gods' prayer, one bee ("count its legs"), the Devi as Bhramari, the
// swarm, the empty throne, Srisailam, the place call-out and a follow card. Times are in TL (src/scenes/bhramari_tl.js,
// from the voice in VO); tools/bhramari_sfx.mjs uses the same ones.

// ---------- shared pieces ----------
const STORM = { tint: ['#2A0A10', .2], edge: { col: '#FF9A6A', w: 2.4, a: .7 }, rim: { col: '#FFB08A', dx: 0, dy: -5, a: .8, blur: 1 } };
const VIOLET = { tint: ['#1A0A28', .12], edge: { col: '#FFD9A0', w: 2.4, a: .7 }, rim: { col: '#FFE6B0', dx: 6, dy: -3, a: .8, blur: 1 } };
const GOLDLIT = { tint: ['#2A1606', .3], edge: { col: '#FFD890', w: 2.4, a: .8 }, rim: { col: '#FFF0C8', dx: 0, dy: -6, a: .9, blur: 1 } };
const redSky = (c) => { sky(c, [[0, '#12040A'], [600, '#3A0A12'], [1200, '#8A1E16'], [1650, '#D0461E']]); glow(c, 540, 1650, 1000, '#FF5A1E', .45); };
const violetSky = (c, t) => { sky(c, [[0, '#08040F'], [700, '#1A0C2A'], [1300, '#3A1A48'], [1900, '#2A1230']]); glow(c, 540, 700, 700, '#C08AFF', .18); stars(c, 90, 11, t, .7); };
const shake = (t, k) => ({ x: Math.sin(t * 53) * k, y: Math.cos(t * 41) * k });
// the demon on his throne, in the figure's own light
const onThrone = (c, x, y, k, o, fx) => figure(c, (f) => { f.translate(x, y); f.scale(k, k); throne(f, { layer: 'back' }); arunasura(f, o); throne(f, { layer: 'front' }); }, fx);
// the Gayatri mantra, as the clusters a ring of letters is made of
const GAYATRI = ['ॐ भूर्भुवः स्वः', 'तत्सवितुर्वरेण्यं', 'भर्गो देवस्य धीमहि', 'धियो यो नः प्रचोदयात्'];
const GLYPHS = [...new Intl.Segmenter('hi', { granularity: 'grapheme' }).segment(GAYATRI.join(' · '))].map(s => s.segment).filter(s => s.trim());
// the three seals of the boon: a sword, two footprints, four hoofprints, drawn in a disc at (0, 0), r 40
function sealGlyph(c, i, col) {
  if (i === 0) { fillPath(c, 'M -4 22 L -4 -26 L 0 -34 L 4 -26 L 4 22 Z', col); fillPath(c, 'M -16 16 L 16 16 L 16 21 L -16 21 Z', col); fillPath(c, 'M -3 21 L 3 21 L 3 32 L -3 32 Z', col); }
  else if (i === 1) for (const s of [-1, 1]) { ellipse(c, s * 11, 4 - s * 6, 8, 15, col, s * .15); for (let k = 0; k < 4; k++) ellipse(c, s * 11 + (k - 1.5) * 4, -14 - s * 6 - Math.abs(k - 1.5) * -1.5, 2.4, 2.8, col); }
  else for (let k = 0; k < 4; k++) { const x = (k % 2 ? 1 : -1) * 13, y = (k < 2 ? -12 : 14); for (const s of [-1, 1]) { c.save(); c.translate(x + s * 3.5, y); fillPath(c, `M 0 -8 C ${s * 6} -8 ${s * 6} 8 0 8 Z`, col); c.restore(); } }
}
const CAPY = { hook1: 1340, hook2: 1340, boon: 860, shield1: 1430, shield2: 1430, pray: 980, abee: 560, count: 560, six: 560, ask: 560, swarm1: 520, swarm2: 520, gone1: 1000, gone2: 1000 };

// ---------- shot 1: the hook. Arunasura on his throne in a red storm, laughing; a gold bee zips past ----------
SHOTS.push({ a: TL.hook, b: TL.tapas + .45, draw(c, u, t) {
  const f1 = strikes(t, [TL.strike1]), f2 = strikes(t, [TL.strike2]), cam = { z: lerp(1.0, 1.12, easeIO(u / 5.5)), fx: 540, fy: 1050 };
  plane(c, cam, 0, (c) => redSky(c));
  plane(c, cam, .1, (c) => { clouds(c, [[100, 300, 820, 31, 22], [800, 520, 760, 32, 30, true], [300, 760, 900, 33, 18]], t, PALETTES.red, .85); bolt(c, 200, -40, 330, 860, 7, f1); bolt(c, 900, -40, 760, 820, 11, f2); });
  plane(c, cam, .4, (c) => { ridge(c, 1700, 80, 31, '#12050A'); haze(c, 1680, 260, '#8A2A1A', .45); });
  plane(c, cam, 1, (c) => onThrone(c, 540, 1720, 1.1, { t, expr: 'laugh', lean: -.05 + .02 * Math.sin(t * 9) }, { ...STORM, rim: { ...STORM.rim, a: .8 + (f1 + f2) * 1.2 } }));
  plane(c, cam, 1.25, (c) => {
    motes(c, { n: 40, seed: 5, box: [-100, 300, W + 100, 1900], r: 3, col: '#FFB060', a: .6, vx: 40, vy: -60, t });
    const k = seg(t, TL.gbee, TL.gbee + .95);
    if (k > 0 && k < 1) { const x = lerp(-80, 1160, easeIO(k)), y = 1720 - 160 * Math.sin(Math.PI * k);
      for (let i = 1; i < 8; i++) { const kk = clamp(k - i * .02), xx = lerp(-80, 1160, easeIO(kk)), yy = 1720 - 160 * Math.sin(Math.PI * kk); glow(c, xx, yy, 110 - i * 10, '#FFC860', .4 - i * .045); }
      glow(c, x, y, 260, '#FFC860', .7); flyBee(c, x, y, 6.5, 1, t, 0, true); }
  });
} });

// ---------- shot 2: the tapas. Forty thousand years in a desert: days racing, leaves, water, air, nothing ----------
SHOTS.push({ a: TL.tapas, b: TL.boon + .45, xf: .5, draw(c, u, t) {
  const p = Math.max(0, (t - TL.tapas - .8) / 1.4), still = ease(seg(t, TL.nothing - .2, TL.nothing + .8));
  const sun = frac(p), day = Math.max(0, Math.sin(Math.PI * sun)) * (1 - still) * (p > 0 ? 1 : .55);
  const cam = { z: lerp(1.0, 1.1, easeIO(u / 8.6)), fx: 540, fy: 1500 };
  plane(c, cam, 0, (c) => {
    sky(c, [[0, mixCol('#070814', '#3A2A5A', day)], [800, mixCol('#141428', '#C9663D', day)], [1400, mixCol('#2A2038', '#FFCF86', day)]]);
    stars(c, 140, 4, t, 1 - day);
    if (day > .02) { const sx = lerp(-80, 1160, sun), sy = 1300 - 760 * Math.sin(Math.PI * sun); glow(c, sx, sy, 500, '#FFB45A', .5 * day); ellipse(c, sx, sy, 70, 70, '#FFE9B8'); }
    const m = frac(p + .5), mx = lerp(-80, 1160, m), my = 1300 - 760 * Math.sin(Math.PI * m);
    if (p > 0 && Math.sin(Math.PI * m) > 0 && still < 1) { glow(c, mx, my, 300, '#9FB4E6', .3 * (1 - day)); ellipse(c, mx, my, 40, 40, '#E6ECF6'); }
    if (still > 0) { glow(c, 760, 520, 420, '#9FB4E6', .3 * still); ellipse(c, 760, 520, 44, 44, rgba('#E6ECF6', still)); }
  });
  plane(c, cam, .4, (c) => { ridge(c, 1400, 70, 5, mixCol('#140C14', '#5A2E28', day)); haze(c, 1420, 240, mixCol('#2A2038', '#E8A06C', day), .4); });
  plane(c, cam, 1, (c) => {
    fillPath(c, 'M -200 1560 C 200 1520 800 1520 1280 1570 L 1280 2400 L -200 2400 Z', mixCol('#0C0810', '#2A1410', day));
    if (still > 0) glow(c, 540, 1500, 420, '#FFC860', .25 * still);
    figure(c, (f) => { f.translate(540, 1640); f.scale(.82, .82); arunasura(f, { t, pose: 'tapas', expr: 'chant' }); }, { ...LIGHTS.dawnBack, tint: ['#1A0A10', .8 - .1 * day] });
    // leaves falling, a drop and its ripples, a gust
    const lf = t - TL.leaves;
    if (lf > -.3 && lf < 2.4) for (let i = 0; i < 7; i++) { const tt = lf + .3 - i * .12; if (tt < 0) continue; const x = 360 + i * 60 + Math.sin(tt * 3 + i) * 40, y = 1050 + tt * 260, a = clamp(1 - (tt - 1.6) / .6);
      c.save(); c.translate(x, y); c.rotate(Math.sin(tt * 4 + i) * .9); c.globalAlpha = a; fillPath(c, 'M 0 -30 C 19 -16 19 16 0 30 C -19 16 -19 -16 0 -30 Z', i % 2 ? '#B07A3A' : '#8A5226'); strokePath(c, 'M 0 -28 L 0 28', '#5A3418', 2); c.restore(); }
    const wd = t - TL.water;
    if (wd > -.45 && wd < 0) ellipse(c, 540, lerp(1150, 1600, (wd + .45) / .45), 6, 10, '#A8C8F0');
    if (wd >= 0 && wd < 2) for (let i = 0; i < 3; i++) { const r = (wd - i * .25) * 220; if (r > 0) { c.strokeStyle = rgba('#C8DCFF', .7 * clamp(1 - r / 440)); c.lineWidth = 3; c.beginPath(); c.ellipse(540, 1610, r, r * .22, 0, 0, TAU); c.stroke(); } }
    const ad = t - TL.air;
    if (ad > 0 && ad < 1.6) motes(c, { n: 40, seed: 8, box: [-200, 900, W + 200, 1700], r: 2.5, col: '#E8D8C0', a: .6 * clamp(1 - ad / 1.6), vx: 1100, vy: 0, t });
  });
  plane(c, cam, 1.1, (c) => stotram(c, GAYATRI, 540, 960, t, TL.tapas + .5, { size: 40, gap: 1.6, rise: 30, fade: 3, maxW: 860 }));
} });

// ---------- shot 3: the boon. Brahma's lotus of light; three seals lock round him ----------
const SEAL_T = () => [TL.seal1, TL.seal2, TL.seal3];
SHOTS.push({ a: TL.boon, b: TL.heaven + .45, xf: .5, draw(c, u, t) {
  const open = ease(seg(t, TL.lotus - .2, TL.lotus + .9)), cam = { z: lerp(1.0, 1.08, easeIO(u / 4.6)), fx: 540, fy: 1200 };
  plane(c, cam, 0, (c) => { sky(c, [[0, '#050308'], [900, '#1A0E08'], [1500, '#4A2A10'], [1920, '#120804']]); stars(c, 80, 9, t, .6); });
  plane(c, cam, .1, (c) => { lotusLight(c, 540, 470, 120, t, open); rays(c, 540, 470, { n: 9, dir: Math.PI / 2, spread: .5, len: 1600, w: 320, col: '#FFD890', a: .2 * open, t, seed: 4 }); });
  plane(c, cam, 1, (c) => {
    fillPath(c, 'M -200 1760 C 200 1730 800 1730 1280 1770 L 1280 2400 L -200 2400 Z', '#0E0806');
    glow(c, 540, 1500, 500, '#FFC860', .25 * open);
    figure(c, (f) => { f.translate(540, 1760); f.scale(.8, .8); arunasura(f, { t, pose: 'tapas', expr: t > TL.seal3 + .3 ? 'smirk' : 'calm', eyes: 1 }); }, GOLDLIT);
    // the seals: a ring each, closing in and locking, its glyph riding the ring
    SEAL_T().forEach((t0, i) => {
      const k = easeOut(seg(t, t0, t0 + .4)); if (k <= 0) return;
      const rx = [290, 350, 410][i] * lerp(1.8, 1, k), ry = rx * .26, cy = 1480 - i * 40, a = k * (.75 + .25 * Math.sin(t * 3 + i));
      c.save(); c.globalCompositeOperation = 'lighter';
      c.strokeStyle = rgba('#FFD27A', .8 * a); c.lineWidth = 5; c.beginPath(); c.ellipse(540, cy, rx, ry, 0, 0, TAU); c.stroke();
      c.strokeStyle = rgba('#FFF2C8', .5 * a); c.lineWidth = 1.6; c.beginPath(); c.ellipse(540, cy, rx - 12, ry - 4, 0, 0, TAU); c.stroke();
      c.restore();
      const ang = t * .7 + i * 2.1, gx = 540 + Math.cos(ang) * rx, gy = cy + Math.sin(ang) * ry;
      glow(c, gx, gy, 90, '#FFC860', .55 * a); ellipse(c, gx, gy, 42, 42, rgba('#2A1606', .9 * a));
      c.save(); c.translate(gx, gy); c.globalAlpha = a; c.strokeStyle = '#FFD27A'; c.lineWidth = 3; c.beginPath(); c.arc(0, 0, 40, 0, TAU); c.stroke(); sealGlyph(c, i, '#FFE6A0'); c.restore();
    });
  });
} });

// ---------- shot 4: heaven falls. Amaravati burns in the clouds, the gods tumble; the demon watches ----------
SHOTS.push({ a: TL.heaven, b: TL.shield + .45, xf: .5, draw(c, u, t) {
  const burn = ease(seg(t, TL.heaven, TL.heaven + 1.6)), cam = { z: lerp(1.04, 1.12, easeIO(u / 3.8)), fx: 600, fy: 1100, ...shake(t, 3 * burn) };
  plane(c, cam, 0, (c) => { redSky(c); });
  plane(c, cam, .2, (c) => { clouds(c, [[0, 600, 800, 41, 12], [700, 700, 760, 42, 16, true]], t, PALETTES.red, .7); });
  plane(c, cam, .5, (c) => { lanka(c, 1250, t, burn, 13); clouds(c, [[-60, 1330, 900, 43, 20], [520, 1380, 900, 44, 26, true], [1060, 1320, 800, 45, 22]], t, PALETTES.red, 1); embers(c, 540, 1250, t, 70, 6, 1000, 1100); });
  plane(c, cam, .8, (c) => {
    for (let i = 0; i < 10; i++) { const tt = t - TL.storm - i * .16; if (tt < 0) continue; const x = 220 + hash(i * 3.1) * 700 + tt * (hash(i) - .5) * 160, y = 1240 + tt * tt * 280 + tt * 120;
      figure(c, (f) => { f.translate(x, y); f.rotate(tt * (hash(i * 5) - .5) * 3); f.scale(.24, .24); rishi(f, { t, pose: 'stand', col: '#140608' }); glow(f, 0, -880, 120, '#FFD890', .6); }, { edge: { col: '#FF9A6A', w: 1.6, a: .8 } }); }
  });
  plane(c, cam, 1, (c) => figure(c, (f) => { f.translate(250, 1760); f.scale(2.2, 2.2); f.translate(0, 815); asuraHead(f, { t, expr: 'laugh', look: [.6, -1] }); }, { ...LIGHTS.storm, tint: ['#140810', .86] }));
} });

// ---------- shot 5: the shield. He chants in a ring of Gayatri letters; Brihaspati comes; the letters fall ----------
SHOTS.push({ a: TL.shield, b: TL.pray + .45, xf: .5, draw(c, u, t) {
  const dropK = seg(t, TL.drop, TL.drop + 1.6), cam = { z: lerp(1.0, 1.1, easeIO(u / 5)), fx: 540, fy: 1150 }, bri = ease(seg(t, TL.brihas - .3, TL.brihas + .4));
  const ring = (front) => {
    c.save(); c.font = '46px "Tiro Devanagari Sanskrit"'; c.textAlign = 'center'; c.textBaseline = 'middle';
    GLYPHS.forEach((g, i) => {
      const ang = i / GLYPHS.length * TAU + t * .35, z = Math.sin(ang); if ((z > 0) !== front) return;
      let x = 540 + Math.cos(ang) * 430, y = 1010 + z * 130, a = (front ? 1 : .45) * (1 - dropK * .2);
      const fall = t - TL.drop - hash(i * 3.3) * .5;
      if (fall > 0) { y += fall * fall * 900; x += (hash(i) - .5) * fall * 200; a *= clamp(1 - fall / 1.1) * (Math.sin(fall * 40 + i) > -.3 ? 1 : .3); }
      if (a <= 0) return;
      c.globalAlpha = a; c.shadowColor = 'rgba(255,170,60,.9)'; c.shadowBlur = 22; c.fillStyle = '#FFE2A0'; c.fillText(g, x, y);
    });
    c.restore();
  };
  plane(c, cam, 0, (c) => violetSky(c, t));
  plane(c, cam, .3, (c) => { pillars(c, 520, 1800, 540, '#140A1C', t, 6, 60); haze(c, 1700, 300, '#3A1A48', .5); });
  plane(c, cam, 1, (c) => {
    glow(c, 540, 1010, 560, '#FFB45A', .3 * (1 - dropK));
    ring(false);
    onThrone(c, 540, 1760, 1.0, { t, expr: t < TL.drop + .4 ? 'chant' : 'smirk', arms: t < TL.drop + .4 ? 'namaste' : 'rest' }, VIOLET);
    ring(true);
    if (bri > 0) figure(c, (f) => { f.translate(870, 1800); f.scale(.95, .95); rishi(f, { t, pose: 'point', col: '#0E0812' }); }, { ...LIGHTS.moonSilhouette, alpha: bri, rim: { ...LIGHTS.moonSilhouette.rim, dx: -4 } });
  });
} });

// ---------- shot 6: the gods pray at night; a point of gold appears in the dark ----------
SHOTS.push({ a: TL.pray, b: TL.beeIn + .45, xf: .5, draw(c, u, t) {
  const sp = ease(seg(t, TL.spark, TL.spark + .6)), near = ease(seg(t, TL.spark + .4, TL.beeIn + .45)), cam = { z: lerp(1.0, 1.06, easeIO(u / 3.4)), fx: 700, fy: 640 };
  plane(c, cam, 0, (c) => { violetSky(c, t); });
  plane(c, cam, .2, (c) => clouds(c, [[100, 1250, 900, 51, 8], [800, 1300, 800, 52, 10, true]], t, PALETTES.nightFar, .8));
  plane(c, cam, .1, (c) => { if (sp > 0) { const x = lerp(700, 620, near), y = lerp(640, 760, near), r = lerp(1, 4, near);
    glow(c, x, y, 140 * r * sp, '#FFC860', .7 * sp); ellipse(c, x, y, 5 * r * sp, 5 * r * sp, '#FFF6D8');
    rays(c, x, y, { n: 6, dir: 0, spread: TAU, len: 140 * r * sp, w: 18, col: '#FFE6A0', a: .5 * sp, t }); } });
  plane(c, cam, 1, (c) => {
    fillPath(c, 'M -200 1560 C 200 1520 800 1520 1280 1560 L 1280 2400 L -200 2400 Z', '#0C0814');
    for (let i = 0; i < 7; i++) { const x = lerp(-40, 1120, (i + .5) / 7) + (hash(i + 4) - .5) * 28; glow(c, x, 1480 - 70 * 1.8, 120, '#FFE0A0', .35); c.strokeStyle = 'rgba(255,224,160,.55)'; c.lineWidth = 3; c.beginPath(); c.arc(x, 1480 - 64 * 1.8, 62, 0, TAU); c.stroke(); }
    figure(c, (f) => crowd(f, -40, 1120, 1600, 7, 1.8, t, 0, '#0A0610', 4), { edge: { col: '#C9B8F5', w: 1.8, a: .55 }, rim: { col: '#E8DCFF', dx: 3, dy: -3, a: .8 } });
  });
} });

// ---------- shot 7: THE BEE. It lands on the throne's arm; he laughs; "count its legs": six ----------
SHOTS.push({ a: TL.beeIn, b: TL.devi + .45, xf: .45, draw(c, u, t) {
  const land = ease(seg(t, TL.beeIn, TL.land)), push = easeIO(seg(t, TL.count, TL.six + .3)), cam = { z: lerp(1.0, 1.38, push), fx: 540, fy: 1220 };
  const dark = ease(seg(t, TL.count, TL.count + 1.2)), six = seg(t, TL.six, TL.six + .25);
  // the demon's face behind, out of focus, laughing; it falls into the dark as the counting begins
  plane(c, cam, 0, (c) => { sky(c, [[0, '#14050A'], [1100, '#2A0A10'], [1920, '#0A0306']]); glow(c, 540, 700, 800, '#FF5A1E', .25 * (1 - dark) + .3 * six); });
  plane(c, cam, .25, (c) => {
    const d = DEPTH++, l = scratch('bgface' + d);
    figure(l, (f) => { f.translate(540, 700); f.scale(3.6, 3.6); f.translate(0, 815); asuraHead(f, { t, expr: t < TL.count ? 'laugh' : 'calm', look: [0, 1] }); }, STORM);
    blit(c, l.canvas, 1 - .75 * dark, 'source-over', 'blur(9px) brightness(.75)'); DEPTH--;
  });
  plane(c, cam, 1, (c) => {
    // the throne's arm: dark stone, its lit edge, carved bands
    const SLAB = 'M -200 1120 C 200 1100 800 1100 1280 1120 L 1280 2400 L -200 2400 Z';
    fillPath(c, SLAB, '#140E14');
    inside(c, SLAB, () => { for (let i = 0; i < 5; i++) strokePath(c, `M -200 ${1200 + i * 120} C 300 ${1180 + i * 122} 800 ${1180 + i * 122} 1280 ${1200 + i * 120}`, rgba('#FF9A6A', .06), 3); });
    strokePath(c, 'M -200 1120 C 200 1100 800 1100 1280 1120', rgba('#FF9A6A', .5), 3);
    // the bee flies in and lands
    const bx = lerp(1180, 540, easeOut(land)) + (1 - land) * Math.sin(t * 7) * 60, by = lerp(380, 1250, easeIO(land)) + (1 - land) * Math.sin(t * 9) * 40;
    const lit = TL.legs.reduce((s, t0) => s + seg(t, t0, t0 + .15), 0), k = 1.25;
    if (land < 1) ellipse(c, bx, 1250, 120 * land, 22 * land, 'rgba(0,0,0,.35)');
    else ellipse(c, 540, 1258, 150, 30, 'rgba(0,0,0,.45)');
    bee(c, bx, by, { k, t, rot: -.12 + (1 - land) * .4, wings: t < TL.land + .35 ? 1 : 0, lit, gold: six });
    // the count: a number by each leg as it lights
    const FEET = [[-104, -150], [-140, -40], [-120, 110], [104, -150], [140, -40], [120, 110]], rot = -.12;
    FEET.forEach(([fx, fy], i) => {
      const s = t - TL.legs[i]; if (s < 0) return;
      const x = bx + (fx * Math.cos(rot) - fy * Math.sin(rot)) * k * 1.35, y = by + (fx * Math.sin(rot) + fy * Math.cos(rot)) * k * 1.35;
      text(c, String(i + 1), x, y, '700 46px Cinzel', '#FFE2A0', { pop: s, glow: ['rgba(255,180,60,.9)', 22] });
    });
  });
} });

// ---------- shot 8: Bhramari. The bees in the dark gather into the Devi; then her face, her eyes opening gold ----------
const DEVI_AT = { x: 540, y: 1880, k: 1.45 };
const deviPts = () => shapePoints('devi', (g) => { g.translate(DEVI_AT.x, DEVI_AT.y); g.scale(DEVI_AT.k, DEVI_AT.k); devi(g, { t: 0, bees: 0, wind: .35 }); }, 2600, 7);
SHOTS.push({ a: TL.devi, b: TL.face + .45, xf: .4, draw(c, u, t) {
  const g = seg(t, TL.devi, TL.formed), show = ease(seg(t, TL.formed - .7, TL.formed + .5)), cam = { z: lerp(1.06, 1.0, easeOut(u / 3)), fx: 540, fy: 1000 };
  plane(c, cam, 0, (c) => { violetSky(c, t); glow(c, 540, 1000, 900, '#FFC860', .25 * show); });
  plane(c, cam, 1, (c) => {
    if (show > 0) figure(c, (f) => { f.translate(DEVI_AT.x, DEVI_AT.y); f.scale(DEVI_AT.k, DEVI_AT.k); devi(f, { t, bees: show, wind: .35, eyes: .2 }); }, { ...VIOLET, alpha: show });
    swarm(c, t, { mode: 'form', n: 2600, from: [-400, -300, 1480, 2300], pts: deviPts(), gather: g, k: .55, gold: .4, seed: 21, jit: 3, a: 1 - .65 * show, dots: true });
  });
} });
SHOTS.push({ a: TL.face, b: TL.swarm + .45, xf: .35, draw(c, u, t) {
  const op = ease(seg(t, TL.eyes - .55, TL.eyes)), fire = ease(seg(t, TL.eyes, TL.eyes + .4)), cam = { z: lerp(1.0, 1.1, easeIO(u / 4.4)), fx: 540, fy: 820 };
  plane(c, cam, 0, (c) => { sky(c, [[0, '#0A0512'], [1900, '#24102E']]); glow(c, 540, 820, 800, '#FFC860', .15 + .25 * fire); });
  plane(c, cam, .6, (c) => beeCloud(c, 540, 820, 560, t, { n: 70, seed: 4, k: 1.7, gold: .55, speed: .6 }));
  plane(c, cam, 1, (c) => figure(c, (f) => { f.translate(540, 860); f.scale(6.0, 6.0); f.translate(0, 815); deviHead(f, { t, eyes: lerp(.15, 1, op), fire, look: [0, lerp(.8, 0, op)] }); },
    { tint: ['#1A0A28', .1], edge: { col: '#FFD9A0', w: 3, a: .35 }, rim: { col: '#FFE6B0', dx: 9, dy: -4, a: .7 + fire * .3, blur: 1.5 } }));
  plane(c, cam, 1.3, (c) => { for (const [x, y] of [[90, 640], [990, 760], [140, 1300], [960, 1380]]) beeCloud(c, x, y, 80, t, { n: 3, seed: x, k: 3, gold: .6, speed: .6 }); });
} });

// ---------- shot 9: the swarm. Rivers of bees from her hands into the army; then into him ----------
SHOTS.push({ a: TL.swarm, b: TL.engulf + .45, xf: .4, draw(c, u, t) {
  const more = ease(seg(t, TL.swarm, TL.millions + .6)), cam = { z: lerp(1.0, 1.08, easeIO(u / 3.8)), fx: 540, fy: 1200, ...shake(t, 2 * more) };
  plane(c, cam, 0, (c) => redSky(c));
  plane(c, cam, .2, (c) => clouds(c, [[200, 1500, 900, 61, 14], [900, 1560, 800, 62, 18, true]], t, PALETTES.red, .8));
  plane(c, cam, .6, (c) => figure(c, (f) => { f.translate(720, 1480); f.scale(.8, .8); devi(f, { t, bees: 1, wind: .8, eyes: 1, fire: 1 }); }, { tint: ['#2A0A10', .18], edge: { col: '#FFD9A0', w: 2.2, a: .8 }, rim: { col: '#FFE6B0', dx: -5, dy: -3, a: .8, blur: 1 } }));
  plane(c, cam, 1, (c) => {
    fillPath(c, 'M -200 1760 C 200 1730 600 1740 900 1780 L 1280 1820 L 1280 2400 L -200 2400 Z', '#0A0406');
    figure(c, (f) => { crowd(f, -60, 760, 1790, 9, 1.35, t, 1, '#0A0505', 5); for (let i = 0; i < 9; i++) { const x = lerp(-60, 760, (i + .5) / 9) + 30; strokePath(f, `M ${x} 1800 L ${x + 30} 1560`, '#0A0505', 6); fillPath(f, `M ${x + 30} 1540 L ${x + 40} 1570 L ${x + 22} 1566 Z`, '#0A0505'); } }, { edge: { col: '#FF9A6A', w: 1.8, a: .7 } });
    swarm(c, t, { mode: 'stream', n: Math.round(900 + 900 * more), path: [[518, 740], [320, 880], [190, 1250], [300, 1660]], spread: [40, 260], k: .7, speed: .35, seed: 31, gold: .2, dots: true });
    swarm(c, t, { mode: 'stream', n: Math.round(600 + 700 * more), path: [[922, 740], [1080, 980], [760, 1380], [420, 1720]], spread: [40, 240], k: .7, speed: .32, seed: 32, gold: .2, dots: true });
  });
} });
SHOTS.push({ a: TL.engulf, b: TL.gone + .45, xf: .3, draw(c, u, t) {
  const k = ease(seg(t, TL.engulf, TL.engulf + 1.6)), cam = { z: lerp(1.0, 1.1, easeIO(u / 2.8)), fx: 540, fy: 1150, ...shake(t, 4 + 6 * k) };
  plane(c, cam, 0, (c) => redSky(c));
  plane(c, cam, .4, (c) => { ridge(c, 1700, 80, 31, '#12050A'); });
  plane(c, cam, 1, (c) => {
    onThrone(c, 540, 1720, 1.05, { t, expr: 'scream', arms: 'up', lean: .04 }, STORM);
    swarm(c, t, { mode: 'stream', n: 900, path: [[-200, 200], [200, 500], [500, 1000]], spread: [120, 300], k: .8, speed: .5, seed: 41, gold: .15, dots: true });
    swarm(c, t, { mode: 'engulf', n: Math.round(400 + 2600 * k), x: 540, y: 1180, r: 420, ry: 620, k: .75, seed: 42, gold: .15, dots: true });
  });
} });

// ---------- shot 10: gone. The swarm lifts off an empty throne; the crown falls; one bee is left ----------
SHOTS.push({ a: TL.gone, b: TL.sri + .45, xf: .5, draw(c, u, t) {
  const lift = seg(t, TL.gone - .45, TL.gone + 2.2), cam = { z: lerp(1.1, 1.0, easeOut(u / 5)), fx: 540, fy: 1300 };
  plane(c, cam, 0, (c) => { sky(c, [[0, '#04070F'], [900, '#0E1630'], [1900, '#1A2340']]); stars(c, 100, 13, t, .7); glow(c, 760, 460, 420, '#9FB4E6', .3); ellipse(c, 760, 460, 40, 40, '#E6ECF6'); });
  plane(c, cam, 1, (c) => {
    fillPath(c, 'M -200 1720 L 1280 1720 L 1280 2400 L -200 2400 Z', '#070A12');
    figure(c, (f) => { f.translate(540, 1720); f.scale(1.05, 1.05); throne(f, { col: '#0E1220', sh: '#06080E', lit: '#9FB4E6' }); }, LIGHTS.moon);
    // the crown falls from where his head was to the floor and rocks to rest
    const cf = t - TL.crown, fall = clamp(cf / .7), y = cf < 0 ? 1032 : cf < .7 ? lerp(1032, 1640, fall * fall) : 1640 - Math.abs(Math.sin((cf - .7) * 9)) * 40 * Math.exp(-(cf - .7) * 4);
    const rot = cf < 0 ? 0 : cf < .7 ? fall * .3 : .3 + Math.sin((cf - .7) * 9) * .1 * Math.exp(-(cf - .7) * 3);
    figure(c, (f) => { f.translate(cf < 0 ? 540 : 540 + clamp(cf) * 140, y); f.rotate(rot); f.scale(1.0, 1.0); f.translate(0, 900); asuraHead(f, { crownOnly: true }); }, { edge: { col: '#D4E0FA', w: 2.4, a: .6 }, rim: { col: '#EAF1FF', dx: 5, dy: -4, a: .9, blur: 1 } });
    if (t > TL.crown + .7) glow(c, 680, 1600, 70, '#FF4A4A', .25);
    swarm(c, t, { mode: 'stream', n: Math.round(1600 * (1 - lift)), path: [[540, 1300], [600, 700], [900, 100], [1300, -300]], spread: [300, 500], k: .7, speed: .4, seed: 51, gold: .15, dots: true });
    // one bee
    const lb = ease(seg(t, TL.lone - .6, TL.lone + .8)), x = lerp(1150, 700, lb) + Math.sin(t * 4) * 18 * (1 - lb * .6), yy = lerp(900, 1560, lb) + Math.sin(t * 6) * 10;
    if (t > TL.lone - .6) { glow(c, x, yy, 90, '#FFC860', .4); flyBee(c, x, yy, 2.4, -1, t, 3, true); }
  });
} });

// ---------- shot 11: Srisailam at dawn; the bees go home into the temple ----------
SHOTS.push({ a: TL.sri, b: TL.ask + .45, xf: .6, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.1, easeIO(u / 4.4)), fx: 540, fy: 1300 };
  plane(c, cam, 0, (c) => { sky(c, [[0, '#24183A'], [560, '#5E2E4E'], [1000, '#C9663D'], [1380, '#FFCF86']]); glow(c, 780, 1240, 700, '#FFB45A', .5); ellipse(c, 780, 1240, 130, 130, '#FFE9B8'); });
  plane(c, cam, .3, (c) => { ridge(c, 1330, 120, 71, '#3A1E30'); ridge(c, 1430, 80, 72, '#24121E'); haze(c, 1420, 220, '#E8A06C', .35); });
  plane(c, cam, 1, (c) => {
    fillPath(c, 'M -200 1560 L 1280 1560 L 1280 2400 L -200 2400 Z', '#140A10');
    gopuram(c, 540, 1560, .85, { door: .75 });
    deepa(c, 330, 1560, .9, t, 1, 1); deepa(c, 750, 1560, .9, t, 1, 2);
    beeStream(c, [[1150, 700], [900, 900], [640, 1250], [540, 1470]], t, { n: 40, seed: 5, k: 1.3, spread: 60, speed: .3, gold: .7 });
    motes(c, { n: 40, seed: 7, box: [-100, 700, W + 100, 1900], r: 3, col: '#FFD890', a: .5, vx: -10, vy: -24, t });
  });
} });

// ---------- shot 12: the call-out. Bhramari, calm, with a halo of bees ----------
SHOTS.push({ a: TL.ask, b: TL.card + .5, xf: .5, draw(c, u, t) {
  const cam = { z: lerp(1.08, 1.0, easeOut(u / 3.6)), fx: 540, fy: 1100 };
  plane(c, cam, 0, (c) => { violetSky(c, t); glow(c, 540, 1020, 700, '#FFC860', .3); rays(c, 540, 1020, { n: 14, dir: -Math.PI / 2, spread: TAU, len: 900, w: 160, col: '#FFD890', a: .15, t, seed: 8 }); });
  plane(c, cam, .8, (c) => beeCloud(c, 540, 1020, 330, t, { n: 70, seed: 12, k: 1.3, gold: .7, speed: .5 }));
  plane(c, cam, 1, (c) => figure(c, (f) => { f.translate(540, 2100); f.scale(1.3, 1.3); devi(f, { t, bees: 1, wind: .3, eyes: 1 }); }, VIOLET));
} });

// ---------- shot 13: the follow card ----------
SHOTS.push({ a: TL.card, b: TL.end + 1, xf: .6, draw(c, u, t) {
  sky(c, [[0, '#04100E'], [900, '#0F2A27'], [1920, '#050E0C']]);
  glow(c, 520, 1000, 760, '#2E5F5A', .55, 'screen');
  motes(c, { n: 60, seed: 61, box: [-50, 300, W + 50, 1900], r: 3, col: '#F4C46A', a: .6, vx: 6, vy: -26, t });
  const X = 520, pk = (d) => u - d;
  picture(c, PICS.logo, X, 520, 132, 132, { pop: pk(.2), r: 66 });
  text(c, 'JAI MAA BHRAMARI', X, 668, '700 60px Cinzel', '#F4C46A', { pop: pk(.4), glow: ['rgba(244,196,106,.55)', 26], spacing: 3, maxW: 860 });
  const k = popK(pk(.6));
  if (k > .01) { glow(c, X, 1000, 300 * k, '#FFC870', .35); beeCloud(c, X, 900, 200 * k, t, { n: 24, seed: 3, k: .9, gold: .8 }); figure(c, (f) => { f.translate(X, 1212); f.scale(.37 * k, .37 * k); devi(f, { t, bees: .6 }); }, { tint: ['#0A1A18', .2], edge: { col: '#F4C46A', w: 2, a: .8 }, rim: { col: '#FFE8B0', dx: 3, dy: -2, a: .9 } }); }
  text(c, 'Stories of the Devi and the gods', X, 1265, '42px Marcellus', '#FBE0CF', { pop: pk(1.0), maxW: 840 });
  const kk = popK(pk(1.3)) * (1 + .03 * Math.max(0, Math.sin(t * 5)));
  if (kk > .01) { c.save(); c.translate(X, 1380); c.scale(kk, kk); c.fillStyle = '#F15A24'; c.shadowColor = 'rgba(241,90,36,.6)'; c.shadowBlur = 30; c.beginPath(); c.roundRect(-300, -48, 600, 96, 48); c.fill(); c.restore(); }
  text(c, 'Follow @therishikatha', X, 1383, '700 50px Poppins', '#FFFFFF', { pop: pk(1.3), maxW: 540 });
  text(c, 'rishikatha.com', X, 1478, '500 36px Poppins', '#CFE3DF', { pop: pk(1.6) });
} });

// ---------- flashes ----------
const pulse = (t, t0, up, down) => t < t0 - up || t > t0 + 3 ? 0 : t < t0 ? ease(seg(t, t0 - up, t0)) : Math.exp(-(t - t0) * down);
POST.push((c, t) => {
  flash(c, .22 * strikes(t, [TL.strike1, TL.strike2]), '#FFB08A');
  for (const t0 of SEAL_T()) flash(c, .22 * pulse(t, t0 + .3, .05, 5), '#FFD890');
  flash(c, .45 * pulse(t, TL.six, .05, 3.5), '#FFD27A');                       // SIX
  flash(c, .55 * pulse(t, TL.eyes, .08, 3), '#FFE2A0');                        // her eyes open
  flash(c, .4 * pulse(t, TL.engulf, .05, 3), '#FFFFFF');                       // the swarm hits him
  flash(c, .3 * pulse(t, TL.storm, .05, 4), '#FFB08A');                        // heaven stormed
});

// ---------- captions: the voice's karaoke chunks; the hook is lit at frame 0 ----------
VO.caps.forEach((k, i) => {
  const n = k.text.split(/\s+/).filter(w => w && w !== '|').length;
  say(i === 0 ? -.35 : k.a, Math.min(k.b, TL.card + .15), k.text, { at: i === 0 ? Array(n).fill(-.35) : k.at, y: CAPY[k.id] ?? k.y, size: k.size });
});
