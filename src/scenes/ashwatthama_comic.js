// ashwatthama_comic.js: the panel art of CHIRANJEEVI Issue 1 (see comics/ashwatthama/SCRIPT.md). Each ART entry draws
// one panel in panel units (P.w × P.h); the layout and the words are in comics/ashwatthama/comic.js.
// at(c, x, y, k, fy): put the unit point (0, fy) at panel (x, y), scaled k (a head is centred at fy = -815).
const at = (c, x, y, k, fy = 0) => { c.translate(x, y); c.scale(k, k); c.translate(0, -fy); };
const MOONLIT = { tint: ['#16224A', .28], grade: [[0, 'rgba(0,0,0,0)'], [2700, 'rgba(4,7,18,.5)']], edge: { col: '#D4E0FA', w: 2.2, a: .5 }, rim: { col: '#EAF1FF', dx: 6, dy: -4, a: .85, blur: 1 } };
const NIGHTSIL = { tint: ['#080A14', .82], edge: { col: '#AFC2EA', w: 1.6, a: .5 }, rim: { col: '#DCE6FF', dx: 3, dy: -3, a: .9 } };
const TREESIL = { tint: ['#06070D', .86], edge: { col: '#AFC2EA', w: 1.4, a: .16 }, rim: { col: '#C9D7F5', dx: 3, dy: -3, a: .55 } };
// crows perched along a branch (points B), on its top side, n of them, facing either way
function crowsOn(c, B, w, n, seed, k = .55) {
  const pts = through(B, 14), L = pts.length;
  for (let i = 0; i < n; i++) {
    const j = Math.floor(lerp(3, L - 4, (i + .5) / n + (hash(seed + i) - .5) * .06)), [x, y] = pts[j], [x2, y2] = pts[j + 1], a = Math.atan2(y2 - y, x2 - x);
    const d = hash(seed * 3 + i) < .5 ? -1 : 1;
    c.save(); c.translate(x, y); c.rotate(a); crow(c, 0, -w * .32, k * (.85 + hash(i + seed) * .3), { dir: d, tuck: hash(seed + i * 7) < .3 }); c.restore();
  }
}

// ---------- p11 · under the banyan ----------
ART.banyanWide = (c, P) => {
  nightSky(c, P.w, P.h, { seed: 11, nStars: 120 });
  moon(c, 800, 120, 40);
  ridge(c, 480, 50, 4, '#0F1628', { freq: .006, x0: -50, x1: P.w + 50, bottom: P.h + 50 });
  haze(c, 470, 140, '#3A4A70', .3);
  c.save(); at(c, 520, 524, .4); banyanRoots(c, { col: '#05060B', seed: 7 }); c.restore();
  figure(c, (f) => { f.save(); at(f, 520, 524, .4); banyan(f, { col: '#06060B', seed: 7 }); f.restore(); }, lit(TREESIL));
  c.fillStyle = '#040408'; c.fillRect(0, 520, P.w, P.h);
  haze(c, 525, 40, '#5A6C98', .18);
  figure(c, (f) => { f.save(); at(f, 330, 526, .19); sleeper(f, { who: 'kripa' }); f.restore(); f.save(); at(f, 760, 528, .19); f.scale(-1, 1); sleeper(f, { who: 'krita' }); f.restore(); f.save(); at(f, 610, 526, .24); ashSit(f); f.restore(); }, lit(NIGHTSIL));
  const gx = 610 - 20 * .24, gy = 526 - 616 * .24; glow(c, gx, gy, 18, '#8FE0FF', .9); ellipse(c, gx, gy, 2, 2, '#E8FBFF');
  if (!P.ink) motes(c, { n: 40, seed: 3, box: [0, 0, P.w, P.h], r: 1.6, col: '#C9D7F5', a: .35, vx: 0, vy: 0, t: P.t });
};
ART.sleepers = (c, P) => {
  const SLEEP = { ...MOONLIT, edge: { col: '#D4E0FA', w: 1.6, a: .22 } };
  sky(c, [[0, '#070A16'], [P.h, '#141C34']]);
  glow(c, P.w - 60, -80, 520, '#7F97CC', .3);
  for (let i = 0; i < 14; i++) { const x = 40 + i * 76 + Math.sin(i * 7) * 20; strokePath(c, `M ${x} -10 C ${x + 8} 80 ${x - 6} 160 ${x + 4} ${170 + Math.sin(i * 3) * 50}`, '#0A0C16', 3 + (i % 3) * 2); }
  c.fillStyle = '#07080F'; c.fillRect(0, 270, P.w, P.h);
  fillPath(c, `M 0 270 C 200 262 400 276 600 268 C 800 262 950 274 ${P.w} 266 L ${P.w} ${P.h} L 0 ${P.h} Z`, '#0B0D17');
  figure(c, (f) => {
    f.save(); at(f, 290, 300, .52); sleeper(f, { who: 'kripa', col: '#232634' }); f.restore();
    f.save(); at(f, 770, 304, .5); f.scale(-1, 1); sleeper(f, { who: 'krita', col: '#232634' }); f.restore();
  }, lit(SLEEP));
  // a bow and a quiver dropped beside them
  strokePath(c, 'M 470 296 C 520 250 600 240 660 288', '#2A2C38', 5); strokePath(c, 'M 470 296 L 660 288', rgba('#9AA6C8', .5), 1.2);
};
ART.eyesStrip = (c, P) => {
  sky(c, [[0, '#04050A'], [P.h, '#0C1224']]);
  glow(c, 880, 40, 420, '#5E76AE', .25);
  figure(c, (f) => { at(f, 516, 250, 6.4, -820); ashBust(f, { eyes: 1, look: [.7, -.15], fierce: .45, pain: .15 }); }, lit(MOONLIT, { k: 1.6, inkW: 1.6 }));
  c.save(); at(c, 516, 250, 6.4, -820); ashGemGlow(c, .7); c.restore();
};

// ---------- p12 · the crows ----------
const CROW_BRANCHES = [
  [[-40, 300], [160, 250], [380, 300], [700, 230]],
  [[680, 620], [480, 560], [260, 600], [-40, 520]],
  [[-40, 880], [200, 840], [420, 900], [700, 860]],
  [[700, 1140], [460, 1100], [240, 1160], [-40, 1120]],
];
ART.crowsTree = (c, P) => {
  // looking up into the banyan: a gap of moonlit sky, the branches across it, the crows black against it
  sky(c, [[0, '#26355C'], [P.h * .45, '#1A2645'], [P.h, '#05070E']]);
  glow(c, 400, 260, 700, '#A9BCE6', .55); glow(c, 400, 200, 180, '#EEF2FF', .45);
  for (let i = 0; i < 12; i++) leafClump(c, (i % 2 ? .85 : .1) * P.w + (hash(i) - .5) * 200, hash(i + 3) * P.h, 170, 36, i + 300, '#0B1022');
  for (let i = 0; i < 6; i++) { const x = 40 + hash(i * 9) * (P.w - 80), y0 = 300 + hash(i) * 500; strokePath(c, `M ${x} ${y0} C ${x + 24} ${y0 + 200} ${x - 20} ${y0 + 420} ${x + 10} ${y0 + 520 + hash(i + 2) * 300}`, rgba('#080B16', .85), 2 + hash(i) * 4); }
  const BR = [
    [[[-40, 330], [160, 300], [380, 350], [700, 290]], 34, 4],
    [[[700, 560], [480, 520], [260, 580], [-40, 540]], 40, 4],
    [[[-40, 820], [200, 790], [420, 840], [700, 800]], 44, 3],
    [[[700, 1080], [460, 1050], [240, 1110], [-40, 1080]], 50, 2],
  ];
  figure(c, (f) => {
    for (const [B, w] of BR) branch(f, B, w, '#090910');
    for (const [x, y, r] of [[-20, 300, 120], [700, 290, 110], [690, 560, 90], [-30, 840, 100], [700, 1080, 110], [-10, 560, 80]]) leafClump(f, x, y, r, 30, x + y, '#090910');
  }, lit(TREESIL, { k: .8 }));
  figure(c, (f) => BR.forEach(([B, w, n], i) => crowsOn(f, B, w, n, 17 + i * 5, .62)), lit({ ...NIGHTSIL, tint: ['#070810', .7], edge: { col: '#C9D7F5', w: 1.6, a: .6 } }, { k: .8 }));
};
ART.lookUp = (c, P) => {
  sky(c, [[0, '#0B1226'], [P.h, '#04050A']]);
  glow(c, 260, -40, 420, '#8FA6D8', .35);
  for (let i = 0; i < 6; i++) branch(c, [[-20, 40 + i * 24], [120 + i * 30, 10 + i * 30], [P.w + 20, 70 + i * 10]], 14, '#05060B');
  figure(c, (f) => { at(f, 188, 340, 2.5, -815); ashBust(f, { eyes: 1, look: [.25, -1], fierce: .25, pain: .1 }); }, lit({ ...MOONLIT, rim: { ...MOONLIT.rim, dx: 2, dy: -6 } }, { k: 1.2 }));
  c.save(); at(c, 188, 340, 2.5, -815); ashGemGlow(c, .6); c.restore();
};
ART.owlEyes = (c, P) => {
  sky(c, [[0, '#03040A'], [P.h, '#070A16']]);
  for (let i = 0; i < 5; i++) branch(c, [[-20, 120 + i * 120], [P.w * .5, 90 + i * 130 + (i % 2) * 40], [P.w + 20, 140 + i * 110]], 22 - i * 2, '#0B0D18');
  owlEyes(c, P.w / 2, 300, 1.15);
};

// ---------- p13 · the owl ----------
ART.owlDive = (c, P) => {
  nightSky(c, P.w, P.h, { seed: 31, nStars: 60, stops: [[0, '#070B18'], [P.h, '#1A2442']] });
  moon(c, 520, 330, 150, 1.1);
  figure(c, (f) => { for (const [B, w] of [[[[-40, 820], [300, 760], [700, 820], [1080, 780]], 50], [[[-40, 120], [250, 170], [520, 120]], 30], [[[1080, 200], [860, 260], [640, 230]], 28]]) branch(f, B, w, '#08080E'); }, lit(NIGHTSIL));
  // crows bursting off the branches
  figure(c, (f) => {
    for (const [x, y, k, d, fl, r] of [[120, 260, .7, -1, .9, -.3], [900, 330, .8, 1, .2, .2], [180, 640, .6, -1, .4, .1], [950, 640, .65, 1, .8, -.2], [70, 470, .5, -1, .1, .3], [1000, 470, .55, 1, .5, 0], [300, 760, .55, -1, .7, -.1]]) crow(f, x, y, k, { fly: 1, flap: fl, dir: d, rot: r });
  }, lit(NIGHTSIL, { k: .7 }));
  figure(c, (f) => { at(f, 516, 470, .82); owlDive(f, { raise: .25, grip: .1, look: [0, .6] }); }, lit({ tint: ['#141C3A', .38], grade: [[600, 'rgba(0,0,0,0)'], [1800, 'rgba(4,6,14,.55)']], edge: { col: '#E4ECFF', w: 2.4, a: .7 }, rim: { col: '#F2F6FF', dx: 0, dy: -7, a: 1, blur: 1 } }));
  for (let i = 0; i < 12; i++) feather(c, 80 + hash(i) * 880, 120 + hash(i + 9) * 700, .22 + hash(i + 3) * .2, hash(i + 5) * 6, '#0C0C12');
};
ART.talons = (c, P) => {
  sky(c, [[0, '#0A1022'], [P.h, '#04050A']]);
  glow(c, 400, 0, 360, '#8FA6D8', .3);
  figure(c, (f) => { branch(f, [[-20, 340], [200, 326], [530, 346]], 40, '#0C0C12'); crow(f, 240, 322, 1.1, { dir: 1 }); }, lit(NIGHTSIL));
  figure(c, (f) => { at(f, 250, 110, .6); f.rotate(.12); owlTalon(f, { grip: .5 }); }, lit(MOONLIT, { k: 1.1 }));
};
ART.feathers = (c, P) => {
  sky(c, [[0, '#0B1226'], [P.h, '#04050A']]);
  rays(c, 460, -40, { n: 8, dir: 1.95, spread: .5, len: 560, w: 120, col: '#AFC2EA', a: .35, t: P.t, seed: 4 });
  c.fillStyle = '#05060B'; c.fillRect(0, 350, P.w, P.h);
  for (let i = 0; i < 9; i++) { const x = 40 + hash(i * 3) * 430; ellipse(c, x, 356 + hash(i) * 10, 26 + hash(i + 1) * 14, 9, '#0D0D14', hash(i) - .5); }
  for (let i = 0; i < 16; i++) feather(c, 30 + hash(i * 2.3) * 450, 30 + hash(i * 4.1) * 300, .26 + hash(i + 7) * .2, hash(i + 2) * 6, i % 3 ? '#0D0D14' : '#20263A');
  if (!P.ink) motes(c, { n: 30, seed: 8, box: [0, 0, P.w, 350], r: 2, col: '#C9D7F5', a: .4, vx: 0, vy: 0, t: P.t });
};

// ---------- p14 · the lesson ----------
ART.eyeReflect = (c, P) => {
  c.fillStyle = '#05060B'; c.fillRect(0, 0, P.w, P.h);
  const k = 16, ex = 19, ey = -820;
  figure(c, (f) => { at(f, P.w / 2 - 20, 175, k, 0); f.translate(-ex, -ey); ashHead(f, { eyes: 1, look: [0, 0], fierce: .7 }); }, lit(MOONLIT, { k: 2, inkW: 2 }));
  // the owl in his eye: a small dark shape on the iris with the moon's glint
  c.save(); at(c, P.w / 2 - 20, 175, k, 0); c.translate(-ex, -ey);
  inside(c, (() => { const p = new Path2D(); p.ellipse(ex, ey + .5, 5.4, 6, 0, 0, TAU); return p; })(), () => {
    glow(c, ex - 1.5, ey - 1.5, 4, '#CFE0FF', .55);
    c.save(); c.translate(ex - .2, ey + .6); c.scale(.0042, .0042); owlDive(c, { pal: { base: '#000', dk: '#000', lt: '#000', disc: '#000', discDk: '#000', streak: '#000', beak: '#000', claw: '#000', eye: '#E9C628', eyeRim: '#000' } }); c.restore();
  });
  c.restore();
};
ART.faceFierce = (c, P) => {
  sky(c, [[0, '#050710'], [P.h, '#111A32']]);
  glow(c, 120, 60, 420, '#6F86C0', .3);
  c.save(); at(c, 860, 660, .34); banyanRoots(c, { col: '#090A12', seed: 12 }); c.restore();
  figure(c, (f) => { f.save(); at(f, 860, 660, .34); banyan(f, { col: '#090A12', seed: 12 }); f.restore(); }, lit(TREESIL, { k: .6 }));
  figure(c, (f) => { at(f, 320, 300, 3.3, -815); ashBust(f, { eyes: .82, look: [.9, .05], fierce: 1, pain: 0, smile: .15 }); }, lit(MOONLIT, { k: 1.3 }));
  c.save(); at(c, 320, 300, 3.3, -815); ashGemGlow(c, 1.3); c.restore();
};
ART.owlPerch = (c, P) => {
  nightSky(c, P.w, P.h, { seed: 41, nStars: 80 });
  moon(c, 740, 140, 92, 1.1);
  figure(c, (f) => {
    branch(f, [[-30, 300], [300, 272], [700, 288], [1070, 256]], 44, '#07070C');
    leafClump(f, 1000, 240, 110, 26, 5, '#07070C'); leafClump(f, 20, 280, 90, 20, 6, '#07070C');
  }, lit(TREESIL));
  figure(c, (f) => { at(f, 740, 292, .44); owlPerch(f, { look: [-.7, .4] }); }, lit({ tint: ['#06080F', .8], edge: { col: '#E4ECFF', w: 2, a: .7 }, rim: { col: '#F2F6FF', dx: 0, dy: -5, a: 1 } }));
  for (const sx of [-1, 1]) { const ex = 740 + sx * 48 * .92 * .44, ey = 292 + (-260 - 116 * .92) * .44; glow(c, ex, ey, 26, '#E9C628', .6); ellipse(c, ex, ey, 7, 5.5, '#F2D040'); ellipse(c, ex, ey + 1, 3.2, 3.2, '#070403'); }
  for (let i = 0; i < 10; i++) feather(c, 60 + hash(i * 5) * 560, 110 + hash(i * 7) * 200, .16 + hash(i) * .12, hash(i + 4) * 6, '#0C0C12');
};
