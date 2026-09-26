// kartikeya.js: Kartikeya (Murugan) as a little boy, Bal Bappa's brother: tan skin, a black topknot with a peacock
// feather and a gold band, a peacock-teal dhoti, a red sash, his vel (spear) and a round shield. Built on Bal Bappa's
// proportions and glossy eyes so the brothers match. Load after bappa.js (U()) and clawd.js (eyes() / mouth() / emote(),
// so feel() and emotions() drive him too).
// (x, y) is the ground point between his feet; u is the size unit (about 19u tall to the top of the feather, 7u wide).
//
// Body-local coordinates in u (y up is negative):
//   feet (±1.4, -.5) · legs -2.9..-.7 · dhoti -6.2..-2.4 · chest centre (0, -7.6) · shoulders (±2.6, -8.7)
//   head centre (0, -12.4), 3 × 2.85 · eyes (±1.2, -12.2) · mouth (0, -10.8) · topknot (0, -16.2) · feather tip (1.7, -19.4)
//
// Options (all optional):
//   pose:   walk (phase: the feet step), dx, dy (in u), sq, rot, flip, hx (-1..1 head turn), htilt, aL, aR (arm angle:
//           0 = straight out, + = up, - = down; resting -1.3), cross 0..1 (arms folded), cover 0..1 (hands over the ears)
//   props:  spear (default true, in his right hand) + spearA (radians: 0 = straight up, + tips it to his right / screen
//           right), shield (default true, on his left arm), armL(u, sw) / armR(u, sw) (hooks at the hand, upright)
//   face:   eyes, mouth, lookX / lookY, squint, blush, seed, tint + tintK. 'normal' / 'look' / 'wide' are his own glossy
//           eyes with brows; every other kind is Clawd's.
//   extras: emote + emoteK + emoteAge, featherWob, boilKey, noShadow
const KAR = {
  skin: '#EDB48A', skinDk: '#CC8A5F', skinLt: '#FFD9B8', ink: '#4A2B1C',
  hair: '#2E2436', hairLt: '#524560', teal: '#2F9C94', tealDk: '#1E6F6C', tealLt: '#7FCDC3',
  gold: '#EDB43C', goldDk: '#B67D1C', sash: '#D2452F', sashDk: '#9E2E22', ash: '#FBF3E6', dot: '#D2452F',
  eye: '#2A1A12', brow: '#3A2A3A', blue: '#3767B8', green: '#5BAA4E', steel: '#DCE3EA', steelDk: '#9AA8B8',
};
const KAR_SKIN = { col: KAR.skin, dk: KAR.skinDk, lt: KAR.skinLt };

// Hand position (body-local u) for an arm angle; mirrors the arm drawing below.
function kartiArmA(o, s) { const a = s < 0 ? o.aL : o.aR; return a == null ? -1.3 : a; }
function kartiHandLocal(o, s) { const a = kartiArmA(o, s), L = 3.2; return [s * (2.6 + Math.cos(a) * L), -8.7 - Math.sin(a) * L]; }
// Where his hand is on screen (ignores rot)
function kartiHand(x, y, u, o, s) {
  const [hx, hy] = kartiHandLocal(o, s), sq = o.sq || 0;
  return [x + ((o.dx || 0) + hx * (o.flip ? -1 : 1) * (1 + sq * .6)) * u, y + (o.dy || 0) * u + hy * u * (1 - sq)];
}
// Where the spear's blade tip is on screen (ignores rot)
function kartiSpearTip(x, y, u, o) {
  const [hx, hy] = kartiHand(x, y, u, o, 1), a = o.spearA || 0, fx = o.flip ? -1 : 1, sq = o.sq || 0;
  return [hx + fx * Math.sin(a) * 7.4 * u * (1 + sq * .6), hy - Math.cos(a) * 7.4 * u * (1 - sq)];
}

function vel(u, sw, a, INK = KAR.ink) {   // the spear, held at (0, 0): shaft 3u below the hand, 6u above, then the leaf blade
  push(); rotate(a);
  paint(ribbon(U([[0, 3], [0, -6.1]], u), .36 * u, .3 * u), { wash: KAR.goldDk, fill: KAR.gold, fillOp: 50, tex: .4, ink: INK, sw: sw * .6 });
  paint(U([[0, -5.9], [.75, -6.7], [.6, -7.6], [0, -8.5], [-.6, -7.6], [-.75, -6.7]], u), { wash: KAR.steel, fill: KAR.steelDk, fillOp: 60, tex: .4, ink: INK, sw: sw * .7, curv: .4 });
  inkLine(U([[0, -6.1], [0, -8.1]], u), sw * .45, KAR.steelDk, 'inkfine', 0);
  paint(ellPts(0, -5.9 * u, .45 * u, .28 * u, 10), { wash: KAR.gold, ink: INK, sw: sw * .5 });
  pop();
}
function kartiShield(u, sw, INK = KAR.ink) {   // round, held at (0, 0) in front of the hand
  paint(ellPts(0, 0, 1.95 * u, 1.95 * u, 24, u * .03), { wash: KAR.gold, fill: KAR.goldDk, fillOp: 60, tex: .5, ink: INK, sw: sw * .8 });
  paint(ellPts(0, 0, 1.55 * u, 1.55 * u, 22, u * .02), { wash: KAR.sash, fill: KAR.sashDk, fillOp: 60, tex: .5, ink: INK, sw: sw * .5 });
  paint(ellPts(0, .05 * u, .85 * u, 1.05 * u, 16), { wash: KAR.green, ink: null });   // a peacock-feather eye
  paint(ellPts(0, .1 * u, .55 * u, .7 * u, 14), { wash: KAR.teal, ink: null });
  paint(ellPts(0, .15 * u, .28 * u, .36 * u, 10), { wash: KAR.blue, ink: null });
  for (let k = 0; k < 8; k++) { const a = k / 8 * TAU; paint(ellPts(Math.cos(a) * 1.75 * u, Math.sin(a) * 1.75 * u, .13 * u, .13 * u, 8), { wash: KAR.goldDk, ink: null }); }
}

function kartikeya(x, y, u, o = {}) {
  const id = o.boilKey ?? 'k' + (++CLAWD_N), rs = p => boilSeed(`karti ${id} ${p}`);
  x += (o.dx || 0) * u;
  const dy = (o.dy || 0) * u, sq = (o.sq || 0) + (o.take || 0), sw = clamp(u / 20, .4, 2) * (o.swMul || 1), J = u * .05;
  const { col, dk, lt } = tintCols({ ...o, col: o.col || KAR.skin, dk: o.dk || KAR.skinDk, lt: o.lt || KAR.skinLt });
  const P = pts => U(pts, u), INK = KAR.ink, wk = o.walk, hx = clamp(o.hx || 0, -1, 1);

  if (!o.noShadow) { rs('shadow'); const f = 1 - Math.min(.5, Math.abs(o.dy || 0) * .05); paint(ellPts(x, y + u * .1, u * 4 * f, u * .85 * f, 22), { fill: PAL.ink, fillOp: 80, bleed: .25, tex: .3, border: .1, ink: null }); }
  push();
  translate(x, y + dy);
  if (o.rot) rotate(o.rot);
  scale((o.flip ? -1 : 1) * (1 + sq * .6), 1 - sq);

  // ---- the feather behind the head, then legs, dhoti, chest
  rs('feather');
  const fw = (o.featherWob || 0) + Math.sin(T * 2.2) * .06;
  push(); translate((hx * .5 + .2) * u, -16.6 * u); rotate(.25 + fw);
  inkLine(P([[0, 0], [.1, -1.2], [.05, -2.4]]), sw * .6, KAR.ink, 'inkfine', .5);
  paint(ellPts(0, -2.9 * u, .85 * u, 1.25 * u, 16, J), { wash: KAR.tealLt, fill: KAR.green, fillOp: 60, tex: .5, ink: INK, sw: sw * .5 });
  paint(ellPts(0, -3 * u, .5 * u, .7 * u, 12), { wash: KAR.teal, ink: null });
  paint(ellPts(0, -3 * u, .25 * u, .35 * u, 10), { wash: KAR.blue, ink: null });
  for (const s of [-1, 1]) for (const k of [.6, 1.3, 2]) inkLine(P([[0, -k], [s * .45, -k - .35]]), sw * .35, KAR.green, 'inkfine', 0);   // barbs
  pop();

  rs('legs');
  for (const s of [-1, 1]) {
    const l = wk == null ? 0 : Math.max(0, Math.sin((wk + (s < 0 ? 0 : .5)) * TAU)) * .7, cx = s * 1.3;
    paint(P([[cx - .85, -2.9], [cx + .85, -2.9], [cx + .8, -.75 - l], [cx - .8, -.75 - l]]), { wash: col, fill: dk, fillOp: 50, tex: .5, ink: INK, sw: sw * .85 });
    inkLine(P([[cx - .8, -1.55 - l], [cx + .8, -1.55 - l]]), sw * 1.1, KAR.gold, 'ink', 0);   // anklet
    paint(ellPts((cx + s * .1) * u, (-.5 - l) * u, 1.1 * u, .55 * u, 16, J), { wash: col, fill: dk, fillOp: 40, tex: .5, ink: INK, sw: sw * .8 });
  }
  rs('dhoti');
  paint(P([[-2.4, -6.3], [2.4, -6.3], [2.8, -4.3], [3, -2.5], [.4, -2.3], [0, -3.3], [-.4, -2.3], [-3, -2.5], [-2.8, -4.3]]),
    { wash: KAR.teal, fill: KAR.tealDk, fillOp: 80, bleed: .06, tex: .7, border: .5, ink: INK, sw: sw * .9, curv: .25 });
  for (const s of [-1, 1]) inkLine(P([[s * .45, -2.55], [s * 1.7, -2.6], [s * 2.85, -2.75]]), sw * 1.3, KAR.gold, 'ink', .4);   // gold hem
  inkLine(P([[0, -5.8], [-.2, -4.4], [0, -3.4]]), sw * .5, KAR.tealDk, 'inkfine', .5);   // pleat
  inkLine(P([[-2.2, -4.2], [-1.2, -3.3]]), sw * .45, KAR.tealDk, 'inkfine', .4);
  rs('chest');
  const chest = ellPts(0, -7.7 * u, 2.55 * u, 2.1 * u, 26, J);
  paint(chest, { wash: col, ink: null });
  paint(ellPts(-.8 * u, -8.3 * u, 1.3 * u, .8 * u, 14, J * 2, -.3), { fill: lt, fillOp: 130, bleed: .2, tex: .8, border: .8, ink: null });
  paint(chest, { ink: INK, sw });
  paint(rrPts(-2.5 * u, -6.65 * u, 5 * u, .75 * u, .3 * u, J), { wash: KAR.gold, fill: KAR.goldDk, fillOp: 60, tex: .5, ink: INK, sw: sw * .7 });   // waistband
  paint(ribbon(P([[-2.1, -9.4], [-.6, -8.3], [.9, -7.2], [2.3, -6.4]]), .75 * u, .65 * u), { wash: KAR.sash, fill: KAR.sashDk, fillOp: 60, tex: .5, ink: INK, sw: sw * .6 });
  inkLine(P([[-1.6, -9.35], [0, -8.55], [1.6, -9.35]]), sw * 1.4, KAR.gold, 'ink', .6);   // necklace
  paint(ellPts(0, -8.45 * u, .28 * u, .28 * u, 8), { wash: KAR.sash, ink: INK, sw: sw * .4 });

  // ---- arms (angles like Bal Bappa's), with the shield and the spear
  const cross = clamp(o.cross || 0), cover = clamp(o.cover || 0);
  const drawArm = s => {
    rs('arm' + s);
    const a = kartiArmA(o, s), L = 3.2 * u, ex = s * Math.cos(a) * L, ey = -Math.sin(a) * L, hook = s < 0 ? o.armL : o.armR;
    push(); translate(s * 2.6 * u, -8.7 * u);
    const nx = -ey / L * .25 * u * s, ny = ex / L * .25 * u * s;
    if (s > 0 && o.spear !== false) { push(); translate(ex, ey); vel(u, sw, o.spearA || 0, INK); pop(); }
    paint(ribbon([[0, 0], [ex * .5 + nx, ey * .5 + ny], [ex, ey]], 1.15 * u, .9 * u), { wash: col, fill: dk, fillOp: 40, tex: .5, ink: INK, sw: sw * .85 });
    inkLine([[ex * .3 - ny * 1.6, ey * .3 + nx * 1.6], [ex * .3 + ny * 1.6, ey * .3 - nx * 1.6]], sw * 1.3, KAR.gold, 'ink', 0);   // armlet
    push(); translate(ex, ey);
    paint(ellPts(0, 0, .72 * u, .66 * u, 14, J), { wash: col, ink: INK, sw: sw * .8 });
    if (s < 0 && o.shield !== false) kartiShield(u, sw, INK);
    if (hook) hook(u, sw);
    pop(); pop();
  };
  if (cover > .5) {   // hands clapped over his ears
    rs('cover');
    for (const s of [-1, 1]) {
      paint(ribbon(P([[s * 2.6, -8.7], [s * 3.9, -10.2], [s * 3.2, -12.1]]), 1.15 * u, .9 * u), { wash: col, fill: dk, fillOp: 40, tex: .5, ink: INK, sw: sw * .85 });
    }
  } else if (cross > .5) {
    rs('cross');
    paint(ribbon(P([[-2.5, -8.8], [-1.8, -7.6], [0, -7.2], [1.6, -7.5]]), 1.15 * u, .95 * u), { wash: col, fill: dk, fillOp: 50, tex: .5, ink: INK, sw: sw * .85 });
    paint(ribbon(P([[2.5, -8.8], [1.9, -8.2], [0, -8.1], [-1.6, -8.4]]), 1.15 * u, .95 * u), { wash: col, fill: dk, fillOp: 30, tex: .5, ink: INK, sw: sw * .85 });
  } else drawArm(-1);

  // ---- head
  push(); translate(hx * .5 * u, 0);
  if (o.htilt) { translate(0, -10 * u); rotate(o.htilt); translate(0, 10 * u); }
  rs('ears');
  for (const s of [-1, 1]) { paint(ellPts(s * 2.95 * u, -12.2 * u, .6 * u, .85 * u, 12, J), { wash: col, fill: dk, fillOp: 60, tex: .5, ink: INK, sw: sw * .7 }); paint(ellPts(s * 3 * u, -11.4 * u, .22 * u, .22 * u, 8), { wash: KAR.gold, ink: INK, sw: sw * .4 }); }
  rs('topknot');
  paint(ellPts(0, -16.1 * u, 1.2 * u, 1 * u, 16, J), { wash: KAR.hair, ink: INK, sw: sw * .8 });
  inkLine(P([[-.7, -16.3], [0, -16.8], [.7, -16.2]]), sw * .45, KAR.hairLt, 'inkfine', .5);
  paint(rrPts(-1.05 * u, -15.5 * u, 2.1 * u, .5 * u, .2 * u), { wash: KAR.gold, ink: INK, sw: sw * .5 });
  rs('head');
  const head = ellPts(0, -12.4 * u, 3 * u, 2.85 * u, 30, J);
  paint(head, { wash: col, ink: null });
  paint(ellPts((-1.1 + hx) * u, -13.5 * u, 1.6 * u, .9 * u, 16, J * 2, -.2), { fill: lt, fillOp: 130, bleed: .2, tex: .85, border: .8, ink: null });
  paint(ellPts(0, -10.2 * u, 2.3 * u, .8 * u, 16, J), { fill: dk, fillOp: 60, bleed: .1, tex: .6, border: .5, ink: null });
  paint(head, { ink: INK, sw });
  rs('hair');
  paint(P([[-3.05, -11.8], [-3.25, -13.5], [-2.6, -14.9], [-1.1, -15.5], [0, -15.45], [1.1, -15.5], [2.6, -14.9], [3.25, -13.5], [3.05, -11.8], [2.65, -12.9], [1.9, -13.9], [.7, -14.2], [.1, -13.8], [-.7, -14.3], [-1.9, -14], [-2.65, -12.9]]),
    { wash: KAR.hair, ink: INK, sw: sw * .85, curv: .4 });
  inkLine(P([[-2.3, -14.5], [-1, -15], [.4, -14.9]]), sw * .45, KAR.hairLt, 'inkfine', .5);
  paint(ribbon(P([[-2.9, -13.6], [-1.5, -14.55], [0, -14.75], [1.5, -14.55], [2.9, -13.6]]), .42 * u, .42 * u), { wash: KAR.gold, fill: KAR.goldDk, fillOp: 50, tex: .4, ink: INK, sw: sw * .5 });   // band
  paint(ellPts(0, -14.72 * u, .3 * u, .36 * u, 10), { wash: KAR.sash, ink: INK, sw: sw * .4 });

  push(); translate(hx * .9 * u, 0);
  rs('tilak');
  for (const yy of [-13.55, -13.25]) inkLine(P([[-.9, yy], [0, yy - .06], [.9, yy]]), sw * .8, KAR.ash, 'ink', .5);
  paint(ellPts(0, -13.1 * u, .16 * u, .16 * u, 8), { wash: KAR.dot, ink: null });
  if (o.blush) for (const s of [-1, 1]) paint(ellPts(s * 1.9 * u, -11.2 * u, .7 * u, .38 * u, 14), { fill: PAL.rose, fillOp: 150 * clamp(o.blush), bleed: .2, tex: .4, ink: null });
  rs('eyes');
  const kinds = Array.isArray(o.eyes) ? o.eyes : [o.eyes || 'normal', o.eyes || 'normal'];
  if (kinds.every(k => ['normal', 'look', 'wide'].includes(k)) && !o.squint) {
    const lx = (o.lookX || 0) * u * .22, ly = (o.lookY || 0) * u * .18, wide = kinds[0] === 'wide';
    const blink = !wide && ((T * .9 + (o.seed || 0) * 1.7 + .8) % 3.3) < .12;
    for (const s of [-1, 1]) {
      const ex = s * 1.2 * u, ey = -12.2 * u;
      inkLine(P([[s * .75, -13 - (wide ? .35 : 0)], [s * 1.2, -13.2 - (wide ? .35 : 0)], [s * 1.7, -13.05 - (wide ? .3 : 0)]]), sw * .7, KAR.brow, 'inkfine', .5);
      if (blink) { inkLine([[ex - .4 * u, ey + .1 * u], [ex + .4 * u, ey + .1 * u]], sw * 1.1, KAR.eye, 'ink', .3); continue; }
      if (wide) paint(ellPts(ex, ey, .6 * u, .72 * u, 16), { wash: PAL.cream, ink: INK, sw: sw * .5 });
      paint(ellPts(ex + lx, ey + ly, (wide ? .32 : .38) * u, (wide ? .4 : .5) * u, 16), { wash: KAR.eye, ink: null });
      paint(ellPts(ex + lx - .12 * u, ey + ly - .18 * u, .14 * u, .16 * u, 10), { wash: PAL.cream, washOp: 240, ink: null });
      paint(ellPts(ex + lx + .12 * u, ey + ly + .2 * u, .06 * u, .06 * u, 8), { wash: PAL.cream, washOp: 200, ink: null });
    }
  } else { push(); translate(0, -12.2 * u); scale(.52); translate(0, 6 * u); eyes(u, o, sw / .52 * .85, [-1, 1], 0); pop(); }
  rs('nose');
  inkLine(P([[-.05, -11.55], [.12, -11.3], [-.05, -11.2]]), sw * .5, KAR.skinDk, 'inkfine', .5);
  rs('mouth');
  push(); translate(0, -10.75 * u); scale(.42); translate(0, 4.3 * u); mouth(u, o.mouth, sw / .42 * .8); pop();
  pop();
  pop();

  if (cover <= .5 && cross <= .5) drawArm(1);
  pop();

  if (o.emote) {
    rs('emote');
    const top = EMOTE_TOP.includes(o.emote), dir = o.flip ? -1 : 1;
    emote(o.emote, top ? x : x + dir * 5 * u, y + dy + (top ? -19.5 : -15) * u * (1 - sq), u * 1.05, o.emoteK ?? 1, o.emoteAge ?? T);
  }
  rs('after');
}

// Model sheet: studio.html?loop=kartikeya, or node render.mjs --loop=kartikeya --sheet=0.5 --cols=1 --w=1080
(() => {
  LOOPS.kartikeya = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: PAL.paper, ink: null });
    const cells = [
      ['neutral', {}], ['determined', { aR: 1.2, aL: -.2, spearA: -.3 }], ['proud', { aR: -.2, spearA: 0 }],
      ['shy', { cross: 1 }], ['scared', { cover: 1 }], ['surprised', { walk: t * 1.5 }],
      ['starstruck', {}], ['confused', { spearA: .4 }], ['love', { aL: .9, aR: .9 }],
    ];
    cells.forEach(([name, over], i) => {
      const cx = 180 + (i % 3) * 360, gy = 640 + Math.floor(i / 3) * 560;
      kartikeya(cx, gy, 22, { ...feel(name, t + i * .3, { seed: i }), ...KAR_SKIN, ...over });
    });
  };
  LOOPS.kartikeya.len = 4;
})();
