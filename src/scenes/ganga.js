// ganga.js: "Ganga fell from heaven hard enough to BREAK the earth. Shiva's answer? His HAIR." (reel/ganga-jata), in the
// Cinematic style (src/cine.js), voiced (Sarvam: the narrator girish_en_devotional, Ganga aditi_en_stories).
// The Valmiki Ramayana, Bala Kanda 38–44: Sagara's 60,000 sons dig to the underworld after the stolen horse and call the
// sage Kapila a thief; one sound and they are ash. Only Ganga can free them. Bhagiratha's tapas, Brahma's yes and
// warning, a year on one toe; proud Ganga means to sweep Shiva into the underworld; he catches her in his hair and she
// is lost in it for years; seven streams, one following Bhagiratha's chariot; Jahnu drinks her and lets her out through
// his ear; she reaches the ashes and the 60,000 rise. Gangadhara, Bhagirathi, Jahnavi; the name call-out; a follow card.
// Times are in TL (src/scenes/ganga_tl.js, from the voice); tools/ganga_sfx.mjs uses the same TL.
const shake = (t, t0, k = 14, d = 5) => { const u = t - t0; if (u < 0 || u > 1.4) return [0, 0]; const e = Math.exp(-u * d) * k; return [Math.sin(t * 53) * e, Math.cos(t * 41) * e]; };
const pulse = (t, t0, up, down) => t < t0 - up || t > t0 + 3 ? 0 : t < t0 ? ease(seg(t, t0 - up, t0)) : Math.exp(-(t - t0) * down);

// Shiva on Kailash's summit, the torrent coming down onto his head: shared by the hook and the fall.
// o: k (how far the water has fallen, 0..1), spread (his locks), wet, splash, fl (lightning), shake [x, y], z (zoom)
function summit(c, t, u, o) {
  const [sx, sy] = o.shake || [0, 0], cam = { z: o.z, fx: 540, fy: 760, x: sx, y: sy };
  const S = { x: 540, y: 980, k: .42 }, jt = S.y - 1004 * S.k;
  plane(c, cam, 0, (c) => { SKY.storm(c, o.fl || 0); glow(c, 540, -60, 700, '#BFD8FF', .5); });
  plane(c, cam, .1, (c) => clouds(c, [[-260, 40, 900, 11, 30], [420, 120, 900, 12, 40, true], [-100, 260, 700, 13, 20]], t, PALETTES.nightFar, .9));
  plane(c, cam, .15, (c) => { if (o.fl) bolt(c, 860, -40, 760, 520, 21, o.fl); });
  plane(c, cam, .3, (c) => { ridge(c, 1150, 90, 3, '#0E1424'); haze(c, 1080, 260, '#3A4A6E', .4); });
  plane(c, cam, .6, (c) => kailash(c, 540, 975, 560, { rock: '#121A2C', snow: '#6A7898', snowSh: '#3E4A66' }));
  plane(c, cam, 1, (c) => {
    figure(c, (f) => { f.translate(S.x, S.y); f.scale(S.k, S.k); jataSpread(f, { t, spread: o.spread, wet: o.wet }); shiva(f, { t, eyes: 0, wind: .6 }); },
      { ...MOON_FX, rim: { col: '#DCEBFF', dx: 0, dy: -4, a: .9 + (o.wet || 0) * .6, blur: 1 } });
    gangaFall(c, 540, -120, jt + 30, 190, { t, k: o.k, splash: o.splash, w1: 220 });
  });
  plane(c, cam, 1.15, (c) => { ridge(c, 1170, 50, 8, '#05070D'); fillPath(c, 'M -200 1240 L 1300 1250 L 1300 2200 L -200 2200 Z', '#05070D'); });
  plane(c, cam, 1.25, (c) => motes(c, { n: 70, seed: 4, box: [-100, 0, W + 100, 1900], r: 3, col: '#DCEBFF', a: .45, vx: 30, vy: 260, t }));
}

// ---------- shot 1: the hook. The torrent plunging at Shiva on Kailash; "His HAIR": his locks fan out, it hits ----------
SHOTS.push({ a: TL.hook, b: TL.sagara + .4, draw(c, u, t) {
  const hit = seg(t, TL.hair - .05, TL.hair + .1);
  summit(c, t, u, { z: lerp(1.0, 1.1, easeIO(u / 5.5)), k: lerp(.55, 1, easeIO(seg(t, 0, TL.hair))), spread: easeOut(seg(t, TL.answer - .2, TL.hair)) * .9 + .1,
    wet: hit, splash: hit * (.6 - seg(t, TL.hair + .5, TL.hair + 1.6) * .35), fl: strikes(t, [1.6, 3.2]), shake: shake(t, TL.hair, 16) });
} });

// ---------- shot 2: Sagara's sacred horse on a dusk hill; the 60,000 princes arrive with torches; the horse is gone ----------
SHOTS.push({ a: TL.sagara, b: TL.down + .3, xf: .5, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.12, easeIO(u / 6)), fx: 520, fy: 1200 }, gone = ease(seg(t, TL.stolen - .1, TL.stolen + .7));
  plane(c, cam, 0, (c) => { SKY.dusk(c); ellipse(c, 760, 1340, 150, 150, rgba('#FFD08A', .9)); glow(c, 760, 1340, 480, '#FF9A4A', .5); });
  plane(c, cam, .25, (c) => { clouds(c, [[-200, 980, 800, 31, 20], [520, 1120, 700, 33, 30, true]], t, PALETTES.nightFar, .5); ridge(c, 1340, 60, 5, '#2A0E18'); });
  plane(c, cam, .6, (c) => { fillPath(c, 'M -200 1420 C 100 1300 300 1270 480 1290 C 640 1310 820 1380 1300 1400 L 1300 2200 L -200 2200 Z', '#1A0A12'); });
  plane(c, cam, .6, (c) => figure(c, (f) => { f.translate(400, 1300); f.scale(.42, .42); horse(f, { t, decor: true }); }, { ...DUSK_SIL, alpha: 1 - gone }));
  plane(c, cam, .6, (c) => { if (gone > 0 && gone < 1) motes(c, { n: 30, seed: 8, box: [300, 1080, 560, 1300], r: 4, col: '#FFC890', a: .6 * (1 - gone) * gone * 4, vx: 0, vy: -60, t }); });
  plane(c, cam, 1, (c) => {
    fillPath(c, 'M -200 1500 C 300 1460 700 1480 1300 1450 L 1300 2200 L -200 2200 Z', '#10060C');
    const m = easeOut(seg(t, TL.princes - .4, TL.princes + 1.6));
    figure(c, (f) => { princes(f, -40, 1120, 1560, 44, .13, { t, march: m, seed: 2 }); princes(f, 0, 1080, 1700, 30, .17, { t, march: m, seed: 9 }); }, DUSK_SIL);
  });
  plane(c, cam, 1.2, (c) => motes(c, { n: 40, seed: 3, box: [-100, 600, W + 100, 1900], r: 3, col: '#FFC890', a: .45, vx: -20, vy: -30, t }));
} });

// ---------- shot 3: down the chasm they dig, torches streaming into the dark ----------
SHOTS.push({ a: TL.down - .3, b: TL.kapila + .4, xf: .5, draw(c, u, t) {
  const cam = { z: lerp(1.08, 1.0, easeIO(u / 3)), fx: 540, fy: 1000, y: lerp(0, 120, easeIO(u / 3)) };
  plane(c, cam, 0, (c) => sky(c, [[0, '#2A0E18'], [500, '#120810'], [1920, '#06040A']]));
  plane(c, cam, 1, (c) => chasm(c, { t, torches: 1, lit: .9 }));
  plane(c, cam, 1.3, (c) => motes(c, { n: 50, seed: 13, box: [-100, 0, W + 100, 1900], r: 3, col: '#FFB07A', a: .5, vx: 10, vy: 90, t }));
} });

// ---------- shot 4: the underworld: the horse grazing by the sage Kapila in meditation; the princes close in: "THIEF" ----------
SHOTS.push({ a: TL.kapila, b: TL.ash + .3, xf: .5, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.1, easeIO(u / 4)), fx: 620, fy: 1300 }, rush = easeOut(seg(t, TL.thief - .1, TL.thief + .5));
  plane(c, cam, 0, (c) => { SKY.cave(c); for (let i = 0; i < 9; i++) { const x = hash(i * 3) * W; fillPath(c, `M ${x - 60} -10 L ${x + 60} -10 L ${x} ${180 + hash(i) * 260} Z`, '#0A0610'); } });
  plane(c, cam, .5, (c) => { ridge(c, 1380, 70, 17, '#1A1024'); fillPath(c, 'M -200 1480 L 1300 1480 L 1300 2200 L -200 2200 Z', '#120A18'); });
  plane(c, cam, 1, (c) => {
    glow(c, 700, 1240, 420, '#B79AE8', .45); glow(c, 700, 1240, 160, '#FFF0D0', .35);
    figure(c, (f) => { f.save(); f.translate(700, 1500); f.scale(.72, .72); rishi(f, { t, pose: 'sit' }); f.restore();
      f.save(); f.translate(300, 1500); f.scale(.36, .36); horse(f, { t, decor: true }); f.restore(); }, CAVE_SIL);
  });
  plane(c, cam, 1.15, (c) => figure(c, (f) => princes(f, -300 + rush * 200, 420 + rush * 200, 1720, 16, .26, { t, seed: 4 }), { ...SIL('#08060C', '#FF9A6A'), tint: ['#08060C', .95] }));
  plane(c, cam, 1.3, (c) => motes(c, { n: 40, seed: 23, box: [-100, 300, W + 100, 1900], r: 3, col: '#CDB8FF', a: .4, vx: 6, vy: -20, t }));
} });

// ---------- shot 5: Kapila's eye opens; one sound: a white flash ----------
SHOTS.push({ a: TL.ash, b: TL.sound + .55, xf: .25, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.12, easeIO(u / .9)), fx: 520, fy: 1000 }, op = easeOut(seg(t, TL.sound - .1, TL.sound + .15));
  plane(c, cam, 0, (c) => { SKY.cave(c); glow(c, 700, 900, 700, '#B79AE8', .45); });
  plane(c, cam, 1, (c) => {
    figure(c, (f) => { f.translate(620, 2420); f.scale(3.4, 3.4); rishi(f, { t, pose: 'sit' }); }, CAVE_SIL);
    kapilaEye(c, 620 - 18 * 3.4, 2420 - 424 * 3.4, 3.4, op, t);
  });
} });
// ---------- shot 6: ash, where 60,000 princes stood ----------
SHOTS.push({ a: TL.sound + .45, b: TL.souls + .5, xf: .12, draw(c, u, t) {
  const cam = { z: lerp(1.06, 1.0, easeOut(u / 3)), fx: 540, fy: 1200 };
  plane(c, cam, 0, (c) => SKY.ash(c));
  plane(c, cam, .5, (c) => { ridge(c, 1300, 70, 17, '#141820'); });
  plane(c, cam, 1, (c) => { shockRings(c, 540, 1420, t, [TL.sound + .5]); ashField(c, 1400, t, { glow: '#FF8A4A', glowA: 1 - seg(t, TL.sound + .5, TL.sound + 2.5) }); });
  plane(c, cam, 1.2, (c) => motes(c, { n: 90, seed: 31, box: [-100, 300, W + 100, 1900], r: 3.5, col: '#A8ACB8', a: .55, vx: 14, vy: -50, t }));
} });

// ---------- shot 7: the ash field, cold; high above, the river of heaven ----------
SHOTS.push({ a: TL.souls, b: TL.kings + .4, xf: .6, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.08, easeIO(u / 4.5)), fx: 540, fy: 600, y: lerp(0, 160, easeIO(u / 4.5)) }, rv = ease(seg(t, TL.souls + .6, TL.heaven + .3));
  plane(c, cam, 0, (c) => { sky(c, [[0, '#060A18'], [700, '#101830'], [1300, '#1A2234'], [1920, '#0A0C12']]); stars(c, 90, 7, t, .8); });
  plane(c, cam, .15, (c) => { glow(c, 540, 300, 600, '#7FB2E0', .25 * rv); waterPath(c, [[-100, 420], [200, 300], [520, 330], [800, 220], [1180, 260]], [50, 70, 80, 70, 60], { t, a: .55 * rv, speed: 140, glow: 1 }); });
  plane(c, cam, .4, (c) => { for (const s of [-1, 1]) poly(c, [[s < 0 ? -200 : 1280, -300], [540 + s * 380, -300], [540 + s * 360, 520], [540 + s * 300, 1100], [540 + s * 420, 1500], [s < 0 ? -200 : 1280, 1700]], '#07080E'); });
  plane(c, cam, 1, (c) => ashField(c, 1460, t, { col: '#2E3440', floor: '#0A0C10' }));
  plane(c, cam, 1.2, (c) => motes(c, { n: 50, seed: 33, box: [-100, 600, W + 100, 1900], r: 3, col: '#A8B4CC', a: .4, vx: 6, vy: -24, t }));
} });

// ---------- shot 8: kings at prayer fade like smoke; then Bhagiratha ----------
SHOTS.push({ a: TL.kings, b: TL.tapas + .4, xf: .6, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.08, easeIO(u / 4.6)), fx: 540, fy: 1200 }, rise = easeOut(seg(t, TL.bhag - .5, TL.bhag + .6));
  plane(c, cam, 0, (c) => { SKY.dawnGrey(c); glow(c, 540, 1400, 600 + 300 * rise, '#FFC890', .25 + .35 * rise); });
  plane(c, cam, .4, (c) => { ridge(c, 1440, 50, 41, '#2A2430'); fillPath(c, 'M -200 1520 L 1300 1520 L 1300 2200 L -200 2200 Z', '#141018'); });
  plane(c, cam, 1, (c) => {
    [[260, TL.kings + .3, 1.6], [820, TL.kings + 1.2, 1.7]].forEach(([x, t0, d]) => {
      const f0 = seg(t, t0, t0 + d); if (f0 >= 1) return;
      figure(c, (f) => { f.translate(x, 1560 - f0 * 30); f.scale(.5, .5); bhagiratha(f, { t, arms: 'namaste' }); }, { ...DAWN_SIL, alpha: 1 - f0 });
      if (f0 > 0) motes(c, { n: 26, seed: x, box: [x - 120, 1000, x + 120, 1560], r: 4, col: '#C8C0C8', a: .5 * (1 - f0) * Math.min(1, f0 * 4), vx: 0, vy: -80, t });
    });
    if (rise > 0) figure(c, (f) => { f.translate(540, 1580); f.scale(.6, .6 * lerp(.85, 1, rise)); bhagiratha(f, { t, arms: 'down' }); }, { ...DAWN_SIL, alpha: rise });
  });
} });

// ---------- shot 9: his tapas among the five fires; days race; Brahma's lotus of light: yes ----------
SHOTS.push({ a: TL.tapas, b: TL.warn + .4, xf: .5, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.1, easeIO(u / 4)), fx: 540, fy: 1100 }, lo = easeOut(seg(t, TL.brahma - .2, TL.brahma + .8)), race = 1 - seg(t, TL.brahma - .6, TL.brahma);
  plane(c, cam, 0, (c) => {
    const day = .5 + .5 * Math.sin(t * 5);
    sky(c, [[0, mixCol('#060814', '#2A3050', day * race)], [900, mixCol('#141428', '#8A5A4A', day * race)], [1920, '#120A10']]);
    if (race > .02) { const a = t * 5; ellipse(c, 540 + Math.cos(a) * 480, 1100 - Math.abs(Math.sin(a)) * 420, 40, 40, rgba('#FFE8B0', race * (Math.sin(a) > 0 ? 1 : .2))); ellipse(c, 540 - Math.cos(a) * 480, 1100 - Math.abs(Math.sin(a)) * 420, 26, 26, rgba('#E8EEFF', race * (Math.sin(a) < 0 ? .9 : .1))); }
    if (lo > 0) lotusLight(c, 540, 840, 56, t, lo);
  });
  plane(c, cam, .4, (c) => { ridge(c, 1480, 50, 51, '#1A1018'); fillPath(c, 'M -200 1560 L 1300 1560 L 1300 2200 L -200 2200 Z', '#120A0E'); });
  plane(c, cam, 1, (c) => {
    fires(c, 540, 1600, t, 1);
    figure(c, (f) => { f.translate(540, 1580); f.scale(.55, .55); bhagiratha(f, { t, arms: 'up' }); }, { ...LIGHTS.fire, tint: ['#140810', .9], edge: { col: '#FFB07A', w: 2.4, a: .8 }, rim: { col: lo > 0 ? '#FFE2A0' : '#FFB07A', dx: 0, dy: -5, a: .9, blur: 1 } });
  });
  plane(c, cam, 1.2, (c) => motes(c, { n: 50, seed: 41, box: [-100, 800, W + 100, 1900], r: 3, col: '#FFB07A', a: .5, vx: 0, vy: -70, t }));
} });

// ---------- shot 10: the earth cracks under the shadow of a falling river ----------
SHOTS.push({ a: TL.warn, b: TL.only + .3, xf: .5, draw(c, u, t) {
  const [sx, sy] = shake(t, TL.warn + 1.2, 8, 2), cam = { z: lerp(1.0, 1.12, easeIO(u / 2.4)), fx: 700, fy: 1300, x: sx, y: sy };
  plane(c, cam, 0, (c) => SKY.silver(c));
  plane(c, cam, .2, (c) => clouds(c, [[-200, 120, 900, 61, 30], [400, 260, 800, 62, 40, true]], t, PALETTES.nightFar, .8));
  plane(c, cam, .5, (c) => { ridge(c, 1250, 60, 61, '#141C2C'); fillPath(c, 'M -200 1320 L 1300 1320 L 1300 2200 L -200 2200 Z', '#0E1420'); });
  plane(c, cam, 1, (c) => { gangaFall(c, 720, -120, 1340, 120, { t, a: .28, glow: false }); cracks(c, 720, 1420, easeOut(seg(t, TL.warn + .4, TL.only)), t, 5); });
} });
// ---------- shot 11: only Shiva could: Shiva on Kailash, eyes closed, the moon ----------
SHOTS.push({ a: TL.only - .1, b: TL.toe + .4, xf: .4, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.1, easeIO(u / 2.4)), fx: 540, fy: 1100 };
  plane(c, cam, 0, (c) => { SKY.night(c); glow(c, 900, 330, 420, '#7F97CC', .4); ellipse(c, 900, 330, 40, 40, '#E6ECF6'); });
  plane(c, cam, .2, (c) => kailash(c, 300, 820, 460, { rock: '#121A2C', snow: '#6A7898', snowSh: '#3E4A66' }));
  plane(c, cam, 1, (c) => figure(c, (f) => { f.translate(540, 2300); f.scale(1.5, 1.5); shiva(f, { t, eyes: 0, arm: 'abhaya', trishul: false }); }, LIGHTS.moon));
  plane(c, cam, 1.2, (c) => motes(c, { n: 50, seed: 9, box: [-100, 0, W + 100, 1950], r: 3, col: '#DCE6FF', a: .45, vx: 60, vy: 120, t }));
} });

// ---------- shot 12: a year on one toe before Kailash; the moon crosses; snow ----------
SHOTS.push({ a: TL.toe, b: TL.pride + .4, xf: .5, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.1, easeIO(u / 4.3)), fx: 540, fy: 1300 }, mq = seg(t, TL.year - 1, TL.pride + .2);
  plane(c, cam, 0, (c) => { SKY.night(c); const x = lerp(-60, 1140, mq), y = 400 - Math.sin(mq * Math.PI) * 160; glow(c, x, y, 380, '#7F97CC', .4); ellipse(c, x, y, 36, 36, '#E6ECF6'); stars(c, 60, 3, t, .6); });
  plane(c, cam, .2, (c) => { kailash(c, 540, 760, 520, { rock: '#121A2C', snow: '#7A88A8', snowSh: '#46526E' }); haze(c, 1300, 240, '#3A4A6E', .5); });
  plane(c, cam, .6, (c) => { fillPath(c, 'M -200 1640 C 200 1580 380 1560 540 1570 C 700 1580 900 1600 1300 1640 L 1300 2200 L -200 2200 Z', '#0A0E18'); });
  plane(c, cam, 1, (c) => figure(c, (f) => { f.translate(540, 1580); f.scale(.62, .62); bhagiratha(f, { t, toe: true, arms: 'up' }); }, LIGHTS.moonSilhouette));
  plane(c, cam, 1.2, (c) => motes(c, { n: 60 + Math.round(60 * mq), seed: 12, box: [-100, 0, W + 100, 1950], r: 3, col: '#E6ECFF', a: .55, vx: 40, vy: 160, t }));
} });

// ---------- shot 13: Ganga in the heavens, proud; her hair is the river ----------
SHOTS.push({ a: TL.pride, b: TL.fall + .3, xf: .5, draw(c, u, t) {
  const pl = easeIO(seg(t, TL.plunge - .2, TL.fall + .3)), cam = { z: lerp(1.0, 1.08, easeIO(u / 3.6)) + pl * .25, fx: 540, fy: 1000 };
  plane(c, cam, 0, (c) => { SKY.silver(c); glow(c, 540, 700, 800, '#9FC4F0', .35); });
  plane(c, cam, .2, (c) => clouds(c, [[-300, 200, 900, 71, 30], [400, 320, 900, 72, 40, true]], t, PALETTES.nightFar, .8));
  plane(c, cam, 1, (c) => {
    for (const s of [-1, 1]) gangaFall(c, 540 + s * 190, 780, 1500, 80, { t, w1: 150, lean: s * 140, glow: false, a: 1 - pl });
    gangaFall(c, 540, 1000, 1700, 260, { t, w1: 340, a: 1 - pl });
    figure(c, (f) => { f.translate(540, 860); f.scale(3.0, 3.0); f.translate(0, 815); deviHead(f, { t, pal: GANGA_PAL, eyes: .72, look: [0, .6], wind: .6 }); },
      { ...MOON_FX, tint: ['#9FC4F0', .08], rim: { col: '#E8F4FF', dx: 0, dy: -6, a: .9, blur: 1.5 }, alpha: 1 - pl });
  });
  plane(c, cam, 1.1, (c) => { clouds(c, [[-300, 1290, 1000, 75, 30], [300, 1330, 1000, 76, 40, true]], t, PALETTES.nightFar, .85); fillPath(c, 'M -200 1370 C 200 1350 800 1360 1300 1370 L 1300 2400 L -200 2400 Z', '#08101E'); });
  plane(c, cam, 1.2, (c) => motes(c, { n: 60, seed: 71, box: [-100, 0, W + 100, 1900], r: 3, col: '#DCEBFF', a: .5, vx: 10, vy: 200, t }));
} });

// ---------- shot 14: the fall: the torrent onto Kailash, Shiva's locks spread wide; it hits ----------
SHOTS.push({ a: TL.fall, b: TL.catch + .3, xf: .3, draw(c, u, t) {
  const k = easeIO(seg(t, TL.fall, TL.hit)), hit = seg(t, TL.hit - .05, TL.hit + .1);
  summit(c, t, u, { z: lerp(1.15, 1.0, easeOut(u / 1.6)), k, spread: easeOut(seg(t, TL.fall + .2, TL.hit)), wet: hit, splash: hit, fl: strikes(t, [TL.fall + .4, TL.hit - .3]), shake: shake(t, TL.hit, 22, 3) });
} });

// ---------- shot 15: Shiva's face; the river pours into his jata and is swallowed; silence ----------
SHOTS.push({ a: TL.catch, b: TL.lost + .1, xf: .25, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.08, easeIO(u / 3)), fx: 540, fy: 900 }, K = 3.0, cy = 1000, jt = cy - (1004 - 815) * K;
  const tail = easeIn(seg(t, TL.catch + .8, w0('catch', 'hair') + .2)), wet = 1 - .5 * seg(t, TL.lost - .6, TL.lost);
  plane(c, cam, 0, (c) => { SKY.night(c); glow(c, 540, jt, 700, '#7FB2E0', .3 * wet); });
  plane(c, cam, 1, (c) => {
    figure(c, (f) => { f.translate(540, cy); f.scale(K, K); f.translate(0, 815); jataSpread(f, { t, spread: .62, wet }); }, { ...MOON_FX, edge: { col: '#DCEBFF', w: 2, a: 0 }, rim: { col: '#DCEBFF', dx: 0, dy: -6, a: .6 } });
    figure(c, (f) => { f.translate(540, cy); f.scale(K, K); f.translate(0, 815); shivaHead(f, { t, eyes: 0 }); }, { ...MOON_FX, rim: { ...MOON_FX.rim, dx: 9, dy: -4 } });
    if (tail < 1) gangaFall(c, 540, lerp(-150, jt, tail), jt + 30, 110, { t, w1: 120, splash: .5 * (1 - tail) });
  });
  plane(c, cam, 1.2, (c) => motes(c, { n: 40, seed: 15, box: [-100, 0, W + 100, 1900], r: 3, col: '#DCEBFF', a: .4 * wet, vx: 10, vy: 60, t }));
} });
function w0(id, word) { for (const k of VO.caps) if (k.id === id) { const ws = k.text.split(/\s+/).filter(x => x && x !== '|'); const i = ws.findIndex(x => x.replace(/[^A-Za-z]/g, '').toLowerCase() === word); if (i >= 0) return k.at[i]; } return VO.lines[id].a; }
// ---------- shot 16: inside the jata: great dark coils; one small stream of light, lost, wandering ----------
SHOTS.push({ a: TL.lost - .1, b: TL.streams + .4, xf: .5, draw(c, u, t) {
  const cam = { z: lerp(1.04, 1.0, easeIO(u / 2)), fx: 540, fy: 800 };
  plane(c, cam, 1, (c) => jataMaze(c, t, { q: u * .16 }));
} });

// ---------- shot 17: seven streams fall from Kailash at dawn ----------
SHOTS.push({ a: TL.streams, b: TL.chariot + .3, xf: .5, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.1, easeIO(u / 2.6)), fx: 540, fy: 1100 }, g = easeOut(seg(t, TL.seven - .4, TL.chariot));
  plane(c, cam, 0, (c) => { sky(c, [[0, '#0E0A20'], [700, '#2A1C40'], [1150, '#8A4A4A'], [1350, '#FFB46A'], [1920, '#1A1020']]); glow(c, 540, 1300, 600, '#FFB46A', .45); });
  plane(c, cam, .3, (c) => kailash(c, 540, 820, 560, { rock: '#1C1428', snow: '#B89AA8', snowSh: '#6A5266', light: -1 }));
  plane(c, cam, .3, (c) => {
    figure(c, (f) => { f.translate(540, 830); f.scale(.12, .12); jataSpread(f, { t, spread: .5, wet: g }); shiva(f, { t, eyes: 0 }); }, DAWN_SIL);
    for (let i = 0; i < 7; i++) {
      const s = (i - 3) / 3, P = [[540 + s * 30, 720], [540 + s * 140, 980], [540 + s * 300 + Math.sin(i * 2) * 30, 1240], [540 + s * 480 + Math.sin(i) * 60, 1520], [540 + s * 640, 1700]];
      const n = Math.max(2, Math.round(lerp(1, 5, g))), Q = P.slice(0, n); if (g > .05) waterPath(c, Q, Q.map((_, j) => 8 + j * 9), { t, a: g, speed: 340, glow: 1 });
    }
  });
  plane(c, cam, 1.2, (c) => motes(c, { n: 40, seed: 17, box: [-100, 600, W + 100, 1900], r: 3, col: '#FFE2A8', a: .5, vx: 6, vy: -30, t }));
} });
// ---------- shot 18: one follows Bhagiratha's chariot across the plain ----------
SHOTS.push({ a: TL.chariot - .1, b: TL.jahnu + .4, xf: .4, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.06, easeIO(u / 3)), fx: 540, fy: 1300 }, x = lerp(-260, 560, easeOut(u / 3.2));
  plane(c, cam, 0, (c) => { SKY.dawn(c); ellipse(c, 300, 1340, 130, 130, '#FFE9B8'); glow(c, 300, 1340, 500, '#FFB45A', .5); });
  plane(c, cam, .3, (c) => { clouds(c, [[-200, 1100, 900, 81, 30], [500, 1200, 800, 82, 40, true]], t, PALETTES.dawn, .45); ridge(c, 1400, 50, 81, '#3A1A30'); });
  plane(c, cam, 1, (c) => {
    fillPath(c, 'M -200 1460 C 300 1440 700 1450 1300 1440 L 1300 2200 L -200 2200 Z', '#1E0E1A');
    waterPath(c, [[-200, 1640], [x - 600, 1630], [x - 400, 1600], [x - 240, 1580]], [90, 70, 46, 16], { t, speed: 500, glow: 1 });
    figure(c, (f) => { f.translate(x, 1560); f.scale(.68, .68); chariot(f, { t, gallop: t * 9 }); f.translate(-50, -20); f.scale(.4, .4); bhagiratha(f, { t, arms: 'down' }); }, DAWN_SIL);
  });
  plane(c, cam, 1.2, (c) => motes(c, { n: 40, seed: 18, box: [-100, 800, W + 100, 1900], r: 3, col: '#FFE2A8', a: .5, vx: -60, vy: -10, t }));
} });

// ---------- shot 19: Jahnu's yagna flooded; he drinks the river; he lets her out through his ear ----------
SHOTS.push({ a: TL.jahnu, b: TL.free + .4, xf: .5, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.1, easeIO(u / 6)), fx: 600, fy: 1100 }, K = 1.5, X = 690, Y = 1560;
  const flood = easeOut(seg(t, TL.jahnu + .2, TL.jahnu + 1.5)), drink = seg(t, TL.drank - .1, TL.ear - .1), out = easeOut(seg(t, TL.ear + .1, TL.ear + 1.3));
  const tip = drink > 0 ? ease(seg(t, TL.drank - .1, TL.drank + .3)) * (1 - .6 * out) : 0;
  plane(c, cam, 0, (c) => { SKY.dusk(c); ellipse(c, 240, 1300, 120, 120, rgba('#FFD08A', .85)); glow(c, 240, 1300, 420, '#FF9A4A', .45); });
  plane(c, cam, .3, (c) => { ridge(c, 1420, 50, 91, '#2A0E18'); });
  plane(c, cam, 1, (c) => {
    fillPath(c, 'M -200 1540 L 1300 1540 L 1300 2200 L -200 2200 Z', '#14080E');
    const fireK = 1 - ease(seg(t, TL.jahnu + 1.2, TL.jahnu + 2)) * .9;
    glow(c, 420, 1520, 260 * fireK, '#FF7A2A', .5 * fireK); yagna(c, 420, 1580, 170, t, fireK);
    if (fireK < .9) motes(c, { n: 30, seed: 19, box: [340, 1100, 500, 1520], r: 6, col: '#C8C0C8', a: .4 * (1 - fireK), vx: 0, vy: -90, t });
    // the river: along the ground into the yagna; then lifted up into his cupped hands, thinning to nothing
    const mx = X - 62 * K, my = Y - 404 * K;
    if (drink <= 0) waterPath(c, [[-200, 1640], [lerp(-200, 120, flood), 1630], [lerp(-200, 360, flood), 1600]], [80, 70, 50], { t, a: flood, speed: 500, glow: .6 });
    else if (drink < 1) { const s = ease(drink); waterPath(c, [[lerp(-200, mx - 100, s), lerp(1640, my + 160, s)], [lerp(120, mx - 120, s * .7), lerp(1600, my + 80, s * .7)], [mx - 160, my + 40], [mx - 30, my]], [lerp(80, 6, s), lerp(60, 8, s), 26 * (1 - s * .6), 12], { t, speed: 700, glow: 1 }); }
    figure(c, (f) => { f.translate(X, Y); f.scale(K, K); rishi(f, { t, pose: drink > 0 ? 'drink' : 'sit', tip }); }, DUSK_SIL);
    // out through his ear, down and away to screen right
    if (out > 0) { const ex = X + 12 * K, ey = Y - 410 * K; waterPath(c, [[ex, ey], [ex + 60, ey + 40], [ex + 120, ey + 300], [ex + 160 + out * 60, 1580], [ex + 200 + out * 500, 1640]].slice(0, 2 + Math.ceil(out * 3)), [8, 14, 24, 40, 60].slice(0, 2 + Math.ceil(out * 3)), { t, speed: 600, glow: 1 }); }
  });
  plane(c, cam, 1.2, (c) => motes(c, { n: 40, seed: 3, box: [-100, 600, W + 100, 1900], r: 3, col: '#FFC890', a: .45, vx: -20, vy: -30, t }));
} });

// ---------- shot 20: the river pours down to the ashes; 60,000 souls rise ----------
SHOTS.push({ a: TL.free, b: TL.why + .4, xf: .6, draw(c, u, t) {
  const cam = { z: lerp(1.08, 1.0, easeIO(u / 4.5)), fx: 540, fy: 1000 }, rv = easeOut(seg(t, TL.free, TL.free + 1.6));
  plane(c, cam, 0, (c) => { sky(c, [[0, '#FFD89A'], [300, '#C9663D'], [900, '#2A1424'], [1920, '#0A060C']]); });
  plane(c, cam, 1, (c) => { chasm(c, { t, lit: .6 + .4 * rv, glow: '#FFC870', river: rv, riverPath: [[330, -60], [240, 500], [170, 1000], [200, 1450], [320, 1800]] }); ashField(c, 1720, t, { col: '#3A3440', floor: '#0E0A0E', glow: '#FFD890', glowA: rv }); });
  plane(c, cam, 1.1, (c) => souls(c, t, TL.souls2 - .6, { n: 110, x0: 420, x1: 980 }));
} });

// ---------- shot 21: Gangadhara: Shiva at dawn, Ganga springing from his jata ----------
SHOTS.push({ a: TL.why, b: TL.ask + .4, xf: .6, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.1, easeIO(u / 5.8)), fx: 540, fy: 1000 }, K = 1.4, X = 540, Y = 2330;
  plane(c, cam, 0, (c) => { SKY.gold(c); glow(c, 540, 820, 700, '#FFC870', .5); rays(c, 540, 820, { n: 14, dir: -Math.PI / 2, spread: 3.4, len: 1400, w: 300, col: '#FFE2A8', a: .14, t }); });
  plane(c, cam, .3, (c) => { clouds(c, [[-300, 1080, 1000, 93, 30], [500, 720, 900, 95, 40, true]], t, PALETTES.dawn, .4); kailash(c, 860, 980, 420, { rock: '#3A2030', snow: '#E8B890', snowSh: '#A0706A', light: -1 }); });
  plane(c, cam, 1, (c) => {
    figure(c, (f) => { f.translate(X, Y); f.scale(K, K); shiva(f, { t, eyes: .6, arm: 'abhaya', trishul: false }); }, { ...LIGHTS.moon, grade: [[1120, 'rgba(0,0,0,0)'], [1480, 'rgba(12,6,10,.8)']], tint: ['#FFB070', .1], rim: { col: '#FFE2A8', dx: 0, dy: -6, a: .9, blur: 1 } });
    gangaJet(c, X + 4 * K, Y - 1010 * K, 1.3, { t, dir: 1 });
  });
  plane(c, cam, 1.2, (c) => motes(c, { n: 50, seed: 21, box: [-100, 300, W + 100, 1900], r: 3, col: '#FFE2A0', a: .55, vx: 6, vy: -36, t }));
} });

// ---------- shot 22: a ghat at dusk, lamps on the steps and the water: the call-out ----------
SHOTS.push({ a: TL.ask, b: TL.card + .5, xf: .6, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.08, easeIO(u / 4.5)), fx: 540, fy: 1200 };
  plane(c, cam, 0, (c) => { sky(c, [[0, '#120A20'], [500, '#2E1838'], [900, '#8A3E3A'], [1100, '#E08A4A'], [1920, '#2A1418']]); glow(c, 540, 1080, 600, '#FFA060', .4); });
  plane(c, cam, 1, (c) => ghat(c, 1340, { t, col: '#2A1820', lamps: .9, diyas: 16 }));
  plane(c, cam, 1.2, (c) => motes(c, { n: 30, seed: 22, box: [-100, 900, W + 100, 1900], r: 3, col: '#FFC890', a: .45, vx: 6, vy: -20, t }));
} });

// ---------- shot 23: the follow card ----------
SHOTS.push({ a: TL.card, b: TL.end + 1, xf: .6, draw(c, u, t) {
  sky(c, [[0, '#04100E'], [900, '#0F2A27'], [1920, '#050E0C']]);
  glow(c, 520, 1000, 760, '#2E5F5A', .55, 'screen');
  motes(c, { n: 60, seed: 61, box: [-50, 300, W + 50, 1900], r: 3, col: '#F4C46A', a: .6, vx: 6, vy: -26, t });
  const X = 540, pk = (d) => u - d;
  picture(c, PICS.logo, X, 520, 132, 132, { pop: pk(.2), r: 66 });
  text(c, 'HAR HAR GANGE', X, 668, '700 64px Cinzel', '#F4C46A', { pop: pk(.4), glow: ['rgba(244,196,106,.55)', 26], spacing: 3, maxW: 860 });
  const k = popK(pk(.6));
  if (k > .01) {
    glow(c, X, 960, 300 * k, '#FFC870', .35);
    figure(c, (f) => { f.translate(X, 1020); f.scale(.95 * k, .95 * k); f.translate(0, 815); shivaHead(f, { t, eyes: 0 }); },
      { tint: ['#2E5F5A', .12], edge: { col: '#FFE8B0', w: 2.2, a: .8 }, rim: { col: '#FFE2A8', dx: 0, dy: -4, a: .9, blur: 1 } });
    gangaJet(c, X + 3 * .95 * k, 1020 - 200 * .95 * k, .6 * k, { t, dir: 1, a: k });
  }
  text(c, 'Stories of Shiva and the gods', X, 1250, '42px Marcellus', '#FBE0CF', { pop: pk(1.0), maxW: 840 });
  const kk = popK(pk(1.3)) * (1 + .03 * Math.max(0, Math.sin(t * 5)));
  if (kk > .01) { c.save(); c.translate(X, 1370); c.scale(kk, kk); c.fillStyle = '#F15A24'; c.shadowColor = 'rgba(241,90,36,.6)'; c.shadowBlur = 30; c.beginPath(); c.roundRect(-300, -48, 600, 96, 48); c.fill(); c.restore(); }
  text(c, 'Follow @therishikatha', X, 1373, '700 50px Poppins', '#FFFFFF', { pop: pk(1.3), maxW: 540 });
  text(c, 'rishikatha.com', X, 1470, '500 36px Poppins', '#CFE3DF', { pop: pk(1.6) });
} });

// ---------- flashes ----------
POST.push((c, t) => {
  flash(c, .3 * pulse(t, TL.hair, .05, 4), '#E8F4FF', 'screen');          // it hits his hair (the hook)
  flash(c, 1 * pulse(t, TL.sound + .45, .25, 2.2), '#FFFFFF', 'source-over');  // one sound: ash
  flash(c, .35 * pulse(t, TL.brahma, .1, 2), '#FFE2A0', 'screen');       // Brahma's yes
  flash(c, .3 * pulse(t, TL.plunge + .2, .2, 3), '#C8DAFF', 'screen');   // she plunges
  flash(c, .45 * pulse(t, TL.hit, .05, 3), '#E8F4FF', 'screen');       // the hit
  flash(c, .3 * pulse(t, TL.gangadhara, .1, 1.6), '#FFE8B0', 'screen');  // GANGADHARA
});

// ---------- captions (from the voice) ----------
// the hook's first chunk is up and lit at frame 0 (the thumbnail)
VO.caps.forEach((k, i) => say(i ? k.a : -.35, k.b, k.text, { at: i ? k.at : k.at.map(() => -.35), y: k.y, size: k.size }));
