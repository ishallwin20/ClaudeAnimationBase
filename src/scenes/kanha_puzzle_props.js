// kanha_puzzle_props.js: the set and props of "How many KRISHNAS?" (kanha_puzzle.js): the Yamuna sand bank in Vrindavan
// on a late afternoon. Screen space (1080 × 1920, no camera). Every moving thing takes the loop phase t (0..8 s) and
// moves on a period of 8, 4 or 2 s, so the loop has no seam.
//   KP                      the palette
//   kpSky(t)                honey sky, the low sun's glow, drifting clouds (cloudPuff for one in front of Brahma)
//   kpHills(t)              far hills, Govardhan, the far tree line
//   kpMeadow(t)             the meadow and its grass tufts
//   kpKadamb(t)             the kadamb tree on the left with its gold ball flowers
//   kpBank(t)               the sand bank (pulina) down to the waterline (KP_WL)
//   kpWater(t)              the Yamuna: dark water, light streaks; kpRipples(t) over the reflections; kpLotus(t)
//   kpReflect(x, f)         draws f() mirrored about the waterline at x, wavering, then a water tint over it
//   laddoo / riceBall / leafPlate / fluteHook / stickHook
const KP = {
  ink: '#4A3230', sky0: '#F4CF94', sky1: '#F9E6BE', sun: '#FFE2A0', cloud: '#FFF6E4', cloudDk: '#EFD9B8',
  hillFar: '#C9C7A6', hill: '#9DB08A', hillDk: '#7E9472', hillLt: '#B9C79C', treeFar: '#7E9E6A', treeFarDk: '#62835A',
  meadow: '#BCD088', meadowDk: '#9FB96C', grass: '#7FA05A', sand: '#F0DCB2', sandDk: '#D9BE8A', sandLt: '#FAEBCB',
  water: '#2F5F80', waterDk: '#234B69', waterLt: '#4F86A6', streak: '#A9D2E2', leaf: '#5E9A55', leafDk: '#3F7440',
  lotus: '#F3A6B8', lotusDk: '#D9748F', trunk: '#7A5A44', trunkDk: '#5A4030', canopy: '#5E8E4E', canopyDk: '#477640',
  canopyLt: '#7EAA5E', kadamb: '#F2B33A', kadambLt: '#FFE08A', laddoo: '#F2A93A', laddooDk: '#C97E1E', rice: '#FFF8E8',
  plate: '#6FA85A', plateDk: '#4A7E40', flute: '#C98E4A', fluteDk: '#8E5A28', stick: '#9A6A3E',
};
const KP_WL = 1268;   // the waterline
const kpPhase = (t, p = 8) => TAU * t / p;

function kpSky(t) {
  boilSeed('kp sky');
  paint(rectPts(-40, -40, W + 80, 1000), { wash: KP.sky1, ink: null });
  paint(rectPts(-40, -40, W + 80, 520), { fill: KP.sky0, fillOp: 160, bleed: .2, tex: .3, border: .3, ink: null });
  paint(ellPts(560, 300, 900, 260, 24), { fill: KP.sky0, fillOp: 90, bleed: .3, tex: .3, ink: null });
  glow(190, 640, 420, KP.sun, .5);
  // clouds drift a few px over the loop
  const dx = Math.sin(kpPhase(t)) * 12;
  for (const [i, x, y, s] of [[0, 260, 300, 1.2], [1, 820, 420, .9], [2, 120, 560, .7]]) cloudPuff(x + dx * (1 - i * .3), y, s, 'kp cloud' + i);
}
function cloudPuff(x, y, s, key) {
  boilSeed(key);
  const blobs = [[-1.3, .25, .9, .55], [-.45, -.15, 1.0, .75], [.55, -.05, .95, .65], [1.35, .3, .75, .45], [0, .35, 1.9, .5]];
  for (const [bx, by, rx, ry] of blobs) paint(ellPts(x + bx * 100 * s, y + by * 100 * s, rx * 100 * s, ry * 100 * s, 18, 3), { wash: KP.cloud, washOp: 235, ink: null });
  paint(ellPts(x, y + 45 * s, 170 * s, 30 * s, 16), { fill: KP.cloudDk, fillOp: 90, bleed: .2, ink: null });
}

function kpHills(t) {
  boilSeed('kp hills far');
  paint([[-40, 860], [-40, 800], [160, 770], [360, 790], [520, 760], [700, 790], [900, 770], [1120, 795], [1120, 880]], { fill: KP.hillFar, fillOp: 200, bleed: .1, tex: .4, ink: null, curv: .5 });
  // Govardhan: a long low hill on the right, rock strata, a few trees on its back
  boilSeed('kp govardhan');
  const gov = [[440, 900], [520, 820], [640, 760], [760, 712], [860, 700], [960, 722], [1060, 760], [1120, 790], [1120, 900]];
  paint(gov, { wash: KP.hill, fill: KP.hillDk, fillOp: 70, tex: .5, ink: KP.ink, sw: .7, curv: .5 });
  for (const [a, b] of [[[600, 800], [780, 760]], [[700, 820], [940, 770]], [[820, 850], [1060, 800]]]) inkLine([a, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 8], b], .8, KP.hillDk, 'inkfine', .5);
  for (let i = 0; i < 7; i++) { const x = 620 + i * 70 + hash(i * 3) * 30, y = 742 - Math.sin((x - 440) / 680 * Math.PI) * 30 + hash(i) * 12; paint(ellPts(x, y, 16, 12, 10, 1.5), { wash: KP.treeFar, ink: null }); }
  // the far tree line along the meadow's edge
  boilSeed('kp treeline');
  for (let i = 0; i < 22; i++) {
    const x = -20 + i * 52 + hash(i * 1.7) * 20, y = 885 + hash(i * 2.3) * 10, r = 22 + hash(i * 4.1) * 16;
    paint(ellPts(x, y - r * .5, r, r * .75, 12, 2), { wash: i % 3 ? KP.treeFar : KP.treeFarDk, ink: null });
  }
}

function kpMeadow(t) {
  boilSeed('kp meadow');
  paint([[-40, 1120], [-40, 880], [300, 870], [700, 884], [1120, 872], [1120, 1120]], { wash: KP.meadow, ink: null, curv: .3 });
  paint(ellPts(560, 1010, 700, 70, 20), { fill: KP.meadowDk, fillOp: 90, bleed: .25, tex: .5, ink: null });
  paint(ellPts(260, 930, 300, 30, 16), { fill: KP.meadowDk, fillOp: 70, bleed: .25, tex: .5, ink: null });
  boilSeed('kp tufts');
  for (let i = 0; i < 46; i++) {
    const x = hash(i * 7.1) * 1080, y = 900 + hash(i * 3.3) * 170, h = 6 + (y - 900) * .05, sway = Math.sin(kpPhase(t, 4) + x * .01) * 1.5;
    for (const k of [-1, 0, 1]) inkLine([[x + k * 3, y], [x + k * 5 + sway, y - h * (1 - Math.abs(k) * .3)]], .9, KP.grass, 'inkfine', .3);
  }
}

function kpKadamb(t) {
  const sway = Math.sin(kpPhase(t)) * 4;
  boilSeed('kp kadamb trunk');
  paint([[60, 1095], [92, 980], [118, 860], [128, 760], [160, 760], [168, 860], [176, 990], [214, 1095]], { wash: KP.trunk, fill: KP.trunkDk, fillOp: 70, tex: .6, ink: KP.ink, sw: 1, curv: .4 });
  inkLine([[140, 880], [210, 800], [262, 770]], 9, KP.trunk, 'ink', .5);
  inkLine([[128, 900], [70, 820], [30, 800]], 8, KP.trunk, 'ink', .5);
  for (const k of [0, 1, 2]) inkLine([[120 + k * 18, 1080], [128 + k * 14, 930], [138 + k * 8, 800]], .8, KP.trunkDk, 'inkfine', .5);
  boilSeed('kp kadamb canopy');
  const lobes = [[-10, 760, 120, 95], [90, 690, 140, 110], [230, 700, 130, 100], [320, 770, 100, 80], [140, 790, 170, 80], [20, 650, 90, 70], [180, 620, 110, 80]];
  for (const [i, [x, y, rx, ry]] of lobes.entries()) paint(ellPts(x + sway * (1 - y / 900), y, rx, ry, 16, 4), { wash: i % 2 ? KP.canopy : KP.canopyLt, fill: KP.canopyDk, fillOp: 60, tex: .5, ink: null });
  paint(ellPts(140 + sway, 820, 220, 50, 16), { fill: KP.canopyDk, fillOp: 110, bleed: .2, ink: null });
  for (const [x, y, rx, ry] of lobes) inkLine(Array.from({ length: 9 }, (_, k) => { const a = Math.PI * (1.05 + k / 8 * .9); return [x + sway * (1 - y / 900) + Math.cos(a) * rx, y + Math.sin(a) * ry]; }), 1, KP.ink, 'ink', .5);
  boilSeed('kp kadamb flowers');
  for (let i = 0; i < 26; i++) {
    const x = -60 + hash(i * 5.3) * 440 + sway, y = 610 + hash(i * 2.9) * 220, r = 9 + hash(i * 8.1) * 4;
    paint(ellPts(x, y, r, r, 10), { wash: KP.kadamb, ink: KP.ink, sw: .5 });
    paint(ellPts(x - r * .3, y - r * .3, r * .35, r * .35, 7), { wash: KP.kadambLt, ink: null });
  }
}

function kpBank(t) {
  boilSeed('kp bank');
  const edge = [];
  for (let i = 0; i <= 12; i++) { const x = -40 + i * 100; edge.push([x, KP_WL + Math.sin(i * 1.7) * 6]); }
  paint([[-40, 1010], [200, 1000], [520, 1012], [820, 995], [1120, 1010], ...edge.reverse()], { wash: KP.sand, fill: KP.sandDk, fillOp: 60, tex: .5, ink: null, curv: .3 });
  paint(ellPts(540, 1018, 620, 26, 18), { fill: KP.meadowDk, fillOp: 90, bleed: .2, ink: null });   // grass meets sand
  paint(rectPts(-40, KP_WL - 26, W + 80, 30), { fill: KP.sandDk, fillOp: 110, bleed: .15, tex: .4, ink: null });   // wet sand by the water
  boilSeed('kp pebbles');
  for (let i = 0; i < 18; i++) { const x = hash(i * 9.7) * 1080, y = 1040 + hash(i * 4.4) * 200; paint(ellPts(x, y, 5 + hash(i) * 4, 3 + hash(i) * 2, 8), { wash: KP.sandLt, ink: KP.sandDk, sw: .4 }); }
}

function kpWater(t) {
  boilSeed('kp water');
  paint(rectPts(-40, KP_WL, W + 80, H - KP_WL + 40), { wash: KP.water, ink: null });
  paint(rectPts(-40, KP_WL + 260, W + 80, H), { fill: KP.waterDk, fillOp: 140, bleed: .2, tex: .4, ink: null });
  paint(rectPts(-40, KP_WL, W + 80, 60), { fill: KP.waterLt, fillOp: 120, bleed: .2, ink: null });
  inkLine([[-40, KP_WL + 2], [W + 40, KP_WL + 2]], 1.6, KP.ink, 'ink', 0);
}
function kpRipples(t) {
  boilSeed('kp ripples');
  for (let i = 0; i < 26; i++) {
    const y = KP_WL + 16 + i * 26 + hash(i * 3.3) * 10, ph = kpPhase(t, i % 2 ? 4 : 8) + i;
    const x = hash(i * 7.7) * 1000 + Math.sin(ph) * 18, w = 50 + hash(i * 1.1) * 110;
    inkLine([[x, y], [x + w * .5, y + 2 * Math.sin(ph)], [x + w, y]], 1.6 + (i % 3) * .5, KP.streak, 'inkfine', .5);
  }
}
function kpLotus(t) {
  boilSeed('kp lotus');
  for (const [i, x, y, r] of [[0, 120, 1610, 48], [1, 300, 1700, 40], [2, 860, 1640, 54], [3, 700, 1790, 44], [4, 980, 1540, 36]]) {
    const bob = Math.sin(kpPhase(t, 4) + i) * 2;
    paint(ellPts(x, y + bob, r, r * .38, 16), { wash: KP.leaf, fill: KP.leafDk, fillOp: 60, tex: .4, ink: KP.ink, sw: .7 });
    inkLine([[x, y + bob], [x + r * .8, y + bob - r * .12]], .8, KP.leafDk, 'inkfine', 0);
    if (i === 0 || i === 2) { const lx = x - r * .3, ly = y + bob - r * .25; for (const a of [-.6, -.2, .2, .6]) paint([[lx, ly], [lx + Math.sin(a) * 26 - 9, ly - Math.cos(a) * 34], [lx + Math.sin(a) * 30, ly - Math.cos(a) * 44], [lx + Math.sin(a) * 26 + 9, ly - Math.cos(a) * 34]], { wash: KP.lotus, fill: KP.lotusDk, fillOp: 50, ink: KP.ink, sw: .6, curv: .5 }); }
  }
}

// a reflection: f() mirrored about the waterline, wavering, tinted by the water
function kpReflect(t, x, f, key, k = .8) {
  push();
  translate(x + Math.sin(kpPhase(t, 2)) * 3, KP_WL + 4);
  scale(1 + Math.sin(kpPhase(t, 4)) * .015, -.92);
  translate(-x, -KP_WL);
  f();
  pop();
}

// props
function laddoo(x, y, r, key) {
  boilSeed(key);
  paint(ellPts(x, y, r, r, 12, r * .05), { wash: KP.laddoo, fill: KP.laddooDk, fillOp: 70, tex: .6, ink: KP.ink, sw: .7 });
  for (let i = 0; i < 5; i++) paint(ellPts(x + (hash(i * 3) - .5) * r * 1.2, y + (hash(i * 5) - .5) * r * 1.2, r * .12, r * .12, 6), { wash: KP.laddooDk, ink: null });
}
function riceBall(x, y, r, key) {
  boilSeed(key);
  paint(ellPts(x, y, r, r * .85, 12, r * .06), { wash: KP.rice, ink: KP.ink, sw: .6 });
  paint(ellPts(x + r * .25, y + r * .2, r * .35, r * .25, 8), { wash: '#F3E2C2', ink: null });
}
function leafPlate(x, y, r, key, food = true) {
  boilSeed(key);
  paint(ellPts(x, y, r, r * .36, 16, 1), { wash: KP.plate, fill: KP.plateDk, fillOp: 60, tex: .4, ink: KP.ink, sw: .7 });
  inkLine([[x - r * .85, y], [x + r * .85, y]], .7, KP.plateDk, 'inkfine', 0);
  if (food) { paint(ellPts(x - r * .25, y - r * .08, r * .3, r * .14, 10), { wash: KP.rice, ink: KP.ink, sw: .4 }); paint(ellPts(x + r * .3, y - r * .1, r * .18, r * .18, 9), { wash: KP.laddoo, ink: KP.ink, sw: .4 }); }
}
// hooks for kartikeya()'s armR / armL (drawn upright at the hand)
function fluteHook(u, sw) { paint(ribbon([[-.2 * u, .3 * u], [.3 * u, -3.2 * u]], .38 * u, .38 * u), { wash: KP.flute, fill: KP.fluteDk, fillOp: 50, tex: .4, ink: KP.ink, sw: sw * .5 }); for (let k = 0; k < 4; k++) paint(ellPts((.05 + k * .05) * u, (-1.4 - k * .45) * u, .07 * u, .07 * u, 6), { wash: KP.fluteDk, ink: null }); }
function stickHook(u, sw) { paint(ribbon([[0, 1.2 * u], [.25 * u, -6 * u]], .3 * u, .26 * u), { wash: KP.stick, ink: KP.ink, sw: sw * .5 }); }
