// shailputri.js: Maa Shailputri, the daughter of the mountain and the first of the Navadurga: a coral saree with a gold
// border, a pale pallu with a blue stripe, long open wavy hair, a tall gold mukut with a crescent moon, a trishul in her
// right hand (screen-left) and a lotus in her left. Standing, or sitting side-saddle (sit: 1) on Nandi (nandi.js).
// Built on Parvati (parvati.js). Load after bappa.js (U()), clawd.js (eyes() / mouth() / emote()) and shiva.js
// (EMO.serene); feel() and emotions() drive her face.
// (x, y) is the ground point under her, or with sit: 1 the point she sits on. u is the size unit (about 26u tall
// standing, 15u from the seat to the top of the mukut).
//
// Body-local coordinates in u (y up is negative; standing):
//   hem -1.2..0 · waist -11.8 · seat line -11 · shoulders (±2.6, -16.2) · head centre (0, -19.8) · eyes (±1.1, -19.7) ·
//   mukut -25.2..-22.5 (the head is then scaled 1.18× about the neck at (0, -17.6))
//   sitting: the drape hangs from the waist to a hem at -4.2, the feet peek under it
//
// Options (all optional):
//   pose:   sit, walk (phase), swing (-1..1: dangles the feet when sitting), dx, dy (in u), sq, rot, flip,
//           hx (-1..1 head turn), htilt, lean (u), hair (-1..1: + streams her hair and pallu to screen-left)
//   arms:   handL / handR = [x, y] in u, bendL / bendR, armL(u, sw) / armR(u, sw) (upright hooks)
//   props:  trishul (default true, in handL) + trishulA (radians), lotus (default true, in handR) + lotusOpen 0..1
//   face:   eyes, mouth, lookX / lookY, squint, blush, seed, tint + tintK. 'normal' / 'look' / 'wide' are her own almond
//           eyes with lashes, 'closed' / 'happy' / 'wink' her own lids; every other kind is Clawd's.
//   extras: emote + emoteK + emoteAge, boilKey, noShadow, swMul
const SHL = {
  skin: '#F2BE98', skinDk: '#D69470', skinLt: '#FFE0C8', ink: '#4A2530',
  saree: '#EE7B6B', sareeDk: '#CF5548', sareeLt: '#F8A99A', pallu: '#EAF1F4', palluDk: '#C5D6E2', stripe: '#6FA3CF',
  blouse: '#E2574A', blouseDk: '#B93C34', band: '#3E8E6A', gold: '#EDB43C', goldDk: '#B67D1C', goldLt: '#FFE39A',
  hair: '#3A2A2A', hairLt: '#6A4A3C', bindi: '#D2283A', eye: '#2A1A1E', white: '#FFF8EC', lip: '#C8505E',
  lotus: '#F4A6B8', lotusDk: '#E0708C', lotusLt: '#FFDDE4', stem: '#5E9A6A', steel: '#C9D3DF', steelDk: '#8E9BB0', moon: '#FFF1CF',
};
const SHL_SKIN = { col: SHL.skin, dk: SHL.skinDk, lt: SHL.skinLt };
const SHL_SEAT = 11;   // sitting: local y = -11 sits on (x, y)

// Her own calm moods (no bouncing): gentle (awake, a soft smile, slow breathing) and delight (eyes smiling shut).
EMO.gentle = { eyes: 'normal', mouth: 'smile', blush: .25, take: .25, body: t => { const br = Math.sin(t * TAU * .25); return { sq: .012 * br, dy: -.06 * br, rot: .01 * br }; } };
EMO.delight = { eyes: 'happy', mouth: 'smile', blush: .5, take: .4, body: t => { const br = Math.sin(t * TAU * .5); return { dy: -.15 * Math.abs(br), sq: .02 * br }; } };

// A crescent with its horns up (rot turns it), as one outline.
function crescentPts(cx, cy, r, rot = 0, n = 9) {
  const p = [], c = Math.cos(rot), s = Math.sin(rot), at = (a, k) => { const px = Math.cos(a) * r, py = Math.sin(a) * r * k; return [cx + px * c - py * s, cy + px * s + py * c]; };
  for (let i = 0; i <= n; i++) p.push(at(i / n * Math.PI, 1));
  for (let i = n - 1; i > 0; i--) p.push(at(i / n * Math.PI, .4));
  return p;
}
// The trishul, held at (0, 0): the shaft runs 4u below the hand and 7u above, then the three prongs.
function trishul(u, sw, a = 0, INK = SHL.ink) {
  push(); rotate(a);
  paint(ribbon(U([[0, 4], [0, -7.1]], u), .34 * u, .3 * u), { wash: SHL.goldDk, ink: INK, sw: sw * .6 });
  for (const s of [-1, 1]) paint(ribbon(U([[0, -7.2], [s * .9, -7.5], [s * 1.35, -8.4], [s * 1.2, -9.7]], u), .42 * u, .1 * u), { wash: SHL.steel, fill: SHL.steelDk, fillOp: 60, tex: .4, ink: INK, sw: sw * .6 });
  paint(U([[0, -7], [.5, -7.8], [.42, -9.2], [0, -10.5], [-.42, -9.2], [-.5, -7.8]], u), { wash: SHL.steel, fill: SHL.steelDk, fillOp: 60, tex: .4, ink: INK, sw: sw * .7, curv: .4 });
  paint(ellPts(0, -7.1 * u, .55 * u, .3 * u, 10), { wash: SHL.gold, ink: INK, sw: sw * .5 });
  paint(ellPts(0, 4 * u, .3 * u, .3 * u, 8), { wash: SHL.gold, ink: INK, sw: sw * .4 });
  pop();
}
// A lotus, held at (0, 0) by its stem: open 0 (a bud) .. 1 (full bloom).
function lotus(u, sw, open = 1, INK = SHL.ink) {
  inkLine(U([[.1, 2.4], [-.1, 1], [0, -.9]], u), sw * 1.5, SHL.stem, 'ink', .5);
  const petal = (a, len, w, c) => { push(); translate(0, -1.1 * u); rotate(a); paint(U([[0, 0], [w, -len * .45], [0, -len], [-w, -len * .45]], u), { wash: c, ink: INK, sw: sw * .5, curv: .5 }); pop(); };
  const sp = lerp(.12, 1, clamp(open));
  for (const k of [-1.35, 1.35, -.95, .95]) petal(k * sp, 1.9, .55, SHL.lotusDk);
  for (const k of [-.5, .5]) petal(k * sp, 2.2, .62, SHL.lotus);
  petal(0, 2.35, .62, SHL.lotusLt);
}

function shailputriArm(o, s) {
  const sh = [s * 2.6, -16.2];
  const ha = (s < 0 ? o.handL : o.handR) || (s < 0 ? [-4.2, -14.2] : [3.4, -14.6]);
  const dx = ha[0] - sh[0], dy = ha[1] - sh[1], d = Math.hypot(dx, dy) || 1;
  let nx = -dy / d, ny = dx / d; if (nx * s < 0) { nx = -nx; ny = -ny; }
  const b = (s < 0 ? o.bendL : o.bendR) ?? 1;
  return [sh, [(sh[0] + ha[0]) / 2 + nx * b, (sh[1] + ha[1]) / 2 + ny * b], ha];
}
// A body-local point of her upper body (u) → world, through lean, sit, squash, flip and rot.
function shailputriWorld(x, y, u, o, lx, ly) {
  const sq = (o.sq || 0) + (o.take || 0), fx = o.flip ? -1 : 1, l = o.lean || 0, r = l * .035;
  const px = lx + l * .6, py = ly + 11.8, hx = px * Math.cos(r) - py * Math.sin(r), hy = px * Math.sin(r) + py * Math.cos(r) - 11.8 + (o.sit ? SHL_SEAT : 0);
  const wx = fx * hx * u * (1 + sq * .6), wy = hy * u * (1 - sq), a = o.rot || 0;
  return [x + (o.dx || 0) * u + wx * Math.cos(a) - wy * Math.sin(a), y + (o.dy || 0) * u + wx * Math.sin(a) + wy * Math.cos(a)];
}
function shailputriHand(x, y, u, o, s) { const [, , h] = shailputriArm(o, s); return shailputriWorld(x, y, u, o, h[0], h[1]); }
// the other way: a world point → the hand target [x, y] (in u) that reaches it (ignores lean and rot)
function shailputriReach(x, y, u, o, wx, wy) {
  const sq = (o.sq || 0) + (o.take || 0), fx = o.flip ? -1 : 1;
  return [(wx - x - (o.dx || 0) * u) / (fx * u * (1 + sq * .6)), (wy - y - (o.dy || 0) * u) / (u * (1 - sq)) - (o.sit ? SHL_SEAT : 0)];
}

function shailputri(x, y, u, o = {}) {
  const id = o.boilKey ?? 's' + (++CLAWD_N), rs = p => boilSeed(`shailputri ${id} ${p}`);
  x += (o.dx || 0) * u;
  const dy = (o.dy || 0) * u, sq = (o.sq || 0) + (o.take || 0), sw = clamp(u / 20, .4, 2) * (o.swMul || 1), J = u * .04;
  const { col, dk, lt } = tintCols({ ...o, col: o.col || SHL.skin, dk: o.dk || SHL.skinDk, lt: o.lt || SHL.skinLt });
  const P = pts => U(pts, u), INK = SHL.ink, wk = o.walk, hx = clamp(o.hx || 0, -1, 1), lean = o.lean || 0, sit = !!o.sit;
  const hs = wk == null ? 0 : Math.sin(wk * TAU) * .35;   // hem swing
  const hw = (o.hair || 0), sway = Math.sin(T * 1.6) * .22 + hs * .5 - hw * 1.7;   // hair and pallu: idle sway, streaming left

  if (!o.noShadow && !sit) { rs('shadow'); paint(ellPts(x, y + u * .1, u * 5 * (1 - Math.min(.5, Math.abs(o.dy || 0) * .05)), u * .95, 22), { fill: PAL.ink, fillOp: 80, bleed: .25, tex: .3, border: .1, ink: null }); }
  push();
  translate(x, y + dy);
  if (o.rot) rotate(o.rot);
  scale((o.flip ? -1 : 1) * (1 + sq * .6), 1 - sq);
  if (sit) translate(0, SHL_SEAT * u);
  const headScale = () => { translate(0, -17.6 * u); scale(1.18); translate(0, 17.6 * u); };
  const upper = f => { push(); translate(0, -11.8 * u); rotate(lean * .035); translate(lean * .6 * u, 11.8 * u); f(); pop(); };

  // ---- behind: the long open hair, and the pallu falling behind her left shoulder
  upper(() => {
    rs('backhair');
    const h = sway, fl = hw * Math.sin(T * 9) * .25;
    const mass = [[-3.2, -23.4], [-4, -21], [-4.35, -18.4], [-4.8 + h * .5, -16], [-4.4 + h, -14.1], [-3.5 + h * 1.4 + fl, -12.3], [-2.2 + h * 1.2, -13.1], [-.8 + h, -12.6],
      [.8 + h, -13.1], [2.2 + h * 1.2, -12.5], [3.5 + h * 1.2 + fl, -12.9], [4.3 + h * .8, -14.2], [4.7 + h * .4, -16], [4.35, -18.4], [4, -21], [3.2, -23.4], [0, -24.2]];
    paint(P(mass), { wash: SHL.hair, ink: INK, sw: sw * .8, curv: .5 });
    for (const [a, b] of [[-3.6, 1], [3.5, -1], [-2.6, 1]])
      inkLine(P([[a, -17.6], [a - .35 * b + h * .4, -16], [a + .1 * b + h * .8, -14.6], [a - .2 * b + h * 1.1, -13.4]]), sw * .5, SHL.hairLt, 'inkfine', .5);
    push(); translate(hx * .4 * u, 0); headScale();
    paint(ellPts(0, -20.1 * u, 3.25 * u, 3.1 * u, 26, J), { wash: SHL.hair, ink: INK, sw: sw * .8 });
    pop();
    rs('pallback');
    const ph = sway * .8;
    paint(ribbon(P([[-2.6, -16.4], [-3.6 + ph * .3, -14.2], [-4.1 + ph * .7, -11.6], [-4.4 + ph * 1.2, -9]]), 2 * u, 2.1 * u), { wash: SHL.pallu, fill: SHL.palluDk, fillOp: 80, tex: .5, ink: INK, sw: sw * .75 });
    inkLine(P([[-3.4, -16], [-4.5 + ph * .3, -13.8], [-5 + ph * .7, -11.4], [-5.3 + ph * 1.2, -9.1]]), sw * 1.6, SHL.stripe, 'ink', .5);
  });

  if (!sit) {
    // ---- standing: feet under the hem, the skirt with its pleats and border
    rs('feet');
    for (const s of [-1, 1]) {
      const l = wk == null ? 0 : Math.max(0, Math.sin((wk + (s < 0 ? 0 : .5)) * TAU)) * .5;
      paint(ellPts((s * 1.1 + (wk == null ? 0 : s * l * .3)) * u, (-.25 - l) * u, .95 * u, .45 * u, 14, J), { wash: col, ink: INK, sw: sw * .7 });
      inkLine(P([[s * 1.1 - .6, -.45 - l], [s * 1.1 + .6, -.45 - l]]), sw * .9, SHL.gold, 'ink', 0);
    }
    rs('skirt');
    const skirt = P([[-2.2, -11.9], [2.2, -11.9], [2.9, -8.5], [3.7, -4.6], [4.3 + hs * .4, -1.5], [4.6 + hs, -.5], [2.6 + hs * .5, -.35], [0, -.3], [-2.6 + hs * .5, -.35], [-4.6 + hs, -.5], [-4.3 + hs * .4, -1.5], [-3.7, -4.6], [-2.9, -8.5]]);
    paint(skirt, { wash: SHL.saree, fill: SHL.sareeDk, fillOp: 80, bleed: .06, tex: .7, border: .5, ink: INK, sw: sw * .9, curv: .3 });
    paint(ribbon(P([[-4.5 + hs, -1.05], [-2.2 + hs * .5, -.9], [0, -.85], [2.2 + hs * .5, -.9], [4.5 + hs, -1.05]]), .75 * u, .75 * u), { wash: SHL.gold, ink: null });
    for (const k of [-.5, .1, .6]) inkLine(P([[k * .6, -10.5], [k * 1.2 + hs * .3, -5.5], [k * 1.8 + hs * .5, -1.5]]), sw * .5, SHL.sareeDk, 'inkfine', .5);
    for (let k = 0; k < 6; k++) { const bx = lerp(-3.4, 3.6, (k + .5) / 6) + hs * .5; paint(ellPts(bx * u, -2.3 * u, .22 * u, .22 * u, 8), { wash: SHL.sareeLt, ink: null }); }
  } else {
    // ---- sitting side-saddle: both feet toward us under the hem, the drape over her lap and down her mount's flank
    rs('feet');
    const swg = (o.swing || 0) * .35;
    for (const [fx, fy, k] of [[-.95, -3.85, 1], [1.05, -3.75, -1]]) {
      paint(ellPts((fx + swg * k) * u, fy * u, .9 * u, .5 * u, 14, J), { wash: col, ink: INK, sw: sw * .7 });
      inkLine(P([[fx + swg * k - .55, fy - .3], [fx + swg * k + .55, fy - .3]]), sw * .9, SHL.gold, 'ink', 0);
    }
    rs('skirt');
    const drape = P([[-2.3, -11.9], [2.3, -11.9], [3.3, -10.7], [3.5, -9.2], [3.25, -7], [2.95, -5.1], [2.3, -4.3], [0, -4.15], [-2.3, -4.3], [-2.95, -5.1], [-3.25, -7], [-3.5, -9.2], [-3.3, -10.7]]);
    paint(drape, { wash: SHL.saree, fill: SHL.sareeDk, fillOp: 80, bleed: .06, tex: .7, border: .5, ink: INK, sw: sw * .9, curv: .35 });
    paint(ribbon(P([[-2.85, -5], [-1.4, -4.72], [0, -4.65], [1.4, -4.72], [2.85, -5]]), .7 * u, .7 * u), { wash: SHL.gold, ink: null });
    inkLine(P([[-3, -9.5], [-1, -9.05], [1, -9.05], [3, -9.5]]), sw * .55, SHL.sareeDk, 'inkfine', .5);   // the knees' fold
    for (const k of [-.55, .1, .65]) inkLine(P([[k * 1.6, -8.6], [k * 2, -5.4]]), sw * .5, SHL.sareeDk, 'inkfine', .5);
    for (let k = 0; k < 4; k++) paint(ellPts(lerp(-2.1, 2.1, k / 3) * u, -6.3 * u, .2 * u, .2 * u, 8), { wash: SHL.sareeLt, ink: null });
  }

  upper(() => {
    // ---- torso: midriff, blouse, the pallu across the chest, necklace
    rs('torso');
    paint(P([[-2.3, -16.6], [2.3, -16.6], [2.4, -14], [2.1, -11.6], [-2.1, -11.6], [-2.4, -14]]), { wash: col, ink: INK, sw: sw * .8, curv: .3 });
    paint(P([[-2.6, -16.8], [2.6, -16.8], [2.55, -14.6], [1.9, -13.7], [-1.9, -13.7], [-2.55, -14.6]]), { wash: SHL.blouse, ink: INK, sw: sw * .8, curv: .3 });
    rs('pallu');
    paint(ribbon(P([[2.3, -11.2], [1.4, -12.8], [-.2, -14.6], [-1.8, -16.3], [-2.7, -16.9]]), 2.3 * u, 1.7 * u), { wash: SHL.pallu, fill: SHL.palluDk, fillOp: 70, tex: .5, ink: INK, sw: sw * .8 });
    inkLine(P([[2.2, -12.4], [.9, -13.9], [-.6, -15.4], [-1.8, -16.6]]), sw * 2.2, SHL.stripe, 'ink', .5);
    inkLine(P([[3, -11.7], [2.1, -13.3], [.5, -15.2], [-1, -16.8], [-1.8, -17.4]]), sw * 1.3, SHL.gold, 'ink', .5);
    rs('neck');
    paint(P([[-.75, -17.9], [.75, -17.9], [.8, -16.7], [-.8, -16.7]]), { wash: col, ink: INK, sw: sw * .6 });
    inkLine(P([[-1.5, -17], [-.7, -16.1], [0, -15.85], [.7, -16.1], [1.5, -17]]), sw * 1.6, SHL.gold, 'ink', .6);
    paint(P([[0, -15.95], [.35, -15.6], [0, -15.05], [-.35, -15.6]]), { wash: SHL.blouse, ink: INK, sw: sw * .4 });

    // ---- head
    push(); translate(hx * .45 * u, 0); headScale();
    if (o.htilt) { translate(0, -17.5 * u); rotate(o.htilt); translate(0, 17.5 * u); }
    rs('head');
    const head = ellPts(0, -19.8 * u, 2.8 * u, 2.75 * u, 30, J);
    paint(head, { wash: col, ink: null });
    paint(ellPts(0, -17.7 * u, 2 * u, .7 * u, 14, J), { fill: dk, fillOp: 60, bleed: .1, tex: .6, border: .5, ink: null });
    paint(head, { ink: INK, sw });
    rs('jhumka');
    for (const s of [-1, 1]) {
      push(); translate(s * 2.75 * u, -19 * u); rotate(Math.sin(T * 2.4 + s) * .12);
      inkLine([[0, 0], [0, .5 * u]], sw * .5, SHL.goldDk, 'inkfine', 0);
      paint(U([[-.45, 1.2], [0, .45], [.45, 1.2]], u), { wash: SHL.gold, ink: INK, sw: sw * .45, curv: .5 });
      pop();
    }
    rs('hairfront');   // a centre parting, waves down each side of the face
    paint(P([[-2.85, -18.6], [-3.15, -20.4], [-2.9, -21.6], [-2.2, -22.35], [-.6, -22.75], [0, -22.3], [.6, -22.75], [2.2, -22.35], [2.9, -21.6], [3.15, -20.4], [2.85, -18.6], [2.4, -20.4], [1.4, -21.5], [.15, -21.6], [0, -21.9], [-.15, -21.6], [-1.4, -21.5], [-2.4, -20.4]]),
      { wash: SHL.hair, ink: INK, sw: sw * .85, curv: .4 });
    inkLine(P([[-2.3, -21.5], [-1.3, -22.25], [-.3, -22.4]]), sw * .45, SHL.hairLt, 'inkfine', .5);
    rs('mukut');
    paint(P([[-1.95, -22.35], [1.95, -22.35], [1.75, -23.75], [1.05, -23.4], [.55, -24.2], [0, -25.3], [-.55, -24.2], [-1.05, -23.4], [-1.75, -23.75]]), { wash: SHL.gold, fill: SHL.goldDk, fillOp: 60, tex: .5, ink: INK, sw: sw * .6, curv: .15 });
    inkLine(P([[-1.85, -22.6], [1.85, -22.6]]), sw * .9, SHL.goldDk, 'inkfine', 0);
    paint(ellPts(0, -24.1 * u, .26 * u, .32 * u, 8), { wash: SHL.blouse, ink: INK, sw: sw * .35 });
    for (const s of [-1, 1]) paint(ellPts(s * 1.25 * u, -23.15 * u, .15 * u, .15 * u, 6), { wash: SHL.goldLt, ink: null });
    paint(crescentPts(0, -23.45 * u, .6 * u), { wash: SHL.moon, ink: INK, sw: sw * .35 });

    push(); translate(hx * .8 * u, 0);
    rs('bindi');
    paint(ellPts(0, -20.6 * u, .2 * u, .2 * u, 8), { wash: SHL.bindi, ink: null });
    if (o.blush) for (const s of [-1, 1]) paint(ellPts(s * 1.75 * u, -18.7 * u, .65 * u, .35 * u, 14), { fill: PAL.rose, fillOp: 150 * clamp(o.blush), bleed: .2, tex: .4, ink: null });
    rs('eyes');
    const kinds = Array.isArray(o.eyes) ? o.eyes : o.eyes === 'wink' ? ['normal', 'closed'] : [o.eyes || 'normal', o.eyes || 'normal'];
    const own = k => ['normal', 'look', 'wide', 'closed', 'happy'].includes(k);
    if (kinds.every(own)) {
      const lx = (o.lookX || 0) * u * .2, ly = (o.lookY || 0) * u * .15;
      const blink = ((T * .9 + (o.seed || 0) * 1.7 + 1.6) % 3.3) < .12;
      [-1, 1].forEach((s, i) => {
        const k = (o.squint || 0) > .5 ? 'closed' : kinds[i], ex = s * 1.1 * u, ey = -19.7 * u, wide = k === 'wide';
        inkLine(P([[s * .6, -20.55 - (wide ? .3 : 0)], [s * 1.1, -20.75 - (wide ? .3 : 0)], [s * 1.65, -20.55 - (wide ? .25 : 0)]]), sw * .55, SHL.hair, 'inkfine', .5);
        if (k === 'closed' || k === 'happy' || blink) {
          const c = k === 'happy' ? -.25 : .2;
          inkLine([[ex - .55 * u, ey], [ex, ey + c * u], [ex + .55 * u, ey]], sw * 1.1, INK, 'ink', .5);
          inkLine([[ex + s * .5 * u, ey], [ex + s * .75 * u, ey - .15 * u]], sw * .6, INK, 'inkfine', 0);
          return;
        }
        const rx = (wide ? .62 : .55) * u, ry = (wide ? .58 : .4) * u;
        paint(ellPts(ex, ey, rx, ry, 16), { wash: SHL.white, ink: null });
        paint(ellPts(ex + lx, ey + ly, .3 * u, .36 * u, 12), { wash: SHL.eye, ink: null });
        paint(ellPts(ex + lx - .1 * u, ey + ly - .12 * u, .1 * u, .11 * u, 8), { wash: SHL.white, ink: null });
        inkLine([[ex - rx * 1.05, ey + ry * .1], [ex - rx * .3, ey - ry * 1.05], [ex + rx * .5, ey - ry * 1], [ex + rx * 1.15, ey - ry * .3], [ex + s * rx * 1.4, ey - ry * .8]].map(([a, b]) => [s < 0 ? 2 * ex - a : a, b]), sw * 1.2, INK, 'ink', .5);
      });
    } else { push(); translate(0, -19.7 * u); scale(.44); translate(0, 6 * u); eyes(u, o, sw / .44 * .85, [-1, 1], 0); pop(); }
    rs('nose');
    inkLine(P([[.02, -19.2], [-.08, -18.85], [.12, -18.75]]), sw * .5, SHL.skinDk, 'inkfine', .5);
    rs('mouth');
    if (!o.mouth || o.mouth === 'smile') {
      paint(P([[-.5, -18.3], [0, -18.05], [.5, -18.3], [0, -18.18]]), { wash: SHL.lip, ink: null, curv: .5 });
      inkLine(P([[-.55, -18.32], [0, -18.02], [.55, -18.32]]), sw * .6, INK, 'inkfine', .6);
    } else { push(); translate(0, -18.3 * u); scale(.36); translate(0, 4.3 * u); mouth(u, o.mouth, sw / .36 * .8); pop(); }
    pop();
    pop();

    // ---- arms, last: the prop goes under the hand that holds it
    for (const s of [-1, 1]) {
      rs('arm' + s);
      const [sh, el, ha] = shailputriArm(o, s), hook = s < 0 ? o.armL : o.armR;
      paint(ribbon(P([sh, el, ha]), 1.05 * u, .75 * u), { wash: col, ink: INK, sw: sw * .8 });
      const band = (a, b, k, c, w) => { const d = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, nx = -(b[1] - a[1]) / d * .42, ny = (b[0] - a[0]) / d * .42, bx = lerp(a[0], b[0], k), by = lerp(a[1], b[1], k); inkLine(P([[bx - nx, by - ny], [bx + nx, by + ny]]), sw * w, c, 'ink', 0); };
      band(sh, el, .6, SHL.band, 1.7); band(sh, el, .8, SHL.gold, 1);
      for (const k of [.68, .8]) band(el, ha, k, SHL.gold, 1.1);
      push(); translate(ha[0] * u, ha[1] * u);
      rs('prop' + s);
      if (s < 0 && o.trishul !== false) trishul(u, sw, o.trishulA || 0);
      if (s > 0 && o.lotus !== false) lotus(u, sw, o.lotusOpen ?? 1);
      rs('hand' + s);
      paint(ellPts(0, 0, .6 * u, .55 * u, 14, J), { wash: col, ink: INK, sw: sw * .7 });
      if (hook) hook(u, sw);
      pop();
    }
  });
  pop();

  if (o.emote) {
    rs('emote');
    const top = EMOTE_TOP.includes(o.emote), dir = o.flip ? -1 : 1, base = sit ? SHL_SEAT : 0;
    emote(o.emote, top ? x : x + dir * 4.6 * u, y + dy + ((top ? -26.5 : -22) + base) * u * (1 - sq), u * 1.1, o.emoteK ?? 1, o.emoteAge ?? T);
  }
  rs('after');
}

// Model sheets: studio.html?loop=shailputri and ?loop=pair (riding Nandi), or node render.mjs --loop=shailputri --sheet=0.5 --cols=1 --w=1080
(() => {
  LOOPS.shailputri = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: '#8FB4DE', ink: null });
    const cells = [
      ['gentle', {}], ['serene', { handL: [-5.5, -19.5], trishul: false, lotus: false }], ['gentle', { walk: t * 1.2, hair: .4 }],
      ['gentle', { sit: 1 }], ['delight', { sit: 1, swing: Math.sin(t * 4) }], ['gentle', { sit: 1, eyes: 'wink', handR: [4.6, -18], handL: [-4.6, -16] }],
    ];
    cells.forEach(([name, over], i) => {
      const cx = 200 + (i % 3) * 340, gy = (i < 3 ? 900 : 1400);
      shailputri(cx, gy, 26, { ...feel(name, t + i * .3, { seed: i }), ...SHL_SKIN, ...over });
    });
  };
  LOOPS.shailputri.len = 4;
  LOOPS.pair = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: '#6E93CC', ink: null });
    const n = { walk: t * 1.1, eyes: 'happy' }, s = nandiSeat(460, 1420, 40, n);
    nandi(460, 1420, 40, n);
    shailputri(s[0], s[1], 24, { ...feel('gentle', t), ...SHL_SKIN, sit: 1, hair: .5 });
  };
  LOOPS.pair.len = 4;
})();
