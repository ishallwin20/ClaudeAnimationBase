// lokas.js: "There are SEVEN worlds below your feet. And not one of them is HELL." (ad 79), in the 3D style.
// The seven lower worlds of the Bhagavata Purana (5.24), each 10,000 yojanas below the last (Vishnu Purana 2.5), more
// beautiful than Indra's heaven (Narada, Vishnu Purana 2.5): the earth as a column floating in the dark with a quarter
// cut away, the camera diving down it world by world (Atal's 96 kinds of magic, Vital's Shiva by the river of gold,
// Vishnu at Bali's door in Sutal, Maya's three cities in Talatal, the many-hooded serpents of Mahatal, the demons in
// their holes in Rasatal, Vasuki's jewel-lit Patal), then below them all Ananta Shesha with the universe on one hood
// like a mustard seed (Bhagavata 5.25.2); the screenshot board; the ask; the card.
// STORYBOARD.md has the plan and the sources; the timeline (from the voice) is lokas_tl.js, the sets lokas_sets.js.
LOOK.bloom = .12;   // matte (owner, 30 Oct): cine.js's own bloom low, no fx bloom
const COL = column3(), SHE = shesha3();
const CAPY = 1330;
const capBand = (c, a = .5) => band(c, 1200, 1490, a);
VO.caps.forEach((k, i) => say(i ? k.a : -1, k.b, k.text, { at: i ? k.at : k.at.map(() => -1), y: k.y ?? (k.id === 'ask' ? 1400 : CAPY) }));

// the lens: depth of field, a gentle grade (no bloom)
const lens = (focus, ap = 6, o = {}) => ({ dof: { focus, aperture: ap, max: 14, nearK: .6 }, grade: { contrast: o.contrast ?? 1.06, sat: o.sat ?? 1.04, temp: o.temp ?? 0, lift: 0, gamma: 1, gain: 1 }, ...o.fx });
const dist = (p) => CAM3.position.distanceTo(V3(...p));
const clip = (near, far) => { CAM3.near = near; CAM3.far = far; };
const at3 = (k, a, b) => a.map((v, i) => lerp(v, b[i], k));
// a camera on a sphere round `at`: d, elevation, azimuth (0 = from +z, the cut)
const orbit = (d, el, az, at, fov = 30, o = {}) => cam3({ pos: [at[0] + d * Math.cos(el) * Math.sin(az), at[1] + d * Math.sin(el), at[2] + d * Math.cos(el) * Math.cos(az)], at, fov, ...o });
const COLC = [0, -31, 0];   // the column's middle
function base(t, o = {}) { COL.rest(t); COL.light(o); clip(.05, 1200); }

// ================= A · the hook: the column in the dark, seven worlds glowing down it =================
SHOTS.push({ a: 0, b: TL.B0 + .3, draw(c, u, t) {
  base(t, { ext: 1, inside: 1 });
  orbit(lerp(116, 106, easeIO(u / 3)), .1, .3, [0, -31, 0], 34);
  render3(c, COL.S, CAM3, { exposure: 1.1, fx: lens(dist(COLC), 2) });
  // the seven numbers pop in down the side on SEVEN
  WORLDS.forEach((w, i) => { const t0 = TL.SEVEN + .05 + i * .09; if (t < t0) return; const [x, y] = toScreen3([LK.R * .72, LK.mid(i), LK.R * .72]);
    text(c, String(i + 1), Math.min(x + 50, 900), y + 2, '700 46px Cinzel', lighten(w.col, .4), { pop: t - t0, glow: ['rgba(4,4,10,.95)', 18] }); });
  capBand(c);
} });

// ================= B · and not one of them is HELL: a red flare, then their own colours, brighter =================
SHOTS.push({ a: TL.B0, b: TL.C0 + .3, xf: .3, draw(c, u, t) {
  const red = seg(t, TL.HELL - .25, TL.HELL) * (1 - seg(t, TL.HELL + .35, TL.HELL + .9)), joy = seg(t, TL.HELL + .5, TL.HELL + 1.1);
  base(t, { ext: 1, inside: 1 + .5 * joy, tint: ['#FF1A00', red * .9] });
  orbit(lerp(106, 98, easeIO(u / 3)), lerp(.1, .05, u / 3), lerp(.3, .1, easeIO(u / 3)), [0, -31, 0], 34, { roll: .004 * Math.sin(t * 40) * red });
  render3(c, COL.S, CAM3, { exposure: 1.1 + .2 * joy, fx: lens(dist(COLC), 2) });
  if (red > 0) { c.save(); c.fillStyle = `rgba(120,10,0,${.22 * red})`; c.fillRect(0, 0, W, H); c.restore(); }
  sideNames(c, t, TL.HELL + .6, { alpha: 1 - seg(t, TL.C0, TL.C0 + .3) });
  capBand(c);
} });

// ================= C · Narada Muni went down there… more beautiful than Indra's heaven =================
// from the earth's surface: a comet of light dives down past the camera along the cut, then flies back up to heaven
const NAR = (t) => {
  const d = seg(t, TL.NARADA - .3, TL.THERE + .3), up = seg(t, TL.BEAUTIFUL - .2, TL.HEAVEN + .1);
  if (t < TL.BEAUTIFUL - .2) return [lerp(-1.5, 0, easeIn(d)), lerp(40, -48, easeIO(d)), lerp(6, 6.5, d)];
  return [lerp(0, 1, up), lerp(-48, 46, easeIO(up)), lerp(6.5, -4, easeIO(up))];
};
const heaven = glow3(COL.S, [0, 48, -6], 60, '#FFD890', 0), comet = glow3(COL.S, [0, 0, 0], 4, '#FFE8B0', 0), cometCore = glow3(COL.S, [0, 0, 0], 1.2, '#FFFFFF', 0);
const cometTrail = [...Array(18)].map(() => glow3(COL.S, [0, 0, 0], 2.4, '#FFC870', 0));
function narada(t, on) {
  const p = NAR(t); comet.position.set(...p); cometCore.position.set(...p); comet.material.opacity = on; cometCore.material.opacity = on;
  cometTrail.forEach((g, k) => { g.position.set(...NAR(t - (k + 1) * .03)); g.material.opacity = on * .45 * (1 - k / 18); g.scale.setScalar(2.4 * (1 - k / 22)); });
  heaven.material.opacity = .55 * seg(t, TL.INDRA - .5, TL.HEAVEN);
}
SHOTS.push({ a: TL.C0, b: TL.D0 + .3, xf: .3, draw(c, u, t) {
  base(t, { ext: 1, inside: 1.2 });
  narada(t, seg(t, TL.NARADA - .4, TL.NARADA - .1) * (1 - seg(t, TL.HEAVEN + .1, TL.HEAVEN + .5)));
  // the camera rides down beside the comet (the worlds scroll up past it), then follows it back up to heaven's glow
  const p = NAR(t), y = clamp(p[1], -44, 36), k = easeIO(u / (TL.D0 + .3 - TL.C0));
  cam3({ pos: [lerp(16, 22, k), y + 4, lerp(44, 50, k)], at: [0, y - 1, -2], fov: 40 });
  render3(c, COL.S, CAM3, { exposure: 1.1, fx: lens(dist(p), 2.5) });
  title(c, 'NARADA MUNI', 540, t, TL.NARADA, { size: 76, col: '#FFE2A0', out: TL.THERE + .4 });
  title(c, 'INDRA’S HEAVEN', 540, t, TL.INDRA, { size: 66, col: '#FFE2A0', out: TL.D0 });
  tag(c, 'VISHNU PURANA 2.5', 470, 1462, t, TL.BEAUTIFUL);
  capBand(c);
} });

// ================= D · seven worlds, each 10,000 yojanas deep: the column with names and depths =================
SHOTS.push({ a: TL.D0, b: TL.W0[0] + .3, xf: .35, draw(c, u, t) {
  base(t, { ext: 1, inside: 1.2 });
  const k = easeIO(u / (TL.W0[0] + .3 - TL.D0));
  orbit(lerp(226, 216, k), .05, lerp(-.15, .12, k), [0, -38.4, 0], 30);
  render3(c, COL.S, CAM3, { exposure: 1.1, fx: lens(dist(COLC), 2) });
  sideNames(c, t, TL.SEVEN2, { depth: true, step: .16 });
  { const [x, y] = toScreen3([LK.R * .72, LK.mid(6), LK.R * .72]); text(c, 'YOJANAS', Math.min(850, x + 120), y + 48, '700 30px Cinzel', '#F4C46A', { alpha: seg(t, TL.YOJANAS, TL.YOJANAS + .3), spacing: 4, glow: ['rgba(4,4,10,.95)', 14] }); }
  tag(c, 'VISHNU PURANA 2.5 · BHAGAVATA PURANA 5.24', 470, 1462, t, TL.YOJANAS);
  capBand(c);
} });

// ================= the seven worlds: each shot drops down to its cavern, then flies in to the hero =================
// hero(t): { pos, at, fov, focus } for the shot's main framing; state(t): the world's set and light; draw2(c, t): 2D
function world(i, o) {
  const a = TL.W0[i], b = i < 6 ? TL.W0[i + 1] + .3 : TL.L0 + .3;
  SHOTS.push({ a, b, xf: .3, draw(c, u, t) {
    const m = LK.mid(i), e = easeIO(clamp((u - .25) / 1.5));
    const L = o.light ? o.light(t) : {};
    const ins = WORLDS.map((_, j) => j === i ? 1 : 1 - e);
    base(t, { ext: lerp(1, .25, e), inside: ins, ...L, ...(L.inside != null ? { inside: ins.map(v => v * L.inside) } : {}) });
    o.state(t, COL.W[i]);
    const h = o.hero(t, u), arrive = easeOut(clamp(u / 1.3));
    const pos = at3(e, at3(arrive, [7, m + 8, 30], [3, m + .6, 17]), h.pos), at = at3(e, [0, m - .2, -2], h.at);
    cam3({ pos, at, fov: lerp(34, h.fov, e) });
    render3(c, COL.S, CAM3, { exposure: o.exposure ?? 1.15, fx: lens(lerp(dist([0, m, -2]), h.focus ?? dist(h.at), e), h.ap ?? 5) });
    worldTitle(c, i, t, TL.NAME[i], TL.NAME[i] + 2.3);
    o.draw2?.(c, t, u);
    capBand(c);
  } });
}

// 1 · ATAL: Bala, son of Maya, made 96 kinds of magic: the glyphs count up to 96, then the mirages
world(0, {
  state: (t, w) => w.set(t, { glyphs: 96 * easeIO(seg(t, TL.BALA + .2, TL.N96 + .05)), burst: Math.exp(-Math.max(0, t - TL.MAGIC) * 2.5) * (t > TL.MAGIC ? 1 : 0), mirage: seg(t, TL.MAGIC, TL.MAGIC + .8) }),
  hero: (t, u) => { const f = LK.floor(0), k = easeIO(seg(t, TL.BALA, TL.W0[1])); return { pos: [lerp(1.0, -.5, k), f + lerp(1.2, 1.5, k), lerp(.4, -.5, k)], at: [0, f + 2.1, -4.8], fov: 58, ap: 6 }; },
  draw2: (c, t) => {
    const n = Math.round(96 * easeIO(seg(t, TL.BALA + .2, TL.N96 + .05))), a = seg(t, TL.BALA + .2, TL.BALA + .5) * (1 - seg(t, TL.W0[1] - .2, TL.W0[1] + .1));
    if (a > 0 && t > TL.NAME[0] + 2.2) { band(c, 430, 700, .45 * a); text(c, String(n), 540, 560, '700 150px Cinzel', '#E8D4FF', { alpha: a, glow: ['rgba(140,80,255,.6)', 36], pop: t - TL.N96 }); text(c, 'KINDS OF MAGIC', 540, 668, '700 40px Cinzel', '#FFF3DC', { alpha: a * seg(t, TL.MAGIC - .1, TL.MAGIC + .2), spacing: 4, glow: ['rgba(6,5,10,.95)', 14] }); }
    tag(c, 'BHAGAVATA PURANA 5.24.16', 470, 1462, t, TL.MAGIC);
  },
});
// 2 · VITAL: Shiva as the lord of gold, by the river of gold
world(1, {
  state: (t, w) => w.set(t, { gold: seg(t, TL.GOLD - .2, TL.GOLD + .4) }),
  hero: (t, u) => { const f = LK.floor(1), k = easeIO(seg(t, TL.SHIVA1 - .3, TL.W0[2])); return { pos: [lerp(1.4, .7, k), f + lerp(2.6, 1.5, k), lerp(.3, -1.7, k)], at: [-.3, f + lerp(.6, 1.0, k), -4.6], fov: 56, ap: 6 }; },
  draw2: (c, t) => { title(c, 'HATAKESHVARA', 1090, t, TL.GOLD, { size: 64, sub: 'the lord of gold', col: '#FFD27A', out: TL.W0[2] - .1 }); tag(c, 'BHAGAVATA PURANA 5.24.17', 470, 1462, t, TL.GOLD); },
});
// 3 · SUTAL: Bali's world; at his door Vishnu stands guard, mace in hand
world(2, {
  state: (t, w) => w.set(t, { vishnu: easeOut(seg(t, TL.VISHNU - .5, TL.VISHNU + .5)), door: 1 + 1.6 * seg(t, TL.DOOR - .3, TL.VISHNU) }),
  light: (t) => ({ inside: 1 - .7 * seg(t, TL.DOOR - .3, TL.VISHNU) }),
  hero: (t, u) => { const f = LK.floor(2), kd = easeIO(seg(t, TL.DOOR - .4, TL.VISHNU + .6)), km = easeIO(seg(t, TL.MACE - .5, TL.HAND + .5));
    const p0 = [0, f + 1.4, .6], p1 = [-.5, f + .9, -.6], p2 = [.2, f + 2.1, -2.9];
    return { pos: at3(km, at3(kd, p0, p1), p2), at: at3(km, at3(kd, [0, f + 1.6, -6.4], [0, f + 1.85, -5.3]), [.5, f + 2.3, -5.0]), fov: lerp(60, 52, km), ap: 6 }; },
  draw2: (c, t) => { title(c, 'KING BALI', 1080, t, TL.BALI, { size: 76, col: '#CFE0FF', out: TL.DOOR + .2 }); title(c, 'VISHNU', 1060, t, TL.VISHNU, { size: 96, col: '#BFD8FF', glowCol: 'rgba(10,20,60,.9)', sub: 'the gatekeeper', out: TL.W0[3] - .1 }); tag(c, 'BHAGAVATA PURANA 5.24.27', 470, 1462, t, TL.GUARD); },
});
// 4 · TALATAL: Maya the architect: the towers rise; Shiva's arrow burns the three cities; pleased, he gives them back
world(3, {
  state: (t, w) => w.set(t, { build: seg(t, TL.MAYA - .3, TL.ARCH + .5), shot: seg(t, TL.BURNED - .7, TL.BURNED), burn: seg(t, TL.BURNED, TL.BURNED + .5) * (1 - seg(t, TL.PLEASED, TL.GAVE + .3)), calm: seg(t, TL.PLEASED, TL.GAVE + .4) }),
  light: (t) => ({ inside: 1 + .6 * seg(t, TL.BURNED, TL.BURNED + .5) * (1 - seg(t, TL.PLEASED, TL.GAVE)) }),
  hero: (t, u) => { const f = LK.floor(3), k = easeIO(seg(t, TL.MAYA, TL.W0[4])); return { pos: [lerp(-1.0, 1.0, k), f + lerp(1.0, 1.6, k), lerp(.6, -.3, k)], at: [0, f + 2.5, -4.9], fov: 58, ap: 5 }; },
  draw2: (c, t) => { title(c, 'MAYA', 1060, t, TL.MAYA, { size: 100, col: '#FFC890', sub: 'the demon architect', out: TL.SHIVA2 - .1 }); title(c, 'TRIPURARI', 1080, t, TL.BURNED, { size: 76, col: '#FFB070', sub: 'Shiva, who burned the three cities', out: TL.W0[4] - .1 });
    const fl = Math.exp(-Math.max(0, t - TL.BURNED) * 5) * (t > TL.BURNED ? 1 : 0); if (fl > .01) { c.save(); c.fillStyle = `rgba(255,190,120,${.5 * fl})`; c.fillRect(0, 0, W, H); c.restore(); }
    tag(c, 'BHAGAVATA PURANA 5.24.28', 470, 1462, t, TL.PLEASED); },
});
// 5 · MAHATAL: serpents with many hoods, always afraid of Garuda: his shadow sweeps over them
world(4, {
  state: (t, w) => w.set(t, { garuda: t < TL.AFRAID ? -1 : seg(t, TL.AFRAID, TL.GARUDA + 1.0) }),
  hero: (t, u) => { const f = LK.floor(4), k = easeIO(seg(t, TL.MANY - .5, TL.W0[5])); return { pos: [lerp(.5, -.3, k), f + lerp(2.0, 2.3, k), lerp(.8, -.3, k)], at: [0, f + 2.1, -4.6], fov: 60, ap: 6 }; },
  draw2: (c, t) => {
    // Garuda's shadow passing over: great wings, blurred, across the top of the frame
    const g = seg(t, TL.AFRAID + .2, TL.GARUDA + .9);
    if (g > 0 && g < 1) { c.save(); c.globalAlpha = .62 * Math.sin(Math.PI * g); c.translate(lerp(-500, 1580, g), lerp(800, 900, g)); c.rotate(.12); c.scale(2.2, 2.2 * (1 - .25 * Math.abs(Math.sin(t * 7))));
      c.shadowColor = 'rgba(2,6,4,.9)'; c.shadowBlur = 40; c.fillStyle = '#020604'; c.beginPath(); c.moveTo(0, -30); c.bezierCurveTo(-60, -20, -150, -40, -260, -110); c.bezierCurveTo(-190, 0, -90, 40, -30, 45); c.lineTo(-18, 120); c.lineTo(0, 100); c.lineTo(18, 120); c.lineTo(30, 45);
      c.bezierCurveTo(90, 40, 190, 0, 260, -110); c.bezierCurveTo(150, -40, 60, -20, 0, -30); c.fill(); c.beginPath(); c.arc(0, -40, 20, 0, TAU); c.fill(); c.restore(); }
    title(c, 'GARUDA', 1090, t, TL.GARUDA, { size: 96, col: '#FFE2A0', out: TL.W0[5] - .1 }); tag(c, 'BHAGAVATA PURANA 5.24.29', 470, 1462, t, TL.MANY); },
});
// 6 · RASATAL: demons, enemies of the gods, hiding in holes; Indra's flash and they duck
world(5, {
  state: (t, w) => w.set(t, { duck: seg(t, TL.INDRA2 - .1, TL.INDRA2 + .3), flash: Math.exp(-Math.max(0, t - TL.INDRA2 + .1) * 3) * (t > TL.INDRA2 - .1 ? 1 : 0) }),
  hero: (t, u) => { const f = LK.floor(5), kh = easeIO(seg(t, TL.HIDING - .4, TL.HOLES + .6)); return { pos: at3(kh, [0, f + 1.8, .4], [-.6, f + 3.2, -.9]), at: at3(kh, [0, f + 1.0, -5], [-1.2, f + .1, -3.6]), fov: 58, ap: 6 }; },
  draw2: (c, t) => { const fl = Math.exp(-Math.max(0, t - TL.INDRA2 + .1) * 4) * (t > TL.INDRA2 - .1 ? 1 : 0); if (fl > .01) { c.save(); c.fillStyle = `rgba(220,235,255,${.6 * fl})`; c.fillRect(0, 0, W, H); c.restore(); }
    title(c, 'INDRA', 1090, t, TL.INDRA2, { size: 100, col: '#DCEBFF', glowCol: 'rgba(10,20,60,.9)', out: TL.W0[6] - .1 }); tag(c, 'BHAGAVATA PURANA 5.24.30', 470, 1462, t, TL.HOLES); },
});
// 7 · PATAL: Vasuki rules the Nagas; no sun: the dark, then the jewels on their hoods light everything
world(6, {
  state: (t, w) => w.set(t, { jewels: 1 - seg(t, TL.NO - .1, TL.SUN + .2) + seg(t, TL.JEWELS - .1, TL.EVERY + .3) * 1.2 }),
  light: (t) => { const dark = seg(t, TL.NO - .1, TL.SUN + .2) * (1 - seg(t, TL.JEWELS - .1, TL.EVERY + .2)); return { inside: 1 - .85 * dark, ext: .25 * (1 - dark) }; },
  hero: (t, u) => { const f = LK.floor(6), k = easeIO(seg(t, TL.VASUKI - .6, TL.L0)); return { pos: [lerp(.8, 0, k), f + lerp(2.0, 2.3, k), lerp(.8, -.2, k)], at: [0, f + lerp(2.2, 2.5, k), -5.2], fov: 60, ap: 6 }; },
  draw2: (c, t) => { title(c, 'VASUKI', 1060, t, TL.VASUKI, { size: 100, col: '#A8F4EC', sub: 'king of the Nagas', out: TL.NO - .1 }); tag(c, 'BHAGAVATA PURANA 5.24.31', 470, 1462, t, TL.JEWELS); },
});

// ================= L · but below all seven: the camera drops under the column into the dark =================
const SH_CUT = TL.ANANTA - .25;
SHOTS.push({ a: TL.L0, b: SH_CUT + .3, xf: .3, draw(c, u, t) {
  base(t, { ext: .6, inside: 1 });
  const k = easeIO(u / (SH_CUT + .3 - TL.L0));
  cam3({ pos: [lerp(8, 12, k), lerp(LK.mid(6) + 2, -38, k), lerp(30, 46, k)], at: [0, lerp(LK.mid(6), -125, k), lerp(0, -30, k)], fov: 44 });
  COL.deepGlow.material.opacity = .25 + .55 * k; COL.deepGlow.material.color.set('#9AB8FF');
  render3(c, COL.S, CAM3, { exposure: 1.1, fx: lens(dist([0, -40, 0]), 2) });
  COL.deepGlow.material.opacity = .25; COL.deepGlow.material.color.set('#5A7ACC');
  capBand(c);
} });
// ================= L2 · Ananta Shesha holds the whole universe on one hood, like a mustard seed =================
// the egg's picture: the column from far, painted live
const camPic = new THREE.PerspectiveCamera(30, 512 / 640, 1, 1200);
SHOTS.push({ a: SH_CUT, b: TL.M0 + .3, xf: .25, draw(c, u, t) {
  COL.rest(t); COL.light({ ext: 1, inside: 1.3 });
  camPic.position.set(0, -30, 150); camPic.lookAt(0, -31, 0); SHE.paint(COL.S, camPic);
  SHE.place(t, { egg: 1 });
  const E = SHE.EGG.position, kU = easeIO(seg(t, TL.WHOLE - .3, TL.ONE)), kS = easeIO(seg(t, TL.MUSTARD - .5, TL.M0 + .3));
  clip(.5, 2000);
  // reveal: from low in the dark, rising to face the canopy; push to the egg on its hood; then pull far back
  const rev = easeOut(seg(t, SH_CUT, TL.WHOLE - .3));
  const pR = at3(rev, [E.x + 22, E.y - 30, E.z + 135], [E.x + 12, E.y - 10, E.z + 92]), aR = at3(rev, [0, E.y - 18, -4], [0, E.y - 7, -4]);
  const pU = [E.x + 1.4, E.y + .5, E.z + 8.5], pS = [E.x + 26, E.y + 22, E.z + 230], aS = [0, E.y - 10, -6];
  const pos = at3(kS, at3(kU, pR, pU), pS), at = at3(kS, at3(kU, aR, [E.x, E.y, E.z]), aS);
  cam3({ pos, at, fov: lerp(lerp(42, 34, kU), 42, kS) });
  SHE.pic.lookAt(CAM3.position);
  render3(c, SHE.S, CAM3, { exposure: 1.05, fx: lens(dist([E.x, E.y, E.z]), lerp(2, 7, kU) * (1 - kS * .7)) });
  title(c, 'ANANTA SHESHA', 540, t, TL.ANANTA, { size: 80, col: '#FFF0D0', out: TL.WHOLE + .6 });
  // the arrow to the seed on the pull-back
  if (t > TL.SEED - .2) { const [x, y] = toScreen3([E.x, E.y, E.z]), a = seg(t, TL.SEED - .2, TL.SEED + .2);
    c.save(); c.globalAlpha *= a; c.strokeStyle = 'rgba(255,226,160,.9)'; c.lineWidth = 3; c.beginPath(); c.arc(x, y, 34, 0, TAU); c.stroke(); c.restore();
    text(c, 'THE UNIVERSE', x, y - 64, '700 38px Cinzel', '#FFE2A0', { alpha: a, spacing: 3, glow: ['rgba(4,4,12,.95)', 16] }); }
  tag(c, 'BHAGAVATA PURANA 5.25.2', 470, 1462, t, TL.ONE);
  capBand(c);
} });

// ================= M · save this: the board over the column; the ask =================
SHOTS.push({ a: TL.M0, b: TL.CARD, xf: .4, draw(c, u, t) {
  base(t, { ext: 1, inside: 1.1 });
  orbit(140 - u * 1.2, .08, .25 - u * .01, [0, -31, 0], 30);
  render3(c, COL.S, CAM3, { exposure: 1.05, fx: lens(dist(COLC), 2) });
  c.fillStyle = `rgba(6,5,10,${.5 * seg(t, TL.M0, TL.M0 + .5)})`; c.fillRect(0, 0, W, H);
  board(c, t, TL.M0 + .1, { y0: 492 });
  capBand(c, .55);
} });

// ================= the card =================
SHOTS.push({ a: TL.CARD, b: TL.END + 1, draw(c, u, t) {
  rkCardCine(c, u, t, { title: 'MEET OUR GODS', line: 'Picture books of our gods, for kids', price: 'The Navadurga Set is out now', note: 'Link in bio' });
} });
