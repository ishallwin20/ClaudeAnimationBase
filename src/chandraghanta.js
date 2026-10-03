// chandraghanta.js: Maa Chandraghanta, the third Navadurga, "the Fierce Protector" of the Book 3 cover: a coral-rust saree
// with a gold border, a cream pallu with a sky-blue stripe, an orange blouse, long open hair, a tall tiered gold mukut
// with a gold halo ring behind her head, an orange marigold mala, a gold necklace, gold bangles stacked up every forearm.
// THE MOON-BELL: a gold bell sitting in a crescent moon at the base of the mukut, over her forehead (Chandra + Ghanta).
// TEN ARMS: the front pair holds a ghanta (bell, screen-left) and gives abhaya (raised palm, screen-right); four more
// pairs fan out behind her shoulders: trishul · gada · khadga · kamandalu on screen-left, lotus · bow · arrow · japa
// mala on screen-right.
// Built on Shailputri / Brahmacharini (same chibi proportions, arm solver, head scale; brahmachariniWorld for points).
// Load after bappa.js (U()), clawd.js, shiva.js (EMO.serene), shailputri.js (SHL, trishul(), lotus(), crescentPts()) and
// brahmacharini.js (japaMala(), kamandalu(), brahmachariniWorld()); feel() / emotions() drive her.
// (x, y) is the ground point under her, u the size unit (about 27u tall to the top of the mukut; the arm fan spans
// about ±9u).
//
// Body-local coordinates in u (y up is negative): hem -1.2..0 · waist -11.8 · shoulders (±2.6, -16.2) · head centre
// (0, -19.8) · eyes (±1.1, -19.7) · moon-bell (0, -22.85) · mukut -22.4..-27.4 (the head is then scaled 1.18× about the
// neck at (0, -17.6), so on screen the moon-bell sits at about -23.4 and the mukut tops out near -29.5)
//
// Options (all optional):
//   pose:   walk (phase), dx, dy (in u), sq, rot, flip, hx (-1..1 head turn), htilt, lean (u), hair (-1..1 streams it)
//   arms:   arms 0..1 (default 1): the four back pairs fan out, one pair after another, each on an overshoot.
//           handL / handR = [x, y] in u (the front pair), bendL / bendR, armL(u, sw) / armR(u, sw) (hooks at the hands)
//   props:  bell (default true: the ghanta in handL) + ring (-1..1: its swing), abhaya (default true: handR's open palm)
//   bell:   moonBell 0..1 (default 1: the moon-bell draws in, a pop), moonGlow 0..1 (its light)
//   aura:   0..1 warm gold light behind her (drawn first). The halo ring behind the head is always there.
//   face:   eyes, mouth, lookX / lookY, squint, blush, seed, tint + tintK, brows (-1 angry .. +1 raised) and browL / browR
//           (one brow at a time: + raises it). Her own eyes: 'normal' / 'look' / 'wide' / 'angry' / 'determined' /
//           'closed' / 'happy' / 'wink'; every other kind is Clawd's. Mouths: smile (default), flat, teeth, her own.
//   extras: emote + emoteK + emoteAge, boilKey, noShadow, swMul
// Helpers: chandraghantaHand(x, y, u, o, s), chandraghantaHead(x, y, u, o), chandraghantaMoon(x, y, u, o) → world [x, y];
//          ghanta(u, sw, a) draws the bell on its own, held by its handle at (0, 0).
const CGH = {
  saree: '#D9643A', sareeDk: '#B04A2A', sareeLt: '#F08C62', pallu: '#F5ECDB', palluDk: '#DCCFB6', stripe: '#7FB3D9',
  blouse: '#E8873A', blouseDk: '#B9602A', marigold: '#F39A2B', marigoldDk: '#D0701A', wood: '#8A5A32', woodDk: '#5E3A1E',
  feather: '#F5ECDB',
};

// ---- her weapons and gifts, each held at (0, 0) by its grip, pointing up (rotate by a)
function gada(u, sw, a = 0, INK = SHL.ink) {
  push(); rotate(a);
  paint(ribbon(U([[0, 2.6], [0, -4.4]], u), .36 * u, .3 * u), { wash: SHL.goldDk, ink: INK, sw: sw * .6 });
  paint(ellPts(0, -5.55 * u, 1.2 * u, 1.3 * u, 20), { wash: SHL.gold, fill: SHL.goldDk, fillOp: 60, tex: .5, ink: INK, sw: sw * .7 });
  for (const k of [-.55, 0, .55]) inkLine(U([[k * .9, -6.7], [k * 1.35, -5.55], [k * .9, -4.4]], u), sw * .5, SHL.goldDk, 'inkfine', .5);
  paint(U([[-.3, -6.75], [0, -7.5], [.3, -6.75]], u), { wash: SHL.gold, ink: INK, sw: sw * .4, curv: .2 });
  paint(ellPts(-.45 * u, -5.95 * u, .3 * u, .42 * u, 8), { wash: SHL.goldLt, washOp: 170, ink: null });
  paint(ellPts(0, 2.75 * u, .3 * u, .3 * u, 8), { wash: SHL.gold, ink: INK, sw: sw * .4 });
  pop();
}
function khadga(u, sw, a = 0, INK = SHL.ink) {
  push(); rotate(a);
  paint(ribbon(U([[0, 1.3], [0, -.4]], u), .42 * u, .36 * u), { wash: CGH.woodDk, ink: INK, sw: sw * .5 });
  paint(ellPts(0, 1.5 * u, .3 * u, .3 * u, 8), { wash: SHL.gold, ink: INK, sw: sw * .4 });
  paint(U([[-1, -.35], [1, -.35], [.85, -.75], [-.85, -.75]], u), { wash: SHL.gold, ink: INK, sw: sw * .5, curv: .3 });   // the guard
  paint(U([[-.32, -.7], [.32, -.7], [.5, -3.6], [.55, -5.6], [.15, -7.1], [-.35, -5.8], [-.4, -3.6]], u), { wash: SHL.steel, fill: SHL.steelDk, fillOp: 50, tex: .4, ink: INK, sw: sw * .6, curv: .3 });
  inkLine(U([[0, -1], [.05, -4], [.1, -6]], u), sw * .4, '#FFFFFF', 'inkfine', .5);
  pop();
}
function dhanush(u, sw, a = 0, INK = SHL.ink) {
  push(); rotate(a);
  inkLine(U([[.6, -4.5], [.6, 4.5]], u), sw * .45, CGH.feather, 'inkfine', 0);   // the string
  paint(ribbon(U([[.6, -4.6], [-.55, -2.8], [-.95, -.6], [-.95, .6], [-.55, 2.8], [.6, 4.6]], u), .2 * u, .2 * u), { wash: CGH.wood, ink: INK, sw: sw * .5 });
  paint(U([[-1.25, -.7], [-.6, -.7], [-.6, .7], [-1.25, .7]], u), { wash: SHL.gold, ink: INK, sw: sw * .4 });   // the grip wrap
  pop();
}
function baan(u, sw, a = 0, INK = SHL.ink) {
  push(); rotate(a);
  inkLine(U([[0, 3], [0, -4.4]], u), sw * 1.1, CGH.wood, 'ink', 0);
  paint(U([[0, -5.7], [.45, -4.3], [0, -4.55], [-.45, -4.3]], u), { wash: SHL.steel, ink: INK, sw: sw * .45 });
  for (const s of [-1, 1]) paint(U([[0, 2.2], [s * .5, 2.5], [s * .5, 3.3], [0, 3]], u), { wash: CGH.marigold, ink: INK, sw: sw * .35 });
  pop();
}
// The ghanta, held by its handle at (0, 0): the bell hangs below the hand and swings by a.
function ghanta(u, sw, a = 0, INK = SHL.ink) {
  push(); rotate(a);
  paint(ribbon(U([[0, -.9], [0, .75]], u), .32 * u, .4 * u), { wash: SHL.goldDk, ink: INK, sw: sw * .5 });   // handle
  paint(ellPts(0, -1.05 * u, .28 * u, .3 * u, 8), { wash: SHL.gold, ink: INK, sw: sw * .4 });
  const cl = Math.sin(a * 3) * .25;
  paint(ellPts(cl * u, 3.05 * u, .26 * u, .26 * u, 8), { wash: SHL.goldDk, ink: INK, sw: sw * .4 });   // clapper
  paint(U([[0, .7], [.55, .85], [.9, 1.5], [1.05, 2.4], [1.35, 2.85], [-1.35, 2.85], [-1.05, 2.4], [-.9, 1.5], [-.55, .85]], u), { wash: SHL.gold, fill: SHL.goldDk, fillOp: 60, tex: .5, ink: INK, sw: sw * .65, curv: .3 });
  inkLine(U([[-1.15, 2.5], [0, 2.62], [1.15, 2.5]], u), sw * .5, SHL.goldDk, 'inkfine', .5);
  paint(ellPts(-.4 * u, 1.55 * u, .2 * u, .45 * u, 8, 0, .3), { wash: SHL.goldLt, washOp: 170, ink: null });
  pop();
}
// The moon-bell at (0, 0) (px), size r: a small gold bell sitting in a crescent moon, horns up.
function moonBell(r, sw, INK = SHL.ink) {
  paint(crescentPts(0, .1 * r, r, 0, 11), { wash: SHL.moon, fill: SHL.goldLt, fillOp: 90, tex: .3, ink: INK, sw: sw * .4 });
  const b = r * .62;
  paint([[0, -1.05 * b], [.5 * b, -.85 * b], [.72 * b, -.2 * b], [.8 * b, .3 * b], [1 * b, .55 * b], [-1 * b, .55 * b], [-.8 * b, .3 * b], [-.72 * b, -.2 * b], [-.5 * b, -.85 * b]], { wash: SHL.gold, ink: INK, sw: sw * .45, curv: .35 });
  paint(ellPts(0, -1.2 * b, .2 * b, .2 * b, 6), { wash: SHL.gold, ink: INK, sw: sw * .3 });
  paint(ellPts(0, .78 * b, .22 * b, .2 * b, 6), { wash: SHL.goldDk, ink: null });
  paint(ellPts(-.3 * b, -.4 * b, .14 * b, .3 * b, 6, 0, .3), { wash: SHL.goldLt, ink: null });
}

const CGH_BACK = [   // the back pairs: hand targets for the screen-left side (mirror x for the right), and the props
  { at: [-6.3, -22.4], b: 1.3, L: (u, sw) => trishul(u * .8, sw, -.12), R: (u, sw) => lotus(u * .85, sw, 1) },
  { at: [-7.7, -18.3], b: 1.2, L: (u, sw) => gada(u * .8, sw, -.25), R: (u, sw) => dhanush(u * .8, sw, .2) },
  { at: [-7.9, -14.1], b: 1.1, L: (u, sw) => khadga(u * .82, sw, -.55), R: (u, sw) => baan(u * .82, sw, .55) },
  { at: [-6.9, -10.2], b: 1.1, L: (u, sw) => kamandalu(u * .7, sw, .1), R: (u, sw) => japaMala(u * .8, sw, -.1) },
];
function chandraghantaArm(o, s) {
  const sh = [s * 2.6, -16.2];
  const ha = (s < 0 ? o.handL : o.handR) || (s < 0 ? [-4.5, -14.4] : [4.2, -18.2]);
  const dx = ha[0] - sh[0], dy = ha[1] - sh[1], d = Math.hypot(dx, dy) || 1;
  let nx = -dy / d, ny = dx / d; if (nx * s < 0) { nx = -nx; ny = -ny; }
  const b = (s < 0 ? o.bendL : o.bendR) ?? (s < 0 ? 1 : 1.3);
  return [sh, [(sh[0] + ha[0]) / 2 + nx * b, (sh[1] + ha[1]) / 2 + ny * b], ha];
}
function chandraghantaHand(x, y, u, o, s) { const [, , h] = chandraghantaArm(o, s); return brahmachariniWorld(x, y, u, o, h[0], h[1]); }
function chandraghantaHead(x, y, u, o = {}) { return brahmachariniWorld(x, y, u, o, clamp(o.hx || 0, -1, 1) * .45, -20.2); }
function chandraghantaMoon(x, y, u, o = {}) { return brahmachariniWorld(x, y, u, o, clamp(o.hx || 0, -1, 1) * .45, -23.4); }

function chandraghanta(x, y, u, o = {}) {
  const id = o.boilKey ?? 'c' + (++CLAWD_N), rs = p => boilSeed(`chandraghanta ${id} ${p}`);
  x += (o.dx || 0) * u;
  const dy = (o.dy || 0) * u, sq = (o.sq || 0) + (o.take || 0), sw = clamp(u / 20, .4, 2) * (o.swMul || 1), J = u * .04;
  const { col, dk, lt } = tintCols({ ...o, col: o.col || SHL.skin, dk: o.dk || SHL.skinDk, lt: o.lt || SHL.skinLt });
  const P = pts => U(pts, u), INK = SHL.ink, wk = o.walk, hx = clamp(o.hx || 0, -1, 1), lean = o.lean || 0;
  const hs = wk == null ? 0 : Math.sin(wk * TAU) * .35, hw = o.hair || 0, sway = Math.sin(T * 1.6) * .22 + hs * .5 - hw * 1.7;
  const wo = { ...o, dx: 0, dy: 0 }, arms = clamp(o.arms ?? 1), mb = clamp(o.moonBell ?? 1);

  // ---- the aura first, then the halo ring behind the head (always)
  const au = clamp(o.aura || 0), [hx0, hy0] = chandraghantaHead(x, y + dy, u, wo);
  rs('aura');
  if (au > .01) {
    const [bx, by] = brahmachariniWorld(x, y + dy, u, wo, 0, -15);
    glow(bx, by, u * (14 + 18 * au), '#FFAE45', au * .85);
    glow(bx, by, u * (8 + 10 * au), '#FFD27A', au);
    glow(hx0, hy0 - u, u * (6 + 5 * au), '#FFF0B8', au * .95);
  }
  {
    const R = u * 5.6, cy = hy0 - u * 1.4;
    paint(ellPts(hx0, cy, R, R, 32), { fill: '#FFE9A8', fillOp: 60 + 60 * au, bleed: .3, tex: .3, ink: null });
    for (const [j, c, w] of [[0, '#E9A93A', 2.6], [.25, '#FFE39A', 1.6]]) { const rr = R + j * u * .4 - u * .1, e = ellPts(hx0, cy, rr, rr, 36, J); inkLine([...e, e[0], e[1]], sw * w, c, 'ink', .5); }
    for (let i = 0; i < 16; i++) { const a = i / 16 * TAU, r0 = R + u * .45, r1 = R + u * (i % 2 ? .9 : 1.4); inkLine([[hx0 + Math.cos(a) * r0, cy + Math.sin(a) * r0], [hx0 + Math.cos(a) * r1, cy + Math.sin(a) * r1]], sw * 1.1, '#F3B93E', 'inkfine', 0); }
  }

  if (!o.noShadow) { rs('shadow'); paint(ellPts(x, y + u * .1, u * 5.4 * (1 - Math.min(.5, Math.abs(o.dy || 0) * .05)), u * 1, 22), { fill: PAL.ink, fillOp: 80, bleed: .25, tex: .3, border: .1, ink: null }); }
  push();
  translate(x, y + dy);
  if (o.rot) rotate(o.rot);
  scale((o.flip ? -1 : 1) * (1 + sq * .6), 1 - sq);
  const headScale = () => { translate(0, -17.6 * u); scale(1.18); translate(0, 17.6 * u); };
  const upper = f => { push(); translate(0, -11.8 * u); rotate(lean * .035); translate(lean * .6 * u, 11.8 * u); f(); pop(); };

  upper(() => {
    // ---- behind: the long open hair
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

    // ---- the back arms: four pairs fanned out from behind the shoulders, the lowest pair first in the draw order
    const bcol = mixCol(col, dk, .25);
    for (let k = CGH_BACK.length - 1; k >= 0; k--) {
      const pk = clamp((arms - k * .18) / .46);
      if (pk < .02) continue;
      const e = backOut(pk), A = CGH_BACK[k];
      for (const s of [-1, 1]) {
        rs(`back${k}${s}`);
        const sh = [s * 2.2, -16], tuck = [s * 2.4, -14.6];
        const tx = s < 0 ? A.at[0] : -A.at[0], ty = A.at[1] + Math.sin(T * 1.7 + k * 1.3 + s) * .12;
        const ha = [lerp(tuck[0], tx, e), lerp(tuck[1], ty, e)];
        const ddx = ha[0] - sh[0], ddy = ha[1] - sh[1], d = Math.hypot(ddx, ddy) || 1;
        let nx = -ddy / d, ny = ddx / d; if (ny > 0) { nx = -nx; ny = -ny; }   // the elbow bends up and out
        const el = [(sh[0] + ha[0]) / 2 + nx * A.b * e, (sh[1] + ha[1]) / 2 + ny * A.b * e];
        paint(ribbon(P([sh, el, ha]), .95 * u, .68 * u), { wash: bcol, fill: dk, fillOp: 40, tex: .5, ink: INK, sw: sw * .7 });
        const dd = Math.hypot(ha[0] - el[0], ha[1] - el[1]) || 1, bnx = -(ha[1] - el[1]) / dd * .38, bny = (ha[0] - el[0]) / dd * .38;
        for (const kk of [.6, .72, .84]) { const bx = lerp(el[0], ha[0], kk), by = lerp(el[1], ha[1], kk); inkLine(P([[bx - bnx, by - bny], [bx + bnx, by + bny]]), sw * 1, SHL.gold, 'ink', 0); }
        push(); translate(ha[0] * u, ha[1] * u);
        const ps = clamp(pk * 1.6);
        if (ps > .02) { scale(ps); (s < 0 ? A.L : A.R)(u, sw / Math.max(ps, .3)); scale(1 / ps); }
        paint(ellPts(0, 0, .55 * u, .5 * u, 12, J), { wash: bcol, ink: INK, sw: sw * .6 });
        pop();
      }
    }

    // ---- the pallu falling behind her right shoulder (screen-left)
    rs('pallback');
    const ph = sway * .8;
    paint(ribbon(P([[-2.6, -16.4], [-3.6 + ph * .3, -14.2], [-4.1 + ph * .7, -11.6], [-4.4 + ph * 1.2, -9]]), 2 * u, 2.1 * u), { wash: CGH.pallu, fill: CGH.palluDk, fillOp: 80, tex: .5, ink: INK, sw: sw * .75 });
    inkLine(P([[-3.4, -16], [-4.5 + ph * .3, -13.8], [-5 + ph * .7, -11.4], [-5.3 + ph * 1.2, -9.1]]), sw * 1.6, CGH.stripe, 'ink', .5);
  });

  // ---- feet under the hem, the skirt with its gold border and cream buti
  rs('feet');
  for (const s of [-1, 1]) {
    const l = wk == null ? 0 : Math.max(0, Math.sin((wk + (s < 0 ? 0 : .5)) * TAU)) * .5;
    paint(ellPts((s * 1.1 + (wk == null ? 0 : s * l * .3)) * u, (-.25 - l) * u, .95 * u, .45 * u, 14, J), { wash: col, ink: INK, sw: sw * .7 });
    inkLine(P([[s * 1.1 - .6, -.45 - l], [s * 1.1 + .6, -.45 - l]]), sw * .9, SHL.gold, 'ink', 0);
  }
  rs('skirt');
  const skirt = P([[-2.2, -11.9], [2.2, -11.9], [2.9, -8.5], [3.7, -4.6], [4.3 + hs * .4, -1.5], [4.6 + hs, -.5], [2.6 + hs * .5, -.35], [0, -.3], [-2.6 + hs * .5, -.35], [-4.6 + hs, -.5], [-4.3 + hs * .4, -1.5], [-3.7, -4.6], [-2.9, -8.5]]);
  paint(skirt, { wash: CGH.saree, fill: CGH.sareeDk, fillOp: 80, bleed: .06, tex: .7, border: .5, ink: INK, sw: sw * .9, curv: .3 });
  paint(ribbon(P([[-4.5 + hs, -1.05], [-2.2 + hs * .5, -.9], [0, -.85], [2.2 + hs * .5, -.9], [4.5 + hs, -1.05]]), .8 * u, .8 * u), { wash: SHL.gold, ink: null });
  for (const k of [-.5, .1, .6]) inkLine(P([[k * .6, -10.5], [k * 1.2 + hs * .3, -5.5], [k * 1.8 + hs * .5, -1.5]]), sw * .5, CGH.sareeDk, 'inkfine', .5);
  for (let k = 0; k < 9; k++) { const bx = lerp(-3.2, 3.4, hash(k + 3)) + hs * .4, by = lerp(-9.5, -2.6, hash(k + 11)); paint(ellPts(bx * u * (1 - (-by - 2) * .03), by * u, .22 * u, .17 * u, 8), { wash: CGH.pallu, ink: null }); }

  upper(() => {
    // ---- torso: midriff, blouse, the pallu across the chest, necklace, the marigold mala
    rs('torso');
    paint(P([[-2.3, -16.6], [2.3, -16.6], [2.4, -14], [2.1, -11.6], [-2.1, -11.6], [-2.4, -14]]), { wash: col, ink: INK, sw: sw * .8, curv: .3 });
    paint(P([[-2.6, -16.8], [2.6, -16.8], [2.55, -14.6], [1.9, -13.7], [-1.9, -13.7], [-2.55, -14.6]]), { wash: CGH.blouse, ink: INK, sw: sw * .8, curv: .3 });
    rs('pallu');
    paint(ribbon(P([[2.3, -11.2], [1.4, -12.8], [-.2, -14.6], [-1.8, -16.3], [-2.7, -16.9]]), 2.3 * u, 1.7 * u), { wash: CGH.pallu, fill: CGH.palluDk, fillOp: 70, tex: .5, ink: INK, sw: sw * .8 });
    inkLine(P([[2.2, -12.4], [.9, -13.9], [-.6, -15.4], [-1.8, -16.6]]), sw * 2.2, CGH.stripe, 'ink', .5);
    inkLine(P([[3, -11.7], [2.1, -13.3], [.5, -15.2], [-1, -16.8], [-1.8, -17.4]]), sw * 1.3, SHL.gold, 'ink', .5);
    rs('neck');
    paint(P([[-.75, -17.9], [.75, -17.9], [.8, -16.7], [-.8, -16.7]]), { wash: col, ink: INK, sw: sw * .6 });
    inkLine(P([[-1.5, -17], [-.7, -16.1], [0, -15.85], [.7, -16.1], [1.5, -17]]), sw * 1.8, SHL.gold, 'ink', .6);
    paint(P([[0, -15.95], [.4, -15.55], [0, -14.95], [-.4, -15.55]]), { wash: '#C8324A', ink: INK, sw: sw * .4 });
    rs('mala');   // a long marigold mala
    {
      const m = Math.sin(T * 1.5) * .12, path = through(P([[-1.55, -17], [-2, -15.2], [-1.6, -13.2], [-.6 + m * .3, -11.8], [.4 + m, -11.7], [1.4 + m * .5, -13], [1.95, -15.1], [1.55, -17]]));
      for (let i = 0; i < path.length; i += Math.max(1, Math.floor(path.length / 22))) {
        const [bx, by] = path[i];
        paint(ellPts(bx, by, .36 * u, .32 * u, 10, u * .04), { wash: i % 3 ? CGH.marigold : CGH.marigoldDk, ink: INK, sw: sw * .3 });
      }
    }

    // ---- head
    push(); translate(hx * .45 * u, 0); headScale();
    if (o.htilt) { translate(0, -17.5 * u); rotate(o.htilt); translate(0, 17.5 * u); }
    rs('head');
    const head = ellPts(0, -19.8 * u, 2.8 * u, 2.75 * u, 30, J);
    paint(head, { wash: col, ink: null });
    paint(ellPts((-1 + hx) * u, -20.8 * u, 1.5 * u, .8 * u, 14, J * 2, -.2), { fill: lt, fillOp: 120, bleed: .2, tex: .85, border: .8, ink: null });
    paint(ellPts(0, -17.7 * u, 2 * u, .7 * u, 14, J), { fill: dk, fillOp: 60, bleed: .1, tex: .6, border: .5, ink: null });
    paint(head, { ink: INK, sw });
    rs('jhumka');
    for (const s of [-1, 1]) {
      push(); translate(s * 2.75 * u, -19 * u); rotate(Math.sin(T * 2.4 + s) * .12);
      inkLine([[0, 0], [0, .5 * u]], sw * .5, SHL.goldDk, 'inkfine', 0);
      paint(U([[-.5, 1.3], [0, .45], [.5, 1.3]], u), { wash: SHL.gold, fill: SHL.goldDk, fillOp: 50, ink: INK, sw: sw * .45, curv: .5 });
      pop();
    }
    rs('hairfront');
    paint(P([[-2.85, -18.6], [-3.15, -20.4], [-2.9, -21.6], [-2.2, -22.35], [-.6, -22.75], [0, -22.3], [.6, -22.75], [2.2, -22.35], [2.9, -21.6], [3.15, -20.4], [2.85, -18.6], [2.4, -20.4], [1.4, -21.5], [.15, -21.6], [0, -21.9], [-.15, -21.6], [-1.4, -21.5], [-2.4, -20.4]]),
      { wash: SHL.hair, ink: INK, sw: sw * .85, curv: .4 });
    inkLine(P([[-2.3, -21.5], [-1.3, -22.25], [-.3, -22.4]]), sw * .45, SHL.hairLt, 'inkfine', .5);
    rs('mukut');   // tall and tiered, as on the cover
    paint(P([[-2.15, -22.3], [2.15, -22.3], [2.05, -23.9], [1.55, -23.55], [1.4, -25.1], [.8, -24.75], [.55, -26.2], [0, -27.4], [-.55, -26.2], [-.8, -24.75], [-1.4, -25.1], [-1.55, -23.55], [-2.05, -23.9]]),
      { wash: SHL.gold, fill: SHL.goldDk, fillOp: 60, tex: .5, ink: INK, sw: sw * .6, curv: .12 });
    inkLine(P([[-2.05, -23.3], [2.05, -23.3]]), sw * .9, SHL.goldDk, 'inkfine', 0);
    inkLine(P([[-1.4, -24.6], [1.4, -24.6]]), sw * .7, SHL.goldDk, 'inkfine', 0);
    paint(ellPts(0, -25.4 * u, .3 * u, .38 * u, 8), { wash: '#C8324A', ink: INK, sw: sw * .35 });
    for (const s of [-1, 1]) { paint(ellPts(s * 1.15 * u, -24 * u, .18 * u, .2 * u, 6), { wash: '#3E9E5A', ink: null }); paint(ellPts(s * .5 * u, -26.1 * u, .1 * u, .1 * u, 6), { wash: SHL.goldLt, ink: null }); }
    rs('moonbell');
    if (mb > .01) {
      const k = backOut(mb), mg = clamp(o.moonGlow || 0);
      if (mg > .01) { glow(0, -22.85 * u, u * (1.6 + 3.5 * mg), '#FFE7A0', mg); glow(0, -22.85 * u, u * (.8 + 1.2 * mg), '#FFFFFF', mg * .6); }
      push(); translate(0, -22.85 * u); scale(k); moonBell(.95 * u, sw); pop();
    }

    push(); translate(hx * .8 * u, 0);
    rs('bindi');
    paint(ellPts(0, -20.75 * u, .17 * u, .26 * u, 8), { wash: SHL.bindi, ink: null });
    if (o.blush) for (const s of [-1, 1]) paint(ellPts(s * 1.75 * u, -18.7 * u, .65 * u, .35 * u, 14), { fill: PAL.rose, fillOp: 150 * clamp(o.blush), bleed: .2, tex: .4, ink: null });
    rs('eyes');
    const kinds = Array.isArray(o.eyes) ? o.eyes : o.eyes === 'wink' ? ['normal', 'closed'] : [o.eyes || 'normal', o.eyes || 'normal'];
    const own = k => ['normal', 'look', 'wide', 'closed', 'happy', 'angry', 'determined'].includes(k);
    if (kinds.every(own)) {
      const lx = (o.lookX || 0) * u * .2, ly = (o.lookY || 0) * u * .15;
      const blink = ((T * .9 + (o.seed || 0) * 1.7 + 2.2) % 3.4) < .12;
      [-1, 1].forEach((s, i) => {
        const k0 = (o.squint || 0) > .5 ? 'closed' : kinds[i], k = k0 === 'angry' || k0 === 'determined' ? 'normal' : k0;
        const b = clamp((s < 0 ? o.browL : o.browR) ?? o.brows ?? (k0 === 'angry' ? -1 : k0 === 'determined' ? -.55 : 0), -1, 1);
        const ex = s * 1.1 * u, ey = -19.7 * u, wide = k === 'wide', closed = k === 'closed' || k === 'happy' || blink;
        const up = Math.max(0, b) * .45, bi = -20.6 - .38 * b - up * .4, bo = -20.65 + (b < 0 ? .3 * b : -.25 * b) - up, bm = (bi + bo) / 2 - .12 - up * .9;   // a raised brow lifts and arches
        inkLine(P([[s * .5, bi], [s * 1.1, bm], [s * 1.75, bo]]), sw * (b < 0 ? .6 + .65 * -b : .6), SHL.hair, b < 0 ? 'ink' : 'inkfine', .5);
        if (closed) {
          const c = k === 'happy' ? -.25 : .2;
          inkLine([[ex - .55 * u, ey], [ex, ey + c * u], [ex + .55 * u, ey]], sw * 1.1, INK, 'ink', .5);
          inkLine([[ex + s * .5 * u, ey], [ex + s * .75 * u, ey - .15 * u]], sw * .6, INK, 'inkfine', 0);
          return;
        }
        const rx = (wide ? .62 : .55) * u, ry = (wide ? .58 : .4) * u + Math.max(0, b) * .08 * u;
        paint(ellPts(ex, ey, rx, ry, 16), { wash: SHL.white, ink: null });
        paint(ellPts(ex + lx, ey + ly, .3 * u, .36 * u, 12), { wash: SHL.eye, ink: null });
        paint(ellPts(ex + lx - .1 * u, ey + ly - .12 * u, .1 * u, .11 * u, 8), { wash: SHL.white, ink: null });
        const kA = clamp(-b);
        if (kA > .05) {
          const A = [ex - s * rx * 1.4, ey - ry * 1.6], Bp = [ex - s * rx * 1.4, ey - ry * (1 - 1.15 * kA)], C = [ex + s * rx * 1.4, ey - ry * (1 - .1 * kA)], D = [ex + s * rx * 1.4, ey - ry * 1.6];
          paint([A, Bp, C, D], { wash: col, ink: null });
          inkLine([[Bp[0], Bp[1] + ry * .05], [ex, (Bp[1] + C[1]) / 2], [C[0], C[1]]], sw * 1.6, INK, 'ink', .5);
          return;
        }
        inkLine([[ex - rx * 1.05, ey + ry * .1], [ex - rx * .3, ey - ry * 1.05], [ex + rx * .5, ey - ry * 1], [ex + rx * 1.15, ey - ry * .3], [ex + s * rx * 1.45, ey - ry * .85]].map(([a, bb]) => [s < 0 ? 2 * ex - a : a, bb]), sw * 1.35, INK, 'ink', .5);
      });
    } else { push(); translate(0, -19.7 * u); scale(.44); translate(0, 6 * u); eyes(u, o, sw / .44 * .85, [-1, 1], 0); pop(); }
    rs('nose');
    inkLine(P([[.02, -19.2], [-.08, -18.85], [.12, -18.75]]), sw * .5, SHL.skinDk, 'inkfine', .5);
    rs('mouth');
    if (!o.mouth || o.mouth === 'smile') {
      paint(P([[-.5, -18.3], [0, -18.05], [.5, -18.3], [0, -18.18]]), { wash: SHL.lip, ink: null, curv: .5 });
      inkLine(P([[-.55, -18.32], [0, -18.02], [.55, -18.32]]), sw * .6, INK, 'inkfine', .6);
    } else if (o.mouth === 'flat') {
      inkLine(P([[-.5, -18.15], [0, -18.12], [.5, -18.15]]), sw * .7, INK, 'inkfine', .3);
    } else if (o.mouth === 'teeth') {
      paint(P([[-.7, -18.05], [-.55, -18.5], [0, -18.62], [.55, -18.5], [.7, -18.05], [0, -17.95]]), { wash: SHL.white, ink: INK, sw: sw * .7, curv: .3 });
      for (const tx of [-.3, 0, .3]) inkLine(P([[tx, -18.55], [tx, -18.03]]), sw * .35, SHL.skinDk, 'inkfine', 0);
    } else { push(); translate(0, -18.3 * u); scale(.36); translate(0, 4.3 * u); mouth(u, o.mouth, sw / .36 * .8); pop(); }
    pop();
    pop();

    // ---- the front arms, last: the bell (screen-left) and abhaya, the raised open palm (screen-right)
    for (const s of [-1, 1]) {
      rs('arm' + s);
      const [sh, el, ha] = chandraghantaArm(o, s), hook = s < 0 ? o.armL : o.armR;
      paint(ribbon(P([sh, el, ha]), 1.05 * u, .75 * u), { wash: col, fill: dk, fillOp: 40, tex: .5, ink: INK, sw: sw * .8 });
      const band = (a, b, k, c, w) => { const d = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, nx = -(b[1] - a[1]) / d * .44, ny = (b[0] - a[0]) / d * .44, bx = lerp(a[0], b[0], k), by = lerp(a[1], b[1], k); inkLine(P([[bx - nx, by - ny], [bx + nx, by + ny]]), sw * w, c, 'ink', 0); };
      band(sh, el, .65, SHL.gold, 1.5);
      for (const k of [.55, .66, .77, .88]) band(el, ha, k, SHL.gold, 1.05);
      push(); translate(ha[0] * u, ha[1] * u);
      rs('prop' + s);
      if (s < 0 && o.bell !== false) ghanta(u, sw, (o.ring || 0) * .55 + Math.sin(T * 1.4) * .04);
      rs('hand' + s);
      if (s > 0 && o.abhaya !== false) {   // the open palm, fingers up, a red alta dot
        paint(U([[-.55, .55], [-.62, -.35], [-.5, -1.35], [-.28, -1.45], [-.2, -.75], [-.12, -1.6], [.1, -1.62], [.15, -.8], [.25, -1.5], [.45, -1.45], [.47, -.7], [.62, -1.1], [.82, -1], [.62, .1], [.45, .6]], u), { wash: col, ink: INK, sw: sw * .6, curv: .25 });
        paint(ellPts(0, -.1 * u, .18 * u, .18 * u, 8), { wash: '#D2283A', ink: null });
      } else paint(ellPts(0, 0, .6 * u, .55 * u, 14, J), { wash: col, ink: INK, sw: sw * .7 });
      if (hook) hook(u, sw);
      pop();
    }
  });
  pop();

  if (o.emote) {
    rs('emote');
    const top = EMOTE_TOP.includes(o.emote), dir = o.flip ? -1 : 1;
    emote(o.emote, top ? x : x + dir * 5 * u, y + dy + (top ? -31 : -23) * u * (1 - sq), u * 1.1, o.emoteK ?? 1, o.emoteAge ?? T);
  }
  rs('after');
}

// Model sheet: studio.html?loop=chandraghanta, or node render.mjs --loop=chandraghanta --sheet=0.5 --cols=1 --w=720
(() => {
  LOOPS.chandraghanta = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: '#C9DDD2', ink: null });
    const CW = 540, CH = 640, cell = i => [(i % 2) * CW, Math.floor(i / 2) * CH];
    const bg = (i, c) => { const [cx, cy] = cell(i); paint(rectPts(cx, cy, CW, CH), { wash: c, ink: null }); };
    bg(1, '#4A3F78'); bg(4, '#4A3F78');
    const poses = [
      ['gentle', 17, { aura: .4 }],
      ['determined', 17, { arms: .5, moonGlow: .8, aura: .8 }],
      ['serene', 17, { arms: 0, moonBell: .6 }],
      ['gentle', 17, { browR: 1, lookX: .6, ring: Math.sin(t * 6) }],
      ['determined', 17, { aura: 1, ring: .8, moonGlow: 1 }],
      ['gentle', 46, { hx: .1, moonGlow: .5 }],
    ];
    poses.forEach(([name, u, over], i) => {
      const [cx, cy] = cell(i), gx = cx + CW / 2, gy = i === 5 ? 2560 : cy + CH - 50;
      chandraghanta(gx, gy, u, { ...feel(name, t + i * .3, { seed: i }), ...SHL_SKIN, noShadow: i === 5, ...over });
    });
  };
  LOOPS.chandraghanta.len = 4;
})();
