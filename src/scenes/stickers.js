// stickers.js: die-cut stickers of the Painted cast, for a 12 × 18 in print sheet (tools/stickers.mjs lays it out).
// Each entry of STK is one sticker: { id, h (print height in inches), draw(t) }. Slot i of the page paints STK[i] alone
// on white, in a 900 × 900 design space (camBegin(450, 450, W / 900)); stickerAt(i) cuts it out with a white border.
const STK_T = .5;   // the pose time every sticker is painted at
const STK_K = .84;  // every sticker's h (inches) is multiplied by this: the one dial that fits the set to the sheet
const NS = { noShadow: true };
// flat: 1 on a sticker paints it without the watercolour layer over its flat washes: a tail's long curled ribbon
// leaves a pale stain of that layer inside its curl, which paper hides and a white sticker doesn't.
let STK_FLAT = false;
{ const base = paintAt; paintAt = (pts, o) => base(pts, STK_FLAT && o.wash && o.fill ? { ...o, fill: null } : o); }
// a word under a sticker: Bangers, a colour on a thick ink stroke
const stkWord = (txt, y, size = 64, col = '#F15A24', x = 450) => letter(txt, x, y, size, col, { stroke: PAL.ink, sw: .2, ink: false, rot: -.03 });

// Bal Krishna's butter pot: a clay matki heaped with makhan, standing on the ground at (x, y)
function stkMatki(x, y, s) {
  boilSeed('matki');
  paint([[-.6, -1.4], [-.5, -1.8], [-.15, -2.05], [.3, -1.95], [.58, -1.65], [.6, -1.4]].map(([a, b]) => [x + a * s, y + b * s]), { wash: '#FFF8EC', fill: '#F2DDA8', fillOp: 50, ink: '#4A2A18', sw: 1, curv: .5 });
  paint(ellPts(x, y - s * .72, s, s * .78, 24, 1), { wash: '#C8643C', fill: '#8E3E22', fillOp: 60, tex: .5, ink: '#4A2A18', sw: 1.1 });
  paint(rrPts(x - s * .7, y - s * 1.56, s * 1.4, s * .24, s * .1), { wash: '#A84D33', ink: '#4A2A18', sw: .9 });
  for (const k of [-2, -1, 0, 1, 2]) paint(ellPts(x + k * s * .32, y - s * (.78 - Math.abs(k) * .03), s * .07, s * .07, 8), { wash: '#FFF8EC', ink: null });
  inkLine([[x - s * .62, y - s * .98], [x, y - s * 1.06], [x + s * .62, y - s * .98]], .7, '#FFF8EC', 'inkfine', .5);
}
const SAFFRON = '#F7931E', RED = '#E0343C', PINK = '#E8528E', BLUE = '#3A78D8', GOLD = '#F2B21E', TEAL = '#2E9C92', INDIGO = '#5B4BC4';

// a smiling sun at (x, y): Surya's ring of rays (surya.js) with a happy face on the disc; r is the disc's radius
function stkSun(x, y, r) {
  boilSeed('stk sun'); const u = r / 4.8, sw = clamp(u / 12, .6, 1.6);
  push(); translate(x, y); suryaRays(u, sw, 16, 1);
  const P = pts => U(pts, u), INK = SUR.ink;
  for (const s of [-1, 1]) {
    inkLine(P([[s * 1.9 - .8, -.5], [s * 1.9, -1.3], [s * 1.9 + .8, -.5]]), sw * 1.4, INK, 'ink', .6);   // happy closed eyes
    paint(ellPts(s * 2.6 * u, .8 * u, .75 * u, .45 * u, 12), { wash: '#F58A5A', washOp: 150, ink: null });   // cheeks
  }
  paint(P([[-1.3, .5], [0, 1.9], [1.3, .5], [0, .9]]), { wash: '#C2452B', ink: INK, sw: sw * .9, curv: .6 });   // the grin
  pop();
}
// the Sudarshana chakra, spinning: a ring of flames, a saw-toothed gold rim (the teeth raked the way it turns), a band
// of gems, a deep blue disc with eight gold spokes, a lotus hub with a ruby
function stkChakra() {
  const INK = '#2A2440', G = '#F2C230', GD = '#B88A1C', GL = '#FFE69A', cx = 450, cy = 450, at = (a, r) => [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  boilSeed('stk chakra flames');
  for (const [r0, r1, c, cd, k, off] of [[250, 372, '#F7931E', '#D2283A', 1.5, 0], [250, 318, '#FFD24A', '#F7931E', 1, TAU / 36]]) for (let i = 0; i < 18; i++) {
    const a = i / 18 * TAU + off, w = TAU / 18 * .55, L = i % 2 ? r1 : r1 - 26, m = q => r0 + (L - r0) * q;
    paint([at(a - w, r0), at(a - w * .9, m(.45)), at(a - w * .1, m(.78)), at(a + .2, L), at(a + w * .45, m(.6)), at(a + w * .7, m(.3)), at(a + w, r0)], { wash: c, fill: cd, fillOp: 50, tex: .4, ink: k > 1 ? INK : null, sw: k, curv: .6 });
  }
  boilSeed('stk chakra rim');
  const T0 = []; for (let i = 0; i < 40; i++) { const a = i / 40 * TAU, st = TAU / 40; T0.push(at(a, 262), at(a + st * .7, 296)); }
  paint(T0, { wash: GD, fill: '#8A6414', fillOp: 50, tex: .4, ink: INK, sw: 1.4 });
  paint(ellPts(cx, cy, 268, 268, 48), { wash: G, fill: GD, fillOp: 55, tex: .4, ink: INK, sw: 1.5 });
  paint(ellPts(cx, cy, 214, 214, 44), { wash: '#2A3F8A', fill: '#1A2860', fillOp: 55, tex: .4, ink: INK, sw: 1.3 });
  for (let i = 0; i < 16; i++) { const [x, y] = at(i / 16 * TAU, 241); paint(ellPts(x, y, 10, 10, 8), { wash: i % 2 ? '#2F9C94' : '#D2283A', ink: INK, sw: .7 }); }
  inkLine(ellPts(cx, cy, 254, 254, 48).concat([[cx + 254, cy]]), .9, GL, 'inkfine', .5);
  boilSeed('stk chakra spokes');
  for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + .2, n = a + Math.PI / 2;
    const p = (r, s) => [cx + Math.cos(a) * r + Math.cos(n) * s, cy + Math.sin(a) * r + Math.sin(n) * s];
    paint([p(70, -12), p(120, -26), p(185, -14), p(212, 0), p(185, 14), p(120, 26), p(70, 12)], { wash: G, fill: GD, fillOp: 55, tex: .4, ink: INK, sw: 1.1, curv: .3 });
    inkLine([p(80, 0), p(195, 0)], .8, GL, 'inkfine', 0);
    paint(ellPts(...p(150, 0), 8, 8, 8), { wash: '#D2283A', ink: INK, sw: .5 });
  }
  for (let i = 0; i < 4; i++) { const a0 = i / 4 * TAU + .55; inkLine(Array.from({ length: 9 }, (_, k) => at(a0 + k * .07, 196)), 2, '#8FB4FF', 'ink', .4); }   // spin streaks
  boilSeed('stk chakra hub');
  for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + .6; push(); translate(cx, cy); rotate(a); paint([[40, 0], [62, -18], [92, 0], [62, 18]], { wash: '#F7A6C0', fill: '#E8528E', fillOp: 50, ink: INK, sw: .9, curv: .5 }); pop(); }
  paint(ellPts(cx, cy, 48, 48, 20), { wash: G, fill: GD, fillOp: 55, tex: .4, ink: INK, sw: 1.2 });
  paint(ellPts(cx, cy, 24, 24, 12), { wash: '#D2283A', ink: INK, sw: .9 }); paint(ellPts(cx - 7, cy - 8, 7, 7, 8), { wash: '#FFF8EC', ink: null });
}
// a brass kalash for the puja: a round pot on its foot, a red-and-yellow mauli tied round the neck, a kumkum flower on
// its belly, mango leaves fanning from its mouth, and a coconut on top with a mauli round it
function stkKalash() {
  const INK = '#3A2418', B = '#E8B04A', BD = '#B07A22', BL = '#FFE29A', X = (pts, ox = 450) => pts.map(([a, b]) => [ox + a, b]), M = pts => [...pts, ...pts.slice().reverse().map(([a, b]) => [-a, b])];
  boilSeed('stk kalash leaves');   // the mango leaves, from the mouth outward
  for (const a of [-1.45, -1.0, -.55, .55, 1.0, 1.45]) { const l = Math.abs(a) > 1.2 ? 165 : 185;
    push(); translate(450 + Math.sign(a) * 30, 405); rotate(a); paint([[0, 0], [24, -l * .3], [20, -l * .7], [3, -l], [-20, -l * .72], [-26, -l * .3]], { wash: '#5FA85A', fill: '#2F6E3E', fillOp: 60, tex: .4, ink: INK, sw: 1.1, curv: .5 });
    inkLine([[0, -6], [0, -l * .9]], .8, '#B8E08A', 'inkfine', .3); pop(); }
  boilSeed('stk kalash pot');
  paint(X([[-80, 760], [80, 760], [104, 806], [-104, 806]]), { wash: BD, fill: '#8A5A14', fillOp: 50, tex: .4, ink: INK, sw: 1.3, curv: .2 });   // the foot
  paint(X([[-78, 428], [78, 428], [94, 474], [-94, 474]]), { wash: B, fill: BD, fillOp: 55, tex: .4, ink: INK, sw: 1.4 });   // the neck
  paint(ellPts(450, 612, 198, 162, 44), { wash: B, fill: BD, fillOp: 55, tex: .4, ink: INK, sw: 1.5 });   // the belly
  paint([[300, 560], [318, 520], [350, 506], [340, 560], [332, 640], [312, 650]], { wash: BL, washOp: 170, ink: null, curv: .5 });   // a shine
  for (const [y, w] of [[520, 150], [702, 160]]) inkLine([[450 - w, y], [450, y + 14], [450 + w, y]], 1.6, BD, 'ink', .5);
  boilSeed('stk kalash kumkum');   // a kumkum flower on the belly
  for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; paint(ellPts(450 + Math.cos(a) * 34, 612 + Math.sin(a) * 34, 15, 15, 10), { wash: '#D2283A', ink: null }); }
  paint(ellPts(450, 612, 16, 16, 10), { wash: '#F7931E', ink: null });
  for (const s of [-1, 1]) for (const k of [0, 1, 2]) paint(ellPts(450 + s * (100 + k * 26), 612 + Math.abs(k - 1) * 10, 7, 7, 8), { wash: '#D2283A', ink: null });
  boilSeed('stk kalash mauli');   // the sacred thread round the neck
  for (const [y, c] of [[452, '#D2283A'], [462, '#F2C230'], [472, '#D2283A']]) inkLine([[368, y], [450, y + 8], [532, y]], 3, c, 'ink', .4);
  paint([[528, 470], [548, 520], [536, 524], [520, 478]], { wash: '#D2283A', ink: INK, sw: .7 });
  boilSeed('stk kalash rim');
  paint(ellPts(450, 420, 118, 24, 28), { wash: B, fill: BD, fillOp: 55, tex: .4, ink: INK, sw: 1.4 });
  paint(ellPts(450, 418, 92, 14, 24), { wash: '#5A3A14', ink: null });
  boilSeed('stk kalash coconut');
  paint(ellPts(450, 318, 84, 96, 30), { wash: '#A8683A', fill: '#6E3E1E', fillOp: 60, tex: .5, ink: INK, sw: 1.4 });
  paint([[436, 230], [450, 208], [464, 230]], { wash: '#8E5A2E', ink: INK, sw: 1, curv: .4 });
  for (const s of [-1, 0, 1]) inkLine([[450 + s * 6, 214], [450 + s * 26, 178 - Math.abs(s) * 6]], 1.6, '#8E5A2E', 'ink', .4);   // the tuft
  for (const k of [-2, -1, 0, 1, 2]) inkLine([[450 + k * 12, 236], [450 + k * 28, 270], [450 + k * 32, 310]], .7, '#5A2E14', 'inkfine', .4);   // fibres
  for (const [y, c] of [[340, '#D2283A'], [350, '#F2C230'], [360, '#D2283A']]) inkLine([[368, y - 8], [410, y + 2], [450, y + 6], [490, y + 2], [532, y - 8]], 3, c, 'ink', .4);   // a mauli round it
  paint(ellPts(420, 282, 20, 30, 12, 1, -.5), { wash: '#C8885A', washOp: 150, ink: null });   // a shine
}
// a Shivling: the dark stone linga on its yoni pitha with the spout to the right, water on it, the tripundra in ash, a
// marigold garland round its foot, three bilva leaves on top, on a stepped stone plinth
function stkShivling() {
  const INK = '#22263A', S = '#5E6B82', SD = '#3E4A60', SL = '#8E9BB4';
  boilSeed('stk linga base');
  paint(rrPts(240, 660, 420, 62, 12), { wash: SD, fill: '#2C3548', fillOp: 50, tex: .4, ink: INK, sw: 1.3 });
  paint(rrPts(270, 628, 360, 44, 10), { wash: S, fill: SD, fillOp: 50, tex: .4, ink: INK, sw: 1.2 });
  paint([[630, 560], [770, 578], [800, 600], [790, 616], [640, 620]], { wash: S, fill: SD, fillOp: 50, tex: .4, ink: INK, sw: 1.3, curv: .3 });   // the spout
  inkLine([[640, 580], [770, 592]], 1, '#9FD3EE', 'ink', .4);
  paint([[235, 568], [665, 568], [662, 612], [600, 640], [450, 652], [300, 640], [238, 612]], { wash: S, fill: SD, fillOp: 55, tex: .4, ink: INK, sw: 1.3, curv: .35 });
  paint(ellPts(450, 568, 215, 46, 32), { wash: SL, fill: S, fillOp: 50, tex: .4, ink: INK, sw: 1.2 });
  paint(ellPts(450, 570, 182, 34, 28), { wash: '#BFE4F5', fill: '#8EC8E6', fillOp: 50, ink: null });   // water
  boilSeed('stk linga');
  const L = []; for (let k = 0; k <= 16; k++) { const a = Math.PI + k / 16 * Math.PI; L.push([450 + Math.cos(a) * 112, 330 + Math.sin(a) * 105]); }
  L.push([562, 560]); for (let k = 1; k < 10; k++) { const a = k / 10 * Math.PI; L.push([450 + Math.cos(a) * 112, 560 + Math.sin(a) * 20]); } L.push([338, 560]);
  paint(L, { wash: S, fill: SD, fillOp: 60, tex: .5, ink: INK, sw: 1.5, curv: .2 });
  paint([[370, 300], [395, 260], [405, 300], [400, 520], [372, 520]], { wash: SL, washOp: 160, ink: null, curv: .5 });   // a sheen down its left
  for (const y of [395, 425, 455]) inkLine([[352, y], [400, y + 8], [450, y + 10], [500, y + 8], [548, y]], 3.2, '#F4F0E8', 'ink', .6);   // the tripundra
  paint(ellPts(450, 434, 15, 17, 12), { wash: '#D2283A', ink: null });
  boilSeed('stk linga garland');
  for (let k = 0; k <= 12; k++) { const a = k / 12 * Math.PI; paint(ellPts(450 + Math.cos(a) * 118, 540 + Math.sin(a) * 26, 15, 15, 10), { wash: k % 2 ? '#F7931E' : '#F2C230', fill: '#D9621A', fillOp: 50, ink: INK, sw: .7 }); }
  boilSeed('stk linga bilva');   // three bilva leaves, a trifoliate sprig, on top
  for (const [a, l] of [[-.75, 80], [0, 92], [.75, 80]]) { push(); translate(450, 238); rotate(a); paint([[0, 0], [24, -l * .35], [16, -l * .8], [0, -l], [-16, -l * .8], [-24, -l * .35]], { wash: '#6FAE6A', fill: '#3E7A4A', fillOp: 60, tex: .4, ink: INK, sw: 1, curv: .5 }); inkLine([[0, -6], [0, -l * .85]], .7, '#2E5E3A', 'inkfine', .3); pop(); }
}
// Bal Bappa's writing: a bundle of palm leaves across his lap (body space, sitting), lines of script, a tied pothi beside
function stkPothi(u, sw, INK = BAL.ink) {
  const P = pts => U(pts, u);
  push(); translate(0, -2.5 * u); rotate(.04);
  for (let i = 2; i >= 0; i--) paint(rrPts(-4.6 * u, (-.55 - i * .2) * u, 9 * u, 1.35 * u, .55 * u), { wash: i ? '#E2C482' : '#F4E2B0', fill: '#B8944E', fillOp: 40, tex: .4, ink: INK, sw: sw * .6 });
  for (let j = 0; j < 3; j++) { const yy = -.2 + j * .32, x1 = j === 2 ? .6 : 3.6;   // three lines of script, the last one still being written
    inkLine(P([[-3.8, yy], [-2, yy - .05], [0, yy + .03], [x1, yy]]), sw * .45, '#6A3E1E', 'inkfine', .5);
    for (let k = -3.6; k < x1 - .2; k += .55) inkLine(P([[k, yy], [k + .1, yy - .16]]), sw * .3, '#6A3E1E', 'inkfine', 0); }
  for (const s of [-1, 1]) paint(ellPts(s * 3.95 * u, .1 * u, .14 * u, .14 * u, 8), { wash: '#7A4A22', ink: null });   // the cord holes
  pop();
}
// his tusk as a pen, in the hand hook (upright at the hand): the point down on the leaf
const stkTuskPen = (u, sw) => {
  paint(ribbon(U([[.7, -1.9], [.35, -.8], [-.15, .2], [-.75, .95]], u), .5 * u, .12 * u), { wash: BAL.tusk, fill: '#E8CFA8', fillOp: 70, tex: .4, ink: BAL.ink, sw: sw * .6 });
};
// a 4-point sparkle at (x, y), radius r
const stkStar = (x, y, r, c = '#FFF6B0', INK = '#B88A1C') => paint([[x, y - r], [x + r * .22, y - r * .22], [x + r, y], [x + r * .22, y + r * .22], [x, y + r], [x - r * .22, y + r * .22], [x - r, y], [x - r * .22, y - r * .22]], { wash: c, ink: INK, sw: .8, curv: .1 });
// the Sanjeevani mountain on Hanuman's palm (arm hook space: the hand at (0, 0)), in a pale gold halo, its herbs glowing
function stkMountain(u, sw) {
  const INK = HNM.ink, P = pts => U(pts.map(([a, b]) => [a + 2.6, b - .3]), u * 1.25), Q = (a, b) => [(a + 2.6) * u * 1.25, (b - .3) * u * 1.25];
  boilSeed('stk mtn halo');
  paint(ellPts(...Q(0, -4.6), 7.4 * u * 1.25, 6.6 * u * 1.25, 36), { wash: '#FFF4B8', fill: '#FFE27A', fillOp: 40, ink: '#F2C230', sw: sw * .6 });
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU + .1, [cx, cy] = Q(0, -4.6), r0 = 5.6 * u * 1.25, r1 = 7.2 * u * 1.25;
    paint([[cx + Math.cos(a - .07) * r0, cy + Math.sin(a - .07) * r0], [cx + Math.cos(a) * r1, cy + Math.sin(a) * r1], [cx + Math.cos(a + .07) * r0, cy + Math.sin(a + .07) * r0]], { wash: '#FFE27A', ink: null }); }
  boilSeed('stk mtn');
  paint(P([[-5.2, 0], [-4, .9], [-2, 1.4], [0, 1.1], [2, 1.4], [4, .9], [5.2, 0]]), { wash: '#8A5A36', fill: '#5E3A1E', fillOp: 55, tex: .4, ink: INK, sw: sw * .7, curv: .3 });   // the torn-off underside
  for (const x of [-3, -.6, 2.2]) inkLine(P([[x, 1.1], [x + .2, 1.9], [x - .1, 2.4]]), sw * .5, '#5E3A1E', 'inkfine', .5);   // roots
  paint(P([[-5.4, 0], [-4.6, -2.4], [-3.6, -4.2], [-2.6, -6.6], [-1.6, -5.4], [-.5, -8.4], [.7, -6.4], [1.7, -7.5], [3, -4.8], [4.2, -3.6], [5.4, 0]]), { wash: '#7FB060', fill: '#4E7A3E', fillOp: 55, tex: .5, ink: INK, sw: sw * .8, curv: .25 });
  paint(P([[-.5, -8.4], [-.1, -7.2], [-.8, -6.6], [-1.6, -5.4]]), { wash: '#B8A08A', ink: null, curv: .3 });   // bare rock at the peaks
  paint(P([[1.7, -7.5], [2.1, -6.6], [1.4, -6.2], [.7, -6.4]]), { wash: '#B8A08A', ink: null, curv: .3 });
  boilSeed('stk mtn trees');
  for (const [a, b, r] of [[-3.8, -1.4, .7], [-2.4, -3.2, .8], [-.9, -1.6, .9], [.6, -3.6, .8], [2.2, -2, .9], [3.6, -1, .7], [-1.4, -4.8, .6], [1.9, -5.2, .6]]) {
    inkLine(P([[a, b + r * .9], [a, b + r * 1.6]]), sw * .6, '#5E3A1E', 'inkfine', 0);
    paint(ellPts(...Q(a, b), r * u * 1.25, r * 1.1 * u * 1.25, 12), { wash: '#3E8A4A', fill: '#2A5E34', fillOp: 50, ink: INK, sw: sw * .5 });
  }
  boilSeed('stk mtn herbs');   // the herbs, glowing
  for (const [a, b, r] of [[-2.9, -2.2, .55], [-.2, -5.8, .7], [1.2, -1.2, .6], [3, -3.1, .5], [-1.8, -.6, .45], [.2, -2.8, .5]]) stkStar(...Q(a, b), r * u * 1.25);
  for (const [a, b, r] of [[-6.2, -6.4, 1], [5.2, -8.6, .9], [-4.6, -9.8, .7], [6.3, -3.4, .7], [1.2, -11, .75]]) stkStar(...Q(a, b), r * u * 1.25, '#FFFFFF', '#E0A21E');
}
// a swastik in gold: thick arms whose ends sweep out and flare like leaves, a maroon outline, the four red dots, rows of
// small dots along the hooks, a red flower at the centre
function stkSwastik() {
  const INK = '#5A1E10', L = 170, E = 140;
  const arm = [[0, 0], [0, -L], [E * .55, -L - 4], [E * .92, -L - 26], [E * 1.08, -L - 64]];
  for (const pass of [0, 1]) for (let k = 0; k < 4; k++) {   // each arm, rotated a quarter turn clockwise: up, then its hook to the right, its tip curling up;
    boilSeed('stk swastik arm ' + k); push(); translate(450, 450); rotate(k * Math.PI / 2);   // pass 0 the outlines, pass 1 the gold over their inner folds
    if (!pass) paint(ribbon(arm, 96, 80), { wash: '#F7B731', fill: '#E08A1E', fillOp: 50, tex: .4, ink: INK, sw: 2.4 });
    else {
      paint(ribbon(arm.slice(0, 4), 80, 70), { wash: '#F7B731', ink: null });
      inkLine([[-22, -60], [-22, -L + 6], [E * .45, -L - 22], [E * .8, -L - 40]], 1.8, '#FFE08A', 'ink', .5);   // a shine
      for (let j = 0; j < 4; j++) paint(ellPts(E * .32 + j * 26, -L + 76 + j * j * 2, 7, 7, 6), { wash: '#D9282E', ink: null });   // the dotted row under the hook
    }
    pop();
  }
  boilSeed('stk swastik dots');
  for (const [a, b] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { paint(ellPts(450 + a * 92, 450 + b * 92, 25, 25, 14), { wash: '#E0343C', fill: '#A81E2A', fillOp: 40, ink: INK, sw: 1.6 }); paint(ellPts(450 + a * 92 - 7, 450 + b * 92 - 8, 6, 6, 6), { wash: '#FF9A8A', ink: null }); }
  boilSeed('stk swastik flower');
  for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; paint(ellPts(450 + Math.cos(a) * 40, 450 + Math.sin(a) * 40, 22, 22, 10), { wash: '#E0343C', fill: '#A81E2A', fillOp: 40, ink: INK, sw: 1.2 }); }
  paint(ellPts(450, 450, 32, 32, 14), { wash: '#F7931E', ink: INK, sw: 1.2 });
  for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; paint(ellPts(450 + Math.cos(a) * 14, 450 + Math.sin(a) * 14, 5, 5, 6), { wash: '#FFE08A', ink: null }); }
}
// a Shaiva tilak in brush strokes: three dry-brushed black bands and a tall red flame of kumkum up the
// middle
function stkTilak() {
  const INK = '#141010';
  const rnd = n => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
  for (const [k, y] of [[0, 330], [1, 455], [2, 580]]) {
    boilSeed('stk tilak band ' + k);
    const top = [], bot = [];
    for (let i = 0; i <= 22; i++) { const x = 150 + i * 25; top.push([x, y - 42 + (rnd(k * 90 + i) - .5) * 10]); bot.push([x, y + 40 + (rnd(k * 90 + i + 40) - .5) * 10]); }
    const left = [0, 1, 2, 3, 4].map(j => [128 + rnd(k * 7 + j) * 30, y + 34 - j * 18]);
    paint([...top, [705, y - 30], [690, y - 10], [708, y + 10], [700, bot[bot.length - 1][1] - 6], ...bot.reverse(), ...left], { wash: '#1E1A1A', fill: '#0E0C0C', fillOp: 50, tex: .6, ink: null, curv: .15 });
    for (let j = 0; j < 7; j++) { const yy = y - 36 + j * 12 + (rnd(k * 31 + j) - .5) * 4, x1 = 730 + rnd(k * 17 + j) * 60, hh = 3 + rnd(k * 13 + j) * 5;   // the dry tail
      paint([[680, yy - hh], [x1 - 20, yy - hh * .6], [x1, yy], [x1 - 20, yy + hh * .6], [680, yy + hh]], { wash: '#1E1A1A', ink: null, curv: .2 }); }
    for (let j = 0; j < 6; j++) { const yy = y - 30 + j * 12 + rnd(k * 23 + j) * 4, x0 = 190 + rnd(k * 11 + j) * 200, x1 = x0 + 140 + rnd(k * 19 + j) * 260;   // streaks where the brush ran dry
      inkLine([[x0, yy], [(x0 + x1) / 2, yy + 1], [x1, yy]], .6, '#FFFFFF', 'inkfine', .2); }
  }
  boilSeed('stk tilak red');
  paint([[450, 150], [470, 260], [486, 420], [492, 600], [488, 662], [472, 698], [450, 708], [428, 698], [412, 662], [408, 600], [414, 420], [430, 260]], { wash: '#E8231E', fill: '#B4141A', fillOp: 45, tex: .4, ink: '#6A0A0A', sw: 1.3, curv: .5 });
  inkLine([[440, 240], [428, 420], [426, 620]], 1.4, '#FF6A50', 'ink', .5);
}
// a clay diya, painted, its flame big and bright in a halo with sparkles
function stkDiya() {
  const INK = '#4A2418';
  boilSeed('stk diya halo');
  paint(ellPts(450, 330, 180, 210, 30), { wash: '#FFF4B8', fill: '#FFE27A', fillOp: 40, ink: null });
  boilSeed('stk diya flame');
  paint([[450, 120], [505, 230], [530, 330], [505, 420], [450, 445], [395, 420], [370, 330], [395, 230]], { wash: '#F7931E', fill: '#E0471E', fillOp: 50, ink: INK, sw: 1.4, curv: .5 });
  paint([[450, 190], [488, 280], [500, 350], [478, 415], [450, 428], [422, 415], [400, 350], [412, 280]], { wash: '#FFD24A', ink: null, curv: .5 });
  paint([[450, 280], [470, 340], [466, 400], [450, 418], [434, 400], [430, 340]], { wash: '#FFF8E0', ink: null, curv: .5 });
  inkLine([[450, 445], [450, 470]], 2, '#3A2418', 'ink', 0);   // the wick
  for (const [x, y, r] of [[300, 180, 34], [612, 220, 28], [640, 380, 20], [262, 360, 22]]) stkStar(x, y, r, '#FFFFFF', '#E0A21E');
  boilSeed('stk diya');
  paint([[210, 470], [690, 470], [660, 540], [600, 600], [500, 630], [400, 630], [300, 600], [240, 540]], { wash: '#C8643C', fill: '#8E3E22', fillOp: 55, tex: .5, ink: INK, sw: 1.5, curv: .4 });
  paint(ellPts(450, 472, 240, 34, 30), { wash: '#A84D33', ink: INK, sw: 1.2 });
  paint(ellPts(450, 470, 205, 22, 26), { wash: '#F2B21E', fill: '#D98A1E', fillOp: 40, ink: null });   // the ghee
  paint([[380, 625], [520, 625], [540, 668], [360, 668]], { wash: '#A84D33', fill: '#7A3018', fillOp: 50, ink: INK, sw: 1.2, curv: .2 });   // the foot
  inkLine([[250, 530], [350, 560], [450, 568], [550, 560], [650, 530]], 2.2, '#FFE9A8', 'ink', .4);
  for (let k = 0; k < 9; k++) paint(ellPts(290 + k * 40, 584 + Math.abs(k - 4) * -3 + (k % 2) * 4, 7, 7, 8), { wash: k % 2 ? '#FFF8EC' : '#F2C230', ink: null });
}
// a gold temple bell on its chain: a domed crown with a loop, a flared body with beaded and scalloped bands, an Om in
// relief on its face, a ball clapper peeping out below
function stkBell() {
  const INK = '#5A3410', B = '#F0B83C', BD = '#B67D1C', BL = '#FFE39A', BX = '#8A5A10';
  boilSeed('stk bell chain');
  for (let k = 0; k < 6; k++) { const y = 70 + k * 36, wide = k % 2 === 0;
    paint(ellPts(450, y, wide ? 15 : 7, 22, 12), { wash: null, ink: INK, sw: 1.1 });
    inkLine(ellPts(450, y, wide ? 12 : 5, 19, 12).concat([[450 + (wide ? 12 : 5), y]]), 3, B, 'ink', 0); }
  paint(ellPts(450, 292, 30, 26, 16), { wash: null, ink: INK, sw: 1.4 }); inkLine(ellPts(450, 292, 26, 22, 16).concat([[476, 292]]), 4.5, B, 'ink', 0);   // the loop
  boilSeed('stk bell crown');
  paint([[372, 380], [380, 345], [410, 322], [450, 314], [490, 322], [520, 345], [528, 380]], { wash: B, fill: BD, fillOp: 55, tex: .4, ink: INK, sw: 1.4, curv: .4 });
  for (let i = 0; i < 7; i++) paint(ellPts(392 + i * 19.3, 360 - Math.sin(i / 6 * Math.PI) * 18, 5, 5, 6), { wash: BL, ink: null });
  boilSeed('stk bell body');
  const R = [[78, 380], [92, 420], [100, 480], [108, 550], [124, 610], [158, 660], [205, 690]];
  paint([...R.map(([a, b]) => [450 + a, b]), ...R.slice().reverse().map(([a, b]) => [450 - a, b])], { wash: B, fill: BD, fillOp: 55, tex: .45, ink: INK, sw: 1.6, curv: .35 });
  paint([[372, 420], [388, 400], [394, 470], [372, 620], [342, 640], [356, 560]], { wash: BL, washOp: 170, ink: null, curv: .5 });   // a shine
  paint(rrPts(370, 386, 160, 26, 10), { wash: BD, ink: INK, sw: 1.1 });   // the beaded band under the crown
  for (let i = 0; i < 8; i++) paint(ellPts(382 + i * 19.5, 399, 6, 6, 6), { wash: BL, ink: null });
  for (const [y, w] of [[606, 124], [640, 150]]) inkLine([[450 - w, y], [450, y + 10], [450 + w, y]], 1.6, BX, 'ink', .4);
  for (let i = 0; i < 9; i++) { const x = 340 + i * 27.5; inkLine([[x - 12, 618], [x, 632], [x + 12, 618]], 1.2, BX, 'inkfine', .5); }   // scallops
  paint(ellPts(450, 690, 210, 30, 30), { wash: BD, fill: BX, fillOp: 50, ink: INK, sw: 1.5 });   // the lip
  for (let i = 0; i < 13; i++) paint(ellPts(270 + i * 30, 690 + Math.sin(i / 12 * Math.PI) * 12, 5, 5, 6), { wash: BL, ink: null });
  boilSeed('stk bell om');   // the Om, in relief
  paint(ellPts(450, 510, 62, 66, 22), { wash: BD, fill: BX, fillOp: 30, ink: INK, sw: 1 });
  letter('ॐ', 450, 524, 92, BL, { font: '92px "Tiro Devanagari Sanskrit"', stroke: BX, sw: .06, ink: false });
  boilSeed('stk bell clapper');
  paint(ellPts(450, 734, 30, 30, 14), { wash: B, fill: BD, fillOp: 50, ink: INK, sw: 1.3 }); paint(ellPts(441, 726, 8, 8, 6), { wash: BL, ink: null });
}
// Maa Lakshmi's feet, stepping in: two soles in alta red with a lotus in each, gold coins and sparkles
function stkCharan() {
  const INK = '#5A1E10';
  const foot = (x, y, a, m) => { push(); translate(x, y); rotate(a); scale(m, 1);
    paint([[-2, 140], [24, 132], [34, 108], [28, 70], [26, 30], [46, -20], [64, -70], [60, -102], [32, -116], [0, -112], [-30, -102], [-54, -80], [-58, -40], [-46, 10], [-40, 70], [-34, 115], [-22, 136]], { wash: '#E0343C', fill: '#A81E2A', fillOp: 50, tex: .4, ink: INK, sw: 1.4, curv: .5 });
    for (const [tx, ty, rx, ry] of [[38, -142, 21, 25], [6, -146, 14, 16], [-18, -139, 12, 14], [-38, -126, 11, 12], [-54, -106, 10, 11]]) paint(ellPts(tx, ty, rx, ry, 12), { wash: '#E0343C', ink: INK, sw: 1.1 });
    for (let i = 0; i < 8; i++) { push(); translate(2, -10); rotate(i / 8 * TAU); paint([[0, 0], [9, -14], [0, -30], [-9, -14]], { wash: '#FFF3DC', ink: null, curv: .5 }); pop(); }   // a lotus
    paint(ellPts(2, -10, 9, 9, 8), { wash: '#F2C230', ink: null });
    for (let k = 0; k < 5; k++) paint(ellPts(-8 + k * 2, 50 + k * 18, 4, 4, 6), { wash: '#FFF3DC', ink: null });
    pop(); };
  boilSeed('stk charan L'); foot(355, 540, -.12, 1);
  boilSeed('stk charan R'); foot(545, 450, .12, -1);
  boilSeed('stk charan coins');
  for (const [x, y] of [[640, 690], [690, 650], [600, 735], [700, 600], [655, 740]]) { paint(ellPts(x, y, 30, 26, 14), { wash: '#F2C230', fill: '#B88A1C', fillOp: 45, ink: INK, sw: 1 }); paint(ellPts(x, y, 9, 8, 8), { wash: '#B88A1C', ink: null }); }
  for (const [x, y, r] of [[262, 670, 30], [640, 330, 26], [262, 420, 20], [470, 690, 22]]) stkStar(x, y, r, '#FFF6B0', '#E0A21E');
}
// Maa Saraswati's veena, lying across: the big gourd (kudam) low on the right, the long fretted neck up to the left with
// its small gourd under it and a curled yali head, a pink lotus tucked at its foot
function stkVeena() {
  const INK = '#3A2018', W = '#A8552E', WD = '#6E3018', WL = '#D88A5A', G = '#F2C230', GD = '#B88A1C';
  const A = [175, 215], Bp = [640, 600], dx = Bp[0] - A[0], dy = Bp[1] - A[1], L = Math.hypot(dx, dy), nx = -dy / L * 40, ny = dx / L * 40, at = (t, k = 0) => [A[0] + dx * t + nx * k, A[1] + dy * t + ny * k];
  boilSeed('stk veena gourd2');   // the small gourd, under the neck
  inkLine([at(.2, 1), at(.2, 2.2)], 3, GD, 'ink', 0);
  paint(ellPts(...at(.2, 3.6), 78, 72, 20), { wash: '#C8743E', fill: WD, fillOp: 55, tex: .4, ink: INK, sw: 1.4 });
  paint(ellPts(...at(.17, 3.3), 26, 18, 10), { wash: '#F2B888', washOp: 160, ink: null });
  boilSeed('stk veena neck');
  paint([at(0, 1), at(1, 1), at(1, -1), at(0, -1)], { wash: W, fill: WD, fillOp: 50, tex: .4, ink: INK, sw: 1.5 });
  paint([at(.08, .55), at(.9, .55), at(.9, -.55), at(.08, -.55)], { wash: '#3A2018', ink: null });   // the fingerboard
  for (let k = 0; k < 13; k++) { const t = .12 + k * .057; inkLine([at(t, .6), at(t, -.6)], 1.6, G, 'ink', 0); }   // frets
  for (const t of [.05, .9]) paint([at(t, 1.2), at(t + .035, 1.2), at(t + .035, -1.2), at(t, -1.2)], { wash: G, fill: GD, fillOp: 40, ink: INK, sw: 1.1 });
  for (const k of [-.36, -.12, .12, .36]) inkLine([at(.07, k), at(1.02, k)], .9, '#F4ECDC', 'inkfine', 0);   // strings
  boilSeed('stk veena head');   // the yali head, curling up and back
  push(); translate(A[0], A[1]); rotate(Math.atan2(dy, dx));
  paint([[0, -40], [0, 40], [-60, 34], [-110, 12], [-140, -30], [-128, -78], [-90, -92], [-62, -70], [-70, -40], [-92, -46], [-96, -26], [-70, -10], [-40, -30]], { wash: W, fill: WD, fillOp: 50, tex: .4, ink: INK, sw: 1.4, curv: .45 });
  paint(ellPts(-108, -66, 11, 11, 8), { wash: G, ink: INK, sw: .8 });
  for (const x of [-30, -62, -94]) paint(ellPts(x, 46, 9, 16, 8), { wash: WD, ink: INK, sw: .8 });   // pegs
  pop();
  boilSeed('stk veena kudam');
  paint(ellPts(655, 605, 185, 170, 36), { wash: '#C8743E', fill: WD, fillOp: 60, tex: .5, ink: INK, sw: 1.7 });
  paint(ellPts(655, 605, 140, 126, 30), { wash: WL, fill: W, fillOp: 40, tex: .4, ink: INK, sw: 1.1 });   // the face
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; paint(ellPts(655 + Math.cos(a) * 104, 605 + Math.sin(a) * 92, 9, 9, 8), { wash: '#FFF3DC', ink: null }); }
  paint(ellPts(655, 605, 54, 50, 18), { wash: G, fill: GD, fillOp: 50, ink: INK, sw: 1.1 });   // the rosette
  for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; inkLine([[655 + Math.cos(a) * 16, 605 + Math.sin(a) * 15], [655 + Math.cos(a) * 44, 605 + Math.sin(a) * 40]], 1, GD, 'inkfine', 0); }
  paint(ellPts(580, 520, 40, 24, 10, 1, -.7), { wash: '#F2B888', washOp: 160, ink: null });
  boilSeed('stk veena lotus');   // a pink lotus at its foot
  for (const [a, l, c] of [[-1.1, 70, '#F7A6C0'], [1.1, 70, '#F7A6C0'], [-.5, 88, '#F48AB0'], [.5, 88, '#F48AB0'], [0, 100, '#F7B8CE']]) { push(); translate(500, 790); rotate(a); paint([[0, 0], [26, -l * .45], [0, -l], [-26, -l * .45]], { wash: c, fill: '#E8528E', fillOp: 40, ink: INK, sw: 1, curv: .5 }); pop(); }
  paint(ellPts(500, 794, 70, 16, 14), { wash: '#5FA85A', ink: INK, sw: .9 });
}
// Shiva's damru, tilted: a cream drum head with a gold rim, cones of brown wood painted with red and gold zigzags, a red
// band at the waist, two beads on curling cords hanging below, little sound marks
function stkDamru() {
  const INK = '#3A1A10', W = '#8E4A22', WD = '#5E2A10', G = '#F2B21E', R = '#D2283A';
  push(); translate(450, 400); rotate(-.18);
  boilSeed('stk damru cords');
  for (const s of [-1, 1]) { const end = [s * 150, 300]; inkLine([[s * 10, 50], [s * 30, 140], [s * 100, 190], [s * 150, 250], end], 1.4, INK, 'ink', .4);
    paint(ellPts(end[0], end[1], 30, 30, 12), { wash: '#7A3A1A', fill: WD, fillOp: 50, ink: INK, sw: 1.2 }); paint(ellPts(end[0] - 9, end[1] - 10, 8, 8, 6), { wash: '#C88A5A', ink: null }); }
  for (const s of [1, -1]) {   // the right cone first (behind), then the left with the face
    boilSeed('stk damru cone ' + s);
    const hx = s * 235, hh = 175, wx = s * 48, wh = 62;
    paint([[wx, -wh], [hx, -hh], [hx, hh], [wx, wh]], { wash: W, fill: WD, fillOp: 55, tex: .45, ink: INK, sw: 1.6 });
    const ix = s * 150, ih = hh - (hh - wh) * (235 - 150) / (235 - 48);
    paint([[hx, -hh], [ix, -ih], [ix, ih], [hx, hh]], { wash: G, ink: null });   // the painted strip by the rim
    for (let k = 0; k < 6; k++) { const y0 = -hh + k * hh / 3, y1 = y0 + hh / 3, ym = (y0 + y1) / 2;
      paint([[hx, y0 + 4], [ix + s * 4, ym * ih / hh], [hx, y1 - 4]], { wash: R, ink: INK, sw: .7 }); }
    inkLine([[ix, -ih], [ix, ih]], 1.2, INK, 'ink', 0);
    for (const k of [-.45, 0, .45]) inkLine([[s * 70, k * 50], [ix - s * 10, k * ih * .8]], .9, '#B8784A', 'inkfine', .3);   // the grain
    paint(ellPts(hx, 0, s < 0 ? 62 : 26, hh + 8, 26), { wash: G, fill: '#C8861E', fillOp: 50, ink: INK, sw: 1.6 });   // the gold rim
    if (s < 0) { paint(ellPts(hx - 6, 0, 46, hh - 14, 24), { wash: '#FFF3DC', fill: '#EAD7B0', fillOp: 40, ink: INK, sw: 1.1 }); paint(ellPts(hx - 12, -10, 12, 26, 10), { wash: '#C8A878', washOp: 160, ink: null }); }
  }
  boilSeed('stk damru band');
  paint(rrPts(-50, -70, 100, 140, 16), { wash: R, fill: '#8E1422', fillOp: 50, ink: INK, sw: 1.4 });
  for (const x of [-26, 0, 26]) inkLine([[x, -64], [x, 64]], 1, G, 'inkfine', 0);
  pop();
  boilSeed('stk damru sound');   // close to the heads, so the cut stays one piece
  for (const [x0, y0, dx] of [[148, 400, -1], [758, 300, 1]]) for (const [a, l] of [[-.5, 40], [0, 46], [.5, 40]]) {
    const ca = Math.cos(a), sa = Math.sin(a); inkLine([[x0 + dx * ca * 8, y0 + sa * 30], [x0 + dx * ca * (8 + l), y0 + sa * (30 + l)]], 2.6, G, 'ink', 0); }
}
// Hanuman's heart: a gold-rimmed opening in his chest (chest hook, body space). Ram and Sita are a close-up painted on
// their own (stkHeartInset) and set into it by stickerAt (the sticker's inset: STK_HEART_AT, in design px).
const STK_HEART_AT = [450, 850 - 13.8 * 27, 3.0 * 27, 2.9 * 27];
const stkHeart = (u, sw) => {
  boilSeed('stk heart');
  paint(ellPts(0, -13.8 * u, 3.45 * u, 3.3 * u, 30, u * .04), { wash: '#FFE7A0', fill: '#F7B32B', fillOp: 70, bleed: .2, tex: .5, border: .7, ink: '#7A2A22', sw: sw * 1.1 });
  for (const s of [-1, 1]) inkLine(U([[s * 3.1, -16.3], [s * 3.55, -13.8], [s * 3.1, -11.3]], u), sw * .9, '#BC3812', 'ink', .6);   // the torn edges
};
// the close-up inside: Ram and Sita from the waist up, in a gold glow (centred on (450, 420); stickerAt crops it)
function stkHeartInset() {
  boilSeed('stk heart glow');
  paint(ellPts(450, 420, 340, 320, 36), { wash: '#FFE7A0', fill: '#F7B32B', fillOp: 60, bleed: .2, tex: .5, border: .7, ink: null });
  paint(ellPts(450, 380, 230, 220, 30), { wash: '#FFF6D6', washOp: 210, ink: null });
  ram(340, 960, 28, { seed: 7, mouth: 'smile', eyes: 'happy', kodanda: false, handR: [3.4, -17.4], bendR: .8, noShadow: true, boilKey: 'hr' });
  parvati(565, 960, 29, { pal: SITA_PAL, ...SITA_SKIN, seed: 8, eyes: 'happy', mouth: 'smile', pray: 1, noShadow: true, boilKey: 'hs' });
}

const STK = [
  // ---- row 1
  { br: 1, id: 'durga', h: 3.5, draw: t => { durga(450, 780, 24, { ...feel('gentle', t), ...DRG_SKIN, aura: 0, ...NS }); stkWord('JAI MATA DI', 846, 60, RED); } },
  { id: 'ram-darbar', h: 3.3, draw: t => { lakshman(225, 790, 24, { seed: 3, mouth: 'smile', ...NS }); parvati(675, 790, 25.5, { pal: SITA_PAL, ...SITA_SKIN, seed: 5, mouth: 'smile', ...NS });
      ram(450, 790, 24, { seed: 1, mouth: 'smile', handR: [3.6, -17.2], bendR: .8, ...NS }); stkWord('JAI SHREE RAM', 852, 62, SAFFRON); } },
  { id: 'chakra', h: 2.8, draw: t => stkChakra() },
  { id: 'lakshmi', h: 3.3, draw: t => { lakshmi(450, 770, 26, { eyes: 'normal', mouth: 'smile', coins: 1, ...NS }); stkWord('SHUBH LABH', 842, 58, GOLD); } },
  { id: 'narad', h: 3.3, draw: t => { narada(450, 740, 21, { cloud: 1, mouth: 'smile', strum: 1, seed: 1, ...NS }); stkWord('NARAYAN NARAYAN!', 842, 50, TEAL); } },
  { id: 'parshurama', flat: 1, h: 3.3, draw: t => { parshurama(450, 785, 23.5, { flip: 1, seed: 2, eyes: 'normal', mouth: 'smile', dhanush: 1, ...NS }); stkWord('JAI PARSHURAM', 850, 58, SAFFRON); } },
  { id: 'kalash', h: 2.6, draw: t => stkKalash() },
  { id: 'jai-mahakal', h: 1.9, draw: t => { boilSeed('stk mahakal');
      paint([[95, 440], [300, 425], [560, 432], [812, 422], [800, 520], [818, 612], [560, 600], [300, 612], [88, 600], [104, 520]], { wash: '#22305A', fill: '#141C3A', fillOp: 60, tex: .5, ink: '#141428', sw: 2, curv: .25 });
      { const O = [], I = [], R = 62, r = 54, ox = 30, oy = -18;   // a crescent: the outer disc less an offset inner one
        for (let k = 0; k < 48; k++) { const a = k / 48 * TAU, p = [Math.cos(a) * R, Math.sin(a) * R]; if (Math.hypot(p[0] - ox, p[1] - oy) > r) O.push(p); }
        for (let k = 0; k < 48; k++) { const a = k / 48 * TAU, p = [ox + Math.cos(a) * r, oy + Math.sin(a) * r]; if (Math.hypot(p[0], p[1]) < R) I.push(p); }
        const ang = p => Math.atan2(p[1] - oy, p[0] - ox), ang0 = p => Math.atan2(p[1], p[0]), mid = Math.atan2(-oy, -ox);
        const wrap = (a, m) => ((a - m + 3 * Math.PI) % TAU) - Math.PI;
        O.sort((a, b) => wrap(ang0(a), mid) - wrap(ang0(b), mid)); I.sort((a, b) => wrap(ang(b), mid) - wrap(ang(a), mid));
        push(); translate(452, 262); rotate(-.5); paint([...O, ...I], { wash: '#FFF0C0', fill: '#E6C874', fillOp: 60, ink: '#4A2A18', sw: 1.4, curv: .2 }); pop(); }
      stkWord('JAI', 372, 120, SAFFRON); stkWord('MAHAKAL', 552, 175, '#BFDFFF'); } },
  // ---- row 2
  { br: 1, id: 'bal-ganesha', h: 3.3, draw: t => { balBappa(430, 660, 31, { ...feel('proud', t), aR: .4, armR: u => modak(u * .4, u * .3, u * 1.3), ...NS }); stkWord('GANPATI BAPPA', 742, 58, SAFFRON, 430); stkWord('MORYA!', 808, 66, RED, 430); } },
  { id: 'bal-hanuman-sit', flat: 1, h: 3.1, draw: t => { balHanuman(450, 660, 36, { pose: 'sit', eyes: 'happy', mouth: 'grin', garland: 1, blush: .6, handL: [-2.3, -5.4], handR: [2.4, -5.0], handShapeL: 'open', handShapeR: 'open', ...NS }); stkWord('JAI BAJRANGBALI', 742, 58, SAFFRON); } },
  { id: 'bal-krishna', h: 3.1, draw: t => { balKrishna(410, 690, 34, { pose: 'sit', eyes: 'wink', mouth: 'giggle', blush: .8, handL: [-2.2, -5.2], handR: [2.4, -5.0], ...NS }); stkMatki(630, 706, 68); stkWord('MAKHAN CHOR', 790, 62, BLUE, 470); } },
  { id: 'shiva', h: 3.3, draw: t => { shiva(450, 750, 28, { ...SHV_SKIN, eyes: 'closed', mouth: 'smile', ganga: 1, ...NS }); stkWord('HAR HAR MAHADEV', 842, 54, BLUE); } },
  { id: 'kali', h: 3, draw: t => { kali(450, 770, 24, { ...feel('fierce', t), eyes: 'wide', tongueWag: .3, aura: 0, ...NS }); stkWord('JAI MAA KALI', 838, 58, RED); } },
  // ---- row 3
  { br: 1, id: 'vishnu-garuda', h: 2.9, draw: t => { const fly = { flap: .4, fly: true, pal: GARUDA_PAL, ring: false, hat: garudaCrown, brow: true }, s = 36;
      kamaParrot(470, 600, s, { ...fly, only: 'body' }); vishnu(...parrotSeat(470, 600, s, fly), 32, { lookX: .5 }); kamaParrot(470, 600, s, { ...fly, only: 'wing' }); } },
  { id: 'shailputri-nandi', h: 2.9, draw: t => { const n = { eyes: 'happy', ...NS }, s = nandiSeat(420, 780, 32, n); nandi(420, 780, 32, n); shailputri(s[0], s[1], 19, { ...feel('gentle', t), ...SHL_SKIN, sit: 1, hair: .5, ...NS }); } },
  { id: 'bal-hanuman-fly', flat: 1, h: 3.1, draw: t => { stkSun(705, 200, 105); balHanuman(380, 560, 27, { pose: 'fly', rot: .55, eyes: 'sparkle', mouth: 'open', mouthK: .6, tail: 'stream', handL: [-2.2, -11.5], handR: [2.0, -12.0], handShapeL: 'open', handShapeR: 'claw', ...NS }); } },
  { id: 'shiva-nandi', h: 3.3, draw: t => { const n = { eyes: 'happy', seed: 2, ...NS }, s = nandiSeat(400, 790, 30, n); nandi(400, 790, 30, n);
      shiva(s[0], s[1] + 8, 15.5, { ...SHV_SKIN, eyes: 'closed', mouth: 'smile', ...NS }); stkWord('BAM BAM BHOLE', 852, 64, BLUE); } },
  { id: 'shivling', h: 2.9, draw: t => { stkShivling(); stkWord('OM NAMAH SHIVAY', 800, 72, BLUE); } },
  { id: 'parvati-sher', h: 3.2, draw: t => { lion(560, 800, 27, { eyes: 'closed', mouth: 'smile', blush: .7, htilt: -.12, ...NS });
      parvati(300, 800, 25, { seed: 4, eyes: 'happy', mouth: 'smile', hx: .3, lean: 1.2, handR: [6.8, -17.6], bendR: -.6, ...NS }); } },
  // ---- row 4
  { br: 1, id: 'sher', h: 2.6, draw: t => lion(450, 700, 34, { eyes: 'happy', mouth: 'grin', blush: .6, ...NS }) },
  { id: 'kartikeya', h: 2.8, draw: t => kartikeya(450, 780, 30, { ...feel('proud', t), ...KAR_SKIN, aR: -.2, spearA: 0, ...NS }) },
  { id: 'nandi', h: 2.2, draw: t => nandi(430, 640, 34, { eyes: 'happy', seed: 1, ...NS }) },
  { id: 'bappa', h: 2.6, draw: t => bappa(450, 680, 30, { ...feel('happy', t), aL: .9, aR: .9, ...NS }) },
  { id: 'shani', h: 3.1, draw: t => { shani(410, 785, 23, { seed: 1, eyes: 'closed', pray: 1, mouth: 'smile', ...NS }); shaniCrow(640, 750, 15, { flip: true, look: -1 }); stkWord('JAI SHANI DEV', 850, 62, INDIGO); } },
  { id: 'ravana', h: 3, draw: t => ravana(432, 780, 22, { still: 1, ...NS }) },
  // ---- row 5
  { br: 1, id: 'bal-ganesha-stand', h: 2.5, draw: t => balBappa(450, 720, 30, { ...feel('happy', t), stand: 1, aL: .9, aR: .9, ...NS }) },
  { id: 'bal-hanuman-stand', flat: 1, h: 2.5, draw: t => balHanuman(450, 760, 32, { eyes: 'happy', mouth: 'grin', handL: [-2.0, -10.6], handShapeL: 'fist', handR: [4.0, -9.5], handShapeR: 'fist', bendR: 1, blush: .6, ...NS }) },
  { id: 'bal-krishna-stand', h: 2.5, draw: t => balKrishna(450, 780, 32, { eyes: 'innocent', mouth: 'pout', handL: [-.6, -7.4], handShapeL: 'open', aR: -1.2, seed: 2, ...NS }) },
  { id: 'hanuman-pray', flat: 1, h: 2.7, draw: t => hanuman(430, 850, 26, { seed: 3, pray: 1, bow: .2, eyes: 'closed', mouth: 'smile', ...NS }) },
  { id: 'hanuman-heart', flat: 1, h: 3, inset: { draw: stkHeartInset, at: STK_HEART_AT, src: [450, 435, 280, 270] }, draw: t => hanuman(450, 850, 27, { seed: 4, eyes: 'closed', mouth: 'smile', mala: false, handL: [-3.65, -13.8], handR: [3.65, -13.8], bendL: 1.4, bendR: 1.4, chest: stkHeart, ...NS }) },
  { id: 'hanuman-sindoor', flat: 1, h: 3, draw: t => hanuman(430, 850, 26, { seed: 2, sindoor: 1, gada: 1, eyes: 'happy', mouth: 'grin', ...NS }) },
  { id: 'bappa-writing', h: 2.6, draw: t => balBappa(450, 700, 32, { eyes: 'normal', lookY: .7, lookX: -.2, mouth: 'smile', broken: 1, held: stkPothi, aR: .1, armR: stkTuskPen, ...NS }) },
  { id: 'om', h: 1.5, draw: t => { boilSeed('om'); paint(ellPts(450, 450, 190, 190, 40, 1.5), { wash: SAFFRON, fill: '#D9621A', fillOp: 60, tex: .5, ink: '#4A2A18', sw: 1.4 }); paint(ellPts(450, 450, 160, 160, 36, 1), { ink: '#FFE9A8', sw: .9, br: 'inkfine' });
      letter('ॐ', 450, 462, 230, '#FFF5E2', { font: '230px "Tiro Devanagari Sanskrit"', stroke: '#4A2A18', sw: .06, ink: false }); } },
  // ---- row 6
  // ---- the eight added on 17 Nov
  { br: 1, id: 'hanuman-mountain', flat: 1, h: 3.4, draw: t => hanuman(360, 790, 20, { seed: 5, eyes: 'happy', mouth: 'grin', cloud: 1, tail: 'droop', handR: [7.6, -22.5], bendR: 1.3, armR: stkMountain,
      handL: [-3.4, -12.9], bendL: .9, armL: (u, sw) => gada(u * 1.05, sw, -.36, HNM.ink), ...NS }) },
  { id: 'swastik', h: 2, draw: t => stkSwastik() },
  { id: 'tilak', h: 1.7, draw: t => stkTilak() },
  { id: 'diya', h: 2.2, draw: t => stkDiya() },
  { id: 'temple-bell', h: 2.6, draw: t => stkBell() },
  { id: 'lakshmi-charan', h: 2.4, draw: t => stkCharan() },
  { id: 'saraswati-veena', h: 2.4, draw: t => stkVeena() },
  { id: 'damru', h: 2.2, draw: t => stkDamru() },
  { br: 1, id: 'owl', h: 2.2, draw: t => owl(450, 660, 40, { eyes: 'happy', mouth: 'grin', shades: 1, blush: .4, ...NS }) },
  { id: 'calf', h: 2.1, draw: t => cow(430, 640, 40, { calf: 1, coat: 'gauri', eyes: 'heart', tilak: 1, feather: 1, seed: 5, ...NS }) },
  { id: 'mooshak', h: 1.5, draw: t => { mooshak(400, 600, 40, { eyes: 'happy', mouth: 'smile' }); modak(585, 608, 78); } },
];

let STK_PAPER = false, STK_OVR = null;   // STK_OVR: draw this instead of the sticker (its inset)
window.LOOP = T => {
  const i = clamp(Math.floor(T), 0, STK.length - 1), s = STK[i];
  if (!STK_PAPER) { const c = paperG.drawingContext; c.fillStyle = '#fff'; c.fillRect(0, 0, W, H); STK_PAPER = true; }   // white, not paper: the border is the sticker
  image(paperG, 0, 0);
  BOILN = 7; boilSeed('sticker' + s.id);
  STK_FLAT = !!s.flat && !STK_OVR; camBegin(450, 450, W / 900); (STK_OVR || s.draw)(STK_T); camEnd(); STK_FLAT = false;
};
window.LOOP.len = STK.length;

// ---------- the cutter ----------
// Exact Euclidean distance (px) from every pixel to the nearest pixel where src is 1 (Felzenszwalb & Huttenlocher).
function stkDist(src, w, h) {
  const INF = 1e20, n = Math.max(w, h), f = new Float64Array(n), d = new Float64Array(n), v = new Int32Array(n), z = new Float64Array(n + 1), out = new Float32Array(w * h);
  const pass = len => {
    let k = 0; v[0] = 0; z[0] = -INF; z[1] = INF;
    for (let q = 1; q < len; q++) {
      let s; for (;;) { const p = v[k]; s = ((f[q] + q * q) - (f[p] + p * p)) / (2 * q - 2 * p); if (s <= z[k] && k > 0) k--; else break; }
      if (s <= z[k]) { v[k] = q; z[k + 1] = INF; } else { k++; v[k] = q; z[k] = s; z[k + 1] = INF; }
    }
    k = 0; for (let q = 0; q < len; q++) { while (z[k + 1] < q) k++; const p = v[k]; d[q] = (q - p) * (q - p) + f[p]; }
  };
  for (let x = 0; x < w; x++) { for (let y = 0; y < h; y++) f[y] = src[y * w + x] ? 0 : INF; pass(h); for (let y = 0; y < h; y++) out[y * w + x] = d[y]; }
  for (let y = 0; y < h; y++) { for (let x = 0; x < w; x++) f[x] = out[y * w + x]; pass(w); for (let x = 0; x < w; x++) out[y * w + x] = Math.sqrt(d[x]); }
  return out;
}
// The outline of a filled shape (in[] = 1 inside), walked along the pixel edges with the inside on the right, thinned
// and smoothed: a closed list of [x, y].
function stkTrace(ins, w, h) {
  let s = ins.indexOf(1); if (s < 0) return [];
  const at = (x, y) => x >= 0 && y >= 0 && x < w && y < h && ins[y * w + x] === 1;
  const x0 = s % w, y0 = Math.floor(s / w), DX = [1, 0, -1, 0], DY = [0, 1, 0, -1], P = [];
  let x = x0, y = y0, dir = 0, guard = 0;
  do {
    P.push([x, y]); x += DX[dir]; y += DY[dir];
    const R = [[x, y], [x - 1, y], [x - 1, y - 1], [x, y - 1]][dir], L = [[x, y - 1], [x, y], [x - 1, y], [x - 1, y - 1]][dir];
    if (at(L[0], L[1])) dir = (dir + 3) % 4; else if (!at(R[0], R[1])) dir = (dir + 1) % 4;
  } while ((x !== x0 || y !== y0 || dir !== 0) && ++guard < 4e6);
  let Q = P.filter((_, i) => i % 6 === 0);
  for (let r = 0; r < 3; r++) Q = Q.map((p, i) => { const a = Q[(i + Q.length - 1) % Q.length], b = Q[(i + 1) % Q.length]; return [(a[0] + 2 * p[0] + b[0]) / 4, (a[1] + 2 * p[1] + b[1]) / 4]; });
  return Q.map(([a, b]) => [Math.round(a * 10) / 10, Math.round(b * 10) / 10]);
}
// stickerAt(i, { dpi, border, smooth }): paint sticker i, scale it to its print size (STK[i].h inches tall at dpi, or
// .w inches wide), and cut it out: a white border `border` px wide round the art, its outline rounded (gaps narrower
// than 2 × (border + smooth) close up, so the cut line has no slits). Returns { id, png (RGBA: clear outside the
// cut), w, h, path (the cut line, px in the png), parts (separate pieces: should be 1), clipped (art at the canvas edge) }.
window.stickerAt = async (i, o = {}) => {
  const st = STK[i], dpi = o.dpi ?? 300, R = o.border ?? 30, S = o.smooth ?? 56, M = R + 6;
  // an inset (a close-up set into the art: Ram and Sita in Hanuman's heart) is painted first, on its own
  let ins = null;
  if (st.inset) { STK_OVR = st.inset.draw; T = i + .5; await redraw(); STK_OVR = null; ins = document.createElement('canvas'); ins.width = W; ins.height = H; ins.getContext('2d').drawImage(drawingContext.canvas, 0, 0, W, H); }
  T = i + .5; await redraw();
  const full = document.createElement('canvas'); full.width = W; full.height = H;
  const fc = full.getContext('2d', { willReadFrequently: true }); fc.fillStyle = '#fff'; fc.fillRect(0, 0, W, H); fc.drawImage(drawingContext.canvas, 0, 0, W, H);
  if (ins) {   // its src box (centre, half-width, half-height) cropped into the ellipse at (centre, radii), all in design px
    const z = W / 900, [cx, cy, rx, ry] = st.inset.at, [sx, sy, hw, hh] = st.inset.src;
    fc.save(); fc.beginPath(); fc.ellipse(cx * z, cy * z, rx * z, ry * z, 0, 0, TAU); fc.clip();
    fc.drawImage(ins, (sx - hw) * z, (sy - hh) * z, 2 * hw * z, 2 * hh * z, (cx - rx) * z, (cy - ry) * z, 2 * rx * z, 2 * ry * z); fc.restore();
    fc.beginPath(); fc.ellipse(cx * z, cy * z, rx * z, ry * z, 0, 0, TAU); fc.lineWidth = 2 * z; fc.strokeStyle = '#7A2A22'; fc.stroke();
  }
  const isInk = (d, p) => d[p + 3] > 20 && Math.min(d[p], d[p + 1], d[p + 2]) < 228;
  // the art's bounding box on the full canvas
  let fd = fc.getImageData(0, 0, W, H).data, bx0 = W, bx1 = -1, by0 = H, by1 = -1;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (isInk(fd, (y * W + x) * 4)) { if (x < bx0) bx0 = x; if (x > bx1) bx1 = x; if (y < by0) by0 = y; if (y > by1) by1 = y; }
  const clipped = bx0 <= 1 || by0 <= 1 || bx1 >= W - 2 || by1 >= H - 2, bw = bx1 - bx0 + 1, bh = by1 - by0 + 1;
  if (o.measure) return { id: st.id, h: st.w ? st.w * bh / bw : st.h, ar: bw / bh, px: bh, clipped };   // the art's size at scale 1 (inches tall, width / height)
  const K = o.k ?? STK_K, sc = Math.min(1.15, st.w ? st.w * K * dpi / bw : st.h * K * dpi / bh);
  // the art at print size, with room for the border
  const w = Math.ceil(bw * sc) + 2 * M, h = Math.ceil(bh * sc) + 2 * M, cv = document.createElement('canvas'); cv.width = w; cv.height = h;
  const c = cv.getContext('2d', { willReadFrequently: true }); c.fillStyle = '#fff'; c.fillRect(0, 0, w, h); c.imageSmoothingQuality = 'high';
  c.drawImage(full, bx0, by0, bw, bh, M, M, bw * sc, bh * sc);
  const id = c.getImageData(0, 0, w, h), d = id.data, n = w * h, ink = new Uint8Array(n);
  // near-white is white: the faint stains a watercolour fill leaves on white paper would print as dirt on the border
  for (let p = 0; p < n; p++) { ink[p] = isInk(d, p * 4) ? 1 : 0; if (!ink[p]) d[p * 4] = d[p * 4 + 1] = d[p * 4 + 2] = 255; }
  c.putImageData(id, 0, 0);
  return stkCut(st, cv, ink, w, h, R, S, clipped, sc);
};
function stkCut(st, cv, ink, w, h, R, S, clipped, sc) {
  // work on a canvas padded by S, so the grown shape never touches the edge
  const W2 = w + 2 * S, H2 = h + 2 * S, n2 = W2 * H2, src = new Uint8Array(n2);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) src[(y + S) * W2 + x + S] = ink[y * w + x];
  const d1 = stkDist(src, W2, H2), out = new Uint8Array(n2);
  for (let p = 0; p < n2; p++) out[p] = d1[p] > R + S ? 1 : 0;
  // holes: whatever "outside" the corner can't reach is inside
  const seen = new Uint8Array(n2), stack = [0]; seen[0] = 1;
  while (stack.length) { const p = stack.pop(), x = p % W2, y = (p - x) / W2; for (const [a, b] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) { if (a < 0 || b < 0 || a >= W2 || b >= H2) continue; const q = b * W2 + a; if (!seen[q] && out[q]) { seen[q] = 1; stack.push(q); } } }
  const d2 = stkDist(seen, W2, H2), c = cv.getContext('2d'), id = c.getImageData(0, 0, w, h), d = id.data, ins = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const v = d2[(y + S) * W2 + x + S] - S, p = y * w + x; d[p * 4 + 3] = Math.round(255 * clamp(v)); ins[p] = v > .5 ? 1 : 0; }
  c.putImageData(id, 0, 0);
  const path = stkTrace(ins, w, h);
  let area = 0; for (let i = 0; i < path.length; i++) { const a = path[i], b = path[(i + 1) % path.length]; area += a[0] * b[1] - b[0] * a[1]; }
  let fill = 0; for (let p = 0; p < ins.length; p++) fill += ins[p];
  return { id: st.id, br: st.br ? 1 : 0, png: cv.toDataURL('image/png'), w, h, path, parts: Math.abs(Math.abs(area) / 2 - fill) > fill * .03 ? 2 : 1, clipped, scale: sc };
}

// ---------- the sheet ----------
// sheetCompose(items, o): items = [{ png, x, y, w, h, path }] in sheet px. o.mode 'print' (white, art only), 'preview'
// (a coloured backing, soft shadows, the cut lines faint) or 'cut' (the cut lines alone). Returns a data URL.
window.sheetCompose = async (items, o = {}) => {
  const cv = document.createElement('canvas'); cv.width = o.w; cv.height = o.h; const c = cv.getContext('2d'), mode = o.mode || 'print';
  c.fillStyle = mode === 'preview' ? (o.backing || '#CFE0DC') : '#fff'; c.fillRect(0, 0, o.w, o.h);
  const imgs = await Promise.all(items.map(it => new Promise(r => { const im = new Image(); im.onload = () => r(im); im.src = it.png; })));
  const trace = it => { c.beginPath(); it.path.forEach(([x, y], k) => k ? c.lineTo(it.x + x, it.y + y) : c.moveTo(it.x + x, it.y + y)); c.closePath(); };
  items.forEach((it, k) => {
    if (mode === 'cut') { trace(it); c.strokeStyle = '#E6007E'; c.lineWidth = 3; c.stroke(); return; }
    if (mode === 'preview') { c.save(); c.shadowColor = 'rgba(30,50,48,.38)'; c.shadowBlur = 26; c.shadowOffsetY = 10; trace(it); c.fillStyle = '#fff'; c.fill(); c.restore(); }
    c.drawImage(imgs[k], it.x, it.y);
    if (mode === 'preview') { trace(it); c.strokeStyle = 'rgba(40,60,58,.22)'; c.lineWidth = 2; c.stroke(); }
  });
  if (o.scale && o.scale !== 1) { const s = document.createElement('canvas'); s.width = Math.round(o.w * o.scale); s.height = Math.round(o.h * o.scale); const x = s.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(cv, 0, 0, s.width, s.height); return s.toDataURL(o.type || 'image/jpeg', .92); }
  return cv.toDataURL(o.type || 'image/png', .92);
};
