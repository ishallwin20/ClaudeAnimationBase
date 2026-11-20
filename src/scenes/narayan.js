// narayan.js: "There is ONE weapon you beat by DROPPING yours." (ad 100), in the 3D style with the comic's cast in 2D:
// the Narayanastra, Kurukshetra, day 15 (Mahabharata, Drona Parva 7.166-171, critical edition). Drona killed by a lie;
// Ashwatthama calls the weapon his father got from Narayana; the omens; the sky fills with blazing arrows, iron balls,
// razor discs; every strike makes it stronger; Krishna holds the army back: drop your weapons, get down, whoever fights
// it even in his mind it will kill; the whole army lets its weapons fall; all but Bhima ("the strength of 10,000
// elephants"); the whole weapon falls on him; Krishna and Arjuna run into the fire unarmed and drag him down; the moment
// his weapons touch the earth it goes silent; Narayana's own weapon stopped by Narayana; "it can't be used twice, it
// would kill me"; Bhima: brave or foolish?; three days later came the night he became a killer: read it in our comic.
// The card is the Ashwatthama comic's (no price). STORYBOARD.md has the plan and the sources; the timeline (from the
// voice) is narayan_tl.js, the world narayan_sets.js.
LOOK.bloom = .08;   // matte (owner, 30 Oct): cine.js's own bloom low; the weapon's fire blooms in the fx chain
const CAPY = 1430;
const capBand = (c, a = .74) => band(c, 1300, 1550, a);
const BR = {
  "and calls the weapon his father got | from *NARAYANA* himself.": "and calls the weapon | his father got | from *NARAYANA* himself.",
  "*THOUSANDS* of blazing arrows, | iron balls, razor-edged discs.": "*THOUSANDS* of blazing arrows, | iron balls, | razor-edged discs.",
  "They dragged Bhima off his chariot | and threw him to the ground.": "They dragged Bhima | off his chariot | and threw him to the ground.",
};
VO.caps.forEach((k, i) => say(i ? k.a : -1, k.b, BR[k.text] || k.text, { at: i ? k.at : k.at.map(() => -1), y: k.y ?? CAPY }));

const lens = (focus, ap = 4, o = {}) => ({ dof: { focus, aperture: ap, max: o.max ?? 14, nearK: .6 }, bloom: { k: o.bloom ?? .1, thresh: o.thresh ?? 1.4, knee: .6, radius: 1 }, rays: o.rays, grade: { contrast: o.contrast ?? 1.08, sat: o.sat ?? 1.08, temp: o.temp ?? 0, tint: 0, lift: o.lift ?? 0, gamma: 1, gain: 1 } });
const flat = (o = {}) => ({ bloom: { k: o.bloom ?? .1, thresh: o.thresh ?? 1.4, knee: .6, radius: 1 }, grade: { contrast: o.contrast ?? 1.08, sat: o.sat ?? 1.08, temp: o.temp ?? 0, tint: 0, lift: 0, gamma: 1, gain: 1 } });
const dist = (p) => CAM3.position.distanceTo(p.isVector3 ? p : V3(...p));
const at3 = (k, a, b) => a.map((v, i) => lerp(v, b[i], k));
const R_ = (t, a, b) => easeIO(seg(t, a, b));
const flashK = (c, t, at, col = '255,236,200', k = .4, rate = 5) => { const f = t > at ? Math.exp(-(t - at) * rate) : 0; if (f > .01) { c.save(); c.fillStyle = `rgba(${col},${k * f})`; c.fillRect(0, 0, W, H); c.restore(); } };
const shake = (t, at, k = 1, rate = 3) => { const e = t > at ? Math.exp(-(t - at) * rate) * k : 0; return [Math.sin(t * 61) * e * .12, Math.cos(t * 47) * e * .09, Math.sin(t * 37) * e * .1]; };
const GOLD = '#F4C46A', CREAM = '#FFF3DC', RED = '#FF6A55', BLUE = '#9AD8FF', DEVA = '"Tiro Devanagari Sanskrit"';
// the world: place the camera, set the frame, render
function W3(c, t, o, cam, fx) { cam3(cam); const ex = WORLD.set(t, o); render3(c, WORLD.scene, CAM3, { exposure: ex, fx }); }

// lights for the 2D cast (figure()): rim dx/dy in screen px
const FIRE_L = { tint: ['#1A0806', .32], grade: [[700, 'rgba(0,0,0,0)'], [1950, 'rgba(4,2,6,.85)']], edge: { col: '#FFB070', w: 3, a: .7 }, rim: { col: '#FFD08A', dx: 9, dy: -5, a: .95, blur: 2 } };
const BLUE_L = { tint: ['#0A1838', .28], grade: [[700, 'rgba(0,0,0,0)'], [1950, 'rgba(2,4,10,.85)']], edge: { col: '#9AD8FF', w: 3, a: .6 }, rim: { col: '#D6F0FF', dx: -9, dy: -5, a: .85, blur: 2 } };
const DUEL_L = { tint: ['#140A18', .3], grade: [[700, 'rgba(0,0,0,0)'], [1950, 'rgba(4,2,6,.85)']], edge: { col: '#FFB070', w: 3, a: .55 }, rim: { col: '#9AD8FF', dx: -9, dy: -4, a: .8, blur: 2 } };
const NIGHT_L = { tint: ['#0A1230', .45], grade: [[600, 'rgba(0,0,0,0)'], [1950, 'rgba(2,3,10,.9)']], edge: { col: '#C9D7F5', w: 2.6, a: .5 }, rim: { col: '#E4EDFF', dx: -8, dy: -5, a: .8, blur: 2 } };
const SIL_L = (col = '#FF9A50') => ({ edge: { col, w: 3, a: .9 }, rim: { col: '#FFE2B0', dx: 0, dy: -6, a: .9, blur: 2 } });
// a person close: the head (the rig's (0, -815)) at (x, y), scaled k
function close(c, draw, x, y, k, L) { figure(c, (g) => { g.save(); g.translate(x, y); g.scale(k, k); g.translate(0, 815); draw(g); g.restore(); }, L); }
// a person or a silhouette with the feet at (x, y), scaled k (flip mirrors)
function stand(c, draw, x, y, k, L, flip) { figure(c, (g) => { g.save(); g.translate(x, y); g.scale(k * (flip ? -1 : 1), k); draw(g); g.restore(); }, L); }
const ASH_O = (o = {}) => (g) => ashBust(g, o);
const BUST = (who, o = {}) => (g) => mbhBust(g, { ...CAST[who], ...o });
// tears on Ashwatthama's face (head units), drawn in the same transform as close()
function tears(c, x, y, k, a, t) {
  if (a <= 0) return;
  c.save(); c.translate(x, y); c.scale(k, k); c.translate(0, 815); c.globalAlpha = a;
  for (const s of [-1, 1]) { const run = clamp((t * .5) % 1.2); strokePath(c, `M ${s * 20} -813 C ${s * 22} -800 ${s * 21} -788 ${s * 23} ${-805 + 28 * run}`, 'rgba(210,235,255,.75)', 1.6); ellipse(c, s * 23, -805 + 28 * run, 1.6, 2.2, 'rgba(235,248,255,.9)'); }
  c.restore();
}
// Ashwatthama's gem light (after close(), same transform)
function gemGlow(c, x, y, k, a) { c.save(); c.translate(x, y); c.scale(k, k); c.translate(0, 815); ashGemGlow(c, a); c.restore(); }
// a big number or word on a band
function bigWord(c, t, at, out, txt, y, o = {}) {
  const a = seg(t, at, at + .2) * (1 - seg(t, out, out + .3)); if (a <= 0) return;
  band(c, y - (o.h ?? 130), y + (o.h2 ?? 110), (o.band ?? .5) * a);
  text(c, txt, 540, y, o.font || '700 170px Cinzel', o.col || GOLD, { pop: t - at, alpha: a, spacing: o.spacing ?? 4, glow: [o.glowCol || 'rgba(10,6,4,.9)', 30], maxW: 980 });
  if (o.sub) text(c, o.sub, 540, y + (o.dy ?? 95), o.sfont || '700 40px Cinzel', o.scol || CREAM, { pop: t - at - .15, alpha: a, spacing: 3, glow: ['rgba(6,5,10,.95)', 16], maxW: 940 });
}
// 2D fire over a point: streaks converging, a glow (screen space)
function fireBurst(c, x, y, r, k, t, seed = 1) {
  if (k <= 0) return;
  glow(c, x, y, r * 1.6, '#FF6A20', .55 * k); glow(c, x, y, r * .8, '#FFC070', .7 * k); glow(c, x, y, r * .35, '#FFF2D0', .8 * k);
  const rnd = lcg(seed); c.save(); c.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 70; i++) {
    const a = rnd() * TAU, d0 = r * (.3 + rnd() * 1.6), sp = .6 + rnd(), u = (t * sp + rnd()) % 1, d = d0 * (1 - u), L = 30 + rnd() * 80;
    const px = x + Math.cos(a) * d, py = y + Math.sin(a) * d * .8 - u * 40;
    const g = c.createLinearGradient(px, py, px + Math.cos(a) * L, py + Math.sin(a) * L);
    g.addColorStop(0, `rgba(255,230,170,${.8 * k})`); g.addColorStop(1, 'rgba(255,90,20,0)');
    c.strokeStyle = g; c.lineWidth = 2 + rnd() * 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(px, py); c.lineTo(px + Math.cos(a) * L, py + Math.sin(a) * L); c.stroke();
  }
  c.restore();
}
// flames licking up from the bottom of the frame (screen space), k 0..1
function flamesUp(c, k, t, y0 = H, hgt = 700, seed = 3) {
  if (k <= 0) return;
  const rnd = lcg(seed); c.save(); c.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 26; i++) {
    const x = rnd() * W, w = 80 + rnd() * 160, h = hgt * (.4 + rnd() * .6) * k * (.85 + .15 * Math.sin(t * (5 + rnd() * 4) + i));
    const g = c.createLinearGradient(0, y0, 0, y0 - h); g.addColorStop(0, 'rgba(255,200,110,.55)'); g.addColorStop(.4, 'rgba(255,110,30,.35)'); g.addColorStop(1, 'rgba(180,30,10,0)');
    c.fillStyle = g; c.beginPath(); const sw = Math.sin(t * 3 + i) * 30;
    c.moveTo(x - w / 2, y0); c.bezierCurveTo(x - w / 2, y0 - h * .5, x + sw - w * .2, y0 - h * .8, x + sw, y0 - h); c.bezierCurveTo(x + sw + w * .2, y0 - h * .8, x + w / 2, y0 - h * .5, x + w / 2, y0); c.fill();
  }
  c.restore();
}

// ================= A · the hook: one weapon you beat by dropping yours; fight it even in your mind and it kills you =================
const HERO_P = [0, 30, -30];
SHOTS.push({ a: 0, b: TL.B0 + .3, draw(c, u, t) {
  const pull = R_(t, TL.FIGHT - .1, TL.KILLS + .5), k = easeIO(seg(t, -1, TL.FIGHT)), turn = R_(t, TL.FIGHT - .3, TL.FIGHT + .5);
  const cp = at3(pull, at3(k, [9.6, 27.6, -26.8], [8.6, 27.9, -27.6]), [11, 27.5, 6]);
  const sh = shake(t, TL.KILLS, 1, 2.5);
  // the arrow hangs pointing up into the sky; at "fight it" it turns to aim at you
  const aim = at3(turn, [0, 60, -8], [cp[0] - 2, cp[1] - 9, cp[2] + 6]);
  W3(c, t, { sky: { fire: .35 + .2 * pull }, hero: { pos: HERO_P, aim },
    swarm: { hang: 1, fill: R_(t, TL.FIGHT, TL.MIND + .4) * .95, hangAt: V3(0, 31, -42), aim: V3(cp[0], cp[1] - 30, cp[2] + 30), glow: .9 + .7 * seg(t, TL.KILLS - .1, TL.KILLS + .2) },
    pand: { a: 0 }, kaur: { a: 0 }, fog: ['#120A14', 60, 320], light: { key: 1.4, fill: .7 } },
    { pos: [cp[0] + sh[0], cp[1] + sh[1], cp[2] + sh[2]], at: at3(pull, [0, 30.4, -29.6], [0, 31, -52]), fov: lerp(40, 50, pull) },
    lens(lerp(dist(HERO_P), 45, pull), lerp(5, 1.5, pull), { bloom: .12 }));
  flashK(c, t, TL.KILLS - .05, '255,200,140', .35, 3);
  capBand(c);
} });

// ================= B · Kurukshetra, day 15: Drona killed by a lie ("Ashwatthama is dead": he lays down his bow) =================
SHOTS.push({ a: TL.B0, b: TL.C0 + .3, xf: .4, draw(c, u, t) {
  const k = easeIO(seg(t, TL.B0, TL.C0 + .3)), shut = R_(t, TL.LIE - .3, TL.LIE + .9);
  W3(c, t, { sky: { fire: .3 }, pand: { a: 1 }, kaur: { a: 1 }, embers: .6, fog: ['#2A1A20', 25, 180], light: { key: 1.4 } },
    { pos: [0, 2, 40], at: [0, 9, -40], fov: 52 }, lens(6, 12, { max: 22 }));
  const x = 540, y = lerp(800, 770, k), kk = lerp(3.0, 3.3, k);
  close(c, BUST('drona', { t, eyes: 1 - shut, pain: .3 + .5 * shut, look: [0, .2] }), x, y, kk, { ...FIRE_L, rim: { ...FIRE_L.rim, a: .9 - .4 * shut } });
  tag(c, 'MAHABHARATA · DRONA PARVA', 540, 430, t, TL.B0 + .1, { out: TL.C0, size: 26 });
  const a = seg(t, TL.LIE - .1, TL.LIE + .2) * (1 - seg(t, TL.C0, TL.C0 + .3));
  if (a > 0) { band(c, 1600, 1790, .7 * a);
    text(c, '“ASHWATTHAMA IS DEAD.”', 540, 1660, '700 50px Cinzel', GOLD, { pop: t - TL.LIE + .1, alpha: a, spacing: 2, glow: ['rgba(10,6,4,.9)', 22], maxW: 980 });
    text(c, 'He laid down his bow. It was an elephant.', 540, 1725, 'italic 36px Marcellus', CREAM, { alpha: a * seg(t, TL.LIE + .3, TL.LIE + .6), glow: ['rgba(6,5,10,.95)', 14], maxW: 960 }); }
  capBand(c);
} });

// ================= C · his son Ashwatthama wipes his tears, and calls the weapon of Narayana =================
SHOTS.push({ a: TL.C0, b: TL.D0 + .3, xf: .4, draw(c, u, t) {
  const k = easeIO(seg(t, TL.C0, TL.D0 + .3)), call = R_(t, TL.CALLS - .2, TL.NARAYANA + .6);
  W3(c, t, { sky: { fire: .35 + .35 * call }, mandala: .25 * call, mandalaO: { core: .5 }, kaur: { a: 1 }, pand: { a: 0 }, embers: .5, fog: ['#2A1418', 30, 220], light: { key: 1.2 + call } },
    { pos: [0, 2.2, -60], at: [0, 9, -120], fov: 50 }, lens(10, 10, { max: 22 }));
  const x = 540, y = lerp(780, 740, k), kk = lerp(3.1, 3.5, k);
  const eyes = t < TL.TEARS + .9 ? .55 : 1, pain = 1 - call;
  close(c, ASH_O({ t, eyes, pain: pain * .9, fierce: call, look: [0, -.1 * call] }), x, y, kk, { ...FIRE_L, rim: { ...FIRE_L.rim, a: .6 + .4 * call } });
  tears(c, x, y, kk, (1 - call) * seg(t, TL.C0, TL.C0 + .4), t);
  gemGlow(c, x, y, kk, .5 + .8 * call);
  glow(c, 540, 1900, 900, '#FF6A20', .25 * call, 'screen');
  capBand(c);
} });

// ================= D · the Narayanastra: the mandala ignites in the sky =================
SHOTS.push({ a: TL.D0, b: TL.E0 + .3, draw(c, u, t) {
  const k = easeIO(seg(t, TL.D0, TL.E0 + .3)), ig = R_(t, TL.D0, TL.NAME + .5);
  const sh = shake(t, TL.NAME, .8, 2);
  W3(c, t, { sky: { fire: .6 + .2 * ig }, mandala: ig, kaur: { a: 1 }, pand: { a: 0 }, embers: .8, fog: ['#3A1810', 40, 260], light: { key: 1.6 + ig, glow: 40 * ig, glowAt: [0, 30, -80] } },
    { pos: [sh[0], 2.5 + sh[1], lerp(-14, -22, k)], at: [0, 34, -95], fov: 62 }, flat({ bloom: .14, thresh: 1.2, rays: { at: [0, 46, -95], k: .25 * ig, thresh: 1.2, decay: .965, len: .8, col: '#FFC890' } }));
  flashK(c, t, TL.NAME - .1, '255,210,150', .45, 3);
  const a = seg(t, TL.NAME - .15, TL.NAME + .15) * (1 - seg(t, TL.E0, TL.E0 + .3));
  if (a > 0) { band(c, 940, 1260, .55 * a);
    text(c, 'नारायणास्त्र', 540, 1040, `100px ${DEVA}`, '#FFE9C0', { pop: t - TL.NAME + .1, alpha: a, glow: ['rgba(244,120,40,.55)', 30] });
    text(c, 'NARAYANASTRA', 540, 1160, '700 96px Cinzel', GOLD, { pop: t - TL.NAME, alpha: a, spacing: 4, glow: ['rgba(10,6,4,.9)', 28], maxW: 1000 });
    text(c, 'the weapon of Narayana', 540, 1225, 'italic 38px Marcellus', CREAM, { pop: t - TL.NAME - .2, alpha: a, glow: ['rgba(6,5,10,.95)', 16] }); }
  capBand(c);
} });

// ================= E · the earth shook, the sea churned; rivers flowed backwards =================
const flowOff = (t) => { let s = 0; const n = 240, a = TL.E0 - 2, dt = (t - a) / n; for (let i = 0; i < n; i++) { const x = a + (i + .5) * dt; s += lerp(3, -5, R_(x, TL.RIVERS - .2, TL.BACK + .3)) * dt; } return s; };
SHOTS.push({ a: TL.E0, b: TL.RIVERS - .25, draw(c, u, t) {
  const sh = shake(t, TL.SHOOK - .1, 2.4, 1.2), sh2 = shake(t, TL.SEA - .1, 1.6, 1.4);
  W3(c, t, { sky: { fire: .7 }, mandala: 1, pand: { a: 1 }, kaur: { a: 1 }, dust: 1, embers: .8, fog: ['#3A1C14', 30, 240], light: { key: 2.2, glow: 30, glowAt: [0, 30, -80] } },
    { pos: [sh[0] + sh2[0] + 4, 1.4 + sh[1] + sh2[1], 46], at: [0, 7, -40], fov: 48, roll: (sh[2] + sh2[2]) * .3 }, flat({ bloom: .12 }));
  capBand(c);
} });
SHOTS.push({ a: TL.RIVERS - .25, b: TL.F0 + .3, xf: .3, draw(c, u, t) {
  const k = easeIO(seg(t, TL.RIVERS - .25, TL.F0 + .3)), back = R_(t, TL.RIVERS - .2, TL.BACK + .3);
  W3(c, t, { sky: { fire: .65 }, river: { off: flowOff(t), fire: .8, churn: back }, pand: { a: 0 }, kaur: { a: 0 }, fog: ['#2A1418', 40, 260], light: { key: 1.6 } },
    { pos: at3(k, [252, 7, 30], [251, 6.2, 24]), at: [261, 0, -30], fov: 46 }, flat({ bloom: .1 }));
  // the current's arrow on the water: downstream (toward the sea), then reversed
  const p0 = toScreen3([261, .1, -4]), p1 = toScreen3([261, .1, -24]), dir = lerp(1, -1, back), a = seg(t, TL.RIVERS - .25, TL.RIVERS + .1) * (1 - seg(t, TL.F0, TL.F0 + .3));
  if (a > 0 && Math.abs(dir) > .05) {
    const [ax, ay] = dir > 0 ? p0 : p1, [bx, by] = dir > 0 ? p1 : p0, ang = Math.atan2(by - ay, bx - ax);
    c.save(); c.globalAlpha = a * Math.min(1, Math.abs(dir) * 1.5); c.strokeStyle = back > .5 ? RED : CREAM; c.lineWidth = 9; c.lineCap = 'round'; c.beginPath(); c.moveTo(ax, ay); c.lineTo(bx, by); c.stroke();
    c.fillStyle = c.strokeStyle; c.beginPath(); c.moveTo(bx + Math.cos(ang) * 30, by + Math.sin(ang) * 30); c.lineTo(bx + Math.cos(ang + 2.4) * 34, by + Math.sin(ang + 2.4) * 34); c.lineTo(bx + Math.cos(ang - 2.4) * 34, by + Math.sin(ang - 2.4) * 34); c.fill(); c.restore();
  }
  tag(c, back > .5 ? 'FLOWING BACKWARDS' : 'TO THE SEA', 540, 520, t, TL.RIVERS - .2, { out: TL.F0, size: 30, col: back > .5 ? RED : GOLD });
  tag(c, 'DRONA PARVA 7.167.2', 540, 590, t, TL.RIVERS + .3, { out: TL.F0, size: 22, col: '#D8B070' });
  capBand(c);
} });

// ================= F · then the sky filled: thousands of blazing arrows, iron balls, razor discs =================
SHOTS.push({ a: TL.F0, b: TL.BALLS - .35, xf: .3, draw(c, u, t) {
  const k = easeIO(seg(t, TL.F0, TL.BALLS - .35)), fill = R_(t, TL.FILLED - .3, TL.THOUSANDS + .8);
  W3(c, t, { sky: { fire: .75 }, mandala: 1, swarm: { fill }, pand: { a: 1 }, pandC: { a: 1 }, kaur: { a: 1 }, embers: .6, fog: ['#2A1418', 50, 280], light: { key: 1.8, glow: 30 * fill, glowAt: [0, 25, 10] } },
    { pos: at3(k, [0, 4, 78], [0, 5.5, 70]), at: [0, 24, -40], fov: 58 }, flat({ bloom: .1, thresh: 1.3 }));
  bigWord(c, t, TL.THOUSANDS - .1, TL.BALLS - .4, 'THOUSANDS', 560, { font: '700 120px Cinzel', h: 110, h2: 70 });
  capBand(c);
} });
SHOTS.push({ a: TL.BALLS - .35, b: TL.G0 + .3, draw(c, u, t) {
  const k = easeIO(seg(t, TL.BALLS - .35, TL.G0 + .3));
  W3(c, t, { sky: { fire: .8 }, mandala: 1, swarm: { fill: 1 }, pand: { a: 0 }, kaur: { a: 1 }, fog: ['#2A1418', 60, 300], light: { key: 1.8 } },
    { pos: at3(k, [9, 27, -14], [7, 28.5, -20]), at: [0, 40, -90], fov: 44, roll: -.08 }, lens(26, 3, { bloom: .1, thresh: 1.3, max: 18 }));
  tag(c, 'DRONA PARVA 7.170.16–19', 540, 470, t, TL.BALLS - .2, { out: TL.G0, size: 22, col: '#D8B070' });
  capBand(c);
} });

// ================= G · the Pandavas fought back, and every strike made it stronger =================
SHOTS.push({ a: TL.G0, b: TL.H0 + .3, xf: .3, draw(c, u, t) {
  const k = easeIO(seg(t, TL.G0, TL.H0 + .3)), gr = R_(t, TL.STRIKE - .2, TL.STRONGER + .6);
  W3(c, t, { sky: { fire: .8 + .2 * gr }, mandala: 1 + .35 * gr, mandalaO: { core: 1 + .8 * gr }, swarm: { fill: 1, size: 1 + .45 * gr, glow: 1 + .6 * gr, speed: 1 + .3 * gr }, pand: { a: 1 }, pandC: { a: 1 }, kaur: { a: 1 }, embers: 1, fog: ['#2A1418', 50, 280], light: { key: 2 + gr, glow: 40 + 40 * gr, glowAt: [0, 25, 10] } },
    { pos: at3(k, [-14, 3, 60], [-10, 3.6, 52]), at: [4, 22, -40], fov: 54 }, flat({ bloom: .14 + .06 * gr, thresh: 1.2 }));
  // the Pandavas' arrows going up (thin white streaks from the army)
  const rnd = lcg(77); c.save(); c.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 40; i++) { const x0 = rnd() * W, s0 = rnd(), u2 = ((t - TL.G0) * (1.2 + rnd()) + s0) % 1; if (t < TL.FOUGHT - .4) continue; const y0 = 1500 - u2 * 1100, L = 90; c.strokeStyle = `rgba(230,240,255,${.6 * (1 - u2)})`; c.lineWidth = 3; c.beginPath(); c.moveTo(x0 + u2 * 120, y0); c.lineTo(x0 + u2 * 120 + 12, y0 - L); c.stroke(); }
  c.restore();
  bigWord(c, t, TL.STRONGER - .1, TL.H0, 'STRONGER', 560, { font: '700 130px Cinzel', h: 110, h2: 70, col: '#FFB050' });
  flashK(c, t, TL.STRONGER - .05, '255,170,90', .25, 3);
  capBand(c);
} });

// ================= H · Krishna holds the army back: drop your weapons, get down; whoever fights it even in his mind =================
const KR_WIDE = { l: [[270, -700], [410, -690]], r: [[270, -700], [410, -690]] };
SHOTS.push({ a: TL.H0, b: TL.DROP - .25, xf: .3, draw(c, u, t) {
  const k = easeIO(seg(t, TL.H0, TL.DROP - .25)), open = R_(t, TL.KRISHNA - .2, TL.ARMS + .2);
  W3(c, t, { sky: { fire: .8 }, mandala: 1.2, swarm: { fill: 1, size: 1.3, glow: 1.4 }, pand: { a: 1 }, pandC: { a: 1 }, kaur: { a: 1 }, embers: .8, fog: ['#2A1418', 40, 260], light: { key: 2.2 } },
    { pos: [0, 1.7, lerp(34, 32, k)], at: [0, 10, -40], fov: 52 }, lens(30, 4, { bloom: .14, thresh: 1.2 }));
  const arms = { l: [at3(open, [178, -560], KR_WIDE.l[0]), at3(open, [194, -440], KR_WIDE.l[1])], r: [at3(open, [178, -560], KR_WIDE.r[0]), at3(open, [194, -440], KR_WIDE.r[1])] };
  stand(c, (g) => mbhFigure(g, { ...CAST.krishna, t, arms, mouth: open * .4, fierce: .4 }), 540, lerp(1880, 1860, k), lerp(1.08, 1.14, k), { ...BLUE_L, rim: { col: '#FFC890', dx: 0, dy: -7, a: .9, blur: 2 } });
  capBand(c);
} });
SHOTS.push({ a: TL.DROP - .25, b: TL.WHOEVER - .25, draw(c, u, t) {
  const k = easeIO(seg(t, TL.DROP - .25, TL.WHOEVER - .25));
  W3(c, t, { sky: { fire: .8 }, mandala: 1.2, swarm: { fill: 1, size: 1.3, glow: 1.4 }, pand: { a: 1 }, kaur: { a: 1 }, fog: ['#2A1418', 40, 260], light: { key: 2.2 } },
    { pos: [0, 1.7, 30], at: [0, 12, -40], fov: 52 }, lens(5, 14, { max: 24, bloom: .14 }));
  const sp = Math.max(0, Math.sin((t - TL.DROP) * 9)) * seg(t, TL.DROP - .1, TL.GROUND + .4) * (1 - seg(t, TL.GROUND + .4, TL.GROUND + .6));
  close(c, BUST('krishna', { t, mouth: .35 + .5 * sp, fierce: .7, look: [0, 0] }), 540, lerp(840, 810, k), lerp(3.0, 3.3, k), { ...BLUE_L, rim: { col: '#FFC890', dx: 0, dy: -8, a: .9, blur: 2 } });
  capBand(c);
} });
SHOTS.push({ a: TL.WHOEVER - .25, b: TL.I0 + .3, draw(c, u, t) {
  const k = easeIO(seg(t, TL.WHOEVER - .25, TL.I0 + .3));
  W3(c, t, { sky: { fire: .85 }, mandala: 1.2, swarm: { fill: 1, size: 1.35, glow: 1.5 }, pand: { a: 1 }, pandC: { a: 1 }, kaur: { a: 1 }, embers: .6, fog: ['#2A1418', 50, 280], light: { key: 2.2, glow: 60, glowAt: [0, 25, 10] } },
    { pos: at3(k, [30, 34, 80], [26, 30, 72]), at: [0, 6, 0], fov: 50 }, flat({ bloom: .14, thresh: 1.2 }));
  const a = seg(t, TL.KMIND - .1, TL.KMIND + .2) * (1 - seg(t, TL.I0, TL.I0 + .3));
  if (a > 0) { c.save(); const g = c.createRadialGradient(540, 960, 300, 540, 960, 1200); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(140,10,10,${.55 * a})`); c.fillStyle = g; c.fillRect(0, 0, W, H); c.restore(); }
  bigWord(c, t, TL.KMIND - .1, TL.I0, 'EVEN IN HIS MIND', 560, { font: '700 84px Cinzel', h: 100, h2: 80, col: '#FFE9D8', glowCol: 'rgba(160,10,10,.95)', band: .75, sub: 'DRONA PARVA 7.170.42', sfont: '700 26px Cinzel', scol: '#D8B070', dy: 70 });
  capBand(c);
} });

// ================= I · and a whole army let its weapons fall =================
SHOTS.push({ a: TL.I0, b: TL.J0 + .3, xf: .3, draw(c, u, t) {
  const k = easeIO(seg(t, TL.I0, TL.J0 + .3)), d = t - (TL.ARMY - .2);
  W3(c, t, { sky: { fire: .8 }, mandala: 1.1, swarm: { fill: 1, size: 1.2, glow: 1.3 }, pand: { drop: d, wave: [6, 4], speed: 26 }, pandC: { drop: d, wave: [6, 4], speed: 26 }, bhimaC: { a: 1 }, kaur: { a: 1 }, embers: .6, fog: ['#2A1418', 50, 300], light: { key: 2, glow: 40, glowAt: [0, 25, 10] } },
    { pos: at3(k, [-16, 3.2, 58], [-12, 5.5, 52]), at: at3(k, [4, 1.2, 24], [5, 1, 20]), fov: 50 }, flat({ bloom: .1, thresh: 1.3 }));
  capBand(c);
} });

// ================= J · all but one: Bhima. "the strength of 10,000 elephants. I will fight it!" =================
SHOTS.push({ a: TL.J0, b: TL.STRENGTH - .3, xf: .3, draw(c, u, t) {
  const k = easeIO(seg(t, TL.J0, TL.STRENGTH - .3)), up = R_(t, TL.BHIMA - .4, TL.BHIMA + .3);
  W3(c, t, { sky: { fire: .85 }, mandala: 1.2, swarm: { fill: 1, size: 1.25, glow: 1.2 }, pand: { drop: 99, wave: [6, 4] }, pandC: { drop: 99, wave: [6, 4] }, kaur: { a: 1 }, embers: .6, fog: ['#2A1418', 30, 220], light: { key: 2 } },
    { pos: at3(k, [-4, 1.2, 46], [-3, 1.4, 42]), at: [4, 6, 0], fov: 52 }, lens(30, 4, { bloom: .12 }));
  stand(c, (g) => mbhFigure(g, { ...CAST.bhima, t, arms: { l: 'hip', r: [at3(up, [214, -560], [230, -830]), at3(up, [150, -690], [250, -980])] }, props: { r: 'mace' }, maceA: lerp(0, -.4, up), fierce: 1, mouth: .5 * up }), 540, lerp(1900, 1880, k), lerp(1.05, 1.12, k), FIRE_L);
  bigWord(c, t, TL.BHIMA - .1, TL.STRENGTH - .3, 'BHIMA', 400, { font: '700 140px Cinzel', h: 120, h2: 80 });
  capBand(c);
} });
SHOTS.push({ a: TL.STRENGTH - .3, b: TL.WILL - .2, draw(c, u, t) {
  const k = easeIO(seg(t, TL.STRENGTH - .3, TL.WILL - .2));
  W3(c, t, { sky: { fire: .85 }, mandala: 1.2, swarm: { fill: 1, size: 1.25, glow: 1.3 }, pand: { drop: 99, wave: [6, 4] }, kaur: { a: 1 }, fog: ['#2A1418', 30, 220], light: { key: 2 } },
    { pos: [6, 2.6, 18], at: [0, 12, -40], fov: 52 }, lens(5, 14, { max: 24, bloom: .14 }));
  close(c, BUST('bhima', { t, mouth: .9, fierce: 1, look: [0, -.2] }), 540, lerp(820, 790, k), lerp(3.0, 3.25, k), FIRE_L);
  bigWord(c, t, TL.N10K - .1, TL.WILL - .2, '10,000', 470, { font: '700 150px Cinzel', h: 120, h2: 110, sub: 'ELEPHANTS', dy: 92 });
  capBand(c);
} });
SHOTS.push({ a: TL.WILL - .2, b: TL.K0 + .3, draw(c, u, t) {
  const k = seg(t, TL.WILL - .2, TL.K0 + .3);
  W3(c, t, { sky: { fire: .9 }, mandala: 1.2, swarm: { fill: 1, size: 1.3, glow: 1.4, focus: .3 * k }, pand: { a: 0 }, kaur: { a: 1 }, embers: 1, fog: ['#2A1418', 50, 280], light: { key: 2.2 } },
    { pos: [40, 2, 30], at: [0, 14, -20], fov: 56 }, flat({ bloom: .14, thresh: 1.2 }));
  // his chariot charging across the frame: a silhouette with a fire rim; Bhima standing, his mace raised
  const x = lerp(-120, 620, easeIO(k)), y = 1230;
  stand(c, (g) => { chariot(g, { col: '#0B0809', gallop: t * 9, flag: true, t }); g.save(); g.translate(-60, 0); g.scale(-.62, .62); manSil(g, { pose: 'raise', prop: 'mace', head: 'knot', col: '#0B0809', beard: 'short' }); g.restore(); }, x, y, .95, SIL_L('#FF9A50'));
  capBand(c);
} });

// ================= K · the whole weapon fell on his head =================
SHOTS.push({ a: TL.K0, b: TL.L0 + .3, draw(c, u, t) {
  const k = easeIO(seg(t, TL.K0, TL.L0 + .3)), f = R_(t, TL.WHOLE - .3, TL.HIS + .2), bl = R_(t, TL.HIS - .2, TL.HEAD + .3);
  const sh = shake(t, TL.HEAD - .05, 1.6, 2);
  W3(c, t, { sky: { fire: .95 }, mandala: 1.2, mandalaO: { core: 1.4 }, swarm: { fill: 1, size: 1.3, glow: 1.6, focus: f }, blaze: bl, pand: { drop: 99, wave: [6, 4] }, pandC: { drop: 99, wave: [6, 4] }, bhimaC: { a: 1 - bl }, kaur: { a: 1 }, embers: 1, fog: ['#2A1418', 50, 280], light: { key: 2.2, glow: 120 * bl, glowAt: [6, 4, 14] } },
    { pos: at3(k, [-44 + sh[0] * 8, 26 + sh[1] * 8, 66], [-40, 22, 60]), at: [6, 4, 14], fov: 46 }, flat({ bloom: .16, thresh: 1.1 }));
  flashK(c, t, TL.HEAD - .05, '255,200,140', .45, 2.5);
  capBand(c);
} });

// ================= L · Krishna and Arjuna ran into the fire, unarmed; they dragged Bhima down =================
const BLAZE_CAM = { pos: [10, 1.6, 30], at: [6, 3.6, 14], fov: 42 };
SHOTS.push({ a: TL.L0, b: TL.DRAGGED - .25, xf: .3, draw(c, u, t) {
  const k = seg(t, TL.L0, TL.DRAGGED - .25);
  W3(c, t, { sky: { fire: .95 }, mandala: 1.2, swarm: { fill: 1, size: 1.2, glow: 1.5, focus: 1 }, blaze: 1, pand: { a: 0 }, kaur: { a: 0 }, embers: 1, fog: ['#2A1418', 30, 220], light: { key: 2, glow: 120, glowAt: [6, 4, 14] } },
    BLAZE_CAM, flat({ bloom: .14, thresh: 1.2 }));
  const p = toScreen3([6, 2, 14]); fireBurst(c, p[0], p[1], 330, 1, t, 4);
  // the two run in from the right, into the fire (left); Krishna's feather on his crown
  for (const [i, dx, sc] of [[0, 0, 1], [1, 200, .94]]) {
    const x = lerp(1250 + dx, 640 + dx * .6, easeIO(k)), ph = (t * 7 + i * 1.7);
    stand(c, (g) => { manSil(g, { pose: 'walk', head: 'kirita', col: '#0B0809', joints: { hip: [0, -460 + Math.abs(Math.sin(ph)) * 24], neck: [-60, -712], tilt: .2, fa: [[40 * Math.cos(ph), -600], [90 * Math.cos(ph), -500]], ba: [[-40 * Math.cos(ph), -600], [-90 * Math.cos(ph), -500]], fl: [[-110 * Math.cos(ph), -250], [-230 * Math.cos(ph), -40 + 30 * Math.max(0, Math.sin(ph))]], bl: [[110 * Math.cos(ph), -250], [230 * Math.cos(ph), -40 + 30 * Math.max(0, -Math.sin(ph))]] } });
      if (i === 0) fillPath(g, 'M -10 -1200 C 30 -1270 70 -1290 90 -1250 C 60 -1220 30 -1210 -10 -1200 Z', '#0B0809'); }, x, 1290, .78 * sc, SIL_L('#FFB060'));
  }
  tag(c, 'UNARMED', 540, 470, t, TL.UNARMED - .1, { out: TL.DRAGGED - .25, size: 34 });
  capBand(c);
} });
const lerpJ = (A, B, k) => { const o = {}; for (const key in A) o[key] = Array.isArray(A[key][0]) ? A[key].map((p, i) => at3(k, p, B[key][i])) : Array.isArray(A[key]) ? at3(k, A[key], B[key]) : lerp(A[key] || 0, B[key] || 0, k); return o; };
SHOTS.push({ a: TL.DRAGGED - .25, b: TL.M0 + .3, draw(c, u, t) {
  const pull = R_(t, TL.DRAGGED, TL.THREW + .2), fall = R_(t, TL.THREW - .1, TL.TOGROUND + .1);
  W3(c, t, { sky: { fire: .95 }, mandala: 1.2, swarm: { fill: 1, size: 1.2, glow: 1.5, focus: 1 }, blaze: 1, pand: { a: 0 }, kaur: { a: 0 }, embers: 1, fog: ['#2A1418', 30, 220], light: { key: 2, glow: 120, glowAt: [6, 4, 14] } },
    { ...BLAZE_CAM, pos: [9, 1.4, 27] }, flat({ bloom: .16, thresh: 1.1 }));
  const p = toScreen3([6, 2, 14]); fireBurst(c, p[0], p[1] - 60, 380, 1, t, 9);
  // Bhima roaring (shout), pulled back and thrown down (kneel); Krishna and Arjuna either side, pulling
  const J = lerpJ({ ...SIL_POSE.shout }, { ...SIL_POSE.kneel }, fall);
  const bx = lerp(520, 470, pull);
  stand(c, (g) => manSil(g, { pose: 'shout', joints: J, head: 'knot', beard: 'short', col: '#0B0809', mouth: 1 - fall }), bx, 1280, .82, SIL_L('#FFB060'));
  const PULL = { hip: [0, -470], neck: [40, -716], fa: [[-60, -620], [-150, -600]], ba: [[-40, -630], [-130, -640]], fl: [[-50, -250], [-120, -24]], bl: [[60, -246], [130, -24]], tilt: .1 };
  stand(c, (g) => { manSil(g, { pose: 'walk', joints: PULL, head: 'kirita', col: '#0B0809' }); fillPath(g, 'M -10 -1200 C 30 -1270 70 -1290 90 -1250 C 60 -1220 30 -1210 -10 -1200 Z', '#0B0809'); }, bx + 300 - 40 * pull, 1290, .78, SIL_L('#FFB060'));
  stand(c, (g) => manSil(g, { pose: 'walk', joints: PULL, head: 'kirita', col: '#0B0809' }), bx - 290 + 40 * pull, 1290, .76, SIL_L('#FFB060'), true);
  if (t > TL.TOGROUND) { const d = t - TL.TOGROUND; glow(c, bx, 1290, 300 * (1 + d), '#C8A07A', .35 * Math.exp(-d * 2), 'screen'); }
  capBand(c);
} });

// ================= M · the moment his weapons touched the earth, the Narayanastra went silent =================
const MACE_AT = [8.2, 0, 16.4];
SHOTS.push({ a: TL.M0, b: TL.EARTH + .9, draw(c, u, t) {
  const fallK = R_(t, TL.M0 + .1, TL.EARTH), hit = t > TL.EARTH ? t - TL.EARTH : 0, calm = R_(t, TL.EARTH, TL.EARTH + 1.6);
  const tilt = lerp(.25, Math.PI / 2 - .06, fallK * fallK), y = lerp(1.25, .1, fallK * fallK);
  const sh = shake(t, TL.EARTH, .5, 4);
  W3(c, t, { sky: { fire: .95 * (1 - calm), calm }, mandala: 1.2 * (1 - calm), swarm: { fill: 1, size: 1.2, glow: 1.5, focus: 1, fade: calm }, blaze: .22 * (1 - calm), pand: { a: 0 }, kaur: { a: 0 }, embers: 1 - calm, dust: 1,
    mace: { pos: [MACE_AT[0] - Math.sin(tilt) * .9 * 0, y, MACE_AT[2]], rot: [0, .6, tilt] }, fog: [calm > .5 ? '#0E1424' : '#2A1418', 20, 200], light: { key: 1.8 * (1 - calm) + .3, keyCol: '#FF9A5A', fill: .5 + .6 * calm, glow: 25 * (1 - calm), glowAt: [6, 4, 14] } },
    { pos: [MACE_AT[0] + 1.6 + sh[0] * .2, .45 + sh[1] * .2, MACE_AT[2] + 2.3], at: [MACE_AT[0] - .2, .3, MACE_AT[2]], fov: 34 }, lens(dist(MACE_AT), 9, { max: 20, bloom: .12 }));
  if (hit > 0) { const p = toScreen3([MACE_AT[0] + .2, .05, MACE_AT[2]]); c.save(); c.globalAlpha = Math.exp(-hit * 2.2); c.strokeStyle = 'rgba(230,200,160,.8)'; c.lineWidth = 6; c.beginPath(); c.ellipse(p[0], p[1], 120 + hit * 700, 30 + hit * 160, 0, 0, TAU); c.stroke(); c.restore(); }
  flashK(c, t, TL.EARTH - .02, '255,250,240', .5, 4);
  capBand(c);
} });
SHOTS.push({ a: TL.EARTH + .9, b: TL.N0 + .3, xf: .3, draw(c, u, t) {
  const k = easeIO(seg(t, TL.EARTH + .9, TL.N0 + .3)), calm = .7 + .3 * R_(t, TL.EARTH + .9, TL.SILENT);
  W3(c, t, { sky: { fire: .1, calm }, mandala: 0, swarm: { fill: 0 }, pand: { drop: 99, wave: [6, 4] }, pandC: { drop: 99, wave: [6, 4] }, bhimaC: { a: 0 }, kaur: { a: 1 }, dust: .4, edge: '#BCD6FF',
    mace: { pos: [MACE_AT[0], .1, MACE_AT[2]], rot: [0, .6, Math.PI / 2 - .06] }, fog: ['#0E1424', 40, 260], light: { key: .5, fill: 1.5, hemi: 1.3 }, exposure: 1.25 },
    { pos: at3(k, [12, 3, 24], [26, 22, 52]), at: at3(k, [7, 0, 15], [2, 0, 0]), fov: 46 }, flat({ bloom: .06, temp: -.03 }));
  bigWord(c, t, TL.SILENT - .1, TL.N0, 'SILENT', 560, { font: '700 140px Cinzel', col: '#D6ECFF', glowCol: 'rgba(4,8,20,.9)', h: 110, h2: 70 });
  capBand(c);
} });

// ================= N · Narayana's own weapon, stopped by Narayana himself =================
SHOTS.push({ a: TL.N0, b: TL.O0 + .3, xf: .4, draw(c, u, t) {
  const k = easeIO(seg(t, TL.N0, TL.O0 + .3)), h = R_(t, TL.STOPPED - .4, TL.NARAYANA2 + .6);
  W3(c, t, { sky: { fire: 0, calm: 1, k: 1.15 }, pand: { a: 0 }, kaur: { a: 0 }, fog: ['#0E1424', 40, 260], light: { key: .2, fill: 1 } },
    { pos: [0, 2, 20], at: [0, 14, 80], fov: 56 }, flat({ bloom: .08, temp: -.02 }));
  const x = 540, y = lerp(800, 770, k), kk = lerp(3.0, 3.3, k);
  // a halo of light rising behind him: rings like a wheel (the chakra's shape, never named here)
  c.save(); c.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 3; i++) { c.strokeStyle = `rgba(150,215,255,${(.18 + .25 * h) * (1 - i * .25)})`; c.lineWidth = 8 - i * 2; c.beginPath(); c.arc(x, y - 30, (360 + i * 60) * (.92 + .08 * h), 0, TAU); c.stroke(); }
  for (let i = 0; i < 24; i++) { const a = i / 24 * TAU + t * .15; c.strokeStyle = `rgba(255,220,150,${.18 * h})`; c.lineWidth = 3; c.beginPath(); c.moveTo(x + Math.cos(a) * 360, y - 30 + Math.sin(a) * 360); c.lineTo(x + Math.cos(a) * 420, y - 30 + Math.sin(a) * 420); c.stroke(); }
  c.restore(); glow(c, x, y - 30, 600, '#4AA8FF', .25 + .25 * h, 'screen');
  close(c, BUST('krishna', { t, smile: .35, eyes: .85, look: [0, 0] }), x, y + 50, kk, { ...BLUE_L, rim: { col: '#E8F6FF', dx: 0, dy: -8, a: .9, blur: 2 } });
  tag(c, 'NARA & NARAYANA · DRONA PARVA 7.171.13', 540, 1630, t, TL.NARAYANA2 - .1, { out: TL.O0, size: 22, col: '#D8B070' });
  capBand(c);
} });

// ================= O · "Use it again!" "It can't be used twice. It would kill me." =================
SHOTS.push({ a: TL.O0, b: TL.TWICE - .45, draw(c, u, t) {
  const k = easeIO(seg(t, TL.O0, TL.TWICE - .45));
  W3(c, t, { sky: { fire: .25, calm: .5 }, kaur: { a: 1 }, pand: { a: 0 }, fog: ['#1A1420', 40, 260], light: { key: .8 } },
    { pos: [0, 2, -60], at: [0, 10, -120], fov: 56 }, lens(8, 12, { max: 22 }));
  const sp = Math.max(0, Math.sin((t - TL.BEGGED) * 8)) * seg(t, TL.BEGGED, TL.AGAIN + .3) * (1 - seg(t, TL.AGAIN + .3, TL.AGAIN + .5));
  close(c, BUST('duryo', { t, mouth: .3 + .6 * sp, fierce: 1, look: [.3, 0] }), lerp(500, 520, k), 790, lerp(3.0, 3.2, k), DUEL_L);
  bigWord(c, t, TL.AGAIN - .1, TL.TWICE - .45, 'AGAIN!', 470, { font: '700 140px Cinzel', h: 110, h2: 80, col: '#FF8A6A' });
  capBand(c);
} });
SHOTS.push({ a: TL.TWICE - .45, b: TL.P0 + .3, draw(c, u, t) {
  const k = easeIO(seg(t, TL.TWICE - .45, TL.P0 + .3));
  W3(c, t, { sky: { fire: .25, calm: .5 }, kaur: { a: 1 }, pand: { a: 0 }, fog: ['#1A1420', 40, 260], light: { key: .8 } },
    { pos: [0, 2, -62], at: [-4, 10, -120], fov: 56 }, lens(8, 12, { max: 22 }));
  const x = lerp(560, 540, k), kk = lerp(3.1, 3.4, k);
  close(c, ASH_O({ t, eyes: .75, fierce: .5, pain: .2, look: [-.3, .2] }), x, 790, kk, DUEL_L);
  gemGlow(c, x, 790, kk, .6);
  bigWord(c, t, TL.TWICE - .1, TL.P0, 'ONLY ONCE', 470, { font: '700 120px Cinzel', h: 110, h2: 100, sub: 'DRONA PARVA 7.171.27', sfont: '700 26px Cinzel', scol: '#D8B070', dy: 80 });
  capBand(c);
} });

// ================= P · so tell us: Bhima, brave or foolish? =================
SHOTS.push({ a: TL.P0, b: TL.Q0 + .3, xf: .3, draw(c, u, t) {
  const k = easeIO(seg(t, TL.P0, TL.Q0 + .3));
  W3(c, t, { sky: { fire: 0, calm: 1 }, pand: { drop: 99, wave: [6, 4] }, pandC: { drop: 99, wave: [6, 4] }, kaur: { a: 1 }, edge: '#BCD6FF', dust: .5, fog: ['#0E1424', 30, 220], light: { key: .3, fill: 1 } },
    { pos: [6, 2.2, 20], at: [0, 10, -40], fov: 52 }, lens(5, 14, { max: 24, bloom: .06 }));
  const br = Math.sin(t * 3.5) * 6;
  close(c, BUST('bhima', { t, fierce: .8, mouth: .15, look: [.2, .1] }), 540, lerp(830, 800, k) + br, lerp(3.0, 3.25, k), { ...DUEL_L, edge: { col: '#BCD6FF', w: 3, a: .5 }, rim: { col: '#E4EDFF', dx: -8, dy: -5, a: .8, blur: 2 } });
  // two choices
  for (const [txt, x, at, col] of [['BRAVE', 300, TL.BRAVE, GOLD], ['FOOLISH', 780, TL.FOOLISH, '#FF8A6A']]) {
    if (t < at - .1) continue; const pk = popK(t - at + .1), a = 1 - seg(t, TL.Q0, TL.Q0 + .3);
    c.save(); c.globalAlpha = a; c.translate(x, 470); c.scale(pk, pk); c.fillStyle = 'rgba(14,10,12,.85)'; c.strokeStyle = col; c.lineWidth = 5; c.beginPath(); c.roundRect(-200, -62, 400, 124, 62); c.fill(); c.stroke(); c.restore();
    text(c, txt, x, 474, '700 64px Cinzel', col, { alpha: a * Math.min(1, pk), spacing: 3 });
  }
  if (t > TL.FOOLISH) text(c, 'Tell us in the comments', 540, 580, 'italic 40px Marcellus', CREAM, { pop: t - TL.FOOLISH - .3, alpha: 1 - seg(t, TL.Q0, TL.Q0 + .3), glow: ['rgba(6,5,10,.95)', 16] });
  capBand(c);
} });

// ================= Q · and Ashwatthama? three days later came the night he became a killer; read it in our comic =================
PICS.ashCover = Object.assign(new Image(), { src: 'assets/rk/ashwatthama_cover.jpg' });
const PAGES = ['p08', 'p16', 'p20', 'p37', 'p01'].map(p => (PICS['cm_' + p] = Object.assign(new Image(), { src: `assets/narayan/${p}.jpg` })));
SHOTS.push({ a: TL.Q0, b: TL.NIGHT - .1, xf: .4, draw(c, u, t) {
  const k = easeIO(seg(t, TL.Q0, TL.NIGHT - .1)), n = R_(t, TL.Q0, TL.LATER + .4);
  W3(c, t, { sky: { fire: 0, calm: 1, night: n }, kaur: { a: 1, edge: '#9AB0D8', edgeK: .6 }, pand: { a: 0 }, fog: ['#070A14', 30, 200], light: { key: .1, fill: .5, hemi: .3 } },
    { pos: [0, 2, -60], at: [-6, 12, -120], fov: 56 }, lens(8, 12, { max: 22, bloom: .06 }));
  const x = 540, y = lerp(800, 760, k), kk = lerp(3.2, 3.6, k);
  close(c, ASH_O({ t, eyes: lerp(.8, 1, n), fierce: .6 + .4 * n, look: [0, .1] }), x, y, kk, NIGHT_L);
  gemGlow(c, x, y, kk, .7 + .5 * n);
  capBand(c);
} });
// the comic's pages, dealt like cards, then its cover
function page(c, img, x, y, w, rot, a, pk) {
  if (!img.naturalWidth || a <= 0) return; const h = w * 1.25;
  c.save(); c.globalAlpha = a; c.translate(x, y); c.rotate(rot); c.scale(pk, pk); c.shadowColor = 'rgba(0,0,0,.7)'; c.shadowBlur = 40; c.fillStyle = '#0B0810'; c.fillRect(-w / 2 - 8, -h / 2 - 8, w + 16, h + 16); c.shadowBlur = 0;
  c.drawImage(img, -w / 2, -h / 2, w, h); c.strokeStyle = 'rgba(241,231,210,.85)'; c.lineWidth = 3; c.strokeRect(-w / 2 - 8, -h / 2 - 8, w + 16, h + 16); c.restore();
}
SHOTS.push({ a: TL.NIGHT - .1, b: TL.CARD, draw(c, u, t) {
  sky(c, [[0, '#04060E'], [900, '#121C38'], [1920, '#05060B']]);
  glow(c, 540, 860, 760, '#2E4A7A', .45, 'screen');
  motes(c, { n: 50, seed: 61, box: [-50, 300, W + 50, 1900], r: 3, col: '#9FE4FF', a: .5, vx: 4, vy: -22, t });
  const deal = [[PAGES[0], 300, 760, -.16], [PAGES[1], 780, 720, .13], [PAGES[2], 330, 1060, .09], [PAGES[3], 760, 1080, -.1]];
  const cov = R_(t, TL.READ - .35, TL.READ + .25);
  deal.forEach(([img, x, y, r], i) => { const at = TL.NIGHT - .1 + i * .35; if (t < at) return; const pk = popK(t - at); page(c, img, lerp(x, 540, cov * .3), y, 460, r + Math.sin(t * .8 + i) * .01, 1 - .7 * cov, Math.min(pk, 1.1)); });
  if (t > TL.READ - .35) { const pk = popK(t - TL.READ + .35); glow(c, 540, 860, 520, '#7FD8FF', .25 * cov); page(c, PAGES[4], 540, 860, 640, Math.sin(t * 1.1) * .006, cov, pk); }
  capBand(c);
} });

// ================= the card: the Ashwatthama comic (no price) =================
function comicCard(c, u, t) {
  const pk = d => u - d, X = 540;
  sky(c, [[0, '#04060E'], [900, '#121C38'], [1920, '#05060B']]);
  glow(c, X, 900, 760, '#2E4A7A', .45, 'screen');
  motes(c, { n: 50, seed: 61, box: [-50, 300, W + 50, 1900], r: 3, col: '#9FE4FF', a: .5, vx: 4, vy: -22, t });
  text(c, 'NEW · A COMIC FROM', X, 452, '500 34px Poppins', '#CFE3DF', { pop: pk(.1), spacing: 4 });
  picture(c, PICS.logo, X - 175, 512, 74, 74, { pop: pk(.2), r: 37 });
  text(c, 'RISHI KATHA', X + 40, 515, '42px Marcellus', '#FBE0CF', { pop: pk(.2), spacing: 3 });
  glow(c, X, 890, 450, '#7FD8FF', .22 + .05 * Math.sin(t * 2));
  picture(c, PICS.ashCover, X, 890, 480, 600, { pop: pk(.35), r: 10, shadow: 34, rot: Math.sin(t * 1.1) * .006 });
  text(c, 'ASHWATTHAMA', X, 1245, '700 66px Cinzel', '#F4C46A', { pop: pk(.8), glow: ['rgba(244,196,106,.5)', 22], spacing: 3, maxW: 880 });
  text(c, 'The night he became a killer · CHIRANJEEVI 1', X, 1308, '500 33px Poppins', '#FFFFFF', { pop: pk(1.0), maxW: 900 });
  { const k = popK(pk(1.3)) * (1 + .03 * Math.max(0, Math.sin(t * 5))); if (k > .01) { c.save(); c.translate(X, 1392); c.scale(k, k); c.fillStyle = '#F15A24'; c.shadowColor = 'rgba(241,90,36,.6)'; c.shadowBlur = 30; c.beginPath(); c.roundRect(-230, -44, 460, 88, 44); c.fill(); c.restore(); text(c, 'rishikatha.com', X, 1395, '700 50px Poppins', '#FFFFFF', { pop: pk(1.3) }); } }
  text(c, 'Out now · link in bio · Follow @therishikatha', X, 1478, '500 32px Poppins', '#CFE3DF', { pop: pk(1.6), maxW: 880 });
}
SHOTS.push({ a: TL.CARD, b: TL.END + 1, draw(c, u, t) { comicCard(c, u, t); } });
