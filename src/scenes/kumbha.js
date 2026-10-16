// kumbha.js: "The gods were TERRIFIED of one giant's wish. So a goddess hijacked his TONGUE." (reel/kumbhakarna-sleep),
// in the Cinematic style (src/cine.js), voiced (Sarvam: the narrator girish_en_devotional, Kumbhakarna
// rustom_en_suspense with the asura effect).
// Valmiki: Kumbhakarna ate thousands of creatures as a newborn; Indra struck him with the vajra and he tore out one of
// Airavata's tusks and struck Indra with it (Yuddha 61.13–17). He ate seven apsaras and ten of Indra's followers in
// Nandana, and sages and men (Uttara 10.33). His tapas: ten thousand years, the five fires in summer, water in winter
// (Uttara 10.3–5). The gods begged Brahma to give him delusion in the guise of a boon; Brahma sent Saraswati to be his
// speech; he asked to sleep for many years; "So be it"; she left and he grieved, deluded by the gods (Uttara 10.31–42).
// Brahma later eased it: six months asleep, one day awake (Yuddha 61.24–28). Woken for the war with a mountain of meat,
// conches and drums that dropped the birds from the sky, and a thousand elephants running over him; he woke yawning,
// hungry (Yuddha 60). The tag-a-friend ask, a follow card.
// Times are in TL (src/scenes/kumbha_tl.js, from the voice); tools/kumbha_sfx.mjs uses the same TL.
const shake = (t, t0, k = 14, d = 5) => { const u = t - t0; if (u < 0 || u > 1.4) return [0, 0]; const e = Math.exp(-u * d) * k; return [Math.sin(t * 53) * e, Math.cos(t * 41) * e]; };
const pulse = (t, t0, up, down) => t < t0 - up || t > t0 + 3 ? 0 : t < t0 ? ease(seg(t, t0 - up, t0)) : Math.exp(-(t - t0) * down);
const FIRE_FX = { ...LIGHTS.fire, tint: ['#1A0806', .3] };
const STORM_SIL = SIL('#0A0408', '#FF9A6A', .92);
// a close face: darker toward the top, so the caption reads over the crown
const FACE_FX = (rim = '#FFC890', a = .9) => ({ tint: ['#1A0806', .2], grade: [[380, 'rgba(6,2,4,.93)'], [1060, 'rgba(6,2,4,0)']], edge: { col: rim, w: 2.4, a: .6 }, rim: { col: rim, dx: 8, dy: -4, a, blur: 1 } });
const POSSESSED = { eye: '#FFFFFF', eyeHot: '#FFFFFF' };
// Kumbhakarna's face close at (x, y), k ×: the face centred on (x, y - 11 k); the mouth at (x, y + 49 k)
const faceAt = (c, x, y, k, o, fx) => figure(c, (f) => { f.translate(x, y); f.scale(k, k); f.translate(0, 815); kumbhaHead(f, o); }, fx || FACE_FX());

// ---------- shot 1: the hook. The giant in tapas, a red sky, the gods tiny before him ----------
SHOTS.push({ a: TL.hook, b: TL.tongue - 1.3, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.1, easeIO(u / 4.8)), fx: 540, fy: 1300 };
  plane(c, cam, 0, (c) => { SKY.storm(c); glow(c, 540, 1250, 800, '#FF5A1E', .35); });
  plane(c, cam, .2, (c) => { clouds(c, [[0, 300, 900, 41, 30], [600, 480, 760, 42, 45, true]], t, PALETTES.red, .8); });
  plane(c, cam, .5, (c) => ridge(c, 1640, 60, 7, '#1A0608'));
  plane(c, cam, 1, (c) => { fires(c, 540, 1760, t, 1.15, .9); figure(c, (f) => { f.translate(540, 1760); f.scale(1.25, 1.25); kumbhakarna(f, { t, pose: 'tapas', expr: 'chant' }); }, { ...FIRE_FX, rim: { col: '#FFD08A', dx: 0, dy: -6, a: .9, blur: 1 } }); });
  plane(c, cam, 1.2, (c) => { fillPath(c, 'M -200 1800 L 1300 1800 L 1300 2200 L -200 2200 Z', '#0A0406'); figure(c, (f) => godsRow(f, 40, 1040, 1960, 9, .2, t), SIL('#08040A', '#FFB07A', .95)); });
  plane(c, cam, 1.3, (c) => motes(c, { n: 50, seed: 3, box: [-100, 500, W + 100, 1900], r: 3, col: '#FFB07A', a: .5, vx: 10, vy: -40, t }));
} });

// ---------- shot 2: "So a goddess hijacked his TONGUE": his face, gold light pouring into his mouth, eyes flaring white ----------
SHOTS.push({ a: TL.tongue - 1.6, b: TL.name + .4, xf: .3, draw(c, u, t) {
  const fl = pulse(t, TL.tongue, .1, 2.4), [sx, sy] = shake(t, TL.tongue, 10), cam = { z: lerp(1.0, 1.08, easeIO(u / 2.6)), fx: 540, fy: 1200, x: sx, y: sy };
  plane(c, cam, 0, (c) => { SKY.fire(c); glow(c, 540, 1300, 700, '#FF7A2A', .3); });
  plane(c, cam, 1, (c) => {
    faceAt(c, 540, 1260, 5, { t, expr: 'speak', pal: fl > .1 ? POSSESSED : {}, eyes: 1 });
    glow(c, 540, 1260 + 245, 260, '#FFD890', .4 + fl * .5);
    syllables(c, [[-100, 800], [200, 1000], [420, 1380], [540, 1505]], t, { a: .9, shrink: true, size: 60 });
  });
} });

// ---------- shot 3: "Kumbhakarna, Ravana's brother.": both in Lanka's hall, the giant towering ----------
SHOTS.push({ a: TL.name, b: TL.born + .4, xf: .4, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.06, easeIO(u / 2.8)), fx: 540, fy: 1400 };
  plane(c, cam, 0, (c) => { SKY.hall(c); glow(c, 540, 1500, 800, '#FF8A3A', .35); });
  plane(c, cam, .3, (c) => pillars(c, 420, 1700, 540, '#1A0A08', t, 7, 44));
  plane(c, cam, 1, (c) => {
    fillPath(c, 'M -200 1740 L 1300 1740 L 1300 2200 L -200 2200 Z', '#120806');
    figure(c, (f) => { f.translate(290, 1900); f.scale(.62, .62); ravana(f, { t, expr: 'smirk' }); }, { ...LIGHTS.fire, tint: ['#1A0806', .4] });
    figure(c, (f) => { f.translate(730, 1960); f.scale(1.08, 1.08); kumbhakarna(f, { t, pose: 'stand', arms: 'roar', expr: 'smirk' }); }, FIRE_FX);
  });
  plane(c, cam, 1.2, (c) => motes(c, { n: 40, seed: 5, box: [-100, 600, W + 100, 1900], r: 3, col: '#FFB07A', a: .45, vx: 8, vy: -30, t }));
} });

// ---------- shot 4: "As a newborn, he ate THOUSANDS of creatures": a giant shadow over a forest; birds burst away ----------
SHOTS.push({ a: TL.born, b: TL.ate + .4, xf: .4, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.08, easeIO(u / 3.4)), fx: 540, fy: 1300 }, rise = easeOut(seg(t, TL.born, TL.thousands + .4));
  plane(c, cam, 0, (c) => { sky(c, [[0, '#04060E'], [800, '#1A1430'], [1400, '#7A2A2A'], [1920, '#1A0A10']]); glow(c, 760, 1300, 700, '#E05A2A', .45); });
  plane(c, cam, .4, (c) => figure(c, (f) => { f.translate(700, 1640 + (1 - rise) * 260); f.scale(.95, .95); kumbhakarna(f, { t, pose: 'stand', arms: 'roar', expr: 'scream', col: '#000' }); }, { tint: ['#06040A', .93], edge: { col: '#FFA070', w: 3, a: .95 }, rim: { col: '#FFC09A', dx: 0, dy: -6, a: 1, blur: 1 } }));
  plane(c, cam, .7, (c) => { ridge(c, 1560, 50, 12, '#05060C'); for (const [x, k] of [[40, .5], [230, .38], [930, .42], [1060, .55]]) forestTree(c, x, 1740, k, { col: '#04050A', t }); });
  plane(c, cam, 1, (c) => { fillPath(c, 'M -200 1700 L 1300 1700 L 1300 2200 L -200 2200 Z', '#03040A'); birds(c, t, { n: 40, seed: 4, y0: 600, h: 700, speed: 1 + seg(t, TL.thousands - .3, TL.thousands + .5) * 3, col: '#0A0A14' }); });
} });

// ---------- shot 5: "In heaven's garden, he ate seven apsaras and ten of Indra's followers": a shadow falls over the dancers ----------
SHOTS.push({ a: TL.ate, b: TL.indra + .4, xf: .5, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.08, easeIO(u / 5.4)), fx: 540, fy: 1400 }, sh = easeIO(seg(t, TL.ate + .8, TL.apsaras + .6));
  plane(c, cam, 0, (c) => nandana(c, t, { lit: 1 - sh * .6 }));
  plane(c, cam, 1, (c) => {
    for (let i = 0; i < 7; i++) { const x = 150 + i * 130, a = 1 - seg(t, TL.apsaras - .2 + i * .12, TL.apsaras + .4 + i * .12); if (a <= 0) continue; figure(c, (f) => { f.translate(x, 1620 + (i % 2) * 30); f.scale(.24 * (i % 2 ? 1 : -1), .24); sati(f, { t: t + i, wind: .8 }); }, { ...SIL('#2A1A20', '#FFE8C0', .75), alpha: a }); }
    // the giant's shadow sweeping in from the right
    const g = c.createLinearGradient(lerp(1400, -200, sh), 0, lerp(2000, 400, sh), 0); g.addColorStop(0, 'rgba(6,2,6,0)'); g.addColorStop(.3, 'rgba(6,2,6,.85)'); g.addColorStop(1, 'rgba(6,2,6,.92)'); c.fillStyle = g; c.fillRect(-200, 0, 1600, 2000);
    if (sh > .3) figure(c, (f) => { f.translate(lerp(1500, 880, sh), 2200); f.scale(1.5, 1.5); kumbhakarna(f, { t, pose: 'stand', arms: 'roar', expr: 'laugh' }); }, { tint: ['#060206', .9], edge: { col: '#FFD8A8', w: 2.4, a: .7 }, rim: { col: '#FFE8C0', dx: -4, dy: -4, a: .8 } });
  });
} });

// ---------- shot 6: "Indra struck him with the vajra": Indra on Airavata hurls the thunderbolt ----------
SHOTS.push({ a: TL.indra, b: TL.tusk + .4, xf: .4, draw(c, u, t) {
  const fl = strikes(t, [TL.vajra]), [sx, sy] = shake(t, TL.vajra, 16), cam = { z: lerp(1.0, 1.06, easeIO(u / 2.6)), fx: 540, fy: 1300, x: sx, y: sy };
  plane(c, cam, 0, (c) => SKY.storm(c, fl));
  plane(c, cam, .2, (c) => clouds(c, [[-200, 700, 900, 44, 40], [500, 900, 800, 45, 30, true]], t, PALETTES.red, .9));
  plane(c, cam, .6, (c) => { clouds(c, [[-300, 1320, 900, 46, 10]], t, PALETTES.red, 1); indraOnAiravata(c, 250, 1380, .8, { t, vajra: seg(t, TL.indra + .3, TL.vajra) * (t < TL.vajra + .1 ? 1 : 0) }); });
  plane(c, cam, .6, (c) => { if (fl > 0) { bolt(c, 270, 830, 760, 1240, 23, fl, '#DCE8FF'); } });
  plane(c, cam, 1, (c) => { fillPath(c, 'M -200 1800 C 300 1760 800 1780 1300 1760 L 1300 2200 L -200 2200 Z', '#0A0406'); figure(c, (f) => { f.translate(780, 1900); f.scale(.95, .95); f.scale(-1, 1); kumbhakarna(f, { t, pose: 'stand', arms: 'roar', expr: 'scream' }); }, { ...STORM_SIL, rim: { ...STORM_SIL.rim, a: .8 + fl * 1.2 } }); });
} });

// ---------- shot 7: "He ripped a tusk off Airavat and stabbed Indra with it.": the giant raises the white tusk ----------
SHOTS.push({ a: TL.tusk, b: TL.tapas + .4, xf: .3, draw(c, u, t) {
  const st = pulse(t, TL.stab, .05, 2.5), [sx, sy] = shake(t, TL.stab, 18), cam = { z: lerp(1.04, 1.12, easeIO(u / 4.3)), fx: 540, fy: 1200, x: sx, y: sy };
  plane(c, cam, 0, (c) => { SKY.storm(c, st); glow(c, 540, 1200, 800, '#FF5A1E', .3); });
  plane(c, cam, .5, (c) => figure(c, (f) => { f.translate(130, 1500); f.scale(.85, .85); elephantSide(f, { t, col: '#000', run: .2, tusks: 4, lost: true, trunk: .9 }); }, SIL('#0A0408', '#FF9A6A', .95)));
  plane(c, cam, 1, (c) => {
    fillPath(c, 'M -200 1820 C 300 1790 800 1800 1300 1780 L 1300 2200 L -200 2200 Z', '#0A0406');
    const K = 1.0, X = 600, Y = 1980;
    figure(c, (f) => { f.translate(X, Y); f.scale(K, K); kumbhakarna(f, { t, pose: 'stand', arms: 'raise', expr: 'scream' }); }, { ...FIRE_FX, rim: { col: '#FFC09A', dx: 0, dy: -6, a: .9 + st, blur: 1 } });
    const tx = X + 300 * K, ty = Y - 1130 * K;
    limb(c, [[tx, ty + 20], [tx + 30, ty - 120], [tx - 10, ty - 260]], [44, 32, 6], '#EEE4CC');
    strokePath(c, `M ${tx + 14} ${ty} C ${tx + 40} ${ty - 120} ${tx + 10} ${ty - 220} ${tx - 4} ${ty - 250}`, rgba('#FFFFFF', .6), 3);
    glow(c, tx, ty - 150, 200, '#FFE8C0', .3 + st * .5);
  });
  plane(c, cam, 1.2, (c) => motes(c, { n: 50, seed: 7, box: [-100, 600, W + 100, 1900], r: 3, col: '#FFB07A', a: .5, vx: 20, vy: -60, t }));
} });

// ---------- shot 8: tapas for ten thousand years: in the five fires all summer, then in icy water all winter ----------
SHOTS.push({ a: TL.tapas, b: TL.brahma + .4, xf: .5, draw(c, u, t) {
  const wv = ease(seg(t, TL.water - .5, TL.water + .5)), cam = { z: lerp(1.0, 1.1, easeIO(u / 6.6)), fx: 540, fy: 1400 };
  plane(c, cam, 0, (c) => { SKY.fire(c); c.save(); c.globalAlpha = wv; SKY.ice(c); c.restore(); const sa = ((t - TL.tapas) * .7) % 1; ellipse(c, lerp(-80, 1160, sa), 520 - Math.sin(sa * Math.PI) * 300, 50, 50, rgba(wv > .5 ? '#E8F0FF' : '#FFE0A0', .9)); glow(c, lerp(-80, 1160, sa), 520 - Math.sin(sa * Math.PI) * 300, 260, wv > .5 ? '#BFD4FF' : '#FFB060', .4); });
  plane(c, cam, .5, (c) => ridge(c, 1600, 60, 9, mixCol('#2A0A08', '#0E1A2C', wv)));
  plane(c, cam, 1, (c) => {
    fillPath(c, 'M -200 1760 L 1300 1760 L 1300 2200 L -200 2200 Z', mixCol('#140604', '#0A1220', wv));
    if (wv < 1) fires(c, 540, 1770, t, 1.1, 1 - wv);
    figure(c, (f) => { f.translate(540, 1770); f.scale(1.1, 1.1); kumbhakarna(f, { t, pose: 'tapas', expr: 'chant' }); }, wv < .5 ? FIRE_FX : { ...LIGHTS.moon, rim: { ...LIGHTS.moon.rim, dx: 0, dy: -6 } });
    if (wv > 0) { c.save(); c.globalAlpha = wv; const g = c.createLinearGradient(0, 1560, 0, 1900); g.addColorStop(0, 'rgba(120,170,230,.55)'); g.addColorStop(1, 'rgba(20,40,80,.9)'); c.fillStyle = g; c.fillRect(-100, 1560, 1300, 600); strokePath(c, `M -100 1560 ${Array.from({ length: 24 }, (_, i) => `L ${i * 55 - 100} ${1560 + Math.sin(t * 2 + i) * 6}`).join(' ')}`, rgba('#DCEBFF', .7), 3); c.restore(); }
  });
  plane(c, cam, 1.2, (c) => motes(c, { n: 60, seed: 9, box: [-100, 300, W + 100, 1900], r: 3, col: wv > .5 ? '#E8F0FF' : '#FFB07A', a: .5, vx: 10, vy: wv > .5 ? 120 : -50, t }));
} });

// ---------- shot 9: Brahma comes to grant his wish, descending on his lotus in gold light ----------
SHOTS.push({ a: TL.brahma, b: TL.begged + .1, xf: .5, draw(c, u, t) {
  const d = easeOut(seg(t, TL.brahma, TL.brahma + 2.4)), cam = { z: lerp(1.0, 1.06, easeIO(u / 3.2)), fx: 540, fy: 1300 };
  plane(c, cam, 0, (c) => { SKY.gold(c); rays(c, 540, 1000, { n: 14, dir: Math.PI / 2, spread: 2.4, len: 1400, w: 260, col: '#FFE2A8', a: .12, t }); });
  plane(c, cam, 1, (c) => {
    glow(c, 540, 1000 + d * 200, 600, '#FFE0A0', .5);
    figure(c, (f) => { f.translate(540, 1080 + d * 260); f.scale(.82, .82); brahma(f, { t }); }, LIGHTS.dawnBack);
    fillPath(c, 'M -200 1820 C 300 1800 800 1810 1300 1790 L 1300 2200 L -200 2200 Z', '#1A0C10');
    figure(c, (f) => { f.translate(540, 1880); f.scale(.55, .55); kumbhakarna(f, { t, pose: 'tapas', expr: 'chant' }); }, SIL('#140A0C', '#FFD9A0', .9));
  });
} });

// ---------- shot 10: the gods kneel and beg: "Not HIM. Give him delusion instead." ----------
SHOTS.push({ a: TL.begged - .3, b: TL.sara + .4, xf: .4, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.08, easeIO(u / 3.8)), fx: 540, fy: 1500 };
  plane(c, cam, 0, (c) => { SKY.gold(c); glow(c, 540, 1100, 700, '#FFE0A0', .4); });
  plane(c, cam, .5, (c) => figure(c, (f) => { f.translate(540, 1640); f.scale(1.0, 1.0); brahma(f, { t }); }, LIGHTS.dawnBack));
  plane(c, cam, 1, (c) => { fillPath(c, 'M -200 1760 L 1300 1760 L 1300 2200 L -200 2200 Z', '#120808'); figure(c, (f) => godsRow(f, -60, 1140, 1990, 7, .42, t), SIL('#0A0608', '#FFD9A0', .95)); });
} });

// ---------- shot 11: Saraswati, goddess of speech ----------
SHOTS.push({ a: TL.sara, b: TL.mouth - .6, xf: .5, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.08, easeIO(u / 3.6)), fx: 540, fy: 1250 };
  plane(c, cam, 0, (c) => { sky(c, [[0, '#1A1430'], [900, '#5A4A7A'], [1500, '#E8D8C0'], [1920, '#3A3040']]); glow(c, 540, 1200, 800, '#FFF0D0', .4); });
  plane(c, cam, 1, (c) => {
    figure(c, (f) => { f.translate(540, 1440); f.scale(3.8, 3.8); f.translate(0, 815); deviHead(f, { t, pal: SARASWATI_PAL, eyes: lerp(1, .55, seg(t, TL.saraswati, TL.saraswati + 1)) }); },
      { tint: ['#FFF0D0', .08], grade: [[200, 'rgba(10,6,20,.7)'], [800, 'rgba(10,6,20,0)']], edge: { col: '#FFF4D8', w: 2.4, a: .7 }, rim: { col: '#FFFFFF', dx: 7, dy: -4, a: .8, blur: 1 } });
    syllables(c, [[540, 1610], [700, 1700], [900, 1800], [1200, 1900]], t, { a: seg(t, TL.saraswati + .4, TL.saraswati + 1.2), size: 52 });
  });
  plane(c, cam, 1.2, (c) => motes(c, { n: 40, seed: 11, box: [-100, 400, W + 100, 1900], r: 3, col: '#FFF4D8', a: .5, vx: 6, vy: -24, t }));
} });

// ---------- shot 12: "into his MOUTH": the syllables pour into Kumbhakarna's mouth; his eyes turn white ----------
SHOTS.push({ a: TL.mouth - .8, b: TL.wish + .4, xf: .3, draw(c, u, t) {
  const pos = seg(t, TL.mouth - .1, TL.mouth + .4), cam = { z: lerp(1.0, 1.1, easeIO(u / 2)), fx: 540, fy: 1300 };
  plane(c, cam, 0, (c) => { SKY.fire(c); glow(c, 300, 600, 600, '#FFF0D0', .25); });
  plane(c, cam, 1, (c) => {
    faceAt(c, 560, 1260, 5, { t, expr: 'speak', pal: pos > .5 ? POSSESSED : {}, eyes: 1 });
    syllables(c, [[-120, 800], [180, 1000], [420, 1300], [560, 1505]], t, { a: 1, shrink: true, size: 60, speed: .5 });
    glow(c, 560, 1505, 240, '#FFE8B0', .3 + pos * .4);
  });
} });

// ---------- shot 13: "I wish to SLEEP for many years!": the giant in tapas, speaking with white eyes, before Brahma's light ----------
SHOTS.push({ a: TL.wish, b: TL.sobe + .4, xf: .3, draw(c, u, t) {
  const s = pulse(t, TL.sleep, .1, 2), cam = { z: lerp(1.0, 1.12, easeIO(u / 3.4)), fx: 540, fy: 1250 };
  plane(c, cam, 0, (c) => { SKY.gold(c); glow(c, 540, 700, 700, '#FFE0A0', .45 + s * .3); });
  plane(c, cam, 1, (c) => {
    fillPath(c, 'M -200 1830 L 1300 1830 L 1300 2200 L -200 2200 Z', '#1A0C0C');
    figure(c, (f) => { f.translate(540, 2100); f.scale(1.75, 1.75); kumbhakarna(f, { t, pose: 'tapas', arms: 'knees', expr: 'speak', pal: POSSESSED }); },
      { ...LIGHTS.dawnBack, tint: ['#2A1018', .3], grade: [[500, 'rgba(10,4,6,.6)'], [900, 'rgba(10,4,6,0)']] });
  });
} });

// ---------- shot 14: "And Brahma said: 'So be it.'": the blessing hand, a ring of gold light ----------
SHOTS.push({ a: TL.sobe, b: TL.left + .4, xf: .4, draw(c, u, t) {
  const r = seg(t, TL.be - .1, TL.be + 1.6), cam = { z: lerp(1.0, 1.08, easeIO(u / 2.6)), fx: 540, fy: 1300 };
  plane(c, cam, 0, (c) => { SKY.gold(c); rays(c, 540, 1100, { n: 16, dir: -Math.PI / 2, spread: 3.4, len: 1400, w: 300, col: '#FFE2A8', a: .14, t }); });
  plane(c, cam, 1, (c) => {
    figure(c, (f) => { f.translate(540, 1820); f.scale(1.2, 1.2); brahma(f, { t }); }, LIGHTS.dawnBack);
    if (r > 0 && r < 1) { c.save(); c.globalAlpha = 1 - r; c.shadowColor = '#FFE0A0'; c.shadowBlur = 30; strokePath(c, `M ${540 + 900 * r} 1100 A ${900 * r} ${900 * r * .5} 0 1 0 ${540 - 900 * r} 1100 A ${900 * r} ${900 * r * .5} 0 1 0 ${540 + 900 * r} 1100`, '#FFE8B0', 8); c.restore(); }
  });
} });

// ---------- shot 15: she leaves his tongue; he freezes: "What came out of my MOUTH?!" ----------
SHOTS.push({ a: TL.left, b: TL.eased + .4, xf: .4, draw(c, u, t) {
  const out = seg(t, TL.left, TL.froze), sh = t > TL.froze - .1, [sx, sy] = shake(t, TL.what + .4, 8), cam = { z: lerp(1.0, 1.16, easeIO(seg(t, TL.froze, TL.eased))), fx: 540, fy: 1200, x: sx, y: sy };
  plane(c, cam, 0, (c) => { SKY.fire(c); glow(c, 540, 1200, 700, '#FF7A2A', .25); });
  plane(c, cam, 1, (c) => {
    faceAt(c, 540, 1260, 5, { t, expr: sh ? 'shock' : 'speak', pal: out < .6 ? POSSESSED : {}, eyes: 1, look: sh ? [0, .3] : [0, 0] });
    if (out < 1) syllables(c, [[540, 1505], [640, 1200], [860, 1000], [1250, 900]], t, { a: 1 - out, size: 56, speed: .6 });
  });
} });

// ---------- shot 16: six months asleep, one day awake: the cave, the moon racing overhead through the opening ----------
SHOTS.push({ a: TL.eased, b: TL.war + .4, xf: .5, draw(c, u, t) {
  const day = pulse(t, TL.one, .3, 1.2), cam = { z: lerp(1.0, 1.08, easeIO(u / 6)), fx: 540, fy: 1400 };
  plane(c, cam, 0, (c) => {
    SKY.night(c); stars(c, 60, 3, t, .7);
    const m = ((t - TL.eased) * .9) % 1; ellipse(c, lerp(150, 930, m), 360 - Math.sin(m * Math.PI) * 160, 30, 30, '#EAF0FF'); glow(c, lerp(150, 930, m), 360 - Math.sin(m * Math.PI) * 160, 160, '#C8D8FF', .4);
    if (day > 0) { c.save(); c.globalAlpha = day; SKY.gold(c); c.restore(); }
  });
  plane(c, cam, 1, (c) => {
    // the cave's rock round an opening to the sky at the top
    const R = 'M -200 -200 L 1300 -200 L 1300 2200 L -200 2200 Z M 180 620 C 160 300 360 120 540 120 C 720 120 920 300 900 620 C 860 700 220 700 180 620 Z';
    c.fillStyle = '#0C0606'; c.fill(new Path2D(R), 'evenodd');
    glow(c, 540, 1500, 800, '#FF8A3A', .25 + day * .3);
    figure(c, (f) => { f.translate(570, 1560); f.scale(.44, .44); kumbhaLying(f, { t, breath: 1 + day * 2 }); }, SIL('#0A0406', '#FFB07A', .95));
    fillPath(c, 'M -200 1580 L 1300 1580 L 1300 2200 L -200 2200 Z', '#0A0505');
  });
} });

// ---------- shot 17: "So in the war, to wake him, they piled a mountain of meat": rakshasas carry food to his sleeping head ----------
SHOTS.push({ a: TL.war, b: TL.noise + .4, xf: .5, draw(c, u, t) {
  const h = easeOut(seg(t, TL.war + .6, TL.meat + .6)), cam = { z: lerp(1.0, 1.06, easeIO(u / 4.8)), fx: 540, fy: 1400 };
  plane(c, cam, 0, (c) => { SKY.hall(c); glow(c, 540, 1500, 900, '#FF8A3A', .35); });
  plane(c, cam, .3, (c) => pillars(c, 420, 1700, 540, '#1A0A08', t, 7, 44));
  plane(c, cam, 1, (c) => {
    fillPath(c, 'M -200 1720 L 1300 1720 L 1300 2200 L -200 2200 Z', '#120806');
    // his sleeping head, lying on its side, filling the right of the frame
    figure(c, (f) => { f.translate(860, 1460); f.rotate(-Math.PI / 2); f.scale(3, 3); f.translate(0, 815); kumbhaHead(f, { t, expr: 'sleep' }); }, { ...FIRE_FX, tint: ['#1A0806', .35] });
    meatHeap(c, 300, 1740, 520, 120 + h * 480, t, Math.min(1, h * 3));
    for (let i = 0; i < 5; i++) { const q = ((t * .25 + i / 5) % 1), x = lerp(-80, 260, q); figure(c, (f) => { f.translate(x, 1800 + (i % 2) * 40); f.scale(.2, .2); rakshasaSil(f, { t, kind: 'carry', ph: i }); }, SIL('#0A0406', '#FFB07A', .95)); }
  });
} });

// ---------- shot 18: conches and drums so loud the birds fall from the sky ----------
SHOTS.push({ a: TL.noise, b: TL.eleph + .4, xf: .4, draw(c, u, t) {
  const [sx, sy] = shake(t, TL.noise + .3, 6, 1), cam = { z: lerp(1.0, 1.08, easeIO(u / 3.4)), fx: 540, fy: 1400, x: sx * (t < TL.eleph ? 1 : 0), y: sy };
  plane(c, cam, 0, (c) => { SKY.storm(c); glow(c, 540, 1400, 800, '#FF6A2A', .35); });
  plane(c, cam, .3, (c) => birds(c, t, { n: 30, seed: 8, y0: 200, h: 400, fall: seg(t, TL.birds - .4, TL.birds + 1.6) * 1.5, col: '#120608', k: 1.4 }));
  plane(c, cam, .6, (c) => figure(c, (f) => { f.translate(560, 1500); f.scale(.4, .4); kumbhaLying(f, { t }); }, SIL('#0A0406', '#FF9A6A', .95)));
  plane(c, cam, 1, (c) => {
    for (let i = 0; i < 4; i++) { const p = (t * 1.6 + i * .25) % 1; c.save(); c.globalAlpha = 1 - p; strokePath(c, `M ${540 - 900 * p} 1600 A ${900 * p} ${500 * p} 0 0 1 ${540 + 900 * p} 1600`, '#FFC09A', 4); c.restore(); }
    fillPath(c, 'M -200 1700 L 1300 1700 L 1300 2200 L -200 2200 Z', '#0A0406');
    figure(c, (f) => { for (let i = 0; i < 6; i++) { f.save(); f.translate(90 + i * 180, 1980 + (i % 2) * 30); f.scale(.36, .36); rakshasaSil(f, { t, kind: i % 2 ? 'drum' : 'conch', ph: i * 1.3 }); f.restore(); } }, SIL('#08040A', '#FFB07A', .95));
  });
} });

// ---------- shot 19: "and ran a THOUSAND elephants over him": a line of elephants running over the sleeping giant ----------
const BELLY = [[-800, -210], [-540, -330], [-260, -440], [-120, -490], [40, -470], [140, -360], [300, -230], [600, -200], [930, -150]];
const bellyY = (x) => { for (let i = 1; i < BELLY.length; i++) if (x <= BELLY[i][0]) { const [x0, y0] = BELLY[i - 1], [x1, y1] = BELLY[i]; return lerp(y0, y1, (x - x0) / (x1 - x0)); } return BELLY[BELLY.length - 1][1]; };
SHOTS.push({ a: TL.eleph, b: TL.yawn + .4, xf: .3, draw(c, u, t) {
  const [sx, sy] = shake(t, t, 5, 1), cam = { z: lerp(1.0, 1.06, easeIO(u / 3)), fx: 540, fy: 1500, x: sx * .6, y: sy * .6 };
  plane(c, cam, 0, (c) => { SKY.hall(c); glow(c, 540, 1500, 900, '#FF8A3A', .35); });
  plane(c, cam, .3, (c) => pillars(c, 420, 1700, 540, '#1A0A08', t, 7, 44));
  plane(c, cam, 1, (c) => {
    const X = 560, Y = 1720, K = .5;
    figure(c, (f) => { f.translate(X, Y); f.scale(K, K); kumbhaLying(f, { t, breath: .4 }); }, SIL('#0A0406', '#FFB07A', .95));
    figure(c, (f) => { for (let i = 0; i < 9; i++) { const lx = ((t - TL.eleph) * 520 + i * 260) % 2300 - 1250; f.save(); f.translate(X + lx * K, Y + bellyY(lx) * K + 6); f.scale(.38, .38); elephantSide(f, { t: t + i * .3, col: '#000' }); f.restore(); } }, SIL('#0A0406', '#FFC09A', .95));
    fillPath(c, 'M -200 1720 L 1300 1720 L 1300 2200 L -200 2200 Z', '#0A0505');
  });
  plane(c, cam, 1.2, (c) => motes(c, { n: 60, seed: 13, box: [-100, 1300, W + 100, 1800], r: 4, col: '#C8A080', a: .4, vx: 60, vy: -30, t }));
} });

// ---------- shot 20: "He woke up yawning, and HUNGRY.": the face: the yawn, then the eyes open blazing ----------
SHOTS.push({ a: TL.yawn, b: TL.ask + .4, xf: .3, draw(c, u, t) {
  const hg = t > TL.hungry - .05, [sx, sy] = shake(t, TL.hungry, 16), cam = { z: lerp(1.0, 1.1, easeIO(u / 3.2)) + (hg ? .04 : 0), fx: 540, fy: 1250, x: sx, y: sy };
  plane(c, cam, 0, (c) => { SKY.hall(c); glow(c, 540, 1300, 700, '#FF7A2A', .3 + (hg ? .2 : 0)); });
  plane(c, cam, 1, (c) => faceAt(c, 540, 1280, 5.2, { t, expr: t < TL.yawning - .2 ? 'sleep' : t < TL.hungry - .05 ? 'yawn' : 'scream', eyes: hg ? 1.4 : 1, look: [0, .2] }));
} });

// ---------- shot 21: asleep again in his cave, snoring: the call-out ----------
SHOTS.push({ a: TL.ask, b: TL.card + .5, xf: .6, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.06, easeIO(u / 6)), fx: 540, fy: 1500 };
  plane(c, cam, 1, (c) => {
    cave(c, t, { torches: [[140, 1000], [940, 1000]] });
    figure(c, (f) => { f.translate(570, 1600); f.scale(.44, .44); kumbhaLying(f, { t, breath: 1.4 }); }, SIL('#0A0406', '#FFB07A', .95));
    fillPath(c, 'M -200 1620 L 1300 1620 L 1300 2200 L -200 2200 Z', '#0A0505');
    // the snore: a puff of breath from his mouth, every breath
    const q = (t * 1.1 / TAU) % 1; for (let i = 0; i < 3; i++) { const p = (q + i / 3) % 1; ellipse(c, 570 - 900 * .44 + p * 120 - 40, 1600 - 330 * .44 - p * 200, 14 + p * 40, 10 + p * 26, rgba('#E8D8C8', .3 * (1 - p))); }
  });
  plane(c, cam, 1.2, (c) => motes(c, { n: 30, seed: 15, box: [-100, 800, W + 100, 1900], r: 3, col: '#FFC890', a: .4, vx: 6, vy: -20, t }));
} });

// ---------- shot 22: the follow card ----------
SHOTS.push({ a: TL.card, b: TL.end + 1, xf: .6, draw(c, u, t) {
  sky(c, [[0, '#04100E'], [900, '#0F2A27'], [1920, '#050E0C']]);
  glow(c, 520, 1000, 760, '#2E5F5A', .55, 'screen');
  motes(c, { n: 60, seed: 61, box: [-50, 300, W + 50, 1900], r: 3, col: '#F4C46A', a: .6, vx: 6, vy: -26, t });
  const X = 540, pk = (d) => u - d;
  picture(c, PICS.logo, X, 520, 132, 132, { pop: pk(.2), r: 66 });
  text(c, 'KUMBHAKARNA', X, 668, '700 64px Cinzel', '#F4C46A', { pop: pk(.4), glow: ['rgba(244,196,106,.55)', 26], spacing: 3, maxW: 860 });
  const k = popK(pk(.6));
  if (k > .01) { glow(c, X, 980, 300 * k, '#FFC870', .3); figure(c, (f) => { f.translate(X, 1000); f.scale(1.25 * k, 1.25 * k); f.translate(0, 815); kumbhaHead(f, { t, expr: 'sleep' }); }, { tint: ['#2E5F5A', .12], edge: { col: '#FFE8B0', w: 2.2, a: .8 }, rim: { col: '#FFE2A8', dx: 0, dy: -4, a: .9, blur: 1 } }); }
  text(c, 'Stories of Shiva and the gods', X, 1250, '42px Marcellus', '#FBE0CF', { pop: pk(1.0), maxW: 840 });
  const kk = popK(pk(1.3)) * (1 + .03 * Math.max(0, Math.sin(t * 5)));
  if (kk > .01) { c.save(); c.translate(X, 1370); c.scale(kk, kk); c.fillStyle = '#F15A24'; c.shadowColor = 'rgba(241,90,36,.6)'; c.shadowBlur = 30; c.beginPath(); c.roundRect(-300, -48, 600, 96, 48); c.fill(); c.restore(); }
  text(c, 'Follow @therishikatha', X, 1373, '700 50px Poppins', '#FFFFFF', { pop: pk(1.3), maxW: 540 });
  text(c, 'rishikatha.com', X, 1470, '500 36px Poppins', '#CFE3DF', { pop: pk(1.6) });
} });

// ---------- flashes ----------
POST.push((c, t) => {
  flash(c, .4 * pulse(t, TL.tongue, .05, 3), '#FFF0C8', 'screen');     // his TONGUE
  flash(c, .5 * pulse(t, TL.vajra, .03, 3), '#DCE8FF', 'screen');      // the vajra
  flash(c, .4 * pulse(t, TL.stab, .05, 3), '#FFFFFF', 'screen');       // stabbed with the tusk
  flash(c, .3 * pulse(t, TL.mouth, .1, 2), '#FFF0C8', 'screen');       // into his mouth
  flash(c, .3 * pulse(t, TL.sleep, .05, 2), '#FFE8B0', 'screen');      // SLEEP
  flash(c, .35 * pulse(t, TL.be, .1, 1.6), '#FFE8B0', 'screen');       // so be it
  flash(c, .3 * pulse(t, TL.one, .2, 1.6), '#FFE8B0', 'screen');       // one day awake
  flash(c, .45 * pulse(t, TL.hungry, .03, 2.4), '#FFB08A', 'screen');  // HUNGRY
});

// ---------- captions (from the voice) ----------
// the hook's first chunk is up and lit at frame 0 (the thumbnail)
VO.caps.forEach((k, i) => say(i ? k.a : -.35, k.b, k.text, { at: i ? k.at : k.at.map(() => -.35), y: k.y, size: k.size }));
