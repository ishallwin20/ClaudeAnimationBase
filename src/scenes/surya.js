// surya.js: "The day the SUN went out" (ad/16-book4-sun), in the Cinematic style (src/cine.js), with a Sarvam
// voiceover. The Brahma Vaivarta Purana's story: Mali and Sumali, rakshasa devotees of Shiva, burned to ashes by Surya;
// Shiva's trishul strikes the sun; Surya falls unconscious and the world goes dark and cold; Kashyapa curses Shiva ("one
// day your son will lose his head", Ganesha's elephant head); then Book 4's answer, kept for the card: the goddess who
// steps out of the light and wraps the earth in warmth (Kushmanda). Times are in TL (src/scenes/surya_tl.js, from the
// voice in VO); tools/surya_sfx.mjs uses the same ones.

// ---------- shared pieces ----------
const STORM = { tint: ['#2A0A10', .2], edge: { col: '#FF9A6A', w: 2.4, a: .7 }, rim: { col: '#FFB08A', dx: 0, dy: -5, a: .8, blur: 1 } };
const SUNLIT = { tint: ['#3A1206', .12], edge: { col: '#FFF0C0', w: 2.4, a: .8 }, rim: { col: '#FFF6D8', dx: 0, dy: -6, a: .9, blur: 1 } };
const MALI = { skin: '#3E5A7A', skinSh: '#2A4060', skinDk: '#16243A', dhoti: '#5A1A1A', dhotiSh: '#2E0C0C' };   // Mali, slate blue; Sumali keeps Arunasura's red-brown
const coldSky = (c) => sky(c, [[0, '#03050A'], [800, '#0C1424'], [1300, '#1A2438'], [1920, '#0A0E18']]);
const shake = (t, k) => ({ x: Math.sin(t * 53) * k, y: Math.cos(t * 41) * k });
const pulse = (t, t0, up, down) => t < t0 - up || t > t0 + 3 ? 0 : t < t0 ? ease(seg(t, t0 - up, t0)) : Math.exp(-(t - t0) * down);
// the two brothers in tapas either side of the linga (x of the linga, ground y, scale); fx(i) = figure() options per brother
function brothers(c, t, x, y, k, fx) {
  [[x - 290 * k, MALI], [x + 290 * k, null]].forEach(([bx, pal], i) => { const f = fx(i); if (f.alpha === 0) return; figure(c, (g) => { g.translate(bx, y); g.scale(.62 * k, .62 * k); arunasura(g, { t: t + i, pose: 'tapas', arms: 'namaste', expr: f.expr || 'chant', pal, eyes: f.eyes ?? 1 }); }, f); });
}
const CAPY = { surya: 1470, fury: 1440, hurl: 1450, fell: 1440, curse1: 1400, curse2: 1400, ganesha: 1400, warm: 1400, ask: 480 };

// ---------- shot 1: the hook. A dead black sun over a frozen land ----------
SHOTS.push({ a: TL.hook, b: TL.mali + .45, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.1, easeIO(u / 4.8)), fx: 540, fy: 700 }, life = .25 * (1 - seg(t, 0, TL.sunOut + .3));
  plane(c, cam, 0, (c) => { coldSky(c); stars(c, 90, 21, t, .5); });
  plane(c, cam, .05, (c) => sunDisc(c, 540, 690, 210, t, { life }));
  plane(c, cam, .3, (c) => { ridge(c, 1250, 140, 41, '#0C1220'); haze(c, 1240, 200, '#3A4A68', .35); ridge(c, 1330, 70, 42, '#080C16'); });
  plane(c, cam, 1, (c) => { fillPath(c, 'M -200 1360 C 200 1330 800 1340 1280 1370 L 1280 2400 L -200 2400 Z', '#121A2A'); frost(c, 1360, .9, t); huts(c, 120, 980, 1372, .7, 0, '#070A12'); });
  plane(c, cam, 1.2, (c) => motes(c, { n: 90, seed: 3, box: [-100, 0, W + 100, 1950], r: 3, col: '#DCE6FF', a: .5, vx: 50, vy: 90, t }));
} });

// ---------- shot 2: Mali and Sumali, devotees of Shiva, at a lamp-lit linga ----------
SHOTS.push({ a: TL.mali, b: TL.surya + .45, xf: .5, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.12, easeIO(u / 5.2)), fx: 540, fy: 1350 };
  plane(c, cam, 0, (c) => { sky(c, [[0, '#06040A'], [900, '#140A12'], [1500, '#2A1410']]); stars(c, 120, 5, t, .8); glow(c, 540, 1380, 700, '#FF9A40', .35); });
  plane(c, cam, .4, (c) => { ridge(c, 1450, 60, 7, '#0E0808'); });
  plane(c, cam, 1, (c) => {
    fillPath(c, 'M -200 1560 L 1280 1560 L 1280 2400 L -200 2400 Z', '#1A0E0A');
    linga(c, 540, 1590, .8, { glow: .7 }); deepa(c, 380, 1600, .8, t, 1, 1); deepa(c, 700, 1600, .8, t, 1, 2);
    brothers(c, t, 540, 1620, 1.1, () => LIGHTS.fire);
  });
  plane(c, cam, 1.2, (c) => embers(c, 540, 1600, t, 20, 5, 500, 700));
} });

// ---------- shot 3: Surya blazing in the sky ----------
SHOTS.push({ a: TL.surya, b: TL.burn + .35, xf: .4, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.1, easeIO(u / 2.4)), fx: 540, fy: 700 }, heat = seg(t, TL.surya, TL.blaze + .8);
  plane(c, cam, 0, (c) => sky(c, [[0, '#2A0806'], [700, '#9A3010'], [1300, '#E8702A'], [1920, '#FFB050']]));
  plane(c, cam, .1, (c) => sunDisc(c, 540, 700, 330 + 40 * heat, t, { life: 1 }));
  plane(c, cam, .4, (c) => { ridge(c, 1380, 90, 23, '#3A0E06'); haze(c, 1370, 160, '#FF8A3A', .25); });
  plane(c, cam, .7, (c) => { fillPath(c, 'M -200 1420 C 300 1400 800 1410 1280 1430 L 1280 2400 L -200 2400 Z', '#1E0804'); cracks(c, 540, 1460, heat, t, 6); });
  plane(c, cam, 1, (c) => figure(c, (f) => { f.translate(540, 1290); f.scale(.86, .86); surya(f, { t, eyes: 1, wind: .6 }); }, SUNLIT));
  plane(c, cam, 1.2, (c) => { motes(c, { n: 50, seed: 8, box: [-100, 200, W + 100, 1950], r: 3, col: '#FFE2A0', a: .6, vx: 0, vy: -80, t }); glow(c, 540, 700, 900, '#FFB050', .2 * heat); });
} });

// ---------- shot 4: the brothers burn to ashes ----------
SHOTS.push({ a: TL.burn, b: TL.fury + .35, xf: .2, draw(c, u, t) {
  const hot = seg(t, TL.burn, TL.burned + .5), ash = seg(t, TL.ashes - .1, TL.ashes + .6), gone = seg(t, TL.ashes + .4, TL.ashes + 1.2);
  const cam = { z: lerp(1.08, 1.16, easeIO(u / 2.2)), fx: 540, fy: 1400, ...shake(t, 6 * hot * (1 - gone)) };
  plane(c, cam, 0, (c) => { sky(c, [[0, '#FFE2A0'], [600, '#FF9A3A'], [1300, '#9A2A0A'], [1920, '#3A0C06']]); glow(c, 540, 0, 1100, '#FFF2C0', .8); });
  plane(c, cam, .4, (c) => ridge(c, 1380, 60, 7, '#3A1008'));
  plane(c, cam, 1, (c) => {
    fillPath(c, 'M -200 1420 C 300 1405 800 1405 1280 1420 L 1280 2400 L -200 2400 Z', '#1E0804'); cracks(c, 540, 1600, hot, t, 4);
    linga(c, 540, 1590, .8, { glow: 1, lit: '#FFE2A0' });
    brothers(c, t, 540, 1620, 1.1, () => ({ tint: [mixCol('#FFF2C0', '#4A4440', ash), lerp(.25 + .55 * hot, .95, ash)], edge: { col: ash ? '#C8B8A8' : '#FFF6D8', w: 2.4, a: .8 * (1 - gone) }, alpha: 1 - gone, expr: hot > .3 ? 'scream' : 'shock', eyes: 1 - ash }));
  });
  plane(c, cam, 1.2, (c) => {
    if (ash > 0) for (const x of [221, 859]) { motes(c, { n: 60, seed: x, box: [x - 160, 1100 - 400 * gone, x + 160, 1640], r: 4, col: '#8A8480', a: .8 * ash * (1 - seg(t, TL.ashes + 1.2, TL.fury + .3)), vx: 20, vy: -60, t }); embers(c, x, 1600, t, 30, x, 320, 700); }
    motes(c, { n: 60, seed: 2, box: [-100, 200, W + 100, 1950], r: 3, col: '#FFE2A0', a: .6, vx: 0, vy: -120, t });
  });
} });

// ---------- shot 5: Shiva's fury. His face; the eyes snap open, then the third eye ----------
SHOTS.push({ a: TL.fury, b: TL.hurl + .3, xf: .3, draw(c, u, t) {
  const eyes = ease(seg(t, TL.eyes, TL.eyes + .2)), third = ease(seg(t, TL.third - .1, TL.third + .5)), fl = strikes(t, [TL.third]);
  const cam = { z: lerp(1.0, 1.14, easeIO(u / 2.2)), fx: 540, fy: 820, ...shake(t, 4 * third) };
  plane(c, cam, 0, (c) => { sky(c, [[0, '#05070F'], [1900, '#1A2238']]); glow(c, 540, 820, 900, '#FF5A1E', .25 * third); });
  plane(c, cam, .2, (c) => { bolt(c, 120, -40, 260, 900, 5, fl); bolt(c, 980, -40, 820, 700, 9, fl * .7); });
  plane(c, cam, 1, (c) => {
    figure(c, (f) => { f.translate(540, 900); f.scale(6.6, 6.6); f.translate(0, 815); shivaHead(f, { t, eyes, third, look: [0, .2] }); }, { ...LIGHTS.moon, edge: { ...LIGHTS.moon.edge, w: 3, a: .3 }, rim: { ...LIGHTS.moon.rim, dx: 9, dy: -4, blur: 2, a: .8 + fl } });
    glow(c, 540, 900 - 38 * 6.6, 300 + 300 * third, '#FF7A2A', .5 * third);
  });
} });

// ---------- shot 6: the trishul thrown at the sun ----------
const TRI_A = [70, 1300], TRI_B = [800, 520];
SHOTS.push({ a: TL.hurl, b: TL.fell + .3, xf: .3, draw(c, u, t) {
  const k = easeIn(seg(t, TL.throw, TL.impact)), hit = t >= TL.impact, after = seg(t, TL.impact, TL.impact + .8);
  const cam = { z: lerp(1.0, 1.08, easeIO(u / 3)), fx: 700, fy: 700, ...shake(t, 14 * pulse(t, TL.impact, .02, 3)) };
  plane(c, cam, 0, (c) => { sky(c, [[0, '#0A0610'], [700, '#2A1028'], [1400, '#6A2A30'], [1920, '#2A0E12']]); stars(c, 60, 7, t, .5); });
  plane(c, cam, .1, (c) => { sunDisc(c, TRI_B[0], TRI_B[1], 150, t, { life: hit ? lerp(1, .55, after) : 1, crack: after }); shockRings(c, TRI_B[0], TRI_B[1], t, [TL.impact], '#FFE2B0'); });
  plane(c, cam, .3, (c) => { kailash(c, 260, 1240, 520, { rock: '#0C0810', snow: '#2A2434', snowSh: '#1A1622' }); haze(c, 1500, 260, '#5A2A3A', .4); });
  plane(c, cam, 1, (c) => {
    fillPath(c, 'M -200 1640 C 300 1600 800 1620 1280 1650 L 1280 2400 L -200 2400 Z', '#08050A');
    if (t > TL.throw && !hit) {
      const x = lerp(TRI_A[0], TRI_B[0], k), y = lerp(TRI_A[1], TRI_B[1], k), rot = Math.atan2(TRI_B[0] - TRI_A[0], -(TRI_B[1] - TRI_A[1]));
      for (let i = 1; i < 10; i++) { const kk = Math.max(0, k - i * .03); glow(c, lerp(TRI_A[0], TRI_B[0], kk), lerp(TRI_A[1], TRI_B[1], kk), 90 - i * 7, '#FFE6B0', .45 - i * .04); }
      glow(c, x, y, 160, '#FFF2C0', .8); trishulProp(c, x, y, .32, rot, { glow: 1 });
    }
  });
} });

// ---------- shot 7: Surya falls. His face, the eyes closing; then the sun drops out of the sky ----------
SHOTS.push({ a: TL.fell, b: TL.drop + .3, xf: .25, draw(c, u, t) {
  const eyes = 1 - ease(seg(t, TL.fell + .1, TL.closing + .6)), sink = easeIn(seg(t, TL.closing, TL.drop + .3));
  const cam = { z: lerp(1.04, 1.12, easeIO(u / 1.7)), r: .06 * sink, fx: 540, fy: 900 };
  plane(c, cam, 0, (c) => { sky(c, [[0, '#1A0604'], [1900, '#5A1A08']]); sunDisc(c, 540, 820, 560, t, { life: .55 * (1 - sink * .8), crack: 1 - sink }); });
  plane(c, cam, 1, (c) => figure(c, (f) => { f.translate(540, 900 + 140 * sink); f.rotate(.12 * sink); f.scale(6.2, 6.2); f.translate(0, 815); suryaHead(f, { t, eyes }); }, { tint: ['#2A0A04', .15 + .35 * sink], edge: { col: '#FFF0C0', w: 3, a: .4 * (1 - sink) }, rim: { col: '#FFF6D8', dx: 0, dy: -9, a: .8 * (1 - sink), blur: 1.5 } }));
} });
SHOTS.push({ a: TL.drop, b: TL.cold + .2, xf: .3, draw(c, u, t) {
  const fall = easeIn(seg(t, TL.drop, TL.dark - .1)), dark = ease(seg(t, TL.dark - .3, TL.dark + .5));
  const cam = { z: lerp(1.0, 1.06, easeIO(u / 2.3)), fx: 540, fy: 1100, ...shake(t, 10 * pulse(t, TL.dark - .1, .02, 3)) };
  plane(c, cam, 0, (c) => sky(c, [[0, mixCol('#2A1028', '#020306', dark)], [900, mixCol('#9A3A2A', '#06080E', dark)], [1350, mixCol('#E8803A', '#0C1220', dark)], [1920, mixCol('#3A1408', '#04060A', dark)]]));
  plane(c, cam, .1, (c) => { const y = lerp(460, 1500, fall); for (let i = 1; i < 8; i++) glow(c, 540 + i * 6, y - i * 60 * fall, 140 - i * 12, '#FF8A3A', .4 * (1 - dark)); sunDisc(c, 540, y, 150, t, { life: (1 - fall) * .6 + .1 * (1 - dark), crack: 1 }); });
  plane(c, cam, .4, (c) => { ridge(c, 1300, 120, 41, mixCol('#2A0E10', '#05070C', dark)); });
  plane(c, cam, 1, (c) => { fillPath(c, 'M -200 1420 C 200 1390 800 1400 1280 1430 L 1280 2400 L -200 2400 Z', mixCol('#1A0A08', '#080A12', dark)); huts(c, 100, 1000, 1432, .8, dark * .9, mixCol('#100606', '#06080E', dark)); });
} });

// ---------- shot 8: the cold. Frost creeping, the river freezing, the flowers dying, the lamps going out ----------
SHOTS.push({ a: TL.cold - .2, b: TL.curse + .45, xf: .4, draw(c, u, t) {
  const fr = ease(seg(t, TL.cold, TL.died + .5)), ice = ease(seg(t, TL.froze - .2, TL.froze + .9)), die = ease(seg(t, TL.died - 1, TL.died + .4)), lamps = 1 - ease(seg(t, TL.cold - .1, TL.cold + 1.2));
  const cam = { z: lerp(1.0, 1.12, easeIO(u / 5.4)), fx: 540, fy: 1500 };
  plane(c, cam, 0, (c) => { coldSky(c); stars(c, 70, 13, t, .4); sunDisc(c, 830, 470, 70, t, { life: 0 }); });
  plane(c, cam, .3, (c) => { ridge(c, 1180, 90, 13, '#0A101C'); haze(c, 1170, 160, '#2A3A58', .3); huts(c, 80, 1000, 1200, .6, lamps * .8, '#06090F'); });
  plane(c, cam, .6, (c) => { river(c, 1260, 200, t * (1 - ice), 540, mixCol('#0C1428', '#3A5070', ice)); if (ice > 0) { fillPath(c, 'M -200 1260 L 1280 1260 L 1280 1460 L -200 1460 Z', rgba('#CFE2F8', .3 * ice)); frost(c, 1260, ice * .6, t, { seed: 9 }); } });
  plane(c, cam, 1, (c) => { fillPath(c, 'M -200 1460 C 300 1440 800 1450 1280 1470 L 1280 2400 L -200 2400 Z', '#0E1420'); frost(c, 1460, fr, t); flowerBed(c, 60, 1020, 1720, 1.6, 1 - die * .4, die, t, 3); frost(c, 1700, fr * die * .6, t, { seed: 5 }); });
  plane(c, cam, 1.2, (c) => motes(c, { n: 40 + 100 * fr, seed: 4, box: [-100, 0, W + 100, 1950], r: 3, col: '#E6EEFF', a: .55, vx: 60, vy: 110, t }));
} });

// ---------- shot 9: Kashyapa curses Shiva ----------
SHOTS.push({ a: TL.curse, b: TL.ganesha + .45, xf: .45, draw(c, u, t) {
  const fl = strikes(t, [TL.cursed, TL.head]), push = easeIO(seg(t, TL.curse2 - .3, TL.ganesha));
  const cam = { z: lerp(1.0, 1.25, push) + .03 * easeIO(u / 3), fx: 700, fy: 900, ...shake(t, 6 * fl) };
  plane(c, cam, 0, (c) => { sky(c, [[0, '#06030C'], [800, '#1A0C2A'], [1400, '#3A1A48'], [1920, '#12081A']]); flash(c, fl * .25, '#B8A8FF'); });
  plane(c, cam, .15, (c) => { clouds(c, [[0, 300, 900, 51, 20], [500, 560, 800, 52, 30, true]], t, PALETTES.nightFar, .8); bolt(c, 260, -40, 380, 900, 13, strikes(t, [TL.cursed])); bolt(c, 980, -40, 860, 760, 17, strikes(t, [TL.head])); });
  plane(c, cam, .4, (c) => { ridge(c, 1500, 100, 51, '#0A0610'); haze(c, 1480, 200, '#4A2A5A', .3); });
  plane(c, cam, 1, (c) => {
    fillPath(c, 'M 380 1300 C 520 1270 760 1260 1000 1280 L 1280 1300 L 1280 2400 L 300 2400 C 360 2000 330 1600 380 1300 Z', '#06040A');   // the cliff
    figure(c, (f) => { f.translate(760, 1290); f.scale(.82, .82); rishi(f, { t, pose: 'point' }); }, { ...LIGHTS.moonSilhouette, edge: { col: '#D8C8FF', w: 2, a: .6 + fl * .4 }, rim: { col: '#EDE4FF', dx: -4, dy: -3, a: .9 } });
  });
  plane(c, cam, 1.2, (c) => motes(c, { n: 40, seed: 6, box: [-100, 0, W + 100, 1950], r: 3, col: '#DCD0FF', a: .4, vx: 90, vy: 60, t }));
} });

// ---------- shot 10: Ganesha, drawn in light ----------
SHOTS.push({ a: TL.ganesha, b: TL.plea + .45, xf: .45, draw(c, u, t) {
  const d = ease(seg(t, TL.gname - .5, TL.elephant + .9)), fill = ease(seg(t, TL.elephant, TL.elephant + 1));
  const cam = { z: lerp(1.0, 1.08, easeIO(u / 3.5)), fx: 540, fy: 820 };
  plane(c, cam, 0, (c) => { sky(c, [[0, '#050302'], [1000, '#120A04'], [1920, '#050302']]); glow(c, 540, 820, 700, '#FFB050', .15 + .2 * d); });
  plane(c, cam, 1, (c) => ganeshaLine(c, 540, 820, .9, d, { fill: fill * .7 }));
  plane(c, cam, 1.2, (c) => motes(c, { n: 50, seed: 9, box: [-100, 300, W + 100, 1700], r: 3, col: '#FFD890', a: .5 * d, vx: 0, vy: -30, t }));
} });

// ---------- shot 11: the plea. Shiva alone in the dark; a point of light ----------
SHOTS.push({ a: TL.plea, b: TL.warm + .4, xf: .45, draw(c, u, t) {
  const spark = ease(seg(t, TL.one - .2, TL.one + 1.2));
  const cam = { z: lerp(1.0, 1.1, easeIO(u / 4.6)), fx: 540, fy: 1000 };
  plane(c, cam, 0, (c) => { coldSky(c); stars(c, 110, 17, t, .6); });
  plane(c, cam, .1, (c) => { if (spark > 0) { glow(c, 540, 900, 80 + 260 * spark, '#FFE2A0', .9 * spark); ellipse(c, 540, 900, 6 + 14 * spark, 6 + 14 * spark, rgba('#FFFBEA', spark)); rays(c, 540, 900, { n: 10, dir: Math.PI / 2, spread: TAU, len: 500 * spark, w: 60, col: '#FFE2A0', a: .2 * spark, t, seed: 3 }); } });
  plane(c, cam, .3, (c) => { kailash(c, 540, 1000, 700, { rock: '#06080E', snow: '#141A26', snowSh: '#0C1018' }); haze(c, 1400, 260, '#1A2438', .5); });
  plane(c, cam, 1, (c) => { ledge(c, 520, 1560, '#05070C', '#8A9AC0', .3); frost(c, 1560, .5, t); figure(c, (f) => { f.translate(540, 1562); f.scale(.36, .36); shiva(f, { t, wind: .7, arm: 'down', eyes: 1, look: [0, -1] }); }, { ...LIGHTS.moonSilhouette, rim: { ...LIGHTS.moonSilhouette.rim, col: '#FFE6B0', dx: 0, dy: -4, a: .3 + .7 * spark } }); });
  plane(c, cam, 1.2, (c) => motes(c, { n: 60, seed: 12, box: [-100, 0, W + 100, 1950], r: 3, col: '#E6EEFF', a: .45, vx: 40, vy: 80, t }));
} });

// ---------- shot 12: she steps out of the light and wraps the earth in warmth ----------
SHOTS.push({ a: TL.warm, b: TL.ask + .45, xf: .35, draw(c, u, t) {
  const grow = easeOut(seg(t, TL.warm, TL.stepped + .9)), step = ease(seg(t, TL.stepped, TL.wrapped)), warm = ease(seg(t, TL.wrapped - .2, TL.warmth + .6));
  const cam = { z: lerp(1.06, 1.0, easeOut(u / 4)), fx: 540, fy: 1100 };
  plane(c, cam, 0, (c) => { sky(c, [[0, mixCol('#03050A', '#24183A', warm)], [700, mixCol('#0C1424', '#5E2E4E', warm)], [1150, mixCol('#1A2438', '#C9663D', warm)], [1500, mixCol('#0A0E18', '#FFCF86', warm)]]); });
  plane(c, cam, .1, (c) => { glow(c, 540, 1050, 300 + 900 * grow, '#FFE2A0', .55 + .3 * grow); ellipse(c, 540, 1050, 40 + 300 * grow, 40 + 300 * grow, rgba('#FFF6DA', .95)); rays(c, 540, 1050, { n: 16, dir: Math.PI / 2, spread: TAU, len: 1400 * grow, w: 140, col: '#FFE2A0', a: .18 + .1 * warm, t, seed: 5 }); });
  plane(c, cam, .4, (c) => { ridge(c, 1380, 110, 61, mixCol('#0A101C', '#3A1E30', warm)); haze(c, 1380, 200, mixCol('#2A3A58', '#E8A06C', warm), .35); });
  plane(c, cam, 1, (c) => {
    fillPath(c, 'M -200 1500 C 300 1480 800 1490 1280 1510 L 1280 2400 L -200 2400 Z', mixCol('#0E1420', '#2A1620', warm));
    frost(c, 1500, 1 - warm, t); flowerBed(c, 60, 1020, 1760, 1.6, .6 + .4 * warm, 1 - warm, t, 3);
    const k = lerp(.55, .95, step);
    figure(c, (f) => { f.translate(540, lerp(1480, 1560, step)); f.scale(k, k); devi8(f, { t, spread: step }); }, { ...LIGHTS.dawnBack, tint: ['#2A1018', .9], alpha: ease(seg(t, TL.stepped - .3, TL.stepped + .5)) });
  });
  plane(c, cam, 1.2, (c) => motes(c, { n: 60, seed: 14, box: [-100, 300, W + 100, 1950], r: 3, col: mixCol('#E6EEFF', '#FFD890', warm), a: .5, vx: lerp(60, 0, warm), vy: lerp(90, -30, warm), t }));
} });

// ---------- shot 13: the question. Her silhouette in the sun's halo ----------
SHOTS.push({ a: TL.ask, b: TL.card + .4, xf: .45, draw(c, u, t) {
  const cam = { z: lerp(1.08, 1.0, easeOut(u / 4.6)), fx: 540, fy: 1100 };
  plane(c, cam, 0, (c) => { sky(c, [[0, '#120818'], [650, '#3A1A3A'], [1150, '#C9663D'], [1700, '#FFCF86']]); });
  plane(c, cam, .1, (c) => { sunDisc(c, 540, 1180, 420, t, { life: 1, rays: .45 }); rays(c, 540, 1180, { n: 16, dir: Math.PI / 2, spread: TAU, len: 1200, w: 160, col: '#FFE2A0', a: .12, t, seed: 8 }); });
  plane(c, cam, 1, (c) => figure(c, (f) => { f.translate(540, 2180); f.scale(1.15, 1.15); devi8(f, { t, spread: 1 }); }, { ...LIGHTS.dawnBack, tint: ['#2A1018', .92] }));
  plane(c, cam, 1.2, (c) => motes(c, { n: 50, seed: 15, box: [-100, 300, W + 100, 1950], r: 3, col: '#FFD890', a: .5, vx: 0, vy: -30, t }));
} });

// ---------- shot 14: the card. Book 4 springs out of the light ----------
SHOTS.push({ a: TL.card, b: TL.end + 1, xf: .2, draw(c, u, t) {
  rkCardCine(c, u, t, { hero: 'book4', badge: 'NEW · 16 OCT', title: 'FIND OUT IN BOOK 4', price: 'Book 4 · ₹200 · ships 16 Oct', note: 'Books 1–3 out now: set of 3 for ₹500', books: ['book1', 'book2', 'book3'] });
} });

// ---------- flashes ----------
POST.push((c, t) => {
  flash(c, .35 * pulse(t, TL.ashes, .05, 3), '#FFB060');                      // to ASHES
  flash(c, .3 * pulse(t, TL.third, .05, 4), '#FF8A3A');                       // the third eye
  flash(c, .8 * pulse(t, TL.impact, .03, 3), '#FFFFFF');                      // the trishul strikes the sun
  flash(c, .25 * strikes(t, [TL.cursed, TL.head]), '#C8B8FF');                // the curse's lightning
  flash(c, .5 * pulse(t, TL.stepped + .2, .3, 2.5), '#FFF2C8');               // she steps out of the light
  flash(c, .9 * pulse(t, TL.card, .12, 4), '#FFFFFF');                        // white into the card
});

// ---------- captions: the voice's karaoke chunks (not over the card); the hook is lit at frame 0 ----------
VO.caps.filter(k => k.id !== 'book' && k.id !== 'set').forEach((k, i) => {
  const n = k.text.split(/\s+/).filter(w => w && w !== '|').length;
  say(i === 0 ? -.35 : k.a, Math.min(k.b, TL.card + .1), k.text, { at: i === 0 ? Array(n).fill(-.35) : k.at, y: CAPY[k.id] ?? k.y, size: k.size });
});
