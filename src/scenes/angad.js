// angad.js: ad 20, "RAVANA lifted KAILASH. His whole court couldn't move ONE monkey's FOOT." The Angad–Ravan samvad
// from Tulsidas' Ramcharitmanas (Lanka Kand, doha 17–35) in the Cinematic style (src/cine.js): Ram sends Angad to offer
// peace; the court rises when he walks in; "Who are you, monkey?" "Angad, son of your friend Vali"; "go and ask him in
// ten days"; the many-Ravanas roast (Sahasrabahu, Vali's arm); Ravana's boast (Kailash, his heads for Shiva); Angad
// strikes the ground and the crowns fall; he flings them across the sea and Hanuman catches them for Ram; the foot
// planted ("move it and Ram turns back"); warriors as strong as Meghnad can't move it; Ravana comes down himself and
// grabs it; "Why grab MY feet? Fall at RAM's feet."; Ravana sits, head bowed, his glory gone; Angad at Ram's feet.
// The name call-out, the Books 1–3 card. Times are in TL; tools/angad_sfx.mjs uses the same ones.
const TL = { hook: 0, send: 4.6, peace: 7.2, court: 9.4, rise: 11.4, who: 13.6, intro: 15.8, friend: 18.2, ten: 20.4,
  roast: 22.8, sahas: 25.0, armpit: 27.2, which: 29.4, boast: 31.6, heads: 33.8, strike: 35.8, hit: 36.6, crowns: 38.0,
  fling: 40.0, catch: 42.2, foot: 44.4, plant: 45.0, close: 45.7, stakes: 46.6, rush: 49.2, fail: 51.8, slip: 52.2,
  down: 54.0, grab: 56.4, seize: 58.7, lift: 58.8, gone: 60.6, bow: 62.6, jai: 64.7, stand: 66.6, ask: 67.4, card: 70.4, end: 75.4 };

// ---------- shared pieces ----------
const shake = (t, k) => ({ x: Math.sin(t * 53) * k, y: Math.cos(t * 41) * k });
const hitK = (t, t0, d = 3) => t < t0 - .02 ? 0 : Math.exp(-(t - t0) * d);
const FIRE_LIT = (a = 0) => ({ tint: ['#1A0806', .22], edge: { col: '#FFB070', w: 2.4, a: .7 }, rim: { col: '#FFD08A', dx: 6, dy: -3, a: .85 + a, blur: 1 } });
const FACE_LIT = (a = 0) => ({ tint: ['#1A0806', .12], edge: { col: '#FFB070', w: 3, a: .35 }, rim: { col: '#FFD08A', dx: 9, dy: -4, a: .75 + a, blur: 1.5 } });
const SIL = (col, rim, a = .9) => ({ tint: [col, a], edge: { col: rim, w: 2.2, a: .85 }, rim: { col: rim, dx: 0, dy: -3, a: .9 } });
const DUSK = (c) => { sky(c, [[0, '#120A22'], [600, '#2E1A40'], [1050, '#7A3A4A'], [1250, '#D07A50'], [1400, '#3A2030']]); };
const DAWN = (c) => { sky(c, [[0, '#1E1434'], [560, '#4E2A4A'], [1000, '#C9663D'], [1350, '#FFCF86'], [1560, '#FFE2A8']]); glow(c, 540, 1300, 900, '#FFB45A', .5); ellipse(c, 540, 1330, 220, 220, '#FFE9B8'); };
// Angad at (x, y) (his feet), scale k; Ravana seated on his throne at (x, y), scale k
const angadFig = (c, x, y, k, t, o = {}, light = FIRE_LIT()) => figure(c, (f) => { f.translate(x, y); f.scale(k, k); vanara(f, { t, ...o }); }, light);
const ravanaThrone = (c, x, y, k, t, o = {}, light = FIRE_LIT(), dim = 0) => figure(c, (f) => { f.translate(x, y); f.scale(k, k); goldThrone(f, { layer: 'back', dim }); ravana(f, { t, pose: 'sit', ...o }); goldThrone(f, { layer: 'front', dim }); }, light);
// the row of heads, close: centred at (x, y), scale k
const headsClose = (c, x, y, k, t, o = {}, light = FACE_LIT()) => figure(c, (f) => { f.translate(x, y + 815 * k); f.scale(k, k); ravanaHeads(f, { t, ...o }); }, light);
const angadHead = (c, x, y, k, t, o = {}, light = FACE_LIT()) => figure(c, (f) => { f.translate(x, y); f.scale(k, k); f.translate(0, 815); vanaraHead(f, { t, ...o }); }, light);
// the foot, close, on the court floor at (x, y), scale k: dark at the top so the captions read over the shin
const FX = 330, FY = 1560, FK = 2.4;   // the foot close-up's framing: the sole on Lanka's floor, the hem out of frame
const footFig = (c, x, y, k, t, o = {}, rim = 0) => figure(c, (f) => { f.translate(x, y); f.scale(k, k); vanaraFoot(f, { t, ...o }); },
  { tint: ['#1A0806', .12], grade: [[320, 'rgba(8,3,3,.86)'], [1080, 'rgba(0,0,0,0)']], edge: { col: '#FFB070', w: 2.6, a: .6 }, rim: { col: mixCol('#FFD08A', '#FFF2C0', rim), dx: 8, dy: -4, a: .85 + rim, blur: 1 } });
// the court floor and pillars behind a foot close-up
function footSet(c, cam, t, gold = 0) {
  plane(c, cam, 0, (c) => { hallSky(c); glow(c, 400, 1500, 900, '#FF7A26', .5); if (gold) glow(c, 200, 700, 900, '#FFD890', .35 * gold); });
  plane(c, cam, .5, (c) => pillars(c, 260, 1520, 400, '#120806', t, 5, 60));
  plane(c, cam, .8, (c) => courtFloor(c, 1520, t));
}
const RV_HAND = '#8A5C3E', RV_BAND = '#D9A441';

// ---------- shot 1: the hook (the foot on Lanka's floor; many hands can't move it) ----------
const GRIPS = [[[1260, 640], [500, 930], 1, 1.0], [[-200, 820], [170, 1000], 2, 1.25], [[1260, 1240], [540, 1080], 3, 1.5], [[-200, 1300], [160, 1110], 4, 1.75]];
SHOTS.push({ a: TL.hook, b: TL.send + .3, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.08, easeIO(u / 4.9)), fx: 400, fy: 1200, ...shake(t, seg(t, 2.6, 2.9) * .8) };
  footSet(c, cam, t);
  plane(c, cam, 1, (c) => {
    glow(c, 420, 1560, 560, '#FFB060', .3);
    footFig(c, FX, FY, FK, t, { press: .2 });
    // the warriors' hands: in from both sides, gripping the shin and heaving (it doesn't move)
    const sk = seg(t, 2.6, 4.6);
    for (const [S, T2, sd, d] of GRIPS) {
      const r = easeOut(seg(t, d, d + .7)); if (r <= 0) continue;
      figure(c, (f) => grabHand(f, S, [lerp(S[0], T2[0], r), lerp(S[1], T2[1], r)], 1.5, t, { col: '#54444C', band: '#7A7A86', shake: sk, seed: sd, bend: sd % 2 ? 70 : -70 }), FIRE_LIT());
    }
  });
  plane(c, cam, 1.2, (c) => embers(c, 400, 1560, t, 40, 3, 900, 1300));
} });

// ---------- shot 2: Suvela at dusk: Ram sends Angad; golden Lanka across the sea ----------
SHOTS.push({ a: TL.send, b: TL.court + .3, xf: .4, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.1, easeIO(u / 5)), fx: 560, fy: 1300 };
  plane(c, cam, 0, (c) => { DUSK(c); glow(c, 860, 1180, 500, '#FFB060', .35); stars(c, 50, 4, t, .4); });
  plane(c, cam, .15, (c) => clouds(c, [[0, 700, 800, 21, 10], [600, 860, 700, 22, 14, true]], t, PALETTES.dawn, .55));
  plane(c, cam, .3, (c) => { c.save(); c.translate(860, 1230); c.scale(.42, .42); c.translate(-540, -1230); lanka(c, 1230, t, 0, 9); c.restore(); });
  plane(c, cam, .5, (c) => sea(c, 1228, t, .9));
  plane(c, cam, 1, (c) => {
    figure(c, (f) => {
      fillPath(f, 'M -200 1560 C 100 1500 500 1500 760 1560 C 860 1590 900 1640 920 1920 L -200 1920 Z', '#0A0710');
      f.save(); f.translate(300, 1560); f.scale(-.82, .82); ramSil(f, { t, bless: easeOut(seg(t, TL.peace - .4, TL.peace + .4)), wind: .6 }); f.restore();
      f.save(); f.translate(560, 1560); f.scale(-.62, .62); vanaraKneel(f, { t, bow: .35 }); f.restore();
    }, SIL('#0A0610', '#FFB27A', .86));
  });
  plane(c, cam, 1.2, (c) => motes(c, { n: 30, seed: 22, box: [-100, 600, W + 100, 1900], r: 2.6, col: '#FFD8A0', a: .4, vx: 20, vy: -10, t }));
} });

// ---------- shot 3: Angad walks into the court; the courtiers rise (over Ravana's shoulders) ----------
SHOTS.push({ a: TL.court, b: TL.who + .3, xf: .4, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.06, easeIO(u / 4.4)), fx: 540, fy: 1100 }, rise = seg(t, TL.rise - .2, TL.rise + 1.2), wk = easeIO(u / 4.2);
  court(c, cam, t, { top: 360, floor: 1240, n: 6 });
  plane(c, cam, .8, (c) => { glow(c, 540, 900, 300, '#FFC870', .3); fillPath(c, 'M 420 1240 L 420 760 C 420 690 660 690 660 760 L 660 1240 Z', rgba('#FFB060', .18)); });   // the far doorway
  plane(c, cam, .9, (c) => { const k = lerp(.36, .5, wk); angadFig(c, 540, lerp(1250, 1300, wk), k, t, { pose: 'walk', expr: 'calm', step: frac(t * 1.1) }, FIRE_LIT()); });
  plane(c, cam, 1, (c) => {
    figure(c, (f) => { crowd(f, -60, 360, 1360, 4, 1.25, t, 0, '#0E0606', 3, rise); crowd(f, 720, 1140, 1360, 4, 1.25, t, 0, '#0E0606', 7, rise); }, SIL('#0E0606', '#FFB070', .9));
    figure(c, (f) => { crowd(f, -120, 330, 1560, 3, 1.6, t, 0, '#0A0404', 11, rise * .9); crowd(f, 750, 1200, 1560, 3, 1.6, t, 0, '#0A0404', 13, rise * .9); }, SIL('#0A0404', '#FFA060', .92));
  });
  plane(c, cam, 1.15, (c) => headsClose(c, 540, 1650, 1.3, t, { expr: 'calm' }, SIL('#0A0405', '#FFB070', .93)));
} });

// ---------- shot 4: Ravana laughs on his throne: "Who are you, monkey?" ----------
SHOTS.push({ a: TL.who, b: TL.intro + .2, xf: .3, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.1, easeIO(u / 2.4)), fx: 540, fy: 1000 };
  court(c, cam, t, { top: 300, floor: 1700, n: 5 });
  plane(c, cam, 1, (c) => ravanaThrone(c, 540, 1800, .95, t, { expr: 'laugh' }, FIRE_LIT()));
  plane(c, cam, 1.2, (c) => embers(c, 540, 1900, t, 30, 8, 1000, 1200));
} });

// ---------- shot 5: Angad, close: "ANGAD. Son of your friend, VALI." ----------
SHOTS.push({ a: TL.intro, b: TL.friend + .2, xf: .2, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.06, easeIO(u / 2.6)), fx: 540, fy: 900 };
  plane(c, cam, 0, (c) => { hallSky(c); glow(c, 760, 1200, 700, '#FF7A26', .4); });
  plane(c, cam, .4, (c) => pillars(c, 200, 1900, 800, '#120806', t, 4, 80));
  plane(c, cam, 1, (c) => angadHead(c, 540, 860, 6.2, t, { expr: 'calm' }));
} });

// ---------- shot 6: Ravana's heads lean in: "And how is my friend?" ----------
SHOTS.push({ a: TL.friend, b: TL.ten + .2, xf: .2, draw(c, u, t) {
  const cam = { z: lerp(1.04, 1.12, easeIO(u / 2.4)), fx: 540, fy: 900 };
  plane(c, cam, 0, (c) => { hallSky(c); glow(c, 540, 1300, 800, '#FF7A26', .45); });
  plane(c, cam, .4, (c) => pillars(c, 200, 1900, 540, '#120806', t, 4, 80));
  plane(c, cam, 1, (c) => headsClose(c, 540, 900, 1.25, t, { expr: 'smirk', look: [0, .2] }));
} });

// ---------- shot 7: Angad smirks: "Go and ask him. In TEN days." ----------
SHOTS.push({ a: TL.ten, b: TL.roast + .2, xf: .2, draw(c, u, t) {
  const cam = { z: lerp(1.04, 1.12, easeIO(u / 2.6)), fx: 540, fy: 860 };
  plane(c, cam, 0, (c) => { hallSky(c); glow(c, 760, 1200, 700, '#FF7A26', .4); });
  plane(c, cam, .4, (c) => pillars(c, 200, 1900, 800, '#120806', t, 4, 80));
  plane(c, cam, 1, (c) => angadHead(c, 540, 860, 6.2, t, { expr: t > TL.ten + .9 ? 'smirk' : 'calm', look: [-.3, 0] }));
} });

// ---------- shot 8: the roast: "I've heard of MANY Ravanas." ----------
SHOTS.push({ a: TL.roast, b: TL.sahas + .3, xf: .3, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.08, easeIO(u / 2.5)), fx: 600, fy: 1200 };
  court(c, cam, t, { fx: 600, top: 300, floor: 1640, n: 6 });
  plane(c, cam, 1, (c) => angadFig(c, 600, 1860, 1.15, t, { pose: 'stand', expr: 'smirk', look: [-.4, 0] }));
  plane(c, cam, 1.2, (c) => embers(c, 600, 1900, t, 30, 9, 1000, 1200));
} });

// ---------- shot 9: one was caught by Sahasrabahu (a memory) ----------
SHOTS.push({ a: TL.sahas, b: TL.armpit + .3, xf: .3, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.08, easeIO(u / 2.5)), fx: 540, fy: 1000 };
  plane(c, cam, 0, (c) => { sky(c, [[0, '#1A0E06'], [900, '#5A3014'], [1500, '#A8682E'], [1920, '#2A1408']]); glow(c, 540, 900, 700, '#FFD890', .3); });
  plane(c, cam, .3, (c) => { ridge(c, 1260, 100, 61, '#2A1408', { freq: .004 }); });
  plane(c, cam, 1, (c) => {
    fillPath(c, 'M -200 1300 C 300 1280 800 1280 1300 1300 L 1300 2100 L -200 2100 Z', '#140A04');
    figure(c, (f) => sahasrabahu(f, 330, 1300, .8, t), SIL('#140A06', '#FFD890', .92));
  });
  POSTMEM(c, t, Math.min(seg(t, TL.sahas, TL.sahas + .3), 1 - seg(t, TL.which - .2, TL.which + .1)));
} });

// ---------- shot 10: one lived under Vali's arm (a memory) ----------
SHOTS.push({ a: TL.armpit, b: TL.which + .3, xf: .3, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.08, easeIO(u / 2.5)), fx: 540, fy: 1000 }, sq = Math.sin(t * 9) * 4;
  plane(c, cam, 0, (c) => { sky(c, [[0, '#1A0E06'], [900, '#5A3014'], [1500, '#A8682E'], [1920, '#2A1408']]); glow(c, 540, 800, 700, '#FFD890', .3); });
  plane(c, cam, .3, (c) => { ridge(c, 1540, 80, 71, '#2A1408', { freq: .004 }); });
  plane(c, cam, 1, (c) => {
    fillPath(c, 'M -200 1600 C 300 1570 800 1570 1300 1600 L 1300 2100 L -200 2100 Z', '#140A04');
    // Ravana's ten heads pinned under Vali's arm (in colour, so the two shapes don't merge), legs kicking below
    figure(c, (f) => {
      for (const s of [-1, 1]) limb(f, [[880 + s * 40, 980], [910 + s * 90, 1100 + Math.sin(t * 14 + s) * 26], [930 + s * 120, 1210 + Math.sin(t * 14 + s) * 36]], [60, 50, 34], RV.skin);
      f.save(); f.translate(860, 860 + sq); f.scale(.66, .66); f.translate(0, 815); ravanaHeads(f, { t, exprs: ['scream', 'grit', 'scream', 'grit', 'scream', 'grit', 'scream', 'grit', 'scream', 'grit'], look: [-.6, -.4] }); f.restore();
    }, { tint: ['#3A1A08', .15], edge: { col: '#FFD890', w: 2.4, a: .7 }, rim: { col: '#FFE6B0', dx: -5, dy: -3, a: .8 } });
    // Vali, huge, his arm clamped down over them
    figure(c, (f) => { f.save(); f.translate(430, 1600); f.scale(1.25, 1.25); vanara(f, { t, pose: 'stand', arms: 'clamp', expr: 'calm', tail: false }); f.restore(); }, SIL('#140A06', '#FFD890', .92));
  });
  POSTMEM(c, t, 1);
} });

// ---------- shot 11: "Which one are YOU?" ten faces ----------
SHOTS.push({ a: TL.which, b: TL.boast + .3, xf: .3, draw(c, u, t) {
  const cam = { z: lerp(1.02, 1.1, easeIO(u / 2.5)), fx: 540, fy: 900, ...shake(t, .6) };
  plane(c, cam, 0, (c) => { hallSky(c); glow(c, 540, 1300, 800, '#FF5A1E', .5); });
  plane(c, cam, .4, (c) => pillars(c, 200, 1900, 540, '#120806', t, 4, 80));
  plane(c, cam, 1, (c) => headsClose(c, 540, 900, 1.25, t, { exprs: ['scream', 'grit', 'sing', 'smirk', 'grit', 'sing', 'scream', 'grit', 'calm', 'sing'], look: [.5, .3] }));
} });

// ---------- shot 12: Ravana's boast: Kailash, his heads for Shiva ----------
SHOTS.push({ a: TL.boast, b: TL.strike + .3, xf: .3, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.08, easeIO(u / 4.2)), fx: 540, fy: 1100, ...shake(t, .5) }, v1 = Math.min(seg(t, TL.boast + .2, TL.boast + .8), 1 - seg(t, TL.heads - .2, TL.heads + .3)), v2 = seg(t, TL.heads, TL.heads + .6);
  plane(c, cam, 0, (c) => { sky(c, [[0, '#12040A'], [600, '#3A0A12'], [1250, '#8A1E16'], [1750, '#D0461E']]); glow(c, 540, 1500, 900, '#FF5A1E', .45); });
  plane(c, cam, .2, (c) => {
    if (v1 > 0) { c.save(); c.globalAlpha = v1; glow(c, 540, 700, 500, '#FFD890', .35); uprooted(c, 540, 460, 300, t, { rock: '#3A1A10', snow: '#E8C890', snowSh: '#A0703A' }); c.restore(); }
    if (v2 > 0) { c.save(); c.globalAlpha = v2; linga(c, 540, 860, 1.0, { glow: 1, col: '#2A1008' }); c.restore(); }
  });
  plane(c, cam, .5, (c) => { ridge(c, 1640, 80, 33, '#12050A', { freq: .004 }); });
  plane(c, cam, 1, (c) => figure(c, (f) => { f.translate(540, 1880); f.scale(.86, .86); ravana(f, { t, pose: 'stand', weapons: true, expr: 'scream' }); },
    { tint: ['#2A0A10', .2], edge: { col: '#FF9A6A', w: 2.4, a: .7 }, rim: { col: '#FFB08A', dx: 0, dy: -5, a: .8, blur: 1 } }));
  plane(c, cam, 1.2, (c) => embers(c, 540, 1900, t, 50, 12, 1100, 1500));
} });

// ---------- shot 13: Angad strikes the ground ----------
SHOTS.push({ a: TL.strike, b: TL.crowns + .2, xf: .3, draw(c, u, t) {
  const h = hitK(t, TL.hit, 4), cam = { z: lerp(1.0, 1.08, easeIO(u / 2.2)), fx: 540, fy: 1300, ...shake(t, h * 14) }, down = t >= TL.hit - .08;
  court(c, cam, t, { top: 360, floor: 1620, n: 6 });
  plane(c, cam, .9, (c) => {   // the courtiers behind, thrown off their feet
    const fall = easeOut(seg(t, TL.hit, TL.hit + .5));
    figure(c, (f) => { f.save(); f.translate(0, fall * 70); crowd(f, -60, 380, 1560, 4, 1.1, t, 0, '#0E0606', 3, 1 - fall); crowd(f, 700, 1140, 1560, 4, 1.1, t, 0, '#0E0606', 7, 1 - fall); f.restore(); }, SIL('#0E0606', '#FFB070', .9));
  });
  plane(c, cam, 1, (c) => {
    cracks(c, 540, 1780, easeOut(seg(t, TL.hit, TL.hit + .6)), t, 5);
    angadFig(c, 540, 1800, 1.2, t, down ? { pose: 'strike', expr: 'fierce' } : { pose: 'stand', arms: 'hips', expr: 'fierce' }, FIRE_LIT(h));
    shockRings(c, 540, 1790, t, [TL.hit, TL.hit + .12]);
    debris(c, [100, 1500, 980], t, TL.hit, 30, 6, '#1A0A08', '#FFB070');
  });
} });

// ---------- shot 14: Ravana's crowns fall ----------
const CROWN_T = (i) => TL.crowns + .1 + [0, 3, 6, 1, 4, 7, 2, 5, 8, 9][i] * .09;
SHOTS.push({ a: TL.crowns, b: TL.fling + .3, xf: .15, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.06, easeIO(u / 2.2)), fx: 540, fy: 900, ...shake(t, 3 * hitK(t, TL.crowns, 2)) }, k = 1.2, X = 540, Y = 860;
  plane(c, cam, 0, (c) => { hallSky(c); glow(c, 540, 1300, 800, '#FF7A26', .45); });
  plane(c, cam, .4, (c) => pillars(c, 200, 1900, 540, '#120806', t, 4, 80));
  plane(c, cam, 1, (c) => {
    const on = [...Array(10)].map((_, i) => t < CROWN_T(i));
    headsClose(c, X, Y, k, t, { exprs: on.map(v => v ? 'grit' : 'scream'), crowns: on, look: [0, -.8] });
    // each crown pops up off its head and falls (the ones flung by Angad fly up out of frame, to screen left)
    figure(c, (f) => {
      for (let i = 0; i < 10; i++) {
        const v = t - CROWN_T(i); if (v < 0) continue;
        const p = rvHeadPos(i), x0 = X + p.x * k, y0 = Y + (p.y - 75) * k, fl = i % 3 === 0;
        const x = x0 + (fl ? -900 : (hash(i) - .5) * 260) * v, y = y0 + (fl ? -1300 * v + 300 * v * v : -500 * v + 1600 * v * v), r = (hash(i * 3) - .5) * 8 * v;
        f.save(); f.translate(x, y); f.rotate(r); f.scale(k * p.s, k * p.s); rvCrown(f, { kind: i === 4 ? 'mukut' : 'crown' }); f.restore();
      }
    }, FACE_LIT());
  });
} });

// ---------- shot 15: the crowns fly across the sea like meteors; Hanuman catches them ----------
const METEOR = (i, t) => { const v = clamp((t - TL.fling - .1 - i * .35) / 2.6); return { v, x: lerp(1180, 260 + i * 60, v), y: lerp(380 + i * 70, 760 + i * 40, v) - Math.sin(v * Math.PI) * 260 }; };
SHOTS.push({ a: TL.fling, b: TL.foot + .3, xf: .3, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.08, easeIO(u / 4.4)), fx: 400, fy: 1000 }, cv = easeOut(seg(t, TL.catch, TL.catch + 1.2));
  plane(c, cam, 0, (c) => { sky(c, [[0, '#04060E'], [800, '#0E1630'], [1300, '#1E2C4E'], [1500, '#2A2848']]); stars(c, 120, 5, t, .8); });
  plane(c, cam, .2, (c) => { c.save(); c.translate(1000, 1260); c.scale(.4, .4); c.translate(-540, -1260); lanka(c, 1260, t, 0, 9); c.restore(); });
  plane(c, cam, .4, (c) => sea(c, 1258, t, .6));
  plane(c, cam, .9, (c) => {
    for (let i = 0; i < 4; i++) { const m = METEOR(i, t); if (m.v <= 0 || (i < 2 && cv > .9)) continue; const n = METEOR(i, t + .03); crownMeteor(c, m.x, m.y, .9, t, Math.atan2(n.y - m.y, n.x - m.x)); }
  });
  plane(c, cam, 1, (c) => {
    figure(c, (f) => {
      camp(f, 1660, t);
      if (t > TL.catch - .2) {   // Hanuman leaps up off the ridge to meet the first two crowns
        const hx = lerp(120, 360, cv), hy = lerp(1640, 860, cv) + Math.sin(cv * Math.PI) * -80;
        f.save(); f.translate(hx, hy); f.rotate(-.5 + cv * .3); f.scale(.6, .6); hanumanLeap(f, { t }); f.restore();
      }
    }, SIL('#06040C', '#AFC4F0', .9));
    if (cv > .9) { glow(c, 380, 760, 160, '#FFD890', .7 * (cv - .9) * 10); }
  });
} });

// ---------- shot 16: the foot planted (Angad, wide) ----------
SHOTS.push({ a: TL.foot, b: TL.close + .1, xf: .3, draw(c, u, t) {
  const h = hitK(t, TL.plant, 4), cam = { z: lerp(1.0, 1.06, easeIO(u / 1.3)), fx: 540, fy: 1400, ...shake(t, h * 12) };
  court(c, cam, t, { top: 340, floor: 1640, n: 6 });
  plane(c, cam, 1, (c) => {
    cracks(c, 390, 1790, easeOut(seg(t, TL.plant, TL.plant + .5)), t, 8);
    angadFig(c, 540, 1820, 1.1, t, { pose: 'plant', press: h, expr: 'fierce' }, FIRE_LIT(h));
    shockRings(c, 390, 1800, t, [TL.plant]);
  });
} });

// ---------- shot 17: the foot, close ----------
SHOTS.push({ a: TL.close, b: TL.rush + .3, draw(c, u, t) {
  const cam = { z: lerp(1.04, 1.14, easeIO(u / 3.8)), fx: 420, fy: 1300, ...shake(t, hitK(t, TL.close, 5) * 6) };
  footSet(c, cam, t);
  plane(c, cam, 1, (c) => { cracks(c, 640, 1560, 1, t, 8); glow(c, 420, 1560, 560, '#FFB060', .3); footFig(c, FX, FY, FK, t, { press: 1 }); });
  plane(c, cam, 1.2, (c) => embers(c, 400, 1560, t, 40, 13, 900, 1300));
} });

// ---------- shot 18: warriors as strong as Meghnad heave at it, and fall ----------
SHOTS.push({ a: TL.rush, b: TL.down + .3, xf: .3, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.06, easeIO(u / 5)), fx: 440, fy: 1500 }, fall = easeIn(seg(t, TL.slip, TL.slip + .45)), sit = easeIO(seg(t, TL.slip + .9, TL.slip + 1.5));
  court(c, cam, t, { top: 300, floor: 1600, n: 6 });
  plane(c, cam, 1, (c) => {
    angadFig(c, 720, 1800, 1.1, t, { pose: 'plant', expr: t > TL.fail ? 'smirk' : 'calm', look: [-.6, .4] });
    // a chain of rakshasas heaving at his left shin, tug-of-war; Meghnad (crowned) at the front; they topple, then sit
    figure(c, (f) => {
      for (let i = 4; i >= 0; i--) {
        const arr = easeOut(seg(t, TL.rush + .1 + i * .3, TL.rush + .7 + i * .3)); if (arr <= 0) continue;
        const x = 330 - i * 205 - (1 - arr) * 600 - fall * 60 * (i + 1) - sit * 40;
        warrior(f, x, 1800, .7, t, { pull: arr, fall: fall * (1 - sit) * (.7 + i * .08), sit, crown: i === 0, seed: i, hx: 300, hy: -200 });
      }
    }, SIL('#0E0608', '#FFB070', .92));
  });
  plane(c, cam, 1.2, (c) => embers(c, 540, 1900, t, 30, 18, 1100, 1300));
} });

// ---------- shot 19: Ravana himself comes down ----------
SHOTS.push({ a: TL.down, b: TL.grab + .3, xf: .3, draw(c, u, t) {
  const w = easeIO(u / 2.6), cam = { z: lerp(1.0, 1.08, w), fx: 540, fy: 1200, ...shake(t, .5 * Math.abs(Math.sin(t * 4))) };
  court(c, cam, t, { top: 300, floor: 1500, n: 6 });
  plane(c, cam, .8, (c) => ravanaThrone(c, 540, 1500, .45, t, { crowns: false }, SIL('#140808', '#FFB070', .7)));   // the empty throne behind him (his shape fades out of it)
  plane(c, cam, 1, (c) => figure(c, (f) => { f.translate(540, lerp(1720, 1900, w) + Math.abs(Math.sin(t * 4)) * -12); f.scale(lerp(.62, .84, w), lerp(.62, .84, w)); ravana(f, { t, pose: 'stand', front: 'down', expr: 'grit', crowns: [1, 0, 1, 0, 1, 1, 0, 1, 0, 1] }); }, FIRE_LIT()));
} });

// ---------- shot 20: he bends to grab the foot (the two of them) ----------
SHOTS.push({ a: TL.grab, b: TL.seize - .3, xf: .3, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.08, easeIO(u / 2.2)), fx: 520, fy: 1500 }, bend = easeIO(seg(t, TL.grab + .2, TL.grab + 1.2));
  court(c, cam, t, { top: 300, floor: 1620, n: 6 });
  plane(c, cam, 1, (c) => {
    figure(c, (f) => { f.translate(880, lerp(1860, 1900, bend)); f.rotate(-.1 * bend); f.scale(.86, .86); ravana(f, { t, pose: bend > .3 ? 'bow' : 'stand', front: bend > .3 ? 'grab' : 'down', expr: 'grit', crowns: [1, 0, 1, 0, 1, 1, 0, 1, 0, 1], look: [-.8, .6] }); }, FIRE_LIT());
    angadFig(c, 270, 1840, .92, t, { pose: 'plant', expr: 'smirk', look: [.6, .5] });
  });
} });

// ---------- shot 21: close: his hands close on the foot; Angad lifts it away ----------
SHOTS.push({ a: TL.seize - .4, b: TL.gone + .3, xf: .2, draw(c, u, t) {
  const lift = easeIO(seg(t, TL.lift, TL.lift + .6)), gold = seg(t, TL.lift + .4, TL.lift + 1.4), cam = { z: lerp(1.0, 1.1, easeIO(u / 2.6)), fx: 520, fy: 1300, ...shake(t, hitK(t, TL.lift + .45, 6) * 5) };
  footSet(c, cam, t, gold);
  plane(c, cam, 1, (c) => {
    glow(c, 420, 1560, 560, '#FFB060', .3);
    footFig(c, FX, FY, FK, t, { press: 1 - lift, lift }, gold * .3);
    // Ravana's two front hands, in from the top right, closing on the top of the foot, then on bare floor
    const hk = easeOut(seg(t, TL.seize - .35, TL.seize)), miss = easeOut(seg(t, TL.lift + .1, TL.lift + .5));
    for (const [S, T2, sd] of [[[1260, 760], [lerp(700, 690, miss), lerp(1400, 1500, miss)], 1], [[1260, 1180], [lerp(880, 860, miss), lerp(1470, 1520, miss)], 2]]) {
      if (hk <= 0) continue;
      figure(c, (f) => grabHand(f, S, [lerp(S[0], T2[0], hk), lerp(S[1], T2[1], hk)], 1.55, t, { col: RV_HAND, band: RV_BAND, shake: miss * .5, seed: sd, bend: 90 }), FIRE_LIT());
    }
  });
} });

// ---------- shot 22: Ravana sits, head bowed, his glory gone ----------
SHOTS.push({ a: TL.gone, b: TL.bow + .3, xf: .4, draw(c, u, t) {
  const cam = { z: lerp(1.08, 1.0, easeIO(u / 2.6)), fx: 540, fy: 1000 }, d = easeIO(seg(t, TL.gone, TL.bow));
  court(c, cam, t, { top: 300, floor: 1700, n: 5 });
  plane(c, cam, 1, (c) => ravanaThrone(c, 540, 1800, .95, t, { expr: 'calm', look: [0, 1], crowns: [1, 0, 1, 0, 1, 1, 0, 1, 0, 1], front: 'rest' },
    { tint: ['#0A0406', .22 + .5 * d], edge: { col: '#FFB070', w: 2.4, a: .7 - .4 * d }, rim: { col: '#FFD08A', dx: 6, dy: -3, a: .85 - .6 * d, blur: 1 } }, .3 + .6 * d));
  plane(c, cam, 0, (c) => flash(c, .35 * d, '#000000', 'source-over'));
} });

// ---------- shot 23: dawn on Suvela: Angad at Ram's feet ----------
SHOTS.push({ a: TL.bow, b: TL.stand + .3, xf: .5, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.08, easeIO(u / 2.6)), fx: 540, fy: 1400 };
  plane(c, cam, 0, (c) => { DAWN(c); rays(c, 540, 1330, { n: 18, dir: -Math.PI / 2, spread: Math.PI * 1.2, len: 1400, w: 160, col: '#FFE2A8', a: .25, t, seed: 3 }); });
  plane(c, cam, .3, (c) => sea(c, 1500, t, .2));
  plane(c, cam, 1, (c) => figure(c, (f) => {
    fillPath(f, 'M -200 1620 C 200 1580 800 1580 1300 1620 L 1300 2100 L -200 2100 Z', '#140A10');
    f.save(); f.translate(720, 1620); f.scale(.9, .9); ramSil(f, { t, bless: easeOut(seg(t, TL.bow + .8, TL.bow + 1.6)) }); f.restore();
    f.save(); f.translate(300, 1620); f.scale(.8, .8); vanaraKneel(f, { t, bow: .2 + .8 * easeIO(seg(t, TL.bow, TL.bow + 1.2)) }); f.restore();
  }, { ...LIGHTS.dawnBack, tint: ['#1A0C14', .88] }));
  plane(c, cam, 1.2, (c) => motes(c, { n: 40, seed: 31, box: [-100, 600, W + 100, 1900], r: 3, col: '#FFE2A8', a: .5, vx: 0, vy: -30, t }));
} });

// ---------- shot 24: Angad in the dawn: JAI SHRI RAM, the ask ----------
SHOTS.push({ a: TL.stand, b: TL.card + .1, xf: .3, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.08, easeIO(u / 4.8)), fx: 540, fy: 1300 };
  plane(c, cam, 0, (c) => { DAWN(c); rays(c, 540, 1330, { n: 20, dir: -Math.PI / 2, spread: Math.PI * 1.3, len: 1500, w: 180, col: '#FFE2A8', a: .3, t, seed: 5 }); });
  plane(c, cam, .3, (c) => sea(c, 1500, t, .2));
  plane(c, cam, 1, (c) => { fillPath(c, 'M -200 1760 C 200 1730 800 1730 1300 1760 L 1300 2100 L -200 2100 Z', '#140A10');
    angadFig(c, 540, 1800, .95, t, { pose: 'bow', expr: 'calm' }, { tint: ['#2A1018', .3], edge: { col: '#FFD9A0', w: 2.4, a: .85 }, rim: { col: '#FFF0C8', dx: 0, dy: -5, a: .9, blur: 1 } }); });
  plane(c, cam, 1.2, (c) => motes(c, { n: 50, seed: 41, box: [-100, 400, W + 100, 1900], r: 3, col: '#FFE2A8', a: .55, vx: 0, vy: -40, t }));
} });

// ---------- the card ----------
SHOTS.push({ a: TL.card, b: TL.end + .1, draw(c, u, t) {
  rkCardCine(c, u, t, { title: 'JAI SHRI RAM', line: 'Picture books of our gods, for kids', price: 'Books 1–3 · set of 3 for ₹500' });
} });

// the sepia memory wash (shots 9, 10), drawn inside the shot so it crossfades with it
function POSTMEM(c, t, a) { memory(c, t, a); }

// ---------- flashes ----------
POST.push((c, t) => {
  // dark pools behind captions that sit on busy or bright shots
  for (const [a, b, y, sy] of [[TL.who, TL.intro, 1440, .4], [TL.friend, TL.ten, 1440, .4], [TL.which, TL.boast, 1440, .4], [TL.boast, TL.strike, 1460, .4],
    [TL.crowns, TL.fling, 1440, .4], [TL.gone, TL.bow, 1440, .4], [TL.bow, TL.stand, 580, .45], [TL.stand, TL.card, 600, .5]]) {
    const dk = Math.min(seg(t, a - .1, a + .2), 1 - seg(t, b - .2, b)); if (dk <= 0) continue;
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.translate(540, y); c.scale(1, sy); glow(c, 0, 0, 620, '#0A0204', .75 * dk, 'source-over'); c.restore();
  }
  flash(c, .5 * hitK(t, TL.sahas, 5) * (t < TL.armpit ? 1 : 0), '#FFE8C0');
  flash(c, .4 * hitK(t, TL.armpit, 5) * (t < TL.which ? 1 : 0), '#FFE8C0');
  flash(c, .9 * hitK(t, TL.hit, 3.5) * (t < TL.crowns ? 1 : 0), '#FFF2D8');
  flash(c, .22 * hitK(t, TL.catch + 1.1, 4) * (t < TL.foot ? 1 : 0), '#FFE2A0');
  flash(c, .85 * hitK(t, TL.plant, 3.5) * (t < TL.rush ? 1 : 0), '#FFF2D8');
  flash(c, .4 * hitK(t, TL.lift + .45, 2.5) * (t < TL.gone ? 1 : 0), '#FFD890');
  flash(c, .6 * hitK(t, TL.jai, 2.5) * (t < TL.card ? 1 : 0), '#FFD890');
  flash(c, .8 * hitK(t, TL.card, 4), '#FFF6E0');
});

// ---------- captions ----------
say(-.35, 2.4, '*RAVANA* lifted | *KAILASH*.', { y: 620, size: 70, at: Array(3).fill(-.35) });
say(2.4, 4.6, 'His whole court | couldn\'t move | ONE monkey\'s FOOT.', { y: 620, size: 60 });
say(4.8, 7.2, '*Ram* sent a messenger | to Lanka: *ANGAD*, | son of *VALI*.', { y: 560 });
say(7.2, 9.4, '"Offer peace. | For HIS good."', { y: 560, size: 62 });
say(9.6, 11.4, 'He walked into | *Ravana*\'s court,', { y: 560 });
say(11.4, 13.6, 'and the whole court | STOOD UP.', { y: 560, size: 62 });
say(13.8, 15.8, '"Who are you, | monkey?"', { y: 1440, size: 64 });
say(15.8, 18.2, '"*ANGAD*. Son of | your friend, *VALI*."', { y: 1450 });
say(18.4, 20.4, '"And how is | my friend?"', { y: 1440, size: 62 });
say(20.4, 22.8, '"Go and ask him. | In TEN days."', { y: 1450, size: 62 });
say(22.9, 25.0, '"I\'ve heard of | MANY *Ravanas*."', { y: 520, size: 62 });
say(25.0, 27.2, 'One was caught | by *SAHASRABAHU*.', { y: 1440 });
say(27.2, 29.4, 'One lived under | *VALI*\'s ARM.', { y: 1440, size: 62 });
say(29.4, 31.6, '"Which one | are YOU?"', { y: 1440, size: 70 });
say(31.8, 33.8, '"I LIFTED | *KAILASH*!"', { y: 1460, size: 66 });
say(33.8, 35.8, '"I offered my heads | to *SHIVA*!"', { y: 1460 });
say(36.0, 38.0, '*Angad* struck | the ground.', { y: 560, size: 62 });
say(38.0, 40.0, '*Ravana*\'s CROWNS | fell.', { y: 1440, size: 64 });
say(40.2, 42.2, 'He flung them | across the sea.', { y: 1380 });
say(42.2, 44.4, '*HANUMAN* caught them | for *RAM*.', { y: 1380 });
say(44.6, 46.6, 'Then he planted | his FOOT:', { y: 560, size: 62 });
say(46.6, 49.2, '"Move it, and *RAM* | turns back. | *Sita* stays HERE."', { y: 600 });
say(49.4, 51.8, 'Warriors as strong | as *MEGHNAD* | rushed in.', { y: 520 });
say(51.8, 54.0, 'It didn\'t move. | Not ONE inch.', { y: 520, size: 62 });
say(54.2, 56.4, 'Then *RAVANA* | himself | came down.', { y: 520, size: 62 });
say(56.4, 58.4, 'He bent down | to grab the FOOT.', { y: 560 });
say(58.4, 60.6, '"Why grab MY feet? | Fall at *RAM*\'s feet."', { y: 560 });
say(60.7, 62.7, '*Ravana* sat down, | head bowed, | his glory GONE.', { y: 1440 });
say(62.7, 64.7, '*Angad* returned | and fell at | *Ram*\'s feet.', { y: 560 });
say(64.7, 67.3, '*JAI* *SHRI* *RAM*', { y: 600, size: 96 });
say(67.4, 70.4, 'Is your name | *ANGAD*, *RAM* | or *HANUMAN*? | Comment it!', { y: 600 });
