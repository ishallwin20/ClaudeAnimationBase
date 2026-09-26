// parvati.js: Parvati Maa, standing: a red saree with a gold border, a green blouse, the pallu over her left shoulder,
// a long braid, a small gold mukut, bindi and sindoor, jhumkas, a nath and green-and-gold bangles.
// Load after bappa.js (U()) and clawd.js (eyes() / mouth() / emote(), so feel() and emotions() drive her too).
// (x, y) is the ground point under her; u is the size unit (about 25.5u tall to the top of the mukut, 9u wide at the hem).
//
// Body-local coordinates in u (y up is negative):
//   hem -1.2..0, out to ±4.5 · waist -11.8 · blouse -16.6..-13.6 · shoulders (±2.6, -16.2) · head centre (0, -19.8),
//   2.8 × 2.7 · eyes (±1.1, -19.7) · mouth (0, -18.35) · mukut -24..-22.3 (the head is then scaled 1.18× about
//   the neck at (0, -17.6), so on screen the eyes sit at -20.1 and the mukut tops out near -25.4)
//
// Options (all optional):
//   pose:   walk (phase: the hem swings and the feet peek), dx, dy (in u), sq, rot, flip, hx (-1..1 head turn), htilt,
//           lean (u: the upper body leans sideways, e.g. to offer something)
//   arms:   handL / handR = [x, y] in u (default hanging relaxed), bendL / bendR, armL(u, sw) / armR(u, sw) (upright hooks)
//   face:   eyes, mouth, lookX / lookY, squint, blush, seed, tint + tintK. 'normal' / 'look' / 'wide' are her own almond
//           eyes with lashes, 'closed' and 'wink' her own lids; every other kind is Clawd's.
//   extras: emote + emoteK + emoteAge, boilKey, noShadow
const PRV = {
  skin: '#F2BE98', skinDk: '#D69470', skinLt: '#FFE0C8', ink: '#4A2530',
  saree: '#C8324A', sareeDk: '#962338', sareeLt: '#E8697A', gold: '#EDB43C', goldDk: '#B67D1C', goldLt: '#FFE39A',
  blouse: '#3E8E6A', blouseDk: '#2A6A4E', hair: '#2A2030', hairLt: '#4E4058', sindoor: '#D2283A',
  eye: '#2A1A1E', white: '#FFF8EC', bangle: '#3E9E5A', lip: '#C8505E',
};
const PRV_SKIN = { col: PRV.skin, dk: PRV.skinDk, lt: PRV.skinLt };

function parvatiArm(o, s) {
  const sh = [s * 2.6, -16.2];
  const ha = (s < 0 ? o.handL : o.handR) || [s * 3.3, -11.2];
  const dx = ha[0] - sh[0], dy = ha[1] - sh[1], d = Math.hypot(dx, dy) || 1;
  let nx = -dy / d, ny = dx / d; if (nx * s < 0) { nx = -nx; ny = -ny; }
  const b = (s < 0 ? o.bendL : o.bendR) ?? 1;
  return [sh, [(sh[0] + ha[0]) / 2 + nx * b, (sh[1] + ha[1]) / 2 + ny * b], ha];
}
function parvatiHand(x, y, u, o, s) {
  const [, , h] = parvatiArm({ ...o, lean: 0 }, s), sq = o.sq || 0, fx = o.flip ? -1 : 1, l = o.lean || 0, r = l * .035;
  // the upper body is drawn leaned: about the waist, rotated by lean * .035 and shifted by lean * .6
  const px = h[0] + l * .6, py = h[1] + 11.8, hx = px * Math.cos(r) - py * Math.sin(r), hy = px * Math.sin(r) + py * Math.cos(r) - 11.8;
  return [x + (o.dx || 0) * u + fx * hx * u * (1 + sq * .6), y + (o.dy || 0) * u + hy * u * (1 - sq)];
}

function parvati(x, y, u, o = {}) {
  const id = o.boilKey ?? 'p' + (++CLAWD_N), rs = p => boilSeed(`parvati ${id} ${p}`);
  x += (o.dx || 0) * u;
  const dy = (o.dy || 0) * u, sq = (o.sq || 0) + (o.take || 0), sw = clamp(u / 20, .4, 2) * (o.swMul || 1), J = u * .04;
  const { col, dk, lt } = tintCols({ ...o, col: o.col || PRV.skin, dk: o.dk || PRV.skinDk, lt: o.lt || PRV.skinLt });
  const P = pts => U(pts, u), INK = PRV.ink, wk = o.walk, hx = clamp(o.hx || 0, -1, 1), lean = o.lean || 0;
  const hs = wk == null ? 0 : Math.sin(wk * TAU) * .35;   // hem swing

  if (!o.noShadow) { rs('shadow'); paint(ellPts(x, y + u * .1, u * 5 * (1 - Math.min(.5, Math.abs(o.dy || 0) * .05)), u * .95, 22), { fill: PAL.ink, fillOp: 80, bleed: .25, tex: .3, border: .1, ink: null }); }
  push();
  translate(x, y + dy);
  if (o.rot) rotate(o.rot);
  scale((o.flip ? -1 : 1) * (1 + sq * .6), 1 - sq);
  const headScale = () => { translate(0, -17.6 * u); scale(1.18); translate(0, 17.6 * u); };   // a big chibi head, like the rest of the family
  const upper = f => { push(); translate(0, -11.8 * u); rotate(lean * .035); translate(lean * .6 * u, 11.8 * u); f(); pop(); };

  // ---- behind: back hair and the braid, and the pallu falling behind her left shoulder
  upper(() => {
    rs('backhair');
    push(); translate(hx * .4 * u, 0); headScale();
    paint(ellPts(0, -20.1 * u, 3.25 * u, 3.1 * u, 26, J), { wash: PRV.hair, ink: INK, sw: sw * .8 });
    const bs = Math.sin(T * 1.6) * .25 + hs * .5;
    const braid = [[-1.4, -18.5], [-2.9, -16.4], [-3.4 + bs * .4, -13.5], [-3.5 + bs, -10.6]];
    paint(ribbon(P(braid), 1.2 * u, .7 * u), { wash: PRV.hair, ink: INK, sw: sw * .7 });
    const C = through(P(braid)); for (let k = 2; k < C.length - 1; k += 2) { const [bx, by] = C[k]; inkLine([[bx - .45 * u, by - .2 * u], [bx + .2 * u, by + .3 * u]], sw * .5, PRV.hairLt, 'inkfine', .4); }
    paint(ellPts((-3.5 + bs) * u, -10.1 * u, .45 * u, .6 * u, 10), { wash: PRV.gold, ink: INK, sw: sw * .5 });   // tassel
    pop();
    rs('pallback');
    paint(ribbon(P([[-2.6, -16.4], [-3.5, -14], [-3.9 + hs * .3, -11], [-4.2 + hs * .6, -8.2]]), 2 * u, 1.9 * u), { wash: PRV.saree, fill: PRV.sareeDk, fillOp: 90, tex: .6, ink: INK, sw: sw * .75 });
    inkLine(P([[-3.3, -16], [-4.3, -13.5], [-4.8 + hs * .3, -11], [-5.1 + hs * .6, -8.4]]), sw * 1.6, PRV.gold, 'ink', .5);
  });

  // ---- feet under the hem, the skirt with its pleats and border
  rs('feet');
  for (const s of [-1, 1]) {
    const l = wk == null ? 0 : Math.max(0, Math.sin((wk + (s < 0 ? 0 : .5)) * TAU)) * .5;
    paint(ellPts((s * 1.1 + (wk == null ? 0 : s * l * .3)) * u, (-.25 - l) * u, .95 * u, .45 * u, 14, J), { wash: col, fill: dk, fillOp: 50, tex: .5, ink: INK, sw: sw * .7 });
    inkLine(P([[s * 1.1 - .6, -.45 - l], [s * 1.1 + .6, -.45 - l]]), sw * .9, PRV.gold, 'ink', 0);   // anklet
  }
  rs('skirt');
  const skirt = P([[-2.2, -11.9], [2.2, -11.9], [2.9, -8.5], [3.7, -4.6], [4.3 + hs * .4, -1.5], [4.6 + hs, -.5], [2.6 + hs * .5, -.35], [0, -.3], [-2.6 + hs * .5, -.35], [-4.6 + hs, -.5], [-4.3 + hs * .4, -1.5], [-3.7, -4.6], [-2.9, -8.5]]);
  paint(skirt, { wash: PRV.saree, fill: PRV.sareeDk, fillOp: 90, bleed: .06, tex: .7, border: .5, ink: INK, sw: sw * .9, curv: .3 });
  paint(ribbon(P([[-4.5 + hs, -1.05], [-2.2 + hs * .5, -.9], [0, -.85], [2.2 + hs * .5, -.9], [4.5 + hs, -1.05]]), .75 * u, .75 * u), { wash: PRV.gold, fill: PRV.goldDk, fillOp: 50, tex: .5, ink: null });
  for (const k of [-.5, .1, .6]) inkLine(P([[k * .6, -10.5], [k * 1.2 + hs * .3, -5.5], [k * 1.8 + hs * .5, -1.5]]), sw * .5, PRV.sareeDk, 'inkfine', .5);   // pleats
  for (let k = 0; k < 6; k++) { const bx = lerp(-3.4, 3.6, (k + .5) / 6) + hs * .5; paint(ellPts(bx * u, -2.3 * u, .22 * u, .22 * u, 8), { wash: PRV.gold, ink: null }); }   // butis

  upper(() => {
    // ---- torso: midriff, blouse, the pallu across the chest, necklace
    rs('torso');
    paint(P([[-2.3, -16.6], [2.3, -16.6], [2.4, -14], [2.1, -11.6], [-2.1, -11.6], [-2.4, -14]]), { wash: col, ink: INK, sw: sw * .8, curv: .3 });
    paint(P([[-2.6, -16.8], [2.6, -16.8], [2.55, -14.6], [1.9, -13.7], [-1.9, -13.7], [-2.55, -14.6]]), { wash: PRV.blouse, fill: PRV.blouseDk, fillOp: 70, tex: .6, ink: INK, sw: sw * .8, curv: .3 });
    inkLine(P([[-.4, -12.6], [0, -12.4], [.4, -12.6]]), sw * .45, INK, 'inkfine', .5);   // navel
    rs('pallu');
    paint(ribbon(P([[2.3, -11.2], [1.4, -12.8], [-.2, -14.6], [-1.8, -16.3], [-2.7, -16.9]]), 2.2 * u, 1.6 * u), { wash: PRV.saree, fill: PRV.sareeDk, fillOp: 60, tex: .6, ink: INK, sw: sw * .8 });
    inkLine(P([[3, -11.7], [2.1, -13.3], [.5, -15.2], [-1, -16.8], [-1.8, -17.4]]), sw * 1.5, PRV.gold, 'ink', .5);
    for (const [bx, by] of [[1.4, -12.7], [0, -14.4], [-1.5, -16]]) paint(ellPts(bx * u, by * u, .2 * u, .2 * u, 8), { wash: PRV.gold, ink: null });
    rs('neck');
    paint(P([[-.75, -17.9], [.75, -17.9], [.8, -16.7], [-.8, -16.7]]), { wash: col, fill: dk, fillOp: 50, tex: .5, ink: INK, sw: sw * .6 });
    inkLine(P([[-1.5, -17], [-.7, -16.1], [0, -15.85], [.7, -16.1], [1.5, -17]]), sw * 1.6, PRV.gold, 'ink', .6);
    paint(P([[0, -15.95], [.35, -15.6], [0, -15.05], [-.35, -15.6]]), { wash: PRV.saree, ink: INK, sw: sw * .4 });

    // ---- head
    push(); translate(hx * .45 * u, 0); headScale();
    if (o.htilt) { translate(0, -17.5 * u); rotate(o.htilt); translate(0, 17.5 * u); }
    rs('head');
    const head = ellPts(0, -19.8 * u, 2.8 * u, 2.75 * u, 30, J);
    paint(head, { wash: col, ink: null });
    paint(ellPts((-1 + hx) * u, -20.8 * u, 1.5 * u, .8 * u, 14, J * 2, -.2), { fill: lt, fillOp: 130, bleed: .2, tex: .85, border: .8, ink: null });
    paint(ellPts(0, -17.7 * u, 2 * u, .7 * u, 14, J), { fill: dk, fillOp: 60, bleed: .1, tex: .6, border: .5, ink: null });
    paint(head, { ink: INK, sw });
    rs('jhumka');
    for (const s of [-1, 1]) {
      push(); translate(s * 2.75 * u, -19 * u); rotate(Math.sin(T * 2.4 + s) * .12);
      inkLine([[0, 0], [0, .5 * u]], sw * .5, PRV.goldDk, 'inkfine', 0);
      paint(U([[-.45, 1.2], [0, .45], [.45, 1.2]], u), { wash: PRV.gold, fill: PRV.goldDk, fillOp: 50, ink: INK, sw: sw * .45, curv: .5 });
      for (const k of [-.3, 0, .3]) paint(ellPts(k * u, 1.35 * u, .1 * u, .1 * u, 6), { wash: PRV.goldLt, ink: null });
      pop();
    }
    rs('hairfront');
    paint(P([[-2.85, -19.2], [-3, -21], [-2.2, -22.3], [-.6, -22.75], [0, -22.3], [.6, -22.75], [2.2, -22.3], [3, -21], [2.85, -19.2], [2.35, -20.6], [1.3, -21.55], [.15, -21.55], [0, -21.9], [-.15, -21.55], [-1.3, -21.55], [-2.35, -20.6]]),
      { wash: PRV.hair, ink: INK, sw: sw * .85, curv: .4 });
    inkLine(P([[-2.2, -21.6], [-1.2, -22.3], [-.3, -22.4]]), sw * .45, PRV.hairLt, 'inkfine', .5);
    inkLine(P([[0, -22.4], [0, -21.7]]), sw * 1.1, PRV.sindoor, 'ink', 0);   // sindoor in the parting
    rs('mukut');
    paint(P([[-1.7, -22.5], [1.7, -22.5], [1.3, -23.4], [.7, -23.3], [0, -24.2], [-.7, -23.3], [-1.3, -23.4]]), { wash: PRV.gold, fill: PRV.goldDk, fillOp: 60, tex: .5, ink: INK, sw: sw * .6, curv: .15 });
    paint(ellPts(0, -23.1 * u, .25 * u, .3 * u, 8), { wash: PRV.saree, ink: INK, sw: sw * .35 });
    inkLine(P([[0, -22], [0, -21.25]]), sw * .6, PRV.goldDk, 'inkfine', 0);   // maang tikka
    paint(ellPts(0, -21.05 * u, .2 * u, .24 * u, 8), { wash: PRV.gold, ink: INK, sw: sw * .35 });

    push(); translate(hx * .8 * u, 0);
    rs('bindi');
    paint(ellPts(0, -20.55 * u, .17 * u, .17 * u, 8), { wash: PRV.sindoor, ink: null });
    if (o.blush) for (const s of [-1, 1]) paint(ellPts(s * 1.75 * u, -18.7 * u, .65 * u, .35 * u, 14), { fill: PAL.rose, fillOp: 150 * clamp(o.blush), bleed: .2, tex: .4, ink: null });
    rs('eyes');
    const kinds = Array.isArray(o.eyes) ? o.eyes : o.eyes === 'wink' ? ['normal', 'closed'] : [o.eyes || 'normal', o.eyes || 'normal'];
    const own = k => ['normal', 'look', 'wide', 'closed', 'happy'].includes(k);
    if (kinds.every(own)) {
      const lx = (o.lookX || 0) * u * .2, ly = (o.lookY || 0) * u * .15;
      const blink = ((T * .9 + (o.seed || 0) * 1.7 + 1.6) % 3.3) < .12;
      [-1, 1].forEach((s, i) => {
        const k = (o.squint || 0) > .5 ? 'closed' : kinds[i], ex = s * 1.1 * u, ey = -19.7 * u, wide = k === 'wide';
        inkLine(P([[s * .6, -20.55 - (wide ? .3 : 0)], [s * 1.1, -20.75 - (wide ? .3 : 0)], [s * 1.65, -20.55 - (wide ? .25 : 0)]]), sw * .55, PRV.hair, 'inkfine', .5);   // brow
        if (k === 'closed' || k === 'happy' || blink) {
          const c = k === 'happy' ? -.25 : .2;
          inkLine([[ex - .55 * u, ey], [ex, ey + c * u], [ex + .55 * u, ey]], sw * 1.1, INK, 'ink', .5);
          inkLine([[ex + s * .5 * u, ey], [ex + s * .75 * u, ey - .15 * u]], sw * .6, INK, 'inkfine', 0);   // a lash flick
          return;
        }
        const rx = (wide ? .62 : .55) * u, ry = (wide ? .58 : .4) * u;
        paint(ellPts(ex, ey, rx, ry, 16), { wash: PRV.white, ink: null });
        paint(ellPts(ex + lx, ey + ly, .3 * u, .36 * u, 12), { wash: PRV.eye, ink: null });
        paint(ellPts(ex + lx - .1 * u, ey + ly - .12 * u, .1 * u, .11 * u, 8), { wash: PRV.white, ink: null });
        inkLine([[ex - rx * 1.05, ey + ry * .1], [ex - rx * .3, ey - ry * 1.05], [ex + rx * .5, ey - ry * 1], [ex + rx * 1.15, ey - ry * .3], [ex + s * rx * 1.4, ey - ry * .8]].map(([a, b]) => [s < 0 ? 2 * ex - a : a, b]), sw * 1.2, INK, 'ink', .5);   // lid with a flick outward
      });
    } else { push(); translate(0, -19.7 * u); scale(.44); translate(0, 6 * u); eyes(u, o, sw / .44 * .85, [-1, 1], 0); pop(); }
    rs('nose');
    inkLine(P([[.02, -19.2], [-.08, -18.85], [.12, -18.75]]), sw * .5, PRV.skinDk, 'inkfine', .5);
    inkLine(ellPts(.3 * u, -18.7 * u, .22 * u, .22 * u, 10).concat([[.52 * u, -18.7 * u]]), sw * .45, PRV.gold, 'inkfine', .5);   // nath
    rs('mouth');
    if (!o.mouth || o.mouth === 'smile') {   // her own small smile, with a touch of colour
      paint(P([[-.5, -18.3], [0, -18.05], [.5, -18.3], [0, -18.18]]), { wash: PRV.lip, ink: null, curv: .5 });
      inkLine(P([[-.55, -18.32], [0, -18.02], [.55, -18.32]]), sw * .6, INK, 'inkfine', .6);
    } else { push(); translate(0, -18.3 * u); scale(.36); translate(0, 4.3 * u); mouth(u, o.mouth, sw / .36 * .8); pop(); }
    pop();
    pop();

    // ---- arms, last
    for (const s of [-1, 1]) {
      rs('arm' + s);
      const [sh, el, ha] = parvatiArm({ ...o, lean: 0 }, s), hook = s < 0 ? o.armL : o.armR;
      paint(ribbon(P([sh, el, ha]), 1.05 * u, .75 * u), { wash: col, fill: dk, fillOp: 40, tex: .5, ink: INK, sw: sw * .8 });
      const d = Math.hypot(ha[0] - el[0], ha[1] - el[1]) || 1, nx = -(ha[1] - el[1]) / d * .45, ny = (ha[0] - el[0]) / d * .45;
      for (const [k, c] of [[.66, PRV.bangle], [.74, PRV.gold], [.82, PRV.bangle]]) { const bx = lerp(el[0], ha[0], k), by = lerp(el[1], ha[1], k); inkLine(P([[bx - nx, by - ny], [bx + nx, by + ny]]), sw * 1.1, c, 'ink', 0); }
      push(); translate(ha[0] * u, ha[1] * u);
      paint(ellPts(0, 0, .6 * u, .55 * u, 14, J), { wash: col, ink: INK, sw: sw * .7 });
      if (hook) hook(u, sw);
      pop();
    }
  });
  pop();

  if (o.emote) {
    rs('emote');
    const top = EMOTE_TOP.includes(o.emote), dir = o.flip ? -1 : 1;
    emote(o.emote, top ? x : x + dir * 4.6 * u, y + dy + (top ? -26.5 : -22) * u * (1 - sq), u * 1.1, o.emoteK ?? 1, o.emoteAge ?? T);
  }
  rs('after');
}

// Model sheet: studio.html?loop=parvati, or node render.mjs --loop=parvati --sheet=0.5 --cols=1 --w=1080
(() => {
  LOOPS.parvati = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: PAL.paper, ink: null });
    const cells = [
      ['neutral', {}], ['happy', { eyes: 'closed' }], ['playful', { eyes: 'wink', mouth: 'smile', handR: [5, -15.5], lean: 1 }],
      ['smug', { handL: [-1.2, -14], handR: [1, -14] }], ['surprised', { walk: t * 1.2 }], ['love', { eyes: 'closed' }],
    ];
    cells.forEach(([name, over], i) => {
      const cx = 200 + (i % 3) * 340, gy = 900 + Math.floor(i / 3) * 860;
      parvati(cx, gy, 26, { ...feel(name, t + i * .3, { seed: i }), ...PRV_SKIN, ...over });
    });
  };
  LOOPS.parvati.len = 4;
})();
