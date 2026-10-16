// jatayu.js: "The FIRST to fight RAVANA for SITA wasn't Ram." (reel/jatayu-ravana), in the Cinematic style (src/cine.js).
// The Valmiki Ramayana's Jatayu (Aranya Kanda 14, 49–52, 67–68): Dasharatha's old friend, who promised to guard Sita;
// Ravana's gold chariot and its ghost-faced mules; Sita's cry; the sleeping king of eagles wakes ("I am old, you are
// young… you will not take her while I live"); the storm of arrows, the bow snapped, the mules, the charioteer and the
// chariot smashed, Ravana crashing down; ten arms torn off that grow back; the old bird tires; the sword and his wings;
// Sita weeps over him, Ravana flies off with her; still alive when Ram comes ("south"), he dies in Ram's arms; Ram
// lights his pyre as for his own father; his spirit rises. The place call-out and a follow card.
// Times are in TL, laid on the Lyria score (assets/jatayu_score.mp3, take 4): its hits at 15.75 (the eye), 19.0 (the
// wings), and, after its 19.0–25.25 passage is stretched ×1.12 in the mix, 26.0 (the fight), 38.25 (the arms grow
// back), its hush 50.25–53.25, the choir's "Jai Shri Ram" at 66.25.
// tools/jatayu_sfx.mjs uses the same TL.
const TL = { hook: 0, panch: 4.6, take: 9.4, mules: 11.6, cry: 13.4, wake: 15.4, snap: 15.75, rise: 18.2, spread: 19.0,
  old: 20.5, live: 23.6, fight: 26.0, bow: 28.35, snapBow: 29.35, smashT: 30.75, smash: 31.65, crash: 33.35, land: 33.95,
  arms: 35.75, tear: 36.05, grow: 38.25, tired: 40.65, sword: 43.7, swing: 45.55, cut: 45.95, sita: 48.95, away: 51.55,
  back: 53.5, alone: 53.95, ram: 57.0, dies: 60.0, pyre: 61.75, anyway: 66.05, jai: 66.25, ask: 68.85, card: 72.0, end: 77.0 };
const shake = (t, t0, k = 14, d = 5) => { const u = t - t0; if (u < 0 || u > 1.2) return [0, 0]; const e = Math.exp(-u * d) * k; return [Math.sin(t * 53) * e, Math.cos(t * 41) * e]; };

// ---------- shot 1: the hook. Jatayu's old face in the dusk, the eye open (frame 0 is finished) ----------
SHOTS.push({ a: TL.hook, b: TL.panch + .4, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.1, easeIO(u / 5)), fx: 520, fy: 1000 };
  plane(c, cam, 0, (c) => { SKY.dusk(c); ellipse(c, 820, 1380, 260, 260, rgba('#FFD08A', .9)); glow(c, 820, 1380, 520, '#FFB060', .5); });
  plane(c, cam, .2, (c) => { clouds(c, [[-200, 1180, 900, 31, 20], [500, 1520, 800, 33, 30, true]], t, PALETTES.nightFar, .55); ridge(c, 1620, 70, 21, '#1A0810'); });
  plane(c, cam, 1, (c) => figure(c, (f) => { f.translate(470, 1120); f.scale(2.5, 2.5); jatayuHead(f, { t, expr: 'calm', eyes: 1, wind: .9 }); }, { ...DUSK_FX, rim: { ...DUSK_FX.rim, dx: 9, dy: -4, blur: 1.5 } }));
  plane(c, cam, 1.2, (c) => motes(c, { n: 40, seed: 3, box: [-100, 300, W + 100, 1900], r: 3, col: '#FFC890', a: .5, vx: -30, vy: -20, t }));
} });
say(-.35, 2.7, 'The FIRST to fight | *RAVANA* for *SITA* | wasn\'t Ram.', { y: 520, at: Array(10).fill(-.35) });
say(2.7, 4.9, 'A 60,000-year-old | *BIRD*.', { y: 520, size: 64 });

// ---------- shot 2: Panchavati at dusk: the hut, the river, Jatayu on the great tree, Ram and Sita ----------
SHOTS.push({ a: TL.panch, b: TL.take + .4, xf: .5, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.1, easeIO(u / 5)), fx: 560, fy: 980 };
  plane(c, cam, 0, (c) => { SKY.violet(c); stars(c, 40, 9, t, .5); });
  plane(c, cam, .25, (c) => { ridge(c, 1380, 90, 4, '#24142C'); haze(c, 1380, 200, '#7A3A5A', .35); });
  plane(c, cam, .5, (c) => { fillPath(c, 'M -100 1480 L 1180 1480 L 1180 1560 L -100 1560 Z', '#3A2440'); for (let i = 0; i < 6; i++) strokePath(c, `M ${-80 + i * 210 + Math.sin(t + i) * 20} ${1500 + (i % 2) * 24} l 120 0`, rgba('#FFB080', .35), 3); });
  plane(c, cam, 1, (c) => {
    fillPath(c, 'M -100 1560 L 1180 1560 L 1180 2100 L -100 2100 Z', '#140A14');
    forestTree(c, 290, 1600, .78, { t });
    hut(c, 800, 1580, .62, { t, lit: .8 });
    figure(c, (f) => { f.translate(290 + 330 * .78, 1600 - 980 * .78); f.scale(.3, .3); jatayu(f, { t, pose: 'perch', eyes: 1 }); }, SIL_FX(.82));
    figure(c, (f) => { f.translate(640, 1660); f.scale(.4, .4); ramSil(f, { t, bless: ease(seg(t, TL.panch + 2.4, TL.panch + 3.2)) }); }, { ...LIGHTS.dawnBack, tint: ['#140A14', .9] });
    figure(c, (f) => { f.translate(960, 1664); f.scale(.36, .36); sita(f, { t, pose: 'stand', col: '#140A14' }); }, { ...LIGHTS.dawnBack, tint: ['#140A14', .9] });
  });
  plane(c, cam, 1.2, (c) => motes(c, { n: 30, seed: 8, box: [-100, 800, W + 100, 1800], r: 2.5, col: '#FFD8A0', a: .45, vx: 6, vy: -14, t }));
} });
say(4.9, 7.3, 'He was King | *DASHARATHA*\'s friend.', { y: 1330 });
say(7.3, 9.6, 'He promised *RAM* | he would guard *SITA*.', { y: 1330 });

// ---------- shot 3: the gold chariot crosses the storm, Ravana holding Sita ----------
SHOTS.push({ a: TL.take, b: TL.mules + .3, xf: .4, draw(c, u, t) {
  const fl = strikes(t, [TL.take + .5, TL.take + 1.9]), cam = { z: lerp(1.0, 1.06, u / 2.5), fx: 540, fy: 1000 };
  plane(c, cam, 0, (c) => { SKY.storm(c, fl); bolt(c, 860, -40, 700, 900, 7, strikes(t, [TL.take + .5])); bolt(c, 140, -40, 260, 700, 11, strikes(t, [TL.take + 1.9])); });
  plane(c, cam, .3, (c) => clouds(c, [[-300 + u * 120, 1300, 1000, 41, 30], [400 + u * 80, 1560, 900, 43, 40, true]], t, PALETTES.nightFar, .7));
  plane(c, cam, 1, (c) => figure(c, (f) => { f.translate(lerp(230, 330, u / 2.4), 1150 + Math.sin(t * 2) * 10); f.scale(.4, .4); rig(f, { t }); }, { ...STORM_FX, rim: { ...STORM_FX.rim, a: .8 + fl } }));
  plane(c, cam, 1.4, (c) => clouds(c, [[-200 + u * 500, 1750, 800, 45, 50]], t, PALETTES.nightFar, .8));
} });
say(9.6, 11.6, 'Then *RAVANA* | took her.', { y: 520, size: 64 });

// ---------- shot 4: close on the ghost-faced mules ----------
SHOTS.push({ a: TL.mules, b: TL.cry + .3, xf: .3, draw(c, u, t) {
  const cam = { z: lerp(1.05, 1.15, u / 2), fx: 600, fy: 900 }, fl = strikes(t, [TL.mules + .9]);
  plane(c, cam, 0, (c) => { SKY.storm(c, fl); bolt(c, 300, -40, 420, 700, 13, fl); });
  plane(c, cam, .4, (c) => clouds(c, [[200 - u * 300, 1500, 1100, 47, 30], [-400 - u * 200, 600, 900, 49, 40, true]], t, PALETTES.nightFar, .7));
  plane(c, cam, 1, (c) => figure(c, (f) => { f.translate(-60, 1330); f.scale(.82, .82); for (const [dx, dy, ph] of [[460, -60, .3], [60, 40, 0]]) { f.save(); f.translate(dx, dy); rvMule(f, { t, gallop: t * 2.2 + ph, glow: 1 + .4 * Math.sin(t * 9) }); f.restore(); } }, { ...STORM_FX, tint: ['#2A0A10', .3] }));
  plane(c, cam, 1.4, (c) => motes(c, { n: 50, seed: 14, box: [-100, 300, W + 300, 1900], r: 3, col: '#FFB08A', a: .5, vx: -500, vy: 0, t }));
} });
say(11.65, 13.5, 'Pulled by | GHOST-FACED MULES.', { y: 1520, size: 60 });

// ---------- shot 5: Sita reaching down, crying out to the old bird asleep on his tree ----------
SHOTS.push({ a: TL.cry, b: TL.wake + .3, xf: .3, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.08, u / 2.3), fx: 500, fy: 900 };
  plane(c, cam, 0, (c) => SKY.storm(c));
  plane(c, cam, .2, (c) => { forestTree(c, 220, 2050, .4, { t, col: '#1A0608' }); figure(c, (f) => { f.translate(220 + 330 * .4, 2050 - 980 * .4); f.scale(.14, .14); jatayu(f, { t, pose: 'perch', tuck: 1, eyes: 0 }); }, SIL_FX(.85)); });
  plane(c, cam, .6, (c) => clouds(c, [[-300 + u * 700, 1400, 900, 51, 30]], t, PALETTES.nightFar, .6));
  plane(c, cam, 1, (c) => figure(c, (f) => { f.translate(560, 2060); f.scale(1.45, 1.45);
    sita(f, { t, pose: 'carried', reach: .75 + .25 * Math.sin(t * 3), wind: 1, tears: .7, look: [-1, .6] });
  }, { ...STORM_FX, tint: ['#2A0A10', .12] }));
  plane(c, cam, 1.4, (c) => motes(c, { n: 40, seed: 15, box: [-100, 300, W + 300, 1900], r: 3, col: '#FFB08A', a: .5, vx: -500, vy: 40, t }));
} });
say(13.6, 15.6, '"*JATAYU*! | Tell *RAM*!"', { y: 520, size: 68 });

// ---------- shot 6: the old bird asleep; his eye snaps open on her cry ----------
SHOTS.push({ a: TL.wake, b: TL.rise + .3, xf: .25, draw(c, u, t) {
  const op = ease(seg(t, TL.snap, TL.snap + .12)), push = easeOut(seg(t, TL.snap, TL.snap + 2.4));
  const cam = { z: lerp(1.0, 1.18, push), fx: 400, fy: 1050 };
  plane(c, cam, 0, (c) => { SKY.violet(c); flash(c, .3 * op, '#2A0A10', 'source-over'); });
  plane(c, cam, .2, (c) => clouds(c, [[-200, 1300, 900, 61, 20]], t, PALETTES.nightFar, .5));
  plane(c, cam, 1, (c) => { figure(c, (f) => { f.translate(470, 1120); f.scale(2.5, 2.5); jatayuHead(f, { t, eyes: op * 1.1, expr: op > .5 ? 'fierce' : 'calm', beak: 0, wind: .6 }); }, { ...DUSK_FX, rim: { ...DUSK_FX.rim, dx: 9, dy: -4, blur: 1.5 } });
    if (op > 0) glow(c, 470, 1120, 140, '#FFC040', .6 * Math.exp(-(t - TL.snap) * 2.4)); });
} });
say(15.8, 18.2, 'He was ASLEEP. | Her cry woke him.', { y: 520 });

// ---------- shot 7: he rises before the chariot, wings across the whole sky ----------
SHOTS.push({ a: TL.rise, b: TL.old + .3, xf: .3, draw(c, u, t) {
  const up = easeOut(seg(t, TL.rise, TL.spread + .3)), fl = t < TL.spread ? lerp(.2, 1, ease(seg(t, TL.rise, TL.spread))) : .5 + .5 * Math.cos((t - TL.spread) * 3.2);
  const cam = { z: lerp(1.2, 1.0, easeOut(u / 2.4)), fx: 540, fy: 1000 };
  plane(c, cam, 0, (c) => { SKY.storm(c); ellipse(c, 540, 1000, 320, 320, rgba('#FFC070', .95)); glow(c, 540, 1000, 700, '#FF9A3A', .6); });
  plane(c, cam, .3, (c) => clouds(c, [[-300, 1250, 1000, 63, 20], [300, 700, 900, 65, 30, true]], t, PALETTES.nightFar, .55));
  plane(c, cam, 1, (c) => { figure(c, (f) => { f.translate(540, lerp(1500, 1000, up)); f.scale(.64, .64); jatayu(f, { t, pose: 'spread', flap: fl, expr: 'fierce', wind: 1 }); }, SIL_FX(.82));
    fillPath(c, 'M -100 1560 C 300 1520 700 1600 1180 1540 L 1180 2100 L -100 2100 Z', '#12040A'); });
  plane(c, cam, 1.3, (c) => motes(c, { n: 40, seed: 17, box: [-100, 300, W + 100, 1900], r: 3, col: '#FFC890', a: .5, vx: 0, vy: -60, t }));
} });
say(18.3, 20.5, '"*RAVANA*! | Let her GO."', { y: 1450, size: 68 });

// ---------- shot 8: Ravana laughs in his chariot ----------
SHOTS.push({ a: TL.old, b: TL.live + .3, xf: .3, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.06, u / 2.6), fx: 540, fy: 900 };
  plane(c, cam, 0, (c) => SKY.storm(c, strikes(t, [TL.old + 1.2])));
  plane(c, cam, .3, (c) => clouds(c, [[-300 - u * 200, 1500, 1100, 67, 30]], t, PALETTES.nightFar, .6));
  plane(c, cam, 1, (c) => figure(c, (f) => { f.translate(430, 1900); f.scale(1.25, 1.25); rig(f, { t, mules: false, expr: 'laugh', driver: false }); }, STORM_FX));
} });
say(20.5, 23.75, '"I am OLD. | You are young, | armed, in a chariot."', { y: 500 });

// ---------- shot 9: Jatayu's face, fierce: "while I live" ----------
SHOTS.push({ a: TL.live, b: TL.fight + .2, xf: .25, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.22, easeIn(seg(t, TL.live, TL.fight))), fx: 430, fy: 1060 };
  plane(c, cam, 0, (c) => { SKY.storm(c); glow(c, 760, 1300, 600, '#FF7A30', .4); });
  plane(c, cam, .25, (c) => clouds(c, [[-200 + u * 100, 1500, 1000, 69, 20]], t, PALETTES.nightFar, .5));
  plane(c, cam, 1, (c) => figure(c, (f) => { f.translate(470, 1150); f.scale(2.7, 2.7); jatayuHead(f, { t, expr: 'fierce', beak: .25 + .45 * ease(seg(t, TL.live + 1.2, TL.live + 1.6)), wind: 1 }); }, { ...DUSK_FX, tint: ['#3A0A10', .2], rim: { ...DUSK_FX.rim, col: '#FFB08A', dx: 9, dy: -4, blur: 1.5 } }));
} });
say(23.75, 26.0, '"You will NOT take her | while I LIVE."', { y: 520, size: 54 });

// ---------- shot 10: the fight: a storm of arrows; he dives through them ----------
SHOTS.push({ a: TL.fight - .05, b: TL.bow + .3, draw(c, u, t) {
  const [sx, sy] = shake(t, TL.fight, 22), cam = { z: lerp(1.08, 1.0, easeOut(u / 2.4)), x: sx, y: sy, fx: 540, fy: 1000 }, fl = strikes(t, [TL.fight, TL.fight + 1.4]);
  plane(c, cam, 0, (c) => { SKY.storm(c, fl); bolt(c, 940, -40, 760, 800, 23, fl); });
  plane(c, cam, .3, (c) => clouds(c, [[-300, 1300, 1100, 71, 30], [500, 600, 800, 73, 40, true]], t, PALETTES.nightFar, .6));
  plane(c, cam, 1, (c) => {
    figure(c, (f) => { f.translate(170, 1560); f.scale(.3, .3); rig(f, { t, frontL: 'bow' }); }, SIL_FX(.8));
    volley(c, t, TL.fight, 44, 330, 1330, 760, 700, 3, 1.8);
    const dv = seg(t, TL.fight, TL.bow + .3);
    figure(c, (f) => { f.translate(lerp(840, 560, dv), lerp(560, 900, dv)); f.rotate(lerp(.3, -.2, dv)); f.scale(.36, .36); jatayu(f, { t, pose: 'spread', flap: .5 + .5 * Math.sin(t * 7), strike: dv, expr: 'fierce' }); }, SIL_FX(.82));
  });
  plane(c, cam, 1.4, (c) => motes(c, { n: 50, seed: 19, box: [-100, 300, W + 100, 1900], r: 3, col: '#FFB08A', a: .5, vx: -200, vy: -100, t }));
} });
say(26.05, 28.35, '*RAVANA* shot | a STORM of arrows.', { y: 1150 });

// ---------- shot 11: his talons seize the gem-set bow and snap it ----------
SHOTS.push({ a: TL.bow, b: TL.smashT + .3, xf: .2, draw(c, u, t) {
  const sn = t >= TL.snapBow, k = seg(t, TL.snapBow, TL.snapBow + 1.4), [sx, sy] = shake(t, TL.snapBow, 18);
  const cam = { z: lerp(1.0, 1.1, u / 2.6), x: sx, y: sy, fx: 540, fy: 900 };
  plane(c, cam, 0, (c) => SKY.storm(c, strikes(t, [TL.snapBow])));
  plane(c, cam, .3, (c) => clouds(c, [[-300 + u * 200, 1400, 1100, 75, 30]], t, PALETTES.nightFar, .6));
  plane(c, cam, 1, (c) => {
    figure(c, (f) => {
      // Ravana's fist on the bow's grip, from screen left
      limb(f, [[-200, 1060], [120, 980], [330, 940]], [150, 120, 96], RV.skin); ellipse(f, 352, 934, 60, 54, RV.skin); ellipse(f, 250, 955, 20, 60, RV.gold, -.3);
      if (!sn) { f.save(); f.translate(400, 930); f.rotate(Math.PI / 2 + .1); rvWeapon(f, 0, 0, 0, 'gembow', 4.4); f.restore(); }
      else { bowHalf(f, 400 + k * 260, 930 - k * 300 + k * k * 600, -1.9 - k * 3, 4.4, true); bowHalf(f, 400 + k * 120, 930 + k * 200 + k * k * 900, -1.2 + k * 2.4, 4.4, false); }
    }, STORM_FX);
    scatter(c, 420, 930, t, TL.snapBow, 30, 5, 1.2);
    const dn = ease(seg(t, TL.bow, TL.snapBow - .1)), g = ease(seg(t, TL.snapBow - .45, TL.snapBow - .1));
    figure(c, (f) => { f.translate(470, lerp(260, 900, dn) - (t > TL.snapBow ? easeOut(k) * 500 : 0)); f.scale(1.2, 1.2); jatayuTalon(f, { t, grip: g }); }, STORM_FX);
  });
} });
say(28.5, 30.75, 'He SNAPPED | Ravana\'s bow.', { y: 1450, size: 64 });

// ---------- shot 12: the mules struck down, the charioteer, the chariot smashed ----------
SHOTS.push({ a: TL.smashT, b: TL.crash + .3, xf: .2, draw(c, u, t) {
  const br = easeIn(seg(t, TL.smash, TL.smash + 1.8)), [sx, sy] = shake(t, TL.smash, 26), cam = { z: lerp(1.0, 1.08, u / 2.6), x: sx, y: sy, fx: 540, fy: 1000 };
  plane(c, cam, 0, (c) => SKY.storm(c, strikes(t, [TL.smash])));
  plane(c, cam, .3, (c) => clouds(c, [[-200, 1500, 1100, 77, 30]], t, PALETTES.nightFar, .6));
  plane(c, cam, 1, (c) => {
    figure(c, (f) => { f.translate(140, 1180); f.scale(.42, .42); rig(f, { t, broken: br, frontL: 'fist', expr: br > 0 ? 'scream' : 'grit' }); }, SIL_FX(.8));
    const dv = ease(seg(t, TL.smashT, TL.smash));
    figure(c, (f) => { f.translate(lerp(1000, 690, dv), lerp(500, 980, dv)); f.rotate(-.2); f.scale(.34, .34); jatayu(f, { t, pose: 'spread', flap: lerp(0, 1, dv), strike: 1, expr: 'fierce' }); }, SIL_FX(.82));
    debris(c, [200, 900, 900, 1500], t, TL.smash, 40, 9, '#5A3A10', '#FFD070');
  });
} });
say(30.8, 34.0, 'Killed the MULES, | the CHARIOTEER, | SMASHED the chariot.', { y: 1480 });

// ---------- shot 13: Ravana crashes to the ground with Sita ----------
SHOTS.push({ a: TL.crash, b: TL.arms + .3, xf: .2, draw(c, u, t) {
  const fall = easeIn(seg(t, TL.crash, TL.land)), [sx, sy] = shake(t, TL.land, 30), cam = { z: lerp(1.04, 1.0, u / 2.6), x: sx, y: sy, fx: 540, fy: 1300 };
  plane(c, cam, 0, (c) => SKY.storm(c));
  plane(c, cam, .3, (c) => { ridge(c, 1500, 80, 31, '#2A0A0C'); haze(c, 1500, 200, '#8A2A18', .4); });
  plane(c, cam, 1, (c) => {
    fillPath(c, 'M -100 1700 L 1180 1700 L 1180 2100 L -100 2100 Z', '#14060A');
    figure(c, (f) => { f.translate(470, lerp(700, 1720, fall)); f.scale(.82, .82); ravana(f, { t, frontR: 'carry', frontL: 'fist', expr: t < TL.land ? 'scream' : 'grit', pose: t > TL.land ? 'lift' : 'stand', reach: .2 });
      f.save(); f.translate(340, 30); f.scale(.82, .82); sita(f, { t, pose: 'carried', reach: .4, wind: .5, tears: .8 }); f.restore(); rvCarryArm(f, { t, hold: [300, -470] }); }, STORM_FX);
    if (t > TL.land) { const k = seg(t, TL.land, TL.land + 1.6); for (let i = 0; i < 2; i++) { c.save(); c.globalAlpha = (1 - k) * .7; ellipse(c, 470 + (i ? 1 : -1) * k * 600, 1700, 200 + k * 500, 50 + k * 60, '#8A5A40'); c.restore(); } }
    shockRings(c, 470, 1700, t, [TL.land], '#FFC890');
    cracks(c, 470, 1710, ease(seg(t, TL.land, TL.land + .5)), t, 6);
  });
} });
say(34.0, 36.1, 'Ravana CRASHED | to the ground.', { y: 520, size: 64 });

// ---------- shot 14: ten arms torn off, and they grow back ----------
const torn = (t) => t < TL.tear ? 0 : t < TL.grow ? clamp((t - TL.tear) / 1.1) : 1 - clamp((t - TL.grow) / .7);
SHOTS.push({ a: TL.arms, b: TL.tired + .3, xf: .2, draw(c, u, t) {
  const fl = strikes(t, [TL.arms + .2, TL.grow]), lost = torn(t), gr = t > TL.grow ? Math.exp(-(t - TL.grow) * 1.6) : 0;
  const cam = { z: lerp(1.0, 1.1, u / 5), fx: 400, fy: 1000 };
  plane(c, cam, 0, (c) => { SKY.storm(c, fl); bolt(c, 900, -40, 640, 1100, 33, fl); });
  plane(c, cam, .3, (c) => clouds(c, [[-200, 1500, 1000, 81, 30]], t, PALETTES.nightFar, .5));
  plane(c, cam, 1, (c) => {
    fillPath(c, 'M -100 1760 L 1180 1760 L 1180 2100 L -100 2100 Z', '#0E0408');
    { const g = c.createLinearGradient(0, 1200, 0, 1760); g.addColorStop(0, 'rgba(14,4,8,0)'); g.addColorStop(1, 'rgba(14,4,8,.85)'); c.fillStyle = g; c.fillRect(-100, 1200, 1300, 560); }
    if (gr) glow(c, 330, 1060, 500, '#FF2A1A', .8 * gr);
    figure(c, (f) => { f.translate(560, 1780); f.scale(.95, .95); ravana(f, { t, lostLeft: lost, expr: t < TL.grow ? 'scream' : 'laugh', front: 'hips' }); }, { ...SIL_FX(.86), rim: { col: '#FFB08A', dx: 0, dy: -5, a: .8 + fl, blur: 1 } });
    // the arms flying away, one at each tear
    for (let j = 0; j < 10; j++) { const t0 = TL.tear + j * .11, k = t - t0; if (k < 0 || k > 2) continue; const a = -2.3 + j * .15; looseArm(c, 330 + Math.cos(a) * 200 - k * 500, 1000 - j * 20 + Math.sin(a) * 100 - 600 * k + 900 * k * k, k * 6 + j, .9, '#140810'); }
    const hv = Math.sin(t * 14) * 20;
    figure(c, (f) => { f.translate(260 + hv * .3, 760 + hv); f.rotate(.5); f.scale(.4, .4); jatayu(f, { t, pose: 'spread', flap: .6 + .4 * Math.sin(t * 9), strike: 1, expr: 'fierce', beak: 1 }); }, SIL_FX(.82));
  });
} });
say(36.1, 38.2, 'He tore off TEN | of Ravana\'s ARMS.', { y: 1500 });
say(38.25, 40.6, 'They grew | BACK.', { y: 1500, size: 76 });

// ---------- shot 15: the old bird tires ----------
SHOTS.push({ a: TL.tired, b: TL.sword + .3, xf: .4, draw(c, u, t) {
  const cam = { z: lerp(1.08, 1.0, easeOut(u / 2.7)), fx: 540, fy: 1100 };
  plane(c, cam, 0, (c) => { sky(c, [[0, '#06080E'], [900, '#1A2236'], [1500, '#3A2A36'], [1920, '#0A0A10']]); glow(c, 700, 1400, 700, '#8A3A2A', .3); });
  plane(c, cam, .3, (c) => { ridge(c, 1450, 70, 41, '#141826'); haze(c, 1450, 200, '#3A4058', .4); });
  plane(c, cam, 1, (c) => { fillPath(c, 'M -100 1640 L 1180 1640 L 1180 2100 L -100 2100 Z', '#0A0C14');
    figure(c, (f) => { f.translate(540, 1240 + Math.sin(t * 2.6) * 6); f.scale(.6, .6); jatayu(f, { t, pose: 'spread', flap: .96, loose: 1, expr: 'pain', wind: .3, breath: 1 }); }, NIGHT_FX); });
  plane(c, cam, 1.2, (c) => { featherFall(c, t, TL.tired - 1, 8, [100, 400, 1000, 1200], 7, 1); motes(c, { n: 40, seed: 21, box: [-100, 300, W + 100, 1900], r: 2.5, col: '#9AB0D8', a: .4, vx: 20, vy: 10, t }); });
} });
say(40.7, 43.9, 'But he was OLD. | And he was | TIRED.', { y: 520 });

// ---------- shot 16: Ravana draws his sword ----------
SHOTS.push({ a: TL.sword, b: TL.cut + .05, xf: .3, draw(c, u, t) {
  const sw = easeIn(seg(t, TL.swing, TL.cut)), cam = { z: lerp(1.0, 1.08, u / 2.8), fx: 540, fy: 900 };
  plane(c, cam, 0, (c) => { SKY.storm(c); glow(c, 540, 900, 600, '#B0B8C8', .15); });
  plane(c, cam, .3, (c) => clouds(c, [[-200, 1500, 1000, 83, 30]], t, PALETTES.nightFar, .5));
  plane(c, cam, 1, (c) => figure(c, (f) => { f.translate(420, 1560); f.rotate(.32 - sw * 1.9); f.scale(1.25, 1.25);
    limb(f, [[-160, 600], [-60, 400], [0, 250]], [190, 160, 130], RV.skin); ellipse(f, 0, 240, 74, 64, RV.skin); ellipse(f, -50, 380, 24, 70, RV.gold, -.5);
    rvBlade(f, { glint: seg(t, TL.sword + .2, TL.sword + 1.2) }); }, { ...STORM_FX, tint: ['#20080C', .15] }));
} });
say(43.95, 45.95, '*RAVANA* drew | his SWORD.', { y: 1450, size: 64 });

// ---------- shot 17: his wings cut away: he falls in slow motion through a pale sky ----------
SHOTS.push({ a: TL.cut, b: TL.sita + .4, draw(c, u, t) {
  const k = seg(t, TL.cut, TL.sita + .4), cam = { z: lerp(1.12, 1.0, easeOut(k)), fx: 540, fy: 900 };
  plane(c, cam, 0, (c) => SKY.pale(c));
  plane(c, cam, .2, (c) => clouds(c, [[-300, 1300 - k * 300, 1000, 85, 30], [400, 1700 - k * 400, 900, 87, 40, true]], t, PALETTES.nightFar, .35));
  plane(c, cam, 1, (c) => figure(c, (f) => { f.translate(560, lerp(520, 1060, k)); f.rotate(.3 + k * 1.1); f.scale(.6, .6); f.translate(-100, 150); jatayu(f, { t, pose: 'fallen', wings: 'stumps', expr: 'pain', eyes: .3 }); }, { tint: ['#2A1A20', .55], edge: { col: '#FFE8D8', w: 2.2, a: .6 }, rim: { col: '#FFFFFF', dx: 0, dy: -4, a: .6, blur: 1 } }));
  plane(c, cam, 1.2, (c) => featherFall(c, t, TL.cut, 26, [-100, 0, 1180, 1300], 11, 1.3));
} });
say(46.2, 48.9, '…and cut off | his WINGS.', { y: 1500, size: 68 });

// ---------- shot 18: Sita holds him and weeps ----------
SHOTS.push({ a: TL.sita, b: TL.away + .4, xf: .5, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.08, u / 2.8), fx: 540, fy: 1300 };
  plane(c, cam, 0, (c) => { SKY.night(c); stars(c, 60, 3, t, .7); glow(c, 820, 500, 420, '#7F97CC', .3); ellipse(c, 820, 500, 36, 36, '#E6ECF6'); });
  plane(c, cam, .3, (c) => { ridge(c, 1450, 70, 51, '#10162A'); haze(c, 1450, 160, '#3A4A70', .35); });
  plane(c, cam, 1, (c) => { rocks(c, 1720, 4);
    figure(c, (f) => { f.translate(560, 1740); f.scale(.62, .62); jatayu(f, { t, pose: 'fallen', wings: 'stumps', eyes: .35, breath: 1 }); }, NIGHT_FX);
    figure(c, (f) => { f.translate(330, 1760); f.scale(.86, .86); sita(f, { t, pose: 'kneel', tears: 1, wind: .3 }); }, NIGHT_FX); });
  plane(c, cam, 1.2, (c) => motes(c, { n: 30, seed: 23, box: [-100, 300, W + 100, 1900], r: 2.5, col: '#C9D7F5', a: .4, vx: 10, vy: 20, t }));
} });
say(49.1, 51.5, '*SITA* held him | and wept.', { y: 520, size: 64 });

// ---------- shot 19: Ravana seizes her and flies off; her anklet falls ----------
SHOTS.push({ a: TL.away, b: TL.alone + .4, xf: .4, draw(c, u, t) {
  const k = easeIn(seg(t, TL.away, TL.alone + .4)), cam = { z: lerp(1.0, 1.05, u / 2.6), fx: 540, fy: 900 };
  plane(c, cam, 0, (c) => { SKY.night(c); stars(c, 60, 5, t, .7); glow(c, 540, 1700, 900, '#5A1A2A', .3); });
  plane(c, cam, .3, (c) => clouds(c, [[-300, 900, 1000, 89, 30], [500, 1200, 900, 91, 40, true]], t, PALETTES.nightFar, .6));
  plane(c, cam, 1, (c) => {
    rocks(c, 1760, 6);
    figure(c, (f) => { f.translate(420, 1770); f.scale(.3, .3); jatayu(f, { t, pose: 'fallen', wings: 'stumps', eyes: .35 }); }, LIGHTS.moonSilhouette);
    figure(c, (f) => { f.translate(lerp(560, 980, k), lerp(1500, 420, k)); f.rotate(.3); f.scale(.34, .34); ravana(f, { t, frontR: 'carry', frontL: 'fist', expr: 'laugh' });
      f.save(); f.translate(340, 30); f.scale(.82, .82); sita(f, { t, pose: 'carried', reach: 1, wind: 1, tears: 1 }); f.restore(); rvCarryArm(f, { t, hold: [300, -470] }); }, LIGHTS.moonSilhouette);
    anklet(c, t, TL.away + .9, lerp(560, 980, easeIn(seg(TL.away + .9, TL.away, TL.alone + .4))) + 40, lerp(1500, 420, easeIn(seg(TL.away + .9, TL.away, TL.alone + .4))) - 60);
  });
} });
say(51.7, 53.9, 'Ravana seized her | and flew away.', { y: 620 });

// ---------- shot 20: night: alone on the rocks, still breathing; the moon crosses the sky ----------
SHOTS.push({ a: TL.alone, b: TL.ram + .4, xf: .5, draw(c, u, t) {
  const k = seg(t, TL.alone, TL.ram + .4), cam = { z: lerp(1.0, 1.08, k), fx: 540, fy: 1500 };
  plane(c, cam, 0, (c) => { SKY.night(c); stars(c, 90, 7, t, .9); const mx = lerp(180, 900, k), my = 620 - Math.sin(k * Math.PI) * 180; glow(c, mx, my, 420, '#7F97CC', .4); ellipse(c, mx, my, 40, 40, '#E6ECF6'); });
  plane(c, cam, .3, (c) => { ridge(c, 1460, 80, 55, '#0E1426'); haze(c, 1460, 180, '#2A3A60', .35); });
  plane(c, cam, 1, (c) => { rocks(c, 1720, 8); figure(c, (f) => { f.translate(500, 1730); f.scale(.6, .6); jatayu(f, { t, pose: 'fallen', wings: 'stumps', eyes: .25, breath: 1 }); }, NIGHT_FX); });
} });
say(54.0, 57.2, 'Broken, bleeding, | he was still ALIVE | when *RAM* came.', { y: 560 });

// ---------- shot 21: Ram kneels and cradles him; he dies in Ram's arms ----------
SHOTS.push({ a: TL.ram, b: TL.pyre + .4, xf: .5, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.1, easeIO(u / 5.2)), fx: 520, fy: 1450 }, d = ease(seg(t, TL.dies - .3, TL.dies + .4));
  plane(c, cam, 0, (c) => { SKY.night(c); stars(c, 90, 7, t, .9); glow(c, 900, 520, 460, '#7F97CC', .45); ellipse(c, 900, 520, 42, 42, '#E6ECF6'); rays(c, 900, 520, { n: 9, dir: 2.0, spread: .8, len: 1600, w: 300, col: '#A9BCE6', a: .12, t }); });
  plane(c, cam, .3, (c) => { ridge(c, 1460, 80, 55, '#0E1426'); haze(c, 1460, 180, '#2A3A60', .35); });
  plane(c, cam, 1, (c) => { rocks(c, 1720, 8);
    figure(c, (f) => { f.translate(250, 1730); f.scale(.6, .6); jatayu(f, { t, pose: 'fallen', wings: 'stumps', eyes: lerp(.4, 0, d), breath: 1 - d }); }, NIGHT_FX);
    figure(c, (f) => { f.translate(720, 1730); f.scale(.78, .78); ramKneel(f, { t, bend: .85, hold: [-330, -60] }); }, { ...LIGHTS.moonSilhouette, rim: { col: '#E4EDFF', dx: 4, dy: -3, a: .95 } });
    if (d) glow(c, 470, 1690, 300, '#FFD890', .4 * d * Math.exp(-(t - TL.dies) * .8)); });
  plane(c, cam, 1.2, (c) => motes(c, { n: 30, seed: 25, box: [-100, 300, W + 100, 1900], r: 2.5, col: '#C9D7F5', a: .4, vx: 6, vy: -10, t }));
} });
say(57.25, 59.8, '"*RAVANA* took her. | SOUTH."', { y: 560, size: 64 });
say(59.9, 62.0, 'And he died | in *RAM*\'s arms.', { y: 560 });

// ---------- shot 22: Ram lights his pyre, as a son would ----------
SHOTS.push({ a: TL.pyre, b: TL.anyway + .4, xf: .6, draw(c, u, t) {
  const cam = { z: lerp(1.08, 1.0, easeOut(u / 4.6)), fx: 540, fy: 1300 };
  plane(c, cam, 0, (c) => { SKY.dusk(c); });
  plane(c, cam, .3, (c) => { ridge(c, 1420, 90, 61, '#24101A'); haze(c, 1420, 200, '#8A3A2A', .35); });
  plane(c, cam, 1, (c) => { fillPath(c, 'M -100 1640 L 1180 1640 L 1180 2100 L -100 2100 Z', '#140A0C');
    pyre(c, 380, 1660, 420, t, .9 + .1 * Math.sin(t * 2));
    figure(c, (f) => { f.translate(820, 1680); f.scale(.72, .72); ramSil(f, { t, namaste: 1 }); }, LIGHTS.fire); });
  plane(c, cam, 1.2, (c) => embers(c, 380, 1500, t, 60, 7, 400, 1200));
} });
say(62.05, 64.1, '*RAM* lit his pyre | himself,', { y: 560 });
say(64.1, 66.1, 'as for his own | FATHER.', { y: 560, size: 68 });

// ---------- shot 23: his spirit rises into the dawn, whole; the call-out ----------
SHOTS.push({ a: TL.anyway, b: TL.card + .5, xf: .7, draw(c, u, t) {
  const up = easeOut(seg(t, TL.anyway, TL.ask + 1)), cam = { z: lerp(1.0, 1.1, easeIO(u / 6)), fx: 540, fy: 800 };
  plane(c, cam, 0, (c) => { SKY.dawn(c); glow(c, 540, 820, 800, '#FFB45A', .5); ellipse(c, 540, 820, 190, 190, '#FFE9B8'); rays(c, 540, 820, { n: 14, dir: -Math.PI / 2, spread: 3.4, len: 1500, w: 300, col: '#FFE2A8', a: .14, t }); });
  plane(c, cam, .3, (c) => clouds(c, [[-300, 1060, 1000, 93, 30], [500, 560, 900, 95, 40, true]], t, PALETTES.dawn, .4));
  plane(c, cam, .6, (c) => { ridge(c, 1180, 70, 71, '#3A1A30'); fillPath(c, 'M -200 1240 L 1300 1240 L 1300 2200 L -200 2200 Z', '#24101E'); });
  plane(c, cam, 1, (c) => {
    const y = lerp(1250, 760, up);
    glow(c, 540, y, 380, '#FFF0C0', .35);
    figure(c, (f) => { f.translate(540, y); f.scale(.42, .42); jatayu(f, { t, pose: 'spread', flap: .5 + .5 * Math.sin(t * 1.6), col: '#FFE8B8' }); }, { edge: { col: '#FFFFFF', w: 3, a: .9 }, rim: { col: '#FFE2A8', dx: 0, dy: -4, a: .6, blur: 2 }, alpha: .7 });
    fillPath(c, 'M -100 1300 C 300 1270 700 1330 1180 1290 L 1180 2100 L -100 2100 Z', '#1A0A16');
  });
  plane(c, cam, 1.2, (c) => motes(c, { n: 60, seed: 27, box: [-100, 300, W + 100, 1900], r: 3, col: '#FFE2A0', a: .6, vx: 6, vy: -40, t }));
} });
say(66.2, 68.7, 'He couldn\'t win. | He fought ANYWAY.', { y: 1460, size: 64 });
say(68.8, 72.1, 'Is there a *JATAYU* | temple near YOU? | Comment your city!', { y: 1460 });

// ---------- shot 24: the follow card ----------
SHOTS.push({ a: TL.card, b: TL.end + 1, xf: .6, draw(c, u, t) {
  sky(c, [[0, '#04100E'], [900, '#0F2A27'], [1920, '#050E0C']]);
  glow(c, 520, 1000, 760, '#2E5F5A', .55, 'screen');
  motes(c, { n: 60, seed: 61, box: [-50, 300, W + 50, 1900], r: 3, col: '#F4C46A', a: .6, vx: 6, vy: -26, t });
  const X = 520, pk = (d) => u - d;
  picture(c, PICS.logo, X, 520, 132, 132, { pop: pk(.2), r: 66 });
  text(c, 'JAI SHRI RAM', X, 668, '700 64px Cinzel', '#F4C46A', { pop: pk(.4), glow: ['rgba(244,196,106,.55)', 26], spacing: 3, maxW: 860 });
  const k = popK(pk(.6));
  if (k > .01) { glow(c, X, 1000, 300 * k, '#FFC870', .35); figure(c, (f) => { f.translate(X, 1000); f.scale(.3 * k, .3 * k); jatayu(f, { t, pose: 'spread', flap: .3 + .2 * Math.sin(t * 1.5), col: '#E8B850' }); }, { edge: { col: '#FFE8B0', w: 2.2, a: .8 }, rim: { col: '#FFF4D0', dx: 0, dy: -3, a: .9 } }); }
  text(c, 'Stories of Ram and the gods', X, 1250, '42px Marcellus', '#FBE0CF', { pop: pk(1.0), maxW: 840 });
  const kk = popK(pk(1.3)) * (1 + .03 * Math.max(0, Math.sin(t * 5)));
  if (kk > .01) { c.save(); c.translate(X, 1370); c.scale(kk, kk); c.fillStyle = '#F15A24'; c.shadowColor = 'rgba(241,90,36,.6)'; c.shadowBlur = 30; c.beginPath(); c.roundRect(-300, -48, 600, 96, 48); c.fill(); c.restore(); }
  text(c, 'Follow @therishikatha', X, 1373, '700 50px Poppins', '#FFFFFF', { pop: pk(1.3), maxW: 540 });
  text(c, 'rishikatha.com', X, 1470, '500 36px Poppins', '#CFE3DF', { pop: pk(1.6) });
} });

// ---------- flashes ----------
const pulse = (t, t0, up, down) => t < t0 - up || t > t0 + 3 ? 0 : t < t0 ? ease(seg(t, t0 - up, t0)) : Math.exp(-(t - t0) * down);
POST.push((c, t) => {
  flash(c, .35 * pulse(t, TL.snap, .04, 4), '#FFD070', 'screen');        // the eye snaps open
  flash(c, .25 * pulse(t, TL.spread, .1, 3), '#FFC890', 'screen');       // the wings spread
  flash(c, .5 * pulse(t, TL.fight, .05, 4), '#FFB08A', 'screen');        // the fight
  flash(c, .7 * pulse(t, TL.snapBow, .04, 5), '#FFFFFF', 'screen');      // the bow snaps
  flash(c, .5 * pulse(t, TL.smash, .05, 4), '#FFD8A0', 'screen');        // the chariot smashed
  flash(c, .4 * pulse(t, TL.land, .03, 5), '#FFC890', 'screen');         // he crashes down
  for (let j = 0; j < 10; j++) flash(c, .18 * pulse(t, TL.tear + j * .11, .02, 14), '#FF6A4A', 'screen');   // each arm
  flash(c, .55 * pulse(t, TL.grow, .05, 3), '#FF2A1A', 'screen');        // they grow back
  flash(c, 1 * pulse(t, TL.cut, .06, 1.6), '#FFFFFF', 'source-over');    // the cut
  flash(c, .3 * pulse(t, TL.jai, .4, 1.2), '#FFE8B0', 'screen');         // the spirit, the choir
});
